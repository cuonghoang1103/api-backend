# CT Work — công cụ quản lý dự án kiểu Jira (kế hoạch tổng)

> Lập ngày 23/09/2026. Tên chính thức: **CT Work**, đường dẫn `/work` (chốt 23/09).
> Tài liệu này là nguồn sự thật cho mọi phiên làm việc sau: làm xong task nào thì
> đánh dấu `[x]` ngay tại đây.

## 1. Mục tiêu

Một công cụ quản lý dự án dùng thật lâu dài cho ba loại dự án:

1. **Đồ án ở trường**: SWR302 (yêu cầu), SWT301 (kiểm thử), SWP391 (đồ án), đồ án tốt nghiệp.
   Có vai trò **Giảng viên** chỉ xem và trang **thống kê đóng góp từng thành viên**.
2. **Dự án nhận ngoài (freelance)**: có vai trò **Khách hàng** xem tiến độ, báo cáo tuần gửi khách.
3. **Dự án công ty**: nhiều dự án, nhiều nhóm, phân quyền chặt, nhật ký thay đổi (audit log).

Tiêu chuẩn: tính năng tương đương **Jira Premium + plugin kiểm thử Xray** ở những phần
các loại dự án trên thật sự dùng, cộng một **trợ lý AI** biết quản lý, nhắc việc và gợi ý.

**Không làm** (ngoài phạm vi, ghi rõ để khỏi trôi): chợ plugin, Service Desk/SLA kiểu
Jira Service Management, tự lưu trữ trên máy chủ khách (on-premise), SSO SAML doanh nghiệp.

## 2. Đối chiếu tính năng với Jira trả phí

| Nhóm | Tính năng | Jira gói | Đợt |
|---|---|---|---|
| Tổ chức | Workspace, nhiều dự án, mời thành viên bằng email/link | Free | 1 |
| | Vai trò: Owner · Admin · Member · Viewer · **Giảng viên** · **Khách hàng** (guest) | Standard/Premium | 1 |
| | Quyền theo dự án (ai tạo/sửa/xoá/chuyển trạng thái) | Standard | 1 |
| Issue | Epic · Story · Task · Bug · Sub-task · liên kết (blocks / relates / duplicates) | Free | 1 |
| | Mã thẻ `KEY-123`, người phụ trách, người báo, ưu tiên, nhãn, component, hạn | Free | 1 |
| | Mô tả soạn thảo giàu (dùng lại TipTap của Ghi chú), @nhắc tên, bình luận, đính kèm R2 | Free | 1 |
| | Lịch sử thay đổi từng trường, người theo dõi (watcher) | Free | 1 |
| | Trường tuỳ chỉnh (custom field: text, số, ngày, chọn, người) | Standard | 5 |
| Board | Kanban kéo thả, giới hạn WIP, swimlane theo người/epic, lọc nhanh | Free | 1 |
| | Workflow tuỳ chỉnh (trạng thái, luồng chuyển, điều kiện) | Standard | 5 |
| Scrum | Backlog, sprint, story point, velocity, burndown/burnup | Free | 2 |
| | Sprint goal, chuyển việc dở, báo cáo sprint | Free | 2 |
| Kế hoạch | Timeline/Gantt, phụ thuộc giữa việc, đường găng | Premium (Plans) | 6 |
| | Năng lực nhóm (capacity), phân bổ theo người | Premium | 6 |
| | Release/version, release notes | Free | 6 |
| | Ghi thời gian làm (worklog), ước lượng giờ | Free | 6 |
| Tìm kiếm | Bộ lọc, **truy vấn kiểu JQL**, lưu bộ lọc | Free | 5 |
| | Dashboard nhiều widget | Free | 5 |
| Tự động | Luật tự động "khi… nếu… thì…" | Standard (giới hạn) / Premium | 6 |
| Kiểm thử (Xray) | Test case có bước, dữ liệu, kết quả mong đợi · Gherkin (BDD) | Xray trả phí | 3 |
| | Test plan, test cycle/run, Pass/Fail/Blocked/Skip từng bước | Xray | 3 |
| | Fail → tạo Bug một chạm, nối ngược test case · vòng đời bug Retest | Xray | 3 |
| | **Ma trận truy vết** yêu cầu ↔ test case ↔ bug, độ phủ | Xray | 3 |
| Tích hợp | GitHub: commit/PR/nhánh tự gắn vào thẻ, chuyển trạng thái khi merge | Free | 7 |
| | Nhập CSV / file xuất của Jira · Xuất CSV, Excel, PDF | Free | 7 |
| Quản trị | Audit log | Premium | 7 |
| AI | Tóm tắt, viết story, truy vấn bằng lời, tách việc | Atlassian Intelligence (Premium) | 4 |
| | **Trợ lý quản lý** (nhắc việc, phát hiện rủi ro, báo cáo) — Jira không có đủ | — | 4 |
| Nền tảng | Web · app desktop · iPad/iPhone | — | 8 |

## 3. Nền đã có trong repo (dùng lại, không viết mới)

| Cần | Đã có | Ở đâu |
|---|---|---|
| Đăng nhập, JWT, kiểm `roleVersion` | Có | `src/middleware/auth.ts` |
| Thời gian thực | Socket.IO + Redis adapter, phòng `user:<id>` | `src/socket/messaging.socket.ts` |
| Thông báo trong web | Có, có danh sách `NOTIFICATION_TYPES` | `src/services/notification.service.ts` |
| Soạn thảo giàu + cộng tác | TipTap + Hocuspocus | `src/socket/notes-collaboration.gateway.ts` |
| Tải file | Cloudflare R2 | route uploads hiện có |
| Việc định kỳ | cron | `src/services/cron.service.ts` |
| Kéo thả, biểu đồ, kiểm dữ liệu | `@dnd-kit/*`, `recharts`, `zod` | `frontend/package.json` |
| Gọi AI | Cổng LLM, phân model theo việc, trần token/tiền | `src/services/llm/gateway.ts`, `budget.ts` |
| Tìm theo nghĩa | pgvector 0.8.6 trên production | xem memory `reference_pgvector_tren_prod` |
| Vòng lặp AI gọi tool | Agent của AI Code | `src/services/agent/` |

## 4. Kiến trúc

```
frontend/src/app/work/                  ← trang web (Next.js)
  page.tsx                              ← danh sách workspace/dự án
  [ws]/[key]/board | backlog | list | timeline | tests | reports | settings
  [ws]/[key]/issue/[num]                ← trang chi tiết thẻ (cũng mở dạng ngăn kéo)
frontend/src/features/work/             ← component, hook, store dùng chung
frontend/src/lib/api.ts                 ← thêm nhóm hàm workApi.*

src/routes/work/*.routes.ts             ← REST /api/v1/work/...
src/services/work/                      ← nghiệp vụ (issue, sprint, workflow, test, ai, automation)
src/services/work/permissions.ts        ← MỘT chỗ duy nhất quyết định quyền
src/socket/work.socket.ts               ← phòng work:project:<id>, sự kiện issue:*, sprint:*
```

**Nguyên tắc:**

- **Quyền kiểm ở một chỗ** (`permissions.ts`), mọi route và mọi tool của AI đều đi qua đó.
  Bài học cũ của repo: "ẩn UI không phải ẩn API", và "hai chỗ kiểm một quyền thì thành hai luật".
- **AI không được làm gì mà người dùng không có quyền làm.** Tool của AI gọi đúng service
  mà route gọi, với đúng `userId` của người đang hỏi.
- **Thay đổi ghi qua một hàm `applyIssueChange()`** để cùng lúc: ghi lịch sử, phát socket,
  kích hoạt luật tự động, gửi thông báo. Không route nào sửa bảng issue trực tiếp.
- **Thứ tự thẻ trên board** dùng chuỗi xếp hạng kiểu LexoRank (chèn giữa hai thẻ không phải
  đánh số lại cả cột). Có sẵn bài học `ordermany_same_timestamp_needs_id_sort`.
- **Mã thẻ** `KEY-123`: bộ đếm theo dự án, cấp trong transaction để hai người tạo cùng lúc
  không trùng số.

