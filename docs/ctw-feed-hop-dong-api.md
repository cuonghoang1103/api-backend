# CT Work — Bảng tin (Team Feed) — hợp đồng API

Viết bởi agent BE ngày 21/10/2026 (nhánh `ctw-feed`). Đây là hợp đồng cho **web + app iOS CT Work**. Đổi hợp đồng ⇒
sửa file này TRONG CÙNG commit.

Tất cả đường dưới `/api/v1/work`, xác thực như mọi tuyến CT Work (JWT `Authorization: Bearer …` hoặc cookie; token
`ctw_` cá nhân cũng được). Khuôn chung: `{ "success": true, "data": … }`; lỗi `{ "success": false, "message", "code" }`.

`PUBLIC_USER` = `{ id, username, fullName, displayName, avatarUrl, kind }` (`kind`: `'HUMAN' | 'AGENT'`).
Mọi thời điểm là chuỗi ISO-8601 UTC.

---

## 0. Mô hình & quyền (đọc trước)

| Cấp | Ai ĐỌC / ĐĂNG / bình luận / thả cảm xúc | Ai QUẢN TRỊ (ghim, gỡ bài người khác, xem báo cáo) |
|---|---|---|
| **Không gian** (`projectId = null`) | Mọi thành viên không gian (OWNER/ADMIN/MEMBER/GUEST) **trừ khách cổng** (GUEST hoặc MEMBER "chỉ là khách cổng" — có vai CLIENT ở dự án bật cổng khách) | OWNER/ADMIN không gian |
| **Dự án** (`projectId` có) | Người có vai hiệu lực ADMIN/MEMBER/TEACHER/VIEWER trong dự án (OWNER/ADMIN không gian = ADMIN mọi dự án). **Vai CLIENT không bao giờ thấy** (dù dự án có bật cổng khách hay không). | ADMIN dự án (gồm OWNER/ADMIN không gian) |

- **AI agent** (`users.kind = AGENT`, token scope `agent`): KHÔNG đọc, KHÔNG ghi bảng tin (403 `WORK_AGENT_FORBIDDEN`).
  Bảng tin là chỗ của người. Agent báo cáo bằng bình luận trên thẻ. (Tuyến `/feed/**` nằm ngoài `/projects/:pid` ⇒
  `agentTopRouteAllowed` chặn sẵn; service chặn lần nữa; MCP tool `feed` là `personOnly`.)
- Không thấy bài/không có quyền ⇒ **404** (không bao giờ lộ là bài tồn tại). Thấy mà không được làm ⇒ 403.
- **Chặn (block) của site** (`/messages/blocks`): bài của người mình đã chặn **không xuất hiện** trong bảng tin của
  mình; bình luận của họ trả về với `hiddenForMe: true` (client thu gọn: "Bình luận từ người bạn đã chặn"). Người
  đã chặn mình không nhận thông báo do mình gây ra (bình luận, @nhắc, bài mới).
- **Ẩn cho tôi** (`hide`) và **đã báo cáo** ⇒ bài không còn trong bảng tin của người đó.
- **Gỡ bởi quản trị** (`moderation hidden`): bài/bình luận biến khỏi mọi người, trừ tác giả và quản trị viên phạm vi
  đó (họ thấy kèm `hidden: true` để giao diện ghi "Đã bị quản trị viên gỡ").

### Giới hạn

