/**
 * Danh mục mã trạng thái HTTP — NGUỒN DỮ LIỆU DUY NHẤT.
 *
 * Trước đây danh sách mã nằm nhét cứng trong phần `options` của kịch bản REST,
 * còn màu thì tính bằng mấy câu `if (status < 400)` rải rác. Tách ra đây vì ba
 * lý do cụ thể:
 *
 *  1. Thêm một mã mới giờ là thêm MỘT dòng vào mảng này — bảng chọn, màu sắc,
 *     chú giải và hoạt cảnh đều tự cập nhật theo.
 *  2. Trường `stage` là phần quan trọng nhất và cũng là phần dễ làm ẩu nhất:
 *     nó nói mã lỗi phát sinh Ở CHẶNG NÀO trong chuỗi. Có nó thì chọn 429 là
 *     gói tin chết ngay tại Nginx, chọn 409 là gói tin đi tới tận CSDL rồi mới
 *     quay đầu. Không có nó thì mọi mã đều chạy hết chuỗi rồi đổi con số ở
 *     cuối — hoạt cảnh sẽ DẠY SAI, và dạy sai còn tệ hơn không dạy.
 *  3. `type` theo đúng bốn lớp của chuẩn HTTP, dùng cho màu và cho việc gom
 *     nhóm trong bảng điều khiển.
 */

import type { I18nText } from './types';

export type StatusType = 'success' | 'redirect' | 'client_error' | 'server_error';

/**
 * Chặng trong chuỗi Browser → Nginx → Middleware → Handler → CSDL nơi mã này
 * thực sự phát sinh. Đây là thứ quyết định hoạt cảnh dừng ở đâu.
 */
export type StatusStage =
  | 'edge' // chết tại Nginx / rate limiter — API không hề nhận được request
  | 'auth' // middleware xác thực: bạn là ai
  | 'authz' // middleware phân quyền: bạn được làm gì
  | 'validate' // tầng kiểm tra dữ liệu
  | 'handler' // nổ trong hàm xử lý
  | 'database' // CSDL trả lời, nhưng không như mong đợi
  | 'conditional' // đi hết chuỗi rồi phát hiện không cần trả dữ liệu
  | 'complete'; // đi trọn vòng đời

export interface HttpStatus {
  code: number;
  /** Nhãn đầy đủ theo chuẩn, ví dụ "422 Unprocessable Entity". */
  label: string;
  /** Tên gọn hiện trên nút chọn — chỉ con số cho gọn cột 300px. */
  short: string;
  type: StatusType;
  stage: StatusStage;
  /** Một câu giải thích khi nào gặp mã này. */
  note: I18nText;
}

