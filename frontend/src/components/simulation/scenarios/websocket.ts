/**
 * Kịch bản 5 — WebSocket / realtime hai chiều.
 *
 * Điều mà sơ đồ tĩnh không dạy nổi và hoạt hình dạy được ngay: với HTTP,
 * mọi mũi tên đều bắt đầu từ client; với WebSocket, mũi tên xuất phát từ
 * SERVER. Đó là toàn bộ khác biệt. Kịch bản cũng dựng hai instance Socket.IO
 * để chỉ ra lý do bắt buộc phải có Redis adapter khi chạy nhiều tiến trình —
 * lỗi kinh điển "chạy local thì được, lên production thì mất tin nhắn".
 */

import { Radio } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'a', label: 'Client A', kind: 'client' as const, x: 100, y: 150, sublabel: { vi: 'Người gửi', en: 'Sender' } },
  { id: 'b', label: 'Client B', kind: 'client' as const, x: 100, y: 450, sublabel: { vi: 'Người nhận', en: 'Receiver' } },
  { id: 'ws1', label: 'Socket.IO #1', kind: 'socket' as const, x: 375, y: 150, sublabel: { vi: 'Tiến trình 1', en: 'Process 1' } },
  { id: 'ws2', label: 'Socket.IO #2', kind: 'socket' as const, x: 375, y: 450, sublabel: { vi: 'Tiến trình 2', en: 'Process 2' } },
  { id: 'redis', label: 'Redis Adapter', kind: 'cache' as const, x: 650, y: 300, sublabel: { vi: 'Pub/Sub giữa các tiến trình', en: 'Cross-process pub/sub' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 890, y: 300, sublabel: { vi: 'Lưu tin nhắn', en: 'Message store' } },
];

const edges = [
  { id: 'e_a_ws1', from: 'a', to: 'ws1' },
  { id: 'e_b_ws2', from: 'b', to: 'ws2' },
  { id: 'e_ws1_redis', from: 'ws1', to: 'redis' },
  { id: 'e_ws2_redis', from: 'ws2', to: 'redis' },
  { id: 'e_redis_db', from: 'redis', to: 'db', ghost: true },
];

