#!/bin/bash
# ============================================================
# Install local git hooks (gitleaks pre-commit)
# ============================================================
# Run this ONCE after cloning the repo to enable the
# pre-commit secret scanner.
#
# What it does:
#   - Copies .githooks/pre-commit → .git/hooks/pre-commit
#   - Sets executable bit
#   - Verifies gitleaks is installed
#
# Safe to re-run.
# ============================================================

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "🔧 Installing pre-commit hooks..."

# Create .git/hooks if missing
mkdir -p .git/hooks

# Copy hook from .githooks/ (committed) to .git/hooks/ (local-only)
if [ -f ".githooks/pre-commit" ]; then
  cp .githooks/pre-commit .git/hooks/pre-commit
  chmod +x .git/hooks/pre-commit
  echo "✅ Installed .git/hooks/pre-commit"
else
  echo "❌ .githooks/pre-commit not found in repo"
  exit 1
fi

# Verify gitleaks is installed
if command -v gitleaks &> /dev/null; then
  echo "✅ gitleaks found: $(gitleaks version)"
else
  echo "⚠️  gitleaks NOT installed. Hook will silently pass."
  echo "   Install: brew install gitleaks (macOS)"
  echo "   Docs:    https://github.com/gitleaks/gitleaks"
fi

# Test the hook (optional, non-blocking)
if [ -f .git/hooks/pre-commit ] && [ -x .git/hooks/pre-commit ]; then
  echo ""
  echo "✅ Setup complete! Future commits will be scanned for secrets."
  echo "   Bypass for one commit: git commit --no-verify"
  echo "   Disable entirely:       rm .git/hooks/pre-commit"
else
  echo "❌ Hook not installed correctly. Check permissions."
  exit 1
fi
