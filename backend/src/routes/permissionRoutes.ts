import express from 'express';
import { getPermissions,addPermission } from '../controllers/permissionController';

const router = express.Router();

router.get('/permissions', getPermissions); // ดึงข้อมูลบทบาททั้งหมด (GET /role)
router.post('/permissions', addPermission); // เพิ่มบทบาทใหม่ (POST /addRole)

export default router;
