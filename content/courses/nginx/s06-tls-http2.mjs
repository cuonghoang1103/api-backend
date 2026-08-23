const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 6 — TLS and HTTP/2|||Chương 6 — TLS và HTTP/2',
  description: 'Cả chương chạy trên một CA tự dựng và một chuỗi chứng chỉ ba tầng thật, nên mỗi phép đo đều là một cái bắt tay TLS thật với một client thật. Trong đó có cấu hình sai nổi tiếng nhất của TLS — thiếu chứng chỉ trung gian — dựng lại kèm đúng cái mã lỗi mà một trình duyệt sẽ không cho bạn thấy.',
  lessons: [

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — The certificate chain, and the intermediate everyone forgets|||6.1 — Chuỗi chứng chỉ, và cái CA trung gian ai cũng quên',
      slug: 'nginx-6-1-chuoi-chung-chi',
      type: 'LESSON',
      description: 'Bốn dòng bật được HTTPS, và một trong bốn dòng đó là chỗ hỏng thường gặp nhất của TLS. Bài này dựng một chuỗi ba tầng thật rồi đo cả hai cách viết: một cách gửi ra hai chứng chỉ và xác thực OK, cách kia gửi ra một và trả về mã lỗi 21.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The certificate chain, and the intermediate everyone forgets</h2>
<p class="lead">Enabling HTTPS is four lines, and the whole chapter could stop there if one of those four lines were not the single most common way to break TLS in a way that works on your laptop and fails for a real user.</p>

<h3>The four lines</h3>
<pre><code>server {
  listen 443 ssl;
  http2 on;                                      <span class="tok-comment"># nginx ≥ 1.25.1; cũ hơn thì viết "listen 443 ssl http2;"</span>
  server_name vidu.com;

  ssl_certificate     /etc/letsencrypt/live/vidu.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/vidu.com/privkey.pem;

  root /srv/site;
}</code></pre>
<div class="callout warn">
<p><strong>The <code>http2</code> syntax changed, and the old form still works.</strong> Up to nginx 1.25.0 it was a parameter on <code>listen</code>; from 1.25.1 it is its own directive. Writing <code>http2 on;</code> on an older build gives <code>unknown directive "http2"</code> and the config will not load — which is exactly what happened while building this chapter on nginx 1.24.0. Check your version before copying either form from an article.</p>
</div>

<h3>What a chain is, and why there are two files</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Root CA</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Already in every trust store</span><span class="lz-nsub">Shipped with the OS and the browser · you never send it and never need to</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Intermediate</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Signed by the root, signs your certificate</span><span class="lz-nsub">NOT in the trust store · the client can only get it from you</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Your certificate</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Names your hostnames</span><span class="lz-nsub">The leaf · valid for 90 days with Let's Encrypt</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">fullchain.pem</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Leaf and intermediate, in that order</span><span class="lz-nsub">This is the file <code>ssl_certificate</code> wants · <code>cert.pem</code> is the leaf alone</span></div></div>
  </div>
</div>
<div class="out">Chuoi 3 tang that: ROOT -> TRUNG GIAN -> vidu.com
Client CHI tin ROOT (dung nhu mot trinh duyet)

  ssl_certificate la-fullchain.crt (la + trung gian)
     -> 2 chung chi gui ra | Verify return code: 0 (ok)

  ssl_certificate la.crt (chi mot minh chung chi cua ban)
     -> 1 chung chi gui ra | Verify return code: 21
        (unable to verify the first certificate)</div>
<div class="pitfall">
<p><strong>Bẫy — pointing <code>ssl_certificate</code> at <code>cert.pem</code> instead of <code>fullchain.pem</code> produces a site that works perfectly in your browser and fails for a large fraction of real clients.</strong> Browsers cache intermediates they have seen before, and some fetch a missing one over the network, so the developer who set it up sees a green padlock and moves on. A fresh mobile browser, an Android app, <code>curl</code>, a payment gateway calling your webhook, and anything doing certificate pinning all fail — with an error that says the certificate is untrusted, which sends everyone hunting for a problem with the certificate itself. The measurement above is the whole diagnosis: count the certificates the server sends. One means the intermediate is missing. Two or three means the chain is complete. <code>openssl s_client -connect host:443 &lt;/dev/null | grep -c '^ [0-9] s:'</code> answers it in one command, and it is worth running after every certificate renewal, not only the first time.</p>
</div>

<h3>Reading a chain from the outside</h3>
<pre><code><span class="tok-comment"># Máy chủ gửi ra những chứng chỉ nào, và xác thực có qua không</span>
openssl s_client -connect vidu.com:443 -servername vidu.com &lt;/dev/null 2&gt;&amp;1 \\
  | grep -E '^ [0-9] s:|Verify return code'

<span class="tok-comment"># Chứng chỉ hết hạn khi nào — chạy cái này trong cron</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject

<span class="tok-comment"># Chứng chỉ khai những tên nào (SAN), thứ QUYẾT ĐỊNH nó dùng được cho đâu</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-servername is not optional when testing</span><span class="v">Without it <code>openssl</code> sends no SNI, so a server hosting several sites hands you its default certificate and you conclude the wrong thing. Chapter 1's server selection applies here too — the certificate comes from whichever <code>server</code> block matched.</span></div>
  <div class="kv"><span class="k">The Common Name is ignored; SAN is what counts</span><span class="v">Browsers stopped honouring CN years ago. A certificate is valid for exactly the names in its Subject Alternative Name list, which is why a certificate for <code>vidu.com</code> that omits <code>www.vidu.com</code> breaks the <code>www</code> redirect you set up in Chapter 1.</span></div>
  <div class="kv"><span class="k">The private key never leaves the server and is never in the chain</span><span class="v"><code>privkey.pem</code> is referenced by <code>ssl_certificate_key</code> and nothing else. It should be readable only by root — Nginx's master process reads it before dropping privileges, which is one of the reasons the master runs as root at all (Section 0).</span></div>
  <div class="kv"><span class="k">One server block can hold several certificates</span><span class="v">Repeat <code>ssl_certificate</code> and <code>ssl_certificate_key</code> to serve an RSA and an ECDSA certificate from the same block; Nginx picks per client based on what they support. ECDSA handshakes are meaningfully cheaper, and old clients still get RSA.</span></div>
</div>

<h3>Where certificates come from, in practice</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Let's Encrypt via certbot, renewed automatically</span><span class="lz-lnote">90-day certificates renewed at 60 days by a timer. The thing to verify is not that renewal works but that <em>reload</em> works after it — a renewed certificate on disk does nothing until Nginx re-reads it, and <code>certbot</code>'s deploy hook is where that belongs.</span></div>
  <div class="lz-layer"><span class="lz-lname">The ACME challenge must stay reachable</span><span class="lz-lnote"><code>location /.well-known/acme-challenge/ { root /var/www/certbot; }</code> on port 80, above any redirect to HTTPS. A blanket <code>return 301 https://...</code> on port 80 breaks renewal silently, and you find out 60 days later.</span></div>
  <div class="lz-layer"><span class="lz-lname">Behind a CDN, there are two certificates</span><span class="lz-lnote">One the CDN presents to users and one your origin presents to the CDN. They are separate, they expire separately, and an expired origin certificate is invisible from a browser — check it directly against the origin address.</span></div>
  <div class="lz-layer"><span class="lz-lname">Monitor expiry as a number, not as an alert from users</span><span class="lz-lnote">A daily cron that prints days-remaining and alerts under 21 costs three lines and removes an entire category of outage. The <code>openssl x509 -noout -dates</code> command above is the whole implementation.</span></div>
</div>
<div class="note-ct">
<p><strong>What to do right after enabling TLS.</strong> Run the three <code>openssl</code> commands above against your real hostname from a machine that is not yours. Count the certificates, read the verify code, check the SAN list covers every name you serve, and note the expiry date somewhere that will tell you before a user does. That is about two minutes, and it catches the missing intermediate, the missing <code>www</code>, and the certificate that was issued for a hostname you stopped using.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/configuring_https_servers.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">nginx — Configuring HTTPS servers</span><span class="lc-sub">nginx.org · Including the paragraph about the chained certificate file</span></span></a>
<a class="link-card" href="https://letsencrypt.org/docs/certificates-for-localhost/" target="_blank" rel="noopener"><span class="lc-ico">🔏</span><span class="lc-body"><span class="lc-title">Let's Encrypt — certificate files explained</span><span class="lc-sub">letsencrypt.org · What each of the four files it writes is for</span></span></a>
<a class="link-card" href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener"><span class="lc-ico">🧾</span><span class="lc-body"><span class="lc-title">SSL Labs server test</span><span class="lc-sub">ssllabs.com · Reports a missing intermediate as "Chain issues: Incomplete"</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">What a certificate actually proves, and what it does not</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build a three-level chain, serve it both ways, and read the two verify codes</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Chuỗi chứng chỉ, và cái CA trung gian ai cũng quên</h2>
<p class="lead">Bật HTTPS lên tốn bốn dòng, và cả chương này lẽ ra đã dừng ở đó nếu một trong bốn dòng ấy không phải là cách phá TLS PHỔ BIẾN NHẤT theo kiểu chạy ngon trên máy bạn mà hỏng với một người dùng thật.</p>

<h3>Bốn dòng</h3>
<pre><code>server {
  listen 443 ssl;
  http2 on;                                      <span class="tok-comment"># nginx ≥ 1.25.1; cũ hơn thì viết "listen 443 ssl http2;"</span>
  server_name vidu.com;

  ssl_certificate     /etc/letsencrypt/live/vidu.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/vidu.com/privkey.pem;

  root /srv/site;
}</code></pre>
<div class="callout warn">
<p><strong>Cú pháp <code>http2</code> ĐÃ ĐỔI, và dạng cũ vẫn dùng được.</strong> Tới nginx 1.25.0 thì nó là một tham số của <code>listen</code>; từ 1.25.1 nó thành một chỉ thị riêng. Viết <code>http2 on;</code> trên một bản cũ hơn thì nhận <code>unknown directive "http2"</code> và cấu hình KHÔNG nạp được — đúng chuyện đã xảy ra trong lúc dựng chương này trên nginx 1.24.0. Hãy kiểm phiên bản của bạn TRƯỚC khi chép một trong hai dạng từ một bài viết nào đó.</p>
</div>

<h3>Chuỗi là cái gì, và vì sao có tới HAI tệp</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Root CA</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đã nằm sẵn trong mọi kho tin cậy</span><span class="lz-nsub">Đi kèm hệ điều hành và trình duyệt · bạn KHÔNG gửi nó và cũng không cần</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Trung gian</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Được root ký, và nó ký chứng chỉ của bạn</span><span class="lz-nsub">KHÔNG nằm trong kho tin cậy · client chỉ lấy được nó TỪ BẠN</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chứng chỉ của bạn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ghi tên các tên miền của bạn</span><span class="lz-nsub">Cái lá · với Let's Encrypt thì có hiệu lực 90 ngày</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">fullchain.pem</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Lá và trung gian, theo đúng thứ tự đó</span><span class="lz-nsub">Đây mới là tệp <code>ssl_certificate</code> cần · còn <code>cert.pem</code> chỉ có mỗi cái lá</span></div></div>
  </div>
</div>
<div class="out">Chuoi 3 tang that: ROOT -> TRUNG GIAN -> vidu.com
Client CHI tin ROOT (dung nhu mot trinh duyet)

  ssl_certificate la-fullchain.crt (la + trung gian)
     -> 2 chung chi gui ra | Verify return code: 0 (ok)

  ssl_certificate la.crt (chi mot minh chung chi cua ban)
     -> 1 chung chi gui ra | Verify return code: 21
        (unable to verify the first certificate)</div>
<div class="pitfall">
<p><strong>Bẫy — trỏ <code>ssl_certificate</code> vào <code>cert.pem</code> thay vì <code>fullchain.pem</code> tạo ra một site chạy HOÀN HẢO trên trình duyệt của bạn và hỏng với một phần lớn client thật.</strong> Trình duyệt CACHE lại những CA trung gian nó từng thấy, và vài cái còn tự đi tải cái đang thiếu qua mạng, nên người vừa cài đặt nhìn thấy ổ khoá xanh rồi đi làm việc khác. Một trình duyệt di động mới tinh, một ứng dụng Android, <code>curl</code>, một cổng thanh toán đang gọi webhook của bạn, và mọi thứ có ghim chứng chỉ — tất cả đều HỎNG, kèm một thông báo nói rằng chứng chỉ không đáng tin, và câu đó đẩy mọi người đi truy một vấn đề nằm ở chính cái chứng chỉ. Phép đo ở trên chính là toàn bộ phần chẩn đoán: hãy ĐẾM số chứng chỉ máy chủ gửi ra. MỘT nghĩa là thiếu trung gian. HAI hoặc BA nghĩa là chuỗi đầy đủ. <code>openssl s_client -connect host:443 &lt;/dev/null | grep -c '^ [0-9] s:'</code> trả lời trong một lệnh, và nó đáng chạy sau MỖI lần gia hạn chứng chỉ chứ không chỉ lần đầu.</p>
</div>

<h3>Đọc một chuỗi từ bên ngoài</h3>
<pre><code><span class="tok-comment"># Máy chủ gửi ra những chứng chỉ nào, và xác thực có qua không</span>
openssl s_client -connect vidu.com:443 -servername vidu.com &lt;/dev/null 2&gt;&amp;1 \\
  | grep -E '^ [0-9] s:|Verify return code'

<span class="tok-comment"># Chứng chỉ hết hạn khi nào — chạy cái này trong cron</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject

<span class="tok-comment"># Chứng chỉ khai những tên nào (SAN), thứ QUYẾT ĐỊNH nó dùng được cho đâu</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-servername KHÔNG phải tuỳ chọn khi đi kiểm</span><span class="v">Thiếu nó thì <code>openssl</code> không gửi SNI, nên một máy chủ đang chứa nhiều site sẽ đưa cho bạn chứng chỉ MẶC ĐỊNH của nó và bạn kết luận sai. Phép chọn server ở Chương 1 áp dụng luôn ở đây — cái chứng chỉ tới từ khối <code>server</code> nào vừa khớp.</span></div>
  <div class="kv"><span class="k">Common Name bị BỎ QUA; SAN mới là thứ có nghĩa lý</span><span class="v">Trình duyệt thôi tôn trọng CN từ nhiều năm trước. Một chứng chỉ hợp lệ cho ĐÚNG những tên nằm trong danh sách Subject Alternative Name của nó, và đó là lý do một chứng chỉ cho <code>vidu.com</code> mà thiếu <code>www.vidu.com</code> sẽ phá cái chuyển hướng <code>www</code> bạn dựng ở Chương 1.</span></div>
  <div class="kv"><span class="k">Khoá riêng KHÔNG BAO GIỜ rời máy chủ và KHÔNG nằm trong chuỗi</span><span class="v"><code>privkey.pem</code> được <code>ssl_certificate_key</code> tham chiếu tới và không ai khác. Nó chỉ nên đọc được bởi root — tiến trình master của Nginx đọc nó TRƯỚC khi hạ quyền, và đó là một trong những lý do master chạy bằng root (Mục 0).</span></div>
  <div class="kv"><span class="k">Một khối server giữ được NHIỀU chứng chỉ</span><span class="v">Lặp lại <code>ssl_certificate</code> và <code>ssl_certificate_key</code> là phục vụ được cả một chứng chỉ RSA lẫn một chứng chỉ ECDSA từ cùng một khối; Nginx chọn theo từng client dựa vào thứ họ hỗ trợ. Bắt tay ECDSA rẻ hơn ĐÁNG KỂ, còn client cũ thì vẫn nhận RSA.</span></div>
</div>

<h3>Chứng chỉ tới từ đâu, ngoài đời thật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Let's Encrypt qua certbot, gia hạn tự động</span><span class="lz-lnote">Chứng chỉ 90 ngày, gia hạn ở ngày thứ 60 bằng một cái hẹn giờ. Thứ cần kiểm KHÔNG phải là việc gia hạn có chạy không mà là việc NẠP LẠI có chạy không sau đó — một chứng chỉ mới nằm trên đĩa thì chẳng làm gì cho tới khi Nginx đọc lại nó, và cái deploy hook của <code>certbot</code> là chỗ dành cho việc đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đường thử thách ACME phải luôn CHẠM TỚI ĐƯỢC</span><span class="lz-lnote"><code>location /.well-known/acme-challenge/ { root /var/www/certbot; }</code> trên cổng 80, ĐỨNG TRÊN mọi cú chuyển hướng sang HTTPS. Một dòng <code>return 301 https://...</code> phủ cả cổng 80 sẽ phá việc gia hạn trong im lặng, và bạn phát hiện ra sau 60 ngày.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đứng sau một CDN thì có HAI chứng chỉ</span><span class="lz-lnote">Một cái CDN đưa cho người dùng và một cái máy gốc của bạn đưa cho CDN. Chúng RIÊNG BIỆT, chúng hết hạn riêng, và một chứng chỉ gốc đã hết hạn thì VÔ HÌNH khi nhìn từ trình duyệt — hãy kiểm nó trực tiếp trên địa chỉ máy gốc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy giám sát hạn dùng như một CON SỐ, đừng đợi người dùng báo</span><span class="lz-lnote">Một cron chạy hằng ngày in ra số ngày còn lại và kêu khi dưới 21 thì tốn ba dòng và xoá cả một loại sự cố. Lệnh <code>openssl x509 -noout -dates</code> ở trên chính là toàn bộ phần cài đặt.</span></div>
</div>
<div class="note-ct">
<p><strong>Làm gì ngay sau khi bật TLS.</strong> Hãy chạy ba lệnh <code>openssl</code> ở trên nhắm vào tên miền THẬT của bạn, từ một cái máy KHÔNG phải máy bạn. Đếm số chứng chỉ, đọc mã xác thực, kiểm xem danh sách SAN có phủ mọi tên bạn đang phục vụ không, và ghi cái ngày hết hạn vào đâu đó sẽ báo cho bạn trước khi một người dùng báo. Việc đó tốn chừng hai phút, và nó bắt được cái trung gian bị thiếu, cái <code>www</code> bị thiếu, và cái chứng chỉ cấp cho một tên miền bạn đã thôi dùng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/configuring_https_servers.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">nginx — Cấu hình máy chủ HTTPS</span><span class="lc-sub">nginx.org · Kèm cả đoạn nói về tệp chứng chỉ nối chuỗi</span></span></a>
<a class="link-card" href="https://letsencrypt.org/docs/certificates-for-localhost/" target="_blank" rel="noopener"><span class="lc-ico">🔏</span><span class="lc-body"><span class="lc-title">Let's Encrypt — giải thích các tệp chứng chỉ</span><span class="lc-sub">letsencrypt.org · Bốn tệp nó ghi ra thì mỗi cái để làm gì</span></span></a>
<a class="link-card" href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener"><span class="lc-ico">🧾</span><span class="lc-body"><span class="lc-title">SSL Labs server test</span><span class="lc-sub">ssllabs.com · Nó báo thiếu trung gian bằng dòng "Chain issues: Incomplete"</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Một chứng chỉ THẬT SỰ chứng minh cái gì, và KHÔNG chứng minh cái gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng một chuỗi ba tầng, phục vụ nó theo cả hai cách, rồi đọc hai mã xác thực</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Which protocol and cipher actually get used|||6.2 — Rốt cuộc giao thức nào và bộ mã nào được dùng',
      slug: 'nginx-6-2-giao-thuc-va-bo-ma',
      type: 'LESSON',
      description: 'Bài này thử LẦN LƯỢT 158 bộ mã vào hai khối server để xem mỗi khối thật sự chấp nhận bao nhiêu. Khối mặc định nhận 21, khối khai tường minh nhận 3 — và trong 21 cái kia có 12 cái KHÔNG có forward secrecy, tức là một phiên bị ghi lại hôm nay có thể giải mã được vào ngày khoá riêng bị lộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Which protocol and cipher actually get used</h2>
<p class="lead">Every TLS guide hands you a block of <code>ssl_protocols</code> and <code>ssl_ciphers</code> to paste in, and none of them show what changes. This lesson measures it: two server blocks, one with the defaults and one with an explicit list, tested against every cipher the local OpenSSL knows.</p>

<h3>Protocol versions, measured both ways</h3>
<div class="out">Client hien dai (OpenSSL 3.0) tu thuong luong:
  cong 8443 (mac dinh)  -> TLSv1.3, TLS_AES_256_GCM_SHA384
  cong 8444 (khai ro)   -> TLSv1.3, TLS_AES_256_GCM_SHA384

Ep tung phien ban:
  -tls1     -> client tu tu choi ("no protocols available")
  -tls1_1   -> client tu tu choi
  -tls1_2   -> TLSv1.2, ECDHE-RSA-AES256-GCM-SHA384
  -tls1_3   -> TLSv1.3, TLS_AES_256_GCM_SHA384

Ep client CHIU noi TLS 1.0 (ha muc an ninh cua OpenSSL):
  ca hai cong -> "alert protocol version"
              ^ lan nay la MAY CHU tu choi, khong phai client</div>
<div class="callout ok">
<p><strong>The last row is the one that means something.</strong> The first two "rejections" were the local client refusing to even offer TLS 1.0 — modern OpenSSL builds disable it at compile time, so a naive test tells you nothing about your server. Forcing the client to lower its own security level made it offer TLS 1.0 for real, and the server answered with <code>alert protocol version</code>. That is the server declining, and it means this nginx build already excludes the obsolete versions without any <code>ssl_protocols</code> line. Worth checking on your own build rather than assuming either way — the check is one command.</p>
</div>

<h3>Cipher suites: 158 tried, one at a time</h3>
<div class="out">Khoi HIEN DAI (co ssl_ciphers khai ro):
    3 chap nhan / 155 tu choi
      ECDHE-RSA-AES256-GCM-SHA384
      ECDHE-RSA-CHACHA20-POLY1305
      ECDHE-RSA-AES128-GCM-SHA256

Khoi MAC DINH (khong khai ssl_ciphers):
   21 chap nhan / 137 tu choi

Trong 21 cai do, 12 cai KHONG co ECDHE:
   AES128-CCM        AES128-CCM8       AES128-GCM-SHA256  AES128-SHA256
   AES256-CCM        AES256-CCM8       AES256-GCM-SHA384  AES256-SHA256
   ARIA128-GCM-SHA256  ARIA256-GCM-SHA384
   CAMELLIA128-SHA256  CAMELLIA256-SHA256</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No ECDHE means no forward secrecy</span><span class="lz-d">Those twelve use static RSA key exchange: the session key is encrypted with the server's public key. Anyone who records the traffic today and obtains the private key later — a breach, a stolen backup, a seized disk — can decrypt every recorded session retroactively.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With ECDHE, the session key never crosses the wire</span><span class="lz-d">Both sides derive it from ephemeral values that are discarded afterwards. The private key only proves identity; losing it later exposes nothing that was already recorded. This is the whole reason the modern list contains nothing else.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TLS 1.3 removed the choice entirely</span><span class="lz-d">All five of its cipher suites are forward-secret and AEAD, so <code>ssl_ciphers</code> does not apply to TLS 1.3 at all. The list you write only matters for the TLS 1.2 clients you still support — which is why the modern block is short.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A smaller list is a smaller attack surface</span><span class="lz-d">Three accepted instead of twenty-one. Every suite you keep is one more implementation that has to be correct, and the history of TLS is largely a history of suites that turned out not to be.</span></div>
</div>
<pre><code>ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;      <span class="tok-comment"># để CLIENT chọn — nó biết phần cứng của nó</span>
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
            ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
            ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

<span class="tok-comment"># Sáu mục, mỗi thuật toán một cặp ECDSA/RSA. Chứng chỉ RSA thì ba mục</span>
<span class="tok-comment"># ECDSA nằm im — đúng như phép đo: 3 được chấp nhận, không phải 6.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ssl_prefer_server_ciphers off is the modern advice</span><span class="v">It used to be <code>on</code>, to stop a client picking something weak. Once the server's list contains only strong suites there is nothing weak to pick, and letting the client choose lets a phone without AES hardware pick ChaCha20, which is several times faster for it. Turning it on now mainly forces slow choices onto mobile clients.</span></div>
  <div class="kv"><span class="k">ChaCha20 belongs in the list for exactly that reason</span><span class="v">Devices with AES-NI pick AES-GCM; devices without it pick ChaCha20 and get a large speedup. Both are in the measured list above, and which one a given client uses is its own decision.</span></div>
  <div class="kv"><span class="k">Dropping TLS 1.2 entirely is now defensible</span><span class="v"><code>ssl_protocols TLSv1.3;</code> makes <code>ssl_ciphers</code> irrelevant and removes an entire protocol's worth of complexity. It excludes some older Android and any client without TLS 1.3 — check your own logs for what actually connects before deciding, because for many sites the answer is nothing.</span></div>
  <div class="kv"><span class="k">Do not paste a cipher list from an article without a date</span><span class="v">Lists that were correct in 2016 include suites that are now removed from OpenSSL entirely, and Nginx will simply not start or will silently accept fewer suites than you wrote. Generate one from Mozilla's configurator against your actual versions instead.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>ssl_ciphers</code> silently accepts names your OpenSSL does not have, so a list that looks fine can be doing much less than it says.</strong> Nginx does not error on unknown suite names; they are just not offered. A config that lists ten suites where only three exist in your build behaves exactly like a config listing three — which is fine when it is the three you wanted and dangerous when the ones that vanished were the ECDSA entries and the ones remaining are not what you expected. The check is the same experiment as this lesson: loop over <code>openssl ciphers ALL</code>, connect once per suite, and count what actually completes a handshake. It takes a minute and it is the only way to know what your server accepts rather than what your config says.</p>
</div>

<h3>Reading it from outside</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One suite at a time is the honest test</span><span class="lz-lnote"><code>openssl s_client -connect host:443 -tls1_2 -cipher SUITE</code> for each name. A completed handshake means accepted. This is what produced both counts above, and unlike reading the config it cannot be wrong about what the build actually supports.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ssl_protocol and $ssl_cipher in the log</span><span class="lz-lnote">Add both to your access log format and you learn what your real users negotiate. That number, not a survey, tells you whether dropping TLS 1.2 would break anybody.</span></div>
  <div class="lz-layer"><span class="lz-lname">SSL Labs for the public view</span><span class="lz-lnote">It tests from outside with a large matrix of simulated clients and names the specific old Android and Java versions that would fail. For a public site it is worth running once after any TLS change.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mozilla's configurator for the list itself</span><span class="lz-lnote">Pick "intermediate" unless you have a reason, give it your Nginx and OpenSSL versions, and paste what it generates. It is maintained as suites are deprecated, which a snippet in your notes is not.</span></div>
</div>
<div class="note-ct">
<p><strong>What this lesson is really arguing.</strong> The defaults here were not dangerous — no export ciphers, no RC4, no TLS 1.0. They were just wider than they needed to be, and twelve of the twenty-one accepted suites gave up forward secrecy for no benefit. Three explicit lines closed that, and the measurement is what turns "paste this for security" into a change you can see the effect of.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">ssl-config.mozilla.org · Generates the block for your exact versions, and stays current</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_ciphers" target="_blank" rel="noopener"><span class="lc-ico">🔡</span><span class="lc-body"><span class="lc-title">nginx — ssl_ciphers and ssl_protocols</span><span class="lc-sub">nginx.org · Syntax, defaults, and the note that TLS 1.3 suites are separate</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">MDN — Transport Layer Security</span><span class="lc-sub">developer.mozilla.org · What forward secrecy is and why it is the deciding property</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Key exchange, and what an attacker with a recorded session can do later</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Loop over every cipher name and count what your own server really accepts</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Rốt cuộc giao thức nào và bộ mã nào được dùng</h2>
<p class="lead">Mọi bài hướng dẫn TLS đều đưa cho bạn một khối <code>ssl_protocols</code> và <code>ssl_ciphers</code> để chép vào, và không bài nào cho bạn thấy nó ĐỔI cái gì. Bài này đem đo: hai khối server, một cái dùng mặc định và một cái khai tường minh, thử với MỌI bộ mã mà OpenSSL trên máy biết.</p>

<h3>Phiên bản giao thức, đo theo cả hai cách</h3>
<div class="out">Client hien dai (OpenSSL 3.0) tu thuong luong:
  cong 8443 (mac dinh)  -> TLSv1.3, TLS_AES_256_GCM_SHA384
  cong 8444 (khai ro)   -> TLSv1.3, TLS_AES_256_GCM_SHA384

Ep tung phien ban:
  -tls1     -> client tu tu choi ("no protocols available")
  -tls1_1   -> client tu tu choi
  -tls1_2   -> TLSv1.2, ECDHE-RSA-AES256-GCM-SHA384
  -tls1_3   -> TLSv1.3, TLS_AES_256_GCM_SHA384

Ep client CHIU noi TLS 1.0 (ha muc an ninh cua OpenSSL):
  ca hai cong -> "alert protocol version"
              ^ lan nay la MAY CHU tu choi, khong phai client</div>
<div class="callout ok">
<p><strong>Dòng cuối mới là dòng CÓ NGHĨA.</strong> Hai lần "từ chối" đầu tiên là do CLIENT trên máy không thèm đề nghị TLS 1.0 — các bản OpenSSL hiện đại tắt nó ngay lúc biên dịch, nên một phép thử ngây thơ chẳng nói được gì về máy chủ của bạn cả. Ép client hạ mức an ninh của chính nó xuống thì nó mới thật sự đề nghị TLS 1.0, và máy chủ đáp lại bằng <code>alert protocol version</code>. ĐÓ mới là máy chủ từ chối, và nó nghĩa là bản dựng nginx này vốn đã loại các phiên bản lỗi thời mà chẳng cần dòng <code>ssl_protocols</code> nào. Đáng đi kiểm trên bản dựng CỦA BẠN chứ đừng cho là thế nào cả — phép kiểm chỉ tốn một lệnh.</p>
</div>

<h3>Bộ mã: thử 158 cái, từng cái một</h3>
<div class="out">Khoi HIEN DAI (co ssl_ciphers khai ro):
    3 chap nhan / 155 tu choi
      ECDHE-RSA-AES256-GCM-SHA384
      ECDHE-RSA-CHACHA20-POLY1305
      ECDHE-RSA-AES128-GCM-SHA256

Khoi MAC DINH (khong khai ssl_ciphers):
   21 chap nhan / 137 tu choi

Trong 21 cai do, 12 cai KHONG co ECDHE:
   AES128-CCM        AES128-CCM8       AES128-GCM-SHA256  AES128-SHA256
   AES256-CCM        AES256-CCM8       AES256-GCM-SHA384  AES256-SHA256
   ARIA128-GCM-SHA256  ARIA256-GCM-SHA384
   CAMELLIA128-SHA256  CAMELLIA256-SHA256</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có ECDHE nghĩa là KHÔNG có forward secrecy</span><span class="lz-d">Mười hai cái đó dùng trao khoá RSA TĨNH: khoá phiên được mã hoá bằng khoá công khai của máy chủ. Ai ghi lại lưu lượng hôm nay rồi lấy được khoá riêng SAU NÀY — một vụ xâm nhập, một bản sao lưu bị mất, một cái đĩa bị tịch thu — đều giải mã ngược được MỌI phiên đã ghi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có ECDHE thì khoá phiên KHÔNG BAO GIỜ đi qua dây</span><span class="lz-d">Hai bên cùng suy ra nó từ những giá trị phù du rồi vứt đi sau đó. Khoá riêng chỉ để CHỨNG MINH danh tính; mất nó về sau không phơi ra thứ gì đã bị ghi lại. Đó là toàn bộ lý do danh sách hiện đại chẳng chứa gì khác.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TLS 1.3 đã XOÁ hẳn quyền chọn</span><span class="lz-d">Cả năm bộ mã của nó đều forward-secret và đều là AEAD, nên <code>ssl_ciphers</code> KHÔNG áp dụng cho TLS 1.3 chút nào. Cái danh sách bạn viết chỉ có nghĩa lý với đám client TLS 1.2 mà bạn còn hỗ trợ — và đó là lý do khối hiện đại rất NGẮN.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Danh sách nhỏ hơn là bề mặt tấn công nhỏ hơn</span><span class="lz-d">Ba cái được chấp nhận thay vì hai mươi mốt. Mỗi bộ mã bạn giữ lại là thêm một phần cài đặt phải ĐÚNG, và lịch sử của TLS phần lớn là lịch sử của những bộ mã hoá ra là không đúng.</span></div>
</div>
<pre><code>ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;      <span class="tok-comment"># để CLIENT chọn — nó biết phần cứng của nó</span>
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
            ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
            ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

<span class="tok-comment"># Sáu mục, mỗi thuật toán một cặp ECDSA/RSA. Chứng chỉ RSA thì ba mục</span>
<span class="tok-comment"># ECDSA nằm im — đúng như phép đo: 3 được chấp nhận, không phải 6.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ssl_prefer_server_ciphers off mới là lời khuyên hiện đại</span><span class="v">Xưa nó là <code>on</code>, để ngăn client chọn phải thứ yếu. Một khi danh sách của máy chủ chỉ còn toàn bộ mã mạnh thì chẳng còn gì yếu để chọn, và để client tự quyết nghĩa là một cái điện thoại không có phần cứng AES sẽ chọn ChaCha20, thứ nhanh hơn NHIỀU LẦN với nó. Bật nó lên bây giờ chủ yếu là ép những lựa chọn chậm lên đám client di động.</span></div>
  <div class="kv"><span class="k">ChaCha20 nằm trong danh sách đúng vì lý do đó</span><span class="v">Thiết bị có AES-NI thì chọn AES-GCM; thiết bị không có thì chọn ChaCha20 và nhanh lên rất nhiều. Cả hai đều nằm trong danh sách đã đo ở trên, và cái nào được dùng là quyết định của CHÍNH client.</span></div>
  <div class="kv"><span class="k">Bỏ hẳn TLS 1.2 bây giờ là chuyện bảo vệ được</span><span class="v"><code>ssl_protocols TLSv1.3;</code> làm <code>ssl_ciphers</code> thành vô nghĩa và gỡ bỏ độ phức tạp của trọn một giao thức. Nó loại vài bản Android cũ và mọi client không có TLS 1.3 — hãy soi log CỦA BẠN xem thật sự có ai kết nối kiểu đó không trước khi quyết, vì với nhiều site thì câu trả lời là KHÔNG có ai.</span></div>
  <div class="kv"><span class="k">Đừng chép một danh sách bộ mã từ một bài viết KHÔNG ghi ngày</span><span class="v">Những danh sách đúng vào năm 2016 có chứa các bộ mã mà nay OpenSSL đã gỡ hẳn, và Nginx sẽ hoặc không khởi động nổi hoặc âm thầm chấp nhận ÍT hơn con số bạn viết. Thay vào đó hãy sinh một cái từ bộ cấu hình của Mozilla đúng theo phiên bản bạn đang chạy.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>ssl_ciphers</code> ÂM THẦM chấp nhận những cái tên mà OpenSSL của bạn không có, nên một danh sách trông ổn có thể đang làm ít hơn nhiều so với những gì nó nói.</strong> Nginx KHÔNG báo lỗi với tên bộ mã lạ; chúng chỉ đơn giản là không được đề nghị. Một cấu hình liệt kê mười bộ mã mà chỉ ba cái tồn tại trong bản dựng của bạn thì cư xử y hệt một cấu hình liệt kê ba — điều đó ổn khi ba cái ấy đúng là ba cái bạn muốn, và NGUY khi những cái biến mất là đám ECDSA còn những cái còn lại không phải thứ bạn tưởng. Phép kiểm chính là thí nghiệm của bài này: lặp qua <code>openssl ciphers ALL</code>, kết nối một lần cho mỗi bộ mã, rồi ĐẾM xem cái nào thật sự bắt tay xong. Nó tốn một phút và nó là cách duy nhất để biết máy chủ CHẤP NHẬN gì chứ không phải cấu hình NÓI gì.</p>
</div>

<h3>Đọc nó từ bên ngoài</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Từng bộ mã một mới là phép thử thật thà</span><span class="lz-lnote"><code>openssl s_client -connect host:443 -tls1_2 -cipher TEN</code> cho mỗi cái tên. Bắt tay xong nghĩa là được chấp nhận. Đó là thứ đã sinh ra cả hai con số ở trên, và khác với việc đọc cấu hình, nó không thể sai về chuyện bản dựng thật sự hỗ trợ cái gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ssl_protocol và $ssl_cipher trong log</span><span class="lz-lnote">Thêm cả hai vào định dạng access log là bạn biết người dùng THẬT của mình thương lượng ra cái gì. Chính con số đó, chứ không phải một bản khảo sát, nói cho bạn biết bỏ TLS 1.2 có làm hỏng ai không.</span></div>
  <div class="lz-layer"><span class="lz-lname">SSL Labs cho góc nhìn từ công chúng</span><span class="lz-lnote">Nó kiểm từ bên ngoài với một ma trận lớn các client mô phỏng và gọi tên đúng những phiên bản Android hay Java cũ sẽ hỏng. Với một site công khai thì nó đáng chạy một lần sau mỗi thay đổi TLS.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ cấu hình của Mozilla để lấy chính cái danh sách</span><span class="lz-lnote">Chọn "intermediate" trừ khi bạn có lý do khác, đưa cho nó phiên bản Nginx và OpenSSL của bạn, rồi dán thứ nó sinh ra. Nó được BẢO TRÌ theo các bộ mã bị khai tử, còn một mẩu ghi chú trong sổ tay bạn thì không.</span></div>
</div>
<div class="note-ct">
<p><strong>Bài này thật sự đang lập luận điều gì.</strong> Đám mặc định ở đây KHÔNG nguy hiểm — không có bộ mã xuất khẩu, không có RC4, không có TLS 1.0. Chúng chỉ RỘNG hơn mức cần thiết, và mười hai trong hai mươi mốt bộ mã được chấp nhận đã đánh đổi forward secrecy để lấy về... không gì cả. Ba dòng khai tường minh bịt được chuyện đó, và phép đo mới là thứ biến câu "dán cái này vào cho an toàn" thành một thay đổi mà bạn NHÌN THẤY được tác dụng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">ssl-config.mozilla.org · Sinh khối cấu hình đúng theo phiên bản của bạn, và luôn được cập nhật</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_ciphers" target="_blank" rel="noopener"><span class="lc-ico">🔡</span><span class="lc-body"><span class="lc-title">nginx — ssl_ciphers và ssl_protocols</span><span class="lc-sub">nginx.org · Cú pháp, giá trị mặc định, và ghi chú rằng bộ mã TLS 1.3 nằm riêng</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">MDN — Transport Layer Security</span><span class="lc-sub">developer.mozilla.org · Forward secrecy là gì và vì sao nó là tính chất quyết định</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Trao khoá, và kẻ tấn công cầm một phiên đã ghi lại thì làm được gì về sau</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Lặp qua mọi tên bộ mã và đếm xem máy chủ của chính bạn thật sự chấp nhận cái nào</span></span></a>
</div>
`,
    },
  ],
};
