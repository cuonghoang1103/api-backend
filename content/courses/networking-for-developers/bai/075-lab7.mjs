/**
 * Chương 7 · Lab 7 — Mổ xẻ ngăn xếp HTTP của LabFlow (phần 7 dự án xuyên khoá). Lab cơ bản + nginx h1/h2/h3 + 2 proxy.
 * Lời giải dùng output thật: lab/out/c71-*, c72-*, c73-*, c74-*, c75-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-7.mjs';

const L = card;
const PHIEU = `# Lab 7 report — <your name>, <date>

## R1 HTTP/1.1   — labelled message (status line, headers, blank line, body); keep-alive; chunked
## R2 HTTP/2     — ALPN h2; stream IDs 1, 3, 5 on ONE connection
## R3 HTTP/3     — UDP + TCP listeners on 8443; the Alt-Svc upgrade header
## R4 Headers    — ETag → 304; Content-Encoding gzip; HSTS
## R5 CORS       — preflight OPTIONS; Access-Control-Allow-* (a browser rule)
## R6 Client IP  — seenFrom (proxy) vs X-Forwarded-For (client); the 429 cause and fix`;

export default {
  title: 'Lab 7 — Dissecting LabFlow’s HTTP stack: read 1.1→3, verify the headers, find the real client IP|||Lab 7 — Mổ xẻ ngăn xếp HTTP của LabFlow: đọc 1.1→3, kiểm header, tìm IP client thật',
  slug: 'netdev-7-6-lab-http-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7 · Course project part 7</span>
<h2>Lab 7 — Dissecting LabFlow’s HTTP stack</h2>
<p class="lead">LabFlow’s HTTP stack is due for an audit, and an incident is forcing the issue. The audit wants proof the site serves HTTP/1.1, 2 and 3 correctly, with caching, compression and security headers in place — not a vague “it’s on HTTP/2.” The incident: during a traffic spike the rate limiter returned 429 to <em>everyone</em>, and the logs show a single IP for every request. This lab reads the whole stack across its three versions, verifies the headers that control behaviour, and tracks the 429 to its root — the real client IP lost behind a proxy. Everything is in Chapter 7.</p>

<h3>What you get</h3>
<ul>
<li>nginx serving <strong>HTTP/1.1</strong> (port 80), <strong>HTTP/2 + HTTP/3</strong> (TLS 8443, with gzip/HSTS/CORS/ETag), a chunked streaming endpoint, and a <strong>two-hop proxy chain</strong>.</li>
<li>The tools: <code>nc</code>, <code>curl -v/-I</code>, <code>tshark</code> + <code>SSLKEYLOGFILE</code>, <code>ss</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 HTTP/1.1.</strong> Type a request with <code>nc</code> and label the status line, headers, blank line and body. Show keep-alive (<code>curl -v</code>) and a chunked response.</li>
<li><strong>R2 HTTP/2.</strong> Negotiate h2 (ALPN) and prove multiplexing: three requests on one connection as streams 1, 3, 5.</li>
<li><strong>R3 HTTP/3.</strong> Show the server listening on <strong>both</strong> UDP and TCP 8443, and the <code>Alt-Svc</code> header that advertises h3.</li>
<li><strong>R4 Headers.</strong> Get a <code>304</code> from an ETag, show <code>Content-Encoding: gzip</code>, and find HSTS. Explain each.</li>
<li><strong>R5 CORS.</strong> Send a preflight <code>OPTIONS</code> and read the <code>Access-Control-Allow-*</code> response. State who enforces CORS.</li>
<li><strong>R6 Real client IP.</strong> Compare one proxy vs two: read the <code>X-Forwarded-For</code> chain, explain why the app sees the proxy, and diagnose + fix the 429.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>1.5</td><td>hand-typed request; message parts labelled; keep-alive + chunked shown</td></tr>
<tr><td>R2</td><td>1.5</td><td>h2 negotiated via ALPN; streams 1, 3, 5 on one connection</td></tr>
<tr><td>R3</td><td>1.5</td><td>UDP + TCP listeners; <code>Alt-Svc</code>; the h1→h2→h3 upgrade explained</td></tr>
<tr><td>R4</td><td>1.5</td><td>a 304 from an ETag; gzip measured; HSTS present</td></tr>
<tr><td>R5</td><td>2</td><td>preflight OPTIONS + Allow-* ; CORS is a browser rule, fixed on the server</td></tr>
<tr><td>R6</td><td>2</td><td>XFF chain read; the 429 attributed to the wrong IP; the trust-proxy fix</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>printf 'GET / HTTP/1.1\\r\\nHost: labflow.test\\r\\nConnection: close\\r\\n\\r\\n' | nc 10.10.2.10 80</code>; chunked: <code>nc 10.10.2.20 4100</code>.</li>
<li>R2: capture with <code>SSLKEYLOGFILE</code>, decrypt with <code>tshark -o tls.keylog_file:… -Y http2.type==1</code>.</li>
<li>R3: <code>ss -ulnp</code> / <code>ss -tlnp</code> for 8443; <code>curl -sk --http2 -D -</code> for <code>Alt-Svc</code>.</li>
<li>R4: <code>curl -I</code> the static file for the ETag, then <code>-H 'If-None-Match: &lt;etag&gt;'</code>; <code>--compressed</code> for gzip.</li>
<li>R6: <code>curl http://10.10.2.10/api/who</code> (one proxy) vs <code>http://10.10.2.10:8090/api/who</code> (two) — read <code>forwardedFor</code>.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — HTTP/1.1 is text: status line, headers, blank line, body. Keep-alive reuses the connection; a streamed body is chunked:</p>
${run('c71-raw', 'printf', 1)}
${run('c71-keepalive', 'curl', 1)}
${run('c71-chunked', 'printf', 1, { max: 8 })}
<p><strong>R2</strong> — HTTP/2 is negotiated by ALPN, and three requests multiplex on one connection as streams 1, 3, 5:</p>
${run('c72-alpn', 'curl', 1)}
${run('c72-mux', 'tshark', 1)}
<p><strong>R3</strong> — HTTP/3: the same nginx listens on UDP (QUIC) and TCP (h1/h2) on 8443, and advertises h3 with Alt-Svc:</p>
${run('c73-server', 'ss -ulnp', 1, { cut: 100 })}
${run('c73-server', 'curl -sk --http2 -o /dev/null -D - https', 1)}
<p><strong>R4</strong> — headers: an ETag gives a 304 (no re-download), gzip shrinks the body, HSTS forces HTTPS:</p>
${run('c74-cache', 'curl -sk -o /dev/null -w', 1)}
${run('c74-gzip', 'curl -sk --compressed -D - -o /dev/null', 1)}
${run('c74-cors', 'curl -sk -D - -o /dev/null https', 1)}
<p><strong>R5</strong> — CORS: the preflight OPTIONS returns the Access-Control-Allow-* headers; the browser (not the server) enforces them:</p>
${run('c74-cors', 'curl -sk -X OPTIONS', 1, { max: 6 })}
<p><strong>R6</strong> — the real client IP. Through one proxy the app sees the proxy (<code>seenFrom</code>) with the client in <code>X-Forwarded-For</code>; through two, XFF is a list:</p>
${run('c75-xff', 'curl', 1, { max: 8 })}
${run('c75-chain', 'curl', 1, { max: 8 })}
<p><strong>The 429 diagnosis and fix:</strong> the rate limiter keyed on the wrong XFF entry — the <em>proxy’s</em> IP, shared by all users — so one busy user’s burst banned everyone. Fix: configure <code>trust proxy</code> (the number of front proxies) or read <code>CF-Connecting-IP</code> so the limiter keys on the <strong>real client IP</strong>, and test from behind the real proxy chain, not against the origin.</p>

<h3>Going further</h3>
<ul>
<li>Load a page with many small assets over HTTP/1.1 vs HTTP/2 and explain the speed difference (the 6-connection limit vs multiplexing).</li>
<li>Add a <code>Content-Security-Policy</code> and a stricter <code>Cache-Control</code>, and verify with <code>curl -I</code>.</li>
<li><strong>Course project:</strong> the whole HTTP stack returns in the Chapter 13 request-path capstone — keep your R4 header checklist and R6 trust-proxy fix.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7 · Dự án xuyên khoá phần 7</span>
<h2>Lab 7 — Mổ xẻ ngăn xếp HTTP của LabFlow</h2>
<p class="lead">Ngăn xếp HTTP của LabFlow tới hạn kiểm toán, và một sự cố đang buộc phải làm. Cuộc kiểm toán muốn bằng chứng site phục vụ HTTP/1.1, 2 và 3 đúng, với các header cache, nén và bảo mật đặt tại chỗ — không phải một câu mơ hồ “chạy HTTP/2.” Sự cố: trong một đợt dồn lưu lượng bộ giới hạn tốc độ trả 429 cho <em>mọi người</em>, và log hiện một IP duy nhất cho mọi yêu cầu. Lab này đọc cả ngăn xếp qua ba phiên bản, kiểm các header điều khiển hành vi, và truy 429 tới gốc — IP client thật bị mất sau một proxy. Mọi thứ đều có trong Chương 7.</p>

<h3>Bạn được gì</h3>
<ul>
<li>nginx phục vụ <strong>HTTP/1.1</strong> (cổng 80), <strong>HTTP/2 + HTTP/3</strong> (TLS 8443, với gzip/HSTS/CORS/ETag), một điểm cuối phát dòng chia khúc, và một <strong>chuỗi proxy hai chặng</strong>.</li>
<li>Bộ công cụ: <code>nc</code>, <code>curl -v/-I</code>, <code>tshark</code> + <code>SSLKEYLOGFILE</code>, <code>ss</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 HTTP/1.1.</strong> Gõ một yêu cầu với <code>nc</code> và gắn nhãn dòng trạng thái, header, dòng trống và thân. Cho thấy keep-alive (<code>curl -v</code>) và một câu trả lời chia khúc.</li>
<li><strong>R2 HTTP/2.</strong> Thương lượng h2 (ALPN) và chứng minh ghép kênh: ba yêu cầu trên một kết nối dưới dạng stream 1, 3, 5.</li>
<li><strong>R3 HTTP/3.</strong> Cho thấy máy chủ nghe trên <strong>cả</strong> UDP và TCP 8443, và header <code>Alt-Svc</code> quảng cáo h3.</li>
<li><strong>R4 Header.</strong> Lấy một <code>304</code> từ một ETag, cho thấy <code>Content-Encoding: gzip</code>, và tìm HSTS. Giải thích mỗi cái.</li>
<li><strong>R5 CORS.</strong> Gửi một preflight <code>OPTIONS</code> và đọc câu trả lời <code>Access-Control-Allow-*</code>. Nói ai thi hành CORS.</li>
<li><strong>R6 IP client thật.</strong> So một proxy với hai: đọc chuỗi <code>X-Forwarded-For</code>, giải thích vì sao app thấy proxy, và chẩn đoán + sửa 429.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>1.5</td><td>yêu cầu gõ tay; các phần thông điệp có nhãn; keep-alive + chunked</td></tr>
<tr><td>R2</td><td>1.5</td><td>h2 thương lượng qua ALPN; stream 1, 3, 5 trên một kết nối</td></tr>
<tr><td>R3</td><td>1.5</td><td>socket nghe UDP + TCP; <code>Alt-Svc</code>; cú nâng h1→h2→h3 giải thích</td></tr>
<tr><td>R4</td><td>1.5</td><td>một 304 từ một ETag; gzip đo được; HSTS có mặt</td></tr>
<tr><td>R5</td><td>2</td><td>preflight OPTIONS + Allow-* ; CORS là luật trình duyệt, sửa ở máy chủ</td></tr>
<tr><td>R6</td><td>2</td><td>chuỗi XFF đọc; 429 gán cho IP sai; cách sửa trust-proxy</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>printf 'GET / HTTP/1.1\\r\\nHost: labflow.test\\r\\nConnection: close\\r\\n\\r\\n' | nc 10.10.2.10 80</code>; chunked: <code>nc 10.10.2.20 4100</code>.</li>
<li>R2: bắt với <code>SSLKEYLOGFILE</code>, giải mã với <code>tshark -o tls.keylog_file:… -Y http2.type==1</code>.</li>
<li>R3: <code>ss -ulnp</code> / <code>ss -tlnp</code> cho 8443; <code>curl -sk --http2 -D -</code> cho <code>Alt-Svc</code>.</li>
<li>R4: <code>curl -I</code> tệp tĩnh lấy ETag, rồi <code>-H 'If-None-Match: &lt;etag&gt;'</code>; <code>--compressed</code> cho gzip.</li>
<li>R6: <code>curl http://10.10.2.10/api/who</code> (một proxy) so với <code>http://10.10.2.10:8090/api/who</code> (hai) — đọc <code>forwardedFor</code>.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — HTTP/1.1 là văn bản: dòng trạng thái, header, dòng trống, thân. Keep-alive dùng lại kết nối; một thân phát dòng là chunked:</p>
${run('c71-raw', 'printf', 1)}
${run('c71-keepalive', 'curl', 1)}
${run('c71-chunked', 'printf', 1, { max: 8 })}
<p><strong>R2</strong> — HTTP/2 thương lượng bằng ALPN, và ba yêu cầu ghép trên một kết nối dưới dạng stream 1, 3, 5:</p>
${run('c72-alpn', 'curl', 1)}
${run('c72-mux', 'tshark', 1)}
<p><strong>R3</strong> — HTTP/3: cùng nginx nghe trên UDP (QUIC) và TCP (h1/h2) trên 8443, và quảng cáo h3 bằng Alt-Svc:</p>
${run('c73-server', 'ss -ulnp', 1, { cut: 100 })}
${run('c73-server', 'curl -sk --http2 -o /dev/null -D - https', 1)}
<p><strong>R4</strong> — header: một ETag cho một 304 (không tải lại), gzip co thân, HSTS ép HTTPS:</p>
${run('c74-cache', 'curl -sk -o /dev/null -w', 1)}
${run('c74-gzip', 'curl -sk --compressed -D - -o /dev/null', 1)}
${run('c74-cors', 'curl -sk -D - -o /dev/null https', 1)}
<p><strong>R5</strong> — CORS: preflight OPTIONS trả các header Access-Control-Allow-*; trình duyệt (không phải máy chủ) thi hành:</p>
${run('c74-cors', 'curl -sk -X OPTIONS', 1, { max: 6 })}
<p><strong>R6</strong> — IP client thật. Qua một proxy app thấy proxy (<code>seenFrom</code>) với client trong <code>X-Forwarded-For</code>; qua hai, XFF là một danh sách:</p>
${run('c75-xff', 'curl', 1, { max: 8 })}
${run('c75-chain', 'curl', 1, { max: 8 })}
<p><strong>Chẩn đoán và sửa 429:</strong> bộ giới hạn tốc độ khoá theo mục XFF sai — IP của <em>proxy</em>, dùng chung bởi mọi người dùng — nên một loạt của một người dùng bận cấm tất cả. Sửa: cấu hình <code>trust proxy</code> (số proxy trước) hoặc đọc <code>CF-Connecting-IP</code> để bộ giới hạn khoá theo <strong>IP client thật</strong>, và thử từ sau chuỗi proxy thật, không phải với origin.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Tải một trang có nhiều tài nguyên nhỏ qua HTTP/1.1 so với HTTP/2 và giải thích khác biệt tốc độ (giới hạn 6 kết nối so với ghép kênh).</li>
<li>Thêm một <code>Content-Security-Policy</code> và một <code>Cache-Control</code> chặt hơn, và kiểm với <code>curl -I</code>.</li>
<li><strong>Dự án xuyên khoá:</strong> cả ngăn xếp HTTP quay lại trong dự án đường-request Chương 13 — giữ bảng kiểm header R4 và cách sửa trust-proxy R6 của bạn.</li>
</ul>
</div>
`,
};
