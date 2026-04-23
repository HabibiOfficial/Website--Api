-- Create Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Insert sample data
INSERT INTO products (name, description, price, stock) VALUES
  ('Laptop', 'High-performance laptop for development', 999.99, 5),
  ('Mouse', 'Wireless gaming mouse', 49.99, 20),
  ('Keyboard', 'Mechanical RGB keyboard', 149.99, 15),
  ('Monitor', '4K Ultra HD monitor', 399.99, 8),
  ('Headphones', 'Noise-cancelling headphones', 199.99, 12)
ON CONFLICT DO NOTHING;