## 5. Mô hình dữ liệu (bản nháp, chốt ở đợt 0)

Tất cả bảng có tiền tố `work_`. Migration **viết tay** (xem CLAUDE.md: `migrate dev` hỏng).

```
WorkSpace          id, name, slug, ownerId, plan, createdAt
WorkMember         workspaceId, userId, role(OWNER|ADMIN|MEMBER|VIEWER|GUEST)
WorkInvite         workspaceId, email, token, role, expiresAt
WorkProject        id, workspaceId, key("SWP"), name, type(SCRUM|KANBAN|TESTING), template,
                   issueCounter, leadId, archivedAt
WorkProjectMember  projectId, userId, role(ADMIN|MEMBER|VIEWER|TEACHER|CLIENT)
WorkWorkflow       projectId, name
WorkStatus         workflowId, name, category(TODO|IN_PROGRESS|DONE), color, position, wipLimit
WorkTransition     workflowId, fromStatusId?, toStatusId, rule(JSON: ai được chuyển, điều kiện)
WorkIssueType      projectId, name(EPIC|STORY|TASK|BUG|SUBTASK|TEST|…), icon
WorkIssue          id, projectId, number, typeId, statusId, parentId?, epicId?, sprintId?,
                   title, descriptionJson, priority, assigneeId?, reporterId, storyPoints?,
                   originalEstimate?, remaining?, dueDate?, startDate?, rank, resolution?,
                   resolvedAt?, embedding vector(…)?, createdAt, updatedAt, deletedAt?
                   @@unique([projectId, number])
WorkIssueLink      fromId, toId, type(BLOCKS|RELATES|DUPLICATES|TESTS|CLONES)
WorkLabel / WorkIssueLabel, WorkComponent / WorkIssueComponent
WorkCustomField    projectId, name, kind, options(JSON)
WorkCustomValue    issueId, fieldId, value(JSON)
WorkComment        issueId, authorId(null = AI), bodyJson, createdAt, editedAt
WorkAttachment     issueId, r2Key, name, size, mime, uploaderId
WorkHistory        issueId, actorId(null = AI/tự động), field, from, to, createdAt
WorkWatcher        issueId, userId
WorkSprint         projectId, name, goal, state(PLANNED|ACTIVE|CLOSED), startAt, endAt,
                   committedPoints, completedPoints
WorkSprintSnapshot sprintId, day, remainingPoints, doneCount   ← nuôi burndown
WorkVersion        projectId, name, releaseDate, released
WorkWorklog        issueId, userId, minutes, note, startedAt
WorkSavedFilter    projectId?, ownerId, name, query, shared
WorkDashboard / WorkDashboardWidget
WorkAutomationRule projectId, trigger(JSON), conditions(JSON), actions(JSON), enabled,
                   lastRunAt, runCount
WorkAutomationLog  ruleId, issueId?, ok, message, createdAt

-- Kiểm thử (đợt 3)
WorkTestCase       issueId(loại TEST), preconditions, kind(MANUAL|GHERKIN), gherkin?
WorkTestStep       testCaseId, position, action, data, expected
WorkTestPlan       projectId, name, versionId?
WorkTestCycle      planId?, projectId, name, environment, state, startAt, endAt
WorkTestRun        cycleId, testCaseId, status(TODO|PASS|FAIL|BLOCKED|SKIP), executedById, executedAt
WorkTestStepResult runId, stepId, status, actual, attachmentIds

-- GitHub (đợt 7)
WorkRepoLink       projectId, provider, repoFullName, webhookSecret
WorkDevEvent       issueId, kind(COMMIT|BRANCH|PR), ref, title, url, author, at

-- AI (đợt 4)
WorkAiConversation / WorkAiMessage      ← lịch sử trợ lý theo dự án
WorkAiAction       conversationId, tool, args(JSON), state(PROPOSED|APPLIED|REJECTED), appliedBy
WorkDigest         projectId, userId?, kind(DAILY|WEEKLY|SPRINT|RISK), content, sentAt
WorkAudit          workspaceId, actorId, action, target, meta, createdAt   ← đợt 7
```

## 6. Thiết kế AI

### 6.1 Trợ lý trong dự án (khung chat bên phải mọi trang)

Chạy vòng lặp gọi tool như agent AI Code. Tool **đọc** chạy ngay; tool **ghi** tạo một
`WorkAiAction` ở trạng thái **ĐỀ XUẤT**, người dùng bấm "Áp dụng" mới thật sự chạy.
Hiện dạng thẻ xem trước: "Tạo 5 story sau vào Epic Đăng nhập", có nút Áp dụng / Sửa / Bỏ.

Tool dự kiến: `search_issues`, `get_issue`, `sprint_status`, `member_workload`,
`create_issues`, `update_issue`, `move_issue`, `assign_issue`, `create_sprint`,
`add_to_sprint`, `comment`, `create_test_cases`, `notify_members`.

### 6.2 Danh sách tính năng AI

| Tính năng | Chạy khi | Đợt |
|---|---|---|
| **Viết User Story + Acceptance Criteria** từ một câu mô tả, hoặc từ file SRS/đề bài tải lên | Người bấm | 4 |
| **Tách Epic thành Story, Story thành Sub-task**, gợi ý story point | Người bấm | 4 |
| **Hỏi bằng lời → bộ lọc**: "bug nghiêm trọng chưa ai nhận của sprint này" | Người gõ | 4 |
| **Tóm tắt thẻ dài** (mô tả + 40 bình luận thành 5 dòng) | Người bấm | 4 |
| **Sinh test case từ Acceptance Criteria** (cả dạng bước và Gherkin) | Người bấm | 4 |
| **Chuẩn hoá báo cáo bug**: điền steps to reproduce, expected/actual, gợi ý severity | Người bấm | 4 |
| **Phát hiện bug trùng** khi đang tạo (pgvector, không tốn LLM) | Tự động | 4 |
| **Gợi ý người nhận và độ ưu tiên** theo lịch sử và khối lượng hiện tại | Tự động gợi ý | 4 |
| **Lập kế hoạch sprint**: chọn việc theo velocity 3 sprint gần nhất và ngày nghỉ | Người bấm | 4 |
| **Bản tin sáng (standup)** cho từng người: hôm qua xong gì, hôm nay nên làm gì, đang kẹt gì | Định kỳ | 4 |
| **Cảnh báo rủi ro**: thẻ đứng yên quá N ngày, người quá tải, sprint không kịp, hạn sắp tới | Định kỳ | 4 |
| **Nhắc việc có chọn lọc** gửi thông báo tới đúng người (không spam: gộp, có giờ im lặng) | Định kỳ | 4 |
| **Báo cáo tuần** cho giảng viên/khách hàng, xuất PDF | Định kỳ / người bấm | 4, 7 |
| **Tóm tắt retrospective** từ ý kiến thành viên | Người bấm | 4 |
| **Release notes** từ các thẻ Done của version | Người bấm | 6 |
| **Biên bản họp → việc**: dán ghi chú họp, AI đề xuất danh sách thẻ | Người bấm | 4 |
| **Chấm chất lượng story** (INVEST, AC có kiểm được không) — hợp với SWR302 | Người bấm | 4 |

### 6.3 Chi phí và các bẫy đã biết

- Thêm hai việc mới vào `LlmPurpose`: `work_assistant` (tương tác → `claude-sonnet-5`)
  và `work_digest` (chạy nền → `gpt-5.4-mini`), vặn được bằng `LLM_MODEL_WORK_*`.
- ⚠️ **Việc chạy nền mặc định TẮT** trong repo (`LLM_BACKGROUND_ENABLED=false` chặn mọi lời
  gọi gắn `feature: 'bulk_gen' | 'news'`). Bản tin và cảnh báo rủi ro **không được** gắn nhãn
  đó, nếu không sẽ im lặng không chạy. Cần một cờ riêng `WORK_DIGEST_ENABLED` và tôn trọng
  trần tiền `budget.ts`.
