# AI Code — đối chiếu năng lực 3 nơi (desktop · CuongMini CLI · extension VS Code) và so với Claude Code

Soát 18/10/2026 (đợt 2) · **cập nhật đợt 3 cùng ngày** · **đợt 4 cùng ngày** (mục 2c; mục 4 ghi việc đã/chưa làm) · **đợt 5 cùng ngày — CT Work hệ sinh thái** (mục 2d). Ba nơi chạy **cùng một bộ máy**: lõi `packages/cuongmini-core` bundle thẳng
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
| Notebook `.ipynb` (NotebookEdit) | ✅ | ✅ | ✅ | `sua_o_notebook`; **đợt 4** chạy: `chay_notebook` (capability `notebook_chay`, chỉ khi có `jupyter`) — `nbconvert --execute` trên bản sao, `den_o` = chạy ô 0…N, đầu ra ghi về file qua sổ hoàn tác (`notebookChay.ts`) |
| Kế hoạch/todo (TodoWrite) | ✅ | ✅ | ✅ | `cap_nhat_ke_hoach`; sự kiện `keHoach` |
| Bộ nhớ dài hạn (memory) | ✅ | ✅ | ✅ | `nho_bai_hoc` tools.ts:676, `boNho.ts`; lệnh `/memory` cả ba |
| Hooks (PreToolUse/PostToolUse/Stop/PreCompact/Notification) | ✅ | ✅ | ✅ | `hook.ts`: mốc `truocTool/sauTool/xongLuot` + **đợt 4** `truocNen` (trước `/compact`, `chan` huỷ nén) + `thongBao` (khi thẻ duyệt/câu hỏi hiện, biến `CUONGMINI_THONG_BAO`); trước/sau tool chạy cả cho **agent phụ** (`CUONGMINI_AGENT_PHU=1`, cwd = khu riêng) |
| MCP server ngoài | ✅ | ✅ | ✅ | `mcp.ts`, `mcpKetNoi.ts`; `/mcp` cả ba. **Đợt 5**: server `ctwork` DỰNG SẴN khi có token (không cần dòng trong mcp.json, vẫn tắt được) |
| CT Work hệ sinh thái (kiểu Jira tích hợp sẵn) | ✅ | ✅ | ✅ | **đợt 5** (mục 2d): tự nối bằng phiên đăng nhập, gắn thư mục ⇄ dự án, dòng trạng thái, `/ctwork` menu đánh số, `/issue` `/sprint` `/viec`, `LF-123` tự đính kèm, ghi CT Work luôn có thẻ xem trước |
| Kỹ năng (Skills) — dự án + cài sẵn | ✅ | ✅ | ✅ | `kyNang.ts`, kho máy chủ `src/services/agent/kyNangSan/*.md` (25 kỹ năng sau đợt 2); `/kynang` cả ba |
| Agent phụ CHỈ ĐỌC (Task/Explore) | ✅ | ✅ | ⚠️→✅ | **LỆCH đã sửa đợt 2**: extension trước bỏ qua `phuBatDau/phuSuKien/phuXong` (`webview/main.ts:413` cũ) — nay vẽ khối riêng `xuLyPhu` main.ts:419. CLI có bảng `/tasks` (`viecPhu.ts`) |
| Agent phụ GHI được (general-purpose sửa file) | ✅ | ✅ | ✅ | **đợt 3**: `giao_viec_ghi` + `gop_viec_phu` (capability `phu_ghi`); `viecPhuGhi.ts`. **Đợt 4**: `gop_viec_phu {cach:"merge"}` = commit của agent phụ + `git merge --no-ff` (cây sạch lúc giao + lúc gộp; xung đột ⇒ `merge --abort`); file **nhị phân** gộp bằng chép nguyên tệp có kiểm mã nội dung (blob sha / sha1) |
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
| Lệnh `/` | 25 lệnh | 25 + `/tasks /transcript /copy /language /theme /config /gateway /browser /add-dir /login /logout /fullscreen /terminal-setup /exit` | 25 | danh sách gốc `lenhGach.ts`; đợt 4 thêm `/may`, `/hen chay-bu` / `bo-lo`. CLI: `/mcp /quyen /hen /sessions /worktree /ctwork` là **thẻ lựa chọn** kiểu Claude Code (↑↓/số/Enter/Esc). VS Code `/mcp` có hàng nút; desktop `/mcp` mở bảng MCP (có nút Bật/Tắt từng server) |
| Quyền "nhớ lâu" theo dự án | ✅ | ✅ | ✅ | `quyenLau.ts` — khoá là CHUỖI LỆNH ĐÚNG Y (`tools.ts:1543 khoa: lenh`) |
| Quyền theo TIỀN TỐ lệnh (`Bash(npm run test:*)`) | ✅ | ✅ | ✅ | **đợt 3**: `tienTo.ts` (chặn `; & \| \` $ < > ( ) { } \\` xuống dòng), nút "Luôn cho `npm test …`" trên thẻ lệnh, `/quyen them <tiền tố>` · `/quyen xoa <số>` |
| Hỏi người dùng bằng lựa chọn (AskUserQuestion) | ✅ | ✅ | ✅ | **đợt 3**: `hoi_nguoi_dung` (capability `hoi`), `hoiLuaChon.ts`; desktop `Dot3.tsx › TheHoi`, CLI `TheHoi` (↑↓/số/space/Khác), VS Code `veHoi` |
| Chờ / theo dõi / hẹn giờ (Monitor, ScheduleWakeup, cron) | ✅ | ✅ | ✅ | `cho_doi` + `hen_goi_lai` + `huy_hen` (`choHen.ts`). **Đợt 4**: biểu thức **cron 5 trường** (`cron.ts`), hẹn **lưu đĩa** (`agent-hen.json` ở thư mục dữ liệu, mỗi mục mang PID chủ) ⇒ mở lại: quá hạn ⇒ "đã lỡ N hẹn" + hỏi chạy bù/bỏ (desktop nút, CLI thẻ lựa chọn, VS Code thẻ), chưa hạn ⇒ lên lịch lại, tới giờ tự mở đúng việc từ phiên trên đĩa. Desktop Windows/Linux đóng cửa sổ mà còn hẹn ⇒ chạy nền với **khay** (`khayHen.ts`); macOS vốn không thoát |
| Nhắn giữa phiên / gửi tin cho agent đang chạy (SendMessage) | ✅ | ✅ | ✅ | **đợt 3**: `liet_ke_phien` + `nhan_phien`, sổ `~/.cuongmini/phien/` + socket Unix/named pipe (`phienMang.ts`); `/sessions`, `/rename` |
| Gõ thêm khi agent đang chạy (chèn giữa lượt) | ✅ | ✅ | ✅ | **đợt 4**: kênh `agent:chenTin` ⇒ `loop.ts › chenTinCua` nối tin vào KẾT QUẢ TOOL kế tiếp (rào "NGƯỜI DÙNG VỪA GÕ THÊM"), model viết xong mà còn tin ⇒ đi tiếp thêm một vòng cùng lượt; sự kiện `daChen`. Desktop: Enter/nút "Chèn vào lượt" · CLI: Enter (lệnh `/` vẫn xếp hàng) · VS Code: Enter. Esc vẫn dừng. AI ngoại tuyến (llama.cpp) chưa chèn được |
| Điều khiển máy tính (computer use: chụp màn hình, click) | ✅ | ✅ | ✅ | **đợt 4**: `mayTinh.ts` — `may_chup/bam/go/phim/cuon` (capability `may_tinh`); macOS `screencapture`+`sips`+JXA CGEvent, Windows PowerShell user32, Linux xdotool. Công tắc mặc định TẮT: desktop nút **Máy tính** + `/may`, CLI `/may on`, VS Code cài đặt `cuongthai.dieuKhienMayTinh` + lệnh + `/may`. Mọi thao tác chuột/phím **luôn hỏi** (`xinPhep.ts › luonHoi`) |
| LSP (định nghĩa, tham chiếu, chẩn đoán sau sửa) | ✅ | ✅ | ✅ | **đợt 4**: `lsp_hoi` (capability `lsp`) + lỗi/cảnh báo MỚI tự nối sau `edit_file/create_file/sua_nhieu_cho`. Desktop/CLI: `lsp.ts` chạy `typescript-language-server`/`pyright-langserver --stdio` khi tìm thấy (theo cuộc, tắt sau 10′). VS Code (chế độ độc lập): `lspVsc.ts` dùng API của VS Code (mọi ngôn ngữ đã cài). ⚠️ VS Code chạy QUA APP ⇒ dùng server stdio của app |
| AI ngoại tuyến (llama.cpp) | ✅ | ❌ | ❌ | **LỆCH có chủ ý**: `aiCucBoThay.ts` "chỉ có trong app desktop" |
| Giọng nói (mic) | ✅ | ⚠️ | ✅ | core `ghiAm.ts`; CLI không có mic trong UI |
| Cổng chính hãng + mật khẩu + tự lùi Free | ✅ | ✅ | ✅ | docs/cong-anthropic-chinh-hang.md mục 9 |
| Biết ngày hôm nay | ✅ | ✅ | ✅ | **đợt 4**: app gửi `ngayGio` (ngày + múi giờ máy), máy chủ `prompt.ts › dongHomNay` ghi dòng "HÔM NAY: …" ở CUỐI system (chỉ ngày ⇒ không phá đệm); app cũ ⇒ đồng hồ máy chủ theo giờ VN |
| Nhắc ngữ cảnh sắp đầy (80/95%) + ô % | ✅ | ✅ | ✅ | **đợt 4**: desktop nhắc trên bảng ghi; VS Code ô `NN%` ở thanh dưới + nhắc; CLI có từ đợt 3 |
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

