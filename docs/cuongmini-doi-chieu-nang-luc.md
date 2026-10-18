# AI Code — đối chiếu năng lực 3 nơi (desktop · CuongMini CLI · extension VS Code) và so với Claude Code

Soát 18/10/2026 (đợt 2) · **cập nhật đợt 3 cùng ngày** (mục 3 đã làm, mục 4 = đợt 4). Ba nơi chạy **cùng một bộ máy**: lõi `packages/cuongmini-core` bundle thẳng
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
| Agent phụ GHI được (general-purpose sửa file) | ✅ | ✅ | ✅ | **đợt 3**: tool `giao_viec_ghi` + `gop_viec_phu` (capability `phu_ghi`); khu riêng `desktop/src/main/agent/viecPhuGhi.ts`; máy chủ lọc capability + trần 25 bước (`turn.ts` `phuGhi`) |
| Định nghĩa agent phụ của dự án (`.claude/agents`) | ✅ | ✅ | ✅ | `agentPhu.ts` |
| Tìm web (WebSearch) | ⚠️→✅ | ⚠️→✅ | ⚠️→✅ | **đợt 2**: `tim_web` trước CHỈ có Tavily (prod chưa có khoá ⇒ luôn "chưa cấu hình"); server tool `web_search` chỉ cổng chính hãng + admin bật. Nay mọi cổng: SearXNG → Tavily → Claude chính hãng (`timWeb.ts`) |
| Đọc web (WebFetch) | ✅ | ✅ | ✅ | `doc_web` (máy chủ, chặn SSRF) + `web_mo/web_doc` (trình duyệt) |
| Trình duyệt điều khiển được | ✅ (nhúng) | ⚠️ | ⚠️ | CLI/ext lái Chrome/Edge thật qua puppeteer-core (`trinhDuyetThay.ts`) — cần máy có trình duyệt; mặc định bật khi tìm thấy (`loi.ts:datMacDinhDayDu`) |
| Xuất sơ đồ PNG/PDF | ✅ | ⚠️ | ⚠️ | ngoài app vẽ bằng Chrome headless (`boVeSoDoThay.ts`) — không có Chrome thì hỏng |
| Sửa ảnh | ✅ | ✅ | ✅ | `sua_anh` |
| Git commit/PR/đẩy, tự cài git/gh | ✅ | ✅ | ✅ | `git_commit`, `tao_pr`, `cai_cong_cu` tools.ts:839, `github_*` |
| Ghi chú (Notes của web) | ✅ | ✅ | ✅ | tool máy chủ `notes_*` + `notes_write` |
| Worktree song song (EnterWorktree) | ✅ | ✅ | ✅ | **đợt 3**: `/worktree [tên\|list\|xoa]` cả ba; VS Code mở worktree ở cửa sổ mới (`vscode.openFolder`) |
| Thêm thư mục ngoài dự án (/add-dir) | ✅ (kéo thả) | ✅ `/add-dir` | ✅ (kéo từ Explorer) | `agent:themDuong`; `viecVsc.ts:79`; CLI `lenh.ts:438` |
| Lệnh `/` | 24 lệnh | 24 + `/tasks /transcript /copy /language /theme /config /gateway /browser /add-dir /login /logout /fullscreen /terminal-setup /exit` | 24 | danh sách gốc `desktop/src/renderer/features/chat/lenhGach.ts:37`. **LỆCH nhẹ**: CLI nhiều hơn (đặc thù terminal) |
| Quyền "nhớ lâu" theo dự án | ✅ | ✅ | ✅ | `quyenLau.ts` — khoá là CHUỖI LỆNH ĐÚNG Y (`tools.ts:1543 khoa: lenh`) |
| Quyền theo TIỀN TỐ lệnh (`Bash(npm run test:*)`) | ✅ | ✅ | ✅ | **đợt 3**: `tienTo.ts` (chặn `; & \| \` $ < > ( ) { } \\` xuống dòng), nút "Luôn cho `npm test …`" trên thẻ lệnh, `/quyen them <tiền tố>` · `/quyen xoa <số>` |
| Hỏi người dùng bằng lựa chọn (AskUserQuestion) | ✅ | ✅ | ✅ | **đợt 3**: `hoi_nguoi_dung` (capability `hoi`), `hoiLuaChon.ts`; desktop `Dot3.tsx › TheHoi`, CLI `TheHoi` (↑↓/số/space/Khác), VS Code `veHoi` |
| Chờ / theo dõi / hẹn giờ (Monitor, ScheduleWakeup, cron) | ✅ | ✅ | ✅ | **đợt 3**: `cho_doi` (lệnh nền khớp regex / file / URL 2xx / pid / N giây, ≤15′) + `hen_goi_lai` (lặp ≤50) + `huy_hen`; `choHen.ts`; dải trạng thái có nút huỷ cả ba; `/hen`. Hẹn KHÔNG sống qua lúc tắt app (đợt 4) |
| Nhắn giữa phiên / gửi tin cho agent đang chạy (SendMessage) | ✅ | ✅ | ✅ | **đợt 3**: `liet_ke_phien` + `nhan_phien`, sổ `~/.cuongmini/phien/` + socket Unix/named pipe (`phienMang.ts`); tin đọc ở lượt kế hoặc nối vào kết quả tool kế tiếp nếu đang chạy; `/sessions`, `/rename` |
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

