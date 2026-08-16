# Bảo mật — CuongThai Desktop

> Cập nhật 16/08/2026. Mọi khẳng định ở đây đều đối chiếu với mã và kiểm bằng
> `npm run smoke` (21/21 đạt), không phải bằng đọc lướt.

---

## 1. Cách ly renderer

| Cấu hình | Giá trị | Đã đo |
|---|---|---|
| `contextIsolation` | `true` | ✓ |
| `nodeIntegration` | `false` | ✓ |
| `sandbox` | `true` | ✓ |
| `webSecurity` | `true` | ✓ |
| `devTools` | chỉ ở bản dev | ✓ |

Smoke test kiểm chứng renderer **không** thấy `require`, `process`, `module`,
`Buffer` — và cầu nối chỉ phơi ra đúng 6 nhóm đã khai báo.

Kiểm tra payload nằm ở **main**, không ở preload. Preload đứng cùng phía với
renderer: ai chiếm được renderer thì cũng vượt được lớp kiểm đặt ở preload.

Kênh IPC khai báo mà quên đăng ký handler → app **chết ngay lúc khởi động**
(`assertEveryChannelRegistered`), không để lỗi câm tới máy người dùng.

---

## 2. ⚠️ Token phiên là giấy thông hành gần như vĩnh viễn

**Đây là điều quan trọng nhất trong tài liệu này.**

Đối chiếu mã backend ngày 16/08/2026:

- `AuthResponse` trả về **hai** trường: `token` và `refreshToken`.
- `refreshToken` ký bằng `jwtRefreshSecret`. Biến đó xuất hiện đúng **hai** chỗ
  trong toàn bộ mã backend: khai báo config (`src/config/env.ts:215`) và dòng ký
  (`src/services/auth.service.ts:868`). **Không endpoint nào verify nó.**
  → `refreshToken` là token **chết**. Cất nó rồi gửi lên `/auth/refresh` chỉ
  nhận 401 mãi mãi.
- `POST /api/v1/auth/refresh` nhận **access token** qua header `Authorization:
  Bearer`, verify bằng `jwtSecret` với **`ignoreExpiration: true`**
  (`auth.service.ts:893`), rồi trả `AuthResponse` mới.

### Hệ quả

Access token đã lưu **đổi được token mới bất kể đã hết hạn bao lâu**, chừng nào
tài khoản còn `enabled` và `accountNonLocked`. Nói cách khác:

- `JWT_EXPIRES_IN=24h` **không** giới hạn tuổi thọ thực tế của phiên.
- **Không có "đăng xuất khỏi mọi thiết bị".** Backend không lưu token đã cấp,
  nên không có gì để thu hồi. Cách duy nhất cắt một token bị lộ là **vô hiệu hoá
  tài khoản** (`enabled = false`).
- Một file `session.bin` bị chép đi = quyền truy cập lâu dài vào tài khoản đó.

### Vì thế app làm gì

- Token cất bằng **`safeStorage`** (Keychain trên macOS, DPAPI trên Windows,
  libsecret/kwallet trên Linux), file quyền `0600`, nằm ở **main** chứ không
  phải `localStorage` của renderer.
- Không có keyring (Linux tối giản) → app **từ chối ghi** thay vì ghi chữ
  thường rồi vờ như đã an toàn. Người dùng phải đăng nhập lại mỗi lần mở app,
  và được nói rõ lý do.
- Giải mã hỏng (đổi tài khoản HĐH, keyring bị tạo lại) → xoá file, đăng nhập
  sạch, **không** làm app chết.

### Khuyến nghị cho backend (ngoài phạm vi app desktop)

Nếu muốn thu hồi được phiên, backend cần một trong hai: danh sách token bị thu
hồi (`jti` + bảng blacklist), hoặc `refreshToken` được verify thật và xoay vòng.
Hiện tại không có cái nào.

---

## 3. Điều hướng và nội dung

