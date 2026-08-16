/**
 * Hợp đồng IPC dùng chung giữa main / preload / renderer.
 *
 * ĐÂY LÀ DANH SÁCH TRẮNG DUY NHẤT. Renderer không có Node, không có `fs`,
 * không có `require` — nó chỉ gọi được đúng những kênh liệt kê ở đây, và mọi
 * payload đều bị `main` kiểm lại bằng zod trước khi chạm vào bất cứ thứ gì
 * của hệ điều hành. Thêm kênh mới thì phải thêm cả schema, nếu không
 * `registerHandlers()` sẽ từ chối đăng ký (xem main/ipc/index.ts).
 *
 * Quy ước tên kênh: `<miền>:<hành động>`. Miền trùng với file handler.
 */
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Schema payload — main kiểm MỌI thứ đi vào bằng những cái này
// ─────────────────────────────────────────────────────────────

/**
 * URL ngoài chỉ được mở bằng trình duyệt hệ thống khi thoả CẢ HAI:
 * đúng scheme http/https, và không phải `javascript:`/`file:`/`data:`.
 * Kiểm ở đây (kiểu) và kiểm lại lần nữa trong handler (thực thi) — vì đây
 * là đường duy nhất renderer chạm được `shell.openExternal`, mà hàm đó với
 * scheme lạ có thể chạy lệnh trên máy người dùng.
 */
export const externalUrlSchema = z
  .string()
  .max(2048)
  .refine((raw) => {
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return false;
    }
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  }, 'Chỉ mở được http/https');

export const themeSchema = z.enum(['light', 'dark', 'system']);
export type ThemeSetting = z.infer<typeof themeSchema>;

/** Khoá cấu hình renderer được phép đọc/ghi. Danh sách đóng, không tự do. */
export const settingKeySchema = z.enum([
  'theme',
  'sidebarCollapsed',
  'robotPanelOpen',
  'robotEnabled',
  'reducedMotion',
  'zoomLevel',
  'lastRoute',
  /** Đường dẫn thư mục lưu ghi chú. Do NGƯỜI DÙNG chọn qua hộp thoại hệ thống. */
  'notesFolder',
]);
export type SettingKey = z.infer<typeof settingKeySchema>;

export const settingValueSchema = z.union([
  z.string().max(512),
  z.number().finite(),
  z.boolean(),
]);
export type SettingValue = z.infer<typeof settingValueSchema>;

export const setSettingSchema = z.object({
  key: settingKeySchema,
  value: settingValueSchema,
});

/**
 * Token phiên được ghi nhớ giữa các lần mở app.
 *
 * ⚠️ Đây là ACCESS TOKEN, KHÔNG phải refresh token — và đó không phải nhầm lẫn.
 *
 * Backend có trả về trường `refreshToken` trong `AuthResponse`, nhưng nó là
 * token CHẾT: được ký bằng `jwtRefreshSecret`, mà biến đó chỉ xuất hiện đúng
 * hai chỗ trong toàn bộ mã backend — khai báo config và dòng ký. Không endpoint
 * nào verify nó. Cất nó rồi gửi lên `/auth/refresh` sẽ nhận `401 INVALID_TOKEN`
 * mãi mãi (đã đối chiếu mã ngày 16/08/2026).
 *
 * Thứ `POST /api/v1/auth/refresh` thật sự nhận là access token trong header
 * `Authorization: Bearer`, verify bằng `jwtSecret` với `ignoreExpiration: true`
 * — nên token hết hạn vẫn đổi được token mới.
 *
 * Hệ quả bảo mật phải biết: access token đã lưu là giấy thông hành gần như
 * vĩnh viễn. Nó đổi được token mới bất kể đã hết hạn bao lâu, chừng nào tài
 * khoản còn `enabled`. Vì vậy nó BẮT BUỘC được `safeStorage` mã hoá, không bao
 * giờ nằm trong localStorage. Xem docs/security.md.
 */
export const storeSessionSchema = z.object({
  userId: z.number().int().positive(),
  sessionToken: z.string().min(1).max(4096),
});


