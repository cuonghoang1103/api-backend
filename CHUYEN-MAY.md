# CHUYỂN MÁY — MacBook → máy nhà Linux (làm song song)

> Mục tiêu: lên máy nhà Linux làm tiếp phần còn dở, **trong khi MacBook đi sửa
> pin**. Khi Mac về thì dùng lại ngay, **không phải chuyển ngược thứ gì**.
>
> Soạn ngày 23/08/2026.

---

## ⛔ NGUYÊN TẮC VÀNG

**Mọi lệnh chạy trên MacBook ở tài liệu này đều là lệnh ĐỌC hoặc CHÉP RA.**
Không `git checkout`, không `git stash`, không `git clean`, không xoá, không
sửa file nào. Máy Mac phải giữ **nguyên trạng 100%** — kể cả những thay đổi
đang dang dở trong cây làm việc.

Lý do không chỉ là cẩn thận: repo này đã ba lần (13/08/2026) deploy nhầm file
mà một phiên khác đang gõ dở. Cây làm việc trên Mac **là dữ liệu thật**, chưa
có bản sao ở đâu cả. Ta chụp nó lại, không dọn nó.

**Tất cả những gì đi từ Mac sang Linux đều đi MỘT CHIỀU.**

---

# PHẦN A — TRÊN MACBOOK (chỉ đọc, chỉ chép ra)

Cắm USB vào. Đặt biến cho gọn — sửa `TEN_USB` cho đúng tên ổ của bạn:

```bash
TEN_USB="CHUYEN-MAY"                    # xem tên thật: ls /Volumes/
USB="/Volumes/$TEN_USB"
DA="$HOME/Downloads/api-backend"        # đường dẫn repo trên Mac
mkdir -p "$USB/viec-do-dang" "$USB/bi-mat"
cd "$DA" || echo "❌ SAI ĐƯỜNG DẪN — sửa biến DA rồi chạy lại"
```

Kiểm ngay là đúng chỗ:

```bash
pwd && git remote -v | head -1
```
✅ Mong đợi: đường dẫn repo + `origin  https://github.com/cuonghoang1103/api-backend`

---

## A1. Xem còn dở những gì (chỉ đọc)

```bash
echo "── Nhánh đang đứng ──"          ; git branch --show-current
echo "── Thay đổi chưa commit ──"     ; git status --short
echo "── Commit chưa đẩy lên GitHub ─"; git log --oneline --all --not --remotes
echo "── Stash đang cất ──"           ; git stash list
echo "── Nhánh local chưa có remote ─"; git branch -vv | grep -v '\[origin/'
```

**Chụp màn hình hoặc lưu lại kết quả này.** Lát nữa trên máy nhà bạn sẽ đối
chiếu để biết đã mang sang đủ chưa.

```bash
{ git status --short; echo "---"; git log --oneline --all --not --remotes; \
  echo "---"; git stash list; } > "$USB/viec-do-dang/nguyen-trang-mac.txt"
```

---

## A2. Chụp việc còn dở (KHÔNG commit, KHÔNG đụng cây làm việc)

Ba loại việc dở, ba cách chụp khác nhau. Làm đủ cả ba.

### A2.1 — Mọi commit của mọi nhánh (kể cả chưa push)

`git bundle` chỉ **đọc** kho `.git`, không đổi HEAD, không đổi file nào:

```bash
git bundle create "$USB/viec-do-dang/toan-bo-kho.bundle" --all
git bundle verify "$USB/viec-do-dang/toan-bo-kho.bundle" | tail -3
du -h "$USB/viec-do-dang/toan-bo-kho.bundle"
```
✅ Mong đợi: `The bundle records a complete history`
⚠️ Bundle của repo này **nặng ~135 MB** (đo thật). USB cần trống ≥ 300 MB.

### A2.2 — Thay đổi chưa commit của file ĐÃ theo dõi

```bash
git diff HEAD > "$USB/viec-do-dang/chua-commit.patch"
wc -l < "$USB/viec-do-dang/chua-commit.patch"
```
✅ Mong đợi: số dòng > 0 nếu `git status` ở A1 có hiện gì. Ra `0` mà A1 có
thay đổi ⇒ thay đổi đó nằm ở file **chưa theo dõi**, xem A2.3.

### A2.3 — File MỚI chưa theo dõi (git chưa biết tới)

```bash
git ls-files --others --exclude-standard > "$USB/viec-do-dang/file-moi.txt"
cat "$USB/viec-do-dang/file-moi.txt"
mkdir -p "$USB/viec-do-dang/file-moi"
tar cf - -T "$USB/viec-do-dang/file-moi.txt" | tar xvf - -C "$USB/viec-do-dang/file-moi"
```
✅ Mong đợi: `tar` liệt kê ra đúng những file có trong `file-moi.txt`

> Dùng `tar` chứ không `rsync`: `rsync` có sẵn trên macOS nhưng **không phải
> bản Linux nào cũng cài** — tôi đã thử và nó thiếu thật. `tar` thì luôn có.

### A2.4 — Stash cũ (nếu A1 có liệt kê)

```bash
n=0; git stash list --format='%gd' | while read -r s; do
  git stash show -p "$s" > "$USB/viec-do-dang/stash-$n.patch"; n=$((n+1)); done
ls -la "$USB/viec-do-dang"/stash-*.patch 2>/dev/null || echo "(không có stash — bỏ qua)"
```

