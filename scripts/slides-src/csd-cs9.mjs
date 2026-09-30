/**
 * csd-cs9.mjs — CSD201 ⭐ Chuyên sâu 9: CHUỖI, THAO TÁC BIT VÀ BĂM TRONG PHỎNG VẤN (deck tự dựng, không có trong
 * giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs9.mjs --out <dir>
 *
 * Nối tiếp bài trường Chương 7 (băm, csd13) và Chương 8 (KMP/Huffman/LZW, csd14) — không giảng lại. Mọi bảng từng
 * bước, mọi con số (PASS/FAIL, thời gian đo, số bước) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs9/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs9', code: 'CS9', title: 'Chuỗi, bit và băm', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf', lam: '#2b6cb0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:15.5px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const xanhB = (t) => `<b style="color:#2f7d4f">${t}</b>`;
const hai = (a, b, cols = '1fr 1fr') => `<div class="hai" style="grid-template-columns:${cols}"><div>${a}</div><div>${b}</div></div>`;

/* ───────────── SVG: 8 ô bit, tô màu theo vị trí ─────────────
 * bits: chuỗi 0/1 (trái = bit cao); mau: {index: 'do'|'xanh'|'cam'} theo chỉ số TỪ TRÁI
 */
function oBit(bits, mauIdx = {}, w = 40, h = 40) {
  let s = '';
  const n = bits.length;
  for (let i = 0; i < n; i++) {
    const m = mauIdx[i];
    s += `<rect x="${i * w}" y="0" width="${w}" height="${h}" fill="${m ? NEN[m] : NEN.trang}" stroke="${m ? MAU[m] : MAU.vien}" stroke-width="${m ? 2.6 : 1.4}"/>`;
    s += `<text x="${i * w + w / 2}" y="${h / 2 + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="${m === 'do' ? MAU.do : '#262626'}">${bits[i]}</text>`;
  }
  return `<svg viewBox="0 0 ${n * w} ${h}" width="${n * w}" font-family="Menlo, monospace">${s}</svg>`;
}

/* slide 9: cửa sổ trượt của Rabin–Karp trên "abababcababab", mẫu "abab" (4 ký tự) */
function truotRK() {
  const text = 'abababcababab';
  const hits = new Set([0, 2, 7, 9]);
  let s = '';
  const w = 34;
  for (let i = 0; i < text.length; i++) {
    s += `<rect x="${i * w}" y="0" width="${w}" height="34" fill="${NEN.trang}" stroke="${MAU.vien}" stroke-width="1.2"/>`;
    s += `<text x="${i * w + w / 2}" y="23" text-anchor="middle" font-size="18" font-weight="700" fill="#262626">${text[i]}</text>`;
  }
  let s2 = '';
  for (const i of hits) {
    s2 += `<rect x="${i * w}" y="0" width="${4 * w}" height="26" rx="4" fill="none" stroke="${MAU.xanh}" stroke-width="2.6"/>`;
  }
  return `<svg viewBox="0 -30 ${text.length * w} 64" width="${text.length * w}" font-family="Arial, sans-serif">
    <text x="0" y="-8" font-size="14" fill="${MAU.nau}" font-weight="700">khớp tại i = 0, 2, 7, 9 (khung xanh)</text>
    <g transform="translate(0,4)">${s}${s2}</g></svg>`;
}

