# Rà soát giao diện CT Work (/work) — 09/10/2026

Đây là dòng **UX** trong `docs/ctw-ke-hoach-tong.md`. Đợt này chỉ rà và chụp ảnh, **không sửa mã**.

## 0. Cách đo

| Mục | Giá trị |
|---|---|
| Bản mã | Cây làm việc `main` ngày 09/10, có cả phần đợt 3C đang làm dở. `next build --no-lint` vẫn xanh (bản build có lint thì đỏ vì lỗi lint cũ, không liên quan đợt này). |
| Môi trường | Backend phụ `:3141` (CRON tắt, `RATE_LIMIT_MAX` nâng chỉ cho tiến trình này) + `next start :3140`, distDir `.next-ux`. Dùng **DB cục bộ** (localhost:5434), không đụng production. |
| Dữ liệu | Tài khoản thử `uxreview1009`, workspace **"UX Review Studio"** có 3 dự án: `CLI` (CLIENT, bật đủ mô-đun), `SWP` (SCHOOL/SWP391), `KAN` (Kanban). Mỗi dự án có sample-data, sprint đang chạy, 5 test case + 1 cycle, 2 version, RAID mẫu, họp, CR, ngân sách, 2 phiếu desk, worklog. **Chưa có sprint nào đã đóng** nên Velocity trống. Burndown chỉ có 1 ngày snapshot. |
| Ảnh | 270 ảnh tự động: 59 trang × (sáng/tối) × (1440/390), cộng 1024px cho 16 trang chính. Thêm 23 ảnh `x-*`: dashboard có widget, ⌘K, ngăn chi tiết thẻ, phím `?`, focus bằng Tab, trạng thái đang tải và lỗi, và khổ **1180×800 (bằng vùng nội dung của app desktop)**. |
| Nơi lưu ảnh | `/private/tmp/claude-501/-Users-admin-Downloads-api-backend/42e91028-e89e-455e-9942-d0743b81bc94/scratchpad/ux/` — tên tệp `<trang>_<rộng>_<theme>.png`. Số liệu axe/tràn ngang nằm ở `../ux-report.json`. |
| Kiểm tự động | Tràn ngang ở 390px: **0/270 trang**. Trang lỗi: 0 (riêng `/work/developer` khớp nhầm chữ "404" trong nội dung, thực tế trang vẫn ổn). axe-core WCAG 2 A/AA chạy ở 1440 sáng: kết quả ở mục 3. |
| App desktop | App dùng lại đúng 43 trang web qua `dinhTuyenWeb.ts` và `CtWorkPage`, nên mọi nhận xét cho web cũng đúng với app. Riêng app còn có **thanh bên của chính nó**, vùng cho CT Work chỉ còn khoảng 1180px. Ảnh `x-desktop1180-*` chụp ở khổ này. |

Thang điểm: 5 = đạt chuẩn Linear/Jira · 4 = tốt, chỉ lỗi nhỏ · 3 = dùng được nhưng lỗi rõ · 2 = cản trở công việc.

## 1. Điểm từng trang

**Điểm trung bình: 3,8/5** (38 trang/nhóm được chấm).

