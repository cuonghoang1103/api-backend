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

**Không làm** (ngoài phạm vi, ghi rõ để khỏi trôi): chợ plugin, tự lưu trữ trên máy chủ khách (on-premise),
SSO SAML doanh nghiệp. ~~Service Desk/SLA kiểu Jira Service Management~~ — **đã làm ở Đợt S5a** (04/10/2026, người
dùng đổi ý: cần cho dự án nhận ngoài có hợp đồng bảo hành/vận hành) — xem mục "Đợt S5a".

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
      họp (xem mục dưới) · [x] Đợt S4: tài chính, báo cáo khách tự động, thuyết trình, xuất trọn dự án (xem mục dưới)
      · [x] Đợt S5a: service desk & SLA (xem mục dưới)
      · [x] Đợt S5c: hoàn thiện — mô-đun mới cho dự án cũ, thùng rác Docs, nhập lại dự án từ ZIP, AI đọc/ghi Docs (xem mục dưới)

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

### Đợt S4 — tài chính · báo cáo khách tự động · thuyết trình · xuất trọn dự án (04/10/2026, mô-đun `finance`, `reports`)

CHỈ THEO DÕI tiền — KHÔNG xuất hoá đơn (hoá đơn điện tử ở VN phải qua nhà cung cấp được cấp phép; câu này có ở UI Finance,
Payments, cổng khách, help, file .xlsx). Bật mặc định cho dự án CLIENT MỚI (`STUDIO_MODULES_S4` trong `defaultModulesFor`; khoá mới
`reports`); dự án cũ (không có khoá) ⇒ 403 `MODULE_DISABLED`, ghi giờ không bao giờ bị khoá. Xuất trọn KHÔNG phải mô-đun — quyền ADMIN dự án
(sao lưu là quyền). Migration `20261004220000_work_s4` chỉ THÊM (1 cột `work_raid_items.client_visible` mặc định false + 10 bảng), FK mới
DEFERRABLE INITIALLY DEFERRED; cột người KHÔNG FK tới users (số liệu kế toán sống lâu hơn tài khoản). Tuyến ở `src/routes/work.s4.routes.ts`
(một dòng `router.use` cuối work.routes.ts — qua chốt cổng khách; tuyến tải ZIP công khai ký HMAC gắn TRƯỚC authenticate).

- [x] S4.A Tài chính (`finance.service.ts`, luật thuần `financeRules.ts`): quyền MỘT hàm `financeAccess` — ADMIN dự án thấy đơn giá/chi phí/
      ngân sách/mốc; MEMBER chỉ giờ của mình; trưởng bộ phận (LEAD) duyệt giờ người trong bộ phận (không thấy tiền); VIEWER/TEACHER/khách/GUEST
      không gì (403 `WORK_FINANCE_FORBIDDEN`). Đơn giá DEFAULT/ROLE/TEAM/USER + ngày hiệu lực, ưu tiên USER → TEAM của thẻ → TEAM của người →
      ROLE → DEFAULT; đơn vị tiền theo dự án (VND mặc định | USD). Timesheet tuần T2→CN giờ VN trên WorkWorklog có sẵn: nộp ⇒ SUBMITTED (khoá
      ghi/xoá giờ của tuần — `assertWeekOpen` trong planning.service, 423 `WORK_TIMESHEET_LOCKED`), rút lại, lead/ADMIN duyệt ⇒ APPROVED + CHỤP
      từng dòng giờ kèm đơn giá (`work_timesheet_lines`, không FK thẻ/worklog — thẻ chuyển dự án/xoá thì số đã duyệt đứng nguyên), trả lại bắt
      buộc lý do, mở khoá tuần đã duyệt chỉ ADMIN + lý do ≥ 5 ký tự (audit `timesheet.reopen` kèm chi phí trước đó). Không tự duyệt (trừ ADMIN, có
      ghi audit). Ngân sách (tổng hoặc Σ dòng theo hạng mục/giai đoạn) + chi phí khác nhập tay. CÔNG THỨC: AC = giờ duyệt × đơn giá chốt + chi
      phí khác; % hoàn thành = Σ ước lượng gốc thẻ xong ÷ Σ ước lượng gốc (không ước lượng ⇒ theo số thẻ); EV = BAC × %; CPI = EV ÷ AC; EAC =
      BAC ÷ CPI (PMBOK); chưa có % ⇒ EAC = AC + burn × tuần còn tới ngày phát hành xa nhất, không thì null (không bịa); burn = chi phí 28 ngày ÷ 4;
      cảnh báo ≥ 80% WARN, ≥ 100% OVER (báo ADMIN+lead MỘT lần mỗi ngưỡng — `alertLevel`), EAC > BAC ⇒ FORECAST_OVER. Mốc thanh toán (số tiền
      hoặc % giá trị hợp đồng, hạn, PLANNED/DUE/INVOICED/PAID, INVOICED bắt buộc số hoá đơn ghi tay): trigger UAT (version/giai đoạn) hoặc
      STAGE_GATE ⇒ duyệt xong là DUE trong CÙNG transaction quyết định (`markMilestonesDueTx` gọi từ approvals.decideApproval) + báo PM/kế toán.
      Xuất kế toán .xlsx (`xlsxWorkbook` của exchange.service — không thêm thư viện): Summary, Approved timesheets, Expenses, Payment milestones.
      Cổng khách `/portal/payments`: CHỈ mốc `clientVisible` (tên, số tiền, hạn, trạng thái, số hoá đơn) · L
