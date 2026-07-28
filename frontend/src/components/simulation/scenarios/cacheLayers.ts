/**
 * Tầng đệm — cùng một dữ liệu, nhưng lấy ra từ đâu.
 *
 * Kịch bản này tồn tại để chạy thử hai loại panel mới (`membrane` và `race`),
 * nhưng bài học của nó là bài thật: người mới học gần như luôn hình dung đệm
 * là MỘT cái hộp ("có Redis là nhanh"). Thực tế một request đi qua nhiều
 * tầng chồng lên nhau, và câu hỏi đáng giá không phải "có đệm không" mà là
 * "nó đi được BAO SÂU trước khi có người trả lời".
 *
 * SỐ LIỆU — là con số ĐIỂN HÌNH, không phải đo từ một máy cụ thể. Chúng được
 * dựng từ những thành phần ai cũng kiểm lại được, và kịch bản nói rõ điều đó
 * ở phần lời giảng thay vì giả vờ là kết quả benchmark:
 *
 *   đệm trình duyệt (bộ nhớ, không ra mạng)      ≈  0,1 ms
 *   CDN biên cùng thành phố (RTT ~12 ms)         ≈ 12   ms
 *   máy chủ gốc + Redis  (RTT ~40 ms + 0,9 ms)   ≈ 41   ms
 *   máy chủ gốc + PostgreSQL (40 ms + 47,6 ms)   ≈ 88   ms
 *
 * Thứ tự ấy mới là điều đáng nhớ: Redis nhanh hơn Postgres RẤT nhiều, nhưng
 * một cú trúng Redis vẫn CHẬM HƠN một cú trúng CDN gấp ba lần, vì nó vẫn phải
 * đi hết đường mạng tới máy chủ gốc. Tầng nào chặn được sớm hơn thì thắng —
 * kể cả khi tầng ấy "kém thông minh" hơn.
 *
 * Ba nhánh cố ý không có nhánh nào là "đệm luôn thắng":
 *   ấm    — lưu lượng lặp lại, đệm ăn thật (×2,9)
 *   lạnh  — mỗi request một khoá khác nhau, đệm KHÔNG mua được gì (×1,0)
 *   cũ    — đệm trả lời nhanh gấp bội, và trả về số SAI
 */

import { Layers } from 'lucide-react';
import { MEMBRANE_SINK, type PanelOp, type PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Số đo (ms, tính từ phía người dùng) ─────────────────────── */

const MS_BROWSER = 0.1;
const MS_CDN = 12;
const MS_REDIS = 41;
const MS_DB = 88;

const BROWSER = 'browser';
const CDN = 'cdn';
const REDIS = 'redis';

/* ── Panel ───────────────────────────────────────────────────── */

const panels: PanelSpec[] = [
  {
    id: 'layers',
    kind: 'membrane',
    title: { vi: 'GET /posts đi được bao sâu', en: 'How deep GET /posts travels' },
    hint: { vi: 'mỗi màng là một tầng đệm', en: 'each membrane is a cache layer' },
    x: 0,
    y: 0,
    w: 618,
    h: 396,
    accent: '#38bdf8',
    source: { vi: 'Trình duyệt phát request', en: 'The browser fires a request' },
    layers: [
      {
        id: BROWSER,
        label: 'Đệm trình duyệt',
        sub: { vi: 'trên máy · ≈ 0,1 ms', en: 'on device · ≈ 0.1 ms' },
        at: 0.13,
        accent: '#34d399',
      },
      {
        id: CDN,
        label: 'CDN biên',
        sub: { vi: 'cùng thành phố · ≈ 12 ms', en: 'same city · ≈ 12 ms' },
        at: 0.45,
        accent: '#a78bfa',
      },
      {
        id: REDIS,
        label: 'Redis',
        sub: { vi: 'ở máy chủ gốc · ≈ 41 ms', en: 'at the origin · ≈ 41 ms' },
        at: 0.78,
        accent: '#38bdf8',
      },
    ],
    sink: {
      label: 'PostgreSQL',
      sub: { vi: 'nguồn thật · ≈ 88 ms', en: 'origin of truth · ≈ 88 ms' },
      accent: '#f43f5e',
    },
  },
  {
    id: 'log',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Log' },
    file: 'curl -sv https://cuongthai.com/posts',
    x: 634,
    y: 0,
    w: 366,
    h: 396,
    accent: '#7f92b4',
    maxLines: 11,
  },
  {
    id: 'race',
    kind: 'race',
    title: { vi: 'Cùng 5 request ấy tốn bao nhiêu', en: 'What those same requests cost' },
    hint: { vi: 'cộng dồn thời gian người dùng phải chờ', en: 'total time the user waits' },
    x: 0,
    y: 408,
    w: 1000,
    h: 152,
    accent: '#38bdf8',
    unit: 'ms',
    better: 'lower',
    showDelta: true,
    tracks: [
      {
        id: 'plain',
        label: 'NO CACHE',
        countLabel: { vi: 'lượt xuống CSDL', en: 'trips to the DB' },
        accent: '#f43f5e',
      },
      {
        id: 'layered',
        label: '3 CACHE LAYERS',
        countLabel: { vi: 'lượt xuống CSDL', en: 'trips to the DB' },
        accent: '#34d399',
      },
    ],
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const log = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'muted'): PanelOp => ({
  p: 'log',
  op: 'push',
  item: { label, tone },
});

/** Một hạt rơi xuống tầng `lane` (dùng `MEMBRANE_SINK` cho "rơi tới CSDL"). */
const drop = (lane: string, label: string, tone?: 'ok' | 'warn' | 'err' | 'info'): PanelOp => ({
  p: 'layers',
  op: 'push',
  lane,
  item: { label, tone },
});

const spotlight = (lane: string | null): PanelOp => ({ p: 'layers', op: 'active', value: lane });

const counter = (lane: string, n: number, text: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'layers',
  op: 'value',
  key: lane,
  value: n,
  label: text,
  tone,
});

/** Đồng hồ cộng dồn của một đường đua. */
const clock = (track: string, ms: number, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'race',
  op: 'value',
  key: track,
  value: ms,
  label: `${ms.toFixed(1).replace('.', ',')} ms`,
  tone,
});