| Trang | Điểm | Lỗi cụ thể (ảnh → tệp nguồn) |
|---|---|---|
| My work `/work` | 4 | Chữ "My work" lặp 3 lần (tiêu đề header, tab, h1). Banner tour chiếm khoảng 100px. → `home_1440_light`, `app/work/page.tsx`, `MyWork.tsx` |
| Workspace › Projects | 3,5 | Thẻ dự án chỉ có "27 open", không có tiến độ/sức khoẻ/sprint. Nửa dưới màn hình trống. Mã dự án chữ trắng trên màu chỉ đạt **4,2:1**. → `ws-projects_1440_light`, `app/work/[ws]/page.tsx`, `ProjectMark` trong `ui.tsx` |
| Portfolio | 4 | Bảng RAG tốt. Nhưng **số "open" khác trang Projects** (19 so với 27, xem P0-2). Dòng phụ bị cắt chữ ("Sch... · Nguyen Van ..."). Tiêu đề cột VIẾT HOA, trong khi Workload/Desk viết thường. Thanh mốc 0/0 trống không có chú thích. → `ws-portfolio_1440_light`, `portfolio/PortfolioView.tsx` |
| Workload | 3,5 | Có heatmap và chú giải tốt. Nhưng việc không có hạn thì không vào tải: 12 thẻ đang chạy mà hiện **0%**, chỉ có một dòng "12 no due date" dễ bỏ sót. Chưa có lựa chọn phân tải theo sprint. → `ws-workload_1440_light`, `portfolio/WorkloadView.tsx` |
| AI agents | 4 | Rõ ràng. Hộp "Pro feature" dùng nền cam, lẫn với màu cảnh báo. → `ws-agents_1440_light` |
| Board | 4 | Thẻ đẹp, chip nhãn và điểm đúng chuẩn. Thẻ **Getting started cao khoảng 300px nằm trên cột** (ở 1180×800 chỉ còn thấy 1 hàng thẻ). Có nested-interactive (thẻ kéo được chứa nút). Thanh tiến độ sub-task thiếu `aria-label`. Header bị nén mất breadcrumb (P0-1). → `board_*`, `x-desktop1180-board_*`, `Board.tsx`, `onboarding/GettingStartedCard.tsx` |
| Backlog | 4 | Bố cục chuẩn Jira, có thanh epic. Vẫn lặp lại thẻ Getting started. Hàng có `role=row` nhưng thiếu vai cha `grid/rowgroup` (22 nút). Chip epic tím chỉ đạt 4,4:1. → `backlog_*`, `Backlog.tsx` |
| Issues (list) | **4,5 — đã ổn, giữ nguyên** | Tiêu đề dính, sắp xếp có `aria-sort`, chọn cột, xuất, JQL đều tốt. Chỉ có breadcrumb bị cắt "Client ..." vì toolbar đầy. Lỗi vai ARIA của hàng nhóm. → `list_*`, `app/work/[ws]/[key]/list/page.tsx` |
| Issue detail (trang + ngăn) | 3,5 | Có 5 khối trống (Approvals, Handoffs, Linked docs, Web links, Change requests) mỗi khối khoảng 80px, đẩy Activity xuống rất xa. Nên gập khối trống thành một hàng "+ Add…" như Jira. "AI-assisted: No · Mark" gây khó hiểu. `textarea` thiếu nhãn. → `issue_1440_light`, `x-issue-drawer_*`, `IssueDetail.tsx` |
| Timeline | 3 | Mỗi hàng đều có nhãn "Not scheduled — click to add dates", rất nhiễu. Không lùi về ngày của sprint/version khi thẻ chưa có ngày. Không có dải sprint/mốc version trên trục. Test case lẫn vào cây. Tên thẻ cột trái bị cắt ở 1440. → `timeline_*`, `Timeline.tsx` |
| Releases | 3,5 | Nhãn trạng thái VIẾT HOA xám (không giống các badge khác). Tiến độ 0/0 không giải thích. Chưa có release burndown. → `releases_*`, `Releases.tsx` (dòng 42) |
| Reports › Health | 4 | Ô KPI tốt và có brief AI. Chữ xanh "Sprint on track" chỉ đạt **4,17:1**. → `reports-health_*`, `reports/HealthTab.tsx` |
| Reports › Weekly / Client weekly | 4 | Trạng thái trống rõ. |
| Reports › Burndown | 3,5 | Recharts dùng token, có chú giải và cả Burnup. Còn thiếu: **nút xuất PNG/CSV**, chưa thấy dòng scope ở burndown, khi đang tải chỉ có spinner (không skeleton). → `reports-burndown_*`, `x-loading-burndown`, `reports/BurndownTab.tsx` |
| Reports › Velocity | 4 (trống) | Trạng thái trống tốt. Khi có dữ liệu vẫn thiếu đường trung bình 3 sprint và nút xuất. → `reports/VelocityTab.tsx` |
| Reports › Sprint report | 4 | Gọn. Chưa có biểu đồ nhỏ (scope change). |
| Reports › Contributions | **4,5 — đã ổn** | Bảng sắp xếp được, có Export CSV và Copy as text. |
| Reports › Time | **4,5 — đã ổn** | Lưới tuần chuẩn timesheet, cột cuối tuần có tô nền. |
| Reports › Capacity | 3,5 | Khi chưa đặt giờ/ngày thì "0 h / —" mà không có lời kêu gọi đặt giờ ngay tại ô. Form Time off chen vào giữa báo cáo. → `reports/CapacityTab.tsx` |
| Reports › Steering | 3,5 | Tiêu đề mục VIẾT HOA. Rủi ro mẫu là **tiếng Việt trong dự án tiếng Anh** (`raid/starter` không theo ngôn ngữ dự án, giống CTW-14). → `reports-steering_*`, `reports/S4ReportTabs.tsx`, `src/services/work` (starter risks) |
| Reports (thanh tab) | 3,5 | 11 tab trên một hàng, không nhóm (Sprint / Team / Client), ở 390 phải cuộn. → `app/work/[ws]/[key]/reports/page.tsx` |
| Dashboards | 3 (trống) → 4 (có widget) | Dự án mới **không có dashboard mặc định**, mở ra là trang trắng. Sau khi tạo thì widget tốt: donut có %, bar, created/resolved. Tuy vậy "Created" tô **đỏ** (đỏ phải dành cho xấu), và màu donut theo trạng thái không khớp màu badge trạng thái. Mỗi ô KPI chỉ có một con số, không có xu hướng hay so kỳ trước. → `dashboards_*`, `x-dashboard-widgets_*`, `dashboards/widgets.tsx` (dòng 329) |
| Docs | 4 | Trạng thái trống tốt, 36 mẫu. |
| Tests › Library | **4 — đã ổn** | Bảng chuẩn Xray. Vòng tròn "Unassigned" dùng `aria-label` trên div (aria-prohibited). |
| Tests › Unit 5.1 / Integration 5.2 | 3,5 | Dải KPI chữ HOA (FUNCTIONS, PASSED…) là **kiểu KPI thứ 3**, khác `StatCell`. "PASSED 0" tô xanh cả khi bằng 0. Ở 1440 nút hành động rơi xuống hàng 2, lệch phải. → `tests-unit_*`, `tests/fpt/shared.tsx`, `UnitTab.tsx` |
| Test cycle / test detail | 3,5 | Hàng là lưới có nút bên trong (nested-interactive ×5). Tiêu đề h1 lại là `input` không nhãn. → `test-cycle_*`, `tests/CyclesTab.tsx` |
| FPT reports › WBS | **2,5** | Bảng 12 cột mà mỗi ô là một ô nhập: rất nặng mắt, ở 1440 **cột Status bị cắt** ("Pen", "Tes"), phải cuộn ngang trong khung. Không có chế độ xem chỉ đọc hay chế độ sửa từng hàng. Chữ vàng "11" chỉ đạt 4,3:1. → `school-wbs_*`, `school/WbsTab.tsx` |
| FPT reports › tracking/weekly/AI/course | 4 | Thẻ tải xuống rõ ràng. Ô ngày/khác ở Course thiếu nhãn. |
| Stages / Approvals / Resources | 4 | Trạng thái trống tốt. |
| Client portal (team view) | 4 | Bố cục rõ. |
| Meetings | 3,5 | Khung nội dung hẹp (~910px), khác các trang khác (1070 hoặc full). Mỗi họp chỉ một dòng, phần lớn trang trống. → `meetings_*`, `governance/MeetingsView.tsx` |
| Changes / CR detail | 4 | `dl` sai cấu trúc (dlitem ×8), input tiêu đề thiếu nhãn. → `governance/ChangeDetail.tsx` |
| RAID | 3 | Ma trận rủi ro **không đặt rủi ro vào ô**, chỉ in điểm 1–25 với chữ đạt **2,33:1** (dark còn mờ hơn). Ô là `button` thiếu `role=row` (25 nút). Cột trái là "—" (chưa có điểm) mà không gợi ý chấm điểm. → `raid_*`, `governance/RaidView.tsx` |
| Finance | 3 | "Cost per week" khi không có dữ liệu là **khung trống, không trục, không trạng thái trống**. Biểu đồ tự vẽ bằng div, không tooltip. Thanh % ngân sách gần như vô hình ở dark. Ô nhập hợp đồng/ngân sách thiếu nhãn. → `finance_*`, `finance/FinanceView.tsx` (dòng 94–110) |
| Service desk | **4,5 — đã ổn** | Hàng đợi và SLA đúng chuẩn JSM. Chỉ có badge P2/P4 đạt 3,1–3,9:1. → `desk_*`, `desk/shared.tsx` |
| Spec quality / Present / Settings | 4 | Một số `select`/`input` thiếu nhãn (settings ×3). |
| Search toàn cục | 4 | Bảng tốt. Ô Basic nhận "project = CLI" như chữ thường và trả 0 kết quả, không gợi ý chuyển sang JQL. → `globalsearch/SearchPage.tsx` |
| ⌘K / phím `?` | **4,5 — đã ổn** | Có nhóm, phím tắt, chân hướng dẫn. |
| Trạng thái lỗi | **4 — đã ổn** | "Could not load the board" kèm Try again. → `x-error-*` |
| Focus bàn phím | 3,5 | Có vòng focus rõ, nhưng **không có "Skip to content"**: phải Tab hơn 14 lần qua thanh bên. → `x-focus-list_*`, `app/work/layout.tsx` |
| 390px (mọi trang) | 4 | Không trang nào tràn ngang. List cắt bớt cột hợp lý. Portfolio và Desk tự chuyển sang thẻ (tốt). WBS/Workload/Timeline vẫn là bảng cuộn ngang. |
| Dark theme | 4 | Đúng `theme-dark`. Kiểm mã: 0 chỗ dùng `dark:`, 0 lớp màu Tailwind cứng. Hai điểm yếu: ma trận RAID, thanh ngân sách. |

