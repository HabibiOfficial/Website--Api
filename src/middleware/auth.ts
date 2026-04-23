import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  apiKey?: string;
}

export function verifyApiKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key is required',
    });
    return;
  }

  if (apiKey !== process.env.API_KEY) {
    res.status(403).json({
      success: false,
      message: 'Invalid API key',
    });
    return;
  }

  req.apiKey = apiKey;
  next();
}
