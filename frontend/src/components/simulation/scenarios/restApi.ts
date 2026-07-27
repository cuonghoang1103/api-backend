/**
 * Kịch bản 1 — Vòng đời một request REST API.
 *
 * Đây là kịch bản "xương sống" của cả studio: nó đi hết chuỗi
 *   Browser → Nginx → Express → Middleware → PostgreSQL → và quay về.
 *
 * Hai tuỳ chọn (method, status) không chỉ đổi màu gói tin — chúng RẼ NHÁNH
 * dòng chảy: 401 chết ở middleware auth, 400 chết ở tầng validate, 404 đi
 * tới tận CSDL rồi mới quay về rỗng, 500 nổ ngay trong handler. Mục đích là
 * dạy được câu hỏi quan trọng nhất: "lỗi này phát sinh Ở ĐÂU trong chuỗi?".
 */

import { Globe } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'client', label: 'Browser', kind: 'client' as const, x: 110, y: 300, sublabel: { vi: 'Trình duyệt / App', en: 'Browser / Mobile app' } },
  { id: 'lb', label: 'Nginx', kind: 'edge' as const, x: 330, y: 300, sublabel: { vi: 'Reverse proxy · TLS', en: 'Reverse proxy · TLS' } },
  { id: 'mw', label: 'Middleware', kind: 'server' as const, x: 570, y: 116, sublabel: { vi: 'CORS · Auth · Validate', en: 'CORS · Auth · Validate' } },
  { id: 'api', label: 'Express API', kind: 'server' as const, x: 570, y: 320, sublabel: { vi: 'Node.js · route handler', en: 'Node.js · route handler' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 850, y: 320, sublabel: { vi: 'Prisma · connection pool', en: 'Prisma · connection pool' } },
];

const edges = [
  { id: 'e_client_lb', from: 'client', to: 'lb', label: { vi: 'HTTPS', en: 'HTTPS' } },
  { id: 'e_lb_api', from: 'lb', to: 'api', curve: 34, label: { vi: 'proxy_pass', en: 'proxy_pass' } },
  { id: 'e_api_mw', from: 'api', to: 'mw', label: { vi: 'chuỗi middleware', en: 'middleware chain' } },
  { id: 'e_api_db', from: 'api', to: 'db', label: { vi: 'TCP 5432', en: 'TCP 5432' } },
];

/** Thân request mẫu theo từng method — POST/PUT mới có body. */
function requestBody(method: string): unknown {
  if (method === 'POST') {
    return {
      title: 'Học Node.js trong 30 ngày',
      slug: 'hoc-nodejs-30-ngay',
      tags: ['nodejs', 'backend'],
      published: true,
    };
  }
  if (method === 'PUT') {
    return { id: 42, title: 'Học Node.js trong 21 ngày', published: true };
  }
  return null;
}

function routeFor(method: string): string {
  return method === 'GET' ? '/api/v1/posts' : method === 'POST' ? '/api/v1/posts' : '/api/v1/posts/42';
}

/** Câu SQL tương ứng method — dùng cho bước truy vấn CSDL. */
function sqlFor(method: string): string {
  switch (method) {
    case 'POST':
      return 'INSERT INTO posts (title, slug, tags) VALUES ($1,$2,$3) RETURNING *';
    case 'PUT':
      return 'UPDATE posts SET title=$1, published=$2 WHERE id=$3 RETURNING *';
    case 'DELETE':
      return 'DELETE FROM posts WHERE id=$1';
    default:
      return 'SELECT id, title, slug, created_at FROM posts ORDER BY created_at DESC LIMIT 20';
  }
}

/** Thân phản hồi thành công theo method. */
function successBody(method: string, status: number): unknown {
  if (status === 204 || method === 'DELETE') return { success: true, deletedId: 42 };
  if (method === 'POST') return { id: 128, title: 'Học Node.js trong 30 ngày', slug: 'hoc-nodejs-30-ngay', createdAt: '2026-07-28T09:14:02.331Z' };
  if (method === 'PUT') return { id: 42, title: 'Học Node.js trong 21 ngày', published: true, updatedAt: '2026-07-28T09:14:02.331Z' };
  return {
    data: [
      { id: 42, title: 'Event loop giải thích dễ hiểu', slug: 'event-loop' },
      { id: 41, title: 'Streams và backpressure', slug: 'streams-backpressure' },
    ],
    meta: { total: 128, page: 1, perPage: 20 },
  };
}

