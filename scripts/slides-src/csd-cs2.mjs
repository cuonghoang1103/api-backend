/**
 * csd-cs2.mjs — CSD201 ⭐ Chuyên sâu 2: KỸ THUẬT MẢNG (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs2.mjs --out <dir>
 *
 * Mọi bảng bước (lo/hi/mid, cửa sổ, ngăn xếp) và mọi con số lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs2/*.java (javac --release 8, JDK 21) — vết chạy đối chiếu bằng
 * một chương trình trace riêng, giá trị khớp 100% với output thật của các file trong gen/java/cs2.
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs2', code: 'CS2', title: 'Kỹ thuật mảng', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff' };

/* ───────────── mảng ô có chỉ số + con trỏ phía trên ───────────── */
function mang(vals, { w = 58, h = 46, fill = {}, ptr = [], mo = null, chiSo = true, nhan = '' } = {}) {
  const x0 = nhan ? 74 : 6, y0 = 30;
  let s = '';
  if (nhan) s += `<text x="0" y="${y0 + h / 2 + 7}" font-size="18" font-weight="700" fill="${MAU.nau}">${nhan}</text>`;
  vals.forEach((v, i) => {
    const f = fill[i];
    const mờ = mo && (i < mo[0] || i > mo[1]);
    s += `<g opacity="${mờ ? 0.32 : 1}"><rect x="${x0 + i * w}" y="${y0}" width="${w}" height="${h}" fill="${f ? NEN[f] : NEN.trang}" stroke="${f === 'do' ? MAU.do : MAU.vien}" stroke-width="${f === 'do' ? 3 : 1.5}"/>`;
    const col = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626';
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h / 2 + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${col}">${v}</text></g>`;
    if (chiSo) s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h + 19}" text-anchor="middle" font-size="15" fill="#8c8c8c">${i}</text>`;
  });
  const dem = {};
  for (const [i, t, mau = MAU.nau] of ptr) {
    const k = dem[i] = (dem[i] || 0) + 1;
    const cx = x0 + i * w + w / 2;
    s += `<text x="${cx}" y="${y0 - 8 - (k - 1) * 20}" text-anchor="middle" font-size="16" font-weight="800" fill="${mau}">${t}</text>`;
  }
  const maxK = Math.max(0, ...Object.values(dem).map((k) => (k - 1) * 20));
  const W = x0 + vals.length * w + 6, H = y0 + h + (chiSo ? 26 : 8);
  return `<svg viewBox="0 ${-maxK} ${W} ${H + maxK}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;

/* ───────────── sơ đồ riêng ───────────── */
// slide 2: roadmap 6 nhóm kỹ thuật
function roadmap() {
  const rows = [
    ['Hai con trỏ hội tụ', '→ ←', MAU.cam],
    ['Hai con trỏ nhanh/chậm', '→→ →', MAU.xanh],
    ['Cửa sổ trượt', '[   ]→', MAU.do],
    ['Tổng tiền tố / mảng hiệu', 'Σ', MAU.nau],
    ['Ngăn xếp / hàng đợi đơn điệu', '▤', '#7a4fb0'],
    ['Kadane', 'max', '#1f7a8c'],
  ];
  let s = '';
  rows.forEach(([label, sym, color], i) => {
    const y = 10 + i * 46;
    s += `<rect x="0" y="${y}" width="40" height="36" rx="6" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="2"/>`;
    s += `<text x="20" y="${y + 24}" text-anchor="middle" font-size="16" font-weight="800" fill="${color}">${sym}</text>`;
    s += `<text x="54" y="${y + 24}" font-size="21" font-weight="700" fill="#262626">${label}</text>`;
  });
  return `<svg viewBox="0 0 640 ${rows.length * 46 + 10}" width="560" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 9: linked list với chu trình (Floyd)
