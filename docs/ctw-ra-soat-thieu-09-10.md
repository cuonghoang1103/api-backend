# CT Work — RÀ SOÁT TOÀN DIỆN CHỖ CÒN THIẾU (09/10/2026)

> Chỉ đọc + chạy thử, không sửa mã. Đối chiếu dựa trên **bằng chứng trong repo** (đường dẫn ghi kèm), **mẫu FPT thật**
> trong `~/Documents/Report Đồ án/` (Report1–7, 5.0–5.3, Project Tracking, Weekly Report SEP490) và
> `~/Documents/Slide-Document/SWP391/materials/` (Template0 AI Usage, Template1 Project Tracking, Template4 Issues Report),
> cùng **38 thẻ của dự án CTW trên production** (đọc qua `.ctwork/lib.mjs`, tài khoản `fp_claude`).
> Đợt 2 (MCP, UI agent, chi phí agent, Giao cho AI, bàn giao — CTW-31/33/34/35) coi như sẽ có, KHÔNG liệt kê lại.
>
> Ký hiệu: ✅ Có · 🟡 Thiếu một phần · ❌ Thiếu. Ưu tiên: **P0** nhóm đồ án cần ngay · P1 · P2. Cỡ: S (≤1 ngày agent) · M (1–3) · L (>3).

## 0. Tóm tắt

| | Số mục |
|---|---|
| ✅ Có | **22** (trong đó A12/A13/B3 = đợt 1b, chưa lên prod) |
| 🟡 Thiếu một phần | **39** |
| ❌ Thiếu | **25** (C26 gộp vào A8) |
| Tổng | **86** (A 31 · B 11 · C 34 · D 10) |

**P0 (11 mục)** — đều xoay quanh một câu: *nhóm đồ án chưa nộp được hồ sơ FPT trực tiếp từ CT Work*:
1. **D4** — Đợt 1a+1b (`89d91ba9`) **chưa push/deploy**: 5.1/5.2 chưa có trên prod; 10 thẻ CTW đã sửa vẫn mở.
2. **A30** — Không có mẫu dự án **Capstone SEP490/ISP490** (chỉ SWR302/SWT301/SWP391/FREELANCE/COMPANY).
3. **A1/A2/A11/A17/A18** — Không có **bộ mẫu tài liệu FPT Report 1→7** đúng đề mục trường.
4. **A9** — Docs chỉ xuất **Markdown**; trường nộp **.docx** (và PDF).
5. **A8** — Trình soạn thảo **không chèn được ảnh / sơ đồ** (UC, ERD, class, sequence) — SRS/SDD không viết nổi trong Docs.
6. **A6** — Không có **mô hình Use Case có cấu trúc** (actor, UC spec, luồng chính/phụ/ngoại lệ, business rule, screen authorization).
7. **A14** — Thiếu **Report 5.3 System Test** (Cover / Test Cases / Test Statistics / sheet theo workflow, Round 1–3).
8. **A23** — Xuất **Project Tracking** mới khớp mẫu SWP391 kiểu "Product+Summary"; thiếu mẫu **SEP490 (Scope/WBS/Q&A/TimeLogs/Defects/Issues)**, **SWP391 Template1 (Project + Iter1–4)**, **Template4 Issues Report**.
9. **A3** — Thiếu **WBS + ước lượng** (man-day, Simple/Medium/Complex theo số field/transaction).
10. **A21** — Báo cáo tuần chỉ là bản AI .md; thiếu **Weekly Report .xlsx mẫu FPT** (mỗi tuần một sheet: Status Report + Project Issues) và lưu trữ theo tuần.
11. **A29** — Thiếu **AI Usage Report** (SWP391 Template0: theo tuần, pha SDLC, công cụ AI, kiểm chứng, bằng chứng, điểm 1–5).

**Kế hoạch đợt** (chi tiết §6): **Đợt 3** "nộp được hồ sơ" (P0 tài liệu + xuất Excel, 2 agent) → **Đợt 4** SRS có cấu trúc + RTM đầy đủ + defect/Q&A log → **Đợt 5** giảng viên & đóng góp nhóm → **Đợt 6** chất lượng (CI chạy test DB, E2E, hiệu năng, rò rỉ cổng khách, kỹ thuật thiết kế test) → **Đợt 7** bù công cụ thương mại (P2) → **Đợt 8** nền tảng (tiếng Việt UI, mobile, offline, đồng soạn thảo).

---

## 1. Bản đồ những gì CT Work THẬT SỰ có (bằng chứng)

