/**
 * NWC204 · Chapter 8 — Address Resolution (Cisco Module 9).
 * FLM buổi 24 (8.1 MAC and IP) + buổi 25 (8.2 ARP · 8.3 Neighbor Discovery · 8.4 AI).
 *
 * Slide: scripts/slides-src/nwc204-ch08.mjs → deck 'nwc204-ch08', 22 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 9: năm trạng thái của bảng láng
 *     giềng trên Linux, ARP tự khai (gratuitous), phát hiện giả mạo ARP,
 *     proxy ARP, và đọc `ip -6 neigh` trên máy chủ thật.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 24 mang CQ8.2 "How does the network devices use routing tables to
 *     direct packets to a destination networks?" — nội dung thuộc chương 7
 *     (bảng định tuyến), đã trả lời ở bài 7.2.
 *   - Buổi 25 mang CQ9.1 "How can ARP enable communication on a network?" —
 *     lần đầu sau nhiều buổi, nội dung khớp đúng chương.
 *
 * ⚠️ File này CHỈ chứa chương 8. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch08', {
  code: 'NWC204',
  en: 'Address Resolution',
  vi: 'Phân giải địa chỉ',
  total: 22,
});

/* ──────────────────────── Lesson 8.1 — session 24 ──────────────────────── */

