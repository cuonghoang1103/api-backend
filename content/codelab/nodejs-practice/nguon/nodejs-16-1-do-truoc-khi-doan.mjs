/** Node.js 16.1 — Đo trước đã: --cpu-prof, đọc bảng self time, bốn bước sửa 276 → 3.395 req/s, vòng năm bước, luật đo trung thực. */
import { modul, cs, q, qn, ord, tn, jsBai, nguon, goi, RES_GIA } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'What the profile said, and what everyone guessed', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 16.1: reading a CPU profile, the 3.2% regex, and the trap that leaves you with no profile.',
  vi: 'Câu hỏi về bài 16.1: đọc CPU profile, regex 3,2%, và cái bẫy làm bạn không có profile nào.',
  cau: [
    q('c1', ['Most people would rewrite slugify’s two regexes. What share of CPU did they take in the profile?', 'Đa số sẽ viết lại hai regex của slugify. Trong profile chúng chiếm bao nhiêu CPU?'],
      ['3.2% — a perfect rewrite buys at most 3.2%', '21.7% — the biggest line, so rewriting them was right', '16.2% — the same as JSON serialisation', '0.9% — less than the idle time of the server'],
      ['The real costs were building 500 objects (renderNote 21.7%), hashing them (crypto 20.5%) and serialising ~470 KB (stringify 16.2%), on every request, for data that never changes.', 'Chi phí thật là dựng 500 object (renderNote 21,7%), băm chúng (crypto 20,5%) và tuần tự hoá ~470 KB (stringify 16,2%), ở mọi request, cho dữ liệu không bao giờ đổi.']),
    q('c2', ['The profile’s (idle) line was 0.9%. What does that tell you?', 'Dòng (idle) của profile là 0,9%. Điều đó nói gì?'],
      ['The route is CPU-bound: optimising the code (not adding machines) pays', 'The route is I/O-bound: the CPU is waiting for the database most of the time', 'The profiler was started too late and missed most of the samples', 'The server was idle during the run, so the profile is not valid'],
      ['Under load, a CPU that is almost never idle is doing work you wrote. Lesson 16.4 uses the same line to decide whether cluster can help.', 'Dưới tải, một CPU gần như không bao giờ rảnh là đang làm việc bạn viết ra. Bài 16.4 dùng đúng dòng này để quyết định cluster có giúp được không.']),
    q('c3', ['You ran node --cpu-prof, drove load with autocannon, then stopped the server with kill -9. The ./prof folder is empty. Why?', 'Bạn chạy node --cpu-prof, tạo tải bằng autocannon, rồi dừng server bằng kill -9. Thư mục ./prof trống. Vì sao?'],
      ['--cpu-prof writes the file only on a normal exit; SIGKILL ends the process first', '--cpu-prof needs Chrome DevTools to be open, otherwise it records nothing', 'autocannon disables the V8 profiler while it is generating load', 'The profile is kept in memory until you call v8.writeHeapSnapshot()'],
      ['Handle SIGTERM, close the server, call process.exit(0), and send SIGTERM. No error, no warning otherwise — it looks exactly like “profiling does not work”.', 'Bắt SIGTERM, đóng server, gọi process.exit(0), và gửi SIGTERM. Không thì không lỗi, không cảnh báo — trông y như “profile không chạy”.']),
    qn('c4', ['Which are rules for honest benchmark numbers in this lesson? (choose all that apply)', 'Những luật nào giúp số đo benchmark trung thực trong bài? (chọn mọi câu đúng)'],
      ['Warm up first and discard the first seconds', 'Compare p97.5, not the average', 'Change one variable at a time', 'Fix the top two lines together to save one measurement'],
      [0, 1, 2],
      ['Fix exactly one thing per lap: fix two at once and you cannot tell which worked. The first few hundred requests run before V8 has compiled the hot code.', 'Mỗi vòng sửa đúng một thứ: sửa hai cái cùng lúc thì không biết cái nào có tác dụng. Vài trăm request đầu chạy trước khi V8 biên dịch xong mã nóng.']),
  ],
  goiY: [['Self time is time in the function itself, not in what it calls.', 'Self time là thời gian trong chính hàm, không tính hàm nó gọi.'], ['A profile is written by V8 when the process exits normally.', 'Profile do V8 ghi khi tiến trình thoát bình thường.']],
  loi: [['Optimising the line you suspect instead of the line the profile shows.', 'Tối ưu dòng bạn nghi thay vì dòng profile chỉ ra.'], ['Profiling an idle server: the profile is nothing but (idle).', 'Profile một server rảnh: profile toàn là (idle).']],
  tns: [tn('CPU profile', 'hồ sơ CPU', 'samples of which function runs, about every 1 ms'), tn('self time', 'thời gian tự thân'), tn('CPU-bound', 'bị giới hạn bởi CPU')],
  kn: ['performance', 'profiling'],
});