| Mảng | Có gì | Bằng chứng |
|---|---|---|
| Quy mô | 105 model `Work*`, ~36,4k dòng service, ~53k dòng FE; 41 trang dưới `/work` | `prisma/schema.prisma`, `src/services/work/*`, `frontend/src/app/work/**` |
| Lõi Jira | Workspace/dự án, thẻ Epic/Story/Task/Bug/Requirement/Test/Sub-task, link, nhãn, component, watcher, lịch sử, đính kèm, board dnd + swimlane + WIP, backlog/sprint, bulk edit, cờ Flag (CTW-11), clone, thùng rác | `issues.service.ts`, `sprints.service.ts`, `templates.ts`, `components/work/board/` |
| Mẫu dự án | BLANK · SWR302 (MoSCoW) · SWT301 (Bug Retest) · SWP391 · FREELANCE · COMPANY; loại PERSONAL/SCHOOL/SOFTWARE/CLIENT + mô-đun bật/tắt | `templates.ts:62-100`, `constants.ts:55` |
| Vai trò | Workspace OWNER/ADMIN/MEMBER/GUEST; dự án ADMIN/MEMBER/VIEWER/**TEACHER**/CLIENT; khoá chỉnh sửa | `permissions.ts:56-95`, `editLock.service.ts` |
| Tìm kiếm | JQL (+`me`, project, flagged…), lưu bộ lọc, tìm toàn cục ⌘K, bỏ dấu tiếng Việt | `jql.ts`, `search.service.ts`, `globalSearch.service.ts` |
| Báo cáo | Burndown/burnup, velocity, sprint report, epic, contributions, time, capacity, health, weekly (AI), dashboard 6 loại widget | `reports.service.ts`, `components/work/reports/*`, `dashboards/widgets.tsx` |
| Kế hoạch | Timeline/Gantt, phụ thuộc, **critical path**, version/release notes, capacity, time-off, worklog, timesheet + duyệt | `planning.service.ts` (`timeline`, `criticalPath`, `capacity`…), `finance.service.ts` |
| Kiểm thử (Xray) | Test case + bước + Gherkin, test plan, cycle/run P/F/B/S, Fail→Bug, Retest, traceability Req↔Test↔Bug, xuất cycle report xlsx/pdf/csv | `tests.service.ts`, `components/work/tests/*` |
| Kiểm thử FPT (đợt 1b) | Unit 5.1 ma trận UTCID, Integration 5.2, Cover + Record of change, xuất/nhập Excel đúng mẫu, AI gợi ý biên | `fptTests.ts`, `fptTests.service.ts`, `components/work/tests/fpt/*` — **CHƯA lên prod** |
| Tài liệu | Docs kiểu Confluence (cây trang, 100 phiên bản, trạng thái duyệt, hiển thị CLIENT), **36 mẫu** (srs, sdd, adr, ke-hoach-du-an, ke-hoach-kiem-thu, bao-cao-tuan, retrospective, release-notes…), nhập .md, xuất .md, AI đọc/ghi Docs, rà soát đặc tả (ISO 29148) | `pages.service.ts`, `docTemplates.ts`, `content/quy-trinh/mau/`, `specReview.service.ts` |
| Studio | Bộ phận, giai đoạn + cổng duyệt, phê duyệt có contentHash, bàn giao, cổng khách + UAT, CR, RAID, họp (Jitsi/Meet, .ics, action→thẻ), tài chính, báo cáo khách tự động + PDF, trình chiếu, xuất/nhập ZIP, service desk + SLA, Resources, provenance AI | `stages/approvals/handoffs/portal/changeRequests/raid/meetings/finance/clientReports/projectExport/projectImport/serviceDesk/resources/provenance` |
| Tích hợp | GitHub, GitLab, Discord/Slack/Google Chat (gửi ra), lịch .ics, API token `ctw_`, webhook agent, import CSV (CT Work + Jira), xuất CSV/XLSX/PDF | `github.service.ts`, `gitlab.service.ts`, `chatHooks.service.ts`, `calendar.service.ts`, `exchange.service.ts` |
| AI | Trợ lý hội thoại chung, viết story, plan sprint, luyện bảo vệ (hội đồng hỏi–chấm /10), soát Req, sức khoẻ nhóm, retro, release notes, phát hiện trùng | `ai.service.ts`, `aiInsights.service.ts`, `aiThreads.service.ts` |
| Đồ án SWP391 | Xuất Project Tracking (Product + Summary theo PIC, LOC dự kiến/đã chấm, Quality) | `projectTracking.service.ts` |
| Onboarding | Dữ liệu mẫu, checklist Getting started, Help 27 bài song ngữ (phím ?) | `onboarding.service.ts`, `components/work/help/` |
| Nền tảng | Web; app desktop (tuyến trong `dinhTuyenWeb.ts`); iOS 5 màn (board, thẻ, tạo thẻ) | `desktop/src/renderer/features/web/dinhTuyenWeb.ts`, `ios-app/CuongThaiApp/Shared/CTWork/` |
| Test | 364 unit test pass (chạy 09/10, 4,8s); ~318 test DB (`WORK_DB_TEST=1`) | `src/services/work/*.test.ts`, `src/routes/work*.db.test.ts` |

---

## 2. Nhóm A — Hồ sơ đồ án FPT (SEP490 / ISP490 / SWP391 / LabFlow)

Mẫu đối chiếu: `~/Documents/Report Đồ án/*` (bộ G108 Aparta) + `SWP391/materials/Template0–5`.

