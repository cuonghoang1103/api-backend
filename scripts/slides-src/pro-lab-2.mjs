/**
 * pro-lab-2 — PRO192 · Lab 2 · CT Library "Books with authors, members, ids" (slide EN, khuôn _pro-chung, agent pro-lab 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab2 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật;
 * bay/sua-ban-sao = đáp án với updateCopies sửa nhầm bản sao) và gen/java/lab2/LabBayAlias.java. Không gõ tay output.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-2.mjs --out <dir>   ⇒ <dir>/lab2/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, cards, tbl, c } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, luong, heapBanSao, col, boChuThich, PG, CAM, NAU, XANH } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab2', code: 'PRO192 Lab 2', title: 'Lab 2 — CT Library: real Book and Member classes', sub: 'Constructors, this, ids, reference vs copy' };

const S = 'lab2/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const R = (a, b) => ra('lab2/solution:run', [a, b]);

export const slides = lamDeck({ chuong: 'Lab 2 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 2 — CT Library:<br>real Book and Member classes', sub: 'After Chapter 2 · constructors and this, JavaBeans, ids the program assigns, and the one question of the chapter: did I change the object — or a copy of it?' },

  /* 2 */
  { t: 'Ticket CTL-2 — the librarian wants more than a title', body: two(
    box('The brief', `<p style="margin:0 0 8px">A title and an ISBN are not enough: the shelf needs the <b>author</b>, the <b>year</b> and <b>how many copies</b> the club owns. Members must be registered too.</p>
<p style="margin:0">Nobody types an id: the program hands out <b>B001, B002…</b> and <b>M001…</b>. When a copy is lost, the librarian updates the count — and the list must show the new number.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 113/113</b> lines`,
      `${c('lint.py')}: <b>0 violations</b> · ${c('javac --release 8')} OK`,
      `${c('Book')} and ${c('Member')} are <b>JavaBeans</b> you wrote`,
      'ids come from the repository, never from the keyboard',
      '"update copies" changes the book <b>in the list</b>',
    ]))), giua: true },

  /* 3 */
  { t: 'Six menu items now — and ids in the table', body: psql(R(1, 14), { title: 'java -cp build main.Main < harness/input.txt', sm: true }) +
    cards([
      ['Book', `id · ISBN · title · author · year · copies — 6 fields, ${c('B001')} given by the repository.`],
      ['Member', `id · name · email — ${c('M001')}… Names are cleaned like titles: "le   van cuong" → "Le Van Cuong".`],
      ['Same layers', `${c('MemberController')} → ${c('MemberRepository')} / ${c('MemberService')} / ${c('MemberView')}: a copy of the Book side.`],
    ]) },

  /* 4 */
  { t: 'A model is a JavaBean (reviewer rule V10)', body: j(boChuThich(tep(`${S}/model/Book.java`, [11, 42]))) +
    box('', `<p style="margin:0">Every field ${c('private')} · a ${c('public')} constructor with NO parameters · getter + setter per field (they follow in the file). ${c('this("", …, 0, 0)')} calls the OTHER constructor; in ${c('this.title = title')} the left side is the field, the right side the parameter.</p>`, 'lam') },

  /* 5 */
  { t: 'Ids come from the repository, not from static', body: j(boChuThich(ham(`${S}/repository/BookRepository.java`, 'addBook'))) +
    two(box('nextBookNumber', `<p style="margin:0">A field of <b>this</b> repository object, starting at ${c('FIRST_ID_NUMBER = 1')}. ${c('String.format("B%03d", 5)')} → ${c('B005')}.</p>`, 'ok'),
      box('Why not static?', `<p style="margin:0">The reviewer rejects ${c('static')} outside utils/constants. Lab 3 shows the bug it causes — two repositories sharing one counter.</p>`, 'do2')) },

  /* 6 */
  { t: 'One question for the whole chapter: object or copy?', body: heapBanSao() },

  /* 7 */
  { t: '"4 — update copies" through the reference', body:
    j(boChuThich(ham(`${S}/repository/BookRepository.java`, 'updateCopies'))) +
    j(boChuThich(ham(`${S}/controller/BookController.java`, 'updateCopies'))) },

  /* 8 */
  { t: 'After setCopies(7): the list sees it, the copy does not', body: heapBanSao({ moi: 7, h: 340 }) + psql(R(49, 49) + '\n...\n' + R(59, 61), { title: 'real output — option 4, then option 2', sm: true }) },

  /* 9 */
  { t: 'Trap: change a copy and nothing happens', body: j(ham('lab2/bay/sua-ban-sao/src/repository/BookRepository.java', 'updateCopies')) +
    psql(ra('lab2/bay/sua-ban-sao:run', [9, 24]).split('\n').filter((l) => !/^[0-6]\. |=====/.test(l)).join('\n'), { title: 'real output — "2 -> 7" printed, the list still says 2', sm: true }) +
    box('', `<p style="margin:0">${c('findById')} returns a <b>new</b> ${c('BookResponseDTO')} — a copy made for the screen. Setting its copies changes a throw-away object. Your starter's TODO 2.4 starts with exactly this line.</p>`, 'do2') },

  /* 10 */
  { t: 'Trap: Book b2 = b1 does not copy the book', body: j(ma('lab2/LabBayAlias', [19, 28])) +
    two(psql(raJava('lab2/LabBayAlias'), { title: 'real output' }),
      box('Assignment copies the ARROW', `<p style="margin:0">${c('b2 = b1')}: two variables, <b>one</b> object (${c('b1 == b2')} is true). A real copy needs ${c('new')} — that is what ${c('toResponseDTO')} does for every row the view prints.</p>`, 'lam')) },

  /* 11 */
  { t: 'Your starter: Lab 1 done, Lab 2 bodies are TODO', body: tbl(['TODO', 'Where', 'What you write'], [
    ['2.1', `${c('Book()')} · ${c('Book(id, isbn, …)')}`, `${c('this(...)')} chaining + six ${c('this.x = x')}`],
    ['2.2', `${c('Member()')} · ${c('Member(id, name, email)')}`, 'same, three fields'],
    ['2.3', `${c('BookRepository.addBook')}`, `${c('B%03d')} from ${c('nextBookNumber')}, then ${c('++')}`],
    ['2.4', `${c('BookRepository.updateCopies')}`, 'change the REAL Book (the given line changes a copy)'],
    ['2.5', `${c('MemberRepository.addMember')}`, `${c('M001')}, ${c('M002')}… like 2.3`],
    ['2.6', `${c('MemberService.sortByName')}`, 'like sortByTitle: copy, Comparator, numbers'],
    ['2.7', `${c('Validation')} — 5 methods`, 'year 1450–2100, copies 0–99, B + 3 digits, email, person name'],
  ]) + psql(ra('lab2/starter:check', [1, 3]), { title: 'starter — ./check.sh (first lines): the constructor is empty, so getIsbn() is null', sm: true }) },

  /* 12 */
  { t: 'Every wrong input gets its own sentence', body: psql([R(25, 28), R(38, 39), R(76, 78)].join('\n'), { title: 'real output — add book, update copies, add member', sm: true }) +
    box('Helpers keep it short', `<p style="margin:0">${c('parseInteger(input, fieldName)')} and ${c('getPersonName(input, fieldName)')} are <b>private</b> in Validation: one message format serves "Tac gia" and "Ho ten", "Nam xuat ban" and "So ban". A name with a digit (${c('R2D2')}, ${c('le van 3')}) gets its own sentence too.</p>`, 'lam') },

  /* 13 */
  { t: 'One flow, five layers: "5 — add a member"', body: luong([
    ['Main', 'reads name + email\nthrough Validation', PG],
    ['MemberController', 'addMember(dto)', NAU],
    ['MemberRepository', 'gives M003\nnew Member(...)', XANH],
    ['MemberView', 'setMessage\ndisplay() once', PG],
  ], { h: 190 }) + j(boChuThich(ham(`${S}/controller/MemberController.java`, 'addMember'))) },

  /* 14 */
  { t: 'Green: PASS 113/113', body: two(
    col(psql(ra('lab2/solution:check'), { title: 'after TODO 2.1–2.7 — ./check.sh' }), psql(R(87, 91), { title: 'real output — members sorted by name' })),
    col(box('Also check by hand', `<p style="margin:0">${c('python3 lint.py CTLibrary-Lab2')} → ✓ sạch. Then commit: ${c('git commit -m "Lab 2: Book, Member, ids"')}.</p>`, 'ok'),
      box('Draw it', `<p style="margin:0">On paper: the stack and heap right after ${c('book.setCopies(7)')}. Which arrows point to the Book B002? (answer: slide 8)</p>`, 'lam'))) },

  /* 15 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      ['Book + Member JavaBeans: private fields, empty + full constructor, this(...)', '2'],
      ['Ids B001 / M001 from the repository (instance counter)', '2'],
      ['Update copies changes the book in the list (reference, not copy)', '2'],
      ['Members: add + list sorted by name', '1'],
      ['Validation: 5 new checks, precise messages', '2'],
      ['lint.py 0 · comments · Git commit', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. After ${c('Book b2 = b1;')} how many Book objects exist?<br>2. Why does ${c('findById')} return a DTO, not the Book?<br>3. Where would you add a "publisher" field — which files change?</p>`, 'lam'),
      box('Next: Lab 3', `<p style="margin:0">Encapsulation for real: years not in the future, emails that are unique, delete without reusing ids, a report — and a code review where ${c('lint.py')} finds five mistakes.</p>`, 'ok'))), giua: true },
]);