- [x] S4.B Báo cáo (`clientReports.service.ts`, dạng + Markdown thuần `reportRender.ts`): MỘT hàm dựng `buildReportData` cho báo cáo khách /
      steering / thuyết trình. Khách: thẻ clientVisible xong/đang làm, giai đoạn + %, phê duyệt/UAT chờ khách, version có hạng mục chia sẻ, mốc
      clientVisible, CR đã duyệt clientVisible (cờ lịch), rủi ro RISK có cờ mới `clientVisible` (cờ lịch `includeRisks`, mặc định tắt) — không tên
      người/giờ/đơn giá. Lịch `work_report_schedules` (thiếu dòng ⇒ bật, T6 16:00 Asia/Ho_Chi_Minh): cron mỗi giờ phút 25 (`runClientWeeklyReports`,
      KHÔNG LLM, file không import tĩnh ai.service — test đọc mã), gửi bù trong ngày, MỘT bản/tuần ISO (UNIQUE projectId+autoKey), không có khách
      ⇒ bỏ qua; email riêng cho khách + lưu lịch sử `work_client_reports` (cổng `/portal/reports`). Nhân viên: xem trước, gửi tay, "AI polish"
      chỉ khi bấm (dùng `weeklyReport` audience client có sẵn, sửa được trước khi gửi). Steering: + RAID, quá hạn, khối lượng việc, tài chính chỉ
      người thấy tiền. In PDF = `.w-cert` + window.print (không thư viện). Thuyết trình `/present`: slide toàn màn hình (←/→, F, Esc), Internal /
      Client-safe, chọn thẻ demo. **.pptx: bỏ** — repo không có pptxgenjs · L
- [x] S4.C Xuất trọn ZIP (`projectExport.service.ts`, adm-zip có sẵn): 72 bảng JSON (`data/<bảng>.json`) + `manifest.json` (`format`
      `ctwork-project-export`, `formatVersion: 1`, số dòng) + `attachments/manifest.json` (key R2, tên, cỡ) + nội dung tệp tuỳ chọn nếu tổng ≤
      `WORK_EXPORT_MAX_FILE_MB` (mặc định 200). Xoá bí mật (secret GitHub, token GitLab, URL webhook chat, token link công khai), bỏ lời mời đang
      chờ / khoá sửa cá nhân / hội thoại AI riêng tư, người dùng không email. Chạy nền (setImmediate) có progress. LƯU TRÊN R2, KHÔNG BAO GIỜ đĩa
      VPS (sự cố đầy đĩa): ZIP dựng theo luồng (JSZip generateNodeStream, tệp đính kèm đọc lười từ R2, HEAD trước — mất ⇒ `missing`) ra một tệp tạm
      os.tmpdir() ⇒ PutObject key `work-exports/<projectId>/<id>.zip` ⇒ xoá tệp tạm trong `finally`; R2 chưa cấu hình ⇒ 503 `WORK_EXPORT_NO_STORAGE`;
      tối đa 1 lần xuất/dự án (409) và 2/toàn hệ thống (429 `WORK_EXPORT_BUSY`, khoá tư vấn); "kèm tệp" trần 200 MB; link HMAC 15 phút (kiểm lại
      ADMIN) ⇒ 302 presigned URL R2 5 phút; hết 72 giờ cron xoá object (EXPIRED); audit `project.export` + `.download`. Chỉ ADMIN; khách
      ⇒ CLIENT_PORTAL_ONLY. Test dùng kho R2 giả (`_setExportStoreForTests`). **Chưa có nhập lại (restore)** — để đợt sau · M
- [x] S4.D Giao diện: sidebar "Finance" (mô-đun + vai ADMIN/MEMBER), `/finance` (Overview · My timesheet · Approvals · Rates · Budget & costs ·
      Payments, theo quyền), Reports + "Client weekly" / "Steering" + nút "Present", `/present`, Project settings → Export → "Export the whole
      project", cổng khách + "Payments" / "Reports", RAID "Share in client reports", module Finance + "Client reports & present" trong Project
      settings → Modules; help "Finance & timesheets", "Client reports", "Present mode", "Project export (backup)" (song ngữ); tuyến app desktop
      `finance`, `present` · L
- **Nghiệm thu 04/10/2026:** `finance.test.ts` 14 phép (quyền, tuần ISO, khoá, đơn giá, EAC/burn/cảnh báo, mốc, lịch, Markdown, job không import
  LLM) trong `npm test`; `work.s4.db.test.ts` 10 test DB (dự án cũ MODULE_DISABLED + ghi giờ y nguyên; MEMBER/lead/VIEWER/khách không thấy
  đơn giá; khoá tuần nộp/duyệt + mở khoá có lý do; budget vs actual + cảnh báo 80/100; mốc DUE khi UAT duyệt; cổng chỉ mốc chia sẻ; báo cáo không
  chứa thẻ chưa chia sẻ; job nền không fetch ra ngoài + một bản/tuần; export đủ bảng, xoá secret, khách/MEMBER không xuất); 197/197 test DB CT
  Work; E2E Playwright (backend :3171 + Next :3170): đặt đơn giá → nộp/duyệt tuần → ngân sách vs thực tế → UAT ⇒ mốc DUE → báo cáo tuần xem
  trước/in/gửi → khách đọc trong cổng → steering → present ←/→/Esc → export ZIP tải về mở được; 0 lỗi JS, 0 tràn ngang 390px; ảnh
  `~/Desktop/ct-work-ui/s4/`.

### Đợt S5a — service desk & SLA (04/10/2026, mô-đun `serviceDesk`)

Chuẩn tham chiếu: ITIL 4 (Incident / Service request / Problem management, ưu tiên = Impact × Urgency), Jira Service
Management (request types, SLA goals theo lịch, pause conditions, queues, CSAT). Bật mặc định cho dự án CLIENT MỚI
(`STUDIO_MODULES_S5A` trong `defaultModulesFor`); dự án cũ (không có khoá) ⇒ 403 `MODULE_DISABLED`, yêu cầu gửi qua cổng
cũ không có SLA. Migration `20261004230000_work_s5a` chỉ THÊM 4 bảng (`work_desk_settings`, `work_desk_tickets`,
`work_sla_events`, `work_desk_problems`), FK mới DEFERRABLE INITIALLY DEFERRED, cột người không FK tới users. Luật thuần
`slaRules.ts` (test `serviceDesk.test.ts`), DB ở `serviceDesk.service.ts`, tuyến `src/routes/work.desk.routes.ts` (một dòng
`router.use` cuối work.routes.ts — qua chốt cổng khách; khách chỉ `/portal/desk/**`, đã nằm trong danh sách trắng `/portal/**`).
Quyền MỘT hàm `permissions.deskAccess` (= luật "người của đội" của governanceAccess: khách/GUEST trừ TEACHER ⇒ 403
`WORK_INTERNAL_ONLY`; VIEWER/TEACHER xem; MEMBER+ xử lý; ADMIN cấu hình).