## 2b. Đã làm ở đợt 3 (18/10/2026)

Tóm tắt (chi tiết từng mục ở 3.x — mỗi mục có dòng **Đã làm** và chỗ **đổi thiết kế**):

| Mục | Lõi (`desktop/src/main/agent/`) | Máy chủ (`src/services/agent/`) | Desktop | CLI | VS Code |
|---|---|---|---|---|---|
| 3.1 Agent phụ ghi | `viecPhuGhi.ts`, `loop.ts › chayViecPhu(ghi)` + `gopViecPhu` | `tools.ts` `giao_viec_ghi`/`gop_viec_phu`; `turn.ts` lọc capability + 25 bước; `prompt.ts` promptViecPhu(ghi) | `Dot3.tsx › ThePhu`, nhãn 🤖 trên thẻ | thẻ duyệt "🤖 Agent phụ ·", bảng agent phụ | khối agent phụ + nhãn trên thẻ |
| 3.2 Chờ/hẹn | `choHen.ts`, `lenhNen.ts › xemDauRaNen` | `cho_doi`, `hen_goi_lai`, `huy_hen`, mục CHỜ & HẸN | `DaiHenCho` (Tiếp ngay / Bỏ chờ / Huỷ hẹn) | dòng ⏳/⏰, esc = bỏ chờ, `/hen` | dải `.hen-cho` có nút, `/hen` |
| 3.3 Nhắn phiên | `phienMang.ts` | `liet_ke_phien`, `nhan_phien`, mục NHẮN GIỮA PHIÊN | 📨 dòng tin, `/sessions` `/rename` | như trên | như trên |
| 3.6 Worktree | (có sẵn) | — | `/worktree` | `/worktree` | `/worktree` + mở cửa sổ mới |
| 3.7 Hỏi lựa chọn | `hoiLuaChon.ts` | `hoi_nguoi_dung`, mục HỎI BẰNG LỰA CHỌN | `TheHoi` (bấm / phím số) | `TheHoi` (↑↓, số, space, "Khác") | `veHoi` |
| 3.8 Tiền tố | `tienTo.ts`, `xinPhep.ts` `choPhepTienTo` | — | nút trên `XinPhepLenh`, `/quyen them` | lựa chọn thứ 3 trên thẻ lệnh | nút trên thẻ lệnh |

**Thêm ngoài kế hoạch (rẻ, rủi ro thấp — mục 7):**
- `git_commit` dùng **git index RIÊNG** (`gitViet.ts › commit`): chỉ commit đúng file được giao, phần người khác/phiên khác
  đang stage giữ nguyên (lỗi thật: commit gom đồ phiên khác). Áp dụng MỌI lúc, không chỉ khi có hai phiên.
- **Tiền hiển thị sai** (người dùng: chân trang ~$0.25 khi sổ máy chủ 3,42 $): `xong.tienUsd` của lõi chỉ là tiền VÒNG CUỐI.
  Nay `c.tienLuot` cộng mọi vòng + agent phụ; sự kiện mới `tienTrinh` sau mỗi vòng (token ra, ngữ cảnh %, tiền).
