# Bàn giao — 3 track Code Lab còn thiếu: SSH · Train AI với GPU · Mạng máy tính

> **Người nhận:** một phiên Claude Code khác, chạy song song với phiên đang làm
> robot/giọng nói. Hai phiên **không đụng nhau về file** (xem mục Ranh giới).
>
> **Ngày viết:** 11/08/2026
> **Người yêu cầu:** Cường — *"Phần này tôi rất thích học để làm chủ hệ thống như này"*

---

## 1. Vì sao có tài liệu này

Ngày 11/08/2026, trong lúc dựng máy train giọng nói, Cường đi qua một loạt
tình huống thật: quên mật khẩu Fedora phải cứu qua GRUB, SELinux chặn
`authorized_keys`, hai máy ở hai dải mạng khác nhau, `sudo` không chạy được
qua SSH vì thiếu TTY, đo VRAM để biết có train nổi không.

Xong việc, anh ấy hỏi: **"phần này liên quan đến cái gì, tôi muốn học sâu hơn"**
và **"xem trong codelab, courses đã có chưa?"**

Đã kiểm cơ sở dữ liệu production. Kết quả:

| Chủ đề | Trạng thái trên site |
|---|---|
| SSH / điều khiển máy từ xa | ❌ **Không có track riêng.** `Linux & Bash` chỉ chạm qua |
| Mạng máy tính | ⚠️ `Networking Fundamentals` tồn tại nhưng **DRAFT** |
| Train AI, GPU, VRAM | ❌ **Trống hoàn toàn.** Không một track nào |

Ba lỗ hổng này rơi đúng vào thứ anh ấy vừa làm và đang muốn học. Đó là toàn
bộ lý do của tài liệu này.

---

## 2. Ranh giới với phiên đang chạy — ĐỌC TRƯỚC KHI ĐỘNG VÀO GÌ

Có một phiên khác **đang làm dở** robot Maker Lab + hệ giọng nói. Để hai bên
không giẫm chân:

**KHÔNG được đụng vào:**

```
src/services/makerlab/**        services/tts/**
src/socket/device.gateway.ts    src/routes/voiceMini.routes.ts
frontend/src/app/voice-mini/**  frontend/src/components/maker-lab/**
firmware/**                     hardware/**
docker-compose.yml              deploy.sh
```

**Được toàn quyền:**

```
content/codelab/**              (nội dung mới, tự tạo thư mục)
scripts/codelab-*.mjs           (chỉ ĐỌC để hiểu; đừng sửa)
docs/handoff/**
```

⚠️ **`deploy.sh` rsync CÂY LÀM VIỆC, không phải commit.** Nghĩa là file bạn
tạo ra sẽ lên production ngay lần deploy kế tiếp của phiên kia, kể cả khi bạn
chưa commit. Hệ quả:

- **ĐỪNG tạo file dở dang rồi để đó.** Viết xong mới lưu.
- **ĐỪNG tự chạy `bash deploy.sh`.** Kiểm `pgrep -f "bash deploy.sh"` trước
  khi làm bất cứ việc gì nặng; đang chạy thì chờ.
- Seed nội dung bằng script (mục 6), không qua deploy.

---

## 3. Chất lượng phải đạt — đây là phần quan trọng nhất

Cường **không cần** thêm một bộ tài liệu chép từ `man page`. Thứ anh ấy cần
là những gì chỉ có được khi đã tự tay làm hỏng rồi sửa.

### Nguyên tắc: mỗi bài phải trả lời được "vì sao nó hỏng như thế"

Bài kém: *"Dùng `chmod 600 ~/.ssh/authorized_keys` để đặt quyền."*

Bài tốt: *"SSH **từ chối im lặng** khoá nếu `authorized_keys` cho người khác
đọc được — không báo lỗi, chỉ hỏi mật khẩu như thể bạn chưa từng thêm khoá.
Cùng triệu chứng đó còn ba nguyên nhân khác nữa, và cách phân biệt là…"*

Khác biệt: bài đầu chép tài liệu, bài sau tiết kiệm cho người đọc một buổi tối.

### Kho chuyện thật từ 11/08 — DÙNG NGUYÊN, đây là vốn quý nhất

Mọi thứ dưới đây đã xảy ra thật trong một buổi, có ảnh chụp màn hình và log:

1. **Quên mật khẩu Fedora.** `rd.break` không ăn thua vì **Fedora khoá sẵn tài
   khoản `root`** → `sulogin` báo *"Cannot open access to console, the root
   account is locked"*. Dạy được: sự khác nhau giữa dracut shell, systemd
   emergency, và `init=/bin/bash`.