- [x] S5a.A Loại yêu cầu theo dự án: Incident · Service request · Question · Change (Change ⇒ CR nháp S3b khi mô-đun
      changeRequests bật, `sourceIssueId` = thẻ). Mỗi loại: tên/mô tả cho khách, ẩn/hiện, form ≤ 8 trường (text/textarea/date,
      bắt buộc), tác động + khẩn cấp mặc định, có hỏi khách tác động hay không · M
- [x] S5a.B Ưu tiên P1–P4 = ma trận Impact × Urgency (3×3, mặc định ITIL rút 4 mức, cấu hình được) ở CỘT RIÊNG
      `work_desk_tickets.priority` — TÁCH khỏi `work_issues.priority` (1–5): ánh xạ hai chiều thì mọi đường đổi ưu tiên cũ
      (board, hàng loạt, luật tự động, AI, nhập Jira) âm thầm đổi mục tiêu SLA. Lúc tạo qua desk chỉ GIEO một lần P1→1 … P4→4 · S
- [x] S5a.C SLA: first response + resolution theo P, lịch làm việc (ngày làm, giờ, ngày lễ — nút thêm lễ VN cố định dương lịch;
      Tết/Giỗ Tổ tự thêm), múi giờ IANA, mỗi mức chọn giờ làm hoặc 24/7. Đồng hồ = hàm thuần trên dòng sự kiện
      (START/PAUSE/RESUME/FIRST_RESPONSE/RESOLVE/REOPEN/PRIORITY) ⇒ tính lại chính xác bất kỳ lúc nào. Luật: chờ khách tạm
      dừng (nút, hoặc vào trạng thái cấu hình — khách trả lời ⇒ chạy tiếp + thẻ về trạng thái trước nếu luồng cho phép);
      first response = bình luận PUBLIC đầu tiên của đội (dự án không bật cổng: bình luận đầu tiên của người khác người yêu cầu;
      ghi chú nội bộ + AI không tính) hoặc vào trạng thái cấu hình; giải quyết trước khi trả lời ⇒ FR dừng ở đó; mở lại ⇒ cộng
      dồn; ĐỔI P ⇒ mục tiêu của P MỚI áp cho toàn bộ thời gian TỪ LÚC TẠO. AT_RISK ≥ 75% (cấu hình 10–99), BREACHED > mục tiêu.
      Móc thẳng (await, sau commit) ở `applyIssueChange` (đổi trạng thái) + `issues.addComment`. Cron `*/5` `runSlaChecks` (không
      LLM): cảnh báo WORK_ALERT tới người làm → trưởng bộ phận → ADMIN dự án, mỗi mốc ĐÚNG MỘT LẦN (`frAlert/resAlert` chỉ tăng,
      giành mức bằng UPDATE có điều kiện; đổi P mới hạ) · L
- [x] S5a.D Hàng đợi `/desk`: All open · Unassigned · My open · At risk · Breached · Waiting for customer · By team · Resolved; lọc
      loại/P/tìm, sắp theo SLA (vi phạm trước, rồi gần hạn) / P / mới / cập nhật; hai đồng hồ đếm ngược (đếm trơn chỉ khi chắc chạy
      liên tục tới hạn, tải lại 30 giây); bảng ≥ lg, thẻ trên điện thoại · M
- [x] S5a.E Cổng khách: form theo loại + "Who is affected? / How urgent?" bằng chữ dễ hiểu (hệ thống ra P, loại không hỏi ⇒ mặc
      định, khách không tự nâng được), xem trước "We'll respond within …"; yêu cầu trong cổng chỉ thấy MỤC TIÊU + đã trả lời/đã
      giải quyết (không thời gian đã chạy, vi phạm, sự kiện, Problem); đường cổng cũ `/portal/requests` cũng gắn SLA khi mô-đun
      bật. Đóng ⇒ mời CSAT 1–5 + bình luận (email + chuông tới ĐÚNG người gửi, loại thư `csat` trong portalNotify), chỉ người gửi,
      chỉ khi đã giải quyết, một lần (403 `WORK_CSAT_NOT_REQUESTER` / 409). **Tiếp nhận qua email: BỎ** — repo chưa có đường nhận
      email đến (không IMAP/webhook inbound) · M
- [x] S5a.F Problem (`work_desk_problems`, PRB-n): gom nhiều Incident, nguyên nhân gốc, cách tạm khắc phục, trạng thái; "Create
      postmortem" ⇒ trang Docs (S2a, INTERNAL) từ mẫu `bao-cao-su-co-postmortem.md`: điền bảng đầu (mã, mức, bắt đầu, phát hiện,
      khắc phục, thời gian ảnh hưởng, người chỉ huy) + dòng thời gian từ sự kiện SLA của các incident (kèm thời điểm vi phạm do
      slaRules tính) theo múi giờ dự án · M
- [x] S5a.G Báo cáo SLA: % đạt FR / resolution theo P × tháng (chỉ mục tiêu đã có kết quả), MTTR (giờ đồng hồ), số vi phạm, CSAT TB,
      vi phạm gần đây, phản hồi khách; xuất .xlsx (`xlsxWorkbook` có sẵn). Báo cáo tuần khách S4: mục "Support requests" chỉ số tổng
      (khách: chỉ yêu cầu đã chia sẻ). Portfolio RAG: P1 đang mở đã vi phạm ⇒ ĐỎ `SLA_P1_BREACHED`; tháng này đạt < 90% ⇒ VÀNG
      `SLA_BELOW_TARGET` (chỉ người của đội). Xuất trọn dự án thêm 4 bảng · M
