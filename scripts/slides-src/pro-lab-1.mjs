/**
 * pro-lab-1 — PRO192 · Lab 1 · CT Library "The first book catalogue" (slide EN, khuôn _pro-chung, agent pro-lab 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab1 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật)
 * và gen/java/lab1/*.java (bẫy, chạy thật). Không gõ tay output.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-1.mjs --out <dir>   ⇒ <dir>/lab1/NNN.webp
 */
import { lamDeck, sql, psql, sh, two, box, steps, cards, vsd, tbl, c } from './_pro-chung.mjs';
import { ham, ra, raJava, ma, tangLab, luong, col, boChuThich, PG, CAM, NAU, XANH, TIM } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab1', code: 'PRO192 Lab 1', title: 'Lab 1 — CT Library: the first book catalogue', sub: 'Strings, ISBN-13, Comparator — in the LAB211 layers' };

const S = 'lab1/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });

export const slides = lamDeck({ chuong: 'Lab 1 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 1 — CT Library:<br>the first book catalogue', sub: 'After Chapter 1 · a console menu, Title Case, the ISBN-13 check digit, search and sort with a Comparator — written in the LAB211 layers from day one' },

  /* 2 */
  { t: 'Ticket CTL-1 — what the club asked for', body: two(
    box('The brief', `<p style="margin:0 0 8px">The CuongThai reading club (300 members) keeps its books in a spreadsheet full of typos: <b>"  clean    CODE "</b>, ISBNs with a digit missing, the same book twice.</p>
<p style="margin:0">Your first ticket: a console catalogue that <b>cleans every title</b>, <b>refuses a wrong ISBN-13</b> with a message that says <b>exactly what is wrong</b>, lists books A–Z and finds them by part of the title.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')} prints <b>PASS: 77/77</b> lines`,
      `${c('lint.py')} (the LAB211 reviewer's rules): <b>0 violations</b>`,
      `compiles with ${c('javac --release 8')} (exam room JDK)`,
      'every wrong input → a Vietnamese message, <b>never a crash</b>',
      `${c('git log --oneline')}: <b>≥ 3 commits</b>`,
    ]))), giua: true },

  /* 3 */
  { t: 'The program you will finish', body: psql(ra('lab1/solution:run', [1, 14]), { title: 'java -cp build main.Main < harness/input.txt', sm: true }) +
    cards([
      ['Menu', `${c('1')} add · ${c('2')} list A–Z · ${c('3')} search · ${c('0')} exit. Four sample books come from ${c('Constants')}.`],
      ['Typed on purpose', `${c('abc')} and ${c('7')} at the menu: two different messages, then the menu asks again.`],
      ['Why it looks squashed', 'Input comes from a file, so typed text is not echoed: each prompt runs into what is printed next.'],
    ]) },

  /* 4 */
  { t: 'Nine packages — the LAB211 reviewer checks this first', body: tangLab({ hl: ['controller'] }) + `<div class="nho" style="text-align:center">Wrong structure = the reviewer stops at gate 1. The same layers come back in LAB211, PRJ301 and every Spring Boot project.</div>` },

  /* 5 */
  { t: 'The rules that get a lab rejected', body: tbl(['Rule', 'In CT Library', 'Why'], [
    ['Controller <b>holds the repository</b> and calls CRUD', `${c('BookController')} has ${c('bookRepository')}`, 'one place decides when data is saved'],
    ['Service <b>never holds a repository</b>', `${c('BookService.sortByTitle(list)')} gets the list as a parameter`, 'business logic you can test with any list'],
    ['Controller <b>does not import model</b>', 'only DTOs cross the controller', 'the screen never touches the real objects'],
    ['Every text in <b>Message</b>, every number in <b>Constants</b>', `${c('Constants.ISBN_LENGTH = 13')}`, 'change a rule in one line'],
    ['≤ 2 parameters (utils ≤ 3) · ≤ 100 chars a line', `${c('getChoice(input, min, max)')}`, 'more data ⇒ pack it in a DTO'],
    ['A comment on every class, method, if, for, case, try', 'Javadoc + one short line', 'gate 3 of the review'],
    ['No System.exit, no static field in Main, nextLine() only', `${c('isRunning = false')}`, 'clean exit, no skipped input'],
  ]) },

  /* 6 */
  { t: 'One request through the layers: "2 — list books"', body: luong([
    ['Main', 'reads "2"\ncalls controller once', PG],
    ['BookController', 'showAllBooks()', NAU],
    ['BookRepository', 'findAll():\nCOPIES as\nBookResponseDTO', XANH],
    ['BookService', 'sortByTitle(list)\nsorts + numbers', CAM],
    ['BookView', 'setResponseList\ndisplay() once', PG],
  ], { h: 190 }) + j(ham(`${S}/controller/BookController.java`, 'showAllBooks')) },

  /* 7 */
  { t: 'Your starter: all given except 5 method bodies', body: tbl(['TODO', 'Where', 'What you write', 'Uses (Chapter 1)'], [
    ['1.1', 'terminal', `${c('git init')} + a commit after each step`, '—'],
    ['1.2', `${c('Validation.getTitle')}`, 'clean a title into Title Case, max 60 characters', 'trim, split, substring, StringBuilder'],
    ['1.3', `${c('Validation.getIsbn')}`, 'ISBN-13: 4 checks, 4 precise messages', 'charAt, loops, %, String.format'],
    ['1.4', `${c('BookRepository.addBook')}`, 'refuse a duplicate ISBN', 'equals, throw'],
    ['1.5', `${c('BookRepository.findByKeyword')}`, 'part of the title, any case', 'toLowerCase, contains'],
    ['1.6', `${c('BookService.sortByTitle')}`, 'sort a copy A–Z, then number 1, 2, 3…', 'Collections.sort + Comparator'],
  ]) + box('', `<p style="margin:0">Read the given classes first — ${c('Main')}, ${c('BookController')}, ${c('BookView')} — they show you every layer working. Search for <b>TODO Lab</b> in NetBeans (Window → Action Items).</p>`, 'lam') },

  /* 8 */
  { t: 'TODO 1.2 — Title Case in four moves', body: two(
    steps([
      `${c('trim()')} — drop the spaces at both ends`,
      `${c('split("\\\\s+")')} — one or MORE spaces separate words`,
      'each word: first letter upper, the rest lower',
      `join with ONE space in a ${c('StringBuilder')} (no ${c('+=')} in a loop)`,
      'empty → error · longer than 60 → error with both lengths',
    ]),
    col(psql(`"   clean    CODE  "
   → "Clean Code"
"effective   JAVA third edition"
   → "Effective Java Third Edition"
""  (only Enter)
   → error: khong duoc de trong`, { title: 'input → result' }),
      box('Why StringBuilder?', `<p style="margin:0">${c('String')} is immutable: ${c('s += w')} builds a NEW string every turn. The checklist (3.8) forbids it.</p>`, 'lam'))) },

  /* 9 */
  { t: 'TODO 1.3 — the ISBN-13 check digit, by hand', body: tbl(['digit', '9', '7', '8', '0', '1', '3', '2', '3', '5', '0', '8', '8', '?'], [
      ['weight', '1', '3', '1', '3', '1', '3', '1', '3', '1', '3', '1', '3', ''],
      ['product', '9', '21', '8', '0', '1', '9', '2', '9', '5', '0', '8', '24', ''],
    ], { cap: '978-0-13-235088-? — weights 1, 3, 1, 3… on the first 12 digits' }) +
    two(box('Check digit', `<p style="margin:0">sum = <b>96</b> · 96 % 10 = 6 · (10 − 6) % 10 = <b>4</b> ⇒ the 13th digit must be <b>4</b>.</p>`, 'ok'),
      box('Four checks, four messages', `<p style="margin:0">bad character + position · not 13 digits · not 978/979 · wrong check digit (say the right one).</p>`)) +
    psql(ra('lab1/solution:run', [20, 25]), { title: 'real output — the PE grader loves this part', sm: true }) },

  /* 10 */
  { t: 'TODO 1.3 — the code, one loop per job', body: j(ham(`${S}/utils/Validation.java`, 'getIsbn').split('\n').slice(0, 30).join('\n') + '\n    ...') },

  /* 11 */
  { t: 'TODO 1.4 — the repository refuses a duplicate ISBN', body: j(ham(`${S}/repository/BookRepository.java`, 'addBook')) +
    psql(ra('lab1/solution:run', [32, 32]).replace('Ten sach: ISBN-13: ', ''), { title: 'real output (title + ISBN of a book already in the library)', sm: true }) +
    box('Why here, not in Validation?', `<p style="margin:0">Validation only sees the text you typed. Only the <b>repository</b> holds the list, so only it can say "this ISBN is already taken" — and by which book.</p>`, 'lam') },

  /* 11b */
  { t: 'TODO 1.5 — search: part of the title, any case', body: j(ham(`${S}/repository/BookRepository.java`, 'findByKeyword')) +
    box('', `<p style="margin:0">Compare <b>lower case with lower case</b>: ${c('jAvA')} finds three books. Two strings are compared with ${c('equals')}/${c('contains')}, never ${c('==')} (trap on slide 15).</p>`, 'lam') },

  /* 12 */
  { t: 'TODO 1.6 — a Comparator is "the rule for who goes first"', body: two(
    col(j(boChuThich(ham(`${S}/service/BookService.java`, 'sortByTitle'))), `<div class="cap">comments hidden — the file has one on every block</div>`),
    col(box('compare(first, second)', `<p style="margin:0"><b>negative</b> ⇒ first goes first · <b>0</b> ⇒ tie · <b>positive</b> ⇒ second first. Same title ⇒ ISBN decides.</p>`),
      box('Why a copy?', `<p style="margin:0">${c('new ArrayList<>(bookList)')}: sorting must not reorder the list you were given.</p>`, 'lam'),
      box('No repository here', `<p style="margin:0">It sorts any list the controller hands it: all books or only search hits.</p>`, 'ok')), 'r73') },

  /* 13 */
  { t: 'The harness: red before your TODOs, green after', body: psql(ra('lab1/starter:check', [1, 9]) + '\n...\n' + ra('lab1/starter:check').split('\n').slice(-1)[0], { title: 'starter, TODOs not done — ./check.sh', sm: true }) +
    two(psql(ra('lab1/solution:check'), { title: 'after TODO 1.2–1.6 — ./check.sh' }),
      box('How it grades', `<p style="margin:0">${c('CheckHarness')} runs your ${c('Main')} with ${c('harness/input.txt')} as the keyboard and compares <b>every line</b> with ${c('expected.txt')}. NetBeans: Test Packages → CheckHarness.java → <b>Run File</b>.</p>`, 'lam')) },

  /* 14 */
  { t: 'Trap 1 — comparing the typed ISBN with ==', body: j(ma('lab1/LabBaySoChuoi', [7, 14])) +
    two(psql(raJava('lab1/LabBaySoChuoi'), { title: 'real output (typed 9780134685991)' }),
      box('Why', `<p style="margin:0">${c('==')} compares two <b>references</b>. ${c('nextLine()')} builds a NEW String object, so the answer is ${c('false')} even with the same digits. Two literals share one object in the <b>string pool</b> — that is why ${c('==')} "sometimes works" in tests.</p>`, 'do2')) },

  /* 14b */
  { t: 'Trap 2 — nextInt() then nextLine(): an empty title', body: j(ma('lab1/LabBayNextInt', [7, 17])) +
    two(psql(raJava('lab1/LabBayNextInt'), { title: 'real output (typed 1, Clean Code, 2)' }),
      box('Fix', `<p style="margin:0">${c('nextInt()')} leaves the Enter in the buffer; the next ${c('nextLine()')} eats it. LAB211 rule: read <b>every</b> input with ${c('nextLine()')}, then ${c('Integer.parseInt')} — exactly what ${c('Validation.getChoice')} does.</p>`, 'ok')) },

  /* 15 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      ['LAB211 structure: 9 packages, controller ↔ repository, service without repository, no model in controller', '2'],
      ['Title Case + empty + length (1.2)', '2'],
      ['ISBN-13: 4 checks, 4 precise messages (1.3)', '2'],
      ['Duplicate ISBN refused (1.4)', '1'],
      ['Search, any case (1.5)', '1'],
      ['Sort A–Z + numbering (1.6)', '1'],
      ['lint.py 0 · comments · ≤ 100 chars · Git ≥ 3 commits', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why is the duplicate check in the repository, not in Validation?<br>2. What does ${c('compare')} return for "Clean Code" vs "clean code"?<br>3. Which file changes to allow 80-character titles?</p>`, 'lam'),
      box('Next: Lab 2', `<p style="margin:0">A real ${c('Book')} class (id, author, year, copies) and ${c('Member')} — constructors, ${c('this')}, and why changing a <b>copy</b> changes nothing.</p>`, 'ok'))), giua: true },
]);
