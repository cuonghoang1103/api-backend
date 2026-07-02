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
6. **Third-party API keys must NOT be `NEXT_PUBLIC_*`** — never ship keys in the client bundle. Add a small authenticated backend proxy route instead (pattern: `src/routes/gifs.routes.ts` for GIPHY) and read the key from runtime env
7. **Production runtime env lives in `/opt/cuonghoangdev/.env` on the VPS.** `deploy.sh` loads it on every deploy and rsync EXCLUDES `.env*`, so values there survive deploys permanently. Caveat: if you append a var while a deploy is already running, that deploy loaded env before your change — recreate the container (`docker compose -p cuonghoangdev up -d --no-build <service>` with env loaded) or redeploy

**When adding a new dependency:**
- Verify it installs in the Docker build (some packages need system libs) — test with `docker build` locally if unsure

**Deploy hygiene (avoid stale/partial builds):**
- **Always run a FULL `bash deploy.sh`** after any code change. **NEVER** use `bash deploy.sh --no-build` after changing code — it only rsyncs, does NOT rebuild, so the container keeps running the OLD image (this caused the 2026-07-02 GIF 404 below) and it also **skips the smoke-test**.
- `deploy.sh` runs a **post-deploy smoke-test**: it hits core GET routes on the internal backend and **FAILS the deploy if any returns 404** (404 = route not mounted → stale/partial build). 401/200 = healthy.
- **When you add a new feature module/router**, add one of its param-less, unauth GET routes to the smoke-test list in `deploy.sh` (search `Smoke-testing core API routes`). Only add routes that return **non-404** on a bare unauth GET — do NOT add POST-only or param-required routes (e.g. `/stickers`, `/auth/login`) or every deploy will false-fail.
- Diagnose "is a route actually live?" with: `curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/<route>` → **401 = mounted (needs auth), 200 = mounted (public), 404 = NOT mounted / stale build**.

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
| 2026-07-02 | GIF picker flaky then dead: client called GIPHY directly with `NEXT_PUBLIC_GIPHY_API_KEY` (baked at build time), fell back to GIPHY's revoked public beta key (403) when the env was missing at build | Browser-facing third-party APIs go through a backend proxy (see `/api/v1/gifs` in `src/routes/gifs.routes.ts`): key stays server-side as runtime env, responses cached, key rotation = container restart, no rebuild |
| 2026-07-02 | Global theme put `.dark` class on `<html>` → force-activated every Tailwind `dark:` utility inside Notes, breaking its own 3-theme (light/dark/brown) switcher | The global dark theme class is **`theme-dark`**, NEVER `dark`. Tailwind `dark:` variants are RESERVED for the Notes wrapper (`NotesThemeProvider` puts `.dark` on `.notes-theme-root`). Global theme-dependent styles use `html.theme-dark ...` CSS or the theme CSS variables (`var(--text-primary)` etc.), not `dark:` |
| 2026-07-02 | Admin's support chat history "disappeared" from /messages — it was never lost, just filtered out (`listThreadsForUser` only matched the user side of `type='ADMIN'` threads) | Support chats and DMs share ONE system (`MessageThread`, type `ADMIN`/`USER`). Before assuming data loss, check the query filters. The old `/admin/messages` page was removed on purpose — do not recreate it; admin handles support threads in /messages |
| 2026-07-02 | GIF picker dead + "chats disappearing" together, survived re-login. Root cause: prod ran a **stale `dist/index.js`** that never mounted `/api/v1/gifs` (route 404'd) while `/messages/threads` 401'd — a partial/`--no-build` deploy shipped an old image even though `dist/routes/gifs.routes.js` existed. Fixed by a full clean `bash deploy.sh` | Diagnose route health with unauth `curl` (401/200 = mounted, **404 = stale build**), not the browser. Always full `deploy.sh` (never `--no-build` after code changes). `deploy.sh` now smoke-tests core routes and fails on 404. Chats "disappearing" was separate: per-viewer `deletedAt` (delete-for-me) — now recoverable via the "Đã xoá" tab (`restoreThreadForViewer` + `GET /threads?view=deleted` + `POST /threads/:id/restore`) |
| 2026-07-02 | `getMediaUrl` (frontend `lib/utils.ts`) prefixed the R2 CDN base onto `blob:`/`data:` preview URLs → `https://<r2>/blob:...` → 400 when rendering optimistic upload previews | Object/data URLs are already renderable — return them as-is; only prepend the CDN base to bare R2 keys |
| 2026-07-02 | Session died silently after 24h: JWT `JWT_EXPIRES_IN=24h` but `backend_token` cookie lives 7d, and there was **no working `/auth/refresh`** (FE proxy called a non-existent backend route) → every authed call 401'd (GIF, messenger) though the cookie was present | Added `POST /api/v1/auth/refresh` (`authService.refreshToken`: verify `ignoreExpiration` + re-check account) + axios 401 interceptor that refreshes once and retries. Sessions self-heal; no env change needed |
| 2026-07-02 | Landscape feed videos letterboxed with huge black bars top/bottom: the all-video carousel (`PostCard.tsx` MediaGrid) forced a FIXED tall TikTok frame `min(88vh, 880px)` + `object-contain` regardless of orientation | Measure the video's real ratio (`loadedmetadata` → `videoWidth/videoHeight`, thumbnail `naturalWidth/Height`, or server `width/height` metadata) and size the frame to the video's own `aspectRatio` when landscape/square; the tall frame is ONLY for portrait |
| 2026-07-02 | Shared notes: clicking a note inside a shared-subject view did nothing, and switching note 1 → note 2 kept showing note 1's body. Two causes: render ternary checked list view (`sharedSubject`) BEFORE detail view (`sharedSelectedNote`), and `SharedNoteViewer` had no `key` — TipTap `useEditor` only loads `content` on mount | Detail view must come before list view in the render chain (opening detail doesn't clear the list state — that's what makes "back" work). Any read-only TipTap viewer must get `key={note.id}` so it remounts per note |

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
