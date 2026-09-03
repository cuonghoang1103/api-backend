/**
 * Lớp bảo vệ của main process.
 *
 * Nguyên tắc: renderer là vùng KHÔNG tin tưởng. Nó hiển thị nội dung do máy
 * chủ trả về, và nội dung đó có thể bị chèn. Mọi thứ ở đây được viết với giả
 * định "một ngày nào đó renderer bị chiếm" — mục tiêu là kể cả khi đó, kẻ tấn
 * công vẫn không đọc được file trên máy, không mở được tiến trình, không đổi
 * được đích đến của token.
 */
import { app, session, shell, protocol, net } from 'electron';
import type { BrowserWindow } from 'electron';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import {
  ALLOWED_CONNECT_ORIGINS,
  ALLOWED_NAVIGATION_ORIGINS,
  APP_HOST,
  APP_ORIGIN,
  APP_SCHEME,
  DEV_SERVER_URL,
  IS_DEV,
  MEDIA_ORIGIN,
} from './config';

/**
 * Phải gọi TRƯỚC `app.whenReady()`. Chromium chốt danh sách scheme đặc quyền
 * lúc khởi tạo; đăng ký muộn thì `app://` sẽ là scheme "hạng hai" — origin
 * opaque, không có storage, service worker không chạy — và triệu chứng là
 * localStorage/IndexedDB im lặng trả về rỗng chứ không báo lỗi.
 */
export function registerSchemesAsPrivileged(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: APP_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
      },
    },
  ]);
}

/**
 * Phục vụ bundle renderer qua `app://cuongthai/...`.
 *
 * `rendererRoot` là thư mục build đã sinh sẵn. Mọi đường dẫn yêu cầu được
 * resolve rồi ĐỐI CHIẾU lại với gốc: không có bước này thì
 * `app://cuongthai/../../../../etc/passwd` đọc được file ngoài bundle — đây là
 * lỗi kinh điển của custom protocol, và nó im lặng cho tới lúc bị khai thác.
 */
export function registerAppProtocol(rendererRoot: string): void {
  protocol.handle(APP_SCHEME, async (request) => {
    const url = new URL(request.url);

    if (url.host !== APP_HOST) {
      return new Response('Not found', { status: 404 });
    }

    const rawPath = decodeURIComponent(url.pathname);

    /**
     * `app://cuongthai/media/<trackId>` → file nhạc đã tải trong `userData`.
     *
     * Phục vụ qua protocol thay vì đọc file thành Blob URL là có lý do: `net.fetch`
     * trên `file://` hỗ trợ Range request, nên thẻ <audio> TUA được và chỉ nạp
     * phần đang nghe. Blob URL bắt trình duyệt nạp TOÀN BỘ bài vào RAM trước khi
     * phát nốt đầu tiên — với một danh sách phát dài thì đó là vài trăm MB.
     *
     * `trackId` phải là số nguyên. Không phải số thì từ chối ngay, nên không có
     * chuỗi nào lọt vào `path.join` để dựng đường dẫn đi ra ngoài.
     */
    if (rawPath.startsWith('/media/')) {
      const trackId = Number(rawPath.slice('/media/'.length));
      if (!Number.isInteger(trackId) || trackId <= 0) {
        return new Response('Bad request', { status: 400 });
      }
      const { musicDir } = await import('./ipc/music');
      const dir = musicDir();
      const entries = await fs.readdir(dir).catch(() => [] as string[]);
      const match = entries.find((name) => name.startsWith(`${trackId}.`));
      if (!match) return new Response('Not found', { status: 404 });
      return net.fetch(pathToFileURL(path.join(dir, match)).toString());
    }

    // SPA: mọi đường dẫn không phải file tĩnh đều trả index.html để router
    // phía renderer tự xử lý.
    const hasExtension = path.extname(rawPath) !== '';
    const relative = hasExtension ? rawPath.replace(/^\/+/, '') : 'index.html';

    const resolved = path.resolve(rendererRoot, relative);
    const rootWithSep = rendererRoot.endsWith(path.sep)
      ? rendererRoot
      : rendererRoot + path.sep;

    if (resolved !== rendererRoot && !resolved.startsWith(rootWithSep)) {
      // Cố đi ra ngoài thư mục bundle.
      return new Response('Forbidden', { status: 403 });
    }

    return net.fetch(pathToFileURL(resolved).toString());
  });
}

function originOf(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).origin;
  } catch {
    return null;
  }
}

/**
 * Content-Security-Policy, gắn bằng header phản hồi thay vì thẻ `<meta>`.
 *
 * Dùng header vì thẻ meta chỉ có hiệu lực SAU khi trình duyệt đã phân tích tới
 * nó — script nằm trước thẻ đó vẫn chạy. Header thì áp dụng cho toàn bộ tài
 * liệu ngay từ byte đầu tiên.
 */
