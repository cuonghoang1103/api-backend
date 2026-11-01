# Liên kết chéo Node.js Chương 7 (PostgreSQL + Prisma) ↔ khoá PostgreSQL ↔ DBI202 (Academy)

Đợt 6 video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `postgresql`; Academy DBI202: `introduction-to-databases`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Bạn đã học phần này ở …"; thẻ ở bài PostgreSQL / DBI202 nói "Áp vào Node.js — bài 7.x".
Bài DBI202 viết tay (`DBI202.mjs`) sửa trực tiếp ở repo web (theo README bộ sinh DBI202); bài sinh tự động `dbi202-slide-cs7-1` sửa ở NGUỒN `FLM-nguon/_repo/DBI202/gen/src/slides/cs7.txt` (khối `@@outro`) rồi `gen.mjs --only cs` (diff = đúng thẻ).
Lời video (`src/bai/node-7-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh ("Nếu bạn đã học bài … khoá PostgreSQL / DBI202 …") và ghi trong `LIEN_KET`.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật, Prisma 7.10.1 + PostgreSQL 17) |
|---|---|---|---|
| `nodejs-7-1-ket-noi-va-pool` | `postgresql/postgresql-14-1-gia-ket-noi` | mỗi kết nối một tiến trình, giá mở kết nối, kết nối thứ 101 bị từ chối | 8,36 vs 0,41 ms/truy vấn, 97 (vai thường) vs 100 (superuser), 12 PrismaClient × 10 ⇒ 53300, client mỗi request, request đầu chậm |
| `nodejs-7-1-ket-noi-va-pool` | `postgresql/postgresql-14-2-pool-pgbouncer` | pool, cỡ pool, PgBouncer | pool 1/5/10/20 đo kèm số backend thật, mỗi tiến trình một client, cài Prisma 7 đúng như hôm nay |
| `nodejs-7-2-luoc-do-va-migration` | `postgresql/postgresql-16-1-prisma-migration` | migrate dev/deploy, bảng _prisma_migrations, xử lý migration hỏng | lược đồ Notes từng trường, drift + migrate diff + shadow DB, diễn tập P3018 ⇒ P3009 và gỡ ba bước, 7.10 không còn tự generate |
| `nodejs-7-2-luoc-do-va-migration` | `introduction-to-databases/dbi202-rang-buoc-sql` | ALTER TABLE trên bảng đã có dữ liệu, ràng buộc | NOT NULL không mặc định hỏng (23502 ⇒ P3018), cho null ⇒ điền ⇒ siết, qua migration Prisma |
| `nodejs-7-3-crud-transaction` | `postgresql/postgresql-11-1-giao-dich` | giao dịch được cả hoặc không, ROLLBACK | $transaction lô/tương tác, bug prisma thay tx, P2028 5 s, giữ chỗ pool 2.813 vs 3 ms, nguyên tử ≠ tuần tự |
| `nodejs-7-3-crud-transaction` | `introduction-to-databases/dbi202-transaction-acid` | ACID | nửa vời vs cuộn ngược đo thật, hai người mua cùng đọc 10 |
| `nodejs-7-4-quan-he-va-n-plus-1` | `postgresql/postgresql-5-1-inner-join` | nối người dùng với ghi chú, cột cha lặp lại | include = 2 câu với IN (không JOIN), N+1 51 vs 2 câu, groupBy/_count, cột là băng thông |
| `nodejs-7-4-quan-he-va-n-plus-1` | `introduction-to-databases/dbi202-join-day-du` | JOIN hai bảng và bảng kết quả | cùng dữ liệu qua Prisma, đếm câu SQL thật |
| `nodejs-7-5-chi-muc-va-explain` | `postgresql/postgresql-9-3-khong-dung-selectivity-partial` | chỉ mục bị bỏ qua, độ chọn lọc, chi phí ghi | LIKE tiền tố trượt với en_US.utf8 ⇒ text_pattern_ops, chỉ mục độ chọn lọc thấp làm chậm hơn, contains/startsWith sinh gì |
| `nodejs-7-5-chi-muc-va-explain` | `postgresql/postgresql-10-1-doc-explain` | đọc EXPLAIN ANALYZE từ trong ra | 55,177 ⇒ 0,084 ms, chỉ mục trong schema.prisma, thứ tự cột đo hai chiều, SQL thật từ sự kiện query |
| `nodejs-7-5-chi-muc-va-explain` | `introduction-to-databases/dbi202-execution-plan` | chỉ mục ghép, tiền tố trái, đọc kế hoạch | chỉ mục đảo: 3.844 vs 13 trang với tác giả hiếm, thuế ghi |
| `nodejs-7-6-hop-dong-api-voi-du-lieu-that` | `postgresql/postgresql-11-4-khoa-deadlock` | lost update, version / FOR UPDATE | cột version qua updateMany ⇒ 409 (1 vs 0 dòng), ETag trên đường truyền |
| `nodejs-7-6-hop-dong-api-voi-du-lieu-that` | `introduction-to-databases/dbi202-slide-cs7-1` | SQL injection, tham số hoá | $queryRawUnsafe lộ 1.000.003 dòng, $queryRaw tagged template 0 (thẻ phía DBI202 ở nguồn FLM) |

Chỉ nhắc trong lời video, CHƯA đặt thẻ web (đã có thẻ gần nghĩa hơn): PostgreSQL 9.1, 10.4, 4.3, 3.4; DBI202 5.1 (`dbi202-sql-ddl`), 8.1 (`dbi202-chi-muc`), 6.2.