export const HTTP_STATUSES: HttpStatus[] = [
  {
    code: 200,
    label: '200 OK',
    short: '200',
    type: 'success',
    stage: 'complete',
    note: {
      vi: 'Thành công, thân phản hồi chứa dữ liệu. Mã mặc định cho GET/PUT.',
      en: 'Success with a body. The default for GET and PUT.',
    },
  },
  {
    code: 201,
    label: '201 Created',
    short: '201',
    type: 'success',
    stage: 'complete',
    note: {
      vi: 'Đã tạo tài nguyên mới. Phải kèm header Location trỏ tới nó — đó là điểm phân biệt với 200.',
      en: 'A new resource exists. Must carry a Location header pointing at it — that is what separates it from 200.',
    },
  },
  {
    code: 204,
    label: '204 No Content',
    short: '204',
    type: 'success',
    stage: 'complete',
    note: {
      vi: 'Thành công nhưng KHÔNG có thân phản hồi. Chuẩn cho DELETE. Gửi kèm body là sai chuẩn — nhiều client sẽ không đọc.',
      en: 'Success with NO body at all. The correct answer for DELETE. Sending a body violates the spec — many clients will never read it.',
    },
  },
  {
    code: 304,
    label: '304 Not Modified',
    short: '304',
    type: 'redirect',
    stage: 'conditional',
    note: {
      vi: 'Dữ liệu chưa đổi kể từ lần trước. Server trả về mà KHÔNG gửi lại nội dung — trình duyệt dùng bản trong bộ đệm.',
      en: 'Nothing changed since last time. The server answers WITHOUT resending the payload — the browser reuses its cached copy.',
    },
  },
  {
    code: 400,
    label: '400 Bad Request',
    short: '400',
    type: 'client_error',
    stage: 'validate',
    note: {
      vi: 'Request hỏng ở mức CÚ PHÁP: JSON không parse được, thiếu header bắt buộc. Server chưa hiểu nổi bạn muốn gì.',
      en: 'Malformed at the SYNTAX level: unparseable JSON, a missing required header. The server cannot even work out what you meant.',
    },
  },
  {
    code: 401,
    label: '401 Unauthorized',
    short: '401',
    type: 'client_error',
    stage: 'auth',
    note: {
      vi: 'Chưa xác thực: thiếu token, token sai chữ ký hoặc hết hạn. Nghĩa là "bạn là ai?".',
      en: 'Not authenticated: missing token, bad signature or expired. It means "who are you?".',
    },
  },
  {
    code: 403,
    label: '403 Forbidden',
    short: '403',
    type: 'client_error',
    stage: 'authz',
    note: {
      vi: 'Đã biết bạn là ai, nhưng bạn không được phép. Nghĩa là "bạn không có quyền" — khác hẳn 401.',
      en: 'We know exactly who you are, and you may not do this. It means "not allowed" — a different thing from 401.',
    },
  },
  {
    code: 404,
    label: '404 Not Found',
    short: '404',
    type: 'client_error',
    stage: 'database',
    note: {
      vi: 'Truy vấn chạy thành công nhưng trả về 0 dòng. Biến "rỗng" thành 404 là quyết định của tầng ứng dụng.',
      en: 'The query succeeded and returned zero rows. Turning "empty" into 404 is an application-layer decision.',
    },
  },
  {
    code: 409,
    label: '409 Conflict',
    short: '409',
    type: 'client_error',
    stage: 'database',
    note: {
      vi: 'Xung đột trạng thái: email đã tồn tại, phiên bản dữ liệu đã cũ. Ràng buộc UNIQUE của CSDL là bên phát hiện.',
      en: 'A state conflict: the email already exists, the version is stale. The database UNIQUE constraint is what catches it.',
    },
  },
  {
    code: 422,
    label: '422 Unprocessable Entity',
    short: '422',
    type: 'client_error',
    stage: 'validate',
    note: {
      vi: 'Cú pháp ĐÚNG nhưng ý nghĩa SAI: JSON hợp lệ, email đúng định dạng, nhưng ngày kết thúc trước ngày bắt đầu.',
      en: 'Syntactically fine, semantically wrong: valid JSON, well-formed email, but the end date precedes the start date.',
    },
  },
  {
    code: 429,
    label: '429 Too Many Requests',
    short: '429',
    type: 'client_error',
    stage: 'edge',
    note: {
      vi: 'Vượt hạn mức. Bị chặn ngay tại biên nên rẻ nhất — API và CSDL không hề biết có request này.',
      en: 'Over the limit. Rejected at the edge, so it is the cheapest refusal there is — the API and database never learn it happened.',
    },
  },
  {
    code: 500,
    label: '500 Internal Server Error',
    short: '500',
    type: 'server_error',
    stage: 'handler',
    note: {
      vi: 'Lỗi CỦA CHÚNG TA. Ngoại lệ chưa bắt trong handler. Ghi log kèm requestId, đừng bao giờ trả stack trace về client.',
      en: 'OUR fault. An unhandled exception in the handler. Log it with a requestId; never return the stack trace.',
    },
  },
  {
    code: 502,
    label: '502 Bad Gateway',
    short: '502',
    type: 'server_error',
    stage: 'edge',
    note: {
      vi: 'Nginx không kết nối nổi tới upstream: container backend chết hoặc đang khởi động lại. Ứng dụng của bạn KHÔNG chạy dòng code nào.',
      en: 'Nginx cannot reach the upstream at all: the backend container is dead or restarting. Your application never ran a single line.',
    },
  },
  {
    code: 504,
    label: '504 Gateway Timeout',
    short: '504',
    type: 'server_error',
    stage: 'edge',
    note: {
      vi: 'Upstream có sống nhưng trả lời quá chậm, Nginx bỏ cuộc. Nguy hiểm ở chỗ backend VẪN đang chạy tiếp việc đó.',
      en: 'The upstream is alive but too slow, so Nginx gives up. The danger: the backend is STILL working on it.',
    },
  },
];

/** Màu theo lớp mã. Trùng bảng màu kỹ thuật trong `theme.ts`. */
export const STATUS_TYPE_COLORS: Record<StatusType, string> = {
  success: '#34d399',
  redirect: '#38bdf8',
  client_error: '#fbbf24',
  server_error: '#ef4444',
};

/** Nhãn nhóm hiện trong bảng điều khiển — gom 14 mã cho đỡ rối mắt. */
export const STATUS_TYPE_LABELS: Record<StatusType, I18nText> = {
  success: { vi: '2xx · Thành công', en: '2xx · Success' },
  redirect: { vi: '3xx · Điều hướng & đệm', en: '3xx · Redirect & cache' },
  client_error: { vi: '4xx · Lỗi phía gọi', en: '4xx · Caller error' },
  server_error: { vi: '5xx · Lỗi phía server', en: '5xx · Server error' },
};

const BY_CODE = new Map(HTTP_STATUSES.map((s) => [s.code, s]));

export function getStatus(code: number): HttpStatus | undefined {
  return BY_CODE.get(code);
}

/**
 * Màu của một mã trạng thái. Tra bảng trước; mã lạ thì suy ra từ lớp trăm,
 * để hàm này không bao giờ trả về undefined giữa lúc đang vẽ khung hình.
 */
export function statusColor(code?: number): string {
  if (!code) return '#94a3b8';
  const known = BY_CODE.get(code);
  if (known) return STATUS_TYPE_COLORS[known.type];
  if (code < 300) return STATUS_TYPE_COLORS.success;
  if (code < 400) return STATUS_TYPE_COLORS.redirect;
  if (code < 500) return STATUS_TYPE_COLORS.client_error;
  return STATUS_TYPE_COLORS.server_error;
}
