# CT Work — Kiểm thử toàn diện 10/10/2026 (các đợt 89d91ba9 … 58a9bd9f)

Người làm: agent QA (phiên đêm 10/10). Không sửa mã, không commit/push/deploy. Bằng chứng nằm trong `scratchpad/qa/`:
`L-*.png` là ảnh local, `P-*.png` là ảnh production, `e2e/` là ảnh của bộ E2E. Kết quả máy đọc nằm trong `local-results.json`, `prod-results*.json` và `e2e-*.log`.

## Tóm tắt

- **Local: 18/18 mục chạy được thật.** Bộ `qa-local.ts` lượt cuối cho 40/41 bước xanh. Bước còn lại là kiểm sai của chính script: khách nhận `chat/channels` 200 nhưng danh sách rỗng, không lộ gì. Có 2 cảnh báo:
  - phiên âm local không chạy vì máy không có `GROQ_API_KEY`;
  - không tồn tại endpoint "link-preview" riêng; UX-D là OG.

  Toàn bộ `npm run test:work-db` xanh: **45/45 tệp**.
- **Production: 15 mục ✅, 3 mục ➖** (mục 8, 11 cần đăng nhập trình duyệt; mục 17 chỉ kiểm được một phần). 29/29 bước API xanh, tính cả lượt chạy lại hai bước bị lỗi script.
  - Groq phiên âm thật đúng từng câu.
  - Biên bản AI trả 201.
  - MCP qua nginx chạy.
  - Mọi bản ghi thử ở LFD đã dọn.
- **Không có lỗi P0/P1.** Có 6 lỗi P2 (giao diện/nợ test/biên) — xem cuối tệp.

## Môi trường

| | Local | Production |
|---|---|---|
| Mã | cây làm việc `main` = 58a9bd9f | 58a9bd9f (deploy-nha báo `XONG` 04:24:02, đã so mã băm ảnh) |
| Stack | backend `:3301` (`CRON_DISABLED=0`, `RATE_LIMIT_MAX=1e6`, **SMTP/Resend để trống** ⇒ không gửi email thật) · `next build --no-lint` → `.next-qa` · `next start :3302` sau một proxy nhỏ `:3300` (`scratchpad/qa/mini-nginx.mjs`, đóng vai nginx: `/socket.io` → backend) · Postgres `:5434` | `https://cuongthai.com`, token cá nhân `~/.ctwork-lab2.token` (không in ra) |
| Vai | owner (Pro), member ×2, viewer, teacher, client cổng khách, agent EXTERNAL, agent BUILTIN — tạo mới mỗi lượt, xoá theo id khi xong | chỉ người dùng chủ token; ghi thử chỉ ở LFD (id 7) |

## Bảng 18 mục

✅ đạt · ⚠️ đạt nhưng có điểm cần xem · ❌ hỏng · ➖ không kiểm được ở môi trường này

