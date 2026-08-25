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
<pre><code>location /a/ { proxy_pass http://127.0.0.1:9101; }        <span class="tok-comment"># NO path</span>
location /b/ { proxy_pass http://127.0.0.1:9101/; }       <span class="tok-comment"># path = /</span>
location /c/ { proxy_pass http://127.0.0.1:9101/khac/; }  <span class="tok-comment"># path = /other/</span>
location /d  { proxy_pass http://127.0.0.1:9101/xxx; }    <span class="tok-comment"># no trailing / on either side</span></code></pre>
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
<p><strong>Trap — the substituting form works on the <em>matched prefix</em>, so the two slashes have to agree.</strong> <code>location /b/</code> with <code>proxy_pass http://up/;</code> is correct: <code>/b/nguoi</code> becomes <code>/nguoi</code>. But <code>location /b</code> (no slash) with <code>proxy_pass http://up/;</code> turns <code>/b/nguoi</code> into <code>//nguoi</code> — a doubled slash that many frameworks treat as a different route, and some reject. The habit that never bites: write both with a trailing slash, or write neither. And if you must handle the bare <code>/b</code> too, add <code>location = /b { return 301 /b/; }</code> beside it rather than dropping the slash from the main block.</p>
</div>

<h3>The rule that quietly stops applying</h3>
<pre><code><span class="tok-comment"># In a REGEX location, proxy_pass may NOT carry a path.</span>
location ~ ^/anh/(.+)\$ {
  proxy_pass http://127.0.0.1:9101/media/\$1;   <span class="tok-comment"># rebuilt BY HAND from the capture group</span>
}

<span class="tok-comment"># And if the block contains a rewrite, what gets sent is the URI AFTER the rewrite:</span>
location /cu/ {
  rewrite ^/cu/(.*)\$ /moi/\$1 break;
  proxy_pass http://127.0.0.1:9101;            <span class="tok-comment"># sends /new/... and not /old/...</span>
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
<p><strong>Trap — the underscore rule costs hours because nothing anywhere reports it.</strong> The application says the header is missing, the client swears it sent it, and <code>curl</code> against the backend directly proves the client right. The cause is a default written when underscores in header names were a CGI hazard. Two ways out: rename the header to use hyphens, which is what the standard prefers anyway and is the fix you should choose; or set <code>underscores_in_headers on;</code> at <code>http</code> or <code>server</code> level — it is not valid inside a <code>location</code>, which is itself a common half-hour. Renaming is better because the next proxy in the chain may have the same default.</p>
</div>

<h3>The block that fixes all four</h3>
<pre><code>location /api/ {
  proxy_http_version 1.1;                       <span class="tok-comment"># fixes #1, #3 and opens the way for WebSocket</span>
  proxy_set_header Host              \$host;     <span class="tok-comment"># fixes #2</span>
  proxy_set_header Connection        "";        <span class="tok-comment"># fixes #3 — allows the connection to be held</span>
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
<p><strong>Trap — turning off buffering globally to fix one endpoint is a trade you almost never want.</strong> The streaming endpoint is one route; the setting applies to every response in scope. On a site behind Nginx, that converts every large download into a held upstream worker, which is precisely the failure mode you deployed Nginx to avoid. Fix it at the route: put <code>proxy_buffering off;</code> inside the <code>location</code> that streams, or better, let the upstream declare it per-response — measured below.</p>
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

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Timeouts: what each one measures, and the 200 that is a lie|||3.4 — Timeout: mỗi cái đo cái gì, và cú 200 nói dối',
      slug: 'nginx-3-4-timeout',
      type: 'LESSON',
      description: 'Năm phép đo trên một upstream cố tình cư xử xấu. Một cái cho 504, một cái cho 502 mà timeout không hề có tác dụng, một cái chứng minh proxy_read_timeout đo KHOẢNG CÁCH giữa hai lần đọc chứ không đo tổng thời gian — và một cái trả về 200 với thân RỖNG, thứ đáng sợ nhất trong cả chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Timeouts: what each one measures, and the 200 that is a lie</h2>
<p class="lead">Timeout directives look like a single knob with several names. They are not: each one measures a different interval, two of them can produce different status codes for what feels like the same failure, and one combination returns <code>200</code> for a response that never finished. All five cases below are measured against an upstream written to misbehave.</p>

<h3>Five failures, timed</h3>
<div class="out">1) Upstream nhan ket noi nhung KHONG BAO GIO tra loi
   proxy_read_timeout 2s      -> 504  sau 2.003s
   error.log: upstream timed out (110) while reading response header from upstream

2) Cong 9999 KHONG ai nghe (he dieu hanh TU CHOI ngay)
   proxy_connect_timeout 2s   -> 502  sau 0.001s      &lt;- timeout khong he dung toi
   error.log: connect() failed (111: Connection refused)

3) Upstream nha 4 manh, moi manh cach 400ms, TONG 1.6s
   proxy_read_timeout 1s      -> 200  sau 1.607s, du 105 byte
                                 ^^^ KHONG timeout, du tong lon hon 1s

4) Upstream nha 1 manh roi IM 5 giay
   proxy_read_timeout 1s      -> 200  sau 1.002s, nhan 0 BYTE
   error.log: upstream timed out (110) while reading upstream

5) Cung request nhu (4), proxy_read_timeout mac dinh 60s
   -> 200  sau 5.014s, nhan 24 byte  ("manh dau tien" + "manh cuoi")</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">proxy_connect_timeout — opening the TCP connection</span><span class="lz-d">Only counts while the handshake is in progress. Row 2 shows why it so often does nothing: a closed port sends an immediate refusal, so you get <code>502</code> in a millisecond. This timeout only bites when packets are silently dropped — a firewall, a dead host, a wrong security group.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">proxy_send_timeout — writing the request to the upstream</span><span class="lz-d">The gap between successive successful writes. It matters for large uploads to a slow backend and almost never otherwise. Default 60s.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">proxy_read_timeout — the GAP between two reads, not the total</span><span class="lz-d">Row 3 is the proof: four chunks over 1.6s with a 1s timeout completed fine, because no single gap exceeded 400ms. A response that takes an hour is acceptable to Nginx as long as it never goes quiet for longer than this value.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The status depends on WHEN it fires</span><span class="lz-d">Before the response headers arrive, Nginx can still choose an error: row 1 is a clean <code>504</code>. After the headers have gone out, it cannot — the status is already on the wire. Row 4 is what that looks like.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — row 4 is a <code>200</code> with an empty body, and every layer above it will call that a success.</strong> Nginx had already sent <code>HTTP/1.1 200 OK</code> and <code>Transfer-Encoding: chunked</code> when the upstream went quiet; when the read timed out there was no way to retract that, so it simply closed the connection without the terminating chunk. A monitoring check that looks at status codes sees <code>200</code>. A browser fetch resolves. An HTTP client that does not verify the chunked terminator returns an empty string, and your code treats it as an empty result rather than an error. The only honest signals are the truncated body and the <code>while reading upstream</code> line in the error log — note it says <em>reading upstream</em>, not <em>reading response header from upstream</em>, and that one word is how you tell row 4 from row 1 at three in the morning.</p>
</div>

<h3>Choosing the numbers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Set proxy_read_timeout to the longest legitimate silence</span><span class="v">Not the longest request. If your slowest endpoint streams progress every few seconds, a small value is fine and catches a hung backend fast. If it computes for two minutes and then answers all at once, the timeout must exceed two minutes — the gap is what counts.</span></div>
  <div class="kv"><span class="k">Streaming endpoints need a deliberately huge one</span><span class="v">An idle SSE connection sends nothing between events. With the default 60s, a quiet stream is killed after a minute and the browser reconnects in a loop. <code>proxy_read_timeout 1h;</code> in that <code>location</code>, plus a heartbeat comment from the application every 30 seconds so a genuinely dead connection is still noticed.</span></div>
  <div class="kv"><span class="k">Keep connect short and read long</span><span class="v">A healthy backend on a LAN connects in single-digit milliseconds, so <code>proxy_connect_timeout 2s;</code> is generous and fails fast when a host is gone. Reading is where real work happens and deserves room. The common mistake is one number copied into all three.</span></div>
  <div class="kv"><span class="k">504 means your backend; 502 means the connection</span><span class="v">Worth memorising because it halves the search. <code>504</code> = Nginx reached the upstream and waited too long, so look at the application. <code>502</code> = Nginx could not get a usable connection or response at all, so look at the process, the port, and whether it crashed.</span></div>
</div>
<pre><code>http {
  proxy_connect_timeout 2s;      <span class="tok-comment"># default 60s — far too long for a server that is already dead</span>
  proxy_send_timeout    30s;
  proxy_read_timeout    30s;     <span class="tok-comment"># the maximum QUIET gap, not the total time</span>
}

location /su-kien/ {             <span class="tok-comment"># a streaming endpoint: a deliberate exception</span>
  proxy_buffering off;
  gzip off;
  proxy_read_timeout 1h;         <span class="tok-comment"># + the app sends a heartbeat every 30 seconds</span>
  proxy_pass http://api;
}</code></pre>

<h3>Where the other clocks are</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">client_body_timeout and client_header_timeout</span><span class="lz-lnote">The same idea on the client side: how long Nginx waits between reads of the incoming request. Both default to 60s, and they are the defence against a client that opens a connection and dribbles bytes to hold a worker — Chapter 8 measures that attack.</span></div>
  <div class="lz-layer"><span class="lz-lname">keepalive_timeout — how long an idle client connection is held</span><span class="lz-lnote">Default 75s. It costs a file descriptor per idle connection and saves a handshake on the next request, so the right value depends on how bursty your traffic is. It is unrelated to the proxy timeouts despite the similar name.</span></div>
  <div class="lz-layer"><span class="lz-lname">keepalive in the upstream block — connection reuse to the backend</span><span class="lz-lnote"><code>upstream api { server ...; keepalive 32; }</code> keeps up to 32 idle connections per worker. With <code>proxy_http_version 1.1</code> and <code>Connection ""</code> from Lesson 3.2, this removes a TCP handshake from every proxied request.</span></div>
  <div class="lz-layer"><span class="lz-lname">send_timeout — writing the response to a slow client</span><span class="lz-lnote">The gap between successful writes to the client. With <code>proxy_buffering on</code> this protects Nginx's own memory rather than your backend, because the backend was already released — which is Lesson 3.3 paying off.</span></div>
</div>
<div class="note-ct">
<p><strong>What to do first when you see 502 or 504 in production.</strong> Read the error log line, not the status code — it names the phase (<code>connect()</code>, <code>while reading response header</code>, <code>while reading upstream</code>) and that is what tells you where to look. The status code alone cannot distinguish row 1 from row 4, and row 4 will not even show up as an error in whatever dashboard you check first.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout</span><span class="lc-sub">nginx.org · "Between two successive read operations" — the sentence row 3 proves</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive" target="_blank" rel="noopener"><span class="lc-ico">♻️</span><span class="lc-body"><span class="lc-title">nginx — upstream keepalive</span><span class="lc-sub">nginx.org · Including the two directives it requires to work at all</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504" target="_blank" rel="noopener"><span class="lc-ico">🚧</span><span class="lc-body"><span class="lc-title">MDN — 502 and 504</span><span class="lc-sub">developer.mozilla.org · What each one is supposed to mean to a client</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Why a truncated chunked response can look like an empty success to your client code</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reproduce the 200-with-no-body, then catch it from client code that checks the status</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Timeout: mỗi cái đo cái gì, và cú 200 nói dối</h2>
<p class="lead">Các chỉ thị timeout trông như một cái núm duy nhất mang vài cái tên. Không phải: mỗi cái đo một KHOẢNG khác nhau, hai cái trong số đó cho ra mã trạng thái khác nhau cho cái cảm giác như cùng một kiểu hỏng, và một tổ hợp trả về <code>200</code> cho một phản hồi chưa bao giờ kết thúc. Cả năm trường hợp dưới đây đều đo trên một upstream viết ra để cư xử xấu.</p>

<h3>Năm kiểu hỏng, bấm giờ</h3>
<div class="out">1) Upstream nhan ket noi nhung KHONG BAO GIO tra loi
   proxy_read_timeout 2s      -> 504  sau 2.003s
   error.log: upstream timed out (110) while reading response header from upstream

