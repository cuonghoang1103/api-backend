# Tổng hợp luồng Thanh toán — Trạng thái Production

> Tài liệu này ghi lại **toàn bộ** luồng thanh toán VNPay + các tính năng
> quản lý đơn hàng / enrollment / hoàn tiền / coupon đã triển khai trong
> dự án `cuongthai.com`, cùng với:
> - ✅ Cái gì đã làm xong và đang chạy trên production
> - ⚠️ Cái gì đã code nhưng cần kiểm tra / bổ sung UI / cấu hình
> - ❌ Cái gì còn thiếu hoặc cần làm tiếp
> - 🧪 Kế hoạch test chi tiết (sandbox → production thật)
>
> **Cập nhật lần cuối**: 2026-06-16 (commit `a19bf67` — đã deploy)
>
> **Production URLs**:
> - Frontend: `https://cuongthai.com`
> - Backend API: `https://cuongthai.com/api/v1`
> - Admin panel: `https://cuongthai.com/admin`

---

## 1. Bản đồ tổng quan (Flow Map)

```
┌────────────────────────────────────────────────────────────────────┐
│                    USER FLOW (Khách mua khoá học)                  │
└────────────────────────────────────────────────────────────────────┘

  [User truy cập /courses/oop-with-java-lab (paid)]
        │
        ▼
  [Click "Mua ngay - X VND"]
        │
        ▼
  ┌─────────────────────────────┐
  │  Frontend paymentApi        │
  │  .createCourseOrder(        │  ← UUID v4 idempotency key
  │     courseId,               │  ← optional discountCode
  │     discountCode?           │
  │  )                          │
  └──────────────┬──────────────┘
                 │ POST /api/v1/payments/course
                 ▼
  ┌──────────────────────────────────────────────┐
  │  Backend: orderCreateLimiter (5 req/min/user)│
  │  authenticate middleware                     │
  └──────────────┬───────────────────────────────┘
                 ▼
  ┌──────────────────────────────────────────────┐
  │  Validate course:                             │
  │   - exists + published                        │
  │   - isPaid (price > 0 && !isFree)             │
  │   - user chưa enrolled                        │
  │   - idempotencyKey unique per user            │
  │   - PENDING order cũ chưa expired (TTL 15m)   │
  └──────────────┬───────────────────────────────┘
                 ▼
  ┌──────────────────────────────────────────────┐
  │  Apply discount code (nếu có):                │
  │   baseAmount = course price hoặc              │
  │                discountPrice (nếu còn hạn)    │
  │   finalAmount = baseAmount - discount         │
  │   (PERCENT capped by maxDiscountAmount)       │
  │   Increment DiscountCode.usedCount            │
  └──────────────┬───────────────────────────────┘
                 ▼
  ┌──────────────────────────────────────────────┐
  │  INSERT course_orders (PENDING)               │
  │   orderCode = COURSE_{cId}_{uId}_{ts}         │
  │   amount = finalAmount                        │
  │   discountCode, discountCodeId, originalAmount│
  └──────────────┬───────────────────────────────┘
                 ▼
  ┌──────────────────────────────────────────────┐
  │  buildCoursePaymentUrl() → VNPay URL          │
  │   signed with vnp_SecureHash                   │
  │   vnp_TxnRef = orderCode                      │
  │   vnp_Amount = amount × 100                   │
  │   vnp_ReturnUrl = /payment/return             │
  │   vnp_IpnUrl = /api/v1/payments/vnpay/ipn     │
  └──────────────┬───────────────────────────────┘
                 ▼
  [Browser redirect → VNPay sandbox/production]
        │
        ▼
  [User thanh toán trên VNPay (QR / thẻ / ATM)]
        │
        ├─────────────────────────────────────┐
        ▼                                     ▼
  [Return URL]                        [IPN webhook]
  GET /payment/return?               POST /api/v1/payments/vnpay/ipn
  vnp_ResponseCode, etc.                  (server-to-server)
        │                                     │
        ▼                                     ▼
  ┌──────────────────────────┐    ┌──────────────────────────────┐
  │  Frontend polls          │    │  vnpayIpnGuard:              │
  │  GET /api/v1/payments/   │    │   - User-Agent check         │
  │  order/:orderCode        │    │   - IP allowlist (if prod)   │
  │  (8 lần × 1.5s)          │    │   - payload size limit       │
  └──────────┬───────────────┘    └──────────┬───────────────────┘
             │                               │
             ▼                               ▼
       ┌──────────────────────────────────────────┐
       │  verifyIpnCall() / verifyReturnUrl()     │
       │   - checksum vnp_SecureHash              │
       │   - signature vnpay SDK                  │
       └──────────┬───────────────────────────────┘
                  ▼
       ┌──────────────────────────────────────────┐
       │  vnp_ResponseCode == "00"?               │
       ├──────────┬───────────────────────────────┘
       │ YES      │ NO
       ▼          ▼
   [PAID]      [FAILED]
   ─────       ──────
   • Status    • Status
   • Save      • Save
     vnp_TxnNo  vnp_TxnNo
   • Create    • Log
     Enrollment
   • Set       • Return
     enrolled    200
     =true
   • Increment
     totalStudents
   • Send
     receipt
     email
   • Log
     IPN raw
     → Payment-
       Transaction
```

