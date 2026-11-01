/**
 * TypeScript · Mục 0 · Bắt đầu tại đây (2/2) — typescript-0-9-bat-dau-tai-day-2 (bài MỚI 01/11/2026, đợt mẫu).
 * Nguồn: Gao/Bird/Barr ICSE 2017 (PDF đã đọc); Airbnb 38% — InfoQ 08/2020 (chặn đọc tự động, HTTP 405 ⇒ chỉ nêu bằng chữ, không thẻ nguồn);
 * NASA MCO MIB Phase I 10/11/1999 (PDF đã đọc); sự cố seed 08/08/2026 (CLAUDE.md).
 * Output: chạy thật Node 22.23.3 + tsc 7.0.2 trên labflow-ts/demo0/ts-00-9 (đã sinh vào ./_ma-ts-00-9.mjs). Hai tình huống A/B là MINH HOẠ.
 */
import G from '../giang/ts-00-9.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-9.mjs';

// Chỉ BỎ dòng (khung ngăn xếp nội bộ của Node, dòng phiên bản), không sửa chữ.
const gon = (t) => t.split('\n').filter((l) => !/^\s+at (ModuleJob|async )|^Node\.js v/.test(l)).join('\n');
const SEED_RUN = gon(OUT['92-seed-chay']);
const UNDEF_JS = gon(OUT['96-undef-js']);
const UNDEF_FIX = gon(OUT['98-undef-fixed']);

const NGUON = [
  nguon('📄', 'Gao, Bird, Barr — To Type or Not to Type: Quantifying Detectable Bugs in JavaScript (ICSE 2017, PDF)', '400 public bugs; Flow 0.30 and TypeScript 2.0 each detect 15%. Read 1 Nov 2026.', 'https://earlbarr.com/publications/typestudy.pdf'),
  nguon('🛰️', 'NASA — Mars Climate Orbiter Mishap Investigation Board, Phase I Report (10 Nov 1999, PDF)', 'Root cause: “failure to use metric units in the coding of a ground software file”. Read 1 Nov 2026.', 'https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf'),
  nguon('🌍', 'Wikipedia — Mars Climate Orbiter', 'Mission cost $327.6 million; pound-force seconds vs newton-seconds. Read 1 Nov 2026.', 'https://en.wikipedia.org/wiki/Mars_Climate_Orbiter'),
  nguon('🔷', 'TypeScript — tsconfig reference: strict', 'What strict mode turns on, including strictNullChecks. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strict'),
].join('\n');

