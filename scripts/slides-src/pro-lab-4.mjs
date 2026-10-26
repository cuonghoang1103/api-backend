/**
 * pro-lab-4 — PRO192 · Lab 4 · CT Library "Inheritance and polymorphism" (slide EN, khuôn _pro-chung, agent pro-lab45 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab4 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 199/199; starter = 5 TODO; bay/ghi-de-sai = 2 lỗi javac thật) và gen/java/lab4/*.java (bẫy chạy thật, LabBayEpKieu = JDK 8 thật).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-4.mjs --out <dir>   ⇒ <dir>/lab4/NNN.webp
 */
import { lamDeck, sql, psql, sh, two, box, steps, tbl, c } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, soDoLop, haiCua, NAU, XANH, CAM, TIM } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab4', code: 'PRO192 Lab 4', title: 'Lab 4 — CT Library: inheritance and polymorphism', sub: 'LibraryItem → Book, Magazine, Dvd · overriding · late fees without instanceof' };

const S = 'lab4/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const R = (a, b) => ra('lab4/solution:run', [a, b]);
/** bỏ thụt lề chung (mã trong thân lớp/hàm) để mã vừa khung */
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
/** bỏ dấu nhắc nhập (Ma tai lieu …: So ngay da giu: ) ở đầu dòng output — slide ghi rõ "prompts trimmed" */
const boNhac = (t) => t.split('\n').map((x) => x.replace(/^(?:Ma tai lieu \(vi du B001, T005, D006\): |So ngay da giu: |Nguoi muon \(1 Sinh vien, 2 Can bo\): )+/, '')).join('\n');

