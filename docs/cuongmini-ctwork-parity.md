# CuongMini ↔ CT Work — đối chiếu quyền (parity) với người dùng

Cập nhật 21/10/2026 (nhánh `ctw-mcp-full`). Bảng đầy đủ mọi tuyến GHI ở cuối file được sinh từ router thật
(`work.routes.ts` + các router con) đối chiếu với registry lệnh (`src/services/work/toolRegistry/*`, `src/mcp/tools/*`).

## 1. CuongMini đăng nhập CT Work bằng gì?

- App CuongMini (desktop · CLI · VS Code — cùng lõi `desktop/src/main/agent`) nối CT Work bằng **token cá nhân của chính
  người dùng**: `/ctwork` dùng phiên đăng nhập (JWT) gọi `POST /api/v1/work/me/api-tokens` với scope `read` hoặc
  `read`+`write` (`desktop/src/main/agent/ctworkKetNoi.ts`), cất vào Keychain/file 0600, và server MCP `ctwork`
  (`/api/v1/work/mcp`) nhận `Authorization: Bearer ctw_…`.
- Token đó KHÔNG gắn agent ⇒ `xacThucTokenCtw` không đặt `req.agent`, `McpCtx.agent = null`. CuongMini hành động
  **là người dùng**, đúng vai (ADMIN/MEMBER/…) của họ trong dự án; `AGENT_DENIED_ACTIONS` / `AGENT_DENIED_ROUTES`
  **không áp** cho nó. Rào agent chỉ áp cho token `ctw_` có scope `agent` (agent thành viên `kind = AGENT`) và agent
  dựng sẵn (BUILTIN).
- Mọi lệnh GHI qua app đều hiện **thẻ duyệt có xem trước** (`loop.ts` — `luonHoi`), trừ khi người dùng bật
  `/ctwork tu-ghi on`.

**Vì sao CuongMini báo "CT Work chưa cho mình cách điền Executed By hoặc xoá các dòng đó"?** Không phải do quyền —
token là của chủ dự án. Đơn giản là **không có lệnh**: nhóm `fpt_unit_*` chỉ có list/get/create/add_cases/mark/
record_results/suggest. Tuyến REST `PATCH /fpt-tests/unit/:fid` (Executed By, LOC…) và việc xoá dòng/UTCID (ghi lại
ma trận bằng `PUT …/matrix`) chỉ có trên web. Thêm vào đó luật prompt `LUAT_DAN_DUONG` dặn "KHÔNG BAO GIỜ thay người:
… xoá …" ⇒ model không dám đề nghị xoá. Cả hai đã sửa.

## 2. Mô hình sau đợt này

| Ai cầm token | Làm được gì | Rào |
|---|---|---|
| **Người** (CuongMini, Claude Code, Cursor… với token cá nhân) | Mọi việc vai của người đó làm được trên web, kể cả sửa/xoá | Lệnh xoá khai `destructive` ⇒ MCP `annotations.destructiveHint: true` ⇒ app CuongMini **luôn hỏi** (kể cả `tu-ghi on` / "Bỏ qua hết"), thẻ duyệt mở đầu `⚠ XOÁ ·`. Mô tả lệnh bắt đầu bằng `DESTRUCTIVE:`. Thẻ và trang Docs vào thùng rác, khôi phục được (`issue_restore`, `docs_page_restore`). |
| **Agent thành viên** (`kind = AGENT`, scope `agent`) | Như trước: làm thẻ của mình, ghi kết quả test, bình luận… | Lệnh xoá `personOnly` (không có trong `tools/list`) + `requirePerson` (gọi thẳng ⇒ `WORK_AGENT_FORBIDDEN`) + `AGENT_DENIED_ROUTES` thêm `DELETE` của sheet test 5.1/5.2/5.3 + Record of change, trang Docs, RAID, họp, Q&A, sơ đồ, test cycle, Resources, mục SRS (REST cũng 403). |
| **Ask AI trên web / agent BUILTIN** | Như trước | 57 lệnh mới của đợt này chỉ ở MCP (`mcpOnly`): mục lục lệnh GHI của Ask AI đã ~17k ký tự/câu hỏi, web có nút riêng — không thêm tiền prompt ở đó. |

### Chỉ người (cố ý KHÔNG có lệnh, kể cả với token người)

| Việc | Vì sao |
|---|---|
| Quyết định duyệt (`/approvals/:id/decide`, CR approval, đề xuất elicitation/intake, biên bản AI apply/dismiss, review mockup), đặt trang Docs = `APPROVED`, duyệt use case / business rule (`status` không có trong `srs_*_update`, `docs_page_update` chỉ nhận DRAFT/IN_REVIEW/ARCHIVED) | Phê duyệt là chữ ký của một người cụ thể; AI duyệt thay là giả mạo người duyệt. CuongMini vẫn **gửi** duyệt được (`approval_request`, `request_review`). |
| Tài chính (`/finance/**` trừ nộp timesheet của chính mình), tài sản/giấy phép | Tiền và hợp đồng. |
| Mọi thứ hướng khách/ra ngoài: cổng khách, share link, `client-visible`, gửi báo cáo khách, mời họp ra ngoài, mở link khảo sát/form công khai, Slack/Notion/OneDrive/webhook/chat-hooks, xuất dữ liệu | Không lấy lại được khi đã gửi ra ngoài. |
| Cấu hình & thành viên dự án (workflow, trạng thái, loại thẻ, nhãn, trường tuỳ chỉnh, studio/mô-đun, GitHub/GitLab connection, automation), xoá/lưu trữ dự án hay không gian, xoá vĩnh viễn khỏi thùng rác | Ảnh hưởng cả nhóm, khó hoàn tác. (Thêm/đổi vai/bớt thành viên và sprint đã có lệnh `personOnly` từ 19/10.) |
| Làm quiz, điểm danh check-in, chấm điểm / trả bài / sổ điểm lớp học | Liêm chính học thuật; quyết định của giảng viên. |
| Ghi âm/tham gia họp trực tiếp, báo cáo nội dung cho kiểm duyệt | Cần người có mặt / là việc của người. |

Nếu sau này cần mở thêm một việc ở bảng này, làm theo kiểu lệnh xoá: `destructive: true` (app luôn hỏi) + `personOnly`.

## 3. Bảng ưu tiên — việc sinh viên/nhóm làm hằng ngày

✅ có lệnh · 🆕 thêm trong đợt này · 👤 chỉ người · — còn thiếu

