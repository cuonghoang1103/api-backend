# Claude Code Instructions - api-backend

## Project Overview

Full-stack application:
- **Backend**: Node.js + Express + TypeScript (project root)
- **Frontend**: Next.js (in `frontend/`)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Cloudflare R2
- **Deployment**: Docker containers on VPS via GitHub Actions (push to `main` = deploy to production)

## Environment

- Node version: 22.x (see `package.json engines`)
- Local dev: `npm run dev` (backend), `cd frontend && npm run dev` (frontend)
- Local DB: PostgreSQL via `docker compose up -d postgres` (or local install)
- Env files: `.env` (backend), `frontend/.env.local` — NEVER commit these

---

## NEVER DO - Forbidden Actions

**These actions are forbidden without explicit user approval:**

- **NEVER** run `npx prisma migrate reset` — it wipes ALL data
- **NEVER** run `npx prisma db push` against production/VPS — bypasses migration history
- **NEVER** run `git push --force` or `--force-with-lease` to `main`
- **NEVER** push to `main` without completing the pre-push checklist below. Since push = production deploy, ask the user for confirmation before pushing
- **NEVER** auto-resolve failed migrations (`prisma migrate resolve`) — see Migration Failure Protocol
- **NEVER** commit `.env`, `.env.local`, secrets, API keys, or credentials
- **NEVER** SSH into VPS to modify database or containers directly, unless user explicitly asks
- **NEVER** delete or edit files in `prisma/migrations/` that have already been deployed
- **NEVER** downgrade or remove dependencies to "fix" a type error without asking first

---

## Pre-Push Checklist (Conditional)

Run checks based on what changed. **All commands run from project root.**

### If backend code changed (`src/**`):
```bash
npx tsc --noEmit
```

### If frontend code changed (`frontend/**`):
```bash
(cd frontend && npx tsc --noEmit)
(cd frontend && npm run build)
```

### If Prisma schema changed (`prisma/schema.prisma`):
```bash
npx prisma format
npx prisma generate
npx prisma migrate dev --name descriptive_name   # verify migration file is created
npx tsc --noEmit                                  # schema changes affect backend types
```

### If Dockerfile / docker-compose / CI workflow changed:
```bash
docker build -t backend-test .                          # test backend image builds
docker build -t frontend-test ./frontend                 # test frontend image builds
```

### If both backend and frontend changed: run all of the above.

Final step before push, always:
- [ ] `git status` — verify no unintended files (especially `.env`, build artifacts)
- [ ] Confirm with user before pushing to `main` (push triggers production deploy)

---

## Prisma Rules

### Adding/Changing Models

1. Define the model with all fields
2. Add back-relations in parent models. Use unique `@relation("Name")` when a model has multiple relations to the same target
3. `npx prisma format` (catches validation errors early)
4. `npx prisma generate`
5. `npx prisma migrate dev --name descriptive_name`
6. Verify the migration file exists in `prisma/migrations/`

**Back-relation pattern:**
```prisma
model Parent {
  id       Int     @id
  children Child[] @relation("ChildRelation")
}

model Child {
  id       Int    @id
  parentId Int
  parent   Parent @relation("ChildRelation", fields: [parentId], references: [id])
}
```

**Common pitfalls:**
- Missing opposite relation field in parent model → `prisma generate` fails
- Duplicate or ambiguous `@relation()` names
- When using `@@unique([a, b], name: "custom_name")`, queries must use `custom_name`, NOT the default `a_b` compound key:
```typescript
// Wrong:   where: { subjectId_recipientId: { subjectId, recipientId } }
// Correct: where: { uk_note_subject_share: { subjectId, recipientId } }
```

### Migration Failure Protocol

**If a migration fails on deploy (including P3009 "migration failed to apply"):**

1. **STOP. Do not attempt to auto-fix.**
2. Do NOT run `prisma migrate resolve --rolled-back` or `--applied` automatically
3. Do NOT rewrite the migration with `CREATE TABLE IF NOT EXISTS` hacks to force it through
4. Instead, report to the user:
   - The exact error message and migration name
   - Whether the migration partially applied (check which statements ran)
   - A recommended fix, and wait for user approval
