/** Coding Interview Prep · 1.1 — Hash map và set: tra cứu O(1), đếm, gom nhóm theo khoá, phần bù. Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Set: lần quét thẻ trùng đầu tiên ── */
function firstRepeat(scans) {
  var seen = new Set(); // every id scanned so far — O(1) average lookup
  for (var i = 0; i < scans.length; i++) {
    var id = scans[i];
    if (seen.has(id)) return id; // the first time an id comes back, that IS the earliest second scan
    seen.add(id);
  }
  return null; // nobody scanned twice
}
const D1 = bai({
  ten: 'Lab check-in: the first student who scans twice', kho: 'EASY', phut: 10, ham: 'firstRepeat',
  en: `<p>Every student taps their card on the reader at the door of lab AL-R205. The reader keeps the raw log <code>scans</code>: student IDs in the order they were tapped. A second tap by the same card usually means a friend is tapping in for someone who is absent, so the lab assistant wants the <b>first moment</b> a card shows up again.</p>
<p>Write <code>firstRepeat(scans)</code> that returns the ID whose <b>second</b> appearance comes earliest in the log, or <code>null</code> if every ID appears once.</p>
<p>Careful: "the ID that appeared first and repeats later" is not the same thing. In <code>["SE1", "SE2", "SE2", "SE1"]</code> the answer is <code>"SE2"</code> — its repeat happens at position 2, before SE1's repeat at position 3.</p>`,
  vi: `<p>Mỗi sinh viên quẹt thẻ ở đầu đọc cửa phòng lab AL-R205. Đầu đọc giữ log thô <code>scans</code>: mã sinh viên theo đúng thứ tự quẹt. Một thẻ quẹt lần hai thường là bạn quẹt hộ người vắng, nên trợ giảng muốn biết <b>thời điểm đầu tiên</b> một thẻ xuất hiện lại.</p>
<p>Viết <code>firstRepeat(scans)</code> trả về mã có lần xuất hiện <b>thứ hai</b> sớm nhất trong log, hoặc <code>null</code> nếu mã nào cũng chỉ xuất hiện một lần.</p>
<p>Cẩn thận: "mã xuất hiện đầu tiên và về sau lặp lại" là chuyện KHÁC. Với <code>["SE1", "SE2", "SE2", "SE1"]</code> đáp án là <code>"SE2"</code> — lần lặp của nó ở vị trí 2, trước lần lặp của SE1 ở vị trí 3.</p>`,
  dauVao: ['scans — array of student ID strings (0 ≤ length ≤ 2·10⁵).', 'scans — mảng chuỗi mã sinh viên (0 ≤ độ dài ≤ 2·10⁵).'],
  dauRa: ['The ID string, or null.', 'Chuỗi mã, hoặc null.'],
  rangBuoc: [['0 ≤ scans.length ≤ 200 000; IDs are case-sensitive ("se1" ≠ "SE1").', '0 ≤ scans.length ≤ 200 000; mã phân biệt hoa thường ("se1" ≠ "SE1").'], ['Target: O(n) time, O(n) extra memory.', 'Mục tiêu: O(n) thời gian, O(n) bộ nhớ phụ.']],
  goiY: [
    ['When you are at position i, the only question is: "have I seen this ID before?" Which structure answers that in O(1)?', 'Khi đứng ở vị trí i, câu hỏi duy nhất là: "mã này đã gặp chưa?" Cấu trúc nào trả lời câu đó trong O(1)?'],
    ['Scan left to right with a Set. Check first, then add. The first hit is the answer — you never need to look ahead.', 'Quét trái sang phải với một Set. Kiểm trước, thêm sau. Lần trúng đầu tiên là đáp án — không bao giờ cần nhìn về phía trước.'],
  ],
  loi: [
    ['Checking with <code>scans.slice(0, i).includes(id)</code> or <code>indexOf</code> inside the loop: correct on small logs, but O(n²) — the 200 000-scan check runs out of time.', 'Kiểm bằng <code>scans.slice(0, i).includes(id)</code> hay <code>indexOf</code> trong vòng lặp: đúng với log nhỏ nhưng O(n²) — kiểm 200 000 lượt quẹt hết giờ.'],
    ['Counting everything first, then returning the first ID with count ≥ 2 in input order: that finds the ID that <i>appeared</i> first, not the one that <i>repeated</i> first (fails <code>["SE1","SE2","SE2","SE1"]</code>).', 'Đếm hết trước rồi trả mã đầu tiên có số đếm ≥ 2 theo thứ tự đầu vào: đó là mã <i>xuất hiện</i> trước, không phải mã <i>lặp lại</i> trước (trượt <code>["SE1","SE2","SE2","SE1"]</code>).'],
    ['Using a plain object <code>{}</code> as the set: an ID like <code>"constructor"</code> or <code>"__proto__"</code> is "already there" before you add anything.', 'Dùng object thường <code>{}</code> làm tập: mã như <code>"constructor"</code> hay <code>"__proto__"</code> "đã có sẵn" trước khi bạn thêm gì.'],
  ],
  gt: ['One pass, and at every position we ask a Set whether the ID was seen before. The first "yes" is by definition the earliest second appearance, so we can stop immediately. Each <code>has</code>/<code>add</code> is O(1) on average ⇒ O(n) time, O(n) memory for the set. The brute force compares every scan with every earlier scan: n(n−1)/2 ≈ 2·10¹⁰ comparisons for n = 2·10⁵ — tens of seconds.', 'Một lượt quét, và ở mỗi vị trí ta hỏi Set xem mã đã gặp chưa. Câu "rồi" đầu tiên theo định nghĩa chính là lần xuất hiện thứ hai sớm nhất, nên dừng ngay được. Mỗi <code>has</code>/<code>add</code> trung bình O(1) ⇒ O(n) thời gian, O(n) bộ nhớ cho tập. Vét cạn so mỗi lượt quẹt với mọi lượt trước nó: n(n−1)/2 ≈ 2·10¹⁰ phép so với n = 2·10⁵ — hàng chục giây.'],
  kn: ['hash set', 'first repeated element'],
  tns: [tn('hash set', 'tập băm', 'Set trong JS: has/add trung bình O(1).'), tn('brute force', 'vét cạn'), tn('early return', 'trả về sớm', 'dừng vòng lặp ngay khi có đáp án.')],
  dau: `/**
 * scans: string[] — student IDs in tap order
 * returns the ID whose SECOND appearance comes first, or null
 */
function firstRepeat(scans) {
  // Write your solution here
  return null;
}
`,
  giai: '// Reference solution — one pass with a Set: check, then add.\n' + nguon(firstRepeat),
  cases: [
    { args: [['SE1', 'SE2', 'SE2', 'SE1']], moTa: ['SE2 repeats before SE1 does', 'SE2 lặp trước SE1'] },
    { args: [['HE180001', 'SE170234', 'HE180001']] },
    { args: [['SE1', 'SE2', 'SE3']], moTa: ['Nobody scanned twice ⇒ null', 'Không ai quẹt hai lần ⇒ null'] },
    { args: [[]], an: true, moTa: ['Empty log', 'Log rỗng'] },
    { args: [['se1', 'SE1', 'Se1', 'SE1']], an: true, moTa: ['IDs are case-sensitive', 'Mã phân biệt hoa thường'] },
    { args: [['constructor', 'toString', '__proto__', 'toString']], an: true, moTa: ['Tricky IDs that live on Object.prototype', 'Mã "khó" trùng tên thuộc tính của Object.prototype'] },
    { args: [['A', 'B', 'C', 'D', 'C', 'B', 'A']], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 scans, the repeat is the very last one (O(n²) runs out of the 4 s limit)', 'Hiệu năng: 200 000 lượt quẹt, lần lặp là lượt cuối cùng (O(n²) hết trần 4 giây)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n - 1; i++) a[i] = "SE" + (100000 + i); a[n - 1] = a[R(n - 1)]; return firstRepeat(a);',
  }],
  saiMau: [
    { ten: ['O(n²): slice().includes() for every scan', 'O(n²): slice().includes() cho mỗi lượt quẹt'], chiHieuNang: true, ma: 'function firstRepeat(scans) {\n  for (var i = 0; i < scans.length; i++) if (scans.slice(0, i).includes(scans[i])) return scans[i];\n  return null;\n}\n' },
    { ten: ['Counts first, returns the first ID that appears twice anywhere', 'Đếm trước, trả mã đầu tiên có xuất hiện hai lần'], ma: 'function firstRepeat(scans) {\n  var c = new Map();\n  for (var id of scans) c.set(id, (c.get(id) || 0) + 1);\n  for (var id2 of scans) if (c.get(id2) > 1) return id2;\n  return null;\n}\n' },
  ],
});

