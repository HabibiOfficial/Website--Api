import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[Error] ${status} - ${message}`, err);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
}
