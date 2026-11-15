/** 10.2 — Code sạch dưới áp lực. Mọi mã/output đọc từ ../ma/ch10/b2 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay, esc, doc } from '../_chung.mjs';
import { vetSummary } from '../ma/ch10/b2/summary-ranges.vet.mjs';

/* ── Bảng vết bản sạch ───────────────────────────────────────────────────────────────────────────────── */
const NUMS = [-3, -2, -1, 4, 6, 7, 8, 10];
const VET = vetSummary(NUMS);
const BANG = bangVet(['run', 'nums', 'extend with', 'stops because', 'ranges so far'],
  VET.map((h, k) => [
    String(k + 1),
    oMang(NUMS, { tu: h.start, den: h.end, to: { [h.start]: 'l', [h.end]: 'r' }, chiSo: true }),
    h.buoc.length ? h.buoc.join(', ') : '—',
    esc(h.dung),
    `<code>${esc(JSON.stringify(h.out))}</code>`,
  ]));

/* ── Số đo hàm phụ: chữ ĐỌC số từ .out (đo lại thì chữ tự khớp) ─────────────────────────────────────── */
function bangDo(rel) {
  return doc(`${rel}.out`).split('\n').filter((l) => l.includes('|')).slice(1).map((l) => {
    const o = l.split('|').map((s) => s.trim());
    return { n: Number(o[0].replace(/,/g, '')), v: o.slice(1).map((x) => parseFloat(x)) };
  });
}
const so = (x, d, lang) => Number(x).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const DO_TS = bangDo('ch10/b2/ham-phu-do.ts');
const DO_JAVA = bangDo('ch10/b2/HamPhuDo.java');
const lon = (b) => b[b.length - 1].v;           // hàng 10⁷ ô: [inline, helper, DIRECTIONS]
const nho = (b) => b[0].v;                      // hàng 10⁵ ô
const TL = (b, k) => lon(b)[k] / lon(b)[0];      // tỉ lệ so với inline ở 10⁷ ô
const tang = (b, k) => b[b.length - 1].v[k] / b[b.length - 2].v[k];   // 10⁶ → 10⁷
const MAX_NHO = Math.max(...nho(DO_TS), ...nho(DO_JAVA));
const NS_JAVA = (lon(DO_JAVA)[0] * 1e6) / 1e7;   // ns mỗi ô, bản inline Java
function camNhan(r, lang) {
  if (r < 1.2) return lang === 'en' ? 'practically the same' : 'gần như bằng nhau';
  return lang === 'en' ? `×${so(r, 1, 'en')} slower` : `chậm hơn ×${so(r, 1, 'vi')}`;
}

const DE = [
  [lc(228, 'summary-ranges', 'Summary Ranges', 'Easy'), 'The worked example. Write the clean version from memory: one loop, two helpers, no duplicated "close the range" block.', 'Đề giải mẫu. Viết lại bản sạch từ trí nhớ: một vòng lặp, hai hàm phụ, không lặp khối "đóng dải".'],
  [lc(13, 'roman-to-integer', 'Roman to Integer', 'Easy'), 'A named lookup table (VALUES) instead of a 7-branch if-chain; one rule for subtraction.', 'Một bảng tra có tên (VALUES) thay cho chuỗi if 7 nhánh; một quy tắc duy nhất cho phép trừ.'],
  [lc(36, 'valid-sudoku', 'Valid Sudoku', 'Medium'), 'Named constants SIZE/BOX, a boxIndex helper, return false at the first clash.', 'Hằng số có tên SIZE/BOX, hàm phụ boxIndex, gặp trùng đầu tiên là trả false.'],
  [lc(443, 'string-compression', 'String Compression', 'Medium'), 'Same "grow a run, then close it" shape as Summary Ranges — and the same duplicated-tail trap.', 'Cùng dáng "nới dải rồi đóng dải" như Summary Ranges — và cùng cái bẫy lặp đoạn cuối.'],
  [lc(54, 'spiral-matrix', 'Spiral Matrix', 'Medium'), 'Four boundaries with names (top, bottom, left, right) beat four index variables called i, j, k, l.', 'Bốn biên có tên (top, bottom, left, right) thắng bốn biến chỉ số tên i, j, k, l.'],
  [lc(289, 'game-of-life', 'Game of Life', 'Medium'), 'A DIRECTIONS constant + inBounds helper; ask before mutating the board in place.', 'Hằng DIRECTIONS + hàm phụ inBounds; hỏi trước khi sửa thẳng lên bàn cờ đầu vào.'],
  [lc(8, 'string-to-integer-atoi', 'String to Integer (atoi)', 'Medium'), 'A pipeline of small steps (skip spaces → sign → digits → clamp) with early returns; overflow handled in one place.', 'Một dây chuyền bước nhỏ (bỏ khoảng trắng → dấu → chữ số → kẹp biên) với early return; tràn số xử lý ở một chỗ.'],
  [lc(68, 'text-justification', 'Text Justification', 'Hard'), 'Impossible to finish in 40 minutes without helpers: takeLine, justifyLine, padRight.', 'Không thể xong trong 40 phút nếu không có hàm phụ: takeLine, justifyLine, padRight.'],
];

