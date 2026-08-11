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

### 3c. Chuỗi khởi động Linux — dạy bằng chính lúc nó gãy

Ngày 11/08 hệ thống gãy ở **ba tầng khác nhau** của chuỗi khởi động, mỗi lần
ra một triệu chứng khác. Đó là giáo trình sẵn: thay vì vẽ sơ đồ rồi bảo học
thuộc, đi từng tầng và cho xem nó hỏng thì màn hình hiện gì.

```
Nguồn → UEFI/BIOS → GRUB → nhân Linux → initramfs → switch_root
      → systemd → target đăng nhập → phiên đồ hoạ
```

| Tầng | Nó làm gì | Hôm nay hỏng ra sao |
|---|---|---|
| **UEFI** | Tìm bộ nạp khởi động trên phân vùng EFI | Vào được, `F11` chọn USB — chứng minh tầng này lành |
| **GRUB** | Nạp nhân + initramfs, truyền tham số dòng lệnh | Sửa tay làm gãy `root=UUID=…` |
| **Nhân** | Nhận diện phần cứng, dựng thiết bị | `nvme0n1: p1` — nhân thấy đĩa, nên đĩa không hỏng |
| **initramfs** | Hệ thống tệp tạm trong RAM, đủ sức tìm và gắn ổ thật | Không tìm ra gốc → `Timed out waiting for /dev/gpt-auto-root` |
| **switch_root** | Chuyển từ initramfs sang ổ thật | Không tới được bước này |
| **systemd** | Khởi động dịch vụ theo target | Rơi vào `emergency.target` |
| **sulogin** | Xin mật khẩu root cho shell khẩn cấp | *"the root account is locked"* — Fedora khoá sẵn root |

**Ba điểm dạy được, không sách nào nói rõ bằng:**

1. **`root=UUID=…` là dây rốn.** Nhân không biết ổ nào là ổ gốc; nó **được
   bảo**. Mất tham số đó thì systemd quay sang đoán bằng `gpt-auto-root`
   (dò theo mã loại phân vùng GPT) — và hết giờ. Log nói thẳng ra điều đó,
   chỉ cần biết đọc.

