/**
 * pro-lab-5 — PRO192 · Lab 5 · CT Library "Abstract classes and interfaces" (slide EN, khuôn _pro-chung, agent pro-lab45 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab5 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 163/163; starter = 5 TODO; bay/truu-tuong = 3 lỗi javac thật, bay/hang-interface = 1 lỗi) và gen/java/lab5/*.java (chạy thật).
 * Interface giữ tên BookRepository (khớp video pro-0-2; bộ lời giải LAB211 không dùng tiền tố I).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-5.mjs --out <dir>   ⇒ <dir>/lab5/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, soDoLop, luong, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab5', code: 'PRO192 Lab 5', title: 'Lab 5 — CT Library: abstract classes and interfaces', sub: 'abstract LibraryItem · interface BookRepository + InMemoryBookRepository · FeePolicy' };

const S = 'lab5/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const R = (a, b) => ra('lab5/solution:run', [a, b]);
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const boNhac = (t) => t.split('\n').map((x) => x.replace(/^(?:Ma tai lieu \(vi du B001, T005, D006\): |So ngay da giu: |Nguoi muon \(1 Sinh vien, 2 Can bo\): )+/, '')).join('\n');

export const slides = lamDeck({ chuong: 'Lab 5 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 5 — CT Library:<br>abstract classes and interfaces', sub: 'After Chapter 5 · no more "generic item" · the repository becomes a contract · fees follow a policy — the seam Lab 9 plugs a file into' },

  /* 2 */
  { t: 'Ticket CTL-5 — three review comments on Lab 4', body: two(
    box('The reviewer wrote', `<p style="margin:0 0 6px">1. "${c('new LibraryItem()')} works — what is an item with <b>0 loan days</b>?"</p>
<p style="margin:0 0 6px">2. "The controller is glued to a list in memory. How will Lab 9 save to a <b>file</b>?"</p>
<p style="margin:0">3. "Students and staff do not pay the same late fee."</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 163/163</b>`,
      `${c('lint.py')}: <b>✓ sạch</b> (the starter has 1 violation)`,
      `${c('new LibraryItem(…)')} anywhere ⇒ <b>javac error</b>`,
      `the controller field is the <b>interface</b> ${c('BookRepository')}`,
      'a 3rd fee policy = <b>one new class</b>',
    ]))), giua: true },

  /* 3 */
  { t: 'What was wrong with Lab 4\'s parent class', body: tbl(['Lab 4 · LibraryItem answers', 'Value', 'Means'], [
    [c('getTypeName()'), '"Tai lieu"', 'a type that does not exist'],
    [c('getIdPrefix()'), '"I"', 'an id like I005 — never planned'],
    [c('getLoanDays()') + ' · ' + c('getLateFeePerDay()'), '0 · 0', 'late from day 1, yet free'],
    [c('getDetail()') + ' · ' + c('getUniqueKey()'), '"" · the id', 'nothing to show, nothing to compare'],
  ]) + two(
    box('The real danger', `<p style="margin:0">A subclass that <b>forgets</b> an override still compiles and silently returns these values — the AudioBook trap of Lab 4, now inside the model.</p>`, 'do2'),
    box('abstract fixes both', `<p style="margin:0">No object of a "generic item" can exist, and every subclass <b>must</b> implement the six methods — or javac refuses.</p>`, 'ok')), giua: true },

  /* 4 */
  { t: 'TODO 5.1 — abstract LibraryItem', body:
    j([tep(`${S}/model/LibraryItem.java`, [11, 11]), '    // 4 private fields: id, title, year, copies (unchanged) ...', boChuThich(tep(`${S}/model/LibraryItem.java`, [25, 31])), '    // getters / setters (unchanged) ...',
      boChuThich(tep(`${S}/model/LibraryItem.java`, [73, 90]))].join('\n')) +
    two(box('Still a constructor', `<p style="margin:0">An abstract class cannot be <b>instantiated</b>, but it still <b>has</b> a constructor: ${c('Book')} calls it through ${c('super(...)')}. ${c('protected')}: only children use it.</p>`, 'lam'),
      box('lint.py agrees', `<p style="margin:0">The starter's concrete ${c('LibraryItem')} has no empty public constructor ⇒ ${c('[JAVABEAN]')}. An <b>abstract</b> model class is exempt: TODO 5.1 makes lint silent.</p>`, 'ok')) },

  /* 5 */
  { t: 'What javac now refuses — three real errors', body: psql(ra('lab5/bay/truu-tuong:javac'), { title: 'javac --release 8 — bay/truu-tuong (three mistakes planted in the solution)', sm: true }).replace('<pre>', '<pre style="white-space:pre-wrap">') +
    tbl(['Mistake', 'javac says'], [
      [`${c('Dvd')} forgot ${c('getUniqueKey()')}`, `"Dvd is not abstract and does not override abstract method …"`],
      [`${c('InMemoryBookRepository')} forgot ${c('countItems()')}`, `"… does not override abstract method countItems() in BookRepository"`],
      [`${c('default: return new LibraryItem(...)')}`, `"LibraryItem is abstract; cannot be instantiated"`],
    ]) },

  /* 6 */
  { t: 'Abstract class or interface? (Chapter 5)', body: tbl(['', 'abstract class LibraryItem', 'interface BookRepository / FeePolicy'], [
    ['Is a…', 'parent of a family (<b>is-a</b>)', 'a <b>contract</b>: "can do"'],
    ['Fields', 'yes — private id, title, year, copies', 'only constants (public static final)'],
    ['Constructor', 'yes (called by super)', 'no'],
    ['Method bodies', 'yes + abstract methods', 'abstract (Java 8: default/static possible)'],
    ['How many per class', 'extends ONE', 'implements MANY'],
    ['In CT Library', 'Book, Magazine, Dvd share code', 'swap the storage / the fee rule'],
  ]) + box('One sentence', `<p style="margin:0">Use an <b>abstract class</b> to share code inside one family; use an <b>interface</b> when unrelated classes must be interchangeable behind one name.</p>`, 'lam'), giua: true },

  /* 7 */
  { t: 'The seam — the controller talks to a contract', body: soDoLop([
    { id: 'M', ten: 'Main', x: 0, y: 30, w: 150, mau: PG, pt: ['+ main(...)'] },
    { id: 'C', ten: 'BookController', x: 205, y: 20, w: 400, mau: NAU, tr: ['- bookRepository: BookRepository', '- bookService: BookService'] },
    { id: 'R', ten: 'BookRepository', kieu: 'interface', x: 690, y: 0, w: 420, mau: XANH, pt: ['addItem · updateCopies · deleteItem', 'findById · countItems · findAll · …'] },
    { id: 'I', ten: 'InMemoryBookRepository', x: 560, y: 300, w: 300, mau: XANH, hl: true, nho: 'Lab 5 · ArrayList<LibraryItem>' },
    { id: 'F', ten: 'FileBookRepository', x: 875, y: 300, w: 235, mau: XAM, nho: 'Lab 9 · books.csv' },
    { id: 'S', ten: 'BookService', x: 240, y: 300, w: 300, mau: CAM, tr: ['- feePolicyList'], nho: 'no repository' },
  ], [
    { tu: 'M', den: 'C', kieu: 'dung' },
    { tu: 'C', den: 'R', kieu: 'dung', nhan: 'CRUD', dy: -8 },
    { tu: 'I', den: 'R', kieu: 'cai', x1: 710, x2: 780, nhan: 'implements', dx: 10 },
    { tu: 'F', den: 'R', kieu: 'cai', x1: 992, x2: 992 },
    { tu: 'C', den: 'S', kieu: 'dung', x1: 400, x2: 390, nhan: 'data in, result out', dx: 10 },
  ], { h: 440 }) + `<div class="nho" style="text-align:center">Only ONE line in the controller's constructor names ${c('InMemoryBookRepository')}. Lab 9 changes that line — ${c('Main')} does not change at all.</div>` },

  /* 8 */
  { t: 'TODO 5.2 — the contract and its first implementation', body:
    j(boChuThich(tep(`${S}/repository/BookRepository.java`, [16, 38]))) +
    j([tep(`${S}/repository/InMemoryBookRepository.java`, [21, 21]), tep(`${S}/repository/InMemoryBookRepository.java`, [24, 24]),
      tep(`${S}/repository/InMemoryBookRepository.java`, [27, 27]), tep(`${S}/repository/InMemoryBookRepository.java`, [103, 106]),
      '    // ... 6 more @Override methods (the Lab 4 code)'].join('\n')) +
    box('', `<p style="margin:0">Interface methods are <b>public abstract</b> without saying it. The Lab 4 class body moves over unchanged — it just signs the contract.</p>`, 'lam') },

  /* 9 */
  { t: 'TODO 5.3 — one line knows where the books live', body: two(
    j(['// controller/BookController.java', de(tep(`${S}/controller/BookController.java`, [27, 27])), '', de(boChuThich(tep(`${S}/controller/BookController.java`, [42, 45]))), '    // ...'].join('\n')),
    col(psql(raJava('lab5/LabDoiKho'), { title: 'real output — LabDoiKho: same client code, two repositories' }),
      box('Lab 9 preview', `<p style="margin:0">${c('new FileBookRepository()')} in that one line ⇒ books saved to ${c('books.csv')}; ${c('addItem')}, ${c('findAll')}… calls stay word for word.</p>`, 'ok'))) +
    box('Why it compiles', `<p style="margin:0">A class that ${c('implements BookRepository')} <b>is-a</b> ${c('BookRepository')}: the assignment is an upcast, like ${c('LibraryItem item = new Dvd()')} in Lab 4.</p>`, 'lam') },

  /* 10 */
  { t: 'FeePolicy — the Strategy pattern in one interface', body: two(
    soDoLop([
      { id: 'B', ten: 'BookService', x: 0, y: 0, w: 520, mau: CAM, tr: ['- feePolicyList: ArrayList<FeePolicy>'], pt: ['+ calculateLateFee(item, dto)'] },
      { id: 'F', ten: 'FeePolicy', kieu: 'interface', x: 70, y: 180, w: 380, mau: TIM, pt: ['getPolicyName(): String', 'calculateFee(daysLate, feePerDay)'] },
      { id: 'S', ten: 'StudentFeePolicy', x: 0, y: 380, w: 250, mau: TIM, nho: '− 50%' },
      { id: 'T', ten: 'StaffFeePolicy', x: 270, y: 380, w: 250, mau: TIM, nho: 'first 2 late days free' },
    ], [
      { tu: 'B', den: 'F', kieu: 'dung', nhan: 'holds a list of', dx: 10 },
      { tu: 'S', den: 'F', kieu: 'cai', x2: 200 }, { tu: 'T', den: 'F', kieu: 'cai', x2: 320 },
    ], { w: 530, h: 470 }),
    col(j(de(boChuThich(tep(`${S}/service/BookService.java`, [24, 29])))),
      box('Strategy (Behavioral)', `<p style="margin:0"><b>Problem:</b> one fee rule per borrower. <b>Solution:</b> each rule is a class behind ${c('FeePolicy')}. <b>Consequence:</b> a new borrower type = a new class + one line, no ${c('if')} in the formula.</p>`, 'ok'))) },

  /* 11 */
  { t: 'TODO 5.4 and 5.5 — two bodies, two rules', body:
    j(de(boChuThich(tep(`${S}/service/StudentFeePolicy.java`, [24, 31])))) +
    j(de(boChuThich(tep(`${S}/service/StaffFeePolicy.java`, [24, 30])))) +
    psql(boNhac([R(32, 33), R(46, 47), R(60, 61)].join('\n')), { title: 'real output — option 9 (prompts trimmed)', sm: true }) +
    box('', `<p style="margin:0">Multiply first: ${c('fullFee * 50 / 100')}, never ${c('fullFee * (50 / 100)')} — integer ${c('50 / 100')} is <b>0</b>.</p>`, 'lam') },

  /* 12 */
  { t: 'One request through the layers: "9 — late fee"', body: luong([
    ['Main', 'reads id, days,\nborrower type\n(utils checks)', PG],
    ['BookController', 'bookRepository\n.findById(id)\n(the interface)', NAU],
    ['InMemory…', 'finds the item,\nreturns a COPY\n(polymorphic DTO)', XANH],
    ['BookService', 'daysLate, picks\nthe FeePolicy\nof the borrower', CAM],
    ['FeePolicy', 'calculateFee\nStudent / Staff', TIM],
    ['LateFeeView', 'display()\n2 lines', PG],
  ], { h: 240, fs: 16 }) + psql(boNhac(R(102, 103)), { title: 'real output — D007, 9 days, staff', sm: true }) +
    box('', `<p style="margin:0">Two interfaces on the path: the controller does not know <b>where</b> the item is stored, the service does not know <b>which</b> fee rule it runs.</p>`, 'lam'), giua: true },

  /* 13 */
  { t: 'Trap: a "field" in an interface is a constant', body: two(
    j(['// repository/BookRepository.java (bay/hang-interface)', tep('lab5/bay/hang-interface/src/repository/BookRepository.java', [16, 19]), '    // ...', '}', '',
      '// InMemoryBookRepository constructor', de(tep('lab5/bay/hang-interface/src/repository/InMemoryBookRepository.java', [30, 34]))].join('\n')),
    col(psql(ra('lab5/bay/hang-interface:javac'), { title: 'javac (JDK 21, --release 8) — bay/hang-interface', sm: true }).replace('<pre>', '<pre style="white-space:pre-wrap">'),
      box('', `<p style="margin:0">Every variable in an interface is <b>public static final</b>. JDK 8's javac words it ${c('cannot assign a value to final variable MAX_ITEMS')}. Numbers belong in ${c('Constants')}.</p>`, 'do2'))) },

  /* 14 */
  { t: 'Anonymous classes — you have used one since Lab 1', body:
    j(de(boChuThich(tep(`${S}/service/BookService.java`, [36, 50])))) + two(
      psql(raJava('lab5/LabChinhSach'), { title: 'real output — LabChinhSach: 3 policies, the 3rd anonymous' }),
      box('', `<p style="margin:0">${c('new Comparator<…>() { … }')} = a class with <b>no name</b> that implements the interface on the spot. javac still writes a class file: ${c('BookService$1.class')}, like ${c('LabChinhSach$1')} here.</p>`, 'lam')) },

  /* 15 */
  { t: 'Green: PASS 163/163 and a silent reviewer', body: two(
    col(psql(ra('lab5/solution:check'), { title: './check.sh' }), psql(ra('lab5/solution:lint'), { title: 'python3 lint.py — solution' }),
      psql(ra('lab5/starter:lint'), { title: 'python3 lint.py — the starter (before TODO 5.1)', sm: true }).replace('<pre>', '<pre style="white-space:pre-wrap">')),
    col(box('The order that works', `<p style="margin:0">5.1 ${c('abstract')} ⇒ lint silent · 5.2 ${c('implements')} + 7 ${c('@Override')} · 5.3 interface field ⇒ still compiles · 5.4 + 5.5 ⇒ ${c('check.sh')} green.</p>`, 'ok'),
      box('Only two TODOs change the output', `<p style="margin:0">5.1–5.3 are <b>design</b>: same output, better code. The reviewer (and the rubric) checks them with javac and by reading — like LAB211.</p>`, 'lam'))), giua: true },

  /* 16 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      [`${c('abstract')} LibraryItem, 6 abstract methods (5.1)`, '2'],
      [`${c('implements BookRepository')} + ${c('@Override')} (5.2)`, '2'],
      ['Controller field typed by the interface (5.3)', '1'],
      ['Student and staff fee rules (5.4, 5.5)', '3'],
      [`${c('lint.py')} ✓ sạch`, '1'],
      ['Oral: "abstract class vs interface?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Can an abstract class have a constructor? Who calls it?<br>2. Which single line changes when Lab 9 saves to a file?<br>3. Why ${c('fullFee * 50 / 100')} and not ${c('fullFee * (50 / 100)')}?</p>`, 'lam'),
      box('Next: Lab 6', `<p style="margin:0">Borrowing for real — and when it fails: checked exceptions like ${c('BookNotAvailableException')}, thrown in the right layer, caught in the right layer.</p>`, 'ok'))), giua: true },
]);