const L1 = {
  title: '8.1 — MAC and IP: why every packet carries two addresses (FLM session 24)|||8.1 — MAC và IP: vì sao mỗi gói tin mang hai địa chỉ (buổi 24 của FLM)',
  slug: 'nwc204-8-1-mac-va-ip-hai-dia-chi',
  type: 'DOCUMENT',
  description: 'Buổi 24: vì sao một địa chỉ là không đủ, cặp MAC bị viết lại ở từng chặng trong khi cặp IP đi nguyên vẹn suốt hành trình, đích cục bộ thì hỏi MAC của chính nó còn đích ở xa thì hỏi MAC của cổng ra, và cách tự quan sát toàn bộ điều đó bằng tcpdump trên máy thật.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 8 · Lesson 8.1 · FLM session 24 of 60 · CLO4, CLO9 · Cisco Module 9</span>
<h2>The one packet with two destinations</h2>
<p class="lead">Chapter 7 ended on a sentence worth repeating: when you send a packet to a server abroad, the frame leaving your machine carries <strong>the router's MAC address and the server's IP address</strong>. Two destinations, pointing at two different machines, in one packet. This chapter is about how your machine learns the first one.</p>
<p><strong>Opening question:</strong> you run <code>ping 8.8.8.8</code> and capture the frame that leaves your laptop. The destination MAC belongs to your router, not to Google. Now you ping a machine on your own desk and capture again — this time the destination MAC belongs to that machine itself. Your laptop made a decision between those two cases. What exactly did it compare, and what would it have done if it had got that comparison wrong?</p>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 9. The school's syllabus is covered in full first.</p>`,
      `<span class="eyebrow">NWC204 · Chương 8 · Bài 8.1 · Buổi 24/60 của FLM · CLO4, CLO9 · Cisco Module 9</span>
<h2>Một gói tin có tới hai cái đích</h2>
<p class="lead">Chương 7 kết lại bằng một câu đáng nhắc lại: khi bạn gửi một gói tin tới máy chủ ở nước ngoài, cái khung rời khỏi máy bạn mang <strong>địa chỉ MAC của router và địa chỉ IP của máy chủ</strong>. Hai cái đích, trỏ vào hai cỗ máy khác nhau, trong cùng một gói. Chương này nói về việc máy bạn học được cái thứ nhất bằng cách nào.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn chạy <code>ping 8.8.8.8</code> và bắt cái khung rời khỏi laptop. MAC đích là của con router nhà bạn, không phải của Google. Giờ ping một máy ngay trên bàn rồi bắt lại — lần này MAC đích là của chính cái máy đó. Laptop của bạn đã ra một quyết định giữa hai trường hợp ấy. Nó đã so sánh chính xác cái gì, và nếu nó so sai thì chuyện gì đã xảy ra?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 9. Giáo trình của trường được phủ đủ trước.</p>`,
    ),

    walkHead('nwc204-ch08', 1, 4,
      'Slides 1–4 cover FLM session 24: 8.1 MAC and IP.',
      'Slide 1–4 là buổi 24 của FLM: 8.1 MAC and IP.'),

    walk('nwc204-ch08', [
      [1, 'Cover — Chapter 8, Address Resolution',
        `<p>Chapter 8 is <strong>Cisco Module 9</strong>, and FPT gives it two sessions — the shortest chapter so far, and one of the most useful in daily troubleshooting.</p>
<ul>
<li>Session 24 — 8.1 MAC and IP.</li>
<li>Session 25 — 8.2 ARP, 8.3 Neighbor Discovery, 8.4 AI tools (self-learning).</li>
<li>Outcomes: <strong>CLO4</strong> (how the layers interact), <strong>CLO9</strong> (AI tools).</li>
</ul>
<p>It is short because the idea is small: a machine needs its neighbour's hardware address, and there is a protocol for asking. It is important because that protocol has <em>no security at all</em>, and because its cache is the single most informative table on a broken LAN.</p>`,
        `<p>Chương 8 là <strong>Module 9 của Cisco</strong>, và trường xếp hai buổi — chương ngắn nhất tính tới giờ, và là một trong những chương hữu ích nhất khi gỡ lỗi hằng ngày.</p>
<ul>
<li>Buổi 24 — 8.1 MAC and IP.</li>
<li>Buổi 25 — 8.2 ARP, 8.3 Neighbor Discovery, 8.4 công cụ AI (tự học).</li>
<li>Chuẩn đầu ra: <strong>CLO4</strong> (các tầng phối hợp ra sao), <strong>CLO9</strong> (công cụ AI).</li>
</ul>
<p>Nó ngắn vì cái ý thì nhỏ: một cỗ máy cần địa chỉ phần cứng của hàng xóm, và có một giao thức để đi hỏi. Nó quan trọng vì cái giao thức đó <em>hoàn toàn không có bảo mật</em>, và vì bộ nhớ đệm của nó là cái bảng nhiều thông tin nhất trên một mạng LAN đang hỏng.</p>`],

      [2, 'Two addresses, and only one of them travels',
        `<p>Follow one packet from PC-A to a server three links away and count the addresses.</p>
<ul>
<li><strong>Three different MAC pairs.</strong> On link 1 the frame is addressed PC-A → R1. R1 throws that frame away entirely and builds a new one, R1 → R2. R2 does it again, R2 → server. A MAC address is valid for exactly one link and then it is finished.</li>
<li><strong>One IP pair, identical all three times.</strong> Source 10.0.0.42, destination 203.0.113.9, unchanged from the first link to the last. This is what makes the address <em>global</em>: it means the same thing everywhere along the path.</li>
</ul>
<p>The consequence is the point of the whole chapter: <strong>each device only ever needs to know the MAC address of the next device</strong>, never of the final one. PC-A has no idea what the server's MAC address is and never will. It could not use it if it had it.</p>
<p>That per-link learning is exactly what ARP does on IPv4 and what Neighbor Discovery does on IPv6.</p>`,
        `<p>Lần theo một gói tin từ PC-A tới máy chủ cách ba đường link rồi đếm số địa chỉ.</p>
<ul>
<li><strong>Ba cặp MAC khác nhau.</strong> Trên link 1 cái khung đề PC-A → R1. R1 vứt sạch cái khung đó đi rồi dựng cái mới, R1 → R2. R2 lại làm thế lần nữa, R2 → máy chủ. Một địa chỉ MAC có giá trị trên đúng một đường link rồi hết đời.</li>
<li><strong>Một cặp IP, giống hệt nhau cả ba lần.</strong> Nguồn 10.0.0.42, đích 203.0.113.9, không đổi từ link đầu tới link cuối. Chính điều đó làm cho địa chỉ IP mang tính <em>toàn cầu</em>: nó có cùng một nghĩa ở mọi chỗ dọc đường.</li>
</ul>
<p>Hệ quả chính là ý chính của cả chương: <strong>mỗi thiết bị chỉ bao giờ cần biết địa chỉ MAC của thiết bị KẾ TIẾP</strong>, không bao giờ cần của thiết bị cuối cùng. PC-A không hề biết MAC của máy chủ là gì và sẽ không bao giờ biết. Mà có biết thì nó cũng không dùng được.</p>
<p>Việc học theo từng chặng đó chính là thứ ARP làm trên IPv4 và Neighbor Discovery làm trên IPv6.</p>`],

      [3, 'Why one address was never enough',
        `<p>Students reasonably ask why we tolerate two addressing systems at all. Both directions of simplification fail, and for different reasons.</p>
<p><strong>Why not MAC only?</strong> A MAC address is <em>flat</em>: 00:1A:2B:3C:4D:5E tells you which vendor made the card and nothing about where the card is. There is no way to summarise a group of them. A router would need one table entry for every device on Earth — billions of entries, with no structure to compress them. IP is <em>hierarchical</em>, so a single entry like 203.0.113.0/24 covers 254 machines, and a single entry like 203.0.0.0/8 covers sixteen million.</p>
<p><strong>Why not IP only?</strong> Because the wire does not understand IP. An Ethernet NIC decides whether to accept a frame by comparing 48 bits of destination MAC against its own, <em>in hardware</em>, before any software runs. That is what lets a machine ignore the thousands of frames per second it is not interested in without burning CPU. Layer 2 has to be addressed in layer-2 terms.</p>
<p>So we keep both, and we need a bridge between them. That bridge is the whole of this chapter, and it reduces to one question: <strong>is the destination on my own network?</strong> If yes, I need the target's MAC. If no, I need my gateway's MAC.</p>`,
        `<p>Sinh viên hỏi rất có lý: sao lại phải chịu đựng tới hai hệ đánh địa chỉ. Rút gọn theo cả hai hướng đều hỏng, và hỏng vì hai lý do khác nhau.</p>
<p><strong>Sao không dùng mỗi MAC?</strong> Địa chỉ MAC là <em>phẳng</em>: 00:1A:2B:3C:4D:5E cho biết hãng nào làm ra cái card và không cho biết gì về chỗ cái card đang nằm. Không có cách nào gộp một nhóm chúng lại. Một con router sẽ cần một dòng bảng cho mỗi thiết bị trên Trái Đất — hàng tỉ dòng, không có cấu trúc nào để nén lại. IP thì <em>phân cấp</em>, nên một dòng duy nhất như 203.0.113.0/24 phủ 254 máy, và một dòng như 203.0.0.0/8 phủ mười sáu triệu máy.</p>
<p><strong>Sao không dùng mỗi IP?</strong> Vì sợi dây không hiểu IP. Card mạng Ethernet quyết định nhận hay không nhận một cái khung bằng cách so 48 bit MAC đích với MAC của chính nó, <em>bằng phần cứng</em>, trước khi có phần mềm nào chạy. Chính điều đó cho phép một cỗ máy phớt lờ hàng nghìn khung mỗi giây mà nó không quan tâm, mà không đốt CPU. Tầng 2 buộc phải được đánh địa chỉ bằng ngôn ngữ của tầng 2.</p>
<p>Nên ta giữ cả hai, và ta cần một cây cầu nối giữa chúng. Cây cầu đó là toàn bộ chương này, và nó rút gọn về đúng một câu hỏi: <strong>đích có nằm trong mạng của tôi không?</strong> Có thì tôi cần MAC của chính nó. Không thì tôi cần MAC của cổng ra.</p>`],

      [4, 'Local or remote decides whose MAC you need',
        `<p>The comparison itself is the AND operation from Chapter 7: destination IP AND my mask, against my own network. Nothing else takes part, and the result selects one of two behaviours.</p>
<p><strong>Local.</strong> ARP asks for the target itself. The destination MAC and destination IP end up pointing at the same machine, which is the intuitive case and the one people assume is always true.</p>
<p><strong>Remote.</strong> ARP asks for the <em>gateway</em>. The destination MAC is the router's; the destination IP is still the far-away server's. Two addresses, two machines, one frame.</p>
<p><strong>And a rule that follows from the mechanism, not from policy:</strong> a host <strong>never</strong> ARPs for an address outside its own subnet. It cannot. An ARP request is a broadcast, broadcasts are stopped by routers, so the question could not reach the answerer even if the host tried. If you ever see an ARP request for an off-subnet address in a capture, you have found a host with a wrong mask — and that is a real diagnosis, not a curiosity.</p>`,
        `<p>Phép so sánh đó chính là phép AND của chương 7: IP đích AND mặt nạ của tôi, đem đối chiếu với mạng của tôi. Không có gì khác tham gia, và kết quả chọn ra một trong hai cách xử sự.</p>
<p><strong>Cục bộ.</strong> ARP hỏi chính máy đích. MAC đích và IP đích rốt cuộc cùng trỏ vào một cỗ máy, và đó là trường hợp trực giác, cũng là trường hợp người ta mặc định là luôn đúng.</p>
<p><strong>Ở xa.</strong> ARP hỏi <em>cổng ra</em>. MAC đích là của router; IP đích vẫn là của máy chủ ở tận đâu. Hai địa chỉ, hai cỗ máy, một cái khung.</p>
<p><strong>Và một luật suy ra từ cơ chế chứ không phải từ quy định:</strong> một máy trạm <strong>không bao giờ</strong> ARP hỏi một địa chỉ nằm ngoài subnet của nó. Nó không thể. Lời hỏi ARP là một gói quảng bá, mà quảng bá bị router chặn lại, nên câu hỏi không tới được người trả lời kể cả khi máy có cố. Nếu bạn thấy trong bản bắt gói một lời hỏi ARP cho địa chỉ ngoài subnet, thì bạn vừa tìm ra một máy đặt sai mặt nạ — và đó là một chẩn đoán thật, không phải chuyện lạ cho vui.</p>`],
    ]),

    bi(
      `<h3>🧪 Watch both cases happen, on your own machine</h3>
<p>This is the single best five-minute exercise in the whole course, because it makes an abstract rule visible.</p>
<pre><code class="language-bash"># Terminal 1 — watch the wire. Keep it running.
sudo tcpdump -n -e -i eth0 icmp or arp

# Terminal 2 — case A: a machine on your own LAN
ping -c 1 10.0.0.99

# Terminal 2 — case B: something far away
ping -c 1 8.8.8.8</code></pre>
<p>In case A you will see the destination MAC of the ICMP frame equal the MAC of 10.0.0.99 itself. In case B you will see a completely different destination MAC — your router's — while the IP header still says 8.8.8.8. The <code>-e</code> flag is what makes tcpdump print the layer-2 header; without it you cannot see any of this.</p>
<p>If the ARP entry is already cached you will not see the ARP exchange. Clear it first:</p>
<pre><code class="language-bash">sudo ip neigh flush dev eth0     # then ping again and watch the who-has appear</code></pre>
<h4>What the output means</h4>
<ul>
<li><code>ARP, Request who-has 10.0.0.1 tell 10.0.0.42</code> going to <code>ff:ff:ff:ff:ff:ff</code> — the broadcast question.</li>
<li><code>ARP, Reply 10.0.0.1 is-at aa:bb:cc:dd:ee:ff</code> going to your MAC only — the unicast answer.</li>
<li>Then the ICMP frames, whose destination MAC is whichever one the rule selected.</li>
</ul>`,
      `<h3>🧪 Xem cả hai trường hợp xảy ra, trên chính máy bạn</h3>
<p>Đây là bài thực hành năm phút hay nhất trong cả môn, vì nó làm cho một quy tắc trừu tượng hiện ra thành thứ nhìn thấy được.</p>
<pre><code class="language-bash"># Cửa sổ 1 — soi sợi dây. Cứ để nó chạy.
sudo tcpdump -n -e -i eth0 icmp or arp

# Cửa sổ 2 — trường hợp A: một máy trong LAN của bạn
ping -c 1 10.0.0.99

# Cửa sổ 2 — trường hợp B: một thứ ở tận đâu
ping -c 1 8.8.8.8</code></pre>
<p>Ở trường hợp A bạn sẽ thấy MAC đích của khung ICMP đúng bằng MAC của chính 10.0.0.99. Ở trường hợp B bạn sẽ thấy một MAC đích hoàn toàn khác — của con router nhà bạn — trong khi phần đầu IP vẫn ghi 8.8.8.8. Chính cờ <code>-e</code> làm tcpdump in ra phần đầu tầng 2; không có nó thì bạn không nhìn thấy gì trong số này cả.</p>
<p>Nếu dòng ARP đã nằm sẵn trong bộ đệm thì bạn sẽ không thấy cuộc trao đổi ARP. Hãy xoá nó trước:</p>
<pre><code class="language-bash">sudo ip neigh flush dev eth0     # rồi ping lại và xem câu who-has hiện ra</code></pre>
<h4>Kết xuất đó nghĩa là gì</h4>
<ul>
<li><code>ARP, Request who-has 10.0.0.1 tell 10.0.0.42</code> gửi tới <code>ff:ff:ff:ff:ff:ff</code> — câu hỏi quảng bá.</li>
<li><code>ARP, Reply 10.0.0.1 is-at aa:bb:cc:dd:ee:ff</code> gửi riêng cho MAC của bạn — câu trả lời unicast.</li>
<li>Rồi tới các khung ICMP, mà MAC đích của chúng là cái nào thì do quy tắc kia chọn ra.</li>
</ul>`,
    ),

    bi(
      `<h3>🗺️ The decision, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["I want to send to<br/>destination D"] --> B{"D AND my mask<br/>= my network?"}
  B -->|"yes — LOCAL"| C["I need D's own MAC"]
  B -->|"no — REMOTE"| E["I need my GATEWAY's MAC"]
  C --> D["Is it in my ARP cache?"]
  E --> D
  D --> F["cached → send now<br/>not cached → ARP first"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D ask
  class A,C,E act
  class F ok</code></pre>
<p>Both branches converge on the same cache lookup. That is why one broken ARP entry can break a single destination, and one broken gateway entry breaks everything at once.</p>`,
      `<h3>🗺️ Cái quyết định đó, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Tôi muốn gửi tới<br/>đích D"] --> B{"D AND mặt nạ của tôi<br/>= mạng của tôi?"}
  B -->|"đúng — CỤC BỘ"| C["Tôi cần MAC của chính D"]
  B -->|"không — Ở XA"| E["Tôi cần MAC của CỔNG RA"]
  C --> D["Nó có trong bộ đệm ARP chưa?"]
  E --> D
  D --> F["có rồi → gửi luôn<br/>chưa có → ARP trước đã"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D ask
  class A,C,E act
  class F ok</code></pre>
<p>Cả hai nhánh đều đổ về cùng một lần tra bộ đệm. Đó là lý do một dòng ARP hỏng làm hỏng đúng một cái đích, còn một dòng ARP của cổng ra bị hỏng thì làm hỏng tất cả cùng lúc.</p>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>Expecting the destination MAC to belong to the destination.</strong> It only does when the destination is local. <em>Symptom:</em> reading a capture and concluding "the packet is going to the wrong machine", when it is going exactly where it should.</li>
<li><strong>Trying to ARP for a remote address.</strong> Impossible — the request is a broadcast and cannot cross a router. Seeing one in a capture means a host has the wrong mask. <em>Symptom:</em> a host that reaches nothing off-subnet, with ARP requests for off-subnet addresses in the capture.</li>
<li><strong>Running <code>tcpdump</code> without <code>-e</code> and then arguing about MAC addresses.</strong> Without <code>-e</code> the layer-2 header is not printed at all. <em>Symptom:</em> an hour spent discussing addresses that were never on the screen.</li>
<li><strong>Thinking the ARP cache proves reachability.</strong> A cached entry can be minutes old and the machine gone. <em>Symptom:</em> "the ARP table looks fine" while the device is switched off.</li>
<li><strong>Assuming a device with no ARP entry is broken.</strong> A machine you have never talked to has no entry, and that is correct. Entries appear on use, not on existence.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Mong MAC đích là của máy đích.</strong> Chỉ đúng khi đích là cục bộ. <em>Triệu chứng:</em> đọc bản bắt gói rồi kết luận "gói tin đi sai máy", trong khi nó đang đi đúng chỗ phải đi.</li>
<li><strong>Cố ARP hỏi một địa chỉ ở xa.</strong> Bất khả — lời hỏi là gói quảng bá và không qua được router. Thấy một cái như vậy trong bản bắt gói nghĩa là có máy đặt sai mặt nạ. <em>Triệu chứng:</em> một máy không tới được gì ngoài subnet, và trong bản bắt gói có lời hỏi ARP cho địa chỉ ngoài subnet.</li>
<li><strong>Chạy <code>tcpdump</code> mà quên <code>-e</code> rồi ngồi tranh luận về địa chỉ MAC.</strong> Không có <code>-e</code> thì phần đầu tầng 2 hoàn toàn không được in ra. <em>Triệu chứng:</em> mất một tiếng bàn về những địa chỉ chưa từng hiện lên màn hình.</li>
<li><strong>Tưởng bộ đệm ARP chứng minh là tới được.</strong> Một dòng trong bộ đệm có thể đã vài phút tuổi và cái máy thì đã đi mất. <em>Triệu chứng:</em> "bảng ARP nhìn ổn mà" trong khi thiết bị đang tắt.</li>
<li><strong>Tưởng thiết bị không có dòng ARP là bị hỏng.</strong> Một cỗ máy bạn chưa từng nói chuyện thì không có dòng nào, và như thế mới đúng. Các dòng xuất hiện khi có người dùng tới, không phải khi thiết bị tồn tại.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p><strong>1.</strong> PC-A (10.0.0.42/24) sends to a server at 203.0.113.9 through R1 (10.0.0.1) and R2. How many different destination MAC addresses appear across the whole path, and how many different destination IP addresses?</p>
<p><strong>2.</strong> A host is 192.168.1.50 with mask 255.255.0.0, on a LAN where everyone else uses 255.255.255.0. It tries to reach 192.168.2.10. What does it do, and what will you see in a capture?</p>
<p><strong>3.</strong> Why can a router not simply learn every MAC address on the Internet and skip IP entirely?</p>
<p><strong>4.</strong> You capture a frame leaving your laptop. Destination MAC <code>aa:bb:cc:dd:ee:ff</code>, destination IP <code>1.1.1.1</code>. Whose MAC is that, and how do you confirm it in one command?</p>
<hr>
<h4>Answers</h4>
<p><strong>1. Three destination MACs, one destination IP.</strong> Link 1 is addressed to R1, link 2 to R2, link 3 to the server — the frame is rebuilt from scratch each time. The destination IP is 203.0.113.9 on all three links, because that is what "global address" means. This single contrast is the most examinable idea in the chapter.</p>
<p><strong>2. It will wrongly decide the destination is local, and ARP for 192.168.2.10 itself.</strong> With a /16 mask, 192.168.1.50 AND 255.255.0.0 gives 192.168.0.0, and 192.168.2.10 AND 255.255.0.0 also gives 192.168.0.0 — so the host concludes they are on the same network. In the capture you will see <code>who-has 192.168.2.10</code> broadcast onto a LAN where that machine does not exist, followed by silence and then a <code>FAILED</code> neighbour entry. The host never asks the router, because it does not believe it needs one. The other direction may still work, which is why mask faults are so often one-way.</p>
<p><strong>3.</strong> Because MAC addresses are flat and unsummarisable. There is no relationship between 00:1A:2B:3C:4D:5E and 00:1A:2B:3C:4D:5F other than the vendor prefix — they could be on opposite sides of the planet. A routing table works because IP is hierarchical: one line, 203.0.113.0/24, replaces 254 individual entries, and 203.0.0.0/8 replaces sixteen million. Without hierarchy, every router would need a table the size of the entire device population, and it would have to be updated every time any device anywhere moved.</p>
<p><strong>4. It is your default gateway's MAC</strong>, because 1.1.1.1 is certainly not on your subnet. Confirm with <code>ip neigh show</code> and look for the line whose <code>lladdr</code> matches — it will be your gateway's IP. Or go the other way: <code>ip route get 1.1.1.1</code> tells you the gateway address, then <code>ip neigh show 10.0.0.1</code> gives its MAC.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> PC-A (10.0.0.42/24) gửi tới máy chủ 203.0.113.9 qua R1 (10.0.0.1) rồi R2. Suốt cả đường đi có bao nhiêu địa chỉ MAC đích khác nhau, và bao nhiêu địa chỉ IP đích khác nhau?</p>
<p><strong>2.</strong> Một máy là 192.168.1.50 với mặt nạ 255.255.0.0, nằm trong mạng mà mọi người khác dùng 255.255.255.0. Nó cố tới 192.168.2.10. Nó làm gì, và bạn sẽ thấy gì trong bản bắt gói?</p>
<p><strong>3.</strong> Vì sao router không thể cứ học hết mọi địa chỉ MAC trên Internet rồi bỏ quách IP đi?</p>
<p><strong>4.</strong> Bạn bắt được một khung rời khỏi laptop. MAC đích <code>aa:bb:cc:dd:ee:ff</code>, IP đích <code>1.1.1.1</code>. Đó là MAC của ai, và xác nhận bằng một lệnh duy nhất thế nào?</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. Ba MAC đích, một IP đích.</strong> Link 1 đề địa chỉ R1, link 2 đề R2, link 3 đề máy chủ — cái khung được dựng lại từ đầu mỗi lần. IP đích là 203.0.113.9 trên cả ba link, vì đó chính là ý nghĩa của chữ "địa chỉ toàn cầu". Đúng một phép đối chiếu này là ý dễ ra đề nhất trong cả chương.</p>
<p><strong>2. Nó sẽ quyết định nhầm rằng đích là cục bộ, rồi ARP hỏi chính 192.168.2.10.</strong> Với mặt nạ /16, 192.168.1.50 AND 255.255.0.0 ra 192.168.0.0, mà 192.168.2.10 AND 255.255.0.0 cũng ra 192.168.0.0 — nên máy kết luận hai bên cùng một mạng. Trong bản bắt gói bạn sẽ thấy <code>who-has 192.168.2.10</code> quảng bá ra một mạng LAN không hề có cái máy đó, rồi im lặng, rồi một dòng láng giềng <code>FAILED</code>. Cái máy này không bao giờ hỏi tới router, vì nó không tin là nó cần router. Chiều ngược lại thì vẫn có thể chạy, và đó là lý do lỗi mặt nạ rất hay hỏng một chiều.</p>
<p><strong>3.</strong> Vì địa chỉ MAC phẳng và không gộp lại được. Không có quan hệ nào giữa 00:1A:2B:3C:4D:5E với 00:1A:2B:3C:4D:5F ngoài cái tiền tố hãng — hai cái đó có thể nằm ở hai đầu địa cầu. Bảng định tuyến chạy được là vì IP phân cấp: một dòng 203.0.113.0/24 thay cho 254 dòng riêng lẻ, và 203.0.0.0/8 thay cho mười sáu triệu dòng. Không có phân cấp thì mọi router đều cần một cái bảng to bằng tổng số thiết bị, và phải cập nhật lại mỗi lần bất cứ thiết bị nào ở bất cứ đâu dời chỗ.</p>
<p><strong>4. Đó là MAC của cổng ra mặc định của bạn</strong>, vì 1.1.1.1 chắc chắn không nằm trong subnet của bạn. Xác nhận bằng <code>ip neigh show</code> rồi tìm dòng có <code>lladdr</code> khớp — nó sẽ là IP của cổng ra. Hoặc đi đường ngược lại: <code>ip route get 1.1.1.1</code> cho bạn địa chỉ cổng ra, rồi <code>ip neigh show 10.0.0.1</code> cho bạn MAC của nó.</p>`,
    ),

    bi(
      `<h3>📋 A note on the school's question for this session</h3>
<p>FLM assigns session 24 the question <strong>CQ8.2 — "How does the network devices use routing tables to direct packets to a destination networks?"</strong>. Routing tables are Chapter 7, section 7.5, and the question was answered in full in <strong>Lesson 7.2</strong>: find every matching route, keep the longest prefix, use administrative distance only to break ties of equal prefix length, then build a new layer-2 frame for the chosen next hop.</p>
<p>The drift noted in Chapter 7 continues: the question numbers run about one chapter behind the session plan. We quote the table as published and point to where each question was answered.</p>`,
      `<h3>📋 Ghi chú về câu hỏi của trường cho buổi này</h3>
<p>FLM gán cho buổi 24 câu hỏi <strong>CQ8.2 — "How does the network devices use routing tables to direct packets to a destination networks?"</strong>. Bảng định tuyến là chương 7, mục 7.5, và câu này đã được trả lời đầy đủ ở <strong>bài 7.2</strong>: tìm mọi tuyến khớp, giữ tiền tố dài nhất, chỉ dùng khoảng cách quản trị để phân định khi hai tuyến có cùng độ dài tiền tố, rồi dựng một khung tầng 2 mới cho chặng kế tiếp vừa chọn.</p>
<p>Sự trôi dạt đã nêu ở chương 7 vẫn tiếp diễn: số hiệu câu hỏi chạy chậm hơn kế hoạch buổi học khoảng một chương. Chúng tôi trích bảng đúng như đã công bố và chỉ ra chỗ từng câu đã được trả lời.</p>`,
    ),

    cq(24, [
      ['CQ8.2', 'How does the network devices use routing tables to direct packets to a destination networks? <em>— content belongs to Chapter 7; answered in full in Lesson 7.2 (longest prefix match first, then administrative distance for ties).</em>',
        'How does the network devices use routing tables to direct packets to a destination networks? <em>— nội dung thuộc chương 7; đã trả lời đầy đủ ở bài 7.2 (khớp tiền tố dài nhất trước, rồi mới tới khoảng cách quản trị khi hoà).</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────── Lesson 8.2 — session 25 ──────────────────────── */

const L2 = {
  title: '8.2 — ARP, Neighbor Discovery, and reading a broken LAN (FLM session 25)|||8.2 — ARP, Neighbor Discovery, và đọc một mạng LAN đang hỏng (buổi 25 của FLM)',
  slug: 'nwc204-8-2-arp-va-neighbor-discovery',
  type: 'DOCUMENT',
  description: 'Buổi 25: cuộc trao đổi ARP hỏi quảng bá đáp unicast, từng trường của thông điệp ARP, bảng ARP trên Linux và IOS, đồng hồ lão hoá, ARP tự khai, giả mạo ARP và cách phát hiện, proxy ARP, rồi Neighbor Discovery của IPv6 với NS/NA, địa chỉ multicast solicited-node, RS/RA và SLAAC, phát hiện trùng địa chỉ, và cách chẩn đoán một mạng LAN chỉ bằng bảng láng giềng.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 8 · Lesson 8.2 · FLM session 25 of 60 · CLO4, CLO9 · Cisco Module 9</span>
<h2>Asking the LAN a question, and what happens when anyone can answer</h2>
<p class="lead">Lesson 8.1 established <em>whose</em> MAC address a host needs. This lesson is the protocol that gets it — and the fact that the protocol believes absolutely anybody.</p>
<p><strong>Opening question:</strong> <code>ip neigh</code> on your server shows two entries with the <em>same</em> MAC address: your default gateway 10.0.0.1, and a colleague's laptop 10.0.0.87. A router and a laptop cannot share one network card. What are the three possible explanations, which one is an attack, and which single piece of extra information tells them apart?</p>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 9.</p>`,
      `<span class="eyebrow">NWC204 · Chương 8 · Bài 8.2 · Buổi 25/60 của FLM · CLO4, CLO9 · Cisco Module 9</span>
<h2>Hỏi cả mạng LAN một câu, và chuyện gì xảy ra khi ai cũng trả lời được</h2>
<p class="lead">Bài 8.1 xác định máy trạm cần MAC <em>của ai</em>. Bài này là giao thức đi lấy cái đó — và là chuyện cái giao thức ấy tin tuyệt đối bất cứ ai.</p>
<p><strong>Câu hỏi mở đầu:</strong> <code>ip neigh</code> trên máy chủ của bạn hiện hai dòng có <em>cùng</em> một địa chỉ MAC: cổng ra mặc định 10.0.0.1, và cái laptop 10.0.0.87 của đồng nghiệp. Một con router và một cái laptop không thể dùng chung một card mạng. Có ba cách giải thích khả dĩ, cái nào là tấn công, và đúng một mẩu thông tin nào phân biệt được chúng?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 9.</p>`,
    ),

    walkHead('nwc204-ch08', 5, 22,
      'Slides 5–22 cover FLM session 25: 8.2 ARP, 8.3 Neighbor Discovery and 8.4 AI tools.',
      'Slide 5–22 là buổi 25 của FLM: 8.2 ARP, 8.3 Neighbor Discovery và 8.4 công cụ AI.'),

    walk('nwc204-ch08', [
      [5, 'ARP — one broadcast question, one unicast answer',
        `<p>The whole protocol is two messages.</p>
<p><strong>Step 1, the request, is a broadcast.</strong> It has to be: the asker does not know the target's MAC address, which is precisely the thing being asked, so it cannot address the question to anybody in particular. Destination MAC is <code>FF:FF:FF:FF:FF:FF</code>, the switch floods it out every port, and <em>every</em> NIC on the LAN has to accept it and pass it up to software. On a network with 500 machines, 499 of them are interrupted to no purpose.</p>
<p><strong>Step 2, the reply, is a unicast.</strong> Only the machine that owns the address answers, and by then it knows exactly who asked — the request carried the sender's MAC and IP. So the reply goes straight back, bothering nobody else.</p>
<p><strong>Both caches are updated by that one exchange.</strong> The asker learns the answerer, and the answerer learns the asker, because the request itself carried the sender's pair. This is worth noticing: ARP is efficient in a way that is easy to miss — one round trip populates two tables.</p>
<p>Everything after that is cached, which is why you can capture a busy machine for a minute and see no ARP at all.</p>`,
        `<p>Cả cái giao thức chỉ có hai thông điệp.</p>
<p><strong>Bước 1, lời hỏi, là một gói quảng bá.</strong> Buộc phải thế: bên hỏi không biết MAC của máy đích, mà đó chính là thứ đang được hỏi, nên nó không thể đề địa chỉ câu hỏi cho riêng ai. MAC đích là <code>FF:FF:FF:FF:FF:FF</code>, switch tràn nó ra mọi cổng, và <em>mọi</em> card mạng trên LAN đều phải nhận nó rồi đẩy lên phần mềm. Trên một mạng 500 máy thì 499 máy bị làm phiền vô ích.</p>
<p><strong>Bước 2, lời đáp, là unicast.</strong> Chỉ cỗ máy sở hữu địa chỉ đó trả lời, và lúc đó nó biết chính xác ai vừa hỏi — vì lời hỏi mang theo MAC và IP của bên gửi. Nên lời đáp đi thẳng về, không làm phiền ai khác.</p>
<p><strong>Cả hai bộ đệm đều được cập nhật chỉ bằng một lượt trao đổi đó.</strong> Bên hỏi học được bên đáp, và bên đáp học được bên hỏi, vì chính lời hỏi đã mang theo cặp địa chỉ của bên gửi. Điều này đáng để ý: ARP hiệu quả theo một cách dễ bị bỏ sót — một vòng hỏi đáp làm đầy hai cái bảng.</p>
<p>Mọi thứ sau đó đều dùng bộ đệm, và đó là lý do bạn có thể bắt gói một cỗ máy đang bận suốt một phút mà không thấy một gói ARP nào.</p>`],

      [6, 'Inside an ARP message',
        `<p>Nine fields, and three of them tell you something you can use.</p>
<ul>
<li><strong>Hardware Type</strong> 1 = Ethernet; <strong>Protocol Type</strong> 0x0800 = IPv4; <strong>HLEN</strong> 6 and <strong>PLEN</strong> 4 are the lengths of those two address types. ARP was designed to be generic, which is why it describes its own address sizes.</li>
<li><strong>Opcode</strong> — 1 is a request, 2 is a reply. That is the <em>only</em> structural difference between them; the format is identical.</li>
<li><strong>Sender MAC and Sender IP</strong> — always filled in. This is what lets the answerer learn the asker for free.</li>
<li><strong>Target MAC</strong> — <strong>all zeros in a request</strong>. That field is literally the blank being filled in. Recognising this in a capture is a standard exam question.</li>
<li><strong>Target IP</strong> — the address being asked about.</li>
</ul>
<p><strong>The structural fact that matters most:</strong> ARP is not carried inside IP. It has its own EtherType, 0x0806, and rides directly on Ethernet. It therefore has <em>no TTL, no IP header and no way to cross a router</em> — the protocol is physically confined to one broadcast domain. That is not a policy decision; there is nowhere in the message to put a hop count.</p>`,
        `<p>Chín trường, và ba trong số đó nói cho bạn điều dùng được.</p>
<ul>
<li><strong>Hardware Type</strong> 1 = Ethernet; <strong>Protocol Type</strong> 0x0800 = IPv4; <strong>HLEN</strong> 6 và <strong>PLEN</strong> 4 là độ dài của hai loại địa chỉ đó. ARP được thiết kế để dùng chung cho nhiều loại, nên nó tự mô tả kích thước địa chỉ của chính nó.</li>
<li><strong>Opcode</strong> — 1 là lời hỏi, 2 là lời đáp. Đó là khác biệt cấu trúc <em>duy nhất</em> giữa hai loại; định dạng thì giống hệt.</li>
<li><strong>Sender MAC và Sender IP</strong> — luôn được điền. Chính nhờ đó mà bên đáp học được bên hỏi mà không tốn gì.</li>
<li><strong>Target MAC</strong> — <strong>toàn số 0 trong một lời hỏi</strong>. Cái trường đó đúng nghĩa là chỗ trống đang cần điền. Nhận ra điều này trong bản bắt gói là một câu hỏi thi tiêu chuẩn.</li>
<li><strong>Target IP</strong> — địa chỉ đang được hỏi về.</li>
</ul>
<p><strong>Sự thật cấu trúc quan trọng nhất:</strong> ARP KHÔNG nằm trong IP. Nó có EtherType riêng, 0x0806, và cưỡi thẳng trên Ethernet. Vì vậy nó <em>không có TTL, không có phần đầu IP và không có cách nào qua được router</em> — giao thức này bị nhốt về mặt vật lý trong một miền quảng bá. Đó không phải một quyết định chính sách; đơn giản là trong thông điệp không có chỗ nào để đặt bộ đếm chặng.</p>`],

      [7, 'The ARP table, on three systems',
        `<p>Same table, three dialects.</p>
<ul>
<li><strong>Linux — use <code>ip neigh</code>, not <code>arp -a</code>.</strong> The old command still works but hides the state column, which is the most useful thing on the screen. On IPv6 there is no <code>arp</code> command at all, so learning <code>ip neigh</code> now saves relearning later.</li>
<li><strong>Cisco IOS — <code>show ip arp</code>.</strong> An age of <code>-</code> means the router's own interface address, which never ages out. Anything else is minutes since the entry was last refreshed.</li>
</ul>
<p><strong>Lifetimes differ enormously and both choices are defensible.</strong> Cisco keeps entries for <strong>4 hours</strong>, because a router talks to the same neighbours constantly and re-ARPing costs broadcasts. Linux marks an entry <strong>REACHABLE</strong> for only about 30 seconds and then <strong>STALE</strong>, refreshing it on next use — it prefers a quick confirmation over a long assumption. Neither is wrong; they are tuned for different roles.</p>
<p>A <strong>FAILED</strong> line is the one to care about: it means we asked, repeatedly, and nobody answered. That address is not on this LAN, or the device is off.</p>`,
        `<p>Cùng một cái bảng, ba phương ngữ.</p>
<ul>
<li><strong>Linux — dùng <code>ip neigh</code>, đừng dùng <code>arp -a</code>.</strong> Lệnh cũ vẫn chạy nhưng giấu mất cột trạng thái, mà đó lại là thứ hữu ích nhất trên màn hình. Với IPv6 thì hoàn toàn không có lệnh <code>arp</code>, nên học <code>ip neigh</code> ngay bây giờ là đỡ phải học lại sau.</li>
<li><strong>Cisco IOS — <code>show ip arp</code>.</strong> Tuổi bằng <code>-</code> nghĩa là địa chỉ trên cổng của chính router, thứ không bao giờ hết hạn. Còn lại là số phút kể từ lần cuối dòng đó được làm mới.</li>
</ul>
<p><strong>Tuổi thọ khác nhau rất xa và cả hai lựa chọn đều có lý.</strong> Cisco giữ các dòng tới <strong>4 tiếng</strong>, vì router nói chuyện liên tục với cùng những hàng xóm và ARP lại thì tốn gói quảng bá. Linux đánh dấu một dòng <strong>REACHABLE</strong> chỉ khoảng 30 giây rồi chuyển <strong>STALE</strong>, và làm mới khi có người dùng tới — nó thích một lời xác nhận nhanh hơn là một giả định dài. Không cái nào sai; chúng được chỉnh cho hai vai trò khác nhau.</p>
<p>Dòng <strong>FAILED</strong> mới là thứ đáng quan tâm: nó nghĩa là ta đã hỏi, hỏi nhiều lần, và không ai trả lời. Địa chỉ đó không có trên mạng LAN này, hoặc thiết bị đang tắt.</p>`],

      [8, '★ The five states Linux keeps, and what each one means',
        `<p>This table is the reason to prefer <code>ip neigh</code> over <code>arp -a</code>, and it converts a guess into a diagnosis.</p>
<ul>
<li><strong>REACHABLE</strong> — confirmed in the last ~30 seconds. Traffic is flowing right now.</li>
<li><strong>STALE</strong> — known, not confirmed recently. <strong>This is normal.</strong> It is the resting state of a perfectly healthy entry on a link that has been quiet for a minute, and it will be re-verified the moment it is used.</li>
<li><strong>DELAY</strong> — the entry was used while stale, and the kernel is waiting about five seconds before bothering to probe, in case the traffic itself proves the neighbour is alive.</li>
<li><strong>PROBE</strong> — actively asking, right now. Transient. If an entry sits in PROBE, the neighbour has gone.</li>
<li><strong>FAILED</strong> — asked repeatedly, no answer. <strong>This is the fault.</strong></li>
</ul>
<p><strong>The practical point:</strong> most people see STALE and start debugging something that is not broken. The word to look for is FAILED, and the IP address next to it names the machine that is actually missing. If that address is your default gateway, you have found the cause of "the Internet is down" in one line.</p>`,
        `<p>Chính cái bảng này là lý do nên dùng <code>ip neigh</code> thay cho <code>arp -a</code>, và nó biến một phỏng đoán thành một chẩn đoán.</p>
<ul>
<li><strong>REACHABLE</strong> — đã xác nhận trong khoảng 30 giây gần nhất. Lưu lượng đang chảy ngay lúc này.</li>
<li><strong>STALE</strong> — đã biết, nhưng chưa xác nhận lại gần đây. <strong>Đây là bình thường.</strong> Nó là trạng thái nghỉ của một dòng hoàn toàn khoẻ mạnh trên một đường link vừa im ắng một phút, và nó sẽ được kiểm lại ngay khi có người dùng tới.</li>
<li><strong>DELAY</strong> — dòng đó vừa được dùng trong lúc đang stale, và nhân đợi khoảng năm giây trước khi chịu đi dò, phòng khi chính lưu lượng đó chứng minh hàng xóm còn sống.</li>
<li><strong>PROBE</strong> — đang hỏi, ngay bây giờ. Thoáng qua. Nếu một dòng nằm lì ở PROBE thì hàng xóm đã đi rồi.</li>
<li><strong>FAILED</strong> — đã hỏi nhiều lần, không ai đáp. <strong>Đây mới là lỗi.</strong></li>
</ul>
<p><strong>Điểm thực tế:</strong> đa số người ta thấy STALE là lao vào gỡ một thứ không hề hỏng. Chữ cần tìm là FAILED, và địa chỉ IP bên cạnh nó gọi tên cỗ máy thật sự đang mất tích. Nếu địa chỉ đó là cổng ra mặc định của bạn, thì bạn vừa tìm ra nguyên nhân của câu "mất mạng rồi" chỉ trong một dòng.</p>`],

      [9, 'ARP entries do not live forever',
        `<p>Two opposing pressures decide the timer, and understanding them explains every value you will see.</p>
<p><strong>Why entries expire at all.</strong> A network card can be replaced. A virtual machine can move to another host. An IP address can be reassigned to a different device. A cache that never expired would be permanently, confidently wrong about all three.</p>
<p><strong>Why they do not expire quickly.</strong> Every expiry eventually costs a broadcast, and a broadcast interrupts every machine in the domain. Make the timer short and a large LAN spends real bandwidth and real CPU on ARP alone.</p>
<p>Hence Cisco's 4 hours on routers, which have stable neighbours, and Linux's ~30-second confirmation window on hosts, which move around. Cisco's timer is tuned with <code>arp timeout</code> on the interface; Linux's live in <code>/proc/sys/net/ipv4/neigh/</code>.</p>
<p><strong>The timer is also why a device that changes its IP is unreachable for a while afterwards</strong> — everyone else is still holding the old pair. That wait is exactly what the next slide removes.</p>`,
        `<p>Hai áp lực ngược chiều quyết định cái đồng hồ này, và hiểu chúng là giải thích được mọi giá trị bạn sẽ gặp.</p>
<p><strong>Vì sao các dòng phải hết hạn.</strong> Card mạng có thể bị thay. Một máy ảo có thể dời sang máy chủ khác. Một địa chỉ IP có thể được cấp lại cho thiết bị khác. Một bộ đệm không bao giờ hết hạn sẽ sai vĩnh viễn, và sai một cách đầy tự tin, ở cả ba trường hợp.</p>
<p><strong>Vì sao chúng không hết hạn nhanh.</strong> Mỗi lần hết hạn rốt cuộc tốn một gói quảng bá, và một gói quảng bá làm phiền mọi cỗ máy trong miền. Đặt đồng hồ ngắn là một mạng LAN lớn sẽ tiêu băng thông thật và CPU thật chỉ cho riêng ARP.</p>
<p>Vì thế mới có 4 tiếng của Cisco trên router, thứ có hàng xóm ổn định, và khoảng xác nhận ~30 giây của Linux trên máy trạm, thứ hay dịch chuyển. Đồng hồ của Cisco chỉnh bằng <code>arp timeout</code> trên cổng; của Linux nằm trong <code>/proc/sys/net/ipv4/neigh/</code>.</p>
<p><strong>Cái đồng hồ đó cũng là lý do một thiết bị vừa đổi IP thì sau đó một lúc không ai tới được</strong> — vì mọi người khác vẫn đang giữ cặp địa chỉ cũ. Chính khoảng chờ ấy là thứ slide sau xoá bỏ.</p>`],

      [10, '★ Gratuitous ARP — an answer nobody asked for',
        `<p>A <strong>gratuitous ARP</strong> is an ARP <em>reply</em>, broadcast to everyone, that nobody requested. Its sender IP and target IP are the same address: "I am 10.0.0.50, and here is my MAC."</p>
<p><strong>Why it exists.</strong> Three legitimate uses, all of which you will meet on real infrastructure:</p>
<ul>
<li><strong>Failover.</strong> A standby server takes over a shared virtual IP and immediately announces it. Without the announcement, every other machine would keep sending to the dead server's MAC until its cache expired — potentially minutes of outage. With it, the switchover is under a second.</li>
<li><strong>Virtual machine migration.</strong> The VM keeps its IP but is now behind a different physical port. The gratuitous ARP tells the switches to relearn.</li>
<li><strong>Duplicate detection at boot.</strong> Announce your address; if somebody objects, you have a conflict.</li>
</ul>
<p><strong>Why it works — and this is the uncomfortable part.</strong> ARP has no authentication whatsoever. There is no field for a signature, no notion of who is allowed to claim an address, and no check that a reply matches a request. Any reply is believed. The property that makes failover instant is exactly the property that makes the next slide possible.</p>`,
        `<p>Một <strong>gratuitous ARP</strong> là một <em>lời đáp</em> ARP, quảng bá cho tất cả, mà không ai hỏi cả. IP nguồn và IP đích của nó là cùng một địa chỉ: "Tôi là 10.0.0.50, và đây là MAC của tôi."</p>
<p><strong>Vì sao nó tồn tại.</strong> Ba công dụng chính đáng, và bạn sẽ gặp cả ba trên hạ tầng thật:</p>
<ul>
<li><strong>Chuyển dự phòng.</strong> Một máy chủ dự phòng tiếp quản một địa chỉ IP ảo dùng chung rồi lập tức khai báo. Không có lời khai đó thì mọi máy khác sẽ tiếp tục gửi về MAC của con máy đã chết cho tới khi bộ đệm hết hạn — có thể là vài phút mất dịch vụ. Có nó thì việc chuyển đổi diễn ra dưới một giây.</li>
<li><strong>Di trú máy ảo.</strong> Máy ảo giữ nguyên IP nhưng giờ nằm sau một cổng vật lý khác. Gói gratuitous ARP bảo các con switch học lại.</li>
<li><strong>Phát hiện trùng địa chỉ lúc khởi động.</strong> Khai địa chỉ của mình ra; có ai phản đối thì tức là đang đụng nhau.</li>
</ul>
<p><strong>Vì sao nó chạy được — và đây mới là phần khó chịu.</strong> ARP hoàn toàn không có xác thực. Không có trường nào cho chữ ký, không có khái niệm ai được phép nhận một địa chỉ, và không có phép kiểm nào xem một lời đáp có khớp với lời hỏi nào không. Mọi lời đáp đều được tin. Chính cái tính chất làm cho chuyển dự phòng tức thì cũng chính là tính chất làm cho slide sau thành hiện thực.</p>`],

      [11, '★ ARP spoofing, and how to see it',
        `<p>An attacker on your LAN sends two unrequested replies. To the victim: "10.0.0.1 — the gateway — is at my MAC." To the gateway: "10.0.0.42 — the victim — is at my MAC." Both believe it, because ARP believes everything. Now every packet in both directions passes through the attacker, who can read it, modify it, and forward it on so that nothing appears broken.</p>
<p><strong>The symptom you can actually detect:</strong> two different IP addresses sharing one MAC address. The one-line check on the slide sorts the MAC column and prints duplicates. A router and a laptop cannot share a network card.</p>
<p><strong>But be careful, because there are innocent explanations too</strong> — this is the answer to this lesson's opening question. Three possibilities:</p>
<ol>
<li><strong>An attack.</strong> A gateway sharing a MAC with an ordinary workstation.</li>
<li><strong>Proxy ARP</strong> (next slide) — a router answering on behalf of addresses that are not its own.</li>
<li><strong>Legitimate multi-addressing</strong> — one server holding several service IPs on one NIC, or a load balancer.</li>
</ol>
<p><strong>The extra information that tells them apart is which IPs are involved.</strong> Several service addresses on one server is normal. Your default gateway sharing a MAC with a colleague's laptop is not. The defence is not on the host at all — it is <code>ip dhcp snooping</code> plus <code>ip arp inspection</code> on the switch, which validates every ARP against the DHCP binding table.</p>`,
        `<p>Một kẻ tấn công trên LAN của bạn gửi ra hai lời đáp không ai hỏi. Gửi cho nạn nhân: "10.0.0.1 — cổng ra — nằm ở MAC của tôi." Gửi cho cổng ra: "10.0.0.42 — nạn nhân — nằm ở MAC của tôi." Cả hai đều tin, vì ARP tin mọi thứ. Giờ mọi gói tin theo cả hai chiều đều đi qua kẻ tấn công, người có thể đọc nó, sửa nó, rồi chuyển tiếp để không có gì trông có vẻ hỏng.</p>
<p><strong>Triệu chứng bạn thật sự phát hiện được:</strong> hai địa chỉ IP khác nhau dùng chung một địa chỉ MAC. Lệnh một dòng trên slide sắp xếp cột MAC rồi in ra những cái trùng. Một con router và một cái laptop không thể dùng chung một card mạng.</p>
<p><strong>Nhưng phải cẩn thận, vì cũng có những cách giải thích vô tội</strong> — và đây là lời đáp cho câu hỏi mở đầu bài này. Ba khả năng:</p>
<ol>
<li><strong>Một cuộc tấn công.</strong> Cổng ra dùng chung MAC với một máy trạm bình thường.</li>
<li><strong>Proxy ARP</strong> (slide sau) — một con router trả lời thay cho những địa chỉ không phải của nó.</li>
<li><strong>Nhiều địa chỉ hợp lệ</strong> — một máy chủ giữ nhiều IP dịch vụ trên cùng một card, hoặc một bộ cân bằng tải.</li>
</ol>
<p><strong>Mẩu thông tin phân biệt chúng chính là NHỮNG IP nào dính vào.</strong> Vài địa chỉ dịch vụ trên một máy chủ là bình thường. Cổng ra mặc định của bạn dùng chung MAC với laptop của đồng nghiệp thì không. Cách phòng vệ hoàn toàn không nằm ở máy trạm — nó là <code>ip dhcp snooping</code> cộng <code>ip arp inspection</code> trên con switch, thứ đối chiếu mọi gói ARP với bảng cấp phát DHCP.</p>`],

      [12, '★ Proxy ARP — a router answering on someone else\'s behalf',
        `<p>With proxy ARP enabled, a router hears an ARP request for an address that is <em>not</em> on this segment, and answers with its own MAC anyway. The asking host happily believes the target is a neighbour and sends the frame to the router, which routes it onward normally.</p>
<p><strong>When it helps.</strong> A host configured with a mask that is too wide, so it thinks half the world is local. Or a legacy device that has no field for a default gateway. Proxy ARP lets both work without touching them.</p>
<p><strong>Why it is usually the wrong answer.</strong> It hides a misconfiguration instead of fixing it, so the real fault survives and surprises someone else later. It doubles ARP traffic, because the host ARPs for every remote address individually instead of once for the gateway. And it fills the ARP table with dozens of IPs all pointing at one MAC — which looks <em>exactly</em> like the spoofing attack on the previous slide, and will waste an afternoon of someone's investigation.</p>
<p>Check whether it is on with <code>cat /proc/sys/net/ipv4/conf/eth0/proxy_arp</code>; on Cisco it is <code>show ip interface</code>. Expect it to be off, and if it is on, find out who turned it on and why.</p>`,
        `<p>Khi bật proxy ARP, một con router nghe thấy lời hỏi ARP cho một địa chỉ <em>không</em> nằm trên đoạn mạng này, và vẫn cứ trả lời bằng MAC của chính nó. Cái máy đi hỏi vui vẻ tin rằng máy đích là hàng xóm rồi gửi khung cho router, và router định tuyến nó đi tiếp như bình thường.</p>
<p><strong>Khi nào nó giúp được.</strong> Một máy bị đặt mặt nạ quá rộng nên tưởng nửa thế giới là cục bộ. Hoặc một thiết bị đời cũ không có ô nào để điền cổng ra mặc định. Proxy ARP làm cho cả hai chạy được mà không phải đụng vào chúng.</p>
<p><strong>Vì sao nó thường là câu trả lời sai.</strong> Nó che giấu một lỗi cấu hình thay vì sửa, nên cái lỗi thật sống sót và làm người khác bất ngờ về sau. Nó làm lưu lượng ARP tăng gấp đôi, vì máy trạm đi ARP cho từng địa chỉ ở xa một thay vì chỉ ARP một lần cho cổng ra. Và nó nhồi vào bảng ARP hàng chục IP cùng trỏ vào một MAC — thứ trông <em>y hệt</em> cuộc tấn công giả mạo ở slide trước, và sẽ ngốn của ai đó cả một buổi chiều điều tra.</p>
<p>Kiểm xem nó có bật không bằng <code>cat /proc/sys/net/ipv4/conf/eth0/proxy_arp</code>; trên Cisco thì là <code>show ip interface</code>. Mong đợi là nó tắt, và nếu nó bật thì đi tìm xem ai bật và bật để làm gì.</p>`],

      [13, 'IPv6 has no ARP at all',
        `<p>IPv6 does the same job with a completely different mechanism, called <strong>Neighbor Discovery</strong>, and every design change follows from one lesson: <em>do not interrupt every machine on the network to ask one question.</em></p>
<ul>
<li>ARP request → <strong>Neighbor Solicitation</strong>, ICMPv6 type 135.</li>
<li>ARP reply → <strong>Neighbor Advertisement</strong>, ICMPv6 type 136.</li>
<li>Finding the gateway, which ARP cannot do at all → <strong>Router Solicitation / Advertisement</strong>, types 133 and 134.</li>
<li>Optional gratuitous ARP → <strong>Duplicate Address Detection</strong>, and it is mandatory.</li>
</ul>
<p><strong>The structural change that matters most:</strong> Neighbor Discovery <em>is</em> ICMPv6, carried inside IPv6, whereas ARP had its own EtherType outside IP. That has a direct operational consequence: <strong>a firewall rule that drops ICMPv6 stops hosts from finding each other at all.</strong> On IPv4 you can block every ICMP message and still reach your neighbour — you lose ping and Path MTU Discovery but the LAN works. On IPv6 you lose the LAN.</p>
<p>Anyone copying an IPv4 firewall policy onto IPv6 will discover this, usually at a bad moment.</p>`,
        `<p>IPv6 làm cùng một việc bằng một cơ chế hoàn toàn khác, tên là <strong>Neighbor Discovery</strong>, và mọi thay đổi thiết kế đều suy ra từ một bài học: <em>đừng làm phiền mọi cỗ máy trên mạng chỉ để hỏi một câu.</em></p>
<ul>
<li>Lời hỏi ARP → <strong>Neighbor Solicitation</strong>, ICMPv6 loại 135.</li>
<li>Lời đáp ARP → <strong>Neighbor Advertisement</strong>, ICMPv6 loại 136.</li>
<li>Tìm cổng ra, việc mà ARP hoàn toàn không làm được → <strong>Router Solicitation / Advertisement</strong>, loại 133 và 134.</li>
<li>Gratuitous ARP tuỳ chọn → <strong>Duplicate Address Detection</strong>, và nó là bắt buộc.</li>
</ul>
<p><strong>Thay đổi cấu trúc quan trọng nhất:</strong> Neighbor Discovery <em>chính là</em> ICMPv6, nằm trong IPv6, trong khi ARP có EtherType riêng nằm ngoài IP. Điều đó có một hệ quả vận hành trực tiếp: <strong>một luật tường lửa vứt ICMPv6 sẽ khiến các máy hoàn toàn không tìm thấy nhau.</strong> Trên IPv4 bạn có thể chặn mọi thông điệp ICMP mà vẫn tới được hàng xóm — bạn mất ping và mất Path MTU Discovery nhưng mạng LAN vẫn chạy. Trên IPv6 thì bạn mất luôn mạng LAN.</p>
<p>Ai đem một chính sách tường lửa của IPv4 chép sang IPv6 rồi cũng sẽ phát hiện ra điều này, và thường là vào một thời điểm rất xấu.</p>`],

      [14, 'Neighbor Solicitation and Advertisement',
        `<p>The exchange looks like ARP and behaves better in one specific way.</p>
<p>Host A sends a <strong>Neighbor Solicitation</strong> — but not to everybody. It sends it to a <em>solicited-node multicast address</em> derived from the target's own address, a group whose membership is usually exactly one machine. Host B answers with a <strong>Neighbor Advertisement</strong>, unicast, carrying its MAC.</p>
<p><strong>Who gets interrupted.</strong> With ARP, every NIC on the LAN accepts the broadcast and passes it to software. With Neighbor Discovery, only NICs that have joined that specific multicast group accept it — and because the group is built from 24 bits of the target address, that is normally one machine. On a LAN of 500 hosts, ARP interrupts 500 and ND interrupts 1.</p>
<p><strong>And the solicitation carries A's own MAC</strong> in a source link-layer address option, so B learns A in the same exchange — exactly the same two-for-one efficiency ARP had. One round trip, two caches populated.</p>`,
        `<p>Cuộc trao đổi này nhìn giống ARP và xử sự tốt hơn ở đúng một điểm.</p>
<p>Máy A gửi một <strong>Neighbor Solicitation</strong> — nhưng không gửi cho tất cả. Nó gửi tới một <em>địa chỉ multicast solicited-node</em> suy ra từ chính địa chỉ của máy đích, một nhóm mà số thành viên thường đúng bằng một cỗ máy. Máy B đáp lại bằng <strong>Neighbor Advertisement</strong>, unicast, mang theo MAC của nó.</p>
<p><strong>Ai bị làm phiền.</strong> Với ARP, mọi card mạng trên LAN đều nhận gói quảng bá rồi đẩy lên phần mềm. Với Neighbor Discovery, chỉ những card đã tham gia đúng cái nhóm multicast đó mới nhận — và vì cái nhóm được dựng từ 24 bit của địa chỉ đích, nên bình thường đó là một cỗ máy. Trên mạng LAN 500 máy, ARP làm phiền 500 còn ND làm phiền 1.</p>
<p><strong>Và lời solicitation có mang theo MAC của chính A</strong> trong một tuỳ chọn source link-layer address, nên B học được A ngay trong cùng lượt trao đổi — đúng cái hiệu quả hai-trong-một mà ARP đã có. Một vòng hỏi đáp, hai bộ đệm được điền.</p>`],

      [15, 'How the solicited-node address is built',
        `<p>Take the target's IPv6 address, keep the <strong>last 24 bits</strong>, and append them to the fixed prefix <code>ff02::1:ff00:0/104</code>.</p>
<p>So a target of <code>2001:db8:acad:1::1a:2b3c</code> gives the solicited-node address <code>ff02::1:ff1a:2b3c</code>. Every IPv6 interface automatically joins the solicited-node group for each of its own addresses, without being told to.</p>
<p><strong>Why 24 bits.</strong> It is a deliberate trade. Using the whole address would need a separate group per host and would overwhelm switch multicast tables. Using fewer bits would put many hosts in the same group and waste interrupts. Twenty-four bits makes an accidental collision possible but rare — and a collision is harmless anyway: the second machine simply examines a solicitation that is not for it and discards it, exactly as every machine does with every ARP broadcast today.</p>
<p><strong>The result</strong> is the same function as an ARP broadcast with roughly 1/500th of the disturbance on a large LAN. This is the single clearest example in the course of a protocol being redesigned from operational experience rather than from theory.</p>`,
        `<p>Lấy địa chỉ IPv6 của máy đích, giữ lại <strong>24 bit cuối</strong>, rồi gắn chúng vào tiền tố cố định <code>ff02::1:ff00:0/104</code>.</p>
<p>Nên một đích là <code>2001:db8:acad:1::1a:2b3c</code> sẽ cho địa chỉ solicited-node là <code>ff02::1:ff1a:2b3c</code>. Mọi cổng IPv6 tự động tham gia nhóm solicited-node cho từng địa chỉ của chính nó, không cần ai bảo.</p>
<p><strong>Vì sao lại 24 bit.</strong> Đó là một sự đánh đổi có chủ ý. Dùng cả địa chỉ thì sẽ cần một nhóm riêng cho mỗi máy và làm tràn bảng multicast của switch. Dùng ít bit hơn thì nhiều máy rơi vào cùng một nhóm và lãng phí ngắt. Hai mươi bốn bit làm cho va chạm tình cờ là có thể nhưng hiếm — mà va chạm thì cũng vô hại: cỗ máy thứ hai chỉ việc xem xét một lời solicitation không dành cho nó rồi vứt đi, y hệt điều mọi cỗ máy đang làm với mọi gói ARP quảng bá ngày nay.</p>
<p><strong>Kết quả</strong> là cùng một chức năng như gói ARP quảng bá nhưng chỉ gây khoảng 1/500 mức quấy rầy trên một mạng LAN lớn. Đây là ví dụ rõ ràng nhất trong cả môn về một giao thức được thiết kế lại từ kinh nghiệm vận hành chứ không phải từ lý thuyết.</p>`],

      [16, 'Router Solicitation, Advertisement and SLAAC',
        `<p>This is the part ARP has no equivalent for, and it removes a whole configuration step.</p>
<p>A host that has just booted sends a <strong>Router Solicitation</strong> to <code>ff02::2</code>, the all-routers group. A router replies with a <strong>Router Advertisement</strong> containing the prefix in use on this link — say <code>2001:db8:acad:1::/64</code> — and announcing itself as a gateway. The host then <em>builds its own address</em> from that prefix plus an interface identifier.</p>
<p><strong>This is SLAAC</strong>, Stateless Address Autoconfiguration. "Stateless" means no server records who got which address: there is no lease table to run out, to back up, or to get out of sync. The host picks, and because the address space is enormous, collisions are vanishingly unlikely — and Duplicate Address Detection catches them anyway.</p>
<p><strong>The default gateway comes from the RA itself</strong>, which is why IPv6 hosts have no gateway setting to configure.</p>
<p>★ The security consequence is immediate: anyone who can put a machine on your LAN can send Router Advertisements and become the gateway. There is no authentication. Switches defend against it with <strong>RA Guard</strong>, which drops RAs arriving on ports where no router should be.</p>`,
        `<p>Đây là phần mà ARP hoàn toàn không có thứ tương đương, và nó xoá bỏ luôn một bước cấu hình.</p>
<p>Một máy vừa khởi động gửi một <strong>Router Solicitation</strong> tới <code>ff02::2</code>, nhóm tất-cả-router. Một router đáp lại bằng <strong>Router Advertisement</strong> chứa tiền tố đang dùng trên đường link này — ví dụ <code>2001:db8:acad:1::/64</code> — và tự xưng là cổng ra. Máy trạm sau đó <em>tự dựng lấy địa chỉ của mình</em> từ tiền tố đó cộng với một định danh cổng.</p>
<p><strong>Đó là SLAAC</strong>, Stateless Address Autoconfiguration. Chữ "stateless" nghĩa là không có máy chủ nào ghi lại ai nhận địa chỉ nào: không có bảng cấp phát nào để mà cạn, để mà sao lưu, hay để mà lệch nhịp. Máy trạm tự chọn, và vì không gian địa chỉ khổng lồ nên khả năng đụng nhau gần như bằng không — mà Duplicate Address Detection thì vẫn bắt được nếu có.</p>
<p><strong>Cổng ra mặc định đến từ chính gói RA</strong>, và đó là lý do máy IPv6 không có ô cổng ra nào để cấu hình.</p>
<p>★ Hệ quả bảo mật hiện ra ngay: ai cắm được một cỗ máy vào mạng LAN của bạn đều có thể gửi Router Advertisement và trở thành cổng ra. Không có xác thực nào. Switch chống lại bằng <strong>RA Guard</strong>, thứ vứt các gói RA tới từ những cổng lẽ ra không có router nào.</p>`],

      [17, 'Duplicate Address Detection — asking before claiming',
        `<p>Before an IPv6 host uses any address, including the automatic link-local one, it must prove nobody else has it.</p>
<p>It sends a Neighbor Solicitation for the address it <em>intends</em> to use, with a source address of <code>::</code> — the unspecified address — because it does not legitimately own anything yet. Silence means the address is free. A Neighbor Advertisement in reply means somebody already has it, and the host disables the address rather than causing a conflict.</p>
<p><strong>The IPv4 equivalent is a gratuitous ARP at boot, and it is optional.</strong> Plenty of stacks skip it, which is why IPv4 duplicate addresses produce that famous intermittent fault where two machines fight over one address and connections break every few seconds. IPv6 made the check mandatory and the problem largely went away.</p>
<p>★ You will meet a DAD failure sooner than you expect: two containers or two VMs cloned from the same image can end up with the same MAC address, and since the link-local address is derived from the MAC, they generate the same link-local address. <code>ip -6 addr</code> then shows the address flagged <code>dadfailed</code>, which is an unusually honest error message — it tells you exactly what happened.</p>`,
        `<p>Trước khi một máy IPv6 dùng bất cứ địa chỉ nào, kể cả cái link-local tự động, nó phải chứng minh không ai khác đang giữ địa chỉ đó.</p>
<p>Nó gửi một Neighbor Solicitation cho cái địa chỉ nó <em>định</em> dùng, với địa chỉ nguồn là <code>::</code> — địa chỉ chưa xác định — vì nó chưa sở hữu hợp lệ thứ gì. Im lặng nghĩa là địa chỉ còn trống. Một Neighbor Advertisement đáp lại nghĩa là đã có người giữ, và máy trạm sẽ vô hiệu hoá địa chỉ đó thay vì gây xung đột.</p>
<p><strong>Thứ tương đương bên IPv4 là một gratuitous ARP lúc khởi động, và nó là tuỳ chọn.</strong> Khối bộ giao thức bỏ qua nó, và đó là lý do trùng địa chỉ IPv4 đẻ ra cái lỗi chập chờn nổi tiếng: hai cỗ máy giành nhau một địa chỉ và kết nối đứt vài giây một lần. IPv6 làm cho phép kiểm này thành bắt buộc và vấn đề gần như biến mất.</p>
<p>★ Bạn sẽ gặp một ca DAD hỏng sớm hơn bạn tưởng: hai container hoặc hai máy ảo nhân bản từ cùng một ảnh có thể có cùng một địa chỉ MAC, và vì địa chỉ link-local suy ra từ MAC nên chúng sinh ra cùng một địa chỉ link-local. Khi đó <code>ip -6 addr</code> hiện địa chỉ có cờ <code>dadfailed</code>, một thông báo lỗi thành thật một cách hiếm thấy — nó nói đúng chuyện vừa xảy ra.</p>`],

      [18, '★ The neighbour table on a real IPv6 server',
        `<p>Three things in this output surprise people the first time, and all three are correct.</p>
<ul>
<li><strong>The gateway is <code>fe80::1</code>, a link-local address.</strong> Every IPv6 interface has an <code>fe80::/10</code> address, automatically, always, even with no other configuration. A gateway is a neighbour, and neighbours are addressed link-locally. This is normal and correct, not a misconfiguration.</li>
<li><strong>The word <code>router</code> appears in the neighbour entry.</strong> Linux records it because that neighbour has been sending Router Advertisements. ARP had no equivalent, because ARP does not know what a router is.</li>
<li><strong><code>proto ra</code> on the default route.</strong> This route was learned from a Router Advertisement. Nobody typed it, no DHCP server handed it out, and it will disappear on its own if the advertisements stop.</li>
</ul>
<p><strong>The practical check on a dual-stack server:</strong> if <code>ip -6 addr</code> shows global addresses but <code>ip -6 route show default</code> is empty, IPv6 is half-configured. Programs will try IPv6 first, wait for it to time out, and fall back to IPv4 — which shows up as "everything is slow to start" and nothing else.</p>`,
        `<p>Ba thứ trong kết xuất này làm người ta ngạc nhiên lần đầu, và cả ba đều đúng.</p>
<ul>
<li><strong>Cổng ra là <code>fe80::1</code>, một địa chỉ link-local.</strong> Mọi cổng IPv6 đều có một địa chỉ <code>fe80::/10</code>, tự động, luôn luôn, kể cả khi không cấu hình gì khác. Cổng ra là một hàng xóm, và hàng xóm thì được đề địa chỉ theo kiểu link-local. Đây là bình thường và đúng, không phải lỗi cấu hình.</li>
<li><strong>Chữ <code>router</code> xuất hiện trong dòng láng giềng.</strong> Linux ghi lại như vậy vì cái hàng xóm đó đã gửi Router Advertisement. ARP không có thứ tương đương, vì ARP không biết router là cái gì.</li>
<li><strong><code>proto ra</code> trên tuyến mặc định.</strong> Tuyến này học được từ một Router Advertisement. Không ai gõ nó, không máy chủ DHCP nào phát nó, và nó sẽ tự biến mất nếu các gói quảng bá kia ngừng.</li>
</ul>
<p><strong>Phép kiểm thực tế trên một máy chủ chạy song song hai ngăn xếp:</strong> nếu <code>ip -6 addr</code> hiện địa chỉ toàn cục mà <code>ip -6 route show default</code> lại rỗng, thì IPv6 mới cấu hình được một nửa. Chương trình sẽ thử IPv6 trước, ngồi chờ hết giờ, rồi lùi về IPv4 — và triệu chứng hiện ra chỉ là "cái gì cũng chậm lúc bắt đầu", không có gì khác.</p>`],

      [19, 'ARP and Neighbor Discovery, side by side',
        `<p>Read the table as a list of lessons learned in the thirty years between the two designs.</p>
<ul>
<li><strong>Broadcast became multicast.</strong> The single biggest improvement, and it follows from operational pain on large LANs.</li>
<li><strong>Outside IP became inside IP.</strong> ND is ICMPv6, so it inherits IPv6's addressing and its hop limit — which is set to 255 and <em>checked</em> on receipt, so a message that crossed a router would arrive with a lower value and be discarded. That is a neat trick: a protocol that cannot leave the link, enforced by arithmetic rather than by hoping.</li>
<li><strong>Finding the gateway became part of the protocol.</strong> ARP could not do it at all, so IPv4 needed DHCP or a human.</li>
<li><strong>Duplicate detection became mandatory</strong> rather than optional.</li>
<li><strong>Authentication did not improve.</strong> SEND (Secure Neighbor Discovery) exists and is essentially unused. Both protocols still believe whatever they are told, and both are defended at the switch rather than in the protocol.</li>
</ul>`,
        `<p>Hãy đọc cái bảng này như một danh sách những bài học rút ra trong ba mươi năm giữa hai thiết kế.</p>
<ul>
<li><strong>Quảng bá thành multicast.</strong> Cải tiến lớn nhất, và nó sinh ra từ nỗi đau vận hành trên các mạng LAN lớn.</li>
<li><strong>Từ ngoài IP thành trong IP.</strong> ND là ICMPv6, nên nó thừa hưởng cách đánh địa chỉ của IPv6 và cả hop limit của nó — được đặt bằng 255 và <em>được kiểm</em> lúc nhận, nên một thông điệp đã qua router sẽ tới nơi với giá trị nhỏ hơn và bị vứt. Đó là một mẹo gọn ghẽ: một giao thức không thể rời khỏi đường link, được ép bằng phép tính chứ không bằng cách hy vọng.</li>
<li><strong>Việc tìm cổng ra trở thành một phần của giao thức.</strong> ARP hoàn toàn không làm được, nên IPv4 phải cần DHCP hoặc cần người.</li>
<li><strong>Phát hiện trùng địa chỉ thành bắt buộc</strong> thay vì tuỳ chọn.</li>
<li><strong>Xác thực thì không khá hơn.</strong> SEND (Secure Neighbor Discovery) có tồn tại và gần như không ai dùng. Cả hai giao thức vẫn tin bất cứ điều gì người ta nói với chúng, và cả hai đều được bảo vệ ở con switch chứ không phải trong giao thức.</li>
</ul>`],

      [20, 'Reading a broken LAN through its neighbour table',
        `<p>Four patterns, four different faults. This table is the practical payoff of the whole chapter — with one command you can usually name the problem before opening anything else.</p>
<ul>
<li><strong>Gateway entry says FAILED.</strong> Nobody answered for the gateway address. In order of likelihood: the gateway address configured on this host is wrong; the host is in the wrong VLAN; the router's interface is down. Check the address first — it is wrong far more often than the router is broken.</li>
<li><strong>Table empty and staying empty.</strong> The interface is down, has no IP, or the switch port is in a VLAN with nobody else in it. Run <code>ip -br addr</code> and <code>ip -br link</code> before anything else.</li>
<li><strong>Two IPs sharing one MAC.</strong> Spoofing, proxy ARP, or legitimate multi-addressing. Which IPs are involved decides which.</li>
<li><strong>One IP, two MACs alternating over time.</strong> A duplicate IP address. Two machines are both claiming it and overwriting each other, and connections break every few seconds — the classic intermittent fault that looks like bad hardware.</li>
</ul>`,
        `<p>Bốn dáng vẻ, bốn lỗi khác nhau. Cái bảng này là phần thưởng thực tế của cả chương — chỉ một lệnh là thường bạn gọi được tên vấn đề trước khi mở bất cứ thứ gì khác.</p>
<ul>
<li><strong>Dòng của cổng ra ghi FAILED.</strong> Không ai trả lời cho địa chỉ cổng ra. Theo thứ tự khả năng: địa chỉ cổng ra cấu hình trên máy này bị sai; máy đang nằm nhầm VLAN; cổng của router đang tắt. Kiểm cái địa chỉ trước — nó sai thường xuyên hơn hẳn so với việc router hỏng.</li>
<li><strong>Bảng rỗng và cứ rỗng mãi.</strong> Cổng mạng đang tắt, chưa có IP, hoặc cổng switch nằm trong một VLAN không có ai khác. Chạy <code>ip -br addr</code> và <code>ip -br link</code> trước mọi thứ.</li>
<li><strong>Hai IP dùng chung một MAC.</strong> Giả mạo, proxy ARP, hoặc nhiều địa chỉ hợp lệ. Chính việc NHỮNG IP nào dính vào quyết định là cái nào.</li>
<li><strong>Một IP, hai MAC thay nhau theo thời gian.</strong> Trùng địa chỉ IP. Hai cỗ máy cùng nhận nó và ghi đè lên nhau, và kết nối đứt vài giây một lần — cái lỗi chập chờn kinh điển trông như hỏng phần cứng.</li>
</ul>`],

      [21, '8.4 — using AI on this material, safely',
        `<p>The syllabus makes this a self-learning item, and it is assessed under CLO9, so be ready to talk about it concretely rather than in generalities.</p>
<p><strong>Where AI is genuinely good here.</strong> Address resolution produces short, structured output — an ARP table, a tcpdump line — and asking a model to interpret <em>output you already possess</em> is safe, because you can check the answer against the machine. "Here is my <code>ip neigh</code>; which of these lines explains why I cannot reach the Internet?" is an excellent question.</p>
<p><strong>Where it is dangerous.</strong> It will invent command output that looks perfect and describes a network that does not exist. Never treat generated output as evidence about your own systems. And never ask it questions of <em>state</em> — "is my gateway reachable?" — because only your machine knows, and the model will guess confidently.</p>
<p><strong>The rule for the rest of the course:</strong> AI forms the hypothesis, a command tests it. Never the reverse.</p>
<p>For the assessment, prepare one example of each: a time it saved you, and a time you caught it being confidently wrong. The second one is the more convincing answer.</p>`,
        `<p>Syllabus xếp mục này là phần tự học, và nó được chấm theo CLO9, nên hãy chuẩn bị nói về nó một cách cụ thể chứ đừng nói chung chung.</p>
<p><strong>Chỗ AI thật sự giỏi ở đây.</strong> Phân giải địa chỉ sinh ra kết xuất ngắn và có cấu trúc — một bảng ARP, một dòng tcpdump — và bảo mô hình diễn giải <em>kết xuất bạn đã có sẵn trong tay</em> là an toàn, vì bạn đối chiếu được câu trả lời với cái máy. "Đây là <code>ip neigh</code> của tôi; dòng nào trong số này giải thích vì sao tôi không ra được Internet?" là một câu hỏi rất tốt.</p>
<p><strong>Chỗ nó nguy hiểm.</strong> Nó sẽ bịa ra kết xuất lệnh trông hoàn hảo và mô tả một mạng không tồn tại. Đừng bao giờ coi kết xuất do AI sinh ra là bằng chứng về hệ thống của chính bạn. Và đừng bao giờ hỏi nó câu hỏi về <em>trạng thái</em> — "cổng ra của tôi có tới được không?" — vì chỉ máy của bạn biết, còn mô hình thì sẽ đoán một cách đầy tự tin.</p>
<p><strong>Nguyên tắc cho phần còn lại của môn:</strong> AI dựng giả thuyết, một câu lệnh kiểm chứng nó. Đừng bao giờ làm ngược lại.</p>
<p>Để chuẩn bị cho phần chấm, hãy có sẵn mỗi loại một ví dụ: một lần nó cứu bạn, và một lần bạn bắt được nó sai mà vẫn nói chắc nịch. Ví dụ thứ hai mới là câu trả lời thuyết phục hơn.</p>`],

      [22, 'Chapter 8 — what you must be able to do',
        `<p>Nine abilities. The first eight are Cisco Module 9 and will be examined; the last is the ★ one you will use on your own machines.</p>
<p><strong>A two-minute self-test.</strong> On any Linux box: run <code>ip neigh</code>, point at the gateway's line, say what its state means, and predict what would happen if that line said FAILED. Then run <code>sudo ip neigh flush dev eth0</code>, start a capture, ping the gateway, and narrate the two ARP packets you see as they appear. If you can do that without pausing, this chapter is finished.</p>`,
        `<p>Chín năng lực. Tám cái đầu là Module 9 của Cisco và sẽ bị hỏi thi; cái cuối là phần ★ bạn sẽ dùng trên máy của chính mình.</p>
<p><strong>Một phép tự kiểm hai phút.</strong> Trên bất cứ máy Linux nào: chạy <code>ip neigh</code>, chỉ vào dòng của cổng ra, nói xem trạng thái của nó nghĩa là gì, và dự đoán chuyện gì xảy ra nếu dòng đó ghi FAILED. Rồi chạy <code>sudo ip neigh flush dev eth0</code>, mở bắt gói, ping cổng ra, và kể lại hai gói ARP bạn thấy ngay khi chúng hiện ra. Làm được thế mà không ngập ngừng thì chương này coi như xong.</p>`],
    ]),

    bi(
      `<h3>🗺️ The full exchange, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["Need MAC for 10.0.0.1"] --> B{"In the cache?"}
  B -->|"yes, REACHABLE"| Z["send the frame now"]
  B -->|"no, or FAILED"| C["ARP request<br/>dst FF:FF:FF:FF:FF:FF"]
  C --> D["every NIC on the LAN<br/>receives and inspects it"]
  D --> E["only the owner replies<br/>UNICAST, back to the asker"]
  E --> Z
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B ask
  class A,C,D act
  class E,Z ok</code></pre>
<p>On IPv6 the same diagram holds with two words changed: the request becomes a Neighbor Solicitation sent to a multicast group of roughly one, instead of a broadcast to everybody.</p>`,
      `<h3>🗺️ Toàn bộ cuộc trao đổi, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Cần MAC của 10.0.0.1"] --> B{"Có trong bộ đệm chưa?"}
  B -->|"có, REACHABLE"| Z["gửi khung đi luôn"]
  B -->|"chưa, hoặc FAILED"| C["Lời hỏi ARP<br/>đích FF:FF:FF:FF:FF:FF"]
  C --> D["mọi card mạng trên LAN<br/>đều nhận và xem xét"]
  D --> E["chỉ chủ nhân trả lời<br/>UNICAST, gửi thẳng về bên hỏi"]
  E --> Z
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B ask
  class A,C,D act
  class E,Z ok</code></pre>
<p>Trên IPv6 vẫn đúng sơ đồ đó, chỉ đổi hai chữ: lời hỏi trở thành Neighbor Solicitation gửi tới một nhóm multicast chỉ khoảng một thành viên, thay vì quảng bá cho tất cả.</p>`,
    ),

    bi(
      `<h3>🔍 How to check this yourself</h3>
<pre><code class="language-bash"># 1. The table, with the state column that arp -a hides
ip neigh show

# 2. Watch a resolution happen from scratch
sudo ip neigh flush dev eth0
sudo tcpdump -n -e -i eth0 arp &amp;
ping -c 1 10.0.0.1

# 3. Is my gateway actually answering? Ask it directly at layer 2.
sudo arping -c 3 -I eth0 10.0.0.1

# 4. Duplicate-MAC check — two IPs on one MAC needs explaining
ip neigh | awk '{print $5}' | sort | uniq -d

# 5. Is proxy ARP quietly on?
cat /proc/sys/net/ipv4/conf/eth0/proxy_arp

# 6. IPv6: neighbours, the RA-learned default route, and DAD state
ip -6 neigh show
ip -6 route show default
ip -6 addr show | grep -E 'tentative|dadfailed'</code></pre>
<h4>Reading the results</h4>
<ul>
<li><strong>STALE is not a problem.</strong> It is the resting state of a working entry. <strong>FAILED</strong> is the problem, and the IP beside it names the missing machine.</li>
<li><code>arping</code> is the sharpest tool here: it answers "is this neighbour alive?" at layer 2 only, with no IP routing, no firewall and no ICMP involved. A host that does not answer <code>ping</code> but does answer <code>arping</code> is alive and filtering.</li>
<li>Step 4 printing anything at all needs an explanation. Several service IPs on one server is fine; your gateway sharing a MAC with a workstation is not.</li>
<li><code>proxy_arp</code> should read <strong>0</strong>. A 1 means somebody enabled it, and it is probably papering over a wrong subnet mask.</li>
<li><code>dadfailed</code> means two machines generated the same IPv6 address — usually cloned VMs or containers sharing a MAC.</li>
</ul>`,
      `<h3>🔍 Cách tự kiểm</h3>
<pre><code class="language-bash"># 1. Cái bảng, kèm cột trạng thái mà arp -a giấu đi
ip neigh show

# 2. Xem một lần phân giải diễn ra từ đầu
sudo ip neigh flush dev eth0
sudo tcpdump -n -e -i eth0 arp &amp;
ping -c 1 10.0.0.1

# 3. Cổng ra có thật sự trả lời không? Hỏi thẳng nó ở tầng 2.
sudo arping -c 3 -I eth0 10.0.0.1

# 4. Kiểm MAC trùng — hai IP chung một MAC là phải giải thích được
ip neigh | awk '{print $5}' | sort | uniq -d

# 5. Proxy ARP có đang lặng lẽ bật không?
cat /proc/sys/net/ipv4/conf/eth0/proxy_arp

# 6. IPv6: láng giềng, tuyến mặc định học từ RA, và trạng thái DAD
ip -6 neigh show
ip -6 route show default
ip -6 addr show | grep -E 'tentative|dadfailed'</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li><strong>STALE không phải vấn đề.</strong> Nó là trạng thái nghỉ của một dòng đang chạy tốt. <strong>FAILED</strong> mới là vấn đề, và cái IP bên cạnh nó gọi tên cỗ máy đang mất tích.</li>
<li><code>arping</code> là công cụ sắc nhất ở đây: nó trả lời câu "hàng xóm này còn sống không?" chỉ ở tầng 2, không dính định tuyến IP, không dính tường lửa, không dính ICMP. Một máy không đáp <code>ping</code> mà đáp <code>arping</code> thì nó còn sống và đang lọc gói.</li>
<li>Bước 4 mà in ra bất cứ thứ gì là phải giải thích được. Vài IP dịch vụ trên một máy chủ thì ổn; cổng ra của bạn dùng chung MAC với một máy trạm thì không.</li>
<li><code>proxy_arp</code> nên đọc ra <strong>0</strong>. Ra 1 nghĩa là có người bật nó, và nhiều khả năng nó đang che một mặt nạ mạng đặt sai.</li>
<li><code>dadfailed</code> nghĩa là hai cỗ máy sinh ra cùng một địa chỉ IPv6 — thường là máy ảo hoặc container nhân bản dùng chung MAC.</li>
</ul>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>Debugging a STALE entry.</strong> Stale is normal and means "known, not confirmed in the last half minute". The word that matters is FAILED. <em>Symptom:</em> an hour spent on an entry that was never broken.</li>
<li><strong>Using <code>arp -a</code> on Linux.</strong> It hides the state column — the most useful information on the screen — and it does not exist for IPv6 at all. Use <code>ip neigh</code>. <em>Symptom:</em> you cannot tell a healthy entry from a dead one.</li>
<li><strong>Believing an ARP entry proves the machine is up.</strong> A cached entry can be four hours old on IOS. <em>Symptom:</em> "the ARP table looks fine" about a device that is switched off.</li>
<li><strong>Treating duplicate MACs as automatically an attack.</strong> Proxy ARP and multi-homed servers produce the same pattern. Look at <em>which</em> IPs before raising an alarm. <em>Symptom:</em> a false security incident, or worse, a real one dismissed as "probably the load balancer".</li>
<li><strong>Copying an IPv4 firewall policy onto IPv6.</strong> "Drop all ICMP" is survivable on IPv4 and fatal on IPv6, because Neighbor Discovery <em>is</em> ICMPv6. <em>Symptom:</em> IPv6 hosts on the same LAN cannot reach each other at all, while IPv4 works perfectly.</li>
<li><strong>Configuring an IPv6 default gateway by hand and being confused by <code>fe80::1</code>.</strong> A link-local gateway address is correct and expected. <em>Symptom:</em> "fixing" a working configuration.</li>
<li><strong>Cloning VMs or containers without changing the MAC.</strong> Identical MACs produce identical link-local addresses and DAD failures. <em>Symptom:</em> <code>dadfailed</code> in <code>ip -6 addr</code>, and IPv6 silently disabled on one of them.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Đi gỡ lỗi một dòng STALE.</strong> Stale là bình thường và nghĩa là "đã biết, chưa xác nhận lại trong nửa phút qua". Chữ đáng quan tâm là FAILED. <em>Triệu chứng:</em> mất một tiếng cho một dòng chưa từng hỏng.</li>
<li><strong>Dùng <code>arp -a</code> trên Linux.</strong> Nó giấu cột trạng thái — thông tin hữu ích nhất trên màn hình — và với IPv6 thì nó hoàn toàn không tồn tại. Hãy dùng <code>ip neigh</code>. <em>Triệu chứng:</em> bạn không phân biệt nổi dòng khoẻ với dòng chết.</li>
<li><strong>Tin rằng một dòng ARP chứng minh cỗ máy đang chạy.</strong> Một dòng trong bộ đệm có thể đã bốn tiếng tuổi trên IOS. <em>Triệu chứng:</em> "bảng ARP nhìn ổn mà" về một thiết bị đang tắt.</li>
<li><strong>Coi MAC trùng nhau đương nhiên là tấn công.</strong> Proxy ARP và máy chủ nhiều địa chỉ đều đẻ ra cùng một dáng vẻ. Hãy nhìn xem <em>những</em> IP nào trước khi báo động. <em>Triệu chứng:</em> một sự cố bảo mật giả, hoặc tệ hơn, một sự cố thật bị gạt đi vì "chắc là cái load balancer thôi".</li>
<li><strong>Chép chính sách tường lửa IPv4 sang IPv6.</strong> "Vứt hết ICMP" thì sống được trên IPv4 và chí mạng trên IPv6, vì Neighbor Discovery <em>chính là</em> ICMPv6. <em>Triệu chứng:</em> các máy IPv6 trên cùng một LAN hoàn toàn không tới được nhau, trong khi IPv4 chạy hoàn hảo.</li>
<li><strong>Cấu hình cổng ra IPv6 bằng tay rồi hoang mang vì <code>fe80::1</code>.</strong> Địa chỉ cổng ra dạng link-local là đúng và là điều bình thường. <em>Triệu chứng:</em> đi "sửa" một cấu hình đang chạy tốt.</li>
<li><strong>Nhân bản máy ảo hoặc container mà không đổi MAC.</strong> MAC giống hệt nhau đẻ ra địa chỉ link-local giống hệt nhau và làm DAD hỏng. <em>Triệu chứng:</em> chữ <code>dadfailed</code> trong <code>ip -6 addr</code>, và IPv6 bị tắt lặng lẽ trên một trong hai máy.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p><strong>1.</strong> Why must an ARP request be a broadcast while an ARP reply need not be?</p>
<p><strong>2.</strong> In an ARP request, what is in the Target MAC field, and why?</p>
<p><strong>3.</strong> Build the solicited-node multicast address for <code>2001:db8:1::abc:1234</code>.</p>
<p><strong>4.</strong> A host answers <code>arping</code> but not <code>ping</code>. What does that prove, and what does it rule out?</p>
<p><strong>5.</strong> Why does blocking all ICMP break IPv6 far worse than it breaks IPv4?</p>
<p><strong>6.</strong> Your gateway's neighbour entry reads FAILED. List the three causes in order of likelihood, and the command that distinguishes them.</p>
<hr>
<h4>Answers</h4>
<p><strong>1.</strong> The request has to reach a machine whose MAC address is unknown — that is the entire question being asked — so there is no address to send it to except the broadcast address. By the time the reply is sent, the situation is completely different: the request carried the sender's MAC and IP, so the answerer knows exactly who asked and can reply unicast. One broadcast is unavoidable; the second would be pure waste.</p>
<p><strong>2. All zeros.</strong> That field is the blank being filled in — the requester does not know the target's hardware address, which is why it is asking. The reply puts the real value there. Recognising all-zero Target MAC as "this is a request" is a standard exam question and a standard capture-reading skill.</p>
<p><strong>3. <code>ff02::1:ffbc:1234</code>.</strong> Take the last 24 bits of the target. The address ends <code>...:abc:1234</code>, which written out is <code>0abc:1234</code>; the last 24 bits are <code>bc:1234</code>. Append to the fixed prefix <code>ff02::1:ff00:0/104</code> and you get <code>ff02::1:ffbc:1234</code>. The common error is taking 16 bits or 32 — it is always exactly 24.</p>
<p><strong>4.</strong> <code>arping</code> works purely at layer 2 using ARP; <code>ping</code> needs IP and ICMP. So an answer to arping proves the machine is powered on, its NIC is working, it is on your VLAN, and layer 1 and 2 are healthy. It <em>rules out</em> cabling, switch port and VLAN problems. What remains is an IP-layer issue: a firewall dropping ICMP, a wrong subnet mask on one side, or a wrong IP address. This makes arping the fastest way to split a fault into "below IP" or "at IP".</p>
<p><strong>5.</strong> On IPv4, ARP is a separate protocol with its own EtherType outside IP, so blocking ICMP costs you ping and Path MTU Discovery but hosts still find each other and the LAN works. On IPv6, Neighbor Discovery <em>is</em> ICMPv6 — types 133 to 136 — so blocking ICMPv6 blocks address resolution itself. Hosts cannot learn each other's MAC addresses, cannot find the router, and cannot complete Duplicate Address Detection. The LAN does not degrade; it stops.</p>
<p><strong>6.</strong> In order: <strong>(a)</strong> the gateway address configured on this host is wrong — check with <code>ip route show default</code> and compare against what the network actually uses; <strong>(b)</strong> the host is in the wrong VLAN or on the wrong switch port, so the gateway is not in this broadcast domain — check whether <em>any</em> neighbour resolves, or whether the table is entirely empty; <strong>(c)</strong> the router interface is genuinely down — the least likely, and the only one that is not your fault. <code>arping -I eth0 &lt;gateway&gt;</code> distinguishes them: no answer at all is consistent with (a) or (b), and you separate those by seeing whether any other address on the subnet answers.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Vì sao lời hỏi ARP bắt buộc phải quảng bá trong khi lời đáp ARP thì không cần?</p>
<p><strong>2.</strong> Trong một lời hỏi ARP, trường Target MAC chứa gì, và vì sao?</p>
<p><strong>3.</strong> Hãy dựng địa chỉ multicast solicited-node cho <code>2001:db8:1::abc:1234</code>.</p>
<p><strong>4.</strong> Một máy đáp <code>arping</code> mà không đáp <code>ping</code>. Điều đó chứng minh gì, và loại trừ được gì?</p>
<p><strong>5.</strong> Vì sao chặn hết ICMP lại phá IPv6 nặng hơn hẳn so với phá IPv4?</p>
<p><strong>6.</strong> Dòng láng giềng của cổng ra ghi FAILED. Hãy liệt kê ba nguyên nhân theo thứ tự khả năng, và lệnh phân biệt chúng.</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1.</strong> Lời hỏi phải tới được một cỗ máy mà địa chỉ MAC của nó chưa biết — đó chính là toàn bộ câu đang hỏi — nên không có địa chỉ nào để gửi tới ngoài địa chỉ quảng bá. Tới lúc gửi lời đáp thì tình hình khác hẳn: lời hỏi đã mang theo MAC và IP của bên gửi, nên bên đáp biết chính xác ai vừa hỏi và trả lời unicast được. Một gói quảng bá là không tránh được; gói thứ hai sẽ là lãng phí thuần tuý.</p>
<p><strong>2. Toàn số 0.</strong> Trường đó chính là chỗ trống đang cần điền — bên hỏi không biết địa chỉ phần cứng của máy đích, và đó là lý do nó đi hỏi. Lời đáp mới đặt giá trị thật vào đó. Nhận ra Target MAC toàn số 0 nghĩa là "đây là lời hỏi" vừa là câu hỏi thi tiêu chuẩn vừa là kỹ năng đọc bản bắt gói tiêu chuẩn.</p>
<p><strong>3. <code>ff02::1:ffbc:1234</code>.</strong> Lấy 24 bit cuối của địa chỉ đích. Địa chỉ kết thúc bằng <code>...:abc:1234</code>, viết đầy đủ là <code>0abc:1234</code>; 24 bit cuối là <code>bc:1234</code>. Gắn vào tiền tố cố định <code>ff02::1:ff00:0/104</code> là ra <code>ff02::1:ffbc:1234</code>. Lỗi hay gặp là lấy 16 bit hoặc 32 bit — luôn luôn là đúng 24.</p>
<p><strong>4.</strong> <code>arping</code> chạy thuần ở tầng 2 bằng ARP; <code>ping</code> cần IP và ICMP. Nên việc đáp arping chứng minh cỗ máy đang có điện, card mạng của nó chạy, nó nằm đúng VLAN của bạn, và tầng 1 với tầng 2 đều khoẻ. Nó <em>loại trừ</em> các vấn đề về dây, cổng switch và VLAN. Còn lại là chuyện ở tầng IP: một tường lửa vứt ICMP, một mặt nạ mạng sai ở một bên, hoặc một địa chỉ IP sai. Điều đó làm arping thành cách nhanh nhất để chẻ một lỗi thành "dưới IP" hay "tại IP".</p>
<p><strong>5.</strong> Trên IPv4, ARP là một giao thức riêng có EtherType riêng nằm ngoài IP, nên chặn ICMP chỉ làm bạn mất ping và Path MTU Discovery, còn các máy vẫn tìm thấy nhau và mạng LAN vẫn chạy. Trên IPv6, Neighbor Discovery <em>chính là</em> ICMPv6 — loại 133 tới 136 — nên chặn ICMPv6 là chặn luôn chính việc phân giải địa chỉ. Các máy không học được MAC của nhau, không tìm được router, và không hoàn tất được Duplicate Address Detection. Mạng LAN không kém đi; nó dừng hẳn.</p>
<p><strong>6.</strong> Theo thứ tự: <strong>(a)</strong> địa chỉ cổng ra cấu hình trên chính máy này bị sai — kiểm bằng <code>ip route show default</code> rồi đối chiếu với thứ mạng thật sự đang dùng; <strong>(b)</strong> máy nằm nhầm VLAN hoặc nhầm cổng switch, nên cổng ra không nằm trong miền quảng bá này — kiểm xem có <em>bất cứ</em> hàng xóm nào phân giải được không, hay cái bảng rỗng hoàn toàn; <strong>(c)</strong> cổng của router đúng là đang tắt — ít khả năng nhất, và là nguyên nhân duy nhất không phải lỗi của bạn. Lệnh <code>arping -I eth0 &lt;cổng ra&gt;</code> phân biệt chúng: hoàn toàn không có đáp là khớp với (a) hoặc (b), và bạn tách hai cái đó ra bằng cách xem có địa chỉ nào khác trong subnet chịu trả lời không.</p>`,
    ),

    cq(25, [
      ['CQ9.1', 'How can ARP enable communication on a network? <em>— this one does match the chapter. Answer it with the broadcast question / unicast answer exchange, the cache and its states, and the fact that a host resolves the gateway rather than the far destination when the target is remote.</em>',
        'How can ARP enable communication on a network? <em>— câu này khớp đúng chương. Hãy trả lời bằng cuộc trao đổi hỏi-quảng-bá / đáp-unicast, bằng bộ đệm cùng các trạng thái của nó, và bằng việc máy trạm phân giải CỔNG RA chứ không phải máy đích ở xa khi đích nằm ngoài mạng.</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 8 — Address Resolution|||Quiz Chương 8 — Phân giải địa chỉ',
  slug: 'nwc204-ch8-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 8: hai địa chỉ trong một gói, MAC bị viết lại còn IP thì không, hỏi MAC của ai khi đích cục bộ hay ở xa, cuộc trao đổi ARP, trường Target MAC, các trạng thái bảng láng giềng, đồng hồ lão hoá, ARP tự khai và giả mạo, proxy ARP, Neighbor Discovery và địa chỉ solicited-node, SLAAC, và vì sao chặn ICMPv6 phá hỏng IPv6. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('A packet crosses three links to reach a server. How many destination MAC addresses and how many destination IP addresses appear?|||Một gói tin đi qua ba đường link để tới máy chủ. Có bao nhiêu địa chỉ MAC đích và bao nhiêu địa chỉ IP đích xuất hiện?',
        ['One MAC, one IP|||Một MAC, một IP', 'Three MACs, one IP|||Ba MAC, một IP', 'One MAC, three IPs|||Một MAC, ba IP', 'Three MACs, three IPs|||Ba MAC, ba IP'],
        1,
        'Every router throws away the incoming frame entirely and builds a new one for the next link, so there is a fresh MAC pair on each of the three links. The IP pair is written once by the sender and never touched again — that is exactly what makes an IP address globally meaningful, and it is why each device only needs the MAC of the NEXT device, never of the final one.|||Mọi router đều vứt sạch cái khung vừa nhận rồi dựng một cái mới cho chặng kế tiếp, nên mỗi trong ba đường link có một cặp MAC mới. Cặp IP được bên gửi ghi một lần rồi không ai đụng tới nữa — đó chính là thứ làm cho một địa chỉ IP có nghĩa toàn cầu, và là lý do mỗi thiết bị chỉ cần MAC của thiết bị KẾ TIẾP, không bao giờ cần của thiết bị cuối cùng.'),

      q('Your host is 10.0.0.42/24 and sends to 8.8.8.8. Whose MAC address does it ARP for?|||Máy bạn là 10.0.0.42/24 và gửi tới 8.8.8.8. Nó ARP hỏi MAC của ai?',
        ['8.8.8.8|||8.8.8.8', 'Its default gateway|||Cổng ra mặc định của nó', 'The DNS server|||Máy chủ DNS', 'Nobody — it broadcasts the packet|||Không ai — nó quảng bá gói tin đi'],
        1,
        'The AND test says 8.8.8.8 is not on this subnet, so the host needs the gateway to forward for it. It cannot ARP for 8.8.8.8 even in principle, because an ARP request is a broadcast and broadcasts do not cross routers. The resulting frame carries the router MAC and the 8.8.8.8 IP — two destinations, two machines, one packet.|||Phép AND cho biết 8.8.8.8 không nằm trong subnet này, nên máy cần cổng ra chuyển tiếp hộ. Nó không thể ARP hỏi 8.8.8.8 kể cả về nguyên tắc, vì lời hỏi ARP là gói quảng bá mà quảng bá thì không qua được router. Cái khung sinh ra mang MAC của router và IP 8.8.8.8 — hai cái đích, hai cỗ máy, một gói tin.'),

      q('Why is an ARP request a broadcast but an ARP reply a unicast?|||Vì sao lời hỏi ARP là quảng bá mà lời đáp ARP lại là unicast?',
        ['Replies are less important|||Lời đáp kém quan trọng hơn', 'The request has no address to aim at; the reply learned one from the request|||Lời hỏi không có địa chỉ nào để nhắm tới; lời đáp đã học được địa chỉ từ chính lời hỏi', 'Switches convert broadcasts into unicasts|||Switch chuyển quảng bá thành unicast', 'It is an arbitrary choice in the standard|||Đó là lựa chọn tuỳ tiện trong tiêu chuẩn'],
        1,
        'The unknown MAC address is the whole point of the question, so there is no address to send the question to except the broadcast address. But the request carries the sender MAC and sender IP, so the answering machine knows exactly who asked and replies directly. One broadcast is unavoidable; a second one would be pure waste — and both caches end up populated by that single round trip.|||Cái địa chỉ MAC chưa biết chính là toàn bộ nội dung câu hỏi, nên không có địa chỉ nào để gửi câu hỏi tới ngoài địa chỉ quảng bá. Nhưng lời hỏi có mang theo MAC nguồn và IP nguồn, nên cỗ máy trả lời biết chính xác ai vừa hỏi và đáp thẳng về. Một gói quảng bá là không tránh được; gói thứ hai sẽ là lãng phí thuần tuý — và cả hai bộ đệm đều được điền chỉ nhờ một vòng hỏi đáp đó.'),

      q('What is in the Target MAC field of an ARP request?|||Trường Target MAC trong một lời hỏi ARP chứa gì?',
        ['The broadcast address FF:FF:FF:FF:FF:FF', 'All zeros — it is the unknown being asked about|||Toàn số 0 — đó chính là cái chưa biết đang được hỏi', 'The sender\'s own MAC|||MAC của chính bên gửi', 'The gateway\'s MAC|||MAC của cổng ra'],
        1,
        'The field is literally the blank being filled in. The broadcast address appears in the Ethernet header, not in the ARP message, and the two are frequently confused. An all-zero Target MAC is how you recognise a request rather than a reply when reading a capture — the opcode says the same thing, but the zeros are easier to spot.|||Cái trường đó đúng nghĩa là chỗ trống đang cần điền. Địa chỉ quảng bá xuất hiện ở phần đầu Ethernet chứ không phải trong thông điệp ARP, và hai thứ đó hay bị lẫn. Target MAC toàn số 0 là cách bạn nhận ra một lời hỏi chứ không phải lời đáp khi đọc bản bắt gói — trường opcode cũng nói điều đó, nhưng mấy số 0 thì dễ thấy hơn.'),

      q('ip neigh shows your gateway as STALE. What should you do?|||ip neigh hiện cổng ra của bạn ở trạng thái STALE. Bạn nên làm gì?',
        ['Flush the cache immediately|||Xoá bộ đệm ngay lập tức', 'Nothing — STALE is the normal resting state of a working entry|||Không làm gì — STALE là trạng thái nghỉ bình thường của một dòng đang chạy tốt', 'Restart the network service|||Khởi động lại dịch vụ mạng', 'Replace the network cable|||Thay dây mạng'],
        1,
        'STALE means known but not confirmed in about the last thirty seconds, which is exactly what a healthy entry looks like on a link that has been quiet. It will be re-verified the moment it is used. The state that indicates a real fault is FAILED — we asked repeatedly and nobody answered — and the IP address beside it names the machine that is actually missing.|||STALE nghĩa là đã biết nhưng chưa xác nhận lại trong khoảng ba mươi giây qua, và đó đúng là dáng vẻ của một dòng khoẻ mạnh trên đường link vừa im ắng. Nó sẽ được kiểm lại ngay khi có người dùng tới. Trạng thái báo hiệu lỗi thật là FAILED — ta đã hỏi nhiều lần và không ai đáp — và địa chỉ IP bên cạnh nó gọi tên cỗ máy thật sự đang mất tích.'),

      q('What makes ARP spoofing possible?|||Điều gì làm cho giả mạo ARP trở nên khả thi?',
        ['A bug in Windows|||Một lỗi trong Windows', 'ARP has no authentication — any reply is believed, requested or not|||ARP không có xác thực — mọi lời đáp đều được tin, dù có ai hỏi hay không', 'Switches forward ARP incorrectly|||Switch chuyển tiếp ARP sai cách', 'Weak encryption in the ARP header|||Mã hoá yếu trong phần đầu ARP'],
        1,
        'There is no signature field, no notion of who may claim an address, and no check that a reply matches a request — which is also precisely what makes gratuitous ARP work for failover. The same property serves both purposes. Because the weakness is in the protocol, the defence has to live on the switch: ip dhcp snooping plus ip arp inspection, which validate every ARP against the DHCP binding table.|||Không có trường chữ ký, không có khái niệm ai được phép nhận một địa chỉ, và không có phép kiểm xem lời đáp có khớp lời hỏi nào không — mà đó cũng chính là thứ làm cho gratuitous ARP dùng được cho chuyển dự phòng. Cùng một tính chất phục vụ cả hai mục đích. Vì điểm yếu nằm trong giao thức nên cách phòng vệ buộc phải nằm ở con switch: ip dhcp snooping cộng ip arp inspection, thứ đối chiếu mọi gói ARP với bảng cấp phát DHCP.'),

      q('Two different IPs in your ARP table share one MAC address. What can you conclude?|||Hai IP khác nhau trong bảng ARP của bạn dùng chung một địa chỉ MAC. Bạn kết luận được gì?',
        ['It is definitely an attack|||Chắc chắn là một cuộc tấn công', 'It needs explaining — spoofing, proxy ARP, or one server holding several IPs|||Cần phải giải thích được — giả mạo, proxy ARP, hoặc một máy chủ giữ nhiều IP', 'It is always normal|||Luôn luôn là bình thường', 'The ARP table is corrupt|||Bảng ARP bị hỏng'],
        1,
        'All three explanations produce the identical pattern, so the pattern alone proves nothing. WHICH addresses are involved is what decides: several service IPs on one server or a load balancer is routine, while your default gateway sharing a MAC with a colleague\'s workstation is an attack. Proxy ARP is the middle case and usually indicates a wrong subnet mask being papered over.|||Cả ba cách giải thích đều đẻ ra đúng một dáng vẻ, nên bản thân cái dáng vẻ đó không chứng minh gì. Chính việc NHỮNG địa chỉ nào dính vào mới là thứ quyết định: vài IP dịch vụ trên một máy chủ hay một bộ cân bằng tải là chuyện thường ngày, còn cổng ra mặc định của bạn dùng chung MAC với máy trạm của đồng nghiệp thì là tấn công. Proxy ARP là trường hợp ở giữa và thường cho thấy một mặt nạ mạng đặt sai đang bị che đi.'),

      q('Which ICMPv6 message replaces the ARP request?|||Thông điệp ICMPv6 nào thay thế lời hỏi ARP?',
        ['Router Solicitation, type 133', 'Neighbor Solicitation, type 135', 'Neighbor Advertisement, type 136', 'Echo Request, type 128'],
        1,
        'Neighbor Solicitation (135) asks and Neighbor Advertisement (136) answers, matching ARP request and reply. Router Solicitation and Advertisement (133 and 134) do something ARP never could: find the default gateway, which is why IPv6 hosts need no gateway setting at all.|||Neighbor Solicitation (135) đi hỏi và Neighbor Advertisement (136) trả lời, khớp với lời hỏi và lời đáp ARP. Router Solicitation và Advertisement (133 và 134) làm một việc mà ARP không bao giờ làm được: tìm cổng ra mặc định, và đó là lý do máy IPv6 hoàn toàn không cần ô cấu hình cổng ra nào.'),

      q('What is the solicited-node multicast address for 2001:db8:1::abc:1234?|||Địa chỉ multicast solicited-node của 2001:db8:1::abc:1234 là gì?',
        ['ff02::1', 'ff02::1:ffbc:1234', 'ff02::abc:1234', 'ff02::2'],
        1,
        'Take the last 24 bits of the target — the address ends 0abc:1234, so the last 24 bits are bc:1234 — and append them to the fixed prefix ff02::1:ff00:0/104. The common errors are taking 16 or 32 bits; it is always exactly 24. ff02::1 is all-nodes and ff02::2 is all-routers, which are different groups entirely.|||Lấy 24 bit cuối của địa chỉ đích — địa chỉ kết thúc bằng 0abc:1234, nên 24 bit cuối là bc:1234 — rồi gắn vào tiền tố cố định ff02::1:ff00:0/104. Lỗi hay gặp là lấy 16 hoặc 32 bit; luôn luôn là đúng 24. Còn ff02::1 là nhóm tất-cả-node và ff02::2 là nhóm tất-cả-router, hai nhóm hoàn toàn khác.'),

      q('Why does IPv6 use a multicast group instead of a broadcast to ask for a MAC address?|||Vì sao IPv6 dùng một nhóm multicast thay vì quảng bá để đi hỏi một địa chỉ MAC?',
        ['Broadcast does not exist in Ethernet|||Ethernet không có khái niệm quảng bá', 'So that usually only one NIC is interrupted instead of every machine on the LAN|||Để thường chỉ một card mạng bị làm phiền thay vì mọi cỗ máy trên LAN', 'Because multicast is encrypted|||Vì multicast có mã hoá', 'To make the packet smaller|||Để gói tin nhỏ lại'],
        1,
        'An ARP broadcast is accepted by every NIC on the segment and passed up to software, so on a 500-host LAN 499 machines are interrupted for nothing. The solicited-node group is built from 24 bits of the target address, so membership is normally exactly one. Same function, roughly one five-hundredth of the disturbance — the clearest example in the course of a protocol redesigned from operational experience.|||Một gói ARP quảng bá bị mọi card mạng trên đoạn mạng nhận rồi đẩy lên phần mềm, nên trên một LAN 500 máy thì 499 máy bị làm phiền vô ích. Nhóm solicited-node được dựng từ 24 bit của địa chỉ đích, nên số thành viên bình thường đúng bằng một. Cùng một chức năng, mức quấy rầy chỉ khoảng một phần năm trăm — ví dụ rõ nhất trong cả môn về một giao thức được thiết kế lại từ kinh nghiệm vận hành.'),

      q('Where does an IPv6 host get its default gateway from?|||Máy IPv6 lấy cổng ra mặc định từ đâu?',
        ['DHCPv6 only|||Chỉ từ DHCPv6', 'A Router Advertisement, ICMPv6 type 134|||Từ một Router Advertisement, ICMPv6 loại 134', 'It must be typed by hand|||Phải gõ bằng tay', 'From the DNS server|||Từ máy chủ DNS'],
        1,
        'The router announces itself and the on-link prefix in an RA, and the host builds its own address from that prefix — SLAAC, stateless because no server records who got what. The gateway address is normally link-local, fe80::something, which surprises people but is correct: a gateway is a neighbour. The security consequence is that anyone who can attach to your LAN can send RAs and become the gateway, which is why switches offer RA Guard.|||Router tự khai mình và khai tiền tố đang dùng trên link trong một gói RA, rồi máy trạm tự dựng địa chỉ của mình từ tiền tố đó — SLAAC, gọi là stateless vì không máy chủ nào ghi lại ai nhận cái gì. Địa chỉ cổng ra thường là link-local, fe80::gì đó, điều này làm người ta ngạc nhiên nhưng nó đúng: cổng ra là một hàng xóm. Hệ quả bảo mật là ai cắm được vào LAN của bạn cũng gửi RA được và thành cổng ra, và đó là lý do switch có tính năng RA Guard.'),

      q('You block all ICMP and ICMPv6 on a firewall. What breaks on IPv6 that does not break on IPv4?|||Bạn chặn hết ICMP và ICMPv6 trên tường lửa. Cái gì hỏng trên IPv6 mà không hỏng trên IPv4?',
        ['Nothing — the effect is the same|||Không có gì — tác động giống nhau', 'Address resolution itself, because Neighbor Discovery IS ICMPv6|||Chính việc phân giải địa chỉ, vì Neighbor Discovery CHÍNH LÀ ICMPv6', 'Only ping|||Chỉ mỗi ping', 'Only DNS|||Chỉ mỗi DNS'],
        1,
        'ARP sits outside IP with its own EtherType 0x0806, so blocking ICMP on IPv4 costs you ping and Path MTU Discovery while hosts still find each other. Neighbor Discovery is carried inside ICMPv6 as types 133 to 136, so blocking it stops hosts learning MAC addresses, finding the router and completing Duplicate Address Detection. IPv6 does not degrade — it stops, and copying an IPv4 firewall policy across is the usual way people discover this.|||ARP nằm ngoài IP với EtherType riêng 0x0806, nên chặn ICMP trên IPv4 chỉ làm bạn mất ping và Path MTU Discovery còn các máy vẫn tìm thấy nhau. Neighbor Discovery thì nằm trong ICMPv6 dưới dạng loại 133 tới 136, nên chặn nó là chặn luôn việc các máy học MAC của nhau, tìm router, và hoàn tất Duplicate Address Detection. IPv6 không kém đi — nó dừng hẳn, và chép một chính sách tường lửa IPv4 sang là cách người ta thường phát hiện ra điều này.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 8 — Address Resolution (FLM sessions 24–25)|||Chương 8 — Phân giải địa chỉ (buổi 24–25 của FLM)',
    slug: 'nwc204-chuong-8-phan-giai-dia-chi',
    description: 'Cisco Module 9 theo đúng buổi 24–25 của FLM: vì sao mỗi gói mang hai địa chỉ và chỉ một cái đi hết hành trình, đích cục bộ hay ở xa quyết định hỏi MAC của ai, cuộc trao đổi ARP hỏi-quảng-bá đáp-unicast, từng trường của thông điệp ARP, bảng ARP trên Linux và IOS cùng đồng hồ lão hoá, rồi Neighbor Discovery của IPv6 với NS/NA, địa chỉ multicast solicited-node, RS/RA và SLAAC, và phát hiện trùng địa chỉ. Kèm phần ★ bổ sung: năm trạng thái bảng láng giềng trên Linux, ARP tự khai, phát hiện giả mạo ARP, proxy ARP, và chẩn đoán một mạng LAN chỉ bằng bảng láng giềng. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