| | |
|---|---|
| Nội dung bài | Markdown, ≤ 10 000 ký tự. Bài phải có chữ, tệp, hoặc bình chọn. |
| Bình luận | Markdown, ≤ 4 000 ký tự. Trả lời đúng **một cấp** (trả lời một trả lời ⇒ server gắn vào bình luận gốc). |
| Đính kèm / bài | ≤ **10 ảnh/video** + ≤ **5 tệp** khác. |
| Ảnh | JPEG/PNG/WebP/GIF ≤ 20 MB (tải qua backend — server làm thumbnail ≤ 1280 px, đo width/height). iOS: gửi JPEG (đổi HEIC trước). |
| Video | MP4/MOV/WebM ≤ **200 MB** (PUT thẳng R2 qua URL ký sẵn); ≤ 25 MB cũng tải qua backend được. Ảnh poster tuỳ chọn ≤ 3 MB. |
| Tệp khác | ≤ 100 MB qua URL ký sẵn, ≤ 25 MB qua backend. SVG/HTML/XML/JS bị lưu dạng `application/octet-stream` (không bao giờ chạy từ origin của web). |
| Bình chọn | 2–6 lựa chọn, mỗi lựa chọn ≤ 120 ký tự, `multi` tuỳ chọn, `closesAt` tuỳ chọn (≤ 90 ngày). |
| Tốc độ | ≤ 10 bài / phút / người, ≤ 30 bình luận / phút / người ⇒ 429-như `400 WORK_RATE`. |
| URL ký sẵn | Sống **10 phút** (`urlExpiresAt`). Hết hạn ⇒ tải lại bài hoặc gọi `GET /feed/attachments/:id/url`. |

### Cảm xúc (CÙNG MỘT BỘ cho web và iOS)

| `kind` | Emoji | Nhãn en / vi |
|---|---|---|
| `like` | 👍 | Like / Thích |
| `love` | ❤️ | Love / Yêu thích |
| `haha` | 😂 | Haha |
| `wow` | 😮 | Wow |
| `sad` | 😢 | Sad / Buồn |
| `celebrate` | 🎉 | Celebrate / Chúc mừng |

Mỗi người một cảm xúc cho mỗi bài (và mỗi bình luận); thả loại khác ⇒ đổi.

### Lý do báo cáo

`spam | harassment | hate | sexual | violence | other` (+ `detail` ≤ 1000 ký tự tuỳ chọn).

---

## 1. Kiểu dữ liệu

### FeedAttachment

```json
{
  "id": 41, "kind": "IMAGE",            // IMAGE | VIDEO | FILE
  "status": "READY",                    // PENDING (đã xin URL, chưa PUT/complete) | READY
  "fileName": "sprint-demo.png", "mime": "image/png", "size": 482113,
  "width": 1920, "height": 1080, "durationMs": null, "alt": "Burndown chart, sprint 4",
  "position": 0,
  "url": "https://…signed…",           // bản gốc, inline (xem/phát). null khi PENDING
  "thumbUrl": "https://…signed…",      // IMAGE: ≤ 1280 px (JPEG/WebP). VIDEO: ảnh poster nếu có. FILE: null
  "posterUrl": null,                    // VIDEO: ảnh poster (= thumbUrl)
  "urlExpiresAt": "2026-10-21T10:10:00.000Z"
}
```

Tải về đúng tên: `GET /feed/attachments/:id/url?download=1`. Xem trước tệp trong app (chữ/markdown/csv ≤ 2 MB,
docx/xlsx): `GET /feed/attachments/:id/content`, `GET /feed/attachments/:id/preview` (giống trình xem tệp `xemTep` của
thẻ/chat).

### FeedRef (thẻ nội bộ — dựng theo quyền NGƯỜI XEM)

Link CT Work trong nội dung (`/work/<ws>/<KEY>/issue/12`, `…/docs/3`, `…/tests/5`, `…/meetings/2`, hoặc `KEY-12` trần
trong bài của dự án) ⇒ thẻ xem trước. Người xem không thấy thẻ/trang đó ⇒ thẻ **bị bỏ**, không báo "bị khoá".

```json
{ "t": "issue", "key": "FP-12", "n": 12, "url": "/work/acme/FP/issue/12", "title": "Login page",
  "status": { "name": "In Progress", "category": "IN_PROGRESS" }, "type": { "key": "story", "name": "Story", "color": "#4BADE8" },
  "assignee": { "id": 7, "name": "An Nguyen", "avatarUrl": null }, "project": "Flying Pencil", "when": null }
```

`t`: `issue | test | doc | meeting`.

### FeedLinkPreview (thẻ link web ngoài — máy chủ tải OpenGraph lúc ĐĂNG/SỬA)

