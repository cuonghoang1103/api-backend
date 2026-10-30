/**
 * OSG202 · CS.3 — Cỡ nhóm luồng và định luật Little cho máy chủ.
 */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, tn, dat } from './_os.mjs';

const poolSize = (cores, waitMs, computeMs) => Math.ceil(cores * (1 + waitMs / computeMs));
const littles = (lambda, w) => lambda * w;
const P = [[4, 0, 10], [4, 90, 10], [8, 45, 5], [16, 20, 20], [2, 300, 3]];
const E1 = tinh({
  tieuDe: 'Thread pool 1 — How many worker threads?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A rule of thumb for a pool of identical workers on <b>N</b> cores: threads = N × (1 + W / C), where W is the time a request spends waiting (I/O) and C the CPU time it needs. Round UP to a whole number. Give the pool size for each case.</p>', '<p>Quy tắc kinh nghiệm cho nhóm worker giống nhau trên <b>N</b> lõi: số luồng = N × (1 + W / C), trong đó W là thời gian yêu cầu chờ (I/O) và C là thời gian CPU nó cần. Làm tròn LÊN số nguyên. Cho cỡ nhóm cho từng trường hợp.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Pool sizes', 'Cỡ nhóm luồng'),
    cot: [{ ma: 'c', ten: 'Cores, wait W, CPU C' }, { ma: 'n', ten: 'Threads' }],
    hang: P.map(([n, w, c], i) => ({ ma: `c${i}`, o: { c: `N = ${n}, W = ${w} ms, C = ${c} ms` } })),
    dapAn: Object.fromEntries(P.map(([n, w, c], i) => [`c${i}.n`, String(poolSize(n, w, c))])),
    giaiThich: giai(P.map(([n, w, c]) => `N=${n}, W=${w}, C=${c}: ${n}×(1+${w}/${c}) = ${poolSize(n, w, c)}`).join('; ') + '. A purely CPU-bound task (W = 0) needs only N threads; the more it waits, the more threads keep the cores busy.', P.map(([n, w, c]) => `${n}×(1+${w}/${c}) = ${poolSize(n, w, c)}`).join('; ') + '. Việc thuần CPU (W = 0) chỉ cần N luồng; càng chờ nhiều càng cần nhiều luồng để lõi luôn bận.'),
  }],
  goiY: ['W / C is how many other requests one core can serve while one waits.', 'W = 0 gives exactly N threads.'],
  loiHayGap: ['Forgetting the “1 +” (the thread also needs the CPU for C).', 'Rounding down.'],
  giaiThich: '<p>' + P.map(([n, w, c]) => poolSize(n, w, c)).join(' · ') + '</p>',
  thuatNgu: [tn('thread pool', 'nhóm luồng'), tn('I/O-bound', 'bị giới hạn bởi I/O')],
  khaiNiem: ['thread pool sizing'],
});

const L = [[200, 0.05], [1000, 0.2], [50, 1.5]];
const E2 = jsDe({
  tieuDe: 'Thread pool 2 — Little’s law and pool sizing in code',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write two small capacity-planning helpers. <code>concurrency(lambda, seconds)</code> applies <b>Little’s law</b>: the average number of requests in the system L = λ × W (λ requests per second, W seconds each). <code>poolSize(cores, waitMs, computeMs)</code> returns <code>⌈cores × (1 + waitMs / computeMs)⌉</code>. Both return numbers. Example: 200 req/s at 50 ms each means ${littles(200, 0.05)} requests in flight.</p>`,
    `<p>Viết hai hàm trợ giúp lập kế hoạch năng lực. <code>concurrency(lambda, seconds)</code> áp dụng <b>định luật Little</b>: số yêu cầu trung bình trong hệ thống L = λ × W (λ yêu cầu mỗi giây, W giây mỗi yêu cầu). <code>poolSize(cores, waitMs, computeMs)</code> trả <code>⌈cores × (1 + waitMs / computeMs)⌉</code>. Cả hai trả số. Ví dụ: 200 req/s, mỗi yêu cầu 50 ms nghĩa là ${littles(200, 0.05)} yêu cầu đang xử lý.</p>`),
  yeuCau: [bi('Round to 6 decimals in <code>concurrency</code> to hide floating-point noise.', 'Làm tròn 6 chữ số thập phân trong <code>concurrency</code> để che nhiễu dấu phẩy động.')],
  viDu: [{ input: 'concurrency(200, 0.05)', output: String(littles(200, 0.05)), explanation: '200 × 0.05 = 10 requests in flight.|||200 × 0,05 = 10 yêu cầu đang xử lý.' }],
  goiY: ['Math.ceil for the pool size.', 'Math.round(x * 1e6) / 1e6 for concurrency.'],
  loiHayGap: ['Using milliseconds for W in Little’s law without converting.', 'Forgetting Math.ceil.'],
  giaiThich: '<p>Little’s law links the three quantities of any stable queue: concurrency = throughput × latency. It is how you size connection pools and thread pools from observed numbers.</p>',
  khaiNiem: ['Little’s law', 'capacity planning'],
  fn: 'concurrency',
  dau: "function concurrency(lambda, seconds) {\n  return 0;\n}\nfunction poolSize(cores, waitMs, computeMs) {\n  return 0;\n}\n",
  giaiMa: "// Little's law: L = lambda * W (requests in flight = throughput * latency).\nfunction concurrency(lambda, seconds) {\n  return Math.round(lambda * seconds * 1e6) / 1e6;\n}\n// Pool size for a mix of waiting (I/O) and computing: cores * (1 + wait / compute), rounded up.\nfunction poolSize(cores, waitMs, computeMs) {\n  return Math.ceil(cores * (1 + waitMs / computeMs));\n}\n",
  ref: (l, s) => Math.round(l * s * 1e6) / 1e6,
  cases: [{ args: [200, 0.05] }, { args: [1000, 0.2] }, { args: [50, 1.5] }, { args: [3, 0.333333], an: true }],
  kiemThem: P.map(([n, w, c], i) => ({ moTa: bi(`poolSize case ${i + 1}`, `poolSize ca ${i + 1}`), goi: `poolSize(${n}, ${w}, ${c})`, mongDoi: poolSize(n, w, c), ...(i > 2 ? { an: true } : {}) })),
});

export default doiDau({
  slug: 'osg202-14-cs3-pool-sizing',
  ten: '14.3 CS.3 Thread pools & Little’s law',
  khoa: KHOA,
  baiHoc: 'osg202-cs3-on',
  de: [E1, E2],
});
void L; void dat;
