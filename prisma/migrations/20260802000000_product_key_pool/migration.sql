-- Digital key pool: a pool of unique deliverables per product, one assigned to
-- each buyer at fulfillment. Idempotent so it is a no-op if applied by hand.
CREATE TABLE IF NOT EXISTS product_keys (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  order_item_id INTEGER,
  buyer_user_id INTEGER,
  assigned_at   TIMESTAMP(3),
  created_at    TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_keys_product_status ON product_keys(product_id, status);
