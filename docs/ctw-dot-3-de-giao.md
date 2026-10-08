# Đề giao (Opus) — CT WORK ĐỢT 3 "NỘP ĐƯỢC HỒ SƠ" (P0) · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc trước:
- `CLAUDE.md`. Prisma: migration VIẾT TAY rồi `npx prisma migrate deploy`; KHÔNG `migrate dev`/`reset`/`resolve`/`db push`.
- `docs/ctw-ra-soat-thieu-09-10.md`: bản rà soát có bằng chứng. Mã mục A1… dùng ở đây đều theo tệp này.
- Bộ nhớ `project_ct_work_kieu_jira.md` và `feedback_ctw_doi_chieu_mau_truong.md`.
- `docs/ctw-dot-1b-kiem-thu-fpt-de-giao.md` và mã đợt 1b (`fptTests*.ts`, `xlsxStyled.ts`, `frontend/src/components/work/tests/fpt/*`) — đây là mẫu cách làm: đọc cấu trúc tệp mẫu thật, xuất đúng mẫu, nhập lại được.

**KHÔNG commit/push/deploy, KHÔNG git add/stash/checkout/reset.** Ngoại lệ duy nhất: được `git checkout -- frontend/tsconfig.json` nếu `next build` ghi đè tệp này.

Làm song song với:
- Agent đợt 2 FE (giao diện AI agent: AssigneePicker, `/work/[ws]/agents`, IssueDetail khối Agent).
- Agent đợt 3 còn lại (3A ⇄ 3B).

Luật để không giẫm nhau:
- **`prisma/schema.prisma`:** chỉ THÊM model mới hoặc trường mới. Đọc lại tệp ngay trước mỗi lần sửa, sửa bằng Edit nhỏ, không ghi đè cả tệp. Gom model của mình trong khối chú thích `// ── CTW đợt 3A ──` hoặc `// ── CTW đợt 3B ──`.
- **Tên thư mục migration:** 3A dùng `20261009120000_*`…, 3B dùng `20261009140000_*`….
- Chỉ sửa tệp cần cho việc của mình. Gặp tệp đang bị sửa dở thì sửa tối thiểu và ghi vào báo cáo.

**Mẫu thật** (chỉ đọc CẤU TRÚC, không chép dữ liệu nhóm khác):
- `~/Documents/Report Đồ án/`: Report1–7, 5.0–5.3, Project Tracking, Weekly Report SEP490.
- `SWP391/materials` (Template0–5): đường dẫn ghi trong tệp rà soát.
- `.docx`: đọc bằng python-docx hoặc unzip `word/document.xml`. `.xlsx`: đọc bằng openpyxl (dùng venv ở scratchpad, hoặc tự tạo).

Toàn bộ UI và nội dung xuất ra: TIẾNG ANH như phần còn lại của CT Work. Mẫu FPT bản gốc là tiếng Anh. Chú thích trong mã viết tiếng Việt.

## 3A — Tài liệu (Docs/editor)
- **A8:** chèn được ẢNH vào RichEditor (dán, kéo-thả, nút tải lên) qua đường upload R2 hiện có, và khối **Mermaid** hiển thị thành sơ đồ. Áp dụng cho Docs, mô tả thẻ và bình luận (C26).
- **A9:** xuất một trang Docs ra **.docx** và **PDF**:
  - Đề mục, bảng, ảnh, code, mục lục phải giữ đúng.
  - Kiểm `package.json` trước. Thêm dependency nào cũng phải ghi lý do vào báo cáo và thử `docker build` hoặc đảm bảo không cần thư viện hệ thống.
  - PDF: ưu tiên đường đang có (`reportRender.ts`, nếu có).
- **A1/A2/A11/A17 (+ đề mục chuẩn cho 3, 4, 7):** bộ mẫu tài liệu "FPT Capstone" theo ĐÚNG đề mục bản gốc: Report 1, 2, 3, 4, 5.0, 6, 7.
  - Đặt ở `content/quy-trinh/mau/` + `catalog.json`, chép bản sao sang `frontend/public/quy-trinh/mau/`.
  - `docTemplates.test.ts` phải xanh.
  - Report 2 tự điền được: thành viên/vai trò, rủi ro lấy từ RAID, mốc lấy từ version/stage.
- **A10:** Record of Changes tự sinh từ lịch sử phiên bản trang.
- **A30:** **mẫu dự án Capstone SEP490/ISP490** khi tạo dự án:
  - Giai đoạn Report1→7 và iteration.
  - Bật sẵn các mô-đun cần dùng (Tests 5.1/5.2/5.3, RTM, Project Tracking, họp, rủi ro).
  - Có sẵn trang Docs theo bộ mẫu trên và vai trò TEACHER.
  - Thay cho việc dựng tay bằng script như LabFlow.

## 3B — Excel / báo cáo theo mẫu
- **A14:** **System Test 5.3** — nhiều vòng Round 1–3, đúng sheet/cột của tệp mẫu. Mở rộng `fptTests` (tab `?tab=system`). Xuất và nhập Excel giống 5.1/5.2.
- **A23:** **Project Tracking** đủ ba mẫu:
  - SEP490 `Report2_Project Tracking.xlsx`: Scope/WBS/Q&A/TimeLogs/Defects/Issues… đọc đúng sheet thật.
  - SWP391 Template1 (Iter1–4).
  - SWP391 Template4 Issues.
  - Dữ liệu lấy từ thẻ/worklog/defect/RAID. Mở rộng `projectTracking.service.ts`.
- **A3:** **WBS** đánh số 1.0/1.1… từ cây epic→story→sub-task, cùng **bảng quy đổi độ phức tạp**:
  - Simple/Medium/Complex theo tiêu chí mẫu ra man-day, cấu hình được ở `settings`.
  - Planned/Actual effort.
  - Có giao diện xem và sửa.
- **A21:** **Weekly Report .xlsx** đúng mẫu SEP490 (mỗi tuần một sheet):
  - Tự điền việc đã làm/kế hoạch/vấn đề từ dữ liệu tuần.
  - Lưu kỳ báo cáo để sửa trước khi xuất.
- **A29:** **AI Usage Report** theo SWP391 Template0:
  - Nhật ký dùng AI: tự ghi từ provenance AI/agent của CT Work, có thêm ô nhập tay.
  - Xuất theo mẫu.

## Kiểm (cả hai)
- **Test:** viết unit test + DB test (`WORK_DB_TEST=1`) cho mọi service/endpoint mới. Mọi test mới phải được THÊM vào `npm test`. Xuất xong thì đọc lại bằng openpyxl/python-docx và so tên sheet, đề mục, cột với tệp mẫu.
- **Type-check:** `npx tsc --noEmit`, `npm run typecheck:seed`, `(cd frontend && npx tsc --noEmit)`.
- **Build frontend:** distDir riêng `.next-ctw3a` / `.next-ctw3b`, chạy với `NODE_OPTIONS=--max-old-space-size=12288`.
- **Migration:** `npx prisma migrate deploy` trên DB cục bộ, rồi chạy migrate diff; kết quả phải sạch.
- **Thử thật:** chạy trên trình duyệt local và chụp ảnh vào `scratchpad/ctw3/`. Lưu tệp xuất mẫu vào cùng chỗ.
- **Desktop:** trang mới dưới `app/work` thì phải thêm tuyến desktop vào `dinhTuyenWeb.ts`.
- **Báo lại ngắn**, chỉ khi xong hết: tệp đã sửa/thêm, migration, ảnh chụp, tệp mẫu đã xuất, rủi ro.
