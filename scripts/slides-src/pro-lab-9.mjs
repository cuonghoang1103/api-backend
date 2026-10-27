/**
 * pro-lab-9 — PRO192 · Lab 9 · CT Library "Saving to a file" (slide EN, khuôn _pro-chung, agent pro-lab89 27/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab9 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 260/260 qua HAI lần chạy — lưu rồi mở lại; starter = 5 TODO; bay/khong-quote, bay/quen-close, bay/quen-bom chạy thật;
 * :data = nội dung thật các tệp data/ sau lần chấm) và gen/java/lab9/*.java (JDK 8 thật trùng máy).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-9.mjs --out <dir>   ⇒ <dir>/lab9/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, luong, soDoLop, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab9', code: 'PRO192 Lab 9', title: 'Lab 9 — CT Library: saving to a file', sub: 'FileBookRepository · CSV in UTF-8 · broken lines · temp file · one line to switch' };

const S = 'lab9/solution/src';
const F = `${S}/repository/FileBookRepository.java`;
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const NHAC = /^(?:Lua chon: |Ma tai lieu \(vi du B001, T005, D006\): |So ban: |Tu khoa: )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('lab9/solution:run', [a, b]));
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const cot = (t) => t.split('\n').map((l) => (/^(No |\d+ )/.test(l) ? (l.slice(0, 10) + l.slice(19, 32) + l.slice(45, 75)).trimEnd() : l)).join('\n');   // No, Id, Year, Copies, Title
const bom = (t) => t.replace(/﻿/g, '<BOM>');

/* Hình: một dòng CSV đi qua split(",") và qua splitLine */
function hinhTach() {
  const W = 1110, h = 230;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 16}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial">`;
  const hang = (y, cells, mau, nhan) => {
    s += t(8, y + 30, nhan, { a: 'start', b: true, m: mau, fs: 15 });
    let x = 150;
    cells.forEach(([txt, w, bad]) => {
      s += `<rect x="${x}" y="${y}" width="${w}" height="46" rx="6" fill="${bad ? DO + '18' : mau + '12'}" stroke="${bad ? DO : mau}" stroke-width="2"/>` + t(x + w / 2, y + 29, txt, { mono: true, fs: 14, b: !!bad, m: bad ? DO : '#262626' });
      x += w + 6;
    });
  };
  hang(10, [['1', 38], ['B003', 66], ['"Refactoring', 150, 1], [' Second Edition"', 190, 1], ['2018', 60], ['1', 38], ['9780134757599', 150], ['Martin Fowler', 140]], DO, 'split(",") · 8');
  hang(80, [['1', 38], ['B003', 66], ['Refactoring, Second Edition', 346], ['2018', 60], ['1', 38], ['9780134757599', 150], ['Martin Fowler', 140]], XANH, 'splitLine · 7');
  s += `<rect x="0" y="150" width="${W}" height="70" rx="10" fill="${CAM}10" stroke="${CAM}" stroke-width="2"/>`;
  s += t(555, 178, 'inside quotes: a comma is TEXT · "" is one real quote · a quote never closed ⇒ broken line', { b: true, fs: 17 });
  s += t(555, 205, 'outside quotes: a comma ends the value · the last value is added after the loop', { fs: 16, m: '#555' });
  return s + '</svg>';
}

