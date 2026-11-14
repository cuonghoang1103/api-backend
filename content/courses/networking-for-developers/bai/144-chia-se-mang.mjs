/**
 * Chương 14 · 14.5 — Chia sẻ mạng & điểm phát: laptop thành router, NAT, conntrack, TTL, và người lạ ké điểm phát (soạn 14/11/2026).
 * Output thật: lab/out/c145-* (bash lab/code/dung-output-ch14b.sh, CHI=145). Dùng lại mô phỏng nat (Ch2) + block/hotspot (14.2).
 * Đo được: điện thoại sau điểm phát chết vì luật TTL 63 của 14.2 (bộ đếm 5 gói = 5 lần gửi lại SYN); chuẩn hoá TTL = 64 ở POSTROUTING ⇒ qua,
 * nhưng hai SYN cùng IP vẫn mang hai đồng hồ TCP khác hẳn; gỡ MASQUERADE ⇒ gói đi ra với nguồn 192.168.137.50 ⇒ bộ điều khiển bỏ (chống giả
 * nguồn — lab phải thêm luật này vì Docker host tự định tuyến giữa các bridge, đã gặp khi soạn); điện thoại người lạ ké điểm phát mở ⇒ đi ra
 * bằng IP + MAC của laptop = tài khoản SE12345. Thẻ Wi-Fi vừa thu vừa phát, USB tethering: KHÔNG đo được trong container ⇒ chỉ giải thích.
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-5.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;
const OS_CMD = cmd(
  '# Windows: Settings → Network & internet → Mobile hotspot (or, as admin)',
  'netsh wlan show hostednetwork            # older "hosted network" status',
  '# macOS: System Settings → General → Sharing → Internet Sharing',
  '# Linux (NetworkManager): a Wi-Fi hotspot with WPA2/WPA3 and a password',
  'nmcli dev wifi hotspot ifname wlan0 ssid MyHotspot password "a-long-passphrase-you-choose"',
);

export default {
  title: '14.5 — Sharing a connection and hotspots: your laptop becomes a router|||14.5 — Chia sẻ mạng và điểm phát: laptop thành một router',
  slug: 'netdev-14-5-chia-se-mang-hotspot',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bật điểm phát trên laptop là biến nó thành một router tí hon: card phát, chuyển tiếp gói, NAT, bảng conntrack. Đo trên lab: điện thoại sau điểm phát chết vì luật TTL của trường, chuẩn hoá TTL thì qua nhưng đồng hồ TCP vẫn tố có hai máy, gỡ NAT thì gói bị bỏ vì địa chỉ nguồn lạ, và người lạ vào ké điểm phát không mật khẩu sẽ đi ra Internet bằng tài khoản của bạn. Kèm điện thoại phát cho laptop, USB tethering, vì sao card Wi-Fi không phát được khi đang thu.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>Sharing a connection and hotspots: your laptop becomes a router</h2>
<p class="lead">"Turn on your hotspot so I can use your 4G" — "share the laptop's Wi-Fi with my phone". Both sentences mean the same thing: one device becomes a <strong>router with NAT</strong> for others, exactly like the home router of lesson 2.3. This lesson opens that router up on the laptop of lesson 14.2 — and measures why the school noticed, what NAT really does, and what a stranger on your open hotspot does in your name.</p>

<h3>The everyday picture</h3>
<ul>
<li><strong>A hotspot</strong> is a friend who has a membership card and brings guests in: the door only sees one card.</li>
<li><strong>NAT</strong> is that friend writing the guests' names on the visitor book <em>as their own name</em>, and keeping a note of who ordered what, so the replies can be handed back to the right person — that note is <strong>conntrack</strong>.</li>
<li><strong>TTL</strong> is a counter on every packet that each router lowers by one: a guest who came through the friend arrives with one less.</li>
</ul>

<h3>1 — What "Mobile Hotspot" really turns on</h3>
${R('c145-nat', 'ip -br', 3)}
<p>Three things, all from earlier chapters: a second network card <code>hs</code> (192.168.137.1/24 — the range Windows always uses), <strong>forwarding</strong> between cards (<code>ip_forward = 1</code>: the laptop now passes on packets that are not for itself), and one <strong>MASQUERADE</strong> line: anything from 192.168.137.0/24 leaving through the school card gets the laptop's address as its source. On your own machine:</p>
${OS_CMD}
${net('nat', 'home', 'en', 'The same NAT your laptop does for its hotspot: watch the source address and port being rewritten and the conntrack row created.', { tour: 'nat-home' })}

<h3>2 — The phone is dead: the TTL gives it away</h3>
${R('c145-dt-ttl', 'curl', 1)}
<p>The laptop has Internet; the phone behind it does not. This is lesson 14.2's rule — the school drops packets that arrive with TTL 63, the fingerprint of "a device behind a device". The fix people reach for is to make every packet leave the laptop with the same TTL:</p>
${R('c145-ttl-win', 'iptables -t mangle -A', 3)}
${R('c145-dt-ok', 'curl', 1)}
<p>The phone works. On the school controller:</p>
${R('c145-ttl-gw', 'tshark', 2)}
<p>Both SYNs now say TTL 64 — but look at the last column: two TCP timestamp clocks billions apart, so still two machines behind one IP and one MAC. And the TTL rule's counter shows the 5 packets of the phone's first attempt (SYN plus retries) it already caught. TTL is the cheapest clue, not the only one: timestamps, the operating system in the User-Agent, the number of connections, DNS names typical of phones. Mobile operators use the same clues to apply "hotspot" limits; their contract terms decide what is allowed — check yours, and where a school or operator rule forbids sharing, follow the rule.</p>
${net('block', 'hotspot', 'en', 'A phone behind a laptop hotspot: compare the TTL the controller sees, then switch on the TTL rule.', { tour: 'block-hotspot' })}

<h3>3 — Without NAT the phone is a stranger</h3>
<p>What does the MASQUERADE line actually buy? Remove it (forwarding stays on):</p>
${R('c145-bo-nat', 'iptables', 1)}
${R('c145-dt-khongnat', 'curl', 1)}
${R('c145-gw-thay', 'tshark', 1)}
<p>The phone's packets now reach the school with their real source, 192.168.137.50 — an address the school never gave out and cannot route back to. The controller drops them (a real controller does exactly this: <em>source guard</em>, accept only sources that belong to the network — BCP 38). Five SYNs, no answer. NAT is what makes your private hotspot network invisible and routable at the same time. Put it back and read the note it keeps:</p>
${R('c145-them-nat', 'iptables', 1)}
${R('c145-ct', 'conntrack', 2)}
<p>Each connection is two lines: the phone's original (192.168.137.50 → web) and the reply the laptop expects (web → <strong>10.20.2.159</strong>, same port). When a reply arrives, the kernel looks it up and rewrites it back to the phone. This table lives in the laptop's RAM; a phone with many apps can hold hundreds of rows — on cheap routers a full conntrack table is a classic "the Internet stops when everyone is home".</p>

<h3>4 — Phone → laptop, USB, and why the laptop cannot always share Wi-Fi</h3>
<ul>
<li><strong>Phone shares 4G to the laptop</strong> (Personal Hotspot / Wi-Fi hotspot): the same three things happen on the phone; your laptop gets 172.20.10.x (iPhone) or 192.168.43.x / similar (Android). The operator may see TTL 63/127 — see above.</li>
<li><strong>USB tethering</strong> is the same NAT over a cable: no radio, lower latency, charges the phone, no one else can join. Often the best choice for a deploy from a train.</li>
<li><strong>"Share Wi-Fi to Wi-Fi"</strong> needs a card that can be a client on one network and an access point at the same time, usually on the same channel; many laptop cards cannot (Linux shows it in <code>iw list</code>, "valid interface combinations"). Apple's Internet Sharing is designed to share a <em>wired</em> or other connection over Wi-Fi. We could not measure radio behaviour in containers — this part is explained, not measured.</li>
</ul>

<h3>🕵️ The attacker's corner — the stranger on your open hotspot</h3>
<p>Your hotspot has no password (or "12345678"). A stranger's phone joins:</p>
${R('c145-ke', 'ip', 2)}
${R('c145-ke-win', 'ip neigh', 2)}
${R('c145-ke-gw', 'cat', 2)}
<p>For the school, the stranger's traffic carries the laptop's IP and MAC, and the only account bound to that MAC is <strong>SE12345 — yours</strong> (lesson 14.1). Whatever they download, post or attack is logged under your name. On the hotspot itself they are on the same network as your phone, can scan it, and on an open (unencrypted) Wi-Fi anyone nearby can read unencrypted traffic out of the air. Defences:</p>
<ul>
<li>WPA2 or better WPA3, with a long passphrase you chose — never the default printed one.</li>
<li>Look at the connected-devices list (Windows shows it; on Linux <code>ip neigh show dev …</code> as above) and turn the hotspot off when you are done.</li>
<li>A hotspot name (SSID) that does not say who you are; do not share it in a big group chat.</li>
</ul>

<h3>"What if…"</h3>
<ul>
<li><strong>…my laptop's hotspot works at home but not at school?</strong> Run the 14.2 checklist: TTL detection, or your card cannot share the network it is on.</li>
<li><strong>…two hotspots, two NATs?</strong> (phone → laptop → another phone) It works; each layer lowers TTL and adds a conntrack row; debugging gets twice as hard.</li>
<li><strong>…my phone's hotspot drops when the screen turns off?</strong> Battery saving; keep it on a charger or use USB.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li><code>ip_forward</code> is one kernel switch; MASQUERADE and the TTL rule are netfilter rules (<code>nat</code> and <code>mangle</code> tables).</li>
<li>The conntrack table is a hash table in kernel RAM (<code>conntrack -C</code> counts rows; <code>nf_conntrack_max</code> is its limit).</li>
<li>TTL is one byte of the IP header; TCP timestamps are an option in the TCP header set by each machine's own clock.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a friend's phone behind your laptop hotspot "has no Internet". Lab: <code>CHI=145 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>On <code>nft-win</code>, list the three things the hotspot turned on.</li>
<li>From <code>nft-phone</code>, reproduce the failure and find the rule and counter on <code>nft-gw</code> that explains it.</li>
<li>Remove the MASQUERADE line, show what the controller receives, and put it back.</li>
<li>Show the conntrack rows for the phone and explain both lines of one row.</li>
</ol>
<p><strong>Done when:</strong> each step has its command and real output, and you can say which clue besides TTL still reveals the phone.</p>
<details><summary>Solution</summary><p>1: card hs 192.168.137.1/24, <code>net.ipv4.ip_forward = 1</code>, <code>-A POSTROUTING -s 192.168.137.0/24 -o sv -j MASQUERADE</code>. 2: <code>iptables -t mangle -L PREROUTING -v -n</code> on nft-gw — "DROP TTL == 63" counter rises. 3: <code>tshark</code>/<code>tcpdump</code> on sv0 shows source 192.168.137.50, dropped. 4: original phone → web, reply web → 10.20.2.159 with the same port. Other clue: the TCP timestamp clocks.</p></details>
</div>

<details><summary>🧠 Self-check (4 questions)</summary>
<ol>
<li>Name the three things a hotspot turns on. — <em>A second card, forwarding, NAT (MASQUERADE).</em></li>
<li>Why does a phone behind a laptop arrive with TTL 63? — <em>The laptop routes it and lowers TTL by one.</em></li>
<li>After normalising TTL to 64, what can still tell two machines apart? — <em>TCP timestamps, User-Agent, number of connections, typical phone DNS names.</em></li>
<li>A stranger uses your open hotspot at school. Whose account does the school log? — <em>Yours: they leave with your laptop's IP and MAC.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['hotspot / tethering (điểm phát / chia sẻ mạng)', 'A device routes and NATs other devices\' traffic through its own connection.'],
    ['ip_forward', 'Kernel switch: pass on packets that are not for this machine.'],
    ['MASQUERADE', 'NAT that rewrites the source to the address of the outgoing card.'],
    ['conntrack', 'The kernel\'s table of connections and their NAT translations.'],
    ['TTL normalisation', 'Rewriting TTL on the way out (mangle POSTROUTING) so shared traffic looks like the router\'s own.'],
    ['source guard (chống giả nguồn)', 'Dropping packets whose source address does not belong to the network.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A hotspot is a small router: second card + forwarding + MASQUERADE.</li>
<li>Without NAT the shared devices' private addresses are dropped or unroutable; with NAT, conntrack remembers who gets each reply.</li>
<li>TTL 63/127 betrays sharing; rewriting TTL hides that one clue, not TCP timestamps and the rest.</li>
<li>An open hotspot lends your identity: strangers leave with your IP, MAC and school account — use WPA2/WPA3 and a real passphrase.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 What the school network blocks</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 School Wi-Fi and MAC</a> · <a href="${bai('netdev-2-2-dinh-tuyen')}">2.2 Routing and TTL</a> · <a href="${bai('netdev-14-4-vpn')}">14.4 VPNs</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc2827', '📄', 'RFC 2827 (BCP 38) — Network Ingress Filtering', 'Why networks drop packets with source addresses that are not theirs.', 'Open')}
${L('https://support.microsoft.com/en-us/windows/use-your-windows-pc-as-a-mobile-hotspot-c89b0fad-72d5-41e8-f7ea-406ad9036b85', '📄', 'Microsoft — Use your Windows PC as a mobile hotspot', 'Settings, passwords, connected devices.', 'Open')}
${L('https://support.apple.com/guide/mac-help/share-internet-connection-mac-network-users-mchlp1540/mac', '📄', 'Apple — Share your Mac\'s internet connection', 'Internet Sharing in System Settings.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Chia sẻ mạng và điểm phát: laptop thành một router</h2>
<p class="lead">"Bật điểm phát cho tớ dùng ké 4G với" — "chia Wi-Fi của laptop sang điện thoại". Hai câu đó nghĩa là một: một thiết bị trở thành <strong>router có NAT</strong> cho các thiết bị khác, y như router nhà ở bài 2.3. Bài này mở cái router đó ra ngay trên laptop của bài 14.2 — và đo xem vì sao trường nhận ra, NAT thật sự làm gì, và một người lạ trên điểm phát không mật khẩu làm gì dưới tên bạn.</p>

<h3>Hình dung đời thường</h3>
<ul>
<li><strong>Điểm phát</strong> là một người bạn có thẻ thành viên dẫn khách vào: cửa chỉ thấy một thẻ.</li>
<li><strong>NAT</strong> là người bạn đó ghi tên khách vào sổ <em>bằng chính tên mình</em>, và giữ một mẩu ghi chú ai gọi món gì để đưa trả đúng người — mẩu ghi chú đó là <strong>conntrack</strong>.</li>
<li><strong>TTL</strong> là con số trên mỗi gói mà router nào cũng trừ đi một: khách đi qua người bạn sẽ tới nơi với số nhỏ hơn một.</li>
</ul>

<h3>1 — "Mobile Hotspot" thật ra bật những gì</h3>
${R('c145-nat', 'ip -br', 3)}
<p>Ba thứ, đều đã gặp ở các chương trước: một card mạng thứ hai <code>hs</code> (192.168.137.1/24 — dải Windows luôn dùng), <strong>chuyển tiếp</strong> giữa các card (<code>ip_forward = 1</code>: laptop giờ chuyển giúp cả những gói không dành cho nó), và một dòng <strong>MASQUERADE</strong>: thứ gì từ 192.168.137.0/24 đi ra card trường sẽ mang địa chỉ của laptop làm nguồn. Trên máy của bạn:</p>
${OS_CMD}
${net('nat', 'home', 'vi', 'Đúng kiểu NAT laptop làm cho điểm phát: xem địa chỉ và cổng nguồn bị viết lại, và một dòng conntrack được tạo.', { tour: 'nat-home' })}

<h3>2 — Điện thoại chết: TTL làm lộ</h3>
${R('c145-dt-ttl', 'curl', 1)}
<p>Laptop có Internet; điện thoại phía sau thì không. Đó là luật của bài 14.2 — trường bỏ gói tới nơi với TTL 63, dấu vân tay của "một thiết bị đứng sau một thiết bị". Cách người ta hay dùng là cho mọi gói rời laptop với cùng một TTL:</p>
${R('c145-ttl-win', 'iptables -t mangle -A', 3)}
${R('c145-dt-ok', 'curl', 1)}
<p>Điện thoại chạy. Trên bộ điều khiển của trường:</p>
${R('c145-ttl-gw', 'tshark', 2)}
<p>Cả hai gói SYN giờ đều TTL 64 — nhưng nhìn cột cuối: hai đồng hồ timestamp TCP cách nhau hàng tỉ, tức vẫn là hai máy sau một IP và một MAC. Và bộ đếm của luật TTL cho thấy 5 gói của lần thử đầu của điện thoại (SYN cộng các lần gửi lại) đã bị bắt. TTL là manh mối rẻ nhất, không phải duy nhất: timestamp, hệ điều hành trong User-Agent, số kết nối, các tên DNS đặc trưng của điện thoại. Nhà mạng di động dùng đúng những manh mối này để áp giới hạn "điểm phát"; điều khoản hợp đồng của họ quyết định cái gì được phép — hãy đọc gói cước của bạn, và nơi nào trường hay nhà mạng cấm rõ việc chia sẻ thì theo quy định.</p>
${net('block', 'hotspot', 'vi', 'Điện thoại sau điểm phát của laptop: so TTL bộ điều khiển thấy, rồi bật luật TTL.', { tour: 'block-hotspot' })}

<h3>3 — Không có NAT, điện thoại là người lạ</h3>
<p>Dòng MASQUERADE thật ra đem lại gì? Gỡ nó đi (chuyển tiếp vẫn bật):</p>
${R('c145-bo-nat', 'iptables', 1)}
${R('c145-dt-khongnat', 'curl', 1)}
${R('c145-gw-thay', 'tshark', 1)}
<p>Gói của điện thoại giờ tới trường với địa chỉ nguồn thật, 192.168.137.50 — một địa chỉ trường chưa từng cấp và không thể định tuyến ngược về. Bộ điều khiển bỏ chúng (bộ điều khiển thật làm đúng việc này: <em>source guard</em> — chỉ nhận nguồn thuộc mạng của mình, BCP 38). Năm gói SYN, không trả lời. NAT là thứ làm cho mạng điểm phát riêng của bạn vừa vô hình vừa đi được. Trả nó lại và đọc mẩu ghi chú nó giữ:</p>
${R('c145-them-nat', 'iptables', 1)}
${R('c145-ct', 'conntrack', 2)}
<p>Mỗi kết nối là hai dòng: chiều gốc của điện thoại (192.168.137.50 → web) và chiều trả lời laptop chờ đợi (web → <strong>10.20.2.159</strong>, cùng cổng). Khi trả lời về, nhân tra bảng này và viết lại về điện thoại. Bảng nằm trong RAM của laptop; một điện thoại nhiều ứng dụng có thể giữ hàng trăm dòng — trên router rẻ tiền, bảng conntrack đầy là kinh điển "cả nhà về là mạng đứng".</p>

<h3>4 — Điện thoại phát cho laptop, USB, và vì sao laptop không phải lúc nào cũng chia được Wi-Fi</h3>
<ul>
<li><strong>Điện thoại chia 4G cho laptop</strong> (Điểm truy cập cá nhân / Wi-Fi hotspot): ba thứ trên xảy ra trên điện thoại; laptop nhận 172.20.10.x (iPhone) hoặc 192.168.43.x hay tương tự (Android). Nhà mạng có thể thấy TTL 63/127 — xem ở trên.</li>
<li><strong>Chia sẻ qua USB</strong> là cùng kiểu NAT nhưng bằng dây: không sóng, độ trễ thấp hơn, sạc luôn điện thoại, không ai khác vào được. Thường là lựa chọn tốt nhất khi phải deploy lúc ngồi xe.</li>
<li><strong>"Chia Wi-Fi sang Wi-Fi"</strong> cần một card vừa làm máy khách ở một mạng vừa làm điểm phát cùng lúc, thường phải cùng kênh; nhiều card laptop không làm được (Linux cho xem trong <code>iw list</code>, mục "valid interface combinations"). Internet Sharing của Apple được thiết kế để chia một kết nối <em>có dây</em> hay kết nối khác ra Wi-Fi. Ta không đo được hành vi sóng trong container — phần này giải thích, chưa đo.</li>
</ul>

<h3>🕵️ Góc kẻ xấu — người lạ trên điểm phát không mật khẩu</h3>
<p>Điểm phát của bạn không đặt mật khẩu (hoặc "12345678"). Điện thoại của một người lạ vào:</p>
${R('c145-ke', 'ip', 2)}
${R('c145-ke-win', 'ip neigh', 2)}
${R('c145-ke-gw', 'cat', 2)}
<p>Với trường, lưu lượng của người lạ mang IP và MAC của laptop, và tài khoản duy nhất gắn với MAC đó là <strong>SE12345 — của bạn</strong> (bài 14.1). Họ tải gì, đăng gì, tấn công gì đều được ghi dưới tên bạn. Ngay trên điểm phát, họ ở cùng mạng với điện thoại của bạn, quét được nó, và với Wi-Fi mở (không mã hoá), ai ở gần cũng đọc được lưu lượng không mã hoá từ trên không. Cách phòng:</p>
<ul>
<li>WPA2, tốt hơn là WPA3, với mật khẩu dài do bạn tự chọn — đừng dùng mật khẩu mặc định in sẵn.</li>
<li>Xem danh sách thiết bị đang nối (Windows có hiện; trên Linux <code>ip neigh show dev …</code> như trên) và tắt điểm phát khi xong việc.</li>
<li>Tên điểm phát (SSID) không lộ bạn là ai; đừng chia sẻ nó trong một nhóm chat đông người.</li>
</ul>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…điểm phát của laptop chạy ở nhà mà ở trường không?</strong> Đi theo bảng kiểm 14.2: bị phát hiện bằng TTL, hoặc card không chia được chính mạng nó đang nối.</li>
<li><strong>…hai điểm phát, hai lớp NAT?</strong> (điện thoại → laptop → điện thoại khác) Vẫn chạy; mỗi lớp trừ TTL và thêm một dòng conntrack; gỡ lỗi khó gấp đôi.</li>
<li><strong>…điểm phát của điện thoại rớt khi tắt màn hình?</strong> Do tiết kiệm pin; cắm sạc hoặc dùng USB.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><code>ip_forward</code> là một công tắc của nhân; MASQUERADE và luật TTL là luật netfilter (bảng <code>nat</code> và <code>mangle</code>).</li>
<li>Bảng conntrack là một bảng băm trong RAM của nhân (<code>conntrack -C</code> đếm số dòng; <code>nf_conntrack_max</code> là giới hạn).</li>
<li>TTL là một byte của header IP; timestamp TCP là một tuỳ chọn trong header TCP do đồng hồ riêng của từng máy đặt.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> điện thoại của bạn bè sau điểm phát laptop của bạn "không có mạng". Lab: <code>CHI=145 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>Trên <code>nft-win</code>, liệt kê ba thứ điểm phát đã bật.</li>
<li>Từ <code>nft-phone</code>, tái hiện lỗi và tìm luật cùng bộ đếm trên <code>nft-gw</code> giải thích nó.</li>
<li>Gỡ dòng MASQUERADE, chỉ ra bộ điều khiển nhận được gì, rồi trả lại.</li>
<li>Xem các dòng conntrack của điện thoại và giải thích hai dòng của một kết nối.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi bước có lệnh và output thật, và bạn nói được manh mối nào ngoài TTL vẫn làm lộ điện thoại.</p>
<details><summary>Lời giải</summary><p>1: card hs 192.168.137.1/24, <code>net.ipv4.ip_forward = 1</code>, <code>-A POSTROUTING -s 192.168.137.0/24 -o sv -j MASQUERADE</code>. 2: <code>iptables -t mangle -L PREROUTING -v -n</code> trên nft-gw — bộ đếm "DROP TTL == 63" tăng. 3: <code>tshark</code>/<code>tcpdump</code> ở sv0 thấy nguồn 192.168.137.50, bị bỏ. 4: chiều gốc điện thoại → web, chiều trả lời web → 10.20.2.159 cùng cổng. Manh mối khác: đồng hồ timestamp TCP.</p></details>
</div>

<details><summary>🧠 Tự kiểm (4 câu)</summary>
<ol>
<li>Kể ba thứ điểm phát bật lên. — <em>Card thứ hai, chuyển tiếp, NAT (MASQUERADE).</em></li>
<li>Vì sao điện thoại sau laptop tới nơi với TTL 63? — <em>Laptop định tuyến nó và trừ TTL đi một.</em></li>
<li>Chuẩn hoá TTL về 64 rồi, còn gì phân biệt được hai máy? — <em>Timestamp TCP, User-Agent, số kết nối, tên DNS đặc trưng của điện thoại.</em></li>
<li>Người lạ dùng điểm phát mở của bạn ở trường. Trường ghi tài khoản của ai? — <em>Của bạn: họ đi ra bằng IP và MAC của laptop.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['hotspot / tethering (điểm phát / chia sẻ mạng)', 'Một thiết bị định tuyến và NAT lưu lượng của thiết bị khác qua kết nối của nó.'],
    ['ip_forward', 'Công tắc của nhân: chuyển giúp gói không dành cho máy này.'],
    ['MASQUERADE', 'NAT viết lại nguồn thành địa chỉ của card đi ra.'],
    ['conntrack', 'Bảng kết nối của nhân cùng các bản dịch NAT.'],
    ['chuẩn hoá TTL', 'Viết lại TTL lúc đi ra (mangle POSTROUTING) để lưu lượng chia sẻ trông như của chính router.'],
    ['source guard (chống giả nguồn)', 'Bỏ gói có địa chỉ nguồn không thuộc mạng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Điểm phát là một router nhỏ: card thứ hai + chuyển tiếp + MASQUERADE.</li>
<li>Không có NAT, địa chỉ riêng của thiết bị chia sẻ bị bỏ hoặc không định tuyến được; có NAT, conntrack nhớ ai nhận trả lời nào.</li>
<li>TTL 63/127 làm lộ việc chia sẻ; viết lại TTL chỉ giấu manh mối đó, không giấu timestamp TCP và các thứ khác.</li>
<li>Điểm phát mở là cho mượn danh tính: người lạ đi ra bằng IP, MAC và tài khoản trường của bạn — dùng WPA2/WPA3 và mật khẩu thật.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 Mạng trường chặn gì</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 Wi-Fi trường và MAC</a> · <a href="${bai('netdev-2-2-dinh-tuyen')}">2.2 Định tuyến và TTL</a> · <a href="${bai('netdev-14-4-vpn')}">14.4 VPN</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc2827', '📄', 'RFC 2827 (BCP 38) — Lọc ở cửa vào mạng', 'Vì sao mạng bỏ gói có địa chỉ nguồn không thuộc nó.', 'Mở')}
${L('https://support.microsoft.com/en-us/windows/use-your-windows-pc-as-a-mobile-hotspot-c89b0fad-72d5-41e8-f7ea-406ad9036b85', '📄', 'Microsoft — Dùng PC Windows làm điểm phát di động', 'Cài đặt, mật khẩu, thiết bị đang nối.', 'Mở')}
${L('https://support.apple.com/guide/mac-help/share-internet-connection-mac-network-users-mchlp1540/mac', '📄', 'Apple — Chia sẻ kết nối Internet của Mac', 'Internet Sharing trong Cài đặt hệ thống.', 'Mở')}
</div>
`,
};