2) Cong 9999 KHONG ai nghe (he dieu hanh TU CHOI ngay)
   proxy_connect_timeout 2s   -> 502  sau 0.001s      &lt;- timeout khong he dung toi
   error.log: connect() failed (111: Connection refused)

3) Upstream nha 4 manh, moi manh cach 400ms, TONG 1.6s
   proxy_read_timeout 1s      -> 200  sau 1.607s, du 105 byte
                                 ^^^ KHONG timeout, du tong lon hon 1s

4) Upstream nha 1 manh roi IM 5 giay
   proxy_read_timeout 1s      -> 200  sau 1.002s, nhan 0 BYTE
   error.log: upstream timed out (110) while reading upstream

5) Cung request nhu (4), proxy_read_timeout mac dinh 60s
   -> 200  sau 5.014s, nhan 24 byte  ("manh dau tien" + "manh cuoi")</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">proxy_connect_timeout — MỞ kết nối TCP</span><span class="lz-d">Chỉ đếm trong lúc cái bắt tay đang diễn ra. Dòng 2 cho thấy vì sao nó rất hay chẳng làm gì: một cổng đóng gửi lời từ chối NGAY, nên bạn nhận <code>502</code> trong một mili giây. Cái timeout này chỉ cắn khi gói tin bị VỨT trong im lặng — một tường lửa, một máy đã chết, một security group sai.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">proxy_send_timeout — GHI request lên upstream</span><span class="lz-d">Là khoảng cách giữa hai lần ghi thành công liên tiếp. Nó có nghĩa lý với những lượt tải lên lớn vào một backend chậm, và gần như không có nghĩa lý ở chỗ khác. Mặc định 60s.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">proxy_read_timeout — KHOẢNG CÁCH giữa hai lần đọc, KHÔNG phải tổng</span><span class="lz-d">Dòng 3 là bằng chứng: bốn mẩu trải trên 1,6 giây với timeout 1 giây vẫn xong ngon lành, vì không khoảng cách đơn lẻ nào vượt quá 400ms. Một phản hồi kéo dài MỘT TIẾNG vẫn được Nginx chấp nhận, miễn là nó không bao giờ im lặng lâu hơn giá trị này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Mã trạng thái tuỳ vào việc nó nổ LÚC NÀO</span><span class="lz-d">Trước khi header phản hồi tới nơi, Nginx còn chọn được một mã lỗi: dòng 1 là một cú <code>504</code> tử tế. Sau khi header đã đi ra rồi thì nó KHÔNG chọn được nữa — mã trạng thái đã nằm trên dây. Dòng 4 là bộ mặt của chuyện đó.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — dòng 4 là một cú <code>200</code> với thân RỖNG, và mọi tầng bên trên sẽ gọi đó là THÀNH CÔNG.</strong> Nginx đã gửi <code>HTTP/1.1 200 OK</code> và <code>Transfer-Encoding: chunked</code> xong xuôi khi upstream im bặt; lúc lượt đọc hết giờ thì không có cách nào rút lại được, nên nó chỉ việc đóng kết nối mà không có mẩu kết thúc. Một phép giám sát nhìn vào mã trạng thái sẽ thấy <code>200</code>. Một lệnh fetch của trình duyệt sẽ resolve. Một HTTP client không kiểm mẩu kết thúc của chunked sẽ trả về chuỗi rỗng, và mã của bạn coi đó là "kết quả rỗng" chứ không phải một lỗi. Hai tín hiệu thật thà duy nhất là cái thân bị cắt cụt và dòng <code>while reading upstream</code> trong error log — để ý nó nói <em>reading upstream</em> chứ không phải <em>reading response header from upstream</em>, và đúng một chữ đó là cách bạn phân biệt dòng 4 với dòng 1 vào lúc ba giờ sáng.</p>
