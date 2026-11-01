# dbi202-practice — tiến độ phủ Code Lab theo bài học (01/11/2026)

Nguồn: `nguon/<slug-bài-học>.mjs` (module slug = slug bài ⇒ thẻ "🏋️ Luyện tập" dưới video bài đó). Lab/PE: module riêng,
`baiHoc` = bài on-chN / bài chữa đề (đứng ngay sau bài đó trên trang track).

Dựng + kiểm (BẮT BUỘC xanh trước khi commit):

```bash
node content/codelab/dbi202-practice/nguon/_dung-track.mjs                         # _track.json theo thứ tự khoá
node scripts/codelab-xuat-de.mjs --track dbi202-practice                           # JSON + chạy lời giải/khởi đầu/sai mẫu SQL trong Node
npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track dbi202-practice          # Chromium: lời giải đạt 100 %, khởi đầu trượt
node scripts/codelab-kiem-noi-dung.mjs --track dbi202-practice                     # 0 lỗi nội dung
# đề T-SQL chạy trên máy (manual): SQL Server THẬT — container riêng dbicl-sqledge (Azure SQL Edge = lõi 2019) + tedious ở thư mục nháp
node content/codelab/dbi202-practice/nguon/_kiem-tay.mjs --tedious <nháp>/node_modules/tedious
```

## Ba loại đề

| Loại | Khi nào | Chấm |
|---|---|---|
| `sql` (`de()`/`sql()`/`deLonSql()`) | SELECT/JOIN/GROUP BY/truy vấn con, DDL + ràng buộc, DML, VIEW, CREATE INDEX thường — SQL chung chạy giống SQL Server | trình duyệt (PGlite, chế độ SQL Server) |
| `choice` / `order` / `table` (`cs()`) | đại số quan hệ trên giấy, ERD, phụ thuộc hàm/bao đóng/khoá/chuẩn hoá, khái niệm, kế hoạch thực thi | trình duyệt (thuần JS) |
| `manual` (`tsql()`) | T-SQL thuần: stored procedure, function, trigger, cursor, biến/IF/WHILE, TRY/CATCH, BEGIN TRAN/COMMIT/ROLLBACK, @@ROWCOUNT, IDENTITY, TOP, CLUSTERED/INCLUDE… | trên SQL Server của người học: `setup.sql → solution.sql → check.sql` (check.sql in PASS/FAIL + "ALL n CHECKS PASSED"); web chỉ "Tự đánh dấu đã giải" |

Vì sao `manual`: máy chấm trình duyệt là PostgreSQL (WASM) — T-SQL lập trình không chạy được, mà giả đạt là nói dối. Một cách duy nhất cho mọi đề tay: tệp `.sql` tự kiểm (chạy được trong SSMS, sqlcmd, VS Code mssql — Windows lẫn macOS/Docker), không cần cài Node/gói npm.

## Tiến độ