2. **Sửa dòng lệnh GRUB làm hỏng boot.** GRUB bẻ dòng dài bằng dấu `\`, và
   `root=UUID=1a1af067-0972-4e89-b9\` `62-83b397aec5d7` bị cắt làm đôi giữa
   màn hình. Con trỏ lạc vào đó là UUID gãy → systemd quay sang `gpt-auto-root`
   → hết giờ → emergency mode. Dạy được: cách kernel tìm phân vùng gốc, vì
   sao dùng phím `End` chứ đừng mò bằng mũi tên.

3. **SELinux chặn `authorized_keys`.** Đổi mật khẩu từ chroot mà quên
   `touch /.autorelabel` thì đăng nhập vẫn hỏng, mà lỗi báo ra chẳng liên quan
   gì tới SELinux. Dạy được: nhãn bảo mật là gì, `restorecon`, `getenforce`.

4. **Hai máy hai dải mạng.** Mac `192.168.83.101`, máy bàn `192.168.1.102`.
   Quét cổng 22 cả dải không thấy gì. Dạy được: subnet, gateway, bảng định
   tuyến, vì sao "cùng Wi-Fi" chưa chắc là "cùng mạng".

5. **`sudo` chết qua SSH.** `sudo: a terminal is required to read the password`.
   Script tự động gãy dù máy đã cài đủ gói. Dạy được: TTY là gì, vì sao SSH
   không cấp TTY khi chạy lệnh không tương tác, `ssh -t`, và **cách đúng**:
   kiểm trước rồi mới gọi `sudo`.

6. **VRAM là thứ chặn, không phải tốc độ.** Tài liệu VieNeu khuyên ≥12 GB và
   lấy ví dụ "RTX 3060" — nhưng **3060 Ti chỉ có 8 GB còn 3060 thường mới có
   12 GB**. Card mạnh hơn lại ít bộ nhớ hơn. Dạy được: vì sao `CUDA out of
   memory` là dừng hẳn chứ không phải chạy chậm.

7. **Đo RTF trên VPS.** VieNeu 0,77–1,06 · Piper 0,13–0,35 trên cùng con VPS
   4 nhân. Số thật, đo bằng script. Dạy được: RTF là gì, vì sao RTF ≥ 1 làm
   robot lặp từ, vì sao thêm CPU không cứu được (3→4 nhân chỉ nhanh hơn 14%).

### 3b. Bài giảng đắt nhất — "vì sao VPS vào được mà máy nhà thì không"

Đây là câu Cường tự hỏi sau khi mọi thứ đã chạy, và cách trả lời nó là
**phần hay nhất của cả Track A lẫn Track C**. Dựng nguyên cấu trúc này.

**Câu hỏi mở bài** *(để nguyên, đừng viết lại thành định nghĩa)*:

> VPS cũng là Linux. Sao SSH vào VPS thì từ đâu cũng được, mà SSH vào máy
> Linux ở nhà lại phải cùng mạng?

**Phép chứng minh — chạy thật trên ba máy, ra số ngay trước mắt:**

```bash
hostname -I                      # địa chỉ máy tự biết về mình
curl -s https://api.ipify.org    # địa chỉ thế giới nhìn thấy
```

Kết quả thật ngày 11/08:

| Máy | IP nội bộ | IP thế giới thấy |
|---|---|---|
| Linux ở nhà | `192.168.1.102` | `123.16.55.115` |
| Mac ở nhà | `192.168.1.101` | **`123.16.55.115`** ← giống hệt |
| VPS | `160.187.1.208` | **`160.187.1.208`** ← một số duy nhất |

Hai dòng đầu **cùng một IP ngoài** → cả nhà đi chung một cổng, đó là NAT.
Dòng cuối **hai số trùng nhau** → VPS không đứng sau cổng nào.

**Cái bẫy nhận thức phải phá — quan trọng hơn mọi định nghĩa trong bài:**

Người học (và chính Cường lúc đầu) sẽ kết luận *"tại chưa biết địa chỉ"*.
**Sai.** Bằng chứng có sẵn: địa chỉ `192.168.1.102` đã được đưa từ trước, đã
thử, và vẫn hỏng:

```
192.168.1.102 → khong ping duoc
192.168.1.102:22 → dong
```

Biết địa chỉ. Có chìa khoá. Vẫn không vào được. **Vì thiếu con đường.**

Từ đó rút ra mô hình ba phần — nên là xương sống của cả Module 3 Track A:

| | | Máy nhà (trước khi sửa) | VPS |
|---|---|---|---|
| 1 | **Địa chỉ** — gõ cửa số mấy | ✅ có | ✅ |
| 2 | **Đường đi** — có lối tới cửa đó | ❌ **thiếu** | ✅ |
| 3 | **Chìa khoá** — mở được khi tới | ✅ có | ✅ |

Ba việc Cường làm để sửa, ánh xạ đúng ba dòng trên: chuyển Mac sang cùng
mạng (đường đi — **cái then chốt**), gửi `hostname -I` (địa chỉ), dán khoá
vào `authorized_keys` (chìa khoá). **Bỏ việc đầu thì hai việc sau vô nghĩa.**

**Ví von đã kiểm chứng là hiểu được** *(Cường tự đề xuất "hai nhà cùng con
phố", và chỗ chỉnh lại chính là chỗ sáng ra)*:

> `192.168.1.102` **không phải địa chỉ nhà — nó là số phòng.**
> Địa chỉ thật là `123.16.55.115`, và cả nhà dùng chung đúng một cái đó.
> Bên trong có Mac phòng .101, Linux phòng .102, nhưng người ngoài phố chỉ
> thấy **một cái cổng**. Đứng ngoài gửi thư "cho phòng 102" thì bảo vệ chịu,
> không biết đưa ai. Đứng trong sân thì gõ cửa phòng nào cũng được.
> VPS thì không có cổng chung nào — nó **là** căn nhà mặt phố.

**Chốt lại bằng NAT một chiều**, và để nó dẫn thẳng sang bài đường hầm ngược:

- Trong ra ngoài → được. Router nhớ ai gọi để trả lời đúng máy.
- Ngoài vào trong → không. Gói tin tới `123.16.55.115` thì router biết đưa
  cho Mac hay Linux? Không có căn cứ nào để quyết, nên nó vứt.

Nên đường hầm ngược không phải mẹo vặt mà là **hệ quả trực tiếp** của điều
đó: người trong nhà đi ra thì bảo vệ cho qua, vậy bảo máy Linux **tự đi ra**
trước rồi giữ nguyên đường đó. Đường đã mở thì đi được cả hai chiều.
TeamViewer, Tailscale, ngrok đều làm đúng thế, chỉ gói lại cho đẹp.

---

## 4. Ba track cần làm

### Track A — `SSH & Remote Server` (ưu tiên 1)

`groupSlug: "devops"` · `language: "bash"` · `level: "beginner"` → `intermediate`

Vì sao ưu tiên 1: Cường vừa sống qua đủ mọi cái bẫy hôm nay. Viết lúc còn
nóng thì ví dụ nào cũng thật.

| Module | Nội dung cốt lõi |
|---|---|
| 1. SSH thật ra là gì | Một tiến trình nghe cổng 22, nhận chữ, trả chữ. Bắt tay, thương lượng thuật toán, kênh mã hoá |
| 2. Khoá công khai | Vì sao dán `.pub` lên mạng cũng không sao. Khoá riêng không bao giờ rời máy. Thử thách–đáp án. `ssh-keygen`, `ssh-copy-id`, `authorized_keys` |
| 3. Bốn kiểu "không vào được" | Sai mạng · sai quyền file · sai nhãn SELinux · sai cấu hình sshd. **Cùng triệu chứng, khác cách chữa.** `ssh -vvv` đọc thế nào |
| 4. `~/.ssh/config` | Bí danh, `IdentityFile`, `ServerAliveInterval`, `ProxyJump` |
| 5. Không có TTY | Vì sao `sudo` chết, `ssh -t`, và cách viết script không cần `sudo` |
| 6. Chuyển file | `scp`, `rsync`, vì sao `rsync` là thứ `deploy.sh` dùng |
| 7. Đường hầm | Chuyển tiếp cổng xuôi/ngược, `-L`/`-R`, dùng VPS làm điểm hẹn cho máy sau NAT |
| 8. Giữ phiên sống | `tmux`, `nohup`, systemd service cho việc chạy dài |
| 9. Siết bảo mật | Tắt đăng nhập mật khẩu, đổi cổng, `fail2ban`, vì sao **đừng** tắt mật khẩu sudo |

### Track B — `Train AI với GPU` (ưu tiên 2)

`groupSlug: "ai"` (tạo mới nếu chưa có) · `language: "python"` · `level: "intermediate"`

Mảng trống hoàn toàn, mà Cường sắp train thật với RTX 3060 12 GB.

| Module | Nội dung cốt lõi |
|---|---|
| 1. Vì sao GPU | 12 luồng CPU vs 3.584 nhân GPU. Nhân ma trận song song. Khi nào GPU **không** giúp |
| 2. VRAM mới là trần | Trọng số + activation + gradient + trạng thái optimizer. Vì sao OOM là dừng hẳn. Ước lượng trước khi chạy |
| 3. Driver, CUDA, PyTorch | Ba tầng và cách chúng khớp nhau. `nvidia-smi`. **Vì sao `pip install torch` trần kéo về bản CUDA vài GB** và cách ép bản CPU |
| 4. Dữ liệu quyết định | Vì sao 2–4 giờ audio sạch thắng 20 giờ audio bẩn. Nhãn phải khớp 100% lời nói |
| 5. Fine-tune vs train từ đầu | Vì sao gần như luôn chọn fine-tune |
| 6. LoRA | Đóng băng model gốc, train vài triệu tham số phụ. `r`, `alpha`, `target_modules` |
| 7. Khi hết VRAM | Thang hạ dần: batch → tích luỹ gradient → checkpointing → 4-bit. Mỗi bước đổi gì lấy gì |
| 8. Đọc số lúc train | Loss, learning rate, warmup. Nhận ra overfit |
| 9. Đưa model vào chạy thật | Xuất ONNX, lượng tử hoá, **RTF** — vì sao model đẹp mà RTF ≥ 1 là vô dụng cho việc thời gian thực |

### Track C — `Networking Fundamentals` (ưu tiên 3)

**Đã tồn tại, đang DRAFT.** Đọc nội dung hiện có trước, bù chỗ thiếu rồi
xuất bản — đừng viết lại từ đầu.

Bắt buộc phải có, vì Cường đã vấp: subnet và mask · gateway và bảng định
tuyến · **vì sao `192.168.1.x` và `192.168.83.x` không thấy nhau** · NAT ·
cổng · DNS · vì sao máy sau NAT cần đường hầm ngược.

---

## 5. Quy ước soạn nội dung

Đọc trước khi viết dòng nào:

- `content/codelab/` — xem các track đã soạn tay để bắt chước giọng văn
- `scripts/codelab-create-track.mjs` — phần đầu file mô tả **hình dạng JSON**
- `scripts/codelab-seed-authored.mjs` — nạp bài đã soạn, **không gọi LLM**

Luật nội dung:

1. **Tiếng Việt**, giọng như đang giải thích cho đồng nghiệp — không dịch máy,
   không văn phong tài liệu.
2. **Mọi lệnh phải chạy được thật.** Có output thì phải là output chạy thật,
   đừng bịa. Không chạy được thì đừng đưa vào.
3. **Bài tập phải có thể tự chấm** — kiểm bằng chuỗi khớp hoặc mã thoát.
4. **Mỗi module mở đầu bằng một triệu chứng thật**, không mở bằng định nghĩa.
   *"Bạn thêm khoá SSH xong mà nó vẫn hỏi mật khẩu"* hay hơn *"SSH là giao
   thức…"* rất nhiều.
5. **Escape HTML**: `->` → `-&gt;`, `>=`/`<=`/`@>` phải escape. Thẻ `.out`
   luôn phải đóng `</div>`.

---

## 6. Đưa lên production

```bash
# 1. Tạo khung track (không gọi LLM, chạy lại nhiều lần vô hại)
node scripts/codelab-create-track.mjs --file /tmp/track-ssh.json --dry
node scripts/codelab-create-track.mjs --file /tmp/track-ssh.json --apply