function contentSecurityPolicy(): string {
  const connect = [APP_ORIGIN, ...ALLOWED_CONNECT_ORIGINS].join(' ');

  const directives = [
    `default-src 'self' ${APP_ORIGIN}`,
    // Bản đóng gói: KHÔNG 'unsafe-eval', KHÔNG 'unsafe-inline'. Chỉ file script
    // rời, đúng như Vite build ra.
    //
    // Dev phải nới thêm 'unsafe-inline', và đây là lý do cụ thể: plugin React
    // của Vite chèn một đoạn script INLINE (preamble của Fast Refresh) vào
    // index.html. Thiếu 'unsafe-inline' thì Chromium chặn nó, React không bao
    // giờ khởi động, và app hiện MÀN ĐEN HOÀN TOÀN — không thông báo, không
    // lỗi nào trong terminal, chỉ một dòng CSP trong console của renderer:
    //   "@vitejs/plugin-react can't detect preamble"
    // Đã dính đúng lỗi này ngày 16/08/2026. Bản đóng gói KHÔNG bị, nên smoke
    // test (chạy ở chế độ bundle) vẫn xanh trong khi dev vỡ hoàn toàn — đó là
    // lý do phải có phép kiểm riêng cho đường dev, xem scripts/smoke-dev.mjs.
    //
    // ⚠️ `'wasm-unsafe-eval'` là để chạy HỘP CÁT PYTHON (Pyodide) trong chế độ
    // Trò chuyện. Nó KHÔNG phải `'unsafe-eval'`:
    //
    //   'unsafe-eval'       → mở lại `eval()` và `new Function()` cho JAVASCRIPT.
    //                         Một lỗ XSS bất kỳ lập tức thành chạy mã tuỳ ý.
    //   'wasm-unsafe-eval'  → CHỈ cho phép biên dịch WebAssembly. Không mở
    //                         `eval` JS, không mở `new Function`.
    //
    // Mã Python chạy trong hộp cát WASM: không có `fs`, không có `child_process`,
    // không với được `window.cuongthai`, và không ra mạng được (`connect-src`
    // vẫn chặn). Đây là hộp cát MẠNH HƠN so với chạy trên VPS — ở đó mã lạ nằm
    // cùng máy với Postgres chứa dữ liệu thật của người dùng.
    IS_DEV
      ? `script-src 'self' ${APP_ORIGIN} ${DEV_SERVER_URL} 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'`
      : `script-src 'self' ${APP_ORIGIN} 'wasm-unsafe-eval'`,
    // 'unsafe-inline' cho style là nhượng bộ có chủ ý: React/Tailwind chèn
    // style inline khi chạy animation. Nó KHÔNG cho phép chạy script.
    `style-src 'self' ${APP_ORIGIN} 'unsafe-inline'`,
    `img-src 'self' ${APP_ORIGIN} ${MEDIA_ORIGIN} https: data: blob:`,
    `font-src 'self' ${APP_ORIGIN} data:`,
    `media-src 'self' ${APP_ORIGIN} ${MEDIA_ORIGIN} https: blob:`,
    `connect-src ${connect}`,
    // Chặn nhúng: app không có iframe hợp lệ nào.
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'none'`,
    `frame-ancestors 'none'`,
  ];

  return directives.join('; ');
}

/**
 * Áp các chính sách cấp session. Gọi một lần sau khi app ready.
 */
export function applySessionPolicies(): void {
  const ses = session.defaultSession;

  ses.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [contentSecurityPolicy()],
        'X-Content-Type-Options': ['nosniff'],
      },
    });
  });

  // Từ chối MỌI quyền theo mặc định. Mở thêm thì thêm vào đây một cách có ý
  // thức — chứ không phải cho phép cả nắm rồi mới đi lọc.
  /**
   * Danh sách quyền được phép. Mở từng cái một cách có ý thức, không mở cả nắm.
   *
   * `media` cần cho nút nhấn-để-nói của Odin (`POST /api/v1/ai/stt`). Nó CHỈ
   * được cấp cho renderer của chính app — hàm dưới còn kiểm cả nguồn yêu cầu,
   * nên một trang bên ngoài (nếu sau này app nhúng nội dung) không xin được.
   *
   * Bản thân việc cấp quyền KHÔNG bật micro. Micro chỉ chạy khi người dùng giữ
   * nút, và `useOdin` dừng mọi track ngay khi thả tay — nếu không, đèn micro
   * của máy vẫn sáng sau khi thu xong và người dùng có mọi lý do để nghĩ app
   * đang nghe lén.
   */
  /*
   * ⚠️ `clipboard-sanitized-write` thêm 24/08/2026 — KHÔNG phải nới tay.
   *
   * Thiếu nó thì `navigator.clipboard.writeText()` ném
   * `NotAllowedError: Write permission denied` — kể cả khi có cử chỉ bấm thật.
   * Đo trong bản đóng gói: trước khi thêm HỎNG, sau khi thêm OK và chữ vào
   * đúng clipboard của hệ điều hành (đọc lại bằng `clipboard.readText()` ở
   * tiến trình main).
   *
   * Cả kho có 40 lời gọi `writeText` — nút Chép dưới tin nhắn, chép khối mã,
   * chép liên kết… TẤT CẢ đều im lặng không làm gì, vì chỗ nào cũng
   * `.catch()` bỏ qua. Người dùng bấm, không có phản hồi, và không có lỗi nào
   * để lần ra.
   *
   * ⛔ CỐ Ý chỉ mở `-sanitized-write`, KHÔNG mở `clipboard-read`: ghi là app
   * đưa dữ liệu RA, đọc là app lấy dữ liệu người dùng đã chép ở nơi khác —
   * mật khẩu, số thẻ. Không tính năng nào cần đọc.
   */
  const ALLOWED_PERMISSIONS = new Set<string>(['media', 'clipboard-sanitized-write']);

  const isOwnRenderer = (url: string): boolean =>
    url.startsWith(APP_ORIGIN) || (IS_DEV && url.startsWith(DEV_SERVER_URL));

  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    const url = webContents?.getURL() ?? '';
    callback(ALLOWED_PERMISSIONS.has(permission) && isOwnRenderer(url));
  });

  ses.setPermissionCheckHandler((_webContents, permission, requestingOrigin) =>
    ALLOWED_PERMISSIONS.has(permission) && isOwnRenderer(requestingOrigin),
  );

  // Không tính năng nào của app dùng tiện ích mở rộng hay plugin.
  ses.setPreloads([]);
}

/**
 * Khoá điều hướng và mở cửa sổ cho một webContents cụ thể.
 *
 * Hai đường phải chặn riêng vì chúng khác nhau:
 *   • `will-navigate` — trang tự đổi URL (click thẻ <a>, location.href).
 *   • `setWindowOpenHandler` — `window.open`, `target="_blank"`.
 * Bịt một cái mà quên cái kia thì vẫn còn đường mở trang lạ NGAY TRONG app,
 * và trang đó chạy cùng session, cùng cookie, cùng preload.
 */
export function hardenWebContents(window: BrowserWindow): void {
  const { webContents } = window;

  webContents.on('will-navigate', (event, url) => {
    const origin = originOf(url);
    if (origin === null || !ALLOWED_NAVIGATION_ORIGINS.includes(origin)) {
      event.preventDefault();
      void openExternalSafely(url);
    }
  });

  webContents.setWindowOpenHandler(({ url }) => {
    void openExternalSafely(url);
    // Không bao giờ mở cửa sổ Electron mới: một cửa sổ mới thừa hưởng session
    // và preload của app, nên nó là app chứ không phải "chỉ một tab".
    return { action: 'deny' };
  });

  // `<webview>` là một renderer lồng, dễ trở thành lối vòng qua mọi thứ ở
  // trên. App không dùng tới nó.
  webContents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}

/**
 * Mở URL bằng trình duyệt hệ thống, sau khi kiểm scheme.
 *
 * `shell.openExternal` giao chuỗi cho hệ điều hành xử lý. Với scheme lạ, hệ
 * điều hành có thể khởi chạy một ứng dụng đã đăng ký scheme đó — trên Windows
 * đã từng có chuỗi kiểu `ms-msdt:` dẫn tới thực thi mã. Vì vậy chỉ http/https.
 */
export async function openExternalSafely(rawUrl: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
  await shell.openExternal(parsed.toString());
}

/**
 * Ghi lại khi một tiến trình con thoát bất thường.
 *
 * App CÓ sinh tiến trình con — `agent/lenh.ts` khi người dùng duyệt một lệnh,
 * và `agent/mcp.ts` cho mỗi server MCP. Cả hai đều chỉ chạy sau khi người dùng
 * bấm duyệt, và đều ở MAIN; renderer không có đường nào tự sinh tiến trình.
 * Chỗ này chỉ ghi log để còn điều tra, KHÔNG tự khởi động lại — một server MCP
 * chết đi chết lại mà cứ tự bật lên là một vòng lặp ngốn CPU im lặng.
 */
export function forbidChildProcesses(): void {
  app.on('child-process-gone', (_event, details) => {
    // Ghi lại để còn biết mà điều tra; không tự khởi động lại.
    console.error('[security] tiến trình con thoát bất thường:', details.type, details.reason);
  });
}
