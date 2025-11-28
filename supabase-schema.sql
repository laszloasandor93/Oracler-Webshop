-- Supabase Database Schema for Orders
-- Run this SQL in your Supabase SQL Editor to create the orders table

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  shape TEXT NOT NULL CHECK (shape IN ('rectangle', 'circle')),
  size JSONB NOT NULL,
  lamination BOOLEAN NOT NULL DEFAULT false,
  lamination_type TEXT CHECK (lamination_type IN ('gloss', 'matt')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);

-- Create index on customer_email for customer order history
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Create index on created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Example policy to allow authenticated users to read their own orders
-- CREATE POLICY "Users can view their own orders" ON orders
--     FOR SELECT USING (auth.uid()::text = customer_email);

