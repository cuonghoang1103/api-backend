/** Node.js 18.2 — Tổ chức theo loại hay theo tính năng, 150 tệp route theo kích thước, dữ liệu phẳng vs logic (42 vs 246 nhánh), lý do để thay đổi, ranh giới thật vs ngắt trang. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'By type or by feature, and what really makes a file hard', kho: 'EASY', phut: 6,
  en: 'Questions on lesson 18.2.',
  vi: 'Câu hỏi về bài 18.2.',
  cau: [
    q('c1', ['The rule that decides “by type” vs “by feature”?', 'Luật quyết định giữa “theo loại” và “theo tính năng”?'],
      ['Optimise for the change you actually make: people edit “the notes feature”, not “all the routes”', 'Follow the framework’s tutorial, because new developers know it', 'By type always, because it is easier to see what a route looks like', 'By feature always, from day one, whatever the size of the app'],
      ['Below about 10 features the difference is noise; above it by-feature wins — and by then the migration cost has often grown too big to happen.', 'Dưới khoảng 10 tính năng thì chênh lệch là nhiễu; trên đó theo-tính-năng thắng — và lúc ấy chi phí chuyển đổi thường đã quá lớn để làm.']),
    q('c2', ['roadmap.seed.ts: 3,646 lines, 42 branches. social.service.ts: 2,503 lines, 246 branches. Which one should you split?', 'roadmap.seed.ts: 3.646 dòng, 42 nhánh. social.service.ts: 2.503 dòng, 246 nhánh. Nên tách cái nào?'],
      ['social.service.ts: tangled logic; the seed is flat data read by searching', 'roadmap.seed.ts: it is longer, and length is what makes a file hard', 'Both, into files of at most 300 lines each', 'Neither: line counts and branch counts say nothing about a file'],
      ['Flat data can be any size (the largest file is 6,113 lines of seed); logic hurts from about 500 lines; configuration is fine while it is straight-line. Ask “what kind of file is this?” before “how long is it?”.', 'Dữ liệu phẳng dài bao nhiêu cũng được (tệp lớn nhất là 6.113 dòng seed); logic bắt đầu đau từ khoảng 500 dòng; cấu hình ổn khi còn chạy thẳng. Hỏi “đây là loại tệp gì?” trước “nó dài bao nhiêu?”.']),
    q('c3', ['You split a big file by moving functions into new files, but pricing.ts and invoice.ts still import each other’s internals. What did you get?', 'Bạn tách một tệp lớn bằng cách dời hàm sang tệp mới, nhưng pricing.ts và invoice.ts vẫn import phần bên trong của nhau. Bạn được gì?'],
      ['A page break, not a boundary: the same tangle spread over files where you can no longer see it', 'A clean boundary, because each file is now under 500 lines', 'Better performance, because smaller modules load faster', 'A modular monolith, because the files are in separate folders'],
      ['A real boundary: pricing.ts exports price(items) and invoice.ts only calls that, so each can change without opening the other. If you cannot see the seam yet, keep one file.', 'Ranh giới thật: pricing.ts export price(items) và invoice.ts chỉ gọi hàm đó, nên mỗi bên đổi được mà không phải mở bên kia. Nếu chưa thấy đường nối, cứ để một tệp.']),
    qn('c4', ['Which are signals that matter more than length? (choose all that apply)', 'Những tín hiệu nào quan trọng hơn độ dài? (chọn mọi câu đúng)'],
      ['The number of reasons to change (pricing, email and schema all touch it)', 'Import depth: how many other files you must open to understand it', 'How many people edit it at once (merge conflicts every time)', 'Whether its file name ends in .service.ts or in .routes.ts'],
      [0, 1, 2],
      ['“Single responsibility” is really about reasons to change, not size: a 900-line file that only changes when the payment provider changes is a good file; a 200-line file touched by three unrelated tickets a week is not.', '“Đơn trách nhiệm” thật ra nói về lý do để thay đổi, không phải kích thước: tệp 900 dòng chỉ đổi khi nhà cung cấp thanh toán đổi là tệp tốt; tệp 200 dòng bị ba ticket không liên quan chạm mỗi tuần thì không.']),
  ],
  goiY: [['Which change do you make most often?', 'Thay đổi nào bạn làm thường xuyên nhất?'], ['Count branches, not lines.', 'Đếm nhánh, không đếm dòng.']],
  loi: [['Applying a line-count rule without judgement.', 'Áp luật đếm dòng mà không suy xét.'], ['Splitting along a page break.', 'Tách theo chỗ ngắt trang.']],
  tns: [tn('by feature', 'theo tính năng'), tn('by type', 'theo loại'), tn('reason to change', 'lý do để thay đổi')],
  kn: ['architecture', 'code organisation'],
});

function sizeBuckets(files, top) {
  const b = { under200: 0, from200to500: 0, from500to1000: 0, over1000: 0 };
  for (const f of files) {
    if (f.lines < 200) b.under200++;
    else if (f.lines < 500) b.from200to500++;
    else if (f.lines <= 1000) b.from500to1000++;
    else b.over1000++;
  }
  const largest = [...files].sort((x, y) => y.lines - x.lines || (x.path < y.path ? -1 : 1)).slice(0, top).map((f) => `${f.path} (${f.lines})`);
  return { ...b, largest };
}
const R = (path, lines) => ({ path, lines });
const ROUTES = [R('course.routes.ts', 3626), R('work.routes.ts', 2272), R('notes.routes.ts', 180), R('gifs.routes.ts', 64), R('feed.routes.ts', 420), R('admin.routes.ts', 950), R('music.routes.ts', 1000), R('auth.routes.ts', 500), R('health.routes.ts', 30), R('cv.routes.ts', 199)];
const E2 = await jsBai({
  ten: 'sizeBuckets(files, top): where by-type stopped paying', kho: 'EASY', phut: 7,
  en: '<p>Bucket files by size: <code>under200</code> (&lt; 200 lines), <code>from200to500</code> (200–499), <code>from500to1000</code> (500–1000), <code>over1000</code> (&gt; 1000). Also return <code>largest</code>: the <code>top</code> biggest files as <code>"&lt;path&gt; (&lt;lines&gt;)"</code>, biggest first (ties by path A→Z). Return <code>{ under200, from200to500, from500to1000, over1000, largest }</code>.</p>',
  vi: '<p>Chia tệp theo kích thước: <code>under200</code> (&lt; 200 dòng), <code>from200to500</code> (200–499), <code>from500to1000</code> (500–1000), <code>over1000</code> (&gt; 1000). Trả thêm <code>largest</code>: <code>top</code> tệp lớn nhất dạng <code>"&lt;path&gt; (&lt;lines&gt;)"</code>, lớn nhất trước (hoà theo path A→Z). Trả về <code>{ under200, from200to500, from500to1000, over1000, largest }</code>.</p>',
  goiY: [['Watch the edges: 200 goes to the second bucket, 500 and 1000 to the third.', 'Chú ý biên: 200 vào ngăn thứ hai, 500 và 1000 vào ngăn thứ ba.'], ['Sort a copy, never the input.', 'Sắp một bản sao, không bao giờ sắp đầu vào.']],
  loi: [['Off-by-one at the edges (≤ 200 vs < 200).', 'Lệch một ở biên (≤ 200 so với < 200).'], ['Sorting files in place: the caller’s array changes order.', 'Sắp tệp tại chỗ: mảng của bên gọi bị đổi thứ tự.']],
  gt: ['The website’s 150 route files: 91 under 200, 36 between 200 and 500, 12 between 500 and 1,000, and 11 over 1,000. 127 of 150 under 500: each is a feature that stayed one feature. The 11 big ones — course.routes.ts at 3,626 — are several features sharing a prefix.', '150 tệp route của website: 91 dưới 200, 36 từ 200 tới 500, 12 từ 500 tới 1.000, và 11 trên 1.000. 127/150 dưới 500: mỗi tệp là một tính năng vẫn còn là một tính năng. 11 tệp lớn — course.routes.ts 3.626 dòng — là nhiều tính năng dùng chung một tiền tố.'],
  kn: ['code organisation', 'measurement'],
  tns: [tn('distribution', 'phân bố')],
  dau: `/** bucket files by size */
