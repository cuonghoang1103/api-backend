#!/bin/bash
# Quick local checks for the backend.
# Usage: ./scripts/dev-check-backend.sh
set -e

cd "$(dirname "$0")/.."

echo "=== ESLint ==="
npm run lint 2>&1 | tail -20 || echo "(lint warnings ok)"

echo ""
echo "=== TypeScript type-check ==="
npx tsc --noEmit 2>&1 | tail -20

echo ""
echo "=== Prisma schema validate ==="
npx prisma validate 2>&1 | tail -5

echo ""
echo "=== Done ==="
