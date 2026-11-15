/** 10.4 — Bài test online (OA) HackerRank/Codility: đọc stdin Node/Java đo thật, ghi output, chiến lược thời gian, gian lận, link OA giả.
 *  Mọi mã/output đọc từ ../ma/ch10/b4 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). Số trong chữ ĐỌC từ oa-do.ts.out. */
import { doc, ma, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet } from '../_chung.mjs';
import { vetDocByte } from '../ma/ch10/b4/doc-byte.vet.mjs';

/* Số đo: đọc từ .out để chữ luôn khớp output (đo lại ⇒ chữ tự đổi). */
const DO = doc('ch10/b4/oa-do.ts.out').split('\n');
const DO_KHOI = (() => { const k = []; let cur = null; for (const l of DO) { if (/^(READ|WRITE)/.test(l)) { cur = []; k.push(cur); } else if (cur && l.includes('|')) cur.push(l); } return k; })();
/** Số ms của một hàng trong khối k (0 = đọc, 1 = ghi, 2 = đọc + ghi); cot 0 = n = 10⁵, 1 = n = 10⁶. */
function so(k, nhan, cot) {
  const dong = DO_KHOI[k].find((l) => l.startsWith(nhan));
  if (!dong) throw new Error(`oa-do.ts.out: không có hàng "${nhan}"`);
  const v = Number(dong.split('|')[cot + 1].trim());
  if (!Number.isFinite(v)) throw new Error(`oa-do.ts.out: hàng "${nhan}" cột ${cot} không phải số`);
  return v;
}
const giay = (ms, lang) => (ms >= 1000 ? (ms / 1000).toFixed(1).replace('.', lang === 'vi' ? ',' : '.') + ' s' : `${ms} ms`);
const lan = (a, b) => Math.round(a / b);

const SC = so(0, 'java Scanner', 1), BY = so(0, 'java DataInputStream', 1), TK = so(0, 'java BufferedReader+StringTok', 1);
const SC5 = so(0, 'java Scanner', 0), BY5 = so(0, 'java DataInputStream', 0);
const NFS = so(0, 'node fs.readFileSync', 1), NRL = so(0, 'node readline', 1);
const JST = so(0, 'start-up only: java', 0), NST = so(0, 'start-up only: node', 0);
const PL = so(1, 'java System.out.println', 1), PW = so(1, 'java PrintWriter', 1);
const CL = so(1, 'node console.log', 1), NJ = so(1, 'node one write', 1);
const SP = so(2, 'java Scanner + println', 1), TP = so(2, 'java Tokenizer + PrintWriter', 1);
const RC = so(2, 'node readline + console.log', 1), RJ = so(2, 'node readFileSync + one write', 1);

/* Bảng vết bộ đọc byte. */
const BYTE = '12 -3\r\n45';
const O_BYTE = [...BYTE].map((c) => (c === ' ' ? '␠' : c === '\r' ? 'CR' : c === '\n' ? 'LF' : c));
const BANG = bangVet(['byte #', 'stdin', 'byte', 'action', 'x', 'numbers so far'],
  vetDocByte(BYTE).map((h) => [
    String(h.i),
    oMang(O_BYTE, { to: h.i < O_BYTE.length ? { [h.i]: h.viec === 'skip' ? 'mo' : h.viec === 'number done' ? 'ok' : 'r' } : {} }),
    h.b === '\\r' ? 'CR' : h.b === '\\n' ? 'LF' : h.b,
    h.viec, h.x, h.so ? `<code>${h.so}</code>` : '—',
  ]));

const DE = [
  [lc(1480, 'running-sum-of-1d-array', 'Running Sum of 1d Array', 'Easy'), 'The measured task of this lesson as a function. Then rewrite it as a full stdin/stdout program.', 'Đúng bài toán được đo trong bài, dạng hàm. Sau đó viết lại thành chương trình đọc stdin/ghi stdout đầy đủ.'],
  [lc(1, 'two-sum', 'Two Sum', 'Easy'), 'Practise the OA rhythm: 10 minutes, submit, then add your own edge-case tests.', 'Luyện nhịp OA: 10 phút, nộp, rồi tự thêm test ca biên.'],
  [lc(1010, 'pairs-of-songs-with-total-durations-divisible-by-60', 'Pairs of Songs With Total Durations Divisible by 60', 'Medium'), 'Classic OA shape: count pairs with a remainder map; the count can exceed int on large n.', 'Dạng OA kinh điển: đếm cặp bằng map số dư; số cặp có thể vượt int khi n lớn.'],
  [lc(1041, 'robot-bounded-in-circle', 'Robot Bounded In Circle', 'Medium'), 'Simulation with one insight; easy to get partial credit by simulating four rounds.', 'Mô phỏng có một ý chính; dễ ăn điểm từng phần bằng cách mô phỏng bốn vòng.'],
  [lc(1094, 'car-pooling', 'Car Pooling', 'Medium'), 'Difference array / sweep line — a brute force over all stops passes the small tests first.', 'Hiệu mảng / quét — vét cạn qua mọi trạm qua được test nhỏ trước.'],
  [lc(56, 'merge-intervals', 'Merge Intervals', 'Medium'), 'Output format matters: exactly the merged list, sorted.', 'Định dạng output quan trọng: đúng danh sách đã gộp, theo thứ tự.'],
  [lc(200, 'number-of-islands', 'Number of Islands', 'Medium'), 'Grid input is where reading by tokens beats reading by lines.', 'Đầu vào dạng lưới là chỗ đọc theo token thắng đọc theo dòng.'],
  [lc(621, 'task-scheduler', 'Task Scheduler', 'Medium'), 'A counting formula beats simulation; simulation still earns partial credit.', 'Công thức đếm thắng mô phỏng; mô phỏng vẫn ăn điểm từng phần.'],
];

