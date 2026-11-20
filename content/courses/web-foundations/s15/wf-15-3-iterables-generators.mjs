/**
 * Bài 15.3 — Iterable và generator: thứ for...of, spread, destructuring thật sự dùng (soạn 20/11/2026).
 * Mã + output: ../_ma.mjs — _demo/15-3/(tất cả) chạy bằng scripts/wf/chay-demo.mjs (Chromium thật; paging.js fetch các
 * tệp page-*.json / loop-*.json qua máy chủ tĩnh của chay-demo).
 * Không trùng: 4.2 (for...in không dành cho mảng), 5.3 (await trong vòng lặp), 11.4 (Map/Set). Chưa có deck wf-15-3.
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

export default {
  title: '15.3 — Iterables and generators: what for...of and spread really use|||15.3 — Iterable và generator: thứ for...of và spread thật sự dùng',
  slug: 'wf-15-3-iterables-generators',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Giao thức lặp (Symbol.iterator, next() trả {value, done}) đứng sau for...of, spread, destructuring, Array.from; vì sao object thường "is not iterable"; tự làm object lặp được; generator function*/yield chạy lười; dãy vô hạn + take; bẫy iterator chỉ dùng được một lần; chuỗi lặp theo code point (emoji, chữ Việt NFC/NFD, Intl.Segmenter); async generator + for await đọc API phân trang, dừng sớm bằng break; góc hacker: link "next" vòng lặp ⇒ đặt trần trang. Mọi ví dụ chạy thật trong Chromium.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Iterables and generators: one small protocol behind half of modern JavaScript</h2>
<p class="lead">You already use <code>for...of</code>, spread <code>[...x]</code>, destructuring <code>const [a, b] = x</code>, <code>Array.from</code>, <code>new Set(x)</code> and <code>Promise.all(x)</code>. All of them run on one tiny agreement called the <strong>iteration protocol</strong>. After this lesson you can explain the error "x is not iterable", make your own objects work with all of those features, write <strong>generators</strong> that produce values lazily (only when asked), read a paginated API with <code>for await</code> and stop early, and count the characters of a Vietnamese string the way a person does. Interviewers like generators because they test whether you understand that a function can pause.</p>

<h3>An everyday picture: the queue-number machine at the bank</h3>
<p>At a bank or a hospital you press a button and the machine gives you <em>one</em> ticket: number 41. It does not print the whole day's tickets in advance; it remembers where it is and gives the next one when asked. When the counter closes, the screen says "no more tickets". That is an <strong>iterator</strong>: an object with a <code>next()</code> button that returns <code>{ value: 41, done: false }</code>, and finally <code>{ done: true }</code>. An <strong>iterable</strong> is anything that can give you such a machine — an array, a string, a Map. And a <strong>generator</strong> is the easiest way to build the machine yourself.</p>

<h3>Step 1 — who is iterable, and who is not</h3>
${ma('javascript', CODE['15-3/who-is-iterable.js'])}
${ra(OUT['15-3/who-is-iterable'])}
<p>Arrays, strings, Sets and Maps (and NodeLists from <code>querySelectorAll</code>) all work with <code>for...of</code>. A plain object does not: you get <code>TypeError: user is not iterable</code>. That is a design decision, not a bug — an object is a record with named fields, and "the next item" has no obvious meaning. When you want to loop over one, choose explicitly: <code>Object.keys</code>, <code>Object.values</code> or <code>Object.entries</code>.</p>

<h3>Step 2 — the protocol, by hand</h3>
${ma('javascript', CODE['15-3/by-hand.js'])}
${ra(OUT['15-3/by-hand'])}
<p>That is all <code>for...of</code> does behind the scenes: call <code>[Symbol.iterator]()</code> once to get an iterator, call <code>next()</code> until <code>done</code> is <code>true</code>, and hand you each <code>value</code>. <code>Symbol.iterator</code> is a special built-in key (a <em>symbol</em>, so it can never clash with a normal property name) under which an object keeps its "give me a ticket machine" method.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">obj[Symbol.iterator]()</span><span class="lz-d">The iterable hands out a fresh iterator. No method? "is not iterable".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">it.next()</span><span class="lz-d">Returns <code>{ value, done: false }</code> — the loop body runs with <code>value</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">repeat</span><span class="lz-d">Each call produces the next value — possibly computed only now.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">{ done: true }</span><span class="lz-d">The loop ends. <code>break</code> earlier tells the iterator to stop and clean up.</span></div>
</div>