/**
 * ─────────────────────────────────────────────────────────────
 * Kho ghi chú trên đĩa
 * ─────────────────────────────────────────────────────────────
 *
 * Đây là bề mặt DUY NHẤT mà renderer chạm được tới đĩa, và nó cố ý rất hẹp.
 *
 * Ba ràng buộc, mỗi cái chống một kiểu hỏng:
 *
 *  1. KHÔNG có "mở thư mục bất kỳ". Renderer không truyền được đường dẫn tuyệt
 *     đối. Nó chỉ nói tên file TƯƠNG ĐỐI, còn thư mục gốc do main giữ và chỉ
 *     đổi được khi NGƯỜI DÙNG tự chọn qua hộp thoại hệ thống (`notes:chooseFolder`).
 *     Nếu renderer đặt được đường dẫn thì một lỗi XSS đọc được cả ổ đĩa.
 *
 *  2. Tên file bị chặn `..`, `/`, `\` và ký tự điều khiển ngay ở tầng schema.
 *     Main còn resolve rồi đối chiếu lại lần nữa — hai lớp độc lập.
 *
 *  3. Chỉ `.md`. Ghi được đuôi tuỳ ý nghĩa là ghi được `.command`, `.sh`,
 *     `.desktop` — file thực thi mà hệ điều hành có thể chạy.
 */
export const noteFileNameSchema = z
  .string()
  .min(1)
  .max(200)
  .refine((name) => !name.includes('..'), 'Tên file không được chứa ".."')
  .refine((name) => !/[/\\]/.test(name), 'Tên file không được chứa dấu phân cách thư mục')
  // eslint-disable-next-line no-control-regex
  .refine((name) => !/[\u0000-\u001f]/.test(name), 'Tên file chứa ký tự không hợp lệ')
  .refine((name) => name.toLowerCase().endsWith('.md'), 'Chỉ ghi được file .md');

export const writeNoteFileSchema = z.object({
  fileName: noteFileNameSchema,
  content: z.string().max(5_000_000),
});

export const noteFileSchema = z.object({ fileName: noteFileNameSchema });

export interface NotesFolder {
  /** `null` = người dùng chưa chọn thư mục nào. */
  path: string | null;
  /** Số file .md đang có. */
  fileCount: number;
}

export interface NoteFileInfo {
  fileName: string;
  size: number;
  modifiedAt: number;
}


/**
 * ─────────────────────────────────────────────────────────────
 * Nhạc tải về nghe ngoại tuyến
 * ─────────────────────────────────────────────────────────────
 *
 * Khác kho ghi chú ở một điểm quan trọng: người dùng KHÔNG chọn thư mục. Nhạc
 * tải về là bộ nhớ đệm của ứng dụng, không phải tài liệu của họ — nó nằm trong
 * `userData`, xoá app là mất theo, và không ai đi tìm nó bằng Finder.
 *
 * Tên file do MAIN đặt từ `trackId` (một số), nên ở đây không có ô nào cho
 * renderer truyền chuỗi đường dẫn. Không có chuỗi thì không có path traversal.
 */
export const trackIdSchema = z.number().int().positive();

export const saveAudioSchema = z.object({
  trackId: trackIdSchema,
  /**
   * Dữ liệu âm thanh. Trần 120MB — một bài hát vài phút nặng 3–10MB, nên con số
   * này rộng rãi cho cả bản không nén, đồng thời chặn được việc một renderer bị
   * chiếm cố ghi đầy đĩa người dùng.
   */
  bytes: z.instanceof(Uint8Array).refine((b) => b.byteLength <= 120 * 1024 * 1024, 'File quá lớn'),
  /** Đuôi file, dùng để đoán kiểu MIME lúc phát. Danh sách đóng. */
  ext: z.enum(['mp3', 'm4a', 'webm', 'ogg', 'wav', 'flac']),
});

export interface DownloadedTrack {
  trackId: number;
  ext: string;
  size: number;
  downloadedAt: number;
}

export interface MusicUsage {
  count: number;
  totalBytes: number;
}

export const zoomSchema = z.number().min(0.5).max(2.5);

// ─────────────────────────────────────────────────────────────
// Kênh
// ─────────────────────────────────────────────────────────────

/**
 * `invoke` — renderer hỏi, main trả lời. Mỗi kênh khai báo schema đầu vào
 * (`null` = không nhận tham số) để main tự dựng lớp kiểm tra.
 */
export const INVOKE_CHANNELS = {
  'app:getInfo': null,
  'app:openExternal': externalUrlSchema,
  'app:reload': null,
  'app:setZoom': zoomSchema,

  'settings:getAll': null,
  'settings:set': setSettingSchema,

  'auth:storeSession': storeSessionSchema,
  'auth:loadSession': null,
  'auth:clearSession': null,

  'update:check': null,
  'update:install': null,

  'storage:usage': null,
  'storage:clearCache': null,

  'notes:getFolder': null,
  'notes:chooseFolder': null,
  'notes:listFiles': null,
  'notes:readFile': noteFileSchema,
  'notes:writeFile': writeNoteFileSchema,
  'notes:deleteFile': noteFileSchema,
  'notes:revealFolder': null,

  'music:listDownloaded': null,
  'music:saveAudio': saveAudioSchema,
  'music:deleteAudio': z.object({ trackId: trackIdSchema }),
  'music:usage': null,
  'music:clearAll': null,
} as const;