const E2 = cs({
  ten: 'The five-step loop, in order', kho: 'EASY', phut: 4, loai: 'order',
  en: 'Order the loop that took the route from 276 to 3,395 req/s.',
  vi: 'Sắp vòng lặp đã đưa route từ 276 lên 3.395 req/s.',
  cau: [
    ord('o1', ['One lap of “measure before you guess”.', 'Một vòng “đo trước khi đoán”.'], [
      'Measure a baseline with autocannon (req/s and p97.5)',
      'Take a CPU profile under load',
      'Fix exactly one thing: the top line of the table',
      'Measure again, and revert if nothing moved',
      'Profile again: the bottleneck has moved',
    ], ['Without a baseline you can prove nothing; more complex code that is no faster is a net loss; after each fix the old table no longer holds.', 'Không có mốc thì không chứng minh được gì; mã phức tạp hơn mà không nhanh hơn là lỗ; sau mỗi lần sửa, bảng cũ không còn đúng.']),
  ],
  goiY: [['Measurement comes before and after every change.', 'Đo đứng trước và sau mọi thay đổi.'], ['The last step starts the next lap.', 'Bước cuối mở ra vòng tiếp theo.']],
  loi: [['Profiling before you have a baseline number.', 'Profile trước khi có con số mốc.'], ['Keeping a change that did not move the numbers.', 'Giữ lại thay đổi không làm số đo nhúc nhích.']],
  tns: [tn('baseline', 'mốc so sánh')],
  kn: ['performance'],
});

