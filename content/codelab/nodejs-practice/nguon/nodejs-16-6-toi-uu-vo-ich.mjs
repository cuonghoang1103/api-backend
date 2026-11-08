/** Node.js 16.6 — Những phép tối ưu không phải tối ưu: Amdahl, năm nhóm thắng lợi, ba câu hỏi trước khi tối ưu, khi nào dừng. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

function amdahl(sharePct, speedup) {
  // tiết kiệm = tỉ lệ × (1 − 1/tăng tốc). Xoá hẳn phần đó (tăng tốc vô hạn) ⇒ tiết kiệm đúng bằng tỉ lệ — đó là TRẦN.
  const saving = sharePct * (1 - 1 / speedup);
  return Number(saving.toFixed(2));
}
const E1 = await jsBai({
  ten: 'amdahl(sharePct, speedup): you can only save what the part costs', kho: 'EASY', phut: 6,
  en: '<p>Write <code>amdahl(sharePct, speedup)</code>: the percentage of the whole request saved by making a part that takes <code>sharePct</code>% of the time <code>speedup</code> times faster — <code>share × (1 − 1/speedup)</code>, rounded to 2 decimals. <code>speedup</code> may be <code>Infinity</code> (the part removed entirely); a speedup below 1 means the “optimisation” made it slower and the result is negative.</p>',
  vi: '<p>Viết <code>amdahl(sharePct, speedup)</code>: phần trăm của cả request tiết kiệm được khi làm một phần chiếm <code>sharePct</code>% thời gian nhanh lên <code>speedup</code> lần — <code>share × (1 − 1/speedup)</code>, làm tròn 2 chữ số. <code>speedup</code> có thể là <code>Infinity</code> (xoá hẳn phần đó); tăng tốc nhỏ hơn 1 nghĩa là “tối ưu” làm nó chậm đi và kết quả âm.</p>',
  goiY: [['1 / Infinity is 0 in JavaScript, so the formula already handles removal.', '1 / Infinity là 0 trong JavaScript, nên công thức đã xử lý trường hợp xoá hẳn.'], ['Round only at the end: Number(x.toFixed(2)).', 'Chỉ làm tròn ở cuối: Number(x.toFixed(2)).']],
  loi: [['Multiplying share by speedup (“1.35× faster on 16.2% = 21.9%”): the saving can never exceed the share.', 'Nhân tỉ lệ với tốc độ (“nhanh 1,35 lần trên 16,2% = 21,9%”): phần tiết kiệm không bao giờ vượt tỉ lệ.'], ['Using the standalone benchmark’s speedup without measuring the share inside the real request.', 'Dùng mức tăng tốc của benchmark riêng lẻ mà không đo tỉ lệ bên trong request thật.']],
  gt: ['The same library is worth 4.2% on the 16.1 route (stringify 16.2% of CPU) and 0.73% on the 16.2 route (2.8% of the request); even infinitely fast it is capped at the share. On the varied 340 KB payload it was 0.96× — slower — and Amdahl gives a negative number.', 'Cùng một thư viện đáng 4,2% trên route 16.1 (stringify 16,2% CPU) và 0,73% trên route 16.2 (2,8% request); kể cả nhanh vô hạn cũng bị chặn ở tỉ lệ. Trên payload đa dạng 340 KB nó là 0,96× — chậm hơn — và Amdahl cho số âm.'],
  kn: ['Amdahl', 'performance'],
  tns: [tn('share', 'tỉ lệ', 'the fraction of total time a part takes'), tn('speed-up', 'hệ số tăng tốc')],
  dau: `/** Amdahl's law */
