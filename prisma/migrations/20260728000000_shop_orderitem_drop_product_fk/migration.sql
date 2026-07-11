-- Order items are denormalized snapshots (productName, productImage, price,
-- fileUrl) of the product at purchase time. Drop the live FK to products.name
-- so a product can be renamed or DELETED without being blocked by / cascading
-- into historical order rows. Fulfillment matches products by name separately.
ALTER TABLE "shop_order_items" DROP CONSTRAINT IF EXISTS "shop_order_items_product_name_fkey";
