# CT Work đợt 2 — hợp đồng API giữa phần BE (A9–A12) và phần FE (A13–A15)

Viết bởi agent BE ngày 09/10/2026. Tất cả đường dưới `/api/v1/work`, trả về khuôn chung
`{ "success": true, "data": … }` (lỗi: `{ success:false, message, code, data? }`).
`PUBLIC_USER` = `{ id, username, fullName, displayName, avatarUrl, kind }` (kind `'HUMAN' | 'AGENT'`).
Tiền agent là **USD ước lượng**; `costSource.reported` = agent tự khai (REPORTED), `costSource.gateway` = CT Work đo
(GATEWAY, GĐ2 — hiện luôn 0). UI phải ghi nhãn "self-reported" khi `reported > 0`.

---

## A12-1. Báo cáo thời gian tách người / agent (sửa tuyến cũ)

`GET /projects/:pid/reports/time?from=YYYY-MM-DD&to=YYYY-MM-DD&userId?&principal=HUMAN|AGENT|ALL`

- `principal` mặc định `ALL` (giữ hành vi cũ).
- Khuôn cũ giữ nguyên, THÊM:
  - `principal: 'HUMAN' | 'AGENT' | 'ALL'`
  - `byPrincipal: { HUMAN: number /*phút*/, AGENT: number }` — tổng theo loại trong khoảng (đã lọc theo `principal`).
  - mỗi phần tử `people[i]` thêm `userKind: 'HUMAN' | 'AGENT'` và `autoMin: number` (phút do timesheet agent tự sinh, `source = AGENT_AUTO`).

## A12-2. Báo cáo agent của dự án

`GET /projects/:pid/reports/agents?from=YYYY-MM-DD&to=YYYY-MM-DD&sprintId?`

- Thiếu `from/to` ⇒ 30 ngày gần nhất (giờ VN); khoảng tối đa 92 ngày. `sprintId` ⇒ chỉ thẻ thuộc sprint đó
  (và nếu thiếu from/to thì lấy ngày bắt đầu/kết thúc sprint).
- Quyền: xem dự án (`project.view`); khách cổng ⇒ 403. `humans[].cost` chỉ có số khi dự án bật finance VÀ người gọi
  quản lý finance; còn lại `null`.

```json
{
  "from": "2026-09-10", "to": "2026-10-09", "sprintId": null,
  "agents": [{
    "agent": { "id": 3, "userId": 55, "username": "agent_client_unity_7", "displayName": "Client Unity",
               "model": "claude-opus-5", "status": "ACTIVE", "owner": PUBLIC_USER },
    "issuesTouched": 12, "issuesResolved": 9, "pointsResolved": 21,
    "returnedCount": 2, "returnRate": 0.18,
    "leaseMinutes": 740, "worklogMinutes": 600, "autoWorklogMinutes": 540,
    "tokens": { "in": 1200000, "out": 310000, "cacheRead": 0 },
    "costUsd": 14.2, "costSource": { "reported": 14.2, "gateway": 0 },
    "costPerPoint": 0.68, "costPerResolved": 1.58
  }],
  "humans": [{ "user": PUBLIC_USER, "worklogMinutes": 1890, "hours": 31.5, "cost": null, "issuesResolved": 7 }],
  "totals": {
    "agents": { "issuesResolved": 9, "returnedCount": 2, "returnRate": 0.18, "pointsResolved": 21, "costUsd": 14.2,
                "costSource": { "reported": 14.2, "gateway": 0 }, "tokens": { "in": 1200000, "out": 310000, "cacheRead": 0 },
                "leaseMinutes": 740, "worklogMinutes": 600, "costPerPoint": 0.68, "costPerResolved": 1.58 },
    "humans": { "hours": 31.5, "worklogMinutes": 1890, "cost": null, "issuesResolved": 7 }
  },
  "currency": "VND"
}
```
Định nghĩa: `issuesResolved` = thẻ đang giao cho agent có `resolvedAt` trong khoảng; `returnedCount` = số lần NGƯỜI
chuyển thẻ (đang giao cho agent) từ cột Review/Done về To-do/In-progress trong khoảng; `returnRate = returned /
(resolved + returned)` (0 khi mẫu số 0); `costPerPoint`/`costPerResolved` = `null` khi mẫu số 0. `currency` là tiền
của finance dự án (cho `humans.cost`), `null` khi không bật.

## A12-3. Dashboard "People vs Agents" cấp không gian

`GET /workspaces/:wsId/agents/dashboard?days=30` (`days` 7–180, mặc định 30)

- OWNER/ADMIN không gian: mọi agent + số liệu người (`scope: "ALL"`). Thành viên khác: chỉ agent mình là owner
  (`scope: "OWN"`), `humanResolved`/`humanHours` = `null`. Khách/agent ⇒ 403.