| # | Hạng mục | TT | Bằng chứng / chỗ hở | Vì sao cần | Ưu tiên | Cỡ | Gợi ý chỗ đặt |
|---|---|---|---|---|---|---|---|
| A1 | Report 1 Project Introduction (Record of Changes, Definitions, Overview/Team, Background, Existing Solutions, Opportunity, Scope & Limitations) | ❌ | Không có mẫu; gần nhất là `de-xuat-giai-phap.md`, `bien-ban-kick-off.md` | Nộp tuần 1–2; nhóm đang tự viết Word | P0 | S | `content/quy-trinh/mau/fpt-report1-*.md` + `catalog.json` (nhóm "FPT Capstone"); chép bản sao `frontend/public/quy-trinh/mau/` (test `docTemplates.test.ts` bắt lệch) |
| A2 | Report 2 Project Management Plan (Cost & Time Estimation, Objectives, Risks, Processes, Quality, Training, Responsibility, Communications, Config Mgmt) | 🟡 | `ke-hoach-du-an.md` có, nhưng không theo đề mục FPT, không tự điền số liệu (rủi ro từ RAID, thành viên, mốc từ version) | Report 2 chấm điểm theo đúng đề mục | P0 (mẫu) / P1 (tự điền) | S / M | như A1; tự điền: `aiDocs.ts` hoặc `docSections.ts` (khối dữ liệu động) |
| A3 | WBS + ước lượng (man-day/pds, Simple/Medium/Complex theo ≤7/≤15/>15 field & transaction, Planned iteration, Actual effort) | 🟡 | Cây epic→story→sub-task + points/hours; Project Tracking đọc trường "Complexity"/"Planned LOC" theo tên; **không có** bảng quy đổi độ phức tạp → effort, không có view WBS đánh số 1.0/1.1 | Sheet Scope + WBS của Report2_Project Tracking là thứ GV xem hằng tuần | P0 | M | `planning.service.ts` (wbs()), `settings.estimationMatrix`; FE tab "WBS" trong `reports/` hoặc `backlog` |
| A4 | Lịch dự án / Gantt / mốc | ✅ | `planning.service.ts` timeline + criticalPath, Releases | — | — | — | — |
| A5 | Ma trận trách nhiệm (RACI) | 🟡 | Có Teams/vai trò/PIC; không có bảng RACI theo hạng mục/tài liệu | Mục "Responsibility Assignments" Report 2 | P2 | S | sinh bảng từ `WorkTeam` + PIC vào mẫu A2 |
| A6 | SRS có cấu trúc: Actors, danh sách UC, UC spec (ID, actor, trigger, pre/post, normal/alternative/exception flow, BR refs), Screens Flow, **Screen Authorization** (actor × màn), Non-UI functions | ❌ | Chỉ có loại thẻ REQUIREMENT + MoSCoW + mẫu `srs.md` dạng văn bản; grep "use case"/"business rule" chỉ thấy trong prompt AI | Report 3 chiếm phần lớn điểm; 489 đề mục ở bản mẫu — viết tay dễ lệch với thẻ | P0 | L | Model mới `WorkUseCase`/`WorkActor`/`WorkBusinessRule` (hoặc trường cấu trúc trên thẻ REQUIREMENT `settings.ucSpec`), FE `components/work/spec/`; xuất vào A9 |
| A7 | Business Rules register (BR-01…, được UC tham chiếu) | ❌ | Không có | UC spec FPT luôn tham chiếu BR | P1 | S | gộp A6 |
| A8 | **Ảnh + sơ đồ** trong trình soạn thảo (dán ảnh chụp, UC/ERD/class/sequence; Mermaid/PlantUML hoặc nhúng draw.io) | ❌ | `RichEditor.tsx` không có extension image/diagram (chỉ table, task list, code, mention, link); xem trước link Google/OneDrive có (`CustomFields.tsx` DocPreviewButton) | SRS/SDD/User Guide không thể thiếu hình; bug report cần ảnh chụp | P0 | M | `frontend/src/components/work/RichEditor.tsx` (+@tiptap/extension-image, upload R2 qua attachment API), khối Mermaid render client; `docMarkdown.ts` hai chiều |
| A9 | Xuất **.docx** (và PDF) từ Docs; ghép nhiều trang thành một Report | ❌ | `DocView.tsx:290` chỉ "Export as Markdown"; grep `docx` trong work chỉ ra prompt AI | Trường nộp Word đúng mẫu; Report 7 = ghép 1–6 | P0 (docx 1 trang) / P1 (ghép) | M / M | `src/services/work/docxRender.ts` (thư viện `docx`), route trong `work.s5c.routes.ts`/`work.routes.ts`; PDF dùng lại `reportRender.ts` |
| A10 | Record of Changes tự động (ngày, phiên bản, A/M/D, mô tả) cho mỗi tài liệu | 🟡 | `WorkPageVersion` có lịch sử 100 bản; không xuất bảng Record of Changes; 5.1/5.2 thì có (`WorkFptChange`) | Trang đầu mọi Report FPT | P1 | S | `pages.service.ts` + khối tự sinh trong A9 |
| A11 | Report 5.0 Test Documentation (Scope, Strategy, Types, Levels, Tools, Environment, Milestones, Test Cases, Reports) | 🟡 | `ke-hoach-kiem-thu.md` + thực thể Test Plan; không theo đề mục FPT, không kéo số liệu từ plan/cycle | Report 5 | P0 (mẫu) | S | như A1 |
| A12 | Report 5.1 Unit Test | ✅* | `fptTests.*` (89d91ba9) — *chưa lên prod (D4)* | — | — | — | — |
| A13 | Report 5.2 Integration Test | ✅* | như A12 | — | — | — | — |
| A14 | **Report 5.3 System Test** (Cover, Test Cases list, Test Statistics theo module, sheet theo workflow: Test requirement, Round 1–3 Passed/Failed/Pending/N/A, TC ID/Description/Procedure/Expected/Pre-conditions/Round n/Test date/Tester) | 🟡 | Test cycle ≈ một vòng, xuất cycle report generic (`CyclesTab.tsx`, help `content.ts:1074`); không có workbook đúng mẫu 5.3 nhiều vòng | Report 5.3 nộp cuối kỳ | P0 | M | mở rộng `fptTests.ts` (`buildSystemSheets`) — lấy test case Xray, Round = cycle; FE tab "System 5.3" trong `tests/fpt/` |
| A15 | Acceptance test / UAT | 🟡 | `WorkUatRequest` (cổng khách), mẫu `bien-ban-nghiem-thu-uat.md`; không có cho đồ án (GV/mentor nghiệm thu) | Capstone có buổi demo/nghiệm thu | P2 | S | cho TEACHER dùng luồng UAT của `portal.service.ts` |
| A16 | Defect log thống nhất (gồm lỗi **review tài liệu**: Activity, Product, Product details, Assigner, Assignee, Status) | 🟡 | Bug cho code + findings của spec review cho tài liệu, hai nơi; không xuất được sheet Defects | Sheet Defects của Project Tracking; tính defect density | P1 | M | `projectTracking.service.ts` + trường "Activity/Product" trên Bug; findings `specReview` → Bug một chạm |
| A17 | Report 6 User Guide / Installation (Deliverable package, HW/SW requirements, cài đặt, User Manual theo màn) | ❌ | Không có mẫu | Report 6 | P0 (mẫu) / P2 (khung tự sinh từ danh sách màn A6) | S / M | như A1 |
| A18 | Report 7 Final Project Report (ghép 1–6 + Acknowledgement) | ❌ | Không có | Nộp cuối, bảo vệ | P1 | M | dựa A9 "ghép trang" |
| A19 | RTM đầy đủ (Req/UC ↔ mục SRS ↔ mục SDS ↔ code/commit ↔ test case ↔ bug) | 🟡 | `tests.service.ts:622 traceability` chỉ Req/Story ↔ Test ↔ Bug, CSV | Template1 Iter có cột SRS/SDS; hội đồng hỏi truy vết | P1 | M | mở rộng `traceability()` + link trang Docs (`WorkPageIssueLink` đã có) + `WorkDevActivity` |
| A20 | Biên bản họp | ✅ | `meetings.service.ts` (minutes, actions→thẻ, share, .ics) | — | — | — | — |
| A21 | **Weekly Report .xlsx mẫu FPT** (mỗi tuần một sheet: I. Status Report — task/in-charge/status/notes; II. Project Issues — owner/status/solution) + lưu từng tuần | 🟡 | `WeeklyReportTab.tsx` sinh bằng AI, Copy/.md, audience Lecturer; không xlsx, không lưu kỳ | SEP490 nộp Weekly Report hằng tuần | P0 | S | `projectTracking.service.ts` (weeklyXlsx, dữ liệu xác định, không cần AI) + lưu `WorkClientReport` kind `TEAM_WEEKLY` |
| A22 | Q&A log (câu hỏi với GV/khách: date, question, by, to, priority, due, status, answer) | ❌ | `RAID_TYPES = RISK/ASSUMPTION/ISSUE/DEPENDENCY` (`constants.ts:132`) | Sheet Q&A Project Tracking; làm rõ yêu cầu với GV | P1 | S | thêm type `QUESTION` vào RAID (`governance.ts` trạng thái riêng) |
| A23 | **Project Tracking theo đủ mẫu**: SEP490 (Scope, WBS, Q&A, TimeLogs, Defects, Issues), SWP391 Template1 (Project + Iter1–4 với cột SRS/SDS), Template4 Issues Report (kiểu GitLab) | 🟡 | `projectTracking.service.ts` chỉ Product + Summary | GV chấm theo đúng file mẫu từng lớp | P0 | M | `projectTracking.service.ts` thêm `variant` (SEP490/SWP391_T1/ISSUES) |
| A24 | Time log theo **Activity** (Analyzing/Designing/Coding/Testing/Review…) + Work Product (Report1…) + trạng thái duyệt | 🟡 | `WorkWorklog` chỉ minutes/startedAt/note/source; timesheet duyệt có ở finance | Sheet TimeLogs | P1 | S | thêm cột `activity`, `workProduct` (migration chỉ-thêm), FE `TimeTracking.tsx` |
| A25 | Checklist review tài liệu/code theo FPT | 🟡 | `checklist-*.md`, Done rules, spec review | Quality Management trong Report 2 | P2 | S | mẫu checklist + gắn vào phê duyệt trang |
| A26 | Số đo LOC thật / năng suất (LOC/pd) / **defect density** (defect/KLOC) | 🟡 | LOC chỉ là trường tay "Planned/Graded LOC"; TC/KLOC ở 5.1; GitHub webhook không lưu additions/deletions | Report 7 + GV chấm từng người theo LOC | P1 | M | `github.service.ts`/`gitlab.service.ts` lưu dòng thêm/xoá vào `WorkDevActivity`; widget mới |
| A27 | Đóng góp thành viên đầy đủ + **đánh giá chéo** (peer evaluation) | 🟡 | `reports.service.ts:132 contributions` = resolved/points/subtasks/created/comments/updates/open; không có commit, giờ, tài liệu, test; không có peer review | Trưởng nhóm phải chứng minh phân công công bằng; nhiều GV yêu cầu peer assessment | P1 | M | mở rộng `contributions()`; model `WorkPeerReview` (ẩn danh với thành viên, GV xem) |
| A28 | Giảng viên/mentor: **trang Supervisor xem mọi nhóm** (xuyên workspace), nhận xét/chấm theo mốc (rubric) | 🟡 | Vai TEACHER đọc mọi thứ + bình luận + duyệt (`permissions.ts:61`); portfolio gói trong 1 workspace và GUEST không thấy workload (`portfolio.service.ts:85-100`); không rubric/điểm | GV hướng dẫn 3–5 nhóm ở các workspace khác nhau | P1 (hub) / P2 (rubric) | M / M | `src/services/work/supervisor.service.ts` + trang `/work/supervising`; rubric gắn vào `WorkStage` (cổng giai đoạn = mốc Report) |
| A29 | **AI Usage Report** (SWP391 Template0: Overview + mỗi tuần: SDLC phase, task, AI tool, output, validation/modification, evidence link, quantitative measure, value 1–5, risks) | 🟡 | `provenance.ts` biết thẻ nào AI-assisted; không có nhật ký theo mẫu, không xuất | SWP391 bắt buộc khai báo dùng AI | P0 | M | model `WorkAiUsageLog` (tự điền từ provenance + `WorkAiMessage`, người sửa thêm validation) + xuất xlsx trong `projectTracking.service.ts` |
| A30 | **Mẫu dự án Capstone SEP490/ISP490** (giai đoạn Report1→7, iteration 1–3, epic theo Report, Done rules, mô-đun docs/meetings/raid bật sẵn) | ❌ | `templates.ts` không có; LabFlow dựng bằng script tay `scripts/labflow-seed/sep490-ho-so.mjs` | Nhóm capstone tạo dự án là có ngay khung; khỏi chạy script | P0 | S-M | `templates.ts` case `CAPSTONE` + stage seed như `client-project-template.json`; dùng lại `sep490-ho-so.mjs` làm nguồn |
| A31 | Luyện bảo vệ / hỏi đáp hội đồng | ✅ | `POST /ai/defense` | — | — | — | — |

