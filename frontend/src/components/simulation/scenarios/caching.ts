/**
 * Kịch bản 2 — Tầng bộ nhớ đệm: Cloudflare CDN và Redis.
 *
 * Bài học cốt lõi mà hoạt hình này truyền tải rõ hơn mọi slide: HIT và MISS
 * không khác nhau ở "nhanh/chậm" — chúng khác nhau ở SỐ CHẶNG phải đi.
 * HIT dừng ở chặng thứ nhất; MISS đi hết dây chuyền rồi còn phải quay lại
 * ghi cache. Người xem thấy tận mắt quãng đường dài ra bao nhiêu.
 */

import { Zap } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'client', label: 'Browser', kind: 'client' as const, x: 105, y: 300, sublabel: { vi: 'Người dùng ở Hà Nội', en: 'User in Hanoi' } },
  { id: 'cdn', label: 'Cloudflare', kind: 'edge' as const, x: 330, y: 300, sublabel: { vi: 'Edge PoP · Singapore', en: 'Edge PoP · Singapore' } },
  { id: 'api', label: 'Origin API', kind: 'server' as const, x: 575, y: 300, sublabel: { vi: 'Node.js · VPS', en: 'Node.js · VPS' } },
  { id: 'redis', label: 'Redis', kind: 'cache' as const, x: 820, y: 145, sublabel: { vi: 'Bộ đệm trong RAM', en: 'In-memory cache' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 820, y: 430, sublabel: { vi: 'Nguồn sự thật', en: 'Source of truth' } },
];

const edges = [
  { id: 'e_client_cdn', from: 'client', to: 'cdn' },
  { id: 'e_cdn_api', from: 'cdn', to: 'api' },
  { id: 'e_api_redis', from: 'api', to: 'redis' },
  { id: 'e_api_db', from: 'api', to: 'db' },
];

const ARTICLE = {
  id: 42,
  title: 'Event loop giải thích dễ hiểu',
  author: 'Cường Hoàng',
  views: 12840,
  renderedAt: '2026-07-28T09:12:44.010Z',
};

