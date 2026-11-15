/** 2.2 — Cửa sổ trượt cố định và co giãn. Mọi mã/output đọc từ ../ma/ch02 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetMaxAverage } from '../ma/ch02/max-average.vet.mjs';
import { vetLongest } from '../ma/ch02/longest-substring.vet.mjs';
import { vetMinSubarray } from '../ma/ch02/min-subarray.vet.mjs';

/* Bảng vết 1 — cửa sổ cố định LC 643, k = 4. */
const MA = [1, 12, -5, -6, 50, 3];
const BANG_MA = bangVet(['window', 'nums', 'enters', 'leaves', 'sum', 'best sum'],
  vetMaxAverage(MA, 4).map((h) => [
    `[${h.l}..${h.r}]`,
    oMang(MA, { tu: h.l, den: h.r, to: h.vao === null ? {} : { [h.r]: 'r', [h.l - 1]: 'x' } }),
    h.vao === null ? '(first window)' : `+${h.vao}`,
    h.ra === null ? '' : `−${h.ra}`,
    String(h.sum), String(h.best),
  ]));

/* Bảng vết 2 — LC 3 bản nhảy, "tmmzuxt". */
const S3 = 'tmmzuxt'.split('');
const BANG_LS = bangVet(['r', 's', 's[r]', 'last[s[r]]', 'l = max(l, last + 1)', 'length', 'best'],
  vetLongest('tmmzuxt').map((h) => [
    String(h.r),
    oMang(S3, { tu: h.l, den: h.r, to: { [h.r]: 'r', ...(h.p !== null ? { [h.p]: 'x' } : {}) }, nhan: { [h.l]: 'L' } }),
    `'${h.c}'`,
    h.p === null ? '—' : String(h.p),
    h.p === null ? `${h.l} (unchanged)` : `max(${h.lTruoc}, ${h.sai}) = <strong>${h.l}</strong>`,
    String(h.len),
    h.moi ? `<strong>${h.best}</strong>` : String(h.best),
  ]));

/* Bảng vết 3 — LC 209, target 7. */
const MS = [2, 3, 1, 2, 4, 3];
const BANG_MS = bangVet(['#', 'nums', 'step', 'sum', 'best'],
  vetMinSubarray(7, MS).map((h, k) => [
    String(k + 1),
    oMang(MS, { tu: h.l, den: h.r, to: h.loai === 'grow' ? { [h.r]: 'r' } : { [h.l - 1]: 'x' }, nhan: { [h.l]: 'L', [h.r]: 'R' } }),
    h.loai === 'grow' ? `grow r → ${h.r} (+${MS[h.r]})` : `[${h.l - 1}..${h.r}] has sum ≥ 7 ⇒ record length ${h.r - h.l + 2}, drop ${h.bo}`,
    String(h.sum),
    h.best === Infinity ? '∞' : String(h.best),
  ]));

const DE = [
  [lc(643, 'maximum-average-subarray-i', 'Maximum Average Subarray I', 'Easy'), 'Fixed size k: add the newcomer, subtract the leaver, divide once at the end.', 'Kích thước cố định k: cộng phần tử vào, trừ phần tử ra, chia một lần ở cuối.'],
  [lc(1456, 'maximum-number-of-vowels-in-a-substring-of-given-length', 'Maximum Number of Vowels in a Substring of Given Length', 'Medium'), 'Fixed window again, but the "sum" is a count of vowels.', 'Lại cửa sổ cố định, nhưng "tổng" là số nguyên âm.'],
  [lc(3, 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'Medium'), 'Longest valid window; invalid = a repeated character. Jump with max(l, last + 1).', 'Cửa sổ hợp lệ dài nhất; vi phạm = có ký tự lặp. Nhảy bằng max(l, last + 1).'],
  [lc(209, 'minimum-size-subarray-sum', 'Minimum Size Subarray Sum', 'Medium'), 'SHORTEST valid window: shrink while still valid, record inside the while.', 'Cửa sổ hợp lệ NGẮN nhất: co khi vẫn còn hợp lệ, ghi nhận bên trong vòng while.'],
  [lc(567, 'permutation-in-string', 'Permutation in String', 'Medium'), 'A window with a per-letter budget; length m and nothing over budget ⇒ found.', 'Cửa sổ có "ngân sách" cho từng chữ; dài m mà không chữ nào vượt ⇒ tìm thấy.'],
  [lc(904, 'fruit-into-baskets', 'Fruit Into Baskets', 'Medium'), 'Story wrapper for "longest window with at most 2 distinct values".', 'Vỏ truyện của "cửa sổ dài nhất có tối đa 2 giá trị khác nhau".'],
  [lc(1004, 'max-consecutive-ones-iii', 'Max Consecutive Ones III', 'Medium'), 'Longest window containing at most k zeros — the flips are just a budget.', 'Cửa sổ dài nhất chứa tối đa k số 0 — "lật bit" chỉ là một ngân sách.'],
  [lc(340, 'longest-substring-with-at-most-k-distinct-characters', 'Longest Substring with At Most K Distinct Characters', 'Medium', { premium: true }), 'The general form of LC 904. Premium — the same problem is free as LintCode 386 or on NeetCode.', 'Dạng tổng quát của LC 904. Premium — đề y hệt miễn phí ở LintCode 386 hoặc trên NeetCode.'],
  [lc(76, 'minimum-window-substring', 'Minimum Window Substring', 'Hard'), 'Shortest window covering t: need[] counts + one "missing" number.', 'Cửa sổ ngắn nhất phủ t: mảng need[] + một con số "missing".'],
  [lc(992, 'subarrays-with-k-different-integers', 'Subarrays with K Different Integers', 'Hard'), 'Exactly k is not monotonic; at most k is. Answer = atMost(k) − atMost(k − 1).', '"Đúng k" không đơn điệu; "tối đa k" thì có. Đáp án = atMost(k) − atMost(k − 1).'],
];

