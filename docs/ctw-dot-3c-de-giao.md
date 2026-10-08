# Đề giao (Opus) — CT WORK ĐỢT 3C "DÙNG ĐƯỢC KHI KHÔNG CÓ CLAUDE" · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`.

**Đọc trước:**
- `CLAUDE.md`, đặc biệt mục Cổng LLM, `budget.ts`, và mục "Agent trong CT Work".
- `docs/ctw-ke-hoach-tong.md` (mục Đợt 3C).
- `docs/ct-work-ai-agents-thiet-ke.md`, phần GĐ2 BUILTIN nếu có.
- `docs/ctw-dot-2-hop-dong-api.md`.
- Mã:
  - `src/mcp/**`: MCP đợt 2, 21 tool.
  - `src/services/work/ai.service.ts`, `aiDocs.ts`, `aiThreads.service.ts`: trợ lý "Ask AI" trên web, ghi qua ĐỀ XUẤT → Áp dụng.
  - `src/services/work/agents.service.ts`: đang chặn `runtime === 'BUILTIN'` ở khoảng dòng 129.
  - `fptTests*.ts` (5.1/5.2, có 5.3 từ đợt 3B) và `fptReports*.ts` (3B).

**Luật cứng:**
- KHÔNG commit/push/deploy, KHÔNG git add/stash/checkout/reset. Ngoại lệ duy nhất: `git checkout -- frontend/tsconfig.json` sau khi `next build` ghi đè nó.
- Migration viết tay, dải `20261009160000_*`. Chỉ THÊM vào `schema.prisma`, gom trong khối `// ── CTW đợt 3C ──`.
- Agent đợt 3A đang chạy song song: editor ảnh/Mermaid, xuất docx/PDF, mẫu Report, mẫu Capstone. Không đụng tệp của nó. Lệnh "xuất Word/PDF" thì dựa vào hàm của 3A nếu đã có; chưa có thì để TODO rõ ràng trong báo cáo.
- KHÔNG nới rào chắn agent A1–A8, và `work.agents.db.test.ts` phải xanh.
- Không in token/khoá.

## Làm
1. **Registry lệnh dùng chung** (vd `src/services/work/toolRegistry/`): mỗi lệnh khai MỘT lần (tên, mô tả, schema zod, quyền, đọc/ghi, hàm chạy). Từ đó:
   - MCP (`src/mcp/tools/*`) sinh danh sách tool. Giữ nguyên tên và hành vi 21 tool cũ; test MCP cũ phải xanh.
   - "Ask AI" trên web dùng chung bộ lệnh. Lệnh GHI vẫn ra ĐỀ XUẤT để người bấm Áp dụng, không ghi thẳng.
2. **Thêm lệnh**, có trên cả hai đường:
   - **Kiểm thử:**
     - 5.1: liệt kê/tạo hàm, thêm UTCID, đặt "O", ghi kết quả.
     - 5.2 và 5.3: thêm bước/vòng, ghi kết quả.
     - Test case/run kiểu Xray đang có.
     - Lệnh "gợi ý test cho hàm" dùng lại phần gợi ý biên của 1b.
   - **Docs:** tạo nháp trang, sửa một mục. Dùng lại `applyDraftPage`/`applyUpdateSection`, qua người duyệt.
   - **Xuất:** trả link tải Excel 5.1/5.2/5.3, Project Tracking, Weekly, AI Usage, WBS; Word/PDF nếu 3A đã có.
   - **Sprint/họp/rủi ro:** đọc sprint hiện tại, biên bản họp → đề xuất thẻ, thêm/cập nhật RAID, sinh báo cáo tuần (3B Weekly).
3. **Agent BUILTIN**: tạo được agent `runtime: BUILTIN` trên trang AI agents.
   - Khi một thẻ được "Assign to AI" cho nó: một job nền trên máy chủ gọi LLM qua `gateway.ts`, chạy vòng lặp gọi lệnh bằng chính registry trên với quyền của agent (lease, rào chắn như agent ngoài). Làm xong thì `request_review` hoặc chuyển sang Review, kèm bình luận tóm tắt.
   - Chọn `purpose` mới trong `PURPOSE_MODEL`, mặc định model rẻ mà gọi tool tốt. Đọc bảng đo trong CLAUDE.md; KHÔNG dùng Grok. Đổi được bằng env `LLM_MODEL_<VIỆC>`.
   - **Trần chi phí riêng** theo agent/ngày/workspace, có mặc định an toàn, đặt được trên giao diện. Ghi chi phí vào hệ báo cáo chi phí agent của đợt 2.
   - Tôn trọng `budget.ts` và quota. Feature KHÔNG được là `bulk_gen|news`: chúng bị `LLM_BACKGROUND_ENABLED=false` chặn im lặng.
   - Giới hạn số vòng gọi lệnh và thời gian. Lỗi thì trả thẻ, ghi lý do lên thẻ, không thử lại vô hạn.
   - Giao diện:
     - Tạo agent BUILTIN.
     - Trạng thái "đang chạy" trên thẻ: dùng chip lease có sẵn.
     - Nút dừng.
     - Số tiền đã dùng.
   - Chỉ Pro hoặc admin được dùng, theo luật AI hiện có của CT Work; tài khoản thường thì hiện nút nâng cấp.
4. **MCP cho AI khác:** trang `/work/developer` có hướng dẫn cắm Cursor, Claude Desktop, Gemini CLI, Codex CLI (cấu hình mẫu cho từng cái, dùng gói `packages/ctwork-mcp` hoặc HTTP trực tiếp).
   - Kiểm ít nhất một client không phải Claude nếu máy có sẵn. Không có thì kiểm bằng cầu stdio, và ghi rõ là chưa thử client thật.

## Kiểm
- Test unit + `WORK_DB_TEST=1` cho registry, từng lệnh mới, Ask AI đề xuất/áp dụng, và vòng lặp BUILTIN. Dùng LLM giả như `_setAskForTests`; không gọi LLM thật trong test.
- Thêm test mới vào `npm test`.
- Chạy lại `work.mcp.db.test.ts`, `work.agents.db.test.ts`, `work.agentsUi.db.test.ts`, và toàn bộ test work.
- `npx tsc --noEmit`, `typecheck:seed`, frontend tsc, desktop typecheck.
- `next build` với distDir `.next-ctw3c` và `NODE_OPTIONS=--max-old-space-size=12288`.
- Migration diff sạch.
- Một lượt thử BUILTIN với LLM THẬT trên máy local, qua cổng của web và khoá trong `.env` cục bộ (nếu có): giao một thẻ "viết test case 5.1 cho hàm X". Ghi chi phí thật. Không có khoá thì ghi rõ.
- Ảnh chụp vào `scratchpad/ctw3c/`, giao diện sáng và tối, đạt chuẩn giao diện doanh nghiệp trong kế hoạch tổng (mục UX).
- Báo lại ngắn bằng tiếng Việt, chỉ khi xong hết: tệp, lệnh, migration, test, chi phí đo được, ảnh, rủi ro.
