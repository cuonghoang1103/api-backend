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
    if (!url.startsWith('/api/')) return goc(dau, tuy);

    const header = new Headers(tuy?.headers ?? (typeof dau === 'object' && 'headers' in dau ? dau.headers : undefined));
    const token = cauHinh.getToken();
    if (token && !header.has('Authorization')) header.set('Authorization', `Bearer ${token}`);

    return goc(`${cauHinh.apiBase}${url}`, { ...tuy, headers: header });
  };

  (boc as { [DAU_BOC]?: true })[DAU_BOC] = true;
  globalThis.fetch = boc as typeof fetch;
}

/** CHỈ dùng cho phép kiểm — đặt cấu hình mà không đụng tới axios của web. */
export function datCauHinhChoKiem(c: { apiBase: string; getToken: () => string | null }): void {
  cauHinh = c;
}
