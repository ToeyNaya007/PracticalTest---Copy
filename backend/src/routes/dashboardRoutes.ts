import express from 'express';
import { getDashboardStats,getLastCreatedUsers,getUserGrowthStats } from '../controllers/dashboardController';
import { get } from 'http';

const router = express.Router();

router.get('/dashboard-stats', getDashboardStats);
router.get('/dashboard-LastCreatedUsers', getLastCreatedUsers);
router.get('/dashboard-userGrowth', getUserGrowthStats);

export default router;