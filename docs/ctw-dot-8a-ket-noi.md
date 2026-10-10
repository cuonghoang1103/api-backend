# CT Work đợt 8a — Kết nối Microsoft 365 và Google Workspace

Kết nối theo **từng người dùng** (OAuth 2.0 + PKCE). Mỗi kết nối chỉ thuộc về một người; đồng đội và AI agent không dùng được.

## Người dùng thấy gì

| Chỗ | Làm được |
|---|---|
| `/work/connections` ("My connections", có ở thanh bên + menu tài khoản) | Kết nối / kết nối lại / ngắt kết nối (tuỳ chọn xoá luôn sự kiện CT Work đã thêm vào lịch). Xem trạng thái, lỗi gần nhất, quyền đã xin, nhật ký (kết nối, đẩy/kéo lịch, xung đột, lỗi). Chọn lịch đích + bật đồng bộ hai chiều hạn thẻ / cuộc họp, "Sync now", "Resync all". |
| Chi tiết thẻ → tab Links → **Cloud files** | Gắn tệp OneDrive/SharePoint (hộp chọn của CT Work: Recent / My files / Shared with me / Search) hoặc Google Drive (Google Picker) dưới dạng **liên kết**: tên, biểu tượng theo loại, người sửa cuối. Nút xem trước nhúng (iframe). |
| Chi tiết cuộc họp | Cạnh nút Jitsi: **Teams meeting** / **Google Meet** (chỉ hiện khi người xem đã kết nối). Link điền vào chỗ "Join". |
| Cài đặt dự án → **Microsoft 365 & Google** | Xuất danh sách thẻ (lọc JQL tuỳ chọn) hoặc báo cáo khối lượng việc (người làm × trạng thái) ra Google Sheet / Excel trên OneDrive. **Một chiều** (CT Work → bảng tính), nút "Resync" ghi đè vùng dữ liệu. Ghi rõ trên giao diện. |

Thiếu biến môi trường ⇒ thẻ nhà cung cấp hiện "Not available yet — an administrator has not configured this integration", không có nút, không lỗi 500 (`/start` trả 409 `INTEGRATION_NOT_CONFIGURED`).

## Cách bật (quản trị viên)

1. Đăng ký app theo đúng các giá trị đã chốt ở `docs/ctw-ke-hoach-tong.md` mục "Đợt 8":
   - **Redirect URI** (phải khớp từng ký tự):
     `https://cuongthai.com/api/v1/work/integrations/microsoft/callback`,
     `https://cuongthai.com/api/v1/work/integrations/google/callback`.
     Local dev: thêm `http://localhost:4000/api/v1/work/integrations/<provider>/callback`.
   - **Microsoft (Entra ID, "Accounts in any organizational directory and personal Microsoft accounts")** — delegated:
     `openid profile email offline_access User.Read Calendars.ReadWrite OnlineMeetings.ReadWrite Files.ReadWrite`.
   - **Google Cloud** — bật Google Calendar API, Google Drive API, Google Sheets API, Google Picker API; scope
     `openid email profile calendar.events drive.file spreadsheets`.
2. Thêm vào `/opt/cuonghoangdev/.env` trên VPS (và `.env` local nếu cần):
   ```
   CTW_MS_CLIENT_ID=…            CTW_MS_CLIENT_SECRET=…
   CTW_GOOGLE_CLIENT_ID=…        CTW_GOOGLE_CLIENT_SECRET=…
   CTW_NOTION_CLIENT_ID=…        CTW_NOTION_CLIENT_SECRET=…   # đợt 8b
   ```
   Tuỳ chọn: `CTW_GOOGLE_PICKER_API_KEY` (API key giới hạn referrer `cuongthai.com` — Picker vẫn chạy với token OAuth khi trống),
   `CTW_OAUTH_REDIRECT_BASE` (ghi đè gốc redirect URI), `CTW_CALENDAR_SYNC=off` (tắt cron 5 phút).
   Nên đặt `APP_ENCRYPTION_KEY` (32 byte base64) — không có thì khoá mã hoá token suy từ `JWT_SECRET` (đổi JWT_SECRET ⇒ mọi
   người phải kết nối lại).
3. Khởi động lại backend (env đọc lúc chạy, không cần build lại frontend). Migration: `20261012010000_ctw8a_oauth_m365_google`.

## Giới hạn cần biết

