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
  /**
   * Cấp độ nỗ lực. KHÁC hai cờ quyền ở chỗ nó ĐƯỢC lưu xuống đĩa: đây là sở
   * thích ("tôi thích agent đào sâu"), không phải quyền truy cập. Quên mất mình
   * đang ở mức Kỹ thì cùng lắm tốn thêm token; quên mất agent đang được sửa
   * file thì mất mã.
   */
  'agentMucNoLuc',
  'agentModel',
  /**
   * Chế độ đang mở ở /chat: 'chat' (trò chuyện) hay 'code' (lập trình).
   *
   * Lưu vì cùng lý do với `agentMucNoLuc`: đây là SỞ THÍCH, không phải quyền.
   * Rời trang rồi quay lại mà bị đá về Trò chuyện thì người đang làm việc lập
   * trình phải bấm lại mỗi lần — và họ tưởng việc của mình mất, vì màn hình
   * hiện ra không phải màn hình họ để lại.
   */
  'chatCheDo',
  /**
   * Tab (cuộc) đang mở ở chế độ Lập trình.
   *
   * Không nhớ thì quay lại trang là nhảy về tab CUỐI, không phải tab người dùng
   * đang làm — và với người mở ba tab thì đó vẫn là "việc của tôi đâu rồi".
   */
  'agentTabMo',
  /**
   * Thanh phát nhạc đang THU GỌN?
   *
   * Lưu xuống đĩa vì đây là sở thích chỗ ngồi: người đã thu nó lại một lần
   * không muốn mở app lần sau lại thấy nó chiếm chỗ tiếp. Và nó CHỈ đổi phần
   * nhìn — nhạc vẫn phát bình thường lúc thu, xem `PlayerBar.tsx`.
   */
  'playerThuGon',
  /**
   * Trợ lý Odin — ngôn ngữ nói ('vi' | 'en') và giọng của TỪNG ngôn ngữ.
   *
   * Ba khoá chứ không phải một: đổi ngôn ngữ rồi đổi lại thì giọng cũ phải còn
   * nguyên. Gộp thành một khoá là mỗi lần chuyển tiếng lại phải chọn lại giọng.
   */
  'odinNgonNgu',
  /** Tốc độ đọc, 0,5–1,5. Áp cho mọi giọng ở cả dock lẫn cửa sổ robot nổi. */
  'odinTocDo',
  /**
   * Cho phép ngắt lời trợ lý bằng GIỌNG (mặc định bật).
   *
   * Tắt được vì loa ngoài mở to vẫn rò qua khử vọng âm, và khi rò thì máy
   * tự ngắt lời chính nó — khó dùng hơn hẳn việc không ngắt lời được.
   */
  'odinCatLoi',
  'odinGiongVi',
  'odinGiongEn',
  /** Odin có ĐỌC THÀNH TIẾNG câu trả lời không. Tắt được, vì có lúc cần yên. */
  'odinNoiThanhTieng',
  /**
   * Gập khối tiêu đề của trang Trợ lý AI để lấy chỗ cho hội thoại.
   *
   * Nhớ xuống đĩa: gập rồi mà mở app lại thấy nó bung ra là người dùng phải
   * gập lại mỗi ngày, và cái nút thành phiền hơn là tiện.
   */
  'aiGapDau',
  /** Thanh bên trái của trang AI: đang gập, và rộng bao nhiêu px. */
  'aiThanhBenGap',
  'aiThanhBenRong',
  /**
   * Thanh bên của chế độ TRÒ CHUYỆN — khoá RIÊNG, không dùng chung với
   * `aiThanhBen*` của chế độ Lập trình.
   *
   * Hai chế độ có nhu cầu bề rộng khác nhau (bên Lập trình tiêu đề dài hơn vì
   * gom theo dự án), và quan trọng hơn: gập thanh bên ở chế độ này rồi sang
   * chế độ kia thấy nó cũng gập theo là một thứ người dùng không hề yêu cầu.
   */
  'chatThanhBenGap',
  'chatThanhBenRong',
  /** Bề rộng khung trình duyệt cạnh bảng ghi (px). Kéo được như thanh bên. */
  'aiKhungWebRong',
  /**
   * Robot trong app: đang MỞ KHOÁ để kéo, và toạ độ người dùng đã đặt.
   *
   * Toạ độ lưu theo KHOẢNG CÁCH TỚI MÉP PHẢI/DƯỚI, không phải x/y tuyệt đối:
   * đổi cỡ cửa sổ thì robot phải giữ nguyên góc, chứ x/y tuyệt đối sẽ đẩy nó
   * ra ngoài màn hình ngay lần mở app sau ở cỡ cửa sổ khác.
   */
  'odinKeoDuoc',
  /**
   * Cỡ robot, 0–3 nấc. 0 = to nhất (mặc định hiện tại), 3 = nhỏ nhất.
   *
   * Một khoá dùng cho CẢ HAI con — trong app và cửa sổ nổi. Hai khoá riêng
   * thì người dùng chỉnh một con, con kia đứng nguyên, và họ phải nhớ mình
   * đang chỉnh cái nào.
   */
  'odinCo',
  'odinPhai',
  'odinDuoi',
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

/** Nội dung một mẫu AI, lấy từ repo gốc qua tiến trình chính. */
export interface NoiDungMau {
  /** Nguyên văn tệp, kể cả frontmatter. */
  text: string;
  /** Trang xem tệp trên GitHub. */
  url: string;
  /** Đã cắt bớt vì quá dài — giao diện phải nói ra, đừng giấu. */
  catBot: boolean;
}

export const zoomSchema = z.number().min(0.5).max(2.5);