> ⚠️ `git stash show -p` **không xoá** stash. Stash vẫn nằm nguyên trên Mac.

---

## A3. Chép các file bí mật (đều bị `.gitignore` chặn — git KHÔNG mang sang)

Đây là phần hay quên nhất, và thiếu một file là không chạy nổi.

```bash
cd "$DA"
# Env của backend + frontend
cp -v .env                              "$USB/bi-mat/env-backend"           2>/dev/null
cp -v frontend/.env.local               "$USB/bi-mat/env-frontend-local"    2>/dev/null
# Khoá service-account của Google (Indexing API)
cp -v frontend/src/config/google-key*.json "$USB/bi-mat/" 2>/dev/null || echo "(không có google-key — bỏ qua)"
# Bí mật firmware (khoá thiết bị, mật khẩu WiFi) — giữ nguyên cây thư mục.
# KHÔNG dùng `cp --parents`: macOS không có tuỳ chọn đó.
find firmware -name 'secrets.h' -exec sh -c \
  'mkdir -p "$1/$(dirname "$2")" && cp -v "$2" "$1/$2"' _ "$USB/bi-mat" {} \;
# SSH: khoá vào VPS + cấu hình Host linux-nha
mkdir -p "$USB/bi-mat/ssh"
cp -v ~/.ssh/id_rsa ~/.ssh/id_rsa.pub ~/.ssh/config ~/.ssh/known_hosts "$USB/bi-mat/ssh/" 2>/dev/null
# Đăng nhập gh CLI (hoặc bỏ qua, đăng nhập lại trên Linux cũng được)
cp -rv ~/.config/gh "$USB/bi-mat/gh-config" 2>/dev/null || echo "(chưa có gh config)"
```

Kiểm đủ chưa:

```bash
ls -la "$USB/bi-mat" "$USB/bi-mat/ssh"
grep -c '=' "$USB/bi-mat/env-backend"        # kỳ vọng ~136 dòng biến
grep -q 'linux-nha' "$USB/bi-mat/ssh/config" && echo "✅ có Host linux-nha" || echo "⚠️ THIẾU Host linux-nha"
```

---

## A4. Xuất chứng thư Developer ID của Apple

### A4.0 — Vì sao phải làm BÂY GIỜ

`npm run dist:mac:ky` cần **hai** thứ. Chỉ một trong hai lấy ra được thành file:

| Thứ | Ở đâu | Xuất ra file được? | Mất thì sao |
|---|---|---|---|
| Chứng thư `Developer ID Application` **+ khoá riêng** | Keychain `login` | ✅ `.p12` | **Khoá riêng KHÔNG tải lại được.** Tải `.cer` từ Apple chỉ được phần công khai. Phải tạo chứng thư MỚI, mà Apple giới hạn số chứng thư Developer ID mỗi tài khoản |
| Hồ sơ notarytool `cuongthai-notary` | keychain được bảo vệ dữ liệu | ❌ **không** | Dựng lại được trong 2 phút — xem A4.5 |

Nói cách khác: **chỉ có một thứ thật sự không thay thế được, là khoá riêng.**
Phần này lấy nó ra.

> `ky-mac.mjs` đã ghi sẵn một bài học liên quan: `security dump-keychain`
> **không** liệt kê hồ sơ notarytool, và bản kiểm đầu tiên vì thế báo thiếu
> trong khi hồ sơ vẫn dùng tốt (20/08/2026). Nên bên dưới không dò keychain
> để kết luận gì cả — hỏi thẳng công cụ.

### A4.1 — Ghi lại danh tính trước khi xuất

```bash
mkdir -p "$USB/bi-mat/apple"
security find-identity -v -p codesigning | tee "$USB/bi-mat/apple/danh-sach-chung-thu.txt"
```
✅ Mong đợi ít nhất một dòng dạng:
`1) A1B2C3…(40 ký tự) "Developer ID Application: Tên Bạn (ABCDE12345)"`

- `ABCDE12345` trong ngoặc là **Team ID** — `ky-mac.mjs` đọc chính chỗ này.
- Chỉ thấy `Apple Development` mà **không** thấy `Developer ID Application`
  ⇒ bạn chưa từng có chứng thư phát hành. Bỏ qua cả phần A4, không mất gì.

Xem hạn dùng (chứng thư Developer ID sống 5 năm):

```bash
security find-certificate -c "Developer ID Application" -p |   openssl x509 -noout -subject -enddate | tee -a "$USB/bi-mat/apple/danh-sach-chung-thu.txt"
```

⚠️ Nếu lệnh in ra **nhiều** chứng thư trùng tên: đó là chuyện đã xảy ra thật
ngày 19/08/2026 — Apple cấp chứng thư gia hạn mà **không đổi tên**, nên keychain
có hai mục y hệt và `codesign -s <tên>` chết vì *"ambiguous"*. Xuất **cả hai**,
đừng đoán cái nào còn hạn.

### A4.2 — Xuất `.p12` bằng Keychain Access (đường chính)

1. Mở **Keychain Access** (⌘Space → gõ `Keychain Access`)
2. Cột trái: chọn keychain **login** → mục **My Certificates**
   > Phải là **My Certificates**, không phải *Certificates*. Chỉ tab này hiện
   > những chứng thư **có khoá riêng** đi kèm — đúng thứ ta cần.