2. **Vì sao GRUB bẻ dòng lại nguy hiểm.** Dòng `linux` dài hơn màn hình nên
   GRUB gấp khúc và đánh dấu bằng `\`. UUID bị cắt làm đôi giữa hai dòng
   hiển thị. Con trỏ lạc vào đó là hỏng. **Cách an toàn: bấm `End` để nhảy
   tới cuối dòng LOGIC, đừng bao giờ mò bằng mũi tên phải.**

3. **`rd.break` và `init=/bin/bash` khác nhau ở đâu.** `rd.break` dừng
   *trong initramfs* rồi nhờ **systemd** cấp shell — mà systemd gọi
   `sulogin`, và `sulogin` đòi mật khẩu root. Fedora khoá root → cụt đường.
   `init=/bin/bash` thì bảo **nhân** chạy thẳng `bash` làm tiến trình số 1,
   **không có systemd nên không có ai để mà hỏi**. Hiểu chỗ này là hiểu vì
   sao cách thứ hai qua được chỗ cách thứ nhất chết.

### 3d. Bảy thứ cản đường — mỗi thứ một bài học riêng

**1. `/home` rỗng — Btrfs subvolume**

`ls /mnt/sys/home` không ra gì, trông như mất dữ liệu. Thực ra Fedora chia ổ
thành **hai subvolume**: `root` cho `/` và `home` riêng. Gắn `subvol=root` thì
`/home` chỉ là thư mục rỗng chờ subvolume kia gắn đè.

Dạy được: subvolume khác partition thế nào (không cần chia trước, chung một
kho dung lượng), vì sao Fedora làm thế (snapshot `/` mà không đụng `/home`),
và **cách tránh hoảng**: `btrfs subvolume list /mnt/sys` xem có gì trước khi
kết luận mất dữ liệu.

**2. `chroot` — mượn hệ điều hành khác làm của mình**

```bash
for d in dev proc sys run; do mount --bind /$d /mnt/sys/$d; done
chroot /mnt/sys
```

`chroot` đổi gốc hệ thống tệp cho tiến trình. Nhưng `/dev`, `/proc`, `/sys`
**không phải file trên đĩa** — chúng là cửa sổ nhìn vào nhân đang chạy. Ổ
cứng chỉ có thư mục rỗng ở đó. Không bind-mount thì `passwd` chạy được nhưng
`dnf` và `systemctl` thì không, vì chúng cần hỏi nhân.

Dạy được: hệ thống tệp ảo là gì, vì sao container cũng dùng đúng cơ chế này
(Docker chính là chroot + namespace + cgroup), và vì sao `chroot` **không
phải** máy ảo.

**3. `^[[200~` — dán vào shell không hiểu dán**

Dán lệnh vào bash trong chroot thì ra `bash: syntax error near unexpected
token 'do'`, và đầu dòng có `^[[200~`. Đó là **bracketed paste**: terminal
bọc nội dung dán giữa hai mã điều khiển để shell biết "đây là dán, không
phải gõ". Bash trong chroot chưa nạp cấu hình readline nên không hiểu, coi
mã đó là chữ.

Dạy được: mã escape ANSI, khác nhau giữa terminal và shell, vì sao trong môi
trường cứu hộ nên **gõ tay** thay vì dán.

**4. KDE Wallet đòi mật khẩu cũ**

Đổi mật khẩu từ ngoài xong, đăng nhập được, nhưng KDE Wallet vẫn hỏi mật khẩu
— **mật khẩu cũ**. Vì kho đó **mã hoá bằng chính mật khẩu đăng nhập cũ**;
bình thường lúc đăng nhập hệ thống lấy mật khẩu bạn vừa gõ để mở kho. Đổi từ
bên ngoài thì hệ thống cho vào mà kho vẫn khoá bằng khoá cũ.

Dạy được — và đây là bài học lớn hơn nhiều so với KDE: **đổi mật khẩu không
giải mã lại được dữ liệu đã mã hoá bằng mật khẩu cũ**. Đúng cơ chế đó áp
dụng cho LUKS, cho `ecryptfs`, cho keychain của macOS. Biết nguyên tắc này
thì hiểu luôn vì sao ổ mã hoá toàn phần mà quên mật khẩu là **mất thật**,
không có cửa sau nào.

**5. `sudo` chết qua SSH — không có TTY**

```
sudo: a terminal is required to read the password
```

`ssh may 'lệnh'` **không cấp thiết bị đầu cuối**, vì nó chạy lệnh rồi thoát
chứ không mở phiên tương tác. `sudo` cần TTY để hỏi mật khẩu mà không lộ ra
màn hình. Không có TTY → không hỏi được → chết.

Dạy được: TTY là gì, `ssh -t` ép cấp, vì sao script tự động **không nên** cần
`sudo`, và **cách viết đúng**: kiểm trước rồi mới gọi `sudo`. Chính script
`01-dung-moi-truong.sh` trong repo này đã dính rồi phải sửa — dùng làm ví dụ
trước/sau.

**6. Việc chạy dài qua SSH chết theo phiên — bài học đắt nhất về SSH**

Chạy phép đo VRAM bằng `ssh maytrain 'bash -s' < script.sh`. Sau hơn một
tiếng tải dữ liệu, mạng chớp một cái:

```
Read from remote host 192.168.1.102: Operation timed out
client_loop: send disconnect: Broken pipe
exit=255
```

Mất sạch. Lý do: lệnh chạy qua SSH là **con của phiên SSH**. Phiên chết thì
tiến trình nhận `SIGHUP` và chết theo — đúng nghĩa đen của "hang up", cái tên
có từ thời modem quay số.

Chi tiết hay để dạy: **tiến trình Python con lại SỐNG SÓT** (`pgrep` vẫn thấy
nó chạy) trong khi script bash bao ngoài đã chết. Vì sao? Nó đang bận trong
một lời gọi hệ thống và không xử lý tín hiệu ngay. Kết quả tệ nhất có thể:
việc vẫn chạy nhưng **không còn ai chờ kết quả**.

Cách chữa, và học viên phải làm được cả ba:

| Cách | Dùng khi |
|---|---|
| `setsid nohup lệnh > log 2>&1 < /dev/null &` | Việc chạy một lần, không cần xem trực tiếp |
| `tmux new -d -s ten 'lệnh'` | Cần quay lại xem tiến trình đang chạy tới đâu |
| systemd service | Việc phải tự chạy lại sau khi máy khởi động |

Điểm mấu chốt của cách đầu: `setsid` tách hẳn khỏi nhóm phiên nên `SIGHUP`
không tới được, `< /dev/null` để nó không chờ bàn phím, và **ghi log ra file
TRÊN MÁY ĐÓ** chứ không phải chảy về máy điều khiển — mất mạng thì log vẫn còn
nguyên.

Bài học chung: **đừng để việc chạy hàng giờ phụ thuộc vào một sợi dây mạng
phải sống suốt hàng giờ.**

**Đủ là dừng — đừng tải cả bộ chỉ để đo**

Cùng sự cố trên còn lộ ra một lỗi thiết kế nữa: script tải cả **7.000 mẫu**
(~12 giờ tiếng) chỉ để chạy **20 bước train** — vốn chỉ đụng tới vài chục
mẫu. CDN của HuggingFace hết giờ liên tục và đó chính là thứ làm đứt phiên.

Sửa: kiểm trước, có sẵn ≥200 mẫu thì bỏ qua bước tải. Nguyên tắc — *phép đo
dùng lượng dữ liệu tối thiểu đủ để đo, không phải toàn bộ dữ liệu thật.*

**7. Fedora chặn cổng 22, Ubuntu thì không**

Cài `openssh-server` và `systemctl enable --now sshd` xong vẫn không vào
được, vì `firewalld` của Fedora chặn sẵn. Phải thêm
`firewall-cmd --permanent --add-service=ssh`.

Dạy được: tường lửa hoạt động ở đâu trong chồng mạng, khác nhau giữa "dịch
vụ không chạy" và "dịch vụ chạy nhưng bị chặn" — hai thứ **cùng triệu chứng
`Connection refused`/timeout** nhưng chữa khác hẳn. Phân biệt bằng
`ss -tlnp | grep :22` chạy **trên chính máy đó**.

### 3e. Bài học hệ thống từ chính con robot — vàng cho Track B và cho DevOps

Mấy thứ này rút ra từ việc sửa robot cùng ngày, và chúng dạy được những
nguyên lý mà bài học lý thuyết rất khó truyền đạt:

**1. Ghìm nhịp sai chỗ — `bufferedAmount` là bộ đệm CỦA AI?**

Nhạc phát ra loa robot bị giật và cụt giữa bài. Mã cũ ghìm bằng
`ws.bufferedAmount > 256KB`. Nghe hợp lý, thực ra vô dụng: đó là bộ đệm gửi
**của server**, còn chỗ tràn là vòng đệm 512 KB **trên bo mạch**. Kernel và
ngăn xếp WiFi nuốt hàng megabyte trước khi TCP kịp ghìm ngược, nên con số đó
gần như luôn bằng 0 trong lúc bo đang vứt dữ liệu.

Cách chữa: **ghìm theo đồng hồ**. Loa chạy đúng 32.000 byte/giây, không nhanh
hơn được, nên cứ bơm trước 4 giây rồi ngồi đợi.

Dạy được: backpressure là gì, vì sao **đo sai chỗ còn tệ hơn không đo**, và
nguyên tắc chung — *khi ghép một nguồn nhanh với một cái đích chạy thời gian
thực, hãy ghìm theo tốc độ của ĐÍCH, đừng ghìm theo trạng thái của mình.*

**2. Đừng tin điểm tự chấm của model**

Whisper có trường `no_speech_prob` — chính model tự chấm khả năng đoạn tiếng
không có người nói. Nghe như món quà. Log production: **bốn mươi dòng bịa
liên tiếp, tất cả đều `no_speech_prob: 0.00`**, trong đó có câu mười ba âm
tiết sinh ra từ **0,42 giây** tiếng quạt.

Thay bằng bằng chứng vật lý: miệng người có trần tốc độ, nên chia số âm tiết
cho số giây là bắt được ngay.

Dạy được: vì sao điểm tự tin của model không phải xác suất đúng, và nguyên
tắc — *ưu tiên ràng buộc vật lý hơn lời model tự khai.*

**3. Health check không được làm việc nặng**

`/health` của dịch vụ TTS **cố ý không nạp model** (nạp mất 43 giây). Nạp thì
healthcheck đỏ suốt nửa phút đầu, Docker tưởng dịch vụ chết và giết đi, rồi
lặp lại mãi.

Dạy được: liveness và readiness khác nhau, `start_period` để làm gì, vì sao
health check phải rẻ.

**4. Request HTTP dài quá là chết dọc đường**

5.000 ký tự là ~5,5 phút sinh tiếng. Một request giữ mở suốt sáu phút sẽ bị
nginx cắt trước khi tới đích. Nên phải tách thành **đặt việc → hỏi lại**.

Dạy được: timeout ở từng tầng (trình duyệt, nginx, ứng dụng), vì sao việc dài
cần hàng đợi, và mã trạng thái **202 Accepted** — chỗ này đã dính lỗi thật:
lúc đầu trả 200 cho cả "đang chạy" lẫn "xong", và bên gọi lưu nguyên 37 byte
JSON ra file `.wav` rồi tưởng đã xong.

**5. Đừng mở cổng ra Internet nếu không bắt buộc**

Container `tts` **không có `ports:`** trong docker-compose. Nó chỉ tồn tại
trong mạng nội bộ Docker, Node gọi vào bằng tên `http://tts:8080`. Một lượt
sinh chiếm gần trọn ba nhân CPU — hở ra Internet là tặng người lạ cái nút tắt
máy chủ.

Dạy được: mạng Docker, phân giải tên theo tên dịch vụ, nguyên tắc bề mặt tấn
công tối thiểu, và vì sao **proxy qua backend có xác thực** là mẫu đúng.

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

#### Chi tiết cần có trong Track B — số thật, không ước lượng

**Chồng phần mềm bốn tầng.** Người mới luôn tưởng chỉ có "PyTorch". Thực ra:

```
model của bạn  →  PyTorch  →  cuDNN / cuBLAS / cuSPARSE  →  driver NVIDIA  →  card
                             (2,5 GB thư viện tải về)      (610.43.03)      (3060)
```

Lệch tầng nào cũng ra `CUDA not available` mà không nói vì sao. Cách chẩn:
`nvidia-smi` lành → driver ổn; `torch.cuda.is_available()` sai → tầng PyTorch
lệch driver. Cho học viên xem thật 2,5 GB đó tải về (cuBLAS 567 MB, cuSPARSE
275 MB, cuSOLVER 255 MB, cuFFT 184 MB, triton 148 MB…).

**Cái bẫy `pip install torch`.** Trên Linux, lệnh trần **kéo về bản CUDA** —
vài GB thư viện NVIDIA. Đúng trên máy có card, **sai hoàn toàn trên server
không card**: image Docker phình từ 2 GB lên 6–7 GB. Cách ép bản CPU:

```bash
pip install --index-url https://download.pytorch.org/whl/cpu torch==2.6.0+cpu
```

Ví dụ thật trong repo: `services/tts/Dockerfile` ép bản CPU (VPS không card),
còn `hardware/voice-training/01-dung-moi-truong.sh` dùng `uv sync --group gpu`
(máy có card). **Cùng một thư viện, hai lựa chọn ngược nhau, vì hai máy khác
nhau** — đó là bài học.

**Kiểu số: fp32 / fp16 / bf16 / int8 / 4-bit.** Không phải chuyện "nhẹ hơn
thì kém hơn", mà là đánh đổi giữa dải giá trị và độ chính xác. Điểm mấu chốt:
**bf16 cần Ampere trở lên** — 3060 là Ampere nên chạy được, card đời cũ hơn
thì phải quay về fp16 và dễ tràn số khi train. Cấu hình VieNeu để `bf16: True`
chính vì thế.

**Vì sao 3060 (12 GB) hơn 3060 Ti (8 GB) cho việc này.** Ti mạnh hơn về tính
toán nhưng ít bộ nhớ hơn. Với train thì **bộ nhớ là trần cứng**: thiếu một
byte là dừng hẳn, không có chuyện chạy chậm hơn. Đây là chỗ ngược trực giác
nhất của cả track, và Cường đã suýt mua nhầm hướng vì tưởng máy mình là Ti.

**Audio thành token — vì sao TTS đời mới là LLM.** VieNeu dùng NeuCodec biến
sóng âm thành chuỗi mã rời rạc, rồi một model kiểu Qwen sinh chuỗi mã đó y
như sinh chữ, cuối cùng codec dựng ngược lại thành sóng. Hiểu chỗ này thì
hiểu luôn vì sao họ model đó **nhân bản giọng được** (chỉ cần vài giây làm
ngữ cảnh) mà lại **chậm** (mỗi 20 ms tiếng là một lượt forward) — trong khi
họ VITS như Piper nhanh gấp bảy nhưng không nhân bản được.

**RTF — thước đo quyết định dùng được hay không.**

```
RTF = thời gian sinh ÷ độ dài tiếng sinh ra
```

Số thật đo trên VPS 4 nhân ngày 11/08:

| | RTF | Kết luận |
|---|---|---|
| VieNeu v3 Turbo (ONNX int8) | **0,77 – 1,06** | ❌ robot lặp từ |
| Piper (VITS) | **0,13 – 0,35** | ✅ dư 7 lần |

Và chỗ phản trực giác: **thêm CPU gần như không cứu được** — 3 nhân lên 4
nhân (+33%) chỉ nhanh hơn **14%**. Nút thắt nằm ở bản thân phép tính chứ
không ở số nhân. Dạy được: định luật Amdahl bằng số đo thật thay vì công thức.

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