export const slides = lamDeck({ chuong: 'Lab 4 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 4 — CT Library:<br>inheritance and polymorphism', sub: 'After Chapter 4 · magazines and DVDs join the books · one parent class, three answers · late fees without a single instanceof' },

  /* 2 */
  { t: 'Ticket CTL-4 — "we lend magazines and DVDs now"', body: two(
    box('The brief', `<p style="margin:0 0 8px">The club now lends <b>magazines</b> (7 days, 1,000 đ/day late) and <b>DVDs</b> (3 days, 5,000 đ/day) next to books (14 days, 2,000 đ/day).</p>
<p style="margin:0">One list for all three, ids ${c('B…')} ${c('T…')} ${c('D…')}, and a new menu <b>9 — late fee</b>: give an id and the days kept.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 199/199</b> lines`,
      `${c('lint.py')}: still <b>✓ sạch</b>`,
      `${c('@Override')} on every overriding method`,
      `${c('grep -rn instanceof src/')} prints <b>nothing</b>`,
      'adding a 4th type later = <b>a new class</b>, not a new if',
    ]))), giua: true },

  /* 3 */
  { t: 'The class tree — one parent, three children', body: soDoLop([
    { id: 'P', ten: 'LibraryItem', x: 300, y: 0, w: 510, mau: NAU, nho: 'model · the common part, written ONCE',
      tr: ['- id, title: String', '- year, copies: int'],
      pt: ['# LibraryItem(id, title, year, copies)', '+ getTypeName() · getIdPrefix()', '+ getLoanDays() · getLateFeePerDay()', '+ getDetail() · getUniqueKey()'] },
    { id: 'B', ten: 'Book', x: 0, y: 318, w: 340, mau: XANH, tr: ['- isbn, author: String'], pt: ['6 × @Override'] },
    { id: 'M', ten: 'Magazine', x: 385, y: 318, w: 340, mau: XANH, tr: ['- issueNumber: int'], pt: ['6 × @Override'] },
    { id: 'D', ten: 'Dvd', x: 770, y: 318, w: 340, mau: XANH, tr: ['- minutes: int'], pt: ['6 × @Override'] },
  ], [
    { tu: 'B', den: 'P', kieu: 'ke', x2: 420, nhan: 'is-a', neo: 'end', dx: -10 }, { tu: 'M', den: 'P', kieu: 'ke', x2: 555 }, { tu: 'D', den: 'P', kieu: 'ke', x2: 690, nhan: 'extends', dx: 12 },
  ], { h: 470 }) + `<div class="nho" style="text-align:center"># = ${c('protected')}: only subclasses call this constructor (through ${c('super(...)')}). Fields stay ${c('private')} — the reviewer's rule.</div>` },

  /* 4 */
  { t: 'Six questions, three different answers', body: tbl(['Method', 'Book', 'Magazine', 'Dvd'], [
    [c('getTypeName()'), '"Sach"', '"Tap chi"', '"DVD"'],
    [c('getIdPrefix()'), '"B"', '"T"', '"D"'],
    [c('getLoanDays()'), '14', '7', '3'],
    [c('getLateFeePerDay()'), '2000', '1000', '5000'],
    [c('getDetail()'), 'author, ISBN …', 'Ky so 118', '120 phut'],
    [c('getUniqueKey()'), 'ISBN 978…', 'Tech Weekly ky 118', 'The Social Network nam 2010'],
  ]) + two(
    box('Same name, same parameters', `<p style="margin:0">That is <b>overriding</b>: the child gives its own body to a method it inherited. Every value comes from ${c('Constants')} / ${c('Message')} — nothing hard-coded.</p>`, 'lam'),
    box('And the parent itself?', `<p style="margin:0">${c('LibraryItem')} answers "Tai lieu", "I", <b>0 days, 0 đ</b> — a "generic item" makes no sense. Lab 5 makes it ${c('abstract')}.</p>`, 'do2')) },

  /* 5 */
  { t: 'TODO 4.1 — super(...) comes first', body: j(de(tep(`${S}/model/Book.java`, [26, 31])), { hl: [3] }) +
    box('Parent part first', `<p style="margin:0">The fields ${c('id')}, ${c('title')}, ${c('year')}, ${c('copies')} are <b>private</b> in ${c('LibraryItem')}: ${c('Book')} cannot set them. It hands them to the parent's constructor — on the <b>first line</b>.</p>`, 'lam') +
    psql(raJava('lab4/LabBayQuenSuper'), { title: 'real output — LabBayQuenSuper (the starter does the same to every book)', sm: true }) +
    box('No compile error!', `<p style="margin:0">Without ${c('super(...)')} javac silently inserts ${c('super()')} — our parent HAS an empty JavaBean constructor — so the title stays ${c('""')} and the year ${c('0')}.</p>`, 'do2') },

  /* 6 */
  { t: 'TODO 4.2 and 4.3 — @Override six methods', body: two(
    j(de(boChuThich(tep(`${S}/model/Magazine.java`, [38, 48])))),
    j(de(boChuThich(tep(`${S}/model/Magazine.java`, [50, 60]))))) +
    j(de(boChuThich(tep(`${S}/model/Magazine.java`, [62, 72])))) +
    box('', `<p style="margin:0">${c('Dvd')} is the same with ${c('DVD_…')} constants and ${c('minutes')}. The title is read with ${c('getTitle()')}: the child does not see the parent's <b>private</b> field. (comments hidden)</p>`, 'lam') },

  /* 7 */
  { t: 'Why @Override: two mistakes javac now catches', body: two(
    j('// Magazine — forgot "public"\n@Override\nint getLoanDays() {\n    return Constants.MAGAZINE_LOAN_DAYS;\n}'),
    j('// Dvd — one letter missing\n@Override\npublic int getLoanDay() {\n    return Constants.DVD_LOAN_DAYS;\n}')) +
    psql(ra('lab4/bay/ghi-de-sai:javac'), { title: 'javac --release 8 — real errors (bay/ghi-de-sai)', sm: true }) +
    box('Without @Override', `<p style="margin:0">${c('getLoanDay()')} would be a brand-new method nobody calls: the parent's <b>0 days</b> would run, silently. ${c('@Override')} turns that silence into a compile error.</p>`, 'ok') },

  /* 8 */
  { t: 'One list, three classes — one place knows them', body:
    j(de(boChuThich(tep(`${S}/repository/BookRepository.java`, [133, 155])))) + two(
      box('Upcasting', `<p style="margin:0">${c('return new Magazine(...)')} as a ${c('LibraryItem')}: automatic, always safe.</p>`, 'lam'),
      box('Only here', `<p style="margin:0">the only code naming the 3 classes (given).</p>`, 'ok')) },

  /* 9 */
  { t: 'TODO 4.4 — every object answers for itself', body: j(boChuThich(ham(`${S}/repository/BookRepository.java`, 'toResponseDTO'))) +
    psql(R(13, 19), { title: 'real output — option 2: one loop, three kinds of rows', sm: true }) +
    box('', `<p style="margin:0">One loop over ${c('ArrayList<LibraryItem>')}; no ${c('if')}, no cast. The <b>Days</b>, <b>Fee</b> and <b>Detail</b> columns differ because each object runs its <b>own</b> override.</p>`, 'ok') },

  /* 10 */
  { t: 'How a polymorphic call is decided — two gates', body: haiCua({ h: 310 }) +
    two(box('javac', `<p style="margin:0">checks the call against the <b>declared type</b> only. A method that only ${c('Book')} has (${c('getIsbn()')}) cannot be called on a ${c('LibraryItem')} variable.</p>`, 'lam'),
      box('JVM', `<p style="margin:0">picks the body from the <b>object</b> at run time (dynamic dispatch, ${c('invokevirtual')}). Same line of code, three behaviours.</p>`, 'ok')) },

  /* 11 */
  { t: 'TODO 4.5 — the late fee: one formula for every type', body: j(boChuThich(ham(`${S}/service/BookService.java`, 'calculateLateFee'))) +
    psql(boNhac([R(76, 77), R(90, 91), R(104, 105), R(119, 120)].join('\n')), { title: 'real output — option 9: book 20 days, magazine 10, DVD 3, DVD 5 (prompts trimmed)', sm: true }) },

  /* 12 */
  { t: 'Trap: computing the fee with an instanceof chain', body: j(ma('lab4/LabBayInstanceof', [24, 36]).replace(/\s+\/\/ AudioBook falls here$/m, '   // AudioBook falls here')) +
    psql(raJava('lab4/LabBayInstanceof'), { title: 'real output — a teammate adds AudioBook next month' }) +
    box('Open for extension', `<p style="margin:0">The if-chain must be edited for every new class — and forgetting it costs <b>0 đ</b>, silently. The polymorphic line never changes: the new class brings its own fee.</p>`, 'do2') },

  /* 13 */
  { t: 'Trap: hiding is not overriding', body: psql(raJava('lab4/LabBayCheGiau'), { title: 'real output — LibraryItem item = new Dvd();' }) + two(
    j(ma('lab4/LabBayCheGiau', [3, 18]).replace(/\s+\/\/[^\n]*/g, '').replace(/\n\n/g, '\n')),
    box('The rule (4.A-3)', `<p style="margin:0">Only <b>instance methods</b> are overridden and chosen by the object. A re-declared <b>field</b> and a <b>static</b> method are <b>hidden</b>: chosen by the declared type.</p><p style="margin:8px 0 0">CT Library: fields private, no static in model — the trap cannot happen there.</p>`, 'lam')) },

  /* 14 */
  { t: 'Trap: the downcast that compiles and still fails', body:
    j(de(ma('lab4/LabBayEpKieu', [19, 32]).replace(/\s+\/\/[^\n]*/g, ''))) + two(
      psql(raJava('lab4/LabBayEpKieu'), { title: 'real output — JDK 8 (the exam machine)' }),
      box('', `<p style="margin:0">javac accepts ${c('(Book) item')}: a ${c('LibraryItem')} <i>might</i> be a Book. The JVM checks the real object and throws ${c('ClassCastException')}. CT Library never casts: it asks ${c('item.getDetail()')}.</p>`, 'do2')) },

  /* 15 */
  { t: 'Green: PASS 199/199, a silent reviewer, zero instanceof', body: two(
    col(psql(ra('lab4/solution:check'), { title: './check.sh' }), psql(ra('lab4/solution:lint'), { title: 'python3 lint.py' }),
      sh('$ grep -rn instanceof src/\n$', { title: 'terminal — no output = not one instanceof' })),
    col(box('The order that works', `<p style="margin:0">4.1 ${c('super')} → run ⇒ titles come back · 4.2 Magazine · 4.3 Dvd → run ⇒ "Tap chi", "DVD" · 4.4 → the Days / Fee / Detail columns · 4.5 → option 9. ${c('check.sh')} after each.</p>`, 'ok'),
      box('The starter, before any TODO', `<p style="margin:0">Year 0, copies 0, ids ${c('I005')} … and ${c('null')} in Detail: every symptom points at one missing piece.</p>`, 'lam'))), giua: true },

  /* 16 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      [`Book constructor with ${c('super(...)')} (4.1)`, '1'],
      [`Magazine + Dvd: 12 overrides, all ${c('@Override public')} (4.2, 4.3)`, '3'],
      [`toResponseDTO without ${c('if')}/cast (4.4)`, '2'],
      ['Late fee in the service, one formula (4.5)', '2'],
      [`${c('lint.py')} ✓ and ${c('grep instanceof')} empty`, '1'],
      ['Oral: "overloading vs overriding?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why does the starter compile without ${c('super(...)')}?<br>2. ${c('LibraryItem item = new Dvd();')} — which ${c('getLoanDays()')} runs?<br>3. Where is the only ${c('switch')} on the item type, and why there?</p>`, 'lam'),
      box('Next: Lab 5', `<p style="margin:0">${c('LibraryItem')} becomes ${c('abstract')} (no more "0 days"), the repository becomes the <b>interface</b> ${c('IBookRepository')} + ${c('InMemoryBookRepository')}, and fees follow an ${c('IFeePolicy')}.</p>`, 'ok'))), giua: true },
]);