function topSelf(profile, n) {
  // Một hàm có thể xuất hiện ở NHIỀU nút (mỗi đường gọi một nút) ⇒ cộng hitCount theo tên hàm.
  const hits = new Map();
  let total = 0;
  for (const node of profile.nodes) {
    const name = node.callFrame.functionName || '(anonymous)';
    hits.set(name, (hits.get(name) || 0) + node.hitCount);
    total += node.hitCount;
  }
  return [...hits]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))          // nhiều mẫu nhất trước; hoà thì theo tên
    .slice(0, n)
    .map(([name, h]) => ({ name, pct: Number(((100 * h) / total).toFixed(1)) }));
}
const N = (id, functionName, hitCount) => ({ id, callFrame: { functionName, url: '' }, hitCount });
const PROF = { nodes: [N(1, '(root)', 0), N(2, 'renderNote', 600), N(3, 'update', 380), N(4, 'stringify', 618), N(5, '(garbage collector)', 336), N(6, 'slugify', 170), N(7, 'replace', 76), N(8, 'replace', 46), N(9, 'renderNote', 227), N(10, 'update', 245), N(11, '(idle)', 34), N(12, '', 120), N(13, 'digest', 160), N(14, 'createHash', 98)] };
const E3 = await jsBai({
  ten: 'topSelf(profile, n): read a .cpuprofile the way the lesson’s table does', kho: 'MEDIUM', phut: 14,
  en: '<p>A <code>.cpuprofile</code> written by <code>node --cpu-prof</code> has <code>nodes</code>: <code>{ id, callFrame: { functionName, url }, hitCount }</code>, where <code>hitCount</code> is how many samples (~1 ms each) caught that node running its own code. The same function appears in several nodes (one per call path). Write <code>topSelf(profile, n)</code> returning the <code>n</code> functions with the most self samples as <code>{ name, pct }</code>: add up <code>hitCount</code> per function name (an empty name is <code>"(anonymous)"</code>), <code>pct</code> = share of all samples × 100 rounded to 1 decimal, sorted by samples descending (ties by name, A→Z).</p>',
  vi: '<p>Tệp <code>.cpuprofile</code> do <code>node --cpu-prof</code> ghi có <code>nodes</code>: <code>{ id, callFrame: { functionName, url }, hitCount }</code>, trong đó <code>hitCount</code> là số lần lấy mẫu (~1 ms mỗi lần) bắt gặp nút đó đang chạy mã của chính nó. Cùng một hàm xuất hiện ở nhiều nút (mỗi đường gọi một nút). Viết <code>topSelf(profile, n)</code> trả về <code>n</code> hàm có nhiều mẫu tự thân nhất dạng <code>{ name, pct }</code>: cộng <code>hitCount</code> theo tên hàm (tên rỗng là <code>"(anonymous)"</code>), <code>pct</code> = tỉ lệ trên tổng số mẫu × 100 làm tròn 1 chữ số, sắp theo số mẫu giảm dần (hoà thì theo tên, A→Z).</p>',
  goiY: [['Use a Map from name to total hits, and count the grand total in the same loop.', 'Dùng Map từ tên tới tổng số mẫu, và đếm tổng chung trong cùng vòng lặp.'], ['Sort with (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1).', 'Sắp bằng (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1).']],
  loi: [['Reading node by node: renderNote then looks like two medium lines instead of the biggest one.', 'Đọc từng nút: renderNote khi đó trông như hai dòng vừa thay vì dòng lớn nhất.'], ['Confusing self time with total time: (root) contains everything but runs nothing itself.', 'Nhầm self time với total time: (root) chứa mọi thứ nhưng tự nó không chạy gì.']],
  gt: ['This is the table the lesson printed: renderNote at the top, then crypto’s update, stringify, the garbage collector, slugify — and the two regex replace lines far down. Summing per function is what turns 3,813 samples into a decision.', 'Đây là bảng bài học đã in: renderNote ở đầu, rồi update của crypto, stringify, bộ gom rác, slugify — còn hai dòng replace của regex nằm tít dưới. Cộng theo hàm là thứ biến 3.813 mẫu thành một quyết định.'],
  kn: ['profiling', 'Map', 'sorting'],
  tns: [tn('sample', 'mẫu', 'one snapshot of which function is running'), tn('call path', 'đường gọi')],
  dau: `/** the top-n self-time lines of a CPU profile */
function topSelf(profile, n) {
  // Write your solution here
  const total = profile.nodes.reduce((s, x) => s + x.hitCount, 0);
  return profile.nodes
    .slice()
    .sort((a, b) => b.hitCount - a.hitCount)
    .slice(0, n)
    .map((x) => ({ name: x.callFrame.functionName, pct: Number((100 * x.hitCount / total).toFixed(1)) }));
}
`,
  giai: '// Reference solution\n' + nguon(topSelf),
  cases: [
    { goi: goi('topSelf', PROF, 5), moTa: ['The original route, top 5', 'Route ban đầu, top 5'] },
    { goi: goi('topSelf', { nodes: [N(1, 'a', 3), N(2, 'b', 1)] }, 5), moTa: ['Fewer functions than n', 'Ít hàm hơn n'] },
    { goi: goi('topSelf', PROF, 12), an: true },
    { goi: goi('topSelf', { nodes: [N(1, 'zeta', 5), N(2, '', 5), N(3, 'alpha', 5), N(4, 'zeta', 0)] }, 3), an: true },
  ],
});

