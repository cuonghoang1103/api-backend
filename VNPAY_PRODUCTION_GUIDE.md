# VNPay Go-Live — Hướng dẫn chi tiết từng bước

> Tài liệu này hướng dẫn bạn đưa trang web từ trạng thái "test trên
> sandbox" sang "thu tiền thật từ khách hàng thật". Mỗi bước có
> thời gian ước lượng, link truy cập trực tiếp, và command cụ thể
> để copy-paste.
>
> **Điều kiện tiên quyết**: đã đọc qua checklist `VNPAY_GO_LIVE_CHECKLIST.md`
> (file đi kèm commit 68aa57a). File này là phiên bản chi tiết hơn
> với hướng dẫn từng bước cho 4 nhiệm vụ chính.

---

## Tổng quan 4 bước

| # | Bước | Thời gian | Người làm |
|---|------|----------|-----------|
| 1 | Cấu hình SMTP thật | 30 phút | Bạn (admin) |
| 2 | Đăng ký VNPay merchant | 1-3 ngày | Bạn + VNPay support |
| 3 | Update env + deploy | 15 phút | Bạn |
| 4 | Test với thẻ thật | 1 giờ | Bạn |
| **Tổng** | | **3-5 ngày** (chờ VNPay duyệt) | |

Sau 4 bước, bạn có một hệ thống **thu tiền thật 24/7** từ khách hàng.

---

## Bước 1 — Cấu hình SMTP thật (30 phút)

### Tại sao cần?

Hiện tại `emailService` được gọi sau khi thanh toán thành công để gửi
receipt cho user. Nếu SMTP chưa config, email sẽ **không gửi được**
→ user không nhận hóa đơn → support tickets tăng → mất uy tín.

### Cấu hình hiện tại (placeholder)

```bash
# Trên VPS:
grep -E "^SMTP_" /opt/cuonghoangdev/.env
```

Output hiện tại:
```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""        ← RỖNG — cần điền
SMTP_PASS=""        ← RỖNG — cần điền
SMTP_FROM="noreply@cuongthai.com"
```

### Chọn 1 trong 2 option

#### Option A: Gmail (FREE, dễ nhất) — phù hợp nếu <500 email/ngày

**Bước 1A.1**: Bật 2FA cho Gmail
- Vào https://myaccount.google.com/security
- Tab "2-Step Verification" → bật nếu chưa bật
- Cần điện thoại để nhận OTP

**Bước 1A.2**: Tạo App Password
- Vào https://myaccount.google.com/apppasswords
- "App name": `cuongthai.com`
- "Create" → copy **16 ký tự** password (vd: `abcd efgh ijkl mnop`)

**Bước 1A.3**: Update env trên VPS
```bash
ssh root@160.187.1.208
nano /opt/cuonghoangdev/.env
```

Tìm dòng `SMTP_USER` + `SMTP_PASS`, sửa thành:
```bash
SMTP_USER="cuongthaihnhe176322@gmail.com"   # email thật của bạn
SMTP_PASS="abcd efgh ijkl mnop"             # App Password 16 ký tự (bỏ dấu cách hoặc giữ đều OK)
```

**Bước 1A.4**: Test ngay trong browser Gmail
- Mở Gmail → check inbox
- Nếu chưa nhận được test email → check Spam folder

#### Option B: SendGrid (chuyên nghiệp, scale tốt) — phù hợp nếu >500 email/ngày

**Bước 1B.1**: Đăng ký SendGrid
- Vào https://sendgrid.com → "Start for Free"
- Verify email + 2FA
- Free tier: 100 emails/day (forever)

**Bước 1B.2**: Tạo API Key
- Dashboard → Settings → API Keys → "Create API Key"
- Name: `cuongthai.com-production`
- Permission: **Restricted Access** → chỉ enable "Mail Send"
- Copy API key (1 lần duy nhất, dài ~70 ký tự bắt đầu `SG.`)

