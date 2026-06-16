#!/bin/bash
# ============================================================
# Pre-warm node_modules cache for Docker build
# ============================================================
# Why: VPS network sometimes blocks npm registry + GitHub releases,
# which makes Docker builds fail at `npm ci`. We pre-stage the
# host's existing node_modules into /opt/cuonghoangdev/host-cache/
# so the Dockerfile can fall back to it if the install fails.
#
# This script is idempotent — safe to run multiple times.
# Run from /opt/cuonghoangdev/ after rsync.
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_DIR="$REPO_DIR/host-cache"

mkdir -p "$CACHE_DIR"

# Backend
if [ -d "$REPO_DIR/node_modules" ]; then
  echo "[pre-warm] Caching backend node_modules ($(du -sh $REPO_DIR/node_modules | cut -f1))"
  rm -rf "$CACHE_DIR/node_modules"
  # -a preserves symlinks (npm .bin/ is full of symlinks to
  # real binaries in node_modules/<pkg>/). Without -a the
  # symlinks become regular files pointing nowhere, and the
  # `npm ci` fallback in Dockerfile fails with `prisma: not found`.
  cp -a "$REPO_DIR/node_modules" "$CACHE_DIR/node_modules"
fi

# Frontend
if [ -d "$REPO_DIR/frontend/node_modules" ]; then
  echo "[pre-warm] Caching frontend node_modules ($(du -sh $REPO_DIR/frontend/node_modules | cut -f1))"
  rm -rf "$CACHE_DIR/frontend-node_modules"
  mkdir -p "$CACHE_DIR/frontend-node_modules"
  # -a preserves symlinks (npm .bin/ is full of symlinks to
  # real binaries in node_modules/<pkg>/). Without -a the
  # symlinks become regular files pointing nowhere, and the
  # `npm ci` fallback in Dockerfile fails with `prisma: not found`.
  cp -a "$REPO_DIR/frontend/node_modules/." "$CACHE_DIR/frontend-node_modules/"
fi

echo "[pre-warm] ✅ Host node_modules ready for Dockerfile fallback"