| Việc của người dùng | Tuyến REST | Lệnh MCP |
|---|---|---|
| **Report 5.1** — đầu sheet: Executed By, Created By, LOC, mô tả, pre-condition, test requirement, codeRef, tên, vị trí | `PATCH /fpt-tests/unit/:fid` | 🆕 `fpt_unit_update_function` |
| 5.1 — thêm dòng/UTCID, đánh "O", ghi P/F + ngày + defect | `PUT …/unit/:fid/matrix` | ✅ `fpt_unit_add_cases`, `fpt_unit_mark`, `fpt_unit_record_results` (🆕 đổi loại N/A/B, `result` tuỳ chọn) |
| 5.1 — sửa dòng (group/label/value) | `PUT …/matrix` | 🆕 `fpt_unit_update_rows` |
| 5.1 — xoá dòng (kể cả dòng không case nào đánh = `unused`) / xoá UTCID (kể cả case chưa chạy = `notRun`) | `PUT …/matrix` | 🆕 `fpt_unit_delete_rows`, `fpt_unit_delete_cases` (destructive) |
| 5.1 — sắp xếp dòng/UTCID, nhân bản hàm, xoá hàm | `PUT …/matrix`, `POST …/duplicate`, `DELETE …/unit/:fid` | 🆕 `fpt_unit_move`, `fpt_unit_duplicate_function`, `fpt_unit_delete_function` |
| Bìa báo cáo test (creator, reviewer, version, ngày phát hành, môi trường, chuẩn TC/KLOC) + Record of change | `GET/PUT /fpt-tests/doc`, `/fpt-tests/changes` | 🆕 `fpt_doc_get`, `fpt_doc_update`, `fpt_change_add/update/delete` |
| **Report 5.2/5.3** — sửa đầu module/workflow | `PATCH /fpt-tests/(integration\|system)/:mid` | 🆕 `fpt_it_update_module` |
| 5.2/5.3 — sửa case (procedure, data, expected, actual, evidence…), xoá kết quả một vòng | `PUT …/cases` | 🆕 `fpt_it_update_cases` |
| 5.2/5.3 — xoá case (kể cả chưa chạy), dời case, xoá module | `PUT …/cases`, `DELETE …/:mid` | 🆕 `fpt_it_delete_cases`, `fpt_it_move_case`, `fpt_it_delete_module` |
| 5.x — nhập Excel | `POST /fpt-tests/import` | — (tải tệp .xlsx; web) |
| **Thẻ** — tạo/sửa mọi trường, chuyển trạng thái, giao, sprint, liên kết, cờ, theo dõi, web link, checklist | `POST/PATCH /issues…` | ✅ `create_issue`, `update_issue`, `transition`, `issue_assign`, `issue_move_sprint`, `issue_link/unlink`, `issue_flag`, `issue_watch`, `issue_web_link_add`, `checklist_toggle` |
| Thẻ — xoá (vào thùng rác) / khôi phục / nhân bản | `DELETE /issues/:num`, `POST /trash/:num/restore`, `POST …/clone` | 🆕 `issue_delete`, `issue_restore`, `issue_clone` |
| Thẻ — trường tuỳ chỉnh | `PUT …/custom-values` | 🆕 `issue_custom_fields_set` |
| Thẻ — gỡ web link | `DELETE …/web-links/:lid` | 🆕 `issue_web_link_remove` |
| Thẻ con (subtask) | `POST /issues` (type SUBTASK + parent) | ✅ `create_issue` |
| Bình luận — thêm / trả lời / sửa / xoá | `POST/PATCH/DELETE …/comments` | ✅ `comment` · 🆕 `comment_edit`, `comment_delete` |
| Tệp đính kèm — thêm (tệp máy, link, Google Doc) / xoá | `…/attachments/*`, `DELETE /attachments/:aid` | ✅ `attach_file`, `attach_from_url` · 🆕 `attachment_delete` |
| Worklog — ghi / sửa / xoá | `…/worklogs` | ✅ `log_work`, `worklog_update` · 🆕 `worklog_delete` |
| **Sprint** — tạo / bắt đầu / kết thúc / sửa / xoá | `/sprints…` | ✅ `sprint_create/start/complete` · 🆕 `sprint_update`, `sprint_delete` (người có `sprint.manage`) |
| **Xray** — test case tạo / sửa (bước, yêu cầu) | `POST /tests`, `PUT /tests/:num` | ✅ `test_create` · 🆕 `test_update` |
| Xray — cycle tạo / sửa (thêm test, bỏ run, trạng thái) / xoá; ghi run; bug từ run | `/test-cycles…`, `/test-runs…` | ✅ `test_cycle_create`, `test_run_record` · 🆕 `test_cycle_update`, `test_cycle_delete`, `test_run_defect` |
| **Docs** — tạo nháp / sửa một mục | `POST /pages`, `PATCH /pages/:num` | ✅ `docs_draft_page`, `docs_update_section` |
| Docs — đổi tiêu đề, thay trọn nội dung Markdown, trạng thái (trừ APPROVED) | `PATCH /pages/:num` | 🆕 `docs_page_update` |
| Docs — dời trong cây / xoá (thùng rác) / khôi phục / khôi phục phiên bản / liên kết thẻ | `…/move`, `DELETE`, `/trash/pages/:num/restore`, `…/versions/:n/restore`, `…/issues` | 🆕 `docs_page_move`, `docs_page_delete`, `docs_page_restore`, `docs_page_version_restore`, `docs_page_link_issue` |
| Docs — bình luận | `POST …/comments` | ✅ `docs_comment` |
| **SRS (Report 3)** — thêm actor/UC/BR/màn hình/chức năng, phân quyền màn | `/srs/*` POST | ✅ `srs_add_actor`, `srs_propose_use_case`, `srs_propose_business_rule`, `srs_add_screen`, `srs_set_screen_access`, `srs_add_non_ui_function` |
| SRS — sửa / xoá từng mục | `PATCH/DELETE /srs/(actors\|use-cases\|rules\|screens\|functions)/…` | 🆕 `srs_actor_update`, `srs_use_case_update`, `srs_rule_update`, `srs_screen_update`, `srs_function_update`, `srs_delete` |
| SWR302 — feature, yêu cầu, ưu tiên, glossary, dictionary, stakeholder, elicitation, khảo sát, NFR, mockup | `/swr/*` | ✅ 16 lệnh `swr_*` (thêm/sửa) — xoá từng mục SWR: — |
| **RTM / trace link** — thêm | `POST /trace-links` | ✅ `trace_link_add` — gỡ: — (cần lệnh liệt kê id) |
| **Họp** — tạo / sửa (giờ, trạng thái, agenda, biên bản, quyết định) / xoá; action item; RSVP; transcript + đề xuất biên bản | `/meetings…` | 🆕 `meeting_create`, `meeting_update`, `meeting_delete` · ✅ `meeting_add_actions`, `meeting_create_issues`, `meeting_rsvp`, `meeting_transcript_get`, `meeting_minutes_propose` |
| **RAID** — tạo / sửa / xoá | `/raid…` | ✅ `raid_create`, `raid_update` · 🆕 `raid_delete` |
| **Q&A** — hỏi / trả lời / sửa / xoá | `/qna…` | ✅ `qna_ask`, `qna_answer` · 🆕 `qna_update`, `qna_delete` |
| **Sơ đồ** — sinh / sửa / từ SQL / điền báo cáo / xoá | `/diagrams…` | ✅ `diagram_generate`, `diagram_update`, `diagram_sql_create`, `diagram_fill_report` · 🆕 `diagram_delete` |
| **Chat** — đọc / gửi / sửa / xoá tin | `/chat/channels/:cid/messages…` | ✅ `chat_read`, `chat_post` · 🆕 `chat_edit`, `chat_delete` |
| **Resources** — đọc / thêm / sửa / xoá link | `/resources…` | ✅ `project_resources` · 🆕 `resource_add`, `resource_update`, `resource_delete` |
| **Mã nguồn** — repo của dự án để clone | GitHub/GitLab connection + Resources | 🆕 `project_repos` (URL clone HTTPS/SSH + nhánh mặc định) |
| Form — điền | `POST /forms/:token/responses` | ✅ `form_submit` |
| Lớp học — nộp / rút bài | `/classes/:id/assignments/:aid/my…` | ✅ `class_submit`, `class_unsubmit` |
| Poker / retro — bỏ phiếu, thêm thẻ | `/poker…`, `/retros…` | ✅ `poker_vote`, `retro_card_add`, `retro_vote` (điều phối phiên: —) |
| Timesheet tuần — nộp | `POST /finance/timesheets/submit` | ✅ `timesheet_submit` |
| Duyệt — gửi duyệt | `POST /approvals` | ✅ `approval_request`, `request_review` · quyết định: 👤 |
| Cài đặt dự án — đọc | `GET /projects/:pid` | ✅ qua `get_issue` (workflow, transitions, DoD), `whoami`, `list_projects`, tài nguyên `ctwork://{project}/dod` |

## 4. Repo chưa có trên máy

`project_repos` trả các repo của dự án (kết nối GitHub/GitLab trên trang Code + link github/gitlab/bitbucket trong
Resources) kèm `cloneHttps`, `cloneSsh`, `defaultBranch` (GitHub API công khai, có bộ đệm). Luật prompt
(`LUAT_CTWORK` — "MÃ NGUỒN") + chủ đề `git-ctwork` của `ctwork_huong_dan` + hướng dẫn server MCP bảo agent: thư mục đang
mở không phải repo của dự án (`git remote -v`) ⇒ gọi `project_repos` rồi **đề nghị `git clone`**, đừng nói "không tìm
thấy code". CLI/app chạy được git sẵn — không cần sửa app cho phần này.

## 5. Còn thiếu (chưa làm, theo thứ tự đáng làm)

1. SWR302: xoá từng mục (feature, glossary, dictionary, stakeholder, elicitation, survey, NFR, mockup, nguồn yêu cầu) +
   sửa hàng ưu tiên/khảo sát/mockup/NFR/requirement (`PUT /swr/requirements/:num`).
2. Gỡ trace link (cần một lệnh liệt kê trace link kèm id).
3. Change Request (`/changes`): tạo/sửa/liên kết — hiện chỉ web.
4. Chat: tạo kênh, thành viên kênh, ghim, react, chuyển tin thành thẻ, nhắn riêng.
5. Bình luận: react; ghi chú cá nhân (Notes ↔ thẻ); chuyển thẻ sang dự án khác; sửa hàng loạt.
6. Docs: inline comment + resolve, xoá bình luận trang, autofill/fill-srs (AI của web).
7. Họp: danh sách người tham dự, agenda-items, nhân bản họp, áp mẫu.
8. Xray: test plan, test design, exploratory session, nhập test hàng loạt; 5.x nhập Excel.
9. Poker/retro: điều phối phiên (tạo, reveal, finalize); review (`/reviews`); dashboards; WBS; versions/release.
10. Lớp học phía giảng viên (bài tập, tài liệu, chủ đề, buổi học, stream) — phía sinh viên ngoài nộp bài (bình luận stream…).