export default {
  title: '2.2 — Sliding windows: fixed and variable|||2.2 — Cửa sổ trượt: cố định và co giãn',
  slug: 'dsa-2-2-cua-so',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cửa sổ cố định và khuôn co giãn "mở phải, co trái khi vi phạm": chuỗi con dài nhất không lặp, mảng con ngắn nhất, cửa sổ nhỏ nhất chứa đủ, tối đa k loại, hoán vị trong chuỗi — và rate limiter thật của repo: fixed window vs sliding log/counter, kẻ xấu dồn request ở mép cửa sổ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Sliding windows: fixed and variable</h2>
<p class="lead">A sliding window is two pointers that move in the <em>same</em> direction and treat everything between them as one object — a <strong>contiguous</strong> subarray or substring you keep updating instead of recomputing. Whenever a problem says "subarray" or "substring" (contiguous!) and asks for the longest, the shortest, the maximum sum or a count, this is the first pattern to test. It also sits inside a piece of infrastructure every web backend has: the rate limiter. By the end of this lesson you will have written four of them and watched an attacker get <strong>twice</strong> the allowed traffic through the simplest one.</p>

<h3>The everyday picture</h3>
<p><strong>Fixed window.</strong> Your banking app shows "spending in the last 7 days". When a new day arrives it does not re-add seven days of transactions: it adds today and subtracts the day that just fell out. That is a window of fixed size 7 sliding by one: O(1) work per day instead of O(7).</p>
<p><strong>Variable window.</strong> Picture a caterpillar (an inchworm, <em>con sâu đo</em>) crawling along a branch. The head stretches forward as long as it can; when the body gets "too long" for some rule, the tail pulls in. The head never goes back, the tail never goes back. A variable window is exactly that: <code>r</code> (the head) extends by one every step; <code>l</code> (the tail) moves forward only when the window breaks a rule.</p>
<p>Formally: the window is the range <code>[l, r]</code>; we maintain some summary of it (a sum, a count map, a set) and an <strong>invariant</strong> ("no repeated characters", "sum &lt; target"). Each index <em>enters</em> the window once (when r passes it) and <em>leaves</em> at most once (when l passes it), so even with a <code>while</code> inside the <code>for</code>, the total work is O(n) — the same <strong>amortised</strong> argument as Longest Consecutive Sequence in lesson 1.1.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Cửa sổ trượt: cố định và co giãn</h2>
<p class="lead">Cửa sổ trượt (sliding window) là hai con trỏ đi <em>cùng</em> chiều và coi mọi thứ ở giữa chúng là một đối tượng — một mảng con hay chuỗi con <strong>liên tiếp</strong> mà bạn liên tục cập nhật thay vì tính lại từ đầu. Hễ đề nói "subarray" hay "substring" (liên tiếp!) và hỏi dài nhất, ngắn nhất, tổng lớn nhất hay đếm số lượng, đây là mẫu đầu tiên nên thử. Nó còn nằm bên trong một món hạ tầng mà backend web nào cũng có: bộ giới hạn tốc độ (rate limiter). Hết bài này bạn sẽ tự viết bốn bộ như vậy và tận mắt thấy một kẻ tấn công lọt được <strong>gấp đôi</strong> lưu lượng cho phép qua bộ đơn giản nhất.</p>

<h3>Hình dung đời thường</h3>
<p><strong>Cửa sổ cố định.</strong> App ngân hàng hiện "chi tiêu 7 ngày gần nhất". Sang ngày mới nó không cộng lại giao dịch của cả bảy ngày: nó cộng hôm nay và trừ đi ngày vừa rơi khỏi khung. Đó là một cửa sổ kích thước cố định 7 trượt từng bước một: mỗi ngày tốn O(1) thay vì O(7).</p>
<p><strong>Cửa sổ co giãn.</strong> Hình dung con sâu đo bò trên cành cây. Đầu nó vươn tới chừng nào còn vươn được; khi thân "dài quá" theo một quy tắc nào đó, đuôi nó co lên. Đầu không bao giờ lùi, đuôi cũng không. Cửa sổ co giãn y như vậy: <code>r</code> (cái đầu) tiến một bước mỗi vòng; <code>l</code> (cái đuôi) chỉ tiến khi cửa sổ vi phạm quy tắc.</p>
<p>Nói cho chuẩn: cửa sổ là đoạn <code>[l, r]</code>; ta duy trì một bản tóm tắt của nó (một tổng, một map đếm, một set) và một <strong>bất biến (invariant)</strong> — điều luôn đúng ("không có ký tự lặp", "tổng &lt; target"). Mỗi chỉ số <em>vào</em> cửa sổ đúng một lần (khi r đi qua nó) và <em>ra</em> tối đa một lần (khi l đi qua nó), nên dù có <code>while</code> nằm trong <code>for</code>, tổng công việc vẫn là O(n) — đúng lập luận <strong>khấu hao (amortised)</strong> của Longest Consecutive Sequence ở bài 1.1.</p>
${csd('csd201-slide-cs2-1', 'vi', '⭐ CS.2 — Kỹ thuật mảng (1): cửa sổ cố định & co giãn', '<p>Deck ⭐ CS.2 đã có cửa sổ kích thước cố định (tổng lớn nhất k phần tử), khuôn "mở phải, co trái khi vi phạm", xâu con dài nhất không lặp và mảng con ngắn nhất có tổng ≥ S, bằng Java. <strong>Ở đây đi sâu thêm:</strong> hai biến thể của khuôn (dài nhất vs ngắn nhất — ghi nhận ở đâu), Minimum Window Substring, mẹo "đúng k = tối đa k − tối đa k−1", vì sao số âm phá cửa sổ, và cửa sổ trượt trong rate limiter thật của chính repo này.</p>')}
</div>

<div class="ml-en">
<h3>The variable-window template: "grow right, shrink left while broken"</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Grow</span><span class="lz-d"><code>for (r = 0; r &lt; n; r++)</code>: add <code>a[r]</code> to the window’s summary (sum, counts, set).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Repair</span><span class="lz-d"><code>while (window breaks the rule)</code>: remove <code>a[l]</code> from the summary, <code>l++</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Record</span><span class="lz-d">The window is valid again: <code>best = max(best, r − l + 1)</code> (longest), or count <code>r − l + 1</code> subarrays ending at r.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Why O(n)</span><span class="lz-d">r moves n times, l moves at most n times in total — the inner while is paid for by l’s journey, not per iteration.</span></div>
</div>
<p>For the <strong>shortest</strong> valid window, flip step 2: <code>while (window IS valid) { record; shrink }</code>. Choosing the wrong variant is the most common sliding-window bug, so decide out loud: "longest ⇒ shrink while invalid, record after; shortest ⇒ shrink while valid, record inside".</p>
</div>
<div class="ml-vi">
<h3>Khuôn cửa sổ co giãn: "mở rộng phải, co trái khi vi phạm"</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mở rộng</span><span class="lz-d"><code>for (r = 0; r &lt; n; r++)</code>: đưa <code>a[r]</code> vào bản tóm tắt của cửa sổ (tổng, bộ đếm, set).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Sửa</span><span class="lz-d"><code>while (cửa sổ vi phạm quy tắc)</code>: bỏ <code>a[l]</code> khỏi bản tóm tắt, <code>l++</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi nhận</span><span class="lz-d">Cửa sổ hợp lệ trở lại: <code>best = max(best, r − l + 1)</code> (dài nhất), hoặc cộng <code>r − l + 1</code> mảng con kết thúc tại r (bài đếm).</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Vì sao O(n)</span><span class="lz-d">r đi n lần, l đi tổng cộng tối đa n lần — vòng while bên trong được "trả tiền" bằng hành trình của l, không phải theo từng vòng.</span></div>
</div>
<p>Với cửa sổ hợp lệ <strong>ngắn nhất</strong> thì lật bước 2: <code>while (cửa sổ ĐANG hợp lệ) { ghi nhận; co lại }</code>. Chọn nhầm biến thể là lỗi cửa sổ trượt phổ biến nhất, nên hãy quyết định thành tiếng: "dài nhất ⇒ co khi vi phạm, ghi nhận sau vòng while; ngắn nhất ⇒ co khi còn hợp lệ, ghi nhận bên trong".</p>
</div>

<div class="ml-en">
<h3>Signals: when to reach for a sliding window</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"contiguous subarray / substring"</span><span class="v">The word that matters. Subsequences (not contiguous) are DP or two pointers on two strings, not windows.</span></div>
  <div class="kv"><span class="k">"of size k" / "every k consecutive"</span><span class="v">Fixed window: moving averages, max sum of k elements, anagrams of a pattern of length k.</span></div>
  <div class="kv"><span class="k">"longest … such that" / "at most k …"</span><span class="v">Variable window, shrink while invalid: no repeats, at most k distinct, at most k zeros, at most k replacements.</span></div>
  <div class="kv"><span class="k">"shortest / minimum length … such that" / "contains all of"</span><span class="v">Variable window, shrink while valid: sum ≥ target, minimum window substring.</span></div>
  <div class="kv"><span class="k">"number of subarrays with …"</span><span class="v">Count windows ending at each r (<code>r − l + 1</code>); "exactly k" = atMost(k) − atMost(k − 1).</span></div>
  <div class="kv"><span class="k">⚠️ negative numbers + a sum condition</span><span class="v">Growing the window may make the sum smaller, so the window idea breaks. Use prefix sums + a map (lesson 1.2).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm cửa sổ trượt lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"contiguous subarray / substring" (mảng con / chuỗi con liên tiếp)</span><span class="v">Chữ quan trọng nhất. Dãy con (subsequence — không liên tiếp) là DP hoặc hai con trỏ trên hai chuỗi, không phải cửa sổ.</span></div>
  <div class="kv"><span class="k">"of size k" / "mỗi k phần tử liên tiếp"</span><span class="v">Cửa sổ cố định: trung bình trượt, tổng lớn nhất của k phần tử, đảo chữ của một mẫu dài k.</span></div>
  <div class="kv"><span class="k">"longest … such that" / "at most k …" (dài nhất sao cho / tối đa k)</span><span class="v">Cửa sổ co giãn, co khi vi phạm: không lặp, tối đa k loại, tối đa k số 0, tối đa k lần thay.</span></div>
  <div class="kv"><span class="k">"shortest / minimum length … such that" / "contains all of" (ngắn nhất / chứa đủ)</span><span class="v">Cửa sổ co giãn, co khi còn hợp lệ: tổng ≥ target, cửa sổ nhỏ nhất chứa đủ ký tự.</span></div>
  <div class="kv"><span class="k">"number of subarrays with …" (đếm số mảng con)</span><span class="v">Đếm các cửa sổ kết thúc tại mỗi r (<code>r − l + 1</code>); "đúng k" = atMost(k) − atMost(k − 1).</span></div>
  <div class="kv"><span class="k">⚠️ có số âm + điều kiện về tổng</span><span class="v">Mở rộng cửa sổ có thể làm tổng NHỎ đi, nên ý tưởng cửa sổ gãy. Dùng tổng tiền tố + map (bài 1.2).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Warm-up: a fixed window (Maximum Average Subarray I)</h3>
<p><strong>Problem.</strong> Return the maximum average of any <em>contiguous</em> block of exactly k numbers. Example: <code>[1, 12, -5, -6, 50, 3]</code>, k = 4 → 12.75 (the block 12, −5, −6, 50).</p>
<p>The brute force sums every block from scratch: O(n·k). But two neighbouring blocks share k − 1 numbers. Sliding by one means one number <em>enters</em> and one <em>leaves</em>: <code>sum += nums[r] − nums[r − k]</code>. O(n) time, O(1) memory. Keep the integer <em>sum</em> and divide once at the end — comparing sums is exact, comparing averages invites floating-point noise.</p>
</div>
<div class="ml-vi">
<h3>Khởi động: cửa sổ cố định (Maximum Average Subarray I)</h3>
<p><strong>Đề.</strong> Trả về trung bình lớn nhất của một khối <em>liên tiếp</em> đúng k số. Ví dụ: <code>[1, 12, -5, -6, 50, 3]</code>, k = 4 → 12,75 (khối 12, −5, −6, 50).</p>
<p>Vét cạn cộng lại từng khối từ đầu: O(n·k). Nhưng hai khối liền nhau chung nhau k − 1 số. Trượt một bước nghĩa là một số <em>vào</em> và một số <em>ra</em>: <code>sum += nums[r] − nums[r − k]</code>. O(n) thời gian, O(1) bộ nhớ. Giữ <em>tổng</em> là số nguyên và chỉ chia một lần ở cuối — so tổng thì chính xác, so trung bình dễ dính sai số dấu phẩy động.</p>
</div>
${maHai('ch02/max-average.ts', 'ch02/MaxAverage.java', { vung: 'window' })}
${ketQua('ch02/max-average.ts')}
${BANG_MA}
<div class="ml-en">
<p>Three windows, three rows: green = inside the window, orange = the number that just entered, red = the one that just left. In Java the sum is a <code>long</code>: k numbers of up to 10⁴ in absolute value fit an <code>int</code> here, but writing <code>long</code> for running sums is a habit that costs nothing and saves you on the day the constraints say 10⁹.</p>
</div>
<div class="ml-vi">
<p>Ba cửa sổ, ba dòng: xanh = nằm trong cửa sổ, cam = số vừa vào, đỏ = số vừa ra. Trong Java tổng là <code>long</code>: ở đề này k số có trị tuyệt đối tới 10⁴ vẫn vừa <code>int</code>, nhưng viết <code>long</code> cho tổng chạy là một thói quen không tốn gì mà cứu bạn vào hôm ràng buộc ghi 10⁹.</p>
</div>

<div class="ml-en">
<h3>Worked example: Longest Substring Without Repeating Characters</h3>
<p><strong>Problem.</strong> Length of the longest substring (contiguous) of <code>s</code> with all characters different. <code>"abcabcbb"</code> → 3 ("abc"), <code>"pwwkew"</code> → 3 ("wke" — "pwke" is not contiguous).</p>
<p><strong>Brute force.</strong> All O(n²) substrings, check each for repeats: O(n³). A better brute force extends each start until the first repeat — O(n²) in general. (Interview nugget: if the alphabet is ASCII, each start can extend at most 128 characters before a repeat, so that version is really O(128·n). Mentioning this shows you read constraints.)</p>
<p><strong>The waste.</strong> When the substring starting at i hits a repeat at j, the brute force throws everything away and restarts at i + 1 — but <code>s[i + 1 .. j − 1]</code> is still repeat-free. We should keep it. That is the window: grow <code>r</code>; while <code>s[r]</code> is already in the window, shrink from the left; then record.</p>
<p><strong>Even better: jump.</strong> Instead of shrinking one by one, remember the <em>last index</em> of each character. When <code>s[r]</code> was last seen at p, every window that contains both copies is invalid, so <code>l</code> jumps straight to <code>p + 1</code> — <strong>but only if that is forward</strong>: <code>l = max(l, p + 1)</code>.</p>
</div>
<div class="ml-vi">
<h3>Giải mẫu: Longest Substring Without Repeating Characters</h3>
<p><strong>Đề.</strong> Độ dài chuỗi con (liên tiếp) dài nhất của <code>s</code> mà mọi ký tự đều khác nhau. <code>"abcabcbb"</code> → 3 ("abc"), <code>"pwwkew"</code> → 3 ("wke" — "pwke" không liên tiếp nên không tính).</p>
<p><strong>Vét cạn.</strong> Mọi chuỗi con, có O(n²) cái, kiểm từng cái xem có lặp không: O(n³). Một bản vét cạn khá hơn kéo dài từ mỗi điểm đầu cho tới chỗ lặp đầu tiên — O(n²) trong trường hợp tổng quát. (Mẹo phỏng vấn: nếu bảng chữ là ASCII, mỗi điểm đầu kéo dài được tối đa 128 ký tự là phải gặp lặp, nên bản này thật ra là O(128·n). Nói ra điều đó cho thấy bạn có đọc ràng buộc.)</p>
<p><strong>Chỗ phí.</strong> Khi chuỗi con bắt đầu ở i gặp ký tự lặp ở j, vét cạn vứt hết rồi làm lại từ i + 1 — trong khi <code>s[i + 1 .. j − 1]</code> vẫn không có lặp. Lẽ ra phải giữ lại phần đó. Đó chính là cửa sổ: tăng <code>r</code>; chừng nào <code>s[r]</code> đã có trong cửa sổ thì co từ trái; rồi ghi nhận.</p>
<p><strong>Tốt hơn nữa: nhảy.</strong> Thay vì co từng bước, nhớ <em>chỉ số gần nhất</em> của mỗi ký tự. Khi <code>s[r]</code> từng xuất hiện ở p, mọi cửa sổ chứa cả hai bản đều vi phạm, nên <code>l</code> nhảy thẳng tới <code>p + 1</code> — <strong>nhưng chỉ khi đó là bước tiến</strong>: <code>l = max(l, p + 1)</code>.</p>
</div>
${maHai('ch02/longest-substring.ts', 'ch02/LongestSubstring.java', { vung: 'set' })}
${maHai('ch02/longest-substring.ts', 'ch02/LongestSubstring.java', { vung: 'map' })}
${ketQua('ch02/longest-substring.ts')}
${ketQua('ch02/LongestSubstring.java')}
<div class="ml-en">
<p>The Set version is the one to write first in an interview: it is the template, line for line, and each character enters and leaves the Set at most once — O(n) time, O(min(n, alphabet)) memory. The jump version does the same work with fewer steps. In Java it uses <code>int[128]</code> filled with −1 instead of a map: the constraints say ASCII, and an array index is cheaper than hashing and boxing a <code>Character</code>.</p>
<h3>Watch the jump: why <code>max</code> is not optional</h3>
<p>Input <code>"tmmzuxt"</code>. Green = the window, orange = <code>s[r]</code>, red = the previous copy of <code>s[r]</code>, superscript L = the left edge.</p>
</div>
<div class="ml-vi">
<p>Bản dùng Set là bản nên viết trước khi phỏng vấn: nó khớp từng dòng với khuôn, và mỗi ký tự vào rồi ra khỏi Set tối đa một lần — O(n) thời gian, O(min(n, bảng chữ)) bộ nhớ. Bản nhảy làm cùng việc với ít bước hơn. Trong Java nó dùng <code>int[128]</code> điền −1 thay cho map: ràng buộc nói ASCII, và truy cập chỉ số mảng rẻ hơn băm và đóng hộp một <code>Character</code>.</p>
<h3>Xem cú nhảy: vì sao <code>max</code> không được bỏ</h3>
<p>Đầu vào <code>"tmmzuxt"</code>. Xanh = cửa sổ, cam = <code>s[r]</code>, đỏ = bản trước đó của <code>s[r]</code>, chữ L nhỏ = mép trái.</p>
</div>
${BANG_LS}
<div class="ml-en">
<p>Row r = 2: the second <code>'m'</code> jumps l from 0 to 2. Now look at the last row: <code>'t'</code> was last seen at index 0, which is <em>already outside</em> the window. Without <code>max</code>, l would move back to 1 and the "window" <code>"mmzuxt"</code> would be counted as length 6 — and it contains two m's. The output above shows exactly that: "jump without max = 6" for <code>"tmmzuxt"</code> and 3 for <code>"abba"</code>, while the correct answers are 5 and 2. Rule: a left pointer that moves backwards breaks the whole O(n) argument and the correctness with it.</p>
</div>
<div class="ml-vi">
<p>Dòng r = 2: chữ <code>'m'</code> thứ hai làm l nhảy từ 0 lên 2. Giờ nhìn dòng cuối: <code>'t'</code> lần trước ở chỉ số 0, tức là <em>đã nằm ngoài</em> cửa sổ. Không có <code>max</code>, l sẽ lùi về 1 và "cửa sổ" <code>"mmzuxt"</code> bị tính là dài 6 — trong khi nó chứa hai chữ m. Output phía trên cho thấy đúng như vậy: "jump without max = 6" với <code>"tmmzuxt"</code> và 3 với <code>"abba"</code>, còn đáp án đúng là 5 và 2. Quy tắc: con trỏ trái mà lùi là phá cả lập luận O(n) lẫn tính đúng đắn.</p>
</div>
${ma('ch02/longest-substring.ts', { vung: 'sai', nhan: 'TypeScript — wrong (no max)' })}

<div class="ml-en">
<h3>Pattern 2 — the shortest window: Minimum Size Subarray Sum</h3>
<p><strong>Problem.</strong> All numbers are positive. Return the length of the shortest contiguous subarray with sum ≥ <code>target</code>, or 0 if none exists. Example: target 7, <code>[2, 3, 1, 2, 4, 3]</code> → 2 (<code>[4, 3]</code>).</p>
<p>Here "valid" means sum ≥ target and we want it <em>short</em>, so the template flips: as soon as the window is valid, record its length and try to shrink it; keep shrinking while it stays valid. Positivity is what makes this correct: adding a number can only increase the sum, removing one can only decrease it, so once the window <code>[l, r]</code> is valid, any window starting at l and ending after r is longer and useless — l can move on.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — cửa sổ ngắn nhất: Minimum Size Subarray Sum</h3>
<p><strong>Đề.</strong> Mọi số đều dương. Trả về độ dài mảng con liên tiếp ngắn nhất có tổng ≥ <code>target</code>, không có thì trả 0. Ví dụ: target 7, <code>[2, 3, 1, 2, 4, 3]</code> → 2 (<code>[4, 3]</code>).</p>
<p>Ở đây "hợp lệ" nghĩa là tổng ≥ target và ta muốn nó <em>ngắn</em>, nên khuôn lật lại: cửa sổ vừa hợp lệ là ghi nhận độ dài rồi thử co; còn hợp lệ thì còn co. Tính "toàn số dương" làm nên sự đúng đắn: thêm một số chỉ làm tổng tăng, bớt một số chỉ làm tổng giảm, nên khi cửa sổ <code>[l, r]</code> đã hợp lệ thì mọi cửa sổ bắt đầu ở l và kết thúc sau r đều dài hơn và vô dụng — l được phép đi tiếp.</p>
</div>
${maHai('ch02/min-subarray.ts', 'ch02/MinSubarray.java', { vung: 'window' })}
${ketQua('ch02/min-subarray.ts')}
${BANG_MS}
<div class="ml-en">
<p>Eleven rows: six "grow" (one per index) and five "shrink" (l travels from 0 to 5). That is the amortised argument made visible — the number of inner-loop steps is bounded by n in total, not by n per outer iteration. The best length goes 4 → 3 → 2 exactly when the window <code>[0..3]</code>, then <code>[2..4]</code>, then <code>[4..5]</code> is recorded.</p>
${moPhong('ch02/min-subarray.sim.js', 'en', 'Minimum Size Subarray Sum — the caterpillar window', 'The selected range is the window: watch r stretch, l pull in, and the best length shrink.')}
</div>
<div class="ml-vi">
<p>Mười một dòng: sáu dòng "grow" (mỗi chỉ số một lần) và năm dòng "shrink" (l đi từ 0 tới 5). Đó là lập luận khấu hao hiện ra trước mắt — tổng số bước của vòng trong bị chặn bởi n cho CẢ bài, không phải n cho mỗi vòng ngoài. Độ dài tốt nhất đi 4 → 3 → 2 đúng lúc các cửa sổ <code>[0..3]</code>, rồi <code>[2..4]</code>, rồi <code>[4..5]</code> được ghi nhận.</p>
${moPhong('ch02/min-subarray.sim.js', 'vi', 'Minimum Size Subarray Sum — cửa sổ sâu đo', 'Đoạn được chọn là cửa sổ: xem r vươn ra, l co lại, và độ dài tốt nhất nhỏ dần.')}
</div>

<div class="ml-en">
<h3>Measured: O(n²) vs O(n) on the same problem</h3>
<p>Worst case for the brute force: all ones and target = n/2, so every start has to scan about n/2 numbers.</p>
</div>
<div class="ml-vi">
<h3>Đo bằng số: O(n²) vs O(n) trên cùng một đề</h3>
<p>Trường hợp xấu nhất của vét cạn: toàn số 1 và target = n/2, nên điểm đầu nào cũng phải quét khoảng n/2 số.</p>
</div>
${ma('ch02/cua-so-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch02/cua-so-do.ts')}
${ketQua('ch02/CuaSoDo.java')}
<div class="ml-en">
<p>10× more input, 100× more time for the brute force (20.7 → 2,100 ms in Node, 13.4 → 1,407 ms in Java); about 10× for the window (0.39 → 3.96 ms in Node). A million numbers take the window under 4 ms. Note that both versions print the same answer, 500,000 — measuring a wrong algorithm fast is worthless, so a benchmark should always check the answer too.</p>
</div>
<div class="ml-vi">
<p>Đầu vào gấp 10, thời gian vét cạn gấp 100 (20,7 → 2.100 ms trên Node, 13,4 → 1.407 ms trên Java); cửa sổ gấp khoảng 10 (0,39 → 3,96 ms trên Node). Một triệu số, cửa sổ chạy dưới 4 ms. Để ý cả hai bản cùng in một đáp án, 500.000 — đo một thuật toán sai mà nhanh thì vô nghĩa, nên phép đo nào cũng phải kiểm luôn đáp án.</p>
</div>

<div class="ml-en">
<h3>Pattern 3 — Minimum Window Substring (Hard): counts and one "missing" number</h3>
<p><strong>Problem.</strong> Shortest substring of <code>s</code> that contains every character of <code>t</code> <em>with multiplicity</em>. <code>s = "ADOBECODEBANC"</code>, <code>t = "ABC"</code> → <code>"BANC"</code>.</p>
<p>It is the shortest-window variant; the only question is how to test "the window covers t" in O(1). Keep <code>need[c]</code> = how many more c's the window needs (it goes negative when the window has a surplus), and <code>missing</code> = how many characters of t are still uncovered. When a character enters and <code>need[c] &gt; 0</code>, it was useful: <code>missing--</code>. When a character leaves and <code>need[d]</code> becomes positive again, we lost a useful one: <code>missing++</code>. The window is valid exactly when <code>missing === 0</code>.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 3 — Minimum Window Substring (Hard): bộ đếm và một con số "missing"</h3>
<p><strong>Đề.</strong> Chuỗi con ngắn nhất của <code>s</code> chứa mọi ký tự của <code>t</code> <em>kể cả số lần lặp</em>. <code>s = "ADOBECODEBANC"</code>, <code>t = "ABC"</code> → <code>"BANC"</code>.</p>
<p>Đây là biến thể cửa sổ ngắn nhất; câu hỏi duy nhất là kiểm "cửa sổ đã phủ t chưa" trong O(1) bằng cách nào. Giữ <code>need[c]</code> = cửa sổ còn cần thêm bao nhiêu chữ c (âm nghĩa là đang dư), và <code>missing</code> = còn bao nhiêu ký tự của t chưa được phủ. Một ký tự vào mà <code>need[c] &gt; 0</code> thì nó có ích: <code>missing--</code>. Một ký tự ra mà <code>need[d]</code> dương trở lại thì ta vừa mất một chữ có ích: <code>missing++</code>. Cửa sổ hợp lệ đúng khi <code>missing === 0</code>.</p>
</div>
${maHai('ch02/min-window.ts', 'ch02/MinWindow.java', { vung: 'window' })}
${ketQua('ch02/min-window.ts')}
<div class="ml-en">
<p>The third case (<code>t = "aa"</code>, <code>s = "a"</code>) is why <code>missing</code> starts at <code>t.length</code> and not at "number of distinct letters": duplicates in t count. Return the empty string when nothing fits — and store <code>bestL</code>/<code>bestLen</code> instead of slicing on every improvement, which would make the solution O(n²) in the worst case.</p>
</div>
<div class="ml-vi">
<p>Ca thứ ba (<code>t = "aa"</code>, <code>s = "a"</code>) là lý do <code>missing</code> bắt đầu bằng <code>t.length</code> chứ không phải "số chữ cái khác nhau": chữ lặp trong t cũng tính. Không có cửa sổ nào thì trả chuỗi rỗng — và lưu <code>bestL</code>/<code>bestLen</code> thay vì cắt chuỗi mỗi lần tìm được cửa sổ tốt hơn, cắt chuỗi liên tục sẽ làm lời giải thành O(n²) ở trường hợp xấu.</p>
</div>

<div class="ml-en">
<h3>Pattern 4 — "at most k distinct", and the trick for "exactly k"</h3>
<p><em>Fruit Into Baskets</em> is a story: you have two baskets, each holds one kind of fruit, you pick from consecutive trees — what is the most fruit you can collect? Strip the story and it is "the longest window with at most 2 distinct values". Keep a count map; when it has more than k keys, shrink; delete a key when its count hits 0 (otherwise <code>size</code> lies).</p>
<p><em>Subarrays with K Different Integers</em> asks for the number of subarrays with <strong>exactly</strong> k distinct values. "Exactly k" is not monotonic — growing a window can push it from valid to invalid and shrinking can too — so the window template does not apply directly. "At most k" <em>is</em> monotonic, and for a fixed r every start in <code>[l, r]</code> works, so there are <code>r − l + 1</code> valid subarrays ending at r. Then: <strong>exactly(k) = atMost(k) − atMost(k − 1)</strong>.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 4 — "tối đa k loại", và mẹo cho "đúng k"</h3>
<p><em>Fruit Into Baskets</em> là một câu chuyện: bạn có hai giỏ, mỗi giỏ chứa một loại quả, hái từ các cây liên tiếp — hái được nhiều nhất bao nhiêu quả? Bóc lớp truyện đi thì nó là "cửa sổ dài nhất có tối đa 2 giá trị khác nhau". Giữ một map đếm; khi map có hơn k khoá thì co; xoá khoá khi bộ đếm về 0 (không thì <code>size</code> nói dối).</p>
<p><em>Subarrays with K Different Integers</em> hỏi số mảng con có <strong>đúng</strong> k giá trị khác nhau. "Đúng k" không đơn điệu — nới cửa sổ có thể đẩy nó từ hợp lệ sang vi phạm, co lại cũng vậy — nên khuôn cửa sổ không áp thẳng được. "Tối đa k" thì <em>có</em> đơn điệu, và với một r cố định mọi điểm đầu trong <code>[l, r]</code> đều hợp lệ, nên có <code>r − l + 1</code> mảng con hợp lệ kết thúc tại r. Rồi: <strong>đúng(k) = tốiĐa(k) − tốiĐa(k − 1)</strong>.</p>
</div>
${maHai('ch02/k-distinct.ts', 'ch02/KDistinct.java', { vung: 'atmost' })}
${maHai('ch02/k-distinct.ts', 'ch02/KDistinct.java', { vung: 'exactly' })}
${ketQua('ch02/k-distinct.ts')}
<div class="ml-en">
<p>Check the arithmetic in the output: for <code>[1, 2, 1, 2, 3]</code>, 12 subarrays have at most 2 distinct values and 5 have at most 1 (the five single elements), so exactly 2 distinct gives 12 − 5 = 7. The same subtraction trick appears in counting problems far beyond windows ("subarrays with sum exactly k" = "sum ≤ k" − "sum ≤ k − 1" for non-negative numbers).</p>
</div>
<div class="ml-vi">
<p>Kiểm phép tính trong output: với <code>[1, 2, 1, 2, 3]</code>, có 12 mảng con có tối đa 2 giá trị khác nhau và 5 mảng con có tối đa 1 (năm phần tử đơn lẻ), nên đúng 2 giá trị khác nhau là 12 − 5 = 7. Mẹo trừ này còn xuất hiện ở nhiều bài đếm khác ngoài cửa sổ ("mảng con có tổng đúng k" = "tổng ≤ k" − "tổng ≤ k − 1" với số không âm).</p>
</div>

<div class="ml-en">
<h3>Pattern 5 — Permutation in String: a window with a budget</h3>
<p>Does <code>s2</code> contain a permutation of <code>s1</code> as a substring? The textbook answer is a fixed window of size m = |s1| with two count arrays compared on every step (O(26·n)). A neater way reuses the variable template: start with a budget <code>cnt</code> = letter counts of s1. A letter entering spends one unit; if its budget goes negative, shrink until it is back to 0. The window never holds more of any letter than s1 has — so when its length reaches m, it holds <em>exactly</em> s1’s letters.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 5 — Permutation in String: cửa sổ có ngân sách</h3>
<p><code>s2</code> có chứa một hoán vị của <code>s1</code> làm chuỗi con không? Đáp án sách giáo khoa là cửa sổ cố định kích thước m = |s1| với hai mảng đếm so sánh ở mỗi bước (O(26·n)). Một cách gọn hơn dùng lại khuôn co giãn: bắt đầu với "ngân sách" <code>cnt</code> = số lần mỗi chữ trong s1. Một chữ đi vào tiêu một đơn vị; nếu ngân sách của nó âm thì co cho tới khi về 0. Cửa sổ không bao giờ chứa chữ nào nhiều hơn s1 có — nên khi độ dài chạm m, nó chứa <em>đúng</em> các chữ của s1.</p>
</div>
${maHai('ch02/permutation-in-string.ts', 'ch02/PermutationInString.java', { vung: 'window' })}
${ketQua('ch02/permutation-in-string.ts')}

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Negative numbers break the window.</strong></p><p>The variable window assumes "a longer window has a bigger sum". Count subarrays with sum exactly k using a window, then with prefix sums (lesson 1.2), on the same inputs:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Số âm làm gãy cửa sổ.</strong></p><p>Cửa sổ co giãn ngầm giả định "cửa sổ dài hơn thì tổng lớn hơn". Đếm số mảng con có tổng đúng bằng k bằng cửa sổ, rồi bằng tổng tiền tố (bài 1.2), trên cùng các đầu vào:</p></div>
</div>
${ma('ch02/so-am-bay.ts', { nhan: 'TypeScript — trap' })}
${ketQua('ch02/so-am-bay.ts')}
<div class="ml-en">
<p>With only positive numbers both agree (2 and 2). With <code>[1, -1, 1, 1]</code> the window finds 1 subarray instead of 2, and on the last input 2 instead of 3 — no crash, just a quietly wrong count. The window threw away a left part that a later negative number would have "repaired". When you see negatives and a sum condition, say "a window doesn’t work because the sum isn’t monotonic — I’ll use prefix sums with a hash map" (<a href="${baiNay('dsa-1-2-prefix-sum')}">lesson 1.2</a>).</p>
</div>
<div class="ml-vi">
<p>Khi chỉ có số dương, hai cách khớp nhau (2 và 2). Với <code>[1, -1, 1, 1]</code> cửa sổ đếm ra 1 mảng con thay vì 2, và ở đầu vào cuối là 2 thay vì 3 — không văng lỗi, chỉ lặng lẽ đếm sai. Cửa sổ đã vứt một phần bên trái mà một số âm phía sau lẽ ra "chữa" được. Thấy số âm đi cùng điều kiện về tổng, hãy nói "cửa sổ không dùng được vì tổng không đơn điệu — em dùng tổng tiền tố với hash map" (<a href="${baiNay('dsa-1-2-prefix-sum')}">bài 1.2</a>).</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives: the rate limiter in this very repo</h3>
<p>Every API has a rule like "at most 10 orders per minute per user". In this repository it is <code>src/middleware/orderRateLimit.ts</code>: <code>taoLimiter</code> wraps <code>express-rate-limit</code> with a Redis store (<code>rate-limit-redis</code>), and <code>shopOrderLimiter</code> sets <code>windowMs: 60_000</code>, <code>max: 10</code>, keyed per user (<code>khoaTheoNguoi</code>: <code>u:&lt;userId&gt;</code>, else the right-most <code>X-Forwarded-For</code> entry). Read the Lua script inside <code>rate-limit-redis</code> and you find the algorithm: on a key’s first hit <code>SET key 1 PX windowMs</code>, afterwards <code>INCR</code>. That is a <strong>fixed window that opens at the first hit</strong> and lasts 60 s. The global limiter in <code>src/index.ts</code> (<code>generalLimiter</code>, 2,000 requests per 15 minutes per IP) works the same way.</p>
<p>Elsewhere the repo uses true sliding windows. <code>src/services/agent/defaultGioiHan.ts</code> limits "10 questions per minute" with <code>BoDemDefault.soPhut</code>, which keeps each user’s request timestamps and filters those younger than 60,000 ms — a <strong>sliding window log</strong>. And the header of <code>src/services/agent/quota.ts</code> explains in plain words why the 5-hour AI quota is sliding rather than reset at fixed hours: with fixed resets, someone who starts at 04:50 gets 10 minutes before the 05:00 reset, someone who starts at 05:00 gets the full five hours. Same rule, different experience — the "cliff" of a fixed window.</p>
<p>Below are four limiters with the same rule (10 per 60 s), fed the same request times. The sliding log keeps accepted timestamps in an array and moves a <code>head</code> pointer forward as they expire — the left edge of a window, literally. The sliding counter (the approach Cloudflare describes) keeps only two counters and weights the previous minute by how much of it is still inside the last 60 s.</p>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu: bộ giới hạn tốc độ trong chính repo này</h3>
<p>API nào cũng có một quy tắc kiểu "mỗi người tối đa 10 đơn mỗi phút". Trong repo này nó nằm ở <code>src/middleware/orderRateLimit.ts</code>: <code>taoLimiter</code> bọc <code>express-rate-limit</code> với kho lưu Redis (<code>rate-limit-redis</code>), và <code>shopOrderLimiter</code> đặt <code>windowMs: 60_000</code>, <code>max: 10</code>, khoá theo người (<code>khoaTheoNguoi</code>: <code>u:&lt;userId&gt;</code>, chưa đăng nhập thì lấy mục ngoài cùng bên phải của <code>X-Forwarded-For</code>). Đọc đoạn script Lua bên trong <code>rate-limit-redis</code> là thấy thuật toán: lần chạm đầu tiên của một khoá thì <code>SET key 1 PX windowMs</code>, các lần sau thì <code>INCR</code>. Đó là <strong>cửa sổ cố định mở ra từ lần chạm đầu tiên</strong> và kéo dài 60 giây. Bộ giới hạn chung trong <code>src/index.ts</code> (<code>generalLimiter</code>, 2.000 request mỗi 15 phút mỗi IP) cũng chạy kiểu này.</p>
<p>Ở chỗ khác repo dùng cửa sổ trượt thật. <code>src/services/agent/defaultGioiHan.ts</code> giới hạn "10 câu mỗi phút" bằng <code>BoDemDefault.soPhut</code>, hàm giữ các mốc thời gian request của từng người và lọc lấy những mốc chưa quá 60.000 ms — một <strong>sliding window log</strong> (nhật ký cửa sổ trượt). Còn phần đầu tệp <code>src/services/agent/quota.ts</code> giải thích bằng lời rất đời vì sao hạn mức AI 5 giờ là cửa sổ trượt chứ không reset theo mốc giờ: reset theo mốc thì người bắt đầu lúc 04:50 chỉ được 10 phút trước mốc 05:00, người bắt đầu lúc 05:00 được trọn năm tiếng. Cùng quy tắc mà trải nghiệm khác hẳn — "vách đá" của cửa sổ cố định.</p>
<p>Dưới đây là bốn bộ giới hạn cùng quy tắc (10 lần mỗi 60 giây), được đưa vào cùng một chuỗi thời điểm request. Sliding log giữ các mốc đã chấp nhận trong một mảng và đẩy con trỏ <code>head</code> tới khi chúng hết hạn — đúng nghĩa đen là mép trái của cửa sổ. Sliding counter (bộ đếm cửa sổ trượt — cách Cloudflare mô tả) chỉ giữ hai bộ đếm và cân bộ đếm của phút trước theo phần của nó còn nằm trong 60 giây vừa qua.</p>
</div>
${ma('ch02/rate-limiter.ts', { vung: 'fixed', nhan: 'TypeScript — two fixed windows' })}
${maHai('ch02/rate-limiter.ts', 'ch02/RateLimiter.java', { vung: 'log' })}
${ma('ch02/rate-limiter.ts', { vung: 'counter', nhan: 'TypeScript — sliding window counter' })}
${ketQua('ch02/rate-limiter.ts')}
${ketQua('ch02/RateLimiter.java')}
<div class="ml-en">
<p>Scenario A is a normal user (one request every 7 s ≈ 8.6 per minute): all four accept everything — none of them hurts honest traffic. Scenarios B and C are where they differ, and they are the next section. The Java version uses an <code>ArrayDeque</code> for the log, which is the same idea as the head pointer: remove from the front, add at the back, both O(1).</p>
<p>Memory per key is the other trade-off. The log stores up to <code>max</code> timestamps per key: fine for 10 per minute, but <code>generalLimiter</code>’s 2,000 per 15 minutes would mean 2,000 numbers for <em>every</em> IP — that is why big limits use counters. <code>BoDemDefault</code> can afford a log because its limit is 10.</p>
${moPhong('ch02/rate-limiter.sim.js', 'en', 'Rate limiter — sliding log vs fixed window', '3 requests per 10 s: each request shows both decisions; watch the fixed window let a burst through right after its reset.')}
</div>
<div class="ml-vi">
<p>Kịch bản A là người dùng bình thường (7 giây một request ≈ 8,6 lần mỗi phút): cả bốn đều chấp nhận hết — không bộ nào làm khó người dùng thật. Kịch bản B và C mới là chỗ chúng khác nhau, xem ngay mục dưới. Bản Java dùng <code>ArrayDeque</code> cho nhật ký, cùng ý với con trỏ head: bỏ ở đầu, thêm ở cuối, đều O(1).</p>
<p>Bộ nhớ cho mỗi khoá là sự đánh đổi còn lại. Nhật ký lưu tới <code>max</code> mốc thời gian cho mỗi khoá: ổn với 10 lần mỗi phút, nhưng 2.000 lần mỗi 15 phút của <code>generalLimiter</code> nghĩa là 2.000 con số cho <em>mỗi</em> IP — vì thế các hạn mức lớn dùng bộ đếm. <code>BoDemDefault</code> dùng nhật ký được vì hạn mức của nó chỉ là 10.</p>
${moPhong('ch02/rate-limiter.sim.js', 'vi', 'Rate limiter — sliding log vs fixed window', '3 request mỗi 10 giây: mỗi request hiện cả hai quyết định; xem cửa sổ cố định cho cả một loạt lọt qua ngay sau lúc reset.')}
${lienKet({ khoa: 'redis', bai: 'rd-3-5-gioi-han-tan-suat', title: 'Redis 3.5 — Giới hạn tần suất, bốn cách', sub: 'Dựng fixed window, sliding log (sorted set), sliding counter và token bucket trên Redis thật', cta: 'Đọc bài' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-8-4-frame-ntile', title: 'PostgreSQL 8.4 — Khung cửa sổ, FIRST_VALUE &amp; NTILE', sub: 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = cửa sổ cố định 7 dòng ngay trong SQL', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: burst at the edge of a fixed window</h3>
<p>Scenario B: the attacker sends 10 requests in the last 100 ms of a clock minute and 10 more in the first 100 ms of the next. The clock-aligned fixed window sees "10 in minute 0, 10 in minute 1" and accepts all <strong>20 within 200 ms</strong> — twice the rule, in a fraction of a second. The sliding log accepts 10, as the rule intends; the sliding counter accepts 11 (it is an approximation — it assumes the previous minute’s 10 requests were spread evenly).</p>
<p>The window used by <code>rate-limit-redis</code> opens at the key’s first hit, so the attacker cannot use the clock — it has to create its own edge. Scenario C does exactly that: one request at t = 0 opens the window, then wait almost a minute and burst. Result: <strong>19 accepted within 200 ms</strong>, that is 2 × max − 1. Anchoring to the first hit makes the trick slightly harder, not impossible.</p>
<p>How to defend, depending on what is at stake:</p>
<ul>
<li>Use a sliding log or counter where a burst is dangerous (logins, OTP, payments). For a 10-per-minute order limit, 19 extra orders are an annoyance; for a login endpoint, doubled guessing speed matters more.</li>
<li>Combine a long window with a short one ("10 per minute <em>and</em> 3 per second"): the edge burst then hits the short limit.</li>
<li>Remember what a limiter cannot do. The comment in <code>orderRateLimit.ts</code> says it outright: a double click inside one second still passes, the real guard against duplicate orders is an <code>idempotencyKey</code> with a UNIQUE constraint in the database.</li>
<li>The key is part of the algorithm. If the attacker can choose the key, no window helps: the left-most <code>X-Forwarded-For</code> entry is sent by the client, which is why <code>khoaTheoNguoi</code> takes the right-most one (added by the proxy) and prefers the user id.</li>
<li>Know your failure mode. The repo’s <code>failOpen</code> lets requests through when Redis is down — a deliberate choice of availability over strictness, written down in the file’s header. An attacker who can take Redis down also removes the limit; that is the price of never blocking real sales because of a counter.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: dồn request ở mép cửa sổ cố định</h3>
<p>Kịch bản B: kẻ tấn công gửi 10 request trong 100 ms cuối của một phút đồng hồ và thêm 10 request trong 100 ms đầu của phút kế tiếp. Cửa sổ cố định căn theo đồng hồ thấy "phút 0 có 10, phút 1 có 10" và chấp nhận cả <strong>20 request trong 200 ms</strong> — gấp đôi quy tắc, trong chưa tới một giây. Sliding log chấp nhận 10, đúng ý quy tắc; sliding counter chấp nhận 11 (nó là phép xấp xỉ — giả định 10 request của phút trước rải đều).</p>
<p>Cửa sổ của <code>rate-limit-redis</code> mở ra từ lần chạm đầu tiên của khoá, nên kẻ tấn công không dùng được đồng hồ — phải tự tạo ra mép. Kịch bản C làm đúng như thế: một request lúc t = 0 để mở cửa sổ, chờ gần một phút rồi dồn. Kết quả: <strong>19 request lọt trong 200 ms</strong>, tức 2 × max − 1. Neo vào lần chạm đầu chỉ làm mẹo này khó hơn một chút, không chặn được nó.</p>
<p>Cách phòng, tuỳ thứ đang được bảo vệ:</p>
<ul>
<li>Dùng sliding log hoặc counter ở chỗ một đợt dồn là nguy hiểm (đăng nhập, OTP, thanh toán). Với hạn mức 10 đơn mỗi phút thì lọt thêm 9–10 đơn chỉ là phiền; với endpoint đăng nhập, tốc độ dò mật khẩu gấp đôi đáng lo hơn nhiều.</li>
<li>Kết hợp cửa sổ dài với cửa sổ ngắn ("10 mỗi phút <em>và</em> 3 mỗi giây"): đợt dồn ở mép sẽ đụng hạn mức ngắn.</li>
<li>Nhớ bộ giới hạn KHÔNG làm được gì. Chú thích trong <code>orderRateLimit.ts</code> nói thẳng: bấm hai lần trong một giây vẫn lọt, chốt chặn thật cho đơn trùng là <code>idempotencyKey</code> + ràng buộc UNIQUE trong CSDL.</li>
<li>Khoá là một phần của thuật toán. Nếu kẻ tấn công tự chọn được khoá thì cửa sổ nào cũng vô ích: mục ngoài cùng bên trái của <code>X-Forwarded-For</code> do client gửi, nên <code>khoaTheoNguoi</code> lấy mục ngoài cùng bên phải (do proxy thêm vào) và ưu tiên userId.</li>
<li>Biết mình hỏng theo kiểu nào. <code>failOpen</code> của repo cho request đi qua khi Redis chết — một lựa chọn có chủ ý đặt tính sẵn sàng trên sự chặt chẽ, ghi rõ ở đầu tệp. Kẻ nào đánh sập được Redis thì cũng gỡ luôn được giới hạn; đó là cái giá của việc không bao giờ để một bộ đếm chặn việc bán hàng thật.</li>
</ul>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-12-4-nguyen-tu-rate-limit-lock', title: 'Node.js 12.4 — Tính nguyên tử: giới hạn tần suất và khoá phân tán', sub: 'Vì sao bộ đếm phải tăng nguyên tử (INCR, Lua) khi nhiều tiến trình cùng đếm', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given a string, find the length of the longest substring without repeating characters.'],
  ['C', 'Substring means contiguous, right? And what characters can appear — letters only, or any ASCII?'],
  ['N', '"Contiguous" decides window vs. DP; the alphabet decides map vs. int[128] and lets you state the memory bound.'],
  ['I', 'Contiguous, any printable ASCII.'],
  ['C', 'Brute force tries every start and extends until a repeat — O(n²) in general. But when I hit a repeat I throw away a part that is still valid. So I’ll keep a window [l, r] with no repeats: extend r, and while s[r] is already inside, shrink from the left. Every index enters and leaves once: O(n) time, O(128) space.'],
  ['N', 'Name the waste, then the invariant ("no repeats inside [l, r]"), then the amortised complexity.'],
  ['I', 'Sounds good. Code it.'],
  ['C', '(coding) I record the length after the while loop, because only then is the window valid again… Testing "abba": at the second b, l jumps to 2; at the last a, the old a is at 0, already outside, so l stays 2 — answer 2.'],
  ['N', 'Choose "abba" on purpose: it is the case that breaks the jump version without max.'],
  ['I', 'Can you avoid shrinking one step at a time?'],
  ['C', 'Yes, store the last index of each character and jump l to max(l, last + 1). The max matters: without it l can move backwards on "abba".'],
  ['I', 'Where would you use this outside LeetCode?'],
  ['C', 'Rate limiting. A sliding window log keeps the timestamps of the last minute and drops the old ones from the left — it avoids the double burst you get at the edge of a fixed window.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Cùng mạch hội thoại ở khối tiếng Anh, bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho một chuỗi, tìm độ dài chuỗi con dài nhất không có ký tự lặp.'],
  ['C', 'Chuỗi con là liên tiếp phải không ạ? Và ký tự có thể là gì — chỉ chữ cái, hay mọi ký tự ASCII? <em>("Substring means contiguous, right?")</em>'],
  ['N', '"Liên tiếp" quyết định cửa sổ hay DP; bảng chữ quyết định map hay int[128] và cho bạn nói được cận bộ nhớ.'],
  ['I', 'Liên tiếp, mọi ký tự ASCII in được.'],
  ['C', 'Vét cạn thử từng điểm đầu và kéo dài tới khi lặp — O(n²) tổng quát. Nhưng gặp lặp là em vứt luôn một phần vẫn còn hợp lệ. Nên em giữ một cửa sổ [l, r] không có lặp: tăng r, và chừng nào s[r] đã nằm trong cửa sổ thì co từ trái. Mỗi chỉ số vào và ra một lần: O(n) thời gian, O(128) bộ nhớ. <em>("Every index enters and leaves once.")</em>'],
  ['N', 'Gọi tên chỗ phí, rồi bất biến ("không có lặp trong [l, r]"), rồi độ phức tạp khấu hao.'],
  ['I', 'Nghe ổn. Code đi.'],
  ['C', '(vừa code vừa nói) Em ghi nhận độ dài SAU vòng while, vì chỉ lúc đó cửa sổ mới hợp lệ trở lại… Thử "abba": tới chữ b thứ hai, l nhảy lên 2; tới chữ a cuối, chữ a cũ ở 0, đã nằm ngoài, nên l giữ 2 — đáp án 2.'],
  ['N', 'Chọn "abba" có chủ ý: đó là ca làm hỏng bản nhảy thiếu max.'],
  ['I', 'Có cách nào khỏi co từng bước một không?'],
  ['C', 'Có ạ, lưu chỉ số gần nhất của mỗi ký tự và cho l nhảy tới max(l, last + 1). Cái max quan trọng: thiếu nó thì l có thể lùi ở "abba". <em>("The max matters: without it l can move backwards.")</em>'],
  ['I', 'Ngoài LeetCode thì em dùng cái này ở đâu?'],
  ['C', 'Giới hạn tốc độ. Sliding window log giữ các mốc thời gian trong phút vừa qua và bỏ mốc cũ từ bên trái — nó tránh được đợt dồn gấp đôi ở mép cửa sổ cố định. <em>("It avoids the double burst at the edge of a fixed window.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Using the "longest" variant for a "shortest" problem (or the reverse): recording in the wrong place gives answers that are off by the whole window.</li>
<li>Jumping <code>l = last + 1</code> without <code>max</code> — the left edge moves backwards (<code>"abba"</code>, <code>"tmmzuxt"</code>).</li>
<li>Not deleting a key whose count reached 0, so <code>map.size</code> over-counts the distinct values.</li>
<li>Applying a window to a sum problem with negative numbers.</li>
<li>Slicing the best substring on every improvement (O(n²) copying) instead of storing start and length.</li>
<li>Fixed window: dividing inside the loop and comparing doubles, or an off-by-one in <code>nums[r − k]</code> (the element leaving is exactly k positions behind the one entering).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dùng biến thể "dài nhất" cho đề "ngắn nhất" (hoặc ngược lại): ghi nhận sai chỗ cho đáp án lệch nguyên một cửa sổ.</li>
<li>Nhảy <code>l = last + 1</code> mà thiếu <code>max</code> — mép trái lùi lại (<code>"abba"</code>, <code>"tmmzuxt"</code>).</li>
<li>Không xoá khoá có bộ đếm về 0, nên <code>map.size</code> đếm thừa số giá trị khác nhau.</li>
<li>Dùng cửa sổ cho bài về tổng có số âm.</li>
<li>Cắt chuỗi con tốt nhất ở mỗi lần cải thiện (chép O(n²)) thay vì lưu điểm đầu và độ dài.</li>
<li>Cửa sổ cố định: chia ngay trong vòng lặp rồi so số thực, hoặc lệch một ở <code>nums[r − k]</code> (phần tử ra nằm đúng k vị trí sau phần tử vào).</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>LC 340 bị khoá Premium: làm bản miễn phí y hệt ở LintCode 386 (cùng tên) hoặc dùng lời giải LC 904 với k tổng quát ở trên. Lời giải từng bước của các đề tổng hợp nằm ở bài 2.4.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the variable-window template from memory (grow, repair, record) and use it to solve LC 3 with a Set. Test <code>"abba"</code>, <code>"tmmzuxt"</code>, <code>""</code>, <code>" "</code>.</li>
<li>Turn it into the jump version, delete the <code>max</code>, and confirm <code>"tmmzuxt"</code> returns 6. Put the <code>max</code> back.</li>
<li>Solve LC 209 and LC 904. Next to each, write which variant you used (longest/shortest) and where you recorded.</li>
<li>Bonus: in the rate limiter file, add a fifth limiter "3 per second <em>and</em> 10 per minute" and run scenario B again. How many get through now?</li>
</ol>
<p><strong>Done when:</strong> LC 3, LC 209, LC 904 accepted; the 6 → 5 bug reproduced and fixed; one sentence per problem naming the variant.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sliding window</span><span class="v">A contiguous range [l, r] updated incrementally as the pointers move forward.</span></div>
  <div class="kv"><span class="k">fixed / variable window</span><span class="v">Size k always, or grown and shrunk to keep an invariant.</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A property the window keeps after every repair ("no repeats", "≤ k distinct").</span></div>
  <div class="kv"><span class="k">amortised O(n)</span><span class="v">The inner while runs at most n times in total, because l only moves forward.</span></div>
  <div class="kv"><span class="k">at most k ⇒ exactly k</span><span class="v">exactly(k) = atMost(k) − atMost(k − 1) for counting problems.</span></div>
  <div class="kv"><span class="k">rate limiter</span><span class="v">Allows at most N requests per time window per key.</span></div>
  <div class="kv"><span class="k">fixed window / sliding log / sliding counter</span><span class="v">Reset per bucket (cheap, edge bursts) / exact timestamps (exact, more memory) / weighted two buckets (cheap, approximate).</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>"Contiguous" + longest/shortest/count ⇒ try a window first.</li>
<li>Fixed window: one in, one out, O(1) per step.</li>
<li>Variable window: grow r; longest ⇒ shrink while invalid, record after; shortest ⇒ shrink while valid, record inside.</li>
<li>The left pointer never moves backwards (<code>max(l, last + 1)</code>) — that is both the proof of O(n) and of correctness.</li>
<li>Negative numbers with a sum condition ⇒ prefix sums, not windows. Exactly k ⇒ atMost(k) − atMost(k − 1).</li>
<li>Fixed-window rate limiters let up to 2× the limit through at the edge; sliding log/counter fix it at a memory or accuracy cost.</li>
</ul>
${nguon('☁️', 'Cloudflare — Counting things, a lot of different things', 'The sliding window counter used for rate limiting at scale, with the error analysis', 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/')}
${nguon('📦', 'express-rate-limit (GitHub)', 'The middleware behind src/middleware/orderRateLimit.ts: options, stores, headers', 'https://github.com/express-rate-limit/express-rate-limit')}
${nguon('🌐', 'MDN — 429 Too Many Requests', 'The status code a rate limiter answers with, and the Retry-After header', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết lại khuôn cửa sổ co giãn từ trí nhớ (mở rộng, sửa, ghi nhận) và dùng nó giải LC 3 bằng Set. Thử <code>"abba"</code>, <code>"tmmzuxt"</code>, <code>""</code>, <code>" "</code>.</li>
<li>Đổi sang bản nhảy, xoá <code>max</code>, xác nhận <code>"tmmzuxt"</code> trả về 6. Rồi trả <code>max</code> lại.</li>
<li>Giải LC 209 và LC 904. Cạnh mỗi đề ghi bạn dùng biến thể nào (dài nhất/ngắn nhất) và ghi nhận ở đâu.</li>
<li>Thêm: trong tệp rate limiter, thêm bộ thứ năm "3 lần mỗi giây <em>và</em> 10 lần mỗi phút" rồi chạy lại kịch bản B. Giờ lọt được bao nhiêu?</li>
</ol>
<p><strong>Đạt khi:</strong> LC 3, LC 209, LC 904 Accepted; tái hiện và sửa được lỗi 6 → 5; mỗi đề có một câu gọi tên biến thể.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sliding window (cửa sổ trượt)</span><span class="v">Một đoạn liên tiếp [l, r] được cập nhật dần khi hai con trỏ tiến lên.</span></div>
  <div class="kv"><span class="k">fixed / variable window (cửa sổ cố định / co giãn)</span><span class="v">Luôn dài k, hoặc nới và co để giữ một bất biến.</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Tính chất cửa sổ luôn giữ sau mỗi lần sửa ("không lặp", "≤ k loại").</span></div>
  <div class="kv"><span class="k">amortised O(n) (O(n) khấu hao)</span><span class="v">Vòng while bên trong chạy tổng cộng tối đa n lần, vì l chỉ tiến.</span></div>
  <div class="kv"><span class="k">at most k ⇒ exactly k (tối đa k ⇒ đúng k)</span><span class="v">đúng(k) = tốiĐa(k) − tốiĐa(k − 1) trong các bài đếm.</span></div>
  <div class="kv"><span class="k">rate limiter (bộ giới hạn tốc độ)</span><span class="v">Cho tối đa N request mỗi khoảng thời gian cho mỗi khoá.</span></div>
  <div class="kv"><span class="k">fixed window / sliding log / sliding counter</span><span class="v">Reset theo ô (rẻ, dồn được ở mép) / lưu đúng mốc thời gian (chính xác, tốn bộ nhớ) / hai ô có trọng số (rẻ, xấp xỉ).</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>"Liên tiếp" + dài nhất/ngắn nhất/đếm ⇒ thử cửa sổ trước.</li>
<li>Cửa sổ cố định: một vào, một ra, O(1) mỗi bước.</li>
<li>Cửa sổ co giãn: tăng r; dài nhất ⇒ co khi vi phạm, ghi nhận sau; ngắn nhất ⇒ co khi còn hợp lệ, ghi nhận bên trong.</li>
<li>Con trỏ trái không bao giờ lùi (<code>max(l, last + 1)</code>) — đó vừa là chứng minh O(n) vừa là chứng minh đúng.</li>
<li>Số âm + điều kiện về tổng ⇒ tổng tiền tố, không phải cửa sổ. Đúng k ⇒ atMost(k) − atMost(k − 1).</li>
<li>Rate limiter cửa sổ cố định cho lọt tới gấp đôi hạn mức ở mép; sliding log/counter sửa được, đổi lại tốn bộ nhớ hoặc mất độ chính xác.</li>
</ul>
${nguon('☁️', 'Cloudflare — Counting things, a lot of different things', 'Bộ đếm cửa sổ trượt dùng để giới hạn tốc độ ở quy mô lớn, kèm phân tích sai số (tiếng Anh)', 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/')}
${nguon('📦', 'express-rate-limit (GitHub)', 'Middleware đứng sau src/middleware/orderRateLimit.ts: tuỳ chọn, kho lưu, header', 'https://github.com/express-rate-limit/express-rate-limit')}
${nguon('🌐', 'MDN — 429 Too Many Requests', 'Mã trạng thái mà bộ giới hạn trả về, và header Retry-After', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429')}
</div>
`,
};