## 2c. Đã làm ở đợt 4 (18/10/2026)

| Việc | Lõi (`desktop/src/main/agent/`) | Máy chủ (`src/services/agent/`) | Desktop | CLI | VS Code |
|---|---|---|---|---|---|
| 1. Điều khiển máy tính | `mayTinh.ts` (HĐH gọi qua `chay` tiêm được — test giả), `xinPhep.ts › luonHoi`, `loop.ts › chayToolMay` | tools `may_*`, capability `may_tinh`, mục ĐIỀU KHIỂN MÁY TÍNH | nút **Máy tính** (xác nhận khi bật), `/may`, thiết đặt `aiMayTinh` (chỉ main ghi) | `/may on` / `off` (+ hướng dẫn quyền macOS) | cài đặt `cuongthai.dieuKhienMayTinh`, lệnh "Bật/tắt điều khiển máy tính", `/may` |
| 2. LSP | `lsp.ts` (khách JSON-RPC stdio, nguồn bơm được), nối chẩn đoán sau sửa trong `loop.ts` | tool `lsp_hoi`, capability `lsp`, mục LSP | server stdio | server stdio | `src/lspVsc.ts` (API VS Code) qua `loi.datNguonLsp` |
| 3. Hẹn qua lúc tắt + cron | `cron.ts`, `choHen.ts` (lưu/nạp, `dsHenLo/xuLyHenLo/ganHenChoCuoc`), `ipc/agent.ts` mở lại phiên khi tới giờ | `hen_goi_lai {cron}` | khay (`khayHen.ts`), thẻ "Đã lỡ N hẹn" có nút | thẻ lựa chọn lúc mở + `/hen chay-bu` / `bo-lo` | thẻ có nút + `/hen chay-bu` / `bo-lo` |
| 4. Gõ thêm giữa lượt | `loop.ts › chenTinCua`, sự kiện `daChen`, kênh `agent:chenTin` | — | Enter / nút "Chèn vào lượt" | Enter (↳) | Enter (↳), ô nhập ghi "gõ thêm để chèn" |
| 5. Hook agent phụ + PreCompact + Notification | `hook.ts` (mốc `truocNen`/`thongBao`, `cwd`/`env`), `lenh.ts › chayLenh({env})` | `compactChuDong.ts` trần ghi chú 500 ⇒ 2000 | (dùng chung) | | |
| 6. Nhắc ngữ cảnh đầy | — | — | `AgentMode.tsx` (mốc 80/95) | (đợt 3) | ô `%` + nhắc (`webview/main.ts`) |
| 7. Gộp bằng git merge + nhị phân | `viecPhuGhi.ts › gopBangMerge`, nhị phân trong `gopVaoGoc` | `gop_viec_phu.cach` | | | |
| 8. Chạy notebook | `notebookChay.ts`, `loop.ts › chayNotebookCoDuyet` | tool `chay_notebook`, capability `notebook_chay` | | | |
| 9. Desktop i18n `/sessions /rename /worktree /ctwork /hen /may` | — | — | `dich/dichP` + mục mới ở `i18n/tuDien.ts` | | |
| 10. Chi phí / đệm | MCP sắp theo tên (`tools.ts`) | luật ĐỌC RẺ (mục 11 `LOI_LAM_VIEC`), dòng HÔM NAY ở cuối | | | |
| 11. Lỗi CLI | — | — | | `toanManHinh.ts` (lọc `ESC[3J` cả chế độ in nối tiếp; chỉ `ctrl+l`/`/clear` mới qua), banner bỏ `·`/`…`/`⎇` trong khung | |
| A. Ngày hôm nay | `loop.ts › ngayGioMay` | `prompt.ts › dongHomNay`, `agent.routes.ts` truyền `ngayGio` | ✅ | ✅ | ✅ |
| B. `/mcp` thẻ lựa chọn | `mcp.ts › batTatServer` (`"disabled": true`), kênh `agent:mcpTool`/`agent:mcpBatTat` | — | nút Bật/Tắt từng server trong bảng MCP | thẻ lựa chọn (+ `/quyen /hen /sessions /worktree /ctwork`), khối `than` trong `MenuView` | hàng nút dưới `/mcp` |
| C. Cảnh báo "đang chạy dở…đổi chế độ" lạc chỗ | — | — | | `cheDo.ts › quyetDoiCheDo`: đổi chế độ giữa lượt ⇒ HOÃN tới cuối lượt; phím thừa ≤800ms sau khi duyệt ⇒ bỏ; shift+tab trên thẻ = "Có, không hỏi lại" khi thẻ có lựa chọn đó | |
| D. `sprint_current` | — | `src/services/work/toolRegistry/planning.ts › sprintTrongTam`: không có sprint ACTIVE ⇒ `focus` = sprint planned phủ hôm nay / sắp tới gần nhất, ≤30 thẻ (key, tên, trạng thái, người làm), `denNgayChuaBatDau` | | | |