## 6. Số liệu

- Lệnh registry: **167 ⇒ 224** (+57; 20 lệnh `destructive`). MCP: token người thấy 215 lệnh, token agent 190 (lệnh xoá
  và quản trị là `personOnly`).
- Tuyến GHI của CT Work (router thật, 21/10/2026): **731**. Có lệnh: **144** · cố ý chỉ người (👤): **307** · còn thiếu:
  **280** — phần lớn là lớp học phía giảng viên, SWR302 xoá/sửa từng mục, chat nâng cao, điều phối poker/retro, review,
  CR, test plan/design, dashboard (xem mục 5).
- Cách sinh lại bảng dưới: liệt kê router bằng cách duyệt `router.stack` của `work.routes.ts`, khớp với các cặp
  `[METHOD, path]` mà mỗi lệnh truyền cho `projectFor` (+ bảng đối chiếu tay cho lệnh dùng đường động), phân loại 👤 theo
  danh sách ở mục 2.

## Phụ lục — mọi tuyến GHI (✅ có lệnh · 👤 chỉ người · — thiếu)

### :host(github|gitlab) — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/:host(github\|gitlab)/read-token` | 👤 | finance / client / external integration or export |
| PUT | `/projects/:pid/:host(github\|gitlab)/activity` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/:host(github\|gitlab)/test` | 👤 | finance / client / external integration or export |

### (outside project) /agents — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/agents/me/leases/:id/heartbeat` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/agents/me/leases/:id/release` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/agents/me/events/ack` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /chat — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/chat/prefs` | — |  |

### (outside project) /classes — 4 tool · 14 chỉ người · 48 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/classes` | — |  |
| POST | `/classes/join/:code` | — |  |
| PATCH | `/classes/:id` | — |  |
| POST | `/classes/:id/join-code` | — |  |
| POST | `/classes/:id/roster/preview` | — |  |
| POST | `/classes/:id/roster/import` | — |  |
| POST | `/classes/:id/roster/invite` | — |  |
| DELETE | `/classes/:id/roster/:sid` | — |  |
| PATCH | `/classes/:id/classroom-settings` | — |  |
| POST | `/classes/:id/stream` | — |  |
| PATCH | `/classes/:id/stream/:pid` | — |  |
| DELETE | `/classes/:id/stream/:pid` | — |  |
| POST | `/classes/:id/stream/:pid/comments` | — |  |
| PATCH | `/classes/:id/stream-comments/:cid` | — |  |
| DELETE | `/classes/:id/stream-comments/:cid` | — |  |
| POST | `/classes/:id/stream-files` | — |  |
| DELETE | `/classes/:id/stream-files/:fid` | — |  |
| POST | `/classes/:id/materials` | — |  |
| PUT | `/classes/:id/materials-order` | — |  |
| PATCH | `/classes/:id/materials/:mid` | — |  |
| DELETE | `/classes/:id/materials/:mid` | — |  |
| POST | `/classes/:id/materials/:mid/view` | — |  |
| POST | `/classes/:id/topics` | — |  |
| PUT | `/classes/:id/topics-order` | — |  |
| PATCH | `/classes/:id/topics/:tid` | — |  |
| DELETE | `/classes/:id/topics/:tid` | — |  |
| POST | `/classes/:id/schedules` | — |  |
| DELETE | `/classes/:id/schedules/:sid` | — |  |
| POST | `/classes/:id/sessions` | — |  |
| PATCH | `/classes/:id/sessions/:sid` | — |  |
| DELETE | `/classes/:id/sessions/:sid` | — |  |
| POST | `/classes/:id/sessions/:sid/checkin` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| DELETE | `/classes/:id/sessions/:sid/checkin` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| PUT | `/classes/:id/sessions/:sid/attendance` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/checkin` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| POST | `/classes/:id/assignments` | — |  |
| PATCH | `/classes/:id/assignments/:aid` | — |  |
| DELETE | `/classes/:id/assignments/:aid` | — |  |
| POST | `/classes/:id/assignments/:aid/files` | — |  |
| DELETE | `/classes/:id/assignments/:aid/files/:fid` | — |  |
| PUT | `/classes/:id/assignments/:aid/my` | ✅ | class_submit |
| POST | `/classes/:id/assignments/:aid/my/files` | ✅ | class_submit |
| DELETE | `/classes/:id/assignments/:aid/my/files/:fid` | — |  |
| POST | `/classes/:id/assignments/:aid/my/turn-in` | ✅ | class_submit |
| POST | `/classes/:id/assignments/:aid/my/unsubmit` | ✅ | class_unsubmit |
| PUT | `/classes/:id/assignments/:aid/grade` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/assignments/:aid/return` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/submission-comments` | — |  |
| PUT | `/classes/:id/gradebook/settings` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/gradebook/import/preview` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/gradebook/import` | 👤 | grading / attendance decision (lecturer) |
| POST | `/classes/:id/quiz-bank` | — |  |
| PATCH | `/classes/:id/quiz-bank/:qid` | — |  |
| DELETE | `/classes/:id/quiz-bank/:qid` | — |  |
| POST | `/classes/:id/quiz-bank/image` | — |  |
| POST | `/classes/:id/quiz-bank/import` | — |  |
| POST | `/classes/:id/quiz-bank/ai-suggest` | — |  |
| POST | `/classes/:id/quizzes` | — |  |
| PATCH | `/classes/:id/quizzes/:quizId` | — |  |
| DELETE | `/classes/:id/quizzes/:quizId` | — |  |
| POST | `/classes/:id/quizzes/:quizId/publish` | — |  |
| POST | `/classes/:id/quizzes/:quizId/attempts` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| PUT | `/classes/:id/quizzes/:quizId/attempts/:aid/answers` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| POST | `/classes/:id/quizzes/:quizId/attempts/:aid/submit` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| POST | `/classes/:id/quizzes/:quizId/attempts/:aid/focus` | 👤 | academic integrity (taking a quiz / attendance check-in) |
| PATCH | `/classes/:id/quizzes/:quizId/attempts/:aid/grade` | 👤 | academic integrity (taking a quiz / attendance check-in) |

### (outside project) /forms — 1 tool · 0 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/forms/:token/responses` | ✅ | form_submit |

### (outside project) /github — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/github/webhook/:pid` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /gitlab — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/gitlab/webhook/:pid` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /help — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/help/ask` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /intake — 0 tool · 4 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/intake/email/:token` | 👤 | inbound webhook (not a user action) |
| POST | `/intake/discord/:token` | 👤 | inbound webhook (not a user action) |
| POST | `/intake/zalo/:token` | 👤 | inbound webhook (not a user action) |
| POST | `/intake/slack/commands` | 👤 | inbound webhook (not a user action) |
| POST | `/intake/slack/events` | — |  |

### (outside project) /integrations — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| DELETE | `/integrations/:provider` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/integrations/:provider/calendar` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/integrations/:provider/sync` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /invites — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/invites/:token/accept` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /me — 0 tool · 11 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/me/notify-settings` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/trash/workspaces/:wsId/restore` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/api-tokens` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/me/api-tokens/:tokenId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/calendar-link` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/me/calendar-link` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/me/timer` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/timer/pause` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/timer/resume` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/timer/stop` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/me/timer/discard` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /notion — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/notion/search` | — |  |

### (outside project) /okrs — 0 tool · 8 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/okrs/objectives/:oid` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/okrs/objectives/:oid` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/okrs/objectives/:oid/key-results` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/okrs/objectives/:oid/score` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/okrs/key-results/:kid` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/okrs/key-results/:kid` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/okrs/key-results/:kid/links` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/okrs/key-results/:kid/checkins` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /projects — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/projects/:pid` | 👤 | project settings / delete |
| DELETE | `/projects/:pid` | 👤 | project settings / delete |

### (outside project) /public — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/public/surveys/:token/responses` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/public/mockup-review/:token/decision` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/public/forms/:token/responses` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /report — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/report` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /setup-drafts — 0 tool · 11 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/setup-drafts/:id` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/setup-drafts/:id` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/files` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/links` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/setup-drafts/:id/sources/:sid` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/understand` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/accept` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/revise` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/rebalance` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/apply` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/setup-drafts/:id/cancel` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /teaching — 0 tool · 4 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/teaching/ai-summary` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/teaching/rubrics` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/teaching/rubrics/:id` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/teaching/rubrics/:id` | 👤 | workspace admin / account / setup (outside a project) |

