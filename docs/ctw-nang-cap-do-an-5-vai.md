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

## Kết quả G1 — Cổng quy trình & nhịp vận hành (27/11/2026)

Migration `20261127130100_dm5_g1_process_gates` (chỉ ADD): `work_retro_actions` +trigger/verify · `work_stages` +planned_start/planned_end ·
`work_meeting_actions` +kind (mặc định TASK) +created_ref. Mã: `src/services/work/dm5Rules.ts` (thuần) + `dm5a.service.ts` (DB, cổng gọi từ
`issueChange.ts`) + tuyến đọc `src/routes/work.dm5a.routes.ts`. Mọi khoá settings mới THIẾU = tắt ⇒ dự án cũ không đổi hành vi (có test).

| # | TT | Cách dùng trên web | MCP |
|---|---|---|---|
| A14 DoR | ✓ | Cài đặt › Chi tiết › **Definition of Ready** (trường · loại thẻ · trạng thái đích · "prototype đã duyệt"). Kéo thẻ thiếu ⇒ 400 `WORK_READY_REQUIREMENTS` (REST, sửa hàng loạt, MCP `transition`). Hộp thoại Bắt đầu / Lập kế hoạch sprint hiện "N thẻ chưa Ready" | `sprint_current` trả `notReady` + `guards` |
| A2 cổng CI | ✓ | Cài đặt › Chi tiết › **CI xanh trước khi Done** (+ "bắt buộc có PR"). PR gắn thẻ CI failure/pending ⇒ `WORK_DONE_CI`; PR đóng không merge bị bỏ qua; CI chưa báo/neutral ⇒ qua | qua `transition` |
| A6 | ✓ | Workflow › chọn mũi tên › **Bắt buộc có bình luận xác nhận** (bộ phận, rỗng = ai khác người được giao; chỉ tính bình luận người SAU lúc vào trạng thái nguồn) + **Làm nguội N giờ** (đọc WorkHistory). Mã `WORK_TRANSITION_COMMENT` / `WORK_TRANSITION_COOLOFF`; ADMIN không vượt | — |
| A4 | ✓ | Cài đặt › Board › **Chặn WIP chéo cột** (Khi cột A có ≥ N thẻ ⇒ chặn kéo vào cột B; N trống = WIP của cột A). `WORK_WIP_LIMIT`, không phụ thuộc công tắc chặn cứng | — |
| A15 | ✓ | Cài đặt › Chi tiết › **Sức chứa & hệ số tập trung** (focus 0,1–1, cam/đỏ %). Hộp thoại sprint: "Ước lượng Xh / Yh sức chứa tập trung — Z%", đỏ khi > ngưỡng. `GET /capacity` trả thêm `focus` | `sprint_current.guards.capacity` |
| A17 | ✓ | Giai đoạn › Sửa giai đoạn › ngày kế hoạch bắt đầu/kết thúc; dòng giai đoạn đỏ khi trễ. Timeline: vạch đứt + mốc ◆ ở ngày cổng, đỏ khi trễ | — |
| A18 | ✓ | JQL `flaggedSince < -24h` (+ ORDER BY). Board: huy hiệu tuổi thẻ ⌛Nd (≥ 2 ngày, cam ≥ 5, đỏ ≥ 10). Widget **Sức khoẻ** có dòng cảnh báo sớm: Blocked > 24h · P1–P2 đứng yên > 48h · burndown phẳng ≥ 3 ngày · thêm N điểm sau Start (bấm ⇒ danh sách JQL) | — |
| A19 | ✓ | Dashboard › Thêm widget **RAG dự án** (tiến độ · phạm vi · chất lượng · công sức; tổng = tệ nhất; % hoàn thành có trọng số 0/20/50/75/100). Ngưỡng: Cài đặt › Chi tiết › **Ngưỡng RAG** | — |
| A21 | ✓ | Họp › Việc cần làm: cột **Loại** Task / Bug / Yêu cầu thay đổi / Câu hỏi Q&A ⇒ "Tạo thẻ" sinh thẻ Task/Bug, CR-n (changeRequests.service), Q-n (qna.service); bấm lại không nhân đôi; thiếu mô-đun CR ⇒ báo trước, không tạo dở | `meeting_add_actions` nhận `kind`; `meeting_create_issues` trả cả CR/Q |
| A12 | ✓ | Retro › Hành động có ô **Dấu hiệu** + **Cách kiểm chứng** (vào mô tả thẻ); trần `retroActionCap` (Cài đặt › Chi tiết › Nhịp & cổng; 0 = tắt; mẫu SWP391/Capstone = 2) ⇒ `WORK_RETRO_ACTION_CAP`. Khối **Số liệu sprint**: Done/Planned, giờ log/ước, Bug theo activity (lọt = AT), % PR CI xanh lượt đầu, PR lớn nhất | `retro_session` action `facts`, `add_action` nhận trigger/verify |
| A22 | ✓ | Trần Must (`moscowCapPct`, mặc định 60, 0 = tắt): dải cảnh báo đầu Backlog + dòng trong hộp thoại sprint | `sprint_current.guards.mustPct` |
| A23 | ✓ | Cài đặt › Chi tiết › Nhịp & cổng › **Giai đoạn chưa mở thì chặn việc của nó** ⇒ thẻ của giai đoạn NOT_STARTED không rời To Do (`WORK_STAGE_NOT_ACTIVE`) | — |
| A7 | ✓ | Mẫu SWP391 + CAPSTONE: luồng Bug Retest → Closed có `notAssignee` (dev được giao không tự đóng) — dự án tạo MỚI | — |