function sizeBuckets(files, top) {
  // Write your solution here
  const b = { under200: 0, from200to500: 0, from500to1000: 0, over1000: 0 };
  for (const f of files) {
    if (f.lines <= 200) b.under200++; else if (f.lines <= 500) b.from200to500++; else if (f.lines < 1000) b.from500to1000++; else b.over1000++;
  }
  return { ...b, largest: files.slice(0, top).map((f) => f.path + ' (' + f.lines + ')') };
}
`,
  giai: '// Reference solution\n' + nguon(sizeBuckets),
  cases: [
    { goi: goi('sizeBuckets', ROUTES, 3), moTa: ['Ten route files, top 3', 'Mười tệp route, top 3'] },
    { goi: goi('sizeBuckets', [R('a', 199), R('b', 200), R('c', 500), R('d', 1000), R('e', 1001)], 2), moTa: ['Every edge', 'Mọi biên'] },
    { goi: goi('sizeBuckets', [R('z.ts', 700), R('a.ts', 700), R('m.ts', 10)], 5), an: true },
    { goi: goi('sizeBuckets', [], 3), an: true },
  ],
});

function fileKind(source) {
  // Bỏ chú thích và chuỗi trước — "if" trong một câu chữ không phải là nhánh.
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/g, '""');
  const lines = source.split('\n').filter((l) => l.trim()).length;
  const branches = (code.match(/\b(if|else|switch|for|while)\b|=>/g) || []).length;
  const per100 = lines ? Number(((100 * branches) / lines).toFixed(1)) : 0;
  return { lines, branches, per100, kind: per100 < 5 ? 'flat data' : 'logic' };
}
const SEED = `// roadmap seed — entry after entry
export const ROADMAP = [
  { slug: 'nodejs', title: 'Node.js', steps: ['if you are new, start here', 'for loops'] },
  { slug: 'react', title: 'React', steps: ['JSX', 'state => UI'] },
  { slug: 'postgres', title: 'PostgreSQL', steps: ['SELECT', 'JOIN'] },
  { slug: 'docker', title: 'Docker', steps: ['images', 'layers'] },
  { slug: 'redis', title: 'Redis', steps: ['cache', 'pub/sub'] },
  { slug: 'testing', title: 'Testing', steps: ['unit', 'integration'] },
];`;
const SOCIAL = `export async function feed(user, opts) {
  if (!user) throw new AppError('UNAUTHENTICATED', 401);
  const posts = await repo.posts(opts);
  for (const p of posts) {
    if (p.hidden && p.authorId !== user.id) continue;
    else if (p.blocked) p.body = '';
    switch (p.kind) { case 'video': p.thumb = thumb(p); break; default: break; }
  }
  return posts.filter((p) => !p.deleted).map((p) => ({ ...p, liked: likes.has(p.id) }));
}`;
const E3 = await jsBai({
  ten: 'fileKind(source): count branches, not lines', kho: 'MEDIUM', phut: 16,
  en: '<p>Measure complexity the way the lesson did. Write <code>fileKind(source)</code>: first remove comments (<code>/* … */</code> and <code>// …</code>) and replace every string literal (single, double and template quotes, with escapes) by <code>""</code>, so a word inside text is not counted. Then count <b>branches</b>: the keywords <code>if</code>, <code>else</code>, <code>switch</code>, <code>for</code>, <code>while</code> (as whole words) and the arrow <code>=&gt;</code>. <code>lines</code> = non-blank lines of the original source; <code>per100</code> = branches per 100 lines, 1 decimal; <code>kind</code> = <code>"flat data"</code> when <code>per100 &lt; 5</code>, else <code>"logic"</code>. Return <code>{ lines, branches, per100, kind }</code>.</p>',
  vi: '<p>Đo độ phức tạp như bài đã làm. Viết <code>fileKind(source)</code>: trước hết bỏ chú thích (<code>/* … */</code> và <code>// …</code>) và thay mọi chuỗi (nháy đơn, nháy kép và template, có escape) bằng <code>""</code>, để một từ nằm trong chữ không bị đếm. Rồi đếm <b>nhánh</b>: các từ khoá <code>if</code>, <code>else</code>, <code>switch</code>, <code>for</code>, <code>while</code> (nguyên từ) và mũi tên <code>=&gt;</code>. <code>lines</code> = số dòng không trống của mã gốc; <code>per100</code> = số nhánh trên 100 dòng, 1 chữ số; <code>kind</code> = <code>"flat data"</code> khi <code>per100 &lt; 5</code>, không thì <code>"logic"</code>. Trả về <code>{ lines, branches, per100, kind }</code>.</p>',
  goiY: [['Strip block comments, then line comments, then strings — three replace calls.', 'Bỏ chú thích khối, rồi chú thích dòng, rồi chuỗi — ba lần replace.'], ['/\\b(if|else|switch|for|while)\\b|=>/g counts both kinds in one match.', '/\\b(if|else|switch|for|while)\\b|=>/g đếm cả hai loại trong một lần match.']],
  loi: [['Counting words inside strings: the seed’s "if you are new" and "for loops" are text, not branches.', 'Đếm từ trong chuỗi: "if you are new" và "for loops" của seed là chữ, không phải nhánh.'], ['Judging by length: the 3,646-line seed has 42 branches; the 2,503-line service has 246.', 'Đánh giá theo độ dài: seed 3.646 dòng có 42 nhánh; service 2.503 dòng có 246.']],
  gt: ['A flat file is read by searching, and search works the same in one file or twelve — splitting the seed would make it harder to read. A tangled file is where every function can call every other, and understanding one may mean understanding six: that is the one worth splitting, along a real seam.', 'Tệp phẳng được đọc bằng cách tìm kiếm, và tìm kiếm chạy như nhau trên một tệp hay mười hai — tách seed ra chỉ khó đọc hơn. Tệp rối là nơi mọi hàm gọi được mọi hàm khác, và hiểu một hàm có thể phải hiểu sáu: đó mới là tệp đáng tách, theo một đường nối thật.'],
  kn: ['complexity', 'regex', 'code organisation'],
  tns: [tn('branch', 'nhánh', 'a decision point: if, loop, callback'), tn('flat data', 'dữ liệu phẳng')],
  dau: `/** flat data or logic? */