</div>

<h3>Chọn con số thế nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đặt proxy_read_timeout theo khoảng LẶNG hợp lệ dài nhất</span><span class="v">Không phải theo request dài nhất. Nếu điểm cuối chậm nhất của bạn nhả tiến độ vài giây một lần thì một giá trị nhỏ là ổn và bắt được một backend treo rất nhanh. Còn nếu nó tính hai phút rồi mới trả lời một phát thì timeout BẮT BUỘC phải lớn hơn hai phút — cái khoảng cách mới là thứ được đếm.</span></div>
  <div class="kv"><span class="k">Điểm cuối chảy dần cần một giá trị to một cách CÓ CHỦ Ý</span><span class="v">Một kết nối SSE đang rảnh thì chẳng gửi gì giữa hai sự kiện. Với mặc định 60s, một luồng im ắng bị giết sau một phút và trình duyệt nối lại thành vòng. Hãy đặt <code>proxy_read_timeout 1h;</code> trong cái <code>location</code> ấy, cộng thêm một nhịp tim từ ứng dụng mỗi 30 giây để một kết nối CHẾT THẬT vẫn bị phát hiện.</span></div>
  <div class="kv"><span class="k">Giữ connect NGẮN và read DÀI</span><span class="v">Một backend khoẻ mạnh trong mạng LAN nối được trong vài mili giây, nên <code>proxy_connect_timeout 2s;</code> đã là rộng rãi và nó hỏng nhanh khi một máy biến mất. Việc đọc mới là chỗ công việc thật diễn ra và nó xứng đáng có chỗ. Lỗi thường gặp là chép MỘT con số vào cả ba.</span></div>
  <div class="kv"><span class="k">504 nghĩa là backend của bạn; 502 nghĩa là cái kết nối</span><span class="v">Đáng học thuộc vì nó giảm một nửa vùng tìm kiếm. <code>504</code> = Nginx đã chạm được upstream và chờ quá lâu, hãy đi nhìn ứng dụng. <code>502</code> = Nginx không lấy nổi một kết nối hay một phản hồi dùng được nào, hãy đi nhìn tiến trình, cái cổng, và xem nó có sập không.</span></div>
</div>
<pre><code>http {
  proxy_connect_timeout 2s;      <span class="tok-comment"># mặc định 60s — quá dài cho một máy chủ đã chết</span>
  proxy_send_timeout    30s;
  proxy_read_timeout    30s;     <span class="tok-comment"># khoảng LẶNG tối đa, không phải tổng thời gian</span>
}

location /su-kien/ {             <span class="tok-comment"># điểm cuối chảy dần: ngoại lệ có chủ ý</span>
  proxy_buffering off;
  gzip off;
  proxy_read_timeout 1h;         <span class="tok-comment"># + ứng dụng gửi nhịp tim mỗi 30 giây</span>
  proxy_pass http://api;
}</code></pre>