```json
{
  "days": 30, "from": "2026-09-10", "to": "2026-10-09", "scope": "ALL",
  "weeks": [{ "weekStart": "2026-09-07", "humanResolved": 5, "agentResolved": 3, "agentReturned": 1,
              "agentCostUsd": 4.1, "humanHours": 22.5 }],
  "agents": [{
    "agent": { "id": 3, "userId": 55, "username": "…", "displayName": "…", "model": "…", "status": "ACTIVE",
               "owner": PUBLIC_USER, "lastSeenAt": "2026-10-09T03:00:00.000Z" },
    "issuesResolved": 9, "pointsResolved": 21, "returnedCount": 2, "returnRate": 0.18,
    "costUsd": 14.2, "costSource": { "reported": 14.2, "gateway": 0 }, "costPerPoint": 0.68,
    "tokens": { "in": 1200000, "out": 310000, "cacheRead": 0 }, "leaseMinutes": 740, "activeLeases": 1
  }],
  "totals": { "humanResolved": 20, "agentResolved": 9, "agentReturned": 2, "agentReturnRate": 0.18,
              "agentCostUsd": 14.2, "humanHours": 120.5, "costSource": { "reported": 14.2, "gateway": 0 } }
}
```
`weeks` theo tuần thứ Hai (giờ VN), cũ → mới, phủ hết khoảng `days`. ⚠️ Tuyến này khai TRƯỚC `/agents/:agentId`.

## A12-4. Hoạt động agent trên một thẻ (khối "Agent activity" + chi phí trên thẻ)

`GET /projects/:pid/issues/:num/agent-activity` — quyền xem dự án; khách cổng ⇒ 403 (không lộ agent).

```json
{
  "leases": [{ "id": 7, "status": "ACTIVE", "claimedAt": "…", "heartbeatAt": "…", "expiresAt": "…", "releasedAt": null,
               "progress": "running tests", "progressPct": 72,
               "agent": { "id": 3, "userId": 55, "username": "…", "displayName": "…", "model": "…" } }],
  "usage": {
    "totals": { "inputTokens": 120000, "outputTokens": 9000, "cacheReadTokens": 0, "costUsd": 0.495,
                "reported": 0.495, "gateway": 0, "rows": 3 },
    "byAgent": [{ "agentId": 3, "username": "…", "displayName": "…", "inputTokens": 120000, "outputTokens": 9000, "costUsd": 0.495 }],
    "recent": [{ "id": 1, "agentId": 3, "model": "claude-opus-5", "inputTokens": 40000, "outputTokens": 3000,
                 "cacheReadTokens": 0, "costUsd": 0.275, "source": "REPORTED", "note": null, "createdAt": "…" }]
  }
}
```
`leases`: lease ACTIVE trước, rồi 10 lease gần nhất. `recent` ≤ 20 dòng mới nhất.

## A12-5. Agent tự khai chi phí qua REST (MCP có tool `report_usage` tương đương)

`POST /projects/:pid/agent-usage` — CHỈ token agent (người ⇒ 403 `WORK_NOT_AGENT`).
Body: `{ "issueNumber"?: 12, "model": "claude-opus-5", "inputTokens": 1000, "outputTokens": 200, "cacheReadTokens"?: 0,
"costUsd"?: 0.01, "note"?: "…" }` ⇒ 201 `{ usageId, costUsd, source: "REPORTED", note }`.
Trần: ≤ 500 dòng/agent/ngày (VN), mỗi dòng ≤ 5 000 000 token ⇒ 400 `WORK_AGENT_USAGE_LIMIT`. Model lạ + không gửi
`costUsd` ⇒ `costUsd = 0`, `note = "unknown model"`.

## A9–A11. MCP (để FE hiện hướng dẫn trên trang agent / developer)

- URL: `https://cuongthai.com/api/v1/work/mcp` (Streamable HTTP, stateless, chỉ POST; GET/DELETE ⇒ 405).
- Lệnh cho Claude Code (hiện sau khi tạo token, thay `<TOKEN>`):
  `claude mcp add --transport http ctwork https://cuongthai.com/api/v1/work/mcp --header "Authorization: Bearer <TOKEN>"`
- Client chỉ có stdio: `CTWORK_TOKEN=<TOKEN> npx -y @cuongthai/ctwork-mcp` (gói `packages/ctwork-mcp`, CHƯA publish).
- Tool: whoami, list_projects, my_work, get_issue, search_issues, list_pages, get_page, claim_issue, heartbeat,
  release_issue, comment, transition, update_issue, create_issue, log_work, report_usage, attach_file, attach_complete,
  ask_lead, request_review, wait_events. Prompt: `work_on_issue`.