3. Tìm dòng `Developer ID Application: <tên bạn> (<Team ID>)`
4. Bấm mũi tên ▸ bên trái nó để bung ra. **Phải thấy một dòng khoá con** dạng
   `<tên bạn>` với biểu tượng chìa khoá. **Không thấy chìa khoá ⇒ máy này chỉ
   có phần công khai, xuất ra sẽ vô dụng** — dừng lại, đừng tưởng đã xong.
5. Chuột phải vào **dòng chứng thư** (không phải dòng chìa khoá) → **Export
   "Developer ID Application: …"**
6. File Format: **Personal Information Exchange (.p12)**
7. Lưu vào `$USB/bi-mat/apple/` với tên `developer-id.p12`
8. macOS hỏi **mật khẩu bảo vệ file** → đặt một mật khẩu và **ghi nhớ**
9. macOS hỏi tiếp **mật khẩu đăng nhập máy Mac** (để mở keychain) → nhập

> Bước 8 và 9 là **hai mật khẩu khác nhau**. Bước 8 do bạn tự đặt cho file;
> bước 9 là mật khẩu máy. Nhầm chỗ này là lỗi hay gặp nhất.

Có nhiều chứng thư trùng tên (cảnh báo ở A4.1)? Giữ Command và chọn hết, rồi
Export — macOS gộp vào một `.p12`. Tên file vẫn để `developer-id.p12`.

### A4.3 — Cách CLI (nếu không muốn dùng chuột)

Lệnh này xuất **mọi** identity có khoá riêng trong keychain `login`:

```bash
security export -k ~/Library/Keychains/login.keychain-db \
  -t identities -f pkcs12 -o "$USB/bi-mat/apple/tat-ca-identity.p12"
```
macOS sẽ hỏi mật khẩu đặt cho file, rồi hiện hộp thoại xin quyền — bấm
**Allow** (hoặc *Always Allow*). Cách này chắc ăn hơn ở chỗ nó không bỏ sót
chứng thư nào, đổi lại file gồm cả những chứng thư bạn không cần.

### A4.4 — KIỂM bản vừa xuất (đừng bỏ bước này)

Một file `.p12` **không có khoá riêng** trông y hệt file có — cùng đuôi, cùng
mở được, chỉ vô dụng lúc cần. Kiểm bằng chính nội dung nó:

```bash
P12="$USB/bi-mat/apple/developer-id.p12"     # hoặc tat-ca-identity.p12
openssl pkcs12 -in "$P12" -nodes -legacy 2>/dev/null | grep -E 'friendlyName|PRIVATE KEY' \
  || openssl pkcs12 -in "$P12" -nodes | grep -E 'friendlyName|PRIVATE KEY'
```
Nó hỏi mật khẩu bạn đặt ở bước 8. Kết quả **bắt buộc** phải có đủ hai loại dòng:

```
friendlyName: Developer ID Application: <tên bạn> (<Team ID>)
-----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----
```

Đọc kết quả (đo thật trên `.p12` dựng để thử):

- ✅ **Có dòng `PRIVATE KEY`** ⇒ khoá riêng đã nằm trong file. Xong.
- ❌ **Không in ra gì cả** ⇒ file không có khoá riêng. Đây chính là ca hỏng cần
  bắt, và nó im lặng hoàn toàn — không báo lỗi, không cảnh báo. Quay lại A4.2,
  kiểm kỹ bước 4 (dòng chìa khoá dưới chứng thư).
- ❌ `Mac verify error: invalid password?` ⇒ gõ sai mật khẩu bước 8.

Muốn một câu trả lời gọn hơn, đếm thẳng:

```bash
openssl pkcs12 -in "$P12" -nodes 2>/dev/null | grep -c 'BEGIN PRIVATE KEY'
```
✅ Mong đợi **≥ 1**. Ra `0` là hỏng.

> Lệnh trên lọc qua `grep` có chủ ý: `openssl pkcs12 -nodes` in **nguyên khoá
> riêng ra màn hình**. `grep` giữ lại đúng dòng BEGIN/END, phần ruột không
> hiện. Đừng bỏ `grep` đi.
>
> Hai vế `||` là vì macOS dùng LibreSSL — bản có `-legacy`, bản không. Vế nào
> chạy được thì thôi.

Ghi lại vân tay để sau này đối chiếu đúng file:

```bash
shasum -a 256 "$P12" | tee "$USB/bi-mat/apple/van-tay.txt"
```

### A4.5 — Hồ sơ notarytool: KHÔNG xuất, mà ghi lại cách dựng lại

Hồ sơ `cuongthai-notary` nằm trong kho khoá được bảo vệ dữ liệu — `security`
không đọc ra được, nên **không có cách xuất nó thành file**. Nhưng dựng lại chỉ
mất 2 phút, miễn là bạn còn ba mẩu tin dưới đây.

Xác nhận hồ sơ hiện đang dùng được (đây là phép kiểm ĐÚNG, theo chú thích trong
`ky-mac.mjs`):

```bash
xcrun notarytool history --keychain-profile cuongthai-notary >/dev/null 2>&1 \
  && echo "✅ hồ sơ đang dùng được" || echo "⚠️ chưa có hồ sơ (mã 69) — không sao, dựng lại sau"
```