/** Một lượt xuống CSDL — đếm hộ đường đua (số hiện ở giữa hàng). */
const dbTrip = (track: string): PanelOp => ({ p: 'race', op: 'push', lane: track, item: { label: 'db' } });

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (step) => {
    steps.push({ kind: 'INTERNAL', ...step } as SimStep);
  };
  return { steps, push };
}

/**
 * Bộ đếm chạy dọc kịch bản. Đường `plain` cộng 88 ms cho MỌI request — nó là
 * đường tham chiếu "nếu không có đệm nào cả", nên nó cộng đều bất kể nhánh.
 */
function meters() {
  let plain = 0;
  let layered = 0;
  return {
    /** Ops cập nhật hai đường đua sau một request tốn `ms` ở nhánh có đệm. */
    tick(ms: number, hitDb: boolean, tone?: 'ok' | 'warn' | 'err'): PanelOp[] {
      plain += MS_DB;
      layered += ms;
      const ops: PanelOp[] = [dbTrip('plain'), clock('plain', plain), clock('layered', layered, tone)];
      if (hitDb) ops.push(dbTrip('layered'));
      return ops;
    },
  };
}

/* ────────────────────────────────────────────────────────────
   A — ĐỆM ẤM DẦN: đúng cái mà người ta hình dung khi nói "có đệm"
   ──────────────────────────────────────────────────────────── */

