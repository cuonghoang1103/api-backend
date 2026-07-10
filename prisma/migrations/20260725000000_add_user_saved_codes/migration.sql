-- CreateTable
CREATE TABLE "user_saved_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "code_type" VARCHAR(20) NOT NULL DEFAULT 'OTHER',
    "note" VARCHAR(255),
    "expires_at" TIMESTAMP(3),
    "source" VARCHAR(20) NOT NULL DEFAULT 'MANUAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_saved_code" ON "user_saved_codes"("user_id", "code");

-- CreateIndex
CREATE INDEX "idx_user_saved_code_user" ON "user_saved_codes"("user_id");

-- AddForeignKey
ALTER TABLE "user_saved_codes" ADD CONSTRAINT "user_saved_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