**Đo đệm tiền tố (18/10, ~0,2 $):** cùng một yêu cầu gửi hai lần tới modelapi —
- **GPT (`gpt-6-luna`, tuyến OpenAI): đệm trúng 5.248/5.451 token (96%)** khi tiền tố đứng yên ⇒ phía ta giữ tiền tố ổn định là đủ (đã kiểm: prompt không có giờ/phút, tool sắp cố định, MCP nay sắp theo tên, mốc lược `nenNguCanh` theo bậc).
- **Claude qua modelapi (`claude-sonnet-4-6`)**: hai yêu cầu Y HỆT báo `prompt_tokens` 33.404 rồi 44.274 (39.915, 41.065…) ⇒ cổng **chèn một khối ẩn ~26–44k token, thay đổi theo từng lời gọi**, TRƯỚC phần của ta. Phần cổng tự đệm (`cached` 26–33k) là khối ẩn của nó; phần của ta (~7–11k) không bao giờ trúng. Gắn `cache_control` (tuyến `/v1/messages`) chỉ ra `cache_creation` 7–12k mỗi lần, **không lần nào đọc lại** ⇒ trả thêm ×1,25 mà không lợi ⇒ **cố ý KHÔNG gắn** cho modelapi. Con số "~45k token vào mỗi lượt" phần lớn là khối ẩn đó, không phải prompt của ta. Đòn bẩy còn lại: ít token hơn/ít vòng hơn (luật ĐỌC RẺ), hoặc dùng cổng chính hãng (đã có `ganCache`).

**Chưa làm / làm khác (và vì sao):**
- PreCompact cho lần **nén tự động phía máy chủ** (`tóm tắt ngữ cảnh` trong `turn.ts`) — chạy trên máy chủ, không có chỗ chạy hook của máy người dùng; hook `truocNen` chỉ áp cho `/compact`.
- LSP của VS Code khi extension chạy **qua app desktop**: tool chạy trong app (cầu nối HTTP không mang được API VS Code) ⇒ dùng server stdio của app.
- Chạy notebook theo **từng ô trong kernel sống** (giữ biến giữa các lần): chưa — `nbconvert` chạy lại từ ô 0 tới ô N mỗi lần (đúng nhưng chậm với notebook nặng).
- `/quyen /hen /sessions /worktree /ctwork` dạng thẻ lựa chọn: CLI đủ; VS Code + desktop mới làm `/mcp` (desktop bảng MCP + nút Bật/Tắt; VS Code hàng nút). Các lệnh kia ở VS Code/desktop vẫn trả chữ (đã song ngữ ở desktop). → **đợt 5 đã làm** (mục 2d, việc 9).
- Hẹn tới giờ khi việc đã đóng: lõi mở phiên vào một cuộc NỀN và chạy; CLI/VS Code không vẽ cuộc nền đó (xem lại bằng `/resume`/Lịch sử).
- Đổi cỡ cửa sổ ở chế độ in nối tiếp: bỏ `ESC[3J` ⇒ bản ghi in lại để MỘT bản cũ trong scrollback (đổi lấy việc iTerm2 không hỏi). Test `khung.test.ts` sửa theo.
- Lỗi C không tái hiện được bằng đọc mã (không thấy đường nào tự gọi `agent:datCheDoQuyen` sau khi duyệt); nghi phím shift+tab (thói quen "Yes, don't ask again" của Claude Code) rơi xuống phím toàn cục ngay khi thẻ đóng — sửa cả ba lớp (hoãn, bỏ phím thừa, shift+tab trên thẻ) thay vì chỉ một.
- PTY QA với lõi thật cho riêng đợt 4: chưa chạy (đã có test vòng lặp với máy chủ giả `dot4Loop.test.ts`, test LSP với server giả, test HĐH giả; `screencapture` thật chạy MỘT lần để kiểm đường chụp — ảnh đã xoá; JXA chuột/phím chỉ biên dịch bằng `osacompile`, không chạy).

