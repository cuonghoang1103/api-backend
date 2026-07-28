/**
 * Node.js · Bài 12.2 — Cache-aside: khuôn mẫu và bốn lần nó phản chủ.
 *
 * Số đo lấy nguyên từ giáo trình (PostgreSQL thật, 500.000 ghi chú / 5.000
 * người dùng, cùng máy chủ cục bộ với chương 7):
 *
 *   bảng xếp hạng (GROUP BY 500k dòng) : 48,04 ms   · JSON 1.231 byte
 *   Redis GET + JSON.parse             :  0,40 ms   → nhanh hơn 120,0 lần
 *   "20 ghi chú mới nhất" (có chỉ mục)  :  0,46 ms   → cache chỉ mua được 0,06 ms
 *   payload 1.192 KB                   :  6,39 ms cache · 5,38 ms Postgres → cache THUA
 *
 *   tỉ lệ trúng  0% → 48,37 ms/request     90% →  5,19 ms/request
 *                50% → 24,91 ms/request     99% →  0,43 ms/request · 100% → 0,20
 *
 *   200 request đồng thời, cache rỗng:
 *     ngây thơ 200 truy vấn / 6.064,6 ms · single-flight 1 / 65,3 ms
 *     khoá phân tán 1 / 99,1 ms · cache ấm 0 / 14,9 ms
 *
 * Bài này có một điều bất ngờ mà kịch bản phải giữ nguyên: cache KHÔNG phải
 * lúc nào cũng thắng. Vì thế biểu đồ luôn để hai cột cạnh nhau (cache vs
 * Postgres) thay vì chỉ khoe cột cache.
 */

import { Database } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const PATTERN_CODE = [
  'async function getLeaderboard() {',
  "  const hit = await redis.get('lb:top20');   // 1. hỏi cache",
  '  if (hit) return JSON.parse(hit);           // 2. trúng → xong',
  '  const rows = await db.query(SQL_HEAVY);    // 3. trượt → nguồn thật',
  "  await redis.set('lb:top20', JSON.stringify(rows),",
  "                  'EX', 60);                 // 4. ghi lại, CÓ HẠN",
  '  return rows;',
  '}',
];

const HITRATE_CODE = [
  '// 300 request, thay đổi tỉ lệ trúng cache',
  '//',
  '//   0% → 48,37 ms/request',
  '//  50% → 24,91 ms/request',
  '//  90% →  5,19 ms/request',
  '//  99% →  0,43 ms/request',
  '// 100% →  0,20 ms/request',
  '',
  '// cảnh báo đặt vào SỐ LẦN TRƯỢT MỖI GIÂY,',
  '// đừng đặt vào phần trăm trúng',
];

const STAMPEDE_CODE = [
  'const inflight = new Map();',
  '',
  'async function getLeaderboard() {',
  '  const hit = await redis.get(KEY);',
  '  if (hit) return JSON.parse(hit);',
  '  if (inflight.has(KEY)) return inflight.get(KEY);  // bám vào',
  '  const p = (async () => {',
  '    const rows = await db.query(SQL_HEAVY);',
  "    await redis.set(KEY, JSON.stringify(rows), 'EX', 60);",
  '    return rows;',
  '  })().finally(() => inflight.delete(KEY));',
  '  inflight.set(KEY, p);',
  '  return p;',
  '}',
];

