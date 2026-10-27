/**
 * SWT301 · DEEP LAB CHƯƠNG 3 — tự viết bộ phân tích tĩnh mini: bất thường luồng dữ liệu, V(G) có nhiều thành phần,
 * nút không tới được, luật lint "SQL nối chuỗi". Hiểu công cụ bằng cách xây nó.
 */
import { doiDau, KHOA, NOP_BAI, tn } from './_chung.mjs';

const t = (moTa, goi, mongDoi, nhom, an) => ({ moTa, goi, mongDoi, nhom, ...(an ? { an: true } : {}) });
const D = (v, op) => ({ v, op });
const js = (x) => JSON.stringify(x);
const KIEM = [
  t({ en: 'A — empty trace has no anomaly', vi: 'A — vết rỗng không có bất thường' }, 'dataFlowAnomalies([])', [], 'f1'),
  t({ en: 'A — use before definition is ur', vi: 'A — dùng trước khi gán là ur' }, `dataFlowAnomalies(${js([D('x', 'u')])})`, ['x:ur'], 'f1'),
  t({ en: 'A — two definitions without a use is dd', vi: 'A — gán hai lần không dùng là dd' }, `dataFlowAnomalies(${js([D('x', 'd'), D('x', 'd'), D('x', 'u')])})`, ['x:dd'], 'f1'),
  t({ en: 'A — a definition never used is du', vi: 'A — gán không bao giờ dùng là du' }, `dataFlowAnomalies(${js([D('x', 'd')])})`, ['x:du'], 'f1'),
  t({ en: 'A — the LAST definition counts for du', vi: 'A — lần gán CUỐI quyết định du' }, `dataFlowAnomalies(${js([D('x', 'd'), D('x', 'u'), D('x', 'd')])})`, ['x:du'], 'f1', true),
  t({ en: 'A — several variables, sorted and unique', vi: 'A — nhiều biến, sắp xếp và không trùng' }, `dataFlowAnomalies(${js([D('s', 'd'), D('s', 'd'), D('t', 'u'), D('t', 'u')])})`, ['s:dd', 's:du', 't:ur'], 'f1', true),
  t({ en: 'A — ur then defined and used', vi: 'A — ur rồi gán và dùng' }, `dataFlowAnomalies(${js([D('x', 'u'), D('x', 'd'), D('x', 'u')])})`, ['x:ur'], 'f1', true),
  t({ en: 'B — straight-line code: V(G) = 1', vi: 'B — mã tuần tự: V(G) = 1' }, 'cyclomatic([1, 2, 3], [[1, 2], [2, 3]])', 1, 'f2'),
  t({ en: 'B — one IF-ELSE: V(G) = 2', vi: 'B — một IF-ELSE: V(G) = 2' }, 'cyclomatic([1, 2, 3, 4], [[1, 2], [1, 3], [2, 4], [3, 4]])', 2, 'f2'),
  t({ en: 'B — the countPass graph: V(G) = 4', vi: 'B — đồ thị countPass: V(G) = 4' }, 'cyclomatic([1, 2, 3, 4, 5, 6, 7, 8, 9], [[1, 2], [2, 3], [2, 8], [3, 4], [3, 5], [4, 9], [5, 6], [5, 7], [6, 7], [7, 2], [8, 9]])', 4, 'f2'),
  t({ en: 'B — two routines in one graph: E − N + 2P', vi: 'B — hai routine trong một đồ thị: E − N + 2P' }, 'cyclomatic([1, 2, 3, 4, 5, 6], [[1, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 6]])', 4, 'f2', true),
  t({ en: 'B — a node without edges is its own component', vi: 'B — node không có cạnh là một thành phần riêng' }, 'cyclomatic([1, 2, 3], [[1, 2]])', 2, 'f2', true),
  t({ en: 'C — everything reachable', vi: 'C — mọi node tới được' }, 'unreachable([1, 2, 3], [[1, 2], [2, 3]], 1)', [], 'f3'),
  t({ en: 'C — an isolated node', vi: 'C — node bị cô lập' }, 'unreachable([1, 2, 3], [[1, 2]], 1)', [3], 'f3'),
  t({ en: 'C — the statement after while (true)', vi: 'C — lệnh sau while (true)' }, 'unreachable([1, 2, 3, 4, 5, 6], [[1, 2], [2, 3], [3, 4], [3, 2], [2, 5]], 1)', [6], 'f3'),
  t({ en: 'C — edges point one way only', vi: 'C — cạnh có hướng' }, 'unreachable([1, 2, 3, 4], [[2, 1], [1, 3], [4, 3]], 1)', [2, 4], 'f3', true),
  t({ en: 'C — an unreachable cycle', vi: 'C — một chu trình không tới được' }, 'unreachable([1, 2, 3, 4, 5], [[1, 2], [3, 4], [4, 5], [5, 3]], 1)', [3, 4, 5], 'f3', true),
  t({ en: 'D — the injection in BookingDao (line 3)', vi: 'D — lỗi injection trong BookingDao (dòng 3)' }, 'sqlConcatLines("Connection c = open();\\nStatement st = c.createStatement();\\nResultSet rs = st.executeQuery(\\"SELECT * FROM bookings WHERE email = \'\\" + email + \\"\'\\");\\nreturn rs;")', [3], 'f4'),
  t({ en: 'D — a prepared statement is fine', vi: 'D — prepared statement thì ổn' }, 'sqlConcatLines("PreparedStatement ps = c.prepareStatement(\\"SELECT code FROM bookings WHERE email = ?\\");\\nps.setString(1, email);")', [], 'f4'),
  t({ en: 'D — an UPDATE built with +', vi: 'D — câu UPDATE ghép bằng +' }, 'sqlConcatLines("int n = 0;\\nString q = \\"UPDATE labs SET status = \'\\" + s + \\"\' WHERE code = \'\\" + code + \\"\'\\";")', [2], 'f4'),
  t({ en: 'D — words like “selected” are not SQL', vi: 'D — chữ như “selected” không phải SQL' }, 'sqlConcatLines("log.info(\\"selected \\" + n + \\" rows\\");")', [], 'f4', true),
  t({ en: 'D — keywords in lower case, several lines', vi: 'D — từ khoá chữ thường, nhiều dòng' }, 'sqlConcatLines("q1 = \\"delete from users where id = \\" + id;\\nok();\\nq2 = \\"insert into logs values(\\" + v + \\")\\";")', [1, 3], 'f4', true),
];

