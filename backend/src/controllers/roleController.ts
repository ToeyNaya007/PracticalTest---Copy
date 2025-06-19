import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,  // ดึงข้อมูล permission ที่เกี่ยวข้อง
          },
        },
        _count: {
          select: {
            users: true,  // นับจำนวนผู้ใช้ในแต่ละ role
          },
        },
      },
    });

    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// POST /roles - เพิ่ม role ใหม่
export const addRole = async (req: Request, res: Response) => {
  const { name, permissions } = req.body; // รับ permissions ด้วย
  try {
    // สร้าง role ใหม่
    const role = await prisma.role.create({
      data: {
        name,
        permissions: {
          create: permissions.map((permissionId: number) => ({
            permission: { connect: { id: permissionId } }, // เชื่อมโยงกับ permission ที่เลือก
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true, // ดึงข้อมูล permission ที่เชื่อมโยง
          },
        },
      },
    });
    res.status(201).json(role); // ส่งกลับข้อมูล role ใหม่
  } catch (err) {
    console.error('Error adding role:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

