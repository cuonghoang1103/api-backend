/**
 * Tầng gọi API.
 *
 * Dùng `fetch` thẳng, không axios: nhu cầu ở đây là gắn header, đổi token khi
 * 401, và phân loại lỗi — chừng đó không đáng thêm một phụ thuộc. Frontend web
 * dùng axios vì nó đi qua proxy Next cùng origin và có interceptor riêng; app
 * desktop gọi thẳng `api.cuongthai.com` nên hoàn cảnh khác hẳn.
 *
 * Gốc API do MAIN quyết (`app:getInfo`), renderer không tự đặt. Nếu renderer tự
 * đặt được base URL thì một đoạn mã bị chèn có thể trỏ mọi lời gọi sang máy chủ
 * của kẻ tấn công mà vẫn mang theo token.
 */

/** Phân loại lỗi để tầng trên biết nên thử lại hay bỏ cuộc. */
export type ApiFailure =
  /** Không nối được máy chủ (mất mạng, DNS, timeout). Đáng thử lại. */
  | { kind: 'offline'; message: string }
  /** Máy chủ trả 5xx hoặc 429. Đáng thử lại. */
  | { kind: 'server'; status: number; message: string }
  /** 401 và làm mới token cũng hỏng → phiên đã chết. */
  | { kind: 'unauthorized'; message: string }
  /** 403 — đăng nhập rồi nhưng không đủ quyền (thường là thiếu Pro). */
  | { kind: 'forbidden'; message: string }
  /** 409 — máy chủ có bản mới hơn. */
  | { kind: 'conflict'; message: string; body: unknown }
  /** 4xx còn lại — dữ liệu sai, thử lại vô nghĩa. */
  | { kind: 'rejected'; status: number; message: string };