## 3. Nhóm B — SWT301 (kiểm thử)

| # | Hạng mục | TT | Bằng chứng / chỗ hở | Ưu tiên | Cỡ | Chỗ đặt |
|---|---|---|---|---|---|---|
| B1 | Test plan | ✅ | `WorkTestPlan`, `PlansTab.tsx`, mẫu `ke-hoach-kiem-thu.md` | — | — | — |
| B2 | Kỹ thuật thiết kế test (EP, BVA, decision table, state transition, pairwise) → sinh test case | ❌ | Chỉ nhắc BVA trong `tests/fpt/AiSuggestDialog.tsx` | P1 | M | `components/work/tests/design/` (bảng phân vùng, bảng quyết định) + `tests.service.ts` sinh case |
| B3 | Test case mẫu FPT (5.1/5.2) | ✅* | đợt 1b, chưa prod | — | — | — |
| B4 | Bug report (steps/expected/actual) + vòng đời Retest + Fail→Bug | ✅ | `templates.ts:206-213`, `BUG_LIFECYCLE` | — | — | — |
| B5 | Trường **Severity** mặc định cho Bug (khác Priority) | 🟡 | Phải tự tạo custom field (`ProjectFields.tsx` chỉ gợi ý) | P1 | S | thêm vào `templateSpec` SWT301/SWP391/CAPSTONE như `MOSCOW_FIELD` |
| B6 | Test Summary Report (IEEE 829: phạm vi, sai lệch, số liệu tổng nhiều vòng, tiêu chí kết thúc, ký duyệt) | 🟡 | Cycle report xlsx/pdf từng vòng | P1 | S | `tests.service.ts` summary + mẫu doc `bao-cao-kiem-thu.md` tự điền |
| B7 | Ma trận truy vết | ✅ | `TraceabilityTab.tsx` | — | — | — |
| B8 | Gherkin/BDD | ✅ | `tests.service.ts` | — | — | — |
| B9 | Số đo kiểm thử (pass-rate theo vòng, defect theo severity/module, leakage, retest rate) | 🟡 | Dashboard widget chung; `itStats`/`unitStats` riêng 5.1/5.2 | P2 | M | widget mới `dashboards/widgets.tsx` |
| B10 | Nhập kết quả test tự động (JUnit XML / Playwright / Jest JSON) → run | ❌ | Không có | P2 | M | `tests.service.ts importResults` + endpoint CI token |
| B11 | Phiên exploratory testing (charter, ghi chú, bug) | ❌ | Không có | P2 | S | loại cycle `EXPLORATORY` |

