# CT Work cho đồ án "Một mình đóng 5 vai" — kiểm kê + kế hoạch thi công (27/11/2026)

Nguồn yêu cầu: khoá `content/courses/du-an-mot-minh-5-vai/` (s00–s12), danh sách chỗ thiếu Gemini gom
(`scratchpad/agy-dm5{,b,c}/ctw-thieu/ch0…ch12.md`) + lượt đọc bổ sung toàn bộ s00–s12 (thao tác thường như sprint,
worklog, Q&A, labels…). Mã kiểm ở HEAD `647f0e58e` (đã gồm `b7bc40673` — notAssignee, WORK_SELF_APPROVER,
WORK_REVIEW_SELF, wipMode=block, banner, retro→sprint kế). Tài liệu này KHÔNG sửa mã.

Ký hiệu trạng thái: ✅ ĐÃ CÓ · 🟡 MỘT PHẦN · ❌ CHƯA CÓ · ⛔ LOẠI (không nên làm / làm bằng thứ sẵn có — xem §3).
Ưu tiên: **P0** cần để làm đồ án + nộp hồ sơ SEP490 đúng mẫu · **P1** quy trình chuyên nghiệp · **P2** thêm.
Gói: G1…G4 (xem §4).

## 1. Tóm tắt

| Trạng thái | Số mục |
|---|---|
| ✅ ĐÃ CÓ (chỉ cần bài học chỉ đúng chỗ) | 34 |
| 🟡 MỘT PHẦN | 41 (P0: 6 · P1: 28 · P2: 7) |
| ❌ CHƯA CÓ | 8 (P0: 1 · P1: 4 · P2: 3) |
| ⛔ LOẠI | 11 |
| **Tổng** | **94** (83 mục kiểm + 11 loại) |

Phát hiện lớn:
- **Hồ sơ FPT đã mạnh hơn danh sách Gemini nghĩ.** Project Tracking SEP490 đủ 6 sheet + RTM thứ 7, Actual Effort là SỐ,
  COUNTIF/SUMIF đúng (`fptReports.ts:355-475`, `:406-407`). Weekly Report xlsx đủ 5 khối I–V (`fptReports.ts:602-650`).
  Report 5.2/5.3 đã sửa 3 bẫy công thức (`fptTests.ts:633-665, 785-800`). Sổ AI Usage SWP391 có sẵn. Docs → docx/pdf có bảng và ảnh.
- **Lỗ P0 thật nằm ở Report 3/4/7:** chưa có bảng System Messages SM-xx, `report3_fill_page` chưa điền NFR, chưa sinh bảng
  "1.3 Database Design" 7 cột từ SQL, Report 7 ghép mà không đối soát số. Ngoài ra Record of Changes của SRS chưa lấy từ CR,
  RACI trong Report 2 §3 chưa theo vai.
- **Cổng quy trình có khung, thiếu vài luật:** chưa có DoR gate, thẻ chưa thấy trạng thái CI (`ciState` lưu ở
  `githubApp.service.ts:307` nhưng không màn hình nào đọc), chưa có điều kiện "QA xác nhận / làm nguội" trước Done.
- **Bài học có chỗ đòi thứ CT Work cố ý không có hoặc gọi sai tên** — sửa ở bài, xem §3.2.

## 2. Bảng kiểm kê

### 2.1 Quy trình, board, kế hoạch, nhịp vận hành