Ước lượng/giới hạn đã chọn (ghi rõ): "% PR CI xanh lượt đầu" = CI success và KHÔNG có lượt đẩy nào lên nhánh sau khi mở PR
(CT Work không lưu lịch sử từng lượt chạy CI); `retroActionCap` mặc định TẮT cho dự án cũ (bật sẵn 2 ở mẫu mới) để không
vỡ retro đang có; lỗi cổng mới giữ câu tiếng Anh có chi tiết (như WORK_DONE_REQUIREMENTS/WORK_WIP_LIMIT cũ).

Test: `WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5a.db.test.ts` (19/19) · `npx tsx --test src/services/work/dm5Rules.test.ts`
+ `jql.test.ts` (flaggedSince) + `studio.test.ts` + `permissions.test.ts` + `toolRegistry/registry.test.ts` xanh · hồi quy DB: issueChange,
ctw7a, planning, studio, s3b, tests, mcp, docs3a, ctw6, agents xanh.

## Kết quả G3 — Kiểm thử, review & UAT (27/11/2026)

Migration `20261127130300_dm5_g3_test_uat` (chỉ ADD): `work_defect_info.leakage` BOOL NULL · `work_uat_requests.rating` INT NULL +
`tester_code` VARCHAR(12) · `work_grades.kind` VARCHAR(8) DEFAULT 'TEACHER'. Khoá settings mới chuẩn hoá ở `qualitySettings.ts`
(`updateProject` gọi đúng 1 dòng): `reviewChecklists`, `reviewCoolOffHours`, `testGate` (block|warn), `uatRevokeOnClose`, `portalRevokedUserIds`.

| # | TT | Làm gì · đường đi trên web · MCP |
|---|---|---|
| B4 | ✓ | 4 bộ dựng sẵn `REBUTTAL_10` (10) · `REQ_REVIEW_STRIDE` (8 + 4 STRIDE-lite) · `DESIGN_REVIEW_10` (10) · `PR_SELF_4PASS` (4 lượt/9 câu), song ngữ, lấy nguyên văn bài s01/b5 · s04/b7 · s05/b7 · s06/b5. Mẫu cấp dự án khoá `P_…` (Docs › Reviews › **Checklist của dự án & làm nguội**, chép được từ bộ dựng sẵn); làm nguội N giờ ⇒ 409 `WORK_REVIEW_COOLOFF` khi đặt quyết định sớm (chi tiết phiên hiện dải đếm ngược, nút quyết định khoá). MCP `review_manage create checklistKey=P_…` |
| D2 | ✓ | `TEST_TYPES += SECURITY`. Test Plan `entry[]` (CASES_READY · REQ_COVERAGE · MAX_OPEN_CRITICAL · SMOKE_PASSED · PLAN_REVIEWED · MANUAL) + `versionId`. `testGate='block'` ⇒ cycle PLANNED → bắt đầu (đổi tay **và** ghi kết quả lần chạy đầu) ⇒ 409 `WORK_TEST_GATE`; `warn` chỉ cảnh báo. **`assertTestGate(tx, versionId)`** trong `testMgmt.service.ts` cho G4 gọi trong `releaseVersion` (đọc qua tx; kế hoạch nhắm version ⇒ xét chúng; không có ⇒ các kế hoạch có vòng chạy; không kế hoạch ⇒ toàn dự án, tiêu chí mặc định; trả `{mode, met, plans}`). Web: Tests › Quality › thẻ **Cổng kiểm thử**. MCP `test_extras action=plan_settings` / `case_attributes` |
| D5 | ✓ | `POST /fpt-tests/unit/automation-import`: JUnit (Surefire) `…UTCIDnn` hoặc `[n]` ⇒ P/F + ngày đúng UTCID; JaCoCo/lcov % + SHA ⇒ dòng `Automation:` trong Notes Statistics 5.1; trả test không khớp (lý do) + UTCID chưa có test; `dryRun`. Web: Tests › Unit test 5.1 › **Nhập JUnit / JaCoCo**. MCP `test_extras action=automation_import` |
| D4 | ✓ | Lint 5.1 (`GET /fpt-tests/unit/lint`: thiếu A/B, A<N, UTCID không đánh dấu, trùng, tiền điều kiện lẫn vào Condition) — nút **Soát Report 5.1**. Thẻ Req/Story có khung **Nhóm ca kiểm thử** (6 nhóm theo nhãn, cả nhãn tiếng Việt; nhóm thiếu; lint bước test). MCP `unit_lint`, `test_groups` |
| D8 | ✓ | Cờ `leakage` (null = suy AT / nhãn "Leakage" ⇒ số cũ không đổi), đồng bộ nhãn `Leakage`, lịch sử `defectLeakage`; DRE/leakage tab Quality theo cờ; sheet Defects ghi "Leakage" đầu Notes. Web: khung Defect của thẻ Bug. MCP `defect_set leakage` |
| D10 | ✓ | `testerCode` (P1…, chặn tên/email) khi tạo UAT + sửa (`PATCH /portal/uat/:aid`); khách chấm 1–5 khi quyết (Reject vẫn bắt lý do); biên bản in có mã + điểm; `GET /portal/uat` + `ctwork_read what=uat` (number = biên bản). `uatRevokeOnClose` ⇒ thu hồi lời mời CLIENT còn treo + đưa người thử vào `portalRevokedUserIds` ⇒ 403 `WORK_PORTAL_REVOKED` ở mọi tuyến dự án, hết thông báo; ADMIN mở lại (`POST /portal/clients/:uid/restore`). **Cố ý không gỡ vai CLIENT**: gỡ thì khách là MEMBER không gian thoát cách ly và vào ngầm dự án mở. Web: Cổng khách (nhân viên) — ô mã người thử, công tắc đóng quyền, nhãn "Đã đóng quyền" + Mở lại |
| D17 | ✓ | `PUT/DELETE /grades/self` (kind SELF, subjectKey `S<người>:…`): ADMIN/MEMBER tự chấm theo rubric GV đã dùng hoặc mẫu SWP391/SEP490; không đè/không công bố/không vào tổng hợp hub giảng viên; GV thấy chỉ đọc. Web: School › Grades › **Tự chấm** (hiện cạnh điểm GV) |