Ghi lại ba mẩu tin để dựng lại trên máy mới:

```bash
cat > "$USB/bi-mat/apple/notary.txt" <<'EOF'
Tên hồ sơ  : cuongthai-notary        (mặc định của KY_MAC_PROFILE)
Apple ID   : cuongthaihnhe176322@gmail.com
Team ID    : <chép từ ngoặc trong danh-sach-chung-thu.txt>
Mật khẩu   : app-specific password — KHÔNG phải mật khẩu Apple ID thường
             tạo/thu hồi tại appleid.apple.com → Sign-In and Security
             → App-Specific Passwords
Dựng lại   : xcrun notarytool store-credentials "cuongthai-notary"                --apple-id "cuongthaihnhe176322@gmail.com" --team-id "<Team ID>"
EOF
```

**Nên làm luôn:** vào appleid.apple.com tạo một app-specific password mới, dán
vào cuối `notary.txt`. Nó nằm trong gói mã hoá ở A5. Không làm cũng được — loại
mật khẩu này tạo lại bất cứ lúc nào, khác hẳn khoá riêng.

### A4.6 — Chứng thư khác (thường không cần)

```bash
security find-identity -v | grep -E 'Developer ID Installer|Mac Developer|3rd Party'
```
Có `Developer ID Installer` thì xuất y hệt A4.2 — nó dùng để ký gói `.pkg`.
Dự án này chỉ dựng `dmg` + `zip` (xem `electron-builder.yml`), nên **không cần**.
Chứng thư trung gian WWDR không cần xuất: tải lại tự do từ Apple.

---

## A5. Mã hoá toàn bộ trước khi rút USB (BẮT BUỘC)

Giờ trong `bi-mat/` có: khoá riêng SSH vào production, khoá Google
service-account, **và khoá riêng ký app của bạn**. Đánh rơi USB lúc này là mất
cả VPS lẫn danh tính nhà phát hành.

```bash
cd "$USB"
ls -R bi-mat                 # nhìn lại lần cuối xem đủ chưa
tar czf - bi-mat | gpg -c --cipher-algo AES256 -o bi-mat.tar.gz.gpg
# Nhập mật khẩu 2 lần. NHỚ KỸ — không có cách khôi phục.
rm -rf "$USB/bi-mat"      # ← lệnh xoá DUY NHẤT trong tài liệu này,
                          #   và nó xoá trên USB, KHÔNG phải trên Mac
ls -la "$USB"
```
✅ Mong đợi: còn `bi-mat.tar.gz.gpg` + `viec-do-dang/`, **không còn** `bi-mat/`.

Thử giải mã ngay, trước khi rút USB — đừng để phát hiện hỏng lúc đã ở máy khác:

```bash
gpg -d "$USB/bi-mat.tar.gz.gpg" | tar tzf - | head -20
```
✅ Mong đợi: liệt kê ra `bi-mat/env-backend`, `bi-mat/ssh/id_rsa`,
`bi-mat/apple/developer-id.p12`…

### 📌 Giữ BẢN THỨ HAI của gói này

USB hỏng là chuyện thường, và khoá riêng ký app thì **không tạo lại được**.
File `bi-mat.tar.gz.gpg` đã mã hoá AES256, nên chép thêm một bản vào trình quản
lý mật khẩu, ổ cứng ngoài, hoặc cloud riêng đều an toàn. **Đừng** đưa nó vào
git — repo này có `gitleaks` canh, nhưng đừng thử.

---

## A6. Kiểm lần cuối rồi mới rút USB

```bash
ls -R "$USB" | head -40
du -sh "$USB"
cd "$DA" && git status --short | head
```
✅ Mong đợi: `git status` trên Mac **giống hệt** kết quả ở A1. Nếu khác — dừng
lại, đừng rút USB, xem lại đã lỡ chạy lệnh gì.

Rút USB an toàn: `diskutil eject "$USB"`

---

# PHẦN B — TRÊN MÁY NHÀ LINUX

## B0. ⛔ NHỮNG THỨ TUYỆT ĐỐI KHÔNG ĐỤNG

Máy nhà **không phải máy trống**. Nó đang gánh production:

| Đang chạy | Hậu quả nếu đụng |
|---|---|
| `voice-training` (cổng 8090) | **cửa duy nhất của toàn bộ máy đọc** — tắt là cả web mất tiếng nói |
| `llm-server` Qwen3.5-9B (8100) | mất LLM local |
| `f5-tts` (8092) — giọng **tự train** | mất giọng riêng, và đây là thứ duy nhất **không tải lại được** |
| `tts-chatterbox` (8091) | mất giọng tiếng Anh |
| Đường hầm SSH ngược lên VPS | backend production mất đường gọi cả 4 dịch vụ trên |
| `~/cuongthai-build/` | thư mục làm việc của `deploy-nha.sh` |

**Bốn dịch vụ chiếm 11,3 GB trên card 12 GB.** Đừng chạy thêm gì ăn VRAM.

⛔ **KHÔNG khởi động lại máy** trừ khi đã chuẩn bị bật lại đủ 4 dịch vụ + đường hầm.
⛔ **KHÔNG đặt repo làm việc vào `~/cuongthai-build/`.** Bước dọn cuối
`deploy-nha.sh` chạy `cd ~/cuongthai-build && ls -1t | tail -n +4 | xargs -r rm -rf`
— **nó xoá mọi thứ trong đó trừ 3 mục mới nhất**. Đặt repo ở đấy là sớm muộn
cũng mất trắng, và mất trong im lặng.