| # | Mục | Nguồn | TT | Bằng chứng / còn thiếu | Ưu tiên · Gói |
|---|---|---|---|---|---|
| A1 | Done rules: chặn Done khi thiếu trường Evidence | s00/b4,b5 · s01/b4 · s02/b2 · s06/b3 | ✅ | `issueChange.ts:89-104` (`settings.doneRequirements`, lỗi WORK_DONE_REQUIREMENTS); UI Cài đặt › Chi tiết (`settings/ProjectDetails.tsx:219-246`). Có thêm `submitGate` chế độ hard (≥N tệp, `submitGate.ts`) | — |
| A2 | Done rule "PR gắn thẻ phải CI xanh" + chip CI trên thẻ / trang Code + CI xanh ở commit của tag khi Release | s06/b3,b6 · s10/b2,b4 | 🟡 | `WorkGitPull.ciState/ciUrl` ghi từ webhook (`githubApp.service.ts:301-307`), chỉ prompt AI review đọc (`codeReview.service.ts:255`). Thiếu: `issueDev` (`code.service.ts:349-395`) không trả ciState, DevelopmentPanel/PullsTab không hiện, issueChange và `releaseVersion` không kiểm | P1 · G1 (cổng) + G4 (hiển thị) |
| A3 | WIP ≤ 2 chặn cứng | s00/b4 · s02/b2 · s07/b1 · s08/b5 | ✅ | `issueChange.ts:171-187` (`wipMode='block'`, WORK_WIP_LIMIT); công tắc Cài đặt › Board (`ProjectBoard.tsx:226-233`); board tô đỏ cột (`Board.tsx:495-507`) | — |
| A4 | WIP chéo cột ("In Review đầy ⇒ không kéo thêm vào Doing") | s08/b5 | 🟡 | Chỉ WIP theo từng cột. Thiếu `settings.wipGuards` | P2 · G1 |
| A5 | Người được giao không tự chuyển; chuyển theo bộ phận; cần phê duyệt | s00/b4 · s01/b5 · s03/b1 · s07/b2 | ✅ | `issueChange.ts:118-166` (notAssignee/teamIds/requireApproval); UI `workflow/TransitionRules.tsx`. ⚠ Làm một mình bằng MỘT tài khoản thì luật tự chặn chính mình ⇒ bài phải dùng 5 tài khoản vai | — |
| A6 | Bắt buộc xác nhận của vai QA + khoảng làm nguội trước Done | s01/b5 · s07/b2 · s06/b5 | 🟡 | Thiếu `rules.requireComment` (bình luận của thành viên bộ phận X sau khi vào Review) và `rules.minHoursInFrom` (đọc WorkHistory). `TransitionRules` là JSON nên không cần migration | P1 · G1 |
| A7 | Dev không tự đóng Defect (Retest → Closed) | s09/b5 | ✅ | Đặt notAssignee hoặc teamIds=QA trên cạnh Retest→Closed của luồng Bug (`templates.ts:59-62, 141-149`). Chỉ cần cấu hình | — |
| A8 | Token API/MCP chỉ-đọc | s00/b4 | ✅ | `apiTokens.service.ts:21` (`read`/`write`/`tests:write`), chặn ghi ở `:192-196`; MCP lọc tool theo scope (`src/mcp/server.ts:68`); web `/work/developer` | — |
| A9 | Họp định kỳ + .ics | s00/b4,b5 · s02/b5 | ✅ | RRULE `meetingSeries.ts`, tuyến `/meeting-series` (`work.ctw8c.routes.ts:62-65`), tab Series (`c8c/RecurringMeetings.tsx`); `.ics` từng buổi (`work.governance.routes.ts:289`); lịch đăng ký `ctc_` (`calendar.service.ts`) | — |
| A10 | Dải "Solo · 1 người đóng 5 vai" | s00/b2,b4 · s11/b5 | ✅ | `ProjectBanner.tsx`, `ProjectHeader.tsx:239`, mẫu nhanh ở `ProjectDetails.tsx:330-369` | — |
| A11 | Retro: hành động → thẻ trong sprint kế | s03/b6 · s07/b5 | ✅ | `retro.service.ts:43-51, 271-301`; checkbox ở `agile/Retro.tsx:181-239` | — |
| A12 | Retro: trường Trigger + Cách kiểm chứng, trần 2 hành động, bảng số liệu sprint (Done/Planned, giờ thực/ước, Defect/Leakage, CI xanh lượt đầu, cỡ PR) | s03/b6 · s07/b5 | 🟡 | `WorkRetroAction` chỉ có `title` (`schema.prisma:16442`). Số liệu chỉ nằm trong prompt AI (`ai.service.ts:1872-1890`), không có worklog/defect/CI | P1 · G1 (migration) |
| A13 | Mẫu thẻ theo loại: User Story + AC Given/When/Then, Mini-Spec DoR, Task + DoD | s01/b2,b3 · s04/b5 · s12/b6 | ✅ | `templates.ts:211-260`; sửa ở Cài đặt › Issue types (`customize.service.ts:446-510`); `CreateIssueDialog.tsx:195-199` tự chèn. Mini-Spec 6 dòng = sửa mẫu REQUIREMENT | — |
| A14 | Definition of Ready: chặn Req sang In Progress khi trường DoR trống / mockup chưa duyệt; plan sprint cảnh báo thẻ chưa Ready | s04/b4 · s07/b1 | ❌ | Đã grep `readyRequirements\|definitionOfReady\|isReady`: không có. Tạm dùng requireApproval trên To Do→In Progress | P1 · G1 |
| A15 | Sức chứa: hệ số tập trung, ngưỡng cảnh báo 75%/85%, sprint so với sức chứa | s02/b3 · s07/b1 | 🟡 | `capacityHours` + time-off (`planning.service.ts:306-372`), CapacityTab ≥80 cam / >100 đỏ (`reports/CapacityTab.tsx:32,252`). Thiếu focusFactor/warnPct; dialog sprint so với velocity, không so với sức chứa (`SprintDialogs.tsx:332`) | P1 · G1 |
| A16 | Timeline: phụ thuộc FS, đường găng, mốc Freeze | s02/b3 · s10/b1 | ✅ | BLOCKS + `criticalPath` (`planning.service.ts:187-223`), `Timeline.tsx`; mốc = Version.releaseDate | — |
| A17 | Gate/Stage có NGÀY kế hoạch (9 gate G0…SEP-M6) | s00/b3 · s02/b3 | 🟡 | `WorkStage` chỉ có startedAt/completedAt (`schema.prisma:12629-12641`) | P1 · G1 (migration) |
| A18 | Cảnh báo sớm: Blocked > 24h, thẻ ưu tiên cao đứng yên > 48h, tuổi thẻ trên card, burndown đi ngang ≥ 3 ngày, thêm phạm vi giữa sprint | s03/b1,b4 · s07/b3 · s08/b5 | 🟡 | Có "kẹt" ở Team overview (`uxcRules.ts:33-40`), Insights stale > 5 ngày, Automation `scheduled.daily` + JQL (48h làm được: `priority <= 2 AND updated < -2d`). Thiếu: JQL `flaggedSince` (`jql.ts:621-628` chỉ true/false), tuổi thẻ trên card, burndown phẳng, cảnh báo scope creep | P1 · G1 |
| A19 | RAG dự án theo ngưỡng + % hoàn thành có trọng số chặng; CFD/burndown/velocity | s03/b3 · s07/b3 · s12/b2 | 🟡 | CFD, burndown, velocity, aging_wip đã có (`flowReports.service.ts:91-242`, `dashboards/widgets.tsx:54-97`). RAG chỉ ở portfolio, ngưỡng cứng (`portfolioRules.ts:14-45`) | P1 · G1 |
| A20 | Thẻ lặp "Daily log tuần N" + giờ vào timesheet | s03/b1 · s07/b3 | ✅ | `recurring.service.ts` (`{week}`), Cài đặt › Recurring. Giờ log trên thẻ tự vào timesheet (`finance.service.ts:11`) | — |
| A21 | Biên bản họp: mỗi góp ý → chọn loại Defect/Leakage · Q&A · CR · Task | s07/b4 | 🟡 | `createIssuesFromActions` luôn tạo TASK (`meetings.service.ts:414`), không tạo được CR/Q&A | P1 · G1 (migration nhỏ) |
| A22 | MoSCoW: cảnh báo Must > 60% effort | s02/b1 · s12/b6 | 🟡 | Có trường MoSCoW (`templates.ts:46-57`). Dashboard chưa gom được theo trường tuỳ chỉnh (`search.service.ts:136`) | P1 · G1 |
| A23 | Wave/Internal Proof Gate: chặn kéo thẻ của stage chưa ACTIVE | s08/b1 | 🟡 | Stage tuần tự + duyệt cổng (`stages.service.ts:143-162`, `gateEvidence.ts`), nhưng issueChange không kiểm stage | P2 · G1 |
| A24 | Định cỡ S/M/C + LOC theo vai | s02/b1,b2 · s07/b1 | ✅ | Trường `Complexity`/`Planned LOC`/`Workstream` (`projectTracking.service.ts:78`), tổng LOC theo PIC + BEHIND (`aiInsights.service.ts:74-82`), ma trận S/M/C → man-days (`fptReports.ts:23`). Trần MaxLOC theo vai: P2, xem §3 | — |
| A25 | Tạo dự án mới từ dự án mẫu: chỉ chép cấu hình (cột, workflow + rules, nhãn, trường, Done rules, mẫu thẻ, cây Docs trống) | s12/b3,b5,b6 | ❌ | Chỉ có mẫu cố định trong mã (`constants.ts:23`) và ZIP trọn dự án (`projectImport.service.ts:382`). Đã grep `cloneProject\|fromProjectId\|configOnly`: không có | P1 · G4 |
| A26 | Bàn giao solo → nhóm thật (gán lại hàng loạt) | s12/b1 | ✅ | `issue_bulk` / sửa hàng loạt ≤ 200 thẻ (`sprints.service.ts:403`), mô-đun handoffs | — |
| A27 | Sổ nợ kỹ thuật TD-xx | s08/b4 | ✅ | Nhãn `TechDebt` + trường tuỳ chỉnh + JQL + widget counter. Quỹ 15–20% sprint: P2, xem §3 | — |
| A28 | Nhãn chuẩn Req/Task/Q&A/Defect/Leakage; lọc backlog theo mốc; Sprint Goal + Start; poker; sub-task 5 vai; cờ Blocked; liên kết release ↔ thẻ Done | s00/b5 · s02/b2 · s07/b1,b6 · s08/b1 | ✅ | Tính năng lõi: labels, sprints, `poker`, sub-task, flag, `fixVersionId` (`schema.prisma:11128`) | — |

### 2.2 Yêu cầu, thiết kế, tài liệu Report 1–7