Test: `npx tsx --test src/services/work/dm5g3.test.ts` (14/14) · `WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5g3.db.test.ts` (7/7) · hồi quy xanh:
ctw6, ctw6b, tests, portal, portal6a, fpt, fpt3b, ctw5, permissions, registry, fptTests, teachingRules, portal.test, i18n.test (frontend).
`work.ctw4.db.test.ts` đỏ 1 ca A19 RTM: sheet `NFR` mới trong xlsx RTM — thay đổi của G2, không phải G3.

## Kết quả G4 — Code, phát hành, báo cáo theo vai, CR/RAID & thư viện mẫu (27/11/2026)

Migration `20261127130400_dm5_g4_code_release_cr` (chỉ ADD): `work_versions` +freeze_level (NONE) +git_tag +commit_sha +release_ci ·
`work_worklogs` +hat · `work_ai_usage_logs` +decision · `work_change_requests` +impact_matrix +options +parent_id (FK tự trỏ `CrParent`,
SET NULL) +sync_checklist · `work_raid_items` +contingency. Phần thuần: `dm5g4Rules.ts`, `projectBlueprints.ts`; DB: `projectBlueprint.service.ts`,
`versionFreeze.ts` + sửa trong code / codeReview / planning / changeRequests / raid / timeActivity / contribExport / fptReports / ai service.
Khoá settings mới (chuẩn hoá `normalizeG4Settings`, `updateProject` gọi 1 dòng): `aiReviewMode` critic|full · `present` · `roleAlert`
{qaMinPct 15, maxWeekHours 30} · `codeHealth` {branchMaxDays 3, prMaxLines 400} · `releaseRequireGreenCi`.

| # | TT | Cách dùng trên web | MCP (không lệnh mới) |
|---|---|---|---|
| A2 hiển thị | ✓ | Chip CI xanh/đỏ/vàng ở Code › Pull request và panel **Development** của thẻ (CI gộp của thẻ = PR mở tệ nhất); bấm mở lượt chạy CI | dev_activity / code_read như cũ |
| D12 | ✓ | Code › Nhánh: cờ "Mở N ngày (quá 3)"; Code › Pull request: "PR lớn · N dòng (quá 400)" + dòng tổng; ngưỡng `settings.codeHealth` | — |
| D13 | ✓ | Code › Hoạt động: thẻ **Sức khoẻ repo** 5 mục (.gitignore · .env.example · PR template · CI workflow · bảo vệ nhánh — đọc trường `protected` của API nhánh; không đọc được ⇒ "Không rõ") | `GET /code/health` |
| D11 | ✓ | Nút CuongMini review: ô **Chỉ phản biện**; mặc định theo `settings.aiReviewMode`. Prompt thêm luật mentor + máy gỡ mọi khối mã/dòng mã, gợi ý có mã ⇒ câu hỏi gợi mở theo loại phát hiện | `code_review` / `review_manage ai_code_review` +`mode` |
| C7 | ✓ | Mỗi phiên AI review ⇒ 1 dòng School › **AI usage** (nguồn `review:<n>`, PR, LOC); cột **Quyết định** Chấp nhận/Một phần/Bác bỏ; xuất 10 cột ghi "Decision: …" đầu cột Validation | `fpt_reports_manage` (PATCH ai-usage nhận `decision`) |
| D14 | ✓ | Releases › Sửa version: **Đóng băng** Feature (chặn Req/Story/Epic) · Code (chỉ Bug P0–P1) · Hard; Git tag + SHA; hộp Release nhận tag/SHA ⇒ ghi `releaseCi` (PR có headSha khớp), `releaseRequireGreenCi` ⇒ 409 `WORK_RELEASE_CI`; release notes AI có dòng tag + SHA do mã viết; `releaseVersion` gọi `assertTestGate` (G3) ⇒ 409 `WORK_TEST_GATE`, trả `testGate`. ⚠ Chốt chặn thẻ vào version đóng băng là `assertVersionFreeze` (versionFreeze.ts, có test) — **cần nối 2 dòng trong issueChange.ts (G1 sở hữu)**, xem dưới | `version_manage` +`freezeLevel`/`gitTag`/`commitSha`, release trả `ci` |
| C5 | ✓ | Log time: ô **Vai (mũ)** C1–C5 (trống = suy activity + nhãn C1…C5/PM·BA·BE·FE·QA); sửa mũ ở dòng worklog; Reports › **Giờ theo vai** (tuần × 5 mũ, %, cảnh báo QA thấp / quá giờ, lọc người); Đóng góp xlsx thêm sheet **By role** | `export_file kind=contrib_xlsx`; `GET /reports/hours-by-role` |
| C3 | ✓ | Weekly Report mục I/III: "WBS 1.2.3" đầu cột Notes (cột Task giữ đúng tên việc), việc ngoài WBS ghi "not in WBS" | `weekly_report_generate` |
| C8 | ✓ | Trang CR: **Phân tích ảnh hưởng 6 chiều** (mức + ghi chú) + **3 phương án** A/B/C; **Tách** ⇒ CR con CR-na/nb (một cấp); sau Approve: **Checklist đồng bộ 5 điểm** (SRS RoC · Tracking Q&A/Issues/WBS · RTM; agent bị chặn) | `change_request_manage` +impactMatrix/options; `governance_extras` +`cr_split`/`cr_sync` |
| C10 | ✓ | RAID: ô **Plan B (dự phòng)**; nút **Tạo thẻ** / **Thẻ cho Plan B** (thẻ + liên kết + lịch sử) | `raid_create/update` +contingency; `governance_extras` +`raid_to_issue` |
| D15 | ✓ | Reports › Trình chiếu: thẻ **Thời gian bảo vệ** (thời lượng, mốc phút, link Plan B; ADMIN lưu `settings.present`); khi chiếu: đồng hồ + vạch mốc + "Quá giờ" + nút Plan B (phím T) | — |
| D16 | ✓ | Luyện bảo vệ: đồng hồ **40 giây** mỗi câu + khung **PREP**; hội đồng trả "Model answer (PREP)" + "Evidence to show" — link sâu do `aiLienKet` dựng (thẻ/Docs/trang mục có thật) | — |
| C12 | ✓ | — | `export_file` +`contrib_xlsx` · `contrib_pdf` · `test_cycle` (cycleId, format) · `meeting_minutes` (meeting) · `review` (review) |
| A25 + thư viện mẫu | ✓ | Tạo dự án › **Thư viện mẫu**: SWP391 nhóm 5 · SWP391 một mình 5 vai · SEP490 · OJT · Scrum chung — đứng TRÊN mẫu cố định (SWP391/CAPSTONE/COMPANY/BLANK), tích bật/tắt 10 nhóm (luồng + WIP + luật, loại thẻ, trường, nhãn, cổng G1/G3/G4, họp định kỳ, giai đoạn có ngày, bộ Docs 6 mẫu, DoD + checklist review, mô-đun), **Xem trước** trước khi tạo. Hoặc **Chép cấu hình từ một dự án** (luồng/luật/loại/nhãn/component/trường/settings đổi id trường + trạng thái/mẫu thẻ/giai đoạn/cây Docs tiêu đề; tuỳ chọn chép nội dung Docs) — không thẻ/worklog/sprint/thành viên/người duyệt | `create_project` +`blueprint`/`groups`/`fromProject`/`copyDocBodies`/`dryRun`; `GET /project-blueprints`, `POST /workspaces/:ws/projects/preview` |

