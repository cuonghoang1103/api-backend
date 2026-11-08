/** Node.js 4.2 — Semver và lockfile: ^ ~ chính xác, so phiên bản theo số, satisfies/maxSatisfying như npm, npm ci vs npm install. */
import { doiDau, KHOA, cs, q, bang1, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

/** Mọi phiên bản express đã công bố tới lúc soạn bài (npm view express versions, bỏ 4.22.3 và 5.3.0 ra đời sau bài). */
const EXPRESS = ["0.14.0","0.14.1","1.0.0-beta","1.0.0-beta2","1.0.0-rc","1.0.0-rc2","1.0.0-rc3","1.0.0-rc4","1.0.0","1.0.1","1.0.2","1.0.3","1.0.4","1.0.5","1.0.6","1.0.7","1.0.8","2.0.0-beta","2.0.0-beta2","2.0.0-beta3","2.0.0-rc","2.0.0-rc2","2.0.0-rc3","2.0.0","2.1.0","2.1.1","2.2.0","2.2.1","2.2.2","2.3.0","2.3.1","2.3.2","2.3.3","2.3.4","2.3.5","2.3.6","2.3.7","2.3.8","2.3.9","2.3.10","2.3.11","2.3.12","2.4.0","2.4.1","2.4.2","2.4.3","2.4.4","2.4.5","2.4.6","2.4.7","2.5.0","2.5.1","2.5.2","2.5.3","2.5.4","2.5.5","2.5.6","2.5.7","2.5.8","2.5.9","2.5.10","2.5.11","3.0.0-alpha1","3.0.0-alpha2","3.0.0-alpha3","3.0.0-alpha4","3.0.0-alpha5","3.0.0-beta1","3.0.0-beta2","3.0.0-beta3","3.0.0-beta4","3.0.0-beta6","3.0.0-beta7","3.0.0-rc1","3.0.0-rc2","3.0.0-rc3","3.0.0-rc4","3.0.0-rc5","3.0.0","3.0.1","3.0.2","3.0.3","3.0.4","3.0.5","3.0.6","3.1.0","3.1.1","3.1.2","3.2.0","3.2.1","3.2.2","3.2.3","3.2.4","3.2.5","3.2.6","3.3.0","3.3.1","3.3.2","3.3.3","3.3.4","3.3.5","3.3.6","3.3.7","3.3.8","3.4.0","3.4.1","3.4.2","3.4.3","3.4.4","3.4.5","3.4.6","3.4.7","3.4.8","3.5.0","3.5.1","3.5.2","3.5.3","3.6.0","3.7.0","3.8.0","3.8.1","3.9.0","3.10.0","3.10.1","3.10.2","3.10.3","3.10.4","3.10.5","3.11.0","3.12.0","3.12.1","3.13.0","3.14.0","3.15.0","3.15.1","3.15.2","3.15.3","3.16.0","3.16.1","3.16.2","3.16.3","3.16.4","3.16.5","3.16.6","3.16.7","3.16.8","3.16.9","3.16.10","3.17.0","3.17.1","3.17.2","3.17.3","3.17.4","3.17.5","3.17.6","3.17.7","3.17.8","3.18.0","3.18.1","3.18.2","3.18.3","3.18.4","3.18.5","3.18.6","3.19.0","3.19.1","3.19.2","3.20.0","3.20.1","3.20.2","3.20.3","3.21.0","3.21.1","3.21.2","4.0.0-rc1","4.0.0-rc2","4.0.0-rc3","4.0.0-rc4","4.0.0","4.1.0","4.1.1","4.1.2","4.2.0","4.3.0","4.3.1","4.3.2","4.4.0","4.4.1","4.4.2","4.4.3","4.4.4","4.4.5","4.5.0","4.5.1","4.6.0","4.6.1","4.7.0","4.7.1","4.7.2","4.7.3","4.7.4","4.8.0","4.8.1","4.8.2","4.8.3","4.8.4","4.8.5","4.8.6","4.8.7","4.8.8","4.9.0","4.9.1","4.9.2","4.9.3","4.9.4","4.9.5","4.9.6","4.9.7","4.9.8","4.10.0","4.10.1","4.10.2","4.10.3","4.10.4","4.10.5","4.10.6","4.10.7","4.10.8","4.11.0","4.11.1","4.11.2","4.12.0","4.12.1","4.12.2","4.12.3","4.12.4","4.13.0","4.13.1","4.13.2","4.13.3","4.13.4","4.14.0","4.14.1","4.15.0","4.15.1","4.15.2","4.15.3","4.15.4","4.15.5","4.16.0","4.16.1","4.16.2","4.16.3","4.16.4","4.17.0","4.17.1","4.17.2","4.17.3","4.18.0","4.18.1","4.18.2","4.18.3","4.19.0","4.19.1","4.19.2","4.20.0","4.21.0","4.21.1","4.21.2","4.22.0","4.22.1","4.22.2","5.0.0-alpha.1","5.0.0-alpha.2","5.0.0-alpha.3","5.0.0-alpha.4","5.0.0-alpha.5","5.0.0-alpha.6","5.0.0-alpha.7","5.0.0-alpha.8","5.0.0-beta.1","5.0.0-beta.2","5.0.0-beta.3","5.0.0","5.0.1","5.1.0","5.2.0","5.2.1"];

const YN = ['yes', 'no'];
const E1 = cs({
  ten: '4.2 · What does each range really allow?', kho: 'EASY', phut: 7, loai: 'table',
  en: 'The lesson resolved <code>^4.18.0 → 4.22.2</code>, <code>~4.18.0 → 4.18.3</code>, <code>4.18.0 → 4.18.0</code>. For each row, does the version satisfy the range? (Checked with the <code>semver</code> package npm itself uses.)',
  vi: 'Bài phân giải <code>^4.18.0 → 4.22.2</code>, <code>~4.18.0 → 4.18.3</code>, <code>4.18.0 → 4.18.0</code>. Với mỗi hàng, phiên bản có thoả khoảng không? (Đã kiểm bằng gói <code>semver</code> mà chính npm dùng.)',
  bang: [
    bang1('b1', ['Range × version', 'Khoảng × phiên bản'],
      [{ ma: 'range', ten: 'Range' }, { ma: 'ver', ten: 'Version' }, { ma: 'ok', ten: 'Allowed?', luaChon: YN }],
      [
        { o: { range: '^4.18.0', ver: '4.22.2' }, a: { ok: 'yes' } },
        { o: { range: '^4.18.0', ver: '5.0.0' }, a: { ok: 'no' } },
        { o: { range: '^4.18.0', ver: '4.17.3' }, a: { ok: 'no' } },
        { o: { range: '~4.18.0', ver: '4.18.3' }, a: { ok: 'yes' } },
        { o: { range: '~4.18.0', ver: '4.19.0' }, a: { ok: 'no' } },
        { o: { range: '4.18.0', ver: '4.18.1' }, a: { ok: 'no' } },
        { o: { range: '^0.2.3', ver: '0.2.9' }, a: { ok: 'yes' } },
        { o: { range: '^0.2.3', ver: '0.3.0' }, a: { ok: 'no' } },
      ],
      ['Caret lets minor and patch move but never the major (and never below the base). Tilde lets only patch move. Below 1.0.0 the caret is stricter: for ^0.2.3 the 0.2 is treated as the “major”, because in 0.x every minor may break.', 'Dấu mũ cho minor và patch nhích nhưng không bao giờ nhích major (và không bao giờ dưới mốc). Dấu ngã chỉ cho patch nhích. Dưới 1.0.0 dấu mũ chặt hơn: với ^0.2.3 thì 0.2 được coi như “major”, vì ở 0.x mỗi minor đều có thể phá vỡ.']),
  ],
  goiY: [['Read ^ as “same first non-zero number”, ~ as “same major.minor”.', 'Đọc ^ là “cùng số khác 0 đầu tiên”, ~ là “cùng major.minor”.'], ['The base version is a lower bound for both.', 'Phiên bản mốc là cận dưới cho cả hai.']],
  loi: [['Thinking ^4.18.0 accepts 4.17.x because it is “compatible”.', 'Tưởng ^4.18.0 nhận 4.17.x vì nó “tương thích”.'], ['Reading ^0.2.3 like ^4.18.0 and accepting 0.3.0.', 'Đọc ^0.2.3 như ^4.18.0 và nhận 0.3.0.']],
  tns: [tn('MAJOR.MINOR.PATCH', 'phá vỡ . tính năng . sửa lỗi'), tn('caret (^)', 'dấu mũ'), tn('tilde (~)', 'dấu ngã')],
  kn: ['semver'],
});

/* ─── 2. sắp xếp phiên bản theo số ─── */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  // compare part by part as NUMBERS: 10 > 9, although "10" < "9" as text
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}
function sortVersions(list) {
  return [...list].sort(compareVersions);   // a copy: do not reorder the caller's array
}
const E2 = nodeBai({
  ten: '4.2 · Sort versions as numbers, not text', kho: 'EASY', phut: 10,
  en: '<p>“MAJOR.MINOR.PATCH” are three <b>numbers</b>. Write <code>compareVersions(a, b)</code> (negative / 0 / positive, like a sort comparator) and <code>sortVersions(list)</code> that returns a new array sorted from oldest to newest. Versions are plain <code>x.y.z</code> (no pre-release tags). <code>list.sort()</code> alone puts <code>4.10.0</code> before <code>4.9.0</code> — that is the bug to avoid.</p>',
  vi: '<p>“MAJOR.MINOR.PATCH” là ba <b>con số</b>. Viết <code>compareVersions(a, b)</code> (âm / 0 / dương, như hàm so sánh của sort) và <code>sortVersions(list)</code> trả về mảng mới sắp từ cũ tới mới. Phiên bản dạng <code>x.y.z</code> thuần (không có nhãn pre-release). Chỉ dùng <code>list.sort()</code> sẽ đặt <code>4.10.0</code> trước <code>4.9.0</code> — đó là lỗi cần tránh.</p>',
  dauVao: ['list — array of "x.y.z" strings', 'list — mảng chuỗi "x.y.z"'], dauRa: ['a new array, oldest first', 'mảng mới, cũ nhất trước'],
  goiY: [['split(".").map(Number) turns "4.18.2" into [4, 18, 2].', 'split(".").map(Number) biến "4.18.2" thành [4, 18, 2].'], ['The first part that differs decides; return its difference.', 'Phần đầu tiên khác nhau quyết định; trả về hiệu của nó.']],
  loi: [['list.sort() — compares characters: "4.10.0" < "4.9.0".', 'list.sort() — so ký tự: "4.10.0" < "4.9.0".'], ['Sorting in place: the caller’s array changes under its feet.', 'Sắp tại chỗ: mảng của bên gọi bị đổi mà không biết.']],
  gt: ['Expected orders are what <code>semver.sort</code> returns. Comparing versions as text works by luck until the first two-digit minor — express went from 4.9.x to 4.10.0, and from 4.19.2 to 4.20.0.', 'Thứ tự mong đợi là kết quả của <code>semver.sort</code>. So phiên bản như chữ chỉ đúng nhờ may mắn tới minor hai chữ số đầu tiên — express đi từ 4.9.x lên 4.10.0, và từ 4.19.2 lên 4.20.0.'],
  kn: ['semver'], tns: [tn('comparator', 'hàm so sánh', '(a, b) => negative | 0 | positive')],
  dau: `/** compare two "x.y.z" versions: negative if a < b, 0 if equal, positive if a > b */
function compareVersions(a, b) {
  // Write your solution here
  return a < b ? -1 : a > b ? 1 : 0;
}
function sortVersions(list) {
  return list.sort(compareVersions);
}
`,
  giai: '// Reference solution — three numbers, compared left to right\n' + nguon(compareVersions, sortVersions),
  cases: [
    { goi: goi('sortVersions', ['4.9.0', '4.10.0', '4.2.1']), moTa: ['4.10.0 is newer than 4.9.0', '4.10.0 mới hơn 4.9.0'] },
    { goi: goi('sortVersions', ['4.22.2', '4.18.0', '5.0.0', '4.18.3']), moTa: ['The versions of the lesson', 'Các phiên bản của bài'] },
    { goi: '(() => { const a = ["2.0.0", "1.0.0"]; const b = sortVersions(a); return [a, b]; })()', moTa: ['Does not change the argument', 'Không đổi đối số'] },
    { goi: goi('sortVersions', ['1.0.10', '1.0.9', '1.10.0', '1.9.9', '10.0.0', '9.9.9']), an: true },
    { goi: '[compareVersions("4.18.0", "4.18.0"), Math.sign(compareVersions("4.19.2", "4.20.0")), Math.sign(compareVersions("5.0.0", "4.22.2"))]', an: true },
    { goi: goi('sortVersions', []), an: true },
  ],
});

