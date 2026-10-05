# Đề giao (Opus): MÔ-ĐUN "RESOURCES" — thư viện link/tài nguyên của dự án CT Work (06/10/2026)

Chủ web hỏi: CT Work có chỗ **ghim link tài liệu, dự án, file, source** (GitHub nhóm, source tham khảo,
âm thanh, Mixamo…) để bấm là mở, **sắp xếp theo nhóm** (source ảnh, source code, link GitHub…) cho đỡ
phải bới tìm chưa? → **CHƯA** (chỉ có kết nối GitHub 1 repo/dự án cho webhook, đính kèm theo thẻ, Docs tự
gõ link, link công khai). Xây mô-đun mới.

Repo `/Users/admin/Downloads/api-backend`. Làm MỘT MÌNH, không tách agent con, **KHÔNG commit/push/deploy**.
Chỉ đụng tệp CT Work (`src/services/work/**`, `src/routes/work*.ts`, `frontend/src/app/work/**`,
`frontend/src/components/work/**`, `frontend/src/lib/work*`), phần model Work* trong
`prisma/schema.prisma` + migration MỚI chỉ-thêm viết tay (`prisma/migrations/<ts>_ctw_resources/`, áp
`npx prisma migrate deploy` — CLAUDE.md mục Prisma). UI tiếng Anh, chú thích tiếng Việt. Đọc cách các
mô-đun studio khác bật/tắt (`STUDIO_MODULES`, `requireModule`), quyền (`permissions.ts`), cách ly khách
(`clientPortalRouteAllowed`), audit, sự kiện socket `emitWorkEvent`.

## Chức năng
1. **Model**: `WorkResourceGroup` (projectId, name, icon/emoji, color, rank, isDefault) và `WorkResource`
   (projectId, groupId, title, url (http/https/mailto, ≤ 2000), description, tags[], kind tự nhận
   [github, gitlab, figma, gdrive, gdocs, youtube, notion, unity, freesound, mixamo, polyhaven, link…],
   faviconUrl, pinned, pinnedToSidebar, visibility TEAM|CLIENT, rank, createdById, lastOpenedAt,
   openCount, linkStatus OK|BROKEN|UNKNOWN + checkedAt, meta JSON (preview GitHub: stars, lastCommitAt,
   description, defaultBranch)). Liên kết thẻ: `WorkIssueWebLink` (issueId, resourceId? hoặc url+title
   trực tiếp) — "Web links" kiểu Jira trên chi tiết thẻ.
2. **Nhóm mặc định** khi bật mô-đun (sửa/xoá/đổi tên/kéo-thả được): Source code · Docs · Design ·
   Audio · 3D & Images · References · Environments (staging/prod) · Meetings & calendars.
3. **API** `/projects/:pid/resources` (+ groups): CRUD, sắp xếp (rank), ghim, mở (`POST …/:id/open` tăng
   đếm + trả url), nhập hàng loạt từ Markdown list / CSV (`title, url, group, tags`), tìm (bỏ dấu tiếng
   Việt — dùng `src/services/work/fold.ts` đã có), lọc nhóm/nhãn/kind. Web links trên thẻ: CRUD + "Save
   to Resources". Mô-đun `resources` thêm vào `STUDIO_MODULES`, **mặc định BẬT cho mọi loại dự án**.
4. **Quyền**: thành viên thêm/sửa của mình, admin dự án sửa tất; viewer chỉ đọc; khách chỉ thấy
   `visibility=CLIENT` qua cổng khách (`/portal/resources`), không thấy linkStatus/openCount.
5. **Xem trước GitHub**: url github.com/{owner}/{repo} ⇒ lấy metadata qua GitHub API công khai (không
   khoá, cache 6 giờ, timeout 5 s, lỗi thì bỏ qua) — tham khảo `github_repos` sẵn có của web nếu tái dùng
   được. Favicon: `https://www.google.com/s2/favicons?domain=…&sz=64` (chỉ lưu URL, không tải về).
6. **Kiểm link chết**: job hằng tuần (theo cron sẵn có của dự án; tắt được bằng env, mặc định bật
   `WORK_LINK_CHECK_ENABLED`), HEAD rồi GET, chặn SSRF (không gọi IP nội bộ/localhost — dùng guard SSRF
   sẵn có nếu có, không thì viết), giới hạn N link/lượt; đánh dấu BROKEN + thông báo người tạo.
7. **Giao diện**:
   - Trang `/work/[ws]/[key]/resources`: lưới thẻ theo nhóm (biểu tượng kind, favicon, tiêu đề, mô tả,
     nhãn, ghim ⭐), kéo-thả giữa nhóm, ô tìm, lọc, nút "Add link" (dán URL ⇒ tự điền tiêu đề từ thẻ
     `<title>`/OpenGraph qua backend — cùng chặn SSRF), "Import" (dán Markdown/CSV), chế độ danh sách gọn.
   - **Sidebar dự án**: mục "Resources" + các link `pinnedToSidebar` (mở tab mới, 1 cú bấm).
   - Chi tiết thẻ: khối "Web links" (thêm/xoá, chọn từ Resources).
   - Cổng khách: tab Resources (chỉ CLIENT).
   - Bảng lệnh ⌘K: tìm và mở resource.
   - Help center: thêm 1 bài song ngữ (theo `components/work/help/content.ts`).
8. Tuyến desktop app nếu cần (xem bài học "thêm trang dưới app/work ⇒ thêm tuyến desktop
   dinhTuyenWeb.ts") — kiểm `desktop/src/renderer/features/web/dinhTuyenWeb.ts`.

## Kiểm trước khi báo
tsc gốc + frontend sạch · test DB mới `src/routes/work.resources.db.test.ts` (CRUD, quyền khách/viewer,
nhập Markdown/CSV, tìm bỏ dấu, SSRF bị chặn, web link trên thẻ) + chạy lại toàn bộ `work.*.db.test.ts`
và `src/services/work/*.test.ts` · `migrate diff | grep -i work` rỗng · frontend build riêng
(`NEXT_DIST_DIR=.next-res`, xong `git checkout -- frontend/tsconfig.json`, xoá thư mục).

## Báo lại (ngắn)
Tệp, migration, endpoint, test & kết quả, ảnh chụp giao diện nếu dựng được (Next dev riêng cổng 3015,
backend phụ như memory hướng dẫn), cái gì chưa làm.
