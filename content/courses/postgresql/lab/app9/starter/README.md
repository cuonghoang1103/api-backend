# CT Shop API — Lab 9 starter (capstone of cuongthai.com/courses/postgresql)

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
C1 — finish `sql/roles.sql` (the TODOs), then run it:
```
docker cp sql/roles.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/roles.sql
```

## 2 · The app / Ứng dụng
```
npm ci                         # exact versions from package-lock.json
cp .env.example .env           # Windows PowerShell: Copy-Item .env.example .env
npx prisma db pull             # C2 — 8 models + a warning: read it
npx prisma generate
npm run dev                    # http://localhost:3009/health
```
One-off environment variables (e.g. the SQL log):

| macOS / Linux / Git Bash | Windows PowerShell | Windows cmd |
|---|---|---|
| `LOG_SQL=1 npm run dev` | `$env:LOG_SQL="1"; npm run dev` | `set LOG_SQL=1&& npm run dev` |

## 3 · The tasks / Việc phải làm (details on the lab page)
| | What | Where |
|---|---|---|
| C1 | owner role vs app role, timeouts on the roles | `sql/roles.sql` |
| C2 | db pull → a baseline migration `0_init` that rebuilds the REAL schema → `migrate resolve --applied` | `prisma/` |
| C3 | BigInt in JSON, keyset pagination, N+1 measured (`npm run n1`) | `src/app.js`, `src/routes/products.js` |
| C4 | rename `orders.note` → `delivery_note` with expand / contract, while v1 keeps running | `prisma/migrations/`, `src/routes/orders.js` |
| C5 | checkout in ONE transaction, two buyers at once, deadlock + retry (`npm run race`) | `src/checkout.js` |
| C6 | payment + the pool: P2024 under load, the fix (`npm run load -- …`) | `src/routes/orders.js`, `src/loi.js` |
| C7 | the revenue report (`$queryRaw` + window functions), log → EXPLAIN → index migrations `CONCURRENTLY` | `src/routes/reports.js`, `prisma/` |
| C8 | `npm test` green (it rebuilds `ctlab9_test` from YOUR migrations, then runs `test/*.test.js`) | everything |
| C9 | `sql/kiem-tra.sql` read line by line · a restore drill with `sql/dem-dong.sql` | `sql/` |

Prisma CLI commands use `DIRECT_URL` (the owner); the running app uses `DATABASE_URL` (the app role).
`migrate dev` needs a shadow database that the owner role may not create (you will see why) — generate SQL with
`npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`,
put it in `prisma/migrations/<timestamp>_<name>/migration.sql`, apply it with `npx prisma migrate deploy`.

`npm audit` reports 3 moderate issues in `autocannon`'s dependencies (dev-only load tool, never deployed). Leave them.
Never commit `.env`.
