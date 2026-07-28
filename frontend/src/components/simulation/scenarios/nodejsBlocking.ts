/**
 * Node.js · Bài 2.4 — Chặn event loop, đo bằng số thật.
 *
 * Hai bài trước là lý thuyết về thứ tự. Bài này là phép đo, và nó dùng đúng
 * hai thí nghiệm trong giáo trình cùng đúng những con số đã chạy ra:
 *
 *   A. Nhịp tim 100ms + một vòng lặp 3e9 đồng bộ.
 *      → tính xong sau 2871ms, nhịp tim trễ TỐI ĐA 2873ms. Cùng một con số:
 *        toàn bộ thời gian tính là thời gian tiến trình câm lặng.
 *   B. Tám lời gọi `crypto.pbkdf2` vào threadpool 4 luồng.
 *      → 49 · 54 · 61 · 63 ms rồi 100 · 113 · 121 · 131 ms. Hai đợt sóng
 *        sạch sẽ — nhìn thấy tận mắt cái pool bốn luồng.
 *
 * Biểu đồ đường là thứ bắt buộc phải có ở đây: bài học NẰM trong hình dạng
 * của đường trễ, không nằm trong một con số đơn lẻ.
 */

import { Activity } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const BLOCK_CODE = [
  'let prev = Date.now(), max = 0;',
  '',
  'setInterval(() => {',
  '  const late = Date.now() - prev - 100;   // lẽ ra ~0',
  '  if (late > max) max = late;',
  '  prev = Date.now();',
  '}, 100);',
  '',
  'setTimeout(() => {',
  '  let s = 0;',
  '  for (let i = 0; i < 3e9; i++) s += i;   // nặng CPU, ĐỒNG BỘ',
  '}, 300);',
];

const POOL_CODE = [
  'const t = Date.now();',
  '',
  'for (let i = 1; i <= 8; i++) {',
  "  crypto.pbkdf2('pw', 'salt', 200000, 64, 'sha512',",
  "    () => log('task', i, 'xong sau', Date.now() - t, 'ms'));",
  '}',
  '',
  '// pbkdf2 là BẤT ĐỒNG BỘ, nhưng thật sự nặng CPU',
  '// → libuv đẩy nó xuống threadpool, mặc định 4 luồng',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const blockPanels: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Thí nghiệm', en: 'The experiment' },
    x: 0,
    y: 0,
    w: 424,
    h: 300,
    lines: BLOCK_CODE,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Đo tại chỗ', en: 'Live gauges' },
    x: 0,
    y: 312,
    w: 424,
    h: 248,
    accent: '#f43f5e',
    meters: [
      {
        id: 'lag',
        label: 'Độ trễ nhịp tim (event loop lag)',
        max: 3000,
        unit: 'ms',
        threshold: 100,
        thresholdLabel: 'ngưỡng báo động',
        accent: '#f43f5e',
      },
      { id: 'served', label: 'Request phục vụ được trong lúc này', max: 200, unit: '', accent: '#34d399' },
    ],
  },
  {
    id: 'lag',
    kind: 'chart',
    mode: 'line',
    title: { vi: 'Nhịp tim đến trễ bao nhiêu', en: 'How late each heartbeat arrives' },
    hint: { vi: 'lẽ ra phải là một đường phẳng sát 0', en: 'should be a flat line near zero' },
    x: 436,
    y: 0,
    w: 564,
    h: 300,
    accent: '#f43f5e',
    unit: 'ms',
    max: 3200,
    xMax: 3600,
    xLabel: { vi: 'thời gian (ms)', en: 'time (ms)' },
    series: [{ id: 'late', label: 'trễ (ms)', accent: '#f43f5e' }],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 436,
    y: 312,
    w: 564,
    h: 248,
    accent: '#34d399',
    maxLines: 6,
  },
];

