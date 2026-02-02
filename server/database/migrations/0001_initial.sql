-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL,
  google_id TEXT UNIQUE,
  line_id TEXT UNIQUE,
  free_session_used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Auth sessions (login sessions)
CREATE TABLE auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Trip sessions (service usage sessions)
CREATE TABLE trip_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'input',
  regeneration_count INTEGER NOT NULL DEFAULT 0,
  payment_id TEXT,
  is_free INTEGER NOT NULL DEFAULT 0,
  origin_lat REAL,
  origin_lng REAL,
  origin_address TEXT,
  budget_max INTEGER,
  time_start TEXT,
  time_end TEXT,
  transport_mode TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Generated plans (2-3 per session per generation round)
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  trip_session_id TEXT NOT NULL REFERENCES trip_sessions(id) ON DELETE CASCADE,
  generation_round INTEGER NOT NULL DEFAULT 1,
  plan_index INTEGER NOT NULL,
  is_selected INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  summary TEXT,
  total_budget INTEGER,
  plan_data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reschedule proposals
CREATE TABLE reschedules (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  trip_session_id TEXT NOT NULL REFERENCES trip_sessions(id) ON DELETE CASCADE,
  trigger_lat REAL NOT NULL,
  trigger_lng REAL NOT NULL,
  trigger_time TEXT NOT NULL,
  new_schedule_data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Payments
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_session_id TEXT NOT NULL REFERENCES trip_sessions(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'jpy',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_token ON auth_sessions(token_hash);
CREATE INDEX idx_trip_sessions_user ON trip_sessions(user_id);
CREATE INDEX idx_plans_session ON plans(trip_session_id);
CREATE INDEX idx_reschedules_plan ON reschedules(plan_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_session ON payments(trip_session_id);