| # | Mục | Nguồn | TT | Bằng chứng / còn thiếu | Ưu tiên · Gói |
|---|---|---|---|---|---|
| B1 | RACI: kiểm NO_A / MANY_A / NO_R | s01/b6 | ✅ | `swr6b.ts:83-95` (`raciProblems`), tab Stakeholders (`swr6b/StakeholdersTab.tsx:169`); MCP `swr_raci` | — |
| B2 | RACI: luật "một vai ôm > 50% chữ A" + Report 2 §3 theo VAI (5 mũ nội bộ) và bản xuất trung thực 2 cột Sinh viên + Supervisor | s01/b6 | 🟡 | `docFill.ts:164-173` dựng cột = tên NGƯỜI, giữ ô cũ, không điền R/A/C/I ⇒ làm một mình chỉ ra 1 cột | **P0** · G2 |
| B3 | Autofill Report 1/2 (Project Team, Risks, Cost & Time, RACI) qua MCP | s02/b6 | 🟡 | `POST /pages/:num/autofill` (`work.docs3a.routes.ts:80`, `docs3a.service.ts:243-280`) chỉ có trên web. Không có lệnh MCP (đã grep `autofill` trong toolRegistry) | P1 · G2 |
| B4 | Mẫu checklist review: 10 điểm phản biện, 8 câu + STRIDE-lite (yêu cầu), design review 10 điểm, tự review PR 4 lượt; mẫu tuỳ chỉnh cấp dự án; làm nguội | s01/b5 · s04/b7 · s05/b7 · s06/b5 | 🟡 | 8 checklist cố định (`reviewRules.ts:31-200`) + thêm câu từng phiên (`quality.service.ts:202`). WORK_REVIEW_SELF có (`quality.service.ts:185,235`). Thiếu 4 bộ trên, mẫu cấp dự án, cool-off. ⚠ Không gắn vai AUTHOR cho mình thì lách được luật | P1 · G3 |
| B5 | Elicitation 4 phần + đẩy câu hỏi mở sang Q&A kèm mã đích BR/UC | s04/b1 | 🟡 | Phiên ELC-n có objective/plan/questions/notes (`schema.prisma:15753`, `swrElic.service.ts`). Không đẩy sang Q&A được (grep qna trong swrElic: 0) | P1 · G2 |
| B6 | Q&A: trường Đề xuất / Phương án A-B, mã đích BR/UC, luật "chỉ đóng khi đã gắn BR/UC" | s02/b1 · s04/b1,b8 | 🟡 | `WorkRaidQuestion` (`schema.prisma:14433`) có askedOn/By/To/priority/answer; hạn = `reviewDate`; xuất sheet Q&A (`fptReports.ts:440`) | P1 · G2 (migration) |
| B7 | Đặc tả Use Case mẫu SEP490 | s04/b2 | ✅ | `srs.ts:96` (Primary/Secondary actors, Pre/Post, Normal/Alt/Exception…), `ucMissing` (`srs.ts:308`), six links BR_UNKNOWN/BR_UNLISTED (`swr.ts:389-393`) | — |
| B8 | Lint use case: chữ "System" làm chủ ngữ, mã bước nA/nE1 phải có trong Normal Flow, BR/SM lọt vào Postconditions | s04/b2,b6 | 🟡 | Chưa có (specFidelity chỉ chấm từ mơ hồ). Thêm luật vào `swr.ts` (cùng nhóm six links) | P1 · G2 |
| B9 | **Bảng System Messages SM-xx** + điền Report 3 §5.2 | s04/b3,b6 · s05/b4 | ❌ | Mẫu Report 3 có heading `5.2 System Messages` (`content/quy-trinh/mau/fpt-report3*.md:136`), `applySrsFill` (`srs.ts:290`) không điền; không có model | **P0** · G2 (migration) |
| B10 | report3_fill_page điền NFR (+ BR theo category) | s04/b3,b6 | 🟡 | `WorkNfrSpec` có scale/meter/must/plan/wish (`schema.prisma:15924`), đổ vào SRS Wiegers (`swr.service.ts:782`) nhưng không vào Report 3 | **P0** · G2 |
| B11 | Duyệt mockup qua link chỉ-xem cho GV, "Approved + ngày" | s04/b4 | ✅ | `WorkScreenMockup` + `reviewToken` + `/work/mockup-review/<token>` (`srsDeep.service.ts:201`), tab Prototypes | — |
| B12 | RTM xlsx: UC (SDS §, Class.method) · BR → Test · test mồ côi | s04/b6 · s07/b6 · s11/b1 | ✅ | `GET /rtm/export.xlsx` (`work.ctw4.routes.ts:119`), 4 sheet (`rtm.ts:151`), 10 mã gap | — |
| B13 | RTM: bảng NFR → Đo lường + 4 chỉ số phủ (UC Coded thiếu SDS, UC Tested thiếu ST, % BR phủ test, số test mồ côi) trong Summary | s04/b6 · s11/b1,b6 | 🟡 | Có gap từng dòng, chưa có chỉ số ghép và sheet NFR | **P0** · G2 |
| B14 | Kiểm nhất quán tên UC (SRS) ↔ tiêu đề thẻ ↔ WBS + checklist "10 lỗi bút đỏ" trước nộp | s02/b2,b6 | 🟡 | WBS dựng từ thẻ nên tự khớp; COUNT_MISMATCH (`swr.ts:440`). Chưa so `WorkUseCase.issueId` ↔ title; chưa có checklist nộp | P1 · G2 |
| B15 | ADR: mẫu + đánh mã ADR-001 tự động + Superseded | s05/b1 | 🟡 | Mẫu `content/quy-trinh/mau/adr.md`; status trang DRAFT/IN_REVIEW/APPROVED/ARCHIVED (`constants.ts:96`). Thiếu số ADR tự tăng | P1 · G2 |
| B16 | **Bảng "1.3 Database Design" 7 cột** (No·Field·PK·FK·UN·NN·Description) sinh từ SQL/Flyway, chèn Report 4 | s05/b3,b7 | 🟡 | Có bộ đọc SQL (`sqlDesign/model.ts`, `diagramRepo.ts:112`), mẫu Report 4 có đúng bảng (`fpt-report4-sds.md:43`), ERD chèn §1.3 (`diagramFill.ts:6`). Chưa sinh bảng 7 cột | **P0** · G2 |
| B17 | Điền nháp Report 4 (SDS) như report3_fill_page | s05/b7 | 🟡 | Chỉ có `diagram_fill_report` (sơ đồ). B16 + khung §3 theo Spring Boot | P1 · G2 |
| B18 | PlantUML: nhập/hiển thị `.puml` (cả từ repo), chú thích đánh số theo Report | s05/b3,b6 | ❌ | `DIAGRAM_FORMATS = MERMAID/EXCALIDRAW/SQL` (`diagram.ts:14`). ⚠ Mô tả MCP `diagram_extras` (`toolRegistry/parity3.ts:792`) ghi nhận `.puml` — **mô tả sai**, phải sửa dù chưa làm tính năng | P1 · G2 |
| B19 | **Report 7: đối soát chéo trước khi ghép** (mã FE/UC/BR/SM/LI trùng hoặc lệch, số test + tỉ lệ pass vs dữ liệu tests, tổng effort vs worklog, chữ mẫu còn sót) | s11/b1,b6 | 🟡 | `finalReport.ts` ghép Report 1–6, báo merged/missing; không đối soát số | **P0** · G2 |
| B20 | Khung Report 6 User Guide sinh từ actor + màn hình SRS; cảnh báo tiêu đề 3.x.y lệch tên màn | s10/b5 | ❌ | Mẫu chỉ có "3.2 Feature name" (`fpt-report6-user-guides.md:68`). Nguồn sẵn: SRS actors, `WorkSrsScreen`, authTable | P1 · G2 |
| B21 | Record of Changes (A/M/D) của SRS/SDS lấy từ CR đã IMPLEMENTED | s03/b5 · s08/b3 · s10/b1 | 🟡 | Record of Changes hiện dựng từ lịch sử phiên bản trang (`docs3a.service.ts`). `fpt_change_add` chỉ cho bìa Report 5.x | **P0** · G2 |
| B22 | Mẫu Docs FPT | toàn khoá | ✅ | 50 mẫu (`content/quy-trinh/mau/catalog.json`): Report 1–7, SRS/SDD, ADR, test plan, release-notes, UAT, handover… | — |
| B23 | Mẫu Docs còn thiếu: Project Charter, Test Plan "Report 5.0", ADR kiểu SEP490, checklist "10 lỗi bút đỏ", Go/No-Go 10 điểm, khung FE design (Report 4 §1.2.2) | s02/b1 · s05/b5 · s09/b1 · s10/b1 | 🟡 | Chỉ cần thêm `.md` + 1 dòng catalog, chép vào `frontend/public/quy-trinh/mau` (`docTemplates.test.ts` bắt lệch) | P1 · G2 |
| B24 | Ma trận phân quyền màn hình (≥15 màn × 6 vai), swimlane, ERD, sequence/state | s04/b4,b8 · s05/b3,b6 | ✅ | authTable (`srs.ts:183`, `/requirements?tab=authorization`), `diagrams` (Mermaid/ERD từ SQL/class từ repo) | — |

### 2.3 Xuất hồ sơ, giờ công, CR, RAID, AI