export default {
  title: 'Start here (2/2) — Real incidents, and how to learn TypeScript without giving up|||Bắt đầu tại đây (2/2) — Sự cố có thật, và cách học TypeScript không nản',
  slug: 'typescript-0-9-bat-dau-tai-day-2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nghiên cứu nói gì (15% bug công khai — ICSE 2017; Airbnb ước tính 38%), sự cố thật của chính trang này ngày 08/08/2026 (đổi tên enum, bản chép tay kiểu trong seed, tsconfig không đọc seed) được TÁI HIỆN chạy thật, lỗi "Cannot read properties of undefined" và strict bắt nó, Mars Climate Orbiter và kiểu cho đơn vị đo (xem trước), hai tình huống minh hoạ của nhóm SV, vì sao người mới bỏ TypeScript và thuốc giải, hai lộ trình và nhịp học một bài.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Real incidents, and how to learn TypeScript without giving up</h2>
<p class="lead">After this lesson you can explain, with numbers and with a bug you reproduced yourself, what TypeScript buys a team and what it does not — the answer interviewers want when they ask “why TypeScript?”. You will also know the most common JavaScript crash and how strict mode stops it, and leave with a study plan sized to your semester.</p>

<h3>What research says: 15% and 38%</h3>
<p><strong>15% — a careful academic measurement.</strong> Zheng Gao, Christian Bird and Earl Barr published <em>To Type or Not to Type: Quantifying Detectable Bugs in JavaScript</em> at ICSE 2017. They sampled <strong>400</strong> bugs that had been fixed in public JavaScript projects on GitHub, checked out the code just <em>before</em> each fix, added type annotations by hand, and asked: does the type checker now complain? Both TypeScript 2.0 and Flow 0.30 flagged <strong>15%</strong> of them. The authors call it conservative: these bugs had already passed tests and review.</p>
<p><strong>38% — a company’s own estimate.</strong> At JSConf Hawaii 2019, Brie Bunge described Airbnb’s move to TypeScript. A postmortem analysis of past bugs estimated that <strong>38%</strong> of them could have been prevented by TypeScript (reported by InfoQ in August 2020, in its article on Airbnb’s migration tool ts-migrate). It is an internal estimate on one codebase, not a peer-reviewed study — useful, but say “reported”.</p>
<div class="callout">
<p><strong>What the numbers mean.</strong> Neither is 100%. Types remove a whole <em>class</em> of mistakes — wrong names, wrong shapes, forgotten cases. A wrong <em>rule</em> (approving 30 seats when the limit is “more than 30”) compiles perfectly, so this course runs real tests next to the checker.</p>
</div>

<h3>This website, 8 August 2026: one rename, a broken seed</h3>
<p>From the operations notes of cuongthai.com itself. The database enum (a fixed list of allowed values) <code>ContentType</code> had a value <code>CODE</code>; the frontend said <code>CODE_REVIEW</code>, so the value was renamed. The whole pre-push checklist was green, <code>tsc --noEmit</code> included. On production, the <strong>seed script</strong> — the program that fills a fresh database with starter data — broke.</p>
<p>Why? <code>prisma/seed.ts</code> kept its <strong>own hand-written copy</strong> of the union, still containing <code>'CODE'</code>, so it agreed with itself; and the main <code>tsconfig.json</code> excluded <code>prisma/**</code>, so the check never read it. The fix: import the real type, and add a second check (<code>tsconfig.seed.json</code> + <code>npm run typecheck:seed</code>) that does read the seed.</p>
<p>You can reproduce the whole thing in five files. In <code>demo0/ts-00-9/su-co/</code>, <code>types.ts</code> is the single source of truth after the rename:</p>
${ma('typescript', CODE.types)}
<p><code>db.ts</code> stands in for the database. Like a PostgreSQL enum column, it refuses values it does not know, with the same wording PostgreSQL uses:</p>
${ma('typescript', CODE.db)}
<p><code>app.ts</code> imports the type, so the rename reached it. <code>seed.ts</code> is the problem — its own copy of the union:</p>
${ma('typescript', CODE.seed)}
<p>The project’s <code>tsconfig.json</code> copies the website’s mistake: the seed is not in <code>include</code>.</p>
${ma('json', CODE.cfg)}
<p>Now run the check, then the programs:</p>
${ra(OUT['91-tsc-xanh'])}
${ra(SEED_RUN)}
<p>Exit code 0 from <code>tsc</code>: green. Then the application inserts its post fine, the seed inserts one article and dies on the second row: <code>invalid input value for enum "ContentType": "CODE"</code>. Nothing in the check was wrong — it simply never looked at <code>seed.ts</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — “tsc is green” only speaks for the files it read.</strong> A green type check is a statement about the files in <code>include</code>, nothing else. Scripts, seeds, migrations and test helpers that live outside <code>src/</code> are exactly where stale copies survive. Ask the check to read the seed, and it refuses it at once:</p>
${ma('json', CODE.cfgSeed)}
${ra(OUT['93-tsc-seed'])}
<p>The message is four lines long. Read it <strong>bottom-up</strong>: the last line is the root cause — <code>"CODE"</code> is not in the real <code>ContentType</code>. The lines above explain how it got there: the seed’s <code>ContentType</code> and <code>import("…/types").ContentType</code> are two <em>different</em> types that happen to share a name. That sentence is the whole incident.</p>
</div>

<h3>The real fix: one definition, imported</h3>
<p>The second config is the safety net. The real cure is to delete the copy. <code>seed-fixed.ts</code> imports the type:</p>
${ma('typescript', CODE.seedFixed)}
${ra(OUT['94-tsc-fixed'])}
<p>The error is now one short line, on the exact data row that still says <code>'CODE'</code> (line 7, column 35) — not three lines away at the call. Change that row to <code>'CODE_REVIEW'</code> and both the check and the program are happy:</p>
${ra(OUT['95-sau'])}
<p>The payoff shows on the <em>next</em> rename. In <code>demo0/ts-00-9/luyen/</code> the only change is in <code>types.ts</code>: <code>QUIZ</code> becomes <code>EXAM</code>.</p>
${ma('typescript', CODE.luyenTypes)}
${ra(OUT['9c-luyen'])}
<p>One edit, and the compiler hands you the complete list of places that must follow: the allowed list in <code>db.ts</code> and the data in <code>seed.ts</code>. In JavaScript you would search the code for the string <code>"QUIZ"</code> and hope you found them all — including in files nobody remembers.</p>

<h3>The everyday crash: Cannot read properties of undefined</h3>
<p>Ask any JavaScript developer for the error they see most and you will hear this one. In LabFlow terms: find how many seats a lab has.</p>
${ma('javascript', CODE.labsJs)}
${ra(UNDEF_JS)}
<p><code>find</code> returns the first match — or <code>undefined</code> when nothing matches, and reading <code>.seats</code> from <code>undefined</code> throws. You learn about the missing case when a real user types a lab that does not exist. The same code as TypeScript, only <code>code: string</code> and <code>: number</code> added:</p>
${ma('typescript', CODE.labsTs)}
${ra(OUT['97-undef-tsc'])}
<p><code>TS2532: Object is possibly 'undefined'</code>, at the start of <code>LABS.find(…)</code>. Strict mode includes <code>strictNullChecks</code>: <code>find</code> is declared to return “a lab, or undefined”, and you must handle the second case before reading a property. You decide how:</p>
${ma('typescript', CODE.labsFixed)}
${ra(UNDEF_FIX)}
<p>It still stops on BE-209 — but with <code>Unknown lab BE-209</code>, a message you wrote, from a line you can test. And notice: no <code>!</code>, no <code>as</code>, no <code>any</code>. After the <code>if</code>, TypeScript <em>knows</em> <code>lab</code> is defined. That knowing has a name, <strong>narrowing</strong>, and it gets a whole chapter (Chapter 5).</p>
<p>Careful: running the <code>.ts</code> file with Node does <em>not</em> protect you. Node only strips the types and runs what is left:</p>
${ra(OUT['99-undef-ts-chay'])}
<p>Same crash as the JavaScript version. The protection exists only if <code>tsc</code> runs — in your editor while you type and in CI before every merge. Lesson 0.4 makes this split between <em>checking</em> and <em>running</em> the centre of everything.</p>

<h3>Mars Climate Orbiter: units are types too (a preview)</h3>
<p>On 23 September 1999 NASA lost the Mars Climate Orbiter, a 327.6-million-dollar mission. The Mishap Investigation Board (Phase I report, 10 November 1999) names the root cause: the “failure to use metric units in the coding of a ground software file” — thruster data in pound-force seconds where navigation required newton-seconds, off by a factor of 4.45.</p>
<p>To both programs the value was just “a number”. TypeScript can give two numbers with different meanings different types — Chapter 16 syntax, read it for the idea:</p>
${ma('typescript', CODE.impulse)}
${ra(OUT['9a-units-tsc'])}
${ra(OUT['9b-units-chay'])}
<p>The checker refuses the mixed call on line 15. Node, which never checks types, runs both lines: the first prints <code>10.00 N·s</code> — wrong by the same factor of 4.45 that doomed the orbiter — and the converted one prints <code>44.50 N·s</code>. The two real programs were separate, so this is not “TypeScript would have saved it” — it is a habit: when two values must not mix, make mixing a compile error.</p>

<h3>Two situations every student team knows (illustrations, not real reports)</h3>
<p><strong>A · The rename before the demo.</strong> The night before the SWP391 review, the backend renames <code>roomId</code> to <code>labId</code>. The React page still reads <code>booking.roomId</code>, gets <code>undefined</code>, and shows empty cells in front of the lecturer. With one shared <code>Booking</code> type, the frontend build would have turned red the night before, on the exact line.</p>
<p><strong>B · Seats arrive as a string.</strong> An API returns <code>"seats": "31"</code>. Some code works by luck — <code>'31' &gt; 30</code> is <code>true</code> — and some breaks quietly: <code>'31' + 1</code> is <code>'311'</code> (checked with Node 22.23.3: <code>true 311</code>). Network data is whatever the network sent, whatever your type says: Chapter 13 checks it at the door with Zod, lesson 1.2 explains why.</p>

<h3>Why beginners give up on TypeScript — and the antidote</h3>
<table>
<thead><tr><th>What it feels like</th><th>The antidote in this course</th></tr></thead>
<tbody>
<tr><td>A wall of red after switching on strict</td><td>Fix the <strong>first</strong> error, run again (lesson 0.2)</td></tr>
<tr><td>Messages four or five lines long</td><td>Read <strong>bottom-up</strong>: the last line is the cause</td></tr>
<tr><td><code>any</code> makes the red go away</td><td>Lab 1 measures it: all-<code>any</code> code let 7 of 8 wrong calls through; the untouched file caught 3</td></tr>
<tr><td>Generics look like algebra</td><td>Not before Chapter 6, always on LabFlow code</td></tr>
<tr><td>“My JavaScript works, why bother?”</td><td>Every chapter: a bug Node runs and <code>tsc</code> refuses, with real output</td></tr>
</tbody>
</table>

<h3>Two paths</h3>
<table>
<thead><tr><th></th><th>Minimum path</th><th>Full path</th></tr></thead>
<tbody>
<tr><td>Chapters</td><td>Section 0, Chapters 1–6, 9, 11, 13</td><td>Section 0 to Chapter 16 in order</td></tr>
<tr><td>Labs</td><td>The labs of those chapters</td><td>Every chapter lab + the final project</td></tr>
<tr><td>Time</td><td>≈ 30 hours · 4–5 weeks at an hour a day</td><td>≈ 60–70 hours · 10–12 weeks</td></tr>
<tr><td>Good for</td><td>SDN302 assignments and your SWP391 backend now</td><td>Internship interviews and real team work</td></tr>
</tbody>
</table>
<p>Times assume you type every example yourself.</p>

<h3>The rhythm of one lesson</h3>
<p><strong>Slides</strong> (≈ 10 min) → <strong>written lesson</strong>, typing and running every example and comparing with the real output (≈ 30 min) → <strong>🧪 Practice</strong> with a “done when” (15 min) → <strong>Code Lab</strong> exercises graded by the compiler itself (“must compile”, “these wrong calls must be refused”) → at the end of the chapter, a <strong>lab</strong> with a grading script and a <strong>quiz</strong> of ten scenario questions. Stuck? Write down the command, what you expected, the output as text and what you tried — then ask.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Create the five files of <code>demo0/ts-00-9/su-co/</code> as above. Run <code>npx tsc -p demo0/ts-00-9/su-co</code>, then <code>node demo0/ts-00-9/su-co/seed.ts</code>: exit 0, then the enum error.</li>
<li>Add <code>tsconfig.seed.json</code>, run <code>tsc -p</code> on it and copy the last line of the TS2345 message into your notebook.</li>
<li>Fix the seed: delete its own <code>type ContentType</code>, import the real one, correct the data.</li>
<li>Rename <code>QUIZ</code> to <code>EXAM</code> in <code>types.ts</code> only. Predict where <code>tsc</code> will complain, then run it.</li>
</ol>
<p><strong>Solution and real output.</strong> The fixed seed (in <code>demo0/ts-00-9/su-co/sau/</code>, so imports go one folder up):</p>
${ma('typescript', CODE.seedSau)}
${ra(OUT['95-sau'])}
<p>And step 4, after the rename — two errors, in <code>db.ts</code> and <code>seed.ts</code>, the only two places that still say <code>QUIZ</code>:</p>
${ra(OUT['9c-luyen'])}
<p><strong>Done when:</strong> the seed prints <code>seeded 3 posts</code>; your seed file contains no union of its own, only an <code>import type</code>; and after the rename, <code>tsc</code> shows exactly the errors you predicted.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">union type</span><span class="v">A TypeScript type that is “one of these”: <code>'VLOG' | 'ARTICLE'</code>. Chapter 5.</span></div>
  <div class="kv"><span class="k">seed script</span><span class="v">A program that fills an empty database with starter data.</span></div>
  <div class="kv"><span class="k">single source of truth</span><span class="v">Each fact is defined in one place and imported everywhere else — never copied.</span></div>
  <div class="kv"><span class="k">include (tsconfig)</span><span class="v">The files a check actually reads. A file outside it is not checked at all.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">Part of strict mode: <code>undefined</code> and <code>null</code> are separate types you must handle.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">After a check such as <code>if (lab === undefined) throw …</code>, TypeScript knows the narrower type.</span></div>
</div>

<h3>🗺 How a copied type becomes an incident</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Copy</div><div class="lz-d">a type is typed by hand instead of imported</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Rename</div><div class="lz-d">the original changes; the copy does not</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Green check</div><div class="lz-d">the file is outside include, or agrees with itself</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">the stale value meets real data</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Fix</div><div class="lz-d">import the type, check every file</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Types caught 15% of 400 public bugs (ICSE 2017); Airbnb reported an internal 38%. Not 100% — keep your tests.</li>
<li>8 Aug 2026 here: a copied union in the seed + a tsconfig that never read it = green check, broken production. Import types, never copy them.</li>
<li>A check only protects the files in its <code>include</code>. Read long messages bottom-up; fix the first error first.</li>
<li>Strict mode refuses <code>Cannot read properties of undefined</code> (TS2532) — only when <code>tsc</code> runs; Node just strips types.</li>
<li>Minimum path ≈ 30 h for a typed backend now; full path ≈ 60–70 h with every lab and the final project.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Sự cố có thật, và cách học TypeScript không nản</h2>
<p class="lead">Học xong bài này, bạn giải thích được — bằng con số và bằng một bug do chính tay bạn tái hiện — TypeScript mang lại gì cho một nhóm và không mang lại gì: đúng câu trả lời người phỏng vấn muốn nghe khi hỏi “vì sao dùng TypeScript?”. Bạn cũng biết lỗi sập phổ biến nhất của JavaScript và cách chế độ strict chặn nó, và có một kế hoạch học vừa với học kỳ.</p>

<h3>Nghiên cứu nói gì: 15% và 38%</h3>
<p><strong>15% — một phép đo học thuật cẩn thận.</strong> Zheng Gao, Christian Bird và Earl Barr công bố bài <em>To Type or Not to Type: Quantifying Detectable Bugs in JavaScript</em> tại ICSE 2017. Họ lấy mẫu <strong>400</strong> bug đã được sửa trong các dự án JavaScript công khai trên GitHub, lấy lại code ngay <em>trước</em> mỗi lần sửa, tự tay thêm chú thích kiểu, rồi hỏi: giờ trình kiểm tra kiểu có báo lỗi không? Cả TypeScript 2.0 lẫn Flow 0.30 đều bắt được <strong>15%</strong>. Các tác giả gọi đây là con số thận trọng: những bug đó đã lọt qua test và review.</p>
<p><strong>38% — ước tính nội bộ của một công ty.</strong> Tại JSConf Hawaii 2019, Brie Bunge kể chuyện Airbnb chuyển sang TypeScript. Một phân tích sau sự cố (postmortem) trên các bug cũ ước tính <strong>38%</strong> trong số đó có thể tránh được nhờ TypeScript (InfoQ đưa tin tháng 8/2020, trong bài về công cụ chuyển đổi ts-migrate của Airbnb). Đây là ước tính nội bộ trên một codebase, không phải nghiên cứu có phản biện — hữu ích, nhưng hãy nói “theo báo cáo”.</p>
<div class="callout">
<p><strong>Các con số có nghĩa gì.</strong> Không con số nào là 100%. Kiểu xoá cả một <em>nhóm</em> lỗi — sai tên, sai hình dạng, quên trường hợp. Còn một <em>luật</em> sai (duyệt 30 chỗ trong khi luật là “trên 30”) vẫn biên dịch hoàn hảo, nên khoá này luôn chạy test thật bên cạnh trình kiểm tra.</p>
</div>

<h3>Chính trang web này, ngày 08/08/2026: một lần đổi tên, một script seed vỡ</h3>
<p>Lấy từ ghi chép vận hành của chính cuongthai.com. Enum (danh sách cố định các giá trị được phép) <code>ContentType</code> trong cơ sở dữ liệu có giá trị <code>CODE</code>; frontend lại gọi là <code>CODE_REVIEW</code>, nên giá trị được đổi tên. Toàn bộ checklist trước khi đẩy code đều xanh, kể cả <code>tsc --noEmit</code>. Trên production, <strong>script seed</strong> — chương trình đổ dữ liệu khởi đầu vào cơ sở dữ liệu mới — vỡ.</p>
<p>Vì sao? <code>prisma/seed.ts</code> giữ <strong>bản chép tay của riêng nó</strong> cho union, vẫn còn <code>'CODE'</code>, nên nó tự khớp với chính nó; còn <code>tsconfig.json</code> chính loại <code>prisma/**</code> ra, nên phép kiểm không bao giờ đọc nó. Cách sửa: import kiểu thật, và thêm phép kiểm thứ hai (<code>tsconfig.seed.json</code> + <code>npm run typecheck:seed</code>) có đọc seed.</p>
<p>Bạn tái hiện được trọn vẹn với năm tệp. Trong <code>demo0/ts-00-9/su-co/</code>, <code>types.ts</code> là nguồn sự thật duy nhất sau khi đổi tên:</p>
${ma('typescript', CODE.types)}
<p><code>db.ts</code> đóng vai cơ sở dữ liệu. Giống một cột enum của PostgreSQL, nó từ chối giá trị lạ, với đúng câu chữ PostgreSQL dùng:</p>
${ma('typescript', CODE.db)}
<p><code>app.ts</code> import kiểu, nên lần đổi tên đã tới được nó. <code>seed.ts</code> là vấn đề — nó có bản sao union của riêng mình:</p>
${ma('typescript', CODE.seed)}
<p><code>tsconfig.json</code> của dự án chép đúng sai lầm của trang web: seed không có trong <code>include</code>.</p>
${ma('json', CODE.cfg)}
<p>Giờ chạy phép kiểm, rồi chạy chương trình:</p>
${ra(OUT['91-tsc-xanh'])}
${ra(SEED_RUN)}
<p><code>tsc</code> trả exit 0: xanh. Sau đó ứng dụng chèn bài của nó bình thường, còn seed chèn được một bài viết rồi chết ở dòng thứ hai: <code>invalid input value for enum "ContentType": "CODE"</code>. Phép kiểm không sai gì cả — chỉ là nó chưa từng nhìn vào <code>seed.ts</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — “tsc xanh” chỉ nói thay cho những tệp nó đã đọc.</strong> Một phép kiểm kiểu xanh là một khẳng định về các tệp trong <code>include</code>, không hơn. Script, seed, migration và tiện ích test nằm ngoài <code>src/</code> chính là nơi các bản sao cũ sống sót. Bắt phép kiểm đọc seed, và nó từ chối ngay:</p>
${ma('json', CODE.cfgSeed)}
${ra(OUT['93-tsc-seed'])}
<p>Thông báo dài bốn dòng. Hãy đọc <strong>từ dưới lên</strong>: dòng cuối là nguyên nhân gốc — <code>"CODE"</code> không thuộc <code>ContentType</code> thật. Các dòng trên giải thích nó đi tới đó thế nào: <code>ContentType</code> của seed và <code>import("…/types").ContentType</code> là hai kiểu <em>khác nhau</em> tình cờ trùng tên. Câu đó chính là toàn bộ sự cố.</p>
</div>

<h3>Cách sửa thật: một định nghĩa, được import</h3>
<p>Cấu hình thứ hai là lưới an toàn. Thuốc chữa thật là xoá bản sao. <code>seed-fixed.ts</code> import kiểu:</p>
${ma('typescript', CODE.seedFixed)}
${ra(OUT['94-tsc-fixed'])}
<p>Lỗi giờ chỉ còn một dòng ngắn, đúng vào dòng dữ liệu còn ghi <code>'CODE'</code> (dòng 7, cột 35) — chứ không phải cách đó ba dòng ở chỗ gọi hàm. Đổi dòng đó thành <code>'CODE_REVIEW'</code> thì cả phép kiểm lẫn chương trình đều ổn:</p>
${ra(OUT['95-sau'])}
<p>Lợi ích lộ ra ở lần đổi tên <em>kế tiếp</em>. Trong <code>demo0/ts-00-9/luyen/</code> thay đổi duy nhất nằm ở <code>types.ts</code>: <code>QUIZ</code> thành <code>EXAM</code>.</p>
${ma('typescript', CODE.luyenTypes)}
${ra(OUT['9c-luyen'])}
<p>Một lần sửa, và trình biên dịch đưa bạn danh sách đầy đủ những chỗ phải đổi theo: danh sách giá trị hợp lệ trong <code>db.ts</code> và dữ liệu trong <code>seed.ts</code>. Với JavaScript, bạn sẽ phải tìm chuỗi <code>"QUIZ"</code> trong code và cầu mong tìm đủ — kể cả trong những tệp không ai còn nhớ.</p>

<h3>Lỗi sập hằng ngày: Cannot read properties of undefined</h3>
<p>Hỏi bất kỳ lập trình viên JavaScript nào lỗi họ gặp nhiều nhất, bạn sẽ nghe đúng lỗi này. Theo ngôn ngữ LabFlow: tìm xem một phòng lab có bao nhiêu chỗ.</p>
${ma('javascript', CODE.labsJs)}
${ra(UNDEF_JS)}
<p><code>find</code> trả về phần tử khớp đầu tiên — hoặc <code>undefined</code> khi không có gì khớp, và đọc <code>.seats</code> từ <code>undefined</code> thì ném lỗi. Bạn biết tới trường hợp thiếu khi một người dùng thật gõ mã phòng không tồn tại. Cùng đoạn code dưới dạng TypeScript, chỉ thêm <code>code: string</code> và <code>: number</code>:</p>
${ma('typescript', CODE.labsTs)}
${ra(OUT['97-undef-tsc'])}
<p><code>TS2532: Object is possibly 'undefined'</code> (object có thể là undefined), ngay đầu <code>LABS.find(…)</code>. Chế độ strict có <code>strictNullChecks</code>: <code>find</code> được khai là trả về “một lab, hoặc undefined”, và bạn phải xử lý trường hợp thứ hai trước khi đọc thuộc tính. Bạn quyết cách xử lý:</p>
${ma('typescript', CODE.labsFixed)}
${ra(UNDEF_FIX)}
<p>Nó vẫn dừng ở BE-209 — nhưng với <code>Unknown lab BE-209</code>, thông báo do bạn viết, từ một dòng bạn test được. Và để ý: không <code>!</code>, không <code>as</code>, không <code>any</code>. Sau câu <code>if</code>, TypeScript <em>biết</em> <code>lab</code> đã có giá trị. Cái “biết” đó có tên là <strong>narrowing (thu hẹp kiểu)</strong>, và nó có hẳn một chương (Chương 5).</p>
<p>Cẩn thận: chạy tệp <code>.ts</code> bằng Node <em>không</em> bảo vệ bạn. Node chỉ gỡ kiểu rồi chạy phần còn lại:</p>
${ra(OUT['99-undef-ts-chay'])}
<p>Vẫn sập y như bản JavaScript. Sự bảo vệ chỉ tồn tại khi <code>tsc</code> chạy — trong editor lúc bạn gõ và trong CI trước mỗi lần merge. Bài 0.4 đặt sự tách biệt giữa <em>kiểm</em> và <em>chạy</em> vào trung tâm của mọi thứ.</p>

<h3>Mars Climate Orbiter: đơn vị đo cũng là kiểu (xem trước)</h3>
<p>Ngày 23/09/1999 NASA mất tàu Mars Climate Orbiter, một sứ mệnh 327,6 triệu đô la. Hội đồng điều tra sự cố (báo cáo Giai đoạn I, 10/11/1999) chỉ rõ nguyên nhân gốc: “không dùng đơn vị hệ mét khi viết một tệp phần mềm mặt đất” — dữ liệu động cơ theo pound-lực giây trong khi phần mềm dẫn đường đòi newton-giây, lệch hệ số 4,45.</p>
<p>Với cả hai chương trình, giá trị chỉ là “một con số”. TypeScript cho hai con số mang ý nghĩa khác nhau hai kiểu khác nhau — cú pháp Chương 16, đọc để lấy ý tưởng:</p>
${ma('typescript', CODE.impulse)}
${ra(OUT['9a-units-tsc'])}
${ra(OUT['9b-units-chay'])}
<p>Trình kiểm tra từ chối lời gọi trộn đơn vị ở dòng 15. Node, vốn không bao giờ kiểm kiểu, chạy cả hai dòng: dòng đầu in <code>10.00 N·s</code> — sai đúng hệ số 4,45 đã giết con tàu — còn dòng đã đổi đơn vị in <code>44.50 N·s</code>. Hai chương trình thật là tách biệt, nên đây không phải “TypeScript đã cứu được” — mà là một thói quen: khi hai giá trị không được trộn, hãy biến việc trộn thành lỗi biên dịch.</p>

<h3>Hai tình huống nhóm sinh viên nào cũng gặp (minh hoạ, không phải chuyện có thật)</h3>
<p><strong>A · Đổi tên trước buổi demo.</strong> Đêm trước buổi review SWP391, backend đổi <code>roomId</code> thành <code>labId</code>. Trang React vẫn đọc <code>booking.roomId</code>, nhận <code>undefined</code>, và hiện ô trống trước mặt giảng viên. Với một kiểu <code>Booking</code> dùng chung, build frontend đã đỏ từ đêm hôm trước, đúng dòng cần sửa.</p>
<p><strong>B · Số chỗ đến dưới dạng chuỗi.</strong> Một API trả <code>"seats": "31"</code>. Có đoạn chạy nhờ may — <code>'31' &gt; 30</code> là <code>true</code> — có đoạn hỏng lặng lẽ: <code>'31' + 1</code> là <code>'311'</code> (đã chạy bằng Node 22.23.3: <code>true 311</code>). Dữ liệu từ mạng là bất cứ thứ gì mạng gửi, mặc kệ kiểu của bạn: Chương 13 kiểm nó ở cửa bằng Zod, bài 1.2 giải thích vì sao.</p>

<h3>Vì sao người mới hay bỏ TypeScript — và thuốc giải</h3>
<table>
<thead><tr><th>Cảm giác</th><th>Thuốc giải trong khoá này</th></tr></thead>
<tbody>
<tr><td>Một bức tường đỏ sau khi bật strict</td><td>Sửa lỗi <strong>đầu tiên</strong>, chạy lại (bài 0.2)</td></tr>
<tr><td>Thông báo dài bốn, năm dòng</td><td>Đọc <strong>từ dưới lên</strong>: dòng cuối là nguyên nhân</td></tr>
<tr><td><code>any</code> làm đỏ biến mất</td><td>Lab 1 đo điều này: code toàn <code>any</code> để lọt 7/8 lời gọi sai; tệp chưa đụng tới bắt được 3</td></tr>
<tr><td>Generics trông như đại số</td><td>Không gặp trước Chương 6, luôn trên code LabFlow</td></tr>
<tr><td>“JavaScript của tôi vẫn chạy, cần gì?”</td><td>Chương nào cũng có một bug Node chạy còn <code>tsc</code> từ chối, kèm output thật</td></tr>
</tbody>
</table>

<h3>Hai lộ trình</h3>
<table>
<thead><tr><th></th><th>Lộ trình tối thiểu</th><th>Lộ trình đầy đủ</th></tr></thead>
<tbody>
<tr><td>Chương</td><td>Mục 0, Chương 1–6, 9, 11, 13</td><td>Mục 0 tới Chương 16 theo thứ tự</td></tr>
<tr><td>Lab</td><td>Lab của các chương đó</td><td>Mọi lab chương + dự án cuối khoá</td></tr>
<tr><td>Thời gian</td><td>≈ 30 giờ · 4–5 tuần, mỗi ngày một giờ</td><td>≈ 60–70 giờ · 10–12 tuần</td></tr>
<tr><td>Hợp với</td><td>Bài SDN302 và backend SWP391 ngay bây giờ</td><td>Phỏng vấn thực tập và làm việc nhóm thật</td></tr>
</tbody>
</table>
<p>Thời gian tính khi bạn tự gõ mọi ví dụ.</p>

<h3>Nhịp học một bài</h3>
<p><strong>Slide</strong> (≈ 10 phút) → <strong>bài đọc</strong>, gõ lại và chạy mọi ví dụ, so với output thật (≈ 30 phút) → <strong>🧪 Thực hành</strong> có “đạt khi” (15 phút) → bài <strong>Code Lab</strong> do chính trình biên dịch chấm (“phải biên dịch được”, “các lời gọi sai này phải bị từ chối”) → cuối chương là <strong>lab</strong> có script chấm và <strong>quiz</strong> mười câu tình huống. Bí? Viết ra lệnh đã chạy, điều mong đợi, output dạng chữ và những gì đã thử — rồi mới hỏi.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo năm tệp của <code>demo0/ts-00-9/su-co/</code> như trên. Chạy <code>npx tsc -p demo0/ts-00-9/su-co</code>, rồi <code>node demo0/ts-00-9/su-co/seed.ts</code>: exit 0, rồi lỗi enum.</li>
<li>Thêm <code>tsconfig.seed.json</code>, chạy <code>tsc -p</code> với nó và chép dòng cuối của thông báo TS2345 vào sổ.</li>
<li>Sửa seed: xoá <code>type ContentType</code> riêng của nó, import kiểu thật, sửa dữ liệu.</li>
<li>Đổi <code>QUIZ</code> thành <code>EXAM</code> chỉ trong <code>types.ts</code>. Đoán xem <code>tsc</code> báo ở đâu, rồi chạy.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Seed đã sửa (đặt ở <code>demo0/ts-00-9/su-co/sau/</code>, nên import đi lên một thư mục):</p>
${ma('typescript', CODE.seedSau)}
${ra(OUT['95-sau'])}
<p>Và bước 4, sau khi đổi tên — hai lỗi, ở <code>db.ts</code> và <code>seed.ts</code>, đúng hai chỗ còn ghi <code>QUIZ</code>:</p>
${ra(OUT['9c-luyen'])}
<p><strong>Đạt khi:</strong> seed in ra <code>seeded 3 posts</code>; tệp seed của bạn không còn union riêng nào, chỉ có một dòng <code>import type</code>; và sau khi đổi tên, <code>tsc</code> in đúng những lỗi bạn đã đoán.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">union type (kiểu hợp)</span><span class="v">Kiểu TypeScript nghĩa là “một trong các giá trị này”: <code>'VLOG' | 'ARTICLE'</code>. Chương 5.</span></div>
  <div class="kv"><span class="k">seed script (script gieo dữ liệu)</span><span class="v">Chương trình đổ dữ liệu khởi đầu vào một cơ sở dữ liệu trống.</span></div>
  <div class="kv"><span class="k">single source of truth (nguồn sự thật duy nhất)</span><span class="v">Mỗi sự thật được định nghĩa ở một chỗ và được import ở mọi nơi khác — không bao giờ chép lại.</span></div>
  <div class="kv"><span class="k">include (trong tsconfig)</span><span class="v">Những tệp mà phép kiểm thật sự đọc. Tệp nằm ngoài thì không được kiểm chút nào.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">Một phần của chế độ strict: <code>undefined</code> và <code>null</code> là kiểu riêng mà bạn phải xử lý.</span></div>
  <div class="kv"><span class="k">narrowing (thu hẹp kiểu)</span><span class="v">Sau một phép kiểm như <code>if (lab === undefined) throw …</code>, TypeScript biết kiểu hẹp hơn.</span></div>
</div>

<h3>🗺 Một kiểu bị chép biến thành sự cố thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chép</div><div class="lz-d">một kiểu được gõ tay thay vì import</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đổi tên</div><div class="lz-d">bản gốc đổi; bản sao thì không</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Kiểm xanh</div><div class="lz-d">tệp nằm ngoài include, hoặc tự khớp với chính nó</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">giá trị cũ gặp dữ liệu thật</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Sửa</div><div class="lz-d">import kiểu, kiểm mọi tệp</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểu bắt được 15% trong 400 bug công khai (ICSE 2017); Airbnb báo ước tính nội bộ 38%. Không phải 100% — vẫn giữ test.</li>
<li>08/08/2026 ở trang này: union bị chép trong seed + tsconfig không đọc seed = kiểm xanh, production vỡ. Import kiểu, đừng chép.</li>
<li>Phép kiểm chỉ bảo vệ tệp trong <code>include</code>. Đọc thông báo dài từ dưới lên; sửa lỗi đầu tiên trước.</li>
<li>Strict từ chối <code>Cannot read properties of undefined</code> (TS2532) — chỉ khi <code>tsc</code> chạy; Node chỉ gỡ kiểu.</li>
<li>Lộ trình tối thiểu ≈ 30 giờ cho backend có kiểu ngay; đầy đủ ≈ 60–70 giờ với mọi lab và dự án cuối khoá.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
</div>
`,
};
