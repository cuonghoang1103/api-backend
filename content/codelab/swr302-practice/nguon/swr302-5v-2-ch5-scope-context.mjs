/**
 * SWR302 · 2.5 — Scope, limitations and the context diagram (Wiegers Ch.5 slides 18–27 + LAB L.2).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemNguCanh } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = tracNghiem({
  tieuDe: 'Scope 1 — context diagram rules',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The context diagram answers one question: what is inside the system and what is outside. Three symbols only: ONE circle (the whole system), rectangles (external entities — people, organisations, other systems) and labelled arrows (data flows).</p>', vi: '<p>Sơ đồ ngữ cảnh trả lời một câu: cái gì trong hệ thống, cái gì ngoài. Chỉ ba ký hiệu: MỘT hình tròn (cả hệ thống), hình chữ nhật (thực thể ngoài — người, tổ chức, hệ thống khác) và mũi tên có nhãn (luồng dữ liệu).</p>' },
  cau: [
    { en: 'How many processes does a context diagram contain?', vi: 'Sơ đồ ngữ cảnh có bao nhiêu process?', lc: [['a', 'One, the whole system'], ['b', 'One per major feature'], ['c', 'As many as the use cases'], ['d', 'None']], dap: 'a', giai: ['Sub-processes belong to the level-0 DFD.', 'Process con thuộc DFD mức 0.'] },
    { en: 'May a context diagram show the system’s database?', vi: 'Sơ đồ ngữ cảnh có được vẽ CSDL của hệ thống không?', lc: [['a', 'Yes, as an external entity'], ['b', 'Yes, as a data store'], ['c', 'No — it is inside the system'], ['d', 'Only if it is large']], dap: 'c', giai: ['No data stores, no internals.', 'Không kho dữ liệu, không phần bên trong.'] },
    { en: 'Which arrow label is correct?', vi: 'Nhãn mũi tên nào đúng?', lc: [['a', 'places order'], ['b', 'order details'], ['c', 'click Submit'], ['d', '(no label)']], dap: 'b', giai: ['Name the DATA as a noun phrase.', 'Gọi tên DỮ LIỆU bằng cụm danh từ.'] },
    { en: 'The canteen sends menu updates to FoodRun and receives sales reports. How do you draw it?', vi: 'Căng-tin gửi cập nhật thực đơn tới FoodRun và nhận báo cáo doanh số. Vẽ thế nào?', lc: [['a', 'One double-headed arrow'], ['b', 'Two arrows, one per direction, each with its own label'], ['c', 'No arrow'], ['d', 'A dashed line']], dap: 'b', giai: ['One arrow per direction, each naming its data.', 'Mỗi chiều một mũi tên, mỗi cái nêu dữ liệu của nó.'] },
  ],
  goiY: ['Một vòng tròn, không ruột.', 'Nhãn = dữ liệu (danh từ), mỗi chiều một mũi tên.'],
  loiHayGap: ['Vẽ hai vòng tròn (hệ thống lõi + báo cáo).', 'Ghi nhãn bằng động từ hành động.'],
  giaiThich: '<p>Answers: a · c · b · b.</p>',
  thuatNgu: tn('contextDiagram', 'externalEntity', 'dataFlow'),
  khaiNiem: ['context diagram'],
});

const E2 = phanLoai({
  tieuDe: 'Scope 2 — inside or outside the circle?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p><b>FoodRun</b> takes orders from students, sends them to the canteen kitchen, assigns a courier and charges the campus e-wallet; the canteen manager updates the menu. For each element decide: <b>External entity</b> (outside, exchanges data with FoodRun) or <b>Inside the system</b> (part of FoodRun, not drawn).</p>', vi: '<p><b>FoodRun</b> nhận đơn của sinh viên, gửi xuống bếp căng-tin, giao cho người giao hàng và trừ ví điện tử; quản lý căng-tin cập nhật thực đơn. Với mỗi thành phần: <b>External entity</b> (bên ngoài, trao đổi dữ liệu với FoodRun) hay <b>Inside the system</b> (thuộc FoodRun, không vẽ).</p>' },
  cot: 'Where?', luaChon: ['External entity', 'Inside the system'],
  hang: [
    ['Student', 'External entity'], ['Courier', 'External entity'], ['Campus e-wallet', 'External entity'], ['Canteen manager', 'External entity'],
    ['Order database', 'Inside the system'], ['Courier assignment algorithm', 'Inside the system'], ['Menu', 'Inside the system'], ['Kitchen display screen app', 'Inside the system'],
  ],
  giaiThich: '<p>People, organisations and other systems that send or receive data are external entities. Databases, algorithms, data (the menu) and FoodRun’s own screens are inside the circle.</p>',
  goiY: ['Thực thể ngoài trao đổi dữ liệu với hệ thống nhưng không thuộc nó.', 'Dữ liệu (thực đơn, đơn hàng) và màn hình của chính hệ thống nằm TRONG vòng tròn.'],
  loiHayGap: ['Vẽ "Menu" thành thực thể ngoài.', 'Vẽ màn hình bếp của chính hệ thống thành thực thể ngoài.'],
  thuatNgu: tn('externalEntity', 'scope'),
  khaiNiem: ['system boundary'],
});

const GIAI_CTX = `
flowchart LR
  S((PrintPal))
  ST[Student]
  PR[Campus Printer]
  EW[Campus E-wallet]
  LB[Library Staff]
  ST -->|print job| S
  S -->|job status| ST
  S -->|print data| PR
  PR -->|printer status| S
  S -->|charge request| EW
  EW -->|payment result| S
  LB -->|printer and price settings| S
  S -->|usage report| LB
`;
const E3 = baiJs({
  tieuDe: 'Scope 3 — draw the context diagram of PrintPal',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: `<p><b>PrintPal</b>: a <b>student</b> uploads a print job from the phone and follows its status. PrintPal sends the print data to a <b>campus printer</b> when the student taps the card there; printers report their status (paper, toner). Each job is charged through the <b>campus e-wallet</b>, which returns the payment result. <b>Library staff</b> set the printers and the price per page and receive a monthly usage report. Draw the context diagram.</p><p>${CU_PHAP.context.en}</p>`, vi: `<p><b>PrintPal</b>: <b>sinh viên</b> tải lệnh in từ điện thoại và theo dõi trạng thái. PrintPal gửi dữ liệu in tới <b>máy in</b> khi sinh viên chạm thẻ; máy in báo trạng thái (giấy, mực). Mỗi lệnh in bị trừ qua <b>ví điện tử</b>, ví trả kết quả thanh toán. <b>Nhân viên thư viện</b> cài đặt máy in, giá mỗi trang và nhận báo cáo sử dụng hằng tháng. Vẽ sơ đồ ngữ cảnh.</p><p>${CU_PHAP.context.vi}</p>` },
  yeuCau: [{ en: 'One circle, four external entities, labelled one-way data flows in both directions where the case says so.', vi: 'Một vòng tròn, bốn thực thể ngoài, luồng dữ liệu một chiều có nhãn, đủ hai chiều khi đề nói vậy.' }],
  viDu: [{ input: 'ST[Student] -->|print job| S', output: 'a data flow from the student into PrintPal', explanation: 'Label = the data.|||Nhãn = dữ liệu.' }],
  tep: { 'context.js': ['const CONTEXT_DIAGRAM = ´\nflowchart LR\n  S((PrintPal))\n´;\n', `// Four external entities, two arrows each (one per direction).\nconst CONTEXT_DIAGRAM = ´${GIAI_CTX.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemNguCanh({
    bien: 'CONTEXT_DIAGRAM',
    ngoai: [
      { ten: 'Student', khop: ['student'], can: ['vao', 'ra'] },
      { ten: 'Campus Printer', khop: ['printer'], can: ['vao', 'ra'] },
      { ten: 'Campus E-wallet', khop: ['wallet|payment'], can: ['vao', 'ra'] },
      { ten: 'Library Staff', khop: ['library|staff|admin'], can: ['vao', 'ra'] },
    ],
    cam: [{ ten: 'Print queue / Database', khop: ['queue|database|\\bdb\\b|job$|document'], lyDo: 'that is data inside PrintPal', lyDoVi: 'đó là dữ liệu bên trong PrintPal' }],
  }),
  goiY: ['Bốn thực thể ngoài: Student, Campus Printer, Campus E-wallet, Library Staff.', 'Máy in là hệ thống/thiết bị NGOÀI: PrintPal gửi dữ liệu in và nhận trạng thái.'],
  loiHayGap: ['Vẽ "Print queue" thành thực thể ngoài.', 'Nhãn "print" (động từ) thay vì "print job"/"print data".'],
  giaiThich: `<p>Four parties exchange data with PrintPal; each exchange is a pair of labelled arrows.</p>${khoiThamChieu('luong', GIAI_CTX, 'Context diagram — PrintPal')}`,
  thuatNgu: tn('contextDiagram', 'externalEntity', 'dataFlow'),
  khaiNiem: ['context diagram'],
  boYeu: [{ ten: 'có kho + nhãn động từ', tep: { 'context.js': 'const CONTEXT_DIAGRAM = `\nflowchart LR\n  S((PrintPal))\n  DB[(Print queue)]\n  ST[Student] -->|send document| S\n  S --> DB\n`;\n' } }],
});

const E4 = baiJs({
  tieuDe: 'Scope 4 — fix a broken context diagram',
  doKho: 'HARD', phut: 10,
  moTa: { en: `<p>A teammate drew this context diagram for <b>FoodRun</b> (students order; the canteen kitchen receives orders and sends ready notices; couriers receive delivery jobs and confirm delivery; the campus e-wallet is charged and returns the result; the manager updates the menu and receives sales reports):</p><pre>flowchart LR
  S((FoodRun))
  S2((Payment module))
  DB[(Orders DB)]
  Student -->|place order| S
  Kitchen[Canteen Kitchen] -- order --- S
  Courier[Courier] -->|delivery confirmation| S
  Student --> Courier
  S -->|charge request| S2
  Manager[Canteen Manager] -->|menu update| S</pre><p>Rewrite it correctly in <code>CONTEXT_DIAGRAM</code>.</p>`, vi: '<p>Một bạn cùng nhóm vẽ sơ đồ ngữ cảnh FoodRun như trên (sinh viên đặt đơn; bếp nhận đơn và báo món xong; người giao nhận việc giao và xác nhận đã giao; ví điện tử bị trừ và trả kết quả; quản lý cập nhật thực đơn và nhận báo cáo doanh số). Viết lại cho đúng trong <code>CONTEXT_DIAGRAM</code>.</p>' },
  yeuCau: [{ en: 'Fix every error: one circle, no store, rectangles, labelled one-way flows, no entity-to-entity flow, data (not actions) as labels, all five external entities with both directions where the case says so.', vi: 'Sửa mọi lỗi: một vòng tròn, không kho, hình chữ nhật, luồng một chiều có nhãn, không luồng thực thể–thực thể, nhãn là dữ liệu, đủ năm thực thể ngoài với đủ chiều.' }],
  viDu: [{ input: 'Student -->|place order| S', output: 'ST[Student] -->|order details| S', explanation: 'Name the data, and give the node a rectangle shape.|||Gọi tên dữ liệu, và cho nút hình chữ nhật.' }],
  tep: { 'context.js': ['const CONTEXT_DIAGRAM = ´\nflowchart LR\n  S((FoodRun))\n  S2((Payment module))\n  DB[(Orders DB)]\n  Student -->|place order| S\n´;\n', "// Payment module and the DB are inside FoodRun; the e-wallet is the external payment party; two arrows per entity.\nconst CONTEXT_DIAGRAM = ´\nflowchart LR\n  S((FoodRun))\n  ST[Student]\n  KI[Canteen Kitchen]\n  CO[Courier]\n  EW[Campus E-wallet]\n  MG[Canteen Manager]\n  ST -->|order details| S\n  S -->|order status| ST\n  S -->|kitchen order| KI\n  KI -->|ready notice| S\n  S -->|delivery job| CO\n  CO -->|delivery confirmation| S\n  S -->|charge request| EW\n  EW -->|payment result| S\n  MG -->|menu update| S\n  S -->|sales report| MG\n´;\n"] },
  kiem: kiemNguCanh({
    bien: 'CONTEXT_DIAGRAM',
    ngoai: [
      { ten: 'Student', khop: ['student'], can: ['vao', 'ra'] },
      { ten: 'Canteen Kitchen', khop: ['kitchen|canteen staff|cook'], can: ['vao', 'ra'] },
      { ten: 'Courier', khop: ['courier|driver|shipper'], can: ['vao', 'ra'] },
      { ten: 'Campus E-wallet', khop: ['wallet|payment gateway'], can: ['vao', 'ra'] },
      { ten: 'Canteen Manager', khop: ['manager'], can: ['vao', 'ra'] },
    ],
    cam: [{ ten: 'Payment module / Orders DB', khop: ['module|database|\\bdb\\b|orders'], lyDo: 'it is part of FoodRun', lyDoVi: 'nó là một phần của FoodRun' }],
  }),
  goiY: ['Payment module và Orders DB là bên trong FoodRun — bỏ ra khỏi sơ đồ; bên thanh toán NGOÀI là ví điện tử.', 'Student --> Courier là chuyện ngoài hệ thống — xoá.'],
  loiHayGap: ['Giữ "Payment module" thành hình tròn thứ hai.', 'Sửa nhãn mà quên thêm chiều ngược lại (báo cáo cho quản lý, trạng thái đơn cho sinh viên).'],
  giaiThich: '<p>Six errors: a second circle, a data store, a bare node without a rectangle, an action label, an unlabelled double line, an entity-to-entity flow — plus missing flows (order status, kitchen order, delivery job, payment result, sales report) and a missing entity (the e-wallet).</p>',
  thuatNgu: tn('contextDiagram', 'externalEntity', 'dataFlow'),
  khaiNiem: ['context diagram review'],
  boYeu: [{ ten: 'giữ hai vòng tròn', tep: { 'context.js': "const CONTEXT_DIAGRAM = `\nflowchart LR\n  S((FoodRun))\n  S2((Payment module))\n  ST[Student]\n  ST -->|order details| S\n  S -->|charge request| S2\n`;\n" } }],
});

export default moDun({
  slug: 'swr302-5v-2-ch5-scope-context',
  ten: '2.17 Scope and the context diagram',
  moTaModule: 'Luật sơ đồ ngữ cảnh (một vòng tròn, không ruột, nhãn là dữ liệu, mỗi chiều một mũi tên), trong hay ngoài biên hệ thống, tự vẽ context diagram PrintPal và sửa một sơ đồ sai — chấm bằng máy đọc Mermaid.',
  de: [E1, E2, E3, E4],
});