```json
{ "url": "https://react.dev/blog", "domain": "react.dev", "title": "React Blog", "description": "…", "siteName": "React",
  "imageUrl": "https://…signed…" }   // ảnh OG đã tải về R2 (≤ 600 px) — null nếu trang không có / tải hỏng
```

Chỉ link web ngoài ĐẦU TIÊN của bài được dựng thẻ. Tải có rào SSRF (chỉ http/https công khai, kiểm IP mọi chặng chuyển
hướng, ≤ 4 chặng, hết giờ 6 s, trần 512 KB HTML / 3 MB ảnh).

### FeedPoll

```json
{ "options": [ { "id": "a", "text": "Thứ 5", "votes": 3 }, { "id": "b", "text": "Thứ 6", "votes": 1 } ],
  "multi": false, "closesAt": null, "closed": false, "totalVotes": 4, "voters": 4, "myVotes": ["a"] }
```

### FeedPost

```json
{
  "id": 12,
  "workspace": { "id": 1, "slug": "acme", "name": "Acme Studio", "logoUrl": null },
  "project": { "id": 3, "key": "FP", "name": "Flying Pencil" },          // null = bài cấp không gian
  "author": PUBLIC_USER,
  "authorRole": "ADMIN",                 // vai trong phạm vi bài: OWNER|ADMIN|MEMBER|GUEST (ws) · ADMIN|MEMBER|TEACHER|VIEWER (dự án)
  "body": "Sprint 4 demo is **Friday** — @an please bring the build. See /work/acme/FP/issue/12 #demo",
  "mentions": [ { "id": 7, "username": "an", "name": "An Nguyen" } ],
  "hashtags": ["demo"],
  "attachments": [ FeedAttachment ],
  "linkPreview": FeedLinkPreview | null,
  "refs": [ FeedRef ],
  "poll": FeedPoll | null,
  "reactionCount": 5,
  "reactions": [ { "kind": "like", "count": 3 }, { "kind": "celebrate", "count": 2 } ],   // giảm dần theo count
  "myReaction": "like",                  // null nếu chưa thả
  "commentCount": 4,                     // gồm cả trả lời
  "comments": [ FeedComment ],           // xem trước: 2 bình luận GỐC mới nhất (xếp cũ → mới), không kèm trả lời
  "commentsOff": false,
  "pinned": true, "pinnedAt": "…",
  "saved": false,
  "hidden": false,                       // true = đã bị quản trị viên gỡ (chỉ tác giả + quản trị thấy)
  "editedAt": null, "createdAt": "…",
  "url": "/work/acme/feed?post=12",      // đường dẫn sâu (xem §6)
  "can": { "edit": true, "delete": true, "pin": true, "moderate": true, "comment": true, "react": true, "report": false }
}
```

Hiển thị `@username` trong `body`: đối chiếu với `mentions` (chỉ tô chip cho người có trong `mentions`).
`#hashtag` (chữ/số/_ , 2–40 ký tự, có dấu tiếng Việt) bấm vào ⇒ tìm `q=#hashtag`.

### FeedComment

```json
{
  "id": 88, "postId": 12, "parentId": null,      // null = bình luận gốc; số = trả lời của bình luận gốc đó
  "author": PUBLIC_USER, "body": "On it @minh", "mentions": [ { "id": 9, "username": "minh", "name": "Minh" } ],
  "reactionCount": 1, "reactions": [ { "kind": "like", "count": 1 } ], "myReaction": null,
  "replyCount": 2,                                 // chỉ bình luận gốc
  "replies": [ FeedComment ],                      // trong danh sách bình luận GỐC: 2 trả lời ĐẦU TIÊN; còn lại xin bằng parentId
  "hidden": false, "hiddenForMe": false, "authorBlocked": false, "reportedByMe": false,
  "editedAt": null, "createdAt": "…",
  "can": { "edit": true, "delete": true, "moderate": false, "report": false, "reply": true }
}
```

Bình luận đã xoá không trả về; xoá một bình luận GỐC xoá luôn các trả lời của nó (`commentCount` trừ đủ).

---

