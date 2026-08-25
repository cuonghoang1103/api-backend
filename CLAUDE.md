# Claude Code Instructions - api-backend

## Project Overview

Full-stack application:
- **Backend**: Node.js + Express + TypeScript (project root)
- **Frontend**: Next.js (in `frontend/`)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Cloudflare R2
- **Deployment**: Docker containers on VPS, deployed by running `bash deploy-nha.sh` from the local machine (máy nhà builds, VPS only swaps). A push to `main` does NOT deploy — see "Docker & Deploy" below

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
- **NEVER** push to `main` without completing the pre-push checklist below, and always ask the user for confirmation first. (A push no longer deploys — `deploy-nha.sh` does — but `main` is still the shared trunk, so it stays a confirm-first action)
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
npm run typecheck:seed                            # tsconfig excludes prisma/** from the line above
npx prisma db seed                                # the ONLY way to catch runtime-only seed breakage
```

⚠️ **`npx tsc --noEmit` does NOT check the seed scripts.** The main
tsconfig has `rootDir: "./src"`, so `prisma/**` cannot live in its
`include` — it sat in `exclude` instead, and nothing type-checked it.
On 2026-08-08 renaming the `ContentType` enum value `CODE` →
`CODE_REVIEW` passed the entire checklist and still broke the seed on
**production**, because `seed.ts` carried its own hand-written copy of
the union and type-checked against itself. `tsconfig.seed.json` +
`npm run typecheck:seed` exist to close that hole — run both lines
above whenever an enum or model changes.

⚠️ **`npx prisma migrate dev` is broken in this repo** (pre-existing,
not worth fixing): migration `20260706130000_add_music_and_profile`
adds a UNIQUE constraint named `post_music_post_id_key` and then a
plain index with the *same name*, so it can never replay on the shadow
database → `P3006`. It is already deployed, so per the rules above it
must not be edited. **To add a migration: hand-write the SQL under
`prisma/migrations/<timestamp>_<name>/migration.sql` and apply with
`npx prisma migrate deploy`** (no shadow DB). Verify with:
```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma --script   # empty = no drift
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

**STANDARD deploy + push flow (2026-07-06 — follow this order):**
1. Run the conditional pre-push checklist locally (tsc / build)
2. Commit to **local `main`**
3. Deploy with **`bash deploy-nha.sh`** (máy nhà build → GHCR → VPS chỉ tráo). This is the standard path since 2026-08-18. Do NOT deploy by pushing to GitHub
4. **Wait for the user to test production and confirm the fix works**
5. Only THEN `git push` to origin (with user confirmation, per Forbidden Actions). At this point the push is just syncing GitHub with what prod already runs

Why not push-to-deploy: `deploy-ghcr.yml` and `backend-vps` once ran on every push to `main` and raced each other into real outages (2026-07-03: feed 500 while schema lagged the image; 2026-07-06: backend recreate race → `Exited(137)` + orphan containers, recovered via `docker start cuonghoangdev_backend`). Deploying stays a script you run, never a side effect of pushing.

### `deploy-nha.sh` — đường CHUẨN (từ 18/08/2026)

Máy nhà (12 nhân/31GB) build cả hai ảnh SONG SONG rồi đẩy lên GHCR; VPS chỉ kéo
ảnh về và tráo. Hai cái lợi lớn:

- **Nhanh hơn ~3×.** Build song song ở nhà ~3-6 phút; VPS build tuần tự ~15 phút
  (nó buộc phải tuần tự vì build song song từng bị OOM giết, exit 137).
- **VPS KHÔNG còn cache build.** Đây mới là điều quan trọng: cache build từng
  phình 7,6GB trên chính cái đĩa chứa Postgres, và 18/08/2026 một lần
  `deploy.sh` chết giữa chừng với `no space left on device` (đĩa tụt xuống
  còn 1,8GB trong lúc `next build` chạy).
- Chỉ nội dung **đã commit** đi qua (`git push` vào kho trần ở máy nhà), nên nó
  không thể chộp trúng file phiên khác đang lưu dở như `deploy.sh` từng làm.

Từ 23/08/2026 nó **cũng đồng bộ `nginx/nginx.conf` và nạp lại nginx** (bước 6c,
chạy sau smoke-test): so `sha256` nên không đổi thì không đụng tới, có đổi thì
`nginx -t` trước, hỏng thì trả bản cũ về và dừng — ảnh vẫn đã tráo xong.

```bash
bash deploy-nha.sh              # chuẩn; máy nhà hỏng thì tự lùi về deploy.sh
bash deploy-nha.sh --khong-lui  # hỏng thì dừng hẳn
bash deploy-nha.sh --khong-day  # chỉ build ở nhà, không đẩy, không tráo
```

⚠️ Nó **hỏi `[y/N]`** khi cây làm việc còn thay đổi chưa commit (những thay đổi
đó sẽ KHÔNG lên production). Chạy nền thì phải `echo y | bash deploy-nha.sh`,
không thì nó dừng im với exit 0.

⚠️ **Dựng ảnh ngoài compose thì PHẢI `-f <đúng file compose dùng>`.**
18/08/2026 script chạy `docker build .` — lấy `Dockerfile` mặc định thay vì
`Dockerfile.backend` mà compose dùng. Kết quả: nền `node:22-alpine` (musl) mang
engine Prisma bản `debian-openssl-3.0.x` (glibc) ⇒ build xanh, đẩy xanh, tráo
xanh, rồi backend restart vô tận và **API chết 502 bảy phút**. Đã vá, và đã
thêm chốt kiểm libc ↔ engine **trước khi đẩy**. Bài học: *build xanh không có
nghĩa là ảnh chạy được.*

**Khôi phục nhanh khi tráo trúng ảnh chết:** ảnh cũ thường vẫn còn dạng mồ côi.
```bash
ssh root@<vps> "docker images -a --filter dangling=true"   # đối chiếu kích thước
ssh root@<vps> "docker tag <id> cuonghoangdev-backend:latest"
ssh root@<vps> "cd /home/deployer/repo && set -a && . /opt/cuonghoangdev/.env; set +a; \
                docker compose -p cuonghoangdev up -d --no-build backend"
```
Mất ~40 giây, thay vì dựng lại 15 phút.

### `deploy.sh` — đường LÙI

Vẫn giữ nguyên và vẫn dùng được: nó rsync cây làm việc rồi build ngay trên VPS,
nên không phụ thuộc máy nhà. Dùng khi máy nhà tắt/mất mạng, hoặc khi cần deploy
thứ CHƯA commit. Đổi lại: chậm hơn, và nó là đường đã ba lần chộp trúng file
phiên khác đang gõ dở.

**What a push to `main` actually triggers (verified 2026-08-07):** only `ci-lint.yml` — "CI - Lint & Type Check". **Both deploy workflows are now `on: workflow_dispatch:` only**, i.e. manual-run, so a push cannot start a deploy and cannot re-run the race above. Don't re-add a `push:` trigger to either without a plan for the concurrency problem.

Verify before trusting this line — the trigger is one grep, and the whole outage story above came from it being wrong:
```bash
/usr/bin/grep -A4 '^on:' .github/workflows/deploy-ghcr.yml .github/workflows/backend-vps.yml
gh run list --limit 8 --branch main   # what really fired on the last pushes
```

**Deploy workflows (manual dispatch only — `gh workflow run <name>`):**
- `deploy-ghcr.yml` "Deploy via GHCR (fast path)" — build images → GHCR → deploy backend → Prisma migrations on VPS
- `backend-vps.yml` "Deploy Backend to VPS"

**`CV critique fabrication test` is deliberately dormant (07/08/2026 — do NOT "fix" it).** The repo secret `ANTHROPIC_API_KEY` was **removed on purpose**: the Anthropic account ran out of credit, so re-adding a key would only trade `HTTP 403` for an out-of-credit error and leave CI red either way. With the secret gone the step SKIPs and exits 0, so **CI is green**. Do not suggest re-adding the key unless the user says the account has been topped up.

What that costs: nothing watches for the AI inventing metrics in CV critiques any more (feed a metric-less CV, fail if a `suggestedFix` asserts a number without `needsUserInput`). Run it by hand with `npm run eval:cv-fabrication` — needs an AI key in the local `.env`, which is currently absent, so today it just prints SKIPPED.

To re-arm it later: create a repo secret named exactly `ANTHROPIC_API_KEY` (put the **modelapi.vn** key in it — since 11/08/2026 that variable is just one of three names the gateway reads). No code or workflow edit — `ci-lint.yml` still references it and GitHub substitutes an empty string while it's missing. The gate is `keyForProvider()` in `src/services/cv/llm/index.ts` → `gatewayKey()` in `src/services/llm/gateway.ts`, which reads `LLM_GATEWAY_API_KEY` → `OPENAI_COMPAT_API_KEY` → `ANTHROPIC_API_KEY`; CI passes none of them, so the step still SKIPs and CI stays green.

⛔ **Never delete `VPS_HOST` / `VPS_USER` / `VPS_SSH_PRIVATE_KEY`** — 10 workflows use them, and `vps-cleanup-weekly.yml` runs on a **weekly cron** to reclaim VPS disk (the guard against the disk-full outage that killed Postgres once). Deleting them kills that job silently.

**When CI does go red, check *which step* failed and whether your commit even touches that side of the tree (`git show --stat`) before blaming your own diff.**

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
- Dùng `deploy-nha.sh`. Nếu phải lùi về `deploy.sh` thì **luôn chạy FULL**, **NEVER** `bash deploy.sh --no-build` after changing code — it only rsyncs, does NOT rebuild, so the container keeps running the OLD image (this caused the 2026-07-02 GIF 404 below) and it also **skips the smoke-test**.
- `deploy.sh` builds backend and frontend images **sequentially** (Step 2a) — an OOM guard for the 6GB VPS: parallel cold builds (cache is pruned after every deploy) killed `next build` with exit 137 on 2026-07-06. Keep it sequential; with a warm cache both builds are near-instant no-ops. If a deploy still fails on `npm ci`/network fetching prebuilt binaries (e.g. sharp), a simple retry usually succeeds and reuses the cached layers.
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

## Phát hành app desktop — MỘT CHỖ DUY NHẤT (20/08/2026)

```bash
(cd desktop && npm run phat-hanh -- "mô tả ngắn")   # bump + push + dựng + KIỂM LẠI
(cd desktop && npm run phat-hanh -- --tiep)          # ship số đang có, không bump
```

⛔ **ĐỪNG bump `desktop/package.json` bằng tay rồi `gh workflow run`.** Đó là
cách cũ, và nó đã hỏng hai kiểu — đo thật đêm 19-20/08/2026, **11 lần bump
trong 4,5 giờ** từ nhiều phiên Claude cùng làm app:

- **0.5.39 bump rồi KHÔNG BAO GIỜ được phát hành.** Người dùng nằm lại 0.5.38,
  trong khi mọi phiên đều tin là đã ship. Không có chỗ nào đối chiếu "số trong
  `package.json`" với "số đã lên GitHub Releases" nên không ai thấy.
- **v0.5.40 bị dựng HAI lượt.** Lượt A công bố 18:08:17, lượt B xong 18:15:37
  và **tải đè** lên đúng release đó. Lần ấy vô hại vì cùng một commit — khác
  commit thì người dùng đã tải một bản cài mang số hiệu của bản khác, hỏng câm.
  `concurrency:` trong workflow chỉ XẾP HÀNG, không chặn.

`phat-hanh.mjs` chặn đúng những cửa đã từng lọt, theo thứ tự:
nhánh phải là `main` · `desktop/` phải **sạch** (workflow lấy mã TỪ GITHUB, thứ
sửa dở trên máy không vào bản cài mà bản cài vẫn ra) · không được sau
`origin/main` · **không có lượt dựng nào đang chạy** (đây là chỗ chặn hai phiên
giẫm nhau) · số phiên bản **chưa từng công bố** · và sau khi dựng xanh thì
**kiểm lại danh sách file** — thiếu `latest-mac.yml` hoặc một trong hai `.zip`
macOS là tự-cập-nhật chết câm trong khi release nhìn vẫn đầy đủ.

Lớp thứ hai nằm trong `desktop-release.yml` (bước *"Chặn dựng đè bản đã công
bố"*): nó giữ được cả người gõ tay `gh workflow run`. Bản **nháp** vẫn cho dựng
tiếp — một lượt chết giữa chừng để lại nháp, chạy lại để hoàn tất là đúng.

⚠️ Bản phát hành nằm ở kho **`cuonghoang1103/cuongthai-desktop`** (công khai),
không phải kho này — `electron-updater` tải bản mới KHÔNG kèm token nên kho
phát hành bắt buộc phải public.

---

## Cổng LLM — modelapi.vn (11/08/2026)

**MỘT khoá, MỘT base URL, MỘT bảng model cho cả web.** Nguồn sự thật:
`src/services/llm/gateway.ts`. Cổng chạy phần mềm **New API**, mở đồng thời
`/v1/chat/completions` (tuyến OpenAI — ĐƯỜNG MẶC ĐỊNH) và `/v1/messages`
(tuyến Anthropic — chỉ AI Chat Pro/Max dùng, vì đó là chỗ duy nhất gửi **ảnh
+ PDF**; tuyến OpenAI không có khối `document`, đổi sang đó là âm thầm vứt
file người dùng vừa đính kèm).

```bash
LLM_GATEWAY_BASE_URL=https://modelapi.vn/v1
LLM_GATEWAY_API_KEY=sk-...      # cũng đọc OPENAI_COMPAT_API_KEY / ANTHROPIC_API_KEY
LLM_GATEWAY_API_KEY_GPT=sk-...  # khoá nhóm GPT (18/08) — xem "HAI KHOÁ" ngay dưới
```

### ⚠️ HAI KHOÁ, MỘT CHO MỖI NHÓM (18/08/2026)

**Một token của cổng thuộc về ĐÚNG MỘT nhóm, và `GET /v1/models` chỉ liệt kê
model của nhóm đó.** Đo thật: khoá cũ (nhóm `claude`) thấy 6 model
`claude-*` và KHÔNG thấy model `gpt-*` nào; khoá GPT mới thì ngược lại. Gọi
model của nhóm khác trả `503 No available channel for model X under group Y` —
nghe như cổng đang bận, nhưng nó vĩnh viễn.

`gatewayKeyFor(model)` trong `gateway.ts` chọn khoá theo **tiền tố tên model**:
`gpt-5.6-sol` → tìm `LLM_GATEWAY_API_KEY_GPT`, không có thì rơi về khoá mặc
định. Nhóm mà khoá MẶC ĐỊNH phục vụ được khai bằng `LLM_GATEWAY_GROUP`
(mặc định `claude` — đúng với production).

**Thiếu khoá thì KHÔNG chết, mà LÙI.** `modelGoiDuoc()` đổi sang model Claude
tương đương và ghi một dòng WARN. Lưới đỡ này có vì bản đồ model sống trong mã
(đi theo mỗi deploy) còn khoá sống trong `/opt/cuonghoangdev/.env` (người thêm
tay) — hai thứ lệch nhịp một lần là chín tính năng cùng trả 503. Cái giá của
việc quên: `cv_parse`/`news_bulletin`/… chạy đắt gấp 5,1 lần.

Kiểm bản đồ đang hiệu lực: `npx tsx --test src/services/llm/gateway.test.ts`
(4 phép kiểm, trong đó có một cái bắt lỗi gọi vòng `endpointFor ↔ modelFor` mà
`tsc` KHÔNG thấy).

⚠️ **Model `rb-*` cũ ĐÃ CHẾT.** Thấy `rb-` ở đâu là chỗ đó đang trỏ vào
đường chết.

### 🤖 AI Code chạy cổng RIÊNG (19/08/2026)

`agent_code` — và CHỈ nó — đi qua cổng riêng của người dùng. Chat, CV, bản
tin… vẫn đi modelapi. Cắm bằng hai biến ở `/opt/cuonghoangdev/.env`:

```bash
AGENT_GATEWAY_BASE_URL=https://rambo.ai.vn/api/claude
AGENT_GATEWAY_API_KEY=sk-...
```

Thiếu một trong hai thì `congAgent()` trả `null` và agent tự về modelapi —
không chết, chỉ đổi bảng model.

⚠️ **Đường đúng KHÔNG phải gốc `/v1`.** Nó là `/api/claude/v1/...`, tìm ra
nhờ đọc trang `/huong-dan` của chính họ. Gốc `GET /v1/models` trả **200 kể
cả khi KHÔNG có khoá** — danh sách model ở đó chỉ là quảng cáo, đừng lấy nó
làm bằng chứng cổng chạy được.

⚠️ **Cổng này KHÔNG tôn trọng `max_tokens`** (đo: đặt 24, trả 103 token,
`finish_reason: stop`). Mọi trần chi phí trong mã đều vô hiệu với nó.

✅ Nó **chảy dần THẬT** — trải 308–950ms giữa mẩu đầu và mẩu cuối, khác hẳn
modelapi (121 mẩu về cùng một mili giây). Nhận cả `Bearer` lẫn `x-api-key`.

Sáu model, đo thật (thời gian tới mẩu chữ đầu, có gọi tool):
`claude-sonnet-4-6` 2,4s · `claude-sonnet-5` 2,5s (**mặc định**) ·
`claude-haiku-4-5` 2,9s · `claude-opus-4-6` 3,2s · `claude-opus-4-7` 3,5s ·
`claude-opus-4-8` 4,7s. Bảng ở `src/services/agent/models.ts`.

⚠️⚠️ **TRANG `/rankings` NÓI DỐI VỀ CÁI KHOÁ NÀY MUA ĐƯỢC.** Nó liệt kê model
của toàn cổng. Khoá của web, đo thật 11/08/2026 bằng `GET /v1/models`, chỉ có
**8**: `gpt-5.6-sol` · `gpt-5.6-terra` · `gpt-5.5` · `gpt-5.4` ·
`gpt-5.4-mini` · `codex-auto-review` · `gpt-image-2` · `gpt-image-1.5`.
**KHÔNG có model Claude nào** — gọi `claude-sonnet-5` trả
`HTTP 503 "No available channel … under group default"`, nghe như cổng bận
nhưng nó vĩnh viễn cho tới khi có người mở kênh Anthropic trong Console.

**Phân model theo VIỆC, không theo module** — `PURPOSE_MODEL` trong
`gateway.ts`, đổi bằng `LLM_MODEL_<TÊN VIỆC>` chứ không sửa mã.

Giá đo thật 18/08/2026 (chênh lệch sổ của cổng, 3 lượt cùng một câu ~70 token
vào; cả 9 model đều qua hai bẫy suy luận và gọi tool đúng tham số):

| Model | Giá/lượt | Độ trễ | Trần token |
|---|---|---|---|
| `gpt-5.4-mini` | **0,116** | 5,8s | ✅ |
| `grok-4.6` | 0,341 | 65,7s | ❌ vượt 41× |
| `gpt-5.6-terra` | 0,484 | 7,3s | ✅ |
| `claude-sonnet-4-6` | 0,597 | ~12s | ✅ |
| `claude-sonnet-5` | 0,801 | ~9,8s | ✅ |
| `grok-4.5` | 1,058 | 24,5s | ❌ vượt 30× |
| `gpt-5.5` | 1,144 | 9,6s | ⚠️ vượt 5× |
| `gpt-5.6-sol` | 1,222 | 9,6s | ✅ |
| `claude-opus-4-8` | 2,003 | 12,3s | ✅ |

Phân hiện tại: việc chạy nền + việc máy đọc (`cv_parse`, `exphub_doc`,
`language_bulk`, `codelab_bulk`, `news_bulletin`, `robot_voice`) →
**`gpt-5.4-mini`** (rẻ hơn `sonnet-4-6` 5,1 lần). Việc người dùng đọc từng chữ
(`chat_max`, `cv_critique`, `interview_report`) → **`gpt-5.6-sol`** (rẻ hơn
opus 39%). Việc tương tác (`chat_pro`, `exam_grade`, `language_tutor`,
`codelab_coach`, `cv_writing`) và **`agent_code`** → giữ **`claude-sonnet-5`**.

⛔ **`doc_ocr` KHÔNG hạ.** Model rẻ rụng mũi tên vector `AB` → `|AB|`, và một
ký hiệu sai là hỏng cả bài toán.

⚠️ **`Upstream stream ended without a terminal response event` là lỗi TẢI,
không phải tính chất của model.** 18/08 thấy `gpt-5.6-terra` trả lỗi đó ngay
lời gọi tool đầu tiên, và suýt ghi vào đây là "model vỡ". Đo lại lúc không có
phép đo nào chạy song song: nó hoàn thành 5 lời gọi tool và trả lời đúng. Thấy
lỗi này thì đi kiểm xem có gì đang chạy chồng, đừng đổi model.

⛔ **Grok loại hẳn.** Không tôn trọng `max_tokens` (vượt 30–41×) ⇒ mọi trần chi
phí của web mất tác dụng với nó.

**GPT tính tiền cả token suy luận người dùng không thấy**: đo `usage` thật,
`gpt-5.5` 79/365 và `gpt-5.6-sol` 93/433 token ra là `reasoning_tokens`
(~21%); Claude báo 0. Nên "gpt rẻ hơn theo hệ số của shop" không suy ra được
từ hệ số — phải đo bằng sổ của cổng.

**Model cho agent (AI Code) người dùng CHỌN ĐƯỢC** — danh sách trắng ở
`src/services/agent/models.ts`, app chỉ gửi mã ngắn (`sonnet-5` / `opus-4-8` /
`gpt-sol`).

⚠️⚠️ **GIÁ LẺ MỘT LƯỢT KHÔNG SUY RA ĐƯỢC GIÁ TRONG VÒNG LẶP GỌI TOOL.** Đo 3
lượt trên đúng vòng lặp của agent (cùng câu hỏi, kho mã giả cố định):

| Model | 3 lượt | TB | Token **vào** TB |
|---|---|---|---|
| `claude-sonnet-5` | 1,23 · 2,28 · 1,77 | **1,76** | 3.719 |
| `gpt-5.6-terra` | 2,58 · 3,05 · 2,78 | 2,80 | 15.829 |
| `claude-opus-4-8` | 3,70 · 2,80 · 5,73 | 4,07 | 3.622 |
| `gpt-5.6-sol` | 13,49 · 13,21 · 11,59 | **12,77** | 19.215 |

Theo bảng giá lẻ thì `gpt-5.6-sol` (1,22) rẻ hơn `claude-opus-4-8` (2,00).
Trong vòng lặp thì NGƯỢC LẠI, và ngược tới ba lần. Lý do nằm ở cột token vào:
cổng bọc model GPT trong ~15k token ẩn mỗi việc, và phần bọc đó nhân theo số
vòng. Nên mặc định là **`claude-sonnet-5`**, rẻ hơn `gpt-5.6-sol` **7,3 lần**.
Nhãn trong app nói thẳng con số này để người dùng chọn có cơ sở.

**Ảnh: CHỈ `gpt-5.6-sol` nhìn được thật.** Đo bằng ảnh 1×1 px: sol trả lời
đúng; `gpt-5.5` / `gpt-5.6-terra` / `gpt-5.4-mini` nhận ảnh, không báo lỗi, và
bịa ("16×16", lần sau "48×48"). Vì thế mọi lượt chat có ảnh bị ép lên
`chat_vision` = sol, bất kể người dùng chọn bậc nào.

**PDF: KHÔNG model nào của khoá này đọc được file gốc** — cả khối `document`
(tuyến Anthropic) lẫn khối `file` (tuyến OpenAI) đều trả về "Vui lòng tải lên
file PDF". Trước 11/08 PDF đi thẳng vào Claude dạng gốc; đường đó không còn.
Thay thế: `buildUserContent()` trong `ai.service.ts` **rút chữ ở backend**
bằng `extractPdf()` của CV Builder (dựng lại dòng từ toạ độ chữ, nhận ra bản
scan) rồi gửi dạng văn bản, trần 60k ký tự cả lượt. Mất bố cục/bảng/ảnh trong
file, nhưng đọc được — đã kiểm end-to-end: PDF chứa "MA SO: 4242" +
"1.750.000.000", `gpt-5.6-sol` trả lời đúng cả hai. Cờ bật/tắt là
`isAnthropicModel(model)`: cắm kênh Claude vào là đường gốc tự quay lại.

**BA chốt chặn chi phí:**

0. **Việc chạy nền mặc định TẮT** (11/08/2026). `LLM_BACKGROUND_ENABLED`
   (mọi lời gọi `feature: 'bulk_gen' | 'news'`) và `TECH_NEWS_AUTOPOST` (bản
   tin 07:30) đều mặc định `false`. Trước đó bản tin mặc định BẬT — một biến
   bị quên là mỗi sáng tự sinh một bài báo và tự tính tiền. Chạy một đợt sinh
   nội dung: `docker exec -e LLM_BACKGROUND_ENABLED=true … node scripts/…`.
   Việc người dùng bấm (chat, chấm bài, gia sư, CV) KHÔNG bị ảnh hưởng.

1. `checkTokenQuota` — 300k token/người/ngày, Pro 1 triệu. **Không đặt env
   cũng có trần** (trước 11/08 để trống nghĩa là vô hạn, và đó là chốt chặn
   duy nhất của cả web).
2. `src/services/llm/budget.ts` — trần TIỀN theo ngày, hai mức: **mềm 15 $**
   cắt việc chạy nền (`feature: 'bulk_gen' | 'news'`), **cứng 40 $** cắt tất.
   Chi phí là ƯỚC LƯỢNG (cổng không công khai giá) → chỉ để bắt bất thường;
   có số thật thì đặt `LLM_PRICE_OVERRIDES`.

**Kiểm tra thật, đừng đọc mã mà đoán** — một model đổi tên hay một tuyến bị
đóng không hiện ra lúc build, nó hiện ra khi người dùng nhận câu trả lời trống:
```bash
npm run llm:check          # gọi thật mọi model đang phân cho các tính năng
npm run llm:check -- --models   # cổng đang bán những gì
```
Xem cấu hình đang chạy trên prod: `GET /api/v1/ai/admin/llm-config` (admin).

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
| 2026-07-30 | Sân chơi 3D `/playground` "kẹt mãi ở màn hình tải, không lỗi nào" suốt hai phiên. Thủ phạm: **Next.js chốt danh sách file trong `public/` ngay lúc SERVER KHỞI ĐỘNG**. Dựng lại sân chơi ⇒ gói JS đổi tên (mã băm nội dung) ⇒ server đang chạy trả **404** dù file có thật trên đĩa ⇒ không có JS nào chạy ⇒ màn hình tải (HTML/CSS thuần) quay mãi và **không có lỗi nào để thấy**. Preload `.ktx` vẫn 200 (tên không đổi) nên nhìn Network lại tưởng ổn | Đổi bất cứ thứ gì trong `frontend/public/**` thì **PHẢI khởi động lại Next**. Và **diệt server theo CỔNG** (`lsof -ti:3000 \| xargs -r kill -9`) — `pkill -f "next start"` và `pkill -f "standalone/server.js"` đều KHÔNG khớp vì Node đổi tên tiến trình thành `next-server`; server mới chết vì `EADDRINUSE` còn server cũ vẫn sống, làm lỗi trông như bất trị. **Production không dính** (Dockerfile `COPY . .` rồi mới `next build`, mỗi deploy là container mới) |
| 2026-08-08 | Đổi tên giá trị enum `ContentType.CODE` → `CODE_REVIEW` (để khớp frontend vốn đã nói `CODE_REVIEW`). Qua sạch toàn bộ pre-push checklist, vẫn **vỡ seed trên production**: `prisma/seed.ts` tự chép lại union `'VLOG' \| ... \| 'CODE' \| ...` nên nó tự kiểm với chính nó, và `tsconfig.json` lại **exclude `prisma/seed.ts`** | Union enum chép tay là mầm trôi dạt — import thẳng từ `@prisma/client`. Và `tsc --noEmit` KHÔNG đụng tới `prisma/**`: thêm `npm run typecheck:seed` + `npx prisma db seed` vào checklist khi đổi schema. Chạy thật mới biết, đọc không ra |
| 2026-07-30 | Chốt kiểm frontend trong `deploy.sh` gọi `wget` bên trong container frontend — image đó **không cài wget lẫn curl** (Dockerfile cố ý bỏ, healthcheck của compose dùng module http của node). Lệnh luôn thất bại ⇒ vòng lặp quay đủ 6 lần, tốn không ~25s mỗi deploy và không kiểm được gì | Mọi phép kiểm HTTP **bên trong container frontend** phải dùng `node -e` + `require('http')`. Container backend thì có `curl`. Kiểm bộ kiểm trước khi tin nó — xem [[feedback_verify_the_checker_before_the_content]] |
| 2026-08-23 | `next.config.js` khai `Cache-Control: public, max-age=604800` cho `/playground/**` (94MB tài nguyên) — và quy tắc đó **chưa từng có hiệu lực một ngày nào**. `location /` trong `nginx.conf` gọi `proxy_hide_header Cache-Control` rồi dán `no-store` lên MỌI response, nên nó gỡ đúng cái header Next vừa đặt. Cùng cơ chế đó nuốt luôn cache của cả `public/`: 12 logo SVG + robot.json tải lại mỗi lần điều hướng | **nginx thắng `next.config.js`, luôn luôn.** Đặt header cache trong Next mà không mở một `location` tương ứng ở nginx thì chỉ là trang trí. Muốn một nhánh giữ được header của chính nó thì phải cho nó `location` riêng và **không** `proxy_hide_header` ở đó. Kiểm bằng `curl -I`, đừng đọc config rồi tin |
| 2026-08-23 | `deploy-nha.sh` **chưa bao giờ deploy thay đổi nginx**. Cả file nhắc chữ `nginx` đúng một lần, trong một dòng chú thích; bước trên VPS chỉ có `docker compose up -d --no-build backend frontend`. Mà `nginx/nginx.conf` là bind-mount từ `/home/deployer/repo`, và từ khi bỏ `deploy.sh` (thứ có rsync) thì không còn gì cập nhật thư mục đó. Mọi thay đổi nginx đều "deploy thành công" mà không có hiệu lực — log xanh, smoke-test sạch, config mới nằm im trên máy | Đã thêm bước 6c vào `deploy-nha.sh`: so `sha256`, chỉ đẩy khi khác, `nginx -t` rồi mới `reload`. **Hỏng thì TRẢ BẢN CŨ VỀ NGAY** — `reload` với config sai thì vô hại (nginx giữ config cũ trong bộ nhớ), nhưng để file sai nằm lại trên đĩa là bom hẹn giờ: container `restart: unless-stopped`, lần khởi động lại kế tiếp nginx không lên nổi và cả web chết, vào lúc không ai đang deploy. Bài học chung: **thứ gì bind-mount thì nằm NGOÀI ảnh, nên đẩy ảnh không đụng tới nó** |
| 2026-08-25 | Bước 6c mới thêm báo `KQ=OK` — `nginx -t` xanh, `reload` xanh — nhưng **HTTP/2 vẫn tắt và mọi header cache vẫn `no-store`**, hai lần deploy liền. Thủ phạm: nó thay file bằng `mv`. `nginx/nginx.conf` là **bind-mount một FILE ĐƠN**, mà Docker gắn file đơn theo **INODE** lúc container khởi động, không theo đường dẫn. `mv` trỏ đường dẫn host sang inode MỚI ⇒ container vẫn đọc inode CŨ ⇒ `nginx -t` kiểm config cũ (hợp lệ), `reload` nạp lại config cũ, script báo OK, không gì thay đổi | **Ghi ĐÈ TẠI CHỖ (`cat mới > conf`), không bao giờ `mv`/`rsync`/`sed -i`/`:w` của vim** — tất cả đều ghi file tạm rồi đổi tên. Và thêm chốt: so `sha256` file trên host với `docker exec … sha256sum /etc/nginx/nginx.conf`; lệch thì trả bản cũ về và dừng. Bài học rộng hơn: **"đã ghi" ≠ "container đọc được"** — với bind-mount file đơn, phải kiểm từ BÊN TRONG container |
| 2026-08-25 | Kết luận **SAI** rằng `/blog/<slug>` và `/tech-trends/<slug>` không thể trùng. Lý lẽ đọc từ mã hoàn toàn đúng — hai bảng riêng, hai endpoint riêng, không có đường rẽ chéo, không chỗ nào ghi cả hai. Nhưng production trả 200 cho CẢ HAI CHIỀU: `posts` và `tech_trend_articles` **có slug trùng nhau trong DỮ LIỆU** (cuộc gộp blog 05/08 chép nội dung sang bảng mới mà không xoá bảng cũ) | **Mã nói về khả năng, dữ liệu nói về thực tế.** "Mã không thể tạo ra trạng thái X" không suy ra được "trạng thái X không tồn tại" — dữ liệu có lịch sử riêng, do migration và thao tác tay tạo ra. Câu hỏi về trạng thái dữ liệu thì phải HỎI DỮ LIỆU. Ở đây một lệnh `curl` là đủ, và tôi đã có sẵn nó trong tay mà không chạy |

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
