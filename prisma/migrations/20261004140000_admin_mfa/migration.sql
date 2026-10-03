-- MFA (TOTP) step-up cho tài khoản admin (04/10/2026).
-- Chỉ ADD COLUMN có DEFAULT / cho phép NULL ⇒ không khoá bảng lâu, không đụng dữ liệu cũ.
ALTER TABLE "users" ADD COLUMN "mfa_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "mfa_secret" TEXT;
ALTER TABLE "users" ADD COLUMN "mfa_recovery_codes" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "users" ADD COLUMN "mfa_enabled_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "mfa_last_used_step" INTEGER;