| # | Mục | Nguồn | TT | Bằng chứng / còn thiếu | Ưu tiên · Gói |
|---|---|---|---|---|---|
| C1 | Project Tracking SEP490 6 sheet + RTM, Actual Effort là số, công thức đầu WBS đúng | s02/b6 · s07/b6 · s10/b4 | ✅ | `fptReports.ts:355-475`, `fptReports.service.ts:262-416`, RTM `projectTracking.service.ts:140-146`; web School › tracking; MCP `export_file kind=project_tracking variant=SEP490` | — |
| C2 | Weekly Report xlsx 5 khối I–V | s03/b2 · s07/b6 | ✅ | `fptReports.ts:602-650`, `composeWeekly` (`fptReports.service.ts:440-525`); School › weekly; MCP `weekly_report_generate` | — |
| C3 | Weekly mục I ghi số WBS 1.2.3 + đối soát với Scope | s03/b2 | 🟡 | Mục I chỉ ghi `KEY-n` ở Notes | P2 · G4 |
| C4 | TimeLogs 11 cột; worklog có Activity/Work Product; nộp timesheet tuần | s03/b1 · s07/b3 | ✅ | `fptReports.ts:447-455`, `timeActivity.service.ts`, `timesheet_submit` (cần mô-đun Finance) | — |
| C5 | Báo cáo giờ/thẻ theo MŨ C1–C5: % mỗi vai/tuần, cảnh báo QA < 15%, tổng > 30h/tuần; sheet "By role" trong bản xuất đóng góp | s01/b1,b6 · s11/b5 | 🟡 | `hoursByActivity` theo 6 activity cố định (`fptReports.ts:277`, không có PM, không tách BE/FE); bảng giờ theo activity không có màn hình riêng; contrib theo NGƯỜI (`contrib.service.ts:377-394`) ⇒ làm một mình 1 tài khoản chỉ ra 1 dòng | P1 · G4 |
| C6 | Sổ AI Usage SWP391 (10 cột, nút Collect) | s06/b5 · s11/b5 | ✅ | `fptReports.ts:676-740`, `syncAiUsage` (`fptReports.service.ts:646-700`); School › ai; `export_file kind=ai_usage` | — |
| C7 | Phiên AI review code tự vào sổ AI Usage + cột Chấp nhận/Bác bỏ | s06/b5 · s11/b5 | 🟡 | `codeReview.service.ts` không ghi `workAiUsageLog`; không có cột accept/reject | P1 · G4 |
| C8 | CR: phân tích ảnh hưởng 6 chiều CÓ CẤU TRÚC, 3 phương án, tách CR con (CR-01a/b), checklist đồng bộ 5 điểm khi Approve | s03/b5 · s08/b3 | 🟡 | `WorkChangeRequest` (`schema.prisma:12987`) có impactScope/alternatives dạng chữ, scheduleDays, cost, risk; liên kết thẻ/baseline → test chạy lại (`quality.service.ts:559-611`); gợi ý thẻ thực hiện (`changeRequests.service.ts:213-229`) | P1 · G4 (migration) |
| C9 | RAID: Strategy, Trigger, P×I, bản đồ nhiệt, liên kết thẻ/CR, đổ Report 2 §1.3 + sheet Issues | s02/b4 · s12/b6 | ✅ | `schema.prisma:13064-13087`, heatmap 5×5 (`governance/RaidView.tsx:40-80`), autofill (`docs3a.service.ts:214`) | — |
| C10 | RAID: trường Plan B + nút Risk → tạo thẻ | s02/b4 | 🟡 | Không có trường contingency; chỉ liên kết thẻ có sẵn | P1 · G4 (migration) |
| C11 | Docs → .docx/.pdf có bảng + ảnh | s10/b5 · s11 | ✅ | `docExport.ts` (bảng :305/:532, ảnh :276/:621); MCP `export_file kind=page_docx\|page_pdf` | — |
| C12 | `export_file` thiếu kind cho tuyến web có sẵn: contrib xlsx/pdf, test cycle, biên bản họp, phiên review, SWR xlsx | s07/b6 · s11/b5 | 🟡 | 14 kind ở `toolRegistry/planning.ts:71-99`; các tuyến kia có trên web | P2 · G4 |

### 2.4 Kiểm thử, UAT, code, phát hành, bảo vệ

| # | Mục | Nguồn | TT | Bằng chứng / còn thiếu | Ưu tiên · Gói |
|---|---|---|---|---|---|
| D1 | Test Plan IEEE 829 + 4 cấp test + Exit criteria tự chấm | s09/b1 | ✅ | `testMgmt.service.ts:179-199`, `evaluateExit` (`testMetrics.ts:189-191`), tab Quality (`quality/QualityTab.tsx:188,238`); cấp COMPONENT/INTEGRATION/SYSTEM/ACCEPTANCE (`testMetrics.ts:15`) | — |
| D2 | Test Plan: loại SECURITY, Entry criteria, Exit CHẶN (bắt đầu cycle / release khi chưa đạt); MCP ghi được settings | s09/b1 · s10/b1 | 🟡 | Exit chỉ để xem: `updateCycle`/`markCycleStarted` (`tests.service.ts:450-470,537`) và `releaseVersion` (`planning.service.ts:126`) không gọi evaluateExit; `test_plan_manage` không ghi criteria | P1 · G3 |
| D3 | Test design EP/BVA/bảng quyết định/chuyển trạng thái + RTM gap test mồ côi | s09/b2 | ✅ | `testDesign.ts`, tab Design; `rtm.ts:21-89` | — |
| D4 | Lint test viết tay (Precondition trộn vào Steps, function/UC thiếu ca B/A) + nhãn 6 nhóm Happy/Empty/Boundary/Conflict/Security/Adjacent đếm trên thẻ Req | s01/b4 · s09/b2 | 🟡 | `unitSummary` chỉ đếm % A/B (`fptTests.ts:173-205`); nhãn 6 nhóm làm được bằng label thẻ TEST + JQL | P2 · G3 |
| D5 | Report 5.1: nạp Surefire XML + JaCoCo + commit SHA vào Statistics/Notes, đối chiếu UTCID ↔ tên test JUnit | s09/b3 | 🟡 | Nhập JUnit/JaCoCo đã có nhưng chỉ vào Xray AUTOMATED (`testResults.ts`, `testAutomation.service.ts:170-210`), không vào `fpt_unit` | P1 · G3 |
| D6 | Report 5.2/5.3 xlsx: không đếm dòng SCENARIO, Round 2/3 đúng cột, Statistics trỏ vòng cuối, cột Evidence có ảnh | s09/b4 | ✅ | `fptTests.ts:633-665, 785-800, 109-135`. Evidence theo case, chưa theo từng vòng (P2, xem §3) | — |
| D7 | Defect: Severity/Activity, sheet Defects 10 cột, vòng đời Retest/Closed/Reopen, DRE | s09/b5 · s07/b4 | ✅ | `defects.service.ts`, `DefectPanel.tsx`, `fptReports.ts:457-464`, `templates.ts:60-62`; DRE ở tab Quality (`testMetrics.ts:102`). Công thức `1 − leakage/tổng` **tương đương** Defect/(Defect+Leakage) | — |
| D8 | Cờ Leakage riêng (thay vì suy từ activity AT) | s07/b4 · s09/b5 · s10/b4 | 🟡 | Leakage = bug phát hiện ở activity AT (`testMetrics.ts:10`). Bài dùng nhãn Leakage ⇒ số DRE trên CT Work lệch với bài | P1 · G3 |
| D9 | UAT cổng khách: Reject bắt buộc lý do, Reject → BUG/CR tự sinh, biên bản in/PDF | s09/b6 | ✅ | `portal.service.ts:617,696,704-718,732`; `/portal/uat/[aid]`; certificate `work.routes.ts:2224` | — |
| D10 | UAT: điểm hài lòng 1–5, mã ẩn danh người thử P1–P3, thu hồi quyền cổng khi chốt phiên, lệnh MCP đọc UAT | s09/b6,b7 | 🟡 | grep satisfaction/rating/testerCode: 0; invite có `expiresAt` nhưng không gắn UAT. Bài có câu "nếu cổng chưa có… ghi tay" | P1 · G3 (migration) |
| D11 | AI review code chế độ "chỉ phản biện" (cấm code vá) + luật mentor dự án | s00/b4 · s06/b5 | 🟡 | `POST /code/review` (`work.code.routes.ts:123`), prompt trả `suggestion` tự do (`codeReview.service.ts:160-175`). Luật mentor: `settings.aiInstructions` có (`projects.service.ts:413`) | P1 · G4 |
| D12 | Cảnh báo nhánh sống > 3 ngày / PR > 400 dòng | s06/b2 | ❌ | Dữ liệu có (`code.service.ts:235-239`, BranchesTab); chưa có cờ | P2 · G4 |
| D13 | Kiểm vệ sinh repo (.gitignore, .env.example, PR template, ci.yml, branch protection main) | s06/b1,b2 | ❌ | Không có. Đọc được bằng GitHub contents API sẵn trong `code.service` | P2 · G4 |
| D14 | Releases: Feature/Code/Hard Freeze (chặn tạo Req sau freeze), Git tag + SHA trên version, release notes kèm tag/SHA, checklist Go/No-Go có bằng chứng | s10/b1,b4 · s07/b6 | 🟡 | Version UNRELEASED/RELEASED, AI release notes (`ai.service.ts:1761-1780`), baseline + WORK_BASELINED (`quality.service.ts:525-535`), stage gate checklist + bằng chứng (`gateEvidence.ts`) ⇒ Go/No-Go làm được bằng gate. Thiếu freezeLevel, gitTag/sha | P1 · G4 (migration) |
| D15 | Trình chiếu có đồng hồ + mốc phút + nút clip Plan B | s11/b2,b6 | ❌ | `present/PresentView.tsx` chỉ chuyển slide. Chỉ cần frontend | P2 · G4 |
| D16 | Luyện bảo vệ theo 5 vai | s11/b3,b4 | 🟡 | Có: `POST /ai/defense` (`work.routes.ts:1189`), phạm vi C1–C5 (`aiInsights.service.ts:112-119`), nút "Luyện bảo vệ đồ án" (`ai/AiPanelHost.tsx:449`). Thiếu đồng hồ 40 s, khung PREP, link bằng chứng | P2 · G4 |
| D17 | Rubric tự chấm của SINH VIÊN + nhật ký tổng duyệt R1–R3 | s10/b6 · s11/b4 | 🟡 | Rubric 100 điểm SWP391/SEP490 có (`teachingRules.ts:191-276`) nhưng chỉ TEACHER chấm (`:256`). Nhật ký tổng duyệt làm được bằng Meeting/Docs | P2 · G3 |
| D18 | Xray: thuộc tính level/testType/technique; liên kết test ↔ Req | s01/b4 · s12/b6 | ✅ | `schema.prisma:11503-11508`, link TESTS (`toolRegistry/tests.ts:800-805`). MCP chưa đặt được level/testType (P2, gộp vào D2) | — |
| D19 | Nối repo GitHub, mã thẻ trong nhánh/commit/PR hiện ở thẻ, AI review bình luận inline | s00/b4 · s06/b1,b2,b5 | ✅ | GitHub App (`githubApp.service.ts`), `inlineComments` (`githubAppRules.ts:97`), trang Code (Activity/Branches/Pulls/Source) | — |

