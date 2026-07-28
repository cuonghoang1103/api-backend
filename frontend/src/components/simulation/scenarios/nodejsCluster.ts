/**
 * Node.js · Bài 16.4 — Mở rộng theo chiều ngang: 3,4× với việc CPU,
 * 1,06× với việc I/O.
 *
 * Số đo lấy nguyên từ giáo trình (cùng một app, 50 kết nối đồng thời, máy
 * mười nhân):
 *
 *   route  worker  req/giây   p97.5
 *   /cpu     1      8.708     10ms
 *   /cpu     2     18.303      5ms
 *   /cpu     4     29.542      5ms   ← ĐỈNH
 *   /cpu     8     27.189      6ms
 *   /cpu    10     25.112      8ms
 *   /io      1      1.253     57ms
 *   /io     10      1.325     56ms   → +5,7%, không phân biệt được với nhiễu
 *
 * Hai câu chuyện hoàn toàn khác nhau từ CÙNG MỘT thay đổi. Vì thế kịch bản
 * này phải để hai chế độ cạnh nhau chứ không gộp: bài học nằm ở chỗ cùng một
 * phép sửa cho hai kết quả trái ngược, tuỳ route của bạn làm gì.
 */

import { Cpu } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const CLUSTER_CODE = [
  "import cluster from 'node:cluster';",
  "import os from 'node:os';",
  '',
  'if (cluster.isPrimary) {',
  '  // ĐỪNG chép os.cpus().length từ một bài hướng dẫn:',
  '  // điểm tối ưu thường THẤP HƠN số nhân — phải đo',
  '  const n = Number(process.env.WORKERS) || os.cpus().length - 1;',
  '  for (let i = 0; i < n; i++) cluster.fork();',
  '} else {',
  '  app.listen(3000);   // các worker DÙNG CHUNG một cổng',
  '}',
];

