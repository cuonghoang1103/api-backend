/**
 * SWT301 · 2.2 — Test levels (1): component and integration testing (SWT2 slide 36–74, LO-2.2.1).
 */
import { doiDau, KHOA, hai, giai, lc, svg } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const HAI = ['Component testing', 'Integration testing'];
const E1 = tinhDe({
  tieuDe: 'Test levels 1 — Component or integration? (the five attributes)',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Every test level is described by five attributes: objectives, test basis, test objects, typical defects and failures, approaches and responsibilities. Decide which of the two lower levels each fact describes.</p>', vi: '<p>Mỗi cấp test được mô tả bằng năm thuộc tính: mục tiêu, test basis, đối tượng test, lỗi điển hình, cách tiếp cận và trách nhiệm. Xác định mỗi dòng mô tả cấp nào trong hai cấp thấp.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Fact → level', 'Đặc điểm → cấp'),
    cot: [{ ma: 'f', ten: 'Fact' }, { ma: 'l', ten: 'Level', luaChon: HAI }],
    hang: [
      'Test basis: detailed design, code, data model, component specifications',
      'Test basis: sequence diagrams, interface and communication protocol specifications',
      'Typical defect: wrong assumptions about the meaning, units or boundaries of data passed between modules',
      'Typical defect: incorrect logic inside a method, data-flow problems',
      'Test objects: APIs, microservices, databases, infrastructure',
      'Usually done by the developer who wrote the code, often test-first (TDD)',
      'Approaches: big-bang, top-down, bottom-up',
      'Typical failure: a message is lost or arrives in the wrong order (communication failure)',
    ].map((f, i) => ({ ma: `r${i}`, o: { f } })),
    dapAn: { 'r0.l': HAI[0], 'r1.l': HAI[1], 'r2.l': HAI[1], 'r3.l': HAI[0], 'r4.l': HAI[1], 'r5.l': HAI[0], 'r6.l': HAI[1], 'r7.l': HAI[1] },
    giaiThich: giai('Component testing looks inside one isolated unit (design, code, logic, TDD); integration testing looks at the interfaces and interactions (sequence diagrams, protocols, APIs, timing, communication, integration strategies).', 'Component test nhìn bên trong một đơn vị cô lập (thiết kế, mã, logic, TDD); integration test nhìn vào giao diện và tương tác (sequence diagram, giao thức, API, thời điểm, giao tiếp, chiến lược tích hợp).'),
  }],
  goiY: ['Có chữ “interface, protocol, API, communication” ⇒ integration.', 'Bên trong một method/class ⇒ component.'],
  loiHayGap: ['Gán “big-bang” cho component test.', 'Gán CSDL (database) cho component — CSDL là đối tượng của integration; “database model” mới thuộc component.'],
  giaiThich: '<p>C · I · I · C · I · C · I · I.</p>',
  thuatNgu: [{ en: 'component (unit) testing', vi: 'kiểm thử thành phần (đơn vị)' }, { en: 'integration testing', vi: 'kiểm thử tích hợp' }, { en: 'TDD', vi: 'phát triển hướng kiểm thử — viết test trước' }],
  khaiNiem: ['component testing', 'integration testing'],
});