## 2. Lỗi P0 (nặng — nên sửa trước đợt 4)

| # | Lỗi | Bằng chứng | Tệp | Cỡ |
|---|---|---|---|---|
| P0-1 | **Header dự án vỡ ở khổ app desktop**. Ở 1180px trên Board có sprint, breadcrumb chỉ còn "‹ › C › Sprint 1": mất tên workspace và tên dự án vì 6 nút (Help, Lock, Ask AI, "8 days left", Complete sprint, Create) chiếm hết chỗ. Ở 1440 vẫn bị cắt "UX Review Studi…", "Client Portal …". Ai dùng app desktop cũng gặp. | `x-desktop1180-board_*`, `x-cmdk_light`, `list_1440_light` | `ProjectHeader.tsx`, toolbar từng trang (board/list) | M |
| P0-2 | **Cùng một dự án mà ba con số "open" khác nhau**: thẻ Projects 27, Portfolio 19, Dashboard 27/30. `projects.service.ts` đếm mọi cấp (epic, sub-task, test) còn `portfolio.service.ts` chỉ đếm `type.level = 0`, và không chỗ nào ghi định nghĩa. Trưởng nhóm/giảng viên mất tin vào số liệu. | `ws-projects_1440_light` so với `ws-portfolio_1440_light` | `src/services/work/projects.service.ts:103`, `portfolio.service.ts:102` | S |
| P0-3 | **Tương phản dưới AA (4,5:1)** ở những chỗ dùng hằng ngày: số trong ô ma trận RAID 2,33:1; badge ưu tiên desk 3,1–3,9; chữ xanh "on track" 4,17; vàng 4,3; chip epic 4,4; chữ trắng trên `ProjectMark` 4,2; chữ cam priority trên board 3,75. | axe `color-contrast` ở 8 trang | `work.css` (token `--w-green/yellow/orange` dùng làm màu chữ), `governance/RaidView.tsx`, `desk/shared.tsx`, `ui.tsx` (ProjectMark) | S |

