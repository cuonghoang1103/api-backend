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
<p><strong>Bẫy — <code>break</code> stops the whole rewrite module, and <code>return</code> belongs to the rewrite module.</strong> The two blocks above are indistinguishable in their output, which proves the <code>return 200</code> after the <code>break</code> never executed. The same applies to any <code>rewrite</code>, <code>set</code> or <code>if</code> written below it. This is not documented as "return is skipped" — it is documented as "stops processing the current set of ngx_http_rewrite_module directives", and you have to know that <code>return</code> is one of those. The practical rule: after a <code>break</code>, nothing else in that block from the rewrite family runs, so put the <code>break</code> last or do not use it at all. A block that does <code>rewrite ... break;</code> followed by <code>proxy_pass</code> is correct, because <code>proxy_pass</code> is not a rewrite-module directive.</p>
</div>

<h3>The two rules that make rewrites predictable</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rewrite runs before location matching finishes</span><span class="v">Rewrites at <code>server</code> level run first, against the original URI, before any <code>location</code> is chosen. Rewrites inside a <code>location</code> run after that block was selected. Putting one at <code>server</code> level to "catch everything" changes which block gets chosen, which is usually not what was intended.</span></div>
  <div class="kv"><span class="k">The replacement decides whether it is a redirect</span><span class="v">If the replacement starts with <code>http://</code>, <code>https://</code> or <code>$scheme</code>, Nginx sends a <code>302</code> whether or not you wrote a flag. That is why a rewrite you meant to be internal sometimes shows up in the browser — the destination made the decision for you.</span></div>
  <div class="kv"><span class="k">The query string is appended unless you stop it</span><span class="v">A replacement with no <code>?</code> keeps the original arguments. A replacement ending in <code>?</code> discards them. <code>rewrite ^/cu$ /moi? permanent;</code> is how you drop a query string on purpose, and forgetting the <code>?</code> is how tracking parameters survive a migration.</span></div>
  <div class="kv"><span class="k">There is a cycle limit, same as Lesson 2.5</span><span class="v">Ten internal redirects and the request dies with <code>500</code> and <code>rewrite or internal redirection cycle</code> in the error log. A <code>last</code> that rewrites into a block that rewrites back is the usual way to produce it.</span></div>
</div>
<pre><code><span class="tok-comment"># ĐÚNG: sửa đường dẫn rồi chuyển tiếp, break đứng TRƯỚC proxy_pass</span>
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
<pre><code><span class="tok-comment"># ĐÚNG: sửa đường dẫn rồi chuyển tiếp, break đứng TRƯỚC proxy_pass</span>
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
<p><strong>Bẫy — the file exists, the config did not change, and adding <code>?x=1</code> to the URL made it a <code>404</code>.</strong> Because the <code>if</code> creates a nested location, and <code>try_files</code> belongs to the outer one. When the condition matches, the request is handled by the nested block — which has no <code>try_files</code>, no content handler, and therefore nothing to serve. The reason this is the canonical example is that the config looks entirely reasonable: a conditional header next to a file server. Nobody writing it expects it to disable the file server. And the failure is conditional on a query parameter, so it reaches production and then reproduces only for some requests. <strong>The rule that avoids all of this: inside a <code>location</code>, only ever use <code>if</code> with <code>return</code> or <code>rewrite</code>. Anything else — <code>add_header</code>, <code>try_files</code>, <code>proxy_pass</code>, <code>root</code> — is a bug waiting for the right query string.</strong></p>
</div>

