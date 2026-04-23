import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  apiKey?: string;
  apiKeyId?: string;
}

// In-memory API key storage (replace with database in production)
interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
  rateLimit?: number; // requests per minute
}

export class ApiKeyManager {
  private apiKeys: Map<string, ApiKeyRecord> = new Map();
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    // Initialize with default API key from environment
    if (process.env.API_KEY) {
      this.apiKeys.set(process.env.API_KEY, {
        id: 'default',
        key: process.env.API_KEY,
        name: 'Default API Key',
        createdAt: new Date(),
        isActive: true,
        rateLimit: 60, // 60 requests per minute
      });
    }
  }

  generateKey(): string {
    return `naze_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }

  createKey(name: string, rateLimit: number = 60): { id: string; key: string; name: string } {
    const key = this.generateKey();
    const id = `key_${Date.now()}`;

    this.apiKeys.set(key, {
      id,
      key,
      name,
      createdAt: new Date(),
      isActive: true,
      rateLimit,
    });

    return { id, key, name };
  }

  getKeyInfo(apiKey: string): ApiKeyRecord | null {
    return this.apiKeys.get(apiKey) || null;
  }

  revokeKey(apiKey: string): boolean {
    const keyRecord = this.apiKeys.get(apiKey);\n    if (keyRecord) {
      keyRecord.isActive = false;
      return true;
    }
    return false;
  }

  listKeys(): ApiKeyRecord[] {
    return Array.from(this.apiKeys.values());
  }

  checkRateLimit(apiKey: string): boolean {
    const keyRecord = this.apiKeys.get(apiKey);
    if (!keyRecord) return false;

    const rateLimit = keyRecord.rateLimit || 60;
    const now = Date.now();
    const counter = this.requestCounts.get(apiKey);

    if (!counter || counter.resetTime < now) {
      // Reset counter
      this.requestCounts.set(apiKey, {
        count: 1,
        resetTime: now + 60000, // 1 minute
      });
      return true;
    }

    if (counter.count >= rateLimit) {
      return false;
    }

    counter.count++;
    return true;
  }

  updateLastUsed(apiKey: string): void {
    const keyRecord = this.apiKeys.get(apiKey);
    if (keyRecord) {
      keyRecord.lastUsed = new Date();
    }
  }
}

export const apiKeyManager = new ApiKeyManager();

export function verifyApiKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] as string;

  // Check if API key is provided
  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key is required',
      code: 'MISSING_API_KEY',
    });
    return;
  }

  // Get key info
  const keyInfo = apiKeyManager.getKeyInfo(apiKey);

  if (!keyInfo) {
    res.status(403).json({
      success: false,
      message: 'Invalid API key',
      code: 'INVALID_API_KEY',
    });
    return;
  }

  // Check if key is active
  if (!keyInfo.isActive) {
    res.status(403).json({
      success: false,
      message: 'API key has been revoked',
      code: 'REVOKED_API_KEY',
    });
    return;
  }

  // Check rate limit
  if (!apiKeyManager.checkRateLimit(apiKey)) {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 60,
    });
    return;
  }

  // Update last used
  apiKeyManager.updateLastUsed(apiKey);

  // Attach to request
  req.apiKey = apiKey;
  req.apiKeyId = keyInfo.id;

  next();
}

// Middleware for optional API key (logs but doesn't fail)
export function optionalApiKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (apiKey) {
    const keyInfo = apiKeyManager.getKeyInfo(apiKey);
    if (keyInfo && keyInfo.isActive) {
      apiKeyManager.updateLastUsed(apiKey);
      req.apiKey = apiKey;
      req.apiKeyId = keyInfo.id;
    }
  }

  next();
}
