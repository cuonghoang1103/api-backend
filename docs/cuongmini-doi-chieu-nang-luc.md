# AI Code — đối chiếu năng lực 3 nơi (desktop · CuongMini CLI · extension VS Code) và so với Claude Code

Soát 18/10/2026 (đợt 2). Ba nơi chạy **cùng một bộ máy**: lõi `packages/cuongmini-core` bundle thẳng
`desktop/src/main/agent/**` (`esbuildLoi.mjs`), chỉ thay vài module "vỏ app" (`ipcThay`, `authThay`, `cuaSoThay`,
`aiCucBoThay`, `trinhDuyetThay`, `boVeSoDoThay`). Bộ tool do máy chủ khai (`src/services/agent/tools.ts`), app khai
`capabilities` ở `desktop/src/main/agent/loop.ts:999-1057` — **giống hệt nhau ở cả ba nơi**. Vì vậy chỗ lệch gần như
chỉ nằm ở **giao diện** (sự kiện nào được vẽ, lệnh `/` nào có, bảng nào có).

Ký hiệu: ✅ có · ⚠️ có nhưng thiếu/khác · ❌ không có · **LỆCH** = ba nơi không như nhau.

## 1. Bảng đối chiếu

| Năng lực (Claude Code tương ứng) | Desktop | CLI | Extension | Ghi chú (file:dòng) |
|---|---|---|---|---|
| Đọc/tìm/sửa file, diff duyệt (Read/Grep/Glob/Edit/Write) | ✅ | ✅ | ✅ | tools.ts (server) `list_dir…sua_nhieu_cho`; thực thi `desktop/src/main/agent/tools.ts` |
| Chạy lệnh + lệnh nền + terminal PTY (Bash, run_in_background) | ✅ | ✅ | ✅ | `run_command` tools.ts:475, `chay_lenh_nen` :632, `terminal_mo` :727 |
| Quyền quản trị (sudo có hộp mật khẩu) | ✅ | ✅ | ✅ | `quyen_cao` tools.ts:503, `desktop/src/main/agent/quyenCao.ts` |
| Notebook `.ipynb` (NotebookEdit) | ✅ | ✅ | ✅ | `sua_o_notebook` tools.ts:416, `desktop/src/main/agent/notebook.ts` |
| Kế hoạch/todo (TodoWrite) | ✅ | ✅ | ✅ | `cap_nhat_ke_hoach`; sự kiện `keHoach` |
| Bộ nhớ dài hạn (memory) | ✅ | ✅ | ✅ | `nho_bai_hoc` tools.ts:676, `boNho.ts`; lệnh `/memory` cả ba |
| Hooks (PreToolUse/PostToolUse/Stop) | ✅ | ✅ | ✅ | `desktop/src/main/agent/hook.ts` (cấu hình ở userData); `/hooks` cả ba |
| MCP server ngoài | ✅ | ✅ | ✅ | `mcp.ts`, `mcpKetNoi.ts`; `/mcp` cả ba |
| Kỹ năng (Skills) — dự án + cài sẵn | ✅ | ✅ | ✅ | `kyNang.ts`, kho máy chủ `src/services/agent/kyNangSan/*.md` (25 kỹ năng sau đợt 2); `/kynang` cả ba |
| Agent phụ CHỈ ĐỌC (Task/Explore) | ✅ | ✅ | ⚠️→✅ | **LỆCH đã sửa đợt 2**: extension trước bỏ qua `phuBatDau/phuSuKien/phuXong` (`webview/main.ts:413` cũ) — nay vẽ khối riêng `xuLyPhu` main.ts:419. CLI có bảng `/tasks` (`viecPhu.ts`) |
| Agent phụ GHI được (general-purpose sửa file) | ❌ | ❌ | ❌ | `giao_viec_phu` tools.ts:591 "CHỈ ĐỌC… tối đa 10 bước"; `laPhu` ép ở turn.ts:954-961 — thiết kế mục 3.1 |
| Định nghĩa agent phụ của dự án (`.claude/agents`) | ✅ | ✅ | ✅ | `agentPhu.ts` |
| Tìm web (WebSearch) | ⚠️→✅ | ⚠️→✅ | ⚠️→✅ | **đợt 2**: `tim_web` trước CHỈ có Tavily (prod chưa có khoá ⇒ luôn "chưa cấu hình"); server tool `web_search` chỉ cổng chính hãng + admin bật. Nay mọi cổng: SearXNG → Tavily → Claude chính hãng (`timWeb.ts`) |
| Đọc web (WebFetch) | ✅ | ✅ | ✅ | `doc_web` (máy chủ, chặn SSRF) + `web_mo/web_doc` (trình duyệt) |
| Trình duyệt điều khiển được | ✅ (nhúng) | ⚠️ | ⚠️ | CLI/ext lái Chrome/Edge thật qua puppeteer-core (`trinhDuyetThay.ts`) — cần máy có trình duyệt; mặc định bật khi tìm thấy (`loi.ts:datMacDinhDayDu`) |
| Xuất sơ đồ PNG/PDF | ✅ | ⚠️ | ⚠️ | ngoài app vẽ bằng Chrome headless (`boVeSoDoThay.ts`) — không có Chrome thì hỏng |
| Sửa ảnh | ✅ | ✅ | ✅ | `sua_anh` |
| Git commit/PR/đẩy, tự cài git/gh | ✅ | ✅ | ✅ | `git_commit`, `tao_pr`, `cai_cong_cu` tools.ts:839, `github_*` |
| Ghi chú (Notes của web) | ✅ | ✅ | ✅ | tool máy chủ `notes_*` + `notes_write` |
| Worktree song song (EnterWorktree) | ✅ | ❌ | ❌ | **LỆCH**: chỉ desktop có nút/bảng (`AgentMode.tsx:2429 NutWorktree`, IPC `agent:taoWorktree`). Lõi có sẵn `worktree.ts` + kênh IPC ⇒ CLI/ext chỉ thiếu UI (mục 3.6) |
| Thêm thư mục ngoài dự án (/add-dir) | ✅ (kéo thả) | ✅ `/add-dir` | ✅ (kéo từ Explorer) | `agent:themDuong`; `viecVsc.ts:79`; CLI `lenh.ts:438` |
| Lệnh `/` | 24 lệnh | 24 + `/tasks /transcript /copy /language /theme /config /gateway /browser /add-dir /login /logout /fullscreen /terminal-setup /exit` | 24 | danh sách gốc `desktop/src/renderer/features/chat/lenhGach.ts:37`. **LỆCH nhẹ**: CLI nhiều hơn (đặc thù terminal) |
| Quyền "nhớ lâu" theo dự án | ✅ | ✅ | ✅ | `quyenLau.ts` — khoá là CHUỖI LỆNH ĐÚNG Y (`tools.ts:1543 khoa: lenh`) |
| Quyền theo TIỀN TỐ lệnh (`Bash(npm run test:*)`) | ❌ | ❌ | ❌ | thiết kế mục 3.8 |
| Hỏi người dùng bằng lựa chọn (AskUserQuestion) | ❌ | ❌ | ❌ | chỉ có thẻ duyệt (`xinPhep.ts:24`). Thiết kế mục 3.7 |
| Chờ / theo dõi / hẹn giờ (Monitor, ScheduleWakeup, cron) | ⚠️ | ⚠️ | ⚠️ | chỉ `chay_lenh_nen` + `doc_dau_ra_nen` (agent tự hỏi lại); không có "đánh thức sau N phút", không có cron. Thiết kế mục 3.2 |
| Nhắn giữa phiên / gửi tin cho agent đang chạy (SendMessage) | ❌ | ❌ | ❌ | thiết kế mục 3.3 |
| Điều khiển máy tính (computer use: chụp màn hình, click) | ❌ | ❌ | ❌ | thiết kế mục 3.4 |
| LSP (định nghĩa, tham chiếu, chẩn đoán sau sửa) | ❌ | ❌ | ⚠️ | ext chỉ có Code Action "Nhờ CuongMini sửa lỗi" đẩy diagnostics vào prompt (`extension.ts:397`), agent KHÔNG tự hỏi được. Thiết kế mục 3.5 |
| AI ngoại tuyến (llama.cpp) | ✅ | ❌ | ❌ | **LỆCH có chủ ý**: `aiCucBoThay.ts` "chỉ có trong app desktop" |
| Giọng nói (mic) | ✅ | ⚠️ | ✅ | core `ghiAm.ts`; CLI không có mic trong UI |
| Cổng chính hãng + mật khẩu + tự lùi Free | ✅ | ✅ | ✅ | docs/cong-anthropic-chinh-hang.md mục 9 |
| Hoàn tác / tua lại (/undo /rewind), theo dõi file do lệnh đổi | ✅ | ✅ | ✅ | `luiFile`, `theoDoiLenh.ts` |

