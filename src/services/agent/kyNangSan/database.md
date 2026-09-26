---
name: database
description: Cơ sở dữ liệu PostgreSQL/MySQL/SQL Server/MongoDB — thiết kế bảng/khoá/quan hệ, migration AN TOÀN không mất dữ liệu (Prisma, EF Core, Flyway, Alembic, Django, Laravel), index + EXPLAIN, query chậm, N+1, transaction, backup/restore, seed, SQL injection. Dùng khi đụng schema, migration, truy vấn hay DB lỗi.
---

# KỸ NĂNG: DATABASE — schema đúng, migration không mất dữ liệu, truy vấn nhanh

Mục tiêu: dữ liệu của người dùng KHÔNG BAO GIỜ mất vì bạn, schema phản ánh đúng nghiệp vụ, mọi thay đổi
đi qua migration có lịch sử, và bạn đã TỰ KIỂM bằng truy vấn thật — không phải "chắc là đúng".

## 0. Luật vàng (đọc trước mọi thứ)

1. **Dữ liệu là thứ duy nhất không build lại được.** Mã sai thì sửa; bảng bị DROP thì chỉ còn backup.
   Mọi lệnh có thể xoá dữ liệu ⇒ nói rõ tác động, chờ người dùng đồng ý (xem mục 12).
2. **Biết mình đang trỏ vào DB nào TRƯỚC khi chạy bất cứ gì.** Đọc `DATABASE_URL`/`ConnectionStrings`/
   `spring.datasource.url`/`.env` và nói ra: "đang trỏ localhost:5432/app_dev". Thấy host lạ, tên có `prod`,
   IP VPS ⇒ DỪNG, hỏi. Không in mật khẩu trong chuỗi kết nối — che nó khi nhắc lại.
3. **Lệnh không tương tác.** Bạn không trả lời được lời nhắc của `psql`, `prisma migrate dev`, `mysql -p`.
   ```bash
   psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -P pager=off -c "select now();"
   mysql -h 127.0.0.1 -u app -p"$MYSQL_PWD" app -e "select now();"      # hoặc export MYSQL_PWD
   sqlcmd -S localhost,1433 -U sa -P "$SA_PASSWORD" -C -b -Q "SELECT GETDATE()"   # -C: tin chứng chỉ tự ký
   mongosh "$MONGO_URL" --quiet --eval 'db.runCommand({ping:1})'
   ```
   Lệnh chờ gõ tay (`mysql -p` trần, `psql` không `-c`) ⇒ treo tới hết giờ.
4. **Đọc schema hiện có trước khi thiết kế thêm.** `prisma/schema.prisma`, các lớp `@Entity`, `DbContext`,
   `models.py`, thư mục migrations. Hỏi dữ liệu thật: `\d+ ten_bang` (psql), `SHOW CREATE TABLE`, `sp_help`.
5. **Kiểm bằng truy vấn, không bằng log.** "Migration applied" chưa phải bằng chứng. Bằng chứng là
   `select count(*)`, cột mới có mặt, dữ liệu cũ còn nguyên, app gọi được API đọc/ghi bảng đó.

## 1. Thiết kế schema

- Mỗi bảng một khoá chính. Mặc định `bigint` tự tăng hoặc `uuid` (lộ ra URL thì dùng uuid/không đoán được).
- Chuẩn hoá tới 3NF: không lặp nhóm cột (`phone1, phone2` ⇒ bảng con), không lưu thứ tính được, không nhét
  danh sách vào chuỗi phân tách dấu phẩy. Phi chuẩn hoá chỉ khi đã ĐO thấy chậm, và ghi lý do.
- Quan hệ: 1-n ⇒ khoá ngoại ở phía "n"; n-n ⇒ bảng nối có khoá chính kép `(a_id, b_id)`; 1-1 ⇒ khoá ngoại + `UNIQUE`.
- Ràng buộc ở DB, không chỉ ở code: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `FOREIGN KEY ... ON DELETE` chọn
  có chủ đích (`RESTRICT` mặc định an toàn; `CASCADE` chỉ khi con không có nghĩa khi mất cha — và nhớ cascade
  xoá cả dữ liệu người dùng đã tạo, như tiến độ học, bình luận).
