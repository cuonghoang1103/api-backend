# CT Shop API — Lab 9 SOLUTION (capstone of cuongthai.com/courses/postgresql)

> The answer key. Open it after your own attempt — and compare, do not copy: the lab page explains every choice.
> *Đáp án. Mở sau khi tự làm — so sánh, đừng chép: trang lab giải thích từng lựa chọn.*

Node 22 · Prisma 5.22 · Express 5 · PostgreSQL 17. The ticket, the requirements C1–C9, the hints and the real outputs
are on the lab page: **Lab 9 — CT Shop: an API for the mobile app** (after Chapter 16).
*Đề bài, yêu cầu C1–C9, gợi ý và output thật nằm trên trang Lab 9 của khoá. Tệp này chỉ là cách chạy.*

## 0 · What you need / Cần có
- **Node.js 22** (`node -v` ⇒ v22.x) — <https://nodejs.org> (Windows: the installer; macOS: `brew install node@22`; Linux: nvm or your distro).
- **Docker** with the PostgreSQL 17 container of lesson 0.3, published on port **5444**, password **123456**:
  `docker run -d --name pgdemo -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17`
  (your container of lesson 0.3 may be called `pg17` — then write `pg17` wherever this file says `pgdemo`).
- `lab9-start.sql` from the lab page (the standard CT Shop + 2023–2024 history: 302.000 orders).

Every command below is the same on **macOS, Linux and Windows** (PowerShell or Git Bash) unless a line says otherwise.

## 1 · The database / Cơ sở dữ liệu
```
docker exec -it pgdemo createdb -U postgres ctlab9
docker cp lab9-start.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/lab9-start.sql
```
C1 — the two roles, the grants, the default privileges and the timeouts:
```
docker cp sql/roles.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/roles.sql
```

## 2 · The app / Ứng dụng
```
npm ci                         # exact versions from package-lock.json
cp .env.example .env           # Windows PowerShell: Copy-Item .env.example .env
npx prisma generate            # the schema and the 5 migrations are already in prisma/
npx prisma migrate resolve --applied 0_init      # C2 — ctlab9 ALREADY has these tables: record the baseline, do not run it
docker cp sql/sau-baseline.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/sau-baseline.sql   # C2 — take the migration history away from the app
npx prisma migrate deploy      # C4 + C7 — expand, contract, the two CONCURRENTLY indexes (as ctshop_owner)
npx prisma migrate status      # "Database schema is up to date!"
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
                               # "-- This is an empty migration." = the database and schema.prisma agree
npm run dev                    # http://localhost:3009/health
```
⚠ Running the solution in one go skips the point of C4 (v1 and v2 side by side). Do C4 by hand with the starter.

| macOS / Linux / Git Bash | Windows PowerShell | Windows cmd |
|---|---|---|
| `LOG_SQL=1 npm run dev` | `$env:LOG_SQL="1"; npm run dev` | `set LOG_SQL=1&& npm run dev` |

## 3 · Where each answer is / Đáp án nằm ở đâu
| | Answer | Files |
|---|---|---|
| C1 | owner owns everything, app touches rows only; default privileges; role timeouts | `sql/roles.sql` |
| C2 | `0_init` = `migrate diff --from-empty` + 11 CHECKs + IDENTITY by hand; `resolve --applied`; revoke `_prisma_migrations` | `prisma/migrations/0_init`, `sql/sau-baseline.sql` |
| C3 | json replacer; keyset `?before=`; nested `select` (3 SQL) instead of a loop (66–68 SQL) | `src/app.js`, `src/routes/products.js`, `scripts/n-cong-1.js` |
| C4 | expand (column + sync trigger + back-fill) → v2 → contract | `prisma/migrations/2026102609*` |
| C5 | atomic `updateMany … stock >= qty … decrement`, sorted cart, retry on 40001 / 40P01 (as Prisma 5.22 really reports them) | `src/checkout.js` |
| C6 | gateway outside the transaction; P2024 / P2028 ⇒ 503 | `src/routes/orders.js`, `src/loi.js` |
| C7 | `$queryRaw` report; two indexes, one CONCURRENTLY statement per migration; 55P03 ⇒ 503 | `src/routes/reports.js`, `prisma/migrations/2026102610*` |
| C8 | 8 tests on a database rebuilt from the migrations | `test/api.test.js`, `scripts/dung-db-kiem-thu.js` |
| C9 | checklist; restore drill (below) | `sql/kiem-tra.sql`, `sql/dem-dong.sql` |

## 4 · Restore drill / Diễn tập khôi phục (C9)
```
docker exec pgdemo pg_dump -U postgres -Fc -d ctlab9 -f /tmp/ctlab9.dump
docker exec pgdemo createdb -U postgres -O ctshop_owner ctlab9_restore
docker exec pgdemo pg_restore -U postgres -d ctlab9_restore /tmp/ctlab9.dump
docker cp sql/dem-dong.sql pgdemo:/tmp/
docker exec pgdemo psql -U postgres -d ctlab9 -f /tmp/dem-dong.sql > before.txt
docker exec pgdemo psql -U postgres -d ctlab9_restore -f /tmp/dem-dong.sql > after.txt
diff before.txt after.txt      # Windows PowerShell: Compare-Object (Get-Content before.txt) (Get-Content after.txt)
```
Nothing printed = identical. Then point `DIRECT_URL` at `ctlab9_restore` and run `npx prisma migrate status`, and the app at it
and call `/orders/1841`. Last: the database-level REVOKE/GRANT CONNECT did NOT come back — see the lab page.

`npm audit` reports 3 moderate issues in `autocannon`'s dependencies (dev-only load tool, never deployed). Never commit `.env`.
