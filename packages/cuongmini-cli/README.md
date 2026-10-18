# CuongMini CLI

Trợ lý lập trình **chạy trong terminal** của CuongThai — kiểu `claude` (Claude Code), dùng đúng
**lõi AI Code** của app desktop CuongThai và extension VS Code (cùng vòng lặp, tool, skill, MCP,
quyền, việc đã lưu). Đọc code, sửa file (có diff để duyệt), chạy lệnh, lập kế hoạch — ngay trong
thư mục bạn đang đứng.

## Cài đặt — một lệnh

**macOS / Linux**

```bash
curl -fsSL https://cuongthai.com/cli/install.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://cuongthai.com/cli/install.ps1 | iex
```

- Không cần sudo/Admin. Máy chưa có Node ≥ 20 thì lệnh cài **tự tải Node 22 LTS chính thức**
  (nodejs.org, đúng hệ điều hành + kiến trúc, kiểm SHA-256) vào `~/.cuongmini/node`.
- Gói CLI tải từ `cuongthai.com/cli`, kiểm SHA-256 theo `latest.json`, đặt vào `~/.cuongmini/app`.
- Lệnh `cuongmini` nằm ở `~/.local/bin` (Windows: `%LOCALAPPDATA%\CuongMini\bin`), tự thêm vào PATH
  (`~/.zshrc`, `~/.bashrc`, fish) nếu thiếu — mở terminal mới sau lần cài đầu. Có thêm bí danh
  ngắn **`cm`** nếu máy chưa có lệnh `cm` nào.
- **Cập nhật = chạy lại đúng lệnh cài.** CLI tự kiểm bản mới (tối đa 1 lần/ngày) và nhắc trên màn mở đầu.
- Về "open cuongmini": trên macOS `open` là lệnh hệ thống (mở app/file) nên CLI không ghi đè nó —
  lệnh chính là `cuongmini`.

## Dùng

```bash
cd du-an-cua-ban
cuongmini                       # mở phiên tương tác
cuongmini "giải thích dự án"    # mở và gửi ngay
cuongmini -c                    # mở lại việc gần nhất của thư mục này
cuongmini -p "tóm tắt git diff" > tom-tat.md    # chế độ in: một lượt, in kết quả rồi thoát
git diff | cuongmini -p "soát diff này"         # dữ liệu kèm qua stdin
cuongmini -r                    # chọn một việc cũ để mở lại
cuongmini -p "…" --output-format json      # kết quả JSON (stream-json: từng sự kiện một dòng)
cuongmini --add-dir ../thu-vien "…"        # cho agent làm việc thêm ở thư mục khác
cuongmini login | logout | update | doctor
```

Cờ: `-c/--tiep-tuc` · `-r/--resume` · `-m/--model <tên>` (vd `sonnet-5`, `opus-4-8`, `gpt-sol`) ·
`--che-do <ke-hoach|hoi|tu-sua|tu-dong|bo-qua-het>` (`--dangerously-skip-permissions` = bỏ qua hết) ·
`-C/--thu-muc <đường>` · `--add-dir <đường>` · `--output-format text|json|stream-json` (với `-p`) ·
`--verbose` · `-v` · `-h`.

`cuongmini update` chạy lại trình cài (tải bản mới, kiểm SHA-256). `cuongmini doctor` kiểm máy: Node,
PATH, đăng nhập, mạng, trình duyệt cho tool web, công cụ dán ảnh/thông báo, khả năng màu/Unicode.

## Agent phụ và lệnh nền (như Claude Code)

Khi CuongMini giao việc cho agent phụ (`giao_viec_phu`) hoặc chạy lệnh nền, dưới ô nhập hiện bảng:

```
▸▸ Tự động · 2 lệnh nền · ⧉ 2 · /tasks xem agent phụ · esc để dừng · ↓ để quản lý
● main             Đang chạy lệnh…                          2m 05s · ~$0.019
○ general-purpose  Đọc(src/api/client.ts)                       48s · ~$0.004
○ code-reviewer    Tìm file                                          31s
○ $ npm run dev    đang chạy (9s)                                    1m 10s
```

