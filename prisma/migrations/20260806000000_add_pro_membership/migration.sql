-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_pro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pro_expires_at" TIMESTAMP(3),
ADD COLUMN     "pro_since" TIMESTAMP(3),
ADD COLUMN     "pro_source" VARCHAR(20);

-- CreateTable
CREATE TABLE "pro_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "label" VARCHAR(120),
    "duration_days" INTEGER,
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "note" VARCHAR(255),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pro_redemptions" (
    "id" SERIAL NOT NULL,
    "pro_code_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "granted_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pro_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pro_codes_code_key" ON "pro_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pro_redemptions_pro_code_id_user_id_key" ON "pro_redemptions"("pro_code_id", "user_id");

-- AddForeignKey
ALTER TABLE "pro_redemptions" ADD CONSTRAINT "pro_redemptions_pro_code_id_fkey" FOREIGN KEY ("pro_code_id") REFERENCES "pro_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