const DAU = `// ─── A. Data-flow anomalies ─────────────────────────────────────────────────
// trace: the events of ONE straight-line execution, in order: { v: 'x', op: 'd' | 'u' }
// Return the anomalies as sorted, unique strings 'variable:kind' with kind ur | dd | du.
function dataFlowAnomalies(trace) {
  return [];
}

// ─── B. Cyclomatic complexity ───────────────────────────────────────────────
// nodes: ids · edges: [from, to] · V(G) = E − N + 2P (P = connected components, edges taken as undirected)
function cyclomatic(nodes, edges) {
  return 0;
}

// ─── C. Unreachable nodes ───────────────────────────────────────────────────
// Directed edges. Return the sorted ids that cannot be reached from entry.
function unreachable(nodes, edges, entry) {
  return [];
}

// ─── D. Lint rule: SQL built by string concatenation ────────────────────────
// Return the 1-based line numbers where a string literal containing SELECT, INSERT, UPDATE or DELETE
// (as a whole word, any case) is joined with + on the same line.
function sqlConcatLines(source) {
  return [];
}
`;
const GIAI = `// ─── A. Data-flow anomalies ─────────────────────────────────────────────────
// State per variable: undefined (never defined) → 'defd' (defined, not used since) → 'used'.
function dataFlowAnomalies(trace) {
  const state = {};
  const found = new Set();
  for (const { v, op } of trace) {
    if (op === 'u') {
      if (!state[v]) found.add(v + ':ur');      // read before any definition
      state[v] = 'used';
    } else if (op === 'd') {
      if (state[v] === 'defd') found.add(v + ':dd'); // redefined without a use in between
      state[v] = 'defd';
    }
  }
  for (const v of Object.keys(state)) if (state[v] === 'defd') found.add(v + ':du'); // last value never used
  return [...found].sort();
}

// ─── B. Cyclomatic complexity ───────────────────────────────────────────────
function cyclomatic(nodes, edges) {
  const parent = new Map(nodes.map((n) => [n, n]));
  const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  for (const [a, b] of edges) parent.set(find(a), find(b));    // union-find, undirected
  const components = new Set(nodes.map(find)).size;
  return edges.length - nodes.length + 2 * components;
}

// ─── C. Unreachable nodes ───────────────────────────────────────────────────
function unreachable(nodes, edges, entry) {
  const next = new Map(nodes.map((n) => [n, []]));
  for (const [a, b] of edges) next.get(a).push(b);
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) for (const m of next.get(queue.shift()) || []) if (!seen.has(m)) { seen.add(m); queue.push(m); }
  return nodes.filter((n) => !seen.has(n)).sort((a, b) => a - b);
}

// ─── D. Lint rule: SQL built by string concatenation ────────────────────────
function sqlConcatLines(source) {
  const sqlLiteral = /"[^"]*\\b(select|insert|update|delete)\\b[^"]*"/i;
  return source.split('\\n')
    .map((line, i) => (sqlLiteral.test(line) && /"\\s*\\+|\\+\\s*"/.test(line) ? i + 1 : 0))
    .filter(Boolean);
}
`;