function makeListRoute(notes, renderNote, fields) {
  // Bước 1 — làm MỘT lần: renderNote (băm sha256, dựng excerpt…) chạy lúc khởi động, không ở mỗi request.
  const rendered = notes.map(renderNote);
  // Bước 3 — gửi ÍT hơn: chỉ các trường màn hình danh sách dùng.
  const slim = rendered.map((n) => Object.fromEntries(fields.map((f) => [f, n[f]])));
  // Bước 2 — tuần tự hoá MỘT lần: dữ liệu không đổi thì JSON của nó cũng không đổi.
  const BODY = JSON.stringify({ items: slim });
  return (req, res) => {
    res.type('json');
    res.send(BODY);
  };
}
const NOTES = [{ id: 1, title: 'Hello Node', body: 'x'.repeat(400) }, { id: 2, title: 'Streams & back-pressure', body: 'y'.repeat(400) }];
const RENDER = `let renders = 0; const renderNote = (n) => { renders++; return { ...n, slug: n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), excerpt: n.body.slice(0, 100), etag: 'sha256-' + n.id }; };`;
const RES_T = `${RES_GIA} const mk = () => { const r = mkRes(); r.type = (t) => { r.headers['content-type'] = t; return r; }; return r; };`;
const E4 = await jsBai({
  ten: 'makeListRoute(notes, renderNote, fields): do it once, serialise once, send less', kho: 'MEDIUM', phut: 15,
  en: '<p>Apply the three fixes of the lesson to <code>GET /notes</code>. <code>makeListRoute(notes, renderNote, fields)</code> is called <b>once at startup</b> and returns the Express handler <code>(req, res)</code>. The data is static, so: call <code>renderNote</code> once per note at startup (never per request); keep only the properties named in <code>fields</code> (in that order) of each rendered note; build the response string <code>JSON.stringify({ items })</code> once; and in the handler just <code>res.type("json")</code> then <code>res.send(BODY)</code>.</p>',
  vi: '<p>Áp ba cách sửa của bài cho <code>GET /notes</code>. <code>makeListRoute(notes, renderNote, fields)</code> được gọi <b>một lần lúc khởi động</b> và trả về handler Express <code>(req, res)</code>. Dữ liệu tĩnh nên: gọi <code>renderNote</code> một lần cho mỗi ghi chú lúc khởi động (không bao giờ ở mỗi request); với mỗi ghi chú đã render chỉ giữ các thuộc tính có tên trong <code>fields</code> (theo đúng thứ tự đó); dựng chuỗi response <code>JSON.stringify({ items })</code> một lần; còn handler chỉ <code>res.type("json")</code> rồi <code>res.send(BODY)</code>.</p>',
  yc: [['renderNote runs notes.length times in total, however many requests arrive.', 'renderNote chạy tổng cộng notes.length lần, dù có bao nhiêu request.'], ['The handler sends a string, not an object.', 'Handler gửi một chuỗi, không phải object.']],
  goiY: [['Everything that does not depend on req goes OUTSIDE the returned function.', 'Mọi thứ không phụ thuộc req nằm NGOÀI hàm được trả về.'], ['Object.fromEntries(fields.map((f) => [f, n[f]])) keeps the chosen fields in order.', 'Object.fromEntries(fields.map((f) => [f, n[f]])) giữ các trường đã chọn theo thứ tự.']],
  loi: [['Calling res.json(rendered) in the handler: JSON.stringify runs again on every request (16.2% of the profile).', 'Gọi res.json(rendered) trong handler: JSON.stringify chạy lại ở mọi request (16,2% của profile).'], ['Shipping the full body and etag the list never shows: 471,698 B per response instead of 145,119 B.', 'Gửi cả body và etag mà danh sách không bao giờ hiện: 471.698 B mỗi response thay vì 145.119 B.']],
  gt: ['276 → 641 req/s (precompute), → 1,206 (pre-serialise), → 3,395 (send only the fields used): 12.3× with no library changed. Each step is a general principle: do it once, and the cheapest byte is the one you do not send. If the data can change, the same idea becomes a cache with a TTL (chapter 12).', '276 → 641 req/s (tính trước), → 1.206 (tuần tự hoá trước), → 3.395 (chỉ gửi trường dùng tới): 12,3 lần mà không đổi thư viện nào. Mỗi bước là một nguyên tắc chung: làm một lần, và byte rẻ nhất là byte không gửi. Nếu dữ liệu có thể đổi, cùng ý tưởng đó thành cache có TTL (chương 12).'],
  kn: ['performance', 'Express', 'closures'],
  tns: [tn('precompute', 'tính trước'), tn('pre-serialise', 'tuần tự hoá trước'), tn('payload', 'phần thân dữ liệu')],
  dau: `/** GET /notes, made fast */
function makeListRoute(notes, renderNote, fields) {
  return (req, res) => {
    // Write your solution here
    res.json({ items: notes.map(renderNote) });
  };
}
`,
  giai: '// Reference solution\n' + nguon(makeListRoute),
  cases: [
    { chuanBi: `${RENDER} ${RES_T} const h = makeListRoute(${JSON.stringify(NOTES)}, renderNote, ['id', 'title', 'slug', 'excerpt']); const res = mk(); h({}, res);`, goi: '({ type: res.headers["content-type"], isString: typeof res.body === "string", body: JSON.parse(res.body) })', moTa: ['One request: string body with only the list fields', 'Một request: body là chuỗi, chỉ có trường của danh sách'] },
    { chuanBi: `${RENDER} ${RES_T} const h = makeListRoute(${JSON.stringify(NOTES)}, renderNote, ['id', 'title']); for (let i = 0; i < 100; i++) h({}, mk());`, goi: 'renders', moTa: ['100 requests: how many renders?', '100 request: render bao nhiêu lần?'] },
    { chuanBi: `${RENDER} ${RES_T} const h = makeListRoute([], renderNote, ['id']); const res = mk(); h({}, res);`, goi: '[res.body, renders]', an: true },
    { chuanBi: `${RENDER} ${RES_T} const h = makeListRoute(${JSON.stringify(NOTES)}, renderNote, ['slug', 'id']); const a = mk(); const b = mk(); h({}, a); h({}, b);`, goi: '[a.body === b.body, a.body, renders]', an: true },
  ],
});