function danhSachChuTrinh() {
  const n = 6, W = 74, y = 34;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 20 + i * W;
    s += `<circle cx="${x}" cy="${y}" r="18" fill="${i === 2 ? NEN.do : NEN.cam}" stroke="${i === 2 ? MAU.do : MAU.cam}" stroke-width="2"/>`;
    s += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="800" fill="#262626">${i}</text>`;
    if (i < n - 1) s += `<line x1="${x + 19}" y1="${y}" x2="${x + W - 19}" y2="${y}" stroke="#8c8c8c" stroke-width="2" marker-end="url(#ar)"/>`;
  }
  // tail (n-1) trỏ về node 2
  const xTail = 20 + (n - 1) * W, xTarget = 20 + 2 * W;
  s += `<path d="M ${xTail} ${y + 18} C ${xTail} ${y + 68}, ${xTarget} ${y + 68}, ${xTarget} ${y + 18}" fill="none" stroke="${MAU.do}" stroke-width="2.5" marker-end="url(#ar)"/>`;
  s += `<text x="${(xTail + xTarget) / 2}" y="${y + 84}" text-anchor="middle" font-size="13" font-weight="700" fill="${MAU.do}">next của nút cuối trỏ về nút 2</text>`;
  return `<svg viewBox="-10 0 ${20 + n * W} ${y + 98}" width="440" font-family="Arial, sans-serif"><defs><marker id="ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#8c8c8c"/></marker></defs>${s}</svg>`;
}

// slide 21/22: cột histogram cho ngăn xếp đơn điệu
function cot(vals, { hl = [], w = 64, k = 26 } = {}) {
  const base = 8 + Math.max(...vals) * k + 20;
  let s = `<line x1="0" y1="${base}" x2="${vals.length * w + 10}" y2="${base}" stroke="#8c8c8c" stroke-width="1.5"/>`;
  vals.forEach((v, i) => {
    const hh = v * k, x = 6 + i * w;
    const col = hl.includes(i) ? MAU.do : MAU.cam;
    s += `<rect x="${x}" y="${base - hh}" width="${w - 12}" height="${hh}" fill="${col}" opacity="${hl.includes(i) ? 1 : 0.55}" stroke="${col}" stroke-width="1.5"/>`;
    s += `<text x="${x + (w - 12) / 2}" y="${base - hh - 7}" text-anchor="middle" font-size="16" font-weight="700" fill="#262626">${v}</text>`;
    s += `<text x="${x + (w - 12) / 2}" y="${base + 20}" text-anchor="middle" font-size="14" fill="#8c8c8c">${i}</text>`;
  });
  return `<svg viewBox="0 0 ${vals.length * w + 16} ${base + 30}" width="${vals.length * w + 16}" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('KỸ THUẬT MẢNG', [
  /* 1 */
  { cover: true, t: 'Kỹ thuật mảng', sub: 'Hai con trỏ · cửa sổ trượt · tổng tiền tố · mảng hiệu · ngăn xếp/hàng đợi đơn điệu · Kadane<br>CSD201 · Java 8 — mọi bảng bước đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Sáu nhóm kỹ thuật mảng hay gặp khi phỏng vấn', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>${roadmap()}</div>
<div><ul style="font-size:21px">
<li>Tất cả đều <b>O(n)</b> hoặc gần O(n) — thay cho vòng lặp lồng O(n²)</li>
<li>Điểm chung: đi <b>một lượt</b> (hoặc hai lượt cố định), giữ một ít trạng thái, không quay lại quét thêm</li>
<li>Nhận ra đúng nhóm = qua được câu hỏi; deck này cho từng nhóm một <b>khuôn</b> và một loạt bài áp dụng</li>
</ul>
${o('<b>Không lặp bài trường:</b> danh sách liên kết (chương 1), ngăn xếp/hàng đợi/deque (chương 2) đã học cấu trúc dữ liệu; deck này dùng lại chúng để giải một lớp bài toán mảng cụ thể.', 'xanh')}</div></div>` },

  /* 3 */
  { t: 'Hai con trỏ hội tụ: two-sum trên mảng đã sắp', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`static int[] twoSum(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int sum = a[lo] + a[hi];
        if (sum == target) return new int[]{lo, hi};
        if (sum < target) lo++;   // tổng nhỏ -> cần lớn hơn -> đẩy lo
        else               hi--;  // tổng lớn -> cần nhỏ hơn -> kéo hi
    }
    return new int[]{-1, -1};
}`, 'java')}
${o('<b>Dấu hiệu nhận dạng:</b> mảng/danh sách <b>đã sắp</b>, tìm một CẶP thoả điều kiện tổng. Hai con trỏ từ hai đầu đi vào giữa, mỗi bước loại được một phần tử chắc chắn không dùng được.')}</div>
<div>${mang([-7, -3, 0, 2, 5, 8, 13, 20], { w: 52, fill: { 1: 'do', 6: 'do' }, ptr: [[0, 'lo→', MAU.cam], [7, '←hi', MAU.cam]] })}
${bang([
    ['0', '7', '-7', '20', '13', '13&gt;10 → hi--'], ['0', '6', '-7', '13', '6', '6&lt;10 → lo++'], ['1', '6', '-3', '13', '<b class="do">10 ✓</b>', 'trả về (1, 6)'],
  ], ['lo', 'hi', 'a[lo]', 'a[hi]', 'tổng (target=10)', 'Bước'], 'font-size:18px;margin-top:4px')}
<p class="nho">O(n) — mỗi bước đẩy lo hoặc kéo hi, tối đa n-1 bước. PASS 20.000 ca ngẫu nhiên có trùng, âm, rỗng, một phần tử.</p></div></div>` },

  /* 4 */
  { t: 'Hai con trỏ hội tụ: đảo mảng tại chỗ &amp; kiểm xuôi ngược đọc như nhau', body: `<div class="hai"><div>${code(`static void reverse(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int t = a[lo]; a[lo] = a[hi]; a[hi] = t;
        lo++; hi--;
    }
}`, 'java')}
${o('<b>Tại chỗ (in-place)</b>: O(1) bộ nhớ phụ, không cần mảng thứ hai. Cùng khuôn dùng để kiểm chuỗi <b>palindrome</b> (bỏ qua ký tự không phải chữ, không phân biệt hoa/thường).')}</div>
<div>${mang([1, 2, 3, 4, 5, 6], { w: 56 })}
${out(`reverse({1,2,3,4,5,6}) = [6, 5, 4, 3, 2, 1]
isPalindrome:
  "racecar" -> true
  "A man, a plan, a canal: Panama" -> true
  "hello" -> false
  "" -> true (rỗng coi như đối xứng)`)}</div></div>` },

  /* 5 */
  { t: 'Hai con trỏ: container chứa nước nhiều nhất (ý bài LeetCode 11)', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>
<p style="font-size:20px">Cột cao h[i], chọn 2 cột làm thành bể chứa <b>diện tích lớn nhất</b> = min(hai cột) × khoảng cách.</p>
${code(`long best = 0;
while (lo < hi) {
    best = Math.max(best, (long) Math.min(h[lo], h[hi]) * (hi - lo));
    if (h[lo] < h[hi]) lo++; else hi--;  // LUÔN dịch cột THẤP hơn
}`, 'java', 'sm')}
${o('<b>Vì sao luôn dịch cột thấp:</b> giữ cột thấp lại thì diện tích tương lai vẫn bị chính nó chặn trên — dịch nó đi là cách DUY NHẤT có cơ hội tăng diện tích. Dịch cột cao thì chắc chắn không thể tốt hơn.', 'xanh')}</div>
<div>${bang([
    ['0', '8', '1', '7', '8', '8', 'lo++'], ['1', '8', '8', '7', '7', '<b class="do">49</b>', 'hi--'], ['1', '7', '8', '3', '6', '49', 'hi--'], ['1', '6', '8', '8', '5', '49', 'hi--'],
  ], ['lo', 'hi', 'h[lo]', 'h[hi]', 'rộng', 'diện tích/best', 'Bước'], 'font-size:16px')}
<p class="nho">h = {1,8,6,2,5,4,8,3,7} → 49 (cột 1 và cột 6, cả hai cao 8). PASS 20.000 ca vs vét cạn O(n²).</p>
${o('O(n), một lượt, O(1) bộ nhớ — vét cạn mọi cặp là O(n²).')}</div></div>` },

  /* 6 */
  { t: 'Hai con trỏ + đệ quy cố định: 3-sum, loại trùng', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${code(`Arrays.sort(a);
for (int i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] == a[i-1]) continue;      // bỏ số ĐẦU trùng
    int lo = i+1, hi = a.length-1;
    while (lo < hi) {
        int sum = a[i] + a[lo] + a[hi];
        if (sum == 0) {
            ghi(a[i], a[lo], a[hi]);
            lo++; hi--;
            while (lo<hi && a[lo]==a[lo-1]) lo++;  // bỏ số GIỮA trùng
            while (lo<hi && a[hi]==a[hi+1]) hi--;  // bỏ số CUỐI trùng
        } else if (sum < 0) lo++; else hi--;
    }
}`, 'java', 'sm')}</div>
<div>${o('<b>Cố định một số</b> (vòng ngoài), rồi hai con trỏ hội tụ trên <b>phần còn lại đã sắp</b> tìm tổng = −a[i]. Sắp mảng trước là bắt buộc: vừa để hai con trỏ chạy được, vừa để việc bỏ trùng thành so sánh với ô liền kề.')}
${out(`a = {-4,-1,-1,0,1,2}
-> [-1, -1, 2]
-> [-1, 0, 1]`)}
<p class="nho">PASS 4.000 ca ngẫu nhiên (khoảng giá trị nhỏ để ép nhiều trùng) so với vét cạn O(n³). Độ phức tạp: O(n²) — O(n log n) sắp + n lần hai con trỏ O(n).</p></div></div>` },

  /* 7 */
  { t: 'Hai con trỏ nhanh/chậm: xoá phần tử trùng tại chỗ', body: `<div class="hai"><div>${code(`static int dedupe(int[] a) {
    if (a.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < a.length; fast++) {
        if (a[fast] != a[slow]) {
            slow++;
            a[slow] = a[fast];
        }
    }
    return slow + 1;
}`, 'java')}
${o('<code>slow</code> đánh dấu <b>ranh giới phần đã duy nhất</b>; <code>fast</code> quét tới tìm giá trị mới. Chỉ ghi khi tìm thấy giá trị khác — không phải mọi bước đều ghi.')}</div>
<div>${mang([1, 1, 2, 2, 2, 3, 4, 4, 5], { w: 50, fill: { 0: 'xanh', 2: 'xanh', 5: 'xanh', 6: 'xanh', 8: 'xanh' } })}
${bang([
    ['1', '1', 'giống → bỏ qua'], ['2', '1', '<b>khác</b> → slow=1, ghi 2'], ['2', '2', 'giống → bỏ qua'], ['2', '2', 'giống → bỏ qua'],
    ['3', '2', '<b>khác</b> → slow=2, ghi 3'], ['4', '3', '<b>khác</b> → slow=3, ghi 4'], ['4', '4', 'giống → bỏ qua'], ['5', '4', '<b>khác</b> → slow=4, ghi 5'],
  ], ['a[fast]', 'a[slow]', 'Quyết định'], 'font-size:16px;margin-top:4px')}
<p class="nho">Kết quả: độ dài 5, a[0..4] = {1,2,3,4,5}. Đòi hỏi mảng <b>đã sắp</b>. O(n) thời gian, O(1) bộ nhớ. PASS 20.000 ca.</p></div></div>` },

  /* 8 */
  { t: 'Hai con trỏ nhanh/chậm: dồn số 0 về cuối, giữ thứ tự', body: `<div class="hai"><div>${code(`static void moveZeroes(int[] a) {
    int slow = 0;
    for (int fast = 0; fast < a.length; fast++) {
        if (a[fast] != 0) {
            int t = a[slow]; a[slow] = a[fast]; a[fast] = t;
            slow++;
        }
    }
}`, 'java')}
${o('<code>slow</code> = chỗ trống kế tiếp cho một số <b>khác 0</b>; đổi chỗ (swap) thay vì chỉ ghi đè — số 0 tự "trôi" dần về phía sau mà thứ tự các số khác 0 không đổi.', 'xanh')}</div>
<div>${out(`moveZeroes({0,1,0,3,12,0,5})
= [1, 3, 12, 5, 0, 0, 0]`)}
${bang([
    ['0', '0', '=0 → bỏ qua'], ['1', '1', '≠0 → đổi chỗ a[0]↔a[1] → slow=1'], ['2', '0', '=0 → bỏ qua'], ['3', '3', '≠0 → đổi chỗ a[1]↔a[3] → slow=2'],
    ['4', '12', '≠0 → đổi chỗ a[2]↔a[4] → slow=3'], ['5', '0', '=0 → bỏ qua'], ['6', '5', '≠0 → đổi chỗ a[3]↔a[6] → slow=4'],
  ], ['fast', 'a[fast]', 'Quyết định'], 'font-size:16px')}
<p class="nho">O(n), một lượt, O(1) bộ nhớ, tại chỗ. So sánh với "xoá trùng" (slide 7): ở đây ghi bằng <b>đổi chỗ</b> vì phần tử bị đẩy đi (số 0) vẫn cần xuất hiện ở cuối, không bị bỏ hẳn. PASS 20.000 ca.</p></div></div>` },

  /* 9 */
  { t: 'Hai con trỏ nhanh/chậm: phát hiện chu trình Floyd (nối chương 1 — danh sách liên kết)', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr">
<div>${code(`static boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;  // chạm nhau
    }
    return false;
}`, 'java', 'sm')}
${o('<b>Rùa và thỏ:</b> chậm đi 1 bước, nhanh đi 2. Có chu trình thì khoảng cách hai con trỏ giảm dần 1 mỗi vòng bên trong chu trình ⇒ chắc chắn <b>chạm nhau</b>. Không có ⇒ fast chạm null trước.', '')}</div>
<div>${danhSachChuTrinh()}
${out(`5 nút thẳng -> false
6 nút, đuôi -> nút 2 -> true, bắt đầu: 2
1 nút tự trỏ vào chính nó -> true`, 'font-size:14px')}
${o('<b>Tìm điểm bắt đầu chu trình</b> (pha 2): sau khi chạm nhau, đưa một con trỏ về head; cả hai đi 1 bước — chúng chạm nhau đúng tại điểm bắt đầu chu trình. O(n) thời gian, O(1) bộ nhớ.', 'do2')}</div></div>` },

  /* 10 */
  { t: 'Cửa sổ trượt kích thước cố định: tổng lớn nhất của k phần tử liên tiếp', body: `<div class="hai"><div>${code(`long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];   // cửa sổ đầu tiên
long best = sum;
for (int i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];   // vào a[i], ra a[i-k]
    best = Math.max(best, sum);
}`, 'java')}
${o('<b>O(1) mỗi bước</b>: không cộng lại từ đầu — chỉ cộng phần tử VÀO và trừ phần tử RA. So với tính lại tổng mỗi cửa sổ (O(k) mỗi bước, O(n·k) tổng), đây là O(n).', 'xanh')}</div>
<div>${mang([2, 1, 5, 1, 3, 2], { w: 54, fill: { 2: 'xanh', 3: 'xanh', 4: 'xanh' }, ptr: [[2, '[', MAU.cam], [4, ']', MAU.cam]] })}
${bang([
    ['[0..2]', '2+1+5', '8'], ['[1..3]', '8 + 1 − 2 = 7', '8'], ['[2..4]', '7 + 3 − 1 = 9', '<b class="do">9</b>'], ['[3..5]', '9 + 2 − 5 = 6', '9'],
  ], ['Cửa sổ', 'Cập nhật', 'best'], 'font-size:17px;margin-top:6px')}
<p class="nho">a = {2,1,5,1,3,2}, k=3 → max = 9 (cửa sổ [2..4] = {5,1,3}). PASS 20.000 ca vs vét cạn.</p></div></div>` },

  /* 11 */
  { t: 'Cửa sổ trượt co giãn: khuôn "mở phải, co trái khi vi phạm"', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`int left = 0;
for (int right = 0; right < n; right++) {
    // 1. đưa a[right] VÀO cửa sổ
    them(a[right]);
    // 2. TRONG LÚC cửa sổ còn "vi phạm điều kiện":
    while (viPham()) {
        bot(a[left]);   // bỏ a[left] ra
        left++;
    }
    // 3. cửa sổ [left, right] giờ hợp lệ -> cập nhật đáp án
    capNhat(right - left + 1);
}`, 'java')}</div>
<div><ul style="font-size:21px">
<li><b>right</b> chỉ đi tới, không lùi — mỗi phần tử vào cửa sổ đúng <b>một lần</b></li>
<li><b>left</b> cũng chỉ đi tới — mỗi phần tử ra khỏi cửa sổ đúng <b>một lần</b></li>
<li>⇒ tổng cộng right và left đi tối đa 2n bước ⇒ <b>O(n)</b>, dù nhìn có hai vòng lồng nhau</li>
</ul>
${o('<b>"Vi phạm điều kiện" là gì</b> tuỳ bài: cửa sổ có ký tự lặp (slide 12), tổng chưa đủ ngưỡng (slide 13), thiếu ký tự cần (slide 14). Khuôn không đổi — chỉ đổi <code>them/bot/viPham</code>.', 'xanh')}</div></div>` },

  /* 12 */
  { t: 'Cửa sổ co giãn: xâu con dài nhất không lặp ký tự (LeetCode 3)', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>${code(`int[] last = new int[128];  // vị trí XUẤT HIỆN GẦN NHẤT
Arrays.fill(last, -1);
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (last[c] >= left) left = last[c] + 1;  // nhảy qua lần trước
    last[c] = right;
    best = Math.max(best, right - left + 1);
}`, 'java', 'sm')}
${o('Không cần vòng <code>while</code> co từng bước: biết ngay vị trí lần xuất hiện trước, <b>nhảy thẳng</b> left tới sau nó.', 'xanh')}</div>
<div>${bang([
    ['0', 'a', '0', '[0..0]', '1'], ['1', 'b', '0', '[0..1]', '2'], ['2', 'c', '0', '[0..2]', '3'],
    ['3', 'a', '<b class="do">1</b>', '[1..3]', '3'], ['4', 'b', '<b class="do">2</b>', '[2..4]', '3'], ['5', 'c', '<b class="do">3</b>', '[3..5]', '3'],
    ['6', 'b', '<b class="do">5</b>', '[5..6]', '2'], ['7', 'b', '<b class="do">7</b>', '[7..7]', '1'],
  ], ['right', 'ký tự', 'left mới', 'cửa sổ', 'độ dài'], 'font-size:16px')}
<p class="nho">s = "abcabcbb" → dài nhất 3 (best giữ nguyên 3 từ right=2). PASS 20.000 chuỗi ngẫu nhiên trên bảng chữ {a,b,c} vs vét cạn O(n²).</p></div></div>` },

  /* 13 */
  { t: 'Cửa sổ co giãn: mảng con NGẮN NHẤT có tổng ≥ S (ý bài LeetCode 209)', body: `<div class="hai"><div>${code(`int left = 0; long sum = 0;
int best = Integer.MAX_VALUE;
for (int right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum >= target) {           // còn ĐỦ ngưỡng thì cứ co
        best = Math.min(best, right - left + 1);
        sum -= a[left];
        left++;
    }
}
return best == Integer.MAX_VALUE ? 0 : best;`, 'java', 'sm')}
${o('Đây là <b>while</b> thật (không nhảy thẳng được) vì "còn đủ ngưỡng" phụ thuộc tổng, không tra bảng ra ngay. Bắt buộc <b>mọi phần tử ≥ 0</b> — có số âm thì co cửa sổ không còn đơn điệu.', 'do2')}</div>
<div>${mang([2, 3, 1, 2, 4, 3], { w: 54, fill: { 4: 'xanh', 5: 'xanh' } })}
${bang([
    ['2', '2', 'chưa đủ'], ['3', '5', 'chưa đủ'], ['1', '6', 'chưa đủ'], ['2', '8', '<b class="do">đủ</b> → best=4, co→1'],
    ['4', '10', '<b class="do">đủ</b> (co 2 lần: left→2→3), best=3'], ['3', '9', '<b class="do">đủ</b> (co 2 lần: left→4→5), best=2'],
  ], ['a[right] mới', 'sum', 'So target=7'], 'font-size:14px;margin-top:2px')}
<p class="nho" style="margin-top:2px">độ dài ngắn nhất = 2 (cửa sổ {4,3}). PASS 20.000 mảng dương vs vét cạn.</p></div></div>` },

  /* 14 */
  { t: 'Cửa sổ co giãn: cửa sổ nhỏ nhất chứa đủ ký tự (ý bài LeetCode 76)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Tìm cửa sổ ngắn nhất trong s chứa <b>đủ mọi ký tự</b> của t (kể cả trùng số lượng).</p>
${code(`int[] need = đếm(t); int required = số ký tự khác nhau của t;
int[] window = new int[128]; int satisfied = 0, left = 0;
for (int right = 0; ...; right++) {
    window[s[right]]++;
    if (need[c]>0 && window[c]==need[c]) satisfied++;
    while (satisfied == required) {           // ĐANG đủ -> thử co
        capNhatDapAn(left, right);
        window[s[left]]--;
        if (window[s[left]] == need[s[left]] - 1) satisfied--;
        left++;
    }
}`, 'java', 'sm')}</div>
<div>${o('<b>"satisfied"</b> đếm bao nhiêu ký tự CẦN đã có <b>đủ số lượng</b> (không phải đếm ký tự). Chỉ tăng/giảm khi một ký tự vừa chạm ngưỡng đủ — không phải mỗi lần window[c] đổi.')}
${out(`minWindow("ADOBECODEBANC", "ABC")
= "BANC"`)}
${o('Cùng khuôn slide 11–13, chỉ khác điều kiện "vi phạm" (thiếu chữ vs thiếu tổng). O(|s| + |t|) — mỗi ký tự vào/ra cửa sổ đúng một lần.', 'xanh')}</div></div>` },

  /* 15 */
  { t: 'Tổng tiền tố 1D: trả lời truy vấn tổng đoạn trong O(1)', body: `<div class="hai"><div>${code(`long[] prefix = new long[a.length + 1];
for (int i = 0; i < a.length; i++)
    prefix[i+1] = prefix[i] + a[i];

// tổng đoạn ĐÓNG [l, r]:
long rangeSum(int l, int r) {
    return prefix[r+1] - prefix[l];
}`, 'java')}
${o('<code>prefix[i]</code> = tổng a[0..i−1]; đoạn [l, r] = prefix[r+1] − prefix[l]. Mảng dựng một lần O(n), <b>mỗi truy vấn sau đó O(1)</b> — dù hỏi bao nhiêu lần.', 'xanh')}</div>
<div>${mang([2, -1, 5, 3, -4, 6, 1], { w: 52, nhan: 'a' })}
${mang([0, 2, 1, 6, 9, 5, 11, 12], { w: 52, nhan: 'prefix', chiSo: false })}
${bang([
    ['[1, 4]', 'prefix[5] − prefix[1] = 5 − 2', '3'], ['[0, 6]', 'prefix[7] − prefix[0] = 12 − 0', '12'], ['[3, 3]', 'prefix[4] − prefix[3] = 9 − 6', '3'],
  ], ['Đoạn', 'Phép tính', 'Kết quả'], 'font-size:17px;margin-top:6px')}
<p class="nho">prefix có n+1 phần tử (prefix[0] = 0) — bẫy hay quên: thiếu ô 0 thì đoạn bắt đầu từ 0 tính sai. PASS 20.000 truy vấn ngẫu nhiên.</p></div></div>` },

  /* 16 */
  { t: 'Tổng tiền tố + HashMap: đếm mảng con có tổng = k (ý bài LeetCode 560)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`Map<Long,Integer> seen = new HashMap<>();
seen.put(0L, 1);      // tiền tố rỗng
long prefix = 0; int count = 0;
for (int x : a) {
    prefix += x;
    count += seen.getOrDefault(prefix - k, 0);
    seen.merge(prefix, 1, Integer::sum);
}`, 'java')}
${o('Đoạn (l+1..r) có tổng k khi <code>prefix[r] − prefix[l] = k</code>. Với mỗi r, đếm bao nhiêu prefix[l] TRƯỚC ĐÓ bằng <code>prefix[r] − k</code> — tra HashMap O(1) thay vì quét lại.', 'xanh')}
${o('<b>seen.put(0, 1)</b> bắt buộc: nếu bỏ, mọi đoạn <em>bắt đầu từ chỉ số 0</em> mà tự nó đã bằng k sẽ bị đếm thiếu.', 'do2')}</div>
<div>${bang([
    ['0', '1', '1', '−2', '0', '0'], ['1', '2', '3', '0', '<b class="do">1</b>', '1'], ['2', '3', '6', '3', '<b class="do">1</b>', '2'], ['3', '−3', '3', '0', '<b class="do">1</b>', '3'], ['4', '1', '4', '1', '<b class="do">1</b>', '4'],
  ], ['i', 'a[i]', 'prefix', 'cần (prefix−k)', 'tìm thấy', 'count'], 'font-size:15px;margin-top:4px')}
<p class="nho">a = {1,2,3,−3,1}, k=3 → 4 đoạn: [1,2],[3],[1,2,3,−3],[3,−3,1]. Có số âm vẫn đúng — không cần mảng đã sắp. O(n) thời gian, O(n) bộ nhớ. PASS 20.000 ca vs vét cạn O(n²).</p></div></div>` },

  /* 17 */
  { t: 'Tổng tiền tố 2D: tổng một hình chữ nhật trong O(1)', body: `<div class="hai"><div>${code(`// bao hàm - loại trừ (inclusion-exclusion)
P[r+1][c+1] = P[r][c+1] + P[r+1][c] - P[r][c] + g[r][c];

// hình chữ nhật đóng hàng [r1,r2], cột [c1,c2]:
long rectSum(r1, c1, r2, c2) {
    return P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1];
}`, 'java')}
${o('Trừ hai dải chồng lấn (trên và trái) thì phần góc trên-trái bị trừ HAI LẦN — phải <b>cộng lại</b> đúng một lần. Đây chính là bao hàm–loại trừ (inclusion–exclusion) trên lưới.', 'xanh')}</div>
<div><p style="font-size:20px">g = {{1,2,3,4},{5,6,7,8},{9,10,11,12}}</p>
${out(`rectSum(hàng[1..2], cột[1..3]) = 54
rectSum(cả lưới) = 78`)}
<ul style="font-size:20px;margin-top:8px">
<li>Dựng P một lần: O(R·C). Mỗi truy vấn sau: <b>O(1)</b></li>
<li>Ứng dụng: ảnh (vùng sáng trung bình), bảng nhiệt, ma trận tần suất</li>
</ul>
<p class="nho">PASS 8.000 truy vấn hình chữ nhật ngẫu nhiên trên lưới ngẫu nhiên vs cộng trực tiếp.</p></div></div>` },

  /* 18 */
  { t: 'Mảng hiệu (difference array): cập nhật khoảng O(1)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`int[] diff = new int[n + 1];
// cộng v cho MỌI phần tử trong [l, r]:
diff[l]   += v;
diff[r+1] -= v;
// ... làm vậy cho mọi lệnh cập nhật ...

// dựng lại mảng thật: MỘT lượt tổng tiền tố
int running = 0;
for (int i = 0; i < n; i++) { running += diff[i]; a[i] = running; }`, 'java')}
${o('Ý tưởng ngược với tổng tiền tố: đạo hàm rời rạc. "+v tại l, −v ngay sau r" khi cộng dồn (tổng tiền tố) sẽ tự động cộng đúng v cho mọi ô từ l đến r và KHÔNG cộng gì sau r.', 'xanh')}</div>
<div><p style="font-size:19px">n=7, ba lệnh: [1,3] +2 · [2,5] +3 · [0,0] +5</p>
${out(`diff sau 3 lệnh: [5,2,0,-2,0,0,-3,0]
mảng thật:      [5, 2, 5, 5, 3, 3, 0]`)}
${bang([
    ['m lệnh cập nhật khoảng, mỗi lệnh O(1)', 'O(m)'], ['dựng lại mảng cuối cùng', 'O(n)'], ['tổng', '<b>O(m + n)</b>'], ['cách ngây thơ: cộng từng ô trong mỗi khoảng', 'O(m · độ dài khoảng)'],
  ], ['Việc', 'Chi phí'], 'font-size:18px;margin-top:6px')}
<p class="nho">Ứng dụng: đặt vé máy bay theo khoảng ngày (bài tập 5), tưới cây theo đoạn, xếp lịch. PASS 8.000 ca vs vòng lặp ngây thơ.</p></div></div>` },

  /* 19 */
  { t: 'Ngăn xếp đơn điệu: phần tử lớn hơn kế tiếp (ý bài LeetCode 496)', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>${code(`Deque<Integer> stack = new ArrayDeque<>();  // chỉ số, giá trị GIẢM dần
for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && a[stack.peek()] < a[i]) {
        res[stack.pop()] = a[i];   // a[i] là đáp án của chỉ số vừa pop
    }
    stack.push(i);
}
// còn lại trong stack cuối vòng: không có ai lớn hơn ở bên phải -> -1`, 'java', 'sm')}</div>
<div>${bang([
    ['0', '2', '—', '[0]'], ['1', '1', '—', '[1,0]'],
    ['2', '2', '<b class="do">pop 1</b>→2', '[2,0]'], ['3', '4', '<b class="do">pop 2,0</b>→4', '[3]'],
    ['4', '3', '—', '[4,3]'], ['5', '1', '—', '[5,4,3]'],
  ], ['i', 'a[i]', 'Pop khi đẩy i vào', 'stack sau bước'], 'font-size:15px')}
<p class="nho" style="margin-top:4px">a = {2,1,2,4,3,1} → kết quả {4,2,4,−1,−1,−1}. Mỗi chỉ số push đúng 1 lần, pop tối đa 1 lần ⇒ <b>O(n)</b>. PASS 20.000 ca vs vét cạn O(n²).</p></div></div>` },

  /* 20 */
  { t: 'Ngăn xếp đơn điệu: số ngày chờ đến khi ấm hơn (ý bài LeetCode 739)', body: `<div class="hai"><div>${code(`Deque<Integer> stack = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && t[stack.peek()] < t[i]) {
        int j = stack.pop();
        res[j] = i - j;   // KHOẢNG CÁCH, không phải giá trị
    }
    stack.push(i);
}`, 'java')}
${o('Cùng khuôn slide 19, chỉ khác đáp án ghi lại: đây là <b>i − j</b> (số ngày phải chờ), không phải t[i]. Cấu trúc dữ liệu và điều kiện while giữ nguyên — chỉ đổi "ghi gì khi pop".', 'xanh')}</div>
<div>${out(`nhiệt độ = {73,74,75,71,69,72,76,73}
-> số ngày chờ ấm hơn = {1,1,4,2,1,1,0,0}`)}
<ul style="font-size:20px;margin-top:8px">
<li>Ngày 2 (75°) phải chờ 4 ngày mới tới ngày 6 (76°) — ba ngày giữa (71,69,72) đều thấp hơn nên bị pop trước đó bởi các đỉnh nhỏ hơn</li>
<li>0 nghĩa là <b>không còn ngày nào ấm hơn</b> phía sau (còn kẹt lại trong stack tới hết vòng)</li>
</ul>
<p class="nho">O(n) thời gian, O(n) stack xấu nhất (mảng giảm dần hẳn). PASS 20.000 ca vs vét cạn O(n²).</p></div></div>` },

  /* 21 */
  { t: 'Ngăn xếp đơn điệu: hình chữ nhật lớn nhất trong histogram (ý bài LeetCode 84)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>${cot([2, 1, 5, 6, 2, 3])}
${o('<b>Khi gặp cột THẤP hơn đỉnh stack:</b> đỉnh đó không thể mở rộng thêm sang phải nữa — pop ra và tính hình chữ nhật cao bằng nó, rộng từ (đỉnh mới của stack, không kể) tới ngay trước vị trí hiện tại.', 'xanh')}</div>
<div>${code(`Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i <= n; i++) {
    int cur = (i == n) ? 0 : h[i];      // lính canh 0 cuối dãy
    while (!st.isEmpty() && h[st.peek()] >= cur) {
        int height = h[st.pop()];
        int leftBound = st.isEmpty() ? -1 : st.peek();
        long width = i - leftBound - 1;
        best = Math.max(best, height * width);
    }
    st.push(i);
}`, 'java', 'sm')}
${out(`h = {2,1,5,6,2,3} -> diện tích lớn nhất = 10
(cột cao 5 và 6, rộng 2 -> 2*5=10)`)}
<p class="nho">"Lính canh" cao 0 ở cuối buộc mọi phần tử còn sót trong stack phải được pop và tính. O(n) — mỗi cột push 1 lần, pop tối đa 1 lần. PASS 20.000 ca vs vét cạn O(n²).</p></div></div>` },

  /* 22 */
  { t: 'Hàng đợi hai đầu đơn điệu (deque): max trong cửa sổ trượt', body: `<div class="hai"><div>${code(`Deque<Integer> dq = new ArrayDeque<>();  // chỉ số, giá trị GIẢM dần đầu->cuối
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && a[dq.peekLast()] < a[i])
        dq.pollLast();          // các giá trị nhỏ hơn KHÔNG BAO GIỜ thắng nữa
    dq.addLast(i);
    if (dq.peekFirst() <= i - k) dq.pollFirst();   // rơi khỏi cửa sổ
    if (i >= k - 1) res[i-k+1] = a[dq.peekFirst()]; // đầu = max cửa sổ
}`, 'java', 'sm')}
${o('Nối tiếp bài <b>2.4 của môn</b> (deque &amp; sliding-window maximum) — cùng cấu trúc dữ liệu, ở đây trình bày lại đầy đủ khuôn kèm bảng bước và test đối chiếu vét cạn.', 'xanh')}</div>
<div>${bang([
    ['0', '1', '—', '[0]', 'chưa đủ 3'], ['1', '3', 'pop 0(v=1)', '[1]', 'chưa đủ 3'], ['2', '−1', '—', '[1,2]', '<b class="do">3</b>'],
    ['3', '−3', '—', '[1,2,3]', '<b class="do">3</b>'], ['4', '5', 'pop 3,2,1', '[4]', '<b class="do">5</b>'], ['5', '3', '—', '[4,5]', '<b class="do">5</b>'],
    ['6', '6', 'pop 5,4', '[6]', '<b class="do">6</b>'], ['7', '7', 'pop 6', '[7]', '<b class="do">7</b>'],
  ], ['i', 'a[i]', 'Pop khỏi cuối', 'deque sau bước', 'max cửa sổ'], 'font-size:15px')}
<p class="nho">a = {1,3,−1,−3,5,3,6,7}, k=3 → {3,3,5,5,6,7}. O(n) tổng — mỗi chỉ số vào/ra deque tối đa một lần mỗi đầu. PASS 20.000 ca vs vét cạn.</p></div></div>` },

  /* 23 */
  { t: 'Kadane: mảng con có tổng lớn nhất — và vì sao nó đúng', body: `<div class="hai"><div>${code(`long best = a[0], cur = a[0];
for (int i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);  // bắt đầu lại HAY kéo dài?
    best = Math.max(best, cur);
}
return best;`, 'java')}
${o('<b>Vì sao đúng:</b> nếu tổng đang chạy (cur) đã ÂM, kéo dài nó chỉ làm phần tử tiếp theo NHỎ ĐI — bỏ nó và bắt đầu lại từ a[i] không bao giờ tệ hơn. Đây là quy hoạch động 1 chiều đơn giản nhất: cur[i] = max(a[i], cur[i-1] + a[i]).', 'xanh')}</div>
<div>${bang([
    ['−2', '−2', '−2'], ['1', 'max(1, −1)=1', '1'], ['−3', 'max(−3, −2)=−2', '1'], ['4', 'max(4, 2)=4', '<b class="do">4</b>'],
    ['−1', 'max(−1, 3)=3', '4'], ['2', 'max(2, 5)=5', '<b class="do">5</b>'], ['1', 'max(1, 6)=6', '<b class="do">6</b>'], ['−5', 'max(−5, 1)=1', '6'], ['4', 'max(4, 5)=5', '6'],
  ], ['a[i]', 'cur', 'best'], 'font-size:15px;margin-top:2px')}
<p class="nho" style="margin-top:4px">→ 6 (đoạn {4,−1,2,1}). Toàn âm ⇒ trả về phần tử lớn nhất, không phải 0. O(n), <b>O(1) bộ nhớ</b>. PASS 20.000 ca vs vét cạn.</p></div></div>` },

  /* 24 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['Mảng <b>đã sắp</b>, tìm một cặp/bộ ba thoả tổng', 'Hai con trỏ hội tụ (sort trước nếu cần)'],
    ['Sửa mảng <b>tại chỗ</b>: xoá trùng, dồn phần tử, phân loại 3 nhóm', 'Hai con trỏ nhanh/chậm (hoặc 3 con trỏ)'],
    ['Danh sách liên kết, hỏi có chu trình / điểm giữa', 'Rùa và thỏ (Floyd)'],
    ['"K phần tử liên tiếp", tổng/trung bình cửa sổ cố định', 'Cửa sổ trượt kích thước cố định'],
    ['"Dài nhất/ngắn nhất thoả điều kiện", điều kiện đơn điệu theo độ dài', 'Cửa sổ co giãn (mở phải, co trái)'],
    ['Nhiều truy vấn tổng đoạn/hình chữ nhật trên dữ liệu <b>tĩnh</b>', 'Tổng tiền tố 1D/2D'],
    ['Đếm đoạn có tổng = k, có thể có số âm', 'Tổng tiền tố + HashMap'],
    ['Nhiều lệnh "+v cho cả một khoảng", đọc kết quả ở cuối', 'Mảng hiệu (difference array)'],
    ['"Phần tử lớn hơn/nhỏ hơn kế tiếp", histogram, chờ bao lâu', 'Ngăn xếp đơn điệu'],
    ['Max/min trong MỌI cửa sổ trượt cùng lúc', 'Hàng đợi hai đầu đơn điệu (deque)'],
    ['"Mảng con có tổng lớn nhất", không ràng buộc độ dài', 'Kadane'],
  ], ['Thấy trong đề', 'Nghĩ tới'], 'font-size:18px')}` },

  /* 25 */
  { t: 'Bảng độ phức tạp · Tóm tắt', body: `${bang([
    ['Hai con trỏ (hội tụ/nhanh-chậm)', 'O(n) (3-sum: O(n²))', 'O(1)'],
    ['Cửa sổ trượt (cố định/co giãn)', 'O(n)', 'O(1) hoặc O(bảng chữ)'],
    ['Tổng tiền tố 1D/2D', 'O(n)/O(R·C) dựng, O(1)/truy vấn', 'O(n)/O(R·C)'],
    ['Mảng hiệu', 'O(m + n)', 'O(n)'],
    ['Ngăn xếp/deque đơn điệu', 'O(n)', 'O(n)'],
    ['Kadane', 'O(n)', 'O(1)'],
  ], ['Kỹ thuật', 'Thời gian', 'Bộ nhớ'], 'font-size:18px')}
${o('<b>Tóm tắt:</b> mọi kỹ thuật ở đây thay một vòng lặp lồng O(n²) bằng MỘT lượt, vì mỗi phần tử chỉ được xử lý một số lần <em>không đổi</em> (vào/ra cửa sổ, push/pop ngăn xếp — mỗi việc tối đa 1–2 lần). Tổng tiền tố/mảng hiệu đổi "nhiều truy vấn" từ O(n) mỗi lần thành O(1) mỗi lần. <b>Nhận ra đúng nhóm kỹ thuật quan trọng hơn nhớ code.</b>', 'xanh')}` },
]);