## 2d. Đợt 5 — CT Work hệ sinh thái (18/10/2026)

Mục tiêu: CT Work là "hệ sinh thái riêng, có đặc quyền" của CuongMini (người dùng — sinh viên FPT — dùng CuongMini làm
mentor đồ án LabFlow AI, dự án **LF** id 2, không gian "LabFlow Studio" id 3), và bố cục/nút giống Claude Code ở cả ba nơi.
Phần việc thật ở LÕI (dùng chung): `desktop/src/main/agent/ctworkVe.ts` (thuần: đọc kết quả MCP, vẽ sprint/thẻ, đoán dự án,
xem trước thao tác ghi), `ctworkHe.ts` (gắn thư mục, dòng trạng thái có đệm, menu, đính kèm thẻ), kênh `agent:ctworkHe`.
Phần điều phối menu CHUNG ba nơi: `desktop/src/renderer/features/chat/ctworkLenh.ts` (thuần, không React) — app, CLI, VS Code
chỉ cắm cách vẽ thẻ lựa chọn.

| Việc | Lõi / máy chủ | Desktop | CLI | VS Code |
|---|---|---|---|---|
| 1. Tự nối bằng phiên đăng nhập | `ctworkKetNoi.ts`: token tạo bằng `POST /work/me/api-tokens` (như đợt 3), server `ctwork` thành **dựng sẵn** (`mcp.ts › datNguonServerDungSan`) — không ghi mcp.json nữa, dòng cũ do app thêm được gỡ khi nối lại; `"ctwork": {"disabled": true}` vẫn tắt được (`/mcp` ghi đúng dòng đó), mục người dùng tự viết (có url/command) thắng. Lỗi 401/403 ⇒ `canCapLai` ⇒ `agent:ctwork {viec:'capLai'}` cấp lại cùng quyền. `agent:ctworkHe {viec:'goiY'}` quyết định hỏi gì (kết nối / cấp lại / gắn dự án), mỗi câu MỘT lần (`ctworkDaHoi`, `ctwork-da-hoi.json` theo thư mục) | thẻ nút lúc mở tab đầu | thẻ lựa chọn lúc mở | thẻ nút lúc nối |
| 2. Gắn thư mục ⇄ dự án | `.cuongmini/ctwork.json` = `{workspaceId, projectId, key}` (+ `ref` khi nhiều không gian, `ten`, `workspace`; KHÔNG token), gợi ý `.gitignore` (không tự sửa). Đoán từ AGENTS.md/CLAUDE.md ("dự án **LF** (id 2)… không gian **"…"** (id 3)" hoặc `LF-12` lặp ≥3). `list_projects` thêm `id`, `workspaceId`, `workspaceName` (`src/mcp/tools/read.ts`, chỉ thêm trường). Máy chủ: `prompt.ts › dongDuAnCtwork` — dòng "DỰ ÁN CT WORK: LF (id 2) …" ngay SAU dòng HÔM NAY (đổi theo thư mục, không theo lượt ⇒ không phá đệm), lọc chặt từng trường | `/ctwork du-an`, mục 9 | như trên | như trên |
| 3. Dòng trạng thái | `dongTrangThai`: dự án · sprint đang chạy / `focus` · còn N ngày · thẻ từ nhánh `LF-123-…`; `sprint_current` **tối đa 1 lần / 5 phút** mỗi dự án (hai lần hỏi cùng lúc chung MỘT lời gọi); nhánh đệm 15 s | nút mờ trên ô nhập (bấm = menu) | dòng dưới ô nhập, trên chân trang | dòng dưới khung nhập |
| 4. `/ctwork` menu đánh số | 1 sprint theo cột · 2 việc của tôi (hạn gần lên đầu) · 3 mở thẻ (tiêu đề, trạng thái, người làm, mô tả gọn, "Tự kiểm", bình luận gần nhất) · 4 bắt đầu (nhánh `LF-xx-slug` + In Progress, xem trước) · 5 ghi giờ · 6 bình luận bằng chứng (soạn từ `git log`/`diff --numstat`/`status`, xem trước, Gửi/Sửa/Huỷ) · 7 báo cáo tuần · 8 họp · 9 chọn dự án · 0 thoát. Lối tắt `/issue LF-18` (`/the`), `/sprint`, `/viec`; con: `ket-noi`, `cap-lai`, `gio <KEY> <giờ> [ghi chú]`, `gui <KEY> <nội dung>`, `tu-ghi on|off` | nút có số + gõ số ở ô trống | thẻ lựa chọn (số `0` = Thoát) | hàng nút có số + gõ số ở ô trống |
| 5. `LF-123` trong câu ⇒ tự nạp | `ctworkHe › dinhKemThe` (đúng key đã gắn, bỏ khối code, ≤3 thẻ, ≤1.500 ký tự/thẻ, phần người viết bọc `<ctwork-content untrusted>`; đọc hỏng ⇒ bỏ qua thẻ đó), sự kiện `dinhKemCtwork` | chip trên tin | `📎 LF-18` dưới tin | chip trong tin |
| 6. Kết quả tool CT Work đẹp | `ctworkVe › tomTatKetQua` ⇒ `tomTat` một dòng + `xemGon` (bảng gọn) trong sự kiện `tool`; model vẫn đọc bản đầy đủ | `CT Work · sprint_current(…)` + bảng khi mở | `● CT Work · sprint_current — Sprint 2 · 14 thẻ`, ctrl+o mở bảng | tương tự |
| 7. Ghi luôn qua thẻ duyệt | `loop.ts › chayToolMcpCoDuyet`: server CT Work TIN CẬY (`laCtworkTinCay` — dựng sẵn hoặc url chính thức) + `readOnlyHint` ⇒ không hỏi; ghi ⇒ `luonHoi` (kể cả "Bỏ qua hết") trừ `ctworkTuGhi` (`/ctwork tu-ghi on`, chỉ main ghi); thẻ mang `xemTruoc {the, viec, noiDung}` (`moTaGhi`). Server MCP khác GIỮ luật cũ | thẻ "Ghi lên CT Work · Bình luận → LF-18" | như trên | như trên |
| 8. Luật CT Work trong prompt | `prompt.ts › LUAT_CTWORK` (đọc rẻ: JQL hẹp, get_issue từng thẻ, không mở web; claim → làm → comment bằng chứng → log_work → transition; ghi có duyệt; untrusted; AGENTS.md thắng) — chỉ khi cuộc có `mcp__ctwork__*`, ở phần ỔN ĐỊNH (sau LOI_LAM_VIEC, trước HÔM NAY). Tool CT Work xếp ưu tiên trong trần 40 tool (`UU_TIEN_CTWORK`, chừa ≤16 chỗ cho server khác) | | | |
| 9. `/quyen /hen /sessions /worktree /ctwork` thành nút | — | thẻ lựa chọn (`NutLenh {chon}`) | (đợt 4) | hàng nút (`chonVsc`) |
| 10. Bố cục CLI kiểu Claude Code | — | — | thẻ duyệt `1. Yes · 2. Yes, and don't ask again for … · 3. No, and tell CuongMini what to do differently (esc)` (VI: "Có · Có, và không hỏi lại … · Không, và bảo CuongMini làm khác đi (esc)"); `? phím tắt` ở chân trang + bảng phím tắt khi gõ `?` ở ô trống; `/help` gọn (`/help all` đầy đủ); tiêu đề cửa sổ terminal = tiêu đề phiên (OSC 0); một dòng trống trước thông báo; tool CT Work một dòng; không đụng ô nhập ghim đáy / copy chuột / Shift+Enter / kế hoạch + ctrl+t | — |