Repo làm việc đặt ở `~/du-an/api-backend`.

---

## B1. Xem máy nhà là distro gì (quyết định cài app hay chỉ CLI)

```bash
cat /etc/os-release | head -3
dpkg --print-architecture 2>/dev/null || uname -m
free -g | head -2
df -h ~ | tail -1
nvidia-smi --query-gpu=memory.used,memory.total --format=csv
```
✅ Cần: Ubuntu 22.04+ / Debian 12+ và `amd64`/`arm64` thì cài được **app Claude
Desktop**. Distro khác ⇒ chỉ dùng **CLI**, vẫn đủ mọi chức năng.
✅ Đĩa trống nên ≥ 40G (deploy cần ≥20G, repo + node_modules ~10G).

---

## B2. Cài công cụ

```bash
sudo apt update
sudo apt install -y curl gnupg git ripgrep build-essential

# Node 22 (khớp CI và desktop workflow)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v          # ✅ v22.x

# Docker (nếu chưa có — máy nhà gần chắc chắn đã có sẵn vì nó build ảnh)
docker info >/dev/null 2>&1 && echo "✅ Docker đã chạy" || echo "⚠️ cần cài Docker"

# gh CLI
sudo apt install -y gh || echo "(cài theo hướng dẫn cli.github.com nếu apt không có)"
```

### Claude Code — chọn một hoặc cả hai

**App desktop (beta, chỉ Ubuntu 22.04+/Debian 12+):**
```bash
sudo curl -fsSLo /usr/share/keyrings/claude-desktop-archive-keyring.asc \
  https://downloads.claude.ai/claude-desktop/key.asc
gpg --show-keys /usr/share/keyrings/claude-desktop-archive-keyring.asc
# ✅ vân tay phải là 31DDDE24DDFAB679F42D7BD2BAA929FF1A7ECACE
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/claude-desktop-archive-keyring.asc] https://downloads.claude.ai/claude-desktop/apt/stable stable main" \
  | sudo tee /etc/apt/sources.list.d/claude-desktop.list
sudo apt update && sudo apt install -y claude-desktop
```

**CLI (mọi distro — khuyên cài kèm, vì các script deploy chạy lâu):**
```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
claude doctor
```

---

## B3. Lấy mã nguồn

```bash
mkdir -p ~/du-an && cd ~/du-an
git clone https://github.com/cuonghoang1103/api-backend.git
cd api-backend
git log --oneline -3
```

### Nạp lại việc còn dở từ USB

```bash
USB=/media/$USER/CHUYEN-MAY        # xem đường dẫn thật: lsblk -o NAME,MOUNTPOINT
cd ~/du-an/api-backend

# 1. Mọi commit chưa push từ Mac
git fetch "$USB/viec-do-dang/toan-bo-kho.bundle" '+refs/heads/*:refs/remotes/mac/*'
git branch -r | grep '^  mac/'          # xem có những nhánh gì từ Mac

# 2. Thay đổi chưa commit
git apply --check "$USB/viec-do-dang/chua-commit.patch" && \
  git apply "$USB/viec-do-dang/chua-commit.patch" && echo "✅ đã áp bản vá"

# 3. File mới chưa theo dõi
cp -av "$USB/viec-do-dang/file-moi/." ./

# 4. Đối chiếu bằng mắt với nguyên trạng bên Mac
echo "═══ Ở ĐÂY (Linux) ═══"; git status --short
echo "═══ BÊN MAC (chụp ở bước A1) ═══"; sed -n '1,/^---$/p' "$USB/viec-do-dang/nguyen-trang-mac.txt"
```

Hai danh sách phải khớp nhau. Lệch ⇒ thiếu bước nào đó ở A2, quay lại chép bù —
**USB vẫn còn nguyên, và Mac cũng vậy.**

---

## B4. Khôi phục file bí mật + đặt đúng quyền

```bash
cd /tmp && gpg -d "$USB/bi-mat.tar.gz.gpg" | tar xzf -
cd ~/du-an/api-backend

cp -v /tmp/bi-mat/env-backend           .env
cp -v /tmp/bi-mat/env-frontend-local    frontend/.env.local
cp -v /tmp/bi-mat/google-key*.json      frontend/src/config/ 2>/dev/null
cp -rv /tmp/bi-mat/firmware/.           firmware/ 2>/dev/null

mkdir -p ~/.ssh && chmod 700 ~/.ssh
cp -v /tmp/bi-mat/ssh/id_rsa ~/.ssh/ && chmod 600 ~/.ssh/id_rsa
cp -v /tmp/bi-mat/ssh/id_rsa.pub ~/.ssh/ && chmod 644 ~/.ssh/id_rsa.pub
cp -v /tmp/bi-mat/ssh/config ~/.ssh/ && chmod 600 ~/.ssh/config
cat /tmp/bi-mat/ssh/known_hosts >> ~/.ssh/known_hosts 2>/dev/null

chmod 600 .env frontend/.env.local
```

