-- Product: digital deliverable + denormalized rating aggregates
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "digital_content" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "rating_count" INTEGER NOT NULL DEFAULT 0;

-- ShopOrder: order type + shipping / fulfillment lifecycle
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "order_type" VARCHAR(20) NOT NULL DEFAULT 'DIGITAL';
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "fulfillment_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING';
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_province" VARCHAR(120);
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "tracking_number" VARCHAR(120);
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipped_at" TIMESTAMP(3);
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "delivered_at" TIMESTAMP(3);

-- ShopOrderItem: type + digital deliverable snapshot
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "product_type" VARCHAR(20);
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "digital_content" TEXT;

-- ProductReview
CREATE TABLE IF NOT EXISTS "product_reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "is_approved" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "uk_product_review_user" ON "product_reviews"("product_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_product_review_product" ON "product_reviews"("product_id");