function amdahl(sharePct, speedup) {
  // Write your solution here
  return Number((sharePct * speedup - sharePct).toFixed(2));
}
`,
  giai: '// Reference solution\n' + nguon(amdahl),
  cases: [
    { goi: 'amdahl(16.2, 1.35)', moTa: ['16.1 route: stringify 16.2%, 1.35× faster', 'Route 16.1: stringify 16,2%, nhanh 1,35 lần'] },
    { goi: 'amdahl(2.8, 1.35)', moTa: ['16.2 route: 2.8% of the request', 'Route 16.2: 2,8% request'] },
    { goi: 'amdahl(2.8, Infinity)', an: true },
    { goi: 'amdahl(2.17, 1.6)', an: true },
    { goi: 'amdahl(16.2, 0.96)', an: true },
  ],
});

const NHOM = ['do less work', 'do it once', 'do it somewhere else', 'add hardware', 'make it faster'];
const E2 = cs({
  ten: 'Where the real wins came from: put each change in its category', kho: 'EASY', phut: 6, loai: 'table',
  en: 'The five categories of lesson 16.6, in order of how much they won in this course.',
  vi: 'Năm nhóm của bài 16.6, theo thứ tự mức thắng trong khoá học.',
  bang: [bang1('b1', ['Classify each measured change', 'Xếp nhóm từng thay đổi đã đo'], [{ ma: 'x', ten: 'Change (measured gain)' }, { ma: 'k', ten: 'Category', luaChon: NHOM }], [
    { o: { x: 'An index on the filtered column (657×)' }, a: { k: 'do less work' } },
    { o: { x: 'A Redis cache hit instead of the query (143.5×)' }, a: { k: 'do less work' } },
    { o: { x: 'Precompute renderNote at startup (2.3×)' }, a: { k: 'do it once' } },
    { o: { x: 'Send the email from a queue worker, not inside the request' }, a: { k: 'do it somewhere else' } },
    { o: { x: 'Cluster for CPU-heavy work (3.4×)' }, a: { k: 'add hardware' } },
    { o: { x: 'fast-json-stringify instead of JSON.stringify (0.96–1.35×)' }, a: { k: 'make it faster' } },
    { o: { x: 'Send only the fields the list renders (2.8×)' }, a: { k: 'do less work' } },
  ], ['Every large win removes work or does it once. Only “make it faster” can come out below 1 — and it is the category people reach for first, because it feels like engineering.', 'Mọi thắng lợi lớn đều bỏ bớt việc hoặc làm một lần. Chỉ “làm nhanh hơn” mới có thể ra dưới 1 — và đó là nhóm người ta với tới đầu tiên, vì nó trông giống kỹ thuật.'])],
  goiY: [['Does the change remove work, repeat it less, move it, buy more CPU, or speed up the same work?', 'Thay đổi đó bỏ việc, lặp ít hơn, dời việc, mua thêm CPU, hay tăng tốc cùng một việc?'], ['A queue does not make anything faster; it takes work off the user’s critical path.', 'Hàng đợi không làm gì nhanh hơn; nó đưa việc ra khỏi đường găng của người dùng.']],
  loi: [['Calling an index “make it faster”: it reads fewer rows, which is doing less.', 'Gọi index là “làm nhanh hơn”: nó đọc ít dòng hơn, tức là làm ít việc hơn.'], ['Putting the queue under “add hardware” because a worker is another process.', 'Xếp hàng đợi vào “thêm phần cứng” vì worker là tiến trình khác.']],
  tns: [tn('critical path', 'đường găng', 'what the user waits for')],
  kn: ['performance'],
});

function triage(proposals) {
  // Ba câu hỏi: (1) bao nhiêu phần trăm? dưới 5% ⇒ dừng; (2) xoá được không? (speedup = Infinity); (3) có thêm lỗi không?
  return proposals
    .map((p) => {
      const savingPct = Number((p.sharePct * (1 - 1 / p.speedup)).toFixed(2));
      let verdict = 'do';
      if (p.sharePct < 5) verdict = 'skip: under 5%';
      else if (p.addsBugs) verdict = 'skip: adds bugs';
      return { name: p.name, savingPct, verdict };
    })
    .sort((a, b) => (a.verdict === 'do') !== (b.verdict === 'do') ? (a.verdict === 'do' ? -1 : 1) : b.savingPct - a.savingPct);
}
const FEED = [
  { name: 'A: rewrite the date-formatting helper', sharePct: 2, speedup: 3, addsBugs: false },
  { name: 'B: cache the feed for 10 s in Redis', sharePct: 90, speedup: Infinity, addsBugs: false },
  { name: 'C: two more cluster workers', sharePct: 35, speedup: 1.07, addsBugs: true },
];
const E3 = await jsBai({
  ten: 'triage(proposals): three questions before any optimisation', kho: 'HARD', phut: 15,
  en: '<p>Each proposal is <code>{ name, sharePct, speedup, addsBugs }</code> (<code>speedup = Infinity</code> when the work is removed). For each compute <code>savingPct</code> (Amdahl, rounded to 2 decimals) and a <code>verdict</code>: <code>"skip: under 5%"</code> if <code>sharePct &lt; 5</code>; otherwise <code>"skip: adds bugs"</code> if <code>addsBugs</code>; otherwise <code>"do"</code>. Return <code>{ name, savingPct, verdict }</code> for all proposals: first every <code>"do"</code>, then the skipped ones, each group sorted by <code>savingPct</code> descending.</p>',
  vi: '<p>Mỗi đề xuất là <code>{ name, sharePct, speedup, addsBugs }</code> (<code>speedup = Infinity</code> khi bỏ hẳn việc đó). Với mỗi cái tính <code>savingPct</code> (Amdahl, làm tròn 2 chữ số) và <code>verdict</code>: <code>"skip: under 5%"</code> nếu <code>sharePct &lt; 5</code>; không thì <code>"skip: adds bugs"</code> nếu <code>addsBugs</code>; không thì <code>"do"</code>. Trả về <code>{ name, savingPct, verdict }</code> cho mọi đề xuất: trước hết mọi <code>"do"</code>, rồi tới các đề xuất bị bỏ, mỗi nhóm sắp theo <code>savingPct</code> giảm dần.</p>',
  goiY: [['Map first, sort second.', 'Map trước, sort sau.'], ['The comparator: “do” before the rest; inside a group, larger savingPct first.', 'Hàm so sánh: “do” trước phần còn lại; trong một nhóm, savingPct lớn hơn đứng trước.']],
  loi: [['Ranking only by saving: a 7% gain that brings four classes of correctness bug (cluster) lands above a safe 4%.', 'Xếp chỉ theo phần tiết kiệm: 7% kèm bốn loại lỗi đúng đắn (cluster) đứng trên một 4% an toàn.'], ['Treating “under 5%” as “never”: it means not now, not before the bigger lines are gone.', 'Coi “dưới 5%” là “không bao giờ”: nó nghĩa là chưa phải lúc, chưa phải trước khi các dòng lớn hơn đi hết.']],
  gt: ['The /feed example of the lesson: B first (do less work, it removes the query on most requests), A skipped (2% of CPU), C skipped (65% idle means I/O-bound, +6.7% at best, and workers add bugs, not speed). Then measure p95 again against the 300 ms finish line.', 'Ví dụ /feed của bài: B trước (làm ít việc hơn, bỏ được truy vấn ở đa số request), bỏ A (2% CPU), bỏ C (rảnh 65% nghĩa là bị giới hạn bởi I/O, tốt lắm +6,7%, và worker thêm lỗi chứ không thêm tốc độ). Rồi đo lại p95 so với vạch đích 300 ms.'],
  kn: ['performance', 'decision'],
  tns: [tn('triage', 'phân loại ưu tiên')],
  dau: `/** which optimisation proposals are worth doing? */
