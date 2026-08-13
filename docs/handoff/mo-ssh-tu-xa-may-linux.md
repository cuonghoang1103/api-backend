# Prompt cho Claude Code chạy TRÊN máy Linux ở nhà (12/08/2026)

Chép nguyên khối dưới đây, dán vào Claude Code đang chạy trên máy Fedora.

---

Bạn đang chạy trên máy để bàn Fedora 44, người dùng `Cuong03dx`, có card
NVIDIA RTX 3060. Máy này chạy hai dịch vụ systemd **mức người dùng**:

- `tts-vieneu` — máy đọc văn bản thành tiếng, bám `127.0.0.1:8090`
- `tunnel-vps` — đường hầm SSH ngược ra VPS `160.187.1.208`, hiện chở
  đúng một cổng: `-R 172.18.0.1:18080:127.0.0.1:8090`

Con robot ESP32 của chủ máy đọc bằng dịch vụ này qua đường hầm đó.

## Nhiệm vụ

**Việc A — chở thêm cổng SSH qua đường hầm**, để máy Mac của chủ vào
được máy này từ bất kỳ đâu (hiện chỉ vào được khi cùng mạng LAN).

**Việc B — khởi động lại `tts-vieneu`**, vì khoá mô hình của nó đang bị
một việc treo giữ chặt: `/health` trả lời tức thì nhưng `/tts-stream`
treo hết 60 giây và không ra byte nào.

## ⛔ ĐIỀU KIỆN BẮT BUỘC — kiểm TRƯỚC, sai thứ tự là hỏng nặng

Đường hầm chạy với `ExitOnForwardFailure=yes`. Nếu nó xin mở một cổng mà
VPS **chưa** cho phép, nó **thoát hẳn** — kéo theo cả dịch vụ đọc, và
con robot mất giọng cho tới khi có người sửa tay.

Nên phải xác nhận phía VPS đã nới quyền TRƯỚC:

```bash
ssh root@160.187.1.208 'grep -o "permitlisten=\"[^\"]*\"" ~/.ssh/authorized_keys'
```

Phải thấy **ĐỦ HAI** dòng:

```
permitlisten="172.18.0.1:18080"
permitlisten="127.0.0.1:2222"
```

- Thấy đủ hai → làm tiếp.
- **Chỉ thấy một** → DỪNG LẠI. Không được sửa gì trên máy này. Báo chủ
  máy chạy lệnh này trước (nếu bạn tự chạy được thì chạy, nhưng sửa
  `authorized_keys` có thể bị chặn — bị chặn thì đừng lách, cứ báo):

```bash
ssh root@160.187.1.208 'cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.bak && sed -i "s|permitlisten=\"172.18.0.1:18080\"|permitlisten=\"172.18.0.1:18080\",permitlisten=\"127.0.0.1:2222\"|" ~/.ssh/authorized_keys && grep -o "permitlisten=\"[^\"]*\"" ~/.ssh/authorized_keys'
```

## Việc A — thêm cổng vào đường hầm

1. Đọc file unit trước khi sửa, và **in ra dòng `ExecStart` hiện tại**:

```bash
cat ~/.config/systemd/user/tunnel-vps.service
```

2. Sao lưu:

```bash
cp ~/.config/systemd/user/tunnel-vps.service ~/.config/systemd/user/tunnel-vps.service.bak
```

3. Thêm `-R 127.0.0.1:2222:127.0.0.1:22` vào `ExecStart`, ngay sau cái
   `-R` đang có. **Giữ nguyên mọi tuỳ chọn khác** — đặc biệt là
   `-i ~/.ssh/tunnel_vps`, `-o IdentitiesOnly=yes`,
   `-o ExitOnForwardFailure=yes`, `-o ServerAliveInterval=30`,
   `-o ServerAliveCountMax=3`, và `Restart=always`.

```bash
sed -i 's|-R 172.18.0.1:18080:127.0.0.1:8090|-R 172.18.0.1:18080:127.0.0.1:8090 -R 127.0.0.1:2222:127.0.0.1:22|' ~/.config/systemd/user/tunnel-vps.service
```

   ⚠️ Nếu `ExecStart` thật khác chuỗi trên (xuống dòng, thứ tự khác) thì
   `sed` sẽ **không khớp và không báo lỗi**. Kiểm bằng `diff` với bản sao
   lưu, thấy đúng một dòng đổi mới đi tiếp:

