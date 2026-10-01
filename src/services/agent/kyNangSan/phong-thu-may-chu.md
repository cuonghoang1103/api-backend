---
name: phong-thu-may-chu
description: Web bị IP lạ dòm ngó, quét lỗ hổng, spam, brute-force, DDoS: đọc log tìm kẻ gây hại, chặn đúng tầng (Cloudflare → tường lửa → nginx → fail2ban → app), không tự khoá cửa SSH.
---

# KỸ NĂNG: PHÒNG THỦ MÁY CHỦ — điều tra trước, chặn đúng tầng, giữ cửa SSH

Mục tiêu: biết CHÍNH XÁC đang bị gì (bằng số liệu từ log), chặn ở tầng rẻ nhất mà vẫn hiệu quả, chứng minh được
là đã đỡ — và trong suốt quá trình, người dùng vẫn vào được trang của họ lẫn SSH của họ.

## 0. Luật vàng (đọc trước mọi thứ)

1. **Chỉ máy chủ, tên miền, tài khoản Cloudflare CỦA NGƯỜI DÙNG.** Không quét ngược, không "trả đũa", không DDoS lại,
   không dò cổng IP của kẻ tấn công. Tra thông tin công khai của một IP (whois, quốc gia, nhà mạng) thì được.
2. **Đọc trước, sửa sau.** Bước 2 (điều tra) chỉ chạy lệnh đọc. Chưa có số liệu thì chưa chặn gì cả — chặn theo cảm giác
   là cách nhanh nhất để chặn nhầm người dùng thật mà kẻ tấn công vẫn còn nguyên.
3. **GIỮ CỬA SSH.** Trước mọi thay đổi tường lửa: mở sẵn cổng SSH (kể cả cổng phụ nếu máy có, vd 993), giữ phiên SSH
   đang mở, đặt hẹn giờ tự hoàn tác (mục 4). Tự khoá mình ngoài máy chủ là sự cố tệ hơn chính vụ tấn công.
4. **Mỗi thay đổi đi kèm lệnh hoàn tác**, ghi ngay trong câu trả lời. Không thay đổi nào "không quay lại được".
5. **Nói thật về DDoS băng thông lớn:** VPS không tự đỡ được (mục 6). Đừng hứa "đã chặn DDoS" chỉ vì vừa thêm một luật ufw.

## 1. Phân loại — đang bị CÁI GÌ?

| Triệu chứng trong log | Loại | Nguy hiểm | Tầng chặn hợp lý |
|---|---|---|---|
| Hàng loạt 404 vào `/wp-admin`, `/.env`, `/.git/config`, `/phpmyadmin`, `/vendor/phpunit`, `*.php` | **Bot quét lỗ hổng** | Thấp nếu không có file đó — chủ yếu ồn log. NGUY HIỂM nếu có cái nào trả 200 | nginx trả 444 + fail2ban |
| Nhiều `POST /login`, `/auth/*` từ ít IP, toàn 401 | **Dò mật khẩu** | Cao | rate limit app + fail2ban + khoá tài khoản tạm |
| Nhiều `POST` vào form liên hệ/đăng ký/bình luận, nội dung rác | **Spam form** | Trung bình | captcha (Turnstile), honeypot, rate limit |
| Một vài IP đọc tuần tự hàng nghìn trang | **Cào dữ liệu (scrape)** | Thấp–trung bình | rate limit nginx, chặn UA/ASN |
| Hàng nghìn req/giây, nhiều IP, CPU/RAM vọt, trang chậm | **Tràn tầng ứng dụng (L7 flood)** | Cao | Cloudflare WAF/rate limit + nginx limit_req |
| Mạng nghẹt, `ss -s` hàng chục nghìn kết nối SYN, log nginx lại ÍT | **DDoS băng thông / SYN flood** | Rất cao | CHỈ Cloudflare / nhà cung cấp — xem mục 6 |

"Dòm ngó từ IP nước ngoài" phần lớn là **bot quét tự động** — mọi IP công khai trên Internet đều bị quét vài phút một
lần. Đó là chuyện bình thường; việc cần làm là chắc chắn KHÔNG có gì để chúng tìm thấy, và giảm tiếng ồn.

