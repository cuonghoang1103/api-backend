/**
 * SWR302 · 4.5 — Data flow diagrams: notation, levels, balancing, black holes and miracles (Wiegers Ch.12 + LAB L.5).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemDfd } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = tracNghiem({
  tieuDe: 'DFD 1 — the four symbols and the rules',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A data flow diagram has four symbols: <b>process</b> (circle, numbered, verb phrase), <b>data store</b> (open rectangle, plural noun), <b>external entity</b> (rectangle) and <b>data flow</b> (labelled arrow). Data moves between entities and stores only THROUGH a process.</p>', vi: '<p>DFD có bốn ký hiệu: <b>process</b> (hình tròn, đánh số, cụm động từ), <b>kho dữ liệu</b> (hình chữ nhật hở, danh từ số nhiều), <b>thực thể ngoài</b> (hình chữ nhật) và <b>luồng dữ liệu</b> (mũi tên có nhãn). Dữ liệu chỉ đi giữa thực thể và kho QUA một process.</p>' },
  cau: [
    { en: 'Which is a well-named process?', vi: 'Process nào đặt tên tốt?', lc: [['a', '2.0 Orders'], ['b', '2.0 Validate order'], ['c', '2.0 Order DB'], ['d', '2.0 Customer']], dap: 'b', giai: ['Number + verb phrase.', 'Số + cụm động từ.'] },
    { en: 'May a customer write directly into the Orders store?', vi: 'Khách hàng có được ghi thẳng vào kho Orders không?', lc: [['a', 'Yes'], ['b', 'No — data must pass through a process'], ['c', 'Only on level 0'], ['d', 'Only if the store is small']], dap: 'b', giai: ['Entity → store directly is illegal.', 'Thực thể → kho trực tiếp là sai.'] },
    { en: 'A process with inputs but no outputs is a…', vi: 'Process có vào mà không có ra là…', lc: [['a', 'miracle'], ['b', 'black hole'], ['c', 'grey hole'], ['d', 'data store']], dap: 'b', giai: ['Inputs disappear — a black hole.', 'Dữ liệu vào biến mất — hố đen.'] },
    { en: 'A process with outputs but no inputs is a…', vi: 'Process có ra mà không có vào là…', lc: [['a', 'miracle'], ['b', 'black hole'], ['c', 'context'], ['d', 'balancing']], dap: 'a', giai: ['Data from nowhere — a miracle.', 'Dữ liệu từ hư không — phép màu.'] },
    { en: 'Balancing between levels means…', vi: 'Cân bằng giữa các mức nghĩa là…', lc: [['a', 'every level has the same number of processes'], ['b', 'the flows into and out of a process appear, with the same names and directions, on the diagram that decomposes it'], ['c', 'the diagram is symmetrical'], ['d', 'stores are balanced in size']], dap: 'b', giai: ['Nothing added, nothing dropped, same names.', 'Không thêm, không bớt, cùng tên.'] },
  ],
  goiY: ['Process = số + động từ; kho = danh từ số nhiều.', 'Hố đen: vào không ra; phép màu: ra không vào.'],
  loiHayGap: ['Đặt tên process bằng danh từ.', 'Cho thực thể ghi thẳng vào kho.'],
  giaiThich: '<p>Answers: b · b · b · a · b.</p>',
  thuatNgu: tn('dfd', 'dataStore', 'blackHole', 'balancing'),
  khaiNiem: ['DFD notation'],
});

const E2 = phanLoai({
  tieuDe: 'DFD 2 — legal flow or not?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Library DFD elements: entities <b>Reader</b>, <b>Librarian</b>; processes <b>1.0 Lend book</b>, <b>2.0 Return book</b>; stores <b>D1 Loans</b>, <b>D2 Books</b>. Decide whether each flow is <b>Legal</b> or <b>Illegal</b>.</p>', vi: '<p>Thành phần DFD thư viện: thực thể <b>Reader</b>, <b>Librarian</b>; process <b>1.0 Lend book</b>, <b>2.0 Return book</b>; kho <b>D1 Loans</b>, <b>D2 Books</b>. Mỗi luồng là <b>Legal</b> (hợp lệ) hay <b>Illegal</b>?</p>' },
  cot: 'Verdict', luaChon: ['Legal', 'Illegal'],
  hang: [
    ['Reader → 1.0 Lend book : loan request', 'Legal'],
    ['Reader → D1 Loans : loan record', 'Illegal'],
    ['1.0 Lend book → D1 Loans : new loan', 'Legal'],
    ['D2 Books → D1 Loans : book status', 'Illegal'],
    ['Reader → Librarian : book request', 'Illegal'],
    ['D1 Loans → 2.0 Return book : open loan', 'Legal'],
    ['2.0 Return book → Reader : return receipt', 'Legal'],
    ['1.0 Lend book → 2.0 Return book (no label)', 'Illegal'],
  ],
  giaiThich: '<p>Every legal flow has a process at one end and a label. Entity→store, store→store and entity→entity flows are illegal; so is an unlabelled flow.</p>',
  goiY: ['Mỗi luồng hợp lệ có ít nhất một đầu là process.', 'Luồng không nhãn luôn sai.'],
  loiHayGap: ['Cho kho đọc từ kho khác trực tiếp.', 'Vẽ luồng giữa hai thực thể ngoài trong DFD.'],
  thuatNgu: tn('dfd', 'dataFlow', 'dataStore'),
  khaiNiem: ['DFD rules'],
});

const GIAI_CTX = `
flowchart LR
  S((Canteen Pre-order))
  ST[Student]
  KI[Kitchen]
  EW[E-wallet]
  ST -->|order| S
  S -->|order confirmation| ST
  S -->|kitchen ticket| KI
  KI -->|ready notice| S
  S -->|charge request| EW
  EW -->|payment result| S
`;
const GIAI_DFD = `
flowchart LR
  ST[Student]
  KI[Kitchen]
  EW[E-wallet]
  P1((1.0 Take order))
  P2((2.0 Collect payment))
  P3((3.0 Prepare order))
  D1[(D1 Orders)]
  D2[(D2 Menu items)]
  ST -->|order| P1
  D2 -->|dish price| P1
  P1 -->|new order| D1
  D1 -->|unpaid order| P2
  P2 -->|charge request| EW
  EW -->|payment result| P2
  P2 -->|paid order| D1
  D1 -->|paid orders| P3
  P3 -->|kitchen ticket| KI
  KI -->|ready notice| P3
  P3 -->|order confirmation| ST
  P3 -->|ready status| D1
  P3 -->|sold quantity| D2
`;
const E3 = baiJs({
  tieuDe: 'DFD 3 — draw a balanced level-0 DFD',
  doKho: 'HARD', phut: 18,
  moTa: { en: `<p>The context diagram of a canteen pre-order system is given:</p><pre>${GIAI_CTX.trim().replace(/</g, '&lt;')}</pre><p>Decompose it into a level-0 DFD with three processes — <b>take the order</b>, <b>collect the payment</b>, <b>prepare the order</b> — and the stores <b>Orders</b> and <b>Menu items</b>. The DFD must balance with the context diagram: the same external flows, same names, same directions.</p><p>${CU_PHAP.dfd.en}</p>`, vi: `<p>Cho sơ đồ ngữ cảnh của hệ thống đặt món căng-tin (như trên). Phân rã thành DFD mức 0 với ba process — <b>nhận đơn</b>, <b>thu tiền</b>, <b>chuẩn bị món</b> — và các kho <b>Orders</b>, <b>Menu items</b>. DFD phải cân bằng với sơ đồ ngữ cảnh: cùng các luồng ngoài, cùng tên, cùng chiều.</p><p>${CU_PHAP.dfd.vi}</p>` },
  yeuCau: [{ en: 'Numbered verb-phrase processes, both stores written and read, no black hole or miracle, the six context flows unchanged.', vi: 'Process đánh số tên động từ, hai kho đều được ghi và đọc, không hố đen/phép màu, sáu luồng ngữ cảnh giữ nguyên.' }],
  viDu: [{ input: 'ST -->|order| P1', output: 'the context flow "order" now enters process 1.0', explanation: 'Same name, same direction.|||Cùng tên, cùng chiều.' }],
  tep: { 'dfd.js': ['const DFD = ´\nflowchart LR\n  ST[Student]\n  P1((1.0 Take order))\n  ST -->|order| P1\n´;\n', `// Every context flow keeps its name; each store is written by one process and read by another.\nconst DFD = ´${GIAI_DFD.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemDfd({
    bien: 'DFD',
    proc: [{ ten: 'Take order', khop: ['order|take|receive'] }, { ten: 'Collect payment', khop: ['pay|charge|collect'] }, { ten: 'Prepare order', khop: ['prepar|cook|kitchen|fulfil'] }],
    kho: [{ ten: 'Orders', khop: ['order'] }, { ten: 'Menu items', khop: ['menu|dish|item'] }],
    canBang: [
      { thucThe: 'Student', huong: 'vao', nhan: 'order' }, { thucThe: 'Student', huong: 'ra', nhan: 'order confirmation' },
      { thucThe: 'Kitchen', huong: 'ra', nhan: 'kitchen ticket' }, { thucThe: 'Kitchen', huong: 'vao', nhan: 'ready notice' },
      { thucThe: 'E-wallet', huong: 'ra', nhan: 'charge request' }, { thucThe: 'E-wallet', huong: 'vao', nhan: 'payment result' },
    ],
  }),
  goiY: ['Chép nguyên tên sáu luồng ngoài: order, order confirmation, kitchen ticket, ready notice, charge request, payment result.', 'Kho Menu items phải có cả luồng vào (vd số lượng đã bán) và luồng ra (giá món).'],
  loiHayGap: ['Đổi "order" thành "order details" trong DFD — mất cân bằng.', 'Kho Menu items chỉ được đọc mà không ai ghi.'],
  giaiThich: `<p>The three processes split the system’s work; the stores hold what is shared between them; the external flows are the context flows, unchanged.</p>${khoiThamChieu('luong', GIAI_DFD, 'Level-0 DFD — canteen pre-order')}`,
  thuatNgu: tn('dfd', 'balancing', 'dataStore', 'blackHole'),
  khaiNiem: ['levelled DFD', 'balancing'],
  boYeu: [{ ten: 'đổi tên luồng + kho chỉ đọc', tep: { 'dfd.js': `const DFD = \`${GIAI_DFD.replace('ST -->|order| P1', 'ST -->|order details| P1').replace('  P3 -->|sold quantity| D2\n', '')}\`;\n` } }],
});

const E4 = phanLoai({
  tieuDe: 'DFD 4 — find the error in each fragment',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Each fragment of a student’s DFD has exactly one error. Name it.</p>', vi: '<p>Mỗi đoạn DFD của một sinh viên có đúng một lỗi. Gọi tên lỗi.</p>' },
  cot: 'Error', luaChon: ['Black hole', 'Miracle', 'Store written but never read', 'Store read but never written', 'Unbalanced with the parent level', 'Process named as a noun'],
  hang: [
    ['3.0 Archive loans receives "closed loan" and sends nothing anywhere.', 'Black hole'],
    ['4.0 Print report sends "monthly report" to the Director but receives no data.', 'Miracle'],
    ['D5 Audit log receives "audit entry" from three processes; no process reads it.', 'Store written but never read'],
    ['D3 Exchange rates is read by 2.0 Compute fee; no process ever writes it.', 'Store read but never written'],
    ['On the level-1 diagram of 2.0 a new flow "SMS" goes to the Reader; the context diagram has no such flow.', 'Unbalanced with the parent level'],
    ['5.0 Fines receives "overdue loan" and sends "fine notice".', 'Process named as a noun'],
  ],
  giaiThich: '<p>Each error is mechanical to detect: count what goes in and out of every process and store, compare levels side by side, read every process name as a verb phrase.</p>',
  goiY: ['Đếm luồng vào/ra của từng process và từng kho.', 'Một luồng mới với thực thể ngoài ở mức con ⇒ mất cân bằng.'],
  loiHayGap: ['Nhầm hố đen với kho chỉ được ghi.', 'Cho rằng kho đọc từ dữ liệu "có sẵn" là hợp lệ — phải có process ghi (hoặc thực thể cung cấp qua process).'],
  thuatNgu: tn('blackHole', 'balancing', 'dataStore'),
  khaiNiem: ['DFD validation'],
});

export default moDun({
  slug: 'swr302-4-2-domain-model-dfd',
  ten: '4.5 Data flow diagrams: notation, levels and balancing',
  moTaModule: 'Bốn ký hiệu DFD, luồng hợp lệ và không hợp lệ, hố đen / phép màu / kho chỉ ghi / kho chỉ đọc / mất cân bằng, tự vẽ DFD mức 0 cân bằng với sơ đồ ngữ cảnh cho sẵn (chấm bằng máy đọc Mermaid).',
  de: [E1, E2, E4, E3],
});