| # | Mục | Local | Prod | Bằng chứng / ghi chú |
|---|---|---|---|---|
| 1 | 5.1/5.2/5.3 xuất/nhập Excel | ✅ | ✅ | **Local:** tạo hàm `Login` + ma trận UTCID. Tệp xuất có 5 sheet: Guideline, Cover, Functions, Statistics, login. Nhập lại tệp đó (dryRun rồi append) cho số hàm 1→2. 5.2 và 5.3 đều xuất được .xlsx. **Prod:** GET doc/unit/integration/system ở Lab2, Lab3, LFD đều 200. Xuất LFD: unit 64 KB · integration 13 KB · system 6 KB. Ảnh: `L-01-tests.png`, `L-unit-export.xlsx` |
| 2 | MCP + AI agents + BUILTIN | ✅ | ✅ | **Local:** token agent EXTERNAL được 102 tool. `whoami`, `my_work`, `get_issue` chạy. Không token ⇒ 401. Agent BUILTIN do owner Pro tạo chạy lượt đến `DONE`, LLM thật, 0,035 $; `builtin-budget` có trần 10 $/ngày và 2 $/lượt. **Prod:** MCP qua nginx: `ctwork@1.0.0`, 97 tool cho token người, `get_issue LFD-1` đúng, không token ⇒ 401. LFD có 4 agent EXTERNAL; dashboard, builtin-budget và reports/agents đều 200. Không chạy BUILTIN trên prod (tốn tiền, ngoài danh sách ghi được phép). Ảnh: `L-02-agents.png`, `L-02-builtin-run-issue.png` |
| 3 | Mẫu FPT Report 1–7 + docx/pdf | ✅ | ✅ | **Local:** đủ 7 mẫu `fpt-report1…7`. Tạo Report 2 rồi autofill 200. Xuất .docx 13 KB và .pdf 32 KB đúng định dạng. Record of changes 200. **Prod:** doc-templates và fpt-reports/doc 200 ở 3 dự án. Xuất docx/pdf trang `[QA]` ở LFD 200 |
| 4 | Capstone + Tracking/WBS/Weekly/AI Usage | ✅ | ✅ | **Local:** mẫu CAPSTONE bật đủ stages/approvals/docs/raid/meetings/resources và gieo 8 thẻ. Project Tracking xuất SEP490, SWP391_T1, ISSUES. WBS đặt Screen/9 trường/2 giao dịch ⇒ Medium, 5 ngày. Weekly và AI Usage xuất .xlsx. Kéo thẻ sang Done trên board chạy (`e2e/qa-drag-after.png`). **Prod:** cả 5 tệp xuất ở LFD đều 200 xlsx (SEP490 79 KB, WBS 35 KB…) |
| 5 | Ảnh + Mermaid trong editor | ✅ | ✅ | **Local:** khối Mermaid vẽ ra SVG. Chèn ảnh qua editor hiện được và đã lưu. Xuất từ giao diện: docx có `word/media`, PDF có 2 ảnh — Mermaid thành ảnh (`L-05-docs-mermaid-image.png`, spec `e2e-patched/mermaid-docx.spec.ts`). **Prod:** tạo trang `[QA]` có Mermaid, xuất docx/pdf 200, rồi xoá và dọn thùng rác. Ghi chú thiết kế: xuất qua API/MCP (GET `export.docx`) in **mã nguồn** Mermaid vì máy chủ không có trình duyệt; chỉ xuất từ giao diện mới có ảnh |
| 6 | Bình luận theo luồng, voice note, tệp | ✅ | ✅ (đọc) | **Local:** trả lời gắn đúng `parentId` gốc. Tải tệp txt và voice m4a (201). Bình luận mang 2 tệp, viewer đọc thấy. **Prod:** GET comments 200; `comment-voice` đã gắn (400 khi không có body). Không ghi bình luận vì ngoài danh sách ghi được phép. Groq của prod chạy, xem mục 16. Ảnh `L-06-issue-comments.png` |
| 7 | Link preview/OG, email mời, ảnh bìa, logo | ✅ | ✅ | **Local:** bìa preset + tải lên (thu về jpg), logo workspace, avatar dự án đều 201 (lưu lên R2). Link mời: `og:title "Join … on CT Work"`, ảnh OG 200 PNG, thẻ công khai không có email (`L-07-invite-og.png`). Mời email mới ⇒ 201, SMTP đã tắt nên không gửi. **Prod:** favicon/manifest/icon CT Work riêng (`/images/ct-work/*`, `work.webmanifest`) đều 200. Mời sai token ⇒ `Invitation unavailable`, ảnh "Invitation expired" có `Cache-Control: public, max-age=600` (`P-07-invite-invalid-og.png`, `P-invite-invalid.png`). Bot Facebook mở trang Docs riêng tư chỉ thấy `og:title "SWT301"` + "Sign in to view", không lộ nội dung |
| 8 | Đọc rộng UX-E | ✅ | ➖ | **Local, 1180px:** vùng đọc rộng 650 → ẩn cây trang 882 → Focus 1162 px (`L-08-docs-1180-*.png`). VIEWER mở 16 trang /work, không trang nào lỗi (`L-scan-viewer-*.png`). **Prod** cần đăng nhập trình duyệt — không làm theo luật |
| 9 | Kênh chat + thông báo + tắt tiếng | ✅ | ✅ | **Local:** hai người, tin tới bên kia sau **78 ms** qua socket. Ảnh hiện bên kia. Huy hiệu chưa đọc "2" khi đang ở board. Tắt tiếng kênh 1h/off, prefs 30m/off, menu UI có. VIEWER gửi ⇒ 403. Khách thấy 0 kênh, đọc tin kênh nội bộ ⇒ 404. Ảnh: `L-09-chat-realtime-B.png`, `L-09-chat-badge-B-board.png`, `L-09-chat-owner-image.png`, `L-11-vi-chat.png`. **Prod:** gửi tin `[QA]` vào LFD #general, đọc lại, rồi xoá (201/200/200). unread/prefs 200. socket.io bắt tay được |
| 10 | Đóng góp + đánh giá chéo | ✅ | ✅ | **Local:** summary, chi tiết người, xuất xlsx và pdf. Tạo vòng peer review: m1 chấm m2 ⇒ 200, tự chấm ⇒ `WORK_PEER_SELF` (`L-10-contrib.png`). **Prod:** summary/rounds 200 ở 3 dự án; LFD xuất xlsx 11 KB, pdf 15 KB |
| 11 | i18n vi/en | ⚠️ | ➖ | **Local:** nút đổi ngôn ngữ hoạt động, thanh bên EN ⇒ VI. Các trang board/backlog/docs/chat/meetings/reports/tests/diagrams/wiegers ở VI không lỗi (`L-11-vi-*.png`). Hộp chọn ngôn ngữ lần đầu hiện đúng. Còn **chuỗi lai** ở trang Báo cáo, xem P2-3. **Prod:** cần trình duyệt; `/users/me/preferences` không nhận token API (401, đúng thiết kế) |
| 12 | Diagram Studio + AI vẽ sơ đồ | ⚠️ | ✅ | **Local:** tạo tay (Mermaid) 201. AI USE_CASE 201, cú pháp hợp lệ, có thanh "AI đề xuất → Nhận/Bỏ". Nhưng dự án chưa có use case nên sơ đồ **rỗng** — xem P2-4 (`L-12-diagram-open.png`). **Prod:** AI USE_CASE ở LFD ra D-3 với 1.780 ký tự, 17 cạnh (`P-12-diagram-ai.mmd`); đổi tên `[QA]` rồi xoá |
| 13 | SWR302 Wiegers | ✅ | ✅ | **Local:** dự án SWR302: FE-1, seed bảng ưu tiên, glossary, data dictionary, sáu liên kết (4/6 đạt, chỉ đúng chỗ đứt), điền V&S, xuất docx + `priority.xlsx` (`L-13-wiegers.png`). **Prod:** swr/features/six-links 200 ở 3 dự án; LFD xuất priority.xlsx và V&S docx 200 |
| 14 | Hub giảng viên + lớp + rubric + định kỳ | ✅ | ✅ | **Local:** giảng viên tạo lớp SWP391. SV vào bằng **mã lớp** và tạo nhóm (sinh dự án nhóm). overview + overview.xlsx 200. Rubric `SWP391_ITERATION` ⇒ chấm ⇒ **công bố** ⇒ SV thấy điểm (0→1). Việc định kỳ: preview ra RRULE + các ngày tới; tạo 201; MEMBER tạo ⇒ 403. Bộ chạy hằng giờ (`cron 20 * * * *`) do test DB ctw5 phủ (`L-14-teaching-hub.png`, `L-14-classes.png`). **Prod:** grades/recurring/week1 200 ở 3 dự án; `teaching/access` = false với tài khoản này |
| 15 | UX-B biểu đồ / dashboard | ✅ | ✅ | **Local:** cfd, cycle-time, throughput, aging-wip, load-by-person, kpis 200. release-burnup cần `versionId` (400 khi thiếu là đúng). Tạo dashboard Project overview 201. ChartFrame xuất được **PNG** 88 KB và **CSV** (tiêu đề cột VI) (`L-15-chart-export.png`, `L-15-reports-flow.png`). **Prod:** 6 báo cáo 200 ở 3 dự án; LFD có 1 dashboard |
| 16 | K-2 họp: RSVP/điểm danh/ghi âm/phiên âm/biên bản AI | ✅ | ✅ | **Local:** agenda, RSVP YES/NO kèm ghi chú, join, điểm danh, báo cáo chuyên cần (viewer) đều 200. **Ghi âm LIVE bằng mic giả của Chrome** (`--use-file-for-fake-audio-capture`): hỏi đồng ý ⇒ bắt đầu ⇒ REC 0:12 ⇒ dừng ⇒ 1 đoạn audio, tải lại được. Tải tệp m4a qua giao diện ⇒ ENDED. Thiếu khoá ⇒ banner "chưa cấu hình chép lời" đúng. minutes-ai ⇒ `WORK_NO_TRANSCRIPT` đúng. Xuất biên bản docx 200 (`L-16-live-*.png`, `L-16-meeting-recording-live.png`). **Prod (Groq thật):** họp `[QA]` ở LFD, không mời ai, tải WAV 10 s ⇒ phiên âm 2 dòng có mốc giờ, **đúng nguyên văn** (`P-16-transcript.json`). Biên bản AI 201 (tóm tắt + quyết định + việc cần làm, `P-16-minutes-ai.json`); export docx 200; xoá audio 200; xoá họp 200 |
| 17 | K-3b đồng soạn thảo | ✅ | ⚠️ một phần | **Local:** spec gốc `docs-collab.spec.ts` xanh: 2 tài khoản cùng gõ, con trỏ có tên, ngắt mạng rồi nối lại tự đồng bộ, bình luận gắn đoạn, autofill khi người kia đang mở. axe sáng/tối: **0** lỗi serious/critical. Bước riêng của QA: đồng bộ dưới 15 s (`L-17-collab-owner-sees-m1.png`, `e2e/k3b-0*.png`). **Prod:** `wss://cuongthai.com/notes-collaboration/work-docs` nâng cấp 101. GET collab 200; token API bị từ chối đúng thiết kế ("needs a browser session"). Chưa thử 2 trình duyệt thật vì cần đăng nhập |
| 18 | Bảo mật cổng khách 6a | ✅ | ✅ | **Local:** spec gốc `portal.spec.ts` xanh. Bước riêng của QA, khách gọi 16 tuyến nội bộ: issue nội bộ/comments/swr ⇒ 404; contrib/meetings room/transcript/diagrams/fpt/grades/kpis/recurring/agents/tracking ⇒ 403; chat ⇒ danh sách rỗng. URL board thẳng không lộ thẻ nội bộ (`L-18-portal-client.png`, `L-18-client-tries-board.png`). **Prod:** không token hoặc token sai ⇒ 401 ở 7 tuyến mới (chat/contrib/meetings/diagrams/portal/swr/teaching) |