- Tiền: `numeric(12,2)` / `decimal(12,2)`, KHÔNG `float`. Thời gian: PG `timestamptz`, SQL Server `datetime2`/
  `datetimeoffset`, MySQL `DATETIME` lưu UTC (quy ước ghi rõ). Enum: bảng tra cứu hoặc enum của DB — đổi tên giá
  trị enum là một migration thật.
- Xoá mềm (`deleted_at`) khi cần khôi phục/kiểm toán — nhưng mọi truy vấn phải lọc nó, và `UNIQUE` phải tính tới nó
  (PG: unique index một phần `WHERE deleted_at IS NULL`).
- Prisma: mỗi quan hệ cần trường ngược lại ở model kia; hai quan hệ tới cùng một model ⇒ đặt `@relation("Ten")`.
  `@@unique([a, b], name: "ten_rieng")` ⇒ truy vấn phải dùng `where: { ten_rieng: { a, b } }`, không phải `a_b`.

## 2. Migration AN TOÀN — các mẫu không mất dữ liệu

**Thêm cột bắt buộc vào bảng đã có dữ liệu** — ba bước, không bao giờ một phát `NOT NULL` không default:
```sql
ALTER TABLE users ADD COLUMN phone varchar(20);                 -- 1. nullable
UPDATE users SET phone = '' WHERE phone IS NULL;                -- 2. backfill (bảng lớn: chia lô theo id)
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;              -- 3. ràng buộc (PG); MySQL: MODIFY ... NOT NULL
```
**Đổi tên cột** — công cụ autogenerate (Prisma, Alembic, TypeORM) thường sinh `DROP` + `ADD` ⇒ MẤT dữ liệu cột đó.
Luôn mở file SQL sinh ra và thay bằng `ALTER TABLE t RENAME COLUMN a TO b;` (SQL Server: `EXEC sp_rename 't.a', 'b', 'COLUMN';`).
App đang chạy thật và không được gián đoạn ⇒ 2 bước: thêm cột mới + ghi cả hai + backfill → deploy → chuyển đọc
sang cột mới → deploy → xoá cột cũ ở migration sau.
**Đổi kiểu cột** — thử trên bản sao trước: `varchar → int` hỏng khi có một dòng không phải số. Kiểm trước:
`SELECT count(*) FROM t WHERE col !~ '^[0-9]+$';` (PG).
**Thêm UNIQUE / FOREIGN KEY** — tìm dòng vi phạm TRƯỚC, không thì migration chết giữa chừng:
```sql
SELECT email, count(*) FROM users GROUP BY email HAVING count(*) > 1;
SELECT o.id FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE u.id IS NULL;   -- mồ côi
```
**Xoá cột/bảng** — chỉ khi người dùng đồng ý rõ, sau khi code không còn đọc nó, và có backup.
**Đã deploy thì không sửa file migration cũ** — viết migration mới. Sửa file đã chạy làm lệch checksum (Flyway,
Prisma báo "modified after applied") và các máy khác không bao giờ nhận thay đổi đó.

Luôn: backup (mục 7) → chạy migration trên bản sao/DB dev có dữ liệu giống thật → đếm dòng trước/sau → mới tới prod.

## 3. Lệnh migration theo từng công cụ

