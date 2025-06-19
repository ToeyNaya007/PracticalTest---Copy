import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// ขยาย interface สำหรับ Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userEmail: string;
        name: string;
        roleId: number;
        roleName: string;
      };
    }
  }
}

// Middleware สำหรับตรวจสอบ JWT Token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      userId: decoded.userId,
      userEmail: decoded.userEmail,
      name: decoded.name,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

// Middleware สำหรับตรวจสอบสิทธิ์ Admin (roleId = 1)
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.roleId !== 1) {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.',
      currentRole: req.user.roleId 
    });
  }

  next();
};

// Middleware สำหรับตรวจสอบสิทธิ์ Moderator หรือ Admin (roleId = 1 or 3)
export const requireModeratorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.roleId !== 1 && req.user.roleId !== 3) {
    return res.status(403).json({ 
      message: 'Access denied. Moderator or Admin privileges required.',
      currentRole: req.user.roleId 
    });
  }

  next();
};

// Middleware สำหรับตรวจสอบว่าเป็นเจ้าของข้อมูลหรือ Admin
export const requireOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const targetUserId = req.params.userId || req.body.userId;
  
  if (req.user.roleId === 1 || req.user.userId === targetUserId) {
    next();
  } else {
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own data or be an admin.',
      currentUserId: req.user.userId,
      targetUserId: targetUserId
    });
  }
};