## 2. Phạm vi + cài đặt thông báo

### `GET /feed/scopes`

Mọi phạm vi người gọi đọc được (cho bộ lọc + chọn nơi đăng).

```json
{ "scopes": [ {
  "workspace": { "id": 1, "slug": "acme", "name": "Acme Studio", "logoUrl": null },
  "role": "ADMIN", "canPost": true, "canModerate": true, "follow": "ALL",
  "projects": [ { "id": 3, "key": "FP", "name": "Flying Pencil", "role": "MEMBER", "canPost": true, "canModerate": false, "follow": "ALL" } ]
} ], "openReports": 2 }   // openReports = số báo cáo đang mở trong các phạm vi người gọi quản trị
```

### `PUT /feed/follow` — `{ "workspaceId": 1, "projectId": 3 | null, "level": "ALL" | "MENTIONS" | "OFF" }`

- `ALL` (mặc định): chuông cho mọi bài mới + @nhắc. `MENTIONS`: chỉ @nhắc. `OFF`: không gì từ phạm vi này (kể cả @nhắc).
- Hoạt động trên **bài của chính mình** (bình luận, trả lời bình luận của mình, cảm xúc) LUÔN báo, bất kể mức này.
- Trả `{ workspaceId, projectId, level }`.

### `GET /feed/mentionable?workspaceId=1&projectId=3&q=an` → `{ "users": [PUBLIC_USER] }` (≤ 20)

Người @nhắc được ở phạm vi đó (đọc được bảng tin đó; không khách, không agent).

---

## 3. Bảng tin

### `GET /feed`

| Tham số | |
|---|---|
| `workspaceId` | tuỳ chọn — chỉ không gian này (bài cấp không gian + bài của các dự án người gọi thấy trong đó) |
| `projectId` | tuỳ chọn — chỉ dự án này |
| `level=workspace` | cùng `workspaceId`: CHỈ bài cấp không gian |
| `filter` | `all` (mặc định) · `mine` (tôi đăng) · `media` (có ảnh/video) · `saved` (đã lưu) · `files` (có tệp) |
| `author` | id người đăng |
| `q` | tìm trong nội dung (không phân biệt hoa thường; `#tag` tìm hashtag) |
| `cursor` | chuỗi mờ từ `nextCursor` |
| `limit` | 1–50, mặc định 20 |

Không có `workspaceId`/`projectId` = **bảng tin gộp** (tab "Bảng tin" của Việc của tôi): mọi phạm vi người gọi đọc được.

```json
{ "posts": [FeedPost], "pinned": [FeedPost], "nextCursor": "MjAyNi0xMC0yMVQwOTo…" | null }
```

- Thứ tự: mới nhất trước (`createdAt` desc, `id` desc).
- `pinned`: CHỈ ở trang đầu (không `cursor`) khi lọc theo MỘT phạm vi (`projectId`, hoặc `workspaceId` — khi đó là bài
  ghim cấp không gian), `filter=all`, không `q`/`author`. Bài ghim KHÔNG lặp lại trong `posts`. Bảng tin gộp: không có
  mục ghim riêng (bài ghim nằm theo thời gian, `pinned: true`).

### `GET /feed/new-count?since=<ISO>&workspaceId=&projectId=` → `{ "count": 3 }`

Đếm bài mới (của người khác) sau `since` — dự phòng cho viên "N bài mới" khi socket mất.

---

## 4. Bài