const ERROR_BODIES: Record<number, unknown> = {
  400: { error: 'ValidationError', message: 'Trường "title" là bắt buộc và phải dài ít nhất 3 ký tự', field: 'title' },
  401: { error: 'Unauthorized', message: 'Token đã hết hạn hoặc không hợp lệ', code: 'TOKEN_EXPIRED' },
  404: { error: 'NotFound', message: 'Không tìm thấy bài viết với id = 42' },
  500: { error: 'InternalServerError', message: 'Kết nối tới cơ sở dữ liệu bị từ chối', requestId: 'req_8f21ac' },
};

export const restApiScenario: Scenario = {
  id: 'rest-api',
  name: { vi: 'REST API — Request & Response', en: 'REST API — Request & Response' },
  tagline: {
    vi: 'Đi hết vòng đời một request: TLS, reverse proxy, middleware, handler, CSDL rồi quay về.',
    en: 'Follow one request end to end: TLS, reverse proxy, middleware, handler, database and back.',
  },
  icon: Globe,
  accent: '#10b981',
  nodes,
  edges,
  options: [
    {
      id: 'method',
      label: { vi: 'HTTP Method', en: 'HTTP method' },
      defaultValue: 'GET',
      choices: [
        { value: 'GET', label: 'GET', color: '#10b981', hint: { vi: 'Đọc dữ liệu, an toàn & idempotent', en: 'Read data — safe & idempotent' } },
        { value: 'POST', label: 'POST', color: '#22d3ee', hint: { vi: 'Tạo mới, KHÔNG idempotent', en: 'Create — not idempotent' } },
        { value: 'PUT', label: 'PUT', color: '#f59e0b', hint: { vi: 'Ghi đè toàn bộ tài nguyên', en: 'Replace the whole resource' } },
        { value: 'DELETE', label: 'DELETE', color: '#f43f5e', hint: { vi: 'Xoá, idempotent', en: 'Delete — idempotent' } },
      ],
    },
    {
      id: 'status',
      label: { vi: 'Kết quả trả về', en: 'Response status' },
      defaultValue: '200',
      choices: [
        { value: '200', label: '200 OK', color: '#34d399' },
        { value: '201', label: '201 Created', color: '#34d399' },
        { value: '400', label: '400 Bad Request', color: '#fbbf24' },
        { value: '401', label: '401 Unauthorized', color: '#fbbf24' },
        { value: '404', label: '404 Not Found', color: '#fb923c' },
        { value: '500', label: '500 Server Error', color: '#ef4444' },
      ],
    },
  ],

  build({ method = 'GET', status = '200' }) {
    const code = Number(status);
    const isError = code >= 400;
    const route = routeFor(method);
    const body = requestBody(method);
    const steps: SimStep[] = [];

    /* ── 1. Client chuẩn bị kết nối ───────────────────────────── */
    steps.push({
      id: 'dns',
      at: 'client',
      kind: 'INTERNAL',
      duration: 900,
      latencyMs: 38,
      title: { vi: 'Phân giải DNS + bắt tay TLS', en: 'DNS lookup + TLS handshake' },
      detail: {
        vi: 'Trước khi byte dữ liệu đầu tiên rời máy, trình duyệt phải biết IP của cuongthai.com (DNS) rồi thoả thuận khoá mã hoá (TLS 1.3). Với keep-alive, chi phí này chỉ trả MỘT lần cho nhiều request sau đó — đây là lý do HTTP/2 và connection pooling quan trọng.',
        en: 'Before a single byte leaves the machine the browser resolves cuongthai.com to an IP (DNS) and negotiates encryption keys (TLS 1.3). With keep-alive this cost is paid once and amortised across later requests — exactly why HTTP/2 and connection pooling matter.',
      },
      nodeStates: { client: 'processing' },
      sfx: 'blip',
      log: { vi: 'DNS 12ms · TLS 1.3 handshake 26ms · reuse=false', en: 'DNS 12ms · TLS 1.3 handshake 26ms · reuse=false' },
    });

    /* ── 2. Request rời client ────────────────────────────────── */
    steps.push({
      id: 'req-out',
      edge: 'e_client_lb',
      kind: method as SimStep['kind'],
      duration: 1200,
      latencyMs: 24,
      packetLabel: `${method} ${route.replace('/api/v1', '')}`,
      title: { vi: `Gửi ${method} ${route}`, en: `Send ${method} ${route}` },
      detail: {
        vi: `Gói tin rời trình duyệt gồm dòng lệnh "${method} ${route} HTTP/1.1", các header (Authorization, Content-Type, Origin) và${body ? ' thân JSON' : ' KHÔNG có thân — GET/DELETE không mang body'}. Toàn bộ được mã hoá trong TLS: người ngồi cùng Wi-Fi chỉ thấy tên miền, không thấy nội dung.`,
        en: `The packet leaving the browser carries the request line "${method} ${route} HTTP/1.1", headers (Authorization, Content-Type, Origin) and${body ? ' a JSON body' : ' NO body — GET/DELETE do not carry one'}. All of it sits inside the TLS tunnel: someone on the same Wi-Fi sees the hostname, never the content.`,
      },
      headers: {
        Host: 'cuongthai.com',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs…',
        'Content-Type': 'application/json',
        Origin: 'https://cuongthai.com',
        'Accept-Encoding': 'gzip, br',
      },
      query: method === 'GET' ? { page: '1', perPage: '20', sort: 'createdAt:desc' } : undefined,
      payload: body ?? undefined,
      nodeStates: { client: 'active', lb: 'waiting' },
      sfx: 'swoosh',
      log: { vi: `→ ${method} ${route}`, en: `→ ${method} ${route}` },
    });

    /* ── 3. Nginx nhận và chuyển tiếp ─────────────────────────── */
    steps.push({
      id: 'proxy',
      at: 'lb',
      kind: 'INTERNAL',
      duration: 850,
      latencyMs: 3,
      title: { vi: 'Nginx gỡ TLS và chọn upstream', en: 'Nginx terminates TLS and picks an upstream' },
      detail: {
        vi: 'Nginx giải mã TLS, thêm header X-Forwarded-For (IP thật của khách) rồi proxy_pass sang container Node đang lắng nghe cổng nội bộ. Đây cũng là nơi áp rate limit và chặn body quá lớn (client_max_body_size) — chặn từ đây rẻ hơn để Node phải xử lý.',
        en: 'Nginx decrypts TLS, appends X-Forwarded-For (the real client IP), then proxy_passes to the Node container on an internal port. It is also where rate limiting and client_max_body_size live — rejecting here is far cheaper than making Node do it.',
      },
      headers: { 'X-Forwarded-For': '113.161.44.9', 'X-Forwarded-Proto': 'https', 'X-Request-Id': 'req_8f21ac' },
      nodeStates: { client: 'idle', lb: 'processing' },
      sfx: 'click',
      teachingNote: {
        vi: 'Dừng ở đây để nói về X-Forwarded-For: nếu app tin header này mà không cấu hình trust proxy đúng, kẻ tấn công có thể giả IP để lách rate limit.',
        en: 'Pause here to discuss X-Forwarded-For: trusting this header without a correct trust-proxy setting lets an attacker spoof their IP and bypass rate limits.',
      },
      log: { vi: 'nginx: upstream=backend:5000 keepalive=on', en: 'nginx: upstream=backend:5000 keepalive=on' },
    });

    steps.push({
      id: 'to-api',
      edge: 'e_lb_api',
      kind: method as SimStep['kind'],
      duration: 900,
      latencyMs: 1,
      packetLabel: 'proxy_pass',
      title: { vi: 'Chuyển tiếp vào tiến trình Node', en: 'Forward into the Node process' },
      detail: {
        vi: 'Chặng này đi qua mạng nội bộ Docker nên gần như không tốn thời gian (<1ms). Nếu bạn thấy độ trễ ở đây tăng vọt, thủ phạm thường là upstream đã hết worker chứ không phải mạng.',
        en: 'This hop rides the internal Docker network, so it costs well under a millisecond. If latency spikes here the culprit is usually an exhausted upstream worker pool, not the network.',
      },
      nodeStates: { lb: 'active', api: 'processing' },
      sfx: 'swoosh',
    });

    /* ── 4. Chuỗi middleware ──────────────────────────────────── */
    steps.push({
      id: 'mw-in',
      edge: 'e_api_mw',
      kind: 'INTERNAL',
      duration: 850,
      title: { vi: 'Vào chuỗi middleware', en: 'Enter the middleware chain' },
      detail: {
        vi: 'Express xử lý request như một dây chuyền: mỗi middleware hoặc gọi next() để đẩy tiếp, hoặc tự trả lời và cắt đứt dây chuyền. Thứ tự đăng ký chính là thứ tự chạy — đặt sai chỗ là nguồn gốc của rất nhiều lỗi khó tìm.',
        en: 'Express treats the request as an assembly line: each middleware either calls next() to pass it along or answers itself and cuts the line short. Registration order IS execution order — mis-ordering it causes a whole class of hard-to-find bugs.',
      },
      nodeStates: { mw: 'processing' },
      sfx: 'blip',
    });

    steps.push({
      id: 'mw-cors',
      at: 'mw',
      kind: 'INTERNAL',
      duration: 1000,
      latencyMs: 1,
      title: { vi: 'CORS — kiểm tra Origin', en: 'CORS — check the Origin' },
      detail: {
        vi: 'CORS là quy tắc của TRÌNH DUYỆT, không phải của server. Server chỉ trả về header Access-Control-Allow-Origin; trình duyệt mới là bên quyết định có cho JavaScript đọc phản hồi hay không. Với request "không đơn giản" (có header Authorization tuỳ biến), trình duyệt gửi thêm một preflight OPTIONS trước.',
        en: 'CORS is a BROWSER rule, not a server rule. The server merely returns Access-Control-Allow-Origin; the browser decides whether JavaScript may read the response. For "non-simple" requests (a custom Authorization header counts) the browser first sends a preflight OPTIONS.',
      },
      headers: {
        'Access-Control-Allow-Origin': 'https://cuongthai.com',
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
      },
      nodeStates: { mw: 'processing' },
      sfx: 'click',
      teachingNote: {
        vi: 'Điểm dừng vàng để giảng CORS: lỗi CORS xảy ra ở trình duyệt SAU KHI server đã xử lý xong — server vẫn ghi log 200, nên đừng tìm lỗi ở log backend.',
        en: 'Prime pause point for CORS: the error happens in the browser AFTER the server finished — the backend still logs a 200, so do not go hunting there.',
      },
    });

    if (code === 401) {
      steps.push({
        id: 'mw-auth-fail',
        at: 'mw',
        kind: 'ERROR',
        duration: 1100,
        latencyMs: 2,
        status: 401,
        title: { vi: 'Xác thực THẤT BẠI — token hết hạn', en: 'Auth FAILED — token expired' },
        detail: {
          vi: 'jwt.verify() ném lỗi TokenExpiredError: trường exp đã ở quá khứ. Dây chuyền dừng ngay tại đây — handler và cơ sở dữ liệu KHÔNG bao giờ được chạm tới. Đây chính là điều khiến 401 rẻ hơn nhiều so với 500.',
          en: 'jwt.verify() throws TokenExpiredError: the exp claim is in the past. The chain stops right here — the handler and the database are never touched. That is exactly why a 401 is far cheaper than a 500.',
        },
        payload: ERROR_BODIES[401],
        nodeStates: { mw: 'error' },
        sfx: 'error',
        log: { vi: 'AUTH FAIL: TokenExpiredError exp=1753600000', en: 'AUTH FAIL: TokenExpiredError exp=1753600000' },
      });
    } else {
      steps.push({
        id: 'mw-auth',
        at: 'mw',
        kind: 'TOKEN',
        duration: 950,
        latencyMs: 2,
        packetLabel: 'JWT verify',
        title: { vi: 'Xác thực JWT', en: 'Verify the JWT' },
        detail: {
          vi: 'Middleware lấy token từ header Authorization, kiểm chữ ký bằng khoá bí mật rồi đọc payload. Không có truy vấn CSDL nào ở bước này — đó là ưu điểm lớn nhất của JWT (không trạng thái) và cũng là nhược điểm: không thể thu hồi token ngay lập tức nếu không thêm một danh sách đen.',
          en: 'The middleware pulls the token from the Authorization header, checks the signature against the secret and reads the payload. No database round trip happens here — JWT\'s greatest strength (statelessness) and its greatest weakness: you cannot revoke a token instantly without adding a denylist.',
        },
        payload: { sub: 1, email: 'cuong@cuongthai.com', role: 'ADMIN', iat: 1753689600, exp: 1753776000 },
        nodeStates: { mw: 'success' },
        sfx: 'lock',
        log: { vi: 'auth ok · user=1 role=ADMIN', en: 'auth ok · user=1 role=ADMIN' },
      });
    }

    if (code === 401) return finishError(steps, 401, method);

    /* ── 5. Validate ──────────────────────────────────────────── */
    if (code === 400) {
      steps.push({
        id: 'mw-valid-fail',
        at: 'mw',
        kind: 'ERROR',
        duration: 1100,
        latencyMs: 1,
        status: 400,
        title: { vi: 'Kiểm tra dữ liệu THẤT BẠI', en: 'Validation FAILED' },
        detail: {
          vi: 'Schema Zod từ chối thân request: title rỗng. Trả 400 ngay tại biên là cách phòng thủ rẻ nhất — dữ liệu bẩn không bao giờ chạm tới tầng nghiệp vụ hay CSDL, nên không có gì phải dọn dẹp về sau.',
          en: 'The Zod schema rejects the body: title is empty. Returning 400 at the boundary is the cheapest possible defence — dirty data never reaches the business layer or the database, so there is nothing to clean up later.',
        },
        payload: ERROR_BODIES[400],
        nodeStates: { mw: 'error' },
        sfx: 'error',
        log: { vi: 'ZodError: title — String must contain at least 3 character(s)', en: 'ZodError: title — String must contain at least 3 character(s)' },
      });
      return finishError(steps, 400, method);
    }

    steps.push({
      id: 'mw-valid',
      at: 'mw',
      kind: 'INTERNAL',
      duration: 850,
      latencyMs: 1,
      title: { vi: 'Kiểm tra & làm sạch dữ liệu', en: 'Validate & sanitise input' },
      detail: {
        vi: body
          ? 'Zod ép kiểu và cắt bỏ mọi trường lạ trong thân request. Nguyên tắc: không bao giờ truyền thẳng req.body xuống Prisma — nếu không, một trường "role":"ADMIN" lọt vào là leo thang đặc quyền.'
          : 'Với GET/DELETE, phần cần kiểm là tham số truy vấn và tham số đường dẫn: page phải là số dương, id phải là số nguyên. Ép kiểu ở đây giúp tầng dưới luôn nhận dữ liệu sạch.',
        en: body
          ? 'Zod coerces types and strips unknown fields from the body. Rule: never pass req.body straight into Prisma — one stray "role":"ADMIN" is a privilege escalation.'
          : 'For GET/DELETE the things to validate are the query and path params: page must be a positive number, id an integer. Coercing here means every layer below receives clean data.',
      },
      nodeStates: { mw: 'success' },
      sfx: 'click',
    });

    steps.push({
      id: 'mw-out',
      edge: 'e_api_mw',
      reverse: true,
      kind: 'INTERNAL',
      duration: 800,
      title: { vi: 'next() — bàn giao cho handler', en: 'next() — hand over to the handler' },
      detail: {
        vi: 'Mọi middleware đã gọi next(). Quyền điều khiển giờ thuộc về hàm xử lý của route.',
        en: 'Every middleware called next(). Control now belongs to the route handler.',
      },
      nodeStates: { mw: 'idle', api: 'processing' },
      sfx: 'blip',
    });

    /* ── 6. Handler + CSDL ────────────────────────────────────── */
    if (code === 500) {
      steps.push({
        id: 'handler-500',
        at: 'api',
        kind: 'ERROR',
        duration: 1200,
        latencyMs: 4,
        status: 500,
        title: { vi: 'Handler ném lỗi chưa bắt', en: 'Handler throws an unhandled error' },
        detail: {
          vi: 'Prisma không lấy được kết nối: pool đã cạn (ECONNREFUSED). Lỗi bay lên error handler toàn cục. Điều BẮT BUỘC ở đây: log kèm requestId nhưng KHÔNG trả stack trace về client — stack là bản đồ chỉ đường cho kẻ tấn công.',
          en: 'Prisma cannot obtain a connection: the pool is exhausted (ECONNREFUSED). The error bubbles up to the global error handler. The non-negotiable rule: log it with a requestId but NEVER return the stack trace to the client — a stack trace is a map for an attacker.',
        },
        payload: ERROR_BODIES[500],
        nodeStates: { api: 'error', db: 'error' },
        sfx: 'error',
        log: { vi: 'ERROR req_8f21ac PrismaClientInitializationError: ECONNREFUSED 5432', en: 'ERROR req_8f21ac PrismaClientInitializationError: ECONNREFUSED 5432' },
        teachingNote: {
          vi: '500 nghĩa là "lỗi của chúng ta", 4xx nghĩa là "lỗi của phía gọi". Phân loại đúng thì biểu đồ cảnh báo mới có ý nghĩa.',
          en: '5xx means "our fault", 4xx means "the caller\'s fault". Classify correctly or your alerting dashboards become meaningless.',
        },
      });
      return finishError(steps, 500, method);
    }

    steps.push({
      id: 'handler',
      at: 'api',
      kind: 'INTERNAL',
      duration: 900,
      latencyMs: 2,
      title: { vi: 'Route handler dựng truy vấn', en: 'Route handler builds the query' },
      detail: {
        vi: `Handler dịch ý định HTTP sang thao tác dữ liệu. ${method} ${route} → ${sqlFor(method)}`,
        en: `The handler translates HTTP intent into a data operation. ${method} ${route} → ${sqlFor(method)}`,
      },
      nodeStates: { api: 'processing' },
      sfx: 'click',
    });

    steps.push({
      id: 'query',
      edge: 'e_api_db',
      kind: 'QUERY',
      duration: 1000,
      latencyMs: 2,
      packetLabel: method === 'GET' ? 'SELECT' : method === 'POST' ? 'INSERT' : method === 'PUT' ? 'UPDATE' : 'DELETE',
      title: { vi: 'Gửi truy vấn xuống PostgreSQL', en: 'Send the query to PostgreSQL' },
      detail: {
        vi: 'Prisma mượn một kết nối rảnh từ pool và gửi câu lệnh đã tham số hoá. Tham số hoá ($1, $2) không chỉ giúp tái dùng execution plan — nó là hàng phòng thủ chính chống SQL injection, vì dữ liệu không bao giờ được ghép chuỗi vào câu lệnh.',
        en: 'Prisma borrows a free connection from the pool and sends the parameterised statement. Parameterisation ($1, $2) does more than enable plan reuse — it is the primary defence against SQL injection, because data is never concatenated into the statement.',
      },
      payload: { sql: sqlFor(method), params: method === 'GET' ? [20] : [42] },
      nodeStates: { api: 'waiting', db: 'processing' },
      sfx: 'swoosh',
    });

    if (code === 404) {
      steps.push({
        id: 'db-empty',
        at: 'db',
        kind: 'CACHE_MISS',
        duration: 1000,
        latencyMs: 9,
        title: { vi: 'CSDL trả về 0 dòng', en: 'The database returns 0 rows' },
        detail: {
          vi: 'Chú ý điểm rất hay nhầm: truy vấn KHÔNG lỗi. Nó chạy thành công và trả về tập rỗng. Việc biến "rỗng" thành 404 là quyết định của tầng ứng dụng, không phải của CSDL.',
          en: 'A commonly confused point: the query did NOT fail. It succeeded and returned an empty set. Turning "empty" into a 404 is an application-layer decision, not a database one.',
        },
        payload: { rows: [], rowCount: 0 },
        nodeStates: { db: 'idle' },
        sfx: 'buzz',
        log: { vi: 'SELECT … WHERE id=42 → 0 rows (7.4ms)', en: 'SELECT … WHERE id=42 → 0 rows (7.4ms)' },
      });
      steps.push({
        id: 'db-empty-back',
        edge: 'e_api_db',
        reverse: true,
        kind: 'ERROR',
        duration: 900,
        title: { vi: 'Handler chuyển tập rỗng thành 404', en: 'The handler maps the empty set to 404' },
        detail: {
          vi: 'if (!post) throw new NotFoundError(). Ánh xạ tường minh như thế này khiến API dễ đoán: client luôn biết 404 = không có tài nguyên, chứ không phải hệ thống hỏng.',
          en: 'if (!post) throw new NotFoundError(). This explicit mapping keeps the API predictable: a client always reads 404 as "resource absent", never as "system broken".',
        },
        status: 404,
        payload: ERROR_BODIES[404],
        nodeStates: { api: 'error' },
        sfx: 'buzz',
      });
      return finishError(steps, 404, method);
    }

    steps.push({
      id: 'db-work',
      at: 'db',
      kind: 'QUERY',
      duration: 1200,
      latencyMs: method === 'GET' ? 8 : 14,
      title: {
        vi: method === 'GET' ? 'Quét chỉ mục và đọc dòng dữ liệu' : 'Ghi vào WAL rồi commit',
        en: method === 'GET' ? 'Index scan, then fetch the rows' : 'Write to the WAL, then commit',
      },
      detail: {
        vi:
          method === 'GET'
            ? 'Bộ tối ưu chọn Index Scan trên created_at, đọc 20 dòng rồi trả về. Nếu cột này không có chỉ mục, kế hoạch sẽ đổi sang Seq Scan và chi phí tăng tuyến tính theo kích thước bảng.'
            : 'PostgreSQL ghi thay đổi vào Write-Ahead Log TRƯỚC, rồi mới sửa các trang dữ liệu. Nhờ trật tự đó, mất điện giữa chừng vẫn khôi phục được — đây là chữ D (Durability) trong ACID.',
        en:
          method === 'GET'
            ? 'The planner picks an Index Scan on created_at, reads 20 rows and returns. Without that index the plan degrades to a Seq Scan and cost grows linearly with table size.'
            : 'PostgreSQL writes the change to the Write-Ahead Log FIRST, and only then modifies the data pages. That ordering is what survives a power cut — the D in ACID.',
      },
      payload: { plan: method === 'GET' ? 'Index Scan using posts_created_at_idx' : 'ModifyTable → WAL flush', rowCount: method === 'GET' ? 20 : 1 },
      nodeStates: { db: 'success' },
      sfx: 'ping',
      log: { vi: `${sqlFor(method).split(' ')[0]} ok · ${method === 'GET' ? '20 rows' : '1 row'} · 8.2ms`, en: `${sqlFor(method).split(' ')[0]} ok · ${method === 'GET' ? '20 rows' : '1 row'} · 8.2ms` },
    });

    steps.push({
      id: 'db-back',
      edge: 'e_api_db',
      reverse: true,
      kind: 'RESPONSE',
      duration: 950,
      latencyMs: 2,
      packetLabel: 'rows',
      title: { vi: 'CSDL trả kết quả về API', en: 'Database returns rows to the API' },
      detail: {
        vi: 'Kết nối được trả lại pool ngay sau khi đọc xong. Quên trả kết nối (rò rỉ) là nguyên nhân kinh điển khiến hệ thống chết cứng dưới tải cao.',
        en: 'The connection returns to the pool the moment the rows are read. Leaking connections instead is the classic reason a service seizes up under load.',
      },
      nodeStates: { db: 'idle', api: 'processing' },
      sfx: 'swoosh',
    });

    /* ── 7. Trả về client ─────────────────────────────────────── */
    steps.push({
      id: 'serialize',
      at: 'api',
      kind: 'RESPONSE',
      duration: 850,
      latencyMs: 3,
      status: code,
      title: { vi: 'Tuần tự hoá JSON + nén', en: 'Serialise JSON + compress' },
      detail: {
        vi: 'Đối tượng JavaScript được chuyển thành chuỗi JSON, nén bằng gzip/brotli rồi gắn header. Đây cũng là chốt chặn cuối để loại bỏ trường nhạy cảm (passwordHash, email nội bộ) — lọc ở tầng serialize an toàn hơn là hy vọng mọi truy vấn đều nhớ select đúng cột.',
        en: 'The JavaScript object becomes a JSON string, gets gzip/brotli compressed and receives its headers. It is also the last checkpoint to strip sensitive fields (passwordHash, internal email) — filtering at serialisation is safer than hoping every query remembered the right select.',
      },
      payload: successBody(method, code),
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Encoding': 'br', 'Cache-Control': method === 'GET' ? 'public, max-age=60' : 'no-store' },
      nodeStates: { api: 'success' },
      sfx: 'click',
    });

    steps.push({
      id: 'res-to-lb',
      edge: 'e_lb_api',
      reverse: true,
      kind: 'RESPONSE',
      duration: 900,
      status: code,
      packetLabel: `${code}`,
      title: { vi: 'Phản hồi quay ra Nginx', en: 'Response travels back to Nginx' },
      detail: {
        vi: 'Nginx có thể thêm header bảo mật (HSTS, X-Content-Type-Options) và ghi access log ở chặng này.',
        en: 'Nginx can attach security headers (HSTS, X-Content-Type-Options) and write the access log at this hop.',
      },
      nodeStates: { api: 'idle', lb: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'res-to-client',
      edge: 'e_client_lb',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1100,
      latencyMs: 22,
      status: code,
      packetLabel: `${code} ${code === 201 ? 'Created' : 'OK'}`,
      title: { vi: `Trình duyệt nhận ${code}`, en: `Browser receives ${code}` },
      detail: {
        vi: `Toàn bộ vòng đời khép lại. ${code === 201 ? 'Mã 201 kèm header Location trỏ tới tài nguyên vừa tạo — đúng chuẩn REST hơn là trả 200 suông.' : 'Mã 200 nghĩa là yêu cầu đã được xử lý và thân phản hồi chứa dữ liệu.'}`,
        en: `The round trip closes. ${code === 201 ? 'A 201 carries a Location header pointing at the freshly created resource — more RESTful than a bare 200.' : 'A 200 means the request was handled and the body carries the data.'}`,
      },
      headers: code === 201 ? { Location: '/api/v1/posts/128', 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      payload: successBody(method, code),
      nodeStates: { lb: 'idle', client: 'success' },
      sfx: 'success',
      log: { vi: `← ${code} ${method} ${route} · 74ms · 2.1 KB`, en: `← ${code} ${method} ${route} · 74ms · 2.1 KB` },
    });

    steps.push({
      id: 'render',
      at: 'client',
      kind: 'RESPONSE',
      duration: 900,
      title: { vi: 'React cập nhật giao diện', en: 'React updates the UI' },
      detail: {
        vi: 'TanStack Query ghi phản hồi vào cache theo query key, React render lại đúng những component đang đọc key đó. Lần gọi tiếp theo trong khoảng staleTime sẽ trả ngay từ bộ nhớ — không có request mạng nào cả.',
        en: 'TanStack Query stores the response under its query key and React re-renders only the components reading that key. The next call inside staleTime is served straight from memory — no network request at all.',
      },
      nodeStates: { client: 'success' },
      sfx: 'ping',
    });

    return steps;
  },
};

/** Đuôi chung cho mọi nhánh lỗi: phản hồi lỗi chạy ngược về client. */
function finishError(steps: SimStep[], code: number, method: string): SimStep[] {
  steps.push({
    id: 'err-to-lb',
    edge: code === 404 || code === 500 ? 'e_lb_api' : 'e_lb_api',
    reverse: true,
    kind: 'ERROR',
    duration: 900,
    status: code,
    packetLabel: `${code}`,
    title: { vi: `Phản hồi lỗi ${code} rời API`, en: `Error ${code} leaves the API` },
    detail: {
      vi: 'Error handler toàn cục của Express bắt lỗi, ánh xạ sang mã HTTP đúng và tạo thân phản hồi thống nhất. Có MỘT định dạng lỗi duy nhất cho toàn API là món quà lớn nhất bạn tặng cho frontend.',
      en: 'Express\'s global error handler catches it, maps it to the right HTTP code and builds a uniform body. One single error shape across the whole API is the biggest gift you can give the frontend.',
    },
    payload: ERROR_BODIES[code],
    nodeStates: { api: 'error', mw: 'idle', lb: 'processing' },
    sfx: 'buzz',
  });
  steps.push({
    id: 'err-to-client',
    edge: 'e_client_lb',
    reverse: true,
    kind: 'ERROR',
    duration: 1050,
    latencyMs: 22,
    status: code,
    packetLabel: `${code}`,
    title: { vi: `Trình duyệt nhận ${code}`, en: `Browser receives ${code}` },
    detail: {
      vi:
        code === 401
          ? 'Axios interceptor bắt 401, thử gọi /auth/refresh một lần rồi phát lại request gốc. Nếu refresh cũng hỏng thì mới đăng xuất — nhờ vậy người dùng không bị đá ra ngoài chỉ vì token vừa hết hạn.'
          : code === 500
            ? 'Client nên hiển thị thông báo thân thiện kèm requestId. Có requestId, người dùng báo lỗi là bạn tìm ra đúng dòng log trong vài giây.'
            : 'Client hiển thị lỗi ngay cạnh trường dữ liệu gây ra nó, thay vì một hộp thoại chung chung.',
      en:
        code === 401
          ? 'The axios interceptor catches the 401, tries /auth/refresh once and replays the original request. Only if the refresh also fails does it log the user out — so nobody gets kicked out merely because a token expired.'
          : code === 500
            ? 'The client should show a friendly message plus the requestId. With that id, a user report maps to the exact log line in seconds.'
            : 'The client renders the error next to the field that caused it rather than in a generic dialog.',
    },
    payload: ERROR_BODIES[code],
    nodeStates: { lb: 'idle', client: 'error' },
    sfx: 'error',
    log: { vi: `← ${code} ${method} · request thất bại`, en: `← ${code} ${method} · request failed` },
  });
  return steps;
}
