#!/bin/bash
# ============================================================
# CuongHoangDev - Database Migration Script
# Run inside the backend container
# ============================================================

set -e

echo "[Migrate] Running Prisma migrations..."
npx prisma migrate deploy

echo "[Migrate] Generating Prisma Client..."
npx prisma generate

echo "[Migrate] Verifying database connection..."
npx prisma db execute --stdin <<< "SELECT 1"

echo "[Migrate] Done!"
