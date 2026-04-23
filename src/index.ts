import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import productRoutes from './routes/products';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/', healthRoutes);
app.use('/api', productRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
