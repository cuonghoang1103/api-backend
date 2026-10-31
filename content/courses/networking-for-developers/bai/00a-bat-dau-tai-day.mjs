/**
 * Mục 0 · "Bắt đầu tại đây (1/2)" — mạng là gì, so sánh dễ nhầm, lịch sử có nguồn, vì sao ra đời, dùng làm gì,
 * giúp gì cho bạn, lộ trình khoá. Slug giữ nguyên từ khung (netdev-0-8-bat-dau-tai-day).
 * Output thật: lab/out/c00-internet.out.txt (container net-lab ra Internet thật, 31/10/2026).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-00-a.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: 'Start here (1/2) — What a network is, where the Internet came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Mạng là gì, Internet ra đời thế nào, và vì sao nó quan trọng với bạn',
  slug: 'netdev-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mạng bằng hình ảnh bưu kiện, những cặp thuật ngữ hay nhầm, bảy mốc lịch sử có nguồn, vì sao Internet ra đời và lập trình viên dùng mạng vào việc gì mỗi tuần.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What a network is, where the Internet came from, and why it matters to you</h2>
<p class="lead">Hello, and welcome. Maybe you have already hit one of these: your API runs perfectly on your laptop, but your teammate's phone cannot reach it; the deployed site shows "502 Bad Gateway" and you have no idea which box is guilty; an interviewer asks "what happens when you type a URL and press Enter?" and you recite seven OSI layers without being able to say what any of them <em>does</em>. This course is for exactly that moment. We start from zero — what a network even is — and by the end you will be able to follow a single request through every machine, layer and byte, and measure each step.</p>

<h3>A network in everyday words: parcels, addresses, post offices</h3>
<p>Imagine you want to send a book to a friend in another city. You do not carry it yourself. You put it in a box, write the address on the outside, and hand it to the post office. The post office does not open the box; it reads the address, decides which sorting centre is the next step, and passes it on. Each sorting centre does the same — read the address, pick the next step, pass it on — until a courier rings your friend's doorbell. Your friend opens the box and reads the book.</p>
<p>A computer network works the same way:</p>
<ul>
<li>Your program's data (a web request, a chat message, a database query) is cut into small chunks. Each chunk gets a <strong>header</strong> written in front of it — the label on the box. A chunk plus its header is a <strong>packet</strong>.</li>
<li>The header carries an <strong>IP address</strong>: which machine the packet is for, anywhere in the world — the street address.</li>
<li>It also carries a <strong>port number</strong>: which program on that machine should receive it — like the flat number in an apartment building. A web server usually waits at port 443 (HTTPS) or 80 (HTTP).</li>
<li><strong>Routers</strong> are the sorting centres: they read only the address and forward the packet one step closer. They do not read your data.</li>
<li>Cables, Wi-Fi, fibre and mobile networks are the roads and trucks: they carry bits, nothing more.</li>
<li>People remember names, not numbers, so a phone-book service called <strong>DNS</strong> turns <code>cuongthai.com</code> into an address such as <code>160.187.1.208</code>.</li>
</ul>
<p>Here is that last step, for real — the name looked up, then three small "are you there?" packets (ping) sent to the address and timed:</p>
${run('c00-internet', 'dig +short')}
${run('c00-internet', 'ping -c 3')}
<p>Three packets went out, three came back, each round trip took 7–10 milliseconds. That is the whole idea of a network in one command. The rest of the course is about what happens inside those 7 milliseconds — and what goes wrong.</p>

<h3>Devices, links, protocols — and the Internet</h3>
<p>Every network, from two laptops on one Wi-Fi to the whole Internet, has three ingredients:</p>
<ul>
<li><strong>Devices.</strong> End devices (your laptop, a phone, a server) and devices in the middle. A <strong>switch</strong> connects machines inside one local network; a <strong>router</strong> connects one network to another. Your home Wi-Fi box is usually both, plus a few other things.</li>
<li><strong>Links.</strong> Copper cable (electric pulses), fibre (pulses of light), Wi-Fi and 4G/5G (radio waves). A link only knows how to move bits from one end to the other.</li>
<li><strong>Protocols.</strong> The rules both sides follow: how to start a conversation, how big a packet may be, how an address is written, what to do if a packet is lost. Without shared rules, the bits on the wire mean nothing.</li>
</ul>
<p>The <strong>Internet</strong> is not one network owned by someone. It is tens of thousands of separately owned networks — homes, universities, mobile operators like Viettel, cloud providers, the data centre that hosts cuongthai.com — that agree to carry each other's packets. They can, because they all speak the same family of protocols: <strong>TCP/IP</strong>. That is why "inter-net": a network between networks.</p>
${net('waterfall', 'cold', 'en', 'One real request to cuongthai.com, stage by stage — press Play, then try the "warm" preset.')}

<h3>The pairs everybody confuses</h3>
<p>Half of the confusion beginners feel comes from six pairs of words that sound alike. Separate them once and many explanations suddenly make sense:</p>
<table>
<thead><tr><th>Pair</th><th>The difference</th><th>Why a developer cares</th></tr></thead>
<tbody>
<tr><td>Internet / Web</td><td>The Internet is the network of networks. The Web is one service on it (web pages over HTTP).</td><td>Email, SSH, database connections and game servers use the Internet but not the Web. "The site is down" and "the network is down" are different bugs.</td></tr>
<tr><td>IP address / MAC address</td><td>IP = the address for the whole journey. MAC = the hardware address of a network card, valid on one hop only.</td><td>The IP stays the same from your laptop to the server; the MAC is rewritten at every router (we capture this in lesson 1.4).</td></tr>
<tr><td>TCP / HTTP</td><td>TCP is the delivery service that makes sure bytes arrive in order. HTTP is the language your request is written in.</td><td>"Connection refused" is a TCP problem; "404 Not Found" is an HTTP answer — the connection worked fine.</td></tr>
<tr><td>Domain name / IP address</td><td>A name people remember vs the number machines route on. DNS translates.</td><td>You can change the server behind a name without telling users — but caches remember the old number for a while (Chapter 3).</td></tr>
<tr><td>Bandwidth / latency</td><td>How much data per second vs how long one trip takes.</td><td>A 1 Gbit/s line to a server on another continent is still slow for small requests: every round trip costs 150–250 ms.</td></tr>
<tr><td>Switch / router</td><td>A switch forwards frames inside one network by MAC; a router forwards packets between networks by IP.</td><td>"Same network or not?" decides whether your machine talks directly or through the router — the root of many "works here, not there" bugs.</td></tr>
</tbody>
</table>

<h3>Where the Internet came from — seven dates</h3>
<p>Every date below is checked against its source (links at the end of the lesson). You do not need to memorise them; they explain why the Internet works the way it does.</p>
<ol>
<li><strong>29 October 1969 — the first host-to-host connection on the ARPANET</strong>, from UCLA to the Stanford Research Institute (SRI). The first login attempt crashed the SRI machine; the second worked. The ARPANET was a US research network funded to let scientists use each other's expensive computers.</li>
<li><strong>1973–1974 — Vint Cerf and Bob Kahn design TCP.</strong> Their problem: there were now several kinds of packet networks (radio, satellite, cable), and they could not talk to each other. Their answer was one protocol that runs on top of all of them — the ancestor of TCP/IP.</li>
<li><strong>1 January 1983 — "flag day".</strong> Every host on the ARPANET had to switch from the old protocol (NCP) to TCP/IP at the same time. From that day, the protocols you will capture in this course are the language of the Internet.</li>
<li><strong>1983 — DNS is invented</strong> by Paul Mockapetris. Before it, every computer kept one big text file listing every other computer's name and address, copied around by hand. That stopped scaling.</li>
<li><strong>March 1989 — Tim Berners-Lee proposes the World Wide Web</strong> at CERN; the first public website, <code>info.cern.ch</code>, appears in August 1991. The Web arrived twenty years after the network it runs on.</li>
<li><strong>2015 and 2018 — HTTP/2 (RFC 7540) and TLS 1.3 (RFC 8446).</strong> Many requests on one connection; encryption that costs one round trip instead of two.</li>
<li><strong>2021–2022 — QUIC (RFC 9000) and HTTP/3 (RFC 9114).</strong> A new transport built on UDP so a lost packet no longer stalls every request on the connection. Chapters 5–8 measure all of this.</li>
</ol>

<h3>Why it was born, and the decision that still shapes your code</h3>
<p>Two needs drove the design. First, <strong>sharing</strong>: computers were rare and costly, so it made sense to reach a distant one from your own lab. Second, <strong>surviving broken links</strong>: the telephone network reserves a whole circuit for each call, so one cut wire kills the call. <strong>Packet switching</strong> does the opposite — data travels as independent packets that share every link and can take any path that still works.</p>
<p>The Internet's designers then made a choice you feel in every program you write: the network in the middle is kept <strong>simple</strong>. Routers just forward packets, "best effort" — they may drop, delay, duplicate or reorder them, and they will not tell you. Making the conversation reliable is the job of the <strong>two ends</strong>: TCP in your operating system's kernel retransmits lost packets and puts bytes back in order, and your application must still decide what to do when a connection hangs or breaks — timeouts, retries, error messages. When later chapters insist "always set a timeout", this is why.</p>
<div class="pitfall co-tieu-de">
<p><strong>"The network is reliable" is the first of the famous fallacies of distributed computing.</strong> Beginners write <code>fetch(url)</code> with no timeout and assume it either works or throws quickly. In reality a request can hang for minutes — a packet dropped by a router, a server that accepted the connection and froze. If your code does not limit the wait, one slow dependency can freeze your whole API. We measure this concretely in Chapter 4 (TCP) and Chapter 10 (proxies and 504).</p>
</div>

<h3>What a developer actually does with networking</h3>
<p>You will not configure Cisco routers in this course — that is a different job (and the school course NWC204 covers it). Here is what networking looks like in a developer's week:</p>
<ul>
<li><strong>"My API works locally but my teammate cannot reach it."</strong> It listens on <code>127.0.0.1</code> (only this machine) instead of <code>0.0.0.0</code> (every interface). Lesson 1.5 shows both, measured.</li>
<li><strong>"nginx returns 502 / 504."</strong> Which hop failed: was the app dead, too slow, or listening on the wrong port? Chapter 10.</li>
<li><strong>"We moved the server and some users still reach the old one."</strong> DNS caching and TTL. Chapter 3.</li>
<li><strong>"Your connection is not private."</strong> An expired certificate or a missing intermediate. Chapter 7.</li>
<li><strong>"Fast in Vietnam, slow in Europe."</strong> Latency multiplied by the number of round trips; the fix is fewer trips or a CDN. Chapters 5 and 8.</li>
<li><strong>"Live chat drops every minute."</strong> A proxy closes idle WebSocket connections. Chapter 9.</li>
</ul>

<h3>How much it matters — two numbers</h3>
<p>The International Telecommunication Union's <em>Facts and Figures 2025</em> estimates that about <strong>6 billion people — 74% of the world's population — were online in 2025</strong>, while about 2.2 billion were not yet. Every one of those users reaches the software you write through DNS, TCP, TLS and HTTP.</p>
<p>The second number is from our own lab, measured on 31 October 2026: one HTTPS request from the lab to cuongthai.com, with curl reporting when each stage finished.</p>
${run('c00-internet', 'for i in 1 2 3', 1)}
<p>Read the first line: the name was resolved after 3.3 ms, the TCP connection was open at 11.9 ms, TLS was done at 26.0 ms, the first byte of the page arrived at 69.5 ms, and the whole page at 102.7 ms. Notice how the three runs differ — networks are noisy, which is why we always measure more than once. Lesson 0.2 explains every stage and the trap in how curl reports them.</p>

<h3>How this helps you</h3>
<ul>
<li><strong>Your team project.</strong> The demo that runs on your laptop and dies on the school server nearly always dies on a port, an address, a firewall or a certificate. After Chapter 1 you will check those in two minutes.</li>
<li><strong>Internships and interviews.</strong> "What happens when you type a URL?", "TCP vs UDP?", "What is a 502?" are standard questions. Chapter 12 trains you to answer them with numbers you measured, which is what interviewers remember.</li>
<li><strong>The job.</strong> Backend and DevOps work is full of connection pools, timeouts, keep-alive, DNS, TLS, reverse proxies, load balancers and CDNs. These stop being magic words.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po', so: '1.1', ten: 'What a network is: components, topologies, types', giong: 'devices, media and the idea of a network of networks', khac: 'NWC204 follows Cisco ITN and network-engineer tasks (topologies, LAN/WAN types)', them: 'the developer view — what a network means for the code you write, measured on a real site' })}

<h3>The road through this course</h3>
<ol>
<li><strong>Section 0</strong> — this introduction, your lab, and the journey of one URL.</li>
<li><strong>Chapter 1</strong> — bits and bytes, layers, packets, Ethernet and ARP, ports and sockets.</li>
<li><strong>Chapter 2</strong> — IP addresses, subnets, routing, NAT, IPv6, how the Internet is stitched together.</li>
<li><strong>Chapter 3</strong> — DNS all the way to the root servers.</li>
<li><strong>Chapters 4–6</strong> — TCP in depth, UDP, QUIC.</li>
<li><strong>Chapter 7</strong> — TLS 1.3 and certificates.</li>
<li><strong>Chapters 8–10</strong> — HTTP/1.1 → HTTP/2 → HTTP/3, caching and CDN, WebSocket/SSE, load balancers and proxies.</li>
<li><strong>Chapters 11–13</strong> — a troubleshooting method, interview rounds, and the capstone: trace and speed up a real request path through Cloudflare → nginx → Docker → API → PostgreSQL.</li>
</ol>
<p>Each chapter has an interactive simulation for the abstract parts, real commands with real output, practice with solutions, a quiz, exercises on Code Lab for every lesson, and a chapter lab that adds a piece to one running project.</p>

<h3>🧪 Practice (10 minutes, guaranteed to work)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want proof that "a network is parcels and addresses" before reading anything else.</p>
<ol>
<li>Open a terminal on your own computer (macOS Terminal, Linux, or Windows PowerShell).</li>
<li>Look up a name: <code>nslookup cuongthai.com</code> (works on all three systems). Write down the address.</li>
<li>Send three packets: <code>ping -c 3 cuongthai.com</code> (on Windows: <code>ping -n 3 cuongthai.com</code>). Write down the three times.</li>
<li>Time one web request: <code>curl -s -o /dev/null -w "%{time_total}\\n" https://cuongthai.com/</code> (on Windows use <code>curl.exe</code> and <code>-o NUL</code>).</li>
<li>Repeat step 3 and step 4 twice more. Which number changes more between runs?</li>
</ol>
<p><strong>Done when:</strong> you have the address, three ping times and three curl totals written down — and you can say in one sentence why the curl total is bigger than a ping time (a web request needs several round trips, a ping needs one).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['packet (gói tin)', 'A small chunk of data with a header in front: the parcel with its label.'],
    ['protocol (giao thức)', 'Rules both sides agree on so the bits mean something.'],
    ['IP address', 'Which machine — the address for the whole journey.'],
    ['port (cổng)', 'Which program on that machine — a number such as 443.'],
    ['router / switch', 'Router joins networks by IP; switch joins machines inside one network by MAC.'],
    ['DNS', 'The phone book that turns a name into an IP address.'],
    ['latency (độ trễ) / bandwidth (băng thông)', 'How long one trip takes / how much data per second.'],
    ['packet switching (chuyển mạch gói)', 'Data travels as independent packets sharing links, not on a reserved line.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A network moves packets; each has a header with addresses; routers forward it hop by hop without reading your data.</li>
<li>The Internet is a network of networks speaking TCP/IP — the shared language since 1 January 1983.</li>
<li>Separate the pairs: Internet/Web, IP/MAC, TCP/HTTP, name/address, bandwidth/latency, switch/router.</li>
<li>The middle of the network is best effort; reliability lives at the ends — in the kernel's TCP and in your code's timeouts and retries.</li>
<li>Every stage of a request has a name and a measurable time; this course teaches you to measure each one.</li>
</ul>
${L('https://www.internetsociety.org/internet/history-internet/brief-history-internet/', '📜', 'Internet Society — Brief History of the Internet', 'ARPANET, Cerf & Kahn, the 1983 flag day, DNS — told by the people who built it.', 'Open')}
${L('https://www.computerhistory.org/internethistory/1960s/', '🏛️', 'Computer History Museum — Internet history, 1960s', 'The UCLA → SRI connection of 29 October 1969.', 'Open')}
${L('https://home.cern/science/computing/the-birth-of-the-web/short-history-web/', '🌐', 'CERN — A short history of the Web', 'The 1989 proposal and the first website.', 'Open')}
${L('https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/', '📊', 'ITU — Facts and Figures 2025', 'How many people are online, worldwide and by region.', 'Open')}
${L('https://hpbn.co/', '📗', 'High Performance Browser Networking (free online)', 'The book this course leans on for latency, TCP, TLS and HTTP.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Mạng là gì, Internet ra đời thế nào, và vì sao nó quan trọng với bạn</h2>
<p class="lead">Chào bạn. Có thể bạn đã từng gặp một trong mấy cảnh này: API chạy ngon lành trên laptop, nhưng điện thoại của bạn cùng nhóm gọi không tới; trang web vừa deploy hiện "502 Bad Gateway" mà không biết hộp nào có lỗi; người phỏng vấn hỏi "gõ một địa chỉ rồi bấm Enter thì chuyện gì xảy ra?" và bạn đọc thuộc lòng bảy tầng OSI mà không nói được tầng nào <em>làm</em> gì. Khoá học này dành đúng cho những lúc đó. Ta bắt đầu từ số 0 — mạng là cái gì — và học xong, bạn lần theo được một request đi qua từng máy, từng tầng, từng byte, và đo được từng bước.</p>

<h3>Mạng bằng lời đời thường: bưu kiện, địa chỉ, bưu cục</h3>
<p>Giả sử bạn muốn gửi một cuốn sách cho người bạn ở thành phố khác. Bạn không tự xách đi. Bạn bỏ sách vào hộp, ghi địa chỉ bên ngoài, rồi đưa cho bưu cục. Bưu cục không mở hộp; họ đọc địa chỉ, quyết định trung tâm phân loại nào là chặng kế tiếp, rồi chuyển đi. Mỗi trung tâm phân loại làm y như thế — đọc địa chỉ, chọn chặng kế, chuyển đi — cho tới khi anh shipper bấm chuông nhà bạn của bạn. Người bạn mở hộp và đọc sách.</p>
<p>Mạng máy tính làm đúng như vậy:</p>
<ul>
<li>Dữ liệu của chương trình (một request web, một tin nhắn chat, một câu truy vấn CSDL) được cắt thành các mẩu nhỏ. Mỗi mẩu được viết thêm một <strong>header</strong> (phần đầu) phía trước — nhãn dán trên hộp. Mẩu dữ liệu cộng header gọi là một <strong>gói tin (packet)</strong>.</li>
<li>Header mang một <strong>địa chỉ IP</strong>: gói này gửi cho máy nào, ở bất cứ đâu trên thế giới — chính là địa chỉ nhà.</li>
<li>Nó còn mang một <strong>số cổng (port)</strong>: chương trình nào trên máy đó sẽ nhận — giống số phòng trong một chung cư. Máy chủ web thường chờ ở cổng 443 (HTTPS) hoặc 80 (HTTP).</li>
<li><strong>Router</strong> là các trung tâm phân loại: chỉ đọc địa chỉ và đẩy gói tới gần đích thêm một bước. Chúng không đọc dữ liệu của bạn.</li>
<li>Dây cáp, Wi-Fi, cáp quang, mạng di động là đường sá và xe tải: chỉ chở bit, không hơn.</li>
<li>Con người nhớ tên chứ không nhớ số, nên có một dịch vụ "danh bạ" tên là <strong>DNS</strong> đổi <code>cuongthai.com</code> thành một địa chỉ như <code>160.187.1.208</code>.</li>
</ul>
<p>Đây là bước cuối đó, chạy thật — tra tên, rồi gửi ba gói "có đó không?" (ping) tới địa chỉ và bấm giờ:</p>
${run('c00-internet', 'dig +short')}
${run('c00-internet', 'ping -c 3')}
<p>Ba gói đi, ba gói về, mỗi vòng đi-về mất 7–10 mili giây. Đó là toàn bộ ý tưởng của mạng trong một lệnh. Phần còn lại của khoá là chuyện gì xảy ra bên trong 7 mili giây đó — và cái gì có thể hỏng.</p>

<h3>Thiết bị, đường truyền, giao thức — và Internet</h3>
<p>Mạng nào, từ hai laptop chung một Wi-Fi tới cả Internet, cũng có ba thành phần:</p>
<ul>
<li><strong>Thiết bị.</strong> Thiết bị đầu cuối (laptop, điện thoại, máy chủ) và thiết bị ở giữa. <strong>Switch</strong> nối các máy trong cùng một mạng cục bộ; <strong>router</strong> nối mạng này với mạng khác. Cục Wi-Fi ở nhà bạn thường kiêm cả hai, cộng thêm vài việc nữa.</li>
<li><strong>Đường truyền.</strong> Cáp đồng (xung điện), cáp quang (xung ánh sáng), Wi-Fi và 4G/5G (sóng radio). Đường truyền chỉ biết chở bit từ đầu này sang đầu kia.</li>
<li><strong>Giao thức (protocol).</strong> Luật mà hai bên cùng theo: bắt đầu cuộc nói chuyện thế nào, gói tin được to bao nhiêu, địa chỉ viết ra sao, mất gói thì làm gì. Không có luật chung, các bit trên dây chẳng mang nghĩa gì.</li>
</ul>
<p><strong>Internet</strong> không phải một mạng của riêng ai. Nó là hàng chục nghìn mạng của những chủ khác nhau — hộ gia đình, trường đại học, nhà mạng như Viettel, nhà cung cấp đám mây, trung tâm dữ liệu đang chạy cuongthai.com — đồng ý chở gói tin giúp nhau. Họ làm được vì cùng nói một họ giao thức: <strong>TCP/IP</strong>. Vì thế mới gọi là "inter-net": mạng nối giữa các mạng.</p>
${net('waterfall', 'cold', 'vi', 'Một request thật tới cuongthai.com, từng chặng — bấm Chạy, rồi thử chế độ "warm".')}

<h3>Những cặp thuật ngữ ai cũng nhầm</h3>
<p>Một nửa sự rối của người mới đến từ sáu cặp từ nghe na ná nhau. Tách chúng ra một lần là rất nhiều lời giải thích bỗng dễ hiểu:</p>
<table>
<thead><tr><th>Cặp</th><th>Khác nhau thế nào</th><th>Vì sao lập trình viên cần biết</th></tr></thead>
<tbody>
<tr><td>Internet / Web</td><td>Internet là mạng của các mạng. Web là một dịch vụ chạy trên nó (trang web qua HTTP).</td><td>Email, SSH, kết nối CSDL, máy chủ game dùng Internet mà không dùng Web. "Trang web sập" và "mạng sập" là hai lỗi khác nhau.</td></tr>
<tr><td>Địa chỉ IP / địa chỉ MAC</td><td>IP = địa chỉ cho cả hành trình. MAC = địa chỉ phần cứng của card mạng, chỉ có giá trị trên một chặng.</td><td>IP giữ nguyên từ laptop tới máy chủ; MAC bị viết lại ở mỗi router (ta bắt gói chứng minh ở bài 1.4).</td></tr>
<tr><td>TCP / HTTP</td><td>TCP là dịch vụ chuyển phát, lo cho byte tới đủ và đúng thứ tự. HTTP là ngôn ngữ mà request của bạn được viết bằng.</td><td>"Connection refused" là chuyện của TCP; "404 Not Found" là câu trả lời của HTTP — kết nối vẫn chạy tốt.</td></tr>
<tr><td>Tên miền / địa chỉ IP</td><td>Cái tên người nhớ vs con số máy dùng để định tuyến. DNS dịch giữa hai bên.</td><td>Đổi máy chủ sau một cái tên mà không cần báo người dùng — nhưng các bộ nhớ đệm còn nhớ số cũ một lúc (Chương 3).</td></tr>
<tr><td>Băng thông / độ trễ</td><td>Bao nhiêu dữ liệu mỗi giây vs một chuyến đi mất bao lâu.</td><td>Đường 1 Gbit/s tới máy chủ ở lục địa khác vẫn chậm với request nhỏ: mỗi lượt đi-về tốn 150–250 ms.</td></tr>
<tr><td>Switch / router</td><td>Switch chuyển frame trong một mạng theo MAC; router chuyển gói giữa các mạng theo IP.</td><td>"Cùng mạng hay không?" quyết định máy bạn nói chuyện trực tiếp hay qua router — gốc của rất nhiều lỗi "máy này được, máy kia không".</td></tr>
</tbody>
</table>

<h3>Internet ra đời thế nào — bảy mốc</h3>
<p>Mốc nào dưới đây cũng đã kiểm với nguồn (link cuối bài). Không cần học thuộc; chúng giải thích vì sao Internet vận hành như hôm nay.</p>
<ol>
<li><strong>29/10/1969 — kết nối máy-với-máy đầu tiên trên ARPANET</strong>, từ UCLA tới Viện Nghiên cứu Stanford (SRI). Lần đăng nhập đầu tiên làm máy ở SRI treo; lần thứ hai thì được. ARPANET là mạng nghiên cứu của Mỹ, được cấp tiền để các nhà khoa học dùng chung những chiếc máy tính đắt đỏ của nhau.</li>
<li><strong>1973–1974 — Vint Cerf và Bob Kahn thiết kế TCP.</strong> Bài toán của họ: lúc đó đã có vài kiểu mạng gói (radio, vệ tinh, cáp) và chúng không nói chuyện được với nhau. Lời giải là một giao thức chạy được bên trên tất cả — tổ tiên của TCP/IP.</li>
<li><strong>1/1/1983 — "flag day" (ngày chuyển đổi).</strong> Mọi máy trên ARPANET phải cùng lúc bỏ giao thức cũ (NCP) để chuyển sang TCP/IP. Từ hôm đó, những giao thức bạn sẽ bắt gói trong khoá này là ngôn ngữ của Internet.</li>
<li><strong>1983 — DNS ra đời</strong>, do Paul Mockapetris phát minh. Trước đó, mỗi máy giữ một file chữ khổng lồ liệt kê tên và địa chỉ của mọi máy khác, chép đi chép lại bằng tay. Cách đó không lớn thêm được nữa.</li>
<li><strong>Tháng 3/1989 — Tim Berners-Lee đề xuất World Wide Web</strong> ở CERN; trang web công khai đầu tiên, <code>info.cern.ch</code>, xuất hiện tháng 8/1991. Web tới muộn hơn cái mạng nó chạy trên đó tới hai mươi năm.</li>
<li><strong>2015 và 2018 — HTTP/2 (RFC 7540) và TLS 1.3 (RFC 8446).</strong> Nhiều request trên một kết nối; mã hoá chỉ tốn một lượt đi-về thay vì hai.</li>
<li><strong>2021–2022 — QUIC (RFC 9000) và HTTP/3 (RFC 9114).</strong> Một tầng giao vận mới dựng trên UDP để một gói bị mất không còn làm khựng mọi request trên kết nối. Chương 5–8 đo tất cả những thứ này.</li>
</ol>

<h3>Vì sao nó ra đời, và quyết định vẫn còn định hình code của bạn</h3>
<p>Hai nhu cầu dẫn dắt thiết kế. Thứ nhất, <strong>dùng chung</strong>: máy tính hiếm và đắt, nên ngồi ở phòng mình mà dùng được máy ở xa là rất đáng. Thứ hai, <strong>sống sót khi đứt đường</strong>: mạng điện thoại giữ riêng cả một mạch cho mỗi cuộc gọi, đứt một sợi dây là cuộc gọi chết. <strong>Chuyển mạch gói (packet switching)</strong> làm ngược lại — dữ liệu đi thành những gói độc lập, dùng chung mọi đường truyền và đi được bất cứ đường nào còn sống.</p>
<p>Rồi những người thiết kế Internet chọn một điều mà bạn cảm nhận được trong mọi chương trình mình viết: phần giữa mạng được giữ <strong>đơn giản</strong>. Router chỉ chuyển tiếp gói, "cố gắng hết sức" (best effort) — có thể làm rơi, làm trễ, nhân đôi hay đảo thứ tự gói, và sẽ không báo cho bạn. Làm cho cuộc nói chuyện tin cậy là việc của <strong>hai đầu</strong>: TCP trong nhân hệ điều hành gửi lại gói bị mất và sắp byte lại đúng thứ tự, còn ứng dụng của bạn vẫn phải quyết định làm gì khi kết nối treo hoặc đứt — timeout, thử lại, báo lỗi. Khi các chương sau nhắc đi nhắc lại "luôn đặt timeout", lý do là đây.</p>
<div class="pitfall co-tieu-de">
<p><strong>"Mạng thì tin cậy" là điều đầu tiên trong danh sách những ngộ nhận nổi tiếng về hệ phân tán.</strong> Người mới viết <code>fetch(url)</code> không có timeout và nghĩ nó hoặc chạy được, hoặc báo lỗi ngay. Thực tế một request có thể treo vài phút — một gói bị router làm rơi, một máy chủ đã nhận kết nối rồi đứng hình. Nếu code không giới hạn thời gian chờ, một dịch vụ phụ chậm có thể làm đơ cả API của bạn. Ta đo cụ thể chuyện này ở Chương 4 (TCP) và Chương 10 (proxy và lỗi 504).</p>
</div>

<h3>Lập trình viên thật sự làm gì với mạng</h3>
<p>Khoá này không dạy cấu hình router Cisco — đó là một nghề khác (và môn NWC204 ở trường dạy phần đó). Còn đây là mạng trong một tuần làm việc của lập trình viên:</p>
<ul>
<li><strong>"API chạy ở máy em mà bạn cùng nhóm không gọi được."</strong> Nó nghe trên <code>127.0.0.1</code> (chỉ máy này) thay vì <code>0.0.0.0</code> (mọi card mạng). Bài 1.5 cho thấy cả hai, có số đo.</li>
<li><strong>"nginx trả 502 / 504."</strong> Chặng nào hỏng: ứng dụng chết, quá chậm, hay nghe nhầm cổng? Chương 10.</li>
<li><strong>"Chuyển máy chủ rồi mà vài người vẫn vào máy cũ."</strong> DNS cache và TTL. Chương 3.</li>
<li><strong>"Kết nối của bạn không riêng tư."</strong> Chứng chỉ hết hạn hoặc thiếu chứng chỉ trung gian. Chương 7.</li>
<li><strong>"Ở Việt Nam nhanh, ở châu Âu chậm."</strong> Độ trễ nhân với số lượt đi-về; cách sửa là bớt lượt hoặc dùng CDN. Chương 5 và 8.</li>
<li><strong>"Chat trực tiếp cứ một phút lại rớt."</strong> Một proxy đóng các kết nối WebSocket "im lặng". Chương 9.</li>
</ul>

<h3>Nó quan trọng tới đâu — hai con số</h3>
<p>Báo cáo <em>Facts and Figures 2025</em> của Liên minh Viễn thông Quốc tế (ITU) ước tính khoảng <strong>6 tỷ người — 74% dân số thế giới — dùng Internet trong năm 2025</strong>, còn khoảng 2,2 tỷ người chưa. Mỗi người dùng đó đều tới phần mềm bạn viết qua DNS, TCP, TLS và HTTP.</p>
<p>Con số thứ hai đo từ chính phòng lab ngày 31/10/2026: một request HTTPS từ lab tới cuongthai.com, curl báo thời điểm mỗi chặng xong.</p>
${run('c00-internet', 'for i in 1 2 3', 1)}
<p>Đọc dòng đầu: tên được tra xong lúc 3,3 ms, kết nối TCP mở xong lúc 11,9 ms, TLS xong lúc 26,0 ms, byte đầu tiên của trang tới lúc 69,5 ms, và cả trang lúc 102,7 ms. Để ý ba lần chạy khác nhau — mạng luôn "nhiễu", nên ta luôn đo nhiều hơn một lần. Bài 0.2 giải thích từng chặng và cái bẫy trong cách curl báo số.</p>

<h3>Nó giúp gì cho bạn</h3>
<ul>
<li><strong>Đồ án nhóm.</strong> Bản demo chạy trên laptop rồi chết trên máy chủ của trường gần như luôn chết vì một cổng, một địa chỉ, một tường lửa hay một chứng chỉ. Học xong Chương 1, bạn kiểm những thứ đó trong hai phút.</li>
<li><strong>Thực tập và phỏng vấn.</strong> "Gõ URL rồi Enter thì sao?", "TCP khác UDP thế nào?", "502 là gì?" là câu hỏi quen thuộc. Chương 12 luyện bạn trả lời bằng số tự đo — thứ mà người phỏng vấn nhớ.</li>
<li><strong>Công việc.</strong> Backend và DevOps đầy rẫy pool kết nối, timeout, keep-alive, DNS, TLS, reverse proxy, cân bằng tải và CDN. Những chữ đó thôi là phép màu.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po', so: '1.1', ten: 'Mạng là gì: thành phần, topo, các loại mạng', giong: 'thiết bị, môi trường truyền và ý tưởng mạng của các mạng', khac: 'NWC204 theo giáo trình Cisco ITN và việc của kỹ sư mạng (topo, phân loại LAN/WAN)', them: 'góc nhìn lập trình viên — mạng có nghĩa gì với code bạn viết, đo trên một website thật' })}

<h3>Lộ trình của khoá</h3>
<ol>
<li><strong>Mục 0</strong> — phần mở đầu này, phòng lab của bạn, và hành trình của một URL.</li>
<li><strong>Chương 1</strong> — bit và byte, các tầng, gói tin, Ethernet và ARP, cổng và socket.</li>
<li><strong>Chương 2</strong> — địa chỉ IP, subnet, định tuyến, NAT, IPv6, Internet được khâu lại với nhau thế nào.</li>
<li><strong>Chương 3</strong> — DNS tới tận máy chủ gốc.</li>
<li><strong>Chương 4–6</strong> — TCP thật sâu, UDP, QUIC.</li>
<li><strong>Chương 7</strong> — TLS 1.3 và chứng chỉ.</li>
<li><strong>Chương 8–10</strong> — HTTP/1.1 → HTTP/2 → HTTP/3, cache và CDN, WebSocket/SSE, cân bằng tải và proxy.</li>
<li><strong>Chương 11–13</strong> — phương pháp chẩn đoán, vòng phỏng vấn, và dự án cuối khoá: truy vết và tăng tốc một đường đi request thật qua Cloudflare → nginx → Docker → API → PostgreSQL.</li>
</ol>
<p>Chương nào cũng có mô phỏng tương tác cho phần trừu tượng, lệnh thật kèm output thật, bài thực hành có lời giải, quiz, bài luyện trên Code Lab cho từng bài học, và một lab chương gắn thêm một mảnh vào cùng một dự án đang chạy.</p>

<h3>🧪 Thực hành (10 phút, chắc chắn làm được)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn tự thấy "mạng là bưu kiện và địa chỉ" trước khi đọc thêm bất cứ thứ gì.</p>
<ol>
<li>Mở terminal trên máy bạn (Terminal của macOS, Linux, hoặc PowerShell của Windows).</li>
<li>Tra một cái tên: <code>nslookup cuongthai.com</code> (chạy được trên cả ba hệ). Ghi lại địa chỉ.</li>
<li>Gửi ba gói: <code>ping -c 3 cuongthai.com</code> (Windows: <code>ping -n 3 cuongthai.com</code>). Ghi lại ba thời gian.</li>
<li>Bấm giờ một request web: <code>curl -s -o /dev/null -w "%{time_total}\\n" https://cuongthai.com/</code> (Windows dùng <code>curl.exe</code> và <code>-o NUL</code>).</li>
<li>Làm lại bước 3 và 4 thêm hai lần. Con số nào thay đổi nhiều hơn giữa các lần?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn ghi được địa chỉ, ba thời gian ping và ba tổng thời gian curl — và nói được trong một câu vì sao tổng của curl lớn hơn một lần ping (một request web cần vài lượt đi-về, một ping chỉ cần một).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['packet (gói tin)', 'Một mẩu dữ liệu nhỏ có header phía trước: cái hộp kèm nhãn địa chỉ.'],
    ['protocol (giao thức)', 'Luật hai bên cùng theo để các bit mang nghĩa.'],
    ['IP address (địa chỉ IP)', 'Máy nào — địa chỉ cho cả hành trình.'],
    ['port (cổng)', 'Chương trình nào trên máy đó — một con số như 443.'],
    ['router / switch', 'Router nối các mạng theo IP; switch nối các máy trong một mạng theo MAC.'],
    ['DNS (hệ thống tên miền)', 'Cuốn danh bạ đổi tên thành địa chỉ IP.'],
    ['latency (độ trễ) / bandwidth (băng thông)', 'Một chuyến đi mất bao lâu / bao nhiêu dữ liệu mỗi giây.'],
    ['packet switching (chuyển mạch gói)', 'Dữ liệu đi thành các gói độc lập dùng chung đường truyền, không giữ riêng một đường dây.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mạng chuyển các gói tin; mỗi gói có header chứa địa chỉ; router chuyền gói từng chặng mà không đọc dữ liệu của bạn.</li>
<li>Internet là mạng của các mạng cùng nói TCP/IP — ngôn ngữ chung từ ngày 1/1/1983.</li>
<li>Tách các cặp: Internet/Web, IP/MAC, TCP/HTTP, tên/địa chỉ, băng thông/độ trễ, switch/router.</li>
<li>Phần giữa mạng chỉ "cố gắng hết sức"; sự tin cậy nằm ở hai đầu — TCP trong nhân và timeout, thử lại trong code của bạn.</li>
<li>Chặng nào của một request cũng có tên và đo được thời gian; khoá này dạy bạn đo từng chặng.</li>
</ul>
${L('https://www.internetsociety.org/internet/history-internet/brief-history-internet/', '📜', 'Internet Society — Brief History of the Internet', 'ARPANET, Cerf & Kahn, ngày chuyển đổi 1983, DNS — do chính những người xây dựng kể lại.', 'Mở')}
${L('https://www.computerhistory.org/internethistory/1960s/', '🏛️', 'Computer History Museum — lịch sử Internet thập niên 1960', 'Kết nối UCLA → SRI ngày 29/10/1969.', 'Mở')}
${L('https://home.cern/science/computing/the-birth-of-the-web/short-history-web/', '🌐', 'CERN — Lược sử Web', 'Đề xuất năm 1989 và trang web đầu tiên.', 'Mở')}
${L('https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/', '📊', 'ITU — Facts and Figures 2025', 'Bao nhiêu người đang dùng Internet, toàn cầu và theo vùng.', 'Mở')}
${L('https://hpbn.co/', '📗', 'High Performance Browser Networking (đọc miễn phí)', 'Cuốn sách khoá này dựa vào cho độ trễ, TCP, TLS và HTTP.', 'Mở')}
</div>
`,
};
