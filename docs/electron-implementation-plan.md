# Kế hoạch triển khai ứng dụng desktop CuongThai

> Trạng thái: **Phase 1 xong** (đã kiểm chứng bằng cách chạy thật).
> Cập nhật: 16/08/2026.

---

## 1. Kiến trúc hiện tại (đo từ repo, không phỏng đoán)

| Thành phần | Thực tế |
|---|---|
| Frontend | Next.js 14, `output: 'standalone'` — **SSR**, không phải SPA |
| Quy mô | 202 `page.tsx`; 151 client component, ~51 server component |
| Server-side | 28 route handler (`app/api/**/route.ts`) + `middleware.ts` (Edge) |
| Auth | cookie httpOnly `backend_token` do route Next đặt; proxy `/api/v1/[[...path]]` đọc cookie → gắn `Authorization: Bearer` |
| Backend | Express + TypeScript, Prisma/PostgreSQL, `/api/v1/*` |
| `AuthResponse` | trả **`token`** và **`refreshToken`** trong body ([src/types/index.ts:24](../src/types/index.ts)) |
| CORS | allowlist cố định + `CORS_ORIGINS` (CSV) |
| PWA | đang bật: `sw.js` network-first (03/07/2026), `manifest.json`, trang `/offline` |
| State | Zustand (21 store), TanStack Query |
| Styling | Tailwind + biến CSS theo theme |
| Deploy | `bash deploy.sh` từ máy local (rsync cây làm việc → build trên VPS) |

### Hệ quả với Electron

**Next.js SSR không xuất được ra tĩnh.** 51 server component + 28 route handler + middleware Edge sẽ chết nếu `next export`. Vì thế renderer desktop **không tái dùng được** cây trang của web — đây là ràng buộc kiến trúc, không phải lựa chọn.

**Auth phải đổi cơ chế.** Web dùng cookie httpOnly qua proxy cùng origin. Renderer desktop ở origin `app://cuongthai` gọi thẳng `api.cuongthai.com`, nên phải dùng `token` + `refreshToken` từ body. Backend đã hỗ trợ sẵn — không cần thêm endpoint nào.

---

## 2. Kiến trúc Electron

```
desktop/
├── src/main/          Node đầy đủ. Quyết mọi thứ nhạy cảm.
│   ├── index.ts       vòng đời app, single-instance, deep link, theo dõi mạng
│   ├── config.ts      origin, scheme, allowlist  ← nguồn sự thật duy nhất
│   ├── security.ts    CSP, chặn điều hướng, protocol app://, quyền
│   ├── window.ts      tạo + khôi phục cửa sổ
│   ├── store.ts       cấu hình JSON (KHÔNG chứa bí mật)
│   └── ipc/           handler, mỗi nhóm một file
├── src/preload/       cầu nối duy nhất, sandbox, chỉ contextBridge
├── src/renderer/      React + TS, KHÔNG có Node
└── src/shared/ipc.ts  hợp đồng IPC + schema zod (dùng chung)
```

### Ranh giới tin tưởng

```
renderer (KHÔNG tin)  →  preload (chuyển tiếp)  →  main (phán)
   không Node              không kiểm tra           zod kiểm mọi payload
   không bí mật            chỉ allowlist            giữ refreshToken
```

Kiểm tra đầu vào nằm ở **main**, không ở preload. Preload đứng cùng phía với renderer: ai chiếm được renderer thì cũng vượt được lớp kiểm đặt ở preload.

### Vì sao `app://cuongthai` chứ không `file://`

`file://` có origin `null`. Mọi lời gọi API sẽ là "null origin" — backend không phân biệt được app thật với một trang bất kỳ, và không có cách nào thêm vào allowlist CORS cho đúng. Scheme riêng đăng ký `standard: true, secure: true` cho origin thật, chạy được service worker và IndexedDB, và backend chỉ cần thêm một dòng vào `CORS_ORIGINS`.

---

## 3. File đã thêm (Phase 1)

