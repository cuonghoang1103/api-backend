# Migration: add idempotency_key to course_orders
# Date: 2026-06-16
# Purpose: prevent double-click creating two PENDING orders.
#
# Frontend generates a UUID per "Mua" click and sends it in the
# POST /payments/course body. Backend upserts on (userId, idempotency_key)
# so a retry from the same user returns the original order instead
# of creating a new one.
#
# The unique index is scoped to userId because UUIDs are per-client;
# two different users with the same UUID (astronomically unlikely but
# possible) should not collide.

ALTER TABLE "course_orders" ADD COLUMN "idempotency_key" VARCHAR(64);

-- Idempotency uniqueness is enforced per-user (the same UUID from
-- two different users is allowed — they each have their own order).
CREATE UNIQUE INDEX "uk_course_order_idempotency"
    ON "course_orders"("user_id", "idempotency_key")
    WHERE "idempotency_key" IS NOT NULL;