/**
 * Lưu một file do hộp cát Python sinh ra.
 *
 * ⛔ Renderer KHÔNG truyền đường dẫn — nó chỉ đưa TÊN GỢI Ý và nội dung. Nơi
 * lưu do NGƯỜI DÙNG chọn qua hộp thoại của hệ điều hành, đúng nguyên tắc đã
 * dùng cho thư mục ghi chú và thư mục dự án của agent.
 *
 * Trần 40MB: đủ cho bảng tính, báo cáo, ảnh biểu đồ; và chặn một script lỡ tay
 * sinh ra file khổng lồ rồi đẩy cả qua IPC.
 */
export const luuFileSchema = z.object({
  ten: z.string().min(1).max(200)
    // eslint-disable-next-line no-control-regex
    .refine((t) => !/[/\\\u0000-\u001f]/.test(t), 'Tên file không được chứa dấu phân cách hay ký tự điều khiển')
    .refine((t) => !t.includes('..'), 'Tên file không được chứa ".."'),
  dulieu: z.instanceof(Uint8Array).refine((b) => b.byteLength <= 40 * 1024 * 1024, 'File quá lớn (trần 40MB)'),
});

// ─────────────────────────────────────────────────────────────
// Trình duyệt trong app
// ─────────────────────────────────────────────────────────────

/**
 * Vùng (theo toạ độ cửa sổ) mà trình duyệt được vẽ đè lên.
 *
 * Renderer đo ô giữ chỗ bằng `getBoundingClientRect()` rồi gửi lên. Đây KHÔNG
 * phải lỗ hổng: nó chỉ quyết định vẽ ở đâu, không quyết định mở cái gì.
 */
export const browserVungSchema = z.object({
  x: z.number().finite().min(-10_000).max(20_000),
  y: z.number().finite().min(-10_000).max(20_000),
  width: z.number().finite().min(0).max(20_000),
  height: z.number().finite().min(0).max(20_000),
});

/** Địa chỉ người dùng gõ. Main lọc lại scheme — chỉ http/https. */
export const browserUrlSchema = z.object({ url: z.string().min(1).max(2048) });

export const browserMoSchema = z.object({
  vung: browserVungSchema,
  url: z.string().max(2048).optional(),
});

export interface BrowserTrangThai {
  url: string;
  tieuDe: string;
  dangTai: boolean;
  luiDuoc: boolean;
  toiDuoc: boolean;
  loi: string | null;
}

// ─────────────────────────────────────────────────────────────
// Agent lập trình (chỉ tài khoản Pro)
// ─────────────────────────────────────────────────────────────

/**
 * Câu hỏi người dùng gõ. Trần 8.000 ký tự — dài hơn thế thì họ đang dán cả file
 * vào khung chat, mà việc đó đã có tool `read_file` làm tốt hơn và rẻ hơn.
 */
export const cuocIdSchema = z.string().min(1).max(64);

/**
 * Ảnh dán kèm câu hỏi — data URI base64.
 *
 * Trần 5,6 triệu ký tự ≈ 4MB ảnh, tối đa 3 tấm. Kiểm ở đây RỒI kiểm lại ở máy
 * chủ: đây là schema của app (một app bị sửa thì bỏ qua được), máy chủ mới là
 * chỗ phán cuối cùng.
 */
export const anhSchema = z
  .string()
  .max(5_600_000)
  .regex(/^data:image\/(png|jpeg|webp|gif);base64,/, 'Chỉ nhận ảnh png/jpeg/webp/gif');

export const agentSendSchema = z.object({
  /** Cuộc hội thoại (tab) nhận câu hỏi này. Mọi kênh có trạng thái đều phải mang nó. */
  cuocId: cuocIdSchema,
  text: z.string().trim().min(1, 'Chưa nhập gì').max(8000),
  anh: z.array(anhSchema).max(3).optional(),
});

export const agentCuocSchema = z.object({ cuocId: cuocIdSchema });

/**
 * Cấp độ nỗ lực — quyết định SỐ BƯỚC agent được đi và SỐ AGENT PHỤ nó được
 * giao việc (8/1 · 30/3 · 60/3 · 100/5 · 160/6 · 260/10).
 *
 * ⚠️ NỖ LỰC VÀ MODEL LÀ HAI THỨ RỜI NHAU, và phải ở hai nút riêng. Trực giác
 * muốn gộp ("mức thấp thì dùng model rẻ") nhưng đo thật cho kết quả ngược: con
 * rẻ nhất trong bảng (`gpt-5.6-terra`, 0,17/việc) là con DUY NHẤT vỡ giữa vòng
 * lặp gọi tool. Một thanh trượt mà đầu "tiết kiệm" lại là đầu hỏng thì nó
 * không phải thanh trượt, nó là cái bẫy.
 *
 * ⚠️ TÊN CŨ (`nhanh`/`canBang`/`ky`) máy chủ vẫn nhận — người dùng bản app cũ
 * không bị tụt mức. Nhưng app mới thì không gửi chúng nữa.
 */
export const mucNoLucSchema = z.enum(['thap', 'vua', 'cao', 'ratCao', 'toiDa', 'ultracode']);
export type MucNoLuc = z.infer<typeof mucNoLucSchema>;
export const agentMucNoLucSchema = z.object({ muc: mucNoLucSchema });

/**
 * Model agent dùng. App chỉ gửi MÃ NGẮN; tên model thật nằm ở danh sách trắng
 * của máy chủ (`src/services/agent/models.ts`) và app không được đặt tên model
 * tuỳ ý — nếu không thì ai sửa được gói tin cũng gọi được model đắt nhất cổng
 * bán, bằng tiền của chủ web.
 */