| Lệnh | Thân | Trả |
|---|---|---|
| `POST /feed/posts` | `{ workspaceId, projectId?: number\|null, body?: string, attachmentIds?: number[], poll?: { options: string[], multi?: boolean, closesAt?: ISO\|null }, commentsOff?: boolean, clientKey?: string }` | 201 `FeedPost` |
| `GET /feed/posts/:id` | — | `FeedPost` |
| `PATCH /feed/posts/:id` | `{ body?, attachmentIds? (nháp mới để GẮN THÊM), removeAttachmentIds?, alts?: [{ id, alt }], commentsOff? }` | `FeedPost` (`editedAt` đặt khi nội dung/tệp đổi) |
| `DELETE /feed/posts/:id` | — | `{ deleted: true }` — tác giả hoặc quản trị |
| `PUT /feed/posts/:id/pin` | `{ pinned: boolean }` | `FeedPost` — quản trị (tối đa 5 bài ghim / phạm vi; ghim thứ 6 ⇒ `400 WORK_FEED_PIN_LIMIT`) |
| `PUT /feed/posts/:id/moderation` | `{ hidden: boolean }` | `FeedPost` — quản trị (gỡ/khôi phục) |
| `PUT /feed/posts/:id/reaction` | `{ kind }` | `{ reactionCount, reactions, myReaction }` |
| `DELETE /feed/posts/:id/reaction` | — | như trên |
| `GET /feed/posts/:id/reactions?kind=&cursor=` | — | `{ items: [{ user: PUBLIC_USER, kind, createdAt }], reactions, nextCursor }` |
| `PUT /feed/posts/:id/save` | `{ saved: boolean }` | `{ saved }` |
| `PUT /feed/posts/:id/hide` | `{ hidden: boolean }` | `{ hidden }` — ẩn cho riêng tôi |
| `POST /feed/posts/:id/report` | `{ reason, detail? }` | 201 `{ reported: true, duplicate: boolean }` — không báo cáo bài của chính mình (`400 WORK_REPORT_SELF`) |
| `PUT /feed/posts/:id/vote` | `{ optionIds: string[] }` (rỗng = rút phiếu) | `FeedPoll` |

- `clientKey` (≤ 40 ký tự, tuỳ chọn): gửi lại cùng khoá trong 10 phút ⇒ trả lại bài đã tạo, không tạo bài thứ hai (mạng
  chập chờn trên điện thoại).
- `attachmentIds` = id **nháp** (đã tải, chưa gắn bài) của CHÍNH người gọi, cùng không gian, `status: READY`.
- `commentsOff: true` ⇒ chỉ quản trị bình luận được.
- Bài trong dự án ⇒ `workspaceId` phải là không gian của dự án.

---

## 5. Bình luận

| Lệnh | Thân / tham số | Trả |
|---|---|---|
| `GET /feed/posts/:id/comments` | `?parentId=&cursor=&limit=` (1–50, mặc định 20) | `{ comments: [FeedComment], nextCursor }` — xếp CŨ → MỚI. Không `parentId` = bình luận gốc (mỗi cái kèm ≤ 2 trả lời đầu + `replyCount`); có `parentId` = trả lời của bình luận đó |
| `POST /feed/posts/:id/comments` | `{ body, parentId?: number, clientKey?: string }` | 201 `FeedComment` |
| `PATCH /feed/comments/:cid` | `{ body }` | `FeedComment` — chỉ tác giả |
| `DELETE /feed/comments/:cid` | — | `{ deleted: true }` — tác giả hoặc quản trị |
| `PUT /feed/comments/:cid/reaction` | `{ kind }` | `{ reactionCount, reactions, myReaction }` |
| `DELETE /feed/comments/:cid/reaction` | — | như trên |
| `PUT /feed/comments/:cid/moderation` | `{ hidden: boolean }` | `FeedComment` — quản trị |
| `POST /feed/comments/:cid/report` | `{ reason, detail? }` | 201 `{ reported, duplicate }` |

---

## 6. Tải tệp

### Đường A — qua backend (ảnh, và tệp/video ≤ 25 MB)

`POST /feed/uploads` — `multipart/form-data`: `file` (bắt buộc), `workspaceId` (bắt buộc), `alt` (tuỳ chọn).
⇒ 201 `FeedAttachment` (nháp, `READY`). Ảnh: server tạo thumbnail + đo kích thước. Giao diện hiện % tải bằng tiến độ
của request (XHR `upload.onprogress` / `URLSessionTask.progress`).

### Đường B — URL ký sẵn (video ≤ 200 MB, tệp ≤ 100 MB)

