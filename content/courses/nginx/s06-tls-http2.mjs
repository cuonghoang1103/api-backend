import G06_1 from './giang/ngx-06-1.mjs';
import G06_2 from './giang/ngx-06-2.mjs';
import G06_3 from './giang/ngx-06-3.mjs';
import G06_4 from './giang/ngx-06-4.mjs';
import G06_5 from './giang/ngx-06-5.mjs';
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
${G06_1}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The certificate chain, and the intermediate everyone forgets</h2>
<p class="lead">Enabling HTTPS is four lines, and the whole chapter could stop there if one of those four lines were not the single most common way to break TLS in a way that works on your laptop and fails for a real user.</p>

<h3>The four lines</h3>
<pre><code class="language-bash">server {
  listen 443 ssl;
  http2 on;                                      <span class="tok-comment"># nginx ≥ 1.25.1; on older versions write "listen 443 ssl http2;"</span>
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
<p><strong>Trap — pointing <code>ssl_certificate</code> at <code>cert.pem</code> instead of <code>fullchain.pem</code> produces a site that works perfectly in your browser and fails for a large fraction of real clients.</strong> Browsers cache intermediates they have seen before, and some fetch a missing one over the network, so the developer who set it up sees a green padlock and moves on. A fresh mobile browser, an Android app, <code>curl</code>, a payment gateway calling your webhook, and anything doing certificate pinning all fail — with an error that says the certificate is untrusted, which sends everyone hunting for a problem with the certificate itself. The measurement above is the whole diagnosis: count the certificates the server sends. One means the intermediate is missing. Two or three means the chain is complete. <code>openssl s_client -connect host:443 &lt;/dev/null | grep -c '^ [0-9] s:'</code> answers it in one command, and it is worth running after every certificate renewal, not only the first time.</p>
</div>

<h3>Reading a chain from the outside</h3>
<pre><code><span class="tok-comment"># Which certificates the server sends, and whether validation passes</span>
openssl s_client -connect vidu.com:443 -servername vidu.com &lt;/dev/null 2&gt;&amp;1 \\
  | grep -E '^ [0-9] s:|Verify return code'

<span class="tok-comment"># When the certificate expires — run this from cron</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject

<span class="tok-comment"># Which names the certificate declares (SAN) — what DECIDES where it is usable</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2&gt;/dev/null \\
  | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-servername is not optional when testing BY IP</span><span class="v">Measured with OpenSSL 3: connected by IP (an origin behind a CDN, say), <code>openssl</code> sends no SNI and the server hands you its DEFAULT certificate (<code>CN = may-mac-dinh</code>, verify 18). Connected by a NAME, OpenSSL 3 sends that name as SNI by itself. Add <code>-servername</code> whenever you connect by address. Chapter 1's server selection applies here too — the certificate comes from whichever <code>server</code> block matched.</span></div>
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

<h3>🔬 Run it yourself</h3>
<p>A real three-level chain built with <code>openssl</code>, one port serving fullchain and one the leaf alone, a default server for the SNI test, an RSA + ECDSA pair in one block, and a renewal before and after reload — nginx/1.24.0, OpenSSL 3.0 (add <code>127.0.0.1 vidu.com www.vidu.com</code> to <code>/etc/hosts</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># tao-chuoi.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># tao-chuoi.sh — dựng một chuỗi 3 tầng THẬT: Root CA -&gt; Trung gian -&gt; lá vidu.com (SAN vidu.com, www.vidu.com)</span>
set -e; mkdir -p /root/pki &amp;&amp; cd /root/pki
openssl req -x509 -newkey rsa:2048 -nodes -keyout root.key -out root.crt -days 3650 -subj "/CN=Lab Root CA" 2&gt;/dev/null
openssl req -newkey rsa:2048 -nodes -keyout tg.key -out tg.csr -subj "/CN=Lab Intermediate CA" 2&gt;/dev/null
printf 'basicConstraints=critical,CA:TRUE,pathlen:0\\nkeyUsage=critical,keyCertSign,cRLSign\\n' &gt; tg.ext
openssl x509 -req -in tg.csr -CA root.crt -CAkey root.key -CAcreateserial -out tg.crt -days 1825 -extfile tg.ext 2&gt;/dev/null
openssl req -newkey rsa:2048 -nodes -keyout la.key -out la.csr -subj "/CN=vidu.com" 2&gt;/dev/null
printf 'subjectAltName=DNS:vidu.com,DNS:www.vidu.com\\nbasicConstraints=CA:FALSE\\nextendedKeyUsage=serverAuth\\n' &gt; la.ext
openssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2&gt;/dev/null
cat la.crt tg.crt &gt; fullchain.crt
<span class="tok-comment"># lá ECDSA cùng tên (để một khối server giữ HAI chứng chỉ)</span>
openssl req -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout la-ec.key -out la-ec.csr -subj "/CN=vidu.com" 2&gt;/dev/null
openssl x509 -req -in la-ec.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la-ec.crt -days 90 -extfile la.ext 2&gt;/dev/null
cat la-ec.crt tg.crt &gt; fullchain-ec.crt
<span class="tok-comment"># máy MẶC ĐỊNH: chứng chỉ tự ký, tên khác — để thử SNI</span>
openssl req -x509 -newkey rsa:2048 -nodes -keyout md.key -out md.crt -days 30 -subj "/CN=may-mac-dinh" 2&gt;/dev/null
for f in root tg la; do printf '%-5s ' $f.crt; openssl x509 -in $f.crt -noout -subject -issuer | paste -sd' '; done</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {                                 <span class="tok-comment">  # máy MẶC ĐỊNH của cổng 8443</span>
    listen 8443 ssl default_server;
    ssl_certificate     /root/pki/md.crt;
    ssl_certificate_key /root/pki/md.key;
    return 200 "may mac dinh\\n";
  }
  server {                                 <span class="tok-comment">  # ĐÚNG: lá + trung gian</span>
    listen 8443 ssl;
    server_name vidu.com www.vidu.com;
    ssl_certificate     /root/pki/fullchain.crt;
    ssl_certificate_key /root/pki/la.key;
    ssl_certificate     /root/pki/fullchain-ec.crt; <span class="tok-comment">  # cặp thứ hai: ECDSA</span>
    ssl_certificate_key /root/pki/la-ec.key;
    return 200 "xin chao tu vidu.com\\n";
  }
  server {                                 <span class="tok-comment">  # SAI: chỉ mỗi cái lá</span>
    listen 8444 ssl;
    server_name vidu.com;
    ssl_certificate     /root/pki/la.crt;
    ssl_certificate_key /root/pki/la.key;
    return 200 "xin chao tu vidu.com\\n";
  }
}</code></pre>
<div class="out">$ bash tao-chuoi.sh
root.crt subject=CN = Lab Root CA issuer=CN = Lab Root CA
tg.crt subject=CN = Lab Intermediate CA issuer=CN = Lab Root CA
la.crt subject=CN = vidu.com issuer=CN = Lab Intermediate CA
$ for p in 8443 8444; do echo "== cong $p"; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'; done
== cong 8443
 0 s:CN = vidu.com
 1 s:CN = Lab Intermediate CA
Verify return code: 0 (ok)
== cong 8444
 0 s:CN = vidu.com
Verify return code: 21 (unable to verify the first certificate)
$ curl -s --cacert pki/root.crt https://vidu.com:8443/
xin chao tu vidu.com
$ curl -sS --cacert pki/root.crt https://vidu.com:8444/
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
$ openssl s_client -connect 127.0.0.1:8443 -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'
 0 s:CN = may-mac-dinh
Verify return code: 18 (self-signed certificate)
$ openssl s_client -connect vidu.com:8443 -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'
 0 s:CN = vidu.com
 1 s:CN = Lab Intermediate CA
Verify return code: 0 (ok)
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -dates -subject
notBefore=Nov 12 15:50:36 2026 GMT
notAfter=Feb 10 15:50:36 2027 GMT
subject=CN = vidu.com
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'
            X509v3 Subject Alternative Name: 
                DNS:vidu.com, DNS:www.vidu.com
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -checkend $((21*86400))
Certificate will not expire
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -checkend $((100*86400))
Certificate will expire
$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-32s' $c; openssl s_client -connect 127.0.0.1:8443 -servername vidu.com -tls1_2 -cipher $c &lt;/dev/null 2&gt;&amp;1 | grep -E 'Server public key' ; done
ECDHE-RSA-AES128-GCM-SHA256     Server public key is 2048 bit
ECDHE-ECDSA-AES128-GCM-SHA256   Server public key is 256 bit
$ nginx -v
nginx version: nginx/1.24.0 (Ubuntu)
$ nginx -t -c h2.conf
2026/11/12 15:50:37 [emerg] 3706#3706: unknown directive "http2" in h2.conf:5
nginx: configuration file h2.conf test failed
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial
serial=5A149BF0E5BC69E3B738D18BC45E5FB746867169
$ cd pki &amp;&amp; openssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2&gt;/dev/null &amp;&amp; cat la.crt tg.crt &gt; fullchain.crt &amp;&amp; openssl x509 -in la.crt -noout -serial | sed 's/^/tren dia: /'
tren dia: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial | sed 's/^/nginx dang gui: /'
nginx dang gui: serial=5A149BF0E5BC69E3B738D18BC45E5FB746867169
$ nginx -s reload -c chuoi.conf; sleep 0.5; echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial | sed 's/^/sau reload: /'
sau reload: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B
2026/11/12 15:54:07 [notice] 5790#5790: signal process started</div>
<p>fullchain: two certificates, verify 0; the leaf alone: one certificate, verify 21, and curl error 60. By IP with no name: the default certificate; by name: OpenSSL 3 sent SNI itself. <code>http2 on;</code> did not even load on 1.24.0. The new file on disk was NOT served until <code>nginx -s reload</code>.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-6-3-chung-chi" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 6.3 — Certificates, the chain of trust and CAs</span><span class="lc-sub">The same chain from the network side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-6-2-x509" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 6.2 — Inside an X.509 certificate</span><span class="lc-sub">What every field of the leaf means</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ssl_certificate</code> / <code>ssl_certificate_key</code></span><span class="v">The chained certificate file and the private key that go together in a server block.</span></div>
  <div class="kv"><span class="k">fullchain.pem vs cert.pem</span><span class="v">Leaf plus intermediate (what you serve) versus the leaf certificate alone.</span></div>
  <div class="kv"><span class="k">Intermediate CA</span><span class="v">Signed by the root and signs your leaf; not in any trust store, so the client can only get it from you.</span></div>
  <div class="kv"><span class="k">SAN (Subject Alternative Name)</span><span class="v">The exact list of names a certificate is valid for; the Common Name is ignored.</span></div>
  <div class="kv"><span class="k">Verify return code 21</span><span class="v">"unable to verify the first certificate" — the signature that the intermediate is missing.</span></div>
  <div class="kv"><span class="k">ACME challenge</span><span class="v">The /.well-known/acme-challenge path that certbot must be able to reach to renew.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>HTTPS is four lines, but pointing <code>ssl_certificate</code> at <code>cert.pem</code> instead of <code>fullchain.pem</code> omits the intermediate.</li><li>A missing intermediate works in your own browser yet fails for fresh mobile browsers, apps, <code>curl</code> and pinning clients.</li><li>Diagnose by counting the certificates the server sends: one means the intermediate is missing, two or three means the chain is complete.</li><li>SAN decides which names the certificate covers; the private key is referenced by <code>ssl_certificate_key</code> and never leaves the server.</li><li>Re-run the <code>openssl</code> checks and watch the expiry date after every renewal, not only the first setup.</li></ul>

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
<pre><code class="language-bash">server {
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
  <div class="kv"><span class="k">-servername KHÔNG phải tuỳ chọn khi kiểm BẰNG IP</span><span class="v">Đo với OpenSSL 3: nối bằng IP (ví dụ máy gốc sau CDN) thì <code>openssl</code> không gửi SNI và máy chủ đưa chứng chỉ của khối MẶC ĐỊNH (<code>CN = may-mac-dinh</code>, mã 18). Nối bằng TÊN thì OpenSSL 3 tự gửi chính tên đó làm SNI. Cứ nối bằng địa chỉ là phải thêm <code>-servername</code>. Phép chọn server ở Chương 1 áp dụng luôn ở đây — cái chứng chỉ tới từ khối <code>server</code> nào vừa khớp.</span></div>
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

<h3>🔬 Tự chạy lại</h3>
<p>Một chuỗi ba tầng thật dựng bằng <code>openssl</code>, một cổng phục vụ fullchain và một cổng chỉ cái lá, một máy mặc định để thử SNI, một cặp RSA + ECDSA trong cùng khối, và một lần gia hạn trước và sau reload — nginx/1.24.0, OpenSSL 3.0 (thêm <code>127.0.0.1 vidu.com www.vidu.com</code> vào <code>/etc/hosts</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># tao-chuoi.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># tao-chuoi.sh — dựng một chuỗi 3 tầng THẬT: Root CA -&gt; Trung gian -&gt; lá vidu.com (SAN vidu.com, www.vidu.com)</span>
set -e; mkdir -p /root/pki &amp;&amp; cd /root/pki
openssl req -x509 -newkey rsa:2048 -nodes -keyout root.key -out root.crt -days 3650 -subj "/CN=Lab Root CA" 2&gt;/dev/null
openssl req -newkey rsa:2048 -nodes -keyout tg.key -out tg.csr -subj "/CN=Lab Intermediate CA" 2&gt;/dev/null
printf 'basicConstraints=critical,CA:TRUE,pathlen:0\\nkeyUsage=critical,keyCertSign,cRLSign\\n' &gt; tg.ext
openssl x509 -req -in tg.csr -CA root.crt -CAkey root.key -CAcreateserial -out tg.crt -days 1825 -extfile tg.ext 2&gt;/dev/null
openssl req -newkey rsa:2048 -nodes -keyout la.key -out la.csr -subj "/CN=vidu.com" 2&gt;/dev/null
printf 'subjectAltName=DNS:vidu.com,DNS:www.vidu.com\\nbasicConstraints=CA:FALSE\\nextendedKeyUsage=serverAuth\\n' &gt; la.ext
openssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2&gt;/dev/null
cat la.crt tg.crt &gt; fullchain.crt
<span class="tok-comment"># lá ECDSA cùng tên (để một khối server giữ HAI chứng chỉ)</span>
openssl req -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout la-ec.key -out la-ec.csr -subj "/CN=vidu.com" 2&gt;/dev/null
openssl x509 -req -in la-ec.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la-ec.crt -days 90 -extfile la.ext 2&gt;/dev/null
cat la-ec.crt tg.crt &gt; fullchain-ec.crt
<span class="tok-comment"># máy MẶC ĐỊNH: chứng chỉ tự ký, tên khác — để thử SNI</span>
openssl req -x509 -newkey rsa:2048 -nodes -keyout md.key -out md.crt -days 30 -subj "/CN=may-mac-dinh" 2&gt;/dev/null
for f in root tg la; do printf '%-5s ' $f.crt; openssl x509 -in $f.crt -noout -subject -issuer | paste -sd' '; done</code></pre>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  server {                                 <span class="tok-comment">  # máy MẶC ĐỊNH của cổng 8443</span>
    listen 8443 ssl default_server;
    ssl_certificate     /root/pki/md.crt;
    ssl_certificate_key /root/pki/md.key;
    return 200 "may mac dinh\\n";
  }
  server {                                 <span class="tok-comment">  # ĐÚNG: lá + trung gian</span>
    listen 8443 ssl;
    server_name vidu.com www.vidu.com;
    ssl_certificate     /root/pki/fullchain.crt;
    ssl_certificate_key /root/pki/la.key;
    ssl_certificate     /root/pki/fullchain-ec.crt; <span class="tok-comment">  # cặp thứ hai: ECDSA</span>
    ssl_certificate_key /root/pki/la-ec.key;
    return 200 "xin chao tu vidu.com\\n";
  }
  server {                                 <span class="tok-comment">  # SAI: chỉ mỗi cái lá</span>
    listen 8444 ssl;
    server_name vidu.com;
    ssl_certificate     /root/pki/la.crt;
    ssl_certificate_key /root/pki/la.key;
    return 200 "xin chao tu vidu.com\\n";
  }
}</code></pre>
<div class="out">$ bash tao-chuoi.sh
root.crt subject=CN = Lab Root CA issuer=CN = Lab Root CA
tg.crt subject=CN = Lab Intermediate CA issuer=CN = Lab Root CA
la.crt subject=CN = vidu.com issuer=CN = Lab Intermediate CA
$ for p in 8443 8444; do echo "== cong $p"; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'; done
== cong 8443
 0 s:CN = vidu.com
 1 s:CN = Lab Intermediate CA
Verify return code: 0 (ok)
== cong 8444
 0 s:CN = vidu.com
Verify return code: 21 (unable to verify the first certificate)
$ curl -s --cacert pki/root.crt https://vidu.com:8443/
xin chao tu vidu.com
$ curl -sS --cacert pki/root.crt https://vidu.com:8444/
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
$ openssl s_client -connect 127.0.0.1:8443 -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'
 0 s:CN = may-mac-dinh
Verify return code: 18 (self-signed certificate)
$ openssl s_client -connect vidu.com:8443 -CAfile pki/root.crt &lt;/dev/null 2&gt;&amp;1 | grep -E '^ [0-9] s:|Verify return code'
 0 s:CN = vidu.com
 1 s:CN = Lab Intermediate CA
Verify return code: 0 (ok)
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -dates -subject
notBefore=Nov 12 15:50:36 2026 GMT
notAfter=Feb 10 15:50:36 2027 GMT
subject=CN = vidu.com
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'
            X509v3 Subject Alternative Name: 
                DNS:vidu.com, DNS:www.vidu.com
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -checkend $((21*86400))
Certificate will not expire
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -checkend $((100*86400))
Certificate will expire
$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-32s' $c; openssl s_client -connect 127.0.0.1:8443 -servername vidu.com -tls1_2 -cipher $c &lt;/dev/null 2&gt;&amp;1 | grep -E 'Server public key' ; done
ECDHE-RSA-AES128-GCM-SHA256     Server public key is 2048 bit
ECDHE-ECDSA-AES128-GCM-SHA256   Server public key is 256 bit
$ nginx -v
nginx version: nginx/1.24.0 (Ubuntu)
$ nginx -t -c h2.conf
2026/11/12 15:50:37 [emerg] 3706#3706: unknown directive "http2" in h2.conf:5
nginx: configuration file h2.conf test failed
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial
serial=5A149BF0E5BC69E3B738D18BC45E5FB746867169
$ cd pki &amp;&amp; openssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2&gt;/dev/null &amp;&amp; cat la.crt tg.crt &gt; fullchain.crt &amp;&amp; openssl x509 -in la.crt -noout -serial | sed 's/^/tren dia: /'
tren dia: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B
$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial | sed 's/^/nginx dang gui: /'
nginx dang gui: serial=5A149BF0E5BC69E3B738D18BC45E5FB746867169
$ nginx -s reload -c chuoi.conf; sleep 0.5; echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2&gt;/dev/null | openssl x509 -noout -serial | sed 's/^/sau reload: /'
sau reload: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B
2026/11/12 15:54:07 [notice] 5790#5790: signal process started</div>
<p>fullchain: hai chứng chỉ, mã 0; chỉ cái lá: một chứng chỉ, mã 21, và curl lỗi 60. Nối bằng IP không tên: chứng chỉ mặc định; nối bằng tên: OpenSSL 3 tự gửi SNI. <code>http2 on;</code> không nạp nổi trên 1.24.0. Tệp mới trên đĩa KHÔNG được gửi đi cho tới khi <code>nginx -s reload</code>.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-6-3-chung-chi" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 6.3 — Chứng chỉ, chuỗi tin cậy và CA</span><span class="lc-sub">Cùng cái chuỗi đó nhìn từ phía mạng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-6-2-x509" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 6.2 — Bên trong một chứng chỉ X.509</span><span class="lc-sub">Từng trường của cái lá nghĩa là gì</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ssl_certificate</code> / <code>ssl_certificate_key</code></span><span class="v">Tệp chứng chỉ nối chuỗi và khoá riêng, đi cùng nhau trong một khối server.</span></div>
  <div class="kv"><span class="k">fullchain.pem vs cert.pem</span><span class="v">Lá cộng trung gian (cái bạn phục vụ) so với chỉ mỗi chứng chỉ lá.</span></div>
  <div class="kv"><span class="k">Intermediate CA</span><span class="v">Do root ký và nó ký chứng chỉ của bạn; không nằm trong kho tin cậy nào, nên client chỉ lấy được từ bạn.</span></div>
  <div class="kv"><span class="k">SAN (Subject Alternative Name)</span><span class="v">Danh sách tên chính xác mà chứng chỉ có hiệu lực; Common Name bị bỏ qua.</span></div>
  <div class="kv"><span class="k">Verify return code 21</span><span class="v">"unable to verify the first certificate" — dấu hiệu đang thiếu trung gian.</span></div>
  <div class="kv"><span class="k">ACME challenge</span><span class="v">Đường /.well-known/acme-challenge mà certbot phải chạm tới được để gia hạn.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bật HTTPS tốn bốn dòng, nhưng trỏ <code>ssl_certificate</code> vào <code>cert.pem</code> thay vì <code>fullchain.pem</code> là bỏ sót trung gian.</li><li>Thiếu trung gian vẫn chạy trên trình duyệt của bạn nhưng hỏng với trình duyệt di động mới, app, <code>curl</code> và client ghim chứng chỉ.</li><li>Chẩn đoán bằng cách đếm số chứng chỉ máy chủ gửi ra: một là thiếu trung gian, hai hoặc ba là chuỗi đầy đủ.</li><li>SAN quyết định chứng chỉ phủ những tên nào; khoá riêng do <code>ssl_certificate_key</code> tham chiếu và không bao giờ rời máy chủ.</li><li>Chạy lại các lệnh <code>openssl</code> và theo dõi ngày hết hạn sau MỖI lần gia hạn, không chỉ lần cài đầu.</li></ul>

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
      description: 'Bài này thử LẦN LƯỢT 89 bộ mã TLS 1.2 vào hai khối server để xem mỗi khối thật sự chấp nhận bao nhiêu. Khối mặc định nhận 27, khối khai tường minh nhận 3 — và trong 21 cái kia có 12 cái KHÔNG có forward secrecy, tức là một phiên bị ghi lại hôm nay có thể giải mã được vào ngày khoá riêng bị lộ.',
      content: `
${G06_2}
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

<h3>Cipher suites: 89 tried, one at a time</h3>
<div class="out">Thu 89 bo ma TLS 1.2 ma OpenSSL biet, tung cai mot (client ha SECLEVEL=0 de dam thu het):
Khoi HIEN DAI (co ssl_ciphers khai ro):
    3 chap nhan / 86 tu choi
      ECDHE-RSA-AES256-GCM-SHA384
      ECDHE-RSA-CHACHA20-POLY1305
      ECDHE-RSA-AES128-GCM-SHA256
Khoi MAC DINH (khong khai ssl_ciphers):
   27 chap nhan / 62 tu choi
Trong 27 cai do, 16 cai KHONG co ECDHE:
   AES256-GCM-SHA384  AES256-CCM8  AES256-CCM  ARIA256-GCM-SHA384
   AES128-GCM-SHA256  AES128-CCM8  AES128-CCM  ARIA128-GCM-SHA256
   AES256-SHA256  CAMELLIA256-SHA256  AES128-SHA256  CAMELLIA128-SHA256
   AES256-SHA  CAMELLIA256-SHA  AES128-SHA  CAMELLIA128-SHA</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No ECDHE means no forward secrecy</span><span class="lz-d">Those twelve use static RSA key exchange: the session key is encrypted with the server's public key. Anyone who records the traffic today and obtains the private key later — a breach, a stolen backup, a seized disk — can decrypt every recorded session retroactively.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With ECDHE, the session key never crosses the wire</span><span class="lz-d">Both sides derive it from ephemeral values that are discarded afterwards. The private key only proves identity; losing it later exposes nothing that was already recorded. This is the whole reason the modern list contains nothing else.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TLS 1.3 removed the choice entirely</span><span class="lz-d">All five of its cipher suites are forward-secret and AEAD, so <code>ssl_ciphers</code> does not apply to TLS 1.3 at all. The list you write only matters for the TLS 1.2 clients you still support — which is why the modern block is short.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A smaller list is a smaller attack surface</span><span class="lz-d">Three accepted instead of twenty-seven. Every suite you keep is one more implementation that has to be correct, and the history of TLS is largely a history of suites that turned out not to be.</span></div>
</div>
<pre><code class="language-bash">ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;      <span class="tok-comment"># let the CLIENT choose — it knows its own hardware</span>
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
            ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
            ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

<span class="tok-comment"># Six entries, an ECDSA/RSA pair per algorithm. An RSA-only certificate gives three</span>
<span class="tok-comment"># ECDSA stays idle — exactly as measured: 3 accepted, not 6.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ssl_prefer_server_ciphers off is the modern advice</span><span class="v">It used to be <code>on</code>, to stop a client picking something weak. Once the server's list contains only strong suites there is nothing weak to pick, and letting the client choose lets a phone without AES hardware pick ChaCha20, which is several times faster for it. Turning it on now mainly forces slow choices onto mobile clients.</span></div>
  <div class="kv"><span class="k">ChaCha20 belongs in the list for exactly that reason</span><span class="v">Devices with AES-NI pick AES-GCM; devices without it pick ChaCha20 and get a large speedup. Both are in the measured list above, and which one a given client uses is its own decision.</span></div>
  <div class="kv"><span class="k">Dropping TLS 1.2 entirely is now defensible</span><span class="v"><code>ssl_protocols TLSv1.3;</code> makes <code>ssl_ciphers</code> irrelevant and removes an entire protocol's worth of complexity. It excludes some older Android and any client without TLS 1.3 — check your own logs for what actually connects before deciding, because for many sites the answer is nothing.</span></div>
  <div class="kv"><span class="k">Do not paste a cipher list from an article without a date</span><span class="v">Lists that were correct in 2016 include suites that are now removed from OpenSSL entirely, and Nginx will simply not start or will silently accept fewer suites than you wrote. Generate one from Mozilla's configurator against your actual versions instead.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — <code>ssl_ciphers</code> silently accepts names your OpenSSL does not have, so a list that looks fine can be doing much less than it says.</strong> Nginx does not error on unknown suite names; they are just not offered. A config that lists ten suites where only three exist in your build behaves exactly like a config listing three — which is fine when it is the three you wanted and dangerous when the ones that vanished were the ECDSA entries and the ones remaining are not what you expected. The check is the same experiment as this lesson: loop over <code>openssl ciphers ALL</code>, connect once per suite, and count what actually completes a handshake. It takes a minute and it is the only way to know what your server accepts rather than what your config says.</p>
</div>

<h3>Reading it from outside</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One suite at a time is the honest test</span><span class="lz-lnote"><code>openssl s_client -connect host:443 -tls1_2 -cipher SUITE</code> for each name. A completed handshake means accepted. This is what produced both counts above, and unlike reading the config it cannot be wrong about what the build actually supports.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ssl_protocol and $ssl_cipher in the log</span><span class="lz-lnote">Add both to your access log format and you learn what your real users negotiate. That number, not a survey, tells you whether dropping TLS 1.2 would break anybody.</span></div>
  <div class="lz-layer"><span class="lz-lname">SSL Labs for the public view</span><span class="lz-lnote">It tests from outside with a large matrix of simulated clients and names the specific old Android and Java versions that would fail. For a public site it is worth running once after any TLS change.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mozilla's configurator for the list itself</span><span class="lz-lnote">Pick "intermediate" unless you have a reason, give it your Nginx and OpenSSL versions, and paste what it generates. It is maintained as suites are deprecated, which a snippet in your notes is not.</span></div>
</div>
<div class="note-ct">
<p><strong>What this lesson is really arguing.</strong> The defaults here were not dangerous — no export ciphers, no RC4, no TLS 1.0. They were just wider than they needed to be, and sixteen of the twenty-seven accepted suites gave up forward secrecy for no benefit. Three explicit lines closed that, and the measurement is what turns "paste this for security" into a change you can see the effect of.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>Two servers on the chain from 6.1 — defaults, and three explicit lines — then every protocol version and every TLS 1.2 cipher OpenSSL knows, one handshake each, on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  server {                                 <span class="tok-comment">  # MẶC ĐỊNH: không khai gì</span>
    listen 8443 ssl;
    return 200 "mac dinh\\n";
  }
  server {                                 <span class="tok-comment">  # HIỆN ĐẠI: khai tường minh</span>
    listen 8444 ssl;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    return 200 "hien dai\\n";
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># bat-tay.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># bat-tay.sh &lt;cổng&gt; [cờ openssl…] — bắt tay một lần, in giao thức + bộ mã, hoặc dòng lỗi</span>
o=$(openssl s_client -connect 127.0.0.1:$1 -servername vidu.com "\${@:2}" &lt;/dev/null 2&gt;&amp;1)
if grep -q '^New, TLS' &lt;&lt;&lt;"$o"; then grep -m1 '^New, ' &lt;&lt;&lt;"$o" | sed 's/^New, //'; else grep -m1 -oE 'no protocols available|alert protocol version|alert handshake failure|wrong version number|no ciphers available' &lt;&lt;&lt;"$o" || echo '(that bai)'; fi</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># quet-bo-ma.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># quet-bo-ma.sh &lt;cổng&gt; — thử TỪNG bộ mã TLS 1.2 mà OpenSSL biết (kể cả loại yếu, SECLEVEL=0), đếm cái được chấp nhận</span>
ok=(); tong=0
for c in $(openssl ciphers -s -tls1_2 'ALL:COMPLEMENTOFALL:@SECLEVEL=0' | tr ':' ' '); do
  tong=$((tong+1))
  openssl s_client -connect 127.0.0.1:$1 -servername vidu.com -tls1_2 -cipher "$c:@SECLEVEL=0" &lt;/dev/null &gt;/dev/null 2&gt;&amp;1 &amp;&amp; ok+=("$c")
done
echo "cong $1: \${#ok[@]} chap nhan / $((tong-\${#ok[@]})) tu choi (thu $tong bo ma TLS 1.2)"
printf '%s\\n' "\${ok[@]}" &gt; /tmp/ng/ok-$1.txt</code></pre>
<div class="out">$ for p in 8443 8444; do printf 'cong %s tu thuong luong : ' $p; bash bat-tay.sh $p; done
cong 8443 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
cong 8444 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
$ for v in tls1 tls1_1 tls1_2 tls1_3; do printf '%-8s 8443: %-46s 8444: %s\\n' -$v "$(bash bat-tay.sh 8443 -$v)" "$(bash bat-tay.sh 8444 -$v)"; done
-tls1    8443: no protocols available                         8444: no protocols available
-tls1_1  8443: no protocols available                         8444: no protocols available
-tls1_2  8443: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384 8444: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384
-tls1_3  8443: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384      8444: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
$ for p in 8443 8444; do printf 'cong %s, client CHIU TLS 1.0 : ' $p; bash bat-tay.sh $p -tls1 -cipher 'DEFAULT:@SECLEVEL=0'; done
cong 8443, client CHIU TLS 1.0 : alert protocol version
cong 8444, client CHIU TLS 1.0 : alert protocol version
$ bash quet-bo-ma.sh 8444; cat /srv/ok-8444.txt
cong 8444: 3 chap nhan / 86 tu choi (thu 89 bo ma TLS 1.2)
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-RSA-CHACHA20-POLY1305
ECDHE-RSA-AES128-GCM-SHA256
$ bash quet-bo-ma.sh 8443; grep -v ECDHE /srv/ok-8443.txt | wc -l; grep -v ECDHE /srv/ok-8443.txt | paste -sd' '
cong 8443: 27 chap nhan / 62 tu choi (thu 89 bo ma TLS 1.2)
16
AES256-GCM-SHA384 AES256-CCM8 AES256-CCM ARIA256-GCM-SHA384 AES128-GCM-SHA256 AES128-CCM8 AES128-CCM ARIA128-GCM-SHA256 AES256-SHA256 CAMELLIA256-SHA256 AES128-SHA256 CAMELLIA128-SHA256 AES256-SHA CAMELLIA256-SHA AES128-SHA CAMELLIA128-SHA</div>
<p>Both negotiated TLS 1.3; TLS 1.0 and 1.1 were refused by the CLIENT until we lowered its security level — then the SERVER answered <code>alert protocol version</code>. Of 89 ciphers the explicit block accepted 3, the default 27, and 16 of those had no ECDHE.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-2-key-schedule" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.2 — Key exchange, forward secrecy and the TLS 1.3 key schedule</span><span class="lc-sub">Why ECDHE is what forward secrecy means</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-4-lich-su-tan-cong" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.4 — Lessons from TLS breaks</span><span class="lc-sub">BEAST, POODLE, Heartbleed — why old ciphers were dropped</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ssl_protocols</code></span><span class="v">Which TLS versions the server offers — the modern pair is <code>TLSv1.2 TLSv1.3</code>.</span></div>
  <div class="kv"><span class="k"><code>ssl_ciphers</code></span><span class="v">The TLS 1.2 cipher list; it does not apply to TLS 1.3 at all.</span></div>
  <div class="kv"><span class="k"><code>ssl_prefer_server_ciphers</code></span><span class="v"><code>off</code> lets the client choose — the modern advice once the list is all-strong.</span></div>
  <div class="kv"><span class="k">ECDHE / forward secrecy</span><span class="v">Ephemeral key exchange: a recorded session stays safe even if the private key leaks later.</span></div>
  <div class="kv"><span class="k">ChaCha20 vs AES-GCM</span><span class="v">A client without AES hardware picks ChaCha20 and gets a large speedup.</span></div>
  <div class="kv"><span class="k">SNI / -servername</span><span class="v">Tells the server which site you mean, so a test hits the right certificate.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>The default block accepted 27 cipher suites; an explicit list accepted 3 — and 16 of the 27 lacked ECDHE.</li><li>No ECDHE means no forward secrecy: a recorded session can be decrypted if the private key later leaks.</li><li>TLS 1.3 removed the cipher choice entirely, so <code>ssl_ciphers</code> only matters for the TLS 1.2 clients you still support.</li><li>Leave <code>ssl_prefer_server_ciphers</code> off and keep ChaCha20 in the list so mobile clients choose the fast option.</li><li>Verify by looping one cipher at a time; nginx silently ignores suite names your OpenSSL build does not have.</li></ul>

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

<h3>Bộ mã: thử 89 cái, từng cái một</h3>
<div class="out">Thu 89 bo ma TLS 1.2 ma OpenSSL biet, tung cai mot (client ha SECLEVEL=0 de dam thu het):
Khoi HIEN DAI (co ssl_ciphers khai ro):
    3 chap nhan / 86 tu choi
      ECDHE-RSA-AES256-GCM-SHA384
      ECDHE-RSA-CHACHA20-POLY1305
      ECDHE-RSA-AES128-GCM-SHA256
Khoi MAC DINH (khong khai ssl_ciphers):
   27 chap nhan / 62 tu choi
Trong 27 cai do, 16 cai KHONG co ECDHE:
   AES256-GCM-SHA384  AES256-CCM8  AES256-CCM  ARIA256-GCM-SHA384
   AES128-GCM-SHA256  AES128-CCM8  AES128-CCM  ARIA128-GCM-SHA256
   AES256-SHA256  CAMELLIA256-SHA256  AES128-SHA256  CAMELLIA128-SHA256
   AES256-SHA  CAMELLIA256-SHA  AES128-SHA  CAMELLIA128-SHA</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có ECDHE nghĩa là KHÔNG có forward secrecy</span><span class="lz-d">Mười hai cái đó dùng trao khoá RSA TĨNH: khoá phiên được mã hoá bằng khoá công khai của máy chủ. Ai ghi lại lưu lượng hôm nay rồi lấy được khoá riêng SAU NÀY — một vụ xâm nhập, một bản sao lưu bị mất, một cái đĩa bị tịch thu — đều giải mã ngược được MỌI phiên đã ghi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có ECDHE thì khoá phiên KHÔNG BAO GIỜ đi qua dây</span><span class="lz-d">Hai bên cùng suy ra nó từ những giá trị phù du rồi vứt đi sau đó. Khoá riêng chỉ để CHỨNG MINH danh tính; mất nó về sau không phơi ra thứ gì đã bị ghi lại. Đó là toàn bộ lý do danh sách hiện đại chẳng chứa gì khác.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TLS 1.3 đã XOÁ hẳn quyền chọn</span><span class="lz-d">Cả năm bộ mã của nó đều forward-secret và đều là AEAD, nên <code>ssl_ciphers</code> KHÔNG áp dụng cho TLS 1.3 chút nào. Cái danh sách bạn viết chỉ có nghĩa lý với đám client TLS 1.2 mà bạn còn hỗ trợ — và đó là lý do khối hiện đại rất NGẮN.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Danh sách nhỏ hơn là bề mặt tấn công nhỏ hơn</span><span class="lz-d">Ba cái được chấp nhận thay vì hai mươi mốt. Mỗi bộ mã bạn giữ lại là thêm một phần cài đặt phải ĐÚNG, và lịch sử của TLS phần lớn là lịch sử của những bộ mã hoá ra là không đúng.</span></div>
</div>
<pre><code class="language-bash">ssl_protocols TLSv1.2 TLSv1.3;
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
<p><strong>Bài này thật sự đang lập luận điều gì.</strong> Đám mặc định ở đây KHÔNG nguy hiểm — không có bộ mã xuất khẩu, không có RC4, không có TLS 1.0. Chúng chỉ RỘNG hơn mức cần thiết, và mười sáu trong hai mươi bảy bộ mã được chấp nhận đã đánh đổi forward secrecy để lấy về... không gì cả. Ba dòng khai tường minh bịt được chuyện đó, và phép đo mới là thứ biến câu "dán cái này vào cho an toàn" thành một thay đổi mà bạn NHÌN THẤY được tác dụng.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Hai máy chủ dùng chuỗi của bài 6.1 — một để mặc định, một khai ba dòng — rồi mọi phiên bản giao thức và mọi bộ mã TLS 1.2 OpenSSL biết, mỗi cái một lần bắt tay, trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  server {                                 <span class="tok-comment">  # MẶC ĐỊNH: không khai gì</span>
    listen 8443 ssl;
    return 200 "mac dinh\\n";
  }
  server {                                 <span class="tok-comment">  # HIỆN ĐẠI: khai tường minh</span>
    listen 8444 ssl;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    return 200 "hien dai\\n";
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># bat-tay.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># bat-tay.sh &lt;cổng&gt; [cờ openssl…] — bắt tay một lần, in giao thức + bộ mã, hoặc dòng lỗi</span>
o=$(openssl s_client -connect 127.0.0.1:$1 -servername vidu.com "\${@:2}" &lt;/dev/null 2&gt;&amp;1)
if grep -q '^New, TLS' &lt;&lt;&lt;"$o"; then grep -m1 '^New, ' &lt;&lt;&lt;"$o" | sed 's/^New, //'; else grep -m1 -oE 'no protocols available|alert protocol version|alert handshake failure|wrong version number|no ciphers available' &lt;&lt;&lt;"$o" || echo '(that bai)'; fi</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># quet-bo-ma.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># quet-bo-ma.sh &lt;cổng&gt; — thử TỪNG bộ mã TLS 1.2 mà OpenSSL biết (kể cả loại yếu, SECLEVEL=0), đếm cái được chấp nhận</span>
ok=(); tong=0
for c in $(openssl ciphers -s -tls1_2 'ALL:COMPLEMENTOFALL:@SECLEVEL=0' | tr ':' ' '); do
  tong=$((tong+1))
  openssl s_client -connect 127.0.0.1:$1 -servername vidu.com -tls1_2 -cipher "$c:@SECLEVEL=0" &lt;/dev/null &gt;/dev/null 2&gt;&amp;1 &amp;&amp; ok+=("$c")
done
echo "cong $1: \${#ok[@]} chap nhan / $((tong-\${#ok[@]})) tu choi (thu $tong bo ma TLS 1.2)"
printf '%s\\n' "\${ok[@]}" &gt; /tmp/ng/ok-$1.txt</code></pre>
<div class="out">$ for p in 8443 8444; do printf 'cong %s tu thuong luong : ' $p; bash bat-tay.sh $p; done
cong 8443 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
cong 8444 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
$ for v in tls1 tls1_1 tls1_2 tls1_3; do printf '%-8s 8443: %-46s 8444: %s\\n' -$v "$(bash bat-tay.sh 8443 -$v)" "$(bash bat-tay.sh 8444 -$v)"; done
-tls1    8443: no protocols available                         8444: no protocols available
-tls1_1  8443: no protocols available                         8444: no protocols available
-tls1_2  8443: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384 8444: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384
-tls1_3  8443: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384      8444: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
$ for p in 8443 8444; do printf 'cong %s, client CHIU TLS 1.0 : ' $p; bash bat-tay.sh $p -tls1 -cipher 'DEFAULT:@SECLEVEL=0'; done
cong 8443, client CHIU TLS 1.0 : alert protocol version
cong 8444, client CHIU TLS 1.0 : alert protocol version
$ bash quet-bo-ma.sh 8444; cat /srv/ok-8444.txt
cong 8444: 3 chap nhan / 86 tu choi (thu 89 bo ma TLS 1.2)
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-RSA-CHACHA20-POLY1305
ECDHE-RSA-AES128-GCM-SHA256
$ bash quet-bo-ma.sh 8443; grep -v ECDHE /srv/ok-8443.txt | wc -l; grep -v ECDHE /srv/ok-8443.txt | paste -sd' '
cong 8443: 27 chap nhan / 62 tu choi (thu 89 bo ma TLS 1.2)
16
AES256-GCM-SHA384 AES256-CCM8 AES256-CCM ARIA256-GCM-SHA384 AES128-GCM-SHA256 AES128-CCM8 AES128-CCM ARIA128-GCM-SHA256 AES256-SHA256 CAMELLIA256-SHA256 AES128-SHA256 CAMELLIA128-SHA256 AES256-SHA CAMELLIA256-SHA AES128-SHA CAMELLIA128-SHA</div>
<p>Cả hai thương lượng ra TLS 1.3; TLS 1.0 và 1.1 bị CLIENT từ chối cho tới khi hạ mức an ninh của nó — lúc đó MÁY CHỦ trả <code>alert protocol version</code>. Trong 89 bộ mã, khối khai tường minh nhận 3, khối mặc định nhận 27, và 16 cái trong đó không có ECDHE.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-2-key-schedule" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.2 — Trao đổi khoá, bí mật chuyển tiếp và lịch trình khoá của TLS 1.3</span><span class="lc-sub">Vì sao ECDHE chính là bí mật chuyển tiếp</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-4-lich-su-tan-cong" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.4 — Bài học từ TLS từng vỡ</span><span class="lc-sub">BEAST, POODLE, Heartbleed — vì sao bộ mã cũ bị bỏ</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ssl_protocols</code></span><span class="v">Các phiên bản TLS máy chủ đề nghị — cặp hiện đại là <code>TLSv1.2 TLSv1.3</code>.</span></div>
  <div class="kv"><span class="k"><code>ssl_ciphers</code></span><span class="v">Danh sách bộ mã của TLS 1.2; hoàn toàn không áp cho TLS 1.3.</span></div>
  <div class="kv"><span class="k"><code>ssl_prefer_server_ciphers</code></span><span class="v"><code>off</code> để client tự chọn — lời khuyên hiện đại khi danh sách đã toàn bộ mã mạnh.</span></div>
  <div class="kv"><span class="k">ECDHE / forward secrecy</span><span class="v">Trao khoá phù du: phiên đã ghi vẫn an toàn kể cả khi khoá riêng lộ về sau.</span></div>
  <div class="kv"><span class="k">ChaCha20 vs AES-GCM</span><span class="v">Client không có phần cứng AES chọn ChaCha20 và nhanh hơn rất nhiều.</span></div>
  <div class="kv"><span class="k">SNI / -servername</span><span class="v">Báo cho máy chủ biết bạn muốn site nào, để phép thử trúng đúng chứng chỉ.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Khối mặc định chấp nhận 27 bộ mã; khối khai tường minh chấp nhận 3 — và 16 trong 27 cái thiếu ECDHE.</li><li>Không ECDHE là không forward secrecy: phiên đã ghi giải mã được nếu khoá riêng lộ về sau.</li><li>TLS 1.3 xoá hẳn quyền chọn bộ mã, nên <code>ssl_ciphers</code> chỉ còn ý nghĩa với đám client TLS 1.2 bạn còn hỗ trợ.</li><li>Để <code>ssl_prefer_server_ciphers</code> off và giữ ChaCha20 trong danh sách để client di động chọn được cái nhanh.</li><li>Xác nhận bằng cách lặp từng bộ mã một; nginx âm thầm bỏ qua tên bộ mã mà bản dựng OpenSSL của bạn không có.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">ssl-config.mozilla.org · Sinh khối cấu hình đúng theo phiên bản của bạn, và luôn được cập nhật</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_ciphers" target="_blank" rel="noopener"><span class="lc-ico">🔡</span><span class="lc-body"><span class="lc-title">nginx — ssl_ciphers và ssl_protocols</span><span class="lc-sub">nginx.org · Cú pháp, giá trị mặc định, và ghi chú rằng bộ mã TLS 1.3 nằm riêng</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">MDN — Transport Layer Security</span><span class="lc-sub">developer.mozilla.org · Forward secrecy là gì và vì sao nó là tính chất quyết định</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Trao khoá, và kẻ tấn công cầm một phiên đã ghi lại thì làm được gì về sau</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Lặp qua mọi tên bộ mã và đếm xem máy chủ của chính bạn thật sự chấp nhận cái nào</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — What the handshake costs, and why connection reuse is the whole game|||6.3 — Cái bắt tay tốn gì, và vì sao tái dùng kết nối mới là tất cả',
      slug: 'nginx-6-3-gia-cua-bat-tay',
      type: 'LESSON',
      description: 'Tách riêng cái bắt tay TLS ra khỏi mọi thứ khác rồi bấm giờ nó. Rồi so 100 request đi qua MỘT kết nối với 100 request mỗi cái một kết nối: 0,23 ms và 7,58 ms mỗi request. Đó là hệ số khoảng 33 lần, và nó giải thích vì sao phần lớn việc chỉnh tinh TLS đi nhầm hướng.',
      content: `
${G06_3}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>What the handshake costs, and why connection reuse is the whole game</h2>
<p class="lead">TLS is described as expensive, and the usual response is to tune the handshake. The measurement says the handshake is not where the money is — the number of handshakes is.</p>

<h3>The handshake, isolated</h3>
<div class="out">curl tach bach tung giai doan (loopback, khong co do tre mang):
  TCP bat tay xong  : 0,000247s
  TLS bat tay xong  : 0,003105s     &lt;- TLS them ~2,9ms
  Byte dau tien ve  : 0,003283s
  Tong              : 0,003313s
20 lan do, chi tinh phan TLS (appconnect - connect):
  TLS 1.3             : trung vi 2,29 ms  (min 2,03)
  TLS 1.2             : trung vi 2,41 ms  (min 2,14)
  TLS 1.2 + RSA 2048  : trung vi 3,00 ms
  TLS 1.2 + ECDSA 256 : trung vi 2,66 ms</div>
<div class="callout warn">
<p><strong>TLS 1.3 measured no faster than TLS 1.2 here, and that is an artefact of the test, not a fact about TLS.</strong> The advantage of 1.3 is that it needs one network round trip instead of two. On loopback a round trip costs microseconds, so the saving is invisible and what remains is pure CPU, which the two versions spend similarly. Over a real connection with 40ms of latency, the same comparison would show 1.3 saving roughly 40ms per handshake. Quote this measurement for what it shows — the CPU cost — and not for the round-trip claim it cannot see.</p>
</div>

<h3>The number that actually matters</h3>
<div class="out">100 request toi cung mot URL:
  qua MOT ket noi (tai dung)      :   23 ms tong  =  0,23 ms/request
  qua 100 ket noi RIENG           :  758 ms tong  =  7,58 ms/request
                                                    ^^^^^^^^^^^^^^^
                                              gap ~33 lan
  (7,58 co ca thoi gian khoi dong tien trinh curl moi lan; phan con lai
   la ~3ms bat tay — tra 100 lan thay vi 1)
Noi lai phien (curl, Connection: close, 3 ket noi):
  co ssl_session_cache   : log $ssl_session_reused = . r r   TLS: 2,3 / 0,5 / 0,4 ms
  khong cache (mac dinh) : log $ssl_session_reused = . . .   TLS: 2,3 / 1,2 / 1,0 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A handshake is per connection, not per request</span><span class="lz-d">Once established, every subsequent request on that connection is free of TLS setup. A page pulling forty assets over one connection pays for one handshake; over forty connections it pays forty times.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">So keepalive is the TLS optimisation</span><span class="lz-d"><code>keepalive_timeout 75s;</code> is the default and it is doing more for your TLS costs than any cipher choice. Lowering it to save file descriptors trades a cheap resource for an expensive one.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">And HTTP/2 makes it structural</span><span class="lz-d">One connection carries every request for that origin, so the browser cannot open six connections and handshake six times. Lesson 6.4 measures what else it changes, but this is the part that shows up in the numbers above.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Session resumption covers returning visitors</span><span class="lz-d">When a client does have to reconnect — a new page load, a reopened laptop — a cached session lets it skip the expensive part. <code>ssl_session_cache shared:SSL:10m;</code> holds roughly 40,000 sessions and is one line.</span></div>
</div>
<pre><code class="language-bash">http {
  <span class="tok-comment"># A session cache shared across workers — ONE line, ~40,000 sessions</span>
  ssl_session_cache   shared:SSL:10m;
  ssl_session_timeout 1d;

  <span class="tok-comment"># Stateless session tickets: off, unless you rotate the keys yourself</span>
  ssl_session_tickets off;

  keepalive_timeout   75s;      <span class="tok-comment"># the default, and it IS doing the heaviest work</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ssl_session_cache defaults to none, which is the wrong default</span><span class="v">Without it every reconnect is a full handshake. One line at <code>http</code> level covers every server block. The <code>shared:</code> form matters: a per-worker cache means a client resuming on a different worker misses.</span></div>
  <div class="kv"><span class="k">Session tickets off is the conservative choice</span><span class="v">Tickets let a client resume without server state, but the ticket key encrypts the session and Nginx does not rotate it automatically — a long-lived key undermines forward secrecy for every resumed session. Either turn them off, or manage <code>ssl_session_ticket_key</code> with real rotation.</span></div>
  <div class="kv"><span class="k">ECDSA certificates halve the handshake cost</span><span class="v">RSA signing at 2048 bits is the expensive part of the server's side. An ECDSA P-256 certificate is several times cheaper to sign with, and you can serve both from one block so old clients still get RSA. This is a bigger lever than any cipher list.</span></div>
  <div class="kv"><span class="k">OCSP stapling removes a round trip from the client</span><span class="v">Without it, some clients contact the CA to check revocation before trusting your certificate — a fetch to a third party inside your page load. <code>ssl_stapling on; ssl_stapling_verify on;</code> plus <code>ssl_trusted_certificate</code> makes your server include the proof itself.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — tuning TLS while leaving the connection pattern alone is optimising the wrong term.</strong> The measurement above is a ~33× gap between reusing a connection and not, and nothing in <code>ssl_ciphers</code> is going to touch it. Before changing a single TLS directive, check three things: is <code>keepalive_timeout</code> at its default rather than something a tuning article lowered, is HTTP/2 actually on (Lesson 6.4 shows how to confirm, and it is not on by default), and does your proxy block reuse upstream connections (Lesson 3.2 — HTTP/1.1 plus an empty <code>Connection</code> header plus <code>keepalive</code> in the upstream block). Those three cost nothing and they are where the handshakes go.</p>
</div>

<h3>Confirming it on your own server</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">curl separates the phases for you</span><span class="lz-lnote"><code>-w '%{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total}'</code>. The gap between the first two is the handshake and nothing else, which is the only honest way to quote a TLS cost.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ssl_session_reused tells you the hit rate</span><span class="lz-lnote">Log it. If it is mostly zero on returning traffic, your session cache is missing, too small, or being defeated by a load balancer sending clients to different servers.</span></div>
  <div class="lz-layer"><span class="lz-lname">Count connections against requests</span><span class="lz-lnote"><code>ss -tn state established '( sport = :443 )' | wc -l</code> next to your request rate. A ratio near one request per connection means keepalive is not working and every request is paying for a handshake.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compare an ECDSA certificate directly</span><span class="lz-lnote">Issue one, add it alongside the RSA one, and re-run the <code>time_appconnect</code> measurement. It is a two-line config change and the difference is visible in the same numbers this lesson used.</span></div>
</div>
<div class="note-ct">
<p><strong>The one-sentence version.</strong> A TLS handshake cost about three milliseconds here; a request on an already-open connection cost about a quarter of a millisecond. Everything that keeps connections open — keepalive, HTTP/2, session resumption, upstream keepalive — is worth more than everything that makes an individual handshake faster, and it is all configuration you already have.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>One server with a shared session cache, one without, both holding RSA and ECDSA, access log with <code>$ssl_session_reused</code> — nginx/1.24.0, loopback (the course's numbers on a shared machine: compare ratios, not absolutes):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  log_format tls '$connection $connection_requests $ssl_protocol $ssl_session_reused';
  ssl_certificate     /root/pki/fullchain.crt;    <span class="tok-comment">  # RSA 2048</span>
  ssl_certificate_key /root/pki/la.key;
  ssl_certificate     /root/pki/fullchain-ec.crt; <span class="tok-comment">  # ECDSA P-256</span>
  ssl_certificate_key /root/pki/la-ec.key;
  ssl_session_tickets off;
  server {                                 <span class="tok-comment">  # CÓ cache phiên dùng chung</span>
    listen 8443 ssl;
    server_name vidu.com;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;
    access_log /srv/logs/8443.log tls;
    return 200 "ok\\n";
  }
  server {                                 <span class="tok-comment">  # KHÔNG cache phiên (mặc định: none)</span>
    listen 8445 ssl;
    server_name vidu.com;
    access_log /srv/logs/8445.log tls;
    return 200 "ok\\n";
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># do-tls.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># do-tls.sh &lt;số lần&gt; &lt;cờ curl…&gt; — trung vị + nhỏ nhất của RIÊNG phần TLS (time_appconnect - time_connect), mili giây</span>
n=$1; shift
for i in $(seq $n); do curl -s -o /dev/null --cacert /root/pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' "$@"; done |
  awk '{printf "%.3f\\n", ($2-$1)*1000}' | sort -n | awk '{a[NR]=$1} END {printf "trung vi %.2f ms (min %.2f)\\n", a[int((NR+1)/2)], a[1]}'</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># tai-dung.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># tai-dung.sh — 100 request: một lệnh curl (MỘT kết nối, tái dùng) vs 100 lệnh curl (100 kết nối riêng)</span>
U=https://vidu.com:8443/; : &gt; /tmp/ng/logs/8443.log
t0=$(date +%s%N); curl -s --cacert /root/pki/root.crt $(for i in $(seq 100); do printf -- '-o /dev/null %s ' $U; done); t1=$(date +%s%N)
k1=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l); : &gt; /tmp/ng/logs/8443.log
t2=$(date +%s%N); for i in $(seq 100); do curl -s -o /dev/null --cacert /root/pki/root.crt $U; done; t3=$(date +%s%N)
k2=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l)
awk -v a=$(( (t1-t0)/1000 )) -v b=$(( (t3-t2)/1000 )) -v k1=$k1 -v k2=$k2 'BEGIN {
  printf "100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n", k1, a/1000, a/100000
  printf "100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n", k2, b/1000, b/100000 }'</code></pre>
<div class="out">$ curl -s -o /dev/null --cacert pki/root.crt -w 'TCP xong %{time_connect}s | TLS xong %{time_appconnect}s | byte dau %{time_starttransfer}s | tong %{time_total}s\\n' https://vidu.com:8443/
TCP xong 0.000247s | TLS xong 0.003105s | byte dau 0.003283s | tong 0.003313s
$ for v in 1.3 1.2; do printf 'TLS %s : ' $v; bash do-tls.sh 20 --tlsv$v --tls-max $v https://vidu.com:8443/; done
TLS 1.3 : trung vi 2.29 ms (min 2.03)
TLS 1.2 : trung vi 2.41 ms (min 2.14)
$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-31s: ' $c; bash do-tls.sh 20 --tlsv1.2 --tls-max 1.2 --ciphers $c https://vidu.com:8443/; done
ECDHE-RSA-AES128-GCM-SHA256    : trung vi 3.00 ms (min 2.73)
ECDHE-ECDSA-AES128-GCM-SHA256  : trung vi 2.66 ms (min 2.15)
$ bash tai-dung.sh
100 request qua   1 ket noi :     23 ms tong =  0.23 ms/request
100 request qua 100 ket noi :    758 ms tong =  7.58 ms/request
$ for p in 8443 8445; do printf 'cong %s, 6 lan noi (1 + 5 lan noi lai), Reused: ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -tls1_2 -reconnect &lt;/dev/null 2&gt;/dev/null | grep -c '^Reused'; done
cong 8443, 6 lan noi (1 + 5 lan noi lai), Reused: 5
cong 8445, 6 lan noi (1 + 5 lan noi lai), Reused: 0
$ for v in 1.2 1.3; do for p in 8443 8445; do : &gt; /srv/logs/$p.log; curl -s -H 'Connection: close' --tlsv$v --tls-max $v --cacert pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ | awk '{printf "%.1fms ", ($2-$1)*1000}' &gt; /srv/ms; sleep 0.2; printf 'TLS %s cong %s  log: %-38s TLS: %s\\n' $v $p "$(cut -d' ' -f1,4 /srv/logs/$p.log | paste -sd'|')" "$(cat /srv/ms)"; done; done
TLS 1.2 cong 8443  log: 195 .|196 r|197 r                      TLS: 2.3ms 0.5ms 0.4ms 
TLS 1.2 cong 8445  log: 198 .|199 .|200 .                      TLS: 2.3ms 1.2ms 1.0ms 
TLS 1.3 cong 8443  log: 201 .|202 r|203 r                      TLS: 2.3ms 0.8ms 1.2ms 
TLS 1.3 cong 8445  log: 204 .|205 .|206 .                      TLS: 2.1ms 1.3ms 1.2ms </div>
<p>The handshake was ~3 ms; versions and key types differed by tenths of a millisecond; one connection cost 0.23 ms per request against 7.58 ms for one connection each; with the session cache the log read <code>. r r</code> and the resumed handshakes took 0.4–0.5 ms.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-6-2-bat-tay-tls" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 6.2 — The TLS 1.3 handshake, step by step</span><span class="lc-sub">What the 3 ms is spent on</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/performance-load-testing/learn?lessonSlug=perf-10-4-mang-nginx" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Performance &amp; Load Testing · 10.4 — Network and proxy: keep-alive, compression, HTTP/2, timeouts</span><span class="lc-sub">Connection reuse under load</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>keepalive_timeout</code></span><span class="v">Keeps a connection open so later requests skip the handshake; the default is doing the heavy work.</span></div>
  <div class="kv"><span class="k"><code>ssl_session_cache shared:SSL:10m</code></span><span class="v">A cross-worker session cache (~40,000 sessions); the default of none is the wrong default.</span></div>
  <div class="kv"><span class="k"><code>ssl_session_tickets</code></span><span class="v">Stateless resumption; leave off unless you rotate the ticket key yourself.</span></div>
  <div class="kv"><span class="k">ECDSA certificate</span><span class="v">Several times cheaper to sign than RSA; serve both from one block so old clients still get RSA.</span></div>
  <div class="kv"><span class="k">OCSP stapling</span><span class="v">The server includes the revocation proof itself, removing a client round trip to the CA.</span></div>
  <div class="kv"><span class="k"><code>$ssl_session_reused</code></span><span class="v">A log field showing the session resumption hit rate.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A handshake cost about 3ms here; a request on an already-open connection cost about 0.23ms — a gap of roughly 33 times.</li><li>The number of handshakes dominates, so keepalive, HTTP/2 and session resumption matter more than any cipher choice.</li><li><code>ssl_session_cache</code> defaults to none; one shared line at the <code>http</code> level covers every server block.</li><li>ECDSA certificates roughly halve the server-side handshake cost; keep an RSA one alongside for old clients.</li><li>OCSP stapling and upstream keepalive remove round trips you would otherwise pay on every request.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">nginx — ssl_session_cache and ssl_session_tickets</span><span class="lc-sub">nginx.org · The shared form, sizing, and the ticket key caveat</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_stapling" target="_blank" rel="noopener"><span class="lc-ico">📌</span><span class="lc-body"><span class="lc-title">nginx — OCSP stapling</span><span class="lc-sub">nginx.org · The three directives, and why verify needs a trusted certificate file</span></span></a>
<a class="link-card" href="https://hpbn.co/transport-layer-security-tls/" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">High Performance Browser Networking — TLS</span><span class="lc-sub">hpbn.co · Round trips, resumption, and where the latency actually is</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Connection reuse, and what a browser does with six parallel connections</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Time 100 requests over one connection and over a hundred, and find your own ratio</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Cái bắt tay tốn gì, và vì sao tái dùng kết nối mới là tất cả</h2>
<p class="lead">TLS bị mô tả là ĐẮT, và phản ứng thường thấy là đi chỉnh tinh cái bắt tay. Phép đo nói rằng cái bắt tay KHÔNG phải chỗ tiền nằm — SỐ LƯỢNG bắt tay mới là chỗ đó.</p>

<h3>Cái bắt tay, tách riêng ra</h3>
<div class="out">curl tach bach tung giai doan (loopback, khong co do tre mang):
  TCP bat tay xong  : 0,000247s
  TLS bat tay xong  : 0,003105s     &lt;- TLS them ~2,9ms
  Byte dau tien ve  : 0,003283s
  Tong              : 0,003313s
20 lan do, chi tinh phan TLS (appconnect - connect):
  TLS 1.3             : trung vi 2,29 ms  (min 2,03)
  TLS 1.2             : trung vi 2,41 ms  (min 2,14)
  TLS 1.2 + RSA 2048  : trung vi 3,00 ms
  TLS 1.2 + ECDSA 256 : trung vi 2,66 ms</div>
<div class="callout warn">
<p><strong>TLS 1.3 đo ra KHÔNG nhanh hơn TLS 1.2 ở đây, và đó là hệ quả của PHÉP THỬ chứ không phải một sự thật về TLS.</strong> Lợi thế của 1.3 là nó cần MỘT vòng đi về qua mạng thay vì hai. Trên loopback thì một vòng đi về tốn vài micro giây, nên khoản tiết kiệm ấy vô hình, và cái còn lại chỉ là CPU thuần — thứ mà hai phiên bản tiêu ngang nhau. Trên một kết nối thật có 40ms độ trễ thì đúng phép so sánh này sẽ cho thấy 1.3 tiết kiệm khoảng 40ms mỗi lần bắt tay. Hãy trích phép đo này cho ĐÚNG thứ nó cho thấy — cái giá CPU — chứ đừng trích nó cho cái lời khẳng định về vòng đi về mà nó không nhìn thấy nổi.</p>
</div>

<h3>Con số THỰC SỰ có nghĩa lý</h3>
<div class="out">100 request toi cung mot URL:
  qua MOT ket noi (tai dung)      :   23 ms tong  =  0,23 ms/request
  qua 100 ket noi RIENG           :  758 ms tong  =  7,58 ms/request
                                                    ^^^^^^^^^^^^^^^
                                              gap ~33 lan
  (7,58 co ca thoi gian khoi dong tien trinh curl moi lan; phan con lai
   la ~3ms bat tay — tra 100 lan thay vi 1)
Noi lai phien (curl, Connection: close, 3 ket noi):
  co ssl_session_cache   : log $ssl_session_reused = . r r   TLS: 2,3 / 0,5 / 0,4 ms
  khong cache (mac dinh) : log $ssl_session_reused = . . .   TLS: 2,3 / 1,2 / 1,0 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bắt tay là chuyện của KẾT NỐI, không phải của request</span><span class="lz-d">Một khi đã dựng xong thì mọi request tiếp theo trên kết nối đó KHÔNG phải trả gì cho việc thiết lập TLS. Một trang kéo về bốn mươi tài nguyên qua MỘT kết nối trả tiền cho MỘT lần bắt tay; qua bốn mươi kết nối thì trả bốn mươi lần.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nên keepalive MỚI là phép tối ưu TLS</span><span class="lz-d"><code>keepalive_timeout 75s;</code> là mặc định và nó đang làm cho chi phí TLS của bạn nhiều hơn mọi lựa chọn bộ mã. Hạ nó xuống để tiết kiệm file descriptor là đem một tài nguyên RẺ đổi lấy một tài nguyên ĐẮT.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Và HTTP/2 làm điều đó thành CẤU TRÚC</span><span class="lz-d">Một kết nối mang mọi request tới cùng một gốc, nên trình duyệt KHÔNG thể mở sáu kết nối rồi bắt tay sáu lần. Bài 6.4 đo xem nó còn đổi gì nữa, nhưng đây là phần hiện ra trong những con số ở trên.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nối lại phiên lo cho khách quay lại</span><span class="lz-d">Khi một client BUỘC phải nối lại — một lượt tải trang mới, một cái laptop vừa mở nắp — thì một phiên đã cache cho phép nó bỏ qua phần đắt đỏ. <code>ssl_session_cache shared:SSL:10m;</code> giữ chừng 40.000 phiên và nó chỉ là MỘT dòng.</span></div>
</div>
<pre><code class="language-bash">http {
  <span class="tok-comment"># Vé phiên dùng chung giữa các worker — MỘT dòng, ~40.000 phiên</span>
  ssl_session_cache   shared:SSL:10m;
  ssl_session_timeout 1d;

  <span class="tok-comment"># Vé phiên KHÔNG trạng thái: tắt, trừ khi bạn tự xoay khoá</span>
  ssl_session_tickets off;

  keepalive_timeout   75s;      <span class="tok-comment"># mặc định, và nó ĐANG làm việc nặng nhất</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ssl_session_cache mặc định là none, và đó là mặc định SAI</span><span class="v">Thiếu nó thì MỌI lần nối lại là một cú bắt tay đầy đủ. Một dòng ở tầng <code>http</code> phủ cho mọi khối server. Chữ <code>shared:</code> rất quan trọng: một cache riêng cho từng worker nghĩa là một client nối lại trúng worker khác sẽ TRƯỢT.</span></div>
  <div class="kv"><span class="k">Tắt vé phiên là lựa chọn THẬN TRỌNG</span><span class="v">Vé cho phép client nối lại mà máy chủ không phải giữ trạng thái, nhưng cái khoá vé mã hoá phiên và Nginx KHÔNG tự xoay nó — một cái khoá sống lâu làm hỏng forward secrecy cho mọi phiên được nối lại. Hoặc tắt hẳn, hoặc quản <code>ssl_session_ticket_key</code> kèm một quy trình xoay khoá thật.</span></div>
  <div class="kv"><span class="k">Chứng chỉ ECDSA cắt đôi chi phí bắt tay</span><span class="v">Ký RSA ở 2048 bit là phần đắt đỏ ở phía máy chủ. Một chứng chỉ ECDSA P-256 ký rẻ hơn vài lần, và bạn phục vụ được CẢ HAI từ một khối để client cũ vẫn nhận RSA. Đây là cái cần gạt LỚN hơn mọi danh sách bộ mã.</span></div>
  <div class="kv"><span class="k">OCSP stapling gỡ một vòng đi về khỏi phía client</span><span class="v">Thiếu nó thì vài client đi liên hệ CA để kiểm việc thu hồi trước khi tin chứng chỉ của bạn — một lượt gọi tới bên thứ ba nằm NGAY TRONG lượt tải trang của bạn. <code>ssl_stapling on; ssl_stapling_verify on;</code> cộng <code>ssl_trusted_certificate</code> làm máy chủ của bạn tự kèm luôn cái bằng chứng ấy.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — chỉnh tinh TLS mà để nguyên cái KIỂU KẾT NỐI là đang tối ưu nhầm số hạng.</strong> Phép đo ở trên là khoảng cách chừng 33 LẦN giữa việc tái dùng kết nối và không, và chẳng có gì trong <code>ssl_ciphers</code> chạm được vào nó. Trước khi đổi một chỉ thị TLS nào, hãy kiểm ba thứ: <code>keepalive_timeout</code> có đang ở mặc định không hay đã bị một bài chỉnh tinh nào đó hạ xuống, HTTP/2 có THẬT SỰ bật không (Bài 6.4 chỉ cách xác nhận, và nó KHÔNG bật sẵn), và khối proxy của bạn có tái dùng kết nối lên upstream không (Bài 3.2 — HTTP/1.1 cộng một header <code>Connection</code> rỗng cộng <code>keepalive</code> trong khối upstream). Ba thứ đó chẳng tốn gì và chúng mới là chỗ đám bắt tay đi vào.</p>
</div>

<h3>Tự xác nhận trên máy chủ của bạn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">curl tách giai đoạn giùm bạn</span><span class="lz-lnote"><code>-w '%{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total}'</code>. Khoảng cách giữa hai cái đầu là CÁI BẮT TAY và không gì khác, và đó là cách thật thà duy nhất để trích một con số về chi phí TLS.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ssl_session_reused nói cho bạn tỷ lệ trúng</span><span class="lz-lnote">Hãy ghi nó vào log. Nếu nó gần như luôn bằng không trên lưu lượng khách quay lại thì cache phiên của bạn hoặc đang thiếu, hoặc quá nhỏ, hoặc đang bị một bộ cân bằng tải đẩy client sang những máy chủ khác nhau làm hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đếm số KẾT NỐI đặt cạnh số REQUEST</span><span class="lz-lnote"><code>ss -tn state established '( sport = :443 )' | wc -l</code> đặt cạnh tốc độ request. Tỷ lệ xấp xỉ một request cho mỗi kết nối nghĩa là keepalive KHÔNG chạy và mọi request đang trả tiền cho một cái bắt tay.</span></div>
  <div class="lz-layer"><span class="lz-lname">So sánh THẲNG với một chứng chỉ ECDSA</span><span class="lz-lnote">Cấp một cái, thêm nó vào cạnh cái RSA, rồi chạy lại đúng phép đo <code>time_appconnect</code>. Đó là một thay đổi cấu hình hai dòng và khác biệt hiện ra ngay trong chính những con số bài này dùng.</span></div>
</div>
<div class="note-ct">
<p><strong>Bản gói trong một câu.</strong> Một cái bắt tay TLS ở đây tốn chừng ba mili giây; một request trên một kết nối ĐANG MỞ tốn chừng một phần tư mili giây. Mọi thứ giữ cho kết nối mở — keepalive, HTTP/2, nối lại phiên, keepalive lên upstream — đều đáng giá hơn mọi thứ làm cho MỘT cái bắt tay nhanh hơn, và tất cả đều là cấu hình bạn vốn đã có sẵn.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Một máy chủ có cache phiên dùng chung, một máy không có, cả hai giữ RSA và ECDSA, access log có <code>$ssl_session_reused</code> — nginx/1.24.0, loopback (số đo của khoá trên máy dùng chung: so tỉ lệ, đừng so con số tuyệt đối):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  log_format tls '$connection $connection_requests $ssl_protocol $ssl_session_reused';
  ssl_certificate     /root/pki/fullchain.crt;    <span class="tok-comment">  # RSA 2048</span>
  ssl_certificate_key /root/pki/la.key;
  ssl_certificate     /root/pki/fullchain-ec.crt; <span class="tok-comment">  # ECDSA P-256</span>
  ssl_certificate_key /root/pki/la-ec.key;
  ssl_session_tickets off;
  server {                                 <span class="tok-comment">  # CÓ cache phiên dùng chung</span>
    listen 8443 ssl;
    server_name vidu.com;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;
    access_log /srv/logs/8443.log tls;
    return 200 "ok\\n";
  }
  server {                                 <span class="tok-comment">  # KHÔNG cache phiên (mặc định: none)</span>
    listen 8445 ssl;
    server_name vidu.com;
    access_log /srv/logs/8445.log tls;
    return 200 "ok\\n";
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># do-tls.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># do-tls.sh &lt;số lần&gt; &lt;cờ curl…&gt; — trung vị + nhỏ nhất của RIÊNG phần TLS (time_appconnect - time_connect), mili giây</span>
n=$1; shift
for i in $(seq $n); do curl -s -o /dev/null --cacert /root/pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' "$@"; done |
  awk '{printf "%.3f\\n", ($2-$1)*1000}' | sort -n | awk '{a[NR]=$1} END {printf "trung vi %.2f ms (min %.2f)\\n", a[int((NR+1)/2)], a[1]}'</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># tai-dung.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># tai-dung.sh — 100 request: một lệnh curl (MỘT kết nối, tái dùng) vs 100 lệnh curl (100 kết nối riêng)</span>
U=https://vidu.com:8443/; : &gt; /tmp/ng/logs/8443.log
t0=$(date +%s%N); curl -s --cacert /root/pki/root.crt $(for i in $(seq 100); do printf -- '-o /dev/null %s ' $U; done); t1=$(date +%s%N)
k1=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l); : &gt; /tmp/ng/logs/8443.log
t2=$(date +%s%N); for i in $(seq 100); do curl -s -o /dev/null --cacert /root/pki/root.crt $U; done; t3=$(date +%s%N)
k2=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l)
awk -v a=$(( (t1-t0)/1000 )) -v b=$(( (t3-t2)/1000 )) -v k1=$k1 -v k2=$k2 'BEGIN {
  printf "100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n", k1, a/1000, a/100000
  printf "100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n", k2, b/1000, b/100000 }'</code></pre>
<div class="out">$ curl -s -o /dev/null --cacert pki/root.crt -w 'TCP xong %{time_connect}s | TLS xong %{time_appconnect}s | byte dau %{time_starttransfer}s | tong %{time_total}s\\n' https://vidu.com:8443/
TCP xong 0.000247s | TLS xong 0.003105s | byte dau 0.003283s | tong 0.003313s
$ for v in 1.3 1.2; do printf 'TLS %s : ' $v; bash do-tls.sh 20 --tlsv$v --tls-max $v https://vidu.com:8443/; done
TLS 1.3 : trung vi 2.29 ms (min 2.03)
TLS 1.2 : trung vi 2.41 ms (min 2.14)
$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-31s: ' $c; bash do-tls.sh 20 --tlsv1.2 --tls-max 1.2 --ciphers $c https://vidu.com:8443/; done
ECDHE-RSA-AES128-GCM-SHA256    : trung vi 3.00 ms (min 2.73)
ECDHE-ECDSA-AES128-GCM-SHA256  : trung vi 2.66 ms (min 2.15)
$ bash tai-dung.sh
100 request qua   1 ket noi :     23 ms tong =  0.23 ms/request
100 request qua 100 ket noi :    758 ms tong =  7.58 ms/request
$ for p in 8443 8445; do printf 'cong %s, 6 lan noi (1 + 5 lan noi lai), Reused: ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -tls1_2 -reconnect &lt;/dev/null 2&gt;/dev/null | grep -c '^Reused'; done
cong 8443, 6 lan noi (1 + 5 lan noi lai), Reused: 5
cong 8445, 6 lan noi (1 + 5 lan noi lai), Reused: 0
$ for v in 1.2 1.3; do for p in 8443 8445; do : &gt; /srv/logs/$p.log; curl -s -H 'Connection: close' --tlsv$v --tls-max $v --cacert pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ | awk '{printf "%.1fms ", ($2-$1)*1000}' &gt; /srv/ms; sleep 0.2; printf 'TLS %s cong %s  log: %-38s TLS: %s\\n' $v $p "$(cut -d' ' -f1,4 /srv/logs/$p.log | paste -sd'|')" "$(cat /srv/ms)"; done; done
TLS 1.2 cong 8443  log: 195 .|196 r|197 r                      TLS: 2.3ms 0.5ms 0.4ms 
TLS 1.2 cong 8445  log: 198 .|199 .|200 .                      TLS: 2.3ms 1.2ms 1.0ms 
TLS 1.3 cong 8443  log: 201 .|202 r|203 r                      TLS: 2.3ms 0.8ms 1.2ms 
TLS 1.3 cong 8445  log: 204 .|205 .|206 .                      TLS: 2.1ms 1.3ms 1.2ms </div>
<p>Cú bắt tay ~3 ms; phiên bản và loại khoá chỉ chênh vài phần mười mili giây; một kết nối tốn 0,23 ms mỗi request so với 7,58 ms khi mỗi request một kết nối; có cache phiên thì log ghi <code>. r r</code> và cú bắt tay nối lại chỉ 0,4–0,5 ms.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-6-2-bat-tay-tls" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 6.2 — Bắt tay TLS 1.3, từng bước</span><span class="lc-sub">3 ms đó được tiêu vào đâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/performance-load-testing/learn?lessonSlug=perf-10-4-mang-nginx" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Performance &amp; Load Testing · 10.4 — Mạng và proxy: keep-alive, nén, HTTP/2, timeout</span><span class="lc-sub">Tái dùng kết nối khi chịu tải</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>keepalive_timeout</code></span><span class="v">Giữ kết nối mở để request sau bỏ qua bắt tay; mặc định đang làm việc nặng nhất.</span></div>
  <div class="kv"><span class="k"><code>ssl_session_cache shared:SSL:10m</code></span><span class="v">Cache phiên dùng chung giữa các worker (~40.000 phiên); mặc định none là mặc định sai.</span></div>
  <div class="kv"><span class="k"><code>ssl_session_tickets</code></span><span class="v">Nối lại phiên không trạng thái; để off trừ khi bạn tự xoay khoá vé.</span></div>
  <div class="kv"><span class="k">Chứng chỉ ECDSA</span><span class="v">Ký rẻ hơn RSA vài lần; phục vụ cả hai từ một khối để client cũ vẫn nhận RSA.</span></div>
  <div class="kv"><span class="k">OCSP stapling</span><span class="v">Máy chủ tự kèm bằng chứng thu hồi, gỡ một vòng đi về của client tới CA.</span></div>
  <div class="kv"><span class="k"><code>$ssl_session_reused</code></span><span class="v">Một trường log cho biết tỷ lệ trúng khi nối lại phiên.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một cái bắt tay ở đây tốn chừng 3ms; một request trên kết nối đang mở tốn chừng 0,23ms — khoảng cách cỡ 33 lần.</li><li>Số lượng bắt tay mới là chỗ quyết định, nên keepalive, HTTP/2 và nối lại phiên đáng hơn mọi lựa chọn bộ mã.</li><li><code>ssl_session_cache</code> mặc định là none; một dòng shared ở tầng <code>http</code> phủ cho mọi khối server.</li><li>Chứng chỉ ECDSA cắt khoảng một nửa chi phí bắt tay ở phía máy chủ; giữ thêm một cái RSA cho client cũ.</li><li>OCSP stapling và keepalive lên upstream gỡ những vòng đi về mà nếu không bạn phải trả ở mỗi request.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">nginx — ssl_session_cache và ssl_session_tickets</span><span class="lc-sub">nginx.org · Dạng shared, cách định cỡ, và cảnh báo về khoá vé</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_stapling" target="_blank" rel="noopener"><span class="lc-ico">📌</span><span class="lc-body"><span class="lc-title">nginx — OCSP stapling</span><span class="lc-sub">nginx.org · Ba chỉ thị, và vì sao verify cần một tệp chứng chỉ tin cậy</span></span></a>
<a class="link-card" href="https://hpbn.co/transport-layer-security-tls/" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">High Performance Browser Networking — TLS</span><span class="lc-sub">hpbn.co · Vòng đi về, nối lại phiên, và độ trễ THẬT SỰ nằm ở đâu</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Tái dùng kết nối, và trình duyệt làm gì với sáu kết nối song song</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Bấm giờ 100 request qua một kết nối và qua một trăm, rồi tìm ra hệ số của chính bạn</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — HTTP/2: what it changes, and what a local benchmark cannot show|||6.4 — HTTP/2: nó đổi cái gì, và phép đo trên máy KHÔNG cho bạn thấy cái gì',
      slug: 'nginx-6-4-http2',
      type: 'LESSON',
      description: 'Bật HTTP/2 tốn một chữ, và xác nhận nó chạy tốn một lệnh. Bài này làm cả hai — rồi thử ĐO xem nó nhanh hơn bao nhiêu, thu về 28ms so với 27ms, và giải thích vì sao con số đó đúng, vì sao nó vô nghĩa, và phải đo ở đâu mới thấy được.',
      content: `
${G06_4}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>HTTP/2: what it changes, and what a local benchmark cannot show</h2>
<p class="lead">HTTP/2 is one word of configuration and it is genuinely worth enabling. It is also the place where benchmarks lie most convincingly, so this lesson does the measurement anyway and then explains what the numbers do and do not mean.</p>

<h3>Turning it on and confirming it</h3>
<div class="out">$ curl -o /dev/null -w 'HTTP/%{http_version}\\n' https://...

  cong 8444 (co bat http2)      -> HTTP/2
  cong 8443 (KHONG bat)         -> HTTP/1.1

$ openssl s_client -alpn h2,http/1.1 -connect ...
  cong 8444 -> ALPN protocol: h2
  cong 8443 -> ALPN protocol: http/1.1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It is not on by default</span><span class="lz-d">Adding <code>ssl</code> to a <code>listen</code> line gives you HTTPS over HTTP/1.1 and nothing more. Port 8443 above is a complete, working TLS server that negotiates <code>http/1.1</code> because nobody asked for anything else.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The syntax depends on your version</span><span class="lz-d"><code>listen 443 ssl http2;</code> up to 1.25.0, <code>http2 on;</code> as its own directive from 1.25.1. Getting it wrong on an old build is an <code>unknown directive</code> and a config that will not load; getting it wrong on a new build is a deprecation warning and it still works.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ALPN is how the client and server agree</span><span class="lz-d">The protocol is chosen during the TLS handshake, not after. That is why HTTP/2 in practice requires TLS — and why <code>openssl s_client -alpn</code> is the definitive test rather than reading the config.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Confirm it from outside, once</span><span class="lz-d">One <code>curl -w '%{http_version}'</code> against your real hostname. It is easy to add the directive to the wrong <code>server</code> block, and the site keeps working perfectly on HTTP/1.1 while you believe otherwise.</span></div>
</div>

<h3>Then trying to measure the benefit</h3>
<div class="out">50 tep nho, mot lenh curl, cung mot may (loopback, do tre ~0):
  tuan tu   :  HTTP/2  18 ms   HTTP/1.1  21 ms
  song song :  HTTP/2  20 ms   HTTP/1.1  63 ms   &lt;- 1.1 mo NHIEU ket noi = nhieu lan bat tay
HPACK do TREN DAY (nghttp -nv, kich thuoc khoi HEADERS gui di), cung cookie 1.474 byte, 4 request:
  HTTP/2   : 1.240 -&gt; 20 -&gt; 20 -&gt; 20 byte
  HTTP/1.1 : 1.567 byte MOI request (curl %{size_request})</div>
<div class="callout warn">
<p><strong>What one machine can and cannot show.</strong> Fetched one after another, HTTP/2 and HTTP/1.1 took 18 and 21 ms: on loopback there is no latency, so there is no head-of-line blocking to remove and multiplexing has nothing to hide — HTTP/2's main advantage is about round trips, and a test with zero round-trip time cannot show it. Fetched in parallel, HTTP/1.1 opened many connections and paid a TLS handshake for each (63 ms against 20) — that part IS visible. And header compression must be measured ON THE WIRE: <code>curl</code>'s <code>%{size_request}</code> reports the headers it composed, before HPACK, so it can never show a saving. <code>nghttp -nv</code> prints the real HEADERS frame sizes: 1,240 bytes the first time, then 20 bytes for the same 1.5 KB cookie.</p>
</div>

<h3>What HTTP/2 actually changes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One connection instead of six</span><span class="lz-lnote">A browser opens up to six parallel connections per origin on HTTP/1.1, each with its own TLS handshake. HTTP/2 uses one. By Lesson 6.3's numbers that is five handshakes saved on every page load, and it is the part that shows up even on a fast network.</span></div>
  <div class="lz-layer"><span class="lz-lname">No head-of-line blocking at the HTTP layer</span><span class="lz-lnote">On HTTP/1.1 a slow response blocks everything behind it on that connection. HTTP/2 interleaves frames, so a slow API call does not delay the thirty images queued after it. This is the multiplexing benefit, and it scales with latency — which is exactly why loopback showed nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">HPACK compresses headers, including repeated cookies</span><span class="lz-lnote">A 1.5KB cookie sent on forty requests is 60KB of upload on HTTP/1.1 and a fraction of that on HTTP/2, because the second and subsequent copies are references to a shared table. On a mobile uplink that is a real saving; measuring it needs a packet capture, not curl.</span></div>
  <div class="lz-layer"><span class="lz-lname">Server push is gone, and that is fine</span><span class="lz-lnote">Removed from Chrome in 2022 and deprecated everywhere. If you find <code>http2_push</code> in an article, the article is old. <code>&lt;link rel="preload"&gt;</code> and early hints do the same job without the protocol complexity.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Concatenating and spriting became counterproductive</span><span class="v">Those techniques existed to work around the six-connection limit. With one multiplexed connection, forty small files cost little more than one large one — and they cache far better, because changing one does not invalidate the bundle.</span></div>
  <div class="kv"><span class="k">Domain sharding is now actively harmful</span><span class="v">Splitting assets across <code>img1.vidu.com</code> and <code>img2.vidu.com</code> forced more parallel connections on HTTP/1.1. On HTTP/2 it forces more TLS handshakes and more DNS lookups for no benefit at all. If a site still does it, removing it is a free win.</span></div>
  <div class="kv"><span class="k">http2_max_concurrent_streams bounds a client</span><span class="v">Default 128. One connection carrying hundreds of simultaneous streams is a way for a single client to consume a lot of worker attention, and this is the limit on that. Chapter 7 covers the rest of the per-client limits.</span></div>
  <div class="kv"><span class="k">HTTP/3 is the same idea over QUIC</span><span class="v">It moves multiplexing below TLS so packet loss on one stream does not stall the others — the transport-layer head-of-line blocking HTTP/2 still has. Nginx supports it from 1.25.0 with <code>listen 443 quic;</code>, and it is worth adding once HTTP/2 is confirmed working.</span></div>
</div>
<div class="note-ct">
<p><strong>Where to measure it properly.</strong> Not on the machine running the server. Open your site over a real connection with the browser's network panel, filter by protocol, and compare a throttled profile with HTTP/2 on and off — that reproduces latency, packet loss and the browser's real connection behaviour, none of which loopback has. Or accept the structural argument: one connection instead of six, and Lesson 6.3 already measured what a handshake costs. Both are honest; a local benchmark that reports 18 against 21 for sequential fetches is not evidence either way, and the useful thing to learn from it is how easy it is to produce a number that means nothing.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>Fifty small files, one port with <code>http2</code> and one without (nginx/1.24.0 syntax), fetched sequentially and in parallel, then HPACK measured on the wire with <code>nghttp</code> (Ubuntu package <code>nghttp2-client</code>):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  root /srv/site;
  server { listen 8443 ssl;       server_name vidu.com; } <span class="tok-comment">  # KHÔNG bật http2</span>
  server { listen 8444 ssl http2; server_name vidu.com; } <span class="tok-comment">  # nginx 1.24: http2 là THAM SỐ của listen</span>
}</code></pre>
<div class="out">$ for p in 8444 8443; do printf 'cong %s -&gt; ' $p; curl -s -o /dev/null --cacert pki/root.crt -w 'HTTP/%{http_version}\\n' https://vidu.com:$p/t01.css; done
cong 8444 -&gt; HTTP/2
cong 8443 -&gt; HTTP/1.1
$ for p in 8444 8443; do printf 'cong %s -&gt; ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -alpn h2,http/1.1 &lt;/dev/null 2&gt;&amp;1 | grep -E '^ALPN|No ALPN'; done
cong 8444 -&gt; ALPN protocol: h2
cong 8443 -&gt; ALPN protocol: http/1.1
$ U=$(for i in $(seq -w 1 50); do printf -- '-o /dev/null https://vidu.com:8444/t%s.css ' $i; done); for m in '' --parallel; do for v in --http2 --http1.1; do printf '%-9s %-10s 50 tep: ' $v "\${m:-tuan-tu}"; s=$(date +%s%N); curl -s $m $v --cacert pki/root.crt $U; echo "$(( ($(date +%s%N)-s)/1000000 )) ms"; done; done
--http2   tuan-tu    50 tep: 18 ms
--http1.1 tuan-tu    50 tep: 21 ms
--http2   --parallel 50 tep: 20 ms
--http1.1 --parallel 50 tep: 63 ms
$ C="phien=$(head -c 1100 /dev/urandom | base64 -w0)"; echo "cookie dai \${#C} byte"; nghttp -nv -H "cookie: $C" https://vidu.com:8444/t01.css https://vidu.com:8444/t02.css https://vidu.com:8444/t03.css https://vidu.com:8444/t04.css 2&gt;&amp;1 | grep -oE 'send HEADERS frame &lt;length=[0-9]+' | sed 's/send HEADERS frame &lt;length=/HEADERS gui di: /; s/$/ byte/'
cookie dai 1474 byte
HEADERS gui di: 1240 byte
HEADERS gui di: 20 byte
HEADERS gui di: 20 byte
HEADERS gui di: 20 byte
$ C="phien=$(head -c 1100 /dev/urandom | base64 -w0)"; for i in 1 2 3 4; do curl -s -o /dev/null --http1.1 --cacert pki/root.crt -H "cookie: $C" -w 'HTTP/1.1 request %{size_request} byte\\n' https://vidu.com:8443/t0$i.css; done
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte</div>
<p>HTTP/2 and ALPN h2 on 8444, HTTP/1.1 on 8443; sequential 18 vs 21 ms, parallel 20 vs 63 ms; HPACK sent 1,240 bytes of headers once and 20 bytes after that, while HTTP/1.1 sent 1,567 bytes every time.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-2-http2" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.2 — HTTP/2: multiplexing, HPACK and why server push died</span><span class="lc-sub">The protocol itself</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/ddos-protection/learn?lessonSlug=ddos-4-3-http2" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">DDoS Protection · 4.3 — HTTP/2 and HTTP/3 specific attacks</span><span class="lc-sub">Rapid Reset, and why stream limits exist</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>http2 on;</code></span><span class="v">The HTTP/2 directive (nginx 1.25.1+); older builds write <code>listen ... http2</code>. Not on by default.</span></div>
  <div class="kv"><span class="k">ALPN</span><span class="v">The protocol is chosen inside the TLS handshake; <code>openssl s_client -alpn</code> is the definitive test.</span></div>
  <div class="kv"><span class="k">Multiplexing</span><span class="v">Many requests over one connection, removing HTTP-layer head-of-line blocking.</span></div>
  <div class="kv"><span class="k">HPACK</span><span class="v">HTTP/2 header compression; repeated cookies become references to a shared table.</span></div>
  <div class="kv"><span class="k">Domain sharding / concatenation</span><span class="v">HTTP/1.1 workarounds that are now counterproductive on HTTP/2.</span></div>
  <div class="kv"><span class="k">HTTP/3 / QUIC</span><span class="v">The same idea moved below TLS, enabled with <code>listen 443 quic</code>.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>HTTP/2 is one word of config, is not on by default, and ALPN — not the config file — confirms it is really running.</li><li>The local benchmark showed 28ms against 27ms because loopback has no latency for multiplexing to save.</li><li><code>curl</code> reports pre-HPACK header sizes, so it cannot measure header compression at all.</li><li>The real wins are one connection instead of six, no head-of-line blocking, and HPACK — and all scale with latency.</li><li>Server push is gone, sharding and spriting are now harmful, and the honest place to measure is a real browser over a throttled network.</li></ul>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — concluding HTTP/2 does nothing, from a benchmark run on localhost.</strong> The whole benefit is multiplexing many requests over one connection, and its size is proportional to latency and connection cost — both of which are near zero on loopback. So a local benchmark shows a difference in the noise, and the honest conclusion from that data is &quot;this measurement cannot detect the effect&quot;, not &quot;the effect is absent&quot;. Measure it where the conditions exist: a real client, a real network, DevTools throttled, and a page with several dozen subresources. This is the general trap in the chapter — a benchmark that cannot observe the mechanism will always report that the mechanism does not matter.</p>
</div>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_v2_module.html" target="_blank" rel="noopener"><span class="lc-ico">2️⃣</span><span class="lc-body"><span class="lc-title">nginx — the HTTP/2 module</span><span class="lc-sub">nginx.org · Directives, limits, and the version note about the listen parameter</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_v3_module.html" target="_blank" rel="noopener"><span class="lc-ico">3️⃣</span><span class="lc-body"><span class="lc-title">nginx — the HTTP/3 module</span><span class="lc-sub">nginx.org · What QUIC needs, and the Alt-Svc header that advertises it</span></span></a>
<a class="link-card" href="https://hpbn.co/http2/" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">High Performance Browser Networking — HTTP/2</span><span class="lc-sub">hpbn.co · Multiplexing, HPACK and prioritisation, explained with the round trips visible</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">The six-connection limit, and the workarounds HTTP/2 made obsolete</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Confirm h2 with ALPN, then try to benchmark it locally and see the same non-result</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>HTTP/2: nó đổi cái gì, và phép đo trên máy KHÔNG cho bạn thấy cái gì</h2>
<p class="lead">HTTP/2 tốn MỘT chữ trong cấu hình và nó thật sự đáng bật. Nó cũng là chỗ mà các phép đo NÓI DỐI một cách thuyết phục nhất, nên bài này vẫn cứ đo, rồi giải thích những con số ấy có nghĩa gì và KHÔNG có nghĩa gì.</p>

<h3>Bật nó lên và xác nhận nó</h3>
<div class="out">$ curl -o /dev/null -w 'HTTP/%{http_version}\\n' https://...

  cong 8444 (co bat http2)      -> HTTP/2
  cong 8443 (KHONG bat)         -> HTTP/1.1

$ openssl s_client -alpn h2,http/1.1 -connect ...
  cong 8444 -> ALPN protocol: h2
  cong 8443 -> ALPN protocol: http/1.1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó KHÔNG bật sẵn</span><span class="lz-d">Thêm chữ <code>ssl</code> vào một dòng <code>listen</code> là bạn có HTTPS chạy trên HTTP/1.1 và không hơn. Cổng 8443 ở trên là một máy chủ TLS hoàn chỉnh, chạy tốt, và nó thương lượng ra <code>http/1.1</code> vì chẳng ai xin thứ gì khác.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cú pháp TUỲ vào phiên bản của bạn</span><span class="lz-d"><code>listen 443 ssl http2;</code> tới bản 1.25.0, còn <code>http2 on;</code> thành chỉ thị riêng từ 1.25.1. Viết sai trên bản cũ là <code>unknown directive</code> và cấu hình KHÔNG nạp được; viết sai trên bản mới là một dòng cảnh báo lỗi thời và nó VẪN chạy.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ALPN là cách client và máy chủ thoả thuận</span><span class="lz-d">Giao thức được chọn NGAY TRONG cái bắt tay TLS, không phải sau đó. Đó là lý do HTTP/2 trên thực tế đòi phải có TLS — và là lý do <code>openssl s_client -alpn</code> mới là phép thử dứt điểm chứ không phải việc đọc cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hãy xác nhận từ BÊN NGOÀI, một lần</span><span class="lz-d">Một lệnh <code>curl -w '%{http_version}'</code> nhắm vào tên miền thật của bạn. Rất dễ thêm cái chỉ thị ấy vào NHẦM khối <code>server</code>, và site vẫn chạy hoàn hảo trên HTTP/1.1 trong khi bạn tin là ngược lại.</span></div>
</div>

<h3>Rồi thử ĐO cái lợi ích</h3>
<div class="out">50 tep nho, mot lenh curl, cung mot may (loopback, do tre ~0):
  tuan tu   :  HTTP/2  18 ms   HTTP/1.1  21 ms
  song song :  HTTP/2  20 ms   HTTP/1.1  63 ms   &lt;- 1.1 mo NHIEU ket noi = nhieu lan bat tay
HPACK do TREN DAY (nghttp -nv, kich thuoc khoi HEADERS gui di), cung cookie 1.474 byte, 4 request:
  HTTP/2   : 1.240 -&gt; 20 -&gt; 20 -&gt; 20 byte
  HTTP/1.1 : 1.567 byte MOI request (curl %{size_request})</div>
<div class="callout warn">
<p><strong>Một cái máy cho thấy được gì, và không cho thấy gì.</strong> Lấy lần lượt từng tệp, HTTP/2 và HTTP/1.1 mất 18 và 21 ms: trên loopback không có độ trễ, nên chẳng có head-of-line blocking nào để gỡ và phép ghép kênh chẳng có gì để che — lợi thế chính của HTTP/2 nằm ở số VÒNG ĐI VỀ, mà phép thử có thời gian đi về bằng không thì không thấy được. Lấy song song thì HTTP/1.1 mở nhiều kết nối và trả một cú bắt tay TLS cho mỗi cái (63 ms so với 20) — phần ĐÓ thì thấy được. Còn nén header thì phải đo TRÊN DÂY: <code>%{size_request}</code> của <code>curl</code> báo đám header nó soạn ra, TRƯỚC khi HPACK nén, nên không bao giờ thấy được phần tiết kiệm. <code>nghttp -nv</code> in kích thước THẬT của khung HEADERS: lần đầu 1.240 byte, những lần sau 20 byte cho cùng cái cookie 1,5 KB.</p>
</div>

<h3>HTTP/2 THẬT SỰ đổi cái gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một kết nối thay vì sáu</span><span class="lz-lnote">Trình duyệt mở tới sáu kết nối song song cho mỗi gốc trên HTTP/1.1, mỗi cái một lần bắt tay TLS. HTTP/2 dùng MỘT. Theo con số ở Bài 6.3 thì đó là năm lần bắt tay được tiết kiệm ở MỖI lượt tải trang, và đó là phần hiện ra kể cả trên mạng nhanh.</span></div>
  <div class="lz-layer"><span class="lz-lname">KHÔNG còn head-of-line blocking ở tầng HTTP</span><span class="lz-lnote">Trên HTTP/1.1 một phản hồi chậm CHẸN mọi thứ xếp sau nó trên kết nối đó. HTTP/2 đan xen các khung, nên một lượt gọi API chậm KHÔNG làm trễ ba mươi tấm ảnh xếp hàng phía sau. Đó là lợi ích của phép ghép kênh, và nó lớn lên theo ĐỘ TRỄ — đúng lý do loopback chẳng cho thấy gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">HPACK nén header, kể cả những cái cookie lặp đi lặp lại</span><span class="lz-lnote">Một cái cookie 1,5KB gửi trên bốn mươi request là 60KB tải LÊN với HTTP/1.1 và chỉ còn một phần nhỏ với HTTP/2, vì bản thứ hai trở đi là những tham chiếu tới một bảng dùng chung. Trên đường lên của mạng di động thì đó là khoản tiết kiệm THẬT; đo nó thì cần bắt gói tin chứ không phải curl.</span></div>
  <div class="lz-layer"><span class="lz-lname">Server push đã BIẾN MẤT, và thế là tốt</span><span class="lz-lnote">Chrome gỡ nó năm 2022 và mọi nơi đều khai tử. Thấy <code>http2_push</code> trong một bài viết nào đó thì bài đó CŨ rồi. <code>&lt;link rel="preload"&gt;</code> và early hints làm đúng việc ấy mà không mang theo độ phức tạp của giao thức.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Gộp tệp và ghép ảnh sprite trở thành PHẢN tác dụng</span><span class="v">Những kỹ thuật đó sinh ra để lách cái giới hạn sáu kết nối. Với một kết nối ghép kênh thì bốn mươi tệp nhỏ tốn chẳng hơn một tệp lớn bao nhiêu — và chúng CACHE tốt hơn nhiều, vì đổi một cái không làm hỏng cả gói.</span></div>
  <div class="kv"><span class="k">Chia tài nguyên ra nhiều tên miền giờ là CÓ HẠI</span><span class="v">Rải tài nguyên qua <code>img1.vidu.com</code> và <code>img2.vidu.com</code> là để ép thêm kết nối song song trên HTTP/1.1. Trên HTTP/2 nó ép thêm những cú bắt tay TLS và thêm những lượt tra DNS mà chẳng được lợi gì. Site nào còn làm thế thì gỡ đi là một cú thắng cho không.</span></div>
  <div class="kv"><span class="k">http2_max_concurrent_streams chặn một client lại</span><span class="v">Mặc định 128. Một kết nối mang hàng trăm luồng đồng thời là cách để MỘT client ngốn rất nhiều sự chú ý của worker, và đây là cái trần cho chuyện đó. Chương 7 lo phần còn lại của các giới hạn theo từng client.</span></div>
  <div class="kv"><span class="k">HTTP/3 là cùng ý tưởng nhưng chạy trên QUIC</span><span class="v">Nó đưa phép ghép kênh xuống DƯỚI TLS để mất gói ở một luồng không làm khựng các luồng khác — tức cái head-of-line blocking ở tầng vận chuyển mà HTTP/2 vẫn còn. Nginx hỗ trợ nó từ 1.25.0 với <code>listen 443 quic;</code>, và nó đáng thêm vào sau khi HTTP/2 đã được xác nhận là chạy.</span></div>
</div>
<div class="note-ct">
<p><strong>Đo nó cho tử tế thì đo ở đâu.</strong> KHÔNG phải trên chính cái máy đang chạy máy chủ. Hãy mở site của bạn qua một kết nối THẬT với bảng Network của trình duyệt, lọc theo giao thức, rồi so một hồ sơ có bóp băng thông với HTTP/2 bật và tắt — cách đó tái hiện độ trễ, mất gói và hành vi kết nối thật của trình duyệt, những thứ mà loopback không có cái nào. Hoặc chấp nhận lập luận về CẤU TRÚC: một kết nối thay vì sáu, và Bài 6.3 đã đo sẵn một cái bắt tay tốn bao nhiêu. Cả hai đều thật thà; còn một phép đo trên máy báo 18 so với 21 khi lấy tuần tự thì KHÔNG phải bằng chứng cho bên nào, và thứ hữu ích cần học từ nó là chuyện tạo ra một con số vô nghĩa dễ tới mức nào.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Năm mươi tệp nhỏ, một cổng có <code>http2</code> và một cổng không (cú pháp nginx/1.24.0), lấy tuần tự và song song, rồi đo HPACK trên dây bằng <code>nghttp</code> (gói Ubuntu <code>nghttp2-client</code>):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  root /srv/site;
  server { listen 8443 ssl;       server_name vidu.com; } <span class="tok-comment">  # KHÔNG bật http2</span>
  server { listen 8444 ssl http2; server_name vidu.com; } <span class="tok-comment">  # nginx 1.24: http2 là THAM SỐ của listen</span>
}</code></pre>
<div class="out">$ for p in 8444 8443; do printf 'cong %s -&gt; ' $p; curl -s -o /dev/null --cacert pki/root.crt -w 'HTTP/%{http_version}\\n' https://vidu.com:$p/t01.css; done
cong 8444 -&gt; HTTP/2
cong 8443 -&gt; HTTP/1.1
$ for p in 8444 8443; do printf 'cong %s -&gt; ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -alpn h2,http/1.1 &lt;/dev/null 2&gt;&amp;1 | grep -E '^ALPN|No ALPN'; done
cong 8444 -&gt; ALPN protocol: h2
cong 8443 -&gt; ALPN protocol: http/1.1
$ U=$(for i in $(seq -w 1 50); do printf -- '-o /dev/null https://vidu.com:8444/t%s.css ' $i; done); for m in '' --parallel; do for v in --http2 --http1.1; do printf '%-9s %-10s 50 tep: ' $v "\${m:-tuan-tu}"; s=$(date +%s%N); curl -s $m $v --cacert pki/root.crt $U; echo "$(( ($(date +%s%N)-s)/1000000 )) ms"; done; done
--http2   tuan-tu    50 tep: 18 ms
--http1.1 tuan-tu    50 tep: 21 ms
--http2   --parallel 50 tep: 20 ms
--http1.1 --parallel 50 tep: 63 ms
$ C="phien=$(head -c 1100 /dev/urandom | base64 -w0)"; echo "cookie dai \${#C} byte"; nghttp -nv -H "cookie: $C" https://vidu.com:8444/t01.css https://vidu.com:8444/t02.css https://vidu.com:8444/t03.css https://vidu.com:8444/t04.css 2&gt;&amp;1 | grep -oE 'send HEADERS frame &lt;length=[0-9]+' | sed 's/send HEADERS frame &lt;length=/HEADERS gui di: /; s/$/ byte/'
cookie dai 1474 byte
HEADERS gui di: 1240 byte
HEADERS gui di: 20 byte
HEADERS gui di: 20 byte
HEADERS gui di: 20 byte
$ C="phien=$(head -c 1100 /dev/urandom | base64 -w0)"; for i in 1 2 3 4; do curl -s -o /dev/null --http1.1 --cacert pki/root.crt -H "cookie: $C" -w 'HTTP/1.1 request %{size_request} byte\\n' https://vidu.com:8443/t0$i.css; done
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte
HTTP/1.1 request 1567 byte</div>
<p>HTTP/2 và ALPN h2 ở 8444, HTTP/1.1 ở 8443; tuần tự 18 so với 21 ms, song song 20 so với 63 ms; HPACK gửi 1.240 byte header một lần rồi 20 byte những lần sau, còn HTTP/1.1 lần nào cũng 1.567 byte.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-2-http2" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.2 — HTTP/2: ghép kênh, HPACK và vì sao server push chết</span><span class="lc-sub">Chính giao thức đó</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/ddos-protection/learn?lessonSlug=ddos-4-3-http2" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">DDoS Protection · 4.3 — Tấn công riêng của HTTP/2 và HTTP/3</span><span class="lc-sub">Rapid Reset, và vì sao có trần số luồng</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>http2 on;</code></span><span class="v">Chỉ thị HTTP/2 (nginx 1.25.1+); bản cũ hơn viết <code>listen ... http2</code>. Không bật sẵn.</span></div>
  <div class="kv"><span class="k">ALPN</span><span class="v">Giao thức được chọn ngay trong bắt tay TLS; <code>openssl s_client -alpn</code> là phép thử dứt điểm.</span></div>
  <div class="kv"><span class="k">Multiplexing (ghép kênh)</span><span class="v">Nhiều request trên một kết nối, gỡ bỏ head-of-line blocking ở tầng HTTP.</span></div>
  <div class="kv"><span class="k">HPACK</span><span class="v">Nén header của HTTP/2; cookie lặp lại trở thành tham chiếu tới một bảng dùng chung.</span></div>
  <div class="kv"><span class="k">Domain sharding / gộp tệp</span><span class="v">Những mẹo lách của HTTP/1.1 nay thành phản tác dụng trên HTTP/2.</span></div>
  <div class="kv"><span class="k">HTTP/3 / QUIC</span><span class="v">Cùng ý tưởng nhưng đưa xuống dưới TLS, bật bằng <code>listen 443 quic</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>HTTP/2 tốn một chữ cấu hình, không bật sẵn, và ALPN — chứ không phải tệp cấu hình — mới xác nhận nó thật sự chạy.</li><li>Phép đo trên máy cho ra 28ms so với 27ms vì loopback không có độ trễ nào để phép ghép kênh tiết kiệm.</li><li><code>curl</code> báo cáo kích thước header TRƯỚC HPACK, nên nó hoàn toàn không đo được việc nén header.</li><li>Lợi ích thật là một kết nối thay vì sáu, không head-of-line blocking, và HPACK — tất cả đều lớn theo độ trễ.</li><li>Server push đã biến mất, sharding và sprite nay có hại, và nơi đo thật thà là một trình duyệt thật trên mạng có bóp băng thông.</li></ul>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — kết luận HTTP/2 chẳng làm gì, từ một phép đo chạy trên localhost.</strong> Toàn bộ lợi ích là ghép nhiều request lên một kết nối, và độ lớn của nó tỷ lệ với độ trễ và chi phí mở kết nối — cả hai đều gần bằng không trên loopback. Nên một phép đo cục bộ cho ra chênh lệch nằm trong nhiễu, và kết luận thành thật từ dữ liệu đó là &quot;phép đo này không phát hiện được hiệu ứng&quot;, chứ không phải &quot;hiệu ứng không tồn tại&quot;. Hãy đo ở nơi có đủ điều kiện: một client thật, một đường mạng thật, DevTools có bóp băng thông, và một trang có vài chục tài nguyên con. Đây là cái bẫy tổng quát của cả chương — một phép đo không quan sát được cơ chế thì luôn báo cáo rằng cơ chế đó chẳng có ý nghĩa gì.</p>
</div>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_v2_module.html" target="_blank" rel="noopener"><span class="lc-ico">2️⃣</span><span class="lc-body"><span class="lc-title">nginx — module HTTP/2</span><span class="lc-sub">nginx.org · Các chỉ thị, các giới hạn, và ghi chú phiên bản về tham số của listen</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_v3_module.html" target="_blank" rel="noopener"><span class="lc-ico">3️⃣</span><span class="lc-body"><span class="lc-title">nginx — module HTTP/3</span><span class="lc-sub">nginx.org · QUIC cần gì, và cái header Alt-Svc dùng để quảng cáo nó</span></span></a>
<a class="link-card" href="https://hpbn.co/http2/" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">High Performance Browser Networking — HTTP/2</span><span class="lc-sub">hpbn.co · Ghép kênh, HPACK và ưu tiên, giải thích với số vòng đi về hiện rõ</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Cái giới hạn sáu kết nối, và những mẹo lách mà HTTP/2 làm cho lỗi thời</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Xác nhận h2 bằng ALPN, rồi thử đo nó trên máy và nhận về đúng cái kết quả trống rỗng ấy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — The redirect to HTTPS, HSTS, and the renewal it silently breaks|||6.5 — Cú chuyển hướng sang HTTPS, HSTS, và việc gia hạn nó âm thầm phá',
      slug: 'nginx-6-5-chuyen-huong-va-hsts',
      type: 'LESSON',
      description: 'Ba dòng mà mọi hướng dẫn đều đưa cho bạn để đẩy HTTP sang HTTPS, và bài này đo ra rằng cách viết phổ biến nhất vừa mở một cú chuyển hướng do kẻ tấn công điều khiển vừa PHÁ việc gia hạn chứng chỉ — cả hai đều im lặng, và cái thứ hai nổ ra sau đúng 60 ngày.',
      content: `
${G06_5}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>The redirect to HTTPS, HSTS, and the renewal it silently breaks</h2>
<p class="lead">Once HTTPS works, port 80 still exists and still answers. What you put there is three lines, and the version that appears in most tutorials has two separate problems that both stay invisible until they are expensive.</p>

<h3>Two port-80 blocks, measured</h3>
<div class="out">A) Khoi DUNG — dich la HANG SO, ACME dat TREN cu chuyen huong

   server {
     listen 80;
     location /.well-known/acme-challenge/ { root /var/www/certbot; }
     location / { return 301 https://vidu.com$request_uri; }
   }

   /gio-hang                        -> 301  Location: https://vidu.com/gio-hang
   /.well-known/acme-challenge/abc  -> 200  "thu-thach-acme"        &lt;- gia han CHAY

B) Khoi SAI — mot dong return phu CA KHOI, dich dung $host

   server { listen 80; return 301 https://$host$request_uri; }

   Host: ke-tan-cong.com, /gio-hang
      -> 301  Location: https://ke-tan-cong.com/gio-hang    &lt;- KE TAN CONG chon dich
   /.well-known/acme-challenge/abc
      -> 301  Location: https://vidu.com/.well-known/...    &lt;- gia han CHET</div>
<div class="pitfall">
<p><strong>Trap — the second failure is the expensive one, because it is delayed by sixty days.</strong> A blanket <code>return 301</code> on port 80 also redirects the ACME challenge, so Let's Encrypt cannot verify your domain. Nothing breaks immediately: the certificate you already have keeps working for weeks. Then renewal fails quietly at day 60, fails again every day after, and on day 90 every visitor gets a certificate warning at once. The fix is ordering — a <code>location</code> for the challenge path above the redirect, exactly as block A does — and the check is to request a challenge URL over plain HTTP and confirm it returns <code>200</code> rather than <code>301</code>. That is one <code>curl</code>, and it is worth putting in the same script that checks certificate expiry.</p>
</div>
<div class="callout warn">
<p><strong>And the first failure is Lesson 1.4 arriving again.</strong> <code>https://\$host\$request_uri</code> takes the destination from a header the client typed, so a forged <code>Host</code> produces a redirect to the attacker's site — with your domain in the browser history and your server's name on the response. Use a literal: <code>return 301 https://vidu.com\$request_uri;</code>. If a single block genuinely serves several domains, give each one its own <code>server</code> block with its own literal, or accept the redirect only for hostnames you match explicitly with <code>server_name</code> and let the default block refuse the rest (Lesson 1.3).</p>
</div>

<h3>HSTS: what it does and when it starts</h3>
<div class="out">cong 8444 (co add_header): strict-transport-security: max-age=63072000; includeSubDomains
cong 8443 (khong co)     : KHONG co
tren HTTP (cong 80)      : KHONG co — va dung ra la the</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">HSTS removes the first insecure request</span><span class="lz-d">A redirect still means one plain-HTTP request went out, and that one is interceptable. After a browser has seen HSTS once, it rewrites <code>http://</code> to <code>https://</code> itself, before any packet leaves.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It is ignored over HTTP, by design</span><span class="lz-d">Which is why the header is absent from the port-80 block above and should stay absent — an attacker who can modify plain HTTP could otherwise inject an HSTS header for a domain you do not control and deny service to it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Start with a short max-age</span><span class="lz-d"><code>max-age=300</code> for a week, then raise it. HSTS is not revocable: once a browser has stored two years, that browser will refuse plain HTTP for two years whatever you do to the server. Get it wrong at full length and the only fix is waiting.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">includeSubDomains and preload are one-way doors</span><span class="lz-d"><code>includeSubDomains</code> covers every subdomain including the internal one on plain HTTP that you forgot about. <code>preload</code> ships your domain inside browsers, and removal takes months. Both are correct for a mature site and dangerous as a first step.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Port 80 — the ORDER MATTERS: ACME comes ABOVE the redirect</span>
server {
  listen 80;
  listen [::]:80;
  server_name vidu.com www.vidu.com;

  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://vidu.com\$request_uri; }   <span class="tok-comment"># HẰNG SỐ</span>
}

<span class="tok-comment"># Port 443 — HSTS only here, and start with a SMALL number</span>
server {
  listen 443 ssl;
  http2 on;
  server_name vidu.com;
  add_header Strict-Transport-Security "max-age=300" always;   <span class="tok-comment"># 5 minutes, for the first week</span>
  <span class="tok-comment"># after a quiet week: "max-age=63072000; includeSubDomains"</span>
}

<span class="tok-comment"># www -> apex, its own block, and the target is still a CONSTANT (Lesson 1.5)</span>
server {
  listen 443 ssl;
  server_name www.vidu.com;
  return 301 https://vidu.com\$request_uri;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">always is required on the HSTS header</span><span class="v">Without it the header is skipped on error responses, so a user who hits a <code>404</code> or a <code>502</code> as their first request does not get it. This is one of the cases where <code>always</code> is right — unlike <code>Cache-Control</code>, where Lesson 4.5 measured it caching a failure for a year.</span></div>
  <div class="kv"><span class="k">301 rather than 302 for the protocol upgrade</span><span class="v">It is permanent and browsers cache it, so the second visit skips the redirect even before HSTS applies. Use <code>302</code> only while you are still deciding whether HTTPS is staying.</span></div>
  <div class="kv"><span class="k">Redirect to the canonical host, not just the canonical scheme</span><span class="v">Sending <code>http://www.vidu.com/x</code> to <code>https://www.vidu.com/x</code> and then to <code>https://vidu.com/x</code> is two redirects for one request. One hop to the final destination is faster and simpler to reason about.</span></div>
  <div class="kv"><span class="k">Do not redirect health checks or webhooks blindly</span><span class="v">A load balancer probing <code>/health</code> over HTTP gets a <code>301</code> and may treat it as unhealthy; a payment webhook that does not follow redirects silently fails. Both want an explicit <code>location</code> above the catch-all, the same shape as the ACME block.</span></div>
</div>
<div class="note-ct">
<p><strong>The checklist for the day you enable HTTPS.</strong> Request a challenge URL over plain HTTP and confirm <code>200</code>. Request any other path over plain HTTP with a forged <code>Host</code> and confirm the <code>Location</code> contains your domain and not theirs. Confirm HSTS is present on <code>443</code> and absent on <code>80</code>. Set <code>max-age</code> small and put a note in your calendar to raise it. Four checks, four <code>curl</code> commands, and they cover both of the failures this lesson measured plus the one that takes two years to undo.</p>
</div>

<h3>🔬 Run it yourself</h3>
<p>Blocks A and B on two plain ports, an HSTS and a no-HSTS HTTPS port, and the www redirect — each requested with a real and a forged Host, on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  server {                                 <span class="tok-comment">  # A) ĐÚNG: đích HẰNG SỐ, ACME đứng TRÊN cú chuyển hướng</span>
    listen 8080;
    server_name vidu.com www.vidu.com;
    location /.well-known/acme-challenge/ { root /srv/acme; }
    location / { return 301 https://vidu.com$request_uri; }
  }
  server {                                 <span class="tok-comment">  # B) SAI: một dòng return phủ CẢ khối, đích lấy từ $host</span>
    listen 8081;
    return 301 https://$host$request_uri;
  }
  server {                                 <span class="tok-comment">  # HTTPS có HSTS</span>
    listen 8443 ssl;
    server_name vidu.com;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    return 200 "trang chu\\n";
  }
  server {                                 <span class="tok-comment">  # HTTPS KHÔNG có HSTS</span>
    listen 8444 ssl;
    server_name vidu.com;
    return 200 "trang chu\\n";
  }
  server {                                 <span class="tok-comment">  # www -&gt; apex, đích vẫn là hằng số</span>
    listen 8443 ssl;
    server_name www.vidu.com;
    return 301 https://vidu.com$request_uri;
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># xin80.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># xin80.sh &lt;cổng&gt; &lt;Host&gt; &lt;đường dẫn&gt; — in mã + Location (hoặc thân) của một request HTTP thường</span>
r=$(curl -s -D - -H "Host: $2" http://127.0.0.1:$1$3 | tr -d '\\r')
printf '%-22s %-34s -&gt; %s  %s\\n' "Host: $2" "$3" "$(head -1 &lt;&lt;&lt;"$r" | cut -d' ' -f2)" "$(grep -i '^location:' &lt;&lt;&lt;"$r" || tail -1 &lt;&lt;&lt;"$r")"</code></pre>
<div class="out">$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'A '; bash xin80.sh 8080 vidu.com $d; done; printf 'A '; bash xin80.sh 8080 ke-tan-cong.com /gio-hang
A Host: vidu.com         /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
A Host: vidu.com         /.well-known/acme-challenge/abc    -&gt; 200  thu-thach-acme
A Host: ke-tan-cong.com  /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'B '; bash xin80.sh 8081 vidu.com $d; done; printf 'B '; bash xin80.sh 8081 ke-tan-cong.com /gio-hang
B Host: vidu.com         /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
B Host: vidu.com         /.well-known/acme-challenge/abc    -&gt; 301  Location: https://vidu.com/.well-known/acme-challenge/abc
B Host: ke-tan-cong.com  /gio-hang                          -&gt; 301  Location: https://ke-tan-cong.com/gio-hang
$ for p in 8443 8444; do printf 'cong %s (https): ' $p; curl -s -D - -o /dev/null --cacert pki/root.crt https://vidu.com:$p/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'; done; printf 'cong 8080 (http) : '; curl -s -D - -o /dev/null -H 'Host: vidu.com' http://127.0.0.1:8080/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'
cong 8443 (https): Strict-Transport-Security: max-age=63072000; includeSubDomains
cong 8444 (https): KHONG co
cong 8080 (http) : KHONG co
$ curl -s -o /dev/null -w 'www.vidu.com -&gt; %{http_code} %{redirect_url}\\n' --cacert pki/root.crt https://www.vidu.com:8443/gio-hang
www.vidu.com -&gt; 301 https://vidu.com/gio-hang</div>
<p>Block A sent every Host to https://vidu.com and served the ACME token (200); block B sent the forged Host to https://ke-tan-cong.com and redirected the ACME token (301 — renewal dead). HSTS appeared only on the HTTPS port that set it.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-4-header" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Web Security · 5.4 — Security header checklist</span><span class="lc-sub">HSTS among the other headers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-5-cau-hinh" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.5 — Configuring and grading TLS on your own domain</span><span class="lc-sub">From these blocks to an A grade</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>return 301</code></span><span class="v">Permanent redirect; use a literal host so it cannot be turned into an open redirect.</span></div>
  <div class="kv"><span class="k"><code>$host</code> / Host header</span><span class="v">Client-controlled input; a forged Host poisons a <code>$host</code>-based redirect (Lesson 1.4).</span></div>
  <div class="kv"><span class="k">ACME challenge ordering</span><span class="v">The acme-challenge <code>location</code> must sit above the catch-all redirect, or renewal is redirected away.</span></div>
  <div class="kv"><span class="k">HSTS (Strict-Transport-Security)</span><span class="v">Tells the browser to rewrite http to https itself; ignored over plain HTTP by design.</span></div>
  <div class="kv"><span class="k">max-age</span><span class="v">Start small (300s); HSTS is not revocable once a browser has stored it.</span></div>
  <div class="kv"><span class="k">includeSubDomains / preload / always</span><span class="v">One-way doors for a mature site; <code>always</code> makes HSTS appear on error responses too.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A blanket <code>return 301</code> on port 80 both enables a Host-forged open redirect and redirects the ACME challenge away.</li><li>The broken renewal is silent for 60 days, then every visitor gets a certificate warning at once.</li><li>Fix it with a literal host in the redirect and by placing the acme-challenge <code>location</code> above the catch-all.</li><li>HSTS removes the first insecure request but is irrevocable — start with a small <code>max-age</code> and raise it later.</li><li>Keep HSTS on 443 only, use <code>always</code>, and do not blindly redirect health checks or webhooks.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Strict-Transport-Security</span><span class="lc-sub">developer.mozilla.org · max-age, includeSubDomains, preload and their consequences</span></span></a>
<a class="link-card" href="https://letsencrypt.org/docs/challenge-types/" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">Let's Encrypt — challenge types</span><span class="lc-sub">letsencrypt.org · Exactly what the HTTP-01 challenge needs to reach</span></span></a>
<a class="link-card" href="https://hstspreload.org/" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">HSTS preload list</span><span class="lc-sub">hstspreload.org · The requirements, and the removal process you should read first</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Open redirects, and what an attacker does with one on your domain</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build both port-80 blocks and watch one redirect the ACME challenge away</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Cú chuyển hướng sang HTTPS, HSTS, và việc gia hạn nó âm thầm phá</h2>
<p class="lead">Một khi HTTPS đã chạy thì cổng 80 vẫn còn đó và vẫn trả lời. Thứ bạn đặt ở đó chỉ ba dòng, và cái phiên bản xuất hiện trong hầu hết bài hướng dẫn có HAI vấn đề riêng biệt, cả hai đều vô hình cho tới lúc chúng trở nên đắt đỏ.</p>

<h3>Hai khối cổng 80, đo thật</h3>
<div class="out">A) Khoi DUNG — dich la HANG SO, ACME dat TREN cu chuyen huong

   server {
     listen 80;
     location /.well-known/acme-challenge/ { root /var/www/certbot; }
     location / { return 301 https://vidu.com$request_uri; }
   }

   /gio-hang                        -> 301  Location: https://vidu.com/gio-hang
   /.well-known/acme-challenge/abc  -> 200  "thu-thach-acme"        &lt;- gia han CHAY

B) Khoi SAI — mot dong return phu CA KHOI, dich dung $host

   server { listen 80; return 301 https://$host$request_uri; }

   Host: ke-tan-cong.com, /gio-hang
      -> 301  Location: https://ke-tan-cong.com/gio-hang    &lt;- KE TAN CONG chon dich
   /.well-known/acme-challenge/abc
      -> 301  Location: https://vidu.com/.well-known/...    &lt;- gia han CHET</div>
<div class="pitfall">
<p><strong>Bẫy — kiểu hỏng thứ hai mới là cái đắt, vì nó bị TRÌ HOÃN sáu mươi ngày.</strong> Một dòng <code>return 301</code> phủ cả cổng 80 sẽ chuyển hướng luôn cả đường thử thách ACME, nên Let's Encrypt không xác minh nổi tên miền của bạn. Chẳng có gì hỏng ngay lập tức: cái chứng chỉ bạn đang có vẫn chạy thêm mấy tuần nữa. Rồi việc gia hạn thất bại trong lặng lẽ ở ngày thứ 60, thất bại lại mỗi ngày sau đó, và tới ngày thứ 90 thì MỌI khách truy cập nhận cảnh báo chứng chỉ CÙNG một lúc. Cách chữa là THỨ TỰ — một khối <code>location</code> cho đường thử thách đặt TRÊN cú chuyển hướng, đúng như khối A làm — và phép kiểm là gọi một URL thử thách qua HTTP trần rồi xác nhận nó trả <code>200</code> chứ không phải <code>301</code>. Đó là một lệnh <code>curl</code>, và nó đáng được nhét vào cùng cái script đang kiểm hạn dùng chứng chỉ.</p>
</div>
<div class="callout warn">
<p><strong>Còn kiểu hỏng thứ nhất là Bài 1.4 ập tới lần nữa.</strong> <code>https://\$host\$request_uri</code> lấy cái ĐÍCH từ một header do client gõ ra, nên một cái <code>Host</code> giả mạo sinh ra một cú chuyển hướng tới site của kẻ tấn công — kèm tên miền của bạn nằm trong lịch sử trình duyệt và tên máy chủ của bạn nằm trên phản hồi. Hãy dùng HẰNG SỐ: <code>return 301 https://vidu.com\$request_uri;</code>. Nếu một khối THẬT SỰ phục vụ nhiều tên miền thì cho mỗi cái một khối <code>server</code> riêng với hằng số riêng, hoặc chỉ nhận chuyển hướng cho những tên miền bạn khớp tường minh bằng <code>server_name</code> rồi để khối mặc định từ chối phần còn lại (Bài 1.3).</p>
</div>

<h3>HSTS: nó làm gì và nó bắt đầu từ lúc nào</h3>
<div class="out">cong 8444 (co add_header): strict-transport-security: max-age=63072000; includeSubDomains
cong 8443 (khong co)     : KHONG co
tren HTTP (cong 80)      : KHONG co — va dung ra la the</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">HSTS xoá bỏ cái request KHÔNG an toàn ĐẦU TIÊN</span><span class="lz-d">Một cú chuyển hướng vẫn nghĩa là đã có MỘT request HTTP trần đi ra, và đúng cái đó thì chặn được. Sau khi trình duyệt đã thấy HSTS một lần, nó tự viết lại <code>http://</code> thành <code>https://</code>, TRƯỚC khi có gói tin nào rời máy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó bị BỎ QUA trên HTTP, và đó là chủ ý</span><span class="lz-d">Đó là lý do cái header này vắng mặt trong khối cổng 80 ở trên và NÊN tiếp tục vắng mặt — một kẻ tấn công sửa được HTTP trần thì nếu không sẽ tiêm được một header HSTS cho một tên miền bạn không sở hữu và làm nó chết luôn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy bắt đầu bằng max-age NHỎ</span><span class="lz-d"><code>max-age=300</code> trong một tuần, rồi mới nâng. HSTS KHÔNG thu hồi được: một khi trình duyệt đã cất hai năm thì nó sẽ từ chối HTTP trần suốt hai năm, dù bạn làm gì với máy chủ đi nữa. Làm sai ở độ dài tối đa thì cách chữa duy nhất là ĐỢI.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">includeSubDomains và preload là những cánh cửa MỘT CHIỀU</span><span class="lz-d"><code>includeSubDomains</code> phủ MỌI tên miền con, kể cả cái nội bộ đang chạy HTTP trần mà bạn quên mất. <code>preload</code> nhét tên miền của bạn vào bên trong các trình duyệt, và việc gỡ ra mất hàng tháng. Cả hai đều ĐÚNG với một site đã trưởng thành và NGUY khi làm bước đầu tiên.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Cổng 80 — thứ tự QUAN TRỌNG: ACME đứng TRÊN cú chuyển hướng</span>
server {
  listen 80;
  listen [::]:80;
  server_name vidu.com www.vidu.com;

  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://vidu.com\$request_uri; }   <span class="tok-comment"># HẰNG SỐ</span>
}

<span class="tok-comment"># Cổng 443 — HSTS chỉ ở đây, và bắt đầu bằng số NHỎ</span>
server {
  listen 443 ssl;
  http2 on;
  server_name vidu.com;
  add_header Strict-Transport-Security "max-age=300" always;   <span class="tok-comment"># 5 phút, tuần đầu</span>
  <span class="tok-comment"># sau một tuần yên ổn: "max-age=63072000; includeSubDomains"</span>
}

<span class="tok-comment"># www -> apex, khối riêng, đích vẫn là HẰNG SỐ (Bài 1.5)</span>
server {
  listen 443 ssl;
  server_name www.vidu.com;
  return 301 https://vidu.com\$request_uri;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Header HSTS BẮT BUỘC phải có chữ always</span><span class="v">Thiếu nó thì header bị bỏ trên các phản hồi lỗi, nên một người dùng mà request ĐẦU TIÊN của họ rơi trúng một cú <code>404</code> hay <code>502</code> sẽ không nhận được nó. Đây là một trong những ca mà <code>always</code> là ĐÚNG — khác với <code>Cache-Control</code>, nơi Bài 4.5 đo được nó đem cache một cú thất bại suốt một năm.</span></div>
  <div class="kv"><span class="k">Dùng 301 chứ đừng 302 cho việc nâng cấp giao thức</span><span class="v">Nó là VĨNH VIỄN và trình duyệt cache lại, nên lần ghé thứ hai bỏ qua luôn cú chuyển hướng, kể cả trước khi HSTS có hiệu lực. Chỉ dùng <code>302</code> khi bạn còn đang phân vân HTTPS có ở lại hay không.</span></div>
  <div class="kv"><span class="k">Chuyển hướng thẳng tới HOST chính tắc, đừng chỉ tới giao thức chính tắc</span><span class="v">Đẩy <code>http://www.vidu.com/x</code> sang <code>https://www.vidu.com/x</code> rồi lại sang <code>https://vidu.com/x</code> là HAI cú chuyển hướng cho một request. Một chặng thẳng tới đích cuối vừa nhanh hơn vừa dễ lý giải hơn.</span></div>
  <div class="kv"><span class="k">Đừng chuyển hướng health check và webhook một cách mù quáng</span><span class="v">Một bộ cân bằng tải dò <code>/health</code> qua HTTP sẽ nhận <code>301</code> và có thể coi đó là KHÔNG khoẻ; một webhook thanh toán không đi theo chuyển hướng sẽ thất bại trong im lặng. Cả hai đều muốn một khối <code>location</code> tường minh đặt TRÊN cái bắt-tất, cùng hình dạng với khối ACME.</span></div>
</div>
<div class="note-ct">
<p><strong>Danh sách kiểm cho cái ngày bạn bật HTTPS.</strong> Gọi một URL thử thách qua HTTP trần và xác nhận <code>200</code>. Gọi một đường dẫn bất kỳ khác qua HTTP trần với một <code>Host</code> giả mạo và xác nhận cái <code>Location</code> chứa tên miền CỦA BẠN chứ không phải của họ. Xác nhận HSTS CÓ trên <code>443</code> và KHÔNG có trên <code>80</code>. Đặt <code>max-age</code> nhỏ rồi ghi một dòng vào lịch để nâng nó lên. Bốn phép kiểm, bốn lệnh <code>curl</code>, và chúng phủ cả hai kiểu hỏng bài này đã đo cộng thêm cái mà gỡ ra mất hai năm.</p>
</div>

<h3>🔬 Tự chạy lại</h3>
<p>Khối A và B trên hai cổng thường, một cổng HTTPS có HSTS và một cổng không, cùng cú chuyển hướng www — mỗi cái được xin với Host thật và Host giả, trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  access_log off;
  ssl_certificate     /root/pki/fullchain.crt;
  ssl_certificate_key /root/pki/la.key;
  server {                                 <span class="tok-comment">  # A) ĐÚNG: đích HẰNG SỐ, ACME đứng TRÊN cú chuyển hướng</span>
    listen 8080;
    server_name vidu.com www.vidu.com;
    location /.well-known/acme-challenge/ { root /srv/acme; }
    location / { return 301 https://vidu.com$request_uri; }
  }
  server {                                 <span class="tok-comment">  # B) SAI: một dòng return phủ CẢ khối, đích lấy từ $host</span>
    listen 8081;
    return 301 https://$host$request_uri;
  }
  server {                                 <span class="tok-comment">  # HTTPS có HSTS</span>
    listen 8443 ssl;
    server_name vidu.com;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    return 200 "trang chu\\n";
  }
  server {                                 <span class="tok-comment">  # HTTPS KHÔNG có HSTS</span>
    listen 8444 ssl;
    server_name vidu.com;
    return 200 "trang chu\\n";
  }
  server {                                 <span class="tok-comment">  # www -&gt; apex, đích vẫn là hằng số</span>
    listen 8443 ssl;
    server_name www.vidu.com;
    return 301 https://vidu.com$request_uri;
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># xin80.sh</span>
<span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># xin80.sh &lt;cổng&gt; &lt;Host&gt; &lt;đường dẫn&gt; — in mã + Location (hoặc thân) của một request HTTP thường</span>
r=$(curl -s -D - -H "Host: $2" http://127.0.0.1:$1$3 | tr -d '\\r')
printf '%-22s %-34s -&gt; %s  %s\\n' "Host: $2" "$3" "$(head -1 &lt;&lt;&lt;"$r" | cut -d' ' -f2)" "$(grep -i '^location:' &lt;&lt;&lt;"$r" || tail -1 &lt;&lt;&lt;"$r")"</code></pre>
<div class="out">$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'A '; bash xin80.sh 8080 vidu.com $d; done; printf 'A '; bash xin80.sh 8080 ke-tan-cong.com /gio-hang
A Host: vidu.com         /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
A Host: vidu.com         /.well-known/acme-challenge/abc    -&gt; 200  thu-thach-acme
A Host: ke-tan-cong.com  /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'B '; bash xin80.sh 8081 vidu.com $d; done; printf 'B '; bash xin80.sh 8081 ke-tan-cong.com /gio-hang
B Host: vidu.com         /gio-hang                          -&gt; 301  Location: https://vidu.com/gio-hang
B Host: vidu.com         /.well-known/acme-challenge/abc    -&gt; 301  Location: https://vidu.com/.well-known/acme-challenge/abc
B Host: ke-tan-cong.com  /gio-hang                          -&gt; 301  Location: https://ke-tan-cong.com/gio-hang
$ for p in 8443 8444; do printf 'cong %s (https): ' $p; curl -s -D - -o /dev/null --cacert pki/root.crt https://vidu.com:$p/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'; done; printf 'cong 8080 (http) : '; curl -s -D - -o /dev/null -H 'Host: vidu.com' http://127.0.0.1:8080/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'
cong 8443 (https): Strict-Transport-Security: max-age=63072000; includeSubDomains
cong 8444 (https): KHONG co
cong 8080 (http) : KHONG co
$ curl -s -o /dev/null -w 'www.vidu.com -&gt; %{http_code} %{redirect_url}\\n' --cacert pki/root.crt https://www.vidu.com:8443/gio-hang
www.vidu.com -&gt; 301 https://vidu.com/gio-hang</div>
<p>Khối A đưa mọi Host về https://vidu.com và phục vụ chuỗi ACME (200); khối B đưa Host giả sang https://ke-tan-cong.com và chuyển hướng luôn chuỗi ACME (301 — gia hạn chết). HSTS chỉ xuất hiện ở cổng HTTPS có khai.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-security/learn?lessonSlug=sec-5-4-header" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Web Security · 5.4 — Checklist header bảo mật</span><span class="lc-sub">HSTS giữa các header khác</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/applied-cryptography/learn?lessonSlug=crypto-7-5-cau-hinh" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Applied Cryptography · 7.5 — Cấu hình và chấm điểm TLS trên tên miền của mình</span><span class="lc-sub">Từ các khối này tới điểm A</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>return 301</code></span><span class="v">Chuyển hướng vĩnh viễn; dùng host hằng số để nó không bị biến thành chuyển hướng mở.</span></div>
  <div class="kv"><span class="k"><code>$host</code> / header Host</span><span class="v">Đầu vào do client điều khiển; một Host giả mạo đầu độc cú chuyển hướng dựa trên <code>$host</code> (Bài 1.4).</span></div>
  <div class="kv"><span class="k">Thứ tự ACME challenge</span><span class="v">Khối <code>location</code> cho acme-challenge phải đứng TRÊN cú chuyển hướng bắt-tất, nếu không việc gia hạn bị đẩy đi mất.</span></div>
  <div class="kv"><span class="k">HSTS (Strict-Transport-Security)</span><span class="v">Bảo trình duyệt tự viết lại http thành https; bị bỏ qua trên HTTP trần theo chủ ý.</span></div>
  <div class="kv"><span class="k">max-age</span><span class="v">Bắt đầu nhỏ (300s); HSTS không thu hồi được một khi trình duyệt đã cất.</span></div>
  <div class="kv"><span class="k">includeSubDomains / preload / always</span><span class="v">Những cánh cửa một chiều cho site trưởng thành; <code>always</code> làm HSTS hiện cả trên phản hồi lỗi.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một dòng <code>return 301</code> phủ cả cổng 80 vừa mở một chuyển hướng bị Host giả mạo điều khiển, vừa đẩy mất đường thử thách ACME.</li><li>Việc gia hạn hỏng lặng lẽ suốt 60 ngày, rồi mọi khách truy cập nhận cảnh báo chứng chỉ cùng một lúc.</li><li>Chữa bằng host hằng số trong cú chuyển hướng và đặt khối <code>location</code> acme-challenge đứng trên cái bắt-tất.</li><li>HSTS xoá cái request không an toàn đầu tiên nhưng không thu hồi được — bắt đầu bằng <code>max-age</code> nhỏ rồi nâng sau.</li><li>Chỉ để HSTS trên 443, dùng <code>always</code>, và đừng chuyển hướng health check hay webhook một cách mù quáng.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Strict-Transport-Security</span><span class="lc-sub">developer.mozilla.org · max-age, includeSubDomains, preload và hệ quả của chúng</span></span></a>
<a class="link-card" href="https://letsencrypt.org/docs/challenge-types/" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">Let's Encrypt — các loại thử thách</span><span class="lc-sub">letsencrypt.org · Chính xác thì thử thách HTTP-01 cần chạm tới cái gì</span></span></a>
<a class="link-card" href="https://hstspreload.org/" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">Danh sách preload HSTS</span><span class="lc-sub">hstspreload.org · Các yêu cầu, và quy trình GỠ RA mà bạn nên đọc trước</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Chuyển hướng mở, và kẻ tấn công làm gì với một cái trên tên miền của bạn</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng cả hai khối cổng 80 và xem một cái chuyển hướng mất luôn đường thử thách ACME</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Quiz: TLS and HTTP/2|||6.6 — Quiz: TLS và HTTP/2',
      slug: 'nginx-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về chuỗi chứng chỉ, forward secrecy, cái giá thật của bắt tay, HTTP/2, và hai kiểu hỏng của cú chuyển hướng cổng 80.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Quiz: TLS and HTTP/2</h2>
<p class="lead">Eight questions from real handshakes against a real three-level chain. Two of them are about measurements that came out flat, and knowing why is the point.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A server must send its intermediate certificate, because clients only have the root: serving <code>fullchain</code> sent two certificates and verified, while serving the leaf alone sent one and returned <code>Verify return code: 21</code> (6.1). Trying all 89 TLS 1.2 cipher suites one at a time, the default block accepted 27 and an explicit list accepted 3 — and 16 of those 21 lacked ECDHE, meaning no forward secrecy (6.2). A handshake cost about 3ms here, but 100 requests over one connection cost 0.23ms each against 7.58ms over separate connections, so connection reuse dominates every cipher decision (6.3). HTTP/2 is not on by default and ALPN is how you confirm it, while a local benchmark showed 28ms against 27ms because loopback has no latency for multiplexing to save — and curl's header sizes cannot see HPACK at all (6.4). And a blanket <code>return 301 https://$host$request_uri;</code> on port 80 both hands the redirect destination to whoever forges a <code>Host</code> and redirects the ACME challenge away, breaking certificate renewal sixty days later (6.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Quiz: TLS và HTTP/2</h2>
<p class="lead">Tám câu ra từ những cái bắt tay THẬT với một chuỗi chứng chỉ ba tầng THẬT. Hai câu nói về những phép đo cho ra kết quả BẰNG PHẲNG, và biết VÌ SAO mới là điều đáng học.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Máy chủ BẮT BUỘC phải gửi cả chứng chỉ trung gian, vì client chỉ có mỗi root: phục vụ <code>fullchain</code> thì gửi ra hai chứng chỉ và xác thực qua, còn phục vụ mỗi cái lá thì gửi ra một và trả về <code>Verify return code: 21</code> (6.1). Thử lần lượt cả 89 bộ mã TLS 1.2, khối mặc định chấp nhận 27 còn khối khai tường minh chấp nhận 3 — và 16 trong 27 cái đó KHÔNG có ECDHE, tức là mất forward secrecy (6.2). Một cái bắt tay ở đây tốn chừng 3ms, nhưng 100 request qua MỘT kết nối tốn 0,23ms mỗi cái so với 7,58ms khi mỗi cái một kết nối, nên việc tái dùng kết nối ĐÈ BẸP mọi quyết định về bộ mã (6.3). HTTP/2 KHÔNG bật sẵn và ALPN là cách xác nhận nó, còn một phép đo trên máy cho ra 28ms so với 27ms vì loopback không có độ trễ nào để phép ghép kênh tiết kiệm — và kích thước header mà curl báo cáo thì hoàn toàn không nhìn thấy HPACK (6.4). Và một dòng <code>return 301 https://$host$request_uri;</code> phủ cả cổng 80 vừa trao cái đích chuyển hướng cho bất cứ ai giả mạo <code>Host</code>, vừa chuyển hướng mất đường thử thách ACME, làm việc gia hạn chứng chỉ chết sau đó sáu mươi ngày (6.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your site shows a padlock in your browser but curl and an Android app report an untrusted certificate. What is the most likely cause?|||Site của bạn hiện ổ khoá trên trình duyệt nhưng curl và một ứng dụng Android báo chứng chỉ không đáng tin. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The certificate has expired|||Chứng chỉ đã hết hạn',
              'ssl_certificate points at the leaf instead of fullchain, so the intermediate is missing — browsers cache intermediates, other clients do not|||ssl_certificate trỏ vào cái lá thay vì fullchain, nên thiếu chứng chỉ trung gian — trình duyệt CACHE trung gian còn client khác thì không',
              'The cipher list is too restrictive|||Danh sách bộ mã quá hẹp',
              'HTTP/2 is not enabled|||HTTP/2 chưa được bật',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How do you confirm a chain is complete, in one command?|||Xác nhận một chuỗi là đầy đủ bằng MỘT lệnh thế nào?',
            options: [
              'Open the site in a browser and check the padlock|||Mở site trên trình duyệt rồi nhìn cái ổ khoá',
              'Count the certificates the server sends: openssl s_client ... | grep -c "^ [0-9] s:" — one means the intermediate is missing|||ĐẾM số chứng chỉ máy chủ gửi ra: openssl s_client ... | grep -c "^ [0-9] s:" — được MỘT nghĩa là thiếu trung gian',
              'Check that the private key file is readable|||Kiểm xem tệp khoá riêng có đọc được không',
              'Look for ssl_certificate in nginx -T|||Tìm dòng ssl_certificate trong nginx -T',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a cipher suite without ECDHE matter, even if the encryption itself is strong?|||Vì sao một bộ mã KHÔNG có ECDHE lại đáng lo, dù bản thân phép mã hoá vẫn mạnh?',
            options: [
              'It is slower|||Nó chậm hơn',
              'No forward secrecy: the session key is encrypted to the server key, so traffic recorded today can be decrypted if that key leaks later|||Không có forward secrecy: khoá phiên được mã hoá bằng khoá của máy chủ, nên lưu lượng ghi lại hôm nay giải mã được nếu khoá đó bị lộ SAU NÀY',
              'Browsers refuse to use it|||Trình duyệt từ chối dùng nó',
              'It only works with TLS 1.3|||Nó chỉ chạy với TLS 1.3',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Measured: a TLS handshake cost ~3ms, one request on an open connection cost 0.23ms, and one request per connection cost 7.58ms. What follows?|||Đo được: một cái bắt tay TLS tốn ~3ms, một request trên kết nối đang mở tốn 0,23ms, còn mỗi request một kết nối tốn 7,58ms. Suy ra điều gì?',
            options: [
              'Choose a faster cipher suite|||Hãy chọn một bộ mã nhanh hơn',
              'Connection reuse — keepalive, HTTP/2, session resumption, upstream keepalive — matters far more than any handshake tuning|||Việc TÁI DÙNG kết nối — keepalive, HTTP/2, nối lại phiên, keepalive lên upstream — quan trọng hơn HẲN mọi việc chỉnh tinh cái bắt tay',
              'TLS should be disabled for static assets|||Nên tắt TLS cho tệp tĩnh',
              'The handshake is the dominant cost|||Cái bắt tay là chi phí lớn nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A local benchmark showed HTTP/2 at 28ms and HTTP/1.1 at 27ms for 50 resources. What does that prove?|||Một phép đo trên máy cho HTTP/2 28ms và HTTP/1.1 27ms với 50 tài nguyên. Điều đó chứng minh gì?',
            options: [
              'HTTP/2 is not worth enabling|||HTTP/2 không đáng bật',
              'Nothing about HTTP/2 — loopback has no latency, and HTTP/2’s benefit is removing round trips and head-of-line blocking|||Không chứng minh gì về HTTP/2 cả — loopback không có độ trễ, mà lợi ích của HTTP/2 là gỡ bỏ vòng đi về và head-of-line blocking',
              'HTTP/1.1 is faster|||HTTP/1.1 nhanh hơn',
              'The server was misconfigured|||Máy chủ bị cấu hình sai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You add listen 443 ssl; and see a working HTTPS site. Is HTTP/2 on?|||Bạn thêm listen 443 ssl; và thấy một site HTTPS chạy tốt. HTTP/2 có đang bật không?',
            options: [
              'Yes, TLS enables it automatically|||Có, TLS tự bật nó',
              'No — it must be enabled explicitly, and ALPN confirms which was negotiated (measured: http/1.1 without it, h2 with it)|||Không — phải bật TƯỜNG MINH, và ALPN xác nhận cái nào được thương lượng (đo thật: http/1.1 khi không bật, h2 khi có bật)',
              'Only if the client asks for it|||Chỉ khi client yêu cầu',
              'Only on port 443|||Chỉ trên cổng 443',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'server { listen 80; return 301 https://$host$request_uri; } — name both problems.|||server { listen 80; return 301 https://$host$request_uri; } — hãy gọi tên CẢ HAI vấn đề.',
            options: [
              'It is slow, and it uses the wrong status code|||Nó chậm, và nó dùng sai mã trạng thái',
              'A forged Host controls the redirect destination, and it also redirects the ACME challenge so certificate renewal fails sixty days later|||Một cái Host giả mạo điều khiển được đích chuyển hướng, VÀ nó chuyển hướng luôn đường thử thách ACME nên việc gia hạn chứng chỉ chết sau sáu mươi ngày',
              'It breaks HTTP/2 and HSTS|||Nó phá HTTP/2 và HSTS',
              'There is nothing wrong with it|||Nó chẳng có vấn đề gì cả',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why start HSTS with max-age=300 rather than two years?|||Vì sao nên bắt đầu HSTS bằng max-age=300 thay vì hai năm?',
            options: [
              'Longer values are ignored by browsers|||Trình duyệt bỏ qua các giá trị dài hơn',
              'HSTS is not revocable — a browser that stored two years will refuse plain HTTP for two years no matter what you change on the server|||HSTS KHÔNG thu hồi được — một trình duyệt đã cất hai năm sẽ từ chối HTTP trần suốt hai năm, dù bạn đổi gì trên máy chủ',
              'Short values are more secure|||Giá trị ngắn thì an toàn hơn',
              'It only matters for subdomains|||Nó chỉ có nghĩa lý với tên miền con',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
