# Đề giao (Opus): CT WORK CHO ĐỘI NGƯỜI + AI AGENT — GĐ1 phần BACKEND LÕI (A1–A8) · 06/10/2026

Thiết kế ĐÃ DUYỆT: `docs/ct-work-ai-agents-thiet-ke.md` (đọc trọn, đặc biệt §2, §3, §4.4–4.5, §8, §9).
Làm đúng các việc **A1 → A8** trong §9 theo thứ tự. A9+ (MCP, FE, báo cáo) làm ở đợt sau — KHÔNG làm.

Repo `/Users/admin/Downloads/api-backend`. Làm MỘT MÌNH, không tách agent con, **KHÔNG commit/push/deploy**.
Chỉ đụng: `src/services/work/**`, `src/routes/work*.ts`, `src/socket/work.socket.ts`, `src/middleware/auth.ts`
(chỉ phần cần cho token agent/kind), `src/services/auth.service.ts` (chặn đăng nhập agent), phần model liên
quan trong `prisma/schema.prisma` + migration MỚI chỉ-thêm viết tay (CLAUDE.md mục Prisma), test.

## Yêu cầu sửa của trưởng nhóm khi duyệt (BẮT BUỘC)
Thiết kế để tuyến MỚI mặc định MỞ cho agent (chỉ chặn bằng `AGENT_DENIED_ROUTES`) — dễ sót. Ngoài danh sách
tuyến, **chặn ở TẦNG HÀNH ĐỘNG (fail-closed)**: các hàm service duyệt/quyết định (approvals decide, gate
request/decide, CR approval, timesheet approve/reopen), tài chính (mọi ghi), gửi/chia sẻ cho khách (client
report send/schedule, share client-visible, portal), xoá dự án/workspace, cấu hình dự án/quyền/thành viên —
phải tự kiểm actor là AGENT và ném 403 `WORK_AGENT_FORBIDDEN` dù được gọi từ tuyến nào. Test bảng phủ CẢ hai
tầng (tuyến + hàm service gọi trực tiếp).

## Di trú bot thật
Sau khi xong + test xanh, VIẾT (không chạy trên prod) script `scripts/ctw-agents-chuyen-bot.mjs` để chuyển 5 bot
`fp_*` (id 151–155, workspace `flying-pencil-studio`) thành agent qua endpoint convert, người chịu trách nhiệm =
chủ workspace hiện tại. Chạy thử trên DB local với dữ liệu giả.

## Kiểm trước khi báo
tsc gốc sạch · `npm run typecheck:seed` · test mới (DB + thuần) + chạy lại toàn bộ `WORK_DB_TEST=1 npx tsx --test
src/routes/work.*.db.test.ts` và `src/services/work/*.test.ts` · `migrate diff | grep -i work` rỗng · nếu đổi
`User` thì `npx prisma db seed` local chạy được (CLAUDE.md).

## Báo lại (ngắn)
Việc A1–A8 xong/chưa, migration, endpoint mới, bảng test rào chắn, script di trú, chỗ lệch thiết kế + lý do.