- **Cảnh báo rủi ro tính bằng mã, không bằng AI** (đếm ngày đứng yên, tổng point theo người).
  AI chỉ viết lại thành lời. Rẻ, và con số không bị bịa — đúng bài học
  "để model mô tả, để mã tính toán".
- Mỗi dự án có hạn mức lượt AI/ngày; tính vào `checkTokenQuota` của người bấm.
- Mọi chữ AI trả về đi qua bộ dựng markdown chung (bài học `chu_ai_phai_qua_bo_dung_markdown`).

## 7. Thông báo

- Kênh: **trong web** (dùng hệ thông báo hiện có + socket), **email** (mailer đang gửi mail
  xác thực), **app desktop/iOS** (đợt 8).
- Sự kiện: được giao việc, được @nhắc, bình luận vào thẻ mình theo dõi, trạng thái đổi,
  sắp tới hạn / quá hạn, sprint bắt đầu/kết thúc, test run Fail, bản tin AI.
- Cài đặt theo người: bật/tắt từng loại, **giờ im lặng**, gộp email thành một thư mỗi ngày.
- Chống trùng: một sự kiện chỉ tạo một thông báo cho một người, kể cả khi luật tự động
  và AI cùng kích hoạt.

## 8. Mẫu dự án (template) có sẵn

| Mẫu | Có sẵn gì |
|---|---|
| **SWR302 — Yêu cầu phần mềm** | Epic theo nhóm chức năng, loại thẻ `Requirement`, trường `Acceptance Criteria`, `MoSCoW`, trang truy vết yêu cầu |
| **SWT301 — Kiểm thử** | Loại thẻ Test, workflow bug `Open → In Progress → Fixed → Retest → Closed / Reopened`, trường Severity, cycle mẫu |
| **SWP391 — Đồ án Scrum** | Sprint 2 tuần, Definition of Done, vai trò Giảng viên, trang đóng góp thành viên |
| **Freelance** | Vai trò Khách hàng, version theo mốc thanh toán, báo cáo tuần gửi khách |
| **Công ty** | Nhiều component, workflow có bước Review/QA, audit log bật sẵn |
| **Trống** | Kanban 3 cột |

## 9. Các đợt và danh sách task

Kích thước: **S** = vài giờ · **M** = một phiên · **L** = nhiều phiên.
Mỗi đợt kết thúc bằng: checklist pre-push, deploy bằng `deploy-nha.sh` (sau khi hỏi),
thêm một route GET không cần tham số vào smoke-test của `deploy.sh`.

### Đợt 0 — Nền móng
- [x] 0.1 Chốt schema phần lõi (mục 5, bảng tổ chức + issue + workflow) · M
- [x] 0.2 Migration viết tay + `prisma migrate deploy` + kiểm drift rỗng · M
- [x] 0.3 `permissions.ts` + bộ test quyền cho 6 vai trò (bảng quyền đầy đủ) · M
- [x] 0.4 `applyIssueChange()`: ghi lịch sử + phát socket + hook tự động/thông báo (rỗng) · M
- [x] 0.5 `work.socket.ts`: xác thực, vào phòng dự án có kiểm quyền · S
- [x] 0.6 Khung route `/api/v1/work`, mount, smoke-test · S
- **Nghiệm thu:** test quyền xanh; hai người tạo thẻ cùng lúc không trùng số (test chạy thật).
- ✅ **Đã nghiệm thu 23/09/2026:** 35 unit test + 10 test trên DB thật (`WORK_DB_TEST=1 npx tsx
  --test src/services/work/issueChange.db.test.ts`): 20 lệnh tạo thẻ đồng thời ra số 1..20 không
  trùng; vòng đời Bug chặn Fixed → Closed; version cũ trả 409; xoá dự án dây chuyền chạy được.
  Route: không token 401, có token 200. Socket: người trong dự án nhận `issue.created`, người
  ngoài bị từ chối vào phòng và không nhận gì.
- ⚠️ Hai bẫy Postgres đã gặp (ghi ở migration `…fk_no_action` và `…issue_fk_deferred`): RESTRICT
  kiểm ngay lập tức nên chặn xoá dây chuyền; và một dòng bị cập nhật 2 lần trong cùng câu lệnh thì
  mọi khoá ngoại bị kiểm lại ⇒ khoá ngoại của `work_issues` phải `DEFERRABLE INITIALLY DEFERRED`.
  Thêm khoá ngoại mới vào `work_issues` thì cũng phải cho nó DEFERRABLE.

### Đợt 1 — Lõi: dự án, thẻ, board
- [x] 1.1 Workspace + dự án + mời thành viên (email/link) + vai trò · L
- [x] 1.2 CRUD thẻ, loại thẻ, cha-con, liên kết, nhãn, component · L
- [x] 1.3 Trang chi tiết thẻ: TipTap, @nhắc, bình luận, đính kèm, lịch sử, watcher · L
- [x] 1.4 Board Kanban kéo thả, WIP, lọc nhanh, cập nhật thời gian thực · L — ⚠️ **swimlane CHƯA làm**, dời sang 5.5 (cấu hình board)
- [x] 1.5 Dạng danh sách (bảng, lọc lưu trên URL, phím j/k) · M — ⚠️ **sửa tại chỗ + sửa hàng loạt CHƯA làm**, dời sang 2.1
- [x] 1.6 Thông báo trong web cho giao việc/@nhắc/bình luận · M
- [x] 1.7 Mẫu dự án Trống + SWP391 · S
- [x] 1.8 Phím tắt (`c` tạo thẻ, `/` tìm, `j/k` di chuyển) + ⌘K · S
- **Nghiệm thu:** hai trình duyệt, hai tài khoản: kéo thẻ bên này, bên kia thấy trong 1 giây;
  Viewer bấm sửa thì API trả 403 (không chỉ ẩn nút).
- ✅ **Đã nghiệm thu 23/09/2026:** 16 test API qua HTTP + DB thật (quyền 6 vai trò, mời, @nhắc,
  thông báo, liên kết, xoá, đính kèm từ chối khoá lạ); Playwright chạy thật 14 bước trên bản build
  production (tạo không gian → dự án SWP391 → thẻ bằng phím `c` → thêm nhanh → kéo sang In Progress
  (API xác nhận) → ngăn kéo → bình luận @nhắc (người được nhắc nhận WORK_MENTION) → đổi ưu tiên →
  lịch sử → danh sách → trang thẻ → mời → cài đặt → ⌘K → nền sáng → điện thoại 390px không cuộn ngang).
- ⚠️ Thời gian thực 2 trình duyệt CHƯA thử trên giao diện: local không có proxy websocket
  (`socket.ts` nối vào origin của Next). Đã thử bằng script Node ở đợt 0 (socket nhận `issue.created`).
  Thử lại trên production sau khi deploy.
- Board Scrum khi chưa có sprint chạy ⇒ hiện mọi thẻ mở + dải thông báo (`fallback`), để đợt 1 dùng
  được trước khi có Backlog/Sprint ở đợt 2.

### Đợt 2 — Scrum
- [x] 2.1 Backlog: xếp hạng kéo thả, nhóm theo epic, ước lượng point · M — kèm chọn nhiều + sửa hàng loạt (nợ từ 1.5)
- [x] 2.2 Sprint: tạo, bắt đầu, kết thúc, chuyển việc dở, sprint goal · M
- [x] 2.3 Ảnh chụp cuối ngày (cron) + burndown/burnup + velocity · M
- [x] 2.4 Báo cáo sprint, báo cáo epic · M
- [x] 2.5 Trang đóng góp thành viên (thẻ xong, point, bình luận, theo thời gian) · M
- [x] 2.6 Mẫu SWR302 · S
- **Nghiệm thu:** burndown khớp số tính tay trên một sprint mẫu có đổi phạm vi giữa chừng.
- ✅ **Đã nghiệm thu 23/09/2026:** 10 test DB (`work.sprints.db.test.ts`): điểm cam kết không tính việc
  con, chỉ một sprint chạy (409), thêm/bỏ thẻ giữa sprint so với DANH SÁCH CAM KẾT lúc bấm Start (test
  bắt được bản đầu so theo ngày `startAt` — sai khi người dùng chọn ngày bắt đầu lùi về quá khứ),
  đóng sprint dời thẻ chưa xong + việc con chưa xong, velocity, epic, đóng góp không tính AI, sửa hàng
  loạt báo lỗi riêng từng thẻ. Playwright 16 bước trên bản build: backlog → tạo sprint → kéo thẻ vào
  sprint → chọn nhiều + chuyển hàng loạt → sửa điểm tại dòng → Start (có mục tiêu) → board → kéo sang
  Done (API xác nhận) → burndown → Complete từ board → 5 tab báo cáo → nền sáng → điện thoại 390px.
