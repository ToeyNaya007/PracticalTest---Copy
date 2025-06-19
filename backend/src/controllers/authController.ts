import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, roleId = 2 } = req.body; // Default roleId = 2 สำหรับ user ทั่วไป

  try {
    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: parseInt(roleId),
      },
      include: {
        role: {
          include: {
            permissions: {
              select: {
                permission: true,  // ดึงข้อมูลจาก permission (เช่น add, edit, delete)
              }
            }
          }
        }
      }
    });

    // สร้าง JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        userEmail: user.email,
        name: user.name,
        roleId: user.roleId,
        permissions: user.role.permissions.map(p => p.permission.name)  // เพิ่ม permissions ลงใน JWT
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        permissions: user.role.permissions.map(p => p.permission.name)  // ส่ง permissions กลับไปให้กับ client
      }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // หา user โดย email และรวมข้อมูล role พร้อม permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              select: {
                permission: true,  // ดึงข้อมูลจาก permission (เช่น add, edit, delete)
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        userEmail: user.email,
        name: user.name,
        roleId: user.roleId,
        roleName: user.role.name,
        permissions: user.role.permissions.map(p => p.permission.name)  // เพิ่ม permissions ลงใน JWT
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
        permissions: user.role.permissions.map(p => p.permission.name)  // ส่ง permissions กลับไปให้กับ client
      }
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