Bộ SOLO5 (khớp khoá `du-an-mot-minh-5-vai`): trường Evidence · Ready (DoR) · Role (C1–C5) · MoSCoW · Complexity · Planned LOC · Pull request;
nhãn Req/Task/Q&A/Defect/Leakage/TechDebt/BE/FE/C1…C5; To Do → In Progress (WIP 2) → In Review (WIP 2) → Done (chỉ từ In Review,
`notAssignee`); Done rules Evidence + `requireCiGreen`; DoR; `wipMode=block` + `wipGuards` In Review ⇒ In Progress; capacity 0,6/75/85;
RAG; Must 60%; `stageGateBlocksWork`; retro trần 2; `testGate=block`; làm nguội review 12 h; `aiReviewMode=critic`; `roleAlert`; banner Solo;
họp Daily T2–T6 8:30 · giữa tuần T4 · review + retro CN; giai đoạn G0 → Iteration 1–3 → bảo vệ (ngày theo tuần); Docs "Project kit".
Khoá G1/G3 lấy đúng tên trong mục Kết quả G1/G3; bộ áp đi qua `updateProject` nên chạy đủ bộ chuẩn hoá của từng gói.

**Việc cho người ghép (issueChange.ts — G1 sở hữu, G4 không sửa):** thêm 2 lời gọi `assertVersionFreeze` (import từ `./versionFreeze.js`):
- tạo thẻ (cạnh `if (input.fixVersionId) await assertVersion(...)`, ~dòng 338):
  `if (input.fixVersionId) await assertVersionFreeze(tx, { projectId: input.projectId, versionId: input.fixVersionId, typeId: input.typeId, priority: input.priority ?? PRIORITY_DEFAULT, actor });`
- đổi version (trong `if (patch.fixVersionId !== undefined && …)`, sau `assertVersion`):
  `if (patch.fixVersionId !== null) await assertVersionFreeze(tx, { projectId: before.projectId, versionId: patch.fixVersionId, typeId: before.typeId, priority: patch.priority ?? before.priority, actor, issueKey: … });`
Test REST `D14 qua REST` trong `work.dm5g4.db.test.ts` tự bật khi issueChange.ts có chuỗi `assertVersionFreeze`.

Bỏ / giới hạn có chủ ý: tuổi nhánh tính từ lần đầu CT Work thấy nhánh (webhook), không phải commit đầu; CI ở SHA chỉ biết khi SHA là
headSha của một PR (CT Work không lưu CI theo từng commit); checklist đồng bộ CR không chặn chuyển IMPLEMENTED (chỉ hiện tiến độ);
mốc trình chiếu lưu cấp dự án (một bộ / dự án).

Test: `npx tsx --test src/services/work/dm5g4Rules.test.ts` (21/21) · `WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5g4.db.test.ts`
(21 xanh + 1 bỏ qua chờ nối issueChange): tạo từ cả 5 bộ (không nhóm nào lỗi), SOLO chạy thật (WIP 2, WORK_TRANSITION_SELF,
WORK_DONE_REQUIREMENTS), tắt nhóm, chép cấu hình (0 thẻ, Done rules chặn đúng trường MỚI), CI/nhánh/PR, sức khoẻ repo, critic + AI Usage,
freeze/tag/SHA/CI, test gate G3, giờ theo vai + sheet By role, WBS weekly, CR 6 chiều/tách/sync, RAID Plan B ⇒ thẻ, settings present.
Hồi quy: registry, permissions, codeReview, fptReports, githubApp (thuần) + codeReview, code, planning, fpt, fpt3b, contrib, githubApp, s3b, s4, ctw9b (DB).

## Kết quả G2 — Hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết (27/11/2026)

