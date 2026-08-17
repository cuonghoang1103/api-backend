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
  /** 'full' | 'icons' | 'hidden' — xem components/Sidebar.tsx */
  'sidebarMode',
  'robotPanelOpen',
  'robotEnabled',
  'reducedMotion',
  'zoomLevel',
  'lastRoute',
  /** Đường dẫn thư mục lưu ghi chú. Do NGƯỜI DÙNG chọn qua hộp thoại hệ thống. */
  'notesFolder',
  /**
   * Thư mục dự án mà agent được phép ĐỌC.
   *
   * ⛔ CHỈ main ghi được — xem `KHOA_CHI_MAIN` trong `main/ipc/settings.ts`.
   * Đổi khoá này là đổi phạm vi đọc của một mô hình ngôn ngữ, nên nó phải là
   * một hành động người dùng NHÌN THẤY (hộp thoại của hệ điều hành), không
   * phải một dòng lệnh renderer gọi được.
   */
  'agentWorkspace',
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
// Agent lập trình (chỉ tài khoản Pro)
// ─────────────────────────────────────────────────────────────

/**
 * Câu hỏi người dùng gõ. Trần 8.000 ký tự — dài hơn thế thì họ đang dán cả file
 * vào khung chat, mà việc đó đã có tool `read_file` làm tốt hơn và rẻ hơn.
 */
export const agentSendSchema = z.object({
  text: z.string().trim().min(1, 'Chưa nhập gì').max(8000),
});

/** Thư mục dự án agent đang được phép đọc. `null` = chưa chọn. */
export interface AgentWorkspace {
  path: string | null;
  /** Chỉ tên thư mục, để hiện lên giao diện mà không phơi cả đường dẫn. */
  name: string | null;
  /** Nhánh git hiện tại, `null` nếu không phải kho git. */
  branch: string | null;
  /**
   * Đã bật cho agent CHẠY LỆNH chưa. Cũng không lưu xuống đĩa.
   *
   * ⚠️ Bật cái này thì danh sách chặn file của `jail.ts` tụt xuống hàng KHUYẾN
   * CÁO: `cat .env` là một lệnh shell, và shell không biết gì về nhà tù đó.
   * Không vá kín được mà vẫn giữ shell — thứ làm được là không bao giờ TỰ
   * duyệt một lệnh dính tới file nhạy cảm, và cảnh báo to trên thẻ.
   */
  choChayLenh: boolean;
  /**
   * Đã bật cho agent SỬA file chưa.
   *
   * KHÔNG lưu xuống đĩa: mỗi lần mở app lại là tắt. Đây là quyền ghi vào mã
   * nguồn của người dùng do một mô hình ngôn ngữ điều khiển — một quyền như thế
   * mà tự bật lại sau mỗi lần khởi động, âm thầm, thì người dùng sẽ quên mất là
   * nó đang bật. Bật lại chỉ tốn một cú bấm.
   */
  choSua: boolean;
}

/** Một dòng trong bảng diff hiện cho người dùng duyệt. */
export interface AgentDiffLine {
  loai: 'giu' | 'them' | 'bo';
  soCu: number | null;
  soMoi: number | null;
  text: string;
}

export interface AgentDiff {
  dong: AgentDiffLine[];
  soThem: number;
  soBo: number;
  quaLon: boolean;
}

/** Người dùng bấm gì trên thẻ duyệt. */
export const agentQuyetDinhSchema = z.enum(['choPhep', 'choPhepCaFile', 'tuChoi']);
export type AgentQuyetDinh = z.infer<typeof agentQuyetDinhSchema>;

export const agentTraLoiSchema = z.object({
  id: z.string().min(1).max(64),
  quyetDinh: agentQuyetDinhSchema,
});

export const agentCheDoSuaSchema = z.object({ bat: z.boolean() });
export const agentCheDoLenhSchema = z.object({ bat: z.boolean() });
export const agentPhienSchema = z.object({ id: z.string().min(1).max(64) });

