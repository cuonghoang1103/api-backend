/**
 * NWC204 · Chapter 11 — IPv6 Addressing (Cisco Module 12).
 * FLM buổi 35–36.
 *
 * Slide: scripts/slides-src/nwc204-ch11.mjs → deck 'nwc204-ch11', 27 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 12: 13 địa chỉ fe80:: có sẵn trên
 *     một VPS thật mà không ai cấu hình, EUI-64 kiểm NGƯỢC từ MAC thật của router
 *     thượng nguồn (96:3d:fa:00:04:e9 → fe80::943d:faff:fe00:4e9, khớp từng byte),
 *     nginx đã `listen [::]` sẵn, bẫy ::1 so với 127.0.0.1, và `%eth0` bắt buộc.
 *
 * ⚠️ MỌI địa chỉ trong file này đã kiểm bằng python3 ipaddress. Bộ tính
 *    solicited-node đã TỰ NGHIỆM THU bằng ví dụ của RFC 4291 trước khi dùng —
 *    bản đầu thiếu một byte `ff` và ra kết quả trông hợp lý mà SAI.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 35 liệt kê "11.1 IPv6 Addressing" rồi lại "11.3 IPv6 Addressing" —
 *     TRÙNG TÊN, không có mục nào khác xen giữa ngoài "11.2 IPv4 Issues".
 *   - Buổi 35 mang CQ12.2, mà nội dung câu đó hỏi tính địa chỉ **IPv4** tối ưu
 *     cho công ty nhiều phòng ban ⇒ đó là VLSM của chương 10, đã trả lời ở 10.2.
 *   - Buổi 36 KHÔNG có câu hỏi kiến tạo nào (một trong tám buổi bỏ trống:
 *     6, 9, 15, 16, 22, 30, 36, 56).
 *   - Ba câu của chương 12 (buổi 37–39: CQ13.1, CQ13.2, CQ13.3) thật ra đều hỏi
 *     nội dung của CHƯƠNG NÀY. Độ trôi ~một chương vẫn giữ nguyên từ buổi 19.
 *
 * ⚠️ File này CHỈ chứa chương 11. Đừng sửa NWC204.mjs ở đây.
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng `].join('\n'),` — nếu không thì
 *    lesson.content là ARRAY, và academy-ra-soat.mjs đổ ở dòng 52.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch11', {
  code: 'NWC204',
  en: 'IPv6 Addressing',
  vi: 'Địa chỉ IPv6',
  total: 27,
});

/* ──────────────────────── Lesson 11.1 — session 35 ─────────────────────── */

