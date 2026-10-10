# CT WORK — KẾ HOẠCH TỔNG NÂNG CẤP "CHUYÊN NGHIỆP, ĐỦ, KHÔNG SÓT" (chốt 09/10/2026)

**ĐỌC ĐẦU TIÊN** khi người dùng nói "làm CT Work tiếp".

Nguồn chi tiết từng mục (A1…D10, có bằng chứng trong mã): `docs/ctw-ra-soat-thieu-09-10.md`.

Người dùng chốt 09/10 sáng: **"làm xong hết CT work 100% đi rồi qua ielts sau"** — làm TRỌN mọi đợt (4, 5, 6, 7, 8, UX-A/B/C, rồi phần 'cuối cùng') TRƯỚC khi sang IELTS.

Người dùng dặn ngày 09/10:
> "cứ từ từ mà nâng cấp full chuyên nghiệp đầy đủ không thiếu cái gì"

CT Work là công cụ chính cho đồ án của họ và các nhóm (SEP490/ISP490/SWP391/SWT301/LabFlow). Họ được ưu tiên trước IELTS.

## Luật làm (rút từ các đợt trước)
- **Đối chiếu MẪU THẬT của trường** (`~/Documents/Report Đồ án/`, `SWP391/materials`), không chỉ so với Jira. Xem bộ nhớ `feedback_ctw_doi_chieu_mau_truong`.
- **Số agent:** tối đa 3 Opus cùng lúc.
  - Mỗi đợt có một tệp đề `docs/ctw-dot-N-*.md`.
  - Agent KHÔNG commit/deploy.
  - Migration viết tay, mỗi agent một dải timestamp riêng.
- **Trưởng nhóm (phiên chính)** kiểm lại trên **worktree sạch** dựng từ commit: tsc BE/seed/FE, `npm test`, DB test của đợt. Có làm thì mới bắt được tệp bị `.gitignore` loại (vd `bin/` ở đợt 2).
  - Sau đó commit bằng index riêng (`GIT_INDEX_FILE`) và đưa `main` tiến lên bằng `update-ref`.
  - Rồi `echo y | bash deploy-nha.sh`. Lệnh này tự push `main`.
  - Người dùng đã cho phép deploy CT Work theo từng đợt khi kiểm xanh (09/10: "cứ làm full rồi deploy đi hoặc deploy rồi làm tiếp").
- ⚠️ **`git checkout -- frontend/tsconfig.json` sau `next build` XOÁ cả sửa đổi THẬT của tệp đó** (09/10: mất dòng exclude `e2e/**` của 6a ⇒ build Docker frontend hỏng 'Cannot find module playwright'). Đề giao từ nay: chép lưu tsconfig TRƯỚC build rồi chép trả lại, không checkout. Trưởng nhóm kiểm frontend tsc trên worktree KHÔNG có node_modules gốc (giống Docker).
- ⚠️ **Agent KHÔNG được `pkill`/`killall` theo tên** (10/10: `pkill -f "cat" -n` của agent UX-B giết lượt deploy-nha giữa bước đẩy GHCR, exit 144). Chỉ giết theo CỔNG/PID của chính mình. Ghi luật này vào MỌI đề giao.
- **Sau deploy** phải kiểm production bằng phép đo thật (curl, gọi API bằng token agent), không tin log.
- **Thẻ trên dự án CTW:** AI bình luận cách sửa trên thẻ. Người dùng tự kéo thẻ sang Done; board CTW không có cột Review.
- **Giao diện và nội dung xuất:** tiếng Anh, theo theme `theme-dark`. Trang mới dưới `app/work` ⇒ thêm tuyến desktop `dinhTuyenWeb.ts`. Đổi giao diện desktop ⇒ `phat-hanh`.

