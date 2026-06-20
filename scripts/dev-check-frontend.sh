#!/bin/bash
# Quick local checks for the frontend.
# Usage: ./scripts/dev-check-frontend.sh
set -e

cd "$(dirname "$0")/../frontend"

echo "=== ESLint (auto-fix) ==="
npx next lint --dir src --fix 2>&1 | tail -20 || echo "(no next lint config — skipping)"

echo ""
echo "=== TypeScript type-check ==="
npx tsc --noEmit 2>&1 | tail -20

echo ""
echo "=== Done ==="