<h3>Những cái đồng hồ còn lại nằm ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">client_body_timeout và client_header_timeout</span><span class="lz-lnote">Cùng ý tưởng nhưng ở phía client: Nginx chờ bao lâu giữa hai lần đọc cái request đang tới. Cả hai mặc định 60s, và chúng là hàng phòng thủ trước một client mở kết nối rồi nhỏ giọt từng byte để giữ một worker — Chương 8 sẽ đo đòn ấy.</span></div>
  <div class="lz-layer"><span class="lz-lname">keepalive_timeout — giữ một kết nối client đang rảnh bao lâu</span><span class="lz-lnote">Mặc định 75s. Nó tốn một file descriptor cho mỗi kết nối rảnh và tiết kiệm một cái bắt tay cho request kế tiếp, nên giá trị đúng tuỳ vào lưu lượng của bạn dồn cục tới mức nào. Nó KHÔNG liên quan gì tới đám timeout của proxy dù tên nghe giống.</span></div>
  <div class="lz-layer"><span class="lz-lname">keepalive trong khối upstream — tái dùng kết nối tới backend</span><span class="lz-lnote"><code>upstream api { server ...; keepalive 32; }</code> giữ tối đa 32 kết nối rảnh cho mỗi worker. Cùng với <code>proxy_http_version 1.1</code> và <code>Connection ""</code> ở Bài 3.2, nó gỡ bỏ một cái bắt tay TCP khỏi MỌI request đi qua proxy.</span></div>
  <div class="lz-layer"><span class="lz-lname">send_timeout — ghi phản hồi cho một client CHẬM</span><span class="lz-lnote">Khoảng cách giữa hai lần ghi thành công tới client. Với <code>proxy_buffering on</code> thì nó bảo vệ bộ nhớ của CHÍNH Nginx chứ không bảo vệ backend, vì backend đã được thả ra từ trước — đó chính là Bài 3.3 đang sinh lời.</span></div>
</div>
<div class="note-ct">
<p><strong>Việc đầu tiên phải làm khi thấy 502 hay 504 trên production.</strong> Hãy ĐỌC dòng error log chứ đừng đọc mã trạng thái — nó gọi tên đúng cái GIAI ĐOẠN (<code>connect()</code>, <code>while reading response header</code>, <code>while reading upstream</code>) và đó mới là thứ chỉ cho bạn chỗ cần nhìn. Mã trạng thái một mình không phân biệt nổi dòng 1 với dòng 4, mà dòng 4 thì thậm chí còn không hiện ra như một lỗi trên cái bảng điều khiển bạn mở đầu tiên.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout</span><span class="lc-sub">nginx.org · "Giữa HAI lần đọc liên tiếp" — đúng cái câu mà dòng 3 chứng minh</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive" target="_blank" rel="noopener"><span class="lc-ico">♻️</span><span class="lc-body"><span class="lc-title">nginx — keepalive của upstream</span><span class="lc-sub">nginx.org · Kèm cả hai chỉ thị bắt buộc phải có thì nó mới chạy</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504" target="_blank" rel="noopener"><span class="lc-ico">🚧</span><span class="lc-body"><span class="lc-title">MDN — 502 và 504</span><span class="lc-sub">developer.mozilla.org · Mỗi cái được cho là nói gì với client</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Vì sao một phản hồi chunked bị cắt cụt trông như một thành công rỗng với mã client</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng lại cú 200-không-thân, rồi bắt nó từ mã client vốn chỉ kiểm mã trạng thái</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — WebSocket: the upgrade Nginx removes on purpose|||3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi',
      slug: 'nginx-3-5-websocket',
      type: 'LESSON',
      description: 'Một khối proxy bình thường làm WebSocket chết câm — không lỗi, không log, chỉ là một cú 200 ở chỗ lẽ ra phải là 101. Bài này đo ba cấu hình cho tới khi cái bắt tay thành công, và giải thích vì sao Nginx gỡ đúng cái header ấy chứ không phải vì nó hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>WebSocket: the upgrade Nginx removes on purpose</h2>
<p class="lead">Put a working WebSocket server behind a working Nginx proxy and the connection fails with no error anywhere. The reason is not a bug and not a missing module — it is the correct behaviour from Lesson 3.2 arriving at an inconvenient moment.</p>

<h3>Three configurations, one handshake</h3>
<div class="out">=== GOI THANG vao may chu WebSocket (chuan doi chieu) ===
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
khung toi sau 0.51s / 1.01s / 1.51s      OK

=== A) Khoi proxy BINH THUONG ===
location /ws-thuong/ { proxy_pass http://127.0.0.1:9102/; }
   -> HTTP/1.1 200 OK                    &lt;- KHONG phai 101. Khong loi. Khong log.

=== B) Chi them proxy_http_version 1.1 ===
   -> HTTP/1.1 200 OK                    &lt;- van khong du

=== C) DAY DU ===
   -> HTTP/1.1 101 Switching Protocols
      khung toi sau 0.50s / 1.00s / 1.50s</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The client asks with two hop-by-hop headers</span><span class="lz-d">A WebSocket handshake is an ordinary <code>GET</code> carrying <code>Upgrade: websocket</code> and <code>Connection: Upgrade</code>. Both of those describe THIS connection, not the whole journey.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A proxy must not forward hop-by-hop headers</span><span class="lz-d">So Nginx strips them, exactly as the specification requires and exactly as Lesson 3.2 measured. Your upstream receives a plain <code>GET</code> and answers it like one — which is why row A is a <code>200</code> rather than an error.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">You re-inject them for the next hop</span><span class="lz-d">Not by copying, but by declaring them for the connection Nginx itself is making. That is what <code>proxy_set_header Upgrade \$http_upgrade;</code> means: take what the client asked for and ask for it again on my own connection.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">HTTP/1.1 is required as well</span><span class="lz-d">Row B shows the version alone is not enough, but without it nothing works either — <code>Upgrade</code> does not exist in HTTP/1.0. Both directives are necessary; neither is sufficient.</span></div>
</div>
<pre><code><span class="tok-comment"># At the http level — map runs ONCE per request, far cheaper than if</span>
map \$http_upgrade \$connection_upgrade {
  default upgrade;
  ''      close;      <span class="tok-comment"># an ordinary request: says "close", NOT "upgrade"</span>
}

location /ws/ {
  proxy_http_version 1.1;
  proxy_set_header Upgrade    \$http_upgrade;
  proxy_set_header Connection \$connection_upgrade;
  proxy_set_header Host       \$host;
  proxy_read_timeout 1h;      <span class="tok-comment"># an idle socket must NOT die after 60 seconds</span>
  proxy_pass http://127.0.0.1:9102/;
}</code></pre>