- **↓** (ô nhập trống) vào bảng · ↑↓ chọn · **Enter** mở màn chi tiết (nhiệm vụ đầy đủ, dòng thời gian từng bước,
  tool đã gọi + kết quả rút gọn, chữ agent phụ viết, kết quả cuối) · **←/→** chuyển agent · **Esc** quay lại.
- **←** (ô nhập trống) nhảy thẳng vào agent phụ đang chạy.
- **`/tasks`** — cả agent phụ đã xong (✓/✗) và lệnh nền (xem đầu ra; `x` dừng lệnh nền).
- Lõi hiện tại chỉ báo lúc agent phụ bắt đầu và kết quả cuối; dòng thời gian từng bước sẽ đầy đủ khi lõi phát
  thêm sự kiện `phuBatDau` / `phuSuKien` / `phuXong` (CLI đã sẵn sàng nhận).

## Ngôn ngữ — Tiếng Việt ↔ English

`/language` (bí danh `/ngon-ngu`, `/lang`; hoặc `/language en`, `/language vi`) đổi NGAY toàn bộ giao diện — màn chào,
chân trang, gợi ý, `/help`, thẻ duyệt, trạng thái "Đang…/Thinking…", `/config`, `doctor`, `--help` — và vẽ lại màn hình.
Mặc định đoán theo `LANG`/`LC_ALL` (bắt đầu bằng `vi` ⇒ Tiếng Việt, còn lại English); lựa chọn lưu ở `cai-dat.json`.
Trong `/language` có công tắc **"AI trả lời bằng ngôn ngữ này"**: bật thì mỗi câu gửi kèm một dòng nhắc ngôn ngữ.
Chữ đến từ lõi/máy chủ (tóm tắt tool, lỗi, chẩn đoán của lõi) giữ nguyên ngôn ngữ gốc.

## Toàn màn hình (mặc định từ 0.3.1; 0.4.0 không bắt chuột)

CuongMini mở trong **alternate screen** như Claude Code: ô nhập + chân trang ghim ở **đáy cửa sổ**, hội thoại tự cuộn phía trên; thoát thì terminal trả lại màn hình cũ và in **toàn bộ bản ghi** (câu hỏi + trả lời + tool gọn) để cuộn/chép về sau.