function fileKind(source) {
  // Write your solution here
  const lines = source.split('\\n').filter((l) => l.trim()).length;
  const branches = (source.match(/if|else|switch|for|while|=>/g) || []).length;
  const per100 = Number((100 * branches / lines).toFixed(1));
  return { lines, branches, per100, kind: lines > 500 ? 'logic' : 'flat data' };
}
`,
  giai: '// Reference solution\n' + nguon(fileKind),
  cases: [
    { goi: goi('fileKind', SEED), moTa: ['A seed file (words like “if” inside strings)', 'Một tệp seed (từ “if” nằm trong chuỗi)'] },
    { goi: goi('fileKind', SOCIAL), moTa: ['A slice of a social service', 'Một lát của social service'] },
    { goi: goi('fileKind', '/* if else for */\nconst a = "while"; // if\nconst b = `for ${"x"} if`;\nconst c = 1;'), an: true },
    { goi: goi('fileKind', 'export const T = {\n  hello: "Xin chào",\n  bye: "Tạm biệt",\n  ifNot: "Nếu không",\n};'), an: true },
  ],
});

function reasonsToChange(commits, min) {
  // commits: [{ area, files }]. Một tệp có nhiều "lý do để thay đổi" khi các commit thuộc nhiều mảng khác nhau cùng chạm nó.
  const areas = new Map();
  for (const c of commits) for (const f of c.files) (areas.get(f) || areas.set(f, new Set()).get(f)).add(c.area);
  return [...areas]
    .filter(([, s]) => s.size >= min)
    .map(([file, s]) => ({ file, reasons: [...s].sort() }))
    .sort((a, b) => b.reasons.length - a.reasons.length || (a.file < b.file ? -1 : 1));
}
const COMMITS = [
  { area: 'pricing', files: ['billing.service.ts', 'pricing.ts'] },
  { area: 'invoices', files: ['billing.service.ts', 'invoice.ts'] },
  { area: 'tax', files: ['billing.service.ts'] },
  { area: 'pricing', files: ['billing.service.ts'] },
  { area: 'admin', files: ['admin.routes.ts'] },
  { area: 'admin', files: ['admin.routes.ts'] },
  { area: 'payments', files: ['stripe.adapter.ts'] },
];
const E4 = await jsBai({
  ten: 'reasonsToChange(commits, min): find the file that is three features sharing one house', kho: 'MEDIUM', phut: 12,
  en: '<p>“Single responsibility” is about reasons to change. <code>commits</code> are <code>{ area, files }</code> (the business area of the ticket, the files it touched). Write <code>reasonsToChange(commits, min)</code>: for each file collect the <b>distinct</b> areas that touched it; return the files with at least <code>min</code> areas as <code>{ file, reasons }</code> (<code>reasons</code> sorted A→Z), most reasons first (ties by file name A→Z).</p>',
  vi: '<p>“Đơn trách nhiệm” nói về lý do để thay đổi. <code>commits</code> là <code>{ area, files }</code> (mảng nghiệp vụ của ticket, các tệp nó chạm). Viết <code>reasonsToChange(commits, min)</code>: với mỗi tệp gom các mảng <b>khác nhau</b> đã chạm nó; trả về các tệp có ít nhất <code>min</code> mảng dạng <code>{ file, reasons }</code> (<code>reasons</code> sắp A→Z), nhiều lý do nhất trước (hoà theo tên tệp A→Z).</p>',
  goiY: [['A Map from file to a Set of areas.', 'Một Map từ tệp tới một Set các mảng.'], ['Count distinct areas, not commits: two pricing commits are one reason.', 'Đếm mảng khác nhau, không đếm commit: hai commit pricing là một lý do.']],
  loi: [['Counting commits: admin.routes.ts is edited every week for ONE reason — that is a merge-conflict signal, not a responsibility signal.', 'Đếm commit: admin.routes.ts bị sửa mỗi tuần vì MỘT lý do — đó là tín hiệu xung đột merge, không phải tín hiệu trách nhiệm.'], ['Splitting a long file that only ever changes for one reason (the payment adapter).', 'Tách một tệp dài mà chỉ đổi vì một lý do (adapter thanh toán).']],
  gt: ['billing.service.ts changes whenever pricing, invoices or tax rules change: three reasons to change sharing one house, the first file to split — after checking that each extracted part would not reach back into the others. git log per folder gives this list for real.', 'billing.service.ts đổi mỗi khi giá, hoá đơn hay luật thuế đổi: ba lý do để thay đổi chung một nhà, tệp đầu tiên nên tách — sau khi kiểm rằng mỗi phần tách ra không với ngược vào các phần kia. git log theo thư mục cho danh sách này bằng dữ liệu thật.'],
  kn: ['code organisation', 'Map', 'Set'],
  tns: [tn('single responsibility', 'đơn trách nhiệm')],
  dau: `/** files with many reasons to change */