- **"context 0%" ở cổng chính hãng**: `turn.ts › goiNguCanh` tính thêm theo token VÀO thật của lời gọi gần nhất / cửa sổ
  (1M cho `cl-*` cao, 200k còn lại), lấy max với cách đếm ký tự; và cập nhật GIỮA lượt qua `tienTrinh`.
- `web_doc` 24.000 ⇒ **8.000 ký tự/lần** (+ `tu`/`tim`/`vung` đã có); prompt mục TRÌNH DUYỆT thêm "ĐỌC WEB TIẾT KIỆM"
  (đọc theo đoạn, đừng đọc lại, ưu tiên `mcp__ctwork__*`/API có cấu trúc).
- **CT Work một chạm** (`ctworkKetNoi.ts`, kênh `agent:ctwork`): tạo token `POST /work/me/api-tokens` bằng phiên đăng nhập,
  cất trong `safeStorage` (desktop) / file 0600 (CLI, VS Code), mcp.json chỉ có `Bearer ${CTWORK_TOKEN}` (lõi điền từ kho
  lúc nối — `mcp.ts › datNguonBienBiMat`; biến môi trường thật vẫn thắng). `/ctwork [doc|ghi|off]` cả ba nơi + nút trong
  bảng MCP desktop. Không cần đổi backend (route có sẵn nhận JWT).
- Nhắc **ngữ cảnh sắp đầy** (CLI, mốc 80%/95%). Tham số chính trên dòng tool (`thamSo` trong sự kiện `tool`/`toolBatDau`).
- CLI: Shift+Enter (kitty keyboard protocol), UI kiểu Claude Code (tool 1 dòng + gom tool liên tiếp, kế hoạch ☐/☒/◐ dưới
  dòng trạng thái, `✻ … (· ↓ N tokens · esc to interrupt)`), toàn màn hình KHÔNG bắt chuột mặc định (bôi đen/chép tự
  nhiên, con lăn qua alternate scroll 1007, ↑/↓ ô trống cuộn bản ghi, ctrl+↑/↓ lịch sử, `/mouse on`), không bao giờ
  xoá scrollback ở toàn màn hình (iTerm2 hết hỏi "clear scrollback?"), thoát toàn màn hình in TOÀN BỘ bản ghi, `/copy N|q|all`,
  ctrl+o = bản ghi đầy đủ, Enter không còn vứt tham số khi menu gợi ý đang mở, `/mcp mở` mở được file (`open -t`/notepad).

## 3. Thiết kế đợt 3/4 (đợt 3 ĐÃ LÀM — ghi chỗ đổi thiết kế)

### 3.1 Agent phụ GHI được (đợt 3)
- Máy chủ: `giao_viec_phu` thêm `quyen: 'doc' | 'ghi'` (mặc định `doc`). `laPhu` + `quyen:'ghi'` ⇒ giữ tool ghi nhưng
  KHÔNG có `giao_viec_phu` (không lồng), trần bước 25, không `git_day/tao_pr/github_*`.
- App: agent phụ ghi chạy trong **worktree riêng** (`worktree.ts` — đã có) để không đè việc của agent chính; xong thì
  trả `git diff --stat` + nhánh; agent chính quyết định merge (`git merge --no-ff`, có thẻ duyệt).
- Duyệt: mọi thẻ duyệt của agent phụ đi lên UI kèm nhãn "Agent phụ #id" (sự kiện `phuSuKien` bọc `xinPhep*` — UI cả
  ba nơi phải xử lý; CLI: `viecPhu.ts` + `ManChat.tsx`).