## 3. Lỗi P1/P2 khác (ngoài bảng trên)

| Mức | Lỗi | Tệp | Cỡ |
|---|---|---|---|
| P1 | Thanh bên của dự án CLIENT bật đủ mô-đun có hơn 20 mục. Ở màn cao 900px, nhóm **Insights (Reports/Dashboards/FPT reports) nằm dưới nếp gấp**, và mục đang chọn không tự cuộn vào khung nhìn (Reports bị che nửa). | `WorkSidebar.tsx` | S |
| P1 | Thẻ Getting started cao khoảng 300px xuất hiện trên cả Board **và** Backlog. Nên thu thành một dải 1 dòng sau lần đầu, hoặc chỉ hiện ở trang tổng quan. | `onboarding/GettingStartedCard.tsx` | S |
| P1 | Có **3 kiểu ô KPI**: `StatCell` (reports), dải chữ HOA (tests/fpt), ô bấm-lọc (portfolio). Cộng thêm tiêu đề cột/mục khi HOA khi thường (89 chỗ dùng `uppercase`). | `reports/shared.tsx`, `tests/fpt/shared.tsx`, `portfolio/PortfolioView.tsx`, `Releases.tsx` | M |
| P1 | Chiều rộng khung nội dung không thống nhất: Meetings ~910, Reports ~1070, RAID/Desk full. | các `*View.tsx` | S |
| P1 | ARIA: `role=row` thiếu cha (backlog 22, list, raid 25, search); nested-interactive (board, test cycle); `aria-label` trên div không vai (backlog 16, list 21); 8 trang có input/select thiếu nhãn; `dl` sai cấu trúc (CR). | `Backlog.tsx`, `list/page.tsx`, `RaidView.tsx`, `Board.tsx`, `CyclesTab.tsx`, `ChangeDetail.tsx`, `FinanceView.tsx` | M |
| P1 | Biểu đồ trống không có trạng thái trống (Finance), biểu đồ tự vẽ bằng div không có tooltip/trục. | `finance/FinanceView.tsx` | S |
| P1 | WBS: mọi ô là ô nhập và cột bị cắt (xem bảng mục 1). | `school/WbsTab.tsx` | M |
| P2 | Không có "Skip to content". Lúc tải chỉ có spinner, không skeleton (`PageLoading` có sẵn nhưng các tab báo cáo không dùng). | `app/work/layout.tsx`, `reports/*` | S |
| P2 | Ngôn ngữ lẫn lộn: rủi ro/nội dung mẫu tiếng Việt trong dự án tiếng Anh. | service RAID starter | S |
| P2 | Issue detail có các khối trống chiếm chỗ. Timeline nhiễu với nhãn "Not scheduled" lặp ở mọi hàng. | `IssueDetail.tsx`, `Timeline.tsx` | M |
| P2 | Search Basic không gợi ý chuyển JQL khi chữ gõ vào trông giống JQL. | `globalsearch/SearchPage.tsx` | S |