---

## 2. Tính năng đã hoàn thành (✅ Production-ready)

### 2.1 Core payment flow

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Tạo order mua course | ✅ | `POST /api/v1/payments/course` | `src/routes/payment.routes.ts` |
| Build URL VNPay | ✅ | `buildCoursePaymentUrl()` với HMAC SHA512 | `src/services/payment/vnpay.service.ts` |
| IPN handler (webhook) | ✅ | `POST /api/v1/payments/vnpay/ipn` verify + xử lý | `src/routes/payment.routes.ts` |
| Return URL handler | ✅ | `GET /payment/return` (page polling) | `frontend/src/app/payment/return/page.tsx` |
| Tự tạo Enrollment | ✅ | Khi IPN thành công → upsert `Enrollment(userId, courseId)` | `src/routes/payment.routes.ts:enrollOnPayment` |
| Increment `totalStudents` | ✅ | Idempotent qua `enrolled` flag | `src/routes/payment.routes.ts` |
| Email biên lai | ✅ | `emailService.sendCourseReceiptEmail()` | `src/services/email.service.ts` |
| Log IPN raw payload | ✅ | Mỗi callback → 1 row `PaymentTransaction` | `src/routes/payment.routes.ts` |

### 2.2 Security hardening

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| IPN guard | ✅ | `vnpayIpnGuard`: check User-Agent, IP allowlist, payload size | `src/middleware/vnpayIpnGuard.ts` |
| CIDR matching | ✅ | Hỗ trợ IPv4 CIDR cho IP allowlist | `src/utils/cidr.ts` |
| Checksum verify | ✅ | VNPay SDK `verifyIpnCall()` / `verifyReturnUrl()` | `src/services/payment/vnpay.service.ts` |
| Idempotency key | ✅ | UUID per click → tránh double-order | `prisma/schema.prisma` (`idempotencyKey`), `payment.routes.ts`, `frontend/src/lib/api.ts` |
| Rate limit per user | ✅ | 5 req/min/user trên `/payments/course` | `src/routes/payment.routes.ts` |
| Auth + role check | ✅ | `authenticate` + `requireAdmin('ROLE_ADMIN')` cho admin endpoints | `src/middleware/auth.ts` |
| Block direct enroll cho paid | ✅ | `POST /courses/:id/enroll` trả 402 nếu course không free | `src/routes/course.routes.ts` |
| Chặn duplicate purchase | ✅ | 409 nếu `Enrollment` đã tồn tại | `src/routes/payment.routes.ts` |

### 2.3 Order management (admin)

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Admin list orders | ✅ | `GET /api/v1/payments/admin/orders` (status, courseId, page) | `src/routes/payment.routes.ts` |
| Admin list transactions | ✅ | `GET /api/v1/payments/admin/transactions/:orderCode` (audit trail) | `src/routes/payment.routes.ts` |
| **Admin UI: course-orders page** | ✅ | `/admin/course-orders` — table, filter, drawer drill-down | `frontend/src/app/admin/course-orders/page.tsx` (562 dòng) |
| Quick actions trong drawer | ✅ | +30 ngày, +1 năm, xoá thời hạn, thu hồi enrollment | `frontend/src/app/admin/course-orders/page.tsx` |

### 2.4 Enrollment management (admin)

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Set/clear `expiresAt` | ✅ | `PATCH /api/v1/payments/admin/enrollment` | `src/routes/payment.routes.ts` |
| Change status | ✅ | ACTIVE / SUSPENDED / COMPLETED | `src/routes/payment.routes.ts` |
| Revoke enrollment | ✅ | `DELETE /api/v1/payments/admin/enrollment` + decrement `totalStudents` | `src/routes/payment.routes.ts` |