/* ── 2. Phần bù + đếm: số cặp đơn hàng chạm đúng mức voucher ── */
function countPairs(prices, target) {
  var count = 0;
  var seen = new Map(); // price -> how many earlier items had this price
  for (var i = 0; i < prices.length; i++) {
    var need = target - prices[i];
    // every earlier item priced `need` forms a pair (j, i) with j < i — CHECK before INSERT, so i never pairs with itself
    count += seen.get(need) || 0;
    seen.set(prices[i], (seen.get(prices[i]) || 0) + 1);
  }
  return count;
}
const D2 = bai({
  ten: 'Voucher pairs: how many item pairs hit the exact total', kho: 'MEDIUM', phut: 15, ham: 'countPairs',
  en: `<p>A campus shop runs a promotion: buy <b>exactly two</b> items whose prices add up to exactly <code>target</code> (in thousand VND) and the voucher covers both. Marketing wants to know how many different pairs of items on the shelf qualify.</p>
<p>Write <code>countPairs(prices, target)</code>: the number of index pairs <code>(i, j)</code> with <code>i &lt; j</code> and <code>prices[i] + prices[j] === target</code>. Items are different even when their prices are equal, so duplicates count separately.</p>`,
  vi: `<p>Căng-tin trường chạy khuyến mãi: mua <b>đúng hai</b> món có tổng giá đúng bằng <code>target</code> (nghìn đồng) thì voucher trả cả hai. Bộ phận marketing muốn biết trên kệ có bao nhiêu cặp món khác nhau đủ điều kiện.</p>
<p>Viết <code>countPairs(prices, target)</code>: số cặp chỉ số <code>(i, j)</code> với <code>i &lt; j</code> và <code>prices[i] + prices[j] === target</code>. Hai món là khác nhau kể cả khi cùng giá, nên giá trùng được đếm riêng.</p>`,
  dauVao: ['prices — array of positive integers; target — positive integer.', 'prices — mảng số nguyên dương; target — số nguyên dương.'],
  dauRa: ['The number of pairs (a number — it can exceed 2³¹ for large inputs).', 'Số cặp (một số — với đầu vào lớn có thể vượt 2³¹).'],
  rangBuoc: [['0 ≤ prices.length ≤ 200 000; 1 ≤ prices[i], target ≤ 10⁶.', '0 ≤ prices.length ≤ 200 000; 1 ≤ prices[i], target ≤ 10⁶.'], ['Target: O(n) time.', 'Mục tiêu: O(n) thời gian.']],
  goiY: [
    ['Fix the second item of the pair at position i. Which earlier prices complete it? Exactly the ones equal to <code>target − prices[i]</code>.', 'Cố định món thứ hai của cặp ở vị trí i. Những giá nào phía trước ghép được với nó? Đúng những giá bằng <code>target − prices[i]</code>.'],
    ['Keep a Map price → how many times seen so far. At each i add <code>seen.get(need)</code> to the answer, and only THEN record <code>prices[i]</code>.', 'Giữ Map giá → số lần đã gặp. Tại mỗi i cộng <code>seen.get(need)</code> vào đáp án, rồi MỚI ghi <code>prices[i]</code> vào.'],
  ],
  loi: [
    ['Insert before checking: when <code>prices[i] * 2 === target</code> the item pairs with itself (for <code>[50]</code>, target 100 you would answer 1 instead of 0).', 'Thêm trước khi kiểm: khi <code>prices[i] * 2 === target</code> món đó tự ghép với chính nó (với <code>[50]</code>, target 100 sẽ trả 1 thay vì 0).'],
    ['Storing a Set of prices instead of counts: <code>[30, 30, 70]</code>, target 100 has 2 pairs, a Set sees only one 30.', 'Lưu Set giá thay vì số đếm: <code>[30, 30, 70]</code>, target 100 có 2 cặp, Set chỉ thấy một số 30.'],
    ['Two nested loops: correct, but 2·10¹⁰ steps on the large shelf ⇒ out of time.', 'Hai vòng lồng nhau: đúng, nhưng 2·10¹⁰ bước với kệ lớn ⇒ hết giờ.'],
  ],
  gt: ['Every pair (j, i) with j &lt; i is counted exactly once — at the moment we stand on its right end i, when all earlier items are already in the map. Checking before inserting is what keeps i from pairing with itself, and storing counts (not a set) is what makes equal prices count separately. One pass, O(1) average per step ⇒ O(n) time and O(distinct prices) memory. The answer can reach about n²/2 = 2·10¹⁰, which a JS number holds exactly (below 2⁵³); in Java you would need a <code>long</code>.', 'Mỗi cặp (j, i) với j &lt; i được đếm đúng một lần — lúc ta đứng ở đầu phải i của nó, khi mọi món phía trước đã nằm trong map. Kiểm trước khi thêm giữ cho i không tự ghép với chính nó, và lưu SỐ ĐẾM (không phải tập) làm giá trùng được đếm riêng. Một lượt, trung bình O(1) mỗi bước ⇒ O(n) thời gian, O(số giá khác nhau) bộ nhớ. Đáp án có thể tới khoảng n²/2 = 2·10¹⁰, số JS giữ chính xác (dưới 2⁵³); trong Java phải dùng <code>long</code>.'],
  kn: ['hash map', 'complement lookup', 'counting pairs'],
  tns: [tn('complement', 'phần bù', 'giá trị còn thiếu: target − x.'), tn('frequency map', 'bảng tần suất', 'Map giá trị → số lần xuất hiện.'), tn('overflow', 'tràn số')],
  dau: `/**
 * prices: number[], target: number
 * returns how many index pairs i < j have prices[i] + prices[j] === target
 */
function countPairs(prices, target) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — complement lookup with a frequency map, check BEFORE insert.\n' + nguon(countPairs),
  cases: [
    { args: [[30, 70, 50, 20, 80], 100], moTa: ['(30,70) and (20,80)', '(30,70) và (20,80)'] },
    { args: [[30, 30, 70], 100], moTa: ['Equal prices are different items ⇒ 2', 'Cùng giá vẫn là hai món ⇒ 2'] },
    { args: [[50], 100], moTa: ['One item cannot pair with itself ⇒ 0', 'Một món không tự ghép với chính nó ⇒ 0'] },
    { args: [[], 10], an: true },
    { args: [[50, 50, 50, 50], 100], an: true, moTa: ['Four 50s ⇒ 6 pairs', 'Bốn món 50 ⇒ 6 cặp'] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9], 10], an: true },
    { args: [[15, 25, 35], 100], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 prices in [1, 1000], target 1000 (answer ≈ 2·10⁷ pairs; nested loops time out)', 'Hiệu năng: 200 000 giá trong [1, 1000], target 1000 (đáp án ≈ 2·10⁷ cặp; hai vòng lồng hết giờ)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = 1 + R(1000); return countPairs(a, 1000);',
  }],
  saiMau: [
    { ten: ['O(n²): two nested loops', 'O(n²): hai vòng lồng nhau'], chiHieuNang: true, ma: 'function countPairs(prices, target) {\n  var c = 0;\n  for (var i = 0; i < prices.length; i++) for (var j = i + 1; j < prices.length; j++) if (prices[i] + prices[j] === target) c++;\n  return c;\n}\n' },
    { ten: ['Insert before check (pairs an item with itself)', 'Thêm trước rồi mới kiểm (tự ghép với chính nó)'], ma: 'function countPairs(prices, target) {\n  var c = 0, seen = new Map();\n  for (var p of prices) { seen.set(p, (seen.get(p) || 0) + 1); c += seen.get(target - p) || 0; }\n  return c;\n}\n' },
  ],
});

/* ── 3. Gom nhóm theo khoá chuẩn hoá: máy lab cài cùng bộ phần mềm ── */
function groupSameSoftware(pcs) {
  var groups = new Map(); // canonical key -> list of PC ids, in input order
  for (var i = 0; i < pcs.length; i++) {
    // canonical form of a SET of apps: drop duplicates, sort, then JSON-encode.
    // JSON.stringify keeps the boundaries between names, so ["a,b"] and ["a","b"] get different keys.
    var key = JSON.stringify(Array.from(new Set(pcs[i].apps)).sort());
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(pcs[i].id);
  }
  var out = [];
  groups.forEach(function (ids) { if (ids.length >= 2) out.push(ids); }); // Map keeps insertion order = first appearance
  return out;
}
const D3 = bai({
  ten: 'Lab PCs with the exact same software', kho: 'MEDIUM', phut: 20, ham: 'groupSameSoftware',
  en: `<p>Before the PE exam the IT team exports the installed-software list of every PC in the lab: <code>pcs = [{ id, apps }]</code>. The lists come from different scripts, so the same app can be listed twice and the order is random. To push one exam image per configuration they need the machines that have <b>exactly the same set</b> of apps.</p>
<p>Write <code>groupSameSoftware(pcs)</code> returning an array of groups. A group is the array of PC ids (in input order) sharing the same set of apps; only groups with <b>at least two</b> PCs are returned, ordered by the position of their first PC in the input.</p>
<p>App names are free text and may contain any character, including commas and spaces (e.g. <code>"Eclipse 2024-09,Java 21"</code> is ONE app name). Names are case-sensitive.</p>`,
  vi: `<p>Trước buổi thi PE, đội IT xuất danh sách phần mềm đã cài của mọi máy trong phòng lab: <code>pcs = [{ id, apps }]</code>. Danh sách đến từ các script khác nhau nên một ứng dụng có thể bị liệt kê hai lần và thứ tự lộn xộn. Để đẩy một bản ảnh đề thi cho mỗi cấu hình, họ cần các máy có <b>đúng cùng một tập</b> ứng dụng.</p>
<p>Viết <code>groupSameSoftware(pcs)</code> trả về mảng các nhóm. Mỗi nhóm là mảng id máy (theo thứ tự đầu vào) có cùng tập ứng dụng; chỉ trả các nhóm có <b>ít nhất hai</b> máy, xếp theo vị trí máy đầu tiên của nhóm trong đầu vào.</p>
<p>Tên ứng dụng là chữ tự do, có thể chứa mọi ký tự kể cả dấu phẩy và khoảng trắng (vd <code>"Eclipse 2024-09,Java 21"</code> là MỘT tên ứng dụng). Tên phân biệt hoa thường.</p>`,
  dauVao: ['pcs — array of { id: string, apps: string[] }.', 'pcs — mảng { id: string, apps: string[] }.'],
  dauRa: ['string[][] — groups of ids.', 'string[][] — các nhóm id.'],
  rangBuoc: [['0 ≤ pcs.length ≤ 60 000; 0 ≤ apps.length ≤ 20.', '0 ≤ pcs.length ≤ 60 000; 0 ≤ apps.length ≤ 20.'], ['Target: O(n · m log m) where m = apps per PC.', 'Mục tiêu: O(n · m log m) với m = số ứng dụng mỗi máy.']],
  goiY: [
    ['Two PCs belong together exactly when some <i>canonical form</i> of their app lists is equal. Use that form as a Map key.', 'Hai máy cùng nhóm đúng khi một <i>dạng chuẩn</i> nào đó của danh sách ứng dụng bằng nhau. Dùng dạng đó làm khoá Map.'],
    ['Canonical form of a set: remove duplicates, sort. Then turn the array into a string that cannot be confused — <code>join(",")</code> can (<code>["a,b"]</code> vs <code>["a","b"]</code>); <code>JSON.stringify</code> cannot.', 'Dạng chuẩn của một tập: bỏ trùng, sắp xếp. Rồi biến mảng thành chuỗi không thể nhầm — <code>join(",")</code> nhầm được (<code>["a,b"]</code> và <code>["a","b"]</code>); <code>JSON.stringify</code> thì không.'],
  ],
  loi: [
    ['Building the key with <code>apps.sort().join(",")</code>: names containing a comma collide, and <code>sort()</code> also mutates the input.', 'Dựng khoá bằng <code>apps.sort().join(",")</code>: tên chứa dấu phẩy va nhau, và <code>sort()</code> còn sửa luôn mảng đầu vào.'],
    ['Forgetting to remove duplicates: <code>["Git","Git","Java"]</code> and <code>["Java","Git"]</code> are the same set.', 'Quên bỏ trùng: <code>["Git","Git","Java"]</code> và <code>["Java","Git"]</code> là cùng một tập.'],
    ['Comparing every pair of PCs: O(n²·m) — the 60 000-PC check times out.', 'So từng cặp máy: O(n²·m) — kiểm 60 000 máy hết giờ.'],
  ],
  gt: ['"Group things that are equivalent" = choose a key that is equal exactly when two things are equivalent, then one pass with a Map. Here equivalence is set equality, so the key must ignore order (sort) and multiplicity (Set), and its string encoding must be injective — JSON quotes and escapes each name, so no two different sets map to the same string. A JS Map iterates in insertion order, which gives "ordered by first PC" for free. Cost: O(m log m) per PC for the sort ⇒ O(n · m log m) total, versus O(n²·m) for pairwise comparison.', '"Gom những thứ tương đương" = chọn một khoá bằng nhau đúng khi hai thứ tương đương, rồi quét một lượt với Map. Ở đây tương đương là bằng nhau như TẬP, nên khoá phải bỏ qua thứ tự (sort) và số lần lặp (Set), và cách mã hoá thành chuỗi phải đơn ánh — JSON đặt nháy và thoát ký tự từng tên, nên hai tập khác nhau không bao giờ ra cùng chuỗi. Map của JS duyệt theo thứ tự thêm vào, nên "xếp theo máy đầu tiên" có sẵn. Chi phí: O(m log m) mỗi máy cho phép sắp ⇒ tổng O(n · m log m), so với O(n²·m) khi so từng cặp.'],
  kn: ['grouping by key', 'canonical form'],
  tns: [tn('canonical form', 'dạng chuẩn', 'một cách viết duy nhất cho mọi thứ tương đương nhau.'), tn('collision', 'va chạm khoá', 'hai thứ khác nhau ra cùng một khoá.'), tn('insertion order', 'thứ tự thêm vào')],
  dau: `/**
 * pcs: { id: string, apps: string[] }[]
 * returns groups (arrays of ids, input order) of >= 2 PCs that have exactly the same SET of apps
 */
function groupSameSoftware(pcs) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — Map from a canonical key (dedupe + sort + JSON) to the list of ids.\n' + nguon(groupSameSoftware),
  cases: [
    { args: [[{ id: 'PC01', apps: ['Java', 'Git'] }, { id: 'PC02', apps: ['NetBeans'] }, { id: 'PC03', apps: ['Git', 'Java'] }]], moTa: ['Order of apps does not matter', 'Thứ tự ứng dụng không quan trọng'] },
    { args: [[{ id: 'PC01', apps: ['Git', 'Git', 'Java'] }, { id: 'PC02', apps: ['Java', 'Git'] }, { id: 'PC03', apps: ['SQL Server'] }, { id: 'PC04', apps: ['SQL Server'] }]], moTa: ['Duplicates in a list are ignored; two groups', 'Bỏ qua tên lặp trong danh sách; hai nhóm'] },
    { args: [[{ id: 'PC01', apps: ['VS Code'] }, { id: 'PC02', apps: ['vs code'] }]], moTa: ['Names are case-sensitive ⇒ no group', 'Tên phân biệt hoa thường ⇒ không nhóm nào'] },
    { args: [[{ id: 'PC01', apps: ['Eclipse 2024-09,Java 21'] }, { id: 'PC02', apps: ['Eclipse 2024-09', 'Java 21'] }, { id: 'PC03', apps: ['Java 21', 'Eclipse 2024-09'] }]], an: true, moTa: ['A comma inside a name must not split it', 'Dấu phẩy trong tên không được tách tên ra'] },
    { args: [[]], an: true },
    { args: [[{ id: 'A', apps: [] }, { id: 'B', apps: ['Git'] }, { id: 'C', apps: [] }, { id: 'D', apps: ['Git'] }, { id: 'E', apps: [] }]], an: true, moTa: ['Empty app lists form a group too', 'Máy không cài gì cũng thành một nhóm'] },
  ],
  perf: [{
    moTa: ['Performance: 60 000 PCs, 12 apps each from 4 configurations (pairwise comparison times out)', 'Hiệu năng: 60 000 máy, mỗi máy 12 ứng dụng thuộc 4 cấu hình (so từng cặp hết giờ)'],
    than: 'var base = []; for (var k = 0; k < 20; k++) base.push("App " + k); var pcs = []; for (var i = 0; i < 60000; i++) { var cfg = R(4) === 0 ? R(60000) : R(4), apps = []; for (var j = 0; j < 12; j++) apps.push(base[(cfg + j * 7) % 20] + (cfg > 3 ? "#" + cfg : "")); for (var t = apps.length - 1; t > 0; t--) { var u = R(t + 1), x = apps[t]; apps[t] = apps[u]; apps[u] = x; } pcs.push({ id: "PC" + i, apps: apps }); } var g = groupSameSoftware(pcs); var tong = 0, lon = 0; for (var q = 0; q < g.length; q++) { tong += g[q].length; if (g[q].length > lon) lon = g[q].length; } return { groups: g.length, pcsInGroups: tong, largest: lon, firstIds: g.slice(0, 2).map(function (x) { return x.slice(0, 3); }) };',
  }],
  saiMau: [
    { ten: ['Key = apps.sort().join(",") (commas collide)', 'Khoá = apps.sort().join(",") (dấu phẩy va nhau)'], ma: 'function groupSameSoftware(pcs) {\n  var g = new Map();\n  for (var p of pcs) { var k = Array.from(new Set(p.apps)).sort().join(","); if (!g.has(k)) g.set(k, []); g.get(k).push(p.id); }\n  return [...g.values()].filter(function (x) { return x.length > 1; });\n}\n' },
  ],
});

