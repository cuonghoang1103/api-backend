# CTW đợt 7b — Forms · Import · Kênh ngoài → đề xuất · Knowledge base (11/10/2026)

Mã: `src/routes/work.ctw7b.routes.ts` · `src/services/work/{forms,importer,intake,kb}.service.ts` · luật thuần
`{formRules,importParsers,intakeRules,kbRules}.ts` · migration `20261011090000_ctw7b_forms_intake_import_kb`.
Giao diện: `/work/<ws>/<KEY>/forms|intake|import|kb`, `/work/form/<token>`, tab **Help center** trong cổng khách.
Test: `npx tsx --test src/services/work/ctw7b.test.ts` · `WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw7b.db.test.ts`.

## Bất biến
- Kênh ngoài **không bao giờ tạo thẻ thẳng** — mọi tin thành `work_intake_proposals` (PENDING); người trong dự án bấm
  Nhận/Bỏ. Agent không duyệt (service + `AGENT_DENIED_ROUTES`).
- Sai chữ ký / lệch giờ > 5 phút / token kênh lạ ⇒ **cùng 401**. Gửi lại đúng gói cũ ⇒ **409** (nonce trong
  `work_intake_nonces`, cùng giao dịch với đề xuất).
- Bí mật (whsec_ của Resend, OA Secret Key của Zalo) mã hoá AES-256-GCM (`APP_ENCRYPTION_KEY` nếu có, không thì khoá dẫn
  xuất từ `JWT_SECRET`), AAD = token kênh; không bao giờ trả về client (chỉ bản che).
- Form công khai: trần IP ở route (`WORK_PUBLIC_SUBMIT_RPM`, mặc định 10/phút) + trần trong DB 5 lượt/10 phút/form/IP +
  honeypot `website` + gửi < 2 s ⇒ trả "đã nhận" mà không tạo gì. Form công khai cấm trường "người" (lộ danh sách thành viên).
- Import: mỗi mục "giữ chỗ" `work_import_records` (UNIQUE dự án + nguồn + loại + mã ngoài) trước khi tạo thẻ ⇒ nhập lại
  không trùng; thẻ đã xoá ⇒ nhập lại được. Người khớp theo **email**; Trello/Jira không xuất email ⇒ tên chỉ là gợi ý,
  sửa được ở bước xem trước; không khớp ⇒ để trống + ghi chú trong mô tả.
- KB: bài = trang Docs. Bài cho khách chỉ hiện khi trang ở chế độ **Client** + đã đăng; trang về Internal ⇒ bài tự ẩn.

## Cấu hình từng kênh (người dùng tự làm — không có khoá thật trong repo)

### Email → đề xuất (Resend Inbound)
1. Resend → Domains → thêm tên miền **nhận thư** riêng (khuyên dùng tên miền con, vd `inbound.cuongthai.com` để không
   đụng MX của hộp thư chính). Thêm bản ghi **MX** đúng như Resend hiển thị (giá trị + độ ưu tiên do Resend cấp) tại nhà
   cung cấp DNS (Cloudflare: DNS → Add record → MX, tắt proxy). Chờ Resend báo Verified.
2. Chọn một địa chỉ cho dự án trên tên miền đó, vd `requests-hd@inbound.cuongthai.com` (catch-all — không cần tạo hộp thư).
3. Resend → Webhooks → Add endpoint: URL = URL webhook hiện trên kênh
   (`https://cuongthai.com/api/v1/work/intake/email/<token>`), sự kiện `email.received`.
4. Chép **Signing secret** (`whsec_…`) vào kênh. Một webhook nhận thư của cả tên miền ⇒ kênh chỉ lấy thư gửi đúng địa
   chỉ của nó (to/cc), thư khác trả 200 `ignored`.
5. Webhook chỉ có siêu dữ liệu (không thân thư) ⇒ backend gọi `GET https://api.resend.com/emails/receiving/<id>` bằng
   `RESEND_API_KEY` (đã có trên VPS) để lấy thân; lỗi ⇒ đề xuất chỉ có tiêu đề. ⚠️ Đường dẫn API này theo tài liệu Resend
   Inbound lúc viết — **chưa thử với tài khoản thật**; nếu đề xuất email về mà thân trống, kiểm chỗ này trước.
6. nginx: `/api/v1/work/intake/**` đi chung khối `/api/` hiện có — không cần sửa nginx. `index.ts` gắn `express.raw` cho
   đường này (chữ ký tính trên thân gốc).

### Discord (`/ctwork new`)
1. discord.com/developers → New Application → Bot → mời bot vào server (scope `applications.commands`).
2. General Information → chép **Public Key** (64 hex) vào kênh.
3. Đặt **Interactions Endpoint URL** = URL webhook của kênh. Discord gửi PING khi lưu — backend trả PONG sau khi kiểm
   chữ ký Ed25519.
4. Đăng ký lệnh một lần (token bot ở máy người dùng, không đưa vào CT Work) — lệnh `curl` có sẵn trong trang Intake →
   Channels → "How to set it up".

### Zalo Official Account
- **Cần OA thật đã xác thực** (oa.zalo.me) — người dùng tự đăng ký; CT Work không tạo hộ.
- developers.zalo.me → tạo ứng dụng gắn OA → chép **App ID** + **OA Secret Key** vào kênh → Webhook URL = URL kênh, bật
  sự kiện `user_send_text`. Chữ ký: `X-ZEvent-Signature: mac=sha256(appId + body + timestamp + OASecretKey)`.
- Chỉ tin bắt đầu bằng tiền tố (mặc định `#task`) thành đề xuất. Chưa có OA ⇒ dùng "Send test" (giả lập) trong kênh.

## Biến môi trường (tuỳ chọn)
`WORK_PUBLIC_FORM_RPM` (60) · `WORK_PUBLIC_SUBMIT_RPM` (10) · `WORK_INTAKE_RPM` (120) · `APP_ENCRYPTION_KEY` (base64 32 byte).
