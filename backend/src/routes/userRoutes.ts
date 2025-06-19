import express from 'express';
import { getUsers, addUser, updateUser, deleteUser, getUserById } from '../controllers/userController';

const router = express.Router();

router.get('/users', getUsers); // GET /users - ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users/:id', getUserById as express.RequestHandler); // GET /users ดึงข้อมูลผู้ชายตามไอดี
router.post('/users', addUser as express.RequestHandler); // POST /users - เพิ่มผู้ใช้ใหม่
router.put('/users/:id', updateUser); // PUT /users/:id - แก้ไขข้อมูลผู้ใช้
router.delete('/users/:id', deleteUser); // DELETE /users/:id - ลบข้อมูลผู้ใช้

export default router;