Migration `20261127130200_dm5_g2_ho_so` (chỉ ADD): bảng `work_system_messages` (+ back-relation `WorkProject.systemMessages`),
`work_raid_questions` (+proposal, option_a, option_b, target_ref). Route mới: `src/routes/work.dm5b.routes.ts` (1 dòng `router.use`).
MCP: KHÔNG thêm lệnh — chỉ action (ghi ở `docs/cuongmini-ctwork-parity.md`).

| # | Tính năng | TT | Web (đường đi) · MCP |
|---|---|---|---|
| B9 | Sổ System Messages SM-xx (loại · ngữ cảnh · nội dung · EN · HTTP · UC dùng), agent ⇒ đề xuất, mã nhắc mà không có, Report 3 §5.2 | ✓ | Requirements › **System messages** · `swr_extras system_message_add/update`, `swr_delete system_message`, `ctwork_read system_messages` |
| B10 | Report 3: §4.2.x NFR (Ambition·Scale·Meter·Minimum(Must)·Goal(Plan)·Wish·Verification; đặc tính ngoài mẫu ⇒ 4.2.n), §5.1 BR theo nhóm (hàng nhóm gộp 3 ô) | ✓ | Docs › Report 3 › ⋯ › Fill from structured requirements · `report3_fill_page` (sections `nfr`, `systemMessages`) |
| B8 | Lint UC trong Six links (link 2): SYSTEM_SUBJECT, STEP_REF_UNKNOWN, CODE_IN_POSTCONDITION (cảnh báo) + SM_UNKNOWN (lỗi) | ✓ | SWR › Six links · `swr_six_links` |
| B16 | Bảng "1.3 Database Design" 7 cột + Constraints từ sơ đồ SQL hoặc Flyway của repo; LabFlow 15 bảng ⇒ 15 bảng, tên cột nguyên văn; điền lại giữ mô tả người gõ | ✓ | Diagrams › (sơ đồ SQL) › **Database design tables** · Docs › Report 4 › ⋯ · `diagram_extras db_design_table` |
| B17 | Điền nháp Report 4: §1.3 (B16) + sơ đồ đã duyệt + §3 Class Specifications theo package Spring Boot (thuộc tính/phương thức đọc từ mã) | ✓ | Docs › Report 4 › ⋯ › Fill Report 4 (/ from the repository) · `docs_extras report4_fill` |
| B13 | RTM: 4 chỉ số phủ (UC coded thiếu SDS · UC tested thiếu ST · % BR có test · test mồ côi) + bảng/sheet NFR → Meter → Test | ✓ | Requirements › Traceability (ô chỉ số + bảng NFR) · xlsx sheet `NFR` + Summary · `rtm_get` |
| B19 | Report 7 đối soát trước ghép: mã FE/UC/BR/SM lạ/trùng/lệch tên, LI trùng, số test + % pass Phần V vs 5.1/5.2/5.3, effort Phần II vs worklog > 5%, chữ mẫu sót; có lỗi vẫn ghép + hộp đỏ | ✓ | Docs › Report 7 › ⋯ › Check before assembling / Assemble · `final_report_assemble` (trả `checks`), `ctwork_read final_checks` |
| B21 | Record of Changes thêm dòng A/M/D từ CR IMPLEMENTED có ref tới tài liệu (DOC = trang; SRS nhận cả UC/BR/REQ) | ✓ | Docs › ⋯ › Fill from project data (Record of Changes) · `docs_extras autofill` |
| B2 | Stakeholder kiểu ROLE (5 mũ C1–C5), luật ONE_ROLE_MAJORITY_A (> 50%), gói việc Report 2; Report 2 §3 điền R/A/C/I: `roles` (5 cột mũ) / `honest` (Sinh viên + Supervisor, mặc định khi 1 SV + có mũ, kèm ghi chú) / `people` | ✓ | SWR › Stakeholders › RACI: Add the 5 hats · Add Report 2 work packages · Docs › Report 2 › ⋯ › Fill RACI · `swr_extras seed_hats`, `raci_activity_add preset=report2`, `docs_extras autofill raciMode` |
| B3 | Autofill Report 1/2 qua MCP | ✓ | `docs_extras autofill` |
| B5/B6 | Q&A + Đề xuất, Phương án A/B, Mã đích (BR/UC/SM/FE/thẻ, kiểm tồn tại); đóng thiếu đích ⇒ cảnh báo, `settings.qnaRequireTarget='block'` ⇒ 409 `WORK_QNA_TARGET`; sheet Q&A ghi thêm vào Notes (giữ 8 cột mẫu); câu hỏi elicitation ⇒ Q&A (đánh dấu Q-n, đẩy lại không nhân đôi) | ✓ | School › Q&A · SWR › Elicitation › câu hỏi › Push to Q&A · `qna_ask/qna_answer/qna_update`, `swr_extras qna_from_elicitation` |
| B14 | Soát trước nộp: tên UC ↔ thẻ ↔ WBS + 10 lỗi bút đỏ (xanh/đỏ/chưa áp dụng) | ✓ | School › **Submission check** · `ctwork_read submit_check` |
| B15 | ADR-00n tự tăng (mẫu `adr`, `sep490-adr`), "Superseded by"/"Supersedes" + ADR cũ ARCHIVED | ✓ | Docs › New page › ADR · ⋯ › Mark as superseded by… · `docs_extras adr_supersede` |
| B18 | PlantUML thật: định dạng PLANTUML, nhập `.puml` (tệp / `repoPath`), chặn `!include`, SVG ở máy render tự host (`PLANTUML_SERVER_URL`) đã làm sạch, trình soạn + xem trước, khối `plantuml` trong Report, chú thích "Figure n" theo thứ tự | ✓ (cần máy render) | Diagrams › Import (.puml) · `diagram_extras import (repoPath)` |
| B20 | Report 6: khung User Manual actor → màn (tên đúng `WorkSrsScreen`), giữ mục đã viết, cảnh báo tiêu đề lệch (gợi ý tên gần nhất) | ✓ | Docs › Report 6 › ⋯ · `docs_extras report6_fill` |
| B23 | 6 mẫu nhóm "SEP490 kit": Project Charter, Report 5.0 Test Plan, ADR SEP490, Checklist 10 lỗi bút đỏ, Go/No-Go 10 điểm, Front-end Design §1.2.2 | ✓ | Docs › New page › Templates |

