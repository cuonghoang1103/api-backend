# LabFlow API — mã nguồn của khoá API & System Design

Bản chụp **bền** của dự án xuyên khoá `/courses/api-design` (đặt phòng lab/thiết bị, Node 22 + Express 5).
Trước 01/11/2026 mã chỉ nằm ở thư mục tạm của phiên soạn bài và trong các gói zip trên R2
(`https://media.cuongthai.com/files/academy/API/v1/labflow-api-chN.zip`). Mỗi chương soạn xong đã
**cập nhật thư mục này** cho khớp với gói zip của chương đó; khoá đã trọn Chương 0–12 (01/11/2026) — đây là bản cuối.

| Trạng thái hiện tại | Gói zip tương ứng |
|---|---|
| **BẢN CUỐI KHOÁ — cuối Chương 12** (kho PostgreSQL + migration, Redis dùng chung, outbox + worker, `ops/`, Lab 12, OpenAPI 2.4.0) | `labflow-api-final.zip` |
| (cuối Chương 11 — commit def9418f8) | `labflow-api-ch11.zip` |
| (cuối Chương 10 — commit 745e25e09) | `labflow-api-ch10.zip` |
| (cuối Chương 9 — commit e1f36a6b7) | `labflow-api-ch9.zip` |

Chỉ để HỌC. Không có bí mật thật: token demo `tok_an` / `tok_bin` / `tok_lan`, mật khẩu demo
`an-lab-2026` / `binh-lab-2026` / `lan-lab-2026`, khoá JWT mặc định `dev-only-secret-change-me` (chỉ ngoài production).

## Chạy

```bash
# Node 22 (máy soạn bài: ~/.nvm/versions/node/v22.23.3)
npm ci                 # phiên bản đã GHIM chính xác trong package.json + package-lock.json
npm start              # http://localhost:4000 — kho RAM, không cần PostgreSQL/Redis
npm test               # 18 test (17 đạt + 1 bỏ qua: outbox chỉ có ở kho pg) — không cần PostgreSQL/Redis
```

Phần cần dịch vụ ngoài (chỉ bật khi đặt biến):

| Chương | Cần | Lệnh |
|---|---|---|
| 3, 8.4, 9 | PostgreSQL 18 ở `:55432`, user/db `labflow` (biến `PGURL`) | `pg_ctl -D pgdata -o "-p 55432" start` |
| 9.3 | replica streaming ở `:55433` (`PG_REPLICA_URL`, `recovery_min_apply_delay = '2s'`) | `pg_basebackup … -D pgreplica -R` |
| 9.2, 10 | Redis 8.2 ở `:6390` (`LABFLOW_REDIS`) | `redis-server --port 6390 --save "" --appendonly no` |
| 10.2–10.6 | worker BullMQ chạy riêng | `node src/worker.js` (cùng biến môi trường với API) |
| 12 | kho PostgreSQL (`LABFLOW_STORE=pg`, `DATABASE_URL`) + Redis; hai instance + worker + proxy kiểm sức khoẻ | `npm run db:migrate && npm run db:seed` rồi `bash ops/dev-stack.sh start` (A :4200, B :4201, proxy :8180) · `npm run test:pg` (CSDL `*_test`) · `node ops/smoke.mjs http://localhost:8180` |

Biến hay dùng: `LABFLOW_PG=1` (route Chương 9 + webhook 10.5), `LABFLOW_JOBS=memory|bullmq`, `LABFLOW_EVENTS=memory|redis`, `LABFLOW_WEBHOOK_ALLOW_LOCAL=1` (chỉ máy mình), `EXPORT_BATCH_MS`, `LABFLOW_BOOKING_LIMIT=1000000/60` (chỉ để đo), `LABFLOW_CACHE_MODE=none|redis|singleflight`,
`LABFLOW_READS=replica|token`, `SEED_BOOKINGS=n`, `LABFLOW_IP_LIMIT=1000000/60` (chỉ để test tải),
`LABFLOW_IDEMPOTENCY=pg`, `LABFLOW_CHAOS=1`, `LABFLOW_VULN=1` (CHỈ để học bảo mật, Chương 6).
Mô tả đầy đủ từng chương: `content/courses/api-design/_HOP-DONG.md` mục 5.

## Thư mục

- `src/` — server (`server.js`, `app.js`, `worker.js`), kho dữ liệu `src/store/` (`memory.js` | `pg.js`, chọn bằng `LABFLOW_STORE`), `pg.js` (một pool), `migrate.js` + `seed-pg.js`, `relay.js`/`notify.js`/`mailer.js` (outbox ⇒ hàng đợi ⇒ email), `config.js` (kiểm cấu hình khi khởi động), `log.js`/`metrics.js`, route trong `src/routes/`, middleware theo chương (problems, paging,
  versioning, idempotency, rateLimit, auth, cors, timing, resilience, httpCache, serverCache…).
- `migrations/` — `001_core` … `004_issues` (Chương 12; `004` là lời giải Lab 12); `ops/` — `dev-stack.sh`, `smoke.mjs`, `backup.sh` (bài 12.7).
- `openapi/` — hợp đồng OpenAPI 3.1 (`openapi.yaml` 2.4.0) + bản mốc, kiểm trôi (`check-drift.mjs`), cổng phá vỡ (`diff.mjs`).
- `interview/` — Chương 11 (ước lượng, rút gọn link, feed, chat, cuộc đua đặt lịch); `perf/` — script đo của Chương 8–10; `sql/` — SQL của Chương 9; `lab/` — mã khởi đầu của các lab + `lab/grade-lab10.mjs`, `lab/grade-lab11.mjs`, `lab/grade-lab12.mjs` (script chấm), `lab/lab11/` (đề phỏng vấn thử + lời giải), `lab/lab12/` (tệp khởi đầu Lab 12).
- `events/` (giao trùng, outbox, mỏng/dày, phiên bản), `asyncapi/` (AsyncAPI 3.1), `webhooks/` (bên nhận thử, phát lại) — Chương 10. Lệnh từng bài của chương mới nhất: `docs/chay-theo-bai.txt` (= README.txt trong gói zip).
- `client/`, `graphql/`, `grpc/` — Chương 7; `web/` — trang thử CORS/CSRF của Chương 6 (`node web/serve.mjs`);
  `mistakes/` — ví dụ client sai kiểu (bài 7.3).

## Cập nhật bản chụp sau mỗi chương

```bash
rsync -a --delete --exclude node_modules --exclude README.md --exclude .gitignore --exclude tmp/ \
  <thư mục làm việc>/labflow-chN/ content/courses/api-design/_labflow-api/
npm ci && npm test       # chạy trên bản sao sạch trước khi commit
gitleaks dir content/courses/api-design/_labflow-api --config .gitleaks.toml --no-banner
```
Rồi sửa bảng “Trạng thái hiện tại” ở trên và ghi vào `_BAN-GIAO.md`.