## 3. Mục LOẠI và chỗ phải sửa ở bài học

### 3.1 ⛔ Không nên làm (11 mục)

| # | Mục (nguồn) | Lý do |
|---|---|---|
| X1 | Sơ đồ phụ thuộc module DAG, phát hiện vòng tròn, gán chủ bảng theo module, gắn ArchUnit (s05/b2) | Việc của repo/CI. Kết quả ArchUnit là JUnit XML ⇒ nhập được ngay qua `tests/automation/import`. Dựng bộ phân tích Java trong CT Work là sai chỗ |
| X2 | Soát lệch OpenAPI ↔ PR, bắt CORS `*` + credentials, Swagger UI nhúng, đối chiếu SM-xx với OpenAPI (s05/b4, s08/b2) | openapi-diff/Spectral/Semgrep chạy trong CI rồi đổ SARIF (`staticAnalysis.ts` đã nhận). Swagger UI: link ngoài đủ dùng. Đối chiếu SM-xx chỉ làm sau B9, nếu thật cần |
| X3 | Quét `// TODO` không gắn TD-xx (s08/b4) | Một bước `grep` trong CI; CT Work không giữ mã nguồn |
| X4 | Đối chiếu tên lớp/phương thức PlantUML ↔ code (s05/b6) | Giòn, ít giá trị. Giữ phần nhập/hiển thị `.puml` (B18) |
| X5 | Pipeline đa môi trường dev→qa→uat→prod + CAB + Canary (s12/b4) | Bài so sánh tầm doanh nghiệp, đồ án không cần |
| X6 | Đồng hồ thi PE 120 phút + chấm rubric 100 trong school/submit (s12/b5, đề cuối) | Đã có quiz lớp `timeLimitMin` + Phòng thi riêng; không lặp trong CT Work |
| X7 | Đổi mã lỗi sang tiền tố DF-xx | Mã thẻ KEY-n là định danh thật trong mọi liên kết và sheet Defects. Sửa bài: "DF-xx = mã thẻ Bug" (hoặc tiền tố trong tiêu đề) |
| X8 | Hồ sơ năng lực ẩn danh, tự che PII (s12/b2) | Số liệu đã có ở reports/contrib/RTM; bộ che PII tự động dễ sót, rủi ro lộ dữ liệu lớn hơn lợi ích |
| X9 | Bản đồ nhiệt 3×3, nhãn 5 trạng thái UI trên mockup, BR song ngữ + cột lớp FE/BE/DB, mẫu bình luận "Hợp đồng API", trần MaxLOC theo vai, quỹ 15–20% nợ kỹ thuật, evidence theo từng vòng Round | Trang trí hoặc làm được bằng thứ sẵn có: heatmap 5×5 có; tiêu đề mockup; `category` của BR; mẫu mô tả thẻ / trang Docs; trường LOC + JQL; nhãn + widget counter |
| X10 | Wizard "chuyển solo → đội thật" (s12/b1) | `issue_bulk` + handoffs + Version làm mốc đã đủ (A26) |
| X11 | Kho mẫu cấp không gian (model riêng) (s12/b5) | Gộp vào A25 (tạo dự án từ dự án mẫu, chép cây Docs). Không cần model mới |

### 3.2 Sửa ở bài học (không phải việc của CT Work)

- **"Bật 2FA cho tài khoản C1"** (s00/b4,b5, s01/b1): CT Work cố ý TẮT 2FA cho thành viên (`CTW_ENFORCE_2FA` mặc định tắt, quyết định
  11/10/2026 — `docs/ctw-ke-hoach-tong.md`). Bài phải bỏ dòng này hoặc chuyển sang 2FA của GitHub.
- **Done rules** nằm ở Cài đặt › **Chi tiết** (ProjectDetails), WIP chặn cứng ở Cài đặt › **Board**, notAssignee ở **Workflow** — bài nên ghi đúng đường.
- **notAssignee / WORK_REVIEW_SELF** chỉ có tác dụng khi dùng 5 tài khoản vai; phiên review cần gắn vai AUTHOR cho người viết thì luật mới chặn.
- **"PT26 / Project Tracking xuất từ Settings → Export"** (s03/b2): đường thật là School › tab Tracking (variant SWP391/SEP490), hoặc MCP `export_file`.
- **DRE**: trên CT Work, Leakage = bug ghi activity AT. Tới khi D8 xong, bài phải dạy đặt activity AT thay vì chỉ gắn nhãn `Leakage`.
- **Q&A** trong CT Work là RAID loại QUESTION (School › Q&A), không phải loại thẻ riêng.

## 4. Gói thi công