Sửa lỗi có sẵn (ghi `docs/so-loi.md`): mô tả `.puml` sai của `diagram_extras` (+ nhập `.puml` thành Mermaid rác); parser SQL nuốt cột `key VARCHAR(80)`.

Test: `npx tsx --test src/services/work/dm5b.test.ts` (23 — SM, NFR/BR + .docx, lint, RTM, bảng CSDL LabFlow 15 bảng, Java, Report 7,
CR, RACI, ADR, User Guide, PlantUML) · `WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5b.db.test.ts` (13 qua HTTP thật) + ctw4/ctw4b/
docs3a/diagramsSql/ctw6b db test xanh. Phần bỏ/giới hạn: B19 chỉ đọc số test/effort theo bảng có cột Total/Passed/Pass rate/Effort hoặc
câu "N test cases … X%"; B18 cần dựng `plantuml/plantuml-server` và đặt `PLANTUML_SERVER_URL` trên VPS (chưa cấu hình ⇒ 503, nguồn vẫn
hiện); bản .docx in khối PlantUML dạng mã (chưa nhúng ảnh SVG).

## Kết quả — Chế độ đóng vai: MỘT tài khoản đóng 5 vai (27/11/2026)

Câu hỏi của user: làm đồ án "một mình 5 vai" bằng MỘT tài khoản (chủ dự án) mà vẫn giữ luật tách quyền, nộp + báo cáo trung
thực, và mở 5 phiên CuongMini CLI đặt tên theo vai, lưu hội thoại, mở lại làm tiếp. Trước đây bài học bắt tạo 5 tài khoản vì
`notAssignee` (người được giao không tự chuyển) và `WORK_REVIEW_SELF` (tác giả không tự duyệt) so theo USER.

**Thiết kế (vì sao chọn vậy).** Vai đi THEO TỪNG YÊU CẦU — header `X-CTW-Vai: C3` (MCP: header của kết nối hoặc
`params._meta["ctwork/vai"]` của từng `tools/call`), KHÔNG lưu "vai hiện tại" ở máy chủ: 5 phiên CLI chạy song song cùng một
token, lưu theo người × dự án thì phiên này đổi vai làm hỏng phiên kia. Web nhớ vai theo dự án ở trình duyệt (localStorage) và gắn
header vào mọi yêu cầu của dự án đó. Chỉ có hiệu lực khi dự án bật `settings.soloRoles.enabled` (ADMIN dự án đổi — cùng quyền
`project.settings`; bộ mẫu SOLO5 bật sẵn). Không có vai / dự án không bật ⇒ hành vi cũ (so theo người). Token AI agent gửi vai ⇒
403 `WORK_ROLE_AGENT`; vai lạ ⇒ 400 `WORK_BAD_ROLE`. Không có user giả: mọi bản ghi vẫn mang userId thật, vai là thông tin THÊM.

| Phần | Tệp chính |
|---|---|
| Lõi máy chủ (ALS, luật thuần, vai của thẻ, gợi ý theo vai) | `src/services/work/vaiDong.ts` (+ `vaiDong.test.ts`) |
| Middleware REST + nhắc trái vai `X-CTW-Vai-Nhac` | `src/routes/work.routes.ts` (sau `chayTrongLuot`), CORS `src/index.ts` |
| MCP header + `_meta` + câu nhắc trong kết quả | `src/mcp/server.ts`, `src/mcp/issueView.ts` (comment/history ghi "(role C3)") |
| notAssignee theo vai | `src/services/work/issueChange.ts` › `assertTransitionAllowed` |
| WORK_REVIEW_SELF theo vai + `hat` từng người tham gia | `src/services/work/quality.service.ts`, `work.ctw6.routes.ts`, `toolRegistry/parity2.ts` (`review_manage participants[].hat`) |
| Ghi vai | lịch sử thẻ (`issueChange.ts`, `planning.service.ts`), bình luận (`issues.service.ts`), worklog `hat` (để trống ⇒ vai đang đóng), audit (`audit.ts`), lần chạy test `executed_role` (`tests.service.ts`) |
| Bản xuất trung thực | `fptReports.service.ts` (Project Tracking: Scope/TimeLogs/Issues, Weekly Report; thành viên "Leader · 1 student plays all 5 roles (C1–C5)"), `contribExport.ts` (sheet By role + ghi chú), biên bản review |
| Web | `frontend/src/lib/work-vai.ts`, `components/work/VaiPicker.tsx` (header), `IssueActivity.tsx` (chip vai), `settings/ProjectDetails.tsx` (bật/tắt), `quality/ReviewDetail.tsx` (cột vai), proxy `app/api/v1/[[...path]]/route.ts`, i18n `vai` (vi+en) |
| CLI + lõi | `desktop/src/main/agent/vaiCtwork.ts` (+ test), `mcp.ts` (`_meta`), `loop.ts` (gợi ý theo vai vào ghi chú dự án của lượt), `phien.ts` (vai trong `nhan.json`), `ipc/agent.ts` (`agent:datVai`, `agent:layVai`, `agent:doiTenPhienCuoc`, `moPhien` trả vai), `packages/cuongmini-cli` (`--vai`, `/vai`, thanh trạng thái, `/resume`, `-c --vai`) |
| Migration | `20261127150000_ctw_vai_dong` (chỉ ADD cột NULL: `work_history/work_audit_logs/work_comments.acting_role`, `work_review_participants.hat`, `work_test_runs.executed_role`) |