| Công cụ | Tạo migration | Áp dụng (prod) | Xem trạng thái / SQL |
|---|---|---|---|
| **Prisma** | `npx prisma migrate dev --create-only --name ten` (tạo file, CHƯA chạy — đọc SQL rồi mới chạy) | `npx prisma migrate deploy` | `npx prisma migrate status` |
| **EF Core** | `dotnet ef migrations add Ten` | `dotnet ef database update` hoặc `dotnet ef migrations script --idempotent -o migrate.sql` | `dotnet ef migrations list` |
| **Flyway** (Spring) | file `src/main/resources/db/migration/V2__them_phone.sql` | tự chạy khi app khởi động | `flyway info` |
| **Liquibase** | changeset trong `db.changelog-master.yaml` | tự chạy / `liquibase update` | `liquibase status` |
| **Alembic** | `alembic revision --autogenerate -m "them phone"` | `alembic upgrade head` | `alembic current`, `alembic upgrade head --sql` |
| **Django** | `python manage.py makemigrations` | `python manage.py migrate` | `showmigrations`, `sqlmigrate app 0002` |
| **Laravel** | `php artisan make:migration add_phone_to_users` | `php artisan migrate --force` | `migrate:status`, `migrate --pretend` |
| **TypeORM** | `npx typeorm migration:generate src/migrations/Ten -d src/data-source.ts` | `npx typeorm migration:run -d src/data-source.ts` | `migration:show` |
| **Sequelize** | `npx sequelize-cli migration:generate --name ten` | `npx sequelize-cli db:migrate` | `db:migrate:status` |

Ghi chú:
- `dotnet ef` chưa có ⇒ `dotnet tool install --global dotnet-ef`. Cần package `Microsoft.EntityFrameworkCore.Design`.
- `prisma migrate dev` phát hiện drift sẽ ĐỀ NGHỊ RESET (xoá sạch DB). Trong môi trường không tương tác nó báo lỗi —
  đừng "chữa" bằng `migrate reset`. Xem drift: `npx prisma migrate diff --help` (tên cờ đổi giữa các bản Prisma), rồi
  so DB với schema và báo người dùng.
- Sau khi đổi `schema.prisma` luôn `npx prisma generate`, rồi khởi động lại server — process cũ còn giữ client cũ.
- JPA: prod đặt `spring.jpa.hibernate.ddl-auto=validate` (hoặc `none`) và để Flyway/Liquibase lo schema.
  `update` không bao giờ xoá/đổi tên đúng, `create-drop` xoá sạch khi tắt app.
- Alembic autogenerate KHÔNG nhận ra đổi tên và nhiều thay đổi kiểu — luôn đọc file sinh ra trước khi `upgrade`.
- EF: đọc file migration sinh ra; thấy `DropColumn` + `AddColumn` ở chỗ bạn chỉ đổi tên ⇒ sửa thành `RenameColumn`.

## 4. Index và đọc kế hoạch truy vấn

Đo trước, index sau. Lấy câu truy vấn chậm THẬT (log ORM, `pg_stat_statements`, slow query log) rồi:
```sql
-- PostgreSQL: ANALYZE chạy THẬT câu lệnh ⇒ với UPDATE/DELETE bọc trong transaction rồi ROLLBACK
BEGIN; EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20; ROLLBACK;
-- MySQL 8.0.18+
EXPLAIN ANALYZE SELECT ...;
-- SQL Server
SET STATISTICS IO, TIME ON; SELECT ...;   -- đọc "logical reads"; kế hoạch thật: SET STATISTICS XML ON
```
Đọc: `Seq Scan` trên bảng lớn với bộ lọc chọn lọc ⇒ thiếu index; `rows` ước lượng lệch xa `actual rows` ⇒ chạy
`ANALYZE ten_bang`; `Sort` tốn bộ nhớ ⇒ index khớp cả `ORDER BY`. MySQL: cột `type = ALL` là quét toàn bảng.

Quy tắc index:
- Index cột trong `WHERE`, `JOIN`, `ORDER BY` hay dùng. Index nhiều cột: cột lọc bằng `=` trước, cột khoảng/sắp xếp sau:
  `CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);`
- Khoá ngoại: PG và SQL Server KHÔNG tự tạo index cho nó (MySQL InnoDB có) — thêm tay.
- `WHERE lower(email) = ...` cần index biểu thức; `LIKE '%abc'` không dùng được B-tree.
- Bảng lớn đang chạy thật trên PG: `CREATE INDEX CONCURRENTLY` (không khoá ghi, nhưng không chạy được trong transaction —
  kiểm công cụ migration có bọc transaction không).
- Mỗi index làm chậm ghi và tốn đĩa. Không index mọi cột.

## 5. N+1 — kẻ giết hiệu năng số một của ORM