const poolPanels: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Tám lời gọi cùng lúc', en: 'Eight calls at once' },
    x: 0,
    y: 0,
    w: 424,
    h: 268,
    lines: POOL_CODE,
  },
  {
    id: 'wait',
    kind: 'lanes',
    title: { vi: 'Hàng chờ threadpool', en: 'Threadpool queue' },
    hint: { vi: 'quá 4 việc là phải xếp hàng', en: 'past four, work queues up' },
    x: 0,
    y: 280,
    w: 424,
    h: 280,
    accent: '#f59e0b',
    lanes: [{ id: 'q', label: 'Xếp hàng', sub: { vi: 'chờ luồng rảnh', en: 'awaiting a free thread' }, accent: '#f59e0b' }],
  },
  {
    id: 'pool',
    kind: 'lanes',
    layout: 'cols',
    title: { vi: 'libuv threadpool — 4 luồng (mặc định)', en: 'libuv threadpool — 4 threads (default)' },
    hint: { vi: 'UV_THREADPOOL_SIZE', en: 'UV_THREADPOOL_SIZE' },
    x: 436,
    y: 0,
    w: 564,
    h: 268,
    lanes: [
      { id: 't1', label: 'luồng 1', accent: '#22d3ee' },
      { id: 't2', label: 'luồng 2', accent: '#22d3ee' },
      { id: 't3', label: 'luồng 3', accent: '#22d3ee' },
      { id: 't4', label: 'luồng 4', accent: '#22d3ee' },
    ],
  },
  {
    id: 'done',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Mỗi task xong lúc nào (ms)', en: 'When each task finished (ms)' },
    hint: { vi: 'hai đợt sóng = bốn luồng', en: 'two waves = four threads' },
    x: 436,
    y: 280,
    w: 564,
    h: 280,
    accent: '#22d3ee',
    unit: 'ms',
    max: 150,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({
  p: 'out',
  op: 'push',
  item: { label, tone },
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
   A — CHẶN EVENT LOOP
   ──────────────────────────────────────────────────────────── */

function buildBlocking(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Đặt một nhịp tim 100ms', en: 'Set a 100ms heartbeat' },
    {
      vi: 'Kỹ thuật đo đơn giản nhất và cũng hữu ích nhất: một `setInterval` 100ms tự ghi lại xem nó ĐẾN MUỘN bao nhiêu. Con số đó — độ trễ event loop — là chỉ số sức khoẻ quan trọng nhất của một dịch vụ Node.',
      en: 'The simplest and most useful measurement there is: a 100ms `setInterval` that records how LATE it actually arrives. That number — event loop lag — is the single most important health metric a Node service has.',
    },
    2200,
    [lines([3, 4, 5, 6, 7]), { p: 'gauges', op: 'value', key: 'lag', value: 0, label: '0 ms', tone: 'ok' }, { p: 'gauges', op: 'value', key: 'served', value: 0, label: '—' }],
    { sfx: 'click' }
  );

  push(
    'healthy',
    { vi: 'Ba nhịp đầu: đúng giờ', en: 'First three beats: on time' },
    {
      vi: 'Không có gì cạnh tranh, vòng lặp rảnh rỗi ngủ ở pha poll. Nhịp tim đến đúng hạn, trễ 0–1ms. Đây là hình dạng của một tiến trình khoẻ.',
      en: 'Nothing competes, the loop idles asleep in poll. Beats land on time, 0–1ms late. This is what a healthy process looks like.',
    },
    2100,
    [
      { p: 'lag', op: 'point', key: 'late', x: 100, y: 1 },
      { p: 'lag', op: 'point', key: 'late', x: 200, y: 0 },
      { p: 'lag', op: 'point', key: 'late', x: 300, y: 1 },
      { p: 'gauges', op: 'value', key: 'lag', value: 1, label: '1 ms', tone: 'ok' },
      out('nhịp 100ms · trễ 1ms'),
      out('nhịp 200ms · trễ 0ms'),
    ],
    { sfx: 'blip' }
  );

  push(
    'start',
    { vi: 'Vòng lặp 3 tỉ phép cộng bắt đầu', en: 'Three billion additions begin' },
    {
      vi: 'Callback của `setTimeout` lên ngăn xếp và bắt đầu đếm. Nó ĐỒNG BỘ — nghĩa là nó sẽ không trả ngăn xếp lại cho tới khi đếm xong. Từ giây phút này, event loop không quay được vòng nào nữa.',
      en: 'The `setTimeout` callback takes the stack and starts counting. It is SYNCHRONOUS — it will not give the stack back until it finishes. From this instant, the event loop cannot turn.',
    },
    2400,
    [lines([9, 10, 11, 12]), out('→ bắt đầu tính toán nặng (đồng bộ)…', 'warn'), { p: 'gauges', op: 'value', key: 'lag', value: 300, label: '300 ms', tone: 'warn' }],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn: "đồng bộ" ở đây không phải chi tiết cú pháp — nó là toàn bộ vấn đề.',
        en: 'Stress: "synchronous" here is not a syntax detail — it is the entire problem.',
      },
    }
  );

  push(
    'climbing',
    { vi: 'Nhịp tim ngừng đập', en: 'The heartbeat stops' },
    {
      vi: 'Không có nhịp nào tới nữa. Không phải vì timer bị huỷ — mà vì pha timers không được chạy. Độ trễ cứ thế leo lên theo đúng thời gian tính toán.',
      en: 'No further beats arrive. Not because the timer was cancelled — because the timers phase never runs. The lag climbs in lockstep with the computation.',
    },
    2600,
    [
      { p: 'lag', op: 'point', key: 'late', x: 1200, y: 900 },
      { p: 'lag', op: 'point', key: 'late', x: 2100, y: 1800 },
      { p: 'gauges', op: 'value', key: 'lag', value: 1800, label: '1.800 ms', tone: 'err' },
      { p: 'gauges', op: 'value', key: 'served', value: 0, label: '0', tone: 'err' },
    ],
    { sfx: 'buzz' }
  );

  push(
    'peak',
    { vi: 'Tính xong sau 2.871ms · trễ tối đa 2.873ms', en: 'Done after 2,871ms · max lag 2,873ms' },
    {
      vi: 'Hãy đọc hai con số này CÙNG NHAU. Chúng bằng nhau, và đó chính là bài học: toàn bộ thời gian tính toán là thời gian tiến trình không nhận được request, không trả lời được request, không đọc được cơ sở dữ liệu, không đáp nổi health check.',
      en: 'Read these two numbers TOGETHER. They are the same number, and that is the lesson: the entire computation window is time in which the process accepted no request, answered none, read no database, and failed every health check.',
    },
    2800,
    [
      { p: 'lag', op: 'point', key: 'late', x: 3171, y: 2873 },
      { p: 'gauges', op: 'value', key: 'lag', value: 2873, label: '2.873 ms', tone: 'err' },
      out('→ tính xong sau 2871 ms', 'warn'),
      out('→ nhịp tim bị trễ TỐI ĐA: 2873 ms', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Câu chốt: 2871 ≈ 2873. Thời gian tính = thời gian chết.',
        en: 'The punchline: 2871 ≈ 2873. Compute time IS dead time.',
      },
    }
  );

  push(
    'recover',
    { vi: 'Ngăn xếp trống — vòng lặp sống lại', en: 'Stack empty — the loop revives' },
    {
      vi: 'Nhịp tim đập lại ngay lập tức, như chưa từng có chuyện gì. Đó mới là phần nguy hiểm: hệ thống không để lại lỗi nào, không có ngoại lệ nào trong log. Chỉ có một khoảng lặng mà chỉ số trễ mới nhìn thấy.',
      en: 'The heartbeat resumes instantly, as if nothing happened. That is the dangerous part: no error is left behind, no exception in the logs. Just a silence that only a lag metric can see.',
    },
    2300,
    [
      { p: 'lag', op: 'point', key: 'late', x: 3300, y: 1 },
      { p: 'gauges', op: 'value', key: 'lag', value: 1, label: '1 ms', tone: 'ok' },
      out('nhịp 3300ms · trễ 1ms'),
    ],
    { sfx: 'success' }
  );

  push(
    'queue',
    { vi: 'Và nếu có 200 người cùng gọi?', en: 'And if 200 users call at once?' },
    {
      vi: 'Họ KHÔNG phải mỗi người chờ 2,9 giây — họ xếp hàng. Người thứ 200 chờ khoảng MƯỜI PHÚT. Đó là cách một endpoint chưa tối ưu duy nhất hạ gục cả API, và là lý do câu "máy tôi chạy nhanh mà" với một người dùng chẳng chứng minh được gì.',
      en: 'They do NOT each wait 2.9 seconds — they queue. The 200th waits roughly TEN MINUTES. This is how one unoptimised endpoint takes down an entire API, and why "it is fast on my machine with one user" proves nothing.',
    },
    2900,
    [
      { p: 'gauges', op: 'value', key: 'served', value: 1, label: '1 / 200', tone: 'err' },
      { p: 'gauges', op: 'value', key: 'lag', value: 3000, label: '≈ 10 phút cho người thứ 200', tone: 'err' },
      out('người thứ 200 chờ ≈ 574 giây', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'verdict',
    { vi: 'Chờ thì miễn phí, NGHĨ thì không', en: 'Waiting is free, THINKING is not' },
    {
      vi: 'Mọi thứ `await` được — truy vấn CSDL, gọi HTTP, đọc file bất đồng bộ — đều vô hại: tiến trình đi ngủ và phục vụ người khác. Thứ giết chết nó là vòng lặp lớn, `JSON.parse` payload khổng lồ, mật mã đồng bộ, `fs.readFileSync`, và regex quay lui (ReDoS — một chuỗi 30 ký tự treo được vòng lặp hàng phút).',
      en: 'Everything you can `await` — database queries, HTTP calls, async file reads — is harmless: the process sleeps and serves someone else. What kills it is big loops, `JSON.parse` on a huge payload, synchronous crypto, `fs.readFileSync`, and backtracking regex (ReDoS — a 30-character string can hang the loop for minutes).',
    },
    3000,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — THREADPOOL BỐN LUỒNG
   ──────────────────────────────────────────────────────────── */

/** Kết quả đo thật trong giáo trình: hai đợt sóng rõ rệt. */
const WAVE_1 = [
  { task: 1, thread: 't1', ms: 49 },
  { task: 3, thread: 't2', ms: 54 },
  { task: 4, thread: 't3', ms: 61 },
  { task: 2, thread: 't4', ms: 63 },
];
const WAVE_2 = [
  { task: 5, thread: 't1', ms: 100 },
  { task: 6, thread: 't2', ms: 113 },
  { task: 7, thread: 't3', ms: 121 },
  { task: 8, thread: 't4', ms: 131 },
];

function buildPool(): SimStep[] {
  const { steps, push } = collector();

  push(
    'fire',
    { vi: 'Bắn tám lời gọi pbkdf2 cùng lúc', en: 'Fire eight pbkdf2 calls at once' },
    {
      vi: '`crypto.pbkdf2` là BẤT ĐỒNG BỘ — nó không chặn vòng lặp. Nhưng nó thật sự nặng CPU, nên libuv không thể chỉ "chờ" nó: nó đẩy công việc xuống threadpool. Mặc định pool có ĐÚNG BỐN luồng.',
      en: '`crypto.pbkdf2` is ASYNCHRONOUS — it does not block the loop. But it is genuinely CPU-heavy, so libuv cannot merely "wait" for it: it hands the work to the threadpool. By default that pool has exactly FOUR threads.',
    },
    2400,
    [
      lines([3, 4, 5, 6]),
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(
        (i): PanelOp => ({ p: 'wait', op: 'push', lane: 'q', item: { id: `t${i}`, label: `task ${i}`, tone: 'warn' } })
      ),
    ],
    { sfx: 'click' }
  );

  push(
    'wave1-start',
    { vi: 'Bốn việc đầu chiếm bốn luồng', en: 'The first four take all four threads' },
    {
      vi: 'Task 1 tới 4 rời hàng chờ và chạy song song thật — trên bốn nhân CPU khác nhau. Bốn task còn lại không đi đâu cả: không còn luồng nào rảnh.',
      en: 'Tasks 1 through 4 leave the queue and run genuinely in parallel, on four different CPU cores. The other four go nowhere: there is no free thread.',
    },
    2400,
    [
      { p: 'wait', op: 'shift', lane: 'q', n: 4 },
      ...WAVE_1.map(
        (w): PanelOp => ({
          p: 'pool',
          op: 'push',
          lane: w.thread,
          item: { id: `run${w.task}`, label: `task ${w.task}`, sub: 'đang băm', tone: 'active' },
        })
      ),
    ],
    { sfx: 'stream' }
  );

  push(
    'wave1-done',
    { vi: 'Đợt sóng thứ nhất: 49 · 54 · 61 · 63 ms', en: 'First wave: 49 · 54 · 61 · 63 ms' },
    {
      vi: 'Bốn task xong gần như cùng lúc, chênh nhau mười mấy mili giây. Đúng như mong đợi của bốn việc y hệt nhau chạy song song.',
      en: 'Four tasks finish nearly together, a dozen milliseconds apart. Exactly what four identical jobs running in parallel should look like.',
    },
    2500,
    [
      ...WAVE_1.flatMap((w): PanelOp[] => [
        { p: 'pool', op: 'clear', lane: w.thread },
        { p: 'done', op: 'value', key: `task ${w.task}`, value: w.ms, label: `${w.ms}`, tone: 'ok' },
      ]),
    ],
    { sfx: 'ping' }
  );

  push(
    'wave2-start',
    { vi: 'Luồng rảnh ra, bốn việc còn lại mới được vào', en: 'Threads free up, the other four finally start' },
    {
      vi: 'Đây là chỗ nhìn thấy cái pool. Task 5–8 không chậm vì bản thân chúng chậm — chúng chỉ ĐỨNG CHỜ suốt đợt sóng đầu.',
      en: 'This is where the pool becomes visible. Tasks 5–8 are not slow in themselves — they simply WAITED OUT the first wave.',
    },
    2400,
    [
      { p: 'wait', op: 'shift', lane: 'q', n: 4 },
      ...WAVE_2.map(
        (w): PanelOp => ({
          p: 'pool',
          op: 'push',
          lane: w.thread,
          item: { id: `run${w.task}`, label: `task ${w.task}`, sub: 'đang băm', tone: 'active' },
        })
      ),
    ],
    { sfx: 'stream' }
  );

  push(
    'wave2-done',
    { vi: 'Đợt sóng thứ hai: 100 · 113 · 121 · 131 ms', en: 'Second wave: 100 · 113 · 121 · 131 ms' },
    {
      vi: 'Hai cụm cột tách bạch trên biểu đồ. Bạn đang nhìn thẳng vào một pool bốn công nhân — không phải suy diễn từ tài liệu, mà đọc ra từ số đo.',
      en: 'Two clean clusters on the chart. You are looking straight at a pool of four workers — not inferring it from documentation, but reading it off the measurements.',
    },
    2600,
    [
      ...WAVE_2.flatMap((w): PanelOp[] => [
        { p: 'pool', op: 'clear', lane: w.thread },
        { p: 'done', op: 'value', key: `task ${w.task}`, value: w.ms, label: `${w.ms}`, tone: 'warn' },
      ]),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Chỉ vào khoảng trống giữa 63 và 100ms — đó chính là cái pool.',
        en: 'Point at the gap between 63 and 100ms — that gap IS the pool.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Nâng pool thì hai đợt sóng biến mất', en: 'Raise the pool and the waves vanish' },
    {
      vi: '`UV_THREADPOOL_SIZE=8 node pool.js` cho cả tám task xong trong một đợt. Nhưng nhớ: điều này chỉ đúng với việc mà libuv nhận — mật mã, `fs`, `dns.lookup`, nén zlib. Vòng lặp `for` của bạn thì KHÔNG: nó chạy trên luồng chính, và không có biến môi trường nào cứu được. Muốn đẩy nó ra khỏi luồng chính thì phải dùng worker threads — bài 2.5.',
      en: '`UV_THREADPOOL_SIZE=8 node pool.js` finishes all eight in one wave. But remember: this only applies to work libuv accepts — crypto, `fs`, `dns.lookup`, zlib. Your own `for` loop does NOT qualify: it runs on the main thread, and no environment variable can save it. Getting that off the main thread needs worker threads — lesson 2.5.',
    },
    3000,
    [lines([8, 9])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsBlockingScenario: Scenario = {
  id: 'nodejs-blocking',
  name: { vi: 'Chặn event loop — đo bằng số thật', en: 'Blocking the loop — measured' },
  tagline: {
    vi: 'Phép tính mất 2.871ms, nhịp tim trễ 2.873ms — cùng một con số. Xem thời gian tính toán biến thành thời gian chết, rồi nhìn thẳng vào threadpool bốn luồng.',
    en: 'The computation took 2,871ms, the heartbeat was 2,873ms late — the same number. Watch compute time become dead time, then look straight at the four-thread pool.',
  },
  icon: Activity,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '2.4',
    slug: 'nodejs-2-4-chan-event-loop',
    title: { vi: 'Chặn event loop: đo bằng số thật', en: 'Blocking the loop: measured' },
  },
  nodes: [],
  edges: [],
  panels: (opts: ScenarioOptions) => (opts.demo === 'pool' ? poolPanels : blockPanels),
  options: [
    {
      id: 'demo',
      label: { vi: 'Thí nghiệm', en: 'Experiment' },
      defaultValue: 'block',
      choices: [
        {
          value: 'block',
          label: 'Nhịp tim & vòng lặp 3e9',
          fullLabel: 'Đo độ trễ event loop',
          color: '#f43f5e',
          hint: { vi: 'thời gian tính = thời gian chết', en: 'compute time is dead time' },
        },
        {
          value: 'pool',
          label: 'Threadpool 4 luồng',
          fullLabel: '8 × crypto.pbkdf2 — hai đợt sóng',
          color: '#22d3ee',
          hint: { vi: 'nhìn thấy pool bằng số đo', en: 'see the pool in the numbers' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.demo === 'pool' ? buildPool() : buildBlocking()),
};
