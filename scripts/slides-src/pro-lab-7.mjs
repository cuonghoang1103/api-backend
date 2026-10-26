/**
 * pro-lab-7 — PRO192 · Lab 7 · CT Library "Working with a list of objects" (slide EN, khuôn _pro-chung, agent pro-lab67 26/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab7 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 297/297; starter = 5 TODO; bay/xoa-foreach = CME thật, bay/xoa-xuoi = bỏ sót T005, bay/so-sanh-bang = == chuỗi,
 * bay/mang-null = NPE thật) và gen/java/lab7/*.java (chạy thật; LabBayMangNull = JDK 8 thật).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-7.mjs --out <dir>   ⇒ <dir>/lab7/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, luong, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab7', code: 'PRO192 Lab 7', title: 'Lab 7 — CT Library: working with a list of objects', sub: 'multi-criteria search · 4-key Comparator · array of objects · remove while looping' };

const S = 'lab7/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const NHAC = /^(?:Lua chon: |Loai \(0 Tat ca, 1 Sach, 2 Tap chi, 3 DVD\): |Tu nam: |Den nam: |Tu khoa trong ten \(Enter = bo qua\): )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('lab7/solution:run', [a, b]));
const ST = (a, b) => boNhac(ra('lab7/starter:run', [a, b]));
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const gon = (src) => src.split('\n').map((l) => (/^\s*\/\//.test(l) ? l : l.replace(/\s+\/\/.*$/, ''))).join('\n');
// bảng tài liệu: giữ No, Id, Type, Year, Copies + Title (bỏ Days, Fee, Detail) cho vừa nửa slide
const cot = (t) => t.split('\n').map((l) => (/^(No |\d+ )/.test(l) ? (l.slice(0, 32) + l.slice(45, 75)).trimEnd() : l)).join('\n');
const ngan = (t) => t.split('\n').map((l) => (l.slice(0, 10) + l.slice(19, 25) + l.slice(45, 75)).trimEnd()).join('\n');   // No, Id, Year, Title
const bo = (t, n) => t.split('\n').map((l) => l.replace(new RegExp(`^(.{${n}}).+$`), '$1')).join('\n');   // cắt cột (bảng rộng)

/* Hình: danh sách giữ THAM CHIẾU — dãy ô itemList[0..5], mỗi ô một mũi tên tới một đối tượng trên heap */
function hinhThamChieu() {
  const O = [['B001', 'Book', 3], ['B002', 'Book', 0], ['B003', 'Book', 0], ['B004', 'Book', 0], ['T005', 'Magazine', 0], ['D006', 'Dvd', 1]];
  const W = 1110, h = 300;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mrf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${CAM}"/></marker></defs>`;
  s += `<text x="10" y="40" font-size="18" font-weight="700" fill="${PG}" font-family="Menlo,monospace">itemList</text>`;
  s += `<text x="10" y="215" font-size="16" fill="#555">heap</text>`;
  O.forEach(([id, lop, so], i) => {
    const x = 130 + i * 160;
    s += `<rect x="${x}" y="15" width="120" height="44" rx="6" fill="#fff" stroke="${PG}" stroke-width="2.5"/>`;
    s += `<text x="${x + 112}" y="78" text-anchor="end" font-size="14" fill="#555" font-family="Menlo,monospace">[${i}]</text>`;
    s += `<circle cx="${x + 60}" cy="37" r="6" fill="${CAM}"/>`;
    s += `<line x1="${x + 60}" y1="43" x2="${x + 60}" y2="168" stroke="${CAM}" stroke-width="2.5" marker-end="url(#mrf)"/>`;
    const m = lop === 'Book' ? NAU : lop === 'Magazine' ? TIM : XANH;
    s += `<rect x="${x - 5}" y="172" width="130" height="86" rx="10" fill="${m}18" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + 60}" y="198" text-anchor="middle" font-size="15" font-weight="700" fill="${m}">${lop}</text>`;
    s += `<text x="${x + 60}" y="222" text-anchor="middle" font-size="17" font-weight="700" fill="#262626" font-family="Menlo,monospace">${id}</text>`;
    s += `<text x="${x + 60}" y="246" text-anchor="middle" font-size="14" fill="#444">copies ${so}</text>`;
  });
  s += `<text x="555" y="290" text-anchor="middle" font-size="15" fill="#555">each cell holds an <tspan font-weight="700" fill="${CAM}">arrow</tspan> (a reference) — the objects live on the heap</text>`;
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Lab 7 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 7 — CT Library:<br>a list of objects', sub: 'After Chapter 7 · search on three criteria · sort on four keys · count with an array of objects · remove while looping, safely' },

  /* 2 */
  { t: 'Ticket CTL-7 — a crowded shelf', body: two(
    box('The team lead wrote', `<p style="margin:0 0 6px">1. "Books from <b>2006 to 2019</b> with <b>java</b> in the title" — search on several criteria.</p>
<p style="margin:0 0 6px">2. Results by <b>type</b>, <b>newest first</b>, then by <b>title</b>.</p>
<p style="margin:0 0 6px">3. A table: titles, copies, loans <b>per type</b>.</p>
<p style="margin:0">4. Throw out items with <b>0 copies</b> — never one somebody is holding. And no ${c('instanceof')}.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 297/297</b>`,
      `${c('lint.py')}: <b>✓ sạch</b>`,
      `zero ${c('instanceof')} in ${c('src/')}`,
      'the clean-out removes exactly <b>B002, B004, T005</b>',
      '…and keeps <b>B003</b> (0 copies, but on loan)',
    ]))), giua: true },

  /* 3 */
  { t: 'A list of objects holds references, not objects', body: hinhThamChieu() + two(
    box('Chapter 7, one picture', `<p style="margin:0">${c('Item[]')} of the antique shop and ${c('ArrayList<LibraryItem>')} here: a row of cells, each with an <b>arrow</b>. ${c('remove(i)')} moves arrows, not objects.</p>`, 'lam'),
    box('Three traps hide in it', `<p style="margin:0">a cell never given an object holds ${c('null')} (NPE) · removing while walking shifts the cells under your feet · two arrows to equal texts may be two objects (${c('==')}).</p>`, 'do2')), giua: true },

  /* 4 */
  { t: 'Inside remove(i): every later cell shifts left', body: two(
    j(['// LabXoaMang — the removeAt of Chapter 7\'s ItemList', de(gon(ma('lab7/LabXoaMang', [9, 15])))].join('\n')),
    box('What it costs', `<p style="margin:0">Removing cell 1 of 5 copies <b>3</b> cells. In general O(n) moves — the reason CSD201 meets linked lists. ${c('ArrayList.remove(i)')} does exactly this, with ${c('System.arraycopy')}.</p>`, 'lam')) +
    P(raJava('lab7/LabXoaMang'), { title: 'real output — LabXoaMang', sm: true }) },

  /* 5 */
  { t: 'TODO 7.1 — filter by type without instanceof', body: vsd(
    j(de(tep('lab7/starter/src/repository/InMemoryBookRepository.java', [212, 220]))),
    j(['// LibraryItem', 'public abstract int getItemType();', '', '// Book (Magazine, Dvd: their own constant)', '@Override', 'public int getItemType() {', '    return Constants.TYPE_BOOK;', '}', '', '// InMemoryBookRepository.toResponseDTO', 'responseDTO.setItemType(item.getItemType());'].join('\n')),
    '✗ starter: a chain of instanceof', '✓ solution: the object answers') +
    box('', `<p style="margin:0">The chain prints the same output — that is the trap: a 4th type compiles and lands in the final ${c('else')} as a DVD. With an <b>abstract</b> method, javac refuses the new class until it answers "what type am I?".</p>`, 'do2') },

  /* 6 */
  { t: 'TODO 7.2 — three criteria at once', body:
    j(boChuThich(de(ham(`${S}/service/BookService.java`, 'search')))) + two(
      P(R(130, 130).replace(/^(Den nam phai.*)$/m, '$1'), { title: 'Validation.getYearTo — real', sm: true }),
      P(cot(R(158, 160)), { title: 'type 1 · 2006–2019 · "java" — real', sm: true })) },

  /* 7 */
  { t: 'TODO 7.3 — one Comparator, four keys', body: two(
    j(['// inside new Comparator<BookResponseDTO>() { … compare(first, second) }', boChuThich(de(tep(`${S}/service/BookService.java`, [175, 193])))].join('\n')),
    col(P(ngan(ST(159, 160)), { title: 'starter — key 1 only', sm: true }),
      P(ngan(R(137, 138)), { title: 'solution — real', sm: true }),
      box('', `<p style="margin:0">Descending = swap the arguments. Key 4 (the id) makes the order unique.</p>`, 'lam')), 'r73') },

  /* 8 */
  { t: 'The same order with Java 8: comparing().thenComparing()', body:
    j(de(gon(ma('lab7/LabNhieuKhoa', [37, 41])))) + two(
      P(raJava('lab7/LabNhieuKhoa'), { title: 'real output — LabNhieuKhoa', sm: true }),
      box('Exam room?', `<p style="margin:0">Java 8 — it compiles on the JDK 8 of the PE. The lab keeps the anonymous class: every step is visible, and the reviewer will ask you to explain each ${c('if (result == 0)')}.</p>`, 'ok')), giua: true },

  /* 9 */
  { t: 'TODO 7.4 — an array of objects starts full of null', body: two(
    j(boChuThich(de([tep(`${S}/service/BookService.java`, [209, 217]), tep(`${S}/service/BookService.java`, [219, 230])].join('\n')))),
    col(P(R(108, 112), { title: 'option 13 — real output' }),
      box('Why an array here', `<p style="margin:0">Exactly <b>3</b> types, and the type number <b>is</b> the index: cell ${c('getItemType() - 1')}. A fixed size is the one place an array beats an ArrayList.</p>`, 'lam')), 'r73') },

  /* 10 */
  { t: 'Trap: forget to new the cells — NullPointerException', body:
    P(ra('lab7/bay/mang-null:run', [107, 112]), { title: 'bay/mang-null — the loop that creates the cells removed (JDK 21, real)', sm: true }) + two(
      P(raJava('lab7/LabBayMangNull'), { title: 'LabBayMangNull — a real JDK 8 (exam room)', sm: true }),
      box('Read the line, find the null', `<p style="margin:0">Helpful NPE messages arrived in Java 14; JDK 8 gives only the class and the line. Ask: <b>which reference on this line was never given an object?</b></p>`, 'do2')) },

  /* 11 */
  { t: 'TODO 7.5 — remove at index, walking backwards', body: two(
    j(boChuThich(de(ham(`${S}/repository/InMemoryBookRepository.java`, 'deleteOutOfStock')))),
    col(P(R(218, 218) + '\n' + R(236, 236), { title: 'option 14, twice — real output', sm: true }),
      box('Why backwards', `<p style="margin:0">${c('remove(i)')} shifts only the cells <b>after</b> i — already visited. Nothing slides into a position you have not checked yet.</p>`, 'ok'),
      box('Why B003 stays', `<p style="margin:0">0 copies because M001 holds it. The controller passes the loaned ids from ${c('LoanRepository')}.</p>`, 'lam')), 'r64') },

  /* 12 */
  { t: 'Trap: for-each + remove = ConcurrentModificationException', body: two(
    j(['// bay/xoa-foreach — "shorter"', de(tep('lab7/bay/xoa-foreach/src/repository/InMemoryBookRepository.java', [152, 159]))].join('\n')),
    box('Unchecked = a bug', `<p style="margin:0">for-each hides an ${c('Iterator')}; ${c('next()')} sees the list changed behind its back and throws. Nobody catches it — the whole menu dies. The cure is a correct loop, not a ${c('catch')}.</p>`, 'do2')) +
    P(ra('lab7/bay/xoa-foreach:run', [217, 224]), { title: 'bay/xoa-foreach — option 14 (real; JDK 8 prints no java.base/)', sm: true }) },

  /* 13 */
  { t: 'Trap: walking forwards skips the next cell', body:
    P(raJava('lab7/LabXoaAnToan'), { title: 'real output — LabXoaAnToan: four loops on the same list', sm: true }) +
    P(bo(ra('lab7/bay/xoa-xuoi:check'), 120), { title: './check.sh — bay/xoa-xuoi (for (int i = 0; …; i++) + remove(i))', sm: true }) +
    box('', `<p style="margin:0">B004 and T005 sit side by side: removing B004 at i slides T005 into i, then ${c('i++')} jumps over it. No crash — only the grader notices.</p>`, 'do2') },

  /* 14 */
  { t: 'Trap: == compares addresses, not text', body: two(
    j(['// bay/so-sanh-bang — findItemById', boChuThich(de(tep('lab7/bay/so-sanh-bang/src/repository/InMemoryBookRepository.java', [194, 199])))].join('\n')),
    P(raJava('lab7/LabBaySoSanhChuoi'), { title: 'real output — LabBaySoSanhChuoi (input: b001)', sm: true })) +
    P(bo(ra('lab7/bay/so-sanh-bang:check', [1, 3]), 150), { title: './check.sh — bay/so-sanh-bang', sm: true }) +
    box('', `<p style="margin:0">The stored id comes from ${c('String.format')}, the typed id from ${c('nextLine()')}: two objects, same text ⇒ ${c('==')} is false. Two literals share one pooled object — that is why quick tests sometimes pass. Use ${c('equals')}, always.</p>`, 'lam') },

  /* 15 */
  { t: 'One request through the layers: "14 — clean the shelf"', body: luong([
    ['Main', 'option 14\n(no input)', PG],
    ['BookController', 'purgeOutOfStock()\ncalls both\nrepositories', NAU],
    ['LoanRepository', 'findLoaned-\nItemIdList()\n→ [B003]', XANH],
    ['IBookRepository', 'deleteOutOfStock\n(loanedIdList)\nbackwards loop', XANH],
    ['BookView', 'display()\n1 line', PG],
  ], { h: 220, fs: 17 }) + P(R(217, 218), { title: 'real output', sm: true }) + two(
    box('Two repositories ⇒ the controller', `<p style="margin:0">The decision needs data from both, and only the controller holds both. The service still holds none.</p>`, 'lam'),
    box('The contract grew', `<p style="margin:0">${c('IBookRepository')} gained ${c('deleteOutOfStock')}: Lab 9's ${c('FileBookRepository')} must implement it too.</p>`, 'ok')), giua: true },

  /* 16 */
  { t: 'Green: PASS 297/297 and a silent reviewer', body: two(
    col(psql(ra('lab7/solution:check'), { title: './check.sh' }), psql(ra('lab7/solution:lint'), { title: 'python3 lint.py — solution' }),
      P(ra('lab7/starter:check').split('\n').slice(-1)[0], { title: './check.sh — the starter', sm: true })),
    col(box('The order that works', `<p style="margin:0">7.1 abstract ${c('getItemType()')} (same output) · 7.2 filter · 7.3 keys 2–4 · 7.4 the array · 7.5 the backward loop ⇒ <b>green</b>.</p>`, 'ok'),
      box('Last check', `<p style="margin:0">Search ${c('src/')} for ${c('instanceof')}: <b>zero hits</b>. Option 14 twice: 3 removed, then nothing.</p>`, 'lam'))), giua: true },

  /* 17 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      [`${c('getItemType()')} abstract, no ${c('instanceof')} (7.1)`, '2'],
      ['Three-criteria search (7.2)', '2'],
      ['Four-key comparator (7.3)', '1'],
      ['Array of objects + total row (7.4)', '2'],
      ['Backward removal, loaned items kept (7.5)', '2'],
      ['Oral: "remove while looping — how?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why does the clean-out loop run backwards?<br>2. What does ${c('new TypeStatDTO[3]')} contain?<br>3. How do you get "newest first" in a comparator?</p>`, 'lam'),
      box('Next: Lab 8', `<p style="margin:0">Collections for real: members in a ${c('HashMap')} by id, loan history as a ${c('Map')} of lists, ${c('equals')}/${c('hashCode')}, a top-5 report.</p>`, 'ok'))), giua: true },
]);
