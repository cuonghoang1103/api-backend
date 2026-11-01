/**
 * Bài 11.5 — Regex vừa đủ dùng (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật). Deck: scripts/slides-src/wf-11-5.mjs (13 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-11-5', 'Regular expressions', 'Biểu thức chính quy', [
  [1, 'Regular expressions',
    '<p>A regular expression — regex — is a small language for describing text patterns: "ten digits", "a date like 2026-11-01", "anything between angle brackets". This lesson teaches the part you will really use, and the limits you should respect.</p>',
    '<p>Biểu thức chính quy — regex — là một ngôn ngữ nhỏ để mô tả mẫu chữ: "mười chữ số", "một ngày dạng 2026-11-01", "mọi thứ giữa hai dấu ngoặc nhọn". Bài này dạy phần bạn sẽ thật sự dùng, và những giới hạn nên tôn trọng.</p>'],
  [2, 'After this lesson you can…',
    '<p>Validate input, pull values out of text, and rewrite text. Just as important: recognise the four traps — the <code>g</code> flag, greedy matching, Vietnamese letters, and patterns that can freeze a page — that turn a one-line regex into a bug.</p>',
    '<p>Kiểm tra dữ liệu nhập, rút giá trị ra khỏi chữ, và viết lại chữ. Quan trọng không kém: nhận ra bốn cái bẫy — cờ <code>g</code>, khớp tham lam, chữ tiếng Việt, và mẫu làm treo trang — biến một regex một dòng thành bug.</p>'],
  [3, 'A tiny pattern language',
    '<p>Write a regex between slashes, or build one from a string with <code>new RegExp</code>. <code>test</code> answers yes or no. <code>match</code> returns the first match, every match with the <code>g</code> flag, or <code>null</code> when nothing matches — always check for <code>null</code>.</p>',
    '<p>Viết regex giữa hai dấu gạch chéo, hoặc dựng từ chuỗi bằng <code>new RegExp</code>. <code>test</code> trả lời có hay không. <code>match</code> trả khớp đầu tiên, mọi khớp nếu có cờ <code>g</code>, hoặc <code>null</code> khi không khớp gì — luôn kiểm <code>null</code>.</p>'],
  [4, 'The symbols you need',
    '<p>A dozen symbols cover most real patterns: character classes like <code>\\d</code> and <code>[a-z]</code>, the anchors <code>^</code> and <code>$</code>, quantifiers <code>* + ? {n,m}</code>, alternation and groups, and three flags. To match a symbol literally, escape it with a backslash.</p>',
    '<p>Khoảng chục ký hiệu phủ hầu hết mẫu thật: lớp ký tự như <code>\\d</code> và <code>[a-z]</code>, neo <code>^</code> và <code>$</code>, lượng từ <code>* + ? {n,m}</code>, "hoặc" và nhóm, cùng ba cờ. Muốn khớp chính ký hiệu thì thoát bằng dấu gạch chéo ngược.</p>'],
  [5, 'Test them one by one',
    '<p>Each line runs one pattern on one input in Chromium. The anchors are what make validation work: without <code>^</code> and <code>$</code>, "exactly ten digits" would also accept ten digits hidden inside a longer string.</p>',
    '<p>Mỗi dòng chạy một mẫu trên một đầu vào trong Chromium. Hai neo là thứ làm phép kiểm có tác dụng: thiếu <code>^</code> và <code>$</code> thì "đúng mười chữ số" cũng nhận mười chữ số nằm lẫn trong một chuỗi dài hơn.</p>'],
  [6, 'Groups',
    '<p>Parentheses capture parts of the match. Named groups make the code readable. In <code>replace</code>, <code>$1</code> means "what group 1 captured", so reformatting a date is one line; a function as the replacement can compute anything. <code>matchAll</code> loops over every match with its groups.</p>',
    '<p>Dấu ngoặc tròn bắt giữ từng phần của khớp. Nhóm có tên làm code dễ đọc. Trong <code>replace</code>, <code>$1</code> nghĩa là "thứ nhóm 1 đã bắt", nên đổi định dạng ngày chỉ một dòng; dùng một hàm làm phần thay thì tính được bất cứ gì. <code>matchAll</code> duyệt mọi khớp kèm nhóm của nó.</p>'],
  [7, 'The g flag remembers',
    '<p>With the <code>g</code> flag, a regex object keeps <code>lastIndex</code> and the next <code>test</code> starts from there. Same input, alternating true and false. For yes/no checks, never use <code>g</code>.</p>',
    '<p>Có cờ <code>g</code>, object regex giữ <code>lastIndex</code> và lần <code>test</code> sau bắt đầu từ đó. Cùng đầu vào, lúc true lúc false. Với phép kiểm có/không, đừng bao giờ dùng <code>g</code>.</p>'],
  [8, 'Greedy vs lazy',
    '<p><code>.+</code> is greedy: it takes as much as it can, so the "tag" ran to the last bracket. <code>.+?</code> takes as little as possible. Even better is saying exactly what is allowed — "anything but a closing bracket", <code>[^&gt;]+</code>.</p>',
    '<p><code>.+</code> là tham lam: nó lấy nhiều nhất có thể, nên "thẻ" chạy tới tận dấu ngoặc cuối. <code>.+?</code> lấy ít nhất có thể. Tốt hơn nữa là nói đúng cái được phép — "mọi thứ trừ dấu đóng ngoặc", <code>[^&gt;]+</code>.</p>'],
  [9, 'Vietnamese text',
    '<p><code>\\w</code> and <code>\\b</code> only know English letters, so <code>\\w+</code> chops "Nguyễn" into pieces and <code>\\b</code> finds "ăn" inside "Văn". Use <code>\\p{L}</code> with the <code>u</code> flag for letters, and normalise text to NFC before comparing — the same "ứ" can be stored in two ways.</p>',
    '<p><code>\\w</code> và <code>\\b</code> chỉ biết chữ cái tiếng Anh, nên <code>\\w+</code> băm "Nguyễn" ra từng mẩu và <code>\\b</code> tìm thấy "ăn" bên trong "Văn". Dùng <code>\\p{L}</code> với cờ <code>u</code> cho chữ cái, và chuẩn hoá chữ về NFC trước khi so sánh — cùng chữ "ứ" có thể được lưu theo hai cách.</p>'],
  [10, 'Validation: good enough',
    '<p>A practical e-mail check accepts real addresses and rejects obvious typos. It also accepts "a@b.c", which is fine: no regex can tell whether a mailbox exists. Use the browser’s <code>type="email"</code>, a simple check, then a confirmation e-mail.</p>',
    '<p>Một phép kiểm e-mail thực dụng nhận địa chỉ thật và loại lỗi gõ hiển nhiên. Nó cũng nhận "a@b.c", và thế là ổn: không regex nào biết một hộp thư có tồn tại không. Dùng <code>type="email"</code> của trình duyệt, một phép kiểm đơn giản, rồi gửi thư xác nhận.</p>'],
  [11, 'Cleaning text',
    '<p>Three everyday jobs: split on several separators and drop empty pieces, collapse runs of spaces, and turn a Vietnamese title into a URL slug by removing accents. The slug function is short enough to keep in your toolbox.</p>',
    '<p>Ba việc hằng ngày: tách theo nhiều dấu phân cách và bỏ mẩu rỗng, gộp chuỗi khoảng trắng, và biến tiêu đề tiếng Việt thành slug cho URL bằng cách bỏ dấu. Hàm slugify đủ ngắn để giữ trong hộp đồ nghề.</p>'],
  [12, 'ReDoS',
    '<p>Measured in this Chromium: a nested pattern like <code>(a+)+</code> on input that almost matches gets about four times slower for every two extra characters. At forty characters the tab would freeze. A simple pattern handled a hundred thousand characters in a fraction of a millisecond.</p>',
    '<p>Đo trong Chromium này: một mẫu lồng như <code>(a+)+</code> trên đầu vào gần khớp chậm đi khoảng bốn lần cho mỗi hai ký tự thêm vào. Tới bốn mươi ký tự thì tab sẽ treo. Một mẫu đơn giản xử lý một trăm nghìn ký tự trong chưa tới một mili giây.</p>'],
  [13, 'Summary & practice',
    '<p>The practice functions are three you will want in real projects: a phone validator, a date converter that returns <code>null</code> for bad input, and a slug maker. Test each one with a wrong input first — that is where regex bugs hide.</p>',
    '<p>Các hàm luyện tập là ba hàm bạn sẽ cần trong dự án thật: kiểm số điện thoại, đổi định dạng ngày trả <code>null</code> khi đầu vào sai, và tạo slug. Thử mỗi hàm với đầu vào SAI trước — bug regex trốn ở đó.</p>'],
]);

export default {
  title: '11.5 — Regular expressions, just enough|||11.5 — Biểu thức chính quy, vừa đủ dùng',
  slug: 'wf-11-5-regex',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Regex là gì, test/match, mười ký hiệu cần thiết, neo ^$, nhóm và replace, bẫy cờ g, tham lam và lười, tiếng Việt (\\p{L}, NFC), kiểm e-mail vừa đủ, làm sạch chữ và slugify, ReDoS đo thật trong Chromium.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>A small pattern language for text</h2>
<p class="lead">After this lesson you can validate a phone number or a file extension, pull the day, month and year out of a date string, rewrite text in one line, clean up messy user input, and turn a Vietnamese title into a URL slug. You will also recognise four traps that turn a short regex into a bug — including a pattern that can freeze a browser tab. Why it matters: form validation, search boxes, routers in frameworks, log parsing and linters are all built on regular expressions. You will read far more of them than you write, so being able to read one left to right is the real goal.</p>

<h3>Step 1 — what a regex is and how to run one</h3>
<p>A <strong>regular expression</strong> describes a pattern. You write it between two slashes (<code>/\\d/</code> = "a digit"), optionally followed by <strong>flags</strong> such as <code>i</code> (ignore case) or <code>g</code> (global: all matches). Or you build one from a string with <code>new RegExp('cat', 'i')</code>, which is useful when the pattern comes from a variable.</p>
${ma('javascript', CODE['11-5/basics.mjs'])}
${ra(OUT['11-5/basics'])}
<div class="kv-grid">
  <div class="kv"><span class="k">re.test(str)</span><span class="v">Is there a match anywhere? <code>true</code> / <code>false</code>.</span></div>
  <div class="kv"><span class="k">str.match(re)</span><span class="v">Without <code>g</code>: the first match (with details). With <code>g</code>: an array of all matched strings. No match: <code>null</code>.</span></div>
  <div class="kv"><span class="k">str.replace(re, x)</span><span class="v">Replace the first match (all with <code>g</code>, or use <code>replaceAll</code>).</span></div>
  <div class="kv"><span class="k">str.split(re)</span><span class="v">Split on every match.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>match</code> returns <code>null</code>, not an empty array.</strong> <code>'abc'.match(/\\d+/)</code> is <code>null</code> (last output line), so <code>'abc'.match(/\\d+/).length</code> crashes with "Cannot read properties of null". Write <code>(str.match(re) ?? []).length</code>, or use <code>test</code> when you only need yes/no.</p></div>

<h3>Step 2 — the symbols you actually need</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">\\d  \\w  \\s</span><span class="v">a digit · a "word" character (English letter, digit, underscore) · whitespace. Capitals mean "not": <code>\\D</code>, <code>\\W</code>, <code>\\S</code>.</span></div>
  <div class="kv"><span class="k">.</span><span class="v">any single character except a newline.</span></div>
  <div class="kv"><span class="k">[abc]  [^abc]  [a-z]</span><span class="v">one of these · any except these · a range.</span></div>
  <div class="kv"><span class="k">^  $</span><span class="v">start and end of the text — the anchors.</span></div>
  <div class="kv"><span class="k">*  +  ?</span><span class="v">0 or more · 1 or more · 0 or 1 (optional) of the thing before.</span></div>
  <div class="kv"><span class="k">{n}  {n,m}</span><span class="v">exactly n times · between n and m times.</span></div>
  <div class="kv"><span class="k">a|b  ( )</span><span class="v">either side · a group (also captures, step 3).</span></div>
  <div class="kv"><span class="k">\\. \\$ \\( …</span><span class="v">a backslash makes a special symbol literal.</span></div>
</div>
${ma('javascript', CODE['11-5/symbols.mjs'])}
${ra(OUT['11-5/symbols'])}
<p>Read a pattern left to right like a sentence. <code>^0[35789]\\d{8}$</code>: "at the start, a 0, then one of 3, 5, 7, 8 or 9, then exactly eight digits, then the end". That is the shape of a Vietnamese mobile number, and the fourth line correctly rejects a landline starting with 02.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — forgetting the anchors.</strong> <code>/\\d{10}/</code> means "ten digits somewhere", so it also accepts <code>"call 0912345678 now"</code> or an 11-digit number. For validation always anchor both ends: <code>/^\\d{10}$/</code>. Without anchors you are <em>searching</em>, not <em>validating</em>.</p></div>

<h3>Step 3 — groups: extract and rewrite</h3>
${ma('javascript', CODE['11-5/groups.mjs'])}
${ra(OUT['11-5/groups'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">( ) captures</span><span class="lz-d"><code>m[1]</code>, <code>m[2]</code>… hold what each group matched; <code>m[0]</code> is the whole match.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">(?&lt;name&gt; ) names it</span><span class="lz-d">Read <code>m.groups.year</code> instead of counting brackets.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">$1 in replace</span><span class="lz-d">Reuse captured parts: <code>'$3/$2/$1'</code> turns ISO dates into Vietnamese order.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A function in replace</span><span class="lz-d">Compute the replacement — here, format digits as money.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">matchAll(re with g)</span><span class="lz-d">Loop over every match, each with its groups.</span></div>
</div>

<h3>Trap: the <code>g</code> flag makes a regex remember</h3>
${ma('javascript', CODE['11-5/global-trap.mjs'])}
${ra(OUT['11-5/global-trap'])}
<p>With <code>g</code>, the regex object stores <code>lastIndex</code> — where the last match ended — and the next <code>test</code> starts searching from there. Testing the same string three times gave true, false, true. In real code this shows up as a validator that rejects every second form submission. Rule: use <code>g</code> only with <code>match</code>, <code>matchAll</code>, <code>replace</code>; never on a regex you reuse for <code>test</code>.</p>

<h3>Trap: greedy versus lazy</h3>
${ma('javascript', CODE['11-5/greedy.mjs'])}
${ra(OUT['11-5/greedy'])}
<p>Quantifiers are <strong>greedy</strong>: <code>.+</code> grabs as much as it can and only backs off as far as needed for the final <code>&gt;</code> to match — the last one in the string. Adding <code>?</code> makes it <strong>lazy</strong> (as little as possible). The most robust option is to say exactly what is allowed: <code>[^&gt;]+</code>, "one or more characters that are not a closing bracket".</p>

<h3>Trap: Vietnamese text</h3>
${ma('javascript', CODE['11-5/vietnamese.mjs'])}
${ra(OUT['11-5/vietnamese'])}
<p><code>\\w</code> only knows <code>a-z</code>, <code>A-Z</code>, digits and underscore, so "Nguyễn" was cut into "Nguy" and "n". The word boundary <code>\\b</code> uses the same ASCII idea of a letter, so <code>/\\băn\\b/</code> wrongly found "ăn" inside "Văn" — "V" is a letter, but "ă" is not, so there is a "boundary" between them. The fixes: <code>\\p{L}</code> ("any letter in any language") with the <code>u</code> flag, and a Unicode-aware boundary built from lookarounds. Finally, the same word can be stored in two ways: precomposed (NFC, 3 characters) or base letters plus combining accents (NFD, 5 characters). They look identical and are not <code>===</code> — normalise with <code>.normalize('NFC')</code> before comparing or searching.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a search that works on your machine and fails for a user.</strong> Text pasted from macOS, PDFs or some keyboards can arrive in NFD. A search for "Đức" then finds nothing although the word is visibly there. Normalise input when you store it and when you search; it costs one call.</p></div>

<h3>Validation: good enough, then stop</h3>
${ma('javascript', CODE['11-5/email.mjs'])}
${ra(OUT['11-5/email'])}
<p>This pattern — something, an @, something, a dot, something, no spaces — catches typing mistakes and nothing more. It accepts <code>a@b.c</code>, and that is fine: whether a mailbox exists can only be proven by sending it a message. The full standard for e-mail addresses is so complex that "perfect" regexes run to thousands of characters and still disagree with real mail servers.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting client-side validation.</strong> A regex in the browser is a convenience for the user, not security: anyone can send a request to your API without your form. Validate again on the server (Chapter 6 and the Node.js course), and for e-mail rely on a confirmation link.</p></div>

<h3>Cleaning text</h3>
${ma('javascript', CODE['11-5/split-clean.mjs'])}
${ra(OUT['11-5/split-clean'])}
<p>Splitting on a single comma left spaces, an empty piece and a semicolon (line 1). Splitting on a character class <code>[,;]</code>, trimming and filtering out empty strings gives a clean list. <code>\\s+</code> collapses any run of whitespace. The slug function decomposes letters (NFD), removes the combining marks with <code>\\p{M}</code>, handles <code>đ</code> separately (it has no combining form), and turns every run of other characters into one dash.</p>

<h3>ReDoS — a pattern that can freeze the page</h3>
${ma('javascript', CODE['11-5/redos.mjs'])}
${ra(OUT['11-5/redos'])}
<p>These timings were measured in the Chromium that ran this lesson (the first line includes start-up cost). <code>^(a+)+$</code> on "aaaa…!" fails, but before failing it tries every way of splitting the a's between the inner and outer <code>+</code>: the work roughly quadruples for every two extra characters (7 → 28 → 110&nbsp;ms). Extrapolate to 40 characters and the tab is frozen for hours. The simple <code>^a+$</code> handled 100,000 characters in well under a millisecond. This class of bug is called <strong>ReDoS</strong> (regular-expression denial of service), and it has taken real services offline.</p>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Danger sign</span><span class="lz-t">a quantifier inside a quantified group</span><span class="lz-d"><code>(a+)+</code>, <code>(\\w*)*</code>, <code>(a|aa)+</code></span></div>
<div class="lz-node"><span class="lz-k">Fix</span><span class="lz-t">make each character match only one way</span><span class="lz-d"><code>^a+$</code>, or limit length first: <code>if (s.length &gt; 200) reject</code>.</span></div>
<div class="lz-node"><span class="lz-k">When regex is the wrong tool</span><span class="lz-t">nested structure</span><span class="lz-d">HTML, JSON, programming languages — use a real parser (<code>DOMParser</code>, <code>JSON.parse</code>).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Write three functions and test each one with wrong input first:</p>
<ul>
<li><code>isVnMobile(s)</code> — true for 10 digits starting with 03, 05, 07, 08 or 09; false for spaces, letters, 02… landlines, 9 or 11 digits.</li>
<li><code>toIsoDate(s)</code> — <code>"01/11/2026"</code> ⇒ <code>"2026-11-01"</code>; anything not in <code>dd/mm/yyyy</code> form ⇒ <code>null</code>. Use named groups.</li>
<li><code>slugify(s)</code> — <code>"Học CSS Nâng Cao!"</code> ⇒ <code>"hoc-css-nang-cao"</code>; <code>"Đà Nẵng"</code> ⇒ <code>"da-nang"</code>.</li>
</ul>
<p><strong>Done when:</strong> all the examples above give the stated result in the browser console, <code>isVnMobile(" 0912345678")</code> is false (anchors!), and calling <code>isVnMobile</code> twice in a row with the same valid number gives true both times (no <code>g</code> flag). Code Lab module 11.5 runs exactly these checks.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">regular expression (regex)</span><span class="v">biểu thức chính quy — mẫu mô tả chữ.</span></div>
  <div class="kv"><span class="k">character class</span><span class="v">lớp ký tự — <code>\\d</code>, <code>[a-z]</code>: một ký tự thuộc nhóm nào.</span></div>
  <div class="kv"><span class="k">anchor</span><span class="v">neo — <code>^</code> đầu chuỗi, <code>$</code> cuối chuỗi.</span></div>
  <div class="kv"><span class="k">quantifier</span><span class="v">lượng từ — <code>* + ? {n,m}</code>: lặp bao nhiêu lần.</span></div>
  <div class="kv"><span class="k">capture group</span><span class="v">nhóm bắt — phần trong <code>( )</code> được giữ lại để dùng.</span></div>
  <div class="kv"><span class="k">flag</span><span class="v">cờ — <code>i</code> bỏ qua hoa/thường, <code>g</code> toàn cục, <code>u</code> Unicode.</span></div>
  <div class="kv"><span class="k">greedy / lazy</span><span class="v">tham lam / lười — lấy nhiều nhất / ít nhất có thể.</span></div>
  <div class="kv"><span class="k">Unicode normalization (NFC/NFD)</span><span class="v">chuẩn hoá Unicode — dạng dựng sẵn / dạng tách dấu.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">từ chối dịch vụ bằng regex — mẫu chạy lâu theo cấp số nhân.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A regex is a pattern; <code>test</code> for yes/no, <code>match</code>/<code>matchAll</code> to extract, <code>replace</code> to rewrite — and <code>match</code> can return <code>null</code>.</li>
  <li>A dozen symbols cover most needs; read patterns left to right; escape special characters.</li>
  <li>Validation needs <code>^…$</code>; never reuse a <code>g</code> regex with <code>test</code>.</li>
  <li>Prefer precise classes (<code>[^&gt;]+</code>) over greedy <code>.+</code>.</li>
  <li>Vietnamese: <code>\\p{L}</code> with the <code>u</code> flag, and <code>normalize('NFC')</code> before comparing.</li>
  <li>Keep patterns simple; nested quantifiers can freeze the page; use parsers for nested formats.</li>
</ul>
${nguon('📘', 'javascript.info — Regular expressions', 'A whole tutorial chapter: classes, anchors, groups, lookarounds, catastrophic backtracking', 'https://javascript.info/regular-expressions')}
${nguon('🧪', 'regex101.com', 'Paste a pattern and test text; it explains every symbol (choose the ECMAScript flavour)', 'https://regex101.com/')}
${lienKet({ khoa: 'react', bai: 'rx-3-4-tieng-viet', title: 'React 3.4 — typing Vietnamese: IME, Enter and NFC/NFD', sub: 'Normalisation in a real search box and the composition-event trap', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-3-dau-vao-doc-hai', title: 'Node.js 9.3 — input is the enemy: ReDoS, prototype pollution, SSRF', sub: 'The ReDoS from this lesson, attacking a real Express server', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-3-validate-schema', title: 'Node.js 6.3 — validating data with a schema', sub: 'How a schema library replaces hand-written regexes on the server', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Một ngôn ngữ mẫu nhỏ dành cho chữ</h2>
<p class="lead">Học xong bài này bạn kiểm được số điện thoại hay đuôi file, rút được ngày, tháng, năm ra khỏi một chuỗi ngày, viết lại chữ trong một dòng, làm sạch dữ liệu người dùng gõ bừa, và biến tiêu đề tiếng Việt thành slug cho URL. Bạn cũng nhận ra bốn cái bẫy biến một regex ngắn thành bug — kể cả một mẫu có thể làm treo tab trình duyệt. Vì sao cần: kiểm tra form, ô tìm kiếm, bộ định tuyến của framework, đọc log và linter đều dựng trên biểu thức chính quy. Bạn sẽ ĐỌC chúng nhiều hơn VIẾT rất nhiều, nên đọc được một regex từ trái sang phải mới là mục tiêu thật.</p>

<h3>Bước 1 — regex là gì và chạy thế nào</h3>
<p><strong>Biểu thức chính quy (regular expression)</strong> mô tả một mẫu. Bạn viết nó giữa hai dấu gạch chéo (<code>/\\d/</code> = "một chữ số"), có thể kèm <strong>cờ (flag)</strong> như <code>i</code> (bỏ qua hoa/thường) hay <code>g</code> (toàn cục: mọi khớp). Hoặc dựng từ chuỗi bằng <code>new RegExp('cat', 'i')</code>, tiện khi mẫu đến từ một biến.</p>
${ma('javascript', CODE['11-5/basics.mjs'])}
${ra(OUT['11-5/basics'])}
<div class="kv-grid">
  <div class="kv"><span class="k">re.test(str)</span><span class="v">Có khớp ở đâu không? <code>true</code> / <code>false</code>.</span></div>
  <div class="kv"><span class="k">str.match(re)</span><span class="v">Không <code>g</code>: khớp đầu tiên (kèm chi tiết). Có <code>g</code>: mảng mọi chuỗi khớp. Không khớp: <code>null</code>.</span></div>
  <div class="kv"><span class="k">str.replace(re, x)</span><span class="v">Thay khớp đầu tiên (tất cả nếu có <code>g</code>, hoặc dùng <code>replaceAll</code>).</span></div>
  <div class="kv"><span class="k">str.split(re)</span><span class="v">Tách ở mọi chỗ khớp.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>match</code> trả <code>null</code>, không phải mảng rỗng.</strong> <code>'abc'.match(/\\d+/)</code> là <code>null</code> (dòng output cuối), nên <code>'abc'.match(/\\d+/).length</code> sập với "Cannot read properties of null". Hãy viết <code>(str.match(re) ?? []).length</code>, hoặc dùng <code>test</code> khi chỉ cần có/không.</p></div>

<h3>Bước 2 — những ký hiệu bạn thật sự cần</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">\\d  \\w  \\s</span><span class="v">một chữ số · một ký tự "từ" (chữ cái tiếng Anh, số, gạch dưới) · khoảng trắng. Viết hoa nghĩa là "không phải": <code>\\D</code>, <code>\\W</code>, <code>\\S</code>.</span></div>
  <div class="kv"><span class="k">.</span><span class="v">một ký tự bất kỳ trừ xuống dòng.</span></div>
  <div class="kv"><span class="k">[abc]  [^abc]  [a-z]</span><span class="v">một trong các ký tự này · bất kỳ trừ các ký tự này · một khoảng.</span></div>
  <div class="kv"><span class="k">^  $</span><span class="v">đầu và cuối chuỗi — hai cái neo.</span></div>
  <div class="kv"><span class="k">*  +  ?</span><span class="v">0 lần trở lên · 1 lần trở lên · 0 hoặc 1 lần (tuỳ chọn) của thứ đứng trước.</span></div>
  <div class="kv"><span class="k">{n}  {n,m}</span><span class="v">đúng n lần · từ n tới m lần.</span></div>
  <div class="kv"><span class="k">a|b  ( )</span><span class="v">vế này hoặc vế kia · một nhóm (cũng bắt giữ, bước 3).</span></div>
  <div class="kv"><span class="k">\\. \\$ \\( …</span><span class="v">dấu gạch chéo ngược biến ký hiệu đặc biệt thành chữ thường.</span></div>
</div>
${ma('javascript', CODE['11-5/symbols.mjs'])}
${ra(OUT['11-5/symbols'])}
<p>Đọc một mẫu từ trái sang phải như đọc câu. <code>^0[35789]\\d{8}$</code>: "ở đầu, một số 0, rồi một trong 3, 5, 7, 8, 9, rồi đúng tám chữ số, rồi hết". Đó là hình dạng số di động Việt Nam, và dòng thứ tư loại đúng một số máy bàn bắt đầu bằng 02.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên neo.</strong> <code>/\\d{10}/</code> nghĩa là "mười chữ số ở đâu đó", nên nó nhận cả <code>"gọi 0912345678 nhé"</code> lẫn một số 11 chữ số. Để kiểm tra thì luôn neo cả hai đầu: <code>/^\\d{10}$/</code>. Thiếu neo là bạn đang <em>tìm kiếm</em>, không phải <em>kiểm tra</em>.</p></div>

<h3>Bước 3 — nhóm: rút ra và viết lại</h3>
${ma('javascript', CODE['11-5/groups.mjs'])}
${ra(OUT['11-5/groups'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">( ) bắt giữ</span><span class="lz-d"><code>m[1]</code>, <code>m[2]</code>… giữ thứ từng nhóm đã khớp; <code>m[0]</code> là cả khớp.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">(?&lt;name&gt; ) đặt tên</span><span class="lz-d">Đọc <code>m.groups.year</code> thay vì đếm ngoặc.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">$1 trong replace</span><span class="lz-d">Dùng lại phần đã bắt: <code>'$3/$2/$1'</code> đổi ngày ISO sang thứ tự Việt Nam.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hàm trong replace</span><span class="lz-d">Tính phần thay thế — ở đây là định dạng số thành tiền.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">matchAll(re có g)</span><span class="lz-d">Duyệt mọi khớp, mỗi khớp kèm các nhóm của nó.</span></div>
</div>

<h3>Bẫy: cờ <code>g</code> làm regex "nhớ"</h3>
${ma('javascript', CODE['11-5/global-trap.mjs'])}
${ra(OUT['11-5/global-trap'])}
<p>Có <code>g</code>, object regex lưu <code>lastIndex</code> — chỗ lần khớp trước kết thúc — và lần <code>test</code> sau bắt đầu tìm từ đó. Kiểm cùng một chuỗi ba lần ra true, false, true. Trong code thật nó hiện ra thành một hàm kiểm tra từ chối mọi lần gửi form thứ hai. Luật: chỉ dùng <code>g</code> với <code>match</code>, <code>matchAll</code>, <code>replace</code>; không bao giờ trên regex bạn dùng lại cho <code>test</code>.</p>

<h3>Bẫy: tham lam và lười</h3>
${ma('javascript', CODE['11-5/greedy.mjs'])}
${ra(OUT['11-5/greedy'])}
<p>Lượng từ mặc định <strong>tham lam (greedy)</strong>: <code>.+</code> chộp nhiều nhất có thể và chỉ lùi vừa đủ để dấu <code>&gt;</code> cuối khớp — dấu cuối cùng trong chuỗi. Thêm <code>?</code> làm nó <strong>lười (lazy)</strong> (ít nhất có thể). Cách chắc chắn nhất là nói đúng cái được phép: <code>[^&gt;]+</code>, "một hoặc nhiều ký tự không phải dấu đóng ngoặc".</p>

<h3>Bẫy: chữ tiếng Việt</h3>
${ma('javascript', CODE['11-5/vietnamese.mjs'])}
${ra(OUT['11-5/vietnamese'])}
<p><code>\\w</code> chỉ biết <code>a-z</code>, <code>A-Z</code>, chữ số và gạch dưới, nên "Nguyễn" bị cắt thành "Nguy" và "n". Ranh giới từ <code>\\b</code> dùng cùng quan niệm chữ cái ASCII, nên <code>/\\băn\\b/</code> tìm nhầm "ăn" bên trong "Văn" — "V" là chữ cái, còn "ă" thì không, nên giữa chúng có một "ranh giới". Cách sửa: <code>\\p{L}</code> ("mọi chữ cái của mọi ngôn ngữ") với cờ <code>u</code>, và một ranh giới hiểu Unicode dựng bằng lookaround. Cuối cùng, cùng một từ có thể được lưu theo hai cách: dựng sẵn (NFC, 3 ký tự) hoặc chữ gốc cộng dấu tổ hợp (NFD, 5 ký tự). Trông y hệt mà không <code>===</code> — chuẩn hoá bằng <code>.normalize('NFC')</code> trước khi so sánh hay tìm kiếm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ô tìm kiếm chạy trên máy bạn mà hỏng với người dùng.</strong> Chữ dán từ macOS, từ PDF hoặc một số bộ gõ có thể tới ở dạng NFD. Tìm "Đức" khi đó không ra gì dù chữ nằm ngay trước mắt. Chuẩn hoá dữ liệu lúc lưu và lúc tìm; chỉ tốn một lời gọi.</p></div>

<h3>Kiểm tra: vừa đủ, rồi dừng</h3>
${ma('javascript', CODE['11-5/email.mjs'])}
${ra(OUT['11-5/email'])}
<p>Mẫu này — một thứ gì đó, một @, một thứ gì đó, một dấu chấm, một thứ gì đó, không khoảng trắng — chỉ bắt lỗi gõ, không hơn. Nó nhận <code>a@b.c</code>, và thế là ổn: hộp thư có tồn tại không chỉ chứng minh được bằng cách gửi thư tới. Chuẩn đầy đủ cho địa chỉ e-mail phức tạp tới mức các regex "hoàn hảo" dài hàng nghìn ký tự mà vẫn bất đồng với máy chủ thư thật.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin vào kiểm tra phía trình duyệt.</strong> Regex trong trình duyệt là tiện ích cho người dùng, không phải bảo mật: ai cũng gửi request thẳng tới API của bạn được mà không cần form. Kiểm tra lại ở máy chủ (Chương 6 và khoá Node.js), và với e-mail thì dựa vào đường link xác nhận.</p></div>

<h3>Làm sạch chữ</h3>
${ma('javascript', CODE['11-5/split-clean.mjs'])}
${ra(OUT['11-5/split-clean'])}
<p>Tách theo một dấu phẩy để lại khoảng trắng, một mẩu rỗng và một dấu chấm phẩy (dòng 1). Tách theo lớp ký tự <code>[,;]</code>, cắt khoảng trắng và lọc bỏ chuỗi rỗng cho danh sách sạch. <code>\\s+</code> gộp mọi chuỗi khoảng trắng. Hàm slugify tách chữ (NFD), bỏ dấu tổ hợp bằng <code>\\p{M}</code>, xử lý riêng <code>đ</code> (chữ này không có dạng tổ hợp), và biến mỗi chuỗi ký tự còn lại thành một dấu gạch ngang.</p>

<h3>ReDoS — một mẫu có thể làm treo trang</h3>
${ma('javascript', CODE['11-5/redos.mjs'])}
${ra(OUT['11-5/redos'])}
<p>Các thời gian này đo trong chính Chromium đã chạy bài học (dòng đầu gồm cả chi phí khởi động). <code>^(a+)+$</code> trên "aaaa…!" sẽ thất bại, nhưng trước khi thất bại nó thử mọi cách chia các chữ a giữa dấu <code>+</code> trong và ngoài: công việc tăng khoảng bốn lần cho mỗi hai ký tự thêm (7 → 28 → 110&nbsp;ms). Ngoại suy tới 40 ký tự là tab treo hàng giờ. Mẫu đơn giản <code>^a+$</code> xử lý 100.000 ký tự trong chưa tới một mili giây. Loại bug này gọi là <strong>ReDoS</strong> (từ chối dịch vụ bằng biểu thức chính quy), và nó đã từng làm sập dịch vụ thật.</p>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Dấu hiệu nguy hiểm</span><span class="lz-t">lượng từ nằm trong một nhóm có lượng từ</span><span class="lz-d"><code>(a+)+</code>, <code>(\\w*)*</code>, <code>(a|aa)+</code></span></div>
<div class="lz-node"><span class="lz-k">Cách sửa</span><span class="lz-t">mỗi ký tự chỉ khớp được một cách</span><span class="lz-d"><code>^a+$</code>, hoặc giới hạn độ dài trước: <code>if (s.length &gt; 200) từ chối</code>.</span></div>
<div class="lz-node"><span class="lz-k">Khi regex là công cụ sai</span><span class="lz-t">cấu trúc lồng nhau</span><span class="lz-d">HTML, JSON, ngôn ngữ lập trình — dùng bộ phân tích thật (<code>DOMParser</code>, <code>JSON.parse</code>).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Viết ba hàm và thử mỗi hàm với đầu vào SAI trước:</p>
<ul>
<li><code>isVnMobile(s)</code> — true với 10 chữ số bắt đầu bằng 03, 05, 07, 08 hoặc 09; false với khoảng trắng, chữ cái, máy bàn 02…, 9 hoặc 11 chữ số.</li>
<li><code>toIsoDate(s)</code> — <code>"01/11/2026"</code> ⇒ <code>"2026-11-01"</code>; mọi thứ không ở dạng <code>dd/mm/yyyy</code> ⇒ <code>null</code>. Dùng nhóm có tên.</li>
<li><code>slugify(s)</code> — <code>"Học CSS Nâng Cao!"</code> ⇒ <code>"hoc-css-nang-cao"</code>; <code>"Đà Nẵng"</code> ⇒ <code>"da-nang"</code>.</li>
</ul>
<p><strong>Xong khi:</strong> mọi ví dụ trên cho đúng kết quả trong Console, <code>isVnMobile(" 0912345678")</code> là false (neo!), và gọi <code>isVnMobile</code> hai lần liền với cùng một số hợp lệ đều ra true (không có cờ <code>g</code>). Code Lab module 11.5 chạy đúng những phép kiểm này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">regular expression (regex)</span><span class="v">biểu thức chính quy — mẫu mô tả chữ.</span></div>
  <div class="kv"><span class="k">character class</span><span class="v">lớp ký tự — <code>\\d</code>, <code>[a-z]</code>: một ký tự thuộc nhóm nào.</span></div>
  <div class="kv"><span class="k">anchor</span><span class="v">neo — <code>^</code> đầu chuỗi, <code>$</code> cuối chuỗi.</span></div>
  <div class="kv"><span class="k">quantifier</span><span class="v">lượng từ — <code>* + ? {n,m}</code>: lặp bao nhiêu lần.</span></div>
  <div class="kv"><span class="k">capture group</span><span class="v">nhóm bắt — phần trong <code>( )</code> được giữ lại để dùng.</span></div>
  <div class="kv"><span class="k">flag</span><span class="v">cờ — <code>i</code> bỏ qua hoa/thường, <code>g</code> toàn cục, <code>u</code> Unicode.</span></div>
  <div class="kv"><span class="k">greedy / lazy</span><span class="v">tham lam / lười — lấy nhiều nhất / ít nhất có thể.</span></div>
  <div class="kv"><span class="k">Unicode normalization (NFC/NFD)</span><span class="v">chuẩn hoá Unicode — dạng dựng sẵn / dạng tách dấu.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">từ chối dịch vụ bằng regex — mẫu chạy lâu theo cấp số nhân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Regex là một mẫu; <code>test</code> để hỏi có/không, <code>match</code>/<code>matchAll</code> để rút ra, <code>replace</code> để viết lại — và <code>match</code> có thể trả <code>null</code>.</li>
  <li>Khoảng chục ký hiệu đủ cho hầu hết nhu cầu; đọc mẫu từ trái sang phải; thoát ký tự đặc biệt.</li>
  <li>Kiểm tra cần <code>^…$</code>; không bao giờ dùng lại regex có <code>g</code> cho <code>test</code>.</li>
  <li>Ưu tiên lớp ký tự chính xác (<code>[^&gt;]+</code>) hơn <code>.+</code> tham lam.</li>
  <li>Tiếng Việt: <code>\\p{L}</code> với cờ <code>u</code>, và <code>normalize('NFC')</code> trước khi so sánh.</li>
  <li>Giữ mẫu đơn giản; lượng từ lồng nhau có thể làm treo trang; định dạng lồng nhau thì dùng bộ phân tích.</li>
</ul>
${nguon('📘', 'javascript.info — Regular expressions', 'Cả một chương: lớp ký tự, neo, nhóm, lookaround, backtracking thảm hoạ', 'https://javascript.info/regular-expressions')}
${nguon('🧪', 'regex101.com', 'Dán mẫu và chữ để thử; trang giải thích từng ký hiệu (chọn ECMAScript)', 'https://regex101.com/')}
${lienKet({ khoa: 'react', bai: 'rx-3-4-tieng-viet', title: 'React 3.4 — gõ tiếng Việt: IME, Enter và NFC/NFD', sub: 'Chuẩn hoá trong một ô tìm kiếm thật và bẫy composition event', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-3-dau-vao-doc-hai', title: 'Node.js 9.3 — đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, SSRF', sub: 'Chính ReDoS của bài này, tấn công một máy chủ Express thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-3-validate-schema', title: 'Node.js 6.3 — kiểm tra dữ liệu bằng lược đồ', sub: 'Thư viện schema thay regex viết tay ở máy chủ thế nào', cta: 'Mở bài' })}
</div>
`,
};