**Test**: `desktop/src/main/agent/dot5.test.ts` (thuần + `ctworkHe` với CT Work giả: đệm 5 phút kể cả gọi song song,
đính kèm ≤3×1.500, gắn/gitignore, bắt đầu/bình luận/ghi giờ chỉ ghi khi gọi), `dot5Loop.test.ts` (vòng lặp: đọc không hỏi,
ghi luôn hỏi kể cả "Bỏ qua hết", tự ghi, server khác giữ luật cũ, `LF-18` ⇒ tóm tắt + chip + `ctwork` trong thân),
`dot5Mcp.test.ts` (server MCP HTTP giả: dựng sẵn không ghi mcp.json, ưu tiên tool, `chiDoc`, tắt/bật bằng `disabled`, mục tự viết
thắng, 401 ⇒ lỗi xác thực); `src/services/agent/prompt.test.ts` (dòng dự án lọc chặt, LUAT_CTWORK); CLI
`src/test/dot5.test.ts` (menu, `/issue` ⇒ xem trước ⇒ ghi, ghi giờ, bình luận, hỏi một lần, dòng trạng thái, tool một dòng,
chip, thẻ duyệt đánh số, `/help` gọn) và `src/test/dot5Pty.test.ts` — **PTY + LÕI THẬT** (`dist/loi.cjs`) + máy chủ giả: kết nối
một chạm ⇒ gắn LF ⇒ dòng trạng thái ⇒ `/ctwork` ⇒ 1 ⇒ `/issue LF-18` ⇒ câu có LF-18 (chip + tóm tắt trong thân gửi) ⇒ thẻ duyệt
ghi CT Work ⇒ từ chối (không ghi) ⇒ `?`; `sprint_current` ≤ 2 lần cả phiên. Mẫu kết quả đúng hình máy chủ: `ctworkMauThu.ts`.

**Chưa làm / làm khác (và vì sao):**
- "Thẻ đang làm" suy từ NHÁNH git; chưa đọc lease/claim — `claim_issue` là tool của token AGENT, token người (thứ `/ctwork`
  cấp) không có, và gọi `my_work` mỗi 5 phút chỉ để tìm lease thì tốn thêm một lời gọi cho trường hợp hiếm.
- "Gắn dự án" khi đoán từ AGENTS.md vẫn gọi `list_projects` một lần để lấy đúng `ref` (`slug/LF` khi ở nhiều không gian). Máy
  chủ prod cũ (chưa deploy `list_projects` có `id`) ⇒ `projectId` lấy từ AGENTS.md, gắn từ menu thì `id` = null (vẫn chạy, chỉ
  dòng "(id 2)" vắng).
- Thẻ duyệt ghi CT Work của model chỉ có Có / Không (không có "không hỏi lại") — "tự ghi" là công tắc riêng `/ctwork tu-ghi on`,
  không phải quyền nhớ theo thẻ (cùng lý do MCP không nhớ quyền: bên viết mô tả tool không được là bên bỏ cửa duyệt).
- Menu ghi từ giao diện (bắt đầu, ghi giờ, bình luận, báo cáo tuần) đi qua thẻ xem trước CỦA GIAO DIỆN rồi gọi lõi; không qua
  `hoiNguoiDung` (không có lượt agent nào đang chạy để dừng).
- Desktop + VS Code: chưa có test hiển thị (React/DOM) riêng cho thẻ lựa chọn — phần điều phối dùng chung đã test ở CLI.

## 2e. Đợt "cổng & model CuongMini" (18/10/2026) — bỏ trần làm model kém đi