export class ApiError extends Error {
  constructor(public readonly failure: ApiFailure) {
    super(failure.message);
    this.name = 'ApiError';
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /**
   * Gắn header `Idempotency-Key`. Hàng đợi đồng bộ truyền vào để máy chủ nhận
   * ra yêu cầu lặp. Backend hiện CHƯA đọc header này — xem ghi chú ở cuối file.
   */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

/** Tự động huỷ sau 30 giây. Không có timeout thì một kết nối treo sẽ treo mãi. */
const TIMEOUT_MS = 30_000;

export class ApiClient {
  private token: string | null = null;
  /**
   * Một lời hứa làm mới token dùng chung.
   *
   * Khi năm lời gọi cùng nhận 401 một lúc (chuyện thường khi mở app), nếu mỗi
   * cái tự gọi `/auth/refresh` thì có năm token mới được sinh ra và bốn cái bị
   * vứt đi — mà lần ghi cuối vào safeStorage chưa chắc là token mà renderer
   * đang giữ. Gom về một lời hứa duy nhất thì chỉ có một lần làm mới.
   */
  private refreshing: Promise<string | null> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly onSessionChanged: (
      session: { userId: number; token: string } | null,
    ) => void,
  ) {}

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  /**
   * Tiền tố URL cho những lời gọi KHÔNG đi qua `request()`.
   *
   * `request()` luôn đặt `Content-Type: application/json` và `JSON.stringify`
   * phần thân, nên nó không gửi được `FormData` — làm vậy sẽ đẩy lên chuỗi
   * "[object FormData]" và máy chủ nhận một request rỗng. Tải file/âm thanh
   * phải tự gọi `fetch`, và cần đúng hai thứ này.
   */
  baseUrlForForms(): string {
    return this.baseUrl;
  }

  /** Header xác thực cho những lời gọi tự dựng. KHÔNG kèm Content-Type —
   *  trình duyệt phải tự đặt nó kèm `boundary` của multipart. */
  authHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.send(path, options);

    // 401 + ĐANG CÓ token: token hết hạn → làm mới MỘT lần rồi gọi lại. Không
    // lặp vô hạn; lần gọi lại vẫn 401 thì phiên chết thật.
    //
    // 401 mà KHÔNG có token là chuyện khác hẳn: đó là lời gọi chưa xác thực bị
    // từ chối — điển hình là đăng nhập sai mật khẩu. Cho nó đi vào nhánh làm
    // mới sẽ nuốt mất thông báo của máy chủ và thay bằng "Phiên đăng nhập đã
    // hết hạn", tức là app nói với người đang đứng ở màn ĐĂNG NHẬP rằng phiên
    // của họ hết hạn. Vô nghĩa, và che mất lý do thật ("sai mật khẩu", "tài
    // khoản bị khoá", "email chưa xác thực").
    if (response.status === 401 && this.token !== null) {
      const fresh = await this.refreshOnce();
      if (fresh === null) {
        this.onSessionChanged(null);
        throw new ApiError({
          kind: 'unauthorized',
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
      }
      const retried = await this.send(path, options);
      return this.unwrap<T>(retried);
    }

    return this.unwrap<T>(response);
  }

  private async send(path: string, options: RequestOptions): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Nối tín hiệu huỷ của người gọi với timeout nội bộ.
    options.signal?.addEventListener('abort', () => controller.abort());

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;

    try {
      return await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers,
        // Spread có điều kiện thay vì gán `undefined`: với
        // `exactOptionalPropertyTypes`, gán undefined KHÁC với không có thuộc
        // tính, và `RequestInit.body` không nhận undefined.
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
        signal: controller.signal,
        // KHÔNG gửi cookie. App desktop xác thực bằng Bearer; gửi kèm cookie chỉ
        // tạo đường thứ hai để nhầm lẫn phiên nào đang có hiệu lực.
        credentials: 'omit',
      });
    } catch (error) {
      // `fetch` chỉ ném khi không nối được máy chủ — lỗi HTTP không ném.
      throw new ApiError({
        kind: 'offline',
        message:
          controller.signal.aborted && !options.signal?.aborted
            ? 'Máy chủ không phản hồi sau 30 giây.'
            : 'Không kết nối được máy chủ.',
      });
    } finally {
      clearTimeout(timer);
    }
  }

  private async unwrap<T>(response: Response): Promise<T> {
    if (response.ok) {
      // 204 không có thân phản hồi — `json()` sẽ ném.
      if (response.status === 204) return undefined as T;
      const envelope = (await response.json()) as ApiEnvelope<T>;
      return (envelope.data ?? envelope) as T;
    }

    let message = `Máy chủ trả về lỗi ${response.status}.`;
    let body: unknown = null;
    try {
      body = await response.json();
      const parsed = body as ApiEnvelope<unknown>;
      if (parsed.message) message = parsed.message;
    } catch {
      /* phản hồi không phải JSON — giữ thông báo mặc định */
    }

    if (response.status === 403) throw new ApiError({ kind: 'forbidden', message });
    if (response.status === 409) throw new ApiError({ kind: 'conflict', message, body });
    if (response.status === 429 || response.status >= 500) {
      throw new ApiError({ kind: 'server', status: response.status, message });
    }
    throw new ApiError({ kind: 'rejected', status: response.status, message });
  }

  /**
   * Đổi token hết hạn lấy token mới.
   *
   * Gửi ACCESS token hiện tại — đó là thứ `/auth/refresh` nhận (verify bằng
   * `jwtSecret` với `ignoreExpiration: true`). KHÔNG gửi trường `refreshToken`
   * mà backend trả về lúc đăng nhập: nó ký bằng một secret không ai verify, nên
   * gửi lên chỉ nhận 401.
   */
  private refreshOnce(): Promise<string | null> {
    // Đã có lần làm mới đang chạy thì bám vào nó.
    this.refreshing ??= this.doRefresh().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  private async doRefresh(): Promise<string | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/json' },
        credentials: 'omit',
      });
      if (!response.ok) return null;

      const envelope = (await response.json()) as ApiEnvelope<{
        userId: number;
        token: string;
      }>;
      const data = envelope.data;
      if (!data?.token) return null;

      this.token = data.token;
      this.onSessionChanged({ userId: data.userId, token: data.token });
      return data.token;
    } catch {
      // Mất mạng lúc làm mới KHÔNG phải là phiên chết. Trả null để lời gọi hiện
      // tại hỏng, nhưng người gọi phải phân biệt: `onSessionChanged(null)` chỉ
      // được gọi ở nhánh 401 sau khi đã thử lại, không gọi ở đây.
      return null;
    }
  }
}

/**
 * ⚠️ GHI CHÚ VỀ IDEMPOTENCY — đọc trước khi xếp bất kỳ `create` nào vào hàng đợi
 *
 * Đối chiếu mã backend ngày 16/08/2026:
 *
 *   • KHÔNG route nào đọc header `Idempotency-Key`. Client vẫn gắn (vô hại, và
 *     sẵn sàng cho ngày backend hỗ trợ), nhưng hôm nay máy chủ bỏ qua nó.
 *   • Idempotency DUY NHẤT đang có nằm ở `src/routes/payment.routes.ts`: nó đọc
 *     `idempotencyKey` từ THÂN JSON (kiểu Stripe), và chỉ cho luồng mua khoá học.
 *
 * Hệ quả cho hàng đợi đồng bộ: chống nhân đôi hiện chỉ có ở PHÍA CLIENT (không
 * xếp trùng, không gửi lại việc đã xác nhận). Trường hợp máy chủ đã ghi xong mà
 * phản hồi lạc đường thì client sẽ gửi lại và máy chủ ghi LẦN HAI.
 *
 * Vì vậy chỉ xếp hàng những thao tác lặp lại vẫn cho cùng kết quả:
 *   ✓ `update` — ghi cùng nội dung hai lần vẫn ra một trạng thái
 *   ✓ `delete` — xoá thứ đã xoá là no-op
 *   ✗ `create` cho thực thể mà bản sao là sai (gửi tin nhắn, đăng bài) —
 *     KHÔNG xếp hàng. Giữ dạng nháp cục bộ và để người dùng bấm gửi khi có mạng.
 */