- ⚠️ Bẫy CSS: `work.css` nạp SAU Tailwind ⇒ `.w-btn{display}` thắng `hidden`. Dùng `max-md:!hidden`.
  KHÔNG bọc work.css trong `@layer` (preflight của Tailwind sẽ xoá nền/viền mọi nút).
- ⚠️ Kịch bản Playwright: đợi `#app-splash` biến mất (~1s sau tải trang) trước khi kéo thả.

### Đợt 3 — Kiểm thử (thay Xray, phục vụ SWT301)
- [x] 3.1 Test case: bước, dữ liệu, kết quả mong đợi, Gherkin, nhập từ CSV/Excel · L
- [x] 3.2 Test plan, test cycle, chạy test từng bước, đính kèm ảnh · L
- [x] 3.3 Fail → tạo Bug một chạm (điền sẵn bước, kết quả thực tế) · M
- [x] 3.4 Workflow bug có Retest; Fixed → tự tạo lượt chạy lại test liên quan · M
- [x] 3.5 Ma trận truy vết yêu cầu ↔ test ↔ bug, độ phủ, tỉ lệ đạt · M
- [x] 3.6 Xuất báo cáo kiểm thử (Excel theo mẫu hay dùng ở trường, PDF) · M
- [x] 3.7 Mẫu SWT301 · S
- **Nghiệm thu:** làm trọn một cycle mẫu 20 case; ma trận và tỉ lệ đạt khớp với đếm tay.

### Đợt 4 — AI
- [x] 4.1 Thêm `work_assistant`/`work_digest` vào cổng LLM + `WORK_DIGEST_ENABLED` · M
- [x] 4.1b Hạn mức AI: Pro đầy đủ, tài khoản thường hạn mức nhỏ theo ngày; hết → lỗi
      `WORK_AI_QUOTA_EXCEEDED` → hộp "Nâng cấp Pro để tiếp tục" · M
- [x] 4.2 Khung trợ lý: vòng lặp tool, tool đọc, thẻ ĐỀ XUẤT → Áp dụng · L
- [x] 4.3 Tool ghi đi qua `permissions.ts` + test "AI không vượt quyền người hỏi" · M
- [x] 4.4 Viết story/AC, tách việc, chấm INVEST, sinh test case, chuẩn hoá bug · L
- [x] 4.5 Hỏi bằng lời → bộ lọc (dịch sang truy vấn đợt 5; tạm dịch sang bộ lọc có cấu trúc) · M
- [x] 4.6 Embedding thẻ + phát hiện trùng + gợi ý người nhận · M
- [x] 4.7 Lập kế hoạch sprint theo velocity · M
- [x] 4.8 Bản tin sáng, cảnh báo rủi ro (mã tính, AI diễn đạt), nhắc việc có giờ im lặng · L
- [x] 4.9 Báo cáo tuần cho giảng viên/khách hàng · M
- [x] 4.10 Biên bản họp → việc, tóm tắt retro · M
- **Nghiệm thu:** `npm run llm:check` gọi thật hai purpose mới; một ngày chạy bản tin không
  vượt trần tiền; thử cố bảo AI sửa thẻ ở dự án mình chỉ là Viewer → bị từ chối.

### Đợt 5 — Tuỳ biến và tìm kiếm
- [x] 5.1 Workflow tuỳ chỉnh: sửa trạng thái, luồng chuyển, điều kiện (trình vẽ trực quan) · L
- [x] 5.2 Trường tuỳ chỉnh · M
- [x] 5.3 Ngôn ngữ truy vấn kiểu JQL: `assignee = me AND status != Done ORDER BY priority` · L
- [x] 5.4 Bộ lọc đã lưu, chia sẻ · S
- [x] 5.5 Dashboard kéo thả widget (biểu đồ, danh sách, số liệu) · L

### Đợt 6 — Kế hoạch dài hạn và tự động hoá
- [x] 6.1 Timeline/Gantt, phụ thuộc, đường găng · L
- [x] 6.2 Capacity theo người, ngày nghỉ · M
- [x] 6.3 Version/release + release notes AI · M
- [x] 6.4 Worklog, ước lượng giờ, báo cáo thời gian · M
- [x] 6.5 Luật tự động "khi… nếu… thì…" + nhật ký chạy + chống vòng lặp vô hạn · L
- [x] 6.6 Email thông báo + thư gộp hằng ngày · M

### Đợt 7 — Tích hợp, báo cáo, quản trị
- [x] 7.1 GitHub App/webhook: commit/nhánh/PR gắn thẻ theo mã `KEY-123`, merge → chuyển trạng thái · L
- [x] 7.2 Nhập CSV và file xuất của Jira; xuất CSV/Excel/PDF · M
- [x] 7.3 Audit log · M
- [x] 7.4 Lưu trữ/khôi phục dự án, xoá mềm thẻ, thùng rác · S
- [x] 7.5 Trang công khai chỉ đọc (gửi link cho giảng viên/khách không cần tài khoản) · M — **bắt buộc**
- [x] 7.6 API token cá nhân: tạo/thu hồi, chỉ hiện một lần, lưu dạng băm, phạm vi (đọc / ghi),
      hạn dùng, nhật ký lần dùng cuối; REST công khai `/api/v1/work/public/*` + tài liệu · M

### Đợt 8 — App
- [x] 8.1 App desktop: board, chi tiết thẻ, thông báo hệ thống, trợ lý AI · L
- [x] 8.2 iPad/iPhone: xem board, cập nhật trạng thái, thông báo đẩy · L


**Trạng thái 24/09/2026 (bàn giao đợt 3–8):** mọi mục trên đã làm và có test chạy thật
(`src/routes/work.*.db.test.ts`, 88 test trên Postgres) + E2E Playwright 19 bước cho giao diện
đợt 3–7. Khác kế hoạch ban đầu:
- 4.6 dùng **pg_trgm** thay embedding (không tốn lượt AI, đủ để bắt thẻ trùng).
- 4.8 bản tin AI chạy tay (nút "Generate brief") + cron 08:00 **mặc định TẮT** (`WORK_DIGEST_ENABLED`).
- 7.6 REST dùng chung `/api/v1/work/**` với Bearer `ctw_…` (không tách `/public/*`); link công khai
  chỉ đọc là `/work/share/<token>` (API `/api/v1/work/share/*`).
- 8.1 app desktop dùng lại 19 trang web; 8.2 iOS SwiftUI gốc (commit cục bộ ở kho ios-app,
  chưa lên TestFlight). Target macOS của ios-app vẫn hỏng từ trước (10/09), không do CT Work.

### Đợt S1 — lớp studio (04/10/2026, BACKEND; giao diện làm ở phiên khác)

Nguyên tắc: **loại dự án** (PERSONAL · SCHOOL · SOFTWARE · CLIENT) + **mô-đun bật/tắt theo
dự án** (`settings.modules`; hàm chung `moduleOn` / `assertModule` trong
`src/services/work/studio.ts`). Dự án tạo trước đợt này: cột `kind` NULL (loại suy từ mẫu lúc
đọc, không ghi ngược), **không có `settings.modules` ⇒ mọi mô-đun TẮT, hành vi y như cũ**
(route mô-đun ⇒ 403 `MODULE_DISABLED`; test `work.studio.db.test.ts` giữ điều này).
Migration `20261004100000_work_studio_s1` chỉ THÊM (1 cột nullable work_projects, 2 cột nullable
work_issues, 7 bảng); mọi FK trên/vào `work_issues` + FK SET NULL của bảng studio đều DEFERRABLE.