### (outside project) /workspaces — 0 tool · 50 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/workspaces` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wsId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/logo/presign` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/logo/complete` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/logo` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wsId/members/:userId` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/members/:userId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/transfer` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/invites` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/invite-links` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/invites/:inviteId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/projects` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/time-off` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/time-off/:offId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/trash/projects/:pid/restore` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/teams` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wsId/teams/:teamId` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/teams/:teamId` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/workspaces/:wsId/teams/:teamId/members/:userId` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/teams/:teamId/members/:userId` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/workspaces/:wsId/teams/:teamId/queue/:issueId/assignee` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/imports` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/imports/:id/start` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/imports/:id` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/convert` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wsId/agents/:agentId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/pause` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/resume` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/retire` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/tokens` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/agents/:agentId/tokens/:tokenId` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/webhooks` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wsId/agents/:agentId/webhooks/:hid` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsId/agents/:agentId/webhooks/:hid` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/agents/:agentId/webhooks/:hid/test` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/workspaces/:wsId/builtin-budget` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/logo/upload` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wid/okr-cycles` | 👤 | workspace admin / account / setup (outside a project) |
| PATCH | `/workspaces/:wid/okr-cycles/:cid` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wid/okr-cycles/:cid` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wid/okrs/objectives` | 👤 | workspace admin / account / setup (outside a project) |
| PUT | `/workspaces/:wsId/security` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/security/remind` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsid/slack/link` | 👤 | workspace admin / account / setup (outside a project) |
| DELETE | `/workspaces/:wsid/slack` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/setup/unlock` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/setup/roster` | 👤 | workspace admin / account / setup (outside a project) |
| POST | `/workspaces/:wsId/setup-drafts` | 👤 | workspace admin / account / setup (outside a project) |

### agent-runs — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/agent-runs/:runId/cancel` | 👤 | web AI assistant (CuongMini is itself the AI) |

### agent-settings — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/agent-settings` | 👤 | project configuration / membership |

### agent-usage — 1 tool · 0 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/agent-usage` | ✅ | report_usage |

### ai — 0 tool · 16 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/ai/chat` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/chat/stream` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/quick` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/defense` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/threads` | 👤 | web AI assistant (CuongMini is itself the AI) |
| PATCH | `/projects/:pid/ai/threads/:tid` | 👤 | web AI assistant (CuongMini is itself the AI) |
| DELETE | `/projects/:pid/ai/threads/:tid` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/messages/:mid/retry` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/messages/:mid/actions/:idx/apply` | 👤 | web AI assistant (CuongMini is itself the AI) |
| PATCH | `/projects/:pid/ai/messages/:mid/actions/:idx` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/filter` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/apply` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/weekly-report` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/plan-sprint` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/retro` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/ai/daily-brief` | 👤 | web AI assistant (CuongMini is itself the AI) |

### approvals — 1 tool · 1 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/approvals` | ✅ | request_review, approval_request |
| POST | `/projects/:pid/approvals/:aid/decide` | 👤 | approval decision |
| POST | `/projects/:pid/approvals/:aid/cancel` | — |  |

### archive — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/archive` | 👤 | project configuration / membership |

### assets — 0 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/assets` | — |  |
| PATCH | `/projects/:pid/assets/:num` | — |  |
| DELETE | `/projects/:pid/assets/:num` | — |  |
| PUT | `/projects/:pid/assets/:num/links` | — |  |

### attachments — 1 tool · 1 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| DELETE | `/projects/:pid/attachments/:aid` | ✅ | attachment_delete |
| PATCH | `/projects/:pid/attachments/:aid/client` | 👤 | client-facing |
| POST | `/projects/:pid/attachments/:aid/transcribe` | — |  |

### automation — 0 tool · 9 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/automation` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/automation/:ruleId` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/automation/:ruleId` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/automation/:ruleId/test` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/automation/recurring/preview` | 👤 | finance / client / external integration or export |
| PUT | `/projects/:pid/automation/recurring/timezone` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/automation/recurring` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/automation/recurring/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/automation/recurring/:id` | 👤 | finance / client / external integration or export |

### avatar — 0 tool · 4 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/avatar/presign` | 👤 | project configuration / membership |
| POST | `/projects/:pid/avatar/complete` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/avatar` | 👤 | project configuration / membership |
| POST | `/projects/:pid/avatar/upload` | 👤 | project configuration / membership |

### baselines — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/baselines` | 👤 | project configuration / membership |
| POST | `/projects/:pid/baselines/:num/request-signoff` | 👤 | project configuration / membership |
| POST | `/projects/:pid/baselines/:num/sign` | 👤 | project configuration / membership |

### board-columns — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/board-columns` | 👤 | project configuration / membership |

### capacity — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/capacity/:userId` | 👤 | project configuration / membership |

### changes — 0 tool · 2 chỉ người · 8 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/changes` | — |  |
| PATCH | `/projects/:pid/changes/:num` | — |  |
| DELETE | `/projects/:pid/changes/:num` | — |  |
| POST | `/projects/:pid/changes/:num/status` | — |  |
| PUT | `/projects/:pid/changes/:num/client-visible` | 👤 | client-facing |
| POST | `/projects/:pid/changes/:num/approval` | 👤 | decision / approval |
| POST | `/projects/:pid/changes/:num/links` | — |  |
| DELETE | `/projects/:pid/changes/:num/links/:linkId` | — |  |
| POST | `/projects/:pid/changes/:num/implement` | — |  |
| PUT | `/projects/:pid/changes/:num/affected` | — |  |

### chat — 3 tool · 1 chỉ người · 16 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/chat/channels` | — |  |
| PATCH | `/projects/:pid/chat/channels/:cid` | — |  |
| PUT | `/projects/:pid/chat/channels/:cid/members` | — |  |
| PUT | `/projects/:pid/chat/channels/:cid/notify` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/read` | — |  |
| POST | `/projects/:pid/chat/read-all` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/call` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/messages` | ✅ | chat_post |
| PATCH | `/projects/:pid/chat/channels/:cid/messages/:mid` | ✅ | chat_edit |
| DELETE | `/projects/:pid/chat/channels/:cid/messages/:mid` | ✅ | chat_delete |
| PUT | `/projects/:pid/chat/channels/:cid/messages/:mid/reactions/:emoji` | — |  |
| PUT | `/projects/:pid/chat/channels/:cid/messages/:mid/pin` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/messages/:mid/issue` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/messages/:mid/forward` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/files` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/voice` | — |  |
| DELETE | `/projects/:pid/chat/files/:fid` | — |  |
| POST | `/projects/:pid/chat/files/:fid/transcribe` | — |  |
| POST | `/projects/:pid/chat/channels/:cid/messages/:mid/report` | 👤 | content report to moderators |
| POST | `/projects/:pid/chat/dm` | — |  |

### chat-hooks — 0 tool · 4 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/chat-hooks` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/chat-hooks/:hid` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/chat-hooks/:hid` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/chat-hooks/:hid/test` | 👤 | finance / client / external integration or export |

### cloud — 0 tool · 6 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/cloud/issues/:num/files` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/cloud/issues/:num/files/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/cloud/meetings/:num/online` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/cloud/sheets` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/cloud/sheets/:id/sync` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/cloud/sheets/:id` | 👤 | finance / client / external integration or export |

### comment-files — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| DELETE | `/projects/:pid/comment-files/:aid` | — |  |

### components — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/components` | 👤 | project configuration / membership |
| PATCH | `/projects/:pid/components/:cid` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/components/:cid` | 👤 | project configuration / membership |

### contrib — 0 tool · 0 chỉ người · 6 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/contrib/settings` | — |  |
| PUT | `/projects/:pid/contrib/git-authors` | — |  |
| POST | `/projects/:pid/contrib/peer/rounds` | — |  |
| PATCH | `/projects/:pid/contrib/peer/rounds/:rid` | — |  |
| DELETE | `/projects/:pid/contrib/peer/rounds/:rid` | — |  |
| PUT | `/projects/:pid/contrib/peer/rounds/:rid/reviews/:uid` | — |  |

### cover — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/cover` | 👤 | project configuration / membership |
| POST | `/projects/:pid/cover/upload` | 👤 | project configuration / membership |

### cuongmini-team — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/cuongmini-team` | 👤 | project configuration / membership |
| POST | `/projects/:pid/cuongmini-team/gia-han/:id` | 👤 | project configuration / membership |

### custom-fields — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/custom-fields` | 👤 | project configuration / membership |
| PATCH | `/projects/:pid/custom-fields/:fieldId` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/custom-fields/:fieldId` | 👤 | project configuration / membership |

### dashboards — 0 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/dashboards` | — |  |
| DELETE | `/projects/:pid/dashboards/:dashId` | — |  |
| POST | `/projects/:pid/dashboards/overview` | — |  |