## Bộ E2E có sẵn (`frontend/e2e/work/*.spec.ts`)

| Spec | Kết quả | Ghi chú |
|---|---|---|
| auth | ✅ | |
| docs-collab (K-3b) | ✅ | axe 0 serious/critical |
| portal | ✅ | |
| capstone-board | ❌ → ✅ khi sửa bản chép | Spec cũ, xem P2-1 |
| docs-image-docx | ❌ → ✅ khi sửa bản chép | Spec cũ, xem P2-1 |
| fpt-unit | ❌ → ✅ khi sửa bản chép | Spec cũ, xem P2-1 |

Bản chép đã sửa nằm ở `scratchpad/qa/e2e-patched/`. Không sửa spec gốc.

## Danh sách lỗi

### P0 — không có
### P1 — không có

### P2

**P2-1 · Ba spec E2E đã cũ, không còn chạy xanh (nợ test, không phải lỗi sản phẩm)**
- **Tái hiện:** `E2E_BASE_URL=… npm run test:e2e:work`.
- **Mong đợi:** 7/7 xanh.
- **Thực tế:** 4/7.
  - (a) Hộp thoại chọn ngôn ngữ lần đầu (i18n GĐ1, `FirstRunLanguagePrompt`) phủ lên trang (`fixed inset-0 z-[70]`) và chặn click. Spec viết trước GĐ1 nên không đóng hộp này.
  - (b) `capstone-board`: mẫu Capstone nay gieo sẵn 16 thẻ To Do, nên thẻ mới nằm ngoài khung nhìn. Lệnh kéo bắt đầu ngoài màn hình và chỉ bôi đen chữ (`e2e/cap-board-after.png`).
  - (c) Chạy song song thì `tag` theo mili-giây có thể trùng, gây 409 "workspace URL is taken".
