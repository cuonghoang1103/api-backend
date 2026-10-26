-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Hà Nội',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "customer_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "order_id" BIGINT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" TEXT NOT NULL,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "attrs" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "product_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "product_id" BIGINT NOT NULL,
    "change" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "order_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "review_product_id_customer_id_key" ON "review"("product_id", "customer_id");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


-- ── Added by hand (Lab 9 · C2): what `migrate diff` cannot see ─────────────────────────────
-- Prisma does not model CHECK constraints (db pull warned about all 11), and it writes SERIAL
-- where CT Shop uses GENERATED ALWAYS AS IDENTITY (edited above). Without these lines, a database
-- rebuilt from the migrations (CI, a new developer, a disaster) would accept stock = -5.
ALTER TABLE "customer" ADD CONSTRAINT "customer_email_check" CHECK (email = lower(email) AND email LIKE '%_@_%.__%');
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_qty_check" CHECK (qty > 0);
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_unit_price_check" CHECK (unit_price > 0);
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_check" CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled'));
ALTER TABLE "payment" ADD CONSTRAINT "payment_amount_check" CHECK (amount > 0);
ALTER TABLE "payment" ADD CONSTRAINT "payment_method_check" CHECK (method IN ('cod', 'card', 'momo', 'bank'));
ALTER TABLE "product" ADD CONSTRAINT "product_price_check" CHECK (price > 0);
ALTER TABLE "product" ADD CONSTRAINT "product_stock_check" CHECK (stock >= 0);
ALTER TABLE "review" ADD CONSTRAINT "review_rating_check" CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_change_check" CHECK (change <> 0);
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_reason_check" CHECK (reason IN ('import', 'sale', 'return', 'adjust'));