export const cachingScenario: Scenario = {
  id: 'caching',
  name: { vi: 'Tầng đệm — CDN & Redis', en: 'Caching layer — CDN & Redis' },
  tagline: {
    vi: 'So sánh trực quan HIT và MISS ở hai tầng đệm, kèm TTL, invalidation và bài toán cache stampede.',
    en: 'See HIT vs MISS across two cache tiers, with TTL, invalidation and the cache-stampede problem.',
  },
  icon: Zap,
  accent: '#a855f7',
  lesson: {
    course: 'nodejs',
    code: '12.1',
    slug: 'nodejs-12-1-redis-co-ban',
    title: { vi: 'Redis thực chất là gì, và thời gian trôi đi đâu', en: 'What Redis really is, and where the time goes' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'layer',
      label: { vi: 'Tầng đệm', en: 'Cache tier' },
      defaultValue: 'cdn',
      choices: [
        { value: 'cdn', label: 'Cloudflare CDN', color: '#f97316', hint: { vi: 'Đệm ở biên, gần người dùng', en: 'Edge cache, close to the user' } },
        { value: 'redis', label: 'Redis', color: '#a855f7', hint: { vi: 'Đệm phía server, dùng chung', en: 'Server-side shared cache' } },
      ],
    },
    {
      id: 'result',
      label: { vi: 'Kết quả tra đệm', en: 'Cache outcome' },
      defaultValue: 'hit',
      choices: [
        { value: 'hit', label: 'HIT', color: '#a855f7' },
        { value: 'miss', label: 'MISS', color: '#b08968' },
        { value: 'stale', label: 'STALE + revalidate', color: '#38bdf8', hint: { vi: 'Trả bản cũ ngay, làm mới ngầm', en: 'Serve stale now, refresh in background' } },
        { value: 'invalidate', label: 'PURGE sau khi ghi', color: '#f43f5e', hint: { vi: 'Ghi dữ liệu → xoá đệm', en: 'Write data → drop the cache' } },
      ],
    },
  ],

  build({ layer = 'cdn', result = 'hit' }) {
    const steps: SimStep[] = [];
    const atCdn = layer === 'cdn';

    steps.push({
      id: 'req',
      edge: 'e_client_cdn',
      kind: 'GET',
      duration: 1100,
      latencyMs: 18,
      packetLabel: 'GET /posts/42',
      title: { vi: 'Người dùng mở bài viết', en: 'User opens the article' },
      detail: {
        vi: 'Request đi tới điểm hiện diện (PoP) Cloudflare gần nhất — với người dùng Việt Nam thường là Singapore hoặc Hà Nội. Chặng này ngắn vì DNS anycast luôn đưa bạn tới PoP gần nhất.',
        en: 'The request lands on the nearest Cloudflare PoP — for a Vietnamese user usually Singapore or Hanoi. This hop is short because anycast DNS always routes you to the closest edge.',
      },
      headers: { 'Cache-Control': 'max-age=0', 'CF-IPCountry': 'VN', 'If-None-Match': '"a1b2c3"' },
      nodeStates: { client: 'active', cdn: 'processing' },
      sfx: 'swoosh',
    });

    /* ── Nhánh HIT ở CDN ───────────────────────────────────────── */
    if (atCdn && result === 'hit') {
      steps.push({
        id: 'cdn-hit',
        at: 'cdn',
        kind: 'CACHE_HIT',
        duration: 1200,
        latencyMs: 4,
        title: { vi: 'CACHE HIT tại biên', en: 'CACHE HIT at the edge' },
        detail: {
          vi: 'Cloudflare tìm thấy đối tượng còn hạn trong ổ đĩa của PoP. Câu chuyện DỪNG ở đây: origin không hề biết có request này xảy ra. Toàn bộ VPS, Node, Postgres đều rảnh rỗi. Đó mới là giá trị thật của CDN — không phải "nhanh hơn vài chục mili giây" mà là "gánh nặng bị xoá khỏi hệ thống của bạn".',
          en: 'Cloudflare finds a fresh object on the PoP\'s disk. The story STOPS here: the origin never learns this request happened. Your VPS, Node and Postgres stay idle. That is the real value of a CDN — not "a few dozen milliseconds faster" but "the load disappears from your system entirely".',
        },
        headers: { 'CF-Cache-Status': 'HIT', Age: '243', 'Cache-Control': 'public, max-age=600', ETag: '"a1b2c3"' },
        payload: ARTICLE,
        nodeStates: { cdn: 'success' },
        sfx: 'ping',
        log: { vi: 'CF-Cache-Status: HIT · Age: 243s · edge=SIN', en: 'CF-Cache-Status: HIT · Age: 243s · edge=SIN' },
        teachingNote: {
          vi: 'Nhấn mạnh: origin KHÔNG nhận được request nào. Đây là điểm mà học viên hay hiểu sai nhất.',
          en: 'Emphasise: the origin receives nothing at all. This is where learners most often get it wrong.',
        },
      });
      steps.push(...hitResponse('cdn'));
      return steps;
    }

    /* ── Nhánh STALE-WHILE-REVALIDATE ──────────────────────────── */
    if (result === 'stale') {
      steps.push({
        id: 'cdn-stale',
        at: atCdn ? 'cdn' : 'redis',
        kind: 'CACHE_HIT',
        duration: 1200,
        latencyMs: 5,
        title: { vi: 'Bản đệm đã quá hạn nhưng vẫn dùng được', en: 'Cached copy is stale but still usable' },
        detail: {
          vi: 'stale-while-revalidate là mẹo hay nhất của tầng đệm: max-age đã hết, nhưng thay vì bắt người dùng chờ, hệ thống trả NGAY bản cũ rồi lặng lẽ đi làm mới ở phía sau. Người dùng luôn thấy độ trễ của HIT, còn dữ liệu chỉ cũ tối đa vài giây.',
          en: 'stale-while-revalidate is the sweetest trick in caching: max-age expired, but instead of making the user wait the system serves the stale copy IMMEDIATELY and refreshes quietly in the background. Users always feel HIT latency while data is at most a few seconds behind.',
        },
        headers: { 'CF-Cache-Status': 'STALE', 'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' },
        payload: ARTICLE,
        nodeStates: { cdn: atCdn ? 'success' : 'idle', redis: atCdn ? 'idle' : 'success' },
        sfx: 'ping',
      });
      steps.push(...hitResponse(atCdn ? 'cdn' : 'api', true));
      steps.push({
        id: 'revalidate',
        edge: 'e_cdn_api',
        kind: 'INTERNAL',
        duration: 1000,
        packetLabel: 'revalidate',
        title: { vi: 'Làm mới ngầm sau khi đã trả lời', en: 'Background revalidation after answering' },
        detail: {
          vi: 'Người dùng đã cầm dữ liệu trong tay và không chờ bước này. Origin dựng lại nội dung mới, đẩy lên đệm để lần sau lại là HIT tươi. Chi phí được dời ra khỏi đường găng (critical path).',
          en: 'The user already holds the data and is not waiting for this. The origin rebuilds the fresh content and pushes it into the cache so the next request is a fresh HIT. The cost moved off the critical path.',
        },
        nodeStates: { api: 'processing' },
        sfx: 'blip',
      });
      steps.push({
        id: 'revalidate-done',
        at: 'api',
        kind: 'RESPONSE',
        duration: 900,
        title: { vi: 'Đệm được nạp lại, Age về 0', en: 'Cache refilled, Age back to 0' },
        detail: {
          vi: 'Nội dung mới thay thế bản cũ. Nếu ETag không đổi, origin chỉ cần trả 304 Not Modified — tiết kiệm băng thông gần như toàn bộ.',
          en: 'The new content replaces the stale one. If the ETag is unchanged the origin can answer 304 Not Modified and save nearly all the bandwidth.',
        },
        nodeStates: { api: 'success', cdn: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Nhánh PURGE sau khi ghi ───────────────────────────────── */
    if (result === 'invalidate') {
      steps.push({
        id: 'write',
        edge: 'e_cdn_api',
        kind: 'PUT',
        duration: 1000,
        packetLabel: 'PUT /posts/42',
        title: { vi: 'Một lệnh ghi đi thẳng tới origin', en: 'A write goes straight to the origin' },
        detail: {
          vi: 'Mọi thao tác ghi đều BỎ QUA đệm — không ai đệm một lệnh PUT. Đệm chỉ phục vụ đọc.',
          en: 'Every write BYPASSES the cache — nobody caches a PUT. Caches serve reads only.',
        },
        headers: { 'Cache-Control': 'no-store' },
        nodeStates: { cdn: 'active', api: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'db-write',
        edge: 'e_api_db',
        kind: 'PUT',
        duration: 1000,
        latencyMs: 12,
        packetLabel: 'UPDATE',
        title: { vi: 'Ghi vào nguồn sự thật', en: 'Write to the source of truth' },
        detail: {
          vi: 'Cơ sở dữ liệu được cập nhật trước. Thứ tự này quan trọng: ghi DB rồi mới xoá đệm, không bao giờ làm ngược lại.',
          en: 'The database is updated first. The ordering matters: write the DB, then drop the cache — never the other way round.',
        },
        nodeStates: { db: 'processing' },
        sfx: 'click',
      });
      steps.push({
        id: 'purge',
        edge: 'e_api_redis',
        kind: 'DELETE',
        duration: 1000,
        packetLabel: 'DEL post:42',
        title: { vi: 'Xoá khoá đệm (invalidation)', en: 'Delete the cache key (invalidation)' },
        detail: {
          vi: 'Xoá khoá thay vì ghi đè giá trị mới. Lý do: nếu hai request ghi chạy song song, ghi đè có thể để lại giá trị của request cũ hơn; còn xoá thì lần đọc kế tiếp buộc phải lấy bản mới nhất từ CSDL. "Cache invalidation" nổi tiếng khó chính là ở những tình huống đua như thế này.',
          en: 'Delete the key rather than overwrite it. Reason: with two concurrent writes an overwrite can leave the older value behind, whereas a delete forces the next read to fetch the newest row from the database. The famous difficulty of cache invalidation lives in exactly these races.',
        },
        nodeStates: { db: 'success', redis: 'error' },
        sfx: 'buzz',
        log: { vi: 'DEL post:42 → (integer) 1 · purge edge tag=post-42', en: 'DEL post:42 → (integer) 1 · purge edge tag=post-42' },
        teachingNote: {
          vi: 'Nhắc học viên: xoá theo TAG (post-42) chứ đừng "purge everything" — purge sạch đệm giữa giờ cao điểm là tự tạo ra một đợt tấn công vào chính origin của mình.',
          en: 'Remind learners: purge by TAG (post-42), never "purge everything" — a full purge at peak hour is a self-inflicted attack on your own origin.',
        },
      });
      steps.push({
        id: 'purge-res',
        edge: 'e_cdn_api',
        reverse: true,
        kind: 'RESPONSE',
        duration: 900,
        status: 200,
        packetLabel: '200 OK',
        title: { vi: 'Trả kết quả ghi, đệm nay rỗng', en: 'Write acknowledged, cache now empty' },
        detail: {
          vi: 'Request đọc tiếp theo chắc chắn là MISS — và đó là điều ta muốn: một lần MISS có kiểm soát tốt hơn nhiều so với việc phục vụ dữ liệu sai.',
          en: 'The next read is guaranteed to MISS — and that is intended: one controlled miss beats serving wrong data.',
        },
        nodeStates: { api: 'success', cdn: 'idle' },
        sfx: 'success',
      });
      steps.push({
        id: 'purge-client',
        edge: 'e_client_cdn',
        reverse: true,
        kind: 'RESPONSE',
        duration: 950,
        status: 200,
        packetLabel: '200 OK',
        title: { vi: 'Client nhận xác nhận', en: 'Client receives the acknowledgement' },
        detail: {
          vi: 'Frontend thường gọi queryClient.invalidateQueries() ở đây để chính cache phía trình duyệt cũng được làm mới. Nhớ rằng có tới BA tầng đệm: trình duyệt, CDN và Redis.',
          en: 'The frontend typically calls queryClient.invalidateQueries() here so the browser-side cache refreshes too. Remember there are THREE tiers: browser, CDN and Redis.',
        },
        nodeStates: { client: 'success' },
        sfx: 'ping',
      });
      return steps;
    }

    /* ── Nhánh MISS (mặc định) ─────────────────────────────────── */
    if (atCdn) {
      steps.push({
        id: 'cdn-miss',
        at: 'cdn',
        kind: 'CACHE_MISS',
        duration: 1100,
        latencyMs: 6,
        title: { vi: 'CACHE MISS tại biên', en: 'CACHE MISS at the edge' },
        detail: {
          vi: 'PoP không có bản sao nào còn hạn — có thể vì lần đầu ai đó ở khu vực này mở bài, hoặc TTL đã hết, hoặc chính sách cache trả về DYNAMIC. Cloudflare buộc phải đi tiếp về origin.',
          en: 'The PoP has no fresh copy — perhaps nobody in this region opened the article yet, perhaps the TTL expired, perhaps the cache rule says DYNAMIC. Cloudflare must travel on to the origin.',
        },
        headers: { 'CF-Cache-Status': 'MISS' },
        nodeStates: { cdn: 'error' },
        sfx: 'buzz',
        log: { vi: 'CF-Cache-Status: MISS · fetch origin', en: 'CF-Cache-Status: MISS · fetch origin' },
      });
    }

    steps.push({
      id: 'to-origin',
      edge: 'e_cdn_api',
      kind: 'GET',
      duration: 1100,
      latencyMs: 46,
      packetLabel: 'GET /posts/42',
      title: { vi: 'Đi tiếp về origin', en: 'Travel on to the origin' },
      detail: {
        vi: 'Chặng dài nhất của cả hành trình: từ PoP về VPS. Đây chính là quãng đường mà một lần HIT đã cắt bỏ hoàn toàn.',
        en: 'The longest leg of the journey: PoP back to the VPS. This is precisely the distance a HIT eliminates entirely.',
      },
      nodeStates: { cdn: 'active', api: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'redis-lookup',
      edge: 'e_api_redis',
      kind: layer === 'redis' ? 'CACHE_MISS' : 'INTERNAL',
      duration: 950,
      latencyMs: 1,
      packetLabel: 'GET post:42',
      title: { vi: 'Tra Redis trước khi đụng tới CSDL', en: 'Check Redis before touching the database' },
      detail: {
        vi: 'Redis nằm trong RAM nên một lần tra chỉ tốn dưới 1ms. Quy tắc vàng của cache-aside: LUÔN hỏi đệm trước, chỉ khi không có mới hỏi nguồn sự thật.',
        en: 'Redis lives in RAM so a lookup costs well under a millisecond. The golden rule of cache-aside: always ask the cache first, and only fall through to the source of truth on a miss.',
      },
      nodeStates: { redis: 'processing' },
      sfx: 'blip',
    });

    if (layer === 'redis' && result === 'hit') {
      steps.push({
        id: 'redis-hit',
        at: 'redis',
        kind: 'CACHE_HIT',
        duration: 1150,
        latencyMs: 1,
        title: { vi: 'Redis HIT — chuỗi dừng tại đây', en: 'Redis HIT — the chain stops here' },
        detail: {
          vi: 'Giá trị JSON còn hạn, TTL còn 412 giây. PostgreSQL hoàn toàn không bị đánh thức. Với một trang tin có 10.000 lượt xem mỗi phút, đây là khác biệt giữa 10.000 truy vấn và 1 truy vấn.',
          en: 'A fresh JSON value with 412 seconds of TTL left. PostgreSQL is never woken up. On an article page doing 10,000 views a minute, this is the difference between 10,000 queries and one.',
        },
        payload: ARTICLE,
        nodeStates: { redis: 'success' },
        sfx: 'ping',
        log: { vi: 'GET post:42 → HIT · TTL 412s · 0.4ms', en: 'GET post:42 → HIT · TTL 412s · 0.4ms' },
      });
      steps.push({
        id: 'redis-hit-back',
        edge: 'e_api_redis',
        reverse: true,
        kind: 'CACHE_HIT',
        duration: 900,
        packetLabel: 'cached JSON',
        title: { vi: 'Trả giá trị đệm cho API', en: 'Return the cached value to the API' },
        detail: {
          vi: 'API chỉ việc gửi thẳng chuỗi này đi, không cần tuần tự hoá lại — nhiều hệ thống đệm luôn cả chuỗi JSON đã render sẵn để tiết kiệm cả CPU.',
          en: 'The API can ship this string as-is with no re-serialisation — many systems cache the pre-rendered JSON string precisely to save that CPU too.',
        },
        nodeStates: { redis: 'idle', api: 'success' },
        sfx: 'swoosh',
      });
      steps.push(...hitResponse('api'));
      return steps;
    }

    steps.push({
      id: 'redis-miss',
      at: 'redis',
      kind: 'CACHE_MISS',
      duration: 1000,
      latencyMs: 1,
      title: { vi: 'Redis MISS — khoá không tồn tại', en: 'Redis MISS — key not present' },
      detail: {
        vi: 'Khoá không có (nil). Ở điểm này một hệ thống nghiêm túc phải nghĩ tới cache stampede: nếu 500 request cùng MISS một lúc, cả 500 sẽ cùng lao vào CSDL. Cách chặn: dùng khoá phân tán (SET NX) để chỉ MỘT request được đi tiếp, số còn lại chờ kết quả.',
        en: 'The key is nil. At this exact point a serious system must think about the cache stampede: 500 simultaneous misses send all 500 requests into the database at once. The fix: a distributed lock (SET NX) so only ONE request proceeds while the rest wait for its result.',
      },
      nodeStates: { redis: 'error' },
      sfx: 'buzz',
      log: { vi: 'GET post:42 → (nil)', en: 'GET post:42 → (nil)' },
      teachingNote: {
        vi: 'Điểm dừng để giảng cache stampede / thundering herd — lỗi kinh điển khiến website sập ngay sau khi cache bị purge.',
        en: 'Pause point for cache stampede / thundering herd — the classic reason a site falls over right after a cache purge.',
      },
    });

    steps.push({
      id: 'db-read',
      edge: 'e_api_db',
      kind: 'QUERY',
      duration: 1050,
      latencyMs: 14,
      packetLabel: 'SELECT',
      title: { vi: 'Buộc phải hỏi PostgreSQL', en: 'Fall through to PostgreSQL' },
      detail: {
        vi: 'Truy vấn thật, có join và tính toán — chậm hơn Redis khoảng 20 đến 40 lần. Chính con số này là lý do tầng đệm tồn tại.',
        en: 'A real query with joins and computation — roughly 20 to 40 times slower than Redis. That ratio is the entire reason the cache tier exists.',
      },
      nodeStates: { api: 'waiting', db: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'db-res',
      edge: 'e_api_db',
      reverse: true,
      kind: 'RESPONSE',
      duration: 950,
      latencyMs: 16,
      packetLabel: 'row',
      title: { vi: 'CSDL trả dữ liệu', en: 'Database returns the row' },
      detail: {
        vi: 'Dữ liệu tươi nhất, chắc chắn đúng. Đổi lại là chi phí cao nhất trong toàn chuỗi.',
        en: 'The freshest, guaranteed-correct data. In exchange it is the most expensive hop in the chain.',
      },
      nodeStates: { db: 'success', api: 'processing' },
      sfx: 'ping',
    });

    steps.push({
      id: 'fill',
      edge: 'e_api_redis',
      kind: 'POST',
      duration: 1000,
      packetLabel: 'SETEX 600',
      title: { vi: 'Nạp lại đệm kèm TTL', en: 'Populate the cache with a TTL' },
      detail: {
        vi: 'SET post:42 <json> EX 600. TTL là hợp đồng bạn ký với sự chính xác: 600 giây nghĩa là bạn chấp nhận dữ liệu có thể cũ tối đa 10 phút. Thêm chút ngẫu nhiên vào TTL (jitter) để hàng nghìn khoá không cùng hết hạn một lúc.',
        en: 'SET post:42 <json> EX 600. The TTL is the contract you sign with correctness: 600 seconds means you accept data up to ten minutes stale. Add a little jitter to the TTL so thousands of keys do not all expire in the same second.',
      },
      payload: { key: 'post:42', ttl: 600, bytes: 1284 },
      nodeStates: { redis: 'success' },
      sfx: 'click',
    });

    steps.push({
      id: 'miss-res-api',
      edge: 'e_cdn_api',
      reverse: true,
      kind: 'RESPONSE',
      duration: 950,
      status: 200,
      packetLabel: '200 OK',
      title: { vi: 'Phản hồi quay ra biên và được đệm lại', en: 'Response returns to the edge and gets stored' },
      detail: {
        vi: 'Cloudflare đọc header Cache-Control để quyết định có lưu hay không. Nếu origin trả no-store (rất hay gặp khi quên cấu hình), CDN sẽ MISS mãi mãi và bạn trả tiền cho một tầng đệm không bao giờ hoạt động.',
        en: 'Cloudflare reads Cache-Control to decide whether to store it. If the origin sends no-store — a very common oversight — the CDN misses forever and you pay for a cache tier that never works.',
      },
      headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600', 'CF-Cache-Status': 'MISS' },
      nodeStates: { api: 'idle', cdn: 'success' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'miss-res-client',
      edge: 'e_client_cdn',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1000,
      status: 200,
      latencyMs: 18,
      packetLabel: '200 OK',
      title: { vi: 'Người dùng nhận dữ liệu — tổng ~102ms', en: 'User receives the data — ~102ms total' },
      detail: {
        vi: 'So sánh trực tiếp: MISS đi 6 chặng, khoảng 102ms; HIT chỉ 2 chặng, khoảng 22ms. Chưa kể MISS còn tiêu tốn CPU của origin và một kết nối CSDL. Người kế tiếp mở cùng bài viết này sẽ được hưởng HIT.',
        en: 'Direct comparison: the MISS took six hops and about 102ms; a HIT takes two hops and about 22ms — and the MISS also burned origin CPU and a database connection. The next person opening this article gets the HIT.',
      },
      payload: ARTICLE,
      nodeStates: { cdn: 'idle', client: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};

/**
 * Chặng cuối chung cho các nhánh HIT.
 *
 * `from = 'cdn'` → chỉ một chặng biên → client (đây là điều làm HIT ở CDN
 * nhanh đến thế). `from = 'api'` → hai chặng, vì dữ liệu vẫn phải đi ngược
 * từ VPS qua PoP rồi mới tới người dùng.
 */
function hitResponse(from: 'cdn' | 'api', stale = false): SimStep[] {
  const label = stale ? '200 (stale)' : '200 HIT';
  const last: SimStep = {
    id: 'hit-res-client',
    edge: 'e_client_cdn',
    reverse: true,
    kind: 'CACHE_HIT',
    duration: 1000,
    latencyMs: 18,
    status: 200,
    packetLabel: label,
    title: {
      vi: from === 'cdn' ? 'Trả về từ biên — tổng ~22ms' : 'Về tới người dùng — tổng ~68ms',
      en: from === 'cdn' ? 'Served from the edge — ~22ms total' : 'Back at the user — ~68ms total',
    },
    detail: {
      vi:
        from === 'cdn'
          ? 'Hai chặng, kết thúc. Đây là con số bạn muốn thấy trên biểu đồ p95: phần lớn lưu lượng không bao giờ chạm tới hệ thống của bạn.'
          : 'Vẫn phải đi tới VPS nhưng tránh được CSDL. Redis gánh phần "đúng nhưng đắt", còn CDN gánh phần "xa nhưng lặp lại".',
      en:
        from === 'cdn'
          ? 'Two hops and done. This is the number you want on your p95 chart: most traffic never reaches your system at all.'
          : 'Still a trip to the VPS, but the database is spared. Redis absorbs the "correct but expensive" part; the CDN absorbs the "distant but repetitive" part.',
    },
    nodeStates: { client: 'success', cdn: 'idle' },
    sfx: 'success',
  };

  if (from === 'cdn') return [last];

  return [
    {
      id: 'hit-res-edge',
      edge: 'e_cdn_api',
      reverse: true,
      kind: 'CACHE_HIT',
      duration: 950,
      latencyMs: 46,
      status: 200,
      packetLabel: label,
      title: { vi: 'Phản hồi từ origin ra biên', en: 'Response leaves the origin for the edge' },
      detail: {
        vi: 'Chặng dài này là thứ mà một lần HIT ở CDN sẽ xoá bỏ hoàn toàn — lý do nên đệm ở cả hai tầng thay vì chọn một.',
        en: 'This long leg is exactly what a CDN HIT removes — the reason to cache at both tiers rather than pick one.',
      },
      nodeStates: { api: 'idle', cdn: 'processing' },
      sfx: 'swoosh',
    },
    last,
  ];
}