## 4. Nhóm C — So với công cụ thương mại (Jira SW/JSM, Confluence, Xray/TestRail, Linear, ClickUp/Asana/Monday)

| # | Hạng mục | TT | Bằng chứng / chỗ hở | Ưu tiên | Cỡ | Chỗ đặt |
|---|---|---|---|---|---|---|
| C1 | Board/backlog/sprint/bulk/clone/trash | ✅ | xem §1 | — | — | — |
| C2 | JQL, saved filter, tìm toàn cục | ✅ | `jql.ts`, `SavedFilters.tsx` | — | — | — |
| C3 | Dashboard | 🟡 | 6 loại widget (`bar/counter/created_resolved/health/my_issues/pie`); thiếu 2D stats, sprint health, test widgets | P2 | M | `dashboards/widgets.tsx` |
| C4 | Timeline + phụ thuộc + critical path | ✅ | `planning.service.ts` | — | — | — |
| C5 | **Baseline** kế hoạch (so kế hoạch gốc vs thực tế) | ❌ | "baseline" chỉ có ở sprint committed scope (`sprints.service.ts:206`) | P2 | M | snapshot ngày bắt đầu/kết thúc vào `WorkSprintSnapshot`-like `WorkTimelineBaseline` |
| C6 | Workload/capacity/time-off/portfolio | ✅ | `portfolio.service.ts`, `planning.service.ts` | — | — | — |
| C7 | Goals/OKR liên kết epic | ❌ | Không có (chỉ sprint goal) | P2 | M | model `WorkGoal` + tiến độ từ epic |
| C8 | Forms (biểu mẫu công khai → thẻ) | 🟡 | Chỉ form yêu cầu của service desk (cổng khách) | P2 | M | tổng quát hoá `serviceDesk.service.ts` request types |
| C9 | Docs kiểu Confluence | 🟡 | Có cây/phiên bản/duyệt/mẫu; thiếu ảnh/sơ đồ (A8), docx (A9), **đồng soạn thảo thời gian thực** (chỉ khoá lạc quan 409 `pages.service.ts:348`), bình luận inline | P2 (đồng soạn) | L | yjs/hocuspocus cho `DocView.tsx` |
| C10 | Whiteboard | ❌ | Không có | P2 | M | nhúng Excalidraw/tldraw làm loại trang Docs |
| C11 | Time tracking | 🟡 | worklog + timesheet + duyệt; thiếu nút **timer** start/stop | P2 | S | `TimeTracking.tsx` |
| C12 | **Việc định kỳ** (recurring: daily standup, nộp báo cáo tuần, họp mentor) | ❌ | grep `recurr` trong work = 0 | P1 | S | `automation.service.ts` (trigger `scheduled.daily` đã có ⇒ thêm action `create_issue` theo lịch RRULE) |
| C13 | Automation | 🟡 | 8 trigger + 8 action (`automation.service.ts`); thiếu action webhook/HTTP, điều kiện JQL đầy đủ, branch | P2 | M | `automation.service.ts` |
| C14 | Tích hợp chat/email | 🟡 | Gửi ra Discord/Slack/Google Chat có; **Zalo, email→thẻ, lệnh chat vào** thiếu (CTW-26 mở) | P2 | M | `chatHooks.service.ts`; email-in qua inbound webhook |
| C15 | Import | 🟡 | CSV CT Work + Jira CSV (`exchange.service.ts:9`), ZIP dự án; thiếu Trello/Asana/GitHub Issues/xlsx, **nhập ngược file Project Tracking/WBS Excel của nhóm** | P2 (P1 cho xlsx WBS) | M | `exchange.service.ts` |
| C16 | Export / backup | ✅ | CSV/XLSX/PDF, ZIP `projectExport.service.ts` | — | — | — |
| C17 | 2FA / SSO | 🟡 | 2FA TOTP toàn site (`src/routes/mfa.routes.ts`), OAuth đăng ký; workspace **không ép bật 2FA**; SAML ngoài phạm vi (`work-hub-plan.md` §1) | P2 | S | `settings.require2fa` kiểm trong `permissions.ts` |
| C18 | Phân quyền chi tiết (custom role, permission scheme, issue security level) | ❌ | Vai cố định (`permissions.ts:56`) | P2 | L | — |
| C19 | Audit log | ✅ | `audit.ts`, `WorkAuditLog` | — | — | — |
| C20 | Service desk + SLA + CSAT | ✅ | `serviceDesk.service.ts`, `slaRules.ts` | — | — | — |
| C21 | Knowledge base cho desk | ❌ | Không có | P2 | M | trang Docs `visibility=CLIENT` gợi ý trong form desk |
| C22 | Báo cáo Kanban: CFD, cycle/lead time, control chart, time-in-status | ❌ | grep = 0 | P2 | M | `reports.service.ts` từ `WorkHistory` |
| C23 | Planning poker | ❌ | Không có | P2 | S | phòng socket `work.socket.ts` |
| C24 | Retro board (cột, vote, action→thẻ) | 🟡 | AI "Generate retro" + mẫu `retrospective.md` | P2 | M | dùng lại khung meeting actions |
| C25 | Asset & license register | ❌ | CTW-21 mở | P2 | M | xem `docs/ct-work-tai-nguyen-de-giao.md` |
| C26 | Ảnh trong mô tả/bình luận thẻ (dán ảnh chụp lỗi) | ❌ | Như A8 — chỉ có đính kèm | (gộp A8, P0) | — | — |
| C27 | Thông báo + email digest + nhắc hạn | ✅ | `notify.ts`, `WorkNotifySetting`, `myWork.service.ts` | — | — | — |
| C28 | API token, webhook, MCP | ✅ | `apiTokens.service.ts`; MCP = đợt 2 | — | — | — |
| C29 | Phê duyệt, cổng giai đoạn, CR, RAID, họp | ✅ | xem §1 | — | — | — |
| C30 | i18n giao diện (tiếng Việt) | 🟡 | UI cố định tiếng Anh (chốt 23/09); chữ tự sinh theo ngôn ngữ dự án (CTW-14, `projectLanguage.ts`); Help song ngữ | P2 | L | — |
| C31 | Accessibility | 🟡 | `aria-*` có ở nhiều tệp; không có kiểm tự động (axe) | P2 | S | thêm axe vào E2E (D2) |
| C32 | Mobile | 🟡 | iOS 5 màn (`ios-app/.../Shared/CTWork/`); không Android, không push, không tests/docs trên mobile | P2 | L | — |
| C33 | Offline | ❌ | Không có | P2 | L | — |
| C34 | Release/version + release notes AI | ✅ | `Releases.tsx`, `planning.service.ts` | — | — | — |