> ⚠️ **Không chép `bi-mat/apple/` ra máy Linux.** Chứng thư Developer ID chỉ
> dùng được trên macOS (`codesign`, `notarytool` không tồn tại ở đây), và để
> khoá riêng nằm giải mã trên một máy đang gánh production là rủi ro thừa. Nó
> cứ nằm yên trong gói `.gpg`, chờ Mac về — xem PHẦN D.

### 🔥 XOÁ BẢN GIẢI MÃ NGAY

```bash
rm -rf /tmp/bi-mat && ls /tmp/bi-mat 2>&1   # ✅ mong đợi "No such file"
```

### `deploy-nha.sh` cần máy nhà SSH được vào CHÍNH NÓ

Script vào máy nhà qua `Cuong03dx@192.168.1.102`. Chạy từ chính máy đó thì nó
tự SSH vào mình — phải có khoá:

```bash
ssh -o BatchMode=yes -o ConnectTimeout=4 Cuong03dx@192.168.1.102 true && echo "✅ tự vào được" || {
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ssh -o BatchMode=yes Cuong03dx@192.168.1.102 true && echo "✅ đã sửa xong"
}
```
❌ Không sửa được ⇒ `deploy-nha.sh` sẽ **âm thầm lùi** về `deploy.sh` và build
ngay trên VPS (chậm hơn ~8 phút, và rsync nguyên cây làm việc).

---

## B5. Cài thư viện

```bash
cd ~/du-an/api-backend
npm ci
npx prisma generate
(cd frontend && npm ci)
(cd desktop && npm ci)
```

> ⚠️ **Đừng bao giờ chép `node_modules/` từ Mac sang.** `sharp`, `esbuild`,
> `rollup` đều có bản nhị phân riêng cho `darwin-arm64` — chép sang Linux là
> lỗi câm lúc build.

---

## B6. BẢNG KIỂM — chạy hết, đối chiếu từng dòng

```bash
cd ~/du-an/api-backend
echo "═══ 1. Kiểu backend ═══"      ; npx tsc --noEmit && echo "✅"
echo "═══ 2. Kiểu seed ═══"         ; npm run typecheck:seed && echo "✅"
echo "═══ 3. Kiểu frontend ═══"     ; (cd frontend && npx tsc --noEmit) && echo "✅"
echo "═══ 4. Prisma khớp schema ═══"; npx prisma migrate diff \
    --from-schema-datasource prisma/schema.prisma \
    --to-schema-datamodel prisma/schema.prisma --script   # ✅ RỖNG = không trôi dạt
echo "═══ 5. Unit test ═══"         ; npm test 2>&1 | tail -5
echo "═══ 6. Cổng LLM ═══"          ; npm run llm:check 2>&1 | tail -15
echo "═══ 7. SSH vào VPS ═══"       ; ssh -i ~/.ssh/id_rsa -o ConnectTimeout=10 root@160.187.1.208 'hostname; df -h / | tail -1'
echo "═══ 8. gh CLI ═══"            ; gh auth status
echo "═══ 9. Docker ═══"            ; docker info >/dev/null && echo "✅ chạy"
echo "═══ 10. Đăng nhập GHCR ═══"   ; grep -q ghcr.io ~/.docker/config.json && echo "✅ có" || echo "⚠️ CHƯA — deploy-nha.sh sẽ dừng ở bước 1b"
echo "═══ 11. Production sống ═══"  ; curl -s -o /dev/null -w "%{http_code}\n" https://cuongthai.com/api/v1/system/health
echo "═══ 12. 4 dịch vụ GPU ═══"    ; for p in 8090 8091 8092 8100; do \
    printf "  cổng %s → " $p; curl -s -o /dev/null -w "%{http_code}\n" --max-time 3 http://localhost:$p/ || echo "im"; done
echo "═══ 13. VRAM ═══"             ; nvidia-smi --query-gpu=memory.used,memory.total --format=csv
```

**Diễn giải:**
- Mục 4 in ra bất cứ dòng SQL nào ⇒ schema đã trôi dạt, **đọc Migration Failure
  Protocol trong `CLAUDE.md`**, đừng tự sửa.
- Mục 6 báo model lùi về Claude ⇒ thiếu `LLM_GATEWAY_API_KEY_GPT` trong `.env`.
  Không chết, nhưng chạy đắt gấp 5,1 lần.
- Mục 10 thiếu ⇒ chạy một lần:
  `echo <TOKEN_write:packages> | docker login ghcr.io -u cuonghoang1103 --password-stdin`
- Mục 12 có cổng nào "im" ⇒ **dừng lại, hỏi trước khi làm gì.** Một dịch vụ
  chết là một mảng của web đang chết.

### Chạy thử local

```bash
docker compose up -d postgres          # CHỈ postgres, không phải cả compose
npm run dev                            # backend → localhost:3001
(cd frontend && npm run dev)           # frontend → localhost:3000
```
⛔ **Không** `docker compose up -d` trần — nó dựng cả `tts`, đâm nhau với 4 dịch
vụ GPU đang chạy thật.

---

# PHẦN C — QUY TẮC KHI DÙNG SONG SONG HAI MÁY

1. **`git pull` TRƯỚC KHI GÕ DÒNG ĐẦU TIÊN.** Mọi buổi, mọi máy.
2. **Commit + push TRƯỚC KHI RỜI MÁY.** Việc chưa commit không tự bay sang máy kia.
3. **Deploy chỉ bằng `deploy-nha.sh`.** Nó chỉ gửi mã **đã commit**. `deploy.sh`
   rsync nguyên cây làm việc — với hai máy thì rủi ro nhân đôi.