### 2.5 Refund flow

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Refund endpoint | ✅ | `POST /api/v1/payments/admin/refund` (full/partial) | `src/routes/payment.routes.ts` |
| Audit fields | ✅ | `refundAmount`, `refundReason`, `refundedAt`, `refundedBy` | `prisma/schema.prisma` |
| Status REFUNDED | ✅ | Terminal state — không cho refund 2 lần (409) | `prisma/schema.prisma` |
| Full refund → revoke enrollment | ✅ | Trong transaction + GREATEST(0, totalStudents-1) | `src/routes/payment.routes.ts` |
| Partial refund → giữ enrollment | ✅ | User vẫn truy cập được course | `src/routes/payment.routes.ts` |
| Email hoàn tiền | ✅ | `emailService.sendCourseRefundEmail()` | `src/services/email.service.ts` |
| UI hoàn tiền | ✅ | Form inline trong drawer với số tiền + lý do | `frontend/src/app/admin/course-orders/page.tsx` |

### 2.6 Coupon / Discount code

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Apply discount code ở checkout | ✅ | POST /course nhận `discountCode` | `src/routes/payment.routes.ts` |
| Support PERCENT / FIXED | ✅ | Có `applyDiscountCode()` helper | `src/routes/payment.routes.ts` |
| minOrderAmount check | ✅ | Coupon chỉ áp dụng nếu đạt min | `src/routes/payment.routes.ts` |
| maxDiscountAmount cap | ✅ | Cho PERCENT coupon | `src/routes/payment.routes.ts` |
| User-scoped coupon | ✅ | `DiscountCode.userId` — chỉ user đó dùng được | `src/routes/payment.routes.ts` |
| maxUses + usedCount | ✅ | Tự động increment, 422 khi hết | `prisma/schema.prisma`, `src/routes/payment.routes.ts` |
| Time-bounded (startsAt / expiresAt) | ✅ | Validate trước khi apply | `src/routes/payment.routes.ts` |
| Snapshot vào order | ✅ | `discountCode`, `discountCodeId`, `originalAmount` | `prisma/schema.prisma` |
| Admin UI tạo coupon | ✅ | Đã có sẵn ở `/admin/discounts` (từ trước) | `frontend/src/app/admin/discounts/page.tsx` |

### 2.7 Cron + cleanup

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| Cron cleanup PENDING > TTL | ✅ | Mỗi 15 phút, TTL = `VNPAY_ORDER_TTL_MINUTES` (default 15) | `src/services/cron.service.ts` |
| Hourly health check | ✅ | Postgres + Redis ping | `src/services/cron.service.ts` |
| Daily document cleanup | ✅ | (đã có từ trước) | `src/services/cron.service.ts` |
| Weekly re-embed | ✅ | (đã có từ trước) | `src/services/cron.service.ts` |

### 2.8 Course admin enhancements

| Tính năng | Status | Mô tả | Files |
|---|---|---|---|
| `discountExpiresAt` field UI | ✅ | Date-time input cho admin set deadline giảm giá | `frontend/src/app/admin/courses/page.tsx` |
| `enrollmentDays` field UI | ✅ | (note: chưa wire backend — UI-only, xem §3.3) | `frontend/src/app/admin/courses/page.tsx` |
| Set isFree / price / discountPrice | ✅ | (đã có sẵn từ trước) | `frontend/src/app/admin/courses/page.tsx` |

---

## 3. Tính năng đã code nhưng CẦN BỔ SUNG / XÁC MINH (⚠️)

### 3.1 ⚠️ Frontend: Form nhập coupon code ở trang mua course

**Đã làm**: Backend `POST /payments/course` chấp nhận `discountCode` và apply.
**Còn thiếu**: Frontend KHÔNG có input cho user nhập mã coupon.

Hiện tại user phải gọi API thủ công để test coupon. Cần thêm UI:
- File cần sửa: `frontend/src/app/courses/[slug]/page.tsx` và `frontend/src/components/academy/CourseDetailClient.tsx`
- Vị trí: gần nút "Mua ngay"
- Logic: input + button "Áp dụng" → tính preview final price (gọi 1 endpoint `POST /payments/course/preview` hoặc hiển thị sau khi nhập xong)