const L1 = {
  title: '11.1 — IPv6 address structure and types (FLM session 35)|||11.1 — Cấu trúc và các loại địa chỉ IPv6 (buổi 35 của FLM)',
  slug: 'nwc204-11-1-cau-truc-dia-chi-ipv6',
  type: 'DOCUMENT',
  description: 'Buổi 35: vì sao IPv4 cạn và cái giá thật của NAT, 128 bit viết thành tám hextet hệ thập lục phân, hai quy tắc rút gọn và vì sao chỉ được dùng một dấu :: duy nhất, /64 là ranh giới cứng chứ không phải lựa chọn, ba loại địa chỉ unicast/multicast/anycast và vì sao IPv6 BỎ HẲN broadcast, GUA 2000::/3, LLA fe80::/10 luôn luôn có sẵn, ULA fc00::/7 và các địa chỉ đặc biệt. Kèm phần ★ đo trên máy chủ thật: 13 địa chỉ fe80:: mà không ai cấu hình, và không có địa chỉ toàn cục nào.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 11 · Lesson 11.1 · FLM session 35 of 60 · CLO5, CLO9 · Cisco Module 12</span>
<h2>The address that never runs out</h2>
<p class="lead">After this lesson you can compress and expand any IPv6 address by the two rules, name its type from the leading hextet alone, and explain why a prefix longer than /64 on a LAN quietly breaks everything.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 35 — "11. IPv6 Addressing · 11.1 IPv6 Addressing · 11.2 IPv4 Issues · 11.3 IPv6 Addressing · 11.4 IPv6 Address Types"</p>
<p><strong>Opening question.</strong> Run <code>ip -6 -br addr</code> on any Linux machine you own and you will see an address beginning <code>fe80::</code> on every single interface — including ones you have never configured, on a server whose provider gave you no IPv6 at all. Where did those addresses come from, who assigned them, and why can you not reach any of them from another machine on the Internet?</p>
<p>By the end of this lesson all three parts have answers, and the answers are the design of IPv6 rather than an accident of Linux.</p>
<div class="callout warn"><strong>Prerequisite.</strong> This chapter needs hexadecimal, from <strong>Chapter 4B — Number Systems</strong>. FPT schedules no session for Cisco Module 5, which is where hex is taught, so 4B exists on this site to fill that gap. Chapter 10 needed 4B for binary; this one needs it for hex.</div>
<div class="callout">⚠️ <strong>An anomaly in the published plan.</strong> Session 35 lists <strong>"11.1 IPv6 Addressing"</strong> and then, two entries later, <strong>"11.3 IPv6 Addressing"</strong> — the same title twice, with only "11.2 IPv4 Issues" between them. We teach what is listed and report the duplication rather than inventing a section to fill it.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 12.</p>`,
      `<span class="eyebrow">NWC204 · Chương 11 · Bài 11.1 · Buổi 35/60 của FLM · CLO5, CLO9 · Cisco Module 12</span>
<h2>Cái địa chỉ không bao giờ cạn</h2>
<p class="lead">Học xong bài này bạn rút gọn và khai triển được bất kỳ địa chỉ IPv6 nào theo đúng hai quy tắc, nhìn hextet đầu là gọi tên được loại địa chỉ, và giải thích được vì sao một tiền tố dài hơn /64 trên mạng LAN lại làm hỏng mọi thứ một cách lặng lẽ.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 35 — "11. IPv6 Addressing · 11.1 IPv6 Addressing · 11.2 IPv4 Issues · 11.3 IPv6 Addressing · 11.4 IPv6 Address Types"</p>
<p><strong>Câu hỏi mở đầu.</strong> Chạy <code>ip -6 -br addr</code> trên bất kỳ máy Linux nào của bạn là thấy một địa chỉ bắt đầu bằng <code>fe80::</code> trên từng cổng một — kể cả những cổng bạn chưa bao giờ cấu hình, trên một máy chủ mà nhà cung cấp không hề cấp IPv6 nào. Mấy địa chỉ đó ở đâu ra, ai gán chúng, và vì sao bạn không tới được cái nào trong số đó từ một máy khác trên Internet?</p>
<p>Hết bài này thì cả ba phần đều có lời giải, và lời giải là thiết kế của IPv6 chứ không phải một sự tình cờ của Linux.</p>
<div class="callout warn"><strong>Điều kiện cần trước.</strong> Chương này cần hệ thập lục phân, từ <strong>Chương 4B — Hệ đếm</strong>. Trường không xếp buổi nào cho Cisco Module 5 — nơi dạy hệ hex — nên 4B tồn tại trên trang này để bù vào. Chương 10 cần 4B cho hệ nhị phân; chương này cần nó cho hệ hex.</div>
<div class="callout">⚠️ <strong>Một chỗ bất thường trong kế hoạch đã công bố.</strong> Buổi 35 ghi <strong>"11.1 IPv6 Addressing"</strong> rồi hai mục sau lại ghi <strong>"11.3 IPv6 Addressing"</strong> — cùng một tiêu đề hai lần, giữa chúng chỉ có "11.2 IPv4 Issues". Chúng tôi dạy đúng những gì được liệt kê và nêu chỗ trùng ấy ra, thay vì bịa một mục để lấp vào.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 12.</p>`,
    ),

    walkHead('nwc204-ch11', 1, 12,
      'Slides 1–12 cover FLM session 35: 11.2 IPv4 Issues, 11.1/11.3 IPv6 Addressing, 11.4 IPv6 Address Types.',
      'Slide 1–12 là buổi 35 của FLM: 11.2 Vấn đề của IPv4, 11.1/11.3 Địa chỉ IPv6, 11.4 Các loại địa chỉ IPv6.'),

    walk('nwc204-ch11', [
      [1, 'Cover — Chapter 11, IPv6 Addressing',
        `<p>Chapter 11 is <strong>Cisco Module 12</strong>, and FPT gives it two sessions — a quarter of what Chapter 10 received.</p>
<ul>
<li>Session 35 — 11.1 IPv6 Addressing, 11.2 IPv4 Issues, 11.3 IPv6 Addressing, 11.4 Address Types.</li>
<li>Session 36 — 11.5 static GUA and LLA, 11.6–11.7 dynamic addressing, 11.8 multicast, 11.9 subnetting, 11.10 AI tools.</li>
<li>Outcomes: <strong>CLO5</strong> "design and implement IPv4 <em>and IPv6</em> addressing schemes", and <strong>CLO9</strong>.</li>
</ul>
<p><strong>Why two sessions is enough.</strong> The hard work was Chapter 10. Prefix, network portion, host portion, and the habit of thinking in bits all carry over unchanged. What changes is the size — 128 bits instead of 32 — and the notation. And one thing gets genuinely <em>easier</em>: there is no VLSM in IPv6, and no subtracting two.</p>`,
        `<p>Chương 11 là <strong>Module 12 của Cisco</strong>, và trường xếp cho nó hai buổi — bằng một phần tư số buổi của Chương 10.</p>
<ul>
<li>Buổi 35 — 11.1 Địa chỉ IPv6, 11.2 Vấn đề của IPv4, 11.3 Địa chỉ IPv6, 11.4 Các loại địa chỉ.</li>
<li>Buổi 36 — 11.5 GUA và LLA tĩnh, 11.6–11.7 cấp địa chỉ động, 11.8 multicast, 11.9 chia subnet, 11.10 công cụ AI.</li>
<li>Chuẩn đầu ra: <strong>CLO5</strong> "thiết kế và triển khai sơ đồ địa chỉ IPv4 <em>và IPv6</em>", và <strong>CLO9</strong>.</li>
</ul>
<p><strong>Vì sao hai buổi là đủ.</strong> Phần nặng đã xong ở Chương 10. Tiền tố, phần mạng, phần host, và thói quen nghĩ theo bit đều chuyển sang nguyên vẹn. Thứ thay đổi là kích cỡ — 128 bit thay vì 32 — và cách ký hiệu. Và có một thứ thật sự <em>dễ hơn</em>: IPv6 không có VLSM, cũng không có phép trừ hai.</p>`],

      [2, 'What the two sessions cover, and the duplicate title',
        `<p>The six sections of session 36 are all about putting addresses onto interfaces; session 35 is about what an address <em>is</em>.</p>
<p><strong>The anomaly worth naming.</strong> Session 35 lists "11.1 IPv6 Addressing" and "11.3 IPv6 Addressing" — identical titles. There is no way to tell from the published plan what the difference between them is meant to be. Cisco's Module 12 has 11.1 as an introduction and the substantive address-format material later, so the most likely reading is that 11.1 is the module opener and 11.3 is the address structure itself. We teach the material once, properly, and note the duplication.</p>
<p><strong>What carries over from Chapter 10.</strong> A prefix is still a count of leading bits. A network portion is still shared by every host on the link. The difference is that in IPv6 the boundary is almost always at exactly 64, so the arithmetic that dominated Chapter 10 mostly disappears.</p>`,
        `<p>Sáu mục của buổi 36 đều nói về việc đặt địa chỉ lên cổng; buổi 35 nói về địa chỉ <em>là cái gì</em>.</p>
<p><strong>Chỗ bất thường đáng gọi tên.</strong> Buổi 35 ghi "11.1 IPv6 Addressing" và "11.3 IPv6 Addressing" — hai tiêu đề giống hệt. Không có cách nào từ kế hoạch đã công bố mà biết được hai mục ấy khác nhau ở đâu. Module 12 của Cisco có 11.1 là phần mở đầu và phần nội dung về định dạng địa chỉ nằm sau, nên cách đọc hợp lý nhất là 11.1 mở module còn 11.3 mới là cấu trúc địa chỉ. Chúng tôi dạy phần nội dung một lần cho tử tế, và nêu chỗ trùng ấy ra.</p>
<p><strong>Thứ chuyển sang từ Chương 10.</strong> Tiền tố vẫn là số bit đầu. Phần mạng vẫn là thứ mọi host trên cùng một link chia sẻ. Khác biệt là trong IPv6 thì ranh giới gần như luôn nằm đúng ở 64, nên phần số học vốn chiếm cả Chương 10 hầu như biến mất.</p>`],

      [3, '11.2 Why IPv4 ran out, and what NAT really cost',
        `<p>The arithmetic was always going to end badly. 2^32 is 4,294,967,296 addresses, for a planet with 8 billion people and several devices each. IANA allocated its last blocks in <strong>2011</strong>.</p>
<p><strong>Two patches bought time.</strong> NAT let many private hosts share one public address, and it worked so well that it delayed IPv6 by two decades. When that ran out, carriers added <strong>CGNAT</strong> — 100.64.0.0/10, from Chapter 10 — so that even the customer's router gets a private address.</p>
<p><strong>The real cost is end-to-end connectivity.</strong> Behind NAT, a host can start a connection outward but nothing can start a connection inward without a forwarding rule somebody configured. Behind CGNAT it is worse: there is no public address to forward <em>from</em>, so port forwarding is impossible no matter what you configure. Every service that needs to be reachable then has to be reached through somebody else's relay.</p>
<p>IPv6 does not make NAT better. It makes NAT unnecessary, by having enough addresses that every device can have its own.</p>`,
        `<p>Phép tính kiểu gì cũng phải kết thúc tệ. 2^32 là 4.294.967.296 địa chỉ, cho một hành tinh 8 tỷ người mà mỗi người vài thiết bị. IANA cấp phát những khối cuối cùng vào năm <strong>2011</strong>.</p>
<p><strong>Hai bản vá mua thêm thời gian.</strong> NAT cho phép nhiều host riêng dùng chung một địa chỉ công cộng, và nó hiệu quả tới mức làm chậm IPv6 mất hai thập kỷ. Khi cách đó cũng cạn, nhà mạng thêm <strong>CGNAT</strong> — 100.64.0.0/10, đã gặp ở Chương 10 — nên đến cả router của khách hàng cũng chỉ được một địa chỉ riêng.</p>
<p><strong>Cái giá thật là kết nối đầu-cuối.</strong> Đứng sau NAT, một host mở được kết nối ra ngoài nhưng không gì mở được kết nối vào trong nếu không có một luật chuyển tiếp do ai đó cấu hình. Đứng sau CGNAT thì tệ hơn: không có địa chỉ công cộng nào để mà chuyển tiếp <em>từ đó</em>, nên chuyển tiếp cổng là bất khả bất kể bạn cấu hình gì. Khi ấy mọi dịch vụ cần tới được đều phải đi qua máy trung chuyển của người khác.</p>
<p>IPv6 không làm NAT tốt lên. Nó làm NAT trở nên không cần thiết, bằng cách có đủ địa chỉ để mọi thiết bị đều có địa chỉ của riêng mình.</p>`],

      [4, 'The scale of the change',
        `<p>128 bits is not four times 32 bits. It is four times the <em>exponent</em>, and that is a different kind of number.</p>
<ul>
<li>IPv4: <strong>4,294,967,296</strong> addresses — fewer than there are people.</li>
<li>IPv6: <strong>340,282,366,920,938,463,463,374,607,431,768,211,456</strong>.</li>
</ul>
<p><strong>The number that makes it concrete.</strong> A single /64 subnet — the standard size for one LAN — holds 18,446,744,073,709,551,616 addresses. That one subnet is <strong>4,294,967,296 times</strong> the entire IPv4 Internet. Every LAN in IPv6 gets more addresses than IPv4 ever had, four billion times over.</p>
<p><strong>The consequence for how you think.</strong> In IPv4 you subnetted to <em>save</em> addresses, and VLSM existed because waste was expensive. In IPv6 you never subnet to save anything. You subnet to organise — to give a site, a floor or a VLAN a number a human can read.</p>`,
        `<p>128 bit không phải là bốn lần 32 bit. Nó là bốn lần cái <em>số mũ</em>, và đó là một loại con số khác hẳn.</p>
<ul>
<li>IPv4: <strong>4.294.967.296</strong> địa chỉ — ít hơn số người trên đời.</li>
<li>IPv6: <strong>340.282.366.920.938.463.463.374.607.431.768.211.456</strong>.</li>
</ul>
<p><strong>Con số làm chuyện đó thành cụ thể.</strong> Một subnet /64 duy nhất — cỡ chuẩn cho một mạng LAN — chứa 18.446.744.073.709.551.616 địa chỉ. Đúng một cái subnet đó lớn gấp <strong>4.294.967.296 lần</strong> toàn bộ Internet IPv4. Mỗi mạng LAN trong IPv6 có nhiều địa chỉ hơn cả IPv4 từng có, gấp bốn tỷ lần.</p>
<p><strong>Hệ quả lên cách bạn suy nghĩ.</strong> Trong IPv4 bạn chia subnet để <em>tiết kiệm</em> địa chỉ, và VLSM tồn tại vì lãng phí thì đắt. Trong IPv6 bạn không bao giờ chia subnet để tiết kiệm gì cả. Bạn chia để sắp xếp — để cho một cơ sở, một tầng hay một VLAN một con số mà con người đọc được.</p>`],

      [5, '11.1 The structure: 128 bits as eight hextets',
        `<p>An IPv6 address is 128 bits, written as <strong>eight groups of four hexadecimal digits</strong> separated by colons. Each group is called a <strong>hextet</strong>. Each hex digit is 4 bits, so four digits make 16 bits, and eight groups make 128.</p>
<p><code>2001:0db8:acad:0001:0000:0000:0000:0100</code></p>
<p><strong>The split.</strong> The first 64 bits are the <strong>prefix</strong> — which network. The last 64 are the <strong>interface ID</strong> — which host on it. Unlike IPv4, where the boundary moved wherever the mask said, in IPv6 it is at 64 almost always, and the next slides explain why that is a rule rather than a habit.</p>
<p><strong>This is why Chapter 4B taught hexadecimal.</strong> Writing 128 bits in binary would be 128 characters of ones and zeros. Hex compresses four bits into one character, which is exactly why it was chosen — and why you need to be able to read <code>acad</code> as 1010 1100 1010 1101 without stopping to think.</p>`,
        `<p>Một địa chỉ IPv6 là 128 bit, viết thành <strong>tám nhóm bốn chữ số thập lục phân</strong> ngăn nhau bằng dấu hai chấm. Mỗi nhóm gọi là một <strong>hextet</strong>. Mỗi chữ số hex là 4 bit, nên bốn chữ số thành 16 bit, và tám nhóm thành 128.</p>
<p><code>2001:0db8:acad:0001:0000:0000:0000:0100</code></p>
<p><strong>Chỗ chia.</strong> 64 bit đầu là <strong>tiền tố</strong> — mạng nào. 64 bit cuối là <strong>interface ID</strong> — host nào trong mạng đó. Khác với IPv4, nơi ranh giới dịch tới đâu là do mặt nạ quyết định, trong IPv6 nó gần như luôn nằm ở 64, và mấy slide sau giải thích vì sao đó là một quy tắc chứ không phải một thói quen.</p>
<p><strong>Đây là lý do Chương 4B dạy hệ thập lục phân.</strong> Viết 128 bit dưới dạng nhị phân là 128 ký tự số 0 và 1. Hệ hex nén bốn bit thành một ký tự, và đó chính là lý do nó được chọn — cũng là lý do bạn cần đọc <code>acad</code> thành 1010 1100 1010 1101 mà không phải dừng lại nghĩ.</p>`],

      [6, 'Compressing an address — exactly two rules',
        `<p>Nobody writes the full form. Two rules shorten it, applied in this order.</p>
<p><strong>Rule 1 — drop leading zeros inside each hextet.</strong> <code>0db8</code> becomes <code>db8</code>, <code>0001</code> becomes <code>1</code>, <code>0000</code> becomes <code>0</code>. Leading only: <code>0100</code> becomes <code>100</code>, never <code>1</code>.</p>
<p><strong>Rule 2 — replace one run of all-zero hextets with <code>::</code>.</strong> So <code>2001:db8:acad:1:0:0:0:100</code> becomes <code>2001:db8:acad:1::100</code>.</p>
<p><strong>Why <code>::</code> may appear only once.</strong> The double colon means "as many zero hextets as are needed to make eight". With one of them, a parser counts the hextets present and fills in the rest. With two, there is no way to know how the missing hextets divide between them — <code>2001:db8::acad::1</code> could mean several different addresses, so it is simply invalid.</p>
<p><strong>The mistake to avoid.</strong> Dropping <em>trailing</em> zeros. <code>0100</code> is 256; <code>01</code> would be 1. They are different addresses and the shortening is silent.</p>`,
        `<p>Không ai viết dạng đầy đủ cả. Hai quy tắc rút ngắn nó, áp theo đúng thứ tự này.</p>
<p><strong>Quy tắc 1 — bỏ các số 0 ĐỨNG ĐẦU trong từng hextet.</strong> <code>0db8</code> thành <code>db8</code>, <code>0001</code> thành <code>1</code>, <code>0000</code> thành <code>0</code>. Chỉ số 0 đứng đầu thôi: <code>0100</code> thành <code>100</code>, không bao giờ thành <code>1</code>.</p>
<p><strong>Quy tắc 2 — thay MỘT dãy các hextet toàn số 0 bằng <code>::</code>.</strong> Vậy <code>2001:db8:acad:1:0:0:0:100</code> thành <code>2001:db8:acad:1::100</code>.</p>
<p><strong>Vì sao <code>::</code> chỉ được xuất hiện một lần.</strong> Dấu hai chấm đôi có nghĩa "bao nhiêu hextet 0 cũng được, miễn đủ tám". Có một cái thì bộ phân tích đếm số hextet đang có rồi bù phần còn lại. Có hai cái thì không có cách nào biết số hextet thiếu chia ra sao giữa chúng — <code>2001:db8::acad::1</code> có thể là vài địa chỉ khác nhau, nên nó đơn giản là không hợp lệ.</p>
<p><strong>Cái sai cần tránh.</strong> Bỏ số 0 ở <em>đuôi</em>. <code>0100</code> là 256; <code>01</code> sẽ là 1. Hai địa chỉ khác nhau, và phép rút gọn đó im lặng.</p>`],

      [7, 'Compression, worked both directions',
        `<p>Read the table until the pattern is automatic. An exam asks both directions, and the compressed form it expects is the <em>canonical</em> one — shortest, with the <code>::</code> on the longest zero run.</p>
<ul>
<li><code>2001:0db8:0000:0000:0000:0000:0000:0001</code> → <code>2001:db8::1</code></li>
<li><code>2001:0db8:acad:0001:0000:0000:0000:0100</code> → <code>2001:db8:acad:1::100</code></li>
<li><code>fe80:0000:0000:0000:49ae:5537:795c:ff65</code> → <code>fe80::49ae:5537:795c:ff65</code></li>
<li>all zeros but the last bit → <code>::1</code>, the loopback</li>
<li>all zeros → <code>::</code>, the unspecified address</li>
</ul>
<p>The third one is a real address, read off a production server. ★ Every Linux interface in the world carries something that looks like it, and the last lesson section explains where the digits come from.</p>
<p><strong>Check yourself with a command, not with a feeling:</strong> <code>python3 -c "import ipaddress as i; print(i.ip_address('2001:0db8:acad:0001:0000:0000:0000:0100').compressed)"</code> prints the canonical form, which is the one to write down.</p>`,
        `<p>Đọc bảng này cho tới khi quy luật thành phản xạ. Đề thi hỏi cả hai chiều, và dạng rút gọn mà nó mong đợi là dạng <em>chuẩn tắc</em> — ngắn nhất, với dấu <code>::</code> đặt ở dãy số 0 dài nhất.</p>
<ul>
<li><code>2001:0db8:0000:0000:0000:0000:0000:0001</code> → <code>2001:db8::1</code></li>
<li><code>2001:0db8:acad:0001:0000:0000:0000:0100</code> → <code>2001:db8:acad:1::100</code></li>
<li><code>fe80:0000:0000:0000:49ae:5537:795c:ff65</code> → <code>fe80::49ae:5537:795c:ff65</code></li>
<li>toàn số 0 trừ bit cuối → <code>::1</code>, địa chỉ loopback</li>
<li>toàn số 0 → <code>::</code>, địa chỉ chưa xác định</li>
</ul>
<p>Cái thứ ba là một địa chỉ thật, đọc ra từ một máy chủ sản xuất. ★ Mọi cổng mạng Linux trên đời đều mang một thứ trông như vậy, và phần cuối bài giải thích mấy chữ số đó ở đâu ra.</p>
<p><strong>Tự kiểm bằng câu lệnh, đừng kiểm bằng cảm giác:</strong> <code>python3 -c "import ipaddress as i; print(i.ip_address('2001:0db8:acad:0001:0000:0000:0000:0100').compressed)"</code> in ra dạng chuẩn tắc, và đó là dạng nên viết.</p>`],

      [8, 'Prefix lengths, and why /64 is a floor',
        `<p>Three prefix lengths do almost all the work.</p>
<ul>
<li><strong>/48</strong> — what a site typically receives. Leaves 16 bits of subnet ID, so 65,536 subnets.</li>
<li><strong>/56</strong> — what a home line typically receives. 256 subnets.</li>
<li><strong>/64</strong> — one subnet, one LAN. Always.</li>
</ul>
<p><strong>Why you must not go longer than /64 on a LAN.</strong> SLAAC — the mechanism by which a host builds its own address — assumes exactly 64 bits of interface ID, because that is how much an EUI-64 identifier needs. Configure a /80 on a LAN and hosts simply fail to get an address. There is no error message; the router accepts the configuration, the interface comes up, and nothing works. It is one of the few IPv6 failures that produces no diagnostic at all.</p>
<p><strong>The exceptions.</strong> <code>/127</code> on point-to-point router links, which is the IPv6 answer to the /30 and /31 discussion from Chapter 10, and <code>/128</code> on loopback interfaces. Neither is a LAN, so SLAAC is not involved.</p>`,
        `<p>Ba độ dài tiền tố gánh gần hết mọi việc.</p>
<ul>
<li><strong>/48</strong> — thứ một cơ sở thường được cấp. Còn lại 16 bit subnet ID, tức 65.536 subnet.</li>
<li><strong>/56</strong> — thứ một đường dây gia đình thường được cấp. 256 subnet.</li>
<li><strong>/64</strong> — một subnet, một mạng LAN. Luôn luôn.</li>
</ul>
<p><strong>Vì sao không được đi dài hơn /64 trên một LAN.</strong> SLAAC — cơ chế để host tự dựng địa chỉ cho mình — giả định đúng 64 bit interface ID, vì đó là số bit mà một định danh EUI-64 cần. Cấu hình một /80 trên LAN thì host đơn giản là không lấy được địa chỉ. Không có thông báo lỗi nào; router nhận cấu hình, cổng lên, và không gì chạy. Đó là một trong số ít cái hỏng của IPv6 hoàn toàn không sinh ra chẩn đoán nào.</p>
<p><strong>Các ngoại lệ.</strong> <code>/127</code> cho đường nối router điểm-điểm, chính là câu trả lời phía IPv6 cho phần bàn về /30 và /31 ở Chương 10, và <code>/128</code> cho cổng loopback. Cả hai đều không phải LAN, nên SLAAC không dính vào.</p>`],

      [9, '11.4 Three kinds of address, and no broadcast',
        `<p>IPv6 has <strong>unicast</strong>, <strong>multicast</strong> and <strong>anycast</strong>. It does not have broadcast, and the removal was deliberate.</p>
<ul>
<li><strong>Unicast</strong> — one interface. GUA (2000::/3), LLA (fe80::/10), ULA (fc00::/7).</li>
<li><strong>Multicast</strong> — a group of interfaces. ff00::/8.</li>
<li><strong>Anycast</strong> — looks exactly like a unicast address, but many hosts share it and the routing system delivers to the nearest. Used by DNS root servers and CDNs.</li>
</ul>
<p><strong>Why broadcast had to go.</strong> A broadcast interrupts every device on the link, including the ones that cannot possibly use the packet. On a busy LAN that is a real cost, paid by every host. Multicast does the same job better: a host that joined no group is never interrupted, because its network card filters the traffic in hardware before the CPU ever sees it.</p>
<p><code>ff02::1</code> — "all nodes on this link" — does what a broadcast did. The difference is that reaching it is a choice the receiver made, not an obligation.</p>`,
        `<p>IPv6 có <strong>unicast</strong>, <strong>multicast</strong> và <strong>anycast</strong>. Nó không có broadcast, và việc bỏ đi là có chủ ý.</p>
<ul>
<li><strong>Unicast</strong> — một cổng. GUA (2000::/3), LLA (fe80::/10), ULA (fc00::/7).</li>
<li><strong>Multicast</strong> — một nhóm cổng. ff00::/8.</li>
<li><strong>Anycast</strong> — nhìn y hệt một địa chỉ unicast, nhưng nhiều host cùng mang nó và hệ thống định tuyến giao tới cái gần nhất. Máy chủ gốc DNS và các CDN dùng cách này.</li>
</ul>
<p><strong>Vì sao broadcast phải ra đi.</strong> Một gói broadcast làm phiền mọi thiết bị trên link, kể cả những thiết bị không thể nào dùng được gói đó. Trên một LAN bận thì đó là một cái giá thật, và mọi host đều phải trả. Multicast làm cùng việc ấy tốt hơn: một host không tham gia nhóm nào thì không bao giờ bị làm phiền, vì card mạng của nó lọc lưu lượng ngay ở phần cứng trước khi CPU kịp thấy.</p>
<p><code>ff02::1</code> — "mọi node trên link này" — làm đúng việc mà broadcast từng làm. Khác biệt là việc nhận được nó là một lựa chọn của bên nhận, chứ không phải một nghĩa vụ.</p>`],

      [10, 'GUA — the address the Internet can reach',
        `<p>A <strong>Global Unicast Address</strong> is the IPv6 equivalent of a public IPv4 address, minus the scarcity and minus NAT. The range is <strong>2000::/3</strong>, which means the first three bits are 001 — so in practice a GUA starts with 2 or 3.</p>
<p><strong>Structure.</strong> 48 bits of global routing prefix (assigned to your site by your provider), 16 bits of subnet ID (yours to allocate), 64 bits of interface ID.</p>
<p><strong>How a host gets one.</strong> From a Router Advertisement, statically, or from DHCPv6 — never invented locally. This matters for debugging: a host with a link-local address but no GUA has almost always failed to hear a Router Advertisement, and that is where to look first.</p>
<p>★ <strong>Your VPS probably has none.</strong> Measured on a production server: thirteen interfaces, every one with an <code>fe80::</code> address, and not one global address anywhere. The provider allocated IPv4 only. That is entirely normal in 2026, and it is why the site serves over IPv4 while nginx sits there with <code>listen [::]:443 ssl</code> already configured and waiting.</p>`,
        `<p>Một <strong>Global Unicast Address</strong> là thứ tương đương của địa chỉ IPv4 công cộng, bỏ đi sự khan hiếm và bỏ đi NAT. Dải là <strong>2000::/3</strong>, nghĩa là ba bit đầu là 001 — nên trên thực tế một GUA bắt đầu bằng 2 hoặc 3.</p>
<p><strong>Cấu trúc.</strong> 48 bit tiền tố định tuyến toàn cầu (nhà cung cấp cấp cho cơ sở của bạn), 16 bit subnet ID (bạn tự chia), 64 bit interface ID.</p>
<p><strong>Host lấy nó bằng cách nào.</strong> Từ một gói Router Advertisement, đặt tĩnh, hoặc từ DHCPv6 — không bao giờ tự bịa ra. Điều này quan trọng khi gỡ lỗi: một host có địa chỉ link-local mà không có GUA thì gần như luôn là do nó không nghe được gói Router Advertisement nào, và đó là chỗ cần nhìn đầu tiên.</p>
<p>★ <strong>VPS của bạn nhiều khả năng không có cái nào.</strong> Đo trên một máy chủ sản xuất: mười ba cổng, cổng nào cũng có một địa chỉ <code>fe80::</code>, và không có một địa chỉ toàn cục nào ở đâu cả. Nhà cung cấp chỉ cấp IPv4. Chuyện đó hoàn toàn bình thường vào năm 2026, và đó là lý do trang web phục vụ qua IPv4 trong khi nginx thì đã có sẵn <code>listen [::]:443 ssl</code> nằm đó chờ.</p>`],

      [11, 'LLA — the address that is always there',
        `<p>Now the opening question has its answer. A <strong>Link-Local Address</strong>, <strong>fe80::/10</strong>, is mandatory: every IPv6-enabled interface builds one automatically, always, with no configuration and no server.</p>
<p><strong>Its scope is the link, and only the link.</strong> A router never forwards a packet with a link-local source or destination. That is why you cannot reach one from elsewhere on the Internet — not because something is blocking it, but because it has no meaning outside the wire it lives on.</p>
<p><strong>What it is for,</strong> and this is the part people underestimate:</p>
<ul>
<li>Neighbor Discovery — the ARP replacement — runs entirely over link-local.</li>
<li>Router Advertisements come <em>from</em> a router's link-local address.</li>
<li>★ <strong>Every next hop in an IPv6 routing table is a link-local address.</strong> Not a global one. A router forwards to its neighbour by link-local, which is why the routing table keeps working even if the global prefix changes.</li>
</ul>
<p>The output on this slide is real: thirteen interfaces on one production server, every one with an <code>fe80::</code> address that nobody typed.</p>`,
        `<p>Giờ thì câu hỏi mở đầu đã có lời giải. Một <strong>Link-Local Address</strong>, <strong>fe80::/10</strong>, là bắt buộc: mọi cổng đã bật IPv6 đều tự dựng một cái, luôn luôn, không cần cấu hình và không cần máy chủ nào.</p>
<p><strong>Phạm vi của nó là cái link, và chỉ cái link đó.</strong> Router không bao giờ chuyển tiếp một gói có nguồn hay đích là link-local. Đó là lý do bạn không tới được nó từ chỗ khác trên Internet — không phải vì có gì đang chặn, mà vì nó không có ý nghĩa gì bên ngoài sợi dây nó đang sống.</p>
<p><strong>Nó dùng để làm gì,</strong> và đây là phần người ta hay xem nhẹ:</p>
<ul>
<li>Neighbor Discovery — thứ thay thế ARP — chạy hoàn toàn trên link-local.</li>
<li>Gói Router Advertisement đi ra <em>từ</em> địa chỉ link-local của router.</li>
<li>★ <strong>Mọi next hop trong bảng định tuyến IPv6 đều là một địa chỉ link-local.</strong> Không phải địa chỉ toàn cục. Router chuyển tiếp tới láng giềng bằng link-local, và đó là lý do bảng định tuyến vẫn chạy được kể cả khi tiền tố toàn cục thay đổi.</li>
</ul>
<p>Kết xuất trên slide này là thật: mười ba cổng trên một máy chủ sản xuất, cổng nào cũng có một địa chỉ <code>fe80::</code> mà không ai gõ vào.</p>`],

      [12, 'ULA and the special addresses',
        `<p>The rest of the map, and what each one replaces.</p>
<ul>
<li><strong>fc00::/7 — Unique Local (ULA).</strong> The rough equivalent of RFC 1918 private space. Never routed on the public Internet.</li>
<li><strong>::1/128 — loopback.</strong> Exactly one address, where IPv4 had 16.7 million. This one address is the source of a real bug, covered in lesson 11.2.</li>
<li><strong>::/128 — unspecified.</strong> "I have no address yet", used as a source during Duplicate Address Detection.</li>
<li><strong>::/0 — the default route.</strong></li>
<li><strong>2001:db8::/32 — documentation.</strong> Use it in diagrams, never deploy it.</li>
</ul>
<p>★ <strong>ULA is less useful than RFC 1918 was, and it is worth knowing why.</strong> Private IPv4 existed because addresses were scarce, so hiding a network behind NAT was the only way to connect it. ULA exists only for networks that genuinely must never be routed outside — a closed lab, an industrial control segment. If you have a GUA, use it, and put a firewall in front. "Not reachable" then lives in a rule you can read and audit, rather than being a side effect of address translation.</p>`,
        `<p>Phần bản đồ còn lại, và mỗi cái thay thế cho thứ gì.</p>
<ul>
<li><strong>fc00::/7 — Unique Local (ULA).</strong> Đại khái tương đương không gian riêng RFC 1918. Không bao giờ được định tuyến trên Internet công cộng.</li>
<li><strong>::1/128 — loopback.</strong> Đúng một địa chỉ, trong khi IPv4 có 16,7 triệu. Đúng cái địa chỉ này là nguồn gốc của một con bọ có thật, nói ở bài 11.2.</li>
<li><strong>::/128 — chưa xác định.</strong> "Tôi chưa có địa chỉ nào", dùng làm nguồn trong lúc chạy Duplicate Address Detection.</li>
<li><strong>::/0 — tuyến mặc định.</strong></li>
<li><strong>2001:db8::/32 — tài liệu.</strong> Dùng trong sơ đồ, đừng bao giờ triển khai thật.</li>
</ul>
<p>★ <strong>ULA ít hữu dụng hơn RFC 1918 từng có, và đáng biết vì sao.</strong> IPv4 riêng tồn tại vì địa chỉ khan hiếm, nên giấu một mạng sau NAT là cách duy nhất để nối nó. ULA chỉ tồn tại cho những mạng thật sự không bao giờ được định tuyến ra ngoài — một phòng lab kín, một đoạn mạng điều khiển công nghiệp. Nếu bạn có GUA thì hãy dùng nó, và đặt một tường lửa phía trước. Khi ấy "không tới được" nằm trong một luật bạn đọc được và kiểm toán được, thay vì là tác dụng phụ của phép dịch địa chỉ.</p>`],
    ]),

    bi(
      `<h3>🗺️ Which address does a host use for what</h3>
<pre><code class="language-mermaid">graph TD
  A["Interface comes up"] --> B["Build a LINK-LOCAL address<br/>fe80::/64 — automatic, always"]
  B --> C{"Did a Router Advertisement arrive?"}
  C -->|"no"| D["Link-local ONLY<br/>can talk to neighbours on this wire<br/>cannot reach the Internet"]
  C -->|"yes"| E["Learn the /64 prefix from the RA"]
  E --> F["Build a GLOBAL address<br/>prefix + interface ID"]
  F --> G["Both addresses coexist<br/>LLA for neighbours and routing<br/>GUA for everything else"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class C ask
  class A,B,E,F act
  class D,G ok</code></pre>
<p>An interface in IPv6 normally has <strong>several</strong> addresses at once, which surprises people coming from IPv4. That is not a misconfiguration — it is how the protocol works, and the left branch of this diagram is exactly the state a server with no IPv6 allocation sits in permanently.</p>`,
      `<h3>🗺️ Host dùng địa chỉ nào cho việc gì</h3>
<pre><code class="language-mermaid">graph TD
  A["Cổng mạng lên"] --> B["Dựng địa chỉ LINK-LOCAL<br/>fe80::/64 — tự động, luôn luôn"]
  B --> C{"Có gói Router Advertisement nào tới không?"}
  C -->|"không"| D["CHỈ có link-local<br/>nói chuyện được với láng giềng trên dây này<br/>không ra được Internet"]
  C -->|"có"| E["Học tiền tố /64 từ gói RA"]
  E --> F["Dựng địa chỉ TOÀN CỤC<br/>tiền tố + interface ID"]
  F --> G["Hai địa chỉ cùng tồn tại<br/>LLA cho láng giềng và định tuyến<br/>GUA cho mọi thứ khác"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class C ask
  class A,B,E,F act
  class D,G ok</code></pre>
<p>Một cổng mạng trong IPv6 bình thường mang <strong>vài</strong> địa chỉ cùng lúc, và điều đó làm người quen IPv4 bất ngờ. Đó không phải cấu hình sai — giao thức vốn chạy như vậy, và nhánh bên trái của sơ đồ này đúng là trạng thái mà một máy chủ không được cấp IPv6 nằm ở đó vĩnh viễn.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — on your own machine, right now</h3>
<p>Every claim in this lesson is measurable in one line. Start with your own interfaces.</p>
<pre><code class="language-bash">ip -6 -br addr                 # Linux: every interface and its IPv6 addresses
ifconfig | grep inet6          # macOS equivalent</code></pre>
<pre><code class="language-plaintext">lo               UNKNOWN   ::1/128
eth0             UP        fe80::49ae:5537:795c:ff65/64
docker0          UP        fe80::c8ac:bff:fed6:c31/64
br-e4e65abd25c3  UP        fe80::7c59:f1ff:feb2:6437/64</code></pre>
<p>Then check your reading of any address against the library:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_address('fe80::49ae:5537:795c:ff65'); print(a.compressed, '| link-local:', a.is_link_local, '| global:', a.is_global, '| loopback:', a.is_loopback)"</code></pre>
<pre><code class="language-plaintext">fe80::49ae:5537:795c:ff65 | link-local: True | global: False | loopback: False</code></pre>
<div class="callout ok"><strong>What each result means.</strong> Every interface showing only <code>fe80::</code> and nothing else means your provider gave you no IPv6 allocation — normal, not broken. An interface with a <code>2xxx:</code> or <code>3xxx:</code> address as well means you do have a global allocation and the host heard a Router Advertisement. No <code>fe80::</code> at all on an interface means IPv6 is disabled on it, which is a configuration choice somebody made.</div>`,
      `<h3>🔍 Cách tự kiểm — ngay trên máy của bạn, lúc này</h3>
<p>Mọi khẳng định trong bài này đều đo được bằng một dòng lệnh. Bắt đầu từ chính các cổng mạng của bạn.</p>
<pre><code class="language-bash">ip -6 -br addr                 # Linux: mọi cổng và các địa chỉ IPv6 của nó
ifconfig | grep inet6          # lệnh tương đương trên macOS</code></pre>
<pre><code class="language-plaintext">lo               UNKNOWN   ::1/128
eth0             UP        fe80::49ae:5537:795c:ff65/64
docker0          UP        fe80::c8ac:bff:fed6:c31/64
br-e4e65abd25c3  UP        fe80::7c59:f1ff:feb2:6437/64</code></pre>
<p>Rồi đối chiếu cách bạn đọc một địa chỉ bất kỳ với thư viện:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_address('fe80::49ae:5537:795c:ff65'); print(a.compressed, '| link-local:', a.is_link_local, '| global:', a.is_global, '| loopback:', a.is_loopback)"</code></pre>
<pre><code class="language-plaintext">fe80::49ae:5537:795c:ff65 | link-local: True | global: False | loopback: False</code></pre>
<div class="callout ok"><strong>Mỗi kết quả nghĩa là gì.</strong> Mọi cổng chỉ hiện <code>fe80::</code> và không gì khác nghĩa là nhà cung cấp không cấp cho bạn IPv6 nào — bình thường, không phải hỏng. Một cổng có thêm địa chỉ <code>2xxx:</code> hoặc <code>3xxx:</code> nghĩa là bạn CÓ cấp phát toàn cục và host đã nghe được gói Router Advertisement. Một cổng hoàn toàn không có <code>fe80::</code> nghĩa là IPv6 bị tắt trên cổng đó, và đó là một lựa chọn cấu hình do ai đó đặt.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — two <code>::</code> in one address.</strong> <code>2001:db8::acad::1</code> is invalid, not merely ugly. <b>Symptom:</b> a parse error from whatever tool you paste it into, and if it is in a config file, a service that will not start with a message that names the line but not the reason.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — dropping trailing zeros.</strong> <code>0100</code> compresses to <code>100</code>, never to <code>1</code>. <b>Symptom:</b> a syntactically valid address that points at a different host. Nothing errors; the traffic simply goes somewhere else, or nowhere.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — a prefix longer than /64 on a LAN.</strong> <b>Symptom:</b> the router accepts it, the interface comes up, and hosts get no global address at all. SLAAC needs exactly 64 interface bits and simply stops. There is no warning anywhere, which makes this the most expensive mistake in the chapter.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — expecting a broadcast address.</strong> There is none, and looking for one wastes time. <b>Symptom:</b> a search for "the IPv6 broadcast address" that finds nothing, because the answer is <code>ff02::1</code> and it is multicast.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — assuming no <code>fe80::</code> means IPv6 is broken.</strong> It means the opposite: link-local is the part that always works. <b>Symptom:</b> hours spent on the wrong layer. If <code>fe80::</code> is present but there is no global address, the fault is upstream — no Router Advertisement — not on this host.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — hai dấu <code>::</code> trong một địa chỉ.</strong> <code>2001:db8::acad::1</code> là không hợp lệ, chứ không phải chỉ xấu. <b>Triệu chứng:</b> lỗi phân tích cú pháp từ bất kỳ công cụ nào bạn dán nó vào, và nếu nó nằm trong file cấu hình thì một dịch vụ không khởi động được với thông báo chỉ ra dòng chứ không chỉ ra lý do.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — bỏ số 0 ở đuôi.</strong> <code>0100</code> rút gọn thành <code>100</code>, không bao giờ thành <code>1</code>. <b>Triệu chứng:</b> một địa chỉ đúng cú pháp mà trỏ vào một host khác. Không có lỗi nào; lưu lượng chỉ đơn giản là đi chỗ khác, hoặc không đi đâu cả.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — tiền tố dài hơn /64 trên một LAN.</strong> <b>Triệu chứng:</b> router nhận cấu hình, cổng lên, và host hoàn toàn không lấy được địa chỉ toàn cục nào. SLAAC cần đúng 64 bit interface và nó đơn giản là dừng. Không có cảnh báo ở đâu cả, và điều đó làm nó thành cái sai đắt nhất chương này.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — trông chờ có địa chỉ broadcast.</strong> Không có cái nào, và đi tìm nó là phí thời gian. <b>Triệu chứng:</b> một cuộc tìm "địa chỉ broadcast của IPv6" mà không ra gì, vì đáp án là <code>ff02::1</code> và nó là multicast.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — tưởng không có <code>fe80::</code> nghĩa là IPv6 hỏng.</strong> Thật ra ngược lại: link-local là phần luôn luôn chạy. <b>Triệu chứng:</b> mất hàng giờ ở sai tầng. Nếu có <code>fe80::</code> mà không có địa chỉ toàn cục thì cái hỏng nằm ở thượng nguồn — không có Router Advertisement — chứ không nằm ở host này.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> Compress these fully, then expand the last one back: <code>2001:0db8:0000:0000:00ab:0000:0000:1234</code> · <code>fe80:0000:0000:0000:0000:0000:0000:0001</code> · <code>2001:db8:a::1</code>.</p>
<div class="dap-an"><p><b>First.</b> Rule 1 gives <code>2001:db8:0:0:ab:0:0:1234</code>. Rule 2 must collapse only ONE run, and there are two runs of two. The canonical choice is the <em>first</em> when they are equal in length: <b>2001:db8::ab:0:0:1234</b>. Writing <code>2001:db8:0:0:ab::1234</code> is also a valid address but is not the canonical form.</p>
<p><b>Second.</b> <b>fe80::1</b>. Seven zero hextets collapse into one <code>::</code>.</p>
<p><b>Third, expanded.</b> <code>2001:db8:a::1</code> has four hextets written (2001, db8, a, 1), so <code>::</code> stands for four zero hextets: <b>2001:0db8:000a:0000:0000:0000:0000:0001</b>. Note <code>a</code> expands to <code>000a</code>, not <code>a000</code> — the zeros go in front.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; [print(i.ip_address(a).compressed, '|', i.ip_address(a).exploded) for a in ['2001:0db8:0000:0000:00ab:0000:0000:1234','fe80::1','2001:db8:a::1']]"</code></pre>
<p>The last point is the one that catches people: leading zeros were dropped, so they must be put back in front when expanding.</p></div>

<p><b>E2.</b> Classify each and say whether a router will forward it: <code>2001:db8:acad:1::100</code> · <code>fe80::1</code> · <code>fd00:1234::5</code> · <code>ff02::1</code> · <code>::1</code>.</p>
<div class="dap-an"><ul>
<li><b>2001:db8:acad:1::100</b> — GUA in 2000::/3. Routable, though this particular prefix is the documentation range and would never be deployed.</li>
<li><b>fe80::1</b> — link-local. A router <b>never</b> forwards it. Valid only on the wire it is on.</li>
<li><b>fd00:1234::5</b> — ULA (fc00::/7; the fd half is the locally-assigned one). Routed inside your own network, never on the public Internet.</li>
<li><b>ff02::1</b> — multicast, "all nodes", and the <code>02</code> is the scope: link-local. Never leaves the segment.</li>
<li><b>::1</b> — loopback. Never leaves the host at all.</li>
</ul>
<p>Three of the five never cross a router, and each for a different reason: scope, policy and locality. Naming the reason is worth more marks than naming the type.</p></div>

<p><b>E3.</b> A colleague configures <code>2001:db8:acad:1::1/80</code> on a router's LAN interface. The interface comes up, the address is there in <code>show ipv6 interface</code>, and no PC on that LAN gets a global address. What is wrong?</p>
<div class="dap-an"><p><b>The prefix is longer than /64.</b> SLAAC builds the interface ID as 64 bits — that is what EUI-64 produces and what the standard assumes — so a /80 leaves only 48 bits for it. The host has no legal way to construct an address, and it does not construct a wrong one; it constructs none.</p>
<p>The reason this is expensive is that <b>everything looks correct</b>. The configuration is accepted, the router's own address works, the interface is up/up, and the routing table has the connected route. Only the hosts are silent, and no log anywhere says why.</p>
<p><b>Fix:</b> use <code>/64</code>. On a LAN there is effectively no reason to use anything else, and the address space is large enough that nobody is saving anything by trying.</p>
<p class="ghi-chu">The mirror image in Chapter 10 was choosing a prefix too small for the host count — there, at least, you could count the hosts and see the problem. Here the problem is invisible.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Rút gọn hết mức các địa chỉ sau, rồi khai triển ngược cái cuối: <code>2001:0db8:0000:0000:00ab:0000:0000:1234</code> · <code>fe80:0000:0000:0000:0000:0000:0000:0001</code> · <code>2001:db8:a::1</code>.</p>
<div class="dap-an"><p><b>Cái thứ nhất.</b> Quy tắc 1 cho <code>2001:db8:0:0:ab:0:0:1234</code>. Quy tắc 2 chỉ được gộp MỘT dãy, mà ở đây có hai dãy dài bằng nhau. Lựa chọn chuẩn tắc là dãy <em>đầu tiên</em> khi chúng dài bằng nhau: <b>2001:db8::ab:0:0:1234</b>. Viết <code>2001:db8:0:0:ab::1234</code> cũng là một địa chỉ hợp lệ nhưng không phải dạng chuẩn tắc.</p>
<p><b>Cái thứ hai.</b> <b>fe80::1</b>. Bảy hextet số 0 gộp thành một dấu <code>::</code>.</p>
<p><b>Cái thứ ba, khai triển ra.</b> <code>2001:db8:a::1</code> có bốn hextet được viết ra (2001, db8, a, 1), nên <code>::</code> thay cho bốn hextet số 0: <b>2001:0db8:000a:0000:0000:0000:0000:0001</b>. Để ý <code>a</code> khai triển thành <code>000a</code> chứ không phải <code>a000</code> — các số 0 đi ở phía trước.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; [print(i.ip_address(a).compressed, '|', i.ip_address(a).exploded) for a in ['2001:0db8:0000:0000:00ab:0000:0000:1234','fe80::1','2001:db8:a::1']]"</code></pre>
<p>Chỗ cuối là chỗ hay bẫy người ta: số 0 đứng đầu đã bị bỏ, nên khi khai triển thì phải trả chúng về đằng trước.</p></div>

<p><b>E2.</b> Phân loại từng địa chỉ và cho biết router có chuyển tiếp nó không: <code>2001:db8:acad:1::100</code> · <code>fe80::1</code> · <code>fd00:1234::5</code> · <code>ff02::1</code> · <code>::1</code>.</p>
<div class="dap-an"><ul>
<li><b>2001:db8:acad:1::100</b> — GUA trong 2000::/3. Định tuyến được, dù đúng cái tiền tố này là dải dành cho tài liệu và sẽ không bao giờ được triển khai thật.</li>
<li><b>fe80::1</b> — link-local. Router <b>không bao giờ</b> chuyển tiếp nó. Chỉ có hiệu lực trên đúng sợi dây nó đang ở.</li>
<li><b>fd00:1234::5</b> — ULA (fc00::/7; nửa fd là phần tự cấp phát cục bộ). Định tuyến trong mạng của bạn, không bao giờ ra Internet công cộng.</li>
<li><b>ff02::1</b> — multicast, "mọi node", và cái <code>02</code> chính là phạm vi: link-local. Không bao giờ rời khỏi đoạn mạng.</li>
<li><b>::1</b> — loopback. Không bao giờ rời khỏi máy.</li>
</ul>
<p>Ba trong năm cái không bao giờ qua router, và mỗi cái vì một lý do khác nhau: phạm vi, chính sách và tính cục bộ. Gọi tên được lý do thì đáng điểm hơn là gọi tên được loại.</p></div>

<p><b>E3.</b> Một đồng nghiệp cấu hình <code>2001:db8:acad:1::1/80</code> lên cổng LAN của router. Cổng lên, địa chỉ có mặt trong <code>show ipv6 interface</code>, và không một cái PC nào trên LAN đó lấy được địa chỉ toàn cục. Sai ở đâu?</p>
<div class="dap-an"><p><b>Tiền tố dài hơn /64.</b> SLAAC dựng interface ID dài 64 bit — đó là thứ EUI-64 tạo ra và là thứ tiêu chuẩn giả định — nên một /80 chỉ còn chừa 48 bit cho nó. Host không có cách hợp lệ nào để dựng ra địa chỉ, và nó không dựng ra một địa chỉ sai; nó không dựng ra cái nào cả.</p>
<p>Lý do chuyện này đắt là vì <b>mọi thứ nhìn đều đúng</b>. Cấu hình được nhận, địa chỉ của chính router thì chạy, cổng ở trạng thái up/up, và bảng định tuyến có tuyến kết nối. Chỉ có các host là im lặng, và không log nào ở đâu nói vì sao.</p>
<p><b>Cách sửa:</b> dùng <code>/64</code>. Trên một LAN thì thực tế không có lý do nào để dùng thứ khác, và không gian địa chỉ đủ lớn để chẳng ai tiết kiệm được gì khi cố làm vậy.</p>
<p class="ghi-chu">Hình ảnh đối xứng ở Chương 10 là chọn tiền tố quá nhỏ so với số host — ở đó ít ra bạn còn đếm được host và thấy được vấn đề. Ở đây thì vấn đề vô hình.</p></div>`,
    ),

    cq(35, [
      ['CQ12.2',
        'A company has plan to deploy a network with more departments. How can we calculate IPv4 address to optimize in this case?',
        'Một công ty có kế hoạch triển khai mạng với nhiều phòng ban hơn. Làm sao tính địa chỉ IPv4 cho tối ưu trong trường hợp này?'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question.</strong> Quoted exactly as published. Note what it asks: how to calculate <strong>IPv4</strong> addresses optimally for a company with many departments. That is <strong>VLSM</strong>, which is section 10.8 — Chapter 10, session 31 — and has nothing to do with IPv6 or with anything taught in session 35.</p>
<p>This is the same drift reported since session 19: the question numbering runs about one chapter behind the session plan. The full answer is in <strong>lesson 10.2</strong> of the previous chapter. In summary: sort the departments largest first, size each with the smallest h where 2^h &minus; 2 meets the need, place each block at the next free address, and advance to the previous block's broadcast plus one. Verify no two blocks overlap before configuring anything.</p>
<p><strong>★ If you want a question that matches what session 35 actually teaches,</strong> here are two:</p>
<ul>
<li>Your server shows an <code>fe80::</code> address on all thirteen interfaces and no global address anywhere. Explain who assigned those addresses, why you cannot reach them from another machine, and what would have to change for a global address to appear.</li>
<li>Why may <code>::</code> appear only once in an address? Construct a specific example where allowing it twice would be ambiguous, and say how many different addresses your example could mean.</li>
</ul></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này.</strong> Trích nguyên văn như đã công bố. Hãy để ý nó hỏi gì: cách tính địa chỉ <strong>IPv4</strong> sao cho tối ưu với một công ty có nhiều phòng ban. Đó là <strong>VLSM</strong>, tức mục 10.8 — Chương 10, buổi 31 — và không liên quan gì tới IPv6 hay bất cứ thứ gì dạy ở buổi 35.</p>
<p>Đây vẫn là độ trôi đã nêu từ buổi 19: cách đánh số câu hỏi chạy chậm hơn kế hoạch buổi học khoảng một chương. Câu trả lời đầy đủ nằm ở <strong>bài 10.2</strong> của chương trước. Tóm tắt: sắp các phòng ban theo thứ tự lớn trước, định cỡ từng cái bằng h nhỏ nhất sao cho 2^h &minus; 2 đủ dùng, đặt mỗi khối vào địa chỉ trống kế tiếp, và tiến lên bằng broadcast của khối trước cộng một. Kiểm không có hai khối nào chồng nhau trước khi cấu hình bất cứ thứ gì.</p>
<p><strong>★ Nếu bạn muốn một câu hỏi khớp với nội dung buổi 35 thật sự dạy,</strong> đây là hai câu:</p>
<ul>
<li>Máy chủ của bạn hiện một địa chỉ <code>fe80::</code> trên cả mười ba cổng và không có địa chỉ toàn cục nào ở đâu cả. Hãy giải thích ai gán mấy địa chỉ đó, vì sao bạn không tới được chúng từ một máy khác, và cần thay đổi gì thì mới có một địa chỉ toàn cục xuất hiện.</li>
<li>Vì sao <code>::</code> chỉ được xuất hiện một lần trong một địa chỉ? Hãy dựng một ví dụ cụ thể mà cho phép nó xuất hiện hai lần sẽ gây nhập nhằng, và nói ví dụ của bạn có thể mang mấy nghĩa khác nhau.</li>
</ul></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 11.2 — session 36 ─────────────────────── */

const L2 = {
  title: '11.2 — Configuring IPv6, multicast and subnetting (FLM session 36)|||11.2 — Cấu hình IPv6, multicast và chia subnet (buổi 36 của FLM)',
  slug: 'nwc204-11-2-cau-hinh-va-chia-subnet-ipv6',
  type: 'DOCUMENT',
  description: 'Buổi 36: cấu hình tĩnh GUA và LLA trên IOS cùng lệnh ipv6 unicast-routing hay bị quên, EUI-64 kiểm ngược từ MAC thật của router thượng nguồn, SLAAC so với DHCPv6 qua hai cờ M và O trong gói RA, cấp địa chỉ link-local tự động và Duplicate Address Detection bắt buộc, multicast solicited-node thay thế ARP, chia subnet IPv6 không có VLSM và không có phép trừ hai, công cụ AI và cách kiểm. Kèm phần ★ đọc IPv6 trên máy chủ thật, bẫy ::1 so với 127.0.0.1, và vì sao %eth0 là bắt buộc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 11 · Lesson 11.2 · FLM session 36 of 60 · CLO5, CLO9 · Cisco Module 12</span>
<h2>Putting IPv6 onto interfaces</h2>
<p class="lead">After this lesson you can configure a global and a link-local address on IOS, derive an EUI-64 interface ID from a MAC and check it against a real machine, explain how a host gets its address from a Router Advertisement, and subnet a /48 without doing any arithmetic at all.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 36 — "11.5 GUA and LLA Static Configuration · 11.6 Dynamic Addressing for IPv6 GUAs · 11.7 Dynamic Addressing for IPv6 LLAs · 11.8 IPv6 Multicast Addresses · 11.9 Subnet an IPv6 Network · 11.10 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Opening question.</strong> A developer reports that their application "cannot connect to the database". <code>curl 127.0.0.1:5432</code> succeeds. <code>curl localhost:5432</code> is refused. Nothing in the application changed, nothing in the database changed, and the machine was only rebooted. What single fact explains it, and which one command proves you are right?</p>
<div class="callout warn">⚠️ <strong>Session 36 has no constructive question.</strong> The school's table leaves it blank — one of eight blank sessions (6, 9, 15, 16, 22, 30, 36, 56). Reported as published; we add two of our own at the end and mark them ★.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 12.</p>`,
      `<span class="eyebrow">NWC204 · Chương 11 · Bài 11.2 · Buổi 36/60 của FLM · CLO5, CLO9 · Cisco Module 12</span>
<h2>Đưa IPv6 lên các cổng mạng</h2>
<p class="lead">Học xong bài này bạn cấu hình được một địa chỉ toàn cục và một địa chỉ link-local trên IOS, suy ra được interface ID theo EUI-64 từ một địa chỉ MAC rồi đối chiếu với máy thật, giải thích được host lấy địa chỉ từ gói Router Advertisement ra sao, và chia được một /48 mà không phải làm phép tính nào cả.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 36 — "11.5 GUA and LLA Static Configuration · 11.6 Dynamic Addressing for IPv6 GUAs · 11.7 Dynamic Addressing for IPv6 LLAs · 11.8 IPv6 Multicast Addresses · 11.9 Subnet an IPv6 Network · 11.10 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Câu hỏi mở đầu.</strong> Một lập trình viên báo rằng ứng dụng của họ "không kết nối được tới cơ sở dữ liệu". <code>curl 127.0.0.1:5432</code> thì được. <code>curl localhost:5432</code> thì bị từ chối. Ứng dụng không đổi gì, cơ sở dữ liệu không đổi gì, và cái máy chỉ vừa được khởi động lại. Đúng một sự thật nào giải thích được chuyện đó, và một câu lệnh nào chứng minh bạn đúng?</p>
<div class="callout warn">⚠️ <strong>Buổi 36 không có câu hỏi kiến tạo nào.</strong> Bảng của trường để trống — một trong tám buổi bỏ trống (6, 9, 15, 16, 22, 30, 36, 56). Nêu đúng như đã công bố; chúng tôi thêm hai câu của mình ở cuối và đánh dấu ★.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 12.</p>`,
    ),

    walkHead('nwc204-ch11', 13, 27,
      'Slides 13–27 cover FLM session 36: 11.5 static configuration, 11.6–11.7 dynamic addressing, 11.8 multicast, 11.9 subnetting, 11.10 AI tools, plus the ★ material on a real server.',
      'Slide 13–27 là buổi 36 của FLM: 11.5 cấu hình tĩnh, 11.6–11.7 cấp địa chỉ động, 11.8 multicast, 11.9 chia subnet, 11.10 công cụ AI, kèm phần ★ trên một máy chủ thật.'),

    walk('nwc204-ch11', [
      [13, 'What session 36 covers',
        `<p>Six sections, and they divide cleanly into three questions: how do I put an address on by hand, how does a host get one by itself, and how do I organise them.</p>
<ul>
<li><strong>11.5</strong> Static configuration of GUA and LLA.</li>
<li><strong>11.6</strong> Dynamic addressing for GUAs — SLAAC and DHCPv6.</li>
<li><strong>11.7</strong> Dynamic addressing for LLAs — which turns out to need nothing at all.</li>
<li><strong>11.8</strong> Multicast addresses — what replaced broadcast and ARP.</li>
<li><strong>11.9</strong> Subnetting an IPv6 network.</li>
<li><strong>11.10</strong> Integrate AI tools for explaining concepts (self learning).</li>
</ul>
<p><strong>The anomaly for this session.</strong> The constructive-question table has no entry at all for session 36. It is one of eight sessions left blank. We report that rather than filling it silently, and add two questions of our own at the end of this lesson, marked ★ so you can tell them apart from the school's.</p>`,
        `<p>Sáu mục, và chúng chia gọn thành ba câu hỏi: đặt địa chỉ bằng tay thế nào, host tự lấy địa chỉ ra sao, và sắp xếp chúng thế nào.</p>
<ul>
<li><strong>11.5</strong> Cấu hình tĩnh GUA và LLA.</li>
<li><strong>11.6</strong> Cấp địa chỉ động cho GUA — SLAAC và DHCPv6.</li>
<li><strong>11.7</strong> Cấp địa chỉ động cho LLA — hoá ra chẳng cần gì cả.</li>
<li><strong>11.8</strong> Địa chỉ multicast — thứ thay thế broadcast và ARP.</li>
<li><strong>11.9</strong> Chia subnet một mạng IPv6.</li>
<li><strong>11.10</strong> Tích hợp công cụ AI để giải thích khái niệm (tự học).</li>
</ul>
<p><strong>Chỗ bất thường của buổi này.</strong> Bảng câu hỏi kiến tạo hoàn toàn không có mục nào cho buổi 36. Đó là một trong tám buổi bị bỏ trống. Chúng tôi nêu chuyện đó ra chứ không lấp vào một cách lặng lẽ, và thêm hai câu của mình ở cuối bài, đánh dấu ★ để bạn phân biệt được với câu của trường.</p>`],

      [14, '11.5 Static configuration on IOS',
        `<p>Three things, and one of them is forgotten more than all the others combined.</p>
<p><strong><code>ipv6 unicast-routing</code> is OFF by default.</strong> Without it a Cisco router will accept IPv6 addresses, display them happily in <code>show ipv6 interface</code>, and forward nothing. It also sends no Router Advertisements, which means every host on the LAN silently fails to get a global address. The symptom is identical to "IPv6 is not working" with no clue as to why.</p>
<p><strong>The global address</strong> goes on with <code>ipv6 address 2001:db8:acad:1::1/64</code>. Note the prefix is written with a slash, the way Linux does it, not with a separate mask the way IPv4 does on IOS.</p>
<p><strong>The link-local address is optional but worth setting.</strong> The interface will build one automatically from EUI-64, and it will be correct and unreadable — something like <code>fe80::21a:2fff:fe11:2233</code>. Setting <code>ipv6 address fe80::1 link-local</code> gives you an address a human can read, and since every next hop in every IPv6 routing table on the segment is a link-local address, that readability is worth having.</p>`,
        `<p>Ba thứ, và một trong số đó bị quên nhiều hơn tất cả những cái còn lại cộng lại.</p>
<p><strong><code>ipv6 unicast-routing</code> mặc định TẮT.</strong> Thiếu nó thì router Cisco vẫn nhận địa chỉ IPv6, vẫn hiện chúng ra vui vẻ trong <code>show ipv6 interface</code>, và không chuyển tiếp gì cả. Nó cũng không gửi gói Router Advertisement nào, nghĩa là mọi host trên LAN lặng lẽ không lấy được địa chỉ toàn cục. Triệu chứng giống hệt "IPv6 không chạy" mà không có manh mối nào về lý do.</p>
<p><strong>Địa chỉ toàn cục</strong> đặt bằng <code>ipv6 address 2001:db8:acad:1::1/64</code>. Để ý tiền tố viết kèm dấu gạch chéo, theo lối Linux, chứ không phải một mặt nạ riêng như cách IPv4 làm trên IOS.</p>
<p><strong>Địa chỉ link-local là tuỳ chọn nhưng đáng đặt.</strong> Cổng mạng sẽ tự dựng một cái theo EUI-64, và nó vừa đúng vừa không đọc nổi — kiểu như <code>fe80::21a:2fff:fe11:2233</code>. Đặt <code>ipv6 address fe80::1 link-local</code> cho bạn một địa chỉ con người đọc được, và vì mọi next hop trong mọi bảng định tuyến IPv6 trên đoạn mạng đều là địa chỉ link-local, nên tính đọc-được ấy rất đáng giá.</p>`],

      [15, '★ EUI-64, checked against a real router',
        `<p>EUI-64 turns a 48-bit MAC address into a 64-bit interface ID. Three steps, and they can be checked on a machine you own rather than taken on faith.</p>
<ol>
<li><strong>Split the MAC in half</strong> and insert <code>ff:fe</code> between the halves. 48 bits become 64.</li>
<li><strong>Flip the seventh bit</strong> of the first byte — which is XOR with 0x02. This is the Universal/Local bit, and flipping it says "this identifier is globally unique, derived from a burned-in MAC".</li>
<li><strong>Prepend <code>fe80::</code></strong> and regroup into hextets.</li>
</ol>
<p><strong>Worked on a real router.</strong> The upstream router of a production VPS has MAC <code>96:3d:fa:00:04:e9</code>. Insert ff:fe to get <code>96:3d:fa:ff:fe:00:04:e9</code>. Flip the bit: 0x96 XOR 0x02 = 0x94, so it becomes <code>94:3d:fa:ff:fe:00:04:e9</code>. Regroup and prepend: <strong><code>fe80::943d:faff:fe00:4e9</code></strong>.</p>
<p>That is byte for byte what <code>ip -6 neigh</code> reports on the server. The derivation was verified against real data rather than asserted — which is the habit the whole course is built around, and it is why the <code>ff:fe</code> in the middle of a link-local address is a reliable sign that the interface ID came from a MAC rather than from a random privacy extension.</p>`,
        `<p>EUI-64 biến một địa chỉ MAC 48 bit thành một interface ID 64 bit. Ba bước, và chúng kiểm được trên một cái máy của chính bạn thay vì phải tin suông.</p>
<ol>
<li><strong>Cắt đôi địa chỉ MAC</strong> rồi chèn <code>ff:fe</code> vào giữa hai nửa. 48 bit thành 64.</li>
<li><strong>Lật bit thứ bảy</strong> của byte đầu tiên — tức là XOR với 0x02. Đó là bit Universal/Local, và lật nó có nghĩa "định danh này là duy nhất toàn cầu, suy ra từ một MAC nạp sẵn trong phần cứng".</li>
<li><strong>Thêm <code>fe80::</code> vào trước</strong> rồi gom lại thành các hextet.</li>
</ol>
<p><strong>Làm thật trên một router thật.</strong> Router thượng nguồn của một VPS sản xuất có MAC <code>96:3d:fa:00:04:e9</code>. Chèn ff:fe được <code>96:3d:fa:ff:fe:00:04:e9</code>. Lật bit: 0x96 XOR 0x02 = 0x94, nên nó thành <code>94:3d:fa:ff:fe:00:04:e9</code>. Gom nhóm và thêm tiền tố: <strong><code>fe80::943d:faff:fe00:4e9</code></strong>.</p>
<p>Đó đúng từng byte là thứ <code>ip -6 neigh</code> báo trên máy chủ. Phép suy diễn này được đối chiếu với dữ liệu thật chứ không phải khẳng định suông — đúng cái thói quen mà cả môn học được dựng quanh nó, và đó là lý do cụm <code>ff:fe</code> nằm giữa một địa chỉ link-local là dấu hiệu đáng tin rằng interface ID đến từ một địa chỉ MAC chứ không phải từ một phần mở rộng riêng tư ngẫu nhiên.</p>`],

      [16, '11.6 How a host gets a global address',
        `<p>The host does not decide. The <strong>Router Advertisement</strong> — ICMPv6 type 134 — decides, and two flags in it choose between three behaviours.</p>
<ul>
<li><strong>M=0, O=0 — SLAAC only.</strong> The RA carries the prefix; the host builds the rest itself. No server involved anywhere.</li>
<li><strong>M=0, O=1 — SLAAC plus stateless DHCPv6.</strong> The host still builds its own address, but asks a DHCPv6 server for other information, typically DNS.</li>
<li><strong>M=1 — stateful DHCPv6.</strong> A server hands out addresses and keeps a record, the way DHCP does in IPv4.</li>
</ul>
<p><strong>In every case the RA supplies the prefix.</strong> Only the interface ID differs in how it is produced: EUI-64 from the MAC, a random privacy address (RFC 4941), or a value from the DHCPv6 server.</p>
<p><strong>The debugging consequence.</strong> No RA on the link means no global address, whatever the host is configured to do. If a host has a link-local address and nothing else, stop looking at the host — the router either has no <code>ipv6 unicast-routing</code>, or is not on that segment, or is not advertising the prefix.</p>`,
        `<p>Host không quyết định. Gói <strong>Router Advertisement</strong> — ICMPv6 loại 134 — quyết định, và hai cờ trong đó chọn ra một trong ba cách hành xử.</p>
<ul>
<li><strong>M=0, O=0 — chỉ SLAAC.</strong> Gói RA mang theo tiền tố; host tự dựng phần còn lại. Không có máy chủ nào dính vào cả.</li>
<li><strong>M=0, O=1 — SLAAC cộng DHCPv6 phi trạng thái.</strong> Host vẫn tự dựng địa chỉ của mình, nhưng hỏi một máy chủ DHCPv6 về các thông tin khác, thường là DNS.</li>
<li><strong>M=1 — DHCPv6 có trạng thái.</strong> Một máy chủ phát địa chỉ ra và lưu sổ, y như cách DHCP làm trong IPv4.</li>
</ul>
<p><strong>Trong mọi trường hợp, gói RA cung cấp tiền tố.</strong> Chỉ có interface ID là khác nhau về cách tạo ra: EUI-64 từ MAC, một địa chỉ riêng tư ngẫu nhiên (RFC 4941), hay một giá trị từ máy chủ DHCPv6.</p>
<p><strong>Hệ quả khi gỡ lỗi.</strong> Không có RA trên link nghĩa là không có địa chỉ toàn cục, bất kể host được cấu hình làm gì. Nếu một host có địa chỉ link-local và không có gì khác thì hãy thôi nhìn vào host — hoặc router chưa bật <code>ipv6 unicast-routing</code>, hoặc nó không nằm trên đoạn mạng đó, hoặc nó không quảng bá tiền tố.</p>`],

      [17, '11.7 Dynamic link-local, and the check that runs first',
        `<p>Link-local addressing needs no server and no configuration, which is why section 11.7 is the shortest in the module. But one step runs before the address is usable, and IPv4 has no equivalent requirement.</p>
<p><strong>Duplicate Address Detection.</strong> Before using any address — including the link-local one — a host sends a Neighbor Solicitation to that very address. If anybody answers, the address is in use and the host will not use it. Silence means it is free.</p>
<p><strong>Why this matters more than it sounds.</strong> In IPv4, two hosts can be configured with the same address and both keep running, badly, with intermittent failures that are famously hard to diagnose. In IPv6 the second host simply refuses to bring the address up. It is a noisier failure, and an honest one: you find out immediately, at configuration time, rather than three weeks later when a user reports something intermittent.</p>
<p>After DAD succeeds, the host sends a <strong>Router Solicitation</strong> to <code>ff02::2</code> — all routers on this link — rather than waiting for the next periodic RA. That is why an interface usually gets its global address within a second of coming up.</p>`,
        `<p>Cấp địa chỉ link-local không cần máy chủ và không cần cấu hình, và đó là lý do mục 11.7 ngắn nhất trong module. Nhưng có một bước chạy trước khi địa chỉ dùng được, và IPv4 không có yêu cầu tương đương.</p>
<p><strong>Duplicate Address Detection.</strong> Trước khi dùng bất kỳ địa chỉ nào — kể cả địa chỉ link-local — host gửi một gói Neighbor Solicitation tới chính cái địa chỉ đó. Nếu có ai trả lời thì địa chỉ đang được dùng và host sẽ không dùng nó. Im lặng nghĩa là nó còn trống.</p>
<p><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> Trong IPv4, hai host có thể được cấu hình cùng một địa chỉ và cả hai vẫn chạy, chạy tệ, với những lỗi chập chờn nổi tiếng là khó chẩn đoán. Trong IPv6 thì host thứ hai đơn giản là từ chối đưa địa chỉ đó lên. Đó là một cái hỏng ồn ào hơn, và trung thực hơn: bạn biết ngay lập tức, lúc đang cấu hình, thay vì ba tuần sau khi có người dùng báo một thứ gì đó chập chờn.</p>
<p>Sau khi DAD thành công, host gửi một gói <strong>Router Solicitation</strong> tới <code>ff02::2</code> — mọi router trên link này — thay vì ngồi chờ gói RA định kỳ tiếp theo. Đó là lý do một cổng mạng thường lấy được địa chỉ toàn cục trong vòng một giây sau khi lên.</p>`],

      [18, '11.8 Solicited-node multicast — what replaced ARP',
        `<p>IPv6 has no broadcast, so it cannot do what ARP did: shout at the whole segment to find one host. It does something more precise instead.</p>
<p><strong>The construction.</strong> Take the last 24 bits of the target address and append them to <code>ff02::1:ff</code>. For <code>2001:db8:acad:1::100</code> the result is <code>ff02::1:ff00:100</code>. The Ethernet multicast MAC is <code>33:33</code> followed by the last 32 bits of that group — <code>33:33:ff:00:01:00</code>.</p>
<p><strong>Why that is better than a broadcast.</strong> The network card filters on that MAC <em>in hardware</em>. A host that is not in the group never wakes its CPU at all, where an ARP broadcast interrupts every machine on the segment. On a LAN with a few hundred hosts, that difference is measurable.</p>
<p><strong>Collisions are possible and harmless.</strong> Only 24 bits are used, so <code>2001:db8:acad::100</code> and <code>2001:db8:9999:7::100</code> land in the same group. A handful of hosts wake up, each compares the full 128-bit target, and only the real owner replies. Narrower than broadcast, cheaper than unicast to everyone — which is the whole design.</p>`,
        `<p>IPv6 không có broadcast, nên nó không làm được thứ ARP từng làm: hét lên cả đoạn mạng để tìm một host. Thay vào đó nó làm một việc chính xác hơn.</p>
<p><strong>Cách dựng.</strong> Lấy 24 bit cuối của địa chỉ đích rồi nối vào sau <code>ff02::1:ff</code>. Với <code>2001:db8:acad:1::100</code> thì kết quả là <code>ff02::1:ff00:100</code>. Địa chỉ MAC multicast trên Ethernet là <code>33:33</code> rồi tới 32 bit cuối của nhóm đó — <code>33:33:ff:00:01:00</code>.</p>
<p><strong>Vì sao như vậy tốt hơn broadcast.</strong> Card mạng lọc theo địa chỉ MAC đó <em>ngay ở phần cứng</em>. Một host không thuộc nhóm thì hoàn toàn không đánh thức CPU của nó, trong khi một gói ARP broadcast làm phiền mọi máy trên đoạn mạng. Trên một LAN vài trăm host thì khác biệt đó đo được.</p>
<p><strong>Trùng nhóm là chuyện có thể xảy ra và vô hại.</strong> Chỉ 24 bit được dùng, nên <code>2001:db8:acad::100</code> và <code>2001:db8:9999:7::100</code> rơi vào cùng một nhóm. Một nhúm host thức dậy, mỗi cái so trọn 128 bit của địa chỉ đích, và chỉ chủ nhân thật mới trả lời. Hẹp hơn broadcast, rẻ hơn unicast tới từng người — và đó là toàn bộ thiết kế.</p>`],

      [19, 'The multicast groups to recognise on sight',
        `<p>Five groups cover almost everything you will meet, and the second character tells you how far each can travel.</p>
<ul>
<li><code>ff02::1</code> — every IPv6 node on the link. Replaces the broadcast address.</li>
<li><code>ff02::2</code> — every IPv6 <strong>router</strong> on the link. A Router Solicitation goes here.</li>
<li><code>ff02::5</code> and <code>ff02::6</code> — OSPFv3 routers. The IPv6 versions of 224.0.0.5 and .6 from Chapter 10.</li>
<li><code>ff02::9</code> — RIPng routers.</li>
<li><code>ff02::1:ffXX:XXXX</code> — the solicited-node groups. These replace ARP.</li>
</ul>
<p><strong>Read the scope digit.</strong> In <code>ff02</code>, the <code>2</code> is the scope: link-local, never leaves the segment. <code>ff05</code> is site-local and <code>ff0e</code> is global. That one character answers "how far can this packet go", which is usually the question you actually have, and it does so without any lookup.</p>`,
        `<p>Năm nhóm phủ gần hết những gì bạn sẽ gặp, và ký tự thứ hai cho biết mỗi cái đi được xa tới đâu.</p>
<ul>
<li><code>ff02::1</code> — mọi node IPv6 trên link. Thay thế cho địa chỉ broadcast.</li>
<li><code>ff02::2</code> — mọi <strong>router</strong> IPv6 trên link. Gói Router Solicitation đi tới đây.</li>
<li><code>ff02::5</code> và <code>ff02::6</code> — các router OSPFv3. Bản IPv6 của 224.0.0.5 và .6 ở Chương 10.</li>
<li><code>ff02::9</code> — các router RIPng.</li>
<li><code>ff02::1:ffXX:XXXX</code> — các nhóm solicited-node. Chúng thay thế ARP.</li>
</ul>
<p><strong>Hãy đọc chữ số chỉ phạm vi.</strong> Trong <code>ff02</code>, số <code>2</code> chính là phạm vi: link-local, không bao giờ rời khỏi đoạn mạng. <code>ff05</code> là phạm vi cơ sở còn <code>ff0e</code> là toàn cầu. Đúng một ký tự đó trả lời câu "gói này đi được xa tới đâu", vốn thường là câu bạn thật sự đang hỏi, và nó trả lời mà không cần tra cứu gì.</p>`],

      [20, '11.9 Subnetting IPv6 — and why it is easier',
        `<p>Here is the part that surprises everyone arriving from Chapter 10. <strong>There is no VLSM in IPv6, and no 2^h &minus; 2.</strong></p>
<p>You receive a /48. The interface ID is fixed at 64 bits. So the only thing you can change is the <strong>16-bit subnet ID</strong> in between — and 16 bits gives 65,536 subnets, each holding 18,446,744,073,709,551,616 addresses.</p>
<p><strong>The arithmetic is counting in hex.</strong> The fourth hextet goes 0000, 0001, 0002 and so on to ffff. That is the whole operation. There is no block size, no rounding down, no network-and-broadcast pair to subtract.</p>
<p><strong>Why this follows from the address size rather than from a design choice.</strong> In IPv4 you traded subnets against hosts because both were scarce. In IPv6 a /64 is larger than any LAN that will ever exist, so there is nothing to trade. Subnetting stops being arithmetic and becomes organisation: give each site, floor or VLAN a number, and write it where a human will read it.</p>`,
        `<p>Đây là phần làm bất ngờ mọi người vừa từ Chương 10 sang. <strong>IPv6 không có VLSM, và không có 2^h &minus; 2.</strong></p>
<p>Bạn được cấp một /48. Interface ID thì cố định 64 bit. Vậy thứ duy nhất bạn đổi được là <strong>16 bit subnet ID</strong> nằm giữa — và 16 bit cho 65.536 subnet, mỗi cái chứa 18.446.744.073.709.551.616 địa chỉ.</p>
<p><strong>Phần số học là đếm trong hệ hex.</strong> Hextet thứ tư chạy 0000, 0001, 0002 và cứ thế tới ffff. Đó là toàn bộ thao tác. Không có kích thước khối, không làm tròn xuống, không có cặp mạng-và-broadcast nào để trừ đi.</p>
<p><strong>Vì sao điều này suy ra từ kích cỡ địa chỉ chứ không phải từ một lựa chọn thiết kế.</strong> Trong IPv4 bạn đánh đổi subnet lấy host vì cả hai đều khan hiếm. Trong IPv6 thì một /64 lớn hơn mọi mạng LAN sẽ từng tồn tại, nên chẳng có gì để đánh đổi. Chia subnet thôi là số học và trở thành sắp xếp: cho mỗi cơ sở, mỗi tầng hay mỗi VLAN một con số, rồi viết nó vào chỗ mà con người sẽ đọc.</p>`],

      [21, '11.9 worked — 2001:db8:acad::/48 into /64s',
        `<p>Five networks, the same five as the VLSM exercise in Chapter 10, addressed in IPv6.</p>
<ul>
<li>subnet 0000 → <code>2001:db8:acad::/64</code> — management</li>
<li>subnet 0001 → <code>2001:db8:acad:1::/64</code> — Sales</li>
<li>subnet 0002 → <code>2001:db8:acad:2::/64</code> — Engineering</li>
<li>subnet 0003 → <code>2001:db8:acad:3::/64</code> — Admin</li>
<li>subnet ffff → <code>2001:db8:acad:ffff::/64</code> — the 65,536th and last</li>
</ul>
<p><strong>Compare with Chapter 10.</strong> There, the same five networks consumed 120 of 256 addresses, the two WAN links needed /30s, and every boundary had to be computed and checked for overlap. Here each network gets a whole /64, the router links get /64s too, and nothing has to be measured at all.</p>
<p>★ <strong>In practice people number by meaning</strong> rather than sequentially — <code>:10::</code> for floor 1, <code>:20::</code> for floor 2, <code>:ff::</code> for management. That is exactly the structured-design habit from section 10.9, and IPv6 makes it free: there is no cost to leaving gaps when you have 65,536 subnets.</p>`,
        `<p>Năm mạng, đúng năm mạng của bài VLSM ở Chương 10, đánh địa chỉ bằng IPv6.</p>
<ul>
<li>subnet 0000 → <code>2001:db8:acad::/64</code> — quản trị</li>
<li>subnet 0001 → <code>2001:db8:acad:1::/64</code> — Kinh doanh</li>
<li>subnet 0002 → <code>2001:db8:acad:2::/64</code> — Kỹ thuật</li>
<li>subnet 0003 → <code>2001:db8:acad:3::/64</code> — Hành chính</li>
<li>subnet ffff → <code>2001:db8:acad:ffff::/64</code> — cái thứ 65.536 và cũng là cuối cùng</li>
</ul>
<p><strong>So với Chương 10.</strong> Ở đó, cũng năm mạng ấy ngốn 120 trên 256 địa chỉ, hai đường WAN cần /30, và mọi ranh giới đều phải tính rồi kiểm xem có chồng nhau không. Ở đây mỗi mạng được trọn một /64, các đường nối router cũng được /64, và hoàn toàn không có gì phải đo.</p>
<p>★ <strong>Trên thực tế người ta đánh số theo ý nghĩa</strong> chứ không tuần tự — <code>:10::</code> cho tầng 1, <code>:20::</code> cho tầng 2, <code>:ff::</code> cho quản trị. Đó đúng là thói quen thiết kế có cấu trúc của mục 10.9, và IPv6 làm cho nó miễn phí: chừa khoảng trống chẳng tốn gì khi bạn có 65.536 subnet.</p>`],

      [22, '11.10 AI tools, and the checks that catch them',
        `<p>The syllabus asks for this as a self-learning item, so here is how to do it in a way that earns the mark.</p>
<p><strong>IPv6 is worse than IPv4 for trusting a generated answer,</strong> and it is worth being explicit about why. A wrong hextet looks exactly like a right one. There is no familiar shape to catch the eye the way <code>192.168.1.300</code> immediately looks wrong. An address can be off by one character and remain perfectly valid syntax pointing at a different host.</p>
<p><strong>So verify structurally.</strong> Ask a model to explain a concept, then check every address it produces with the library:</p>
<ul>
<li>Does it compress to the same thing? <code>ip_address(x).compressed</code></li>
<li>Is it a legal network boundary? <code>ip_network('...::/64')</code> raises if not.</li>
<li>Is it the type you think? <code>.is_link_local</code>, <code>.is_multicast</code>, <code>.is_loopback</code>.</li>
</ul>
<p><strong>A real example from building this chapter.</strong> The first version of the solicited-node calculator used here was missing one <code>ff</code> byte. It produced <code>ff02::1:0:100</code> instead of <code>ff02::1:ff00:100</code> — a plausible-looking, completely wrong group address. It was caught only by testing the calculator against the worked example in RFC 4291 <em>before</em> trusting its output on anything else.</p>`,
        `<p>Syllabus yêu cầu mục này dưới dạng tự học, nên đây là cách làm sao cho đáng điểm.</p>
<p><strong>IPv6 tệ hơn IPv4 ở khoản tin một đáp án do máy sinh ra,</strong> và đáng nói thẳng ra vì sao. Một hextet sai trông y hệt một hextet đúng. Không có hình dạng quen thuộc nào để mắt bắt được, theo cách mà <code>192.168.1.300</code> nhìn cái là thấy sai ngay. Một địa chỉ có thể lệch đúng một ký tự mà vẫn là cú pháp hoàn toàn hợp lệ trỏ vào một host khác.</p>
<p><strong>Nên hãy kiểm theo cấu trúc.</strong> Nhờ mô hình giải thích khái niệm, rồi kiểm mọi địa chỉ nó sinh ra bằng thư viện:</p>
<ul>
<li>Nó có rút gọn ra đúng thứ đó không? <code>ip_address(x).compressed</code></li>
<li>Nó có phải ranh giới mạng hợp lệ không? <code>ip_network('...::/64')</code> sẽ ném lỗi nếu không.</li>
<li>Nó có đúng loại bạn nghĩ không? <code>.is_link_local</code>, <code>.is_multicast</code>, <code>.is_loopback</code>.</li>
</ul>
<p><strong>Một ví dụ thật từ lúc dựng chính chương này.</strong> Bản đầu tiên của bộ tính solicited-node dùng ở đây thiếu một byte <code>ff</code>. Nó cho ra <code>ff02::1:0:100</code> thay vì <code>ff02::1:ff00:100</code> — một địa chỉ nhóm trông hợp lý mà sai hoàn toàn. Nó chỉ bị bắt nhờ đem bộ tính đó thử với ví dụ mẫu trong RFC 4291 <em>trước khi</em> tin kết quả của nó cho bất cứ thứ gì khác.</p>`],

      [23, '★ IPv6 on your own server, as it actually is',
        `<p>Everything above describes a machine you already run. Measured on a production VPS:</p>
<ul>
<li><strong>Thirteen link-local addresses</strong>, one per interface, and nobody configured any of them.</li>
<li><strong>Zero global addresses.</strong> The provider allocated IPv4 only.</li>
<li><strong>One neighbour:</strong> <code>fe80::943d:faff:fe00:4e9 dev eth0 ... router STALE</code>.</li>
<li><code>net.ipv6.conf.all.forwarding = 0</code> — unlike IPv4, where <code>ip_forward</code> is 1 because Docker set it.</li>
<li>nginx already carries <code>listen [::]:80</code> and <code>listen [::]:443 ssl</code>.</li>
</ul>
<p><strong>Two things to read off that.</strong> <code>STALE</code> is a normal neighbour state, not a fault — Chapter 8 covered the five states, and only <code>FAILED</code> is a problem. And that neighbour's address is EUI-64 derived from its MAC, which is exactly how the earlier slide could be <em>checked</em> rather than merely asserted.</p>
<p><strong>What it would take to go dual-stack.</strong> The provider allocates a prefix, the interface gets a GUA, and nginx already listens. The addressing is the only missing piece, and this chapter is what lets you tell that apart from "IPv6 is broken here".</p>`,
        `<p>Mọi thứ ở trên mô tả một cái máy bạn đang vận hành. Đo trên một VPS sản xuất:</p>
<ul>
<li><strong>Mười ba địa chỉ link-local</strong>, mỗi cổng một cái, và không ai cấu hình cái nào cả.</li>
<li><strong>Không có địa chỉ toàn cục nào.</strong> Nhà cung cấp chỉ cấp IPv4.</li>
<li><strong>Một láng giềng:</strong> <code>fe80::943d:faff:fe00:4e9 dev eth0 ... router STALE</code>.</li>
<li><code>net.ipv6.conf.all.forwarding = 0</code> — khác với IPv4, nơi <code>ip_forward</code> bằng 1 vì Docker đã bật.</li>
<li>nginx thì đã có sẵn <code>listen [::]:80</code> và <code>listen [::]:443 ssl</code>.</li>
</ul>
<p><strong>Hai điều đọc ra từ đó.</strong> <code>STALE</code> là một trạng thái láng giềng bình thường, không phải lỗi — Chương 8 đã nói về năm trạng thái, và chỉ <code>FAILED</code> mới là vấn đề. Và địa chỉ của cái láng giềng ấy là EUI-64 suy ra từ MAC của nó, đúng là cách để slide trước đó được <em>kiểm chứng</em> chứ không phải chỉ được khẳng định.</p>
<p><strong>Cần gì để chạy song song hai ngăn xếp.</strong> Nhà cung cấp cấp một tiền tố, cổng mạng có một GUA, và nginx thì đã nghe sẵn rồi. Phần địa chỉ là mảnh duy nhất còn thiếu, và chương này là thứ cho phép bạn phân biệt điều đó với câu "IPv6 ở đây hỏng".</p>`],

      [24, '★ The ::1 trap — localhost is two addresses',
        `<p>Now the opening question has its answer, and it is the single most common IPv6 bug for people who do not think they use IPv6.</p>
<p><strong>The mechanism.</strong> A service bound to <code>127.0.0.1</code> listens on IPv4 only. When a client asks the resolver for <code>localhost</code>, it gets back two answers — <code>::1</code> and <code>127.0.0.1</code> — and many clients now try <code>::1</code> first. Nothing is listening there, so the connection is refused immediately.</p>
<p><strong>The symptom is maddening precisely because it is so specific.</strong> <code>curl 127.0.0.1:5432</code> works. <code>curl localhost:5432</code> is refused. The application did not change, the database did not change, and the difference is one word in a connection string.</p>
<p><strong>Prove it in one second:</strong> compare <code>curl -4 localhost:5432</code> with <code>curl -6 localhost:5432</code>. If the first works and the second does not, this is the bug.</p>
<p><strong>The fix</strong> is to bind the service to <code>::</code> — which on most systems accepts both families — or to use <code>127.0.0.1</code> explicitly in the connection string rather than the name. Since Node 17 the resolver no longer reorders results, which is why this started biting projects that had not changed anything.</p>`,
        `<p>Giờ thì câu hỏi mở đầu đã có lời giải, và đó là con bọ IPv6 hay gặp nhất với những người không nghĩ rằng mình đang dùng IPv6.</p>
<p><strong>Cơ chế.</strong> Một dịch vụ gắn vào <code>127.0.0.1</code> thì chỉ nghe trên IPv4. Khi một máy khách hỏi bộ phân giải về <code>localhost</code>, nó nhận lại hai câu trả lời — <code>::1</code> và <code>127.0.0.1</code> — và nhiều máy khách bây giờ thử <code>::1</code> trước. Ở đó không có ai nghe, nên kết nối bị từ chối ngay lập tức.</p>
<p><strong>Triệu chứng làm người ta phát điên đúng vì nó quá cụ thể.</strong> <code>curl 127.0.0.1:5432</code> thì được. <code>curl localhost:5432</code> thì bị từ chối. Ứng dụng không đổi, cơ sở dữ liệu không đổi, và khác biệt là đúng một từ trong chuỗi kết nối.</p>
<p><strong>Chứng minh trong một giây:</strong> so <code>curl -4 localhost:5432</code> với <code>curl -6 localhost:5432</code>. Nếu cái đầu chạy còn cái sau thì không, đúng là con bọ này.</p>
<p><strong>Cách sửa</strong> là gắn dịch vụ vào <code>::</code> — trên phần lớn hệ thống thì như vậy nhận cả hai họ địa chỉ — hoặc dùng thẳng <code>127.0.0.1</code> trong chuỗi kết nối thay vì dùng tên. Từ Node 17 thì bộ phân giải không sắp xếp lại kết quả nữa, và đó là lý do chuyện này bắt đầu cắn những dự án chẳng thay đổi gì cả.</p>`],

      [25, '★ Commands for reading IPv6 on a real machine',
        `<p>Six commands, and between them they answer every IPv6 question you can ask about a machine you can log into.</p>
<ul>
<li><code>ip -6 -br addr</code> — every interface and its addresses, one line each.</li>
<li><code>ip -6 route</code> — note the <code>fe80::/64</code> entry per interface, which is link-local scope made visible.</li>
<li><code>ip -6 neigh</code> — the neighbour table, ARP's replacement. States are the same five as Chapter 8.</li>
<li><code>ping6 ff02::1%eth0</code> — ask every node on this link to answer.</li>
<li><code>curl -4</code> and <code>curl -6</code> — force one family, which is how you isolate the ::1 problem.</li>
</ul>
<p><strong>The <code>%eth0</code> is not optional, and it trips everybody once.</strong> A link-local address only means something on a specific link, and a machine with thirteen interfaces has thirteen separate <code>fe80::/64</code> networks that all look alike. Without the zone identifier the kernel cannot know which one you meant — so it refuses rather than guessing, which is the right behaviour and an annoying error message.</p>`,
        `<p>Sáu câu lệnh, và gộp lại chúng trả lời mọi câu hỏi về IPv6 mà bạn đặt ra cho một cái máy bạn đăng nhập được.</p>
<ul>
<li><code>ip -6 -br addr</code> — mọi cổng và các địa chỉ của nó, mỗi cái một dòng.</li>
<li><code>ip -6 route</code> — để ý mục <code>fe80::/64</code> cho từng cổng, đó là phạm vi link-local được hiện ra thành hình.</li>
<li><code>ip -6 neigh</code> — bảng láng giềng, thứ thay thế ARP. Các trạng thái vẫn là năm trạng thái của Chương 8.</li>
<li><code>ping6 ff02::1%eth0</code> — yêu cầu mọi node trên link này trả lời.</li>
<li><code>curl -4</code> và <code>curl -6</code> — ép dùng một họ địa chỉ, đó là cách khoanh vùng vấn đề ::1.</li>
</ul>
<p><strong>Phần <code>%eth0</code> không phải tuỳ chọn, và nó vấp chân mọi người đúng một lần.</strong> Một địa chỉ link-local chỉ có nghĩa trên một link cụ thể, mà một cái máy có mười ba cổng thì có mười ba mạng <code>fe80::/64</code> riêng biệt trông giống hệt nhau. Thiếu định danh vùng thì nhân hệ điều hành không biết bạn nói tới cái nào — nên nó từ chối thay vì đoán, và đó là cách hành xử đúng kèm một thông báo lỗi khó chịu.</p>`],

      [26, 'The five mistakes that cost the most marks',
        `<p>Across this chapter, five errors account for most of the lost marks.</p>
<ul>
<li><strong>Two <code>::</code> in one address.</strong> Illegal, because the split is ambiguous. Only one run may collapse.</li>
<li><strong>Dropping trailing zeros.</strong> <code>0100</code> compresses to <code>100</code>, never to <code>1</code>. Leading only.</li>
<li><strong>A prefix longer than /64 on a LAN.</strong> SLAAC stops and nothing explains why.</li>
<li><strong>Expecting a broadcast address.</strong> There is none. <code>ff02::1</code> is the nearest thing and it is multicast.</li>
<li><strong>Forgetting <code>ipv6 unicast-routing</code>.</strong> The router holds addresses, forwards nothing, and sends no RAs.</li>
</ul>
<p><strong>If you can do three things, you have most of the marks:</strong> compress an address, expand it again, and name the range from its first hextet — 2 or 3 is global, fe80 is link-local, fc or fd is unique-local, ff is multicast, <code>::1</code> is loopback.</p>`,
        `<p>Trên toàn chương này, năm lỗi sau chiếm phần lớn số điểm bị mất.</p>
<ul>
<li><strong>Hai dấu <code>::</code> trong một địa chỉ.</strong> Không hợp lệ, vì chỗ chia bị nhập nhằng. Chỉ một dãy được gộp.</li>
<li><strong>Bỏ số 0 ở đuôi.</strong> <code>0100</code> rút gọn thành <code>100</code>, không bao giờ thành <code>1</code>. Chỉ số 0 đứng đầu thôi.</li>
<li><strong>Tiền tố dài hơn /64 trên một LAN.</strong> SLAAC dừng lại và không gì giải thích vì sao.</li>
<li><strong>Trông chờ có địa chỉ broadcast.</strong> Không có cái nào. <code>ff02::1</code> là thứ gần nhất và nó là multicast.</li>
<li><strong>Quên <code>ipv6 unicast-routing</code>.</strong> Router giữ địa chỉ, không chuyển tiếp gì, và không gửi gói RA nào.</li>
</ul>
<p><strong>Làm được ba việc này là bạn có phần lớn số điểm:</strong> rút gọn một địa chỉ, khai triển nó ra lại, và gọi tên dải từ hextet đầu tiên — 2 hoặc 3 là toàn cục, fe80 là link-local, fc hoặc fd là unique-local, ff là multicast, <code>::1</code> là loopback.</p>`],

      [27, 'What you can do now, and what comes next',
        `<p>If the chapter worked, all of this is now routine.</p>
<ul>
<li>Compress and expand any IPv6 address, both directions, by the two rules.</li>
<li>Name the type from the leading hextet alone.</li>
<li>Explain why there is no broadcast, and what took its place.</li>
<li>Configure a static GUA and LLA on IOS, including <code>ipv6 unicast-routing</code>.</li>
<li>Derive an EUI-64 interface ID from a MAC, and check it on a real machine.</li>
<li>Subnet a /48 into /64s, and say why there is no VLSM and no minus two.</li>
<li>★ Read <code>ip -6 -br addr</code> on your own server and explain every line.</li>
<li>★ Diagnose the <code>::1</code> versus <code>127.0.0.1</code> failure in one command.</li>
</ul>
<p><strong>Next: Chapter 12 — ICMP and Lab 2.3</strong>, sessions 37–40, Cisco Module 13. Ping and traceroute stop being commands you type and become a diagnostic method you can defend — which is what makes the difference between guessing at a network fault and finding it.</p>
<p class="ghi-chu">Note on the source table: the three constructive questions listed for Chapter 12 — CQ13.1, CQ13.2 and CQ13.3 at sessions 37 to 39 — all ask about <em>this</em> chapter's material. The drift continues, and we will point back here when we reach them.</p>`,
        `<p>Nếu chương này có tác dụng thì giờ mọi thứ dưới đây đã thành thói quen.</p>
<ul>
<li>Rút gọn và khai triển bất kỳ địa chỉ IPv6 nào, cả hai chiều, theo đúng hai quy tắc.</li>
<li>Gọi tên loại địa chỉ chỉ từ hextet đầu tiên.</li>
<li>Giải thích vì sao không có broadcast, và cái gì đã thay chỗ nó.</li>
<li>Cấu hình một GUA và một LLA tĩnh trên IOS, kèm <code>ipv6 unicast-routing</code>.</li>
<li>Suy ra interface ID theo EUI-64 từ một địa chỉ MAC, và kiểm nó trên máy thật.</li>
<li>Chia một /48 thành các /64, và nói được vì sao không có VLSM và không có phép trừ hai.</li>
<li>★ Đọc <code>ip -6 -br addr</code> trên máy chủ của mình và giải thích được từng dòng.</li>
<li>★ Chẩn đoán cái hỏng <code>::1</code> so với <code>127.0.0.1</code> bằng một câu lệnh.</li>
</ul>
<p><strong>Tiếp theo: Chương 12 — ICMP và Lab 2.3</strong>, buổi 37–40, Module 13 của Cisco. Ping và traceroute thôi là mấy câu lệnh bạn gõ và trở thành một phương pháp chẩn đoán bạn biện hộ được — và đó là khác biệt giữa đoán mò một sự cố mạng với tìm ra nó.</p>
<p class="ghi-chu">Ghi chú về bảng gốc: ba câu hỏi kiến tạo liệt kê cho Chương 12 — CQ13.1, CQ13.2 và CQ13.3 ở buổi 37 đến 39 — đều hỏi về nội dung của <em>chính</em> chương này. Độ trôi vẫn tiếp diễn, và chúng tôi sẽ trỏ ngược về đây khi tới đó.</p>`],
    ]),

    bi(
      `<h3>⚙️ A complete IPv6 configuration, start to finish</h3>
<pre><code class="language-bash">enable
configure terminal
!
ipv6 unicast-routing              ! OFF by default — without this nothing forwards
!                                 ! and no Router Advertisements are sent
hostname R1
!
interface gigabitEthernet 0/0
 description Sales LAN 2001:db8:acad:1::/64
 ipv6 address 2001:db8:acad:1::1/64       ! the global address
 ipv6 address fe80::1 link-local          ! readable, instead of an EUI-64 one
 no shutdown
!
interface gigabitEthernet 0/1
 description Engineering LAN 2001:db8:acad:2::/64
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local          ! the SAME fe80::1 is fine here
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p><strong>Three things in there are worth pausing on.</strong></p>
<p><code>ipv6 unicast-routing</code> is the line people omit, and omitting it produces a router that looks entirely healthy and does nothing. <code>no shutdown</code> is still required, exactly as in Chapter 9 — IPv6 changes the addressing, not the interface lifecycle. And the <em>same</em> <code>fe80::1</code> on two different interfaces is legal, because link-local addresses are unique per link, not per device. That surprises people, and it is why the zone identifier exists.</p>
<h3>🔍 Verifying it</h3>
<pre><code class="language-bash">show ipv6 interface brief
show ipv6 interface gigabitEthernet 0/0
show ipv6 route
show ipv6 neighbors</code></pre>
<p><code>show ipv6 interface</code> is the one to read carefully: it lists the link-local address, the global addresses, <em>and</em> the multicast groups the interface has joined — which should include <code>FF02::1</code>, <code>FF02::2</code> if routing is on, and a solicited-node group for each address.</p>`,
      `<h3>⚙️ Một cấu hình IPv6 đầy đủ, từ đầu tới cuối</h3>
<pre><code class="language-bash">enable
configure terminal
!
ipv6 unicast-routing              ! mặc định TẮT — thiếu nó thì không gì chuyển tiếp
!                                 ! và không gói Router Advertisement nào được gửi
hostname R1
!
interface gigabitEthernet 0/0
 description Sales LAN 2001:db8:acad:1::/64
 ipv6 address 2001:db8:acad:1::1/64       ! địa chỉ toàn cục
 ipv6 address fe80::1 link-local          ! đọc được, thay cho một cái EUI-64
 no shutdown
!
interface gigabitEthernet 0/1
 description Engineering LAN 2001:db8:acad:2::/64
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local          ! dùng LẠI fe80::1 ở đây là hợp lệ
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p><strong>Ba chỗ trong đó đáng dừng lại.</strong></p>
<p><code>ipv6 unicast-routing</code> là dòng người ta hay bỏ sót, và bỏ sót nó tạo ra một con router nhìn hoàn toàn khoẻ mạnh mà chẳng làm gì. <code>no shutdown</code> vẫn bắt buộc, y như Chương 9 — IPv6 đổi cách đánh địa chỉ chứ không đổi vòng đời của cổng mạng. Và dùng <em>cùng</em> một <code>fe80::1</code> trên hai cổng khác nhau là hợp lệ, bởi vì địa chỉ link-local duy nhất theo từng link chứ không theo từng thiết bị. Chuyện đó làm người ta bất ngờ, và nó là lý do định danh vùng tồn tại.</p>
<h3>🔍 Nghiệm thu</h3>
<pre><code class="language-bash">show ipv6 interface brief
show ipv6 interface gigabitEthernet 0/0
show ipv6 route
show ipv6 neighbors</code></pre>
<p><code>show ipv6 interface</code> là lệnh cần đọc kỹ: nó liệt kê địa chỉ link-local, các địa chỉ toàn cục, <em>và</em> các nhóm multicast mà cổng đã tham gia — trong đó phải có <code>FF02::1</code>, có <code>FF02::2</code> nếu đã bật định tuyến, và một nhóm solicited-node cho mỗi địa chỉ.</p>`,
    ),

    bi(
      `<h3>🗺️ Debugging "IPv6 is not working"</h3>
<pre><code class="language-mermaid">graph TD
  A["A host has no IPv6 connectivity"] --> B{"Does it have an fe80:: address?"}
  B -->|"no"| C["IPv6 is DISABLED on that interface<br/>somebody turned it off"]
  B -->|"yes"| D{"Does it have a 2xxx or 3xxx address?"}
  D -->|"no"| E["No Router Advertisement reached it<br/>check ipv6 unicast-routing on the router"]
  D -->|"yes"| F{"ping6 the default gateway's fe80:: works?"}
  F -->|"no"| G["Layer 2 or Neighbor Discovery<br/>check ip -6 neigh for FAILED"]
  F -->|"yes"| H["Addressing is fine — look at routing,<br/>firewall, or the application"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F ask
  class A,C,E act
  class G,H ok</code></pre>
<p>The first question is the one that saves the most time, and it is the opposite of what instinct suggests. <strong>The presence of <code>fe80::</code> is good news</strong> — it proves IPv6 is enabled and the interface is working at layer 2. Its absence means somebody disabled IPv6, which is a one-line fix. People routinely spend an hour at the wrong layer because they read "only a link-local address" as a symptom rather than as the healthy baseline.</p>`,
      `<h3>🗺️ Gỡ lỗi "IPv6 không chạy"</h3>
<pre><code class="language-mermaid">graph TD
  A["Một host không có kết nối IPv6"] --> B{"Nó có địa chỉ fe80:: không?"}
  B -->|"không"| C["IPv6 bị TẮT trên cổng đó<br/>ai đó đã tắt nó đi"]
  B -->|"có"| D{"Nó có địa chỉ 2xxx hay 3xxx không?"}
  D -->|"không"| E["Không gói Router Advertisement nào tới<br/>kiểm ipv6 unicast-routing trên router"]
  D -->|"có"| F{"ping6 tới fe80:: của cổng ra có được không?"}
  F -->|"không"| G["Tầng 2 hoặc Neighbor Discovery<br/>xem ip -6 neigh có FAILED không"]
  F -->|"có"| H["Phần địa chỉ ổn — nhìn sang định tuyến,<br/>tường lửa, hoặc chính ứng dụng"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F ask
  class A,C,E act
  class G,H ok</code></pre>
<p>Câu hỏi đầu tiên là câu tiết kiệm nhiều thời gian nhất, và nó ngược với trực giác. <strong>Sự có mặt của <code>fe80::</code> là tin tốt</strong> — nó chứng minh IPv6 đang bật và cổng mạng đang chạy ở tầng 2. Sự vắng mặt của nó nghĩa là có người đã tắt IPv6, và đó là một bản vá một dòng. Người ta thường xuyên mất cả tiếng ở sai tầng vì đọc "chỉ có mỗi địa chỉ link-local" như một triệu chứng, trong khi nó là cái nền khoẻ mạnh.</p>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — forgetting <code>ipv6 unicast-routing</code>.</strong> <b>Symptom:</b> the router has correct addresses, <code>show ipv6 interface</code> looks perfect, and no host on the LAN gets a global address. Nothing logs an error, because nothing is wrong from the router's point of view — it was simply never told to route.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — pinging a link-local address without a zone.</strong> <code>ping6 fe80::1</code> fails on a machine with several interfaces. <b>Symptom:</b> "invalid argument" or "network unreachable" for an address you can see in the neighbour table. Add <code>%eth0</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — assuming DHCPv6 will hand out a prefix without an RA.</strong> It will not; the RA is what tells the host DHCPv6 is even in use. <b>Symptom:</b> a working DHCPv6 server that no client ever contacts.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — binding a service to 127.0.0.1 and testing with <code>localhost</code>.</strong> <b>Symptom:</b> works from the terminal you tested in, refuses from the application, or vice versa, with no pattern until you notice one used the name and the other the literal address.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — reading "only fe80::" as a fault.</strong> <b>Symptom:</b> an hour spent on the host when the problem is upstream. Link-local is the part that always works; its presence narrows the fault, it does not indicate one.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — quên <code>ipv6 unicast-routing</code>.</strong> <b>Triệu chứng:</b> router có địa chỉ đúng, <code>show ipv6 interface</code> nhìn hoàn hảo, và không host nào trên LAN lấy được địa chỉ toàn cục. Không có lỗi nào được ghi, vì xét từ góc nhìn của router thì chẳng có gì sai — chỉ là chưa ai bảo nó định tuyến.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — ping một địa chỉ link-local mà không kèm vùng.</strong> <code>ping6 fe80::1</code> hỏng trên một cái máy có nhiều cổng. <b>Triệu chứng:</b> "invalid argument" hoặc "network unreachable" cho một địa chỉ mà bạn nhìn thấy rành rành trong bảng láng giềng. Hãy thêm <code>%eth0</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — tưởng DHCPv6 sẽ phát tiền tố mà không cần RA.</strong> Nó không phát; chính gói RA mới là thứ nói cho host biết là có dùng DHCPv6. <b>Triệu chứng:</b> một máy chủ DHCPv6 chạy tốt mà không máy khách nào liên hệ tới.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — gắn dịch vụ vào 127.0.0.1 rồi thử bằng <code>localhost</code>.</strong> <b>Triệu chứng:</b> chạy được ở cái terminal bạn vừa thử, bị từ chối từ phía ứng dụng, hoặc ngược lại, không theo quy luật nào cho tới khi bạn để ý rằng một bên dùng tên còn bên kia dùng địa chỉ số.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — đọc "chỉ có fe80::" như một cái hỏng.</strong> <b>Triệu chứng:</b> mất một tiếng loay hoay với host trong khi vấn đề nằm ở thượng nguồn. Link-local là phần luôn luôn chạy; sự có mặt của nó thu hẹp vùng hỏng chứ không chỉ ra một cái hỏng.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> An interface has MAC <code>00:1a:2f:11:22:33</code>. Derive its EUI-64 link-local address, showing each step.</p>
<div class="dap-an"><ol>
<li><b>Insert ff:fe:</b> <code>00:1a:2f</code> + <code>ff:fe</code> + <code>11:22:33</code> = <code>00:1a:2f:ff:fe:11:22:33</code>.</li>
<li><b>Flip the U/L bit:</b> 0x00 XOR 0x02 = 0x02. So the first byte becomes <code>02</code>.</li>
<li><b>Regroup into hextets and prepend fe80:</b> <code>021a:2fff:fe11:2233</code>.</li>
<li><b>Result:</b> <b>fe80::21a:2fff:fe11:2233</b> — note <code>021a</code> compresses to <code>21a</code>.</li>
</ol>
<pre><code class="language-bash">python3 -c "
import ipaddress as i
b=[int(x,16) for x in '00:1a:2f:11:22:33'.split(':')]
b[0]^=0x02
e=b[:3]+[0xff,0xfe]+b[3:]
h=''.join(f'{x:02x}' for x in e)
print(i.ip_address('fe80::'+':'.join(h[k:k+4] for k in range(0,16,4))).compressed)"</code></pre>
<pre><code class="language-plaintext">fe80::21a:2fff:fe11:2233</code></pre>
<p>The step people get wrong is the bit flip when the first byte is <code>00</code> — it becomes <code>02</code>, not <code>20</code>. XOR with 0x02 changes the second-lowest bit of the byte, not the second hex digit.</p></div>

<p><b>E2.</b> Design an IPv6 addressing scheme for the same five networks you addressed with VLSM in Chapter 10: Sales, Engineering, Admin, and two router-to-router links. You have <code>2001:db8:acad::/48</code>. How much of the allocation do you use?</p>
<div class="dap-an"><table>
<thead><tr><th>Network</th><th>Prefix</th><th>Router address</th></tr></thead>
<tbody>
<tr><td>Sales</td><td>2001:db8:acad:1::/64</td><td>2001:db8:acad:1::1</td></tr>
<tr><td>Engineering</td><td>2001:db8:acad:2::/64</td><td>2001:db8:acad:2::1</td></tr>
<tr><td>Admin</td><td>2001:db8:acad:3::/64</td><td>2001:db8:acad:3::1</td></tr>
<tr><td>WAN R1&ndash;R2</td><td>2001:db8:acad:100::/64</td><td>::1 and ::2</td></tr>
<tr><td>WAN R2&ndash;R3</td><td>2001:db8:acad:101::/64</td><td>::1 and ::2</td></tr>
</tbody></table>
<p><b>Usage: 5 subnets out of 65,536</b>, or 0.0076%. Compare with Chapter 10, where the same five networks consumed 120 of 256 addresses — 47% — and the fifth network did not fit at all under fixed-size subnetting.</p>
<p>Two design points worth defending in a dialogue assessment. <b>The WAN links get a full /64 each</b>, which feels wasteful and is not: there is nothing else to do with the space, and a /64 keeps SLAAC available if it is ever needed. And <b>the WAN links are numbered from 100</b> rather than 4 and 5, leaving the low numbers contiguous for LANs so that a future summary route can cover them.</p></div>

<p><b>E3.</b> ★ A service is bound to <code>127.0.0.1:3000</code>. A colleague says "the API is down" because <code>curl localhost:3000</code> fails. Give the one-command proof, the explanation, and two possible fixes.</p>
<div class="dap-an"><p><b>Proof:</b></p>
<pre><code class="language-bash">curl -4 localhost:3000     # works
curl -6 localhost:3000     # connection refused</code></pre>
<p><b>Explanation.</b> <code>localhost</code> resolves to both <code>::1</code> and <code>127.0.0.1</code>. The client tries <code>::1</code> first; nothing is listening on the IPv6 loopback because the service bound to the IPv4 one, so the connection is refused immediately rather than timing out. The API is not down — it is reachable on exactly one of the two addresses that <code>localhost</code> names.</p>
<p><b>Fix A:</b> bind the service to <code>::</code>, which on most systems accepts both families through a dual-stack socket. <b>Fix B:</b> use <code>127.0.0.1</code> in the connection string rather than the name, which removes the resolver from the question entirely.</p>
<p>Which to choose depends on intent. If the service should be reachable from outside, binding to <code>::</code> is right. If it should stay strictly local, binding to <code>127.0.0.1</code> and connecting to <code>127.0.0.1</code> is the more honest configuration, because the binding then says what it means.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một cổng mạng có MAC <code>00:1a:2f:11:22:33</code>. Hãy suy ra địa chỉ link-local theo EUI-64 của nó, trình bày từng bước.</p>
<div class="dap-an"><ol>
<li><b>Chèn ff:fe:</b> <code>00:1a:2f</code> + <code>ff:fe</code> + <code>11:22:33</code> = <code>00:1a:2f:ff:fe:11:22:33</code>.</li>
<li><b>Lật bit U/L:</b> 0x00 XOR 0x02 = 0x02. Vậy byte đầu thành <code>02</code>.</li>
<li><b>Gom thành hextet và thêm fe80 vào trước:</b> <code>021a:2fff:fe11:2233</code>.</li>
<li><b>Kết quả:</b> <b>fe80::21a:2fff:fe11:2233</b> — để ý <code>021a</code> rút gọn thành <code>21a</code>.</li>
</ol>
<pre><code class="language-bash">python3 -c "
import ipaddress as i
b=[int(x,16) for x in '00:1a:2f:11:22:33'.split(':')]
b[0]^=0x02
e=b[:3]+[0xff,0xfe]+b[3:]
h=''.join(f'{x:02x}' for x in e)
print(i.ip_address('fe80::'+':'.join(h[k:k+4] for k in range(0,16,4))).compressed)"</code></pre>
<pre><code class="language-plaintext">fe80::21a:2fff:fe11:2233</code></pre>
<p>Bước người ta hay sai là lật bit khi byte đầu là <code>00</code> — nó thành <code>02</code> chứ không phải <code>20</code>. XOR với 0x02 đổi bit thấp thứ hai của byte, không phải chữ số hex thứ hai.</p></div>

<p><b>E2.</b> Hãy thiết kế sơ đồ địa chỉ IPv6 cho đúng năm mạng mà bạn đã đánh địa chỉ bằng VLSM ở Chương 10: Kinh doanh, Kỹ thuật, Hành chính, và hai đường nối router. Bạn có <code>2001:db8:acad::/48</code>. Bạn dùng hết bao nhiêu phần cấp phát?</p>
<div class="dap-an"><table>
<thead><tr><th>Mạng</th><th>Tiền tố</th><th>Địa chỉ router</th></tr></thead>
<tbody>
<tr><td>Kinh doanh</td><td>2001:db8:acad:1::/64</td><td>2001:db8:acad:1::1</td></tr>
<tr><td>Kỹ thuật</td><td>2001:db8:acad:2::/64</td><td>2001:db8:acad:2::1</td></tr>
<tr><td>Hành chính</td><td>2001:db8:acad:3::/64</td><td>2001:db8:acad:3::1</td></tr>
<tr><td>WAN R1&ndash;R2</td><td>2001:db8:acad:100::/64</td><td>::1 và ::2</td></tr>
<tr><td>WAN R2&ndash;R3</td><td>2001:db8:acad:101::/64</td><td>::1 và ::2</td></tr>
</tbody></table>
<p><b>Đã dùng: 5 subnet trên 65.536</b>, tức 0,0076%. So với Chương 10, nơi cũng năm mạng ấy ngốn 120 trên 256 địa chỉ — 47% — và mạng thứ năm thì hoàn toàn không vừa nếu chia đều.</p>
<p>Hai điểm thiết kế đáng biện hộ trong buổi vấn đáp. <b>Mỗi đường WAN được trọn một /64</b>, nghe thì phí mà thật ra không: chẳng có việc gì khác để làm với chỗ đó, và một /64 giữ cho SLAAC vẫn dùng được nếu sau này cần. Và <b>các đường WAN đánh số từ 100</b> chứ không phải 4 và 5, để dành các số thấp liền mạch cho LAN, nhờ vậy sau này một tuyến tóm tắt có thể phủ được chúng.</p></div>

<p><b>E3.</b> ★ Một dịch vụ gắn vào <code>127.0.0.1:3000</code>. Đồng nghiệp nói "API chết rồi" vì <code>curl localhost:3000</code> hỏng. Hãy đưa ra phép chứng minh bằng một câu lệnh, lời giải thích, và hai cách sửa.</p>
<div class="dap-an"><p><b>Chứng minh:</b></p>
<pre><code class="language-bash">curl -4 localhost:3000     # chạy được
curl -6 localhost:3000     # connection refused</code></pre>
<p><b>Giải thích.</b> <code>localhost</code> phân giải ra cả <code>::1</code> lẫn <code>127.0.0.1</code>. Máy khách thử <code>::1</code> trước; không có ai nghe trên loopback IPv6 vì dịch vụ gắn vào loopback IPv4, nên kết nối bị từ chối ngay lập tức chứ không phải hết giờ. API không chết — nó tới được ở đúng một trong hai địa chỉ mà <code>localhost</code> đặt tên cho.</p>
<p><b>Cách sửa A:</b> gắn dịch vụ vào <code>::</code>, trên phần lớn hệ thống thì như vậy nhận cả hai họ địa chỉ qua một socket hai ngăn xếp. <b>Cách sửa B:</b> dùng <code>127.0.0.1</code> trong chuỗi kết nối thay vì dùng tên, cách này loại bỏ hẳn bộ phân giải khỏi câu chuyện.</p>
<p>Chọn cách nào là tuỳ ý định. Nếu dịch vụ nên tới được từ bên ngoài thì gắn vào <code>::</code> là đúng. Nếu nó phải nằm chặt trong máy thì gắn vào <code>127.0.0.1</code> rồi kết nối tới <code>127.0.0.1</code> là cấu hình trung thực hơn, bởi vì khi ấy cái chỗ gắn nói đúng điều nó muốn nói.</p></div>`,
    ),

    bi(
      `<div class="note-ct"><h3>💬 The school's constructive questions — session 36</h3>
<p><strong>The published table has no entry for session 36.</strong> It is one of eight sessions left blank in the question column (6, 9, 15, 16, 22, 30, 36, 56). We report that as published and do not invent a school question to fill it.</p>
<p><strong>★ Two questions of our own for session 36,</strong> matching what the session actually teaches:</p>
<ul>
<li>A router has correct IPv6 addresses on every interface and every host on its LANs has only a link-local address. Name the single most likely configuration line that is missing, and explain why the fault produces no error message anywhere.</li>
<li>Why does IPv6 not need VLSM? Answer by comparing what you traded away in a Chapter 10 subnetting exercise with what you trade away in an IPv6 one.</li>
</ul>
<p class="ghi-chu">Looking ahead: the three questions the table assigns to Chapter 12 — CQ13.1 "What happens do we use IPv4 in nowadays?" (session 37), CQ13.2 "Compare types of IPv6 network addresses" (38) and CQ13.3 "How to configure IPv6 address on Cisco devices?" (39) — all ask about material taught in <em>this</em> chapter: sections 11.2, 11.4 and 11.5 respectively. Quoted here so you can see the pattern; they will be answered in place when Chapter 12 reaches them.</p></div>`,
      `<div class="note-ct"><h3>💬 Câu hỏi kiến tạo của trường — buổi 36</h3>
<p><strong>Bảng đã công bố không có mục nào cho buổi 36.</strong> Đó là một trong tám buổi bị bỏ trống ở cột câu hỏi (6, 9, 15, 16, 22, 30, 36, 56). Chúng tôi nêu đúng như đã công bố và không bịa ra một câu hỏi của trường để lấp vào.</p>
<p><strong>★ Hai câu của chúng tôi cho buổi 36,</strong> khớp với nội dung buổi này thật sự dạy:</p>
<ul>
<li>Một con router có địa chỉ IPv6 đúng trên mọi cổng, và mọi host trên các LAN của nó chỉ có địa chỉ link-local. Hãy gọi tên đúng một dòng cấu hình nhiều khả năng nhất đang bị thiếu, và giải thích vì sao cái hỏng đó không sinh ra thông báo lỗi nào ở đâu cả.</li>
<li>Vì sao IPv6 không cần VLSM? Hãy trả lời bằng cách so sánh thứ bạn phải đánh đổi trong một bài chia subnet ở Chương 10 với thứ bạn phải đánh đổi trong một bài IPv6.</li>
</ul>
<p class="ghi-chu">Nhìn trước một chút: ba câu mà bảng gán cho Chương 12 — CQ13.1 "What happens do we use IPv4 in nowadays?" (buổi 37), CQ13.2 "Compare types of IPv6 network addresses" (38) và CQ13.3 "How to configure IPv6 address on Cisco devices?" (39) — đều hỏi về nội dung dạy ở <em>chính</em> chương này: lần lượt là các mục 11.2, 11.4 và 11.5. Trích ra đây để bạn thấy quy luật; chúng sẽ được trả lời đúng chỗ khi Chương 12 tới nơi.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 11 — IPv6 Addressing|||Quiz Chương 11 — Địa chỉ IPv6',
  slug: 'nwc204-ch11-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 11: rút gọn và khai triển địa chỉ, vì sao chỉ được một dấu :: duy nhất, số 0 ở đuôi, nhận loại địa chỉ từ hextet đầu, vì sao IPv6 bỏ broadcast, /64 là ranh giới cứng và chuyện gì xảy ra khi vượt, EUI-64 và bit U/L, cờ M và O trong gói RA, Duplicate Address Detection, solicited-node multicast thay ARP, vì sao không có VLSM, và bẫy ::1 so với 127.0.0.1. Mỗi câu có giải thích, mọi địa chỉ đã kiểm bằng python3.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('What is the correct compressed form of 2001:0db8:0000:0000:00ab:0000:0000:1234?|||Dạng rút gọn đúng của 2001:0db8:0000:0000:00ab:0000:0000:1234 là gì?',
        ['2001:db8::ab::1234', '2001:db8::ab:0:0:1234', '2001:db8:0:0:ab::1234', '2001:db8::ab:1234'],
        1,
        'There are two runs of two zero hextets, and only ONE may collapse, so the first option is invalid. When runs are equal in length the canonical choice is the first one, giving 2001:db8::ab:0:0:1234. The third option is a legal address but not the canonical form. The fourth has lost two hextets entirely and is a different address.|||Có hai dãy, mỗi dãy hai hextet số 0, mà chỉ MỘT dãy được gộp, nên phương án đầu không hợp lệ. Khi hai dãy dài bằng nhau thì lựa chọn chuẩn tắc là dãy đầu tiên, cho ra 2001:db8::ab:0:0:1234. Phương án thứ ba là một địa chỉ hợp lệ nhưng không phải dạng chuẩn tắc. Phương án thứ tư mất hẳn hai hextet và là một địa chỉ khác.'),

      q('Why may :: appear only once in an IPv6 address?|||Vì sao dấu :: chỉ được xuất hiện một lần trong một địa chỉ IPv6?',
        ['It would be too long to read|||Viết ra sẽ quá dài để đọc', 'With two, there is no way to know how the missing hextets divide between them|||Có hai cái thì không có cách nào biết các hextet thiếu chia ra sao giữa chúng', 'IOS does not support it|||IOS không hỗ trợ', 'It would break the /64 boundary|||Nó sẽ phá vỡ ranh giới /64'],
        1,
        ':: means "as many zero hextets as are needed to make eight". With one, a parser counts the hextets present and fills in the rest deterministically. With two, an address like 2001:db8::acad::1 could mean several different addresses depending on how the missing hextets split, so the notation is ambiguous and therefore invalid.|||Dấu :: có nghĩa "bao nhiêu hextet số 0 cũng được, miễn đủ tám". Có một cái thì bộ phân tích đếm số hextet đang có rồi bù phần còn lại một cách xác định. Có hai cái thì một địa chỉ như 2001:db8::acad::1 có thể mang vài nghĩa khác nhau tuỳ cách chia các hextet thiếu, nên cách viết đó nhập nhằng và do đó không hợp lệ.'),

      q('The hextet 0100 compresses to what?|||Hextet 0100 rút gọn thành gì?',
        ['1', '01', '100', 'it cannot be compressed|||không rút gọn được'],
        2,
        'Rule 1 drops LEADING zeros only, so 0100 becomes 100. Dropping trailing zeros would change the value entirely: 0100 is 256, while 01 is 1. They are different addresses, and the shortening is silent — no tool will warn you, the address is simply wrong from then on.|||Quy tắc 1 chỉ bỏ các số 0 ĐỨNG ĐẦU, nên 0100 thành 100. Bỏ số 0 ở đuôi sẽ đổi hẳn giá trị: 0100 là 256, còn 01 là 1. Đó là hai địa chỉ khác nhau, và phép rút gọn ấy im lặng — không công cụ nào cảnh báo bạn, địa chỉ chỉ đơn giản là sai từ đó trở đi.'),

      q('An address begins with fe80. What type is it, and will a router forward it?|||Một địa chỉ bắt đầu bằng fe80. Nó thuộc loại nào, và router có chuyển tiếp nó không?',
        ['Global unicast, forwarded normally|||Unicast toàn cục, được chuyển tiếp bình thường', 'Link-local, and a router NEVER forwards it|||Link-local, và router KHÔNG BAO GIỜ chuyển tiếp nó', 'Unique local, forwarded inside your network only|||Unique local, chỉ chuyển tiếp trong mạng của bạn', 'Multicast, forwarded to the group|||Multicast, chuyển tiếp tới nhóm'],
        1,
        'fe80::/10 is link-local. Every IPv6 interface builds one automatically, always, with no configuration and no server, and its scope is exactly the wire it is on. That is why you cannot reach it from elsewhere: not because something blocks it, but because it has no meaning off that link. Link-local is also the next hop of every entry in an IPv6 routing table.|||fe80::/10 là link-local. Mọi cổng IPv6 đều tự dựng một cái, luôn luôn, không cần cấu hình và không cần máy chủ, và phạm vi của nó đúng bằng sợi dây nó đang ở. Đó là lý do bạn không tới được nó từ chỗ khác: không phải vì có gì chặn, mà vì nó không có nghĩa ngoài cái link đó. Link-local cũng là next hop của mọi mục trong một bảng định tuyến IPv6.'),

      q('Which of these does IPv6 NOT have?|||IPv6 KHÔNG có cái nào trong số này?',
        ['Unicast', 'Multicast', 'Broadcast', 'Anycast'],
        2,
        'Broadcast was removed on purpose. It interrupts every device on the link, including ones that cannot use the packet, and the CPU of each one must look at it. Multicast does the same job better: a host that joined no group is never woken, because its network card filters the traffic in hardware. ff02::1 reaches all nodes and is the nearest equivalent, but it is multicast, not broadcast.|||Broadcast bị bỏ đi có chủ ý. Nó làm phiền mọi thiết bị trên link, kể cả những cái không dùng được gói đó, và CPU của từng cái đều phải nhìn vào. Multicast làm cùng việc ấy tốt hơn: một host không tham gia nhóm nào thì không bao giờ bị đánh thức, vì card mạng của nó lọc lưu lượng ngay ở phần cứng. ff02::1 tới được mọi node và là thứ gần tương đương nhất, nhưng nó là multicast chứ không phải broadcast.'),

      q('You configure 2001:db8:acad:1::1/80 on a router LAN interface. What happens?|||Bạn cấu hình 2001:db8:acad:1::1/80 lên cổng LAN của router. Chuyện gì xảy ra?',
        ['IOS rejects the configuration|||IOS từ chối cấu hình đó', 'It works but wastes address space|||Nó vẫn chạy nhưng phí không gian địa chỉ', 'The interface comes up and hosts get NO global address, with no error anywhere|||Cổng lên và host KHÔNG lấy được địa chỉ toàn cục nào, và không có lỗi ở đâu cả', 'Only the first 16 hosts can get an address|||Chỉ 16 host đầu tiên lấy được địa chỉ'],
        2,
        'SLAAC builds the interface ID as exactly 64 bits, because that is what EUI-64 produces and what the standard assumes. A /80 leaves only 48 bits, so the host has no legal way to construct an address and constructs none. Everything looks healthy: the configuration is accepted, the interface is up, the connected route exists, the router own address works. Only the hosts are silent, and nothing logs why — which makes this the most expensive mistake in the chapter.|||SLAAC dựng interface ID dài đúng 64 bit, vì đó là thứ EUI-64 tạo ra và là thứ tiêu chuẩn giả định. Một /80 chỉ chừa 48 bit, nên host không có cách hợp lệ nào để dựng địa chỉ và nó không dựng ra cái nào. Mọi thứ nhìn đều khoẻ mạnh: cấu hình được nhận, cổng lên, tuyến kết nối có mặt, địa chỉ của chính router thì chạy. Chỉ có các host là im lặng, và không log nào nói vì sao — điều đó làm nó thành cái sai đắt nhất chương này.'),

      q('An interface has MAC 00:1a:2f:11:22:33. What is its EUI-64 link-local address?|||Một cổng có MAC 00:1a:2f:11:22:33. Địa chỉ link-local theo EUI-64 của nó là gì?',
        ['fe80::1a:2fff:fe11:2233', 'fe80::21a:2fff:fe11:2233', 'fe80::201a:2fff:fe11:2233', 'fe80::1a2f:fffe:1122:33'],
        1,
        'Insert ff:fe in the middle to get 00:1a:2f:ff:fe:11:22:33, then flip the U/L bit: 0x00 XOR 0x02 = 0x02, so the first byte becomes 02. Regrouping gives 021a:2fff:fe11:2233, and leading-zero compression makes that 21a:2fff:fe11:2233. The trap is the bit flip: XOR with 0x02 changes the second-lowest BIT of the byte, giving 02, not the second hex DIGIT, which would give 20.|||Chèn ff:fe vào giữa được 00:1a:2f:ff:fe:11:22:33, rồi lật bit U/L: 0x00 XOR 0x02 = 0x02, nên byte đầu thành 02. Gom nhóm lại được 021a:2fff:fe11:2233, và rút gọn số 0 đứng đầu cho ra 21a:2fff:fe11:2233. Cái bẫy nằm ở phép lật bit: XOR với 0x02 đổi BIT thấp thứ hai của byte, cho ra 02, chứ không phải CHỮ SỐ hex thứ hai, vốn sẽ cho ra 20.'),

      q('A host has a link-local address but no global address. Where do you look first?|||Một host có địa chỉ link-local mà không có địa chỉ toàn cục. Bạn nhìn vào đâu trước?',
        ['The host network card|||Card mạng của host', 'The router — no Router Advertisement is reaching the link|||Router — không có gói Router Advertisement nào tới được link', 'The DNS server|||Máy chủ DNS', 'The switch MAC table|||Bảng MAC của switch'],
        1,
        'A link-local address is built by the host itself and always succeeds, so its presence proves IPv6 is enabled and layer 2 works. A global address, by contrast, always requires a prefix from a Router Advertisement, whether the host then uses SLAAC or DHCPv6. No RA means no GUA regardless of host configuration, and the most common cause is a router missing ipv6 unicast-routing, which suppresses RAs entirely.|||Địa chỉ link-local do chính host dựng ra và luôn thành công, nên sự có mặt của nó chứng minh IPv6 đang bật và tầng 2 chạy được. Ngược lại, địa chỉ toàn cục luôn cần một tiền tố từ gói Router Advertisement, dù sau đó host dùng SLAAC hay DHCPv6. Không có RA thì không có GUA bất kể host cấu hình thế nào, và nguyên nhân hay gặp nhất là router thiếu ipv6 unicast-routing, vốn làm tắt hẳn việc gửi RA.'),

      q('What does Duplicate Address Detection do that IPv4 has no equivalent requirement for?|||Duplicate Address Detection làm gì mà IPv4 không có yêu cầu tương đương?',
        ['It encrypts the address|||Nó mã hoá địa chỉ', 'Before using ANY address, the host checks nobody else has it|||Trước khi dùng BẤT KỲ địa chỉ nào, host kiểm xem có ai khác đang giữ nó không', 'It compresses the address|||Nó rút gọn địa chỉ', 'It asks DHCPv6 for permission|||Nó xin phép máy chủ DHCPv6'],
        1,
        'The host sends a Neighbor Solicitation to its own proposed address. An answer means the address is taken and the host refuses to use it; silence means it is free. This runs on every address including the link-local one. In IPv4 two hosts can share an address and both keep running badly with intermittent failures that are famously hard to diagnose; in IPv6 the second one simply will not come up. A noisier failure, and an honest one.|||Host gửi một gói Neighbor Solicitation tới chính cái địa chỉ nó định dùng. Có câu trả lời nghĩa là địa chỉ đã bị chiếm và host từ chối dùng nó; im lặng nghĩa là còn trống. Phép này chạy cho mọi địa chỉ, kể cả địa chỉ link-local. Trong IPv4 thì hai host có thể chung một địa chỉ và cả hai vẫn chạy, chạy tệ, với những lỗi chập chờn nổi tiếng khó chẩn đoán; trong IPv6 thì cái thứ hai đơn giản là không lên. Một cái hỏng ồn ào hơn, và trung thực hơn.'),

      q('What is the solicited-node multicast group for 2001:db8:acad:1::100?|||Nhóm multicast solicited-node của 2001:db8:acad:1::100 là gì?',
        ['ff02::1', 'ff02::1:ff00:100', 'ff02::100', 'ff02::1:0:100'],
        1,
        'Take the last 24 bits of the target and append them to the ff02::1:ff prefix, giving ff02::1:ff00:100. The corresponding Ethernet MAC is 33:33 followed by the last 32 bits, so 33:33:ff:00:01:00, and the network card filters on that in hardware. The last option is what you get if you drop the ff byte from the prefix — a plausible-looking and completely wrong answer, which is exactly the mistake made while building this chapter and caught only by testing against RFC 4291.|||Lấy 24 bit cuối của địa chỉ đích rồi nối vào sau tiền tố ff02::1:ff, được ff02::1:ff00:100. Địa chỉ MAC Ethernet tương ứng là 33:33 rồi tới 32 bit cuối, tức 33:33:ff:00:01:00, và card mạng lọc theo cái đó ngay ở phần cứng. Phương án cuối là thứ bạn nhận được nếu bỏ mất byte ff khỏi tiền tố — một đáp án trông hợp lý mà sai hoàn toàn, đúng là cái sai đã mắc lúc dựng chương này và chỉ bị bắt nhờ thử với RFC 4291.'),

      q('Why is there no VLSM in IPv6?|||Vì sao IPv6 không có VLSM?',
        ['It was removed to simplify the standard|||Nó bị bỏ đi để đơn giản hoá tiêu chuẩn', 'A /64 is always big enough, so there is nothing to trade between subnets and hosts|||Một /64 lúc nào cũng đủ lớn, nên không có gì để đánh đổi giữa số subnet và số host', 'Routers cannot process variable prefixes|||Router không xử lý được tiền tố có độ dài thay đổi', 'DHCPv6 handles it instead|||DHCPv6 lo việc đó thay'],
        1,
        'VLSM existed in IPv4 because subnets and hosts competed for the same scarce 32 bits, so giving one network more meant giving another less. In IPv6 the interface ID is fixed at 64 bits and a single /64 holds 18,446,744,073,709,551,616 addresses — more than any LAN will ever need. You subnet only the 16-bit subnet ID, every subnet is the same size, and there is nothing to optimise. Subnetting stops being arithmetic and becomes organisation.|||VLSM tồn tại trong IPv4 vì subnet và host tranh nhau cùng 32 bit ít ỏi, nên cho mạng này nhiều hơn là cho mạng kia ít đi. Trong IPv6 thì interface ID cố định 64 bit và một /64 duy nhất chứa 18.446.744.073.709.551.616 địa chỉ — nhiều hơn mọi mạng LAN sẽ từng cần. Bạn chỉ chia 16 bit subnet ID, mọi subnet đều cùng cỡ, và không có gì để tối ưu. Chia subnet thôi là số học và trở thành việc sắp xếp.'),

      q('curl 127.0.0.1:3000 works but curl localhost:3000 is refused. What is the cause?|||curl 127.0.0.1:3000 thì được mà curl localhost:3000 bị từ chối. Nguyên nhân là gì?',
        ['DNS is broken|||DNS hỏng', 'The service is bound to IPv4 only, and localhost resolves to ::1 first|||Dịch vụ chỉ gắn vào IPv4, mà localhost phân giải ra ::1 trước', 'The firewall blocks port 3000|||Tường lửa chặn cổng 3000', 'The service has crashed|||Dịch vụ đã sập'],
        1,
        'localhost resolves to both ::1 and 127.0.0.1. A service bound to 127.0.0.1 listens on IPv4 only, so when the client tries ::1 first nothing is listening and the connection is refused immediately rather than timing out. Prove it by comparing curl -4 with curl -6. Fix it by binding to :: which accepts both families, or by using the literal 127.0.0.1 in the connection string. Since Node 17 the resolver no longer reorders results, which is why this started biting projects that had changed nothing.|||localhost phân giải ra cả ::1 lẫn 127.0.0.1. Một dịch vụ gắn vào 127.0.0.1 thì chỉ nghe trên IPv4, nên khi máy khách thử ::1 trước thì không có ai nghe và kết nối bị từ chối ngay lập tức chứ không phải hết giờ. Chứng minh bằng cách so curl -4 với curl -6. Sửa bằng cách gắn vào :: vốn nhận cả hai họ địa chỉ, hoặc dùng thẳng 127.0.0.1 trong chuỗi kết nối. Từ Node 17 thì bộ phân giải không sắp xếp lại kết quả nữa, và đó là lý do chuyện này bắt đầu cắn những dự án chẳng thay đổi gì cả.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 11 — IPv6 Addressing (FLM sessions 35-36)|||Chương 11 — Địa chỉ IPv6 (buổi 35-36 của FLM)',
    slug: 'nwc204-chuong-11-dia-chi-ipv6',
    description: 'Cisco Module 12 theo đúng buổi 35-36 của FLM: vì sao IPv4 cạn và cái giá thật của NAT với CGNAT, 128 bit viết thành tám hextet thập lục phân, hai quy tắc rút gọn và vì sao chỉ được một dấu :: duy nhất, /64 là ranh giới cứng chứ không phải lựa chọn, ba loại địa chỉ unicast/multicast/anycast và vì sao IPv6 bỏ hẳn broadcast, GUA 2000::/3 và LLA fe80::/10 luôn có sẵn và ULA fc00::/7; rồi cấu hình tĩnh trên IOS với lệnh ipv6 unicast-routing hay bị quên, EUI-64 kiểm ngược từ MAC thật của router thượng nguồn, SLAAC so với DHCPv6 qua hai cờ M và O, Duplicate Address Detection bắt buộc, solicited-node multicast thay thế ARP, và chia subnet một /48 mà không có VLSM cũng không có phép trừ hai. Kèm phần ★ bổ sung: 13 địa chỉ fe80:: có sẵn trên một máy chủ thật mà không ai cấu hình, nginx đã listen [::] sẵn, bẫy ::1 so với 127.0.0.1, và vì sao %eth0 là bắt buộc. Mọi địa chỉ đã kiểm bằng python3. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