## 4. Biểu đồ — hiện trạng và đề xuất

| Mục | Hiện trạng | Đề xuất |
|---|---|---|
| Thư viện | **Recharts 2.15** ở 4 tệp: `BurndownTab`, `VelocityTab`, `dashboards/widgets`, `agents/PeopleVsAgents` (cộng `share/ShareViews`). Đã dùng token `--w-chart-1..8`, `--w-chart-grid`, tắt animation, có tooltip dùng chung. Chỗ còn lại **tự vẽ bằng div/SVG**: Finance cost/week, thanh % portfolio/release, heatmap workload, ma trận RAID. | **Giữ Recharts làm thư viện duy nhất** (không thêm Chart.js/ECharts). Heatmap/ma trận vẫn dùng lưới CSS (Recharts không có loại này) nhưng đi chung khung `ChartFrame`. |
| Khung chung | Mỗi biểu đồ tự làm tiêu đề, chú giải và trạng thái trống. | Tạo `components/work/charts/ChartFrame.tsx`: tiêu đề + mô tả, chú giải, trạng thái trống/đang tải/lỗi, nút **Xuất PNG** (html-to-image hoặc canvas) + **CSV**, bảng dữ liệu ẩn cho trình đọc màn hình. |
| Loại biểu đồ còn thiếu | Đã có burndown/burnup, velocity, created vs resolved, pie, bar, People vs Agents. | Thêm **CFD** (cumulative flow theo trạng thái, cần snapshot theo ngày — đã có cron snapshot mỗi giờ), **cycle/lead time control chart** (scatter + trung vị/P85), **throughput theo tuần**, **release burndown**, **velocity + đường TB 3 sprint**. |
| Màu ngữ nghĩa | "Created" màu đỏ. Màu donut trạng thái không trùng màu badge. | Đỏ chỉ dùng cho xấu (quá hạn/blocker). Trạng thái lấy từ `CATEGORY_DOT`/màu status của workflow. |

## 5. Gói việc đề xuất (vừa sức một agent Opus mỗi gói)

### Gói UX-A — Nền tảng và nhất quán (P0 + P1 nền) · L

| Việc | Tệp | Cỡ |
|---|---|---|
| Header thích ứng: breadcrumb luôn giữ tên dự án. Nút phụ (Help, Lock, Present, "x days left") gom vào menu "…" khi dưới 1280px. Toolbar list/board xuống hàng 2 thay vì nén breadcrumb. Kiểm ở 1180/1024/390. | `ProjectHeader.tsx`, `board/page.tsx`, `list/page.tsx` | M |
| Một định nghĩa "open issues" (khuyên dùng: thẻ cấp 0 + bug, không đếm sub-task/test), dùng chung cho Projects, Portfolio, Dashboard counter, kèm tooltip định nghĩa. | `projects.service.ts`, `portfolio.service.ts`, `widgets.tsx` | S |
| Token chữ màu đạt AA (`--w-green-text`, `--w-yellow-text`, `--w-orange-text`). Sửa RAID, desk, ProjectMark (chữ tối khi nền sáng). | `work.css`, `RaidView.tsx`, `desk/shared.tsx`, `ui.tsx` | S |
| Một component `KpiTile` thay cho 3 kiểu ô KPI. Quy ước sentence case cho tiêu đề cột. Chiều rộng khung chung (`max-w` một token). | `reports/shared.tsx`, `tests/fpt/shared.tsx`, `PortfolioView.tsx`, `Releases.tsx`, `MeetingsView.tsx` | M |
| Thanh bên: nhóm mô-đun studio có thể gập, tự `scrollIntoView` mục đang chọn. Getting started thu gọn sau lần đầu và chỉ hiện ở một trang. Thêm Skip to content. | `WorkSidebar.tsx`, `GettingStartedCard.tsx`, `app/work/layout.tsx` | S |
| Dọn ARIA theo danh sách axe ở mục 3, chạy lại axe tới khi bằng 0 violation. | như mục 3 | M |