export default {
  title: '10.2 — Clean code under pressure|||10.2 — Code sạch dưới áp lực',
  slug: 'dsa-10-2-code-sach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một lời giải viết "bẩn" và viết sạch (TS + Java chạy thật), năm công cụ giữ code dễ đọc khi bị nhìn — tên, hàm phụ, early return, hằng số có tên, không tối ưu sớm — kèm số đo hàm phụ, bảng thói quen Java/TS bị trừ điểm có demo, và lỗi "goto fail".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Clean code under pressure</h2>
<p class="lead">Two candidates reach the same O(n) idea. One writes thirty lines of <code>x1</code>, <code>x2</code>, <code>tmp</code> and three levels of <code>if</code>; the other writes fifteen lines that read like the sentence she said a minute ago. Both pass the examples — and they do not get the same score. This lesson shows you, on one real problem in both languages, what "clean" means in a 45-minute interview (it is not the same as in a textbook), gives you five tools you can use while someone watches you type, measures whether helper functions cost anything, and lists the Java/TypeScript habits that quietly lose points.</p>

<h3>The everyday picture: a recipe someone else must cook from</h3>
<p>Imagine you write your mother's phở recipe for a friend. Version one: "boil the thing with the other thing, add some, then the same as before but less, until it looks right." Version two: "<em>Make the broth</em> (step 2). <em>Char the onion and ginger</em> (step 3). Add 40 g of rock sugar. Simmer 3 hours." The second one has <strong>named steps</strong> you can refer to (helper functions), <strong>named quantities</strong> instead of "some" (named constants), and it stops early when something is wrong ("if the bones smell sour, throw them away" — a guard clause). The friend cooks the same dish either way, but only one recipe can be checked, corrected and handed on. An interviewer reading your code is that friend, reading while you are still writing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Code sạch dưới áp lực</h2>
<p class="lead">Hai ứng viên cùng tới được ý tưởng O(n). Một người viết ba mươi dòng toàn <code>x1</code>, <code>x2</code>, <code>tmp</code> và ba tầng <code>if</code> lồng nhau; người kia viết mười lăm dòng đọc lên giống hệt câu cô ấy vừa nói một phút trước. Cả hai đều chạy đúng ví dụ — và hai người KHÔNG được cùng một số điểm. Bài này cho bạn thấy, trên một đề thật bằng cả hai ngôn ngữ, "sạch" trong buổi phỏng vấn 45 phút nghĩa là gì (không giống sách giáo khoa), đưa bạn năm công cụ dùng được ngay cả khi có người đang nhìn bạn gõ, đo xem hàm phụ có làm chậm gì không, và liệt kê những thói quen Java/TypeScript âm thầm làm bạn mất điểm.</p>

<h3>Hình dung đời thường: công thức nấu ăn cho người khác nấu</h3>
<p>Bạn chép công thức phở của mẹ cho một người bạn. Bản một: "đun cái đó với cái kia, cho một ít, rồi làm giống lúc nãy nhưng ít hơn, tới khi thấy được." Bản hai: "<em>Ninh nước dùng</em> (bước 2). <em>Nướng hành, gừng</em> (bước 3). Cho 40 g đường phèn. Ninh 3 tiếng." Bản hai có <strong>bước có tên</strong> để tham chiếu (hàm phụ — helper function), có <strong>lượng có tên</strong> thay cho "một ít" (hằng số có tên — named constant), và biết dừng sớm khi có gì sai ("xương có mùi chua thì bỏ" — điều kiện chặn đầu, guard clause). Bạn của bạn nấu ra cùng một nồi phở theo bản nào cũng được, nhưng chỉ một bản là kiểm tra được, sửa được và đưa cho người khác được. Người phỏng vấn đọc code của bạn chính là người bạn đó — và họ đọc trong lúc bạn còn đang viết.</p>
<p>Ở trường bạn đã gặp đúng cảm giác này: tới lượt sửa đồ án SWP391 hay PRJ301, mở tệp servlet của bạn cùng nhóm thấy một hàm <code>doPost</code> 200 dòng với biến <code>a</code>, <code>b</code>, <code>list2</code> và năm tầng <code>if</code>. Bạn mất cả buổi tối chỉ để hiểu nó đang làm gì, chưa nói tới sửa. Người phỏng vấn có 45 phút và phải viết nhận xét về bạn sau đó — họ không có buổi tối nào cho code khó đọc.</p>
</div>

<div class="ml-en">
<h3>What "technical competency" actually scores</h3>
<p>Lesson 0.8 listed the four axes of the rubric; code quality lives in the third, <em>technical competency</em>. Interviewers do not grade style the way a linter does. They ask themselves a handful of concrete questions while you type:</p>
<table>
<thead><tr><th>They notice</th><th>What it tells them</th><th>Cheap fix</th></tr></thead>
<tbody>
<tr><td>Names: <code>x1</code>, <code>a</code>, <code>flag</code> vs <code>start</code>, <code>ranges</code>, <code>found</code></td><td>Whether you can explain your own state</td><td>Name variables after the role they play in the sentence you said</td></tr>
<tr><td>The same five lines appearing twice</td><td>A bug fixed in one copy stays in the other</td><td>Move them into a helper</td></tr>
<tr><td>Nesting depth of three or more</td><td>Hard to see which branch handles which case</td><td>Guard clauses and early <code>return</code> / <code>continue</code></td></tr>
<tr><td>Bare numbers: <code>9</code>, <code>3</code>, <code>26</code>, <code>1000000007</code></td><td>The reader has to guess what they mean</td><td>One line of <code>const SIZE = 9</code></td></tr>
<tr><td>Fluency in the language</td><td>Whether you will slow the team down</td><td>Know the traps in the table later in this lesson</td></tr>
<tr><td>Code that matches your plan</td><td>Whether your thinking and your typing are connected</td><td>Write the skeleton first, then fill in helpers</td></tr>
</tbody></table>
<p>Notice what is <em>not</em> on the list: comments on every line, design patterns, classes and interfaces, or clever one-liners. In 45 minutes, clean means <strong>easy to follow while being written</strong>.</p>
</div>
<div class="ml-vi">
<h3>Trục "năng lực kỹ thuật" thật ra chấm gì</h3>
<p>Bài 0.8 đã liệt kê bốn trục của bảng chấm; chất lượng code nằm ở trục thứ ba, <em>technical competency</em> (năng lực kỹ thuật). Người phỏng vấn không chấm phong cách như một công cụ lint. Trong lúc bạn gõ, họ tự hỏi vài câu rất cụ thể:</p>
<table>
<thead><tr><th>Họ để ý</th><th>Điều đó cho họ biết</th><th>Cách sửa rẻ</th></tr></thead>
<tbody>
<tr><td>Tên biến: <code>x1</code>, <code>a</code>, <code>flag</code> so với <code>start</code>, <code>ranges</code>, <code>found</code></td><td>Bạn có giải thích nổi trạng thái của chính mình không</td><td>Đặt tên theo VAI TRÒ của biến trong câu bạn vừa nói</td></tr>
<tr><td>Cùng năm dòng xuất hiện hai lần</td><td>Sửa lỗi ở bản này thì bản kia vẫn còn lỗi</td><td>Dời chúng vào một hàm phụ</td></tr>
<tr><td>Lồng từ ba tầng trở lên</td><td>Khó thấy nhánh nào lo trường hợp nào</td><td>Điều kiện chặn đầu (guard clause), <code>return</code> / <code>continue</code> sớm</td></tr>
<tr><td>Con số trần: <code>9</code>, <code>3</code>, <code>26</code>, <code>1000000007</code></td><td>Người đọc phải đoán nghĩa (gọi là "số ma thuật" — magic number)</td><td>Một dòng <code>const SIZE = 9</code></td></tr>
<tr><td>Độ thạo ngôn ngữ</td><td>Bạn có làm chậm cả nhóm không</td><td>Thuộc các bẫy trong bảng ở cuối bài</td></tr>
<tr><td>Code khớp với kế hoạch đã nói</td><td>Suy nghĩ và ngón tay của bạn có nối với nhau không</td><td>Viết khung hàm trước, điền hàm phụ sau</td></tr>
</tbody></table>
<p>Để ý những thứ KHÔNG có trong danh sách: chú thích ở mọi dòng, mẫu thiết kế (design pattern), lớp và interface, hay câu lệnh một dòng "thông minh". Trong 45 phút, sạch nghĩa là <strong>dễ theo dõi ngay trong lúc đang được viết</strong>.</p>
</div>

<div class="ml-en">
<h3>Worked example: Summary Ranges, written twice</h3>
<p><strong>Problem (in our words).</strong> You get a sorted array of distinct integers. Describe it as a list of ranges: a run of consecutive numbers <code>a, a+1, …, b</code> becomes <code>"a-&gt;b"</code>, a lonely number becomes <code>"a"</code>. Example: <code>[0, 1, 2, 4, 5, 7]</code> → <code>["0-&gt;2", "4-&gt;5", "7"]</code>. This is the shape of the "page ranges" box in a print dialog (<em>1-3, 5, 8-9</em>) and of a timetable that groups consecutive slots.</p>
<p>Below is the version that comes out when you are nervous and typing as you think. It is <strong>correct on every non-empty example</strong>. Read it once and try to say, in one sentence, what <code>x2</code> means.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Summary Ranges, viết hai lần</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho một mảng số nguyên đã sắp xếp tăng, không trùng. Mô tả nó thành danh sách các dải: một dãy số liên tiếp <code>a, a+1, …, b</code> thành <code>"a-&gt;b"</code>, một số đứng lẻ thành <code>"a"</code>. Ví dụ: <code>[0, 1, 2, 4, 5, 7]</code> → <code>["0-&gt;2", "4-&gt;5", "7"]</code>. Đây chính là ô "chọn trang" trong hộp thoại in (<em>1-3, 5, 8-9</em>), hay lịch học gom các tiết liền nhau thành một khối.</p>
<p>Dưới đây là phiên bản tuôn ra khi bạn đang run và vừa nghĩ vừa gõ. Nó <strong>đúng với mọi ví dụ không rỗng</strong>. Đọc một lượt và thử nói trong một câu: <code>x2</code> nghĩa là gì?</p>
</div>
${maHai('ch10/b2/summary-ranges.ts', 'ch10/b2/SummaryRanges.java', { vung: 'ban' })}
<div class="ml-en">
<p>What a reader trips over: the function is called <code>f</code>; <code>x1</code>/<code>x2</code> are "start/end of the current run" but you only learn that by simulating; the four-line "if equal print one number, otherwise print a range" block appears <strong>twice</strong> — once inside the loop, once after it, because the last run has no next number to trigger it; the outer <code>if</code> hides an inner <code>if/else</code>; <code>!=</code> and <code>==</code> instead of <code>!==</code>/<code>===</code> in TypeScript; <code>let r</code> for something never reassigned. None of these is a bug on the examples. One of them <em>is</em> a bug on an input nobody tried:</p>
</div>
<div class="ml-vi">
<p>Những chỗ người đọc vấp: hàm tên <code>f</code>; <code>x1</code>/<code>x2</code> là "đầu/cuối của dải hiện tại" nhưng phải tự chạy tay mới biết; khối bốn dòng "bằng nhau thì in một số, không thì in một dải" xuất hiện <strong>hai lần</strong> — một lần trong vòng lặp, một lần sau vòng, vì dải cuối cùng không có "số tiếp theo" nào để kích hoạt nó; <code>if</code> ngoài giấu một <code>if/else</code> trong; TypeScript dùng <code>!=</code> và <code>==</code> thay vì <code>!==</code>/<code>===</code>; <code>let r</code> cho thứ không bao giờ gán lại. Không chỗ nào trong số đó là lỗi với các ví dụ. Nhưng có MỘT chỗ là lỗi thật với một đầu vào chưa ai thử:</p>
</div>
${ma('ch10/b2/ban-rong.ts', { vung: 'chay', nhan: 'TypeScript — the dirty f on []' })}
${ketQua('ch10/b2/ban-rong.ts')}
${ketQua('ch10/b2/BanRong.java')}
<div class="ml-en">
<p>The empty array. The duplicated block after the loop runs unconditionally, so TypeScript happily returns the <em>string</em> <code>"undefined"</code> as a range, and Java crashes on <code>a[0]</code> before the loop even starts. This is the real argument for clean code in an interview: <strong>duplicated code is where edge-case bugs hide</strong>, because the second copy was written to patch a symptom ("the last range is missing"), not to express the rule. Now the clean version — the same algorithm, same complexity:</p>
</div>
<div class="ml-vi">
<p>Mảng rỗng. Khối lặp lại sau vòng lặp chạy vô điều kiện, nên TypeScript vui vẻ trả về <em>chuỗi</em> <code>"undefined"</code> như một dải, còn Java sập ngay ở <code>a[0]</code> trước cả khi vào vòng lặp. Đây mới là lý lẽ thật cho code sạch khi phỏng vấn: <strong>code lặp lại là chỗ lỗi trường hợp biên ẩn náu</strong>, vì bản sao thứ hai được viết để vá một triệu chứng ("thiếu dải cuối"), chứ không phải để diễn đạt quy tắc. Giờ là bản sạch — cùng thuật toán, cùng độ phức tạp:</p>
</div>
${maHai('ch10/b2/summary-ranges.ts', 'ch10/b2/SummaryRanges.java', { vung: 'sach' })}
${ketQua('ch10/b2/summary-ranges.ts')}
${ketQua('ch10/b2/SummaryRanges.java')}
<div class="ml-en">
<p>Both programs run the dirty and the clean function on the same five inputs; "same" on every line means the refactor changed nothing on them, and the last line shows the clean version returning <code>[]</code> for the empty array without any special case. What changed, line by line:</p>
<ul>
<li><strong>The loop says the plan.</strong> "While there are numbers left: find where this run ends, record it, jump past it." That is exactly the sentence you say to the interviewer, and the code has the same three verbs.</li>
<li><strong><code>extendRun</code></strong> holds the only subtle condition, <code>end + 1 &lt; nums.length &amp;&amp; nums[end + 1] === nums[end] + 1</code>. The bounds check comes first so we never read past the end; in a helper with a doc comment, it can be checked on its own.</li>
<li><strong><code>formatRange</code></strong> is the four-line block that used to appear twice. Now it exists once — fix it once, test it once.</li>
<li><strong>No special case for empty input.</strong> The guard is the <code>while</code> condition itself: with zero numbers the body never runs. Good structure often deletes edge cases instead of handling them.</li>
<li><strong><code>const</code> everywhere it can be</strong> (TS), and <code>start = end + 1</code> makes it obvious that every index is visited once.</li>
</ul>
</div>
<div class="ml-vi">
<p>Cả hai chương trình chạy hàm bẩn và hàm sạch trên cùng năm đầu vào; chữ "same" ở mọi dòng nghĩa là việc dọn code (refactor — tái cấu trúc) không đổi kết quả nào, và dòng cuối cho thấy bản sạch trả <code>[]</code> với mảng rỗng mà không cần một trường hợp đặc biệt nào. Thay đổi từng dòng:</p>
<ul>
<li><strong>Vòng lặp nói ra kế hoạch.</strong> "Còn số thì: tìm chỗ dải này kết thúc, ghi lại, nhảy qua nó." Đó đúng là câu bạn nói với người phỏng vấn, và code có đúng ba động từ đó.</li>
<li><strong><code>extendRun</code></strong> (nới dải) chứa điều kiện tinh tế duy nhất, <code>end + 1 &lt; nums.length &amp;&amp; nums[end + 1] === nums[end] + 1</code>. Kiểm biên đứng trước nên không bao giờ đọc lố cuối mảng; nằm trong một hàm phụ có một dòng mô tả, nó kiểm tra được riêng.</li>
<li><strong><code>formatRange</code></strong> (định dạng dải) chính là khối bốn dòng từng xuất hiện hai lần. Giờ nó tồn tại đúng một lần — sửa một lần, test một lần.</li>
<li><strong>Không có trường hợp đặc biệt cho đầu vào rỗng.</strong> Phép chặn chính là điều kiện của <code>while</code>: không có số nào thì thân vòng không chạy. Cấu trúc tốt thường XOÁ được trường hợp biên thay vì phải xử lý nó.</li>
<li><strong><code>const</code> ở mọi chỗ có thể</strong> (TS), và <code>start = end + 1</code> cho thấy ngay mỗi chỉ số chỉ được ghé một lần.</li>
</ul>
</div>

<div class="ml-en">
<h3>Watch it run: one row per range</h3>
<p>Input <code>[-3, -2, -1, 4, 6, 7, 8, 10]</code>. Blue = <code>start</code>, orange = <code>end</code> after <code>extendRun</code>, green = the run being closed. The table is produced by running the clean algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: mỗi dải một hàng</h3>
<p>Đầu vào <code>[-3, -2, -1, 4, 6, 7, 8, 10]</code>. Xanh dương = <code>start</code>, cam = <code>end</code> sau khi <code>extendRun</code> trả về, xanh lá = dải đang được đóng. Bảng sinh ra bằng cách chạy thật thuật toán bản sạch.</p>
</div>
${BANG}
<div class="ml-en">
<p>Four rows for four ranges. Rows 2 and 4 are the "lonely number" case: <code>extendRun</code> returns <code>start</code> itself and <code>formatRange</code> prints one number. Row 4 stops because of "end of array" — the case the dirty version needed a copy-pasted block for; here it is just the <code>end + 1 &lt; nums.length</code> half of the same condition. Add the column "extend with" over all rows: every index is touched exactly once by either <code>start</code> or <code>end</code>, so the time is <strong>O(n)</strong> and the extra memory is <strong>O(1)</strong> besides the output.</p>
${moPhong('ch10/b2/summary-ranges.sim.js', 'en', 'Summary Ranges (clean) — grow a run, close it', 'Watch start and end move; each closed run lights up, the log shows why it stopped.')}
</div>
<div class="ml-vi">
<p>Bốn hàng cho bốn dải. Hàng 2 và 4 là trường hợp "số đứng lẻ": <code>extendRun</code> trả về chính <code>start</code> và <code>formatRange</code> in một số. Hàng 4 dừng vì "end of array" (hết mảng) — đúng trường hợp mà bản bẩn phải chép thêm một khối; ở đây nó chỉ là nửa <code>end + 1 &lt; nums.length</code> của cùng một điều kiện. Cộng cột "extend with" qua mọi hàng: mỗi chỉ số bị <code>start</code> hoặc <code>end</code> chạm đúng một lần, nên thời gian <strong>O(n)</strong> và bộ nhớ phụ <strong>O(1)</strong> ngoài kết quả trả về.</p>
${moPhong('ch10/b2/summary-ranges.sim.js', 'vi', 'Summary Ranges (bản sạch) — nới dải rồi đóng dải', 'Xem start và end di chuyển; dải vừa đóng sáng lên, nhật ký giải thích vì sao dừng.')}
</div>

<div class="ml-en">
<h3>Five tools you can use while someone watches</h3>
<p><strong>1. Names that say the role.</strong> Choose the name from the sentence you said out loud: "the start of the current run" → <code>start</code>; "the ranges I have built" → <code>ranges</code>; "seen digits" → <code>seen</code>. Loop indices <code>i</code>, <code>j</code> are fine when they are plain positions; once a variable has a <em>meaning</em> (left edge of a window, cheapest price so far), give it that name. Naming while watched is hard, so use a short default list: <code>start/end</code>, <code>left/right</code>, <code>lo/hi</code>, <code>count</code>, <code>seen</code>, <code>best</code>, <code>result</code>.</p>
<p><strong>2. One helper per idea.</strong> A helper is worth it when (a) a block appears twice, or (b) a block has a name in your explanation ("extend the run", "the box index", "is this cell inside the grid"). Helpers also let you test one piece in isolation and let the interviewer follow your plan at the top level.</p>
<p><strong>3. Guard clauses and early return.</strong> Handle the "nothing to do" and "already decided" cases first and leave: <code>if (digit === EMPTY) continue;</code> and <code>return false</code> at the first clash. The rest of the function then lives at one indentation level.</p>
<p><strong>4. Named constants.</strong> <code>SIZE = 9</code>, <code>BOX = 3</code>, <code>ALPHABET = 26</code>, <code>MOD = 1_000_000_007</code>, <code>DIRECTIONS = [[-1,0],[1,0],[0,-1],[0,1]]</code>. One line each, and the interviewer never asks "what is this 3?".</p>
<p><strong>5. No premature optimisation.</strong> Make it correct and readable first; optimise only what you measured or what the constraints demand. The next two sections show tools 3–4 in a real solution, and then measure tool 2.</p>
</div>
<div class="ml-vi">
<h3>Năm công cụ dùng được ngay cả khi bị nhìn</h3>
<p><strong>1. Tên nói ra vai trò.</strong> Chọn tên từ chính câu bạn vừa nói to: "điểm bắt đầu của dải hiện tại" → <code>start</code>; "các dải đã dựng" → <code>ranges</code>; "các chữ số đã gặp" → <code>seen</code>. Chỉ số vòng lặp <code>i</code>, <code>j</code> vẫn ổn khi chúng chỉ là vị trí; khi một biến có <em>ý nghĩa</em> (mép trái cửa sổ, giá rẻ nhất tới giờ) thì đặt đúng tên ý nghĩa đó. Đặt tên khi bị nhìn rất khó, nên hãy thuộc sẵn một danh sách ngắn: <code>start/end</code>, <code>left/right</code>, <code>lo/hi</code>, <code>count</code>, <code>seen</code>, <code>best</code>, <code>result</code>.</p>
<p><strong>2. Mỗi ý một hàm phụ.</strong> Một hàm phụ đáng viết khi (a) một khối xuất hiện hai lần, hoặc (b) một khối đã có tên trong lời giải thích của bạn ("nới dải", "chỉ số ô 3×3", "ô này có nằm trong lưới không"). Hàm phụ còn cho bạn test riêng từng mảnh và cho người phỏng vấn theo dõi kế hoạch của bạn ở tầng trên cùng.</p>
<p><strong>3. Điều kiện chặn đầu và return sớm.</strong> Xử lý trước các trường hợp "không có gì để làm" và "đã có đáp án" rồi thoát: <code>if (digit === EMPTY) continue;</code> và <code>return false</code> ngay ở lần trùng đầu tiên. Phần còn lại của hàm nằm gọn ở một mức thụt lề.</p>
<p><strong>4. Hằng số có tên.</strong> <code>SIZE = 9</code>, <code>BOX = 3</code>, <code>ALPHABET = 26</code>, <code>MOD = 1_000_000_007</code>, <code>DIRECTIONS = [[-1,0],[1,0],[0,-1],[0,1]]</code> (bốn hướng). Mỗi cái một dòng, và người phỏng vấn không bao giờ phải hỏi "số 3 này là gì?".</p>
<p><strong>5. Không tối ưu sớm (premature optimisation).</strong> Làm cho đúng và dễ đọc trước; chỉ tối ưu thứ đã đo hoặc thứ ràng buộc của đề bắt buộc. Hai mục sau cho thấy công cụ 3–4 trong một lời giải thật, rồi đo công cụ 2.</p>
</div>

<div class="ml-en">
<h3>Tools 3 and 4 together: Valid Sudoku</h3>
<p>Check whether a partly filled 9×9 board breaks a rule: no digit twice in a row, a column or a 3×3 box. The usual first draft has three near-identical double loops (rows, columns, boxes) full of <code>9</code> and <code>3</code>. The version below does one pass, names its numbers, puts the only formula in a helper, and returns at the first clash. In Java it also uses a fact from lesson 1.1: <code>Set.add</code> returns <code>false</code> when the element was already there, so "check" and "insert" are one call.</p>
</div>
<div class="ml-vi">
<h3>Công cụ 3 và 4 cùng lúc: Valid Sudoku</h3>
<p>Kiểm tra một bàn 9×9 điền dở có phạm luật không: không chữ số nào lặp trong một hàng, một cột hay một ô 3×3. Bản nháp đầu tiên thường có ba cặp vòng lặp gần giống hệt nhau (hàng, cột, ô) đầy số <code>9</code> và <code>3</code>. Bản dưới đây đi một lượt, đặt tên cho các con số, gói công thức duy nhất vào một hàm phụ, và trả về ngay ở lần trùng đầu tiên. Bản Java còn dùng một sự thật từ bài 1.1: <code>Set.add</code> trả về <code>false</code> khi phần tử đã có, nên "kiểm" và "cất" là một lời gọi.</p>
</div>
${maHai('ch10/b2/valid-sudoku.ts', 'ch10/b2/ValidSudoku.java', { vung: 'sach' })}
${ketQua('ch10/b2/valid-sudoku.ts')}
${ketQua('ch10/b2/ValidSudoku.java')}
<div class="ml-en">
<p>The two invalid boards differ from the valid one in exactly one cell: a second 9 inside the top-left box only (no row or column clash), and a second 5 inside column 0 only. Testing each rule with a board that breaks <em>only</em> that rule is a habit from <a href="${baiNay('dsa-10-3-test')}">lesson 10.3</a>. And <code>boxIndex(4, 7) = 5</code>: row 4 is in the middle band (4 / 3 = 1), column 7 in the right stack (7 / 3 = 2), so 1·3 + 2 = 5 — the kind of formula that deserves its own name.</p>
</div>
<div class="ml-vi">
<p>Hai bàn sai khác bàn đúng đúng một ô: thêm một số 9 nằm trong ô 3×3 góc trên trái mà không trùng hàng hay cột nào, và thêm một số 5 chỉ trùng ở cột 0. Test mỗi luật bằng một bàn CHỈ phạm đúng luật đó là thói quen của <a href="${baiNay('dsa-10-3-test')}">bài 10.3</a>. Còn <code>boxIndex(4, 7) = 5</code>: hàng 4 thuộc dải giữa (4 / 3 = 1), cột 7 thuộc chồng bên phải (7 / 3 = 2), nên 1·3 + 2 = 5 — đúng loại công thức đáng có tên riêng.</p>
</div>

<div class="ml-en">
<h3>Do helper functions slow you down? Measured</h3>
<p>Many students avoid helpers in contests "because a function call costs time". Let us measure instead of believing. For every cell of a grid (1,000 columns), count the neighbours inside the grid in three ways that make <em>exactly the same comparisons</em>: the bounds check copy-pasted four times (<em>inline</em>), the same four checks each calling <code>inBounds()</code> (<em>helper</em>), and <code>inBounds()</code> inside a loop over a <code>DIRECTIONS</code> constant — the version most people write in a BFS.</p>
</div>
<div class="ml-vi">
<h3>Hàm phụ có làm chậm không? Đo thật</h3>
<p>Nhiều bạn né hàm phụ khi thi "vì gọi hàm tốn thời gian". Thay vì tin, ta đo. Với mỗi ô của một lưới (1.000 cột), đếm số ô kề nằm trong lưới theo ba cách thực hiện <em>đúng cùng những phép so sánh</em>: phép kiểm biên chép-dán bốn lần (<em>inline</em> — viết thẳng), cùng bốn phép kiểm đó nhưng mỗi phép gọi <code>inBounds()</code> (<em>helper</em>), và <code>inBounds()</code> trong một vòng lặp qua hằng <code>DIRECTIONS</code> — bản mà hầu hết mọi người viết khi làm BFS trên lưới.</p>
</div>
${ma('ch10/b2/ham-phu-do.ts', { vung: 'helper', nhan: 'TypeScript — helper version' })}
${ma('ch10/b2/ham-phu-do.ts', { vung: 'huong', nhan: 'TypeScript — DIRECTIONS version' })}
${ketQua('ch10/b2/ham-phu-do.ts')}
${ketQua('ch10/b2/HamPhuDo.java')}
<div class="ml-en">
<p>Read it like an engineer. In Node, at 10 million cells, the helper version takes ${so(lon(DO_TS)[1], 2, 'en')} ms against ${so(lon(DO_TS)[0], 2, 'en')} ms for the copy-pasted one — ${camNhan(TL(DO_TS, 1), 'en')}: V8 <em>inlines</em> a tiny function, so the call disappears. The DIRECTIONS loop is ×${so(TL(DO_TS, 2), 1, 'en')}, because each step now reads a pair from an array of arrays. In Java the helper is ×${so(TL(DO_JAVA, 1), 1, 'en')} and DIRECTIONS ×${so(TL(DO_JAVA, 2), 1, 'en')} — but look at the inline column: ${so(NS_JAVA, 2, 'en')} ns per cell, about one clock cycle, which means the JIT reduced the copy-pasted version to almost nothing; that is the micro-benchmark being clever, not the helper being slow.</p>
<p>Three conclusions you can say in an interview. (1) <strong>The shape is the same</strong>: from 1 to 10 million cells every column grows about ×10 (DIRECTIONS in Node: ×${so(tang(DO_TS, 2), 1, 'en')}) — helpers never change Big-O. (2) <strong>At interview sizes nobody can tell</strong>: a LeetCode grid is at most around 300×300 ≈ 10⁵ cells, where the slowest column here is ${so(MAX_NHO, 2, 'en')} ms. (3) <strong>If it ever matters, measure first</strong>, then unroll the one hot loop — exactly what "no premature optimisation" means. Write <code>DIRECTIONS</code>; it prevents the classic bug of a mistyped fourth direction.</p>
</div>
<div class="ml-vi">
<p>Đọc như một kỹ sư. Trên Node, ở 10 triệu ô, bản helper mất ${so(lon(DO_TS)[1], 2, 'vi')} ms so với ${so(lon(DO_TS)[0], 2, 'vi')} ms của bản chép-dán — ${camNhan(TL(DO_TS, 1), 'vi')}: V8 <em>inline</em> (nhét thẳng thân hàm vào chỗ gọi) một hàm nhỏ như vậy, nên lời gọi biến mất. Vòng DIRECTIONS chậm ×${so(TL(DO_TS, 2), 1, 'vi')}, vì mỗi bước giờ phải đọc một cặp số từ một mảng các mảng. Trên Java, helper ×${so(TL(DO_JAVA, 1), 1, 'vi')} và DIRECTIONS ×${so(TL(DO_JAVA, 2), 1, 'vi')} — nhưng nhìn cột inline: ${so(NS_JAVA, 2, 'vi')} ns mỗi ô, khoảng một chu kỳ xung nhịp, nghĩa là JIT (trình biên dịch lúc chạy) đã rút bản chép-dán xuống gần như không còn gì; đó là phép đo vi mô (micro-benchmark) bị "khôn", chứ không phải hàm phụ chậm.</p>
<p>Ba kết luận nói được khi phỏng vấn. (1) <strong>Hình dạng như nhau</strong>: từ 1 triệu lên 10 triệu ô, cột nào cũng tăng khoảng ×10 (DIRECTIONS trên Node: ×${so(tang(DO_TS, 2), 1, 'vi')}) — hàm phụ không bao giờ đổi Big-O. (2) <strong>Ở cỡ đề phỏng vấn không ai phân biệt được</strong>: lưới trên LeetCode tối đa cỡ 300×300 ≈ 10⁵ ô, ở đó cột chậm nhất trong bảng cũng chỉ ${so(MAX_NHO, 2, 'vi')} ms. (3) <strong>Nếu có lúc nó quan trọng thì đo trước</strong>, rồi mới trải phẳng đúng một vòng nóng — đó chính là nghĩa của "không tối ưu sớm". Cứ viết <code>DIRECTIONS</code>; nó chặn luôn lỗi kinh điển gõ sai hướng thứ tư.</p>
</div>

<div class="ml-en">
<h3>Write the skeleton first, fill in the helpers later</h3>
<p>The cleanest code in an interview is usually written <em>top-down</em>. Right after "shall I code it?", type the main function exactly as your plan, calling helpers that do not exist yet; give each helper a one-line stub. The program already runs — wrong only inside the stubs — and the interviewer can see and approve the structure before you spend ten minutes on details:</p>
</div>
<div class="ml-vi">
<h3>Viết khung trước, điền hàm phụ sau</h3>
<p>Code sạch nhất trong buổi phỏng vấn thường được viết <em>từ trên xuống</em> (top-down). Ngay sau câu "em code nhé?", gõ hàm chính đúng như kế hoạch, gọi những hàm phụ chưa tồn tại; mỗi hàm phụ một dòng giữ chỗ (stub). Chương trình đã chạy được — chỉ sai bên trong các stub — và người phỏng vấn nhìn thấy, đồng ý với cấu trúc trước khi bạn tiêu mười phút vào chi tiết:</p>
</div>
${ma('ch10/b2/khung.ts', { vung: 'khung', nhan: 'TypeScript — stage 1: skeleton with stubs' })}
${ketQua('ch10/b2/khung.ts')}
<div class="ml-en">
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Skeleton (2′)</span><span class="lz-d">Main function exactly as the plan you said, helpers as one-line stubs. Run it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Fill one helper</span><span class="lz-d">The easier one first (here <code>formatRange</code>). Run again: only that part of the output should change.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Fill the next helper</span><span class="lz-d">The one with the subtle condition (<code>extendRun</code>). Say the condition out loud as you type it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test</span><span class="lz-d">The normal example, then the edge cases from step 2 of the framework (empty, one element, the extremes).</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Say the cleanup (1′)</span><span class="lz-d">Names you would change, blocks you would extract — offer, do not force.</span></div>
</div>
<p>Every number is its own "range" — exactly what stubs that never extend should produce, which itself is a small test that the main loop is right. Fill <code>formatRange</code>, run; fill <code>extendRun</code>, run. Each step changes one thing, so if the output breaks you know where. If time runs out, a skeleton with one helper missing still shows a correct plan and earns partial credit; a half-written 40-line function shows nothing.</p>
<p><strong>The last two minutes.</strong> When the code works and you have tested it, spend a minute on cleanup <em>out loud</em>: "I'd rename <code>tmp</code> to <code>seen</code>, and the two copies of this block should be a helper — shall I do that?" Even if the interviewer says "no need", you scored the point. Do not refactor silently in the middle of debugging: change one thing at a time.</p>
<p><strong>Comments: few, and only for the "why".</strong> A comment that repeats the code (<code>// increment i</code>) is noise. A comment that explains a decision (<code>// early return: the first clash decides</code>, <code>// check before insert so an element cannot pair with itself</code>) is exactly what you would say out loud anyway.</p>
</div>
<div class="ml-vi">
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bộ khung (2′)</span><span class="lz-d">Hàm chính đúng như kế hoạch vừa nói, hàm phụ là stub một dòng. Chạy thử.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Điền một hàm phụ</span><span class="lz-d">Hàm dễ trước (ở đây là <code>formatRange</code>). Chạy lại: chỉ phần output liên quan được phép đổi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Điền hàm phụ tiếp theo</span><span class="lz-d">Hàm có điều kiện tinh tế (<code>extendRun</code>). Vừa gõ điều kiện vừa đọc to nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test</span><span class="lz-d">Ví dụ thường, rồi các trường hợp biên từ bước 2 của khung 6 bước (rỗng, một phần tử, giá trị cực trị).</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nói phần dọn dẹp (1′)</span><span class="lz-d">Tên bạn sẽ đổi, khối bạn sẽ tách — đề nghị, không ép.</span></div>
</div>
<p>Mỗi số thành một "dải" riêng — đúng thứ mà các stub không bao giờ nới dải phải sinh ra, và bản thân điều đó đã là một phép test nhỏ rằng vòng lặp chính đúng. Điền <code>formatRange</code>, chạy; điền <code>extendRun</code>, chạy. Mỗi bước chỉ đổi một chỗ, nên output hỏng là biết ngay hỏng ở đâu. Hết giờ thì một bộ khung thiếu một hàm phụ vẫn cho thấy kế hoạch đúng và vẫn được một phần điểm; một hàm 40 dòng viết dở thì không cho thấy gì.</p>
<p><strong>Hai phút cuối.</strong> Khi code đã chạy và đã test, dành một phút dọn dẹp <em>bằng lời</em>: "Em sẽ đổi tên <code>tmp</code> thành <code>seen</code>, và hai bản sao của khối này nên thành một hàm phụ — em làm luôn nhé?" (<em>"I'd extract this into a helper — shall I?"</em>). Kể cả khi người phỏng vấn nói "không cần", bạn đã ghi điểm. Đừng lặng lẽ refactor giữa lúc đang gỡ lỗi: mỗi lần đổi một thứ.</p>
<p><strong>Chú thích: ít, và chỉ để nói "vì sao".</strong> Chú thích lặp lại code (<code>// tăng i</code>) là tiếng ồn. Chú thích giải thích một quyết định (<code>// early return: lần trùng đầu tiên quyết định</code>, <code>// tra trước khi cất để phần tử không tự ghép với chính nó</code>) chính là thứ bạn đằng nào cũng nói to.</p>
</div>

<div class="ml-en">
<h3>Habits that lose points: TypeScript / JavaScript</h3>
<p>Each line below was run; the output follows. <a href="${baiNay('dsa-1-3-sap-xep')}">Lesson 1.3</a> already covered <code>sort()</code> without a comparator in depth, so it gets one line here.</p>
</div>
<div class="ml-vi">
<h3>Thói quen bị trừ điểm: TypeScript / JavaScript</h3>
<p>Mỗi dòng dưới đây đã chạy thật; output ngay sau. <a href="${baiNay('dsa-1-3-sap-xep')}">Bài 1.3</a> đã nói kỹ về <code>sort()</code> thiếu comparator (hàm so sánh), nên ở đây chỉ một dòng.</p>
</div>
${ma('ch10/b2/thoi-quen.ts', { vung: 'var', nhan: 'TypeScript — var vs let' })}
${ma('ch10/b2/thoi-quen.ts', { vung: 'mutate', nhan: 'TypeScript — mutating the input' })}
${ma('ch10/b2/thoi-quen.ts', { vung: 'spread', nhan: 'TypeScript — Math.max(...big)' })}
${ketQua('ch10/b2/thoi-quen.ts')}
<div class="ml-en">
<table>
<thead><tr><th>#</th><th>Habit</th><th>What the run shows</th><th>Write instead</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>==</code> / <code>!=</code></td><td><code>0 == ''</code>, <code>'0' == 0</code> are <code>true</code>: type coercion</td><td><code>===</code> / <code>!==</code> always</td></tr>
<tr><td>2</td><td><code>var</code> in loops</td><td>three closures all print 3: one shared variable</td><td><code>const</code> by default, <code>let</code> when reassigned</td></tr>
<tr><td>3</td><td><code>any</code></td><td><code>"5" + 1</code> becomes <code>"51"</code> with no complaint</td><td>Real types; <code>Number(x)</code> at the boundary</td></tr>
<tr><td>4</td><td><code>sort()</code> without comparator</td><td><code>[1,10,100,9]</code>: numbers sorted as strings</td><td><code>sort((a, b) =&gt; a - b)</code> (lesson 1.3)</td></tr>
<tr><td>5</td><td>Mutating the input</td><td><code>medianBad</code> left the caller's array sorted</td><td>Copy (<code>[...nums]</code>) or ask "may I modify it?"</td></tr>
<tr><td>6</td><td><code>Math.max(...arr)</code> on big arrays</td><td><code>RangeError</code> at 10⁶ elements: every element becomes an argument</td><td>A loop, or <code>reduce</code></td></tr>
<tr><td>7</td><td>Assuming numbers are exact</td><td><code>2^53 + 1</code> prints …992; <code>0.1 + 0.2</code> ≠ 0.3</td><td><code>BigInt</code> for huge integers; compare floats with a tolerance</td></tr>
</tbody></table>
</div>
<div class="ml-vi">
<table>
<thead><tr><th>#</th><th>Thói quen</th><th>Lần chạy cho thấy</th><th>Viết thay bằng</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>==</code> / <code>!=</code></td><td><code>0 == ''</code>, <code>'0' == 0</code> đều <code>true</code>: ép kiểu ngầm (type coercion)</td><td>Luôn <code>===</code> / <code>!==</code></td></tr>
<tr><td>2</td><td><code>var</code> trong vòng lặp</td><td>ba closure (hàm "nhớ" biến bên ngoài) đều in 3: chung một biến</td><td><code>const</code> mặc định, <code>let</code> khi cần gán lại</td></tr>
<tr><td>3</td><td><code>any</code></td><td><code>"5" + 1</code> thành <code>"51"</code> mà không ai kêu</td><td>Kiểu thật; đổi <code>Number(x)</code> ngay ở cửa vào</td></tr>
<tr><td>4</td><td><code>sort()</code> thiếu comparator</td><td><code>[1,10,100,9]</code>: số bị sắp như chuỗi</td><td><code>sort((a, b) =&gt; a - b)</code> (bài 1.3)</td></tr>
<tr><td>5</td><td>Sửa đầu vào của người gọi</td><td><code>medianBad</code> để lại mảng của người gọi đã bị sắp xếp</td><td>Sao chép (<code>[...nums]</code>) hoặc hỏi "em sửa thẳng mảng được không?"</td></tr>
<tr><td>6</td><td><code>Math.max(...arr)</code> với mảng lớn</td><td><code>RangeError</code> ở 10⁶ phần tử: mỗi phần tử thành một tham số</td><td>Một vòng lặp, hoặc <code>reduce</code></td></tr>
<tr><td>7</td><td>Tưởng số luôn chính xác</td><td><code>2^53 + 1</code> in ra …992; <code>0.1 + 0.2</code> ≠ 0,3</td><td><code>BigInt</code> cho số nguyên khổng lồ; so số thực với một sai số cho phép</td></tr>
</tbody></table>
</div>

<div class="ml-en">
<h3>Habits that lose points: Java</h3>
<p><a href="${baiNay('dsa-1-1-hash-map')}">Lesson 1.1</a> demonstrated <code>Integer ==</code> and <a href="${baiNay('dsa-4-1-co-ban')}">lesson 4.1</a> the <code>(lo + hi) / 2</code> overflow in detail; here they sit in one run with the others, so you can re-read the whole list the evening before an interview.</p>
</div>
<div class="ml-vi">
<h3>Thói quen bị trừ điểm: Java</h3>
<p><a href="${baiNay('dsa-1-1-hash-map')}">Bài 1.1</a> đã demo kỹ <code>Integer ==</code> và <a href="${baiNay('dsa-4-1-co-ban')}">bài 4.1</a> đã demo tràn số <code>(lo + hi) / 2</code>; ở đây chúng nằm chung một lần chạy với các bẫy khác để bạn đọc lại cả danh sách vào tối trước buổi phỏng vấn.</p>
${csd('csd201-java-list-api', 'vi', '1.4 Java thực chiến: ArrayList vs LinkedList', '<p>Bài CSD201 dạy chọn <code>ArrayList</code> hay <code>LinkedList</code> và cách collection chứa <code>Integer</code> (đã đóng hộp) chứ không chứa <code>int</code>. <strong>Ở đây đi sâu thêm:</strong> chính việc đóng hộp đó sinh ra hai bẫy hay bị trừ điểm — <code>Integer ==</code> và <code>Arrays.asList(int[])</code> chỉ có MỘT phần tử.</p>')}
</div>
${ma('ch10/b2/ThoiQuen.java', { vung: 'giua', nhan: 'Java — the middle of two big ints' })}
${ma('ch10/b2/ThoiQuen.java', { vung: 'staticham', nhan: 'Java — state that survives between test cases' })}
${ketQua('ch10/b2/ThoiQuen.java')}
<div class="ml-en">
<table>
<thead><tr><th>#</th><th>Habit</th><th>What the run shows</th><th>Write instead</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Integer == Integer</code></td><td><code>true</code> at 127, <code>false</code> at 128 (cache −128…127)</td><td><code>.equals()</code> or unbox to <code>int</code> (lesson 1.1)</td></tr>
<tr><td>2</td><td><code>String ==</code></td><td><code>false</code> for two equal strings built differently</td><td><code>.equals()</code></td></tr>
<tr><td>3</td><td>Integer division</td><td><code>7 / 2 = 3</code></td><td><code>(double) sum / count</code></td></tr>
<tr><td>4</td><td><code>(lo + hi) / 2</code></td><td><code>-97483648</code>: the sum overflowed</td><td><code>lo + (hi - lo) / 2</code> (lesson 4.1)</td></tr>
<tr><td>5</td><td><code>Math.abs(Integer.MIN_VALUE)</code></td><td>still negative: −2³¹ has no positive <code>int</code></td><td>Convert to <code>long</code> first</td></tr>
<tr><td>6</td><td>Summing into <code>int</code></td><td>10⁵ × 10⁵ gives 1410065408, not 10¹⁰</td><td><code>long</code> accumulator; check the constraints</td></tr>
<tr><td>7</td><td><code>char</code> arithmetic</td><td><code>'a' + 1</code> is 98; <code>"" + 'a' + 1</code> is <code>a1</code></td><td>Cast explicitly: <code>(char) ('a' + 1)</code></td></tr>
<tr><td>8</td><td><code>Arrays.asList(int[])</code></td><td>size 1: a list containing one array</td><td><code>Integer[]</code>, or a loop / <code>IntStream</code></td></tr>
<tr><td>9</td><td><code>static</code> state</td><td>second test case returns 3 instead of 1</td><td>Locals, or reset at the start of the method</td></tr>
</tbody></table>
<p>Row 9 is worth a story: LeetCode and most OA judges load your class <strong>once</strong> and call your method once per test case. A <code>static</code> counter, a class-level <code>HashMap</code> used as a memo, a module-level array in TypeScript — anything outside the function survives into the next test. You see "passed 1/58" with an answer that is correct when run alone, and lose twenty minutes. One more for online judges: a forgotten debug <code>System.out.println</code> or <code>console.log</code> becomes part of your output and fails an output-compared test; print debug lines to <code>System.err</code> / <code>console.error</code>, and delete them before submitting (<a href="${baiNay('dsa-10-4-online')}">lesson 10.4</a>).</p>
</div>
<div class="ml-vi">
<table>
<thead><tr><th>#</th><th>Thói quen</th><th>Lần chạy cho thấy</th><th>Viết thay bằng</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Integer == Integer</code></td><td><code>true</code> ở 127, <code>false</code> ở 128 (Java lưu sẵn −128…127)</td><td><code>.equals()</code> hoặc mở hộp về <code>int</code> (bài 1.1)</td></tr>
<tr><td>2</td><td><code>String ==</code></td><td><code>false</code> với hai chuỗi bằng nhau nhưng tạo theo hai cách</td><td><code>.equals()</code></td></tr>
<tr><td>3</td><td>Chia nguyên</td><td><code>7 / 2 = 3</code></td><td><code>(double) sum / count</code></td></tr>
<tr><td>4</td><td><code>(lo + hi) / 2</code></td><td><code>-97483648</code>: tổng bị tràn số</td><td><code>lo + (hi - lo) / 2</code> (bài 4.1)</td></tr>
<tr><td>5</td><td><code>Math.abs(Integer.MIN_VALUE)</code></td><td>vẫn âm: −2³¹ không có bản dương trong <code>int</code></td><td>Đổi sang <code>long</code> trước</td></tr>
<tr><td>6</td><td>Cộng dồn vào <code>int</code></td><td>10⁵ × 10⁵ ra 1410065408, không phải 10¹⁰</td><td>Biến cộng dồn kiểu <code>long</code>; đọc ràng buộc của đề</td></tr>
<tr><td>7</td><td>Tính toán với <code>char</code></td><td><code>'a' + 1</code> là 98; <code>"" + 'a' + 1</code> là <code>a1</code></td><td>Ép kiểu rõ ràng: <code>(char) ('a' + 1)</code></td></tr>
<tr><td>8</td><td><code>Arrays.asList(int[])</code></td><td>kích thước 1: một danh sách chứa MỘT mảng</td><td><code>Integer[]</code>, hoặc vòng lặp / <code>IntStream</code></td></tr>
<tr><td>9</td><td>Trạng thái <code>static</code></td><td>test thứ hai trả 3 thay vì 1</td><td>Biến cục bộ, hoặc đặt lại ở đầu hàm</td></tr>
</tbody></table>
<p>Dòng 9 đáng kể thành chuyện: LeetCode và đa số máy chấm OA nạp lớp của bạn <strong>một lần</strong> rồi gọi hàm của bạn một lần cho mỗi test. Một biến đếm <code>static</code>, một <code>HashMap</code> cấp lớp dùng làm bộ nhớ đệm (memo), một mảng cấp module trong TypeScript — thứ gì nằm ngoài hàm đều sống sang test sau. Bạn thấy "passed 1/58" với một đáp án chạy riêng thì đúng, và mất hai mươi phút. Thêm một bẫy với máy chấm online: một dòng <code>System.out.println</code> hay <code>console.log</code> để gỡ lỗi bị quên trở thành một phần output và làm trượt test so output; in dòng gỡ lỗi ra <code>System.err</code> / <code>console.error</code>, và xoá trước khi nộp (<a href="${baiNay('dsa-10-4-online')}">bài 10.4</a>).</p>
</div>

<div class="ml-en">
<h3>Where this lives at work: code review, linters, this repository</h3>
<ul>
<li><strong>Code review.</strong> At a company every change is a pull request that one or two colleagues read before it merges. The questions in the "what they notice" table are the questions reviewers write as comments. An interview is a 45-minute preview of whether your pull requests will be pleasant to review.</li>
<li><strong>Linters and formatters enforce the boring part.</strong> This website's backend has an <code>.eslintrc.json</code> (ESLint with the TypeScript parser: single quotes, semicolons, warnings for unused variables) and a <code>.prettierrc</code> (print width 100, 2 spaces, trailing commas), and its <code>tsconfig.json</code> turns on <code>strict</code> and <code>noImplicitAny</code> — so the implicit-<code>any</code> trap above is a compile error here. Java teams use Checkstyle or the Google Java Style Guide the same way. In an interview there is no linter: you are the linter.</li>
<li><strong>Guard clauses in production.</strong> <code>src/utils/cidr.ts</code> decides whether a payment notification really comes from VNPay's servers. <code>isIpInCidr</code> is five lines: parse the CIDR — <code>if (!parsed) return false</code>; parse the IP — <code>if (ipNum === null) return false</code>; then one comparison. The two parsing jobs live in helpers <code>parseCidr</code> and <code>ipv4ToNumber</code>, each a ladder of early <code>return null</code>s. That is the shape of the Sudoku solution above, on code that guards real money.</li>
<li><strong>Named constants in production.</strong> <code>src/utils/crypto.ts</code> begins with <code>KEY_BYTES = 32</code>, <code>IV_BYTES = 12</code>, <code>TAG_BYTES = 16</code>, each with a short comment (AES-256, the GCM nonce length, the auth tag). A reviewer checking the encryption reads the sizes in one place instead of hunting for a 12 in the middle of a buffer slice.</li>
<li><strong>Your team project.</strong> In SWP391/PRJ301, the teammate who writes <code>validateLogin()</code>, <code>loadCart()</code> and <code>MAX_ITEMS_PER_ORDER</code> is the one everyone else can build on. Reading other people's code is most of an internship; writing code that is easy to read is how you get trusted with more.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Điều này sống ở đâu khi đi làm: code review, linter, chính repo này</h3>
<ul>
<li><strong>Code review (duyệt code).</strong> Ở công ty, mọi thay đổi là một pull request mà một hai đồng nghiệp đọc trước khi gộp vào. Các câu trong bảng "họ để ý" chính là các câu người review viết thành bình luận. Buổi phỏng vấn là bản xem trước 45 phút xem pull request của bạn có dễ chịu để duyệt không.</li>
<li><strong>Linter và formatter lo phần nhàm.</strong> Backend của chính trang web này có <code>.eslintrc.json</code> (ESLint với bộ phân tích TypeScript: nháy đơn, dấu chấm phẩy, cảnh báo biến không dùng) và <code>.prettierrc</code> (dòng tối đa 100 ký tự, thụt 2 dấu cách, dấu phẩy cuối), còn <code>tsconfig.json</code> bật <code>strict</code> và <code>noImplicitAny</code> — nên bẫy <code>any</code> ngầm ở trên là lỗi biên dịch ở đây. Đội Java dùng Checkstyle hoặc Google Java Style Guide theo đúng cách đó. Khi phỏng vấn không có linter nào: bạn chính là linter.</li>
<li><strong>Điều kiện chặn đầu ở production.</strong> <code>src/utils/cidr.ts</code> quyết định một thông báo thanh toán có thật sự đến từ máy chủ VNPay không. <code>isIpInCidr</code> chỉ năm dòng: phân tích CIDR — <code>if (!parsed) return false</code>; phân tích IP — <code>if (ipNum === null) return false</code>; rồi một phép so sánh. Hai việc phân tích nằm trong hàm phụ <code>parseCidr</code> và <code>ipv4ToNumber</code>, mỗi hàm là một bậc thang <code>return null</code> sớm. Đó đúng là dáng của lời giải Sudoku ở trên, trên đoạn code canh giữ tiền thật.</li>
<li><strong>Hằng số có tên ở production.</strong> <code>src/utils/crypto.ts</code> mở đầu bằng <code>KEY_BYTES = 32</code>, <code>IV_BYTES = 12</code>, <code>TAG_BYTES = 16</code>, mỗi dòng một chú thích ngắn (AES-256, độ dài nonce của GCM, thẻ xác thực). Người review kiểm phần mã hoá đọc các kích thước ở một chỗ, thay vì đi lùng một con số 12 giữa một phép cắt buffer.</li>
<li><strong>Đồ án nhóm của bạn.</strong> Trong SWP391/PRJ301, người viết <code>validateLogin()</code>, <code>loadCart()</code> và <code>MAX_ITEMS_PER_ORDER</code> là người mà cả nhóm xây tiếp được lên trên. Đọc code người khác chiếm phần lớn thời gian thực tập; viết code dễ đọc là cách để được giao việc lớn hơn.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: "goto fail" — a duplicated line that broke TLS</h3>
<p>In February 2014 Apple shipped iOS 7.0.6 and then an OS X update to fix CVE-2014-1266. In the function that verifies a server's signature during the TLS handshake (<code>SSLVerifySignedServerKeyExchange</code>), a list of checks looked like <code>if (err = …) goto fail;</code> — and one <code>goto fail;</code> line was <strong>duplicated</strong>. The second copy was not inside any <code>if</code>, so it always jumped to the end with <code>err</code> still 0 ("success"), skipping the final signature check. Anyone on the same Wi-Fi could impersonate a website to Safari and read the "encrypted" traffic. Adam Langley's analysis notes that compiler warnings for unreachable code, mandatory braces, or a test with a bad signature would each have caught it.</p>
<p>The lesson for your interview code is the same as the empty-array bug above, at a scale of hundreds of millions of devices: copy-pasted lines and missing braces make code where one stray line changes control flow invisibly. Habits that defend against it: always braces on <code>if</code> bodies that span lines (or one-liners on the same line), no duplicated blocks, and a test for the "must fail" case — not only for the happy path.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: "goto fail" — một dòng bị lặp làm hỏng TLS</h3>
<p>Tháng 2/2014 Apple phát hành iOS 7.0.6 rồi một bản cập nhật OS X để vá CVE-2014-1266. Trong hàm kiểm chữ ký của máy chủ lúc bắt tay TLS (<code>SSLVerifySignedServerKeyExchange</code>), một chuỗi các phép kiểm có dạng <code>if (err = …) goto fail;</code> — và một dòng <code>goto fail;</code> bị <strong>lặp lại</strong>. Bản sao thứ hai không nằm trong <code>if</code> nào, nên nó luôn nhảy tới cuối hàm với <code>err</code> vẫn bằng 0 ("thành công"), bỏ qua bước kiểm chữ ký cuối cùng. Bất kỳ ai dùng chung mạng Wi-Fi đều có thể giả làm một trang web với Safari và đọc lưu lượng "đã mã hoá". Bài phân tích của Adam Langley chỉ ra rằng cảnh báo của trình biên dịch về code không bao giờ chạy tới, luật bắt buộc ngoặc nhọn, hay một phép test với chữ ký sai — bất kỳ cái nào cũng đã bắt được nó.</p>
<p>Bài học cho code phỏng vấn của bạn giống hệt lỗi mảng rỗng ở trên, chỉ ở quy mô hàng trăm triệu thiết bị: dòng chép-dán và thiếu ngoặc nhọn tạo ra thứ code mà một dòng lạc có thể đổi luồng chạy mà không ai thấy. Thói quen phòng thủ: luôn có ngoặc nhọn cho thân <code>if</code> kéo dài nhiều dòng (hoặc viết một dòng trên cùng một dòng), không lặp khối code, và có test cho trường hợp "phải thất bại" — không chỉ cho đường đi suôn sẻ.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Over-engineering in a 45-minute interview.</strong></p><p>Clean is not "enterprise". A <code>RangeFormatter</code> interface with a <code>DefaultRangeFormatter</code> implementation, a builder, or three classes for a 15-line function costs you ten minutes and makes the code <em>harder</em> to follow. Helpers yes, classes only when the problem is a design problem (LRU cache, Trie, MinHeap).</p></div>
<div class="pitfall co-tieu-de"><p><strong>Renaming everything at minute 40.</strong></p><p>A global rename while the interviewer is reading breaks their mental map and often your code (one occurrence missed). Name well as you go; at the end, <em>say</em> what you would rename.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Clever one-liners.</strong></p><p><code>return nums.reduce((a, x, i) =&gt; …, [])</code> that builds ranges in one expression may be correct, but nobody can trace it on the whiteboard in step 6. If you cannot trace it out loud in 30 seconds, write the loop.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Thiết kế quá tay trong buổi phỏng vấn 45 phút.</strong></p><p>Sạch không có nghĩa là "kiểu doanh nghiệp". Một interface <code>RangeFormatter</code> với lớp cài đặt <code>DefaultRangeFormatter</code>, một builder, hay ba lớp cho một hàm 15 dòng tốn của bạn mười phút và làm code <em>khó</em> theo dõi hơn. Hàm phụ thì có; lớp chỉ khi đề vốn là bài thiết kế (LRU cache, Trie, MinHeap).</p></div>
<div class="pitfall co-tieu-de"><p><strong>Đổi tên mọi thứ ở phút thứ 40.</strong></p><p>Đổi tên hàng loạt khi người phỏng vấn đang đọc làm vỡ "bản đồ trong đầu" của họ và hay làm vỡ luôn code của bạn (sót một chỗ). Đặt tên tốt ngay từ đầu; tới cuối thì <em>nói ra</em> bạn sẽ đổi tên gì.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Câu lệnh một dòng "thông minh".</strong></p><p><code>return nums.reduce((a, x, i) =&gt; …, [])</code> dựng các dải trong một biểu thức có thể đúng, nhưng không ai chạy tay được nó ở bước 6. Nếu bạn không chạy tay nó thành tiếng trong 30 giây, hãy viết vòng lặp.</p></div>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: cleaning up on request</h3>
${hoiThoai([
  ['I', 'Your Summary Ranges passes the examples. Before we move on — can you clean this up a bit?'],
  ['C', 'Sure. Two things bother me: the block that formats a range appears twice, inside the loop and after it, and x1, x2 don’t say what they are. I’d rename them to start and end and pull the formatting into a helper called formatRange.'],
  ['N', 'Name the smells first, in one sentence each, before touching the keyboard. The interviewer is scoring the diagnosis as much as the edit.'],
  ['I', 'Why a helper? It’s only four lines.'],
  ['C', 'Because it exists twice. If I fix the format in one copy, the other stays wrong. Also, the copy after the loop is the reason the empty array breaks: it runs even when there were no numbers.'],
  ['N', 'Tie the refactor to a real bug. "Readability" alone sounds like taste; "this duplicated block is the empty-input bug" sounds like engineering.'],
  ['C', '(rewriting) The loop now says the plan: while there are numbers left, find where this run ends with extendRun, record formatRange of start and end, jump to end plus one. Empty input simply never enters the loop.'],
  ['I', 'Does the helper cost performance?'],
  ['C', 'Not in a way that matters: it is the same O(n), and small functions get inlined by the JIT. If this were a hot loop on millions of items I would measure before unrolling anything.'],
  ['C', 'Re-running: [0,1,2,4,5,7] gives 0-&gt;2, 4-&gt;5, 7; a single number gives just that number; the empty array gives an empty list.'],
  ['I', 'What would you change if the input could contain duplicates?'],
  ['C', 'Only extendRun: it should also step over a next number equal to the current one. The helper is exactly where that rule belongs.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to khi phỏng vấn: dọn code khi được yêu cầu</h3>
${hoiThoai([
  ['I', 'Summary Ranges của em qua hết ví dụ rồi. Trước khi sang phần khác — em dọn lại code một chút được không?'],
  ['C', 'Dạ được. Có hai chỗ em thấy chưa ổn: khối định dạng một dải xuất hiện hai lần, trong vòng lặp và sau vòng lặp, và x1, x2 không nói lên chúng là gì. Em đổi tên thành start và end, và tách phần định dạng ra một hàm phụ tên formatRange. <em>("I’d pull this into a helper and rename x1 to start.")</em>'],
  ['N', 'Gọi tên các "mùi code" trước, mỗi cái một câu, rồi mới chạm bàn phím. Người phỏng vấn chấm phần chẩn đoán ngang với phần sửa.'],
  ['I', 'Sao lại cần hàm phụ? Có bốn dòng thôi mà.'],
  ['C', 'Vì nó tồn tại hai lần. Em sửa định dạng ở bản này thì bản kia vẫn sai. Với lại, chính bản sao sau vòng lặp làm mảng rỗng bị hỏng: nó chạy cả khi không có số nào. <em>("It’s duplicated — and the duplicate is what breaks the empty input.")</em>'],
  ['N', 'Gắn việc refactor với một lỗi thật. Chỉ nói "cho dễ đọc" nghe như sở thích; nói "khối lặp này chính là lỗi đầu vào rỗng" nghe như kỹ sư.'],
  ['C', '(vừa viết lại vừa nói) Giờ vòng lặp nói ra kế hoạch: còn số thì tìm chỗ dải này kết thúc bằng extendRun, ghi formatRange của start và end, nhảy tới end cộng một. Đầu vào rỗng thì đơn giản là không vào vòng lặp.'],
  ['I', 'Hàm phụ có làm chậm không?'],
  ['C', 'Không đáng kể ạ: vẫn là O(n), và hàm nhỏ được JIT inline. Nếu đây là vòng lặp nóng chạy trên hàng triệu phần tử thì em sẽ đo trước rồi mới trải phẳng. <em>("I’d measure before optimising.")</em>'],
  ['C', 'Chạy lại: [0,1,2,4,5,7] ra 0-&gt;2, 4-&gt;5, 7; một số đơn lẻ ra đúng số đó; mảng rỗng ra danh sách rỗng.'],
  ['I', 'Nếu đầu vào có thể có phần tử trùng thì em đổi gì?'],
  ['C', 'Chỉ đổi extendRun: nó phải bước qua cả số tiếp theo bằng đúng số hiện tại. Hàm phụ chính là chỗ quy tắc đó thuộc về.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Patching the last case with a copy of the loop body after the loop, instead of restructuring so the loop handles it.</li>
<li>Names from your keyboard, not from your explanation: <code>temp</code>, <code>arr2</code>, <code>flag</code>, <code>res1</code>.</li>
<li>Three nested <code>if</code>s where one guard clause and a <code>continue</code> would do.</li>
<li>Magic numbers (<code>9</code>, <code>26</code>, <code>1e9 + 7</code>) scattered through the code instead of one named constant each.</li>
<li>Optimising before it works — or worse, refusing a helper "for speed" without measuring.</li>
<li>Leaving <code>static</code>/global state or debug prints in a solution that a judge runs many times.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Vá trường hợp cuối bằng cách chép thân vòng lặp ra sau vòng lặp, thay vì sắp lại cấu trúc để vòng lặp tự lo.</li>
<li>Tên lấy từ bàn phím chứ không từ lời giải thích: <code>temp</code>, <code>arr2</code>, <code>flag</code>, <code>res1</code>.</li>
<li>Ba tầng <code>if</code> lồng nhau ở chỗ chỉ cần một điều kiện chặn đầu và một <code>continue</code>.</li>
<li>Số ma thuật (<code>9</code>, <code>26</code>, <code>1e9 + 7</code>) rải khắp code thay vì mỗi số một hằng có tên.</li>
<li>Tối ưu trước khi chạy đúng — tệ hơn, từ chối hàm phụ "cho nhanh" mà không đo.</li>
<li>Để lại trạng thái <code>static</code>/toàn cục hay dòng in gỡ lỗi trong lời giải mà máy chấm chạy nhiều lần.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (write each one clean, then re-read it as the interviewer)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (viết sạch từng đề, rồi đọc lại như người phỏng vấn)</h3>
${bangDe(DE, 'vi')}
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Type the dirty <code>f</code> from this lesson into a file. Without looking at the clean version, refactor it in three commits-worth of steps: rename, extract <code>formatRange</code>, restructure the loop. Run the five examples and <code>[]</code> after each step.</li>
<li>Solve LC 443 (String Compression) skeleton-first: main loop with two stubbed helpers, run it, then fill the helpers one by one.</li>
<li>Pick one of your own old LeetCode submissions. Mark every magic number, every name that is not a role, every block that appears twice. Fix them and resubmit.</li>
<li>From memory, write the two habit tables (TS and Java) in your notebook — at least five rows each.</li>
</ol>
<p><strong>Done when:</strong> your refactor prints the same answers as before and <code>[]</code> for the empty array, LC 443 is accepted with at least one helper, and your notebook has both tables.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">helper function</span><span class="v">A small function with one job and a name from your explanation.</span></div>
  <div class="kv"><span class="k">guard clause / early return</span><span class="v">Handle the trivial or decided case first and leave, keeping the main path flat.</span></div>
  <div class="kv"><span class="k">magic number / named constant</span><span class="v">A bare literal whose meaning must be guessed / the same value with a name.</span></div>
  <div class="kv"><span class="k">refactor</span><span class="v">Changing the structure of code without changing what it does.</span></div>
  <div class="kv"><span class="k">premature optimisation</span><span class="v">Making code faster before it works or before measuring that it is slow.</span></div>
  <div class="kv"><span class="k">inlining</span><span class="v">The compiler copying a small function's body into the caller, so the call costs nothing.</span></div>
  <div class="kv"><span class="k">stub / skeleton</span><span class="v">A placeholder function body / the main function written against helpers not yet finished.</span></div>
  <div class="kv"><span class="k">linter</span><span class="v">A tool that flags risky or inconsistent code (ESLint, Checkstyle).</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Clean in an interview means easy to follow while being written — not enterprise design.</li>
<li>Duplicated code is where edge-case bugs hide: the dirty Summary Ranges broke on <code>[]</code> exactly in its copied block.</li>
<li>Five tools: names from your sentence, one helper per idea, guard clauses, named constants, no premature optimisation.</li>
<li>Helpers do not change Big-O and, at interview sizes, not even the milliseconds — measure before unrolling.</li>
<li>Write the skeleton first with stubs, fill one helper at a time, and say your cleanup in the last two minutes.</li>
<li>Know the TS/Java traps: <code>==</code>, <code>var</code>, <code>any</code>, mutation, <code>Integer ==</code>, overflow, <code>static</code> state.</li>
</ul>
${nguon('📙', 'Google Java Style Guide', 'Naming, braces "even when the body is a single statement", one variable per declaration', 'https://google.github.io/styleguide/javaguide.html')}
${nguon('📘', 'typescript-eslint — no-explicit-any', 'Why any switches off the type checker, and what to write instead', 'https://typescript-eslint.io/rules/no-explicit-any/')}
${nguon('🔐', 'ImperialViolet (2014) — Apple’s SSL/TLS bug', 'Adam Langley’s analysis of the duplicated "goto fail" line (CVE-2014-1266)', 'https://www.imperialviolet.org/2014/02/22/applebug.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gõ hàm bẩn <code>f</code> của bài này vào một tệp. Không nhìn bản sạch, refactor nó theo ba bước: đổi tên, tách <code>formatRange</code>, sắp lại vòng lặp. Sau mỗi bước chạy năm ví dụ và <code>[]</code>.</li>
<li>Giải LC 443 (String Compression) theo kiểu khung trước: vòng lặp chính với hai hàm phụ đang là stub, chạy, rồi điền từng hàm phụ.</li>
<li>Chọn một bài LeetCode cũ của chính bạn. Đánh dấu mọi số ma thuật, mọi tên không nói vai trò, mọi khối xuất hiện hai lần. Sửa và nộp lại.</li>
<li>Không nhìn bài, chép hai bảng thói quen (TS và Java) vào sổ — mỗi bảng ít nhất năm dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> bản refactor in ra đúng các đáp án cũ và <code>[]</code> cho mảng rỗng, LC 443 Accepted với ít nhất một hàm phụ, và sổ có đủ hai bảng.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">helper function (hàm phụ)</span><span class="v">Hàm nhỏ làm đúng một việc, mang tên lấy từ lời giải thích của bạn.</span></div>
  <div class="kv"><span class="k">guard clause / early return (điều kiện chặn đầu / trả về sớm)</span><span class="v">Xử lý trước trường hợp tầm thường hoặc đã có đáp án rồi thoát, giữ đường chính phẳng.</span></div>
  <div class="kv"><span class="k">magic number / named constant (số ma thuật / hằng số có tên)</span><span class="v">Một con số trần phải đoán nghĩa / cùng giá trị đó nhưng có tên.</span></div>
  <div class="kv"><span class="k">refactor (tái cấu trúc)</span><span class="v">Đổi cấu trúc code mà không đổi việc nó làm.</span></div>
  <div class="kv"><span class="k">premature optimisation (tối ưu sớm)</span><span class="v">Làm code nhanh hơn khi nó chưa chạy đúng, hoặc chưa đo xem nó có chậm thật không.</span></div>
  <div class="kv"><span class="k">inlining (nhúng thân hàm)</span><span class="v">Trình biên dịch chép thân hàm nhỏ vào chỗ gọi, nên lời gọi không tốn gì.</span></div>
  <div class="kv"><span class="k">stub / skeleton (hàm giữ chỗ / bộ khung)</span><span class="v">Thân hàm tạm / hàm chính viết dựa trên các hàm phụ chưa xong.</span></div>
  <div class="kv"><span class="k">linter (công cụ soát code)</span><span class="v">Công cụ đánh dấu code rủi ro hay không nhất quán (ESLint, Checkstyle).</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Sạch khi phỏng vấn là dễ theo dõi ngay trong lúc được viết — không phải thiết kế kiểu doanh nghiệp.</li>
<li>Code lặp là chỗ lỗi biên ẩn náu: Summary Ranges bản bẩn hỏng với <code>[]</code> đúng ở khối bị chép.</li>
<li>Năm công cụ: tên lấy từ câu bạn nói, mỗi ý một hàm phụ, điều kiện chặn đầu, hằng số có tên, không tối ưu sớm.</li>
<li>Hàm phụ không đổi Big-O và ở cỡ đề phỏng vấn còn không đổi nổi mili-giây — đo trước khi trải phẳng.</li>
<li>Viết khung trước với stub, điền từng hàm phụ một, và nói ra việc dọn dẹp ở hai phút cuối.</li>
<li>Thuộc bẫy TS/Java: <code>==</code>, <code>var</code>, <code>any</code>, sửa đầu vào, <code>Integer ==</code>, tràn số, trạng thái <code>static</code>.</li>
</ul>
${nguon('📙', 'Google Java Style Guide', 'Đặt tên, luôn có ngoặc nhọn "kể cả khi thân chỉ một câu lệnh", mỗi khai báo một biến (tiếng Anh)', 'https://google.github.io/styleguide/javaguide.html')}
${nguon('📘', 'typescript-eslint — no-explicit-any', 'Vì sao any tắt bộ kiểm kiểu, và nên viết gì thay (tiếng Anh)', 'https://typescript-eslint.io/rules/no-explicit-any/')}
${nguon('🔐', 'ImperialViolet (2014) — lỗi SSL/TLS của Apple', 'Phân tích của Adam Langley về dòng "goto fail" bị lặp (CVE-2014-1266)', 'https://www.imperialviolet.org/2014/02/22/applebug.html')}
</div>
`,
};