export const websocketScenario: Scenario = {
  id: 'websocket',
  name: { vi: 'WebSocket — Realtime hai chiều', en: 'WebSocket — Bi-directional realtime' },
  tagline: {
    vi: 'Từ bắt tay HTTP 101 tới broadcast qua Redis adapter, kèm cả nhánh mất kết nối và kiểm quyền từng sự kiện.',
    en: 'From the HTTP 101 handshake to a Redis-adapter broadcast, including the drop-and-reconnect and per-event authorisation branches.',
  },
  icon: Radio,
  accent: '#e879f9',
  nodes,
  edges,
  options: [
    {
      id: 'flow',
      label: { vi: 'Giai đoạn', en: 'Phase' },
      defaultValue: 'handshake',
      choices: [
        { value: 'handshake', label: 'Bắt tay + nâng cấp', color: '#38bdf8' },
        { value: 'broadcast', label: 'Gửi & phát tin', color: '#e879f9' },
        { value: 'reconnect', label: 'Mất kết nối → nối lại', color: '#f59e0b' },
        { value: 'idor', label: 'Kiểm quyền mỗi sự kiện', color: '#f43f5e', hint: { vi: 'Lỗ hổng thật đã từng vá', en: 'A real vulnerability, since fixed' } },
      ],
    },
    {
      id: 'scale',
      label: { vi: 'Số tiến trình', en: 'Process count' },
      defaultValue: 'multi',
      choices: [
        { value: 'single', label: '1 tiến trình', color: '#94a3b8' },
        { value: 'multi', label: 'Nhiều tiến trình + Redis', color: '#a855f7' },
      ],
    },
  ],

  build({ flow = 'handshake', scale = 'multi' }) {
    const steps: SimStep[] = [];
    const multi = scale === 'multi';

    /* ── Bắt tay và nâng cấp giao thức ─────────────────────────── */
    if (flow === 'handshake') {
      steps.push({
        id: 'upgrade-req',
        edge: 'e_a_ws1',
        kind: 'GET',
        duration: 1200,
        latencyMs: 24,
        packetLabel: 'GET /socket.io + Upgrade',
        title: { vi: 'Bắt đầu bằng một request HTTP bình thường', en: 'It starts as an ordinary HTTP request' },
        detail: {
          vi: 'WebSocket không phải giao thức tách rời — nó BẮT ĐẦU bằng HTTP. Client gửi GET kèm header Upgrade: websocket và một chuỗi Sec-WebSocket-Key ngẫu nhiên. Chính vì mở đầu bằng HTTP mà WebSocket đi qua được tường lửa và proxy như lưu lượng web thường.',
          en: 'WebSocket is not a separate protocol — it BEGINS as HTTP. The client sends a GET carrying Upgrade: websocket plus a random Sec-WebSocket-Key. Because it opens as HTTP it traverses firewalls and proxies like ordinary web traffic.',
        },
        headers: {
          Upgrade: 'websocket',
          Connection: 'Upgrade',
          // Rút gọn có chủ ý: chuỗi base64 đầy đủ bị bộ quét bí mật của repo
          // bắt nhầm là khoá API (entropy cao). Nội dung thật chỉ là 16 byte
          // ngẫu nhiên do client sinh cho mỗi lần bắt tay.
          'Sec-WebSocket-Key': '<16 byte ngẫu nhiên, base64>',
          'Sec-WebSocket-Version': '13',
          Cookie: 'backend_token=eyJ…',
        },
        nodeStates: { a: 'active', ws1: 'processing' },
        sfx: 'swoosh',
        teachingNote: {
          vi: 'Nhắc học viên kiểm tra tab Network → WS trong DevTools: chỉ thấy MỘT dòng 101, sau đó mọi tin nhắn nằm trong tab Messages chứ không sinh request mới.',
          en: 'Have learners open DevTools → Network → WS: there is only ONE 101 row; every later message lives in the Messages tab, never as a new request.',
        },
      });

      steps.push({
        id: 'auth-handshake',
        at: 'ws1',
        kind: 'TOKEN',
        duration: 1100,
        latencyMs: 3,
        title: { vi: 'Xác thực NGAY lúc bắt tay', en: 'Authenticate at handshake time' },
        detail: {
          vi: 'Đây là cơ hội DUY NHẤT để dùng cookie: sau khi nâng cấp, khung WebSocket không mang header nào nữa. Vì thế phải xác minh token ở middleware io.use() và gắn userId vào socket.data — mọi sự kiện sau này sẽ dựa vào giá trị đó, không bao giờ tin userId do client gửi lên.',
          en: 'This is the ONLY chance to use the cookie: after the upgrade, WebSocket frames carry no headers at all. So verify the token in an io.use() middleware and pin userId onto socket.data — every later event trusts that value and never a userId sent by the client.',
        },
        payload: { socketId: 'kR2xN…', userId: 1, rooms: [] },
        nodeStates: { ws1: 'success' },
        sfx: 'lock',
      });

      steps.push({
        id: 'upgrade-res',
        edge: 'e_a_ws1',
        reverse: true,
        kind: 'EVENT',
        duration: 1100,
        status: 101,
        packetLabel: '101 Switching Protocols',
        title: { vi: '101 — đổi giao thức', en: '101 — Switching Protocols' },
        detail: {
          vi: 'Mã 101 là mã trạng thái đặc biệt nhất của HTTP: nó nói "từ đây trở đi ta không nói HTTP nữa". Cùng một kết nối TCP, cùng một cổng 443, nhưng khung dữ liệu đã theo định dạng WebSocket. Không còn request và response — chỉ còn hai đầu cùng nói được bất cứ lúc nào.',
          en: 'A 101 is the strangest status code in HTTP: it says "from here on we stop speaking HTTP". Same TCP connection, same port 443, but the framing is now WebSocket. There is no request and response any more — just two ends that may both speak at any time.',
        },
        // Accept = SHA-1(Key + GUID cố định của RFC 6455) rồi base64. Nó chỉ
        // chứng minh server hiểu giao thức WebSocket, KHÔNG phải cơ chế bảo mật.
        headers: { Upgrade: 'websocket', 'Sec-WebSocket-Accept': '<sha1(key + GUID), base64>' },
        nodeStates: { a: 'success', ws1: 'active' },
        sfx: 'success',
      });

      steps.push({
        id: 'heartbeat',
        edge: 'e_a_ws1',
        kind: 'ACK',
        duration: 900,
        latencyMs: 12,
        packetLabel: 'ping ⇄ pong',
        title: { vi: 'Nhịp tim giữ kết nối sống', en: 'Heartbeat keeps the connection alive' },
        detail: {
          vi: 'Cứ 25 giây Socket.IO gửi ping, client trả pong. Hai việc được giải quyết cùng lúc: phát hiện kết nối đã chết (mà TCP có thể mất vài phút mới nhận ra), và ngăn proxy đóng kết nối vì tưởng nó nhàn rỗi. Không có nhịp tim, kết nối "chết mà vẫn tưởng sống" là lỗi khó chịu nhất của realtime.',
          en: 'Every 25 seconds Socket.IO pings and the client pongs. Two problems solved at once: detecting a dead connection (which raw TCP may take minutes to notice) and stopping proxies from closing an apparently idle socket. Without heartbeats, the "dead but believed alive" socket is the nastiest realtime bug there is.',
        },
        nodeStates: { a: 'active', ws1: 'active' },
        sfx: 'blip',
        log: { vi: 'ping 25s · pong 12ms · transport=websocket', en: 'ping 25s · pong 12ms · transport=websocket' },
      });
      return steps;
    }

    /* ── Kiểm quyền theo từng sự kiện (lỗ hổng IDOR) ───────────── */
    if (flow === 'idor') {
      steps.push({
        id: 'join-try',
        edge: 'e_a_ws1',
        kind: 'EVENT',
        duration: 1200,
        packetLabel: "emit('thread:join', 999)",
        title: { vi: 'Client tự xin vào phòng chat của người khác', en: 'Client asks to join someone else\'s room' },
        detail: {
          vi: 'Người dùng A đã xác thực hợp lệ ở bước bắt tay và gửi sự kiện xin vào thread 999 — cuộc trò chuyện giữa hai người hoàn toàn khác. Câu hỏi cốt lõi: đã xác thực lúc bắt tay thì có đủ chưa?',
          en: 'User A authenticated correctly at handshake and now emits a request to join thread 999 — a conversation between two entirely different people. The core question: is authenticating at handshake enough?',
        },
        payload: { event: 'thread:join', threadId: 999 },
        nodeStates: { a: 'active', ws1: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'idor-bad',
        at: 'ws1',
        kind: 'ERROR',
        duration: 1400,
        title: { vi: 'Cách làm SAI: chỉ kiểm lúc bắt tay', en: 'The WRONG way: check only at handshake' },
        detail: {
          vi: 'Nếu server chỉ hỏi "socket này đã đăng nhập chưa?" rồi gọi socket.join(`thread:999`), thì A vào được phòng của người lạ và nhận mọi tin nhắn từ đó trở đi. Đây đúng là lỗ hổng IDOR đã tồn tại thật trong dự án này và được vá ngày 28/07/2026: xác thực (bạn là ai) đã có, nhưng phân quyền (bạn có thuộc thread này không) thì thiếu.',
          en: 'If the server only asks "is this socket logged in?" and then calls socket.join(`thread:999`), A lands inside a stranger\'s room and receives every message from then on. This is the exact IDOR that existed in this project and was patched on 2026-07-28: authentication (who you are) was present, authorisation (do you belong to this thread) was missing.',
        },
        nodeStates: { ws1: 'error' },
        sfx: 'error',
        teachingNote: {
          vi: 'Đây là bài học đắt nhất của kịch bản realtime: HTTP có middleware chạy trên MỌI route, còn socket thì mỗi handler tự lo. Rất dễ quên.',
          en: 'The most valuable lesson in the realtime scenario: HTTP middleware runs on EVERY route, but each socket handler defends itself. Very easy to forget.',
        },
      });
      steps.push({
        id: 'idor-check',
        edge: 'e_redis_db',
        reverse: true,
        kind: 'QUERY',
        duration: 1200,
        latencyMs: 6,
        packetLabel: 'kiểm tư cách thành viên',
        title: { vi: 'Cách làm ĐÚNG: kiểm quyền trong từng handler', en: 'The RIGHT way: authorise inside each handler' },
        detail: {
          vi: 'Trước khi join, truy vấn: thread 999 có bản ghi thành viên nào ứng với socket.data.userId không? Kiểm bằng userId lấy từ phiên, KHÔNG BAO GIỜ bằng userId client gửi kèm. Kết quả nên được đệm ngắn trong RAM để không phải truy vấn ở mọi sự kiện.',
          en: 'Before joining, query: does thread 999 have a participant row matching socket.data.userId? Check against the session userId, NEVER one supplied by the client. Cache the answer briefly in memory so this is not a query on every single event.',
        },
        payload: { sql: 'SELECT 1 FROM thread_participants WHERE thread_id=$1 AND user_id=$2', params: [999, 1], result: 'no rows' },
        nodeStates: { db: 'processing', ws1: 'processing' },
        sfx: 'blip',
      });
      steps.push({
        id: 'idor-deny',
        edge: 'e_a_ws1',
        reverse: true,
        kind: 'ERROR',
        duration: 1100,
        packetLabel: "emit('error', 403)",
        title: { vi: 'Từ chối — không phải thành viên', en: 'Denied — not a participant' },
        detail: {
          vi: 'Socket bị từ chối vào phòng và sự việc được ghi log. Nguyên tắc rút ra: coi MỌI sự kiện socket như một endpoint HTTP riêng biệt — nó cũng cần kiểm quyền, cũng cần giới hạn tần suất, cũng cần kiểm tra dữ liệu đầu vào.',
          en: 'The socket is refused and the attempt is logged. The takeaway: treat EVERY socket event as its own HTTP endpoint — it needs authorisation, rate limiting and input validation just the same.',
        },
        payload: { error: 'Forbidden', event: 'thread:join', threadId: 999 },
        nodeStates: { a: 'error', ws1: 'idle', db: 'idle' },
        sfx: 'buzz',
      });
      return steps;
    }

    /* ── Mất kết nối và nối lại ────────────────────────────────── */
    if (flow === 'reconnect') {
      steps.push({
        id: 'drop',
        at: 'a',
        kind: 'ERROR',
        duration: 1200,
        title: { vi: 'Người dùng chui vào thang máy', en: 'The user steps into a lift' },
        detail: {
          vi: 'Mạng đứt đột ngột. Điểm quan trọng: trình duyệt KHÔNG biết ngay lập tức — không có gói tin nào báo "tôi mất sóng". Phía server, socket vẫn nằm trong danh sách "đang kết nối" cho tới khi nhịp tim đầu tiên hết hạn.',
          en: 'The network dies abruptly. Crucially, the browser does NOT know immediately — no packet announces "I lost signal". On the server side the socket stays in the connected list until the first heartbeat times out.',
        },
        nodeStates: { a: 'error' },
        sfx: 'error',
      });
      steps.push({
        id: 'timeout',
        at: 'ws1',
        kind: 'CACHE_MISS',
        duration: 1300,
        latencyMs: 20000,
        title: { vi: 'Server phát hiện sau 20 giây', en: 'Server notices after 20 seconds' },
        detail: {
          vi: 'Hết hạn pong: server dọn socket, gỡ khỏi mọi phòng và phát sự kiện "user offline". Khoảng 20 giây "ma" này là lý do trạng thái online của các ứng dụng chat không bao giờ chính xác tuyệt đối — và cũng là lý do đừng dùng nó làm căn cứ cho logic nghiệp vụ quan trọng.',
          en: 'Pong timeout: the server tears the socket down, removes it from every room and emits "user offline". That 20-second ghost window is why the online indicator in chat apps is never perfectly accurate — and why you should not build important business logic on it.',
        },
        nodeStates: { ws1: 'error' },
        sfx: 'buzz',
        log: { vi: 'disconnect socket=kR2xN reason=ping timeout', en: 'disconnect socket=kR2xN reason=ping timeout' },
      });
      steps.push({
        id: 'backoff',
        at: 'a',
        kind: 'INTERNAL',
        duration: 1400,
        title: { vi: 'Client thử lại theo cấp số nhân', en: 'Client retries with exponential backoff' },
        detail: {
          vi: 'Socket.IO tự thử lại sau 1s, 2s, 4s, 8s… kèm một chút xê dịch ngẫu nhiên. Xê dịch (jitter) là phần bắt buộc: nếu không, khi server khởi động lại, HÀNG NGHÌN client sẽ cùng kết nối lại vào đúng một giây và giết server lần thứ hai.',
          en: 'Socket.IO retries after 1s, 2s, 4s, 8s… with a little randomised jitter. The jitter is mandatory: without it, when a server restarts THOUSANDS of clients reconnect in the very same second and kill it a second time.',
        },
        nodeStates: { a: 'waiting' },
        sfx: 'blip',
      });
      steps.push({
        id: 'reconnect',
        edge: 'e_a_ws1',
        kind: 'EVENT',
        duration: 1200,
        packetLabel: 'reconnect + resume',
        title: { vi: 'Nối lại — và phải đồng bộ phần đã lỡ', en: 'Reconnected — and the gap must be filled' },
        detail: {
          vi: 'Nối lại được là mới xong một nửa. Trong lúc đứt, người dùng đã lỡ mất tin nhắn. Realtime KHÔNG BAO GIỜ là nguồn sự thật duy nhất: sau khi nối lại, client phải gọi REST để lấy phần đã lỡ kể từ mốc thời gian cuối cùng nó nhận được.',
          en: 'Reconnecting is only half the job. During the outage the user missed messages. Realtime is NEVER the sole source of truth: after reconnecting the client must call REST to fetch everything since the last timestamp it saw.',
        },
        payload: { event: 'sync:since', lastSeenAt: '2026-07-28T09:31:02.000Z', missed: 3 },
        nodeStates: { a: 'processing', ws1: 'processing' },
        sfx: 'swoosh',
        teachingNote: {
          vi: 'Nguyên tắc vàng: WebSocket để "biết ngay", REST để "biết đúng". Hệ thống nào chỉ dựa vào WebSocket sẽ mất dữ liệu.',
          en: 'Golden rule: WebSocket for "know now", REST for "know correctly". Anything relying on WebSocket alone will lose data.',
        },
      });
      steps.push({
        id: 'resynced',
        edge: 'e_a_ws1',
        reverse: true,
        kind: 'RESPONSE',
        duration: 1100,
        packetLabel: '3 tin nhắn lỡ',
        title: { vi: 'Đồng bộ xong, người dùng không mất gì', en: 'Resynced — nothing was lost' },
        detail: {
          vi: 'Ba tin nhắn lỡ được nạp lại và ghép vào đúng vị trí theo thời gian. Người dùng chỉ thấy một khoảnh khắc tải nhẹ — đó là trải nghiệm mà một ứng dụng chat tử tế phải đạt được.',
          en: 'The three missed messages load and merge back in timestamp order. The user sees only a brief loading flicker — the experience a well-built chat app owes them.',
        },
        nodeStates: { a: 'success', ws1: 'active' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Gửi và phát tin (broadcast) ───────────────────────────── */
    steps.push({
      id: 'emit',
      edge: 'e_a_ws1',
      kind: 'EVENT',
      duration: 1100,
      latencyMs: 14,
      packetLabel: "emit('message:send')",
      title: { vi: 'A gửi tin nhắn qua socket', en: 'A sends a message over the socket' },
      detail: {
        vi: 'Không có request HTTP nào cả. Khung dữ liệu đi thẳng qua kết nối đã mở sẵn — vì thế không tốn chi phí bắt tay TLS, không header, chỉ vài chục byte. Đó là lý do WebSocket thắng tuyệt đối so với polling khi tin nhắn dày.',
        en: 'No HTTP request happens. The frame goes straight down the already-open connection — no TLS handshake cost, no headers, just a few dozen bytes. That is why WebSocket beats polling outright when messages are frequent.',
      },
      payload: { event: 'message:send', threadId: 12, body: 'Bài giảng bắt đầu lúc mấy giờ?', tempId: 'tmp_1' },
      nodeStates: { a: 'active', ws1: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'persist',
      edge: 'e_redis_db',
      kind: 'POST',
      duration: 1100,
      latencyMs: 9,
      packetLabel: 'INSERT message',
      title: { vi: 'Lưu vào CSDL TRƯỚC khi phát đi', en: 'Persist BEFORE broadcasting' },
      detail: {
        vi: 'Thứ tự này không thể đảo: lưu trước, phát sau. Nếu phát trước rồi lưu thất bại, người nhận đã thấy một tin nhắn không hề tồn tại — và lần tải lại trang nó biến mất. Loại lỗi "ma" này cực kỳ khó tái hiện khi đi tìm nguyên nhân.',
        en: 'This ordering is not negotiable: store first, broadcast second. Broadcast first and the write fails, and recipients saw a message that does not exist — it vanishes on reload. That class of ghost bug is brutal to reproduce.',
      },
      payload: { id: 88213, threadId: 12, senderId: 1, createdAt: '2026-07-28T09:33:10.221Z' },
      nodeStates: { db: 'processing', ws1: 'waiting' },
      sfx: 'click',
    });

    if (multi) {
      steps.push({
        id: 'pub',
        edge: 'e_ws1_redis',
        kind: 'EVENT',
        duration: 1100,
        latencyMs: 1,
        packetLabel: 'PUBLISH thread:12',
        title: { vi: 'Đăng lên Redis vì B ở tiến trình khác', en: 'Publish to Redis — B lives in another process' },
        detail: {
          vi: 'Đây là điểm chết người khi lên production. Trên máy local chỉ có một tiến trình nên io.to(room).emit() chạy ngon lành. Khi lên server chạy 4 tiến trình PM2, A nối vào tiến trình 1 còn B nối vào tiến trình 2 — tiến trình 1 hoàn toàn không biết B tồn tại. Redis adapter chính là cây cầu.',
          en: 'This is the production killer. Locally there is one process, so io.to(room).emit() just works. On a server running four PM2 processes, A lands on process 1 and B on process 2 — process 1 has no idea B exists. The Redis adapter is the bridge.',
        },
        payload: { channel: 'socket.io#/#thread:12#', event: 'message:new' },
        nodeStates: { db: 'success', redis: 'processing' },
        sfx: 'blip',
        teachingNote: {
          vi: 'Hỏi lớp: "vì sao chat chạy ngon ở local mà lên production mất tin nhắn?" Đây là câu trả lời, và nó luôn gây ngạc nhiên.',
          en: 'Ask the room: "why does chat work locally but drop messages in production?" This is the answer, and it always surprises people.',
        },
      });
      steps.push({
        id: 'sub',
        edge: 'e_ws2_redis',
        reverse: true,
        kind: 'EVENT',
        duration: 1100,
        latencyMs: 1,
        packetLabel: 'SUBSCRIBE → nhận',
        title: { vi: 'Tiến trình 2 nhận được bản tin', en: 'Process 2 receives the publication' },
        detail: {
          vi: 'Mọi tiến trình cùng đăng ký kênh này. Redis phát cho tất cả, tiến trình nào đang giữ socket của người trong phòng thì mới thực sự gửi tiếp. Chi phí thêm khoảng 1ms — quá rẻ so với việc mất tin nhắn.',
          en: 'Every process subscribes to the channel. Redis fans it out; only the process actually holding a socket in that room forwards it on. The extra cost is about 1ms — cheap next to losing messages.',
        },
        nodeStates: { redis: 'success', ws2: 'processing' },
        sfx: 'blip',
      });
    }

    steps.push({
      id: 'deliver',
      edge: 'e_b_ws2',
      reverse: true,
      kind: 'EVENT',
      duration: 1200,
      latencyMs: 16,
      packetLabel: "on('message:new')",
      title: { vi: 'B nhận tin — SERVER là bên chủ động', en: 'B receives it — the SERVER initiated this' },
      detail: {
        vi: 'Hãy nhìn kỹ chiều mũi tên: nó đi TỪ server RA client, và B chưa hề hỏi gì. Đây là điều HTTP không làm được và là lý do duy nhất khiến WebSocket tồn tại. Với polling 5 giây, tin nhắn này trung bình chậm 2,5 giây; ở đây là 16ms.',
        en: 'Look at the arrow direction: it goes FROM the server TO the client, and B asked for nothing. This is what HTTP cannot do and the only reason WebSocket exists. With 5-second polling this message would arrive 2.5 seconds late on average; here it is 16ms.',
      },
      payload: { event: 'message:new', id: 88213, threadId: 12, body: 'Bài giảng bắt đầu lúc mấy giờ?', senderId: 1 },
      nodeStates: { ws2: 'success', b: 'success' },
      sfx: 'ping',
    });

    steps.push({
      id: 'ack',
      edge: 'e_a_ws1',
      reverse: true,
      kind: 'ACK',
      duration: 1000,
      latencyMs: 2,
      packetLabel: 'ack tmp_1 → 88213',
      title: { vi: 'Xác nhận về cho A — đổi id tạm sang id thật', en: 'Acknowledge back to A — swap the temp id for the real one' },
      detail: {
        vi: 'Giao diện của A đã hiện tin nhắn ngay từ lúc bấm gửi (cập nhật lạc quan) với id tạm tmp_1. Ack mang về id thật để thay thế. Nếu ack không tới trong 5 giây, tin nhắn phải chuyển sang trạng thái "gửi lỗi — thử lại" chứ không được im lặng.',
        en: 'A\'s UI already showed the message the instant they hit send (optimistic update) under the temp id tmp_1. The ack brings the real id to swap in. If no ack arrives within five seconds the bubble must flip to "failed — retry" rather than silently pretend.',
      },
      payload: { tempId: 'tmp_1', id: 88213, status: 'delivered' },
      nodeStates: { a: 'success', ws1: 'active' },
      sfx: 'success',
    });

    return steps;
  },
};
