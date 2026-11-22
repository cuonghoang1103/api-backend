/**
 * 1.2 — Tái hiện chắc chắn và bản tái hiện tối giản (soạn 22/11/2026). Output chạy THẬT /tmp/dbg-lab/ch1/1-2 (Node v26.8.1).
 * Dữ liệu don-hang.csv sinh bằng script (200 dòng, dòng DH137 giá "1.200.000"); nhật ký đăng nhập là dữ liệu mẫu tự soạn.
 */
import { nguon } from '../_chung.mjs';

const MA_DN = `<pre><code class="language-js">// dang-nhap.js
const NGUOI_DUNG = [{ email: 'an@example.com', matKhau: 'mk-an' }, { email: 'binh@example.com', matKhau: 'mk-binh' }];
function dangNhap(email, matKhau) {
  const u = NGUOI_DUNG.find((x) =&gt; x.email === email);
  return Boolean(u &amp;&amp; u.matKhau === matKhau);
}
module.exports = { dangNhap };</code></pre>`;

const MA_XEM = `<pre><code class="language-js">// xem-that-bai.js — print FAILED attempts; JSON.stringify makes hidden characters visible
const fs = require('node:fs');
for (const dong of fs.readFileSync('nhat-ky-dang-nhap.jsonl', 'utf8').trim().split('\\n')) {
  const l = JSON.parse(dong);
  if (!l.ketQua) console.log(l.luc, l.thietBi.padEnd(15), JSON.stringify(l.email));
}</code></pre>
<div class="out">$ node xem-that-bai.js
08:05 Safari/iPhone   "An@example.com"
08:06 Safari/iPhone   "An@example.com"
09:12 Chrome/Windows  "an@example.com "</div>`;

const MA_TH = `<pre><code class="language-js">// tai-hien.js — the bug, on demand, every time
const { dangNhap } = require('./dang-nhap.js');
for (const email of ['an@example.com', 'An@example.com', 'an@example.com ']) {
  console.log(JSON.stringify(email).padEnd(18), dangNhap(email, 'mk-an'));
}</code></pre>
<div class="out">$ node tai-hien.js
"an@example.com"   true
"An@example.com"   false
"an@example.com "  false</div>`;

const MA_CSV = `<pre><code class="language-js">// tong-csv.js
const fs = require('node:fs');
function tongTien(noiDungCsv) {
  const dong = noiDungCsv.trim().split('\\n').slice(1);       // skip the header line
  return dong.reduce((t, d) =&gt; t + Number(d.split(',')[2]), 0);
}
module.exports = { tongTien };
if (require.main === module) console.log('Tổng:', tongTien(fs.readFileSync(process.argv[2], 'utf8')));</code></pre>
<div class="out">$ wc -l don-hang.csv
     201 don-hang.csv
$ node tong-csv.js don-hang.csv
Tổng: NaN</div>`;

const MA_THU = `<pre><code class="language-js">// thu-nho.js — drop half the data, keep the half that STILL fails, repeat
const fs = require('node:fs');
const { tongTien } = require('./tong-csv.js');
const [tieuDe, ...dong] = fs.readFileSync(process.argv[2], 'utf8').trim().split('\\n');
const conLoi = (ds) =&gt; Number.isNaN(tongTien([tieuDe, ...ds].join('\\n')));

let ds = dong, buoc = 0;
while (ds.length &gt; 1) {
  const giua = Math.ceil(ds.length / 2);
  const [a, b] = [ds.slice(0, giua), ds.slice(giua)];
  buoc++;
  if (conLoi(a)) ds = a; else if (conLoi(b)) ds = b; else break;   // bug needs both halves ⇒ stop
  console.log(&#96;bước &#36;{buoc}: còn &#36;{ds.length} dòng&#96;);
}
console.log('Bản tái hiện tối giản:');
console.log([tieuDe, ...ds].join('\\n'));</code></pre>
<div class="out">$ node thu-nho.js don-hang.csv
bước 1: còn 100 dòng
bước 2: còn 50 dòng
bước 3: còn 25 dòng
bước 4: còn 13 dòng
bước 5: còn 6 dòng
bước 6: còn 3 dòng
bước 7: còn 2 dòng
bước 8: còn 1 dòng
Bản tái hiện tối giản:
ma,ten,gia
DH137,San pham 137,1.200.000
$ node -e "console.log(Number('1.200.000'), Number('1200000'))"
NaN 1200000</div>`;