const CAY = svg({
  w: 520, h: 230, tieuDe: 'call tree',
  nut: [
    { id: 'a', x: 260, y: 30, nhan: 'a', hinh: 'tron' },
    { id: 'b', x: 150, y: 100, nhan: 'b', hinh: 'tron' }, { id: 'c', x: 260, y: 100, nhan: 'c', hinh: 'tron' }, { id: 'd', x: 370, y: 100, nhan: 'd', hinh: 'tron' },
    { id: 'e', x: 90, y: 180, nhan: 'e', hinh: 'tron' }, { id: 'f', x: 200, y: 180, nhan: 'f', hinh: 'tron' }, { id: 'g', x: 330, y: 180, nhan: 'g', hinh: 'tron' }, { id: 'h', x: 420, y: 180, nhan: 'h', hinh: 'tron' },
  ],
  canh: [{ tu: 'a', den: 'b' }, { tu: 'a', den: 'c' }, { tu: 'a', den: 'd' }, { tu: 'b', den: 'e' }, { tu: 'b', den: 'f' }, { tu: 'd', den: 'g' }, { tu: 'd', den: 'h' }],
});
const SD = ['Stub', 'Driver', 'Neither'];
const E2 = tinhDe({
  tieuDe: 'Test levels 2 — Stubs, drivers and integration strategies',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: `<p>A <b>stub</b> replaces a <i>called</i> component that is not ready; a <b>driver</b> replaces the <i>caller</i> of the component under test. Top-down integration starts at the root and needs stubs; bottom-up starts at the leaves and needs drivers.</p>${CAY}<p>Arrows point from caller to called component.</p>`, vi: `<p><b>Stub</b> thay cho thành phần <i>được gọi</i> chưa sẵn sàng; <b>driver</b> thay cho thành phần <i>gọi</i> thành phần đang test. Tích hợp top-down bắt đầu từ gốc và cần stub; bottom-up bắt đầu từ lá và cần driver.</p>${CAY}<p>Mũi tên đi từ thành phần gọi tới thành phần được gọi.</p>` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('What does each situation need for the named component?', 'Mỗi tình huống cần gì cho thành phần được nêu?'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'k', ten: 'Needed', luaChon: SD }],
    hang: [
      'Top-down, baseline {a}: what replaces b?',
      'Top-down, baseline {a, b}: what replaces e?',
      'Bottom-up, testing e alone: what replaces b?',
      'Bottom-up, baseline {e, f, b}: what replaces a?',
      'Top-down, baseline {a, b, c, d}: what replaces c?',
      'Top-down, baseline {a, b, c, d}: what replaces g?',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': SD[0], 'r1.k': SD[0], 'r2.k': SD[1], 'r3.k': SD[1], 'r4.k': SD[2], 'r5.k': SD[0] },
    giaiThich: giai('A missing component BELOW the baseline is replaced by a stub; a missing component ABOVE it (the caller) by a driver; a component already in the baseline needs nothing.', 'Thành phần thiếu NẰM DƯỚI baseline thay bằng stub; thành phần thiếu NẰM TRÊN (bên gọi) thay bằng driver; thành phần đã có trong baseline không cần gì.'),
  }],
  goiY: ['Hỏi: thành phần thiếu GỌI baseline hay ĐƯỢC baseline gọi?', 'c đã có trong baseline {a, b, c, d}.'],
  loiHayGap: ['Đảo stub và driver.', 'Cho rằng top-down cũng cần driver — gốc a không có ai gọi, công cụ test gọi trực tiếp.'],
  giaiThich: '<p>Stub · Stub · Driver · Driver · Neither · Stub.</p>',
  thuatNgu: [{ en: 'stub', vi: 'thành phần giả thay cho bên ĐƯỢC GỌI' }, { en: 'driver', vi: 'thành phần giả thay cho bên GỌI' }, { en: 'baseline', vi: 'tập thành phần đã tích hợp tới thời điểm đó' }],
  khaiNiem: ['stubs and drivers', 'integration strategies'],
});

