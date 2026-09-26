/**
 * Nối `frontend/src/lib/api.ts` (4.994 dòng, viết cho web) vào app desktop.
 *
 * ─── Vì sao chỉ cần chừng này ───
 * `lib/api.ts` tạo MỘT instance axios rồi `export default` nó ra (dòng 1945).
 * Toàn bộ 4.994 dòng còn lại gọi qua instance đó. Nên đổi `baseURL` và gắn
 * header xác thực lên chính instance ấy là mọi lời gọi API của web chạy nguyên
 * xi trong app desktop — không phải sửa một dòng nào của web.
 *
 * ─── Hai khác biệt phải bù ───
 *  1. Web dùng đường dẫn tương đối `/api/v1` vì nó chạy cùng origin với proxy
 *     Next. App desktop chạy ở `app://cuongthai`, nơi đường dẫn tương đối trỏ
 *     vào chính bundle chứ không ra máy chủ.
 *  2. Web xác thực bằng cookie httpOnly mà proxy Next đọc rồi gắn Bearer hộ.
 *     App desktop không có proxy đó, nên phải tự gắn Bearer.
 *
 * ─── Vì sao KHÔNG fork lib/api.ts ───
 * Fork nghĩa là nuôi hai bản 5.000 dòng song song, và mỗi endpoint mới phải
 * thêm hai lần. Bộ nối này là 40 dòng.
 */
import webApi from '@/lib/api';

let configured = false;
/**
 * Dấu đóng lên chính lớp bọc.
 *
 * Dùng một cờ boolean thì `vaFetch()` chỉ bọc ĐÚNG cái `fetch` tồn tại lúc gọi
 * lần đầu — thứ gì thay `globalThis.fetch` sau đó sẽ không được bọc, và mọi
 * lời gọi `/api/` đi thẳng ra ngoài với đường dẫn tương đối. Hỏi chính
 * `globalThis.fetch` xem nó có phải của mình không thì đúng ở mọi thứ tự.
 */
const DAU_BOC = Symbol.for('cuongthai.fetch-da-boc');
/**
 * Cấu hình MỚI NHẤT, không phải cấu hình của lần gọi đầu.
 *
 * `vaFetch()` chỉ bọc `fetch` một lần, nên nếu nó chộp `options` của lần gọi
 * đầu thì mọi lần `configureWebApi` sau (đổi token, đổi gốc API) sẽ không tới
 * được lớp bọc — và lời gọi fetch vẫn mang token cũ. Giữ ở đây thì lớp bọc
 * luôn đọc giá trị hiện hành.
 */
let cauHinh: { apiBase: string; getToken: () => string | null } = {
  apiBase: '', getToken: () => null,
};

/**
 * Trỏ axios của web vào máy chủ thật và gắn token.
 *
 * Gọi mỗi khi token đổi (đăng nhập, làm mới). Interceptor chỉ gắn MỘT lần —
 * gắn lại ở mỗi lần gọi sẽ chồng hàng chục interceptor lên nhau, mỗi cái ghi đè
 * header của cái trước, và cái cuối cùng thắng theo thứ tự không ai đoán được.
 */
