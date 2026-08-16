/**
 * Hằng số toàn cục của main process.
 *
 * Gốc (origin) do MAIN quyết, không phải renderer. Renderer đọc lại qua
 * `app:getInfo`. Làm ngược lại — để renderer tự đặt base URL — nghĩa là một
 * đoạn mã bị chèn có thể trỏ toàn bộ lời gọi API sang máy chủ của kẻ tấn công
 * mà vẫn mang theo token của người dùng.
 */
import { app } from 'electron';

export const IS_DEV = !app.isPackaged;

/**
 * Renderer được nạp từ đâu: Vite dev server hay bundle `app://`.
 *
 * Mặc định suy ra từ `app.isPackaged`, nhưng CÓ THỂ ép bằng biến môi trường
 * `CT_RENDERER`. Cái đó không phải để tiện tay — nó là điều kiện cần để kiểm
 * thử trung thực: chạy `npx electron dist/main/index.cjs` thì `isPackaged` là
 * false, nên nếu không có công tắc này, mọi phép kiểm "bản đóng gói" thật ra
 * đang chạy đường dev và không chứng minh được gì về thứ sẽ giao cho người
 * dùng. Ép `CT_RENDERER=bundle` để đi ĐÚNG đường của bản phát hành: protocol
 * app://, không DevTools, không dev server.
 */
export const RENDERER_SOURCE: 'dev' | 'bundle' =
  process.env.CT_RENDERER === 'bundle'
    ? 'bundle'
    : process.env.CT_RENDERER === 'dev'
      ? 'dev'
      : app.isPackaged
        ? 'bundle'
        : 'dev';

/**
 * Scheme riêng của app. Đăng ký dạng "standard + secure" nên Chromium đối xử
 * với nó như https: có origin thật (`app://cuongthai`), chạy được service
 * worker, dùng được `fetch`, và tuân thủ CORS.
 *
 * Vì sao không dùng `file://`: `file://` có origin là `null`, nên MỌI lời gọi
 * chéo miền đều là "null origin" — backend không thể phân biệt app thật với
 * một trang bất kỳ, và không có cách nào thêm nó vào allowlist CORS cho đúng.
 * Với `app://cuongthai` thì backend chỉ cần thêm đúng một dòng vào
 * CORS_ORIGINS (xem docs/security.md).
 */
export const APP_SCHEME = 'app';
export const APP_HOST = 'cuongthai';
export const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;

/** Scheme deep-link, dùng cho vòng OAuth quay lại app. */
export const DEEP_LINK_SCHEME = 'cuongthai';

export const WEB_ORIGIN = 'https://cuongthai.com';
export const API_ORIGIN = process.env.CUONGTHAI_API_ORIGIN ?? 'https://api.cuongthai.com';
export const MEDIA_ORIGIN = 'https://media.cuongthai.com';

/** Vite dev server — chỉ dùng khi chạy `npm run dev`. */
export const DEV_SERVER_URL = 'http://localhost:5273';

/**
 * Những gốc mà app được phép ĐIỀU HƯỚNG tới. Bất cứ thứ gì ngoài danh sách này
 * bị chặn ở `will-navigate` và đẩy ra trình duyệt hệ thống.
 */
export const ALLOWED_NAVIGATION_ORIGINS: readonly string[] = IS_DEV
  ? [APP_ORIGIN, DEV_SERVER_URL, WEB_ORIGIN, 'https://www.cuongthai.com']
  : [APP_ORIGIN, WEB_ORIGIN, 'https://www.cuongthai.com'];

/**
 * Những gốc mà renderer được phép GỌI (connect-src trong CSP). Hẹp hơn nhiều
 * so với một trình duyệt: chỉ backend, media, và socket cho realtime.
 */
export const ALLOWED_CONNECT_ORIGINS: readonly string[] = [
  API_ORIGIN,
  MEDIA_ORIGIN,
  WEB_ORIGIN,
  API_ORIGIN.replace(/^https:/, 'wss:'),
  WEB_ORIGIN.replace(/^https:/, 'wss:'),
  ...(IS_DEV ? [DEV_SERVER_URL, DEV_SERVER_URL.replace(/^http:/, 'ws:')] : []),
];
