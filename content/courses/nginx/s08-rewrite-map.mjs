import G08_1 from './giang/ngx-08-1.mjs';
import G08_2 from './giang/ngx-08-2.mjs';
import G08_3 from './giang/ngx-08-3.mjs';
import G08_4 from './giang/ngx-08-4.mjs';
import G08_5 from './giang/ngx-08-5.mjs';
const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 8 — Rewriting, mapping, and the directive to avoid|||Chương 8 — Viết lại, ánh xạ, và cái chỉ thị nên tránh',
  description: 'Đổi một URL trước khi nó tới nơi là việc rất hay phải làm, và Nginx cho bạn bốn cách với ngữ nghĩa khác hẳn nhau. Chương này đo cả bốn — kể cả một cách âm thầm bỏ qua dòng ngay dưới nó, và một chỉ thị mà chỉ cần thêm một tham số query là biến 200 thành 404.',
  lessons: [

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — rewrite and its four flags, measured|||8.1 — rewrite và bốn cái cờ của nó, đo thật',
      slug: 'nginx-8-1-rewrite',
      type: 'LESSON',
      description: 'Cùng một phép viết lại, bốn cái cờ, bốn kết quả khác hẳn: một cái chạy lại phép khớp location, một cái ở lại và ÂM THẦM bỏ qua dòng ngay dưới nó, hai cái nữa đẩy một cú chuyển hướng thật ra trình duyệt với hai mã trạng thái khác nhau.',
      content: `
${G08_1}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>rewrite and its four flags, measured</h2>
<p class="lead">A <code>rewrite</code> is a regular expression, a replacement, and a flag. The flag is the part that matters, and one of the four does something the config does not look like it does.</p>

<h3>Four flags, one probe each</h3>
<div class="out">location /dich { return 200 "DICH: uri=[$uri] request_uri=[$request_uri]"; }

/f-last/abc       -> 200  DICH: uri=[/dich] request_uri=[/f-last/abc]
                          ^ da CHAY LAI khop location, $uri doi, $request_uri KHONG

/f-redirect/abc   -> 302  Location: http://127.0.0.1:8800/dich?tu=redirect
/f-permanent/abc  -> 301  Location: http://127.0.0.1:8800/dich?tu=permanent
                          ^ hai cai nay di RA trinh duyet, no phai goi lai

/f-khong/abc      -> 200  sau HAI rewrite: uri=[/buoc-2-abc]
                          ^ khong co co => cac rewrite SAU do van chay tiep</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">last</span><span class="lz-t">Restart location matching with the new URI</span><span class="lz-d">The internal redirect from Lesson 2.5, triggered deliberately. <code>\$uri</code> becomes the rewritten path and the whole five-step algorithm runs again, so a different block handles it. <code>\$request_uri</code> keeps what the client sent, which is why logs stay honest.</span></div>
  <div class="lz-step"><span class="lz-k">break</span><span class="lz-t">Stop rewriting and stay in this block</span><span class="lz-d">No re-matching. The new <code>\$uri</code> is used for content handling right here — which is what you want before a <code>proxy_pass</code> or a <code>root</code>. It also does something else, measured below.</span></div>
  <div class="lz-step"><span class="lz-k">redirect / permanent</span><span class="lz-t">Send the client somewhere else</span><span class="lz-d"><code>302</code> and <code>301</code> respectively. These are visible to the browser and cost a round trip, so they are for URLs that genuinely moved — not for internal plumbing.</span></div>
  <div class="lz-step"><span class="lz-k">(none)</span><span class="lz-t">Rewrite and keep going</span><span class="lz-d">Subsequent <code>rewrite</code> directives in the same block still run against the new value — the measurement shows two chained rewrites producing <code>/buoc-2-abc</code>. Useful for building up a path in steps; confusing if you forgot the second one was there.</span></div>
</div>

<h3>The thing break does that the config does not show</h3>
<div class="out">location /f-break/  { root ...; rewrite ^/f-break/(.*)$  /dich break;
                      return 200 "RETURN NAY CO CHAY KHONG?"; }
location /f-break2/ { root ...; rewrite ^/f-break2/(.*)$ /dich break; }

  /f-break/abc   ->  TEP DICH
  /f-break2/abc  ->  TEP DICH
                     ^ Y HET NHAU. Cai return kia KHONG BAO GIO chay.</div>
<div class="pitfall">
<p><strong>Trap — <code>break</code> stops the whole rewrite module, and <code>return</code> belongs to the rewrite module.</strong> The two blocks above are indistinguishable in their output, which proves the <code>return 200</code> after the <code>break</code> never executed. The same applies to any <code>rewrite</code>, <code>set</code> or <code>if</code> written below it. This is not documented as "return is skipped" — it is documented as "stops processing the current set of ngx_http_rewrite_module directives", and you have to know that <code>return</code> is one of those. The practical rule: after a <code>break</code>, nothing else in that block from the rewrite family runs, so put the <code>break</code> last or do not use it at all. A block that does <code>rewrite ... break;</code> followed by <code>proxy_pass</code> is correct, because <code>proxy_pass</code> is not a rewrite-module directive.</p>
</div>

<h3>The two rules that make rewrites predictable</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rewrite runs before location matching finishes</span><span class="v">Rewrites at <code>server</code> level run first, against the original URI, before any <code>location</code> is chosen. Rewrites inside a <code>location</code> run after that block was selected. Putting one at <code>server</code> level to "catch everything" changes which block gets chosen, which is usually not what was intended.</span></div>
  <div class="kv"><span class="k">The replacement decides whether it is a redirect</span><span class="v">If the replacement starts with <code>http://</code>, <code>https://</code> or <code>$scheme</code>, Nginx sends a <code>302</code> whether or not you wrote a flag. That is why a rewrite you meant to be internal sometimes shows up in the browser — the destination made the decision for you.</span></div>
  <div class="kv"><span class="k">The query string is appended unless you stop it</span><span class="v">A replacement with no <code>?</code> keeps the original arguments. A replacement ending in <code>?</code> discards them. <code>rewrite ^/cu$ /moi? permanent;</code> is how you drop a query string on purpose, and forgetting the <code>?</code> is how tracking parameters survive a migration.</span></div>
  <div class="kv"><span class="k">There is a cycle limit, same as Lesson 2.5</span><span class="v">Ten internal redirects and the request dies with <code>500</code> and <code>rewrite or internal redirection cycle</code> in the error log. A <code>last</code> that rewrites into a block that rewrites back is the usual way to produce it.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># RIGHT: rewrite the path then forward — break comes BEFORE proxy_pass</span>
location /cu/ {
  rewrite ^/cu/(.*)\$ /moi/\$1 break;
  proxy_pass http://api;            <span class="tok-comment"># not a rewrite directive -> still runs</span>
}

<span class="tok-comment"># RIGHT: if the URL genuinely moved, tell the browser</span>
rewrite ^/bai-viet/(\\d+)\$ /tin/\$1 permanent;

<span class="tok-comment"># WRONG: return sits after break — it does NOT run</span>
<span class="tok-comment"># location /x/ { rewrite ^ /y break; return 200 "..."; }</span>

<span class="tok-comment"># And usually NO rewrite is needed at all:</span>
location = /cu-cu-cu { return 301 /moi; }   <span class="tok-comment"># cheaper, clearer</span></code></pre>

<h3>When not to use rewrite at all</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A fixed path that moved → return 301</span><span class="lz-lnote"><code>location = /gia { return 301 /bang-gia; }</code>. No regex, no capture, no ambiguity, and it short-circuits at step 1 of location matching. Every fixed redirect should look like this.</span></div>
  <div class="lz-layer"><span class="lz-lname">A prefix that moved → return with $request_uri</span><span class="lz-lnote"><code>location /cu/ { return 301 /moi\$request_uri; }</code> — careful, that keeps the <code>/cu/</code> prefix. Use a rewrite when you need to strip or reshape the path; use <code>return</code> when the whole thing moves under a new root.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choosing a value → map, not rewrite (Lesson 8.3)</span><span class="lz-lnote">If what you want is "set a variable based on the request", <code>map</code> does it once, lazily, at <code>http</code> level. A chain of rewrites setting variables is slower and much harder to read.</span></div>
  <div class="lz-layer"><span class="lz-lname">A proxy path change → proxy_pass with a path</span><span class="lz-lnote">Lesson 3.1: <code>proxy_pass http://api/;</code> already substitutes the matched prefix. A <code>rewrite</code> plus a path-carrying <code>proxy_pass</code> is two mechanisms doing the same job and produces a path that is neither of the two you wrote.</span></div>
</div>
<div class="note-ct">
<p><strong>How to debug a rewrite.</strong> Add <code>return 200 "\$uri | \$request_uri | \$args";</code> temporarily in the block you think handles the request, and send one request. You will see immediately whether the rewrite fired, what it produced, and whether you are even in the block you thought. Reading a chain of regular expressions is much slower and, as the <code>break</code> measurement shows, can be confidently wrong.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>One target block that prints <code>$uri</code>, <code>$request_uri</code> and <code>$args</code>, one block per flag, then three rules — a scheme in the replacement, the trailing <code>?</code>, and a rewrite cycle — on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {
    listen 8080;
    root /srv/site;
    location /dich        { return 200 "DICH: uri=[$uri] request_uri=[$request_uri] args=[$args]\\n"; }
    location /f-last/     { rewrite ^/f-last/(.*)$      /dich last; }
    location /f-redirect/ { rewrite ^/f-redirect/(.*)$  /dich?tu=redirect redirect; }
    location /f-permanent/{ rewrite ^/f-permanent/(.*)$ /dich?tu=permanent permanent; }
    location /f-khong/    { rewrite ^/f-khong/(.*)$ /buoc-1-$1;          <span class="tok-comment">  # không cờ: đi tiếp</span>
                            rewrite ^/buoc-1-(.*)$  /buoc-2-$1;
                            return 200 "sau HAI rewrite: uri=[$uri]\\n"; }
    location /f-break/    { rewrite ^/f-break/(.*)$  /dich break;        <span class="tok-comment">  # break rồi return: return có chạy không?</span>
                            return 200 "RETURN NAY CO CHAY KHONG?\\n"; }
    location /f-break2/   { rewrite ^/f-break2/(.*)$ /dich break; }     <span class="tok-comment">  # break, không có return</span>
    location /f-scheme/   { rewrite ^/f-scheme/(.*)$ http://vidu.com/$1; } # KHÔNG cờ nhưng đích có scheme
    location /f-q1/       { rewrite ^/f-q1/(.*)$ /dich  last; }          <span class="tok-comment">  # query string được NỐI vào</span>
    location /f-q2/       { rewrite ^/f-q2/(.*)$ /dich? last; }          <span class="tok-comment">  # dấu ? ở cuối: VỨT query string</span>
    location /vong-a      { rewrite ^ /vong-b last; }                    <span class="tok-comment">  # hai khối viết lại qua lại</span>
    location /vong-b      { rewrite ^ /vong-a last; }
  }
}</code></pre>
<div class="out">$ curl -s http://127.0.0.1:8080/f-last/abc
DICH: uri=[/dich] request_uri=[/f-last/abc] args=[]
$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-redirect/abc
302  Location: http://127.0.0.1:8080/dich?tu=redirect
$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-permanent/abc
301  Location: http://127.0.0.1:8080/dich?tu=permanent
$ curl -s http://127.0.0.1:8080/f-khong/abc
sau HAI rewrite: uri=[/buoc-2-abc]
$ curl -s http://127.0.0.1:8080/f-break/abc
TEP DICH (tep tinh /dich trong root)
$ curl -s http://127.0.0.1:8080/f-break2/abc
TEP DICH (tep tinh /dich trong root)
$ curl -s -o /dev/null -w 'KHONG co, dich co scheme -&gt; %{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-scheme/abc
KHONG co, dich co scheme -&gt; 302  Location: http://vidu.com/abc
$ curl -s 'http://127.0.0.1:8080/f-q1/abc?utm=x&amp;id=7'
DICH: uri=[/dich] request_uri=[/f-q1/abc?utm=x&amp;id=7] args=[utm=x&amp;id=7]
$ curl -s 'http://127.0.0.1:8080/f-q2/abc?utm=x&amp;id=7'
DICH: uri=[/dich] request_uri=[/f-q2/abc?utm=x&amp;id=7] args=[]
$ curl -s -o /dev/null -w 'vong-a &lt;-&gt; vong-b -&gt; %{http_code}\\n' http://127.0.0.1:8080/vong-a; grep -m1 -o 'rewrite or internal redirection cycle[^,]*' /srv/logs/error.log
vong-a &lt;-&gt; vong-b -&gt; 500
rewrite or internal redirection cycle while processing "/vong-b"</div>
<p>last ended in <code>/dich</code> with the original <code>$request_uri</code>; redirect and permanent sent 302 and 301; no flag chained into <code>/buoc-2-abc</code>. <code>break</code> + <code>return</code> served the FILE, exactly like <code>break</code> alone. With no flag but an <code>http://</code> target nginx still sent 302; the query string was appended (<code>args=[utm=x&amp;id=7]</code>) until a trailing <code>?</code> dropped it; two blocks rewriting into each other died with 500 and "rewrite or internal redirection cycle".</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-3-3-grep-regex" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 3.3 — grep, and just enough regular expression</span><span class="lc-sub">The regex half of every rewrite</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-11-2-chuyen-huong" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 11.3 — Interview: a URL shortener (2) — 301 or 302</span><span class="lc-sub">Choosing between 301 and 302 in a real design</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rewrite</code></span><span class="v">A regex, a replacement, and a flag; the flag decides what happens to the request.</span></div>
  <div class="kv"><span class="k"><code>last</code></span><span class="v">Restart location matching with the rewritten URI — <code>\$uri</code> changes, <code>\$request_uri</code> does not.</span></div>
  <div class="kv"><span class="k"><code>break</code></span><span class="v">Stop the rewrite module and handle content in this block; any <code>rewrite</code>/<code>set</code>/<code>if</code>/<code>return</code> below it is skipped.</span></div>
  <div class="kv"><span class="k"><code>redirect</code> / <code>permanent</code></span><span class="v">Send the client a <code>302</code> / <code>301</code> — visible in the browser and costs a round trip.</span></div>
  <div class="kv"><span class="k">(no flag)</span><span class="v">Rewrite and keep going, so later <code>rewrite</code> directives in the block run against the new value.</span></div>
  <div class="kv"><span class="k">rewrite cycle</span><span class="v">Ten internal redirects ends the request with <code>500</code> and "rewrite or internal redirection cycle".</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A <code>rewrite</code> is regex + replacement + flag, and the flag is the part that changes the behaviour.</li><li><code>last</code> re-runs location matching; <code>break</code> stays put and silently skips any rewrite-family directive below it, <code>return</code> included.</li><li><code>redirect</code>/<code>permanent</code> go out to the browser; a replacement starting with a scheme forces a <code>302</code> even with no flag.</li><li>A trailing <code>?</code> drops the query string; otherwise the original arguments are appended.</li><li>For a fixed path that moved, prefer <code>return 301</code> over <code>rewrite</code> — cheaper and clearer.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">nginx — the rewrite module</span><span class="lc-sub">nginx.org · All four flags, and the list of directives break stops</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — location and internal redirects</span><span class="lc-sub">nginx.org · What last actually triggers, in the same terms as Lesson 2.5</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">MDN — 301 versus 302</span><span class="lc-sub">developer.mozilla.org · Which one search engines and browsers cache</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Redirect chains, and what each extra hop costs a page load</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Put a return after a break and prove to yourself that it never runs</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>rewrite và bốn cái cờ của nó, đo thật</h2>
<p class="lead">Một lệnh <code>rewrite</code> gồm một biểu thức chính quy, một chuỗi thay thế, và một cái CỜ. Cái cờ mới là phần có nghĩa lý, và một trong bốn cái làm một việc mà cấu hình trông chẳng giống như đang làm.</p>

<h3>Bốn cái cờ, mỗi cái một phép dò</h3>
<div class="out">location /dich { return 200 "DICH: uri=[$uri] request_uri=[$request_uri]"; }

/f-last/abc       -> 200  DICH: uri=[/dich] request_uri=[/f-last/abc]
                          ^ da CHAY LAI khop location, $uri doi, $request_uri KHONG

/f-redirect/abc   -> 302  Location: http://127.0.0.1:8800/dich?tu=redirect
/f-permanent/abc  -> 301  Location: http://127.0.0.1:8800/dich?tu=permanent
                          ^ hai cai nay di RA trinh duyet, no phai goi lai

/f-khong/abc      -> 200  sau HAI rewrite: uri=[/buoc-2-abc]
                          ^ khong co co => cac rewrite SAU do van chay tiep</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">last</span><span class="lz-t">CHẠY LẠI phép khớp location với URI mới</span><span class="lz-d">Chính là cú chuyển hướng nội bộ ở Bài 2.5, nhưng lần này do bạn CỐ Ý kích hoạt. <code>\$uri</code> thành đường dẫn đã viết lại và cả thuật toán năm bước chạy lại, nên một khối KHÁC xử lý nó. <code>\$request_uri</code> giữ nguyên thứ client gửi, và đó là lý do log vẫn thật thà.</span></div>
  <div class="lz-step"><span class="lz-k">break</span><span class="lz-t">DỪNG việc viết lại và Ở LẠI khối này</span><span class="lz-d">Không khớp lại gì cả. Cái <code>\$uri</code> mới được dùng cho phần xử lý nội dung NGAY TẠI ĐÂY — đúng thứ bạn muốn khi đứng trước một <code>proxy_pass</code> hay một <code>root</code>. Nó còn làm một việc NỮA, đo ở dưới.</span></div>
  <div class="lz-step"><span class="lz-k">redirect / permanent</span><span class="lz-t">ĐẨY client đi chỗ khác</span><span class="lz-d">Lần lượt là <code>302</code> và <code>301</code>. Hai cái này HIỆN ra với trình duyệt và tốn một vòng đi về, nên chúng dành cho những URL THẬT SỰ đã dời — không dành cho đường ống nội bộ.</span></div>
  <div class="lz-step"><span class="lz-k">(không cờ)</span><span class="lz-t">Viết lại rồi ĐI TIẾP</span><span class="lz-d">Các chỉ thị <code>rewrite</code> ĐỨNG SAU trong cùng khối vẫn chạy trên giá trị mới — phép đo cho thấy hai lệnh rewrite nối nhau ra <code>/buoc-2-abc</code>. Hữu ích để dựng dần một đường dẫn theo từng bước; rối rắm nếu bạn quên mất là còn cái thứ hai ở đó.</span></div>
</div>

<h3>Cái việc mà break làm còn cấu hình thì không cho thấy</h3>
<div class="out">location /f-break/  { root ...; rewrite ^/f-break/(.*)$  /dich break;
                      return 200 "RETURN NAY CO CHAY KHONG?"; }
location /f-break2/ { root ...; rewrite ^/f-break2/(.*)$ /dich break; }

  /f-break/abc   ->  TEP DICH
  /f-break2/abc  ->  TEP DICH
                     ^ Y HET NHAU. Cai return kia KHONG BAO GIO chay.</div>
<div class="pitfall">
<p><strong>Bẫy — <code>break</code> DỪNG cả module rewrite, mà <code>return</code> thì THUỘC về module rewrite.</strong> Hai khối ở trên cho ra kết quả không phân biệt được, và điều đó chứng minh cái <code>return 200</code> nằm sau <code>break</code> chưa từng chạy. Điều tương tự áp cho mọi <code>rewrite</code>, <code>set</code> hay <code>if</code> viết bên dưới nó. Chuyện này KHÔNG được ghi là "return bị bỏ qua" — nó được ghi là "dừng xử lý tập các chỉ thị ngx_http_rewrite_module hiện tại", và bạn phải BIẾT rằng <code>return</code> là một trong số đó. Luật thực dụng: sau một cái <code>break</code> thì không còn gì thuộc họ rewrite trong khối ấy chạy nữa, nên hãy đặt <code>break</code> ở CUỐI hoặc đừng dùng nó. Một khối viết <code>rewrite ... break;</code> rồi tới <code>proxy_pass</code> thì ĐÚNG, vì <code>proxy_pass</code> không phải chỉ thị của module rewrite.</p>
</div>

<h3>Hai cái luật làm cho rewrite trở nên đoán trước được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rewrite chạy TRƯỚC khi việc khớp location kết thúc</span><span class="v">Các rewrite ở tầng <code>server</code> chạy TRƯỚC NHẤT, trên URI gốc, trước khi có <code>location</code> nào được chọn. Rewrite nằm TRONG một <code>location</code> thì chạy sau khi khối đó đã được chọn. Đặt một cái ở tầng <code>server</code> để "vớ hết mọi thứ" là làm ĐỔI khối nào sẽ được chọn, và điều đó thường không phải ý bạn.</span></div>
  <div class="kv"><span class="k">Chuỗi THAY THẾ quyết định nó có phải chuyển hướng hay không</span><span class="v">Nếu chuỗi thay thế bắt đầu bằng <code>http://</code>, <code>https://</code> hay <code>$scheme</code> thì Nginx gửi một cú <code>302</code>, dù bạn có viết cờ hay không. Đó là lý do một lệnh rewrite bạn định làm NỘI BỘ đôi khi lại hiện ra trên trình duyệt — cái ĐÍCH đã quyết định thay bạn.</span></div>
  <div class="kv"><span class="k">Query string được NỐI VÀO trừ khi bạn chặn nó</span><span class="v">Một chuỗi thay thế không có dấu <code>?</code> thì giữ nguyên các tham số cũ. Một chuỗi kết thúc bằng <code>?</code> thì VỨT chúng đi. <code>rewrite ^/cu$ /moi? permanent;</code> là cách bỏ query string một cách có chủ ý, và quên cái <code>?</code> là cách các tham số theo dõi sống sót qua một đợt chuyển đổi.</span></div>
  <div class="kv"><span class="k">Có giới hạn số vòng, y như Bài 2.5</span><span class="v">Mười cú chuyển hướng nội bộ là request chết với <code>500</code> và dòng <code>rewrite or internal redirection cycle</code> trong error log. Một cái <code>last</code> viết lại vào một khối rồi khối đó viết lại ngược về là cách thường gặp để tạo ra nó.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># ĐÚNG: sửa đường dẫn rồi chuyển tiếp, break đứng TRƯỚC proxy_pass</span>
location /cu/ {
  rewrite ^/cu/(.*)\$ /moi/\$1 break;
  proxy_pass http://api;            <span class="tok-comment"># không phải chỉ thị rewrite -> vẫn chạy</span>
}

<span class="tok-comment"># ĐÚNG: URL đã dời thật thì báo cho trình duyệt biết</span>
rewrite ^/bai-viet/(\\d+)\$ /tin/\$1 permanent;

<span class="tok-comment"># SAI: return đứng sau break — nó KHÔNG chạy</span>
<span class="tok-comment"># location /x/ { rewrite ^ /y break; return 200 "..."; }</span>

<span class="tok-comment"># Và thường thì KHÔNG cần rewrite gì cả:</span>
location = /cu-cu-cu { return 301 /moi; }   <span class="tok-comment"># rẻ hơn, rõ hơn</span></code></pre>

<h3>Khi nào ĐỪNG dùng rewrite chút nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một đường dẫn CỐ ĐỊNH vừa dời → return 301</span><span class="lz-lnote"><code>location = /gia { return 301 /bang-gia; }</code>. Không regex, không nhóm bắt, không mập mờ, và nó ĐOẢN MẠCH ngay ở bước 1 của phép khớp location. Mọi cú chuyển hướng cố định đều nên trông như thế này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một TIỀN TỐ vừa dời → return kèm $request_uri</span><span class="lz-lnote"><code>location /cu/ { return 301 /moi\$request_uri; }</code> — cẩn thận, cách đó GIỮ luôn cái tiền tố <code>/cu/</code>. Hãy dùng rewrite khi bạn cần CẮT hay NẶN LẠI đường dẫn; dùng <code>return</code> khi cả cụm dời sang một gốc mới.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn một GIÁ TRỊ → dùng map, đừng dùng rewrite (Bài 8.3)</span><span class="lz-lnote">Nếu thứ bạn muốn là "đặt một biến dựa trên request" thì <code>map</code> làm việc đó MỘT lần, một cách lười, ở tầng <code>http</code>. Một chuỗi rewrite đi đặt biến thì vừa chậm hơn vừa khó đọc hơn nhiều.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đổi đường dẫn khi đi proxy → proxy_pass CÓ đường dẫn</span><span class="lz-lnote">Bài 3.1: <code>proxy_pass http://api/;</code> vốn đã THAY tiền tố đã khớp rồi. Một cái <code>rewrite</code> cộng một <code>proxy_pass</code> có mang đường dẫn là HAI cơ chế cùng làm một việc và cho ra một đường dẫn không phải cái nào trong hai cái bạn viết.</span></div>
</div>
<div class="note-ct">
<p><strong>Gỡ lỗi một lệnh rewrite thế nào.</strong> Hãy thêm tạm <code>return 200 "\$uri | \$request_uri | \$args";</code> vào cái khối bạn NGHĨ là đang xử lý request, rồi gửi MỘT request. Bạn sẽ thấy ngay lập tức rằng lệnh rewrite có nổ không, nó tạo ra cái gì, và bạn có đang ở đúng cái khối mình tưởng không. Ngồi đọc một chuỗi biểu thức chính quy thì chậm hơn nhiều và, như phép đo về <code>break</code> cho thấy, có thể SAI một cách rất tự tin.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Một khối đích in <code>$uri</code>, <code>$request_uri</code> và <code>$args</code>, mỗi cờ một khối, rồi ba luật — scheme trong chuỗi thay thế, dấu <code>?</code> ở cuối, và một vòng rewrite — trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {
    listen 8080;
    root /srv/site;
    location /dich        { return 200 "DICH: uri=[$uri] request_uri=[$request_uri] args=[$args]\\n"; }
    location /f-last/     { rewrite ^/f-last/(.*)$      /dich last; }
    location /f-redirect/ { rewrite ^/f-redirect/(.*)$  /dich?tu=redirect redirect; }
    location /f-permanent/{ rewrite ^/f-permanent/(.*)$ /dich?tu=permanent permanent; }
    location /f-khong/    { rewrite ^/f-khong/(.*)$ /buoc-1-$1;          <span class="tok-comment">  # không cờ: đi tiếp</span>
                            rewrite ^/buoc-1-(.*)$  /buoc-2-$1;
                            return 200 "sau HAI rewrite: uri=[$uri]\\n"; }
    location /f-break/    { rewrite ^/f-break/(.*)$  /dich break;        <span class="tok-comment">  # break rồi return: return có chạy không?</span>
                            return 200 "RETURN NAY CO CHAY KHONG?\\n"; }
    location /f-break2/   { rewrite ^/f-break2/(.*)$ /dich break; }     <span class="tok-comment">  # break, không có return</span>
    location /f-scheme/   { rewrite ^/f-scheme/(.*)$ http://vidu.com/$1; } # KHÔNG cờ nhưng đích có scheme
    location /f-q1/       { rewrite ^/f-q1/(.*)$ /dich  last; }          <span class="tok-comment">  # query string được NỐI vào</span>
    location /f-q2/       { rewrite ^/f-q2/(.*)$ /dich? last; }          <span class="tok-comment">  # dấu ? ở cuối: VỨT query string</span>
    location /vong-a      { rewrite ^ /vong-b last; }                    <span class="tok-comment">  # hai khối viết lại qua lại</span>
    location /vong-b      { rewrite ^ /vong-a last; }
  }
}</code></pre>
<div class="out">$ curl -s http://127.0.0.1:8080/f-last/abc
DICH: uri=[/dich] request_uri=[/f-last/abc] args=[]
$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-redirect/abc
302  Location: http://127.0.0.1:8080/dich?tu=redirect
$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-permanent/abc
301  Location: http://127.0.0.1:8080/dich?tu=permanent
$ curl -s http://127.0.0.1:8080/f-khong/abc
sau HAI rewrite: uri=[/buoc-2-abc]
$ curl -s http://127.0.0.1:8080/f-break/abc
TEP DICH (tep tinh /dich trong root)
$ curl -s http://127.0.0.1:8080/f-break2/abc
TEP DICH (tep tinh /dich trong root)
$ curl -s -o /dev/null -w 'KHONG co, dich co scheme -&gt; %{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-scheme/abc
KHONG co, dich co scheme -&gt; 302  Location: http://vidu.com/abc
$ curl -s 'http://127.0.0.1:8080/f-q1/abc?utm=x&amp;id=7'
DICH: uri=[/dich] request_uri=[/f-q1/abc?utm=x&amp;id=7] args=[utm=x&amp;id=7]
$ curl -s 'http://127.0.0.1:8080/f-q2/abc?utm=x&amp;id=7'
DICH: uri=[/dich] request_uri=[/f-q2/abc?utm=x&amp;id=7] args=[]
$ curl -s -o /dev/null -w 'vong-a &lt;-&gt; vong-b -&gt; %{http_code}\\n' http://127.0.0.1:8080/vong-a; grep -m1 -o 'rewrite or internal redirection cycle[^,]*' /srv/logs/error.log
vong-a &lt;-&gt; vong-b -&gt; 500
rewrite or internal redirection cycle while processing "/vong-b"</div>
<p>last kết thúc ở <code>/dich</code> với <code>$request_uri</code> gốc; redirect và permanent gửi 302 và 301; không cờ thì nối thành <code>/buoc-2-abc</code>. <code>break</code> + <code>return</code> trả về TỆP, y hệt <code>break</code> đứng một mình. Không cờ nhưng đích có <code>http://</code> thì nginx vẫn gửi 302; query string được nối vào (<code>args=[utm=x&amp;id=7]</code>) cho tới khi dấu <code>?</code> ở cuối vứt nó đi; hai khối viết lại qua lại thì chết với 500 và "rewrite or internal redirection cycle".</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-3-3-grep-regex" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 3.3 — grep, và vừa đủ biểu thức chính quy</span><span class="lc-sub">Nửa regex của mọi lệnh rewrite</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-11-2-chuyen-huong" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 11.3 — Phỏng vấn: rút gọn link (2) — 301 hay 302</span><span class="lc-sub">Chọn 301 hay 302 trong một thiết kế thật</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rewrite</code></span><span class="v">Một regex, một chuỗi thay thế, và một cờ; cái cờ quyết định điều gì xảy ra với request.</span></div>
  <div class="kv"><span class="k"><code>last</code></span><span class="v">Chạy lại phép khớp location với URI đã viết lại — <code>\$uri</code> đổi, <code>\$request_uri</code> thì không.</span></div>
  <div class="kv"><span class="k"><code>break</code></span><span class="v">Dừng module rewrite và xử lý nội dung ngay trong khối này; mọi <code>rewrite</code>/<code>set</code>/<code>if</code>/<code>return</code> nằm dưới nó đều bị bỏ qua.</span></div>
  <div class="kv"><span class="k"><code>redirect</code> / <code>permanent</code></span><span class="v">Gửi client một cú <code>302</code> / <code>301</code> — hiện ra ở trình duyệt và tốn một vòng đi về.</span></div>
  <div class="kv"><span class="k">(không cờ)</span><span class="v">Viết lại rồi đi tiếp, nên các <code>rewrite</code> sau trong khối chạy trên giá trị mới.</span></div>
  <div class="kv"><span class="k">rewrite cycle</span><span class="v">Mười cú chuyển hướng nội bộ làm request chết với <code>500</code> và dòng "rewrite or internal redirection cycle".</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một lệnh <code>rewrite</code> là regex + chuỗi thay thế + cờ, và cái cờ mới là phần làm đổi hành vi.</li><li><code>last</code> chạy lại phép khớp location; <code>break</code> ở lại và âm thầm bỏ qua mọi chỉ thị họ rewrite nằm dưới nó, kể cả <code>return</code>.</li><li><code>redirect</code>/<code>permanent</code> đi ra trình duyệt; một chuỗi thay thế bắt đầu bằng scheme ép thành <code>302</code> dù không viết cờ.</li><li>Một dấu <code>?</code> ở cuối vứt query string; ngược lại thì các tham số gốc được nối vào.</li><li>Với một đường dẫn cố định đã dời, hãy ưu tiên <code>return 301</code> hơn <code>rewrite</code> — rẻ hơn và rõ hơn.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">nginx — module rewrite</span><span class="lc-sub">nginx.org · Cả bốn cờ, và danh sách các chỉ thị mà break dừng lại</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — location và chuyển hướng nội bộ</span><span class="lc-sub">nginx.org · last THỰC SỰ kích hoạt cái gì, cùng ngôn ngữ với Bài 2.5</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">MDN — 301 và 302</span><span class="lc-sub">developer.mozilla.org · Cái nào thì máy tìm kiếm và trình duyệt đem đi cache</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Chuỗi chuyển hướng, và mỗi chặng thừa tốn gì của một lượt nạp trang</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Đặt một cái return sau một cái break rồi tự chứng minh rằng nó không bao giờ chạy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Why "if is evil", measured three ways|||8.2 — Vì sao "if là quỷ dữ", đo bằng ba cách',
      slug: 'nginx-8-2-if-la-quy-du',
      type: 'LESSON',
      description: 'Cái tiêu đề đó là từ chính wiki của Nginx, và nó nghe như lời khuyên đạo đức cho tới khi bạn đem đo. Bài này dựng ba khối, và cái thứ ba biến một cú 200 thành 404 chỉ vì thêm một tham số query — cùng một tệp, cùng một cấu hình, khác đúng một chữ trên URL.',
      content: `
${G08_2}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Why "if is evil", measured three ways</h2>
<p class="lead">The Nginx wiki has a page called "If is evil", which sounds like a style opinion until you reproduce what it is about. Three blocks, three probes, and the third one turns a working file into a <code>404</code> because of a query parameter.</p>

<h3>Probe 1: it works, which is the problem</h3>
<div class="out">location /if-a/ {
  if ($arg_x = "1") { return 200 "if THAY x=1"; }
  return 200 "if KHONG thay";
}

  ?x=1 -> if THAY x=1
  ?x=2 -> if KHONG thay</div>
<p>Exactly as written. This is the case that teaches people <code>if</code> is fine — and it is, because <code>return</code> and <code>rewrite</code> are the only two directives <code>if</code> genuinely supports. Everything else is where it goes wrong.</p>

<h3>Probe 2: a header disappears</h3>
<div class="out">location /if-nguy/ {
  if ($arg_x = "1") { add_header X-Trong-If "co" always; }
  add_header X-Ngoai-If "co" always;
  return 200 "xem header";
}

  ?x=1 -> X-Trong-If: co             &lt;- CHI cai trong if
  ?x=2 -> X-Ngoai-If: co             &lt;- CHI cai ngoai if</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">An if block is a nested location</span><span class="lz-d">Not a conditional statement. Nginx creates an anonymous <code>location</code> inside the outer one, and when the condition is true the request is handled by that nested block instead.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">So the array-inheritance rule applies</span><span class="lz-d">Lesson 2.3: one <code>add_header</code> in a child replaces the whole inherited list. The nested block has its own <code>add_header</code>, so the outer one is discarded — measured as the two headers never appearing together.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">This is how security headers vanish on one condition</span><span class="lz-d">An <code>if</code> that adds a debug header, or a CORS header, silently removes every security header the location was setting. The config reads as "add one more thing"; the behaviour is "replace all of them".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And it only happens when the condition is true</span><span class="lz-d">Which is the worst property: the site is correct in testing and wrong for exactly the requests that match. Nothing in a config review or a smoke test would catch it.</span></div>
</div>

<h3>Probe 3: a 200 becomes a 404</h3>
<div class="out">location /if-tryfiles/ {
  root /tmp/nxrw/www;
  if ($arg_x = "1") { add_header X-Da-Vao-If "co" always; }
  try_files /dich =404;
}

  ?x=2 -> 200   (khong co header)     &lt;- tep duoc phuc vu binh thuong
  ?x=1 -> 404   (co header)           &lt;- CUNG tep do, gio KHONG TIM THAY</div>
<div class="pitfall">
<p><strong>Trap — the file exists, the config did not change, and adding <code>?x=1</code> to the URL made it a <code>404</code>.</strong> Because the <code>if</code> creates a nested location, and <code>try_files</code> belongs to the outer one. When the condition matches, the request is handled by the nested block — which has no <code>try_files</code>, no content handler, and therefore nothing to serve. The reason this is the canonical example is that the config looks entirely reasonable: a conditional header next to a file server. Nobody writing it expects it to disable the file server. And the failure is conditional on a query parameter, so it reaches production and then reproduces only for some requests. <strong>The rule that avoids all of this: inside a <code>location</code>, only ever use <code>if</code> with <code>return</code> or <code>rewrite</code>. Anything else — <code>add_header</code>, <code>try_files</code>, <code>proxy_pass</code>, <code>root</code> — is a bug waiting for the right query string.</strong></p>
</div>

<h3>What to write instead</h3>
<pre><code class="language-bash"><span class="tok-comment"># THAY VÌ: if ($http_user_agent ~* bot) { add_header X-Bot "co"; }</span>
map \$http_user_agent \$la_bot {
  default  "";
  "~*bot"  "co";
}
add_header X-Bot \$la_bot always;        <span class="tok-comment"># an empty header is not sent</span>

<span class="tok-comment"># THAY VÌ: if ($request_method = POST) { proxy_pass http://ghi; }</span>
map \$request_method \$dich_upstream {
  default  "http://doc";
  POST     "http://ghi";
  PUT      "http://ghi";
}
location /api/ { proxy_pass \$dich_upstream; }

<span class="tok-comment"># if is STILL correct when its body contains only return or rewrite:</span>
if (\$host != "vidu.com") { return 301 https://vidu.com\$request_uri; }
if (\$request_uri ~ "^/cu/") { rewrite ^/cu/(.*)\$ /moi/\$1 permanent; }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">map is evaluated lazily and only once</span><span class="v">The variable is computed the first time it is referenced in a request and cached for that request. An <code>if</code> is evaluated every time the block is entered, and it restructures the configuration tree. For anything on a hot path the difference is real, and for readability it is not close.</span></div>
  <div class="kv"><span class="k">An empty map result disables what uses it</span><span class="v"><code>add_header X-Bot "" always;</code> sends nothing, and <code>limit_req</code> with an empty key does not apply. That makes <code>map</code> the idiomatic way to express "only in this case", without a nested block.</span></div>
  <div class="kv"><span class="k">if at server level is safer than inside a location</span><span class="v">The documented caveats are about <code>if</code> inside <code>location</code>. At <code>server</code> level with a <code>return</code>, it is a normal and widely used pattern — the canonical HTTPS redirect is exactly that shape.</span></div>
  <div class="kv"><span class="k">Two conditions need a map with a combined key</span><span class="v">There is no <code>&amp;&amp;</code>. The idiom is <code>map "\$a:\$b" \$ket_qua { "~^co:co\$" 1; }</code> — build one string from both variables and match against it. Nesting two <code>if</code> blocks is not possible and would be worse if it were.</span></div>
</div>
<div class="note-ct">
<p><strong>Why this lesson is short on nuance.</strong> There is a version of this that carefully explains when <code>if</code> is safe in a location and when it is not. The honest version is that the rule "only <code>return</code> and <code>rewrite</code>" is easy to remember, costs nothing, and makes probe 3 impossible — while the nuanced version requires everyone who ever edits the file to remember which directives are safe. <code>map</code> covers every other case and is clearer to read, so the trade is not close.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>The three probes, then the same jobs written with <code>map</code> — a bot header, an upstream chosen by method, and an AND as a combined key — on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  upstream doc { server 127.0.0.1:8091; }
  upstream ghi { server 127.0.0.1:8092; }
  server { listen 8091; return 200 "upstream DOC\\n"; }
  server { listen 8092; return 200 "upstream GHI\\n"; }

  map $http_user_agent $la_bot { default ""; "~*bot" "co"; }
  map $request_method $dich_upstream { default "http://doc"; POST "http://ghi"; PUT "http://ghi"; }
  map "$arg_a:$arg_b" $ca_hai { default "khong"; "~^1:1$" "CO"; }     <span class="tok-comment">  # phép AND bằng khoá ghép</span>

  server {
    listen 8080;
    root /srv/www;
    location /if-a/ {                                  <span class="tok-comment">  # 1) if + return: CHẠY đúng</span>
      if ($arg_x = "1") { return 200 "if THAY x=1\\n"; }
      return 200 "if KHONG thay\\n";
    }
    location /if-nguy/ {                               <span class="tok-comment">  # 2) add_header trong if</span>
      if ($arg_x = "1") { add_header X-Trong-If "co" always; }
      add_header X-Ngoai-If "co" always;
      return 200 "xem header\\n";
    }
    location /if-tryfiles/ {                           <span class="tok-comment">  # 3) if + try_files</span>
      if ($arg_x = "1") { add_header X-Da-Vao-If "co" always; }
      try_files /dich =404;
    }
    location /map-bot/ { add_header X-Bot $la_bot always; return 200 "xem header\\n"; }
    location /api/     { proxy_pass $dich_upstream; }
    location /and/     { return 200 "a=1 VA b=1 ? $ca_hai\\n"; }
  }
}</code></pre>
<div class="out">$ for x in 1 2; do printf '?x=%s -&gt; ' $x; curl -s "http://127.0.0.1:8080/if-a/?x=$x"; done
?x=1 -&gt; if THAY x=1
?x=2 -&gt; if KHONG thay
$ for x in 1 2; do printf '?x=%s -&gt; ' $x; curl -s -D - -o /dev/null "http://127.0.0.1:8080/if-nguy/?x=$x" | tr -d '\\r' | grep -iE '^x-(trong|ngoai)' | tr '\\n' ' '; echo; done
?x=1 -&gt; X-Trong-If: co 
?x=2 -&gt; X-Ngoai-If: co 
$ for x in 2 1; do printf '?x=%s -&gt; ' $x; curl -s -D - -o /dev/null "http://127.0.0.1:8080/if-tryfiles/?x=$x" | tr -d '\\r' | grep -iE '^HTTP|^x-da' | tr '\\n' ' '; echo; done
?x=2 -&gt; HTTP/1.1 200 OK 
?x=1 -&gt; HTTP/1.1 404 Not Found X-Da-Vao-If: co 
$ for ua in 'Mozilla/5.0' 'Googlebot/2.1'; do printf '%-14s -&gt; ' "$ua"; curl -s -D - -o /dev/null -A "$ua" http://127.0.0.1:8080/map-bot/ | tr -d '\\r' | grep -iE '^x-bot' || echo '(khong co X-Bot)'; done
Mozilla/5.0    -&gt; (khong co X-Bot)
Googlebot/2.1  -&gt; X-Bot: co
$ for m in GET POST PUT; do printf '%-4s /api/ -&gt; ' $m; curl -s -X $m http://127.0.0.1:8080/api/; done
GET  /api/ -&gt; upstream DOC
POST /api/ -&gt; upstream GHI
PUT  /api/ -&gt; upstream GHI
$ for q in 'a=1&amp;b=1' 'a=1&amp;b=0' 'a=0&amp;b=1'; do printf '%-8s -&gt; ' "$q"; curl -s "http://127.0.0.1:8080/and/?$q"; done
a=1&amp;b=1  -&gt; a=1 VA b=1 ? CO
a=1&amp;b=0  -&gt; a=1 VA b=1 ? khong
a=0&amp;b=1  -&gt; a=1 VA b=1 ? khong</div>
<p>Probe 1 ran exactly as written. Probe 2: each request carried ONE of the two headers, never both. Probe 3: <code>?x=2</code> got 200, <code>?x=1</code> got 404 for the same real file. With <code>map</code>: only the bot user agent got <code>X-Bot</code>; GET reached the read upstream, POST and PUT the write one; only <code>a=1&amp;b=1</code> matched the combined key.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-4-header" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Web Security · 5.4 — Security headers checklist</span><span class="lc-sub">The headers an if can silently remove</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-2-cors" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Web Security · 5.2 — CORS misconfigurations</span><span class="lc-sub">What a conditional CORS header can break</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>if</code></span><span class="v">Inside a location it only truly supports <code>return</code> and <code>rewrite</code>; anything else is a trap.</span></div>
  <div class="kv"><span class="k">nested location</span><span class="v">An <code>if</code> block is an anonymous location, not a conditional statement.</span></div>
  <div class="kv"><span class="k">array inheritance</span><span class="v">One <code>add_header</code> in the <code>if</code> block replaces the whole inherited list (Lesson 2.3).</span></div>
  <div class="kv"><span class="k">soft failure</span><span class="v">The bug only fires when the condition is true, so testing looks fine and production breaks.</span></div>
  <div class="kv"><span class="k"><code>map</code> (the fix)</span><span class="v">A lazy, <code>http</code>-level lookup table that replaces almost every <code>if</code>.</span></div>
  <div class="kv"><span class="k">combined key</span><span class="v">Build one string from two variables to express an AND that nginx lacks.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>"If is evil" is about <code>if</code> inside a location: it is only safe with <code>return</code> or <code>rewrite</code>.</li><li>An <code>if</code> block is a nested anonymous location, so array-inherited directives like <code>add_header</code> get replaced, not added.</li><li>A <code>try_files</code> in an <code>if</code>-guarded location can vanish, turning a <code>200</code> into a <code>404</code> on one query parameter.</li><li>Replace conditions with <code>map</code> — lazy, evaluated once, and it does not restructure the config.</li><li><code>if</code> at <code>server</code> level with a <code>return</code> (the HTTPS redirect) is a normal, safe pattern.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/" target="_blank" rel="noopener"><span class="lc-ico">😈</span><span class="lc-body"><span class="lc-title">nginx wiki — If is evil</span><span class="lc-sub">nginx.com · The original page, with the same failures explained from the source side</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — the map module</span><span class="lc-sub">nginx.org · Lazy evaluation, default, hostnames and regex keys</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#if" target="_blank" rel="noopener"><span class="lc-ico">❓</span><span class="lc-body"><span class="lc-title">nginx — the if directive</span><span class="lc-sub">nginx.org · Including the sentence that it is part of the rewrite module</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">Lookup tables over conditionals, the same idea in a language that has both</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Break a working file server with one query parameter, then fix it with a map</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Vì sao "if là quỷ dữ", đo bằng ba cách</h2>
<p class="lead">Cái tiêu đề đó là tên một trang trên chính wiki của Nginx, và nó nghe như một ý kiến về phong cách cho tới khi bạn dựng lại cái nó nói. Ba khối, ba phép dò, và cái thứ ba biến một tệp đang chạy tốt thành một cú <code>404</code> vì một tham số query.</p>

<h3>Phép dò 1: nó CHẠY, mà đó mới là vấn đề</h3>
<div class="out">location /if-a/ {
  if ($arg_x = "1") { return 200 "if THAY x=1"; }
  return 200 "if KHONG thay";
}

  ?x=1 -> if THAY x=1
  ?x=2 -> if KHONG thay</div>
<p>Đúng y như đã viết. Đây là trường hợp dạy cho người ta rằng <code>if</code> chẳng sao cả — và đúng là chẳng sao, vì <code>return</code> và <code>rewrite</code> là HAI chỉ thị duy nhất mà <code>if</code> thật sự hỗ trợ. Mọi thứ khác mới là chỗ nó hỏng.</p>

<h3>Phép dò 2: một cái header BIẾN MẤT</h3>
<div class="out">location /if-nguy/ {
  if ($arg_x = "1") { add_header X-Trong-If "co" always; }
  add_header X-Ngoai-If "co" always;
  return 200 "xem header";
}

  ?x=1 -> X-Trong-If: co             &lt;- CHI cai trong if
  ?x=2 -> X-Ngoai-If: co             &lt;- CHI cai ngoai if</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một khối if là một LOCATION LỒNG</span><span class="lz-d">Không phải một câu lệnh điều kiện. Nginx tạo ra một <code>location</code> vô danh bên trong cái location ngoài, và khi điều kiện đúng thì request được xử lý bởi CÁI KHỐI LỒNG đó thay vì cái ngoài.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nên cái luật thừa hưởng dạng mảng ÁP DỤNG</span><span class="lz-d">Bài 2.3: MỘT <code>add_header</code> ở con là THAY THẾ cả danh sách thừa hưởng. Cái khối lồng có <code>add_header</code> của riêng nó, nên cái bên ngoài bị vứt — đo được bằng việc hai header KHÔNG BAO GIỜ cùng xuất hiện.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đây là cách header bảo mật biến mất trên MỘT điều kiện</span><span class="lz-d">Một cái <code>if</code> thêm một header gỡ lỗi, hay một header CORS, sẽ ÂM THẦM gỡ bỏ MỌI header bảo mật mà cái location đang đặt. Cấu hình đọc ra là "thêm một thứ nữa"; còn hành vi là "thay thế tất cả".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và nó CHỈ xảy ra khi điều kiện đúng</span><span class="lz-d">Đó mới là tính chất tệ nhất: site ĐÚNG lúc đem thử và SAI với đúng những request khớp điều kiện. Không có buổi rà soát cấu hình hay phép kiểm nhanh nào bắt được nó.</span></div>
</div>

<h3>Phép dò 3: một cú 200 thành 404</h3>
<div class="out">location /if-tryfiles/ {
  root /tmp/nxrw/www;
  if ($arg_x = "1") { add_header X-Da-Vao-If "co" always; }
  try_files /dich =404;
}

  ?x=2 -> 200   (khong co header)     &lt;- tep duoc phuc vu binh thuong
  ?x=1 -> 404   (co header)           &lt;- CUNG tep do, gio KHONG TIM THAY</div>
<div class="pitfall">
<p><strong>Bẫy — cái tệp CÓ THẬT, cấu hình KHÔNG đổi, và thêm <code>?x=1</code> vào URL làm nó thành <code>404</code>.</strong> Vì cái <code>if</code> tạo ra một location LỒNG, còn <code>try_files</code> thì thuộc về cái location NGOÀI. Khi điều kiện khớp, request được xử lý bởi khối lồng — thứ chẳng có <code>try_files</code>, chẳng có bộ xử lý nội dung nào, và do đó chẳng có gì để phục vụ. Lý do đây là ví dụ kinh điển là vì cấu hình trông HOÀN TOÀN hợp lý: một cái header có điều kiện đặt cạnh một máy chủ tệp. Không ai viết nó mà ngờ rằng nó TẮT luôn cái máy chủ tệp. Và kiểu hỏng ấy phụ thuộc vào một tham số query, nên nó ra tới production rồi mới tái hiện, và chỉ tái hiện với MỘT SỐ request. <strong>Cái luật tránh được tất cả chuyện này: bên trong một <code>location</code>, chỉ dùng <code>if</code> với <code>return</code> hoặc <code>rewrite</code>, không gì khác. Mọi thứ còn lại — <code>add_header</code>, <code>try_files</code>, <code>proxy_pass</code>, <code>root</code> — đều là một con lỗi đang chờ đúng cái query string của nó.</strong></p>
</div>

<h3>Viết cái gì thay thế</h3>
<pre><code class="language-bash"><span class="tok-comment"># THAY VÌ: if ($http_user_agent ~* bot) { add_header X-Bot "co"; }</span>
map \$http_user_agent \$la_bot {
  default  "";
  "~*bot"  "co";
}
add_header X-Bot \$la_bot always;        <span class="tok-comment"># header rỗng thì không được gửi</span>

<span class="tok-comment"># THAY VÌ: if ($request_method = POST) { proxy_pass http://ghi; }</span>
map \$request_method \$dich_upstream {
  default  "http://doc";
  POST     "http://ghi";
  PUT      "http://ghi";
}
location /api/ { proxy_pass \$dich_upstream; }

<span class="tok-comment"># if VẪN ĐÚNG khi thân nó chỉ có return hoặc rewrite:</span>
if (\$host != "vidu.com") { return 301 https://vidu.com\$request_uri; }
if (\$request_uri ~ "^/cu/") { rewrite ^/cu/(.*)\$ /moi/\$1 permanent; }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">map được tính LƯỜI và chỉ MỘT lần</span><span class="v">Cái biến được tính vào lần đầu nó được tham chiếu trong một request rồi được nhớ lại cho request đó. Còn một cái <code>if</code> thì được tính MỖI LẦN khối được bước vào, và nó tái cấu trúc lại cây cấu hình. Với bất cứ thứ gì nằm trên đường nóng thì khác biệt là có thật, còn về mặt dễ đọc thì hai bên không cùng hạng.</span></div>
  <div class="kv"><span class="k">Kết quả map RỖNG thì TẮT thứ đang dùng nó</span><span class="v"><code>add_header X-Bot "" always;</code> không gửi gì cả, và <code>limit_req</code> với khoá rỗng thì không áp dụng. Điều đó làm <code>map</code> thành cách viết chuẩn mực để diễn đạt "chỉ trong trường hợp này", mà không cần một khối lồng nào.</span></div>
  <div class="kv"><span class="k">if ở tầng server AN TOÀN hơn if trong location</span><span class="v">Những cảnh báo trong tài liệu là về <code>if</code> nằm TRONG <code>location</code>. Ở tầng <code>server</code> đi với một <code>return</code> thì nó là một khuôn mẫu bình thường và được dùng rộng rãi — cú chuyển hướng HTTPS kinh điển đúng là hình dạng ấy.</span></div>
  <div class="kv"><span class="k">Hai điều kiện thì cần một map với KHOÁ GHÉP</span><span class="v">Không có <code>&amp;&amp;</code>. Cách viết chuẩn mực là <code>map "\$a:\$b" \$ket_qua { "~^co:co\$" 1; }</code> — dựng MỘT chuỗi từ cả hai biến rồi đem khớp. Lồng hai khối <code>if</code> vào nhau là không làm được, và nếu làm được thì cũng tệ hơn.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao bài này ít sắc thái.</strong> Có một phiên bản của bài này giải thích cẩn thận khi nào <code>if</code> an toàn trong một location và khi nào thì không. Phiên bản THẬT THÀ là: cái luật "chỉ <code>return</code> và <code>rewrite</code>" dễ nhớ, chẳng tốn gì, và nó làm cho phép dò 3 KHÔNG THỂ xảy ra — trong khi phiên bản nhiều sắc thái đòi hỏi MỌI người từng sửa cái file đó phải nhớ được chỉ thị nào là an toàn. <code>map</code> lo hết mọi trường hợp còn lại và dễ đọc hơn, nên cuộc đổi chác này không cân sức.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Ba phép dò, rồi đúng những việc đó viết bằng <code>map</code> — một header cho bot, upstream chọn theo phương thức, và một phép VÀ bằng khoá ghép — trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  upstream doc { server 127.0.0.1:8091; }
  upstream ghi { server 127.0.0.1:8092; }
  server { listen 8091; return 200 "upstream DOC\\n"; }
  server { listen 8092; return 200 "upstream GHI\\n"; }

  map $http_user_agent $la_bot { default ""; "~*bot" "co"; }
  map $request_method $dich_upstream { default "http://doc"; POST "http://ghi"; PUT "http://ghi"; }
  map "$arg_a:$arg_b" $ca_hai { default "khong"; "~^1:1$" "CO"; }     <span class="tok-comment">  # phép AND bằng khoá ghép</span>

  server {
    listen 8080;
    root /srv/www;
    location /if-a/ {                                  <span class="tok-comment">  # 1) if + return: CHẠY đúng</span>
      if ($arg_x = "1") { return 200 "if THAY x=1\\n"; }
      return 200 "if KHONG thay\\n";
    }
    location /if-nguy/ {                               <span class="tok-comment">  # 2) add_header trong if</span>
      if ($arg_x = "1") { add_header X-Trong-If "co" always; }
      add_header X-Ngoai-If "co" always;
      return 200 "xem header\\n";
    }
    location /if-tryfiles/ {                           <span class="tok-comment">  # 3) if + try_files</span>
      if ($arg_x = "1") { add_header X-Da-Vao-If "co" always; }
      try_files /dich =404;
    }
    location /map-bot/ { add_header X-Bot $la_bot always; return 200 "xem header\\n"; }
    location /api/     { proxy_pass $dich_upstream; }
    location /and/     { return 200 "a=1 VA b=1 ? $ca_hai\\n"; }
  }
}</code></pre>
<div class="out">$ for x in 1 2; do printf '?x=%s -&gt; ' $x; curl -s "http://127.0.0.1:8080/if-a/?x=$x"; done
?x=1 -&gt; if THAY x=1
?x=2 -&gt; if KHONG thay
$ for x in 1 2; do printf '?x=%s -&gt; ' $x; curl -s -D - -o /dev/null "http://127.0.0.1:8080/if-nguy/?x=$x" | tr -d '\\r' | grep -iE '^x-(trong|ngoai)' | tr '\\n' ' '; echo; done
?x=1 -&gt; X-Trong-If: co 
?x=2 -&gt; X-Ngoai-If: co 
$ for x in 2 1; do printf '?x=%s -&gt; ' $x; curl -s -D - -o /dev/null "http://127.0.0.1:8080/if-tryfiles/?x=$x" | tr -d '\\r' | grep -iE '^HTTP|^x-da' | tr '\\n' ' '; echo; done
?x=2 -&gt; HTTP/1.1 200 OK 
?x=1 -&gt; HTTP/1.1 404 Not Found X-Da-Vao-If: co 
$ for ua in 'Mozilla/5.0' 'Googlebot/2.1'; do printf '%-14s -&gt; ' "$ua"; curl -s -D - -o /dev/null -A "$ua" http://127.0.0.1:8080/map-bot/ | tr -d '\\r' | grep -iE '^x-bot' || echo '(khong co X-Bot)'; done
Mozilla/5.0    -&gt; (khong co X-Bot)
Googlebot/2.1  -&gt; X-Bot: co
$ for m in GET POST PUT; do printf '%-4s /api/ -&gt; ' $m; curl -s -X $m http://127.0.0.1:8080/api/; done
GET  /api/ -&gt; upstream DOC
POST /api/ -&gt; upstream GHI
PUT  /api/ -&gt; upstream GHI
$ for q in 'a=1&amp;b=1' 'a=1&amp;b=0' 'a=0&amp;b=1'; do printf '%-8s -&gt; ' "$q"; curl -s "http://127.0.0.1:8080/and/?$q"; done
a=1&amp;b=1  -&gt; a=1 VA b=1 ? CO
a=1&amp;b=0  -&gt; a=1 VA b=1 ? khong
a=0&amp;b=1  -&gt; a=1 VA b=1 ? khong</div>
<p>Phép dò 1 chạy đúng như viết. Phép dò 2: mỗi request chỉ mang MỘT trong hai header, không bao giờ cả hai. Phép dò 3: <code>?x=2</code> ra 200, <code>?x=1</code> ra 404 cho cùng một tệp có thật. Với <code>map</code>: chỉ user agent bot nhận <code>X-Bot</code>; GET tới upstream đọc, POST và PUT tới upstream ghi; chỉ <code>a=1&amp;b=1</code> khớp khoá ghép.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-4-header" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Web Security · 5.4 — Checklist header bảo mật</span><span class="lc-sub">Những header mà một cái if có thể âm thầm gỡ đi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-2-cors" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Web Security · 5.2 — Cấu hình CORS sai</span><span class="lc-sub">Một header CORS có điều kiện có thể làm hỏng gì</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>if</code></span><span class="v">Trong một location chỉ thật sự hỗ trợ <code>return</code> và <code>rewrite</code>; mọi thứ khác đều là bẫy.</span></div>
  <div class="kv"><span class="k">nested location</span><span class="v">Một khối <code>if</code> là một location vô danh, không phải một câu lệnh điều kiện.</span></div>
  <div class="kv"><span class="k">array inheritance</span><span class="v">Một <code>add_header</code> trong khối <code>if</code> thay thế cả danh sách thừa hưởng (Bài 2.3).</span></div>
  <div class="kv"><span class="k">soft failure</span><span class="v">Lỗi chỉ nổ khi điều kiện đúng, nên lúc thử nghiệm trông vẫn ổn còn production thì hỏng.</span></div>
  <div class="kv"><span class="k"><code>map</code> (cách sửa)</span><span class="v">Bảng tra ở tầng <code>http</code>, tính lười, thay thế gần như mọi cái <code>if</code>.</span></div>
  <div class="kv"><span class="k">combined key</span><span class="v">Dựng một chuỗi từ hai biến để diễn đạt phép AND mà nginx không có.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>"If là quỷ dữ" nói về <code>if</code> nằm trong một location: chỉ an toàn khi đi với <code>return</code> hoặc <code>rewrite</code>.</li><li>Một khối <code>if</code> là một location lồng vô danh, nên các chỉ thị thừa hưởng dạng mảng như <code>add_header</code> bị thay thế chứ không được cộng thêm.</li><li>Một <code>try_files</code> trong một location có <code>if</code> có thể biến mất, biến <code>200</code> thành <code>404</code> chỉ vì một tham số query.</li><li>Hãy thay điều kiện bằng <code>map</code> — tính lười, tính một lần, và không tái cấu trúc cấu hình.</li><li><code>if</code> ở tầng <code>server</code> đi với một <code>return</code> (cú chuyển hướng HTTPS) là một khuôn mẫu bình thường và an toàn.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/" target="_blank" rel="noopener"><span class="lc-ico">😈</span><span class="lc-body"><span class="lc-title">nginx wiki — If is evil</span><span class="lc-sub">nginx.com · Trang gốc, giải thích cùng những kiểu hỏng ấy từ phía mã nguồn</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — module map</span><span class="lc-sub">nginx.org · Tính lười, default, khoá dạng tên miền và dạng regex</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#if" target="_blank" rel="noopener"><span class="lc-ico">❓</span><span class="lc-body"><span class="lc-title">nginx — chỉ thị if</span><span class="lc-sub">nginx.org · Kèm cái câu nói rằng nó thuộc module rewrite</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Bảng tra thay cho câu điều kiện, cùng ý tưởng trong một ngôn ngữ có cả hai</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Phá một máy chủ tệp đang chạy tốt bằng một tham số query, rồi vá nó bằng map</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — map: the lookup table that replaces every if|||8.3 — map: cái bảng tra thay thế mọi cái if',
      slug: 'nginx-8-3-map',
      type: 'LESSON',
      description: 'map nhận một biến vào và cho một biến ra, và nó làm được mọi thứ mà cái if ở Bài 8.2 định làm — mà không dựng ra một location lồng nào. Bài này đo cả bốn kiểu khoá, cả chế độ tên miền, cả việc nối hai map lại, và cả cách viết thay cho phép AND mà Nginx không có.',
      content: `
${G08_3}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>map: the lookup table that replaces every if</h2>
<p class="lead">A <code>map</code> declares "given this variable, produce that one". It lives at <code>http</code> level, it is evaluated lazily, and it does not restructure anything — which is the entire reason it can do safely what Lesson 8.2 measured going wrong.</p>

<h3>Four kinds of key, measured</h3>
<pre><code class="language-bash">map \$arg_v \$ket_qua {
  default          "MAC-DINH";
  "a"              "khop-chinh-xac-a";
  "~^so-(\\\\d+)\$"   "regex-bat-duoc-\$1";      <span class="tok-comment"># ~ is case-sensitive</span>
  "~*^HOA"         "regex-khong-phan-biet";  <span class="tok-comment"># ~* is not</span>
}</code></pre>
<div class="out">?v=<rong>  -> MAC-DINH
?v=a       -> khop-chinh-xac-a
?v=so-42   -> regex-bat-duoc-42          &lt;- nhom bat $1 dung duoc o ve PHAI
?v=HOA-abc -> regex-khong-phan-biet
?v=hoa-abc -> regex-khong-phan-biet      &lt;- ~* nen chu thuong cung khop
?v=gi-do   -> MAC-DINH</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Exact strings are checked first, and they are a hash</span><span class="lz-d">Not a scan. However many exact keys you list, the lookup is one hash operation — which is why a <code>map</code> with a thousand entries is as fast as one with three, and why it is the right structure for a redirect table.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Regex keys start with ~ or ~*</span><span class="lz-d">Tried in order, after the exact keys fail. Captures work: <code>\$1</code> on the right-hand side is the group from the key, measured as <code>so-42</code> producing <code>regex-bat-duoc-42</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">default catches everything else, including empty</span><span class="lz-d">Without a <code>default</code> the result is an empty string, which is often exactly what you want — an empty value disables an <code>add_header</code> or a <code>limit_req</code>. State it explicitly either way so the intent is visible.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It costs nothing until something reads the variable</span><span class="lz-d">Lazy evaluation: a <code>map</code> declared at <code>http</code> level and referenced by one <code>location</code> does no work for requests handled elsewhere. You can declare a dozen and pay for the ones you use.</span></div>
</div>

<h3>Hostname mode, and chaining</h3>
<div class="out">map $http_host $nhom {
  hostnames;
  default    "khac";
  vidu.com   "chinh";
  *.vidu.com "con";
  vidu.*     "moi-duoi";
}

  Host: vidu.com      -> chinh
  Host: api.vidu.com  -> con
  Host: vidu.vn       -> moi-duoi
  Host: khac.com      -> khac

Va MOT map co the doc ket qua cua map KHAC:
  map $ket_qua $noi_tiep { "MAC-DINH" "day-la-mac-dinh"; "~^regex-" "day-la-regex"; }
  ?v=so-42 -> ket_qua=[regex-bat-duoc-42] noi_tiep=[day-la-regex]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">hostnames enables the wildcard forms</span><span class="v">The same <code>*.name</code> and <code>name.*</code> syntax as <code>server_name</code> in Chapter 1, matching whole labels rather than characters. Without the <code>hostnames</code> line those are literal strings and match nothing.</span></div>
  <div class="kv"><span class="k">Chaining is how you build anything complicated</span><span class="v">One <code>map</code> normalises, the next classifies, the third decides. Each is a flat table you can read in isolation, which is a very different maintenance story from nested conditions.</span></div>
  <div class="kv"><span class="k">include pulls the table out of the config</span><span class="v"><code>map \$request_uri \$dich { include /etc/nginx/chuyen-huong.map; }</code> with one <code>key value;</code> per line. A thousand-row redirect table then lives in its own file that a non-Nginx person can edit.</span></div>
  <div class="kv"><span class="k">volatile disables caching of the result</span><span class="v">By default the value is computed once per request. If the input can change mid-request — after an internal redirect changes <code>\$uri</code> — add <code>volatile;</code> so it is recomputed. Rarely needed, and confusing when it is the missing piece.</span></div>
</div>

<h3>The AND that Nginx does not have</h3>
<div class="out">map "$arg_a:$arg_b" $ca_hai {
  default        "khong";
  "~^co:co$"     "CA HAI deu co";
}

  ?a=co&b=co     -> CA HAI deu co
  ?a=co&b=khong  -> khong
  ?a=khong&b=co  -> khong</div>
<div class="pitfall">
<p><strong>Trap — there is no <code>&amp;&amp;</code>, and the workaround people reach for first is nested <code>if</code>, which is not even legal.</strong> The idiom is to build one string out of the variables you care about and match a pattern against it, as above. The separator matters: use a character that cannot appear in either value, or <code>a=</code>"<code>x:y</code>" and <code>b=</code>"<code>z</code>" collide with <code>a=</code>"<code>x</code>" and <code>b=</code>"<code>y:z</code>". A colon is fine for flags and wrong for user-supplied strings — for those, a character like <code>\\x1f</code> that cannot occur in a URL is the safe choice. This is the one place where the <code>map</code> approach is genuinely less readable than a conditional would be, and it is still better than the alternative.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Three map patterns you can use straight away</span>

<span class="tok-comment"># 1) On/off by domain — with no if at all</span>
map \$http_host \$moi_truong {
  default        "san-xuat";
  "~^thu-nghiem" "thu-nghiem";
}
add_header X-Moi-Truong \$moi_truong always;

<span class="tok-comment"># 2) A redirect table, kept in its own file</span>
map \$request_uri \$dich_cu {
  include /etc/nginx/chuyen-huong.map;   <span class="tok-comment"># "/old/a  /new/a;" one pair per line</span>
}
if (\$dich_cu) { return 301 \$dich_cu; }   <span class="tok-comment"># if + return: legitimate (8.2)</span>

<span class="tok-comment"># 3) Exempting internal traffic from the rate limit</span>
map \$binary_remote_addr \$khoa_gioi_han {
  default              \$binary_remote_addr;
  "~^\\\\x7f"            "";                <span class="tok-comment"># empty = the limit does NOT apply</span>
}
limit_req_zone \$khoa_gioi_han zone=chung:10m rate=20r/s;</code></pre>
<div class="note-ct">
<p><strong>The mental shift worth making.</strong> Nginx configuration is declarative, and <code>map</code> is the declarative way to express a decision: a table from input to output, evaluated when needed, with no effect on anything else. <code>if</code> is the imperative way, and it does not fit — which is why it creates a nested location and why Lesson 8.2's third probe returned a <code>404</code>. Every time you catch yourself wanting a condition, write the table instead; after a few of them the table starts to feel like the natural form.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>Four kinds of key, <code>hostnames</code>, one map reading another, the combined key with a separator collision, and a redirect table in its own file — on nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># chuyen-huong.map</span>
/cu/gioi-thieu   /ve-chung-toi;
/cu/bang-gia     /gia;
/blog/2019/xin-chao  /tin/xin-chao;</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  map $arg_v $ket_qua {
    default          "MAC-DINH";
    "a"              "khop-chinh-xac-a";
    "~^so-(\\d+)$"    "regex-bat-duoc-$1";   <span class="tok-comment">  # ~  phân biệt hoa thường, nhóm bắt dùng được</span>
    "~*^HOA"         "regex-khong-phan-biet"; # ~* không phân biệt
  }
  map $http_host $nhom {
    hostnames;
    default    "khac";
    vidu.com   "chinh";
    *.vidu.com "con";
    vidu.*     "moi-duoi";
  }
  map $ket_qua $noi_tiep { default "khac"; "MAC-DINH" "day-la-mac-dinh"; "~^regex-" "day-la-regex"; } <span class="tok-comment">  # map đọc kết quả map khác</span>
  map "$arg_a:$arg_b" $ca_hai { default "khong"; "~^co:co$" "CA HAI deu co"; }
  map $request_uri $dich_cu { include chuyen-huong.map; }     <span class="tok-comment">  # bảng chuyển hướng trong tệp riêng</span>
  server {
    listen 8080;
    location /k/   { return 200 "?v=$arg_v -&gt; $ket_qua\\n"; }
    location /h/   { return 200 "Host: $http_host -&gt; $nhom\\n"; }
    location /n/   { return 200 "ket_qua=[$ket_qua] noi_tiep=[$noi_tiep]\\n"; }
    location /and/ { return 200 "a=$arg_a b=$arg_b -&gt; $ca_hai   (khoa ghep: [$arg_a:$arg_b])\\n"; }
    location /     { if ($dich_cu) { return 301 $dich_cu; }  return 200 "khong co trong bang: $request_uri\\n"; }
  }
}</code></pre>
<div class="out">$ for v in '' a so-42 HOA-abc hoa-abc gi-do; do curl -s "http://127.0.0.1:8080/k/?v=$v"; done
?v= -&gt; MAC-DINH
?v=a -&gt; khop-chinh-xac-a
?v=so-42 -&gt; regex-bat-duoc-42
?v=HOA-abc -&gt; regex-khong-phan-biet
?v=hoa-abc -&gt; regex-khong-phan-biet
?v=gi-do -&gt; MAC-DINH
$ for h in vidu.com api.vidu.com vidu.vn khac.com; do curl -s -H "Host: $h" http://127.0.0.1:8080/h/; done
Host: vidu.com -&gt; chinh
Host: api.vidu.com -&gt; con
Host: vidu.vn -&gt; moi-duoi
Host: khac.com -&gt; khac
$ curl -s 'http://127.0.0.1:8080/n/?v=so-42'
ket_qua=[regex-bat-duoc-42] noi_tiep=[day-la-regex]
$ for q in 'a=co&amp;b=co' 'a=co&amp;b=khong' 'a=khong&amp;b=co'; do curl -s "http://127.0.0.1:8080/and/?$q"; done
a=co b=co -&gt; CA HAI deu co   (khoa ghep: [co:co])
a=co b=khong -&gt; khong   (khoa ghep: [co:khong])
a=khong b=co -&gt; khong   (khoa ghep: [khong:co])
$ for q in 'a=x:y&amp;b=z' 'a=x&amp;b=y:z'; do curl -s "http://127.0.0.1:8080/and/?$q"; done
a=x:y b=z -&gt; khong   (khoa ghep: [x:y:z])
a=x b=y:z -&gt; khong   (khoa ghep: [x:y:z])
$ for u in /cu/gioi-thieu /cu/bang-gia /blog/2019/xin-chao /khac; do curl -s -o /dev/null -w "$u -&gt; %{http_code} %{redirect_url}\\n" http://127.0.0.1:8080$u; done
/cu/gioi-thieu -&gt; 301 http://127.0.0.1:8080/ve-chung-toi
/cu/bang-gia -&gt; 301 http://127.0.0.1:8080/gia
/blog/2019/xin-chao -&gt; 301 http://127.0.0.1:8080/tin/xin-chao
/khac -&gt; 200 </div>
<p>The capture group worked on the right (<code>regex-bat-duoc-42</code>); <code>~*</code> matched both cases. <code>hostnames</code> matched <code>*.vidu.com</code> and <code>vidu.*</code> label by label. NEW: <code>a=x:y&amp;b=z</code> and <code>a=x&amp;b=y:z</code> built the SAME key <code>x:y:z</code> — choose a separator that cannot occur in the values. The table file gave three 301s, and an unknown path went through untouched.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/dsa-interview/learn?lessonSlug=dsa-1-1-hash-map" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">DSA Interview · 1.1 — Hash maps and sets</span><span class="lc-sub">Why exact keys cost one lookup however many there are</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-3-3-grep-regex" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 3.3 — grep, and just enough regular expression</span><span class="lc-sub">The regex keys</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>map</code></span><span class="v">Declares "given this variable, produce that one"; lives at <code>http</code> level.</span></div>
  <div class="kv"><span class="k"><code>default</code></span><span class="v">Catches everything else, including the empty string.</span></div>
  <div class="kv"><span class="k">exact vs regex keys</span><span class="v">Exact keys are one hash lookup; regex keys (<code>~</code>, <code>~*</code>) are tried in order after them.</span></div>
  <div class="kv"><span class="k"><code>hostnames</code></span><span class="v">Enables <code>*.name</code> and <code>name.*</code> wildcard matching, like <code>server_name</code>.</span></div>
  <div class="kv"><span class="k">chaining</span><span class="v">One <code>map</code> can read another map's output to build complex decisions from flat tables.</span></div>
  <div class="kv"><span class="k"><code>volatile</code></span><span class="v">Disables per-request caching of the result so it is recomputed.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A <code>map</code> is a lazy, <code>http</code>-level lookup from one variable to another, costing nothing until read.</li><li>Exact keys are a single hash operation (a 1000-row table is as fast as a 3-row one); regex keys follow in order.</li><li>An absent or empty <code>default</code> is often what you want — an empty value disables <code>add_header</code> or <code>limit_req</code>.</li><li><code>hostnames</code> enables wildcard host matching; <code>include</code> pulls a large table into its own file.</li><li>There is no <code>&amp;&amp;</code>; build a combined key string and match a pattern against it, with a safe separator.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — the map module</span><span class="lc-sub">nginx.org · hostnames, volatile, include and the matching order</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — the built-in variables</span><span class="lc-sub">nginx.org · Everything a map can take as input, in one list</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_geo_module.html" target="_blank" rel="noopener"><span class="lc-ico">🌍</span><span class="lc-body"><span class="lc-title">nginx — the geo module</span><span class="lc-sub">nginx.org · The same idea keyed on IP ranges, for allowlists and per-network rules</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">Record types as dispatch tables, the same pattern with a type checker</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build a four-key map, chain a second one onto it, then express an AND</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>map: cái bảng tra thay thế mọi cái if</h2>
<p class="lead">Một <code>map</code> khai báo rằng "cho biến này vào thì sinh ra biến kia". Nó sống ở tầng <code>http</code>, nó được tính một cách LƯỜI, và nó KHÔNG tái cấu trúc gì cả — và đó là toàn bộ lý do nó làm được một cách an toàn đúng cái việc mà Bài 8.2 đo thấy hỏng.</p>

<h3>Bốn kiểu khoá, đo thật</h3>
<pre><code class="language-bash">map \$arg_v \$ket_qua {
  default          "MAC-DINH";
  "a"              "khop-chinh-xac-a";
  "~^so-(\\\\d+)\$"   "regex-bat-duoc-\$1";      <span class="tok-comment"># ~ phân biệt hoa thường</span>
  "~*^HOA"         "regex-khong-phan-biet";  <span class="tok-comment"># ~* thì không</span>
}</code></pre>
<div class="out">?v=<rong>  -> MAC-DINH
?v=a       -> khop-chinh-xac-a
?v=so-42   -> regex-bat-duoc-42          &lt;- nhom bat $1 dung duoc o ve PHAI
?v=HOA-abc -> regex-khong-phan-biet
?v=hoa-abc -> regex-khong-phan-biet      &lt;- ~* nen chu thuong cung khop
?v=gi-do   -> MAC-DINH</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Khoá chuỗi CHÍNH XÁC được kiểm trước, và chúng là một BẢNG BĂM</span><span class="lz-d">Không phải một lượt quét. Bạn liệt kê bao nhiêu khoá chính xác cũng được, phép tra vẫn là MỘT thao tác băm — và đó là lý do một <code>map</code> nghìn dòng nhanh ngang một cái ba dòng, và là lý do nó là cấu trúc ĐÚNG cho một bảng chuyển hướng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Khoá regex bắt đầu bằng ~ hoặc ~*</span><span class="lz-d">Được thử theo THỨ TỰ, sau khi đám khoá chính xác trượt hết. Nhóm bắt DÙNG ĐƯỢC: <code>\$1</code> ở vế phải chính là nhóm trong cái khoá, đo được bằng việc <code>so-42</code> cho ra <code>regex-bat-duoc-42</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">default vớt hết phần còn lại, kể cả chuỗi rỗng</span><span class="lz-d">Không có <code>default</code> thì kết quả là chuỗi RỖNG, mà thường thì đó đúng là thứ bạn muốn — một giá trị rỗng sẽ TẮT một <code>add_header</code> hay một <code>limit_req</code>. Dù thế nào cũng hãy khai nó ra TƯỜNG MINH để ý định hiện rõ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó tốn ĐÚNG BẰNG KHÔNG cho tới khi có thứ gì đọc cái biến</span><span class="lz-d">Tính lười: một <code>map</code> khai ở tầng <code>http</code> mà chỉ một <code>location</code> tham chiếu tới thì KHÔNG làm việc gì cho những request được xử lý ở chỗ khác. Bạn khai cả tá cũng được và chỉ trả tiền cho cái nào dùng tới.</span></div>
</div>

<h3>Chế độ tên miền, và nối map</h3>
<div class="out">map $http_host $nhom {
  hostnames;
  default    "khac";
  vidu.com   "chinh";
  *.vidu.com "con";
  vidu.*     "moi-duoi";
}

  Host: vidu.com      -> chinh
  Host: api.vidu.com  -> con
  Host: vidu.vn       -> moi-duoi
  Host: khac.com      -> khac

Va MOT map co the doc ket qua cua map KHAC:
  map $ket_qua $noi_tiep { "MAC-DINH" "day-la-mac-dinh"; "~^regex-" "day-la-regex"; }
  ?v=so-42 -> ket_qua=[regex-bat-duoc-42] noi_tiep=[day-la-regex]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">hostnames BẬT các dạng ký tự đại diện</span><span class="v">Vẫn cú pháp <code>*.ten</code> và <code>ten.*</code> như <code>server_name</code> ở Chương 1, khớp theo TỪNG NHÃN chứ không theo ký tự. Thiếu dòng <code>hostnames</code> thì chúng chỉ là chuỗi theo nghĩa đen và chẳng khớp gì.</span></div>
  <div class="kv"><span class="k">Nối map là cách bạn dựng mọi thứ phức tạp</span><span class="v">Một <code>map</code> CHUẨN HOÁ, cái tiếp theo PHÂN LOẠI, cái thứ ba QUYẾT ĐỊNH. Mỗi cái là một bảng phẳng mà bạn đọc được một cách độc lập, và đó là một câu chuyện bảo trì rất khác so với các điều kiện lồng nhau.</span></div>
  <div class="kv"><span class="k">include kéo cái bảng ra khỏi file cấu hình</span><span class="v"><code>map \$request_uri \$dich { include /etc/nginx/chuyen-huong.map; }</code> với mỗi dòng một cặp <code>khoa gia-tri;</code>. Một bảng chuyển hướng nghìn dòng khi đó sống trong file của riêng nó, và một người không rành Nginx cũng sửa được.</span></div>
  <div class="kv"><span class="k">volatile TẮT việc nhớ lại kết quả</span><span class="v">Mặc định giá trị được tính MỘT lần cho mỗi request. Nếu đầu vào có thể ĐỔI giữa chừng — sau một cú chuyển hướng nội bộ làm đổi <code>\$uri</code> — thì thêm <code>volatile;</code> để nó được tính lại. Hiếm khi cần, và rất khó hiểu khi nó chính là mảnh ghép còn thiếu.</span></div>
</div>

<h3>Phép AND mà Nginx không có</h3>
<div class="out">map "$arg_a:$arg_b" $ca_hai {
  default        "khong";
  "~^co:co$"     "CA HAI deu co";
}

  ?a=co&b=co     -> CA HAI deu co
  ?a=co&b=khong  -> khong
  ?a=khong&b=co  -> khong</div>
<div class="pitfall">
<p><strong>Bẫy — KHÔNG có <code>&amp;&amp;</code>, và cái người ta với tới đầu tiên là <code>if</code> lồng nhau, thứ thậm chí còn không HỢP LỆ.</strong> Cách viết chuẩn mực là dựng MỘT chuỗi từ những biến bạn quan tâm rồi đem một mẫu ra khớp với nó, như ở trên. Cái DẤU NGĂN rất quan trọng: hãy dùng một ký tự KHÔNG THỂ xuất hiện trong hai giá trị kia, không thì <code>a=</code>"<code>x:y</code>" với <code>b=</code>"<code>z</code>" sẽ đụng nhau với <code>a=</code>"<code>x</code>" và <code>b=</code>"<code>y:z</code>". Dấu hai chấm thì ổn với các cờ và SAI với chuỗi do người dùng nhập — với những cái đó thì một ký tự như <code>\\x1f</code> vốn không thể có trong URL mới là lựa chọn an toàn. Đây là chỗ DUY NHẤT mà cách dùng <code>map</code> thật sự khó đọc hơn một câu điều kiện, và nó vẫn tốt hơn cái thay thế.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Ba khuôn mẫu map dùng được ngay</span>

<span class="tok-comment"># 1) Bật/tắt theo tên miền — không có if nào</span>
map \$http_host \$moi_truong {
  default        "san-xuat";
  "~^thu-nghiem" "thu-nghiem";
}
add_header X-Moi-Truong \$moi_truong always;

<span class="tok-comment"># 2) Bảng chuyển hướng, để trong file riêng</span>
map \$request_uri \$dich_cu {
  include /etc/nginx/chuyen-huong.map;   <span class="tok-comment"># "/cu/a  /moi/a;" mỗi dòng một cặp</span>
}
if (\$dich_cu) { return 301 \$dich_cu; }   <span class="tok-comment"># if + return: hợp lệ (8.2)</span>

<span class="tok-comment"># 3) Miễn trừ giới hạn tần suất cho nội bộ</span>
map \$binary_remote_addr \$khoa_gioi_han {
  default              \$binary_remote_addr;
  "~^\\\\x7f"            "";                <span class="tok-comment"># rỗng = KHÔNG áp giới hạn</span>
}
limit_req_zone \$khoa_gioi_han zone=chung:10m rate=20r/s;</code></pre>
<div class="note-ct">
<p><strong>Cú chuyển dịch trong đầu đáng làm.</strong> Cấu hình Nginx là KHAI BÁO, và <code>map</code> là cách khai báo để diễn đạt một quyết định: một cái BẢNG từ đầu vào tới đầu ra, tính khi cần, không ảnh hưởng tới thứ gì khác. <code>if</code> là cách MỆNH LỆNH, và nó KHÔNG vừa — đó là lý do nó tạo ra một location lồng và là lý do phép dò thứ ba của Bài 8.2 trả về <code>404</code>. Mỗi lần bắt gặp mình đang muốn một câu điều kiện, hãy viết cái bảng thay vào; sau vài lần thì cái bảng bắt đầu thấy như dạng TỰ NHIÊN.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Bốn kiểu khoá, <code>hostnames</code>, một map đọc map khác, khoá ghép với một vụ đụng dấu ngăn, và một bảng chuyển hướng trong tệp riêng — trên nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># chuyen-huong.map</span>
/cu/gioi-thieu   /ve-chung-toi;
/cu/bang-gia     /gia;
/blog/2019/xin-chao  /tin/xin-chao;</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  map $arg_v $ket_qua {
    default          "MAC-DINH";
    "a"              "khop-chinh-xac-a";
    "~^so-(\\d+)$"    "regex-bat-duoc-$1";   <span class="tok-comment">  # ~  phân biệt hoa thường, nhóm bắt dùng được</span>
    "~*^HOA"         "regex-khong-phan-biet"; # ~* không phân biệt
  }
  map $http_host $nhom {
    hostnames;
    default    "khac";
    vidu.com   "chinh";
    *.vidu.com "con";
    vidu.*     "moi-duoi";
  }
  map $ket_qua $noi_tiep { default "khac"; "MAC-DINH" "day-la-mac-dinh"; "~^regex-" "day-la-regex"; } <span class="tok-comment">  # map đọc kết quả map khác</span>
  map "$arg_a:$arg_b" $ca_hai { default "khong"; "~^co:co$" "CA HAI deu co"; }
  map $request_uri $dich_cu { include chuyen-huong.map; }     <span class="tok-comment">  # bảng chuyển hướng trong tệp riêng</span>
  server {
    listen 8080;
    location /k/   { return 200 "?v=$arg_v -&gt; $ket_qua\\n"; }
    location /h/   { return 200 "Host: $http_host -&gt; $nhom\\n"; }
    location /n/   { return 200 "ket_qua=[$ket_qua] noi_tiep=[$noi_tiep]\\n"; }
    location /and/ { return 200 "a=$arg_a b=$arg_b -&gt; $ca_hai   (khoa ghep: [$arg_a:$arg_b])\\n"; }
    location /     { if ($dich_cu) { return 301 $dich_cu; }  return 200 "khong co trong bang: $request_uri\\n"; }
  }
}</code></pre>
<div class="out">$ for v in '' a so-42 HOA-abc hoa-abc gi-do; do curl -s "http://127.0.0.1:8080/k/?v=$v"; done
?v= -&gt; MAC-DINH
?v=a -&gt; khop-chinh-xac-a
?v=so-42 -&gt; regex-bat-duoc-42
?v=HOA-abc -&gt; regex-khong-phan-biet
?v=hoa-abc -&gt; regex-khong-phan-biet
?v=gi-do -&gt; MAC-DINH
$ for h in vidu.com api.vidu.com vidu.vn khac.com; do curl -s -H "Host: $h" http://127.0.0.1:8080/h/; done
Host: vidu.com -&gt; chinh
Host: api.vidu.com -&gt; con
Host: vidu.vn -&gt; moi-duoi
Host: khac.com -&gt; khac
$ curl -s 'http://127.0.0.1:8080/n/?v=so-42'
ket_qua=[regex-bat-duoc-42] noi_tiep=[day-la-regex]
$ for q in 'a=co&amp;b=co' 'a=co&amp;b=khong' 'a=khong&amp;b=co'; do curl -s "http://127.0.0.1:8080/and/?$q"; done
a=co b=co -&gt; CA HAI deu co   (khoa ghep: [co:co])
a=co b=khong -&gt; khong   (khoa ghep: [co:khong])
a=khong b=co -&gt; khong   (khoa ghep: [khong:co])
$ for q in 'a=x:y&amp;b=z' 'a=x&amp;b=y:z'; do curl -s "http://127.0.0.1:8080/and/?$q"; done
a=x:y b=z -&gt; khong   (khoa ghep: [x:y:z])
a=x b=y:z -&gt; khong   (khoa ghep: [x:y:z])
$ for u in /cu/gioi-thieu /cu/bang-gia /blog/2019/xin-chao /khac; do curl -s -o /dev/null -w "$u -&gt; %{http_code} %{redirect_url}\\n" http://127.0.0.1:8080$u; done
/cu/gioi-thieu -&gt; 301 http://127.0.0.1:8080/ve-chung-toi
/cu/bang-gia -&gt; 301 http://127.0.0.1:8080/gia
/blog/2019/xin-chao -&gt; 301 http://127.0.0.1:8080/tin/xin-chao
/khac -&gt; 200 </div>
<p>Nhóm bắt dùng được ở vế phải (<code>regex-bat-duoc-42</code>); <code>~*</code> khớp cả hai kiểu chữ. <code>hostnames</code> khớp <code>*.vidu.com</code> và <code>vidu.*</code> theo từng nhãn. MỚI: <code>a=x:y&amp;b=z</code> và <code>a=x&amp;b=y:z</code> dựng ra CÙNG một khoá <code>x:y:z</code> — hãy chọn dấu ngăn không thể có trong giá trị. Tệp bảng cho ba cú 301, và một đường dẫn lạ đi qua nguyên vẹn.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/dsa-interview/learn?lessonSlug=dsa-1-1-hash-map" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">DSA Interview · 1.1 — Hash map và set</span><span class="lc-sub">Vì sao khoá chính xác chỉ tốn một lần tra dù có bao nhiêu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-3-3-grep-regex" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 3.3 — grep, và vừa đủ biểu thức chính quy</span><span class="lc-sub">Phần khoá regex</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>map</code></span><span class="v">Khai báo "cho biến này thì sinh ra biến kia"; sống ở tầng <code>http</code>.</span></div>
  <div class="kv"><span class="k"><code>default</code></span><span class="v">Vớt hết phần còn lại, kể cả chuỗi rỗng.</span></div>
  <div class="kv"><span class="k">exact vs regex keys</span><span class="v">Khoá chính xác là một phép tra băm; khoá regex (<code>~</code>, <code>~*</code>) được thử theo thứ tự sau đó.</span></div>
  <div class="kv"><span class="k"><code>hostnames</code></span><span class="v">Bật khớp ký tự đại diện <code>*.ten</code> và <code>ten.*</code>, như <code>server_name</code>.</span></div>
  <div class="kv"><span class="k">chaining</span><span class="v">Một <code>map</code> đọc được kết quả của map khác để dựng quyết định phức tạp từ các bảng phẳng.</span></div>
  <div class="kv"><span class="k"><code>volatile</code></span><span class="v">Tắt việc nhớ kết quả theo từng request, buộc tính lại.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một <code>map</code> là một phép tra ở tầng <code>http</code>, tính lười, từ một biến sang biến khác, không tốn gì tới khi được đọc.</li><li>Khoá chính xác là một thao tác băm (bảng nghìn dòng nhanh ngang ba dòng); khoá regex đi sau theo thứ tự.</li><li>Một <code>default</code> vắng hoặc rỗng thường là thứ bạn muốn — giá trị rỗng tắt <code>add_header</code> hay <code>limit_req</code>.</li><li><code>hostnames</code> bật khớp host dạng đại diện; <code>include</code> kéo một bảng lớn ra file riêng.</li><li>Không có <code>&amp;&amp;</code>; hãy dựng một chuỗi khoá ghép rồi khớp một mẫu với nó, với một dấu ngăn an toàn.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — module map</span><span class="lc-sub">nginx.org · hostnames, volatile, include và thứ tự khớp</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — các biến dựng sẵn</span><span class="lc-sub">nginx.org · Mọi thứ một map nhận làm đầu vào, gom trong một danh sách</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_geo_module.html" target="_blank" rel="noopener"><span class="lc-ico">🌍</span><span class="lc-body"><span class="lc-title">nginx — module geo</span><span class="lc-sub">nginx.org · Cùng ý tưởng nhưng khoá theo dải IP, cho danh sách cho phép và luật theo mạng</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Kiểu Record làm bảng điều phối, cùng khuôn mẫu nhưng có bộ kiểm kiểu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng một map bốn khoá, nối thêm một cái thứ hai, rồi diễn đạt một phép AND</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — return, error_page, and the blocks nobody can reach|||8.4 — return, error_page, và những khối không ai gọi tới được',
      slug: 'nginx-8-4-return-error-page',
      type: 'LESSON',
      description: 'Ba dạng của error_page cho ra ba mã trạng thái khác nhau từ cùng một trang lỗi — 404, 200 và 200 — và khác biệt là một dấu bằng. Kèm hai loại khối chỉ chạm tới được từ BÊN TRONG, và cái chỉ thị một chữ bịt lối vào từ ngoài.',
      content: `
${G08_4}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>return, error_page, and the blocks nobody can reach</h2>
<p class="lead">Not every response comes from a file or an upstream. Some are produced by the config itself, and the directives that do it have exact behaviours that a quick reading gets wrong — starting with a status code that depends on an equals sign.</p>

<h3>error_page, three spellings</h3>
<div class="out">location /loi-giu/ { error_page 404      /trang-loi; return 404; }
location /loi-doi/ { error_page 404 =    /trang-loi; return 404; }
location /loi-200/ { error_page 404 =200 /trang-loi; return 404; }

  /loi-giu/  -> ma=404   TRANG LOI: uri=[/trang-loi]
  /loi-doi/  -> ma=200   TRANG LOI: uri=[/trang-loi]
  /loi-200/  -> ma=200   TRANG LOI: uri=[/trang-loi]
               ^^^^^^ CUNG mot trang, BA mac dinh, hai ma khac nhau</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No equals sign keeps the original status</span><span class="lz-d">The client gets <code>404</code> with your page as the body. This is what you want for a real error page: the status is honest, and search engines and clients treat it as a genuine miss.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A bare equals takes the status from the handler</span><span class="lz-d">The handling location returned <code>200</code>, so the client got <code>200</code> — a soft 404. Occasionally correct, when a "not found" is really a valid empty result. Usually a mistake that gets missing pages indexed.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">=NNN sets the status explicitly</span><span class="lz-d"><code>=200</code>, <code>=301</code>, whatever you name. This is the form to reach for when you deliberately want the status to differ from what triggered the page — <code>error_page 403 =404 /404.html;</code> hides the existence of something.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The error page goes through location matching</span><span class="lz-d">It is an internal redirect (Lesson 2.5), so <code>\$uri</code> becomes the error page's path and a different block handles it — which is why <code>/trang-loi</code> printed its own <code>\$uri</code> rather than the original one.</span></div>
</div>

<h3>Blocks reachable only from inside</h3>
<div class="out">location /noi-bo { internal; return 200 "noi bo"; }

  goi THANG /noi-bo                -> 404
  qua error_page tu /thu-noi-bo/   -> 200  "noi bo"

location /goi-ten/ { try_files /khong-co-dau @du-phong; }
location @du-phong { return 200 "DA VAO @du-phong: uri=[$uri]"; }

  /goi-ten/x -> 200  DA VAO @du-phong: uri=[/goi-ten/x]
                                             ^^^^^^^^^ $uri KHONG doi</div>
<div class="kv-grid">
  <div class="kv"><span class="k">internal turns a direct request into 404</span><span class="v">Measured. The block still answers internal redirects — <code>error_page</code>, <code>try_files</code>, <code>X-Accel-Redirect</code>, a <code>rewrite ... last</code>. It is the right guard on anything that should only be reachable from your own config, and it costs one word.</span></div>
  <div class="kv"><span class="k">A named location does not change $uri</span><span class="v">Falling into <code>@du-phong</code> left <code>\$uri</code> as <code>/goi-ten/x</code>. That is the point: the fallback can still see what was originally asked for, which a path-based fallback would have overwritten.</span></div>
  <div class="kv"><span class="k">Named locations have no URL at all</span><span class="v">There is no path that maps to <code>@du-phong</code> — the <code>@</code> is not a URL character in this sense, so a request for <code>/@du-phong</code> is just an ordinary path that lands wherever ordinary matching sends it. They exist purely as targets for <code>try_files</code>, <code>error_page</code> and <code>proxy_next_upstream</code>.</span></div>
  <div class="kv"><span class="k">X-Accel-Redirect is the pattern these enable</span><span class="v">Your application checks permission, then returns an empty response with <code>X-Accel-Redirect: /tep-rieng/abc.pdf</code>. Nginx serves the file from an <code>internal</code> location — the application never streams bytes, and the file has no public URL. This is the correct way to serve authorised downloads.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Private files: the app checks permission, Nginx ships the bytes</span>
location /tep-rieng/ {
  internal;                       <span class="tok-comment"># called directly -> 404</span>
  alias /srv/rieng-tu/;
}
<span class="tok-comment"># The app returns: X-Accel-Redirect: /private-files/contract.pdf</span>

<span class="tok-comment"># Error pages: keep the right status, and do not expose the page itself</span>
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;
location = /404.html { internal; root /srv/loi; }
location = /50x.html { internal; root /srv/loi; }

<span class="tok-comment"># For an API the error page must be JSON, not HTML (Lesson 7.4)</span>
error_page 404 = @json_404;
location @json_404 {
  default_type application/json;
  return 404 '{"loi":"khong tim thay"}';
}</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>error_page 404 = @xu-ly;</code> with a bare equals takes the status from the handler, so a JSON error handler that ends in <code>return 404</code> is fine but one that ends in <code>return 200</code> silently turns every miss into a success.</strong> The block above works because the named location itself returns <code>404</code>. Write the same thing with <code>return 200 '{"loi":"..."}'</code> and every 404 on your API becomes a <code>200</code> with an error body — which client libraries will not treat as an error, so failures become silent empty results. If you want the handler's status, say so with the bare <code>=</code> deliberately; if you want the original, leave the <code>=</code> out entirely. Half the confusion around <code>error_page</code> is that both forms look like a typo for the other.</p>
</div>

<h3>return, and when it is enough</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">return CODE — the cheapest possible response</span><span class="lz-lnote"><code>return 204;</code> for a beacon endpoint, <code>return 444;</code> to close without answering (Lesson 1.3), <code>return 403;</code> for a blocked path. No file, no upstream, no work.</span></div>
  <div class="lz-layer"><span class="lz-lname">return CODE "text" — an inline body</span><span class="lz-lnote">Variables are interpolated, so <code>return 200 "\$remote_addr\\n";</code> is a working echo endpoint in one line. Set <code>default_type</code> alongside it or the body is announced as <code>text/plain</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">return CODE URL — a redirect</span><span class="lz-lnote">With a <code>3xx</code> code and a URL, this is the redirect form. Prefer it over <code>rewrite ... permanent</code> for fixed destinations: it is clearer, cheaper, and cannot be misread as an internal rewrite.</span></div>
  <div class="lz-layer"><span class="lz-lname">A health endpoint should be a return</span><span class="lz-lnote"><code>location = /health { access_log off; return 200 "ok\\n"; }</code>. It never touches your application, so it stays up while the application is restarting — which is either exactly what you want from a liveness probe or exactly what you do not, so decide which one this endpoint is.</span></div>
</div>
<div class="note-ct">
<p><strong>The pattern these four directives share.</strong> <code>return</code>, <code>error_page</code>, <code>internal</code> and named locations are all ways to answer a request without leaving Nginx, and every one of them interacts with the internal-redirect machinery from Lesson 2.5. When one of them behaves oddly, the first question is which block ended up handling the request and what <code>\$uri</code> was by then — and a temporary <code>return 200 "\$uri"</code> in each candidate block answers it faster than reading the chain.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>The three <code>error_page</code> spellings, <code>internal</code>, a named fallback, the bare-<code>=</code> JSON trap, X-Accel-Redirect with a tiny app that checks access, and three kinds of <code>return</code> — on nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># kiem-quyen.js</span>
// upstream (cổng 9801): ?ok=1 ⇒ thân RỖNG + X-Accel-Redirect (nginx gửi tệp); không ⇒ 403
require('http').createServer((req, res) =&gt; {
  if (req.url.includes('ok=1')) { res.writeHead(200, { 'X-Accel-Redirect': '/tep-rieng/hop-dong.pdf' }); return res.end(); }
  res.writeHead(403); res.end('khong co quyen\\n');
}).listen(9801, '127.0.0.1');</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {
    listen 8080;
    location = /trang-loi { return 200 "TRANG LOI: uri=[$uri]\\n"; }
    location /loi-giu/ { error_page 404      /trang-loi; return 404; } <span class="tok-comment">  # không dấu =</span>
    location /loi-doi/ { error_page 404 =    /trang-loi; return 404; } <span class="tok-comment">  # dấu = trần</span>
    location /loi-200/ { error_page 404 =200 /trang-loi; return 404; } <span class="tok-comment">  # =200 tường minh</span>
    location /noi-bo   { internal; return 200 "noi bo\\n"; }
    location /thu-noi-bo/ { error_page 404 = /noi-bo; return 404; }
    location /goi-ten/ { try_files /khong-co-dau @du-phong; }
    location @du-phong { return 200 "DA VAO @du-phong: uri=[$uri]\\n"; }
    location /api-dung/ { error_page 404 = @json_404;  return 404; }
    location @json_404  { default_type application/json; return 404 '{"loi":"khong tim thay"}\\n'; }
    location /api-sai/  { error_page 404 = @json_sai;  return 404; }
    location @json_sai  { default_type application/json; return 200 '{"loi":"khong tim thay"}\\n'; } <span class="tok-comment">  # BẪY</span>
    location /tai/      { proxy_pass http://127.0.0.1:9801; }             <span class="tok-comment">  # ứng dụng kiểm quyền</span>
    location /tep-rieng/ { internal; alias /srv/rieng-tu/; }
    location = /ghi     { return 204; }
    location = /ip      { return 200 "$remote_addr\\n"; }
    location = /health  { access_log off; return 200 "ok\\n"; }
  }
}</code></pre>
<div class="out">$ for p in loi-giu loi-doi loi-200; do printf '/%s/ -&gt; ma=' $p; curl -s -w '%{http_code}' -o /tmp/than "http://127.0.0.1:8080/$p/x"; printf '   %s' "$(cat /tmp/than)"; echo; done
/loi-giu/ -&gt; ma=404   TRANG LOI: uri=[/trang-loi]
/loi-doi/ -&gt; ma=200   TRANG LOI: uri=[/trang-loi]
/loi-200/ -&gt; ma=200   TRANG LOI: uri=[/trang-loi]
$ printf 'goi THANG /noi-bo              -&gt; '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/noi-bo
goi THANG /noi-bo              -&gt; 404
$ printf 'qua error_page tu /thu-noi-bo/ -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/thu-noi-bo/x; cat /tmp/than
qua error_page tu /thu-noi-bo/ -&gt; 200  noi bo
$ printf '/goi-ten/x -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/goi-ten/x; cat /tmp/than
/goi-ten/x -&gt; 200  DA VAO @du-phong: uri=[/goi-ten/x]
$ for p in api-dung api-sai; do printf '/%s/x -&gt; ma=' $p; curl -s -w '%{http_code}' -o /tmp/than "http://127.0.0.1:8080/$p/x"; printf '   %s' "$(cat /tmp/than)"; echo; done
/api-dung/x -&gt; ma=404   {"loi":"khong tim thay"}
/api-sai/x -&gt; ma=200   {"loi":"khong tim thay"}
$ printf 'KHONG quyen         -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong'; cat /tmp/than
KHONG quyen         -&gt; 403  khong co quyen
$ printf 'CO quyen (?ok=1)    -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong?ok=1'; cat /tmp/than
CO quyen (?ok=1)    -&gt; 200  NOI DUNG HOP DONG (tep rieng tu)
$ printf 'goi THANG /tep-rieng/hop-dong.pdf -&gt; '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/tep-rieng/hop-dong.pdf
goi THANG /tep-rieng/hop-dong.pdf -&gt; 404
$ for p in ghi ip health; do printf '/%-7s -&gt; ' $p; curl -s -w '%{http_code} %{content_type}  ' -o /tmp/than http://127.0.0.1:8080/$p; cat /tmp/than; echo; done
/ghi     -&gt; 204   
/ip      -&gt; 200 text/plain  127.0.0.1

/health  -&gt; 200 text/plain  ok</div>
<p>No <code>=</code> kept 404; bare <code>=</code> and <code>=200</code> gave 200. <code>internal</code>: 404 directly, 200 through <code>error_page</code>. The named location still saw <code>/goi-ten/x</code>. A JSON handler returning 404 behind bare <code>=</code> gave 404 — the same handler returning 200 turned the miss into 200. X-Accel-Redirect: 403 without access, 200 + the file with it, 404 when the private path is called directly.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/seo-analytics/learn?lessonSlug=seo-1-3-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">SEO &amp; Analytics · 1.3 — Status codes, redirects and soft 404s</span><span class="lc-sub">What a bare = does to search engines</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage and presigned URLs</span><span class="lc-sub">The other way to hand out private files</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>return</code></span><span class="v">Answer from the config alone: a code, a code with text, or a <code>3xx</code> with a URL.</span></div>
  <div class="kv"><span class="k"><code>error_page</code></span><span class="v">Maps a status to a page; the equals sign decides the final status.</span></div>
  <div class="kv"><span class="k">bare <code>=</code></span><span class="v">Takes the status from the handler (a soft 404); <code>=NNN</code> sets it explicitly; no <code>=</code> keeps the original.</span></div>
  <div class="kv"><span class="k"><code>internal</code></span><span class="v">Makes a location reachable only by internal redirects; a direct request gets <code>404</code>.</span></div>
  <div class="kv"><span class="k">named location (<code>@name</code>)</span><span class="v">A target for <code>try_files</code>/<code>error_page</code> with no URL of its own; does not change <code>\$uri</code>.</span></div>
  <div class="kv"><span class="k"><code>X-Accel-Redirect</code></span><span class="v">The app checks permission, then nginx serves the file from an <code>internal</code> location.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li><code>return</code> answers without a file or upstream: code, code+text, or <code>3xx</code>+URL (prefer it for fixed redirects).</li><li><code>error_page</code>'s equals sign is load-bearing: no <code>=</code> keeps the status, bare <code>=</code> takes the handler's, <code>=NNN</code> sets it.</li><li>A JSON error handler ending in <code>return 200</code> silently turns every <code>404</code> into a success — use <code>return 404</code>.</li><li><code>internal</code> guards blocks so they answer only internal redirects; named <code>@locations</code> have no URL and keep <code>\$uri</code>.</li><li><code>X-Accel-Redirect</code> is the correct way to serve authorised files without streaming them through the app.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — error_page and internal</span><span class="lc-sub">nginx.org · The three forms and exactly what each does to the status</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — return</span><span class="lc-sub">nginx.org · Code, code with text, and code with URL</span></span></a>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/examples/xsendfile/" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — X-Accel-Redirect</span><span class="lc-sub">nginx.com · Serving authorised files without streaming them through your app</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Authorising a download, and why the file must not have a public URL</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Serve the same error page three ways and watch the status code change</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>return, error_page, và những khối không ai gọi tới được</h2>
<p class="lead">Không phải phản hồi nào cũng tới từ một tệp hay một upstream. Có những cái do CHÍNH cấu hình sinh ra, và những chỉ thị làm việc đó có hành vi chính xác mà đọc lướt thì hiểu sai — bắt đầu bằng một mã trạng thái phụ thuộc vào MỘT dấu bằng.</p>

<h3>error_page, ba cách viết</h3>
<div class="out">location /loi-giu/ { error_page 404      /trang-loi; return 404; }
location /loi-doi/ { error_page 404 =    /trang-loi; return 404; }
location /loi-200/ { error_page 404 =200 /trang-loi; return 404; }

  /loi-giu/  -> ma=404   TRANG LOI: uri=[/trang-loi]
  /loi-doi/  -> ma=200   TRANG LOI: uri=[/trang-loi]
  /loi-200/  -> ma=200   TRANG LOI: uri=[/trang-loi]
               ^^^^^^ CUNG mot trang, BA cach viet, hai ma khac nhau</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">KHÔNG có dấu bằng thì GIỮ nguyên mã gốc</span><span class="lz-d">Client nhận <code>404</code> với trang của bạn làm thân. Đó là thứ bạn muốn cho một trang lỗi THẬT: mã trạng thái thật thà, và máy tìm kiếm lẫn client đều coi đó là một cú trượt đúng nghĩa.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một dấu bằng TRẦN thì lấy mã của BỘ XỬ LÝ</span><span class="lz-d">Cái location xử lý trả về <code>200</code>, nên client nhận <code>200</code> — một cú 404-mềm. Thỉnh thoảng thì đúng, khi "không tìm thấy" thật sự là một kết quả rỗng hợp lệ. Thường thì đó là một lỗi khiến những trang không tồn tại bị đem đi lập chỉ mục.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">=NNN đặt mã một cách TƯỜNG MINH</span><span class="lz-d"><code>=200</code>, <code>=301</code>, bạn gọi tên cái nào cũng được. Đây là dạng nên với tới khi bạn CHỦ ĐỘNG muốn mã khác với thứ đã kích hoạt trang lỗi — <code>error_page 403 =404 /404.html;</code> giấu đi sự tồn tại của một thứ gì đó.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trang lỗi ĐI QUA phép khớp location</span><span class="lz-d">Nó là một cú chuyển hướng nội bộ (Bài 2.5), nên <code>\$uri</code> thành đường dẫn của trang lỗi và một khối KHÁC xử lý nó — đó là lý do <code>/trang-loi</code> in ra <code>\$uri</code> của chính nó chứ không phải cái ban đầu.</span></div>
</div>

<h3>Những khối chỉ chạm tới được từ BÊN TRONG</h3>
<div class="out">location /noi-bo { internal; return 200 "noi bo"; }

  goi THANG /noi-bo                -> 404
  qua error_page tu /thu-noi-bo/   -> 200  "noi bo"

location /goi-ten/ { try_files /khong-co-dau @du-phong; }
location @du-phong { return 200 "DA VAO @du-phong: uri=[$uri]"; }

  /goi-ten/x -> 200  DA VAO @du-phong: uri=[/goi-ten/x]
                                             ^^^^^^^^^ $uri KHONG doi</div>
<div class="kv-grid">
  <div class="kv"><span class="k">internal biến một request gọi thẳng thành 404</span><span class="v">Đo được. Cái khối vẫn trả lời các cú chuyển hướng NỘI BỘ — <code>error_page</code>, <code>try_files</code>, <code>X-Accel-Redirect</code>, một lệnh <code>rewrite ... last</code>. Nó là cái chốt ĐÚNG cho mọi thứ chỉ nên chạm tới được từ cấu hình của chính bạn, và nó tốn một chữ.</span></div>
  <div class="kv"><span class="k">Một named location KHÔNG làm đổi $uri</span><span class="v">Rơi vào <code>@du-phong</code> mà <code>\$uri</code> vẫn là <code>/goi-ten/x</code>. Đó chính là ĐIỂM: cái dự phòng vẫn nhìn thấy được thứ ban đầu được hỏi, trong khi một dự phòng theo đường dẫn thì đã ghi đè mất.</span></div>
  <div class="kv"><span class="k">Named location KHÔNG có URL nào cả</span><span class="v">Không có đường dẫn nào ánh xạ tới <code>@du-phong</code> — dấu <code>@</code> ở đây không phải một ký tự URL theo nghĩa đó, nên một request tới <code>/@du-phong</code> chỉ là một đường dẫn bình thường và rơi vào bất cứ đâu mà phép khớp bình thường đưa nó tới. Chúng tồn tại thuần tuý làm ĐÍCH cho <code>try_files</code>, <code>error_page</code> và <code>proxy_next_upstream</code>.</span></div>
  <div class="kv"><span class="k">X-Accel-Redirect là khuôn mẫu mà chúng mở đường cho</span><span class="v">Ứng dụng của bạn kiểm quyền, rồi trả về một phản hồi RỖNG kèm <code>X-Accel-Redirect: /tep-rieng/abc.pdf</code>. Nginx phục vụ tệp từ một location <code>internal</code> — ứng dụng KHÔNG BAO GIỜ phải chảy byte, và cái tệp không có URL công khai nào. Đây là cách ĐÚNG để phục vụ tệp tải xuống có phân quyền.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Tệp riêng tư: ứng dụng kiểm quyền, Nginx gửi byte</span>
location /tep-rieng/ {
  internal;                       <span class="tok-comment"># gọi thẳng -> 404</span>
  alias /srv/rieng-tu/;
}
<span class="tok-comment"># Ứng dụng trả: X-Accel-Redirect: /tep-rieng/hop-dong.pdf</span>

<span class="tok-comment"># Trang lỗi: giữ đúng mã, và đừng để lộ trang lỗi ra ngoài</span>
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;
location = /404.html { internal; root /srv/loi; }
location = /50x.html { internal; root /srv/loi; }

<span class="tok-comment"># API thì trang lỗi phải là JSON, không phải HTML (Bài 7.4)</span>
error_page 404 = @json_404;
location @json_404 {
  default_type application/json;
  return 404 '{"loi":"khong tim thay"}';
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>error_page 404 = @xu-ly;</code> với dấu bằng TRẦN thì lấy mã của BỘ XỬ LÝ, nên một handler JSON kết thúc bằng <code>return 404</code> thì ổn còn một cái kết thúc bằng <code>return 200</code> sẽ ÂM THẦM biến mọi cú trượt thành một cú thành công.</strong> Cái khối ở trên chạy đúng vì chính cái named location trả về <code>404</code>. Viết y hệt thế nhưng với <code>return 200 '{"loi":"..."}'</code> thì MỌI cú 404 trên API của bạn thành <code>200</code> kèm một cái thân báo lỗi — thứ mà thư viện client sẽ KHÔNG coi là lỗi, nên các thất bại trở thành những kết quả rỗng câm lặng. Nếu bạn MUỐN lấy mã của handler thì hãy nói ra bằng dấu <code>=</code> trần một cách có chủ ý; còn nếu muốn giữ mã gốc thì bỏ hẳn dấu <code>=</code> đi. Một nửa sự rối rắm quanh <code>error_page</code> là vì cả hai dạng đều trông như một lỗi gõ nhầm của dạng kia.</p>
</div>

<h3>return, và khi nào nó là đủ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">return MÃ — phản hồi rẻ nhất có thể</span><span class="lz-lnote"><code>return 204;</code> cho một điểm cuối ghi nhận, <code>return 444;</code> để đóng mà không trả lời (Bài 1.3), <code>return 403;</code> cho một đường dẫn bị chặn. Không tệp, không upstream, không việc gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">return MÃ "chữ" — một cái thân viết thẳng</span><span class="lz-lnote">Biến được nội suy, nên <code>return 200 "\$remote_addr\\n";</code> là một điểm cuối vọng lại chạy được, viết trong một dòng. Hãy đặt <code>default_type</code> đi kèm, không thì cái thân bị công bố là <code>text/plain</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">return MÃ URL — một cú chuyển hướng</span><span class="lz-lnote">Với một mã <code>3xx</code> và một URL thì đây là dạng chuyển hướng. Hãy ưu tiên nó hơn <code>rewrite ... permanent</code> với những đích CỐ ĐỊNH: nó rõ hơn, rẻ hơn, và không thể bị đọc nhầm thành một phép viết lại nội bộ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Điểm cuối health nên là một cái return</span><span class="lz-lnote"><code>location = /health { access_log off; return 200 "ok\\n"; }</code>. Nó KHÔNG hề chạm tới ứng dụng của bạn, nên nó vẫn sống trong lúc ứng dụng đang khởi động lại — mà đó hoặc là ĐÚNG cái bạn muốn từ một phép dò sống-chết, hoặc là ĐÚNG cái bạn không muốn, nên hãy quyết xem cái điểm cuối này là loại nào.</span></div>
</div>
<div class="note-ct">
<p><strong>Khuôn mẫu chung của bốn chỉ thị này.</strong> <code>return</code>, <code>error_page</code>, <code>internal</code> và named location đều là những cách trả lời một request mà KHÔNG rời khỏi Nginx, và cái nào cũng tương tác với bộ máy chuyển-hướng-nội-bộ ở Bài 2.5. Khi một cái trong số đó cư xử lạ thì câu hỏi ĐẦU TIÊN là rốt cuộc KHỐI NÀO đã xử lý request và lúc đó <code>\$uri</code> là gì — và một dòng <code>return 200 "\$uri"</code> tạm thời đặt vào từng khối ứng viên trả lời nhanh hơn là ngồi đọc cả cái chuỗi.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Ba cách viết <code>error_page</code>, <code>internal</code>, một named location dự phòng, bẫy <code>=</code> trần với JSON, X-Accel-Redirect với một ứng dụng nhỏ kiểm quyền, và ba kiểu <code>return</code> — trên nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># kiem-quyen.js</span>
// upstream (cổng 9801): ?ok=1 ⇒ thân RỖNG + X-Accel-Redirect (nginx gửi tệp); không ⇒ 403
require('http').createServer((req, res) =&gt; {
  if (req.url.includes('ok=1')) { res.writeHead(200, { 'X-Accel-Redirect': '/tep-rieng/hop-dong.pdf' }); return res.end(); }
  res.writeHead(403); res.end('khong co quyen\\n');
}).listen(9801, '127.0.0.1');</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {
    listen 8080;
    location = /trang-loi { return 200 "TRANG LOI: uri=[$uri]\\n"; }
    location /loi-giu/ { error_page 404      /trang-loi; return 404; } <span class="tok-comment">  # không dấu =</span>
    location /loi-doi/ { error_page 404 =    /trang-loi; return 404; } <span class="tok-comment">  # dấu = trần</span>
    location /loi-200/ { error_page 404 =200 /trang-loi; return 404; } <span class="tok-comment">  # =200 tường minh</span>
    location /noi-bo   { internal; return 200 "noi bo\\n"; }
    location /thu-noi-bo/ { error_page 404 = /noi-bo; return 404; }
    location /goi-ten/ { try_files /khong-co-dau @du-phong; }
    location @du-phong { return 200 "DA VAO @du-phong: uri=[$uri]\\n"; }
    location /api-dung/ { error_page 404 = @json_404;  return 404; }
    location @json_404  { default_type application/json; return 404 '{"loi":"khong tim thay"}\\n'; }
    location /api-sai/  { error_page 404 = @json_sai;  return 404; }
    location @json_sai  { default_type application/json; return 200 '{"loi":"khong tim thay"}\\n'; } <span class="tok-comment">  # BẪY</span>
    location /tai/      { proxy_pass http://127.0.0.1:9801; }             <span class="tok-comment">  # ứng dụng kiểm quyền</span>
    location /tep-rieng/ { internal; alias /srv/rieng-tu/; }
    location = /ghi     { return 204; }
    location = /ip      { return 200 "$remote_addr\\n"; }
    location = /health  { access_log off; return 200 "ok\\n"; }
  }
}</code></pre>
<div class="out">$ for p in loi-giu loi-doi loi-200; do printf '/%s/ -&gt; ma=' $p; curl -s -w '%{http_code}' -o /tmp/than "http://127.0.0.1:8080/$p/x"; printf '   %s' "$(cat /tmp/than)"; echo; done
/loi-giu/ -&gt; ma=404   TRANG LOI: uri=[/trang-loi]
/loi-doi/ -&gt; ma=200   TRANG LOI: uri=[/trang-loi]
/loi-200/ -&gt; ma=200   TRANG LOI: uri=[/trang-loi]
$ printf 'goi THANG /noi-bo              -&gt; '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/noi-bo
goi THANG /noi-bo              -&gt; 404
$ printf 'qua error_page tu /thu-noi-bo/ -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/thu-noi-bo/x; cat /tmp/than
qua error_page tu /thu-noi-bo/ -&gt; 200  noi bo
$ printf '/goi-ten/x -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/goi-ten/x; cat /tmp/than
/goi-ten/x -&gt; 200  DA VAO @du-phong: uri=[/goi-ten/x]
$ for p in api-dung api-sai; do printf '/%s/x -&gt; ma=' $p; curl -s -w '%{http_code}' -o /tmp/than "http://127.0.0.1:8080/$p/x"; printf '   %s' "$(cat /tmp/than)"; echo; done
/api-dung/x -&gt; ma=404   {"loi":"khong tim thay"}
/api-sai/x -&gt; ma=200   {"loi":"khong tim thay"}
$ printf 'KHONG quyen         -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong'; cat /tmp/than
KHONG quyen         -&gt; 403  khong co quyen
$ printf 'CO quyen (?ok=1)    -&gt; '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong?ok=1'; cat /tmp/than
CO quyen (?ok=1)    -&gt; 200  NOI DUNG HOP DONG (tep rieng tu)
$ printf 'goi THANG /tep-rieng/hop-dong.pdf -&gt; '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/tep-rieng/hop-dong.pdf
goi THANG /tep-rieng/hop-dong.pdf -&gt; 404
$ for p in ghi ip health; do printf '/%-7s -&gt; ' $p; curl -s -w '%{http_code} %{content_type}  ' -o /tmp/than http://127.0.0.1:8080/$p; cat /tmp/than; echo; done
/ghi     -&gt; 204   
/ip      -&gt; 200 text/plain  127.0.0.1

/health  -&gt; 200 text/plain  ok</div>
<p>Không <code>=</code> thì giữ 404; <code>=</code> trần và <code>=200</code> ra 200. <code>internal</code>: gọi thẳng 404, qua <code>error_page</code> 200. Named location vẫn thấy <code>/goi-ten/x</code>. Handler JSON trả 404 sau <code>=</code> trần thì ra 404 — cùng handler đó trả 200 thì biến cú trượt thành 200. X-Accel-Redirect: không quyền 403, có quyền 200 kèm tệp, gọi thẳng đường dẫn riêng thì 404.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/seo-analytics/learn?lessonSlug=seo-1-3-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">SEO &amp; Analytics · 1.3 — Mã trạng thái, chuyển hướng và soft 404</span><span class="lc-sub">Dấu = trần gây gì cho máy tìm kiếm</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage và URL ký sẵn</span><span class="lc-sub">Cách còn lại để giao tệp riêng tư</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>return</code></span><span class="v">Trả lời chỉ bằng cấu hình: một mã, mã kèm chữ, hoặc <code>3xx</code> kèm URL.</span></div>
  <div class="kv"><span class="k"><code>error_page</code></span><span class="v">Ánh xạ một mã trạng thái tới một trang; cái dấu bằng quyết định mã cuối cùng.</span></div>
  <div class="kv"><span class="k">dấu <code>=</code> trần</span><span class="v">Lấy mã của bộ xử lý (một cú 404-mềm); <code>=NNN</code> đặt mã tường minh; không có <code>=</code> thì giữ mã gốc.</span></div>
  <div class="kv"><span class="k"><code>internal</code></span><span class="v">Làm một location chỉ chạm tới được qua chuyển hướng nội bộ; gọi thẳng thì nhận <code>404</code>.</span></div>
  <div class="kv"><span class="k">named location (<code>@ten</code>)</span><span class="v">Một đích cho <code>try_files</code>/<code>error_page</code>, không có URL riêng; không làm đổi <code>\$uri</code>.</span></div>
  <div class="kv"><span class="k"><code>X-Accel-Redirect</code></span><span class="v">Ứng dụng kiểm quyền, rồi nginx phục vụ tệp từ một location <code>internal</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>return</code> trả lời mà không cần tệp hay upstream: mã, mã+chữ, hoặc <code>3xx</code>+URL (ưu tiên cho chuyển hướng cố định).</li><li>Dấu bằng của <code>error_page</code> mang trọng lượng: không <code>=</code> giữ mã, <code>=</code> trần lấy mã handler, <code>=NNN</code> đặt mã.</li><li>Một handler lỗi JSON kết thúc bằng <code>return 200</code> âm thầm biến mọi <code>404</code> thành thành công — hãy dùng <code>return 404</code>.</li><li><code>internal</code> chốt các khối chỉ trả lời chuyển hướng nội bộ; named <code>@location</code> không có URL và giữ nguyên <code>\$uri</code>.</li><li><code>X-Accel-Redirect</code> là cách đúng để phục vụ tệp có phân quyền mà không chảy chúng qua ứng dụng.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — error_page và internal</span><span class="lc-sub">nginx.org · Ba dạng và chính xác mỗi dạng làm gì với mã trạng thái</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — return</span><span class="lc-sub">nginx.org · Mã, mã kèm chữ, và mã kèm URL</span></span></a>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/examples/xsendfile/" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — X-Accel-Redirect</span><span class="lc-sub">nginx.com · Phục vụ tệp có phân quyền mà không phải chảy chúng qua ứng dụng</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Phân quyền một lượt tải xuống, và vì sao cái tệp KHÔNG được có URL công khai</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Phục vụ cùng một trang lỗi theo ba cách và xem mã trạng thái đổi</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — A real URL migration, assembled and measured|||8.5 — Một cuộc chuyển đổi URL thật, ráp lại và đem đo',
      slug: 'nginx-8-5-chuyen-doi-url',
      type: 'LESSON',
      description: 'Đổi cấu trúc URL của cả một site mà không mất thứ hạng tìm kiếm và không mất người dùng cầm đường dẫn cũ. Bài này dựng cấu hình đó — ba cái map nối nhau và ĐÚNG MỘT chỗ thi hành — rồi bắn tám phép dò, và tìm ra một vòng lặp chuyển hướng mà Nginx KHÔNG chặn.',
      content: `
${G08_5}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>A real URL migration, assembled and measured</h2>
<p class="lead">Changing a site's URL structure means every old link in the world now points at nothing. The config that fixes that is the whole of this chapter working together, and it fits in about twenty lines.</p>

<h3>Three maps and one enforcement point</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) A 1-to-1 table in its own file (editable by someone who does not know Nginx)</span>
map \$uri \$dich_bang {
  default "";
  include /etc/nginx/chuyen-huong.map;    <span class="tok-comment"># "/gioi-thieu  /ve-chung-toi;"</span>
}

<span class="tok-comment"># 2) PATTERN rules — many URLs sharing one shape</span>
map \$uri \$dich_mau {
  default "";
  "~^/bai-viet/(\\\\d+)\$"               "/tin/\$1";
  "~^/danh-muc/(.+)/trang/(\\\\d+)\$"    "/c/\$1?trang=\$2";
}

<span class="tok-comment"># 3) Combined: the table wins, then the pattern</span>
map "\$dich_bang:\$dich_mau" \$dich {
  default      "";
  "~^([^:]+):" "\$1";        <span class="tok-comment"># in the table -> take the table</span>
  "~^:(.+)\$"   "\$1";        <span class="tok-comment"># not there -> take the pattern</span>
}

server {
  <span class="tok-comment"># 4) ONE single place enforces it. if + return: legitimate (Lesson 8.2)</span>
  if (\$dich) { return 301 \$dich; }
  ...
}</code></pre>
<div class="out">=== Bang 1-1 ===
/gioi-thieu             -> 301  Location: .../ve-chung-toi
/lien-he.html           -> 301  Location: .../lien-he
/san-pham/cu-1          -> 301  Location: .../san-pham/moi-1

=== Quy tac theo mau ===
/bai-viet/123           -> 301  Location: .../tin/123
/danh-muc/sach/trang/4  -> 301  Location: .../c/sach?trang=4

=== KHONG khop gi — di qua NGUYEN VEN ===
/moi                    -> 200  TRANG MOI
/tin/999                -> 200  TIN: uri=[/tin/999]
/khong-co-gi            -> 404  khong tim thay</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The table handles the one-offs</span><span class="lz-d">Pages that moved for reasons nothing else shares. Keeping it in an included file means it can grow to thousands of rows without touching the config, and the lookup stays a single hash operation (Lesson 8.3).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Patterns handle the structural change</span><span class="lz-d">Every article, every paginated category. One regex covers a million URLs, and the captures rebuild the new shape — including moving a path segment into a query parameter, measured in the last row.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A third map merges them with a defined precedence</span><span class="lz-d">The composite-key idiom from Lesson 8.3. The table wins when both match, which is what you want: a specific exception should override a general rule.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">One place enforces it, at server level</span><span class="lz-d">Not scattered through the locations. Every URL is checked once, and a URL that matches nothing has an empty <code>\$dich</code> and passes through untouched — measured in the last three rows.</span></div>
</div>

<h3>The probe that found a problem</h3>
<div class="out">Them vao bang: /rat-cu -> /gioi-thieu   (ma /gioi-thieu ĐÃ tro toi /ve-chung-toi)
                /vong-a -> /vong-b
                /vong-b -> /vong-a

  /rat-cu   khong theo: 301 -> /gioi-thieu
            CO theo -L : 200, so chang=2, cuoi=/ve-chung-toi     &lt;- CHUOI

  /vong-a   CO theo -L : 301, so chang=5, roi curl BO CUOC
            "qua nhieu chuyen huong"                             &lt;- VONG LAP</div>
<div class="pitfall">
<p><strong>Trap — the internal-redirect cycle limit from Lesson 2.5 does not protect you here, because these are <em>external</em> redirects.</strong> Each <code>301</code> ends the request; the loop only exists across separate requests from the client. Nginx sees two perfectly normal responses and has no way to know they form a cycle — no <code>500</code>, no error log line, nothing. The browser eventually gives up with "too many redirects" and the user sees a broken page. Chains are the milder version of the same thing: <code>/rat-cu</code> reached its destination in two hops, which works but costs an extra round trip and dilutes the search-engine signal that <code>301</code> is supposed to pass. Both are properties of the <em>table</em>, not the config, so the check belongs wherever the table is edited.</p>
</div>
<pre><code class="language-python"><span class="tok-comment"># The table checker — runs in CI, twelve lines</span>
cap = {}
for line in open('chuyen-huong.map'):
    p = line.strip().rstrip(';').split()
    if len(p) == 2: cap[p[0]] = p[1]

<span class="tok-comment"># Any TARGET that also appears as a KEY = a chain or a loop</span>
for k, v in cap.items():
    if v in cap:
        print(f'CHUOI: {k} -> {v} -> {cap[v]}')</code></pre>
<div class="out">so cap: 6
CHUOI: /rat-cu -> /gioi-thieu -> /ve-chung-toi
CHUOI: /vong-a -> /vong-b -> /vong-a
CHUOI: /vong-b -> /vong-a -> /vong-b</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Flatten chains at the source, do not chain redirects</span><span class="v"><code>/rat-cu</code> should point straight at <code>/ve-chung-toi</code>. The checker finds every case in one pass, and rewriting the table is mechanical — take the final destination of each chain and use it directly.</span></div>
  <div class="kv"><span class="k">301 is cached by browsers, sometimes forever</span><span class="v">A wrong <code>301</code> is very hard to take back: browsers remember it and will not re-ask. Deploy a migration with <code>302</code> for the first day, confirm the destinations from real traffic, then switch to <code>301</code>. That one precaution costs nothing and is the only protection against a typo in a table of a thousand rows.</span></div>
  <div class="kv"><span class="k">Keep the old URLs working, do not just delete them</span><span class="v">A <code>404</code> loses the link and the ranking; a <code>301</code> passes both to the new URL. The table is the cheapest way to keep every inbound link in the world working, and it costs one hash lookup per request.</span></div>
  <div class="kv"><span class="k">Log the redirect so you can retire the table</span><span class="v">With <code>\$dich</code> in the access log, you can see which old URLs are still being requested a year later. The ones with no traffic can be removed; the ones with traffic tell you which external site still links to you.</span></div>
</div>

<h3>The order to run a migration in</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Export the old URL list before you change anything</span><span class="lz-lnote">From the access log, the sitemap, or the database. You cannot build the table from URLs you no longer know about, and the log is the only record of what people actually request.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Write patterns first, table second</span><span class="lz-lnote">Most of a migration is structural. Cover the shapes with two or three regexes, then put only the genuine exceptions in the table — a table with a thousand mechanical rows is a pattern nobody spotted.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Run the chain checker, then probe every pattern</span><span class="lz-lnote">One <code>curl</code> per rule, checking the <code>Location</code> is what you meant. Eight probes covered the config above; a real migration wants one per pattern plus a sample of the table.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Ship with 302, watch, then switch to 301</span><span class="lz-lnote">A day or a week of real traffic finds the cases you did not think of, and <code>302</code> means you can still change your mind. Switching the number afterwards is a one-character diff.</span></div>
</div>
<div class="note-ct">
<p><strong>What made this config easy to verify.</strong> Every decision is a table, and there is exactly one place that acts on the result. That means the entire migration can be checked by reading two data files and probing one directive — as opposed to a chain of <code>rewrite</code> rules spread across locations, where the answer to "what happens to this URL" requires simulating the whole file in your head. The declarative shape from Lesson 8.3 is what makes the difference, and it is most valuable exactly here, on the change that must not go wrong.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>The whole migration — table file, pattern map, merge map and one <code>if</code> + <code>return</code> — eight probes, a chain and a loop followed with <code>curl -L</code>, and the twelve-line checker — on nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># chuyen-huong.map</span>
/gioi-thieu      /ve-chung-toi;
/lien-he.html    /lien-he;
/san-pham/cu-1   /san-pham/moi-1;
/rat-cu          /gioi-thieu;
/vong-a          /vong-b;
/vong-b          /vong-a;</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  map $uri $dich_bang { default ""; include chuyen-huong.map; }    <span class="tok-comment">  # 1) bảng 1-1 trong tệp riêng</span>
  map $uri $dich_mau {                                                           <span class="tok-comment">  # 2) quy tắc theo MẪU</span>
    default "";
    "~^/bai-viet/(\\d+)$"            "/tin/$1";
    "~^/danh-muc/(.+)/trang/(\\d+)$" "/c/$1?trang=$2";
  }
  map "$dich_bang:$dich_mau" $dich {                                             <span class="tok-comment">  # 3) gộp: bảng thắng</span>
    default      "";
    "~^([^:]+):" "$1";
    "~^:(.+)$"   "$1";
  }
  server {
    listen 8080;
    if ($dich) { return 301 $dich; }                                             <span class="tok-comment">  # 4) MỘT chỗ thi hành</span>
    location = /moi { return 200 "TRANG MOI\\n"; }
    location = /ve-chung-toi { return 200 "VE CHUNG TOI\\n"; }
    location /tin/  { return 200 "TIN: uri=[$uri]\\n"; }
    location /      { return 404 "khong tim thay\\n"; }
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># kiem-bang.py</span>
<span class="tok-comment"># kiem-bang.py — bộ kiểm bảng chuyển hướng (chạy trong CI): đích nào cũng là KHOÁ ⇒ một chuỗi hoặc một vòng</span>
import sys
cap = {}
for line in open(sys.argv[1]):
    p = line.strip().rstrip(';').split()
    if len(p) == 2: cap[p[0]] = p[1]
print('so cap:', len(cap))
for k, v in cap.items():
    if v in cap: print(f'CHUOI: {k} -&gt; {v} -&gt; {cap[v]}')</code></pre>
<div class="out">$ for u in /gioi-thieu /lien-he.html /san-pham/cu-1 /bai-viet/123 /danh-muc/sach/trang/4 /moi /tin/999 /khong-co-gi; do printf '%-24s -&gt; ' $u; curl -s -o /tmp/than -w '%{http_code}  %{redirect_url}' http://127.0.0.1:8080$u; [ -s /tmp/than ] &amp;&amp; grep -qv '&lt;' /tmp/than &amp;&amp; printf '  %s' "$(cat /tmp/than)"; echo; done
/gioi-thieu              -&gt; 301  http://127.0.0.1:8080/ve-chung-toi
/lien-he.html            -&gt; 301  http://127.0.0.1:8080/lien-he
/san-pham/cu-1           -&gt; 301  http://127.0.0.1:8080/san-pham/moi-1
/bai-viet/123            -&gt; 301  http://127.0.0.1:8080/tin/123
/danh-muc/sach/trang/4   -&gt; 301  http://127.0.0.1:8080/c/sach?trang=4
/moi                     -&gt; 200    TRANG MOI
/tin/999                 -&gt; 200    TIN: uri=[/tin/999]
/khong-co-gi             -&gt; 404    khong tim thay
$ printf '/rat-cu  khong theo : '; curl -s -o /dev/null -w '%{http_code} -&gt; %{redirect_url}\\n' http://127.0.0.1:8080/rat-cu
/rat-cu  khong theo : 301 -&gt; http://127.0.0.1:8080/gioi-thieu
$ printf '/rat-cu  theo -L    : '; curl -s -L -o /dev/null -w '%{http_code}, so chang=%{num_redirects}, cuoi=%{url_effective}\\n' http://127.0.0.1:8080/rat-cu
/rat-cu  theo -L    : 200, so chang=2, cuoi=http://127.0.0.1:8080/ve-chung-toi
$ printf '/vong-a  theo -L    : '; curl -s -L --max-redirs 5 -o /dev/null -w '%{http_code}, so chang=%{num_redirects}\\n' http://127.0.0.1:8080/vong-a; echo "  (curl thoat ma $?)"
/vong-a  theo -L    : 301, so chang=5
  (curl thoat ma 47)
$ grep -c . /srv/logs/error.log || echo '  error.log: 0 dong — nginx KHONG biet co vong'
0
  error.log: 0 dong — nginx KHONG biet co vong
$ python3 kiem-bang.py chuyen-huong.map
so cap: 6
CHUOI: /rat-cu -&gt; /gioi-thieu -&gt; /ve-chung-toi
CHUOI: /vong-a -&gt; /vong-b -&gt; /vong-a
CHUOI: /vong-b -&gt; /vong-a -&gt; /vong-b</div>
<p>Five 301s to the right targets, three URLs untouched. <code>/rat-cu</code>: two hops, then 200. <code>/vong-a</code>: curl gave up after five hops (exit code 47) and error.log had ZERO lines — nginx saw five normal requests. The checker found all three cases. In CI, make it exit non-zero when it prints a chain.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/seo-analytics/learn?lessonSlug=seo-1-3-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">SEO &amp; Analytics · 1.3 — Status codes, redirects and soft 404s</span><span class="lc-sub">Chains, 301 vs 302 and search engines</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-2-4-buoc-ma-thoat" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 2.4 — Steps, exit codes, and the flag that hides a failure</span><span class="lc-sub">Making the checker turn CI red</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">redirect table</span><span class="v">A 1-to-1 key/value map of old URL to new, kept in an included file.</span></div>
  <div class="kv"><span class="k">pattern rule</span><span class="v">A regex <code>map</code> covering many URLs of one shape, with captures rebuilding the new path.</span></div>
  <div class="kv"><span class="k">composite key</span><span class="v">A third <code>map</code> merges table and pattern with a defined precedence — the table wins.</span></div>
  <div class="kv"><span class="k">single enforcement point</span><span class="v">One <code>if (\$dich) return 301</code> at <code>server</code> level, not scattered through locations.</span></div>
  <div class="kv"><span class="k">redirect chain</span><span class="v">An old URL pointing at another old URL; costs an extra hop and dilutes the <code>301</code> signal.</span></div>
  <div class="kv"><span class="k">external redirect loop</span><span class="v">Two <code>301</code>s pointing at each other; nginx cannot detect it, the browser gives up.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A migration is three chained maps (table, pattern, merge) and one <code>if (\$dich) return 301</code> at <code>server</code> level.</li><li>The table handles one-offs (one hash lookup); patterns handle structural change with captures.</li><li>Unmatched URLs have an empty result and pass through untouched — the enforcement runs once per request.</li><li>Nginx cannot catch an external redirect loop or chain; a CI checker on the table file must.</li><li>Keep old URLs as <code>301</code>s to preserve links and ranking; ship with <code>302</code> first, then switch to <code>301</code>.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developers.google.com/search/docs/crawling-indexing/301-redirects" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Google Search — site moves with URL changes</span><span class="lc-sub">developers.google.com · What a 301 passes on and how long to keep them</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — map with include</span><span class="lc-sub">nginx.org · Keeping a large table outside the config file</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">MDN — HTTP redirects</span><span class="lc-sub">developer.mozilla.org · Chains, loops, and what each status means to a client</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">CuongThai course — Git &amp; GitHub</span><span class="lc-sub">Reviewing a generated table in a pull request, and keeping the checker in CI</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build the three-map migration, then plant a redirect loop and watch nothing catch it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Một cuộc chuyển đổi URL thật, ráp lại và đem đo</h2>
<p class="lead">Đổi cấu trúc URL của một site nghĩa là MỌI đường dẫn cũ trên thế giới giờ trỏ vào hư không. Cấu hình sửa chuyện đó chính là cả chương này hợp tác với nhau, và nó gọn trong chừng hai mươi dòng.</p>

<h3>Ba cái map và MỘT chỗ thi hành</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) Bảng 1-1, để trong file riêng (người không rành Nginx sửa được)</span>
map \$uri \$dich_bang {
  default "";
  include /etc/nginx/chuyen-huong.map;    <span class="tok-comment"># "/gioi-thieu  /ve-chung-toi;"</span>
}

<span class="tok-comment"># 2) Quy tắc theo MẪU — nhiều URL cùng một hình dạng</span>
map \$uri \$dich_mau {
  default "";
  "~^/bai-viet/(\\\\d+)\$"               "/tin/\$1";
  "~^/danh-muc/(.+)/trang/(\\\\d+)\$"    "/c/\$1?trang=\$2";
}

<span class="tok-comment"># 3) Gộp: bảng thắng, rồi mới tới mẫu</span>
map "\$dich_bang:\$dich_mau" \$dich {
  default      "";
  "~^([^:]+):" "\$1";        <span class="tok-comment"># có trong bảng -> lấy bảng</span>
  "~^:(.+)\$"   "\$1";        <span class="tok-comment"># không có -> lấy mẫu</span>
}

server {
  <span class="tok-comment"># 4) MỘT chỗ duy nhất thi hành. if + return: hợp lệ (Bài 8.2)</span>
  if (\$dich) { return 301 \$dich; }
  ...
}</code></pre>
<div class="out">=== Bang 1-1 ===
/gioi-thieu             -> 301  Location: .../ve-chung-toi
/lien-he.html           -> 301  Location: .../lien-he
/san-pham/cu-1          -> 301  Location: .../san-pham/moi-1

=== Quy tac theo mau ===
/bai-viet/123           -> 301  Location: .../tin/123
/danh-muc/sach/trang/4  -> 301  Location: .../c/sach?trang=4

=== KHONG khop gi — di qua NGUYEN VEN ===
/moi                    -> 200  TRANG MOI
/tin/999                -> 200  TIN: uri=[/tin/999]
/khong-co-gi            -> 404  khong tim thay</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cái bảng lo những ca LẺ</span><span class="lz-d">Những trang dời đi vì những lý do không chia sẻ với ai khác. Giữ nó trong một file include nghĩa là nó phình lên hàng nghìn dòng cũng không phải động vào cấu hình, và phép tra vẫn là MỘT thao tác băm (Bài 8.3).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Các MẪU lo phần thay đổi CẤU TRÚC</span><span class="lz-d">Mọi bài viết, mọi trang danh mục có phân trang. MỘT biểu thức chính quy phủ cả triệu URL, và các nhóm bắt dựng lại hình dạng mới — kể cả việc chuyển một đoạn đường dẫn thành một tham số query, đo được ở dòng cuối.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái map thứ ba GỘP chúng lại với thứ tự ưu tiên rõ ràng</span><span class="lz-d">Chính là cách viết khoá ghép ở Bài 8.3. Cái BẢNG thắng khi cả hai cùng khớp, và đó là thứ bạn muốn: một ngoại lệ cụ thể phải đè lên một quy tắc chung.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">MỘT chỗ thi hành nó, ở tầng server</span><span class="lz-d">Không rải rác qua các location. Mọi URL được kiểm MỘT lần, và một URL không khớp gì thì có <code>\$dich</code> rỗng và đi qua NGUYÊN VẸN — đo được ở ba dòng cuối.</span></div>
</div>

<h3>Phép dò tìm ra một vấn đề</h3>
<div class="out">Them vao bang: /rat-cu -> /gioi-thieu   (ma /gioi-thieu DA tro toi /ve-chung-toi)
                /vong-a -> /vong-b
                /vong-b -> /vong-a

  /rat-cu   khong theo: 301 -> /gioi-thieu
            CO theo -L : 200, so chang=2, cuoi=/ve-chung-toi     &lt;- CHUOI

  /vong-a   CO theo -L : 301, so chang=5, roi curl BO CUOC
            "qua nhieu chuyen huong"                             &lt;- VONG LAP</div>
<div class="pitfall">
<p><strong>Bẫy — cái giới hạn vòng chuyển-hướng-nội-bộ ở Bài 2.5 KHÔNG che chở bạn ở đây, vì đây là những cú chuyển hướng NGOÀI.</strong> Mỗi cú <code>301</code> KẾT THÚC một request; cái vòng lặp chỉ tồn tại XUYÊN QUA nhiều request riêng biệt từ phía client. Nginx nhìn thấy hai phản hồi hoàn toàn bình thường và chẳng có cách nào biết chúng tạo thành một vòng — không <code>500</code>, không dòng error log, không gì cả. Trình duyệt cuối cùng bỏ cuộc với câu "quá nhiều chuyển hướng" và người dùng thấy một trang hỏng. CHUỖI là phiên bản nhẹ hơn của cùng chuyện đó: <code>/rat-cu</code> tới được đích sau HAI chặng, nó chạy nhưng tốn thêm một vòng đi về và làm loãng cái tín hiệu mà <code>301</code> lẽ ra phải truyền cho máy tìm kiếm. Cả hai đều là tính chất của cái BẢNG chứ không phải của cấu hình, nên phép kiểm thuộc về đúng chỗ cái bảng được sửa.</p>
</div>
<pre><code class="language-python"><span class="tok-comment"># Bộ kiểm bảng — chạy trong CI, mười hai dòng</span>
cap = {}
for line in open('chuyen-huong.map'):
    p = line.strip().rstrip(';').split()
    if len(p) == 2: cap[p[0]] = p[1]

<span class="tok-comment"># Bất kỳ ĐÍCH nào cũng xuất hiện làm KHOÁ = một chuỗi hoặc một vòng</span>
for k, v in cap.items():
    if v in cap:
        print(f'CHUOI: {k} -> {v} -> {cap[v]}')</code></pre>
<div class="out">so cap: 6
CHUOI: /rat-cu -> /gioi-thieu -> /ve-chung-toi
CHUOI: /vong-a -> /vong-b -> /vong-a
CHUOI: /vong-b -> /vong-a -> /vong-b</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy LÀM PHẲNG chuỗi ngay tại nguồn, đừng nối chuyển hướng</span><span class="v"><code>/rat-cu</code> phải trỏ THẲNG tới <code>/ve-chung-toi</code>. Bộ kiểm tìm ra mọi ca trong một lượt, và việc viết lại cái bảng là máy móc — lấy đích CUỐI của mỗi chuỗi rồi dùng thẳng nó.</span></div>
  <div class="kv"><span class="k">301 bị trình duyệt CACHE, đôi khi là mãi mãi</span><span class="v">Một cú <code>301</code> SAI thì rất khó rút lại: trình duyệt nhớ nó và sẽ KHÔNG hỏi lại. Hãy triển khai một cuộc chuyển đổi bằng <code>302</code> trong ngày đầu, xác nhận các đích từ lưu lượng thật, rồi mới đổi sang <code>301</code>. Một phòng bị ấy chẳng tốn gì và nó là tuyến bảo vệ DUY NHẤT trước một lỗi gõ nhầm trong một cái bảng nghìn dòng.</span></div>
  <div class="kv"><span class="k">Hãy GIỮ cho URL cũ chạy được, đừng chỉ xoá chúng đi</span><span class="v">Một cú <code>404</code> làm mất cả đường dẫn lẫn thứ hạng; một cú <code>301</code> chuyển CẢ HAI sang URL mới. Cái bảng là cách rẻ nhất để giữ cho MỌI đường dẫn từ ngoài vào còn chạy được, và nó tốn một phép tra băm cho mỗi request.</span></div>
  <div class="kv"><span class="k">Hãy ghi log cú chuyển hướng để còn RÚT cái bảng về sau</span><span class="v">Có <code>\$dich</code> trong access log thì một năm sau bạn nhìn ra được URL cũ nào vẫn còn bị gọi. Những cái không có lưu lượng thì gỡ đi được; những cái CÓ thì nói cho bạn biết site bên ngoài nào vẫn đang trỏ tới bạn.</span></div>
</div>

<h3>Thứ tự để chạy một cuộc chuyển đổi</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. XUẤT danh sách URL cũ TRƯỚC khi đổi bất cứ thứ gì</span><span class="lz-lnote">Từ access log, từ sitemap, hay từ cơ sở dữ liệu. Bạn không dựng nổi cái bảng từ những URL mà mình không còn biết tới, và cái log là bản ghi DUY NHẤT về những thứ người ta THẬT SỰ gọi.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Viết MẪU trước, bảng sau</span><span class="lz-lnote">Phần lớn một cuộc chuyển đổi là CẤU TRÚC. Hãy phủ các hình dạng bằng hai ba biểu thức chính quy, rồi chỉ bỏ những NGOẠI LỆ thật sự vào bảng — một cái bảng có nghìn dòng máy móc chính là một cái mẫu mà chẳng ai nhận ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Chạy bộ kiểm chuỗi, rồi DÒ từng mẫu</span><span class="lz-lnote">Mỗi quy tắc một lệnh <code>curl</code>, kiểm xem cái <code>Location</code> có đúng ý không. Tám phép dò phủ hết cấu hình ở trên; một cuộc chuyển đổi thật thì muốn mỗi mẫu một phép dò cộng một mẫu ngẫu nhiên từ cái bảng.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Ship bằng 302, theo dõi, rồi mới đổi sang 301</span><span class="lz-lnote">Một ngày hay một tuần lưu lượng thật sẽ tìm ra những ca bạn không nghĩ tới, và <code>302</code> nghĩa là bạn vẫn đổi ý được. Đổi cái số ấy sau đó là một diff MỘT ký tự.</span></div>
</div>
<div class="note-ct">
<p><strong>Cái gì làm cho cấu hình này DỄ kiểm.</strong> Mọi quyết định đều là một cái BẢNG, và có ĐÚNG MỘT chỗ hành động theo kết quả. Nghĩa là cả cuộc chuyển đổi kiểm được bằng cách đọc hai file dữ liệu và dò một chỉ thị — trái ngược với một chuỗi luật <code>rewrite</code> rải khắp các location, nơi câu trả lời cho "cái URL này sẽ ra sao" đòi bạn phải mô phỏng cả cái file trong đầu. Hình dạng KHAI BÁO ở Bài 8.3 mới là thứ tạo ra khác biệt, và nó có giá trị nhất đúng ở đây, trên cái thay đổi KHÔNG ĐƯỢC PHÉP sai.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Cả cuộc chuyển đổi — tệp bảng, map mẫu, map gộp và một <code>if</code> + <code>return</code> — tám phép dò, một chuỗi và một vòng đi theo bằng <code>curl -L</code>, và bộ kiểm mười hai dòng — trên nginx/1.24.0:</p>
<pre><code class="language-bash"><span class="tok-comment"># chuyen-huong.map</span>
/gioi-thieu      /ve-chung-toi;
/lien-he.html    /lien-he;
/san-pham/cu-1   /san-pham/moi-1;
/rat-cu          /gioi-thieu;
/vong-a          /vong-b;
/vong-b          /vong-a;</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  map $uri $dich_bang { default ""; include chuyen-huong.map; }    <span class="tok-comment">  # 1) bảng 1-1 trong tệp riêng</span>
  map $uri $dich_mau {                                                           <span class="tok-comment">  # 2) quy tắc theo MẪU</span>
    default "";
    "~^/bai-viet/(\\d+)$"            "/tin/$1";
    "~^/danh-muc/(.+)/trang/(\\d+)$" "/c/$1?trang=$2";
  }
  map "$dich_bang:$dich_mau" $dich {                                             <span class="tok-comment">  # 3) gộp: bảng thắng</span>
    default      "";
    "~^([^:]+):" "$1";
    "~^:(.+)$"   "$1";
  }
  server {
    listen 8080;
    if ($dich) { return 301 $dich; }                                             <span class="tok-comment">  # 4) MỘT chỗ thi hành</span>
    location = /moi { return 200 "TRANG MOI\\n"; }
    location = /ve-chung-toi { return 200 "VE CHUNG TOI\\n"; }
    location /tin/  { return 200 "TIN: uri=[$uri]\\n"; }
    location /      { return 404 "khong tim thay\\n"; }
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># kiem-bang.py</span>
<span class="tok-comment"># kiem-bang.py — bộ kiểm bảng chuyển hướng (chạy trong CI): đích nào cũng là KHOÁ ⇒ một chuỗi hoặc một vòng</span>
import sys
cap = {}
for line in open(sys.argv[1]):
    p = line.strip().rstrip(';').split()
    if len(p) == 2: cap[p[0]] = p[1]
print('so cap:', len(cap))
for k, v in cap.items():
    if v in cap: print(f'CHUOI: {k} -&gt; {v} -&gt; {cap[v]}')</code></pre>
<div class="out">$ for u in /gioi-thieu /lien-he.html /san-pham/cu-1 /bai-viet/123 /danh-muc/sach/trang/4 /moi /tin/999 /khong-co-gi; do printf '%-24s -&gt; ' $u; curl -s -o /tmp/than -w '%{http_code}  %{redirect_url}' http://127.0.0.1:8080$u; [ -s /tmp/than ] &amp;&amp; grep -qv '&lt;' /tmp/than &amp;&amp; printf '  %s' "$(cat /tmp/than)"; echo; done
/gioi-thieu              -&gt; 301  http://127.0.0.1:8080/ve-chung-toi
/lien-he.html            -&gt; 301  http://127.0.0.1:8080/lien-he
/san-pham/cu-1           -&gt; 301  http://127.0.0.1:8080/san-pham/moi-1
/bai-viet/123            -&gt; 301  http://127.0.0.1:8080/tin/123
/danh-muc/sach/trang/4   -&gt; 301  http://127.0.0.1:8080/c/sach?trang=4
/moi                     -&gt; 200    TRANG MOI
/tin/999                 -&gt; 200    TIN: uri=[/tin/999]
/khong-co-gi             -&gt; 404    khong tim thay
$ printf '/rat-cu  khong theo : '; curl -s -o /dev/null -w '%{http_code} -&gt; %{redirect_url}\\n' http://127.0.0.1:8080/rat-cu
/rat-cu  khong theo : 301 -&gt; http://127.0.0.1:8080/gioi-thieu
$ printf '/rat-cu  theo -L    : '; curl -s -L -o /dev/null -w '%{http_code}, so chang=%{num_redirects}, cuoi=%{url_effective}\\n' http://127.0.0.1:8080/rat-cu
/rat-cu  theo -L    : 200, so chang=2, cuoi=http://127.0.0.1:8080/ve-chung-toi
$ printf '/vong-a  theo -L    : '; curl -s -L --max-redirs 5 -o /dev/null -w '%{http_code}, so chang=%{num_redirects}\\n' http://127.0.0.1:8080/vong-a; echo "  (curl thoat ma $?)"
/vong-a  theo -L    : 301, so chang=5
  (curl thoat ma 47)
$ grep -c . /srv/logs/error.log || echo '  error.log: 0 dong — nginx KHONG biet co vong'
0
  error.log: 0 dong — nginx KHONG biet co vong
$ python3 kiem-bang.py chuyen-huong.map
so cap: 6
CHUOI: /rat-cu -&gt; /gioi-thieu -&gt; /ve-chung-toi
CHUOI: /vong-a -&gt; /vong-b -&gt; /vong-a
CHUOI: /vong-b -&gt; /vong-a -&gt; /vong-b</div>
<p>Năm cú 301 tới đúng đích, ba URL đi qua nguyên vẹn. <code>/rat-cu</code>: hai chặng rồi 200. <code>/vong-a</code>: curl bỏ cuộc sau năm chặng (mã thoát 47) và error.log KHÔNG có dòng nào — nginx thấy năm request bình thường. Bộ kiểm tìm ra cả ba ca. Trong CI, hãy cho nó thoát với mã khác không khi in ra một chuỗi.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/seo-analytics/learn?lessonSlug=seo-1-3-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">SEO &amp; Analytics · 1.3 — Mã trạng thái, chuyển hướng và soft 404</span><span class="lc-sub">Chuỗi, 301 so với 302 và máy tìm kiếm</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-2-4-buoc-ma-thoat" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 2.4 — Bước, mã thoát, và cái cờ giấu mất cú hỏng</span><span class="lc-sub">Làm cho bộ kiểm đánh đỏ CI</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">redirect table</span><span class="v">Một <code>map</code> khoá/giá trị 1-1 từ URL cũ sang mới, để trong một file include.</span></div>
  <div class="kv"><span class="k">pattern rule</span><span class="v">Một <code>map</code> regex phủ nhiều URL cùng một hình dạng, nhóm bắt dựng lại đường dẫn mới.</span></div>
  <div class="kv"><span class="k">composite key</span><span class="v">Một <code>map</code> thứ ba gộp bảng và mẫu với thứ tự ưu tiên rõ ràng — bảng thắng.</span></div>
  <div class="kv"><span class="k">single enforcement point</span><span class="v">Một <code>if (\$dich) return 301</code> ở tầng <code>server</code>, không rải rác qua các location.</span></div>
  <div class="kv"><span class="k">redirect chain</span><span class="v">Một URL cũ trỏ tới một URL cũ khác; tốn thêm một chặng và làm loãng tín hiệu <code>301</code>.</span></div>
  <div class="kv"><span class="k">external redirect loop</span><span class="v">Hai cú <code>301</code> trỏ vào nhau; nginx không phát hiện được, trình duyệt bỏ cuộc.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một cuộc chuyển đổi là ba map nối nhau (bảng, mẫu, gộp) và một <code>if (\$dich) return 301</code> ở tầng <code>server</code>.</li><li>Bảng lo các ca lẻ (một phép tra băm); mẫu lo thay đổi cấu trúc bằng nhóm bắt.</li><li>URL không khớp có kết quả rỗng và đi qua nguyên vẹn — chỗ thi hành chạy một lần mỗi request.</li><li>Nginx không bắt được vòng lặp hay chuỗi chuyển hướng ngoài; một bộ kiểm CI trên file bảng phải làm việc đó.</li><li>Giữ URL cũ dưới dạng <code>301</code> để bảo toàn link và thứ hạng; ship bằng <code>302</code> trước, rồi đổi sang <code>301</code>.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developers.google.com/search/docs/crawling-indexing/301-redirects" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Google Search — dời site kèm đổi URL</span><span class="lc-sub">developers.google.com · Một cú 301 truyền được cái gì và nên giữ chúng bao lâu</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — map với include</span><span class="lc-sub">nginx.org · Giữ một cái bảng lớn nằm ngoài file cấu hình</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">MDN — Chuyển hướng HTTP</span><span class="lc-sub">developer.mozilla.org · Chuỗi, vòng lặp, và mỗi mã trạng thái nói gì với client</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Git &amp; GitHub</span><span class="lc-sub">Rà soát một cái bảng sinh ra trong pull request, và giữ bộ kiểm trong CI</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng cuộc chuyển đổi ba-map, rồi cài một vòng lặp chuyển hướng và xem chẳng gì bắt được nó</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Quiz: rewriting and mapping|||8.6 — Quiz: viết lại và ánh xạ',
      slug: 'nginx-8-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về bốn cái cờ của rewrite, ba kiểu hỏng của if, bốn kiểu khoá của map, ba dạng error_page, và cái vòng lặp chuyển hướng mà không gì chặn được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.6</span>
<h2>Quiz: rewriting and mapping</h2>
<p class="lead">Eight questions. Two of them are about a config line that does nothing and a config line that breaks a file server, both of which look completely reasonable.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> <code>rewrite</code>'s four flags do four different things: <code>last</code> restarts location matching (<code>$uri</code> changes, <code>$request_uri</code> does not), <code>redirect</code> and <code>permanent</code> send <code>302</code> and <code>301</code> to the client, and no flag lets subsequent rewrites keep running — while <code>break</code> stops the entire rewrite module, so a <code>return</code> written after it never executes, proven by two blocks producing identical output (8.1). <code>if</code> creates a nested location, which is why <code>add_header</code> inside one discards the outer list and why <code>try_files</code> plus an <code>if</code> turned a working <code>200</code> into a <code>404</code> on the addition of <code>?x=1</code> (8.2). <code>map</code> does all of it safely: exact keys in a hash, regex keys with captures, hostname wildcards, chaining, and a composite key standing in for the <code>&amp;&amp;</code> that does not exist (8.3). <code>error_page</code> has three forms giving <code>404</code>, <code>200</code> and <code>200</code> from the same page, and <code>internal</code> plus named locations make blocks that only internal redirects can reach (8.4). And a redirect table with a cycle in it produces a loop that Nginx cannot detect, because external redirects end the request (8.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.6</span>
<h2>Quiz: viết lại và ánh xạ</h2>
<p class="lead">Tám câu. Hai câu nói về một dòng cấu hình CHẲNG LÀM GÌ và một dòng cấu hình PHÁ một máy chủ tệp, mà cả hai đều trông hoàn toàn hợp lý.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Bốn cái cờ của <code>rewrite</code> làm bốn việc khác nhau: <code>last</code> chạy lại phép khớp location (<code>$uri</code> đổi, <code>$request_uri</code> không), <code>redirect</code> và <code>permanent</code> gửi <code>302</code> và <code>301</code> ra client, còn không cờ thì các rewrite đứng sau vẫn chạy tiếp — trong khi <code>break</code> DỪNG cả module rewrite, nên một <code>return</code> viết sau nó KHÔNG BAO GIỜ chạy, chứng minh bằng hai khối cho ra kết quả y hệt (8.1). <code>if</code> tạo ra một location LỒNG, và đó là lý do <code>add_header</code> nằm trong nó vứt bỏ danh sách bên ngoài, và là lý do <code>try_files</code> đi cùng một cái <code>if</code> đã biến một cú <code>200</code> đang chạy tốt thành <code>404</code> chỉ vì thêm <code>?x=1</code> (8.2). <code>map</code> làm được tất cả một cách an toàn: khoá chính xác nằm trong bảng băm, khoá regex có nhóm bắt, ký tự đại diện cho tên miền, nối map, và một khoá GHÉP đứng thay cho phép <code>&amp;&amp;</code> vốn không tồn tại (8.3). <code>error_page</code> có ba dạng cho ra <code>404</code>, <code>200</code> và <code>200</code> từ cùng một trang, còn <code>internal</code> cộng named location tạo ra những khối mà chỉ chuyển hướng nội bộ mới chạm tới được (8.4). Và một bảng chuyển hướng có vòng lặp bên trong sinh ra một cái vòng mà Nginx KHÔNG phát hiện nổi, vì chuyển hướng ngoài thì KẾT THÚC request (8.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'location /x/ { rewrite ^ /y break; return 200 "xin chao"; } — what does a request for /x/abc return?|||location /x/ { rewrite ^ /y break; return 200 "xin chao"; } — một request tới /x/abc trả về gì?',
            options: [
              '200 with "xin chao"|||200 kèm "xin chao"',
              'Whatever /y resolves to in this block — break stops the rewrite module, and return is a rewrite-module directive, so it never runs|||Bất cứ thứ gì /y giải ra được TRONG khối này — break dừng module rewrite, mà return là một chỉ thị của module rewrite, nên nó không bao giờ chạy',
              '301 to /y|||301 tới /y',
              'A configuration error at startup|||Một lỗi cấu hình lúc khởi động',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After rewrite ^/cu/(.*)$ /moi/$1 last;, what are $uri and $request_uri?|||Sau lệnh rewrite ^/cu/(.*)$ /moi/$1 last;, $uri và $request_uri là gì?',
            options: [
              'Both become /moi/...|||Cả hai đều thành /moi/...',
              '$uri becomes /moi/... and $request_uri keeps what the client sent — which is why access logs stay honest|||$uri thành /moi/... còn $request_uri GIỮ thứ client đã gửi — và đó là lý do access log vẫn thật thà',
              'Both keep /cu/...|||Cả hai đều giữ /cu/...',
              '$request_uri becomes /moi/... and $uri keeps /cu/...|||$request_uri thành /moi/... còn $uri giữ /cu/...',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A location has add_header X-A. You add if ($arg_x = 1) { add_header X-B; }. What does a request with ?x=1 receive?|||Một location có add_header X-A. Bạn thêm if ($arg_x = 1) { add_header X-B; }. Một request kèm ?x=1 nhận được gì?',
            options: [
              'Both X-A and X-B|||Cả X-A lẫn X-B',
              'Only X-B — the if is a nested location, so its add_header list replaces the outer one entirely|||CHỈ X-B — cái if là một location LỒNG, nên danh sách add_header của nó THAY THẾ hoàn toàn cái bên ngoài',
              'Only X-A|||Chỉ X-A',
              'Neither|||Không cái nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A location serves a file with try_files and also has an if block adding a header. What did adding ?x=1 to the URL do?|||Một location phục vụ một tệp bằng try_files và có thêm một khối if để thêm header. Việc thêm ?x=1 vào URL đã làm gì?',
            options: [
              'Nothing; the file is still served|||Không gì cả; tệp vẫn được phục vụ',
              'It returned 404 — the request was handled by the nested if location, which has no try_files and therefore no content handler|||Nó trả về 404 — request được xử lý bởi cái location LỒNG của if, thứ không có try_files nên không có bộ xử lý nội dung nào',
              'It returned 500|||Nó trả về 500',
              'The header was ignored|||Cái header bị bỏ qua',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which if bodies are safe inside a location?|||Thân if nào thì AN TOÀN khi nằm trong một location?',
            options: [
              'Any directive that is valid in a location|||Bất kỳ chỉ thị nào hợp lệ trong một location',
              'Only return and rewrite — everything else is a bug waiting for the right request to match|||Chỉ return và rewrite — mọi thứ khác đều là một con lỗi đang chờ đúng cái request khớp nó',
              'Only add_header|||Chỉ add_header',
              'if is never safe anywhere|||if không bao giờ an toàn ở đâu cả',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Nginx has no &&. How do you express "both A and B are true" with map?|||Nginx không có &&. Diễn đạt "cả A lẫn B đều đúng" bằng map thế nào?',
            options: [
              'Nest two map blocks|||Lồng hai khối map vào nhau',
              'Build a composite key: map "$a:$b" $ket_qua { "~^co:co$" 1; } — with a separator that cannot appear in either value|||Dựng một khoá GHÉP: map "$a:$b" $ket_qua { "~^co:co$" 1; } — với một dấu ngăn KHÔNG THỂ xuất hiện trong hai giá trị kia',
              'Use two if blocks|||Dùng hai khối if',
              'It is not possible|||Không làm được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'error_page 404 /trang-loi; versus error_page 404 = /trang-loi; — what differs?|||error_page 404 /trang-loi; và error_page 404 = /trang-loi; — khác nhau chỗ nào?',
            options: [
              'Nothing; the equals sign is decorative|||Không gì cả; dấu bằng chỉ để trang trí',
              'Without = the client still gets 404; with a bare = the status comes from the handling location, which returned 200|||Không có = thì client vẫn nhận 404; có dấu = TRẦN thì mã lấy từ location xử lý, mà nó trả về 200',
              'The equals sign makes it a redirect|||Dấu bằng biến nó thành một cú chuyển hướng',
              'Without = the error page is not shown|||Không có = thì trang lỗi không hiện ra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your redirect table contains /a → /b and /b → /a. What does Nginx do?|||Bảng chuyển hướng của bạn có /a → /b và /b → /a. Nginx làm gì?',
            options: [
              'Returns 500 with "rewrite or internal redirection cycle"|||Trả 500 kèm "rewrite or internal redirection cycle"',
              'Nothing — these are external 301s, each ending its own request, so Nginx sees two normal responses and the browser is what gives up|||Không gì cả — đây là các cú 301 NGOÀI, mỗi cái kết thúc request của nó, nên Nginx thấy hai phản hồi bình thường và trình duyệt mới là bên bỏ cuộc',
              'Refuses to load the config|||Từ chối nạp cấu hình',
              'Serves /a directly|||Phục vụ thẳng /a',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