1. `POST /feed/uploads/presign` `{ workspaceId, fileName, mime, size, kind: "VIDEO" | "FILE" }`
   ⇒ 201 `{ "attachment": FeedAttachment /*PENDING*/, "uploadUrl": "https://…", "method": "PUT", "headers": { "Content-Type": "<mime>" }, "expiresAt": "…" }`
   (URL sống 1 giờ. PHẢI gửi đúng header `Content-Type` — chữ ký khoá kiểu.)
2. `PUT uploadUrl` với byte tệp.
3. `POST /feed/uploads/:id/complete` `{ width?, height?, durationMs? }` ⇒ `FeedAttachment` (`READY`). Server HEAD object:
   thiếu ⇒ `400 WORK_UPLOAD_MISSING`; to hơn trần ⇒ xoá + `400 WORK_FILE_TOO_LARGE`.
4. (video, tuỳ chọn) `POST /feed/uploads/:id/poster` — multipart `file` = ảnh JPEG/PNG/WebP ≤ 3 MB (khung hình đầu do
   client trích: web dùng `<video>`+canvas, iOS dùng `AVAssetImageGenerator`) ⇒ `FeedAttachment` có `posterUrl`.

### Khác

- `PATCH /feed/uploads/:id` `{ alt }` — nháp của mình hoặc tệp trong bài của mình.
- `DELETE /feed/uploads/:id` — chỉ nháp của mình (`{ deleted: true }`).
- `GET /feed/attachments/:id/url?variant=full|thumb|poster&download=1` ⇒ `{ url, expiresAt }`.
- Nháp không gắn bài trong 24 giờ bị dọn; mỗi người tối đa 30 nháp treo.
- App desktop (Electron) không PUT thẳng R2 được (CSP) ⇒ web tự lùi về đường A khi PUT hỏng và tệp ≤ 25 MB.

### `POST /feed/link-preview` `{ url }` ⇒ `FeedLinkPreview` (không có `imageUrl` — ảnh chỉ tải khi đăng)

Cho ô soạn bài xem trước. Địa chỉ nội bộ ⇒ `400 WORK_URL_BLOCKED`. Trang không trả lời ⇒ `title` dự phòng từ URL.

---

## 7. Kiểm duyệt (quản trị)

### `GET /feed/reports?workspaceId=&status=OPEN|RESOLVED|DISMISSED|ALL&cursor=`

Chỉ báo cáo trong các phạm vi người gọi quản trị (không quản trị phạm vi nào ⇒ `{ reports: [], … }`).

```json
{ "reports": [ {
  "id": 5, "status": "OPEN", "reason": "spam", "detail": null, "createdAt": "…",
  "reporter": PUBLIC_USER, "reportCount": 2,             // số người đã báo cùng nội dung
  "target": { "type": "post", "postId": 12, "commentId": null, "excerpt": "…", "author": PUBLIC_USER, "hidden": false, "deleted": false },
  "workspace": { "id": 1, "slug": "acme", "name": "Acme Studio" }, "project": { "id": 3, "key": "FP", "name": "Flying Pencil" },
  "resolvedBy": null, "resolvedAt": null, "action": null, "url": "/work/acme/feed?post=12"
} ], "nextCursor": null, "openCount": 2 }
```

### `POST /feed/reports/:id/resolve` `{ action: "remove" | "dismiss" }`

`remove` ⇒ gỡ nội dung (như `moderation hidden: true`) và đóng MỌI báo cáo đang mở của cùng nội dung (`RESOLVED`);
`dismiss` ⇒ đóng các báo cáo đó (`DISMISSED`). Trả báo cáo đã cập nhật.

Báo cáo cũng đi vào hàng chờ kiểm duyệt của quản trị site (`BAO_CAO`) và `POST /work/report` chấp nhận
`kind: "feed_post" | "feed_comment"` (cùng một luật).

---

## 8. Thời gian thực (Socket.IO — cùng kết nối `/` của web)

- Client gửi `work:feed:subscribe` (không tham số) sau mỗi lần kết nối/nối lại ⇒ ack `{ ok: true, rooms: <số phạm vi> }`.
  Server tính các phạm vi người gọi đọc được và cho vào phòng `work:feed:ws:<workspaceId>` (bài cấp không gian) +
  `work:feed:p:<projectId>` (bài dự án). Agent ⇒ `{ ok: false }`. `work:feed:unsubscribe` rời hết.