## Trạng thái các đợt
| Đợt | Nội dung | Trạng thái |
|---|---|---|
| 0–8 cũ | Jira + Xray + AI + studio S1–S5c | ✅ prod (xem bộ nhớ `project_ct_work_kieu_jira`) |
| 1a | 10 lỗi CTW-7,9,10,14,15,17,18,20,27,38 | ✅ prod `89d91ba9` (09/10). Chờ người dùng kéo sang Done |
| 1b | Unit Test 5.1 + Integration 5.2 đúng mẫu FPT, xuất/nhập Excel | ✅ prod `89d91ba9` |
| 2 | AI agent GĐ1 A9–A15: MCP 21 tool, gói `packages/ctwork-mcp`, nginx, chi phí/năng suất, trang AI agents, People vs Agents, nút Assign to AI (CTW-34) | ✅ prod `8f179213` (09/10 02:29) — đã thử Claude Code THẬT qua HTTP: whoami/my_work/get_issue đúng |
| **3A** | Ảnh + Mermaid trong editor; xuất .docx/PDF; bộ mẫu FPT Report 1–7 (đề mục gốc); Record of Changes tự sinh; **mẫu dự án Capstone** | ✅ prod `1805b641` (09/10 04:34) |
| **3B** | System Test 5.3; Project Tracking (SEP490 + SWP391 Template1 + Template4 Issues); WBS + bảng độ phức tạp → man-day; Weekly Report .xlsx; AI Usage Report (Template0) | ✅ prod `1805b641` (09/10 04:34) |
| **3C** | **Không phụ thuộc Claude** (chi tiết ngay dưới) | ✅ prod `1805b641` — MCP 52 tool, agent BUILTIN gpt-6-sol |
| 4 | SRS có cấu trúc: use case/actor/business rule/screen authorization; RTM mở rộng (SRS/SDS/commit); defect log thống nhất + Severity; Q&A log; Activity trên worklog; ghép Report 7; CTW-12 (spec review chọn khung theo loại trang) | |
| **4b** | **SWR302 P0** (rà soát `docs/ctw-ra-soat-swr-swt-hop-09-10.md`, mã R/T/K): SWR-1 "Hồ sơ Wiegers" (R25 mẫu V&S/UC/BR/SRS/Data Dictionary, R4 Vision&Scope tự điền, R5 sổ feature FE-n, R6 phân loại yêu cầu + thuộc tính + vòng đời, R27) · SWR-2 "Dữ liệu & sáu liên kết" (R16 Glossary + Data Dictionary, R12 bảng ưu tiên Wiegers xuất xlsx, R23 kiểm sáu liên kết người chấm dò) | sau đợt 4 |
| **5b** | **Cộng tác & họp (người dùng hỏi 09/10)**: K-1 bình luận đầy đủ + **voice note** (trả lời theo luồng, đính kèm tệp trong bình luận; dùng lại `useGhiAm.ts` + STT Groq `/ai/stt`) · K-2 **họp ghi âm → phiên âm → AI biên bản**, điểm danh/RSVP, agenda (R2 + chia đoạn, hỏi đồng ý ghi âm, hạn lưu; cần purpose LLM mới; kiểm `GROQ_API_KEY` trên prod) · K-3 **kênh chat dự án** (socket `work:project:<id>`) + **đồng soạn thảo** (chép khuôn Hocuspocus+Yjs của Notes — kéo C9 từ đợt 8 lên) | K-1 có thể làm sớm |
| 5 | Supervisor hub (giảng viên xem mọi nhóm, rubric); đóng góp + đánh giá chéo; LOC thật từ GitHub/GitLab, defect density; luồng lớp học/mã lớp, nhập danh sách MSSV; việc định kỳ; tuyến desktop + phát hành app | |
| 6 | (+ RV review/inspection & baseline R18–R22/T2/T13; TST-1 quản lý test chuyên sâu T1,T5–T9,T12; 6b: SWR-3 SRS chuyên sâu, SWR-4 elicitation & stakeholder) Chất lượng: CI chạy đủ 48 tệp test work + Postgres + `WORK_DB_TEST=1` (cả trong bộ kiểm của `deploy-nha.sh`); E2E Playwright commit + axe; đo hiệu năng 10k thẻ; **vá 3 rò rỉ cổng khách (D8)**; kỹ thuật thiết kế test EP/BVA/bảng quyết định; Test Summary Report; rủi ro nhập ZIP (D9) | Nên làm sớm nếu 3–4 sửa nhiều tệp chung |
| **UX** | **Giao diện chuẩn doanh nghiệp (người dùng dặn 09/10, cả web + app desktop)**: rà TOÀN BỘ trang /work bằng ảnh chụp (sáng/tối, 1440px/1024px/390px, app desktop) → chấm theo tiêu chí Linear/Jira/Atlassian Design (mật độ thông tin, phân cấp chữ, khoảng cách, màu trạng thái nhất quán, trống/đang tải/lỗi, phím tắt, focus). Nâng chỗ yếu: dashboard dự án + workspace (KPI tiles, burndown/burnup, CFD, velocity, phân bổ tải, sức khoẻ sprint, rủi ro), biểu đồ chuẩn (một thư viện, tooltip, xuất PNG), bảng số liệu (dính tiêu đề, sắp xếp, cột tuỳ chọn), trang tổng quan "Portfolio" cho trưởng nhóm/giảng viên. **KHÔNG 3D/hiệu ứng trang trí** — công cụ doanh nghiệp cần rõ ràng, nhanh, tập trung; 3D chỉ khi nó giúp HIỂU dữ liệu (thường không). Chỗ nào đã ổn thì giữ, ghi rõ "đã ổn" trong báo cáo rà soát. Làm SAU đợt 3C, TRƯỚC đợt 4 nếu rà thấy lỗi nặng; còn lại gộp dần vào từng đợt (mỗi tính năng mới phải đạt chuẩn này ngay khi làm). **Rà xong 09/10: `docs/ctw-ra-soat-giao-dien-09-10.md` (3,8/5, 270 ảnh)** ⇒ 3 gói: **UX-A** (P0: header dự án vỡ ở 1180px app desktop, số 'open' lệch Projects/Portfolio/Dashboard, tương phản AA token --w-green/yellow/orange; + thống nhất KPI tile, sidebar, Getting started, ARIA) — TRƯỚC đợt 4; **UX-B** (ChartFrame Recharts + xuất PNG/CSV, CFD/cycle/throughput, dashboard Project overview mặc định); **UX-C** (DataTable chung, làm lại WBS, tổng quan giảng viên/trưởng nhóm, Timeline, Issue detail) | sau đợt 3 deploy |
| 7 | (+ TST-2 công cụ & tự động B10,T3,T4,T10,T11,B11) Bù công cụ thương mại: baseline, OKR, CFD/cycle time, planning poker, retro board, timer, forms, import Trello/Asana/xlsx, ép 2FA, knowledge base, Zalo/Discord/email→thẻ (CTW-26), asset/license register (CTW-21), widget, automation thêm | |
| 8 | (+ K-4 di động cộng tác K20,R9,R17,R29) Nền tảng: giao diện tiếng Việt, mobile/iOS đủ màn + push, đồng soạn thảo (yjs), whiteboard, offline, vai trò tuỳ biến, RACI, UAT cho giảng viên | |
| **CUỐI CÙNG** | Ý tưởng người dùng (09/10), để sau cùng theo lời dặn: điều phối nhiều agent / **agent trưởng nhóm** chia việc cho agent khác (bản nhẹ: agent "lead" tạo thẻ con + giao agent khác, qua người duyệt); CTW-35 bàn giao người↔agent có "context pack"; CTW-36 điều phối đa agent đầy đủ | |

