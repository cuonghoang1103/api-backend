# Đề giao: NÂNG CẤP CT WORK theo lần dùng thật đầu tiên (06/10/2026)

CT Work (`/work`) vừa được dùng thật lần đầu cho dự án Flying Pencil (workspace
`flying-pencil-studio`). Mọi phát hiện nằm ở dự án **CTW** (26 thẻ) — đọc bằng API:
`GET https://cuongthai.com/api/v1/work/projects/<CTW id>/issues` (đăng nhập bot `fp_claude`, xem
`/Users/admin/Documents/FlyingPencil/.ctwork/lib.mjs` + `state.json` — `state.ctwp.id`). Đọc đủ mô tả
từng thẻ trước khi làm. KHÔNG in mật khẩu/token.

Repo `/Users/admin/Downloads/api-backend`. Làm MỘT MÌNH, không tách agent con, **KHÔNG commit/push/
deploy** (trưởng nhóm review rồi commit). Nhiều phiên khác cùng sửa repo: chỉ đụng tệp CT Work
(`src/services/work/**`, `src/routes/work*.ts`, `frontend/src/app/work/**`,
`frontend/src/components/work/**`, `frontend/src/lib/work*`), + migration MỚI chỉ-thêm trong
`prisma/migrations/<timestamp>_<ten>/` (viết SQL tay, áp bằng `npx prisma migrate deploy` — xem
CLAUDE.md mục Prisma) + đúng phần model Work* trong `prisma/schema.prisma`. Giao diện CT Work bằng
TIẾNG ANH (quy ước đã chốt), chú thích mã tiếng Việt.

## Làm (theo thứ tự ưu tiên)
1. **CTW-1 (P1)** Khách duyệt cổng/phê duyệt phải thấy mô tả + bằng chứng (đính kèm đã chia sẻ khách,
   thẻ thuộc giai đoạn, tiêu chí) trên cổng khách.
2. **CTW-3** Báo cáo tuần cho khách mặc định TẮT; bật lần đầu phải xem trước + xác nhận.
3. **CTW-4** Docs nhập được Markdown (API + nút "Import Markdown"/dán markdown); trường lạ báo lỗi rõ.
4. **CTW-5** JQL hỗ trợ `fixVersion` (=, in, is EMPTY) + gợi ý.
5. **CTW-6** Tìm kiếm (toàn cục + JQL text ~) không phân biệt dấu tiếng Việt.
6. **CTW-23** Dự án có `avatarUrl` (tải ảnh lên — dùng đường upload R2 sẵn có của CT Work/attachments),
   `iconEmoji`, `color`; hiện ở sidebar, danh sách dự án, header, portfolio, cổng khách. Workspace có logo.
7. **CTW-24 bậc 1** Họp: nút "Create meeting link" (sinh link Jitsi `https://meet.jit.si/ctwork-<ngẫu
   nhiên>` không cần khoá) + chấp nhận dán Google Meet/Zoom/Teams; nút "Join" nổi bật ở trang họp, ở
   cổng khách và trong lời mời .ics. (Bậc 2–3 KHÔNG làm đợt này.)
8. **CTW-25** Nút "Add to Google Calendar" / "Outlook" (deep link) cho họp + hạn thẻ + mốc giai đoạn.
9. Còn thời gian: CTW-11 (cờ Blocked), CTW-13 (cảnh báo gửi duyệt cổng khi còn việc mở), CTW-8/14
   (chữ AI/sinh tự động theo ngôn ngữ người dùng), CTW-19 (tạo ticket desk trả ticket).

## Kiểm trước khi báo
- `npx tsc --noEmit` (gốc) · `(cd frontend && npx tsc --noEmit)` sạch ở tệp bạn đụng.
- Test DB CT Work liên quan: xem `src/routes/work.*.db.test.ts` (cách chạy ở đầu tệp) — thêm test cho
  từng sửa đổi backend; chạy và báo kết quả.
- `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel
  prisma/schema.prisma --script | grep -i work` rỗng sau khi áp migration.
- Frontend build RIÊNG: `NODE_OPTIONS=--max-old-space-size=8192 NEXT_DIST_DIR=.next-ctw npm run build`
  trong frontend, xong `git checkout -- frontend/tsconfig.json` và xoá `.next-ctw`.

## Báo lại (tiếng Việt, ngắn)
Thẻ CTW nào xong (kèm tệp đã sửa), migration nào, test nào chạy & kết quả, cái gì chưa làm.