| File | Vai trò |
|---|---|
| `desktop/src/shared/ipc.ts` | hợp đồng IPC + schema zod |
| `desktop/src/preload/index.ts` | contextBridge, allowlist sự kiện |
| `desktop/src/main/config.ts` | origin, scheme, `RENDERER_SOURCE` |
| `desktop/src/main/security.ts` | CSP, protocol, chặn điều hướng, quyền |
| `desktop/src/main/window.ts` | cửa sổ + khôi phục vị trí |
| `desktop/src/main/store.ts` | cấu hình + trạng thái cửa sổ |
| `desktop/src/main/index.ts` | điểm vào |
| `desktop/src/main/ipc/{index,app,settings,auth,storage,update}.ts` | handler |
| `desktop/src/renderer/{App.tsx,main.tsx,styles.css,index.html}` | màn hình tự kiểm chứng |
| `desktop/scripts/{dev.mjs,smoke.mjs}` | dev runner + smoke test e2e |
| `desktop/{package.json,tsconfig*.json,vite*.config.ts}` | build |

## 4. File đã sửa

| File | Sửa gì | Vì sao |
|---|---|---|
| `deploy.sh` | thêm `--exclude='desktop/release/'` và `desktop/out/` | installer 100–300MB/nền tảng; VPS không chạy app desktop. `node_modules/`+`dist/` đã khớp mọi độ sâu nên không cần thêm |

Không file nào của web bị đụng tới. Web vẫn chạy y nguyên.

---

## 5. Khả năng offline theo tính năng

Bảng này là **cam kết kỹ thuật**, không phải mong muốn. "Đồng bộ 2 chiều" chỉ khả thi khi backend có revision + conflict + idempotency; hiện **chưa có**, nên phần lớn là nháp cục bộ + hàng đợi gửi.

| Tính năng | Offline làm được | Cần mạng | Ghi chú |
|---|---|---|---|
| CV Builder | sửa + tự lưu + nháp + xem trước | chấm điểm AI, dịch, xuất phía server | Đây là module hợp offline nhất — phần lớn đã là client-side |
| Notes | đọc bản đã cache, nháp cục bộ | Yjs realtime, chia sẻ | Yjs có CRDT nên hợp nhất được — ứng viên tốt cho đồng bộ thật |
| Messages | đọc hội thoại đã cache, soạn nháp, **outbox** | gửi thật, typing, GIF, sticker | Outbox cần idempotency key để retry không nhân đôi tin |
| Tech Trends | đọc bài đã cache, giữ vị trí đọc | TL;DR AI, hỏi đáp, bình luận | AI cần Pro + mạng |
| Interview | tự luyện với đề đã tải, hẹn giờ, tự chấm | chấm AI, phân tích ZIP dự án | Phân biệt rõ "Tự luyện" ↔ "Phỏng vấn AI" |
| My Language | ôn tập + SRS trên dữ liệu đã tải | gia sư AI, TTS | Tiến độ vào hàng đợi |
| Forum | đọc chủ đề đã cache, nháp bài | đăng, sửa | Không hiện "đã đăng" trước khi server xác nhận |
| Music | metadata, hàng đợi, lời bài hát | phát nhạc, Listen Together | **Không** tải/cache audio có bản quyền |
| Pro | trạng thái quyền lợi lần cuối + mốc thời gian | xác minh | Không bao giờ vượt quyền phía server |

**Nguyên tắc bất di bất dịch:** không báo "đã đồng bộ" trước khi server xác nhận. UI phân biệt 5 trạng thái: *đã lưu cục bộ · chờ mạng · đang đồng bộ · đã đồng bộ · thất bại*.

---

## 6. Bảo mật

Đã làm ở Phase 1 (kiểm chứng bằng `npm run smoke`, 14/14 đạt):

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Renderer không thấy `require` / `process` / `module` / `Buffer` — **đã đo**
- Cầu nối chỉ phơi ra 6 nhóm đã khai báo — **đã đo**
- Mọi payload IPC qua zod ở main; sai thì từ chối, không ném chi tiết lỗi về renderer (chi tiết đó có thể chứa token)
- Kênh khai báo mà quên đăng ký handler → app **chết ngay lúc khởi động**, không lỗi câm
- IPC chỉ nhận từ frame của chính app (`isTrustedSender`)
- CSP đặt bằng **header** (không phải thẻ `<meta>`, vì meta chỉ có hiệu lực sau khi parser đọc tới nó)
- `will-navigate` + `setWindowOpenHandler` + chặn `<webview>` — bịt cả ba đường
- `shell.openExternal` chỉ nhận http/https (chặn `javascript:`, `file:`, và các scheme HĐH có thể chạy chương trình)
- Từ chối mọi quyền theo mặc định
- `devTools` tắt ở bản đóng gói
- Protocol `app://` chống path traversal — resolve rồi đối chiếu lại với thư mục gốc