### Lệch quan trọng nhất (xếp theo tác động)
1. **Tìm web gần như không chạy ở đâu cả** trước đợt 2 (Tavily chưa có khoá trên prod; server tool chỉ cổng chính hãng
   + admin bật). → **đã sửa** (mục 2.A).
2. **Extension không hiện agent phụ** — người dùng thấy "Agent phụ đang làm" rồi im cả chục giây. → **đã sửa**.
3. **Worktree chỉ có ở desktop** — lõi đã có, CLI/ext thiếu UI. → đợt 3 (mục 3.6).
4. Server tool `web_search_20260209` bị khai cho MỌI model chính hãng kể cả **Haiku 5.5 (CuongMini Free)** — Haiku chỉ
   nhận bản cơ bản `_20250305` ⇒ admin bật web search là lượt Free 400. → **đã sửa** (`caiDat.kieuWebSearch`).
5. Không có quyền theo tiền tố, hỏi bằng lựa chọn, agent phụ ghi được — thiếu so với Claude Code ở cả ba nơi.

## 2. Đã làm ở đợt 2

**A. `tim_web` cho mọi cổng** — `src/services/agent/timWeb.ts` (viết lại), `serverTools.ts` (truyền `userId`),
`search/searxng.ts` (+ trường `ngay`), `anthropicChinhHang/caiDat.ts` (`kieuWebSearch`), `goi.ts` (`viec: 'tim_web'`),
mô tả tool `tools.ts`, mục **TÌM WEB** trong `prompt.ts`. Chi tiết tính tiền/trần: docs/cong-anthropic-chinh-hang.md mục 4b.
Test: `src/services/agent/timWeb.test.ts` (12 ca, phụ thuộc giả — không mạng, không CSDL).