function triage(proposals) {
  // Write your solution here
  return proposals
    .map((p) => ({ name: p.name, savingPct: p.sharePct, verdict: 'do' }))
    .sort((a, b) => b.savingPct - a.savingPct);
}
`,
  giai: '// Reference solution\n' + nguon(triage),
  cases: [
    { goi: `triage([{ name: "A: rewrite the date-formatting helper", sharePct: 2, speedup: 3, addsBugs: false }, { name: "B: cache the feed for 10 s in Redis", sharePct: 90, speedup: Infinity, addsBugs: false }, { name: "C: two more cluster workers", sharePct: 35, speedup: 1.07, addsBugs: true }])`, moTa: ['The /feed proposals of the lesson', 'Các đề xuất /feed của bài'] },
    { goi: 'triage([{ name: "fast-json-stringify", sharePct: 2.8, speedup: 1.35, addsBugs: false }, { name: "fewer fields", sharePct: 40, speedup: 2.8, addsBugs: false }])', moTa: ['A faster library vs sending less', 'Thư viện nhanh hơn so với gửi ít hơn'] },
    { goi: 'triage([{ name: "x", sharePct: 5, speedup: 2, addsBugs: false }, { name: "y", sharePct: 20, speedup: 1.25, addsBugs: false }, { name: "z", sharePct: 60, speedup: 10, addsBugs: true }, { name: "w", sharePct: 4.9, speedup: Infinity, addsBugs: false }])', an: true },
    { goi: 'triage([])', an: true },
  ],
});
void FEED;

function optimisationLoop(startP95, targetP95, steps) {
  // Vạch đích đặt TRƯỚC khi bắt đầu. Mỗi bước: đo lại; không cải thiện ⇒ hoàn tác; chạm đích ⇒ DỪNG.
  let p95 = startP95;
  const kept = [];
  const reverted = [];
  let stoppedAt = null;
  if (p95 <= targetP95) return { kept, reverted, stoppedAt: 'already met', finalP95: p95 };
  for (const s of steps) {
    if (s.p95After < p95) { kept.push(s.change); p95 = s.p95After; } else reverted.push(s.change);
    if (p95 <= targetP95) { stoppedAt = s.change; break; }
  }
  return { kept, reverted, stoppedAt, finalP95: p95 };
}
const E4 = await jsBai({
  ten: 'optimisationLoop(startP95, targetP95, steps): keep what helped, revert what did not, stop at the finish line', kho: 'MEDIUM', phut: 12,
  en: '<p>Optimisation has no natural stopping point, so the finish line is set before starting. <code>steps</code> are tried in order; each is <code>{ change, p95After }</code> — the p95 measured after applying <code>change</code> on top of everything kept so far. Write <code>optimisationLoop(startP95, targetP95, steps)</code>: if the start already meets the target (<code>≤</code>), return <code>{ kept: [], reverted: [], stoppedAt: "already met", finalP95: startP95 }</code>. Otherwise, for each step: keep it if <code>p95After</code> is strictly lower than the current p95 (which becomes the new current), else revert it; as soon as the current p95 is <code>≤ targetP95</code>, stop (later steps are not tried). Return <code>{ kept, reverted, stoppedAt, finalP95 }</code> — <code>stoppedAt</code> is the change that reached the target, or <code>null</code>.</p>',
  vi: '<p>Tối ưu không có điểm dừng tự nhiên, nên vạch đích được đặt trước khi bắt đầu. <code>steps</code> được thử theo thứ tự; mỗi bước là <code>{ change, p95After }</code> — p95 đo được sau khi áp <code>change</code> lên trên mọi thứ đã giữ. Viết <code>optimisationLoop(startP95, targetP95, steps)</code>: nếu lúc đầu đã đạt mục tiêu (<code>≤</code>) thì trả <code>{ kept: [], reverted: [], stoppedAt: "already met", finalP95: startP95 }</code>. Không thì với mỗi bước: giữ nếu <code>p95After</code> thấp hơn hẳn p95 hiện tại (thành p95 hiện tại mới), không thì hoàn tác; ngay khi p95 hiện tại <code>≤ targetP95</code> thì dừng (các bước sau không thử). Trả về <code>{ kept, reverted, stoppedAt, finalP95 }</code> — <code>stoppedAt</code> là thay đổi chạm đích, hoặc <code>null</code>.</p>',
  goiY: [['Track one variable, the current p95; compare each step to it, not to the start.', 'Giữ một biến, p95 hiện tại; so từng bước với nó, không so với lúc đầu.'], ['Check the target after each step and break.', 'Kiểm mục tiêu sau mỗi bước rồi break.']],
  loi: [['Keeping a change that did not move p95: more complex code that is no faster is a net loss.', 'Giữ một thay đổi không làm p95 nhúc nhích: mã phức tạp hơn mà không nhanh hơn là lỗ.'], ['Continuing after the target: “make it faster” can never be finished; “p95 under 300 ms” can.', 'Tiếp tục sau khi đạt đích: “làm nhanh hơn” không bao giờ xong; “p95 dưới 300 ms” thì xong được.']],
  gt: ['Set the p95 target users feel → profile → biggest line → fix one thing → measure → target met → stop. A day of engineering costs more than a month of a bigger VPS, unless the change removes a scaling limit (the index, the cache), not just a scaling cost.', 'Đặt mục tiêu p95 người dùng cảm nhận được → profile → dòng lớn nhất → sửa một thứ → đo → đạt đích → dừng. Một ngày công đắt hơn một tháng VPS lớn hơn, trừ khi thay đổi xoá được một giới hạn mở rộng (index, cache), chứ không chỉ một chi phí mở rộng.'],
  kn: ['performance', 'process'],
  tns: [tn('finish line', 'vạch đích'), tn('revert', 'hoàn tác')],
  dau: `/** the optimisation loop with a finish line */