- [x] S1.A Loại dự án + mô-đun: `kind` khi tạo dự án (có `kind` ⇒ mặc định theo loại, CLIENT bật
      teams/stages/approvals/handoffs; không có ⇒ tắt hết như client cũ), `GET/PUT /projects/:pid/studio`
      (ADMIN dự án, audit `project.studio`), khoá chừa cho đợt sau: docs, clientPortal, changeRequests,
      raid, meetings, finance · M
- [x] S1.B Bộ phận cấp không gian (`work_teams`, `work_team_members` LEAD/MEMBER, khách không vào được),
      thẻ có `teamId`, hàng đợi bộ phận (lọc dự án/trạng thái/chưa người nhận, phân trang), trưởng bộ phận
      giao việc trong hàng đợi, JQL `team` (+ `stage`) · M
- [x] S1.C Giai đoạn + cổng (`work_stages`, thẻ có `stageId`): kích hoạt bị chặn khi giai đoạn trước chưa
      DONE (ADMIN ghi đè có lý do ⇒ audit `stage.override`); DONE CHỈ qua phê duyệt cổng; người duyệt cổng
      cấu hình ở `settings.stageGate` (mặc định ADMIN dự án) · M
- [x] S1.C' `WorkTransition.rules` dùng thật: `{ requireApproval, teamIds }` (kiểm trong `applyIssueChange`,
      chỉ với người/AI; ADMIN vượt luật bộ phận, KHÔNG vượt luật phê duyệt) · S
- [x] S1.D Phê duyệt (`work_approvals` + `work_approval_steps`): ISSUE | STAGE_GATE (chừa DOC, CR), tuần tự /
      song song, một phiếu chống ⇒ REJECTED, không ai duyệt thay (kể cả ADMIN), mỗi bước lưu IP +
      `contentHash` SHA-256 (chữ ký); nội dung đổi sau khi ký ⇒ `contentChanged` (cảnh báo, không tự huỷ);
      "chờ tôi duyệt" `GET /me/approvals`; thông báo + realtime `approval.updated` + audit · L
- [x] S1.E Bàn giao (`work_handoffs`): checklist phải tick đủ mới nhận, nhận ⇒ đổi team/người qua
      `applyIssueChange` (lịch sử thẻ ghi lại), trả lại bắt buộc lý do, `GET /me/handoffs` · M
- [x] S1.E' Chuyển thẻ sang dự án khác cùng không gian (`POST …/issues/:num/move-project`): giữ id ⇒ bình
      luận/tệp/lịch sử/liên kết đi theo; số mới; việc con đi cùng; nhãn/component/trường ghép theo tên;
      mã cũ ⇒ 404 `WORK_ISSUE_MOVED` kèm mã mới (`work_issue_aliases`). Từ chối epic, việc con, thẻ Test,
      thẻ còn phê duyệt/bàn giao chờ · M
- [x] S1.F Board (2000) và backlog (3000) trả `truncated` + `total` + `limit` thay vì cắt im lặng · S
- [x] S1.G Phiếu khách → dự án `kind: CLIENT`: 14 bộ phận theo `roles` của
      `content/quy-trinh/client-project-template.json` (bỏ vai `client` — khách là GUEST), 21 giai đoạn
      (slug khớp `/about/quy-trinh/<slug>`, GĐ đầu ACTIVE, thẻ cổng gắn `gateIssueId`), việc gán `teamId` +
      `stageId`, **để trống người làm** (không còn giao hết cho admin; nhãn `vai:*` giữ lại) · M
- **Nghiệm thu 04/10/2026:** 17 test DB mới (`src/routes/work.studio.db.test.ts`) + 140/140 test DB CT Work
  (3 lượt liền) + `studio.test.ts` (luật thuần) trong `npm test`; chạy thật backend :3101 — phiếu → dự án
  CLIENT → duyệt cổng GĐ0 → kích hoạt GĐ1 → bàn giao BA→DEV nhận + trả lại → dự án SCHOOL cũ ⇒ MODULE_DISABLED.
- [ ] Giao diện cho S1 (phiên làm lại giao diện /work) · L
- [x] Đợt S2a: tài liệu kiểu Confluence (xem mục dưới) · [x] Đợt S2b: cổng khách duyệt (xem mục dưới) · [x] Đợt S3a: portfolio + workload · [x] Đợt S3b: CR + RAID,
      họp (xem mục dưới) · Đợt S4: tài chính, báo cáo khách tự động

### Đợt S2a — tài liệu dự án kiểu Confluence (04/10/2026, mô-đun `docs`)

Luật giữ dự án cũ: mọi route tài liệu gọi `assertModule(access, 'docs')`. Dự án tạo trước đợt này không có
`settings.modules.docs` ⇒ 403 `MODULE_DISABLED`, không đọc/ghi gì (test giữ: dự án cũ + School). `docs` bật mặc định
CHỈ cho dự án TẠO MỚI kèm `kind: CLIENT` (`defaultModulesFor`). Migration `20261004160000_work_docs_s2a` chỉ THÊM
(1 cột nullable `work_approvals.page_id` + 4 bảng), mọi FK mới DEFERRABLE INITIALLY DEFERRED.

- [x] S2a.A Mô hình: `work_pages` (cây parentId + position, số theo dự án, TipTap + chữ trơn, status
      DRAFT/IN_REVIEW/APPROVED/ARCHIVED, visibility INTERNAL/CLIENT, owner, templateKey, stageId, `version` chống đè,
      xoá mềm), `work_page_versions` (CREATE/EDIT/RESTORE/MANUAL; lưu liên tiếp của cùng người trong 10 phút gộp vào
      bản EDIT cuối; giữ 100 bản), `work_page_issue_links` (hai chiều), `work_page_comments` (@nhắc ⇒ WORK_MENTION) · M
- [x] S2a.B API `/projects/:pid/pages…`: cây (khách thấy trang CLIENT dưới trang nội bộ ⇒ nổi lên gốc), CRUD, kéo thả
      (`/move`, chặn vòng, sâu tối đa 10), phiên bản (liệt kê/xem/so sánh dòng Markdown phía server/khôi phục),
      liên kết thẻ (+ `/issues/:num/pages`), bình luận, tìm trong dự án + `/work/search/docs` (mọi dự án bật docs),
      `/markdown` (xuất .md), thư viện mẫu `/doc-templates`. Realtime `page.updated` (chỉ id/số, không tiêu đề);
      audit `page.create|update|delete|restore` (không ghi mỗi lần tự lưu) · L
- [x] S2a.C Quyền (permissions.ts `docAccess` / `canViewPage` / `canManagePage`): xem = thành viên; vai CLIENT và
      GUEST (trừ TEACHER) chỉ trang CLIENT, trang khác 404; sửa = MEMBER+; xoá/khôi phục/đổi hiển thị = chủ trang hoặc
      ADMIN; VIEWER/TEACHER chỉ xem · M
- [x] S2a.D Phê duyệt tài liệu: `approvals.service` targetType `DOC` (`pageId`), hash = tiêu đề + chữ trơn
      (`approvalContent.pageContent`); gửi ⇒ IN_REVIEW, duyệt ⇒ APPROVED, từ chối/huỷ ⇒ DRAFT; sửa sau duyệt ⇒
      `contentChanged` (cảnh báo, không đổi trạng thái); người duyệt phải ĐỌC được trang (khách chỉ duyệt trang CLIENT) · M
- [x] S2a.E 36 mẫu Markdown ⇒ TipTap (remark-parse + remark-gfm có sẵn; bảng GFM ⇒ bảng TipTap, `#####` ⇒ mức 4).
      Ảnh Docker backend KHÔNG có `frontend/public` ⇒ bản sao ở `content/quy-trinh/mau/*.md` + `catalog.json`
      (tên EN/VI khớp DOCS của data.ts); `docs.test.ts` bắt lệch hai nơi. Ánh xạ mẫu ↔ giai đoạn đọc từ link
      `/quy-trinh/mau/<key>.md` trong `client-project-template.json` (không chép tay) · M
