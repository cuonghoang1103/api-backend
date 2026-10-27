/**
 * pro-lab-8 — PRO192 · Lab 8 · CT Library "Collections for real" (slide EN, khuôn _pro-chung, agent pro-lab89 27/10/2026).
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/lab8 (đáp án qua lint.py LAB211 + javac --release 8 + JDK 8 thật,
 * PASS 588/588; starter = 5 TODO; bay/thieu-hashcode = 13 dòng đỏ, bay/get-null = NPE thật) và gen/java/lab8/*.java
 * (chạy thật; mọi tệp JDK 8 thật trùng máy, LabDemTanSuat = output JDK 8).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-lab-8.mjs --out <dir>   ⇒ <dir>/lab8/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, raJava, ma, col, boChuThich, luong, soDoLop, PG, NAU, XANH, CAM, TIM, XAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'lab8', code: 'PRO192 Lab 8', title: 'Lab 8 — CT Library: Collections for real', sub: 'HashSet + equals/hashCode · a map of lists · HashMap by id · TreeMap · top 5' };

const S = 'lab8/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const NHAC = /^(?:Lua chon: |Ma thanh vien \(vi du M001\): |Ma tai lieu \(vi du B001, T005, D006\): |So ban: )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('lab8/solution:run', [a, b]));
const ST = (a, b) => boNhac(ra('lab8/starter:run', [a, b]));
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const gon = (src) => src.split('\n').map((l) => (/^\s*\/\//.test(l) ? l : l.replace(/\s+\/\/.*$/, ''))).join('\n');
const bo = (t, n) => t.split('\n').map((l) => l.replace(new RegExp(`^(.{${n}}).+$`), '$1…')).join('\n');

/* Hình: bên trong HashSet — 16 ô, hashCode chọn ô, equals xác nhận trong ô */
function hinhBam(opts = {}) {
  const { h = 300, ghost = false } = opts;
  const W = 1110;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mbm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${CAM}"/></marker></defs>`;
  const bx = (i) => 20 + i * 67;
  for (let i = 0; i < 16; i++) {
    const hl = i === 14 || (ghost && i === 15);
    s += `<rect x="${bx(i)}" y="150" width="60" height="64" rx="6" fill="${hl ? (i === 14 ? XANH + '22' : DO + '18') : '#fff'}" stroke="${hl ? (i === 14 ? XANH : DO) : PG}" stroke-width="${hl ? 3 : 1.6}"/>`;
    s += t(bx(i) + 30, 238, String(i), { fs: 15, m: '#555', mono: true });
  }
  s += t(10, 140, 'HashSet<Loan> openLoanSet — 16 buckets', { a: 'start', b: true, m: PG, fs: 17 });
  if (!ghost) {
    s += `<rect x="${bx(14) - 2}" y="156" width="64" height="52" rx="6" fill="${XANH}"/>` + t(bx(14) + 30, 188, 'M001', { fs: 13, b: true, m: '#fff', mono: true }) + t(bx(14) + 30, 203, 'B001', { fs: 13, b: true, m: '#fff', mono: true });
    s += `<rect x="20" y="10" width="420" height="80" rx="10" fill="${CAM}14" stroke="${CAM}" stroke-width="2.5"/>` + t(230, 42, 'new Loan("M001", "B001")', { b: true, mono: true, fs: 19 }) + t(230, 72, 'a NEW object — another address', { fs: 16, m: '#555' });
    s += `<line x1="440" y1="50" x2="560" y2="50" stroke="${CAM}" stroke-width="3" marker-end="url(#mbm)"/>`;
    s += `<rect x="565" y="10" width="270" height="80" rx="10" fill="#fff" stroke="${CAM}" stroke-width="2.5"/>` + t(700, 42, '① hashCode() = 74603564', { b: true, fs: 17 }) + t(700, 72, '→ bucket 14', { fs: 17, b: true, m: XANH });
    s += `<line x1="835" y1="50" x2="${bx(14) + 30}" y2="148" stroke="${CAM}" stroke-width="3" marker-end="url(#mbm)"/>`;
    s += `<rect x="20" y="258" width="1070" height="38" rx="8" fill="${XANH}12" stroke="${XANH}" stroke-width="2"/>` + t(555, 284, '② equals() asked ONLY inside bucket 14 → true ⇒ add() = false (duplicate) · remove() = true (found)', { fs: 17, b: true, m: XANH });
  } else {
    s += `<rect x="${bx(14) - 2}" y="156" width="64" height="52" rx="6" fill="${DO}"/>` + t(bx(14) + 30, 188, 'M001', { fs: 13, b: true, m: '#fff', mono: true }) + t(bx(14) + 30, 203, 'B002', { fs: 13, b: true, m: '#fff', mono: true });
    s += `<rect x="20" y="10" width="520" height="80" rx="10" fill="${DO}12" stroke="${DO}" stroke-width="2.5"/>` + t(280, 42, 'stored in bucket 14 as M001-B001', { b: true, fs: 18 }) + t(280, 72, 'then loan.setItemId("B002")', { fs: 18, mono: true, m: DO, b: true });
    s += `<rect x="600" y="10" width="490" height="80" rx="10" fill="#fff" stroke="${DO}" stroke-width="2.5"/>` + t(845, 42, 'contains / remove now compute', { fs: 17 }) + t(845, 72, 'the hash of M001-B002 → bucket 15', { fs: 17, b: true, m: DO });
    s += `<line x1="845" y1="90" x2="${bx(15) + 30}" y2="148" stroke="${DO}" stroke-width="3" marker-end="url(#mbm)"/>`;
    s += `<rect x="20" y="258" width="1070" height="38" rx="8" fill="${DO}12" stroke="${DO}" stroke-width="2"/>` + t(555, 284, 'bucket 15 is empty ⇒ false — the loan is still in bucket 14, where nobody looks', { fs: 17, b: true, m: DO });
  }
  return s + '</svg>';
}

