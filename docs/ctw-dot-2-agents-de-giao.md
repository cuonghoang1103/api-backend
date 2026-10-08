# Đề giao (Opus) — CT WORK ĐỢT 2: AI AGENT GĐ1 PHẦN CÒN LẠI (A9–A15) · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`. Thiết kế ĐÃ DUYỆT: `docs/ct-work-ai-agents-thiet-ke.md` (đọc trọn, đặc biệt §9 bảng A9–A15 dòng ~799–808,
thứ tự bắt buộc). A1–A8 (backend lõi) đã lên production (287326e8) + đợt 1a/1b (89d91ba9). Đọc `CLAUDE.md`. **KHÔNG commit/push/deploy.** Nhiều
phiên khác cùng repo — chỉ đụng tệp cần; không git add/stash/checkout. Migration (nếu cần) viết tay chỉ-thêm.

Hai agent chia việc (đề này dùng chung — làm đúng phần được giao trong prompt):
- **Phần BE (A9 → A10 → A11 → A12)**: MCP server + tool đọc/ghi, gói `packages/ctwork-mcp` (stdio⇄HTTP, README, publish dry-run — KHÔNG publish thật),
  nginx `location /api/v1/work/mcp` (buffering off, timeout 300 — chỉ sửa `nginx/nginx.conf`, theo bài học bind-mount trong CLAUDE.md) + smoke-test
  `deploy.sh`, chi phí/năng suất backend (report_usage, reports/agents, dashboard, job agentTimesheet, finance bỏ qua agent).
- **Phần FE (A13 → A14 → A15)**: WorkUser.kind + 🤖 avatar, AssigneePicker hai nhóm, lọc People/Agents, chip lease, JQL assigneeKind; trang
  `/work/[ws]/agents` + `/agents/[id]` (tạo agent, token MỘT LẦN + lệnh `claude mcp add …`, pause/retire, convert, webhooks, inbox), tab Agents trong
  Project settings, khối Agent trên IssueDetail; báo cáo People vs Agents, chi phí trên thẻ; CLAUDE.md mục "Agent trong CT Work". Trang mới dưới app/work ⇒
  THÊM tuyến app desktop (`desktop/src/renderer/features/web/dinhTuyenWeb.ts` — xem bộ nhớ feedback_trang_work_moi_can_tuyen_app_desktop).
  Nếu cần API BE chưa có (của A12) thì dựng FE theo hợp đồng trong thiết kế + ghi rõ; phối hợp qua báo cáo.
- Thêm (nếu còn sức, sau A15, chỉ FE+BE nhỏ): **CTW-34 nút "Giao cho AI"** trên thẻ (chọn agent của workspace ⇒ gán + đưa vào hàng đợi lease) và **CTW-35 bàn
  giao người↔agent** (trường handoff note + trạng thái) — theo thiết kế GĐ2 nếu có trong tài liệu; nếu thiết kế chưa đủ thì đề xuất ngắn trong báo cáo, không làm.
## Kiểm
Test mới (unit + `WORK_DB_TEST=1`) cho mọi tool MCP/endpoint; rào chắn agent (A1–A8) không được nới — chạy lại `work.agents.db.test.ts` + toàn bộ test work;
`npx tsc --noEmit`, `typecheck:seed`, frontend tsc (+ build ở thư mục riêng `.next-<ten>` rồi khôi phục `frontend/tsconfig.json` nếu Next ghi đè), desktop
typecheck 2 config. Thử MCP thật: chạy `packages/ctwork-mcp` cục bộ trỏ server dev, gọi vài tool bằng token agent thử (KHÔNG in token). Ảnh chụp FE vào scratchpad.
Báo lại ngắn: tệp, endpoint/tool, test, ảnh, rủi ro.