Luật theo vai (chỉ khi dự án bật):
- **notAssignee:** người được giao đang đóng ĐÚNG vai ghi trên thẻ (trường `Role (C1–C5)` của bộ SOLO5, hoặc nhãn C1…C5) ⇒
  `WORK_TRANSITION_SELF` ("you are acting as C3 · BE…"); đóng vai KHÁC ⇒ qua. Thẻ không ghi vai ⇒ chặn kèm gợi ý đặt Role (không
  đoán từ tiêu đề). Không có vai ⇒ chặn như cũ.
- **WORK_REVIEW_SELF:** mỗi người tham gia review có `hat`; dòng của chính người mở phiên không ghi ⇒ lấy vai đang đóng. Tác giả
  được ra quyết định / đóng phiên CHỈ khi đang đóng vai khác MỌI vai tác giả đã ghi; dòng tác giả không ghi vai ⇒ vẫn chặn.
- **Không đổi:** phê duyệt (approval, `WORK_SELF_APPROVER`) vẫn cần người thật thứ hai (giảng viên) — vai không tự duyệt cho nhau;
  làm nguội review 12 h, Done rules, WIP… giữ nguyên.
- **Nhắc nhẹ (không chặn):** lệnh ghi trái vai (test/fpt_unit/fpt_it/UAT/defect ⇒ C5; SRS/SWR/Q&A ⇒ C2 hoặc C1; sprint/RAID/CR/họp/WBS/
  weekly ⇒ C1) ⇒ web hiện toast "Đổi sang C5"; MCP thêm một câu "Role note: …" vào kết quả.

### Hướng dẫn dùng từng bước (cho user)
1. **Bật chế độ.** Dự án tạo từ mẫu "SWP391 · một mình 5 vai" đã bật sẵn. Dự án khác: *Cài đặt › Chi tiết › Chế độ đóng vai (một
   người, năm vai)* → bật (ADMIN). Chỉ cần MỘT tài khoản — của bạn.
2. **Chọn vai trên web.** Thanh tiêu đề dự án có nút "Chọn vai" / "Đang đóng vai C3 · BE" (màu theo vai). Phím tắt **Alt+1…5**,
   **Alt+0** bỏ vai. Vai nhớ theo dự án trên trình duyệt này.
3. **Đặt Role cho thẻ.** Trường *Role (C1–C5)* = vai làm việc đó (vd C3). Code xong ở C3, kéo sang In Review; bấm **Alt+5** rồi
   kéo In Review → Done dưới vai C5 QA. Lịch sử thẻ ghi "(vai C3 · BE)" → "(vai C5 · QA)".
4. **Review.** Mở phiên review với chính bạn là AUTHOR (cột Vai = C3) và REVIEWER (C5) (+ MODERATOR C1). Quyết định / đóng phiên
   khi đang đóng C5 (hoặc C1); đang C3 sẽ bị chặn `WORK_REVIEW_SELF`.
5. **Log giờ.** Ô *Vai (mũ)* để trống ⇒ tự lấy vai đang đóng; Reports › Giờ theo vai chia đúng 5 mũ.
6. **CuongMini CLI 5 phiên.** `/ctwork` một lần (token cá nhân). Mỗi vai một cửa sổ: `cuongmini --vai C1` … `cuongmini --vai C5`
   — phiên tự đặt tên "<tên bạn> · C3 BE" (nếu chưa `/rename`), thanh trạng thái hiện `◆ C3 BE`, mọi lệnh ghi CT Work mang vai C3,
   trợ lý nhận gợi ý theo vai (C5 tập trung test, độc lập với tác giả). Đổi vai giữa chừng: `/vai C4` (không đối số ⇒ menu;
   `/vai off` bỏ). Mai làm tiếp: `/resume` (danh sách hiện "vai C3") hoặc `cuongmini -c --vai C3` (việc gần nhất của đúng phiên C3
   trong thư mục). `/rename` vẫn thắng và nay ghi cả vào nhãn phiên đã lưu.
7. **Nộp/báo cáo.** Project Tracking, Weekly Report, sổ đóng góp, biên bản review tự ghi "Tên SV (role C3 · BE)" và "1 student plays
   all 5 roles" — không bao giờ thành 5 người. Report 2 §3 dùng RACI `honest` như trước.

Test: `npx tsx --test src/services/work/vaiDong.test.ts` (8) · `WORK_DB_TEST=1 npx tsx --test src/routes/work.vaiDong.db.test.ts` (10:
SOLO bật sẵn/chuẩn hoá; vai lạ 400, agent 403 REST + MCP; notAssignee C3 chặn / không vai chặn / C5 qua + lịch sử ghi vai; thẻ không
Role; tắt chế độ ⇒ như cũ; WORK_REVIEW_SELF theo vai + dự án không bật ⇒ như cũ; bình luận/worklog/audit mang vai; nhắc trái vai;
MCP `_meta` + header; bản xuất ghi "(role C3 · BE)") · `(cd desktop && npx vitest run src/main/agent/vaiCtwork.test.ts)` (4) · CLI
`coDong.test.ts` (`--vai`) + `lenhTatCa.test.ts` (`/vai C3|qa|off|C9`, `/rename` ghi nhãn phiên). Không thêm lệnh MCP nào (chỉ
`hat` trong `review_manage`), không thêm trang dưới `app/work` (bộ chọn nằm ở header) ⇒ không đụng `tuyenCtWork.ts`.