/* ─── 3. satisfies ─── */
function satisfies(version, range) {
  const v = version.split('.').map(Number);
  const op = range[0] === '^' || range[0] === '~' ? range[0] : '';
  const b = range.slice(op.length).split('.').map(Number);
  const cmp = (x, y) => { for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; };
  if (op === '') return cmp(v, b) === 0;                      // exact
  if (cmp(v, b) < 0) return false;                            // never below the base
  if (op === '~') return v[0] === b[0] && v[1] === b[1];      // patch may move
  // caret: everything left of (and including) the first non-zero part is frozen
  if (b[0] > 0) return v[0] === b[0];
  if (b[1] > 0) return v[0] === 0 && v[1] === b[1];
  return v[0] === 0 && v[1] === 0 && v[2] === b[2];
}
const E3 = nodeBai({
  ten: '4.2 · satisfies(version, range) for ^, ~ and exact', kho: 'MEDIUM', phut: 20,
  en: `<p>Write the core of npm’s resolver: <code>satisfies(version, range)</code> → boolean, for plain <code>x.y.z</code> versions and three kinds of range:</p>
<table><thead><tr><th>range</th><th>means</th></tr></thead><tbody>
<tr><td><code>4.18.0</code></td><td>exactly 4.18.0</td></tr><tr><td><code>~4.18.0</code></td><td>≥ 4.18.0 and &lt; 4.19.0 (patch moves)</td></tr>
<tr><td><code>^4.18.0</code></td><td>≥ 4.18.0 and &lt; 5.0.0 (minor + patch move)</td></tr>
<tr><td><code>^0.2.3</code></td><td>≥ 0.2.3 and &lt; 0.3.0 — below 1.0.0 the first <b>non-zero</b> part is frozen</td></tr>
<tr><td><code>^0.0.3</code></td><td>≥ 0.0.3 and &lt; 0.0.4 — i.e. exactly 0.0.3</td></tr></tbody></table>`,
  vi: `<p>Viết lõi bộ phân giải của npm: <code>satisfies(version, range)</code> → boolean, cho phiên bản <code>x.y.z</code> thuần và ba loại khoảng:</p>
<table><thead><tr><th>khoảng</th><th>nghĩa</th></tr></thead><tbody>
<tr><td><code>4.18.0</code></td><td>đúng 4.18.0</td></tr><tr><td><code>~4.18.0</code></td><td>≥ 4.18.0 và &lt; 4.19.0 (patch nhích)</td></tr>
<tr><td><code>^4.18.0</code></td><td>≥ 4.18.0 và &lt; 5.0.0 (minor + patch nhích)</td></tr>
<tr><td><code>^0.2.3</code></td><td>≥ 0.2.3 và &lt; 0.3.0 — dưới 1.0.0, phần <b>khác 0</b> đầu tiên bị đóng băng</td></tr>
<tr><td><code>^0.0.3</code></td><td>≥ 0.0.3 và &lt; 0.0.4 — tức đúng 0.0.3</td></tr></tbody></table>`,
  dauVao: ['version "x.y.z"; range "x.y.z" | "~x.y.z" | "^x.y.z"', 'version "x.y.z"; range "x.y.z" | "~x.y.z" | "^x.y.z"'], dauRa: ['true / false', 'true / false'],
  goiY: [['Every range has a lower bound: the base version itself.', 'Khoảng nào cũng có cận dưới: chính phiên bản mốc.'], ['For the caret, find the first non-zero part of the base: that part and everything left of it must be equal.', 'Với dấu mũ, tìm phần khác 0 đầu tiên của mốc: phần đó và mọi thứ bên trái nó phải bằng nhau.'], ['Compare as numbers (previous exercise).', 'So như số (bài trước).']],
  loi: [['Forgetting the lower bound: ^4.18.0 accepting 4.0.0.', 'Quên cận dưới: ^4.18.0 nhận 4.0.0.'], ['Ignoring the 0.x rule: ^0.2.3 accepting 0.9.0, which may break you.', 'Bỏ qua luật 0.x: ^0.2.3 nhận 0.9.0, thứ có thể phá bạn.'], ['String comparison: "4.9.0" > "4.18.0".', 'So chuỗi: "4.9.0" > "4.18.0".']],
  gt: ['Every expected value is <code>semver.satisfies</code> (the library npm uses). The caret is npm’s default when you <code>npm i express</code>, which is why “nobody edited package.json, both machines obeyed it perfectly, and yet they run different code”.', 'Mọi giá trị mong đợi là <code>semver.satisfies</code> (thư viện npm dùng). Dấu mũ là mặc định của npm khi bạn <code>npm i express</code>, vì thế “không ai sửa package.json, cả hai máy tuân thủ nó hoàn hảo, vậy mà chạy code khác nhau”.'],
  kn: ['semver'], tns: [tn('range', 'khoảng phiên bản'), tn('lower bound', 'cận dưới'), tn('resolver', 'bộ phân giải phiên bản')],
  dau: `/** does version satisfy range? (exact, ~x.y.z, ^x.y.z — no pre-releases) */
function satisfies(version, range) {
  // Write your solution here — this only knows "same major"
  const op = range[0] === '^' || range[0] === '~' ? range[0] : '';
  const base = range.slice(op.length);
  if (!op) return version === base;
  return version.split('.')[0] === base.split('.')[0];
}
`,
  giai: '// Reference solution — lower bound, then which parts are frozen\n' + nguon(satisfies),
  cases: [
    { goi: `[${['4.22.2', '5.0.0', '4.17.3'].map((x) => `satisfies("${x}", "^4.18.0")`).join(', ')}]`, moTa: ['^4.18.0 against 4.22.2, 5.0.0, 4.17.3', '^4.18.0 với 4.22.2, 5.0.0, 4.17.3'] },
    { goi: `[${['4.18.3', '4.19.0'].map((x) => `satisfies("${x}", "~4.18.0")`).join(', ')}]`, moTa: ['Tilde', 'Dấu ngã'] },
    { goi: '[satisfies("4.18.0", "4.18.0"), satisfies("4.18.1", "4.18.0")]', moTa: ['Exact', 'Chính xác'] },
    { goi: `[${['0.2.3', '0.2.9', '0.3.0', '0.2.2', '1.0.0'].map((x) => `satisfies("${x}", "^0.2.3")`).join(', ')}]`, an: true },
    { goi: `[${['0.0.3', '0.0.4', '0.1.0'].map((x) => `satisfies("${x}", "^0.0.3")`).join(', ')}]`, an: true },
    { goi: `[${[['4.9.0', '^4.18.0'], ['4.100.0', '^4.18.0'], ['1.2.10', '~1.2.9'], ['1.3.0', '~1.2.9'], ['0.2.5', '~0.2.3'], ['2.0.0', '^1.9.9']].map(([x, r]) => `satisfies("${x}", "${r}")`).join(', ')}]`, an: true },
  ],
});

