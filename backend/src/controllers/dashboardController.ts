import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // ดึงจำนวนทั้งหมดของผู้ใช้
    const totalUsers = await prisma.user.count();

    // ดึงจำนวนผู้ใช้ที่สมัครใหม่ในเดือนล่าสุด
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // เดือนที่แล้ว
        }
      }
    });

    // คำนวณอัตราการเติบโต (Growth rate) ของเดือนนี้เทียบกับทั้งหมด
    const growthRate = Math.floor((newUsers / totalUsers) * 100); // คำนวณอัตราการเติบโตเป็นเปอร์เซ็นต์และแปลงเป็นจำนวนเต็ม

    // ดึงจำนวนผู้ใช้ที่เป็น Admin ในเดือนนี้
    const totalAdmins = await prisma.user.count({
      where: {
        role: {
          name: 'admin', // สมมุติว่า role ของ admin คือ "admin"
        },
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // เดือนนี้
        }
      }
    });

    // ดึงจำนวนผู้ใช้ที่เป็น User ในเดือนนี้
    const totalUsersOnly = await prisma.user.count({
      where: {
        role: {
          name: 'user', // สมมุติว่า role ของ user คือ "user"
        },
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // เดือนนี้
        }
      }
    });

    // ดึงจำนวนผู้ใช้ที่เป็น Admin ในเดือนที่แล้ว
    const adminsLastMonth = await prisma.user.count({
      where: {
        role: {
          name: 'admin',
        },
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 2)), // เดือนที่แล้ว
          lt: new Date(new Date().setMonth(new Date().getMonth() - 1)), // ถึงเดือนก่อนหน้านั้น
        }
      }
    });

    // ดึงจำนวนผู้ใช้ที่เป็น User ในเดือนที่แล้ว
    const usersLastMonth = await prisma.user.count({
      where: {
        role: {
          name: 'user',
        },
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 2)), // เดือนที่แล้ว
          lt: new Date(new Date().setMonth(new Date().getMonth() - 1)), // ถึงเดือนก่อนหน้านั้น
        }
      }
    });

    // คำนวณอัตราการเติบโตของ admin ในเดือนนี้เมื่อเทียบกับเดือนที่แล้ว
    const adminGrowthRate = adminsLastMonth > 0 ? Math.floor(((totalAdmins - adminsLastMonth) / adminsLastMonth) * 100) : 0;

    // คำนวณอัตราการเติบโตของ user ในเดือนนี้เมื่อเทียบกับเดือนที่แล้ว
    const userGrowthRate = usersLastMonth > 0 ? Math.floor(((totalUsersOnly - usersLastMonth) / usersLastMonth) * 100) : 0;

    // ส่งข้อมูลกลับ
    res.json({
      totalUsers,
      newUsers,
      growthRate,
      totalAdmins,
      totalUsersOnly,
      adminGrowthRate,
      userGrowthRate
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLastCreatedUsers = async (req: Request, res: Response) => {
    try {
        // ดึงข้อมูลผู้ใช้ล่าสุด 6 คน
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc', // เรียงลำดับจากใหม่สุด
            },
            take: 6, // จำกัดผลลัพธ์ 6 คน
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        });

        res.json(users);
    } catch (err) {
        console.error('Error fetching last created users:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUserGrowthStats = async (req: Request, res: Response) => {
    try {
      // สร้างเดือนที่ผ่านมาและเดือนปัจจุบัน
      const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      const twoMonthsAgoStart = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
      const threeMonthsAgoStart = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
  
      // ดึงจำนวนผู้ใช้ใหม่ในเดือนต่างๆ
      const currentMonthUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: currentMonthStart, // เดือนนี้
          }
        }
      });
  
      const lastMonthUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart, // เดือนที่แล้ว
            lt: currentMonthStart, // ก่อนเดือนนี้
          }
        }
      });
  
      const twoMonthsAgoUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: twoMonthsAgoStart, // เดือนที่แล้ว
            lt: lastMonthStart, // ก่อนเดือนที่แล้ว
          }
        }
      });
  
      const threeMonthsAgoUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: threeMonthsAgoStart, // เดือนที่แล้ว
            lt: twoMonthsAgoStart, // ก่อนเดือนที่แล้ว
          }
        }
      });
  
      // ส่งข้อมูลกลับ
      res.json({
        currentMonthUsers,
        lastMonthUsers,
        twoMonthsAgoUsers,
        threeMonthsAgoUsers,
      });
    } catch (err) {
      console.error('Error fetching user growth stats:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