- [x] S5a.H Giao diện: sidebar "Service desk", `/desk` (Queues · Problems · Reports · Settings), khu "Service desk" trong chi tiết thẻ
      (P, impact/urgency, hai đồng hồ, chờ khách/Resume, người yêu cầu, form, Problem/CR, CSAT, SLA log, "Add to service desk"),
      cổng khách (form mới + bảng mục tiêu + CSAT), module card; help "Service desk & SLA", "Priorities (P1–P4)", "CSAT" (song ngữ);
      tuyến app desktop `desk` · L
- **Nghiệm thu 04/10/2026:** `serviceDesk.test.ts` 29 phép (qua đêm, cuối tuần, Chủ nhật, ngày lễ, hạn đúng mép giờ, 24/7, múi
  giờ Tokyo, đổi giờ mùa hè New York, lịch hỏng không treo, ma trận, tạm dừng nhiều lần + PAUSE trùng, chờ khách trước khi trả
  lời, giải quyết trước khi trả lời + mở lại cộng dồn, đổi P lên/xuống/tương lai, cảnh báo một lần, ô báo cáo, chữ cho khách,
  loại yêu cầu, file không nạp LLM) trong `npm test`; `work.s5a.db.test.ts` 11 test DB (dự án cũ MODULE_DISABLED + yêu cầu cổng cũ
  không SLA, khách CLIENT_PORTAL_ONLY + bản cổng không lộ P/thời gian/sự kiện/ghi chú, Incident HIGH×HIGH ⇒ P1, ghi chú nội bộ không
  tính first response, chờ khách nút + trạng thái cấu hình ⇒ PAUSE/RESUME + thẻ về trạng thái trước, đổi P ⇒ vi phạm ngay, cảnh báo
  AT_RISK/BREACHED đúng một lần, CSAT chỉ người gửi + một lần, Problem + postmortem có dòng thời gian, báo cáo + xlsx, portfolio đỏ,
  báo cáo tuần khách chỉ số tổng, đường cổng cũ gắn SLA); 208/208 test DB CT Work; E2E Playwright (backend :3181 + Next :3180, SLA
  đặt 24/7 vì hôm chạy là Chủ nhật): khách gửi Incident tác động cao ⇒ P1 + "We'll respond within 30 minutes" ⇒ hàng đợi (vi phạm
  đứng đầu, đồng hồ đếm ngược) ⇒ "Reply to client" ⇒ first response Met ⇒ Waiting for customer ⇒ Paused ⇒ khách trả lời ⇒ RESUME ⇒
  đóng ⇒ CSAT 4★ ⇒ Problem 2 incident ⇒ "Create postmortem" ⇒ trang Docs có dòng thời gian; 26 kiểm, 0 lỗi JS, 0 tràn ngang 390px;
  ảnh `~/Desktop/ct-work-ui/s5a/`.

### Đợt S5b — CRM nhẹ cho studio (05/10/2026, khu ADMIN `/admin/crm`, KHÔNG phải mô-đun CT Work)

Chuẩn tham chiếu: pipeline B2B kiểu Pipedrive/HubSpot ở mức tối giản. Chỉ ADMIN (`requireAdmin('ROLE_ADMIN')` ⇒ qua MFA step-up
nếu bật). Migration viết tay `20261005010000_crm_s5b` chỉ THÊM 6 bảng (`crm_organizations`, `crm_contacts`, `crm_deals`,
`crm_deal_stage_changes`, `crm_activities`, `crm_proposals`) + back-relation `ProjectRequest.crmDeal`, `User.crmDealsOwned`.
Luật thuần `src/services/crm/rules.ts` (test `rules.test.ts`), DB `crm.service.ts`, tuyến `src/routes/crm.routes.ts`
(`/api/v1/admin/crm/**` + công khai `/api/v1/proposals/:token`), giao diện `frontend/src/app/admin/crm/page.tsx` +
`frontend/src/components/admin/crm/*` + trang khách `frontend/src/app/proposal/[token]/` (API `frontend/src/lib/crm-api.ts`).

- [x] S5b.A Mô hình: Organization (tên, ngành, quy mô, website, MST tuỳ chọn, ghi chú) · Contact (org tuỳ chọn, chức vụ, email
      chữ thường, SĐT, kênh ưa thích, **đồng ý + thời điểm + nguồn bằng chứng** — thời điểm do server ghi) · Deal (gói từ
      `packages.ts`, giá trị ƯỚC TÍNH do người nhập + tiền tệ, xác suất ghi đè hoặc mặc định theo giai đoạn 10/20/40/60/80/100/0,
      ngày dự kiến chốt, người phụ trách = admin, nguồn, lý do thua, NDA đã ký + ngày + tệp R2 riêng tư) · Activity
      (CALL/EMAIL/MEETING/NOTE/TASK, hạn, xong) · Proposal (phiên bản, Markdown, DRAFT/SENT/ACCEPTED/REJECTED, token có hạn) ·
      lịch sử giai đoạn (nguồn của báo cáo phễu + chu kỳ) · M
- [x] S5b.B Luật giai đoạn (`checkStageChange`): kéo được nhảy cóc/lùi; LOST bắt buộc lý do; vào DISCOVERY/PROPOSAL/NEGOTIATION/WON
      cần bảng go/no-go = GO hoặc GO có điều kiện (NO_GO ⇒ chỉ còn LOST); deal tạo tay chỉ ở LEAD/QUALIFIED (không lách cổng);
      phiếu đã PROJECT_CREATED ⇒ deal khoá ở WON. Bảng đánh giá = 10 tiêu chí của `checklist-danh-gia-phu-hop.md` (0/1/2,
      7·8·9 bằng 0 ⇒ NO_GO bắt buộc, ≥15 GO, 10–14 có điều kiện — phải ghi điều kiện, <10 NO_GO; GO cần chấm đủ 10) · M
