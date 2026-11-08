/** Node.js 18.3 — Ghép nối: đồ thị import, hub lành (143×, 39× với 0 import), cặp import vòng (28), ghép nối ẩn qua bảng (prisma.user từ 57 chỗ), gỡ ghép bằng tiêm hàm / sự kiện. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Healthy, painful, circular, hidden', kho: 'EASY', phut: 6,
  en: 'Questions on lesson 18.3 (the website’s import graph, code files only).',
  vi: 'Câu hỏi về bài 18.3 (đồ thị import của website, chỉ tệp mã).',
  cau: [
    q('c1', ['work/permissions is imported by 143 files; pro.service by 39 and it imports no service at all. What kind of coupling is that?', 'work/permissions được 143 tệp import; pro.service được 39 tệp import và nó không import service nào. Đó là kiểu ghép nối gì?'],
      ['Healthy: many places depend on a stable concept that depends on nothing above it', 'Painful: 143 importers means every change breaks 143 files', 'Circular: a hub always ends up importing its importers', 'Hidden: the import graph cannot see who uses permissions'],
      ['Like a wall socket with twenty devices plugged into it: fine, because the socket does not change. Painful is many places depending on something that keeps changing.', 'Như một ổ điện tường cắm hai mươi thiết bị: ổn, vì ổ không thay đổi. Đau là khi nhiều nơi phụ thuộc vào thứ liên tục thay đổi.']),
    q('c2', ['Feature A adds users.passwordResetToken. Feature B’s admin export selects every column of users and now ships the token in a CSV. Neither file imports the other. Which coupling bit?', 'Tính năng A thêm users.passwordResetToken. Bản xuất admin của tính năng B chọn mọi cột của users và giờ đưa token vào CSV. Không tệp nào import tệp kia. Ghép nối nào đã cắn?'],
      ['Hidden coupling through a shared table — invisible to any dependency scanner', 'Circular coupling, because A and B both depend on Prisma', 'Healthy coupling, because the users table is a stable concept', 'No coupling: the bug is only a missing select clause'],
      ['Two “independent” modules sharing a table are one module with two names. prisma.user is queried from 57 places here — and 57 is a floor (each folder counts once, raw SQL is not counted).', 'Hai module “độc lập” dùng chung một bảng là một module mang hai tên. prisma.user bị truy vấn từ 57 chỗ ở đây — và 57 là mức sàn (mỗi thư mục tính một lần, SQL thô không tính).']),
    q('c3', ['Which boundary is enforced by the compiler, without becoming a separate process?', 'Ranh giới nào được trình biên dịch cưỡng chế, mà không thành một tiến trình riêng?'],
      ['A separate package: importing its inside is a compile error, but you now manage versions', 'A folder named domain/: nothing can import through it', 'A module with explicit exports: people cannot import its insides', 'A comment at the top of the file saying “internal”'],
      ['folder < module < package < service < database. A folder anything can import from is not a boundary, it is a wish. Pick the level for what you need enforced.', 'thư mục < module < package < service < CSDL. Một thư mục mà gì cũng import được thì không phải ranh giới, chỉ là mong ước. Chọn mức theo thứ bạn cần cưỡng chế.']),
    qn('c4', ['Ways to reduce coupling WITHOUT splitting anything? (choose all that apply)', 'Những cách giảm ghép nối mà KHÔNG tách gì ra? (chọn mọi câu đúng)'],
      ['Depend on a shape: share(note, to, notify) receives a notify function', 'Publish an event (“note shared”) when the caller needs no answer', 'Push a shared concept (“is this user Pro?”) down into a layer below both features', 'Copy the email module into the notes folder so notes owns its own copy'],
      [0, 1, 2],
      ['And dare to delete unused code: an unused feature still constrains every schema change and every refactor. Record why it was removed, or it will come back.', 'Và dám xoá mã không dùng: một tính năng không ai dùng vẫn ràng buộc mọi thay đổi lược đồ và mọi lần tái cấu trúc. Ghi lại vì sao xoá, không thì nó sẽ quay lại.']),
  ],
  goiY: [['Does the hub depend on anything above it?', 'Hub có phụ thuộc vào thứ gì phía trên nó không?'], ['Where can two modules meet without importing each other?', 'Hai module có thể gặp nhau ở đâu mà không import nhau?']],
  loi: [['Calling every heavily imported module a problem.', 'Gọi mọi module được import nhiều là vấn đề.'], ['Trusting a dependency scanner to find table coupling.', 'Tin trình quét phụ thuộc tìm được ghép nối qua bảng.']],
  tns: [tn('coupling', 'ghép nối'), tn('fan-in / fan-out', 'số nơi phụ thuộc vào / số thứ nó phụ thuộc'), tn('hub', 'hub', 'a module many others import')],
  kn: ['architecture', 'coupling'],
});

function hubs(edges, k) {
  // edges: [from, to] = "from import to". fan-in = số tệp import nó; fan-out = số thứ nó import.
  const fanIn = new Map();
  const fanOut = new Map();
  const touch = (m) => { if (!fanIn.has(m)) { fanIn.set(m, new Set()); fanOut.set(m, new Set()); } };
  for (const [a, b] of edges) { touch(a); touch(b); if (a !== b) { fanIn.get(b).add(a); fanOut.get(a).add(b); } }
  return [...fanIn.keys()]
    .map((m) => ({ module: m, fanIn: fanIn.get(m).size, fanOut: fanOut.get(m).size }))
    .sort((x, y) => y.fanIn - x.fanIn || (x.module < y.module ? -1 : 1))
    .slice(0, k)
    .map((h) => ({ ...h, healthy: h.fanOut === 0 }));
}
const G = [
  ['routes/notes', 'services/notes'], ['routes/notes', 'services/pro'], ['routes/feed', 'services/feed'], ['routes/feed', 'services/pro'],
  ['services/feed', 'services/notes'], ['services/feed', 'services/pro'], ['services/notes', 'services/pro'], ['services/notes', 'services/email'],
  ['services/email', 'services/notes'], ['jobs/digest', 'services/email'], ['jobs/digest', 'services/pro'], ['routes/notes', 'services/notes'],
];
const E2 = await jsBai({
  ten: 'hubs(edges, k): the most-imported modules, and whether they depend back', kho: 'MEDIUM', phut: 12,
  en: '<p><code>edges</code> are <code>[from, to]</code> pairs meaning “<code>from</code> imports <code>to</code>” (duplicates and self-imports may appear: count distinct modules, ignore self-imports). Write <code>hubs(edges, k)</code>: for every module that appears, compute <code>fanIn</code> (distinct modules importing it) and <code>fanOut</code> (distinct modules it imports); return the <code>k</code> modules with the highest fan-in (ties by name A→Z) as <code>{ module, fanIn, fanOut, healthy }</code>, where <code>healthy</code> means <code>fanOut === 0</code>.</p>',
  vi: '<p><code>edges</code> là các cặp <code>[from, to]</code> nghĩa là “<code>from</code> import <code>to</code>” (có thể trùng và có tự-import: đếm module khác nhau, bỏ tự-import). Viết <code>hubs(edges, k)</code>: với mỗi module xuất hiện, tính <code>fanIn</code> (số module khác nhau import nó) và <code>fanOut</code> (số module khác nhau nó import); trả về <code>k</code> module có fan-in cao nhất (hoà theo tên A→Z) dạng <code>{ module, fanIn, fanOut, healthy }</code>, với <code>healthy</code> nghĩa là <code>fanOut === 0</code>.</p>',
  goiY: [['Two Maps of Sets, keyed by module.', 'Hai Map chứa Set, khoá theo module.'], ['Register both ends of every edge, so a module with no importers still appears with fanIn 0.', 'Ghi nhận cả hai đầu của mọi cạnh, để module không ai import vẫn xuất hiện với fanIn 0.']],
  loi: [['Counting duplicate edges: two imports from the same file are one dependency.', 'Đếm cạnh trùng: hai lần import từ cùng một tệp là một phụ thuộc.'], ['Ranking by size: social.service is 2,503 lines with only 4 importers — large but not a hub.', 'Xếp theo kích thước: social.service dài 2.503 dòng mà chỉ 4 nơi import — lớn nhưng không phải hub.']],
  gt: ['A healthy hub is a stable concept that depends on nothing above it — pro.service: 39 importers, 0 imports. The combination that makes change slow is a big, changing module with many importers; fan-out alone is not bad (a command registry wiring 54 commands touches many places).', 'Hub lành là một khái niệm ổn định không phụ thuộc gì phía trên nó — pro.service: 39 nơi import, 0 import. Thứ làm thay đổi chậm là một module lớn, hay đổi, nhiều nơi import; fan-out riêng nó không xấu (registry nối 54 lệnh tất nhiên chạm nhiều chỗ).'],
  kn: ['coupling', 'graphs', 'Map'],
  tns: [tn('fan-in', 'fan-in'), tn('fan-out', 'fan-out')],
  dau: `/** most-imported modules */