- Cuộn: **con lăn chuột** (alternate scroll — terminal đổi con lăn thành ↑/↓) · `↑`/`↓` khi ô nhập trống · `PgUp`/`PgDn` · `Home`/`End`. Lịch sử câu hỏi: `ctrl+↑`/`ctrl+↓`.
- **Bôi đen / chuột phải chép** như terminal thường (0.4.0 KHÔNG bắt chuột mặc định). Muốn bắt chuột (cuộn chính xác hơn): `/mouse on` — khi đó bôi đen phải giữ `Option` (iTerm2) · `Fn` (Terminal macOS) · `Shift` (Linux).
- `/copy` chép câu trả lời cuối · `/copy 2` câu thứ 2 từ cuối · `/copy q` câu hỏi · `/copy all` cả hội thoại. `ctrl+o` mở bản ghi đầy đủ (mọi đầu ra tool) trong trình xem có cuộn.
- **Shift+Enter xuống dòng** không cần cấu hình ở terminal hiểu kitty keyboard protocol (iTerm2 ≥ 3.5, kitty, WezTerm, ghostty…). Terminal cũ: `ctrl+j`, `Alt/Option+Enter`, hoặc `\` cuối dòng; `/terminal-setup` hướng dẫn.
- Toàn màn hình KHÔNG bao giờ gửi lệnh xoá scrollback (iTerm2 hết hiện thanh "clear scrollback history?").
- Tắt: `/fullscreen off` (lưu cho lần sau) · cờ `--no-fullscreen` · `CUONGMINI_TOAN_MAN_HINH=0`. CI, không TTY, `-p` thì không bao giờ bật.

## Mới ở 0.6.1 (mã gia hạn + model free lên trên)

**Mã gia hạn theo $ / Extension codes**
- Chạm một giới hạn chi tiêu (trần của model, ví AI Code 5 giờ, nhóm free Code Max, hạn mức nhóm CT Work) ⇒ thẻ **"Đã chạm giới hạn … · Nhập mã gia hạn để dùng tiếp"** với ô nhập **ẩn ký tự**. *Hit a spending limit ⇒ a card "Limit reached … · Enter an extension code to continue" with a hidden input.*
- **Lần đầu trong kỳ** (ngày / tháng / 5 giờ, tuỳ giới hạn) mã đúng ⇒ cộng ngay một mức và CuongMini **làm tiếp chỗ dở** (không gõ lại câu hỏi). *First time in a period ⇒ one step added at once and the task continues.*
- **Từ lần 2** ⇒ gửi yêu cầu, báo "Đã gửi yêu cầu, chờ admin duyệt" và **tự kiểm lại mỗi 30 giây**; duyệt ⇒ làm tiếp, từ chối ⇒ báo rõ lý do. Hạn mức nhóm: nhà tài trợ của dự án cũng duyệt được. *From the 2nd time ⇒ a request waits for an admin (or the team sponsor); CuongMini re-checks every 30 s.*
- Model cần khoá vẫn phải mở khoá trước (mã gia hạn không thay khoá). Nhập sai 5 lần ⇒ chờ 15 phút. Máy chủ tự kiểm mọi thứ. *Locked models still need their key; 5 wrong tries ⇒ 15-minute wait.*
- App/CLI cũ: câu lỗi trỏ tới **cuongthai.com/cuongmini/gia-han** để nhập mã trên web. *Older apps: the error points to that page.*

**Danh sách model / Model list**
- `/model`: model **miễn phí lên trên** (Sonic 5.5 · Solid · Nova · Shin · Heshin 5.5 · Eco), rồi mới tới model cần khoá; trong mỗi nhóm vẫn xếp theo năng lực. *Free models first, then keyed ones; capability order inside each group.*

## Mới ở 0.6.0 (đợt 6 + cổng & model)

**Mở là dùng**
- Mở `cuongmini` ở **bất kỳ thư mục nào**: lần đầu ở thư mục mới hiện hộp "Mở thư mục làm việc … Kiểm nhanh an toàn" (`1. Có, tôi tin thư mục này` · `2. Không, thoát`), nhớ thư mục đã tin (cả thư mục con) ở `~/.cuongmini/thu-muc-tin.json`. Thư mục HOME / gốc ổ đĩa ⇒ cảnh báo đỏ, mặc định "Không". `-p` và `CUONGMINI_TIN_THU_MUC=1` (CI) không hỏi.
- Chưa đăng nhập ⇒ đăng nhập ngay trong CLI rồi đi tiếp (không thoát).
- **Hạn mức nhóm**: không có Pro nhưng là thành viên một dự án CT Work mà trưởng nhóm (ADMIN) có Pro ⇒ dùng CuongMini cho dự án đó bằng hạn mức trưởng nhóm (chỉ model free; trần mỗi người/ngày + cả nhóm/tháng, trưởng nhóm bật/tắt ở Project settings → "CuongMini cho cả nhóm"). Máy chủ quyết định — CLI chỉ gửi id dự án đã gắn.

**CT Work dẫn đường**
- `/mcp` → **CT Work — chọn dự án & quyền**: nối bằng phiên đăng nhập ⇒ MỌI dự án của bạn (không gian · vai · thẻ mở, gõ để lọc) ⇒ quyền **Đọc + ghi / Chỉ đọc / Chỉ phiên này** ⇒ gắn thư mục (thư mục không phải repo ⇒ gắn theo phiên).
- Gắn xong CuongMini **tự đọc trang Docs "AGENTS.md — …"** của dự án (khối ```markdown đầu tiên, đệm theo phiên bản trang), gộp với `AGENTS.md` cục bộ (cục bộ thắng khi trùng mục). Không có trang ⇒ tự đọc trang tổng quan + sprint.
- **Hôm nay** (đầu buổi, một lần/ngày/thư mục): việc của bạn + hạn + nên làm thẻ nào trước.
- **`/ctwork`** mới: 1 Sprint · 2 **Hôm nay** · 3 Mở thẻ / **hướng dẫn** (đọc gì, các bước, xong khi, hỏi ai, **phụ thuộc** "cần @user làm xong LF-5 trước — nhánh `origin/LF-5-…`, pull về rồi làm") · 4 Bắt đầu · 5 Ghi giờ · 6 **Xong việc — bước tiếp** · 7 Báo cáo & mẫu FPT · 8 Nhóm (tổng quan trưởng nhóm / giảng viên, Q&A, chat, họp) · 9 Chọn dự án · 0 Thoát; ↑↓ thêm: Theo dõi bật/tắt, Hỏi cách dùng CT Work. Lối tắt: `/ctwork hom-nay | huong-dan LF-18 | xong | nhom | mau | hoi <câu> | nhan <tin> | theo-doi on|off`.
- **Làm xong là gợi ý**: lượt xong trên nhánh `LF-18-…` có commit mới ⇒ thẻ "Xong việc ở LF-18? Bước tiếp theo đúng luật dự án" (chuyển trạng thái theo workflow + Done rules, bình luận bằng chứng kèm link PR, ghi giờ, xin review, báo nhóm…) — mọi thao tác ghi đều qua thẻ xem trước.
- **Theo dõi nhẹ** (≥ 60 s, chỉ khi có dự án gắn): "@longbui vừa bình luận NT-12", "bạn vừa được giao NT-20", "NT-12 (chặn thẻ của bạn) đã Done — pull về làm được rồi". Tắt: `/ctwork theo-doi off`.
- AI **dùng được mọi tool CT Work (~120)**: 20 tool hằng ngày kèm tham số, phần còn lại ở mục lục và được nạp khi cần (`nap_tool_mcp`); hỏi "làm X trong CT Work thế nào" ⇒ trả kèm link đúng trang (`ctwork_huong_dan`).