## 2. Điều tra (CHỈ ĐỌC)

### 2.1 Log ở đâu
- nginx chạy thẳng trên máy: `/var/log/nginx/access.log` (+ `.1`, `.2.gz` cũ hơn).
- nginx trong Docker (ảnh chính thức): log đi ra stdout ⇒ `docker logs --since 24h <tên_container_nginx>`.
- Trước khi đếm, xem `log_format` trong `nginx.conf` để biết cột nào là IP / đường dẫn / mã trạng thái / user-agent.

Trong các lệnh dưới, `L` là nguồn log (`cat /var/log/nginx/access.log` hoặc `docker logs --since 24h nginx 2>&1`),
định dạng `combined` (IP là cột 1, đường dẫn cột 7, mã cột 9):

```bash
# Top 20 IP
L | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
# Top đường dẫn bị gọi (bỏ query string)
L | awk '{split($7,a,"?"); print a[1]}' | sort | uniq -c | sort -rn | head -30
# Phân bố mã trạng thái
L | awk '{print $9}' | sort | uniq -c | sort -rn
# Đường dẫn dò lỗ hổng — và quan trọng hơn: cái nào KHÔNG trả 404?
L | grep -Ei 'wp-|\.env|\.git|phpmyadmin|\.php|/vendor/|/cgi-bin|/actuator|/\.aws' | awk '{print $9, $7}' | sort | uniq -c | sort -rn | head -30
# Một IP cụ thể đã làm gì
L | grep '^1\.2\.3\.4 ' | awk '{print $9, $6, $7}' | sort | uniq -c | sort -rn | head
# Số request theo PHÚT (thấy đỉnh tấn công)
L | awk '{print substr($4,2,17)}' | sort | uniq -c | sort -k2 | tail -60
# User-agent hay gặp
L | awk -F'"' '{print $6}' | sort | uniq -c | sort -rn | head -20
```

Kết nối đang mở (DDoS tầng mạng hay không): `ss -s`, `ss -tn state syn-recv | wc -l`,
`ss -tn | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head`.

Tra IP (thông tin công khai): `curl -s https://ipinfo.io/1.2.3.4` (quốc gia, nhà mạng/ASN) hoặc `whois 1.2.3.4`.

### 2.2 ⚠️ IP trong log có phải IP THẬT không?
Kiểm `curl -sI https://ten-mien | grep -i 'cf-ray\|server: cloudflare'`. Có ⇒ trang đi qua **Cloudflare**, và cột IP
trong log nginx là **IP của Cloudflare**, không phải của khách — trừ khi nginx đã cấu hình `real_ip` (mục 3.3).
Chặn "IP gọi nhiều nhất" lúc đó là CHẶN CLOUDFLARE = chặn TẤT CẢ người dùng.

Tương tự sau một reverse proxy: rate limit trong app phải lấy IP từ đúng chỗ (mục 3.5).

### 2.3 Có gì đang bị lộ không? (quan trọng hơn chặn IP)
- Một đường dẫn dò lỗ hổng trả **200** ⇒ sự cố thật: `/.env`, `/.git/config`, file backup `.sql`/`.zip` trong thư mục web.
  Kiểm từ ngoài: `curl -s -o /dev/null -w '%{http_code}' https://ten-mien/.env` (mong đợi 404/403).
- Cổng đang mở ra Internet: trên máy `ss -tlnp`; cổng DB (5432, 3306, 6379, 27017) KHÔNG được nghe ở `0.0.0.0`.
  Docker `ports: "5432:5432"` mở thẳng ra ngoài BẤT CHẤP ufw (mục 3.2).

## 3. Chặn theo tầng — từ ngoài vào trong

### 3.1 Cloudflare (tầng đầu tiên và là tầng DUY NHẤT đỡ được DDoS lớn)
Miễn phí, đặt trước VPS, lọc trước khi gói tin tới máy:
- DNS bản ghi của trang ở chế độ **Proxied** (đám mây cam). SSL/TLS: **Full (strict)**.
- **Security → WAF → Custom rules:** chặn/thử thách (Managed Challenge) theo quốc gia, ASN, đường dẫn
  (vd `http.request.uri.path contains "/wp-"` ⇒ Block). Thử thách an toàn hơn chặn hẳn cho người thật.
