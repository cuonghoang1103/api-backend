# Pre-commit secret scanner (gitleaks)

This repo uses [gitleaks](https://github.com/gitleaks/gitleaks) to prevent
accidental secret leaks. The pre-commit hook scans staged changes for
API keys, tokens, passwords, and private keys BEFORE they hit git history.

## One-time setup (for contributors)

After cloning, install the hook:

```bash
# Install gitleaks
brew install gitleaks          # macOS
# or: https://github.com/gitleaks/gitleaks/releases

# Install the hook (copies from .githooks/ to .git/hooks/)
./scripts/install-hooks.sh
```

If you skip this step, your commits will NOT be scanned — but they will
still work normally. The hook is opt-in for contributors.

## How it works

Every time you run `git commit`, the hook:

1. Scans each staged file with gitleaks (using `.gitleaks.toml` config)
2. Detects AWS, GCP, GitHub, Stripe, JWT, generic API keys, private keys, etc.
3. **Blocks the commit** if secrets are found (exit code 1)
4. Prints the offending line + rule ID for easy fixing

## If the hook blocks your commit

```
❌ COMMIT BLOCKED: secrets detected in your changes.
  - Replace `AIzaSyD...` with `<your-gemini-api-key>`
  - Replace `ghp_abc123...` with `<your-github-token>`
  - Use placeholders in docs, real values only in `.env` (which is gitignored)
```

## Bypass (use sparingly)

```bash
# Skip the hook for one commit (only if you're SURE the file is safe)
git commit --no-verify -m "..."

# Disable the hook entirely (not recommended)
rm .git/hooks/pre-commit
```

## When the hook DOESN'T run

- The hook is **local-only** — it never runs on the VPS or in CI.
- It only runs on `git commit`, not on `git push`, file edits, or deploys.
- If gitleaks is not installed, the hook silently passes (with a warning).

## False positives

If gitleaks flags something that isn't actually a secret (e.g. a UUID
that looks like an API key), you have two options:

1. Use `--no-verify` for that one commit.
2. Add the line to `.gitleaksignore` (one rule per line: `<file>:<rule-id>:<line>`).

## Files

- `.gitleaks.toml` — gitleaks config (committed to repo)
- `.git/hooks/pre-commit` — actual hook script (NOT committed, local-only)
- `scripts/install-hooks.sh` — installer for new contributors (committed)
- `docs/SECURITY.md` — broader security policy (see separate file)