**Bước 1B.3**: Update env trên VPS
```bash
ssh root@160.187.1.208
nano /opt/cuonghoangdev/.env
```
```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"                              # literal "apikey" (SendGrid convention)
SMTP_PASS="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"   # full API key
SMTP_FROM="noreply@cuongthai.com"                # must be a verified sender
```

**Bước 1B.4**: Verify sender (Single Sender Verification)
- SendGrid → Settings → Sender Authentication → "Verify a Single Sender"
- Email: `noreply@cuongthai.com` (nếu dùng subdomain `cuongthai.com`)
- SendGrid gửi email xác nhận → click link
- Sau khi verified → email mới gửi được

### Test SMTP ngay (trước khi sang bước 2)

Bạn có thể test nhanh bằng cách trigger 1 email. Cách nhanh nhất:

```bash
# SSH vào VPS
ssh root@160.187.1.208

# Tạo 1 user test có email thật (vd: chính email của bạn)
# Nếu dùng email thật của bạn (vd: cuongthaihnhe176322@gmail.com):
docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db \
  -c "UPDATE users SET email_verified = true WHERE email = 'YOUR_EMAIL_HERE';"

# Mua 1 khoá nhỏ (10.000đ) qua browser → thanh toán
# → IPN callback sẽ trigger emailService.sendCourseReceiptEmail

# Check email trong inbox
# (Nếu dùng Gmail SMTP, check trong tab Promotions / Spam)
```

Nếu không nhận được:
- Check logs: `docker logs cuonghoangdev_backend --tail 30`
- Tìm dòng có `email` hoặc `SMTP`
- Lỗi thường gặp:
  - `Invalid login: 535` → sai username/password
  - `Greeting never read` → firewall block port 587
  - `Self signed certificate` → bật `secure: false` (chỉ cho dev)

### Checklist Bước 1
- [ ] SMTP_USER không rỗng
- [ ] SMTP_PASS không rỗng (16 chars Gmail hoặc SG.xxx SendGrid)
- [ ] `docker exec cuonghoangdev_postgres` set `email_verified = true` cho email test
- [ ] Trigger 1 thanh toán test
- [ ] Email nhận được trong inbox (check Spam nếu Gmail)

---

## Bước 2 — Đăng ký VNPay merchant (1-3 ngày)

> **Quan trọng**: Bước này cần VNPay duyệt hồ sơ. Bắt đầu sớm
> để không bị block ở khâu chờ.

### Tại sao cần?

Backend hiện dùng **sandbox credentials** (`DEMO0001`) + URL sandbox
(`sandbox.vnpayment.vn`). Production cần:
- TMN code **thật** (do VNPay cấp, gắn với merchant)
- Hash secret **thật** (HMAC key, KHÔNG share)
- Endpoint production: `https://pay.vnpay.vn/vpcpay.html` (không phải sandbox)

### 2.1 — Chuẩn bị hồ sơ (trước khi đăng ký)

VNPay yêu cầu các giấy tờ sau (cá nhân hoặc doanh nghiệp):

**Nếu đăng ký cá nhân (phổ biến với freelancer):**
- CMND/CCCD (mặt trước + mặt sau, scan rõ)
- Sổ tài khoản ngân hàng (bản sao) — tên chủ TK phải trùng tên CMND
- Giấy phép kinh doanh (nếu có, không bắt buộc cho cá nhân)
- Website URL: `https://cuongthai.com` (phải live, có thông tin liên hệ rõ ràng)

**Nếu đăng ký doanh nghiệp:**
- Giấy phép đăng ký kinh doanh
- CMND người đại diện pháp luật
- Sổ TK doanh nghiệp
- Con dấu + chữ ký

### 2.2 — Đăng ký online (15 phút)

**Bước 2.2.1**: Truy cập https://vnpay.vn
- Click "Đăng ký merchant" (góc trên phải)
- Hoặc trực tiếp: https://merchant.vnpay.vn/register

