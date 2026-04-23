import { Router, Request, Response } from 'express';
import { pool } from '../index';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    const isHealthy = !!result.rows.length;

    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      database: isHealthy,
      uptime: process.uptime(),
    });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      database: false,
    });
  }
});

export default router;