**B. 8 kỹ năng cài sẵn mới** (`src/services/agent/kyNangSan/`): `docker`, `may-ao`, `vps-ssh-deploy`, `video`,
`blender-3d`, `ios-xcode`, `android`, `sua-loi-may`; bổ sung `database` (SQLite, kết nối kiểm nhanh) và `kiem-thu`
(kiểm giao diện bằng trình duyệt có sẵn). Máy chủ phục vụ ngay (`GET /agent/ky-nang`); bản đóng gói app thêm import ở
`desktop/src/main/agent/kyNangSan/index.ts`. Lệnh trong kỹ năng đã chạy thật trên máy macOS này khi an toàn:
ffmpeg (cắt/ghép/nén/GIF/khung/loudnorm/crop/amix — **phát hiện ffmpeg 8 Homebrew không có `subtitles`/`drawtext`**),
Blender 5.1 `-b -P` render Cycles + xuất GLB (**phát hiện: lỗi Python vẫn thoát 0 nếu thiếu `--python-exit-code`;
engine EEVEE 5.x là `BLENDER_EEVEE`**), `xcrun simctl`/`notarytool`/`xcresulttool`, `android` CLI mới (cmdline-tools
báo `sdkmanager` đã deprecated), `utmctl`, `say -v Linh`, `sqlite3 .backup`, lệnh chẩn đoán âm thanh/mạng/đĩa macOS.
**Phát hiện Docker**: `docker info` TREO VÔ HẠN khi Docker Desktop kẹt (tiến trình backend vẫn sống) — kỹ năng dạy chạy
nền + trần giờ. Test: `kyNang.test.ts` (mọi file hợp lệ + đều được đóng gói), `desktop/.../kyNang.test.ts` (25 kỹ năng).

**C. Sửa rẻ**: extension vẽ agent phụ (`packages/vscode-cuongthai/webview/main.ts:419`); `kieuWebSearch` theo model.

## 3. Thiết kế đợt 3/4 (CHƯA làm)

### 3.1 Agent phụ GHI được (đợt 3)
- Máy chủ: `giao_viec_phu` thêm `quyen: 'doc' | 'ghi'` (mặc định `doc`). `laPhu` + `quyen:'ghi'` ⇒ giữ tool ghi nhưng
  KHÔNG có `giao_viec_phu` (không lồng), trần bước 25, không `git_day/tao_pr/github_*`.
- App: agent phụ ghi chạy trong **worktree riêng** (`worktree.ts` — đã có) để không đè việc của agent chính; xong thì
  trả `git diff --stat` + nhánh; agent chính quyết định merge (`git merge --no-ff`, có thẻ duyệt).
- Duyệt: mọi thẻ duyệt của agent phụ đi lên UI kèm nhãn "Agent phụ #id" (sự kiện `phuSuKien` bọc `xinPhep*` — UI cả
  ba nơi phải xử lý; CLI: `viecPhu.ts` + `ManChat.tsx`).
- Trần tiền: mỗi agent phụ ghi tính như một lượt; số lượng theo `DS_MUC_NO_LUC.viecPhu`.

### 3.2 Chờ / theo dõi / hẹn giờ (đợt 3)
- Tool app `cho_doi` `{ giay ≤ 3600, ly_do, dieu_kien?: { lenh_nen_id, khop_regex } }`: lõi tạm dừng lượt KHÔNG giữ
  kết nối máy chủ (đóng lượt, lưu "hẹn"), hết giờ hoặc khi đầu ra lệnh nền khớp regex ⇒ tự gửi lượt mới
  "[đánh thức] …" vào cùng cuộc. UI: thẻ đếm ngược + nút "Đánh thức ngay"/"Huỷ".
- Hẹn định kỳ (cron) để đợt 4: cần tiến trình sống (desktop có; CLI/ext chỉ khi đang mở) — lưu ở userData, không chạy khi app tắt.