- **Rate limiting rules:** vd 100 req/10s mỗi IP vào `/api/` ⇒ chặn 10 phút.
- **Bot Fight Mode**, và khi đang bị dồn dập: **Under Attack Mode** (tạm, vì nó bắt mọi khách chờ kiểm tra vài giây).
- **Khoá cửa sau:** VPS chỉ nhận cổng 80/443 từ dải IP Cloudflare (https://www.cloudflare.com/ips-v4 và /ips-v6), nếu
  không kẻ tấn công biết IP gốc sẽ đi vòng qua Cloudflare. Giấu IP gốc: không để bản ghi DNS nào khác (mail, ftp, tên miền
  phụ không proxied) trỏ thẳng IP VPS.
- Thao tác trên dashboard Cloudflare: người dùng tự bấm, hoặc cấp API token phạm vi hẹp (Zone → WAF/Firewall: Edit).
  KHÔNG tự đổi DNS/chế độ proxy khi chưa được đồng ý — đổi sai là trang chết.

### 3.2 Tường lửa máy chủ (ufw / iptables)
```bash
ufw status numbered                       # XEM trước
ufw insert 1 deny from 1.2.3.4            # chặn 1 IP — "insert 1" để đứng TRƯỚC các luật allow
ufw insert 1 deny from 1.2.3.0/24         # cả dải
# hoàn tác: ufw status numbered → ufw delete <số>
```
⚠️ **Docker bỏ qua ufw.** Cổng do Docker `ports:` mở đi qua chain riêng, luật `ufw deny` KHÔNG chặn được. Với container
(nginx trong Docker…), chặn ở chain `DOCKER-USER`:
```bash
iptables -I DOCKER-USER -s 1.2.3.4 -j DROP            # hoàn tác: iptables -D DOCKER-USER -s 1.2.3.4 -j DROP
iptables -L DOCKER-USER -n --line-numbers            # xem
```
Luật iptables mất khi khởi động lại — muốn giữ thì `iptables-save` qua `iptables-persistent`, hoặc để fail2ban quản lý.
Nhiều IP (hàng nghìn, hay cả quốc gia) ⇒ `ipset` một tập + một luật, không phải hàng nghìn luật.
Chặn CẢ QUỐC GIA: chỉ khi người dùng đồng ý rõ (họ có thể có khách ở đó) — và làm ở Cloudflare thì dễ hoàn tác hơn.

### 3.3 nginx
- **IP thật sau Cloudflare** (nếu có Cloudflare — làm TRƯỚC mọi luật theo IP ở nginx/fail2ban):
  `set_real_ip_from <từng dải Cloudflare>;` + `real_ip_header CF-Connecting-IP;` — và chỉ tin header đó khi cổng gốc đã
  khoá chỉ cho Cloudflare (3.1), nếu không ai cũng tự đặt được header.
- **Giới hạn tần suất:** `limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;` + trong `location`
  `limit_req zone=api burst=100 nodelay;` và **`limit_req_status 429;`** (mặc định 503 — trông như máy chủ sập).
  Đăng nhập chặt hơn hẳn (vd `20r/m`, burst 5). Kết nối đồng thời: `limit_conn_zone` + `limit_conn`.
- **Đuổi bot quét, tốn 0 tài nguyên:** trả 444 (nginx đóng kết nối, không gửi gì):
  `location ~* (^/wp-|/\.env|/\.git|phpmyadmin|/vendor/phpunit|\.php$) { return 444; }` — chỉ khi trang KHÔNG chạy PHP.
- Chặn IP/UA tay: một file `include /etc/nginx/chan.conf;` chứa `deny 1.2.3.4;` (dễ thêm/bớt, dễ hoàn tác).
- Luôn `nginx -t` TRƯỚC `nginx -s reload` (trong Docker: `docker exec <nginx> nginx -t`).
- ⚠️ Cấu hình nginx bind-mount một FILE ĐƠN vào container: sửa bằng ghi đè tại chỗ (`cat moi > nginx.conf`), KHÔNG
  `mv`/`sed -i`/`rsync` — chúng tạo inode mới, container vẫn đọc file cũ, `nginx -t` và `reload` báo OK mà không đổi gì.
  Kiểm bằng `sha256sum` file trên host so với `docker exec <nginx> sha256sum /etc/nginx/nginx.conf`.

### 3.4 fail2ban — tự cấm IP theo hành vi
Cài: `apt-get install -y fail2ban`. Cấu hình trong `/etc/fail2ban/jail.local` (KHÔNG sửa `jail.conf`):
```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 10
ignoreip = 127.0.0.1/8 ::1 <IP_CỦA_NGƯỜI_DÙNG>

[sshd]
enabled = true

[nginx-botsearch]
enabled = true
# Bộ lọc này khớp được cả access.log lẫn error.log tuỳ phiên bản fail2ban —
# chạy fail2ban-regex trên CẢ HAI (bên dưới) rồi để đúng file cho ra số khớp.
logpath = /var/log/nginx/access.log

[nginx-limit-req]
enabled = true
logpath = /var/log/nginx/error.log
```
- nginx trong Docker: fail2ban cần đọc được log ⇒ gắn thư mục log của container ra host (volume `./logs/nginx:/var/log/nginx`)
  và để nginx ghi file thay vì stdout; và vì Docker bỏ qua ufw/INPUT, đặt `chain = DOCKER-USER` cho các jail web.
- Thử bộ lọc TRƯỚC khi bật, trên cả hai log: `fail2ban-regex /var/log/nginx/access.log /etc/fail2ban/filter.d/nginx-botsearch.conf`
  (rồi với `error.log`). Dòng `Matched` > 0 ở file nào thì `logpath` trỏ file đó; 0 ở cả hai ⇒ bộ lọc không hợp định dạng log, đừng bật.
- Xem/gỡ: `fail2ban-client status nginx-botsearch`, `fail2ban-client set nginx-botsearch unbanip 1.2.3.4`.

### 3.5 Trong ứng dụng
- **Rate limit theo IP thật:** sau nginx, app thấy IP của nginx ⇒ cấu hình tin đúng số proxy (`app.set('trust proxy', 1)`
  với Express). ⛔ ĐỪNG lấy phần tử ĐẦU của `X-Forwarded-For` hay `CF-Connecting-IP` khi cổng gốc chưa khoá — client tự đặt
  được header đó và đổi IP mỗi request, vượt qua toàn bộ rate limit. Phần tử CUỐI do chính nginx của mình thêm vào mới tin được.
- **Form:** captcha (Cloudflare Turnstile miễn phí), ô honeypot ẩn (bot điền ⇒ bỏ), giới hạn theo IP + theo email.
- **Đăng nhập:** khoá tạm theo TÀI KHOẢN sau N lần sai (không chỉ theo IP — botnet đổi IP liên tục), thông báo lỗi
  chung chung ("sai email hoặc mật khẩu").
- Endpoint tốn tiền (gọi AI, gửi email/OTP, upload): trần riêng chặt hơn hẳn.

## 4. KHÔNG TỰ KHOÁ MÌNH — làm đúng thứ tự này mỗi lần đụng tường lửa

1. Biết cổng SSH thật: `ss -tlnp | grep sshd` (có máy nghe cả 22 lẫn cổng phụ như 993 — mở CẢ HAI).
2. `ufw allow 22/tcp` (+ cổng phụ) và `ufw allow from <IP_NGƯỜI_DÙNG>` TRƯỚC khi `enable`/thêm luật deny rộng.
   IP người dùng: hỏi họ, hoặc trên máy họ `curl -s https://ifconfig.me`. Thêm nó vào `ignoreip` của fail2ban.
3. **Hẹn giờ tự hoàn tác** trước thay đổi lớn: `nohup sh -c 'sleep 300; ufw disable' >/dev/null 2>&1 &` (hoặc
   `iptables-restore < /root/iptables.truoc`), rồi mở MỘT kết nối SSH MỚI để thử. Vào được ⇒ huỷ hẹn giờ (`kill` tiến trình đó).
4. Không đóng phiên SSH đang mở cho tới khi phiên mới vào được.
5. Không bao giờ chặn dải IP của Cloudflare, của nhà cung cấp VPS (health check), hay IP của người dùng.

## 5. Kiểm hiệu quả — chứng minh, đừng tuyên bố

- Chạy lại các lệnh đếm ở mục 2 sau 15–30 phút: IP/đường dẫn đã chặn giảm về ~0? Mã 444/429/403 tăng đúng chỗ?
- Từ ngoài: trang chủ vẫn 200, đăng nhập thật vẫn được, `curl https://ten-mien/.env` không ra nội dung.
- Người dùng thật có bị 429 oan không: đếm 429 theo IP — một IP 429 hàng nghìn lần mà là IP của chính người dùng (nhiều tab
  mở, một vòng lặp gọi API trong code) là LỖI CỦA TA, không phải tấn công. Đã gặp thật: "web sập" hoá ra là rate limit chặn
  đúng chủ web vì một vòng lặp tự nộp bài bắn 32 req/s.
- CPU/RAM: `uptime`, `free -h`, `docker stats --no-stream`.

## 6. DDoS băng thông lớn — nói thật

Gói tin làm nghẽn đường mạng vào VPS TRƯỚC khi tới tường lửa của máy; ufw/nginx/fail2ban không giúp được. Việc làm được:
1. Đưa trang ra sau **Cloudflare** (3.1) + khoá cổng gốc chỉ cho Cloudflare + đổi IP VPS nếu IP cũ đã lộ.
2. Bật Under Attack Mode trong lúc bị dồn.
3. Liên hệ nhà cung cấp VPS (nhiều nơi có chống DDoS sẵn hoặc tạm "null-route" IP bị tấn công).
Nói rõ với người dùng giới hạn này, và đừng gọi việc chặn vài IP là "đã chống DDoS".

## 7. Bẫy đã gặp thật

- Rate limit lấy phần tử đầu `X-Forwarded-For` ⇒ ai cũng tự đổi IP bằng một header, vượt toàn bộ giới hạn (chứng minh bằng curl).
- `limit_req` mặc định trả **503** ⇒ người dùng và cả bộ giám sát tưởng máy chủ sập. Luôn `limit_req_status 429`.
- Docker `ports:` mở cổng qua iptables riêng ⇒ `ufw deny` "thành công" mà không chặn gì. Dùng `DOCKER-USER`.
- nginx bind-mount file đơn + `mv` ⇒ cấu hình mới không bao giờ có hiệu lực dù `nginx -t`/`reload` đều xanh.
- Drop-in `sshd_config.d/70-…` thua `50-cloud-init.conf` (giá trị đọc ĐẦU TIÊN thắng) ⇒ đặt tên `01-…`, nghiệm thu bằng `sshd -T`.
- Mạng trường chặn cổng 22 ⇒ mở SSH thêm cổng phụ bằng service riêng thay vì sửa `ssh.socket` trên máy đang chạy.
- Một IP "tấn công" hoá ra là chính người dùng sau NAT của trường/công ty — cả trăm người chung một IP. Hỏi trước khi chặn dải lớn.

## 8. Việc KHÔNG tự làm khi chưa được đồng ý

- Bật/đổi tường lửa, đổi cổng SSH, sửa `sshd_config`.
- Chặn cả quốc gia/ASN, bật Under Attack Mode, đổi DNS hay chế độ proxy Cloudflare.
- Xoá hay xoay vòng log (đó là bằng chứng), khởi động lại container/dịch vụ đang phục vụ người dùng.
- Bất cứ hành động nào nhắm vào máy của kẻ tấn công.

## 9. Báo cáo cuối

```
TÌNH HÌNH: <loại — mục 1>, khung giờ, số req, số IP, nguồn (quốc gia/ASN)
BẰNG CHỨNG: <3–5 dòng số liệu từ log>
CÓ GÌ BỊ LỘ KHÔNG: <đường dẫn nào trả 200, cổng nào mở — hoặc "không">
ĐÃ LÀM: <từng thay đổi> — HOÀN TÁC: <lệnh tương ứng>
KẾT QUẢ ĐO SAU: <số liệu sau khi chặn>
CÒN LẠI / CẦN NGƯỜI DÙNG: <vd bật Cloudflare, cấp API token, quyết định chặn quốc gia>
```