const TTL_CODE = [
  "await redis.set('k', v, 'EX', 100);   // TTL = 100",
  '',
  "await redis.set('k', v2);             // TTL → -1  ✗ BẤT TỬ",
  "await redis.set('k', v2, 'KEEPTTL');  // TTL → 100 ✓",
  '',
  '// TTL -2 = khoá đã biến mất',
  '// TTL -1 = tồn tại nhưng KHÔNG có hạn',
  '',
  '// jitter: để 50 khoá đừng chết chùm',
  "redis.set(k, v, 'EX', 60 + Math.floor(Math.random() * 30));",
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'pattern' | 'hitrate' | 'stampede' | 'ttl';
const modeOf = (opts: ScenarioOptions): Mode =>
  opts.mode === 'hitrate' || opts.mode === 'stampede' || opts.mode === 'ttl' ? opts.mode : 'pattern';

const CHART_TITLE: Record<Mode, I18nText> = {
  pattern: { vi: 'Cache so với hỏi thẳng Postgres (ms)', en: 'Cache versus asking Postgres directly (ms)' },
  hitrate: { vi: 'Mỗi request tốn bao nhiêu, theo tỉ lệ trúng (ms)', en: 'Cost per request by hit rate (ms)' },
  stampede: { vi: '200 request đồng thời, cache rỗng (ms)', en: '200 concurrent requests, cold cache (ms)' },
  ttl: { vi: 'Thời gian sống còn lại của khoá (giây)', en: 'Seconds of life left on the key' },
};

const CHART_MAX: Record<Mode, number> = { pattern: 8, hitrate: 52, stampede: 6400, ttl: 105 };

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const mode = modeOf(opts);
  return [
    {
      id: 'code',
      kind: 'code',
      title: { vi: 'Đoạn mã', en: 'The code' },
      x: 0,
      y: 0,
      w: 452,
      h: 300,
      lines:
        mode === 'hitrate' ? HITRATE_CODE : mode === 'stampede' ? STAMPEDE_CODE : mode === 'ttl' ? TTL_CODE : PATTERN_CODE,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Cái giá thật của một request', en: 'What one request really costs' },
      hint: { vi: '500.000 ghi chú · 5.000 người dùng', en: '500,000 notes · 5,000 users' },
      x: 0,
      y: 312,
      w: 452,
      h: 248,
      accent: '#f59e0b',
      meters: [
        { id: 'db', label: 'Số lần hỏi Postgres', max: 200, unit: 'truy vấn', accent: '#f43f5e' },
        { id: 'ms', label: 'Thời gian mỗi request', max: 50, unit: 'ms', threshold: 1, thresholdLabel: 'ngưỡng dễ chịu', accent: '#f59e0b' },
        { id: 'kb', label: 'Kích thước mục cache', max: 1200, unit: 'KB', accent: '#38bdf8' },
      ],
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: CHART_TITLE[mode],
      hint:
        mode === 'pattern'
          ? { vi: 'cache không phải lúc nào cũng thắng', en: 'the cache does not always win' }
          : undefined,
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: '#34d399',
      unit: mode === 'ttl' ? 'giây' : 'ms',
      max: CHART_MAX[mode],
    },
    {
      id: 'log',
      kind: 'log',
      title: { vi: 'Kết quả đo', en: 'Measured output' },
      file: 'node cache-lab.js',
      x: 464,
      y: 360,
      w: 536,
      h: 200,
      accent: '#38bdf8',
      maxLines: 7,
    },
  ];
};

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const log = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'muted'): PanelOp => ({
  p: 'log',
  op: 'push',
  item: { label, tone },
});
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — KHUÔN MẪU, VÀ CHỖ NÓ THUA
   ──────────────────────────────────────────────────────────── */