const BREAKS_CODE = [
  '// mỗi worker là một TIẾN TRÌNH riêng, bộ nhớ riêng',
  '',
  'const cache = new Map();       // → N bản, không ai đồng ý với ai',
  'let hits = 0;                  // → N bộ đếm khác nhau',
  '',
  'cron.schedule("0 3 * * *", billing);  // → chạy N lần mỗi đêm',
  '',
  '// chốt chặn của dự án này — chỉ ngăn được TRONG MỘT tiến trình',
  'let _started = false;',
  'if (_started) return;',
  '_started = true;',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'cpu' | 'io' | 'breaks';
const modeOf = (opts: ScenarioOptions): Mode => (opts.mode === 'io' || opts.mode === 'breaks' ? opts.mode : 'cpu');

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
    lines: mode === 'breaks' ? BREAKS_CODE : CLUSTER_CODE,
  };

  const log: PanelSpec = {
    id: 'log',
    kind: 'log',
    title: { vi: 'autocannon — 50 kết nối đồng thời', en: 'autocannon — 50 concurrent connections' },
    file: 'autocannon -c 50',
    x: 0,
    y: 312,
    w: 452,
    h: 248,
    accent: '#38bdf8',
    maxLines: 7,
  };

  if (mode === 'breaks') {
    return [
      code,
      log,
      {
        id: 'db',
        kind: 'table',
        title: { vi: 'Cái gì vỡ ngay khi có tiến trình thứ hai', en: 'What breaks the moment there is a second process' },
        hint: { vi: 'không có lỗi nào được ném ra cả', en: 'not one error is thrown' },
        x: 464,
        y: 0,
        w: 536,
        h: 560,
        accent: '#f43f5e',
        columns: [
          { key: 'k', label: 'thứ bạn giữ trong RAM', flex: 1 },
          { key: 'v', label: 'chuyện gì xảy ra với N tiến trình', flex: 1.5 },
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
        mode === 'io'
          ? { vi: '/io — chờ 30ms, req/giây theo số worker', en: '/io — 30ms wait, req/sec by worker count' }
          : { vi: '/cpu — băm 20 vòng, req/giây theo số worker', en: '/cpu — 20 hash rounds, req/sec by worker count' },
      hint:
        mode === 'io'
          ? { vi: 'cùng một phép sửa, kết quả trái ngược', en: 'the same fix, the opposite result' }
          : { vi: 'máy mười nhân, 50 kết nối đồng thời', en: 'ten-core machine, 50 concurrent connections' },
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: mode === 'io' ? '#f59e0b' : '#34d399',
      unit: 'req/giây',
      max: mode === 'io' ? 31_000 : 31_000,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Số đo của cấu hình đang chạy', en: 'The configuration currently running' },
      x: 464,
      y: 360,
      w: 536,
      h: 200,
      accent: '#f59e0b',
      meters: [
        { id: 'rps', label: 'Throughput', max: 31_000, unit: 'req/giây', accent: '#34d399' },
        { id: 'p975', label: 'Độ trễ p97.5', max: 60, unit: 'ms', accent: '#f59e0b' },
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
const row = (id: string, k: string, v: string, tone: 'ok' | 'warn' | 'err' | 'info'): PanelOp => ({
  p: 'db',
  op: 'push',
  item: { id, label: k, cells: [k, v], tone },
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
   A — /cpu: 3,4 LẦN, RỒI TỤT
   ──────────────────────────────────────────────────────────── */

function buildCpu(): SimStep[] {
  const { steps, push } = collector();

  push(
    'one',
    { vi: 'Một worker — 8.708 req/giây, một nhân đang chạy', en: 'One worker — 8,708 req/sec, one core busy' },
    {
      vi: 'Node chạy JavaScript của bạn trên MỘT luồng. Trên một cái máy mười nhân thì nghe như đang dùng 10% số tiền đã bỏ ra. Route `/cpu` băm một chuỗi hai mươi vòng — tính toán thật, giống việc kiểm mật khẩu hay xử lý ảnh.',
      en: 'Node runs your JavaScript on ONE thread. On a ten-core machine that sounds like using 10% of what you paid for. The `/cpu` route hashes a string twenty times — real computation, like password verification or image processing.',
    },
    2500,
    [
      lines([10]),
      gauge('rps', 8708, '8.708 req/giây', 'warn'),
      gauge('p975', 10, '10 ms', 'ok'),
      bar('1 worker', 8708, '8.708', 'warn'),
      log('/cpu   1 worker   8.708 req/giây   p97.5 10ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'scale',
    { vi: '2 rồi 4 worker — 18.303 rồi 29.542 req/giây', en: '2 then 4 workers — 18,303 then 29,542 req/sec' },
    {
      vi: 'Gần như tuyến tính, đúng như quảng cáo: 3,4 lần ở bốn worker. Cột "số pid khác nhau" trong bảng gốc có mặt để chứng minh tải thật sự được chia — 40 request mẫu chạm vào đủ số tiến trình.',
      en: 'Nearly linear, exactly as advertised: 3.4× at four workers. The "distinct pids" column in the original table exists to prove the load really is spread — 40 sampled requests touch every process.',
    },
    2700,
    [
      lines([7, 8]),
      gauge('rps', 29_542, '29.542 req/giây', 'ok'),
      gauge('p975', 5, '5 ms', 'ok'),
      bar('2 worker', 18_303, '18.303', 'ok'),
      bar('4 worker', 29_542, '29.542', 'ok'),
      log('/cpu   2 worker  18.303 req/giây   p97.5  5ms', 'ok'),
      log('/cpu   4 worker  29.542 req/giây   p97.5  5ms  ← ĐỈNH', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'peak',
    { vi: 'Bất ngờ: 8 rồi 10 worker làm mọi thứ TỆ ĐI', en: 'The surprise: 8 then 10 workers make things WORSE' },
    {
      vi: 'Trên máy mười nhân, throughput đạt đỉnh ở BỐN worker rồi tụt: 29.542 → 27.189 → 25.112. Ba lý do đều đúng với máy production của bạn: client cũng ăn CPU (ở production đó là nginx, hệ gom log, agent giám sát), nhiều tiến trình hơn số nhân buộc hệ điều hành luân phiên chúng, và mỗi worker là một V8 riêng với heap/JIT/GC riêng.',
      en: 'On a ten-core box, throughput peaks at FOUR workers and then falls: 29,542 → 27,189 → 25,112. All three reasons apply to your production machine: the client eats CPU too (in production that is nginx, log shippers, monitoring agents), more processes than cores forces the OS to rotate them, and every worker is its own V8 with its own heap, JIT and GC.',
    },
    3000,
    [
      lines([5, 6]),
      gauge('rps', 25_112, '25.112 req/giây', 'warn'),
      gauge('p975', 8, '8 ms', 'warn'),
      bar('8 worker', 27_189, '27.189', 'warn'),
      bar('10 worker', 25_112, '25.112', 'err'),
      log('/cpu   8 worker  27.189 req/giây   p97.5  6ms', 'warn'),
      log('/cpu  10 worker  25.112 req/giây   p97.5  8ms', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Chép `os.cpus().length` từ một bài hướng dẫn = kết thúc ở sườn ĐI XUỐNG của đường cong này.',
        en: 'Copying `os.cpus().length` from a tutorial lands you on the DOWNSLOPE of this curve.',
      },
    }
  );

  push(
    'rule',
    { vi: 'Bắt đầu ở số nhân − 1, rồi đo cả xuống lẫn lên', en: 'Start at cores − 1, then measure both down and up' },
    {
      vi: 'Điểm tối ưu thường THẤP HƠN số nhân, và cách duy nhất tìm ra nó là thử. Trước đó hãy hỏi một câu rẻ hơn: lấy CPU profile dưới tải (bài 16.1) và nhìn phần trăm `(idle)`. Cao hơn 60% nghĩa là bạn nghẽn ở I/O và cluster sẽ không giúp gì — chọn "/io" để xem điều đó bằng số.',
      en: 'The optimum is usually BELOW the core count, and the only way to find it is to measure. Before that, ask a cheaper question: take a CPU profile under load (lesson 16.1) and read the `(idle)` percentage. Above 60% means you are I/O-bound and cluster will do nothing — pick "/io" to see that in numbers.',
    },
    2900,
    [lines([5, 6, 7]), log('idle > 60% → nghẽn I/O · idle < 30% → nghẽn CPU', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — /io: MƯỜI TIẾN TRÌNH ĐỂ CÙNG NHAU KHÔNG LÀM GÌ
   ──────────────────────────────────────────────────────────── */

function buildIo(): SimStep[] {
  const { steps, push } = collector();

  push(
    'one',
    { vi: 'Một worker — 1.253 req/giây, p97.5 = 57 ms', en: 'One worker — 1,253 req/sec, p97.5 = 57 ms' },
    {
      vi: 'Route `/io` chờ 30 ms — giống một truy vấn cơ sở dữ liệu. Vẫn ứng dụng ấy, vẫn 50 kết nối đồng thời, vẫn cái máy mười nhân ấy.',
      en: 'The `/io` route waits 30 ms — like a database query. Same app, same 50 concurrent connections, same ten-core machine.',
    },
    2400,
    [
      lines([10]),
      gauge('rps', 1253, '1.253 req/giây', 'warn'),
      gauge('p975', 57, '57 ms', 'warn'),
      bar('1 worker', 1253, '1.253', 'warn'),
      log('/io    1 worker   1.253 req/giây   p97.5 57ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'four',
    { vi: '4 worker — 1.326 req/giây. Đó là +5,8%.', en: '4 workers — 1,326 req/sec. That is +5.8%.' },
    {
      vi: 'Bốn tiến trình, bốn V8, bốn lần bộ nhớ nền — để đổi lấy một khoản tăng không phân biệt được với nhiễu đo. Cùng một thay đổi vừa cho 3,4 lần ở route kia.',
      en: 'Four processes, four V8s, four times the baseline memory — in exchange for a gain indistinguishable from measurement noise. The very same change bought 3.4× on the other route.',
    },
    2700,
    [
      lines([7, 8]),
      gauge('rps', 1326, '1.326 req/giây', 'warn'),
      gauge('p975', 54, '54 ms', 'warn'),
      bar('2 worker', 1289, '1.289', 'warn'),
      bar('4 worker', 1326, '1.326', 'warn'),
      log('/io    2 worker   1.289 req/giây   p97.5 55ms', 'warn'),
      log('/io    4 worker   1.326 req/giây   p97.5 54ms', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'ten',
    { vi: '10 worker — 1.325 req/giây. Đường thẳng.', en: '10 workers — 1,325 req/sec. A flat line.' },
    {
      vi: 'Rẽ ra mười tiến trình chẳng làm được gì cho cái route dành thời gian để CHỜ, bởi vì việc chờ chưa bao giờ là thứ tranh giành một nhân CPU. Một event loop giữ được hàng nghìn phép `await` đang treo; nó không cần ai giúp để không làm gì cả.',
      en: 'Forking ten processes does nothing for a route that spends its time WAITING, because waiting was never competing for a CPU core. One event loop holds thousands of pending `await`s; it does not need help to do nothing.',
    },
    2900,
    [
      gauge('rps', 1325, '1.325 req/giây', 'err'),
      gauge('p975', 56, '56 ms', 'warn'),
      bar('8 worker', 1303, '1.303', 'warn'),
      bar('10 worker', 1325, '1.325', 'err'),
      log('/io   10 worker   1.325 req/giây   → +5,7% tổng cộng', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'So hình dạng hai biểu đồ: /cpu là bậc thang, /io là đường phẳng.',
        en: 'Compare the two chart shapes: /cpu is a staircase, /io is a flat line.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'cuongthai.com chạy MỘT tiến trình, và đó là lựa chọn đúng', en: 'cuongthai.com runs ONE process, and that is the right call' },
    {
      vi: 'Bài 16.2 đo được 97,8% thời gian request nằm trong một lời gọi cơ sở dữ liệu — đúng dạng công việc của dòng `/io` ở trên. Con đường mở rộng trung thực ở đây là cache của chương 12 và hàng đợi của chương 13, chứ không phải thêm worker. Nếu chỉ MỘT hàm ngốn hết CPU thì dùng `worker_threads` cho riêng nó (chương 2), rẻ hơn nhân cả tiến trình lên.',
      en: 'Lesson 16.2 measured 97.8% of request time inside a database call — exactly the workload of the `/io` row above. The honest scaling path here is chapter 12\'s caching and chapter 13\'s queues, not more workers. If a SINGLE function eats the CPU, give it `worker_threads` (chapter 2) — cheaper than multiplying the whole process.',
    },
    3000,
    [lines([]), log('97,8% thời gian request nằm trong lời gọi CSDL (16.2)', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — CÁI GÌ VỠ KHI BẠN RẼ NHÁNH
   ──────────────────────────────────────────────────────────── */

function buildBreaks(): SimStep[] {
  const { steps, push } = collector();

  push(
    'memory',
    { vi: 'Mỗi worker là một tiến trình riêng, bộ nhớ riêng', en: 'Every worker is its own process with its own memory' },
    {
      vi: 'Mọi thứ mà code một-tiến-trình của bạn giữ trong một biến giờ tồn tại N bản, độc lập, và các bản sao ấy KHÔNG ĐỒNG Ý với nhau. Cache trong bộ nhớ: người dùng thấy dữ liệu cũ hay mới tuỳ vào việc trúng worker nào.',
      en: 'Everything your single-process code kept in a variable now exists in N independent copies, and those copies DISAGREE. In-memory cache: whether a user sees fresh or stale data depends on which worker they land on.',
    },
    2600,
    [
      lines([3, 4]),
      row('cache', 'Cache trong bộ nhớ', 'N bản khác nhau · dữ liệu cũ tuỳ worker', 'warn'),
      row('count', 'Bộ đếm, biến toàn cục', 'mỗi worker một giá trị · /metrics cũng vậy', 'warn'),
      log('WORKERS=4 → 4 cache, 4 bộ đếm, 4 /metrics', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'limits',
    { vi: 'Giới hạn 100/phút lặng lẽ thành 100 × N', en: 'A 100-per-minute limit quietly becomes 100 × N' },
    {
      vi: 'Bộ đếm rate limit trong RAM là hai bộ đếm khi có hai tiến trình — chính xác là con bug mở đầu bài 12.4. Socket.IO cũng vậy: emit ở worker 1 không tới được client nối vào worker 2 nếu không có Redis adapter (chương 11).',
      en: 'An in-RAM rate-limit counter is two counters when there are two processes — precisely the bug that opens lesson 12.4. Socket.IO too: an emit on worker 1 never reaches a client connected to worker 2 without the Redis adapter (chapter 11).',
    },
    2800,
    [
      row('rl', 'Rate limit đếm trong RAM', 'giới hạn 100/phút → 100×N · phải đếm ở Redis', 'err'),
      row('io', 'Socket.IO', 'emit ở worker 1 không tới client của worker 2', 'err'),
      log('cần Redis: bộ đếm (ch.12) và adapter (ch.11)', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'cron',
    { vi: 'Bẫy thật: cron chạy N lần, và nó IM LẶNG', en: 'The real trap: cron runs N times, and it is SILENT' },
    {
      vi: 'Một job tính tiền chạy hằng đêm, viết hồi ứng dụng còn một tiến trình, bắt đầu gửi BỐN hoá đơn cho mỗi khách hàng đúng cái ngày có người đặt `WORKERS=4` cho nhanh. Không có lỗi nào cả. Chốt chặn mà dự án này dùng là `let _started = false` — thứ ngăn được việc lên lịch hai lần TRONG MỘT tiến trình và hoàn toàn vô dụng khi có bốn.',
      en: 'A nightly billing job, written when the app had one process, starts sending FOUR invoices per customer the day somebody sets `WORKERS=4` for speed. Not one error is thrown. This project\'s guard is `let _started = false` — which prevents double-scheduling WITHIN one process and is entirely useless once there are four.',
    },
    3000,
    [
      lines([6, 8, 9, 10, 11]),
      row('cron', 'Cron / job định kỳ', 'chạy N lần thay vì 1 · phải khoá bằng Redis', 'err'),
      log('cron.service.ts: 11 lời gọi cron.schedule()', 'err'),
      log('canh bằng đúng MỘT cờ trong tiến trình', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là thứ thật sự gây sự cố — vì nó không báo gì cả.',
        en: 'This is what actually causes the incident — because it announces nothing.',
      },
    }
  );

  push(
    'choice',
    { vi: 'cluster, PM2 hay N container?', en: 'cluster, PM2, or N containers?' },
    {
      vi: 'Cả ba làm cùng một việc — chạy N tiến trình sau một cổng — và khác nhau ở chỗ AI GIÁM SÁT chúng. `cluster` không cần cài gì nhưng tiến trình cha là điểm chết duy nhất và bạn phải tự viết phần khởi động lại worker. PM2 tự làm việc đó nhưng trùng việc với Docker. Với triển khai dùng container thì một tiến trình mỗi container gần như luôn đúng: bộ điều phối lo khởi động lại, health check, triển khai dần và giới hạn tài nguyên.',
      en: 'All three do the same thing — run N processes behind one port — and differ in WHO SUPERVISES them. `cluster` needs no install but the primary is a single point of failure and you write the restart logic yourself. PM2 does that for you but duplicates Docker. For a containerised deployment, one process per container is almost always right: the orchestrator handles restarts, health checks, rolling deploys and resource limits.',
    },
    3000,
    [
      lines([]),
      row('choice', 'Lựa chọn lành mạnh nhất', '1 tiến trình / container · nhân bản bằng Docker', 'ok'),
      log('giữ container làm ĐƠN VỊ của mọi thứ', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsClusterScenario: Scenario = {
  id: 'nodejs-cluster',
  name: { vi: 'Cluster: 3,4× hay 1,06×', en: 'Cluster: 3.4× or 1.06×' },
  tagline: {
    vi: 'Cùng một phép sửa, hai kết quả trái ngược: route tính toán đi từ 8.708 lên 29.542 req/giây, route chờ I/O đi từ 1.253 lên 1.325 — tức là không đi đâu cả. Và trên máy mười nhân, throughput đạt đỉnh ở BỐN worker rồi tụt.',
    en: 'The same fix, two opposite outcomes: the compute route goes from 8,708 to 29,542 req/sec; the I/O-bound route goes from 1,253 to 1,325 — that is, nowhere. And on a ten-core box, throughput peaks at FOUR workers and then falls.',
  },
  icon: Cpu,
  accent: '#34d399',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '16.4',
    slug: 'nodejs-16-4-cluster-mo-rong',
    title: { vi: 'Mở rộng theo chiều ngang: 3,4× với việc CPU, 1,06× với việc I/O', en: 'Scaling out: 3.4× on CPU work, 1.06× on I/O work' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Route nào', en: 'Which route' },
      defaultValue: 'cpu',
      choices: [
        {
          value: 'cpu',
          label: '/cpu',
          fullLabel: 'Băm 20 vòng — 8.708 → 29.542 req/giây',
          color: '#34d399',
          hint: { vi: 'gần như tuyến tính, rồi tụt sau đỉnh', en: 'nearly linear, then it falls past the peak' },
        },
        {
          value: 'io',
          label: '/io',
          fullLabel: 'Chờ 30ms — 1.253 → 1.325 req/giây',
          color: '#f59e0b',
          hint: { vi: '+5,7%: không phân biệt được với nhiễu', en: '+5.7%: indistinguishable from noise' },
        },
        {
          value: 'breaks',
          label: 'Cái gì vỡ',
          fullLabel: 'Cache · rate limit · Socket.IO · cron',
          color: '#f43f5e',
          hint: { vi: 'cron chạy N lần và không báo gì cả', en: 'cron runs N times and announces nothing' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'io' ? buildIo() : mode === 'breaks' ? buildBreaks() : buildCpu();
  },
};