export default {
  title: '10.4 — Online assessments: stdin in Node and Java (measured), output, time strategy|||10.4 — Bài test online (OA): đọc stdin Node và Java có số đo, ghi output, chiến lược thời gian',
  slug: 'dsa-10-4-online',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm bài OA HackerRank/Codility: đọc stdin bằng Node (readFileSync(0), readline) và Java (Scanner, StringTokenizer, đọc byte) chạy thật với 10⁶ số, bẫy println/console.log, định dạng output, chiến lược thời gian và điểm từng phần, gian lận bằng AI và link OA giả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Online assessments: reading stdin in Node and Java, measured</h2>
<p class="lead">An online assessment (OA) is usually the first filter after your CV: a timed link, two to four problems, hidden tests, and nobody listening to you. Section 0 promised this lesson "reading stdin in Node and Java, with measurements" — because a correct algorithm still fails if it reads the input wrongly, or reads and writes it too slowly. Every number below comes from running real programs on input files of up to 10⁶ numbers, the way a judge runs them.</p>

<h3>The everyday picture: the bubble sheet and the PE grader</h3>
<p>In a multiple-choice exam graded by a scanner, a student who knows every answer but fills the bubbles one row off scores zero. The machine reads only what is in the expected place. You know this feeling from FPT's practical exams (PE): your program is run against test cases and compared with the expected output, and an extra "Result:" in front of the number is a wrong answer even if the number is right. An OA is the same machine, at company scale: it reads <em>stdin</em> (standard input — the data piped into your program), it reads your <em>stdout</em> (standard output — what you print), and it has a time limit per test.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Bài test online (OA): đọc stdin trong Node và Java, có số đo</h2>
<p class="lead">Online assessment — OA (bài test online) thường là màng lọc đầu tiên sau CV: một đường link có giờ, hai tới bốn bài, bộ test ẩn, và không ai nghe bạn nói. Mục 0 đã hứa bài này "đọc stdin trong Node và Java, có số đo" — vì thuật toán đúng vẫn trượt nếu đọc sai đầu vào, hoặc đọc và in quá chậm. Mọi con số dưới đây lấy từ việc chạy chương trình thật trên các tệp đầu vào tới 10⁶ con số, đúng cách máy chấm chạy chúng.</p>

<h3>Hình dung đời thường: phiếu tô trắc nghiệm và máy chấm PE</h3>
<p>Thi trắc nghiệm chấm bằng máy quét: một bạn biết hết đáp án nhưng tô lệch một hàng thì được 0 điểm. Máy chỉ đọc những gì nằm đúng chỗ nó chờ. Bạn đã quen cảm giác này ở các kỳ thi thực hành PE ở FPT: chương trình của bạn bị chạy với từng test case rồi so với output mong đợi, và một chữ "Result:" thừa phía trước con số là sai, dù con số đúng. Bài OA là đúng cỗ máy đó ở quy mô công ty: nó đọc <em>stdin</em> (standard input — đầu vào chuẩn, dữ liệu được "bơm" vào chương trình), đọc <em>stdout</em> (standard output — đầu ra chuẩn, những gì bạn in), và có giới hạn thời gian cho mỗi test.</p>
</div>

<div class="ml-en">
<h3>Two shapes of OA problem</h3>
<table>
<thead><tr><th>Shape</th><th>You write</th><th>Where you meet it</th><th>What can go wrong</th></tr></thead>
<tbody>
<tr><td><strong>Function signature</strong></td><td>Only the body of <code>solution(A)</code> / <code>twoSum(nums, target)</code>; the platform calls it.</td><td>LeetCode, Codility, most HackerRank company tests (the reading code is pre-written and often locked).</td><td>Wrong return type, mutating the input, overflow, slow algorithm.</td></tr>
<tr><td><strong>Full program</strong></td><td>Everything: read stdin, solve, print stdout.</td><td>Some HackerRank questions, competitive-programming-style rounds, many local company tests.</td><td>All of the above <em>plus</em> parsing the layout wrongly, slow I/O, a forgotten flush, extra text in the output.</td></tr>
</tbody></table>
<p>You need to be ready for both. The rest of this lesson is mostly about the second shape, because that is where candidates who "solved it on LeetCode" lose points.</p>
<h3>Time limits are per language — and Java's is not generous</h3>
<p>HackerRank publishes its execution environment. At the time of writing its table lists <strong>2 s</strong> for C and C++, <strong>4 s</strong> for Java (8, 17, 21), <strong>10 s</strong> for Python 3 and for TypeScript, and "N/A" for JavaScript (Node.js). A limit is the CPU time for <em>one test case</em>, and the judge's CPU is not your laptop. Codility instead reports each task as a percentage of hidden test cases passed, split into correctness tests and, for algorithmic tasks, performance tests on large inputs — so a slow but correct solution still collects the correctness part.</p>
</div>
<div class="ml-vi">
<h3>Hai dạng đề OA</h3>
<table>
<thead><tr><th>Dạng</th><th>Bạn viết</th><th>Gặp ở đâu</th><th>Hỏng ở đâu</th></tr></thead>
<tbody>
<tr><td><strong>Function signature (chữ ký hàm)</strong></td><td>Chỉ thân hàm <code>solution(A)</code> / <code>twoSum(nums, target)</code>; nền tảng tự gọi.</td><td>LeetCode, Codility, phần lớn bài test công ty trên HackerRank (code đọc đầu vào viết sẵn, thường bị khoá).</td><td>Sai kiểu trả về, sửa mảng đầu vào, tràn số, thuật toán chậm.</td></tr>
<tr><td><strong>Full program (chương trình đầy đủ)</strong></td><td>Tất cả: đọc stdin, giải, in stdout.</td><td>Một số câu HackerRank, vòng kiểu thi lập trình, nhiều bài test của công ty trong nước.</td><td>Mọi thứ ở trên <em>cộng thêm</em> đọc sai bố cục, vào/ra chậm, quên flush, in thừa chữ.</td></tr>
</tbody></table>
<p>Bạn phải sẵn sàng cho cả hai. Phần còn lại của bài chủ yếu nói về dạng thứ hai, vì đó là chỗ những bạn "giải được trên LeetCode rồi" bị mất điểm.</p>
<h3>Giới hạn thời gian tính theo ngôn ngữ — và của Java không rộng rãi</h3>
<p>HackerRank công bố môi trường chạy của họ. Lúc soạn bài, bảng của họ ghi <strong>2 giây</strong> cho C và C++, <strong>4 giây</strong> cho Java (8, 17, 21), <strong>10 giây</strong> cho Python 3 và TypeScript, và "N/A" cho JavaScript (Node.js). Giới hạn là thời gian CPU cho <em>một test case</em>, và CPU của máy chấm không phải laptop của bạn. Codility thì báo mỗi bài bằng phần trăm số test ẩn đã qua, chia thành test đúng sai (correctness) và, với bài thuật toán, test hiệu năng (performance) trên đầu vào lớn — nên một lời giải chậm mà đúng vẫn gom được phần correctness.</p>
${csd('csd201-big-o', 'vi', '0.3 Big-O: ngôn ngữ của hiệu năng', '<p>CSD201 dạy Big-O bỏ qua hằng số: O(n) là O(n) dù mỗi bước tốn 1 ns hay 100 ns. <strong>Ở đây đi sâu thêm:</strong> trong bài OA, đọc và in 10⁶ con số đều là O(n), nhưng hằng số khác nhau tới hàng chục lần — đủ để biến một lời giải đúng thành TLE. Số đo ngay bên dưới.</p>')}
</div>

<div class="ml-en">
<h3>The task we will run everywhere</h3>
<p>To compare readers fairly, every program in this lesson solves the same tiny task: <em>the first number is n, then come n integers (|x| ≤ 10⁹); print <code>sum=&lt;s&gt; max=&lt;m&gt;</code></em>. The sum of 10⁶ such numbers can reach 10¹⁵, so Java uses <code>long</code>; in JavaScript it still fits exactly in a double (below 2⁵³).</p>
<h3>Node.js: four ways to read stdin</h3>
<p>Judges run JavaScript as Node.js programs (CommonJS — <code>require</code>, not <code>import</code>). The first version is the one most people type in a hurry. Do not copy it:</p>
</div>
<div class="ml-vi">
<h3>Bài toán ta sẽ chạy ở khắp nơi</h3>
<p>Để so các cách đọc cho công bằng, mọi chương trình trong bài giải cùng một bài nhỏ: <em>số đầu tiên là n, tiếp theo là n số nguyên (|x| ≤ 10⁹); in <code>sum=&lt;tổng&gt; max=&lt;lớn nhất&gt;</code></em>. Tổng của 10⁶ số như vậy có thể tới 10¹⁵, nên Java dùng <code>long</code>; trong JavaScript nó vẫn vừa khít một số thực double (dưới 2⁵³).</p>
<h3>Node.js: bốn cách đọc stdin</h3>
<p>Máy chấm chạy JavaScript như một chương trình Node.js (kiểu CommonJS — dùng <code>require</code>, không dùng <code>import</code>). Bản đầu tiên là bản phần lớn mọi người gõ khi vội. Đừng chép nó:</p>
</div>
${ma('ch10/b4/doc-tach-cach.js', { vung: 'sai', nhan: 'Node.js — fragile (trusts the layout)' })}
<div class="ml-en">
<p>It assumes three things the problem statement rarely promises: that numbers are separated by exactly one space, that they are all on line 2, and that lines end in <code>&#92;n</code> only. The robust template reads <strong>everything</strong> once and splits on <strong>any</strong> whitespace — after that, line breaks simply do not exist:</p>
</div>
<div class="ml-vi">
<p>Nó giả định ba điều mà đề hiếm khi hứa: các số cách nhau đúng một dấu cách, tất cả nằm trên dòng 2, và dòng chỉ kết thúc bằng ký tự xuống dòng LF. Khuôn chắc chắn đọc <strong>toàn bộ</strong> một lần rồi tách theo <strong>mọi</strong> khoảng trắng — từ đó trở đi, chuyện xuống dòng không còn tồn tại:</p>
</div>
${ma('ch10/b4/doc-fs.js', { vung: 'khuon', nhan: 'Node.js — template to memorise: fs.readFileSync(0)' })}
<div class="ml-en">
<p><code>readFileSync(0, 'utf8')</code> reads file descriptor 0, which is stdin, until the end. The <code>next()</code> helper hands out one token at a time, so the solving code reads like Java's <code>sc.nextInt()</code>. The second style, <code>readline</code>, processes lines as they arrive and finishes in the <code>'close'</code> event — useful when the input is huge and you can process it line by line, but you must put all your logic inside that callback:</p>
</div>
<div class="ml-vi">
<p><code>readFileSync(0, 'utf8')</code> đọc "file descriptor" (số hiệu tệp) 0 — chính là stdin — tới hết. Hàm phụ <code>next()</code> phát ra từng token (mẩu chữ giữa các khoảng trắng) một, nên phần giải đọc giống <code>sc.nextInt()</code> của Java. Kiểu thứ hai, <code>readline</code>, xử lý từng dòng khi nó tới và kết thúc trong sự kiện <code>'close'</code> — hữu ích khi đầu vào rất lớn và xử lý được từng dòng, nhưng bạn phải đặt toàn bộ logic trong hàm callback đó:</p>
</div>
${ma('ch10/b4/doc-readline.js', { vung: 'khuon', nhan: 'Node.js — readline' })}
<div class="ml-en">
<p>The third is the shape of the boilerplate HackerRank puts in its JavaScript editor: collect chunks on <code>'data'</code>, split into lines on <code>'end'</code>, then call <code>main()</code> with a <code>readLine()</code> helper. When it is pre-written, use it — but make your own parsing token-based inside <code>main()</code>, as here:</p>
</div>
<div class="ml-vi">
<p>Kiểu thứ ba là hình dạng đoạn code mẫu (boilerplate) mà HackerRank đặt sẵn trong trình soạn JavaScript: gom các mẩu dữ liệu ở sự kiện <code>'data'</code>, tách dòng ở <code>'end'</code>, rồi gọi <code>main()</code> cùng hàm phụ <code>readLine()</code>. Có sẵn thì cứ dùng — nhưng phần tách số bên trong <code>main()</code> hãy làm theo token, như ở đây:</p>
</div>
${ma('ch10/b4/doc-hackerrank.js', { vung: 'khuon', nhan: 'Node.js — HackerRank-style boilerplate' })}

<div class="ml-en">
<h3>Java: five ways to read stdin</h3>
<p><code>Scanner</code> is what FPT's PRO192 and LAB211 teach, and it is correct on any layout — it is just slow, because each <code>nextInt()</code> runs a regular expression. <code>BufferedReader</code> reads whole lines fast; what you do with each line decides whether it is robust:</p>
</div>
<div class="ml-vi">
<h3>Java: năm cách đọc stdin</h3>
<p><code>Scanner</code> là thứ PRO192 và LAB211 ở FPT dạy, và nó đúng với mọi bố cục — chỉ chậm, vì mỗi lần <code>nextInt()</code> nó chạy một biểu thức chính quy (regex). <code>BufferedReader</code> đọc cả dòng rất nhanh; bạn làm gì với từng dòng mới quyết định nó có chắc chắn hay không:</p>
</div>
${ma('ch10/b4/DocScanner.java', { vung: 'khuon', nhan: 'Java — Scanner (correct, slow)' })}
${ma('ch10/b4/DocSplit.java', { vung: 'sai', nhan: 'Java — BufferedReader + split(" ") (fast, fragile)' })}
${ma('ch10/b4/DocTokenizer.java', { vung: 'khuon', nhan: 'Java — BufferedReader + StringTokenizer (template to memorise)' })}
<div class="ml-en">
<p>The <code>next()</code> helper is the whole trick: when the current line runs out of tokens it reads another line, so numbers may be spread over any number of lines; <code>StringTokenizer</code>'s default delimiters include space, tab, <code>&#92;r</code> and <code>&#92;n</code>, so Windows line endings and double spaces do not matter. Two more, for when speed is critical:</p>
</div>
<div class="ml-vi">
<p>Hàm phụ <code>next()</code> là toàn bộ mẹo: khi dòng hiện tại hết token, nó đọc dòng mới, nên các số có thể trải trên bao nhiêu dòng cũng được; dấu ngăn mặc định của <code>StringTokenizer</code> gồm dấu cách, tab, CR và LF, nên dòng kiểu Windows và dấu cách đôi chẳng ảnh hưởng gì. Thêm hai cách nữa, cho lúc tốc độ là sống còn:</p>
</div>
${ma('ch10/b4/DocStream.java', { vung: 'khuon', nhan: 'Java — StreamTokenizer (short, fast; numbers are doubles)' })}
${ma('ch10/b4/DocNhanh.java', { vung: 'khuon', nhan: 'Java — hand-written byte reader (fastest)' })}

<div class="ml-en">
<h3>Same input, three layouts: who survives?</h3>
<p>The problem says "n, then n integers". Real test files are produced by scripts, sometimes on Windows, sometimes with a trailing space or a line break in the middle. Here every program above runs on the same five numbers written three ways — clean, with Windows line endings (CR LF) and extra spaces, and split across three lines:</p>
</div>
<div class="ml-vi">
<h3>Cùng đầu vào, ba bố cục: ai sống sót?</h3>
<p>Đề ghi "n, rồi n số nguyên". Tệp test thật do script sinh ra, có khi trên Windows, có khi thừa một dấu cách cuối dòng hay xuống dòng giữa chừng. Ở đây mọi chương trình phía trên chạy trên cùng năm con số viết theo ba kiểu — sạch, có xuống dòng kiểu Windows (CR LF) và dấu cách thừa, và trải trên ba dòng:</p>
</div>
${ma('ch10/b4/oa-mau.ts', { vung: 'dau-vao', nhan: 'TypeScript — the three inputs (oa-mau.ts)' })}
${ketQua('ch10/b4/oa-mau.ts')}
<div class="ml-en">
<p>Read the table slowly. On layout A all nine programs agree: <code>sum=12 max=5</code>. On layout B the fragile Node version does not crash — it prints <code>sum=7 max=4</code>, because the double space produced an empty token that <code>Number('')</code> turned into 0, so it summed 3, 0, −1, 4, 1 and never saw the 5. On layout C it prints <code>sum=NaN</code>. The fragile Java version at least crashes loudly (<code>NumberFormatException</code> on the empty token, then <code>ArrayIndexOutOfBoundsException</code>). <strong>A silent wrong answer is worse than a crash</strong>: on an OA both are a red test, but only the crash tells you where to look. Every token-based reader survives all three layouts.</p>
</div>
<div class="ml-vi">
<p>Đọc chậm bảng này. Ở bố cục A cả chín chương trình đồng ý: <code>sum=12 max=5</code>. Ở bố cục B bản Node mong manh không sập — nó in <code>sum=7 max=4</code>, vì dấu cách đôi sinh ra một token rỗng mà <code>Number('')</code> biến thành 0, nên nó cộng 3, 0, −1, 4, 1 và không bao giờ thấy số 5. Ở bố cục C nó in <code>sum=NaN</code>. Bản Java mong manh ít ra còn sập ầm ĩ (<code>NumberFormatException</code> ở token rỗng, rồi <code>ArrayIndexOutOfBoundsException</code>). <strong>Sai câm còn tệ hơn sập</strong>: trên bài OA cả hai đều là một test đỏ, nhưng chỉ cú sập cho bạn biết phải nhìn vào đâu. Mọi bộ đọc theo token đều sống sót cả ba bố cục.</p>
</div>

<div class="ml-en">
<h3>Watch the fastest reader work, byte by byte</h3>
<p>Why is the byte reader immune to layout? It never thinks in lines: anything that is not a digit or a minus sign ends the current number. Here it runs on the bytes of <code>12 -3</code>, CR, LF, <code>45</code> — the table comes from running the same algorithm as <code>DocNhanh.nextLong()</code>. Grey = skipped, red = digit being folded into x, green = the byte that ends a number.</p>
</div>
<div class="ml-vi">
<h3>Xem bộ đọc nhanh nhất làm việc, từng byte</h3>
<p>Vì sao bộ đọc byte miễn nhiễm với bố cục? Nó không bao giờ nghĩ theo dòng: bất cứ thứ gì không phải chữ số hay dấu trừ đều kết thúc con số đang đọc. Ở đây nó chạy trên các byte của <code>12 -3</code>, CR, LF, <code>45</code> — bảng sinh ra bằng cách chạy đúng thuật toán của <code>DocNhanh.nextLong()</code>. Xám = bỏ qua, đỏ = chữ số đang được gộp vào x, xanh lá = byte kết thúc một số.</p>
</div>
${BANG}
<div class="ml-en">
<p>Ten rows for nine bytes plus the end of input. Row 2: the space ends 12. Row 5: the CR ends −3 — it is "not a digit", nothing more. Row 6: the LF is skipped while looking for the next number. The last row: end of input ends 45. The formula <code>x = x*10 + digit</code> is the same one you would use to parse a number by hand on paper: 4, then 4·10 + 5 = 45.</p>
${moPhong('ch10/b4/doc-byte.sim.js', 'en', 'A byte reader turning bytes into numbers', 'Bytes of "12 -3", CR, LF, "45": skip, sign, x = x*10 + digit; the log explains every byte.')}
</div>
<div class="ml-vi">
<p>Mười dòng cho chín byte cộng với điểm kết thúc đầu vào. Dòng 2: dấu cách kết thúc số 12. Dòng 5: CR kết thúc −3 — nó chỉ là "không phải chữ số", không hơn. Dòng 6: LF bị bỏ qua trong lúc tìm số kế tiếp. Dòng cuối: hết đầu vào thì kết thúc 45. Công thức <code>x = x*10 + chữ số</code> chính là cách bạn tự đổi chuỗi thành số trên giấy: 4, rồi 4·10 + 5 = 45.</p>
${moPhong('ch10/b4/doc-byte.sim.js', 'vi', 'Bộ đọc byte biến byte thành số', 'Các byte của "12 -3", CR, LF, "45": bỏ qua, dấu, x = x*10 + chữ số; nhật ký giải thích từng byte.')}
</div>

<div class="ml-en">
<h3>The measurement: 10⁶ numbers, a real process, a real file</h3>
<p>The harness below generates input files with 10⁵ and 10⁶ random integers (Park–Miller generator, so every run reads the same data), starts each program as a fresh process with stdin redirected from the file and stdout to a file, and keeps the best of three wall-clock times — the whole process, start-up included, as a judge sees it. The input files live in <code>$TMPDIR/dsa-nhap/ch10/b4/</code> and are never committed (the 10⁶ file is about 11 MB).</p>
</div>
<div class="ml-vi">
<h3>Phép đo: 10⁶ con số, tiến trình thật, tệp thật</h3>
<p>Chương trình đo dưới đây sinh tệp đầu vào 10⁵ và 10⁶ số nguyên ngẫu nhiên (bộ sinh Park–Miller, nên lần chạy nào cũng đọc đúng một bộ dữ liệu), khởi động từng chương trình thành một tiến trình mới với stdin lấy từ tệp và stdout ghi ra tệp, rồi giữ thời gian thực tốt nhất trong ba lượt — tính cả tiến trình, kể cả khởi động, đúng như máy chấm nhìn thấy. Tệp đầu vào nằm ở <code>$TMPDIR/dsa-nhap/ch10/b4/</code> và không bao giờ được commit (tệp 10⁶ số nặng khoảng 11 MB).</p>
</div>
${ma('ch10/b4/oa-do.ts', { vung: 'doc', nhan: 'TypeScript — the readers being measured (oa-do.ts)' })}
${ketQua('ch10/b4/oa-do.ts')}
<div class="ml-en">
<p><strong>Reading.</strong> Starting an empty program costs about ${JST} ms in Java and ${NST} ms in Node — subtract that from every row. At 10⁶ numbers, <code>Scanner</code> takes ${giay(SC, 'en')} against ${giay(BY, 'en')} for the byte reader and ${giay(TK, 'en')} for <code>StringTokenizer</code>: about ${lan(SC - JST, BY - JST)}× slower than the byte reader once start-up is removed. Node's <code>readFileSync</code> (${giay(NFS, 'en')}) and <code>readline</code> (${giay(NRL, 'en')}) are close to each other. So the honest version of Section 0's warning is: on this fast machine, Scanner reading 10⁶ numbers is not a time-out by itself — it is the slowest reader by a wide margin, and it spends a large slice of a 4-second budget before your algorithm runs a single step.</p>
<p><strong>Writing is the real trap.</strong> Printing 10⁶ lines with <code>System.out.println</code> takes ${giay(PL, 'en')}; the same lines through one buffered <code>PrintWriter</code> take ${giay(PW, 'en')} — ${lan(PL, PW)}×. In Node, <code>console.log</code> per line takes ${giay(CL, 'en')} against ${giay(NJ, 'en')} for one joined write — ${lan(CL, NJ)}×. Each <code>println</code>/<code>console.log</code> is pushed out to the file immediately, line by line; one buffered write sends large blocks.</p>
<p><strong>Both together, a typical OA task</strong> (read n numbers, print the running sum after each — LC 1480 as a program): Scanner + println needs ${giay(SP, 'en')}, StringTokenizer + PrintWriter ${giay(TP, 'en')}. Against a 4-second Java limit, the slow pair uses about ${Math.round(SP / 40)} % of the budget <em>on an M1 Max</em>, before any real algorithm, and you do not know how fast the judge's machine is. That is how a correct O(n) solution gets TLE.</p>
</div>
<div class="ml-vi">
<p><strong>Đọc.</strong> Khởi động một chương trình rỗng tốn khoảng ${JST} ms với Java và ${NST} ms với Node — trừ con số đó khỏi mọi hàng. Với 10⁶ số, <code>Scanner</code> mất ${giay(SC, 'vi')} so với ${giay(BY, 'vi')} của bộ đọc byte và ${giay(TK, 'vi')} của <code>StringTokenizer</code>: chậm khoảng ${lan(SC - JST, BY - JST)} lần bộ đọc byte khi đã trừ phần khởi động. <code>readFileSync</code> (${giay(NFS, 'vi')}) và <code>readline</code> (${giay(NRL, 'vi')}) của Node thì xấp xỉ nhau. Vậy phiên bản trung thực của lời cảnh báo ở Mục 0 là: trên cái máy nhanh này, riêng Scanner đọc 10⁶ số chưa tự nó gây quá giờ — nó là bộ đọc chậm nhất với khoảng cách lớn, và nó tiêu một phần đáng kể của ngân sách 4 giây trước khi thuật toán của bạn chạy bước nào.</p>
<p><strong>In ra mới là bẫy thật.</strong> In 10⁶ dòng bằng <code>System.out.println</code> mất ${giay(PL, 'vi')}; cũng ngần ấy dòng qua một <code>PrintWriter</code> có bộ đệm mất ${giay(PW, 'vi')} — gấp ${lan(PL, PW)} lần. Trong Node, <code>console.log</code> từng dòng mất ${giay(CL, 'vi')} so với ${giay(NJ, 'vi')} khi ghép lại ghi một lần — gấp ${lan(CL, NJ)} lần. Mỗi lần <code>println</code>/<code>console.log</code> đều đẩy dòng đó ra tệp ngay lập tức, từng dòng một; một lần ghi có bộ đệm thì gửi từng khối lớn.</p>
<p><strong>Cả hai cùng lúc, một bài OA điển hình</strong> (đọc n số, in tổng dồn sau mỗi số — chính là LC 1480 viết thành chương trình): Scanner + println cần ${giay(SP, 'vi')}, StringTokenizer + PrintWriter ${giay(TP, 'vi')}. So với giới hạn 4 giây cho Java, cặp chậm đã dùng khoảng ${Math.round(SP / 40)} % ngân sách <em>trên một chiếc M1 Max</em>, trước khi có thuật toán thật nào, và bạn không biết máy chấm nhanh tới đâu. Đó là cách một lời giải O(n) đúng vẫn ăn TLE. Node cũng vậy: readline + console.log ${giay(RC, 'vi')} so với readFileSync + một lần ghi ${giay(RJ, 'vi')}.</p>
</div>
${ma('ch10/b4/TongDanCham.java', { vung: 'sai', nhan: 'Java — Scanner + println' })}
${ma('ch10/b4/TongDanNhanh.java', { vung: 'khuon', nhan: 'Java — Tokenizer + one PrintWriter' })}
${ma('ch10/b4/tong-dan-nhanh.js', { vung: 'khuon', nhan: 'Node.js — read all, write once' })}

<div class="ml-en">
<h3>Output format: print exactly what the sample shows</h3>
<p>The judge compares your stdout with the expected file. Platforms differ in how forgiving they are about trailing spaces and the final newline, and their documentation rarely says — so do not rely on forgiveness. The rules that are always safe:</p>
<ul>
<li>Print <strong>exactly</strong> the format of the sample output: same separators, same order, one answer per line if the sample does so. No "Answer:", no "Case 1:" unless the sample has it.</li>
<li><strong>No debug prints.</strong> A forgotten <code>System.out.println(map)</code> or <code>console.log(arr)</code> is a wrong answer on every test. In Java you may print debugging to <code>System.err</code>, which judges ignore; in Node, <code>console.error</code>.</li>
<li>End the last line with a newline; do not print extra blank lines.</li>
<li>Booleans and floats: check the sample — <code>true</code> vs <code>True</code> vs <code>YES</code>; two decimals means <code>String.format("%.2f", x)</code> / <code>x.toFixed(2)</code>.</li>
<li><strong>Flush.</strong> A buffered writer holds the output in memory until you flush it:</li>
</ul>
</div>
<div class="ml-vi">
<h3>Định dạng output: in đúng y như output mẫu</h3>
<p>Máy chấm so stdout của bạn với tệp đáp án. Các nền tảng dễ dãi khác nhau với dấu cách cuối dòng và dòng trống cuối, và tài liệu của họ hiếm khi nói rõ — nên đừng trông vào sự dễ dãi. Những luật lúc nào cũng an toàn:</p>
<ul>
<li>In <strong>đúng y</strong> định dạng của output mẫu (sample output): cùng dấu ngăn, cùng thứ tự, mỗi đáp án một dòng nếu mẫu làm vậy. Không "Answer:", không "Case 1:" trừ khi mẫu có.</li>
<li><strong>Không in để gỡ lỗi.</strong> Một dòng <code>System.out.println(map)</code> hay <code>console.log(arr)</code> quên xoá là sai ở mọi test. Trong Java bạn in gỡ lỗi ra <code>System.err</code> — máy chấm bỏ qua luồng này; trong Node dùng <code>console.error</code>.</li>
<li>Kết thúc dòng cuối bằng một ký tự xuống dòng; đừng in thêm dòng trống.</li>
<li>Kiểu đúng/sai và số thực: xem mẫu — <code>true</code> hay <code>True</code> hay <code>YES</code>; hai chữ số thập phân thì <code>String.format("%.2f", x)</code> / <code>x.toFixed(2)</code>.</li>
<li><strong>Flush.</strong> Bộ ghi có đệm giữ output trong bộ nhớ cho tới khi bạn đẩy nó ra (flush):</li>
</ul>
</div>
${ma('ch10/b4/GhiQuenFlush.java', { vung: 'sai', nhan: 'Java — PrintWriter without flush()' })}
<div class="ml-en">
<p>The last block of the sample harness output above shows what reaches the judge: every writer prints <code>"1&#92;n2&#92;n3&#92;n"</code> except <code>GhiQuenFlush</code>, which prints <code>""</code> with exit code 0 — no crash, no error, an empty answer. In an OA that is "Wrong Answer" on every test and nothing in the editor tells you why. Put <code>out.flush()</code> (or <code>out.close()</code>) as the last line of <code>main</code> the moment you create the writer.</p>
</div>
<div class="ml-vi">
<p>Khối cuối cùng trong output của chương trình mẫu phía trên cho thấy cái gì thật sự tới tay máy chấm: mọi bộ ghi đều in <code>"1&#92;n2&#92;n3&#92;n"</code> trừ <code>GhiQuenFlush</code>, in ra <code>""</code> với mã thoát 0 — không sập, không lỗi, một câu trả lời rỗng. Trong bài OA, đó là "Wrong Answer" ở mọi test và trình soạn thảo không cho bạn biết vì sao. Hãy viết <code>out.flush()</code> (hoặc <code>out.close()</code>) ở dòng cuối của <code>main</code> ngay lúc bạn vừa tạo bộ ghi.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Java: <code>nextInt()</code> followed by <code>nextLine()</code>.</strong></p><p>The number is read, but the line break after it is not. The next <code>nextLine()</code> returns the rest of that first line — an empty string. Every PRO192 student meets it once; meet it here instead of in an OA:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Java: <code>nextInt()</code> rồi <code>nextLine()</code>.</strong></p><p>Con số được đọc, nhưng ký tự xuống dòng sau nó thì chưa. Lần <code>nextLine()</code> kế tiếp trả về phần còn lại của dòng đầu — một chuỗi rỗng. Sinh viên PRO192 nào cũng gặp nó một lần; hãy gặp ở đây thay vì trong bài OA:</p></div>
</div>
${ma('ch10/b4/BayNextLine.java', { vung: 'bay', nhan: 'Java — wrong' })}
${ma('ch10/b4/SuaNextLine.java', { vung: 'sua', nhan: 'Java — fixed' })}
<div class="ml-en">
<p>The last two lines of the sample output: <code>wrong: age=20 name=""</code> and <code>fixed: age=20 name="Nguyen Van An"</code>. With <code>StringTokenizer</code> or <code>readFileSync</code> + split you never meet this bug — another reason to read by tokens and only read whole lines when the problem really gives you text with spaces.</p>
</div>
<div class="ml-vi">
<p>Hai dòng cuối của output mẫu: <code>wrong: age=20 name=""</code> và <code>fixed: age=20 name="Nguyen Van An"</code>. Với <code>StringTokenizer</code> hay <code>readFileSync</code> + tách token thì bạn không bao giờ gặp lỗi này — thêm một lý do để đọc theo token, và chỉ đọc nguyên dòng khi đề thật sự cho một dòng văn bản có dấu cách (như họ tên).</p>
</div>

<div class="ml-en">
<h3>Time strategy for a 60–120 minute OA</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0–5′</span><span class="lz-t">Read every problem first</span><span class="lz-d">Constraints, input format, sample. Rank them by how sure you are, not by their order. Problem 3 is sometimes the easiest.</span></div>
<div class="lz-step"><span class="lz-k">Next</span><span class="lz-t">Easiest first, all the way to green</span><span class="lz-d">Fully pass one problem before touching the next. One 100 % beats two 50 %s on most scoring sheets, and it calms you down.</span></div>
<div class="lz-step"><span class="lz-k">Stuck?</span><span class="lz-t">Submit a correct brute force</span><span class="lz-d">Scores are per hidden test case: a brute force that passes the small tests collects real points (Codility's correctness part, HackerRank's passed cases). Then optimise if time is left.</span></div>
<div class="lz-step"><span class="lz-k">Before submit</span><span class="lz-t">Your own hidden tests</span><span class="lz-d">Run custom input: n = 1, all equal, negatives, the maximum value (sum overflows int → use long), the maximum size (is it fast?). Visible samples are deliberately easy.</span></div>
<div class="lz-step"><span class="lz-k">Last 10′</span><span class="lz-t">Stop starting</span><span class="lz-d">No new approaches. Make sure every problem has your best version submitted; remove debug prints; check flush.</span></div>
</div>
<p>Two practical details: many platforms keep only your <em>last</em> submission, so do not overwrite a 100 % solution with an experiment; and write your template (the token reader + buffered writer) from memory at the start — it takes one minute and removes a whole class of failures.</p>
</div>
<div class="ml-vi">
<h3>Chiến lược thời gian cho một bài OA 60–120 phút</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0–5′</span><span class="lz-t">Đọc hết các đề trước</span><span class="lz-d">Ràng buộc, định dạng đầu vào, ví dụ mẫu. Xếp hạng theo mức bạn chắc chắn, không theo thứ tự đề. Có khi bài 3 lại dễ nhất.</span></div>
<div class="lz-step"><span class="lz-k">Tiếp</span><span class="lz-t">Bài dễ nhất trước, làm tới xanh hết</span><span class="lz-d">Qua trọn một bài rồi mới đụng bài sau. Một bài 100 % thắng hai bài 50 % ở phần lớn cách chấm, và giúp bạn bình tĩnh lại.</span></div>
<div class="lz-step"><span class="lz-k">Bí?</span><span class="lz-t">Nộp một bản vét cạn đúng</span><span class="lz-d">Điểm tính theo từng test ẩn: vét cạn qua được các test nhỏ là gom được điểm thật (phần correctness của Codility, số test qua của HackerRank). Còn giờ thì tối ưu sau.</span></div>
<div class="lz-step"><span class="lz-k">Trước khi nộp</span><span class="lz-t">Bộ test ẩn của chính bạn</span><span class="lz-d">Chạy đầu vào tự đặt: n = 1, toàn bằng nhau, số âm, giá trị lớn nhất (tổng tràn int → dùng long), kích thước lớn nhất (có nhanh không?). Ví dụ mẫu hiển thị cố tình dễ.</span></div>
<div class="lz-step"><span class="lz-k">10′ cuối</span><span class="lz-t">Thôi mở hướng mới</span><span class="lz-d">Không thử cách mới nữa. Đảm bảo bài nào cũng đã nộp bản tốt nhất; xoá dòng in gỡ lỗi; kiểm flush.</span></div>
</div>
<p>Hai chi tiết thực dụng: nhiều nền tảng chỉ giữ lần nộp <em>cuối cùng</em>, nên đừng ghi đè một lời giải 100 % bằng một bản thử nghiệm; và viết khuôn đọc/ghi (bộ đọc token + bộ ghi có đệm) từ trí nhớ ngay đầu giờ — mất một phút mà loại bỏ cả một họ lỗi. Liên hệ chuyện ở trường: đây đúng là chiến thuật bạn dùng khi thi PE — làm câu chắc ăn trước, câu khó thì nộp bản chạy được phần nào hay phần đó.</p>
</div>

<div class="ml-en">
<h3>Cheating and AI in OAs — and what happens next</h3>
<p>OA platforms watch more than your code. HackerRank's help centre describes its AI-based plagiarism detection, which looks at coding behaviour such as copy-paste patterns and switching away from the test, alongside classic code-similarity checks; when it is enabled, candidates are told and must consent before starting. The same documentation is candid that the model is not perfect (it states an overall precision of about 85 %). Proctoring add-ons can take webcam snapshots and record tab switches.</p>
<p>The best-known case is public. In early 2025 Chungin "Roy" Lee, then a Columbia University student, built "Interview Coder", a desktop tool that fed AI-generated solutions into remote coding interviews, and posted a video of himself using it in an Amazon internship interview. NBC News reported that the video was taken down after an Amazon copyright claim, that Amazon said candidates must agree not to use unauthorised tools including generative AI during interviews and assessments, and that Columbia suspended him for a year after the publicity. Lesson 0.8 showed the industry-wide answer: more in-person rounds.</p>
<p>The practical consequence for you: an OA is only the gate. The next round is a live interview where someone asks "walk me through your solution to problem 2" — a solution you did not write is the fastest way to fail that conversation, and being flagged can end the process at that company. Use AI the way Section 0 said: to <em>explain</em> a pattern while practising, never during the test.</p>
</div>
<div class="ml-vi">
<h3>Gian lận và AI trong bài OA — và chuyện xảy ra sau đó</h3>
<p>Nền tảng OA theo dõi nhiều hơn code của bạn. Trung tâm trợ giúp của HackerRank mô tả hệ thống phát hiện đạo code dựa trên AI của họ: nó nhìn vào hành vi khi code như kiểu dán (copy-paste) và việc chuyển ra khỏi trang thi, bên cạnh phép so độ giống code truyền thống; khi bật tính năng này, ứng viên được báo trước và phải đồng ý mới bắt đầu làm bài. Chính tài liệu đó nói thẳng mô hình không hoàn hảo (ghi độ chính xác tổng thể khoảng 85 %). Các gói giám sát (proctoring) có thể chụp ảnh webcam định kỳ và ghi lại số lần chuyển tab.</p>
<p>Vụ nổi tiếng nhất là chuyện công khai. Đầu năm 2025, Chungin "Roy" Lee, khi đó là sinh viên Đại học Columbia, làm ra "Interview Coder" — công cụ chạy trên máy tính bơm lời giải do AI sinh vào buổi phỏng vấn coding online — và đăng video chính mình dùng nó trong buổi phỏng vấn thực tập ở Amazon. NBC News đưa tin video bị gỡ sau khiếu nại bản quyền của Amazon, Amazon nói ứng viên phải cam kết không dùng công cụ không được phép, kể cả AI tạo sinh, trong phỏng vấn và bài đánh giá, và Columbia đình chỉ học anh một năm sau vụ ồn ào. Bài 0.8 đã cho thấy câu trả lời của cả ngành: thêm nhiều vòng gặp trực tiếp.</p>
<p>Hệ quả thực tế với bạn: bài OA chỉ là cánh cổng. Vòng sau là phỏng vấn trực tiếp, nơi có người hỏi "em trình bày lại lời giải bài 2 xem nào" — một lời giải không phải bạn viết là cách nhanh nhất để trượt cuộc nói chuyện đó, còn bị gắn cờ gian lận thì có thể chấm dứt luôn hồ sơ ở công ty ấy. Dùng AI đúng như Mục 0 đã nói: để <em>giải thích</em> một mẫu bài khi luyện tập, không bao giờ trong lúc thi. Nghĩ theo kiểu đồ án ở trường: chép code của nhóm khác qua được buổi nộp, nhưng không qua được buổi bảo vệ khi thầy hỏi từng dòng.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: the fake OA link</h3>
<p>Because candidates expect "a test link from a recruiter", attackers send one. Security researchers have documented campaigns of fake coding tests: a "recruiter" on LinkedIn sends an assessment that is really a repository or archive to download and run (the "Contagious Interview" pattern from lesson 0.8), or a lookalike page that asks you to sign in with Google or GitHub to "start the test" and steals the session. Bitdefender has described recruitment scams that borrow trusted brand names in the same way. Checks that take one minute:</p>
<ul>
<li>The link's domain is the platform's real one — <code>hackerrank.com</code>, <code>codility.com</code>, <code>leetcode.com</code>, <code>coderpad.io</code> — not <code>hackerrank-assess.net</code> or a URL shortener. Hover before you click.</li>
<li>A real OA runs in the browser. "Download this project and run <code>npm install</code> to begin the test" is the red flag.</li>
<li>The invitation matches a job you applied to, from the company's domain; verify on the company's careers page or with the recruiter's official contact.</li>
<li>Never pay a "test fee" and never send ID documents to take an assessment.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: link OA giả</h3>
<p>Vì ứng viên đang chờ "một link bài test từ nhà tuyển dụng", kẻ tấn công gửi đúng thứ đó. Các nhà nghiên cứu bảo mật đã ghi nhận nhiều chiến dịch bài test coding giả: một "recruiter" trên LinkedIn gửi bài đánh giá thật ra là một repo hay tệp nén để tải về và chạy (đúng kiểu "Contagious Interview" ở bài 0.8), hoặc một trang giả mạo đòi bạn đăng nhập bằng Google hay GitHub để "bắt đầu bài test" rồi đánh cắp phiên đăng nhập. Bitdefender cũng mô tả các vụ lừa tuyển dụng mượn tên thương hiệu uy tín theo cùng cách. Những phép kiểm mất một phút:</p>
<ul>
<li>Tên miền của link đúng là của nền tảng — <code>hackerrank.com</code>, <code>codility.com</code>, <code>leetcode.com</code>, <code>coderpad.io</code> — chứ không phải <code>hackerrank-assess.net</code> hay một link rút gọn. Rê chuột xem trước khi bấm.</li>
<li>Bài OA thật chạy trong trình duyệt. "Tải dự án này về rồi chạy <code>npm install</code> để bắt đầu làm bài" chính là cờ đỏ.</li>
<li>Thư mời khớp với vị trí bạn đã ứng tuyển, gửi từ tên miền công ty; kiểm lại trên trang tuyển dụng chính thức hoặc qua kênh liên lạc chính thức của người tuyển dụng.</li>
<li>Không bao giờ trả "phí làm bài test" và không gửi giấy tờ tuỳ thân chỉ để được làm bài đánh giá.</li>
</ul>
</div>

<div class="ml-en">
<h3>Where stdin, stdout and buffering live at work</h3>
<ul>
<li><strong>Unix pipes.</strong> <code>cat access.log | grep 500 | wc -l</code> is three programs reading stdin and writing stdout — exactly an OA program's contract. Command-line tools you write at work (log filters, data migrations) are judged the same way.</li>
<li><strong>Scripts that ask questions.</strong> This repository's deploy script asks <code>[y/N]</code> when the working tree has uncommitted changes, and its own documentation says that a background run must be fed the answer through stdin, <code>echo y | bash deploy-nha.sh</code>, or it stops silently. That is stdin, in production tooling.</li>
<li><strong>Logging cost.</strong> Our measurement — one <code>console.log</code> per line is tens of times slower than one big write — is why high-traffic Node services avoid logging inside hot loops and why logging libraries buffer. This site's logger (<code>src/utils/logger.ts</code>) writes one JSON line per event in production, so log shippers can parse it — one line per event, never one per loop iteration.</li>
</ul>
</div>
<div class="ml-vi">
<h3>stdin, stdout và bộ đệm sống ở đâu khi đi làm</h3>
<ul>
<li><strong>Đường ống Unix (pipe).</strong> <code>cat access.log | grep 500 | wc -l</code> là ba chương trình đọc stdin và ghi stdout — đúng "hợp đồng" của một chương trình OA. Công cụ dòng lệnh bạn viết khi đi làm (lọc log, chuyển dữ liệu) được đánh giá y như vậy.</li>
<li><strong>Script biết hỏi.</strong> Script deploy của chính repo này hỏi <code>[y/N]</code> khi cây làm việc còn thay đổi chưa commit, và tài liệu của nó ghi rõ: chạy nền thì phải bơm câu trả lời qua stdin, <code>echo y | bash deploy-nha.sh</code>, không thì nó dừng im lặng. Đó là stdin, trong công cụ dùng thật ở production.</li>
<li><strong>Chi phí ghi log.</strong> Số đo của ta — mỗi dòng một <code>console.log</code> chậm gấp hàng chục lần một lần ghi lớn — là lý do các dịch vụ Node nhiều lưu lượng tránh ghi log trong vòng lặp nóng, và các thư viện log đều có bộ đệm. Bộ ghi log của website này (<code>src/utils/logger.ts</code>) ở production viết mỗi sự kiện một dòng JSON để công cụ gom log đọc được — mỗi sự kiện một dòng, không bao giờ mỗi vòng lặp một dòng.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 After the OA: the recruiter call</h3>
<p>An OA has no interviewer, but the call that follows often starts with it. Being able to explain what you submitted — including what you did not finish — is the bridge to the live round.</p>
${hoiThoai([
  ['I', 'Thanks for completing the assessment. Can you walk me through how you approached it?'],
  ['C', 'Sure. I read all three problems first. Problem 1 was a counting problem with a hash map, so I did it first and passed all tests. Problem 3 looked easier than problem 2, so I did it second.'],
  ['N', 'Shows strategy: read everything, easiest first — not "I started at the top".'],
  ['I', 'And problem 2?'],
  ['C', 'I saw it needed something like a sweep over sorted intervals, but I could not finish the O of n log n version in time. So I submitted a correct brute force that passed the smaller tests, and spent the last minutes testing edge cases on problems 1 and 3.'],
  ['N', 'Honest about the gap, and shows partial credit was a decision, not an accident.'],
  ['I', 'Did you run into any issues with the input?'],
  ['C', 'In Java I always use a BufferedReader with a StringTokenizer and a PrintWriter that I flush at the end — Scanner and println are several times slower on large inputs, and a test with a million lines could time out.'],
  ['I', 'If you had ten more minutes on problem 2, what would you do?'],
  ['C', 'Sort the intervals by start, then sweep once keeping the current end. That is O of n log n for the sort plus a linear pass. I would test it against my brute force on small random inputs before submitting.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Sau bài OA: cuộc gọi của nhà tuyển dụng</h3>
<p>Bài OA không có người phỏng vấn, nhưng cuộc gọi tiếp theo thường mở đầu bằng nó. Giải thích được mình đã nộp gì — kể cả phần chưa làm xong — là cây cầu sang vòng phỏng vấn trực tiếp.</p>
${hoiThoai([
  ['I', 'Cảm ơn em đã làm bài đánh giá. Em kể lại em đã tiếp cận bài thế nào được không?'],
  ['C', 'Dạ được ạ. Em đọc cả ba đề trước. Bài 1 là bài đếm dùng hash map nên em làm đầu tiên, qua hết test. Bài 3 trông dễ hơn bài 2 nên em làm thứ hai. <em>("I read all three problems first.")</em>'],
  ['N', 'Cho thấy có chiến lược: đọc hết, làm bài dễ trước — không phải "em làm từ trên xuống".'],
  ['I', 'Còn bài 2?'],
  ['C', 'Em thấy nó cần quét qua các khoảng đã sắp xếp, nhưng em không kịp xong bản O(n log n). Nên em nộp một bản vét cạn đúng, qua được các test nhỏ, và dùng mấy phút cuối test ca biên cho bài 1 và 3. <em>("I submitted a correct brute force that passed the smaller tests.")</em>'],
  ['N', 'Thật thà về phần còn thiếu, và cho thấy điểm từng phần là một quyết định chứ không phải ăn may.'],
  ['I', 'Em có gặp vấn đề gì với phần đọc đầu vào không?'],
  ['C', 'Với Java em luôn dùng BufferedReader với StringTokenizer và một PrintWriter flush ở cuối — Scanner và println chậm hơn nhiều lần khi đầu vào lớn, một test một triệu dòng có thể bị quá giờ.'],
  ['I', 'Nếu có thêm mười phút cho bài 2 thì em làm gì?'],
  ['C', 'Em sắp xếp các khoảng theo điểm đầu, rồi quét một lượt giữ điểm cuối hiện tại. Sắp xếp O(n log n) cộng một lượt tuyến tính. Em sẽ đối chiếu nó với bản vét cạn trên các đầu vào ngẫu nhiên nhỏ rồi mới nộp.'],
], 'vi')}
${lienKet({ bai: 'dsa-10-3-test', title: '10.3 — Tự test', sub: 'Đối chiếu bản nhanh với bản vét cạn trên đầu vào ngẫu nhiên', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Node: <code>import</code> and top-level <code>await</code> in an OA editor.</strong></p><p>Judges usually run your file as plain CommonJS; <code>import fs from 'fs'</code> then fails before your code starts. Use <code>require</code>. (The harness in this lesson had to run the templates as <code>.cjs</code> copies for exactly this reason: this repository is an ES-module project, a judge is not.)</p></div>
<h3>Common mistakes</h3>
<ul>
<li>Splitting on a single space (<code>split(' ')</code>, <code>split(" ")</code>) instead of reading tokens.</li>
<li>Printing with <code>println</code>/<code>console.log</code> inside a loop of 10⁵–10⁶ iterations.</li>
<li>Forgetting <code>flush()</code> on a <code>PrintWriter</code> — empty output, exit code 0.</li>
<li>Summing into <code>int</code> when the sum can exceed 2·10⁹; using <code>StreamTokenizer</code> for values beyond 2⁵³.</li>
<li>Leaving a debug print in stdout; overwriting a 100 % submission with an experiment.</li>
<li>Starting at problem 1 without reading the others.</li>
</ul>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Node: <code>import</code> và <code>await</code> ngoài hàm trong trình soạn bài OA.</strong></p><p>Máy chấm thường chạy tệp của bạn như CommonJS thuần; khi đó <code>import fs from 'fs'</code> hỏng ngay trước khi code chạy. Dùng <code>require</code>. (Chương trình đo trong bài này đã phải chạy các khuôn dưới dạng bản sao <code>.cjs</code> vì đúng lý do đó: repo này là dự án ES module, máy chấm thì không.)</p></div>
<h3>Lỗi hay gặp</h3>
<ul>
<li>Tách theo một dấu cách (<code>split(' ')</code>, <code>split(" ")</code>) thay vì đọc theo token.</li>
<li>In bằng <code>println</code>/<code>console.log</code> trong vòng lặp 10⁵–10⁶ lần.</li>
<li>Quên <code>flush()</code> với <code>PrintWriter</code> — output rỗng, mã thoát 0.</li>
<li>Cộng dồn vào <code>int</code> khi tổng có thể vượt 2·10⁹; dùng <code>StreamTokenizer</code> cho giá trị vượt 2⁵³.</li>
<li>Để sót dòng in gỡ lỗi ra stdout; ghi đè lần nộp 100 % bằng một bản thử nghiệm.</li>
<li>Lao vào bài 1 mà chưa đọc các bài còn lại.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems — OA style</h3>
${bangDe(DE, 'en')}
<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write the Node template (<code>readFileSync(0)</code> + token <code>next()</code>) and the Java template (<code>BufferedReader</code> + <code>StringTokenizer</code> + <code>PrintWriter</code> + flush) in your practice folder.</li>
<li>Create the three inputs of this lesson (clean, CR LF + double spaces, split over lines) as files and run both templates with <code>node prog.js &lt; in.txt</code> and <code>java Prog &lt; in.txt</code>. All three must print <code>sum=12 max=5</code>.</li>
<li>Generate a file with 10⁶ numbers (a 3-line script), solve "running sum" (LC 1480) as a full program twice in Java — Scanner + println, then your template — and time both with <code>time java Prog &lt; big.txt &gt; out.txt</code>.</li>
<li>Do one timed OA set: LC 1480 + LC 1010 + LC 1094 in 60 minutes, reading all three first.</li>
</ol>
<p><strong>Done when:</strong> both templates survive the three layouts, your own timing shows the slow pair at least several times slower than the template, and the 60-minute set has all three submitted.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OA (online assessment)</span><span class="v">Timed online test graded by hidden test cases.</span></div>
  <div class="kv"><span class="k">stdin / stdout</span><span class="v">The standard input your program reads and the standard output it prints; judges redirect both to files.</span></div>
  <div class="kv"><span class="k">token</span><span class="v">A piece of input between whitespace; reading by tokens ignores the line layout.</span></div>
  <div class="kv"><span class="k">buffered output / flush</span><span class="v">Collecting output in memory and sending it in big blocks; flush sends what is left.</span></div>
  <div class="kv"><span class="k">TLE / WA</span><span class="v">Time Limit Exceeded / Wrong Answer — the two verdicts I/O mistakes cause.</span></div>
  <div class="kv"><span class="k">partial score</span><span class="v">Points per hidden test passed; a correct brute force earns some.</span></div>
  <div class="kv"><span class="k">proctoring</span><span class="v">Monitoring during a test: webcam snapshots, tab switches, copy-paste tracking.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Two OA shapes: a function to fill, or a full stdin/stdout program — be ready for both.</li>
<li>Read by tokens (<code>readFileSync(0)</code> + split on whitespace; <code>BufferedReader</code> + <code>StringTokenizer</code>), never by assuming the layout.</li>
<li>Measured on 10⁶ numbers: Scanner is the slowest reader; println / console.log per line is the real time sink; together they nearly fill Java's 4-second limit.</li>
<li>Print exactly the sample format, no debug output, and flush.</li>
<li>Read every problem first, finish the easiest, submit a correct brute force for partial credit, test your own edge cases.</li>
<li>Platforms detect cheating, the next round exposes it; real OA links live on real platform domains.</li>
</ul>
${nguon('📗', 'HackerRank — Execution Environment', 'Time and memory limits per language (Java 4 s, C++ 2 s…)', 'https://support.hackerrank.com/hc/en-us/articles/6693750503-Execution-Environment')}
${nguon('📙', 'Java SE 21 — StreamTokenizer', 'Official API: nval is a double, parseNumbers, whitespace handling', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html')}
${nguon('📗', 'Node.js — readline', 'createInterface, the line and close events', 'https://nodejs.org/api/readline.html')}
${nguon('🔐', 'HackerRank — AI Plagiarism Detection', 'Signals used, consent, stated precision', 'https://hackerrank-knowledge-base.help.usepylon.com/articles/8000786908')}
${nguon('📰', 'NBC News (2025) — the Interview Coder case', 'Amazon’s statement on unauthorised tools; the suspension', 'https://www.nbcnews.com/tech/tech-news/columbia-university-student-trolls-big-tech-ai-tool-job-applications-rcna198454')}
${nguon('🔐', 'Cybersecurity News — fake coding tests', 'Attackers posing as recruiters to deliver malware through "assessments"', 'https://cybersecuritynews.com/fake-coding-tests/')}
</div>
<div class="ml-vi">
<h3>Đề luyện — kiểu OA</h3>
${bangDe(DE, 'vi')}
<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết từ trí nhớ khuôn Node (<code>readFileSync(0)</code> + hàm <code>next()</code> theo token) và khuôn Java (<code>BufferedReader</code> + <code>StringTokenizer</code> + <code>PrintWriter</code> + flush) vào thư mục luyện tập.</li>
<li>Tạo ba đầu vào của bài (sạch, CR LF + dấu cách đôi, trải nhiều dòng) thành tệp và chạy cả hai khuôn bằng <code>node prog.js &lt; in.txt</code> và <code>java Prog &lt; in.txt</code>. Cả ba phải in <code>sum=12 max=5</code>.</li>
<li>Sinh một tệp 10⁶ số (script 3 dòng), giải "tổng dồn" (LC 1480) thành chương trình đầy đủ hai lần bằng Java — Scanner + println, rồi khuôn của bạn — và đo cả hai bằng <code>time java Prog &lt; big.txt &gt; out.txt</code>.</li>
<li>Làm một bộ OA có bấm giờ: LC 1480 + LC 1010 + LC 1094 trong 60 phút, đọc cả ba đề trước.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai khuôn sống sót qua ba bố cục, số đo của chính bạn cho thấy cặp chậm chậm hơn khuôn nhiều lần, và bộ 60 phút đã nộp đủ ba bài.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OA — online assessment (bài test online)</span><span class="v">Bài thi online có giờ, chấm bằng bộ test ẩn.</span></div>
  <div class="kv"><span class="k">stdin / stdout (đầu vào / đầu ra chuẩn)</span><span class="v">Luồng chương trình đọc vào và in ra; máy chấm chuyển hướng cả hai sang tệp.</span></div>
  <div class="kv"><span class="k">token (mẩu dữ liệu)</span><span class="v">Một mẩu đầu vào nằm giữa các khoảng trắng; đọc theo token thì bỏ qua được bố cục dòng.</span></div>
  <div class="kv"><span class="k">buffered output / flush (ghi có đệm / đẩy ra)</span><span class="v">Gom output trong bộ nhớ rồi gửi từng khối lớn; flush gửi nốt phần còn lại.</span></div>
  <div class="kv"><span class="k">TLE / WA (quá giờ / sai đáp án)</span><span class="v">Hai phán quyết mà lỗi vào/ra gây ra.</span></div>
  <div class="kv"><span class="k">partial score (điểm từng phần)</span><span class="v">Điểm theo từng test ẩn đã qua; vét cạn đúng cũng ăn được một phần.</span></div>
  <div class="kv"><span class="k">proctoring (giám sát thi)</span><span class="v">Theo dõi trong lúc thi: ảnh webcam, số lần chuyển tab, dấu vết copy-paste.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai dạng OA: điền một hàm, hoặc viết cả chương trình stdin/stdout — chuẩn bị cho cả hai.</li>
<li>Đọc theo token (<code>readFileSync(0)</code> + tách theo khoảng trắng; <code>BufferedReader</code> + <code>StringTokenizer</code>), đừng bao giờ giả định bố cục.</li>
<li>Đo trên 10⁶ số: Scanner là bộ đọc chậm nhất; println / console.log từng dòng mới là chỗ ngốn giờ thật; gộp lại thì gần chạm trần 4 giây của Java.</li>
<li>In đúng định dạng mẫu, không in gỡ lỗi, nhớ flush.</li>
<li>Đọc hết đề trước, làm xong bài dễ nhất, nộp vét cạn đúng để ăn điểm từng phần, tự test ca biên.</li>
<li>Nền tảng phát hiện gian lận, vòng sau phơi bày nó; link OA thật nằm trên đúng tên miền của nền tảng.</li>
</ul>
${nguon('📗', 'HackerRank — Execution Environment', 'Giới hạn thời gian và bộ nhớ theo ngôn ngữ (Java 4 giây, C++ 2 giây…) (tiếng Anh)', 'https://support.hackerrank.com/hc/en-us/articles/6693750503-Execution-Environment')}
${nguon('📙', 'Java SE 21 — StreamTokenizer', 'Tài liệu chính thức: nval là số double, parseNumbers, xử lý khoảng trắng', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html')}
${nguon('📗', 'Node.js — readline', 'createInterface, sự kiện line và close', 'https://nodejs.org/api/readline.html')}
${nguon('🔐', 'HackerRank — AI Plagiarism Detection', 'Tín hiệu dùng để phát hiện, sự đồng ý của ứng viên, độ chính xác công bố (tiếng Anh)', 'https://hackerrank-knowledge-base.help.usepylon.com/articles/8000786908')}
${nguon('📰', 'NBC News (2025) — vụ Interview Coder', 'Tuyên bố của Amazon về công cụ không được phép; án đình chỉ (tiếng Anh)', 'https://www.nbcnews.com/tech/tech-news/columbia-university-student-trolls-big-tech-ai-tool-job-applications-rcna198454')}
${nguon('🔐', 'Cybersecurity News — bài test coding giả', 'Kẻ tấn công đóng vai recruiter, phát tán mã độc qua "bài đánh giá" (tiếng Anh)', 'https://cybersecuritynews.com/fake-coding-tests/')}
</div>
`,
};
