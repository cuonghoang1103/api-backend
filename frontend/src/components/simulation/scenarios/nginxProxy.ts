/**
 * VPS & Docker · Nginx đứng trước mọi thứ — và cái giá của việc đứng trước.
 *
 * Trên một VPS, Nginx là thứ duy nhất mở ra Internet. Nó nhận TLS, cắt lớp mã
 * hoá, rồi chuyển tiếp HTTP thường vào mạng nội bộ của Docker. Backend không
 * bao giờ nhìn thấy chứng chỉ, không bao giờ nhìn thấy cổng 443.
 *
 * Nhưng khi một máy chủ đứng CHEN VÀO GIỮA, mọi thứ nó không chuyển tiếp sẽ bị
 * mất. Địa chỉ IP là ví dụ đắt nhất: sau khi qua proxy, mọi request đều mang IP
 * nguồn là chính Nginx. Ứng dụng nhìn vào `req.ip` và thấy MỘT địa chỉ duy nhất
 * cho toàn bộ người dùng trên đời.
 *
 * Với rate limit thì đó là thảm hoạ: bộ đếm gom chung tất cả mọi người vào một
 * khoá, ngưỡng bị chạm trong vài giây, và cả website trả 429 — trông y hệt một
 * lần sập. Chuyện này đã xảy ra thật trên cuongthai.com.
 *
 * Phần cuối kịch bản nói tiếp một bẫy ngược lại, tinh vi hơn: tin `X-Forwarded-For`
 * một cách mù quáng thì kẻ tấn công tự ghi header đó và vượt rate limit dễ dàng.
 * Cách đúng là lấy IP theo VỊ TRÍ tính từ proxy tin cậy, không phải lấy phần tử
 * đầu tiên của chuỗi.
 */

import { Router } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'user',
    label: 'Người dùng',
    kind: 'client' as const,
    x: 95,
    y: 190,
    sublabel: { vi: '203.0.113.7', en: '203.0.113.7' },
  },
  {
    id: 'user2',
    label: 'Người dùng khác',
    kind: 'client' as const,
    x: 95,
    y: 420,
    sublabel: { vi: '198.51.100.42', en: '198.51.100.42' },
  },
  {
    id: 'nginx',
    label: 'Nginx',
    kind: 'edge' as const,
    x: 380,
    y: 300,
    sublabel: { vi: ':443 TLS · reverse proxy', en: ':443 TLS · reverse proxy' },
  },
  {
    id: 'backend',
    label: 'backend',
    kind: 'server' as const,
    x: 660,
    y: 190,
    sublabel: { vi: 'Express :3001', en: 'Express :3001' },
  },
  {
    id: 'frontend',
    label: 'frontend',
    kind: 'server' as const,
    x: 660,
    y: 420,
    sublabel: { vi: 'Next.js :3000', en: 'Next.js :3000' },
  },
  {
    id: 'limiter',
    label: 'Rate limiter',
    kind: 'gateway' as const,
    x: 900,
    y: 190,
    sublabel: { vi: 'Đếm theo IP', en: 'Counts per IP' },
  },
];