- Server phát `work:feed:event` — KHÔNG mang nội dung, chỉ id + bộ đếm (client tải lại qua REST, REST lọc quyền):

```json
{ "type": "post.created", "postId": 12, "workspaceId": 1, "projectId": 3, "actorId": 7, "at": "…" }
```

| `type` | Thêm |
|---|---|
| `post.created` | — (viên "N bài mới" — bỏ qua nếu `actorId` là mình) |
| `post.updated` | — (sửa, ghim/bỏ ghim, gỡ/khôi phục, đổi bình chọn) |
| `post.deleted` | — |
| `comment.created` / `comment.updated` / `comment.deleted` | `commentId`, `parentId`, `commentCount` |
| `reaction` | `commentId` (null = cảm xúc trên bài), `reactionCount` |
| `poll` | `totalVotes` |

---

## 9. Thông báo (chuông + đẩy APNs + email)

| Sự kiện | Loại | Ai nhận | Âm (`aps.sound`) | Email |
|---|---|---|---|---|
| Bài mới | `WORK_ALERT` | người đọc được phạm vi, mức theo dõi `ALL`, trừ người đăng/người được @nhắc/người đã chặn người đăng | `ctwork.caf` | không |
| @nhắc trong bài hoặc bình luận | `WORK_MENTION` | người được nhắc (đọc được phạm vi, mức ≠ `OFF`) | `nhac-ten.caf` | theo cài đặt email |
| Bình luận trên bài của tôi | `WORK_COMMENT` | tác giả bài | `tin-nhan.caf` | theo cài đặt |
| Trả lời bình luận của tôi | `WORK_COMMENT` (`reply: true`) | tác giả bình luận gốc | `tin-nhan.caf` | theo cài đặt |
| Cảm xúc trên bài của tôi | `WORK_ALERT` | tác giả bài — GỘP: tối đa 1 thông báo / bài / 15 phút ("An và 3 người khác đã bày tỏ cảm xúc…") | `ctwork.caf` | không |

`payload` (hộp thư `GET /notifications`, chuông web):

```json
{ "issueKey": "FP · Feed", "title": "Flying Pencil", "message": "An Nguyen posted in Flying Pencil",
  "excerpt": "Sprint 4 demo is Friday…", "url": "/work/acme/feed?post=12&comment=88",
  "feed": { "postId": 12, "commentId": 88, "workspaceId": 1, "projectId": 3, "event": "post|mention|comment|reply|reaction" },
  "noEmail": true, "surface": "work" }
```

- **Đường dẫn sâu**: `/work/<wsSlug>/feed?post=<id>` (+ `&comment=<cid>`). Dùng cho MỌI bài (cả bài dự án). Web mở bài
  trong khung chi tiết của bảng tin không gian. iOS: khớp `^/work/([^/]+)/feed\?` ⇒ mở màn bài `post`, cuộn tới `comment`.
- **Gói đẩy APNs** (cấp ngoài cùng, cạnh `duongDan`/`thongBaoId`): `duongDan` = url trên, `feedPostId`, `feedCommentId`
  (nếu có). `thread-id` = `ctw-feed-<postId>`. Category: `WORK_COMMENT`/`WORK_MENTION` ⇒ `CTW_REPLY` — nút Reply của iOS
  phải gửi `POST /feed/posts/<feedPostId>/comments { body, parentId: feedCommentId }` (khi có `feedPostId`), KHÔNG gửi
  vào bình luận thẻ. Còn lại `CTW_DEFAULT`.
- **Công tắc đẩy**: `GET|PUT /work/me/notify-settings` → `push.feed` (mới, mặc định bật) tắt đẩy của bài mới + cảm xúc;
  @nhắc/bình luận theo `push.mention` / `push.comment` như cũ.

---

## 10. Mã lỗi