- Trần tiền: mỗi agent phụ ghi tính như một lượt; số lượng theo `DS_MUC_NO_LUC.viecPhu`.
- **Đã làm — đổi thiết kế:** (1) tool RIÊNG `giao_viec_ghi` thay cho tham số `quyen` của `giao_viec_phu` — app cũ bỏ qua
  tham số lạ và chạy chỉ-đọc, model tưởng đã sửa xong; tool riêng + capability `phu_ghi` thì app cũ không bao giờ thấy.
  (2) Thẻ duyệt của agent phụ đi TRẦN kèm `phuId` thay vì bọc trong `phuSuKien` — giao diện chưa biết vẽ sẽ BỎ cả khối
  bọc, thẻ không hiện, agent phụ treo 5 phút. (3) Worktree `--detach` tại `git stash create` (gồm thay đổi chưa commit) +
  chép file chưa theo dõi; mốc so sánh là TREE (`write-tree` với `GIT_INDEX_FILE` riêng) — không nhánh rác, không commit.
  (4) Gộp bằng chép file qua sổ hoàn tác (`ghiSoTruoc`), KHÔNG `git merge`: chạy được cả khi không phải repo git, /undo
  lùi được, và file dự án đã đổi từ lúc giao việc thì báo xung đột thay vì đè. Không phải git ⇒ chép sang thư mục tạm
  (bỏ node_modules/.git/dist…, trần 5000 file/100MB). Hook trước/sau tool CHƯA chạy cho agent phụ (đợt 4).

### 3.2 Chờ / theo dõi / hẹn giờ (đợt 3)
- Tool app `cho_doi` `{ giay ≤ 3600, ly_do, dieu_kien?: { lenh_nen_id, khop_regex } }`: lõi tạm dừng lượt KHÔNG giữ
  kết nối máy chủ (đóng lượt, lưu "hẹn"), hết giờ hoặc khi đầu ra lệnh nền khớp regex ⇒ tự gửi lượt mới
  "[đánh thức] …" vào cùng cuộc. UI: thẻ đếm ngược + nút "Đánh thức ngay"/"Huỷ".
- Hẹn định kỳ (cron) để đợt 4: cần tiến trình sống (desktop có; CLI/ext chỉ khi đang mở) — lưu ở userData, không chạy khi app tắt.
- **Đã làm — đổi thiết kế:** tách HAI tool: `cho_doi` chờ NGAY TRONG LƯỢT (tool chạy ở app giữa hai lần gọi máy chủ nên
  vốn không giữ kết nối nào — không cần "đóng lượt rồi mở lại"), trần 15′, thêm điều kiện file/URL/pid/thời gian; và
  `hen_goi_lai` cho chờ dài: lượt kết thúc, tới giờ lõi tự mở lượt "[Đánh thức …]" (`ipc/agent.ts › datBoChayHen`,
  sự kiện `tuDanhThuc`). Lặp đơn giản (`lap`, ≤50 lần) làm luôn; cron biểu thức + sống qua lúc tắt app để đợt 4.

### 3.3 Nhắn giữa phiên (đợt 3)
- "Gõ thêm khi agent đang chạy": hàng đợi tin ở lõi (`agent:send` khi đang chạy ⇒ đẩy vào `tinCho[]`), chèn như tin
  `user` ngay sau kết quả tool kế tiếp (không ngắt tool đang chạy). Máy chủ không đổi.
- Nhắn GIỮA hai cuộc (tab A gửi tab B): tool `gui_cuoc_khac {cuocId, noi_dung}` chỉ trong cùng app, có thẻ duyệt.
- **Đã làm — đổi thiết kế:** nhắn giữa MỌI phiên trên máy (desktop ↔ CLI ↔ VS Code, cả các tab cùng app), không chỉ
  trong một app: sổ `~/.cuongmini/phien/<pid>-<cuoc>.json` (0700/0600) + một socket Unix / named pipe mỗi tiến trình;
  tool `liet_ke_phien` + `nhan_phien` (thẻ duyệt, nhớ được theo phiên đích); trần 20 tin/phút, 8000 ký tự/tin. Tin đến
  KHÔNG tự chạy lượt (tránh vòng ping-pong tốn tiền). "Gõ thêm khi agent đang chạy" để đợt 4 (CLI đã có hàng chờ).

### 3.4 Điều khiển máy tính (đợt 4 — chưa làm)
- Chỉ desktop trước (cần quyền Accessibility/Screen Recording). Tool `may_chup` (ảnh màn hình thu nhỏ ≤1280px),
  `may_bam {x,y}`, `may_go {chu}`, `may_phim {to_hop}` — macOS qua `screencapture` + CGEvent (helper nhỏ ký kèm app),
  Windows qua PowerShell `SendInput`. MỌI `may_bam/go/phim` đều duyệt; không bao giờ trong chế độ "Bỏ qua hết".
