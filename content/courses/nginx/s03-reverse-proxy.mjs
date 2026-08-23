const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 3 — Reverse proxy: what actually reaches your application|||Chương 3 — Reverse proxy: cái gì THỰC SỰ tới được ứng dụng của bạn',
  description: 'Đây là chương quan trọng nhất nếu bạn đặt Nginx trước một API. Nó đo xem Nginx mặc định gửi cái gì lên upstream — và câu trả lời có bốn thứ làm người ta bất ngờ, trong đó có một cái làm WebSocket không bao giờ chạy và một cái âm thầm VỨT header của bạn.',
  lessons: [

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — proxy_pass, and the slash that rewrites the path|||3.1 — proxy_pass, và cái dấu gạch chéo viết lại đường dẫn',
      slug: 'nginx-3-1-proxy-pass',
      type: 'LESSON',
      description: 'Một ký tự trong proxy_pass quyết định upstream nhận được /a/nguoi/1 hay /nguoi/1. Bài này đo cả bốn cách viết trên một upstream thật biết in ra chính xác đường dẫn nó nhận, rồi chỉ ra vì sao một khối location regex làm cả cái luật đó tan biến.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>proxy_pass, and the slash that rewrites the path</h2>
<p class="lead">A reverse proxy has one core job: take the request you received and reissue it to something else. <code>proxy_pass</code> does that, and the single most consequential thing about it is a rule that hangs on whether the URL you wrote has a path component. Getting it wrong produces a <code>404</code> from your own application, which is a confusing place for the blame to land.</p>

<h3>Four spellings, one upstream that prints what it received</h3>
<pre><code>location /a/ { proxy_pass http://127.0.0.1:9101; }        <span class="tok-comment"># KHÔNG có đường dẫn</span>
location /b/ { proxy_pass http://127.0.0.1:9101/; }       <span class="tok-comment"># đường dẫn = /</span>
location /c/ { proxy_pass http://127.0.0.1:9101/khac/; }  <span class="tok-comment"># đường dẫn = /khac/</span>
location /d  { proxy_pass http://127.0.0.1:9101/xxx; }    <span class="tok-comment"># không dấu / ở cả hai bên</span></code></pre>
<div class="out">$ curl http://127.0.0.1:8092/&lt;tien-to&gt;/nguoi/1

/a/nguoi/1     -> upstream nhan url = /a/nguoi/1      (di NGUYEN VEN)
/b/nguoi/1     -> upstream nhan url = /nguoi/1        (/b/ bi CAT)
/c/nguoi/1     -> upstream nhan url = /khac/nguoi/1   (/c/ bi THAY bang /khac/)
/d/nguoi/1     -> upstream nhan url = /xxx/nguoi/1    (/d bi THAY bang /xxx)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No path in the URL → pass the URI unchanged</span><span class="lz-d">Row A. Nginx sends <code>\$uri</code> exactly as it matched, prefix included. This is what you want when the upstream owns the same URL space as the outside world.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Any path at all → substitute it for the matched prefix</span><span class="lz-d">Rows B, C and D. The part of the URI that the <code>location</code> matched is cut off and the <code>proxy_pass</code> path is put in its place. A bare <code>/</code> counts as a path, which is why row B strips <code>/b/</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It is the same cut-and-paste as alias</span><span class="lz-d">Compare Lesson 2.4: <code>root</code> appends, <code>alias</code> substitutes. Here <code>proxy_pass</code> without a path behaves like <code>root</code>, and with a path behaves like <code>alias</code> — including the trailing-slash care that requires.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Decide by asking what the upstream expects</span><span class="lz-d">If the API's own routes are <code>/nguoi/1</code>, use the substituting form. If they are <code>/a/nguoi/1</code>, use the pass-through form. Neither is more correct; they answer different questions.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — the substituting form works on the <em>matched prefix</em>, so the two slashes have to agree.</strong> <code>location /b/</code> with <code>proxy_pass http://up/;</code> is correct: <code>/b/nguoi</code> becomes <code>/nguoi</code>. But <code>location /b</code> (no slash) with <code>proxy_pass http://up/;</code> turns <code>/b/nguoi</code> into <code>//nguoi</code> — a doubled slash that many frameworks treat as a different route, and some reject. The habit that never bites: write both with a trailing slash, or write neither. And if you must handle the bare <code>/b</code> too, add <code>location = /b { return 301 /b/; }</code> beside it rather than dropping the slash from the main block.</p>
</div>

<h3>The rule that quietly stops applying</h3>
<pre><code><span class="tok-comment"># Trong location REGEX, proxy_pass KHÔNG được phép mang đường dẫn.</span>
location ~ ^/anh/(.+)\$ {
  proxy_pass http://127.0.0.1:9101/media/\$1;   <span class="tok-comment"># dựng lại BẰNG TAY qua nhóm bắt</span>
}

<span class="tok-comment"># Và nếu bên trong khối có rewrite thì thứ được gửi đi là URI SAU rewrite:</span>
location /cu/ {
  rewrite ^/cu/(.*)\$ /moi/\$1 break;
  proxy_pass http://127.0.0.1:9101;            <span class="tok-comment"># gửi /moi/... chứ không phải /cu/...</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A regex location cannot use the substituting form</span><span class="v">There is no fixed "matched prefix" to cut, so Nginx refuses a <code>proxy_pass</code> with a path unless you build the path yourself from captures. If the config would not start, this is usually why.</span></div>
  <div class="kv"><span class="k">rewrite ... break wins over the proxy_pass path</span><span class="v">Once a <code>rewrite</code> has changed the URI inside the block, that is what gets sent. Mixing a <code>rewrite</code> with a path-carrying <code>proxy_pass</code> is how people end up with a path that is neither of the two they wrote.</span></div>
  <div class="kv"><span class="k">The query string always rides along</span><span class="v">None of the four rows touched <code>?a=1</code> — it is appended unchanged in every form. If you need to add a parameter, that is <code>proxy_pass ...?\$args&amp;extra=1</code>, and it replaces rather than merges.</span></div>
  <div class="kv"><span class="k">A hostname in proxy_pass is resolved ONCE at startup</span><span class="v">Written as a bare name, Nginx resolves it when the config loads and keeps that address. If the upstream is a container whose IP changes, the proxy keeps dialling the old one until a reload — use an <code>upstream</code> block or a <code>resolver</code> with a variable to get re-resolution.</span></div>
</div>

<h3>Which form each situation wants</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One app owning the whole site → no path</span><span class="lz-lnote"><code>location / { proxy_pass http://app:3000; }</code>. The URL space is identical inside and out, links the app generates are correct without rewriting, and there is nothing to keep in sync.</span></div>
  <div class="lz-layer"><span class="lz-lname">Several services under prefixes → path form, carefully</span><span class="lz-lnote"><code>location /api/ { proxy_pass http://api:4000/; }</code> lets the API keep clean internal routes. The cost is that any absolute URL the API returns is wrong for the outside world unless it is prefix-aware — which is a real, recurring cost.</span></div>
  <div class="lz-layer"><span class="lz-lname">Several services, no rewriting → no path, matching routes</span><span class="lz-lnote">Give each service the prefix in its own routing too, so <code>/api/nguoi</code> is genuinely the API's route. It looks redundant and it removes an entire class of link-generation bugs.</span></div>
  <div class="lz-layer"><span class="lz-lname">A named upstream for anything real</span><span class="lz-lnote"><code>upstream api { server api:4000; keepalive 32; }</code> then <code>proxy_pass http://api;</code>. It is the prerequisite for connection reuse (3.3), for more than one backend (Chapter 10), and for a <code>proxy_pass</code> that survives a container restart.</span></div>
</div>
<div class="note-ct">
<p><strong>How to check it in one command.</strong> Point the proxy at anything that echoes the request — a three-line Node server, <code>nc -l</code>, an existing endpoint that returns its own path — and request one URL through the proxy. The path the upstream reports is the ground truth, and it takes ten seconds. Every row in the table above came from exactly that, which is why none of them is a guess.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass</span><span class="lc-sub">nginx.org · The paragraph about "with URI" versus "without URI", which is the whole rule</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener"><span class="lc-ico">🏭</span><span class="lc-body"><span class="lc-title">nginx — the upstream module</span><span class="lc-sub">nginx.org · Named upstreams, keepalive, and re-resolution behaviour</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">nginx — rewrite and the break flag</span><span class="lc-sub">nginx.org · Why a rewrite inside the block changes what proxy_pass sends</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">How an Express router sees the path, and what a doubled slash does to it</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Run the echo upstream and reproduce all four rows, then break row B on purpose</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>proxy_pass, và cái dấu gạch chéo viết lại đường dẫn</h2>
<p class="lead">Một con reverse proxy có đúng một việc cốt lõi: nhận cái request bạn vừa nhận rồi phát lại nó cho một thứ khác. <code>proxy_pass</code> làm việc đó, và điều hệ trọng nhất về nó là một cái luật treo vào chuyện cái URL bạn viết CÓ phần đường dẫn hay không. Làm sai thì ứng dụng CỦA CHÍNH BẠN trả về <code>404</code>, một chỗ rất khó hiểu để cái tội rơi vào.</p>

<h3>Bốn cách viết, một upstream biết in ra chính xác cái nó nhận</h3>
<pre><code>location /a/ { proxy_pass http://127.0.0.1:9101; }        <span class="tok-comment"># KHÔNG có đường dẫn</span>
location /b/ { proxy_pass http://127.0.0.1:9101/; }       <span class="tok-comment"># đường dẫn = /</span>
location /c/ { proxy_pass http://127.0.0.1:9101/khac/; }  <span class="tok-comment"># đường dẫn = /khac/</span>
location /d  { proxy_pass http://127.0.0.1:9101/xxx; }    <span class="tok-comment"># không dấu / ở cả hai bên</span></code></pre>
<div class="out">$ curl http://127.0.0.1:8092/&lt;tien-to&gt;/nguoi/1

/a/nguoi/1     -> upstream nhan url = /a/nguoi/1      (di NGUYEN VEN)
/b/nguoi/1     -> upstream nhan url = /nguoi/1        (/b/ bi CAT)
/c/nguoi/1     -> upstream nhan url = /khac/nguoi/1   (/c/ bi THAY bang /khac/)
/d/nguoi/1     -> upstream nhan url = /xxx/nguoi/1    (/d bi THAY bang /xxx)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">URL KHÔNG có đường dẫn → gửi URI y nguyên</span><span class="lz-d">Dòng A. Nginx gửi <code>\$uri</code> đúng như lúc nó khớp, kèm cả tiền tố. Đây là thứ bạn muốn khi upstream sở hữu CÙNG một không gian URL với thế giới bên ngoài.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có đường dẫn, dù chỉ một dấu / → THAY nó vào chỗ tiền tố đã khớp</span><span class="lz-d">Dòng B, C và D. Phần URI mà <code>location</code> khớp bị cắt đi và cái đường dẫn của <code>proxy_pass</code> được đặt vào chỗ đó. Một dấu <code>/</code> trần vẫn TÍNH là đường dẫn, và đó là lý do dòng B cắt mất <code>/b/</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đúng là phép cắt-dán y như alias</span><span class="lz-d">So với Bài 2.4: <code>root</code> nối thêm, <code>alias</code> thay thế. Ở đây <code>proxy_pass</code> không đường dẫn cư xử như <code>root</code>, còn có đường dẫn thì cư xử như <code>alias</code> — kể cả việc phải cẩn thận với dấu gạch chéo cuối.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chọn bằng cách hỏi UPSTREAM mong đợi cái gì</span><span class="lz-d">Nếu các tuyến của chính API là <code>/nguoi/1</code> thì dùng dạng thay thế. Nếu chúng là <code>/a/nguoi/1</code> thì dùng dạng đi thẳng. Không cái nào đúng hơn cái nào; chúng trả lời hai câu hỏi khác nhau.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — dạng thay thế làm việc trên <em>phần tiền tố đã khớp</em>, nên hai cái dấu gạch chéo phải ăn khớp nhau.</strong> <code>location /b/</code> với <code>proxy_pass http://up/;</code> là đúng: <code>/b/nguoi</code> thành <code>/nguoi</code>. Nhưng <code>location /b</code> (không dấu gạch chéo) với <code>proxy_pass http://up/;</code> biến <code>/b/nguoi</code> thành <code>//nguoi</code> — một dấu gạch chéo lặp mà nhiều framework coi là một tuyến KHÁC, và vài cái thì từ chối thẳng. Thói quen không bao giờ cắn: viết CẢ HAI có dấu gạch chéo cuối, hoặc CẢ HAI không. Còn nếu bắt buộc phải lo cho cả <code>/b</code> trần thì thêm <code>location = /b { return 301 /b/; }</code> bên cạnh, đừng bỏ dấu gạch chéo khỏi khối chính.</p>
</div>

<h3>Cái luật lặng lẽ thôi có hiệu lực</h3>
<pre><code><span class="tok-comment"># Trong location REGEX, proxy_pass KHÔNG được phép mang đường dẫn.</span>
location ~ ^/anh/(.+)\$ {
  proxy_pass http://127.0.0.1:9101/media/\$1;   <span class="tok-comment"># dựng lại BẰNG TAY qua nhóm bắt</span>
}

<span class="tok-comment"># Và nếu bên trong khối có rewrite thì thứ được gửi đi là URI SAU rewrite:</span>
location /cu/ {
  rewrite ^/cu/(.*)\$ /moi/\$1 break;
  proxy_pass http://127.0.0.1:9101;            <span class="tok-comment"># gửi /moi/... chứ không phải /cu/...</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một location regex KHÔNG dùng được dạng thay thế</span><span class="v">Không có "phần tiền tố đã khớp" cố định nào để cắt, nên Nginx từ chối một <code>proxy_pass</code> mang đường dẫn trừ khi bạn tự dựng đường dẫn từ các nhóm bắt. Cấu hình không khởi động được thì thường là vì chuyện này.</span></div>
  <div class="kv"><span class="k">rewrite ... break THẮNG cái đường dẫn của proxy_pass</span><span class="v">Một khi <code>rewrite</code> đã đổi URI bên trong khối thì chính cái đó được gửi đi. Trộn một cái <code>rewrite</code> với một <code>proxy_pass</code> có mang đường dẫn là cách người ta rơi vào một đường dẫn không phải cái nào trong hai cái họ viết.</span></div>
  <div class="kv"><span class="k">Query string LUÔN đi kèm theo</span><span class="v">Không dòng nào trong bốn dòng đụng tới <code>?a=1</code> — nó được nối vào y nguyên ở mọi dạng. Cần thêm một tham số thì đó là <code>proxy_pass ...?\$args&amp;them=1</code>, và nó THAY THẾ chứ không trộn.</span></div>
  <div class="kv"><span class="k">Tên miền trong proxy_pass chỉ được phân giải MỘT LẦN lúc khởi động</span><span class="v">Viết dạng tên trần thì Nginx phân giải nó lúc nạp cấu hình rồi giữ luôn cái địa chỉ đó. Nếu upstream là một container mà IP đổi thì con proxy cứ gọi mãi cái cũ cho tới khi nạp lại — hãy dùng một khối <code>upstream</code> hoặc một <code>resolver</code> kèm biến để nó phân giải lại.</span></div>
</div>

<h3>Tình huống nào muốn dạng nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một ứng dụng sở hữu cả site → KHÔNG đường dẫn</span><span class="lz-lnote"><code>location / { proxy_pass http://app:3000; }</code>. Không gian URL bên trong và bên ngoài y hệt nhau, các đường dẫn ứng dụng tự sinh ra đều đúng mà không cần viết lại, và không có gì phải giữ cho đồng bộ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều dịch vụ dưới các tiền tố → dạng có đường dẫn, và phải cẩn thận</span><span class="lz-lnote"><code>location /api/ { proxy_pass http://api:4000/; }</code> cho phép API giữ các tuyến nội bộ sạch sẽ. Cái giá là mọi URL tuyệt đối API trả ra đều SAI với thế giới bên ngoài, trừ khi nó biết về cái tiền tố — và đó là một cái giá có thật, lặp đi lặp lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều dịch vụ, KHÔNG viết lại gì → không đường dẫn, tuyến khớp nhau</span><span class="lz-lnote">Cho mỗi dịch vụ mang luôn cái tiền tố trong hệ định tuyến của chính nó, để <code>/api/nguoi</code> thật sự LÀ tuyến của API. Nhìn thì thừa, mà nó xoá cả một lớp lỗi sinh đường dẫn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một upstream có tên cho mọi thứ nghiêm túc</span><span class="lz-lnote"><code>upstream api { server api:4000; keepalive 32; }</code> rồi <code>proxy_pass http://api;</code>. Nó là điều kiện cần để tái dùng kết nối (3.3), để có hơn một backend (Chương 10), và để một <code>proxy_pass</code> sống sót qua một lần khởi động lại container.</span></div>
</div>
<div class="note-ct">
<p><strong>Kiểm nó bằng một lệnh.</strong> Chĩa con proxy vào bất cứ thứ gì biết vọng lại cái request — một máy chủ Node ba dòng, một cái <code>nc -l</code>, một điểm cuối sẵn có biết trả về đường dẫn của chính nó — rồi gọi MỘT URL qua proxy. Cái đường dẫn upstream báo về là sự thật nền, và nó tốn mười giây. Mọi dòng trong bảng ở trên đều ra từ đúng cách đó, và đó là lý do không dòng nào là phỏng đoán.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass</span><span class="lc-sub">nginx.org · Đoạn nói về "có URI" và "không có URI", chính là cả cái luật</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener"><span class="lc-ico">🏭</span><span class="lc-body"><span class="lc-title">nginx — module upstream</span><span class="lc-sub">nginx.org · Upstream có tên, keepalive, và hành vi phân giải lại</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">nginx — rewrite và cờ break</span><span class="lc-sub">nginx.org · Vì sao một cái rewrite trong khối làm đổi thứ proxy_pass gửi đi</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Router của Express nhìn thấy đường dẫn thế nào, và một gạch chéo lặp làm gì nó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Chạy cái upstream vọng lại và dựng đủ bốn dòng, rồi phá dòng B một cách cố ý</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — What Nginx sends upstream by default, and the four surprises|||3.2 — Mặc định Nginx gửi gì lên upstream, và bốn thứ làm bạn bất ngờ',
      slug: 'nginx-3-2-header-len-upstream',
      type: 'LESSON',
      description: 'Cùng một request, gọi thẳng vào upstream và gọi qua proxy, rồi in cả hai bộ header ra cạnh nhau. Bốn thứ khác nhau — và cả bốn đều là nguyên nhân của một loại lỗi mà không ai đoán ra nếu chưa từng nhìn cái bảng này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>What Nginx sends upstream by default, and the four surprises</h2>
<p class="lead">A proxy does not forward your request — it makes a new one. Which headers it copies, changes or drops is decided by defaults that predate most of the things you will put behind it. Here is the same request seen from both sides.</p>

<h3>The same request, direct versus proxied</h3>
<div class="out">$ curl -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co' ...

QUA PROXY (mac dinh)             GOI THANG VAO UPSTREAM
httpVersion: 1.0                 httpVersion: 1.1
host: 127.0.0.1:9101             host: vidu.com
connection: close                (khong co)
user-agent: curl/8.5.0           user-agent: curl/8.5.0
accept: */*                      accept: */*
x-tu-client: gia-tri             x-tu-client: gia-tri
                                 x-co-gach_duoi: co
^ THIEU han header co gach duoi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">HTTP/1.0 to the upstream</span><span class="lz-d">The default is <code>proxy_http_version 1.0</code>. That means no connection reuse, no chunked request bodies, and no <code>Upgrade</code> — so WebSockets cannot work until you change it. Set <code>proxy_http_version 1.1;</code> on every proxy block you write.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Host is replaced with the upstream address</span><span class="lz-d">Your application sees <code>127.0.0.1:9101</code>, not <code>vidu.com</code>. Anything it builds from <code>Host</code> — absolute links, cookie domains, multi-tenant routing — is wrong until you add <code>proxy_set_header Host \$host;</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Connection: close on every request</span><span class="lz-d">A consequence of HTTP/1.0: a fresh TCP connection per request to your own backend. At any real traffic level that is measurable overhead and a source of ephemeral-port exhaustion. Fixed by 1.1 plus <code>proxy_set_header Connection "";</code> and a <code>keepalive</code> in the upstream block.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Headers with underscores are silently dropped</span><span class="lz-d"><code>X-Co-Gach_duoi</code> reached the upstream when called directly and vanished through the proxy. <code>underscores_in_headers</code> defaults to <code>off</code>, and nothing logs the removal. This is the hardest of the four to diagnose because the header is simply not there.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — the underscore rule costs hours because nothing anywhere reports it.</strong> The application says the header is missing, the client swears it sent it, and <code>curl</code> against the backend directly proves the client right. The cause is a default written when underscores in header names were a CGI hazard. Two ways out: rename the header to use hyphens, which is what the standard prefers anyway and is the fix you should choose; or set <code>underscores_in_headers on;</code> at <code>http</code> or <code>server</code> level — it is not valid inside a <code>location</code>, which is itself a common half-hour. Renaming is better because the next proxy in the chain may have the same default.</p>
</div>

<h3>The block that fixes all four</h3>
<pre><code>location /api/ {
  proxy_http_version 1.1;                       <span class="tok-comment"># sửa #1, #3 và mở đường cho WebSocket</span>
  proxy_set_header Host              \$host;     <span class="tok-comment"># sửa #2</span>
  proxy_set_header Connection        "";        <span class="tok-comment"># sửa #3 — cho phép giữ kết nối</span>
  proxy_set_header X-Real-IP         \$remote_addr;
  proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto \$scheme;
  proxy_set_header X-Forwarded-Host  \$host;
  proxy_pass http://api_upstream/;
}</code></pre>
<div class="out">=== Do lai qua khoi tren ===
httpVersion: 1.1
host: vidu.com
x-real-ip: 127.0.0.1
x-forwarded-for: 127.0.0.1
x-forwarded-proto: http
x-forwarded-host: vidu.com
x-tu-client: gia-tri
x-co-gach_duoi: co            (voi underscores_in_headers on)</div>

<h3>X-Forwarded-For is a list, and the client writes the first entry</h3>
<div class="out">$ curl -H 'X-Forwarded-For: 1.2.3.4' ...     &lt;- client TU BIA ra dong nay

x-forwarded-for: 1.2.3.4, 127.0.0.1
                 ^^^^^^^ do KE GOI viet   ^^^^^^^^^ do Nginx them vao
x-real-ip:       127.0.0.1                &lt;- dia chi TCP that, khong bia duoc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">$proxy_add_x_forwarded_for appends, it does not replace</span><span class="v">It is defined as "the incoming header, comma, <code>\$remote_addr</code>". That is correct behaviour for a proxy chain and it means the leftmost entry came from whoever called you — which, at the edge, is the client. Reading <code>xff.split(',')[0]</code> is the standard idiom and it reads exactly the value an attacker chose.</span></div>
  <div class="kv"><span class="k">At the edge, use $remote_addr and nothing else</span><span class="v">If Nginx is the first thing the internet reaches, <code>\$remote_addr</code> is the TCP peer address and cannot be forged over TCP. Pass it as <code>X-Real-IP</code> and have the application trust that, not the list. Rate limits, allowlists and audit logs should all key on it.</span></div>
  <div class="kv"><span class="k">Behind a CDN, the trust boundary moves — declare it</span><span class="v">When a real proxy sits in front, <code>\$remote_addr</code> is the CDN and the client address is inside the header. That is what <code>set_real_ip_from</code> plus <code>real_ip_header</code> are for: list the CDN's ranges and Nginx rewrites <code>\$remote_addr</code> to the real client for you.</span></div>
  <div class="kv"><span class="k">Overly wide trust hands the attacker $remote_addr itself</span><span class="v">Measured: with <code>set_real_ip_from 127.0.0.1;</code> on a server reachable from localhost, a forged <code>X-Forwarded-For: 1.2.3.4</code> made <code>\$remote_addr</code> become <code>1.2.3.4</code>. Every downstream defence keyed on the client IP then trusts a value the caller picked. Trust exactly the addresses of proxies you operate — never a whole private range "to be safe".</span></div>
</div>
<div class="out">=== KHONG co set_real_ip_from (mac dinh) ===
  x-real-ip       ($remote_addr) : 127.0.0.1
  x-forwarded-for                : 1.2.3.4, 127.0.0.1

=== CO set_real_ip_from 127.0.0.1 ===
  x-real-ip       ($remote_addr) : 1.2.3.4      &lt;- BI GIA MAO
  x-forwarded-for                : 1.2.3.4, 1.2.3.4</div>

<h3>Two more defaults worth knowing before they bite</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hop-by-hop headers are removed on purpose</span><span class="lz-lnote"><code>Connection</code>, <code>Keep-Alive</code>, <code>Transfer-Encoding</code>, <code>Upgrade</code> and <code>TE</code> describe one hop, not the whole journey, so a proxy must not copy them. This is correct and required — and it is why WebSockets need an explicit <code>Upgrade</code> re-injection, which is Lesson 3.5.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_set_header replaces the whole inherited list</span><span class="lz-lnote">The same array rule as <code>add_header</code> in Lesson 2.3: one <code>proxy_set_header</code> in a block discards every one inherited from <code>server</code> or <code>http</code>. Keep the set in a snippet file and <code>include</code> it, or repeat it in full.</span></div>
  <div class="lz-layer"><span class="lz-lname">Setting a header to "" removes it</span><span class="lz-lnote"><code>proxy_set_header X-Bi-Mat "";</code> deletes it from the upstream request. This is the way to strip a header a client sent — a client-supplied <code>X-Real-IP</code> or <code>X-Admin</code>, for example — so your application can never see the forged copy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Response headers come back from the upstream untouched</span><span class="lz-lnote">Except a small hidden list. If the upstream sends <code>Set-Cookie</code> with a wrong <code>Domain</code>, or a <code>Location</code> pointing at the internal address, Nginx forwards it as-is — <code>proxy_redirect</code> and <code>proxy_cookie_domain</code> exist for exactly those two cases.</span></div>
</div>
<div class="note-ct">
<p><strong>The one habit that makes this chapter easy.</strong> Keep a three-line echo server around, or an endpoint in your own app that returns <code>req.headers</code>. Point the proxy at it whenever something behind Nginx behaves strangely, and read what actually arrived. Every measurement in this lesson took one <code>curl</code>, and each one replaced a guess that would have sounded reasonable.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header" target="_blank" rel="noopener"><span class="lc-ico">📮</span><span class="lc-body"><span class="lc-title">nginx — proxy_set_header</span><span class="lc-sub">nginx.org · The defaults, the empty-string removal, and the inheritance rule</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">nginx — the real_ip module</span><span class="lc-sub">nginx.org · set_real_ip_from, real_ip_header and real_ip_recursive</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — X-Forwarded-For</span><span class="lc-sub">developer.mozilla.org · The list format and the security note about the leftmost value</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Why a rate limit keyed on a spoofable IP is not a rate limit</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Spoof X-Forwarded-For through your own proxy, then widen set_real_ip_from and watch $remote_addr move</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mặc định Nginx gửi gì lên upstream, và bốn thứ làm bạn bất ngờ</h2>
<p class="lead">Một con proxy KHÔNG chuyển tiếp request của bạn — nó tạo ra một request MỚI. Header nào được chép, đổi hay vứt là do những giá trị mặc định có từ trước phần lớn những thứ bạn sẽ đặt sau nó. Đây là cùng một request nhìn từ cả hai phía.</p>

<h3>Cùng một request, gọi thẳng và gọi qua proxy</h3>
<div class="out">$ curl -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co' ...

QUA PROXY (mac dinh)             GOI THANG VAO UPSTREAM
httpVersion: 1.0                 httpVersion: 1.1
host: 127.0.0.1:9101             host: vidu.com
connection: close                (khong co)
user-agent: curl/8.5.0           user-agent: curl/8.5.0
accept: */*                      accept: */*
x-tu-client: gia-tri             x-tu-client: gia-tri
                                 x-co-gach_duoi: co
^ THIEU han header co gach duoi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nói HTTP/1.0 với upstream</span><span class="lz-d">Mặc định là <code>proxy_http_version 1.0</code>. Nghĩa là KHÔNG tái dùng kết nối, KHÔNG gửi được thân request dạng chunked, và KHÔNG có <code>Upgrade</code> — nên WebSocket không thể chạy cho tới khi bạn đổi nó. Hãy đặt <code>proxy_http_version 1.1;</code> vào MỌI khối proxy bạn viết.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Host bị THAY bằng địa chỉ upstream</span><span class="lz-d">Ứng dụng của bạn nhìn thấy <code>127.0.0.1:9101</code> chứ không phải <code>vidu.com</code>. Mọi thứ nó dựng từ <code>Host</code> — đường dẫn tuyệt đối, domain của cookie, định tuyến nhiều khách thuê — đều SAI cho tới khi bạn thêm <code>proxy_set_header Host \$host;</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Connection: close ở mọi request</span><span class="lz-d">Hệ quả của HTTP/1.0: một kết nối TCP mới toanh cho MỖI request tới backend của chính bạn. Ở mức lưu lượng thật thì đó là phí tổn đo được và là một nguồn cạn cổng tạm. Chữa bằng 1.1 cộng <code>proxy_set_header Connection "";</code> và một dòng <code>keepalive</code> trong khối upstream.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Header có gạch dưới bị VỨT trong im lặng</span><span class="lz-d"><code>X-Co-Gach_duoi</code> tới được upstream khi gọi thẳng và BIẾN MẤT khi qua proxy. <code>underscores_in_headers</code> mặc định là <code>off</code>, và không có gì ghi lại vụ xoá đó. Đây là cái khó chẩn đoán nhất trong bốn cái, vì cái header đơn giản là KHÔNG có ở đó.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — cái luật gạch dưới ngốn hàng giờ vì chẳng có chỗ nào báo cả.</strong> Ứng dụng bảo thiếu header, client thề là đã gửi, và một cú <code>curl</code> thẳng vào backend chứng minh client nói đúng. Nguyên nhân là một giá trị mặc định viết ra từ thời gạch dưới trong tên header còn là một mối nguy của CGI. Hai lối ra: ĐỔI TÊN header sang dùng gạch ngang, vốn cũng là thứ chuẩn ưa chuộng và là cách bạn NÊN chọn; hoặc đặt <code>underscores_in_headers on;</code> ở tầng <code>http</code> hay <code>server</code> — nó KHÔNG hợp lệ bên trong <code>location</code>, và bản thân điều đó là một nửa tiếng thường mất. Đổi tên tốt hơn, vì con proxy tiếp theo trong chuỗi có thể cũng mang đúng cái mặc định ấy.</p>
</div>

<h3>Khối vá sạch cả bốn</h3>
<pre><code>location /api/ {
  proxy_http_version 1.1;                       <span class="tok-comment"># sửa #1, #3 và mở đường cho WebSocket</span>
  proxy_set_header Host              \$host;     <span class="tok-comment"># sửa #2</span>
  proxy_set_header Connection        "";        <span class="tok-comment"># sửa #3 — cho phép giữ kết nối</span>
  proxy_set_header X-Real-IP         \$remote_addr;
  proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto \$scheme;
  proxy_set_header X-Forwarded-Host  \$host;
  proxy_pass http://api_upstream/;
}</code></pre>
<div class="out">=== Do lai qua khoi tren ===
httpVersion: 1.1
host: vidu.com
x-real-ip: 127.0.0.1
x-forwarded-for: 127.0.0.1
x-forwarded-proto: http
x-forwarded-host: vidu.com
x-tu-client: gia-tri
x-co-gach_duoi: co            (voi underscores_in_headers on)</div>

<h3>X-Forwarded-For là một DANH SÁCH, và client viết mục ĐẦU TIÊN</h3>
<div class="out">$ curl -H 'X-Forwarded-For: 1.2.3.4' ...     &lt;- client TU BIA ra dong nay

x-forwarded-for: 1.2.3.4, 127.0.0.1
                 ^^^^^^^ do KE GOI viet   ^^^^^^^^^ do Nginx them vao
x-real-ip:       127.0.0.1                &lt;- dia chi TCP that, khong bia duoc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">$proxy_add_x_forwarded_for NỐI THÊM, nó không thay thế</span><span class="v">Nó được định nghĩa là "header nhận vào, dấu phẩy, <code>\$remote_addr</code>". Đó là hành vi ĐÚNG cho một chuỗi proxy, và nó nghĩa là mục ngoài cùng bên trái tới từ bất cứ ai gọi bạn — mà ở rìa mạng thì đó chính là client. Đọc <code>xff.split(',')[0]</code> là cách viết chuẩn mực ai cũng dùng, và nó đọc đúng cái giá trị kẻ tấn công tự chọn.</span></div>
  <div class="kv"><span class="k">Ở rìa mạng, dùng $remote_addr và KHÔNG dùng gì khác</span><span class="v">Nếu Nginx là thứ đầu tiên Internet chạm tới thì <code>\$remote_addr</code> là địa chỉ TCP đối tác và KHÔNG giả mạo được qua TCP. Hãy chuyển nó lên dạng <code>X-Real-IP</code> và bảo ứng dụng tin cái đó chứ đừng tin cái danh sách. Giới hạn tần suất, danh sách cho phép và log kiểm toán đều nên khoá theo nó.</span></div>
  <div class="kv"><span class="k">Đứng sau một CDN thì ranh giới tin cậy DỜI ĐI — hãy khai báo nó</span><span class="v">Khi có một con proxy thật đứng trước, <code>\$remote_addr</code> là CDN còn địa chỉ client nằm TRONG cái header. Đó chính là việc của <code>set_real_ip_from</code> cộng <code>real_ip_header</code>: khai các dải của CDN ra và Nginx viết lại <code>\$remote_addr</code> thành client thật giùm bạn.</span></div>
  <div class="kv"><span class="k">Tin quá rộng là trao luôn $remote_addr cho kẻ tấn công</span><span class="v">Đo thật: với <code>set_real_ip_from 127.0.0.1;</code> trên một máy chủ chạm được từ localhost, một cái <code>X-Forwarded-For: 1.2.3.4</code> bịa ra đã làm <code>\$remote_addr</code> thành <code>1.2.3.4</code>. Mọi tuyến phòng thủ phía sau khoá theo IP client thế là đi tin một giá trị do người gọi tự chọn. Hãy tin ĐÚNG những địa chỉ của các proxy do CHÍNH BẠN vận hành — đừng bao giờ khai cả một dải nội bộ "cho chắc".</span></div>
</div>
<div class="out">=== KHONG co set_real_ip_from (mac dinh) ===
  x-real-ip       ($remote_addr) : 127.0.0.1
  x-forwarded-for                : 1.2.3.4, 127.0.0.1

=== CO set_real_ip_from 127.0.0.1 ===
  x-real-ip       ($remote_addr) : 1.2.3.4      &lt;- BI GIA MAO
  x-forwarded-for                : 1.2.3.4, 1.2.3.4</div>

<h3>Hai giá trị mặc định nữa đáng biết trước khi bị cắn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Header từng-chặng bị bỏ đi một cách CÓ CHỦ Ý</span><span class="lz-lnote"><code>Connection</code>, <code>Keep-Alive</code>, <code>Transfer-Encoding</code>, <code>Upgrade</code> và <code>TE</code> mô tả MỘT chặng chứ không mô tả cả hành trình, nên một con proxy KHÔNG được chép chúng. Điều này đúng và bắt buộc — và nó là lý do WebSocket cần được tiêm lại <code>Upgrade</code> một cách tường minh, tức Bài 3.5.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_set_header THAY THẾ nguyên danh sách thừa hưởng</span><span class="lz-lnote">Vẫn cái luật mảng như <code>add_header</code> ở Bài 2.3: MỘT dòng <code>proxy_set_header</code> trong một khối là vứt hết mọi dòng thừa hưởng từ <code>server</code> hay <code>http</code>. Hãy giữ cả bộ trong một file snippet rồi <code>include</code>, hoặc chép lại đủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đặt một header thành "" là XOÁ nó</span><span class="lz-lnote"><code>proxy_set_header X-Bi-Mat "";</code> xoá nó khỏi request gửi lên upstream. Đây là cách để LỘT một header do client gửi — ví dụ một cái <code>X-Real-IP</code> hay <code>X-Admin</code> do client tự đặt — để ứng dụng của bạn không bao giờ nhìn thấy bản giả.</span></div>
  <div class="lz-layer"><span class="lz-lname">Header phản hồi từ upstream đi ngược ra mà KHÔNG bị đụng</span><span class="lz-lnote">Trừ một danh sách ẩn nhỏ. Nếu upstream gửi <code>Set-Cookie</code> với <code>Domain</code> sai, hay một <code>Location</code> trỏ vào địa chỉ nội bộ, Nginx chuyển tiếp y nguyên — <code>proxy_redirect</code> và <code>proxy_cookie_domain</code> tồn tại đúng cho hai ca đó.</span></div>
</div>
<div class="note-ct">
<p><strong>Thói quen duy nhất làm cả chương này dễ đi.</strong> Hãy giữ sẵn một máy chủ vọng lại ba dòng, hoặc một điểm cuối trong chính ứng dụng của bạn biết trả về <code>req.headers</code>. Chĩa proxy vào nó mỗi khi có thứ gì đứng sau Nginx cư xử lạ, rồi ĐỌC xem cái gì thực sự tới nơi. Mọi phép đo trong bài này tốn đúng một lệnh <code>curl</code>, và mỗi cái đều thay thế một phỏng đoán mà nghe ra thì rất hợp lý.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header" target="_blank" rel="noopener"><span class="lc-ico">📮</span><span class="lc-body"><span class="lc-title">nginx — proxy_set_header</span><span class="lc-sub">nginx.org · Các mặc định, phép xoá bằng chuỗi rỗng, và luật thừa hưởng</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">nginx — module real_ip</span><span class="lc-sub">nginx.org · set_real_ip_from, real_ip_header và real_ip_recursive</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — X-Forwarded-For</span><span class="lc-sub">developer.mozilla.org · Dạng danh sách và ghi chú an ninh về giá trị ngoài cùng trái</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Vì sao một giới hạn tần suất khoá theo IP giả mạo được thì không phải giới hạn</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Giả mạo X-Forwarded-For qua proxy của chính bạn, rồi nới set_real_ip_from và xem $remote_addr dời đi</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Buffering, and what actually breaks streaming|||3.3 — Đệm, và cái gì THỰC SỰ làm hỏng luồng chảy',
      slug: 'nginx-3-3-dem-va-luong-chay',
      type: 'LESSON',
      description: 'Lời khuyên phổ biến là "SSE không chảy sau Nginx thì tắt proxy_buffering". Bài này đo sáu cấu hình bằng một upstream nhả bốn mẩu cách nhau 400ms và một đầu dò đọc thẳng ở tầng socket — hoá ra proxy_buffering MỘT MÌNH không hề chặn luồng, còn thủ phạm thật thì nằm chỗ khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Buffering, and what actually breaks streaming</h2>
<p class="lead">Every guide to server-sent events behind Nginx says the same thing: turn off <code>proxy_buffering</code>. It is repeated so often that nobody measures it. So here is the measurement — an upstream that emits four chunks 400ms apart, and a client that reads raw bytes off the socket and timestamps each packet.</p>

<h3>Six configurations, timed at the socket</h3>
<div class="out">Upstream nha 4 manh, moi manh cach nhau 400ms.
Dau do doc thang tu socket va dong dau thoi diem tung goi toi.

1) GOI THANG upstream                    goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
2) Qua proxy, proxy_buffering ON         goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
3) Qua proxy, proxy_buffering OFF        goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s

   ^^^ proxy_buffering KHONG he chan luong. Ca ba y het nhau.

4) gzip ON + buffering ON, client xin gzip    goi #1 1.60s   ... HET. MOT goi duy nhat.
5) gzip ON + buffering OFF, client xin gzip   goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
6) gzip OFF trong location, client xin gzip   goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s</div>
<div class="callout warn">
<p><strong>The received wisdom is aimed at the wrong directive.</strong> Rows 2 and 3 are identical: with buffering on, Nginx still forwards each chunk as it arrives — it fills a buffer and passes it along, it does not wait for the response to end. What collapsed the stream into one packet was row 4, where <code>gzip</code> was compressing the response. The compressor needs input to work with, so it holds output back until it has enough or until the stream ends. Turning off <code>proxy_buffering</code> does fix it (row 5) — but it fixes it by accident, and it costs you the slow-client protection that buffering exists for.</p>
</div>

<h3>What proxy_buffering is actually for</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It frees the upstream connection early</span><span class="lz-d">With buffering on, Nginx reads the whole response as fast as the upstream can produce it, then feeds it to the client at the client's pace. Your application worker is released in milliseconds instead of being held for the length of a slow mobile download.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">That is the entire point of putting Nginx in front</span><span class="lz-d">Section 0 measured Nginx and Node at similar speeds for one request. This is where the difference lives: a Node process serving a 3MB file to a slow phone is a blocked worker; Nginx holding that same download is a few kilobytes of buffer.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Buffers spill to disk when the response is big</span><span class="lz-d">The default is <code>proxy_buffers 8 4k</code> — eight pages. A response bigger than that goes to <code>proxy_temp_path</code> until the client has caught up, bounded by <code>proxy_max_temp_file_size</code>. That is a real disk write on a real disk, which matters on a small VPS.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Turning it off gives all of that back</span><span class="lz-d">With <code>proxy_buffering off</code>, the upstream connection stays open for as long as the slowest client takes. For a streaming endpoint that is correct — the connection is long-lived by design. For everything else it is a regression.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — turning off buffering globally to fix one endpoint is a trade you almost never want.</strong> The streaming endpoint is one route; the setting applies to every response in scope. On a site behind Nginx, that converts every large download into a held upstream worker, which is precisely the failure mode you deployed Nginx to avoid. Fix it at the route: put <code>proxy_buffering off;</code> inside the <code>location</code> that streams, or better, let the upstream declare it per-response — measured below.</p>
</div>

<h3>The fix the application can apply by itself</h3>
<div class="out">Upstream tra ve header nay tren dung nhung phan hoi can chay dan:

    X-Accel-Buffering: no

Do that, gzip VAN dang bat o Nginx, KHONG doi mot dong cau hinh nao:

  co X-Accel-Buffering: no    goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
  khong co header do          goi #1 1.60s  ... het</div>
<div class="kv-grid">
  <div class="kv"><span class="k">X-Accel-Buffering is per-response and comes from your code</span><span class="v">Nginx reads it, disables buffering and compression for that response, and strips it before the client sees it. It means the team that owns the streaming endpoint can fix streaming without an Nginx change, a reload, or a conversation with whoever holds the config.</span></div>
  <div class="kv"><span class="k">If you do configure it in Nginx, scope it to the location</span><span class="v"><code>location /su-kien/ { proxy_buffering off; gzip off; proxy_read_timeout 1h; }</code> — those three lines together, not <code>proxy_buffering off</code> alone at the top of the file. The timeout matters as much as the rest, and it is Lesson 3.4.</span></div>
  <div class="kv"><span class="k">Compressing an event stream is not worth it anyway</span><span class="v">Events are small and arrive one at a time, which is the case compression is worst at. <code>gzip_types</code> should simply not include <code>text/event-stream</code>, and then row 4 cannot happen to you regardless of buffering.</span></div>
  <div class="kv"><span class="k">Watch for the same behaviour from other filters</span><span class="v"><code>sub_filter</code>, <code>ssi</code> and any module that rewrites the body have the same shape: they need content before they can emit content. If a stream stalls and gzip is already off, look for another body filter in scope before blaming the proxy.</span></div>
</div>

<h3>Sizing the buffers when you keep them on</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">proxy_buffer_size — just the response headers</span><span class="lz-lnote">Defaults to one page. An upstream that sends unusually large headers — a big <code>Set-Cookie</code>, a long <code>Link</code>, a verbose auth token — overflows it and produces <code>upstream sent too big header</code> in the error log. That message means this setting, and only this one.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_buffers — the body, in memory</span><span class="lz-lnote"><code>8 4k</code> by default, so 32KB per in-flight request. Raising it costs memory per concurrent request, so multiply before you type: 1000 concurrent requests at <code>16 16k</code> is 256MB of buffers.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_busy_buffers_size — how much may be sending at once</span><span class="lz-lnote">The portion that can be handed to the client while the rest keeps filling. Rarely worth touching; if you raise <code>proxy_buffers</code> a lot and see no improvement, this is the ceiling you have hit.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_max_temp_file_size — the disk ceiling</span><span class="lz-lnote">1GB by default. Set it to <code>0</code> to forbid spilling entirely, which turns a large slow download back into a held upstream connection — the right choice only when your disk is more precious than your workers, which on a small VPS it sometimes is.</span></div>
</div>
<div class="note-ct">
<p><strong>Why this lesson exists.</strong> The first version of it was going to repeat the standard advice, because the standard advice is everywhere and it does make the symptom go away. Rows 2 and 3 are why it does not appear here: the same measurement that would have confirmed the folklore refuted it in about a minute. When something behind a proxy behaves strangely, the socket-level timestamp is cheap, and it is the only thing in this chapter that cannot be wrong.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">nginx — proxy_buffering and the buffer sizes</span><span class="lc-sub">nginx.org · Including the X-Accel-Buffering paragraph</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗜️</span><span class="lc-body"><span class="lc-title">nginx — the gzip module</span><span class="lc-sub">nginx.org · gzip_types, and why the default list matters here</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">MDN — Server-sent events</span><span class="lc-sub">developer.mozilla.org · What the client expects, and why one late packet ruins it</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Streams, backpressure, and what a held response costs your event loop</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reproduce all six rows with the socket probe, then fix the stream three different ways</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Đệm, và cái gì THỰC SỰ làm hỏng luồng chảy</h2>
<p class="lead">Mọi bài hướng dẫn về server-sent events đứng sau Nginx đều nói cùng một câu: tắt <code>proxy_buffering</code> đi. Nó được nhắc lại nhiều tới mức chẳng ai đi đo. Thế thì đây là phép đo — một upstream nhả bốn mẩu cách nhau 400ms, và một client đọc byte thô ngay trên socket rồi đóng dấu thời gian từng gói.</p>

<h3>Sáu cấu hình, bấm giờ ngay tại socket</h3>
<div class="out">Upstream nha 4 manh, moi manh cach nhau 400ms.
Dau do doc thang tu socket va dong dau thoi diem tung goi toi.

1) GOI THANG upstream                    goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
2) Qua proxy, proxy_buffering ON         goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
3) Qua proxy, proxy_buffering OFF        goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s

   ^^^ proxy_buffering KHONG he chan luong. Ca ba y het nhau.

4) gzip ON + buffering ON, client xin gzip    goi #1 1.60s   ... HET. MOT goi duy nhat.
5) gzip ON + buffering OFF, client xin gzip   goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
6) gzip OFF trong location, client xin gzip   goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s</div>
<div class="callout warn">
<p><strong>Cái khôn ngoan truyền miệng đang nhắm vào SAI chỉ thị.</strong> Dòng 2 và 3 y hệt nhau: bật đệm thì Nginx VẪN chuyển tiếp từng mẩu ngay khi nó tới — nó đổ đầy một cái đệm rồi đẩy đi luôn, nó KHÔNG chờ phản hồi kết thúc. Thứ bóp cả luồng thành một gói là dòng 4, nơi <code>gzip</code> đang nén phản hồi. Bộ nén cần có đầu vào mới làm việc được, nên nó giữ đầu ra lại cho tới khi đủ nhiều hoặc cho tới khi luồng hết. Tắt <code>proxy_buffering</code> ĐÚNG là chữa được (dòng 5) — nhưng nó chữa một cách tình cờ, và nó lấy mất của bạn cái lá chắn trước client chậm, thứ mà đệm sinh ra để làm.</p>
</div>

<h3>proxy_buffering thật ra để làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó GIẢI PHÓNG kết nối upstream sớm</span><span class="lz-d">Bật đệm thì Nginx đọc trọn phản hồi nhanh hết mức upstream sản xuất được, rồi mớm lại cho client theo nhịp của client. Worker của ứng dụng bạn được thả ra sau vài mili giây thay vì bị giữ suốt cả một lượt tải chậm trên mạng di động.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đó là TOÀN BỘ lý do đặt Nginx ra đằng trước</span><span class="lz-d">Mục 0 đo thấy Nginx và Node nhanh xấp xỉ nhau với MỘT request. Khác biệt nằm ở đây: một tiến trình Node phục vụ một tệp 3MB cho một cái điện thoại chậm là một worker bị chẹn; còn Nginx giữ đúng lượt tải đó chỉ tốn vài kilobyte đệm.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đệm TRÀN ra đĩa khi phản hồi lớn</span><span class="lz-d">Mặc định là <code>proxy_buffers 8 4k</code> — tám trang bộ nhớ. Phản hồi lớn hơn thế thì đi vào <code>proxy_temp_path</code> cho tới khi client đuổi kịp, chặn trên bởi <code>proxy_max_temp_file_size</code>. Đó là một lượt ghi đĩa THẬT trên một cái đĩa THẬT, và điều đó có nghĩa lý trên một con VPS nhỏ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tắt nó đi là trả lại HẾT những thứ trên</span><span class="lz-d">Với <code>proxy_buffering off</code>, kết nối upstream nằm mở đúng bằng thời gian client chậm nhất cần. Với một điểm cuối chảy dần thì thế là ĐÚNG — kết nối vốn dĩ sống lâu theo thiết kế. Với mọi thứ khác thì đó là một bước lùi.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — tắt đệm ở TẦM TOÀN CỤC để chữa MỘT điểm cuối là một cuộc đổi chác gần như không bao giờ bạn muốn.</strong> Cái điểm cuối chảy dần là MỘT tuyến; còn cái thiết lập kia áp cho MỌI phản hồi trong phạm vi. Trên một site đứng sau Nginx, nó biến mọi lượt tải lớn thành một worker upstream bị giữ, mà đó đúng là kiểu hỏng bạn triển khai Nginx để tránh. Hãy chữa ngay tại tuyến: đặt <code>proxy_buffering off;</code> BÊN TRONG cái <code>location</code> chảy dần, hoặc hay hơn nữa, để chính upstream tự khai theo từng phản hồi — đo ở dưới.</p>
</div>

<h3>Cách chữa mà ứng dụng tự làm được</h3>
<div class="out">Upstream tra ve header nay tren dung nhung phan hoi can chay dan:

    X-Accel-Buffering: no

Do that, gzip VAN dang bat o Nginx, KHONG doi mot dong cau hinh nao:

  co X-Accel-Buffering: no    goi #1 0.40s  #2 0.80s  #3 1.20s  #4 1.60s
  khong co header do          goi #1 1.60s  ... het</div>
<div class="kv-grid">
  <div class="kv"><span class="k">X-Accel-Buffering đi theo TỪNG phản hồi và tới từ MÃ của bạn</span><span class="v">Nginx đọc nó, tắt đệm và tắt nén cho đúng phản hồi đó, rồi LỘT nó ra trước khi client nhìn thấy. Nghĩa là đội sở hữu cái điểm cuối chảy dần có thể tự chữa việc chảy dần mà không cần đổi Nginx, không cần nạp lại, không cần một cuộc trao đổi với người đang giữ file cấu hình.</span></div>
  <div class="kv"><span class="k">Nếu bạn vẫn cấu hình ở Nginx thì hãy KHOANH nó vào location</span><span class="v"><code>location /su-kien/ { proxy_buffering off; gzip off; proxy_read_timeout 1h; }</code> — ba dòng đó ĐI CÙNG NHAU, chứ không phải mỗi <code>proxy_buffering off</code> đặt ở đầu file. Cái timeout quan trọng ngang phần còn lại, và nó là Bài 3.4.</span></div>
  <div class="kv"><span class="k">Nén một luồng sự kiện thì dù sao cũng chẳng bõ</span><span class="v">Sự kiện thì nhỏ và tới từng cái một, mà đó đúng là ca bộ nén dở nhất. <code>gzip_types</code> đơn giản là KHÔNG nên có <code>text/event-stream</code>, và thế là dòng 4 không thể xảy ra với bạn, bất kể đệm bật hay tắt.</span></div>
  <div class="kv"><span class="k">Để ý cùng hành vi đó ở các bộ lọc khác</span><span class="v"><code>sub_filter</code>, <code>ssi</code> và mọi module viết lại thân phản hồi đều mang cùng hình dạng: chúng cần có nội dung rồi mới nhả nội dung ra được. Nếu một luồng đứng khựng mà gzip đã tắt rồi thì hãy đi tìm một bộ lọc thân khác trong phạm vi, đừng đổ cho con proxy.</span></div>
</div>

<h3>Chỉnh kích thước đệm khi bạn vẫn giữ nó bật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">proxy_buffer_size — chỉ dành cho HEADER phản hồi</span><span class="lz-lnote">Mặc định một trang bộ nhớ. Một upstream gửi header to bất thường — một cái <code>Set-Cookie</code> bự, một cái <code>Link</code> dài, một token xác thực lê thê — sẽ làm tràn nó và sinh ra <code>upstream sent too big header</code> trong error log. Thông báo đó nói về ĐÚNG thiết lập này, và không nói về cái nào khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_buffers — phần THÂN, nằm trong bộ nhớ</span><span class="lz-lnote">Mặc định <code>8 4k</code>, tức 32KB cho mỗi request đang bay. Nâng nó lên là tốn bộ nhớ theo TỪNG request đồng thời, nên hãy nhân trước khi gõ: 1000 request đồng thời ở mức <code>16 16k</code> là 256MB đệm.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_busy_buffers_size — được phép đang GỬI bao nhiêu cùng lúc</span><span class="lz-lnote">Phần có thể trao cho client trong khi phần còn lại vẫn đang được đổ đầy. Hiếm khi đáng động vào; nếu bạn nâng <code>proxy_buffers</code> lên nhiều mà chẳng khá hơn thì đây là cái trần bạn vừa chạm.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_max_temp_file_size — cái trần trên ĐĨA</span><span class="lz-lnote">Mặc định 1GB. Đặt <code>0</code> là cấm tràn ra đĩa hoàn toàn, và nó biến một lượt tải lớn và chậm trở lại thành một kết nối upstream bị giữ — lựa chọn đúng CHỈ khi cái đĩa của bạn quý hơn đám worker, mà trên một con VPS nhỏ thì đôi khi đúng là thế.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao bài này tồn tại.</strong> Bản đầu tiên của nó định nhắc lại lời khuyên tiêu chuẩn, vì lời khuyên tiêu chuẩn ở khắp nơi và nó THẬT SỰ làm triệu chứng biến mất. Dòng 2 và 3 là lý do nó không xuất hiện ở đây: đúng cái phép đo lẽ ra để xác nhận cái truyền miệng ấy đã bác bỏ nó trong khoảng một phút. Khi có thứ gì đứng sau proxy cư xử lạ thì dấu thời gian ở tầng socket rất rẻ, và nó là thứ duy nhất trong cả chương này KHÔNG THỂ sai.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">nginx — proxy_buffering và các kích thước đệm</span><span class="lc-sub">nginx.org · Kèm cả đoạn về X-Accel-Buffering</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗜️</span><span class="lc-body"><span class="lc-title">nginx — module gzip</span><span class="lc-sub">nginx.org · gzip_types, và vì sao danh sách mặc định có ý nghĩa ở đây</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">MDN — Server-sent events</span><span class="lc-sub">developer.mozilla.org · Client mong đợi gì, và vì sao một gói tới muộn là hỏng hết</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Stream, áp lực ngược, và một phản hồi bị giữ tốn gì của vòng lặp sự kiện</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng lại đủ sáu dòng bằng đầu dò socket, rồi chữa cái luồng theo ba cách khác nhau</span></span></a>
</div>
`,
    },
  ],
};