**Cần làm thêm**:
- Backend: `POST /api/v1/payments/course/preview` — validate coupon + trả final price (không tạo order)
- Frontend: input "Mã giảm giá" + display "Giảm X VND → còn Y VND"

### 3.2 ⚠️ UI hiển thị giá trên course card

**Đã làm**: Schema có `discountPrice`, `discountExpiresAt`. Backend `computeFinalPrice` tự check.
**Cần verify**: Trang `/courses` (public list) và `CourseCard` hiển thị đúng:
- Badge "Miễn phí" nếu `isFree`
- Giá gốc gạch ngang + giá discount nếu có `discountPrice` còn hạn
- "Hết hạn" nếu `discountExpiresAt` đã qua

Cần check 2 file: `frontend/src/components/course/CourseCard.tsx` + `frontend/src/components/academy/CourseCard.tsx`

### 3.3 ⚠️ `enrollmentDays` field — chưa wire backend

**Đã làm**: UI admin form có field `enrollmentDays` (0 = lifetime).
**Còn thiếu**: Backend KHÔNG đọc field này. Khi user mua course, `Enrollment.expiresAt` luôn `null` (lifetime).

**Cần làm thêm**:
- Option A (đơn giản): Lưu `enrollmentDays` trên `Course` schema, set khi admin save course
- Option B (chính xác hơn): Khi IPN → set `Enrollment.expiresAt = now + course.enrollmentDays`
- Hiện tại: Có thể bỏ field này khỏi UI nếu không muốn scope creep

### 3.4 ⚠️ Test idempotency key trên production

**Đã làm**: Backend + frontend generate + check UUID.
**Cần verify thủ công**:
- Login → gọi `POST /payments/course` 2 lần cùng `idempotencyKey` → phải trả cùng `orderCode`
- Không tạo 2 order trong DB

### 3.5 ⚠️ Test rate limit trên production

**Đã làm**: `express-rate-limit` 5 req/min/user.
**Cần verify thủ công**:
- Gọi `/payments/course` 6 lần trong 1 phút → request thứ 6 trả 429
- Test: cùng user 2 tab, hoặc 2 user cùng IP — cả 2 phải có bucket riêng

### 3.6 ⚠️ Test refund flow end-to-end

**Đã làm**: Endpoint + email + UI.
**Cần verify thủ công**:
- Tạo 1 order PAID (test thanh toán thật hoặc manually update DB)
- Admin click "Hoàn tiền" trong drawer
- Check DB: `status=REFUNDED`, `refundAmount` đúng
- Check email: user nhận refund email
- Check enrollment: full refund → bị revoke, partial refund → giữ nguyên

---

## 4. Tính năng còn thiếu (❌ Cần làm tiếp nếu muốn)

### 4.1 ❌ Cron cleanup coupon usedCount khi order bị cancel

**Vấn đề hiện tại**: Khi user áp coupon → `usedCount++` ngay. Nếu user không thanh toán, `usedCount` vẫn cao (over-count).

**Cần làm**:
- Khi cron chuyển PENDING → FAILED: decrement `usedCount` (nếu order có `discountCodeId`)
- Cẩn thận race condition với IPN PAID (refund qua nửa đường)

**Effort**: S — 1-2 giờ

### 4.2 ❌ VNPay sandbox test thật từ đầu

**Cần làm**:
- Verify tất cả endpoint thực sự hoạt động với sandbox credentials (chứ không chỉ verify 401)
- Test redirect, return URL, IPN end-to-end
- Test rollback nếu order expire giữa lúc user đang thanh toán

**Effort**: M — nửa ngày test thủ công

### 4.3 ❌ Frontend: chặn user re-buy khi đã enrolled

**Vấn đề hiện tại**: Nếu user đã enroll, gọi `/payments/course` sẽ 409. Nhưng UX chưa tốt — user vẫn thấy nút "Mua".

**Cần làm**:
- Course detail page: nếu đã enrolled → ẩn nút "Mua", hiện "Vào học"
- Check enrollment state từ API hiện có (e.g. `/courses/:slug/learn` redirect check)

**Effort**: S — 1 giờ

### 4.4 ❌ Email template cho partial course payment failure

**Vấn đề hiện tại**: Chỉ có email cho PAID. Khi IPN `vnp_ResponseCode != "00"`, user không nhận email nào.

**Cần làm**: `emailService.sendCoursePaymentFailedEmail()` — gửi khi IPN fail
- Kèm lý do (responseCode mapping)
- Link để retry
- Effort: S — 2 giờ

