#!/bin/bash
# Clean local build caches that are safe to regenerate.
# Usage: ./scripts/clean-cache.sh
set -e

cd "$(dirname "$0")/.."

echo "=== Cleaning Next.js build cache (3GB+ on .next/cache) ==="
if [ -d "frontend/.next/cache" ]; then
  rm -rf frontend/.next/cache
  echo "Removed frontend/.next/cache"
fi

echo ""
echo "=== Cleaning TypeScript build info ==="
rm -f frontend/tsconfig.tsbuildinfo
rm -f tsconfig.tsbuildinfo
echo "Removed tsbuildinfo files"

echo ""
echo "=== Cleaning dist (backend build output) ==="
if [ -d "dist" ]; then
  rm -rf dist
  echo "Removed dist/"
fi

echo ""
echo "=== Done ==="
