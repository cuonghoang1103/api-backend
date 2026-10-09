# Đề giao (Opus) — UX-D "LINK PREVIEW & THƯƠNG HIỆU" (ưu tiên CT Work) · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc trước:
- `CLAUDE.md`. Chú ý các mục: nginx cache, `NEXT_PUBLIC_*`, theme `theme-dark`, luật Suspense nuốt mã HTTP trong bộ nhớ.
- `docs/ctw-ke-hoach-tong.md`.
- `docs/ctw-ra-soat-giao-dien-09-10.md` (chuẩn giao diện).

**Vấn đề người dùng chụp ảnh gửi.** Họ gửi link mời `https://cuongthai.com/work/invite/<token>` qua Messenger. Ô xem trước lại hiện ảnh Open Graph CHUNG của cả site ("Portfolio · Academy · E-commerce · AI", tiêu đề "CuongThai — Portfolio, Academy & E-commerce with AI"). Người nhận tưởng link rác. Mọi trang đều dùng chung một ảnh OG.

**Luật cứng:**
- KHÔNG commit/push/deploy, KHÔNG git add/stash/checkout/reset. Ngoại lệ duy nhất: `git checkout -- frontend/tsconfig.json` sau `next build`.
- Migration viết tay, dải `20261010030000_*`. Schema chỉ THÊM, gom trong khối `// ── UX-D ──`.
- Hai agent khác đang chạy song song: đợt 4 (SRS/RTM/Report 7) và 5b K-1 (bình luận + voice). Tệp chung thì chèn tối thiểu và ghi lại trong báo cáo.
- Không đụng `src/services/llm/gateway.ts`.
- Ảnh mẫu tự dựng: SVG, canvas, hoặc `next/og` ImageResponse. KHÔNG lấy ảnh có bản quyền. Mọi văn bản OG theo ngôn ngữ trang; CT Work dùng tiếng Anh, kèm mô tả tiếng Việt ngắn nếu hợp.
- **Riêng tư:** OG của mọi trang cần đăng nhập (thẻ, tài liệu, board) KHÔNG được lộ tiêu đề hay nội dung. Chỉ hiện tên workspace và "Sign in to view".
- **Link mời:** chỉ hiện những gì một lời mời Slack/Notion vẫn hiện: tên workspace, tên dự án, tên và ảnh người mời, số thành viên. Token sai, hết hạn hoặc đã dùng hết lượt thì hiện ảnh "Invitation expired" trung tính, không lộ gì.

## Làm
1. **OG động cho CT Work**, dùng `generateMetadata` + `opengraph-image` của Next (hoặc `ImageResponse`):
   - `/work/invite/[token]`:
     - Ảnh 1200×630 "**{inviter}** invited you to join **{workspace} · {project}**" kèm logo CT Work, ảnh bìa/màu dự án, avatar người mời, số thành viên.
     - `og:title`: "Join {workspace} on CT Work".
     - `og:description`: "{inviter} invited you to collaborate on {project}. Sign in to accept."
     - Nếu cần thì thêm endpoint backend công khai, rút gọn: chỉ các trường trên, có rate-limit, không trả email.
   - Link công khai chỉ đọc của dự án: tên dự án, ảnh bìa, % tiến độ, sprint hiện tại — chỉ những gì link đó vốn đã cho xem.
   - Các trang `/work/**` cần đăng nhập: ảnh chung đẹp của CT Work, không lộ nội dung.
   - Trang cổng khách: thương hiệu của chính dự án đó (branding đã có sẵn).
2. **OG cho phần còn lại của web**, làm ở mức hợp lý, ưu tiên trang hay được chia sẻ:
   - Khoá học, bài học công khai, blog/tech-trends, `/projects/*`, nhạc/bài hát, trang hồ sơ người dùng công khai.
   - Mỗi loại một mẫu ảnh động đẹp, có tiêu đề thật của trang.
   - Giữ ảnh hiện tại làm mặc định cho trang chủ.
   - Kiểm `twitter:card = summary_large_image`, `og:site_name`, `og:locale`, canonical.
   - **Kiểm nginx:** cache và header của `/opengraph-image` (xem bảng bài học nginx trong CLAUDE.md). Ảnh OG cần `Cache-Control` hợp lý để Zalo/Facebook lấy được.
3. **Thương hiệu:** logo/biểu tượng "CT Work" (SVG), favicon và `apple-touch-icon` cho `/work`, tên hiển thị "CT Work by CuongThai". Đồng bộ với app desktop nếu dùng chung tài nguyên.
4. **Ảnh bìa dự án CT Work:**
   - **Thư viện ~24–30 ảnh bìa có sẵn** (SVG/WebP tự dựng, nhẹ), chia nhóm:
     - Professional: gradient, geometric, abstract.
     - Theme: Code, Testing, Data, AI, Design, Game, Study.
     - Cute: minh hoạ nhẹ.
     - School: SWT301 / SWR302 / SWP391 / Capstone.
   - Người dùng **tải ảnh bìa riêng lên** qua đường upload R2 có sẵn (sharp, chỉ PNG/JPEG/WebP), có chọn vị trí ảnh (focal point / kéo dọc).
   - Có **icon/emoji dự án**. `iconEmoji` và `avatarUrl` đã có trong model, kiểm lại trước khi thêm.
   - Ảnh bìa hiện ở: trang Projects (thẻ dự án), đầu trang dự án, ảnh OG link mời và link công khai, cổng khách, app desktop.
   - Cài ở Project settings → Details, có xem trước. Chỉ ADMIN dự án được đổi.
   - Mẫu dự án mới (template) tự gán ảnh bìa hợp chủ đề; người dùng đổi được.
5. **Trang `/work/invite/[token]`** (trang người nhận mở ra): chỉnh cho chuyên nghiệp — ảnh bìa, tên workspace/dự án, người mời, nút Accept rõ ràng, trạng thái hết hạn/đã dùng, hướng dẫn đăng ký/đăng nhập.

## Kiểm
- **Test:** unit + `WORK_DB_TEST=1` cho endpoint xem trước lời mời — token hợp lệ, hết hạn, sai; không lộ email; rate-limit. Thêm test vào `npm test` / `test:work-db`.
- **Type-check:** `npx tsc --noEmit`, `typecheck:seed`, frontend tsc, desktop typecheck.
- **Build:** `next build --no-lint` với distDir `.next-uxd` và `NODE_OPTIONS=--max-old-space-size=12288`. Sau đó `next start` thật và `curl` HTML của các trang để kiểm thẻ meta `og:*`; tải ảnh OG về và xem bằng Read để chắc ảnh đẹp, đúng chữ, không vỡ tiếng Việt.
- **Mô phỏng ô xem trước** Messenger/Zalo/Facebook/Discord. Lưu ảnh OG và ảnh chụp trang invite (sáng/tối, 1440 và 390) vào `scratchpad/uxd/`.
- **Quét rules-of-hooks** trên các tệp đã sửa. Chạy axe trên trang invite và Project settings — không được làm lùi kết quả 0 lỗi của UX-A.
- **Migration:** diff sạch.

## Báo lại
Báo ngắn bằng tiếng Việt, chỉ khi xong hết. Liệt kê:
- tệp đã sửa
- endpoint mới
- migration
- test
- ảnh
- những gì cần làm sau deploy, ví dụ xoá cache xem trước của Facebook bằng Sharing Debugger
- rủi ro