/**
 * Mã model AI Code.
 *
 * ⚠️ DANH SÁCH NÀY PHẢI PHỦ CẢ HAI CỔNG. Máy chủ chọn bảng theo cổng đang
 * cắm (`MODEL_AGENT` cho modelapi, `MODEL_AGENT_RIENG` cho cổng riêng), nên
 * app phải nhận được mọi mã của cả hai — thiếu một mã thì `zod` chặn ngay ở
 * cầu nối và người dùng thấy nút chọn model không có tác dụng, không có lỗi
 * nào để thấy. `agentModels.test.ts` đọc thẳng bảng bên máy chủ và đỏ nếu
 * hai bên lệch.
 */
export const modelAgentSchema = z.enum([
  // modelapi
  'sonnet-5', 'opus-4-8', 'gpt-sol',
  // cổng riêng (rambo)
  'haiku-4-5', 'sonnet-4-6', 'opus-4-6', 'opus-4-7',
]);
export type ModelAgent = z.infer<typeof modelAgentSchema>;
export const agentModelSchema = z.object({ model: modelAgentSchema });

/** Một việc trong kế hoạch agent công bố. */
export interface AgentViec {
  ten: string;
  trangThai: string;
}

/** Thư mục dự án agent đang được phép đọc. `null` = chưa chọn. */
export interface AgentWorkspace {
  path: string | null;
  /**
   * Đã bật cho agent GHI vào sổ ghi chú chưa.
   *
   * KHÔNG đi kèm `choSua`: đó là quyền trên FILE trong thư mục dự án, còn đây
   * là dữ liệu thật của người dùng trên máy chủ. Và nó KHÔNG bị thu hồi khi
   * đổi thư mục dự án, vì sổ ghi chú chẳng nằm trong thư mục nào.
   */
  choGhiNote?: boolean;
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
  /** Agent lái được trình duyệt trong app. */
  choTrinhDuyet: boolean;
  /** Cấp độ nỗ lực đang chọn. */
  mucNoLuc: MucNoLuc;
  /** Model đang chọn. Lưu xuống đĩa vì đây là SỞ THÍCH, không phải quyền. */
  model: ModelAgent;
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
  /**
   * Cuộc nào đang hỏi.
   *
   * ⚠️ BẮT BUỘC. Khung `xongXinPhep` phát ra từ đây cũng phải mang `cuocId` như
   * mọi khung khác — thiếu nó thì hook lọc bỏ, thẻ duyệt KHÔNG bao giờ biến
   * mất, và người dùng bấm mãi không thấy gì xảy ra (dù thay đổi ĐÃ được ghi).
   * Đã dính đúng lỗi này lúc thêm nhiều tab.
   */
  cuocId: cuocIdSchema,
  id: z.string().min(1).max(64),
  quyetDinh: agentQuyetDinhSchema,
});

// Quyền là của TỪNG cuộc, nên phải mang `cuocId`. Không mang thì bật quyền ghi
// ở tab đang làm dự án A cũng bật luôn cho tab đang làm dự án B — người dùng
// cấp một quyền và nhận về hai.
export const agentCheDoSuaSchema = z.object({ cuocId: cuocIdSchema, bat: z.boolean() });
export const agentCheDoLenhSchema = z.object({ cuocId: cuocIdSchema, bat: z.boolean() });
export const agentCheDoNoteSchema = z.object({ cuocId: cuocIdSchema, bat: z.boolean() });
export const agentCheDoTrinhDuyetSchema = z.object({ cuocId: cuocIdSchema, bat: z.boolean() });
export const agentPhienSchema = z.object({ id: z.string().min(1).max(64) });

/**
 * Quay lui về câu hỏi thứ `k` (1 = câu đầu tiên).
 *
 * Định vị bằng THỨ TỰ CÂU HỎI chứ không bằng chỉ số mảng: bản hiển thị và bản
 * giao thức không cùng độ dài, nên chỉ số không dịch được giữa hai bên. Thứ tự
 * câu hỏi thì luôn khớp.
 */
export const agentQuayLuiSchema = z.object({
  cuocId: cuocIdSchema,
  k: z.number().int().min(1).max(500),
});

/**
 * ⚠️ `duongDan` ở đây là NGOẠI LỆ DUY NHẤT cho quy tắc "renderer không truyền
 * đường dẫn" — và nó an toàn vì main KHÔNG tin chuỗi này: `xoaWorktree` /
 * `doiWorktree` đối chiếu nó với danh sách `git worktree list` của chính repo
 * đang mở, và từ chối mọi thứ không nằm trong đó. Renderer chỉ CHỌN LẠI một
 * đường dẫn main vừa đưa cho nó, không tự nghĩ ra đường dẫn mới.
 */
export const agentDoiWorktreeSchema = z.object({
  cuocId: cuocIdSchema,
  duongDan: z.string().min(1).max(1024),
});
export const agentTaoWorktreeSchema = z.object({
  cuocId: cuocIdSchema,
  ten: z.string().min(1).max(60),
});
export const agentMoPhienSchema = z.object({
  cuocId: cuocIdSchema,
  id: z.string().min(1).max(64),
});
/** Đổi tên một việc đã lưu. Tên rỗng = bỏ tên tự đặt, về lại tên AI đặt. */
export const agentDoiTenPhienSchema = z.object({
  id: z.string().min(1).max(64),
  ten: z.string().max(90),
});
export const agentCoPhienSchema = z.object({
  id: z.string().min(1).max(64),
  bat: z.boolean(),
});
/**
 * Nhân bản một việc. `denCauHoi` = chép tới TRƯỚC câu hỏi thứ mấy (1 = câu
 * đầu); vắng mặt = chép trọn việc.
 */