- Capability mới `may_tinh` (bản cũ không bao giờ được mời). CLI/ext: không khai.

### 3.5 LSP (dời sang đợt 4 cả ba nơi)
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
- **Đã làm:** đúng thiết kế, khác: 1–4 câu mỗi lần (`cau_hoi[]`), hết giờ 30′, bỏ qua/huỷ trả "chưa trả lời — tự chọn
  hướng an toàn và nói rõ".

### 3.8 Quyền theo tiền tố lệnh (đợt 3, nhỏ)
- `quyenLau.ts`: khoá dạng `tien-to:<chuỗi>` khớp lệnh bắt đầu bằng chuỗi đó **và không chứa** `; && || | \` $( > <`
  xuống dòng (chống "npm test && rm -rf ~"). Lệnh `nguyhiem/cankiem` vẫn KHÔNG BAO GIỜ nhớ.
- Thẻ duyệt `run_command` thêm nút "Luôn cho phép `npm run test …`" (tiền tố = 2–3 từ đầu). `/quyen` liệt kê/xoá như cũ.
- Test: bảng ca khớp/không khớp trong `quyenLau.test.ts`.
- **Đã làm:** khoá `tien-to:<…>` trong `tienTo.ts` + nhánh trong `xinPhep.ts` (`lenhTienTo`, quyết định `choPhepTienTo`).
  Bắt được một lỗ khi viết test: gom khoảng trắng TRƯỚC khi kiểm thì xuống dòng (nối lệnh) thành dấu cách và lọt — nay
  kiểm nguyên văn trước. Test ở `dot3.test.ts` (lõi).

### 3.9 Việc CLI cần thêm UI cho đợt 2 (không sửa `packages/cuongmini-cli/src/` ở đợt này)
- `tim_web` đã có nhãn (`trangThai.ts:24,38`) — sự kiện `tool` với `tomTat` mới dạng `"5 kết quả · SearXNG"` /
  `"… · Claude web search (cổng chính hãng) · ~0.012 $"`; không cần sửa. Nếu muốn: tô màu phần `~$` như chỗ hiện chi phí.
- Kỹ năng mới tự đến qua `/kynang` + `dung_ky_nang` — không cần UI.


## 4. Đợt 4 (CHƯA làm — xếp theo tác động)

1. **Điều khiển máy tính** (3.4) — desktop trước; cần helper ký kèm app (CGEvent/SendInput) + quyền Accessibility.
2. **LSP** (3.5) — extension trước (`vscode.executeDefinitionProvider`…, nối chẩn đoán MỚI sau mỗi `edit_file`);
   desktop/CLI chạy `typescript-language-server`/`pyright` qua stdio.
3. **Hẹn sống qua lúc tắt app + cron biểu thức** — lưu `hen` ở userData, desktop chạy nền (tray), CLI/VS Code báo
   "đã lỡ N hẹn" khi mở lại. Hiện hẹn chỉ sống khi tiến trình còn mở (UI nói rõ).
4. **Gõ thêm khi agent đang chạy** (chèn vào giữa lượt như Claude Code) — CLI/VS Code hiện xếp hàng tới hết lượt.
5. **Hook trước/sau tool cho agent phụ ghi** (đang chỉ chạy cho agent chính) + PreCompact/Notification hook.
6. **Desktop/VS Code: nhắc ngữ cảnh sắp đầy** (CLI đã có, mốc 80/95%) và ô ngữ cảnh % trong khung VS Code.
7. **Gộp agent phụ bằng `git merge`** tuỳ chọn (giữ lịch sử commit của agent phụ) bên cạnh cách chép file hiện tại;
   gộp file nhị phân.
8. **Sửa notebook .ipynb** đã có (`sua_o_notebook`); còn thiếu chạy ô notebook (kernel) — cần jupyter trên máy.
9. **Desktop i18n** cho các câu trả lời lệnh `/` mới (`/sessions`, `/worktree`, `/hen`, `/ctwork`) — hiện tiếng Việt.