Nguyên tắc chia: mỗi gói sở hữu một vùng tệp; chỗ đụng chung có chủ sở hữu duy nhất (§4.5). Mọi migration **viết tay**
`prisma/migrations/<timestamp>_<tên>/migration.sql` + `npx prisma migrate deploy` (`migrate dev` hỏng, P3006), kiểm bằng
`npx prisma migrate diff --from-schema-datasource … --to-schema-datamodel … --script` (rỗng = không trôi).

### G1 — Cổng quy trình & nhịp vận hành (13 tính năng · có migration)

Tính năng: A2 (phần cổng Done khi CI đỏ) · A4 · A6 · A12 · A14 · A15 · A17 · A18 · A19 · A21 · A22 · A23 · (cấu hình mẫu A7 trong luồng Bug của mẫu SWP391/Capstone).

Nghiệm thu (mỗi dòng có test DB):
- A14: đặt `settings.readyRequirements {fieldIds,typeKeys,toStatusIds}`; kéo thẻ REQUIREMENT trống trường DoR sang In Progress ⇒ 400 `WORK_READY_REQUIREMENTS` qua REST, bulk và MCP `transition`. Dialog plan sprint hiện số thẻ "chưa Ready".
- A2: `settings.doneRequirements.requireCiGreen=true` + thẻ có PR `ciState='failure'|'pending'` ⇒ chặn Done (`WORK_DONE_CI`); PR success ⇒ qua; thẻ không có PR ⇒ theo cờ `requirePr`.
- A6: `rules.requireComment {teamIds}` ⇒ chặn khi chưa có bình luận của thành viên bộ phận đó SAU lần vào trạng thái nguồn; `rules.minHoursInFrom: N` ⇒ chặn khi ở trạng thái nguồn < N giờ (đọc WorkHistory). UI ở TransitionRules.
- A4: `settings.wipGuards [{whenColumn, blocksColumn}]` ⇒ `WORK_WIP_LIMIT` khi cột canh đầy.
- A15: `settings.capacity {focusFactor, warnPct}`; dialog sprint hiện "ước lượng / sức chứa × focus" và tô đỏ khi > warnPct.
- A17: `WorkStage.plannedStart/plannedEnd`; timeline vẽ gate theo ngày; trễ ngày ⇒ màu đỏ.
- A18: JQL `flaggedSince < -24h`; tuổi thẻ (ngày trong cột) trên card board; Insights có dòng "burndown phẳng ≥ 3 ngày" và "thêm N điểm phạm vi sau khi Start".
- A19: `settings.ragRules` + widget `rag` (4 chiều, RAG tổng = chiều tệ nhất) + % hoàn thành có trọng số chặng (0/20/50/75/100 theo category trạng thái).
- A21: mỗi action biên bản có `kind TASK|BUG|CR|QUESTION`; tạo ra đúng loại (CR qua changeRequests.service, Q&A qua qna.service).
- A12: `WorkRetroAction.trigger/verify`; trần 2 hành động (`WORK_RETRO_ACTION_CAP`, tắt được); `GET /retros/:id/facts` (Done/Planned, giờ log/ước, số Bug theo activity, % PR CI xanh lượt đầu, PR lớn nhất) + panel trong Retro.tsx.
- A22: dòng cảnh báo trong backlog/SWR khi effort Must > `settings.moscowCapPct` (mặc định 60).
- A23: `settings.stageGateBlocksWork` ⇒ thẻ thuộc stage chưa ACTIVE không vào IN_PROGRESS.

Tệp: `src/services/work/issueChange.ts` (cạnh :536-555), `studio.ts` (TransitionRules), `projects.service.ts` (chuẩn hoá khoá settings mới),
`jql.ts`, `uxc.service.ts`/`uxcRules.ts`, `sprintPace.ts`/`flowMetrics.ts`, `search.service.ts` (WIDGET_KINDS), `retro.service.ts`,
`meetings.service.ts`, `stages.service.ts`, `planning.service.ts` (chỉ phần capacity/timeline), route mới `src/routes/work.dm5a.routes.ts`;
frontend `settings/ProjectDetails.tsx`, `ProjectBoard.tsx`, `workflow/TransitionRules.tsx` + `useTransitionDraft.ts`, `Board.tsx`
(chỉ hiển thị tuổi thẻ), `SprintDialogs.tsx`, `agile/Retro.tsx`, `meetings2/*`, `dashboards/widgets.tsx`, `Timeline.tsx`, `lib/work-api.ts`, `lib/work-agile-api.ts`.
Migration (1 tệp): `work_retro_actions` (+trigger, verify), `work_stages` (+planned_start, planned_end), `work_meeting_actions` (+kind).
MCP (không thêm lệnh): `meeting_add_actions` nhận `kind`; `retro_session` thêm action `facts`; `sprint_*` trả `notReady`.
Test: `issueChange.db.test.ts`, `work.studio.db.test.ts`, `work.ctw6.db.test.ts`, `work.ctw7a.db.test.ts`, `jql.test.ts`, `work.planning.db.test.ts`.

### G2 — Hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết (17 tính năng · có migration) — **chứa gần hết P0**

Tính năng: B2 · B3 · B5 · B6 · B8 · B9 · B10 · B13 · B14 · B15 · B16 · B17 · B18 · B19 · B20 · B21 · B23 (+ sửa mô tả `.puml` sai ở `parity3.ts:792` ngay đợt đầu).

Nghiệm thu:
- B9: model `WorkSystemMessage {code SM-xx tự tăng, text, textEn?, httpStatus?, useCaseIds}`; tab trong `/requirements`; `report3_fill_page` điền §5.2 đủ bảng; lint B8 báo mã SM được nhắc mà không tồn tại.
- B10: Report 3 sau fill có bảng NFR (Scale/Meter/Must→Minimum/Plan→Goal/Wish) và BR theo category; test snapshot docx.
- B16: `diagram_extras action=db_design_table` + nút ở diagrams: từ sơ đồ SQL sinh mỗi bảng một bảng 7 cột (No·Field·PK·FK·UN·NN·Description) + khối Constraints (CHECK/EXCLUDE/UNIQUE), chèn §1.3.x của Report 4; dự án LabFlow 15 bảng ⇒ 15 bảng, tên cột khớp 100% migration.
- B17: `docs_extras action=report4_fill` gom B16 + sơ đồ (`diagramFill`) + khung §3 theo package Spring Boot.
- B13: Summary RTM có 4 chỉ số (UC Coded thiếu SDS, UC Tested thiếu ST, % BR có test, số test mồ côi) + sheet `NFR` (NFR → meter → test/đo); `rtm_get` trả các chỉ số.
- B19: `final_report_assemble` trả `checks[]` trước khi ghép: mã trùng/không tồn tại (FE/UC/BR/SM/LI), số test và % pass trong Phần V lệch dữ liệu 5.1/5.2/5.3, effort Phần II lệch tổng worklog > 5%, chữ mẫu (`<…>`, "Feature name", "TBD") còn sót. Có lỗi ⇒ vẫn ghép nhưng banner đỏ liệt kê.
- B21: autofill Record of Changes thêm dòng A/M/D từ CR trạng thái IMPLEMENTED có liên kết baseline tới mục của tài liệu đó.
- B2: RACI có cột theo VAI (stakeholder kiểu ROLE), luật `ONE_ROLE_MAJORITY_A` (> 50%); Report 2 §3 điền R/A/C/I; chế độ xuất "trung thực" gộp C1–C5 thành "Sinh viên" + cột Supervisor.
- B3: `docs_extras action=autofill` (cùng service web).
- B5/B6: `WorkRaidQuestion` +`proposal`, `optionA`, `optionB`, `targetRef`; nút "Đẩy sang Q&A" ở từng câu hỏi elicitation; đóng Q&A khi `targetRef` trống ⇒ cảnh báo (cấu hình chặn); sheet Q&A xuất cột mới.
- B8: six links thêm 3 luật (SYSTEM_SUBJECT, STEP_REF_UNKNOWN, CODE_IN_POSTCONDITION) với test thuần.
- B14: `ctwork_read kind=submit_check`: so tên UC ↔ thẻ ↔ WBS + checklist 10 lỗi bút đỏ, trả danh sách đỏ/xanh; tab "Soát trước nộp" ở School.
- B15: trang tạo từ mẫu `adr` nhận số `ADR-00n` tự tăng trong dự án; trường "Superseded by".
- B18: `DIAGRAM_FORMATS += PLANTUML`, render SVG phía server (plantuml-encoder → máy render tự host, không gửi ra dịch vụ công cộng), nhập `.puml` từ repo/tệp; caption "Figure n" theo thứ tự trong Report.
- B20: `docs_extras action=report6_fill`: khung 3.x theo actor → màn (tên lấy đúng `WorkSrsScreen`), cảnh báo tiêu đề lệch.
- B23: thêm 6 mẫu `.md` + catalog, `docTemplates.test.ts` xanh.