- **Cách sửa gợi ý:**
  - thêm `page.addLocatorHandler(dialog button[lang=en])` vào `helpers.userSession`;
  - gọi `card.scrollIntoViewIfNeeded()` trước khi kéo;
  - thêm số ngẫu nhiên vào `tag`.

  Đã thử cả ba trong `scratchpad/qa/e2e-patched/`: xanh.

**P2-2 · Xoá tài khoản giảng viên đã có điểm chấm ⇒ lỗi khoá ngoại**
- **Tái hiện:** giảng viên tạo rubric, chấm cho một nhóm, rồi admin xoá user đó (`DELETE` ở `admin.routes.ts:742` gọi `prisma.user.delete`).
- **Mong đợi:** xoá được, hoặc báo lỗi rõ ràng.
- **Thực tế:** `P2003 work_grades_rubric_id_fkey`. `WorkRubric.owner` để `onDelete: Cascade`, còn `WorkGrade.rubric` để `onDelete: Restrict`. Gặp thật khi dọn dữ liệu QA (`local-run3.log`).
- **Ảnh hưởng:** hiếm (chỉ admin xoá giảng viên), nhưng sẽ ra 500.

**P2-3 · i18n: còn chuỗi lai Việt–Anh ở Báo cáo › Sức khoẻ › "Khối lượng việc"**
- **Thực tế:** dòng phụ "Tính việc in progress or due in the next 14 days · còn 10 ngày làm việc" (`L-11-vi-reports.png`).
- **Mong đợi:** toàn bộ tiếng Việt.

