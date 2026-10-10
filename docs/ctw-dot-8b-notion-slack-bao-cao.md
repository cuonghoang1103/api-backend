# CTW đợt 8b — Notion · Slack · Trình soạn báo cáo · Lịch tự gửi (12/10/2026)

Mã: `src/routes/work.ctw8b.routes.ts` · `src/services/work/{notion,slack,reportBuilder,reportSchedule}.service.ts` · luật thuần
`{notionBlocks,slackRules,reportBuilder,reportBuilderExport}.ts` · nhà cung cấp OAuth `ctw8bProviders.ts` (cắm vào khung 8a
`src/services/work/oauth/` bằng `registerProvider()` — KHÔNG có khung OAuth thứ hai, token nằm ở `work_oauth_connections`).
Migration `20261012030000_ctw8b_notion_slack_report_builder` (chỉ thêm bảng: `work_report_templates`, `work_report_send_plans`,
`work_report_deliveries`, `work_slack_installs`, `work_slack_channels`, `work_ext_nonces`).
Giao diện: `/work/<ws>/<KEY>/reports/builder` (Builder · Lịch gửi · Nhật ký) và `/work/<ws>/<KEY>/connect` (Notion · Slack).
Test: `npx tsx --test src/services/work/notionBlocks.test.ts src/services/work/ctw8b.test.ts` ·
`WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw8b.db.test.ts` (không gọi Notion/Slack thật — `_setOAuthFetchForTests`).

## Bất biến
- Notion/Slack đi bằng kết nối OAuth của NGƯỜI (khung 8a). Agent bị chặn ở tuyến (`AGENT_DENIED_ROUTES`: `/notion`, `/slack`,
  `/report-builder`, `/report-plans`) và ở service.
- `/ctwork new` KHÔNG tạo thẻ — tạo đề xuất `work_intake_proposals` (source `SLACK`) chờ người duyệt ở trang Intake (như Discord 7b).
- Chữ ký Slack v0 sai / lệch > 5 phút ⇒ 401; gửi lại đúng gói ⇒ 409 (`work_ext_nonces`). Sự kiện Slack gửi lại (cùng event_id) bị bỏ.
- Unfurl chỉ link thẻ của không gian CT Work ĐÃ nối với workspace Slack đó.
- Ảnh Notion tự lưu ⇒ tải về kho ảnh dự án (chỉ từ máy chủ tệp của Notion); ảnh ngoài https giữ link — không tải URL tuỳ ý (SSRF).
- Lịch gửi: mỗi kỳ ĐÚNG MỘT lần (UNIQUE lịch + khoá kỳ `W:<tuần ISO>` / `S:<sprint>`). Người nhận ngoài dự án ⇒ PENDING tới khi
  OWNER/ADMIN duyệt (người tạo là OWNER/ADMIN thì coi như đã duyệt). Báo cáo dựng dưới quyền người tạo lịch.
- Biểu đồ vẽ SVG ở máy chủ, CHỮ LÀ ĐƯỜNG (glyph Roboto có dấu tiếng Việt) ⇒ PNG trên node:22-slim không có font vẫn đủ chữ.
- Thiếu env ⇒ nút ẩn + ghi chú; webhook Slack trả 401; không 500.

## Người dùng tự làm (cấu hình app)
### Notion
notion.so/profile/integrations → New integration → **Public** → Redirect URI `https://cuongthai.com/api/v1/work/integrations/notion/callback`
(+ `http://localhost:4000/…` cho dev) → capability Read/Insert/Update content → chép OAuth client ID/secret vào `CTW_NOTION_CLIENT_ID/SECRET`.
Người dùng bấm Kết nối ở `/work/connections`, chọn trang chia sẻ cho integration (Notion chỉ cho đọc trang đã chia sẻ).

### Slack
api.slack.com/apps → Create New App (From scratch) →
1. OAuth & Permissions: Redirect URL `https://cuongthai.com/api/v1/work/integrations/slack/callback`; Bot Token Scopes:
   `chat:write`, `chat:write.public`, `channels:read`, `groups:read`, `commands`, `links:read`, `links:write`, `files:write`.
2. Slash Commands: `/ctwork` → Request URL `https://cuongthai.com/api/v1/work/intake/slack/commands`, gợi ý `new <summary> | <details>`.
3. Event Subscriptions: Request URL `https://cuongthai.com/api/v1/work/intake/slack/events` (Slack gửi url_verification — CT Work trả
   challenge sau khi kiểm chữ ký); Bot events: `link_shared`. App unfurl domains: `cuongthai.com`.
4. Basic Information: chép Client ID / Client Secret / **Signing Secret** vào `CTW_SLACK_CLIENT_ID/SECRET/SIGNING_SECRET` trên VPS.
5. OWNER/ADMIN không gian: `/work/<ws>/<KEY>/connect` → Slack → "Add to Slack" → "Use this Slack workspace" ⇒ ADMIN dự án chọn kênh.
   Kênh private: mời bot vào kênh trước (`/invite @CT Work`).
nginx: `/api/v1/work/intake/**` đi chung khối `/api/` — không cần sửa; `index.ts` đã gắn `express.raw` cho `/api/v1/work/intake`.

## Chưa thử với tài khoản thật
- Notion File Upload API (`/v1/file_uploads`, xuất ảnh sang Notion) và Slack `files.getUploadURLExternal` theo tài liệu lúc viết —
  nếu ảnh/tệp không lên, xem `work_oauth_logs` / `work_slack_channels.last_error` trước.