function reasonsToChange(commits, min) {
  // Write your solution here
  const n = {};
  for (const c of commits) for (const f of c.files) n[f] = (n[f] || 0) + 1;
  return Object.entries(n).filter(([, k]) => k >= min).map(([file, k]) => ({ file, reasons: [String(k)] }));
}
`,
  giai: '// Reference solution\n' + nguon(reasonsToChange),
  cases: [
    { goi: goi('reasonsToChange', COMMITS, 2), moTa: ['billing vs admin vs the payment adapter', 'billing so với admin so với adapter thanh toán'] },
    { goi: goi('reasonsToChange', COMMITS, 1), moTa: ['Every file touched at least once', 'Mọi tệp từng bị chạm'] },
    { goi: goi('reasonsToChange', [{ area: 'b', files: ['x', 'y'] }, { area: 'a', files: ['y', 'x'] }, { area: 'a', files: ['z'] }], 2), an: true },
    { goi: goi('reasonsToChange', [], 1), an: true },
  ],
});

function isRealBoundary(edges, exportsOf, a, b) {
  // edges: [{ from, to, symbol }] giữa các tệp; a, b: hai danh sách tệp sau khi tách.
  const inA = new Set(a);
  const inB = new Set(b);
  const cross = edges.filter((e) => (inA.has(e.from) && inB.has(e.to)) || (inB.has(e.from) && inA.has(e.to)));
  const ab = cross.some((e) => inA.has(e.from));
  const ba = cross.some((e) => inB.has(e.from));
  const violations = [];
  if (ab && ba) violations.push('CYCLE');                                    // hai chiều ⇒ một khối rối mang hai tên
  for (const e of cross) if (!(exportsOf[e.to] || []).includes(e.symbol)) violations.push(`INTERNAL ${e.from} -> ${e.to}.${e.symbol}`);
  return { real: violations.length === 0, direction: ab && !ba ? 'a->b' : ba && !ab ? 'b->a' : ab ? 'both' : 'none', violations };
}
const E5 = await jsBai({
  ten: 'isRealBoundary(edges, exportsOf, a, b): a boundary, or only a page break?', kho: 'HARD', phut: 18,
  en: '<p>After a split, file group <code>a</code> and group <code>b</code> should be changeable without opening each other. <code>edges</code> are imports <code>{ from, to, symbol }</code> between files; <code>exportsOf</code> maps a file to the symbols it publicly exports. Consider only <b>cross</b> edges (one end in a, the other in b). Return <code>{ real, direction, violations }</code>:</p><ul><li><code>direction</code> — <code>"a->b"</code> or <code>"b->a"</code> if cross edges go one way only, <code>"both"</code>, or <code>"none"</code>;</li><li><code>violations</code> — <code>"CYCLE"</code> first if the direction is both; then, for every cross edge (in input order) whose symbol is not exported by its target, <code>"INTERNAL &lt;from&gt; -&gt; &lt;to&gt;.&lt;symbol&gt;"</code>;</li><li><code>real</code> — true when there are no violations.</li></ul>',
  vi: '<p>Sau khi tách, nhóm tệp <code>a</code> và nhóm <code>b</code> phải đổi được mà không cần mở nhau. <code>edges</code> là các import <code>{ from, to, symbol }</code> giữa các tệp; <code>exportsOf</code> ánh xạ tệp ⇒ các ký hiệu nó export công khai. Chỉ xét cạnh <b>cắt ngang</b> (một đầu ở a, đầu kia ở b). Trả về <code>{ real, direction, violations }</code>:</p><ul><li><code>direction</code> — <code>"a->b"</code> hoặc <code>"b->a"</code> nếu cạnh cắt ngang chỉ đi một chiều, <code>"both"</code>, hoặc <code>"none"</code>;</li><li><code>violations</code> — <code>"CYCLE"</code> trước tiên nếu hướng là both; rồi, với mỗi cạnh cắt ngang (theo thứ tự đầu vào) có ký hiệu không được tệp đích export, <code>"INTERNAL &lt;from&gt; -&gt; &lt;to&gt;.&lt;symbol&gt;"</code>;</li><li><code>real</code> — true khi không có vi phạm.</li></ul>',
  goiY: [['Two Sets for membership; filter the cross edges once.', 'Hai Set để kiểm thành viên; lọc cạnh cắt ngang một lần.'], ['Direction comes from two booleans: some cross edge from a, some from b.', 'Hướng suy ra từ hai boolean: có cạnh cắt ngang từ a, có cạnh từ b.']],
  loi: [['Counting edges inside a group as violations: pricing.ts calling its own helper is fine.', 'Tính cạnh bên trong một nhóm là vi phạm: pricing.ts gọi hàm phụ của chính nó là ổn.'], ['Accepting a one-way dependency on an internal helper: it is still a tangle, only one-directional.', 'Chấp nhận phụ thuộc một chiều vào hàm phụ nội bộ: vẫn là một mớ rối, chỉ là một chiều.']],
  gt: ['If the extracted piece still reaches back into the original, you have not found a boundary, only a page break. pricing.ts exporting price(items) and invoice.ts calling only that is a boundary: one direction, through the published surface.', 'Nếu phần tách ra vẫn với ngược vào bản gốc, bạn chưa tìm được ranh giới, chỉ có một chỗ ngắt trang. pricing.ts export price(items) và invoice.ts chỉ gọi hàm đó là một ranh giới: một chiều, qua bề mặt công khai.'],
  kn: ['architecture', 'coupling', 'Set'],
  tns: [tn('boundary', 'ranh giới'), tn('page break', 'ngắt trang', 'files split without a real seam'), tn('public surface', 'bề mặt công khai')],
  dau: `/** is the split a real boundary? */
