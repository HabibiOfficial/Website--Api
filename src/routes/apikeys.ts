import { Router, Request, Response, NextFunction } from 'express';
import { verifyApiKey, AuthRequest, apiKeyManager } from '../middleware/auth';

const router = Router();

// List all API keys
// GET /api/apikeys
router.get('/', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keys = apiKeyManager.listKeys();
    const maskedKeys = keys.map(key => ({
      id: key.id,
      name: key.name,
      key: `${key.key.substring(0, 10)}...`,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      isActive: key.isActive,
      rateLimit: key.rateLimit,
    }));

    res.json({
      success: true,
      data: maskedKeys,
      total: maskedKeys.length,
    });
  } catch (err) {
    next(err);
  }
});

// Create new API key
// POST /api/apikeys
router.post('/', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name = 'New API Key', rateLimit = 60 } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'API key name is required',
      });
      return;
    }

    const newKey = apiKeyManager.createKey(name, rateLimit);

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: {
        id: newKey.id,
        key: newKey.key,
        name: newKey.name,
        rateLimit: rateLimit,
        createdAt: new Date().toISOString(),
        warning: 'Save this key securely. You will not be able to see it again!',
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get API key info
// GET /api/apikeys/:keyId
router.get('/:keyId', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keys = apiKeyManager.listKeys();
    const key = keys.find(k => k.id === req.params.keyId);

    if (!key) {
      res.status(404).json({
        success: false,
        message: 'API key not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: key.id,
        name: key.name,
        key: `${key.key.substring(0, 10)}...`,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        isActive: key.isActive,
        rateLimit: key.rateLimit,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Revoke API key
// DELETE /api/apikeys/:keyId
router.delete('/:keyId', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keys = apiKeyManager.listKeys();
    const key = keys.find(k => k.id === req.params.keyId);

    if (!key) {
      res.status(404).json({
        success: false,
        message: 'API key not found',
      });
      return;
    }

    const revoked = apiKeyManager.revokeKey(key.key);

    if (revoked) {
      res.json({
        success: true,
        message: 'API key revoked successfully',
        data: {
          id: key.id,
          name: key.name,
          revokedAt: new Date().toISOString(),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to revoke API key',
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