- **Google ở chế độ Testing: tối đa 100 test user**, và phải thêm email từng người vào "Test users" trong OAuth consent screen,
  nếu không Google báo "access blocked". Token refresh của app Testing **hết hạn sau 7 ngày** ⇒ người dùng phải "Reconnect".
  Lên Production cần Google xác minh (`calendar.events` là scope *sensitive*; `drive.file` và `spreadsheets` đã chọn để
  tránh scope *restricted*).
- **Tài khoản trường (FPT, tenant Entra ID) có thể bị chặn cấp quyền** cho app chưa xác minh nhà phát hành ("Need admin
  approval"). Tài khoản Outlook/Hotmail cá nhân chắc chắn chạy.
- **Teams**: `/me/onlineMeetings` chỉ có với tài khoản Microsoft 365 công việc/trường học. Tài khoản cá nhân ⇒ thông báo rõ
  "Teams meetings need a work or school Microsoft 365 account".
- **Google chọn lịch**: scope `calendar.events` không cho đọc danh sách lịch ⇒ danh sách chỉ có "Primary calendar"; muốn lịch
  khác thì dán Calendar ID (Google Calendar → Settings → Integrate calendar).
- **Google Drive** dùng `drive.file`: CT Work chỉ thấy tệp người dùng chọn qua Picker (hoặc do CT Work tạo) — không duyệt
  được cả Drive. Biểu tượng tệp vẽ theo loại MIME (không tải iconLink — CSP img-src).
- **Microsoft không có endpoint thu hồi theo app**: ngắt kết nối xoá token phía CT Work, kèm link
  `https://myaccount.microsoft.com/applications` để người dùng tự gỡ quyền. Google: gọi `oauth2.googleapis.com/revoke`.
- **App desktop**: nút Connect mở tuyến `/start` trong trình duyệt hệ thống (callback phải về cùng trình duyệt có cookie
  `ctw_oauth`) ⇒ trình duyệt đó cần đang đăng nhập cuongthai.com. Kết nối xong, app thấy ngay (kết nối lưu theo tài khoản).
- Xem trước OneDrive tạo link nhúng bằng kết nối của **người xem**; chưa kết nối ⇒ mở link gốc.
- Bảng tính tối đa 5.000 thẻ/lần; chỉ người tạo đồng bộ lại được (tệp nằm trong drive của họ). Excel: ghi qua workbook
  API; không mở được (OneDrive cá nhân cũ, sheet "CT Work" bị đổi tên…) ⇒ thay cả tệp và báo "file was replaced".

## Thiết kế

### Khung OAuth chung — `src/services/work/oauth/`
- `registry.ts` — `registerProvider()` (8b cắm Notion/Slack ở đây), `redirectUri()`, `providerConfigured()`.
- `connections.ts` — `startAuthorization` / `completeAuthorization` / `liveConnection` (tự refresh, khoá một lần mỗi kết nối,
  Microsoft xoay refresh token) / `providerRequest` (Bearer + 401 ⇒ refresh rồi thử lại một lần) / `disconnect` / `listConnections`.
- `crypto.ts` — AES-256-GCM, AAD `provider:userId`; state `nonce.exp.HMAC(nonce|userId|provider|exp)`; PKCE S256.
- `http.ts` — lối ra mạng duy nhất; `_setOAuthFetchForTests()`; trong test mà quên mock ⇒ ném lỗi (không gọi Internet).
- State lưu ở `work_oauth_states` (verifier mã hoá, hạn 10 phút, dùng một lần) + cookie httpOnly `ctw_oauth`
  (path `/api/v1/work/integrations`) gắn với trình duyệt đã bấm Connect. Callback: sai/giả/khác nhà cung cấp/hết hạn/đã
  dùng/khác trình duyệt ⇒ **400** (trang HTML ngắn + link quay lại).

### Lịch hai chiều — `src/services/work/cloud/calendarSync.ts`
- Phạm vi: thẻ **được giao** có hạn, chưa xong (sự kiện cả ngày) + cuộc họp người đó tổ chức/được mời (không huỷ, mô-đun họp bật,
  không phải dự án cổng khách).
- **Đẩy**: bus sự kiện (`issue.*`, `governance.updated` của họp, debounce 1,5 s) + cron 5 phút reconcile. `pushedHash` trùng ⇒
  không gọi API.
- **Kéo**: Graph `calendarView/delta` (deltaLink, `Prefer: IdType="ImmutableId"`) / Google `events.list` (syncToken; 410 ⇒
  đồng bộ lại từ đầu). Nhận diện bằng bảng `work_calendar_links` + `extendedProperties.private.ctworkId` /
  `singleValueExtendedProperties` (`String {6a1f4c52-…} Name ctworkId`).
- **Chống vòng lặp**: giờ bên lịch trùng giờ đã đẩy ⇒ tiếng vọng, bỏ qua; khi áp thay đổi từ lịch, liên kết được cập nhật
  TRƯỚC khi sửa CT Work ⇒ sự kiện bus sinh ra thấy hash trùng, không đẩy ngược.
- **Xung đột** (hai bên cùng đổi giờ kể từ lần đẩy cuối): bản sửa mới nhất thắng (`updatedAt` CT Work vs `updated` /
  `lastModifiedDateTime`), ghi dòng `conflict` vào nhật ký.
- Áp thay đổi bằng quyền của chính người đó (`updateIssueAs` ⇒ lịch sử thẻ; `updateMeeting` + audit `meeting.calendar_sync`).
  Không có quyền ⇒ trả liên kết về cũ, lần đẩy sau đặt lại giờ của CT Work.
- Xoá sự kiện bên lịch **không xoá thẻ/họp**: liên kết "tách" (`detachedAt`), thôi đẩy; "Resync all" gắn lại.

### Quyền & agent
- Tuyến ngoài dự án (`/integrations/**`) bị `agentTopRouteAllowed` chặn (fail-closed); `/projects/:pid/cloud/**` nằm trong
  `AGENT_DENIED_ROUTES` (đã thêm vào bảng `permissions.test.ts`); service chặn lần nữa (`assertHuman` ⇒ 403 `AGENT_NO_OAUTH`).
- Khách cổng: `/cloud/**` không nằm trong danh sách trắng cổng khách ⇒ 403 `CLIENT_PORTAL_ONLY`; component tự ẩn.
- Gắn tệp: `issue.edit` (ADMIN/MEMBER). Gỡ: người gắn hoặc ADMIN/MEMBER. Xuất bảng tính: ai xem được dự án (dữ liệu đọc
  bằng quyền của họ qua `exportRows`). Tạo phòng họp: quyền sửa họp.
- **Không thêm bước bảo mật bắt buộc nào cho thành viên** — kết nối hoàn toàn tự nguyện.

## API

```
GET    /work/integrations                                  kết nối của tôi + nhật ký
GET    /work/integrations/:provider/start[?returnTo=&format=json]
GET    /work/integrations/:provider/callback               (công khai — state + cookie)
DELETE /work/integrations/:provider[?removeEvents=1]
GET    /work/integrations/:provider/calendars
PUT    /work/integrations/:provider/calendar               { enabled, calendarId, calendarName, syncIssues, syncMeetings, resync }
POST   /work/integrations/:provider/sync
GET    /work/integrations/microsoft/files?view=recent|root|shared|folder|search&folderId=&driveId=&q=
GET    /work/integrations/google/picker                    token ngắn hạn cho Google Picker (chỉ chủ kết nối)
GET|POST   /work/projects/:pid/cloud/issues/:num/files     { provider, fileId, driveId? }
DELETE     /work/projects/:pid/cloud/issues/:num/files/:id
GET        /work/projects/:pid/cloud/files/:id/preview
POST       /work/projects/:pid/cloud/meetings/:num/online  { provider }
GET|POST   /work/projects/:pid/cloud/sheets                { provider, kind: issues|report, title, jql? }
POST       /work/projects/:pid/cloud/sheets/:id/sync
DELETE     /work/projects/:pid/cloud/sheets/:id            (chỉ bỏ khỏi danh sách, tệp giữ nguyên)
```

## Kiểm

```
npx tsx --test src/services/work/oauth/oauth.test.ts                       # thuần: mã hoá, state, PKCE, adapter
WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw8a.db.test.ts             # HTTP + DB, nhà cung cấp GIẢ
E2E_BASE_URL=http://localhost:3000 npx tsx --test frontend/e2e/work/connections.spec.ts   # giao diện + axe + ảnh
```
Bộ DB dựng máy chủ Microsoft/Google giả trong bộ nhớ (token endpoint kiểm PKCE thật, Calendar có syncToken, Graph có
deltaLink, Drive, Sheets) — không bao giờ gọi Microsoft/Google thật.
