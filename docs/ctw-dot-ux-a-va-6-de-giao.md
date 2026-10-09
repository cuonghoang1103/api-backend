# Đề giao (Opus) — CT WORK: UX-A (giao diện nền tảng) + ĐỢT 6a (bảo mật cổng khách + CI test) · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc trước:
- `CLAUDE.md`
- `docs/ctw-ke-hoach-tong.md`
- `docs/ctw-ra-soat-giao-dien-09-10.md`, nguồn của UX-A (ảnh ở `scratchpad/ux/`)
- `docs/ctw-ra-soat-thieu-09-10.md`, mục D1, D2, D8
- bộ nhớ `project_ct_work_kieu_jira.md`

Luật cứng:
- **KHÔNG commit/push/deploy, KHÔNG git add/stash/checkout/reset.** Ngoại lệ duy nhất: `git checkout -- frontend/tsconfig.json` sau `next build`.
- Migration nếu cần: viết tay, UX-A dùng dải `20261009200000_*`, 6a dùng dải `20261009210000_*`.
- **KHÔNG đụng `src/services/llm/gateway.ts`.** Tệp này đang có thay đổi chờ người dùng duyệt.
- Hai agent làm song song: UX-A (phần lớn frontend) ⇄ 6a (phần lớn backend + CI). Không sửa tệp của nhau. Gặp tệp chung thì sửa tối thiểu và ghi vào báo cáo.

## UX-A — nền tảng và nhất quán (web + app desktop)
Sửa đúng các mục P0 và P1 nhóm nền tảng trong báo cáo rà giao diện:
1. **P0 – Header dự án vỡ ở 1180px (khổ app desktop) và tên bị cắt ở 1440px** (`ProjectHeader.tsx` + toolbar board/list). Gom các nút phụ vào menu "More", breadcrumb rút gọn có tooltip. Ở 1024/1180/1440 thì tên dự án và sprint đều đọc được.
2. **P0 – Số "open" lệch nhau giữa Projects, Portfolio và Dashboard** (`projects.service.ts` so với `portfolio.service.ts:102`). Chọn MỘT định nghĩa:
   - Mọi thẻ chưa Done, không tính sub-task. Hoặc chọn định nghĩa khác, nhưng phải ghi rõ lý do.
   - Dùng chung một hàm, và hiện chú thích (tooltip) định nghĩa ở mọi chỗ có số này.
   - Có test.
3. **P0 – Tương phản AA**: tách token màu CHỮ ra khỏi màu nền/huy hiệu (`--w-green/yellow/orange…` trong `work.css`), đạt ≥4.5:1 ở cả giao diện sáng và tối. Sửa ma trận RAID, badge ưu tiên của desk, mã dự án. Đo lại bằng axe.
4. **P1:**
   - Gộp 3 kiểu ô KPI thành một thành phần `KpiTile` dùng chung.
   - Tiêu đề trang: viết hoa thống nhất. Chiều rộng khung nội dung: thống nhất.
   - Thanh bên dự án:
     - Gom nhóm, cho thu gọn được, mục đang chọn tự cuộn tới.
     - Dự án CLIENT có hơn 20 mục: nhóm Reports không được nằm dưới nếp gấp ở màn cao 900px.
   - Khung "Getting started" thu thành một dòng hoặc một chip có thể mở ra. Không lặp lại ở cả Board lẫn Backlog. Khi xong hoặc khi người dùng tắt thì phải nhớ trạng thái.
   - Lỗi ARIA: `role=row` có vai cha đúng, không lồng nút trong vùng bấm được, mọi ô nhập có nhãn (8 trang trong báo cáo).
5. Mọi thay đổi theo luật theme `theme-dark`, không dùng `dark:`. Chạy được ở 390px. App desktop dùng lại web, nên kiểm thêm khổ 1180×800.

Kiểm:
- Chụp lại đúng các ảnh trước và sau của các trang đã sửa, lưu vào `scratchpad/ux-a/`.
- Chạy axe ở 1440, giao diện sáng và tối, rồi so số lỗi trước và sau.
- Chạy frontend tsc, và build với distDir `.next-uxa` (`NODE_OPTIONS=--max-old-space-size=12288`, `--no-lint` như `npm run build`).
- Quét lint rules-of-hooks trên các tệp đã sửa.
- Desktop typecheck.
- Chạy unit + DB test cho phần backend có đổi (định nghĩa "open").

## 6a — bảo mật cổng khách + test trong CI
1. **D8 – 3 rò rỉ cổng khách** (ghi nhận từ 04/10, chi tiết trong bộ nhớ `project_ct_work_kieu_jira.md` và rà soát mục D8):
   - Khách được nêu làm người duyệt thì thấy được mã và tiêu đề của thẻ chưa chia sẻ.
   - Khách thấy tên và ảnh của mọi nhân viên ở dự án mở cho cả workspace.
   - Khách cũ có vai MEMBER thì không bị áp phạm vi.
   - Với mỗi lỗi: viết DB test tái hiện, đỏ trước khi sửa, xanh sau khi sửa.
   - Cùng lúc xử lý **ảnh trong tài liệu (đợt 3A)**: khách cổng và link công khai đang thấy ảnh hỏng. Phục vụ ảnh theo đúng phạm vi đã chia sẻ, không mở rộng quyền.
2. **D1 – test DB thực sự chạy:**
   - Thêm script `test:work-db` chạy MỌI tệp `*.db.test.ts` của work tuần tự với `WORK_DB_TEST=1`.
   - Thêm 22 tệp test work chưa có trong `npm test`: tệp nào thuần thì đưa vào `npm test`, tệp nào cần DB thì đưa vào `test:work-db`.
   - Thêm job có Postgres service trong `.github/workflows/ci-lint.yml` để chạy `prisma migrate deploy` rồi `test:work-db`.
   - **KHÔNG sửa `deploy-nha.sh`.** Chỉ đề xuất trong báo cáo cách thêm `test:work-db` vào bộ kiểm trước push (cần Postgres cục bộ ở máy nhà hoặc Mac); trưởng nhóm quyết.
3. **D2 – E2E Playwright được commit:** thêm `frontend/e2e/work/*.spec.ts` cho các luồng chính:
   - Đăng ký/đăng nhập thử ở local.
   - Tạo dự án mẫu Capstone, tạo thẻ, kéo sang Done.
   - Ma trận 5.1 và xuất Excel.
   - Docs chèn ảnh và xuất docx.
   - Cổng khách chỉ thấy phần được chia sẻ.
   - Thêm script chạy cục bộ. Workflow CI dùng `workflow_dispatch` (không chạy theo push).

Kiểm:
- Chạy mọi test mới và cũ: `npm test` và `test:work-db`.
- Chạy `npx tsc --noEmit` và `typecheck:seed`.
- Chạy thật toàn bộ E2E ở local.
- Kiểm cú pháp workflow, dùng `actionlint` nếu có.

## Báo lại
Báo lại ngắn bằng tiếng Việt, chỉ khi xong hết: tệp, test, ảnh trước/sau, số lỗi axe, rủi ro.