const NGUON = [
  nguon('📗', 'Stack Overflow — How to create a Minimal, Reproducible Example', 'Chuẩn "tối giản, đầy đủ, tái hiện được" mà mọi diễn đàn kỹ thuật dùng.', 'https://stackoverflow.com/help/minimal-reproducible-example'),
  nguon('📕', 'Andreas Zeller — Why Programs Fail (trang sách)', 'Sách gốc về gỡ lỗi có hệ thống, gồm thuật toán delta debugging để thu nhỏ đầu vào.', 'https://www.whyprogramsfail.com/'),
].join('\n');

export default {
  title: '1.2 — Reproducing reliably and the minimal reproduction|||1.2 — Tái hiện chắc chắn và bản tái hiện tối giản',
  slug: 'dbg-1-2-tai-hien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến lỗi "thỉnh thoảng" thành lỗi lần nào cũng ra (đăng nhập hỏng vì iPhone viết hoa chữ đầu và dấu cách thừa), rồi thu một tệp 200 dòng về đúng 1 dòng gây lỗi bằng script chia đôi dữ liệu — chạy thật, 8 bước.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>If you cannot make it fail on demand, you cannot know you fixed it</h2>
<p class="lead">Reproducing is step 1 for a reason: every later step depends on it. A hypothesis is tested by "does it still fail?", and a fix is proven by "it no longer fails" — both need a bug you can trigger at will. This lesson does two things you will do every week at work: turn a "sometimes" bug into an "every time" bug, and shrink a big failing input into a tiny one that still fails.</p>

<h3>An everyday picture: the strange noise in the car</h3>
<p>"The car sometimes rattles." The mechanic asks: when? "Only on cold mornings, only over bumps, only above 40 km/h." Now it is not "sometimes" any more — it is three conditions, and the mechanic can recreate all three. "Sometimes" almost always means "under conditions I have not written down yet".</p>

<h3>Part 1 — the "sometimes" bug: customers cannot always log in</h3>
<p><strong>Real situation at work:</strong> support forwards a complaint: "Some customers sometimes cannot log in, even with the right password. It works when they try on a computer." You try on your machine — it works. The classic mistake is to reply "cannot reproduce" and close the ticket. The methodical move is to <strong>collect the conditions</strong> of the failures.</p>
<p>Here is the login code and a small sample of login attempts (the kind of data a real log gives you — reading real logs is taught in the Log from A to Z course):</p>
${MA_DN}
${MA_XEM}
<p>Two details made the hidden conditions visible. First, filtering to <em>failures only</em>: patterns appear when you stop looking at the successes. Second, <code>JSON.stringify</code>: printed with quotes, the trailing space in <code>"an@example.com "</code> becomes visible — with a plain <code>console.log</code> it would look identical to the correct one. Two conditions emerge: an iPhone capitalised the first letter (iOS auto-capitalises the first letter of a text field unless the page turns it off), and a browser autocomplete added a trailing space.</p>
<p>Now write the bug down as a script that fails <strong>every time</strong>:</p>
${MA_TH}
<p>"Sometimes" became a three-line reproduction. You can now test any fix in one second, and the same three inputs become your regression test (normalise with <code>email.trim().toLowerCase()</code> before comparing — and store emails normalised too).</p>

<h3>Techniques for "sometimes" bugs</h3>
<table>
<thead><tr><th>Technique</th><th>What it means</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Write the conditions</td><td>Device, browser, user, data, time, order of actions</td><td>Fails only on iPhone ⇒ auto-capitalisation</td></tr>
<tr><td>Compare failing vs passing</td><td>Put the two side by side and look for the difference</td><td>Same user: <code>"An@…"</code> fails, <code>"an@…"</code> works</td></tr>
<tr><td>Make hidden things visible</td><td>Quote strings, print types and lengths</td><td><code>JSON.stringify</code>, <code>typeof</code>, <code>.length</code></td></tr>
<tr><td>Increase the frequency</td><td>Run it 1,000 times, add load, shorten timeouts</td><td>A race that fails 1 in 100 fails 10 times in 1,000 runs (Ch8)</td></tr>
<tr><td>Fix the randomness</td><td>Fixed seed, fake clock, fixed data</td><td>Time-zone bugs reproduced by setting <code>TZ=Asia/Tokyo</code> (Ch8)</td></tr>
</tbody>
</table>

<h3>Part 2 — the minimal reproduction</h3>
<p>A reproduction that needs your whole project, a 200-line file and a database is still hard to reason about. A <strong>minimal reproduction</strong> is the smallest input, smallest code and fewest steps that still fail — so small that removing anything more makes the bug disappear. Two reasons it matters: the cause is usually obvious once the noise is gone, and it is what you post when you ask for help (Stack Overflow calls it a "minimal, reproducible example").</p>
<p><strong>Situation:</strong> an accountant uploads <code>don-hang.csv</code> (200 orders) and the total shows <code>NaN</code>. Reading 200 lines by eye is slow and you will miss things. Let the computer split the data instead.</p>
${MA_CSV}
<p>The shrinking script applies the "keep the half that still fails" rule — the same binary search you will use on code in 1.3 and on Git history in Chapter 9:</p>
${MA_THU}
<p>Eight steps from 200 lines to one: <code>1.200.000</code>, a price written with Vietnamese thousands separators, which <code>Number()</code> cannot parse. 200 → 100 → … → 1 is why halving is so powerful: about log₂(200) ≈ 8 steps, whatever the size. The <code>else break</code> line handles the honest case where the bug needs lines from <em>both</em> halves — then you shrink by smaller pieces instead (that is what Zeller's "delta debugging" algorithm generalises).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — shrinking until the bug changes.</strong> While you cut, check that it is still <em>the same</em> failure (same NaN, same error line), not a different one you created by cutting too much. In <code>thu-nho.js</code> the check <code>Number.isNaN(…)</code> pins the exact symptom.</p></div>

<h3>🧪 Practice (20 min) — shrink a bug you did not plant</h3>
<div class="callout ok">
<ol>
<li>Type <code>tong-csv.js</code> and <code>thu-nho.js</code>. Generate your own CSV: 300 lines, with two "bad" lines you choose (for example a price <code>"120,000"</code> with a comma, or an empty price). Ask a friend to choose the line numbers without telling you.</li>
<li>Run <code>node thu-nho.js</code>. Note how many steps it takes and what it prints.</li>
<li>One of your two bad lines will survive and one will not. Why does the script only find one? Fix that line in the CSV and run again to find the second.</li>
<li>Write the three-line reproduction for the login bug and turn it into a <code>node:test</code> test; fix <code>dangNhap</code> so all three print <code>true</code>.</li>
</ol>
<p><strong>Done when:</strong> the script found both bad lines (one per run) in about 9 steps each, you can explain why each run only finds one, and your login test is red before the fix and green after.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">intermittent bug</span><span class="v">A bug that happens "sometimes" — really: under conditions not yet written down.</span></div>
  <div class="kv"><span class="k">minimal reproduction</span><span class="v">The smallest input/code/steps that still show the same bug.</span></div>
  <div class="kv"><span class="k">delta debugging</span><span class="v">Systematically removing parts of a failing input while it still fails.</span></div>
  <div class="kv"><span class="k">normalise</span><span class="v">Convert input to one standard form (<code>trim()</code>, <code>toLowerCase()</code>) before comparing.</span></div>
  <div class="kv"><span class="k">seed</span><span class="v">A fixed starting value that makes "random" behaviour repeatable.</span></div>
  <div class="kv"><span class="k">binary search</span><span class="v">Halving the search space each step: 200 → 1 in about 8 steps.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No reproduction, no proof: every later step depends on triggering the bug at will.</li>
<li>"Sometimes" means unknown conditions: filter to failures, compare with passes, make hidden characters visible.</li>
<li>Write the reproduction as a script; it becomes the regression test.</li>
<li>Shrink inputs by halving and keeping the half that still fails — log₂(n) steps.</li>
<li>While shrinking, check it is still the same symptom.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Không làm lỗi xảy ra theo ý được thì không thể biết mình đã sửa xong</h2>
<p class="lead">Tái hiện là bước 1 có lý do: mọi bước sau đều dựa vào nó. Giả thuyết được kiểm bằng câu "còn lỗi không?", bản sửa được chứng minh bằng "hết lỗi rồi" — cả hai đều cần một lỗi bạn bật ra được lúc nào cũng được. Bài này làm hai việc bạn sẽ làm mỗi tuần khi đi làm: biến lỗi "thỉnh thoảng" thành lỗi "lần nào cũng ra", và thu một đầu vào lớn bị lỗi về một đầu vào bé xíu vẫn lỗi y như vậy.</p>

<h3>Liên tưởng đời thường: tiếng lạ trong ô tô</h3>
<p>"Xe thỉnh thoảng kêu lạch cạch." Thợ hỏi: lúc nào? "Chỉ sáng lạnh, chỉ khi qua ổ gà, chỉ khi trên 40 km/h." Giờ nó không còn là "thỉnh thoảng" nữa — nó là ba điều kiện, và thợ dựng lại được cả ba. "Thỉnh thoảng" gần như luôn có nghĩa là "trong những điều kiện mình chưa ghi ra".</p>

<h3>Phần 1 — lỗi "thỉnh thoảng": khách không phải lúc nào cũng đăng nhập được</h3>
<p><strong>Tình huống thật khi đi làm:</strong> bộ phận hỗ trợ chuyển tới một khiếu nại: "Một số khách thỉnh thoảng không đăng nhập được dù đúng mật khẩu. Thử trên máy tính thì được." Bạn thử trên máy mình — chạy. Sai lầm kinh điển là trả lời "không tái hiện được" rồi đóng ticket. Cách có phương pháp là <strong>gom điều kiện</strong> của những lần hỏng.</p>
<p>Đây là code đăng nhập và một mẫu nhỏ các lượt đăng nhập (loại dữ liệu log thật cho bạn — đọc log thật được dạy ở khoá Log từ A đến Z):</p>
${MA_DN}
${MA_XEM}
<p>Hai chi tiết làm lộ điều kiện ẩn. Một: lọc <em>chỉ những lần hỏng</em> — quy luật hiện ra khi bạn thôi nhìn những lần thành công. Hai: <code>JSON.stringify</code> — in có dấu nháy, dấu cách thừa trong <code>"an@example.com "</code> mới hiện ra; với <code>console.log</code> thường nó trông y hệt chuỗi đúng. Lộ ra hai điều kiện: iPhone viết hoa chữ đầu (iOS tự viết hoa chữ cái đầu của ô nhập trừ khi trang tắt tính năng này), và tính năng tự điền của trình duyệt thêm một dấu cách ở cuối.</p>
<p>Giờ viết lỗi thành một script hỏng <strong>lần nào cũng như lần nào</strong>:</p>
${MA_TH}
<p>"Thỉnh thoảng" đã thành một bản tái hiện ba dòng. Bạn kiểm được mọi bản sửa trong một giây, và chính ba đầu vào đó thành test chặn tái phát (chuẩn hoá bằng <code>email.trim().toLowerCase()</code> trước khi so — và lưu email ở dạng đã chuẩn hoá).</p>

<h3>Kỹ thuật cho lỗi "thỉnh thoảng"</h3>
<table>
<thead><tr><th>Kỹ thuật</th><th>Nghĩa là</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Ghi điều kiện</td><td>Thiết bị, trình duyệt, người dùng, dữ liệu, giờ, thứ tự thao tác</td><td>Chỉ hỏng trên iPhone ⇒ tự viết hoa</td></tr>
<tr><td>So lần hỏng với lần chạy</td><td>Đặt hai cái cạnh nhau, tìm khác biệt</td><td>Cùng người: <code>"An@…"</code> hỏng, <code>"an@…"</code> chạy</td></tr>
<tr><td>Làm thứ ẩn hiện ra</td><td>Bọc chuỗi trong nháy, in kiểu và độ dài</td><td><code>JSON.stringify</code>, <code>typeof</code>, <code>.length</code></td></tr>
<tr><td>Tăng tần suất</td><td>Chạy 1.000 lần, thêm tải, rút ngắn timeout</td><td>Race 1/100 lần sẽ hỏng 10 lần trong 1.000 lượt (Ch8)</td></tr>
<tr><td>Cố định ngẫu nhiên</td><td>Seed cố định, đồng hồ giả, dữ liệu cố định</td><td>Lỗi múi giờ tái hiện bằng <code>TZ=Asia/Tokyo</code> (Ch8)</td></tr>
</tbody>
</table>

<h3>Phần 2 — bản tái hiện tối giản</h3>
<p>Một bản tái hiện cần cả dự án, một tệp 200 dòng và một cơ sở dữ liệu thì vẫn khó suy luận. <strong>Minimal reproduction (bản tái hiện tối giản)</strong> là đầu vào nhỏ nhất, code ít nhất và ít bước nhất mà vẫn lỗi — nhỏ tới mức bỏ thêm bất cứ gì là lỗi biến mất. Nó quan trọng vì hai lẽ: bỏ hết nhiễu thì nguyên nhân thường lộ ra ngay, và đó là thứ bạn đăng lên khi đi hỏi (Stack Overflow gọi là "minimal, reproducible example").</p>
<p><strong>Tình huống:</strong> kế toán tải lên <code>don-hang.csv</code> (200 đơn) và tổng hiện <code>NaN</code>. Đọc 200 dòng bằng mắt thì chậm và dễ sót. Hãy để máy chia dữ liệu.</p>
${MA_CSV}
<p>Script thu nhỏ áp luật "giữ nửa vẫn còn lỗi" — chính là phép chia đôi bạn sẽ dùng trên code ở bài 1.3 và trên lịch sử Git ở Chương 9:</p>
${MA_THU}
<p>Tám bước từ 200 dòng về một: <code>1.200.000</code>, giá viết theo kiểu phân cách hàng nghìn của Việt Nam, mà <code>Number()</code> không đọc được. 200 → 100 → … → 1 là lý do chia đôi mạnh tới vậy: khoảng log₂(200) ≈ 8 bước, dữ liệu lớn cỡ nào cũng thế. Dòng <code>else break</code> lo trường hợp thật thà là lỗi cần dòng ở <em>cả hai</em> nửa — khi đó bạn thu nhỏ bằng từng phần nhỏ hơn (thuật toán "delta debugging" của Zeller tổng quát hoá đúng việc này).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thu nhỏ tới mức lỗi đổi thành lỗi khác.</strong> Trong lúc cắt, kiểm xem nó vẫn là <em>cùng một</em> lỗi (cùng NaN, cùng dòng lỗi), không phải một lỗi khác do bạn cắt quá tay. Trong <code>thu-nho.js</code>, phép kiểm <code>Number.isNaN(…)</code> ghim đúng triệu chứng đó.</p></div>

<h3>🧪 Thực hành (20 phút) — thu nhỏ một lỗi không phải do bạn cài</h3>
<div class="callout ok">
<ol>
<li>Gõ <code>tong-csv.js</code> và <code>thu-nho.js</code>. Tự sinh một CSV: 300 dòng, có hai dòng "xấu" (ví dụ giá <code>"120,000"</code> có dấu phẩy, hoặc giá để trống). Nhờ một bạn chọn số dòng mà không nói cho bạn.</li>
<li>Chạy <code>node thu-nho.js</code>. Ghi lại số bước và thứ nó in ra.</li>
<li>Một trong hai dòng xấu sẽ còn lại, dòng kia thì không. Vì sao script chỉ tìm được một? Sửa dòng đó trong CSV rồi chạy lại để tìm dòng thứ hai.</li>
<li>Viết bản tái hiện ba dòng cho lỗi đăng nhập thành test <code>node:test</code>; sửa <code>dangNhap</code> để cả ba in <code>true</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> script tìm ra cả hai dòng xấu (mỗi lượt một dòng), mỗi lượt khoảng 9 bước, bạn giải thích được vì sao mỗi lượt chỉ tìm được một, và test đăng nhập đỏ trước khi sửa, xanh sau khi sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">intermittent bug (lỗi chập chờn)</span><span class="v">Lỗi "thỉnh thoảng" — thật ra là: trong điều kiện chưa ghi ra.</span></div>
  <div class="kv"><span class="k">minimal reproduction (bản tái hiện tối giản)</span><span class="v">Đầu vào/code/bước nhỏ nhất vẫn cho ra cùng lỗi.</span></div>
  <div class="kv"><span class="k">delta debugging (gỡ lỗi theo phần chênh)</span><span class="v">Bỏ dần có hệ thống từng phần của đầu vào lỗi khi nó vẫn còn lỗi.</span></div>
  <div class="kv"><span class="k">normalise (chuẩn hoá)</span><span class="v">Đưa đầu vào về một dạng chuẩn (<code>trim()</code>, <code>toLowerCase()</code>) trước khi so.</span></div>
  <div class="kv"><span class="k">seed (hạt giống ngẫu nhiên)</span><span class="v">Giá trị khởi đầu cố định khiến hành vi "ngẫu nhiên" lặp lại được.</span></div>
  <div class="kv"><span class="k">binary search (tìm kiếm nhị phân)</span><span class="v">Mỗi bước chia đôi vùng tìm: 200 → 1 trong khoảng 8 bước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không tái hiện thì không chứng minh: mọi bước sau dựa vào việc bật lỗi theo ý.</li>
<li>"Thỉnh thoảng" là điều kiện chưa biết: lọc lần hỏng, so với lần chạy, làm ký tự ẩn hiện ra.</li>
<li>Viết bản tái hiện thành script; nó trở thành test chặn tái phát.</li>
<li>Thu nhỏ đầu vào bằng chia đôi, giữ nửa còn lỗi — log₂(n) bước.</li>
<li>Khi thu nhỏ, kiểm nó vẫn là cùng triệu chứng.</li>
</ul>
${NGUON}
</div>
`,
};
