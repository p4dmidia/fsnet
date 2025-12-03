
CREATE TABLE affiliates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  commission_rate REAL DEFAULT 10.0,
  total_sales INTEGER DEFAULT 0,
  total_commission REAL DEFAULT 0.0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  plan_name TEXT NOT NULL,
  plan_value REAL NOT NULL,
  commission_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  sale_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_sales_affiliate_id ON sales(affiliate_id);
CREATE INDEX idx_sales_status ON sales(status);