### desk — 0 tool · 1 chỉ người · 7 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/desk/settings` | 👤 | project configuration / membership |
| POST | `/projects/:pid/desk/tickets` | — |  |
| POST | `/projects/:pid/desk/problems` | — |  |
| PATCH | `/projects/:pid/desk/problems/:num` | — |  |
| DELETE | `/projects/:pid/desk/problems/:num` | — |  |
| POST | `/projects/:pid/desk/problems/:num/incidents` | — |  |
| DELETE | `/projects/:pid/desk/problems/:num/incidents/:inum` | — |  |
| POST | `/projects/:pid/desk/problems/:num/postmortem` | — |  |

### diagram-renders — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/diagram-renders` | — |  |

### diagrams — 5 tool · 0 chỉ người · 8 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/diagrams` | ✅ | diagram_sql_create |
| POST | `/projects/:pid/diagrams/generate` | ✅ | diagram_generate |
| POST | `/projects/:pid/diagrams/import` | — |  |
| POST | `/projects/:pid/diagrams/fill-report` | ✅ | diagram_fill_report |
| PATCH | `/projects/:pid/diagrams/:n` | ✅ | diagram_update |
| DELETE | `/projects/:pid/diagrams/:n` | ✅ | diagram_delete |
| POST | `/projects/:pid/diagrams/:n/versions/:v/restore` | — |  |
| POST | `/projects/:pid/diagrams/:n/versions/:v/:action(accept\|discard)` | — |  |
| POST | `/projects/:pid/diagrams/:n/:action(approve\|unapprove)` | — |  |
| POST | `/projects/:pid/diagrams/:n/embed` | — |  |
| POST | `/projects/:pid/diagrams/:n/comments` | — |  |
| PATCH | `/projects/:pid/diagrams/:n/comments/:cid` | — |  |
| DELETE | `/projects/:pid/diagrams/:n/comments/:cid` | — |  |

### docs — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/docs/collab` | — |  |

### edit-lock — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/edit-lock` | 👤 | project configuration / membership |

### exploratory — 0 tool · 0 chỉ người · 6 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/exploratory` | — |  |
| PATCH | `/projects/:pid/exploratory/:num` | — |  |
| DELETE | `/projects/:pid/exploratory/:num` | — |  |
| POST | `/projects/:pid/exploratory/:num/start` | — |  |
| POST | `/projects/:pid/exploratory/:num/stop` | — |  |
| POST | `/projects/:pid/exploratory/:num/notes` | — |  |

### exports — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/exports` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/exports/:eid/link` | 👤 | finance / client / external integration or export |

### figma — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/figma/token` | 👤 | finance / client / external integration or export |

### filters — 0 tool · 0 chỉ người · 2 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/filters` | — |  |
| DELETE | `/projects/:pid/filters/:filterId` | — |  |

### final-report — 1 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/final-report/assemble` | ✅ | final_report_assemble |
| POST | `/projects/:pid/final-report/export` | — |  |

### finance — 1 tool · 18 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/finance/settings` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/rates` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/finance/rates/:rid` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/finance/rates/:rid` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/timesheets/submit` | ✅ | timesheet_submit |
| POST | `/projects/:pid/finance/timesheets/:tid/withdraw` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/timesheets/:tid/approve` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/timesheets/:tid/return` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/timesheets/:tid/reopen` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/budget-lines` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/finance/budget-lines/:bid` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/finance/budget-lines/:bid` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/expenses` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/finance/expenses/:eid` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/finance/expenses/:eid` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/payments` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/finance/payments/:num` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/finance/payments/:num` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/finance/payments/:num/status` | 👤 | finance / client / external integration or export |

### forms — 0 tool · 2 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/forms` | — |  |
| PATCH | `/projects/:pid/forms/:form` | — |  |
| DELETE | `/projects/:pid/forms/:form` | — |  |
| POST | `/projects/:pid/forms/:form/status` | 👤 | opens a public link (external) |
| POST | `/projects/:pid/forms/:form/rotate` | 👤 | opens a public link (external) |

### fpt-reports — 1 tool · 0 chỉ người · 8 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/fpt-reports/doc` | — |  |
| POST | `/projects/:pid/fpt-reports/weekly` | ✅ | weekly_report_generate |
| PUT | `/projects/:pid/fpt-reports/weekly/:id` | — |  |
| POST | `/projects/:pid/fpt-reports/weekly/:id/refresh` | — |  |
| DELETE | `/projects/:pid/fpt-reports/weekly/:id` | — |  |
| POST | `/projects/:pid/fpt-reports/ai-usage/sync` | — |  |
| POST | `/projects/:pid/fpt-reports/ai-usage` | — |  |
| PATCH | `/projects/:pid/fpt-reports/ai-usage/:id` | — |  |
| DELETE | `/projects/:pid/fpt-reports/ai-usage/:id` | — |  |

### fpt-tests — 18 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/fpt-tests/doc` | ✅ | fpt_doc_update |
| POST | `/projects/:pid/fpt-tests/changes` | ✅ | fpt_change_add |
| PATCH | `/projects/:pid/fpt-tests/changes/:id` | ✅ | fpt_change_update |
| DELETE | `/projects/:pid/fpt-tests/changes/:id` | ✅ | fpt_change_delete |
| POST | `/projects/:pid/fpt-tests/unit` | ✅ | fpt_unit_create_function |
| PATCH | `/projects/:pid/fpt-tests/unit/:fid` | ✅ | fpt_unit_update_function |
| DELETE | `/projects/:pid/fpt-tests/unit/:fid` | ✅ | fpt_unit_delete_function |
| PUT | `/projects/:pid/fpt-tests/unit/:fid/matrix` | ✅ | fpt_unit_add_cases, fpt_unit_mark, fpt_unit_record_results, fpt_unit_update_rows, fpt_unit_delete_rows, fpt_unit_delete_cases, fpt_unit_move |
| POST | `/projects/:pid/fpt-tests/unit/:fid/duplicate` | ✅ | fpt_unit_duplicate_function |
| POST | `/projects/:pid/fpt-tests/unit/:fid/ai-suggest` | ✅ | fpt_unit_suggest |
| POST | `/projects/:pid/fpt-tests/integration` | ✅ | fpt_it_create_module |
| POST | `/projects/:pid/fpt-tests/system` | ✅ | fpt_it_create_module |
| PATCH | `/projects/:pid/fpt-tests/integration/:mid` | ✅ | fpt_it_update_module |
| PATCH | `/projects/:pid/fpt-tests/system/:mid` | ✅ | fpt_it_update_module |
| DELETE | `/projects/:pid/fpt-tests/integration/:mid` | ✅ | fpt_it_delete_module |
| DELETE | `/projects/:pid/fpt-tests/system/:mid` | ✅ | fpt_it_delete_module |
| PUT | `/projects/:pid/fpt-tests/integration/:mid/cases` | ✅ | fpt_it_add_cases, fpt_it_record_round, fpt_it_update_cases, fpt_it_delete_cases, fpt_it_move_case |
| PUT | `/projects/:pid/fpt-tests/system/:mid/cases` | ✅ | fpt_it_add_cases, fpt_it_record_round, fpt_it_update_cases, fpt_it_delete_cases, fpt_it_move_case |
| POST | `/projects/:pid/fpt-tests/import` | — |  |

### github — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/github` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/github` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/github` | 👤 | finance / client / external integration or export |

### gitlab — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/gitlab` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/gitlab` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/gitlab` | 👤 | finance / client / external integration or export |

### grades — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/grades` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/grades/publish` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/grades/:gid` | 👤 | finance / client / external integration or export |

### handoffs — 0 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/handoffs/:hid/accept` | — |  |
| POST | `/projects/:pid/handoffs/:hid/return` | — |  |
| POST | `/projects/:pid/handoffs/:hid/cancel` | — |  |

### images — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/images` | — |  |

### import — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/import` | — |  |

### imports — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/imports` | — |  |

### intake — 0 tool · 6 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/intake/channels` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/intake/channels/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/intake/channels/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/intake/channels/:id/rotate` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/intake/channels/:id/simulate` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/intake/proposals/:id/decide` | 👤 | decision / approval |

### issue-templates — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/issue-templates/:typeKey` | 👤 | project configuration / membership |

### issue-types — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/issue-types` | 👤 | project configuration / membership |
| PATCH | `/projects/:pid/issue-types/:typeId` | 👤 | project configuration / membership |