Triệu chứng: một trang gọi 1 truy vấn danh sách + N truy vấn con. Bật log truy vấn để THẤY nó:
Prisma `new PrismaClient({ log: ['query'] })` · EF `optionsBuilder.LogTo(Console.WriteLine)` ·
Spring `spring.jpa.show-sql=true` · SQLAlchemy `create_engine(url, echo=True)` · Django `connection.queries` ·
Laravel `DB::enableQueryLog()` · TypeORM `logging: true`.

Sửa bằng nạp kèm: Prisma `include`/`select` lồng · EF `.Include(x => x.Items)` · JPA `JOIN FETCH` hoặc `@EntityGraph` ·
SQLAlchemy `selectinload()` · Django `select_related` (FK) / `prefetch_related` (n-n, ngược) · Laravel `with('items')` ·
TypeORM `relations: [...]`. Kiểm lại bằng log: số truy vấn phải không đổi khi số dòng tăng.
Chỉ `select` cột cần dùng; danh sách luôn có phân trang (`take/skip` hoặc keyset `WHERE id < :cursor`).

## 6. Transaction, đồng thời, kết nối

- Nhiều lệnh ghi phải cùng thành/cùng bại ⇒ một transaction. Prisma `prisma.$transaction(async (tx) => {...})`,
  Spring `@Transactional` (chỉ có tác dụng khi gọi qua proxy — gọi từ chính lớp đó thì không), EF `BeginTransaction`
  (một `SaveChanges` đã là một transaction), Django `transaction.atomic()`, Laravel `DB::transaction(fn() => ...)`.
- Không gọi HTTP/API ngoài bên trong transaction — giữ khoá lâu, và API không rollback được.
- Trừ kho/đặt chỗ: KHÔNG đọc-rồi-ghi trong code (hai request cùng thấy còn 1). Làm nguyên tử trong DB:
  ```sql
  UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock >= 1;   -- 0 dòng bị ảnh hưởng = hết hàng
  ```
  hoặc `SELECT ... FOR UPDATE` trong transaction, hoặc cột `version` (optimistic locking — JPA `@Version`, EF `[ConcurrencyCheck]`/rowversion).
- Isolation mặc định: PG/SQL Server `READ COMMITTED`, MySQL InnoDB `REPEATABLE READ`. Nâng lên `SERIALIZABLE` thì phải
  bắt lỗi serialization và thử lại.
- Pool: mỗi tiến trình một client/pool dùng chung (Prisma: MỘT `PrismaClient` cho cả app — tạo mới mỗi request ⇒ cạn kết nối;
  Next.js dev hot-reload ⇒ lưu vào `globalThis`). Kiểm: `SELECT count(*) FROM pg_stat_activity;` so với `SHOW max_connections;`.
  Serverless ⇒ dùng pooler (PgBouncer/Supabase pooler) và giới hạn `connection_limit`.

## 7. Backup và restore (chưa thử restore = chưa có backup)

```bash
# PostgreSQL — định dạng custom, khôi phục chọn lọc được
pg_dump "$DATABASE_URL" -Fc -f backup_$(date +%Y%m%d_%H%M).dump
createdb app_restore_test && pg_restore --no-owner --no-privileges -d app_restore_test backup_*.dump
# MySQL/MariaDB — nhất quán không khoá bảng InnoDB
mysqldump --single-transaction --routines --triggers -h 127.0.0.1 -u root app > app.sql
mysql -u root app_restore_test < app.sql
# SQL Server (đường dẫn là của MÁY CHỦ SQL, không phải máy bạn)
sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "BACKUP DATABASE [App] TO DISK='/var/opt/mssql/backup/App.bak' WITH INIT"
sqlcmd ... -Q "RESTORE FILELISTONLY FROM DISK='/var/opt/mssql/backup/App.bak'"   # lấy tên logical để WITH MOVE
# MongoDB
mongodump --uri "$MONGO_URL" --archive=app.archive --gzip
mongorestore --uri "$MONGO_TEST_URL" --archive=app.archive --gzip --nsFrom='app.*' --nsTo='app_test.*'
```
DB trong Docker: `docker compose exec -T db pg_dump -U postgres app > app.sql` (`-T` để không cấp TTY — thiếu là hỏng file).
Khôi phục THỬ vào một DB khác rồi đếm dòng vài bảng chính. Không bao giờ restore đè lên DB đang chạy khi chưa được đồng ý.