const E3 = jsDe({
  tieuDe: 'Test levels 3 — Plan an incremental integration in code',
  doKho: 'MEDIUM', phut: 18,
  moTa: { en: `<p>A call tree is an object <code>{ component: [called components] }</code> (every component appears as a key). Write three functions used by an integration test plan:</p>
<ol>
<li><code>topDownOrder(tree, root)</code> — integration order of top-down, breadth-first: the root, then its children in the listed order, then their children, and so on.</li>
<li><code>stubsFor(tree, baseline)</code> — the components <b>called</b> by a member of <code>baseline</code> that are not in it (sorted A→Z, no duplicates).</li>
<li><code>driversFor(tree, baseline)</code> — the components that <b>call</b> a member of <code>baseline</code> and are not in it (sorted A→Z, no duplicates).</li>
</ol>
<p>The tree of the figure in exercise 2 is <code>{ a: ['b','c','d'], b: ['e','f'], c: [], d: ['g','h'], e: [], f: [], g: [], h: [] }</code>.</p>`, vi: `<p>Cây gọi là object <code>{ thànhPhần: [các thành phần nó gọi] }</code> (mọi thành phần đều là một khoá). Viết ba hàm dùng cho kế hoạch test tích hợp:</p>
<ol>
<li><code>topDownOrder(tree, root)</code> — thứ tự tích hợp top-down theo chiều rộng: gốc, rồi các con theo thứ tự liệt kê, rồi con của chúng…</li>
<li><code>stubsFor(tree, baseline)</code> — các thành phần <b>được gọi</b> bởi một thành viên của <code>baseline</code> mà không nằm trong nó (sắp A→Z, không trùng).</li>
<li><code>driversFor(tree, baseline)</code> — các thành phần <b>gọi</b> một thành viên của <code>baseline</code> mà không nằm trong nó (sắp A→Z, không trùng).</li>
</ol>
<p>Cây của hình ở bài 2 là <code>{ a: ['b','c','d'], b: ['e','f'], c: [], d: ['g','h'], e: [], f: [], g: [], h: [] }</code>.</p>` },
  yeuCau: [{ en: 'A component reachable by two paths appears only once in <code>topDownOrder</code> (the first time it is reached).', vi: 'Thành phần tới được bằng hai đường chỉ xuất hiện một lần trong <code>topDownOrder</code> (lần đầu được chạm tới).' }],
  viDu: [
    { input: "topDownOrder(TREE, 'a')", output: "['a','b','c','d','e','f','g','h']", explanation: 'Breadth-first.|||Theo chiều rộng.' },
    { input: "stubsFor(TREE, ['a','b'])", output: "['c','d','e','f']", explanation: 'Called by a or b but not yet integrated.|||Được a hoặc b gọi nhưng chưa tích hợp.' },
    { input: "driversFor(TREE, ['e','f'])", output: "['b']", explanation: 'b calls both.|||b gọi cả hai.' },
  ],
  goiY: ['BFS: hàng đợi bắt đầu bằng root, một Set “đã thăm”.', 'driversFor: duyệt mọi khoá k, nếu tree[k] có phần tử thuộc baseline và k không thuộc baseline thì k là driver.'],
  loiHayGap: ['Dùng DFS (a, b, e, f, c, …) thay cho BFS.', 'Trả thành phần đã ở trong baseline như stub.', 'Quên khử trùng khi hai thành viên cùng gọi một thành phần.'],
  giaiThich: '<p>Top-down needs stubs for everything just below the integrated part; bottom-up needs drivers for everything just above it. Planning them early (test implementation) is part of the integration strategy documented in the test plan.</p>',
  thuatNgu: [{ en: 'breadth-first', vi: 'theo chiều rộng' }, { en: 'call tree', vi: 'cây gọi hàm' }],
  khaiNiem: ['integration strategies', 'stubs and drivers'],
  tep: {
    'integration.js': [
      "function topDownOrder(tree, root) {\n  return [root];\n}\n\nfunction stubsFor(tree, baseline) {\n  return [];\n}\n\nfunction driversFor(tree, baseline) {\n  return [];\n}\n",
      "function topDownOrder(tree, root) {\n  const order = [];\n  const seen = new Set([root]);\n  const queue = [root];\n  while (queue.length) {\n    const x = queue.shift();\n    order.push(x);\n    for (const c of tree[x] || []) if (!seen.has(c)) { seen.add(c); queue.push(c); }\n  }\n  return order;\n}\n\nfunction stubsFor(tree, baseline) {\n  const inB = new Set(baseline);\n  const out = new Set();\n  for (const m of baseline) for (const c of tree[m] || []) if (!inB.has(c)) out.add(c);\n  return [...out].sort();\n}\n\nfunction driversFor(tree, baseline) {\n  const inB = new Set(baseline);\n  const out = new Set();\n  for (const k of Object.keys(tree)) if (!inB.has(k) && (tree[k] || []).some((c) => inB.has(c))) out.add(k);\n  return [...out].sort();\n}\n",
    ],
  },
  kiem: [
    kiemTuy({ en: 'topDownOrder — the figure', vi: 'topDownOrder — hình' }, () => { const T = { a: ['b', 'c', 'd'], b: ['e', 'f'], c: [], d: ['g', 'h'], e: [], f: [], g: [], h: [] }; const r = topDownOrder(T, 'a'); return JSON.stringify(r) === '["a","b","c","d","e","f","g","h"]' ? 'OK' : 'got ' + JSON.stringify(r) + ' — breadth-first, children in the listed order'; }),
    kiemTuy({ en: 'topDownOrder — shared component appears once', vi: 'topDownOrder — thành phần dùng chung chỉ một lần' }, () => { const T = { m: ['x', 'y'], x: ['z'], y: ['z'], z: [] }; const r = topDownOrder(T, 'm'); return JSON.stringify(r) === '["m","x","y","z"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'stubsFor — baseline {a, b}', vi: 'stubsFor — baseline {a, b}' }, () => { const T = { a: ['b', 'c', 'd'], b: ['e', 'f'], c: [], d: ['g', 'h'], e: [], f: [], g: [], h: [] }; const r = stubsFor(T, ['a', 'b']); return JSON.stringify(r) === '["c","d","e","f"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'stubsFor — no duplicates, sorted', vi: 'stubsFor — không trùng, đã sắp' }, () => { const T = { m: ['z', 'y'], n: ['y'], y: [], z: [] }; const r = stubsFor(T, ['n', 'm']); return JSON.stringify(r) === '["y","z"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'driversFor — leaves e and f', vi: 'driversFor — lá e và f' }, () => { const T = { a: ['b', 'c', 'd'], b: ['e', 'f'], c: [], d: ['g', 'h'], e: [], f: [], g: [], h: [] }; const r = driversFor(T, ['e', 'f']); return JSON.stringify(r) === '["b"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'driversFor — baseline {e, f, b, g}', vi: 'driversFor — baseline {e, f, b, g}' }, () => { const T = { a: ['b', 'c', 'd'], b: ['e', 'f'], c: [], d: ['g', 'h'], e: [], f: [], g: [], h: [] }; const r = driversFor(T, ['e', 'f', 'b', 'g']); return JSON.stringify(r) === '["a","d"]' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'whole tree integrated ⇒ no stubs, no drivers', vi: 'tích hợp cả cây ⇒ không stub, không driver' }, () => { const T = { a: ['b'], b: [] }; return stubsFor(T, ['a', 'b']).length === 0 && driversFor(T, ['a', 'b']).length === 0 ? 'OK' : 'expected [] and []'; }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'Test levels 4 — Exam questions on component and integration testing',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six FE-style questions on SWT2 slides 36–74: integration strategies (big-bang, incremental), component integration versus system integration, what integration testing should focus on, test-driven development and typical interface defects.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT2 36–74: chiến lược tích hợp (big-bang, tăng dần), component integration và system integration, integration testing nên tập trung vào đâu, TDD và lỗi giao diện điển hình.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Why is big-bang integration usually slower in practice?', 'Vì sao tích hợp big-bang thực tế thường chậm hơn?'), luaChon: lc(['a', 'It needs many stubs'], ['b', 'When a failure appears, it is hard to locate the faulty interface among all components integrated at once'], ['c', 'It must be automated'], ['d', 'It is done by users']), dapAn: ['b'], giaiThich: giai('Incremental integration localises defects to the last added component.', 'Tích hợp tăng dần khoanh vùng lỗi vào thành phần vừa thêm.') },
    { ma: 'q2', de: hai('Which is the difference between component integration testing and system integration testing?', 'Khác biệt giữa component integration testing và system integration testing là gì?'), luaChon: lc(['a', 'None'], ['b', 'CIT tests interactions between components (usually after component testing, by developers); SIT tests interactions between systems, packages and microservices or external interfaces (usually after system testing, by testers)'], ['c', 'SIT is done before component testing'], ['d', 'CIT is done by users']), dapAn: ['b'], giaiThich: giai('Two integration levels with different scope and responsibility.', 'Hai cấp tích hợp khác phạm vi và trách nhiệm.') },
    { ma: 'q3', de: hai('Integration testing should concentrate on…', 'Integration testing nên tập trung vào…'), luaChon: lc(['a', 'the functionality of each individual module'], ['b', 'the integration itself — the communication between the modules, not their internal functionality'], ['c', 'usability'], ['d', 'the user manual']), dapAn: ['b'], giaiThich: giai('Individual functionality was covered at component level.', 'Chức năng từng module đã được phủ ở cấp component.') },
    { ma: 'q4', de: hai('A developer writes a failing JUnit test, then the code to pass it, then refactors. This is…', 'Developer viết test JUnit trượt, rồi mã để test đạt, rồi refactor. Đây là…'), luaChon: lc(['a', 'acceptance testing'], ['b', 'test-driven development at component level'], ['c', 'big-bang integration'], ['d', 'system testing']), dapAn: ['b'], giaiThich: giai('TDD is an example of test-first at the component level.', 'TDD là ví dụ test trước ở cấp component.') },
    { ma: 'q5', de: hai('Which is a typical integration defect?', 'Đâu là lỗi tích hợp điển hình?'), luaChon: lc(['a', 'A loop iterates one time too many inside a method'], ['b', 'Module A sends the duration in minutes; module B expects hours'], ['c', 'The UI colour is wrong'], ['d', 'The user manual has a typo']), dapAn: ['b'], giaiThich: giai('Units mismatch across an interface = wrong assumptions about data.', 'Lệch đơn vị qua giao diện = giả định sai về dữ liệu.') },
    { ma: 'q6', de: hai('Why should integration be planned with the architecture?', 'Vì sao nên lập kế hoạch tích hợp cùng kiến trúc?'), luaChon: lc(['a', 'To make the system build in the order most efficient for testing'], ['b', 'To avoid writing unit tests'], ['c', 'To skip system testing'], ['d', 'It should not be']), dapAn: ['a'], giaiThich: giai('The integration strategy (order, stubs/drivers) depends on the architecture and should be planned before building.', 'Chiến lược tích hợp (thứ tự, stub/driver) phụ thuộc kiến trúc và nên lập trước khi xây.') },
  ],
  goiY: ['Integration = giao diện, không phải chức năng bên trong.', 'CIT do developer, SIT do tester.'],
  loiHayGap: ['Chọn “cần nhiều stub” cho câu big-bang — big-bang không cần stub, nó chỉ khó khoanh vùng.', 'Chọn lỗi vòng lặp trong một method là lỗi tích hợp — đó là lỗi component.'],
  giaiThich: '<p>Answers: b · b · b · b · b · a.</p>',
  thuatNgu: [{ en: 'big-bang integration', vi: 'tích hợp một lần tất cả' }, { en: 'CIT / SIT', vi: 'component / system integration testing' }],
  khaiNiem: ['integration testing'],
});

const CAP4 = ['Component testing', 'Component integration testing', 'System integration testing'];
const E5 = tinhDe({
  tieuDe: 'Test levels 5 — At which level would LabBook find this defect first?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>LabBook = web front-end → REST API → BookingService → SeatRepository (PostgreSQL), plus an external university e-mail gateway. Decide the lowest level at which each defect would be found.</p>', vi: '<p>LabBook = giao diện web → REST API → BookingService → SeatRepository (PostgreSQL), cộng cổng e-mail ngoài của trường. Xác định cấp thấp nhất phát hiện được mỗi lỗi.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Defect → lowest level', 'Lỗi → cấp thấp nhất'),
    cot: [{ ma: 'd', ten: 'Defect' }, { ma: 'l', ten: 'Level', luaChon: CAP4 }],
    hang: [
      'BookingService.weeklyHours adds the hours of cancelled bookings',
      'BookingService passes (lab, studentId) but SeatRepository.countSeats expects (studentId, lab)',
      'The university e-mail gateway rejects messages whose subject contains Vietnamese characters',
      'calcRefund returns 50% for 1 h 59 min before the start',
      'The REST controller sends the date as “02/11/2026” but BookingService parses ISO “2026-11-02”',
      'After a timeout of the e-mail gateway LabBook retries forever and blocks the booking',
    ].map((d, i) => ({ ma: `r${i}`, o: { d } })),
    dapAn: { 'r0.l': CAP4[0], 'r1.l': CAP4[1], 'r2.l': CAP4[2], 'r3.l': CAP4[0], 'r4.l': CAP4[1], 'r5.l': CAP4[2] },
    giaiThich: giai('Logic inside one method → component; mismatches between LabBook’s own components → component integration; problems with an external system → system integration.', 'Logic trong một method → component; lệch giữa các thành phần của LabBook → component integration; vấn đề với hệ thống bên ngoài → system integration.'),
  }],
  goiY: ['Lỗi nằm gọn trong một method? hay giữa hai thành phần của mình? hay với hệ thống ngoài?', 'Cổng e-mail của trường là hệ thống NGOÀI ⇒ system integration.'],
  loiHayGap: ['Đẩy mọi lỗi lên system testing — lỗi nên tìm ở cấp thấp nhất có thể (rẻ hơn).', 'Xếp lệch định dạng ngày giữa controller và service vào component — lỗi nằm ở giao diện giữa hai thành phần.'],
  giaiThich: '<p>CT · CIT · SIT · CT · CIT · SIT.</p>',
  thuatNgu: [{ en: 'gateway', vi: 'cổng kết nối tới hệ thống ngoài' }],
  khaiNiem: ['test levels'],
});

export default doiDau({
  slug: 'swt301-test-levels',
  ten: '2.2 Test levels: component and integration testing',
  moTaModule: 'Năm thuộc tính của component và integration testing, stub/driver trên cây gọi, viết code lập kế hoạch tích hợp top-down/bottom-up, câu thi, chọn cấp phát hiện lỗi LabBook.',
  khoa: KHOA,
  baiHoc: 'swt301-test-levels',
  de: [E1, E2, E3, E4, E5],
});