### issues — 27 tool · 3 chỉ người · 10 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/issues` | ✅ | create_issue |
| PATCH | `/projects/:pid/issues/:num` | ✅ | update_issue, checklist_toggle, issue_assign, issue_move_sprint |
| POST | `/projects/:pid/issues/:num/move` | ✅ | transition, request_review |
| DELETE | `/projects/:pid/issues/:num` | ✅ | issue_delete |
| POST | `/projects/:pid/issues/:num/clone` | ✅ | issue_clone |
| POST | `/projects/:pid/issues/:num/links` | ✅ | issue_link |
| DELETE | `/projects/:pid/issues/:num/links/:linkId` | ✅ | issue_unlink |
| POST | `/projects/:pid/issues/:num/notes` | — |  |
| DELETE | `/projects/:pid/issues/:num/notes/:noteId` | — |  |
| PUT | `/projects/:pid/issues/:num/flag` | ✅ | ask_lead |
| DELETE | `/projects/:pid/issues/:num/flag` | ✅ | issue_flag |
| PUT | `/projects/:pid/issues/:num/watch` | ✅ | issue_watch |
| DELETE | `/projects/:pid/issues/:num/watch` | ✅ | issue_watch |
| POST | `/projects/:pid/issues/:num/comments` | ✅ | comment, transition, ask_lead, request_review |
| PATCH | `/projects/:pid/issues/:num/comments/:cid` | ✅ | comment_edit |
| POST | `/projects/:pid/issues/:num/comments/:cid/report` | 👤 | content report to moderators |
| DELETE | `/projects/:pid/issues/:num/comments/:cid` | ✅ | comment_delete |
| POST | `/projects/:pid/issues/:num/attachments/presign` | ✅ | attach_file, attach_from_url |
| POST | `/projects/:pid/issues/:num/attachments/complete` | ✅ | attach_file, attach_complete, attach_from_url |
| POST | `/projects/:pid/issues/bulk` | — |  |
| PUT | `/projects/:pid/issues/:num/custom-values` | ✅ | issue_custom_fields_set |
| PUT | `/projects/:pid/issues/:num/schedule` | ✅ | update_issue (startDate/dueDate) |
| POST | `/projects/:pid/issues/:num/worklogs` | ✅ | log_work, worklog_update |
| DELETE | `/projects/:pid/issues/:num/worklogs/:logId` | ✅ | worklog_update, worklog_delete |
| PUT | `/projects/:pid/issues/:num/comments/:cid/reactions/:emoji` | — |  |
| POST | `/projects/:pid/issues/:num/handoffs` | — |  |
| POST | `/projects/:pid/issues/:num/move-project` | — |  |
| PUT | `/projects/:pid/issues/:num/client-visible` | 👤 | client-facing |
| PATCH | `/projects/:pid/issues/:num/desk` | — |  |
| POST | `/projects/:pid/issues/:num/desk/waiting` | — |  |
| POST | `/projects/:pid/issues/:num/web-links` | ✅ | issue_web_link_add |
| DELETE | `/projects/:pid/issues/:num/web-links/:lid` | ✅ | issue_web_link_remove |
| POST | `/projects/:pid/issues/:num/web-links/:lid/save` | — |  |
| POST | `/projects/:pid/issues/:num/claim` | ✅ | claim_issue |
| POST | `/projects/:pid/issues/:num/agent-runs` | 👤 | web AI assistant (CuongMini is itself the AI) |
| POST | `/projects/:pid/issues/:num/comment-files` | ✅ | attach_file (for="comment") |
| POST | `/projects/:pid/issues/:num/comment-voice` | — |  |
| PUT | `/projects/:pid/issues/:num/defect` | ✅ | defect_set |
| PATCH | `/projects/:pid/issues/:num/worklogs/:logId` | ✅ | worklog_update |
| POST | `/projects/:pid/issues/:num/timer` | ✅ | log_work |

### kb — 0 tool · 6 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/kb/categories` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/kb/categories/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/kb/categories/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/kb/articles` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/kb/articles/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/kb/articles/:id` | 👤 | finance / client / external integration or export |

### labels — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/labels` | 👤 | project configuration / membership |
| PATCH | `/projects/:pid/labels/:labelId` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/labels/:labelId` | 👤 | project configuration / membership |

### meeting-series — 0 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/meeting-series` | — |  |
| PATCH | `/projects/:pid/meeting-series/:sid` | — |  |
| DELETE | `/projects/:pid/meeting-series/:sid` | — |  |

### meeting-settings — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/meeting-settings` | 👤 | project configuration / membership |

### meetings — 7 tool · 16 chỉ người · 6 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/meetings` | ✅ | meeting_create |
| PATCH | `/projects/:pid/meetings/:num` | ✅ | meeting_update |
| DELETE | `/projects/:pid/meetings/:num` | ✅ | meeting_delete |
| PUT | `/projects/:pid/meetings/:num/attendees` | — |  |
| PUT | `/projects/:pid/meetings/:num/actions` | ✅ | meeting_add_actions |
| POST | `/projects/:pid/meetings/:num/actions/issues` | ✅ | meeting_create_issues |
| POST | `/projects/:pid/meetings/:num/actions/suggest` | — |  |
| POST | `/projects/:pid/meetings/:num/share` | 👤 | client-facing |
| POST | `/projects/:pid/meetings/:num/duplicate` | — |  |
| POST | `/projects/:pid/meetings/:num/invites` | 👤 | client-facing |
| PUT | `/projects/:pid/meetings/:num/agenda-items` | — |  |
| PUT | `/projects/:pid/meetings/:num/recording-link` | — |  |
| POST | `/projects/:pid/meetings/:num/rsvp` | ✅ | meeting_rsvp |
| POST | `/projects/:pid/meetings/:num/join` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/leave` | 👤 | live meeting / recording (needs the person present) |
| PUT | `/projects/:pid/meetings/:num/attendance` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings/:rid/consent` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings/:rid/begin` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings/:rid/end` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings/:rid/retry` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/recordings/:rid/chunks` | 👤 | live meeting / recording (needs the person present) |
| DELETE | `/projects/:pid/meetings/:num/recordings/:rid/audio` | 👤 | live meeting / recording (needs the person present) |
| PUT | `/projects/:pid/meetings/:num/recordings/:rid/speakers` | 👤 | live meeting / recording (needs the person present) |
| POST | `/projects/:pid/meetings/:num/minutes-ai` | ✅ | meeting_minutes_propose |
| POST | `/projects/:pid/meetings/:num/minutes-ai/:did/apply` | 👤 | decision / approval |
| POST | `/projects/:pid/meetings/:num/minutes-ai/:did/dismiss` | 👤 | decision / approval |
| POST | `/projects/:pid/meetings/:num/apply-template` | — |  |
| POST | `/projects/:pid/meetings/:num/report` | 👤 | content report to moderators |

### members — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/members/:userId` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/members/:userId` | 👤 | project configuration / membership |

### notion — 0 tool · 3 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/notion/import-page` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/notion/export-page` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/notion/import-database` | 👤 | finance / client / external integration or export |

### okrs — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/okrs/objectives` | — |  |

### pages — 9 tool · 0 chỉ người · 8 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/pages` | ✅ | docs_draft_page |
| PATCH | `/projects/:pid/pages/:num` | ✅ | docs_page_update, docs_update_section |
| POST | `/projects/:pid/pages/:num/request-approval` | ✅ | approval_request |
| POST | `/projects/:pid/pages/:num/move` | ✅ | docs_page_move |
| DELETE | `/projects/:pid/pages/:num` | ✅ | docs_page_delete |
| POST | `/projects/:pid/pages/:num/versions/:n/restore` | ✅ | docs_page_version_restore |
| POST | `/projects/:pid/pages/:num/issues` | ✅ | docs_page_link_issue |
| DELETE | `/projects/:pid/pages/:num/issues/:issueNum` | ✅ | docs_page_link_issue |
| POST | `/projects/:pid/pages/:num/comments` | ✅ | docs_comment |
| DELETE | `/projects/:pid/pages/:num/comments/:cid` | — |  |
| POST | `/projects/:pid/pages/:num/export` | — |  |
| POST | `/projects/:pid/pages/:num/autofill` | — |  |
| POST | `/projects/:pid/pages/:num/fill-srs` | — |  |
| PUT | `/projects/:pid/pages/:num/collab` | — |  |
| POST | `/projects/:pid/pages/:num/collab/flush` | — |  |
| POST | `/projects/:pid/pages/:num/inline-comments` | — |  |
| POST | `/projects/:pid/pages/:num/inline-comments/:cid/resolve` | — |  |

### poker — 1 tool · 0 chỉ người · 11 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/poker` | — |  |
| DELETE | `/projects/:pid/poker/:sid` | — |  |
| POST | `/projects/:pid/poker/:sid/items` | — |  |
| POST | `/projects/:pid/poker/:sid/timer` | — |  |
| POST | `/projects/:pid/poker/:sid/close` | — |  |
| DELETE | `/projects/:pid/poker/:sid/items/:iid` | — |  |
| POST | `/projects/:pid/poker/:sid/items/:iid/start` | — |  |
| POST | `/projects/:pid/poker/:sid/items/:iid/vote` | ✅ | poker_vote |
| POST | `/projects/:pid/poker/:sid/items/:iid/reveal` | — |  |
| POST | `/projects/:pid/poker/:sid/items/:iid/revote` | — |  |
| POST | `/projects/:pid/poker/:sid/items/:iid/finalize` | — |  |
| POST | `/projects/:pid/poker/:sid/items/:iid/skip` | — |  |

