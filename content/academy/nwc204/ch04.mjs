/**
 * NWC204 · Chapter 4 — The Physical Layer (Cisco Module 4).
 * FLM buổi 11–12 (lý thuyết) + buổi 13–14 (Lab 1.3).
 *
 * Slide: scripts/slides-src/nwc204-ch04.mjs → deck 'nwc204-ch04', 23 ảnh.
 * Slide viết hoàn toàn bằng tiếng Anh; phần giảng song ngữ nằm dưới mỗi ảnh.
 *
 * ⚠️ File này CHỈ chứa chương 4. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch04', {
  code: 'NWC204',
  en: 'The Physical Layer',
  vi: 'Tầng vật lý',
  total: 23,
});

/* ──────────────────────── Lesson 4.1 — session 11 ──────────────────────── */

const L1 = {
  title: '4.1 — Purpose, characteristics and copper cabling (FLM session 11)|||4.1 — Mục đích, đặc tính của tầng vật lý và cáp đồng (buổi 11 của FLM)',
  slug: 'nwc204-4-1-tang-vat-ly-va-cap-dong',
  type: 'DOCUMENT',
  description: 'Buổi 11: tầng vật lý làm gì, ba thành phần và ba chỗ hỏng, ai chuẩn hoá tầng 1, phân biệt bandwidth / throughput / goodput / latency, mã hoá tín hiệu NRZ và Manchester, ba loại cáp đồng và ba thứ phá hỏng tín hiệu đồng.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 4 · Lesson 4.1 · FLM session 11 of 60 · CLO4, CLO9 · Cisco Module 4</span>
<h2>The layer with no addresses, and the one that costs you the most time</h2>
<p class="lead">Every layer above this one can be fixed by typing. This one cannot: it is voltage, light, radio and a connector that either fits or does not. It is also where the majority of real outages start.</p>
<p><strong>Opening question:</strong> a 1 Gbps link between two switches shows "up" and passes ping, but a file copy runs at 3 MB/s and the users complain daily. Nothing in any log. Which single command would you run first, and what number in its output decides the case?</p>`,
      `<span class="eyebrow">NWC204 · Chương 4 · Bài 4.1 · Buổi 11/60 của FLM · CLO4, CLO9 · Cisco Module 4</span>
<h2>Tầng không có địa chỉ nào, và cũng là tầng ngốn thời gian của bạn nhiều nhất</h2>
<p class="lead">Mọi tầng phía trên đều sửa được bằng cách gõ phím. Tầng này thì không: nó là điện áp, ánh sáng, sóng và một cái đầu nối hoặc vừa hoặc không vừa. Nó cũng là nơi phần lớn sự cố thật bắt đầu.</p>
<p><strong>Câu hỏi mở đầu:</strong> một đường 1 Gbps giữa hai switch báo "up", ping thông, nhưng chép file chỉ được 3 MB/s và ngày nào người dùng cũng kêu. Log không có gì. Bạn sẽ gõ lệnh nào trước tiên, và con số nào trong kết xuất của nó quyết định vụ này?</p>`,
    ),

    walkHead('nwc204-ch04', 1, 10,
      'Slides 1–10 cover FLM session 11: 4.1 Purpose of the Physical Layer, 4.2 Physical Layer Characteristics and 4.3 Copper Cabling.',
      'Slide 1–10 là buổi 11 của FLM: 4.1 Purpose of the Physical Layer, 4.2 Physical Layer Characteristics và 4.3 Copper Cabling.'),

    walk('nwc204-ch04', [
      [1, 'Cover — Chapter 4, the Physical Layer',
        `<p>Chapter 4 of the course is <strong>Cisco Module 4</strong>, and FPT gives it four sessions: 11 and 12 for theory, 13 and 14 for Lab 1.3.</p>
<ul>
<li>Session 11 — 4.1 Purpose of the Physical Layer, 4.2 Physical Layer Characteristics, 4.3 Copper Cabling.</li>
<li>Session 12 — 4.4 UTP Cabling, 4.5 Fibre-Optic Cabling, 4.6 Wireless Media.</li>
<li>Sessions 13–14 — Lab 1.3: view wired and wireless NIC information.</li>
<li>Outcomes: <strong>CLO4</strong> (explain how data travels over media) and <strong>CLO9</strong> (use AI tools to explain concepts).</li>
</ul>
<p>Note the syllabus spells it "Fiber-Optic"; both spellings mean the same standard, ITU-T G.652 and G.651.</p>`,
        `<p>Chương 4 của môn chính là <strong>Module 4 của Cisco</strong>, và trường xếp bốn buổi: buổi 11 và 12 học lý thuyết, buổi 13 và 14 làm Lab 1.3.</p>
<ul>
<li>Buổi 11 — 4.1 Purpose of the Physical Layer, 4.2 Physical Layer Characteristics, 4.3 Copper Cabling.</li>
<li>Buổi 12 — 4.4 UTP Cabling, 4.5 Fibre-Optic Cabling, 4.6 Wireless Media.</li>
<li>Buổi 13–14 — Lab 1.3: xem thông tin card mạng có dây và không dây.</li>
<li>Chuẩn đầu ra: <strong>CLO4</strong> (giải thích dữ liệu đi trên môi trường truyền thế nào) và <strong>CLO9</strong> (dùng công cụ AI giải thích khái niệm).</li>
</ul>
<p>Syllabus viết "Fiber-Optic" theo lối Mỹ; hai cách viết cùng chỉ một chuẩn, ITU-T G.652 và G.651.</p>`],

      [2, 'Where encapsulation finally ends',
        `<p>Chapter 3 finished with a frame. The physical layer is what turns that finished frame into something a wire can carry.</p>
<ul>
<li>It accepts a complete frame from the data link layer and <strong>encodes it into signals</strong>: voltage on copper, light on fibre, a modulated wave on radio.</li>
<li>At the far end it does the reverse and hands a bit stream back up.</li>
<li>It carries <strong>no addresses at all</strong>. It has never heard of a MAC or an IP; it only answers "did this bit arrive as a 1 or a 0?".</li>
<li>That is why a physical fault produces no error message anywhere above it — nothing up there was told.</li>
</ul>
<p>Everything in this chapter is therefore about limits, not logic: how far, how fast, how noisy, and what breaks first.</p>`,
        `<p>Chương 3 kết thúc ở một cái khung. Tầng vật lý là thứ biến cái khung đã hoàn chỉnh đó thành cái mà sợi dây chở được.</p>
<ul>
<li>Nó nhận một khung trọn vẹn từ tầng liên kết dữ liệu và <strong>mã hoá thành tín hiệu</strong>: điện áp trên cáp đồng, ánh sáng trên cáp quang, sóng điều chế trên vô tuyến.</li>
<li>Ở đầu kia nó làm ngược lại và trả một dòng bit lên trên.</li>
<li>Nó <strong>không mang địa chỉ nào cả</strong>. Nó chưa từng nghe nói tới MAC hay IP; nó chỉ trả lời câu "bit này tới nơi là 1 hay là 0?".</li>
<li>Vì thế một lỗi vật lý không sinh ra thông báo lỗi nào ở các tầng trên — không ai ở trên được báo cả.</li>
</ul>
<p>Cho nên cả chương này nói về giới hạn, không nói về logic: xa bao nhiêu, nhanh bao nhiêu, nhiễu tới đâu, và cái gì hỏng trước.</p>`],

      [3, 'Three components, three failure points',
        `<p>The physical layer is made of exactly three things, and every "link down" is one of them.</p>
<ul>
<li><strong>NIC</strong> — the network interface card. It encodes bits into signals and negotiates <em>speed</em> and <em>duplex</em> with the far end.</li>
<li><strong>Connector</strong> — RJ-45 for copper, LC or SC for fibre. This is the commonest physical fault: a crimp that is loose, wrong or bent.</li>
<li><strong>Media</strong> — the cable or the air. Always has a hard distance limit.</li>
</ul>
<p>The discipline that saves hours: <strong>swap one at a time</strong>. Change the cable and the port together and you will never know which one it was, and you will meet the same fault again next month.</p>`,
        `<p>Tầng vật lý gồm đúng ba thứ, và mọi vụ "link down" đều là một trong ba thứ đó.</p>
<ul>
<li><strong>NIC</strong> — card mạng. Nó mã hoá bit thành tín hiệu và <em>thương lượng</em> tốc độ và chế độ song công với đầu kia.</li>
<li><strong>Đầu nối</strong> — RJ-45 cho cáp đồng, LC hoặc SC cho cáp quang. Đây là lỗi vật lý phổ biến nhất: một mối bấm lỏng, sai hoặc cong.</li>
<li><strong>Môi trường truyền</strong> — sợi cáp hoặc không khí. Luôn có giới hạn khoảng cách cứng.</li>
</ul>
<p>Kỷ luật giúp bạn tiết kiệm hàng giờ: <strong>thay từng thứ một</strong>. Đổi cả dây lẫn cổng cùng lúc thì bạn sẽ không bao giờ biết thủ phạm là cái nào, và tháng sau sẽ gặp lại đúng lỗi đó.</p>`],

      [4, 'Who standardises Layer 1',
        `<p>Layer 1 is the only layer with a <em>mechanical</em> standard. A connector that does not fit has no software workaround.</p>
<ul>
<li><strong>ISO/IEC 11801</strong> — generic structured cabling for buildings.</li>
<li><strong>IEEE 802.3</strong> and <strong>802.11</strong> — Ethernet and Wi-Fi: signalling, speeds, timing.</li>
<li><strong>TIA-568</strong> — UTP categories, the RJ-45 pinout, and the T568A / T568B colour orders you will meet on slide 13.</li>
<li><strong>ITU-T G.652 / G.651</strong> — single-mode and multimode optical fibre.</li>
<li><strong>ANSI</strong> — Fibre Channel, used for storage networking.</li>
</ul>
<p>For Lab 1.2 you had to cite a standard. Here they stop being trivia: TIA-568 is the document that decides whether your hand-made patch cable works at gigabit speed.</p>`,
        `<p>Tầng 1 là tầng duy nhất có chuẩn <em>cơ khí</em>. Một đầu nối không vừa thì không có cách nào lách bằng phần mềm.</p>
<ul>
<li><strong>ISO/IEC 11801</strong> — chuẩn cáp có cấu trúc chung cho toà nhà.</li>
<li><strong>IEEE 802.3</strong> và <strong>802.11</strong> — Ethernet và Wi-Fi: tín hiệu, tốc độ, thời điểm.</li>
<li><strong>TIA-568</strong> — phân loại cáp UTP, sơ đồ chân RJ-45, và thứ tự màu T568A / T568B mà bạn sẽ gặp ở slide 13.</li>
<li><strong>ITU-T G.652 / G.651</strong> — cáp quang đơn mode và đa mode.</li>
<li><strong>ANSI</strong> — Fibre Channel, dùng cho mạng lưu trữ.</li>
</ul>
<p>Ở Lab 1.2 bạn phải trích một chuẩn. Tới đây chúng thôi là chuyện vặt: TIA-568 chính là tài liệu quyết định sợi dây bạn tự bấm có chạy được ở tốc độ gigabit hay không.</p>`],

      [5, 'Four numbers people confuse',
        `<p>Four words that sound similar and mean completely different things. Exam questions live here, and so do arguments with users.</p>
<ul>
<li><strong>Bandwidth</strong> — the capacity the medium and NIC are <em>rated</em> for. A property of the equipment, not of today.</li>
<li><strong>Throughput</strong> — what you actually measure right now. Always lower: shared links, collisions, distance, duplex mismatch.</li>
<li><strong>Goodput</strong> — throughput minus protocol overhead and retransmissions. The bytes of your file, and nothing else.</li>
<li><strong>Latency</strong> — the delay for one bit to make the trip. <em>Independent</em> of the other three.</li>
</ul>
<p>The last point is the one people miss. A fibre to another continent has enormous bandwidth and about 150 ms of unavoidable delay, because light takes that long. No upgrade removes it.</p>`,
        `<p>Bốn từ nghe giống nhau nhưng nghĩa hoàn toàn khác nhau. Câu hỏi thi nằm ở đây, và các cuộc cãi nhau với người dùng cũng vậy.</p>
<ul>
<li><strong>Bandwidth (băng thông)</strong> — sức chở mà môi trường và card mạng được <em>định mức</em>. Đây là tính chất của thiết bị, không phải của hôm nay.</li>
<li><strong>Throughput (thông lượng)</strong> — con số bạn đo được ngay lúc này. Luôn thấp hơn: đường dùng chung, xung đột, khoảng cách, lệch duplex.</li>
<li><strong>Goodput</strong> — thông lượng trừ đi phần tiêu đề giao thức và phần gửi lại. Chỉ còn đúng số byte của file bạn cần.</li>
<li><strong>Latency (độ trễ)</strong> — thời gian một bit đi hết quãng đường. <em>Độc lập</em> với ba thứ trên.</li>
</ul>
<p>Điểm cuối là chỗ người ta hay bỏ sót. Một sợi quang sang châu lục khác có băng thông khổng lồ và khoảng 150 ms độ trễ không thể bỏ, vì ánh sáng đi hết chừng ấy thời gian. Không bản nâng cấp nào xoá được nó.</p>`],

      [6, 'Reading the units without being fooled',
        `<p>Half of all "the internet is slow" tickets are solved by this slide alone.</p>
<ul>
<li><strong>bps</strong> means bits per second. <strong>Bps</strong>, with a capital B, means <em>bytes</em> per second — eight times larger.</li>
<li>Link speeds and ISP contracts are quoted in bits: 100 Mbps, 1 Gbps.</li>
<li>Download managers show bytes: 12 MB/s.</li>
<li>So a perfect 100 Mbps line copies at about <strong>12.5 MB/s</strong> at best, before any overhead.</li>
<li><code>ping</code> reports latency as a <em>round trip</em>, not one way. Half of the value is the one-way delay.</li>
</ul>
<p>Before you escalate anything, divide by eight. A user reporting "only 12 megabytes per second on a 100 meg line" is reporting a line that works perfectly.</p>`,
        `<p>Một nửa số phiếu báo "mạng chậm" được giải quyết chỉ bằng slide này.</p>
<ul>
<li><strong>bps</strong> là bit trên giây. <strong>Bps</strong> với chữ B hoa là <em>byte</em> trên giây — lớn gấp tám lần.</li>
<li>Tốc độ đường truyền và hợp đồng nhà mạng đều ghi theo bit: 100 Mbps, 1 Gbps.</li>
<li>Trình tải file lại hiện theo byte: 12 MB/s.</li>
<li>Nên một đường 100 Mbps hoàn hảo chép được khoảng <strong>12,5 MB/s</strong> là kịch trần, còn chưa trừ phần tiêu đề.</li>
<li><code>ping</code> báo độ trễ <em>khứ hồi</em>, không phải một chiều. Một nửa con số đó mới là độ trễ một chiều.</li>
</ul>
<p>Trước khi báo lên cấp trên, hãy chia cho tám. Người dùng kêu "đường 100 meg mà chỉ được 12 megabyte một giây" đang mô tả một đường truyền chạy hoàn hảo.</p>`],

      [7, 'Encoding: how a bit becomes a signal',
        `<p>Encoding is the agreed pattern that represents a 1 and a 0 on the medium. The slide compares the two classic schemes on the same five bits.</p>
<ul>
<li><strong>NRZ</strong> (non-return to zero) — high voltage is 1, low voltage is 0. Simple and efficient.</li>
<li>Its weakness: a long run of identical bits gives the receiver <em>no edge</em> to synchronise its clock on, and the two ends drift apart.</li>
<li><strong>Manchester</strong> — every bit has a transition in the middle: low-to-high is a 1, high-to-low is a 0 (the IEEE 802.3 convention).</li>
<li>The receiver recovers the clock from the data itself, at the cost of <em>twice</em> the signalling rate for the same data rate.</li>
</ul>
<p>Modern gigabit Ethernet uses more advanced schemes (4D-PAM5, 64B/66B), but the trade-off never changes: clock recovery versus efficiency.</p>`,
        `<p>Mã hoá là mẫu tín hiệu đã thoả thuận để biểu diễn bit 1 và bit 0 trên môi trường truyền. Slide so sánh hai sơ đồ kinh điển trên cùng năm bit.</p>
<ul>
<li><strong>NRZ</strong> (non-return to zero) — mức cao là 1, mức thấp là 0. Đơn giản và tiết kiệm.</li>
<li>Điểm yếu: một chuỗi dài các bit giống nhau khiến bên nhận <em>không có cạnh nào</em> để đồng bộ đồng hồ, và hai đầu trôi lệch nhau.</li>
<li><strong>Manchester</strong> — mỗi bit đều có một lần chuyển mức ở giữa: thấp lên cao là 1, cao xuống thấp là 0 (quy ước của IEEE 802.3).</li>
<li>Bên nhận khôi phục được đồng hồ từ chính dữ liệu, cái giá là tốc độ phát tín hiệu phải <em>gấp đôi</em> so với cùng tốc độ dữ liệu.</li>
</ul>
<p>Ethernet gigabit ngày nay dùng sơ đồ tinh vi hơn (4D-PAM5, 64B/66B), nhưng sự đánh đổi thì không bao giờ đổi: khôi phục đồng hồ đấu với hiệu suất.</p>`],

      [8, 'Three kinds of copper cable',
        `<p>Copper is cheap, easy to terminate in the field and carries power (PoE). That is why it still owns the last 100 metres.</p>
<ul>
<li><strong>UTP</strong> — unshielded twisted pair, four pairs, 100 m. Almost every desk drop in the world.</li>
<li><strong>STP</strong> — the same but with a foil or braid shield. Used near motors, welding gear and industrial plant.</li>
<li><strong>Coaxial</strong> — one central core inside a braided shield. Cable modems, antenna feeds, CCTV; hundreds of metres.</li>
</ul>
<p>Two facts worth remembering. The 100 m limit is not only attenuation — it is also the timing budget Ethernet needs. And a shield only helps when it is <strong>grounded at the correct end</strong>: an ungrounded shield is an antenna, so bad STP is worse than good UTP.</p>`,
        `<p>Cáp đồng rẻ, dễ bấm tại chỗ và chở được cả nguồn điện (PoE). Vì vậy nó vẫn chiếm giữ 100 mét cuối cùng.</p>
<ul>
<li><strong>UTP</strong> — cáp xoắn đôi không bọc chống nhiễu, bốn đôi, 100 m. Gần như mọi đường cáp xuống bàn làm việc trên thế giới.</li>
<li><strong>STP</strong> — vẫn vậy nhưng có thêm lớp lá hoặc lưới chống nhiễu. Dùng gần động cơ, máy hàn và nhà xưởng.</li>
<li><strong>Cáp đồng trục</strong> — một lõi giữa nằm trong lớp lưới chống nhiễu. Modem cáp, dây ăng-ten, camera; đi được hàng trăm mét.</li>
</ul>
<p>Hai điều đáng nhớ. Giới hạn 100 m không chỉ do suy hao — nó còn là quỹ thời gian mà Ethernet cần. Và lớp chống nhiễu chỉ có tác dụng khi được <strong>tiếp đất đúng đầu</strong>: lớp chống nhiễu không tiếp đất chính là một cái ăng-ten, nên STP làm ẩu còn tệ hơn UTP làm chuẩn.</p>`],

      [9, 'What actually damages a copper signal',
        `<p>Three named enemies, and they produce the same symptom: the link stays UP while the error counters climb.</p>
<ul>
<li><strong>Attenuation</strong> — the signal fades with distance until the receiver can no longer tell 1 from 0. This is the reason for the 100 m rule.</li>
<li><strong>EMI / RFI</strong> — motors, fluorescent lights, lifts and radios push noise onto the wire from outside.</li>
<li><strong>Crosstalk</strong> — one pair leaks into its neighbour <em>inside the same cable</em>. A bad crimp that untwists 3 cm of pair is the usual cause.</li>
</ul>
<p>Where to look: an <strong>interface counter</strong>, not a ping. Ping shows total loss; counters name the cause. Try, in order: shorten the run, re-terminate the plug, move away from the noise source, switch to fibre.</p>`,
        `<p>Ba kẻ thù có tên, và cả ba đều cho cùng một triệu chứng: đường truyền vẫn UP trong khi bộ đếm lỗi cứ tăng.</p>
<ul>
<li><strong>Suy hao (attenuation)</strong> — tín hiệu yếu dần theo khoảng cách cho tới khi bên nhận không phân biệt nổi 1 với 0. Đây chính là lý do của luật 100 m.</li>
<li><strong>EMI / RFI</strong> — động cơ, đèn huỳnh quang, thang máy và máy phát sóng đẩy nhiễu từ bên ngoài vào sợi dây.</li>
<li><strong>Xuyên âm (crosstalk)</strong> — một đôi dây rò sang đôi bên cạnh <em>ngay trong cùng sợi cáp</em>. Thủ phạm thường gặp là mối bấm ẩu làm tở xoắn mất 3 cm.</li>
</ul>
<p>Chỗ cần nhìn: <strong>bộ đếm của giao diện</strong>, không phải lệnh ping. Ping chỉ cho thấy tổng mức mất; bộ đếm mới gọi tên nguyên nhân. Hãy thử theo thứ tự: rút ngắn đường dây, bấm lại đầu, dời xa nguồn nhiễu, rồi mới chuyển sang cáp quang.</p>`],

      [10, 'Why twisting works at all',
        `<p>This is the single cleverest idea in copper cabling, and it is worth understanding rather than memorising.</p>
<ul>
<li>The two wires of a pair carry the <strong>same signal with opposite polarity</strong> — a differential pair.</li>
<li>Noise from outside hits both wires almost equally, because they are physically next to each other.</li>
<li>The receiver subtracts one wire from the other. The signal, being opposite, <em>doubles</em>; the noise, being identical, <em>cancels</em>.</li>
<li>Twisting makes "almost equally" into "equally": each wire spends the same amount of length nearer the noise source.</li>
</ul>
<p>So more twists per metre means better cancellation, which is exactly what separates Cat 5e from Cat 6 and Cat 6a. And it explains the crimping rule: <strong>keep the pairs twisted right up to the connector</strong>.</p>`,
        `<p>Đây là ý tưởng thông minh nhất trong ngành cáp đồng, và đáng để hiểu chứ không chỉ học thuộc.</p>
<ul>
<li>Hai sợi của một đôi mang <strong>cùng một tín hiệu nhưng ngược dấu</strong> — gọi là một đôi vi sai.</li>
<li>Nhiễu từ bên ngoài đánh vào cả hai sợi gần như bằng nhau, vì chúng nằm sát nhau về mặt vật lý.</li>
<li>Bên nhận lấy sợi này trừ sợi kia. Tín hiệu vì ngược dấu nên <em>gấp đôi</em>; nhiễu vì giống hệt nhau nên <em>triệt tiêu</em>.</li>
<li>Việc xoắn biến "gần như bằng nhau" thành "bằng nhau": mỗi sợi dành đúng chừng ấy chiều dài ở phía gần nguồn nhiễu.</li>
</ul>
<p>Vậy nên càng nhiều vòng xoắn trên một mét thì triệt nhiễu càng tốt, và đó đúng là thứ phân biệt Cat 5e với Cat 6 và Cat 6a. Nó cũng giải thích luật khi bấm đầu: <strong>giữ các đôi còn xoắn cho tới sát đầu nối</strong>.</p>`],
    ]),

    cq(10, [['CQ4.1',
      'What are the purpose and functions of the physical layer in the network?',
      'Mục đích và các chức năng của tầng vật lý trong mạng là gì?']]),

    bi(
      `<p class="note">Note on the source table: FLM lists CQ4.1 against <strong>session 10</strong>, which is "Lab 1.2 (continue)" and belongs to chapter 3. The question itself is about the physical layer, so it is answered here, where it fits. Reported, not corrected.</p>`,
      `<p class="note">Ghi chú về bảng gốc: FLM gán CQ4.1 cho <strong>buổi 10</strong>, vốn là "Lab 1.2 (continue)" và thuộc chương 3. Bản thân câu hỏi lại nói về tầng vật lý, nên nó được trả lời ở đây, nơi nó thật sự thuộc về. Chỉ nêu, không tự sửa bảng gốc.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Three facts, three commands. Run them on the machine you actually care about.</p>
<pre><code class="language-bash"># 1. What speed and duplex did the NIC negotiate?
ethtool eth0                     # Linux
ifconfig en0 | grep media        # macOS
networksetup -listallhardwareports

# 2. Are there physical errors, and are they still growing?
ip -s link show eth0             # read it twice, 60 seconds apart
watch -n 5 'ip -s link show eth0 | tail -4'

# 3. How long is the cable really, and does it still work shortened?
#    No command answers this - it is the one measurement you make with your hands.</code></pre>
<p>How to read the numbers:</p>
<pre><code class="language-plaintext">Speed: 1000Mb/s  Duplex: Full        -> healthy gigabit link
Speed: 100Mb/s   Duplex: Full        -> negotiated down: suspect a 2-pair crimp or a Cat 3 patch lead
Speed: 10Mb/s    Duplex: Half        -> almost always a damaged cable or a forced setting on one side
RX errors 0, dropped 0              -> layer 1 is clean; look higher up
RX errors growing every minute      -> attenuation, EMI or crosstalk: this is a cable problem
collisions > 0 on a switched port   -> duplex mismatch; one side is forced, the other auto-negotiates</code></pre>
<p>That answers the opening question: run <code>ethtool eth0</code> (or <code>ifconfig en0 | grep media</code>) and read <strong>Duplex</strong>. A gigabit link that negotiated <em>half</em> duplex, or a port showing late collisions, explains 3 MB/s perfectly — and no log will ever mention it.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Ba dữ kiện, ba lệnh. Hãy chạy trên đúng cái máy bạn quan tâm.</p>
<pre><code class="language-bash"># 1. Card mạng đã thương lượng ra tốc độ và duplex nào?
ethtool eth0                     # Linux
ifconfig en0 | grep media        # macOS
networksetup -listallhardwareports

# 2. Có lỗi vật lý không, và nó còn đang tăng không?
ip -s link show eth0             # đọc hai lần, cách nhau 60 giây
watch -n 5 'ip -s link show eth0 | tail -4'

# 3. Sợi cáp thật sự dài bao nhiêu, rút ngắn lại thì có chạy không?
#    Không lệnh nào trả lời được - đây là phép đo duy nhất bạn phải làm bằng tay.</code></pre>
<p>Cách đọc các con số:</p>
<pre><code class="language-plaintext">Speed: 1000Mb/s  Duplex: Full        -> đường gigabit khoẻ mạnh
Speed: 100Mb/s   Duplex: Full        -> bị tụt xuống: nghi mối bấm chỉ 2 đôi hoặc dây nhảy Cat 3
Speed: 10Mb/s    Duplex: Half        -> gần như luôn là cáp hỏng hoặc một bên bị ép cứng thiết lập
RX errors 0, dropped 0              -> tầng 1 sạch; hãy tìm ở tầng cao hơn
RX errors tăng mỗi phút             -> suy hao, EMI hoặc xuyên âm: đây là lỗi cáp
collisions > 0 trên cổng switch     -> lệch duplex; một bên ép cứng, bên kia tự thương lượng</code></pre>
<p>Đó chính là đáp án câu hỏi mở đầu: gõ <code>ethtool eth0</code> (hoặc <code>ifconfig en0 | grep media</code>) và đọc dòng <strong>Duplex</strong>. Một đường gigabit mà thương lượng ra <em>half</em> duplex, hoặc một cổng có late collision, giải thích hoàn hảo con số 3 MB/s — và sẽ không có dòng log nào nhắc tới nó.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Believing "up" means healthy.</strong> <em>Symptom:</em> ping succeeds, file copies crawl, nothing in any log. Link state only reports carrier. Speed, duplex and error counters are three separate facts you must read separately.</li>
<li><strong>Comparing bits with bytes.</strong> <em>Symptom:</em> a user escalates "we only get 12 MB/s on a 100 Mbps line". That line is at 100% of its rated capacity. Divide by eight before you open a ticket.</li>
<li><strong>Forcing speed and duplex on one side only.</strong> <em>Symptom:</em> the link comes up, works when idle, and collapses under load with late collisions. If you force one end, you must force the other; otherwise auto-negotiation on the far side falls back to half duplex.</li>
<li><strong>Untwisting the pairs at the connector.</strong> <em>Symptom:</em> a hand-made cable that links at 100 Mbps but never at 1 Gbps, or that passes a continuity tester and still drops frames. Continuity testers check that pin 1 reaches pin 1; they do not measure crosstalk.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Tin rằng "up" nghĩa là khoẻ.</strong> <em>Triệu chứng:</em> ping thông, chép file bò như rùa, log không có gì. Trạng thái link chỉ báo có sóng mang. Tốc độ, duplex và bộ đếm lỗi là ba dữ kiện riêng biệt mà bạn phải đọc riêng.</li>
<li><strong>Đem bit so với byte.</strong> <em>Triệu chứng:</em> người dùng báo lên "đường 100 Mbps mà chỉ được 12 MB/s". Đường đó đang chạy đúng 100% định mức. Hãy chia cho tám trước khi mở phiếu sự cố.</li>
<li><strong>Ép cứng tốc độ và duplex chỉ ở một bên.</strong> <em>Triệu chứng:</em> đường lên được, rỗi thì chạy tốt, tải nặng thì sập kèm late collision. Đã ép một đầu thì phải ép cả đầu kia; nếu không, bên tự thương lượng sẽ tụt về half duplex.</li>
<li><strong>Tở xoắn các đôi ở chỗ đầu nối.</strong> <em>Triệu chứng:</em> sợi dây tự bấm lên được 100 Mbps nhưng không bao giờ lên nổi 1 Gbps, hoặc qua được máy đo thông mạch mà vẫn rớt khung. Máy đo thông mạch chỉ kiểm chân 1 có tới chân 1 không; nó không đo xuyên âm.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> An ISP sells you "200 Mbps". What is the fastest a single file can arrive, in MB/s, ignoring overhead? What would you expect in practice, and why?</p>
<p><strong>2.</strong> For each symptom, name the most likely physical cause: (a) errors rise only when the factory machine next door starts; (b) errors rise on one 95 m run and not on the 20 m runs; (c) a cable passes a continuity test but never links above 100 Mbps.</p>
<p><strong>3.</strong> Why is Manchester encoding more robust than NRZ, and what does that robustness cost?</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> 200 Mbps ÷ 8 = <strong>25 MB/s</strong> as an absolute ceiling. In practice expect roughly 22–24 MB/s: TCP and IP headers, Ethernet headers and acknowledgements all consume capacity, so goodput is always below throughput, which is always below bandwidth.</p>
<p><strong>2.</strong> (a) EMI/RFI from the machine — external noise, correlated with the neighbour's shift. (b) Attenuation, possibly with crosstalk: 95 m plus patch leads is over the 100 m budget in practice. (c) Crosstalk from untwisted pairs at the plug, or pins 3 and 6 taken from different pairs — both pass continuity and both fail at gigabit.</p>
<p><strong>3.</strong> Manchester guarantees a transition in the middle of every bit, so the receiver can recover the clock from the data itself and never drifts, even on a long run of identical bits. The cost is that it needs two signal levels per bit, so the signalling rate is double the data rate — half the efficiency for the same medium.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Nhà mạng bán cho bạn gói "200 Mbps". Một file có thể về nhanh nhất là bao nhiêu MB/s, nếu bỏ qua phần tiêu đề? Thực tế bạn chờ đợi con số nào, và vì sao?</p>
<p><strong>2.</strong> Mỗi triệu chứng sau, hãy nêu nguyên nhân vật lý khả dĩ nhất: (a) lỗi chỉ tăng khi cái máy của xưởng bên cạnh khởi động; (b) lỗi tăng trên một đường dài 95 m mà không tăng trên các đường 20 m; (c) một sợi cáp qua được phép đo thông mạch nhưng không bao giờ lên quá 100 Mbps.</p>
<p><strong>3.</strong> Vì sao mã Manchester bền hơn NRZ, và sự bền đó phải trả giá bằng gì?</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> 200 Mbps ÷ 8 = <strong>25 MB/s</strong> là trần tuyệt đối. Thực tế nên chờ đợi khoảng 22–24 MB/s: tiêu đề TCP và IP, tiêu đề Ethernet và các gói báo nhận đều ăn vào sức chở, nên goodput luôn thấp hơn throughput, và throughput luôn thấp hơn bandwidth.</p>
<p><strong>2.</strong> (a) EMI/RFI từ cái máy đó — nhiễu ngoài, trùng với ca làm của hàng xóm. (b) Suy hao, có thể kèm xuyên âm: 95 m cộng dây nhảy là đã vượt quỹ 100 m trên thực tế. (c) Xuyên âm do tở xoắn ở đầu bấm, hoặc chân 3 và chân 6 lấy từ hai đôi khác nhau — cả hai đều qua được phép đo thông mạch và cả hai đều hỏng ở gigabit.</p>
<p><strong>3.</strong> Manchester bảo đảm có một lần chuyển mức ở giữa mỗi bit, nên bên nhận khôi phục được đồng hồ từ chính dữ liệu và không bao giờ trôi, kể cả khi gặp chuỗi dài các bit giống nhau. Cái giá là nó cần hai mức tín hiệu cho mỗi bit, nên tốc độ phát tín hiệu gấp đôi tốc độ dữ liệu — hiệu suất chỉ còn một nửa trên cùng môi trường truyền.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 4.2 — session 12 ──────────────────────── */

const L2 = {
  title: '4.2 — UTP, fibre-optic and wireless media (FLM session 12)|||4.2 — Cáp UTP, cáp quang và môi trường không dây (buổi 12 của FLM)',
  slug: 'nwc204-4-2-utp-cap-quang-va-khong-day',
  type: 'DOCUMENT',
  description: 'Buổi 12: phân loại cáp UTP, sơ đồ chân RJ-45, T568A so với T568B, ba loại dây straight-through / crossover / rollover, cấu tạo cáp quang, đơn mode so với đa mode, đầu nối quang, chuẩn 802.11 và cái giá của mạng không dây — kèm bảng so sánh toàn bộ môi trường truyền.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 4 · Lesson 4.2 · FLM session 12 of 60 · CLO4, CLO9 · Cisco Module 4</span>
<h2>Choosing the medium, and crimping the one you chose</h2>
<p class="lead">Session 11 explained the limits. This session is the catalogue: which cable, which connector, which colour order, and which standard is the one you cite when somebody disagrees.</p>
<p><strong>Opening question:</strong> you need a 400 m link between two buildings in a lightning-prone area, carrying 10 Gbps. Name the medium, the mode, and give two reasons that are not about speed.</p>`,
      `<span class="eyebrow">NWC204 · Chương 4 · Bài 4.2 · Buổi 12/60 của FLM · CLO4, CLO9 · Cisco Module 4</span>
<h2>Chọn môi trường truyền, và bấm đúng cái mình đã chọn</h2>
<p class="lead">Buổi 11 giải thích các giới hạn. Buổi này là cuốn danh mục: cáp nào, đầu nối nào, thứ tự màu nào, và chuẩn nào là thứ bạn đem ra trích khi có người phản đối.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn cần một đường 400 m giữa hai toà nhà ở vùng hay có sét, chở 10 Gbps. Hãy nêu môi trường truyền, loại mode, và hai lý do không liên quan tới tốc độ.</p>`,
    ),

    walkHead('nwc204-ch04', 11, 21,
      'Slides 11–21 cover FLM session 12: 4.4 UTP Cabling, 4.5 Fibre-Optic Cabling and 4.6 Wireless Media.',
      'Slide 11–21 là buổi 12 của FLM: 4.4 UTP Cabling, 4.5 Fibre-Optic Cabling và 4.6 Wireless Media.'),

    walk('nwc204-ch04', [
      [11, 'UTP categories — what each one buys you',
        `<p>The category tells you the <strong>bandwidth in MHz</strong> the cable is certified for; the speed follows from that plus the Ethernet standard in use.</p>
<ul>
<li><strong>Cat 3</strong> — 16 MHz, 10 Mbps. Telephone. You will only meet it in old buildings.</li>
<li><strong>Cat 5</strong> — 100 MHz, 100 Mbps. Obsolete; do not install it.</li>
<li><strong>Cat 5e</strong> — 100 MHz but tighter crosstalk limits, so 1 Gbps to 100 m. The practical office minimum.</li>
<li><strong>Cat 6</strong> — 250 MHz, 1 Gbps to 100 m and 10 Gbps only to 55 m.</li>
<li><strong>Cat 6a</strong> — 500 MHz, <strong>10 Gbps to the full 100 m</strong>. This is the row that matters for new builds.</li>
<li><strong>Cat 7 / 7a</strong> — shielded, 600–1000 MHz, niche. <strong>Cat 8</strong> — 2000 MHz, 25–40 Gbps but only 30 m: rack to rack.</li>
</ul>
<p>Note that "5e" and "6" share the same 100 m reach. You buy a higher category for headroom and noise margin, not for distance.</p>`,
        `<p>Category cho biết <strong>băng thông tính bằng MHz</strong> mà sợi cáp được chứng nhận; tốc độ là hệ quả của con số đó cộng với chuẩn Ethernet đang dùng.</p>
<ul>
<li><strong>Cat 3</strong> — 16 MHz, 10 Mbps. Cáp điện thoại. Chỉ gặp trong nhà cũ.</li>
<li><strong>Cat 5</strong> — 100 MHz, 100 Mbps. Đã lỗi thời; đừng lắp mới.</li>
<li><strong>Cat 5e</strong> — vẫn 100 MHz nhưng ngưỡng xuyên âm chặt hơn, nên đạt 1 Gbps tới 100 m. Đây là mức tối thiểu thực dụng cho văn phòng.</li>
<li><strong>Cat 6</strong> — 250 MHz, 1 Gbps tới 100 m và 10 Gbps chỉ tới 55 m.</li>
<li><strong>Cat 6a</strong> — 500 MHz, <strong>10 Gbps đủ 100 m</strong>. Đây là dòng đáng quan tâm khi xây mới.</li>
<li><strong>Cat 7 / 7a</strong> — có bọc chống nhiễu, 600–1000 MHz, dùng hẹp. <strong>Cat 8</strong> — 2000 MHz, 25–40 Gbps nhưng chỉ 30 m: nối tủ rack với tủ rack.</li>
</ul>
<p>Để ý "5e" và "6" có cùng tầm 100 m. Bạn mua category cao hơn để lấy dư địa và biên chống nhiễu, không phải để đi xa hơn.</p>`],

      [12, 'The RJ-45 pinout — eight pins, four pairs',
        `<p>Eight pins, four pairs, and an order that looks wrong until you know why.</p>
<ul>
<li>Pins <strong>1 and 2</strong> are one pair; pins <strong>4 and 5</strong> are another; pins <strong>7 and 8</strong> another.</li>
<li>But the third pair is <strong>split across pins 3 and 6</strong>, straddling the 4-5 pair. That comes from backward compatibility with telephone wiring.</li>
<li>10 and 100 Mbps Ethernet use only pins <strong>1-2 and 3-6</strong> — two pairs, one to transmit and one to receive.</li>
<li>1 Gbps and above use all four pairs, each one bidirectional at the same time.</li>
</ul>
<p>The consequence is the most common bad crimp there is: take pins 3 and 6 from <em>different</em> pairs and the cable still links at 100 Mbps, so it seems to work — then it fails under load and never reaches gigabit.</p>`,
        `<p>Tám chân, bốn đôi, và một thứ tự trông rất vô lý cho tới khi bạn biết lý do.</p>
<ul>
<li>Chân <strong>1 và 2</strong> là một đôi; chân <strong>4 và 5</strong> là một đôi khác; chân <strong>7 và 8</strong> là đôi nữa.</li>
<li>Nhưng đôi thứ ba lại <strong>bị tách ra chân 3 và chân 6</strong>, ôm lấy đôi 4-5 ở giữa. Chuyện này đến từ việc giữ tương thích ngược với cáp điện thoại.</li>
<li>Ethernet 10 và 100 Mbps chỉ dùng chân <strong>1-2 và 3-6</strong> — hai đôi, một để phát, một để nhận.</li>
<li>Từ 1 Gbps trở lên dùng cả bốn đôi, mỗi đôi truyền hai chiều cùng lúc.</li>
</ul>
<p>Hệ quả là mối bấm sai phổ biến nhất: lấy chân 3 và 6 từ <em>hai đôi khác nhau</em>, sợi cáp vẫn lên được 100 Mbps nên trông có vẻ chạy — rồi hỏng khi tải nặng và không bao giờ lên nổi gigabit.</p>`],

      [13, 'T568A vs T568B — the colour order',
        `<p>TIA-568 defines two valid colour orders. Learn them by their difference, not as two lists of eight.</p>
<ul>
<li><strong>The only difference is that the green pair and the orange pair swap places.</strong> Pins 4, 5, 7 and 8 — blue, white/blue, white/brown, brown — are identical in both.</li>
<li>T568A: white/green, green, white/orange, blue, white/blue, orange, white/brown, brown.</li>
<li>T568B: white/orange, orange, white/green, blue, white/blue, green, white/brown, brown.</li>
<li>Either is correct. What matters is that a straight-through cable uses <strong>the same standard at both ends</strong>.</li>
</ul>
<p>In practice T568B dominates commercial installations. Pick one for your site, label the rack with which one it is, and never mix them in the same building.</p>`,
        `<p>TIA-568 định nghĩa hai thứ tự màu đều hợp lệ. Hãy học theo chỗ khác nhau, đừng học thuộc hai danh sách tám màu.</p>
<ul>
<li><strong>Khác biệt duy nhất là đôi xanh lá và đôi cam đổi chỗ cho nhau.</strong> Chân 4, 5, 7 và 8 — xanh dương, trắng-xanh dương, trắng-nâu, nâu — giống hệt nhau ở cả hai chuẩn.</li>
<li>T568A: trắng-lá, lá, trắng-cam, dương, trắng-dương, cam, trắng-nâu, nâu.</li>
<li>T568B: trắng-cam, cam, trắng-lá, dương, trắng-dương, lá, trắng-nâu, nâu.</li>
<li>Chuẩn nào cũng đúng. Điều quan trọng là dây straight-through phải dùng <strong>cùng một chuẩn ở cả hai đầu</strong>.</li>
</ul>
<p>Thực tế T568B chiếm đa số ở các công trình thương mại. Hãy chọn một chuẩn cho toà nhà của bạn, dán nhãn lên tủ rack ghi rõ chuẩn nào, và tuyệt đối đừng trộn lẫn trong cùng một toà nhà.</p>`],

      [14, 'Straight-through, crossover, rollover',
        `<p>Three cable types, three jobs, and one modern feature that hides the difference.</p>
<ul>
<li><strong>Straight-through</strong> — same standard at both ends. Connects <em>different</em> device types: PC to switch, switch to router.</li>
<li><strong>Crossover</strong> — T568A at one end, T568B at the other. Connects the <em>same</em> device type: PC to PC, switch to switch, router to router.</li>
<li><strong>Rollover</strong> — pins reversed 1-8 to 8-1. Not Ethernet at all: it connects a PC serial port to a device <em>console</em> port, which is how you configure a switch with no IP address yet.</li>
</ul>
<p><strong>Auto-MDIX</strong> on modern gear detects the wrong cable and flips the pairs internally, so the wrong cable usually still works. You still learn the rule, because the exam tests it and because the one device that does not support it will be the one that matters at 2 a.m.</p>`,
        `<p>Ba loại dây, ba nhiệm vụ, và một tính năng hiện đại làm mờ đi sự khác biệt đó.</p>
<ul>
<li><strong>Straight-through</strong> — cùng một chuẩn ở hai đầu. Nối hai loại thiết bị <em>khác nhau</em>: PC với switch, switch với router.</li>
<li><strong>Crossover</strong> — một đầu T568A, đầu kia T568B. Nối hai thiết bị <em>cùng loại</em>: PC với PC, switch với switch, router với router.</li>
<li><strong>Rollover</strong> — đảo ngược chân 1-8 thành 8-1. Đây không phải Ethernet: nó nối cổng serial của PC vào cổng <em>console</em> của thiết bị, tức cách bạn cấu hình một switch chưa có địa chỉ IP nào.</li>
</ul>
<p><strong>Auto-MDIX</strong> trên thiết bị đời mới phát hiện dây sai và tự đảo đôi bên trong, nên dùng nhầm dây vẫn thường chạy. Bạn vẫn phải thuộc luật, vì đề thi có hỏi và vì cái thiết bị duy nhất không hỗ trợ tính năng này sẽ là cái quan trọng nhất lúc 2 giờ sáng.</p>`],

      [15, 'How light stays inside a glass thread',
        `<p>Fibre carries light through a glass core, and the physics is one idea: <strong>total internal reflection</strong>.</p>
<ul>
<li>The <strong>core</strong> carries the light. The <strong>cladding</strong> around it has a <em>lower refractive index</em>, so light hitting the boundary at a shallow angle is reflected back in rather than escaping.</li>
<li>The <strong>jacket</strong> is mechanical protection only; it plays no optical role.</li>
<li>Because the signal is light in glass, there is <strong>no electrical noise, no crosstalk, no earth loop and no lightning path</strong>.</li>
<li>Core diameters: about <strong>9 µm</strong> for single-mode, about <strong>50 or 62.5 µm</strong> for multimode.</li>
</ul>
<p>What limits fibre is therefore not interference but how much light survives the distance, and — in multimode — how far apart the different light paths arrive.</p>`,
        `<p>Cáp quang chở ánh sáng qua một lõi thuỷ tinh, và toàn bộ phần vật lý chỉ là một ý: <strong>phản xạ toàn phần</strong>.</p>
<ul>
<li><strong>Lõi (core)</strong> chở ánh sáng. <strong>Lớp bọc (cladding)</strong> quanh nó có <em>chiết suất thấp hơn</em>, nên tia sáng đập vào mặt phân cách ở góc đủ nghiêng sẽ bị hắt ngược trở vào thay vì thoát ra ngoài.</li>
<li><strong>Vỏ (jacket)</strong> chỉ để bảo vệ cơ học; nó không có vai trò quang học nào.</li>
<li>Vì tín hiệu là ánh sáng trong thuỷ tinh nên <strong>không có nhiễu điện, không xuyên âm, không vòng lặp đất và không có đường cho sét</strong>.</li>
<li>Đường kính lõi: khoảng <strong>9 µm</strong> với đơn mode, khoảng <strong>50 hoặc 62,5 µm</strong> với đa mode.</li>
</ul>
<p>Vậy thứ giới hạn cáp quang không phải nhiễu, mà là lượng ánh sáng còn sống sót sau quãng đường, và — với đa mode — là độ lệch thời gian giữa các đường đi của ánh sáng.</p>`],

      [16, 'Single-mode vs multimode',
        `<p>Two kinds of fibre, and the difference is the core diameter — everything else follows from it.</p>
<ul>
<li><strong>Single-mode (SMF)</strong> — a 9 µm core leaves only one path for the light, driven by a <strong>laser</strong>. Reach: tens of kilometres, up to about 100 km. Limited by attenuation.</li>
<li><strong>Multimode (MMF)</strong> — a 50 or 62.5 µm core allows many paths, driven by an LED or VCSEL. Reach: up to roughly 550 m at 10 Gbps. Limited by <strong>modal dispersion</strong> — different paths are different lengths, so the pulse smears out.</li>
<li>Jacket colour by convention: yellow for single-mode; orange, aqua or violet for multimode.</li>
<li>Cost: single-mode optics are dearer, but cheaper per kilometre; multimode optics are cheaper over short runs.</li>
</ul>
<p>"Multimode" means many light <em>paths</em> in one core. It does not mean many fibres in one cable — that is a different word, and exams exploit the confusion.</p>`,
        `<p>Hai loại cáp quang, và khác biệt nằm ở đường kính lõi — mọi thứ còn lại là hệ quả.</p>
<ul>
<li><strong>Đơn mode (SMF)</strong> — lõi 9 µm chỉ chừa đúng một đường cho ánh sáng, nguồn phát là <strong>laser</strong>. Tầm xa: hàng chục km, tới khoảng 100 km. Bị giới hạn bởi suy hao.</li>
<li><strong>Đa mode (MMF)</strong> — lõi 50 hoặc 62,5 µm cho phép nhiều đường đi, nguồn phát là LED hoặc VCSEL. Tầm xa: tới khoảng 550 m ở 10 Gbps. Bị giới hạn bởi <strong>tán sắc mode</strong> — các đường đi dài ngắn khác nhau nên xung bị nhoè ra.</li>
<li>Màu vỏ theo quy ước: vàng cho đơn mode; cam, xanh ngọc hoặc tím cho đa mode.</li>
<li>Giá: bộ quang đơn mode đắt hơn nhưng rẻ hơn tính trên mỗi km; bộ quang đa mode rẻ hơn khi đi ngắn.</li>
</ul>
<p>"Đa mode" nghĩa là nhiều <em>đường đi</em> của ánh sáng trong một lõi. Nó không có nghĩa là nhiều sợi trong một cáp — đó là chuyện khác, và đề thi hay lợi dụng chỗ nhầm này.</p>`],

      [17, 'Connectors and where fibre is used',
        `<p>Four connectors worth knowing, and one troubleshooting rule that saves whole evenings.</p>
<ul>
<li><strong>ST</strong> — bayonet twist-lock, older multimode installations.</li>
<li><strong>SC</strong> — square push-pull, "subscriber connector".</li>
<li><strong>LC</strong> — small form factor, usually duplex; today's default inside SFP modules.</li>
<li><strong>Duplex multimode</strong> — two fibres clipped together: one transmit, one receive.</li>
</ul>
<p>Used for: enterprise backbone between floors and buildings, data-centre switch interconnects, fibre to the home, and long-haul including submarine cable.</p>
<p><strong>The rule:</strong> fibre carries light in one direction per strand, so the TX of one end must reach the RX of the other. A dark link with good optics is a crossed pair nine times out of ten — <em>swap the two strands before you replace anything</em>.</p>`,
        `<p>Bốn loại đầu nối đáng nhớ, và một luật gỡ lỗi cứu bạn cả buổi tối.</p>
<ul>
<li><strong>ST</strong> — kiểu vặn khoá bayonet, các hệ đa mode đời cũ.</li>
<li><strong>SC</strong> — vuông, cắm rút thẳng, gọi là "subscriber connector".</li>
<li><strong>LC</strong> — cỡ nhỏ, thường là đôi; mặc định ngày nay bên trong các mô-đun SFP.</li>
<li><strong>Đa mode đôi (duplex MM)</strong> — hai sợi kẹp vào nhau: một sợi phát, một sợi nhận.</li>
</ul>
<p>Dùng ở đâu: trục chính của doanh nghiệp giữa các tầng và các toà nhà, nối switch trong trung tâm dữ liệu, cáp quang tới nhà, và các tuyến đường dài kể cả cáp biển.</p>
<p><strong>Luật cần nhớ:</strong> mỗi sợi quang chỉ chở ánh sáng theo một chiều, nên TX của đầu này phải tới được RX của đầu kia. Một tuyến tối đen trong khi bộ quang vẫn tốt thì chín trên mười lần là do cắm ngược hai sợi — <em>hãy đổi chỗ hai sợi trước khi thay bất cứ thứ gì</em>.</p>`],

      [18, 'Fibre vs copper, decided on four rows',
        `<p>You will make this choice in real projects. Decide it on the table, not on instinct.</p>
<ul>
<li><strong>Distance</strong> — copper 100 m, fibre hundreds of metres to 100 km. Usually the deciding row.</li>
<li><strong>Bandwidth</strong> — copper 1–10 Gbps typical, fibre 10–100 Gbps and beyond.</li>
<li><strong>EMI/RFI</strong> — copper is affected, fibre is <strong>immune</strong>.</li>
<li><strong>Electrical hazard</strong> — copper creates earth loops and carries lightning between buildings. Fibre carries neither.</li>
<li><strong>Cost and termination</strong> — copper is crimped in the field in minutes; fibre needs fusion splicing and specialist tools.</li>
</ul>
<p>So: fibre when the run is long, noisy or between buildings; copper for the last 100 m to a desk, where it also delivers Power over Ethernet — something fibre can never do.</p>`,
        `<p>Bạn sẽ phải chọn thật trong dự án. Hãy quyết theo bảng, đừng quyết theo cảm tính.</p>
<ul>
<li><strong>Khoảng cách</strong> — đồng 100 m, quang hàng trăm mét tới 100 km. Thường là dòng quyết định.</li>
<li><strong>Băng thông</strong> — đồng thường 1–10 Gbps, quang 10–100 Gbps và hơn nữa.</li>
<li><strong>EMI/RFI</strong> — đồng bị ảnh hưởng, quang thì <strong>miễn nhiễm</strong>.</li>
<li><strong>Nguy hiểm điện</strong> — đồng tạo vòng lặp đất và dẫn sét giữa hai toà nhà. Quang không dẫn thứ nào.</li>
<li><strong>Giá và cách bấm đầu</strong> — đồng bấm tại chỗ trong vài phút; quang cần hàn nhiệt và dụng cụ chuyên dụng.</li>
</ul>
<p>Vậy: chọn quang khi đường dài, nhiễu nhiều hoặc nối giữa các toà nhà; chọn đồng cho 100 mét cuối xuống bàn làm việc, nơi nó còn cấp được nguồn qua Ethernet (PoE) — thứ mà cáp quang không bao giờ làm được.</p>`],

      [19, 'Wireless standards you will actually meet',
        `<p>All of these are IEEE 802.11 amendments. The marketing names (Wi-Fi 4, 5, 6) were invented later to make them readable.</p>
<ul>
<li><strong>802.11a</strong> — 5 GHz, 54 Mbps. <strong>802.11b</strong> — 2.4 GHz, 11 Mbps. <strong>802.11g</strong> — 2.4 GHz, 54 Mbps.</li>
<li><strong>802.11n (Wi-Fi 4)</strong> — both bands, up to 600 Mbps, introduced MIMO.</li>
<li><strong>802.11ac (Wi-Fi 5)</strong> — 5 GHz only, up to about 6.9 Gbps.</li>
<li><strong>802.11ax (Wi-Fi 6 / 6E)</strong> — 2.4, 5 and 6 GHz, up to about 9.6 Gbps, and designed for <em>many clients at once</em> rather than one fast client.</li>
<li>Other radio standards in the module: <strong>Bluetooth</strong> (personal area), <strong>WiMAX 802.16</strong> (wide area broadband), <strong>Zigbee 802.15.4</strong> (low power, sensors, IoT).</li>
</ul>
<p>Those top rates are theoretical aggregates across all streams. A single client never sees them, and the slide's numbers are ceilings, not promises.</p>`,
        `<p>Tất cả đều là các bản bổ sung của IEEE 802.11. Các tên thương mại (Wi-Fi 4, 5, 6) mới được nghĩ ra sau cho dễ đọc.</p>
<ul>
<li><strong>802.11a</strong> — 5 GHz, 54 Mbps. <strong>802.11b</strong> — 2,4 GHz, 11 Mbps. <strong>802.11g</strong> — 2,4 GHz, 54 Mbps.</li>
<li><strong>802.11n (Wi-Fi 4)</strong> — cả hai băng tần, tới 600 Mbps, bắt đầu có MIMO.</li>
<li><strong>802.11ac (Wi-Fi 5)</strong> — chỉ 5 GHz, tới khoảng 6,9 Gbps.</li>
<li><strong>802.11ax (Wi-Fi 6 / 6E)</strong> — 2,4, 5 và 6 GHz, tới khoảng 9,6 Gbps, và được thiết kế cho <em>nhiều máy cùng lúc</em> chứ không phải cho một máy thật nhanh.</li>
<li>Các chuẩn vô tuyến khác trong module: <strong>Bluetooth</strong> (mạng cá nhân), <strong>WiMAX 802.16</strong> (băng rộng diện rộng), <strong>Zigbee 802.15.4</strong> (công suất thấp, cảm biến, IoT).</li>
</ul>
<p>Các con số tốc độ đỉnh đó là tổng lý thuyết trên mọi luồng. Một máy đơn lẻ không bao giờ đạt tới, và các số trên slide là trần chứ không phải lời hứa.</p>`],

      [20, 'What wireless costs you',
        `<p>Wireless buys mobility. Understand exactly what it charges for it.</p>
<ul>
<li><strong>Shared medium</strong> — every client on one access point divides the same airtime. Twenty clients do not get twenty times the capacity.</li>
<li><strong>Half duplex</strong> — a station cannot transmit and receive at the same time. Wi-Fi therefore <em>avoids</em> collisions (CSMA/CA) rather than detecting them as wired Ethernet once did.</li>
<li><strong>Coverage</strong> — walls, metal and distance cut the negotiated rate long before the link actually drops.</li>
<li><strong>Interference</strong> — microwaves, cordless phones, Bluetooth and every neighbouring AP live in the 2.4 GHz band.</li>
<li><strong>Security</strong> — the signal leaves the building, so WPA2 or WPA3 is not optional. This is the one layer-1 property that is also a security property.</li>
</ul>
<p>"Full bars but slow" is therefore normal and not a fault: bars show <em>signal strength</em>, and what you are short of is <em>free airtime</em>.</p>`,
        `<p>Không dây mua cho bạn sự cơ động. Hãy hiểu chính xác nó tính giá bằng gì.</p>
<ul>
<li><strong>Môi trường dùng chung</strong> — mọi máy trên cùng một điểm truy nhập chia nhau cùng một quỹ thời gian phát sóng. Hai mươi máy không có nghĩa là hai mươi lần sức chở.</li>
<li><strong>Bán song công</strong> — một trạm không thể vừa phát vừa nhận. Vì thế Wi-Fi <em>tránh</em> xung đột (CSMA/CA) chứ không phát hiện xung đột như Ethernet có dây ngày xưa.</li>
<li><strong>Vùng phủ</strong> — tường, kim loại và khoảng cách kéo tốc độ thương lượng xuống từ rất lâu trước khi đường truyền thật sự rớt.</li>
<li><strong>Nhiễu</strong> — lò vi sóng, điện thoại không dây, Bluetooth và mọi điểm truy nhập hàng xóm đều sống trong băng 2,4 GHz.</li>
<li><strong>An ninh</strong> — sóng bay ra khỏi toà nhà, nên WPA2 hoặc WPA3 không phải tuỳ chọn. Đây là tính chất tầng 1 duy nhất đồng thời là tính chất an ninh.</li>
</ul>
<p>Vì vậy "đầy vạch mà chậm" là bình thường chứ không phải lỗi: số vạch thể hiện <em>cường độ sóng</em>, còn thứ bạn đang thiếu là <em>thời gian phát sóng trống</em>.</p>`],

      [21, 'All media on one table',
        `<p>The summary you should be able to reproduce from memory in the exam.</p>
<ul>
<li><strong>UTP Cat 5e/6</strong> — 100 m, affected by EMI, cheapest, desk drops and PoE.</li>
<li><strong>STP</strong> — 100 m, resistant to EMI, slightly dearer, factories and noisy plant.</li>
<li><strong>Coaxial</strong> — hundreds of metres, resistant, mid cost, cable modems, antennas, CCTV.</li>
<li><strong>Multimode fibre</strong> — about 550 m at 10 Gbps, immune to EMI, high cost, campus and data-centre backbone.</li>
<li><strong>Single-mode fibre</strong> — up to about 100 km, immune, highest cost, between sites and long haul.</li>
<li><strong>Wireless 802.11</strong> — roughly 30–50 m indoors, very affected by interference, cheap, mobility and guest access.</li>
</ul>
<p>Every real design decision in this course comes out of two of these columns: <strong>distance</strong> and <strong>environment</strong>. Speed is usually the least interesting one.</p>`,
        `<p>Bảng tổng kết mà bạn nên chép lại được từ trí nhớ khi đi thi.</p>
<ul>
<li><strong>UTP Cat 5e/6</strong> — 100 m, bị nhiễu, rẻ nhất, cáp xuống bàn và cấp nguồn PoE.</li>
<li><strong>STP</strong> — 100 m, chống nhiễu, đắt hơn chút, dùng trong nhà xưởng nhiều nhiễu.</li>
<li><strong>Cáp đồng trục</strong> — hàng trăm mét, chống nhiễu, giá vừa, modem cáp, ăng-ten, camera.</li>
<li><strong>Cáp quang đa mode</strong> — khoảng 550 m ở 10 Gbps, miễn nhiễm nhiễu, giá cao, trục chính trong khuôn viên và trung tâm dữ liệu.</li>
<li><strong>Cáp quang đơn mode</strong> — tới khoảng 100 km, miễn nhiễm, giá cao nhất, nối giữa các cơ sở và tuyến đường dài.</li>
<li><strong>Không dây 802.11</strong> — khoảng 30–50 m trong nhà, rất dễ bị nhiễu, rẻ, dùng cho cơ động và khách.</li>
</ul>
<p>Mọi quyết định thiết kế thật trong môn này đều rút ra từ hai cột: <strong>khoảng cách</strong> và <strong>môi trường</strong>. Tốc độ thường là cột ít thú vị nhất.</p>`],
    ]),

    bi(
      `<h3>🧭 Choosing a medium, as a decision tree</h3>
<pre><code class="language-mermaid">
flowchart TD
  A["How long is the run?"] -->|"up to 100 m"| B["Is there heavy EMI nearby?"]
  A -->|"100 m to 550 m"| C["Multimode fibre"]
  A -->|"more than 550 m,<br/>or between buildings"| D["Single-mode fibre"]
  B -->|"no"| E["UTP Cat 6 or 6a<br/>(also carries PoE)"]
  B -->|"yes, motors or welding"| F["STP, properly grounded"]
  A -->|"devices must move"| G["Wireless 802.11<br/>accept shared, half duplex"]
  D --> H["Lightning risk between<br/>buildings? Fibre is the<br/>only safe answer"]
</code></pre>`,
      `<h3>🧭 Chọn môi trường truyền, dưới dạng cây quyết định</h3>
<pre><code class="language-mermaid">
flowchart TD
  A["Đường dây dài bao nhiêu?"] -->|"tới 100 m"| B["Gần đó có nhiễu mạnh không?"]
  A -->|"100 m tới 550 m"| C["Cáp quang đa mode"]
  A -->|"hơn 550 m,<br/>hoặc nối hai toà nhà"| D["Cáp quang đơn mode"]
  B -->|"không"| E["UTP Cat 6 hoặc 6a<br/>(còn cấp được nguồn PoE)"]
  B -->|"có, động cơ hoặc máy hàn"| F["STP, tiếp đất đúng cách"]
  A -->|"thiết bị phải di chuyển"| G["Không dây 802.11<br/>chấp nhận dùng chung, bán song công"]
  D --> H["Có nguy cơ sét giữa hai<br/>toà nhà? Cáp quang là<br/>câu trả lời an toàn duy nhất"]
</code></pre>`,
    ),

    cq(11, [['CQ4.2',
      'Constrast and compare between copper and fiber optic capling',
      'So sánh và đối chiếu cáp đồng với cáp quang.']]),

    cq(12, [['CQ4.3',
      'While trying to solve a network issue, a technician made multiple changes to the current router configuration file. The changes did not solve the problem and were not saved. What action can the technician take to discard the changes and work with the file in NVRAM?',
      'Trong lúc xử lý một sự cố mạng, một kỹ thuật viên đã sửa nhiều chỗ trong file cấu hình đang chạy của router. Các thay đổi đó không giải quyết được vấn đề và cũng chưa được lưu. Kỹ thuật viên có thể làm gì để bỏ các thay đổi đó và quay về làm việc với file trong NVRAM?']]),

    bi(
      `<h3>📋 Notes on the original syllabus — reported, not corrected</h3>
<ul>
<li><strong>CQ4.2 contains two typing errors</strong> in the official table: "Constrast" for "Contrast" and "capling" for "cabling". Quoted exactly as published.</li>
<li><strong>CQ4.3 is not a physical-layer question at all.</strong> It asks about discarding an unsaved running configuration and reloading from NVRAM — that is Module 2/10 material, not Module 4. It is quoted here because FLM lists it against session 12. Short answer for completeness: reload the device without saving, or issue <code>copy startup-config running-config</code>; either brings back the NVRAM copy, and only <code>copy running-config startup-config</code> would have made the changes permanent.</li>
<li><strong>CQ4.2 is listed at session 11</strong>, which teaches copper only — fibre is not taught until session 12. It is answered here, after both have been covered.</li>
</ul>`,
      `<h3>📋 Ghi chú về syllabus gốc — chỉ nêu, không tự sửa</h3>
<ul>
<li><strong>CQ4.2 có hai lỗi gõ</strong> trong bảng chính thức: "Constrast" thay cho "Contrast" và "capling" thay cho "cabling". Đã trích đúng nguyên văn.</li>
<li><strong>CQ4.3 hoàn toàn không phải câu hỏi về tầng vật lý.</strong> Nó hỏi cách bỏ cấu hình đang chạy chưa lưu và nạp lại từ NVRAM — đó là nội dung Module 2/10, không phải Module 4. Nó được trích ở đây vì FLM gán nó cho buổi 12. Trả lời ngắn cho đủ: khởi động lại thiết bị mà không lưu, hoặc gõ <code>copy startup-config running-config</code>; cả hai đều lấy lại bản trong NVRAM, và chỉ có <code>copy running-config startup-config</code> mới khiến các thay đổi thành vĩnh viễn.</li>
<li><strong>CQ4.2 được xếp ở buổi 11</strong>, buổi chỉ dạy cáp đồng — cáp quang tới buổi 12 mới học. Nó được trả lời ở đây, sau khi đã học cả hai.</li>
</ul>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<pre><code class="language-bash"># Which wireless standard, band and rate is this laptop actually using?
# macOS:
system_profiler SPAirPortDataType | grep -A6 "Current Network"
# Linux:
iw dev wlan0 link
iw dev wlan0 scan | grep -E "SSID|freq|signal"

# The wired side, for comparison
ethtool eth0 | grep -E "Speed|Duplex|Link detected"

# Is the cable itself the limit? Test the same NIC with a known-good short lead.
ip -s link show eth0</code></pre>
<pre><code class="language-plaintext">tx bitrate: 866.7 MBit/s   -> 802.11ac, 80 MHz, two streams: a healthy Wi-Fi 5 link
tx bitrate: 72.2 MBit/s    -> one stream at 20 MHz: you are far away or in a crowded band
freq: 2412                 -> channel 1, 2.4 GHz: shared with microwaves and every neighbour
freq: 5180                 -> channel 36, 5 GHz: shorter range, far less interference
Speed: 1000Mb/s Full       -> the wired link is fine; if throughput is low, look above layer 1</code></pre>
<p>Answering the opening question: <strong>multimode fibre</strong> is enough at 400 m for 10 Gbps, and single-mode would also work. The two non-speed reasons: fibre is <strong>immune to EMI</strong>, and — the decisive one between buildings — it carries <strong>no electrical path</strong>, so a lightning strike on one building cannot travel down the link into the other. Copper between buildings also creates an earth loop between two different electrical systems.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<pre><code class="language-bash"># Laptop này đang thật sự dùng chuẩn, băng tần và tốc độ nào?
# macOS:
system_profiler SPAirPortDataType | grep -A6 "Current Network"
# Linux:
iw dev wlan0 link
iw dev wlan0 scan | grep -E "SSID|freq|signal"

# Phía có dây, để so sánh
ethtool eth0 | grep -E "Speed|Duplex|Link detected"

# Sợi cáp có phải là chỗ nghẽn không? Thử lại chính card đó với một dây ngắn chắc chắn tốt.
ip -s link show eth0</code></pre>
<pre><code class="language-plaintext">tx bitrate: 866.7 MBit/s   -> 802.11ac, 80 MHz, hai luồng: một kết nối Wi-Fi 5 khoẻ
tx bitrate: 72.2 MBit/s    -> một luồng ở 20 MHz: bạn ở xa hoặc băng tần quá đông
freq: 2412                 -> kênh 1, 2,4 GHz: chia chung với lò vi sóng và mọi hàng xóm
freq: 5180                 -> kênh 36, 5 GHz: tầm ngắn hơn, ít nhiễu hơn nhiều
Speed: 1000Mb/s Full       -> đường có dây vẫn tốt; thông lượng thấp thì tìm ở trên tầng 1</code></pre>
<p>Trả lời câu hỏi mở đầu: <strong>cáp quang đa mode</strong> là đủ cho 400 m ở 10 Gbps, và đơn mode cũng chạy được. Hai lý do không liên quan tới tốc độ: cáp quang <strong>miễn nhiễm với EMI</strong>, và — lý do quyết định khi nối hai toà nhà — nó <strong>không dẫn điện</strong>, nên một cú sét đánh vào toà nhà này không thể chạy dọc đường truyền sang toà nhà kia. Cáp đồng nối hai toà nhà còn tạo ra vòng lặp đất giữa hai hệ điện khác nhau.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Mixing T568A and T568B in one building.</strong> <em>Symptom:</em> most cables work, a few links come up at 100 Mbps only, and nobody can explain which. A straight-through cable with different standards at each end is a crossover — which Auto-MDIX may silently fix, hiding the mistake until you meet a device without it.</li>
<li><strong>Believing STP is always better.</strong> <em>Symptom:</em> an expensive shielded install with <em>more</em> errors than the old UTP. An ungrounded or double-grounded shield acts as an antenna or carries earth current. Shielding is a system, not a cable.</li>
<li><strong>Assuming multimode means "many fibres".</strong> <em>Symptom:</em> a student orders single-mode optics for a multimode cable, or the reverse, and gets a dark link. Multimode is about light paths in one core; the optics and the fibre type must match on both ends.</li>
<li><strong>Reading Wi-Fi bars as throughput.</strong> <em>Symptom:</em> "full signal but the video buffers". Bars measure signal strength. What is missing is airtime: 30 clients on one AP, or a neighbour saturating the same 2.4 GHz channel. Move to 5 GHz or add an AP; a stronger radio does not help.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Trộn T568A với T568B trong cùng một toà nhà.</strong> <em>Triệu chứng:</em> đa số dây vẫn chạy, vài đường chỉ lên 100 Mbps, và không ai giải thích được là những đường nào. Dây straight-through mà hai đầu khác chuẩn chính là dây crossover — thứ mà Auto-MDIX có thể âm thầm sửa giúp, giấu cái sai đi cho tới khi bạn gặp một thiết bị không có tính năng đó.</li>
<li><strong>Tin rằng STP luôn tốt hơn.</strong> <em>Triệu chứng:</em> một hệ cáp chống nhiễu đắt tiền lại <em>nhiều</em> lỗi hơn hệ UTP cũ. Lớp chống nhiễu không tiếp đất, hoặc tiếp đất cả hai đầu, sẽ thành ăng-ten hoặc dẫn dòng đất. Chống nhiễu là cả một hệ thống, không phải một sợi cáp.</li>
<li><strong>Tưởng đa mode nghĩa là "nhiều sợi".</strong> <em>Triệu chứng:</em> sinh viên đặt bộ quang đơn mode cho cáp đa mode, hoặc ngược lại, rồi nhận một tuyến tối đen. Đa mode nói về các đường đi của ánh sáng trong một lõi; loại bộ quang và loại cáp phải khớp nhau ở cả hai đầu.</li>
<li><strong>Đọc vạch sóng Wi-Fi thành thông lượng.</strong> <em>Triệu chứng:</em> "đầy sóng mà video cứ quay". Vạch sóng đo cường độ tín hiệu. Thứ đang thiếu là thời gian phát sóng: 30 máy trên một điểm truy nhập, hoặc một hàng xóm chiếm hết kênh 2,4 GHz. Hãy chuyển sang 5 GHz hoặc thêm điểm truy nhập; máy phát mạnh hơn không giúp được gì.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> Write out T568B from memory, pin 1 to pin 8. Then state the single sentence that turns it into T568A.</p>
<p><strong>2.</strong> Choose the medium for each, and give the deciding reason: (a) 60 m from a wiring closet to a desk that needs a PoE phone; (b) 3 km between two campus buildings; (c) 40 m inside a metal-working workshop; (d) a warehouse where stock scanners move constantly.</p>
<p><strong>3.</strong> A fibre link between two switches is dark. The optics are new and the correct type. Name the first thing to try, and why it is first.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> T568B: white/orange, orange, white/green, blue, white/blue, green, white/brown, brown. The sentence: <em>swap the green pair with the orange pair and you have T568A</em> — pins 4, 5, 7 and 8 never change.</p>
<p><strong>2.</strong> (a) UTP Cat 6 or 6a — within 100 m and it must carry Power over Ethernet, which fibre cannot do. (b) Single-mode fibre — 3 km is far beyond copper and beyond multimode, and it is between buildings, so the absence of an electrical path also matters. (c) STP, properly grounded, or multimode fibre if the budget allows — the deciding factor is EMI from welding and motors, not distance. (d) Wireless 802.11 — mobility is the requirement; accept the shared, half-duplex medium as the price.</p>
<p><strong>3.</strong> Swap the two strands at one end. Each strand carries light one way, so TX must meet RX; a crossed pair is by far the most common cause, it costs ten seconds, and it requires no parts. Only after that should you check optics, clean the connectors and test with a light source.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Viết lại T568B từ trí nhớ, chân 1 tới chân 8. Rồi nêu đúng một câu biến nó thành T568A.</p>
<p><strong>2.</strong> Chọn môi trường truyền cho từng trường hợp và nêu lý do quyết định: (a) 60 m từ tủ mạng xuống một bàn cần điện thoại chạy PoE; (b) 3 km giữa hai toà nhà trong khuôn viên; (c) 40 m bên trong một xưởng cơ khí; (d) một nhà kho nơi máy quét hàng di chuyển liên tục.</p>
<p><strong>3.</strong> Một tuyến quang giữa hai switch tối đen. Bộ quang mới và đúng loại. Nêu việc đầu tiên cần thử, và vì sao nó phải là việc đầu tiên.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> T568B: trắng-cam, cam, trắng-lá, dương, trắng-dương, lá, trắng-nâu, nâu. Câu cần nhớ: <em>đổi chỗ đôi xanh lá với đôi cam là ra T568A</em> — chân 4, 5, 7 và 8 không bao giờ đổi.</p>
<p><strong>2.</strong> (a) UTP Cat 6 hoặc 6a — nằm trong 100 m và phải cấp được nguồn PoE, thứ cáp quang không làm được. (b) Cáp quang đơn mode — 3 km vượt xa cáp đồng và vượt cả đa mode, lại nối giữa hai toà nhà nên việc không có đường dẫn điện cũng quan trọng. (c) STP tiếp đất đúng cách, hoặc cáp quang đa mode nếu đủ ngân sách — yếu tố quyết định là EMI từ máy hàn và động cơ, không phải khoảng cách. (d) Không dây 802.11 — yêu cầu là cơ động; hãy chấp nhận môi trường dùng chung và bán song công như cái giá phải trả.</p>
<p><strong>3.</strong> Đổi chỗ hai sợi ở một đầu. Mỗi sợi chỉ chở ánh sáng một chiều nên TX phải gặp RX; cắm ngược là nguyên nhân phổ biến nhất, nó tốn mười giây và không cần thay linh kiện nào. Xong việc đó mới tới kiểm bộ quang, lau đầu nối và đo bằng nguồn sáng.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ───────────────── Lesson 4.3 — Lab 1.3, sessions 13–14 ───────────────── */

const L3 = {
  title: '4.3 — Lab 1.3: view wired and wireless NIC information (FLM sessions 13–14)|||4.3 — Lab 1.3: xem thông tin card mạng có dây và không dây (buổi 13–14 của FLM)',
  slug: 'nwc204-4-3-lab-1-3-thong-tin-nic',
  type: 'DOCUMENT',
  description: 'Buổi 13–14: làm Lab 1.3 trên máy thật — liệt kê mọi card mạng, đọc MAC, tốc độ, duplex, bộ đếm lỗi; phía không dây đọc SSID, kênh, băng tần, cường độ sóng và tốc độ thương lượng; so sánh hai bên và giải thích được vì sao chúng khác nhau.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 4 · Lesson 4.3 · FLM sessions 13–14 of 60 · CLO4, CLO9 · Lab 1.3</span>
<h2>Lab 1.3 — reading your own network cards honestly</h2>
<p class="lead">FLM marks this lab as <strong>"Dialogue-based Assessment &amp; Self Learning"</strong> too. The deliverable is not a screenshot of a settings panel — it is being able to say what each number means and why the wireless one keeps changing.</p>
<p><strong>Opening question:</strong> your laptop has a wired NIC and a wireless NIC. Both are connected to the same network at the same time. They have different MAC addresses and different IP addresses. Which one will the operating system use for a given connection, and what decides it?</p>`,
      `<span class="eyebrow">NWC204 · Chương 4 · Bài 4.3 · Buổi 13–14/60 của FLM · CLO4, CLO9 · Lab 1.3</span>
<h2>Lab 1.3 — đọc card mạng của chính mình một cách trung thực</h2>
<p class="lead">FLM cũng đánh lab này là <strong>"Dialogue-based Assessment &amp; Self Learning"</strong>. Sản phẩm nộp không phải ảnh chụp bảng thiết lập — mà là khả năng nói được mỗi con số nghĩa là gì và vì sao con số bên không dây cứ thay đổi.</p>
<p><strong>Câu hỏi mở đầu:</strong> laptop của bạn có một card có dây và một card không dây. Cả hai cùng nối vào một mạng cùng lúc. Chúng có MAC khác nhau và IP khác nhau. Hệ điều hành sẽ dùng cái nào cho một kết nối cụ thể, và cái gì quyết định điều đó?</p>`,
    ),

    walkHead('nwc204-ch04', 22, 23,
      'Slides 22–23 are the lab brief and the self-check for FLM sessions 13–14.',
      'Slide 22–23 là phần giao việc của lab và phần tự kiểm cho buổi 13–14 của FLM.'),

    walk('nwc204-ch04', [
      [22, 'Lab 1.3 — view wired and wireless NIC information',
        `<p>FLM lists two items for sessions 13 and 14: <strong>4.6.5 Packet Tracer</strong> and <strong>4.6.6 Lab Manual</strong>. Session 14 is marked "(continue)".</p>
<ul>
<li><strong>4.6.5</strong> — in Packet Tracer, connect a laptop by cable and then by Wi-Fi, and compare what each NIC reports.</li>
<li><strong>4.6.6</strong> — on your own machine, list every NIC with its MAC, its speed and its duplex.</li>
<li>Then the part that is actually assessed: <strong>explain out loud</strong> why the wireless rate keeps changing while the wired one does not.</li>
</ul>
<p>The wired NIC reports link speed, duplex, MAC and error counters. The wireless NIC reports SSID, channel, band, signal strength (RSSI) and a <em>negotiated</em> rate. Both report a MAC — and they are two different addresses, because they are two different cards.</p>`,
        `<p>FLM liệt kê hai mục cho buổi 13 và 14: <strong>4.6.5 Packet Tracer</strong> và <strong>4.6.6 Lab Manual</strong>. Buổi 14 ghi "(continue)".</p>
<ul>
<li><strong>4.6.5</strong> — trong Packet Tracer, nối một laptop bằng cáp rồi bằng Wi-Fi, và so sánh xem mỗi card báo những gì.</li>
<li><strong>4.6.6</strong> — trên chính máy của bạn, liệt kê mọi card mạng kèm MAC, tốc độ và duplex.</li>
<li>Rồi tới phần thật sự được chấm: <strong>nói thành lời</strong> vì sao tốc độ bên không dây cứ thay đổi còn bên có dây thì không.</li>
</ul>
<p>Card có dây báo tốc độ đường truyền, duplex, MAC và bộ đếm lỗi. Card không dây báo SSID, kênh, băng tần, cường độ sóng (RSSI) và một tốc độ đã <em>thương lượng</em>. Cả hai đều báo một địa chỉ MAC — và đó là hai địa chỉ khác nhau, vì chúng là hai cái card khác nhau.</p>`],

      [23, 'Verify it yourself, on your own machine',
        `<p>The three facts you must be able to produce for any machine, on demand.</p>
<ul>
<li><code>ip -br link</code> — every NIC and its MAC, one line each. The fastest inventory there is.</li>
<li><code>ethtool eth0</code> — speed, duplex and whether a carrier is detected. This is the command that settles "is it really gigabit?".</li>
<li><code>ip -s link show eth0</code> — RX and TX errors, dropped frames, carrier changes: the health of layer 1.</li>
<li>On macOS the equivalents are <code>networksetup -listallhardwareports</code> and <code>ifconfig en0 | grep media</code>.</li>
</ul>
<p>The reading rule: errors that keep rising while the link stays up is a <em>cable or connector</em> problem, not a configuration problem. And half duplex on one side only is the classic cause — it shows up as <strong>late collisions</strong> on that port.</p>`,
        `<p>Ba dữ kiện mà bạn phải lấy ra được cho bất kỳ máy nào, bất cứ lúc nào.</p>
<ul>
<li><code>ip -br link</code> — mọi card mạng và MAC của nó, mỗi cái một dòng. Đây là cách kiểm kê nhanh nhất.</li>
<li><code>ethtool eth0</code> — tốc độ, duplex và có phát hiện sóng mang hay không. Đây là lệnh kết thúc câu hỏi "có đúng là gigabit không?".</li>
<li><code>ip -s link show eth0</code> — lỗi RX và TX, số khung bị vứt, số lần mất sóng mang: sức khoẻ của tầng 1.</li>
<li>Trên macOS, hai lệnh tương đương là <code>networksetup -listallhardwareports</code> và <code>ifconfig en0 | grep media</code>.</li>
</ul>
<p>Luật đọc kết quả: lỗi cứ tăng trong khi đường truyền vẫn up là vấn đề <em>cáp hoặc đầu nối</em>, không phải vấn đề cấu hình. Và half duplex chỉ ở một bên là nguyên nhân kinh điển — nó hiện ra dưới dạng <strong>late collision</strong> trên cổng đó.</p>`],
    ]),

    bi(
      `<h3>🧪 Doing the lab, step by step</h3>
<h4>Part A — inventory every NIC</h4>
<pre><code class="language-bash"># Linux
ip -br link                        # name, state, MAC for every interface
ip -br addr                        # the same, plus addresses

# macOS
networksetup -listallhardwareports # friendly names mapped to en0, en1, ...
ifconfig -a | grep -E "^[a-z]|ether|inet "

# Windows (PowerShell)
Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress</code></pre>
<h4>Part B — the wired NIC in detail</h4>
<pre><code class="language-bash">ethtool eth0                       # Speed, Duplex, Auto-negotiation, Link detected
ethtool -S eth0 | head -20         # vendor error counters
ip -s link show eth0               # RX/TX errors, dropped, carrier
ifconfig en0 | grep media          # macOS: media: autoselect (1000baseT full-duplex)</code></pre>
<h4>Part C — the wireless NIC in detail</h4>
<pre><code class="language-bash"># Linux
iw dev wlan0 link                  # SSID, freq, signal, tx bitrate
iw dev wlan0 station dump | grep -E "signal|tx bitrate|rx bitrate"

# macOS
system_profiler SPAirPortDataType | grep -A10 "Current Network Information"</code></pre>
<h4>Part D — write the comparison</h4>
<pre><code class="language-plaintext">                  wired eth0                wireless wlan0
MAC               fixed, unique to the card fixed (but may be randomised per SSID)
speed             1000 Mb/s, constant       tx bitrate, changes second by second
duplex            full                      half - the radio cannot send and receive at once
medium            dedicated to this link    shared with every other client on the AP
errors            RX/TX error counters      retries and a signal strength in dBm
what changes it   nothing, until the cable  distance, walls, other clients, other networks</code></pre>`,
      `<h3>🧪 Làm lab, từng bước</h3>
<h4>Phần A — kiểm kê mọi card mạng</h4>
<pre><code class="language-bash"># Linux
ip -br link                        # tên, trạng thái, MAC của mọi giao diện
ip -br addr                        # vẫn vậy, kèm địa chỉ

# macOS
networksetup -listallhardwareports # tên dễ đọc ánh xạ sang en0, en1, ...
ifconfig -a | grep -E "^[a-z]|ether|inet "

# Windows (PowerShell)
Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress</code></pre>
<h4>Phần B — card có dây, chi tiết</h4>
<pre><code class="language-bash">ethtool eth0                       # Speed, Duplex, Auto-negotiation, Link detected
ethtool -S eth0 | head -20         # bộ đếm lỗi riêng của hãng
ip -s link show eth0               # lỗi RX/TX, dropped, carrier
ifconfig en0 | grep media          # macOS: media: autoselect (1000baseT full-duplex)</code></pre>
<h4>Phần C — card không dây, chi tiết</h4>
<pre><code class="language-bash"># Linux
iw dev wlan0 link                  # SSID, tần số, cường độ sóng, tốc độ phát
iw dev wlan0 station dump | grep -E "signal|tx bitrate|rx bitrate"

# macOS
system_profiler SPAirPortDataType | grep -A10 "Current Network Information"</code></pre>
<h4>Phần D — viết bảng so sánh</h4>
<pre><code class="language-plaintext">                  có dây eth0               không dây wlan0
MAC               cố định, riêng của card   cố định (có thể ngẫu nhiên theo từng SSID)
tốc độ            1000 Mb/s, không đổi      tx bitrate, đổi từng giây
duplex            song công đầy đủ          bán song công - sóng không thể vừa phát vừa nhận
môi trường        riêng cho đường này       dùng chung với mọi máy khác trên cùng AP
lỗi               bộ đếm lỗi RX/TX          số lần thử lại và cường độ sóng tính bằng dBm
cái gì làm nó đổi không gì, trừ khi đứt dây khoảng cách, tường, máy khác, mạng khác</code></pre>`,
    ),

    cq(13, [['CQ5.1',
      'How does UTP cable used in Ethernet networks?',
      'Cáp UTP được dùng trong mạng Ethernet như thế nào?']]),

    cq(14, [['CQ5.2',
      'How to connect devices using wired and wireless media',
      'Kết nối thiết bị bằng môi trường có dây và không dây như thế nào?']]),

    bi(
      `<p class="note">Note on the numbering: these two questions are coded <strong>CQ5.x</strong> but they are listed against sessions 13 and 14, which are Lab 1.3 and belong to chapter 4. The CQ codes run out of step with the chapter numbers throughout the table — the same misalignment that caused the missing Module 5 discussed in chapter 4B. Reported, not corrected.</p>`,
      `<p class="note">Ghi chú về cách đánh số: hai câu này mang mã <strong>CQ5.x</strong> nhưng lại được xếp vào buổi 13 và 14, vốn là Lab 1.3 và thuộc chương 4. Mã CQ lệch nhịp với số chương suốt cả bảng — cũng chính là chỗ lệch đã làm mất hẳn Module 5 mà chương 4B bàn tới. Chỉ nêu, không tự sửa bảng gốc.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Two machines, one question: which interface actually carries a given connection?</p>
<pre><code class="language-bash"># Which interface will the kernel use to reach a specific address?
ip route get 1.1.1.1              # Linux - prints the chosen interface and source address
route get 1.1.1.1                 # macOS

# The whole routing table, with metrics
ip route show
netstat -rn                       # macOS / BSD

# Watch the wireless rate change as you walk away from the AP
watch -n 1 'iw dev wlan0 link | grep bitrate'</code></pre>
<pre><code class="language-plaintext">ip route get 1.1.1.1 -> dev eth0      the wired NIC wins: it has the lower metric
ip route get 1.1.1.1 -> dev wlan0     the wireless NIC wins: eth0 has no carrier, or a worse metric
two default routes, different metrics the lower metric wins; this is how "wired preferred" is implemented
tx bitrate falls as you walk away    normal: the radio drops to a slower, more robust modulation</code></pre>
<p>That answers the opening question. Both NICs can be up at once, each with its own MAC and IP, and the operating system picks per destination using the <strong>routing table</strong> — specifically the lowest-metric matching route. It is not "the faster card wins"; it is a routing decision, and you can change it.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Hai card, một câu hỏi: giao diện nào thật sự đang chở một kết nối cụ thể?</p>
<pre><code class="language-bash"># Nhân hệ điều hành sẽ dùng giao diện nào để tới một địa chỉ cụ thể?
ip route get 1.1.1.1              # Linux - in ra giao diện được chọn và địa chỉ nguồn
route get 1.1.1.1                 # macOS

# Toàn bộ bảng định tuyến, kèm metric
ip route show
netstat -rn                       # macOS / BSD

# Xem tốc độ không dây thay đổi khi bạn đi xa dần điểm truy nhập
watch -n 1 'iw dev wlan0 link | grep bitrate'</code></pre>
<pre><code class="language-plaintext">ip route get 1.1.1.1 -> dev eth0      card có dây thắng: nó có metric thấp hơn
ip route get 1.1.1.1 -> dev wlan0     card không dây thắng: eth0 mất sóng mang, hoặc metric tệ hơn
hai tuyến mặc định, metric khác nhau  metric thấp hơn thắng; "ưu tiên có dây" được cài đặt như vậy
tx bitrate tụt khi bạn đi xa dần      bình thường: sóng hạ xuống điều chế chậm hơn nhưng bền hơn</code></pre>
<p>Đó là đáp án câu hỏi mở đầu. Cả hai card có thể cùng bật, mỗi cái một MAC và một IP, và hệ điều hành chọn theo từng đích dựa vào <strong>bảng định tuyến</strong> — cụ thể là tuyến khớp có metric thấp nhất. Không phải "card nhanh hơn thì thắng"; đó là một quyết định định tuyến, và bạn đổi được nó.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Reading the wireless "tx bitrate" as a speed test.</strong> <em>Symptom:</em> a report saying "my Wi-Fi is 866 Mbps" next to a download running at 4 MB/s. The bitrate is the current modulation rate on the radio, shared with everyone on the AP and halved again by half duplex and retries. Real throughput is typically well under half of it.</li>
<li><strong>Thinking one machine has one MAC address.</strong> <em>Symptom:</em> a DHCP reservation that works on the cable and not on Wi-Fi. Each NIC has its own MAC, and modern phones and laptops also <em>randomise</em> the wireless MAC per SSID for privacy — so the same laptop can present several.</li>
<li><strong>Assuming the wired NIC is always used when both are connected.</strong> <em>Symptom:</em> you unplug the cable expecting nothing to change, and every session drops. Which interface is used is a routing-metric decision; check with <code>ip route get</code> instead of assuming.</li>
<li><strong>Capturing on a laptop and blaming the switch.</strong> <em>Symptom:</em> "the switch is dropping my frames" when the interface counters on your own NIC already show RX errors. Always read your own counters first: they are free, instant, and they frequently end the investigation.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Đọc "tx bitrate" của Wi-Fi như một kết quả đo tốc độ.</strong> <em>Triệu chứng:</em> báo cáo ghi "Wi-Fi của tôi 866 Mbps" ngay cạnh một lượt tải chạy 4 MB/s. Bitrate là tốc độ điều chế hiện thời trên sóng, phải chia cho mọi máy trên cùng điểm truy nhập, rồi lại giảm tiếp vì bán song công và vì phải phát lại. Thông lượng thật thường chưa tới một nửa con số đó.</li>
<li><strong>Tưởng một máy chỉ có một địa chỉ MAC.</strong> <em>Triệu chứng:</em> một mục đặt trước DHCP chạy được khi cắm dây mà không chạy khi dùng Wi-Fi. Mỗi card có MAC riêng, và điện thoại cùng laptop đời mới còn <em>ngẫu nhiên hoá</em> MAC không dây theo từng SSID để bảo vệ riêng tư — nên cùng một laptop có thể xuất hiện với nhiều MAC.</li>
<li><strong>Cho rằng card có dây luôn được dùng khi cả hai cùng nối.</strong> <em>Triệu chứng:</em> bạn rút dây và nghĩ chẳng có gì đổi, rồi mọi phiên làm việc rớt hết. Dùng giao diện nào là quyết định theo metric định tuyến; hãy kiểm bằng <code>ip route get</code> thay vì đoán.</li>
<li><strong>Bắt gói trên laptop rồi đổ lỗi cho switch.</strong> <em>Triệu chứng:</em> "switch đang vứt khung của tôi" trong khi bộ đếm ngay trên card của bạn đã báo lỗi RX. Hãy luôn đọc bộ đếm của chính mình trước: nó miễn phí, tức thì, và rất thường xuyên kết thúc luôn cuộc điều tra.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> On your own machine, produce the four-column comparison from Part D. Then explain, in two sentences, why the wired duplex is "full" and the wireless one is not.</p>
<p><strong>2.</strong> <code>ethtool eth0</code> reports <code>Speed: 100Mb/s, Duplex: Full</code> on a cable you crimped yourself, plugged into a gigabit switch. Give the two most likely causes and how to tell them apart.</p>
<p><strong>3.</strong> <code>ip -s link show eth0</code> shows 12 000 RX errors, and the number is unchanged after an hour. Is this a live fault? Explain.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> The wired link has a dedicated pair for each direction (or, at gigabit, bidirectional signalling on all four pairs with echo cancellation), so both ends can transmit simultaneously — full duplex. A radio uses one shared channel: a station that transmitted and listened at the same time would only hear its own transmitter, so 802.11 is inherently half duplex and avoids collisions with CSMA/CA instead of detecting them.</p>
<p><strong>2.</strong> Either (a) only two pairs are connected — pins 1-2 and 3-6 crimped, the rest missing or taken from the wrong pairs, which is enough for 100 Mbps and not for gigabit; or (b) one side has speed forced to 100. Tell them apart by running <code>ethtool eth0</code> and reading <em>Auto-negotiation</em>: if it says "on" at both ends and you still get 100, the cable is the suspect — confirm by swapping in a factory patch lead.</p>
<p><strong>3.</strong> No. A counter that is not increasing is history, not a live fault — those errors could date from a cable being moved months ago, since counters reset only on reboot or on an explicit clear. The test that matters is the <em>rate</em>: read the counter twice with a known gap (<code>watch -n 5</code>) and act only if it climbs.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Trên chính máy bạn, hãy dựng bảng so sánh bốn cột của Phần D. Rồi giải thích trong hai câu vì sao duplex bên có dây là "full" còn bên không dây thì không.</p>
<p><strong>2.</strong> <code>ethtool eth0</code> báo <code>Speed: 100Mb/s, Duplex: Full</code> trên một sợi dây bạn tự bấm, cắm vào switch gigabit. Nêu hai nguyên nhân khả dĩ nhất và cách phân biệt chúng.</p>
<p><strong>3.</strong> <code>ip -s link show eth0</code> hiện 12 000 lỗi RX, và sau một giờ con số đó không đổi. Đây có phải sự cố đang diễn ra không? Giải thích.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> Đường có dây có một đôi riêng cho mỗi chiều (hoặc, ở gigabit, là truyền hai chiều trên cả bốn đôi kèm khử tiếng vọng), nên hai đầu phát được cùng lúc — đó là song công đầy đủ. Sóng vô tuyến chỉ có một kênh dùng chung: một trạm vừa phát vừa nghe thì chỉ nghe thấy chính máy phát của nó, nên 802.11 vốn dĩ là bán song công và nó tránh xung đột bằng CSMA/CA thay vì phát hiện xung đột.</p>
<p><strong>2.</strong> Hoặc (a) chỉ có hai đôi được nối — chân 1-2 và 3-6 đã bấm, phần còn lại thiếu hoặc lấy nhầm đôi, đủ cho 100 Mbps nhưng không đủ cho gigabit; hoặc (b) một bên bị ép cứng tốc độ 100. Phân biệt bằng cách chạy <code>ethtool eth0</code> và đọc dòng <em>Auto-negotiation</em>: nếu cả hai đầu đều "on" mà vẫn ra 100 thì nghi sợi cáp — xác nhận bằng cách thay bằng dây nhảy làm sẵn của nhà máy.</p>
<p><strong>3.</strong> Không. Một bộ đếm không tăng là chuyện quá khứ, không phải sự cố đang diễn ra — số lỗi đó có thể có từ hồi ai đó xê dịch sợi cáp mấy tháng trước, vì bộ đếm chỉ về 0 khi khởi động lại hoặc khi được xoá thủ công. Phép thử đáng tin là <em>tốc độ tăng</em>: đọc bộ đếm hai lần cách nhau một khoảng đã biết (<code>watch -n 5</code>) và chỉ hành động nếu nó còn leo.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 4 — The Physical Layer|||Quiz Chương 4 — Tầng vật lý',
  slug: 'nwc204-ch4-quiz',
  type: 'QUIZ',
  description: '10 câu song ngữ cho chương 4: mục đích của tầng vật lý, bandwidth so với throughput, mã hoá tín hiệu, cáp đồng và ba kẻ thù của nó, phân loại UTP, T568A/B, loại dây, cáp quang đơn mode và đa mode, và giới hạn của không dây. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('What does the physical layer actually do?|||Tầng vật lý thật sự làm gì?',
        ['Chooses the best path between networks|||Chọn đường tốt nhất giữa các mạng', 'Adds MAC addresses to the frame|||Thêm địa chỉ MAC vào khung', 'Encodes a finished frame into signals on the medium|||Mã hoá một khung hoàn chỉnh thành tín hiệu trên môi trường truyền', 'Guarantees delivery and resends lost data|||Bảo đảm dữ liệu tới nơi và gửi lại phần bị mất'],
        2,
        'The physical layer accepts a complete frame from the data link layer and turns it into voltage, light or radio, then reverses that at the far end. It carries no addresses at all — path selection is layer 3, MAC addressing is layer 2, and guaranteed delivery is TCP at layer 4.|||Tầng vật lý nhận một khung trọn vẹn từ tầng liên kết dữ liệu và biến nó thành điện áp, ánh sáng hoặc sóng, rồi làm ngược lại ở đầu kia. Nó không mang địa chỉ nào — chọn đường là tầng 3, đánh địa chỉ MAC là tầng 2, còn bảo đảm dữ liệu tới nơi là TCP ở tầng 4.'),

      q('A 100 Mbps link is working perfectly. What is the fastest a file can arrive?|||Một đường 100 Mbps chạy hoàn hảo. File về nhanh nhất là bao nhiêu?',
        ['100 MB/s', 'About 12.5 MB/s|||Khoảng 12,5 MB/s', '800 MB/s', '10 MB/s'],
        1,
        'Link speeds are quoted in bits per second and file transfers are shown in bytes per second, so divide by eight: 100 Mbps is about 12.5 MB/s at best, and real goodput is a little lower after Ethernet, IP and TCP headers. A user reporting 12 MB/s on a 100 Mbps line is reporting a healthy line.|||Tốc độ đường truyền ghi theo bit trên giây còn tải file hiện theo byte trên giây, nên phải chia cho tám: 100 Mbps là khoảng 12,5 MB/s kịch trần, và goodput thật còn thấp hơn chút sau khi trừ tiêu đề Ethernet, IP và TCP. Người dùng báo 12 MB/s trên đường 100 Mbps là đang mô tả một đường truyền khoẻ mạnh.'),

      q('Why does Manchester encoding cost twice the signalling rate of NRZ?|||Vì sao mã Manchester tốn gấp đôi tốc độ phát tín hiệu so với NRZ?',
        ['It sends every bit twice for reliability|||Nó gửi mỗi bit hai lần cho chắc', 'It guarantees a transition in the middle of every bit so the clock can be recovered|||Nó bảo đảm có một lần chuyển mức giữa mỗi bit để khôi phục được đồng hồ', 'It uses four voltage levels instead of two|||Nó dùng bốn mức điện áp thay vì hai', 'It adds a parity bit to every bit|||Nó thêm một bit chẵn lẻ cho mỗi bit'],
        1,
        'Manchester puts a transition in the middle of every bit: low-to-high is a 1, high-to-low is a 0. The receiver therefore recovers its clock from the data and never drifts, even on long runs of identical bits — but it needs two signal levels per bit, so the signalling rate is double the data rate.|||Manchester đặt một lần chuyển mức ở giữa mỗi bit: thấp lên cao là 1, cao xuống thấp là 0. Nhờ vậy bên nhận khôi phục được đồng hồ từ chính dữ liệu và không bao giờ trôi, kể cả khi gặp chuỗi dài bit giống nhau — nhưng nó cần hai mức tín hiệu cho mỗi bit, nên tốc độ phát tín hiệu gấp đôi tốc độ dữ liệu.'),

      q('Which copper problem is caused by one pair leaking into its neighbour inside the same cable?|||Sự cố cáp đồng nào là do một đôi dây rò sang đôi bên cạnh ngay trong cùng sợi cáp?',
        ['Attenuation|||Suy hao', 'EMI', 'Crosstalk|||Xuyên âm', 'Modal dispersion|||Tán sắc mode'],
        2,
        'Crosstalk is internal leakage between pairs, and the usual cause is a crimp that untwists the pairs at the plug. Attenuation is the signal fading with distance, EMI comes from outside sources such as motors and lights, and modal dispersion only exists in multimode fibre.|||Xuyên âm là hiện tượng rò giữa các đôi bên trong cáp, và nguyên nhân thường gặp là mối bấm làm tở xoắn ở đầu nối. Suy hao là tín hiệu yếu dần theo khoảng cách, EMI đến từ nguồn bên ngoài như động cơ và đèn, còn tán sắc mode chỉ tồn tại trong cáp quang đa mode.'),

      q('Which UTP category gives 10 Gbps over the full 100 m?|||Loại cáp UTP nào cho 10 Gbps trên đủ 100 m?',
        ['Cat 5e', 'Cat 6', 'Cat 6a', 'Cat 8'],
        2,
        'Cat 6a is rated 500 MHz and carries 10 Gbps to 100 m. Cat 5e tops out at 1 Gbps, Cat 6 reaches 10 Gbps only to 55 m, and Cat 8 does 25-40 Gbps but only to 30 m, so it is a rack-to-rack cable rather than a building cable.|||Cat 6a được định mức 500 MHz và chở 10 Gbps tới 100 m. Cat 5e chỉ tới 1 Gbps, Cat 6 đạt 10 Gbps nhưng chỉ tới 55 m, còn Cat 8 chạy 25-40 Gbps nhưng chỉ 30 m nên là dây nối tủ rack chứ không phải dây đi trong toà nhà.'),

      q('What is the only difference between T568A and T568B?|||Khác biệt duy nhất giữa T568A và T568B là gì?',
        ['The green pair and the orange pair swap places|||Đôi xanh lá và đôi cam đổi chỗ cho nhau', 'The blue pair and the brown pair swap places|||Đôi xanh dương và đôi nâu đổi chỗ cho nhau', 'T568A uses four pairs and T568B uses two|||T568A dùng bốn đôi còn T568B dùng hai đôi', 'T568B reverses all eight pins|||T568B đảo ngược cả tám chân'],
        0,
        'Pins 4, 5, 7 and 8 (blue, white/blue, white/brown, brown) are identical in both standards; only the green and orange pairs are exchanged. Either standard is valid, but a straight-through cable must use the same one at both ends, or it becomes a crossover.|||Chân 4, 5, 7 và 8 (dương, trắng-dương, trắng-nâu, nâu) giống hệt nhau ở cả hai chuẩn; chỉ có đôi xanh lá và đôi cam hoán đổi. Chuẩn nào cũng hợp lệ, nhưng dây straight-through phải dùng cùng một chuẩn ở hai đầu, nếu không nó thành dây crossover.'),

      q('You need to connect a PC serial port to a switch console port. Which cable?|||Bạn cần nối cổng serial của PC vào cổng console của switch. Dùng dây nào?',
        ['Straight-through', 'Crossover', 'Rollover', 'Fibre patch|||Dây nhảy quang'],
        2,
        'A rollover cable reverses the pins 1-8 to 8-1 and is not Ethernet at all: it is how you reach the console of a device that has no IP address yet. Straight-through joins different device types, crossover joins the same device type, and neither carries console traffic.|||Dây rollover đảo chân 1-8 thành 8-1 và hoàn toàn không phải Ethernet: đây là cách bạn vào được cổng console của một thiết bị chưa có địa chỉ IP. Straight-through nối hai loại thiết bị khác nhau, crossover nối hai thiết bị cùng loại, và không dây nào chở được lưu lượng console.'),

      q('What limits the distance of MULTIMODE fibre?|||Cái gì giới hạn khoảng cách của cáp quang ĐA MODE?',
        ['EMI from nearby motors|||Nhiễu EMI từ động cơ gần đó', 'Modal dispersion — the light paths are different lengths|||Tán sắc mode — các đường đi của ánh sáng dài ngắn khác nhau', 'Crosstalk between the two strands|||Xuyên âm giữa hai sợi', 'The 100 m Ethernet timing budget|||Quỹ thời gian 100 m của Ethernet'],
        1,
        'A 50 or 62.5 µm core allows many light paths, and the longer paths arrive later, smearing the pulse until bits overlap — that is modal dispersion, and it caps multimode at roughly 550 m at 10 Gbps. Fibre is immune to EMI and has no crosstalk, and the 100 m rule belongs to copper.|||Lõi 50 hoặc 62,5 µm cho phép nhiều đường đi của ánh sáng, và các đường dài hơn tới muộn hơn, làm nhoè xung cho tới khi các bit chồng lên nhau — đó là tán sắc mode, và nó chặn cáp đa mode ở khoảng 550 m tại 10 Gbps. Cáp quang miễn nhiễm EMI và không có xuyên âm, còn luật 100 m là của cáp đồng.'),

      q('A fibre link between two switches is dark. The optics are new and the correct type. What do you try first?|||Một tuyến quang giữa hai switch tối đen. Bộ quang mới và đúng loại. Bạn thử gì trước?',
        ['Replace both switches|||Thay cả hai switch', 'Swap the two strands at one end|||Đổi chỗ hai sợi ở một đầu', 'Shorten the cable|||Rút ngắn sợi cáp', 'Force the speed to 1 Gbps|||Ép cứng tốc độ về 1 Gbps'],
        1,
        'Each strand carries light in one direction, so the TX of one end must reach the RX of the other. A crossed pair is by far the commonest cause of a dark link with good optics, it takes ten seconds and needs no parts. Only after that should you clean the connectors and test with a light source.|||Mỗi sợi chỉ chở ánh sáng theo một chiều, nên TX của đầu này phải tới được RX của đầu kia. Cắm ngược hai sợi là nguyên nhân phổ biến nhất của một tuyến tối đen trong khi bộ quang vẫn tốt, nó mất mười giây và không cần thay linh kiện. Xong việc đó mới tới lau đầu nối và đo bằng nguồn sáng.'),

      q('Why is 802.11 wireless half duplex?|||Vì sao mạng không dây 802.11 là bán song công?',
        ['The standard forbids full duplex to save power|||Chuẩn cấm song công đầy đủ để tiết kiệm điện', 'A station that transmitted and listened at once would only hear its own transmitter|||Một trạm vừa phát vừa nghe thì chỉ nghe thấy chính máy phát của nó', 'Wireless NICs have only one antenna|||Card không dây chỉ có một ăng-ten', 'Because WPA2 encryption is one-directional|||Vì mã hoá WPA2 chỉ đi một chiều'],
        1,
        'The radio shares one channel, and a transmitter drowns out anything the same station could receive, so 802.11 cannot detect collisions and avoids them instead with CSMA/CA. MIMO devices have several antennas and it is still half duplex, and encryption has nothing to do with it.|||Sóng dùng chung một kênh, và bộ phát sẽ át hết những gì chính trạm đó có thể nhận, nên 802.11 không phát hiện được xung đột mà phải tránh xung đột bằng CSMA/CA. Thiết bị MIMO có nhiều ăng-ten mà vẫn là bán song công, và việc mã hoá không liên quan gì tới chuyện này.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 4 — The Physical Layer (FLM sessions 11–14)|||Chương 4 — Tầng vật lý (buổi 11–14 của FLM)',
    slug: 'nwc204-chuong-4-tang-vat-ly',
    description: 'Cisco Module 4 theo đúng buổi 11–14 của FLM: mục đích và đặc tính tầng vật lý, bandwidth so với throughput, mã hoá tín hiệu, cáp đồng và ba kẻ thù của nó, UTP và T568A/B, cáp quang đơn mode và đa mode, môi trường không dây, và Lab 1.3 đọc thông tin card mạng. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