/* ─── 4. maxSatisfying trên danh sách express thật ─── */
const SAT = nguon(satisfies);
function maxSatisfying(versions, range) {
  let best = null;
  for (const v of versions) {
    if (v.includes('-')) continue;                 // pre-releases (5.0.0-beta.1) are never picked by a normal range
    if (!satisfies(v, range)) continue;
    if (best === null || compareVersions(v, best) > 0) best = v;
  }
  return best;
}
const E4 = nodeBai({
  ten: '4.2 · Reproduce npm view "express@^4.18.0" version', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson asked npm which version each range resolves to “today”: <code>^4.18.0 → 4.22.2</code>, <code>~4.18.0 → 4.18.3</code>. Reproduce it. Write <code>maxSatisfying(versions, range)</code>: the highest version in <code>versions</code> that satisfies <code>range</code>, or <code>null</code>. The list is the real one (every express version published when the lesson was written, oldest first — it contains pre-releases like <code>5.0.0-beta.1</code>, which a normal range never picks: skip anything with a <code>-</code>).</p><p><code>satisfies</code> (previous exercise) is provided; you still need a numeric comparison.</p>`,
  vi: `<p>Bài hỏi npm mỗi khoảng phân giải ra phiên bản nào “hôm nay”: <code>^4.18.0 → 4.22.2</code>, <code>~4.18.0 → 4.18.3</code>. Hãy tái hiện. Viết <code>maxSatisfying(versions, range)</code>: phiên bản cao nhất trong <code>versions</code> thoả <code>range</code>, hoặc <code>null</code>. Danh sách là thật (mọi phiên bản express đã công bố lúc soạn bài, cũ nhất trước — có cả pre-release như <code>5.0.0-beta.1</code>, thứ mà khoảng thường không bao giờ chọn: bỏ qua mọi thứ có dấu <code>-</code>).</p><p>Có sẵn <code>satisfies</code> (bài trước); bạn vẫn cần một phép so theo số.</p>`,
  dauVao: ['versions — array (any order); range', 'versions — mảng (thứ tự bất kỳ); range'], dauRa: ['the highest matching version, or null', 'phiên bản khớp cao nhất, hoặc null'],
  goiY: [['Filter (no "-", satisfies), then keep the maximum with compareVersions.', 'Lọc (không có "-", satisfies), rồi giữ cái lớn nhất bằng compareVersions.'], ['Do not rely on the list being sorted — a hidden test shuffles it.', 'Đừng dựa vào việc danh sách đã sắp — một kiểm ẩn xáo trộn nó.']],
  loi: [['Returning the last element that matches: right only if the list is sorted.', 'Trả phần tử khớp cuối cùng: chỉ đúng khi danh sách đã sắp.'], ['Picking "5.0.0-beta.3" for ^5.0.0-something ranges, or crashing on it in satisfies.', 'Chọn "5.0.0-beta.3", hoặc sập khi đưa nó vào satisfies.']],
  gt: ['On that list the answers are exactly the lesson’s (4.22.2 and 4.18.3). Run <code>npm view "express@^4.18.0" version</code> today and you get <b>4.22.3</b>: a patch came out after the lesson was written. Same package.json, a different install — the lesson’s point, demonstrated by time itself.', 'Trên danh sách đó đáp án đúng như bài (4.22.2 và 4.18.3). Chạy <code>npm view "express@^4.18.0" version</code> hôm nay bạn nhận <b>4.22.3</b>: một bản vá ra đời sau khi soạn bài. Cùng package.json, lượt cài khác — đúng ý của bài, do chính thời gian chứng minh.'],
  kn: ['semver', 'npm'], tns: [tn('pre-release', 'bản phát hành thử', '5.0.0-beta.1'), tn('resolve', 'phân giải')],
  chung: `const EXPRESS = ${JSON.stringify(EXPRESS)};`,
  dau: `// ── provided: satisfies() from the previous exercise ──
${SAT}
/** the highest version in versions that satisfies range, or null */
function maxSatisfying(versions, range) {
  // Write your solution here — this takes the last match
  let best = null;
  for (const v of versions) if (!v.includes('-') && satisfies(v, range)) best = v;
  return best;
}
`,
  giai: `// ── provided: satisfies() from the previous exercise ──
${SAT}
// Reference solution — filter, then a numeric maximum
${nguon(compareVersions, maxSatisfying)}`,
  cases: [
    { goi: '[maxSatisfying(EXPRESS, "^4.18.0"), maxSatisfying(EXPRESS, "~4.18.0"), maxSatisfying(EXPRESS, "4.18.0")]', moTa: ['The lesson’s three ranges', 'Ba khoảng của bài'] },
    { goi: '[maxSatisfying(EXPRESS, "^5.0.0"), maxSatisfying(EXPRESS, "^3.0.0"), maxSatisfying(EXPRESS, "^6.0.0")]', moTa: ['Other majors, and none', 'Major khác, và không có'] },
    { goi: '[maxSatisfying(EXPRESS.slice().reverse(), "^4.18.0"), maxSatisfying(["4.9.0", "4.10.0", "4.2.0"], "^4.0.0")]', an: true },
    { goi: '[maxSatisfying(EXPRESS, "~4.17.0"), maxSatisfying(EXPRESS, "^4.0.0"), maxSatisfying(EXPRESS, "~5.0.0")]', an: true },
    { goi: 'maxSatisfying(["5.0.0-beta.3", "4.22.2", "5.0.0-alpha.8"], "^4.0.0")', an: true },
  ],
});

/* ─── 5. npm ci vs npm install ─── */
const SAT_MAX = nguon(compareVersions, satisfies, maxSatisfying);
function installResult({ command, range, lock, available }) {
  if (command === 'ci') {
    // npm ci installs EXACTLY the lockfile, and refuses when there is none or it disagrees with package.json
    if (!lock) return { error: 'NO_LOCKFILE' };
    if (!satisfies(lock, range)) return { error: 'OUT_OF_SYNC' };
    return { version: lock, lockfileChanged: false };
  }
  // npm install keeps a lockfile version that still fits the range…
  if (lock && satisfies(lock, range)) return { version: lock, lockfileChanged: false };
  // …otherwise it resolves the range again and writes the lockfile
  const v = maxSatisfying(available, range);
  if (!v) return { error: 'NO_MATCH' };
  return { version: v, lockfileChanged: true };
}
const E5 = nodeBai({
  ten: '4.2 · npm ci vs npm install: who gets which version?', kho: 'HARD', phut: 20,
  en: `<p>The lesson’s experiment: package.json says <code>^4.18.0</code>, the lockfile pins <code>4.18.0</code>. A colleague runs <code>npm ci</code> → 4.18.0. Someone deletes the lockfile and runs <code>npm install</code> → 4.22.2. Model both commands for one package. Write <code>installResult({ command, range, lock, available })</code> (<code>lock</code> is the version in package-lock.json or <code>null</code>):</p>
<table><thead><tr><th>command</th><th>situation</th><th>result</th></tr></thead><tbody>
<tr><td rowspan="3"><code>"ci"</code></td><td>no lockfile</td><td><code>{ error: "NO_LOCKFILE" }</code></td></tr>
<tr><td>lock does not satisfy range</td><td><code>{ error: "OUT_OF_SYNC" }</code></td></tr><tr><td>otherwise</td><td><code>{ version: lock, lockfileChanged: false }</code></td></tr>
<tr><td rowspan="3"><code>"install"</code></td><td>lock satisfies range</td><td><code>{ version: lock, lockfileChanged: false }</code></td></tr>
<tr><td>otherwise, a match exists</td><td><code>{ version: maxSatisfying(available, range), lockfileChanged: true }</code></td></tr><tr><td>no match</td><td><code>{ error: "NO_MATCH" }</code></td></tr></tbody></table><p><code>satisfies</code> and <code>maxSatisfying</code> are provided.</p>`,
  vi: `<p>Thí nghiệm của bài: package.json ghi <code>^4.18.0</code>, lockfile ghim <code>4.18.0</code>. Đồng nghiệp chạy <code>npm ci</code> → 4.18.0. Ai đó xoá lockfile và chạy <code>npm install</code> → 4.22.2. Mô phỏng cả hai lệnh cho một gói. Viết <code>installResult({ command, range, lock, available })</code> (<code>lock</code> là phiên bản trong package-lock.json hoặc <code>null</code>):</p>
<table><thead><tr><th>lệnh</th><th>tình huống</th><th>kết quả</th></tr></thead><tbody>
<tr><td rowspan="3"><code>"ci"</code></td><td>không có lockfile</td><td><code>{ error: "NO_LOCKFILE" }</code></td></tr>
<tr><td>lock không thoả range</td><td><code>{ error: "OUT_OF_SYNC" }</code></td></tr><tr><td>còn lại</td><td><code>{ version: lock, lockfileChanged: false }</code></td></tr>
<tr><td rowspan="3"><code>"install"</code></td><td>lock thoả range</td><td><code>{ version: lock, lockfileChanged: false }</code></td></tr>
<tr><td>ngược lại, có bản khớp</td><td><code>{ version: maxSatisfying(available, range), lockfileChanged: true }</code></td></tr><tr><td>không có bản khớp</td><td><code>{ error: "NO_MATCH" }</code></td></tr></tbody></table><p>Có sẵn <code>satisfies</code> và <code>maxSatisfying</code>.</p>`,
  dauVao: ['{ command: "ci" | "install", range, lock: string | null, available: string[] }', '{ command: "ci" | "install", range, lock: chuỗi | null, available: string[] }'], dauRa: ['{ version, lockfileChanged } or { error }', '{ version, lockfileChanged } hoặc { error }'],
  goiY: [['Branch on command first: the two commands have opposite philosophies.', 'Rẽ nhánh theo command trước: hai lệnh có triết lý ngược nhau.'], ['ci never resolves anything — it only checks the lockfile against package.json.', 'ci không bao giờ phân giải gì — nó chỉ đối chiếu lockfile với package.json.']],
  loi: [['Making ci fall back to resolving the range when the lockfile is missing: that is exactly the non-reproducible install ci exists to forbid.', 'Cho ci lùi về phân giải khoảng khi thiếu lockfile: đó chính là kiểu cài không tái lập được mà ci sinh ra để cấm.'], ['Making install always pick the newest: with a fitting lockfile, npm install keeps the pinned version.', 'Cho install luôn chọn bản mới nhất: khi lockfile còn khớp, npm install giữ phiên bản đã ghim.']],
  gt: ['This is why the lesson’s rule is “npm ci everywhere except when you deliberately change dependencies”: ci either reproduces the tested tree or fails loudly — it never quietly installs something new. Deploys of this site use npm ci for exactly that reason.', 'Đây là lý do luật của bài là “npm ci ở mọi nơi, trừ khi bạn cố ý đổi dependency”: ci hoặc tái lập đúng cây đã được test, hoặc thất bại ồn ào — nó không bao giờ âm thầm cài thứ mới. Các lần deploy của trang web này dùng npm ci vì đúng lý do đó.'],
  kn: ['npm', 'lockfile'], tns: [tn('lockfile', 'tệp khoá phiên bản', 'package-lock.json'), tn('reproducible install', 'lần cài tái lập được'), tn('out of sync', 'lệch nhau')],
  chung: `const EXPRESS = ${JSON.stringify(EXPRESS)};`,
  dau: `// ── provided ──
${SAT_MAX}
/** what npm ci / npm install would install for one package */
function installResult({ command, range, lock, available }) {
  // Write your solution here — this treats both commands the same
  const v = maxSatisfying(available, range);
  return v ? { version: v, lockfileChanged: v !== lock } : { error: 'NO_MATCH' };
}
`,
  giai: `// ── provided ──
${SAT_MAX}
// Reference solution — ci reproduces or fails; install keeps a fitting lock, else resolves
${nguon(installResult)}`,
  cases: [
    { goi: '[installResult({ command: "ci", range: "^4.18.0", lock: "4.18.0", available: EXPRESS }), installResult({ command: "install", range: "^4.18.0", lock: null, available: EXPRESS })]', moTa: ['The lesson’s experiment: 4.18.0 vs 4.22.2', 'Thí nghiệm của bài: 4.18.0 vs 4.22.2'] },
    { goi: 'installResult({ command: "ci", range: "^4.18.0", lock: null, available: EXPRESS })', moTa: ['ci without a lockfile', 'ci khi không có lockfile'] },
    { goi: 'installResult({ command: "install", range: "^4.18.0", lock: "4.18.0", available: EXPRESS })', moTa: ['install keeps a fitting lock', 'install giữ lock còn khớp'] },
    { goi: '[installResult({ command: "ci", range: "^5.0.0", lock: "4.18.0", available: EXPRESS }), installResult({ command: "install", range: "^5.0.0", lock: "4.18.0", available: EXPRESS })]', an: true },
    { goi: '[installResult({ command: "install", range: "^9.0.0", lock: null, available: EXPRESS }), installResult({ command: "ci", range: "~4.18.0", lock: "4.18.3", available: EXPRESS })]', an: true },
    { goi: 'installResult({ command: "install", range: "~4.17.0", lock: "4.18.0", available: EXPRESS })', an: true },
  ],
});

const E6 = cs({
  ten: '4.2 · The lockfile rules', kho: 'EASY', phut: 5,
  en: 'Four decisions every team makes about package-lock.json.',
  vi: 'Bốn quyết định mọi nhóm phải đưa ra về package-lock.json.',
  cau: [
    q('c1', ['An article says “add package-lock.json to .gitignore to avoid merge conflicts”. For an application you should…', 'Một bài viết bảo “thêm package-lock.json vào .gitignore để tránh xung đột merge”. Với một ứng dụng bạn nên…'],
      ['Commit it — without it “install the same thing” is unenforceable', 'Ignore it — package.json already records the versions', 'Ignore it, but commit node_modules instead', 'Commit it only on the main branch'],
      ['The lockfile pins every package of the tree, including the dependencies of your dependencies, which package.json says nothing about. (Libraries are different: the consuming app decides the tree.)', 'Lockfile ghim mọi gói của cây, kể cả dependency của dependency, thứ package.json không nói gì. (Thư viện thì khác: ứng dụng dùng nó quyết định cây.)']),
    q('c2', ['Which command belongs in your Dockerfile and CI?', 'Lệnh nào thuộc về Dockerfile và CI của bạn?'],
      ['npm ci', 'npm install', 'npm update', 'npm i express@latest'],
      ['npm ci installs exactly the lockfile, deletes node_modules first, never writes the lockfile, and is faster because it skips resolution.', 'npm ci cài đúng lockfile, xoá node_modules trước, không bao giờ ghi lockfile, và nhanh hơn vì bỏ qua bước phân giải.']),
    q('c3', ['What does <code>npm update</code> do?', '<code>npm update</code> làm gì?'],
      ['Moves packages to newer versions within the ranges package.json allows', 'Upgrades every package to its latest major version', 'Re-downloads exactly the versions in the lockfile', 'Updates npm itself to the latest release'],
      ['To jump a major deliberately you run npm i express@latest — and read the changelog first.', 'Muốn nhảy major có chủ ý thì chạy npm i express@latest — và đọc changelog trước.']),
    q('c4', ['A teammate hand-edits package-lock.json to bump one version. Problem?', 'Một đồng đội sửa tay package-lock.json để nâng một phiên bản. Có vấn đề không?'],
      ['Yes — change package.json (or run npm i pkg@x) and let npm regenerate the lockfile', 'No — the lockfile is just JSON, editing it is the fastest way', 'No, as long as npm ci is run afterwards', 'Yes, because the lockfile is binary and will be corrupted'],
      ['The lockfile also records resolved URLs and integrity hashes; a hand edit easily leaves them inconsistent.', 'Lockfile còn ghi URL đã phân giải và mã băm toàn vẹn; sửa tay rất dễ để chúng lệch nhau.']),
  ],
  goiY: [['Which command never writes the lockfile?', 'Lệnh nào không bao giờ ghi lockfile?'], ['Reproducible beats convenient.', 'Tái lập được quan trọng hơn tiện.']],
  loi: [['Ignoring the lockfile in an application repo.', 'Bỏ lockfile khỏi repo ứng dụng.'], ['Running npm install in Docker.', 'Chạy npm install trong Docker.']],
  tns: [tn('integrity hash', 'mã băm toàn vẹn'), tn('changelog', 'nhật ký thay đổi')],
  kn: ['lockfile', 'npm'],
});

export default doiDau({ slug: 'nodejs-4-2-semver-lockfile', ten: '4.2 Semver and the lockfile', khoa: KHOA, baiHoc: 'nodejs-4-2-semver-lockfile', de: [E1, E6, E2, E3, E4, E5] });