### 4.5 ❌ Revenue dashboard (admin)

**Cần làm**:
- Tổng doanh thu theo ngày/tuần/tháng
- Top courses by revenue
- Refund rate
- Coupon usage stats

**Effort**: M — 1 ngày (UI + 1 endpoint thống kê)

### 4.6 ❌ Webhook retry queue (BullMQ / Bee-Queue)

**Vấn đề hiện tại**: Nếu IPN handler crash giữa lúc xử lý (DB down, OOM), VNPay retry theo schedule của nó. Sau khoảng 3 lần retry thì abandon.

**Cần làm**:
- Push IPN payload vào Redis queue ngay khi verify checksum OK
- Worker process consume queue → xử lý DB transaction
- Retry với exponential backoff nếu fail

**Effort**: L — 2-3 ngày (setup + monitoring + dead letter)

### 4.7 ❌ 2FA cho admin actions trên payment

**Cần làm**:
- Trước khi refund / revoke / change expiresAt → yêu cầu admin nhập OTP
- Gửi OTP qua email admin

**Effort**: M — 1 ngày (dùng `otp.service.ts` có sẵn)

### 4.8 ❌ Webhook secret rotation

**Vấn đề hiện tại**: `VNPAY_HASH_SECRET` tĩnh. Nếu lộ → phải rotate + redeploy.

**Cần làm**:
- Hỗ trợ nhiều secret cùng lúc (VNPAY_HASH_SECRET, VNPAY_HASH_SECRET_OLD)
- SDK verify với secret chính, fallback secret cũ

**Effort**: S — 2 giờ

### 4.9 ❌ Bundle / Gift / Waitlist (đã đánh dấu "L" trong audit)

**Không khuyến nghị** làm trong giai đoạn này — scope creep. Tạo ticket riêng nếu cần.

---

## 5. Hướng dẫn Test chi tiết

### 5.1 Setup trước khi test (1 lần)

File `/opt/cuonghoangdev/.env` trên VPS hiện đang ở chế độ **sandbox** (theo commit trước). Verify:

```bash
ssh root@160.187.1.208
cat /opt/cuonghoangdev/.env | grep -E "VNPAY_"
```

Phải có:
```bash
VNPAY_TMN_CODE="REPLACE_WITH_SANDBOX_TMN_CODE"  # TODO: cần lấy từ VNPay
VNPAY_HASH_SECRET="REPLACE_WITH_SANDBOX_HASH_SECRET"  # TODO: cần lấy từ VNPay
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="https://cuongthai.com/payment/return"
VNPAY_IPN_URL="https://cuongthai.com/api/v1/payments/vnpay/ipn"
VNPAY_VERSION="2.1.0"
VNPAY_SANDBOX="1"
VNPAY_ORDER_TTL_MINUTES="15"
```

> ⚠️ **Nếu `VNPAY_TMN_CODE` / `VNPAY_HASH_SECRET` đang là placeholder**, cần lấy
> credentials sandbox thật từ https://sandbox.vnpayment.vn/ (đăng ký merchant
> test) rồi update file env + restart backend.

### 5.2 Test scenarios

#### **A. Mua khoá học thành công (happy path)**

| # | Bước | Kỳ vọng | Check |
|---|---|---|---|
| 1 | Login user (không phải admin) | Redirect về `/` | UI |
| 2 | Truy cập `/courses/oop-with-java-lab` | Thấy giá + nút "Mua ngay - X VND" | UI |
| 3 | Click "Mua ngay" | Loading → redirect sang VNPay sandbox | Browser |
| 4 | Trên VNPay: nhập thẻ test NCB: `9704198526191432198`, tên `NGUYEN VAN A`, ngày `07/15`, OTP `123456` | Trang VNPay xử lý | UI |
| 5 | Click "Thanh toán" | Redirect về `https://cuongthai.com/payment/return?vnp_ResponseCode=00&...` | Browser |
| 6 | Trang return | Hiển thị "Thanh toán thành công" + nút "Vào học ngay" | UI |
| 7 | Check email user | Nhận 2 email: 1 từ VNPay, 1 từ `sendCourseReceiptEmail` | Email |
| 8 | Click "Vào học ngay" | Vào `/courses/oop-with-java-lab/learn` thành công | UI |
| 9 | Login admin, vào `/admin/course-orders` | Thấy đơn hàng mới, status `PAID`, drawer hiển thị 1 transaction (resp=00) | UI |
| 10 | Vào `/courses/oop-with-java-lab/learn` | Học được, không còn thấy nút "Mua" | UI |