Chủ app: "không giới hạn năng lực — giới hạn TIỀN thì giữ, nhưng chặn bằng trần chi tiêu, không bằng cách làm model ngu đi".
Trần tiền mới: `src/services/agent/tranModel.ts` (USD/người/tháng+ngày theo từng model, admin chỉnh). Các trần đã đổi:

| Chỗ | Trần | Trước | Sau |
|---|---|---|---|
| máy chủ `turn.ts` | ký tự hội thoại | 600.000 (2.400.000 chỉ khi chọn tay model cao chính hãng) | theo cửa sổ THẬT: `cửa sổ × 2,4` ⇒ 2.400.000 (model 1M) · 960.000 (GPT 400K) |
| máy chủ `turn.ts` | cửa sổ tính "context %" | 200.000 (1M chỉ model cao) | đúng cửa sổ model (1M / 400K) |
| máy chủ `turn.ts` | số tin hội thoại | 200 (≈100 bước) | 1.000 (trần thô 5.000) |
| máy chủ `turn.ts` | `max_tokens` lượt agent tuyến OpenAI | 16.000 | trần thật của model (128.000) |
| máy chủ `cauHinh.ts` | `max_tokens` lượt agent chính hãng | 64.000 | 128.000 (kẹp theo `/v1/models`) |
| máy chủ `turn.ts` | `reasoning_effort` GPT | không gửi (cổng tự `medium` cho mọi mức) | theo mức người chọn: thấp→low · vừa→medium · cao→high · rất cao/tối đa/ultracode→xhigh |
| máy chủ `turn.ts` | lược kết quả tool cũ | luôn lược (giữ 8–15 kết quả), trừ model cao chính hãng | chính hãng: KHÔNG lược (compact phía Anthropic); modelapi: chỉ lược khi hội thoại > ½ cửa sổ |
| máy chủ `turn.ts` | một kết quả tool app gửi | 60.000 ký tự | 200.000 |
| máy chủ `turn.ts` | bước agent phụ | đọc 10 · ghi 25 | đọc 25 · ghi 50 |
| máy chủ `tomTatLuotCu.ts` | tóm tắt khi hội thoại đầy | model RẺ (`cv_parse`), vào 90.000 ký tự, mỗi kết quả tool 400, ra 2.000 token, ~900 từ | CHÍNH model của cuộc (`goiTomTatBangModel`), vào 400.000, mỗi kết quả tool 1.500, ra 16.000, ~1.800 từ; đệm theo băm có MÃ model |
| máy chủ `/agent/compact` | `/compact` | model rẻ | model của cuộc (app gửi `model` + `congAnthropicVe`) |
| app/lõi `lenh.ts` | đầu ra một lệnh | 12.000 ký tự | 40.000 |
| app/lõi `lenhNen.ts` | mỗi lần đọc lệnh nền | 12.000 | 40.000 |
| app/lõi `tools.ts` | một lần `read_file` | 16.000 ký tự | 60.000 (300 dòng mặc định, tối đa 2.000 giữ nguyên) |
| app/lõi `tools.ts` | một lần `web_doc` | 8.000 | 24.000 |
| app/lõi `mcpNoiDung.ts` | một kết quả tool MCP | 16.000 | 60.000 |

Lõi `desktop/src/main/agent/*` chạy chung cho app desktop, CuongMini CLI và extension VS Code (`packages/cuongmini-core`) trên cả
macOS / Windows / Linux ⇒ một chỗ sửa là đủ ba nơi, ba hệ điều hành. Mức nỗ lực (8/30/60/100/160/260 bước) giữ nguyên — đó là lựa
chọn của người dùng, không phải trần ẩn.

Danh sách model ở cả ba nơi: một danh sách, xếp năng lực cao → thấp (thứ tự máy chủ), CHỈ tên CuongMini; model cần khoá chưa có vé
hiện tối hơn + 🔒, bấm/chọn ⇒ ô nhập khoá (CLI: thẻ + ô ẩn ký tự) ⇒ đúng thì chọn luôn. Cổng hỏng ⇒ máy chủ tự sang model free
tương đương ở cổng kia, app chỉ in một dòng mờ "Đã chuyển sang … vì cổng bận". Bỏ dòng "Cổng AI đang chậm…" và dòng "cổng AI đang
quá tải — chờ Xs…" (thử lại im lặng).

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

### 3.4 Điều khiển máy tính (đợt 4 — ĐÃ LÀM, đổi thiết kế: không helper ký riêng, chạy cả CLI/VS Code; xem 2c)
- Chỉ desktop trước (cần quyền Accessibility/Screen Recording). Tool `may_chup` (ảnh màn hình thu nhỏ ≤1280px),
  `may_bam {x,y}`, `may_go {chu}`, `may_phim {to_hop}` — macOS qua `screencapture` + CGEvent (helper nhỏ ký kèm app),
  Windows qua PowerShell `SendInput`. MỌI `may_bam/go/phim` đều duyệt; không bao giờ trong chế độ "Bỏ qua hết".
- Capability mới `may_tinh` (bản cũ không bao giờ được mời). CLI/ext: không khai.

### 3.5 LSP (đợt 4 — ĐÃ LÀM cả ba nơi; xem 2c)
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


## 4. Đợt 4 (ĐÃ làm 18/10/2026 — xem mục 2c; giữ danh sách gốc để đối chiếu)

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

### 5c. QA đợt 4+5 (18/10/2026 — PTY thật + lõi thật, `src/test/qa5c.test.ts`, `qa5cPty.test.ts`)