function isRealBoundary(edges, exportsOf, a, b) {
  // Write your solution here
  const cross = edges.filter((e) => a.includes(e.from) && b.includes(e.to));
  return { real: true, direction: cross.length ? 'a->b' : 'none', violations: [] };
}
`,
  giai: '// Reference solution\n' + nguon(isRealBoundary),
  cases: [
    { goi: goi('isRealBoundary', [{ from: 'invoice.ts', to: 'pricing.ts', symbol: 'price' }, { from: 'pricing.ts', to: 'rates.ts', symbol: 'vat' }], { 'pricing.ts': ['price'], 'rates.ts': ['vat'] }, ['invoice.ts'], ['pricing.ts', 'rates.ts']), moTa: ['invoice → pricing.price only', 'invoice → chỉ pricing.price'] },
    { goi: goi('isRealBoundary', [{ from: 'invoice.ts', to: 'pricing.ts', symbol: 'roundVnd' }, { from: 'pricing.ts', to: 'invoice.ts', symbol: 'lineItems' }], { 'pricing.ts': ['price'], 'invoice.ts': ['createInvoice'] }, ['invoice.ts'], ['pricing.ts']), moTa: ['The page break of the lesson', 'Chỗ ngắt trang của bài'] },
    { goi: goi('isRealBoundary', [{ from: 'b1', to: 'a1', symbol: 'x' }, { from: 'b2', to: 'a2', symbol: 'secret' }], { a1: ['x'], a2: ['y'] }, ['a1', 'a2'], ['b1', 'b2']), an: true },
    { goi: goi('isRealBoundary', [{ from: 'a1', to: 'a2', symbol: 'z' }], {}, ['a1', 'a2'], ['b1']), an: true },
  ],
});

export default modul('nodejs-18-2-to-chuc-ma-nguon', '18.2 Organising by feature, and what makes a file hard', [E1, E2, E3, E4, E5]);