**Cổng & model (từ 18/10)**
- Một danh sách model CuongMini (cao → thấp, chỉ tên CuongMini); model cần khoá hiện 🔒, chọn ⇒ hỏi khoá (vé 48 giờ). Cổng của model hỏng ⇒ máy chủ tự chuyển sang model free tương đương ở cổng kia (một dòng mờ "Đã chuyển sang … vì cổng bận"). Bỏ các trần làm model kém đi (ngữ cảnh theo cửa sổ thật 1M/400K, `max_tokens` theo model, đọc file/lệnh/MCP rộng hơn); tiền chặn bằng trần chi tiêu theo model × người.

**Sửa**
- Tự chuyển từ model 1M sang GPT 400K mà hội thoại dài ⇒ máy chủ cắt lượt cũ (kèm ghi nhớ) TRƯỚC khi gọi, không còn lỗi 400.
- Gõ thêm giữa lượt rồi `esc` ⇒ tin trả về ô nhập (như Claude Code).
- "3. Không, và bảo CuongMini làm khác đi (esc)" ⇒ lượt DỪNG, chờ bạn gõ chỉ dẫn.
- Thẻ `/ctwork` ở cửa sổ 60×20 không còn cao hơn màn hình.
- "Connecting CT Work…" không còn treo 30–45 s vì một server MCP khác treo (nạp lại từng server).
- Windows: cài được trên PowerShell 5.1/7, **cmd** (`powershell -NoProfile -ExecutionPolicy Bypass -c "irm https://cuongthai.com/cli/install.ps1 | iex"`) và **Git Bash** (`curl -fsSL https://cuongthai.com/cli/install.sh | bash`); `cuongmini doctor` báo PATH/shell/TTY trên Windows. Nút "Cài CuongMini CLI" trong app hiện lỗi thật + log, cài xong tự mở terminal chạy `cuongmini`.

## Mới ở 0.5.0 (đợt 4)