# 2. Nạp bài đã soạn tay
node scripts/codelab-seed-authored.mjs --dir content/codelab/ssh --apply
```

Cả hai đều **thuần dữ liệu**, không khởi động lại gì, nên chạy được cả khi
phiên kia đang làm việc.

⚠️ **Đừng tự deploy.** Soạn xong, seed xong, báo Cường. Phiên kia sẽ đưa lên
trong lần deploy chung.

Kiểm sau khi seed:

```bash
ssh root@160.187.1.208 'docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db -tAF" | " -c \
 "select name, status from code_tracks where slug in (\"ssh\",\"ai-training\",\"networking\");"'
```

---

## 7. Bắt đầu từ đâu

1. Đọc mục 3 — kho chuyện thật. **Đó là thứ làm ba track này khác mọi tài
   liệu ngoài kia.**
2. Đọc một track Code Lab đã xuất bản (`Linux & Bash` hoặc `Docker`) để nắm
   giọng văn và độ sâu.
3. Làm **Track A trước**, và **làm xong Module 1–3 rồi đưa Cường xem** trước
   khi viết tiếp — hợp gu thì mới làm nốt, không thì sửa sớm còn kịp.

Đừng làm cả ba track cùng lúc. Một track xong hẳn, có người đọc thật, hơn ba
track dở dang.