### portal — 0 tool · 10 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/portal/requests` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/invite` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/uat` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/uat/:aid/decide` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/desk/requests` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/desk/requests/:num/csat` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/resources/:id/open` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/kb/:id/vote` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/kb/:id/deflected` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/portal/meetings/:num/rsvp` | 👤 | finance / client / external integration or export |

### qna — 3 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/qna` | ✅ | qna_ask |
| PATCH | `/projects/:pid/qna/:n` | ✅ | qna_update, qna_answer |
| DELETE | `/projects/:pid/qna/:n` | ✅ | qna_delete |
| POST | `/projects/:pid/qna/:n/convert` | — |  |

### raid — 3 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/raid` | ✅ | raid_create |
| POST | `/projects/:pid/raid/starter` | — |  |
| PATCH | `/projects/:pid/raid/:num` | ✅ | raid_update |
| DELETE | `/projects/:pid/raid/:num` | ✅ | raid_delete |
| POST | `/projects/:pid/raid/:num/links` | — |  |
| DELETE | `/projects/:pid/raid/:num/links/:linkId` | — |  |

### report-builder — 0 tool · 6 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/report-builder/templates` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/report-builder/templates/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/report-builder/templates/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/report-builder/preview` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/report-builder/export` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/report-builder/ai` | 👤 | finance / client / external integration or export |

### report-plans — 0 tool · 5 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/report-plans` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/report-plans/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/report-plans/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/report-plans/:id/send` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/report-plans/:id/recipients/decide` | 👤 | finance / client / external integration or export |

### reports — 0 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/reports/client-weekly/schedule` | — |  |
| POST | `/projects/:pid/reports/client-weekly/send` | — |  |
| POST | `/projects/:pid/reports/client-weekly/polish` | — |  |

### resource-groups — 0 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/resource-groups` | — |  |
| PUT | `/projects/:pid/resource-groups/reorder` | — |  |
| PATCH | `/projects/:pid/resource-groups/:gid` | — |  |
| DELETE | `/projects/:pid/resource-groups/:gid` | — |  |

### resources — 3 tool · 0 chỉ người · 6 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/resources` | ✅ | resource_add |
| POST | `/projects/:pid/resources/preview` | — |  |
| POST | `/projects/:pid/resources/import` | — |  |
| PUT | `/projects/:pid/resources/reorder` | — |  |
| POST | `/projects/:pid/resources/check` | — |  |
| PATCH | `/projects/:pid/resources/:id` | ✅ | resource_update |
| DELETE | `/projects/:pid/resources/:id` | ✅ | resource_delete |
| POST | `/projects/:pid/resources/:id/open` | — |  |
| POST | `/projects/:pid/resources/:id/refresh` | — |  |

### retros — 2 tool · 0 chỉ người · 8 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/retros` | — |  |
| PATCH | `/projects/:pid/retros/:rid` | — |  |
| DELETE | `/projects/:pid/retros/:rid` | — |  |
| POST | `/projects/:pid/retros/:rid/cards` | ✅ | retro_card_add |
| PATCH | `/projects/:pid/retros/:rid/cards/:cid` | — |  |
| DELETE | `/projects/:pid/retros/:rid/cards/:cid` | — |  |
| POST | `/projects/:pid/retros/:rid/cards/:cid/vote` | ✅ | retro_vote |
| POST | `/projects/:pid/retros/:rid/actions` | — |  |
| DELETE | `/projects/:pid/retros/:rid/actions/:aid` | — |  |
| POST | `/projects/:pid/retros/:rid/summary` | — |  |

### reviews — 0 tool · 0 chỉ người · 7 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/reviews` | — |  |
| PATCH | `/projects/:pid/reviews/:num` | — |  |
| DELETE | `/projects/:pid/reviews/:num` | — |  |
| PUT | `/projects/:pid/reviews/:num/participants` | — |  |
| PUT | `/projects/:pid/reviews/:num/items` | — |  |
| POST | `/projects/:pid/reviews/:num/transition` | — |  |
| POST | `/projects/:pid/reviews/:num/items/:itemId/defect` | — |  |

### sample-data — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/sample-data` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/sample-data` | 👤 | project configuration / membership |

### share-links — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/share-links` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/share-links/:linkId` | 👤 | finance / client / external integration or export |

### slack — 0 tool · 4 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/slack/channels` | 👤 | finance / client / external integration or export |
| PATCH | `/projects/:pid/slack/channels/:id` | 👤 | finance / client / external integration or export |
| DELETE | `/projects/:pid/slack/channels/:id` | 👤 | finance / client / external integration or export |
| POST | `/projects/:pid/slack/channels/:id/test` | 👤 | finance / client / external integration or export |

### spec-reviews — 1 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/spec-reviews/page/:num` | — |  |
| POST | `/projects/:pid/spec-reviews/issues` | — |  |
| POST | `/projects/:pid/spec-reviews/:rid/findings/:fid/apply` | — |  |
| POST | `/projects/:pid/spec-reviews/:rid/findings/:fid/dismiss` | — |  |
| POST | `/projects/:pid/spec-reviews/:rid/findings/:fid/bug` | ✅ | spec_finding_to_bug |

### spec-settings — 0 tool · 1 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/spec-settings` | 👤 | project configuration / membership |

### sprints — 5 tool · 0 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/sprints` | ✅ | sprint_create |
| PATCH | `/projects/:pid/sprints/:sid` | ✅ | sprint_update |
| DELETE | `/projects/:pid/sprints/:sid` | ✅ | sprint_delete |
| POST | `/projects/:pid/sprints/:sid/start` | ✅ | sprint_start |
| POST | `/projects/:pid/sprints/:sid/complete` | ✅ | sprint_complete |

### srs — 17 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/srs/actors` | ✅ | srs_add_actor |
| PATCH | `/projects/:pid/srs/actors/:id` | ✅ | srs_actor_update |
| DELETE | `/projects/:pid/srs/actors/:id` | ✅ | srs_delete |
| POST | `/projects/:pid/srs/use-cases` | ✅ | srs_propose_use_case |
| PATCH | `/projects/:pid/srs/use-cases/:n` | ✅ | srs_use_case_update |
| DELETE | `/projects/:pid/srs/use-cases/:n` | ✅ | srs_delete |
| POST | `/projects/:pid/srs/use-cases/:n/status` | — |  |
| POST | `/projects/:pid/srs/rules` | ✅ | srs_propose_business_rule |
| PATCH | `/projects/:pid/srs/rules/:n` | ✅ | srs_rule_update |
| DELETE | `/projects/:pid/srs/rules/:n` | ✅ | srs_delete |
| POST | `/projects/:pid/srs/screens` | ✅ | srs_add_screen |
| PATCH | `/projects/:pid/srs/screens/:id` | ✅ | srs_screen_update |
| DELETE | `/projects/:pid/srs/screens/:id` | ✅ | srs_delete |
| PUT | `/projects/:pid/srs/screen-auth` | ✅ | srs_set_screen_access |
| POST | `/projects/:pid/srs/functions` | ✅ | srs_add_non_ui_function |
| PATCH | `/projects/:pid/srs/functions/:id` | ✅ | srs_function_update |
| DELETE | `/projects/:pid/srs/functions/:id` | ✅ | srs_delete |
| POST | `/projects/:pid/srs/suggest` | ✅ | srs_suggest_use_cases |
| POST | `/projects/:pid/srs/proposals/discard` | — |  |
| POST | `/projects/:pid/srs/report3/export` | — |  |

### stages — 0 tool · 2 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/stages` | — |  |
| PATCH | `/projects/:pid/stages/:sid` | — |  |
| DELETE | `/projects/:pid/stages/:sid` | — |  |
| POST | `/projects/:pid/stages/:sid/activate` | 👤 | stage gate |
| POST | `/projects/:pid/stages/:sid/request-gate` | 👤 | stage gate |

### static-analysis — 0 tool · 0 chỉ người · 2 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/static-analysis/findings/:id/:action(ignore\|reopen\|issue)` | — |  |
| POST | `/projects/:pid/static-analysis/vg` | — |  |

### statuses — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/projects/:pid/statuses/:statusId` | 👤 | project configuration / membership |
| DELETE | `/projects/:pid/statuses/:statusId` | 👤 | project configuration / membership |

### studio — 0 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/studio` | 👤 | project configuration / membership |
| POST | `/projects/:pid/studio/apply-defaults` | 👤 | project configuration / membership |

