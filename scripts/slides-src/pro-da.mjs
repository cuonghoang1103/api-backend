/**
 * pro-da — PRO192 · 🏁 Dự án cuối khoá "CT Library 1.0" (slide EN, khuôn _pro-chung, agent pro-da 27/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/da (đáp án: lint.py LAB211 sạch, javac --release 8, JDK 8 thật trùng,
 * check.sh PASS 557/557 qua HAI lần chạy; starter = 8 TODO DA.x — phần chấm điểm, deck CHỈ hiện phần cho sẵn / làm mẫu) và dữ liệu
 * tất định gen/lab/da/solution/harness/data/*.csv (sinh-du-lieu.mjs, hạt giống 192).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-da.mjs --out <dir>   ⇒ <dir>/da/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, esc } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, soDoLop, tangLab, boc, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'da', code: 'PRO192 Final project', title: 'Final project — CT Library 1.0', sub: 'nine labs become one app' };

const S = 'da/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const NHAC = /^(?:Lua chon: |Tu khoa: |Ma thanh vien \(vi du M001\): |Ma tai lieu \(vi du B001, T151, D181\): |So tien nop \(dong, vi du 20000\): )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('da/solution:run', [a, b]));
const P = (t, o) => psql(t, o);
const csv = (f, a, b) => tep(`da/solution/harness/data/${f}`, [a, b]).replace(/﻿/g, '⟨BOM⟩');
/** Tìm dòng output theo chữ (để không đếm tay số dòng) */
const dong = (re, n = 1) => { const l = ra('da/solution:run').split('\n'); const i = l.findIndex((x) => re.test(x)); if (i < 0) throw new Error(`pro-da: không thấy ${re}`); return boNhac(l.slice(i, i + n).join('\n')); };

/** borrowItem rút gọn để vừa slide: bỏ chú thích, thay đối số câu báo bằng "…" (mã thật: LoanController.java) */
const BORROW = (() => {
  const l = boChuThich(ham(`${S}/controller/LoanController.java`, 'borrowItem')).split('\n');
  const i = l.findIndex((x) => /SUCCESS_BORROW/.test(x));
  let k = i; while (!/;\s*$/.test(l[k])) k++;
  return [...l.slice(0, i), '            loanView.showMessage(String.format(Message.SUCCESS_BORROW, loanId, …));', ...l.slice(k + 1)].join('\n');
})();
/** n dòng output bắt đầu từ dòng khớp re (bỏ chữ nhắc), cắt mỗi dòng còn w ký tự */
const TU = (re, n) => dong(re, n).replace(/^-+ | -+$/gm, '');
const CAT = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
/** bảng quá hạn: bỏ cột họ tên + tên tài liệu (vị trí cột theo OVERDUE_ROW_FORMAT) để vừa nửa slide */
const COT = (t) => t.split('\n').map((l, i) => (i === 0 ? l : (l.slice(0, 17) + l.slice(36, 42) + l.slice(67)).trimEnd())).join('\n');
const NHO = (h) => h.replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:13.5px;line-height:1.36">');