4. **Thêm biến env ở máy nào ⇒ làm đủ 4 chỗ**: `.env` máy này · `.env` máy kia ·
   `.env.example` (để lần sau còn nhớ) · `/opt/cuonghoangdev/.env` trên VPS.
5. **Phát hành app desktop chỉ bằng `(cd desktop && npm run phat-hanh -- "mô tả")`.**
   Nó tự chặn: nhánh sai · `desktop/` bẩn · đang sau `origin/main` · có lượt dựng
   đang chạy · số phiên bản đã công bố.
6. **Không bao giờ chép `node_modules/`, `dist/`, `.next/` giữa hai máy.**

---

# PHẦN D — KHI MACBOOK VỀ

Không phải chuyển ngược gì cả. Đúng ba bước:

```bash
cd ~/Downloads/api-backend
git status              # xem lại phần dang dở đang nằm trên Mac từ trước
git pull origin main    # lấy việc đã làm ở máy nhà
npm ci && (cd frontend && npm ci)   # nếu package-lock.json có đổi
```

Việc dang dở cũ trên Mac vẫn còn nguyên (ta chưa hề đụng vào). Nếu trong lúc đó
bạn đã làm xong phần đó ở máy nhà rồi thì lúc này mới quyết định bỏ nó đi —
`git checkout -- <file>` — và đó là quyết định của bạn, không phải của tài liệu này.

Chỉ cần copy tay sang Mac nếu ở máy nhà có **thêm biến env mới**.

## D1. Nếu tiệm đã wipe đĩa / đổi máy — nhập lại chứng thư Apple

Chỉ làm khi `security find-identity -v -p codesigning` **không còn** dòng
`Developer ID Application`. Còn nguyên thì bỏ qua, đừng nhập chồng.

```bash
cd /tmp && gpg -d /Volumes/CHUYEN-MAY/bi-mat.tar.gz.gpg | tar xzf -
shasum -a 256 /tmp/bi-mat/apple/developer-id.p12   # đối chiếu với van-tay.txt
```

Nhập vào keychain — `-T` khai trước những chương trình được dùng khoá này, nếu
không thì mỗi lần ký macOS lại hiện hộp thoại xin phép giữa chừng bản dựng:

```bash
security import /tmp/bi-mat/apple/developer-id.p12 \
  -k ~/Library/Keychains/login.keychain-db \
  -T /usr/bin/codesign -T /usr/bin/security
```
Nó hỏi mật khẩu bạn đặt ở bước A4.2/8.

Kiểm đã vào chưa — **đây mới là phép kiểm thật**, vì nó hỏi đúng công cụ mà
`ky-mac.mjs` sẽ hỏi:

```bash
security find-identity -v -p codesigning | grep 'Developer ID Application'
```
✅ Mong đợi: một dòng có mã SHA-1 40 ký tự + tên chứng thư + Team ID trong ngoặc.

Dựng lại hồ sơ notarytool (không nhập được, phải tạo mới — xem A4.5):

```bash
xcrun notarytool store-credentials "cuongthai-notary" \
  --apple-id "cuongthaihnhe176322@gmail.com" --team-id "<Team ID>"
# Nó hỏi app-specific password (trong notary.txt, hoặc tạo mới ở appleid.apple.com)
xcrun notarytool history --keychain-profile cuongthai-notary >/dev/null && echo "✅ hồ sơ dùng được"
```

Xoá bản giải mã:

```bash
rm -rf /tmp/bi-mat && ls /tmp/bi-mat 2>&1     # ✅ "No such file"
```

Thử ký mà **không** tốn lượt công chứng nào của Apple:

```bash
(cd desktop && npm run dist:mac:thu)
```
Chế độ thử ký bằng chứng thư bất kỳ đang có, bỏ công chứng, rồi mở thử app —
nó tồn tại để bắt lỗi Hardened Runtime, thứ hay làm hỏng bản ký hơn cả bước
công chứng. Xanh rồi mới chạy `npm run dist:mac:ky` thật.

---

# PHỤ LỤC — PROMPT GỬI CHO CLAUDE CODE TRÊN MÁY NHÀ

Copy nguyên khối dưới đây, dán vào Claude Code đang mở tại `~/du-an/api-backend`
trên máy nhà.