| HTTP | `code` | Khi |
|---|---|---|
| 400 | `VALIDATION_ERROR` | sai kiểu/thiếu trường |
| 400 | `WORK_EMPTY` | bài không có chữ/tệp/bình chọn; bình luận rỗng |
| 400 | `WORK_TOO_LONG` | quá trần ký tự |
| 400 | `WORK_FEED_TOO_MANY_FILES` | > 10 ảnh/video hoặc > 5 tệp |
| 400 | `WORK_FILE_TOO_LARGE` / `WORK_FILE_EMPTY` / `WORK_FILE_TYPE` | tệp sai |
| 400 | `WORK_UPLOAD_MISSING` | `complete` mà object chưa có trên R2 |
| 400 | `WORK_FEED_BAD_ATTACHMENT` | id nháp không hợp lệ (không phải của mình / khác không gian / chưa READY / đã gắn) |
| 400 | `WORK_FEED_POLL` / `WORK_FEED_POLL_CLOSED` | bình chọn sai / đã đóng |
| 400 | `WORK_FEED_PIN_LIMIT` | quá 5 bài ghim |
| 400 | `WORK_RATE` | đăng/bình luận quá nhanh |
| 400 | `WORK_REPORT_SELF` | báo cáo nội dung của mình |
| 400 | `WORK_URL_BLOCKED` | link-preview tới địa chỉ nội bộ |
| 401 | `UNAUTHORIZED` | chưa đăng nhập |
| 403 | `WORK_AGENT_FORBIDDEN` | AI agent |
| 403 | `WORK_FEED_FORBIDDEN` | thấy nhưng không được (sửa bài người khác, ghim khi không phải quản trị, bình luận khi `commentsOff`) |
| 404 | `NOT_FOUND` | không có hoặc không được thấy |

---

## 11. Việc của app iOS

1. Tab/mục "Bảng tin" (gộp, lọc theo không gian/dự án qua `GET /feed/scopes`), màn bảng tin của không gian và của dự án.
2. Thẻ bài: avatar + tên + chip vai + nhãn phạm vi + thời gian tương đối + `body` (Markdown, @chip theo `mentions`,
   `#tag`), lưới ảnh 1/2/3/4+ (ô thứ 4 ghi "+N"), trình xem ảnh toàn màn hình, video phát bằng `url` (AVPlayer — URL ký
   sống 10 phút ⇒ xin lại bằng `/feed/attachments/:id/url` khi hết hạn), tệp mở trình xem tệp, thẻ link, thẻ thẻ/Docs,
   bình chọn.
3. Thanh cảm xúc: chạm = `like`, giữ = bảng 6 cảm xúc; "Ai đã bày tỏ" = `/reactions`.
4. Bình luận một cấp trả lời, "Xem thêm", @nhắc (gợi ý từ `/feed/mentionable`), sửa/xoá của mình.
5. Soạn bài: chọn phạm vi (`canPost`), chọn ảnh/video (PHPicker ⇒ JPEG + video ≤ 200 MB qua Đường B), tệp, bình chọn,
   alt text, `clientKey` chống đăng trùng.
6. Menu "…": Lưu, Sao chép liên kết (`https://cuongthai.com` + `url`), Ẩn bài này, Báo cáo (lý do), (tác giả) Sửa/Xoá,
   (quản trị) Ghim/Gỡ.
7. Kiểm duyệt cho quản trị: `/feed/reports` + `resolve`.
8. Thời gian thực: `work:feed:subscribe` + `work:feed:event` ⇒ viên "N bài mới" (bấm ⇒ tải lại đầu danh sách), cập
   nhật bộ đếm.
9. Đẩy: route `duongDan` `/work/<ws>/feed?post=` ⇒ màn bài; Reply từ thông báo ⇒ `POST /feed/posts/:id/comments`;
   công tắc `push.feed` trong cài đặt thông báo; mức theo dõi từng phạm vi (`PUT /feed/follow`).
10. App Store 1.2 (UGC): Báo cáo + Ẩn + Chặn người dùng (chặn của site) phải tới được từ MỌI bài/bình luận.