export const slides = lamDeck({ chuong: 'Final project · CT Library 1.0', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Final project —<br>CT Library 1.0', sub: 'Nine labs become one app: three CSV files, loan rules, late fees, a locked card, three reports — then a 90-minute timed paper' },

  /* 2 */
  { t: 'The brief from the reading club', body: two(
    box('The club wrote', `<p style="margin:0 0 6px">"We have <b>200 items</b>, <b>300 members</b> and a year of loans in Excel."</p>
<p style="margin:0 0 6px">Students borrow <b>3</b>, staff <b>5</b>. Books 14 days, magazines 7, DVDs 3. Late means a <b>fine per day</b>.</p>
<p style="margin:0 0 6px">Owe more than <b>50,000đ</b> ⇒ no more loans until you pay.</p>
<p style="margin:0">Every month: <b>what is popular, who is late, how much we collected</b>.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 557/557</b> — run, then <b>reopen</b>`,
      `${c('lint.py')}: <b>✓ clean</b> · ${c('javac --release 8')}`,
      'all 8 TODO DA.x done, nothing given rewritten',
      '3 broken lines reported, <b>never</b> a crash',
      '≥ 10 meaningful commits in Git',
    ]))), giua: true },

  /* 3 */
  { t: 'User stories — who needs what', body: tbl(['As a…', 'I want to…', 'so that…'], [
    ['librarian', 'find an item by part of its title', 'I can tell a member at once if it is on the shelf'],
    ['librarian', 'lend an item in one step (member id + item id)', 'the rules are checked for me, not by memory'],
    ['librarian', 'take a return and see the fine immediately', 'the member pays at the desk'],
    ['librarian', 'take a payment that unlocks the card', 'a member can borrow again the same day'],
    ['member', 'see my loans, due dates and debt on my card', 'I know what to bring back first'],
    ['club leader', 'see top items, overdue loans, fines per month', 'we buy the right books and chase late ones'],
    ['club leader', 'keep the data when the laptop is closed', 'nothing typed on Saturday is lost on Monday'],
  ]) },

  /* 4 */
  { t: 'Business rules — one place each', body: tbl(['Rule', 'Value', 'Lives in'], [
    ['max items on loan at once', 'Student 3 · Staff 5', `${c('getMaxLoans()')} of each Member subclass`],
    ['loan period', 'Book 14 · Magazine 7 · DVD 3 days', `${c('getLoanDays()')} of each LibraryItem subclass`],
    ['fine per late day', 'Book 2,000 · Magazine 1,000 · DVD 5,000đ', `${c('getLateFeePerDay()')} of each item`],
    ['fee policy', 'Student −50% · Staff: first 2 late days free', `${c('IFeePolicy')} (Strategy)`],
    ['card lock', 'debt <b>&gt;</b> 50,000đ ⇒ no new loan', `${c('LoanService.isLocked')}`],
    ['order of checks', 'locked → limit → no copy left', `${c('LoanService.createLoan')}`],
    ['fine is computed', 'once, at return, then stored', `${c('loans.csv')} column ${c('tien_phat')}`],
  ]) + `<div class="cap">every number above is a constant in Constants.java — "no hard-coding" is a rule of the review</div>` },

  /* 5 */
  { t: 'The fine: type of item × type of card', body: two(
    col(tbl(['Item', 'Days', 'Fee / late day'], [['Book', '14', '2,000đ'], ['Magazine', '7', '1,000đ'], ['DVD', '3', '5,000đ']]),
      tbl(['Card', 'Policy'], [['Student', 'days late × fee × 50%'], ['Staff', '(days late − 2) × fee, never below 0']])),
    col(box('Worked examples (real runs)', `<p style="margin:0 0 8px">${esc(dong(/Tra thanh cong L1811/)).replace(/\| /g, '<br>| ')}</p><p style="margin:0">${esc(dong(/Tra thanh cong L1832/)).replace(/\| /g, '<br>| ')}</p>`, 'xanh'),
      box('Why two hierarchies?', '<p style="margin:0">Days and fee belong to the <b>item</b> (polymorphism, no <code>if</code>). The discount belongs to the <b>card</b> and may change next year — a Strategy you swap without touching the items.</p>', 'lam')), 'r46') },

  /* 6 */
  { t: 'Borrowing: three rules, checked in order', body: luong([
    ['locked?', 'debt > 50,000đ\n⇒ MemberLockedException', DO],
    ['limit?', 'open loans ≥ max\n⇒ LoanLimitException', CAM],
    ['copy?', 'copies ≤ 0\n⇒ ItemNotAvailableException', TIM],
    ['loan', 'due = today + loan days\nrepository gives the id', XANH],
  ], { h: 190 }) + P([dong(/The cua M014 dang bi KHOA/), dong(/M060 dang muon 3\/3/), dong(/Tai lieu B001/), dong(/Muon thanh cong L2001/)].join('\n'), { title: 'real output — one line per rule' }) },

  /* 7 */
  { t: 'Sample data: deterministic, with one trap per file', body:
    P(csv('books.csv', 1, 3), { title: 'data/books.csv — 200 items (150 books, 30 magazines, 20 DVDs), UTF-8 with a BOM' }) +
    P(csv('members.csv', 1, 3), { title: 'data/members.csv — 300 members (1 = student, 2 = staff), last column = debt' }) +
    P(csv('loans.csv', 1, 3), { title: 'data/loans.csv — 2,000 loans, empty return date = still out' }) +
    box('Generated, not typed', `<p style="margin:0">${c('sinh-du-lieu.mjs')}, seed <b>192</b>: re-run ⇒ the same bytes. It simulates January → October 2026 with the <b>same rules</b> (limits, lock, fines, payments). Each file hides <b>one broken line</b>: a wrong ISBN check digit, an e-mail without a domain, 30 February.</p>`, 'lam') },

  /* 8 */
  { t: 'Architecture — the lecturer\'s layers', body: tangLab({ hl: ['controller', 'service'], h: 390, ten: { controller: 'LoanController', repository: 'ILoanRepository', service: 'LoanService', view: 'LoanView', model: 'Loan · Member', dto: 'LoanRequestDTO · LoanRecordDTO · MemberResponseDTO', constants: 'Message · Constants' } }) + `<div class="cap">controller HOLDS the repositories and does the CRUD · service only checks rules on the data it is given · Main never sees a repository</div>` },

  /* 9 */
  { t: 'Class diagram — the core', body: soDoLop([
    { id: 'LI', ten: 'LibraryItem', kieu: 'abstract', x: 0, y: 0, w: 300, pt: ['abstract getLoanDays(): int', 'abstract getLateFeePerDay()'], mau: XANH },
    { id: 'BK', ten: 'Book · Magazine · Dvd', x: 0, y: 200, w: 300, nho: '14 / 7 / 3 days · 2,000 / 1,000 / 5,000đ', mau: XANH },
    { id: 'ME', ten: 'Member', kieu: 'abstract', x: 320, y: 0, w: 350, tr: ['- debt: int'], pt: ['abstract getMaxLoans(): int'], mau: PG },
    { id: 'SM', ten: 'StudentMember · StaffMember', x: 320, y: 220, w: 350, nho: 'max 3 / max 5 items', mau: PG },
    { id: 'FP', ten: 'IFeePolicy', kieu: 'interface', x: 690, y: 0, w: 420, pt: ['calculateFee(daysLate, feePerDay)'], mau: CAM },
    { id: 'PO', ten: 'StudentFee… · StaffFeePolicy', x: 690, y: 200, w: 420, nho: '−50% · first 2 late days free', mau: CAM },
    { id: 'LS', ten: 'LoanService', x: 690, y: 340, w: 420, tr: ['- feePolicyMap: HashMap<Integer, …>', '- workingDate: LocalDate'], mau: NAU, hl: true },
  ], [
    { tu: 'BK', den: 'LI', kieu: 'ke' }, { tu: 'SM', den: 'ME', kieu: 'ke' }, { tu: 'PO', den: 'FP', kieu: 'cai' }, { tu: 'LS', den: 'PO', kieu: 'dung', nhan: 'has 2' },
  ], { h: 480, fs: 15 }) },

  /* 10 */
  { t: 'Three repositories, one way of saving', body: two(
    col(soDoLop([
      { id: 'I', ten: 'I…Repository × 3', kieu: 'interface', x: 60, y: 0, w: 420, nho: 'IBookRepository · IMemberRepository · ILoanRepository', mau: XANH },
      { id: 'F', ten: 'File…Repository × 3', x: 60, y: 150, w: 420, nho: 'FileBook… · FileMember… · FileLoanRepository', mau: XANH, hl: true },
      { id: 'C', ten: 'CsvUtils', x: 60, y: 300, w: 420, pt: ['readRows(path, errorList)', 'writeRows(path, header, lineList)', 'backupFile(path)'], mau: TIM },
    ], [{ tu: 'F', den: 'I', kieu: 'cai' }, { tu: 'F', den: 'C', kieu: 'dung', nhan: 'every load / save' }], { w: 540, h: 450, fs: 15 })),
    col(box('Load', '<p style="margin:0">UTF-8 named · BOM removed · header and blank lines skipped · each row through the <b>same Validation</b> as the keyboard · a broken row is one message with its line number</p>', 'xanh'),
      box('Save — after every change', '<p style="margin:0">write <code>.tmp</code> → <code>checkError()</code> → <code>Files.move</code>. A crash in the middle leaves the old file whole. First save after a broken row keeps <code>.bak</code>.</p>', 'lam'),
      box('Given in the starter', '<p style="margin:0"><b>FileLoanRepository</b> is the full model. <b>FileMemberRepository</b> load/save are TODO DA.4–DA.5: same pattern.</p>', ''))) },

  /* 11 */
  { t: 'One borrow, through the layers (given)', body: luong([
    ['Main', 'reads M027, B002\n⇒ LoanRequestDTO', PG],
    ['LoanController', 'member + item\nfrom repositories', NAU],
    ['LoanService', 'checks 3 rules\nbuilds the loan', CAM],
    ['repositories', 'addLoan, then\ncopies − 1', XANH],
    ['LoanView', 'prints one line', PG],
  ], { h: 175, fs: 17 }) + j(BORROW, { hl: [5, 6, 7] }) + `<div class="cap">(shortened: comments hidden, the message arguments cut) — addLoan BEFORE updateCopies: a refused loan never takes a copy off the shelf</div>` },

  /* 12 */
  { t: 'LoanService.createLoan — the worked sample', body: NHO(j(boChuThich(ham(`${S}/service/LoanService.java`, 'createLoan')), { hl: [3, 8, 12] })) + `<div class="cap">(comments hidden) — the service THROWS, never prints and never catches; the controller catches LibraryException once</div>` },

  /* 13 */
  { t: 'Fee policies — Strategy in a HashMap', body: two(
    NHO(j(boc(boChuThich(ham(`${S}/service/LoanService.java`, 'LoanService')) + '\n\n' + boChuThich(ham(`${S}/service/LoanService.java`, 'findPolicy')), 58), { hl: [3, 4, 5, 6] })),
    NHO(j(boc('// StudentFeePolicy\n' + boChuThich(ham(`${S}/service/StudentFeePolicy.java`, 'calculateFee')) + '\n\n// StaffFeePolicy\n' + boChuThich(ham(`${S}/service/StaffFeePolicy.java`, 'calculateFee')), 58)))) +
    two(box('Add a "Guest" card next year', `<p style="margin:0">1 class ${c('GuestFeePolicy implements IFeePolicy')} + 1 ${c('put')} line. No formula that already works is touched — <b>open for extension, closed for modification</b>.</p>`, 'xanh'),
      box('Stored, not recomputed', '<p style="margin:0">The fine is written into <code>loans.csv</code> at return. Change the policy tomorrow and last month\'s revenue does not move.</p>', 'lam')) },

  /* 14 */
  { t: 'Three reports, from one bundle of data', body: two(
    col(P(CAT(TU(/Top 10 tai lieu/, 7), 70), { title: 'menu 8 — top items (first 5 of 10)', sm: true }),
      P(COT(TU(/qua han tinh den 15\/10/, 6)), { title: 'menu 9 — overdue on 15/10/2026 (first rows; name and title columns hidden)', sm: true })),
    col(P(CAT(TU(/Doanh thu phat theo thang/, 13), 50), { title: 'menu 10 — fines per month', sm: true }),
      box('', `<p style="margin:0">${c('LibraryDataDTO')}: the controller copies the 3 repositories into ONE bundle; ${c('ReportService')} counts with ${c('HashMap')} and groups months with ${c('TreeMap<YearMonth, …>')}.</p>`, 'lam')), 'r64') },

  /* 15 */
  { t: 'The grader: run, reopen, compare 557 lines', body: two(
    col(P(['$ ./check.sh   # the solution', ...ra('da/solution:check').split('\n').slice(-1)].join('\n'), { title: 'terminal' }),
      P(['$ ./check.sh   # the starter, before the TODOs', ...ra('da/starter:check').split('\n').slice(-1).map((l) => l.replace(/ Mo harness.*$/, '').replace(' (expected', '\n(expected'))].join('\n'), { title: 'terminal' }),
      P(ra('da/starter:lint'), { title: 'lint.py — the starter is already clean' })),
    col(`<div class="tcap">TODO DA.1–DA.8 (the graded part)</div>`, steps([
      `${c('LoanService.closeLoan')} · ${c('payFine')}`,
      `${c('LoanController.returnItem')}`,
      `${c('FileMemberRepository')} load + save`,
      `${c('ReportService')}: top · overdue · revenue`,
    ]), box('', '<p style="margin:0">Run 2 reads the files run 1 wrote: if saving is wrong, the second half is red.</p>', 'xanh'))), giua: true },

  /* 16 */
  { t: 'Rubric — 100 points', body: tbl(['Part', 'Points', 'What earns them'], [
    ['Functions', '<b>50</b>', 'grader PASS (30) · borrow/return/pay by hand on your own data (10) · 3 reports correct (10)'],
    ['OOP & design', '<b>25</b>', 'layers as the lecturer wants (8) · polymorphism, no type-ifs (7) · Strategy + interfaces (5) · JavaBean, encapsulation (5)'],
    ['Exceptions & files', '<b>15</b>', 'checked LibraryException family, caught once (5) · broken lines reported, never a crash (5) · UTF-8, temp file, .bak (5)'],
    ['Clean code & Git', '<b>10</b>', 'lint.py clean, javac --release 8 (5) · ≥ 10 commits with clear messages, no data/ build/ in Git (5)'],
  ], {}) + `<div class="cap">oral check: "why does the controller, not the service, hold the repositories?" · "what changes when we move to PostgreSQL?"</div>` },

  /* 17 */
  { t: 'Then: the 90-minute timed paper', body: two(
    tbl(['Q', 'Marks', 'Task', 'Minutes'], [
      ['1', '2', 'Book + SpecBook (private fields, setData, getValue)', '15'],
      ['2', '3', 'LoanList extends ArrayList&lt;Loan&gt;: count, most late, remove by member', '25'],
      ['3', '2', 'MyCode implements the given ICode: item codes', '20'],
      ['4', '3', 'CommandProcessor: read a command file, write results', '30'],
    ]),
    col(box('Exam room', '<p style="margin:0"><b>PRO192-DA1</b> — PE style, real given NetBeans projects with a compiled harness.<br><b>PRO192-DA-FE1</b> — 50 questions over 9 chapters, every code question run for real.</p>', 'lam'),
      box('', '<p style="margin:0">Same domain, new code, under time: the proof that the design is in your hands, not in the starter.</p>', 'xanh'))), giua: true },

  /* 18 */
  { t: 'The next legs keep the same interfaces', body: two(
    col(box('PostgreSQL (course + LAB211)', `<p style="margin:0">${c('JdbcBookRepository implements IBookRepository')} — ${c('PreparedStatement')}, a transaction around "add loan + copies − 1". AppController changes <b>three</b> ${c('new')} lines.</p>`, 'lam'),
      box('CSD201', `<p style="margin:0">${c('MyHashMap')} replaces the index, ${c('MyLinkedList')} the loan history, a ${c('BST')} the title search — behind the same repository contract.</p>`, 'xanh')),
    col(box('Spring Boot', `<p style="margin:0">AppController ⇒ the Spring container · constructor injection ⇒ ${c('@Autowired')} · ${c('ILoanRepository')} ⇒ ${c('JpaRepository')} · checked exceptions ⇒ ${c('@ControllerAdvice')}.</p>`, ''),
      box('', '<p style="margin:0">If CT Library 1.0 is clean, each leg is a swap — not a rewrite.</p>', 'xanh'))), giua: true },
]);