**Bước 2.2.2**: Điền form
- Thông tin cá nhân/doanh nghiệp
- Website URL: `https://cuongthai.com`
- Email liên hệ: dùng email thật của bạn
- Số điện thoại: của bạn (VNPay sẽ gọi verify)
- Loại hình: "Giáo dục / Đào tạo" (hoặc "Thương mại điện tử" tuỳ mô tả)
- **Mô tả dịch vụ**: viết 1 đoạn 100-200 từ mô tả site bạn (vd:
  "Nền tảng học lập trình trực tuyến, bán khoá học và tài liệu
  kỹ thuật cho học sinh, sinh viên và dev tại Việt Nam")

**Bước 2.2.3**: Upload giấy tờ
- CMND/CCCD (mặt trước + mặt sau)
- Sổ TK ngân hàng
- Ảnh chụp màn hình website (giúp VNPay duyệt nhanh hơn)

**Bước 2.2.4**: Submit + chờ duyệt
- Thời gian: **1-3 ngày làm việc** (có thể nhanh hơn nếu giờ hành chính)
- VNPay sẽ gọi điện verify số điện thoại
- Nếu OK → email cấp credentials

### 2.3 — Nhận credentials (sau khi VNPay duyệt)

VNPay sẽ gửi email với:
- **TMN Code** (Merchant Terminal Code, vd: `CUONGTHAI01`)
- **Hash Secret** (chuỗi 64+ ký tự, **bí mật**, KHÔNG share)
- **Merchant Portal URL**: `https://merchant.vnpay.vn`
- Username + password merchant portal

**Lưu ý bảo mật**:
- Hash Secret **KHÔNG BAO GIỜ** commit vào git
- Nếu lộ → kẻ xấu có thể tạo URL giả → user trả tiền vào tài khoản hacker
- Lưu vào password manager (Bitwarden / 1Password)

### 2.4 — Cấu hình Return URL + IPN URL (10 phút)

**Bước 2.4.1**: Login merchant portal
- https://merchant.vnpay.vn
- Username + password VNPay cấp

**Bước 2.4.2**: Cấu hình Return URL
- Menu: "Quản lý" → "Cấu hình" → "Return URL"
- Nhập: `https://cuongthai.com/payment/return`
- Click "Lưu"

**Bước 2.4.3**: Cấu hình IPN URL
- Menu: "Quản lý" → "Cấu hình" → "IPN URL"
- Nhập: `https://cuongthai.com/api/v1/payments/vnpay/ipn`
- Method: GET (VNPay sẽ gọi GET request khi thanh toán xong)
- Click "Lưu"

**Bước 2.4.4**: Cấu hình tài khoản ngân hàng nhận tiền
- Menu: "Tài khoản" → "Thanh toán"
- Thêm số TK ngân hàng đã đăng ký
- Verify bằng OTP gửi về SMS

### 2.5 — Verify IPN + test kết nối

**Bước 2.5.1**: Test kết nối
- Trong merchant portal → "IPN Test" → chọn TMN code → click "Send test IPN"
- Nếu nhận `RspCode: 00` ở response log → OK
- Nếu không, check lại URL hoặc firewall

**Bước 2.5.2**: Kiểm tra IP được whitelist
- Trong portal → "Quản lý" → "IP Whitelist"
- Đảm bảo IP public của VPS server (`160.187.1.208`) được thêm
- Nếu dùng CDN/Cloudflare, thêm cả IP CDN

### Checklist Bước 2
- [ ] Hồ sơ đã submit + được VNPay duyệt
- [ ] Email nhận được TMN Code + Hash Secret
- [ ] Merchant portal login OK
- [ ] Return URL: `https://cuongthai.com/payment/return` đã config
- [ ] IPN URL: `https://cuongthai.com/api/v1/payments/vnpay/ipn` đã config
- [ ] TK ngân hàng đã verify
- [ ] Test IPN connection OK trong portal

---

## Bước 3 — Update env + deploy (15 phút)

### 3.1 — SSH vào VPS + backup env

```bash
ssh root@160.187.1.208
cd /opt/cuonghoangdev
cp .env .env.backup-$(date +%Y%m%d-%H%M%S)
ls -la .env.backup-*
```

### 3.2 — Sửa env với credentials thật

```bash
nano .env
```

Tìm và sửa 4 dòng sau (giữ các dòng khác nguyên):

```bash
# === VNPay (production) ===
VNPAY_TMN_CODE="CUONGTHAI01"                    # ← THAY bằng TMN code VNPay cấp
VNPAY_HASH_SECRET="<64-char-secret>"              # ← THAY bằng hash secret VNPay cấp
VNPAY_URL="https://pay.vnpay.vn/vpcpay.html"     # ← ĐỔI từ sandbox → production
VNPAY_SANDBOX="0"                                # ← ĐỔI từ "1" → "0" (production)
VNPAY_RETURN_URL="https://cuongthai.com/payment/return"   # giữ nguyên
VNPAY_IPN_URL="https://cuongthai.com/api/v1/payments/vnpay/ipn"   # giữ nguyên
VNPAY_VERSION="2.1.0"                             # giữ nguyên
VNPAY_ORDER_TTL_MINUTES="15"                      # giữ nguyên
```

**Cẩn thận**: Copy-paste đúng. Hash secret dài ~64 ký tự, dễ thiếu ký tự.

### 3.3 — Verify trước khi restart

```bash
# Check env
grep "^VNPAY_" .env

# Check sandbox flag
grep "^VNPAY_SANDBOX" .env
# Expected: VNPAY_SANDBOX="0"

# Check tất cả fields cần thiết
node -e "
const required = ['VNPAY_TMN_CODE', 'VNPAY_HASH_SECRET', 'VNPAY_URL', 'VNPAY_RETURN_URL', 'VNPAY_IPN_URL'];
required.forEach(k => {
  const v = process.env[k];
  console.log(k + ':', v ? (v.length > 20 ? v.slice(0, 8) + '...' : v) : '❌ MISSING');
});
" || echo "Use direct env file check"
```

### 3.4 — Restart backend (zero-downtime)

```bash
cd /home/deployer/repo
bash deploy.sh
```

Hoặc nếu không có code change:
```bash
docker compose restart backend
```

### 3.5 — Verify backend started with new env

```bash
# Check logs
docker logs cuonghoangdev_backend --tail 30 2>&1 | grep -iE "(vnpay|missing|TMN)"
```

**Không được** thấy "Missing env vars: VNPAY_TMN_CODE..." → backend OK.

### 3.6 — Health check

```bash
# Backend health
curl -sS https://cuongthai.com/api/v1/system/health | python3 -m json.tool

# Frontend
curl -sSI https://cuongthai.com/hub | head -3

# Order page (HTML)
curl -sSI https://cuongthai.com/admin/course-orders | head -3
```

### Checklist Bước 3
- [ ] Backup env
- [ ] Sửa 4 dòng VNPay
- [ ] Verify env
- [ ] Deploy
- [ ] Backend health check OK
- [ ] Không có lỗi "Missing env vars" trong logs

---

## Bước 4 — Test với thẻ thật (1 giờ)

### 4.1 — Tạo 1 khoá test giá thấp (5 phút)

**Mục đích**: test với số tiền nhỏ (10.000đ) để giảm thiểu rủi ro.

**Cách 1**: Tạo qua admin UI
- Vào `https://cuongthai.com/admin/courses` (login admin)
- Click "Tạo khoá mới"
- Title: `[TEST] Live VNPay 10K`
- Slug: `test-live-vnpay-10k`
- Price: `10000` (10.000đ)
- Discount: `0`
- isFree: false, isPublished: true
- Save

**Cách 2**: Tạo qua SQL (nhanh hơn)
```bash
ssh root@160.187.1.208 'docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db -c "
INSERT INTO courses (title, slug, price, discount_price, is_free, is_published, access_type, author_id, created_at, updated_at)
VALUES ('[TEST] Live VNPay 10K', '\\''test-live-vnpay-10k'\\'', 10000, NULL, false, true, '\\''PAID'\\'', 1, NOW(), NOW())
RETURNING id;
"'
```

Lưu lại `id` (vd: `id=42`).

### 4.2 — Mua bằng tài khoản test

**Bước 4.2.1**: Hard reload browser
- Cmd+Shift+R

**Bước 4.2.2**: Login với tài khoản có email thật
- Email account mà bạn nhận được
- Nếu không có, đăng ký mới (khoá test 10K miễn phí thử)

**Bước 4.2.3**: Vào `/academy`, tìm "[TEST] Live VNPay 10K" → click → "Mua khoá học"

**Bước 4.2.4**: Trang VNPay production hiện ra
- **KHÔNG phải sandbox.vnpayment.vn** mà là **pay.vnpay.vn**
- Logo VNPay, form nhập thẻ thật

**Bước 4.2.5**: Nhập thẻ thật
- Visa/Master/JCB (bất kỳ thẻ nào còn tiền)
- Số thẻ, tên chủ thẻ, ngày hết hạn, CVV
- **Chú ý**: VNPay sẽ trừ 10.000đ + phí giao dịch (~1.000đ) = tổng ~11.000đ

### 4.3 — Verify thanh toán thành công

**Bước 4.3.1**: Sau khi thanh toán, VNPay redirect về `/payment/return?status=success&orderCode=...`
- Bạn sẽ thấy trang "Thanh toán thành công"

**Bước 4.3.2**: Kiểm tra email
- Mở Gmail → check inbox
- Bạn sẽ nhận được email "Cảm ơn bạn đã mua khoá học..."
- Nếu KHÔNG thấy → check Spam

**Bước 4.3.3**: Kiểm tra enrollment
- Vào lại `/academy` → click khoá test
- Bạn sẽ thấy nội dung bài học (không còn nút "Mua")

**Bước 4.3.4**: Kiểm tra tiền thật đã về
- Đăng nhập merchant portal: https://merchant.vnpay.vn
- Menu: "Giao dịch" → tìm giao dịch 10.000đ vừa rồi
- Status: **Thành công**
- Số tiền thực nhận: 10.000đ - phí VNPay (~1.000đ) = ~9.000đ

### 4.4 — Verify backend logs

```bash
# Check IPN received
ssh root@160.187.1.208 'docker logs cuonghoangdev_backend --tail 50' | grep -iE "(payment-ipn|vnpay)" | tail -5
```

Expected:
```
[INFO] payment-ipn PAID
  orderCode: ...
  userId: ...
  amountVnd: 10000
  txnNo: 12345678
```

### 4.5 — Test refund với tiền thật

**Bước 4.5.1**: Login admin vào `/admin/course-orders`

**Bước 4.5.2**: Tìm order vừa test → click "Refund" → nhập lý do "Test refund" → OK

**Bước 4.5.3**: Verify
- Status → REFUNDED trong table
- VNPay gửi tiền về thẻ của user (1-3 ngày làm việc)
- Email refund gửi cho user

**Bước 4.5.4**: Check logs
```bash
ssh root@160.187.1.208 'docker logs cuonghoangdev_backend --tail 30' | grep -iE "(refund|vnpay)"
```

Expected:
```
[INFO] payment-refund REFUNDED
[INFO] vnpay-refund API success    ← Quan trọng: phải có dòng này (trước đây fail do sandbox hỏng)
```

Nếu thấy `vnpay-refund API failed`:
- Check responseCode + message
- Thường là do `Transaction not found` (chờ 5-10 phút sau thanh toán để VNPay sync)
- Hoặc `Invalid amount` (sai format số tiền)
- Admin vẫn có thể refund DB thành công, chỉ là VNPay không nhận lệnh

### 4.6 — Test concurrent users (2-3 users cùng mua)

Mở 2-3 tab ẩn danh, login 2-3 tài khoản khác nhau, cùng mua 1 khoá giá thấp:
- Verify mỗi user nhận enrollment riêng
- Verify totalStudents tăng đúng
- Verify không có race condition (mỗi user PAID đúng 1 lần)

### Checklist Bước 4
- [ ] Tạo 1 khoá test giá 10.000đ
- [ ] Mua bằng thẻ thật thành công
- [ ] Email nhận được (check Spam)
- [ ] Enrollment active, có thể học ngay
- [ ] Tiền về tài khoản merchant trong merchant portal
- [ ] IPN log OK trong backend
- [ ] Refund admin thành công, log OK
- [ ] Tiền về thẻ user (1-3 ngày)

---

## Bước 5 (bonus) — Monitor 24-72 giờ đầu

### 5.1 — Real-time logs

```bash
# SSH vào VPS, theo dõi real-time
ssh root@160.187.1.208
docker logs -f cuonghoangdev_backend 2>&1 | grep --color=always -iE "(payment-ipn|payment-refund|vnpay|email)"
```

### 5.2 — Dashboard check (mỗi 4-6 giờ)

```bash
# Đếm số orders hôm nay
ssh root@160.187.1.208 'docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db -c "
SELECT
  COUNT(*) FILTER (WHERE status = '\\''PAID'\\'') AS paid,
  COUNT(*) FILTER (WHERE status = '\\''FAILED'\\'') AS failed,
  COUNT(*) FILTER (WHERE status = '\\''REFUNDED'\\'') AS refunded,
  COUNT(*) AS total
FROM course_orders
WHERE created_at >= CURRENT_DATE;
"'

# Tổng tiền hôm nay
ssh root@160.187.1.208 'docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db -c "
SELECT SUM(amount) FROM course_orders
WHERE status = '\\''PAID'\\'' AND created_at >= CURRENT_DATE;
"'
```

### 5.3 — Alert setup (nếu cần)

Nếu muốn nhận cảnh báo khi có lỗi, setup 1 trong 2:

**Cách A: Simple cron + email** (miễn phí)
```bash
# Crontab check mỗi 5 phút
ssh root@160.187.1.208
crontab -e
# Thêm dòng:
*/5 * * * * /opt/cuonghoangdev/scripts/payment-alert.sh
```

`/opt/cuonghoangdev/scripts/payment-alert.sh`:
```bash
#!/bin/bash
# Check if any 500 error in last 5 min for payment routes
errors=$(docker logs --since 5m cuonghoangdev_backend 2>&1 | grep -c 'Express error handler.*payments')
if [ "$errors" -gt 0 ]; then
  echo "Payment errors detected: $errors in last 5 min" | mail -s "[cuongthai] Payment Alert" your-email@gmail.com
fi
```

**Cách B: Sentry / Datadog** (chuyên nghiệp, có free tier)
- Sentry free tier: 5K events/month
- Có sẵn @sentry/node trong stack — chỉ cần set DSN
- Setup trong 30 phút

### 5.4 — Weekly check

Mỗi tuần check:
- Số orders + tổng tiền (tăng hay giảm?)
- Số refund requests
- Số IPN fail (responseCode != '00')
- Email delivery rate (có user nào báo không nhận được email?)

---

## Troubleshooting

### Lỗi: "Missing env vars: VNPAY_TMN_CODE..."
**Nguyên nhân**: env chưa được load hoặc typo
**Fix**:
```bash
# SSH vào VPS, check env
ssh root@160.187.1.208
grep "^VNPAY_" /opt/cuonghoangdev/.env

# Restart backend
cd /home/deployer/repo && bash deploy.sh
```

### Lỗi: "RspCode: 99, IP not in VNPay allowlist"
**Nguyên nhân**: IP public của VPS chưa có trong whitelist VNPay
**Fix**:
- Đăng nhập merchant portal → "Quản lý" → "IP Whitelist" → thêm IP
- Hoặc thêm `VNPAY_IP_ALLOWLIST="..."` env với CIDR mới
- Restart backend

### Lỗi: IPN không fire (user thanh toán nhưng status không update)
**Nguyên nhân**: VNPay sandbox thỉnh thoảng miss IPN, production 99% reliable
**Fix**:
- User click "Tôi đã thanh toán" trên frontend → frontend poll lại
- Nếu quá 15 phút vẫn PENDING → admin manual check merchant portal
- Nếu VNPay confirm đã trừ tiền → admin click "Force PAID" (TODO: cần implement)

### Lỗi: Email không gửi
**Nguyên nhân**:
1. SMTP_PASS rỗng
2. Gmail block (cần App Password, không phải password thường)
3. SendGrid sender chưa verify
4. Firewall VPS block port 587

**Debug**:
```bash
ssh root@160.187.1.208
docker logs cuonghoangdev_backend --tail 50 | grep -iE "(email|smtp)"
```

Output thường gặp:
- `Invalid login: 535` → sai user/pass
- `Connection timeout` → firewall
- `Greeting never read` → sandbox issue
- `Self signed certificate` → set `secure: false`

### Lỗi: VNPay refund fail với "Transaction not found"
**Nguyên nhân**: VNPay sync chậm (5-10 phút sau thanh toán)
**Fix**: 
- Thử lại refund sau 10 phút
- Nếu vẫn fail → admin refund DB (DB sẽ vẫn update REFUNDED, tiền sẽ về user qua flow manual)

### Lỗi: User không nhận được email
**Nguyên nhân**:
- Email trong Spam folder
- User đăng ký với email typo
- SMTP relay timeout (transient)

**Fix**:
- User check Spam + add sender vào contacts
- Admin check logs: `docker logs cuonghoangdev_backend | grep <orderCode>`
- Re-send email: implement feature "resend receipt" (TODO)

---

## Tóm tắt checklist đầy đủ

### Trước khi bắt đầu
- [ ] Đã đọc file `VNPAY_GO_LIVE_CHECKLIST.md` (file đi kèm commit 68aa57a)
- [ ] Đã đọc file này (`VNPAY_PRODUCTION_GUIDE.md`)

### Bước 1 — SMTP (30 phút)
- [ ] Chọn Gmail hoặc SendGrid
- [ ] Lấy credentials (App Password hoặc API Key)
- [ ] Update `.env` trên VPS
- [ ] Test gửi 1 email thật qua UI

### Bước 2 — VNPay merchant (1-3 ngày)
- [ ] Đăng ký merchant trên https://vnpay.vn
- [ ] Submit giấy tờ đầy đủ
- [ ] Chờ duyệt (VNPay sẽ gọi verify)
- [ ] Nhận email credentials (TMN code + Hash secret)
- [ ] Cấu hình Return URL + IPN URL trong portal
- [ ] Verify tài khoản ngân hàng

### Bước 3 — Deploy (15 phút)
- [ ] Backup `.env`
- [ ] Update 4 dòng VNPay (TMN + secret + URL + sandbox=0)
- [ ] Restart backend
- [ ] Verify health check OK
- [ ] Verify logs không có lỗi

### Bước 4 — Test thẻ thật (1 giờ)
- [ ] Tạo 1 khoá test 10.000đ
- [ ] Mua bằng thẻ thật
- [ ] Verify email + enrollment + tiền về merchant portal
- [ ] Test refund admin
- [ ] Verify logs IPN + refund

### Bước 5 — Monitor
- [ ] Theo dõi logs 24h đầu
- [ ] Check dashboard orders
- [ ] Setup alert (optional)
- [ ] Review sau 1 tuần

---

## Liên hệ VNPay support

- **Hotline**: 1900 545 426
- **Email**: hotro@vnpay.vn
- **Merchant portal**: https://merchant.vnpay.vn
- **Docs**: https://sandbox.vnpayment.vn/docs

## Khi nào nên nhờ support?

- Tạo merchant > 3 ngày mà chưa nhận phản hồi
- IPN không fire trong khi merchant portal logs có giao dịch thành công
- Refund từ portal có ghi nhận nhưng DB không update (hoặc ngược lại)
- Lỗi "Invalid signature" trong khi credentials mới

Không nên hỏi support:
- Bug code → team dev (chính là bạn)
- Env var thiếu → check `.env`
- Email SMTP → Gmail/SendGrid support