### swr — 16 tool · 4 chỉ người · 35 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/swr/features` | ✅ | swr_feature_add |
| PATCH | `/projects/:pid/swr/features/:fe` | ✅ | swr_feature_update |
| DELETE | `/projects/:pid/swr/features/:fe` | — |  |
| POST | `/projects/:pid/swr/features/:fe/links` | ✅ | swr_feature_link |
| DELETE | `/projects/:pid/swr/features/:fe/links/:id` | — |  |
| PUT | `/projects/:pid/swr/requirements/:num` | — |  |
| POST | `/projects/:pid/swr/requirements/:num/lifecycle` | — |  |
| POST | `/projects/:pid/swr/priority/rows` | ✅ | swr_priority_set |
| PATCH | `/projects/:pid/swr/priority/rows/:id` | — |  |
| DELETE | `/projects/:pid/swr/priority/rows/:id` | — |  |
| POST | `/projects/:pid/swr/priority/seed` | — |  |
| POST | `/projects/:pid/swr/glossary` | ✅ | swr_glossary_add |
| PATCH | `/projects/:pid/swr/glossary/:id` | — |  |
| DELETE | `/projects/:pid/swr/glossary/:id` | — |  |
| POST | `/projects/:pid/swr/dictionary` | ✅ | swr_dictionary_add |
| PATCH | `/projects/:pid/swr/dictionary/:id` | — |  |
| DELETE | `/projects/:pid/swr/dictionary/:id` | — |  |
| PUT | `/projects/:pid/swr/settings` | — |  |
| POST | `/projects/:pid/swr/docs/:kind/fill` | ✅ | swr_doc_fill |
| POST | `/projects/:pid/swr/docs/:kind/export` | — |  |
| POST | `/projects/:pid/swr/stakeholders` | ✅ | swr_stakeholder_add |
| POST | `/projects/:pid/swr/stakeholders/seed-actors` | — |  |
| PATCH | `/projects/:pid/swr/stakeholders/:sh` | ✅ | swr_stakeholder_update |
| DELETE | `/projects/:pid/swr/stakeholders/:sh` | — |  |
| POST | `/projects/:pid/swr/raci/activities` | — |  |
| DELETE | `/projects/:pid/swr/raci/activities/:id` | — |  |
| PUT | `/projects/:pid/swr/raci/cells` | — |  |
| POST | `/projects/:pid/swr/elicitation` | ✅ | swr_elicitation_add |
| PATCH | `/projects/:pid/swr/elicitation/:elc` | ✅ | swr_elicitation_update |
| DELETE | `/projects/:pid/swr/elicitation/:elc` | — |  |
| POST | `/projects/:pid/swr/elicitation/:elc/meeting` | — |  |
| POST | `/projects/:pid/swr/elicitation/:elc/propose` | ✅ | swr_elicitation_propose |
| POST | `/projects/:pid/swr/elicitation/:elc/proposals` | — |  |
| POST | `/projects/:pid/swr/elicitation/:elc/proposals/:id/decide` | 👤 | decision / approval |
| POST | `/projects/:pid/swr/origins` | ✅ | swr_requirement_source_add |
| DELETE | `/projects/:pid/swr/origins/:id` | — |  |
| POST | `/projects/:pid/swr/surveys` | ✅ | swr_survey_add |
| PATCH | `/projects/:pid/swr/surveys/:sv` | — |  |
| DELETE | `/projects/:pid/swr/surveys/:sv` | — |  |
| POST | `/projects/:pid/swr/surveys/:sv/status` | 👤 | opens a public link (external) |
| POST | `/projects/:pid/swr/surveys/:sv/rotate` | 👤 | opens a public link (external) |
| POST | `/projects/:pid/swr/models/:kind/generate` | ✅ | swr_model_generate |
| POST | `/projects/:pid/swr/mockups` | ✅ | swr_mockup_add_link |
| PATCH | `/projects/:pid/swr/mockups/:id` | — |  |
| DELETE | `/projects/:pid/swr/mockups/:id` | — |  |
| POST | `/projects/:pid/swr/mockups/:id/submit` | — |  |
| POST | `/projects/:pid/swr/mockups/:id/review` | 👤 | decision / approval |
| PUT | `/projects/:pid/swr/quality/:num` | — |  |
| POST | `/projects/:pid/swr/quality/:num/ai-fix` | — |  |
| POST | `/projects/:pid/swr/nfr/from-template` | — |  |
| PUT | `/projects/:pid/swr/nfr/:num` | — |  |
| DELETE | `/projects/:pid/swr/nfr/:num` | — |  |
| PUT | `/projects/:pid/swr/estimation` | — |  |
| POST | `/projects/:pid/swr/elicitation/:elc/ai-stakeholder` | — |  |
| DELETE | `/projects/:pid/swr/elicitation/:elc/ai-stakeholder` | — |  |

### test-automation — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/test-automation/tests/:id/reset-flaky` | — |  |

### test-cycles — 3 tool · 0 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/test-cycles` | ✅ | test_cycle_create |
| PATCH | `/projects/:pid/test-cycles/:cycleId` | ✅ | test_cycle_update |
| DELETE | `/projects/:pid/test-cycles/:cycleId` | ✅ | test_cycle_delete |

### test-defects — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/test-defects/:num` | — |  |

### test-designs — 0 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/test-designs/preview` | — |  |
| POST | `/projects/:pid/test-designs` | — |  |
| DELETE | `/projects/:pid/test-designs/:num` | — |  |
| POST | `/projects/:pid/test-designs/:num/export` | — |  |

### test-plans — 0 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/test-plans` | — |  |
| PATCH | `/projects/:pid/test-plans/:planId` | — |  |
| DELETE | `/projects/:pid/test-plans/:planId` | — |  |
| PUT | `/projects/:pid/test-plans/:planId/settings` | — |  |

### test-risks — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/test-risks` | — |  |

### test-runs — 5 tool · 0 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/projects/:pid/test-runs/:runId` | ✅ | test_run_record |
| PATCH | `/projects/:pid/test-runs/:runId/steps/:stepId` | ✅ | test_run_record |
| POST | `/projects/:pid/test-runs/:runId/defects` | ✅ | test_run_defect |
| PUT | `/projects/:pid/test-runs/:runId/defects/:num` | ✅ | test_run_defect |
| DELETE | `/projects/:pid/test-runs/:runId/defects/:num` | ✅ | test_run_defect |

### tests — 2 tool · 0 chỉ người · 4 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/tests/enable` | — |  |
| POST | `/projects/:pid/tests` | ✅ | test_create |
| POST | `/projects/:pid/tests/import` | — |  |
| PUT | `/projects/:pid/tests/:num` | ✅ | test_update |
| POST | `/projects/:pid/tests/automation/import` | — |  |
| POST | `/projects/:pid/tests/automation/static` | — |  |

### tests-attributes — 0 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PATCH | `/projects/:pid/tests-attributes` | — |  |

### timeline — 0 tool · 0 chỉ người · 2 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/timeline/baselines` | — |  |
| DELETE | `/projects/:pid/timeline/baselines/:bid` | — |  |

### trace-links — 1 tool · 0 chỉ người · 1 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/trace-links` | ✅ | trace_link_add |
| DELETE | `/projects/:pid/trace-links/:id` | — |  |

### trash — 2 tool · 2 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/trash/:num/restore` | ✅ | issue_restore |
| DELETE | `/projects/:pid/trash/:num` | 👤 | permanent purge |
| POST | `/projects/:pid/trash/pages/:num/restore` | ✅ | docs_page_restore |
| DELETE | `/projects/:pid/trash/pages/:num` | 👤 | permanent purge |

### versions — 0 tool · 0 chỉ người · 5 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/versions` | — |  |
| PATCH | `/projects/:pid/versions/:versionId` | — |  |
| POST | `/projects/:pid/versions/:versionId/release` | — |  |
| DELETE | `/projects/:pid/versions/:versionId` | — |  |
| POST | `/projects/:pid/versions/:versionId/ai-notes` | — |  |

### wbs — 0 tool · 0 chỉ người · 3 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| PUT | `/projects/:pid/wbs/matrix` | — |  |
| PUT | `/projects/:pid/wbs/items/:num` | — |  |
| PUT | `/projects/:pid/wbs/items/:num/move` | — |  |

### workflows — 0 tool · 5 chỉ người · 0 thiếu

| Method | Route | | Tool / lý do |
|---|---|---|---|
| POST | `/projects/:pid/workflows` | 👤 | project configuration / membership |
| POST | `/projects/:pid/workflows/:wfId/statuses` | 👤 | project configuration / membership |
| PUT | `/projects/:pid/workflows/:wfId/order` | 👤 | project configuration / membership |
| PUT | `/projects/:pid/workflows/:wfId/transitions` | 👤 | project configuration / membership |
| PUT | `/projects/:pid/workflows/:wfId/layout` | 👤 | project configuration / membership |