/** Một việc đã lưu. Nhãn duy nhất người dùng nhận ra nó là `tieuDe`. */
export interface AgentPhien {
  id: string;
  tieuDe: string;
  /** Tên thư mục dự án lúc làm việc đó. */
  duAn: string | null;
  luucLuc: number;
  soTinNhan: number;
}

/**
 * Bảng ghi dựng lại từ một phiên cũ.
 *
 * CỐ Ý đơn giản hơn bảng ghi lúc chạy: không có thẻ duyệt kèm diff. Diff không
 * nằm trong bản lưu, và dựng lại nó nghĩa là đọc file HÔM NAY — cho ra một cái
 * diff không phải cái người dùng đã duyệt hôm qua. Một dòng công cụ nói đúng
 * sự thật thì tốt hơn một cái thẻ nói sai.
 */
export type AgentMucKhoiPhuc =
  | { kieu: 'nguoi'; text: string }
  | { kieu: 'may'; text: string }
  | { kieu: 'tool'; ten: string; tomTat: string };

/** Phân loại mức nguy hiểm của một lệnh — hiện thẳng trên thẻ duyệt. */
export interface AgentPhanLoaiLenh {
  muc: 'thuong' | 'cankiem' | 'nguyhiem';
  lyDo: string[];
  /** Có được phép nhớ để lần sau tự chạy không. Lệnh nguy hiểm ⇒ false. */
  choNho: boolean;
}

export interface AgentQuota {
  daDung: number;
  tran: number;
  phanTram: number;
  hoiLucNao: string | null;
}

/** Thông tin agent lúc mở màn hình: có Pro không, trần bao nhiêu, còn bao nhiêu. */
export interface AgentInfo {
  pro: boolean;
  configured: boolean;
  model: string | null;
  quota: AgentQuota | null;
  /** Ước lượng còn chạy được bao nhiêu VIỆC — con số người dùng hiểu được, khác "còn 3,4 triệu token". */
  soViecConLai: number | null;
}

/**
 * Sự kiện agent đẩy từ main lên renderer trong lúc chạy.
 *
 * Kiểu này dùng chung hai phía. Renderer KHÔNG được tự định nghĩa lại — hai
 * bản sao của một hợp đồng thì sẽ có ngày lệch nhau, và lệch ở đây nghĩa là
 * giao diện im lặng bỏ qua một loại sự kiện mà không ai biết.
 */
export type AgentUiEvent =
  | { loai: 'batDau'; model: string }
  | { loai: 'chu'; delta: string }
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  /** Agent ĐANG DỪNG chờ duyệt. Giao diện hiện thẻ diff và bắt buộc phải trả lời. */
  | { loai: 'xinPhep'; id: string; ten: string; duongDan: string; taoMoi: boolean; diff: AgentDiff }
  /** Thẻ đã được trả lời (hoặc hết giờ 5 phút) — gỡ thẻ đi. */
  | { loai: 'xongXinPhep'; id: string; dongY: boolean }
  /** Xin phép CHẠY LỆNH — payload khác thẻ sửa file: có chuỗi lệnh + phân loại. */
  | { loai: 'xinPhepLenh'; id: string; lenh: string; phanLoai: AgentPhanLoaiLenh }
  /** Đầu ra của lệnh, chảy ra khi nó còn đang chạy. */
  | { loai: 'lenhRa'; mau: string }
  | { loai: 'xong'; hanMuc: AgentQuota | null; tienUsd: number; daLuoc: number; soFileDaSua: number }
  | { loai: 'loi'; thongDiep: string; ma?: string }
  | { loai: 'huy' };

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
  'update:getStatus': null,
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

  'agent:getInfo': null,
  'agent:getWorkspace': null,
  'agent:chooseWorkspace': null,
  'agent:clearWorkspace': null,
  'agent:send': agentSendSchema,
  'agent:cancel': null,
  'agent:reset': null,
  'agent:traLoiXinPhep': agentTraLoiSchema,
  'agent:datCheDoSua': agentCheDoSuaSchema,
  'agent:datCheDoLenh': agentCheDoLenhSchema,
  'agent:hoanTac': null,
  'agent:dsPhien': null,
  'agent:moPhien': agentPhienSchema,
  'agent:xoaPhien': agentPhienSchema,
} as const;