function hubs(edges, k) {
  // Write your solution here
  const n = {};
  for (const [a, b] of edges) n[b] = (n[b] || 0) + 1;
  return Object.entries(n).sort((x, y) => y[1] - x[1]).slice(0, k).map(([module, fanIn]) => ({ module, fanIn, fanOut: 0, healthy: true }));
}
`,
  giai: '// Reference solution\n' + nguon(hubs),
  cases: [
    { goi: goi('hubs', G, 3), moTa: ['A slice of the Notes backend', 'Một lát của backend Notes'] },
    { goi: goi('hubs', [['a', 'b']], 5), moTa: ['Both ends are modules', 'Cả hai đầu đều là module'] },
    { goi: goi('hubs', [...G, ['services/pro', 'services/pro'], ['x', 'services/email'], ['y', 'services/email']], 2), an: true },
    { goi: goi('hubs', [], 3), an: true },
  ],
});

function mutualPairs(edges) {
  const set = new Set(edges.map(([a, b]) => `${a}\u0000${b}`));
  const out = new Set();
  for (const [a, b] of edges) {
    if (a !== b && set.has(`${b}\u0000${a}`)) out.add(a < b ? `${a} <-> ${b}` : `${b} <-> ${a}`);   // mỗi cặp một lần, tên nhỏ trước
  }
  return [...out].sort();
}
const E3 = await jsBai({
  ten: 'mutualPairs(edges): the 28 pairs that are one unit living in two files', kho: 'MEDIUM', phut: 10,
  en: '<p>A pair of modules that import each other can be neither tested nor understood alone. Write <code>mutualPairs(edges)</code> (<code>[from, to]</code> pairs, duplicates possible): return every pair where <code>a</code> imports <code>b</code> and <code>b</code> imports <code>a</code>, once, written <code>"&lt;smaller&gt; &lt;-&gt; &lt;larger&gt;"</code> (by string comparison), the list sorted A→Z. Self-imports are not pairs.</p>',
  vi: '<p>Một cặp module import lẫn nhau thì không kiểm thử riêng được và cũng không hiểu riêng được. Viết <code>mutualPairs(edges)</code> (cặp <code>[from, to]</code>, có thể trùng): trả về mọi cặp mà <code>a</code> import <code>b</code> và <code>b</code> import <code>a</code>, mỗi cặp một lần, viết <code>"&lt;nhỏ hơn&gt; &lt;-&gt; &lt;lớn hơn&gt;"</code> (so chuỗi), danh sách sắp A→Z. Tự-import không phải cặp.</p>',
  goiY: [['Put every edge into a Set as a string key; then for each edge look up the reverse key.', 'Cho mọi cạnh vào một Set dưới dạng khoá chuỗi; rồi với mỗi cạnh tra khoá ngược.'], ['Normalise the pair (smaller name first) so it is added once.', 'Chuẩn hoá cặp (tên nhỏ trước) để chỉ thêm một lần.']],
  loi: [['Reporting each pair twice (a ⇄ b and b ⇄ a).', 'Báo mỗi cặp hai lần (a ⇄ b và b ⇄ a).'], ['Ignoring cycles because “it works”: with ES modules a cycle can leave a value undefined at load time, depending on import order.', 'Bỏ qua vòng vì “nó vẫn chạy”: với ES module, một vòng có thể để một giá trị là undefined lúc nạp, tuỳ thứ tự import.']],
  gt: ['On the website: 28 such pairs among 705 service files, 19 inside work/ and 6 inside agent/ — e.g. agent/turn ⇄ agent/compact, one unit that must be changed and tested together. Break a pair with an injected function or an event, not by moving code.', 'Trên website: 28 cặp như vậy trong 705 tệp service, 19 trong work/ và 6 trong agent/ — vd agent/turn ⇄ agent/compact, một khối phải sửa và kiểm thử cùng nhau. Phá cặp bằng một hàm tiêm vào hoặc một sự kiện, không phải bằng cách dời mã.'],
  kn: ['coupling', 'cycles'],
  tns: [tn('circular import', 'import vòng')],
  dau: `/** pairs that import each other */
