/** 5.4 — Trie (cây tiền tố) — bài MỚI ★ (slug dsa-5-5-trie, hiển thị ở vị trí 5.4). Mã/output đọc từ ../ma/ch05 (chạy thật). */
import { ma, maHai, ketQua, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet } from '../_chung.mjs';
import { vetTrie } from '../ma/ch05/trie.vet.mjs';

const OPS = [['insert', 'car'], ['insert', 'cart'], ['insert', 'cat'], ['insert', 'do'], ['search', 'ca'], ['startsWith', 'ca'], ['search', 'cart'], ['search', 'cow']];
const vT = vetTrie(OPS);
const MAU = { follow: 'rgba(66,133,244,.30)', new: 'rgba(214,146,32,.32)', miss: 'rgba(224,85,75,.28)' };
const oChu = (ch, kind) => `<span style="display:inline-block;min-width:1.6em;text-align:center;border:1px solid var(--border-color);padding:0 4px;margin:1px;border-radius:4px;font-family:monospace;background:${MAU[kind]}">${ch}<sup>${kind === 'follow' ? '→' : kind === 'new' ? '+' : '✗'}</sup></span>`;
const BANG_T = bangVet(['#', 'operation', 'letters (→ follow · + new node · ✗ fell off)', 'nodes', 'result'],
  vT.map((h, i) => [
    String(i + 1),
    `<code>${h.op}("${h.word}")</code>`,
    h.steps.map(([ch, kind]) => oChu(ch, kind)).join(''),
    String(h.nodes),
    h.op === 'insert' ? h.result : `<strong>${h.result}</strong>`,
  ]));

const DE = [
  [lc(14, 'longest-common-prefix', 'Longest Common Prefix', 'Easy'), 'Warm-up: the common prefix is the path from the root while every node has exactly one child and is not a word end.', 'Khởi động: tiền tố chung là đường từ gốc chừng nào mỗi nút còn đúng một con và chưa là cuối từ.'],
  [lc(208, 'implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)', 'Medium'), 'The base: children + isEnd; search vs startsWith differ only in the last check.', 'Nền tảng: children + isEnd; search và startsWith chỉ khác ở phép kiểm cuối.'],
  [lc(211, 'design-add-and-search-words-data-structure', 'Design Add and Search Words Data Structure', 'Medium'), '"." = try every child: DFS branches only at wildcards.', '"." = thử mọi con: DFS chỉ rẽ nhánh ở ký tự đại diện.'],
  [lc(1268, 'search-suggestions-system', 'Search Suggestions System', 'Medium'), 'Autocomplete: insert sorted, keep the first 3 words at each node (or sort + binary search).', 'Autocomplete: chèn đã sắp xếp, giữ 3 từ đầu ở mỗi nút (hoặc sắp xếp + tìm nhị phân).'],
  [lc(648, 'replace-words', 'Replace Words', 'Medium'), 'Walk each word down the trie of roots; stop at the first isEnd.', 'Cho mỗi từ đi xuống trie các gốc từ; dừng ở isEnd đầu tiên.'],
  [lc(677, 'map-sum-pairs', 'Map Sum Pairs', 'Medium'), 'Store a running sum in every node on the path (update by the difference on re-insert).', 'Lưu tổng dồn ở mọi nút trên đường đi (chèn lại thì cộng phần chênh lệch).'],
  [lc(720, 'longest-word-in-dictionary', 'Longest Word in Dictionary', 'Medium'), 'DFS/BFS that only steps into children that are word ends.', 'DFS/BFS chỉ bước vào những con là cuối một từ.'],
  [lc(212, 'word-search-ii', 'Word Search II', 'Hard'), 'Trie of the words + backtracking on the grid; prune a branch the moment its prefix is not in the trie (solved in 5.5).', 'Trie các từ + quay lui trên lưới; cắt nhánh ngay khi tiền tố không còn trong trie (giải ở bài 5.5).'],
];

