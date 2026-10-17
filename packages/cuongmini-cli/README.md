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
- **Phiên & model**: `/model` (menu) · `/effort` · `/compact` · `/context` · `/usage` · `/cost` · `/status`
- **Làm việc**: `/plan <việc>` (chỉ đọc, xong hỏi duyệt) · `/review` · `/diff` · `/init` · `/undo` ·
  `/rewind [n]` · `/resume` (bảng chọn việc cũ) · `/export [tên.md]`
- **Công cụ**: `/memory` · `/mcp [mo|nap]` · `/hooks` · `/kynang` · `/quyen` (= `/permissions`) · `/doctor` · `/terminal-setup`
- **CLI**: `/browser [on|off]` (`/trinh-duyet`, `/chrome`) · `/config` (giao diện sáng/tối, thông báo, chế độ & model mặc định, ký tự ASCII) · `/theme` · `/add-dir` ·
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
