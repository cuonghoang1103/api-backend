# Prompt cho Claude Code chạy TRÊN máy Linux

Chép nguyên khối dưới đây, dán vào Claude Code đang chạy trên máy Fedora.

---

Bạn đang chạy trên máy để bàn Fedora 44 KDE Plasma, tên máy `CuongThai`,
người dùng `Cuong03dx`, có card NVIDIA RTX 3060 12 GB (driver 610.43.03).
Máy này sẽ dùng để huấn luyện mô hình giọng nói, và được điều khiển từ xa
qua SSH từ một máy Mac trong cùng mạng LAN.

Nhiệm vụ: làm cho máy này **luôn sẵn sàng nhận SSH**, kể cả khi không ai
ngồi trước màn hình, và **giữ nguyên được sau mỗi lần khởi động lại**.
Chủ máy muốn treo máy chạy liên tục; chỉ mất điện hoặc chính họ tắt thì
mới dừng.

Sau mỗi bước, HÃY CHẠY LỆNH KIỂM CHỨNG rồi in ra kết quả thật — đừng báo
"đã xong" dựa vào việc lệnh không báo lỗi. Nhiều thiết lập ở đây có thể
chạy trót lọt mà vẫn không có tác dụng.

## 1. Chặn ngủ / treo ở mức hệ thống

Đây là thứ quan trọng nhất. Máy tự treo là SSH đứt, và nhìn từ xa thì nó
giống hệt máy hỏng.

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

Kiểm chứng — cả bốn phải trả về `masked`:

```bash
systemctl is-enabled sleep.target suspend.target hibernate.target hybrid-sleep.target
```

## 2. Chặn systemd-logind tự treo khi rảnh

Sửa `/etc/systemd/logind.conf`, đặt (bỏ dấu `#` nếu dòng đang bị chú thích):

```
IdleAction=ignore
HandleLidSwitch=ignore
HandlePowerKey=poweroff
```

Rồi `sudo systemctl restart systemd-logind`.

⚠️ Khởi động lại `systemd-logind` có thể làm rớt phiên đồ hoạ đang mở.
Báo trước cho chủ máy, hoặc để lại tới cuối cùng rồi khởi động lại máy.

Kiểm chứng: `sudo systemd-analyze cat-config systemd/logind.conf | grep -E "IdleAction|HandleLid"`

## 3. Tắt tự treo của KDE PowerDevil

Máy này chạy **KDE Plasma**, KHÔNG phải GNOME — mọi hướng dẫn dùng
`gsettings org.gnome.settings-daemon.plugins.power` đều vô dụng ở đây
(đã thử, trả về `No such schema`).

Với KDE dùng `kwriteconfig6` (Plasma 6) hoặc sửa thẳng
`~/.config/powermanagementprofilesrc`. Cần đặt cho hồ sơ `AC`:

- Không treo máy khi rảnh
- Không tắt màn hình cũng được — **màn hình tắt hay khoá KHÔNG ảnh hưởng
  SSH**, đừng nhầm hai chuyện này. Chủ máy nói "màn hình cứ tự khoá suốt"
  nhưng đó không phải nguyên nhân mất kết nối; cứ để khoá cho an toàn.

Kiểm chứng: in ra nội dung `~/.config/powermanagementprofilesrc` sau khi
sửa, và xác nhận mục `[AC][SuspendSession]` không còn đặt treo máy.

## 4. sshd luôn bật khi khởi động + tường lửa mở cổng 22