export const agentNhanBanPhienSchema = z.object({
  id: z.string().min(1).max(64),
  denCauHoi: z.number().int().min(1).max(999).optional(),
});
/**
 * Tách nhánh hội thoại ĐANG MỞ của một tab.
 *
 * Khác `agent:nhanBanPhien` ở nguồn: cái kia chép từ FILE đã lưu, cái này chép
 * từ hội thoại trong bộ nhớ main — nên nó có cả lượt vừa gõ mà chưa lưu.
 */
export const agentTachNhanhSchema = z.object({
  cuocId: cuocIdSchema,
  denCauHoi: z.number().int().min(1).max(999).optional(),
});

/** Một việc đã lưu. Nhãn duy nhất người dùng nhận ra nó là `tieuDe`. */
export interface AgentPhien {
  id: string;
  tieuDe: string;
  /** Tên thư mục dự án lúc làm việc đó. */
  duAn: string | null;
  luucLuc: number;
  soTinNhan: number;
  /** Ghim lên đầu danh sách. */
  ghim?: boolean;
  /** Đã cất khỏi danh sách thường. KHÔNG phải xoá — mở lại được bất cứ lúc nào. */
  luuTru?: boolean;
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

/**
 * Ngữ cảnh đã dùng tới đâu.
 *
 * Người dùng KHÔNG có cách nào tự biết con số này: họ nhìn thấy cả hội thoại
 * trên màn hình, nhưng không biết bao nhiêu phần trong đó còn thật sự tới được
 * model. Vòng tròn là chỗ duy nhất nói ra.
 */
export interface AgentNguCanh {
  kyTu: number;
  tran: number;
  phanTram: number;
  /** Số lượt CŨ đã bị bỏ tự động để lọt trần. >0 nghĩa là agent đã quên phần đó. */
  soLuotDaBo: number;
}

export interface AgentQuota {
  daDung: number;
  tran: number;
  phanTram: number;
  hoiLucNao: string | null;
}

/** Một worktree của repo đang mở. */
export interface AgentWorktree {
  duongDan: string;
  nhanh: string | null;
  /** Cây làm việc CHÍNH — cái người dùng tự mở. Không xoá được từ trong app. */
  laChinh: boolean;
  /** Do app tạo ⇒ mới cho xoá. Không suy từ tên nhánh: người dùng có thể tự đặt trùng. */
  cuaApp: boolean;
  /** Tab đang đứng ở worktree này. */
  dangDung: boolean;
}

/** Một cuộc đang mở trong main — nguồn sự thật cho thanh tab. */
export interface AgentCuocDangMo {
  id: string;
  tieuDe: string;
  dangChay: boolean;
}

/** Trạng thái các server MCP người dùng đã cắm. */
export interface AgentMcpTrangThai {
  /** Đường dẫn file cấu hình — hiện lên để người dùng biết sửa ở đâu. */
  duongDan: string;
  server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string }>;
  soTool: number;
  hanMuc: { daDung: number; tran: number };
}

/** Thông tin agent lúc mở màn hình: có Pro không, trần bao nhiêu, còn bao nhiêu. */
export interface AgentInfo {
  pro: boolean;
  configured: boolean;
  model: string | null;
  quota: AgentQuota | null;
  /** Ước lượng còn chạy được bao nhiêu VIỆC — con số người dùng hiểu được, khác "còn 3,4 triệu token". */
  soViecConLai: number | null;
  /**
   * Model agent dùng được, do MÁY CHỦ khai.
   *
   * `dungDuoc: false` = model có trong danh sách nhưng nhóm của nó chưa cắm
   * khoá trên máy chủ. Phải hiện ra chứ không được lọc đi: người dùng chọn nó,
   * nhận về lỗi, rồi không hiểu vì sao — còn tệ hơn thấy nó xám và biết lý do.
   */
  models?: Array<{ id: string; ten: string; mo: string; dungDuoc: boolean }>;
  /**
   * Bảng mức nỗ lực + SỐ BƯỚC, cũng do máy chủ khai.
   *
   * ⚠️ Chép cứng con số này vào app là mầm nói dối. Máy chủ deploy trước, app
   * người dùng cập nhật sau — nên một bản app còn ghi "60 bước" trong khi máy
   * chủ đã đổi thành 100 là chuyện bình thường, và không có lỗi nào để thấy.
   */
  mucNoLuc?: Array<{ id: MucNoLuc; ten: string; buoc: number; viecPhu: number }>;
}

/**
 * Sự kiện agent đẩy từ main lên renderer trong lúc chạy.
 *
 * Kiểu này dùng chung hai phía. Renderer KHÔNG được tự định nghĩa lại — hai
 * bản sao của một hợp đồng thì sẽ có ngày lệch nhau, và lệch ở đây nghĩa là
 * giao diện im lặng bỏ qua một loại sự kiện mà không ai biết.
 */