5. If schema drift is suspected (DB doesn't match migration history), suggest running:
   ```bash
   npx prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script
   ```
   to see the actual difference before deciding anything.

Rationale: auto-resolving partially-applied migrations can silently corrupt schema/data on production.

---

## Frontend JSX/TSX Rules

- Match every opening tag with a closing tag; no duplicate closing tags
- Verify structure of conditional render blocks especially (`{condition && (...)}`)
- `(cd frontend && npm run build)` is the source of truth — TypeScript passing does not guarantee the build passes

---

## Docker & Deploy

**Deploy workflow (`deploy-ghcr.yml`) on push to `main`:**
1. CI — Lint & Type Check (must pass)
2. Build Docker images → push to GHCR
3. Deploy backend to VPS
4. Run Prisma migrations on VPS

**When adding a new environment variable:**
1. Add to local `.env` / `frontend/.env.local`
2. Add to `.env.example` (documentation)
3. Add to docker-compose / Dockerfile `ENV`/`ARG` if needed
4. **Remind the user** to add it to GitHub Actions secrets and the VPS environment — Claude cannot do this; missing this step is a common cause of deploy failures that local CI won't catch
5. For Next.js: `NEXT_PUBLIC_*` vars are baked in at **build time** — changing them requires a rebuild, not just a restart

**When adding a new dependency:**
- Verify it installs in the Docker build (some packages need system libs) — test with `docker build` locally if unsure

**If deploy fails:**
1. Check GitHub Actions logs (`gh run list`, `gh run view <id> --log-failed`)
2. Map error to fix:
   - TypeScript errors → run the relevant `tsc --noEmit` locally
   - Frontend build errors → `(cd frontend && npm run build)`
   - Prisma errors → see Migration Failure Protocol above; do NOT auto-resolve
   - Missing env var → check GitHub secrets / VPS env (ask user)

**Rollback procedure (if a bad deploy reaches production):**
```bash
git revert <bad_commit_sha>
# run pre-push checklist, then push (with user confirmation)
```
- NEVER `git push --force` to roll back
- If the bad deploy included a migration, discuss with the user before reverting — reverting code does not revert the database

---

## Feature Implementation Workflow

1. **Plan first** — understand full scope, list files to change
2. **Backend first**: Prisma models (+ relations) → generate → migration → service layer → routes
3. **Frontend second**: API methods in `frontend/src/lib/api.ts` → components → test locally
4. **Verify**: run conditional pre-push checklist → confirm with user → push

---

## Known Error Patterns (History)

Condensed log of past failures — do not repeat:

| Date | Error | Lesson |
|------|-------|--------|
| 2026-06-29 | JSX missing closing `</div>` in conditional block broke frontend build | Always run frontend build before push |
| 2026-06-29 | Missing Prisma back-relations (`NoteSubjectShare`, `NoteSubjectShareRecipient`) | Every relation needs its opposite field |
| 2026-06-29 | Used default compound key name instead of custom `@@unique` name in queries | Use the custom constraint name |
| 2026-06-29 | Migration failed: table already exists; then P3009 blocked deploys | DB had drifted from migration history — follow Migration Failure Protocol, don't hack around it |

---

## Useful Commands

```bash
# Backend (from project root)
npx tsc --noEmit                       # type check
npx prisma format                      # format & validate schema
npx prisma generate                    # generate client
npx prisma migrate dev --name <name>   # create migration
npx prisma migrate status              # check migration state

# Frontend (subshell so cwd stays at root)
(cd frontend && npx tsc --noEmit)
(cd frontend && npm run build)
(cd frontend && npm run lint)

# Docker
docker build -t backend-test .
docker compose up -d

# Git / CI
git status
git log --oneline -5
gh run list
gh run view <run_id> --log-failed
```