<h3>Why the map, and not a hard-coded string</h3>
<div class="out">Cung mot request HTTP THUONG (khong co Upgrade), xem UPSTREAM nhan gi:

  proxy_set_header Connection "upgrade";        -> connection: 'upgrade'  upgrade: (khong co)
  proxy_set_header Connection $connection_upgrade; -> connection: 'close'</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A hard-coded upgrade lies on every ordinary request</span><span class="v">Measured above: a plain <code>GET</code> reached the upstream announcing <code>Connection: upgrade</code> with no <code>Upgrade</code> header to go with it. That combination is meaningless, some backends reject it, and it defeats connection reuse because the upstream must assume the connection is about to change protocol.</span></div>
  <div class="kv"><span class="k">The map makes the header follow the request</span><span class="v">One <code>map</code> at <code>http</code> level, referenced from every proxy block. WebSocket requests get <code>upgrade</code>, everything else gets a correct value. It is evaluated lazily, only when the variable is used, so it costs nothing on blocks that do not reference it.</span></div>
  <div class="kv"><span class="k">With upstream keepalive, map the empty case to "" instead of close</span><span class="v">If the <code>upstream</code> block has <code>keepalive</code>, you want ordinary requests to send no <code>Connection</code> header at all so the connection can be reused — <code>'' ''</code> rather than <code>'' close</code>. Two different correct answers depending on whether you are pooling connections.</span></div>
  <div class="kv"><span class="k">Do not put the WebSocket route in the same block as everything else</span><span class="v">Its timeouts, buffering and headers all differ. A dedicated <code>location /ws/</code> keeps the long <code>proxy_read_timeout</code> away from your API, where a 1-hour timeout would hide a hung backend for an hour.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the failure is a <code>200</code>, so nothing you would normally check reports a problem.</strong> Row A returned a successful status with a body from your own application; Nginx logged a normal request; the upstream logged a normal request; no error appeared anywhere. The client library reports something vague like "connection closed before the handshake completed", which sends people looking at the client, at TLS, at the firewall — everywhere except the four lines missing from the proxy block. The one diagnostic that answers it immediately is a raw handshake: send the <code>GET</code> with <code>Upgrade: websocket</code> yourself and read the status line. <code>101</code> means the proxy is fine and the problem is elsewhere; <code>200</code> means it is this.</p>
</div>

<h3>After the handshake succeeds</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nginx becomes a byte pipe, and stops understanding the traffic</span><span class="lz-lnote">Once <code>101</code> is sent, frames are opaque. Request logging, rate limiting per request, caching and body-size limits are all irrelevant to what flows afterwards — a single access-log line covers the entire session, however long it lasts.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_read_timeout becomes the idle-connection killer</span><span class="lz-lnote">With no traffic on a socket, the read gap grows without bound. The default 60s closes healthy idle connections and the client reconnects forever. Raise it, and have the application send a ping — a timeout with no heartbeat means dead connections linger instead.</span></div>
  <div class="lz-layer"><span class="lz-lname">Each connection holds resources on both sides</span><span class="lz-lnote">A file descriptor and a slot in <code>worker_connections</code> on Nginx, plus whatever the backend keeps. Ten thousand idle sockets is fine for Nginx and may not be for your application — size <code>worker_connections</code> deliberately rather than discovering the limit under load.</span></div>
  <div class="lz-layer"><span class="lz-lname">The same pattern covers other upgrades</span><span class="lz-lnote">HTTP/2 over cleartext, and anything else negotiated with <code>Upgrade</code>, needs the identical re-injection. The <code>map</code> is written against <code>\$http_upgrade</code> generically for exactly that reason, not against the literal string "websocket".</span></div>
</div>
<div class="note-ct">
<p><strong>The one-paragraph version.</strong> Nginx removes <code>Upgrade</code> and <code>Connection</code> because a proxy is required to, so a WebSocket behind a default proxy block degrades into an ordinary <code>GET</code> that returns <code>200</code>. Four lines put them back for the hop Nginx is making — HTTP/1.1, <code>Upgrade</code> from the client, <code>Connection</code> from a <code>map</code>, and a read timeout long enough for an idle socket. Every one of those four is necessary, and the handshake stays at <code>200</code> until all four are present.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/websocket.html" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">nginx — WebSocket proxying</span><span class="lc-sub">nginx.org · The official four-line block, including the map</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — the map module</span><span class="lc-sub">nginx.org · Lazy evaluation, default, and why it beats if</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">MDN — the WebSocket API</span><span class="lc-sub">developer.mozilla.org · The handshake, and what the client does when it fails</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Handling the upgrade event, and keeping thousands of sockets alive</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Watch the handshake return 200, add one directive at a time until it returns 101</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi</h2>
<p class="lead">Đặt một máy chủ WebSocket chạy tốt sau một con Nginx chạy tốt và cái kết nối chết mà chẳng có lỗi ở đâu cả. Lý do KHÔNG phải một con bug và KHÔNG phải thiếu module — nó là hành vi ĐÚNG ĐẮN ở Bài 3.2 ập tới vào một thời điểm bất tiện.</p>

<h3>Ba cấu hình, một cái bắt tay</h3>
<div class="out">=== GOI THANG vao may chu WebSocket (chuan doi chieu) ===
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
khung toi sau 0.51s / 1.01s / 1.51s      OK

=== A) Khoi proxy BINH THUONG ===
location /ws-thuong/ { proxy_pass http://127.0.0.1:9102/; }
   -> HTTP/1.1 200 OK                    &lt;- KHONG phai 101. Khong loi. Khong log.

=== B) Chi them proxy_http_version 1.1 ===
   -> HTTP/1.1 200 OK                    &lt;- van khong du

