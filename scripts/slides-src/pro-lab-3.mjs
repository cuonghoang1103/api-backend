/**
 * pro-lab-3 — PRO192 · Lab 3 · CT Library "Encapsulation and data rules" (slide EN, khuôn _pro-chung, agent pro-lab 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab3 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật;
 * starter có 6 vi phạm lint cài sẵn; bay/truy-cap = lỗi javac thật) và gen/java/lab3/*.java (bẫy chạy thật). Không gõ tay output.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-3.mjs --out <dir>   ⇒ <dir>/lab3/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, cards, tbl, c } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab3', code: 'PRO192 Lab 3', title: 'Lab 3 — CT Library: encapsulation and data rules', sub: 'Strict rules, delete, report, access modifiers, a code review' };

const S = 'lab3/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const R = (a, b) => ra('lab3/solution:run', [a, b]);

export const slides = lamDeck({ chuong: 'Lab 3 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 3 — CT Library:<br>encapsulation and data rules', sub: 'After Chapter 3 · no book from the future, one email per member, delete without reusing ids, a report — and a code review where lint.py flags six lines' },

  /* 2 */
  { t: 'Ticket CTL-3 — "the data is a mess"', body: two(
    box('The brief', `<p style="margin:0 0 8px">The librarian found a book "published" in 2999, two members sharing one email and a teammate's pull request that prints DEBUG lines.</p>
<p style="margin:0">Tighten the rules, add <b>delete</b> (an id is never given out twice) and a <b>report</b>, then review the PR until the reviewer's tool is silent.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 176/176</b> lines`,
      `${c('lint.py')} on your project: from <b>6 violations</b> to <b>0</b>`,
      '<b>10 wrong values</b> refused, each with its own sentence',
      'B003 deleted ⇒ the next book is <b>B006</b>',
      `no year hard-coded: the rule reads the clock`,
    ]))), giua: true },

  /* 3 */
  { t: 'Ten wrong values, ten sentences — who checks what', body: tbl(['Typed', 'Rule', 'Checked in'], [
    [c('2999') + ' (year)', 'not after this year', 'utils · Validation.getYear'],
    [c('1449') + ' (year)', 'from 1450', 'utils · Validation.getYear'],
    [`${c('100')} · ${c('-3')} (copies)`, '0 … 99', 'utils · Validation.getCopies'],
    [c('978-0-13-468599-1'), 'ISBN already used', 'repository · BookRepository.addBook'],
    [`${c('an@@ctlib.vn')} · ${c('.an@ctlib.vn')} · ${c('an nguyen@ctlib.vn')}`, 'email shape (regex)', 'utils · Validation.getEmail'],
    [c('AN.NGUYEN@ctlib.vn'), 'email already used (M002)', 'repository · MemberRepository'],
    [`${c('b003')} (delete twice)`, 'no book with that id', 'repository · BookRepository'],
  ]) + box('The pattern', `<p style="margin:0"><b>Shape</b> of one value ⇒ utils (it only sees the text). <b>Against the data</b> (duplicate, not found) ⇒ the repository (it owns the list).</p>`, 'lam') },

  /* 4 */
  { t: 'TODO 3.1 — a year from the future', body: j(boChuThich(ham(`${S}/utils/Validation.java`, 'getYear'))) +
    psql(R(27, 28), { title: 'real output', sm: true }) +
    box('No 2026 in the code', `<p style="margin:0">${c('Calendar.getInstance().get(Calendar.YEAR)')} reads the year when the program runs. The message does not print the current year, so ${c('expected.txt')} stays true next year too.</p>`, 'ok') },

  /* 5 */
  { t: 'TODO 3.2 — an email regex you can read', body: tbl(['Piece', 'Means'], [
    [c('[a-z0-9]+'), 'the name starts with letters/digits'],
    [c('([._-][a-z0-9]+)*'), 'then . _ or - , each followed by letters/digits (no ".." no leading ".")'],
    [c('@[a-z0-9]+(-[a-z0-9]+)*'), 'one @, then a domain label'],
    [c('(\\.[a-z0-9]+(-[a-z0-9]+)*)+'), 'at least one ".something"'],
  ]) + two(
    tbl(['Typed', 'Result'], [[c('an@@ctlib.vn'), 'refused'], [c('.an@ctlib.vn'), 'refused'], [c('an nguyen@ctlib.vn'), 'refused'], [c('Cuong.Le@CTLib.vn'), 'accepted as cuong.le@ctlib.vn']]),
    box('Lower case first', `<p style="margin:0">${c('getEmail')} does ${c('trim().toLowerCase()')} before the regex — so the duplicate check later compares like with like.</p>`, 'lam')) },

  /* 6 */
  { t: 'TODO 3.3 — one email, one member', body: j(boChuThich(ham(`${S}/repository/MemberRepository.java`, 'findByEmail'))) +
    psql(R(123, 123), { title: 'real output', sm: true }) +
    box('Why the repository?', `<p style="margin:0">Only the object that <b>holds the list</b> can answer "is this email taken?". Validation would need the list — and utils must not touch a repository.</p>`, 'lam') },

  /* 7 */
  { t: 'TODO 3.4 — delete, and never give an id out twice', body: j(boChuThich(ham(`${S}/repository/BookRepository.java`, 'deleteBook'))) +
    psql([R(67, 67), R(79, 79), R(91, 91), R(103, 108)].join('\n'), { title: 'real output — delete B003, delete it again, add a book, list', sm: true }) +
    box('nextBookNumber does not go back', `<p style="margin:0">B003 was deleted; the next book gets <b>B006</b>. An old receipt that says "B003" must never point at a different book.</p>`, 'ok') },

  /* 8 */
  { t: 'TODO 3.5 — the report: service works on copies', body: j(boChuThich(ham(`${S}/service/BookService.java`, 'buildReport'))) +
    two(psql(R(162, 165), { title: 'real output — option 8 at the end', sm: true }),
      box('', `<p style="margin:0">The controller hands the repository's <b>copies</b> to the service: ${c('bookService.buildReport(bookRepository.findAll())')}.</p>`, 'lam')) },

  /* 9 */
  { t: 'Access modifiers in CT Library — one reason each', body: tbl(['Member', 'Modifier', 'Why'], [
    ['every field (model, dto, repository, view…)', c('private'), 'nobody writes copies = -5 behind the rules'],
    ['methods other classes call (controller → repository)', c('public'), 'the "contract" between layers'],
    [`helpers used only inside (${c('findBookById')}, ${c('toTitleCase')})`, c('private'), 'free to change, nobody else depends on them'],
    [`constructor of ${c('Validation')}, ${c('Message')}, ${c('Main')}`, c('private'), 'classes with only static members: no objects'],
    ['package-private (no keyword)', '—', 'not used: no reason in a console lab'],
    [c('protected'), '—', 'comes in Lab 4 with inheritance'],
  ]) + box('The oral question', `<p style="margin:0">"Why is this field private?" — <b>"So no class can change it directly: every change goes through a method with a check. Public would let anyone write copies = -5."</b></p>`, 'ok') },

  /* 10 */
  { t: 'What javac says when you break the rules', body: two(
    j(boChuThich(tep('lab3/bay/truy-cap/src/model/Book.java', [6, 20]))),
    j(boChuThich(tep('lab3/bay/truy-cap/src/main/Main.java', [9, 20])))) +
    psql(ra('lab3/bay/truy-cap:javac'), { title: 'javac --release 8 -d build $(find src -name "*.java") — real errors', sm: true }) +
    box('', `<p style="margin:0">A constructor with no keyword is visible only <b>inside package model</b>; a ${c('private')} field only inside ${c('Book')}. The compiler — not good intentions — protects the data.</p>`, 'lam') },

  /* 11 */
  { t: 'static: where it is allowed — and the bug it hides', body: j(ma('lab3/LabBayStatic', [5, 13])) +
    two(psql(raJava('lab3/LabBayStatic'), { title: 'real output' }),
      box('Static = one copy for the whole class', `<p style="margin:0">A brand-new, empty repository starts at <b>B004</b>: the counter belongs to the class. Reviewer rule: static only in <b>utils</b>, <b>constants</b> and <b>Main's methods</b>.</p>`, 'do2')) },

  /* 12 */
  { t: 'Trap: every field private — and the list still leaks', body: j(ma('lab3/LabBayRoRi', [13, 24])) +
    two(psql(raJava('lab3/LabBayRoRi'), { title: 'real output' }),
      box('Return copies', `<p style="margin:0">${c('getTitleList()')} hands out the list itself: one ${c('clear()')} outside empties the library. CT Library's ${c('findAll()')} builds NEW DTOs every time.</p>`, 'ok')) },

  /* 13 */
  { t: 'TODO 3.6 — review your teammate\'s PR with lint.py', body: psql(ra('lab3/starter:lint'), { title: 'python3 lint.py CTLibrary-Lab3 — the starter', sm: true }) +
    tbl(['Violation', 'Fix'], [
      [`${c('import model.Book;')} in BookController`, 'delete it: only DTOs cross the controller'],
      [`${c('System.out.println("DEBUG …")')} in MemberController`, 'delete it: only view and main print'],
      [`${c('"Lua chon: "')} written in Main`, c('Message.INPUT_CHOICE')],
      [`${c('public int copies')} in Book`, c('private int copies')],
      [`${c('private static int nextBookNumber')}`, 'drop static (see the trap two slides back)'],
    ]) },

  /* 14 */
  { t: 'Green: PASS 176/176 and a silent reviewer', body: two(
    col(psql(ra('lab3/solution:check'), { title: './check.sh' }), psql(ra('lab3/solution:lint'), { title: 'python3 lint.py' })),
    col(box('The order that works', `<p style="margin:0">1. fix the 6 lint lines (they do not change the output) · 2. TODO 3.1–3.5 · 3. ${c('check.sh')} · 4. lint again · 5. commit.</p>`, 'ok'),
      box('Why lint matters', `<p style="margin:0">In LAB211 the reviewer stops at the first gate that fails: structure, naming, comments. Passing tests is not enough.</p>`, 'lam'))), giua: true },

  /* 15 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      ['Year rule from the clock + 1450 rule (3.1)', '1'],
      ['Strict email + duplicate email in the repository (3.2, 3.3)', '2'],
      ['Delete, id never reused (3.4)', '2'],
      ['Report computed by the service on copies (3.5)', '2'],
      ['Code review: lint.py 0 violations (3.6)', '2'],
      ['Explain every modifier you used (oral, 1 question)', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why is ${c('getYear')} in utils but the duplicate-email check in the repository?<br>2. What breaks if ${c('nextBookNumber')} is static?<br>3. Which getter would leak the library — and how does CT Library avoid it?</p>`, 'lam'),
      box('Next: Lab 4', `<p style="margin:0">Magazines and DVDs join the books: ${c('LibraryItem')} → ${c('Book')}, ${c('Magazine')}, ${c('DVD')} — inheritance, ${c('@Override')} and late fees without one ${c('instanceof')}.</p>`, 'ok'))), giua: true },
]);