| Nhóm | Module | Đề (trước → sau) | Trạng thái |
|---|---|---|---|
| Mục 0 | buoi-dau-tien, cai-dat-ket-noi | 0 → 8 | ✅ (1 đề tay: kiểm bản cài + Unicode) |
| Ch1 | slide-dbi2-1, csdl-dbms, on-ch1 | 0 → 12 | ✅ |
| Ch2 | slide-dbi3-1/3-2/6-1/6-2, mo-hinh-quan-he, dai-so-quan-he, dai-so-nang-cao, rang-buoc-quan-he, on-ch2 | 0 → 42 | ✅ |
| Ch3 | slide-dbi5-1/5-2/5-3, er-model, er-nang-cao, er-subclass, er-to-relation, xuong-erd, on-ch3 + Lab 3 (phòng khám) | 0 → 35 | ✅ (ERD → CREATE TABLE chấm theo hành vi: dòng hợp lệ vào, dòng sai bị chặn + cấu trúc cột) |
| Ch4 | slide-dbi4-1..4, chuan-hoa, bao-dong-tim-khoa, phan-ra, chuan-hoa-vi-du, on-ch4 + Lab 4 (đơn hàng → BCNF) | 0 → 32 | ✅ (đáp án bao đóng/khoá/dạng chuẩn/chase TÍNH BẰNG `nguon/_fd.mjs`, không tính nhẩm; phân rã làm thật bằng CREATE TABLE + INSERT … SELECT DISTINCT) |
| Ch5 | slide-dbi7-1/7-2, kieu-du-lieu, on-ch5 (+ sql-ddl, rang-buoc-sql, Lab 5 có sẵn) | 11 → 30 (+ Lab 5) | ✅ (4 đề tay: kiểu SQL Server + IDENTITY, CSDL bán hàng có UNIQUE lọc NULL, CLB với LIKE '[0-9]') |
| Ch6 | slide-dbi7-3/7-5/7-6, on-ch6 (+ 6 module + Lab 6 có sẵn) | 36 → 58 (+ Lab 6) | ✅ (1 đề tay: TOP 1 WITH TIES trong view) |
| Ch7 | slide-dbi9-1..3, plsql, proc-function, trigger-cursor, on-ch7 + Lab 7 thư viện (+ view có sẵn) | 4 → 34 | ✅ (22 đề tay T-SQL: biến/IF/WHILE/TRY, procedure OUTPUT + RETURN, giao dịch trong procedure, hàm vô hướng/TVF, trigger hiện dòng/luật nhiều dòng/kiểm toán/đếm/INSTEAD OF, cursor; 3 đề trình duyệt: view, UPDATE thay cursor) |
| Ch8 | slide-dbi8-1/8-2, chi-muc, execution-plan, transaction-acid, on-ch8 + Lab 8 CT Shop | 0 → 26 | ✅ (8 đề tay: chuyển khoản XACT_ABORT + TRY/CATCH + THROW, chỉ mục phủ INCLUDE, chỉ mục ghép/clustered, đặt ghế nguyên tử, chuyển thưởng, Lab 8 5 câu; trình duyệt: CREATE INDEX/UNIQUE INDEX qua pg_indexes, UPDATE ghế nguyên tử, view WITH CHECK OPTION; 2 sql-pg: chỉ mục một phần, materialized view) |
| ⭐ CS.1–CS.8 + cầu nối | 3 bài/chủ đề + cau-noi-di-lam | 0 → … | ⏳ |
| Ôn thi | on-pe, ngan-hang-cau-hoi, PE 1–3 chữa đề, FE chữa đề (+ PE 1 CT Rent có sẵn) | 1 → … | ⏳ |

Bài KHÔNG có đề (định hướng, không có gì để luyện): dbi202-bat-dau-tai-day, dbi202-slide-dbi1-1, dbi202-gioi-thieu,
dbi202-dieu-kien-qua-mon, dbi202-cai-dat (trùng nội dung cai-dat-ket-noi — đề cài đặt nằm ở đó), các bài QUIZ (đã là bài kiểm tra).

## Đối chiếu SQL Server thật

`nguon/_kiem-sqlserver.mjs` chạy LỜI GIẢI của mọi đề `sql` trên SQL Server (Azure SQL Edge) với đúng `csdl` T-SQL của đề và so bảng
kết quả với `mongDoi` của PGlite (bi-chan phải lỗi, chay-duoc phải chạy). 01/11: 489 kiểm, lệch 5 ⇒ đã sửa (đề phân rã dùng VARCHAR mà
dữ liệu có dấu tiếng Việt ⇒ SQL Server lưu thành "?": đổi dữ liệu mẫu các bảng phẳng sang không dấu). Chạy lại sau mỗi đợt.

## Ghi chú soạn đề (đo thật)

- Chữ người đọc NVARCHAR (máy chấm nạp thành citext ⇒ so không phân biệt hoa thường như SQL Server); mã/khoá VARCHAR/CHAR.
- Không kiểm thứ tự theo tên có dấu; không để NULL trong khoá ORDER BY của kiểm `thuTu`.
- Mỗi `saiMau` phải trượt ≥ 1 kiểm — kiểm ẩn (`themCsdl`) dựng dữ liệu bắt đúng lỗi đó (phim làm lại, điểm đúng biên, người chỉ có điểm trượt…).
- `<u>` không nằm trong danh sách thẻ của codelab-kiem-noi-dung ⇒ gạch chân khoá chính bằng `<span style="text-decoration:underline">`.
- check.sql: mỗi kiểm chạy trong `sp_executesql` (lỗi "không tìm thấy procedure" thành FAIL có lời nhắn, không làm hỏng các kiểm sau); bắt
  result set của trigger bằng `INSERT INTO @bienBang EXEC (…)` — BIẾN BẢNG, vì bảng tạm `#t` bị ROLLBACK xoá dòng.
