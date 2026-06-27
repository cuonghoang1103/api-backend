# VNPay Go-Live Checklist — Production Payment

> Bạn đã quyết định go-live production thật với VNPay thật (không phải
> sandbox demo `DEMO0001`). File này hướng dẫn từng bước, từ đăng ký
> merchant đến go-live + monitoring.

---

## Phase 0 — Trước khi bắt đầu (1 ngày)

### 0.1 Đăng ký VNPay Merchant (nếu chưa có)

- Truy cập https://vnpay.vn → "Đăng ký merchant"
- Cần: giấy phép kinh doanh, CMND/CCCD chủ shop, tài khoản ngân hàng nhận tiền
- Sau đăng ký, VNPay cấp:
  - `VNPAY_TMN_CODE` (mã định danh merchant, vd `CUONGTHAI01`)
  - `VNPAY_HASH_SECRET` (chuỗi bí mật ký HMAC-SHA512)
  - Quyền truy cập merchant portal (xem giao dịch, hoàn tiền)
  - Danh sách IP whitelist (cho IPN guard)

### 0.2 Domain + SSL

- ✅ `cuongthai.com` đã có HTTPS
- ✅ IPN URL: `https://cuongthai.com/api/v1/payments/vnpay/ipn` (đã config trong code)
- ✅ Return URL: `https://cuongthai.com/payment/return` (đã config)

---

## Phase 1 — Cập nhật env vars trên VPS (10 phút)

### 1.1 SSH vào server

```bash
ssh root@160.187.1.208
```

### 1.2 Sửa env file

```bash
cd /opt/cuonghoangdev
nano .env
```

### 1.3 Update 4 dòng sau

```bash
# Trước (SANDBOX):
VNPAY_TMN_CODE="<sandbox_TMN_code>"   # lấy từ docs sandbox.vnpayment.vn
VNPAY_HASH_SECRET="<sandbox_secret>"  # sandbox secret dùng chung
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_SANDBOX="1"

# Sau (PRODUCTION):
VNPAY_TMN_CODE="<merchant_code_VNPay_cấp>"   # VNPay cấp sau khi đăng ký
VNPAY_HASH_SECRET="<hash_secret_thật>"        # VNPay cấp qua email
VNPAY_URL="https://pay.vnpay.vn/vpcpay.html"
VNPAY_SANDBOX="0"

# Optional: nếu VNPay cấp IP mới ngoài whitelist hiện tại
VNPAY_IP_ALLOWLIST="203.171.20.0/24,123.30.235.0/24,113.161.69.0/24,103.220.87.0/24,103.220.88.0/24,14.225.0.0/16,27.71.0.0/16"
```

### 1.4 KHÔNG restart ngay — làm theo Phase 2 trước

---

## Phase 2 — Đăng ký IPN với VNPay (5 phút)

VNPay cần biết URL IPN của bạn để gọi khi thanh toán xong.

- Truy cập https://merchant.vnpay.vn → Quản lý → Cấu hình IPN
- Nhập:
  - URL: `https://cuongthai.com/api/v1/payments/vnpay/ipn`
  - Method: GET (hỗ trợ cả POST)
- Lưu lại

### Verify IPN đã đăng ký thành công:
- Vào phần "Quản lý IPN" → phải thấy URL trên status "Đã kích hoạt"

---

## Phase 3 — Test với thẻ sandbox/test trước (30 phút)

**ĐỪNG go-live thẳng production**. Test với sandbox trước để verify flow end-to-end.

### 3.1 Test card numbers (VNPay sandbox)

VNPay cung cấp sẵn các test card:
- `9704 0000 0000 0018` — NCB thành công
- `9704 0000 0000 0026` — NCB thất bại (insufficient)
- OTP cho sandbox: `OTP` (mặc định)

### 3.2 Test flow course

1. Mở trình duyệt ẩn danh → vào `https://cuongthai.com/academy`
2. Click một khoá học PAID → bấm "Mua khoá học"
3. Redirect sang VNPay sandbox → nhập test card → thanh toán
4. Quay lại `https://cuongthai.com/payment/return?status=success&orderCode=...`
5. Verify:
   - ✅ Trang return hiện "Thanh toán thành công"
   - ✅ Tài khoản có Enrollment ACTIVE
   - ✅ Email nhận được receipt
   - ✅ DB `course_orders.status = PAID`, `paymentTxnNo` có giá trị
6. Test fail flow:
   - Thử với card `9704 0000 0000 0026`
   - Verify: status = FAILED, không có enrollment

### 3.3 Test flow shop (product)

Tương tự với product order từ `/shop`.

### 3.4 Verify IPN log

```bash
ssh root@160.187.1.208 'docker logs cuonghoangdev_backend --since 10m | grep -i vnpay'
```

Phải thấy log:
- `payment-ipn PAID` (khi thành công)
- IP từ sandbox (203.171.20.x hoặc 123.30.235.x)

### 3.5 Test refund

1. Vào `/admin/course-orders` → chọn order PAID
2. Bấm "Hoàn tiền" → nhập số tiền + lý do
3. Verify:
   - DB `course_orders.status = REFUNDED`, `refundAmount` = số tiền
   - Email refund gửi cho user
   - Nếu order có `paymentTxnNo`, VNPay API refund được gọi (sandbox trả success)
   - User mất enrollment (nếu full refund)

---

## Phase 4 — Go-live production (30 phút)

Sau khi Phase 3 pass hết, mới switch sang production.