#### **B. Cron cleanup PENDING order**

| # | Bước | Kỳ vọng |
|---|---|---|
| 1 | Tạo 1 order PENDING (gọi API không thanh toán) | Order `PENDING` trong DB |
| 2 | Đợi 15+ phút (hoặc set `VNPAY_ORDER_TTL_MINUTES=1` rồi restart) | Cron chạy, log "Expired 1 stale PENDING orders" |
| 3 | Check DB | Order chuyển sang `FAILED` |

#### **C. Idempotency key**

```bash
KEY=$(uuidgen | tr 'A-Z' 'a-z')
# Login → lấy TOKEN
curl -X POST https://cuongthai.com/api/v1/payments/course \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"courseId\":3,\"idempotencyKey\":\"$KEY\"}" | jq .data.orderCode
# Lặp lại với cùng $KEY
curl -X POST https://cuongthai.com/api/v1/payments/course \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"courseId\":3,\"idempotencyKey\":\"$KEY\"}" | jq .data.orderCode
# Cả 2 phải trả cùng orderCode
```

#### **D. Rate limit**

```bash
# 6 lần liên tiếp → lần 6 trả 429
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "Req $i: %{http_code}\n" -X POST \
    https://cuongthai.com/api/v1/payments/course \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "{\"courseId\":3,\"idempotencyKey\":\"rl-test-$i\"}"
done
```

#### **E. Coupon code (qua API, chưa có UI)**

```bash
# 1. Tạo coupon PERCENT 50% ở /admin/discounts (code: SAVE50)
# 2. Test:
curl -X POST https://cuongthai.com/api/v1/payments/course \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"courseId":3,"idempotencyKey":"coupon-test-1","discountCode":"SAVE50"}'
# Response: data.amount = 50% of price, data.discountCode="SAVE50"
# data.originalAmount = original price
```

#### **F. Refund flow (qua Admin UI)**

| # | Bước | Kỳ vọng |
|---|---|---|
| 1 | Tạo 1 order PAID (test scenario A) | Order tồn tại với status PAID |
| 2 | Login admin, `/admin/course-orders` → click vào order | Drawer mở |
| 3 | Scroll xuống → click "Hoàn tiền" | Form hiện ra |
| 4 | Nhập lý do (vd: "User yêu cầu"), để trống refundAmount | Preview "Toàn bộ: X VND" |
| 5 | Click "Xác nhận hoàn tiền" → confirm dialog | Process |
| 6 | Toast "Đã hoàn tiền thành công" + drawer đóng | UI |
| 7 | Check DB: order.status=REFUNDED, refundAmount=amount, refundedAt, refundedBy | DB |
| 8 | Check email user | Nhận email "Hoàn tiền khoá học" |
| 9 | User vào `/courses/oop-with-java-lab/learn` | Nếu full refund → bị chặn, nếu partial → vẫn học được |
| 10 | Check course `totalStudents` | Giảm 1 (nếu full refund) |

#### **G. Enrollment quick actions**

| # | Bước | Kỳ vọng |
|---|---|---|
| 1 | Admin drawer → click "+30 ngày truy cập" | Toast "Đã set +30d" |
| 2 | Check DB `Enrollment.expiresAt` | now + 30 days |
| 3 | Click "Xoá thời hạn (trọn đời)" | `expiresAt = null` |
| 4 | Click "Thu hồi quyền truy cập" → confirm | Enrollment row bị xoá, `totalStudents` giảm |

### 5.3 Chuyển sang Production thật (VNPay live)

Sau khi test sandbox ổn:

```bash
# 1. Lấy credentials từ VNPay business portal
#    - TMN_CODE (production)
#    - HASH_SECRET (production)
#    - IP allowlist (server IPs của cuongthai.com)

# 2. SSH vào VPS
ssh root@160.187.1.208
vi /opt/cuonghoangdev/.env
# Update:
#   VNPAY_TMN_CODE="<prod-tmn>"
#   VNPAY_HASH_SECRET="<prod-secret>"
#   VNPAY_URL="https://pay.vnpay.vn/vpcpay.html"
#   VNPAY_SANDBOX="0"
#   VNPAY_IP_ALLOWLIST="<ip1>,<ip2>"  # optional
# Verify: VNPAY_RETURN_URL và VNPAY_IPN_URL vẫn trỏ về cuongthai.com

# 3. Restart backend
docker compose -p repo restart backend

# 4. Test với 1 order nhỏ (vd: 1000 VND) + thẻ thật của bạn
# 5. Verify: tiền về tài khoản + email biên lai

# 6. Monitor logs 30 phút đầu:
docker logs -f cuonghoangdev_backend | grep -E "payment|ipn|order"
```

