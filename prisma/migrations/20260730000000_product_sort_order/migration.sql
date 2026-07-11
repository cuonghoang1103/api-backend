-- Manual display order for products (admin-sortable). Lower = shown first.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "idx_products_sort_order" ON "products"("sort_order");