## 5. Kiểm từng lệnh `/` của CLI (18/10/2026, `src/test/lenhTatCa.test.ts`)

Chạy MỌI lệnh trong `/help`, không tham số + có tham số, tiếng Việt + English, lõi giả ghi lại kênh: 0 lệnh ném, 0 lệnh
im lặng, tham số giữ đúng (`/mcp mo|mở`, `/compact giữ…`, `/plan …`, `/review …`, `/quyen them …`, `/quyen xoa <số>`,
`/rename …`, `/worktree <tên>`, `/hen huy <id>`, `/ctwork ghi`, `/effort cao|high`, `/model opus`, `/mouse on`…).
Lỗi tìm ra và đã sửa: `/rewind <số>` khi lõi trả null ⇒ "Cannot read properties of null"; `/export` ở thư mục không ghi
được ⇒ lỗi ENOENT thô (nay lùi về thư mục nhà); lỗi mạng hiện "fetch failed" (nay "không kết nối được máy chủ");
`/mcp mở` (gõ có dấu) rơi xuống in danh sách; Enter khi menu gợi ý đang mở vứt tham số (`/mcp mo` ⇒ `/mcp`).
Khác Claude Code còn lại (cố ý): `/quyen` = `/permissions` (bí danh có), `/tasks` = `/agents` (bí danh có), `/kynang`
thay `/skills`… tên tiếng Việt giữ, bí danh tiếng Anh có ở mọi lệnh tương ứng.

### 5b. QA độc lập trong PTY thật (18/10/2026, `src/test/qa18.test.ts`)

Chạy bản dựng thật trong pseudo-terminal (xterm headless dựng lại màn hình, 140×40 và 100×30), backend LOCAL + model
thật (Cuong Sonnet 5, 6 vòng ≈ 0,84 $) rồi máy chủ kịch bản cho phần còn lại (lõi + tool THẬT). Lỗi tìm ra và đã sửa:
tiền MẤT khi dừng/lỗi giữa lượt (`/cost` ~$0.000 trong khi sổ 0,84 $ — CLI, desktop, VS Code) · ↑/↓ ở thẻ hỏi bị cuộn
bản ghi nuốt (Enter chọn nhầm đáp án 1) · `/copy` ra chữ vỡ "K·∫øt qu·∫£" khi LANG không phải UTF-8 hợp lệ (pbcopy) ·
nhắn phiên hỏng ECONNREFUSED khi đường socket > 104 byte · `/fullscreen off` xoá scrollback (iTerm2 hỏi) · thẻ duyệt CẮT
lệnh dài "…" (duyệt mù đuôi `| sh`) · khối code cắt "…" · thẻ nhắn phiên vẽ như "Bash command $ 📨" · lời dặn model
"NGƯỜI DÙNG TỪ CHỐI… ĐỪNG…" in ra bảng ghi · `Search(src)` mất mẫu tìm · `Wait(thoi_gian)` · khối "Task" trùng khi giao
việc phụ · kế hoạch đã xong treo dưới lượt mới · "running…" khi chưa duyệt · `/model opus|sonnet` "Unknown model" ·
giao diện English lẫn Việt (menu gợi ý `/`, gợi ý ⇧⏎ không đổi theo /language, mô tả model, lý do lệnh nguy hiểm, tóm
tắt tool, /doctor, lỗi worktree, "N tin", "(ghi)") · số nhiều ("1 results", "2 file", "1 lines below") · "tien-to:" và
`nhan_phien` lộ ra · banner cắt "…" câu chào/đường dẫn · dấu cách thừa đầu dòng bọc.
Còn lại (chưa sửa, ghi để biết): mỗi lời gọi modelapi ~45k token vào, đệm trúng 0,2% (~0,14 $/vòng với Sonnet 5);
toàn màn hình vẽ lại cả khung ~50 KB/s lúc đang chạy; chế độ in nối tiếp vẫn `ESC[3J` khi đổi cỡ (iTerm2 hỏi);
`kill -9` để lại khu agent phụ + socket trong `$TMPDIR`.