- CSP đặt bằng **header** (`onHeadersReceived`), không phải thẻ `<meta>` — thẻ
  meta chỉ có hiệu lực sau khi parser đọc tới nó, script đứng trước vẫn chạy.
- Bản đóng gói **không** có `'unsafe-eval'`. Chỉ dev có, vì Vite HMR cần.
- `connect-src` là danh sách đóng: chỉ backend, media, và WebSocket của chúng.
- Ba đường mở nội dung lạ đều bịt: `will-navigate`, `setWindowOpenHandler`,
  và `will-attach-webview`. Bịt hai quên một là vẫn còn đường.
- `shell.openExternal` chỉ nhận `http:`/`https:` — kiểm **hai lớp** (zod ở
  hợp đồng IPC, và kiểm lại trong handler). Scheme lạ giao cho HĐH có thể khởi
  chạy chương trình đã đăng ký scheme đó.
- Protocol `app://` chống path traversal: resolve rồi **đối chiếu lại** với thư
  mục gốc. Không có bước này thì `app://cuongthai/../../../etc/passwd` đọc được
  file ngoài bundle.
- Mọi quyền (`setPermissionRequestHandler`) **từ chối theo mặc định**.

### Vì sao `app://` chứ không `file://`

`file://` có origin `null` → mọi lời gọi API là "null origin", backend không
phân biệt được app thật với một trang bất kỳ, và không thêm vào allowlist CORS
cho đúng được. `app://cuongthai` là origin thật, thêm đúng một dòng vào
`CORS_ORIGINS` là xong.

---

## 4. Cấu hình phía máy chủ

Đã đặt trên VPS ngày 16/08/2026 (`/opt/cuonghoangdev/.env`, dòng 273):

```bash
CORS_ORIGINS="app://cuongthai"
```

⚠️ Biến sống là **`CORS_ORIGINS`** (đọc ở `src/index.ts:249`). Biến
`ALLOWED_ORIGINS` cũng có trong `.env` nhưng là **cấu hình chết** — nó chỉ chảy
vào `config.corsOrigins` (`src/config/env.ts:226`) và không nơi nào dùng tới.

Đã kiểm bằng preflight thật, kèm đối chứng âm:

| Origin | Kết quả |
|---|---|
| `app://cuongthai` | `204` + `Access-Control-Allow-Origin: app://cuongthai` |
| origin bịa | bị chặn (không có header allow-origin) |
| `https://cuongthai.com` | `204` — web không hề hấn |

---

## 5. Bí mật

- Không có khoá API nào trong mã renderer. Gốc API do **main** quyết
  (`app:getInfo`); renderer không tự đặt được — nếu tự đặt được thì một đoạn mã
  bị chèn có thể trỏ mọi lời gọi kèm token sang máy chủ của kẻ tấn công.
- `.gitignore` của `desktop/` chặn `*.p12`, `*.pfx`, `*.cer`. Một chứng chỉ lọt
  vào lịch sử git là phải **thu hồi chứng chỉ**, không phải xoá commit là xong.
- Lỗi zod ở IPC **không** được ném nguyên về renderer — nội dung lỗi chứa cả giá
  trị đã nhận, mà giá trị đó có thể là token.
- `credentials: 'omit'` trên mọi lời gọi API: app xác thực bằng Bearer, gửi kèm
  cookie chỉ tạo đường thứ hai để nhầm lẫn phiên nào đang có hiệu lực.

---

## 6. Giới hạn đã biết

| Giới hạn | Trạng thái |
|---|---|
| Bản cài **chưa ký số** — Gatekeeper/SmartScreen sẽ cảnh báo | có chủ ý (Phase 6 dựng sẵn đường ký) |
| Không thu hồi được phiên từ phía máy chủ | giới hạn của backend, xem mục 2 |
| Backend không đọc header `Idempotency-Key` | chỉ xếp hàng thao tác lặp-lại-vẫn-đúng |
| Đăng nhập bắt buộc có mạng | đúng thiết kế — không bịa xác thực ngoại tuyến |
