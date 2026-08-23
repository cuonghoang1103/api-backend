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

### A3.1 — Mã hoá trước khi rút USB (BẮT BUỘC)

Trong đó có khoá riêng SSH vào production. Đánh rơi USB = mất VPS.

```bash
cd "$USB"
tar czf - bi-mat | gpg -c --cipher-algo AES256 -o bi-mat.tar.gz.gpg
# Nhập mật khẩu 2 lần. NHỚ KỸ — không có cách khôi phục.
rm -rf "$USB/bi-mat"          # ← lệnh xoá DUY NHẤT, và nó xoá trên USB, KHÔNG phải trên Mac
ls -la "$USB"
```
✅ Mong đợi: còn `bi-mat.tar.gz.gpg` và thư mục `viec-do-dang/`, **không còn**
thư mục `bi-mat/`.

---

## A4. Xuất chứng thư Apple (chỉ làm nếu bạn từng ký app macOS)

Chứng thư Developer ID nằm trong Keychain. **Nếu tiệm thay máy hoặc wipe đĩa
thì mất vĩnh viễn** — Apple không cấp lại, phải tạo chứng thư mới.

1. Mở **Keychain Access** → **login** → **My Certificates**
2. Tìm `Developer ID Application: ...`
3. Chuột phải → **Export** → định dạng `.p12` → đặt mật khẩu
4. Lưu vào `$USB/` rồi mã hoá tiếp như A3.1

> Không xuất được cũng **không chặn** việc gì: đường phát hành chuẩn
> `npm run phat-hanh` dựng bản macOS trên runner `macos-latest` của GitHub với
> `CSC_IDENTITY_AUTO_DISCOVERY=false` — tức là không ký. Chứng thư chỉ cần cho
> `npm run dist:mac:ky` chạy tay.

---

## A5. Kiểm lần cuối rồi mới rút USB

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
