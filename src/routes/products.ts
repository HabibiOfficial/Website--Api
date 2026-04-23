import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../index';
import { verifyApiKey, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/products - List all products with pagination
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get product by ID
router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create new product (requires API key)
router.post('/products', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price) {
      res.status(400).json({
        success: false,
        message: 'name and price are required',
      });
      return;
    }

    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || null, price, stock || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update product (requires API key)
router.put('/products/:id', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const checkResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    const updateData = {
      name: name !== undefined ? name : checkResult.rows[0].name,
      description: description !== undefined ? description : checkResult.rows[0].description,
      price: price !== undefined ? price : checkResult.rows[0].price,
      stock: stock !== undefined ? stock : checkResult.rows[0].stock,
    };

    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [updateData.name, updateData.description, updateData.price, updateData.stock, id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete product (requires API key)
router.delete('/products/:id', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
