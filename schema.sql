-- Kids table
CREATE TABLE IF NOT EXISTS kids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  color TEXT NOT NULL,
  balance INTEGER DEFAULT 0
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kid_id INTEGER NOT NULL,
  points INTEGER NOT NULL,
  tag TEXT NOT NULL,
  note TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kid_id) REFERENCES kids(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  is_positive INTEGER DEFAULT 1
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- Default kids (safe to re-run: INSERT OR IGNORE)
INSERT OR IGNORE INTO kids (id, name, initials, color, balance) VALUES (1, 'Kid 1', 'K1', '#FF6B6B', 0);
INSERT OR IGNORE INTO kids (id, name, initials, color, balance) VALUES (2, 'Kid 2', 'K2', '#4ECDC4', 0);

-- Default tags (safe to re-run: INSERT OR IGNORE)
INSERT OR IGNORE INTO tags (name, color, is_positive) VALUES ('TV', '#9B59B6', 0);
INSERT OR IGNORE INTO tags (name, color, is_positive) VALUES ('Snacks', '#E67E22', 0);
INSERT OR IGNORE INTO tags (name, color, is_positive) VALUES ('Chores', '#27AE60', 1);
INSERT OR IGNORE INTO tags (name, color, is_positive) VALUES ('Finish Food', '#3498DB', 1);
INSERT OR IGNORE INTO tags (name, color, is_positive) VALUES ('Clean Up', '#1ABC9C', 1);