### Gói UX-B — Biểu đồ và dashboard dự án/workspace · L

| Việc | Tệp | Cỡ |
|---|---|---|
| `ChartFrame` + xuất PNG/CSV, rồi chuyển Burndown/Velocity/widgets/PeopleVsAgents/Finance sang khung này. Finance cost/week chuyển sang Recharts. | `components/work/charts/*`, `reports/*`, `dashboards/widgets.tsx`, `finance/FinanceView.tsx` | M |
| Endpoint và biểu đồ mới: CFD, cycle/lead time, throughput, release burndown, velocity có đường TB. | `src/services/work/reports.service.ts`, `reports/*` | L |
| **Dashboard dự án mặc định** tự tạo ("Project overview"): hàng KPI (open, overdue, blocked, sức khoẻ sprint, % scope done, rủi ro ≥15), burndown, CFD, tải theo người, top rủi ro, created/resolved (đổi màu). Mỗi ô KPI có xu hướng so với tuần trước. | `dashboards/widgets.tsx`, service dashboards | M |
| Workload: tính cả thẻ không có hạn theo ngày kết thúc sprint, và có chế độ "theo sprint". | `portfolio/WorkloadView.tsx`, service | S |

### Gói UX-C — Bảng dữ liệu và tổng quan cho trưởng nhóm/giảng viên · L

| Việc | Tệp | Cỡ |
|---|---|---|
| Component `DataTable` dùng chung (tiêu đề dính, sắp xếp `aria-sort`, chọn cột lưu localStorage, mật độ gọn/thoáng, CSV), rút ra từ List và Contributions — hai bảng đã ổn. Áp cho Releases, Finance, Capacity, Workload, Tests library, Desk. | `components/work/table/*` + các view | M |
| WBS: chế độ xem chỉ đọc mặc định + sửa từng hàng (hoặc sửa trực tiếp khi bấm ô), cột Status không bị cắt, chế độ thẻ ở 390. | `school/WbsTab.tsx` | M |
| **Trang "Tổng quan nhóm" cho giảng viên/trưởng nhóm** (mở rộng Portfolio, lọc SCHOOL): mỗi nhóm một hàng gồm velocity 3 sprint, % scope xong, cân bằng đóng góp (Gini/biểu đồ thanh xếp chồng theo người), hoạt động cuối, bằng chứng nộp FPT (WBS/5.1/5.2 đã xuất?), cờ rủi ro. Bấm vào thì mở đúng tab báo cáo. | `portfolio/PortfolioView.tsx` (+ tab mới), `portfolio.service.ts` | L |
| Timeline: lùi về ngày sprint/version, dải sprint và mốc version trên trục, gộp "Not scheduled" thành một nút trên đầu nhóm, ẩn test case. Issue detail: gập khối trống thành hàng "+ Add". | `Timeline.tsx`, `IssueDetail.tsx` | M |

Thứ tự khuyên làm: **UX-A trước đợt 4** (có 3 P0), còn UX-B và UX-C gộp dần vào đợt 4–5. Tính năng mới từ giờ dùng `KpiTile`/`ChartFrame`/`DataTable` ngay từ đầu.

## 6. Đã ổn — giữ nguyên

Issues list · Contributions · Time · Service desk · Tests library · ⌘K và phím `?` · trạng thái lỗi "Could not load… / Try again" · trạng thái trống (Docs, Stages, Velocity, Dashboards, Unit/Integration) · hệ token `work.css` (đúng luật `theme-dark`, không dùng `dark:`, không màu Tailwind cứng) · bố cục 390px (không tràn ngang trang nào; Portfolio/Desk tự chuyển sang thẻ) · Board/Backlog phần cột và thẻ.