function mutualPairs(edges) {
  // Write your solution here
  const out = [];
  for (const [a, b] of edges) if (edges.some(([x, y]) => x === b && y === a)) out.push(a + ' <-> ' + b);
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(mutualPairs),
  cases: [
    { goi: goi('mutualPairs', G), moTa: ['notes ⇄ email', 'notes ⇄ email'] },
    { goi: goi('mutualPairs', [['agent/turn', 'agent/compact'], ['agent/compact', 'agent/turn'], ['work/a', 'work/b']]), moTa: ['agent/turn ⇄ agent/compact', 'agent/turn ⇄ agent/compact'] },
    { goi: goi('mutualPairs', [['z', 'a'], ['a', 'z'], ['a', 'z'], ['m', 'm'], ['b', 'c'], ['c', 'b'], ['c', 'd']]), an: true },
    { goi: goi('mutualPairs', []), an: true },
  ],
});

function findCycles(edges) {
  // Tarjan: các thành phần liên thông mạnh (SCC). SCC có ≥ 2 module = một vòng import (dài bao nhiêu cũng bắt được).
  const adj = new Map();
  for (const [a, b] of edges) { if (!adj.has(a)) adj.set(a, []); if (!adj.has(b)) adj.set(b, []); adj.get(a).push(b); }
  let index = 0;
  const idx = new Map();
  const low = new Map();
  const onStack = new Set();
  const stack = [];
  const out = [];
  function strong(v) {
    idx.set(v, index); low.set(v, index); index++;
    stack.push(v); onStack.add(v);
    for (const w of adj.get(v)) {
      if (!idx.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v), idx.get(w)));
    }
    if (low.get(v) === idx.get(v)) {
      const comp = [];
      let w;
      do { w = stack.pop(); onStack.delete(w); comp.push(w); } while (w !== v);
      if (comp.length > 1) out.push(comp.sort());
    }
  }
  for (const v of [...adj.keys()].sort()) if (!idx.has(v)) strong(v);
  return out.sort((x, y) => y.length - x.length || (x[0] < y[0] ? -1 : 1));
}
const E4 = await jsBai({
  ten: 'findCycles(edges): every import cycle, not just pairs', kho: 'HARD', phut: 25,
  en: '<p>Pairs miss longer loops: <code>a → b → c → a</code>. Find every group of modules that can all reach each other through imports — the <b>strongly connected components</b> with at least 2 modules. Write <code>findCycles(edges)</code> (<code>[from, to]</code> pairs): return the components, each sorted A→Z, ordered by size descending, then by first name A→Z. (Tarjan’s algorithm does it in one depth-first pass; any correct method is fine.)</p>',
  vi: '<p>Đếm cặp bỏ sót các vòng dài hơn: <code>a → b → c → a</code>. Tìm mọi nhóm module mà mọi cái đều với tới nhau qua import — các <b>thành phần liên thông mạnh</b> có ít nhất 2 module. Viết <code>findCycles(edges)</code> (cặp <code>[from, to]</code>): trả về các thành phần, mỗi cái sắp A→Z, xếp theo kích thước giảm dần, rồi theo tên đầu tiên A→Z. (Thuật toán Tarjan làm việc này trong một lượt duyệt sâu; cách nào đúng cũng được.)</p>',
  goiY: [['Simple version: two modules are in the same component when each can reach the other — compute reachability with a DFS from every node.', 'Bản đơn giản: hai module cùng thành phần khi mỗi cái với tới được cái kia — tính khả năng với tới bằng DFS từ mọi nút.'], ['Tarjan: keep index and lowlink per node and a stack; when lowlink === index, pop the stack down to that node — that is one component.', 'Tarjan: giữ index và lowlink cho mỗi nút cùng một ngăn xếp; khi lowlink === index, lấy ra khỏi ngăn xếp tới nút đó — đó là một thành phần.']],
  loi: [['Only checking mutual pairs: work/a → work/b → work/c → work/a has no pair and is still one tangle.', 'Chỉ kiểm cặp lẫn nhau: work/a → work/b → work/c → work/a không có cặp nào mà vẫn là một mớ rối.'], ['Reporting each cycle once per entry point: a component is one set, however you enter it.', 'Báo mỗi vòng một lần cho mỗi điểm vào: một thành phần là một tập, vào từ đâu cũng vậy.']],
  gt: ['A component of several modules is one unit wearing several names: none of them can be changed, tested or extracted alone. That is why cycles are “always worth breaking” — and why the lesson counts them before deciding anything about splitting (18.4).', 'Một thành phần gồm nhiều module là một khối mang nhiều tên: không cái nào đổi, kiểm thử hay tách riêng được. Đó là lý do vòng “luôn đáng phá” — và vì sao bài đếm chúng trước khi quyết định bất cứ điều gì về việc tách (18.4).'],
  kn: ['graphs', 'Tarjan', 'coupling'],
  tns: [tn('strongly connected component', 'thành phần liên thông mạnh'), tn('depth-first search', 'duyệt theo chiều sâu')],
  dau: `/** all import cycles */
function findCycles(edges) {
  // Write your solution here — finds only 2-module cycles
  const out = [];
  for (const [a, b] of edges) if (a < b && edges.some(([x, y]) => x === b && y === a)) out.push([a, b]);
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(findCycles),
  cases: [
    { goi: goi('findCycles', G), moTa: ['notes ⇄ email only', 'Chỉ notes ⇄ email'] },
    { goi: goi('findCycles', [['work/a', 'work/b'], ['work/b', 'work/c'], ['work/c', 'work/a'], ['work/c', 'work/permissions']]), moTa: ['A three-module loop with no mutual pair', 'Vòng ba module không có cặp lẫn nhau'] },
    { goi: goi('findCycles', [['a', 'b'], ['b', 'a'], ['c', 'd'], ['d', 'e'], ['e', 'c'], ['e', 'f'], ['f', 'g'], ['g', 'f'], ['x', 'y']]), an: true },
    { goi: goi('findCycles', [['p', 'q'], ['q', 'r']]), an: true },
    { goi: goi('findCycles', [['m1', 'm2'], ['m2', 'm3'], ['m3', 'm4'], ['m4', 'm1'], ['m2', 'm1']]), an: true },
  ],
});

function hiddenCoupling(tableAccess, edges) {
  // tableAccess: { module: [bảng nó truy vấn trực tiếp] }. Hai module chung bảng mà KHÔNG import nhau = ghép nối ẩn.
  const imports = new Set(edges.flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]));
  const mods = Object.keys(tableAccess).sort();
  const out = [];
  for (let i = 0; i < mods.length; i++) {
    for (let j = i + 1; j < mods.length; j++) {
      const shared = tableAccess[mods[i]].filter((t) => tableAccess[mods[j]].includes(t));
      if (shared.length && !imports.has(`${mods[i]}|${mods[j]}`)) out.push({ pair: `${mods[i]} + ${mods[j]}`, tables: [...new Set(shared)].sort() });
    }
  }
  const touches = {};
  for (const m of mods) for (const t of new Set(tableAccess[m])) touches[t] = (touches[t] || 0) + 1;
  return { pairs: out, mostShared: Object.entries(touches).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0] || null };
}
const TA = { 'services/notes': ['note', 'user'], 'services/stats': ['note'], 'services/admin-export': ['user', 'course'], 'services/auth': ['user', 'session'], 'services/courses': ['course'] };
const E5 = await jsBai({
  ten: 'hiddenCoupling(tableAccess, edges): the coupling the import graph cannot see', kho: 'HARD', phut: 18,
  en: '<p><code>tableAccess</code> maps a module to the tables it queries directly (Prisma or raw SQL); <code>edges</code> are import pairs <code>[from, to]</code>. Write <code>hiddenCoupling(tableAccess, edges)</code> returning <code>{ pairs, mostShared }</code>:</p><ul><li><code>pairs</code> — for every pair of modules (names sorted A→Z, pairs in that order: first by the first name, then by the second) that share at least one table and do <b>not</b> import each other in either direction: <code>{ pair: "&lt;a&gt; + &lt;b&gt;", tables }</code> with the shared tables sorted and distinct;</li><li><code>mostShared</code> — <code>[table, number of modules querying it]</code> for the table queried by the most modules (ties by table name A→Z), or <code>null</code> if there are no tables.</li></ul>',
  vi: '<p><code>tableAccess</code> ánh xạ module ⇒ các bảng nó truy vấn trực tiếp (Prisma hoặc SQL thô); <code>edges</code> là các cặp import <code>[from, to]</code>. Viết <code>hiddenCoupling(tableAccess, edges)</code> trả về <code>{ pairs, mostShared }</code>:</p><ul><li><code>pairs</code> — với mọi cặp module (tên sắp A→Z, các cặp theo thứ tự đó: trước theo tên thứ nhất, rồi tên thứ hai) dùng chung ít nhất một bảng và <b>không</b> import nhau theo chiều nào: <code>{ pair: "&lt;a&gt; + &lt;b&gt;", tables }</code> với các bảng chung đã sắp và không trùng;</li><li><code>mostShared</code> — <code>[bảng, số module truy vấn nó]</code> cho bảng được nhiều module truy vấn nhất (hoà theo tên bảng A→Z), hoặc <code>null</code> nếu không có bảng nào.</li></ul>',
  goiY: [['A Set of “a|b” strings in both directions answers “do they import each other?”.', 'Một Set các chuỗi “a|b” theo cả hai chiều trả lời “chúng có import nhau không?”.'], ['Two nested loops over the sorted module names give the pairs in the required order.', 'Hai vòng lặp lồng nhau trên tên module đã sắp cho các cặp đúng thứ tự yêu cầu.']],
  loi: [['Relying on a dependency scanner: the two modules never import each other; they meet in the database.', 'Dựa vào trình quét phụ thuộc: hai module không bao giờ import nhau; chúng gặp nhau trong CSDL.'], ['Checking the import in one direction only: if stats imports notes, the pair is already visible coupling, whichever side imports.', 'Chỉ kiểm import theo một chiều: nếu stats import notes thì cặp đó đã là ghép nối nhìn thấy được, bên nào import cũng vậy.']],
  gt: ['prisma/schema.prisma has 608 models and 243 migrations behind 126 route-mounting lines: every feature that never imports another is still coupled to it if one adds a column, renames a table, or holds a lock the other waits on. The cure in 18.4 is table owners: only the courses module queries course tables.', 'prisma/schema.prisma có 608 model và 243 migration đứng sau 126 dòng gắn route: mọi tính năng không bao giờ import nhau vẫn ghép nối với nhau nếu một bên thêm cột, đổi tên bảng, hay giữ một khoá mà bên kia phải chờ. Thuốc chữa ở 18.4 là chủ sở hữu bảng: chỉ module courses truy vấn bảng course.'],
  kn: ['coupling', 'databases', 'Set'],
  tns: [tn('hidden coupling', 'ghép nối ẩn'), tn('table owner', 'chủ sở hữu bảng')],
  dau: `/** modules coupled through shared tables */
function hiddenCoupling(tableAccess, edges) {
  // Write your solution here
  const mods = Object.keys(tableAccess);
  const pairs = [];
  for (let i = 0; i < mods.length; i++) for (let j = i + 1; j < mods.length; j++) {
    const shared = tableAccess[mods[i]].filter((t) => tableAccess[mods[j]].includes(t));
    if (shared.length) pairs.push({ pair: mods[i] + ' + ' + mods[j], tables: shared });
  }
  return { pairs, mostShared: null };
}
`,
  giai: '// Reference solution\n' + nguon(hiddenCoupling),
  cases: [
    { goi: goi('hiddenCoupling', TA, [['services/notes', 'services/auth']]), moTa: ['Notes, stats, the admin export and auth', 'Notes, stats, bản xuất admin và auth'] },
    { goi: goi('hiddenCoupling', { a: ['t'], b: ['u'] }, []), moTa: ['Nothing shared', 'Không dùng chung gì'] },
    { goi: goi('hiddenCoupling', { ...TA, 'services/feed': ['note', 'user', 'note'] }, [['services/stats', 'services/feed'], ['services/admin-export', 'services/courses']]), an: true },
    { goi: goi('hiddenCoupling', {}, []), an: true },
  ],
});

export default modul('nodejs-18-3-ghep-noi-ranh-gioi', '18.3 Coupling: import graphs, cycles and shared tables', [E1, E2, E3, E5, E4]);