## 5. Nhóm D — Chất lượng vận hành

| # | Hạng mục | TT | Bằng chứng / chỗ hở | Ưu tiên | Cỡ | Chỗ đặt |
|---|---|---|---|---|---|---|
| D1 | Test tự động trong CI | 🟡 | 364 unit pass. Nhưng **22/48 tệp test work không nằm trong `npm test`** (vd `work.routes.db.test.ts`, `work.sprints.db.test.ts`, `work.tests.db.test.ts`, `work.planning.db.test.ts`, `issueChange.db.test.ts`, `webhooks.test.ts`, `work.agents.db.test.ts`…) và **mọi test DB tự bỏ qua** vì CI/`deploy-nha.sh` không đặt `WORK_DB_TEST=1` (`work.s4.db.test.ts:27`) ⇒ CI chỉ chạy logic thuần | P1 | M | `package.json` script `test:work-db` + job Postgres service trong `.github/workflows/ci-lint.yml`; gọi trong bộ kiểm của `deploy-nha.sh` |
| D2 | E2E giao diện /work | ❌ | Playwright 19/19 từng chạy tay (bộ nhớ 24/09) nhưng **không có spec nào được commit** (chỉ `scratchpad/thu-kehoach-e2e.ts`) | P1 | M | `frontend/e2e/work/*.spec.ts` + workflow dispatch |
| D3 | Hiệu năng dự án lớn | 🟡 | Board trần 2000 thẻ, nay báo `truncated` (`issues.service.ts:218-251`); báo cáo tính trong bộ nhớ; chưa đo với 5k–20k thẻ | P2 | M | script seed + đo `reports/*`, `jql` |
| D4 | Đợt 1a+1b lên prod | ✅ | ĐÃ deploy + push 09/10 01:32 (89d91ba9); 10 thẻ chờ người duyệt đóng | — | — | — |
| D5 | Lỗi/thẻ còn mở thật trên CTW (ngoài đợt 2) | 🟡 | CTW-2 (ngoài CT Work: user dịch vụ emailVerified), CTW-12 (spec review áp khung SRS cho MỌI trang, kể cả GDD), CTW-21, CTW-26, CTW-36 (điều phối đa agent) | P1 (12) / P2 | S–M | `specReview.service.ts` chọn khung theo loại trang |
| D6 | Onboarding nhóm sinh viên | 🟡 | Có dữ liệu mẫu, checklist, Help 27 bài, mẫu môn; thiếu luồng **lớp học**: GV tạo lớp/mã mời, SV tự lập nhóm, nhập danh sách MSSV, chọn mẫu Capstone (A30), hướng dẫn tiếng Việt "tuần 1 làm gì" | P1 | M | `onboarding.service.ts`, `WorkInvite` (mã lớp), trang `/work/join` |
| D7 | App desktop theo kịp | 🟡 | Tuyến `/work` có trong `dinhTuyenWeb.ts`; trang mới đợt 1b/2/3 phải kiểm tuyến + cần phát hành bản cài (`npm run phat-hanh`) | P1 | S | `desktop/src/renderer/features/web/dinhTuyenWeb.ts` |
| D8 | Rò rỉ cổng khách đã ghi nhận 04/10 | 🟡 | Khách thấy mã+tiêu đề thẻ chưa chia sẻ khi được nêu làm người duyệt; thấy tên/ảnh mọi nhân viên ở dự án mở cho workspace; khách cũ là MEMBER không bị áp phạm vi (bộ nhớ `project_ct_work_kieu_jira.md`) | P1 | M | `clientPeople.ts`, `permissions.ts clientScopedProjectIds`, `approvals.service.ts` |
| D9 | Rủi ro nhập ZIP (mất worklog/chữ ký khi người không thuộc workspace; luật tự động id cũ) | 🟡 | ghi ở plan S5c | P2 | S | `projectImport.service.ts` |
| D10 | Đo chi phí AI cho nhóm sinh viên (trần token) | ✅ | `checkTokenQuota` + `WORK_AI_FREE_DAILY` | — | — | — |

