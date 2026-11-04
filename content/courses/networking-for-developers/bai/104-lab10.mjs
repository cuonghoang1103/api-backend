/**
 * Chương 10 · Lab 10 — Dựng tầng cân bằng tải của LabFlow (phần 10 dự án xuyên khoá).
 * Lời giải dùng output thật: lab/out/c101-*, c102-*, c103-*, c104-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-10.mjs';

const L = card;
const PHIEU = `# Lab 10 report — <your name>, <date>

## R1 L4/L7 + round robin — forwardedFor L7 (client IP) vs L4 (null); the be1/be2/be3 rotation
## R2 Algorithm + health  — consistent hash: alice/bob each sticky; before vs after killing be2 (removed, request still served)
## R3 Proxy + tunnel      — reverse vs forward classified; socat tunnel localhost:7000 -> web:80 (HTTP 200)
## R4 Gateway codes       — 502 (dead upstream) + 504 (slow backend vs 1s timeout), each mapped to a backend cause`;

export default {
  title: 'Lab 10 — Building LabFlow’s load-balancing tier: balance, stick, heal, tunnel, read the codes|||Lab 10 — Dựng tầng cân bằng tải của LabFlow: chia, dính, chữa, hầm, đọc mã',
  slug: 'netdev-10-5-lab-lb-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10 · Course project part 10</span>
<h2>Lab 10 — Building LabFlow’s load-balancing tier</h2>
<p class="lead">LabFlow has outgrown a single server, so you are building the tier that lets it run on many. You will put a load balancer in front of a pool, prove on the wire whether it works at L7 or L4, make a user stick to one backend, survive a crash without a user noticing, reach a backend through a tunnel, and reproduce the 502 and 504 that appear when a backend breaks or stalls — then read each code correctly. Everything is in Chapter 10.</p>

<h3>What you get</h3>
<ul>
<li>Three identical <strong>backends</strong> (<code>10.10.2.20:3001-3003</code>) that echo their id.</li>
<li>An <strong>L7</strong> nginx load balancer (<code>:8080</code>, round robin + passive health + <code>/slow</code> timeout), an <strong>nginx hash</strong> server (<code>:8081</code>), and an <strong>L4</strong> socat forwarder (<code>:9090</code>).</li>
<li>A dead-upstream port (<code>:8082</code>) for the 502. Bring it all up with <code>bash lab/code/dung-output-ch10.sh</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 L4/L7 + round robin.</strong> Show <code>X-Forwarded-For</code> through L7 but <code>null</code> through L4, and the pool rotating round robin.</li>
<li><strong>R2 Algorithm + health.</strong> Show consistent hashing sticking a user, then kill a backend and show it removed while the request still succeeds.</li>
<li><strong>R3 Proxy + tunnel.</strong> Classify a reverse vs a forward proxy, and prove a socat tunnel reaches a backend.</li>
<li><strong>R4 Gateway codes.</strong> Reproduce <code>502</code> (dead upstream) and <code>504</code> (slow backend); map each to its backend cause.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>2.5</td><td><code>X-Forwarded-For</code> via L7 vs <code>null</code> via L4; round robin shown</td></tr>
<tr><td>R2</td><td>3</td><td>consistent hash sticky; a killed backend removed, request still served</td></tr>
<tr><td>R3</td><td>2</td><td>reverse/forward classified; tunnel reaches <code>web:80</code></td></tr>
<tr><td>R4</td><td>2.5</td><td><code>502</code> and <code>504</code> reproduced and each mapped to a backend cause</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>curl :8080/</code> (L7) vs <code>:9090/</code> (L4); loop <code>:8080/</code> six times for the rotation.</li>
<li>R2: <code>:8081/?user=alice</code> vs <code>?user=bob</code>; <code>docker exec nfd-api pkill -f 'backend.mjs be2'</code>, then re-loop <code>:8080/</code>.</li>
<li>R3: <code>socat TCP-LISTEN:7000,fork TCP:10.10.2.10:80 &</code> then <code>curl -I localhost:7000</code>.</li>
<li>R4: <code>:8082/</code> for 502; <code>:8080/slow</code> for 504.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — L7 (nginx) parses HTTP and adds <code>X-Forwarded-For</code> (the client IP); L4 (socat) forwards bytes blindly, so <code>forwardedFor</code> is <code>null</code>. And six requests rotate round robin across the pool:</p>
${run('c101-l4l7', 'curl', 2)}
${run('c101-rr', 'for i', 1)}
<p><strong>R2</strong> — consistent hashing keeps <code>alice</code> on one backend and <code>bob</code> on another; then killing <code>be2</code> removes it from the pool (only <code>be1</code>/<code>be3</code> answer), and the request that hit the dead backend was retried, so the user saw no error:</p>
${run('c102-hash', 'for i', 2)}
${run('c102-health-before', 'for i', 1)}
${run('c102-health-after', 'for i', 1)}
<p><strong>R3</strong> — the nginx in front of the backends is a <strong>reverse proxy</strong> (fronts the servers); a corporate internet filter is a <strong>forward proxy</strong> (fronts the clients). A socat <strong>tunnel</strong> forwards a local port straight to the web server:</p>
${run('c103-tunnel', 'curl', 1)}
<p><strong>R4</strong> — a dead upstream yields <code>502</code> (the proxy could not connect to any backend); a slow backend against a 1 s timeout yields <code>504</code>:</p>
${run('c104-codes', 'curl', 2)}
<p>Map: <code>502</code> = backend broken/absent to connect to, <code>504</code> = backend up but too slow, <code>503</code> = no healthy backend, <code>524</code> = Cloudflare's ~100 s edge timeout.</p>

<h3>Going further</h3>
<ul>
<li>Switch the upstream to <code>least_conn</code> and send a few slow requests; reason about how the distribution differs from round robin.</li>
<li>Add an active <code>/health</code> check idea: what should it test besides "the process is up"?</li>
<li><strong>Course project:</strong> the load-balancing tier returns in the Chapter 13 request-path capstone — keep your L4/L7 decision and your gateway-code map.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10 · Dự án xuyên khoá phần 10</span>
<h2>Lab 10 — Dựng tầng cân bằng tải của LabFlow</h2>
<p class="lead">LabFlow đã vượt quá một máy chủ, nên bạn đang dựng tầng cho nó chạy trên nhiều máy. Bạn sẽ đặt một bộ cân bằng tải trước một dàn máy, chứng minh trên dây nó chạy ở L7 hay L4, làm một người dùng dính một backend, sống sót một lần sập mà người dùng không để ý, với tới một backend qua một đường hầm, và tái hiện 502 và 504 xuất hiện khi một backend hỏng hay kẹt — rồi đọc đúng mỗi mã. Mọi thứ đều có trong Chương 10.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Ba <strong>backend</strong> giống nhau (<code>10.10.2.20:3001-3003</code>) echo mã của chúng.</li>
<li>Một bộ cân bằng tải nginx <strong>L7</strong> (<code>:8080</code>, round robin + kiểm bị động + timeout <code>/slow</code>), một máy chủ <strong>nginx hash</strong> (<code>:8081</code>), và một bộ chuyển tiếp socat <strong>L4</strong> (<code>:9090</code>).</li>
<li>Một cổng upstream chết (<code>:8082</code>) cho 502. Dựng tất cả bằng <code>bash lab/code/dung-output-ch10.sh</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 L4/L7 + round robin.</strong> Cho thấy <code>X-Forwarded-For</code> qua L7 nhưng <code>null</code> qua L4, và dàn xoay round robin.</li>
<li><strong>R2 Thuật toán + sức khoẻ.</strong> Cho thấy băm nhất quán dính một người dùng, rồi giết một backend và cho thấy nó bị gỡ trong khi yêu cầu vẫn thành công.</li>
<li><strong>R3 Proxy + đường hầm.</strong> Phân loại một reverse so với một forward proxy, và chứng minh một đường hầm socat với tới một backend.</li>
<li><strong>R4 Mã cổng.</strong> Tái hiện <code>502</code> (upstream chết) và <code>504</code> (backend chậm); ánh xạ mỗi cái tới nguyên nhân backend của nó.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>2.5</td><td><code>X-Forwarded-For</code> qua L7 so với <code>null</code> qua L4; round robin hiện</td></tr>
<tr><td>R2</td><td>3</td><td>băm nhất quán dính; một backend bị giết được gỡ, yêu cầu vẫn được phục vụ</td></tr>
<tr><td>R3</td><td>2</td><td>reverse/forward phân loại; đường hầm với tới <code>web:80</code></td></tr>
<tr><td>R4</td><td>2.5</td><td><code>502</code> và <code>504</code> tái hiện và mỗi cái ánh xạ tới một nguyên nhân backend</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>curl :8080/</code> (L7) so với <code>:9090/</code> (L4); lặp <code>:8080/</code> sáu lần cho vòng xoay.</li>
<li>R2: <code>:8081/?user=alice</code> so với <code>?user=bob</code>; <code>docker exec nfd-api pkill -f 'backend.mjs be2'</code>, rồi lặp lại <code>:8080/</code>.</li>
<li>R3: <code>socat TCP-LISTEN:7000,fork TCP:10.10.2.10:80 &</code> rồi <code>curl -I localhost:7000</code>.</li>
<li>R4: <code>:8082/</code> cho 502; <code>:8080/slow</code> cho 504.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — L7 (nginx) phân tích HTTP và thêm <code>X-Forwarded-For</code> (IP client); L4 (socat) chuyển byte mù, nên <code>forwardedFor</code> là <code>null</code>. Và sáu yêu cầu xoay round robin qua dàn máy:</p>
${run('c101-l4l7', 'curl', 2)}
${run('c101-rr', 'for i', 1)}
<p><strong>R2</strong> — băm nhất quán giữ <code>alice</code> trên một backend và <code>bob</code> trên một cái khác; rồi giết <code>be2</code> gỡ nó khỏi dàn (chỉ <code>be1</code>/<code>be3</code> trả lời), và yêu cầu đụng backend chết được thử lại, nên người dùng không thấy lỗi:</p>
${run('c102-hash', 'for i', 2)}
${run('c102-health-before', 'for i', 1)}
${run('c102-health-after', 'for i', 1)}
<p><strong>R3</strong> — nginx trước các backend là một <strong>reverse proxy</strong> (đứng trước máy chủ); một bộ lọc internet công ty là một <strong>forward proxy</strong> (đứng trước client). Một <strong>đường hầm</strong> socat chuyển tiếp một cổng cục bộ thẳng tới máy chủ web:</p>
${run('c103-tunnel', 'curl', 1)}
<p><strong>R4</strong> — một upstream chết cho <code>502</code> (proxy không nối được tới backend nào); một backend chậm so với một timeout 1 giây cho <code>504</code>:</p>
${run('c104-codes', 'curl', 2)}
<p>Ánh xạ: <code>502</code> = backend hỏng/vắng để nối tới, <code>504</code> = backend chạy nhưng quá chậm, <code>503</code> = không backend khoẻ, <code>524</code> = timeout biên ~100 giây của Cloudflare.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Đổi upstream sang <code>least_conn</code> và gửi vài yêu cầu chậm; lập luận phân phối khác round robin thế nào.</li>
<li>Thêm một ý kiểm <code>/health</code> chủ động: nó nên kiểm gì ngoài "tiến trình đang chạy"?</li>
<li><strong>Dự án xuyên khoá:</strong> tầng cân bằng tải quay lại trong dự án đường-request Chương 13 — giữ quyết định L4/L7 và bản đồ mã cổng của bạn.</li>
</ul>
</div>
`,
};
