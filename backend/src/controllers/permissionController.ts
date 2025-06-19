import { Request, Response } from 'express';
import { prisma } from '../config/db';

// GET /permissions - ดึงข้อมูล permission ทั้งหมด
export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        rolePermissions: {
          include: {
            role: true,  // ดึงข้อมูล role ที่เกี่ยวข้อง
          },
        },
      },
    });
    res.json(permissions);
  } catch (err) {
    console.error('Error fetching permissions:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /permissions - เพิ่ม permission ใหม่
export const addPermission = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const permission = await prisma.permission.create({
      data: { name }
    });
    res.status(201).json(permission);
  } catch (err) {
    console.error('Error adding permission:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