Giới hạn có chủ ý: CLI đổi vai cho MỘT tiến trình (lời gọi `/ctwork` qua menu dùng vai cuối của tiến trình); app desktop nhiều tab
dùng chung lõi — vai theo cuộc cho lời gọi của agent, menu `/ctwork` dùng vai đặt sau cùng. Lịch sử của vài đường ghi phụ (đính kèm,
cờ, web link, sprint hàng loạt) chưa mang vai — audit + lịch sử chuyển trạng thái/trường của thẻ đã mang. Biểu đồ Report chưa tách
theo vai ngoài "Giờ theo vai".

## Nghiệm thu ghép (27/11/2026)

Ghép 4 gói trong cây chính, kiểm trên CSDL TEST SẠCH dựng từ migration (`scripts/db-test-tu-migration.mjs`, giống job CI
`work-db-tests`) + Redis cục bộ tạm (CI có service redis; thiếu Redis thì `ctw7c`/`crm.db` treo chờ kết nối lại).

| Lệnh | Kết quả |
|---|---|
| `npx tsc --noEmit` (backend) | sạch |
| `(cd frontend && npx tsc --noEmit)` | sạch |
| `npm test` | 2216/2216 xanh (lượt đầu đỏ `crm.db.test` vì Redis tắt — chạy lại có Redis: 9/9) |
| `npm run test:work-db` (CSDL tạm) | 86/87 tệp xanh lượt đầu; tệp đỏ duy nhất `work.docs.db.test.ts` (đếm mẫu) đã sửa ⇒ 11/11; r2-tripwire 0 kết nối |
| `work.dm5g4.db.test.ts` | 22/22 (ca "D14 qua REST" tự bật sau khi nối issueChange) |
| `work.routes.db.test.ts` | 16/16 trên CSDL sạch — 15 ca đỏ trước đó là dữ liệu sót CSDL dev (slug `-3-3`), không phải lỗi đợt này |
| `work.ctw7c.db.test.ts` | 21/21, ~278 s (chậm do Redis cục bộ tắt + back-off kết nối lại, không do dm5) |
| `(cd frontend && npm run build)` | xanh |
| `next lint` trên 114 tệp frontend của đợt | 0 lỗi mới (1 lỗi có sẵn ở HEAD: `QualityTab.tsx` `Estimation` no-redeclare) |
| `prisma migrate diff` CSDL dev ↔ schema | 0 dòng `work_*` (phần lệch còn lại là lệch cũ ngoài CT Work) |

Đã sửa khi ghép:
- `issueChange.ts`: nối `assertVersionFreeze` (G4 D14) ở `createIssue` và nhánh đổi `fixVersionId` của `applyIssueChange` (có `issueKey`
  cho audit vượt của ADMIN).
- Schema MCP rỗng (`schemaModel.test.ts`): `create_project.groups` và `change_request_manage.impactMatrix` dùng `z.record` — bộ chuyển
  `zodToJsonSchema` không có nhánh ZodRecord ⇒ `{}`. Đổi sang `z.object` khoá cố định (10 nhóm bộ mẫu / 6 chiều ảnh hưởng).
- Test đếm mẫu Docs 50 ⇒ 56 (+6 mẫu SEP490 kit, G2 B23) ở `docs.test.ts` (2 chỗ) và `work.docs.db.test.ts`; mẫu
  `sep490-red-pen-checklist.md` chỉ có 1 đề mục (luật mẫu ≥ 2) ⇒ thêm "## 1. The ten checks" + "## 2. Result and sign-off"
  (cả `frontend/public` và `content/` — test đòi hai bản giống hệt).
- `SelfGrades.tsx`: phụ thuộc `useMemo` đổi mỗi lần render (cảnh báo exhaustive-deps).
- `work.ctw4.db.test.ts` (sheet `NFR`) và `work.dm5b.db.test.ts:186` đã được gói G2 sửa trước khi ghép — kiểm lại xanh.

Commit: danh sách tệp ở `scratchpad/ctw-dm5-tep-commit.txt` của phiên điều phối; `frontend/src/components/work/Board.tsx` đi bằng patch
riêng (chỉ hunk huy hiệu tuổi thẻ A18; hunk `boardCollision` là của phiên khác).

**PlantUML (B18) — KHÔNG sửa compose.** `deploy-nha.sh` chỉ `docker compose up -d --no-build --remove-orphans backend frontend`, và
`docker-compose.yml` trên VPS (`/home/deployer/repo`) không được script đồng bộ (chỉ `nginx.conf`) ⇒ thêm service vào compose của repo
không tới VPS và không tự chạy. Mặc định URL nội bộ khi env trống cũng sai: backend sẽ gọi một host không tồn tại thay vì báo 503 sạch.
Việc tay (một lần, khi muốn bật vẽ SVG — không gửi sơ đồ ra máy ngoài):
1. VPS: `docker run -d --name cuonghoangdev_plantuml --restart unless-stopped --network cuonghoangdev_backend --memory 384m
   --memory-swap 384m -e JAVA_OPTS="-Xmx256m" plantuml/plantuml-server:jetty` (KHÔNG `-p`, chỉ mạng nội bộ; container ngoài compose
   nên `--remove-orphans` không xoá nó).
2. Thêm `PLANTUML_SERVER_URL=http://cuonghoangdev_plantuml:8080` vào `/opt/cuonghoangdev/.env` (backend nhận qua `env_file`).
3. Tạo lại backend có nạp env (`docker compose -p cuonghoangdev up -d --no-build backend`) hoặc chờ lần deploy sau.
4. Kiểm: `docker exec cuonghoangdev_backend curl -s -o /dev/null -w '%{http_code}' http://cuonghoangdev_plantuml:8080/` ⇒ 200;
   Diagrams › sơ đồ PlantUML hiện SVG. Chưa làm ⇒ nguồn vẫn lưu/nhập/vào Report, xem trước báo 503.
