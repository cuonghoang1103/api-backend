/**
 * Chương 10 · 10.3 — Reverse proxy, forward proxy và đường hầm (slug khung netdev-10-3-reverse-forward). Sự cố thật: cổng 22 bị chặn → SSH 993.
 * Output thật: lab/out/c103-*.out.txt (dựng lại: bash lab/code/dung-output-ch10.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-10-3.mjs';

const L = card;
const LNX = { mon: 'Linux & Bash', khoa: 'linux-bash' };

export default {
  title: '10.3 — Reverse proxy, forward proxy and tunnels|||10.3 — Reverse proxy, forward proxy và đường hầm',
  slug: 'netdev-10-3-reverse-forward',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Proxy = hộp ở giữa thay mặt ai đó ra yêu cầu; ai đó là ai mới quan trọng. Reverse proxy đứng trước MÁY CHỦ (nginx/CDN: TLS, cân bằng tải, cache — một địa chỉ cho nhiều backend). Forward proxy đứng trước CLIENT (cổng ra công ty: lọc, log, cache — đích thấy proxy). Cùng máy, việc ngược nhau. Đường hầm (tunnel) mang một kết nối QUA một ranh giới — đo thật bằng socat (cổng cục bộ hiện ra ở nơi khác). Sự cố thật: cổng 22 bị chặn ⇒ SSH chạy cổng 993.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Reverse proxy, forward proxy and tunnels</h2>
<p class="lead">"Proxy" is one of the most overloaded words in networking, and the confusion is almost always the same: in front of whom? A reverse proxy and a forward proxy are the same kind of machine — a middle box that makes a request on someone's behalf — pointed in opposite directions. Once you see which <em>side</em> each one fronts, the rest is obvious. This lesson draws that line, then looks at tunnels: a pipe that carries a connection straight through a boundary, which you'll measure, and which fixed a real outage when a firewall blocked a port.</p>

<h3>Reverse proxy: in front of the servers</h3>
<p>A <strong>reverse proxy</strong> stands in front of your backends and answers the client on their behalf. You have been studying one for four chapters: nginx terminating TLS, load balancing, caching, adding <code>X-Forwarded-For</code>. The shape is <em>clients → reverse proxy → your backends</em>. It fronts the <strong>servers</strong> — giving them one public address, TLS, caching and load balancing — and the client never knows how many machines are behind it. nginx, HAProxy, Envoy, Cloudflare and every CDN are reverse proxies.</p>

<h3>Forward proxy: in front of the clients</h3>
<p>A <strong>forward proxy</strong> stands in front of a group of <strong>clients</strong> and makes their outbound requests for them. A company routes all employee traffic through one to filter, log or cache it; the destination server sees the proxy, not the employee. The shape is <em>your clients → forward proxy → the internet</em>. A corporate egress proxy, Squid, and a VPN gateway are forward proxies.</p>

<h3>Same machine, opposite jobs</h3>
${kv([
  ['Reverse proxy', 'Fronts the SERVERS. Hides how many backends and which one. Configured by the service owner. You meet it as nginx/CDN in front of your app.'],
  ['Forward proxy', 'Fronts the CLIENTS. Hides who the real client is. Configured by the client’s network. You meet it as a corporate/egress proxy.'],
])}
<p>Both are "a proxy." The only question that ever matters is <strong>which side it fronts</strong> — the servers (reverse) or the clients (forward). Keep that straight and the word stops being confusing.</p>

<h3>A tunnel: a pipe through a boundary</h3>
<p>A <strong>tunnel</strong> carries a connection from one point to another <em>through</em> whatever is in between. The simplest possible one: <code>socat</code> opens a local port and forwards it elsewhere.</p>
${run('c103-tunnel', 'socat', 3)}
<p>A request to <code>localhost:7000</code> on the client comes out at <code>web:80</code> — <code>HTTP 200</code>, <code>Server: nginx</code> — as if the web server were running locally. That is exactly what an <strong>SSH tunnel</strong> (<code>ssh -L 7000:web:80 host</code>) or a <strong>Cloudflare Tunnel</strong> does: a local port that, when you touch it, emerges somewhere else entirely, often encrypted and across a network boundary.</p>

<div class="pitfall co-tieu-de">
<p><strong>A protocol is not tied to its usual port — when a port is blocked, carry it over one that is open.</strong> Real outage: a school network allowed only outbound <code>80/443/587/993</code>. Port 22 was blocked, so <code>ssh vps</code> — and the home machine that tunnelled through it — went dark. The obvious "fix" of adding <code>Port 993</code> to <code>sshd_config</code> and reloading did <em>nothing</em> on Ubuntu 24.04 (socket activation holds the port; the generator only applies <code>Port</code> after <code>daemon-reload</code> + <code>restart ssh.socket</code>, and <code>Port 993</code> alone <em>replaces</em> 22 rather than adding). The safe fix was a <strong>second, independent SSH listener</strong> on port 993 (<code>ssh993.service</code>, <code>sshd -D -p 993</code>) beside the normal one — so port 22 stays untouched and a tunnel to the home machine never drops. A Cloudflare Tunnel avoids the problem entirely: it is outbound-only, opening <em>no</em> inbound port. The general move is always the same — the protocol can ride any port that is actually allowed out.</p>
</div>
${cauNoi('en', { ...LNX, bai: 'lnx-9-3-ssh', so: '9.3', ten: 'SSH: keys, config and tunnels', giong: 'SSH tunnels / local port forwarding to reach a remote service', khac: 'the Linux & Bash course drives SSH from the shell: keys, ~/.ssh/config, -L/-R forwards', them: 'the proxy taxonomy around it — reverse vs forward, a tunnel measured on the wire, and the port-22-blocked outage and its fix' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> sort out three "proxies" a colleague is confused about, and prove a tunnel works.</p>
<ol>
<li>For each — the nginx in front of your API, your company's internet filter, and <code>ssh -L</code> to a database — say whether it is a reverse proxy, a forward proxy, or a tunnel, and which side it fronts.</li>
<li>On the lab, run the socat tunnel and confirm that <code>localhost:7000</code> reaches <code>web:80</code>. Explain what emerged where.</li>
<li>State in one line why adding <code>Port 993</code> to <code>sshd_config</code> + reload did not work, and what did.</li>
</ol>
<p><strong>Done when:</strong> you label the nginx as a reverse proxy (fronts servers), the company filter as a forward proxy (fronts clients), and <code>ssh -L</code> as a tunnel; your socat test shows a local port emerging at the web server; and you can say the independent <code>ssh993.service</code> listener (not a <code>sshd_config</code> reload) carried SSH over the allowed port.</p>
<details><summary>Solution</summary>
<p>nginx in front of the API = reverse proxy (fronts the servers). The company filter = forward proxy (fronts the clients; the destination sees the proxy). <code>ssh -L</code> = a tunnel (a local port forwarded to a remote service). The socat test shows a request to <code>localhost:7000</code> arriving at <code>web:80</code> (HTTP 200, <code>Server: nginx</code>). The <code>sshd_config</code> reload failed because socket activation owns the port (and <code>Port 993</code> alone replaces 22); a separate <code>ssh993.service</code> listener on the allowed port 993 fixed it without touching port 22.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Reverse proxy', 'A proxy in front of your servers (nginx/CDN: TLS, LB, cache).'],
  ['Forward proxy', 'A proxy in front of the clients (corporate egress, filter, cache).'],
  ['Tunnel', 'A pipe that carries a connection through a boundary.'],
  ['Local port forward', 'ssh -L: a local port that emerges at a remote service.'],
  ['Cloudflare Tunnel', 'Expose a local service outbound-only, with no inbound port.'],
  ['socket activation', 'systemd holding a port and handing the fd to the service (owns the Port).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A <strong>reverse proxy</strong> fronts your <strong>servers</strong> (nginx/CDN: TLS, load balancing, caching) — one address for many backends.</li>
<li>A <strong>forward proxy</strong> fronts the <strong>clients</strong> (corporate egress: filter, log, cache) — the destination sees the proxy.</li>
<li>Same machine, opposite jobs — the only question is <strong>which side</strong> it fronts.</li>
<li>A <strong>tunnel</strong> carries a connection through a boundary — a request to a local port emerges elsewhere (measured).</li>
<li>Real outage: port 22 blocked → SSH on port 993; a protocol can ride any <strong>allowed</strong> port.</li>
</ul>
${L('https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/', '📘', 'Cloudflare — Reverse proxy vs forward proxy', 'The direction that distinguishes them, with diagrams.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Proxy_servers_and_tunneling', '📘', 'MDN — Proxy servers and tunneling', 'Forwarding, the CONNECT method, and how tunnels work.', 'Open')}
${L('https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/', '📘', 'Cloudflare Tunnel', 'Expose a local service with no inbound port (outbound-only).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Reverse proxy, forward proxy và đường hầm</h2>
<p class="lead">"Proxy" là một trong những chữ bị dùng chồng chất nhất trong mạng, và sự rối gần như luôn là một: đứng trước ai? Một reverse proxy và một forward proxy là cùng một loại máy — một hộp ở giữa thay mặt ai đó ra yêu cầu — chĩa theo hai hướng ngược nhau. Một khi bạn thấy mỗi cái đứng trước <em>phía</em> nào, phần còn lại hiển nhiên. Bài này vẽ ranh giới đó, rồi nhìn đường hầm: một ống mang một kết nối thẳng qua một ranh giới, cái bạn sẽ đo, và cái đã sửa một sự cố thật khi một tường lửa chặn một cổng.</p>

<h3>Reverse proxy: đứng trước máy chủ</h3>
<p>Một <strong>reverse proxy</strong> đứng trước các backend của bạn và trả lời client thay cho chúng. Bạn đã học một cái suốt bốn chương: nginx kết thúc TLS, cân bằng tải, cache, thêm <code>X-Forwarded-For</code>. Dáng là <em>client → reverse proxy → backend của bạn</em>. Nó đứng trước <strong>máy chủ</strong> — cho chúng một địa chỉ công cộng, TLS, cache và cân bằng tải — và client không bao giờ biết có bao nhiêu máy sau nó. nginx, HAProxy, Envoy, Cloudflare và mọi CDN là reverse proxy.</p>

<h3>Forward proxy: đứng trước client</h3>
<p>Một <strong>forward proxy</strong> đứng trước một nhóm <strong>client</strong> và ra các yêu cầu đi ra của chúng cho chúng. Một công ty định tuyến mọi lưu lượng nhân viên qua một cái để lọc, ghi log hay cache nó; máy chủ đích thấy proxy, không phải nhân viên. Dáng là <em>client của bạn → forward proxy → internet</em>. Một proxy cổng ra công ty, Squid, và một cổng VPN là forward proxy.</p>

<h3>Cùng máy, việc ngược nhau</h3>
${kv([
  ['Reverse proxy', 'Đứng trước MÁY CHỦ. Giấu có bao nhiêu backend và cái nào. Do chủ dịch vụ cấu hình. Bạn gặp nó như nginx/CDN trước app của bạn.'],
  ['Forward proxy', 'Đứng trước CLIENT. Giấu client thật là ai. Do mạng của client cấu hình. Bạn gặp nó như một proxy công ty/cổng ra.'],
])}
<p>Cả hai là "một proxy." Câu hỏi duy nhất từng quan trọng là <strong>nó đứng trước phía nào</strong> — máy chủ (reverse) hay client (forward). Giữ rõ điều đó và chữ này thôi gây rối.</p>

<h3>Một đường hầm: một ống qua một ranh giới</h3>
<p>Một <strong>đường hầm</strong> mang một kết nối từ một điểm tới một điểm khác <em>qua</em> bất cứ gì ở giữa. Cái đơn giản nhất có thể: <code>socat</code> mở một cổng cục bộ và chuyển tiếp nó đi nơi khác.</p>
${run('c103-tunnel', 'socat', 3)}
<p>Một yêu cầu tới <code>localhost:7000</code> trên client hiện ra ở <code>web:80</code> — <code>HTTP 200</code>, <code>Server: nginx</code> — như thể máy chủ web chạy cục bộ. Đó đúng là điều một <strong>hầm SSH</strong> (<code>ssh -L 7000:web:80 host</code>) hay một <strong>Cloudflare Tunnel</strong> làm: một cổng cục bộ mà, khi bạn chạm vào, hiện ra ở một nơi hoàn toàn khác, thường mã hoá và vượt một ranh giới mạng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một giao thức không buộc vào cổng thường của nó — khi một cổng bị chặn, mang nó qua một cổng đang mở.</strong> Sự cố thật: một mạng trường chỉ cho các cổng ra <code>80/443/587/993</code>. Cổng 22 bị chặn, nên <code>ssh vps</code> — và máy nhà đi hầm qua nó — tối đen. Cách "sửa" hiển nhiên là thêm <code>Port 993</code> vào <code>sshd_config</code> rồi reload KHÔNG làm gì trên Ubuntu 24.04 (socket activation giữ cổng; generator chỉ áp <code>Port</code> sau <code>daemon-reload</code> + <code>restart ssh.socket</code>, và <code>Port 993</code> một mình <em>thay</em> cổng 22 chứ không thêm). Cách sửa an toàn là một <strong>listener SSH thứ hai, độc lập</strong> trên cổng 993 (<code>ssh993.service</code>, <code>sshd -D -p 993</code>) bên cạnh cái thường — nên cổng 22 nguyên vẹn và một đường hầm tới máy nhà không bao giờ rớt. Một Cloudflare Tunnel né vấn đề hoàn toàn: nó chỉ ra, mở <em>không</em> cổng vào. Nước đi chung luôn là một — giao thức có thể đi trên bất kỳ cổng nào thật sự được phép ra.</p>
</div>
${cauNoi('vi', { ...LNX, bai: 'lnx-9-3-ssh', so: '9.3', ten: 'SSH: khoá, file cấu hình và đường hầm', giong: 'hầm SSH / chuyển tiếp cổng cục bộ để với tới một dịch vụ từ xa', khac: 'khoá Linux & Bash điều khiển SSH từ shell: khoá, ~/.ssh/config, chuyển tiếp -L/-R', them: 'bộ phân loại proxy quanh nó — reverse so với forward, một đường hầm đo trên dây, và sự cố cổng-22-bị-chặn cùng cách sửa' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> gỡ rối ba "proxy" một đồng nghiệp đang lẫn, và chứng minh một đường hầm chạy.</p>
<ol>
<li>Với mỗi cái — nginx trước API của bạn, bộ lọc internet của công ty, và <code>ssh -L</code> tới một cơ sở dữ liệu — nói nó là reverse proxy, forward proxy, hay một đường hầm, và nó đứng trước phía nào.</li>
<li>Trên lab, chạy đường hầm socat và xác nhận <code>localhost:7000</code> với tới <code>web:80</code>. Giải thích cái gì hiện ra ở đâu.</li>
<li>Nói một dòng vì sao thêm <code>Port 993</code> vào <code>sshd_config</code> + reload không chạy, và cái gì chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gắn nhãn nginx là một reverse proxy (đứng trước máy chủ), bộ lọc công ty là một forward proxy (đứng trước client), và <code>ssh -L</code> là một đường hầm; phép thử socat của bạn cho thấy một cổng cục bộ hiện ra ở máy chủ web; và bạn nói được listener <code>ssh993.service</code> độc lập (không phải một lần reload <code>sshd_config</code>) mang SSH qua cổng được phép.</p>
<details><summary>Lời giải</summary>
<p>nginx trước API = reverse proxy (đứng trước máy chủ). Bộ lọc công ty = forward proxy (đứng trước client; đích thấy proxy). <code>ssh -L</code> = một đường hầm (một cổng cục bộ chuyển tiếp tới một dịch vụ từ xa). Phép thử socat cho thấy một yêu cầu tới <code>localhost:7000</code> đến ở <code>web:80</code> (HTTP 200, <code>Server: nginx</code>). Lần reload <code>sshd_config</code> hỏng vì socket activation sở hữu cổng (và <code>Port 993</code> một mình thay 22); một listener <code>ssh993.service</code> riêng trên cổng 993 được phép đã sửa mà không đụng cổng 22.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Reverse proxy', 'Một proxy đứng trước máy chủ của bạn (nginx/CDN: TLS, LB, cache).'],
  ['Forward proxy', 'Một proxy đứng trước client (cổng ra công ty, lọc, cache).'],
  ['Đường hầm (tunnel)', 'Một ống mang một kết nối qua một ranh giới.'],
  ['Chuyển tiếp cổng cục bộ', 'ssh -L: một cổng cục bộ hiện ra ở một dịch vụ từ xa.'],
  ['Cloudflare Tunnel', 'Phơi một dịch vụ cục bộ chỉ-ra, không cổng vào.'],
  ['socket activation', 'systemd giữ một cổng và trao fd cho dịch vụ (sở hữu cổng Port).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <strong>reverse proxy</strong> đứng trước <strong>máy chủ</strong> của bạn (nginx/CDN: TLS, cân bằng tải, cache) — một địa chỉ cho nhiều backend.</li>
<li>Một <strong>forward proxy</strong> đứng trước <strong>client</strong> (cổng ra công ty: lọc, log, cache) — đích thấy proxy.</li>
<li>Cùng máy, việc ngược nhau — câu hỏi duy nhất là nó đứng trước <strong>phía</strong> nào.</li>
<li>Một <strong>đường hầm</strong> mang một kết nối qua một ranh giới — một yêu cầu tới một cổng cục bộ hiện ra ở nơi khác (đo thật).</li>
<li>Sự cố thật: cổng 22 bị chặn → SSH trên cổng 993; một giao thức có thể đi trên bất kỳ cổng <strong>được phép</strong> nào.</li>
</ul>
${L('https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/', '📘', 'Cloudflare — Reverse proxy so với forward proxy', 'Hướng phân biệt chúng, kèm sơ đồ.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Proxy_servers_and_tunneling', '📘', 'MDN — Proxy và đường hầm', 'Chuyển tiếp, method CONNECT, và đường hầm chạy thế nào.', 'Mở')}
${L('https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/', '📘', 'Cloudflare Tunnel', 'Phơi một dịch vụ cục bộ không cổng vào (chỉ-ra).', 'Mở')}
</div>
`,
};