- **Gõ thêm khi agent đang chạy**: Enter khi đang chạy ⇒ tin được CHÈN vào lượt (agent đọc ngay sau tool kế tiếp, hiện `↳`); lệnh `/` vẫn đợi lượt xong · `esc` vẫn dừng.
- **Điều khiển máy tính** (`/may on|off`, mặc định TẮT): chụp màn hình + chuột/phím/cuộn — MỌI thao tác vẫn hỏi, kể cả "Bỏ qua hết". macOS cấp quyền Ghi màn hình + Trợ năng cho app terminal.
- **LSP**: có `typescript-language-server` / `pyright-langserver` (trong `node_modules/.bin` hoặc PATH) ⇒ agent hỏi định nghĩa/tham chiếu/chẩn đoán, và lỗi MỚI tự nối vào sau mỗi lần sửa file.
- **Hẹn sống qua lúc tắt + cron** (`"0 9 * * 1-5"`): mở lại CuongMini mà có hẹn đã lỡ ⇒ hỏi chạy bù hay bỏ (`/hen chay-bu|bo-lo`).
- **`/mcp` là thẻ lựa chọn** kiểu Claude Code (mở file · nạp lại · CT Work · xem tool / bật-tắt server); `/quyen`, `/hen`, `/sessions`, `/worktree`, `/ctwork` cũng vậy.
- Agent biết **hôm nay là ngày nào** (ngày + múi giờ máy bạn). Hook mới: `truocNen` (trước /compact), `thongBao` (khi chờ bạn duyệt); hook trước/sau tool chạy cả cho agent phụ.
- Sửa: đổi chế độ (shift+tab) giữa lượt không còn báo "đang chạy dở" — đổi khi lượt xong; đổi cỡ cửa sổ không còn làm iTerm2 hỏi "clear scrollback"; viền phải banner thẳng cột.

**Đợt 5 — CT Work là hệ sinh thái riêng của CuongMini** (cùng bản 0.5.0):

- **Tự nối CT Work bằng phiên đăng nhập** cuongthai.com: lần đầu hỏi một lần "Kết nối CT Work?" (chỉ đọc / đọc + ghi / không hỏi lại). Token tự tạo, cất trong kho của máy (file 0600), không in, không log. Server `ctwork` **dựng sẵn** — không cần dòng nào trong `mcp.json` (vẫn tắt được ở `/mcp`). Token hết hạn / bị thu hồi ⇒ hỏi "Cấp lại (một chạm)".
- **Gắn thư mục ⇄ dự án**: `.cuongmini/ctwork.json` = `{ workspaceId, projectId, key }` (không bí mật — commit được, hoặc thêm `.cuongmini/` vào `.gitignore`). Chưa gắn mà `AGENTS.md` ghi "dự án **LF** (id 2)" ⇒ hỏi xác nhận; đổi: `/ctwork du-an`. Agent biết "Dự án CT Work: LF (id 2)" ở mọi lượt.
- **Dòng trạng thái** dưới ô nhập: `⬡ LF · Sprint 2 · còn 5 ngày · ▶ LF-18 …` (thẻ suy từ nhánh `LF-18-…`). Đọc rẻ: `sprint_current` tối đa 1 lần / 5 phút.
- **`/ctwork` = menu đánh số** (↑↓ Enter hoặc gõ số): 1 Sprint (bảng theo cột) · 2 Việc của tôi · 3 Mở thẻ · 4 Bắt đầu làm thẻ (nhánh `LF-xx-slug` + In Progress) · 5 Ghi giờ · 6 Bình luận bằng chứng (soạn từ git) · 7 Báo cáo tuần · 8 Họp · 9 Chọn dự án · 0 Thoát. Lối tắt: `/issue LF-18` (`/the`), `/sprint`, `/viec`, `/ctwork gio LF-18 1.5h ghi chú`.
- **Gõ `LF-123` trong câu** ⇒ tóm tắt thẻ tự đính kèm (≤ 1.500 ký tự/thẻ, ≤ 3 thẻ), chip `📎 LF-123` — như `@file`.
- Tool CT Work hiện **một dòng** `● CT Work · sprint_current — Sprint 2 · 14 thẻ`; `ctrl+o` mở bảng gọn, không đổ JSON.
- **Ghi lên CT Work luôn qua thẻ duyệt có xem trước** (thẻ nào, việc gì, nội dung gì) — kể cả "Bỏ qua hết"; đọc thì không hỏi. Muốn agent tự ghi: `/ctwork tu-ghi on`.
- Bố cục kiểu Claude Code: thẻ duyệt `1. Yes · 2. Yes, and don't ask again for … · 3. No, and tell CuongMini what to do differently (esc)`, `? phím tắt` ở ô nhập trống, `/help` gọn (`/help all` = đầy đủ), tiêu đề cửa sổ terminal = tiêu đề phiên, một dòng trống trước thông báo.