- [x] S5b.C **Đồng bộ phiếu ↔ deal** (ghi rõ luật):
      · phiếu mới (form công khai + phiếu nhập vai) ⇒ `ensureDealForRequest`: ghép Contact theo EMAIL (chưa ẩn danh, không phân
        biệt hoa thường; chỉ ĐIỀN chỗ trống, đồng ý mới nhất thắng), Org theo TÊN (không phân biệt hoa thường), Deal LEAD gắn
        `projectRequestId` (UNIQUE ⇒ idempotent), gói từ `#goi=` của `source`. Hỏng ⇒ chỉ log, phiếu không rớt;
      · deal ⇒ phiếu: LEAD→NEW · QUALIFIED→QUALIFYING · DISCOVERY/PROPOSAL/NEGOTIATION/WON→ACCEPTED · LOST→DECLINED; phiếu
        PROJECT_CREATED không đổi nữa;
      · phiếu ⇒ deal (admin đổi ở /admin/project-requests) CHỈ ĐẨY TỚI: QUALIFYING ⇒ LEAD→QUALIFIED; ACCEPTED ⇒ ≤QUALIFIED→DISCOVERY;
        DECLINED ⇒ deal mở → LOST (lý do tự ghi); PROJECT_CREATED ⇒ WON. Đường này bỏ qua cổng go/no-go (admin đã quyết ở trang phiếu);
      · deal WON ⇒ "Create CT Work project" tái dùng `createWorkProjectFromRequest`; deal không có phiếu ⇒ tạo PHIẾU NỘI BỘ
        (`source = crm:deal-<id>`, loại sản phẩm theo gói) rồi đặt ACCEPTED. Liên kết hai chiều: deal ⇒ phiếu ⇒ dự án; chi tiết
        phiếu trả `crmDeal` (link "Deal CRM #id" ở /admin/project-requests) · M
- [x] S5b.D Đề xuất: bản nháp ghép `de-xuat-giai-phap.md` + `bao-gia.md` (bỏ khối hướng dẫn nội bộ đầu mẫu, điền bảng đầu: mã
      phiếu/khách/phiên bản/ngày); sửa được khi DRAFT; "Đóng băng & lấy link" ⇒ SHA-256 (dealId+version+title+content, CRLF chuẩn
      hoá) + token 24 byte, hạn 1–90 ngày (mặc định 30), thu hồi link các bản SENT cũ, đẩy deal tới PROPOSAL; cần go/no-go = GO.
      Khách `/proposal/[token]` (noindex, no-referrer, song ngữ khung, sáng/tối, 390px): nhập tên + "đã đọc phiên bản N" ⇒
      Accept/Decline gửi kèm hash; server so hash lúc gửi VÀ hash tính lại (409 `PROPOSAL_CHANGED`), giành bằng UPDATE có điều
      kiện (409 `PROPOSAL_ALREADY_RESPONDED`), ghi thời điểm + IP (mục phải XFF) + UA + tên; Accept ⇒ deal NEGOTIATION + hộp thư
      admin. Hết hạn 410, thu hồi 404; bộ đếm Redis theo IP (xem 120/15', trả lời 10/15') · M
- [x] S5b.E Nhắc việc (cron, KHÔNG LLM): `*/15` TASK tới hạn chưa xong ⇒ `baoAdmin` đúng một lần mỗi hạn (giành `notifiedAt`
      bằng UPDATE có điều kiện; đổi hạn ⇒ báo lại); 08:30 VN tóm tắt deal "stale" (mở, > 14 ngày không hoạt động — cờ tính lúc đọc,
      `lastActivityAt` chạm khi có hoạt động/đổi giai đoạn/đề xuất) · S
- [x] S5b.F Dữ liệu cá nhân (Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP): "Export JSON" một người (hồ sơ, org, deal + đề xuất +
      lịch sử, hoạt động, phiếu cùng email); "Anonymize / delete" (gõ XOA): xoá PII, đồng ý = false, nội dung hoạt động gắn người đó,
      tiêu đề deal không có org; IP/UA của đề xuất CHƯA chấp thuận; phiếu chưa thành dự án XOÁ CỨNG; GIỮ số liệu deal, phiếu đã thành
      dự án và đề xuất đã chấp thuận (bằng chứng giao kết — báo lại cho admin). API admin `Cache-Control: no-store` · M
- [x] S5b.G Giao diện `/admin/crm` (mục "CRM" nhóm Commerce): Pipeline Kanban kéo thả (dnd-kit, chạm giữ 250 ms) với tổng + trọng số
      mỗi cột tách theo tiền tệ; Deals (tìm + lọc giai đoạn/người/gói/nhập vai/stale); Contacts; Organizations; Tasks; Reports (tỷ lệ
      chuyển đổi theo bậc cao nhất đã chạm, win rate, chu kỳ TB tạo→thắng, nguồn lead + gói, dự báo tháng Σ giá trị × xác suất,
      không quy đổi tiền tệ); ngăn kéo deal (Tổng quan · Hoạt động · Go/no-go · Đề xuất, NDA, liên kết phiếu/dự án); "Nhập từ phiếu"
      tạo deal cho phiếu cũ. App desktop KHÔNG nhúng /admin hay /about (`dinhTuyenWeb.ts`) ⇒ không thêm tuyến · L

### Đợt S5c — hoàn thiện (05/10/2026): mô-đun mới cho dự án cũ · thùng rác Docs · nhập lại dự án · AI đọc/ghi Docs