/* Hình: HashMap<String, ArrayList<Loan>> lịch sử — khoá → danh sách */
function hinhLichSu() {
  const W = 1110, h = 250;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mls" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  s += t(10, 24, 'HashMap<String, ArrayList<Loan>> historyMap', { a: 'start', b: true, m: PG, mono: true });
  const R = [['M001', ['B001', 'T005', 'B001']], ['M002', ['B001', 'B007', 'B004']], ['M003', ['B007', 'B002', 'D006']]];
  R.forEach(([k, ds], r) => {
    const y = 44 + r * 66;
    s += `<rect x="10" y="${y}" width="120" height="50" rx="8" fill="${PG}14" stroke="${PG}" stroke-width="2.5"/>` + t(70, y + 32, k, { b: true, mono: true, fs: 20 });
    s += `<line x1="132" y1="${y + 25}" x2="200" y2="${y + 25}" stroke="${NAU}" stroke-width="3" marker-end="url(#mls)"/>`;
    s += t(258, y + 31, 'ArrayList', { fs: 15, m: NAU, b: true });
    ds.forEach((id, i) => {
      const x = 320 + i * 130;
      const del = id === 'D006';
      s += `<rect x="${x}" y="${y}" width="118" height="50" rx="6" fill="${del ? '#f3f3f3' : '#fff'}" stroke="${del ? XAM : NAU}" stroke-width="2"/>` + t(x + 59, y + 32, id, { b: true, mono: true, fs: 18, m: del ? XAM : '#262626' });
    });
  });
  s += `<rect x="740" y="44" width="360" height="182" rx="10" fill="${CAM}10" stroke="${CAM}" stroke-width="2"/>`;
  s += t(920, 76, 'get("M004") → null', { mono: true, b: true, m: DO, fs: 18 });
  s += t(920, 106, '(never borrowed: no list yet)', { fs: 15, m: '#555' });
  s += t(920, 146, 'D006 deleted from the shelf —', { fs: 15, m: '#555' });
  s += t(920, 170, 'the history keeps it:', { fs: 15, m: '#555' });
  s += t(920, 200, '"(da xoa khoi kho)"', { fs: 17, b: true, mono: true });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Lab 8 · CT Library', bai: '' }, [
  /* 1 */
  { cover: true, t: 'Lab 8 — CT Library:<br>Collections for real', sub: 'After Chapter 8 · HashSet + equals/hashCode · a map of lists · HashMap by id · TreeMap · a top-5 report' },

  /* 2 */
  { t: 'Ticket CTL-8 — the club wants answers', body: two(
    box('The team lead wrote', `<p style="margin:0 0 6px">1. Someone borrowed <b>two copies</b> of one book on one card — one copy per title.</p>
<p style="margin:0 0 6px">2. Returns sometimes fail with <b>"you did not borrow this"</b>.</p>
<p style="margin:0 0 6px">3. Finding a member is a <b>full scan</b> — we will have 300.</p>
<p style="margin:0">4. Our <b>authors A–Z</b>, and 5. a <b>top 5 most borrowed</b>.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      `${c('check.sh')}: <b>PASS 588/588</b>`,
      `${c('lint.py')}: <b>✓ sạch</b> — concrete types only`,
      'the 2nd "M001 borrows B001" <b>refused</b>',
      `M001 returns B001 with a <b>new</b> ${c('Loan')}`,
      'top 5 cuts <b>D006</b>, the 6th',
    ]))), giua: true },

  /* 3 */
  { t: 'One question, one collection', body: tbl(['The program asks', 'Collection', 'Because'], [
    ['"Is this loan already open?"', c('HashSet<Loan>'), `${c('add')} returns false for a duplicate, ${c('remove')} finds by value`],
    ['"What did M001 ever borrow?"', c('HashMap<String, ArrayList<Loan>>'), 'one key → a list, in borrow order'],
    ['"Who is M003?"', c('HashMap<String, Member>'), `one ${c('get')}, no scan`],
    ['"Our authors, A–Z?"', c('TreeMap<String, Integer>'), 'unique keys, always sorted'],
    ['"How many loans per item?"', c('HashMap<String, Integer>'), 'id → count'],
    ['"Walk, filter, sort, remove at i"', c('ArrayList<LibraryItem>'), 'the shelf stays a list'],
  ]) + box('', `<p style="margin:0">Choosing is the skill: a <b>Set</b> answers "is it there?", a <b>Map</b> answers "what belongs to this key?", a <b>Tree</b> keeps its keys sorted. Every declaration names the concrete class — next slide.</p>`, 'lam'), giua: true },

  /* 4 */
  { t: 'ArrayList, not List — the textbook and the reviewer', body: vsd(
    j(['// Chapter 8, every Java book', 'List<Loan> history = new ArrayList<>();', 'Map<String, Member> members = new HashMap<>();', 'Set<Loan> openLoans = new HashSet<>();'].join('\n')),
    j(['// LAB211 reviewer — lint.py rule COLLECTION', 'ArrayList<Loan> history = new ArrayList<>();', 'HashMap<String, Member> members = new HashMap<>();', 'HashSet<Loan> openLoans = new HashSet<>();'].join('\n')),
    'the book: "declare the interface"', 'this course\'s labs: the concrete type') + two(
    box('Why the book says List', `<p style="margin:0">Code that only knows ${c('List')} switches to ${c('LinkedList')} by changing one ${c('new')}.</p>`, 'lam'),
    box('Why the reviewer says ArrayList', `<p style="margin:0">In a first-year lab, ${c('List')}/${c('Map')} everywhere is the fingerprint of copied code. Show which class you chose. A PE brief that dictates ${c('List')}? Keep it, mark it ${c('// brief: …')}.</p>`, 'ok')) },

  /* 5 */
  { t: 'TODO 8.1 — a Loan needs equals AND hashCode', body: two(
    j(boChuThich(ham(`${S}/model/Loan.java`, 'equals')).replace(' && (itemId', '\n            && (itemId')),
    col(j(boChuThich(ham(`${S}/model/Loan.java`, 'hashCode'))),
      P(raJava('lab8/LabHashSetLoan').split('\n').slice(-1)[0].replace(' = 31', '\n  = 31'), { title: 'real — what Objects.hash computes', sm: true }),
      box('The contract', `<p style="margin:0"><b>equal ⇒ same hash code</b>, always. Same hash ⇒ equal? Not required — then ${c('equals')} decides.</p>`, 'ok')), 'r64') },

  /* 6 */
  { t: 'Inside a HashSet: hashCode picks, equals confirms', body: hinhBam() +
    P(raJava('lab8/LabHashSetLoan').split('\n').slice(0, 3).join('\n'), { title: 'real output — LabHashSetLoan: add, add again, remove(new …)', sm: true }) },

  /* 7 */
  { t: 'Trap: equals without hashCode', body:
    vsd(j(['// bay/thieu-hashcode — Loan.java', '@Override', 'public boolean equals(Object other) { … }', '// (forgot hashCode: "equals is right, isn\'t it?")'].join('\n')),
      j(['// solution — add the other half', '@Override', 'public int hashCode() {', '    return Objects.hash(memberId, itemId);', '}'].join('\n')), '✗ compiles, runs, no crash', '✓ five more lines') +
    box('Why nothing crashes', `<p style="margin:0">Each new ${c('Loan')} gets an identity hash — almost surely <b>another bucket</b> — so ${c('equals')} is never asked. A duplicate is "new" (line 110), a return finds "nothing" (line 215).</p>`, 'do2') +
    P(bo(boNhac(ra('lab8/bay/thieu-hashcode:check', [1, 6]).replace(/^(  (?:can|ban in) +: )Ma thanh vien \(vi du M001\): Ma tai lieu \(vi du B001, T005, D006\): /gm, '$1')), 150) + '\n' + ra('lab8/bay/thieu-hashcode:check').split('\n').slice(-1)[0], { title: './check.sh — bay/thieu-hashcode (real)', sm: true }) },

  /* 8 */
  { t: 'Trap: changing a key while it is stored', body: hinhBam({ ghost: true }) + two(
    P(raJava('lab8/LabKhoaBiSua'), { title: 'real output — LabKhoaBiSua', sm: true }),
    box('The rule', `<p style="margin:0">Fields used by ${c('equals')}/${c('hashCode')} must <b>not change</b> while the object is in a Set or is a Map key. CT Library never calls ${c('setItemId')} on a stored ${c('Loan')}.</p>`, 'do2'), 'r64') },

  /* 9 */
  { t: 'TODO 8.2 — a map of lists: the loan history', body: hinhLichSu() + two(
    j(['// addLoan — after the duplicate check', de(boChuThich(tep(`${S}/repository/LoanRepository.java`, [41, 41]))), de(boChuThich(tep(`${S}/repository/LoanRepository.java`, [49, 56])))].join('\n')),
    P(R(473, 477), { title: 'option 15, M001 — real', sm: true }), 'r64') },

  /* 10 */
  { t: 'Trap: get() returns null — NPE on the first borrow', body:
    vsd(j(['// bay/get-null — "shorter"', 'historyMap.get(loan.getMemberId()).add(loan);'].join('\n')),
      j(['// three right ways to meet a new key', 'if (list == null) { list = new ArrayList<>(); map.put(id, list); }', 'count.put(id, count.getOrDefault(id, 0) + 1);', 'count.merge(id, 1, Integer::sum);'].join('\n')), '✗ the very first borrow crashes', '✓ the null is handled') +
    P(boNhac(ra('lab8/bay/get-null:run', [89, 93])).replace(/^Exception/m, 'Exception'), { title: 'bay/get-null — option 10, first borrow (JDK 21, real)', sm: true }) +
    P(raJava('lab8/LabDemTanSuat'), { title: 'LabDemTanSuat — a real JDK 8: same map three ways, then null + 1', sm: true }) },

  /* 11 */
  { t: 'TODO 8.3 — one get instead of a loop', body:
    vsd(j(de(boChuThich(tep('lab8/starter/src/repository/MemberRepository.java', [61, 70]))).replace('return new MemberResponseDTO(member.getId(), member.getName(),\n                member.getEmail());', 'return new MemberResponseDTO(…);').replace('throw new MemberNotFoundException(String.format(Message.ERROR_MEMBER_NOT_FOUND, id));', 'throw new MemberNotFoundException(…);')),
      j(de(boChuThich(tep(`${S}/repository/MemberRepository.java`, [58, 66]))).replace('return new MemberResponseDTO(member.getId(), member.getName(), member.getEmail());', 'return new MemberResponseDTO(…);').replace('throw new MemberNotFoundException(String.format(Message.ERROR_MEMBER_NOT_FOUND, id));', 'throw new MemberNotFoundException(…);')), '✗ starter: right answer, full scan', '✓ one get') + two(
    P(raJava('lab8/LabThuTuMap').split('\n').slice(0, 4).join('\n'), { title: 'real — the same 4 puts, LabThuTuMap', sm: true }),
    box('No order promised', `<p style="margin:0">A HashMap iterates in <b>bucket order</b>. Option 7 is still A–Z because the service sorts. Need an order? ${c('LinkedHashMap')} (insertion) or ${c('TreeMap')} (keys).</p>`, 'lam'), 'r64') },

  /* 12 */
  { t: 'TODO 8.4 — authors in a TreeMap', body: two(
    j(boChuThich(ham(`${S}/service/BookService.java`, 'buildAuthorReport')).replace('public TreeMap<String, Integer> buildAuthorReport(ArrayList<BookResponseDTO> itemList) {', 'public TreeMap<String, Integer> buildAuthorReport(\n        ArrayList<BookResponseDTO> itemList) {').replace('authorMap.put(author, authorMap.getOrDefault(author, 0) + 1);', 'authorMap.put(author,\n                authorMap.getOrDefault(author, 0) + 1);')),
    col(P(R(63, 68), { title: 'option 16 — real output' }),
      box('Why 2 for Joshua Bloch', `<p style="margin:0">"joshua bloch" typed for Java Puzzlers is Title-Cased by ${c('Validation')} ⇒ the <b>same key</b> as Effective Java. A ${c('TreeMap')} keeps keys unique and sorted — no ${c('sort')} call.</p>`, 'ok')), 'r64') },

  /* 13 */
  { t: 'TODO 8.5 — count, sort on three keys, keep five', body: j([de(boChuThich(tep(`${S}/service/BookService.java`, [284, 294]))), '// sort: loans ↓, then title A–Z, then id (anonymous Comparator)', 'Collections.sort(candidateList, new Comparator<TopItemDTO>() { … });', de(boChuThich(tep(`${S}/service/BookService.java`, [319, 322])))].join('\n')) + two(
    P(R(425, 431), { title: 'option 17 — real output', sm: true }),
    box('Who was cut', `<p style="margin:0">Four items tie on 1 loan: the <b>title</b> orders them, and D006 "The Social Network" is 6th. Counts include returned loans.</p>`, 'lam'), 'r64') },

  /* 14 */
  { t: 'Trap: a TreeSet that swallows ties', body: two(
    j(de(ma('lab8/LabTreeSetNuot', [21, 28])).replace('public int compare(Row a, Row b) { return Integer.compare(b.loans, a.loans); }', 'public int compare(Row a, Row b) {\n        return Integer.compare(b.loans, a.loans);\n    }')),
    P(raJava('lab8/LabTreeSetNuot'), { title: 'real output — LabTreeSetNuot', sm: true })) +
    box('compare(a, b) == 0 means "the same"', `<p style="margin:0">For a ${c('TreeSet')}/${c('TreeMap')}, a comparator that returns 0 is saying "duplicate". Chapter 8's Q3 lost words of equal length; here books would vanish from the report. Sort an ${c('ArrayList')} with a unique last key, then cut — TODO 8.5.</p>`, 'do2') },

  /* 15 */
  { t: 'One request through the layers: "17 — top 5"', body: luong([
    ['Main', 'option 17\n(no input)', PG],
    ['BookController', 'showTopBorrowed()\nholds both\nrepositories', NAU],
    ['IBookRepository', 'findAll()\n→ copy of\nthe shelf', XANH],
    ['LoanRepository', 'findBorrowed-\nItemIdList()\nevery loan ever', XANH],
    ['BookService', 'buildTopBorrowed\ncount · sort · cut', CAM],
    ['TopItemView', 'display()', PG],
  ], { h: 220, fs: 14 }) + two(
    box('Same layers as Lab 5–7', `<p style="margin:0">Repositories hold data, the service holds <b>none</b>, the controller holds both repositories and still imports <b>no model</b>.</p>`, 'lam'),
    box('Borrowing changed order', `<p style="margin:0">${c('loanRepository.addLoan')} <b>first</b> — a duplicate throws before any copy is taken — then ${c('updateCopies')}.</p>`, 'ok')), giua: true },

  /* 16 */
  { t: 'Green: PASS 588/588 and a silent reviewer', body: two(
    col(psql(ra('lab8/solution:check'), { title: './check.sh' }), psql(ra('lab8/solution:lint'), { title: 'python3 lint.py — solution' }),
      P(ra('lab8/starter:check').split('\n').slice(-1)[0], { title: './check.sh — the starter', sm: true })),
    col(box('The order that works', `<p style="margin:0">8.1 equals + hashCode (moves the most lines) · 8.2 history · 8.4 authors · 8.5 top 5 · 8.3 one ${c('get')} as a clean-up ⇒ <b>green</b>.</p>`, 'ok'),
      box('Last check', `<p style="margin:0">Search the declarations for ${c('List<')}, ${c('Map<')}, ${c('Set<')}: <b>zero hits</b> — or the lint shows the line.</p>`, 'lam'))), giua: true },

  /* 17 */
  { t: 'Rubric — 10 points, PE style', body: two(
    tbl(['Part', 'Points'], [
      [`${c('Loan.equals')} + ${c('hashCode')}, same 2 fields (8.1)`, '3'],
      ['History: a map of lists, null handled (8.2)', '2'],
      [`${c('findById')} = one ${c('get')} (8.3)`, '1'],
      ['TreeMap author report (8.4)', '1'],
      ['Top 5: count, 3-key sort, cut (8.5)', '2'],
      ['Oral: "why does equals need hashCode?"', '1'],
    ]),
    col(box('Self-check', `<p style="margin:0">1. Why does the 2nd ${c('add')} of an equal Loan return false?<br>2. What is ${c('historyMap.get("M004")')} for a new member?<br>3. Why not a ${c('TreeSet')} for the top 5?</p>`, 'lam'),
      box('Next: Lab 9', `<p style="margin:0">The data survives a restart: ${c('FileBookRepository')} on ${c('books.csv')} (UTF-8), broken lines reported, saved through a temp file — switched on by changing <b>one line</b>.</p>`, 'ok'))), giua: true },
]);