<h3>What to write instead</h3>
<pre><code><span class="tok-comment"># THAY VÌ: if ($http_user_agent ~* bot) { add_header X-Bot "co"; }</span>
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
  <div class="kv"><span class="k">map is evaluated lazily and only once</span><span class="v">The variable is computed the first time it is referenced in a request and cached for that request. An <code>if</code> is evaluated every time the block is entered, and it restructures the configuration tree. For anything on a hot path the difference is real, and for readability it is not close.</span></div>
  <div class="kv"><span class="k">An empty map result disables what uses it</span><span class="v"><code>add_header X-Bot "" always;</code> sends nothing, and <code>limit_req</code> with an empty key does not apply. That makes <code>map</code> the idiomatic way to express "only in this case", without a nested block.</span></div>
  <div class="kv"><span class="k">if at server level is safer than inside a location</span><span class="v">The documented caveats are about <code>if</code> inside <code>location</code>. At <code>server</code> level with a <code>return</code>, it is a normal and widely used pattern — the canonical HTTPS redirect is exactly that shape.</span></div>
  <div class="kv"><span class="k">Two conditions need a map with a combined key</span><span class="v">There is no <code>&amp;&amp;</code>. The idiom is <code>map "\$a:\$b" \$ket_qua { "~^co:co\$" 1; }</code> — build one string from both variables and match against it. Nesting two <code>if</code> blocks is not possible and would be worse if it were.</span></div>
</div>
<div class="note-ct">
<p><strong>Why this lesson is short on nuance.</strong> There is a version of this that carefully explains when <code>if</code> is safe in a location and when it is not. The honest version is that the rule "only <code>return</code> and <code>rewrite</code>" is easy to remember, costs nothing, and makes probe 3 impossible — while the nuanced version requires everyone who ever edits the file to remember which directives are safe. <code>map</code> covers every other case and is clearer to read, so the trade is not close.</p>
</div>

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
<pre><code><span class="tok-comment"># THAY VÌ: if ($http_user_agent ~* bot) { add_header X-Bot "co"; }</span>
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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>map: the lookup table that replaces every if</h2>
<p class="lead">A <code>map</code> declares "given this variable, produce that one". It lives at <code>http</code> level, it is evaluated lazily, and it does not restructure anything — which is the entire reason it can do safely what Lesson 8.2 measured going wrong.</p>

<h3>Four kinds of key, measured</h3>
<pre><code>map \$arg_v \$ket_qua {
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
<p><strong>Bẫy — there is no <code>&amp;&amp;</code>, and the workaround people reach for first is nested <code>if</code>, which is not even legal.</strong> The idiom is to build one string out of the variables you care about and match a pattern against it, as above. The separator matters: use a character that cannot appear in either value, or <code>a=</code>"<code>x:y</code>" and <code>b=</code>"<code>z</code>" collide with <code>a=</code>"<code>x</code>" and <code>b=</code>"<code>y:z</code>". A colon is fine for flags and wrong for user-supplied strings — for those, a character like <code>\\x1f</code> that cannot occur in a URL is the safe choice. This is the one place where the <code>map</code> approach is genuinely less readable than a conditional would be, and it is still better than the alternative.</p>
</div>
<pre><code><span class="tok-comment"># Ba khuôn mẫu map dùng được ngay</span>

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
<p><strong>The mental shift worth making.</strong> Nginx configuration is declarative, and <code>map</code> is the declarative way to express a decision: a table from input to output, evaluated when needed, with no effect on anything else. <code>if</code> is the imperative way, and it does not fit — which is why it creates a nested location and why Lesson 8.2's third probe returned a <code>404</code>. Every time you catch yourself wanting a condition, write the table instead; after a few of them the table starts to feel like the natural form.</p>
</div>

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
<pre><code>map \$arg_v \$ket_qua {
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
<pre><code><span class="tok-comment"># Ba khuôn mẫu map dùng được ngay</span>

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

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — module map</span><span class="lc-sub">nginx.org · hostnames, volatile, include và thứ tự khớp</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — các biến dựng sẵn</span><span class="lc-sub">nginx.org · Mọi thứ một map nhận làm đầu vào, gom trong một danh sách</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_geo_module.html" target="_blank" rel="noopener"><span class="lc-ico">🌍</span><span class="lc-body"><span class="lc-title">nginx — module geo</span><span class="lc-sub">nginx.org · Cùng ý tưởng nhưng khoá theo dải IP, cho danh sách cho phép và luật theo mạng</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Kiểu Record làm bảng điều phối, cùng khuôn mẫu nhưng có bộ kiểm kiểu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng một map bốn khoá, nối thêm một cái thứ hai, rồi diễn đạt một phép AND</span></span></a>
</div>
`,
    },
  ],
};