Tệp: `srs.ts`, `srs.service.ts`, `srsDeep.service.ts`, `swr.ts`, `swr6b.ts`, `swrElic.service.ts`, `qna.service.ts`, `rtm.ts`, `rtm.service.ts`,
`docFill.ts`, `docs3a.service.ts`, `diagramFill.ts`, `diagram.ts`, `diagramImport.ts`, `diagramRender*.ts`, `sqlDesign/*`, `finalReport*.ts`,
`pages.service.ts` (chỉ đánh số ADR), `content/quy-trinh/mau/*` + `frontend/public/quy-trinh/mau/*`; frontend `components/work/{srs,swr,swr6b,diagrams,docs,school}/*`,
`lib/work-swr-api.ts`, `work-swr6b-api.ts`, `work-diagrams-api.ts`, `work-docs3a-api.ts`.
Migration (1 tệp): bảng mới `work_system_messages` (+ back-relation trên `WorkProject` — chỉ G2 sửa model này), `work_raid_questions` (+proposal, option_a, option_b, target_ref).
MCP (không thêm lệnh): `swr_extras` (+system_message_add/update, qna_from_elicitation), `docs_extras` (+autofill, report4_fill, report6_fill), `diagram_extras` (+db_design_table; import nhận .puml thật), `ctwork_read` (+submit_check, system_messages), `swr_delete` (+system_message).
Test: `work.ctw4.db.test.ts`, `work.ctw4b.db.test.ts`, `work.docs3a.db.test.ts`, `work.diagramsSql.db.test.ts`, `swr.test.ts`, `swr6b.test.ts`, `docTemplates.test.ts`, `diagrams.test.ts`.

### G3 — Kiểm thử, review & UAT (7 tính năng · có migration)

Tính năng: B4 · D2 · D4 · D5 · D8 · D10 · D17.

Nghiệm thu:
- B4: thêm 4 checklist (`REBUTTAL_10`, `REQ_REVIEW_STRIDE`, `DESIGN_REVIEW_10`, `PR_SELF_4PASS`) vào `reviewRules.ts`; mẫu checklist cấp dự án `settings.reviewChecklists`; `settings.reviewCoolOffHours` ⇒ không đặt decision trước N giờ kể từ lúc mở phiên (`WORK_REVIEW_COOLOFF`).
- D2: `TEST_TYPES += SECURITY`; Test Plan có `entry[]`; `settings.testGate='block'` ⇒ cycle PLANNED→IN_PROGRESS khi entry chưa đạt và `releaseVersion` khi exit chưa đạt ⇒ 409 `WORK_TEST_GATE`; `test_extras` (+plan_settings, case_attributes).
- D5: nhập JUnit XML với quy ước tên test chứa `UTCIDnn` hoặc `methodName` ⇒ ghi P/F vào ma trận `fpt_unit`; coverage % + SHA ghi vào Notes; báo danh sách UTCID không khớp. `test_extras action=automation_import`.
- D8: cờ `WorkDefectInfo.leakage` (mặc định suy từ activity AT để dữ liệu cũ không đổi); DRE tính theo cờ; sheet Defects + nhãn `Leakage` đồng bộ.
- D10: `WorkUatRequest` (+rating 1–5, testerCode); Reject vẫn bắt lý do; biên bản in kèm rating/testerCode; `settings.uatRevokeOnClose` ⇒ thu hồi invite CLIENT của phiên khi APPROVED; đọc UAT qua `ctwork_read kind=uat` (ghi/quyết định vẫn chỉ trên cổng).
- D4: lint thuần trong `fptTests.ts` hiện ở tab 5.1 + đếm nhãn 6 nhóm trên panel test của thẻ Req.
- D17: grade kind `SELF` cho ADMIN/MEMBER dự án (không ghi đè điểm GV), hiện cạnh rubric.

Tệp: `reviewRules.ts`, `quality.service.ts` (phần review), `testMgmt.service.ts`, `testMetrics.ts`, `tests.service.ts`, `fptTests.ts`, `fptTests.service.ts`,
`testAutomation.service.ts`, `testResults.ts`, `defects.service.ts`, `portal.service.ts`, `teaching*.ts`; frontend `components/work/{tests,quality,portal,DefectPanel.tsx,teaching}`,
`app/work/[ws]/[key]/portal/uat/**`, `lib/work-ctw-api.ts`/`work-s5*-api.ts` (tests), portal API.
Migration (1 tệp): `work_defect_info` (+leakage), `work_uat_requests` (+rating, tester_code), `work_grades` (+kind) nếu D17 làm.
Gọi `releaseVersion` ở `planning.service.ts:126` — **chỉ thêm một dòng gọi** hàm `assertTestGate` của G3; G4 cũng sửa `releaseVersion` (xem §4.5).
Test: `work.tests.db.test.ts`, `work.ctw6.db.test.ts`, `work.ctw6b.db.test.ts`, `work.ctw7c.db.test.ts`, `work.fpt.db.test.ts`, `work.fpt3b.db.test.ts`, `work.portal.db.test.ts`, `work.portal6a.db.test.ts`, `work.ctw5.db.test.ts`.

### G4 — Code, phát hành, báo cáo theo vai, CR/RAID & dự án mẫu (14 tính năng · có migration)

Tính năng: A2 (phần hiển thị CI) · A25 · C3 · C5 · C7 · C8 · C10 · C12 · D11 · D12 · D13 · D14 · D15 · D16.