Tuyến ở `src/routes/work.s5c.routes.ts` (một dòng `router.use` cuối work.routes.ts — qua chốt cổng khách; không thêm mẫu tuyến
khách nào ⇒ khách bị cách ly gọi ⇒ 403 `CLIENT_PORTAL_ONLY`). Migration viết tay `20261005030000_work_s5c` chỉ THÊM 1 bảng
`work_project_imports` (không FK). Luật thuần trong `src/services/work/s5c.test.ts` (16 phép, trong `npm test`).

- [x] S5c.A Mô-đun mới cho dự án cũ (`moduleUpgrade.ts`): `GET /projects/:pid/studio/available` (mô-đun + mô tả + `recommended`
      theo loại + `undecided`) và `POST /projects/:pid/studio/apply-defaults` (ADMIN dự án — `studio.configure`; audit `project.studio`).
      Chỉ áp mặc định theo loại cho khoá **CHƯA QUYẾT**: khoá thiếu trong `settings.modules`, HOẶC `false` chỉ là chỗ giữ (dự án tạo
      trước ngày mô-đun có tính năng — `MODULE_SINCE`, vì S1 `noModules()` ghi sẵn docs/clientPortal/… = false) mà chưa ai bật/tắt tay
      (không dòng audit `project.studio` nào nhắc "<khoá> on|off"). Khoá đã bật, khoá ai đó bật/tắt tay, khoá false của dự án tạo SAU
      ngày mô-đun ra đời ⇒ giữ nguyên. Bấm lần hai không ghi thêm. Bật cổng khách ⇒ đuổi khách khỏi phòng realtime như `updateStudioConfig`.
      UI: khối "Available modules" trên Settings → Project type & modules (mô-đun đang tắt + mô tả, nhãn Recommended / New since this
      project was created, nút "Enable all recommended for this project type" chỉ ADMIN) · M
- [x] S5c.B Thùng rác Docs (`pageTrash.service.ts`): `GET /projects/:pid/trash/pages`, `POST …/trash/pages/:num/restore`,
      `DELETE …/trash/pages/:num`. Một dòng cho mỗi LẦN xoá (gốc = cha null / còn sống / bị xoá lúc khác) + số trang con đi kèm; xem =
      người sửa được tài liệu (docs bật); khôi phục = chủ trang hoặc ADMIN, đưa lại CẢ CÂY CON cùng `deletedAt`, cha còn ⇒ giữ cha + vị
      trí, cha đã xoá/không còn ⇒ lên gốc cuối danh sách; xoá vĩnh viễn CHỈ ADMIN, trang có phê duyệt đã ký (APPROVED/REJECTED) ⇒ 409
      `WORK_PAGE_HAS_SIGNOFF` (chữ ký là bằng chứng). Audit `page.restore` / `page.purge`. **Tự dọn sau N ngày: KHÔNG** — thẻ đã xoá cũng
      không có cơ chế đó (trash.service chỉ xoá tay), giữ một luật. UI: Settings → Trash có tab Issues | Docs · M