export const slides = lamDeck('CHUỖI, THAO TÁC BIT VÀ BĂM TRONG PHỎNG VẤN', [
  /* 1 */
  { cover: true, t: 'Chuỗi, thao tác bit và băm trong phỏng vấn', sub: 'Two-sum · anagram · dãy liên tiếp · hashCode/equals · Rabin–Karp · Z-function<br>StringBuilder · palindrome · bù hai · XOR · bitmask · cờ trạng thái<br>CSD201 · Java 8 — mọi bảng, mọi số đo đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Bốn mẫu băm hay gặp khi phỏng vấn', body: `${bang([
    ['<b>Đếm / tra cứu</b>', 'HashMap&lt;giá trị, số lần hoặc chỉ số&gt;', 'two-sum, tần suất, ký tự đầu duy nhất'],
    ['<b>Gộp nhóm theo khoá</b>', 'khoá = một dạng chuẩn hoá của dữ liệu', 'nhóm anagram, nhóm theo tổng chữ số…'],
    ['<b>Cửa sổ trượt + băm</b>', 'HashMap/HashSet nhớ vị trí gần nhất', 'dãy liên tiếp dài nhất, chuỗi con không lặp'],
    ['<b>Băm nội dung để so nhanh</b>', 'một số nguyên đại diện cho một chuỗi/đối tượng', 'Rabin–Karp, khoá tự định nghĩa (bài 7.29)'],
  ], ['Mẫu', 'Ý tưởng', 'Ví dụ'], 'font-size:20px')}
<div class="hai">${o('Bài 7 (Hashing) đã dạy <b>bảng băm dựng tay</b> — mở địa chỉ, dây chuyền, hàm băm. Ở đây ta <b>dùng</b> <code>HashMap</code>/<code>HashSet</code> có sẵn của Java để giải bài phỏng vấn, không dựng lại bảng.', 'xanh')}
${o('Bài 8 (Text Processing) đã dạy KMP bằng bảng thất bại (failure function). Ở đây thêm hai kỹ thuật KMP không dạy: <b>Rabin–Karp</b> (băm lăn) và <b>Z-function</b>.')}</div>` },

  /* 3 */
  { t: 'Two-sum: một lượt bằng HashMap', body: `${hai(`
${code(`for (int i = 0; i < a.length; i++) {
    int need = target - a[i];
    if (seen.containsKey(need))
        return new int[]{seen.get(need), i};   // tra TRƯỚC, chèn SAU
    seen.put(a[i], i);
}`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:6px">
<li>Tra <code>need</code> <b>trước khi</b> chèn <code>a[i]</code> — nếu chèn trước, {3,3} target 6 sẽ tự khớp với chính nó</li>
<li><b>O(n)</b> thời gian, O(n) bộ nhớ — so với vét cạn O(n²)</li>
</ul>`, `${out(`array = [2, 7, 11, 15, -3, 7], target = 9
  i=0 a[i]=2 need=7 not seen -> put 2
  i=1 a[i]=7 need=2 found at 0 -> pair (0,1)`)}
${nho('3000 mảng ngẫu nhiên, cặp HashMap trả về luôn đúng: <b>PASS</b>.')}
${bang([
    ['rỗng', 'null'], ['một phần tử', 'null'], ['không có cặp', 'null'], ['trùng {3,3}, target 6', '[0, 1]'],
  ], ['Ca biên', 'Kết quả'], 'font-size:18px;margin-top:6px')}`)}` },

  /* 4 */
  { t: 'Nhóm anagram: khoá là chuỗi đã CHUẨN HOÁ', body: `${hai(`
<ul style="font-size:20px">
<li><b>Khoá 1 — ký tự đã sắp:</b> "eat" và "tea" cùng sắp thành "aet"</li>
<li><b>Khoá 2 — mảng đếm 26 chữ:</b> đếm rồi nối thành chuỗi, <b>không cần sắp</b></li>
</ul>
${code(`// khoá 1: O(L log L) mỗi từ
char[] c = s.toCharArray(); Arrays.sort(c);
String key = new String(c);

// khoá 2: O(L) mỗi từ, 26 là hằng số
int[] cnt = new int[26];
for (char ch : s.toCharArray()) cnt[ch-'a']++;`, 'java', 'sm')}`, `${out(`"eat" -> "aet"   "tea" -> "aet"   "ate" -> "aet"
"tan" -> "ant"   "nat" -> "ant"
"bat" -> "abt"
groups: [[eat, tea, ate], [tan, nat], [bat]]`)}
${o('500 bộ từ ngẫu nhiên (bảng chữ 4 ký tự để ép nhiều trùng): khoá-sắp và khoá-đếm luôn cho <b>cùng một cách chia nhóm</b> — <b>PASS</b>.', 'xanh')}
${nho('n=6 từ, dài tới L=3: khoá sắp O(n·L log L), khoá đếm O(n·L). Khác biệt rõ khi L lớn.')}`)}` },

  /* 5 */
  { t: 'Đếm tần suất: merge() gộp getOrDefault + put', body: `${hai(`
${code(`Map<String,Integer> freq = new LinkedHashMap<>();
for (String w : text.split("[^a-z0-9]+"))
    if (!w.isEmpty())
        freq.merge(w, 1, Integer::sum);`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:6px">
<li><code>merge(k, 1, Integer::sum)</code> = "nếu chưa có thì đặt 1, có rồi thì +1" trong <b>một lệnh</b></li>
<li><code>get()</code> trên khoá không có trả <code>null</code>; <code>getOrDefault(k, 0)</code> trả 0 an toàn hơn</li>
</ul>`, `${out(`the -> 4   fox -> 2   dog -> 2
quick,jumps,over,lazy,runs,barks -> 1
most frequent: the(4)`)}
${o('So với đếm lại bằng vòng lặp lồng O(n²) trên cùng văn bản: kết quả <b>trùng khớp — PASS</b>.', 'xanh')}
${nho('get("cat") = null, nhưng getOrDefault("cat",0) = 0 — quên .getOrDefault() là lỗi NullPointerException hay gặp.')}`)}` },

  /* 6 */
  { t: 'Dãy liên tiếp dài nhất: chỉ đếm từ ĐIỂM BẮT ĐẦU', body: `${hai(`
${code(`Set<Integer> set = new HashSet<>(nums);
for (int x : set) {
    if (set.contains(x-1)) continue;   // không phải điểm bắt đầu
    int len = 1;
    while (set.contains(x+len)) len++;
    best = Math.max(best, len);
}`, 'java', 'sm')}
${o('Bỏ qua mọi x mà x-1 cũng có trong tập ⇒ mỗi số chỉ được "đi" trong vòng <code>while</code> đúng <b>một lần</b> trong toàn bộ vòng lặp ngoài — tổng chi phí <b>O(n)</b>, không phải O(n²).', 'xanh')}`, `${out(`nums = [100, 4, 200, 1, 3, 2]
  run start 1 -> length 4 (1..4)
longest run = 4`)}
${nho('n=6: tổng số bước của mọi vòng while cộng lại chỉ là <b>3</b> — đúng bằng n trừ 3 (100, 200 không mở được dãy dài).')}
${o('3000 mảng ngẫu nhiên, HashSet O(n) so với sắp-rồi-quét: <b>PASS</b>. Ca biên: rỗng→0, {5,5,5}→1 (trùng không tính hai lần), số âm cũng chạy đúng.', 'xanh')}`)}` },

  /* 7 */
  { t: 'hashCode/equals của khoá tự định nghĩa', body: `${hai(`
${code(`class PointFixed {
    int x, y;
    public boolean equals(Object o) {
        if (!(o instanceof PointFixed)) return false;
        PointFixed p = (PointFixed) o;
        return x == p.x && y == p.y;
    }
    public int hashCode() { return Objects.hash(x, y); }
}`, 'java', 'sm')}`, `${bang([
    ['Không viết đè gì', 'get(new (1,2))', '<b class="do">null</b> — so theo địa chỉ'],
    ['Viết đè cả hai, đúng', 'get(new (1,2))', xanhB('"A" — so theo giá trị')],
    ['Chỉ viết đè equals', 'containsKey(bằng equals)', '<b class="do">false</b> — sai bucket'],
  ], ['Lớp khoá', 'Thao tác', 'Kết quả'], 'font-size:18.5px')}
${o('<b>Hợp đồng bắt buộc:</b> hai đối tượng <code>equals()</code> đúng thì <code>hashCode()</code> PHẢI bằng nhau — nếu không, HashMap tính sai bucket và tìm mãi không thấy dù nó đang nằm đó.', 'do2')}
${nho('2000 cặp PointFixed ngẫu nhiên qua HashMap: <b>PASS</b>. Nối bài 7.29 (Hash Code) — <code>Objects.hash(...)</code> là cách viết tay gọn nhất.')}`)}` },

  /* 8 */
  { t: 'Bẫy: dùng mảng làm khoá HashMap', body: `${hai(`
${code(`Map<int[], String> bad = new HashMap<>();
int[] k1 = {1, 2, 3};
bad.put(k1, "first");
int[] k2 = {1, 2, 3};      // cùng nội dung, khác đối tượng
bad.get(k2);   // -> null !`, 'java', 'sm')}
${o('<code>int[]</code> <b>không viết đè</b> equals/hashCode — kế thừa từ Object nên so theo <b>địa chỉ</b>, không theo nội dung. <code>Arrays.equals(k1,k2)</code> là true nhưng <code>k1.equals(k2)</code> là false.', 'do2')}`, `${out(`get with DIFFERENT array, same content: null
get with the SAME array reference: first
fix with List<Integer> key: get: first
fix with Arrays.toString(arr) as key: get: first`)}
${bang([
    ['dùng nguyên <code>int[]</code>', '<b class="do">sai</b> — so địa chỉ'],
    ['bọc bằng <code>List&lt;Integer&gt;</code>', xanhB('đúng — List có content equals')],
    ['mã hoá thành <code>String</code> khoá', xanhB('đúng — đơn giản, dễ debug')],
  ], ['Cách làm khoá', 'Kết quả'], 'font-size:18.5px;margin-top:6px')}
${nho('Bẫy thứ hai: sửa nội dung khoá SAU khi put() — cả tra bằng chính đối tượng cũ cũng trả null (mục nằm sai bucket, coi như mất).')}`)}` },

  /* 9 */
  { t: 'Rabin–Karp: so khớp chuỗi bằng BĂM LĂN', body: `${hai(`
<ul style="font-size:20px">
<li><b>Băm lăn (rolling hash):</b> từ băm cửa sổ [i, i+m) suy ra băm [i+1, i+m+1) trong O(1), không băm lại từ đầu</li>
<li>Băm trùng ⇒ <b>vẫn phải so ký tự</b> (chỉ là gợi ý, không chắc chắn — sẽ thấy ở slide sau)</li>
</ul>
${code(`th = ((th - text.charAt(i)*pow % MOD + MOD)
      * BASE + text.charAt(i+m)) % MOD;
if (th == ph && text.regionMatches(i, pat, 0, m))
    hits.add(i);   // khớp băm rồi mới XÁC MINH`, 'java', 'sm')}`, `${truotRK()}
${nho('text = "abababcababab", pattern = "abab" (m=4): 4 lần băm trùng, cả 4 đều xác minh đúng.')}
${o('2000 cặp (text, mẫu) ngẫu nhiên trên bảng chữ 3 ký tự, so với vét cạn: <b>PASS</b>.', 'xanh')}`)}` },

  /* 10 */
  { t: 'Rabin–Karp: va chạm băm và so với KMP', body: `${hai(`
${out(`mod nhỏ (97) trên text="ddbbcbacdcc" pat="bacb":
  i=6 hash equal (mod 97), verify: real match = false
  <-- COLLISION: hash lied, char check rejects it`)}
${o('Với modulus lớn (10⁹+7) va chạm cực hiếm nhưng <b>vẫn có thể xảy ra</b> — luôn giữ bước xác minh bằng <code>regionMatches</code>, đừng tin thẳng kết quả băm.', 'do2')}`, `${bang([
    ['Ý tưởng', 'băm lăn O(1) mỗi bước', 'bảng thất bại (bài 8), không băm'],
    ['Xấu nhất', 'O(n·m) nếu va chạm dồn dập', 'O(n+m) — không phụ thuộc va chạm'],
    ['Trung bình', 'O(n+m)', 'O(n+m)'],
    ['Dễ mở rộng', 'khớp 2D, tìm chuỗi trùng lặp', 'chỉ khớp mẫu 1D'],
    ['Cần xác minh?', 'CÓ (chống va chạm)', 'không — khớp là chắc chắn'],
  ], ['Tiêu chí', 'Rabin–Karp', 'KMP (bài 8.10–8.15)'], 'font-size:18px')}
${nho('KMP không bao giờ sai vì nó so ký tự thật (qua bảng thất bại); Rabin–Karp có thể "nghe nhầm" nếu quên xác minh.')}`)}` },

  /* 11 */
  { t: 'Z-function: tiền tố chung với chính mình', body: `${hai(`
<p style="font-size:20px"><code>z[i]</code> = độ dài tiền tố chung dài nhất của <code>s</code> và <code>s[i..]</code>. Dùng cửa sổ [l, r) đã khớp trước đó để không so lại từ đầu.</p>
${code(`if (i < r) z[i] = Math.min(r-i, z[i-l]);
while (i+z[i] < n && s.charAt(z[i]) == s.charAt(i+z[i])) z[i]++;
if (i+z[i] > r) { l = i; r = i+z[i]; }`, 'java', 'sm')}
${nho('So khớp mẫu bằng Z: ghép <code>mẫu + "#" + văn bản</code>, <code>z[i] == |mẫu|</code> là một khớp.')}`, `${out(`s = "aabxaabxcaabxaabxay"
z[] = [0,1,0,0,4,1,0,0,0,8,1,0,0,5,1,0,0,1,0]

search("abxabcabxabcabx","abcabx") = [3, 9]`)}
${o('3000 chuỗi nhị phân ngẫu nhiên, Z O(n) so với vét cạn O(n²): <b>PASS</b>. Ca biên: rỗng→[], "aaaa"→[0,3,2,1], "abcd" (không lặp)→toàn 0.', 'xanh')}`)}` },

  /* 12 */
  { t: 'String.indexOf và độ phức tạp thực tế', body: `${hai(`
${out(`n=200001, m=50001, không khớp:
  String.indexOf() = -1  trong 2281 ms
  brute-force của tôi = -1  trong 8749 ms`)}
${o('Cả hai đều <b>O(n·m)</b> ở ca xấu nhất này (n a\'s + m a\'s không khớp cuối) — <code>indexOf</code> chỉ có hằng số nhỏ hơn (JIT, so khối byte), <b>không phải một lớp độ phức tạp khác</b>.', 'do2')}`, `${bang([
    ['Vét cạn tự viết', 'O(n·m) xấu nhất', 'dễ hiểu, chậm trên input đối kháng'],
    ['<code>String.indexOf</code>', 'O(n·m) xấu nhất (JDK không dùng KMP/Z)', 'hằng số nhỏ hơn nhiều'],
    ['KMP (bài 8)', 'O(n+m) luôn luôn', 'phải tự cài, không có sẵn trong JDK'],
  ], ['Cách', 'Độ phức tạp', 'Ghi chú'], 'font-size:18px')}
${nho('2000 ca ngẫu nhiên, indexOf khớp brute-force của tôi: <b>PASS</b>. Bài phỏng vấn "cài strStr()" muốn thấy KMP/Rabin–Karp, không phải "vì Java có indexOf() sẵn".')}`)}` },

  /* 13 */
  { t: 'StringBuilder và nối chuỗi "+" trong vòng lặp', body: `${hai(`
${code(`// SAI trong vòng lặp: String bất biến
String s = "";
for (...) s += "x";      // mỗi lần: 1 String MỚI

// ĐÚNG: một buffer, tự phình gấp đôi
StringBuilder sb = new StringBuilder();
for (...) sb.append("x");`, 'java', 'sm')}
${o('n=4: <code>+=</code> tạo <b>5</b> đối tượng String (n+1 — kể cả "" ban đầu); StringBuilder chỉ 1 buffer.', 'do2')}`, `${bang([
    ['5.000', '7.543', '301', xanhB('25×')],
    ['20.000', '78.878', '447', xanhB('177×')],
    ['50.000', '325.269', '1.191', xanhB('273×')],
    ['100.000', '360.211', '845', xanhB('426×')],
  ], ['n', '"+" (µs)', 'StringBuilder (µs)', 'chậm hơn'], 'font-size:18px')}
${nho('n tăng 20 lần (5.000→100.000): "+" chậm gấp ~48 lần (quadratic, O(n²)), StringBuilder gần như không đổi (amortized O(n)).')}`)}` },

  /* 14 */
  { t: 'Palindrome: mở rộng từ tâm', body: `${hai(`
<p style="font-size:20px">2n−1 tâm: n tâm đơn (độ dài lẻ) + n−1 tâm giữa hai ký tự (độ dài chẵn). Mở rộng ra hai phía khi hai ký tự bằng nhau.</p>
${code(`static int expand(String s, int l, int r) {
    while (l>=0 && r<s.length() && s.charAt(l)==s.charAt(r))
        { l--; r++; }
    return r - l - 1;      // độ dài palindrome
}`, 'java', 'sm')}
${nho('Nối deck ⭐ CS.4 (dãy con): đây KHÔNG phải quy hoạch động, chỉ cần O(1) bộ nhớ mỗi tâm.')}`, `${out(`s = "babad"
  center 1: odd len=3   (bab)
  center 2: odd len=3   (aba)
longest = "bab" (length 3)

"cbbd" -> "bb"  (ca độ dài chẵn)`)}
${o('3000 chuỗi ngẫu nhiên, O(n²) mở rộng từ tâm so với O(n³) vét cạn (cùng ĐỘ DÀI kết quả): <b>PASS</b>. Ca biên: rỗng→"", 1 ký tự→chính nó, "aaaa"→"aaaa".', 'xanh')}`)}` },

  /* 15 */
  { t: 'Đảo thứ tự từ trong câu', body: `${hai(`
${code(`String[] w = s.trim().split("\\\\s+");
StringBuilder sb = new StringBuilder();
for (int i = w.length-1; i >= 0; i--) {
    sb.append(w[i]);
    if (i > 0) sb.append(' ');
}`, 'java', 'sm')}
<p style="font-size:19px">Cách 2 (tại chỗ, mảng ký tự): đảo <b>cả chuỗi</b>, rồi đảo <b>lại</b> từng từ về đúng chiều — hai lần đảo, không cần mảng phụ.</p>`, `${out(`input = "  the sky   is blue  "
reverseWords    -> "blue is sky the"
in-place style  -> "blue is sky the"`)}
${o('2000 kiểu khoảng trắng ngẫu nhiên (đầu/cuối/giữa nhiều dấu cách liên tiếp), hai cách luôn khớp nhau: <b>PASS</b>.', 'xanh')}
${bang([['rỗng', '""'], ['toàn khoảng trắng "   "', '""'], ['một từ "hi"', '"hi"']], ['Ca biên', 'Kết quả'], 'font-size:18px;margin-top:4px')}`)}` },

  /* 16 */
  { t: 'Biểu diễn nhị phân và bù hai', body: `${hai(`
${oBit('00000101', {}, 34, 34)}
<p style="font-size:16px;color:#8c8c8c;margin:2px 0 10px">5 (32 bit, chỉ hiện 8 bit cuối)</p>
${oBit('11111011', { 0: 'do' }, 34, 34)}
<p style="font-size:16px;color:#8c8c8c;margin:2px 0">−5 = ~5 + 1 (đảo hết bit của 5 rồi cộng 1)</p>
${code(`~5 + 1 == -5   // true — định nghĩa bù hai`, 'java', 'sm')}`, `${out(`-8 (bits ...11111000)
neg >> 1  (số học, giữ dấu)  = -4
neg >>> 1 (logic, điền 0)    = 2147483644

Integer.MIN_VALUE = -2147483648
-Integer.MIN_VALUE = -2147483648  (TRÀN SỐ!)
Math.abs(MIN_VALUE) = -2147483648`)}
${o('<code>&gt;&gt;</code> giữ bit dấu (số âm vẫn âm); <code>&gt;&gt;&gt;</code> điền 0 phía trên (số âm thành số dương khổng lồ). <code>MIN_VALUE</code> không có số đối vì phạm vi int lệch (−2³¹ tới 2³¹−1).', 'do2')}`)}` },

  /* 17 */
  { t: 'AND · OR · XOR · NOT · dịch bit', body: `${hai(`
${bang([['0', '0', '0', '0', '0'], ['0', '1', '0', '1', '1'], ['1', '0', '0', '1', '1'], ['1', '1', '1', '1', '0']], ['x', 'y', 'x&amp;y', 'x|y', 'x^y'], 'font-size:19px')}
${nho('AND: cả hai 1 mới 1 · OR: một trong hai 1 là 1 · XOR: khác nhau mới 1 (giống nhau ⇒ 0)')}`, `${out(`a=1100(12) b=1010(10)
a&b=1000(8)  a|b=1110(14)  a^b=110(6)
~a = -13   (NOT: ~x = -x-1)
a<<2 = 48  (nhân 4)   a>>2 = 3  (chia 4)

a & 1: 7&1=1 (lẻ), 8&1=0 (chẵn)
1 << 32 = 1  (== 1<<0 — chỉ 5 bit thấp của
              lượng dịch có tác dụng trên int)`)}
${o('Dịch trái k bit = nhân 2ᵏ (nhanh hơn <code>*</code>); dịch phải k = chia 2ᵏ, làm tròn về −∞ — khác <code>/</code> với số âm.', 'xanh')}`)}` },

  /* 18 */
  { t: 'Kiểm tra · bật · tắt · đảo bit thứ k', body: `${hai(`
${code(`isSet(n,k) = ((n >> k) & 1) == 1
set(n,k)    = n | (1 << k)
clear(n,k)  = n & ~(1 << k)
toggle(n,k) = n ^ (1 << k)`, 'java', 'sm')}
${o('Bốn phép này là khối xây dựng của mọi bài bitmask phía sau — nhớ nằm lòng cả bốn dòng trên.', 'xanh')}`, `${out(`n = 1010 (10)
  bit0 set? false   bit1 set? true
  bit2 set? false   bit3 set? true
set(n,0)    = 1011 (11)
clear(n,1)  = 1000 (8)
toggle(n,0) = 1011 (11)
toggle(n,1) = 1000 (8)`)}
${o('5000 cặp (n,k) ngẫu nhiên so với cách đọc từ chuỗi bit tham chiếu: <b>PASS</b>.', 'xanh')}`)}` },

  /* 19 */
  { t: 'n AND (n−1): xoá bit 1 thấp nhất', body: `${hai(`
${oBit('01100', { 2: 'xanh', 3: 'xanh' }, 40, 40)}
<p style="font-size:16px;color:#8c8c8c;margin:4px 0 10px">n = 12 = 01100</p>
${oBit('01000', { 3: 'xanh' }, 40, 40)}
<p style="font-size:16px;color:#8c8c8c;margin:4px 0">n & (n−1) = 8 = 01000 — bit thấp nhất (bit 2) biến mất</p>
${code(`isPowerOfTwo(n) = n>0 && (n & (n-1)) == 0`, 'java', 'sm')}`, `${bang([
    ['12 (1100)', '8 (1000)', '4'], ['7 (111)', '6 (110)', '1'], ['8 (1000)', '0', '8'], ['1023', '1022', '1'],
  ], ['n', 'n&amp;(n−1)', 'bit thấp nhất n&amp;(−n)'], 'font-size:18px')}
${o('n có ĐÚNG MỘT bit 1 ⇔ n&(n−1) xoá bit đó và còn lại 0 ⇔ n là luỹ thừa của 2. 5000 số ngẫu nhiên so với <code>bitCount==1</code>: <b>PASS</b>.', 'xanh')}
${nho('Lặp "xoá bit thấp nhất" tới khi về 0: số lần lặp CHÍNH LÀ số bit 1 — n=101101 (4 bit 1) mất đúng 4 bước.')}`)}` },

  /* 20 */
  { t: 'Đếm bit 1: Integer.bitCount và Kernighan', body: `${hai(`
${code(`// ngây thơ: luôn 32 vòng
for (i=0;i<32;i++) if (((n>>i)&1)==1) c++;

// Kernighan: chỉ lặp đúng số bit 1
while (n != 0) { n &= (n-1); c++; }`, 'java', 'sm')}`, `${bang([
    ['0', '0', '0', '0'], ['255', '8', '8', '8'], ['-1', '32', '32', '32'], ['2147483647', '31', '31', '31'],
  ], ['n', 'ngây thơ', 'Kernighan', 'bitCount'], 'font-size:18px')}
${o('20000 số nguyên ngẫu nhiên, ba cách luôn ra cùng kết quả: <b>PASS</b>. n chỉ có 2 bit 1: ngây thơ vẫn 32 vòng, Kernighan chỉ <b>2</b> vòng.', 'xanh')}
${nho('<code>Integer.bitCount</code> có sẵn trong JDK và nhanh hơn cả hai (dùng lệnh CPU riêng) — dùng nó khi không cần tự cài để học.')}`)}` },

  /* 21 */
  { t: 'Mẹo XOR: số lẻ, hoán đổi, số thiếu', body: `${hai(`
${code(`// mọi số xuất hiện 2 lần trừ MỘT số
int x = 0; for (int v : a) x ^= v;

// hoán đổi không cần biến tạm
a[i]^=a[j]; a[j]^=a[i]; a[i]^=a[j];   // i!=j!

// mảng 0..n thiếu một số
int x = n; for (i=0..n-1) x ^= i ^ a[i];`, 'java', 'sm')}`, `${out(`singleNumber([4,1,2,1,2]) = 4
swap: [5,9] -> XOR-swap(0,1) -> [9,5]
swap(0,0) guarded -> [7] (không bị xoá)
missingNumber([3,0,1], range 0..3) = 2`)}
${o('Nguyên lý chung: <code>x^x=0</code> và <code>x^0=x</code> — cặp giống nhau triệt tiêu, chỉ số lẻ/số thiếu còn lại.', 'xanh')}
${o('<b>Bẫy:</b> XOR-swap khi i==j sẽ tự XOR một ô với chính nó ⇒ về 0, xoá mất giá trị — LUÔN kiểm i≠j trước.', 'do2')}
${nho('3000 ca mỗi loại (số lẻ, số thiếu) ngẫu nhiên: cả hai <b>PASS</b>.')}`)}` },

  /* 22 */
  { t: 'Bitmask liệt kê tất cả tập con', body: `${hai(`
${code(`for (mask = 0; mask < (1<<n); mask++) {
    subset = [];
    for (i=0;i<n;i++)
        if (((mask>>i)&1)==1) subset.add(a[i]);
}`, 'java', 'sm')}
${o('Mỗi <code>mask</code> từ 0 tới 2ⁿ−1 là một tập con: bit i bật ⇔ lấy a[i]. Cùng 2ⁿ lá với quay lui (deck ⭐ CS.6) — chỉ khác hình code, mask KHÔNG cần đệ quy.', 'xanh')}`, `${out(`a=[1,2,3], 8 subset:
000->[] 001->[1] 010->[2] 011->[1,2]
100->[3] 101->[1,3] 110->[2,3] 111->[1,2,3]

subset of [3,34,4,12,5,2] tổng=9: [4,5]`)}
${o('Liệt kê bằng bitmask và bằng quay lui cho <b>đúng cùng một tập</b> các tập con (so như tập hợp): <b>PASS</b>.', 'xanh')}
${nho('O(2ⁿ·n): n=20 → hơn 1 triệu mask (còn ổn); n=30 → hơn 1 tỉ (quá chậm) — bitmask chỉ dùng khi n nhỏ (≤ ~20).')}`)}` },

  /* 23 */
  { t: 'Cờ trạng thái bằng bit: quyền đọc/ghi/thực thi', body: `${hai(`
${code(`static final int READ=1, WRITE=2, EXECUTE=4;   // 001,010,100

int perm = READ | WRITE;      // cấp đọc+ghi
perm |= EXECUTE;              // cấp thêm
perm &= ~WRITE;               // thu hồi ghi
boolean canExec = (perm & EXECUTE) != 0;`, 'java', 'sm')}
${o('Một <code>int</code> thay được cho nhiều <code>boolean</code> riêng lẻ; cấp/thu hồi/kiểm quyền đều là một phép bit O(1), không rẽ nhánh.', 'xanh')}`, `${out(`READ|WRITE = 3 (11) -> rw-
sau |= EXECUTE: 7 -> rwx
sau &= ~WRITE:  5 -> r-x

000-> ---  001-> r--  010-> -w-  011-> rw-
100-> --x  101-> r-x  110-> -wx  111-> rwx`)}
${nho('Đây chính là cách Unix lưu quyền file (chmod 754 = rwxr-xr--, mỗi nhóm 3 bit) và cách nhiều thư viện Java gộp cờ cấu hình (ví dụ <code>Pattern.CASE_INSENSITIVE | Pattern.MULTILINE</code>).')}`)}` },

  /* 24 */
  { t: 'Nhận dạng bài và tổng kết độ phức tạp', body: `${bang([
    ['"hai số cộng lại bằng…"', 'HashMap tra ngược', 'two-sum, subarray sum = k'],
    ['"nhóm các từ giống nhau theo…"', 'khoá chuẩn hoá', 'nhóm anagram'],
    ['"dãy con dài nhất không lặp / liên tiếp"', 'HashSet/HashMap + cửa sổ', 'dãy liên tiếp, chuỗi con không lặp'],
    ['"tìm mẫu trong văn bản dài"', 'Rabin–Karp / Z-function / KMP (bài 8)', 'so khớp chuỗi'],
    ['"đối xứng / palindrome"', 'mở rộng từ tâm (hoặc DP nếu cần đếm)', 'longest palindromic substring'],
    ['"xuất hiện lẻ / thiếu một số / hoán đổi"', 'mẹo XOR', 'single number, missing number'],
    ['"tất cả tổ hợp / trạng thái, n ≤ ~20"', 'bitmask', 'liệt kê tập con, DP bitmask (deck khác)'],
    ['"nhiều cờ bật/tắt độc lập"', 'OR/AND/XOR trên một int', 'quyền hạn, cấu hình'],
  ], ['Thấy đề như thế này', 'Nghĩ tới kỹ thuật này', 'Ví dụ'], 'font-size:17px')}
${o('Ghép chuỗi trong vòng lặp luôn dùng <code>StringBuilder</code>, không dùng <code>+</code> — đo thật: chậm hơn tới <b>426 lần</b> ở n=100.000.', 'do2')}` },
]);