```bash
sudo systemctl enable --now sshd
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

Kiểm chứng:

```bash
systemctl is-enabled sshd; systemctl is-active sshd
sudo firewall-cmd --list-services | tr ' ' '\n' | grep -x ssh
ss -tlnp | grep :22
```

## 5. Giữ nguyên địa chỉ để Mac gọi được sau khi khởi động lại

Máy Mac hiện gọi bằng tên `CuongThai.local` (mDNS) chứ không phải IP, nên
IP có đổi cũng không sao — **miễn là avahi chạy**.

```bash
sudo systemctl enable --now avahi-daemon
sudo firewall-cmd --permanent --add-service=mdns
sudo firewall-cmd --reload
```

Kiểm chứng: `systemctl is-enabled avahi-daemon` và
`avahi-resolve -n CuongThai.local`.

Nếu vì lý do nào đó mDNS không dùng được, phương án hai là đặt IP tĩnh
`192.168.1.102` bằng NetworkManager — nhưng phải kiểm dải DHCP của router
trước, đặt trùng dải cấp phát là gây xung đột địa chỉ về sau.

## 6. Không cho SELinux chặn khoá SSH sau khi cập nhật

Máy này từng mất quyền SSH một lần. Đảm bảo nhãn đúng và ghi lại cách tự
sửa:

```bash
restorecon -Rv ~/.ssh
ls -laZ ~/.ssh
```

`authorized_keys` phải mang nhãn `ssh_home_t`, quyền `600`, thư mục `700`.

## 7. Một lệnh tự kiểm, để lần sau khỏi mò

Tạo `~/kiem-tra-may.sh` (chmod +x) in ra một lượt: trạng thái sleep
targets, sshd, firewalld, avahi, nhãn `~/.ssh`, `nvidia-smi`, uptime.
Chạy nó sau khi làm xong tất cả và **dán nguyên kết quả ra cho người
dùng đọc**.

## 8. Cuối cùng: KHỞI ĐỘNG LẠI rồi kiểm lại

Đây là bước duy nhất chứng minh mọi thứ "giữ nguyên sau khởi động lại" —
mà đó chính là yêu cầu gốc. Hỏi chủ máy trước khi khởi động lại. Sau khi
máy lên, chạy lại `~/kiem-tra-may.sh` và so với kết quả trước đó.

## Những điều KHÔNG được làm

- **Không** bật đăng nhập root qua SSH, không tắt `PasswordAuthentication`
  (tắt đi mà khoá lỗi là mất luôn đường vào máy).
- **Không** mở cổng ra Internet, không cấu hình chuyển tiếp cổng trên
  router. Máy này chỉ cần dùng trong mạng LAN.
- **Không** cài lại driver NVIDIA hay đụng vào CUDA — nó đang chạy tốt
  (`nvidia-smi` trả về RTX 3060, driver 610.43.03). Đây là chỗ dễ làm hỏng
  cả máy nhất trên Fedora.
- **Không** tự ý xoá hay ghi đè `~/.ssh/authorized_keys`. Chỉ được thêm.

## Bối cảnh: máy này sẽ dùng làm gì

Huấn luyện và chạy mô hình đọc văn bản thành tiếng (VieNeu / Piper) bằng
giọng riêng của chủ máy. VPS hiện chạy được nhưng chậm — đo thật hôm
11/08/2026 cho RTF 2,11, tức sinh 4,5 giây tiếng mất 9,5 giây. Trên RTX
3060 dự kiến nhanh hơn 10-20 lần, đủ để một con robot ESP32 nói thời gian
thực bằng giọng đó.

Nên đừng cài gì nặng ngoài phạm vi trên, và giữ đĩa trống — dataset âm
thanh sẽ chiếm chỗ.

---

# PHẦN BỔ SUNG (12/08/2026) — giữ dịch vụ giọng nói luôn sống

Đã dựng xong và ĐANG CHẠY, nhưng **chưa sống sót qua khởi động lại**.
Hai thứ cần thành `systemd` service. Cả hai đều chạy dưới người dùng
`Cuong03dx`, không cần root — nhưng cần `loginctl enable-linger` để
chúng chạy cả khi chưa ai đăng nhập, và lệnh đó thì cần `sudo`.

## 1. Dịch vụ TTS (đang chạy tay)

```
thư mục   ~/voice-training
lệnh      .venv/bin/uvicorn app:app --host 127.0.0.1 --port 8090 --workers 1
biến      VIENEU_VOICES_FILE=$HOME/voice-training/models/voices.json
          VIENEU_BACKEND=pytorch
          VIENEU_DEVICE=cuda
```

⚠️ Cổng **8090**, KHÔNG phải 8080 — 8080 đã bị một Apache Tomcat chiếm.
⚠️ Chỉ bám `127.0.0.1`. Đừng mở ra LAN, càng đừng mở ra Internet.

Đo thật trên máy này: RTF **0,187** (sinh 4,8 giây tiếng mất 0,9 giây),
so với 2,11 trên VPS. Đó là lý do tồn tại của cả phần này.

## 2. Đường hầm SSH ngược về VPS

```
ssh -N -i ~/.ssh/tunnel_vps -o IdentitiesOnly=yes \
    -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=30 -o ServerAliveCountMax=3 \
    -R 172.18.0.1:18080:127.0.0.1:8090 root@160.187.1.208
```

Khoá `~/.ssh/tunnel_vps` là **RSA**, không phải ed25519 — VPS đặt
`PubkeyAcceptedAlgorithms ssh-rsa,rsa-sha2-*` nên khoá ed25519 bị từ
chối thẳng với thông báo chỉ vỏn vẹn "Permission denied". Đừng tạo lại
bằng ed25519.

Phía VPS, khoá này bị khoá chặt trong `authorized_keys`:
`restrict,port-forwarding,permitlisten="172.18.0.1:18080",command="/bin/false"`
— nó chỉ mở được đúng một cổng, không làm được gì khác.

`Restart=always` và `RestartSec=10` là bắt buộc: mạng nhà rớt là đường
hầm chết, mà chết im lặng.

## 3. Thứ tự phụ thuộc

Đường hầm phải khởi động SAU dịch vụ TTS (`After=`, `Wants=`). Ngược lại
thì `ExitOnForwardFailure=yes` làm nó thoát ngay vì chưa có gì ở 8090.

## 4. Kiểm chứng — chạy sau khi làm xong VÀ sau khi khởi động lại

```bash
systemctl --user is-active tts-vieneu tunnel-vps
curl -s http://127.0.0.1:8090/health
ss -tln | grep 8090
```

Rồi báo người dùng để họ nhờ kiểm từ phía VPS — chỉ khi container backend
trên VPS gọi được `http://172.18.0.1:18080/health` thì mới coi là xong.
