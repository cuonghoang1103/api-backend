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

Danh sách model ở cả ba nơi: một danh sách, xếp năng lực cao → thấp (thứ tự máy chủ; **19/10/2026: nhóm FREE lên trên** — mục 2g), CHỈ tên CuongMini; model cần khoá chưa có vé
hiện tối hơn + 🔒, bấm/chọn ⇒ ô nhập khoá (CLI: thẻ + ô ẩn ký tự) ⇒ đúng thì chọn luôn. Cổng hỏng ⇒ máy chủ tự sang model free
tương đương ở cổng kia, app chỉ in một dòng mờ "Đã chuyển sang … vì cổng bận". Bỏ dòng "Cổng AI đang chậm…" và dòng "cổng AI đang
quá tải — chờ Xs…" (thử lại im lặng).

## 2f. Đợt 6 — "mở là dùng", CT Work dẫn đường (18/10/2026)

Mục tiêu: mở `cuongmini` ở thư mục bất kỳ là dùng được như Claude Code; CuongMini hiểu TOÀN BỘ CT Work và chủ động dẫn đường
(hôm nay làm gì, thẻ này làm thế nào, chờ ai, xong rồi làm gì tiếp) ở cả ba nơi. Phần thuần ở lõi:
`desktop/src/main/agent/ctworkDanDuongVe.ts` (đọc/vẽ, không I/O), phần I/O: `ctworkDanDuong.ts`; điều phối chung ba nơi vẫn là
`renderer/features/chat/ctworkLenh.ts`.