<h3>Step 3 — make your own object iterable</h3>
<p>Give an object a <code>[Symbol.iterator]</code> method that returns something with <code>next()</code>, and every feature in the lead paragraph works with it:</p>
${ma('javascript', CODE['15-3/own-iterable.js'])}
${ra(OUT['15-3/own-iterable'])}
<p>One method, five features: <code>for...of</code>, spread, destructuring, <code>Array.from</code> and spreading into function arguments. Notice that no array of 1…5 was ever stored — each number was computed when <code>next()</code> asked for it.</p>

<h3>Step 4 — generators: the ticket machine in four lines</h3>
<p>Writing <code>next()</code> by hand is clumsy. A <strong>generator function</strong> — <code>function*</code> — does it for you. Each <code>yield</code> hands out one value and <em>pauses the function</em> right there, keeping all its local variables, until someone asks for the next value:</p>
${ma('javascript', CODE['15-3/generator.js'])}
${ra(OUT['15-3/generator'])}
<p>Read the order of the lines. Calling <code>range(1, 3)</code> ran <em>nothing</em> ("created — nothing has run yet"). The first <code>next()</code> ran the function up to the first <code>yield</code> and stopped. The caller then did its own work, and the function was still frozen at <code>yield 1</code>. This is the property that makes generators special: a normal function runs to the end in one go (lesson 5.1); a generator runs <em>in slices, on demand</em>. The generator object is itself an iterator and an iterable, so spread took "what was left": <code>[3]</code>.</p>

<h3>Step 5 — lazy pipelines and infinite sequences</h3>
${ma('javascript', CODE['15-3/lazy.js'])}
${ra(OUT['15-3/lazy'])}
<p><code>naturals()</code> is infinite — <code>while (true)</code> — and that is fine, because nothing is produced until someone asks. <code>take</code> asks for exactly five multiples of 7 and then <em>returns</em>, which stops the whole chain: only 35 numbers were ever produced. With arrays you would have to guess a size first ("the first 1,000 numbers ought to be enough") and compute all of them. The same idea powers reading huge files line by line in Node.js streams.</p>

<h3>Step 6 — an iterator can be used only once</h3>
${ma('javascript', CODE['15-3/one-shot.js'])}
${ra(OUT['15-3/one-shot'])}
<p>An array is an <em>iterable</em>: every loop asks it for a fresh iterator, so it restarts. A generator object is an <em>iterator</em>: it has one position, and once it reaches the end it stays there. The second spread quietly produced an empty array — no error.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — looping twice over the same generator.</strong> A typical bug: <code>const rows = readRows()</code>, then <code>rows</code> is used once to count and once to render — and the table renders empty. Either call the generator function again for each pass, or turn the result into an array once with <code>[...rows]</code> if it is small enough to keep.</p></div>

<h3>Step 7 — strings iterate by code point, not by "character"</h3>
${ma('javascript', CODE['15-3/strings.js'])}
${ra(OUT['15-3/strings'])}
<p>Three different answers to "how long is this?". <code>.length</code> counts UTF-16 units: a thumbs-up with a skin tone is 4. String iteration (spread, <code>for...of</code>) counts <strong>code points</strong>: 2. A person sees <strong>1</strong>. Vietnamese adds its own twist: "ệ" can be stored as one code point (NFC) or as "e" plus two combining marks (NFD) — identical on screen, unequal for <code>===</code>, and different lengths. Text pasted from some macOS apps or PDFs often arrives in NFD.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a character counter that disagrees with the user.</strong> A "bio, max 160 characters" field that uses <code>.length</code> will reject a short bio full of emoji or decomposed Vietnamese letters. Count with <code>Intl.Segmenter</code> (graphemes, what humans count) for the limit you show, normalise with <code>.normalize('NFC')</code> before comparing or saving, and still enforce a byte/length limit on the server.</p></div>