function optimisationLoop(startP95, targetP95, steps) {
  // Write your solution here
  let p95 = startP95;
  const kept = [];
  for (const s of steps) { kept.push(s.change); p95 = Math.min(p95, s.p95After); }
  return { kept, reverted: [], stoppedAt: null, finalP95: p95 };
}
`,
  giai: '// Reference solution\n' + nguon(optimisationLoop),
  cases: [
    { goi: goi('optimisationLoop', 900, 300, [{ change: 'cache /feed 10 s in Redis', p95After: 340 }, { change: 'rewrite date helper', p95After: 341 }, { change: 'select only list fields', p95After: 260 }, { change: 'fast-json-stringify', p95After: 255 }]), moTa: ['/feed: 900 ms → target 300 ms', '/feed: 900 ms → mục tiêu 300 ms'] },
    { goi: goi('optimisationLoop', 250, 300, [{ change: 'anything', p95After: 200 }]), moTa: ['Already under the target', 'Đã dưới mục tiêu'] },
    { goi: goi('optimisationLoop', 900, 100, [{ change: 'a', p95After: 950 }, { change: 'b', p95After: 600 }, { change: 'c', p95After: 600 }, { change: 'd', p95After: 450 }]), an: true },
    { goi: goi('optimisationLoop', 500, 300, [{ change: 'x', p95After: 300 }, { change: 'y', p95After: 100 }]), an: true },
  ],
});

const E5 = cs({
  ten: 'Exhibit A, and the three cases where micro-optimisation is right', kho: 'MEDIUM', phut: 7,
  en: 'Questions on lesson 16.6.',
  vi: 'Câu hỏi về bài 16.6.',
  cau: [
    q('c1', ['fast-json-stringify alone on the 500 varied notes (348,590 B): 0.431 ms vs JSON.stringify 0.414 ms. On one 682-byte object: 1.85× faster. What is the lesson?', 'fast-json-stringify riêng lẻ trên 500 ghi chú đa dạng (348.590 B): 0,431 ms so với JSON.stringify 0,414 ms. Trên một object 682 byte: nhanh 1,85 lần. Bài học là gì?'],
      ['The shape of the data decides: test on your data, inside the whole request', 'fast-json-stringify is broken on large payloads and should never be used', 'JSON.stringify is always faster because it is native code', 'Small objects are the common case, so the library is always worth it'],
      ['Inside the 16.2 request it was 1.35× faster alone, with a ceiling of 0.6% of the request; the measured +3.5% was larger than the ceiling itself — noise.', 'Bên trong request 16.2 nó nhanh 1,35 lần khi đứng riêng, với trần 0,6% request; +3,5% đo được còn lớn hơn cả trần — là nhiễu.']),
    qn('c2', ['When IS micro-optimisation the right call? (choose all that apply)', 'Khi nào tối ưu vi mô LÀ đúng? (chọn mọi câu đúng)'],
      ['A loop that runs millions of times (10,000 sequential Redis calls → a pipeline)', 'A hot path the profile named, like the 16.2% stringify line of 16.1', 'A library that other people’s hot paths run through', 'Any let that could be a const, because it appears in every file'],
      [0, 1, 2],
      ['Outside those three it is a hobby. And when you do it, write the reason next to the line: which number, measured on which day.', 'Ngoài ba trường hợp đó là sở thích. Và khi làm, hãy ghi lý do cạnh dòng mã: con số nào, đo ngày nào.']),
    q('c3', ['Which two “optimisations” of this chapter were worse than neutral?', 'Hai “tối ưu” nào của chương này còn tệ hơn trung tính?'],
      ['High compression levels, and clustering an I/O-bound app', 'Precomputing renderNote, and pre-serialising the body', 'Sending fewer fields, and reusing connections', 'An index on the filtered column, and a Redis cache'],
      ['Less throughput for a barely smaller (or bigger) file; +6.7% for four new classes of correctness bug. An optimisation that adds a bug is not a slow win, it is a loss.', 'Ít thông lượng hơn để đổi lấy file nhỏ hơn chút (hoặc to hơn); +6,7% đổi lấy bốn loại lỗi đúng đắn mới. Tối ưu mà thêm lỗi không phải thắng chậm, mà là thua.']),
  ],
  goiY: [['Ask for the share of the whole request, not the speed-up of one function.', 'Hỏi tỉ lệ trên cả request, không hỏi tốc độ của một hàm.'], ['Count the bugs a change can cause next to the percent it buys.', 'Đếm số lỗi một thay đổi có thể gây ra bên cạnh phần trăm nó mua được.']],
  loi: [['Shipping a micro-optimisation as a performance fix without a profile line behind it.', 'Đưa tối ưu vi mô lên như một bản sửa hiệu năng mà không có dòng profile nào đứng sau.'], ['Trusting an isolated benchmark of one function.', 'Tin một benchmark riêng lẻ của một hàm.']],
  tns: [tn('micro-optimisation', 'tối ưu vi mô'), tn('hot path', 'đường nóng')],
  kn: ['performance'],
});

export default modul('nodejs-16-6-toi-uu-vo-ich', '16.6 Optimisations that are not: Amdahl and when to stop', [E1, E2, E5, E4, E3]);