- [x] S2a.F Phiếu khách → dự án CLIENT có sẵn cây tài liệu: "Project documents" → 21 trang giai đoạn (gắn `stageId`)
      → mẫu của giai đoạn (mẫu dùng ở nhiều giai đoạn chỉ tạo MỘT trang, giai đoạn sau trỏ link tới) = 57 trang · S
- [x] S2a.G Giao diện: mục "Docs" ở thanh bên (chỉ khi mô-đun bật), `/docs` (cây kéo thả + menu ⋯ cho điện thoại/bàn
      phím, tổng quan + tìm toàn văn), `/docs/[num]` (RichEditor chế độ `docs` có bảng, tự lưu + "Saved", xung đột 409
      không đè, trạng thái/hiển thị/chủ/giai đoạn, phê duyệt dùng lại hộp S1, lịch sử so sánh + khôi phục, bình luận,
      xuất .md), thư viện mẫu, "Linked docs" trong chi tiết thẻ, tài liệu theo giai đoạn ở trang Stages, dải "Docs" ở
      /work/search, bài trợ giúp "Project docs" (song ngữ), tuyến app desktop `docs`, `docs/:num` · L
- **Nghiệm thu 04/10/2026:** `docs.test.ts` (55 phép: 36 mẫu thật hợp lệ với schema TipTap của editor, đồng bộ
  nguồn mẫu, quyền theo vai, so sánh dòng) trong `npm test`; `work.docs.db.test.ts` 11 test DB; 151/151 test DB CT Work;
  E2E Playwright (backend :3131 + Next :3130): phiếu → dự án Client có cây theo giai đoạn → mở SRS → sửa ⇒ phiên bản
  mới → so sánh → khôi phục → xin duyệt → duyệt → sửa ⇒ cảnh báo lệch → liên kết thẻ → dự án School không có Docs;
  0 lỗi JS, 0 tràn ngang 390px; ảnh `~/Desktop/ct-work-ui/s2a/`. Bắt được nhờ E2E: `setEditable()` của TipTap bắn
  'update' lúc mở ⇒ mở trang là tự lưu (đã chặn ở RichEditor + server bỏ qua lưu y nguyên).

### Đợt S2b — cổng khách (04/10/2026, mô-đun `clientPortal`)

Chuẩn tham chiếu: Jira Service Management (internal note vs reply to customer), Linear Customer Requests,
Basecamp client access. Bật mặc định cho dự án CLIENT MỚI (`defaultModulesFor`); dự án cũ (không có
`settings.modules.clientPortal`) y nguyên — vai CLIENT ở đó vẫn thấy mọi thẻ như trước. Migration
`20261004180000_work_portal_s2b` chỉ THÊM (cột có mặc định an toàn + bảng `work_uat_requests`, FK SET NULL DEFERRABLE).

- [x] S2b.A Cách ly khách — MỘT luật: "khách bị cách ly" = vai CLIENT + clientPortal (`permissions.isClientScoped`).
      Chốt tuyến DANH SÁCH TRẮNG cho mọi `/projects/:pid/**` (`clientPortalRouteAllowed`, work.routes.ts — tuyến thêm sau
      mặc định bị chặn với khách ⇒ 403 `CLIENT_PORTAL_ONLY`). Tuyến được mở tự lọc: board/list/JQL/chi tiết (thẻ
      `clientVisible`, liên kết/việc con/tệp đã chia sẻ, ẩn điểm/giờ/số đếm nội bộ), bình luận PUBLIC, tệp clientVisible,
      trang CLIENT + thẻ liên kết đã chia sẻ, phê duyệt có khách đứng tên (ẩn ghi chú người duyệt nội bộ), cấu hình dự án rút gọn.
      Cấp không gian: thành viên (chỉ người trong dự án của khách), đếm dự án/thành viên, ngày nghỉ (chỉ của mình), tìm
      kiếm xuyên dự án + My work + lịch .ics (loại dự án khách), bộ phận (GUEST đã bị chặn từ S1) · L
- [x] S2b.B Bình luận `visibility` INTERNAL (mặc định) | PUBLIC; khách luôn PUBLIC; PUBLIC chỉ trên thẻ đã chia sẻ; AI luôn
      INTERNAL. Thông báo: `portalNotify.routeForClient` là CỬA CUỐI của `notifyWork` (khách chỉ nhận trả lời PUBLIC / phê
      duyệt của mình / tin cổng; link viết lại vào /portal); realtime: khách vào phòng riêng `work:project:<id>:client`,
      chỉ nhận `portal.changed` không dữ liệu; email khách riêng (thương hiệu "<Dự án> · Client portal"); link công khai
      của dự án bật cổng chỉ lộ thẻ đã chia sẻ; báo cáo tuần AI audience client chỉ dùng thẻ đã chia sẻ · M
- [x] S2b.C Cổng `/work/<ws>/<KEY>/portal`: Overview (giai đoạn tên+trạng thái+%, mốc, chờ khách), Requests (khách gửi
      ⇒ thẻ `from-client` clientVisible vào hàng đợi QA/BA/PM), Approvals, Documents, Deliverables, Activity (chỉ sự kiện
      công khai); nhân viên: mời khách (vai CLIENT, GUEST không gian, thư riêng, chấp nhận ⇒ vào thẳng cổng), "Preview as
      client" (`?as=client` phía API, chỉ đọc). Thanh bên của khách chỉ còn "Client portal"; trang nội bộ tự chuyển về cổng · L
- [x] S2b.D UAT sign-off: `WorkApproval` targetType UAT + `work_uat_requests` (hạng mục = thẻ đã chia sẻ, tài liệu CLIENT,
      tệp, version/giai đoạn, lần thứ mấy); khách Approve (+ điều kiện) / Reject (lý do + điểm ⇒ thẻ BUG/CR); chữ ký =
      SHA-256 cả bộ (`approvalContent.uatContent`); biên bản in được `/portal/uat/<id>` theo mẫu bien-ban-nghiem-thu-uat.md
      (window.print, không thêm thư viện) · M
- [x] S2b.E Trang tra cứu phiếu: khách có tài khoản và là khách của dự án ⇒ `progressUrl` = cổng; chưa có ⇒ link chỉ đọc cũ.
      Help: "Client portal", "Internal notes vs client replies", "UAT sign-off" (song ngữ) · S
- **Nghiệm thu 04/10/2026:** `portal.test.ts` (bảng tuyến khách: mở/chặn, luật bình luận, email) trong `npm test`;
  `work.portal.db.test.ts` 11 test DB (cách ly trong dự án, 32 tuyến ⇒ CLIENT_PORTAL_ONLY, khách A dò dự án B / dự án nội bộ /
  thành viên / tìm kiếm / tệp, email + chuông không lộ ghi chú nội bộ, xem trước khớp khách, UAT 2 lần + biên bản, link công khai,
  tra cứu phiếu); 168/168 test DB CT Work; E2E Playwright (backend :3141 + Next :3140) ảnh `~/Desktop/ct-work-ui/s2b/`
  (0 lỗi JS, 0 tràn ngang 390px).
- [x] **Vá rủi ro lộ dữ liệu S2b (04/10/2026)** — 7 test DB mới trong `work.portal.db.test.ts` (18/18; 175/175 test DB CT Work):
      (1) phê duyệt ISSUE/DOC nêu khách duyệt thẻ chưa `clientVisible` / trang không CLIENT ⇒ 400 `WORK_APPROVER_NOT_CLIENT_VISIBLE`;
      đối tượng bị bỏ chia sẻ SAU khi gửi ⇒ khách thấy "Item no longer shared" (không mã/tiêu đề/mô tả, mọi đường: /approvals,
      /portal/approvals, overview, activity), quyết ⇒ 409 `WORK_ITEM_NOT_SHARED`; STAGE_GATE ⇒ khách chỉ thấy "Stage gate: n. tên"
      (`approvalForClient`). (2) MỘT hàm lọc người `clientPeople.ts` (`clientPeopleIds`): mình + khách cùng dự án + lead + người có
      tương tác công khai (tác giả reply PUBLIC, assignee thẻ đã chia sẻ, người duyệt/người gửi phê duyệt có khách) — áp cho thành
      viên dự án/không gian, gợi ý @, reporter/uploader/chủ trang/cảm xúc (ngoài tập ⇒ "Project team", id 0), activity, bảng tra JQL.
      (3) MEMBER không gian chỉ mang vai CLIENT ở dự án cổng (không dòng dự án tường minh nào khác) ⇒ vai hiệu lực GUEST
      (`portalOnlyWorkspaceIds` / `effectiveWorkspaceRole`, áp ở loadWorkspaceRole, loadProjectAccess, projectMembers, My work, tìm
      kiếm, /workspaces, thông báo, bộ phận, workload). Vừa khách A vừa có vai tường minh ở B ⇒ vẫn là nhân viên, A bị loại khỏi mọi
      đường xuyên dự án. Vai NGẦM (dự án mở cho không gian) không tính là nhân viên. (4) portfolio/workload: test cho GUEST, MEMBER bị
      hạ, người vừa-khách-vừa-nhân-viên. (5) URL tải tệp ký cho khách hạn 120 s (nhân viên 600 s) — URL đã cấp không thu hồi được.