Cách làm: bản dựng THẬT (`dist/cuongmini.mjs` + `dist/loi.cjs`) trong pseudo-terminal TƯƠNG TÁC (gửi phím từng bước,
dựng lại màn hình bằng xterm headless, đo khung bằng string-width), HOME giả, dự án LF giả có AGENTS.md + nhánh
`LF-18-erd`, máy chủ giả có MCP CT Work — lần này máy chủ giả **làm đúng như máy chủ thật ở chỗ bộ test cũ bỏ sót**:
token chỉ đọc ⇒ `tools/list` KHÔNG có tool ghi (`src/mcp/server.ts › visibleTools`), tool ghi gọi bằng token đọc ⇒
`FORBIDDEN: This API token is read-only`. Đi hết ~95 lệnh `/` (VI + EN, có/không tham số), mọi mục của thẻ `/ctwork`
1–9/0, `/mcp`, `/quyen`, `/hen`, `/sessions`, `/worktree`, `/model`, `/may`, thẻ duyệt (1/2/3, Enter đúp, shift+tab ngay
sau duyệt, Esc), chèn tin giữa lượt, Esc, ctrl+c ×2, chip `LF-123` (không tồn tại, dự án khác, 4 thẻ, 401, chậm), "Bỏ qua
hết" + `tu-ghi`, mcp.json có server hỏng/tắt/tự khai `ctwork`, đổi cỡ 60×20 ↔ 130×35, in nối tiếp, hẹn cron sai/đúng +
tắt mở lại "đã lỡ", ngữ cảnh 83%. Không chạm CT Work/máy chủ thật, không bấm chuột/phím thật (`may_*` chỉ qua test HĐH giả).

**Lỗi tìm ra và đã sửa** (mức: 🔴 cao · 🟠 vừa · 🟡 nhỏ):
- 🔴 **Token chỉ đọc (mặc định "khuyên dùng") ⇒ mọi mục GHI của menu hỏng câm**: Ghi giờ/Bình luận/Báo cáo tuần cho
  xem trước rồi lỗi `server "ctwork" không có tool "log_work"` (tiếng Việt cả ở English); "Bắt đầu" xem trước "chuyển
  In Progress" rồi hỏng. Nay: menu ghi "cần quyền ghi — /ctwork ghi", bấm ⇒ thẻ "Token CT Work đang chỉ đọc · 1. Nối lại:
  đọc + ghi" (`ctworkLenh.ts › chanChiDoc`, lõi `ctworkHe.ts › thieuQuyenGhi` + `trangThaiCtwork().coGhi` đọc từ
  `tools/list` — đúng cả token từ biến `CTWORK_TOKEN`).
- 🔴 **Thẻ "Token hết hạn — Cấp lại" GIẢ**: `LOI_XAC_THUC` khớp chữ `forbidden` ⇒ lỗi cấp tool "FORBIDDEN: This API
  token is read-only" / "không phải thành viên" bị coi là token hỏng (cấp lại vẫn chỉ đọc ⇒ vòng lặp). Nay chỉ lỗi xác
  thực thật (HTTP 401/403, "Invalid API token", "token has expired").
- 🔴 **Thẻ tự bật cướp phím Enter**: đang gõ câu hỏi, thẻ "Kết nối CT Work?"/"Token hết hạn" bật lên đúng lúc ⇒ Enter của
  câu hỏi chọn luôn mục 1 (thấy thật: token bị thu hồi + tạo lại mà người dùng chưa từng thấy thẻ). Nay thẻ TỰ BẬT chờ ô
  nhập trống + tay rời phím ≥ 2,5 s (thẻ nối tiếp sau khi người dùng vừa chọn vẫn hiện ngay) — `ManChat.tsx › giaoDienCtwTuBat`.
- 🟠 **Tin chèn giữa lượt MẤT câm** khi gõ đúng lúc hook xong-lượt đang chạy (CLI đã in "↳ đã chèn") — `loop.ts` đi
  tiếp với tin đó sau hook.
- 🟠 **Chân trang mất cả cụm phải** (thư mục ⎇ nhánh · ngữ cảnh % · tiền) khi thêm "context 83%" ở 120 cột — đúng lúc cần
  xem nhất. Nay bỏ dần theo ưu tiên: thư mục → hạn mức → tiền → ngữ cảnh.
- 🟠 "Bắt đầu làm thẻ" khi ĐANG ở nhánh của thẻ (`LF-18-erd`) đề nghị tạo nhánh thứ hai `LF-18-thiet-ke-…` và chuyển
  "In Progress → In Progress". Nay: dùng nhánh hiện tại / nhánh `LF-18-*` có sẵn; thẻ đã đang làm ⇒ không chuyển.
- 🟠 `/issue ABC-1` khi thư mục gắn LF gửi `project: "LF"` ⇒ máy chủ thật báo "ABC-1 is not in project LF". Nay hỏi đúng dự
  án của thẻ (đọc + ghi).
- 🟠 Lỗi CT Work in thô `⚠ LỖI khi gọi sprint_current: HTTP 401: {"error":…}` (tiếng Việt ở English, không nói cách sửa)
  ⇒ `ctworkHe.ts › chuLoiCtw`: token hỏng ⇒ "/ctwork renew", mạng ⇒ "không kết nối được CT Work".
- 🟠 `/mcp`: server bắt tay hết giờ / nói sai giao thức hiện "khac: đã tắt" (nghe như người dùng tự tắt) — `mcp.ts` ghi đè
  lý do bằng `dong()` trước khi đọc; nay giữ lỗi thật. Lỗi lõi tiếng Việt của server MCP dịch ở English (`dichLoiMcp`).
- 🟠 Phím dồn trên thẻ: CLI bận vẽ ⇒ terminal giao "\r\r"/"1\r" một lần đọc ⇒ thẻ bỏ qua cả hai (bấm "không ăn"). Nay lấy
  phím đầu, bỏ phần thừa (không để Enter thứ hai duyệt luôn thẻ kế tiếp) — `banPhim.ts › tachPhimDon`.
- 🟠 **Bấm ĐÚP trên thẻ duyệt duyệt mù thẻ kế tiếp**: hai lệnh cần duyệt liên tiếp, "1" "1" cách 150 ms ⇒ lệnh thứ hai chạy
  khi người dùng chưa kịp thấy nó. Nay thẻ vừa hiện < 350 ms chỉ nhận Esc/↑↓ (`ManChat.tsx › theDuyetHien`).
