/**
 * Chương 1 · 1.1 — Bit, byte, hex và tín hiệu (bài MỚI 31/10/2026: khoá tự đủ từ số 0). Slug mới netdev-1-0-bit-byte.
 * Output thật: lab/out/c10-bit-byte.out.txt (máy client của lab).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { labEmbed } from '../_lab.mjs';
import G from '../giang/nfd-01-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '1.1 — Bits, bytes, hex and signals: the alphabet of every packet|||1.1 — Bit, byte, hex và tín hiệu: bảng chữ cái của mọi gói tin',
  slug: 'netdev-1-0-bit-byte',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bit là tín hiệu gì, byte và hệ hex, chữ UTF-8 tốn bao nhiêu byte, số nhiều byte theo thứ tự mạng (big-endian) và htons, bit/s khác byte/s — đọc byte thật bằng xxd.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Bits, bytes, hex and signals: the alphabet of every packet</h2>
<p class="lead">Every packet you will capture in this course is a row of bytes, printed as pairs of hexadecimal digits like <code>47 45 54</code>. Before we can read one, we need the alphabet: what a bit is, what a byte is, why hex, how text and numbers become bytes — and the two mistakes that even working developers make with them.</p>

<h3>A bit is a signal the hardware can tell apart</h3>
<p>A <strong>bit</strong> is the smallest piece of information: 0 or 1. On a network it is a physical state the receiving chip can distinguish: a higher or lower voltage on a copper cable, light on or off in a fibre, a change in phase or amplitude of a radio wave for Wi-Fi. The <strong>network interface card (NIC)</strong> — a chip on your laptop's board, or the module behind the Wi-Fi antenna — turns bytes from memory into those signals when sending, and turns signals back into bytes when receiving, copying them into RAM for the operating system. This is the <strong>physical layer</strong>. As a developer you rarely touch it — but it is why everything above it is made of bytes.</p>

<h3>A byte is eight bits; hex writes it in two digits</h3>
<p>Eight bits make a <strong>byte</strong>. Each position has a weight — 128, 64, 32, 16, 8, 4, 2, 1 — so one byte holds a number from 0 to 255. The letter <code>G</code> is stored as <code>01000111</code>: 64 + 4 + 2 + 1 = 71.</p>
<p>Binary is too long to read, so tools use <strong>hexadecimal</strong> (base 16: digits 0–9 then a–f). Four bits are exactly one hex digit, so one byte is exactly two: <code>0100</code> → 4, <code>0111</code> → 7, so <code>G</code> = <code>0x47</code>. <code>xxd</code> shows the bytes of anything:</p>
${run('c10-bit-byte', "printf 'GET' | xxd", 2)}
<p>The first column is the <strong>offset</strong> — how many bytes from the start this line begins. Then the bytes in hex (grouped by two for readability), then on the right the bytes that are printable characters. tcpdump, tshark, Wireshark and MAC addresses all use this same notation. Try converting yourself:</p>
${labEmbed('cpu-lab', 'bits', 'convert', 'en', 'Flip bits and watch decimal, binary and hex change together — then convert 71 by hand.', { tour: 'bits-convert' })}

<h3>Text is bytes — and not always one byte per letter</h3>
<p>Text becomes bytes through an <strong>encoding</strong>. The web uses <strong>UTF-8</strong>: plain English letters take one byte, but letters with Vietnamese marks take two or three.</p>
${run('c10-bit-byte', "printf 'Xin chào' | xxd", 2)}
<p>"Xin chào" has 8 characters but 9 bytes: <code>à</code> is the two bytes <code>c3 a0</code>. This matters the moment you deal with lengths on the network. HTTP's <code>Content-Length</code> header counts <em>bytes</em>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Content-Length computed from the number of characters.</strong> A hand-written server (or a proxy that rewrites a body) sets <code>Content-Length: body.length</code> in JavaScript — which counts UTF-16 code units, not UTF-8 bytes. For an English test message it is correct; the first Vietnamese name in the data makes the header too small, the client stops reading early and gets broken JSON. Use <code>Buffer.byteLength(body)</code> (Node) or let your framework set the header.</p>
</div>
${labEmbed('cpu-lab', 'data', 'text', 'en', 'Type any text, including Vietnamese, and see exactly which bytes UTF-8 produces.', { tour: 'data-text' })}

<h3>Numbers are bytes too: network byte order</h3>
<p>A port number can go up to 65535, so it needs two bytes; an IPv4 address needs four. Which byte goes first? Internet protocols use <strong>big-endian</strong> order — the most significant byte first — also called <strong>network byte order</strong>:</p>
${run('c10-bit-byte', 'python3 -c "print((80)', 1)}
${run('c10-bit-byte', "python3 -c \"print('10.10.2.10", 1)}
<p>Port 80 is <code>00 50</code>, port 443 is <code>01 bb</code> (1 × 256 + 187), our client's ephemeral port 50228 is <code>c4 34</code>, and the address 10.10.2.10 is <code>0a 0a 02 0a</code>. In lesson 1.3 you will find exactly these bytes inside a captured frame.</p>
<p>Your CPU, however, stores numbers the other way round:</p>
${run('c10-bit-byte', 'python3 -c "import sys', 2)}
<p>Intel and ARM processors are <strong>little-endian</strong>: the low byte first. So code that builds binary headers must convert with <code>htons()</code> ("host to network short", 16 bits) and <code>htonl()</code> (32 bits). On this machine <code>htons(80)</code> gives 20480 = <code>0x5000</code> — the two bytes swapped into the order that, written to memory, puts <code>00 50</code> on the wire. If you skip the conversion, port 80 goes out as <code>50 00</code>, which is port 20480.</p>
${labEmbed('cpu-lab', 'data', 'endian', 'en', 'The same number stored big-endian and little-endian, byte by byte.')}
<p>Text protocols (HTTP/1.1 headers, JSON) never meet this problem — numbers are written as digits. Binary protocols (TCP/IP headers, DNS, TLS, HTTP/2 frames, database wire protocols) meet it constantly.</p>

<h3>Bits per second vs bytes per second</h3>
<p>Network speeds are given in <strong>bits</strong> per second; file sizes in <strong>bytes</strong>. Divide by 8: a "100 Mbps" plan moves at most 12.5 MB per second, before any overhead. iperf3 measures throughput between two lab containers and can print either unit:</p>
${run('c10-bit-byte', 'iperf3 -c 10.10.2.10 -t 2 -f m', 2)}
<p>The two lines are two separate 2-second tests, so the numbers differ (4853 MB/s × 8 ≈ 38 800 Mbit/s in the second run versus 46 815 Mbit/s in the first). Networks are noisy — always measure more than once.</p>
<p>Now compare with what the network card says about itself:</p>
${run('c10-bit-byte', 'ethtool eth0')}
<p>The virtual card advertises 10 000 Mb/s, yet iperf3 measured about 46 000 Mb/s. Both containers are on the same computer: the "cable" is a copy between two memory buffers inside the kernel, limited only by CPU. On real hardware the advertised speed is a ceiling and real throughput is lower — headers, distance and congestion all take their share (Chapter 4).</p>

<h3>Units you will meet every day</h3>
<table>
<thead><tr><th>Written</th><th>Means</th><th>Example</th></tr></thead>
<tbody>
<tr><td>b, bit</td><td>one 0 or 1</td><td>a 48-bit MAC address</td></tr>
<tr><td>B, byte</td><td>8 bits</td><td>the IPv4 header is 20 bytes</td></tr>
<tr><td>octet</td><td>exactly 8 bits (the word RFCs use)</td><td>an IPv4 address is 4 octets</td></tr>
<tr><td>Mbit/s, Mbps</td><td>million bits per second</td><td>a 100 Mbps fibre plan</td></tr>
<tr><td>MB/s</td><td>million bytes per second</td><td>a download at 11 MB/s</td></tr>
<tr><td>0x47, \\x47</td><td>the number 47 in hex</td><td>the byte for "G"</td></tr>
</tbody>
</table>
${cauNoi('en', { ...NWC, bai: 'nwc204-4b-2-he-thap-luc-phan-mac-va-ipv6', so: '4B.2', ten: 'Hexadecimal, and why MAC and IPv6 use it', giong: 'binary, hex and converting between them', khac: 'NWC204 drills conversions for the exam', them: 'bytes inside real packets, UTF-8 lengths, network byte order and htons, bits vs bytes per second measured with iperf3' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an API returns user names, and Vietnamese names arrive cut off on the mobile app. You suspect a length problem.</p>
<ol>
<li>In the lab, run <code>printf 'Nguyễn' | xxd</code>. How many characters, how many bytes? Which bytes encode "ễ"?</li>
<li>Run <code>node -e "const s='Nguyễn'; console.log(s.length, Buffer.byteLength(s))"</code>. Which number is right for <code>Content-Length</code>?</li>
<li>Write ports 22, 3000 and 5432 as two big-endian bytes (check with <code>python3 -c "print((3000).to_bytes(2,'big').hex())"</code>).</li>
<li>A plan advertises 300 Mbps. What is the best possible download speed in MB/s?</li>
</ol>
<p><strong>Done when:</strong> you can state the byte count of "Nguyễn", the correct Node expression for the header, three port encodings, and 37.5 MB/s with the reason.</p>
<details><summary>Solution</summary>
<p>"Nguyễn" is 6 characters but 8 bytes: "ễ" is <code>e1 bb 85</code> (three bytes). <code>s.length</code> is 6 (UTF-16 code units), <code>Buffer.byteLength(s)</code> is 8 — use the second. Ports: 22 = <code>00 16</code>, 3000 = <code>0b b8</code>, 5432 = <code>15 38</code>. 300 Mbps ÷ 8 = 37.5 MB/s at most, less in practice because every packet also carries headers.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['bit', 'One 0 or 1; on the wire, a signal state the chip can tell apart.'],
    ['byte / octet', '8 bits, values 0–255; RFCs say "octet".'],
    ['hexadecimal (hệ mười sáu)', 'Base 16; two hex digits = one byte; used by every packet tool.'],
    ['NIC — network interface card (card mạng)', 'The chip that turns bytes into signals and back, and copies frames to RAM.'],
    ['UTF-8', 'The text encoding of the web; 1 byte for ASCII letters, 2–4 for others.'],
    ['big-endian / network byte order', 'Most significant byte first — how numbers travel in packets.'],
    ['little-endian / htons', 'Least significant byte first (x86, ARM); htons converts host to network order.'],
    ['bit/s vs B/s', 'Speeds in bits per second, sizes in bytes — divide by 8.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A bit is a physical signal; the NIC turns signals into bytes in RAM, and everything above sees bytes.</li>
<li>A byte is 8 bits = 256 values = two hex digits; packet tools print hex with an offset column.</li>
<li>UTF-8 text uses 1–4 bytes per character; lengths on the network are in bytes, never characters.</li>
<li>Multi-byte numbers travel big-endian (network byte order); CPUs are little-endian — convert with htons/htonl.</li>
<li>Speeds are bits per second, sizes are bytes: divide by 8, and expect less than the advertised ceiling.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc791', '📄', 'RFC 791 — Internet Protocol', 'Appendix B defines how numbers are transmitted: most significant octet first.', 'Open')}
${L('https://man7.org/linux/man-pages/man3/htons.3.html', '📄', 'man 3 htons', 'htonl, htons, ntohl, ntohs — host and network byte order.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Bit, byte, hex và tín hiệu: bảng chữ cái của mọi gói tin</h2>
<p class="lead">Gói tin nào bạn bắt được trong khoá này cũng là một hàng byte, in ra thành các cặp chữ số hex như <code>47 45 54</code>. Trước khi đọc được, ta cần bảng chữ cái: bit là gì, byte là gì, vì sao dùng hex, chữ và số biến thành byte ra sao — và hai lỗi mà cả lập trình viên đi làm cũng mắc với chúng.</p>

<h3>Bit là một tín hiệu mà phần cứng phân biệt được</h3>
<p>Một <strong>bit</strong> là mẩu thông tin nhỏ nhất: 0 hoặc 1. Trên mạng, nó là một trạng thái vật lý mà chip bên nhận phân biệt được: điện áp cao hơn hay thấp hơn trên dây đồng, có hay không có ánh sáng trong cáp quang, một thay đổi về pha hay biên độ của sóng radio với Wi-Fi. <strong>Card mạng (NIC — network interface card)</strong> — một con chip trên bo mạch laptop, hoặc mô-đun nằm sau ăng-ten Wi-Fi — đổi byte trong bộ nhớ thành các tín hiệu đó khi gửi, và đổi tín hiệu lại thành byte khi nhận, chép chúng vào RAM cho hệ điều hành. Đây là <strong>tầng vật lý</strong>. Là lập trình viên, bạn hiếm khi đụng tới nó — nhưng chính vì nó mà mọi thứ phía trên đều được làm từ byte.</p>

<h3>Byte là tám bit; hex viết nó bằng hai chữ số</h3>
<p>Tám bit thành một <strong>byte</strong>. Mỗi vị trí có một trọng số — 128, 64, 32, 16, 8, 4, 2, 1 — nên một byte chứa một số từ 0 tới 255. Chữ <code>G</code> được lưu là <code>01000111</code>: 64 + 4 + 2 + 1 = 71.</p>
<p>Nhị phân quá dài để đọc, nên các công cụ dùng <strong>hệ mười sáu (hexadecimal, hex)</strong>: các chữ số 0–9 rồi a–f. Bốn bit đúng bằng một chữ số hex, nên một byte đúng bằng hai: <code>0100</code> → 4, <code>0111</code> → 7, vậy <code>G</code> = <code>0x47</code>. <code>xxd</code> cho xem byte của bất cứ thứ gì:</p>
${run('c10-bit-byte', "printf 'GET' | xxd", 2)}
<p>Cột đầu là <strong>offset</strong> — dòng này bắt đầu cách đầu bao nhiêu byte. Rồi tới các byte ở dạng hex (gom từng cặp cho dễ đọc), rồi bên phải là những byte in được thành chữ. tcpdump, tshark, Wireshark và địa chỉ MAC đều dùng đúng cách viết này. Tự đổi thử xem:</p>
${labEmbed('cpu-lab', 'bits', 'convert', 'vi', 'Bật tắt từng bit và xem thập phân, nhị phân, hex đổi cùng lúc — rồi tự đổi số 71 bằng tay.', { tour: 'bits-convert' })}

<h3>Chữ là byte — và không phải lúc nào cũng một byte một chữ</h3>
<p>Chữ biến thành byte qua một <strong>bảng mã (encoding)</strong>. Web dùng <strong>UTF-8</strong>: chữ cái tiếng Anh thường tốn một byte, còn chữ có dấu tiếng Việt tốn hai hoặc ba.</p>
${run('c10-bit-byte', "printf 'Xin chào' | xxd", 2)}
<p>"Xin chào" có 8 ký tự nhưng 9 byte: <code>à</code> là hai byte <code>c3 a0</code>. Điều này quan trọng ngay khi bạn làm việc với độ dài trên mạng. Header <code>Content-Length</code> của HTTP đếm <em>byte</em>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Tính Content-Length bằng số ký tự.</strong> Một máy chủ viết tay (hoặc một proxy viết lại phần thân) đặt <code>Content-Length: body.length</code> trong JavaScript — thứ đếm đơn vị UTF-16, không phải byte UTF-8. Với tin nhắn thử bằng tiếng Anh thì đúng; gặp cái tên tiếng Việt đầu tiên trong dữ liệu là header bị nhỏ hơn thật, client dừng đọc sớm và nhận về JSON hỏng. Hãy dùng <code>Buffer.byteLength(body)</code> (Node) hoặc để framework tự đặt header.</p>
</div>
${labEmbed('cpu-lab', 'data', 'text', 'vi', 'Gõ bất kỳ chữ nào, kể cả tiếng Việt, và xem chính xác UTF-8 sinh ra những byte nào.', { tour: 'data-text' })}

<h3>Số cũng là byte: thứ tự byte của mạng</h3>
<p>Số cổng lên tới 65535 nên cần hai byte; địa chỉ IPv4 cần bốn. Byte nào đi trước? Giao thức Internet dùng thứ tự <strong>big-endian</strong> — byte có trọng số lớn nhất đi trước — còn gọi là <strong>thứ tự byte của mạng (network byte order)</strong>:</p>
${run('c10-bit-byte', 'python3 -c "print((80)', 1)}
${run('c10-bit-byte', "python3 -c \"print('10.10.2.10", 1)}
<p>Cổng 80 là <code>00 50</code>, cổng 443 là <code>01 bb</code> (1 × 256 + 187), cổng tạm 50228 của máy khách là <code>c4 34</code>, và địa chỉ 10.10.2.10 là <code>0a 0a 02 0a</code>. Ở bài 1.3 bạn sẽ tìm thấy đúng các byte này trong một frame bắt thật.</p>
<p>Thế nhưng CPU của bạn lại lưu số theo chiều ngược lại:</p>
${run('c10-bit-byte', 'python3 -c "import sys', 2)}
<p>Bộ xử lý Intel và ARM là <strong>little-endian</strong>: byte thấp đi trước. Nên code dựng header nhị phân phải đổi bằng <code>htons()</code> ("host to network short", 16 bit) và <code>htonl()</code> (32 bit). Trên máy này <code>htons(80)</code> cho 20480 = <code>0x5000</code> — hai byte đã được đảo sang thứ tự mà khi ghi vào bộ nhớ sẽ đặt <code>00 50</code> lên dây. Bỏ qua bước đổi, cổng 80 đi ra thành <code>50 00</code>, tức cổng 20480.</p>
${labEmbed('cpu-lab', 'data', 'endian', 'vi', 'Cùng một số lưu theo big-endian và little-endian, từng byte một.')}
<p>Giao thức dạng chữ (header HTTP/1.1, JSON) không bao giờ gặp chuyện này — số được viết bằng chữ số. Giao thức nhị phân (header TCP/IP, DNS, TLS, frame HTTP/2, giao thức của cơ sở dữ liệu) gặp nó liên tục.</p>

<h3>Bit mỗi giây khác byte mỗi giây</h3>
<p>Tốc độ mạng ghi bằng <strong>bit</strong> mỗi giây; kích thước file ghi bằng <strong>byte</strong>. Chia cho 8: gói cước "100 Mbps" chuyển tối đa 12,5 MB mỗi giây, chưa trừ phần phụ. iperf3 đo tốc độ giữa hai container của lab và in được cả hai đơn vị:</p>
${run('c10-bit-byte', 'iperf3 -c 10.10.2.10 -t 2 -f m', 2)}
<p>Hai dòng là hai lần đo 2 giây riêng biệt, nên số khác nhau (lần hai 4853 MB/s × 8 ≈ 38.800 Mbit/s so với 46.815 Mbit/s lần đầu). Mạng luôn nhiễu — luôn đo nhiều hơn một lần.</p>
<p>Giờ so với những gì card mạng tự khai về mình:</p>
${run('c10-bit-byte', 'ethtool eth0')}
<p>Card ảo khai 10.000 Mb/s, vậy mà iperf3 đo được khoảng 46.000 Mb/s. Hai container nằm trên cùng một máy tính: "dây cáp" chỉ là một lần chép giữa hai vùng nhớ trong nhân, giới hạn duy nhất là CPU. Với phần cứng thật, tốc độ quảng cáo là trần còn tốc độ thực thấp hơn — header, khoảng cách và tắc nghẽn đều lấy phần của mình (Chương 4).</p>

<h3>Đơn vị bạn gặp hằng ngày</h3>
<table>
<thead><tr><th>Viết là</th><th>Nghĩa là</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>b, bit</td><td>một số 0 hoặc 1</td><td>địa chỉ MAC dài 48 bit</td></tr>
<tr><td>B, byte</td><td>8 bit</td><td>header IPv4 dài 20 byte</td></tr>
<tr><td>octet</td><td>đúng 8 bit (chữ các RFC dùng)</td><td>địa chỉ IPv4 là 4 octet</td></tr>
<tr><td>Mbit/s, Mbps</td><td>triệu bit mỗi giây</td><td>gói cáp quang 100 Mbps</td></tr>
<tr><td>MB/s</td><td>triệu byte mỗi giây</td><td>tải về 11 MB/s</td></tr>
<tr><td>0x47, \\x47</td><td>số 47 viết ở hệ hex</td><td>byte của chữ "G"</td></tr>
</tbody>
</table>
${cauNoi('vi', { ...NWC, bai: 'nwc204-4b-2-he-thap-luc-phan-mac-va-ipv6', so: '4B.2', ten: 'Hệ thập lục phân, và vì sao MAC và IPv6 dùng nó', giong: 'nhị phân, hex và cách đổi qua lại', khac: 'NWC204 luyện đổi cơ số để đi thi', them: 'byte bên trong gói tin thật, độ dài UTF-8, thứ tự byte của mạng và htons, bit/s khác byte/s đo bằng iperf3' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một API trả về tên người dùng, và tên tiếng Việt tới app di động bị cụt. Bạn nghi do độ dài.</p>
<ol>
<li>Trong lab, chạy <code>printf 'Nguyễn' | xxd</code>. Bao nhiêu ký tự, bao nhiêu byte? Những byte nào mã hoá chữ "ễ"?</li>
<li>Chạy <code>node -e "const s='Nguyễn'; console.log(s.length, Buffer.byteLength(s))"</code>. Số nào đúng cho <code>Content-Length</code>?</li>
<li>Viết cổng 22, 3000 và 5432 thành hai byte big-endian (kiểm bằng <code>python3 -c "print((3000).to_bytes(2,'big').hex())"</code>).</li>
<li>Một gói cước quảng cáo 300 Mbps. Tốc độ tải tối đa là bao nhiêu MB/s?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được số byte của "Nguyễn", biểu thức Node đúng cho header, ba cách mã hoá cổng, và 37,5 MB/s kèm lý do.</p>
<details><summary>Lời giải</summary>
<p>"Nguyễn" là 6 ký tự nhưng 8 byte: "ễ" là <code>e1 bb 85</code> (ba byte). <code>s.length</code> là 6 (đơn vị UTF-16), <code>Buffer.byteLength(s)</code> là 8 — dùng cái sau. Cổng: 22 = <code>00 16</code>, 3000 = <code>0b b8</code>, 5432 = <code>15 38</code>. 300 Mbps ÷ 8 = tối đa 37,5 MB/s, thực tế thấp hơn vì gói nào cũng mang thêm header.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['bit', 'Một số 0 hoặc 1; trên dây là một trạng thái tín hiệu mà chip phân biệt được.'],
    ['byte / octet', '8 bit, giá trị 0–255; các RFC gọi là "octet".'],
    ['hexadecimal (hệ mười sáu)', 'Cơ số 16; hai chữ số hex = một byte; công cụ bắt gói nào cũng dùng.'],
    ['NIC — network interface card (card mạng)', 'Con chip đổi byte thành tín hiệu và ngược lại, chép frame vào RAM.'],
    ['UTF-8', 'Bảng mã chữ của web; 1 byte cho chữ ASCII, 2–4 byte cho chữ khác.'],
    ['big-endian / network byte order (thứ tự byte của mạng)', 'Byte trọng số lớn đi trước — cách số đi trong gói tin.'],
    ['little-endian / htons', 'Byte thấp đi trước (x86, ARM); htons đổi từ thứ tự của máy sang của mạng.'],
    ['bit/s và B/s', 'Tốc độ tính bằng bit mỗi giây, kích thước bằng byte — chia cho 8.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bit là một tín hiệu vật lý; NIC đổi tín hiệu thành byte trong RAM, và mọi thứ phía trên chỉ thấy byte.</li>
<li>Byte là 8 bit = 256 giá trị = hai chữ số hex; công cụ bắt gói in hex kèm cột offset.</li>
<li>Chữ UTF-8 tốn 1–4 byte mỗi ký tự; độ dài trên mạng tính bằng byte, không bao giờ bằng ký tự.</li>
<li>Số nhiều byte đi theo big-endian (thứ tự của mạng); CPU là little-endian — đổi bằng htons/htonl.</li>
<li>Tốc độ là bit mỗi giây, kích thước là byte: chia cho 8, và chờ đợi thấp hơn trần quảng cáo.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc791', '📄', 'RFC 791 — Internet Protocol', 'Phụ lục B quy định cách truyền số: octet trọng số lớn nhất đi trước.', 'Mở')}
${L('https://man7.org/linux/man-pages/man3/htons.3.html', '📄', 'man 3 htons', 'htonl, htons, ntohl, ntohs — thứ tự byte của máy và của mạng.', 'Mở')}
</div>
`,
};