### Đợt S3a — danh mục dự án (portfolio) + khối lượng việc nhiều dự án (04/10/2026, chỉ đọc)

Không bảng mới, không migration, không ghi gì. Luật thuần ở `src/services/work/portfolioRules.ts` (test
`portfolio.test.ts`), đọc DB ở `portfolio.service.ts`, tuyến ở `src/routes/work.portfolio.routes.ts` (gắn một dòng
`router.use` cuối `work.routes.ts`). Không AI, không số bịa: mọi màu đều kèm lý do trỏ đúng một con số.

- [x] S3a.A `GET /workspaces/:wsId/portfolio[?includeArchived=true]`: mỗi dự án người xem mở được (`effectiveProjectRole`;
      dự án mà người xem là khách cổng S2b bị loại): loại, lead, thẻ mở/quá hạn/xong 14 ngày (tầng 0), sprint đang chạy +
      tốc độ (`activeSprintPace`), giai đoạn hiện tại + % (chỉ khi mô-đun stages bật), phê duyệt chờ + tuổi, mốc (version
      UNRELEASED có ngày), phụ thuộc BLOCKS liên dự án chưa xong (phía người xem không mở được ⇒ `hidden`, không mã/tiêu đề),
      dải mốc gộp (trễ + 90 ngày tới), luật bằng chữ `rules` · M
- [x] S3a.B Luật RAG (`ragOf`): ĐỎ = mốc quá ngày · sprint hết hạn còn việc · sprint AT_RISK cần ≥ 2× tốc độ gần đây (hoặc
      chưa đốt được gì) · ≥ 10 thẻ quá hạn hoặc ≥ 3 và ≥ 25% số mở. VÀNG = sprint AT_RISK nhẹ · có thẻ quá hạn · mốc ≤ 7 ngày
      mà xong < 80% · thẻ bị chặn bởi dự án khác · phê duyệt chờ > 3 ngày. XANH = không dính luật nào. TOO_EARLY/NO_ESTIMATES
      không phải tín hiệu rủi ro · S
- [x] S3a.C `GET /workspaces/:wsId/workload?from&to&teamId&projectId&hoursPerPoint` (≤ 26 tuần, tuần T2→CN): giờ còn lại =
      remaining → original − đã ghi → điểm × h/điểm (mặc định 4) → 0 ("not estimated"); thẻ cha có việc con ước lượng ⇒ 0;
      rải đều ngày làm việc từ max(bắt đầu, hôm nay) tới hạn, quá hạn dồn vào ngày làm việc gần nhất; không hạn ⇒ đếm
      "unscheduled". Năng lực = tổng `capacityHours` các dự án (chưa đặt ⇒ 8h/ngày) × ngày T2–T6 từ hôm nay − WorkTimeOff.
      Quá tải = tuần > 100% (hoặc có việc mà năng lực 0). Gộp theo bộ phận. Quyền: OWNER/ADMIN = mọi người; LEAD = người
      trong bộ phận mình dẫn + mình; còn lại (kể cả GUEST) = chính mình; lọc team không được xem ⇒ 403; chỉ tính thẻ trong
      dự án người xem thấy (`visibleProjectIds`) · M
- [x] S3a.D Giao diện `/work/[ws]/portfolio` (dải đếm theo màu = bộ lọc, lọc loại/lead, sắp xếp, bảng ≥lg / thẻ trên điện
      thoại, chấm RAG rê/chạm ⇒ lý do, "How is health computed?", dải mốc, danh sách chặn liên dự án) + `/work/[ws]/workload`
      (lưới người × tuần tô màu theo %, ô quá tải viền đỏ, bấm ô ⇒ thẻ của tuần, tuần trước/sau, 2–12 tuần, lọc bộ phận/dự án,
      1 pt = …h, "How is load computed?"). Mục sidebar Portfolio/Workload chỉ hiện với người không phải khách. Bài trợ giúp
      "Portfolio & workload" (song ngữ). Tuyến app desktop `portfolio`, `workload` · M
- **Nghiệm thu 04/10/2026:** `portfolio.test.ts` 14 phép (luật RAG, quy đổi giờ, rải ngày, tải tuần) trong `npm test`;
  `work.portfolio.db.test.ts` 6 test DB (RAG + lý do, ẩn dự án PRIVATE với thành viên, giảng viên GUEST chỉ thấy dự án mình,
  khách cổng rỗng, người ngoài 404, quá tải/năng lực/bộ phận, thành viên chỉ thấy mình + lọc bộ phận 403, lead thấy bộ phận);
  168/168 test DB CT Work; E2E Playwright (backend :3151 + Next :3150, 5 dự án mẫu đỏ/vàng/xanh): 28 kiểm, 0 lỗi JS, 0 tràn
  ngang 390px; ảnh `~/Desktop/ct-work-ui/s3a/`.

### Đợt S3b — yêu cầu thay đổi (CR) · sổ RAID · cuộc họp (04/10/2026, mô-đun `changeRequests`, `raid`, `meetings`)

Chuẩn tham chiếu: PMBOK 7 (Perform Integrated Change Control, miền Uncertainty — risk register), PRINCE2 (Issue/Risk
Register, change authority), sổ RAID. Bật mặc định cho dự án CLIENT MỚI (`STUDIO_MODULES_S3B` trong `defaultModulesFor`);
dự án cũ (không có khoá) ⇒ 403 `MODULE_DISABLED`, không đổi gì. Migration `20261004200000_work_s3b` chỉ THÊM (1 cột nullable
`work_approvals.change_request_id` + 8 bảng), mọi FK mới DEFERRABLE INITIALLY DEFERRED. Tuyến ở `src/routes/work.governance.routes.ts`
(một dòng `router.use` cuối work.routes.ts — đi qua chốt cổng khách). Quyền MỘT hàm: `permissions.governanceAccess` (khách
CLIENT/GUEST trừ TEACHER không thấy; VIEWER/TEACHER xem; MEMBER+ sửa) + `governanceDb.govCtx` (403 `WORK_INTERNAL_ONLY`).

- [x] S3b.A CR = ĐỐI TƯỢNG RIÊNG `work_change_requests` (không phải loại thẻ/cờ trên thẻ: loại thẻ là dữ liệu từng dự án,
      đụng JQL/board/xuất Jira, và CR sẽ lộ chi phí lên board/cổng khách). Phân tích ảnh hưởng có cấu trúc (phạm vi, +ngày,
      chi phí số + đơn vị tự do — không tính giá/không quy đổi, rủi ro, phương án thay thế, lý do, mức khẩn), liên kết
      `work_change_request_links` AFFECTED (thẻ/giai đoạn/version) | IMPLEMENTS (thẻ thực hiện), `sourceIssueId`. Luồng
      Draft → Submitted → Under review → Approved/Rejected → Implemented; trạng thái duyệt CHỈ do phê duyệt đặt
      (`approvals.createCrApproval`, targetType CR, hash = `approvalContent.crContent` — IMPLEMENTS không vào hash; huỷ ⇒ Submitted).
      Khách duyệt được khi CR `clientVisible` + cổng bật (cổng hiện phân tích qua `crForClient`). Duyệt xong ⇒ đề xuất thẻ tất
      định (thẻ chính + thẻ cập nhật mỗi thẻ bị ảnh hưởng) → sửa/bỏ chọn → "Create issues". Sổ CR: lọc trạng thái, tổng +ngày,
      chi phí theo đơn vị. Mô tả khung từ `phieu-yeu-cau-thay-doi.md` (phần 1–2) · L