- 🟡 Rào `<ctwork-content untrusted>` của tóm tắt đính kèm: chữ người viết có `</ctwork-content>` thoát được khỏi rào nếu
  máy chủ (cũ/khác) không tự vô hiệu — nay app tự vô hiệu như `untrusted()` của máy chủ.
- 🟡 `/help` gọn cụt câu ("/sprint  The running", "/quyen  View, add a prefix"), `/terminal-setup` lệch cột; "17 tool",
  "/ctwork ket-noi" ở English; "Báo cáo tuần ." thừa dấu cách; chọn dự án không có "0. Thoát"; "Hẹn(′ sai)" khi hẹn theo
  cron (nay `cron 0 9 * * 1-5 …`); "Để sau (`/hen`)" lộ dấu `; ô nhập đang chạy ghi "Enter để xếp hàng" (từ đợt 4 là CHÈN),
  `/help all` cũng vậy; "Đang chạy bù 1 hẹn." rồi không thấy gì (nay nói xem kết quả ở /resume — CLI không vẽ cuộc nền);
  `/mcp` nạp lại / bật-tắt không làm mới dòng CT Work (đứng "chưa nối" tới 60 s); câu "token cất trong kho bí mật của máy"
  không đúng ở CLI (file 0600).
- 🟡 VS Code: đổi chế độ khi đang chạy ném "Việc này đang chạy dở — hãy dừng trước khi đổi chế độ" ⇒ nay HOÃN tới cuối
  lượt như CLI.

**Lỗi C ("⚠ đang chạy dở — đổi chế độ" lạc chỗ) — nguyên nhân:** đi hết các đường gọi `agent:datCheDoQuyen` (CLI: chỉ
`doiCheDo` từ shift+tab / menu chế độ / thẻ "Bỏ qua hết"; desktop: nút chế độ bị khoá khi chạy, `/init`, duyệt kế hoạch;
VS Code: menu chế độ) và mọi chỗ `S.dangChay` của CLI tắt sớm hơn lõi (`xong`/`loi`/`huy` đều phát TRƯỚC `finally`
đồng bộ; các `loi` không kết thúc lượt — TU_GO_ANH, DOI_CONG, CONG_CHINH_HONG_FREE — đã ở `LOI_THONG_BAO`). Đường duy nhất
ra đúng câu đó là **shift+tab trong lúc lượt còn chạy** (thói quen "Yes, don't ask again" của Claude Code trên thẻ duyệt,
rơi xuống phím toàn cục khi thẻ vừa đóng, lượt vẫn chạy tiếp). Ba lớp của đợt 4 chặn đúng đường đó — kiểm trong PTY:
duyệt 1 + shift+tab 0,3 s ⇒ bỏ qua; 1,2 s ⇒ "Sẽ đổi sang … khi lượt này xong" rồi đổi đúng lúc xong; Enter đúp, số đúp
(+ shift+tab), `y` (thẻ bỏ qua), Esc quanh thẻ ⇒ không cảnh báo. VS Code có cùng lỗi qua menu chế độ ⇒ đã thêm hoãn.

**Test thêm:** CLI `src/test/qa5c.test.ts` (help gọn, dịch lỗi MCP, phím dồn) + `src/test/qa5cPty.test.ts` (PTY + lõi
thật + máy chủ giả có phân quyền: thẻ tự bật không cướp Enter, token chỉ đọc ⇒ thẻ nâng quyền + không gọi tool ghi + không
báo nhầm "hết hạn", chân trang giữ context %/tiền, bấm đúp không duyệt mù thẻ thứ hai); desktop `src/main/agent/qa5c.test.ts` (tin chèn lúc hook, LOI_XAC_THUC,
chỉ đọc ⇒ không gọi tool, bắt đầu thẻ trên nhánh của nó, thẻ dự án khác, chữ lỗi, rào untrusted, dòng hẹn cron); máy chủ
`src/services/agent/qa5c.test.ts` (chạy THẬT `runAgentTurn` với cổng giả: HÔM NAY + DỰ ÁN CT WORK ở cuối, hai lượt cùng ngày
⇒ system + tools giống hệt byte, LUAT_CTWORK chỉ khi có tool CT Work, phần trước HÔM NAY không phụ thuộc dự án).
`dot5.test.ts` "bắt đầu làm thẻ" sửa theo: thẻ To Do mới chuyển trạng thái.

**Còn lại (chưa sửa, ghi để biết):**
- Kết nối CT Work / bật-tắt server trong `/mcp` chờ NẠP LẠI CẢ BỘ — một server MCP người dùng tự khai nhận kết nối mà
  không trả lời (không phải từ chối) làm "Connecting CT Work…" treo tới hết hạn bắt tay (~30–45 s). Cần nạp lại TỪNG
  server (đụng trạng thái chung của `mcp.ts`) — để đợt sau.
- Tin chèn giữa lượt rồi bấm Esc (hoặc lượt lỗi) ⇒ tin đó mất (không trả về ô nhập như Claude Code) — cần thêm trường vào
  sự kiện `huy`/`loi` ở cả ba giao diện.
- Thẻ duyệt "3. Không, và bảo CuongMini làm khác đi (esc)" — lõi gửi từ chối cho model và lượt ĐI TIẾP (người dùng gõ thêm
  thì chèn ↳); Claude Code dừng lượt chờ người dùng. Nhãn hứa hơn hành vi.
- "Bắt đầu làm thẻ" khi đang ở nhánh của thẻ KHÁC: nhánh mới tách từ nhánh hiện tại (mang theo commit của thẻ kia), không
  từ `main`.
- Thẻ `/ctwork` ở cửa sổ 60×20 cao hơn màn hình 1 dòng (mất viền dưới + chân trang); thẻ `/issue` đã tự cắt "+N dòng".
- VS Code coi `RAMBO_SONG_LAI` (sau lượt) là lỗi — danh sách mã thông báo của webview thiếu mã này (CLI có).
- `/cost` "Số bước đã đi: 0" khi máy chủ không gửi `buoc` (máy chủ giả) — chưa kiểm với máy chủ thật.
