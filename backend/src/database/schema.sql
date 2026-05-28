CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(32) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_phone (phone),
  INDEX idx_customers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(80) UNIQUE,
  name VARCHAR(180) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(80) NOT NULL DEFAULT 'pacotes',
  icon VARCHAR(32) DEFAULT 'PACK',
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image VARCHAR(600),
  image_url VARCHAR(600),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_category (category),
  INDEX idx_products_stock (stock),
  FULLTEXT INDEX ft_products_search (name, description, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  type ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  usage_limit INT NULL,
  used_count INT NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  expires_at DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupons_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  coupon_id INT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_orders_status (status),
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(180) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  line_total DECIMAL(10,2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  product_id INT NOT NULL,
  session_id VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_favorites_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_favorite_customer_product (customer_id, product_id),
  INDEX idx_favorites_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  order_id INT NULL,
  type ENUM('in', 'out', 'adjustment') NOT NULL,
  quantity INT NOT NULL,
  reason VARCHAR(180) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stock_movements_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_stock_movements_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_stock_movements_product (product_id),
  INDEX idx_stock_movements_order (order_id),
  INDEX idx_stock_movements_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