<h3>Step 8 — async generators: reading a paginated API</h3>
<p>Lesson 6.5 built an API that returns one page at a time with a link to the next page. An <strong>async generator</strong> (<code>async function*</code>) can hide the paging completely: the caller sees a single stream of items and loops over it with <code>for await...of</code>. The three JSON files here are real files fetched by Chromium: <code>page-1.json</code> → <code>page-2.json</code> → <code>page-3.json</code> → <code>null</code>.</p>
${ma('javascript', CODE['15-3/paging.js'])}
${ra(OUT['15-3/paging'])}
<p>Three results to notice. Reading everything took exactly three requests. When the caller found what it needed and wrote <code>break</code>, the generator stopped too: page 3 was <strong>never downloaded</strong> — laziness saved a request. And the third run hit a server whose "next" links point at each other forever; the generator gave up after the cap instead of looping until the tab died.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Caller</span><span class="lz-t">for await (const item of allProducts())</span><span class="lz-d">Sees one stream of items. Can <code>break</code> at any time.</span></div>
<div class="lz-layer"><span class="lz-k">Async generator</span><span class="lz-t">yield* body.items; url = body.next</span><span class="lz-d">Knows about pages, URLs, errors and the safety cap. Fetches the next page only when the caller needs more.</span></div>
<div class="lz-layer"><span class="lz-k">HTTP API</span><span class="lz-t">{ items, next }</span><span class="lz-d">Cursor or offset paging (API Design course, chapter 3).</span></div>
</div>

<h3>Which loop when?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">for...of</span><span class="v">Values of any iterable (arrays, strings, Map, Set, NodeList, generators). Supports <code>break</code>, <code>continue</code> and <code>await</code> inside.</span></div>
  <div class="kv"><span class="k">for...in</span><span class="v">Property <em>names</em> of an object, including inherited ones. Not for arrays (lesson 4.2).</span></div>
  <div class="kv"><span class="k">arr.forEach / map / filter</span><span class="v">Arrays only. No <code>break</code>; <code>await</code> inside does not wait (lesson 5.3).</span></div>
  <div class="kv"><span class="k">for await...of</span><span class="v">Async iterables: async generators, Node streams, paginated APIs.</span></div>
  <div class="kv"><span class="k">Object.entries(obj)</span><span class="v">Turn a plain object into an array of [key, value] pairs when you need to loop over it.</span></div>
</div>

<h3>🕵️ Hacker's corner — never let the server decide how long you loop</h3>
<p>A loop such as <code>while (url) { … url = body.next }</code> trusts the server completely. A buggy API (a cursor that never advances) or a hostile one (a third-party or attacker-controlled endpoint that always returns a "next" link) turns your page into an infinite request loop: the tab freezes, the user's mobile data drains, and if many clients do it at once your own backend receives a self-inflicted denial of service. The same applies to any data you iterate over that came from outside — a "list" of a million items in a JSON response, or a recursive structure.</p>
<p><strong>How to defend:</strong> put a hard cap on pages and items (the <code>maxPages</code> check above), detect a cursor that repeats, add a timeout per request (<code>AbortSignal.timeout</code>, lesson 5.4), and stop as soon as you have what you need (<code>break</code> — the generator then stops fetching). On the server side, the API should also cap <code>limit</code> (lesson 6.5).</p>

<div class="callout ok">
<p><strong>🧪 Lab (25 minutes) — three small generators</strong></p>
<ol>
  <li><code>function* chunk(array, size)</code> yields consecutive slices: <code>[...chunk([1,2,3,4,5], 2)]</code> ⇒ <code>[[1, 2], [3, 4], [5]]</code>. Use it to send 1,000 IDs to an API 100 at a time.</li>
  <li><code>function* cycle(items)</code> yields the items round and round forever (a carousel). Combine it with the <code>take</code> from Step 5: <code>[...take(cycle(['a','b','c']), 7)]</code> ⇒ <code>['a','b','c','a','b','c','a']</code>.</li>
  <li>Make an object <code>playlist = { songs: [...], [Symbol.iterator]: function* () { … } }</code> that yields only the songs not marked <code>skip: true</code>. Check that <code>[...playlist]</code> works <em>twice</em> in a row and gives the same result both times (why does it, when Step 6 said generators are one-shot?).</li>