export type AgentUiEvent = { cuocId: string } & (
  | { loai: 'batDau'; model: string; buoc?: number; tranBuoc?: number }
  | { loai: 'chu'; delta: string }
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  /** Agent ĐANG DỪNG chờ duyệt. Giao diện hiện thẻ diff và bắt buộc phải trả lời. */
  | { loai: 'xinPhep'; id: string; ten: string; duongDan: string; taoMoi: boolean; diff: AgentDiff }
  /** Thẻ đã được trả lời (hoặc hết giờ 5 phút) — gỡ thẻ đi. */
  | { loai: 'xongXinPhep'; id: string; dongY: boolean }
  /** Xin phép CHẠY LỆNH — payload khác thẻ sửa file: có chuỗi lệnh + phân loại. */
  | { loai: 'xinPhepLenh'; id: string; lenh: string; phanLoai: AgentPhanLoaiLenh }
  /**
   * Xin phép gọi một tool MCP. Mang cả THAM SỐ — tên tool một mình không đủ để
   * quyết định: `mcp__db__query` nghe vô hại tới khi nhìn thấy câu lệnh nó chạy.
   */
  | { loai: 'xinPhepMcp'; id: string; server: string; tool: string; args: string }
  /**
   * Xin phép COMMIT hoặc MỞ PR.
   *
   * `chiTiet` mang đúng thứ người dùng phải đọc trước khi bấm — nhánh, danh
   * sách file, lời nhắn (commit) hoặc nhánh + tiêu đề + mô tả (PR). Một thẻ chỉ
   * ghi "agent muốn commit" thì không ai duyệt được gì cả.
   */
  | { loai: 'xinPhepGit'; id: string; viec: 'commit' | 'pr'; chiTiet: string }
  /** Xin phép GHI vào sổ ghi chú. `chiTiet` là nội dung sắp ghi — người dùng phải ĐỌC nó. */
  | { loai: 'xinPhepNote'; id: string; viec: 'tao' | 'ghi'; chiTiet: string }
  /** Đầu ra của lệnh, chảy ra khi nó còn đang chạy. */
  | { loai: 'lenhRa'; mau: string }
  /** Agent công bố/cập nhật danh sách việc. Luôn là TOÀN BỘ danh sách. */
  | { loai: 'keHoach'; viec: AgentViec[] }
  | {
      loai: 'xong'; hanMuc: AgentQuota | null; tienUsd: number; daLuoc: number; soFileDaSua: number;
      nguCanh?: AgentNguCanh;
    }
  | { loai: 'loi'; thongDiep: string; ma?: string }
  | { loai: 'huy' }
  /**
   * Hội thoại ở main vừa bị xoá sạch (đổi thư mục dự án, chuyển worktree, bỏ
   * thư mục). Giao diện PHẢI dọn bảng ghi — giữ lại là vẽ một cuộc trò chuyện
   * agent đã quên hoàn toàn.
   */
  | { loai: 'daXoa' }
);

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
  /** macOS: tải file cài `.dmg` đúng kiến trúc về thư mục Tải xuống. */
  'update:taiThuCong': null,
  /** macOS: tự tải .zip rồi TRÁO bó ứng dụng — cập nhật thật, không qua Squirrel. */
  'update:tuCapNhat': null,
  /** App đang chạy từ đâu; dùng để cảnh báo khi mở nhầm bản dựng thử. */
  'update:noiDangChay': null,
  /** Mở thư mục chứa file cài vừa tải (Finder/Explorer), không tự mở file. */
  'update:moThuMuc': null,

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

  /* Đường dẫn tệp trong repo mẫu gốc. Tiến trình chính còn kiểm lại lần nữa —
     xem `duongAnToan()` — nên schema này chỉ là hàng rào đầu tiên. */
  'mau:noiDung': z.object({ duong: z.string().min(1).max(300) }),

  'agent:getInfo': null,
  'agent:getWorkspace': agentCuocSchema,
  'agent:chooseWorkspace': agentCuocSchema,
  'agent:clearWorkspace': agentCuocSchema,
  'agent:send': agentSendSchema,
  'agent:cancel': agentCuocSchema,
  'agent:reset': agentCuocSchema,
  'agent:taoCuoc': null,
  'agent:dongCuoc': agentCuocSchema,
  'agent:traLoiXinPhep': agentTraLoiSchema,
  'agent:datCheDoSua': agentCheDoSuaSchema,
  'agent:datCheDoLenh': agentCheDoLenhSchema,
  'agent:datCheDoNote': agentCheDoNoteSchema,
  'agent:datCheDoTrinhDuyet': agentCheDoTrinhDuyetSchema,
  'robot:datCo': z.object({ nac: z.number().int().min(0).max(3) }),
  'robot:keoBatDau': z.object({}).optional(),
  /* Độ lệch so với chỗ bấm xuống, đơn vị điểm ảnh CSS. Chặn hai đầu để một
     renderer hỏng (hoặc một `NaN`) không quăng cửa sổ ra ngoài mọi màn hình,
     chỗ người dùng không kéo lại được. */
  'robot:keoToi': z.object({
    dx: z.number().min(-20000).max(20000),
    dy: z.number().min(-20000).max(20000),
  }),
  'robot:keoXong': z.object({}).optional(),
  'agent:datMucNoLuc': agentMucNoLucSchema,
  'agent:datModel': agentModelSchema,
  'agent:hoanTac': agentCuocSchema,
  'agent:dsPhien': null,
  'agent:moPhien': agentMoPhienSchema,
  'agent:xoaPhien': agentPhienSchema,
  'agent:doiTenPhien': agentDoiTenPhienSchema,
  'agent:ghimPhien': agentCoPhienSchema,
  'agent:luuTruPhien': agentCoPhienSchema,
  'agent:nhanBanPhien': agentNhanBanPhienSchema,
  'agent:tachNhanhCuoc': agentTachNhanhSchema,
  'app:luuFile': luuFileSchema,

  'robot:doiKichThuoc': z.object({ rong: z.boolean() }),
  /** Ba cỡ cửa sổ robot. Xem `NOI` trong robotNoi.ts để biết vì sao cần cỡ thứ ba. */
  'robot:doiCo': z.object({ co: z.enum(['gon', 'noi', 'rong']) }),
  'robot:moChinh': z.object({ duongDan: z.string().min(1).max(200) }),
  'robot:hoi': z.object({ chu: z.string().min(1).max(4000) }),
  /**
   * Nói với robot nổi. Tiếng thu được gửi lên dạng base64.
   *
   * ⚠️ Gửi CHỮ base64 chứ không gửi `Uint8Array`: kênh IPC có kiểm bằng zod, và
   * một mảng byte đi qua `structuredClone` rồi qua `z.instanceof` là chỗ dễ
   * lệch giữa hai phía. 8 giây tiếng webm ≈ 90KB base64 — rẻ hơn nhiều so với
   * một lớp lỗi khó tìm.
   *
   * Trần 6MB ≈ hơn một phút thu. Dài hơn thế thì không phải một câu hỏi.
   */
  'robot:noi': z.object({ tiengBase64: z.string().min(16).max(6_000_000) }),
  /**
   * Đọc MỘT câu. Tách riêng khỏi `robot:noi` để renderer dựng được DÂY
   * CHUYỀN: đang phát câu N thì đã đặt hàng câu N+1.
   *
   * Không có dây chuyền thì mỗi lần sang câu mới là một quãng lặng bằng
   * trọn thời gian máy đọc chạy (~2,6s) — đúng cái "lag 2-3-4 giây" người
   * dùng phàn nàn.
   */
  'robot:docCau': z.object({ cau: z.string().min(1).max(2000) }),
  'robot:baoNhac': z.object({ ten: z.string().min(1).max(200) }),

  'browser:mo': browserMoSchema,
  'browser:an': null,
  'browser:datVung': browserVungSchema,
  'browser:diToi': browserUrlSchema,
  'browser:lui': null,
  'browser:toi': null,
  'browser:napLai': null,
  'browser:moNgoai': null,

  'agent:dsWorktree': agentCuocSchema,
  'agent:taoWorktree': agentTaoWorktreeSchema,
  'agent:doiWorktree': agentDoiWorktreeSchema,
  'agent:xoaWorktree': agentDoiWorktreeSchema,
  'agent:quayLui': agentQuayLuiSchema,
  'agent:dsCuoc': null,
  'agent:bangGhi': agentCuocSchema,
  'agent:mcpTrangThai': null,
  'agent:mcpNapLai': null,
  'agent:mcpMoCauHinh': null,
} as const;

