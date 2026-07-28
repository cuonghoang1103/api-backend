/**
 * Node.js · Bài 12.4 — Tính nguyên tử: giới hạn tần suất và khoá phân tán
 * làm cho ĐÚNG.
 *
 * Số đo lấy nguyên từ giáo trình:
 *
 *   500 request song song, giới hạn 100:
 *     INCR nguyên tử      → cho qua 100 · chặn 400 · bộ đếm cuối = 500
 *     GET → kiểm → SET    → cho qua 500 · bộ đếm cuối = 1        ← SAI
 *     INCR rồi EXPIRE lỡ nhịp → TTL = -1 (người dùng bị 429 VĨNH VIỄN)
 *
 *   cửa sổ cố định : lỗ ranh giới → 10 request lọt trong ~300 ms · 56 byte
 *   cửa sổ trượt   : chính xác tuyệt đối · 89.072 byte cho MỘT người dùng
 *   token bucket   : cho phép bùng nổ · 96 byte
 *   giá mỗi lần kiểm: 0,31 · 0,27 · 0,29 ms → CHỌN THEO BỘ NHỚ, đừng theo tốc độ
 *
 * Điểm mấu chốt của cả bài, và là thứ kịch bản phải làm hiện hình: Redis chạy
 * mỗi lúc một lệnh ⇒ TỪNG lệnh là nguyên tử, nhưng CHUỖI lệnh của bạn thì
 * không, vì client khác chen vào giữa chúng.
 */

import { Lock } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const RACE_CODE = [
  '// SAI — ba lệnh, hai khe hở cho người khác chen vào',
  "const n = await redis.get(key);      // 500 client đọc 0",
  'if (Number(n) >= limit) return deny; // 500 client thấy "chưa tới hạn"',
  "await redis.set(key, Number(n) + 1); // 500 client ghi 1",
  '',
  '// ĐÚNG — một lệnh, không có khe hở',
  'const c = await redis.incr(key);',
  '',
  '-- ĐÚNG HƠN — cả khối là MỘT lệnh',
  "local c = redis.call('INCR', KEYS[1])",
  "if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
  'return c',
];

const ALGO_CODE = [
  '-- cửa sổ trượt: một ZSET, mốc thời gian từng request',
  "redis.call('ZREMRANGEBYSCORE', key, 0, nowMs - win)",
  "local n = redis.call('ZCARD', key)",
  'if n < limit then',
  "  redis.call('ZADD', key, nowMs, ARGV[4])  -- phải DUY NHẤT",
  "  redis.call('PEXPIRE', key, win)",
  '  return {1, n + 1}',
  'end',
  'return {0, n}',
];