Refresh token: `safeStorage` (Keychain/DPAPI/libsecret), file `0600`, **không bao giờ xuống renderer**. Không có keyring thì **từ chối ghi** thay vì ghi chữ thường rồi vờ như đã an toàn.

### Việc cần làm trên hạ tầng (Claude không tự làm được)

Trước khi renderer gọi được API thật (Phase 4), phải thêm origin desktop vào backend:

```bash
CORS_ORIGINS=app://cuongthai
```

Đặt trong `/opt/cuonghoangdev/.env` trên VPS. Thiếu dòng này thì mọi lời gọi API từ app bị chặn CORS.

---

## 7. Rủi ro và giả định

| Rủi ro | Mức | Xử lý |
|---|---|---|
| **Viết lại 202 trang** là khối lượng rất lớn | Cao | Port theo thứ tự ưu tiên; route chưa port dùng `WebContentsView` nạp web thật để app dùng được ngay từ đầu |
| Bản chưa ký bị Gatekeeper/SmartScreen chặn | Cao | Đã chọn: chưa mua chứng chỉ. Dựng sẵn đường ký + hướng dẫn người dùng cách mở |
| Service worker của web chồng với cache của app | Trung bình | Renderer desktop là bundle riêng, không nạp `sw.js` của web → không xung đột |
| Backend chưa có API đồng bộ 2 chiều | Trung bình | Chỉ đưa vào hàng đợi những thao tác backend hỗ trợ an toàn; còn lại là nháp cục bộ |
| Trôi dạt giữa UI web và UI desktop | Trung bình | Dùng chung kiểu dữ liệu API; khác biệt UI ghi vào tài liệu |
| Deploy chộp trúng file đang viết dở | Thấp | Không tạo file khi `deploy.sh` đang chạy (quy tắc sẵn có của dự án) |

**Giả định:** backend giữ nguyên `AuthResponse.token` + `refreshToken`; `POST /api/v1/auth/refresh` tiếp tục hoạt động.

---

## 8. Kế hoạch kiểm thử

- **Phase 1 (xong):** `npm run smoke` — khởi động app đã build, đo cách ly renderer, bề mặt cầu nối, IPC, và **xác thực payload có thật sự chặn** (javascript: URL, file:// URL, khoá lạ, zoom ngoài khoảng, kênh sự kiện lạ).
- Phase 3: unit test cho sync queue — retry, chống trùng, xử lý xung đột, hết quota.
- Phase 4: khôi phục phiên, chuyển online↔offline, Pro gating.
- Phase 6: e2e 7 bước theo mục 12 của đề bài, và **kiểm không có báo thành công giả**.

`CT_RENDERER=bundle` là bắt buộc khi kiểm bản đóng gói từ mã nguồn — không có nó, `app.isPackaged` là false và bài kiểm sẽ đo đường dev trong khi báo cáo là đã kiểm bản phát hành.

---

## 9. Kế hoạch đóng gói

- `CuongThai.dmg` — macOS arm64 và x64 **riêng** (universal gấp đôi dung lượng)
- `CuongThai.exe` — NSIS
- `CuongThai.AppImage` + `.deb`
- Cập nhật: `electron-updater` → **GitHub Releases**
- Trang `/download` trên web, tự nhận diện HĐH (chưa tồn tại — Phase 6)
- Ký số: dựng sẵn đường, chưa cắm chứng chỉ

---

## 10. Lệnh

```bash
cd desktop
npm install
npm run dev        # Vite + Electron, có HMR
npm run typecheck  # tsc cho cả renderer và main
npm run build      # build renderer + main
npm run smoke      # build rồi chạy app thật, kiểm 14 điểm
```