Nghiệm thu:
- A2 hiển thị: `issueDev` + danh sách PR trả `ciState/ciUrl`; chip đỏ/vàng/xanh ở DevelopmentPanel và PullsTab (dữ liệu webhook thật trong test githubApp).
- D14: `WorkVersion` (+freeze_level NONE|FEATURE|CODE|HARD, git_tag, commit_sha); FEATURE ⇒ tạo/thêm thẻ REQUIREMENT/STORY vào version bị chặn (`WORK_VERSION_FROZEN`, ADMIN vượt có audit); CODE ⇒ chỉ Bug P0–P1; release notes AI ghi tag + SHA; `releaseVersion` có cờ "CI xanh ở SHA" khi có PR/commit khớp.
- C5: worklog chọn mũ (`hat` C1–C5, tuỳ chọn; mặc định suy từ activity + nhãn BE/FE); bảng "Giờ theo vai/tuần" ở Reports với % và cảnh báo QA < 15% / tổng > 30h (ngưỡng trong settings); sheet "By role" trong contrib xlsx.
- C7: mỗi phiên AI review tạo một dòng `workAiUsageLog` (nguồn `review:<id>`, PR, ngày); cột `decision ACCEPTED|REJECTED|PARTIAL`.
- D11: `code/review` nhận `mode=critic` (mặc định theo `settings.aiReviewMode`); đầu ra không chứa khối mã (parser gỡ ``` và ép thành câu hỏi gợi mở); test thuần với output giả có code.
- C8: CR (+impact_matrix JSON 6 chiều, options JSON 3 phương án, parent_id); nút "Tách CR"; khi Approve hiện checklist đồng bộ 5 điểm (SRS RoC, Tracking Q&A/Issues/WBS, RTM) lưu vào CR.
- C10: RAID (+contingency); `governance_extras action=raid_to_issue` tạo thẻ + liên kết.
- A25: `POST /workspaces/:wid/projects { fromProjectId, configOnly:true }` chép statuses/workflows+rules/issue types/labels/custom fields/settings (đổi id trường trong doneRequirements/readyRequirements)/mẫu thẻ/cây Docs trống; không chép thẻ, worklog, thành viên. Test: dự án mới 0 thẻ, Done rules chặn đúng trường mới.
- D12/D13: cờ "nhánh > N ngày", "PR > N dòng" ở Branches/Pulls (ngưỡng settings); thẻ "Sức khoẻ repo" ở trang Code (5 mục, branch protection báo "không đọc được" khi token thiếu quyền).
- D15/D16: đồng hồ + mốc phút + nút Plan B ở `present` (lưu `settings.present`); luyện bảo vệ có đồng hồ 40 s, khung PREP, link bằng chứng qua `aiLienKet`.
- C3, C12: số WBS trong Weekly mục I; thêm kind `contrib_xlsx|contrib_pdf|test_cycle|meeting_minutes|review` vào `export_file`.

Tệp: `code.service.ts`, `codeReview.service.ts`, `codeReviewRules.ts`, `githubApp*.ts`, `planning.service.ts` (version), `ai.service.ts` (release notes, defense),
`timeActivity.service.ts`, `contrib.service.ts`, `contribExport.ts`, `fptReports.service.ts` (syncAiUsage, composeWeekly), `changeRequests.service.ts`,
`raid.service.ts`, `projects.service.ts` (**chỉ hàm tạo dự án** — xem §4.5), `toolRegistry/planning.ts` (EXPORT_KINDS); frontend `components/work/{code,DevelopmentPanel.tsx,Releases.tsx,governance,contrib,present,ai/AiPanelHost.tsx,TimeTracking.tsx,reports}`, `code/codeApi.ts`, `lib/work-c8*-api.ts`, `work-contrib-api.ts`, `work-setup-api.ts`.
Migration (1 tệp): `work_versions` (+freeze_level, git_tag, commit_sha), `work_worklogs` (+hat), `work_ai_usage_logs` (+decision), `work_change_requests` (+impact_matrix, options, parent_id + self-relation `@relation("CrParent")`), `work_raid_items` (+contingency).
Test: `work.code.db.test.ts`, `work.codeReview.db.test.ts`, `work.githubApp.db.test.ts`, `work.planning.db.test.ts`, `work.contrib.db.test.ts`, `work.fpt.db.test.ts`, `work.s4.db.test.ts`, `work.ctw9b.db.test.ts`, `registry.test.ts`.

### 4.5 Chỗ đụng chung và cách tránh xung đột

| Điểm chung | Ai đụng | Luật |
|---|---|---|
| `prisma/schema.prisma` | G1 (RetroAction, Stage, MeetingAction) · G2 (model mới SystemMessage + **WorkProject** back-relation, RaidQuestion) · G3 (DefectInfo, UatRequest, Grade) · G4 (Version, Worklog, AiUsageLog, ChangeRequest, RaidItem) | Mỗi gói chỉ sửa model của mình; model mới đặt trong khối `// ── dm5 Gn ──`. Mỗi gói MỘT thư mục migration, timestamp cách nhau theo thứ tự ghép G1 < G2 < G3 < G4. Gói ghép sau rebase rồi chạy lại `prisma generate` + `migrate diff` rỗng. Chỉ G2 sửa `WorkProject` |
| `src/services/work/issueChange.ts` | G1 sở hữu | G3/G4 không sửa. Cổng CI (A2) do G1 đọc thẳng `workGitPull`. Defect chỉ QA đóng (A7) = cấu hình mẫu, không viết mã |
| `projects.service.ts › updateProject` (chuẩn hoá settings) | G1 sở hữu khoá quy trình; G2/G3/G4 cần khoá riêng (`reviewChecklists`, `reviewCoolOffHours`, `testGate`, `uatRevokeOnClose`, `aiReviewMode`, `present`, `roleAlert`) | Mỗi gói thêm hàm `normalizeXxxSettings` trong tệp service CỦA MÌNH; `updateProject` chỉ thêm 1 dòng gọi/gói (xung đột 1 dòng, dễ gỡ). A25 (G4) chỉ sửa hàm tạo dự án |
| `planning.service.ts › releaseVersion` | G3 (test gate) · G4 (freeze, CI ở SHA) | G4 sở hữu hàm; G3 viết `assertTestGate(tx, versionId)` trong `testMgmt.service.ts`, G4 gọi nó. Ghép G3 trước G4 |
| MCP registry (token người 277/280, `registry.test.ts:201`) | cả 4 | **Không gói nào thêm lệnh mới.** Chỉ thêm `action` vào lệnh sẵn có: G1 → `meeting_add_actions`, `retro_session`, `sprint_*`; G2 → `swr_extras`, `docs_extras`, `diagram_extras`, `ctwork_read`, `swr_delete`; G3 → `test_extras`, `ctwork_read kind=uat`; G4 → `governance_extras`, `code_review` (tham số `mode`), `version_manage` (trường mới), `export_file` (kind). `ctwork_read` có cả G2 và G3: mỗi gói thêm `case` riêng, ghép tuần tự. Mỗi action ghi phải có mục trong `docs/cuongmini-ctwork-parity.md` |
| `frontend/src/lib/*-api.ts` | cả 4 | Repo KHÔNG có một `api.ts` chung: mỗi gói thêm hàm vào tệp API vùng mình (G1 `work-api.ts`/`work-agile-api.ts`; G2 `work-swr*-api.ts`, `work-diagrams-api.ts`, `work-docs3a-api.ts`; G3 tests/portal; G4 `code/codeApi.ts`, `work-c8*-api.ts`, `work-contrib-api.ts`). Kiểu `ProjectSettings` dùng chung: chỉ G1 sửa, gói khác khai interface con trong tệp của mình |
| i18n `components/work/i18n/{vi,en}/*.ts` | cả 4 | G1 sở hữu `settings.ts`, `wf.ts`, `pboard.ts`, `agile.ts`; các gói khác thêm chuỗi vào namespace vùng mình (srs/swr/tests/code…); bắt buộc thêm cả vi lẫn en |
| `permissions.ts › AGENT_DENIED_ROUTES` + bảng `permissions.test.ts` | G3 (thu hồi invite UAT = tác dụng tới khách), G4 (tạo dự án từ mẫu — tuyến ngoài `/projects/:pid`, agent mặc định 403; giữ nguyên), G1 (PATCH settings đã cấm sẵn) | Tuyến ghi mới có tác dụng đối ngoại/cấu hình ⇒ thêm vào bảng CẢ hai nơi. Tuyến đọc/điền tài liệu (G2 fill) để mở cho agent như `report3_fill_page` |
| `desktop/src/renderer/features/web/tuyenCtWork.ts` | — | Kế hoạch không thêm trang mới dưới `app/work` (mọi thứ là tab/panel trong trang có sẵn). Gói nào lỡ thêm trang ⇒ thêm tuyến (tĩnh trước động) + test chặn |
| `docs/so-loi.md`, `CLAUDE.md` | — | Lỗi gặp khi làm ⇒ ghi sổ lỗi trong commit của gói đó |

Thứ tự ghép đề xuất: **G2 trước** (gần hết P0, ít đụng ai) · G1 · G3 · G4. Mỗi gói: test DB của vùng + `npx tsc --noEmit` + `(cd frontend && npx tsc --noEmit && npm run build)` + `registry.test.ts`;
sửa giao diện CT Work ⇒ sau deploy chạy `npm run phat-hanh:ca-hai` (CLAUDE.md). Sau mỗi gói, sửa bài học tương ứng (§3.2 + chỗ bài nói "nếu CT Work chưa có… ghi tay") để bài chỉ đúng nút thật.
