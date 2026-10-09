# Đề giao (Opus) — CT WORK ĐỢT 4 "SRS CÓ CẤU TRÚC & TRUY VẾT" · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`.

**Đọc trước:**
- `CLAUDE.md`, `docs/ctw-ke-hoach-tong.md`, bộ nhớ `project_ct_work_kieu_jira.md` và `feedback_ctw_doi_chieu_mau_truong.md`.
- `docs/ctw-ra-soat-thieu-09-10.md`: các mục A6, A7, A16, A18, A19, A22, A24, B5, D5, mỗi mục có bằng chứng và gợi ý chỗ đặt.
- Mã đợt 1b/3A/3B/3C:
  - `fptTests*`, `fptReports*`
  - `docExport.ts`, `docFill.ts`, `capstone.service.ts`
  - `toolRegistry/`
- Mẫu thật: `~/Documents/Report Đồ án/Report3_Software Requirement Specification.docx`, `Report4_…`, `Report7_…`, `Report2_Project Tracking.xlsx`. Đọc cấu trúc bằng python-docx/openpyxl, không chép dữ liệu nhóm khác.

**Luật cứng:**
- KHÔNG commit/push/deploy, KHÔNG git add/stash/checkout/reset. Ngoại lệ duy nhất: `git checkout -- frontend/tsconfig.json` sau `next build`.
- Migration viết tay, dải `20261009230000_*`. Chỉ THÊM vào schema, trong khối `// ── CTW đợt 4 ──`. Mọi FK mới trỏ vào `work_issues` phải `DEFERRABLE INITIALLY DEFERRED`.
- Đang chạy song song:
  - UX-A: header, `work.css` token màu, KPI, thanh bên, Getting started.
  - 6a: cổng khách, `permissions`, CI, E2E.
- Không sửa lớn các tệp đó; gặp tệp chung thì chèn tối thiểu và ghi vào báo cáo.
- Không đụng `src/services/llm/gateway.ts`.
- Giao diện tiếng Anh, theo `theme-dark`. Đạt chuẩn trong `docs/ctw-ra-soat-giao-dien-09-10.md`: tương phản AA, ô nhập có nhãn, bảng có tiêu đề dính.

## Làm
1. **A6 + A7 — SRS có cấu trúc.** Theo đúng mẫu Report3:
   - Actors.
   - Danh sách Use Case.
   - **UC Specification**: ID, tên, actor, trigger, mô tả, pre/post-condition, normal / alternative / exception flow, priority, BR tham chiếu.
   - **Business Rules register** (BR-01…).
   - **Screens Flow**: danh sách màn và liên kết.
   - **Screen Authorization**: ma trận actor × màn.
   - Non-UI functions.

   Yêu cầu:
   - Dữ liệu có cấu trúc, gắn được với thẻ REQUIREMENT/epic.
   - Có giao diện sửa: bảng + form UC spec, ma trận bấm ô.
   - **Xuất ra Report 3 docx** bằng đường xuất của 3A: các mục này phải sinh vào đúng đề mục của mẫu.
   - AI (registry + Ask AI): gợi ý UC spec từ mô tả thẻ/epic; ghi ra ĐỀ XUẤT để người duyệt.
2. **A19 — RTM đầy đủ:**
   - Truy vết đủ chuỗi: Req/UC ↔ mục SRS ↔ mục SDS (trang Docs) ↔ commit/PR (`WorkDevActivity`) ↔ test case (Xray + UTCID 5.1 / 5.2 / 5.3) ↔ bug.
   - Màn hình ma trận có lọc, đánh dấu chỗ hở (UC chưa có test, test chưa chạy…).
   - Xuất xlsx.
3. **A16 + B5 — Defect log thống nhất:**
   - Trường **Severity** mặc định cho Bug, khác Priority, có trong mẫu SWT301/SWP391/CAPSTONE.
   - Bug có thêm Activity / Product / Product details theo sheet Defects.
   - Findings của spec review chuyển thành Bug bằng một chạm.
   - Sheet Defects của Project Tracking (3B) lấy đủ các trường này.
4. **A22 — Q&A log:**
   - Thêm RAID type `QUESTION`, trạng thái riêng. Các cột: date, question, asked by, to, priority, due, status, answer.
   - Sheet Q&A của Project Tracking lấy từ đây thay cho cách tạm bằng nhóm "Q&A" của 3B. Dữ liệu cũ phải giữ tương thích.
5. **A24 — TimeLogs theo Activity:**
   - Worklog có `activity` (Analyzing / Designing / Coding / Testing / Reviewing / Meeting… theo mẫu) và `workProduct` (Report1…7, mô-đun).
   - Hiện trên giao diện ghi giờ. Sheet TimeLogs xuất đúng hai cột này.
6. **A18 — Report 7 Final:**
   - Ghép các trang Report 1–6 của dự án thành một bản Final: bìa, Acknowledgement, mục lục.
   - Xuất docx và PDF bằng đường của 3A.
7. **D5 / CTW-12:** spec review chọn khung chấm theo LOẠI TRANG (SRS / SDD / GDD / khác), không áp khung SRS cho mọi trang. Đọc thẻ CTW-12 qua `~/Documents/FlyingPencil/.ctwork/lib.mjs`, KHÔNG in token. Bình luận lên thẻ: nguyên nhân + cách sửa + test (bot fp_claude), không đổi trạng thái thẻ.
8. **Lệnh registry (đợt 3C)** cho mọi thứ mới: UC/BR/RTM/Q&A/defect/time activity. Có trên cả MCP lẫn Ask AI; lệnh ghi ra đề xuất.

## Kiểm
- Unit + `WORK_DB_TEST=1` cho từng mục, thêm vào `npm test`.
- Xuất Report 3 / Report 7 / RTM / Project Tracking, rồi đọc lại bằng python-docx/openpyxl và so đề mục/cột với mẫu thật.
- `npx tsc --noEmit`, `typecheck:seed`, frontend tsc, desktop typecheck.
- `next build --no-lint` với distDir `.next-ctw4` và `NODE_OPTIONS=--max-old-space-size=12288`.
- Quét rules-of-hooks trên các tệp đã sửa.
- Migration: diff sạch.
- Chạy thật trên trình duyệt local, chụp ảnh sáng và tối, 1440 và 390, vào `scratchpad/ctw4/`. Có trang mới thì thêm tuyến desktop `dinhTuyenWeb.ts`.

Báo lại ngắn bằng tiếng Việt, chỉ khi xong hết: tệp, migration, test, ảnh, tệp xuất mẫu, rủi ro.