## Mới ở 0.4.0 (đợt 3)

- **Agent phụ ghi được** (`giao_viec_ghi`): làm trong git worktree / thư mục tạm riêng, mọi lần sửa/chạy lệnh vẫn hiện thẻ duyệt "🤖 Agent phụ", xong trả diff để gộp (`gop_viec_phu`).
- **Hỏi bằng lựa chọn**: agent hỏi 1–4 câu, chọn bằng ↑↓ / phím số / space, hoặc "Khác" để tự gõ.
- **Chờ & hẹn**: agent chờ dev server/URL/file/lệnh nền mà không tốn token (`⏳` + `esc` bỏ chờ); hẹn tự quay lại sau N phút (`⏰`, `/hen` xem/huỷ — chỉ chạy khi CuongMini còn mở).
- **Nhắn giữa phiên**: `/sessions` thấy các phiên CuongMini khác (app, CLI, VS Code), `/rename` đặt tên; agent nhắn qua lại (bạn duyệt nội dung), tin đến là DỮ LIỆU, không phải lệnh.
- **Quyền theo tiền tố**: trên thẻ lệnh chọn "Luôn cho mọi lệnh `npm test …`" (lệnh nối `;` `&&` `|` `$(…)` vẫn hỏi) · `/quyen them npm test` · `/quyen xoa <số>`.
- `/worktree [tên|list|xoa]`, `/ctwork [doc|ghi|off]` (kết nối CT Work một chạm, token cất trong kho bí mật), `/mouse`.
- Tiền ở chân trang = tổng máy chủ báo cho mọi vòng (trước chỉ cộng vòng cuối); "context %" tính từ token thật, cập nhật giữa lượt.

## Gõ đặc biệt (như Claude Code)

| Gõ | Tác dụng |
|---|---|
| `!git status` | Chạy shell NGAY ở thư mục dự án (zsh/bash; Windows: PowerShell), không qua AI. Kết quả đi kèm câu hỏi kế tiếp để AI thấy |
| `# luôn dùng pnpm` | Lưu thành quy ước dự án: hỏi xác nhận rồi ghi vào `AGENTS.md` (hoặc `CLAUDE.md`/`.agentrc.md` nếu dự án đang dùng) — lõi đọc file này ở MỌI lượt |
| `@src/app.ts`, `@tinhTong` | Nhắc file/thư mục, hoặc hàm/lớp (quét định nghĩa bằng regex, trần 1,5 giây) |
| gõ lúc agent đang làm | Tin vào **hàng chờ** (⏳ sẽ gửi sau), tự gửi khi lượt xong; `esc` huỷ hàng chờ |

Lần đầu chạy: chọn đăng nhập **Google / GitHub / Apple** (mở trình duyệt, đăng nhập xong tự quay
về terminal — không mở được trình duyệt thì CLI in link để bạn tự mở) hoặc **tên + mật khẩu**
(ô mật khẩu không hiện ký tự). Phiên lưu ở `~/.cuongmini/phien.json` quyền `0600`, tự làm mới
lúc mở và mỗi 6 giờ.

## Mặc định: đủ công cụ, mỗi lần vẫn hỏi

Mở lên là CuongMini có ĐỦ công cụ: đọc/sửa file, chạy lệnh, git, xuất sơ đồ, ghi chú và **trình duyệt** (🌐 —
mở web, đọc trang, bấm, gõ trong một cửa sổ Chrome/Edge RIÊNG, hồ sơ `~/.cuongmini/trinh-duyet`, không đụng
Chrome của bạn; tự đóng khi thoát CLI). Mỗi lần sửa file hay chạy lệnh vẫn hiện thẻ duyệt. Muốn khỏi hỏi:
`shift+tab` sang **Tự động** hoặc **Bỏ qua hết**. Trình duyệt: `/browser off` tắt cho phiên này, `/config` ⇒
"Trình duyệt cho AI" để đổi hẳn; máy không có Chrome/Edge/Brave/Chromium thì tự tắt (`cuongmini doctor` nhắc cài).
Chế độ mặc định đổi được trong `/config` (CLI chỉ ép chế độ khi bạn tự chọn ở đó hoặc dùng `--che-do`).
Riêng `-p` (không ai bấm duyệt được) mặc định "Lập kế hoạch".