- [x] S3b.B RAID `work_raid_items` (+ `work_raid_links` thẻ/giai đoạn/CR, `work_raid_history` từng trường): Risk/Assumption/Issue/
      Dependency, chủ sở hữu, trạng thái theo loại (Assumption: Unvalidated/Validated/Invalid), L × I (1–5) ⇒ điểm khi đọc
      (≥15 cao · 8–14 TB · ≤7 thấp — theo `so-dang-ky-rui-ro.md`), phản ứng Avoid/Mitigate/Transfer/Accept, kế hoạch, trigger,
      nhóm, ngày xem lại. "Starter risks" đọc bảng R01… của mẫu. Nhắc "review due": cron 08:10 VN (`runRaidReviewReminders`,
      không LLM) — mỗi ngày xem lại nhắc ĐÚNG MỘT lần (`reviewNotifiedFor`), người gửi chuông ≠ người nhận (lead/ADMIN), dự án
      một người ⇒ chỉ email · M
- [x] S3b.C Họp `work_meetings` (+ `work_meeting_attendees`, `work_meeting_actions`): 8 loại, giờ UTC + múi giờ IANA, địa điểm,
      link Meet/Zoom/Teams (chỉ lưu), agenda + biên bản TipTap (chế độ docs), quyết định, việc cần làm (người + hạn) ⇒ "Create
      issues" (bỏ qua việc đã có thẻ), gợi ý AI tái dùng `meeting_notes` chỉ trả ĐỀ XUẤT, trạng thái Scheduled/Done/Cancelled,
      "Duplicate next week", kick-off ⇒ agenda + khung biên bản từ `bien-ban-kick-off.md`. `.ics` RFC 5545 (`ics.ts` dùng chung
      với lịch cá nhân): email mời kèm tệp + nút tải; lịch đăng ký cá nhân thêm họp có mời mình. ATTENDEE chỉ mang email của
      CHÍNH người nhận (người khác `urn:ctwork:user:<id>`), ORGANIZER = địa chỉ gửi của hệ thống. "Share notes with client" ⇒
      khách được mời thấy agenda/biên bản/quyết định/việc (không mã thẻ) qua `/portal/meetings/**` — đã nằm trong danh sách trắng
      `/portal/**`, KHÔNG thêm mẫu tuyến khách. `clientPeople` thêm người tổ chức + người được mời của họp có khách · L
- [x] S3b.D Giao diện: sidebar "Meetings", "Changes", "RAID" (theo mô-đun); `/meetings` (+`[num]`), `/changes` (+`[num]`), `/raid`
      (thẻ theo loại, ma trận 5×5 bấm ô ⇒ lọc, review due, hộp chi tiết + lịch sử); khu "Change requests" + "Risks & RAID" trong
      chi tiết thẻ; widget dashboard "Top risks"; thẻ "Meetings" ở cổng khách; help "Change requests", "RAID log", "Meetings"
      (song ngữ); module bật/tắt trong Project settings; tuyến app desktop (+5) · L
- [x] S3b.E Portfolio (`portfolioRules.ragOf`): rủi ro OPEN điểm ≥ 20 ⇒ ĐỎ (`RISK_CRITICAL`), ≥ 15 ⇒ VÀNG (`RISK_HIGH`), CR chờ
      quyết định > 5 ngày ⇒ VÀNG (`CR_WAITING`); chỉ khi mô-đun bật và người xem đọc được sổ · S
- **Nghiệm thu 04/10/2026:** `governance.test.ts` 27 phép (vòng đời CR, tổng, điểm/mức/ma trận, mẫu, .ics: escape `,` `;`
  `\n`, gập ≤ 75 octet không cắt UTF-8, DTSTART/DTEND/UID/ORGANIZER/ATTENDEE, quyền, danh sách trắng, RAG mới) trong `npm test`;
  `work.s3b.db.test.ts` 12 test DB (dự án cũ MODULE_DISABLED, khách CLIENT_PORTAL_ONLY / WORK_INTERNAL_ONLY, CR duyệt + lệch
  hash + khách duyệt qua cổng, thẻ thực hiện, RAID + portfolio đỏ/vàng, nhắc một lần, họp + email .ics + biên bản chia sẻ +
  lịch cá nhân, nhân bản); 187/187 test DB CT Work; E2E Playwright (backend :3161 + Next :3160): 30 kiểm, 0 lỗi JS, 0 tràn
  ngang 390px; ảnh `~/Desktop/ct-work-ui/s3b/`.

## 10. Rủi ro

| Rủi ro | Cách giữ |
|---|---|
| Phạm vi quá lớn, làm dở dang nhiều thứ | Mỗi đợt tự đứng được và deploy được; không mở đợt mới khi đợt cũ chưa nghiệm thu |
| Lộ dữ liệu giữa các nhóm/khách | Một chỗ kiểm quyền + test quyền tự động + test AI vượt quyền |
| Chi phí AI trôi | Hai purpose riêng, hạn mức theo dự án, trần tiền, cảnh báo tính bằng mã |
| Hai người sửa một thẻ cùng lúc | Ghi theo từng trường + phiên bản (`updatedAt`), xung đột thì báo và cho chọn |
| Board chậm khi dự án lớn | Chỉ tải thẻ của sprint/bộ lọc hiện tại, phân trang backlog, chỉ mục DB theo `(projectId, statusId, rank)` |
| Giảng viên bắt buộc dùng Jira thật | Đợt 7.2 xuất/nhập được với Jira, nên dữ liệu không bị kẹt |
| Luật tự động gọi nhau vô hạn | Giới hạn độ sâu kích hoạt + nhật ký chạy |

## 11. Quyết định đã chốt (23/09/2026)

1. Tên **CT Work**, đường dẫn `/work`.
2. **Mọi tài khoản** dùng được phần quản lý dự án. **AI đầy đủ chỉ cho Pro**; tài khoản
   thường có **hạn mức AI nhỏ**, hết thì hiện thông báo "Nâng cấp Pro để tiếp tục" kèm nút
   tới trang Pro. Hạn mức kiểm ở backend (trả mã lỗi riêng `WORK_AI_QUOTA_EXCEEDED`),
   giao diện chỉ hiển thị — không được chặn bằng giao diện.
3. Link công khai chỉ đọc (7.5) làm **cuối cùng nhưng BẮT BUỘC làm**.
4. **API token cá nhân** (giống "email + API token" của Jira): thêm vào đợt 7 (task 7.6).
   App của CT Work đăng nhập bằng tài khoản web như mọi app khác, KHÔNG bắt nhập token.
   Token chỉ dành cho công cụ bên ngoài: GitHub Actions đẩy kết quả test, script, Claude
   Code/MCP đọc-ghi thẻ.

5. **Toàn bộ sản phẩm bằng TIẾNG ANH** (chốt 23/09): mọi chữ trên giao diện web/app, thông
   báo lỗi API, email, thông báo, mẫu dự án, dữ liệu mẫu. Trợ lý AI mặc định trả lời tiếng
   Anh, nhưng người dùng viết tiếng Việt thì AI trả lời tiếng Việt. Chú thích trong mã vẫn
   viết tiếng Việt theo quy ước của repo.

## 12. Cách làm an toàn khi nhiều phiên cùng sửa repo

Phát triển trên **nhánh `feat/ct-work` trong git worktree riêng**, không sửa thẳng cây làm
việc chính (đã có lần phiên khác quét nhầm `schema.prisma` đang dở vào commit của nó).
Schema và migration luôn commit **cùng một nhịp**. Mỗi đợt nghiệm thu xong mới merge vào
`main` và deploy.