**P2-4 · AI vẽ USE_CASE khi dự án chưa có use case ra sơ đồ rỗng**
- **Thực tế:** chỉ có khung SYSTEM, không có actor hay use case, vẫn gắn nhãn "AI đề xuất / Nhận" (`L-12-diagram-open.png`).
- **Mong đợi:** báo "chưa có use case/actor trong SRS — thêm ở Requirements" thay vì tạo sơ đồ trống.

**P2-5 · `/api/auth/admin-check` bị gọi lặp, mỗi lần 403**
- **Thực tế:** người không phải admin mở 18 trang /work thì có 72 lượt gọi, mỗi trang vài lượt. Không lỗi chức năng, nhưng tốn request và làm bẩn console.

**P2-6 · Xuất Docs qua API/MCP không vẽ Mermaid (giới hạn thiết kế)**
- **Thực tế:** `GET …/pages/:num/export.docx` in mã nguồn sơ đồ kèm chú thích. Chỉ nút xuất trên giao diện (client gửi PNG) mới có ảnh.
- **Ảnh hưởng:** agent/MCP lấy link Word sẽ ra sơ đồ dạng code. Nên ghi rõ trong tài liệu MCP.

### Không phải lỗi (đã kiểm lại)
- Chat realtime "không tới" ở lượt đầu: `next start` không chuyển tiếp `/socket.io`. Qua proxy giống nginx thì tin tới sau 78 ms. Prod đã có `location /socket.io/`.
- `og:title "Invitation unavailable"` với link mời hợp lệ ở local: Next thiếu `API_INTERNAL_URL`. Đặt đúng thì ra "Join … on CT Work".
- Tạo trang Docs ở dự án BLANK ⇒ 403 `MODULE_DISABLED`: đúng thiết kế.
- `release-burnup` 400 khi thiếu `versionId`: đúng.
- Khách nhận `chat/channels` 200 nhưng danh sách rỗng: không lộ.

## Dọn dẹp
- **Prod, chỉ LFD:**
  - trang Docs `[QA]` #8: xoá + purge thùng rác;
  - tin chat #general id 3: xoá;
  - sơ đồ D-3: xoá;
  - họp `[QA]` #5 và #6: xoá audio, xoá họp.

  Bản nháp biên bản AI #1 thuộc họp #6, đã xoá cùng họp. Không đụng Lab2/Lab3. Không tạo tài khoản, không gửi lời mời/email trên prod.
- **Local:**
  - mọi user/workspace/lớp/rubric/điểm QA đã xoá theo id (20 user, 4 workspace, 3 lớp, 3 rubric, 3 điểm còn sót do P2-2 — `scratchpad/qa/cleanup-run1.ts`);
  - đã tắt cổng 3300/3301/3302 theo PID;
  - đã xoá `.next-qa`; `frontend/tsconfig.json` được chép trả, không đổi.
- ⚠️ **Rác R2 (bucket thật, do backend local dùng chung `.env`):**
  - ảnh bìa/logo/avatar `work/branding/p45xx/*`, `work/branding/w21xx/*`;
  - ảnh Docs, tệp/voice bình luận, ảnh chat của các dự án thử 449x–450x.

  Audio họp đã xoá qua API. Các phần còn lại chưa có đường xoá theo id từ phía QA — cần người dùng đồng ý trước khi dọn (cùng loại với rác `work/3616/chat/*` đã ghi trong kế hoạch tổng).

## Cách chạy lại
```bash
# local (sau khi dựng stack như mục Môi trường)
E2E_BASE_URL=http://localhost:3300 E2E_BYPASS_CSP=1 npx tsx scratchpad/qa/qa-local.ts
E2E_BASE_URL=http://localhost:3300 E2E_BYPASS_CSP=1 npx tsx --test --test-concurrency=1 scratchpad/qa/e2e-patched/*.spec.ts
# prod (chỉ đọc + ghi [QA] ở LFD rồi dọn)
npx tsx scratchpad/qa/qa-prod.ts            # ONLY=2,16 để chạy riêng vài mục
npx tsx scratchpad/qa/qa-prod-public.ts     # ảnh trang công khai
```