## Chế độ quyền (`shift+tab` xoay vòng)

| Chế độ | Làm gì |
|---|---|
| ✋ Hỏi trước mọi việc (**mặc định**) | Đủ công cụ — sửa file, chạy lệnh, git, trình duyệt, ghi chú — nhưng MỖI lần sửa / chạy lệnh đều có thẻ duyệt |
| ⏸ Lập kế hoạch | Chỉ đọc — không sửa file, không chạy lệnh |
| ✎ Tự sửa file | Sửa file không hỏi, lệnh vẫn hỏi |
| ⚡ Tự động | Sửa + chạy lệnh an toàn không hỏi (lệnh nguy hiểm vẫn hỏi) |
| ⚠ Bỏ qua hết | Không hỏi gì — CLI hỏi xác nhận trước khi bật |

Thẻ duyệt hiện ngay trong luồng (diff tô màu / lệnh + lý do rủi ro): `1` cho phép · `2` cho phép
cả việc này · `3` từ chối, hoặc ↑↓ + Enter; `Esc` = từ chối.

## Phím tắt

| Phím | Tác dụng |
|---|---|
| `Enter` | Gửi |
| `↑` / `↓` | Lịch sử câu đã gửi (lưu ở `~/.cuongmini/lich-su.txt`) |
| `/` | Gợi ý lệnh (lọc khi gõ, `Tab` chèn, `Enter` chạy) |
| `@` | Gợi ý file/thư mục dự án (tìm mờ trên `git ls-files`), chèn `@đường` |
| `shift+tab` | Đổi chế độ quyền |
| `esc` | Dừng việc đang chạy · đóng gợi ý · `esc esc` xoá ô nhập |
| `esc esc` (khi rảnh, ô nhập trống) | Quay lui về một câu cũ (`/rewind`) — phần sau mốc biến khỏi màn hình |
| `ctrl+r` | Xem lại toàn bộ bảng ghi, cuộn được (j/k, Space, g/G) |
| `ctrl+o` | Chọn đầu ra lệnh/tool cũ để mở/thu (Enter), `p` in trọn ra màn hình |
| `ctrl+p` / `ctrl+t` | Ẩn/hiện bảng kế hoạch |
| `ctrl+v` (Windows: `alt+v`) | Dán ảnh từ clipboard (macOS: pngpaste/osascript · Windows: PowerShell · Linux: wl-paste/xclip) |
| `ctrl+j`, `Alt+Enter`, `\` cuối dòng | Xuống dòng (`/terminal-setup` để dùng Shift+Enter) |
| `ctrl+l` | Vẽ lại màn hình |
| `ctrl+c` | Dừng việc · xoá ô nhập · nhấn 2 lần để thoát |

**Ảnh**: gõ `@anh.png` hoặc **kéo file ảnh vào terminal** (terminal dán đường dẫn) — ảnh được
gửi kèm (HEIC/AVIF/TIFF… tự chuyển đổi).

**Bảng kế hoạch** (📋) nằm cột phải khi terminal rộng ≥ 110 cột (hẹp hơn thì nằm trên ô nhập):
việc ☐ ◐ ☑, "Đang làm" (pha + lệnh), file đã sửa (+/−), bước, thời gian.

## Lệnh `/`

Cùng bộ lệnh với app desktop và extension VS Code:

- **Cơ bản**: `/help` · `/clear` · `/login` · `/logout` · `/exit`
- **Phiên & model**: `/model` (menu nhóm theo cổng: Cổng chính · Claude chính hãng · modelapi; 🔒 = cần mật khẩu quản trị cấp) · `/gateway` (`/cong` — chọn cổng khi cổng chính hỏng / quay về) · `/effort` · `/compact` · `/context` · `/usage` · `/cost` · `/status`
- **Làm việc**: `/plan <việc>` (chỉ đọc, xong hỏi duyệt) · `/review` · `/diff` · `/init` · `/undo` ·
  `/rewind [n]` · `/resume` (bảng chọn việc cũ) · `/export [tên.md]`
- **Công cụ**: `/memory` · `/mcp [mo|nap]` · `/hooks` · `/kynang` · `/quyen` (= `/permissions`) · `/doctor` · `/terminal-setup`
- **CLI**: `/tasks` · `/fullscreen [on|off]` · `/language [vi|en]` · `/browser [on|off]` (`/trinh-duyet`, `/chrome`) · `/config` (giao diện sáng/tối, thông báo, chế độ & model mặc định, ký tự ASCII) · `/theme` · `/add-dir` ·
  `/copy` (chép câu trả lời gần nhất) · `/transcript`
- Lệnh tự tạo của dự án (`.claude/commands/*.md`) cũng hiện trong gợi ý.

## Dữ liệu trên máy

```
~/.cuongmini/
  phien.json      phiên đăng nhập (0600)
  lich-su.txt     lịch sử câu đã gửi
  data/           dữ liệu lõi AI Code: việc đã lưu, quyền "luôn cho phép", MCP, bộ nhớ bài học
  logs/           nhật ký (lõi in log vào đây thay vì làm vỡ màn hình); CUONGMINI_DEBUG=1 để in thẳng
  app/  node/     mã CLI + Node riêng (do lệnh cài tạo)
```

Biến môi trường: `NO_COLOR` (tắt màu) · `CUONGMINI_HOME` (đổi thư mục dữ liệu) · `CUONGMINI_ASCII=1|0`
(ép/tắt ký tự ASCII) · `CUONGMINI_KHONG_KIEM_CAP_NHAT=1` · `CUONGMINI_DEBUG=1`.

## Giao diện & hệ điều hành

- **Theme**: tối (mặc định), sáng (terminal nền trắng — tự dò `COLORFGBG`, hoặc `/config`/`/theme sang`). Theme sáng
  hạ độ chói mọi màu chữ cho đủ tương phản trên nền trắng.
- **Màu**: truecolor ⇒ 256 màu ⇒ 16 màu (conhost Windows cũ, `TERM=linux`) tự hạ bậc; `NO_COLOR` tắt hẳn.
- **Ký tự**: console không vẽ được Unicode (conhost Windows ngoài Windows Terminal/VS Code, `TERM=linux`) ⇒ khung
  `+-|` và ký hiệu ASCII; chữ tiếng Việt vẫn giữ nguyên.
- **Thông báo**: lượt dài hơn 30 giây hoặc cần duyệt ⇒ chuông; nếu bạn đang ở cửa sổ khác ⇒ thông báo hệ điều hành
  (osascript · PowerShell · notify-send). Tắt trong `/config`.
- **Windows**: chạy trong Windows Terminal, PowerShell 5.1/7, cmd. Alt+Enter của Windows Terminal là phím toàn màn
  hình ⇒ xuống dòng bằng `ctrl+j` hoặc `\` cuối dòng.

## Phát triển

```bash
cd packages/cuongmini-cli
npm install
node build.mjs                 # dist/cuongmini.mjs (ESM + shebang) + dist/loi.cjs (lõi, CJS riêng)
node dist/cuongmini.mjs --help
npx tsc --noEmit -p tsconfig.json
npm test                       # node:test qua tsx — phần thuần
CUONGMINI_LOI=thu/loiGia.cjs node dist/cuongmini.mjs   # chạy với LÕI GIẢ (không gọi máy chủ)
node dong-goi.mjs              # build + .tgz + latest.json ⇒ frontend/public/cli/ (KHÔNG deploy)
```

- Lõi dựng bằng `cauHinhLoi()` của `packages/cuongmini-core/esbuildLoi.mjs` thành file CommonJS riêng
  và nạp bằng `createRequire` — lõi móc `Module._load` so `__filename` của chính nó, gói chung vào
  bản ESM là móc trượt.
- Lệnh `/` lấy thẳng phần thuần `desktop/src/renderer/features/chat/lenhGach.ts` qua alias `ct-lenh`.
