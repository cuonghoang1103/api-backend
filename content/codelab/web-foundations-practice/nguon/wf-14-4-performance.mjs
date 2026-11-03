/** Bộ luyện bài 14.4 — Hiệu năng: đo thứ người dùng cảm nhận. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Xếp hạng chỉ số, CLS theo cửa sổ phiên, TBT từ tác vụ dài, chọn ảnh từ srcset, ngân sách dung lượng, chia việc dài, soát thẻ img. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 14.4 — Đo thứ người dùng cảm nhận, sửa nguyên nhân lớn nhất, rồi đo lại.</em> Mỗi bài là một phép tính mà Lighthouse hoặc thư viện web-vitals làm cho bạn.</p>';

export default doiDau({
  slug: 'wf-14-4-performance',
  ten: '14.4 Hiệu năng: đo và sửa',
  baiHoc: 'Nền tảng Web — Bài 14.4 Performance',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Xếp hạng Core Web Vitals, CLS theo cửa sổ phiên, TBT từ tác vụ dài, chọn ảnh từ srcset, ngân sách dung lượng trang, chia việc dài để nhường luồng chính, soát thẻ img — 7 bài.',
  de: [
    {
      tieuDe: 'Xếp hạng một chỉ số',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['Core Web Vitals', 'ngưỡng good/poor'], tienQuyet: ['object', 'if/else'], the: ['javascript', 'hiệu năng'],
      moTa: `${BAI}<p>Viết ${c('rate(metric, value)')} trả ${c('"good"')}, ${c('"needs-improvement"')} hoặc ${c('"poor"')} theo ngưỡng của Google: LCP 2500/4000 ms, INP 200/500 ms, CLS 0.1/0.25, FCP 1800/3000 ms, TTFB 800/1800 ms. Giá trị ≤ ngưỡng đầu ⇒ good; ≤ ngưỡng hai ⇒ needs-improvement; lớn hơn ⇒ poor. Tên chỉ số không biết ⇒ ném ${c("RangeError('unknown metric: X')")}.</p>`,
      yeuCau: ['Bảng ngưỡng là dữ liệu, không phải chuỗi if dài.', 'Đúng biên: bằng ngưỡng vẫn là mức tốt hơn.', 'Tên lạ ⇒ RangeError.'],
      dauVao: 'metric: string; value: number.', dauRa: 'string.',
      rangBuoc: ['Tên chỉ số phân biệt hoa thường như trên.'],
      viDu: [{ input: 'rate("LCP", 12340)', output: '"poor"', explanation: 'Trang slow.html của bài.' }],
      goiY: ['const T = { LCP: [2500, 4000], … };', 'if (!(metric in T)) throw new RangeError(…)'],
      khoiDau: { 'main.js': `// Bài 14.4 — xếp hạng chỉ số
function rate(metric, value) {
  return value < 2500 ? 'good' : 'poor';
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — xếp hạng chỉ số theo ngưỡng Core Web Vitals
const THRESHOLDS = {
  LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25], FCP: [1800, 3000], TTFB: [800, 1800],
};

function rate(metric, value) {
  if (!Object.hasOwn(THRESHOLDS, metric)) throw new RangeError('unknown metric: ' + metric);
  const [good, poor] = THRESHOLDS[metric];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}
` },
      giaiThich: `<p>Ngưỡng được chọn theo nghiên cứu về cảm nhận người dùng: 2,5 giây là lúc phần lớn người dùng còn thấy trang "nhanh". Google đánh giá ở phân vị 75 của người dùng thật — tức 3/4 lượt truy cập phải đạt good.</p>`,
      loiHayGap: ['Dùng < thay vì ≤ — 2500 bị tính là needs-improvement.', 'CLS tính bằng mili giây — nó không có đơn vị.'],
      thamKhao: 'https://web.dev/articles/vitals',
      kiem: [
        { moTa: 'The lesson pages|||Các trang của bài', goi: '[rate("LCP", 12340), rate("LCP", 1240), rate("CLS", 0.209), rate("CLS", 0)]', mongDoi: ['poor', 'good', 'needs-improvement', 'good'] },
        { moTa: 'Boundaries belong to the better rating|||Biên thuộc mức tốt hơn', goi: '[rate("INP", 200), rate("INP", 500), rate("INP", 501), rate("TTFB", 800)]', mongDoi: ['good', 'needs-improvement', 'poor', 'good'] },
        { moTa: 'Unknown metric throws|||Chỉ số lạ ném lỗi', goi: 'rate("FID", 10)', mongDoi: { loi: 'RangeError', thongDiep: 'unknown metric: FID' } },
      ],
    },
    {
      tieuDe: 'Total Blocking Time từ tác vụ dài',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['long task', 'TBT', '50 ms'], tienQuyet: ['filter', 'reduce'], the: ['javascript', 'hiệu năng'],
      moTa: `${BAI}<p>Một tác vụ dài là tác vụ trên luồng chính chạy hơn 50 ms. Viết ${c('blocking(tasks)')} với ${c('tasks = [{ start, duration }]')} (ms) trả ${c('{ longTasks, longest, tbt }')}: số tác vụ > 50 ms, thời lượng dài nhất (0 nếu không có tác vụ nào), và TBT = tổng phần VƯỢT 50 ms của mỗi tác vụ dài.</p>`,
      yeuCau: ['Đúng 50 ms không phải tác vụ dài.', 'TBT chỉ cộng phần vượt 50.', 'Mảng rỗng ⇒ mọi số là 0.'],
      dauVao: 'tasks: mảng.', dauRa: '{ longTasks, longest, tbt }.',
      rangBuoc: ['Không cần xét khoảng FCP–TTI.'],
      viDu: [{ input: 'một tác vụ 300 ms', output: '{ longTasks: 1, longest: 300, tbt: 250 }', explanation: 'Người dùng bấm trong lúc đó phải chờ tới 250 ms "thừa".' }],
      goiY: ['const long = tasks.filter((t) => t.duration > 50);', 'Math.max(0, ...tasks.map((t) => t.duration))'],
      khoiDau: { 'main.js': `// Bài 14.4 — TBT
function blocking(tasks) {
  return { longTasks: tasks.length, longest: 0, tbt: 0 };
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — TBT: phần vượt 50 ms của mỗi tác vụ dài là thời gian trang "đơ"
function blocking(tasks) {
  const long = tasks.filter((t) => t.duration > 50);
  return {
    longTasks: long.length,
    longest: Math.max(0, ...tasks.map((t) => t.duration)),
    tbt: long.reduce((sum, t) => sum + (t.duration - 50), 0),
  };
}
` },
      giaiThich: `<p>Vì sao trừ 50? Một tác vụ 50 ms vẫn kịp phản hồi trong 100 ms. Phần dư là khoảng người dùng bấm mà không có gì xảy ra. Bài học: chia 300 ms thành 30 mẩu 10 ms thì tổng việc như nhau nhưng TBT về 0.</p>`,
      loiHayGap: ['Cộng cả thời lượng — TBT bị thổi phồng.', 'Math.max(...[]) = -Infinity khi mảng rỗng.'],
      thamKhao: 'https://web.dev/articles/tbt',
      kiem: [
        { moTa: 'One 300 ms task|||Một tác vụ 300 ms', goi: 'blocking([{ start: 100, duration: 300 }])', mongDoi: { longTasks: 1, longest: 300, tbt: 250 } },
        { moTa: 'The same work cut into 10 ms slices|||Cùng lượng việc chia thành mẩu 10 ms', goi: 'blocking(Array.from({ length: 30 }, (_, i) => ({ start: i * 20, duration: 10 })))', mongDoi: { longTasks: 0, longest: 10, tbt: 0 } },
        { moTa: 'Exactly 50 is not long; empty input|||Đúng 50 không dài; đầu vào rỗng', goi: '[blocking([{ start: 0, duration: 50 }, { start: 60, duration: 120 }, { start: 200, duration: 51 }]), blocking([])]', mongDoi: [{ longTasks: 2, longest: 120, tbt: 71 }, { longTasks: 0, longest: 0, tbt: 0 }] },
      ],
    },
    {
      tieuDe: 'CLS theo cửa sổ phiên',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['layout shift', 'session window', 'hadRecentInput'], tienQuyet: ['vòng lặp', 'Math.max'], the: ['javascript', 'hiệu năng'],
      moTa: `${BAI}<p>Mỗi lần bố cục nhảy, trình duyệt báo ${c('{ time, value, hadRecentInput }')} (time bằng ms). Viết ${c('cls(shifts)')}: bỏ các lần có ${c('hadRecentInput')} (người dùng vừa bấm/gõ — nhảy là do họ); gom các lần còn lại thành "cửa sổ phiên": lần mới vào cùng cửa sổ nếu cách lần trước < 1000 ms VÀ cách lần đầu cửa sổ < 5000 ms, nếu không thì mở cửa sổ mới. CLS = tổng LỚN NHẤT của một cửa sổ, làm tròn 3 chữ số (${c('Math.round(x * 1000) / 1000')}). Không có lần nào ⇒ 0. Đầu vào đã theo thứ tự thời gian.</p>`,
      yeuCau: ['Bỏ hadRecentInput.', 'Khoảng cách < 1 s và cửa sổ < 5 s.', 'Lấy cửa sổ có tổng lớn nhất.'],
      dauVao: 'shifts: mảng.', dauRa: 'number.',
      rangBuoc: ['Một lượt duyệt.'],
      viDu: [{ input: 'hai lần 0.13 + 0.079 cách nhau 300 ms', output: '0.209', explanation: 'Đúng CLS của slow.html.' }],
      goiY: ['Giữ: windowStart, lastTime, windowSum, best.', 'Lần mới: nếu t - lastTime < 1000 && t - windowStart < 5000 ⇒ cộng; ngược lại windowStart = t, windowSum = value.'],
      khoiDau: { 'main.js': `// Bài 14.4 — CLS
function cls(shifts) {
  return shifts.reduce((s, x) => s + x.value, 0);
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — CLS: tổng lớn nhất trong một cửa sổ phiên (khoảng hở < 1 s, dài < 5 s)
function cls(shifts) {
  let best = 0, sum = 0, start = -Infinity, last = -Infinity;
  for (const s of shifts) {
    if (s.hadRecentInput) continue;                         // nhảy do người dùng vừa thao tác ⇒ không tính
    if (s.time - last < 1000 && s.time - start < 5000) {
      sum += s.value;                                       // cùng cửa sổ
    } else {
      start = s.time;                                       // mở cửa sổ mới
      sum = s.value;
    }
    last = s.time;
    best = Math.max(best, sum);
  }
  return Math.round(best * 1000) / 1000;
}
` },
      giaiThich: `<p>Trước 2021, CLS cộng dồn mọi lần nhảy suốt đời trang — trang mở lâu (mạng xã hội, SPA) bị phạt oan. Cửa sổ phiên đo "cơn nhảy tệ nhất" thay vì tổng, và bỏ những lần nhảy người dùng tự gây ra (mở menu).</p>`,
      loiHayGap: ['Cộng tất cả — không phải CLS hiện nay.', 'Quên làm tròn — 0.30000000000000004.'],
      thamKhao: 'https://web.dev/articles/cls',
      kiem: [
        { moTa: 'The slow page|||Trang chậm', goi: 'cls([{ time: 400, value: 0.13, hadRecentInput: false }, { time: 700, value: 0.079, hadRecentInput: false }])', mongDoi: 0.209 },
        { moTa: 'Gap ≥ 1 s opens a new window; best window wins|||Hở ≥ 1 s mở cửa sổ mới; cửa sổ lớn nhất thắng', goi: 'cls([{ time: 0, value: 0.05, hadRecentInput: false }, { time: 500, value: 0.05, hadRecentInput: false }, { time: 2000, value: 0.2, hadRecentInput: false }, { time: 2100, value: 0.1, hadRecentInput: false }])', mongDoi: 0.3 },
        { moTa: 'Window capped at 5 s; input shifts ignored; empty is 0|||Cửa sổ tối đa 5 s; bỏ lần do người dùng; rỗng là 0', goi: '[cls([0, 900, 1800, 2700, 3600, 4500, 5400].map((t) => ({ time: t, value: 0.1, hadRecentInput: false }))), cls([{ time: 0, value: 0.9, hadRecentInput: true }]), cls([])]', mongDoi: [0.6, 0, 0] },
      ],
    },
    {
      tieuDe: 'Trình duyệt chọn ảnh nào trong srcset',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['srcset', 'sizes', 'device pixel ratio'], tienQuyet: ['split', 'sort'], the: ['javascript', 'hiệu năng', 'ảnh'],
      moTa: `${BAI}<p>Viết ${c('pickSource(srcset, slotWidth, dpr)')}: ${c('srcset')} là chuỗi ${c('"a-480.webp 480w, a-960.webp 960w, a-1920.webp 1920w"')} (thứ tự bất kỳ), ${c('slotWidth')} là bề rộng CSS ảnh sẽ chiếm (px), ${c('dpr')} là ${c('devicePixelRatio')}. Cần ${c('slotWidth * dpr')} điểm ảnh thật: chọn ứng viên NHỎ NHẤT có bề rộng ≥ số đó; không có ⇒ chọn ứng viên lớn nhất. Trả tên file.</p>`,
      yeuCau: ['Đọc được khoảng trắng tuỳ ý quanh dấu phẩy.', 'Không giả định thứ tự trong srcset.', 'Không đủ lớn ⇒ lấy lớn nhất.'],
      dauVao: 'srcset: string; slotWidth: number; dpr: number.', dauRa: 'string.',
      rangBuoc: ['Chỉ xử lý mô tả "w".'],
      viDu: [{ input: 'slot 400 px, dpr 2', output: '"a-960.webp"', explanation: 'Cần 800 px thật: 480 không đủ, 960 là nhỏ nhất đủ.' }],
      goiY: ['srcset.split(",").map((s) => s.trim().split(/\\s+/)) ⇒ [url, "960w"]', 'parseInt("960w") === 960'],
      khoiDau: { 'main.js': `// Bài 14.4 — chọn ảnh từ srcset
function pickSource(srcset, slotWidth, dpr) {
  return srcset.split(',')[0].trim().split(' ')[0];
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — chọn ảnh từ srcset: nhỏ nhất mà vẫn đủ nét
function pickSource(srcset, slotWidth, dpr) {
  const candidates = srcset.split(',')
    .map((part) => part.trim().split(/\\s+/))
    .map(([url, w]) => ({ url, width: parseInt(w, 10) }))
    .sort((a, b) => a.width - b.width);
  const needed = slotWidth * dpr;                                  // điểm ảnh thật cần có
  const fit = candidates.find((cand) => cand.width >= needed);
  return (fit || candidates[candidates.length - 1]).url;
}
` },
      giaiThich: `<p>Đây là lý do ${c('srcset')} + ${c('sizes')} cứu LCP trong bài: điện thoại không tải ảnh 1920 px cho một ô 400 px. Trình duyệt thật còn xét ảnh đã có trong cache và chế độ tiết kiệm dữ liệu, nhưng quy tắc gốc là đây.</p>`,
      loiHayGap: ['Quên nhân dpr — ảnh mờ trên màn hình Retina.', 'Chọn ứng viên đầu tiên đủ lớn mà không sắp xếp.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images',
      kiem: [
        { moTa: 'Smallest that is big enough|||Nhỏ nhất mà đủ lớn', goi: '[pickSource("a-480.webp 480w, a-960.webp 960w, a-1920.webp 1920w", 400, 2), pickSource("a-480.webp 480w, a-960.webp 960w, a-1920.webp 1920w", 400, 1)]', mongDoi: ['a-960.webp', 'a-480.webp'] },
        { moTa: 'Unordered, messy whitespace|||Không theo thứ tự, khoảng trắng lộn xộn', goi: 'pickSource("  big.jpg 1600w ,small.jpg   400w,  mid.jpg 800w", 500, 1.5)', mongDoi: 'mid.jpg' },
        { moTa: 'Nothing big enough ⇒ largest|||Không ứng viên nào đủ ⇒ lớn nhất', goi: 'pickSource("x-320.png 320w, x-640.png 640w", 1200, 3)', mongDoi: 'x-640.png' },
      ],
    },
    {
      tieuDe: 'Ngân sách dung lượng trang',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['performance budget', 'gom nhóm', 'KB'], tienQuyet: ['reduce', 'object'], the: ['javascript', 'hiệu năng', 'CI'],
      moTa: `${BAI}<p>Viết ${c('checkBudget(resources, budgetKb)')}: ${c('resources = [{ url, type, bytes }]')} (type: script, style, image, font, document…), ${c('budgetKb = { script: 170, image: 300, total: 500 }')} (khoá tuỳ ý, ${c('total')} là tổng mọi loại). Trả ${c('{ totals, over }')}: ${c('totals')} = KB theo từng type xuất hiện + ${c('total')}, mỗi số làm tròn 1 chữ số (${c('Math.round(bytes / 1024 * 10) / 10')}); ${c('over')} = mảng ${c('{ type, kb, budget }')} cho mỗi khoá trong ngân sách bị VƯỢT (type không có tài nguyên nào ⇒ 0 KB), theo thứ tự khoá của ${c('budgetKb')}.</p>`,
      yeuCau: ['Cộng byte trước, làm tròn sau.', 'Vượt nghĩa là lớn hơn hẳn.', 'over theo thứ tự khoá ngân sách.'],
      dauVao: 'resources: mảng; budgetKb: object.', dauRa: '{ totals, over }.',
      rangBuoc: ['1 KB = 1024 byte.'],
      viDu: [{ input: 'ảnh hero 2,3 MB, ngân sách ảnh 300 KB', output: 'over: [{ type: "image", kb: 2271.5, budget: 300 }]', explanation: 'Đúng thứ làm slow.html chậm.' }],
      goiY: ['Gom byte: sums[r.type] = (sums[r.type] || 0) + r.bytes; tổng riêng.', 'Làm tròn khi dựng totals và khi so ngân sách dùng cùng số đã làm tròn.'],
      khoiDau: { 'main.js': `// Bài 14.4 — ngân sách dung lượng
function checkBudget(resources, budgetKb) {
  return { totals: {}, over: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — ngân sách dung lượng: gom theo loại, so với ngân sách, báo chỗ vượt
const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

function checkBudget(resources, budgetKb) {
  const sums = {};
  let all = 0;
  for (const r of resources) {
    sums[r.type] = (sums[r.type] || 0) + r.bytes;      // cộng byte trước, làm tròn sau
    all += r.bytes;
  }
  const totals = {};
  for (const [type, bytes] of Object.entries(sums)) totals[type] = kb(bytes);
  totals.total = kb(all);
  const over = [];
  for (const [type, budget] of Object.entries(budgetKb)) {
    const used = totals[type] || 0;
    if (used > budget) over.push({ type, kb: used, budget });
  }
  return { totals, over };
}
` },
      giaiThich: `<p>Ngân sách biến "trang hơi nặng" thành một phép kiểm CI đỏ/xanh: ai thêm thư viện 200 KB sẽ thấy ngay bản dựng bị chặn. Lighthouse CI và ${c('bundlesize')} làm đúng việc này.</p>`,
      loiHayGap: ['Làm tròn từng file rồi cộng — sai số tích luỹ.', 'Quên loại không có tài nguyên — truy cập undefined.'],
      thamKhao: 'https://web.dev/articles/performance-budgets-101',
      kiem: [
        { moTa: 'The slow page blows the image budget|||Trang chậm vượt ngân sách ảnh', goi: 'checkBudget([{ url: "/slow.html", type: "document", bytes: 3000 }, { url: "/hero.png", type: "image", bytes: 2326016 }, { url: "/tracking.js", type: "script", bytes: 900 }], { script: 170, image: 300, total: 500 })', mongDoi: { totals: { document: 2.9, image: 2271.5, script: 0.9, total: 2275.3 }, over: [{ type: 'image', kb: 2271.5, budget: 300 }, { type: 'total', kb: 2275.3, budget: 500 }] } },
        { moTa: 'Within budget; missing type counts as 0|||Trong ngân sách; loại vắng tính là 0', goi: 'checkBudget([{ url: "/a.js", type: "script", bytes: 51200 }], { script: 50, font: 100 })', mongDoi: { totals: { script: 50, total: 50 }, over: [] } },
        { moTa: 'Sum bytes before rounding|||Cộng byte trước khi làm tròn', goi: 'checkBudget([{ url: "1", type: "style", bytes: 100 }, { url: "2", type: "style", bytes: 100 }, { url: "3", type: "style", bytes: 100 }], {}).totals.style', mongDoi: 0.3 },
      ],
    },
    {
      tieuDe: 'Chia việc dài, nhường luồng chính',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['yield to main thread', 'setTimeout 0', 'chunking'], tienQuyet: ['async/await', 'Promise', 'setTimeout'], the: ['javascript', 'hiệu năng', 'bất đồng bộ'],
      moTa: `${BAI}<p>Viết ${c('async processInChunks(items, fn, chunkSize)')}: gọi ${c('fn(item, index)')} cho mọi phần tử, theo thứ tự, mỗi lần ${c('chunkSize')} phần tử; GIỮA hai mẩu (không phải sau mẩu cuối) nhường luồng chính bằng ${c('await new Promise((r) => setTimeout(r, 0))')} để sự kiện của người dùng (một cú bấm đang xếp hàng) kịp chạy. Trả mảng kết quả của ${c('fn')}. Mẩu đầu chạy ngay, đồng bộ. ${c('chunkSize')} < 1 ⇒ ném ${c("RangeError('chunkSize must be >= 1')")}.</p>`,
      yeuCau: ['Thứ tự kết quả đúng thứ tự items.', 'Nhường giữa các mẩu — việc đã xếp hàng chen vào được.', 'Không nhường sau mẩu cuối.'],
      dauVao: 'items: mảng; fn: hàm; chunkSize: number.', dauRa: 'Promise<mảng>.',
      rangBuoc: ['Không dùng requestIdleCallback (không có trong máy chấm).'],
      viDu: [{ input: 'một cú bấm xếp hàng trước, 6 phần tử, mẩu 2', output: 'thứ tự: 1, 2, click, 3, 4, 5, 6', explanation: 'Cú bấm được xử lý sau mẩu đầu thay vì chờ hết.' }],
      goiY: ['for (let i = 0; i < items.length; i += chunkSize) { if (i > 0) await yieldToMain(); … }', 'Trình duyệt mới có scheduler.yield() — cùng ý tưởng, ưu tiên tốt hơn.'],
      khoiDau: { 'main.js': `// Bài 14.4 — chia việc dài
async function processInChunks(items, fn, chunkSize) {
  return items.map(fn);
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — chia việc dài: chạy từng mẩu, nhường luồng chính giữa các mẩu
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

async function processInChunks(items, fn, chunkSize) {
  if (!(chunkSize >= 1)) throw new RangeError('chunkSize must be >= 1');
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    if (i > 0) await yieldToMain();                       // cho cú bấm đang xếp hàng chạy
    for (let j = i; j < Math.min(i + chunkSize, items.length); j++) {
      results.push(fn(items[j], j));
    }
  }
  return results;
}
` },
      giaiThich: `<p>JavaScript chỉ có một luồng chính: khi hàm của bạn chạy, trình duyệt không vẽ, không xử lý cú bấm. Chia việc thành mẩu và nhường bằng ${c('setTimeout(0)')} cho phép những việc đã xếp hàng chen vào — tổng việc không đổi, nhưng INP và TBT giảm hẳn (bài 14.4: TBT 1.150 ms → 0).</p>`,
      loiHayGap: ['await Promise.resolve() — chỉ là microtask, không nhường cho sự kiện.', 'Nhường sau mẩu cuối — chậm vô ích.'],
      thamKhao: 'https://web.dev/articles/optimize-long-tasks',
      kiem: [
        { moTa: 'A queued click runs between chunks|||Cú bấm xếp hàng chạy giữa các mẩu', chuanBi: 'const log = []; setTimeout(() => log.push("click"), 0);', goi: '(await processInChunks([1, 2, 3, 4, 5, 6], (x) => { log.push(x); return x * 10; }, 2), log)', mongDoi: [1, 2, 'click', 3, 4, 5, 6] },
        { moTa: 'Results in order, with index|||Kết quả đúng thứ tự, kèm chỉ số', goi: 'await processInChunks(["a", "b", "c", "d", "e"], (x, i) => x + i, 2)', mongDoi: ['a0', 'b1', 'c2', 'd3', 'e4'] },
        { moTa: 'First chunk runs synchronously|||Mẩu đầu chạy đồng bộ', chuanBi: 'const seen = []; const p = processInChunks([1, 2, 3], (x) => seen.push(x), 2); const sync = [...seen]; await p;', goi: '[sync, seen]', mongDoi: [[1, 2], [1, 2, 3]] },
        { moTa: 'Invalid chunk size|||Kích thước mẩu sai', goi: 'await processInChunks([1], (x) => x, 0)', mongDoi: { loi: 'RangeError', thongDiep: 'chunkSize must be >= 1' } },
      ],
    },
    {
      tieuDe: 'Soát thẻ img theo checklist',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['width/height', 'loading=lazy', 'fetchpriority', 'checklist hiệu năng'], tienQuyet: ['object', 'mảng'], the: ['javascript', 'hiệu năng', 'html'],
      moTa: `${BAI}<p>Viết ${c('auditImages(images)')}: mỗi ảnh ${c('{ src, attrs, aboveFold, isLcp, naturalWidth, renderedWidth }')} (${c('attrs')} là object thuộc tính HTML, giá trị chuỗi). Trả mảng ${c('{ src, problems }')} CHỈ cho ảnh có vấn đề, ${c('problems')} theo đúng thứ tự kiểm sau: (1) thiếu ${c('width')} hoặc ${c('height')} ⇒ ${c('"missing width/height (CLS)"')}; (2) ${c('aboveFold')} mà ${c('loading="lazy"')} ⇒ ${c('"lazy above the fold (LCP)"')}; (3) không aboveFold và không lazy ⇒ ${c('"add loading=lazy"')}; (4) ${c('isLcp')} mà ${c('fetchpriority')} khác ${c('"high"')} ⇒ ${c('"LCP image without fetchpriority=high"')}; (5) ${c('naturalWidth > 2 * renderedWidth')} ⇒ ${c('"oversized: <natural>px for <rendered>px slot"')}.</p>`,
      yeuCau: ['Đúng thứ tự năm phép kiểm.', 'Ảnh không có vấn đề không xuất hiện.', 'Thông điệp đúng từng chữ.'],
      dauVao: 'images: mảng.', dauRa: 'mảng { src, problems }.',
      rangBuoc: ['Không cần DOM — dữ liệu đã được đo sẵn.'],
      viDu: [{ input: 'hero của slow.html', output: '{ src: "hero.png", problems: ["missing width/height (CLS)", "LCP image without fetchpriority=high", "oversized: 4000px for 960px slot"] }', explanation: 'Ba nguyên nhân bài đã sửa.' }],
      goiY: ['const a = img.attrs; const lazy = a.loading === "lazy";', 'Dựng problems bằng một chuỗi if theo thứ tự rồi chỉ push kết quả khi problems.length > 0.'],
      khoiDau: { 'main.js': `// Bài 14.4 — soát thẻ img
function auditImages(images) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 14.4 — soát thẻ img: năm lỗi phổ biến làm hỏng LCP và CLS
function auditImages(images) {
  const report = [];
  for (const img of images) {
    const a = img.attrs || {};
    const lazy = a.loading === 'lazy';
    const problems = [];
    if (!a.width || !a.height) problems.push('missing width/height (CLS)');           // không giữ chỗ ⇒ nhảy
    if (img.aboveFold && lazy) problems.push('lazy above the fold (LCP)');           // trì hoãn đúng ảnh cần sớm
    if (!img.aboveFold && !lazy) problems.push('add loading=lazy');                  // tải thứ chưa ai thấy
    if (img.isLcp && a.fetchpriority !== 'high') problems.push('LCP image without fetchpriority=high');
    if (img.naturalWidth > 2 * img.renderedWidth) {
      problems.push('oversized: ' + img.naturalWidth + 'px for ' + img.renderedWidth + 'px slot');
    }
    if (problems.length) report.push({ src: img.src, problems });
  }
  return report;
}
` },
      giaiThich: `<p>Đây là "danh sách kiểm dùng lại được" của bài biến thành mã. Lỗi phổ biến nhất ngoài đời là (2): ai đó thêm ${c('loading="lazy"')} cho MỌI ảnh để "tối ưu" và vô tình làm ảnh hero tải chậm hơn.</p>`,
      loiHayGap: ['Lazy mọi ảnh, kể cả ảnh hero.', 'Kiểm theo thứ tự khác — thông điệp lệch thứ tự.'],
      thamKhao: 'https://web.dev/articles/optimize-lcp',
      kiem: [
        { moTa: 'The slow hero image|||Ảnh hero của trang chậm', goi: 'auditImages([{ src: "hero.png", attrs: { alt: "Hero" }, aboveFold: true, isLcp: true, naturalWidth: 4000, renderedWidth: 960 }])', mongDoi: [{ src: 'hero.png', problems: ['missing width/height (CLS)', 'LCP image without fetchpriority=high', 'oversized: 4000px for 960px slot'] }] },
        { moTa: 'The fixed page has no problems|||Trang đã sửa không còn vấn đề', goi: 'auditImages([{ src: "hero-960.webp", attrs: { width: "960", height: "540", fetchpriority: "high" }, aboveFold: true, isLcp: true, naturalWidth: 1920, renderedWidth: 960 }, { src: "card.webp", attrs: { width: "300", height: "200", loading: "lazy" }, aboveFold: false, isLcp: false, naturalWidth: 600, renderedWidth: 300 }])', mongDoi: [] },
        { moTa: 'Lazy above the fold and eager below|||Lazy trên màn đầu và tải ngay bên dưới', goi: 'auditImages([{ src: "a.jpg", attrs: { width: "1", height: "1", loading: "lazy" }, aboveFold: true, isLcp: false, naturalWidth: 100, renderedWidth: 100 }, { src: "b.jpg", attrs: { width: "1", height: "1" }, aboveFold: false, isLcp: false, naturalWidth: 100, renderedWidth: 100 }])', mongDoi: [{ src: 'a.jpg', problems: ['lazy above the fold (LCP)'] }, { src: 'b.jpg', problems: ['add loading=lazy'] }] },
      ],
    },
  ],
});