/* ── 4. Đếm theo phần dư: ghép mọi khoản thành cặp chia hết cho k ── */
function canPairAll(amounts, k) {
  if (amounts.length % 2 !== 0) return false; // an odd count can never be fully paired
  var byRem = new Map(); // remainder (0..k-1) -> how many amounts have it
  for (var i = 0; i < amounts.length; i++) {
    var r = ((amounts[i] % k) + k) % k; // JS % keeps the sign: -3 % 5 === -3, normalise to 2
    byRem.set(r, (byRem.get(r) || 0) + 1);
  }
  var ok = true;
  byRem.forEach(function (cnt, r) {
    if (r === 0 || 2 * r === k) { if (cnt % 2 !== 0) ok = false; } // pairs within the class itself
    else if (cnt !== (byRem.get(k - r) || 0)) ok = false;            // r must meet k - r one for one
  });
  return ok;
}
const D4 = bai({
  ten: 'Cash drawer audit: pair every entry into multiples of k', kho: 'HARD', phut: 25, ham: 'canPairAll',
  en: `<p>At closing time the shop's cash log <code>amounts</code> contains sales (positive) and refunds (negative), in thousand VND. The audit rule says the entries must be grouped into <b>pairs</b> (every entry used exactly once) so that the total of each pair is a multiple of <code>k</code> — the bank only accepts bundles of <code>k</code>.</p>
<p>Write <code>canPairAll(amounts, k)</code> that returns <code>true</code> if such a pairing exists, <code>false</code> otherwise. An empty log is trivially fine.</p>`,
  vi: `<p>Cuối ngày, sổ tiền mặt <code>amounts</code> của cửa hàng có khoản bán (dương) và khoản hoàn tiền (âm), đơn vị nghìn đồng. Luật kiểm toán: các khoản phải ghép thành từng <b>cặp</b> (mỗi khoản dùng đúng một lần) sao cho tổng mỗi cặp là bội của <code>k</code> — ngân hàng chỉ nhận từng bó <code>k</code>.</p>
<p>Viết <code>canPairAll(amounts, k)</code> trả về <code>true</code> nếu có cách ghép như vậy, ngược lại <code>false</code>. Sổ rỗng thì hiển nhiên ổn.</p>`,
  dauVao: ['amounts — array of integers (may be negative or zero); k — integer ≥ 1.', 'amounts — mảng số nguyên (có thể âm hoặc 0); k — số nguyên ≥ 1.'],
  dauRa: ['true / false', 'true / false'],
  rangBuoc: [['0 ≤ amounts.length ≤ 200 000; −10⁹ ≤ amounts[i] ≤ 10⁹; 1 ≤ k ≤ 10⁵.', '0 ≤ amounts.length ≤ 200 000; −10⁹ ≤ amounts[i] ≤ 10⁹; 1 ≤ k ≤ 10⁵.'], ['Target: O(n + k) time.', 'Mục tiêu: O(n + k) thời gian.']],
  goiY: [
    ['Only the remainder modulo k matters: a + b is a multiple of k exactly when <code>(a mod k) + (b mod k)</code> is 0 or k.', 'Chỉ phần dư modulo k là quan trọng: a + b là bội của k đúng khi <code>(a mod k) + (b mod k)</code> bằng 0 hoặc k.'],
    ['Count how many entries have each remainder r. Then every r must be matched one-for-one with k − r. Two classes pair with themselves: r = 0, and r = k/2 when k is even — their counts must be even.', 'Đếm số khoản theo từng phần dư r. Rồi mỗi r phải khớp một-một với k − r. Có hai lớp tự ghép với chính nó: r = 0, và r = k/2 khi k chẵn — số đếm của chúng phải chẵn.'],
    ['In JavaScript <code>-7 % 5</code> is <code>-2</code>, not 3. Normalise with <code>((x % k) + k) % k</code>.', 'Trong JavaScript <code>-7 % 5</code> là <code>-2</code>, không phải 3. Chuẩn hoá bằng <code>((x % k) + k) % k</code>.'],
  ],
  loi: [
    ['Using <code>x % k</code> directly: a refund of −3 with k = 5 lands in "remainder −3" and never meets its partner 3 (remainder 2 it should be).', 'Dùng thẳng <code>x % k</code>: khoản hoàn −3 với k = 5 rơi vào "phần dư −3" và không bao giờ gặp bạn ghép 3 (đúng ra phần dư là 2).'],
    ['Handling remainder 0 like the others: "count[0] must equal count[k − 0]" looks up remainder k, which never exists, so <code>[10, 20]</code> with k = 10 is wrongly rejected. Classes 0 and k/2 pair with themselves.', 'Xử lý phần dư 0 như các lớp khác: "count[0] phải bằng count[k − 0]" tra phần dư k — không bao giờ có — nên <code>[10, 20]</code> với k = 10 bị từ chối oan. Lớp 0 và lớp k/2 tự ghép với chính nó.'],
    ['Greedy search for a partner with nested loops: correct, but O(n²) on 200 000 entries.', 'Dò bạn ghép bằng hai vòng lồng: đúng, nhưng O(n²) với 200 000 khoản.'],
  ],
  gt: ['A pairing only cares about remainders, so we compress the n entries into at most k counters. If a valid pairing exists, every entry with remainder r is paired with one of remainder k − r, so the two counts are equal; the self-paired classes 0 and k/2 must have even counts. Conversely, if those conditions hold we can pair the classes up directly, so the test is exact. Counting is O(n), checking the classes O(k) ⇒ O(n + k) time and O(min(n, k)) memory. Normalising the remainder matters because JavaScript\'s % takes the sign of the dividend.', 'Một cách ghép chỉ quan tâm phần dư, nên ta nén n khoản thành tối đa k bộ đếm. Nếu có cách ghép hợp lệ thì mỗi khoản dư r ghép với một khoản dư k − r, nên hai số đếm bằng nhau; hai lớp tự ghép 0 và k/2 phải có số đếm chẵn. Ngược lại, nếu các điều kiện đó đúng thì ghép thẳng từng lớp được, nên phép thử là chính xác. Đếm O(n), soát các lớp O(k) ⇒ O(n + k) thời gian, O(min(n, k)) bộ nhớ. Phải chuẩn hoá phần dư vì % của JavaScript lấy dấu của số bị chia.'],
  kn: ['hash map counting', 'modular arithmetic'],
  tns: [tn('remainder', 'phần dư'), tn('modulo', 'phép lấy dư (mod)'), tn('self-paired class', 'lớp tự ghép', 'phần dư r mà r + r ≡ 0 (mod k): r = 0 và r = k/2.')],
  dau: `/**
 * amounts: number[] (sales > 0, refunds < 0), k: number
 * returns true if the entries can be split into pairs whose sums are all multiples of k
 */
function canPairAll(amounts, k) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution — count remainders (normalised for negatives), then match r with k - r.\n' + nguon(canPairAll),
  cases: [
    { args: [[12, 18, 7, 23], 10], moTa: ['12+18 and 7+23 ⇒ true', '12+18 và 7+23 ⇒ true'] },
    { args: [[1, 2, 3, 4], 10], moTa: ['No pair sums to a multiple of 10 ⇒ false', 'Không cặp nào có tổng là bội của 10 ⇒ false'] },
    { args: [[-3, 8, 4, 6], 5], moTa: ['Refund −3 pairs with 8 ⇒ true', 'Khoản hoàn −3 ghép với 8 ⇒ true'] },
    { args: [[], 7], an: true },
    { args: [[5, 15, 25, 35, 1, 9], 10], an: true, moTa: ['Remainder k/2 pairs within its own class ⇒ true', 'Lớp dư k/2 tự ghép trong lớp ⇒ true'] },
    { args: [[3, 7, 13, 17], 10], an: true },
    { args: [[10, 20, 0, -30], 10], an: true, moTa: ['Remainder 0 class, even count ⇒ true', 'Lớp dư 0, số đếm chẵn ⇒ true'] },
    { args: [[-7, -3, 2, 8, -1, 1], 5], an: true },
    { args: [[4, 6, 4], 5], an: true, moTa: ['Odd number of entries ⇒ false', 'Số khoản lẻ ⇒ false'] },
    { args: [[3, 3, 3, 3], 1], an: true, moTa: ['k = 1: everything is a multiple ⇒ true', 'k = 1: mọi số đều là bội ⇒ true'] },
    { args: [[2, 2, 3, 3], 5], an: true },
  ],
  perf: [
    {
      moTa: ['Performance: 200 000 entries that CAN be paired, k = 1000 (nested-loop pairing times out)', 'Hiệu năng: 200 000 khoản GHÉP ĐƯỢC, k = 1000 (ghép bằng vòng lồng hết giờ)'],
      than: 'var k = 1000, a = []; for (var i = 0; i < 100000; i++) { var x = R(2000000) - 1000000; a.push(x); a.push(k * (R(2000) - 1000) - x); } for (var t = a.length - 1; t > 0; t--) { var u = R(t + 1), y = a[t]; a[t] = a[u]; a[u] = y; } return canPairAll(a, k);',
    },
  ],
  saiMau: [
    { ten: ['O(n²): greedy partner search with nested loops', 'O(n²): dò bạn ghép tham lam bằng vòng lồng'], chiHieuNang: true, ma: 'function canPairAll(amounts, k) {\n  var used = new Array(amounts.length).fill(false);\n  for (var i = 0; i < amounts.length; i++) {\n    if (used[i]) continue;\n    var found = false;\n    for (var j = i + 1; j < amounts.length; j++) if (!used[j] && (amounts[i] + amounts[j]) % k === 0) { used[i] = used[j] = true; found = true; break; }\n    if (!found) return false;\n  }\n  return true;\n}\n' },
    { ten: ['Raw x % k (negative remainders)', 'Dùng thẳng x % k (phần dư âm)'], ma: 'function canPairAll(amounts, k) {\n  if (amounts.length % 2) return false;\n  var c = new Map();\n  for (var x of amounts) c.set(x % k, (c.get(x % k) || 0) + 1);\n  for (var [r, n] of c) { if (r === 0 || 2 * r === k) { if (n % 2) return false; } else if (n !== (c.get(k - r) || 0)) return false; }\n  return true;\n}\n' },
  ],
});

export default mod('dsa-1-1-hash-map', '1.1 Hash map & set: trade memory for time', [D1, D2, D3, D4]);