## Đợt 3C — "Dùng được khi KHÔNG có Claude"
Người dùng hỏi ngày 09/10: "không phải lúc nào tôi cũng phụ thuộc vào bạn được". Ba việc:

1. **Bộ lệnh dùng chung (một registry) cho cả MCP lẫn "Ask AI" có sẵn trên web.** Lệnh nào AI ngoài làm qua MCP thì Ask AI làm được, và ngược lại. Ghi vẫn đi qua bước ĐỀ XUẤT → Áp dụng (Ask AI) hoặc rào chắn agent (MCP). Mở rộng các lệnh:
   - **Kiểm thử:** đọc/tạo hàm và UTCID 5.1, bước 5.2, vòng 5.3, ghi kết quả; test case/run kiểu Xray.
   - **Docs:** viết nháp trang, sửa mục, qua người duyệt.
   - **Xuất tệp:** lấy link Excel/Word/PDF.
   - **Sprint/họp/rủi ro/RTM:** biên bản họp → thẻ, cập nhật RAID, báo cáo tuần.
2. **Agent BUILTIN** chạy trên máy chủ bằng khoá LLM của web (cổng modelapi, `gateway.ts`).
   - Hiện máy chủ trả lời "Built-in agents arrive in phase 2" (`agents.service.ts:129`). Phần này mở khoá đó.
   - "Assign to AI" giao cho nó ⇒ nó tự làm (viết test case, nháp SRS…) rồi chuyển sang Review.
   - **Trần chi phí riêng** cho agent này, hiện số tiền trên trang AI agents.
   - Tôn trọng `budget.ts` và quota. Không dùng feature `bulk_gen|news`, vì `LLM_BACKGROUND_ENABLED=false` sẽ chặn im lặng.