function buildPattern(): SimStep[] {
  const { steps, push } = collector();

  push(
    'miss',
    { vi: 'Trượt cache — 48,04 ms dựng bảng xếp hạng', en: 'Cache miss — 48.04 ms to build the leaderboard' },
    {
      vi: 'Truy vấn đắt tiền là một bảng xếp hạng: `GROUP BY` trên toàn bộ 500.000 dòng rồi sắp theo tổng lượt xem. Đó là dạng truy vấn mà sản phẩm nào rồi cũng mọc ra — và cũng là dạng mà cache sinh ra để phục vụ.',
      en: 'The expensive query is a leaderboard: `GROUP BY` over all 500,000 rows, sorted by total views. Every product eventually grows one — and it is exactly the shape a cache exists to serve.',
    },
    2500,
    [
      lines([4, 5, 6]),
      gauge('db', 1, '1 truy vấn', 'warn'),
      gauge('ms', 48.04, '48,04 ms', 'err'),
      gauge('kb', 1.2, '1,2 KB', 'ok'),
      bar('Postgres (tổng hợp)', 48.04, '48,04', 'err'),
      log('[1] bảng xếp hạng GROUP BY 500k dòng: 48,04ms'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'hit',
    { vi: 'Trúng cache — 0,40 ms, nhanh hơn 120 lần', en: 'Cache hit — 0.40 ms, 120× faster' },
    {
      vi: 'Hai phần ba của 0,40 ms là vòng đi-về mạng tới Redis (0,26 ms); `JSON.parse` tốn 0,01 ms. Ở kích thước 1,2 KB này thì JSON gần như miễn phí — điều sẽ không còn đúng ở bước sau.',
      en: 'Two thirds of that 0.40 ms is the network round trip to Redis (0.26 ms); `JSON.parse` costs 0.01 ms. At 1.2 KB, JSON is nearly free — which stops being true in the next step.',
    },
    2600,
    [
      lines([2, 3]),
      gauge('db', 0, '0 truy vấn', 'ok'),
      gauge('ms', 0.4, '0,40 ms', 'ok'),
      bar('Redis (1,2 KB)', 0.4, '0,40', 'ok'),
      log('[2] Redis GET + JSON.parse: 0,40ms → nhanh hơn 120,0×', 'ok'),
      log('[3] GET thô 0,26ms | parse 0,01ms | stringify 0,00ms'),
    ],
    { sfx: 'success' }
  );

  push(
    'indexed',
    { vi: 'Đừng cache thứ vốn đã nhanh', en: 'Do not cache what is already fast' },
    {
      vi: 'Truy vấn "20 ghi chú mới nhất" — cái thật sự dựng nên trang chủ — vốn đã chạy trong 0,46 ms nhờ chỉ mục ở bài 7.5. Cache nó mua được 0,06 ms và tặng kèm cho bạn một con bug làm mới cache. Hãy cache thứ được TỔNG HỢP, đừng cache thứ được TRA CHỈ MỤC.',
      en: 'The "20 newest notes" query — the one that actually builds the home page — already runs in 0.46 ms thanks to the index from lesson 7.5. Caching it buys 0.06 ms and hands you a cache-invalidation bug for free. Cache what is AGGREGATED, not what is INDEX-LOOKED-UP.',
    },
    2800,
    [
      bar('trang chủ (có chỉ mục)', 0.46, '0,46', 'ok'),
      log('[1] trang chủ 20 dòng mới nhất: 0,46ms  ← đã nhanh sẵn', 'warn'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'So cột 48,04 với cột 0,46: chỉ MỘT trong hai đáng cache.',
        en: 'Compare the 48.04 bar with the 0.46 bar: only ONE of them is worth caching.',
      },
    }
  );

  push(
    'big',
    { vi: 'Payload 1,2 MB — chỗ cache THUA hẳn', en: 'A 1.2 MB payload — where the cache LOSES' },
    {
      vi: 'Cache 5.000 ghi chú kèm cả nội dung: GET 4,45 ms cộng `JSON.parse` 1,93 ms = 6,39 ms, trong khi lấy thẳng từ Postgres chỉ 5,38 ms. Cache làm endpoint CHẬM ĐI 18%. Postgres không chậm ở việc tuôn dòng ra; nó chậm ở việc tổng hợp chúng lại.',
      en: 'Cache 5,000 notes with their bodies: GET 4.45 ms plus `JSON.parse` 1.93 ms = 6.39 ms, while asking Postgres directly costs 5.38 ms. The cache makes the endpoint 18% SLOWER. Postgres is not slow at streaming rows out; it is slow at aggregating them.',
    },
    3000,
    [
      gauge('ms', 6.39, '6,39 ms', 'err'),
      gauge('kb', 1192, '1.192 KB', 'err'),
      bar('Redis (1,2 MB)', 6.39, '6,39', 'err'),
      bar('Postgres (1,2 MB)', 5.38, '5,38', 'warn'),
      log('[4] payload 1192KB: GET 4,45 + parse 1,93 = 6,39ms', 'err'),
      log('    cùng dữ liệu từ Postgres: 5,38ms → cache THUA 0,8×', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Cache thứ ĐẮT ĐỂ TÍNH RA, đừng cache thứ chỉ đơn giản là TO.',
        en: 'Cache what is expensive to COMPUTE, not what is merely LARGE.',
      },
    }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — TỈ LỆ TRÚNG KHÔNG HỀ TUYẾN TÍNH
   ──────────────────────────────────────────────────────────── */

function buildHitrate(): SimStep[] {
  const { steps, push } = collector();

  push(
    'zero',
    { vi: '0% trúng — 48,37 ms mỗi request', en: '0% hits — 48.37 ms per request' },
    {
      vi: 'Mốc chuẩn: 300 request, không có cache nào cả. Mỗi request trả trọn giá dựng bảng xếp hạng.',
      en: 'The baseline: 300 requests, no cache at all. Every request pays the full leaderboard price.',
    },
    2300,
    [
      lines([3]),
      gauge('db', 200, '300/300 trượt', 'err'),
      gauge('ms', 48.37, '48,37 ms', 'err'),
      gauge('kb', 1.2, '1,2 KB', 'ok'),
      bar('0%', 48.37, '48,37', 'err'),
      log('[7] tỉ lệ trúng  0%: 300 request → 48,37ms/request', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'fifty',
    { vi: '50% trúng — 24,91 ms. Đúng một nửa, y như dự đoán.', en: '50% hits — 24.91 ms. Exactly half, as expected.' },
    {
      vi: 'Tới đây mọi thứ vẫn tuyến tính, và trực giác của bạn vẫn đúng. Đó chính là cái bẫy: người ta ngoại suy từ đúng khúc này.',
      en: 'So far it is linear and your intuition holds. That is the trap: people extrapolate from exactly this stretch.',
    },
    2400,
    [lines([4]), gauge('ms', 24.91, '24,91 ms', 'err'), bar('50%', 24.91, '24,91', 'err'), log('[7]  50%: 24,91ms/request', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'ninety',
    { vi: '90% trúng — 5,19 ms. Nghe tuyệt vời. Không hề.', en: '90% hits — 5.19 ms. Sounds great. It is not.' },
    {
      vi: 'Ở mức 90%, cứ mười request vẫn có một request trả đủ 48 ms, và chính request đó thống trị số trung bình. "Tỉ lệ trúng 90%" là con số mà mọi bảng điều khiển đều khoe, và nó tệ hơn mức 99% tới mười hai lần.',
      en: 'At 90%, one request in ten still pays the full 48 ms, and that request dominates the average. "90% hit rate" is the number every dashboard brags about, and it is twelve times worse than 99%.',
    },
    2700,
    [lines([5]), gauge('ms', 5.19, '5,19 ms', 'warn'), bar('90%', 5.19, '5,19', 'warn'), log('[7]  90%: 5,19ms/request', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'ninetynine',
    { vi: '99% → 0,43 ms · 100% → 0,20 ms', en: '99% → 0.43 ms · 100% → 0.20 ms' },
    {
      vi: 'Chín phần trăm cuối cùng của tỉ lệ trúng mua được nhiều hơn cả chín mươi phần trăm đầu tiên cộng lại. Đường cong dốc đứng ở cuối, chứ không thoải đều.',
      en: 'The last nine percent of hit rate buys more than the first ninety combined. The curve is a cliff at the end, not a gentle slope.',
    },
    2800,
    [
      lines([6, 7]),
      gauge('db', 3, '3/300 trượt', 'ok'),
      gauge('ms', 0.43, '0,43 ms', 'ok'),
      bar('99%', 0.43, '0,43', 'ok'),
      bar('100%', 0.2, '0,20', 'ok'),
      log('[7]  99%: 0,43ms/request', 'ok'),
      log('[7] 100%: 0,20ms/request', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'alarm',
    { vi: 'Vì thế hãy cảnh báo theo SỐ LẦN TRƯỢT MỖI GIÂY', en: 'So alert on MISSES PER SECOND' },
    {
      vi: 'Phần trăm trúng là một con số đã bị làm phẳng — nó giấu đi đúng cái thứ đang làm bạn đau. Số lần trượt mỗi giây thì tỉ lệ thẳng với tải đổ lên cơ sở dữ liệu. Đây cũng là lý do câu "bọn em thêm cache rồi mà vẫn chậm" phổ biến đến thế.',
      en: 'Hit percentage is an averaged number — it hides precisely the thing that hurts. Misses per second is directly proportional to the load landing on your database. It is also why "we added a cache and it is still slow" is such a common sentence.',
    },
    2900,
    [lines([9, 10]), log('cảnh báo: misses/giây, KHÔNG phải % trúng', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — CƠN GIẪM ĐẠP
   ──────────────────────────────────────────────────────────── */

function buildStampede(): SimStep[] {
  const { steps, push } = collector();

  push(
    'naive',
    { vi: '200 request cùng trượt — 200 truy vấn giống hệt nhau', en: '200 requests miss together — 200 identical queries' },
    {
      vi: 'Một khoá đắt khách vừa hết hạn. Hai trăm request đang bay đều trượt, đều hỏi cơ sở dữ liệu, đều ghi cùng một giá trị trở lại: 6.064,6 ms. Để ý là đoạn code đó ĐÚNG — ai cũng nhận được câu trả lời chính xác. Nó vừa đúng vừa là một đòn từ chối dịch vụ do chính bạn viết ra.',
      en: 'A popular key just expired. Two hundred in-flight requests all miss, all ask the database, all write the same value back: 6,064.6 ms. Note the code is CORRECT — everybody gets the right answer. It is simultaneously correct and a denial-of-service attack you wrote yourself.',
    },
    2900,
    [
      lines([4, 5]),
      gauge('db', 200, '200 truy vấn', 'err'),
      gauge('ms', 30.3, '30,3 ms', 'err'),
      gauge('kb', 1.2, '1,2 KB', 'ok'),
      bar('ngây thơ, cache rỗng', 6064.6, '6.064,6', 'err'),
      log('[1] cache-aside ngây thơ  200 truy vấn | 6064,6ms', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là kiểu hỏng làm SẬP production, và nó không để lại lỗi nào trong log.',
        en: 'This is the failure that takes production down, and it logs no errors at all.',
      },
    }
  );

  push(
    'warm',
    { vi: 'Cùng đoạn code đó, khi cache tình cờ ẤM — 14,9 ms', en: 'The same code with a warm cache — 14.9 ms' },
    {
      vi: 'Nhanh hơn 400 lần. Không đổi một dòng nào. Độ trễ endpoint của bạn giờ phụ thuộc vào một cú tung đồng xu — và cú tung đó rơi vào mặt xấu đúng lúc lưu lượng cao nhất, vì khoá đắt khách nhất là khoá hết hạn giữa cơn cao điểm.',
      en: '400× faster. Not one line changed. Your endpoint latency now depends on a coin flip — and the coin lands badly exactly at peak traffic, because the most popular key is the one that expires mid-rush.',
    },
    2700,
    [
      gauge('db', 0, '0 truy vấn', 'ok'),
      gauge('ms', 0.07, '0,07 ms', 'ok'),
      bar('ngây thơ, cache ấm', 14.9, '14,9', 'ok'),
      log('[4] ngây thơ, cache ẤM     0 truy vấn |   14,9ms', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'single',
    { vi: 'Single-flight — 12 dòng, 1 truy vấn, nhanh hơn 93 lần', en: 'Single-flight — 12 lines, 1 query, 93× faster' },
    {
      vi: 'Người đầu tiên trượt thì nạp; những người tới sau BÁM VÀO đúng lời hứa đó. Nó chạy được vì event loop chỉ có một luồng: giữa `inflight.has` và `inflight.set` không có gì chen vào được, nên chẳng có cuộc đua nào phải lo.',
      en: 'The first misser loads; everyone arriving after LATCHES ONTO that same promise. It works because the event loop is single-threaded: nothing can interleave between `inflight.has` and `inflight.set`, so there is no race to worry about.',
    },
    2900,
    [
      lines([6, 7, 8, 9, 10, 11, 12, 13]),
      gauge('db', 1, '1 truy vấn', 'ok'),
      gauge('ms', 0.33, '0,33 ms', 'ok'),
      bar('single-flight', 65.3, '65,3', 'ok'),
      log('[2] single-flight          1 truy vấn |   65,3ms', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'lock',
    { vi: 'Khoá phân tán — khi một truy vấn MỖI TIẾN TRÌNH vẫn là quá nhiều', en: 'A distributed lock — when one query PER PROCESS is still too many' },
    {
      vi: 'Hạn chế nằm ngay trong cái tên "trong một tiến trình": bốn tiến trình Node sau một bộ cân bằng tải nghĩa là bốn truy vấn chứ không phải một. Với một báo cáo chạy 10 giây hay một lệnh gọi API tính tiền, hãy giành `SET NX` trong Redis để đúng MỘT tiến trình trong cả cụm làm việc đó. Đắt hơn (99,1 ms) vì kẻ thua cuộc phải chờ.',
      en: 'The limitation is in the name "in-process": four Node processes behind a load balancer means four queries, not one. For a 10-second report or a metered third-party call, take a `SET NX` lock in Redis so exactly ONE process in the cluster does the work. It costs more (99.1 ms) because the losers have to wait.',
    },
    3000,
    [
      lines([]),
      bar('khoá phân tán', 99.1, '99,1', 'ok'),
      log('[3] khoá SET NX            1 truy vấn |   99,1ms', 'ok'),
      log('bài 12.4: lệnh DEL ngây thơ ở đây là SAI', 'warn'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   D — TTL: HAI SỐ ÂM ĐÁNG THUỘC LÒNG
   ──────────────────────────────────────────────────────────── */

function buildTtl(): SimStep[] {
  const { steps, push } = collector();

  push(
    'countdown',
    { vi: 'TTL đếm ngược — rồi khoá biến mất', en: 'The TTL counts down — then the key is gone' },
    {
      vi: 'Sau 0 ms: giá trị còn đó, TTL = 3. Sau 2.000 ms: `GET` trả về `null`, TTL = -2. Hai số âm đáng để thuộc lòng: **-2 là đã biến mất, -1 là bất tử**.',
      en: 'At 0 ms: value present, TTL = 3. At 2,000 ms: `GET` returns `null`, TTL = -2. Two negative numbers worth memorising: **-2 means gone, -1 means immortal**.',
    },
    2500,
    [
      lines([1]),
      gauge('db', 0, '0 truy vấn', 'ok'),
      gauge('ms', 0.4, '0,40 ms', 'ok'),
      gauge('kb', 1.2, '1,2 KB', 'ok'),
      bar('TTL 100 (đúng)', 100, '100', 'ok'),
      log('[5] sau    0ms: GET="xin chào" TTL=3'),
      log('[5] sau 2000ms: GET=null       TTL=-2', 'warn'),
    ],
    { sfx: 'click' }
  );

  push(
    'lost',
    { vi: '`SET` không kèm `EX` XOÁ MẤT cái hạn', en: '`SET` without `EX` WIPES the expiry' },
    {
      vi: 'Ghi đè lên một khoá vốn đã có hạn mà không lặp lại `EX` sẽ xoá luôn cái hạn đó. Khoá bây giờ sống tới khi Redis khởi động lại hoặc trục xuất nó. Chỉ cần MỘT nhánh code làm mới cache trong cả dự án quên `EX` là đủ để Redis từ từ đầy ứ những mục cũ bất tử.',
      en: 'Overwriting a key that had an expiry, without repeating `EX`, deletes that expiry. The key now lives until Redis restarts or evicts it. ONE cache-refresh branch anywhere in the project that forgets `EX` is enough to slowly fill Redis with immortal stale entries.',
    },
    2900,
    [
      lines([3]),
      bar('SET không EX', 0, '-1 · bất tử', 'err'),
      log('[6] SET lại KHÔNG kèm EX: TTL 100 → -1', 'err'),
      log('    khoá sống mãi tới khi Redis restart/evict', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là cách một cache lặng lẽ biến thành chỗ rò rỉ bộ nhớ.',
        en: 'This is how a cache quietly turns into a memory leak.',
      },
    }
  );

  push(
    'keepttl',
    { vi: '`KEEPTTL` — "cập nhật giá trị, giữ nguyên hạn"', en: '`KEEPTTL` — "update the value, keep the deadline"' },
    {
      vi: 'Một từ khoá, và cả lớp lỗi trên biến mất. Hãy dùng nó ở mọi chỗ ý bạn là cập nhật giá trị chứ không phải bắt đầu lại vòng đời của khoá.',
      en: 'One keyword and that entire class of bug disappears. Use it everywhere you mean "update the value", not "restart the key\'s lifetime".',
    },
    2600,
    [lines([4]), bar('SET … KEEPTTL', 100, '100', 'ok'), log('[6] dùng KEEPTTL → TTL vẫn 100', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'jitter',
    { vi: 'Jitter — để 50 khoá đừng chết chùm', en: 'Jitter — so 50 keys do not die together' },
    {
      vi: 'Nếu một lần deploy làm ấm 50 cache trong cùng một giây với cùng một TTL thì sáu mươi giây sau cả 50 cùng hết hạn trong cùng một giây — một cơn giẫm đạp ĐỒNG BỘ trên nhiều khoá khác nhau, thứ mà khoá theo từng khoá không cứu được. Cộng thêm 0–30 giây ngẫu nhiên thì hạn rải ra 60–89 giây, và nó không tốn gì cả.',
      en: 'If a deploy warms 50 caches in the same second with the same TTL, sixty seconds later all 50 expire in the same second — a SYNCHRONISED stampede across different keys, which per-key locking cannot save you from. Adding a random 0–30 seconds spreads expiry over 60–89 seconds, and costs nothing.',
    },
    3000,
    [
      lines([9, 10]),
      bar('TTL 60 cố định', 60, '60 · chết chùm', 'err'),
      bar('TTL 60 + jitter', 89, '60–89 · rải ra', 'ok'),
      log('[5] 50 khoá TTL cố định → hết hạn trong CÙNG một giây', 'err'),
      log('[5] 50 khoá + jitter 0–30s → rải ra 60–89s', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsCacheAsideScenario: Scenario = {
  id: 'nodejs-cache-aside',
  name: { vi: 'Cache-aside và bốn lần nó phản chủ', en: 'Cache-aside and its four betrayals' },
  tagline: {
    vi: 'Cache một bảng xếp hạng 1,2 KB: nhanh hơn 120 lần. Cache một danh sách 1,2 MB: CHẬM đi 18%. Tỉ lệ trúng 90% tệ hơn 99% tới mười hai lần. Và một khoá đắt khách hết hạn có thể bắn 200 truy vấn giống hệt nhau bằng đoạn code hoàn toàn đúng.',
    en: 'Cache a 1.2 KB leaderboard: 120× faster. Cache a 1.2 MB list: 18% SLOWER. A 90% hit rate is twelve times worse than 99%. And one popular key expiring can fire 200 identical queries from perfectly correct code.',
  },
  icon: Database,
  accent: '#38bdf8',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '12.2',
    slug: 'nodejs-12-2-cache-aside',
    title: { vi: 'Cache-aside: khuôn mẫu và bốn lần nó phản chủ', en: 'Cache-aside: the pattern and its four betrayals' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Xem gì', en: 'What to watch' },
      defaultValue: 'pattern',
      choices: [
        {
          value: 'pattern',
          label: 'Khuôn mẫu',
          fullLabel: '48,04 ms → 0,40 ms … và chỗ cache THUA',
          color: '#34d399',
          hint: { vi: 'cache thứ đắt để TÍNH, không phải thứ TO', en: 'cache what is expensive to COMPUTE, not what is LARGE' },
        },
        {
          value: 'hitrate',
          label: 'Tỉ lệ trúng',
          fullLabel: '0 → 50 → 90 → 99 → 100%: đường cong là vách đá',
          color: '#f59e0b',
          hint: { vi: '90% tệ hơn 99% mười hai lần', en: '90% is twelve times worse than 99%' },
        },
        {
          value: 'stampede',
          label: 'Giẫm đạp',
          fullLabel: '200 request cùng trượt → 6.064,6 ms',
          color: '#f43f5e',
          hint: { vi: 'code đúng, mà vẫn là tự sập', en: 'correct code that still takes you down' },
        },
        {
          value: 'ttl',
          label: 'TTL',
          fullLabel: 'TTL -1 bất tử · KEEPTTL · jitter',
          color: '#a78bfa',
          hint: { vi: 'cách một cache biến thành chỗ rò rỉ', en: 'how a cache turns into a leak' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'hitrate' ? buildHitrate() : mode === 'stampede' ? buildStampede() : mode === 'ttl' ? buildTtl() : buildPattern();
  },
};