const LOCK_CODE = [
  '// SAI 1 — SETNX trơ trọi: tiến trình chết = khoá kẹt mãi',
  '// SAI 2 — mở khoá bằng DEL thẳng: xoá nhầm khoá người khác',
  '',
  '// ĐÚNG — token duy nhất + so-sánh-rồi-xoá trong Lua',
  'const token = crypto.randomUUID();',
  "const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');",
  '',
  "if redis.call('GET', KEYS[1]) == ARGV[1]",
  "  then return redis.call('DEL', KEYS[1])",
  '  else return 0 end',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'race' | 'algorithms' | 'lock';
const modeOf = (opts: ScenarioOptions): Mode =>
  opts.mode === 'algorithms' || opts.mode === 'lock' ? opts.mode : 'race';

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const mode = modeOf(opts);

  const code: PanelSpec = {
    id: 'code',
    kind: 'code',
    title: { vi: 'Đoạn mã', en: 'The code' },
    x: 0,
    y: 0,
    w: 452,
    h: 300,
    lines: mode === 'algorithms' ? ALGO_CODE : mode === 'lock' ? LOCK_CODE : RACE_CODE,
  };

  const log: PanelSpec = {
    id: 'log',
    kind: 'log',
    title: { vi: 'Kết quả đo', en: 'Measured output' },
    file: 'node atomic-lab.js',
    x: 0,
    y: 312,
    w: 452,
    h: 248,
    accent: '#38bdf8',
    maxLines: 7,
  };

  if (mode === 'lock') {
    return [
      code,
      log,
      {
        id: 'workers',
        kind: 'lanes',
        title: { vi: 'Ai đang ở trong vùng tới hạn', en: 'Who is inside the critical section' },
        hint: { vi: 'đúng MỘT là đúng; hai là hỏng', en: 'exactly ONE is correct; two is broken' },
        x: 464,
        y: 0,
        w: 536,
        h: 348,
        lanes: [
          { id: 'w1', label: 'worker-1', sub: { vi: 'giành khoá trước', en: 'takes the lock first' }, accent: '#38bdf8' },
          { id: 'w2', label: 'worker-2', sub: { vi: 'tới sau', en: 'arrives later' }, accent: '#f59e0b' },
          { id: 'lock', label: 'Khoá trong Redis', sub: { vi: 'giá trị · TTL', en: 'value · TTL' }, accent: '#a78bfa' },
        ],
      },
      {
        id: 'gauges',
        kind: 'meter',
        title: { vi: 'Bao nhiêu worker cùng vào một lúc', en: 'How many workers are inside at once' },
        x: 464,
        y: 360,
        w: 536,
        h: 200,
        accent: '#f43f5e',
        meters: [
          { id: 'holders', label: 'Worker trong vùng tới hạn', max: 3, unit: 'worker', threshold: 1, thresholdLabel: 'giới hạn đúng', accent: '#f43f5e' },
        ],
      },
    ];
  }

  return [
    code,
    log,
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title:
        mode === 'algorithms'
          ? { vi: 'RAM cho MỘT người dùng (byte)', en: 'RAM for ONE user (bytes)' }
          : { vi: '500 request song song, giới hạn 100', en: '500 concurrent requests, limit 100' },
      hint:
        mode === 'algorithms'
          ? { vi: 'cả ba tốn như nhau về thời gian: 0,27–0,31 ms', en: 'all three cost the same in time: 0.27–0.31 ms' }
          : undefined,
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: '#34d399',
      unit: mode === 'algorithms' ? 'byte' : 'request',
      max: mode === 'algorithms' ? 92_000 : 520,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Bộ giới hạn có làm đúng việc không', en: 'Is the limiter doing its job' },
      x: 464,
      y: 360,
      w: 536,
      h: 200,
      accent: '#f59e0b',
      meters: [
        { id: 'passed', label: 'Request lọt qua', max: 500, unit: 'request', threshold: 100, thresholdLabel: 'giới hạn cấu hình', accent: '#f43f5e' },
        { id: 'ram', label: 'RAM mỗi người dùng', max: 90_000, unit: 'byte', accent: '#a78bfa' },
      ],
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
   A — MỘT LỆNH LÀ NGUYÊN TỬ, MỘT CHUỖI LỆNH THÌ KHÔNG
   ──────────────────────────────────────────────────────────── */

function buildRace(): SimStep[] {
  const { steps, push } = collector();

  push(
    'incr',
    { vi: 'INCR — 500 request, đúng 100 lọt qua', en: 'INCR — 500 requests, exactly 100 get through' },
    {
      vi: 'Redis chạy mỗi lúc một lệnh, nên `INCR` là nguyên tử: 500 request song song cho ra bộ đếm cuối đúng bằng 500 và đúng 100 request được phục vụ. Đây là mốc chuẩn để so mọi thứ còn lại.',
      en: 'Redis runs one command at a time, so `INCR` is atomic: 500 concurrent requests leave the counter at exactly 500 and exactly 100 requests served. This is the baseline everything else is measured against.',
    },
    2500,
    [
      lines([7]),
      gauge('passed', 100, '100 lọt', 'ok'),
      gauge('ram', 56, '56 byte', 'ok'),
      bar('INCR nguyên tử', 100, '100', 'ok'),
      log('cho qua 100 / chặn 400 → bộ đếm cuối = 500', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'race',
    { vi: 'GET → kiểm → SET: cả 500 đều lọt, bộ đếm dừng ở 1', en: 'GET → check → SET: all 500 pass, counter stops at 1' },
    {
      vi: 'Cả 500 cùng đọc bộ đếm (0), cả 500 cùng kết luận mình đang dưới hạn, cả 500 cùng ghi 1. Bộ giới hạn KHÔNG LÀM GÌ HẾT — và nó trông hoàn toàn đúng đắn trong mọi bài test chạy từng request một. Từng lệnh Redis là nguyên tử; chuỗi ba lệnh của bạn thì không, vì client khác chen vào giữa chúng.',
      en: 'All 500 read the counter (0), all 500 conclude they are under the limit, all 500 write 1. The limiter does NOTHING — and it looks perfectly correct in any test that runs requests one at a time. Each Redis command is atomic; your sequence of three is not, because other clients interleave between them.',
    },
    3000,
    [
      lines([2, 3, 4]),
      gauge('passed', 500, '500 lọt ✗', 'err'),
      bar('GET→kiểm→SET', 500, '500', 'err'),
      log('GET → kiểm → SET: cho qua 500, bộ đếm cuối = 1  ← SAI', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Cột đỏ vượt hẳn vạch ngưỡng 100 — bộ giới hạn tồn tại mà không giới hạn gì.',
        en: 'The red bar sails past the 100 threshold — a limiter that exists but limits nothing.',
      },
    }
  );

  push(
    'ttl',
    { vi: 'INCR rồi EXPIRE — con bug tệ hơn nữa', en: 'INCR then EXPIRE — the worse bug' },
    {
      vi: 'Nếu tiến trình chết, kết nối rớt, hoặc request bị huỷ ở khoảng GIỮA `INCR` và `EXPIRE`, khoá tồn tại mà không có hạn: TTL = -1. Nó không bao giờ reset. Người dùng đó bị 429 VĨNH VIỄN, chờ bao lâu cũng không hết — và trong log không có gì cả.',
      en: 'If the process dies, the connection drops, or the request is cancelled BETWEEN `INCR` and `EXPIRE`, the key exists with no expiry: TTL = -1. It never resets. That user is rate-limited FOREVER, no matter how long they wait — and nothing appears in the logs.',
    },
    2900,
    [
      lines([]),
      gauge('passed', 0, '0 lọt · 429 mãi mãi', 'err'),
      bar('INCR, lỡ EXPIRE', 0, 'TTL -1', 'err'),
      log('INCR xong, chưa kịp EXPIRE → TTL = -1', 'err'),
      log('người dùng bị khoá vĩnh viễn, log sạch trơn', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'lua',
    { vi: 'Lua: cả khối là MỘT lệnh, và một vòng đi-về', en: 'Lua: the whole block is ONE command, and one round trip' },
    {
      vi: 'Script Lua chạy BÊN TRONG Redis, nghĩa là không gì chen vào giữa `INCR` và `PEXPIRE` được. Nó cũng là một vòng đi-về thay vì hai — mà bài 12.1 đã cho biết đó mới là phần đắt tiền. Trong production hãy dùng `EVALSHA` để thân script chỉ gửi một lần; ioredis làm sẵn qua `defineCommand`.',
      en: 'A Lua script runs INSIDE Redis, so nothing can interleave between `INCR` and `PEXPIRE`. It is also one round trip instead of two — and lesson 12.1 already showed that the round trip is the expensive part. In production use `EVALSHA` so the body is sent once; ioredis does it for you via `defineCommand`.',
    },
    2900,
    [
      lines([9, 10, 11, 12]),
      gauge('passed', 100, '100 lọt', 'ok'),
      bar('Lua (INCR+PEXPIRE)', 100, '100', 'ok'),
      log('Lua (INCR + PEXPIRE nguyên tử) → TTL = 60s  ✓', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — BA THUẬT TOÁN: CHỌN THEO BỘ NHỚ, KHÔNG THEO TỐC ĐỘ
   ──────────────────────────────────────────────────────────── */

function buildAlgorithms(): SimStep[] {
  const { steps, push } = collector();

  push(
    'fixed',
    { vi: 'Cửa sổ cố định — 56 byte, và một cái lỗ ở ranh giới', en: 'Fixed window — 56 bytes, and a hole at the boundary' },
    {
      vi: 'Chia ô theo thời gian: `rl:bob:1785182120`. Một khoá, 56 byte, đơn giản nhất có thể. Và sai một cách ĐO ĐƯỢC: năm request ở cuối ô này cộng năm request ở đầu ô kế = 10 request lọt trong ~300 ms, dù giới hạn ghi là 5/giây.',
      en: 'Bucket by time: `rl:bob:1785182120`. One key, 56 bytes, as simple as it gets. And wrong in a MEASURABLE way: five requests at the end of this bucket plus five at the start of the next = 10 requests in ~300 ms, though the configured limit says 5 per second.',
    },
    2800,
    [
      lines([]),
      gauge('passed', 10, '10 lọt / 5 cho phép', 'err'),
      gauge('ram', 56, '56 byte', 'ok'),
      bar('cửa sổ cố định', 56, '56', 'ok'),
      log('cửa sổ #…120: cho qua 5 | #…121: cho qua 5', 'warn'),
      log('⇒ 10 request trong ~300ms với giới hạn 5/giây', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Với điều tiết API thì thường không sao; với đăng nhập thì có sao.',
        en: 'For API throttling this is usually fine; for a login endpoint it is not.',
      },
    }
  );

  push(
    'sliding',
    { vi: 'Cửa sổ trượt — chính xác tuyệt đối ở ranh giới', en: 'Sliding window — exact at the boundary' },
    {
      vi: 'Lưu mốc thời gian của TỪNG request vào một ZSET, vứt bỏ mọi thứ đã trôi ra ngoài cửa sổ, rồi đếm phần còn lại. Trước ranh giới: 5 lọt. Sau ranh giới 160 ms: 0 lọt. Đúng bằng giới hạn, không hơn một cái nào.',
      en: 'Store the timestamp of EVERY request in a ZSET, drop everything older than the window, count what remains. Before the boundary: 5 through. 160 ms after it: 0 through. Exactly the limit, not one more.',
    },
    2700,
    [
      lines([2, 3, 4, 5, 6, 7]),
      gauge('passed', 5, '5 lọt / 5 cho phép', 'ok'),
      log('trước ranh giới: 5 lọt | sau 160ms: 0 lọt → tổng 5', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'ram',
    { vi: '89.072 byte cho MỘT người dùng — cái giá của sự chính xác', en: '89,072 bytes for ONE user — the price of being exact' },
    {
      vi: 'Cửa sổ trượt lưu một mục cho MỖI request nằm trong cửa sổ, nên giới hạn 1.000 nghĩa là 1.000 mục. Với 10.000 người dùng đang hoạt động thì đó là 890 MB — nhiều hơn dung lượng của phần lớn máy Redis. Nó đúng, nhưng không co giãn nổi với giới hạn lớn.',
      en: 'A sliding window stores one entry per request inside the window, so a limit of 1,000 means 1,000 entries. With 10,000 active users that is 890 MB — more than most Redis boxes have. It is correct, but it does not scale to large limits.',
    },
    3000,
    [
      gauge('ram', 89_072, '89.072 byte', 'err'),
      bar('cửa sổ trượt (1001 mục)', 89_072, '89.072', 'err'),
      log('RAM: cửa sổ trượt 1001 phần tử = 89072 byte / 1 user', 'err'),
      log('10.000 người dùng → 890 MB', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Dùng cửa sổ trượt ở chỗ giới hạn NHỎ mà tính đúng đắn quan trọng: đăng nhập 5 lần/15 phút.',
        en: 'Use sliding windows where the limit is SMALL and correctness matters: login, 5 per 15 minutes.',
      },
    }
  );

  push(
    'bucket',
    { vi: 'Token bucket — 96 byte, và nó CHO PHÉP bùng nổ', en: 'Token bucket — 96 bytes, and it ALLOWS bursts' },
    {
      vi: 'Một cái bình chứa N token, nạp lại đều đặn. Client im lặng một lúc thì được tiêu cả bình trong một phát, sau đó bị bóp về đúng tốc độ nạp. Đây mới là thứ bạn thật sự muốn cho một API công khai: một trang bắn tám request lúc tải xong thì phải thành công, còn một script gõ đều đều vào bạn thì không.',
      en: 'A bucket of N tokens refilled at a steady rate. A client that has been quiet gets to spend the whole bucket at once, then is squeezed down to the refill rate. This is what you actually want for a public API: a page firing eight requests on load should succeed; a script hammering you steadily should not.',
    },
    2900,
    [
      gauge('ram', 96, '96 byte', 'ok'),
      bar('token bucket (1 hash)', 96, '96', 'ok'),
      log('10 request tức thì → cho qua 5, token còn 0.03', 'ok'),
      log('chờ 600ms (nạp ~3) → CHO QUA, còn 2.04 token', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Cả ba tốn như nhau về thời gian: 0,31 · 0,27 · 0,29 ms', en: 'All three cost the same in time: 0.31 · 0.27 · 0.29 ms' },
    {
      vi: 'Một vòng đi-về, hết. Nghĩa là tốc độ KHÔNG PHẢI tiêu chí chọn — hãy chọn theo bộ nhớ và theo ngữ nghĩa bạn cần: cố định cho điều tiết chung, trượt cho chỗ nhạy cảm với giới hạn nhỏ, bucket khi bạn muốn cho phép bùng nổ.',
      en: 'One round trip, that is all. So speed is NOT the criterion — choose on memory and on the semantics you need: fixed for general throttling, sliding for small security-sensitive limits, bucket when you want to allow bursts.',
    },
    2900,
    [
      lines([]),
      log('cửa sổ cố định 0,31ms · trượt 0,27ms · bucket 0,29ms'),
      log('→ chọn theo BỘ NHỚ, đừng bao giờ chọn theo tốc độ', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — KHOÁ PHÂN TÁN: BA CÁCH LÀM SAI
   ──────────────────────────────────────────────────────────── */

function buildLock(): SimStep[] {
  const { steps, push } = collector();

  const w = (lane: string, label: string, sub: string, tone: ItemTone): PanelOp => ({
    p: 'workers',
    op: 'push',
    lane,
    item: { label, sub, tone },
  });
  const clear = (lane: string): PanelOp => ({ p: 'workers', op: 'clear', lane });

  push(
    'setnx',
    { vi: 'Sai 1 — `SETNX` trơ trọi: tiến trình chết là khoá kẹt mãi', en: 'Wrong 1 — bare `SETNX`: a dead process jams the lock forever' },
    {
      vi: '`SETNX` không đặt được hạn, nên khoá có TTL = -1. worker-1 giành được rồi CHẾT trước khi `DEL`. worker-2 xin khoá: trả về 0. worker-3, worker-4… cũng vậy, mãi mãi. Luôn dùng `SET khoá giá_trị PX hạn NX`, đừng bao giờ dùng `SETNX` trơ trọi.',
      en: '`SETNX` cannot set an expiry, so the lock has TTL = -1. worker-1 takes it and then DIES before `DEL`. worker-2 asks: returns 0. So does worker-3, worker-4… forever. Always use `SET key value PX ttl NX`, never bare `SETNX`.',
    },
    2800,
    [
      lines([1]),
      w('lock', 'khoá: w1', 'TTL = -1 · vô hạn', 'err'),
      w('w1', 'w1 CHẾT', 'chưa kịp DEL', 'err'),
      w('w2', 'w2 chờ', 'SETNX → 0 mãi mãi', 'warn'),
      gauge('holders', 0, '0 · kẹt cứng', 'err'),
      log('worker-1 SETNX → 1, TTL = -1', 'warn'),
      log('worker-1 CRASH → worker-2 SETNX → 0 → KẸT MÃI MÃI', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'expire',
    { vi: 'Có hạn rồi — nhưng worker-1 làm LÂU hơn cái hạn đó', en: 'Now with a TTL — but worker-1 runs LONGER than the TTL' },
    {
      vi: 'Khoá hạn 300 ms, công việc mất 400 ms. Khoá tự hết hạn, worker-2 giành lấy một cách hoàn toàn CHÍNH ĐÁNG — và bây giờ có HAI worker cùng ở trong vùng tới hạn. Một công việc chạy chậm vừa đổ dây chuyền thành số lượng truy cập đồng thời không giới hạn.',
      en: 'The lock expires in 300 ms; the job takes 400 ms. The lock expires, worker-2 takes it entirely LEGITIMATELY — and now TWO workers are inside the critical section. A slow job just cascaded into unbounded concurrency.',
    },
    3000,
    [
      lines([6]),
      clear('lock'),
      clear('w1'),
      clear('w2'),
      w('lock', 'khoá: w2', 'PX 300 · cấp lại', 'warn'),
      w('w1', 'w1 vẫn chạy', 'đã quá hạn 100ms', 'err'),
      w('w2', 'w2 đang chạy', 'giành hợp lệ', 'warn'),
      gauge('holders', 2, '2 worker ✗', 'err'),
      log('worker-1 giữ khoá 300ms nhưng làm mất 400ms', 'warn'),
      log('khoá hết hạn → worker-2 giành được → CÓ HAI', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'del',
    { vi: 'Sai 2 — mở khoá bằng `DEL` thẳng: xoá nhầm khoá NGƯỜI KHÁC', en: 'Wrong 2 — unlocking with a plain `DEL`: you delete SOMEBODY ELSE\'s lock' },
    {
      vi: 'worker-1 làm xong, gọi `DEL` — và cái nó xoá là khoá của WORKER-2. Vùng tới hạn giờ mở toang: bất kỳ worker-3 nào cũng giành được ngay lập tức, trong khi worker-2 vẫn tưởng mình đang giữ khoá. Đây là trường hợp đáng đọc hai lần.',
      en: 'worker-1 finishes and calls `DEL` — and what it deletes is WORKER-2\'s lock. The critical section is now wide open: any worker-3 grabs it immediately while worker-2 still believes it holds the lock. This one is worth reading twice.',
    },
    3000,
    [
      lines([2]),
      clear('lock'),
      clear('w1'),
      w('lock', 'khoá: null', 'w1 vừa DEL nhầm', 'err'),
      w('w1', 'w1 xong', 'DEL khoá của w2', 'err'),
      w('w2', 'w3 vào luôn', 'vùng tới hạn mở', 'err'),
      gauge('holders', 3, '3 worker ✗✗', 'err'),
      log('worker-1 DEL → xoá 1 khoá — của WORKER-2!', 'err'),
      log('khoá còn lại: null → worker-3 giành được ngay', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Không phải lỗi tranh chấp hiếm gặp — chỉ cần công việc chạy lâu hơn TTL là xảy ra.',
        en: 'Not an exotic race — it happens the moment a job outlives its TTL.',
      },
    }
  );

  push(
    'token',
    { vi: 'Đúng — token duy nhất + so-sánh-rồi-xoá trong Lua', en: 'Correct — a unique token plus compare-and-delete in Lua' },
    {
      vi: 'Mỗi lần giành khoá sinh một `randomUUID` riêng và ghi nó LÀM GIÁ TRỊ của khoá. Lúc mở, script Lua chỉ xoá nếu giá trị vẫn đúng là token của mình — kiểm và xoá nằm trong cùng một lệnh nguyên tử, nên không có khe hở nào giữa hai bước. worker-1 quá hạn thì `DEL` của nó không làm gì cả, đúng như mong muốn.',
      en: 'Each acquisition mints its own `randomUUID` and stores it AS the lock value. On release, a Lua script deletes only if the value is still your token — check and delete inside one atomic command, so there is no gap between them. If worker-1 is late, its `DEL` does nothing, which is exactly right.',
    },
    3000,
    [
      lines([5, 6, 7, 8, 9, 10]),
      clear('lock'),
      clear('w1'),
      clear('w2'),
      w('lock', 'khoá 8f3c…', 'PX 300 · token w2', 'ok'),
      w('w1', 'w1 quá hạn', 'GET ≠ token → 0', 'muted'),
      w('w2', 'w2 đang chạy', 'khoá vẫn của mình', 'ok'),
      gauge('holders', 1, '1 worker ✓', 'ok'),
      log("if GET(key) == token then DEL(key) else 0", 'ok'),
      log('worker-1 gọi mở khoá → 0 (không xoá gì)  ✓', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsAtomicScenario: Scenario = {
  id: 'nodejs-atomic-redis',
  name: { vi: 'Nguyên tử: giới hạn tần suất và khoá', en: 'Atomicity: rate limits and locks' },
  tagline: {
    vi: 'Redis chạy mỗi lúc một lệnh, nên TỪNG lệnh là nguyên tử — chuỗi lệnh của bạn thì không. 500 request song song lọt hết qua một giới hạn 100 bằng đoạn code trông rất hợp lý, và một `DEL` mở khoá có thể xoá mất khoá của worker khác.',
    en: 'Redis runs one command at a time, so EACH command is atomic — your sequence of them is not. 500 concurrent requests sail through a limit of 100 using perfectly reasonable-looking code, and one unlock `DEL` can delete another worker\'s lock.',
  },
  icon: Lock,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '12.4',
    slug: 'nodejs-12-4-nguyen-tu-rate-limit-lock',
    title: {
      vi: 'Tính nguyên tử: giới hạn tần suất và khoá phân tán làm cho đúng',
      en: 'Atomicity: rate limiting and distributed locks done right',
    },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Xem gì', en: 'What to watch' },
      defaultValue: 'race',
      choices: [
        {
          value: 'race',
          label: 'Tranh chấp',
          fullLabel: '500 request lọt qua giới hạn 100',
          color: '#f43f5e',
          hint: { vi: 'một lệnh nguyên tử ≠ một chuỗi lệnh nguyên tử', en: 'one atomic command ≠ an atomic sequence' },
        },
        {
          value: 'algorithms',
          label: 'Ba thuật toán',
          fullLabel: 'Cố định 56B · trượt 89.072B · bucket 96B',
          color: '#a78bfa',
          hint: { vi: 'chọn theo bộ nhớ, không theo tốc độ', en: 'choose on memory, not on speed' },
        },
        {
          value: 'lock',
          label: 'Khoá phân tán',
          fullLabel: 'Ba cách làm sai, rồi cách đúng',
          color: '#f59e0b',
          hint: { vi: 'DEL thẳng xoá nhầm khoá người khác', en: 'a plain DEL deletes the wrong lock' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'algorithms' ? buildAlgorithms() : mode === 'lock' ? buildLock() : buildRace();
  },
};