```text
Bối cảnh: MacBook của tôi đang đi sửa pin. Tôi vừa chuyển sang máy bàn Linux
này ("máy nhà") để làm tiếp dự án api-backend (cuongthai.com). Việc của bạn là
KIỂM TRA và SETUP môi trường dev ở đây, rồi BÁO CÁO. Không làm gì ngoài phạm vi
đó.

Việc đầu tiên: đọc CLAUDE.md và CHUYEN-MAY.md ở gốc repo. Hai file đó là nguồn
sự thật, mọi quy tắc trong đó đè lên phán đoán của bạn.

════ MÁY NÀY KHÔNG PHẢI MÁY TRỐNG ════
Máy nhà đang gánh production. Nó chạy 4 dịch vụ GPU chiếm 11,3/12 GB VRAM, mà
backend production gọi qua đường hầm SSH ngược lên VPS:
  - voice-training (8090) — CỬA DUY NHẤT của toàn bộ máy đọc. Tắt = cả web mất tiếng.
  - llm-server Qwen3.5-9B (8100)
  - f5-tts (8092) — giọng TỰ TRAIN, không tải lại được ở đâu
  - tts-chatterbox (8091)
Nó cũng là máy build ảnh Docker cho mọi lần deploy (~/cuongthai-build/).

════ TUYỆT ĐỐI KHÔNG ════
1. KHÔNG khởi động lại máy, không `systemctl restart/stop` bất cứ gì.
2. KHÔNG đụng vào ~/cuongthai-build/ — đó là thư mục của deploy-nha.sh, và
   bước dọn của nó xoá mọi thứ trong đó trừ 3 mục mới nhất.
3. KHÔNG chạy deploy.sh hay deploy-nha.sh. Không deploy gì hết.
4. KHÔNG push lên main. KHÔNG `git push --force` đi đâu cả.
5. KHÔNG chạy `npx prisma migrate reset`, `prisma db push`, hay
   `prisma migrate resolve`. Nếu thấy migration lỗi: DỪNG, báo tôi, theo đúng
   "Migration Failure Protocol" trong CLAUDE.md.
6. KHÔNG SSH vào MacBook, không cố với tay sang máy đó. Nó không ở đây.
7. KHÔNG chạy `docker compose up -d` trần — nó dựng service tts và đâm nhau
   với 4 dịch vụ GPU thật. Chỉ được `docker compose up -d postgres`.
8. KHÔNG chạy gì ăn VRAM. Card chỉ còn ~0,7 GB trống.
9. KHÔNG commit .env, .env.local, google-key*.json, secrets.h, hay khoá nào.
10. KHÔNG sửa file trong prisma/migrations/ đã deploy.
11. KHÔNG giải mã hay đụng tới phần `bi-mat/apple/` (chứng thư ký app của
    Apple). Nó chỉ dùng được trên macOS và không liên quan gì tới máy này.
    Nếu thấy file .p12 nằm giải mã đâu đó trên máy, báo tôi để tôi xoá.

════ VIỆC CẦN LÀM ════
GIAI ĐOẠN 1 — KIỂM TRA (chỉ đọc, làm hết rồi mới sang giai đoạn 2):
  a. Distro + kiến trúc + RAM + đĩa trống + VRAM đang dùng.
  b. Node (cần 22.x), npm, Docker (đang chạy?), git, gh (đã đăng nhập?), ripgrep.
  c. Các file bí mật đã có đủ chưa: .env, frontend/.env.local,
     frontend/src/config/google-key*.json, firmware/**/src/secrets.h.
     CHỈ báo tên file có/không và số lượng biến — TUYỆT ĐỐI không in giá trị,
     không in khoá, không in mật khẩu ra màn hình.
  d. ~/.ssh/id_rsa có tồn tại và quyền có phải 600 không.
  e. `ssh -o BatchMode=yes -o ConnectTimeout=4 Cuong03dx@192.168.1.102 true`
     — máy này có tự SSH vào chính nó được không (deploy-nha.sh cần).
  f. `grep -q ghcr.io ~/.docker/config.json` — đã đăng nhập GHCR chưa.
  g. 4 cổng GPU 8090/8091/8092/8100 có đang trả lời không.
  h. `curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/system/health`
  i. Trạng thái git: nhánh, thay đổi chưa commit, commit chưa push, có nhánh
     remote "mac/*" nào không (đó là việc dở tôi mang từ MacBook sang).

GIAI ĐOẠN 2 — SETUP (chỉ những gì giai đoạn 1 báo thiếu):
  - npm ci ở gốc, ở frontend/, ở desktop/
  - npx prisma generate
  - Cài công cụ còn thiếu qua apt
  - Nếu thiếu authorized_keys cho chính nó thì thêm khoá công khai của chính
    máy này vào ~/.ssh/authorized_keys (chỉ thêm, không ghi đè file)
  KHÔNG tự cài Docker hay đổi cấu hình hệ thống — báo tôi, để tôi quyết.

GIAI ĐOẠN 3 — XÁC MINH:
  npx tsc --noEmit
  npm run typecheck:seed
  (cd frontend && npx tsc --noEmit)
  npm test
  npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \
      --to-schema-datamodel prisma/schema.prisma --script     # rỗng = tốt
  npm run llm:check
  Đừng chạy `npm run build` của frontend trừ khi tôi bảo — nó ăn nhiều RAM và
  máy này đang gánh 4 dịch vụ.

GIAI ĐOẠN 4 — BÁO CÁO. Một bảng gồm:
  - Từng mục kiểm: ✅ đạt / ⚠️ thiếu nhưng chạy được / ❌ chặn việc
  - Việc bạn đã thực sự làm
  - Việc cần TÔI làm tay (token, khoá, quyết định)
  - Nếu có nhánh mac/* : tóm tắt phần việc còn dở tôi mang từ MacBook sang,
    liệt kê file nào đang sửa dở và đoán xem đang làm dở việc gì. ĐỪNG tự làm
    tiếp — chỉ tóm tắt để tôi chọn.

Nếu bất cứ bước nào ra kết quả bạn không chắc, hoặc phải làm gì nằm ngoài danh
sách trên: DỪNG và hỏi tôi. Máy này đang chạy thật, một lệnh sai là production
mất tiếng nói.
```