</ol>
<p><strong>Done when:</strong> the three expressions above print exactly the arrays shown, <code>take(cycle(...))</code> returns instead of freezing the tab, and you can explain in one sentence why <code>[...playlist]</code> restarts but <code>[...gen]</code> from Step 6 did not (hint: who calls the generator function each time?).</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">iterable</span><span class="v">đối tượng lặp được — có phương thức <code>[Symbol.iterator]</code>.</span></div>
  <div class="kv"><span class="k">iterator</span><span class="v">bộ lặp — có <code>next()</code> trả về <code>{ value, done }</code>; chỉ đi một chiều, một lần.</span></div>
  <div class="kv"><span class="k">iteration protocol</span><span class="v">giao thức lặp — thoả thuận chung mà for...of, spread, destructuring dùng.</span></div>
  <div class="kv"><span class="k">Symbol.iterator</span><span class="v">khoá đặc biệt (symbol) chứa phương thức "đưa tôi một bộ lặp".</span></div>
  <div class="kv"><span class="k">generator (function*)</span><span class="v">hàm sinh — chạy từng đoạn, tạm dừng ở mỗi <code>yield</code>.</span></div>
  <div class="kv"><span class="k">lazy evaluation</span><span class="v">tính lười — chỉ tính giá trị khi có người hỏi tới.</span></div>
  <div class="kv"><span class="k">async generator / for await</span><span class="v">hàm sinh bất đồng bộ / vòng lặp chờ từng giá trị đến sau.</span></div>
  <div class="kv"><span class="k">code point / grapheme</span><span class="v">điểm mã Unicode / ký tự theo cảm nhận của người đọc.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>for...of, spread, destructuring, <code>Array.from</code>, <code>new Set</code>, <code>Promise.all</code> all use one protocol: <code>[Symbol.iterator]()</code> → <code>next()</code> → <code>{ value, done }</code>.</li>
  <li>Plain objects are not iterable on purpose; use <code>Object.entries</code>.</li>
  <li><code>function*</code> + <code>yield</code> builds iterators easily; a generator pauses at each <code>yield</code> and runs only on demand.</li>
  <li>Laziness makes infinite sequences and early stopping cheap (35 numbers produced, page 3 never fetched).</li>
  <li>An iterator is one-shot; an iterable can hand out fresh iterators.</li>
  <li>Strings iterate by code point; count what users see with <code>Intl.Segmenter</code> and normalise Vietnamese to NFC.</li>
  <li>Cap every loop whose length is decided by data from outside.</li>