=== C) DAY DU ===
   -> HTTP/1.1 101 Switching Protocols
      khung toi sau 0.50s / 1.00s / 1.50s</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client hỏi bằng HAI header từng-chặng</span><span class="lz-d">Một cái bắt tay WebSocket là một lệnh <code>GET</code> bình thường mang theo <code>Upgrade: websocket</code> và <code>Connection: Upgrade</code>. Cả hai đều mô tả CÁI KẾT NỐI NÀY, không mô tả cả hành trình.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một con proxy KHÔNG ĐƯỢC chuyển tiếp header từng-chặng</span><span class="lz-d">Nên Nginx lột chúng đi, đúng như đặc tả đòi hỏi và đúng như Bài 3.2 đã đo. Upstream của bạn nhận một cái <code>GET</code> trơn và trả lời nó như một cái GET trơn — và đó là lý do dòng A là <code>200</code> chứ không phải một lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bạn TIÊM LẠI chúng cho chặng tiếp theo</span><span class="lz-d">Không phải bằng cách chép, mà bằng cách KHAI chúng cho cái kết nối mà chính Nginx đang tạo ra. Đó là ý nghĩa của <code>proxy_set_header Upgrade \$http_upgrade;</code>: lấy cái client vừa xin rồi xin lại nó trên kết nối của TÔI.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">HTTP/1.1 cũng là điều kiện BẮT BUỘC</span><span class="lz-d">Dòng B cho thấy chỉ mỗi phiên bản thì chưa đủ, nhưng thiếu nó thì cũng chẳng có gì chạy — <code>Upgrade</code> không tồn tại trong HTTP/1.0. Cả hai chỉ thị đều CẦN; không cái nào ĐỦ một mình.</span></div>
</div>
<pre><code><span class="tok-comment"># Ở tầng http — map chạy MỘT lần cho mỗi request, rẻ hơn if rất nhiều</span>
map \$http_upgrade \$connection_upgrade {
  default upgrade;
  ''      close;      <span class="tok-comment"># request thường: nói "close", KHÔNG nói "upgrade"</span>
}

location /ws/ {
  proxy_http_version 1.1;
  proxy_set_header Upgrade    \$http_upgrade;
  proxy_set_header Connection \$connection_upgrade;
  proxy_set_header Host       \$host;
  proxy_read_timeout 1h;      <span class="tok-comment"># một socket rảnh KHÔNG được chết sau 60 giây</span>
  proxy_pass http://127.0.0.1:9102/;
}</code></pre>

<h3>Vì sao dùng map chứ không viết cứng một chuỗi</h3>
<div class="out">Cung mot request HTTP THUONG (khong co Upgrade), xem UPSTREAM nhan gi:

  proxy_set_header Connection "upgrade";        -> connection: 'upgrade'  upgrade: (khong co)
  proxy_set_header Connection $connection_upgrade; -> connection: 'close'</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Viết cứng "upgrade" là NÓI DỐI trên mọi request thường</span><span class="v">Đo ở trên: một cái <code>GET</code> trơn tới được upstream và tuyên bố <code>Connection: upgrade</code> mà chẳng có <code>Upgrade</code> nào đi kèm. Tổ hợp đó VÔ NGHĨA, vài backend từ chối thẳng, và nó phá luôn việc tái dùng kết nối vì upstream buộc phải cho rằng cái kết nối sắp đổi giao thức tới nơi.</span></div>
  <div class="kv"><span class="k">map làm cái header ĐI THEO request</span><span class="v">Một cái <code>map</code> ở tầng <code>http</code>, tham chiếu từ mọi khối proxy. Request WebSocket nhận <code>upgrade</code>, mọi thứ khác nhận một giá trị đúng đắn. Nó được tính LƯỜI, chỉ khi biến được dùng tới, nên nó tốn ĐÚNG BẰNG KHÔNG ở những khối không tham chiếu tới nó.</span></div>
  <div class="kv"><span class="k">Có keepalive ở upstream thì hãy ánh xạ ca rỗng thành "" chứ đừng close</span><span class="v">Nếu khối <code>upstream</code> có <code>keepalive</code>, bạn muốn request thường KHÔNG gửi header <code>Connection</code> nào cả để kết nối được tái dùng — tức <code>'' ''</code> thay vì <code>'' close</code>. Hai câu trả lời đúng khác nhau, tuỳ vào bạn có gom kết nối thành bể hay không.</span></div>
  <div class="kv"><span class="k">Đừng nhét tuyến WebSocket chung khối với mọi thứ khác</span><span class="v">Timeout, đệm và header của nó đều khác. Một khối <code>location /ws/</code> riêng giữ cái <code>proxy_read_timeout</code> dài đó tránh xa API của bạn, nơi mà một timeout một tiếng sẽ che một backend treo suốt một tiếng.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — kiểu hỏng ở đây là một cú <code>200</code>, nên chẳng thứ gì bạn thường đi kiểm báo có vấn đề cả.</strong> Dòng A trả về một mã thành công kèm một cái thân từ chính ứng dụng của bạn; Nginx ghi log một request bình thường; upstream ghi log một request bình thường; không lỗi nào hiện ra ở đâu. Thư viện phía client báo một câu mơ hồ kiểu "kết nối đóng trước khi bắt tay xong", và câu đó đẩy người ta đi soi client, soi TLS, soi tường lửa — soi khắp nơi TRỪ bốn dòng đang thiếu trong khối proxy. Phép chẩn đoán duy nhất trả lời ngay lập tức là một cái bắt tay THÔ: tự tay gửi lệnh <code>GET</code> kèm <code>Upgrade: websocket</code> rồi đọc dòng trạng thái. <code>101</code> nghĩa là proxy ổn và vấn đề nằm chỗ khác; <code>200</code> nghĩa là nó chính là chỗ này.</p>
</div>

<h3>Sau khi bắt tay thành công</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nginx thành một cái ống byte, và thôi hiểu lưu lượng đi qua</span><span class="lz-lnote">Một khi <code>101</code> đã gửi đi thì các khung là mờ đục. Ghi log theo request, giới hạn tần suất theo request, bộ đệm và trần kích thước thân đều VÔ NGHĨA với thứ chảy sau đó — một dòng access-log duy nhất phủ cả phiên, dù nó kéo dài bao lâu.</span></div>
  <div class="lz-layer"><span class="lz-lname">proxy_read_timeout trở thành kẻ giết kết nối rảnh</span><span class="lz-lnote">Không có lưu lượng trên socket thì khoảng cách giữa hai lần đọc lớn lên vô hạn. Mặc định 60s đóng những kết nối rảnh KHOẺ MẠNH và client thì nối lại mãi mãi. Hãy nâng nó lên, VÀ cho ứng dụng gửi ping — một cái timeout mà không có nhịp tim thì đổi lại là những kết nối chết cứ nằm lì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi kết nối giữ tài nguyên ở CẢ HAI phía</span><span class="lz-lnote">Một file descriptor và một chỗ trong <code>worker_connections</code> ở Nginx, cộng bất cứ thứ gì backend giữ. Mười nghìn socket rảnh thì với Nginx là chuyện nhỏ mà với ứng dụng của bạn có thể không — hãy định cỡ <code>worker_connections</code> một cách CÓ CHỦ Ý chứ đừng phát hiện ra cái trần ấy lúc đang tải nặng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cùng khuôn mẫu ấy lo cho mọi cú nâng cấp khác</span><span class="lz-lnote">HTTP/2 trên kênh trần, và mọi thứ khác thương lượng bằng <code>Upgrade</code>, đều cần đúng phép tiêm lại đó. Cái <code>map</code> được viết dựa trên <code>\$http_upgrade</code> một cách TỔNG QUÁT đúng vì lý do này, chứ không dựa trên chuỗi "websocket" theo nghĩa đen.</span></div>
