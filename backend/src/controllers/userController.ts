import { Request, Response } from 'express';
import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        role: true,
      }
    });

    const totalUsers = await prisma.user.count();

    res.json({
      data: users,
      total: totalUsers,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / Number(limit)),
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /users/:id - ดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        role: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /users - เพิ่มผู้ใช้ใหม่
export const addUser = async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body;
  try {
    const roleExists = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!roleExists) {
      return res.status(400).json({ 
        message: `Role with ID ${roleId} does not exist` 
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ใช้ 10 รอบในการแฮช

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
      include: {
        role: true
      }
    });

    res.status(201).json(user);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /users/:id - แก้ไขข้อมูลผู้ใช้
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, roleId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password, roleId },
    });
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /users/:id - ลบข้อมูลผู้ใช้
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};