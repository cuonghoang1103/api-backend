# postgresql-practice — tiến độ phủ Code Lab theo bài học (01/11/2026) — ✅ PHỦ ĐỦ Mục 0 → Ch17 + Lab 1–9

Nguồn: `nguon/<slug-bài-học>.mjs` (module slug = slug bài ⇒ thẻ "Luyện tập trên Code Lab" dưới video bài đó, có nút về đúng bài).
Dựng: `node scripts/codelab-xuat-de.mjs --track postgresql-practice` → `node nguon/_dung-track.mjs` →
`npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track postgresql-practice` → `node scripts/codelab-kiem-noi-dung.mjs --track postgresql-practice`.

| Chương | Trạng thái |
|---|---|
| Mục 0 (0.3, 0.4, 0.5) | ✅ 12 đề (0.1/0.2 là bài định hướng — không có đề) |
| Ch1 (1.1–1.4) | ✅ 12 đề |
| Ch2 (2.1–2.4) | ✅ 16 đề |
| Ch3 (3.1–3.4) + Lab 1 | ✅ 16 đề + Lab 1 (5 câu, 37 kiểm) |
| Ch4 (4.1–4.4) + Lab 2 | ✅ 19 đề (4.1/4.3 viết lại theo CT Shop mini, giữ tiêu đề cũ) + Lab 2 |
| Ch5 (5.1–5.4) | ✅ 16 đề (bảng app ghi chú của bài + CT Shop mini) |
| Ch6 (6.1–6.4) + Lab 3 | ✅ 16 đề + Lab 3 (R1/R2/R3b/R4/R6) |
| Ch7 (7.1–7.4) | ✅ 16 đề (7.4 viết lại: CT Shop mini + nhánh Điện tử 3 tầng, giữ tiêu đề cũ) |
| Ch8 (8.1–8.4) + Lab 4 | ✅ 16 đề (bảng sale của bài + CT Shop mini) + Lab 4 (W1/W1b/W3/W4/W5) |
| Ch9 (9.1–9.4) | ✅ 16 đề (bảng event 20 000 dòng tất định + ANALYZE; chấm bằng kế hoạch thật qua plan_text/plan_nodes) |
| Ch10 (10.1–10.4) + Lab 5 | ✅ 14 đề (pg_stats, CREATE STATISTICS, SET LOCAL work_mem/enable_hashjoin) + Lab 5 (P2–P6) |
| Ch11 (11.1–11.4) | ✅ 14 đề (2 đề chạy trên máy: write skew, lost update/NOWAIT — máy chấm chỉ có một phiên) |
| Ch12 (12.1–12.4) + Lab 6 | ✅ 17 đề (users/notes của bài + CT Shop mini) + Lab 6 (T1a/T1c/T2a/T2b/T4) |
| Ch13 (13.1–13.4) + Lab 7 | ✅ 16 đề (13.4: pg_trgm là bài tay — PGlite không nạp extension; tìm không dấu bằng khong_dau() + chỉ mục biểu thức chấm được) + Lab 7 (J1/J2 gộp/J2 sửa+canh/J3/S2+S4) |
| Ch14 (14.1–14.4) | ✅ 18 đề (đo kết nối, PgBouncer, autovacuum chạy, pg_stat_statements là bài tay; truy vấn giám sát chấm trên ẢNH CHỤP pg_stat_* có ghi rõ; reloptions chấm thật) |
| Ch15 (15.1–15.4) + Lab 8 | ✅ 16 đề (pg_dump, PITR, dựng bản sao là bài tay; đối soát md5, khe sao chép giữ WAL, độ trễ theo byte chấm được; phân mảnh chạy thật: định tuyến, pruning qua plan, DROP/DETACH/DEFAULT) + Lab 8 (phần SQL: R1 role chỉ đọc, R1 DEFAULT PRIVILEGES FOR ROLE, B2 trả đúng dòng xoá nhầm, B1 sequence sau --data-only; phần máy chủ: đề tay) |
| Ch16 (16.1–16.4) + Lab 9 | ✅ 17 đề (bảng Prisma↔SQL, bảng khoá DDL đo bằng pg_locks, migration replay được, NOT NULL an toàn, danh mục hệ thống thật, FK thiếu chỉ mục, role ứng dụng, checklist một truy vấn, ca trực 1–2) + Lab 9 (phần SQL: C1 owner/app, C4 expand trigger hai chiều, C7a báo cáo giờ VN, C7b chỉ mục bỏ Sort; phần ứng dụng Node+Prisma: đề tay) |
| Ch17 (17.1–17.4) | ✅ 14 đề (dịch T-SQL/MySQL, upsert đốt số identity, dựng document từ bảng, pipeline MongoDB → jsonb_array_elements, đổi tên trong mọi document; còn lại bảng/trắc nghiệm) |
| PE/FE chữa đề (s18) | — không làm Code Lab riêng (bài chữa đề video; các kỹ năng đã có đề theo chương) |

Ghi chú: xem đầu `nguon/_chung.mjs` (giới hạn PGlite đo thật, cách soạn pg()/cs()/tay()/deLonPg()).