export default {
  title: '5.4 — Tries: prefix trees and the search box|||5.4 — Trie: cây tiền tố và ô gợi ý tìm kiếm',
  slug: 'dsa-5-5-trie',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trie từ số 0: insert/search/startsWith, autocomplete k gợi ý, ký tự đại diện ".", Search Suggestions — đo thật quét mảng vs trie vs sắp xếp + nhị phân, và góc kẻ xấu của ô gợi ý.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4 ★</span>
<h2>Tries: prefix trees and the search box</h2>
<p class="lead">Every search box that finishes your sentence — Google, the contacts app on your phone, VS Code’s IntelliSense, a shop’s product finder — is answering one question very fast: <strong>"which words start with what I have typed so far?"</strong> A hash set cannot answer that without scanning everything. A sorted list can, with binary search. A <strong>trie</strong> (say "try"; also called a <em>prefix tree</em>) is the structure built exactly for it. It is a favourite interview topic because it is a small "design a data structure" problem where everything is code you can finish in 20 minutes — and then the follow-ups test whether you understand its costs.</p>

<h3>The everyday picture: the contacts app and the paper dictionary</h3>
<p>Open the contacts on your phone and type <code>N</code>: the list shrinks to Nam, Ngân, Nguyên, Nhung… Type <code>g</code>: only Ngân and Nguyên remain. Each letter you type moves you <em>one step deeper</em>, and everything that is still possible lives below where you are standing. A paper dictionary does the same with the thumb tabs on its edge: open at "N", then the page headers narrow it to "Ng".</p>
<p>A trie is that picture made literal. It is a rooted tree where each edge is labelled with one character, so each node stands for the <strong>prefix</strong> spelled by the path from the root (the root is the empty string). Words that share a prefix share the path: <code>car</code>, <code>card</code>, <code>care</code> all go through the nodes <code>c → ca → car</code>. Each node carries a flag <code>isEnd</code> meaning "a complete word ends here" — necessary because <code>car</code> is a word and <code>ca</code>, on the same path, is not.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4 ★</span>
<h2>Trie: cây tiền tố và ô gợi ý tìm kiếm</h2>
<p class="lead">Mọi ô tìm kiếm biết đoán nốt câu bạn đang gõ — Google, danh bạ trên điện thoại, IntelliSense của VS Code, ô tìm sản phẩm của một cửa hàng — đều đang trả lời rất nhanh đúng một câu hỏi: <strong>"những từ nào bắt đầu bằng thứ tôi vừa gõ?"</strong> Hash set không trả lời được nếu không quét hết. Danh sách đã sắp xếp thì được, bằng tìm nhị phân. Còn <strong>trie</strong> (đọc như "try"; còn gọi là <em>prefix tree</em> — cây tiền tố) là cấu trúc sinh ra đúng cho việc đó. Nó là đề phỏng vấn được ưa chuộng vì là một bài "thiết kế cấu trúc dữ liệu" nhỏ, toàn code, xong được trong 20 phút — rồi các câu hỏi nối tiếp kiểm xem bạn có hiểu cái giá của nó không.</p>

<h3>Hình dung đời thường: danh bạ điện thoại và cuốn từ điển giấy</h3>
<p>Mở danh bạ trên điện thoại và gõ <code>N</code>: danh sách co lại còn Nam, Ngân, Nguyên, Nhung… Gõ thêm <code>g</code>: chỉ còn Ngân và Nguyên. Mỗi chữ bạn gõ đưa bạn <em>xuống sâu thêm một bậc</em>, và mọi khả năng còn lại đều nằm bên dưới chỗ bạn đang đứng. Cuốn từ điển giấy làm y như vậy bằng các khấc chữ cái ở mép sách: mở tới "N", rồi tiêu đề trang thu hẹp xuống "Ng".</p>
<p>Trie là bức tranh đó được làm thật. Nó là một cây có gốc, mỗi cạnh mang nhãn một ký tự, nên mỗi nút đại diện cho <strong>tiền tố</strong> (prefix) được đánh vần bởi đường đi từ gốc tới nó (gốc là chuỗi rỗng). Các từ có chung tiền tố thì đi chung đường: <code>car</code>, <code>card</code>, <code>care</code> đều đi qua các nút <code>c → ca → car</code>. Mỗi nút mang một cờ <code>isEnd</code> nghĩa là "có một từ trọn vẹn kết thúc ở đây" — bắt buộc phải có, vì <code>car</code> là một từ còn <code>ca</code>, nằm trên cùng đường đó, thì không.</p>
${csd('csd201-slide-cs7-1', 'vi', 'CS.7 Cây nâng cao (có Trie)', '<p>Phần ⭐ CS.7 của CSD201 giới thiệu trie cạnh duyệt theo tầng, LCA và serialize. Ôn nhanh một câu: mỗi nút là một tiền tố, cạnh là một ký tự, cờ cuối từ đánh dấu từ trọn vẹn. <strong>Ở đây đi sâu thêm:</strong> chọn Map hay mảng 26 ô, autocomplete trả k gợi ý theo thứ tự chữ cái, ký tự đại diện, đo thật trie so với quét mảng và với sắp xếp + nhị phân, và mặt tối của ô gợi ý.</p>')}
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"prefix", "starts with", "autocomplete", "suggestions as you type"</span><span class="v">A trie, or a sorted array + binary search if there is only one kind of query.</span></div>
  <div class="kv"><span class="k">many words checked against one big input (a grid, a long text)</span><span class="v">Put the <em>words</em> in a trie, walk the <em>input</em> once and stop a branch as soon as its prefix is not in the trie (Word Search II).</span></div>
  <div class="kv"><span class="k">"." or "?" matching any one character</span><span class="v">A trie with DFS that branches only at the wildcard.</span></div>
  <div class="kv"><span class="k">"shortest root", "replace with the dictionary root"</span><span class="v">Walk the word down the trie and stop at the first <code>isEnd</code>.</span></div>
  <div class="kv"><span class="k">"design" a dictionary with <code>insert</code> / <code>search</code> / <code>startsWith</code></span><span class="v">LC 208 — say the costs: O(L) per operation for a word of length L, memory O(total letters).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"prefix", "starts with", "autocomplete", "gợi ý khi đang gõ"</span><span class="v">Trie, hoặc mảng đã sắp xếp + tìm nhị phân nếu chỉ có một loại truy vấn.</span></div>
  <div class="kv"><span class="k">nhiều từ cần dò trên một đầu vào lớn (lưới chữ, đoạn văn dài)</span><span class="v">Bỏ các <em>từ</em> vào trie, đi trên <em>đầu vào</em> một lần và dừng một nhánh ngay khi tiền tố của nó không có trong trie (Word Search II).</span></div>
  <div class="kv"><span class="k">"." hoặc "?" khớp một ký tự bất kỳ</span><span class="v">Trie với DFS chỉ rẽ nhánh ở ký tự đại diện (wildcard).</span></div>
  <div class="kv"><span class="k">"gốc từ ngắn nhất", "thay bằng gốc từ trong từ điển"</span><span class="v">Cho từ đi xuống trie, dừng ở <code>isEnd</code> đầu tiên.</span></div>
  <div class="kv"><span class="k">"thiết kế" một từ điển có <code>insert</code> / <code>search</code> / <code>startsWith</code></span><span class="v">LC 208 — nói ra cái giá: O(L) mỗi thao tác với từ dài L, bộ nhớ O(tổng số chữ cái).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Implement Trie (Prefix Tree)</h3>
<p><strong>Problem (in our words).</strong> Build a structure with three methods: <code>insert(word)</code>; <code>search(word)</code> — was exactly this word inserted?; <code>startsWith(prefix)</code> — was any inserted word starting with this? Lowercase letters only.</p>
<p><strong>Step 1 — the obvious answers and their costs.</strong> A list of words: insert O(1), but both queries scan all n words, O(n·L). A hash set: <code>search</code> is O(L) (hashing the string), but <code>startsWith</code> still has to scan every word — a hash scatters "app" and "apple" to unrelated buckets, so nearness of spelling is lost. That is the waste: the question is about <em>prefixes</em>, and neither structure stores prefixes.</p>
<p><strong>Step 2 — store the prefixes themselves.</strong> Make every prefix a node. Insert walks the word letter by letter, creating the missing nodes, and marks the last one <code>isEnd</code>. Search walks the same way and needs two things: the path exists <em>and</em> the last node is a word end. startsWith only needs the path. All three are O(L), independent of how many words are stored.</p>
<p><strong>Node design — say the trade-off.</strong> Children as a fixed array of 26 (Java, below): fastest, alphabetical for free, but 26 pointers per node even when it has one child. Children as a <code>Map</code> (TypeScript, below): memory proportional to the real children and any alphabet (Vietnamese letters, digits, emoji), slightly slower. For "lowercase a–z only", both are fine; name the choice.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Implement Trie (Prefix Tree)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Dựng một cấu trúc có ba hàm: <code>insert(word)</code>; <code>search(word)</code> — đúng từ này đã được chèn chưa?; <code>startsWith(prefix)</code> — có từ nào đã chèn bắt đầu bằng tiền tố này không? Chỉ có chữ thường.</p>
<p><strong>Bước 1 — những đáp án hiển nhiên và cái giá của chúng.</strong> Một danh sách từ: chèn O(1), nhưng cả hai truy vấn đều quét hết n từ, O(n·L). Một hash set: <code>search</code> là O(L) (băm chuỗi), nhưng <code>startsWith</code> vẫn phải quét mọi từ — hàm băm rải "app" và "apple" vào hai ô chẳng liên quan gì nhau, nên sự gần nhau về chính tả mất sạch. Đó là chỗ phí: câu hỏi là về <em>tiền tố</em>, mà không cấu trúc nào lưu tiền tố.</p>
<p><strong>Bước 2 — lưu chính các tiền tố.</strong> Biến mỗi tiền tố thành một nút. Chèn đi qua từ từng chữ một, tạo các nút còn thiếu, rồi đánh dấu nút cuối là <code>isEnd</code>. Tìm đi y như thế và cần hai điều: đường đi tồn tại <em>và</em> nút cuối là chỗ kết thúc một từ. startsWith chỉ cần đường đi. Cả ba đều O(L), không phụ thuộc đang lưu bao nhiêu từ.</p>
<p><strong>Thiết kế nút — nói ra sự đánh đổi.</strong> Con là một mảng cố định 26 ô (Java, bên dưới): nhanh nhất, tự có thứ tự chữ cái, nhưng mỗi nút 26 con trỏ kể cả khi chỉ có một con. Con là một <code>Map</code> (TypeScript, bên dưới): bộ nhớ tỉ lệ với số con thật và nhận mọi bảng chữ (chữ tiếng Việt có dấu, chữ số, emoji), chậm hơn một chút. Với "chỉ a–z thường", cách nào cũng ổn; hãy gọi tên lựa chọn của bạn.</p>
</div>
${maHai('ch05/trie.ts', 'ch05/Trie.java', { vung: 'nut' })}
${maHai('ch05/trie.ts', 'ch05/Trie.java', { vung: 'trie' })}
${ketQua('ch05/trie.ts')}
${ketQua('ch05/Trie.java')}
<div class="ml-en">
<p>The first four lines are LeetCode’s example: after inserting <code>apple</code>, <code>search("app")</code> is false — the path a → p → p exists but its last node is not a word end — while <code>startsWith("app")</code> is true. Inserting <code>app</code> creates no node at all; it only flips one <code>isEnd</code>. The fifth line shows the sharing: 8 words with 31 letters in total need only 15 nodes, because <code>car</code>, <code>card</code>, <code>care</code>, <code>careful</code>, <code>cart</code> and <code>cat</code> reuse <code>c → ca</code>.</p>
</div>
<div class="ml-vi">
<p>Bốn dòng đầu là ví dụ của LeetCode: sau khi chèn <code>apple</code>, <code>search("app")</code> là false — đường a → p → p có tồn tại nhưng nút cuối không phải cuối một từ — còn <code>startsWith("app")</code> là true. Chèn <code>app</code> không tạo thêm nút nào; nó chỉ bật một cờ <code>isEnd</code>. Dòng thứ năm cho thấy sự chia sẻ: 8 từ với tổng 31 chữ cái chỉ cần 15 nút, vì <code>car</code>, <code>card</code>, <code>care</code>, <code>careful</code>, <code>cart</code> và <code>cat</code> dùng chung <code>c → ca</code>.</p>
</div>

<div class="ml-en">
<h3>Watch it: insert and search, letter by letter</h3>
<p>One row per operation, produced by running a trie. Blue → = followed an existing node; orange + = created a node; red ✗ = fell off the tree.</p>
</div>
<div class="ml-vi">
<h3>Nhìn nó chạy: chèn và tìm, từng chữ một</h3>
<p>Mỗi hàng là một thao tác, sinh ra bằng cách chạy một trie thật. Ô xanh → = đi theo nút có sẵn; ô cam + = tạo nút mới; ô đỏ ✗ = rơi khỏi cây.</p>
</div>
${BANG_T}
<div class="ml-en">
<p>Row 1 creates three nodes; row 2 (<code>cart</code>) follows those three and creates one; row 3 (<code>cat</code>) shares <code>c → a</code> and creates <code>t</code>. Rows 5 and 6 walk the same two letters and differ only in the final check: <code>search("ca")</code> is false because no word ends at <code>ca</code>, <code>startsWith("ca")</code> is true because the node exists. Row 8 falls off at <code>o</code> after one step — the trie knows "no word starts with co" without looking at a single stored word. The node count never grows during queries.</p>
</div>
<div class="ml-vi">
<p>Hàng 1 tạo ba nút; hàng 2 (<code>cart</code>) đi theo ba nút đó rồi tạo một; hàng 3 (<code>cat</code>) dùng chung <code>c → a</code> và tạo <code>t</code>. Hàng 5 và 6 đi cùng hai chữ và chỉ khác ở phép kiểm cuối: <code>search("ca")</code> là false vì không từ nào kết thúc ở <code>ca</code>, <code>startsWith("ca")</code> là true vì nút đó tồn tại. Hàng 8 rơi khỏi cây ở <code>o</code> sau một bước — trie biết "không từ nào bắt đầu bằng co" mà không cần nhìn một từ đã lưu nào. Số nút không bao giờ tăng trong lúc truy vấn.</p>
</div>

<div class="ml-en">
<h3>Autocomplete: the first k words under a prefix</h3>
<p>The search box needs more than yes/no: "show me 3 suggestions". Walk down to the prefix node, then run a <strong>pre-order DFS</strong> of the subtree (lesson 5.1) visiting children in alphabetical order, collecting every <code>isEnd</code> node, and <strong>stop as soon as you have k</strong>. Pre-order gives the right order for free: a word comes before its own extensions (<code>car</code> before <code>card</code>), and alphabetical children give dictionary order. Java’s array of 26 is already alphabetical; the TypeScript <code>Map</code> keeps insertion order, so it sorts the keys.</p>
</div>
<div class="ml-vi">
<h3>Autocomplete: k từ đầu tiên dưới một tiền tố</h3>
<p>Ô tìm kiếm cần hơn có/không: "cho tôi 3 gợi ý". Đi xuống tới nút của tiền tố, rồi chạy một lượt <strong>DFS pre-order</strong> trên cây con đó (bài 5.1), thăm các con theo thứ tự chữ cái, gom mọi nút <code>isEnd</code>, và <strong>dừng ngay khi đủ k</strong>. Pre-order cho sẵn thứ tự đúng: một từ đứng trước các từ kéo dài nó (<code>car</code> trước <code>card</code>), còn các con theo thứ tự chữ cái cho ra thứ tự từ điển. Mảng 26 ô của Java vốn đã theo chữ cái; <code>Map</code> của TypeScript giữ thứ tự chèn, nên phải sắp xếp các khoá.</p>
</div>
${maHai('ch05/trie.ts', 'ch05/Trie.java', { vung: 'goi-y' })}
<div class="ml-en">
<p>In the output above, <code>suggest("ca", 3)</code> returns <code>["car","card","care"]</code> and never visits <code>careful</code>, <code>cart</code> or <code>cat</code>: the early stop is what keeps a suggestion box fast when a prefix like "a" has a hundred thousand words below it. Watch it on a trie of package-style names:</p>
${moPhong('ch05/trie-goi-y.sim.js', 'en', 'Autocomplete in a trie', 'Typing "js", "ne" and "jx" on /algorithms: one step down per letter, then a pre-order walk collects up to 3 suggestions; a weight of 1 marks a word end.')}
</div>
<div class="ml-vi">
<p>Trong output phía trên, <code>suggest("ca", 3)</code> trả <code>["car","card","care"]</code> và không hề ghé <code>careful</code>, <code>cart</code> hay <code>cat</code>: chính việc dừng sớm giữ cho ô gợi ý nhanh khi một tiền tố như "a" có cả trăm nghìn từ bên dưới. Xem nó chạy trên một trie gồm các tên kiểu tên gói thư viện:</p>
${moPhong('ch05/trie-goi-y.sim.js', 'vi', 'Autocomplete trong trie', 'Gõ "js", "ne" và "jx" trên /algorithms: mỗi chữ xuống một bậc, rồi một lượt pre-order gom tối đa 3 gợi ý; số 1 trên nút đánh dấu cuối một từ.')}
</div>

<div class="ml-en">
<h3>Complexity</h3>
<ul>
<li><code>insert</code>, <code>search</code>, <code>startsWith</code>: <strong>O(L)</strong> for a word of length L — independent of the number of words n.</li>
<li><code>suggest(prefix, k)</code>: O(L) to reach the prefix, plus the part of the subtree visited before k words are found (bounded by the size of that subtree).</li>
<li>Memory: at most one node per inserted letter, <strong>O(total letters)</strong>, and less when prefixes are shared. With 26-slot arrays each node costs 26 pointers on top — this is the follow-up question about why tries can be memory-hungry.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Độ phức tạp</h3>
<ul>
<li><code>insert</code>, <code>search</code>, <code>startsWith</code>: <strong>O(L)</strong> với từ dài L — không phụ thuộc số từ n.</li>
<li><code>suggest(prefix, k)</code>: O(L) để tới tiền tố, cộng phần cây con được thăm trước khi đủ k từ (không quá kích thước cây con đó).</li>
<li>Bộ nhớ: tối đa một nút cho mỗi chữ cái được chèn, <strong>O(tổng số chữ cái)</strong>, và ít hơn khi tiền tố được dùng chung. Với mảng 26 ô, mỗi nút tốn thêm 26 con trỏ — đây là câu hỏi nối tiếp về vì sao trie có thể ngốn bộ nhớ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Variant 1 — Add and Search Words: a wildcard makes the walk branch</h3>
<p>Same trie, but <code>search</code> may contain <code>.</code> meaning "any one letter". A normal letter still follows one child; a dot must try <em>every</em> child — so search becomes a DFS that branches only at dots, with "found" returned up the moment any branch succeeds. The counter in the output shows the price: a plain word visits L + 1 nodes, while <code>"...."</code> (four dots, but every word has three letters) visits the whole trie before answering false.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Add and Search Words: ký tự đại diện làm đường đi rẽ nhánh</h3>
<p>Vẫn trie đó, nhưng <code>search</code> có thể chứa <code>.</code> nghĩa là "một chữ bất kỳ". Chữ thường vẫn đi theo một con; dấu chấm phải thử <em>mọi</em> con — nên search thành một DFS chỉ rẽ nhánh ở dấu chấm, và "tìm thấy" được trả ngược lên ngay khi một nhánh thành công. Bộ đếm trong output cho thấy cái giá: một từ thường thăm L + 1 nút, còn <code>"...."</code> (bốn dấu chấm, mà từ nào cũng chỉ có ba chữ) thăm cả cây trước khi trả lời false.</p>
</div>
${maHai('ch05/add-search.ts', 'ch05/AddSearch.java', { vung: 'tu-dien' })}
${ketQua('ch05/add-search.ts')}

<div class="ml-en">
<h3>Variant 2 — Search Suggestions System: autocomplete, the interview version</h3>
<p>Given product names and a search word, return after each typed letter up to three products (alphabetical) starting with what has been typed. Insert the products <strong>in sorted order</strong> and let every node keep the first three words that pass through it: because insertion is sorted, those three are already the best three. Each typed letter is then one step down plus reading a ready list; once you fall off the trie, every remaining answer is empty. The no-trie alternative worth mentioning: sort the products and, for each prefix, binary-search the first word ≥ prefix and read up to three words that still start with it.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Search Suggestions System: autocomplete, bản phỏng vấn</h3>
<p>Cho danh sách tên sản phẩm và một từ tìm kiếm, sau mỗi chữ được gõ trả về tối đa ba sản phẩm (theo chữ cái) bắt đầu bằng phần đã gõ. Chèn các sản phẩm <strong>theo thứ tự đã sắp xếp</strong> và để mỗi nút giữ ba từ đầu tiên đi qua nó: vì chèn theo thứ tự, ba từ đó đã là ba từ tốt nhất. Khi đó mỗi chữ được gõ chỉ là xuống một bậc rồi đọc một danh sách có sẵn; khi đã rơi khỏi trie thì mọi đáp án còn lại đều rỗng. Phương án không dùng trie đáng nhắc tới: sắp xếp sản phẩm và với mỗi tiền tố, tìm nhị phân từ đầu tiên ≥ tiền tố rồi đọc tối đa ba từ còn bắt đầu bằng nó.</p>
</div>
${maHai('ch05/goi-y.ts', 'ch05/GoiY.java', { vung: 'goi-y' })}
${ketQua('ch05/goi-y.ts')}
${ketQua('ch05/GoiY.java')}

<div class="ml-en">
<h3>Measured: scanning vs a trie vs a sorted array</h3>
<p>Count the words that start with a prefix, for 2,000 random prefixes, over 10⁴ / 10⁵ / 10⁶ generated words (letters a–f, so many prefixes are shared). Three methods: scan every word with <code>startsWith</code>; a trie whose nodes store how many words pass through them; and binary search on a sorted array (two lower bounds: the first word ≥ prefix and the first word ≥ prefix + "{", the character right after "z").</p>
</div>
<div class="ml-vi">
<h3>Đo thật: quét mảng, trie, và mảng đã sắp xếp</h3>
<p>Đếm số từ bắt đầu bằng một tiền tố, cho 2.000 tiền tố ngẫu nhiên, trên 10⁴ / 10⁵ / 10⁶ từ sinh ra (chữ a–f, nên nhiều tiền tố được dùng chung). Ba cách: quét mọi từ bằng <code>startsWith</code>; một trie mà mỗi nút lưu số từ đi qua nó; và tìm nhị phân trên mảng đã sắp xếp (hai lần lower bound: từ đầu tiên ≥ tiền tố và từ đầu tiên ≥ tiền tố + "{", ký tự đứng ngay sau "z").</p>
</div>
${ma('ch05/trie-do.ts', { vung: 'dem', nhan: 'TypeScript — a trie with counts' })}
${ketQua('ch05/trie-do.ts')}
${ketQua('ch05/TrieDo.java')}
<div class="ml-en">
<p>Three readings. <strong>Scanning grows with n</strong>: 10× the words, about 10× the time (111 ms → 1.28 s in Node for 2,000 queries), so a million words was not run. <strong>The trie does not care about n</strong>: a fraction of a millisecond for all 2,000 queries at every size (the first row is even the slowest, because the JIT is still warming up). <strong>The sorted array is almost as good</strong>: O(L log n) per query, under a couple of milliseconds — and it needs no extra nodes, while the trie built about one node per word here (996,671 nodes for a million words) and would build many more with a real alphabet. In an interview in JavaScript, "sort once, then two binary searches" is a perfectly good answer for pure prefix <em>counting</em>; the trie wins when you also need to walk the prefixes (suggestions, wildcards, Word Search II) or to insert while querying.</p>
</div>
<div class="ml-vi">
<p>Ba điều đọc ra. <strong>Quét mảng tăng theo n</strong>: gấp 10 lần số từ, khoảng gấp 10 lần thời gian (111 ms → 1,28 giây trên Node cho 2.000 truy vấn), nên một triệu từ không chạy luôn. <strong>Trie không quan tâm n</strong>: một phần nhỏ của mili giây cho cả 2.000 truy vấn ở mọi cỡ (hàng đầu còn là chậm nhất, vì JIT còn đang khởi động). <strong>Mảng đã sắp xếp gần ngang ngửa</strong>: O(L log n) mỗi truy vấn, chưa tới vài mili giây — và không cần thêm nút nào, trong khi trie ở đây dựng khoảng một nút cho mỗi từ (996.671 nút cho một triệu từ) và với bảng chữ thật sẽ dựng nhiều hơn nữa. Phỏng vấn bằng JavaScript, "sắp xếp một lần, rồi hai lần tìm nhị phân" là câu trả lời hoàn toàn ổn cho việc <em>đếm</em> theo tiền tố thuần tuý; trie thắng khi bạn còn cần đi lại trên các tiền tố (gợi ý, ký tự đại diện, Word Search II) hoặc vừa chèn vừa truy vấn.</p>
${lienKet({ bai: 'dsa-4-1-co-ban', title: '4.1 — Nhị phân không lệch một', sub: 'lower_bound nửa mở dùng ở cột "sorted+bsearch" — cùng một khuôn', cta: 'Ôn bài' })}
</div>

<div class="ml-en">
<h3>The trap that fails real candidates: search() without isEnd</h3>
<div class="pitfall co-tieu-de"><p><strong>Returning "the path exists" from <code>search</code>.</strong></p><p>It passes the first example of most test sets, because the words people test with are complete words. It is <code>startsWith</code> under another name:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy làm trượt ứng viên thật: search() quên isEnd</h3>
<div class="pitfall co-tieu-de"><p><strong>Cho <code>search</code> trả về "đường đi tồn tại".</strong></p><p>Nó qua ví dụ đầu của hầu hết bộ test, vì từ người ta đem thử thường là từ trọn vẹn. Thực chất nó là <code>startsWith</code> mang tên khác:</p></div>
</div>
${ma('ch05/bay-trie.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ketQua('ch05/bay-trie.ts')}
<div class="ml-en">
<p><code>"app"</code> and <code>"appl"</code> are reported as words. The fix is the second half of the condition, <code>node.isEnd</code>. Related Java trap: <code>ch - 'a'</code> assumes lowercase a–z; an uppercase letter, a digit or a space gives a negative or too-large index and an <code>ArrayIndexOutOfBoundsException</code>. Ask about the alphabet first, and use a map (or normalise the input) when it is not tiny and fixed.</p>
</div>
<div class="ml-vi">
<p><code>"app"</code> và <code>"appl"</code> bị báo là từ. Cách sửa là nửa sau của điều kiện, <code>node.isEnd</code>. Bẫy Java liên quan: <code>ch - 'a'</code> giả định chữ thường a–z; một chữ hoa, chữ số hay dấu cách cho ra chỉ số âm hoặc quá lớn và ném <code>ArrayIndexOutOfBoundsException</code>. Hãy hỏi về bảng chữ trước, và dùng map (hoặc chuẩn hoá đầu vào) khi nó không nhỏ và cố định.</p>
</div>

<div class="ml-en">
<h3>Where prefix search lives in real systems — including this site</h3>
<ul>
<li><strong>The EXP Hub search box on this site</strong> (<code>frontend/src/components/exp-hub/SearchAutocomplete.tsx</code>) shows two kinds of suggestions. Categories are matched in the browser: the category tree is flattened in pre-order (lesson 5.1) and filtered with <code>name.toLowerCase().includes(q)</code>, then <code>.slice(0, 6)</code> — a linear scan, which is the right call for a few hundred categories. Snippets come from the server, debounced by 250 ms, and the server ranks them with PostgreSQL full-text search: <code>search_vector @@ websearch_to_tsquery('simple', q)</code> in <code>src/services/snippets.service.ts</code>. Full-text search matches whole words (lexemes); according to the PostgreSQL documentation, prefix matching needs the <code>:*</code> operator of <code>to_tsquery</code>, which <code>websearch_to_tsquery</code> does not offer — so half-typed words are exactly the gap a prefix structure fills.</li>
<li><strong>Routers.</strong> Many HTTP routers (for example find-my-way, used by Fastify) keep routes in a radix tree — a trie whose single-child chains are merged — so matching a URL costs the length of the path, not the number of routes. Express 4, which this backend uses, checks its routes in order instead.</li>
<li><strong>Networks.</strong> A router picks the outgoing link by the <em>longest matching prefix</em> of the destination IP address; the classic data structure for that is a binary trie over the address bits.</li>
<li><strong>Editors and phones.</strong> Spell-checkers, IntelliSense and the old T9 keypad all walk prefix trees of words.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Tìm theo tiền tố sống ở đâu trong hệ thống thật — kể cả trang này</h3>
<ul>
<li><strong>Ô tìm kiếm của EXP Hub trên chính trang này</strong> (<code>frontend/src/components/exp-hub/SearchAutocomplete.tsx</code>) hiện hai loại gợi ý. Danh mục được khớp ngay trong trình duyệt: cây danh mục được làm phẳng theo pre-order (bài 5.1) rồi lọc bằng <code>name.toLowerCase().includes(q)</code>, rồi <code>.slice(0, 6)</code> — quét tuyến tính, và đó là lựa chọn đúng với vài trăm danh mục. Đoạn code (snippet) đến từ máy chủ, có debounce 250 ms, và máy chủ xếp hạng bằng tìm kiếm toàn văn (full-text search) của PostgreSQL: <code>search_vector @@ websearch_to_tsquery('simple', q)</code> trong <code>src/services/snippets.service.ts</code>. Tìm kiếm toàn văn khớp theo nguyên từ (lexeme); theo tài liệu PostgreSQL, khớp tiền tố cần toán tử <code>:*</code> của <code>to_tsquery</code>, mà <code>websearch_to_tsquery</code> không có — nên các từ đang gõ dở chính là khoảng trống mà một cấu trúc tiền tố lấp vào.</li>
<li><strong>Bộ định tuyến HTTP.</strong> Nhiều router (ví dụ find-my-way mà Fastify dùng) giữ các tuyến trong một radix tree — trie đã gộp các chuỗi nút một con — nên khớp một URL tốn theo độ dài đường dẫn, không theo số tuyến. Express 4, thứ backend này dùng, thì kiểm lần lượt từng tuyến.</li>
<li><strong>Mạng máy tính.</strong> Router chọn đường ra theo <em>tiền tố khớp dài nhất</em> (longest prefix match) của địa chỉ IP đích; cấu trúc kinh điển cho việc đó là một trie nhị phân trên các bit địa chỉ.</li>
<li><strong>Trình soạn thảo và điện thoại.</strong> Bộ kiểm chính tả, IntelliSense và bàn phím T9 ngày xưa đều đi trên cây tiền tố của các từ.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: the search box is an API too</h3>
<ul>
<li><strong>Memory exhaustion.</strong> If a trie is built from strings that clients send (search history, tags, a "remember my queries" feature), each new letter can create a node. One 1 MB random string is up to a million nodes. Cap the length and the number of stored strings, exactly as you cap request bodies.</li>
<li><strong>Enumeration.</strong> An autocomplete endpoint answers "does anything start with <code>a</code>?", then <code>ab</code>, <code>abc</code>… With a few hundred requests a script can list every username or e-mail the endpoint is willing to complete. Only suggest what the caller is allowed to see, require authentication for anything private, and rate-limit per user — the 250 ms debounce in the browser reduces <em>honest</em> load but does nothing against a script that calls the API directly.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: ô gợi ý cũng là một API</h3>
<ul>
<li><strong>Làm cạn bộ nhớ.</strong> Nếu trie được dựng từ chuỗi do client gửi (lịch sử tìm kiếm, thẻ, tính năng "nhớ truy vấn của tôi"), mỗi chữ mới có thể tạo một nút. Một chuỗi ngẫu nhiên 1 MB là tới một triệu nút. Hãy đặt trần độ dài và số chuỗi được lưu, đúng như bạn đặt trần cỡ thân request.</li>
<li><strong>Dò liệt kê (enumeration).</strong> Một endpoint autocomplete trả lời "có gì bắt đầu bằng <code>a</code> không?", rồi <code>ab</code>, <code>abc</code>… Với vài trăm request, một đoạn script liệt kê được mọi tên người dùng hay email mà endpoint chịu gợi ý. Chỉ gợi ý những gì người gọi được phép thấy, bắt đăng nhập với mọi thứ riêng tư, và giới hạn tần suất theo từng người — debounce 250 ms trên trình duyệt giảm tải từ người dùng <em>tử tế</em>, nhưng chẳng làm gì được một script gọi thẳng API.</li>
</ul>
${lienKet({ bai: 'dsa-2-2-cua-so', title: '2.2 — Cửa sổ trượt', sub: 'Rate limiter cửa sổ trượt — cách chặn script gõ phím thay người', cta: 'Xem bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Implement a trie with insert, search and startsWith.'],
  ['C', 'Lowercase English letters only? And can the same word be inserted twice?'],
  ['N', 'The alphabet decides array-of-26 vs map; duplicates decide whether you need a count or just a flag.'],
  ['I', 'Lowercase only. Duplicates are allowed but change nothing.'],
  ['C', 'Each node stands for a prefix and has up to 26 children plus an isEnd flag. Insert walks the word creating missing nodes and sets isEnd on the last one. Search and startsWith walk the same path; search additionally requires isEnd. All three are O(L) in the word length, memory O(total letters).'],
  ['N', 'The structure in one sentence, the one difference between the two queries, the costs.'],
  ['C', '(coding) I share one private walk() helper so search and startsWith cannot drift apart — search is walk plus the isEnd check.'],
  ['C', 'Testing: insert apple; search apple true, search app false, startsWith app true; insert app, search app true. A word that falls off early — search cow — returns false after one step.'],
  ['I', 'Now I want the top three suggestions for a prefix, in alphabetical order.'],
  ['C', 'Walk to the prefix node, then a pre-order DFS with children in alphabetical order, collecting isEnd nodes and stopping at three. If this is called on every keystroke, I would store the best three at each node during insertion instead, so a query is just the walk.'],
  ['I', 'What would worry you about putting this behind a public endpoint?'],
  ['C', 'Memory if users can insert arbitrary strings, so I would cap length and count; and enumeration — a script can type a, ab, abc to list private data — so suggestions must be filtered by permission and rate-limited per user.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cài đặt một trie có insert, search và startsWith.'],
  ['C', 'Chỉ chữ thường tiếng Anh thôi ạ? Và một từ có thể bị chèn hai lần không? <em>("Lowercase English letters only? Can a word be inserted twice?")</em>'],
  ['N', 'Bảng chữ quyết định mảng 26 ô hay map; trùng lặp quyết định cần bộ đếm hay chỉ một cờ.'],
  ['I', 'Chỉ chữ thường. Được chèn trùng nhưng không đổi gì.'],
  ['C', 'Mỗi nút đại diện một tiền tố, có tối đa 26 con và một cờ isEnd. Insert đi qua từ, tạo các nút còn thiếu và bật isEnd ở nút cuối. Search và startsWith đi cùng đường đó; search đòi thêm isEnd. Cả ba đều O(L) theo độ dài từ, bộ nhớ O(tổng số chữ cái). <em>("Search additionally requires isEnd.")</em>'],
  ['N', 'Cấu trúc trong một câu, điểm khác duy nhất giữa hai truy vấn, cái giá.'],
  ['C', '(đang code) Em dùng chung một hàm riêng walk() để search và startsWith không lệch nhau — search là walk cộng phép kiểm isEnd.'],
  ['C', 'Test: chèn apple; search apple true, search app false, startsWith app true; chèn app, search app true. Một từ rơi khỏi cây sớm — search cow — trả false sau một bước.'],
  ['I', 'Giờ tôi muốn ba gợi ý đầu cho một tiền tố, theo thứ tự chữ cái.'],
  ['C', 'Đi tới nút tiền tố, rồi DFS pre-order với các con theo chữ cái, gom các nút isEnd và dừng ở ba. Nếu hàm này được gọi ở mỗi lần gõ phím, em sẽ lưu sẵn ba từ tốt nhất ở mỗi nút lúc chèn, để truy vấn chỉ còn là đi xuống. <em>("I would store the best three at each node during insertion.")</em>'],
  ['I', 'Đặt cái này sau một endpoint công khai thì em lo gì?'],
  ['C', 'Bộ nhớ nếu người dùng chèn được chuỗi tuỳ ý, nên em đặt trần độ dài và số lượng; và dò liệt kê — script gõ a, ab, abc để lôi dữ liệu riêng tư ra — nên gợi ý phải lọc theo quyền và giới hạn tần suất theo từng người.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li><code>search</code> without the <code>isEnd</code> check (it becomes <code>startsWith</code>).</li>
<li>Marking <code>isEnd</code> on every node of the path during insert instead of only the last one.</li>
<li><code>ch - 'a'</code> on input that is not lowercase a–z.</li>
<li>Collecting <em>all</em> words under a prefix and then taking k, instead of stopping the DFS at k.</li>
<li>In TypeScript, expecting a <code>Map</code> to iterate alphabetically — it iterates in insertion order.</li>
<li>Reaching for a trie when a sorted array + binary search answers the only query asked, with far less memory.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li><code>search</code> thiếu phép kiểm <code>isEnd</code> (thành <code>startsWith</code>).</li>
<li>Bật <code>isEnd</code> ở mọi nút trên đường đi lúc chèn thay vì chỉ nút cuối.</li>
<li>Dùng <code>ch - 'a'</code> trên đầu vào không phải chữ thường a–z.</li>
<li>Gom <em>mọi</em> từ dưới một tiền tố rồi mới lấy k, thay vì dừng DFS ở k.</li>
<li>Trong TypeScript, tưởng <code>Map</code> duyệt theo chữ cái — nó duyệt theo thứ tự chèn.</li>
<li>Vớ ngay trie khi mảng sắp xếp + tìm nhị phân đã trả lời được truy vấn duy nhất của đề, tốn ít bộ nhớ hơn hẳn.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write LC 208 from memory with a shared <code>walk()</code> helper, in the language you will interview in. Run LeetCode’s example.</li>
<li>Add <code>suggest(prefix, k)</code>. Insert <code>car, card, care, careful, cart, cat</code> and check that <code>suggest("car", 3)</code> stops before visiting <code>careful</code> (add a counter).</li>
<li>Submit LC 208, LC 211 and LC 1268. For LC 1268 also write the sort + binary search version and compare the two in one notebook line.</li>
<li>Write one paragraph: what you would cap, filter and rate-limit before exposing a suggestion endpoint.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the counter proves the early stop, and the paragraph names a length cap, permission filtering and a per-user rate limit.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">trie / prefix tree</span><span class="v">A tree whose nodes are prefixes and whose edges are characters.</span></div>
  <div class="kv"><span class="k">isEnd (end-of-word flag)</span><span class="v">Marks that a whole inserted word ends at this node.</span></div>
  <div class="kv"><span class="k">autocomplete / type-ahead</span><span class="v">Suggesting completions of a prefix while the user types.</span></div>
  <div class="kv"><span class="k">wildcard</span><span class="v">A pattern character (<code>.</code>) that matches any one character.</span></div>
  <div class="kv"><span class="k">radix tree</span><span class="v">A compressed trie: chains of single-child nodes merged into one edge.</span></div>
  <div class="kv"><span class="k">longest prefix match</span><span class="v">Choosing the stored prefix that matches the most leading characters (IP routing).</span></div>
  <div class="kv"><span class="k">enumeration attack</span><span class="v">Listing hidden data by asking many small yes/no questions.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A trie stores prefixes; words with a common prefix share a path.</li>
<li>insert / search / startsWith are O(L); search = path exists <em>and</em> <code>isEnd</code>.</li>
<li>Autocomplete = walk to the prefix, pre-order DFS in alphabetical order, stop at k (or precompute the top k per node).</li>
<li>A wildcard makes the walk branch; the cost is the size of the explored subtree.</li>
<li>Measured: scanning grows with n, the trie does not; a sorted array + binary search is close behind with far less memory.</li>
<li>A suggestion endpoint needs length caps, permission filtering and server-side rate limits.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Tries', 'Implement Trie, Add and Search Words, Word Search II in order', 'https://neetcode.io/roadmap')}
${nguon('🐘', 'PostgreSQL — Controlling Text Search', 'to_tsquery prefix matching with :* and what websearch_to_tsquery accepts', 'https://www.postgresql.org/docs/current/textsearch-controls.html')}
${nguon('📖', 'Wikipedia — Trie', 'History, radix trees, memory trade-offs and applications', 'https://en.wikipedia.org/wiki/Trie')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết LC 208 theo trí nhớ với một hàm phụ <code>walk()</code> dùng chung, bằng ngôn ngữ bạn sẽ phỏng vấn. Chạy ví dụ của LeetCode.</li>
<li>Thêm <code>suggest(prefix, k)</code>. Chèn <code>car, card, care, careful, cart, cat</code> và kiểm rằng <code>suggest("car", 3)</code> dừng trước khi ghé <code>careful</code> (thêm một bộ đếm).</li>
<li>Nộp LC 208, LC 211 và LC 1268. Với LC 1268 viết thêm bản sắp xếp + tìm nhị phân và so hai bản trong một dòng sổ tay.</li>
<li>Viết một đoạn: bạn sẽ đặt trần gì, lọc gì và giới hạn tần suất gì trước khi mở một endpoint gợi ý.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, bộ đếm chứng minh được việc dừng sớm, và đoạn viết gọi tên trần độ dài, lọc theo quyền và giới hạn tần suất theo từng người.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">trie / prefix tree (cây tiền tố)</span><span class="v">Cây có nút là các tiền tố và cạnh là các ký tự.</span></div>
  <div class="kv"><span class="k">isEnd (cờ cuối từ)</span><span class="v">Đánh dấu có một từ trọn vẹn đã chèn kết thúc ở nút này.</span></div>
  <div class="kv"><span class="k">autocomplete / type-ahead (gợi ý khi gõ)</span><span class="v">Gợi ý cách hoàn thành một tiền tố trong lúc người dùng đang gõ.</span></div>
  <div class="kv"><span class="k">wildcard (ký tự đại diện)</span><span class="v">Ký tự mẫu (<code>.</code>) khớp một ký tự bất kỳ.</span></div>
  <div class="kv"><span class="k">radix tree (cây cơ số)</span><span class="v">Trie nén: các chuỗi nút chỉ có một con được gộp thành một cạnh.</span></div>
  <div class="kv"><span class="k">longest prefix match (khớp tiền tố dài nhất)</span><span class="v">Chọn tiền tố đã lưu khớp được nhiều ký tự đầu nhất (định tuyến IP).</span></div>
  <div class="kv"><span class="k">enumeration attack (tấn công dò liệt kê)</span><span class="v">Lôi dữ liệu ẩn ra bằng cách hỏi thật nhiều câu có/không nhỏ.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trie lưu các tiền tố; các từ chung tiền tố đi chung đường.</li>
<li>insert / search / startsWith là O(L); search = đường đi tồn tại <em>và</em> <code>isEnd</code>.</li>
<li>Autocomplete = đi tới tiền tố, DFS pre-order theo chữ cái, dừng ở k (hoặc tính sẵn k từ tốt nhất ở mỗi nút).</li>
<li>Ký tự đại diện làm đường đi rẽ nhánh; cái giá là cỡ phần cây con phải dò.</li>
<li>Đo thật: quét mảng tăng theo n, trie thì không; mảng sắp xếp + tìm nhị phân theo sát mà tốn ít bộ nhớ hơn hẳn.</li>
<li>Endpoint gợi ý cần trần độ dài, lọc theo quyền và giới hạn tần suất ở máy chủ.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Tries', 'Implement Trie, Add and Search Words, Word Search II theo thứ tự (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🐘', 'PostgreSQL — Controlling Text Search', 'Khớp tiền tố bằng :* trong to_tsquery và websearch_to_tsquery nhận những gì', 'https://www.postgresql.org/docs/current/textsearch-controls.html')}
${nguon('📖', 'Wikipedia — Trie', 'Lịch sử, radix tree, đánh đổi bộ nhớ và ứng dụng (tiếng Anh)', 'https://en.wikipedia.org/wiki/Trie')}
</div>
`,
};
