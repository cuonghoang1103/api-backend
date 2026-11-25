/**
 * 11.7 — Lab 11 (soạn 24/11/2026, agent lgz).
 * Dựng thật: ./_demo/s11/lab11-dung.bash — tua đồng hồ router OpenWrt + lab7 + android-7f3a về tối 24/11/2026, android làm 4 việc ở 4 mốc
 * (20:47 vào mạng, 21:15 gọi về 6 lần/20 s, 22:03 quét LAN + UPnP 2323 + telnet ra ngoài, 23:41 rút dữ liệu qua DNS TXT + thử mật khẩu SSH router).
 * Điều tra: OUT['s11/lab11'] (lời giải). Log mẫu cho người không có router: ./_demo/s11/lab11/mau/{wrt-nha.log, ufw.log, pfirewall.log}
 * (pfirewall.log của Windows KHÔNG tua giờ ⇒ lệch ~9 giờ 30 — cố ý giữ làm bài tập căn giờ). Lab trả đồng hồ bằng lab11-tra-gio.bash.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab 11 — A mini network log set: router syslog to your VM, ufw, DNS — trace one device for an evening|||Lab 11 — Bộ log mạng mini: syslog của router về máy ảo, ufw, DNS — lần theo một thiết bị trong một buổi tối',
  slug: 'log-11-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một thiết bị tên android-7f3a vào mạng nhà lúc 20:47 và làm vài việc lạ trước nửa đêm. Bạn có ba nguồn log thật: syslog của router OpenWrt gửi về máy Linux (DHCP, DNS, tường lửa, UPnP, SSH), ufw.log của máy Linux, và pfirewall.log của laptop Windows. Nhiệm vụ: dựng dòng thời gian bốn giai đoạn, mỗi kết luận có bằng chứng từ ít nhất ba nguồn, giải mã thứ nó đã cố đẩy ra ngoài, và nói việc gì cần làm ngay. Có log mẫu tải về nếu router của bạn không có syslog; lời giải chạy thật được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab 11</span>
<h2>Trace one device through an evening</h2>
<p class="lead">Your younger sibling's friend left a "phone" connected to your home Wi‑Fi. The next morning the router feels slow and you are curious what it did. You have what this chapter built: the router's syslog on your Linux machine, the Linux firewall log, and the Windows laptop's firewall log. No guessing — every statement in your report must point at log lines.</p>

<h3>Setup (choose one)</h3>
<ul>
<li><strong>A — full lab</strong> (the chapter's virtual LAN): <code>cong-cu/may.bash bat</code>, then the staging script below. It sets the clocks of the router, lab7 and the device to the evening of 24/11/2026, lets the device act in four phases, and you investigate. Do <em>not</em> read the staging script before you finish.</li>
<li><strong>B — your own network:</strong> your router's syslog to your VM (Lesson 11.1), ufw logging on (11.4), and one of your own devices doing a few of these things (only towards your own machines and <code>.test</code> names).</li>
<li><strong>C — sample logs:</strong> the three files produced by option A, below. Save them as <code>wrt-nha.log</code>, <code>ufw.log</code>, <code>pfirewall.log</code>.</li>
</ul>
<details>
<summary><strong>Staging script — do not open before finishing</strong></summary>
${ma('bash', 's11/lab11-dung.bash')}
</details>
<details>
<summary><strong>Sample logs (option C)</strong></summary>
<p><code>ufw.log</code> (lab7):</p>
${ma('text', 's11/lab11/mau/ufw.log')}
<p><code>pfirewall.log</code> (LAPTOP-AN, Windows):</p>
${ma('text', 's11/lab11/mau/pfirewall.log')}
<p><code>wrt-nha.log</code> (router → lab7, 257 lines):</p>
${ma('text', 's11/lab11/mau/wrt-nha.log')}
</details>

<h3>Your tasks</h3>
<ol>
<li><strong>Identify the device:</strong> its IP, MAC, the hostname it announced, and when it joined. Is the MAC a randomised one?</li>
<li><strong>Normal use:</strong> which ordinary sites did it look up right after joining?</li>
<li><strong>Beaconing:</strong> which name did it ask repeatedly, how many times, at what interval, starting when?</li>
<li><strong>Scanning:</strong> which hosts and ports did it probe, according to lab7's ufw and the laptop's firewall? Why do the two logs show different times?</li>
<li><strong>Doors opened and closed:</strong> what did it ask the router to open via UPnP, and what outbound connections did the router block?</li>
<li><strong>Exfiltration:</strong> decode what it sent out through DNS.</li>
<li><strong>Router attack:</strong> what did it try on the router at the end, and did it succeed?</li>
<li><strong>Timeline:</strong> a single table time | source | event | evidence, sorted.</li>
<li><strong>Now what:</strong> five actions, in order, for tonight.</li>
</ol>
<p><strong>Pass:</strong> all nine answered; every row of the timeline cites a log line; at least three different sources used (router DHCP/DNS/firewall/UPnP/SSH count as one source — the router — so you need ufw.log and pfirewall.log too); the clock difference of the Windows log explained and corrected.</p>

<h3>Hints (one at a time)</h3>
<ul>
<li>Field positions in the router copy: <code>$1</code> time, <code>$3</code> program, for dnsmasq <code>$5</code> client/port, <code>$6</code> query[TYPE], <code>$7</code> name, <code>$9</code> client IP; for DHCP lines <code>$4</code> DHCPACK(br-lan), <code>$5</code> IP.</li>
<li>Your own SSH logins (Pubkey auth from 192.168.56.10) are you — remove them first.</li>
<li>Base32: upper-case, pad with <code>=</code> to a multiple of 8, <code>base32 -d</code>.</li>
<li>Windows logged at its real time; the lab clocks were moved. Find the same scan in both logs and compute the offset.</li>
</ul>

<details>
<summary><strong>Solution (open only after trying)</strong></summary>
${lenh('s11/lab11', 0)}
${lenh('s11/lab11', 1)}
<p>(1) 192.168.56.142, MAC 52:54:00:56:00:42, hostname android-7f3a, DHCPACK at 20:47:20. The MAC's second digit is 2 (…0010): not locally administered, so not a randomised phone MAC — in this lab it is a virtual NIC, in real life it would be the factory MAC of a device with private-address off. The first lines of the file (12:31) are our own SSH sessions and the router's normal noise, before the evening.</p>
${lenh('s11/lab11', 2)}
${lenh('s11/lab11', 3)}
<p>(2) youtube.com, zalo.me, vnexpress.net, shopee.vn — one each, looks human. The 14 <code>android-7f3a.lan</code> are the device asking its own name (systemd-resolved), noise. (3) <code>update.cdn-lab.test</code>, 6 times, every 20 s exactly, from 21:15:00 — a beacon.</p>
${lenh('s11/lab11', 4)}
${lenh('s11/lab11', 10)}
<p>(4) lab7's ufw logged blocks to 23, 3389, 8080 (22 and 80 were allowed, so not logged) at 22:03:00–01; the scan covered 22, 23, 80, 445, 3389, 8080 on two hosts (nmap); the laptop logged DROPs to 445 at <strong>12:34:15–16</strong>. Same scan, so the Windows clock is about 9 h 29 min behind the lab clock: the lab clocks were moved forward to "the evening" and Windows kept real time. In a real case you would correct with an anchor event exactly like this one (Lesson 1.5), not by trusting either clock.</p>
${lenh('s11/lab11', 5)}
${lenh('s11/lab11', 6)}
<p>(5) The router blocked three outbound telnet attempts (port 23 to 198.51.100.23, 198.51.100.24, 203.0.113.9 — documentation ranges, standing for Internet hosts) by the rule <code>Chan-telnet-ra-ngoai</code>; via UPnP the device opened TCP 2323 from the Internet to itself for a week ("svc"). Telnet out + 2323 in is the Mirai pattern from Lesson 11.1.</p>
${lenh('s11/lab11', 8)}
${lenh('s11/lab11', 9)}
<p>(6) Two TXT queries to <code>exfil-lab.test</code> with 50- and 38-character labels decode to <code>danh-ba: an 0901234567; binh 0912345678; chi 0987654321</code> — a contact list (fake numbers).</p>
${lenh('s11/lab11', 7)}
<p>(7) Three SSH connections to the router at 23:41:00–01 with a wrong password for root (three "Bad password attempt"), and no "auth succeeded" from .142 — failed.</p>
${lenh('s11/lab11', 11)}
<p>(8) The timeline above (router + lab7), plus the Windows row corrected: "22:03 (laptop clock 12:34) LAPTOP-AN firewall drops 445 from .142". (9) Tonight: disconnect the device (block its MAC on the router / Wi‑Fi), delete the UPnP mapping and turn UPnP off, change the Wi‑Fi password and the router admin password (it was targeted), keep a copy of the three logs with SHA-256 (Lesson 16.4), then check the people in that contact list are told if it was real data. Bonus: the router's own log no longer has the evening if it rebooted — only the copy on lab7 does.</p>
</details>

<h3>Report format (five lines, as in Lab 10)</h3>
<ol>
<li>What happened (one sentence, with times).</li>
<li>Evidence (3–5 log lines with source names).</li>
<li>Impact (what left, what was exposed).</li>
<li>Action taken / recommended.</li>
<li>What is still unknown (e.g. whether 2323 was reached from the Internet — the router had no log of inbound connections to it).</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Anchor event', 'An event visible in two sources, used to align their clocks.'],
  ['Single source vs independent sources', 'Router DHCP and router DNS are one witness; ufw and Windows are others.'],
  ['Beacon / exfiltration / lateral scan', 'Calling home / sending data out / probing other hosts inside.'],
])}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-5-dong-thoi-gian', title: 'Lesson 14.5 — Building an incident timeline from many sources', sub: 'The method in depth', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab 11</span>
<h2>Lần theo một thiết bị trong một buổi tối</h2>
<p class="lead">Bạn của em bạn để lại một "chiếc điện thoại" kết nối Wi‑Fi nhà bạn. Sáng hôm sau router có vẻ chậm và bạn tò mò nó đã làm gì. Bạn có đúng những thứ chương này đã dựng: syslog của router trên máy Linux, log tường lửa của máy Linux, và log tường lửa của laptop Windows. Không đoán mò — mọi câu trong báo cáo đều phải trỏ về dòng log.</p>

<h3>Chuẩn bị (chọn một)</h3>
<ul>
<li><strong>A — lab đầy đủ</strong> (mạng LAN ảo của chương): <code>cong-cu/may.bash bat</code>, rồi chạy script dàn dựng bên dưới. Nó chỉnh đồng hồ router, lab7 và thiết bị về tối 24/11/2026, cho thiết bị hành động trong bốn giai đoạn, rồi bạn điều tra. <em>Đừng</em> đọc script dàn dựng trước khi làm xong.</li>
<li><strong>B — mạng của chính bạn:</strong> syslog của router về máy ảo (Bài 11.1), bật ufw logging (11.4), và một thiết bị của chính bạn làm vài việc trong số đó (chỉ nhắm vào máy của bạn và tên <code>.test</code>).</li>
<li><strong>C — log mẫu:</strong> ba tệp sinh ra từ phương án A, ở dưới. Lưu thành <code>wrt-nha.log</code>, <code>ufw.log</code>, <code>pfirewall.log</code>.</li>
</ul>
<details>
<summary><strong>Script dàn dựng — đừng mở trước khi làm xong</strong></summary>
${ma('bash', 's11/lab11-dung.bash')}
</details>
<details>
<summary><strong>Log mẫu (phương án C)</strong></summary>
<p><code>ufw.log</code> (lab7):</p>
${ma('text', 's11/lab11/mau/ufw.log')}
<p><code>pfirewall.log</code> (LAPTOP-AN, Windows):</p>
${ma('text', 's11/lab11/mau/pfirewall.log')}
<p><code>wrt-nha.log</code> (router → lab7, 257 dòng):</p>
${ma('text', 's11/lab11/mau/wrt-nha.log')}
</details>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Nhận diện thiết bị:</strong> IP, MAC, tên máy nó khai, lúc nào vào mạng. MAC đó có phải MAC ngẫu nhiên không?</li>
<li><strong>Dùng bình thường:</strong> ngay sau khi vào mạng nó tra những trang thông thường nào?</li>
<li><strong>Gọi về:</strong> nó hỏi đi hỏi lại tên nào, bao nhiêu lần, nhịp bao lâu, bắt đầu lúc nào?</li>
<li><strong>Quét:</strong> nó đã thăm máy nào, cổng nào, theo ufw của lab7 và tường lửa của laptop? Vì sao hai log cho giờ khác nhau?</li>
<li><strong>Cửa mở và cửa bị đóng:</strong> nó xin router mở gì qua UPnP, và router đã chặn những kết nối đi ra nào?</li>
<li><strong>Rút dữ liệu:</strong> giải mã thứ nó đã gửi ra ngoài qua DNS.</li>
<li><strong>Tấn công router:</strong> cuối buổi nó thử gì với router, có thành công không?</li>
<li><strong>Dòng thời gian:</strong> một bảng thời điểm | nguồn | sự kiện | bằng chứng, có sắp xếp.</li>
<li><strong>Giờ làm gì:</strong> năm việc, theo thứ tự, cho ngay tối nay.</li>
</ol>
<p><strong>Đạt khi:</strong> trả lời đủ chín câu; mỗi dòng của dòng thời gian trích một dòng log; dùng ít nhất ba nguồn khác nhau (DHCP/DNS/tường lửa/UPnP/SSH của router tính là một nguồn — router — nên bạn cần cả ufw.log và pfirewall.log); giải thích và sửa được độ lệch giờ của log Windows.</p>

<h3>Gợi ý (mở từng cái một)</h3>
<ul>
<li>Vị trí trường trong bản sao của router: <code>$1</code> thời gian, <code>$3</code> chương trình, với dnsmasq <code>$5</code> máy hỏi/cổng, <code>$6</code> query[LOẠI], <code>$7</code> tên, <code>$9</code> IP máy hỏi; với dòng DHCP <code>$4</code> DHCPACK(br-lan), <code>$5</code> IP.</li>
<li>Các lần đăng nhập SSH của chính bạn (Pubkey auth from 192.168.56.10) là bạn — loại ra trước.</li>
<li>Base32: đổi chữ hoa, đệm <code>=</code> cho đủ bội số 8, <code>base32 -d</code>.</li>
<li>Windows ghi theo giờ thật; đồng hồ lab đã bị chỉnh. Tìm cùng một lượt quét ở cả hai log rồi tính độ lệch.</li>
</ul>

<details>
<summary><strong>Lời giải (chỉ mở sau khi đã thử)</strong></summary>
${lenh('s11/lab11', 0)}
${lenh('s11/lab11', 1)}
<p>(1) 192.168.56.142, MAC 52:54:00:56:00:42, tên máy android-7f3a, DHCPACK lúc 20:47:20. Chữ số thứ hai của MAC là 2 (…0010): không phải địa chỉ quản trị cục bộ, nên không phải MAC ngẫu nhiên của điện thoại — trong lab đó là card mạng ảo, ngoài đời sẽ là MAC gốc của một thiết bị đã tắt chế độ địa chỉ riêng tư. Những dòng đầu tệp (12:31) là phiên SSH của chính ta và tiếng ồn bình thường của router, trước buổi tối.</p>
${lenh('s11/lab11', 2)}
${lenh('s11/lab11', 3)}
<p>(2) youtube.com, zalo.me, vnexpress.net, shopee.vn — mỗi trang một lần, giống người dùng. 14 lần <code>android-7f3a.lan</code> là thiết bị hỏi tên chính nó (systemd-resolved), tiếng ồn. (3) <code>update.cdn-lab.test</code>, 6 lần, đúng mỗi 20 giây, từ 21:15:00 — gọi về.</p>
${lenh('s11/lab11', 4)}
${lenh('s11/lab11', 10)}
<p>(4) ufw của lab7 ghi các lần chặn tới 23, 3389, 8080 (22 và 80 được cho qua nên không ghi) lúc 22:03:00–01; lượt quét phủ 22, 23, 80, 445, 3389, 8080 trên hai máy (nmap); laptop ghi DROP tới 445 lúc <strong>12:34:15–16</strong>. Cùng một lượt quét, nên đồng hồ Windows chậm hơn đồng hồ lab chừng 9 giờ 29 phút: đồng hồ lab bị chỉnh tới "buổi tối" còn Windows giữ giờ thật. Trong vụ thật bạn sửa bằng một sự kiện neo đúng như thế này (Bài 1.5), không tin hẳn đồng hồ nào.</p>
${lenh('s11/lab11', 5)}
${lenh('s11/lab11', 6)}
<p>(5) Router chặn ba lần telnet đi ra (cổng 23 tới 198.51.100.23, 198.51.100.24, 203.0.113.9 — dải dành cho tài liệu, đóng vai máy trên Internet) bằng luật <code>Chan-telnet-ra-ngoai</code>; qua UPnP thiết bị đã mở TCP 2323 từ Internet về chính nó trong một tuần ("svc"). Telnet đi ra + 2323 đi vào là đúng mẫu Mirai ở Bài 11.1.</p>
${lenh('s11/lab11', 8)}
${lenh('s11/lab11', 9)}
<p>(6) Hai truy vấn TXT tới <code>exfil-lab.test</code> với nhãn dài 50 và 38 ký tự, giải mã ra <code>danh-ba: an 0901234567; binh 0912345678; chi 0987654321</code> — một danh bạ (số giả).</p>
${lenh('s11/lab11', 7)}
<p>(7) Ba kết nối SSH tới router lúc 23:41:00–01 với mật khẩu root sai (ba dòng "Bad password attempt"), và không có "auth succeeded" nào từ .142 — thất bại.</p>
${lenh('s11/lab11', 11)}
<p>(8) Dòng thời gian ở trên (router + lab7), cộng thêm dòng Windows đã sửa giờ: "22:03 (đồng hồ laptop 12:34) tường lửa LAPTOP-AN chặn 445 từ .142". (9) Tối nay: ngắt thiết bị (chặn MAC của nó trên router / Wi‑Fi), xoá ánh xạ UPnP và tắt UPnP, đổi mật khẩu Wi‑Fi và mật khẩu quản trị router (nó đã bị nhắm tới), giữ một bản ba tệp log kèm SHA-256 (Bài 16.4), rồi nếu đó là dữ liệu thật thì báo cho những người trong danh bạ. Thêm: nếu router đã khởi động lại thì log của chính nó không còn buổi tối ấy — chỉ bản sao trên lab7 còn.</p>
</details>

<h3>Mẫu báo cáo (năm dòng, như Lab 10)</h3>
<ol>
<li>Chuyện gì đã xảy ra (một câu, có giờ).</li>
<li>Bằng chứng (3–5 dòng log kèm tên nguồn).</li>
<li>Ảnh hưởng (cái gì đã ra ngoài, cái gì bị phơi).</li>
<li>Việc đã làm / đề xuất.</li>
<li>Điều còn chưa biết (ví dụ cổng 2323 có bị ai từ Internet chạm tới chưa — router không có log kết nối vào cổng đó).</li>
</ol>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Sự kiện neo', 'Một sự kiện thấy được ở hai nguồn, dùng để căn đồng hồ của chúng.'],
  ['Một nguồn và các nguồn độc lập', 'DHCP và DNS của router là cùng một nhân chứng; ufw và Windows là nhân chứng khác.'],
  ['Gọi về / rút dữ liệu / quét nội bộ', 'Liên lạc về nhà / gửi dữ liệu ra / thăm dò máy khác bên trong.'],
])}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-5-dong-thoi-gian', title: 'Bài 14.5 — Dựng dòng thời gian sự cố từ nhiều nguồn', sub: 'Phương pháp chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
