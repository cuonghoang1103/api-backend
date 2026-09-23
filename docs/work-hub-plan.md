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
- [ ] 3.1 Test case: bước, dữ liệu, kết quả mong đợi, Gherkin, nhập từ CSV/Excel · L
- [ ] 3.2 Test plan, test cycle, chạy test từng bước, đính kèm ảnh · L
- [ ] 3.3 Fail → tạo Bug một chạm (điền sẵn bước, kết quả thực tế) · M
- [ ] 3.4 Workflow bug có Retest; Fixed → tự tạo lượt chạy lại test liên quan · M
- [ ] 3.5 Ma trận truy vết yêu cầu ↔ test ↔ bug, độ phủ, tỉ lệ đạt · M
- [ ] 3.6 Xuất báo cáo kiểm thử (Excel theo mẫu hay dùng ở trường, PDF) · M
- [ ] 3.7 Mẫu SWT301 · S
- **Nghiệm thu:** làm trọn một cycle mẫu 20 case; ma trận và tỉ lệ đạt khớp với đếm tay.

### Đợt 4 — AI
- [ ] 4.1 Thêm `work_assistant`/`work_digest` vào cổng LLM + `WORK_DIGEST_ENABLED` · M
- [ ] 4.1b Hạn mức AI: Pro đầy đủ, tài khoản thường hạn mức nhỏ theo ngày; hết → lỗi
      `WORK_AI_QUOTA_EXCEEDED` → hộp "Nâng cấp Pro để tiếp tục" · M
- [ ] 4.2 Khung trợ lý: vòng lặp tool, tool đọc, thẻ ĐỀ XUẤT → Áp dụng · L
- [ ] 4.3 Tool ghi đi qua `permissions.ts` + test "AI không vượt quyền người hỏi" · M
- [ ] 4.4 Viết story/AC, tách việc, chấm INVEST, sinh test case, chuẩn hoá bug · L
- [ ] 4.5 Hỏi bằng lời → bộ lọc (dịch sang truy vấn đợt 5; tạm dịch sang bộ lọc có cấu trúc) · M
- [ ] 4.6 Embedding thẻ + phát hiện trùng + gợi ý người nhận · M
- [ ] 4.7 Lập kế hoạch sprint theo velocity · M
- [ ] 4.8 Bản tin sáng, cảnh báo rủi ro (mã tính, AI diễn đạt), nhắc việc có giờ im lặng · L
- [ ] 4.9 Báo cáo tuần cho giảng viên/khách hàng · M
- [ ] 4.10 Biên bản họp → việc, tóm tắt retro · M
- **Nghiệm thu:** `npm run llm:check` gọi thật hai purpose mới; một ngày chạy bản tin không
  vượt trần tiền; thử cố bảo AI sửa thẻ ở dự án mình chỉ là Viewer → bị từ chối.

### Đợt 5 — Tuỳ biến và tìm kiếm
- [ ] 5.1 Workflow tuỳ chỉnh: sửa trạng thái, luồng chuyển, điều kiện (trình vẽ trực quan) · L
- [ ] 5.2 Trường tuỳ chỉnh · M
- [ ] 5.3 Ngôn ngữ truy vấn kiểu JQL: `assignee = me AND status != Done ORDER BY priority` · L
- [ ] 5.4 Bộ lọc đã lưu, chia sẻ · S
- [ ] 5.5 Dashboard kéo thả widget (biểu đồ, danh sách, số liệu) · L

### Đợt 6 — Kế hoạch dài hạn và tự động hoá
- [ ] 6.1 Timeline/Gantt, phụ thuộc, đường găng · L
- [ ] 6.2 Capacity theo người, ngày nghỉ · M
- [ ] 6.3 Version/release + release notes AI · M
- [ ] 6.4 Worklog, ước lượng giờ, báo cáo thời gian · M
- [ ] 6.5 Luật tự động "khi… nếu… thì…" + nhật ký chạy + chống vòng lặp vô hạn · L
- [ ] 6.6 Email thông báo + thư gộp hằng ngày · M

### Đợt 7 — Tích hợp, báo cáo, quản trị
- [ ] 7.1 GitHub App/webhook: commit/nhánh/PR gắn thẻ theo mã `KEY-123`, merge → chuyển trạng thái · L
- [ ] 7.2 Nhập CSV và file xuất của Jira; xuất CSV/Excel/PDF · M
- [ ] 7.3 Audit log · M
- [ ] 7.4 Lưu trữ/khôi phục dự án, xoá mềm thẻ, thùng rác · S
- [ ] 7.5 Trang công khai chỉ đọc (gửi link cho giảng viên/khách không cần tài khoản) · M — **bắt buộc**
- [ ] 7.6 API token cá nhân: tạo/thu hồi, chỉ hiện một lần, lưu dạng băm, phạm vi (đọc / ghi),
      hạn dùng, nhật ký lần dùng cuối; REST công khai `/api/v1/work/public/*` + tài liệu · M

### Đợt 8 — App
- [ ] 8.1 App desktop: board, chi tiết thẻ, thông báo hệ thống, trợ lý AI · L
- [ ] 8.2 iPad/iPhone: xem board, cập nhật trạng thái, thông báo đẩy · L

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