### 4.1 Update env (lặp lại Phase 1 với credentials production)

```bash
VNPAY_SANDBOX="0"
VNPAY_TMN_CODE="<production_code>"
VNPAY_HASH_SECRET="<production_secret>"
VNPAY_URL="https://pay.vnpay.vn/vpcpay.html"
```

### 4.2 Restart backend (zero-downtime)

```bash
cd /home/deployer/repo && bash deploy.sh
```

Hặc chỉ restart backend container:

```bash
ssh root@160.187.1.208 'cd /opt/cuonghoangdev && docker compose restart backend'
```

### 4.3 Verify backend started with new env

```bash
ssh root@160.187.1.208 'docker logs cuonghoangdev_backend --tail 50 | grep -iE "vnpay|TMN"'
```

Backend phải KHÔNG log "Missing env vars: VNPAY_TMN_CODE...".

### 4.4 Smoke test với thẻ thật (số tiền nhỏ)

1. Tạo 1 khoá học test giá 1.000đ (một nghìn đồng)
2. Mua thử với thẻ thật
3. Verify:
   - ✅ Tiền về tài khoản ngân hàng merchant
   - ✅ Status PAID, enrollment ACTIVE
   - ✅ IPN log hiện IP từ `203.171.20.0/24` hoặc `113.161.69.0/24`
4. Refund thử → verify tiền về thẻ user

### 4.5 Monitor

```bash
# Theo dõi IPN trong 5 phút đầu
watch -n 30 'ssh root@160.187.1.208 "docker logs cuonghoangdev_backend --since 5m | grep -iE \"vnpay|payment\""'

# Set up alert nếu lỗi xảy ra
ssh root@160.187.1.208 'docker logs -f cuonghoangdev_backend 2>&1 | grep -E "vnpay-refund API failed|Express error handler.*payments"'
```

---

## Phase 5 — Ongoing monitoring

### 5.1 Daily check (5 phút)

- `/admin/course-orders` → check orders hôm qua → status breakdown
- `payment_transactions` table → check IPN có fail không

### 5.2 Monthly check

- Reconcile VNPay merchant portal vs DB:
  - Số order PAID trong DB = số giao dịch thành công trên portal
- Check refund queue (nếu có refund failed → admin phải xử lý tay)

### 5.3 Nếu VNPay đổi IP

- Logs backend sẽ log `[vnpay-ipn] IP not in allowlist { clientIp }`
- Action: thêm IP mới vào `VNPAY_IP_ALLOWLIST` env → restart

### 5.4 Nếu hash secret rotate

- Phải update cả 2 chỗ cùng lúc (VNPay + server) → không bị downtime
- Plan migration trước 24h

---

## Checklist tóm tắt (đánh dấu khi xong)

- [ ] Đăng ký VNPay merchant, nhận TMN_CODE + HASH_SECRET
- [ ] Đăng ký IPN URL với VNPay: `https://cuongthai.com/api/v1/payments/vnpay/ipn`
- [ ] Update env trên VPS: TMN_CODE, HASH_SECRET, VNPAY_SANDBOX=0
- [ ] Test sandbox với thẻ test NCB (3.2, 3.3, 3.5 ở trên)
- [ ] Tạo khoá test 1.000đ → mua bằng thẻ thật → refund
- [ ] Verify IPN log từ production IP range
- [ ] Verify tiền về tài khoản ngân hàng merchant
- [ ] Monitor 24h đầu

---

## Nếu gặp sự cố

### IPN không fire (user thanh toán nhưng status không update)

1. Check logs: `docker logs cuonghoangdev_backend --since 1h | grep -i vnpay`
2. Nếu thấy `IP not in allowlist`: thêm IP mới vào `VNPAY_IP_ALLOWLIST`
3. Nếu thấy `Invalid checksum`: hash secret sai — kiểm tra lại `VNPAY_HASH_SECRET`
4. Nếu thấy `Order not found`: orderCode trong IPN không match DB — check URL encoding

### User refund thất bại (VNPay API reject)

1. Admin xem response `vnpayRefund` field trong `/admin/refund`
2. Nếu `responseCode !== '00'`: tiền chưa hoàn về user → admin xử lý tay qua VNPay portal
3. DB vẫn đánh dấu REFUNDED → user nhận email refund (admin đã thao tác refund ở VNPay portal)

### Tiền về nhưng status = PENDING

1. IPN bị miss (network glitch, VNPay retry hết)
2. Admin vào `/admin/course-orders` → chọn order → check VNPay portal thật
3. Nếu đã trừ tiền thật → admin bấm "Force PAID" (TODO: implement nếu cần)

---

## Files đã thay đổi (commit gần nhất)

- `src/middleware/vnpayIpnGuard.ts` — mở rộng IP whitelist
- `src/services/payment/vnpay.service.ts` — thêm `requestVnpayRefund()`
- `src/routes/payment.routes.ts` — wire VNPay refund API call vào admin refund flow

Không có file nào ảnh hưởng đến luồng đang chạy. Tất cả thay đổi là
**additive** (refund API mới + IP whitelist mở rộng). Behavior cũ giữ
nguyên — admin refund vẫn đánh dấu DB trước, sau đó gọi VNPay best-effort.
Nếu VNPay fail → log warning, admin retry sau.

---

**Liên hệ VNPay support** nếu gặp vấn đề:
- Hotline: 1900 545 426
- Email: hotro@vnpay.vn
- Merchant portal: https://merchant.vnpay.vn