```bash
diff ~/.config/systemd/user/tunnel-vps.service.bak ~/.config/systemd/user/tunnel-vps.service
```

4. Nạp lại và khởi động:

```bash
systemctl --user daemon-reload
systemctl --user restart tunnel-vps
sleep 3
systemctl --user is-active tunnel-vps
```

5. Nếu nó **không** `active`, đọc lý do rồi KHÔI PHỤC NGAY:

```bash
journalctl --user -u tunnel-vps --since "-2 min" --no-pager | tail -20
cp ~/.config/systemd/user/tunnel-vps.service.bak ~/.config/systemd/user/tunnel-vps.service
systemctl --user daemon-reload && systemctl --user restart tunnel-vps
```

   Khôi phục xong thì báo chủ máy kèm nguyên văn lý do trong log. Đừng
   thử đi thử lại.

## Việc B — khởi động lại máy đọc

```bash
systemctl --user restart tts-vieneu
```

Nó nạp mô hình mất khoảng 45 giây. Chờ rồi kiểm.

## Kiểm chứng — làm ĐỦ cả ba, đừng dừng ở cái đầu

⚠️ `/health` trả 200 **không chứng minh được gì**: nó không cần khoá mô
hình, nên nó vẫn 200 y nguyên trong lúc bộ đọc kẹt cứng. Đúng cái bẫy đã
làm mất mấy giờ chẩn đoán hôm nay. Phải kiểm tới lúc **ra tiếng thật**.

**1. Dịch vụ sống:**

```bash
systemctl --user is-active tts-vieneu tunnel-vps
ss -tln | grep -E '8090'
```

**2. Sinh được tiếng THẬT** — đây mới là phép kiểm có giá trị:

```bash
time curl -s --max-time 60 -X POST http://127.0.0.1:8090/tts-stream \
  -H 'Content-Type: application/json' \
  -d '{"text":"Xin chào anh, em đã sẵn sàng.","voice":"Khánh Linh Ver 3","style":"tu_nhien"}' \
  -o /tmp/kiem.pcm
ls -l /tmp/kiem.pcm
```

Đạt khi: file **lớn hơn 100.000 byte** và lệnh xong **dưới 10 giây**.
File 0 byte hoặc chạy hết 60 giây = vẫn kẹt → báo chủ máy, đừng tự đoán.

Nếu báo `Voice ... not found` thì liệt kê giọng đang có rồi báo lại:

```bash
curl -s http://127.0.0.1:8090/voices | head -c 600
```

**3. Cổng SSH đã ra tới VPS:**

```bash
ssh root@160.187.1.208 "ss -tln | grep 2222"
```

Phải thấy một dòng `LISTEN ... 127.0.0.1:2222`.

## Xong thì in ra một khối tóm tắt

Gồm đúng bốn thứ, để chủ máy chép về:

- `systemctl --user is-active tts-vieneu tunnel-vps` cho ra gì
- Kích thước `/tmp/kiem.pcm` và thời gian chạy
- Kết quả `ss -tln | grep 2222` trên VPS
- Nguyên văn `ExecStart` sau khi sửa

## Những điều KHÔNG được làm

- **Không** mở cổng trên router, không chuyển tiếp cổng, không đổi
  `sshd_config` để nghe ra ngoài. Cổng 2222 kia chỉ bám localhost của
  VPS — đó là chủ ý, đừng "cải tiến".
- **Không** tạo lại khoá `~/.ssh/tunnel_vps`. Nó là **RSA**, không phải
  ed25519, vì VPS đặt `PubkeyAcceptedAlgorithms ssh-rsa,rsa-sha2-*` và
  từ chối ed25519 với thông báo chỉ vỏn vẹn "Permission denied".
- **Không** đụng vào driver NVIDIA / CUDA. Nó đang chạy tốt.
- **Không** xoá hay ghi đè `~/.ssh/authorized_keys` trên máy này.
- **Không** cài thêm gì. Việc này chỉ sửa một dòng và khởi động lại hai
  dịch vụ.
- Có bước nào hỏng thì **khôi phục từ bản sao lưu rồi báo**, đừng thử
  phương án khác — đường hầm này là thứ duy nhất giữ cho con robot còn
  giọng.
