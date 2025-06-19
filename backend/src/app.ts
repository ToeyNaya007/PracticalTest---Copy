import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateJWT } from './middleware/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', permissionRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.get('/me', authenticateJWT as express.RequestHandler, (req, res) => {
    res.json({ message: 'Welcome to your profile', user: req.user });
  });

export default app;