## 8. Seed dữ liệu

- Seed phải chạy lại được nhiều lần (idempotent): dùng upsert theo khoá tự nhiên, không `createMany` mù.
  Prisma `upsert({ where: { email }, update: {}, create: {...} })` · SQL `INSERT ... ON CONFLICT (email) DO NOTHING` ·
  Laravel `updateOrCreate` · Django `get_or_create`.
- Seed lại KHÔNG được xoá dữ liệu người dùng đã tạo: `deleteMany()` rồi tạo lại ⇒ `ON DELETE CASCADE` xoá theo tiến độ,
  bình luận, đơn hàng. Đổi thì cập nhật tại chỗ.
- Lệnh: `npx prisma db seed` (khai trong `package.json`/`prisma.config`), `php artisan db:seed`, `python manage.py loaddata`,
  EF `HasData` (vào migration) hoặc seeder chạy lúc khởi động.
- Kiểu trong script seed phải lấy từ ORM (`import { Role } from '@prisma/client'`), không chép tay union/enum — bản chép tay
  lệch với schema mà vẫn xanh kiểu. Và nhiều dự án loại thư mục seed khỏi `tsconfig` ⇒ chạy seed thật mới biết nó còn sống.

## 9. SQL injection — luôn tham số hoá

```js
// SAI — nối chuỗi
db.query(`SELECT * FROM users WHERE email = '${email}'`);
prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`);
// ĐÚNG
db.query('SELECT * FROM users WHERE email = $1', [email]);             // node-postgres; mysql2 dùng ?
prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;          // template có thẻ ⇒ tự tham số hoá
```
Java `PreparedStatement ps = conn.prepareStatement("... WHERE email = ?"); ps.setString(1, email);` · JPA `:email` +
`setParameter` · Python `cur.execute("... WHERE email = %s", (email,))` · C# `FromSqlInterpolated($"... {email}")` hoặc
`SqlParameter` (không `FromSqlRaw` với chuỗi nối) · Laravel `DB::select('... where email = ?', [$email])` ·
MongoDB: ép kiểu đầu vào thành chuỗi — `{ email: req.body.email }` nhận được `{ "$ne": null }` ⇒ đăng nhập không cần mật khẩu.
Tên cột/hướng sắp xếp KHÔNG tham số hoá được ⇒ danh sách trắng: `const cot = ['name','created_at'].includes(q) ? q : 'created_at'`.

## 10. Khác biệt cú pháp PG / MySQL / SQL Server

| Việc | PostgreSQL | MySQL | SQL Server |
|---|---|---|---|
| Giới hạn dòng | `LIMIT 10 OFFSET 20` | `LIMIT 20, 10` / `LIMIT 10 OFFSET 20` | `ORDER BY id OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY` / `TOP 10` |
| Tự tăng | `GENERATED ALWAYS AS IDENTITY` / `serial` | `AUTO_INCREMENT` | `IDENTITY(1,1)` |
| Upsert | `ON CONFLICT (k) DO UPDATE SET ...` | `ON DUPLICATE KEY UPDATE ...` | `MERGE` (cẩn thận đồng thời) |
| Trích tên | `"Ten"` (phân biệt hoa thường!) | `` `Ten` `` | `[Ten]` |
| Nối chuỗi | `a \|\| b` | `CONCAT(a, b)` | `a + b` / `CONCAT` |
| Bây giờ (UTC) | `now()` (timestamptz) | `UTC_TIMESTAMP()` | `SYSUTCDATETIME()` |
| Boolean | `boolean` | `TINYINT(1)` | `BIT` |
| Lấy id vừa chèn | `RETURNING id` | `LAST_INSERT_ID()` | `OUTPUT INSERTED.id` / `SCOPE_IDENTITY()` |
| So sánh chuỗi | phân biệt hoa thường (dùng `ILIKE`) | tuỳ collation, thường KHÔNG phân biệt | tuỳ collation, thường KHÔNG phân biệt |

Tiếng Việt: MySQL dùng `utf8mb4` (không phải `utf8` — thiếu ký tự 4 byte), SQL Server dùng `NVARCHAR` + chuỗi `N'...'`,
nếu không dấu tiếng Việt thành `?`.

## 11. Bẫy đã gặp thật — kiểm trước khi kết luận "xong"

- **`prisma migrate reset` / `migrate:fresh` / `sequelize.sync({ force: true })` / TypeORM `synchronize: true` / `ddl-auto=create`**
  = xoá sạch và tạo lại. Chưa bao giờ là cách "chữa" lỗi migration.
- **`prisma db push`** ghi thẳng schema vào DB, KHÔNG tạo file migration ⇒ lịch sử lệch với DB thật (drift), lần
  `migrate deploy` sau trên máy khác hỏng. Chỉ dùng cho DB nháp.
- **Schema drift**: DB đã bị sửa tay/`db push` nên khác lịch sử migration. Migration hỏng giữa chừng (Prisma P3009,
  Flyway "failed migration") ⇒ DỪNG. Không tự `migrate resolve --applied/--rolled-back`, không viết lại migration kiểu
  `CREATE TABLE IF NOT EXISTS` cho qua. Báo: tên migration, lỗi nguyên văn, câu lệnh nào đã chạy, đề xuất sửa — chờ duyệt.
- **Prisma `where: { userId: undefined }` = KHÔNG lọc** ⇒ trả/sửa/xoá TẤT CẢ dòng. `deleteMany({ where: { id: undefined } })`
  xoá cả bảng. Luôn kiểm giá trị trước khi đưa vào `where` (`if (!userId) throw ...`).
- **Lệch múi giờ**: server/container chạy UTC, máy dev +07. `DATETIME` không múi giờ + `new Date()` ⇒ lệch 7 tiếng,
  "đơn hôm nay" mất lúc 0h–7h. Lưu UTC, chuyển múi giờ ở lớp hiển thị; lọc theo ngày thì tính biên ngày theo múi giờ người dùng.
- **Đếm `_count`/cache khác dữ liệu thật** ⇒ câu hỏi về dữ liệu thì chạy truy vấn đếm thật.
- **`ON CONFLICT DO NOTHING` không có tác dụng** khi không có ràng buộc UNIQUE đúng cột đó — nó chèn trùng im lặng.
- **Sắp xếp theo `created_at` khi tạo hàng loạt** ⇒ nhiều dòng cùng mốc thời gian, thứ tự ngẫu nhiên. Thêm `id` làm khoá phụ.
- Test/dev dùng SQLite nhưng prod là PG ⇒ khác kiểu, khác phân biệt hoa thường, khác khoá — lỗi chỉ hiện trên prod.
- `docker compose down -v` xoá volume DB. `-v` là dữ liệu.

## 12. Việc KHÔNG tự làm khi chưa được đồng ý

`DROP TABLE/COLUMN/DATABASE`, `TRUNCATE`, `DELETE`/`UPDATE` không `WHERE` hoặc ảnh hưởng nhiều dòng, mọi lệnh reset/fresh/force,
`db push` vào DB không phải nháp, `migrate resolve`, sửa file migration đã deploy, restore đè DB, chạy migration lên prod,
đổi `ON DELETE` thành `CASCADE`. Trước mỗi việc ấy: nói DB nào, bảng nào, bao nhiêu dòng bị ảnh hưởng (chạy `SELECT count(*)`
với cùng điều kiện), có backup chưa — rồi chờ.

## 13. Báo cáo cuối

Nói ngắn: đã đổi schema gì, file migration nào (đường dẫn), đã chạy trên DB nào, bằng chứng đã kiểm (số dòng trước/sau,
cột mới có mặt, truy vấn mẫu và kết quả, EXPLAIN trước/sau nếu tối ưu), những gì CHƯA làm (chưa chạy prod, chưa backup,
cần người dùng duyệt bước xoá) và lệnh để họ tự chạy tiếp.