---

## 6. Kế hoạch đợt (mỗi đợt vừa 1–2 agent Opus)

| Đợt | Mục tiêu | Gồm | Agent | Điều kiện |
|---|---|---|---|---|
| **Trước đợt 3** | Đưa 1a/1b lên prod | D4 (hỏi user → `deploy-nha.sh`, đóng 10 thẻ CTW) | — | Đợt 2 xong hoặc tách commit |
| **Đợt 3 — "Nộp được hồ sơ"** (P0) | Nhóm đồ án xuất được mọi file nộp | **3A (tài liệu):** A8 ảnh + Mermaid trong RichEditor (cả mô tả/bình luận thẻ C26) · A9 xuất .docx/PDF một trang · A1/A2/A11/A17 bộ mẫu FPT Report 1,2,5.0,6 (+3,4 đề mục chuẩn FPT) · A30 mẫu dự án CAPSTONE (giai đoạn Report1→7, iteration, mô-đun bật sẵn) · A10 Record of Changes tự sinh. **3B (Excel):** A14 System Test 5.3 · A23 Project Tracking SEP490 / SWP391 Template1 / Template4 Issues · A3 WBS + bảng độ phức tạp → effort · A21 Weekly Report xlsx + lưu kỳ · A29 AI Usage Report (log + xuất) | 2 | Mẫu thật ở `~/Documents/Report Đồ án/` và `SWP391/materials/` — đọc cấu trúc như đợt 1b |
| **Đợt 4 — SRS có cấu trúc & truy vết** | Report 3/4 sinh từ dữ liệu, RTM trọn | A6 + A7 Use case/Actor/Business rule/Screen authorization (L) · A19 RTM mở rộng (SRS/SDS/commit) · A16 Defect log thống nhất + B5 Severity · A22 Q&A log · A24 Activity trên worklog · A18 ghép Report 7 · D5 CTW-12 | 2 (A6 riêng 1 agent) | Sau đợt 3 (cần docx + ảnh) |
| **Đợt 5 — Giảng viên & nhóm** | Trưởng nhóm chứng minh đóng góp, GV theo dõi nhiều nhóm | A28 Supervisor hub xuyên workspace (+ rubric P2) · A27 contributions mở rộng + peer evaluation · A26 LOC thật từ GitHub/GitLab, defect density · D6 luồng lớp học/mã lớp · C12 việc định kỳ · D7 tuyến desktop + phát hành | 2 | — |
| **Đợt 6 — Chất lượng** | Không lùi khi nhiều phiên cùng sửa | D1 CI chạy 48 tệp test + Postgres + `WORK_DB_TEST=1` · D2 E2E Playwright commit + axe (C31) · D3 đo hiệu năng 10k thẻ · D8 vá rò rỉ cổng khách · B2 kỹ thuật thiết kế test · B6 Test Summary · D9 | 2 | Nên làm SỚM nếu đợt 3–4 đụng nhiều tệp chung |
| **Đợt 7 — Bù công cụ thương mại (P2)** | Ngang Jira/ClickUp ở phần còn lại | C5 baseline · C7 OKR · C22 CFD/cycle time · C23 planning poker · C24 retro board · C11 timer · C8 forms · C15 import Trello/Asana/xlsx · C17 ép 2FA · C21 KB desk · C14 Zalo/email→thẻ · C25 asset register · B9/B10/B11 · C3 widget · C13 automation | 2 (chia BE/FE) | Chọn theo phản hồi người dùng thật |
| **Đợt 8 — Nền tảng** | Dùng mọi nơi | C30 UI tiếng Việt · C32 mobile (iOS đủ màn, push) · C9 đồng soạn thảo yjs · C10 whiteboard · C33 offline · C18 custom role · A15/A25/A5 | 1–2 mỗi mục | L, cân nhắc từng mục |