3. **Tài liệu MCP mở cho AI khác:** Cursor, Gemini CLI, Codex CLI, Claude Desktop. Có trang hướng dẫn trong `/work/developer`, thử ít nhất một client không phải Claude.
   - KHÔNG tự làm MCP cho Google Calendar/Gmail/Drive (Claude đã có connector; lịch CT Work đã có link `.ics`).
   - KHÔNG làm MCP để chỉnh tệp Excel (CT Work tự xuất đúng mẫu).

## Việc người dùng phải tự làm (nhắc khi cần)
- Kéo 10 thẻ đợt 1a sang Done (board CTW).
- Reopen timesheet tuần 05/10 ở dự án Flying Pencil (Finance), vì cần quyền tài chính của người.
- Xác nhận license MIT và scope `@cuongthai` trước khi publish `ctwork-mcp` lên npm.
- Gửi thêm mẫu tài liệu của thầy cô (nếu có) vào `~/Downloads`.

## Nợ kỹ thuật toàn repo (chốt 09/10 — người dùng giao Claude tự quyết, ưu tiên KHÔNG làm hỏng thứ đang chạy)
Nguồn: Gemini đánh giá repo; Claude đã đo lại (schema 13.537 dòng/459 model, api.ts 6.080, index.ts 958 + 103 `await import`, deploy-nha.sh 1.321).
1. **LÀM NGAY sau lượt deploy kế:** `deploy-nha.sh` — bộ kiểm CI trước push phải chạy trên worktree SẠCH của đúng SHA đã deploy (09/10 nó chạy trên cây làm việc có đồ dở ⇒ báo hỏng giả, không push); thêm `test:work-db` (bỏ qua có cảnh báo nếu không có Postgres local). Sửa nhỏ, có test, không viết lại.
2. **Khi nâng Prisma 6 (≥6.6, multi-file GA):** chia `schema.prisma` theo miền (work/course/auth/…) — lợi ích chính là bớt xung đột khi nhiều agent cùng sửa, KHÔNG phải tốc độ generate.
3. **Làm dần:** tách `frontend/src/lib/api.ts` theo miền mỗi khi đụng tới miền đó.
4. **KHÔNG làm lúc này:** tách microservice (1 VPS 6GB, chưa đo thấy tải) · viết lại deploy-nha.sh sang Node (đường deploy duy nhất, rủi ro cao). P3006 giữ cách hiện tại (migration tay + `migrate diff`).

## LabFlow Demo (SWT) + bổ sung kế hoạch đồ án thật (09/10)
- Project LFD (workspace SWT301) dựng y theo kế hoạch đồ án LabFlow AI (labflow-v2.json), repo private `cuonghoang1103/LabFlow-AI-demo`, trưởng nhóm = token admin người dùng (C1), agent Cường 1–4 = C2–C5. Code ĐÚNG, không cài lỗi. Lệch kế hoạch ⇒ Change Request.
- Người dùng cho phép BỔ SUNG kế hoạch đồ án THẬT (project LF, workspace LabFlow Studio): gom chỗ thiếu vào `~/Documents/My_Project/LabFlow-SWT-Demo-private/PLAN-GAPS.md`; SAU mốc Lab 2 áp vào LF theo kiểu CHỈ THÊM (thẻ/Docs/bình luận gắn nhãn "[Bổ sung]"), không xoá/đổi thẻ hay tiến độ của người dùng; đồ án code vẫn do người dùng tự gõ tay.