/* Hình: lưu qua tệp tạm — 3 bước */
function hinhTepTam() {
  const W = 1110, h = 200;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 16}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mtt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  const hop = (x, w, tieu, phu, mau) => { s += `<rect x="${x}" y="20" width="${w}" height="110" rx="12" fill="${mau}12" stroke="${mau}" stroke-width="2.5"/>` + t(x + w / 2, 58, tieu, { b: true, mono: true, fs: 17, m: mau }) + t(x + w / 2, 90, phu[0], { fs: 15 }) + t(x + w / 2, 114, phu[1], { fs: 15, m: '#555' }); };
  hop(0, 330, '① books.csv.tmp', ['write EVERY line', 'try-with-resources'], CAM);
  hop(390, 330, '② close()', ['buffer → disk', 'checkError()?'], NAU);
  hop(780, 330, '③ Files.move', ['tmp → books.csv', 'REPLACE_EXISTING'], XANH);
  s += `<line x1="332" y1="75" x2="386" y2="75" stroke="${NAU}" stroke-width="3" marker-end="url(#mtt)"/><line x1="722" y1="75" x2="776" y2="75" stroke="${NAU}" stroke-width="3" marker-end="url(#mtt)"/>`;
  s += `<rect x="0" y="146" width="${W}" height="46" rx="8" fill="${XANH}10" stroke="${XANH}" stroke-width="2"/>` + t(555, 176, 'crash at ① or ② ⇒ books.csv is still the old, complete file — only the .tmp is broken', { b: true, fs: 17, m: XANH });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Lab 9 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 9 — CT Library:<br>saving to a file', sub: 'After Chapter 9 · FileBookRepository · CSV in UTF-8 · broken lines reported · a temp file · one line to switch' },

  /* 2 */
  { t: 'Ticket CTL-9 — close the app, lose the shelf', body: two(
    box('The team lead wrote', `<p style="margin:0 0 6px">"Forty books typed on Saturday — on Monday the shelf was <b>empty</b>."</p>
<p style="margin:0 0 6px">Keep the items in a file Excel can open. Our old export has <b>broken lines</b> — keep the good ones.</p>
<p style="margin:0 0 6px">Titles with <b>commas</b>, titles with <b>accents</b>.</p>
<p style="margin:0">And do not rewrite the program — <b>Lab 5 promised a small change</b>.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 260/260</b> — run, then <b>reopen</b>`,
      `${c('lint.py')}: <b>✓ sạch</b>`,
      '4 broken lines reported, <b>with line numbers</b>',
      '"Mắt Biếc" keeps its accents',
      `exactly <b>one line</b> of ${c('BookController')} changed`,
    ]))), giua: true },

  /* 3 */
  { t: 'The seam from Lab 5 pays off: one line', body: soDoLop([
    { id: 'M', ten: 'Main', x: 0, y: 30, w: 150, mau: PG, nho: 'unchanged' },
    { id: 'C', ten: 'BookController', x: 205, y: 20, w: 400, mau: NAU, tr: ['- bookRepository: IBookRepository'], hl: true },
    { id: 'R', ten: 'IBookRepository', kieu: 'interface', x: 690, y: 0, w: 420, mau: XANH, pt: ['addItem · updateCopies · deleteItem', 'deleteOutOfStock (+ StorageException)', 'findLoadErrorList()'] },
    { id: 'I', ten: 'InMemoryBookRepository', x: 400, y: 330, w: 330, mau: XANH, nho: 'Lab 5–8 · ArrayList<LibraryItem>' },
    { id: 'F', ten: 'FileBookRepository', x: 790, y: 330, w: 320, mau: CAM, hl: true, nho: 'Lab 9 · data/books.csv' },
  ], [
    { tu: 'M', den: 'C', kieu: 'dung' },
    { tu: 'C', den: 'R', kieu: 'dung', nhan: 'calls only the contract', dy: -8 },
    { tu: 'I', den: 'R', kieu: 'cai', x1: 640, x2: 760 },
    { tu: 'F', den: 'R', kieu: 'cai', x1: 950, x2: 950, nhan: 'implements', dx: 10 },
    { tu: 'F', den: 'I', kieu: 'dung', nhan: 'has a', dy: -8 },
  ], { w: 1110, h: 450 }) + j(de(tep(`${S}/controller/BookController.java`, [79, 80]))) },

  /* 4 */
  { t: 'FileBookRepository HAS an InMemoryBookRepository', body: two(
    j(de(boChuThich(tep(F, [62, 70]))) + '\n\n// … updateCopies, deleteItem, deleteOutOfStock: the same shape\n' + de(boChuThich(tep(F, [100, 103])))),
    col(box('Why not copy the CRUD?', `<p style="margin:0">Two copies drift apart. The file class adds only <b>load</b> and <b>save</b>.</p>`, 'lam'),
      box('Why not extends?', `<p style="margin:0">${c('InMemoryBookRepository.addItem')} promises only ${c('DuplicateKeyException')}; an override may <b>not add</b> ${c('StorageException')}. The interface declares it; the memory version simply never throws it.</p>`, 'do2'),
      box('Composition', `<p style="margin:0">"has-a" beats "is-a" when you only need to <b>reuse</b> — Effective Java, item 18.</p>`, 'ok')), 'r64') },

  /* 5 */
  { t: 'The file: books.csv, one item per line', body: two(
    P(ra('lab9/solution:data', [1, 8]), { title: 'data/books.csv after the grader\'s runs — real', sm: true }),
    col(tbl(['Columns', 'Value'], [
      ['1–5 (all)', 'type, id, title, year, copies'],
      ['6–7 book', 'ISBN, author'],
      ['6 magazine', 'issue'],
      ['6 DVD', 'minutes'],
    ]), box('No instanceof', `<p style="margin:0">${c('getExtraValueArray()')} is abstract in ${c('LibraryItem')}: each object answers its own columns.</p>`, 'ok')), 'r64') },

  /* 6 */
  { t: 'TODO 9.1 — a CSV line is not split(",")', body: hinhTach() + P(raJava('lab9/LabTachCsv'), { title: 'real output — LabTachCsv', sm: true }) },

  /* 7 */
  { t: 'TODO 9.2 — load: name the encoding, count the lines', body:
    j(de(boChuThich(tep(F, [148, 162]))).replace('if (line.equals(Constants.CSV_HEADER)) {\n                continue;\n            }', 'if (line.equals(Constants.CSV_HEADER)) { continue; }') +
      '\n        // blank line: continue\n' + de(boChuThich(tep(F, [170, 172]))).replace(/^/gm, '        ') + '\n            // "dong N: reason", isBackupNeeded = true\n        }\n    }\n}   // catch (IOException e): one message, keep what was loaded') +
    P(R(1, 5), { title: 'start of the grader\'s run — real', sm: true }) },

  /* 8 */
  { t: 'One bad line never sinks the shelf', body: tbl(['Line of books.csv', 'Caught by', 'Reported as'], [
    [c('1,B008,Head First Java,20O5,…'), c('Validation.getYear'), '"Nam xuat ban phai la 1 so nguyen…"'],
    [c('2,T009,Java Magazine,2025,1'), 'column count', '"can 6 cot, co 5"'],
    [c('4,X010,Mystery Box,…'), 'type check', `"loai '4' khong hop le"`],
    [c('1,B011,…,9780134685991,…'), c('addLoadedItem'), '"Trung ISBN … B002"'],
    ['(blank line 9)', '—', 'skipped silently'],
  ]) + two(
    box('One try per line', `<p style="margin:0">The ${c('try')} sits <b>inside</b> the loop: a broken line becomes one message, the loop goes on — <b>7 good lines</b> loaded.</p>`, 'ok'),
    box('Before the first save', `<p style="margin:0">Broken lines are not written back ⇒ the original is copied to ${c('books.csv.bak')}. "Moi nhap lai" is cut: a file cannot be asked again.</p>`, 'lam')), giua: true },

  /* 9 */
  { t: 'Trap: the machine\'s default encoding', body: two(
    vsd(j(['// JDK 8: the machine\'s default charset', 'new BufferedReader(new FileReader(file));'].join('\n')),
      j(['// named, the same on every machine', 'new BufferedReader(new InputStreamReader(', '        new FileInputStream(file),', '        StandardCharsets.UTF_8));'].join('\n')), '✗ Cp1252 on many Windows', '✓ UTF-8, always'),
    box('Hidden on the grader', `<p style="margin:0">The lab runs with ${c('-Dfile.encoding=UTF-8')}, so the bug only appears on a classmate's Windows laptop. ${c('FileReader(file, charset)')}: Java 11+. Default UTF-8: Java 18+.</p>`, 'do2'), 'r64') +
    P(raJava('lab9/LabBangMa').split('\n').slice(0, 4).join('\n'), { title: 'real output — LabBangMa', sm: true }) },

  /* 10 */
  { t: 'Trap: the BOM nobody sees', body: two(
    j('// line 1: strip the BOM, then skip the header\n' + de(boChuThich(tep(F, [155, 162])))),
    col(P(raJava('lab9/LabBangMa').split('\n').slice(-1)[0].replace(', after', ',\nafter'), { title: 'real — EF BB BF read back', sm: true }),
      box('Excel "CSV UTF-8", Notepad', `<p style="margin:0">They start the file with <b>EF BB BF</b> — one invisible char ${c('\\uFEFF')}. The header no longer equals the header.</p>`, 'lam')), 'r55') +
    P(bom(ra('lab9/bay/quen-bom:run', [1, 1])), { title: 'bay/quen-bom — the replace removed (real; <BOM> marks the invisible char)', sm: true }) },

  /* 11 */
  { t: 'TODO 9.3 — quote what needs quoting', body:
    j(boChuThich(ham(`${S}/utils/CsvUtils.java`, 'toCsvValue'))) + two(
    P(ra('lab9/bay/khong-quote:data', [1, 8]), { title: 'bay/khong-quote — the file it wrote (real)', sm: true }),
    P(ra('lab9/bay/khong-quote:check', [1, 9]).split('\n').filter((l) => /ban in|^Dong/.test(l)).slice(0, 6).join('\n'), { title: './check.sh — at the reopen (real)', sm: true })) },

  /* 12 */
  { t: 'TODO 9.4 — save through a temporary file', body: hinhTepTam() + two(
    j(de(boChuThich(tep(F, [286, 303]))).replace('Files.move(tempFile.toPath(), dataFile.toPath(), StandardCopyOption.REPLACE_EXISTING);', 'Files.move(tempFile.toPath(), dataFile.toPath(),\n        StandardCopyOption.REPLACE_EXISTING);')),
    P(raJava('lab9/LabTepTam'), { title: 'real output — LabTepTam: power off after 1 of 3 rows', sm: true }), 'r64') },

  /* 13 */
  { t: 'Trap: forget close() — a file of 0 bytes', body: vsd(
    j(['// bay/quen-close — "shorter"', 'PrintWriter writer = new PrintWriter(new OutputStreamWriter(', '        new FileOutputStream(tempFile), StandardCharsets.UTF_8));', 'writer.println(Constants.CSV_HEADER);', '// … every line …   (no close)'].join('\n')),
    j(['// solution', 'try (PrintWriter writer = new PrintWriter(…)) {', '    writer.println(Constants.CSV_HEADER);', '    // … every line …', '}   // close() here: the buffer reaches the disk'].join('\n')), '✗ the text stays in the buffer', '✓ try-with-resources closes it') + two(
    P(ra('lab9/bay/quen-close:data', [1, 1]), { title: 'bay/quen-close — data/ after the run (real)', sm: true }),
    P(ra('lab9/bay/quen-close:check', [1, 3]).replace(/^(  (?:can|ban in) +: )(.*)$/gm, (m, a, b) => a + cot(b)), { title: './check.sh — reopen shows Lab 8 samples (real)', sm: true }), 'r46') },

  /* 14 */
  { t: 'PrintWriter never throws — ask it', body:
    j(de(ma('lab9/LabPrintWriterImLang', [12, 21]).split('\n').map((l) => l.replace(/\s*\/\/ the stream is already closed.*$/, '   // already closed')).join('\n'))) + two(
    P(raJava('lab9/LabPrintWriterImLang'), { title: 'real output', sm: true }),
    box('So saveToFile asks', `<p style="margin:0">${c('writer.checkError()')} true ⇒ ${c('IOException')} ⇒ wrapped in ${c('StorageException')} (cause kept). It is a ${c('LibraryException')}: the controller shows "Khong ghi duoc tep …", the menu goes on.</p>`, 'ok'), 'r46') },

  /* 15 */
  { t: 'TODO 9.5 — the one line, then save and reopen', body:
    j(de(tep(`${S}/controller/BookController.java`, [79, 80]))) + two(
      P(cot(R(137, 144)), { title: 'run 1 — the last list (real)', sm: true }),
      P(R(165, 165) + '\n' + cot(R(186, 192)), { title: 'run 2 — the reopen (real)', sm: true })) +
    box('Not saved yet, on purpose', `<p style="margin:0">Members and loans are still in memory ⇒ the harness does not borrow. ${c('members.csv')} + ${c('loans.csv')} with the same pattern: the first challenge, and the final project.</p>`, 'lam') },

  /* 16 */
  { t: 'Green: PASS 260/260 and a silent reviewer', body: two(
    col(psql(ra('lab9/solution:check'), { title: './check.sh — two runs' }), psql(ra('lab9/solution:lint'), { title: 'python3 lint.py — solution' }),
      P(ra('lab9/starter:check').split('\n').slice(-1)[0], { title: './check.sh — the starter', sm: true })),
    col(box('The order that works', `<p style="margin:0">9.1 split (try it on the B003 line) · 9.3 its mirror · 9.2 load · 9.4 save · 9.5 <b>last</b> — switching early only moves the red.</p>`, 'ok'),
      box('One more run by hand', `<p style="margin:0">Delete ${c('data/books.csv')}, run: "Chua co tep …", the samples are added, a <b>new file</b> appears.</p>`, 'lam'))), giua: true },

  /* 17 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      [`Quote-aware ${c('splitLine')} + ${c('toCsvValue')} (9.1, 9.3)`, '2'],
      ['Load: UTF-8, BOM, header, broken lines (9.2)', '3'],
      [`Save: .tmp, ${c('Files.move')}, ${c('checkError')} (9.4)`, '2'],
      [`One line switches, ${c('Main')} unchanged (9.5)`, '2'],
      ['Oral: "why so little to change?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why name the encoding on JDK 8?<br>2. Why write to ${c('books.csv.tmp')} first?<br>3. Why does the file repository <b>hold</b> a memory one instead of extending it?</p>`, 'lam'),
      box('Next: CT Library 1.0', `<p style="margin:0">All three files, a report exported to a file, the full LAB211 checklist — then a third ${c('IBookRepository')} on PostgreSQL, ${c('Main')} unchanged once more.</p>`, 'ok'))), giua: true },
]);