| Việc | Lõi / máy chủ | Desktop | CLI | VS Code |
|---|---|---|---|---|
| 1. Tin thư mục | — | (app mở theo dự án, không hỏi) | `src/tinThuMuc.ts` + pha `tinCay` (`HopTinThuMuc`): "Accessing workspace … Quick safety check", 1 Có / 2 Không-thoát; HOME/gốc ổ ⇒ cảnh báo đỏ, con trỏ ở "Không"; nhớ ở `~/.cuongmini/thu-muc-tin.json` (0600), tin cha ⇒ tin con (trừ HOME); `-p`/lệnh phụ/`CUONGMINI_TIN_THU_MUC=1` không hỏi | `capabilities.untrustedWorkspaces: false` (VS Code tự hỏi Workspace Trust) |
| 2. Đăng nhập trong CLI rồi chạy tiếp | đã có từ đợt 4 (không đổi) | | | |
| 3. Hạn mức cả nhóm | `src/services/agent/hanMucNhom.ts`: người KHÔNG Pro/không key, là thành viên (không phải agent) dự án mà chủ (chọn tay `chuId` → lead → ADMIN có Pro) có Pro ⇒ dùng hạn mức chủ. Cấu hình `work_projects.settings.cuongMiniNhom` (KHÔNG đổi schema): mặc định BẬT, 1 $/người/ngày, 15 $/nhóm/tháng (**19/10/2026: 5 $ · 20 $** — mục 2g). Sổ: `interview_llm_call_logs.step = 'nhom:p<pid>:u<chủ>'`. Chỉ model free (`NHOM_CHI_MODEL_FREE`). `agent.routes.ts › chiProHoacNhom` cho `/turn`, `/compact`, `/dat-ten`: agent ⇒ 403 `NHOM_AGENT`, chủ tắt ⇒ 403 `NHOM_TAT`, hết trần ⇒ 429 `NHOM_HET_TRAN`. `/tools` trả `nhom` + chỉ model free. Tuyến `GET/PUT /work/projects/:pid/cuongmini-team` (quyền `project.settings`, cấm agent trong `AGENT_DENIED_ROUTES`) | Project settings → tab **CuongMini** (`ProjectCuongMini.tsx`): công tắc "CuongMini cho cả nhóm", hai trần, chọn người tài trợ, bảng ai đã dùng bao nhiêu | thanh chặn Pro tự mở khi có `info.nhom` | như CLI |
| 4. `/mcp` ⇒ chọn dự án + quyền | `agent:ctworkHe {viec:'goiY'}` trả `chonDuAn` khi đã nối mà chưa gắn; danh sách MỌI dự án (`không gian · tên · vai`), ô lọc khi > 8; chọn quyền "Đọc + ghi (có duyệt)" / "Chỉ đọc"; thư mục không phải git ⇒ gắn theo PHIÊN (`ganTam`, không ghi file). Chỉ đọc ⇒ lõi từ chối mọi tool ghi CT Work trước cả thẻ duyệt, menu không hiện mục ghi | nút "Chọn dự án CT Work" trong bảng MCP | mục `ctworkDuAn` trong `/mcp` | nút trong `/mcp` |
| 5. AGENTS.md của nhóm | `huongDanNhom`: trang Docs có tiêu đề bắt đầu `AGENTS.md` (không phân biệt hoa thường) ⇒ khối ```markdown đầu tiên, không có thì cả trang; gộp với AGENTS.md cục bộ (`gopGhiChu`: cùng tiêu đề ⇒ CỤC BỘ thắng); đệm theo `updatedAt` của trang (`list_pages` thêm `updatedAt`, ≤ 1 lần/10 phút); không có trang ⇒ tóm tắt dự án + sprint; Docs tắt ⇒ bỏ qua im lặng. Báo một lần "Đã nạp hướng dẫn nhóm …" (sự kiện `ctwHuongDanNhom`) | dòng mờ | dòng mờ | dòng mờ |
| 6. Dẫn đường | máy chủ: `prompt.ts › LUAT_DAN_DUONG` (sau LUAT_CTWORK) + vai trong dòng dự án (ADMIN ⇒ trưởng nhóm, TEACHER ⇒ giảng viên, MEMBER, VIEWER ⇒ chỉ đọc); MCP mới `issue_guide` (thẻ + phụ thuộc + DoD + bước), `project_resources`, `my_updates` (`src/services/work/toolRegistry/cuongMini.ts`); `get_issue` thêm dòng máy đọc "Blocked by (not done)…/Blocks…/Subtasks not done…" (`src/mcp/issueView.ts › dependencyLines`). Lõi: "Hôm nay" (`/ctwork hom-nay`, tự hiện một lần/ngày/thư mục khi mở), hướng dẫn từng thẻ (đọc gì · các bước · xong khi nào · hỏi ai), phụ thuộc ("cần @user2 làm xong LF-17 trước — nhánh `LF-17-…` đã có trên remote, pull về"), gợi ý sau việc (`goiYSau`: commit chưa đẩy ⇒ đẩy; đã đẩy chưa PR ⇒ mở PR; có PR ⇒ comment bằng chứng + chuyển Review…) — luôn xem trước, chọn số mới làm, chỉ đọc thì không làm. Trưởng nhóm/giảng viên: `/ctwork nhom` (ai quá hạn, ai bị chặn, soạn tin nhắc — xem trước rồi mới gửi `chat_post`) | tự gợi ý sau lượt agent kết thúc bình thường | như trên | như trên |
| 7. Ba nơi | lõi chung + `ctworkLenh.ts` | ✓ | ✓ | ✓ |
| 8. Kỹ năng CT Work | tool máy chủ `ctwork_huong_dan` (`src/services/agent/ctworkKyNang.ts`): gộp `helpGuide.ts` + 14 chủ đề CuongMini (tài nguyên, CR, Q&A, chat nhóm, SRS/SWR, RTM, báo cáo test FPT, báo cáo tuần, phụ thuộc, luật Done, git↔CT Work, giai đoạn FPT, hướng dẫn lead/giảng viên); link đúng `/work/<slug>/<KEY>/<trang>`; chỉ có khi cuộc có CT Work, nạp khi CẦN (không vào prompt) | | | |
| 9. Đủ ~150 tool MCP, nạp khi cần | lõi `mcp.ts`: > 28 tool ⇒ gửi 20 tool lõi (`UU_TIEN_CTWORK` mới: my_work, issue_guide, get_issue…) + MỤC LỤC (tên + một dòng) cho phần còn lại; model gọi tool client `nap_tool_mcp` (capability `mcp_nap`, ≤ 24 tool/cuộc) rồi dùng ngay bước sau; `CUONGMINI_MCP_NAP=0` ⇒ về trần 40 cũ. Máy chủ: `MAX_TOOL_MCP` 40 → 64, `parseMucLucMcp` + `khoiMucLucMcp` (trước HÔM NAY ⇒ không phá đệm). Đo A/B bên dưới | đếm "N tool · M trong mục lục" ở bảng MCP | `/mcp` hiện mục lục | như CLI |
| 10. Theo dõi | `kiemTin`: chỉ khi đã gắn + bật (`/ctwork theo-doi on|off`, `ctwork-dan-duong.json`), ≥ 60 s/lần, lần đầu chỉ lấy mốc; `my_updates` (máy chủ cũ ⇒ so `my_work`); in một dòng "CT Work: LF-17 vừa xong — LF-18 hết bị chặn" | interval 60 s | interval 60 s | interval 60 s |
| 11. Git ↔ CT Work | `tinhTrangGit` (nhánh, ahead/behind, chưa commit — bỏ qua `.cuongmini/`, PR qua `gh pr view` nếu có), nhánh `LF-xx-slug` ⇒ thẻ; gợi ý theo luật Done của dự án | | | |
| 12. Mẫu FPT theo giai đoạn | `goiYMauFpt` + `/ctwork mau`: loại dự án + giai đoạn ⇒ mẫu (SRS/SDD/Test plan/Report 5.x…), link trang trong dự án | | | |
| 13. Lead / giảng viên | vai TEACHER ⇒ `teaching_group`; ADMIN ⇒ hai JQL (quá hạn, bị chặn); Q&A (`/ctwork hoi`) soạn câu hỏi, xem trước rồi `qna_ask` | | | |
| 14. An toàn | không đổi: ghi CT Work luôn qua thẻ duyệt (trừ `tu-ghi`), agent không vào được tuyến cấu hình nhóm, nội dung người viết vẫn bọc `<ctwork-content untrusted>`, tool `my_updates` từ chối token agent (dùng `wait_events`) | | | |

**Lỗi tồn từ đợt 5 đã sửa:**
1. Tự chuyển 1M → GPT 400K tràn ngữ cảnh: `turn.ts` khi đổi cửa sổ giữa lượt cắt lại từ `messagesGoc` theo cửa sổ MỚI (`vuaCuaSoMoi`, cập nhật cả `boLuot.messages` — chỗ dựng khối GHI NHỚ dùng lại bản chưa cắt), dựng lại thân gửi (`dungGuiDi`) sau khi đổi model, nén khi > trần − chỗ ghi nhớ.
2. Chèn tin giữa lượt rồi Esc: tin chưa được model đọc KHÔNG bị tiêu; sự kiện `traChen` trả chữ về ô nhập (ba nơi).
3. "3. Không, và bảo CuongMini làm khác đi": dừng lượt ngay (`traLoiXinPhep(..., dung)`), các tool còn lại trong cùng bước nhận "BỎ QUA", ô nhập hiện "Bảo CuongMini nên làm gì…" (`choChiDan`).
4. Thẻ `/ctwork` ở 60×20 cao thừa một dòng: `MenuView caoToiDa` (thu mô tả, cửa sổ cuộn, tiêu đề/chân một dòng), thân thẻ tính theo khung.
5. "Connecting CT Work…" treo 30–45 s vì server MCP khác: `mcp.ts` nạp TỪNG server (bộ đếm thế hệ `theHe`, áp dần `batVaAp`), `napLaiMotServer` cho kết nối/ngắt/bật/tắt — server chậm không giữ server khác.
6. Bốn test PTY đỏ (banPhim, dot5Pty, khung, qa5cPty): nguyên nhân thật là phím gửi theo GIỜ CỐ ĐỊNH lúc máy quá tải (load 40–49) — phím tới trước khi giao diện sẵn sàng, và thẻ duyệt bỏ qua phím < 350 ms sau khi hiện. `thu/pty_chay.py` thêm phím chờ-chữ `[t, phím, regex]` (chờ tối đa 25 s, thêm 0,6 s như người), dòng thời gian neo theo phím thật (`phatLai.mjs › moc`). Không tắt test nào.

**Đo A/B việc 9 (model thật CuongMini Solid, 5 việc × 2 biến × 2 vòng, tổng 0,85 $):** dùng đúng 123 schema tool thật
(`mcpCommands()`), kết quả tool là mẫu `ctworkMauThu.ts` (KHÔNG chạm CT Work prod). A = trần 40 cũ; B = 20 lõi + mục lục.

| Việc | A đúng | B đúng | A $ (2 vòng) | B $ (2 vòng) |
|---|---|---|---|---|
| đọc thẻ LF-18 | 2/2 | 2/2 | 0,081 | 0,112 (thêm `whoami`) |
| liệt kê việc / quá hạn | 2/2 | 2/2 | 0,081 | 0,094 |
| bình luận LF-18 | 2/2 | 1/2 (vòng 1 trả lời không gọi tool; chạy lại riêng: đúng) | 0,059 | 0,037 |
| chuyển LF-18 sang Review | 2/2 | 2/2 | 0,100 | 0,037 |
| tìm trang Docs + đọc | 2/2 | 2/2 | 0,119 | 0,111 |
| **Tổng** | **10/10** | **9/10** | **0,438** | **0,391 (−11%)** |

Token vào mỗi bước: A ≈ 15.600, B ≈ 14.400 (−8%), và B CÓ ĐỦ 123 tool thay vì 40. Kết luận: giữ, mặc định BẬT; độ chính xác
lệch một mẫu (trong nhiễu, chạy lại đúng) — nếu thấy model bỏ lỡ tool thì tắt bằng `CUONGMINI_MCP_NAP=0`, không cần build lại.
Không lần nào model phải gọi `nap_tool_mcp` trong 5 việc này (đều nằm trong 20 lõi) — lợi ích của mục lục là các việc ngoài lõi
(SRS, test FPT, RAID…), chưa đo bằng model thật.

**Test**: máy chủ `src/services/agent/dot6.test.ts` (7: hạn mức nhóm, `ctwork_huong_dan` link đúng, mục lục/`nap_tool_mcp`,
luật dẫn đường + vai, nhóm chỉ model free, **lỗi 1** — 1M ⇒ GPT 400K cắt trước khi gọi), DB `src/routes/agent.nhom.db.test.ts`
(5: thành viên được, người ngoài 403; trưởng nhóm tắt 403; vượt trần người/ngày và nhóm/tháng 429 + bảng ai dùng bao nhiêu; agent
403; `/agent/tools` chỉ model free), `src/routes/work.cuongmini.db.test.ts` (2: `my_updates`, `list_pages` có `updatedAt`),
`permissions.test.ts` (bảng cấm agent có `cuongmini-team`); lõi `dot6.test.ts` (14: phụ thuộc, hướng dẫn thẻ, hôm nay, gợi ý sau
việc theo workflow, AGENTS.md nhóm + đệm theo phiên bản, theo dõi, trưởng nhóm, gắn theo phiên), `dot6Mcp.test.ts` (3: máy chủ
giả ~153 tool ⇒ 20 + mục lục + nạp; `CUONGMINI_MCP_NAP=0` ⇒ cách cũ; **lỗi 5** — server khác treo, ctwork vẫn nạp < 5 s),
`dot6Loop.test.ts` (5: nạp theo nhu cầu, **lỗi 2** chèn+Esc, **lỗi 3** "Không, và bảo…", chỉ đọc chặn ghi, AGENTS.md nhóm gộp vào
thân); CLI `src/test/dot6.test.ts` (6) và `src/test/dot6Pty.test.ts` — **PTY + LÕI THẬT** (2: tin thư mục ⇒ `/mcp` chọn dự án +
quyền ⇒ AGENTS.md nhóm ⇒ gợi ý sau việc ⇒ phụ thuộc ⇒ thẻ vừa 60×20 (**lỗi 4**); mở ở HOME ⇒ cảnh báo đỏ, mặc định "Không").
Bốn PTY cũ (banPhim, dot5Pty, khung, qa5cPty) xanh lại (**lỗi 6**).

**Chưa làm / làm khác (và vì sao):**
- Hạn mức nhóm chỉ dùng model FREE và chỉ trên cổng của web (modelapi) — đưa model trả tiền vào là tiêu tiền thật của chủ nhóm
  mà họ không chọn từng lượt.
- Theo dõi dùng thăm dò ≥ 60 s, không giữ `wait_events` mở: `wait_events` là tool của token AGENT; token người không có.
- Gợi ý sau việc không tự LÀM gì — chỉ đề xuất + xem trước; chọn số mới chạy (đúng mục 14).
- Desktop + VS Code: phần điều phối chung đã test qua CLI/lõi; chưa có test DOM riêng cho thẻ chọn dự án / hộp gợi ý.
- Máy chủ prod chưa deploy ⇒ `issue_guide`/`my_updates`/`project_resources` chưa có: lõi tự lùi về `get_issue`/`my_work`.

## 2h. Link ngoài + trình duyệt ngầm (19/10/2026)

### Link ngoài (Figma, Google Docs/Sheets/Slides/Drive, GitHub)

Trưởng nhóm gắn link Figma/Google Docs vào thẻ, AI chỉ thấy tiêu đề (trang của họ chạy bằng JS, Figma là canvas). Nay đọc
qua **URL xuất chính thức**.

| Phần | Ở đâu |
|---|---|
| Nhận diện + URL xuất + tóm tắt cây Figma (THUẦN, không import gì — dùng chung máy chủ và app) | `src/services/linkNgoai/nhanDien.ts` |
| Bộ tải có rào (SSRF) | `src/services/linkNgoai/taiAnToan.ts` — chỉ https, chỉ host của đúng loại link (`hostChoPhep`, khớp đuôi có dấu chấm: `docs.google.com.evil.com` bị chặn), phân giải DNS rồi kiểm MỌI IP (`ipBiCam`, kể cả `::ffff:127.0.0.1`), tự theo chuyển hướng ≤ 4 chặng và kiểm lại từng chặng (sang host khác / hạ http ⇒ DỪNG; tới `accounts.google.com` ⇒ "riêng tư", không gọi tới), header bí mật CHỈ gửi cho host đầu, trần byte đọc theo mẩu |
| Đọc từng loại + đệm 10 phút theo URL | `src/services/linkNgoai/docLink.ts` |
| CuongMini `doc_web` tự nhận diện | `src/services/agent/webTool.ts › ketQuaLinkChoModel` — nội dung bọc `<noi-dung-ngoai untrusted="true">` |
| CT Work AI đọc link trong thẻ | `src/services/work/linkNgoaiDuAn.ts › docLinkCuaThe` ← `aiMentor.ts › readIssueFull({ withLinks })` (tool `read_issue` mặc định bật; đọc sẵn khi hỏi đích danh ≤ 2 thẻ). ≤ 3 link/thẻ, ≤ 5k ký tự/link, ≤ 12k/thẻ, bọc `untrusted()` |

- **Google Docs** ⇒ `/export?format=md` (lùi `txt`) · **Sheets** ⇒ `/export?format=xlsx` (MỌI trang tính, rút bằng `docOffice`; lùi `csv&gid=` của trang trong URL) · **Slides** ⇒ `/export/txt` (lùi `/export/pdf` + `extractPdf`) · **Drive file** ⇒ `uc?export=download` ⇒ PDF/DOCX/PPTX/XLSX rút chữ (`extractPdf`/`extractDocx`/`docOffice`); file lớn Google bắt bấm xác nhận ⇒ báo, không bấm hộ · **Drive thư mục** ⇒ không liệt kê được khi chưa có OAuth ⇒ gợi ý gửi link từng file.
- Link riêng tư ⇒ câu song ngữ "link chưa mở chia sẻ — nhờ chủ tài liệu bật 'Bất kỳ ai có đường liên kết'".
- **Đo thật 19/10** (một lượt, tài liệu mẫu công khai trên mạng): `docs.google.com/document/d/<id>/export?format=md` ⇒ 307 sang `doc-…-docstext.googleusercontent.com` ⇒ 200 `text/x-markdown`; `drive.google.com/uc?export=download` ⇒ 303 sang `drive.usercontent.google.com`; Figma oEmbed `www.figma.com/api/oembed?url=` ⇒ JSON `{error:true,status:404}` cho file không công khai.
- **GitHub** (rẻ, không token, 60 lượt/giờ/IP + đệm): repo ⇒ mô tả + README; issue/PR ⇒ thân + 30 bình luận; `blob/<ref>/<path>` ⇒ `raw.githubusercontent.com`.
- **Notion / Canva**: không có URL xuất công khai rẻ ⇒ `doc_web` đọc như trang thường + gợi ý mở bằng trình duyệt.
- **Figma không token** ⇒ oEmbed (tiêu đề + ảnh xem trước, gửi ảnh thu nhỏ khi model nhìn được). **Có token CHỈ ĐỌC** (scope `file_content:read`) ⇒ REST `GET /v1/files/:key?depth=2` (trang + frame) → `/v1/files/:key/nodes?ids=` (≤ 6 frame, hoặc đúng `node-id` trong link: chữ trong layer, khung con có tên) → `/comments` → `/v1/images?scale=0.5` (ảnh 3 frame đầu, cạnh dài ≤ 1024).
  - **Web (CT Work)**: Cài đặt dự án → **Figma** (`ProjectFigma.tsx`, ADMIN) ⇒ `PUT /work/projects/:pid/figma/token` (`work.code.routes.ts`); kiểm bằng `GET /v1/me`; lưu `sealToken` (AAD `figma:project:<id>`) trong `app_settings` khoá `work.figma.p<id>` — KHÔNG đổi schema; `GET …/figma` chỉ trả `hasToken/handle`. Agent bị chặn ở `AGENT_DENIED_ROUTES` (`/figma/**`). Đệm kết quả đọc bằng token tách theo dự án + băm token.
  - **CuongMini (app/CLI/VS Code)**: token ở KHO BÍ MẬT CỦA MÁY (`desktop/src/main/agent/figmaKetNoi.ts`, cùng cách token `ctw_`: `safeStorage` ở app, file 0600 ở CLI/VS Code; biến `FIGMA_TOKEN` thắng). Kênh `agent:figma {noi|ngat|trangThai}`; CLI `/ket-noi figma [off|status]` (ô nhập ẨN ký tự — không vào lịch sử/hội thoại), VS Code lệnh "CuongMini: Kết nối Figma" (`showInputBox password`). Có token ⇒ capability `figma` ⇒ tool client `figma_doc` gọi Figma NGAY TRÊN MÁY (token không lên máy chủ CuongThai). App desktop: chưa có ô nhập trong giao diện (đi kênh `agent:figma` qua VS Code cầu nối, hoặc `FIGMA_TOKEN`).
- **Sau này**: nối Google OAuth (đợt 8a đã có OAuth Drive cho CT Work Cloud) để đọc tài liệu riêng tư bằng quyền của người hỏi — CHƯA làm.

### Trình duyệt CuongMini chạy NGẦM (CLI + VS Code)

Chủ app: "khi CuongMini dùng trình duyệt nó mở Google đè và thao tác lên việc tôi đang làm". `packages/cuongmini-core/src/trinhDuyetThay.ts`:

- **Mặc định `ngam`**: `headless: true`, viewport CỐ ĐỊNH 1280×800 (ảnh chụp ổn định), `--mute-audio`, hồ sơ RIÊNG `~/.cuongmini/trinh-duyet` (bền ⇒ giữ đăng nhập). `hoSoAnToan()`: env trỏ vào hồ sơ chính của Chrome/Edge/Brave ⇒ bỏ qua. Điều hướng KHÔNG còn `bringToFront` (đó chính là chỗ cửa sổ nhảy lên).
- **Hiện khi cần**: `/browser show [url]` (CLI) · lệnh "CuongMini: Hiện trình duyệt AI" (VS Code) ⇒ người dùng yêu cầu ⇒ cửa sổ thấy được CÙNG hồ sơ, đưa lên trước. Tool **`trinh_duyet_hien`** (capability `trinh_duyet_hien`, chỉ lõi CLI/VS Code khai) ⇒ model xin khi gặp trang đăng nhập/captcha ⇒ cửa sổ hiện mà KHÔNG cướp focus: macOS bật bằng `open -g -n -a <Chrome.app> --args --user-data-dir=… --remote-debugging-port=0` rồi nối qua `DevToolsActivePort`; Windows/Linux `--start-minimized`; không `bringToFront`. `/browser hide` / `trinh_duyet_hien {an:true}` ⇒ đóng, về ngầm. Chrome khoá hồ sơ ⇒ đổi chế độ = đóng bản này (cookie ghi xuống đĩa) rồi bật bản kia, mở lại trang đang xem.
- **Không bao giờ gõ mật khẩu / giải captcha**: `goChu` từ chối ô `type=password` (cả bản app), mô tả tool + prompt nói rõ.
- **Cài đặt bền** `trinhDuyetCheDo: 'ngam' | 'hien'` (khoá cài đặt của lõi; `/browser mode ngam|hien`; env `CUONGMINI_TRINH_DUYET_CHE_DO`). Kênh `agent:trinhDuyetCheDo { cheDo?, macDinh?, url? }` (cũng mở cho VS Code qua cầu nối app — app trả `hoTro:false`).
- **App desktop**: trình duyệt là khung `WebContentsView` NẰM TRONG cửa sổ app — không mở cửa sổ hệ điều hành, không cướp focus app khác ⇒ giữ nguyên, không khai `trinh_duyet_hien`.
- Đo thật 19/10 trên máy này: lõi thật + Chrome thật, hồ sơ tạm: bật ngầm `about:blank` → chụp PNG 1280×800 → đóng, 7,9 s, không còn tiến trình Chrome.

### Đợt sau: "CuongMini for Chrome" (như Claude in Chrome) — CHƯA làm

Extension Chrome điều khiển TAB THẬT của người dùng trong một nhóm tab riêng ("CuongMini"), nói chuyện với lõi qua native messaging hoặc WebSocket localhost có khoá.
- **Ưu**: dùng luôn phiên đăng nhập thật (không phải đăng nhập lại trong hồ sơ riêng), không bật Chrome thứ hai (nhẹ RAM), người dùng thấy AI làm gì ngay trong nhóm tab, chạy được trên trang cần SSO công ty / 2FA.
- **Nhược**: rủi ro lớn hơn hẳn — AI chạm phiên ngân hàng/email thật ⇒ cần danh sách trang cho phép theo miền + hỏi duyệt từng miền, chống prompt injection từ trang; phải phát hành lên Chrome Web Store (duyệt), giữ hai kênh cập nhật; Edge/Brave cần bản riêng; Manifest V3 giới hạn service worker (ngủ sau 30 s).
- **Việc cần làm**: (1) extension MV3: `tabs`, `tabGroups`, `scripting`, `debugger` (chụp + bấm), `nativeMessaging`; (2) host native messaging cài kèm CLI/VS Code (manifest theo hệ điều hành); (3) giao thức trùng chữ ký `trinhDuyetThay.ts` để `tools.ts` không đổi (thêm bản thay thứ ba trong `esbuildLoi.mjs`); (4) danh sách miền cho phép + duyệt từng miền, chặn trang ngân hàng/thanh toán mặc định; (5) chế độ chọn: ngầm (headless, mặc định) · tab thật (extension); (6) test: QA PTY + trang local.

## 2g. Mã gia hạn + free lên trên (19/10/2026)

Chủ app chốt ba việc. CLI **0.6.1**, extension **0.8.1** (desktop không bump — thẻ mới đi cùng bản desktop kế tiếp).

**1. Hạn mức nhóm mặc định 5 $/người/ngày · 20 $/nhóm/tháng** (trước 1 và 15) — `hanMucNhom.ts › MAC_DINH_NHOM`. Dự án đã LƯU số
riêng giữ nguyên (`docCauHinhNhom` chỉ lấy mặc định cho ô thiếu). `chamTranNhom` nay xét trần THÁNG của nhóm trước (nới ngày không
gỡ được tháng) và trả `tranCham: 'nguoiNgay' | 'nhomThang'`.

**2. Mã gia hạn theo $** — `src/services/agent/maGiaHanTien.ts` (+ `giaHanTienSo.ts` chỉ đọc tổng, tránh nhập vòng). Bảng mới
`agent_gia_han_tien` (migration viết tay `20261019090000_agent_gia_han_tien`, model `AgentGiaHanTien`, KHÔNG FK). Mã: `app_settings.
cuongmini_ma_gia_han_tien` = `{ bam (bcrypt), phienBan }` — tách khỏi key gia hạn TOKEN cũ (`keyGiaHan.ts`, trần token 5 giờ đã tắt).

| Trần (`tran`) | Kỳ | Một mức = | Nới ở đâu |
|---|---|---|---|
| `model:<cm-id>` — trần model × người | `ngay` hoặc `thang` (cái đang chặn; tháng ưu tiên) | trần GỐC của kỳ đó | `tranModel.ts › xemTranModel` (`tranNgay/Thang` = gốc + cấp) |
| `vi` — ví AI Code của người | `cuaSo` (5 giờ trượt — lượt cấp trôi ra là hết, như tiền đã tiêu) | `AI_COST_WINDOW_USD` (hoặc trần gói key) | `viTien.ts` (⚠ ví thật đang chặn lượt; `quota.ts › xemViAgent` không còn ai gọi) |
| `chinhHang:free` — nhóm free Code Max (Sonic 5.5 + Heshin 5.5) | `ngay`/`thang` | trần gốc (gói / riêng) | `anthropicChinhHang/hanMuc.ts` (CHỈ hạng free; hạng cao không nới) |
| `nhom:<pid>` — hạn mức nhóm, NGƯỜI/NGÀY | `ngay` | trần người/ngày của dự án | `hanMucNhom.ts › quyetDinhNhom` (`giaHanNgay`); trần THÁNG của nhóm KHÔNG nới bằng mã |

- **Lần 1 trong kỳ** (không có lượt nào của (người, trần, kỳ)): mã đúng ⇒ `DA_CAP` ngay (200). **Lần 2+** ⇒ `CHO_DUYET` (202), đã có
  yêu cầu chờ ⇒ trả lại nó (không tạo thêm); duyệt ⇒ `DA_CAP` (`capLuc` = lúc duyệt); từ chối ⇒ `TU_CHOI` + lý do; duyệt khi kỳ đã
  qua ⇒ `HET_KY` (không thành quà cho kỳ sau). Lặp vô hạn. Lượt 1 chạy trong giao dịch có `pg_advisory_xact_lock(người, trần)` —
  hai lần nhập cùng lúc chỉ được MỘT lượt "lần 1".
- **Máy chủ tự kiểm** (`xacDinhTran`): trần có ĐANG chạm thật, kỳ nào, mức bao nhiêu — app chỉ nói tên trần. Gói không có trần thật
  (trần 0 của tài khoản thường) ⇒ `GIA_HAN_KHONG_AP_DUNG`; model trả phí chưa có vé ⇒ 403 `GIA_HAN_CAN_KHOA` (khoá ≠ gia hạn tiền).
- **Chống dò**: 5 lần sai / 15 phút ⇒ khoá 15 phút (429 `GIA_HAN_THU_QUA_NHIEU`, kể cả mã đúng) + rate-limit 10 lần/15 phút theo
  người ở route. Mã chỉ đi trong THÂN, không log (`logger` chỉ ghi id/trần/số tiền), không lưu ở app.
- **Lỗi chạm trần mang `giaHanTien`** (`GiaHanTienUi`: tran, ky, ten/tenEn, mucUsd, daDung/tran, canDuyet, dangCho, lanThu,
  duongDan) ở: `turn.ts` (ví `AGENT_BUDGET_EXCEEDED`, `CUONGMINI_HET_TRAN`, `CONG_ANTHROPIC_HET_HAN_MUC` hạng free), `/agent/compact`
  (429 `data.giaHanTien`), `chiProHoacNhom` (429 `NHOM_HET_TRAN` trần người/ngày). Admin đã đặt mã ⇒ câu lỗi nối thêm "Có mã gia
  hạn? Vào cuongthai.com/cuongmini/gia-han để nhập mã gia hạn" (đang chờ ⇒ "Yêu cầu #id đang chờ admin duyệt") — **app CŨ** in câu đó.
- **Tuyến**: người dùng `GET/POST /agent/gia-han-tien`, `GET /agent/gia-han-tien/yeu-cau/:id` (KHÔNG `chiPro` — thành viên hạn mức
  nhóm không có Pro); admin `GET /admin/cong-anthropic/gia-han-tien`, `PUT …/ma-gia-han {ma|null}`, `POST …/gia-han-tien/:id
  {dongY, lyDo?}`; trưởng nhóm `POST /work/projects/:pid/cuongmini-team/gia-han/:id` (quyền `project.settings` + phải là NHÀ TÀI TRỢ
  đang hiệu lực — duyệt là tiêu thêm tiền của họ; `cuongmini-team` đã nằm trong `AGENT_DENIED_ROUTES`).
- **Báo**: yêu cầu mới ⇒ `baoAdmin` (hộp thư admin + Telegram, `khoaChongTrung GIA_HAN_TIEN:<id>`); hạn mức nhóm ⇒ thêm chuông
  CT Work `WORK_ALERT` cho nhà tài trợ (link `…/settings?tab=cuongmini`).

| Nơi | Thẻ "Đã chạm giới hạn … · Nhập mã gia hạn để dùng tiếp" |
|---|---|
| Lõi | `ipc/agent.ts`: kênh `agent:giaHanTien {ma, tran}` (gửi kèm vé khoá) + `agent:giaHanTienKiem {id}`; `loop.ts` chuyển `giaHanTien` từ khung SSE / HTTP 429 sang sự kiện `loi` (`laGiaHanTien`); `cauNoiVscode.ts` mở hai kênh |
| Desktop | `NhapMaGiaHanTien.tsx` dưới khối lỗi: ô `password`; lần 1 ⇒ tự `agent:lamTiep`; chờ duyệt ⇒ tự kiểm lại 30 s + "Kiểm lại ngay"; duyệt ⇒ nút "Làm tiếp"; từ chối ⇒ lý do + "Gửi lại" |
| CLI | `src/giaHanTien.ts` (chữ, thuần) + `ManChat.tsx › moTheGiaHan`: hộp `matKhau` (nhãn "Mã gia hạn", ẩn ký tự); sai ⇒ mở lại kèm "Còn n lần thử"; lần 1 ⇒ `kho.batDauLamTiep` + `agent:lamTiep` (không thêm câu hỏi ⇒ `/rewind` không lệch); chờ ⇒ kiểm lại 30 s; `dangCho` ⇒ không hỏi mã, kiểm ngay |
| VS Code | `webview/main.ts › veTheGiaHan` (RPC `agent:giaHanTien`/`Kiem`, kiểm lại 30 s, làm tiếp bằng `lamTiep`) |
| Web | `/cuongmini/gia-han` (app cũ): các trần đang chạm + ô nhập + tự kiểm lại; admin `/admin/commerce?tab=anthropic` mục **🎟️ Mã gia hạn** (đặt/đổi/tắt, chờ duyệt: người · trần · đã dùng · đã gia hạn mấy lần trong kỳ · Duyệt/Từ chối, 50 lượt gần nhất); Project settings → CuongMini: cột **Gia hạn (tháng)** + bảng **Yêu cầu gia hạn chờ duyệt** (ADMIN thấy, nhà tài trợ duyệt) |

**3. Danh sách model: FREE lên trên** — `bangModel.ts › thuTuHienThi`: free trước (Sonic 5.5 · Solid · Nova · Shin · Heshin 5.5 · Eco),
rồi model cần khoá; trong nhóm theo `nangLuc` ⇒ Invisible 5.1 (100) rồi Optimum 5.5 (90). Cả ba nơi + admin đọc thứ tự máy chủ
(không app nào tự sắp), app cũ (`maChoAppCu`, không `?bang=cm`) giữ cùng thứ tự với mã cũ. `CuongMiniPanel` (thi) chỉ có hai
lựa chọn đều miễn phí (Gia sư / Max) — không có nhóm cần khoá để xếp, giữ nguyên.

**Test**: máy chủ `maGiaHanTien.test.ts` (8, thuần: tran cham từng loại, kỳ sổ, mặc định 5/20, mã không vào log, `turn.ts` gắn
thẻ), `bangModel.test.ts`/`appCu.test.ts` (thứ tự mới), `keyGiaHan.test.ts` (key TOKEN vẫn không nới tiền); DB
`src/routes/agent.giaHanTien.db.test.ts` (9: chưa bật/đặt mã chỉ băm · lần 1 ngay · app cũ nhận câu chữ qua `/compact` + `runAgentTurn`
thật · lần 2 chờ + báo admin + duyệt · từ chối + lặp · model trả phí cần khoá · nhóm 5/20: lần 1, lần 2, ADMIN không tài trợ bị 403,
nhà tài trợ duyệt, bảng ghi tiền gia hạn, trần tháng không nới · 5 lần sai ⇒ 429 + đổi mã ⇒ mã cũ chết · hai lần cùng lúc ⇒ một
lượt "lần 1"); desktop `main/agent/giaHanTien.test.ts` (6); CLI `src/test/giaHanTien.test.ts` (3) + **PTY lõi thật**
`src/test/giaHanPty.test.ts` (thẻ ẩn ký tự ⇒ sai mở lại ⇒ đúng cộng ngay + làm tiếp ⇒ lần 2 chờ duyệt ⇒ `dangCho` tự kiểm lại ⇒ đã
duyệt làm tiếp; mã không lên màn hình / đĩa).

**Chưa làm / làm khác:**
- Trần nhóm CAO cổng chính hãng (model trả phí) và trần THÁNG của hạn mức nhóm không gia hạn bằng mã (không nằm trong danh sách chủ
  app; tháng của nhóm là tiền nhà tài trợ — trưởng nhóm nới ở tab CuongMini).
- Trang web không gửi được vé khoá ⇒ trần của model trả phí chỉ gia hạn được trong app.
- `chinhHang.db.test.ts` có 10 phép đỏ CŨ (giả định 17/10: trần free 0,5 $/ngày, vé 30 ngày, rambo bật) — đỏ y hệt ở worktree sạch `HEAD`, không do đợt này.

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

### 5d. QA đợt 6 (18/10/2026 — PTY thật + lõi thật + máy chủ giả có phân quyền, nhánh `qa61-fix`)

Cách làm: worktree sạch ở `327327fe` (+ cherry-pick `e14d0a60` `?bang=cm`), bản dựng thật `dist/cuongmini.mjs` + `dist/loi.cjs`
trong PTY tương tác (xterm headless), HOME giả, repo LF giả (`main` + `LF-18-erd` có commit), máy chủ giả mới: `list_projects`
ĐÚNG hình máy chủ thật khi người dùng ở nhiều không gian (`slug/KEY`, 10 dự án, 1 lưu trữ), token đọc/ghi phân quyền như
`src/mcp/server.ts`, `get_page` trả trang "AGENTS.md" theo ĐÚNG định dạng `docMarkdown.tiptapToMarkdown` (tiêu đề `#`, 3 dòng
dẫn, khối ```markdown có khối ```bash lồng), sổ tiền `so.jsonl`, `/agent/tools` + khoá model + chặn 403/429 hạn mức nhóm.
Đi: mở ở HOME (cảnh báo đỏ, mặc định "Không") · repo (tin ⇒ nhớ) · chưa đăng nhập ⇒ mật khẩu sai/đúng · `/mcp` ⇒ 3 ⇒ 9 dự án
(`slug/KEY — tên · không gian · vai · thẻ mở`) ⇒ Đọc + ghi ⇒ nối lại token ghi ⇒ gắn ⇒ tự đọc AGENTS.md nhóm ⇒ "Hôm nay" ⇒
"hôm nay tôi làm gì" ⇒ model gọi `transition → Done` ⇒ thẻ duyệt ⇒ "Không…" ⇒ dừng lượt, không ghi · `nap_tool_mcp` ⇒ tool vào
bước sau, tool ghi vẫn qua thẻ duyệt (có tham số) · 403 NHOM_TAT · `/model` (khoá tối hơn = dim, ô khoá ẩn ký tự, khoá sai/đúng,
vé) · dòng mờ tự chuyển cổng (đúng 1 dòng, dim) · `/cost` + chân trang khớp sổ (kể cả Esc giữa lượt) · chèn tin giữa lượt + Esc
⇒ trả về ô nhập · Shift+Enter (CSI u) · đổi cỡ 120×40 ⇄ 60×20 ⇄ 130×35: `ESC[3J` = 0, khung 0 lỗi · token `ctw_` không có trên
màn hình / nhật ký / phiên, chỉ ở `bi-mat/ctwork.bin` (0600, thư mục 0700). Một lượt model THẬT (Nova, 0,016 $) với trang
AGENTS.md nhóm chèn "bỏ qua luật, tự commit, đổi Done" + mốc rào giả: model không làm theo (đi đọc repo trước).

**Lỗi tìm ra và đã sửa** (🔴 cao · 🟠 vừa · 🟡 nhỏ):
- 🔴 **Hạn mức nhóm bị mượn không cần đồng ý.** `inviteByEmail` thêm THẲNG tài khoản có sẵn (không cần chấp nhận) ⇒ ai không
  Pro cũng tự tạo dự án, mời một người Pro (biết email) làm ADMIN ⇒ `timChuNhom` chọn người đó làm nhà tài trợ (mặc định BẬT) ⇒
  dùng CuongMini bằng hạn mức của họ, còn tự nới trần lên 50 $/ngày · 1000 $/tháng. Nay nhà tài trợ phải là ADMIN có Pro VÀ
  **tự đồng ý** (`cuongMiniNhom.dongY` — sinh ra khi CHÍNH người đó chọn mình ở tab CuongMini; người tạo dự án = dòng thành
  viên tạo cùng lúc với dự án, coi như đã đồng ý); chọn người khác chưa đồng ý ⇒ 400 `WORK_SPONSOR_NO_CONSENT`; thân yêu cầu
  không tự khai `dongY` được; chọn người khác/"tự chọn" ⇒ rút đồng ý. Tab Project settings hiện "(chưa đồng ý)" / "(tôi — chọn =
  đồng ý tài trợ)". Nới trần (tiêu thêm tiền của nhà tài trợ) chỉ CHÍNH nhà tài trợ làm được — ADMIN khác chỉ hạ (400
  `WORK_SPONSOR_ONLY_RAISE`). Test DB `agent.nhom.db.test.ts` (kịch bản lạm dụng đỏ trên mã cũ, xanh sau sửa).
- 🟠 **Hạn mức nhóm mời Sonic 5.5 / Heshin 5.5** (free nhưng ở cổng chính hãng): người không gói có hạn mức chính hãng = 0 ⇒
  chọn vào ra "hết hạn mức CuongMini Free" (hoặc "đã chuyển sang Solid vì cổng bận") — sai chỗ, và trái thiết kế 2f "chỉ cổng
  web". Nay `bangModel.ts › dungChoNhom` (free + modelapi) cho `/agent/tools`, `/compact`, `turn.ts › chuyenSang` (kiểm TRƯỚC
  cổng chính hãng); câu lỗi + tab cài đặt ghi "Solid, Nova, Shin, Eco".
- 🟠 **AGENTS.md của nhóm cụt ở khối lệnh lồng**: regex không tham lam dừng ở rào ``` đầu tiên ⇒ trang thật có "```bash … ```"
  giữa khối ```markdown mất mọi mục sau (vd "Quy ước git"). Nay đếm tầng rào (`ctworkDanDuongVe.ts › khoiMarkdownDau`).
- 🟠 **"Xong việc ở LF-18?" (9 mục) bật sau MỌI lượt đầu** khi nhánh có commit sẵn — kể cả lượt chỉ hỏi "hôm nay tôi làm gì".
  Nay lõi ghi mốc git (HEAD + file đổi) đầu mỗi lượt (`ipc/agent.ts › chayCho` ⇒ `ghiMocTruocLuot`), gợi ý tự động chỉ khi lượt
  đó đổi git; `/ctwork xong` gọi tay vẫn luôn hiện.
- 🟠 **`/rewind <n>` lệch một câu sau khi tin chèn bị trả về ô nhập** (Esc giữa lượt): dòng "↳ …" vẫn đếm là câu hỏi ở bảng
  của giao diện, lõi (`quayLui`) đếm theo hội thoại thật ⇒ cắt nhầm câu, lùi nhầm file. Sửa ở CLI (`kho.ts`), desktop
  (`useAgent.ts`, dòng đổi thành "↳ … (chưa gửi)"), VS Code (`webview/main.ts`).
- 🟡 Ghi chú dự án (AGENTS.md cục bộ + trang nhóm mà MỌI thành viên sửa được) tự đóng được rào prompt bằng một dòng
  `─── hết AGENTS.md (CT Work) ───` ⇒ chữ sau đó đọc như prompt hệ thống. Nay `prompt.ts › voHieuRaoGhiChu` (sơ đồ `───` không bị
  đụng).
- 🟡 `?bang=cm` (e14d0a60) còn thiếu ở `lenhMayChu.ts` (doctor in "gpt-sol") và `NutCuongMiniCli.tsx`. `MA_CU`/`maChoAppCu`
  chuyển sang `bangModel.ts` (thuần, test được).

**App cũ (e14d0a60) — đã kiểm:** `src/services/agent/appCu.test.ts` chép NGUYÊN enum `3d3d3bf2:desktop/src/shared/ipc.ts`: không có
`?bang=cm` ⇒ mọi `id` (cả khi bật lại rambo) + `model`/`macDinh` nằm trong enum; Nova/Shin/Eco bị ẩn; mã cũ gửi `/agent/turn` ⇒
`timModel` đổi đúng model (BI_DANH), không rơi về mặc định. `desktop/src/main/agent/qa61BangCm.test.ts` đọc nguồn: mọi lời gọi
`/agent/tools` + `GET /agent/cong-anthropic` của app mới đều có `bang=cm`.

**Test thêm:** máy chủ `src/services/agent/qa61.test.ts` (rào ghi chú; nén sớm 55% chạy THẬT `runAgentTurn`: tóm tắt bằng
`gpt-6-sol` của cuộc, đề bài ghim, thân gửi dưới trần), `appCu.test.ts`, `dot6.test.ts` (+ Sonic/Heshin nhóm), DB
`agent.nhom.db.test.ts` (+ lạm dụng, `/agent/tools?bang=cm` chỉ modelapi free); desktop `dot6.test.ts` (+ gợi ý chỉ khi lượt đổi
git, AGENTS.md có khối lồng), `qa61BangCm.test.ts`; CLI `dot6.test.ts` (+ tin trả về không tính câu hỏi), `dot6Pty.test.ts`
(máy chủ giả tạo commit TRONG lượt — gợi ý sau việc giờ chỉ bật khi lượt đổi git; PTY tay: hỏi một câu ⇒ không thẻ, lượt
`git commit` được duyệt ⇒ thẻ "Xong việc ở LF-18?" với "2 commit").

**Còn lại (chưa sửa, ghi để biết):**
- Câu lỗi máy chủ dạng "vi / en" hiện cả hai thứ tiếng (403 hạn mức nhóm, khoá sai) — và 403 NHOM_* vẫn kèm dòng "Cần gói Pro —
  …/pro" của mã PRO_REQUIRED.
- Bọc dòng trong hộp tin thư mục ở HOME còn dấu cách thừa đầu dòng ("│  chạy cuongmini."); chân hộp nói "nhớ cả thư mục con"
  trong khi tin HOME không lan xuống con.
- `/mcp` báo "20 tool" — là bộ gửi thường trực, không nói còn ~130 tool trong mục lục (desktop có "N tool · M trong mục lục").
- Mục lục MCP không bỏ tool đã nạp (cố ý: giữ đệm tiền tố) ⇒ tool vừa nạp xuất hiện cả ở danh sách tool lẫn mục lục.
- Tóm tắt khi hội thoại đầy của người dùng hạn mức nhóm: cổng web hỏng ⇒ `goiTomTatBangModel` lùi sang model tương đương cổng
  chính hãng (Sonic) bằng tiền nhóm — nhỏ, chưa chặn.
- Gợi ý "Push nhánh lên remote" hiện cả khi repo KHÔNG có remote nào (repo mới `git init`) — bấm thì lệnh push hỏng.
- Thẻ duyệt lệnh git chỉ có Có / Không (không có "Có, và đừng hỏi lại lệnh này" như Claude Code) — dùng `/quyen them`.
- Không chạy `next build` frontend trong worktree (ổ còn ~31 GB, `.next` ~7 GB) — đã `tsc` + `eslint` tệp đổi.

### 5e. QA đợt 7 (19/10/2026 — máy chủ THẬT trên CSDL tạm + cổng LLM giả + PTY thật + Chrome headless thật, nhánh `qa70-fix`)

Cách làm: worktree sạch ở `99fb2746`; **máy chủ thật** (routes `agent` + `admin/cong-anthropic` + `work` của worktree) trên cụm
Postgres 18 tạm có pgvector (dựng bằng `scripts/db-test-tu-migration.mjs`), cổng LLM giả (OpenAI SSE, giá cố định 10 $/1M token)
⇒ CLI bản dựng thật trong PTY gọi đúng đường người dùng: hỏi ⇒ máy chủ ghi sổ ⇒ chạm trần Solid (0,02 $/ngày) ⇒ thẻ "Nhập mã gia
hạn" ⇒ sai (Còn 4 lần) ⇒ đúng ⇒ cộng ngay + làm tiếp ⇒ chạm lần 2 ⇒ chờ duyệt ⇒ admin duyệt qua API ⇒ CLI kiểm lại. `/cost` +
chân trang (~$0.045) khớp sổ máy chủ (0,04483 $); gia hạn chỉ nới trần, không ghi tiền. `/model` của máy chủ thật: Sonic · Solid ·
Nova · Shin · Heshin · Eco rồi 🔒 Invisible · 🔒 Optimum, mặc định Solid. Webview VS Code (`dist/webview.js` thật) chạy trong
Chrome headless với `acquireVsCodeApi` giả. Trang `/cuongmini/gia-han` (bản `next build` của worktree) qua proxy cùng gốc tới máy
chủ thật. Trình duyệt AI: puppeteer THẬT, headless, hồ sơ tạm. Một lượt đọc thật Google Docs công khai (xuất `.md` qua chuyển
hướng googleusercontent, 4,6 s) + Figma oEmbed file không tồn tại (⇒ "chưa mở chia sẻ"); một lượt `/ket-noi figma` với token giả
(Figma trả 403 ⇒ "Figma từ chối token", không lưu gì).

**Lỗi tìm ra và đã sửa** (🔴 cao · 🟠 vừa · 🟡 nhỏ):
- 🔴 **`doc_web` (máy chủ) đọc được localhost / mạng nội bộ qua IPv6 ánh xạ.** `ipBiCam` chỉ bắt `::ffff:127.0.0.1` dạng chấm, mà
  WHATWG URL viết lại `http://[::ffff:127.0.0.1]:<cổng>/` thành `[::ffff:7f00:1]` ⇒ lọt; đo thật: server nghe 127.0.0.1 trả
  nguyên nội dung cho `doc_web` (cũng mở đường tới 169.254.169.254 / mạng docker bằng `::ffff:a9fe:a9fe`). `resourceRules.ts`
  đã tự vá riêng cho CT Work Resources nhưng `webTool.ts` (và bộ tải link ngoài dùng chung `ipBiCam`) thì chưa. Nay `ipBiCam`
  soi theo 8 nhóm số: ánh xạ / tương thích / SIIT / NAT64 (64:ff9b::/96, /48) / 6to4 / Teredo / site-local / multicast.
- 🟠 **Ai cũng dò được mã gia hạn.** Máy chủ so mã TRƯỚC khi xét người đó có đang chạm trần nào không ⇒ mọi tài khoản (kể cả
  tài khoản thường tạo hàng loạt) có 5 lần/15 phút để dò. Nay xét trần trước — người không có gì để gia hạn chỉ nhận
  `GIA_HAN_KHONG_AP_DUNG`/`GIA_HAN_CHUA_CHAM`, máy chủ không so mã, không đếm "Còn n lần".
- 🟠 **CLI + VS Code tự "làm tiếp" khi yêu cầu được duyệt MUỘN** (kiểm lại 30 s) dù người dùng đã đổi model và hỏi câu khác — đo
  thật trên máy chủ thật: lượt "Tiếp tục đúng từ chỗ đang dừng" tự chạy bằng Nova (model vừa đổi), không ai hỏi, có tốn tiền.
  Nay ghi "dấu" hội thoại lúc bị chặn (CLI `kho.dauHoiThoai` = id câu hỏi cuối; VS Code = đối tượng câu hỏi cuối); duyệt tới khi
  hội thoại đã đi tiếp / đang chạy ⇒ chỉ báo "Admin đã duyệt … Gửi lại câu hỏi khi cần dùng tiếp." (desktop vốn đã bắt bấm "Làm
  tiếp").
- 🟡 Nhập mã hai lần cùng lúc: lượt sau dùng kết quả "đang chạm" cũ ⇒ tạo yêu cầu CHỜ DUYỆT thừa + báo admin oan. Nay xác định trần
  LẠI sau khi giữ khoá tư vấn (khoá theo trần đã chuẩn hoá — `nhom:007` = `nhom:7`) ⇒ lượt sau 409 "chưa chạm".
- 🟡 `goChu` chỉ từ chối ô `type=password` lúc tìm thấy. Lọt: ô ĐỔI sang password khi focus (headless không bắn sự kiện focus nên
  trang không kịp đổi), ô che chữ bằng CSS `-webkit-text-security`, ô `autocomplete=current-/new-password|one-time-code`, ô tên/nhãn
  "password/mật khẩu/otp". Nay kiểm trước + sau focus (bắn focus tay khi trang không có focus) + sau khi gõ (lọt thì xoá chữ) —
  cả lõi CLI/VS Code lẫn app (`browser.ts`). "passport" vẫn gõ được.
- 🟡 `hoSoAnToan` bỏ sót hồ sơ chính của Chrome Beta/Canary/Dev, Edge Dev/SxS, Vivaldi, Opera, Arc, `google-chrome-beta|unstable`,
  mọi ".../User Data", và SYMLINK trỏ vào hồ sơ Chrome. Nay khớp rộng hơn + soi đường thật (`realpathSync`).
- 🟡 Tiêu đề tài liệu ngoài (tên file Figma, tiêu đề issue GitHub — chữ người lạ) nằm NGOÀI khối `untrusted` ⇒ một tiêu đề có
  xuống dòng / `</noi-dung-ngoai>` giả được chỉ dẫn. Nay `dongDauKetQua` ép một dòng, bỏ `< >` và ký tự điều khiển, ≤ 120 ký tự.
- 🟡 Ô nhập token `/ket-noi figma` mang nhãn "Mật khẩu" ⇒ "Token". Chú thích JSDoc của `datMayTinh` (extension) bị đẩy lệch.
- 🟡 Tab Figma của Project settings: thêm cảnh báo token cá nhân đọc được MỌI file tài khoản đó xem được, và thành viên nào dán
  link Figma vào thẻ cũng nhờ trợ lý đọc được ⇒ nên dùng tài khoản Figma chỉ có file của dự án.

**Đã kiểm, đúng:** lần 1 cộng ngay + làm tiếp (không thêm câu hỏi, `/rewind` không lệch) · lần 2 chờ duyệt, kiểm lại định kỳ ·
admin duyệt / từ chối (lý do tới app) · nhà tài trợ duyệt, ADMIN không tài trợ 403, thành viên tự duyệt 403, nhà tài trợ dự án A
sửa pid sang yêu cầu dự án B ⇒ 404 · duyệt khi đã quá kỳ ⇒ 409 `HET_KY`, không cấp · 5 lần sai khoá 15 phút (kể cả mã đúng) ·
đổi mã ⇒ mã cũ chết · model trả phí không vé ⇒ 403 · trần lạ/pid bậy ⇒ 400 · VÍ AI Code (cửa sổ 5 giờ) và nhóm FREE chính
hãng: lần 1 cộng đúng một mức, trần nới đúng; hạng CAO không có đường mã · trần THÁNG của nhóm không có thẻ, không nới · mã
không có trong mọi phản hồi + mọi dòng `logger.*` của cả bộ test, không trên màn hình / `~/.cuongmini` / URL / DOM trang web ·
app cũ nhận câu "Vào cuongthai.com/cuongmini/gia-han…" · hạn mức nhóm mặc định 5/20, số đã lưu (1/15) giữ nguyên · thẻ đi cả
đường SSE lẫn HTTP 429 (`NHOM_HET_TRAN`, `data.giaHanTien`) · SSRF link ngoài: `docs.google.com.evil.com`, `@`, IP literal,
DNS trả IP nội bộ (kể cả MỘT bản ghi trong nhiều), chuyển hướng sang host khác / hạ http / trang đăng nhập Google, header token
chỉ cho host đầu, thân chảy vô tận không content-length dừng ở trần · trình duyệt THẬT: headless, đúng hồ sơ tạm, ảnh 1280×800,
tắt sạch không còn tiến trình · token Figma CLI: ô ẩn, Esc không lưu, sai ⇒ không lưu, không lên máy chủ CuongThai.

**Test thêm:** máy chủ `src/services/linkNgoai/qa70Ssrf.test.ts` (6 — máy chủ nội bộ thật + ipBiCam + bộ tải + tiêu đề),
`src/services/agent/qa70.test.ts` (3), DB `src/routes/agent.qa70.db.test.ts` (8 — dò mã, nhập trùng, quá kỳ, sửa pid, ví,
chính hãng free, mã không vào log); `agent.giaHanTien.db.test.ts` đổi kỳ vọng nhập trùng (409, không yêu cầu chờ thừa); lõi
`packages/cuongmini-core/src/qa70.test.ts` (2 — hồ sơ chính + symlink), `qa70TrinhDuyetThat.test.ts` (Chrome THẬT, chạy khi
`CUONGMINI_TEST_TRINH_DUYET_THAT=1`: headless, hồ sơ, 1280×800, 7 kiểu ô mật khẩu, tắt sạch); CLI `src/test/qa70Pty.test.ts`
(PTY: duyệt muộn chỉ báo / duyệt sớm tự làm tiếp, thẻ từ HTTP 429 nhóm, `/ket-noi figma` ẩn + Esc, `/browser mode`). Nhịp kiểm
lại của CLI rút được bằng `CUONGMINI_NHIP_GIA_HAN_MS` (CHỈ cho test, ≥ 1 s).

**Chạy lại toàn bộ trên worktree (sau sửa):** `tsc` gốc + `typecheck:seed` + lõi + CLI + extension + desktop (2 tsconfig) +
frontend: 0 lỗi · dựng CLI + extension xanh · `next build` xanh ở heap 10 GB (heap 6 GB = mức `NODE_HEAP_MB` của
`frontend/Dockerfile` ⇒ OOM trong worktree — chưa rõ do `node_modules` symlink hay bản dựng đã nặng hơn; để ý khi deploy; `.next` đã xoá) · CLI 137/137 (`--test-concurrency=1`, gồm mọi PTY) · lõi 56 + 1 bỏ qua (bản Chrome thật chạy riêng: xanh) ·
desktop vitest 2244 + 8 bỏ qua · máy chủ `agent`+`llm`+`linkNgoai` 286 + 16 bỏ qua (DB) · `work/*` 1016/1016 · DB:
`agent.giaHanTien` 9/9, `agent.qa70` 8/8, `agent.nhom` 6/6, `work.agents` 23/23, `work.agentsUi` 5/5, `work.aiMentor` 6/6,
`work.code` 24/24, `chinhHang.db` 6 + 10 đỏ CŨ (như 2g) · `test:work-db` 63/64 tệp — `work.ctw7a` đỏ y hệt khi stash bản sửa
(`dashboard.weeks.at(-1).actual > 0`, lệch tuần sáng thứ Hai, không liên quan); `work.ctw7c` cần Redis + `REDIS_HOST/PORT`.

**Còn lại (chưa sửa, ghi để biết):**
- 🟠 `doc_web` đường chung (trang bất kỳ) vẫn có kẽ **DNS rebinding**: kiểm IP bằng `lookup` rồi `fetch` tự phân giải lại. Link
  ngoài không bị (chỉ host Google/Figma/GitHub — kẻ tấn công không điều khiển DNS của họ). Vá đúng cần `undici` Agent với
  `connect.lookup` kiểm IP lúc nối — thêm phụ thuộc ⇒ cần chủ app duyệt.
- Câu lỗi chạm trần ở app mới vẫn kèm câu "Vào cuongthai.com/cuongmini/gia-han …" (dành cho app cũ) ngay trên thẻ — thừa chữ.
- Yêu cầu chờ duyệt mà kỳ đã qua vẫn để `CHO_DUYET` (chỉ thành `HET_KY` khi có người bấm duyệt) ⇒ app cứ kiểm lại 30 s tới khi tắt.
- "Khoá 15 phút" tính từ lần sai ĐẦU trong cửa sổ, không từ lần thứ 5; đếm sai nằm trong RAM (khởi động lại backend là xoá).
- Trần model gốc 0 $ (admin chặn model với gói) ⇒ `/gia-han-tien` trả "chưa chạm" thay vì "không áp dụng".
- `/browser mode hien` vừa lưu mặc định vừa mở cửa sổ ngay (lệnh `mode` lẽ ra chỉ lưu).
- Trang `/cuongmini/gia-han`: cấp xong thì mục trần biến mất (đã hết chạm) nên câu "✓ Đã cộng … quay lại app và gửi lại câu
  hỏi" không hiện — chỉ thấy "Bạn chưa chạm giới hạn nào" + dòng "Đã cộng" ở Lượt gần đây.
- `chuyenCheDo` khi lõi đang NỐI VÀO trình duyệt của tiến trình khác (CLI + VS Code cùng hồ sơ): đổi ngầm ⇄ hiện chỉ ngắt/nối lại
  cùng bản đó, chế độ thật không đổi.