## Sơ đồ đẹp (09/10)
- Plugin Claude Code `diagram-design` đã cài (xem bộ nhớ reference_diagram_design_plugin). Việc treo: thư viện mẫu sơ đồ (kiến trúc/ERD/sequence/state/swimlane/Gantt/journey…) cho **AI Code + AI Chat app desktop** (system prompt + công cụ chọn mẫu) và cho **Docs CT Work** (chèn mẫu, xuất SVG/PNG, tương thích Mermaid hiện có). Làm sau khi xong đợt K-3/Đóng góp/i18n.

## Trạng thái 09/10 tối (ghi để phiên sau làm tiếp)
- ✅ prod: đợt 1, 2, 3/3C, UX-A, 6a, 4, 5b K-1, UX-D, UX-E, sửa logo/ảnh bìa/emoji (55c7e1a7). App desktop v0.5.172.
- ✅ xong cục bộ, CHỜ deploy chung: **K-3 kênh chat dự án** (thông báo, âm báo, tắt tiếng 30'/1h/8h…, gọi nhóm Jitsi/Meet).
- 🔄 đang làm: **Đóng góp & hiệu suất thành viên** (chỉ số/kỳ/heatmap/radar/peer review/xuất PDF), **i18n GĐ1** (nút Tiếng Việt/English theo người dùng; GĐ2 = docs/chat/reports/IssueDetail/WorkSidebar sau khi K-3/Đóng góp xong), **Diagram Studio + AI vẽ sơ đồ** (Mermaid/Excalidraw/nhập draw.io, mẫu editorial từ diagram-design, AI sinh sequence từ UC spec, ERD/class từ repo GitHub, chèn Report 3/4, RTM "UC chưa có sequence").
- ⏭ còn lại theo thứ tự: i18n GĐ2 → 4b SWR302 → 5 (giảng viên hub, lớp học/mã lớp, việc định kỳ) → 5b K-2 (ghi âm họp→biên bản AI, điểm danh) + K-3b đồng soạn thảo → UX-B/UX-C → 6/6b → 7 → 8 → mang thư viện sơ đồ vào AI Code/AI Chat app → CUỐI CÙNG (điều phối đa agent). Sửa deploy-nha.sh (CI kiểm trên worktree sạch của SHA đã deploy) làm xen khi rảnh.
- Người dùng chốt 09/10: "note lại toàn bộ rồi nâng cấp + làm full dần dần, nhớ hoạt động được và tốt" ⇒ mỗi đợt: kiểm worktree sạch (cả kiểu Docker không node_modules gốc) → deploy → THỬ THẬT trên prod → phát hành app nếu đổi giao diện → mới báo xong.

## Cập nhật 09/10 đêm
- ✅ prod c92d580d: K-3 chat dự án, Đóng góp & hiệu suất, i18n GĐ1.
- 🚀 đang deploy 47e91938: **Diagram Studio + AI vẽ sơ đồ** (mục "Sơ đồ đẹp" ở trên coi như xong phần CT Work; phần AI Code/AI Chat app vẫn treo) + **bộ nhận diện CT Work "Flow Check"** (logo/favicon/logo động/BRAND.md).
- Sau deploy: phát hành app desktop (gồm chat/i18n/đóng góp/diagram/logo) — v0.5.173 lần trước bị chặn vì desktop/ bẩn.
- Việc nhỏ treo: purpose LLM `work_diagram` trong gateway.ts (tách model/chi phí, hiện dùng work_assistant); `GITHUB_API_TOKEN` trên VPS để ERD/Class đọc repo PRIVATE; thử lưu bảng vẽ Excalidraw qua giao diện; rác thử R2 `work/3616/chat/*` (dọn khi user đồng ý); axe best-practice "main lồng nhau" (.app-main ⊃ #work-main) — kiểm có từ trước không.
- ✅ 09/10 20:3x: prod 47e91938 (Diagram Studio + logo) đã thử thật (use case LFD, sequence UC-01 0 giả định, favicon/manifest 200); app desktop **v0.5.173** phát hành đủ mac arm64/x64 + Windows + Linux + latest*.yml. Hai sơ đồ thử `[TEST Claude]` D-1/D-2 để lại trong LFD. Tiếp theo khi user quay lại: nhận phản hồi test → i18n GĐ2 → 4b SWR302 → ...

## Trạng thái 10/10 sáng (06:10)
- ✅ prod 121fc963 + app v0.5.176: thêm từ lần trước — 4b SWR302 Wiegers, đợt 5 hub giảng viên/lớp học/rubric/định kỳ, i18n GĐ2, UX-B biểu đồ/dashboard, K-2 họp ghi âm→biên bản AI (Groq thật đã chạy trên prod), K-3b đồng soạn thảo, sửa 6 lỗi P2 QA. Báo cáo QA: `docs/ctw-qa-10-10.md` (18/18 local, 15/18 prod — 8/11/17 cần đăng nhập trình duyệt).
- ⏭ còn lại: UX-C (DataTable chung, WBS làm lại, tổng quan nhóm, Timeline, Issue detail) → 6 (RV review/inspection & baseline, TST-1 test chuyên sâu, hiệu năng 10k thẻ) → 6b (SRS chuyên sâu, elicitation) → 7 (OKR, planning poker, retro, forms, import Trello/xlsx, ép 2FA, KB, Zalo/email→thẻ, TST-2) → 8 (iOS, offline, vai trò tuỳ biến, whiteboard) → thư viện sơ đồ cho AI Code/AI Chat app → CUỐI: điều phối đa agent.
- Treo: K-2 chưa làm RSVP qua cổng khách, hàng chờ đoạn ghi qua IndexedDB, mẫu agenda theo loại họp, RRULE họp; Diagram Mermaid chưa lưu PNG để xuất API; purpose LLM riêng work_diagram/work_minutes; GITHUB_API_TOKEN VPS; chú giải "how" trang Đóng góp chưa dịch; **chờ user đồng ý dọn ảnh thử trên R2** (work/branding/p45xx, w21xx, dự án thử 449x–450x, work/3616/chat).

- 10/10 06:3x: ĐÃ DỌN rác R2 (98 tệp thử: work/<id≥2400>/*, branding p4500/p4505/w2172/w2176); giữ work/2,3,5,6 + branding p5/w5. Nguyên nhân gốc: backend local + DB test dùng chung `.env` ⇒ ghi R2 THẬT — đưa vào đợt 6: test/local dùng R2 giả (MinIO hoặc prefix `test/` + chặn ghi bucket thật khi WORK_DB_TEST=1).
- Người dùng dặn 10/10: **iOS làm SAU CÙNG** (sau cả thư viện sơ đồ AI Code/Chat và điều phối đa agent).

## Đợt 8 — Kết nối ngoài (chốt 11/10/2026, đã hướng dẫn user đăng ký app)
- Redirect URI CỐ ĐỊNH (mã phải khớp đúng từng ký tự):
  - Microsoft: `https://cuongthai.com/api/v1/work/integrations/microsoft/callback`
  - Google:    `https://cuongthai.com/api/v1/work/integrations/google/callback`
  - Notion:    `https://cuongthai.com/api/v1/work/integrations/notion/callback`
  - Local dev: thay gốc bằng `http://localhost:4000` (đăng ký thêm cùng đường).
- Env (VPS `/opt/cuonghoangdev/.env`): `CTW_MS_CLIENT_ID`, `CTW_MS_CLIENT_SECRET`, `CTW_GOOGLE_CLIENT_ID`,
  `CTW_GOOGLE_CLIENT_SECRET`, `CTW_NOTION_CLIENT_ID`, `CTW_NOTION_CLIENT_SECRET`. Thiếu ⇒ nút kết nối ẩn + ghi chú, không lỗi.
- Phạm vi: MS Graph delegated `openid profile email offline_access User.Read Calendars.ReadWrite OnlineMeetings.ReadWrite Files.ReadWrite`;
  Google `openid email profile calendar.events drive.file spreadsheets` (drive.file để tránh scope restricted); Notion public integration.
- Google app ở chế độ Testing ⇒ tối đa 100 test user, phải thêm email; lên Production cần Google xác minh (calendar.events là sensitive).
- Tài khoản trường (FPT, tenant Entra) có thể chặn người dùng tự cấp quyền app chưa xác minh nhà phát hành ⇒ tài khoản Outlook cá nhân chắc chắn chạy.