</div>
<div class="note-ct">
<p><strong>Bản gói trong một đoạn.</strong> Nginx gỡ <code>Upgrade</code> và <code>Connection</code> vì một con proxy BẮT BUỘC phải làm thế, nên một WebSocket nằm sau một khối proxy mặc định thoái hoá thành một lệnh <code>GET</code> bình thường trả về <code>200</code>. Bốn dòng đặt chúng trở lại cho cái chặng mà Nginx đang đi — HTTP/1.1, <code>Upgrade</code> lấy từ client, <code>Connection</code> lấy từ một <code>map</code>, và một read timeout đủ dài cho một socket đang rảnh. Cả bốn cái đều CẦN, và cái bắt tay còn nằm ở <code>200</code> cho tới khi có đủ cả bốn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/websocket.html" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">nginx — Proxy WebSocket</span><span class="lc-sub">nginx.org · Khối bốn dòng chính thức, kèm cả cái map</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗺️</span><span class="lc-body"><span class="lc-title">nginx — module map</span><span class="lc-sub">nginx.org · Tính lười, default, và vì sao nó hơn if</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">MDN — WebSocket API</span><span class="lc-sub">developer.mozilla.org · Cái bắt tay, và client làm gì khi nó hỏng</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Xử lý sự kiện upgrade, và nuôi sống hàng nghìn socket cùng lúc</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Xem cái bắt tay trả về 200, rồi thêm từng chỉ thị một cho tới khi nó trả về 101</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: what actually reaches your application|||3.6 — Quiz: cái gì thực sự tới được ứng dụng của bạn',
      slug: 'nginx-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về đường dẫn proxy_pass gửi đi, bốn giá trị mặc định gây bất ngờ, thủ phạm thật làm hỏng luồng chảy, năm phép đo timeout, và bốn dòng làm WebSocket chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Quiz: what actually reaches your application</h2>