export function configureWebApi(options: {
  /** Gốc API. Chuỗi RỖNG ở chế độ dev — khi đó proxy của Vite lo việc chuyển tiếp. */
  apiBase: string;
  getToken: () => string | null;
}): void {
  // `baseURL` của web là '/api/v1'; ghép gốc vào trước để thành URL tuyệt đối.
  cauHinh = options;
  webApi.defaults.baseURL = `${options.apiBase}/api/v1`;

  /* Gốc site cho MÃ WEB dựng URL tài nguyên (ảnh, file tĩnh) — xem
     `frontend/src/lib/anhTuyetDoi.ts`.
     Vì sao một biến toàn cục chứ không đọc `defaults.baseURL`: hàm đó đọc lúc
     VẼ, còn `configureWebApi` chạy trong một effect của `TrangWeb`. Đo thật
     07/09/2026: lúc thẻ ảnh được dựng, `defaults.baseURL` vẫn là `/api/v1`
     (giá trị mặc định của axios), nên ảnh vẫn ra URL tương đối và vẫn vỡ.
     Biến này được đặt một lần lúc app khởi động nên không có cửa sổ thời gian
     nào để lọt qua. Trên web nó không tồn tại ⇒ mã web giữ nguyên hành vi cũ. */
  (globalThis as { __CT_GOC_SITE__?: string }).__CT_GOC_SITE__ = options.apiBase;

  // KHÔNG gửi cookie: app desktop xác thực bằng Bearer, và gửi kèm cookie chỉ
  // tạo đường thứ hai để nhầm lẫn phiên nào đang có hiệu lực.
  webApi.defaults.withCredentials = false;

  if (configured) return;
  configured = true;

  webApi.interceptors.request.use((config) => {
    const token = options.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  vaFetch();
}

/**
 * Không phải mã web nào cũng đi qua axios.
 *
 * ⚠️ Đo thật 20/08/2026: `RecorderStudio` của Xưởng mô phỏng gọi thẳng
 * `fetch('/api/v1/simulation/convert-mp4')` để xuất video MP4. Endpoint đó CÓ
 * THẬT (thử: trả 401, tức đã mount), nhưng đường dẫn TƯƠNG ĐỐI ở origin
 * `app://cuongthai` trỏ vào chính bundle chứ không ra máy chủ — nút xuất video
 * sẽ hỏng, và hỏng CÂM: không có lỗi mạng nào dễ nhận ra, chỉ là một yêu cầu
 * không bao giờ tới nơi.
 *
 * Bọc `fetch` toàn cục là việc phải cân nhắc, nên phạm vi được thu hẹp tối đa:
 * CHỈ viết lại những URL bắt đầu bằng `/api/`, và chỉ gắn Bearer cho chúng.
 * Mọi thứ khác đi qua nguyên vẹn.
 */
export function vaFetch(): void {
  if ((globalThis.fetch as { [DAU_BOC]?: true })[DAU_BOC]) return;

  const goc = globalThis.fetch.bind(globalThis);

  const boc = (dau: RequestInfo | URL, tuy?: RequestInit): Promise<Response> => {
    const url = typeof dau === 'string' ? dau : dau instanceof URL ? dau.href : dau.url;
    const { apiBase } = cauHinh;
    /*
     * ⚠️ HAI dạng URL của cùng một máy chủ API.
     *  • `/api/...` — tương đối (mã web viết tay). Phải ghép gốc vào.
     *  • `${apiBase}/api/...` — ĐÃ tuyệt đối, vì mã web dựng nó từ
     *    `api.defaults.baseURL` mà `configureWebApi` đã đặt. Ví dụ thật
     *    26/09/2026: "✨ Sắp xếp lại" của Notes (`notesApi.aiSapXep`) gọi
     *    `fetch(`${baseURL}/notes/ai/sap-xep`)` và tự lấy token từ
     *    `document.cookie` — trong app cookie đó KHÔNG tồn tại. Chỉ nhận dạng
     *    đầu thì ở bản đóng gói (gốc là https://…) lời gọi đi ra không có
     *    Bearer ⇒ 401 ⇒ nút AI hỏng câm; ở dev (gốc rỗng) lại chạy, nên thử ở
     *    máy dev không bao giờ thấy.
     * Chỉ gắn token cho ĐÚNG gốc API của app — không bao giờ cho host lạ.
     */
    const tuongDoi = url.startsWith('/api/');
    const tuyetDoi = apiBase !== '' && url.startsWith(`${apiBase}/api/`);
    if (!tuongDoi && !tuyetDoi) return goc(dau, tuy);

    const header = new Headers(tuy?.headers ?? (typeof dau === 'object' && 'headers' in dau ? dau.headers : undefined));
    const token = cauHinh.getToken();
    if (token && !header.has('Authorization')) header.set('Authorization', `Bearer ${token}`);

    /* `credentials: 'omit'` cùng lý do `withCredentials = false` ở trên: app
       xác thực bằng Bearer, cookie chỉ là đường thứ hai để nhầm phiên. */
    const dich = tuongDoi ? `${apiBase}${url}` : url;
    if (typeof dau === 'object' && !(dau instanceof URL)) {
      // Request object: giữ method/body của nó, chỉ đổi URL + header.
      return goc(new Request(dich, dau), { ...tuy, headers: header, credentials: 'omit' });
    }
    return goc(dich, { ...tuy, headers: header, credentials: 'omit' });
  };

  (boc as { [DAU_BOC]?: true })[DAU_BOC] = true;
  globalThis.fetch = boc as typeof fetch;
}

/** CHỈ dùng cho phép kiểm — đặt cấu hình mà không đụng tới axios của web. */
export function datCauHinhChoKiem(c: { apiBase: string; getToken: () => string | null }): void {
  cauHinh = c;
}
