-- Settings hub (2026-08-08): cross-device preferences + admin-reviewed erasure.
--
-- 1) users.preferences — one nullable JSONB column holding every /settings
--    toggle that doesn't already have its own column (notification sounds,
--    per-type notification switches, locale, reduce-motion). JSON rather than
--    a column per toggle so adding the next notification kind is a code change,
--    not a migration. NULL = never touched → client defaults apply.
--
-- 2) account_deletion_requests — erasure stops being self-service. The user
--    FILES a request; an admin approves before anonymizeAccount() runs. The
--    anonymisation is irreversible (nulls the password, rotates email/username,
--    bumps role_version to kill every session), so a misclick or a hijacked
--    session could previously destroy an account with no recourse.
--
-- Purely additive: the new column is nullable with no default and the new table
-- is brand new, so existing rows are untouched and an older backend build keeps
-- working against this schema.

-- AlterTable
ALTER TABLE "users" ADD COLUMN "preferences" JSONB;

-- CreateTable
CREATE TABLE "account_deletion_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "username_at_request" VARCHAR(50),
    "email_at_request" VARCHAR(100),
    "reviewed_by_id" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "admin_note" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_deletion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_deletion_req_user" ON "account_deletion_requests"("user_id");
CREATE INDEX "idx_deletion_req_status" ON "account_deletion_requests"("status");

-- NOTE: "one PENDING row per user" is enforced in accountDeletion.service.ts,
-- not by a partial unique index. Prisma's schema language can't express
-- `WHERE status = 'PENDING'`, so an index here would show up as permanent
-- schema drift on every future `migrate dev` — and drift already caused a
-- production incident on this project once (see CLAUDE.md, 2026-06-29).

-- AddForeignKey
ALTER TABLE "account_deletion_requests" ADD CONSTRAINT "account_deletion_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_deletion_requests" ADD CONSTRAINT "account_deletion_requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