export type InvokeChannel = keyof typeof INVOKE_CHANNELS;

/** `on` — main tự đẩy về renderer. Renderer chỉ nghe được đúng các kênh này. */
export const EVENT_CHANNELS = [
  'app:networkChanged',
  'app:navigate',
  'update:status',
  /** Tiến trình agent. Nhiều sự kiện mỗi giây trong lúc chữ đang chảy. */
  'agent:event',
  /** URL / tiêu đề / lui-tới của trình duyệt trong app. */
  'browser:trangThai',
  /**
   * Agent muốn MỞ trình duyệt cạnh bảng ghi (khung chia đôi trong AI Code).
   *
   * Main không tự đặt được vị trí: `WebContentsView` là lớp phủ theo toạ độ,
   * mà toạ độ chỉ có renderer đo được. Nên main BÁO, renderer mở khung, đo,
   * rồi gọi `browser.mo` — và `web_mo` chờ tới khi thấy trình duyệt đã mở.
   */
  'agent:moWeb',
  /** Thông báo đẩy tới CỬA SỔ ROBOT nổi (tin nhắn, nhạc, agent xong việc). */
  'robot:tin',
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
  /**
   * Có bản mới nhưng PHẢI TẢI TAY — chỉ xảy ra trên macOS.
   *
   * Squirrel.Mac đòi chữ ký hợp lệ để áp bản cập nhật, mà app cố ý không ký số.
   * Tải tự động ở đây là ném 130MB của người dùng đi mỗi lần có bản mới rồi vẫn
   * không cài được. Xem ghi chú trong `main/ipc/update.ts`.
   */
  | { state: 'manual'; version: string }
  /**
   * macOS: app đang TỰ tải file cài về máy người dùng.
   *
   * Khác `downloading` (Squirrel tải bản vá để tự áp): đây là tải cái `.dmg`
   * người dùng sẽ mở tay. Tách riêng vì hai đường kết thúc khác hẳn nhau —
   * một bên "khởi động lại để cài", bên kia "mở thư mục".
   */
  | { state: 'taiTay'; version: string; percent: number }
  | { state: 'taiXong'; version: string; duong: string }
  /**
   * macOS: bản mới ĐÃ TẢI XONG và nằm sẵn trên đĩa — bấm là thay ngay, không
   * phải chờ tải nữa.
   *
   * Đây là trạng thái tương đương `ready` của Windows/Linux, chỉ khác cách cài:
   * bên kia Squirrel áp bản vá lúc thoát, bên này app tự tráo bó `.app`.
   */
  | { state: 'sanSang'; version: string }
  /** macOS: đang TRÁO bó ứng dụng (bung zip → thay → mở lại). */
  | { state: 'dangCai'; version: string }
  | { state: 'caiXong'; version: string }
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
    /**
     * Lưu file hộp cát sinh ra. Người dùng chọn nơi lưu qua hộp thoại hệ điều
     * hành; renderer không bao giờ biết đường dẫn.
     */
    luuFile(ten: string, dulieu: Uint8Array): Promise<{ ok: boolean; huy?: boolean; loi?: string }>;
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
    /**
     * macOS: tải file cài `.dmg` ĐÚNG kiến trúc máy về thư mục Tải xuống.
     *
     * Có nút này vì trang phát hành có 15 tệp (arm64/x64 · dmg/zip · blockmap ·
     * yml) và chọn nhầm một cái là tải 140MB rồi không mở được. App biết mình
     * chạy trên kiến trúc nào — để nó chọn.
     */
    taiThuCong(): Promise<void>;
    /** Mở thư mục chứa file cài vừa tải. KHÔNG tự mở file cài. */
    moThuMuc(): Promise<void>;
    /**
     * macOS: tải bản mới rồi TRÁO thẳng bó ứng dụng và mở lại.
     *
     * Không đi qua Squirrel.Mac — nó đòi chữ ký Developer ID mà app này chưa
     * có. Thay bó `.app` thì không cần chữ ký nào; app nằm trong
     * `/Applications` và người dùng là chủ.
     */
    tuCapNhat(): Promise<void>;
    /** App đang chạy từ thư mục nào, có ghi đè tại chỗ được không. */
    noiDangChay(): Promise<{ duong: string; trongApplications: boolean; ghiDuoc: boolean }>;
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
  /**
   * Mẫu AI — lấy nội dung thật của một mẫu từ repo gốc.
   *
   * Trả `null` khi không lấy được (mất mạng, GitHub đổi tệp). Danh sách mẫu
   * nằm sẵn trong app nên trang vẫn dùng được bình thường lúc đó.
   */
  mau: {
    noiDung(duong: string): Promise<NoiDungMau | null>;
  };
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
    getWorkspace(cuocId: string): Promise<AgentWorkspace>;
    /** Mở hộp thoại hệ thống. Trả về thư mục đã chọn, hoặc giữ nguyên nếu người dùng huỷ. */
    chooseWorkspace(cuocId: string): Promise<AgentWorkspace>;
    clearWorkspace(cuocId: string): Promise<AgentWorkspace>;
    /** Mở một cuộc (tab) mới. Trả về id — mọi lời gọi sau đó phải mang nó. */
    taoCuoc(): Promise<string>;
    dongCuoc(cuocId: string): Promise<void>;
    send(cuocId: string, text: string, anh?: string[]): Promise<void>;
    cancel(cuocId: string): Promise<void>;
    /** Xoá hội thoại của MỘT cuộc, giữ tab. Hạn mức KHÔNG được reset theo. */
    reset(cuocId: string): Promise<void>;
    /**
     * Trả lời thẻ duyệt. PHẢI gọi — vòng lặp đang đứng chờ đúng lời hứa này,
     * và nó chỉ tự thoát sau 5 phút hết giờ (coi như từ chối).
     */
    traLoiXinPhep(cuocId: string, id: string, quyetDinh: AgentQuyetDinh): Promise<void>;
    /** Bật/tắt quyền sửa file. Không lưu xuống đĩa — mở app lại là tắt. */
    datCheDoSua(cuocId: string, bat: boolean): Promise<AgentWorkspace>;
    /** Bật/tắt quyền chạy lệnh. Cũng không lưu xuống đĩa. */
    datCheDoLenh(cuocId: string, bat: boolean): Promise<AgentWorkspace>;
    /**
     * Cho agent GHI vào sổ ghi chú. Độc lập với thư mục dự án — ghi chú nằm
     * trên máy chủ, không phải trong cây mã.
     */
    datCheDoNote(cuocId: string, bat: boolean): Promise<AgentWorkspace>;
    datCheDoTrinhDuyet(cuocId: string, bat: boolean): Promise<AgentWorkspace>;
    /** Đặt cấp độ nỗ lực. Đây LÀ thứ được lưu — nó là sở thích, không phải quyền. */
    datMucNoLuc(muc: MucNoLuc): Promise<void>;
    datModel(model: ModelAgent): Promise<void>;
    /** Trả mọi file agent đã sửa trong việc này về nguyên trạng. */
    hoanTac(cuocId: string): Promise<{ soFile: number; loi: string[] }>;
    /** Các việc đã lưu, mới nhất trước. */
    dsPhien(): Promise<AgentPhien[]>;
    /**
     * Mở lại một việc cũ VÀO tab `cuocId`.
     *
     * Tab GIỮ NGUYÊN id của nó — chỉ chỗ ghi xuống đĩa đổi. Đổi id tab thì
     * React remount component (`key={id}`) và xoá sạch bảng ghi vừa nạp; đã
     * dính đúng lỗi đó lúc thêm nhiều tab.
     */
    moPhien(cuocId: string, id: string): Promise<{ muc: AgentMucKhoiPhuc[] } | null>;
    xoaPhien(id: string): Promise<void>;
    /** Đổi tên việc đã lưu. Tên rỗng = bỏ tên tự đặt. */
    doiTenPhien(id: string, ten: string): Promise<void>;
    ghimPhien(id: string, bat: boolean): Promise<void>;
    /** Cất đi / lấy lại. KHÔNG xoá gì cả. */
    luuTruPhien(id: string, bat: boolean): Promise<void>;
    /**
     * Nhân bản việc thành một việc mới trên đĩa.
     *
     * `denCauHoi` = chép tới TRƯỚC câu hỏi thứ đó, và trả lại nguyên văn câu
     * ấy để giao diện đặt vào ô soạn — đó là "tách nhánh từ đây". Vắng mặt =
     * chép trọn việc.
     */
    nhanBanPhien(id: string, denCauHoi?: number): Promise<
      { id: string; tieuDe: string; cauHoi?: string } | null
    >;
    /**
     * Tách nhánh hội thoại ĐANG MỞ của tab `cuocId` thành một việc mới.
     *
     * `denCauHoi` = tách từ câu hỏi thứ đó (bản nhánh giữ mọi thứ TRƯỚC nó, và
     * nguyên văn câu ấy trả về để đặt vào ô soạn). Vắng mặt = chép trọn.
     */
    tachNhanhCuoc(cuocId: string, denCauHoi?: number): Promise<
      { id: string; tieuDe: string; cauHoi?: string } | null
    >;
    /**
     * Các cuộc ĐANG MỞ trong main.
     *
     * Renderer bị tháo hẳn mỗi lần đổi trang, nên nó KHÔNG được tự nhớ danh
     * sách tab — hỏi lại main lúc gắn. Xem `dsCuocDangMo` trong `agent/loop.ts`.
     */
    /**
     * Bỏ hội thoại từ câu hỏi thứ `k` trở đi, trả lại nguyên văn câu đó để giao
     * diện đặt vào ô soạn.
     *
     * KHÔNG đụng tới file đã sửa — xem ghi chú ở `quayLui` trong agent/loop.ts.
     */
    quayLui(cuocId: string, k: number): Promise<{
      ok: boolean; loi?: string; cauHoi?: string; coSuaFile?: boolean;
    }>;
    dsCuoc(): Promise<AgentCuocDangMo[]>;
    /**
     * Bảng ghi của một cuộc + nó có ĐANG CHẠY không.
     *
     * `dangChay` đi kèm chứ không tách thành lời gọi riêng: quay lại trang giữa
     * lúc một lượt đang chạy mà nút vẫn hiện "Gửi" thì người dùng bấm phát nữa
     * và trả tiền hai lần cho cùng một câu.
     */
    bangGhi(cuocId: string): Promise<{ muc: AgentMucKhoiPhuc[]; dangChay: boolean }>;
    /** Worktree của repo mà tab này đang mở. Rỗng = không phải kho git. */
    dsWorktree(cuocId: string): Promise<AgentWorktree[]>;
    /** Tạo worktree mới (nhánh `agent/<tên>`) và CHUYỂN tab sang đó. */
    taoWorktree(cuocId: string, ten: string): Promise<{ ok: boolean; loi?: string }>;
    /** Chuyển tab sang một worktree đã có. */
    doiWorktree(cuocId: string, duongDan: string): Promise<{ ok: boolean; loi?: string }>;
    /** Xoá worktree do app tạo. CỐ Ý không xoá ép khi còn thay đổi chưa commit. */
    xoaWorktree(cuocId: string, duongDan: string): Promise<{ ok: boolean; loi?: string }>;
    /** Trạng thái MCP hiện tại. Không khởi động lại server nào. */
    mcpTrangThai(): Promise<AgentMcpTrangThai>;
    /** Tắt hết server MCP rồi bật lại theo file cấu hình. Có thể mất vài giây. */
    mcpNapLai(): Promise<AgentMcpTrangThai>;
    /** Mở file `mcp.json` bằng ứng dụng mặc định của hệ điều hành. */
    mcpMoCauHinh(): Promise<void>;
  };
  /**
   * Cửa sổ robot NỔI — trợ lý đứng ngoài app, luôn thấy kể cả khi người dùng
   * đang ở app khác. Xem `main/robotNoi.ts`.
   */
  robot: {
    /** Phình ra thành khung chat mini, hoặc thu về đúng con robot. */
    doiKichThuoc(rong: boolean): Promise<void>;
    /**
     * Đổi cỡ cửa sổ theo việc đang làm.
     *
     * ⚠️ BẮT BUỘC gọi trước khi hiện bong bóng chữ. Cửa sổ Electron CẮT mọi
     * thứ tràn ra ngoài biên, nên bong bóng 230px trong cửa sổ 150px bị xén
     * mất phần đầu — người dùng thấy những mẩu chữ cụt và tưởng model trả
     * lời cụt.
     */
    doiCo(co: 'gon' | 'noi' | 'rong'): Promise<void>;
    /** Đưa cửa sổ chính ra trước và điều hướng tới `duongDan`. */
    moChinh(duongDan: string): Promise<void>;
    datCo(nac: number): Promise<void>;
    keoBatDau(): Promise<void>;
    keoToi(dx: number, dy: number): Promise<void>;
    keoXong(): Promise<void>;
    /** Hỏi nhanh một câu, trả về câu trả lời đã hoàn chỉnh (không chảy chữ). */
    hoi(chu: string): Promise<{ chu: string }>;
    /**
     * Nói một câu với robot. Nhận vào tiếng đã thu (base64), trả về câu nghe
     * được, câu trả lời, và tiếng đọc (base64) — hoặc `null` nếu người dùng
     * đã tắt đọc thành tiếng, hoặc máy đọc hỏng.
     */
    noi(tiengBase64: string): Promise<{ cauHoi: string; traLoi: string; cau: string[] }>;
    /** Đọc một câu, trả tiếng base64. `null` khi người dùng đã tắt đọc thành tiếng. */
    docCau(cau: string): Promise<{ tiengBase64: string | null }>;
    /**
     * Báo bài đang phát. Main tự BỎ QUA khi cửa sổ chính đang được nhìn — nói
     * lại tên bài ngay trong trang nhạc là thừa.
     */
    baoNhac(ten: string): Promise<void>;
  };

  browser: {
    /** Hiện trình duyệt đè lên `vung` (toạ độ cửa sổ), tuỳ chọn mở luôn `url`. */
    mo(vung: { x: number; y: number; width: number; height: number }, url?: string): Promise<void>;
    /** Gỡ khỏi cửa sổ nhưng GIỮ trang — quay lại không phải tải lại. */
    an(): Promise<void>;
    datVung(vung: { x: number; y: number; width: number; height: number }): Promise<void>;
    diToi(url: string): Promise<{ ok: boolean; loi?: string }>;
    lui(): Promise<void>;
    toi(): Promise<void>;
    napLai(): Promise<void>;
    /** Mở trang hiện tại bằng trình duyệt hệ thống. */
    moNgoai(): Promise<void>;
  };

  /** Trả về hàm huỷ đăng ký. Renderer PHẢI gọi nó khi unmount. */
  on(channel: EventChannel, listener: (payload: unknown) => void): () => void;
}
