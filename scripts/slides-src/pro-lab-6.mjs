/**
 * pro-lab-6 — PRO192 · Lab 6 · CT Library "Business exceptions, borrowing and returning" (slide EN, khuôn _pro-chung, agent pro-lab67 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab6 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 233/233; starter = 5 TODO; bay/nuot-loi = catch rỗng (bộ chấm đỏ), bay/bat-sai = 3 lỗi javac thật, bay/thieu-ctor = 2 lỗi)
 * và gen/java/lab6/*.java (chạy thật, JDK 8 thật trùng).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-6.mjs --out <dir>   ⇒ <dir>/lab6/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, soDoLop, luong, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab6', code: 'PRO192 Lab 6', title: 'Lab 6 — CT Library: business exceptions, borrowing and returning', sub: 'exceptions/ package · throw in repository/service, catch in controller · InvalidInputException · try-with-resources' };

const S = 'lab6/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const NHAC = /^(?:Lua chon: |Ma thanh vien \(vi du M001\): |Ma tai lieu \(vi du B001, T005, D006\): )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('lab6/solution:run', [a, b]));
const ST = (a, b) => boNhac(ra('lab6/starter:run', [a, b]));
const wrap = (h) => h.replace('<pre>', '<pre style="white-space:pre-wrap">');
const P = (t, o) => wrap(psql(t, o));
// bỏ chú thích cuối dòng (giữ dòng chú thích riêng) — mã trên slide gọn, không tràn mép
const gon = (src) => src.split('\n').map((l) => (/^\s*\/\//.test(l) ? l : l.replace(/\s+\/\/.*$/, ''))).join('\n');

export const slides = lamDeck({ chuong: 'Lab 6 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 6 — CT Library:<br>exceptions, borrow, return', sub: 'After Chapter 6 · borrow (10) and return (11) · a named exception for every way they fail · throw where you find it, catch where you can answer it' },

  /* 2 */
  { t: 'Ticket CTL-6 — borrowing for real, and every way it fails', body: two(
    box('The team lead wrote', `<p style="margin:0 0 6px">"A member holds at most <b>3</b> items. Nobody borrows an item with <b>0 copies</b>. Returning what you did not borrow is <b>refused</b>."</p>
<p style="margin:0 0 6px">"When it fails, say <b>exactly why</b>, in Vietnamese, with the wrong code."</p>
<p style="margin:0">"No ${c('throw new Exception')}, no empty ${c('catch')} in review again."</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 233/233</b> — 11 wrong inputs, 11 exact messages`,
      'the menu <b>never crashes</b> and never goes quiet',
      `${c('lint.py')}: <b>✓ sạch</b>`,
      `zero ${c('throws Exception')}, zero ${c('catch (Exception e)')}`,
      'for each exception: <b>who throws, who catches</b>',
    ]))), giua: true },

  /* 3 */
  { t: 'What was wrong with Lab 5\'s exceptions', body: vsd(
    j(['// Lab 5 — IBookRepository / InMemoryBookRepository', 'BookResponseDTO findById(String id) throws Exception;', '', 'throw new Exception(String.format(', '        Message.ERROR_ITEM_NOT_FOUND, id));', '', '// Lab 5 — BookController', '} catch (Exception e) {', '    resultMessage = e.getMessage();', '}'].join('\n')),
    j(['// Lab 6 — the signature says WHAT can fail', 'BookResponseDTO findById(String id)', '        throws ItemNotFoundException;', '', 'throw new ItemNotFoundException(String.format(', '        Message.ERROR_ITEM_NOT_FOUND, id));', '', '// Lab 6 — catch exactly that', '} catch (ItemNotFoundException e) {', '    resultMessage = e.getMessage();', '}'].join('\n')),
    '✗ Lab 5: one class for everything', '✓ Lab 6: a name for each failure') +
    box('', `<p style="margin:0">${c('catch (Exception e)')} also swallows the bugs you <b>want</b> to see: a ${c('NullPointerException')} becomes a polite message and nobody fixes it.</p>`, 'do2') },

  /* 4 */
  { t: 'The exception family of CT Library', body: soDoLop([
    { id: 'E', ten: 'Exception', x: 400, y: 0, w: 300, mau: XAM, nho: 'java.lang · checked' },
    { id: 'RT', ten: 'RuntimeException', x: 0, y: 0, w: 300, mau: XAM, nho: 'unchecked' },
    { id: 'IA', ten: 'IllegalArgumentException', x: 0, y: 130, w: 300, mau: XAM, nho: 'a BUG — never caught' },
    { id: 'L', ten: 'LibraryException', kieu: 'abstract', x: 400, y: 130, w: 300, mau: NAU, hl: true, nho: 'caught by the controller' },
    { id: 'V', ten: 'InvalidInputException', x: 790, y: 130, w: 320, mau: TIM, nho: 'utils → Main asks again' },
    { id: 'A', ten: 'ItemNotFoundException', x: 0, y: 290, w: 360, mau: NAU },
    { id: 'B', ten: 'DuplicateKeyException', x: 375, y: 290, w: 360, mau: NAU },
    { id: 'C', ten: 'MemberNotFoundException', x: 750, y: 290, w: 360, mau: NAU },
    { id: 'D', ten: 'ItemNotAvailableException', x: 0, y: 380, w: 360, mau: CAM },
    { id: 'F', ten: 'LoanLimitException', x: 375, y: 380, w: 360, mau: CAM },
    { id: 'G', ten: 'LoanNotFoundException', x: 750, y: 380, w: 360, mau: NAU },
  ], [
    { tu: 'RT', den: 'E', kieu: 'ke' }, { tu: 'IA', den: 'RT', kieu: 'ke' },
    { tu: 'L', den: 'E', kieu: 'ke' }, { tu: 'V', den: 'E', kieu: 'ke', x1: 900, x2: 640 },
    { tu: 'A', den: 'L', kieu: 'ke', x2: 470 }, { tu: 'B', den: 'L', kieu: 'ke' }, { tu: 'C', den: 'L', kieu: 'ke', x2: 630 },
  ], { h: 440, fs: 16 }) + `<div class="nho" style="text-align:center">Package <b>exceptions/</b> · every name ends with <b>Exception</b> (checklist 1.3) · brown = thrown by a repository, orange = thrown by the service · all six extend <b>LibraryException</b></div>` },

  /* 5 */
  { t: 'Checked or unchecked? Ask who can fix it', body: tbl(['Situation', 'Who can fix it', 'Kind', 'In CT Library'], [
    ['B099 does not exist · 0 copies · 3 loans already', '<b>the user</b> (another code, return a book)', '<b>checked</b>', `${c('LibraryException')} + 6 children`],
    ['"abc" typed where a number is expected', '<b>the user</b> (type again)', '<b>checked</b>', c('InvalidInputException')],
    ['item type 7 reaches createItem', '<b>a programmer</b> (Validation allows 1–3)', '<b>unchecked</b>', `${c('IllegalArgumentException')} — not caught`],
    ['removing inside a for-each (Lab 7)', '<b>a programmer</b>', '<b>unchecked</b>', c('ConcurrentModificationException')],
  ]) + two(
    box('Checked', `<p style="margin:0">extends ${c('Exception')}: javac <b>forces</b> every caller to ${c('catch')} it or declare ${c('throws')} — a normal outcome nobody may forget.</p>`, 'ok'),
    box('Unchecked', `<p style="margin:0">extends ${c('RuntimeException')}: a <b>bug</b>. Let it be loud; fix the code instead of catching it.</p>`, 'do2')), giua: true },

  /* 6 */
  { t: 'Throw where you find it, catch where you can answer it', body: tbl(['Layer', 'Throws', 'Catches', 'Why there'], [
    [c('utils/Validation'), c('InvalidInputException'), '—', 'knows the input is wrong, cannot ask again'],
    [c('repository/*'), `${c('ItemNotFound')} · ${c('MemberNotFound')} · ${c('LoanNotFound')} · ${c('DuplicateKey')}`, '—', 'knows whether a code exists'],
    [c('service/BookService'), `${c('LoanLimit')} · ${c('ItemNotAvailable')}`, '—', 'knows the rules, prints nothing'],
    [c('controller/*'), '—', `<b>${c('LibraryException')}</b> → view`, 'first layer that can make a result'],
    [c('main/Main'), '—', `<b>${c('InvalidInputException')}</b> → ask again`, 'owns the keyboard'],
  ]) + box('', `<p style="margin:0">The repositories and the service of the solution contain <b>no ${c('try')} at all</b>: they ${c('throw')} and declare ${c('throws')}. No ${c('System.out')} outside view and main — ${c('lint.py')} checks.</p>`, 'lam'), giua: true },

  /* 7 */
  { t: 'One request through the layers: "10 — borrow"', body: luong([
    ['Main', 'reads M001,\nB099 (utils\nchecks the form)', PG],
    ['Member…Ctrl', 'checkMember:\nM001 exists?\n(pre-check)', NAU],
    ['BookController', 'findById(B099)\n💥 ItemNotFound…\nnext lines skipped', NAU],
    ['BookService', 'checkLoanLimit\ncheckAvailable\n(not reached)', CAM],
    ['repository', 'updateCopies -1\naddLoan\n(not reached)', XANH],
    ['BookView', 'display()\n"Khong co tai\nlieu nao…"', PG],
  ], { h: 230, fs: 16 }) +
    P(raJava('lab6/LabNgoaiLeLanNguoc'), { title: 'real output — LabNgoaiLeLanNguoc: the path an exception travels (read it upwards)', sm: true }) +
    box('', `<p style="margin:0">${c('findById')} threw, ${c('borrowItem')} caught. Every line after the throw inside the ${c('try')} was <b>skipped</b> — no copy is taken off the shelf by mistake.</p>`, 'lam') },

  /* 8 */
  { t: 'TODO 6.1 — two business rules in the service', body:
    j(boChuThich(de([ham(`${S}/service/BookService.java`, 'checkLoanLimit'), ham(`${S}/service/BookService.java`, 'checkAvailable')].join('\n')))) +
    two(P(ST(29, 30).split('\n').slice(1).join('\n') + '\n' + ST(104, 105).split('\n').slice(1).join('\n'), { title: 'starter — both bodies empty', sm: true }),
      P(R(30, 30) + '\n' + R(106, 106), { title: 'solution — real output', sm: true })) +
    box('', `<p style="margin:0">One ${c('if')}, one ${c('throw')}. The message comes from ${c('Message')}, the numbers from ${c('Constants')} (${c('MAX_LOANS_PER_MEMBER')} = 3).</p>`, 'lam') },

  /* 9 */
  { t: 'TODO 6.2 and 6.3 — the repositories say "not found"', body:
    j(boChuThich(de([ham(`${S}/repository/MemberRepository.java`, 'findById'), ham(`${S}/repository/LoanRepository.java`, 'removeLoan')].join('\n')))) +
    two(wrap(psql(ST(44, 45).split('\n').slice(1).join('\n') + '\n' + ST(119, 120).split('\n').slice(1).join('\n'), { title: 'starter — every code "exists"', sm: true })),
      wrap(psql(R(45, 45) + '\n' + R(121, 121), { title: 'solution — real output', sm: true }))) },

  /* 10 */
  { t: 'TODO 6.4 — an empty catch swallows the error', body: vsd(
    j(['} catch (LibraryException e) {', '    // TODO Lab 6.4 — an EMPTY catch', '}', '', 'showResult(resultMessage, …);   // prints ""'].join('\n')),
    j(['} catch (LibraryException e) {', '    // every exception carries its message', '    resultMessage = e.getMessage();', '}', '', 'showResult(resultMessage, …);'].join('\n')),
    '✗ swallowed', '✓ shown') +
    wrap(psql(ra('lab6/bay/nuot-loi:check', [1, 3]) + '\n…\n' + ra('lab6/bay/nuot-loi:check').split('\n').slice(-1)[0], { title: './check.sh — bay/nuot-loi (the solution + one empty catch)', sm: true })) +
    box('', `<p style="margin:0">A ${c('catch')} must do something you can <b>see</b>: show the message, try another way, or rethrow.</p>`, 'do2') },

  /* 11 */
  { t: 'Trap: catch the parent first, or forget to declare', body: two(
    j(['// bay/bat-sai — BookController.borrowItem', '} catch (LibraryException e) {   // all six…', '    resultMessage = e.getMessage();', '} catch (ItemNotAvailableException e) {', '    resultMessage = e.getMessage();', '}', '', '// bay/bat-sai — updateCopies, try removed', 'BookResponseDTO before =', '        bookRepository.findById(…);   // checked!'].join('\n')),
    box('The rule', `<p style="margin:0">Order catches from <b>specific to general</b>. A checked exception is <b>caught or declared</b> — never ignored.</p>`, 'lam')) +
    wrap(psql(ra('lab6/bay/bat-sai:javac'), { title: 'javac --release 8 — bay/bat-sai (real)', sm: true })) },

  /* 12 */
  { t: 'Trap: a child exception without a constructor', body: two(
    j([tep('lab6/bay/thieu-ctor/src/exceptions/LoanLimitException.java', [9, 12]), '', '// the parent (given)', de(tep(`${S}/exceptions/LibraryException.java`, [15, 17]))].join('\n')),
    box('Why', `<p style="margin:0">Constructors are <b>not inherited</b>. With no constructor, Java writes a hidden ${c('LoanLimitException() { super(); }')} — and ${c('LibraryException')} has no constructor without arguments.</p>`, 'lam')) +
    P(ra('lab6/bay/thieu-ctor:javac', [1, 3]) + '\n  …\n' + ra('lab6/bay/thieu-ctor:javac', [7, 13]), { title: 'javac --release 8 — bay/thieu-ctor (real; first error trimmed)', sm: true }) },

  /* 13 */
  { t: 'TODO 6.5a — InvalidInputException keeps the cause', body:
    j(boChuThich(de(ham(`${S}/utils/Validation.java`, 'parseInteger')))) +
    two(col(j(['public InvalidInputException(String message,', '        Throwable cause) {', '    super(message, cause);', '}'].join('\n')), P(raJava('lab6/LabNguyenNhanGoc'), { title: 'real output — LabNguyenNhanGoc', sm: true })),
      box('Two readers', `<p style="margin:0">${c('getMessage()')} for the user, ${c('getCause()')} for the developer. ${c('Main')} now catches exactly ${c('InvalidInputException')} — a bug elsewhere is no longer disguised as "type again".</p>`, 'ok')) },

  /* 14 */
  { t: 'TODO 6.5b — try-with-resources, once, in main', body: two(
    j(de(boChuThich(tep(`${S}/main/Main.java`, [28, 34])))),
    j(['// trap — LabBayDongScanner', gon(ma('lab6/LabBayDongScanner', [7, 12]))].join('\n'))) +
    two(P(raJava('lab6/LabBayDongScanner'), { title: 'real output — LabBayDongScanner (same on JDK 8)', sm: true }),
      box('Open once, pass it down', `<p style="margin:0">Closing a Scanner closes the stream under it. ${c('System.in')} cannot be reopened, so the second Scanner reads from a dead stream. One Scanner, in ${c('main')}, closed automatically at the very end.</p>`, 'lam')) },

  /* 15 */
  { t: 'Trap: finally is for clean-up, never for return', body:
    j(de(gon(ma('lab6/LabBayFinally', [4, 15])))) + two(
    P(raJava('lab6/LabBayFinally'), { title: 'real output — LabBayFinally', sm: true }),
      box('', `<p style="margin:0">${c('finally')} runs on <b>every</b> path. A ${c('return')} there overrides the ${c('try')}'s value <b>and</b> swallows the exception. Use it to release (close a file, a connection) — the fixed version lets the ${c('IllegalStateException')} reach the caller.</p>`, 'do2')) },

  /* 16 */
  { t: 'Green: PASS 233/233, eleven messages, a silent reviewer', body: two(
    col(psql(ra('lab6/solution:check'), { title: './check.sh' }), psql(ra('lab6/solution:lint'), { title: 'python3 lint.py — solution' }),
      psql(ra('lab6/starter:check').split('\n').slice(-1)[0], { title: './check.sh — the starter', sm: true }).replace('<pre>', '<pre style="white-space:pre-wrap">')),
    col(box('The order that works', `<p style="margin:0">6.1 two rules · 6.2 + 6.3 two "not found" · 6.4 fill the two empty catches ⇒ <b>green</b> · then 6.5a + 6.5b (design: same output).</p>`, 'ok'),
      box('Last check', `<p style="margin:0">Search the project for ${c('throws Exception')} and ${c('catch (Exception')}: <b>zero hits</b>. Eleven wrong inputs in the harness, eleven exact messages, the menu still running.</p>`, 'lam'))), giua: true },

  /* 17 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      ['Two rules in the service (6.1)', '2'],
      ['Two "not found" in the repositories (6.2, 6.3)', '2'],
      ['No empty catch, no generic Exception (6.4)', '2'],
      [`${c('InvalidInputException')} + cause, try-with-resources (6.5)`, '2'],
      [`${c('lint.py')} ✓ sạch`, '1'],
      ['Oral: "checked or unchecked — where caught?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why is ${c('LoanLimitException')} checked but an unknown item type unchecked?<br>2. Why do the repository and the service have no ${c('try')}?<br>3. What does javac say about a parent catch before a child catch?</p>`, 'lam'),
      box('Next: Lab 7', `<p style="margin:0">A crowded shelf: search on several criteria, sort on four keys, count with an array of objects, and remove while looping — without a ${c('ConcurrentModificationException')}.</p>`, 'ok'))), giua: true },
]);