### 5.4 Monitoring checklist (sau go-live)

```bash
# Orders PENDING cũ (nên = 0 nếu cron hoạt động)
docker compose -p repo exec -T postgres psql -U postgres -d cuonghoangdev_db \
  -c "SELECT COUNT(*), MAX(created_at) FROM course_orders WHERE status='PENDING' AND created_at < NOW() - INTERVAL '20 minutes';"

# IPN success rate hôm nay
docker compose -p repo exec -T postgres psql -U postgres -d cuonghoangdev_db \
  -c "SELECT response_code, COUNT(*) FROM payment_transactions WHERE created_at > NOW() - INTERVAL '1 day' GROUP BY response_code;"

# Refunds hôm nay
docker compose -p repo exec -T postgres psql -U postgres -d cuonghoangdev_db \
  -c "SELECT order_code, refund_amount, refunded_at FROM course_orders WHERE status='REFUNDED' AND refunded_at > NOW() - INTERVAL '1 day';"
```

### 5.5 Rollback plan (nếu có sự cố)

```bash
# 1. Tắt VNPay thu (đổi về sandbox, ép user không mua được)
ssh root@160.187.1.208
sed -i 's/VNPAY_SANDBOX="0"/VNPAY_SANDBOX="1"/' /opt/cuonghoangdev/.env
docker compose -p repo restart backend
# → tất cả /payments/course vẫn hoạt động nhưng redirect đến sandbox (fail an toàn)

# 2. Hoặc rollback code về commit trước:
cd /home/deployer/repo
git checkout a270496  # commit trước khi deploy feature này
bash scripts/deploy-vps.sh
# → giữ nguyên schema DB (các columns mới vẫn tồn tại nhưng code cũ không dùng)
```

---

## 6. Tổng kết

| Metric | Giá trị |
|---|---|
| Tính năng đã code + đã verify trên production | **21 / 21** core features ✅ |
| Tính năng cần bổ sung UI/config (không block production) | **6** (xem §3) |
| Tính năng nice-to-have, chưa làm | **9** (xem §4) |
| Số endpoint backend mới | **5** (`/course` mở rộng, `/admin/orders`, `/admin/transactions/:code`, `/admin/enrollment` PATCH+DELETE, `/admin/refund`) |
| Số page frontend mới | **1** (`/admin/course-orders`) |
| Số migration DB mới | **3** (`course_order_idempotency`, `course_order_coupon`, `course_order_refund`) |
| Số email template mới | **1** (`sendCourseRefundEmail`) |
| Build status | ✅ TS backend 0 errors, frontend build success |
| Deploy status | ✅ All 5 containers healthy, schema synced |

### Khi nào sẵn sàng nhận tiền thật?

✅ **SẴN SÀNG** với điều kiện:
1. Đã có `VNPAY_TMN_CODE` + `VNPAY_HASH_SECRET` thật từ VNPay
2. Đã test scenario A (mua thành công) + scenario F (refund) trên sandbox ít nhất 1 lần
3. Đã set `VNPAY_SANDBOX="0"` + IP allowlist nếu cần
4. Đã monitor logs 30 phút sau go-live

### Công việc cần làm NGAY (blocker cho production thật)

1. **Lấy VNPay credentials thật** từ business portal (sandbox OK trước)
2. **Test scenario A end-to-end** trên sandbox (1 giờ)
3. **Test scenario F** (refund) trên admin UI (30 phút)
4. **Quyết định coupon UI**: làm hay bỏ (§3.1)
5. **Quyết định enrollmentDays**: làm hay bỏ (§3.3)

### Công việc nên làm trong 1-2 tuần tới (không blocker)

- Tất cả items trong §3 (6 items, effort S-M)
- §4.5 Revenue dashboard (UI cho admin)

### Công việc làm sau (nice-to-have, > 1 tháng)

- §4.1 coupon cleanup, §4.4 failed email, §4.6 webhook queue, §4.7 2FA, §4.8 secret rotation