export type InvokeChannel = keyof typeof INVOKE_CHANNELS;

/** `on` — main tự đẩy về renderer. Renderer chỉ nghe được đúng các kênh này. */
export const EVENT_CHANNELS = [
  'app:networkChanged',
  'app:navigate',
  'update:status',
] as const;

export type EventChannel = (typeof EVENT_CHANNELS)[number];

// ─────────────────────────────────────────────────────────────
// Kiểu trả về
// ─────────────────────────────────────────────────────────────

export interface AppInfo {
  version: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  platform: NodeJS.Platform;
  arch: string;
  /** Gốc web dùng cho mọi lời gọi API — main quyết, renderer không tự đặt. */
  webOrigin: string;
  /** Gốc API THẬT. Dùng để hiển thị (màn Giới thiệu), không dùng để gọi. */
  apiOrigin: string;
  /**
   * Tiền tố dùng để GỌI API. Khác `apiOrigin` ở chế độ dev.
   *
   * • bundle → bằng `apiOrigin` (gọi thẳng https://api.cuongthai.com; origin
   *   `app://cuongthai` đã nằm trong CORS_ORIGINS của backend).
   * • dev    → chuỗi RỖNG, tức là đường dẫn tương đối. Renderer dev chạy ở
   *   `http://localhost:5273`, origin đó KHÔNG có trong allowlist nên gọi thẳng
   *   sẽ bị CORS chặn. Đường dẫn tương đối đi qua proxy của Vite (xem
   *   vite.config.ts) — cùng origin, không CORS.
   *
   * Tách hai trường thay vì đổi `apiOrigin` theo chế độ, để màn Giới thiệu vẫn
   * hiện được máy chủ thật đang dùng thay vì một chuỗi rỗng khó hiểu.
   */
  apiBase: string;
  isDev: boolean;
}

export interface StoredSession {
  userId: number;
  /** ACCESS token — xem `storeSessionSchema` ở trên để biết vì sao không phải refresh token. */
  sessionToken: string;
}

export interface StorageUsage {
  /** byte, do Chromium báo. */
  quota: number;
  usage: number;
}

export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; version: string }
  | { state: 'downloading'; percent: number }
  | { state: 'ready'; version: string }
  | { state: 'none' }
  | { state: 'error'; message: string };

/**
 * Bề mặt API mà preload gắn lên `window.cuongthai`. Renderer chỉ thấy đúng
 * chừng này — không hơn.
 */
export interface DesktopBridge {
  app: {
    getInfo(): Promise<AppInfo>;
    openExternal(url: string): Promise<void>;
    reload(): Promise<void>;
    setZoom(level: number): Promise<void>;
  };
  settings: {
    getAll(): Promise<Partial<Record<SettingKey, SettingValue>>>;
    set(key: SettingKey, value: SettingValue): Promise<void>;
  };
  auth: {
    storeSession(session: StoredSession): Promise<void>;
    loadSession(): Promise<StoredSession | null>;
    clearSession(): Promise<void>;
  };
  update: {
    check(): Promise<void>;
    install(): Promise<void>;
  };
  storage: {
    usage(): Promise<StorageUsage>;
    clearCache(): Promise<void>;
  };
  /** Kho ghi chú trên đĩa. Xem `noteFileNameSchema` để biết giới hạn. */
  notes: {
    getFolder(): Promise<NotesFolder>;
    /** Mở hộp thoại hệ thống. Trả về thư mục đã chọn, hoặc `null` nếu huỷ. */
    chooseFolder(): Promise<NotesFolder>;
    listFiles(): Promise<NoteFileInfo[]>;
    readFile(fileName: string): Promise<string | null>;
    writeFile(fileName: string, content: string): Promise<void>;
    deleteFile(fileName: string): Promise<void>;
    revealFolder(): Promise<void>;
  };
  /**
   * Nhạc tải về. Phát lại qua `app://cuongthai/media/<trackId>` — dùng protocol
   * thay vì đọc file thành Blob để thẻ <audio> tua được bằng Range request gốc;
   * Blob URL bắt trình duyệt nạp TOÀN BỘ bài vào RAM trước khi phát nốt đầu.
   */
  music: {
    listDownloaded(): Promise<DownloadedTrack[]>;
    saveAudio(trackId: number, bytes: Uint8Array, ext: string): Promise<void>;
    deleteAudio(trackId: number): Promise<void>;
    usage(): Promise<MusicUsage>;
    clearAll(): Promise<void>;
  };
  /** Trả về hàm huỷ đăng ký. Renderer PHẢI gọi nó khi unmount. */
  on(channel: EventChannel, listener: (payload: unknown) => void): () => void;
}