const edges = [
  { id: 'e_u_nginx', from: 'user', to: 'nginx' },
  { id: 'e_u2_nginx', from: 'user2', to: 'nginx' },
  { id: 'e_nginx_be', from: 'nginx', to: 'backend' },
  { id: 'e_nginx_fe', from: 'nginx', to: 'frontend' },
  { id: 'e_be_limit', from: 'backend', to: 'limiter' },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — ĐƯỜNG ĐI BÌNH THƯỜNG: TLS VÀ ĐỊNH TUYẾN
   ──────────────────────────────────────────────────────────── */

function buildRouting(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'tls',
    title: { vi: 'Bắt tay TLS dừng lại ở Nginx', en: 'The TLS handshake stops at Nginx' },
    detail: {
      vi: 'Trình duyệt mở kết nối tới cổng 443 và thoả thuận khoá mã hoá với Nginx — chứng chỉ nằm ở đây, khoá riêng cũng nằm ở đây, và không đi đâu xa hơn. Thuật ngữ gọi là *TLS termination*: lớp mã hoá bị cắt tại biên, phần còn lại đi trong mạng nội bộ.',
      en: 'The browser opens port 443 and negotiates encryption keys with Nginx — the certificate lives here, the private key lives here, and neither goes further. The term is *TLS termination*: encryption ends at the edge, the rest travels on the internal network.',
    },
    duration: 2700,
    edge: 'e_u_nginx',
    kind: 'GET',
    nodeStates: { user: 'active', nginx: 'processing' },
    packetLabel: 'TLS 1.3 · :443',
    sfx: 'lock',
    log: { vi: 'TLSv1.3 · chứng chỉ Let’s Encrypt · SNI cuongthai.com', en: 'TLSv1.3 · Let’s Encrypt cert · SNI cuongthai.com' },
  });

  push({
    id: 'route',
    title: { vi: 'Định tuyến theo đường dẫn: /api đi backend, còn lại đi frontend', en: 'Path routing: /api to the backend, everything else to the frontend' },
    detail: {
      vi: 'Một tên miền, hai ứng dụng. Khối `location /api/` chuyển tiếp sang `backend:3001`, khối `location /` sang `frontend:3000`. Người dùng chỉ thấy `cuongthai.com` — họ không có cách nào biết bên trong là hai container riêng biệt, và đó chính là mục đích.',
      en: 'One domain, two applications. The `location /api/` block proxies to `backend:3001`, the `location /` block to `frontend:3000`. Users only ever see `cuongthai.com` — they have no way to tell there are two separate containers inside, which is the whole point.',
    },
    duration: 2800,
    edge: 'e_nginx_be',
    kind: 'GET',
    nodeStates: { nginx: 'success', backend: 'processing' },
    packetLabel: 'proxy_pass :3001',
    sfx: 'swoosh',
    log: { vi: 'location /api/ → http://backend:3001', en: 'location /api/ → http://backend:3001' },
  });

  push({
    id: 'internal',
    title: { vi: 'Bên trong mạng Docker là HTTP thường, và như thế là đúng', en: 'Inside the Docker network it is plain HTTP, and that is correct' },
    detail: {
      vi: 'Backend nghe cổng 3001 không mã hoá. Nghe có vẻ đáng lo cho tới khi nhớ rằng cổng đó KHÔNG được ánh xạ ra ngoài — nó chỉ tồn tại trên mạng bridge nội bộ. Mã hoá lại lần nữa ở đây chỉ tốn CPU và thêm một bộ chứng chỉ phải gia hạn, đổi lại gần như không có thêm an toàn.',
      en: 'The backend listens on port 3001 unencrypted. That sounds alarming until you remember the port is NOT published — it exists only on the internal bridge network. Re-encrypting here costs CPU and adds another certificate to renew, in exchange for almost no additional safety.',
    },
    duration: 2900,
    at: 'backend',
    nodeStates: { backend: 'success' },
    sfx: 'blip',
    teachingNote: {
      vi: 'Nhấn mạnh: `ports:` trong compose là thứ quyết định cổng nào ra Internet — không phải `EXPOSE` trong Dockerfile.',
      en: 'Stress: `ports:` in compose decides what reaches the Internet — not `EXPOSE` in the Dockerfile.',
    },
  });

  push({
    id: 'headers',
    title: { vi: 'Nginx phải TỰ chuyển tiếp thông tin gốc', en: 'Nginx has to forward the original context itself' },
    detail: {
      vi: 'Sau khi qua proxy, backend chỉ thấy một kết nối đến từ Nginx. Giao thức gốc (https), tên miền gốc, và địa chỉ IP của người dùng — cả ba đều biến mất trừ khi Nginx chép chúng vào header: `X-Forwarded-For`, `X-Forwarded-Proto`, `Host`. Quên một dòng là mất một mảnh sự thật, và mảnh mất thường chỉ lộ ra ở tính năng nào đó rất xa.',
      en: 'After proxying, the backend only sees a connection from Nginx. The original scheme (https), the original host, and the user’s IP address all vanish unless Nginx copies them into headers: `X-Forwarded-For`, `X-Forwarded-Proto`, `Host`. Forget one line and you lose a piece of the truth — and the missing piece usually surfaces in some distant feature.',
    },
    duration: 3100,
    edge: 'e_nginx_be',
    kind: 'TOKEN',
    nodeStates: { nginx: 'active' },
    packetLabel: 'X-Forwarded-For',
    sfx: 'ping',
    log: { vi: 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;', en: 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' },
  });

  push({
    id: 'ws',
    title: { vi: 'WebSocket cần hai dòng riêng, không thì im lặng thất bại', en: 'WebSockets need two extra lines, or they fail silently' },
    detail: {
      vi: 'Nâng cấp lên WebSocket là một cơ chế của HTTP/1.1 và Nginx không tự chuyển tiếp nó: phải khai `proxy_http_version 1.1`, `Upgrade` và `Connection`. Thiếu thì bắt tay trả về 200 thường thay vì 101, client thử lại mãi, và tính năng thời gian thực "không chạy trên sản xuất mà máy local vẫn ổn".',
      en: 'The WebSocket upgrade is an HTTP/1.1 mechanism and Nginx does not forward it by default: you must set `proxy_http_version 1.1`, plus the `Upgrade` and `Connection` headers. Without them the handshake returns a plain 200 instead of 101, the client retries forever, and realtime "works locally but not in production".',
    },
    duration: 2900,
    edge: 'e_nginx_fe',
    kind: 'EVENT',
    nodeStates: { frontend: 'success' },
    packetLabel: '101 Switching',
    status: 101,
    sfx: 'stream',
    log: { vi: 'proxy_set_header Upgrade $http_upgrade;', en: 'proxy_set_header Upgrade $http_upgrade;' },
  });

  push({
    id: 'body',
    title: { vi: 'Và giới hạn kích thước tải lên nằm ở HAI nơi', en: 'And the upload size limit lives in TWO places' },
    detail: {
      vi: '`client_max_body_size` của Nginx mặc định là 1 MB. Ứng dụng cho phép tải video 100 MB cũng vô ích: Nginx chặn trước và trả 413 mà request không bao giờ tới được backend. Nâng giới hạn ở tầng ứng dụng mà quên tầng proxy là một trong những lỗi tốn thời gian nhất, vì log ứng dụng hoàn toàn trống.',
      en: 'Nginx’s `client_max_body_size` defaults to 1 MB. It does not matter that your app accepts 100 MB videos: Nginx rejects first with a 413 and the request never reaches the backend. Raising the limit in the app while forgetting the proxy is one of the most time-consuming bugs, because the application log is completely empty.',
    },
    duration: 2900,
    at: 'nginx',
    nodeStates: { nginx: 'active' },
    sfx: 'blip',
    log: { vi: 'client_max_body_size 160m;', en: 'client_max_body_size 160m;' },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — MỌI NGƯỜI CHUNG MỘT IP: SỰ CỐ 429
   ──────────────────────────────────────────────────────────── */

function buildIpLoss(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'two',
    title: { vi: 'Hai người dùng ở hai đầu thế giới', en: 'Two users on opposite sides of the world' },
    detail: {
      vi: 'Hai địa chỉ IP hoàn toàn khác nhau, hai người không quen biết, cùng gọi API trong một phút. Đây là tình huống bình thường nhất có thể — và cũng là tình huống làm lộ vấn đề.',
      en: 'Two entirely different IP addresses, two strangers, both calling the API within the same minute. This is the most ordinary situation imaginable — and the one that exposes the problem.',
    },
    duration: 2500,
    edge: 'e_u_nginx',
    kind: 'GET',
    nodeStates: { user: 'active', user2: 'active', nginx: 'processing' },
    packetLabel: '203.0.113.7',
    alsoInFlight: [{ edge: 'e_u2_nginx', at: 0.55, label: '198.51.100.42', kind: 'GET' }],
    sfx: 'swoosh',
  });

  push({
    id: 'collapse',
    title: { vi: 'Qua proxy, cả hai biến thành 172.18.0.5', en: 'After the proxy, both become 172.18.0.5' },
    detail: {
      vi: 'Kết nối TCP tới backend do NGINX mở, nên IP nguồn là IP của Nginx trên mạng Docker. Không phải Nginx giấu giếm gì — đơn giản là kết nối gốc đã kết thúc ở biên, và cái đi tiếp là một kết nối hoàn toàn mới. Ở tầng TCP thì không còn dấu vết nào của người dùng.',
      en: 'The TCP connection to the backend is opened by NGINX, so the source IP is Nginx’s address on the Docker network. Nginx is not hiding anything — the original connection simply ended at the edge, and what continues is an entirely new one. At the TCP layer no trace of the user remains.',
    },
    duration: 3000,
    edge: 'e_nginx_be',
    kind: 'GET',
    nodeStates: { nginx: 'success', backend: 'processing' },
    packetLabel: 'src 172.18.0.5',
    sfx: 'blip',
    log: { vi: 'req.ip = 172.18.0.5  (cả hai người dùng)', en: 'req.ip = 172.18.0.5  (both users)' },
    teachingNote: {
      vi: 'Hỏi lớp: nếu rate limit đếm theo `req.ip`, bộ đếm này đang đếm ai?',
      en: 'Ask the class: if the rate limiter keys on `req.ip`, whom is it counting?',
    },
  });

  push({
    id: 'onecounter',
    title: { vi: 'Rate limiter chỉ còn MỘT bộ đếm cho cả website', en: 'The rate limiter now has ONE counter for the entire site' },
    detail: {
      vi: 'Ngưỡng đặt cho một người bây giờ phải gánh toàn bộ lượng truy cập. Với ngưỡng kiểu 100 request mỗi phút, chỉ cần vài chục người đang dùng bình thường là chạm trần trong vài giây. Không cần ai tấn công cả.',
      en: 'A threshold designed for one person now absorbs all traffic. With something like 100 requests per minute, a few dozen ordinary users hit the ceiling within seconds. No attacker required.',
    },
    duration: 2800,
    edge: 'e_be_limit',
    kind: 'INTERNAL',
    nodeStates: { limiter: 'processing' },
    packetLabel: 'key = 172.18.0.5',
    sfx: 'buzz',
    log: { vi: '172.18.0.5 → 98 · 99 · 100 · 101 ...', en: '172.18.0.5 → 98 · 99 · 100 · 101 ...' },
  });

  push({
    id: 'burst',
    title: { vi: 'Cả website trả 429 — trông y hệt một lần sập', en: 'The whole site returns 429 — indistinguishable from an outage' },
    detail: {
      vi: 'Mọi người bị chặn cùng lúc, kể cả người vừa mở trang lần đầu. Nhìn từ ngoài thì đây là sự cố sập: trang trắng, API lỗi, kêu ca khắp nơi. Nhưng máy chủ hoàn toàn khoẻ, CSDL nhàn rỗi, CPU thấp — nên nếu đi tìm theo hướng "quá tải" thì sẽ không tìm thấy gì cả.',
      en: 'Everyone is blocked at once, including someone opening the site for the first time. From outside this is an outage: blank pages, failing API, complaints everywhere. Yet the server is perfectly healthy, the database idle, CPU low — so if you investigate along the "overload" path you will find nothing.',
    },
    duration: 3100,
    edge: 'e_be_limit',
    reverse: true,
    kind: 'ERROR',
    nodeStates: { limiter: 'error', backend: 'error', user: 'error', user2: 'error' },
    packetLabel: '429',
    status: 429,
    sfx: 'error',
    log: { vi: '429 Too Many Requests — mọi người dùng', en: '429 Too Many Requests — every user' },
    teachingNote: {
      vi: 'Nhắc: 429 hàng loạt KHÔNG phải sập. Kiểm CPU/DB trước khi kết luận quá tải.',
      en: 'Remind: mass 429s are NOT an outage. Check CPU/DB before concluding overload.',
    },
  });

  push({
    id: 'naivefix',
    title: { vi: 'Cách sửa hiển nhiên — và vì sao nó mở ra một lỗ hổng', en: 'The obvious fix — and why it opens a hole' },
    detail: {
      vi: 'Bật `trust proxy` rồi lấy IP từ `X-Forwarded-For`. Đúng hướng, nhưng nếu lấy PHẦN TỬ ĐẦU TIÊN của chuỗi thì bạn đang tin một header do CLIENT gửi. Kẻ tấn công chỉ cần tự đặt `X-Forwarded-For: 1.2.3.4` khác nhau mỗi lần là có vô hạn bộ đếm — rate limit thành đồ trang trí.',
      en: 'Enable `trust proxy` and read the IP from `X-Forwarded-For`. Right direction, but if you take the FIRST element of the chain you are trusting a client-supplied header. An attacker simply sets a different `X-Forwarded-For: 1.2.3.4` each time and gets unlimited counters — the rate limit becomes decoration.',
    },
    duration: 3200,
    at: 'limiter',
    kind: 'ERROR',
    nodeStates: { limiter: 'error' },
    packetLabel: 'XFF giả',
    sfx: 'buzz',
    log: { vi: 'X-Forwarded-For: 1.2.3.4, 203.0.113.7, 172.18.0.5', en: 'X-Forwarded-For: 1.2.3.4, 203.0.113.7, 172.18.0.5' },
  });

  push({
    id: 'realfix',
    title: { vi: 'Cách đúng: đếm ngược từ proxy tin cậy', en: 'The correct fix: count back from the trusted proxy' },
    detail: {
      vi: 'Nginx **nối thêm** IP thật vào CUỐI chuỗi, phần đầu là do client tự viết nên không đáng tin. Vì bạn biết chính xác có bao nhiêu proxy trước ứng dụng (ở đây là một), hãy lấy phần tử ở đúng vị trí đó tính từ cuối. Trong Express: đặt `trust proxy` bằng SỐ LƯỢNG proxy, không phải `true` — `true` nghĩa là tin toàn bộ chuỗi.',
      en: 'Nginx **appends** the real IP to the END of the chain; the earlier entries are client-written and untrustworthy. Since you know exactly how many proxies sit in front (here, one), take the element at that offset from the end. In Express: set `trust proxy` to the NUMBER of proxies, not `true` — `true` means trusting the entire chain.',
    },
    duration: 3200,
    edge: 'e_be_limit',
    kind: 'ACK',
    nodeStates: { limiter: 'success', backend: 'success', user: 'success', user2: 'success' },
    packetLabel: 'key = 203.0.113.7',
    sfx: 'success',
    log: { vi: 'app.set(‘trust proxy’, 1) → key = IP thật, mỗi người một bộ đếm', en: 'app.set(‘trust proxy’, 1) → key = real IP, one counter per user' },
  });

  push({
    id: 'lesson',
    title: { vi: 'Bài học chung: proxy làm mất ngữ cảnh, không chỉ mất IP', en: 'The general lesson: a proxy erases context, not just the IP' },
    detail: {
      vi: 'Cùng một cơ chế làm hỏng nhiều thứ khác nếu quên: giao thức gốc (thiếu `X-Forwarded-Proto` thì ứng dụng tưởng đang chạy http và sinh ra liên kết chuyển hướng sai), tên miền gốc, và cả địa chỉ dùng để ghi nhật ký kiểm toán. Nguyên tắc chung: mọi thứ nằm ở tầng KẾT NỐI đều dừng lại ở proxy — muốn đi tiếp thì phải chuyển thành header một cách có chủ đích.',
      en: 'The same mechanism breaks other things when forgotten: the original scheme (without `X-Forwarded-Proto` the app believes it is on http and emits wrong redirect links), the original host, and the address used for audit logging. The general rule: anything living at the CONNECTION layer stops at the proxy — to travel further it must be deliberately turned into a header.',
    },
    duration: 3000,
    at: 'nginx',
    nodeStates: { nginx: 'active' },
    sfx: 'lock',
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nginxProxyScenario: Scenario = {
  id: 'nginx-proxy',
  name: { vi: 'Nginx — TLS và cái giá của việc đứng giữa', en: 'Nginx — TLS and the cost of standing in the middle' },
  tagline: {
    vi: 'Nginx cắt lớp TLS ở biên rồi chuyển tiếp HTTP thường vào Docker. Nhưng qua proxy thì mọi người dùng đều mang chung một IP — đủ để rate limit gom cả website vào một bộ đếm và trả 429 hàng loạt.',
    en: 'Nginx terminates TLS at the edge and forwards plain HTTP into Docker. But behind a proxy every user shares one IP — enough for a rate limiter to fold the entire site into a single counter and return mass 429s.',
  },
  icon: Router,
  accent: '#38bdf8',
  group: 'devops',
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Xem phần nào', en: 'Which part' },
      defaultValue: 'routing',
      choices: [
        {
          value: 'routing',
          label: 'TLS & định tuyến',
          fullLabel: 'Đường đi bình thường của một request',
          color: '#38bdf8',
          hint: { vi: 'termination, header, WebSocket, 413', en: 'termination, headers, WebSocket, 413' },
        },
        {
          value: 'iploss',
          label: 'Mất IP → 429',
          fullLabel: 'Cả website chung một bộ đếm',
          color: '#f43f5e',
          hint: { vi: '429 hàng loạt mà máy chủ vẫn khoẻ', en: 'mass 429s on a healthy server' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'iploss' ? buildIpLoss() : buildRouting()),
};
