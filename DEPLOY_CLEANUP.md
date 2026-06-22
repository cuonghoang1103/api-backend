# Deployment & Rollback Guide — Phase 1-7 cleanup

This document covers the 7 maintenance commits that followed the
logger migration. They are deployed to the production VPS at
`160.187.1.208` and serve `https://cuonghoai.com`.

## Changes included

| Phase | Commit | Purpose |
| --- | --- | --- |
| A | `a44093f` | Drop duplicate "Database connected" log |
| B | `383d4a2` | Add `LOG_PIPELINE.md` and `scripts/log-query.sh` |
| C | `06c7504` | Resolve 21 lint warnings (0 errors, 0 warnings now) |
| 1 | `98b3922` | Drop duplicate "Sentry initialized" doc entry |
| 2-4 | `bb40f72` + `76429a6` | Real cursor-based pagination for `getComments` |
| 5 | `160e4ae` | Add `scripts/test-comments-pagination.ts` (14/14 pass) |
| 6 | `7da76b5` | Validate `?cursor=` query param (400 on bad input) |

All work is **behavior-preserving or strictly better**. No model,
schema, or business-logic change.

## Production state (as of this commit)

- `https://cuonghoai.com` returns HTTP 200
- All five containers healthy: `cuonghoangdev_backend`,
 `cuonghoangdev_frontend`, `cuonghoangdev_nginx`,
 `cuonghoangdev_postgres`, `cuonghoangdev_redis`
- Logs in JSON format with the 124 stable event names listed in
 `LOG_PIPELINE.md`
- `getComments` now paginates correctly end-to-end (verified by the
 integration test against a throwaway DB)

## Deploying the next change

1. `git pull` on the VPS (or just `git fetch && git reset --hard origin/main`).
2. `docker compose build backend` — rebuilds the API image.
3. `docker compose up -d backend` — restarts only the API container,
 nginx / frontend / db untouched.
4. `docker compose logs -f backend` — watch JSON logs in real time.
5. `curl -fsS https://cuonghoai.com/api/v1/health` — sanity probe.

The CI workflow "Deploy Backend to VPS" already does steps 2-3 on
push to `main`. The manual path above is for when you need to
re-deploy without pushing a commit (e.g. to pick up an image rebuild
triggered by a base-image bump).

## Rollback

Every Phase 1-7 commit is independent. To roll back to the
pre-cleanup state (logger migration deployed, no further changes):

```bash
cd /opt/cuonghoangdev # or wherever the repo lives on the VPS
git fetch --tags
git checkout v0.0.0-pre-logger-migration
docker compose build backend
docker compose up -d backend
```

The tag `v0.0.0-pre-logger-migration` is on the remote and points
to the commit immediately before `a44093f`.

To roll back **only** the pagination change while keeping the rest:

```bash
git revert 7da76b5 160e4ae 76429a6 bb40f72
docker compose build backend && docker compose up -d backend
```

To roll back only the validation:

```bash
git revert 7da76b5
docker compose build backend && docker compose up -d backend
```

In all cases the previous container image is kept by Docker until
pruned, so a single `docker compose up -d backend` reverts to the
pre-`docker compose build` image if the new one is bad.

## Verifying pagination is working

After deploy, hit a post that has many comments:

```bash
curl -fsS 'https://cuonghoai.com/api/v1/social/posts/<id>/comments?limit=5' | jq
```

Expected response shape:

```json
{
 "success": true,
 "data": [ /* 5 comments, oldest first */ ],
 "pagination": {
 "hasNextPage": true,
 "nextCursor": 42
 }
}
```

`nextCursor` is the `id` of the **last** (newest in the page) item.
Pass it back as `?cursor=42` to get the next page:

```bash
curl -fsS 'https://cuonghoai.com/api/v1/social/posts/<id>/comments?limit=5&cursor=42' | jq
```

A bad cursor now returns 400:

```bash
$ curl -i 'https://cuonghoai.com/api/v1/social/posts/<id>/comments?cursor=foo'
HTTP/1.1 400 Bad Request
{"success":false,"code":"INVALID_CURSOR","message":"Invalid cursor"}
```

## Local development notes

- Tests live in `scripts/test-*.ts` and are run with
 `npx tsx scripts/test-...`.
- The pagination test requires a Postgres reachable on
 `localhost:5433` (the `cuong_pg_new` container) with a database
 called `cuonghoangdev_test`. The production database
 `cuonghoangdev_db` is **never** written to from the test scripts.
- To run the test:
 `TEST_DATABASE_URL=postgresql://postgres:123456@localhost:5433/cuonghoangdev_test?schema=public npx tsx scripts/test-comments-pagination.ts`