function buildWarm(): SimStep[] {
  const { steps, push } = collector();
  const m = meters();

  push({
    id: 'cold-start',
    title: { vi: 'Người đầu tiên mở trang — mọi tầng đều rỗng', en: 'First visitor — every layer is empty' },
    detail: {
      vi: 'Chưa ai hỏi /posts bao giờ, nên không tầng nào có gì để trả lời. Hạt rơi xuyên qua cả ba màng: đệm trình duyệt trượt, CDN biên trượt, Redis trượt. Người dùng chờ hết đường mạng tới máy chủ gốc CỘNG thời gian truy vấn.',
      en: 'Nobody has asked for /posts yet, so no layer has anything to answer with. The request falls through all three membranes and the user waits for the full network trip plus the query.',
    },
    duration: 2600,
    sfx: 'swoosh',
    ops: [
      spotlight(null),
      drop(MEMBRANE_SINK, 'GET /posts', 'err'),
      log('› GET /posts', 'muted'),
      log('  cache-control: (chưa có)', 'muted'),
      log('  cf-cache-status: MISS', 'warn'),
      log('  redis GET posts:p1 → (nil)', 'warn'),
      log('  SELECT … LIMIT 20 → 47,6 ms', 'err'),
      counter(MEMBRANE_SINK, 1, 'MISS ×3'),
      ...m.tick(MS_DB, true),
    ],
  });

  push({
    id: 'write-back',
    title: { vi: 'Trả lời xong thì GHI NGƯỢC lên cả ba tầng', en: 'The answer is written back into all three layers' },
    detail: {
      vi: 'Đây là bước hay bị bỏ quên khi vẽ sơ đồ đệm. Câu trả lời không chỉ đi về trình duyệt: trên đường về nó được ghi lại ở Redis, được CDN biên giữ một bản, và tiêu đề cache-control bảo trình duyệt tự giữ thêm một bản nữa. Một request vừa trả tiền cho bốn chỗ.',
      en: 'This is the step most cache diagrams skip. On its way back the answer is stored in Redis, kept by the edge, and cache-control tells the browser to keep a copy too. One request just paid for four places.',
    },
    duration: 2400,
    sfx: 'success',
    ops: [
      { p: 'layers', op: 'shift', lane: MEMBRANE_SINK },
      // Bản sao đã CẤT dùng tone 'info', request vừa tới dùng 'ok': hai thứ
      // cùng nằm trên một màng mà cùng màu thì không đọc ra được cái nào là
      // kho, cái nào là người đang hỏi.
      drop(REDIS, 'posts:p1', 'info'),
      drop(CDN, 'posts:p1', 'info'),
      drop(BROWSER, 'posts:p1', 'info'),
      log('‹ 200 OK · 88 ms', 'ok'),
      log('  cache-control: max-age=60', 'ok'),
      log('  redis SET posts:p1 EX 60', 'ok'),
      counter(REDIS, 1, 'SET'),
      counter(CDN, 1, 'STORE'),
      counter(BROWSER, 1, 'STORE'),
    ],
  });

  push({
    id: 'f5',
    title: { vi: 'Cũng người ấy bấm F5 — dừng ngay ở màng đầu tiên', en: 'Same person hits reload — stopped at the first membrane' },
    detail: {
      vi: 'Request thứ hai còn không ra khỏi máy. Đệm trình duyệt trả lời trong khoảng 0,1 ms — nhanh hơn Redis chừng bốn trăm lần, không phải vì nó thông minh hơn, mà vì nó là tầng duy nhất không phải chạm vào mạng.',
      en: 'The second request never leaves the machine. The browser cache answers in about 0.1 ms — some four hundred times faster than Redis, not because it is cleverer but because it is the only layer that never touches the network.',
    },
    duration: 1800,
    sfx: 'ping',
    ops: [
      spotlight(BROWSER),
      drop(BROWSER, 'GET /posts', 'ok'),
      log('› GET /posts', 'muted'),
      log('  (from disk cache) · 0,1 ms', 'ok'),
      counter(BROWSER, 2, 'HIT 1', 'ok'),
      ...m.tick(MS_BROWSER, false, 'ok'),
    ],
  });

  push({
    id: 'neighbour',
    title: { vi: 'Người khác, cùng thành phố — CDN biên đỡ', en: 'A different person in the same city — the edge catches it' },
    detail: {
      vi: 'Máy này chưa từng vào trang nên đệm trình duyệt của họ rỗng: hạt rơi qua màng đầu. Nhưng nó không đi xa được nữa — máy chủ biên trong cùng thành phố đã giữ sẵn một bản từ lượt trước. Máy chủ gốc của bạn thậm chí không biết có request này.',
      en: 'This machine has never visited, so its browser cache is empty and the request falls through the first membrane. It gets no further: the edge node in the same city already holds a copy. Your origin never even hears about it.',
    },
    duration: 2000,
    sfx: 'ping',
    ops: [
      spotlight(CDN),
      drop(CDN, 'GET /posts', 'ok'),
      log('› GET /posts (máy khác)', 'muted'),
      log('  cf-cache-status: HIT · 12 ms', 'ok'),
      counter(CDN, 2, 'HIT 1', 'ok'),
      ...m.tick(MS_CDN, false, 'ok'),
    ],
  });

  push({
    id: 'far',
    title: { vi: 'Người ở thành phố khác — xuống tới Redis', en: 'Someone in another city — down to Redis' },
    detail: {
      vi: 'CDN không phải MỘT máy chủ mà là một mạng lưới, và mỗi điểm biên có kho riêng. Điểm biên phục vụ người này chưa từng thấy /posts nên nó trượt, request đi tiếp về gốc — nơi Redis trả lời mà không cần đánh thức PostgreSQL. Mất 41 ms, vẫn tiết kiệm được 47 ms truy vấn.',
      en: 'A CDN is a network, not one server, and every edge has its own store. This visitor’s edge has never seen /posts, so it misses and the request continues to the origin — where Redis answers without waking PostgreSQL. 41 ms, and the 47 ms query is still saved.',
    },
    duration: 2200,
    sfx: 'blip',
    ops: [
      spotlight(REDIS),
      drop(REDIS, 'GET /posts', 'info'),
      log('› GET /posts (biên khác)', 'muted'),
      log('  cf-cache-status: MISS', 'warn'),
      log('  redis GET posts:p1 → HIT · 0,9 ms', 'ok'),
      counter(REDIS, 2, 'HIT 1', 'ok'),
      ...m.tick(MS_REDIS, false, 'ok'),
    ],
  });

  push({
    id: 'settled',
    title: { vi: 'Request thứ năm: lại là CDN', en: 'Fifth request: the edge again' },
    detail: {
      vi: 'Đây là hình dạng bình thường của lưu lượng thật khi đệm đã ấm: phần lớn dừng ở hai màng trên cùng, thi thoảng mới có một hạt lọt xuống sâu. Tổng cộng năm request tốn 153,1 ms thay vì 440 ms — nhưng để ý: chỉ MỘT lượt trong năm là thật sự chạm vào CSDL.',
      en: 'This is what real traffic looks like once the caches are warm: most requests stop at the top two membranes and only occasionally does one sink deeper. Five requests cost 153.1 ms instead of 440 — and note that only one of the five ever touched the database.',
    },
    duration: 2000,
    sfx: 'ping',
    ops: [
      spotlight(CDN),
      drop(CDN, 'GET /posts', 'ok'),
      log('  cf-cache-status: HIT · 12 ms', 'ok'),
      counter(CDN, 3, 'HIT 2', 'ok'),
      ...m.tick(MS_CDN, false, 'ok'),
    ],
  });

  push({
    id: 'verdict',
    title: { vi: 'Cái đáng đếm không phải mili-giây, mà là số lượt xuống CSDL', en: 'Count trips to the database, not milliseconds' },
    detail: {
      vi: 'Thanh dưới nói ×2,9 — nghe không choáng ngợp. Nhưng con số ở giữa mới là thứ quyết định lúc đông người: 5 lượt xuống CSDL so với 1. Khi lưu lượng nhân lên trăm lần, cái vỡ trước không phải mili-giây của một người, mà là số kết nối CSDL đang mở cùng lúc.',
      en: 'The bar says ×2.9, which is not dazzling. The middle number is what matters under load: five trips to the database versus one. Multiply traffic by a hundred and what breaks first is not one user’s milliseconds — it is the number of concurrent database connections.',
    },
    duration: 2600,
    sfx: 'success',
    ops: [spotlight(null), log('— 5 request · 1 lượt xuống CSDL', 'ok')],
    teachingNote: {
      vi: 'Dừng ở đây: hỏi lớp "nếu 500 người cùng vào thì cột nào vỡ trước?"',
      en: 'Pause here: ask the class which column breaks first when 500 people arrive at once.',
    },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ĐỆM LẠNH: mỗi request một khoá khác nhau
   ──────────────────────────────────────────────────────────── */

function buildCold(): SimStep[] {
  const { steps, push } = collector();
  const m = meters();

  push({
    id: 'intro',
    title: { vi: 'Cùng hệ thống ấy, nhưng không ai hỏi lại câu nào', en: 'Same system, but nobody asks the same thing twice' },
    detail: {
      vi: 'Năm người mở năm trang khác nhau: /posts?page=1 tới ?page=5. Ba tầng đệm vẫn nguyên ở đó, cấu hình không đổi một chữ. Hãy nhìn xem chúng đỡ được bao nhiêu.',
      en: 'Five people open five different pages: /posts?page=1 through ?page=5. All three cache layers are still there, configured exactly the same. Watch how much they absorb.',
    },
    duration: 1800,
    sfx: 'click',
    ops: [spotlight(null), log('$ ab -n 5 -c 1 /posts?page=[1-5]', 'muted')],
  });

  for (let i = 1; i <= 5; i++) {
    push({
      id: `miss-${i}`,
      title: { vi: `page=${i} — trượt cả ba tầng`, en: `page=${i} — misses all three layers` },
      detail:
        i === 1
          ? {
              vi: 'Khoá đệm là cả URL, nên ?page=2 KHÔNG dùng lại được gì của ?page=1. Với tầng đệm, đây là một câu hỏi hoàn toàn mới — và câu hỏi mới thì luôn phải xuống tận nguồn.',
              en: 'The cache key is the whole URL, so ?page=2 cannot reuse anything from ?page=1. To every layer this is a brand-new question, and new questions always go all the way down.',
            }
          : {
              vi: `Lần thứ ${i} liên tiếp rơi tới đáy. Đệm vẫn đang làm việc — nó GHI vào cả ba tầng sau mỗi lượt, tốn thêm bộ nhớ và thêm việc — nhưng chưa một ai quay lại đọc thứ nó vừa cất.`,
              en: `The ${i}th fall to the bottom in a row. The caches are working — they store into all three layers after every trip, spending memory and effort — but nobody has come back to read what they saved.`,
            },
      duration: 1700,
      sfx: 'swoosh',
      ops: [
        drop(MEMBRANE_SINK, `page=${i}`, 'err'),
        log(`› GET /posts?page=${i} → MISS ×3 · 88 ms`, 'err'),
        counter(MEMBRANE_SINK, i, `MISS ${i}`, 'err'),
        ...m.tick(MS_DB, true, 'err'),
      ],
    });
  }

  push({
    id: 'verdict',
    title: { vi: 'Hai thanh bằng nhau: đệm không mua được gì', en: 'Two identical bars: the cache bought nothing' },
    detail: {
      vi: 'Không có gì hỏng cả — Redis vẫn chạy, CDN vẫn bật, code vẫn đúng. Đệm chỉ đơn giản là một cá cược rằng dữ liệu sẽ được đọc lại; ở đây cược thua. Trước khi thêm một tầng đệm, câu hỏi phải trả lời không phải "có nhanh hơn không" mà là "cùng một thứ có được đọc lại không, và bao lâu một lần".',
      en: 'Nothing is broken — Redis is up, the CDN is on, the code is correct. A cache is simply a bet that data gets read again, and here the bet loses. Before adding a layer the question is not “is it faster” but “is the same thing read twice, and how often”.',
    },
    duration: 2600,
    sfx: 'buzz',
    ops: [log('— 5 request · 5 lượt xuống CSDL', 'err')],
    teachingNote: {
      vi: 'Đây là nhánh đáng chiếu nhất: nó chữa cái phản xạ "chậm thì cắm thêm Redis".',
      en: 'This is the branch worth showing: it treats the reflex of “it is slow, add Redis”.',
    },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — ĐỆM CŨ: nhanh, và sai
   ──────────────────────────────────────────────────────────── */

function buildStale(): SimStep[] {
  const { steps, push } = collector();
  const m = meters();

  push({
    id: 'fill',
    title: { vi: 'Bình thường: một lượt xuống CSDL rồi ghi lên ba tầng', en: 'Business as usual: one trip down, then stored in three layers' },
    detail: {
      vi: 'Bài viết đang có tiêu đề "Giá: 200.000đ". Câu trả lời được cất ở cả ba tầng với hạn 60 giây. Tới đây mọi thứ vẫn đúng.',
      en: 'The post currently reads “Price: 200,000đ”. The answer is stored in all three layers with a 60-second lifetime. So far everything is correct.',
    },
    duration: 2400,
    sfx: 'swoosh',
    ops: [
      drop(MEMBRANE_SINK, 'v1 · 200k', 'info'),
      log('› GET /posts → MISS ×3 · 88 ms', 'muted'),
      log('  giá = 200.000đ  (v1)', 'ok'),
      log('  lưu 3 tầng · TTL 60s', 'ok'),
      ...m.tick(MS_DB, true),
    ],
  });

  push({
    id: 'store',
    title: { vi: 'Ba bản sao của cùng một sự thật', en: 'Three copies of the same truth' },
    detail: {
      vi: 'Mỗi bản sao là một lời hứa rằng sự thật sẽ không đổi trong 60 giây tới. Không ai trong ba tầng này có cách nào biết được lời hứa ấy bị phá.',
      en: 'Each copy is a promise that the truth will not change for the next 60 seconds. None of these three layers has any way to learn that the promise was broken.',
    },
    duration: 2000,
    sfx: 'success',
    ops: [
      { p: 'layers', op: 'shift', lane: MEMBRANE_SINK },
      drop(REDIS, 'v1 · 200k', 'info'),
      drop(CDN, 'v1 · 200k', 'info'),
      drop(BROWSER, 'v1 · 200k', 'info'),
      counter(REDIS, 1, 'v1'),
      counter(CDN, 1, 'v1'),
      counter(BROWSER, 1, 'v1'),
    ],
  });

  push({
    id: 'edit',
    title: { vi: 'Admin sửa giá thành 150.000đ', en: 'An admin changes the price to 150,000đ' },
    detail: {
      vi: 'UPDATE chạy trên PostgreSQL, chấm hết. CSDL không gọi điện cho Redis, Redis không nhắn tin cho CDN, CDN không báo cho trình duyệt ai cả. Từ giây này, ba tầng phía trên đang giữ một con số không còn tồn tại.',
      en: 'The UPDATE lands in PostgreSQL and that is all. The database does not phone Redis, Redis does not text the CDN, and the CDN tells no browser anything. From this second on, the three layers above hold a number that no longer exists.',
    },
    duration: 2400,
    sfx: 'blip',
    ops: [
      spotlight(null),
      drop(MEMBRANE_SINK, 'UPDATE → v2', 'warn'),
      log('  UPDATE posts SET price=150000', 'warn'),
      log('  ⚠ 3 tầng đệm vẫn giữ v1', 'warn'),
      counter(MEMBRANE_SINK, 2, 'v2', 'warn'),
    ],
  });

  push({
    id: 'wrong-fast',
    title: { vi: 'Người dùng cũ tải lại — 0,1 ms, và sai', en: 'A returning user reloads — 0.1 ms, and wrong' },
    detail: {
      vi: 'Đệm trình duyệt trả lời tức thì. Nó không sai chức năng: nó đang làm ĐÚNG những gì được bảo, giữ bản sao trong 60 giây. Cái sai nằm ở chỗ chúng ta đã hứa 60 giây cho một dữ liệu có thể đổi bất cứ lúc nào.',
      en: 'The browser cache answers instantly. It is not malfunctioning — it is doing exactly what it was told, holding the copy for 60 seconds. The mistake was promising 60 seconds for data that can change at any moment.',
    },
    duration: 2200,
    sfx: 'error',
    ops: [
      spotlight(BROWSER),
      drop(BROWSER, 'v1 · 200k', 'err'),
      log('‹ 200 OK (from disk cache) · 0,1 ms', 'ok'),
      log('  giá = 200.000đ  ✗ SAI', 'err'),
      counter(BROWSER, 2, 'HIT · CŨ', 'err'),
      ...m.tick(MS_BROWSER, false, 'err'),
    ],
  });

  push({
    id: 'wrong-edge',
    title: { vi: 'Máy khác, cùng thành phố — 12 ms, cũng sai', en: 'Another machine in the city — 12 ms, also wrong' },
    detail: {
      vi: 'Cái nguy hiểm của đệm nhiều tầng nằm ở đây: xoá một tầng không đủ. Bạn có thể xoá sạch Redis mà người dùng vẫn thấy giá cũ, vì bản sai còn nằm ở CDN và ở chính máy họ.',
      en: 'This is what makes layered caches dangerous: clearing one layer is not enough. You can flush Redis completely and users still see the old price, because stale copies live at the edge and on their own machines.',
    },
    duration: 2200,
    sfx: 'error',
    ops: [
      spotlight(CDN),
      drop(CDN, 'v1 · 200k', 'err'),
      log('  cf-cache-status: HIT · 12 ms', 'ok'),
      log('  giá = 200.000đ  ✗ SAI', 'err'),
      counter(CDN, 2, 'HIT · CŨ', 'err'),
      ...m.tick(MS_CDN, false, 'err'),
    ],
  });

  push({
    id: 'purge',
    title: { vi: 'Dọn đệm: phải dọn từ trên xuống', en: 'Purging: it has to happen top-down' },
    detail: {
      vi: 'DEL khoá Redis, gọi API purge của CDN, và đổi URL (hoặc ETag) để bản trên máy người dùng hết hiệu lực. Ba tầng, ba cơ chế khác nhau, và tầng trình duyệt là tầng bạn KHÔNG với tới được — chỉ có thể hết hạn chứ không xoá được.',
      en: 'DEL the Redis key, call the CDN purge API, and change the URL or ETag so the copy on the user’s machine stops counting. Three layers, three different mechanisms — and the browser layer is the one you cannot reach at all: it can only expire.',
    },
    duration: 2600,
    sfx: 'lock',
    ops: [
      spotlight(null),
      { p: 'layers', op: 'clear', lane: BROWSER },
      { p: 'layers', op: 'clear', lane: CDN },
      { p: 'layers', op: 'clear', lane: REDIS },
      log('  redis DEL posts:p1', 'ok'),
      log('  POST /purge_cache (CDN)', 'ok'),
      log('  ETag đổi → bản trên máy hết hiệu lực', 'ok'),
      counter(BROWSER, 0, '—'),
      counter(CDN, 0, '—'),
      counter(REDIS, 0, '—'),
    ],
  });

  push({
    id: 'correct',
    title: { vi: 'Request tiếp theo lại rơi tới đáy — và đúng', en: 'The next request falls all the way down — and is right' },
    detail: {
      vi: 'Chậm hơn 880 lần so với cú trả lời sai lúc nãy. Đó chính là cái giá thật của tính đúng đắn, và cũng là lý do TTL không phải một con số kỹ thuật: TTL là khoảng thời gian bạn chấp nhận nói sai với người dùng.',
      en: 'Eight hundred and eighty times slower than the wrong answer earlier. That is what correctness actually costs, and it is why a TTL is not a technical number: a TTL is how long you are willing to be wrong.',
    },
    duration: 2600,
    sfx: 'success',
    ops: [
      drop(MEMBRANE_SINK, 'v2 · 150k', 'ok'),
      log('› GET /posts → MISS ×3 · 88 ms', 'muted'),
      log('  giá = 150.000đ  ✓ ĐÚNG', 'ok'),
      counter(MEMBRANE_SINK, 3, 'v2 ✓', 'ok'),
      ...m.tick(MS_DB, true, 'ok'),
    ],
    teachingNote: {
      vi: 'Chốt bài: "TTL = khoảng thời gian bạn chấp nhận sai". Hỏi lớp TTL nào hợp cho giá tiền, cho avatar, cho số like.',
      en: 'Closing line: a TTL is how long you accept being wrong. Ask what TTL fits a price, an avatar, a like count.',
    },
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const cacheLayersScenario: Scenario = {
  id: 'cache-layers',
  name: { vi: 'Tầng đệm — dữ liệu lấy ra từ đâu', en: 'Cache layers — where the answer comes from' },
  tagline: {
    vi: 'Đệm trình duyệt → CDN biên → Redis → PostgreSQL. Request đi được bao sâu trước khi có người trả lời, và vì sao "nhanh hơn" đôi khi có nghĩa là "sai".',
    en: 'Browser → edge → Redis → PostgreSQL. How deep a request travels before something answers it, and why “faster” sometimes means “wrong”.',
  },
  icon: Layers,
  accent: '#38bdf8',
  group: 'core',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Kiểu lưu lượng', en: 'Traffic shape' },
      defaultValue: 'warm',
      choices: [
        {
          value: 'warm',
          label: 'Đệm ấm',
          fullLabel: 'Lưu lượng lặp lại — 5 request, 1 lượt xuống CSDL',
          color: '#34d399',
          hint: { vi: 'tầng nào chặn sớm hơn thì thắng', en: 'the layer that stops it earliest wins' },
        },
        {
          value: 'cold',
          label: 'Đệm lạnh',
          fullLabel: 'Mỗi request một khoá khác — đệm không mua được gì',
          color: '#f59e0b',
          hint: { vi: 'code đúng, cấu hình đúng, vẫn vô ích', en: 'right code, right config, still useless' },
        },
        {
          value: 'stale',
          label: 'Đệm cũ',
          fullLabel: 'Dữ liệu đổi ở CSDL — ba tầng vẫn trả số cũ',
          color: '#f43f5e',
          hint: { vi: 'nhanh gấp 880 lần, và sai', en: '880× faster, and wrong' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = opts.mode ?? 'warm';
    return mode === 'cold' ? buildCold() : mode === 'stale' ? buildStale() : buildWarm();
  },
};