const BAN_IN = {
  tieuDe: 'Deep Lab 3 — Build Your Own Static Analyzer',
  phu: { en: 'Beyond the syllabus · data-flow anomalies · V(G) with components · reachability · a security lint rule · 10 marks', vi: 'Vượt syllabus · bất thường luồng dữ liệu · V(G) nhiều thành phần · khả năng tới được · một luật lint bảo mật · 10 điểm' },
  moTa: {
    en: '<p>SonarLint, PMD and javac look like magic until you write a tiny one yourself. In this deep lab you implement four analyses in plain JavaScript — the same ideas, a fraction of the size. Each function is graded by visible and hidden test cases, like a real code challenge.</p>',
    vi: '<p>SonarLint, PMD hay javac trông như phép màu cho tới khi bạn tự viết một bản nhỏ. Trong deep lab này bạn cài bốn phép phân tích bằng JavaScript thuần — cùng ý tưởng, nhỏ hơn nhiều. Mỗi hàm được chấm bằng các ca kiểm hiện và ẩn, như một bài thi lập trình thật.</p>',
  },
  chucNangChinh: [
    { en: 'A. Data-flow anomalies (ur, dd, du) from an execution trace.', vi: 'A. Bất thường luồng dữ liệu (ur, dd, du) từ vết thực thi.' },
    { en: 'B. Cyclomatic complexity E − N + 2P for graphs with several routines.', vi: 'B. Độ phức tạp E − N + 2P cho đồ thị có nhiều routine.' },
    { en: 'C. Unreachable code = nodes not reachable from the entry.', vi: 'C. Mã không tới được = node không tới được từ điểm vào.' },
    { en: 'D. A security lint rule: SQL built by concatenating strings.', vi: 'D. Một luật lint bảo mật: SQL ghép bằng nối chuỗi.' },
  ],
  yeuCauChung: [{ en: 'Pure functions: no global state, inputs never modified. Return exactly the formats described.', vi: 'Hàm thuần: không trạng thái toàn cục, không sửa input. Trả đúng định dạng mô tả.' }],
  cayThuMuc: `answers/
└── analyzer.js   ← dataFlowAnomalies(trace) · cyclomatic(nodes, edges) · unreachable(nodes, edges, entry) · sqlConcatLines(source)`,
  moHinh: {
    ten: 'Inputs',
    truong: [
      ['trace', '{ v: string, op: "d" | "u" }[]', { en: 'events of one straight-line execution', vi: 'các sự kiện của một lần chạy tuần tự' }],
      ['nodes · edges · entry', 'number[] · [number, number][] · number', { en: 'a control-flow graph', vi: 'một đồ thị luồng điều khiển' }],
      ['source', 'string', { en: 'Java source, lines separated by \\n', vi: 'mã Java, các dòng cách nhau bởi \\n' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. dataFlowAnomalies', vi: 'A. dataFlowAnomalies' }, diem: 3, yeuCau: [{ en: 'ur: a use while the variable was never defined · dd: a definition while the previous one was not used · du: a variable whose last definition is never used. Unique, sorted: <code>["s:dd", "s:du", "t:ur"]</code>.', vi: 'ur: dùng khi biến chưa từng được gán · dd: gán khi giá trị trước chưa được dùng · du: lần gán cuối không bao giờ được dùng. Không trùng, đã sắp xếp: <code>["s:dd", "s:du", "t:ur"]</code>.' }], hook: ['data-flow analysis'] },
    { ten: { en: 'B. cyclomatic', vi: 'B. cyclomatic' }, diem: 2.5, yeuCau: [{ en: 'V(G) = E − N + 2P where P is the number of connected components (treat edges as undirected; a node without edges is a component).', vi: 'V(G) = E − N + 2P với P là số thành phần liên thông (coi cạnh vô hướng; node không có cạnh là một thành phần).' }], hook: ['cyclomatic complexity'] },
    { ten: { en: 'C. unreachable', vi: 'C. unreachable' }, diem: 2, yeuCau: [{ en: 'Breadth-first search from the entry along DIRECTED edges; return the other nodes, sorted ascending.', vi: 'Duyệt theo chiều rộng từ điểm vào theo cạnh CÓ HƯỚNG; trả các node còn lại, sắp tăng dần.' }], hook: ['control-flow analysis'] },
    { ten: { en: 'D. sqlConcatLines', vi: 'D. sqlConcatLines' }, diem: 2.5, yeuCau: [{ en: 'A line is reported when it contains a double-quoted literal with a whole-word SQL keyword (SELECT, INSERT, UPDATE, DELETE — any case) AND a <code>+</code> next to a quote. “selected” is not a keyword.', vi: 'Báo một dòng khi nó có chuỗi nháy kép chứa từ khoá SQL nguyên từ (SELECT, INSERT, UPDATE, DELETE — mọi kiểu chữ) VÀ có <code>+</code> sát dấu nháy. “selected” không phải từ khoá.' }], hook: ['security', 'lint rule'] },
  ],
  idBatBuoc: [['dataFlowAnomalies · cyclomatic · unreachable · sqlConcatLines', 'answers/analyzer.js']],
  truDiem: [{ en: 'Counting a variable that was never defined but is only used as “du”.', vi: 'Coi biến chưa từng được gán mà chỉ được dùng là “du”.' }, { en: 'Forgetting P > 1 in B — the formula is E − N + 2P.', vi: 'Quên P > 1 ở phần B — công thức là E − N + 2P.' }],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-3-deep-build-static-analyzer',
  ten: 'Deep Lab 3 — Build Your Own Static Analyzer',
  moTaModule: 'Deep Lab chương 3 (vượt syllabus): tự cài bộ phân tích tĩnh mini — bất thường ur/dd/du, V(G) = E − N + 2P, tìm node không tới được, luật lint SQL nối chuỗi — chấm bằng ca kiểm hiện + ẩn.',
  khoa: KHOA,
  baiHoc: 'swt301-static-analysis',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 3 — Build Your Own Static Analyzer',
    doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "dataFlowAnomalies([{ v: 's', op: 'd' }, { v: 's', op: 'd' }, { v: 't', op: 'u' }])", output: '["s:dd", "s:du", "t:ur"]', explanation: 's is defined twice and never used; t is used but never defined.|||s gán hai lần và không dùng; t dùng mà chưa gán.' }],
    khaiNiem: ['static analysis', 'data flow analysis', 'control flow analysis', 'cyclomatic complexity', 'lint rule'],
    tienQuyet: ['SWT301 3.4', 'JavaScript arrays/Set/Map'],
    the: ['swt301', 'deep-lab', 'static-analysis'],
    banIn: BAN_IN,
    thuatNgu: [...tn('cyclomatic'), { en: 'trace', vi: 'vết thực thi — chuỗi sự kiện theo thứ tự' }, { en: 'connected component', vi: 'thành phần liên thông' }, { en: 'breadth-first search', vi: 'duyệt theo chiều rộng (BFS)' }, { en: 'lint rule', vi: 'luật kiểm tĩnh của công cụ lint' }],
    goiY: [
      'A: giữ trạng thái mỗi biến (chưa gán / đã gán chưa dùng / đã dùng); xét từng sự kiện; cuối vết, biến nào còn "đã gán chưa dùng" là du.',
      'B: dùng union-find hoặc DFS vô hướng để đếm thành phần.',
      'C: BFS từ entry theo cạnh có hướng; node chưa thăm là không tới được.',
      'D: regex /"[^"]*\\b(select|insert|update|delete)\\b[^"]*"/i cho chuỗi SQL và /"\\s*\\+|\\+\\s*"/ cho phép nối.',
    ],
    loiHayGap: ['A: báo ur nhiều lần cho cùng biến (phải không trùng).', 'C: coi cạnh là vô hướng — [2,1] không cho đi từ 1 tới 2.', 'D: khớp "selected" vì thiếu \\b.'],
    moTaNgan: 'Deep Lab chương 3: tự viết bộ phân tích tĩnh mini.',
    giaiThich: {
      en: '<p>A: one pass with a three-state machine per variable, then a final pass for du. B: union-find counts components; E − N + 2P. C: BFS. D: a line-based rule combining an SQL-literal regex with a concatenation regex — exactly how simple lint rules work (and why they produce false positives and negatives).</p>',
      vi: '<p>A: một lượt với máy ba trạng thái mỗi biến, rồi một lượt cuối cho du. B: union-find đếm thành phần; E − N + 2P. C: BFS. D: luật theo dòng ghép regex chuỗi SQL với regex phép nối — đúng cách luật lint đơn giản vận hành (và vì sao chúng có cảnh báo nhầm/sót).</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['answers/analyzer.js'], kiem: KIEM },
    khoiDau: { 'answers/analyzer.js': DAU },
    loiGiai: { 'answers/analyzer.js': GIAI },
    thamKhao: 'https://pmd.github.io/',
  }],
});
