-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Seed sample products
INSERT INTO products (name, description, price, image_url, stock_quantity) VALUES
('Premium Headphones', 'High-quality noise-canceling wireless headphones.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 50),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard with tactile switches.', 89.99, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800', 30),
('Smart Watch', 'Feature-rich smartwatch with heart rate monitoring.', 129.50, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 40),
('Minimalist Wallet', 'Sleek leather wallet for modern essentials.', 25.00, 'https://images.unsplash.com/photo-1627123430985-71d464a0b89f?w=800', 100),
('Wireless Mouse', 'Ergonomic wireless mouse with precision sensor.', 45.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 75);
