# Đề giao (Fable 5.1): THIẾT KẾ "CT WORK CHO ĐỘI NGƯỜI + AI AGENT" (06/10/2026)

Chủ web muốn CT Work (`/work`, công cụ quản lý dự án kiểu Jira tự xây) dùng hiệu quả cho mọi kiểu
đội: toàn người, toàn AI agent, hoặc trộn — xu hướng đang nghiêng về đội agent. Nhiệm vụ của bạn:
**viết bản thiết kế kỹ thuật**, KHÔNG viết mã. Làm một mình, không tách agent con, không sửa tệp nào
ngoài tệp kết quả.

## Đọc trước
- Epic CTW-28 + story CTW-29…36 (mô tả ở cuối đề) và các phát hiện CTW-2, CTW-22.
- Bằng chứng thực tế: dự án FP đang chạy đúng mô hình "trưởng nhóm agent + 4 agent thành viên" bằng
  tài khoản bot giả người + script (`/Users/admin/Documents/FlyingPencil/.ctwork/nhip.mjs`, `lib.mjs`
  — đọc để thấy chỗ đau; KHÔNG chạy, KHÔNG đọc `tai-khoan.json`).
- Mã CT Work: `prisma/schema.prisma` (model Work*, User), `src/services/work/` (permissions.ts,
  apiTokens.service.ts, automation, events.ts, ai.service.ts, aiThreads, handoffs, approvals,
  finance), `src/routes/work*.ts`, `src/socket/work.socket.ts`, cổng LLM `src/services/llm/gateway.ts`.
- CLAUDE.md của repo (quy ước: migration viết tay chỉ-thêm, UI CT Work tiếng Anh, chi phí LLM có trần).

## Viết `docs/ct-work-ai-agents-thiet-ke.md` gồm
1. Mô hình khái niệm: Thành viên = HUMAN | AGENT; agent có người chịu trách nhiệm, mô hình, vai trò,
   phạm vi; vòng đời; khác biệt trải nghiệm người/agent.
2. Mô hình dữ liệu cụ thể (model Prisma mới/trường mới, chỉ-thêm), di trú từ tài khoản bot hiện có
   (fp_*) sang agent thật mà không mất lịch sử.
3. Xác thực & quyền: token agent (dùng lại/ mở rộng WorkApiToken), ma trận quyền mặc định agent
   (cấm duyệt cổng/phê duyệt, gửi khách, tài chính…), "Done của agent ⇒ In Review", audit "thay mặt".
4. Giao diện tích hợp agent: **MCP server** (danh sách tool, tham số, kết quả, xử lý lỗi; chạy ở đâu —
   gói npx gọi API token, hay endpoint streamable HTTP trên backend), webhook/SSE + claim/heartbeat.
5. Chi phí & năng suất: mô hình ghi token/$, báo cáo, timesheet agent tự sinh, dashboard Người vs Agent.
6. GĐ2 "Giao cho AI" (agent dựng sẵn qua cổng LLM, chạy nền, trần chi phí) và GĐ3 điều phối đa agent.
7. Giao diện người dùng: chỗ nào hiện gì (huy hiệu, bộ lọc người/agent, trang quản lý agent).
8. Bảo mật & rủi ro (prompt injection qua nội dung thẻ, lộ token, agent chạy vòng lặp tốn tiền…).
9. Kế hoạch triển khai chia nhỏ thành việc ≤ 1 ngày cho GĐ1, thứ tự, test cần có, tiêu chí xong.
Viết tiếng Việt, cụ thể tới mức một lập trình viên Opus làm theo được mà không phải đoán.

## Story (tóm tắt)
- CTW-29 Thành viên AGENT hạng nhất · CTW-30 Token agent + rào chắn · CTW-31 MCP server ·
  CTW-32 Hàng đợi + webhook/SSE · CTW-33 Chi phí & năng suất · CTW-34 Nút "Giao cho AI" ·
  CTW-35 Bàn giao người↔agent + năng lực song song · CTW-36 Điều phối đa agent.

## Báo lại (ngắn)
Đường dẫn tài liệu + 5 quyết định thiết kế quan trọng nhất + danh sách việc GĐ1.
