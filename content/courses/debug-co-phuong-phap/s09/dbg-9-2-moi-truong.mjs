/**
 * 9.2 — "Máy em chạy mà": so phiên bản, biến môi trường, lockfile, hệ điều hành và dữ liệu (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 18.20 / 20.20 / 22.23 / 24.22 (ảnh node:*-alpine), Node 22.22 máy nhà, jsonwebtoken 9.0.3, dotenv 17.4.2, git 2.55 (core.autocrlf),
 * Docker (node:22-alpine, eclipse-temurin:25-jdk), JDK 25, MySQL 8.4 — scratchpad/dbg/lab/ch9/c92 (o-92-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { VAN_TAY as VT_MA, PHIEN_BAN, ENV_APP, CAU_HINH, JWT_AB, C92_ENV, C92_CRLF, VUNG, DU_LIEU_SQL } from './_ma-9.mjs';
import { VAN_TAY, NODE, GROUPBY, ENV, CRLF, HOA, LOC_JAVA, LOC_SORT, DU_LIEU } from './_ra-9.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_SUA_LOCALE = ma(`// Java — dữ liệu cho MÁY đọc (CSV, JSON, SQL, khoá so sánh): KHÔNG dùng locale mặc định
String.format(Locale.ROOT, "%.2f", 1234.5);          // "1234.50" ở mọi máy
"title".toUpperCase(Locale.ROOT);                    // "TITLE" kể cả máy để tiếng Thổ Nhĩ Kỳ
// chữ cho NGƯỜI đọc: nói rõ locale muốn dùng
NumberFormat.getInstance(Locale.forLanguageTag("vi-VN")).format(1234.5);   // "1.234,5"

// JavaScript — tương tự
new Intl.NumberFormat('vi-VN').format(1234.5);        // không dựa vào LANG của máy
ds.sort((a, b) => a.localeCompare(b, 'vi'));          // thứ tự tiếng Việt, không theo mã Unicode

# Dockerfile — đặt locale rõ ràng cho ảnh tự dựng
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 TZ=UTC`, 'java');

const BANG_SO_EN = `<table>
<thead><tr><th>What differs</th><th>How to see it in one command</th><th>Typical symptom</th></tr></thead>
<tbody>
<tr><td>Runtime version (Node, JDK, Python)</td><td><code>node -v</code>, <code>java -version</code>, <code>"engines"</code>, <code>.nvmrc</code></td><td><code>X is not a function</code>, <code>bad option</code>, <code>UnsupportedClassVersionError</code></td></tr>
<tr><td>Library versions</td><td><code>npm ls</code>, <code>mvn dependency:tree</code>, lockfile diff</td><td>lesson 9.3</td></tr>
<tr><td>Environment variables</td><td>compare <strong>names</strong> with <code>.env.example</code> (never print values)</td><td>500 far from the cause; works locally because your shell exported it</td></tr>
<tr><td>OS, file system, line endings</td><td><code>/etc/os-release</code>, <code>git ls-files --eol</code>, case test</td><td><code>not found</code> for a file that exists, <code>^M: bad interpreter</code></td></tr>
<tr><td>Time zone, locale</td><td><code>date +%Z%z</code>, <code>locale</code>, <code>Locale.getDefault()</code></td><td>dates off by one day (lesson 8.2), commas in numbers, <code>?</code> instead of letters</td></tr>
<tr><td>Limits</td><td><code>ulimit -n</code>, container memory</td><td>"too many open files" only on the server</td></tr>
<tr><td>Data</td><td>count, NULLs, longest value, non-ASCII, emoji</td><td>works on seed data, fails on real names</td></tr>
</tbody></table>`;
const BANG_SO_VI = `<table>
<thead><tr><th>Thứ khác nhau</th><th>Xem bằng một lệnh</th><th>Triệu chứng hay gặp</th></tr></thead>
<tbody>
<tr><td>Phiên bản runtime (Node, JDK, Python)</td><td><code>node -v</code>, <code>java -version</code>, <code>"engines"</code>, <code>.nvmrc</code></td><td><code>X is not a function</code>, <code>bad option</code>, <code>UnsupportedClassVersionError</code></td></tr>
<tr><td>Phiên bản thư viện</td><td><code>npm ls</code>, <code>mvn dependency:tree</code>, diff lockfile</td><td>bài 9.3</td></tr>
<tr><td>Biến môi trường</td><td>so <strong>tên</strong> với <code>.env.example</code> (không bao giờ in giá trị)</td><td>500 ở chỗ xa nguyên nhân; máy mình chạy vì shell đã export sẵn</td></tr>
<tr><td>Hệ điều hành, hệ tệp, ký tự xuống dòng</td><td><code>/etc/os-release</code>, <code>git ls-files --eol</code>, phép thử hoa/thường</td><td><code>not found</code> với tệp đang có, <code>^M: bad interpreter</code></td></tr>
<tr><td>Múi giờ, locale</td><td><code>date +%Z%z</code>, <code>locale</code>, <code>Locale.getDefault()</code></td><td>lệch một ngày (bài 8.2), dấu phẩy trong số, <code>?</code> thay cho chữ</td></tr>
<tr><td>Giới hạn</td><td><code>ulimit -n</code>, bộ nhớ container</td><td>"too many open files" chỉ trên server</td></tr>
<tr><td>Dữ liệu</td><td>số dòng, NULL, giá trị dài nhất, chữ không ASCII, emoji</td><td>chạy với seed, hỏng với tên người thật</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Node.js — Command-line API: --env-file', 'Thứ tự ưu tiên: biến đã có trong môi trường thắng giá trị trong tệp.', 'https://nodejs.org/api/cli.html'),
  nguon('📘', 'gitattributes — text, eol', '* text=auto, *.sh text eol=lf; git add --renormalize.', 'https://git-scm.com/docs/gitattributes'),
  nguon('📘', 'Java SE 25 — String.toUpperCase()', 'Phụ thuộc locale; ví dụ tiếng Thổ Nhĩ Kỳ, khuyên dùng Locale.ROOT.', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html'),
  nguon('📘', 'MySQL 8.4 — utf8mb3', 'utf8 là bí danh của utf8mb3 (tối đa 3 byte) — dùng utf8mb4.', 'https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8mb3.html'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-2-thoi-gian', title: 'Bài 8.2 — Lỗi thời gian', sub: 'TZ, DST, toISOString lệch ngày — không nhắc lại ở đây.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-7-2-ket-qua-sai', title: 'Bài 7.2 — Truy vấn trả kết quả sai', sub: 'NULL, collation, JOIN — dạng "dữ liệu thật khác seed" trong SQL.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '9.2 — "Works on my machine": diffing versions, env vars, lockfiles, OS and data|||9.2 — "Máy em chạy mà": so phiên bản, biến môi trường, lockfile, hệ điều hành và dữ liệu',
  slug: 'dbg-9-2-moi-truong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến "máy em chạy mà" thành một bản diff: script vân tay môi trường (phiên bản, TZ, LANG, ICU, ulimit, hoa/thường của hệ tệp, TÊN biến so với .env.example) chạy trên máy dev và trong container rồi diff. Chạy thật: Object.groupBy là TypeError trên Node 18/20; Node 18 không có --env-file; engines chỉ cảnh báo EBADENGINE trừ khi engine-strict. .env thiếu JWT_SECRET ⇒ server vẫn lên, lỗi 500 "secretOrPrivateKey must have a value" khi đăng nhập; kiểm lúc khởi động ⇒ thoát 78 với danh sách biến thiếu; biến shell thắng .env; .env CRLF: --env-file/dotenv/docker bỏ \r nhưng nạp bằng shell giữ \r ⇒ JWT invalid signature giữa hai dịch vụ. CRLF trong .sh: ba thông báo khác nhau (not found, no such file, ^M bad interpreter), sửa bằng .gitattributes (bẫy renormalize). Import sai hoa/thường chỉ hỏng trên Linux. Locale: CSV 1234,50, Turkish İ, container LANG=C in "?"; sort C vs en_US. MySQL utf8 (utf8mb3) từ chối emoji.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>"It works on my machine" is a diff you have not run yet</h2>
<p class="lead">The sentence is true — it does work on your machine. It just is not useful. Somewhere between your laptop and the failing machine something is different: a runtime version, an environment variable, line endings, letter case in a path, a locale, the data. This lesson turns the argument into a procedure: collect a fingerprint of both environments, diff them, and test each difference. Every failure below was reproduced for real with containers on one Linux machine, so you can reproduce them too, whatever OS your teammates use.</p>

<h3>An everyday picture: the same recipe in two kitchens</h3>
<p>Your cake rises at home and collapses at your friend's place. Same recipe. Before blaming the recipe, a good baker compares the kitchens: oven temperature (really 180°C?), the flour brand, the size of "one cup", the altitude. Each difference is a hypothesis you can test by changing exactly one thing. Debugging environments is the same: list the differences first, then change them one at a time.</p>

<h3>1. A fingerprint script, then <code>diff</code></h3>
${ma(VT_MA, 'bash')}
${ra(VAN_TAY)}
<p>Run it in both places and diff the files. In one screen you see five hypotheses: different Node major version, no Java, the server runs in UTC, the open-file limit is 1,024 instead of 524,288, and two variables from <code>.env.example</code> are missing. Note what the script does <em>not</em> print: no values of variables, no host name, no user name — the output may be pasted into a ticket or a chat. Keep this script in the repository; asking a teammate "run <code>./van-tay.sh</code> and paste the result" saves the first half-hour of every "works on my machine" thread.</p>
${BANG_SO_EN}

<h3>2. Runtime versions</h3>
${ma(PHIEN_BAN)}
${ra(GROUPBY)}
<p><code>Object.groupBy</code> exists from Node 21. On Node 18 and 20 the same file throws <code>TypeError … is not a function</code> — a message that says nothing about versions. When a built-in "is not a function", check the runtime version before anything else.</p>
${ra(NODE)}
<p>Three more facts from the same runs. Node 18 rejects <code>--env-file</code> (it arrived in 20.6). The <code>"engines"</code> field in <code>package.json</code> is only a <em>warning</em> by default — <code>npm install</code> succeeds with exit 0, the warning scrolls away. With <code>engine-strict=true</code> in <code>.npmrc</code> the wrong version becomes an error at install time, which is where you want it. Pair it with <code>.nvmrc</code> (or Volta, or <code>mise</code>) so everybody gets the same version without thinking.</p>
<div class="callout warn">One claim this lesson checked and dropped: older blog posts say <code>toLocaleTimeString('en-US')</code> inserts a narrow no-break space (U+202F) before "AM". On all four Node versions here (ICU 74–78) it printed a normal space. Behaviour of ICU data changes between releases — do not trust a blog post about versions; run the line on the versions you have.</div>

<h3>3. Environment variables: the missing one and the extra character</h3>
${ma(ENV_APP)}
${ra(ENV)}
<p>Read the first block slowly; it is the most common onboarding bug. A new teammate copies <code>.env</code> from a chat message that was written before <code>JWT_SECRET</code> existed. The server <strong>starts fine</strong>. The first login returns 500, and the stack trace points into <code>jsonwebtoken/sign.js</code> — nowhere near the real cause. The fix is to fail at start-up, with a message that names the variable:</p>
${ma(CAU_HINH)}
<p>Exit code 78 is <code>EX_CONFIG</code> from <code>sysexits.h</code> — a convention that tells a supervisor "do not restart, the configuration is wrong". In Spring Boot the same idea is free: <code>\${JWT_SECRET}</code> without a default fails at start-up with "Could not resolve placeholder", and <code>@ConfigurationProperties</code> + <code>@Validated</code> checks types and required fields.</p>
<p>The next blocks explain two more classics. <strong>The shell wins</strong>: a variable already exported in your terminal (or set in <code>docker-compose.yml</code>) beats the value in <code>.env</code>, for both <code>node --env-file</code> and <code>dotenv</code> — "I changed .env and nothing happened" usually means the value is coming from somewhere else. <strong>CRLF</strong>: a <code>.env</code> saved by Notepad ends every line with <code>\\r</code>. Node's <code>--env-file</code>, <code>dotenv</code> and <code>docker --env-file</code> strip it; loading the same file with <code>set -a; . ./.env</code> (common in entrypoint scripts) keeps it. Service A signs tokens with <code>bi-mat-cua-lab</code>, service B verifies with <code>bi-mat-cua-lab\\r</code>:</p>
${ma(JWT_AB)}
<p><em>invalid signature</em> — and both secrets look identical when printed. This is why the start-up check above also rejects values with trailing whitespace.</p>
<details><summary>c92/env/c92-env.sh — the whole demonstration</summary>${ma(C92_ENV, 'bash')}</details>

<h3>4. Line endings: one cause, four different error messages</h3>
${ra(CRLF)}
<p>Git for Windows is usually installed with <code>core.autocrlf=true</code>: files are stored with LF in the repository but checked out with CRLF (<code>i/lf w/crlf</code>). A teammate on Windows mounts the folder into a Linux container and the entrypoint script fails. The same cause produces four messages depending on how the script is started: <em>not found</em> (busybox), <em>no such file or directory</em> (Docker running the entrypoint — the file obviously exists!), <em>/bin/sh^M: bad interpreter</em> (bash, the only honest one), <em>set: Illegal option -</em> (dash reading <code>set -e\\r</code>). Recognise all four.</p>
<p>The fix belongs in the repository, not in each person's settings: a <code>.gitattributes</code> with <code>*.sh text eol=lf</code> forces LF on checkout for everyone, whatever their <code>autocrlf</code>. Watch the trap in the output: <code>git add --renormalize .</code> only touches files Git already tracks, so the new <code>.gitattributes</code> itself was not committed. Add it explicitly first.</p>
<details><summary>c92/crlf/c92-crlf.sh</summary>${ma(C92_CRLF, 'bash')}</details>

<h3>5. Letter case in paths</h3>
${ra(HOA)}
<p>Windows (NTFS) and macOS (APFS, default setting) treat <code>Utils</code> and <code>utils</code> as the same folder; Linux, Docker images and CI runners do not. The import works on the author's laptop and fails everywhere else. Two habits prevent it: compare paths with what Git stores (<code>git ls-files</code>), and when you rename only the case of a file on Windows/macOS, do it through Git in two steps (<code>git mv utils tmp</code>, then <code>git mv tmp Utils</code>) — a plain rename may not be noticed because <code>core.ignorecase</code> is true on those systems. Java has its own variant: resources inside a JAR are always case-sensitive, so <code>getResource("templates/Email.html")</code> can work in the IDE on Windows (reading the folder) and fail from the JAR.</p>

<h3>6. Locale: commas, Turkish dotted İ and question marks</h3>
${ma(VUNG, 'java')}
${ra(LOC_JAVA)}
<p>Same class, four machines. With a Vietnamese default locale, <code>String.format("%.2f")</code> writes <code>1234,50</code> — your CSV now has one column too many. With Turkish, <code>"title".toUpperCase()</code> is <code>TİTLE</code> (dotted capital I) and a comparison with "TITLE" fails — a classic bug in code that normalises headers or enum names. In a container whose locale is POSIX (<code>LANG=C</code>, typical of images you build from scratch; the Temurin image sets <code>en_US.UTF-8</code> for you), Java's <code>stdout.encoding</code> becomes ASCII and every Vietnamese letter prints as <code>?</code>. The data is fine; only the output is broken — do not "fix" the database.</p>
${ra(LOC_SORT)}
<p>Sorting depends on the locale too: <code>sort</code> under <code>C</code> puts capitals first, under <code>en_US.UTF-8</code> it interleaves; JavaScript's default <code>sort()</code> compares UTF-16 code units, so "Đức" lands after "b". A snapshot test that passes on your Mac and fails on the Linux CI is often just this. Rules:</p>
${MA_SUA_LOCALE}

<h3>7. Real data is not seed data</h3>
${ma(DU_LIEU_SQL, 'sql')}
${ra(DU_LIEU)}
<p>The seed script used ASCII names; production has a student called "Lan 🌸". MySQL's <code>utf8</code> is an alias of <code>utf8mb3</code> — at most 3 bytes per character — so Vietnamese letters (2–3 bytes) work and the 4-byte emoji is rejected with error 1366. MySQL even warned at <code>CREATE TABLE</code> time (warning 3719), and nobody reads warnings in a migration. Use <code>utf8mb4</code>. Other "real data" differences worth one test each: NULL in "required" fields (lesson 7.2), the longest name in the table, ten thousand rows instead of ten (lesson 7.3), and users in other time zones (lesson 8.2). Never copy production data to your laptop to reproduce — ask for an anonymised extract (chapter 10).</p>

<h3>On the job</h3>
<p>Group projects at FPT often mix Windows, macOS and Linux laptops; outsourcing projects add the customer's servers, which you cannot touch. Three habits make "works on my machine" rare: a <code>van-tay.sh</code> (or <code>npm run doctor</code>) in the repository; <code>.nvmrc</code> + <code>engine-strict</code> + <code>.gitattributes</code> + <code>.env.example</code> with a start-up check, all committed in week one; and the application running in the same container image locally and on the server (Docker Compose, a dev container). When you report an environment bug, paste both fingerprints and the one difference you proved — that is a ticket the next person can act on.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>van-tay.sh</code> on your machine and inside <code>node:20-alpine</code>; diff the results and list each difference as a hypothesis.</li>
<li>Add a start-up check for every variable in your project's <code>.env.example</code>. Delete one variable and confirm the app refuses to start with a clear message.</li>
<li>Clone your project with <code>git -c core.autocrlf=true clone …</code>, run <code>git ls-files --eol | grep crlf</code>, and fix it with <code>.gitattributes</code>.</li>
<li>Run <code>Vung.java</code> with <code>-Duser.language=vi -Duser.country=VN</code>; find one place in your own code that would produce a wrong CSV or SQL with that locale.</li>
<li>Check the character set of every text column of your project's database. Any <code>utf8mb3</code>?</li>
</ol>
<p><strong>Done when:</strong> for a "works on my machine" report you can produce two fingerprints, a diff, and the single difference that reproduces the bug.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment fingerprint</span><span class="v">Versions, OS, TZ, locale, limits and variable names — printed safely, then diffed.</span></div>
  <div class="kv"><span class="k">engine-strict</span><span class="v">npm setting that turns a wrong Node version into an install error.</span></div>
  <div class="kv"><span class="k">Fail fast</span><span class="v">Refuse to start when configuration is missing, naming what is missing.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows vs Unix line endings; <code>\\r</code> breaks scripts and secrets.</span></div>
  <div class="kv"><span class="k">.gitattributes eol=lf</span><span class="v">Repository rule that forces LF on checkout for everyone.</span></div>
  <div class="kv"><span class="k">Locale.ROOT</span><span class="v">Locale-neutral formatting for data that machines read.</span></div>
  <div class="kv"><span class="k">utf8mb3 vs utf8mb4</span><span class="v">MySQL 3-byte "utf8" rejects emoji; utf8mb4 is real UTF-8.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Works on my machine" ⇒ fingerprint both environments, diff, test one difference at a time.</li>
<li>Pin the runtime (<code>.nvmrc</code>, <code>engines</code> + <code>engine-strict</code>).</li>
<li>Check configuration at start-up; your shell's exported variables beat <code>.env</code>.</li>
<li>CRLF has four disguises; fix it once in <code>.gitattributes</code> (add the file before renormalising).</li>
<li>Path case and locale differ between OSes: <code>git ls-files</code>, <code>Locale.ROOT</code>, explicit <code>Intl</code> locale, <code>LANG=C.UTF-8</code> in images.</li>
<li>Test with real-shaped data: emoji, NULLs, longest values, volume.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>"Máy em chạy mà" là một bản diff bạn chưa chạy</h2>
<p class="lead">Câu đó đúng — nó chạy thật trên máy bạn. Chỉ là nó không giúp được gì. Ở đâu đó giữa laptop của bạn và máy bị lỗi có một thứ khác nhau: phiên bản runtime, một biến môi trường, ký tự xuống dòng, chữ hoa/thường trong đường dẫn, locale, dữ liệu. Bài này biến cuộc cãi nhau thành một quy trình: thu "vân tay" của cả hai môi trường, diff, rồi thử từng khác biệt. Mọi lỗi dưới đây đều được tái hiện thật bằng container trên một máy Linux, nên bạn cũng tái hiện được, dù đồng đội dùng hệ điều hành nào.</p>

<h3>Liên tưởng đời thường: cùng công thức, hai căn bếp</h3>
<p>Bánh của bạn nở ở nhà mà sang nhà bạn thân thì xẹp. Cùng một công thức. Trước khi đổ lỗi cho công thức, người làm bánh giỏi so hai căn bếp: lò có thật 180°C không, bột hiệu gì, "một cốc" to cỡ nào, ở cao bao nhiêu. Mỗi khác biệt là một giả thuyết bạn thử được bằng cách đổi đúng một thứ. Gỡ lỗi môi trường cũng vậy: liệt kê khác biệt trước, rồi đổi từng cái một.</p>

<h3>1. Script vân tay, rồi <code>diff</code></h3>
${ma(VT_MA, 'bash')}
${ra(VAN_TAY)}
<p>Chạy ở cả hai nơi rồi diff hai tệp. Trong một màn hình bạn thấy năm giả thuyết: khác bản Node chính, không có Java, server chạy múi UTC, giới hạn tệp mở là 1.024 thay vì 524.288, và hai biến trong <code>.env.example</code> bị thiếu. Để ý thứ script KHÔNG in: không có giá trị biến, không tên máy, không tên người dùng — output có thể dán vào ticket hay nhóm chat. Giữ script này trong kho; câu "chạy <code>./van-tay.sh</code> rồi dán kết quả cho mình" tiết kiệm nửa giờ đầu của mọi cuộc "máy em chạy mà".</p>
${BANG_SO_VI}

<h3>2. Phiên bản runtime</h3>
${ma(PHIEN_BAN)}
${ra(GROUPBY)}
<p><code>Object.groupBy</code> có từ Node 21. Trên Node 18 và 20, cùng tệp đó ném <code>TypeError … is not a function</code> — thông báo chẳng nói gì về phiên bản. Khi một hàm có sẵn "is not a function", hãy kiểm phiên bản runtime trước mọi thứ khác.</p>
${ra(NODE)}
<p>Thêm ba sự thật từ cùng các lần chạy. Node 18 từ chối <code>--env-file</code> (có từ 20.6). Trường <code>"engines"</code> trong <code>package.json</code> mặc định chỉ là <em>cảnh báo</em> — <code>npm install</code> vẫn thành công với mã 0, cảnh báo trôi mất. Có <code>engine-strict=true</code> trong <code>.npmrc</code> thì sai phiên bản thành lỗi ngay lúc cài, đúng chỗ bạn muốn. Kết hợp với <code>.nvmrc</code> (hoặc Volta, <code>mise</code>) để mọi người có cùng phiên bản mà không phải nghĩ.</p>
<div class="callout warn">Một khẳng định bài này đã kiểm rồi bỏ: các bài blog cũ nói <code>toLocaleTimeString('en-US')</code> chèn khoảng trắng hẹp không ngắt (U+202F) trước "AM". Trên cả bốn bản Node ở đây (ICU 74–78) nó in khoảng trắng thường. Dữ liệu ICU thay đổi giữa các bản phát hành — đừng tin bài blog về phiên bản; chạy thử dòng đó trên các bản bạn đang có.</div>

<h3>3. Biến môi trường: biến bị thiếu và ký tự thừa</h3>
${ma(ENV_APP)}
${ra(ENV)}
<p>Đọc chậm khối đầu; đây là lỗi nhập môn hay gặp nhất. Bạn mới vào nhóm chép <code>.env</code> từ một tin nhắn viết từ trước khi có <code>JWT_SECRET</code>. Server <strong>vẫn khởi động bình thường</strong>. Lần đăng nhập đầu trả 500, và stack trace chỉ vào <code>jsonwebtoken/sign.js</code> — chẳng gần gì nguyên nhân thật. Cách sửa là hỏng ngay lúc khởi động, kèm thông báo nêu tên biến:</p>
${ma(CAU_HINH)}
<p>Mã thoát 78 là <code>EX_CONFIG</code> trong <code>sysexits.h</code> — một quy ước báo cho trình giám sát "đừng khởi động lại, cấu hình sai rồi". Ở Spring Boot ý này có sẵn: <code>\${JWT_SECRET}</code> không có giá trị mặc định thì hỏng lúc khởi động với "Could not resolve placeholder", còn <code>@ConfigurationProperties</code> + <code>@Validated</code> kiểm kiểu và trường bắt buộc.</p>
<p>Các khối sau giải thích thêm hai lỗi kinh điển. <strong>Shell thắng</strong>: biến đã export trong terminal (hoặc đặt trong <code>docker-compose.yml</code>) thắng giá trị trong <code>.env</code>, với cả <code>node --env-file</code> lẫn <code>dotenv</code> — "em sửa .env mà không đổi gì" thường nghĩa là giá trị đang đến từ chỗ khác. <strong>CRLF</strong>: <code>.env</code> lưu bằng Notepad có <code>\\r</code> ở cuối mỗi dòng. <code>--env-file</code> của Node, <code>dotenv</code> và <code>docker --env-file</code> đều bỏ nó; nạp cùng tệp bằng <code>set -a; . ./.env</code> (hay gặp trong script entrypoint) thì giữ lại. Dịch vụ A ký token bằng <code>bi-mat-cua-lab</code>, dịch vụ B kiểm bằng <code>bi-mat-cua-lab\\r</code>:</p>
${ma(JWT_AB)}
<p><em>invalid signature</em> — và in ra thì hai bí mật trông giống hệt nhau. Đó là lý do bước kiểm lúc khởi động ở trên còn từ chối giá trị có khoảng trắng ở cuối.</p>
<details><summary>c92/env/c92-env.sh — toàn bộ phần trình diễn</summary>${ma(C92_ENV, 'bash')}</details>

<h3>4. Ký tự xuống dòng: một nguyên nhân, bốn thông báo khác nhau</h3>
${ra(CRLF)}
<p>Git for Windows thường được cài với <code>core.autocrlf=true</code>: tệp lưu trong kho bằng LF nhưng checkout ra thành CRLF (<code>i/lf w/crlf</code>). Bạn dùng Windows mount thư mục vào container Linux và script entrypoint hỏng. Cùng một nguyên nhân sinh ra bốn thông báo tuỳ cách gọi script: <em>not found</em> (busybox), <em>no such file or directory</em> (Docker chạy entrypoint — tệp rõ ràng đang có!), <em>/bin/sh^M: bad interpreter</em> (bash, cái duy nhất nói thật), <em>set: Illegal option -</em> (dash đọc <code>set -e\\r</code>). Hãy nhận ra cả bốn.</p>
<p>Chỗ sửa là trong kho, không phải trong cấu hình của từng người: <code>.gitattributes</code> với <code>*.sh text eol=lf</code> ép LF khi checkout cho mọi người, bất kể <code>autocrlf</code> của họ. Xem bẫy trong output: <code>git add --renormalize .</code> chỉ đụng tệp Git đã theo dõi, nên chính tệp <code>.gitattributes</code> mới chưa được commit. Phải add nó trước.</p>
<details><summary>c92/crlf/c92-crlf.sh</summary>${ma(C92_CRLF, 'bash')}</details>

<h3>5. Chữ hoa/thường trong đường dẫn</h3>
${ra(HOA)}
<p>Windows (NTFS) và macOS (APFS, thiết lập mặc định) coi <code>Utils</code> và <code>utils</code> là một thư mục; Linux, ảnh Docker và máy CI thì không. Import chạy trên laptop người viết và hỏng ở mọi nơi khác. Hai thói quen chặn lỗi này: so đường dẫn với tên Git đang lưu (<code>git ls-files</code>), và khi chỉ đổi hoa/thường tên tệp trên Windows/macOS thì đổi qua Git hai bước (<code>git mv utils tmp</code>, rồi <code>git mv tmp Utils</code>) — đổi tên thường có thể không được nhận ra vì <code>core.ignorecase</code> bật trên các hệ đó. Java có biến thể riêng: tài nguyên trong JAR luôn phân biệt hoa/thường, nên <code>getResource("templates/Email.html")</code> có thể chạy trong IDE trên Windows (đọc thư mục) mà hỏng khi chạy từ JAR.</p>

<h3>6. Locale: dấu phẩy, chữ İ có chấm và dấu hỏi</h3>
${ma(VUNG, 'java')}
${ra(LOC_JAVA)}
<p>Cùng một lớp, bốn máy. Với locale mặc định tiếng Việt, <code>String.format("%.2f")</code> viết <code>1234,50</code> — CSV của bạn giờ thừa một cột. Với tiếng Thổ Nhĩ Kỳ, <code>"title".toUpperCase()</code> là <code>TİTLE</code> (chữ I hoa có chấm) và so với "TITLE" thì trượt — lỗi kinh điển ở mã chuẩn hoá header hay tên enum. Trong container có locale POSIX (<code>LANG=C</code>, hay gặp ở ảnh tự dựng từ đầu; ảnh Temurin đã đặt sẵn <code>en_US.UTF-8</code>), <code>stdout.encoding</code> của Java thành ASCII và mọi chữ tiếng Việt in thành <code>?</code>. Dữ liệu vẫn đúng; chỉ có output hỏng — đừng đi "sửa" cơ sở dữ liệu.</p>
${ra(LOC_SORT)}
<p>Sắp xếp cũng phụ thuộc locale: <code>sort</code> với <code>C</code> đưa chữ hoa lên trước, với <code>en_US.UTF-8</code> thì xen kẽ; <code>sort()</code> mặc định của JavaScript so theo mã UTF-16, nên "Đức" đứng sau "b". Test snapshot qua trên Mac mà trượt trên CI Linux nhiều khi chỉ vì thế. Quy tắc:</p>
${MA_SUA_LOCALE}

<h3>7. Dữ liệu thật không phải dữ liệu seed</h3>
${ma(DU_LIEU_SQL, 'sql')}
${ra(DU_LIEU)}
<p>Script seed dùng tên không dấu; production có một sinh viên tên "Lan 🌸". <code>utf8</code> của MySQL là bí danh của <code>utf8mb3</code> — tối đa 3 byte mỗi ký tự — nên chữ tiếng Việt (2–3 byte) vẫn được còn emoji 4 byte bị từ chối với lỗi 1366. MySQL còn cảnh báo ngay lúc <code>CREATE TABLE</code> (cảnh báo 3719), mà chẳng ai đọc cảnh báo trong migration. Hãy dùng <code>utf8mb4</code>. Những khác biệt "dữ liệu thật" khác đáng một test mỗi loại: NULL ở trường "bắt buộc" (bài 7.2), cái tên dài nhất trong bảng, mười nghìn dòng thay vì mười (bài 7.3), người dùng ở múi giờ khác (bài 8.2). Đừng bao giờ chép dữ liệu production về laptop để tái hiện — xin một bản trích đã ẩn danh (chương 10).</p>

<h3>Đi làm thật</h3>
<p>Đồ án nhóm ở FPT hay trộn laptop Windows, macOS và Linux; dự án outsourcing còn thêm server của khách mà bạn không được đụng vào. Ba thói quen làm "máy em chạy mà" hiếm hẳn: có <code>van-tay.sh</code> (hoặc <code>npm run doctor</code>) trong kho; <code>.nvmrc</code> + <code>engine-strict</code> + <code>.gitattributes</code> + <code>.env.example</code> có bước kiểm lúc khởi động, commit ngay tuần đầu; và ứng dụng chạy cùng một ảnh container ở máy mình lẫn trên server (Docker Compose, dev container). Khi báo lỗi môi trường, dán cả hai vân tay và đúng một khác biệt bạn đã chứng minh — đó là ticket người sau làm tiếp được.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>van-tay.sh</code> trên máy bạn và trong <code>node:20-alpine</code>; diff kết quả và ghi mỗi khác biệt thành một giả thuyết.</li>
<li>Thêm bước kiểm lúc khởi động cho mọi biến trong <code>.env.example</code> của dự án bạn. Xoá một biến và xác nhận ứng dụng từ chối khởi động với thông báo rõ ràng.</li>
<li>Clone dự án bằng <code>git -c core.autocrlf=true clone …</code>, chạy <code>git ls-files --eol | grep crlf</code>, rồi sửa bằng <code>.gitattributes</code>.</li>
<li>Chạy <code>Vung.java</code> với <code>-Duser.language=vi -Duser.country=VN</code>; tìm một chỗ trong mã của bạn sẽ sinh CSV hoặc SQL sai với locale đó.</li>
<li>Kiểm bảng mã ký tự của mọi cột chữ trong cơ sở dữ liệu dự án. Có cột nào <code>utf8mb3</code> không?</li>
</ol>
<p><strong>Đạt khi:</strong> với một báo lỗi "máy em chạy mà", bạn đưa ra được hai vân tay, một bản diff, và đúng một khác biệt tái hiện được lỗi.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vân tay môi trường</span><span class="v">Phiên bản, hệ điều hành, TZ, locale, giới hạn và tên biến — in an toàn rồi diff.</span></div>
  <div class="kv"><span class="k">engine-strict</span><span class="v">Thiết lập npm biến sai bản Node thành lỗi lúc cài.</span></div>
  <div class="kv"><span class="k">Fail fast</span><span class="v">Từ chối khởi động khi thiếu cấu hình, nêu rõ thiếu gì.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Xuống dòng kiểu Windows và Unix; <code>\\r</code> làm hỏng script và bí mật.</span></div>
  <div class="kv"><span class="k">.gitattributes eol=lf</span><span class="v">Luật trong kho ép LF khi checkout cho mọi người.</span></div>
  <div class="kv"><span class="k">Locale.ROOT</span><span class="v">Định dạng trung lập locale cho dữ liệu máy đọc.</span></div>
  <div class="kv"><span class="k">utf8mb3 và utf8mb4</span><span class="v">"utf8" 3 byte của MySQL từ chối emoji; utf8mb4 mới là UTF-8 thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Máy em chạy mà" ⇒ lấy vân tay cả hai môi trường, diff, thử từng khác biệt một.</li>
<li>Ghim runtime (<code>.nvmrc</code>, <code>engines</code> + <code>engine-strict</code>).</li>
<li>Kiểm cấu hình lúc khởi động; biến đã export trong shell thắng <code>.env</code>.</li>
<li>CRLF có bốn bộ mặt; sửa một lần trong <code>.gitattributes</code> (add tệp trước khi renormalize).</li>
<li>Hoa/thường của đường dẫn và locale khác nhau giữa các hệ: <code>git ls-files</code>, <code>Locale.ROOT</code>, ghi rõ locale cho <code>Intl</code>, <code>LANG=C.UTF-8</code> trong ảnh.</li>
<li>Thử với dữ liệu có hình dạng thật: emoji, NULL, giá trị dài nhất, khối lượng.</li>
</ul>
${NGUON}
</div>
`,
};