### 3.3 Nhắn giữa phiên (đợt 3)
- "Gõ thêm khi agent đang chạy": hàng đợi tin ở lõi (`agent:send` khi đang chạy ⇒ đẩy vào `tinCho[]`), chèn như tin
  `user` ngay sau kết quả tool kế tiếp (không ngắt tool đang chạy). Máy chủ không đổi.
- Nhắn GIỮA hai cuộc (tab A gửi tab B): tool `gui_cuoc_khac {cuocId, noi_dung}` chỉ trong cùng app, có thẻ duyệt.

### 3.4 Điều khiển máy tính (đợt 4)
- Chỉ desktop trước (cần quyền Accessibility/Screen Recording). Tool `may_chup` (ảnh màn hình thu nhỏ ≤1280px),
  `may_bam {x,y}`, `may_go {chu}`, `may_phim {to_hop}` — macOS qua `screencapture` + CGEvent (helper nhỏ ký kèm app),
  Windows qua PowerShell `SendInput`. MỌI `may_bam/go/phim` đều duyệt; không bao giờ trong chế độ "Bỏ qua hết".
- Capability mới `may_tinh` (bản cũ không bao giờ được mời). CLI/ext: không khai.

### 3.5 LSP (đợt 3 cho extension, đợt 4 cho desktop/CLI)
- Extension: capability `lsp` + tool app `lsp_hoi {loai: 'dinh_nghia'|'tham_chieu'|'chan_doan'|'ky_hieu', file, dong, cot}`
  ⇒ `vscode.executeDefinitionProvider` / `executeReferenceProvider` / `languages.getDiagnostics`. Sau mỗi `edit_file`
  tự nối chẩn đoán MỚI của file đó vào kết quả tool (như hook `sauTool` nhưng không cần cấu hình).
- Desktop/CLI: chạy `typescript-language-server`/`pyright` qua stdio khi có trong dự án; trước mắt dùng hook `sauTool`
  (`npx tsc --noEmit`) — đã có.

### 3.6 Worktree cho CLI + extension (đợt 3, nhỏ)
- Lõi đã có `agent:taoWorktree/xoaWorktree` (`desktop/src/main/ipc/agent.ts`). CLI: lệnh `/worktree [tên nhánh]`,
  `/worktree xoa` (file `packages/cuongmini-cli/src/lenh.ts` + `lenhMoTa.ts`; sau khi tạo phải nạp lại gốc của cuộc như
  desktop `onDoi → napThuMuc + batDauLai`). Extension: `/worktree` trong `webview/lenh.ts` + mở thư mục worktree bằng
  `vscode.openFolder` (cửa sổ mới).

### 3.7 Hỏi người dùng bằng lựa chọn (đợt 3)
- Tool app `hoi_nguoi_dung {cau_hoi, lua_chon: [{nhan, mo_ta}] (2–4), nhieu?: bool}` (capability `hoi`). Lõi phát
  sự kiện `hoiLuaChon {id, cauHoi, luaChon}` và chờ như thẻ duyệt (`xinPhep.ts` — tái dùng cơ chế chờ/huỷ), trả nhãn đã
  chọn hoặc chữ tự do. UI: desktop thẻ nút; extension `theDuyet` với nút động; CLI menu mũi tên (`ManChat.tsx`).
- Prompt: chỉ hỏi khi có ≥2 hướng hợp lý mà chọn sai tốn công; không hỏi xin phép (đã có thẻ duyệt).

### 3.8 Quyền theo tiền tố lệnh (đợt 3, nhỏ)
- `quyenLau.ts`: khoá dạng `tien-to:<chuỗi>` khớp lệnh bắt đầu bằng chuỗi đó **và không chứa** `; && || | \` $( > <`
  xuống dòng (chống "npm test && rm -rf ~"). Lệnh `nguyhiem/cankiem` vẫn KHÔNG BAO GIỜ nhớ.
- Thẻ duyệt `run_command` thêm nút "Luôn cho phép `npm run test …`" (tiền tố = 2–3 từ đầu). `/quyen` liệt kê/xoá như cũ.
- Test: bảng ca khớp/không khớp trong `quyenLau.test.ts`.

### 3.9 Việc CLI cần thêm UI cho đợt 2 (không sửa `packages/cuongmini-cli/src/` ở đợt này)
- `tim_web` đã có nhãn (`trangThai.ts:24,38`) — sự kiện `tool` với `tomTat` mới dạng `"5 kết quả · SearXNG"` /
  `"… · Claude web search (cổng chính hãng) · ~0.012 $"`; không cần sửa. Nếu muốn: tô màu phần `~$` như chỗ hiện chi phí.
- Kỹ năng mới tự đến qua `/kynang` + `dung_ky_nang` — không cần UI.
