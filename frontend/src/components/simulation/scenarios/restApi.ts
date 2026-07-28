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
import { HTTP_STATUSES, STATUS_TYPE_COLORS, STATUS_TYPE_LABELS, getStatus } from '../httpStatus';
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
  400: { error: 'BadRequest', message: 'Thân request không phải JSON hợp lệ', detail: 'Unexpected token } at position 118' },
  401: { error: 'Unauthorized', message: 'Token đã hết hạn hoặc không hợp lệ', code: 'TOKEN_EXPIRED' },
  403: { error: 'Forbidden', message: 'Bài viết này không thuộc về bạn', requiredRole: 'OWNER', yourRole: 'USER' },
  404: { error: 'NotFound', message: 'Không tìm thấy bài viết với id = 42' },
  409: { error: 'Conflict', message: 'Slug "hoc-nodejs-30-ngay" đã tồn tại', constraint: 'posts_slug_key' },
  422: {
    error: 'UnprocessableEntity',
    message: 'Dữ liệu đúng định dạng nhưng vi phạm quy tắc nghiệp vụ',
    issues: [{ field: 'publishedAt', rule: 'must_be_after', other: 'createdAt' }],
  },
  429: { error: 'TooManyRequests', message: 'Vượt quá 100 request/phút', retryAfter: 23 },
  500: { error: 'InternalServerError', message: 'Kết nối tới cơ sở dữ liệu bị từ chối', requestId: 'req_8f21ac' },
  502: { error: 'BadGateway', message: 'Không kết nối được tới upstream backend:5000' },
  504: { error: 'GatewayTimeout', message: 'Upstream không phản hồi trong 60 giây' },
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
  lesson: {
    course: 'nodejs',
    code: '6.1',
    slug: 'nodejs-6-1-tai-nguyen-phuong-thuc',
    title: { vi: 'Tài nguyên, phương thức, và REST thật sự là gì', en: 'Resources, methods, and what REST actually is' },
  },
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
      // Sinh thẳng từ danh mục HTTP: thêm mã mới ở `httpStatus.ts` là bảng
      // chọn tự có thêm nút, đúng màu, đúng nhóm, đúng chú giải.
      choices: HTTP_STATUSES.map((s) => ({
        value: String(s.code),
        label: s.short,
        fullLabel: s.label,
        color: STATUS_TYPE_COLORS[s.type],
        hint: s.note,
        group: STATUS_TYPE_LABELS[s.type],
      })),
    },
  ],

  build({ method = 'GET', status = '200' }) {
    const code = Number(status);
    // `stage` nói mã này phát sinh ở CHẶNG nào — đây là thứ khiến hoạt cảnh
    // trung thực: 429 chết ngay ở Nginx, 409 phải đi tới tận CSDL mới lộ ra.
    const stage = getStatus(code)?.stage ?? 'complete';
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

    /* ── 3a. Nhánh chết ngay tại biên: 429 · 502 · 504 ─────────
       Ba mã này có chung một đặc điểm quan trọng: tiến trình Node KHÔNG hề
       chạy một dòng code nào. Ai đi tìm nguyên nhân trong log ứng dụng sẽ
       không thấy gì cả — phải xem log của Nginx. */
    if (stage === 'edge') {
      if (code === 429) {
        steps.push({
          id: 'edge-429',
          at: 'lb',
          kind: 'ERROR',
          duration: 1300,
          latencyMs: 0.4,
          status: 429,
          title: { vi: 'Vượt hạn mức — chặn tại biên', en: 'Over the limit — rejected at the edge' },
          detail: {
            vi: 'Nginx đếm số request theo khoá (thường là IP) và từ chối khi vượt ngưỡng. Đây là lời từ chối RẺ NHẤT có thể: chưa tốn một chu kỳ CPU nào của Node, chưa mượn một kết nối CSDL nào. Phải trả kèm header Retry-After để client biết chờ bao lâu — thiếu nó thì client sẽ thử lại ngay và làm mọi thứ tệ hơn.',
            en: 'Nginx counts requests per key (usually the IP) and refuses past the threshold. This is the CHEAPEST possible rejection: not one CPU cycle of Node, not one database connection borrowed. Always return a Retry-After header so the client knows how long to wait — without it, clients retry immediately and make things worse.',
          },
          payload: ERROR_BODIES[429],
          headers: { 'Retry-After': '23', 'X-RateLimit-Limit': '100', 'X-RateLimit-Remaining': '0' },
          nodeStates: { lb: 'error', api: 'idle' },
          sfx: 'error',
          log: { vi: 'limiting requests, excess: 12 by zone "api" · client: 113.161.44.9', en: 'limiting requests, excess: 12 by zone "api" · client: 113.161.44.9' },
          teachingNote: {
            vi: 'Khoá đếm phải lấy phần tử CUỐI của X-Forwarded-For (do proxy tin cậy ghi). Lấy phần tử đầu là kẻ tấn công tự bịa IP và lách qua — dự án này đã dính đúng lỗi đó.',
            en: 'Key the counter on the LAST X-Forwarded-For entry, the one your trusted proxy wrote. Keying on the first lets an attacker spoof an IP and walk straight through — this project once shipped exactly that bug.',
          },
        });
      } else if (code === 502) {
        steps.push({
          id: 'edge-502',
          at: 'lb',
          kind: 'ERROR',
          duration: 1400,
          latencyMs: 3,
          status: 502,
          title: { vi: 'Không kết nối được upstream — 502', en: 'Cannot reach the upstream — 502' },
          detail: {
            vi: 'Nginx gõ cửa backend:5000 và nhận Connection refused. Container backend đã chết, đang khởi động lại, hoặc vừa bị đổi trong lúc deploy. Điểm nhận dạng: 502 xuất hiện GẦN NHƯ TỨC THÌ (vài mili giây) — nếu lỗi trả về nhanh, đó là 502 chứ không phải quá tải.',
            en: 'Nginx knocks on backend:5000 and gets Connection refused. The backend container is dead, restarting, or was just swapped mid-deploy. The telltale sign: a 502 comes back ALMOST INSTANTLY (milliseconds) — a fast failure means 502, not overload.',
          },
          payload: ERROR_BODIES[502],
          nodeStates: { lb: 'error', api: 'error' },
          sfx: 'error',
          log: { vi: 'connect() failed (111: Connection refused) upstream: "http://backend:5000/"', en: 'connect() failed (111: Connection refused) upstream: "http://backend:5000/"' },
          teachingNote: {
            vi: 'Đúng cảnh đã xảy ra khi deploy trang này: nginx vào vòng Restarting vì backend chưa kịp healthy. Vài giây sau tự khỏi. Đó là lý do deploy phải có health check trước khi chuyển lưu lượng.',
            en: 'Exactly what happened while deploying this very page: nginx entered a restart loop because the backend was not healthy yet, then recovered seconds later. That is why a deploy must gate traffic behind a health check.',
          },
        });
      } else {
        steps.push({
          id: 'edge-504',
          at: 'lb',
          kind: 'ERROR',
          duration: 1900,
          latencyMs: 60000,
          status: 504,
          title: { vi: 'Upstream quá chậm — Nginx bỏ cuộc sau 60 giây', en: 'Upstream too slow — Nginx gives up after 60s' },
          detail: {
            vi: 'Khác 502 ở chỗ: backend VẪN SỐNG và VẪN ĐANG LÀM. Nginx chỉ hết kiên nhẫn và cắt kết nối. Đây là điều nguy hiểm nhất của 504 — client nhận lỗi và thường sẽ thử lại, trong khi lần chạy đầu vẫn đang xử lý ở phía sau. Với thao tác trừ tiền thì đó là trừ hai lần. Muốn an toàn thì thao tác phải bất biến khi lặp.',
            en: 'Unlike a 502, the backend is ALIVE and STILL WORKING. Nginx merely ran out of patience and cut the connection. That is what makes 504 dangerous — the client sees an error and usually retries while the first attempt is still running behind the scenes. On a payment operation that is a double charge. The only safe answer is idempotency.',
          },
          payload: ERROR_BODIES[504],
          nodeStates: { lb: 'error', api: 'processing' },
          sfx: 'error',
          log: { vi: 'upstream timed out (110: Connection timed out) while reading response header', en: 'upstream timed out (110: Connection timed out) while reading response header' },
          teachingNote: {
            vi: 'Nối sang kịch bản "Spam click": 504 là cỗ máy sinh ra request trùng lặp. Ai chưa có idempotency thì mỗi lần 504 là một lần rủi ro trừ tiền hai lượt.',
            en: 'Bridge to the "Double-submit" scenario: a 504 is a duplicate-request factory. Without idempotency, every 504 is a chance to charge twice.',
          },
        });
      }

      steps.push({
        id: 'edge-res',
        edge: 'e_client_lb',
        reverse: true,
        kind: 'ERROR',
        duration: 1100,
        latencyMs: 22,
        status: code,
        packetLabel: `${code}`,
        title: { vi: `Client nhận ${code} — API chưa từng biết có request này`, en: `Client receives ${code} — the API never learned this happened` },
        detail: {
          vi: 'Hãy nhìn kỹ sơ đồ: KHÔNG có mũi tên nào đi tới Express API. Đây là chi tiết quyết định khi đi tìm nguyên nhân — log ứng dụng sẽ hoàn toàn im lặng, mọi biểu đồ APM sẽ báo bình thường, vì với ứng dụng thì request này chưa bao giờ tồn tại. Chỗ cần soi là log của Nginx.',
          en: 'Look at the diagram: no arrow ever reaches Express API. This detail decides your debugging — the application log stays completely silent and every APM chart looks healthy, because as far as the app is concerned this request never existed. The place to look is the Nginx log.',
        },
        payload: ERROR_BODIES[code],
        nodeStates: { lb: 'idle', client: 'error' },
        sfx: 'buzz',
      });
      return steps;
    }

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

    if (stage === 'auth') {
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

    if (stage === 'auth') return finishError(steps, code, method);

    /* ── 5a. Phân quyền — nơi 403 phát sinh ───────────────────── */
    if (stage === 'authz') {
      steps.push({
        id: 'mw-authz-fail',
        at: 'mw',
        kind: 'ERROR',
        duration: 1300,
        latencyMs: 6,
        status: 403,
        title: { vi: 'Xác thực XONG, nhưng không đủ quyền — 403', en: 'Authenticated fine, but not permitted — 403' },
        detail: {
          vi: 'Đây là chỗ phân biệt hai mã bị nhầm nhiều nhất. 401 nghĩa là "tôi không biết bạn là ai" — đưa token vào là xong. 403 nghĩa là "tôi biết chính xác bạn là ai, và bạn không được làm việc này" — đưa lại token cũng vô ích. Trả 401 cho tình huống 403 khiến client rơi vào vòng lặp refresh token vô nghĩa.',
          en: 'This is the pair people confuse most. A 401 says "I do not know who you are" — send a token and we are done. A 403 says "I know exactly who you are, and you may not do this" — resending the token changes nothing. Returning 401 where 403 belongs traps clients in a pointless token-refresh loop.',
        },
        payload: ERROR_BODIES[403],
        nodeStates: { mw: 'error' },
        sfx: 'error',
        log: { vi: 'authz denied · user=1 · resource=post:42 owner=9 · action=update', en: 'authz denied · user=1 · resource=post:42 owner=9 · action=update' },
        teachingNote: {
          vi: 'Kiểm quyền phải hỏi "tài nguyên NÀY có phải của bạn không", không chỉ "vai trò của bạn là gì". Bỏ qua vế đầu chính là lỗ hổng IDOR — đúng loại đã vá trong socket của dự án này.',
          en: 'An authorisation check must ask "is THIS resource yours", not merely "what is your role". Skipping the first half is exactly the IDOR class of bug — the same one patched in this project\'s socket layer.',
        },
      });
      return finishError(steps, 403, method);
    }

    steps.push({
      id: 'mw-authz',
      at: 'mw',
      kind: 'INTERNAL',
      duration: 850,
      latencyMs: 5,
      title: { vi: 'Phân quyền — tài nguyên này có phải của bạn?', en: 'Authorisation — is this resource yours?' },
      detail: {
        vi: 'Xác thực trả lời "bạn là ai", phân quyền trả lời "bạn được làm gì với đúng bản ghi này". Hai câu hỏi khác nhau và phải hỏi cả hai. Bước này thường cần một truy vấn nhỏ để biết chủ sở hữu của tài nguyên.',
        en: 'Authentication answers "who are you"; authorisation answers "what may you do with this exact record". Two different questions, both mandatory. This step usually needs a small query to learn who owns the resource.',
      },
      nodeStates: { mw: 'success' },
      sfx: 'click',
    });

    /* ── 5b. Kiểm dữ liệu — nơi 400 và 422 phát sinh ──────────── */
    if (stage === 'validate') {
      const is422 = code === 422;
      steps.push({
        id: 'mw-valid-fail',
        at: 'mw',
        kind: 'ERROR',
        duration: 1300,
        latencyMs: 1,
        status: code,
        title: {
          vi: is422 ? 'Cú pháp đúng nhưng NGHĨA sai — 422' : 'Không parse nổi thân request — 400',
          en: is422 ? 'Syntax fine, MEANING wrong — 422' : 'Body will not parse — 400',
        },
        detail: {
          vi: is422
            ? 'JSON hợp lệ, kiểu dữ liệu đúng, email đúng định dạng — nhưng publishedAt lại nằm TRƯỚC createdAt. Đây là vi phạm quy tắc nghiệp vụ, không phải lỗi cú pháp. Phân biệt được 400 và 422 giúp frontend biết phải làm gì: 400 là lỗi lập trình cần sửa code, 422 là lỗi người dùng cần hiển thị ngay cạnh ô nhập.'
            : 'Server còn chưa đọc nổi request: chuỗi JSON bị thừa một dấu ngoặc. Không có trường nào để kiểm, không có quy tắc nào để áp — mọi thứ dừng ở bước phân tích cú pháp. Đây gần như luôn là lỗi của lập trình viên phía client, không phải của người dùng.',
          en: is422
            ? 'The JSON is valid, the types are right, the email is well-formed — but publishedAt falls BEFORE createdAt. That is a business-rule violation, not a syntax error. Separating 400 from 422 tells the frontend what to do: a 400 is a bug to fix in code, a 422 is a message to show next to the offending field.'
            : 'The server could not even read the request: the JSON has one bracket too many. There are no fields to validate and no rules to apply — everything stops at parse time. This is almost always a client-side programming bug rather than a user mistake.',
        },
        payload: ERROR_BODIES[code],
        nodeStates: { mw: 'error' },
        sfx: 'error',
        log: is422
          ? { vi: 'ZodError: publishedAt — must be after createdAt', en: 'ZodError: publishedAt — must be after createdAt' }
          : { vi: 'SyntaxError: Unexpected token } in JSON at position 118', en: 'SyntaxError: Unexpected token } in JSON at position 118' },
        teachingNote: is422
          ? {
              vi: 'Quy ước thực dụng: 400 = "tôi không hiểu bạn nói gì", 422 = "tôi hiểu, nhưng điều bạn nói không hợp lệ". Nhiều framework gộp cả hai vào 400 — gộp thì mất thông tin.',
              en: 'A practical convention: 400 = "I do not understand you", 422 = "I understand, and what you said is not allowed". Many frameworks collapse both into 400 — and lose information doing so.',
            }
          : undefined,
      });
      return finishError(steps, code, method);
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

    /* ── 5c. Nhánh 304: đi hết chuỗi rồi phát hiện không cần gửi lại ── */
    if (stage === 'conditional') {
      steps.push({
        id: 'etag-check',
        edge: 'e_api_db',
        kind: 'QUERY',
        duration: 1100,
        latencyMs: 3,
        packetLabel: 'SELECT updated_at',
        title: { vi: 'So ETag của client với bản trên server', en: 'Compare the client ETag against the server' },
        detail: {
          vi: 'Client gửi kèm If-None-Match: "a1b2c3" — đó là ETag của bản nó đang giữ trong bộ đệm. Server chỉ cần biết ETag hiện tại, nên truy vấn ở đây rất nhẹ: lấy updated_at chứ không lấy toàn bộ nội dung. Lưu ý trung thực: 304 KHÔNG miễn phí — vẫn tốn một lượt đi về và một truy vấn nhỏ. Muốn miễn phí hẳn thì phải đệm ETag ở tầng CDN.',
          en: 'The client sends If-None-Match: "a1b2c3" — the ETag of the copy in its cache. The server only needs the current ETag, so this query is cheap: fetch updated_at, not the whole row. An honest caveat: a 304 is NOT free — it still costs a round trip and a small query. Making it genuinely free means caching the ETag at the CDN tier.',
        },
        payload: { clientETag: '"a1b2c3"', serverETag: '"a1b2c3"', match: true },
        headers: { 'If-None-Match': '"a1b2c3"' },
        nodeStates: { db: 'processing' },
        sfx: 'blip',
      });
      steps.push({
        id: 'not-modified',
        edge: 'e_api_db',
        reverse: true,
        kind: 'CACHE_HIT',
        duration: 1200,
        latencyMs: 1,
        status: 304,
        title: { vi: '304 — không gửi lại nội dung', en: '304 — do not resend the payload' },
        detail: {
          vi: 'Nội dung không đổi nên server trả 304 với thân RỖNG. Bản gốc nặng 2,1 KB; phản hồi 304 chỉ khoảng 180 byte header. Trình duyệt tự lấy bản trong bộ đệm ra dùng và người dùng thấy trang hiện ngay lập tức. Đây là cơ chế im lặng đứng sau cảm giác "vào lại trang thì nhanh hẳn".',
          en: 'Nothing changed, so the server answers 304 with an EMPTY body. The original payload is 2.1 KB; the 304 is roughly 180 bytes of headers. The browser pulls its cached copy and the page appears instantly. This is the quiet mechanism behind "revisiting a page feels much faster".',
        },
        payload: undefined,
        nodeStates: { db: 'idle', api: 'success' },
        sfx: 'ping',
        teachingNote: {
          vi: 'Phân biệt hai kiểu đệm: max-age là "đừng hỏi lại trong N giây" (không có request nào cả), còn ETag/304 là "cứ hỏi, nhưng tôi sẽ không gửi lại nếu chưa đổi". Dùng cả hai mới đủ.',
          en: 'Two different caching modes: max-age says "do not even ask for N seconds" (no request at all), while ETag/304 says "do ask, but I will not resend unless it changed". A good setup uses both.',
        },
      });
      steps.push({
        id: 'res-304-lb',
        edge: 'e_lb_api',
        reverse: true,
        kind: 'CACHE_HIT',
        duration: 900,
        status: 304,
        packetLabel: '304 (180 B)',
        title: { vi: 'Phản hồi tí hon quay ra biên', en: 'A tiny response heads back to the edge' },
        detail: {
          vi: 'So sánh trực tiếp: 2,1 KB so với 180 byte — tiết kiệm khoảng 91% băng thông cho mỗi lượt tải lại. Nhân với lượng truy cập thật thì đây là khoản tiết kiệm lớn nhất mà một dòng cấu hình mang lại.',
          en: 'Direct comparison: 2.1 KB versus 180 bytes — about 91% of the bandwidth saved on every reload. Multiplied by real traffic, this is the largest saving a single line of configuration can buy.',
        },
        nodeStates: { api: 'idle', lb: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'res-304-client',
        edge: 'e_client_lb',
        reverse: true,
        kind: 'CACHE_HIT',
        duration: 1100,
        latencyMs: 21,
        status: 304,
        packetLabel: '304 Not Modified',
        title: { vi: 'Trình duyệt dùng lại bản trong bộ đệm', en: 'The browser reuses its cached copy' },
        detail: {
          vi: 'Với JavaScript ở tầng ứng dụng, 304 gần như vô hình: fetch/axios vẫn trả về dữ liệu bình thường vì trình duyệt đã ghép bản đệm vào. Bạn chỉ thấy nó khi mở tab Network và nhìn cột Size ghi "(disk cache)".',
          en: 'From application JavaScript a 304 is nearly invisible: fetch and axios still hand you the data, because the browser spliced in its cached copy. You only notice it in the Network tab, where Size reads "(disk cache)".',
        },
        nodeStates: { lb: 'idle', client: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── 6. Handler + CSDL ────────────────────────────────────── */
    if (stage === 'handler') {
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
      return finishError(steps, code, method);
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

    if (stage === 'database' && code === 409) {
      steps.push({
        id: 'db-conflict',
        at: 'db',
        kind: 'ERROR',
        duration: 1400,
        latencyMs: 11,
        status: 409,
        title: { vi: 'Ràng buộc UNIQUE chặn lại — 409', en: 'A UNIQUE constraint blocks it — 409' },
        detail: {
          vi: 'PostgreSQL ném lỗi 23505: slug "hoc-nodejs-30-ngay" đã tồn tại. Điểm quan trọng về mặt thiết kế: ĐỪNG kiểm "đã tồn tại chưa" bằng một câu SELECT rồi mới INSERT — giữa hai câu lệnh đó có khe hở, và hai request song song sẽ cùng thấy "chưa có" rồi cùng ghi. Hãy cứ INSERT và bắt lỗi 23505. Ràng buộc trong CSDL là trọng tài duy nhất không bao giờ bị đua qua mặt.',
          en: 'PostgreSQL raises 23505: the slug "hoc-nodejs-30-ngay" already exists. The design point that matters: do NOT check for existence with a SELECT and then INSERT — there is a gap between those statements, and two concurrent requests will both see "absent" and both write. Just INSERT and catch 23505. A database constraint is the only referee that cannot be raced.',
        },
        payload: { pgCode: '23505', constraint: 'posts_slug_key', detail: 'Key (slug)=(hoc-nodejs-30-ngay) already exists.' },
        nodeStates: { db: 'error' },
        sfx: 'error',
        log: { vi: 'ERROR: duplicate key value violates unique constraint "posts_slug_key"', en: 'ERROR: duplicate key value violates unique constraint "posts_slug_key"' },
        teachingNote: {
          vi: 'Prisma trả mã P2002 cho tình huống này. Bắt đúng mã đó và ánh xạ sang 409 kèm tên trường bị trùng — client mới hiển thị được lỗi ngay cạnh ô nhập.',
          en: 'Prisma surfaces this as P2002. Catch that code and map it to a 409 that names the conflicting field — only then can the client show the error next to the right input.',
        },
      });
      steps.push({
        id: 'db-conflict-back',
        edge: 'e_api_db',
        reverse: true,
        kind: 'ERROR',
        duration: 900,
        status: 409,
        packetLabel: '23505',
        title: { vi: 'Giao dịch tự huỷ, không dòng nào được ghi', en: 'The transaction rolls back, nothing is written' },
        detail: {
          vi: 'Tính nguyên tử của giao dịch bảo đảm không có bản ghi nửa vời nào sót lại. 409 là mã ĐÚNG ở đây: không phải lỗi cú pháp (400), không phải thiếu quyền (403) — mà là trạng thái hiện tại của dữ liệu không cho phép thao tác này.',
          en: 'Transaction atomicity guarantees no half-written row survives. 409 is the right code here: not a syntax problem (400), not a permission problem (403) — the current state of the data simply does not allow this operation.',
        },
        payload: ERROR_BODIES[409],
        nodeStates: { api: 'error' },
        sfx: 'buzz',
      });
      return finishError(steps, 409, method);
    }

    if (stage === 'database') {
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
      payload: code === 204 ? undefined : successBody(method, code),
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Encoding': 'br', 'Cache-Control': method === 'GET' ? 'public, max-age=60' : 'no-store', ETag: '"a1b2c3"' },
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
      packetLabel: `${code} ${code === 201 ? 'Created' : code === 204 ? 'No Content' : 'OK'}`,
      title: { vi: `Trình duyệt nhận ${code}`, en: `Browser receives ${code}` },
      detail: {
        vi:
          code === 201
            ? 'Mã 201 phải kèm header Location trỏ tới tài nguyên vừa tạo. Nhờ đó client biết đường dẫn của thứ nó vừa sinh ra mà không phải đoán hay gọi thêm một request nữa.'
            : code === 204
              ? 'Mã 204 nghĩa là "xong rồi, và không có gì để trả lại". Thân phản hồi RỖNG HOÀN TOÀN — kèm body vào là sai chuẩn và nhiều client sẽ không thèm đọc. Đây là mã đúng cho DELETE, hoặc cho PUT khi bạn không muốn trả lại bản ghi.'
              : 'Mã 200 nghĩa là yêu cầu đã được xử lý và thân phản hồi chứa dữ liệu.',
        en:
          code === 201
            ? 'A 201 must carry a Location header pointing at the freshly created resource, so the client learns the path of what it just created without guessing or issuing another request.'
            : code === 204
              ? 'A 204 means "done, and there is nothing to hand back". The body is COMPLETELY empty — attaching one violates the spec and many clients will not read it anyway. This is the right answer for DELETE, or for a PUT where you choose not to echo the record.'
              : 'A 200 means the request was handled and the body carries the data.',
      },
      headers:
        code === 201
          ? { Location: '/api/v1/posts/128', 'Content-Type': 'application/json' }
          : code === 204
            ? { 'Content-Length': '0' }
            : { 'Content-Type': 'application/json' },
      // 204 KHÔNG có thân phản hồi — bảng soi phải trống đúng như thực tế.
      payload: code === 204 ? undefined : successBody(method, code),
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
