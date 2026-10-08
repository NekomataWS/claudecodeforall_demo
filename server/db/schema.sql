CREATE TABLE IF NOT EXISTS orders (
  id          TEXT    PRIMARY KEY,
  invoice_no  TEXT    UNIQUE NOT NULL,
  items       TEXT    NOT NULL,     -- JSON: [{sku, name, qty, unitPrice}]
  amount      INTEGER NOT NULL,     -- total in cents
  currency    TEXT    NOT NULL DEFAULT 'USD',
  status      TEXT    NOT NULL DEFAULT 'PENDING',
  created_at  TEXT    NOT NULL,
  updated_at  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id                      TEXT PRIMARY KEY,
  order_id                TEXT NOT NULL REFERENCES orders(id),
  provider                TEXT NOT NULL DEFAULT '2c2p',
  provider_transaction_id TEXT,
  status                  TEXT NOT NULL,
  created_at              TEXT NOT NULL,
  updated_at              TEXT NOT NULL
);

-- No secrets or card data stored here
CREATE TABLE IF NOT EXISTS payment_events (
  id                  TEXT PRIMARY KEY,
  order_id            TEXT NOT NULL,
  event_type          TEXT NOT NULL,
  received_at         TEXT NOT NULL,
  verification_result TEXT,
  payload             TEXT          -- JSON, sanitised — no secrets
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id      ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON payment_events(order_id);