function compareRuns(baseline, candidate) {
  // Trung vị của 5 lượt — một lượt đơn lẻ trên máy bận có thể lệch rất xa.
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const mb = median(baseline);
  const mc = median(candidate);
  let verdict = 'noise';                                        // hai khoảng chồng nhau ⇒ chưa chứng minh được gì
  if (Math.min(...candidate) > Math.max(...baseline)) verdict = 'faster';
  else if (Math.max(...candidate) < Math.min(...baseline)) verdict = 'slower';
  return { baseline: mb, candidate: mc, speedup: Number((mc / mb).toFixed(2)), verdict, keep: verdict === 'faster' };
}
const E5 = await jsBai({
  ten: 'compareRuns(baseline, candidate): did the change really move the number?', kho: 'HARD', phut: 14,
  en: '<p>Step 4 of the loop: measure again, and revert if nothing moved. Each argument is the req/s of several runs (the lesson uses 5). Write <code>compareRuns(baseline, candidate)</code> returning <code>{ baseline, candidate, speedup, verdict, keep }</code>: the <b>median</b> of each side (for an even count, the mean of the two middle values); <code>speedup</code> = candidate median ÷ baseline median rounded to 2 decimals; <code>verdict</code> = <code>"faster"</code> if every candidate run beats every baseline run, <code>"slower"</code> if every candidate run is below every baseline run, otherwise <code>"noise"</code> (the ranges overlap); <code>keep</code> is true only for <code>"faster"</code>.</p>',
  vi: '<p>Bước 4 của vòng lặp: đo lại, và hoàn tác nếu không có gì nhúc nhích. Mỗi đối số là req/s của nhiều lượt chạy (bài dùng 5). Viết <code>compareRuns(baseline, candidate)</code> trả về <code>{ baseline, candidate, speedup, verdict, keep }</code>: <b>trung vị</b> của mỗi bên (số lượt chẵn thì lấy trung bình hai giá trị giữa); <code>speedup</code> = trung vị bản mới ÷ trung vị mốc làm tròn 2 chữ số; <code>verdict</code> = <code>"faster"</code> nếu mọi lượt bản mới đều hơn mọi lượt mốc, <code>"slower"</code> nếu mọi lượt bản mới đều thấp hơn mọi lượt mốc, không thì <code>"noise"</code> (hai khoảng chồng nhau); <code>keep</code> chỉ true khi <code>"faster"</code>.</p>',
  goiY: [['Sort a copy numerically; the middle index is length >> 1.', 'Sắp một bản sao theo số; chỉ số giữa là length >> 1.'], ['“Every candidate beats every baseline” is Math.min(...candidate) > Math.max(...baseline).', '“Mọi lượt mới hơn mọi lượt mốc” là Math.min(...candidate) > Math.max(...baseline).']],
  loi: [['Comparing averages or single runs: one lucky run on a busy laptop decides the merge.', 'So trung bình hay một lượt đơn: một lượt may mắn trên laptop bận quyết định việc merge.'], ['Keeping a change because its median is 3% higher while the ranges overlap — lesson 16.6’s +3.5% was exactly that.', 'Giữ thay đổi vì trung vị cao hơn 3% trong khi hai khoảng chồng nhau — +3,5% của bài 16.6 chính là như vậy.']],
  gt: ['A change that is not provably faster is a net loss: more complex code, same speed. The lesson’s four steps each moved the whole range (276 → 641 → 1,206 → 3,395); a serialiser swap that “gained” 3.5% had overlapping rounds (1,298–1,512 vs 1,455–1,609) and was noise.', 'Một thay đổi không chứng minh được là nhanh hơn là lỗ: mã phức tạp hơn, tốc độ như cũ. Bốn bước của bài đều đẩy cả khoảng lên (276 → 641 → 1.206 → 3.395); lần đổi bộ tuần tự hoá “được” 3,5% có các vòng chồng nhau (1.298–1.512 so với 1.455–1.609) và là nhiễu.'],
  kn: ['benchmarking', 'statistics'],
  tns: [tn('median', 'trung vị'), tn('noise', 'nhiễu', 'a difference smaller than run-to-run variation')],
  dau: `/** compare two sets of benchmark runs */
function compareRuns(baseline, candidate) {
  // Write your solution here
  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const b = avg(baseline), c = avg(candidate);
  const verdict = c > b ? 'faster' : 'slower';
  return { baseline: b, candidate: c, speedup: Number((c / b).toFixed(2)), verdict, keep: verdict === 'faster' };
}
`,
  giai: '// Reference solution\n' + nguon(compareRuns),
  cases: [
    { goi: goi('compareRuns', [271, 276, 280, 268, 279], [630, 641, 652, 619, 644]), moTa: ['Precompute renderNote: 276 → 641', 'Tính trước renderNote: 276 → 641'] },
    { goi: goi('compareRuns', [1470, 1298, 1512, 1401, 1488], [1522, 1455, 1609, 1501, 1530]), moTa: ['The serialiser swap of 16.6', 'Lần đổi bộ tuần tự hoá ở 16.6'] },
    { goi: goi('compareRuns', [3560, 3540, 3601, 3577], [1086, 1101, 1079, 1093]), an: true },
    { goi: goi('compareRuns', [100, 100, 100], [100, 101, 99]), an: true },
  ],
});

export default modul('nodejs-16-1-do-truoc-khi-doan', '16.1 Profile first: from 276 to 3,395 req/s', [E1, E2, E3, E4, E5]);