export type InvokeChannel = keyof typeof INVOKE_CHANNELS;

/** `on` — main tự đẩy về renderer. Renderer chỉ nghe được đúng các kênh này. */
export const EVENT_CHANNELS = [
  'app:networkChanged',
  'app:navigate',
  'update:status',
  /** Tiến trình agent. Nhiều sự kiện mỗi giây trong lúc chữ đang chảy. */
  'agent:event',
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
    /**
     * Trạng thái cập nhật biết lần cuối.
     *
     * Cần vì main tự kiểm theo lịch: nếu renderer chỉ nghe sự kiện `update:status`,
     * nó sẽ BỎ LỠ mọi lần kiểm xảy ra trước khi nó gắn listener — và người dùng
     * mở app lên thấy "Chưa kiểm tra" dù bản mới đã tải xong từ lâu.
     */
    getStatus(): Promise<UpdateStatus>;
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
  /**
   * Agent lập trình — CHỈ tài khoản Pro (máy chủ chặn, không phải app).
   *
   * `send()` là hàm chạy LÂU: nó không trả về cho tới khi agent trả lời xong,
   * có thể vài phút. Tiến trình đi qua sự kiện `agent:event`, không qua giá trị
   * trả về. Renderer phải gắn listener TRƯỚC khi gọi `send()`.
   */
  agent: {
    getInfo(): Promise<AgentInfo>;
    getWorkspace(): Promise<AgentWorkspace>;
    /** Mở hộp thoại hệ thống. Trả về thư mục đã chọn, hoặc giữ nguyên nếu người dùng huỷ. */
    chooseWorkspace(): Promise<AgentWorkspace>;
    clearWorkspace(): Promise<AgentWorkspace>;
    send(text: string): Promise<void>;
    cancel(): Promise<void>;
    /** Xoá hội thoại, bắt đầu việc mới. Hạn mức KHÔNG được reset theo. */
    reset(): Promise<void>;
    /**
     * Trả lời thẻ duyệt. PHẢI gọi — vòng lặp đang đứng chờ đúng lời hứa này,
     * và nó chỉ tự thoát sau 5 phút hết giờ (coi như từ chối).
     */
    traLoiXinPhep(id: string, quyetDinh: AgentQuyetDinh): Promise<void>;
    /** Bật/tắt quyền sửa file. Không lưu xuống đĩa — mở app lại là tắt. */
    datCheDoSua(bat: boolean): Promise<AgentWorkspace>;
    /** Bật/tắt quyền chạy lệnh. Cũng không lưu xuống đĩa. */
    datCheDoLenh(bat: boolean): Promise<AgentWorkspace>;
    /** Trả mọi file agent đã sửa trong việc này về nguyên trạng. */
    hoanTac(): Promise<{ soFile: number; loi: string[] }>;
    /** Các việc đã lưu, mới nhất trước. */
    dsPhien(): Promise<AgentPhien[]>;
    /** Mở lại một việc cũ — gõ tiếp là agent đi tiếp từ đúng chỗ đó. */
    moPhien(id: string): Promise<{ muc: AgentMucKhoiPhuc[] } | null>;
    xoaPhien(id: string): Promise<void>;
  };
  /** Trả về hàm huỷ đăng ký. Renderer PHẢI gọi nó khi unmount. */
  on(channel: EventChannel, listener: (payload: unknown) => void): () => void;
}