- [x] S5c.C Nhập lại dự án từ ZIP `formatVersion: 1` (`projectImport.service.ts`): `POST /workspaces/:wsId/imports` (multipart `file`
      ≤ 200 MB, multer ghi tạm os.tmpdir ⇒ kiểm + chạy thử ⇒ đẩy ZIP lên R2 `work-imports/<ws>/<uuid>.zip`, tệp tạm xoá trong finally;
      KHÔNG giữ trên đĩa VPS), `GET …/imports`, `GET …/imports/:id`, `POST …/imports/:id/start { key, name }` (chạy nền, tiến trình),
      `DELETE …/imports/:id`. Chỉ OWNER/ADMIN không gian. Kiểm toàn vẹn: đúng ZIP, có manifest, đúng format + formatVersion (cao hơn ⇒
      "made by a newer version"), số dòng từng data/*.json khớp manifest, SHA-256 khớp `checksums` (bản xuất từ S5c có — S4 sửa nhỏ ở
      `projectExport.service.ts`: thêm `checksums`, `users[].emailHash` + `userHashSalt`, vẫn formatVersion 1). Chạy thử trả số dòng từng
      bảng, ánh xạ người, bộ phận dùng lại/tạo mới, tệp có/thiếu nội dung, cảnh báo. Bộ máy nhập CHUNG đọc `Prisma.dmmf` (không chép tay
      cột): FK tới bảng đã nhập ⇒ id mới; tới bảng nhập sau / chính nó ⇒ để null rồi điền lại; người ⇒ thành viên không gian đích CÙNG
      EMAIL (băm có muối — tệp không chứa email); bản xuất cũ không băm ⇒ chỉ khớp CÙNG tài khoản (trùng id + username). Không khớp ⇒ để
      trống + "Imported from <tên>" (bình luận: dòng đầu thân; thẻ: sự kiện lịch sử `imported`); cột bắt buộc ⇒ bỏ dòng (thành viên, giờ
      làm, cảm xúc, người theo dõi, người dự họp, chữ ký phê duyệt), bộ lọc/dashboard ⇒ chủ = người nhập, cột người không-FK bắt buộc
      (timesheet) ⇒ id ÂM của người gốc. Thẻ giữ số; bộ phận ánh xạ theo MÃ, thiếu thì tạo; tệp có nội dung ⇒ tải lại R2 `work/<pid>/<issue>/…`,
      không ⇒ liên kết hỏng `work-import-missing/…`. Không nhập: GitHub/GitLab, webhook chat, link công khai (bí mật đã xoá), hội thoại AI,
      nhật ký luật, audit cũ, bí danh mã thẻ; luật tự động nhập TẮT; phê duyệt đang chờ ⇒ CANCELLED. Dự án ẩn (deletedAt) trong lúc nhập
      (Trash không liệt kê/khôi phục nó); lỗi ⇒ xoá cứng dự án dở + bộ phận vừa tạo. Tối đa 1 lần nhập/không gian, 2/toàn hệ thống; bản
      tải lên không dùng sau 24 giờ ⇒ xoá ZIP (EXPIRED, quét khi gọi API — không thêm cron). UI: Workspace settings → Import project · L
- [x] S5c.D AI đọc/ghi Docs (`aiDocs.ts` + ai.service): tool ĐỌC `search_pages` / `read_page` chạy ngay trong vòng hỏi (model trả
      `reads` ⇒ mã đọc qua `pages.searchPages` / `pages.getPage` ĐÚNG quyền người hỏi ⇒ hỏi lại, tối đa 2 vòng); mục lục trang trong ngữ
      cảnh cũng lọc theo `docAccess` (GUEST/CLIENT chỉ thấy trang CLIENT; trang INTERNAL ⇒ "not found or not visible to you"). Tool GHI
      `draft_page` / `update_page_section` chỉ là ĐỀ XUẤT; Apply ⇒ `createPage` (phiên bản CREATE) / `updatePage` + `versionNote` "AI
      suggestion applied: …" (phiên bản MANUAL riêng, mục được thay theo tiêu đề — `docSections.ts`). Việc một chạm `draft_srs` (SRS từ
      requirement/story/epic + khung mẫu `srs`, chỉ giữ ĐÚNG một draft_page) và `summarize_page` (`pageNumber`, không đề xuất). Khách cổng:
      tuyến /ai/** ngoài danh sách trắng ⇒ CLIENT_PORTAL_ONLY; docs tắt ⇒ không mời đọc/ghi, quick ⇒ MODULE_DISABLED. UI: thẻ "Create
      document" / "Update document section" trong khung AI, "Summarize with AI" (menu ⋯ của trang), "Draft SRS with AI" (trang chủ Docs +
      công cụ trong khung AI). Test dùng model giả `_setAskForTests` · M
- [x] S5c.E Nhãn pháp lý cũ "NĐ 13/2023" ⇒ Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP (thay NĐ 13 từ 01/01/2026) ở UI/pháp lý sản
      phẩm: `/admin/project-requests` (nhãn SENSITIVE), `/chinh-sach-bao-mat` (mô tả + 2 đoạn), `/settings/account`, ghi chú trong bản
      xuất dữ liệu cá nhân (`dataRights.service.ts`) + chú thích mã liên quan. KHÔNG sửa nội dung khoá học/lộ trình (roadmapData.ts,
      roadmap.seed.*) — đó là bài học về luật, không phải căn cứ pháp lý của sản phẩm · S
- [x] Help: "Import a project export", "Docs: trash and the AI assistant" (song ngữ); "Project export" bỏ câu "chưa có nhập lại".
- **Nghiệm thu 05/10/2026:** `s5c.test.ts` 16 phép trong `npm test`; `work.s5c.db.test.ts` 5 test DB (dự án cũ y nguyên tới khi bấm,
  khoá đã quyết giữ nguyên, MEMBER 403, bấm lại không ghi; thùng rác Docs khôi phục cây / về gốc / quyền / chữ ký 409; xuất ⇒ nhập
  ⇒ số dòng MỌI bảng nhập được khớp, giữ số thẻ/cha/sprint/version/bộ phận/giai đoạn, tệp tải lại + liên kết hỏng; không gian khác ⇒
  "Imported from …"; ZIP không phải ZIP / formatVersion 9 / checksum lệch ⇒ 400 rõ ràng; MEMBER/GUEST 403; mã trùng 409; AI: GUEST không
  đọc trang INTERNAL qua mục lục/read_page/search_pages/summarize_page, đề xuất không tự áp dụng, Apply ⇒ phiên bản MANUAL, draft_srs chỉ
  giữ draft_page, khách CLIENT_PORTAL_ONLY); 213/213 test DB CT Work; E2E Playwright (backend :3201 + Next :3200): bật mô-đun cho dự án
  cũ → xoá trang có 2 con → Trash/Docs → khôi phục cả cây → xuất → nhập thành ACMEB (đối chiếu: mọi bảng khớp, riêng pageVersions lệch
  đúng 1 bản do bước AI áp dụng SAU khi xuất) → ZIP hỏng báo lỗi → đề xuất AI "Update document section" → Apply ⇒ v1→v2 → "Summarize
  with AI" gọi cổng LLM thật (200); 0 lỗi JS, 0 tràn ngang 390px; ảnh `~/Desktop/ct-work-ui/s5c/`.

### Đợt S6 — Spec Fidelity + nguồn gốc AI (05/10/2026)

Nguồn ý tưởng: báo cáo SDAD (arXiv 2608.20341) — "Spec Fidelity" 4 chiều (completeness · consistency · unambiguity ·
verifiability) + nguyên tắc "AI viết thì không tự duyệt phát hành" + provenance; chuẩn nền ISO/IEC/IEEE 29148. Tuyến ở
`src/routes/work.s6.routes.ts` (một dòng `router.use` cuối work.routes.ts — qua chốt cổng khách ⇒ khách cách ly 403
`CLIENT_PORTAL_ONLY`). Migration viết tay `20261005170000_work_s6` CHỈ THÊM: bảng `work_spec_reviews`; cột `ai_assisted`,
`ai_model`, `ai_assisted_at`, `ai_applied_by_id` trên `work_issues` + `work_pages`; `spec_review_id` (FK SET NULL) trên
`work_approvals`. Luật thuần `specFidelity.ts` (test `s6.test.ts`, 27 phép trong `npm test`).

- [x] S6.A Bộ kiểm XÁC ĐỊNH (`specFidelity.ts`, không LLM, chạy trước): từ mơ hồ EN + VI (fast/user-friendly/etc/TBD/
      should be fast/and-or…; nhanh/thân thiện/v.v./tuỳ/tùy/có thể/nếu cần… — ranh giới chữ bằng lookaround `\p{L}`,
      KHÔNG `\b`; cụm dài thắng cụm ngắn; NFC), câu nói về chất lượng mà không có số + đơn vị (`unmeasurable`), thiếu
      acceptance criteria (Given/When/Then, Happy:/Unhappy:, mục "Acceptance criteria"/"Tiêu chí chấp nhận", taskItem),
      thiếu edge case, mô tả rỗng, trùng (Jaccard ≥ 0.85) + mã yêu cầu định nghĩa hai lần, thiếu mục chuẩn SRS (29148: purpose/
      scope, functional, quality, constraints, acceptance), không có failure mode, thiếu test liên kết (traceability THẬT:
      liên kết TESTS từ thẻ TEST). Trang: rút câu yêu cầu (shall/must/phải/cần…, mã FR-01…, hoặc dưới mục yêu cầu; bảng =
      một hàng một yêu cầu); câu nhắc `KEY-n` ⇒ đi theo thẻ đó lấy AC + test.
- [x] S6.B Điểm: mỗi phát hiện mở trừ 15/8/3 (cao/vừa/thấp) × `10/max(10,N)`; đã áp dụng/bỏ qua không trừ; verifiability =
      40% tỷ lệ có AC + 30% tỷ lệ có test + 30% phần luật; overall = trung bình 4 chiều; không có yêu cầu ⇒ 0. AI trừ tối đa
      40 mỗi chiều.
- [x] S6.C LLM bổ sung ngữ nghĩa (`specReview.service.ts`): purpose MỚI `work_spec_review` (gateway.ts, `claude-sonnet-5`,
      vặn `LLM_MODEL_WORK_SPEC_REVIEW`), chỉ khi người chạy có `ai.use` và bật "Include AI semantic review"; nhận xét phải có
      `ref` có thật + trích dẫn NGUYÊN VĂN (không thì bỏ), không nhận chiều verifiability. Lỗi/hết hạn mức/cổng tắt ⇒ vẫn
      trả phần xác định + `semantic: UNAVAILABLE` ("Semantic review unavailable"). KHÔNG có job nền nào gọi. Test giả lập
      `_setSpecAskForTests`.
- [x] S6.D Lịch sử `work_spec_reviews` (trang + số phiên bản lúc chấm / tập thẻ dự án·epic·giai đoạn, người chạy, thời
      điểm, điểm, phát hiện, chưa truy vết, model). Gợi ý viết lại = ĐỀ XUẤT → Apply: trang ⇒ phiên bản MANUAL "Spec
      Fidelity suggestion applied (…)"; thẻ ⇒ applyIssueChange (thêm khối AC / thay câu); giành khoá open→applied (hai lần ⇒
      409), chữ đã đổi ⇒ 409 `WORK_SPEC_STALE`; gợi ý từ AI ⇒ AI-assisted. Điểm chỉ đổi khi chấm lại.
- [x] S6.E Cổng "Spec Fidelity gate" (`settings.specGate`, mặc định TẮT; 70 tổng / 50 mỗi chiều; giai đoạn slug
      `dac-ta-yeu-cau` hoặc giai đoạn chọn). `requestGate` đọc lần chấm MỚI NHẤT gắn giai đoạn (trang thuộc giai đoạn / thẻ
      lọc theo giai đoạn) ⇒ đính `specReviewId` + một dòng tóm tắt vào phê duyệt; chưa chấm / dưới ngưỡng ⇒ 409
      `WORK_SPEC_GATE` (kèm lý do); ADMIN `override: { reason ≥ 3 }` ⇒ qua + audit `spec.gate.override`; MEMBER ⇒ 403. Khách
      xem phê duyệt cổng KHÔNG thấy điểm. Dự án School không stages: chấm độc lập từ Docs và Issues.
- [x] S6.F Nguồn gốc AI (`provenance.ts`): actor AI đổi tiêu đề/mô tả hoặc tạo thẻ ⇒ `aiAssisted` + model + người áp dụng,
      lịch sử field `aiAssisted` ("<model> · AI suggestion applied"; người + thời điểm = actor + createdAt); trang do
      draft_page/update_page_section ⇒ AI-assisted; commit/PR (GitHub + GitLab) có trailer `Co-Authored-By:` của model AI
      (Claude/Copilot/GPT/Gemini/… hoặc noreply@anthropic.com) ⇒ gắn cho thẻ liên kết (SYSTEM, gửi lại không ghi thêm); gắn/gỡ
      tay qua PATCH `aiAssisted`. Luật tuỳ chọn `settings.aiReview.requireIndependentReviewer` (mặc định TẮT): thẻ AI-assisted
      vào DONE cần phê duyệt ISSUE APPROVED, chữ ký khớp nội dung, có bước duyệt của người ≠ người báo và ≠ người áp dụng AI
      — hook trong nhánh DONE của applyIssueChange cạnh Done rules (người + AI bị chặn, luật tự động/hệ thống không) ⇒ 400
      `WORK_AI_REVIEW_REQUIRED`.
- [x] S6.G UI: ngăn "Spec quality" trên trang Docs (nút "Check spec quality": 4 vạch + tổng, biểu đồ nhỏ lịch sử, lọc theo
      chiều, bấm mã ⇒ cuộn + nháy đoạn văn / mở thẻ, sửa rồi Apply, Dismiss/Restore, danh sách "Not traced to a test"); trang
      MỚI `/work/:ws/:key/spec` (phạm vi All / epic / stage, lịch sử, các trang đã chấm) + nút ở Issues + mục "Spec quality"
      ở thanh bên; hộp "Request gate review" hiện cổng (điểm, lý do, ô lý do ghi đè cho ADMIN); phê duyệt cổng hiện lần chấm
      đính kèm; nhãn AI-assisted trên thẻ (gắn/gỡ tay) + trang; Settings → "Spec quality & AI". Tuyến app desktop
      `dinhTuyenWeb.ts` +1 (`/work/:ws/:key/spec`, 144 mẫu).
- [x] Help: "Spec Fidelity: check the quality of requirements" (4 chiều, cách tính điểm, ví dụ viết lại tốt/xấu VI+EN,
      ISO/IEC/IEEE 29148, cổng) và "AI provenance: the AI-assisted label" (song ngữ).

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