<p class="lead">Eight questions. Three of them have answers that contradict advice you will find in most tutorials, which is exactly why this chapter measured everything instead of quoting it.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> <code>proxy_pass</code> without a path forwards the URI unchanged; with any path at all — even a bare <code>/</code> — it substitutes that path for the matched prefix, the same cut-and-paste as <code>alias</code> (3.1). By default Nginx speaks HTTP/1.0 upstream, replaces <code>Host</code> with the upstream's own address, sends <code>Connection: close</code>, and silently drops headers containing underscores; and <code>X-Forwarded-For</code> is a list whose leftmost entry the caller wrote, so at the edge only <code>$remote_addr</code> is trustworthy — declaring too wide a <code>set_real_ip_from</code> makes even that forgeable (3.2). <code>proxy_buffering</code> alone does not break streaming, measured three ways; <code>gzip</code> does, and any of <code>gzip off</code>, <code>proxy_buffering off</code> or an upstream <code>X-Accel-Buffering: no</code> restores it (3.3). <code>proxy_read_timeout</code> measures the gap between reads rather than the total, and once response headers have been sent it can no longer produce a <code>504</code> — it produces a <code>200</code> with a truncated body instead (3.4). And <code>Upgrade</code> is a hop-by-hop header that a proxy must remove, which is why a WebSocket behind a default proxy block answers <code>200</code> until four specific directives put it back (3.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Quiz: cái gì thực sự tới được ứng dụng của bạn</h2>
<p class="lead">Tám câu. Ba câu có đáp án MÂU THUẪN với lời khuyên bạn gặp trong phần lớn bài hướng dẫn, và đó đúng là lý do chương này ĐO mọi thứ thay vì đi trích dẫn.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> <code>proxy_pass</code> KHÔNG có đường dẫn thì chuyển tiếp URI y nguyên; CÓ đường dẫn — kể cả một dấu <code>/</code> trần — thì nó THAY đường dẫn đó vào chỗ tiền tố đã khớp, đúng phép cắt-dán như <code>alias</code> (3.1). Mặc định Nginx nói HTTP/1.0 với upstream, THAY <code>Host</code> bằng địa chỉ của chính upstream, gửi <code>Connection: close</code>, và lặng lẽ VỨT header có gạch dưới; còn <code>X-Forwarded-For</code> là một DANH SÁCH mà mục ngoài cùng trái do người gọi viết, nên ở rìa mạng chỉ có <code>$remote_addr</code> là đáng tin — khai <code>set_real_ip_from</code> quá rộng thì đến nó cũng giả mạo được (3.2). <code>proxy_buffering</code> MỘT MÌNH không hề chặn luồng, đo bằng ba cách; <code>gzip</code> mới chặn, và bất cứ cái nào trong <code>gzip off</code>, <code>proxy_buffering off</code> hay một cái <code>X-Accel-Buffering: no</code> từ upstream đều chữa được (3.3). <code>proxy_read_timeout</code> đo KHOẢNG CÁCH giữa hai lần đọc chứ không đo tổng, và một khi header phản hồi đã gửi đi thì nó KHÔNG còn tạo ra <code>504</code> được nữa — nó tạo ra một cú <code>200</code> với thân bị cắt cụt (3.4). Và <code>Upgrade</code> là header từng-chặng mà một con proxy BẮT BUỘC phải gỡ, và đó là lý do một WebSocket sau khối proxy mặc định trả lời <code>200</code> cho tới khi có đủ bốn chỉ thị đặt nó trở lại (3.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'location /api/ { proxy_pass http://up; } — no trailing path. A request for /api/nguoi/1 arrives. What path does the upstream receive?|||location /api/ { proxy_pass http://up; } — không có đường dẫn phía sau. Một request tới /api/nguoi/1. Upstream nhận được đường dẫn nào?',
            options: [
              '/nguoi/1|||/nguoi/1',
              '/api/nguoi/1 — with no path in the proxy_pass URL, the URI is forwarded unchanged|||/api/nguoi/1 — URL của proxy_pass không có đường dẫn thì URI được chuyển tiếp y nguyên',
              '/ — only the root is passed|||/ — chỉ gốc được gửi đi',
              'It depends on the upstream configuration|||Tuỳ vào cấu hình của upstream',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your app reads req.headers.host and builds absolute links from it. Behind a default proxy block, what does it see?|||Ứng dụng của bạn đọc req.headers.host rồi dựng đường dẫn tuyệt đối từ đó. Sau một khối proxy mặc định, nó nhìn thấy gì?',
            options: [
              'The client’s Host, because proxies forward it|||Host của client, vì proxy chuyển tiếp nó',
              'The upstream’s own address, e.g. 127.0.0.1:9101 — Nginx replaces Host unless you add proxy_set_header Host $host|||Địa chỉ của chính upstream, ví dụ 127.0.0.1:9101 — Nginx THAY Host trừ khi bạn thêm proxy_set_header Host $host',
              'An empty string|||Một chuỗi rỗng',
              'The value of X-Forwarded-Host|||Giá trị của X-Forwarded-Host',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A client sends X-Api_Key and swears it did; the app says the header is missing; curl straight to the backend proves the client right. Why?|||Client gửi X-Api_Key và thề là đã gửi; ứng dụng bảo thiếu header; curl thẳng vào backend chứng minh client nói đúng. Vì sao?',
            options: [
              'The app framework lowercases and mangles it|||Framework của ứng dụng hạ chữ và làm hỏng nó',
              'Nginx drops headers containing underscores by default — underscores_in_headers is off, and nothing logs the removal|||Nginx mặc định VỨT header có gạch dưới — underscores_in_headers là off, và không có gì ghi lại vụ xoá đó',
              'The header exceeded proxy_buffer_size|||Header vượt quá proxy_buffer_size',
              'HTTP forbids underscores in header names|||HTTP cấm gạch dưới trong tên header',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Nginx is the edge server. Which value should a rate limiter key on?|||Nginx là máy chủ ở rìa mạng. Bộ giới hạn tần suất nên khoá theo giá trị nào?',
            options: [
              'The leftmost entry of X-Forwarded-For, since that is the original client|||Mục ngoài cùng trái của X-Forwarded-For, vì đó là client gốc',
              '$remote_addr — at the edge it is the TCP peer and cannot be forged; the leftmost X-Forwarded-For entry was written by the caller|||$remote_addr — ở rìa mạng nó là địa chỉ TCP đối tác và không giả mạo được; còn mục trái nhất của X-Forwarded-For là do NGƯỜI GỌI viết',
              'The rightmost entry of X-Forwarded-For|||Mục ngoài cùng phải của X-Forwarded-For',
              'X-Real-IP as sent by the client|||X-Real-IP do client gửi lên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your SSE endpoint delivers everything in one burst at the end. proxy_buffering is on. What is the measured cause?|||Điểm cuối SSE của bạn nhả tất cả một cục ở phút chót. proxy_buffering đang bật. Nguyên nhân ĐO ĐƯỢC là gì?',
            options: [
              'proxy_buffering — turn it off and the stream works|||proxy_buffering — tắt nó đi là luồng chạy',
              'gzip — buffering alone forwards each chunk as it arrives; the compressor is what holds output back until the stream ends|||gzip — chỉ mỗi đệm thì Nginx vẫn đẩy từng mẩu đi ngay khi nó tới; chính bộ NÉN mới giữ đầu ra lại cho tới khi luồng kết thúc',
              'proxy_read_timeout is too short|||proxy_read_timeout quá ngắn',
              'HTTP/1.0 cannot stream|||HTTP/1.0 không chảy dần được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'proxy_read_timeout is 30s. An endpoint computes for 90 seconds, sending nothing, then answers all at once. What happens?|||proxy_read_timeout là 30s. Một điểm cuối tính suốt 90 giây, không gửi gì, rồi trả lời một phát. Chuyện gì xảy ra?',
            options: [
              'It succeeds; the timeout only limits the connect phase|||Nó thành công; timeout chỉ giới hạn giai đoạn kết nối',
              'It times out — the directive measures the gap between reads, and 90 seconds of silence exceeds 30|||Nó hết giờ — chỉ thị này đo KHOẢNG CÁCH giữa hai lần đọc, và 90 giây im lặng vượt quá 30',
              'It succeeds; only the total request time is capped, at 60s|||Nó thành công; chỉ tổng thời gian request bị chặn, ở mức 60s',
              'Nginx retries the request automatically|||Nginx tự thử lại request',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The upstream sends response headers, then goes silent past proxy_read_timeout. What does the client receive?|||Upstream gửi header phản hồi xong rồi im bặt quá proxy_read_timeout. Client nhận được gì?',
            options: [
              '504 Gateway Timeout|||504 Gateway Timeout',
              '200 with a truncated body — the status was already on the wire and cannot be retracted; only the error log says "while reading upstream"|||200 với thân bị CẮT CỤT — mã trạng thái đã nằm trên dây và không rút lại được; chỉ có error log nói "while reading upstream"',
              '502 Bad Gateway|||502 Bad Gateway',
              'Nginx retries and returns the full response|||Nginx thử lại và trả về phản hồi đầy đủ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A WebSocket behind a plain proxy_pass block returns 200 instead of 101. Why does Nginx do that?|||Một WebSocket sau một khối proxy_pass trơn trả về 200 thay vì 101. Vì sao Nginx làm thế?',
            options: [
              'WebSocket support requires a compiled-in module that is missing|||Hỗ trợ WebSocket cần một module biên dịch sẵn mà máy đang thiếu',
              'Upgrade and Connection are hop-by-hop headers a proxy must not forward, so the upstream saw an ordinary GET — you re-inject them plus proxy_http_version 1.1|||Upgrade và Connection là header TỪNG-CHẶNG mà proxy KHÔNG được chuyển tiếp, nên upstream nhìn thấy một cái GET bình thường — bạn phải TIÊM LẠI chúng, cộng proxy_http_version 1.1',
              'The upstream rejected the handshake|||Upstream đã từ chối cái bắt tay',
              'The Sec-WebSocket-Key was invalid|||Sec-WebSocket-Key không hợp lệ',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