</ul>
${nguon('📗', 'MDN — Iteration protocols', 'The iterable and iterator protocols, precisely', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols')}
${nguon('📘', 'javascript.info — Generators', 'function*, yield, generator composition, with tasks', 'https://javascript.info/generators')}
${nguon('📘', 'javascript.info — Async iteration and generators', 'for await, async generators and a paginated-data example', 'https://javascript.info/async-iterators-generators')}
${nguon('📗', 'MDN — Intl.Segmenter', 'Splitting text into graphemes, words and sentences, locale-aware', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-4-map-set-immutable', title: 'Lesson 11.4 — Map, Set and immutability', sub: 'The two built-in iterables you will use most, and why Map beats an object as a dictionary', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-5-rest-params-query', title: 'Lesson 6.5 — REST, path parameters and query strings', sub: 'The paging API that the async generator in Step 8 reads', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-3-3-stream', title: 'Node.js 3.3 — streams: the 348 MB experiment', sub: 'for await over a file stream: the same laziness, at server scale', cta: 'Open lesson' })}
${lienKet({ khoa: 'api-design', bai: 'api-3-2-cursor', title: 'API Design 3.2 — cursor pagination done right', sub: 'Designing the "next" link your async generator follows', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Iterable và generator: một giao thức nhỏ đứng sau nửa JavaScript hiện đại</h2>
<p class="lead">Bạn đã dùng <code>for...of</code>, spread <code>[...x]</code>, destructuring <code>const [a, b] = x</code>, <code>Array.from</code>, <code>new Set(x)</code> và <code>Promise.all(x)</code>. Tất cả chạy trên một thoả thuận tí hon gọi là <strong>giao thức lặp (iteration protocol)</strong>. Học xong bài này bạn giải thích được lỗi "x is not iterable", làm cho object của chính mình chạy được với mọi tính năng đó, viết <strong>generator</strong> sinh giá trị một cách lười (chỉ khi được hỏi), đọc một API phân trang bằng <code>for await</code> và dừng sớm, và đếm ký tự của một chuỗi tiếng Việt đúng như người đọc đếm. Người phỏng vấn thích generator vì nó kiểm tra bạn có hiểu rằng một hàm có thể tạm dừng hay không.</p>

<h3>Liên tưởng đời thường: máy bốc số thứ tự ở ngân hàng</h3>
<p>Ở ngân hàng hay bệnh viện, bạn bấm nút và máy đưa bạn <em>một</em> vé: số 41. Nó không in sẵn vé của cả ngày; nó nhớ mình đang ở đâu và đưa số kế tiếp khi được hỏi. Khi quầy đóng, màn hình báo "hết số". Đó là một <strong>iterator (bộ lặp)</strong>: một đối tượng có nút <code>next()</code> trả về <code>{ value: 41, done: false }</code>, và cuối cùng là <code>{ done: true }</code>. Một <strong>iterable (đối tượng lặp được)</strong> là bất cứ thứ gì đưa được cho bạn một cái máy như vậy — mảng, chuỗi, Map. Còn <strong>generator</strong> là cách dễ nhất để tự đóng cái máy đó.</p>

<h3>Bước 1 — ai lặp được, ai không</h3>
${ma('javascript', CODE['15-3/who-is-iterable.js'])}
${ra(OUT['15-3/who-is-iterable'])}
<p>Mảng, chuỗi, Set và Map (cùng NodeList từ <code>querySelectorAll</code>) đều chạy với <code>for...of</code>. Object thường thì không: bạn nhận <code>TypeError: user is not iterable</code>. Đây là quyết định thiết kế, không phải lỗi — object là một bản ghi có các trường được đặt tên, và "phần tử kế tiếp" không có nghĩa rõ ràng. Muốn lặp qua nó thì chọn rõ ràng: <code>Object.keys</code>, <code>Object.values</code> hoặc <code>Object.entries</code>.</p>

<h3>Bước 2 — giao thức, làm bằng tay</h3>
${ma('javascript', CODE['15-3/by-hand.js'])}
${ra(OUT['15-3/by-hand'])}
<p>Đó là tất cả những gì <code>for...of</code> làm phía sau: gọi <code>[Symbol.iterator]()</code> một lần để lấy bộ lặp, gọi <code>next()</code> tới khi <code>done</code> là <code>true</code>, và đưa bạn từng <code>value</code>. <code>Symbol.iterator</code> là một khoá có sẵn đặc biệt (một <em>symbol</em>, nên không bao giờ trùng với tên thuộc tính thường) nơi object cất phương thức "đưa tôi một cái máy bốc số".</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">obj[Symbol.iterator]()</span><span class="lz-d">Đối tượng lặp được đưa ra một bộ lặp mới. Không có phương thức đó? "is not iterable".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">it.next()</span><span class="lz-d">Trả về <code>{ value, done: false }</code> — thân vòng lặp chạy với <code>value</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">lặp lại</span><span class="lz-d">Mỗi lần gọi sinh ra giá trị kế tiếp — có thể giờ mới được tính.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">{ done: true }</span><span class="lz-d">Vòng lặp kết thúc. <code>break</code> sớm thì báo cho bộ lặp dừng và dọn dẹp.</span></div>
</div>

<h3>Bước 3 — tự làm một object lặp được</h3>
<p>Cho object một phương thức <code>[Symbol.iterator]</code> trả về thứ có <code>next()</code>, và mọi tính năng ở đoạn mở đầu đều chạy với nó:</p>
${ma('javascript', CODE['15-3/own-iterable.js'])}
${ra(OUT['15-3/own-iterable'])}
<p>Một phương thức, năm tính năng: <code>for...of</code>, spread, destructuring, <code>Array.from</code> và trải vào tham số hàm. Để ý là không có mảng 1…5 nào từng được lưu — mỗi số được tính lúc <code>next()</code> hỏi tới.</p>

<h3>Bước 4 — generator: cái máy bốc số trong bốn dòng</h3>
<p>Viết <code>next()</code> bằng tay thì vụng. Một <strong>hàm generator</strong> — <code>function*</code> — làm hộ bạn. Mỗi <code>yield</code> đưa ra một giá trị và <em>tạm dừng hàm</em> ngay tại đó, giữ nguyên mọi biến cục bộ, cho tới khi có người hỏi giá trị kế tiếp:</p>
${ma('javascript', CODE['15-3/generator.js'])}
${ra(OUT['15-3/generator'])}
<p>Đọc thứ tự các dòng. Gọi <code>range(1, 3)</code> không chạy <em>gì cả</em> ("created — nothing has run yet"). Lần <code>next()</code> đầu chạy hàm tới <code>yield</code> đầu tiên rồi dừng. Bên gọi làm việc riêng của nó, trong khi hàm vẫn đứng yên ở <code>yield 1</code>. Đây là tính chất làm generator đặc biệt: hàm thường chạy một mạch tới cuối (bài 5.1); generator chạy <em>từng lát, theo yêu cầu</em>. Bản thân đối tượng generator vừa là iterator vừa là iterable, nên spread lấy "phần còn lại": <code>[3]</code>.</p>

<h3>Bước 5 — chuỗi xử lý lười và dãy vô hạn</h3>
${ma('javascript', CODE['15-3/lazy.js'])}
${ra(OUT['15-3/lazy'])}
<p><code>naturals()</code> là vô hạn — <code>while (true)</code> — và vẫn ổn, vì chưa ai hỏi thì chưa sinh gì. <code>take</code> xin đúng năm bội số của 7 rồi <em>return</em>, việc này dừng cả chuỗi: chỉ 35 con số từng được sinh ra. Với mảng, bạn phải đoán kích thước trước ("chắc 1.000 số đầu là đủ") rồi tính hết. Cùng ý tưởng này giúp đọc tệp khổng lồ từng dòng bằng stream trong Node.js.</p>

<h3>Bước 6 — một iterator chỉ dùng được một lần</h3>
${ma('javascript', CODE['15-3/one-shot.js'])}
${ra(OUT['15-3/one-shot'])}
<p>Mảng là <em>iterable</em>: mỗi vòng lặp xin nó một bộ lặp mới, nên nó bắt đầu lại. Đối tượng generator là <em>iterator</em>: nó có một vị trí duy nhất, đã tới cuối là ở đó luôn. Lần spread thứ hai lặng lẽ cho ra mảng rỗng — không báo lỗi.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lặp hai lần trên cùng một generator.</strong> Bug điển hình: <code>const rows = readRows()</code>, rồi <code>rows</code> được dùng một lần để đếm và một lần để vẽ — và bảng hiện ra trống trơn. Hoặc gọi lại hàm generator cho mỗi lượt, hoặc biến kết quả thành mảng một lần bằng <code>[...rows]</code> nếu đủ nhỏ để giữ.</p></div>

<h3>Bước 7 — chuỗi lặp theo code point, không theo "ký tự"</h3>
${ma('javascript', CODE['15-3/strings.js'])}
${ra(OUT['15-3/strings'])}
<p>Ba câu trả lời khác nhau cho câu "dài bao nhiêu?". <code>.length</code> đếm đơn vị UTF-16: ngón cái có màu da là 4. Lặp chuỗi (spread, <code>for...of</code>) đếm <strong>code point (điểm mã)</strong>: 2. Con người thấy <strong>1</strong>. Tiếng Việt thêm một khúc quanh: "ệ" có thể lưu thành một điểm mã (NFC) hoặc "e" cộng hai dấu kết hợp (NFD) — giống hệt trên màn hình, khác nhau với <code>===</code>, và khác độ dài. Chữ dán từ một số ứng dụng macOS hay từ PDF thường tới ở dạng NFD.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bộ đếm ký tự cãi nhau với người dùng.</strong> Ô "giới thiệu, tối đa 160 ký tự" dùng <code>.length</code> sẽ từ chối một đoạn giới thiệu ngắn đầy emoji hoặc chữ Việt dạng tổ hợp. Đếm bằng <code>Intl.Segmenter</code> (grapheme, thứ con người đếm) cho con số hiện ra, chuẩn hoá bằng <code>.normalize('NFC')</code> trước khi so sánh hay lưu, và vẫn chặn độ dài/byte ở máy chủ.</p></div>

<h3>Bước 8 — async generator: đọc một API phân trang</h3>
<p>Bài 6.5 đã dựng một API trả từng trang một kèm link tới trang sau. Một <strong>async generator</strong> (<code>async function*</code>) giấu hẳn chuyện phân trang: bên gọi chỉ thấy một dòng chảy phần tử và lặp qua bằng <code>for await...of</code>. Ba tệp JSON ở đây là tệp thật được Chromium tải: <code>page-1.json</code> → <code>page-2.json</code> → <code>page-3.json</code> → <code>null</code>.</p>
${ma('javascript', CODE['15-3/paging.js'])}
${ra(OUT['15-3/paging'])}
<p>Ba kết quả đáng để ý. Đọc hết tốn đúng ba request. Khi bên gọi tìm thấy thứ cần và viết <code>break</code>, generator cũng dừng: trang 3 <strong>không bao giờ được tải</strong> — tính lười tiết kiệm một request. Và lượt thứ ba gặp một máy chủ có các link "next" trỏ qua lại nhau mãi mãi; generator bỏ cuộc sau khi chạm trần thay vì lặp tới khi tab chết.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Bên gọi</span><span class="lz-t">for await (const item of allProducts())</span><span class="lz-d">Thấy một dòng chảy phần tử. <code>break</code> lúc nào cũng được.</span></div>
<div class="lz-layer"><span class="lz-k">Async generator</span><span class="lz-t">yield* body.items; url = body.next</span><span class="lz-d">Biết về trang, URL, lỗi và trần an toàn. Chỉ tải trang kế khi bên gọi cần thêm.</span></div>
<div class="lz-layer"><span class="lz-k">HTTP API</span><span class="lz-t">{ items, next }</span><span class="lz-d">Phân trang kiểu cursor hoặc offset (khoá API Design, chương 3).</span></div>
</div>

<h3>Vòng lặp nào, khi nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">for...of</span><span class="v">Giá trị của mọi iterable (mảng, chuỗi, Map, Set, NodeList, generator). Dùng được <code>break</code>, <code>continue</code> và <code>await</code> bên trong.</span></div>
  <div class="kv"><span class="k">for...in</span><span class="v"><em>Tên</em> thuộc tính của object, kể cả thuộc tính kế thừa. Không dành cho mảng (bài 4.2).</span></div>
  <div class="kv"><span class="k">arr.forEach / map / filter</span><span class="v">Chỉ cho mảng. Không có <code>break</code>; <code>await</code> bên trong không chờ (bài 5.3).</span></div>
  <div class="kv"><span class="k">for await...of</span><span class="v">Iterable bất đồng bộ: async generator, stream của Node, API phân trang.</span></div>
  <div class="kv"><span class="k">Object.entries(obj)</span><span class="v">Biến object thường thành mảng các cặp [khoá, giá trị] khi cần lặp qua nó.</span></div>
</div>

<h3>🕵️ Góc hacker — đừng để máy chủ quyết định bạn lặp bao lâu</h3>
<p>Một vòng lặp như <code>while (url) { … url = body.next }</code> tin máy chủ tuyệt đối. Một API có lỗi (cursor không bao giờ tiến) hoặc một API thù địch (endpoint của bên thứ ba hay do kẻ tấn công kiểm soát luôn trả link "next") biến trang của bạn thành vòng lặp request vô tận: tab đứng hình, dữ liệu di động của người dùng cạn dần, và nếu nhiều client cùng bị thì chính backend của bạn ăn một đợt từ chối dịch vụ tự gây ra. Điều tương tự áp dụng cho mọi dữ liệu từ bên ngoài mà bạn lặp qua — một "danh sách" một triệu phần tử trong response JSON, hay một cấu trúc đệ quy.</p>
<p><strong>Cách phòng:</strong> đặt trần cứng cho số trang và số phần tử (phép kiểm <code>maxPages</code> ở trên), phát hiện cursor lặp lại, đặt thời gian chờ cho mỗi request (<code>AbortSignal.timeout</code>, bài 5.4), và dừng ngay khi có đủ thứ cần (<code>break</code> — generator khi đó thôi tải). Phía máy chủ, API cũng phải chặn trần <code>limit</code> (bài 6.5).</p>

<div class="callout ok">
<p><strong>🧪 Lab (25 phút) — ba generator nhỏ</strong></p>
<ol>
  <li><code>function* chunk(array, size)</code> sinh các lát liên tiếp: <code>[...chunk([1,2,3,4,5], 2)]</code> ⇒ <code>[[1, 2], [3, 4], [5]]</code>. Dùng nó để gửi 1.000 ID lên API mỗi lần 100 cái.</li>
  <li><code>function* cycle(items)</code> sinh các phần tử xoay vòng mãi mãi (một carousel). Ghép với <code>take</code> ở Bước 5: <code>[...take(cycle(['a','b','c']), 7)]</code> ⇒ <code>['a','b','c','a','b','c','a']</code>.</li>
  <li>Làm một object <code>playlist = { songs: [...], [Symbol.iterator]: function* () { … } }</code> chỉ sinh những bài không đánh dấu <code>skip: true</code>. Kiểm tra <code>[...playlist]</code> chạy được <em>hai lần</em> liên tiếp và cho cùng kết quả (vì sao được, khi Bước 6 nói generator chỉ dùng một lần?).</li>
</ol>
<p><strong>Xong khi:</strong> ba biểu thức trên in đúng các mảng như ghi, <code>take(cycle(...))</code> trả về chứ không làm đứng tab, và bạn giải thích được trong một câu vì sao <code>[...playlist]</code> bắt đầu lại còn <code>[...gen]</code> ở Bước 6 thì không (gợi ý: mỗi lần, ai là người gọi hàm generator?).</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">iterable</span><span class="v">đối tượng lặp được — có phương thức <code>[Symbol.iterator]</code>.</span></div>
  <div class="kv"><span class="k">iterator</span><span class="v">bộ lặp — có <code>next()</code> trả về <code>{ value, done }</code>; chỉ đi một chiều, một lần.</span></div>
  <div class="kv"><span class="k">iteration protocol</span><span class="v">giao thức lặp — thoả thuận chung mà for...of, spread, destructuring dùng.</span></div>
  <div class="kv"><span class="k">Symbol.iterator</span><span class="v">khoá đặc biệt (symbol) chứa phương thức "đưa tôi một bộ lặp".</span></div>
  <div class="kv"><span class="k">generator (function*)</span><span class="v">hàm sinh — chạy từng đoạn, tạm dừng ở mỗi <code>yield</code>.</span></div>
  <div class="kv"><span class="k">lazy evaluation</span><span class="v">tính lười — chỉ tính giá trị khi có người hỏi tới.</span></div>
  <div class="kv"><span class="k">async generator / for await</span><span class="v">hàm sinh bất đồng bộ / vòng lặp chờ từng giá trị đến sau.</span></div>
  <div class="kv"><span class="k">code point / grapheme</span><span class="v">điểm mã Unicode / ký tự theo cảm nhận của người đọc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>for...of, spread, destructuring, <code>Array.from</code>, <code>new Set</code>, <code>Promise.all</code> đều dùng một giao thức: <code>[Symbol.iterator]()</code> → <code>next()</code> → <code>{ value, done }</code>.</li>
  <li>Object thường cố ý không lặp được; dùng <code>Object.entries</code>.</li>
  <li><code>function*</code> + <code>yield</code> dựng bộ lặp dễ dàng; generator dừng ở mỗi <code>yield</code> và chỉ chạy khi được hỏi.</li>
  <li>Tính lười làm dãy vô hạn và dừng sớm trở nên rẻ (chỉ 35 số được sinh, trang 3 không bao giờ được tải).</li>
  <li>Iterator chỉ dùng một lần; iterable thì đưa ra được bộ lặp mới mỗi lần.</li>
  <li>Chuỗi lặp theo code point; đếm thứ người dùng thấy bằng <code>Intl.Segmenter</code> và chuẩn hoá tiếng Việt về NFC.</li>
  <li>Đặt trần cho mọi vòng lặp có độ dài do dữ liệu bên ngoài quyết định.</li>
</ul>
${nguon('📗', 'MDN — Iteration protocols', 'Giao thức iterable và iterator, chính xác từng chữ', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols')}
${nguon('📘', 'javascript.info — Generators', 'function*, yield, ghép generator, kèm bài tập', 'https://javascript.info/generators')}
${nguon('📘', 'javascript.info — Async iteration and generators', 'for await, async generator và ví dụ dữ liệu phân trang', 'https://javascript.info/async-iterators-generators')}
${nguon('📗', 'MDN — Intl.Segmenter', 'Tách văn bản thành grapheme, từ và câu theo ngôn ngữ', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-4-map-set-immutable', title: 'Bài 11.4 — Map, Set và tư duy bất biến', sub: 'Hai iterable có sẵn bạn dùng nhiều nhất, và vì sao Map làm từ điển tốt hơn object', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-5-rest-params-query', title: 'Bài 6.5 — REST, tham số đường dẫn và query string', sub: 'API phân trang mà async generator ở Bước 8 đọc', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-3-3-stream', title: 'Node.js 3.3 — stream: thí nghiệm 348 MB', sub: 'for await trên một stream tệp: cùng tính lười, ở quy mô máy chủ', cta: 'Mở bài' })}
${lienKet({ khoa: 'api-design', bai: 'api-3-2-cursor', title: 'API Design 3.2 — phân trang cursor cho đúng', sub: 'Thiết kế cái link "next" mà async generator của bạn đi theo', cta: 'Mở bài' })}
</div>
`,
};
