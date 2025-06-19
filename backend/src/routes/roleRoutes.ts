import express from 'express';
import { addRole,getRoles } from '../controllers/roleController';

const router = express.Router();

router.get('/roles', getRoles); // ดึงข้อมูลบทบาททั้งหมด (GET /role)
router.post('/roles', addRole); // เพิ่มบทบาทใหม่ (POST /addRole)

export default router;
