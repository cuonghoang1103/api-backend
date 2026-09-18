/**
 * CSI106 · Chương 4 — Computer Networks and Internet, học theo từng slide (slide 1–32).
 * Deck 'csi4' (CSI4), 32 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi4/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_04.pptx của trường (/tmp/csi106-text/csi4.txt).
 * Các slide nặng sơ đồ (5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 22, 23, 25, 26, 27,
 * 28, 29, 30, 31, 32) đã được đọc thẳng từ ảnh đã render để lấy đúng từng nhãn trong hình.
 *
 * Giáo trình gốc: Forouzan, "Foundations of Computer Science", chương 6. Ứng với CLO4,
 * lịch buổi 17–18.
 *
 * Những chỗ SLIDE GỐC SAI, GÕ NHẦM hoặc ĐÃ LỖI THỜI — đã nêu rõ trong bài, KHÔNG im lặng
 * chép lại và KHÔNG tự ý sửa slide:
 *   · slide 2 và 12 gõ nhầm "netwoking" (đúng: networking).
 *   · slide 5 gõ nhầm "A device cab be also be" (đúng: can also be).
 *   · slide 20 tiêu đề "Translayer-Layer Protocols" — đúng phải là "Transport-Layer Protocols".
 *   · slide 20 nói datagram UDP "total length needs to be less 65 535 bytes": trường Length
 *     16 bit nên TỔNG (header 8 byte + dữ liệu) tối đa đúng 65.535, phần dữ liệu tối đa 65.527.
 *   · slide 23 hình in hex "8003071E" cho địa chỉ 129.3.7.30 — byte đầu 129 = 0x81, nên giá
 *     trị đúng là 8103071E; 0x80 ứng với 128.
 *   · slide 26 gõ nhầm "Wred LANs" (đúng: Wired LANs).
 *   · slide 26 dừng ở 10 Gigabit Ethernet — chuẩn 25/40/100/400 Gb/s đã có từ 2010–2017,
 *     800 Gb/s (802.3df) năm 2024.
 *   · slide 27 chỉ nói BSS/ESS, không nêu thế hệ — Wi-Fi 5 (2013), Wi-Fi 6 (2019), Wi-Fi 7 (2024).
 *   · slide 28 và slide 29 CÙNG mang nhãn "Figure 4.17"; không có hình nào mang số 4.18.
 *   · slide 29 viết "It provide two types of services (fixed WiMax)" — câu cụt, chỉ kể một
 *     loại; WiMAX có fixed (802.16d, 2004) và mobile (802.16e, 2005). Và WiMAX trên thực tế
 *     đã bị LTE/5G thay thế gần như hoàn toàn.
 *   · slide 30 và slide 31 CÙNG mang nhãn "Figure 4.19".
 *   · slide 16 nói inverse domain "now deprecated" — vùng in-addr.arpa (bản ghi PTR) vẫn
 *     đang chạy và bắt buộc với máy chủ thư điện tử; chỉ cách tổ chức cũ là bỏ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi4';

export default {
  title: '4.0 — Slide by slide: Networks, LAN/WAN, the TCP/IP suite and its layers (32 slides)|||4.0 — Slide bài giảng: Mạng máy tính, LAN/WAN, bộ giao thức TCP/IP & các tầng (32 slide)',
  slug: 'csi106-4-0-slides-mang-tcp-ip',
  type: 'DOCUMENT',
  description: 'Toàn bộ Chương 4 của CSI106 (32 slide) đi theo đúng bộ slide của trường: mạng là gì, LAN và WAN khác nhau ở bốn điểm, Internet gồm backbone – provider – customer network, rồi bộ giao thức TCP/IP với năm tầng và quan hệ giữa chúng — ứng dụng, giao vận, mạng, liên kết dữ liệu, vật lý. Mỗi slide được giảng kèm con số thật (IPv4 32 bit = 2^32 ≈ 4,3 tỉ địa chỉ đã cạn, IPv6 128 bit, MAC 48 bit, cổng 0–65.535, header UDP 8 byte và TCP 20–60 byte, khung Ethernet 64–1518 byte) và một câu chuyện xâu chuỗi cả chương: điều gì thật sự xảy ra từ lúc bạn gõ cuongthai.com tới lúc trang hiện ra. Những chỗ slide gốc gõ nhầm, trùng số hình hoặc đã lỗi thời đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 32),
    walk(D, [

      [1, '4. Computer Networks and Internet',
        `<p class="y-chinh">🎯 The title slide of Chapter 4. Notice the two nouns: <strong>Computer Networks</strong> (the general idea — any set of devices wired together so they can talk) and <strong>Internet</strong> (one specific, enormous instance of that idea). The whole chapter moves from the first noun to the second.</p>
<ul>
<li><strong>Where this chapter sits in the course</strong> — Chapters 1–3 built a single machine: how it is organised, how it counts, how it stores data. Chapter 4 is the first chapter where <em>two</em> machines exist. Every idea here is about getting a bit pattern out of one machine and into another one correctly.</li>
<li><strong>Textbook mapping</strong> — this deck is Forouzan, <em>Foundations of Computer Science</em>, Chapter 6 ("Computer Networks and Internet"). That is why several figures still carry their book numbers: slide 9 shows "Figure 6.5", slide 13 shows "Figure 6.10", slide 8 shows "Figure 6.4". Do not be confused when the caption underneath renumbers them 4.x.</li>
<li><strong>The learning outcome</strong> — this chapter is CLO4 of CSI106, taught in sessions 17–18. Exam questions from it are almost always: name the layer, name the data unit, name the address, name the device, or compare two things (LAN vs WAN, TCP vs UDP, IPv4 vs IPv6).</li>
<li><strong>Why it is easier than it looks</strong> — the entire chapter is one repeated pattern: <em>five layers, each with a job, an address, a data unit and a device</em>. Once you can fill in that four-column table from memory you have most of the marks.</li>
<li><strong>One sentence to carry through</strong> — a network does not move "a file". It moves millions of small labelled boxes, each of which is individually addressed, and a stack of five protocols is what turns your file into those boxes and back again.</li>
</ul>
<p class="meo">💡 Start a single page now with five rows — Application, Transport, Network, Data-link, Physical — and four empty columns: <em>job · address · data unit · device</em>. You will fill one cell at a time as the slides go by, and by slide 32 that page IS the chapter.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề Chương 4. Để ý hai danh từ: <strong>Computer Networks</strong> (ý niệm chung — bất kỳ tập thiết bị nào nối với nhau để nói chuyện được) và <strong>Internet</strong> (một hiện thân cụ thể, khổng lồ, của ý niệm ấy). Cả chương đi từ danh từ thứ nhất sang danh từ thứ hai.</p>
<ul>
<li><strong>Chương này nằm ở đâu trong môn</strong> — Chương 1–3 dựng một cỗ máy đơn độc: tổ chức ra sao, đếm thế nào, cất dữ liệu kiểu gì. Chương 4 là chương đầu tiên có <em>hai</em> cỗ máy. Mọi ý trong đây đều xoay quanh việc đưa một mẫu bit ra khỏi máy này và vào máy kia cho đúng.</li>
<li><strong>Ánh xạ về giáo trình</strong> — bộ slide này là Chương 6 của Forouzan, <em>Foundations of Computer Science</em> ("Computer Networks and Internet"). Vì thế nhiều hình vẫn còn giữ số của sách: slide 9 hiện "Figure 6.5", slide 13 hiện "Figure 6.10", slide 8 hiện "Figure 6.4". Đừng rối khi dòng chú thích bên dưới đánh lại thành 4.x.</li>
<li><strong>Chuẩn đầu ra</strong> — chương này là CLO4 của CSI106, dạy ở buổi 17–18. Câu hỏi thi từ đây gần như luôn là: gọi tên tầng, gọi tên đơn vị dữ liệu, gọi tên địa chỉ, gọi tên thiết bị, hoặc so sánh hai thứ (LAN với WAN, TCP với UDP, IPv4 với IPv6).</li>
<li><strong>Vì sao nó dễ hơn vẻ ngoài</strong> — cả chương chỉ là một khuôn lặp lại: <em>năm tầng, mỗi tầng có một việc, một địa chỉ, một đơn vị dữ liệu và một thiết bị</em>. Điền được cái bảng bốn cột ấy từ trí nhớ là bạn đã ăn phần lớn số điểm.</li>
<li><strong>Một câu mang theo suốt chương</strong> — mạng không chuyển "một file". Nó chuyển hàng triệu cái hộp nhỏ có dán nhãn, mỗi hộp được đánh địa chỉ riêng, và một chồng năm giao thức chính là thứ biến file của bạn thành các hộp ấy rồi ghép ngược lại.</li>
</ul>
<p class="meo">💡 Mở ngay một tờ giấy, kẻ năm dòng — Application, Transport, Network, Data-link, Physical — và bốn cột trống: <em>việc · địa chỉ · đơn vị dữ liệu · thiết bị</em>. Cứ mỗi slide bạn điền thêm một ô, tới slide 32 thì tờ giấy đó CHÍNH LÀ cả chương.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 The map of the chapter in two sections. Section <strong>4.1 Overview</strong> answers "what is a network at all?" (LAN, WAN, the Internet, and why we need protocols). Section <strong>4.2 Layers in networking</strong> then walks the five layers of TCP/IP, one section each.</p>
<ul>
<li><strong>4.1 Overview</strong> (slides 4–11) — the definition of a network, LAN, WAN, the Internet as a hierarchy of ISPs, the idea of protocol layering, the TCP/IP suite, and the table of addresses and packet names. Seven slides, and they contain roughly half the vocabulary of the chapter.</li>
<li><strong>LAN &amp; WAN</strong> — flagged separately on this slide because the four-point comparison between them is a guaranteed exam item (size, what they connect, who owns them, who runs them). Slides 6 and 7.</li>
<li><strong>TCP/IP protocol</strong> — the single most important noun in the chapter. Slides 9, 10 and 11 introduce it; the whole of 4.2 then unpacks it layer by layer.</li>
<li><strong>4.2 Layers in networking</strong> (slides 12–32) — five subsections in top-down order: 2.1 application (13–16), 2.2 transport (17–20), 2.3 network (21–23), 2.4 data-link (24–29), 2.5 physical (30–31), then the summary table on 32.</li>
<li><strong>Why top-down</strong> — slide 13 says it explicitly: "we start from the fifth layer and move to the first layer". That is a teaching choice, and a good one: you meet the layer you already use every day (the web, email) before the layer made of voltages.</li>
</ul>
<p class="pitfall">⚠️ The slide has a typo — "netwoking" instead of "networking" — and it repeats on slide 12. Harmless, but it tells you these decks are lightly proofread; there are five more typos and two duplicated figure numbers ahead, and this walkthrough will point out each one so you do not memorise a mistake.</p>`,
        `<p class="y-chinh">🎯 Bản đồ chương, gồm hai mục. Mục <strong>4.1 Overview</strong> trả lời "rốt cuộc mạng là cái gì?" (LAN, WAN, Internet, và vì sao cần giao thức). Mục <strong>4.2 Layers in networking</strong> sau đó đi hết năm tầng của TCP/IP, mỗi tầng một tiểu mục.</p>
<ul>
<li><strong>4.1 Overview</strong> (slide 4–11) — định nghĩa mạng, LAN, WAN, Internet như một hệ thứ bậc các ISP, ý tưởng phân tầng giao thức, bộ giao thức TCP/IP, và bảng địa chỉ – tên gói tin. Bảy slide, và chúng chứa chừng một nửa số thuật ngữ của cả chương.</li>
<li><strong>LAN &amp; WAN</strong> — được nêu riêng ở đây vì bảng so sánh bốn điểm giữa chúng là món chắc chắn có trong đề (quy mô, nối cái gì, ai sở hữu, ai vận hành). Slide 6 và 7.</li>
<li><strong>TCP/IP protocol</strong> — danh từ quan trọng nhất cả chương. Slide 9, 10, 11 giới thiệu; toàn bộ mục 4.2 sau đó bóc từng tầng.</li>
<li><strong>4.2 Layers in networking</strong> (slide 12–32) — năm tiểu mục theo thứ tự từ trên xuống: 2.1 ứng dụng (13–16), 2.2 giao vận (17–20), 2.3 mạng (21–23), 2.4 liên kết dữ liệu (24–29), 2.5 vật lý (30–31), rồi bảng tổng kết ở slide 32.</li>
<li><strong>Vì sao đi từ trên xuống</strong> — slide 13 nói thẳng: "ta bắt đầu từ tầng thứ năm và đi xuống tầng thứ nhất". Đó là một lựa chọn sư phạm, và là lựa chọn hay: bạn gặp cái tầng mình dùng hằng ngày (web, thư điện tử) trước cái tầng làm bằng hiệu điện thế.</li>
</ul>
<p class="pitfall">⚠️ Slide có lỗi gõ — "netwoking" thay vì "networking" — và lỗi ấy lặp lại ở slide 12. Vô hại, nhưng nó cho bạn biết bộ slide này được soát rất nhẹ; phía trước còn năm lỗi gõ nữa và hai lần trùng số hình, bài này sẽ chỉ ra từng chỗ để bạn không học thuộc một cái sai.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Six objectives, and every one of them starts with a verb of description or definition. Read them as six exam questions, because that is exactly what they become.</p>
<ul>
<li><strong>"Describe local and wide area networks (LANs and WANs)"</strong> — slides 6–7. The answer is not "a LAN is small" — it is the four-way comparison: geographic span, what is interconnected (hosts vs connecting devices), ownership, and operator.</li>
<li><strong>"Distinguish an internet from the Internet"</strong> — this is the subtlest objective on the slide and it hangs on a capital letter. <em>an internet</em> (lowercase, short for inter-network) = any two or more networks joined so they can communicate; <em>the Internet</em> (capital I) = the one specific global internet we all use, built from backbones, provider networks and customer networks. Slide 8.</li>
<li><strong>"Describe the TCP/IP protocol suite as the network model in the Internet"</strong> — slides 9–11. A <em>suite</em> means a set of protocols organised in layers, not a single protocol.</li>
<li><strong>"Define the layers in the TCP/IP protocol suite and their relationship"</strong> — the heart of the chapter, slides 12–32. "Their relationship" is the key phrase: each layer uses the service of the layer below and provides a service to the layer above; layer N at the sender talks <em>logically</em> to layer N at the receiver.</li>
<li><strong>"Describe the applications in the Internet"</strong> — slides 14–16: client-server and peer-to-peer, then HTTP, FTP, SSH, email and DNS.</li>
<li><strong>"Describe the different transmission media"</strong> — slides 26–31: twisted pair and fibre in Ethernet, radio in Wi-Fi and WiMAX, coaxial in cable service, and the analog/digital conversions of the physical layer.</li>
</ul>
<p class="meo">💡 The "internet vs Internet" distinction is worth one clean sentence you can write under pressure: <strong>an internet is a category; the Internet is the proper name of the one everybody joined.</strong> Same trick as "a road" versus "Route 1".</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu, và mục nào cũng bắt đầu bằng một động từ mô tả hoặc định nghĩa. Hãy đọc chúng như sáu câu hỏi thi, vì đúng là chúng sẽ thành sáu câu hỏi thi.</p>
<ul>
<li><strong>"Mô tả LAN và WAN"</strong> — slide 6–7. Đáp án KHÔNG phải "LAN thì nhỏ" — mà là bảng so sánh bốn chiều: phạm vi địa lý, nối cái gì (host hay thiết bị nối), ai sở hữu, ai vận hành.</li>
<li><strong>"Phân biệt an internet với the Internet"</strong> — đây là mục tiêu tinh tế nhất trên slide và nó treo vào một chữ hoa. <em>an internet</em> (chữ thường, viết tắt của inter-network) = hai mạng trở lên nối được với nhau để liên lạc; <em>the Internet</em> (chữ I hoa) = cái liên mạng toàn cầu cụ thể mà tất cả chúng ta đang dùng, dựng từ backbone, provider network và customer network. Slide 8.</li>
<li><strong>"Mô tả bộ giao thức TCP/IP như mô hình mạng của Internet"</strong> — slide 9–11. Chữ <em>suite</em> nghĩa là một TẬP giao thức xếp theo tầng, không phải một giao thức đơn lẻ.</li>
<li><strong>"Định nghĩa các tầng trong bộ TCP/IP và quan hệ giữa chúng"</strong> — trái tim của chương, slide 12–32. Cụm "quan hệ giữa chúng" mới là chỗ mấu chốt: mỗi tầng dùng dịch vụ của tầng dưới và cung cấp dịch vụ cho tầng trên; tầng N ở bên gửi nói chuyện <em>lô-gic</em> với tầng N ở bên nhận.</li>
<li><strong>"Mô tả các ứng dụng trên Internet"</strong> — slide 14–16: mô hình khách–chủ và ngang hàng, rồi HTTP, FTP, SSH, thư điện tử và DNS.</li>
<li><strong>"Mô tả các môi trường truyền dẫn"</strong> — slide 26–31: cáp xoắn đôi và sợi quang trong Ethernet, sóng vô tuyến trong Wi-Fi và WiMAX, cáp đồng trục trong dịch vụ truyền hình cáp, và các phép biến đổi tương tự/số ở tầng vật lý.</li>
</ul>
<p class="meo">💡 Chỗ "internet với Internet" đáng có một câu gọn để viết ra khi bí: <strong>an internet là một LOẠI; the Internet là TÊN RIÊNG của cái mà cả thế giới đã vào.</strong> Cùng kiểu với "một con đường" so với "Quốc lộ 1".</p>`],

      [4, '1 - Overview',
        `<p class="y-chinh">🎯 A section divider opening Part 1. The next seven slides answer four questions in order: <em>what is a network? · what is a small one? · what is a big one? · what is the biggest one?</em> — then two slides on why protocols must be layered.</p>
<ul>
<li><strong>The escalation pattern</strong> — slide 5 defines a network in one sentence; slide 6 shrinks it to a LAN; slide 7 stretches it to a WAN; slide 8 joins many of both into the Internet. Each slide is one step up in scale, and nothing new in principle.</li>
<li><strong>What is deliberately left out</strong> — the overview says nothing about how data actually travels. That is on purpose: you first agree on <em>what things are called</em>, then you learn how they work. Slides 9–11 supply the vocabulary that makes Part 2 readable.</li>
<li><strong>The three device words to nail here</strong> — <em>host</em> (an end system, the thing that produces or consumes data), <em>switch</em> (joins hosts inside one network), <em>router</em> (joins networks to each other). Almost every diagram from here to slide 32 contains exactly these three shapes.</li>
<li><strong>Why "overview" is not optional reading</strong> — the definitions in slides 5–8 are short enough to feel skippable, and they are the most frequently examined sentences of the whole chapter, because they are the only ones that can be asked as a one-mark multiple choice.</li>
<li><strong>Scale, for perspective</strong> — the Internet today carries traffic for roughly 5,5 billion users and joins on the order of 75,000 independently operated networks (autonomous systems). Every one of them is either a customer, a provider or a backbone in the picture on slide 8.</li>
</ul>
<p class="meo">💡 Read slides 5–8 as a single zoom-out: one device → one room → one country → the world. If you can say what changes at each zoom level (who owns it, what it connects), you have understood Part 1.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở đầu Phần 1. Bảy slide tiếp theo trả lời bốn câu hỏi theo thứ tự: <em>mạng là gì? · mạng nhỏ là gì? · mạng lớn là gì? · mạng lớn nhất là gì?</em> — rồi hai slide nói vì sao giao thức phải phân tầng.</p>
<ul>
<li><strong>Khuôn leo thang</strong> — slide 5 định nghĩa mạng trong một câu; slide 6 thu nó lại thành LAN; slide 7 kéo nó ra thành WAN; slide 8 gộp nhiều cái cả hai loại thành Internet. Mỗi slide lên một nấc quy mô, và về nguyên tắc không có gì mới.</li>
<li><strong>Cái cố tình chưa nói</strong> — phần tổng quan không đả động dữ liệu đi lại thế nào. Đó là cố ý: trước hết thống nhất <em>gọi tên mọi thứ</em>, sau mới học chúng chạy ra sao. Slide 9–11 cấp cho bạn đủ từ vựng để đọc nổi Phần 2.</li>
<li><strong>Ba từ chỉ thiết bị phải chốt ngay ở đây</strong> — <em>host</em> (hệ thống đầu cuối, thứ sinh ra hoặc tiêu thụ dữ liệu), <em>switch</em> (nối các host trong CÙNG một mạng), <em>router</em> (nối các MẠNG với nhau). Gần như mọi sơ đồ từ đây tới slide 32 chỉ gồm đúng ba hình dạng này.</li>
<li><strong>Vì sao "overview" không phải phần đọc lướt</strong> — định nghĩa ở slide 5–8 ngắn tới mức dễ tưởng bỏ qua được, mà lại là những câu bị hỏi nhiều nhất cả chương, vì chúng là những câu duy nhất ra được thành trắc nghiệm một điểm.</li>
<li><strong>Quy mô, để có cảm giác</strong> — Internet hôm nay phục vụ khoảng 5,5 tỉ người dùng và nối chừng 75.000 mạng vận hành độc lập (autonomous system). Mỗi mạng đó đều là một customer, một provider hoặc một backbone trong bức hình slide 8.</li>
</ul>
<p class="meo">💡 Hãy đọc slide 5–8 như một cú thu nhỏ ống kính liên tục: một thiết bị → một căn phòng → một quốc gia → cả thế giới. Nói được ở mỗi nấc cái gì thay đổi (ai sở hữu, nối cái gì) là bạn đã hiểu Phần 1.</p>`],

      [5, '1. Introduction',
        `<p class="y-chinh">🎯 The definition to memorise word for word: <strong>"A network is the interconnection of a set of devices capable of communication."</strong> Everything else on the slide unpacks the word <em>devices</em> into two families and the word <em>interconnection</em> into two media.</p>
<ul>
<li><strong>Family 1 — hosts (end systems)</strong> — the slide lists: a large computer, a desktop, a laptop, a workstation, a cellular phone, a security system. The common property is that a host <em>originates or consumes</em> data. Your phone is a host; so is the CCTV camera in the corridor; so is a printer.</li>
<li><strong>Family 2 — connecting devices</strong> — the slide names three: a <em>router</em> which connects the network to other networks, a <em>switch</em> which connects devices together, a <em>modem</em> that changes the form of data. These never originate the data; they carry someone else's. The box your ISP installs at home is usually all three in one plastic shell plus a Wi-Fi access point.</li>
<li><strong>The media — wired or wireless</strong> — "such as cable or air". Cable means twisted pair (the RJ45 you plug into a PC), coaxial (cable TV, slide 28) or optical fibre. Air means radio: Wi-Fi, 4G/5G, satellite. The chapter's last two slides (30–31) are about what actually travels through them.</li>
<li><strong>Read the figure carefully</strong> — Figure 4.1 shows clients, laptops, a tablet, a Wi-Fi router, a switch labelled "hub switch", servers, a printer, a firewall and a globe labelled "internet". That one picture already contains every noun of section 4.1.</li>
<li><strong>Why "capable of communication" matters</strong> — a device that cannot send or receive is not part of the network even if it sits in the same room. Being physically present and being addressable are different things; the addresses come on slide 11.</li>
</ul>
<p class="pitfall">⚠️ The slide has a typo: "A device <em>cab</em> be also be a connecting device". Read it as "can also be". Worth noticing because a device can genuinely be both at once — a laptop sharing its mobile data is simultaneously a host and a connecting device.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa phải thuộc nguyên văn: <strong>"Mạng là sự kết nối của một tập các thiết bị có khả năng truyền thông."</strong> Phần còn lại của slide chỉ bóc chữ <em>thiết bị</em> thành hai họ và chữ <em>kết nối</em> thành hai môi trường.</p>
<ul>
<li><strong>Họ 1 — host (hệ thống đầu cuối)</strong> — slide liệt kê: máy tính lớn, máy để bàn, laptop, máy trạm, điện thoại di động, hệ thống an ninh. Điểm chung là host <em>sinh ra hoặc tiêu thụ</em> dữ liệu. Cái điện thoại của bạn là host; cái camera ngoài hành lang cũng là host; máy in cũng vậy.</li>
<li><strong>Họ 2 — thiết bị nối</strong> — slide gọi tên ba thứ: <em>router</em> nối mạng này với mạng khác, <em>switch</em> nối các thiết bị với nhau, <em>modem</em> đổi dạng dữ liệu. Chúng không bao giờ sinh ra dữ liệu; chúng chở dữ liệu của người khác. Cái hộp nhà mạng lắp ở nhà bạn thường là cả ba thứ trong một vỏ nhựa, cộng thêm một điểm truy cập Wi-Fi.</li>
<li><strong>Môi trường — có dây hoặc không dây</strong> — "chẳng hạn cáp hoặc không khí". Cáp nghĩa là xoắn đôi (đầu RJ45 bạn cắm vào máy), đồng trục (truyền hình cáp, slide 28) hoặc sợi quang. Không khí nghĩa là sóng vô tuyến: Wi-Fi, 4G/5G, vệ tinh. Hai slide cuối chương (30–31) nói về cái thật sự chạy trong đó.</li>
<li><strong>Nhìn kỹ bức hình</strong> — Hình 4.1 vẽ máy khách, laptop, máy tính bảng, bộ định tuyến Wi-Fi, một switch dán nhãn "hub switch", các máy chủ, máy in, tường lửa và quả địa cầu ghi "internet". Riêng bức tranh ấy đã chứa đủ mọi danh từ của mục 4.1.</li>
<li><strong>Vì sao cụm "có khả năng truyền thông" là quan trọng</strong> — một thiết bị không gửi và không nhận được thì không thuộc về mạng, dù nó ngồi ngay trong phòng. Hiện diện về mặt vật lý và có thể đánh địa chỉ được là hai chuyện khác nhau; phần địa chỉ nằm ở slide 11.</li>
</ul>
<p class="pitfall">⚠️ Slide có lỗi gõ: "A device <em>cab</em> be also be a connecting device". Hãy đọc là "can also be". Đáng để ý vì một thiết bị THẬT SỰ có thể vừa là host vừa là thiết bị nối — cái laptop đang phát chia sẻ 4G chính là cả hai cùng lúc.</p>`],

      [6, '2. Local Area Network (LAN)',
        `<p class="y-chinh">🎯 A LAN is a network you own, inside a space you control: <strong>"usually privately owned and connects some hosts in a single office, building, or campus."</strong> Note the word <em>hosts</em> — remember it, because slide 7 will change exactly that word for the WAN.</p>
<ul>
<li><strong>The range of sizes the slide admits</strong> — "as simple as two PCs and a printer in someone's home office" up to "throughout a company, including audio and video devices". So "LAN" is not a size in metres; it is a statement about ownership and scope.</li>
<li><strong>"Each host in a LAN has an identifier, an address, that uniquely defines the host"</strong> — this is the <strong>MAC address</strong>, 48 bits, written as six hex bytes like <code>3C:22:FB:9A:04:71</code>. 48 bits means 2^48 ≈ 281 nghìn tỉ (281.474.976.710.656) possible values, which is why manufacturers can burn them in at the factory without collisions. The first three bytes identify the manufacturer (the OUI); the last three are that vendor's serial.</li>
<li><strong>"A packet carries both the source and the destination addresses"</strong> — always both. The destination lets the network deliver it; the source lets the other side answer. On slide 26 you will see those two addresses as the first two fields of an Ethernet frame, 6 bytes each.</li>
<li><strong>Read the figure and then correct it mentally</strong> — Figure 4.2 draws PC-1 to PC-4 and a laptop all connected to a central box labelled <strong>HUB</strong>. A hub is a layer-1 device: it repeats every incoming bit out of every other port, so every machine hears every conversation and only one may talk at a time. Hubs have not been sold for about twenty years; the same picture today is a <em>switch</em>, which reads the destination MAC address and sends the frame out of one port only.</li>
<li><strong>What a real LAN looks like now</strong> — a Gigabit Ethernet switch (1 Gb/s per port, cable up to 100 m) plus a Wi-Fi access point; a school lab is one LAN, a home is one LAN, a company floor is one LAN.</li>
</ul>
<p class="meo">💡 Remember the LAN by its address: a LAN is exactly the region where a <strong>MAC address is enough</strong> to find you. The moment you need an IP address to reach something, you have left your LAN.</p>`,
        `<p class="y-chinh">🎯 LAN là mạng bạn sở hữu, nằm trong một không gian bạn kiểm soát: <strong>"thường thuộc sở hữu tư nhân và nối các host trong một văn phòng, một toà nhà hoặc một khuôn viên."</strong> Để ý chữ <em>host</em> — nhớ lấy, vì slide 7 sẽ đổi đúng chữ ấy khi nói về WAN.</p>
<ul>
<li><strong>Khoảng kích thước mà slide cho phép</strong> — "đơn giản như hai cái PC và một máy in trong phòng làm việc ở nhà" cho tới "trải khắp một công ty, gồm cả thiết bị âm thanh và hình ảnh". Vậy "LAN" không phải một con số mét; nó là một phát biểu về quyền sở hữu và phạm vi.</li>
<li><strong>"Mỗi host trong LAN có một định danh, một địa chỉ, xác định duy nhất host đó"</strong> — đó là <strong>địa chỉ MAC</strong>, 48 bit, viết thành sáu byte hệ mười sáu kiểu <code>3C:22:FB:9A:04:71</code>. 48 bit nghĩa là 2^48 ≈ 281 nghìn tỉ (281.474.976.710.656) giá trị, nhờ vậy nhà sản xuất nung sẵn vào phần cứng mà không đụng nhau. Ba byte đầu chỉ nhà sản xuất (mã OUI); ba byte sau là số thứ tự của hãng đó.</li>
<li><strong>"Gói tin mang cả địa chỉ nguồn lẫn địa chỉ đích"</strong> — luôn luôn cả hai. Địa chỉ đích để mạng giao được; địa chỉ nguồn để bên kia trả lời được. Ở slide 26 bạn sẽ thấy đúng hai địa chỉ ấy là hai trường đầu tiên của khung Ethernet, mỗi cái 6 byte.</li>
<li><strong>Nhìn hình rồi tự sửa lại trong đầu</strong> — Hình 4.2 vẽ PC-1 tới PC-4 và một laptop cùng nối vào cái hộp giữa ghi <strong>HUB</strong>. Hub là thiết bị tầng 1: nó lặp lại mọi bit vào ra tất cả các cổng còn lại, nên mọi máy đều nghe được mọi cuộc, và mỗi lúc chỉ một máy được nói. Hub đã ngừng bán chừng hai mươi năm nay; bức hình ấy ngày nay là một <em>switch</em>, thứ đọc địa chỉ MAC đích và chỉ đẩy khung ra đúng một cổng.</li>
<li><strong>LAN thật bây giờ trông thế nào</strong> — một switch Gigabit Ethernet (1 Gb/s mỗi cổng, cáp dài tối đa 100 m) cộng một điểm truy cập Wi-Fi; một phòng máy trường là một LAN, một căn nhà là một LAN, một tầng công ty là một LAN.</li>
</ul>
<p class="meo">💡 Nhớ LAN bằng chính cái địa chỉ của nó: LAN đúng là vùng mà <strong>chỉ cần địa chỉ MAC là tìm được bạn</strong>. Ngay khi phải dùng tới địa chỉ IP để với tới một thứ, bạn đã ra khỏi LAN của mình.</p>`],

      [7, '3. Wide Area Network (WAN)',
        `<p class="y-chinh">🎯 The slide is built as three explicit contrasts with the LAN. Learn it as a table, not as prose — this is the single most predictable comparison question in the chapter.</p>
<table>
<tr><th>Criterion</th><th>LAN</th><th>WAN</th></tr>
<tr><td>Geographic span</td><td>an office, a building, a campus</td><td>a town, a state, a country, or the world</td></tr>
<tr><td>What it interconnects</td><td><strong>hosts</strong> (end systems)</td><td><strong>connecting devices</strong>: switches, routers, modems</td></tr>
<tr><td>Ownership</td><td>privately owned by the organisation that uses it</td><td>owned by a communication company</td></tr>
<tr><td>Who runs it</td><td>the organisation itself</td><td>created and run by the carrier, <em>leased</em> by the user</td></tr>
<tr><td>Typical example</td><td>a lab switch, home Wi-Fi</td><td>a leased fibre line, a satellite link, an ISP backbone</td></tr>
</table>
<ul>
<li><strong>The distinction that actually matters</strong> — not size, but <em>what sits at the ends</em>. A LAN's ports end in computers; a WAN's ports end in other network equipment. That is why a WAN diagram (Figure 4.3) shows four LAN clouds joined through a WAN cloud by gateway routers.</li>
<li><strong>Two kinds of WAN worth naming</strong> — a <em>point-to-point WAN</em> connects exactly two devices through a leased line (you will see the phrase on slide 25's figure); a <em>switched WAN</em> has many endpoints and internal switches, which is what the Internet backbone is.</li>
<li><strong>"Leased" is the commercial fact behind the technical one</strong> — you cannot dig a trench from Hà Nội to Đà Nẵng, so you rent capacity on someone else's fibre. That single economic constraint is why the Internet has the layered ISP shape drawn on slide 8.</li>
<li><strong>A real number for distance</strong> — light in optical fibre travels about 200.000 km/s, so a signal needs roughly 5 ms per 1.000 km one way. Hà Nội to Singapore is about 2.200 km, and a real round-trip ping is 30–50 ms: physics sets the floor, and switching, queueing and routing add the rest.</li>
</ul>
<p class="pitfall">⚠️ A classic trap: "MAN". Some textbooks insert a <em>Metropolitan</em> Area Network between LAN and WAN (a city-sized network, e.g. a cable TV network). This deck never introduces it, but the word appears inside the figure on slide 32 ("LAN, WAN, and MANs protocols"). If a question offers MAN as a choice, it means city-scale.</p>`,
        `<p class="y-chinh">🎯 Slide này được dựng thành ba phép tương phản rành mạch với LAN. Hãy học nó dưới dạng bảng chứ đừng học thành văn xuôi — đây là câu so sánh dễ đoán nhất cả chương.</p>
<table>
<tr><th>Tiêu chí</th><th>LAN</th><th>WAN</th></tr>
<tr><td>Phạm vi địa lý</td><td>một văn phòng, một toà nhà, một khuôn viên</td><td>một thị trấn, một tỉnh, một quốc gia, hoặc cả thế giới</td></tr>
<tr><td>Nối cái gì</td><td><strong>host</strong> (hệ thống đầu cuối)</td><td><strong>thiết bị nối</strong>: switch, router, modem</td></tr>
<tr><td>Sở hữu</td><td>tư nhân, thuộc chính tổ chức đang dùng</td><td>thuộc công ty viễn thông</td></tr>
<tr><td>Ai vận hành</td><td>chính tổ chức đó</td><td>nhà mạng dựng và chạy, người dùng <em>đi THUÊ</em></td></tr>
<tr><td>Ví dụ điển hình</td><td>switch phòng lab, Wi-Fi ở nhà</td><td>đường quang thuê riêng, đường vệ tinh, trục backbone của ISP</td></tr>
</table>
<ul>
<li><strong>Chỗ phân biệt thật sự quan trọng</strong> — không phải kích thước, mà là <em>ở hai đầu có gì</em>. Cổng của LAN kết thúc ở máy tính; cổng của WAN kết thúc ở thiết bị mạng khác. Vì thế sơ đồ WAN (Hình 4.3) vẽ bốn đám mây LAN nối qua một đám mây WAN bằng các router cổng.</li>
<li><strong>Hai loại WAN đáng gọi tên</strong> — <em>WAN điểm-điểm</em> nối đúng hai thiết bị qua một đường thuê riêng (bạn sẽ thấy cụm "point-to-point network" trong hình slide 25); <em>WAN chuyển mạch</em> có nhiều đầu cuối và switch bên trong, và đó chính là trục xương sống của Internet.</li>
<li><strong>Chữ "thuê" là sự thật kinh tế nằm sau sự thật kỹ thuật</strong> — bạn không thể tự đào một rãnh cáp từ Hà Nội vào Đà Nẵng, nên bạn thuê dung lượng trên sợi quang của người khác. Đúng một ràng buộc kinh tế ấy đẻ ra cái hình dạng ISP phân lớp vẽ ở slide 8.</li>
<li><strong>Một con số thật về khoảng cách</strong> — ánh sáng trong sợi quang đi khoảng 200.000 km/s, nên tín hiệu cần chừng 5 ms cho mỗi 1.000 km, một chiều. Hà Nội – Singapore chừng 2.200 km, và ping thực tế khứ hồi là 30–50 ms: vật lý đặt ra cái sàn, phần còn lại là do chuyển mạch, xếp hàng và định tuyến.</li>
</ul>
<p class="pitfall">⚠️ Một bẫy kinh điển: "MAN". Vài giáo trình chèn thêm mạng <em>đô thị</em> (Metropolitan Area Network) vào giữa LAN và WAN — mạng cỡ một thành phố, ví dụ mạng truyền hình cáp. Bộ slide này không hề giới thiệu nó, nhưng chữ ấy CÓ xuất hiện trong hình ở slide 32 ("LAN, WAN, and MANs protocols"). Nếu đề cho MAN làm phương án, nó có nghĩa là quy mô thành phố.</p>`],

      [8, '4. The Internet',
        `<p class="y-chinh">🎯 Two sentences that must not be blurred together. <strong>"An internet is two or more networks that can communicate with each other"</strong> — that is the category. <strong>The Internet</strong> is the one specific internet composed of thousands of interconnected networks, and it has a three-level commercial shape.</p>
<ul>
<li><strong>Level 1 — backbones</strong> — "large networks owned by some communication companies", also called <em>international ISPs</em> or tier-1 providers. They connect to each other at <em>peering points</em> (the black dots in Figure 4.4) and, crucially, pay nobody: they exchange traffic as equals. There are roughly a dozen of them worldwide.</li>
<li><strong>Level 2 — provider networks</strong> — "use the services of the backbones for a fee". National carriers live here: VNPT, Viettel, FPT Telecom in Vietnam.</li>
<li><strong>Level 3 — customer networks</strong> — "at the edge of the Internet, actually use the services and pay fees to provider networks". Your home, your university, a company office. They are the leaves of the tree; they consume, they do not carry other people's traffic.</li>
<li><strong>"Backbones and provider networks are also called ISPs"</strong> — so ISP is not one level, it is everything that sells transit. When you pay a monthly bill you are a customer network buying from a provider network which buys from a backbone.</li>
<li><strong>Why peering points matter to you</strong> — traffic between two Vietnamese users normally stays inside the national exchange (VNIX) and takes a few milliseconds. Traffic to a server in the US goes out on an undersea cable — and when one of those cables (AAG, APG, IA) is cut, which happens most years, your latency to foreign sites jumps while local sites stay fast. Now you can explain why.</li>
</ul>
<p class="dap-an">✅ Answer to the objective "distinguish an internet from the Internet": <em>an internet</em> (lowercase) is any interconnection of two or more networks — a company joining its Hà Nội and HCM offices has built an internet. <em>The Internet</em> (capital I) is the unique global internet, structured as backbones → provider networks → customer networks, which began as ARPANET in 1969 and adopted TCP/IP on 1 January 1983.</p>
<p class="pitfall">⚠️ The slide's own English is loose: "The Internet is as several backbones…" is a typo for "is <em>made of</em> several backbones". Also note the embedded figure still carries its book caption "Figure 6.4" while the slide's own caption says "Figure 4.4" — the same picture with two numbers.</p>`,
        `<p class="y-chinh">🎯 Hai câu không được để lẫn vào nhau. <strong>"An internet là hai mạng trở lên có thể liên lạc với nhau"</strong> — đó là cái LOẠI. <strong>The Internet</strong> là một liên mạng cụ thể gồm hàng nghìn mạng nối với nhau, và nó có một hình dạng thương mại ba tầng.</p>
<ul>
<li><strong>Tầng 1 — backbone (trục xương sống)</strong> — "những mạng lớn thuộc sở hữu của một số công ty viễn thông", còn gọi là <em>ISP quốc tế</em> hay nhà cung cấp tier-1. Chúng nối với nhau tại các <em>điểm peering</em> (hai chấm đen trong Hình 4.4) và điều quan trọng là chúng không trả tiền cho ai: chúng trao đổi lưu lượng ngang hàng. Cả thế giới chỉ chừng hơn chục cái.</li>
<li><strong>Tầng 2 — provider network</strong> — "dùng dịch vụ của backbone và trả phí". Các nhà mạng quốc gia nằm ở đây: VNPT, Viettel, FPT Telecom ở Việt Nam.</li>
<li><strong>Tầng 3 — customer network</strong> — "nằm ở rìa Internet, là bên thật sự dùng dịch vụ và trả phí cho provider network". Nhà bạn, trường bạn, một văn phòng công ty. Chúng là lá của cây; chúng tiêu thụ chứ không chở lưu lượng hộ ai.</li>
<li><strong>"Backbone và provider network đều được gọi là ISP"</strong> — vậy ISP không phải một tầng, mà là mọi thứ có bán đường truyền. Khi bạn đóng tiền mạng hằng tháng, bạn là customer network mua của provider network, mà provider network lại mua của backbone.</li>
<li><strong>Vì sao điểm peering liên quan tới bạn</strong> — lưu lượng giữa hai người dùng Việt Nam thường ở lại trong trạm trung chuyển quốc gia (VNIX) và chỉ mất vài mili-giây. Lưu lượng tới máy chủ ở Mỹ phải ra cáp quang biển — và khi một trong các tuyến ấy (AAG, APG, IA) đứt, chuyện gần như năm nào cũng xảy ra, độ trễ đi nước ngoài vọt lên trong khi trang trong nước vẫn nhanh. Giờ bạn giải thích được vì sao.</li>
</ul>
<p class="dap-an">✅ Trả lời cho mục tiêu "phân biệt an internet với the Internet": <em>an internet</em> (chữ thường) là bất kỳ sự nối kết nào của hai mạng trở lên — một công ty nối văn phòng Hà Nội với văn phòng TP.HCM là đã dựng ra một internet. <em>The Internet</em> (chữ I hoa) là liên mạng toàn cầu duy nhất, có cấu trúc backbone → provider network → customer network, khởi đi từ ARPANET năm 1969 và chuyển hẳn sang TCP/IP ngày 01/01/1983.</p>
<p class="pitfall">⚠️ Tiếng Anh của chính slide bị lỏng: "The Internet is as several backbones…" là gõ sót, đúng ra là "is <em>made of</em> several backbones". Cũng để ý bức hình bên trong vẫn giữ chú thích của sách "Figure 6.4" trong khi dòng chú thích của slide ghi "Figure 4.4" — cùng một bức hình, hai số.</p>`],

      [9, '5. TCP/IP — Protocol Layering',
        `<p class="y-chinh">🎯 The definition of a protocol: <strong>"the rules that both the sender and receiver and all intermediate devices need to follow to communicate effectively"</strong> — plus the reason we do not write one giant protocol: we need a protocol <em>at each layer</em>.</p>
<ul>
<li><strong>Read Figure 4.5 (the book's Figure 6.5) as a story</strong> — Maria wants to send Ann a confidential letter. Layer 3 is <em>Listen/Talk</em>: Maria composes plaintext, Ann reads plaintext. Layer 2 is <em>Encrypt/Decrypt</em>: Maria's plaintext becomes ciphertext, Ann's ciphertext becomes plaintext again. Layer 1 is <em>Send mail/receive mail</em>: the letter enters the postal system and comes out the other side.</li>
<li><strong>The phrase to notice in the figure — "identical objects"</strong> — at each level, what leaves the sender's layer N is exactly what arrives at the receiver's layer N. That is the <em>logical connection</em> idea that slides 13, 17, 21, 24 and 30 will repeat once per layer. Maria's layer-2 box and Ann's layer-2 box behave as though they are directly wired together, even though the paper physically travels through the post office.</li>
<li><strong>Why layering is worth the trouble — three reasons</strong> — (1) you can change one layer without touching the others: switch from encrypting with a cipher wheel to encrypting with AES, and the post office never notices; (2) different jobs can be built and tested by different specialists; (3) intermediate devices only need the lower layers — the postman never decrypts anything, exactly as a router never opens your TCP segment.</li>
<li><strong>The same story in software</strong> — HTTPS is literally this figure: layer 3 = HTTP (talk), layer 2 = TLS (encrypt), layer 1 = TCP/IP (deliver). When you see the padlock in the browser, layer 2 of Maria's picture is running.</li>
<li><strong>"All intermediate devices need to follow"</strong> — this is why standards bodies exist. A router made by Cisco in 1998 and a phone made in 2026 interoperate because both obey RFC 791 (IP) and RFC 9293 (TCP). Nobody coordinated them; they coordinated with the document.</li>
</ul>
<p class="meo">💡 The memory hook for the whole chapter: <strong>a protocol is an agreement, a layer is a job, and a stack is a list of jobs done in a fixed order — down on the way out, up on the way in.</strong></p>`,
        `<p class="y-chinh">🎯 Định nghĩa giao thức: <strong>"những luật mà cả bên gửi, bên nhận và mọi thiết bị trung gian đều phải tuân theo để liên lạc được hiệu quả"</strong> — kèm lý do vì sao ta không viết một giao thức khổng lồ: ta cần một giao thức <em>ở TỪNG tầng</em>.</p>
<ul>
<li><strong>Đọc Hình 4.5 (Figure 6.5 của sách) như một câu chuyện</strong> — Maria muốn gửi Ann một lá thư kín. Tầng 3 là <em>Nghe/Nói</em>: Maria soạn bản rõ, Ann đọc bản rõ. Tầng 2 là <em>Mã hoá/Giải mã</em>: bản rõ của Maria thành bản mã, bản mã bên Ann lại thành bản rõ. Tầng 1 là <em>Gửi thư/nhận thư</em>: lá thư vào hệ thống bưu chính rồi ra ở đầu bên kia.</li>
<li><strong>Cụm cần để ý trong hình — "identical objects" (vật thể y hệt)</strong> — ở mỗi mức, thứ rời khỏi tầng N bên gửi đúng là thứ tới tầng N bên nhận. Đó chính là ý niệm <em>kết nối lô-gic</em> mà slide 13, 17, 21, 24 và 30 sẽ nhắc lại, mỗi tầng một lần. Hộp tầng 2 của Maria và hộp tầng 2 của Ann hành xử như thể chúng nối thẳng dây với nhau, dù tờ giấy thực tế phải đi vòng qua bưu điện.</li>
<li><strong>Vì sao phân tầng đáng công — ba lý do</strong> — (1) đổi một tầng mà không đụng tầng khác: chuyển từ mã hoá bằng bánh xe mật mã sang mã hoá bằng AES, bưu điện chẳng hề hay biết; (2) các việc khác nhau được làm và kiểm thử bởi những người chuyên khác nhau; (3) thiết bị trung gian chỉ cần các tầng dưới — người đưa thư không bao giờ giải mã gì, y hệt việc router không bao giờ mở segment TCP của bạn.</li>
<li><strong>Cùng câu chuyện đó trong phần mềm</strong> — HTTPS đúng là bức hình này: tầng 3 = HTTP (nói), tầng 2 = TLS (mã hoá), tầng 1 = TCP/IP (giao). Khi bạn thấy cái ổ khoá trên trình duyệt, tầng 2 trong tranh của Maria đang chạy.</li>
<li><strong>"Mọi thiết bị trung gian đều phải tuân theo"</strong> — đó là lý do tồn tại của các tổ chức chuẩn hoá. Một router Cisco sản xuất năm 1998 và một cái điện thoại năm 2026 nói chuyện được với nhau vì cả hai tuân theo RFC 791 (IP) và RFC 9293 (TCP). Không ai bắt tay ai; họ bắt tay với cái tài liệu.</li>
</ul>
<p class="meo">💡 Móc nhớ cho cả chương: <strong>giao thức là một thoả thuận, tầng là một công việc, và chồng tầng là một danh sách công việc làm theo thứ tự cố định — đi xuống lúc ra, đi lên lúc vào.</strong></p>`],

      [10, 'TCP/IP Protocol Suite',
        `<p class="y-chinh">🎯 The name unpacked: <strong>TCP/IP = Transmission Control Protocol / Internet Protocol</strong>, and it is a <em>suite</em> — "a set of protocols organised in different layers" — not one protocol. It is "hierarchical, made of interactive modules, each providing a specific functionality".</p>
<table>
<tr><th>OSI (7 layers)</th><th>TCP/IP as 4 layers</th><th>TCP/IP as 5 layers (this course)</th></tr>
<tr><td>7 Application · 6 Presentation · 5 Session</td><td>Application</td><td>5 Application</td></tr>
<tr><td>4 Transport</td><td>Transport</td><td>4 Transport</td></tr>
<tr><td>3 Network</td><td>Internet</td><td>3 Network</td></tr>
<tr><td>2 Data Link · 1 Physical</td><td>Link</td><td>2 Data Link · 1 Physical</td></tr>
</table>
<ul>
<li><strong>Read the figure's three columns exactly as the table above</strong> — OSI on the left numbered 7 down to 1, a four-layer TCP/IP in the middle (Application, Transport, Internet, Link), and the five-layer TCP/IP on the right that this course uses from slide 11 onward. <strong>Answer the exam with five layers</strong> unless the question says otherwise.</li>
<li><strong>Why the two versions both exist</strong> — the original specification, RFC 1122 (1989), defines four layers and lumps data-link and physical into "Link" because TCP/IP deliberately does not standardise them (slide 24 says this outright). Teaching books split Link into two so the five-layer picture lines up with OSI.</li>
<li><strong>What OSI's extra layers were for</strong> — <em>presentation</em> (data format, encryption, compression) and <em>session</em> (dialogue control, checkpoints). TCP/IP does not have them; those jobs ended up inside applications and libraries. OSI was standardised by ISO in 1984 and lost to TCP/IP in practice — it survives as vocabulary, which is why engineers still say "a layer-3 device" meaning a router.</li>
<li><strong>"Interactive modules"</strong> — each layer uses the layer below and serves the layer above, and only its immediate neighbours. HTTP never talks to Ethernet directly. That strict rule is what lets you run HTTP over Wi-Fi, over 5G, or over fibre with no change to HTTP.</li>
<li><strong>Where the two names in "TCP/IP" live</strong> — TCP is at layer 4, IP is at layer 3. The suite is named after its two most famous members, the way a band is named after the singer; the suite also contains UDP, SCTP, ICMP, ARP, DNS, HTTP and hundreds more.</li>
</ul>
<p class="meo">💡 Learn the five layers in Vietnamese-friendly order from the top: <em>Ứng dụng · Giao vận · Mạng · Liên kết dữ liệu · Vật lý</em>. In English, "All PeopleTicking Down Passwords" is a serviceable mnemonic for Application–Presentation–… but for the five-layer stack just use <strong>A-T-N-D-P</strong>.</p>`,
        `<p class="y-chinh">🎯 Bóc cái tên ra: <strong>TCP/IP = Transmission Control Protocol / Internet Protocol</strong>, và nó là một <em>bộ</em> — "một tập giao thức được tổ chức thành các tầng khác nhau" — chứ không phải một giao thức. Nó "phân cấp, gồm các mô-đun tương tác, mỗi mô-đun cung cấp một chức năng cụ thể".</p>
<table>
<tr><th>OSI (7 tầng)</th><th>TCP/IP kiểu 4 tầng</th><th>TCP/IP kiểu 5 tầng (môn này dùng)</th></tr>
<tr><td>7 Application · 6 Presentation · 5 Session</td><td>Application</td><td>5 Ứng dụng</td></tr>
<tr><td>4 Transport</td><td>Transport</td><td>4 Giao vận</td></tr>
<tr><td>3 Network</td><td>Internet</td><td>3 Mạng</td></tr>
<tr><td>2 Data Link · 1 Physical</td><td>Link</td><td>2 Liên kết dữ liệu · 1 Vật lý</td></tr>
</table>
<ul>
<li><strong>Đọc ba cột trong hình đúng như bảng trên</strong> — OSI bên trái đánh số 7 xuống 1, TCP/IP bốn tầng ở giữa (Application, Transport, Internet, Link), và TCP/IP năm tầng bên phải — đó là cái môn này dùng từ slide 11 trở đi. <strong>Vào phòng thi hãy trả lời năm tầng</strong>, trừ khi đề nói khác.</li>
<li><strong>Vì sao tồn tại cả hai phiên bản</strong> — bản đặc tả gốc, RFC 1122 (1989), định nghĩa bốn tầng và gộp liên kết dữ liệu với vật lý thành "Link", bởi TCP/IP cố tình KHÔNG chuẩn hoá hai tầng đó (slide 24 nói thẳng điều này). Sách dạy học thì tách Link làm đôi để bức tranh năm tầng khớp hàng với OSI.</li>
<li><strong>Hai tầng dư của OSI dùng để làm gì</strong> — <em>presentation</em> (định dạng dữ liệu, mã hoá, nén) và <em>session</em> (điều khiển phiên hội thoại, điểm kiểm). TCP/IP không có chúng; những việc ấy rốt cuộc nằm trong bản thân ứng dụng và các thư viện. OSI được ISO chuẩn hoá năm 1984 và thua TCP/IP trên thực tế — nó sống sót dưới dạng từ vựng, và vì thế kỹ sư tới nay vẫn nói "thiết bị tầng 3" để chỉ router.</li>
<li><strong>"Các mô-đun tương tác"</strong> — mỗi tầng dùng tầng dưới và phục vụ tầng trên, và chỉ với hai hàng xóm liền kề. HTTP không bao giờ nói chuyện thẳng với Ethernet. Chính cái luật nghiêm ngặt ấy cho phép bạn chạy HTTP trên Wi-Fi, trên 5G hay trên sợi quang mà không phải sửa một dòng nào của HTTP.</li>
<li><strong>Hai cái tên trong "TCP/IP" nằm ở đâu</strong> — TCP ở tầng 4, IP ở tầng 3. Bộ giao thức được đặt tên theo hai thành viên nổi nhất, kiểu ban nhạc lấy tên ca sĩ; trong bộ còn có UDP, SCTP, ICMP, ARP, DNS, HTTP và hàng trăm cái khác.</li>
</ul>
<p class="meo">💡 Học năm tầng từ trên xuống bằng tiếng Việt cho dễ: <em>Ứng dụng · Giao vận · Mạng · Liên kết dữ liệu · Vật lý</em>. Viết tắt <strong>Ư-G-M-L-V</strong>, hoặc tiếng Anh <strong>A-T-N-D-P</strong>. Đọc ngược lên khi gói tin đi vào máy.</p>`],

      [11, 'Addressing and Packet Names',
        `<p class="y-chinh">🎯 The single most examined table of the chapter. Two facts: communication needs a source and a destination address, and we need <strong>only four</strong> of them — because the physical layer exchanges bits, and a bit has no address.</p>
<table>
<tr><th>Layer</th><th>Address used</th><th>Packet (data unit) name</th><th>Device that works here</th></tr>
<tr><td>5 Application</td><td>names (e.g. <code>cuongthai.com</code>, an email address)</td><td>message</td><td>the program itself</td></tr>
<tr><td>4 Transport</td><td>port numbers (0–65.535)</td><td>segment (TCP) / user datagram (UDP)</td><td>firewall (port filtering)</td></tr>
<tr><td>3 Network</td><td>logical addresses = IP addresses</td><td>datagram</td><td>router</td></tr>
<tr><td>2 Data link</td><td>link-layer addresses = MAC addresses</td><td>frame</td><td>switch</td></tr>
<tr><td>1 Physical</td><td><strong>none</strong></td><td>bit</td><td>hub, repeater, cable</td></tr>
</table>
<ul>
<li><strong>Read the figure exactly</strong> — two identical five-layer stacks face each other, and four dashed arrows run between them labelled, top to bottom: <em>Names · Port numbers · Logical addresses · Link-layer addresses</em>. The physical layer row has no arrow, and that gap is the whole point of the sentence "only four".</li>
<li><strong>Why each address exists</strong> — a <em>name</em> is for humans; a <em>port</em> picks which program on the machine; an <em>IP address</em> picks which machine in the world; a <em>MAC address</em> picks which device on this cable. Four different questions, four different answers, each needed exactly once.</li>
<li><strong>The delivery scope of each</strong> — application: process to process by name. Transport: process to process. Network: host to host (end to end). Data link: node to node (one hop). Physical: one bit across one wire. As you go down, the scope of one delivery gets shorter.</li>
<li><strong>Which addresses change on the journey and which do not</strong> — this is the exam's favourite follow-up: the source and destination <strong>IP addresses stay the same</strong> from end to end, while the source and destination <strong>MAC addresses are rewritten at every router hop</strong>, because each hop is a new link with new neighbours. Think of the IP address as the postal address on the envelope and the MAC address as the name of the courier holding it right now.</li>
<li><strong>A concrete frame</strong> — your laptop (MAC <code>3C:22:FB:…</code>, IP 192.168.1.10) asks a server at 142.250.66.78 for port 443. The frame leaving your Wi-Fi card carries destination MAC = your router's MAC, not the server's. The server's MAC is never known to you and never will be.</li>
</ul>
<p class="pitfall">⚠️ The four data-unit names are worth exact memorisation because they are trivially easy marks and trivially easy to mix up: <strong>message → segment/user datagram → datagram → frame → bit</strong>. Notice the nastiness: "datagram" alone means the <em>network</em>-layer unit, but "user datagram" means the <em>UDP</em> unit at the transport layer. Read the question's exact wording.</p>`,
        `<p class="y-chinh">🎯 Cái bảng bị hỏi nhiều nhất cả chương. Hai sự thật: liên lạc thì cần địa chỉ nguồn và địa chỉ đích, và ta chỉ cần <strong>bốn</strong> loại — vì tầng vật lý trao đổi từng bit, mà một bit thì không có địa chỉ.</p>
<table>
<tr><th>Tầng</th><th>Địa chỉ dùng</th><th>Tên gói (đơn vị dữ liệu)</th><th>Thiết bị làm việc ở đây</th></tr>
<tr><td>5 Ứng dụng</td><td>tên (ví dụ <code>cuongthai.com</code>, một địa chỉ thư)</td><td>message (thông điệp)</td><td>chính chương trình</td></tr>
<tr><td>4 Giao vận</td><td>số hiệu cổng (0–65.535)</td><td>segment (TCP) / user datagram (UDP)</td><td>tường lửa (lọc theo cổng)</td></tr>
<tr><td>3 Mạng</td><td>địa chỉ lô-gic = địa chỉ IP</td><td>datagram</td><td>router</td></tr>
<tr><td>2 Liên kết dữ liệu</td><td>địa chỉ tầng liên kết = địa chỉ MAC</td><td>frame (khung)</td><td>switch</td></tr>
<tr><td>1 Vật lý</td><td><strong>không có</strong></td><td>bit</td><td>hub, bộ lặp, dây cáp</td></tr>
</table>
<ul>
<li><strong>Đọc hình cho chính xác</strong> — hai chồng năm tầng y hệt nhau đối diện nhau, và bốn mũi tên nét đứt chạy giữa chúng, từ trên xuống ghi: <em>Names · Port numbers · Logical addresses · Link-layer addresses</em>. Hàng tầng vật lý KHÔNG có mũi tên, và đúng cái chỗ trống ấy là ý của câu "chỉ có bốn".</li>
<li><strong>Vì sao mỗi địa chỉ tồn tại</strong> — <em>tên</em> là cho con người; <em>cổng</em> chọn chương trình nào trên máy; <em>địa chỉ IP</em> chọn máy nào trên thế giới; <em>địa chỉ MAC</em> chọn thiết bị nào trên chính sợi cáp này. Bốn câu hỏi khác nhau, bốn câu trả lời khác nhau, mỗi cái cần đúng một lần.</li>
<li><strong>Phạm vi giao của từng tầng</strong> — ứng dụng: tiến trình tới tiến trình theo tên. Giao vận: tiến trình tới tiến trình. Mạng: máy tới máy (đầu cuối tới đầu cuối). Liên kết dữ liệu: nút tới nút (một chặng). Vật lý: một bit qua một sợi dây. Càng đi xuống, phạm vi của một lần giao càng ngắn.</li>
<li><strong>Địa chỉ nào ĐỔI dọc đường, địa chỉ nào KHÔNG</strong> — đây là câu hỏi đuổi mà đề thi thích nhất: địa chỉ <strong>IP nguồn và đích GIỮ NGUYÊN</strong> từ đầu tới cuối, còn địa chỉ <strong>MAC nguồn và đích bị VIẾT LẠI ở MỌI chặng router</strong>, vì mỗi chặng là một liên kết mới với hàng xóm mới. Hãy coi địa chỉ IP là địa chỉ nhà ghi trên phong bì, còn địa chỉ MAC là tên người giao hàng đang cầm nó lúc này.</li>
<li><strong>Một khung cụ thể</strong> — laptop của bạn (MAC <code>3C:22:FB:…</code>, IP 192.168.1.10) hỏi máy chủ 142.250.66.78 ở cổng 443. Khung rời khỏi card Wi-Fi của bạn mang MAC đích là MAC của cái router nhà bạn, KHÔNG phải của máy chủ. MAC của máy chủ bạn không bao giờ biết, và cũng không cần biết.</li>
</ul>
<p class="pitfall">⚠️ Bốn cái tên đơn vị dữ liệu đáng học thuộc chính xác vì chúng vừa là điểm dễ ăn vừa là chỗ dễ lộn: <strong>message → segment / user datagram → datagram → frame → bit</strong>. Để ý chỗ hiểm: "datagram" đứng một mình là đơn vị của tầng <em>mạng</em>, nhưng "user datagram" lại là đơn vị của <em>UDP</em> ở tầng giao vận. Đọc kỹ từng chữ của đề.</p>`],

      [12, '2 - Layers in networking',
        `<p class="y-chinh">🎯 The divider that opens Part 2, the longest part of the chapter: twenty slides, one section per layer, walked from the top (application) down to the bottom (physical).</p>
<ul>
<li><strong>The five sections ahead</strong> — 2.1 Application (13–16), 2.2 Transport (17–20), 2.3 Network (21–23), 2.4 Data-link (24–29), 2.5 Physical (30–31), and the summary figure on 32. The data-link section is the longest because it is where all the real network technologies live: Ethernet, Wi-Fi, cable, WiMAX.</li>
<li><strong>Each layer section follows the same three-beat shape</strong> — first a slide showing the <em>logical connection</em> at that layer (a whole-Internet diagram with two end hosts, routers R1…R7, and a red line), then one or two slides on <em>what the layer is responsible for</em>, then the concrete <em>protocols</em>. Once you spot the pattern, twenty slides become five repetitions.</li>
<li><strong>How the logical connections shrink as you go down</strong> — at the application layer the red line runs end-to-end between Alice and Bob only. At the transport layer, the same. At the network layer the line becomes a chain that touches every router. At the data-link layer it breaks into separate hops. At the physical layer it is a sequence of individual wires. <strong>That shrinking is the single visual idea of Part 2.</strong></li>
<li><strong>Why the top-down order helps</strong> — you already know what a web page is, so "application layer" is a name for something familiar. By the time you reach voltages on slide 30 you know exactly what job they serve.</li>
<li><strong>Keep the four-column table open</strong> — from slide 13 onwards, each section fills exactly one row of the table on slide 11. Tick a row off each time a section ends.</li>
</ul>
<p class="pitfall">⚠️ Same typo again: "netwoking". More useful to note is that the <em>numbering</em> restarts here — the deck calls this section "2" while the content slide called it "4.2", and the subsections are "2.1"…"2.5". Do not look for a "Chapter 2".</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở đầu Phần 2, phần dài nhất của chương: hai mươi slide, mỗi tầng một tiểu mục, đi từ trên (ứng dụng) xuống dưới (vật lý).</p>
<ul>
<li><strong>Năm tiểu mục phía trước</strong> — 2.1 Ứng dụng (13–16), 2.2 Giao vận (17–20), 2.3 Mạng (21–23), 2.4 Liên kết dữ liệu (24–29), 2.5 Vật lý (30–31), và hình tổng kết ở slide 32. Tiểu mục liên kết dữ liệu dài nhất vì đó là chỗ trú của mọi công nghệ mạng có thật: Ethernet, Wi-Fi, cáp truyền hình, WiMAX.</li>
<li><strong>Mỗi tiểu mục đều theo cùng một nhịp ba</strong> — trước hết một slide vẽ <em>kết nối lô-gic</em> ở tầng đó (sơ đồ cả Internet với hai host đầu cuối, các router R1…R7, và một đường màu đỏ), rồi một hai slide nói <em>tầng đó chịu trách nhiệm gì</em>, rồi tới các <em>giao thức</em> cụ thể. Nhận ra khuôn ấy thì hai mươi slide chỉ còn là năm lần lặp.</li>
<li><strong>Đường kết nối lô-gic co lại ra sao khi đi xuống</strong> — ở tầng ứng dụng, đường đỏ chạy thẳng từ Alice tới Bob, không chạm ai. Ở tầng giao vận, y như vậy. Ở tầng mạng, nó thành một chuỗi chạm vào TỪNG router. Ở tầng liên kết dữ liệu, nó vỡ thành các chặng rời. Ở tầng vật lý, nó là một dãy sợi dây riêng lẻ. <strong>Cú co lại ấy chính là ý tưởng hình ảnh duy nhất của cả Phần 2.</strong></li>
<li><strong>Vì sao thứ tự từ trên xuống lại dễ học</strong> — bạn đã biết trang web là gì, nên "tầng ứng dụng" chỉ là đặt tên cho một thứ quen thuộc. Tới lúc chạm vào hiệu điện thế ở slide 30, bạn đã biết rõ chúng phục vụ việc gì.</li>
<li><strong>Giữ mở cái bảng bốn cột</strong> — từ slide 13 trở đi, mỗi tiểu mục điền đúng một dòng của bảng ở slide 11. Hết một tiểu mục thì gạch một dòng.</li>
</ul>
<p class="pitfall">⚠️ Vẫn lỗi gõ "netwoking" ấy. Điều đáng ghi hơn là cách <em>đánh số</em> ở đây khởi động lại — bộ slide gọi phần này là "2" trong khi slide mục lục gọi nó là "4.2", và các tiểu mục là "2.1"…"2.5". Đừng đi tìm một "Chương 2" nào cả.</p>`],

      [13, '2.1 Application layer',
        `<p class="y-chinh">🎯 Three short sentences with a lot inside them: we go top-down; layer <strong>5</strong> is the application layer; it <em>provides services to the user</em>, and it communicates through a <strong>logical connection</strong>.</p>
<ul>
<li><strong>"Provides services to the user"</strong> — this is the only layer a human ever sees. Your browser, your mail client, Zalo, a game, <code>ssh</code> — all of them live here. Everything below layer 5 exists purely to make layer 5 possible.</li>
<li><strong>Read Figure 4.7 carefully, it is the template for four more figures</strong> — Alice sits inside "Sky Research" on the left, Bob inside "Scientific Books" at the bottom right, and between them are routers R1…R7, a switched WAN and a national ISP. Each host shows a five-box stack: Application, Transport, Network, Data link, Physical. A thick red line labelled <strong>"Logical Connection"</strong> runs from Alice's <em>Application</em> box directly to Bob's <em>Application</em> box — <strong>bypassing every router</strong>.</li>
<li><strong>Why that red line skips the routers — and this is the exam point</strong> — routers do not have an application layer at all. Look at slide 30's version of the same figure: R2, R4, R5, R7 show only three boxes (Network, Data link, Physical). A router genuinely cannot read your HTTP request; it only reads the IP header. That is not politeness, it is architecture.</li>
<li><strong>"Logical" versus "physical"</strong> — logically, Alice's browser talks straight to Bob's web server. Physically, the bits go down five layers, across seven routers, and back up five layers. Both descriptions are true at the same time, and layering is what lets you hold both in your head.</li>
<li><strong>The application layer is where <em>you</em> will work</strong> — writing an Express route or a React app means writing layer-5 software. You will never write an IP header in your career; the operating system does that for you. Which is exactly the point of the model.</li>
</ul>
<p class="meo">💡 One question tells you which layer a device belongs to: <em>how many boxes does it draw in these figures?</em> Host = 5 boxes. Router = 3. Switch = 2. Hub/repeater = 1.</p>`,
        `<p class="y-chinh">🎯 Ba câu ngắn mà chứa rất nhiều: ta đi từ trên xuống; tầng <strong>5</strong> là tầng ứng dụng; nó <em>cung cấp dịch vụ cho người dùng</em>, và nó liên lạc qua một <strong>kết nối lô-gic</strong>.</p>
<ul>
<li><strong>"Cung cấp dịch vụ cho người dùng"</strong> — đây là tầng duy nhất con người nhìn thấy. Trình duyệt của bạn, trình thư, Zalo, một trò chơi, lệnh <code>ssh</code> — tất cả sống ở đây. Mọi thứ dưới tầng 5 tồn tại thuần tuý để tầng 5 chạy được.</li>
<li><strong>Nhìn kỹ Hình 4.7, nó là khuôn mẫu cho bốn hình nữa</strong> — Alice ngồi trong "Sky Research" bên trái, Bob trong "Scientific Books" góc dưới phải, giữa họ là các router R1…R7, một WAN chuyển mạch và một ISP quốc gia. Mỗi host vẽ một chồng năm hộp: Application, Transport, Network, Data link, Physical. Một đường đỏ đậm ghi <strong>"Logical Connection"</strong> chạy thẳng từ hộp <em>Application</em> của Alice sang hộp <em>Application</em> của Bob — <strong>bỏ qua toàn bộ router</strong>.</li>
<li><strong>Vì sao đường đỏ ấy bỏ qua router — và đây là chỗ ra đề</strong> — router hoàn toàn KHÔNG có tầng ứng dụng. Hãy nhìn bản cùng hình ở slide 30: R2, R4, R5, R7 chỉ vẽ ba hộp (Network, Data link, Physical). Router thật sự không đọc nổi yêu cầu HTTP của bạn; nó chỉ đọc phần đầu IP. Đó không phải phép lịch sự, đó là kiến trúc.</li>
<li><strong>"Lô-gic" so với "vật lý"</strong> — về mặt lô-gic, trình duyệt của Alice nói thẳng với máy chủ web của Bob. Về mặt vật lý, các bit đi xuống năm tầng, băng qua bảy router, rồi leo ngược năm tầng. Cả hai cách mô tả đều đúng cùng lúc, và phân tầng chính là thứ cho phép bạn giữ cả hai trong đầu.</li>
<li><strong>Tầng ứng dụng là chỗ <em>bạn</em> sẽ làm việc</strong> — viết một route Express hay một ứng dụng React chính là viết phần mềm tầng 5. Suốt sự nghiệp bạn sẽ không bao giờ phải tự tay viết một phần đầu IP; hệ điều hành làm hộ. Và đó đúng là mục đích của mô hình này.</li>
</ul>
<p class="meo">💡 Chỉ một câu hỏi cho biết thiết bị thuộc tầng nào: <em>trong những hình này nó vẽ mấy cái hộp?</em> Host = 5 hộp. Router = 3. Switch = 2. Hub/bộ lặp = 1.</p>`],

      [14, 'Application-Layer Paradigms',
        `<p class="y-chinh">🎯 One design question — <em>should both programs be able to request services and/or provide services?</em> — and two historical answers: the <strong>client-server paradigm</strong> and the <strong>peer-to-peer paradigm</strong>.</p>
<table>
<tr><th></th><th>Client-server</th><th>Peer-to-peer (P2P)</th></tr>
<tr><td>Roles</td><td>fixed and asymmetric: client asks, server answers</td><td>symmetric: every peer both asks and answers</td></tr>
<tr><td>Availability</td><td>server must run 24/7 and be reachable</td><td>no always-on machine needed</td></tr>
<tr><td>Scaling</td><td>more users = more load on the server</td><td>more users = more capacity</td></tr>
<tr><td>Weak point</td><td>single point of failure, hosting cost</td><td>hard to find things, hard to police, hard to secure</td></tr>
<tr><td>Examples</td><td>the Web, email, FTP, SSH, DNS</td><td>BitTorrent, blockchain, IPFS, older Skype</td></tr>
</table>
<ul>
<li><strong>Read the two figures side by side</strong> — on the left, Figure 6.11: every red arrow converges on one server rack on the right of the picture. On the right, Figure 6.12: red arrows run <em>between</em> the LAN clouds themselves, with no central machine. The shape of the arrows IS the definition.</li>
<li><strong>Why client-server won for most things</strong> — a server has a stable address and a stable name, so a client always knows where to ask. That is the whole reason you can type an address and get a page. In P2P you first have to <em>find</em> which peer holds what you want, which needs either a tracker or a distributed hash table.</li>
<li><strong>Why P2P keeps coming back</strong> — cost and censorship resistance. A file shared by 10.000 BitTorrent peers costs its publisher nothing to distribute and cannot be removed by shutting down one machine. The same property is why it is used for blockchains and for game patch distribution.</li>
<li><strong>They mix in practice</strong> — a video call is negotiated through a server (signalling) and then, if the network allows, the audio and video flow peer-to-peer directly between the two phones. So this is not a religious split; it is a per-feature choice.</li>
</ul>
<p class="dap-an">✅ Answer to the slide's own question ("should both programs request and/or provide?"): there is no single right answer — client-server says <em>no, split the roles</em> and buys simplicity and findability; peer-to-peer says <em>yes, both</em> and buys scale and resilience at the cost of complexity.</p>`,
        `<p class="y-chinh">🎯 Một câu hỏi thiết kế — <em>cả hai chương trình có nên vừa yêu cầu vừa cung cấp dịch vụ không?</em> — và hai câu trả lời lịch sử: mô hình <strong>khách–chủ (client-server)</strong> và mô hình <strong>ngang hàng (peer-to-peer)</strong>.</p>
<table>
<tr><th></th><th>Khách–chủ</th><th>Ngang hàng (P2P)</th></tr>
<tr><td>Vai trò</td><td>cố định, bất đối xứng: khách hỏi, chủ đáp</td><td>đối xứng: mỗi nút vừa hỏi vừa đáp</td></tr>
<tr><td>Tính sẵn sàng</td><td>máy chủ phải chạy 24/7 và với tới được</td><td>không cần máy nào bật suốt</td></tr>
<tr><td>Khả năng mở rộng</td><td>càng đông người dùng, máy chủ càng nặng</td><td>càng đông người dùng, năng lực càng lớn</td></tr>
<tr><td>Điểm yếu</td><td>một điểm hỏng là chết cả, tốn tiền thuê máy</td><td>khó tìm nội dung, khó quản lý, khó bảo mật</td></tr>
<tr><td>Ví dụ</td><td>Web, thư điện tử, FTP, SSH, DNS</td><td>BitTorrent, blockchain, IPFS, Skype đời cũ</td></tr>
</table>
<ul>
<li><strong>Đặt hai hình cạnh nhau mà đọc</strong> — bên trái, Figure 6.11: mọi mũi tên đỏ đều chụm về một tủ máy chủ ở phía phải bức tranh. Bên phải, Figure 6.12: các mũi tên đỏ chạy <em>giữa</em> chính các đám mây LAN với nhau, không có cỗ máy trung tâm nào. Hình dạng các mũi tên CHÍNH LÀ định nghĩa.</li>
<li><strong>Vì sao khách–chủ thắng ở hầu hết chỗ</strong> — máy chủ có địa chỉ ổn định và cái tên ổn định, nên máy khách luôn biết hỏi ở đâu. Đó là toàn bộ lý do bạn gõ một địa chỉ là ra trang. Trong P2P, trước hết bạn phải <em>tìm</em> xem nút nào đang giữ thứ bạn cần, việc ấy đòi hoặc một máy theo dõi (tracker) hoặc một bảng băm phân tán.</li>
<li><strong>Vì sao P2P cứ quay lại</strong> — chi phí và khả năng chống chặn. Một file được 10.000 nút BitTorrent chia sẻ thì người phát hành không tốn đồng nào để phân phối, và không thể bị gỡ bằng cách tắt một cỗ máy. Cũng chính tính chất ấy khiến nó được dùng cho blockchain và cho việc phát bản vá trò chơi.</li>
<li><strong>Trên thực tế chúng pha vào nhau</strong> — một cuộc gọi video được thu xếp qua máy chủ (báo hiệu), rồi nếu mạng cho phép, âm thanh và hình ảnh chảy thẳng ngang hàng giữa hai cái điện thoại. Vậy đây không phải chuyện chọn phe; đó là lựa chọn theo từng tính năng.</li>
</ul>
<p class="dap-an">✅ Trả lời chính câu hỏi trên slide ("cả hai có nên vừa yêu cầu vừa cung cấp?"): không có một đáp án đúng duy nhất — khách–chủ nói <em>không, hãy tách vai</em> và đổi lấy sự đơn giản cùng khả năng tìm thấy nhau; ngang hàng nói <em>có, cả hai</em> và đổi lấy quy mô cùng sức bền, với cái giá là độ phức tạp.</p>`],

      [15, 'Applications of Standard Client-Server',
        `<p class="y-chinh">🎯 The named list of traditional client-server services you are expected to recognise: <strong>WWW and its vehicle HTTP, FTP, SSH, and email</strong>. Every one of them is still in daily use, and every one of them has a port number you should know.</p>
<table>
<tr><th>Service</th><th>Protocol</th><th>Port</th><th>What it moves</th></tr>
<tr><td>World Wide Web</td><td>HTTP / HTTPS</td><td>80 / 443</td><td>pages, images, API responses</td></tr>
<tr><td>File transfer</td><td>FTP (control / data)</td><td>21 / 20</td><td>whole files, two separate connections</td></tr>
<tr><td>Remote login</td><td>SSH</td><td>22</td><td>an encrypted terminal session</td></tr>
<tr><td>Sending mail</td><td>SMTP</td><td>25 (587 submission)</td><td>a message from sender toward the recipient's server</td></tr>
<tr><td>Reading mail</td><td>POP3 / IMAP</td><td>110 / 143</td><td>a message from your mailbox to your client</td></tr>
</table>
<ul>
<li><strong>The left figure is FTP, and it shows the oddity worth knowing</strong> — client and server keep <strong>two</strong> connections: a <em>control connection</em> between the two "Control process" boxes that stays open for the whole session and carries commands, and a <em>data connection</em> between the two "Data transfer process" boxes that opens and closes once per file. That is why FTP needs two ports, 21 and 20.</li>
<li><strong>The right figure is email, and it has three agents</strong> — the legend spells them out: <em>UA</em> = user agent (the program you type in), <em>MTA</em> = message transfer agent (the server that relays), <em>MAA</em> = message access agent (the server that hands the message to you). Alice's UA → MTA client → her mail server's spool → across the Internet → Bob's mail server's boxes → MAA server → Bob's UA. Nine numbered steps in the figure.</li>
<li><strong>Why email needs two different protocol families</strong> — SMTP <em>pushes</em> a message toward the destination server, but you cannot push into a laptop that is switched off. So the last hop is a <em>pull</em>: POP3 or IMAP, initiated by you. That push/pull asymmetry is the single reason mail has three agents instead of one.</li>
<li><strong>What is missing from this 2017-era list</strong> — the slide says these are "traditional services", which is fair. Today's equivalents are still client-server but different: REST and GraphQL APIs over HTTPS instead of FTP, <code>scp</code>/<code>rsync</code> (over SSH, port 22) instead of plain FTP, and web mail over HTTPS instead of POP3.</li>
<li><strong>Plain FTP should not be used any more</strong> — it sends the password in clear text. Its replacements are SFTP and SCP (both inside SSH, port 22) or FTPS. The slide is describing the classic architecture, not a recommendation.</li>
</ul>
<p class="meo">💡 Learn the five ports as one line and you will recover several marks across the whole degree: <strong>20/21 FTP · 22 SSH · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS</strong>. They are all below 1024, which slide 19 will explain is the reserved "well-known" range.</p>`,
        `<p class="y-chinh">🎯 Danh sách các dịch vụ khách–chủ cổ điển mà bạn phải nhận ra: <strong>WWW cùng phương tiện của nó là HTTP, FTP, SSH và thư điện tử</strong>. Cái nào cũng còn dùng hằng ngày, và cái nào cũng có một số hiệu cổng bạn nên thuộc.</p>
<table>
<tr><th>Dịch vụ</th><th>Giao thức</th><th>Cổng</th><th>Chở cái gì</th></tr>
<tr><td>Web toàn cầu</td><td>HTTP / HTTPS</td><td>80 / 443</td><td>trang, ảnh, phản hồi API</td></tr>
<tr><td>Truyền tệp</td><td>FTP (điều khiển / dữ liệu)</td><td>21 / 20</td><td>nguyên tệp, hai kết nối tách biệt</td></tr>
<tr><td>Đăng nhập từ xa</td><td>SSH</td><td>22</td><td>một phiên dòng lệnh đã mã hoá</td></tr>
<tr><td>Gửi thư</td><td>SMTP</td><td>25 (587 để gửi đi)</td><td>một thư từ người gửi tới máy chủ người nhận</td></tr>
<tr><td>Đọc thư</td><td>POP3 / IMAP</td><td>110 / 143</td><td>một thư từ hộp thư về máy của bạn</td></tr>
</table>
<ul>
<li><strong>Hình bên trái là FTP, và nó phơi ra cái điểm lạ đáng biết</strong> — máy khách và máy chủ giữ <strong>hai</strong> kết nối: một <em>kết nối điều khiển</em> giữa hai hộp "Control process", mở suốt phiên và chở các lệnh; và một <em>kết nối dữ liệu</em> giữa hai hộp "Data transfer process", mở rồi đóng mỗi lần một tệp. Vì thế FTP cần hai cổng, 21 và 20.</li>
<li><strong>Hình bên phải là thư điện tử, và nó có ba tác nhân</strong> — chú giải ghi rõ: <em>UA</em> = user agent (chương trình bạn gõ vào), <em>MTA</em> = message transfer agent (máy chủ chuyển tiếp), <em>MAA</em> = message access agent (máy chủ trao thư cho bạn). Alice UA → MTA client → hàng đợi (spool) ở máy chủ thư của cô → băng qua Internet → hộp thư ở máy chủ của Bob → MAA server → UA của Bob. Chín bước có đánh số trong hình.</li>
<li><strong>Vì sao thư điện tử phải có hai họ giao thức</strong> — SMTP <em>ĐẨY</em> thư về phía máy chủ đích, nhưng không thể đẩy vào một cái laptop đang tắt. Nên chặng cuối phải là <em>KÉO</em>: POP3 hoặc IMAP, do chính bạn khởi xướng. Cái bất đối xứng đẩy/kéo ấy là lý do duy nhất khiến thư điện tử có ba tác nhân thay vì một.</li>
<li><strong>Danh sách kiểu 2017 này thiếu gì</strong> — slide nói đây là "các dịch vụ truyền thống", và nói vậy là công bằng. Thứ tương đương hôm nay vẫn là khách–chủ nhưng khác: API REST và GraphQL qua HTTPS thay cho FTP, <code>scp</code>/<code>rsync</code> (chạy trong SSH, cổng 22) thay cho FTP trần, và thư trên web qua HTTPS thay cho POP3.</li>
<li><strong>FTP trần thì đừng dùng nữa</strong> — nó gửi mật khẩu dạng chữ trần. Thứ thay thế là SFTP và SCP (đều nằm trong SSH, cổng 22) hoặc FTPS. Slide đang MÔ TẢ kiến trúc kinh điển, không phải đang khuyến nghị.</li>
</ul>
<p class="meo">💡 Học năm cái cổng thành một dòng, bạn sẽ nhặt lại được điểm ở nhiều môn suốt cả khoá: <strong>20/21 FTP · 22 SSH · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS</strong>. Tất cả đều nhỏ hơn 1024, và slide 19 sẽ giải thích đó là dải "well-known" được giữ chỗ.</p>`],

      [16, 'DNS in the Internet',
        `<p class="y-chinh">🎯 DNS is the application-layer service that turns a <strong>name</strong> into an <strong>IP address</strong>. Without it, the "names" row of the table on slide 11 would be useless, because the network layer can only route numbers.</p>
<ul>
<li><strong>The three original sections of the name space</strong> — <em>generic domains</em> (define registered hosts), <em>country domains</em> (<code>.vn</code>, <code>.jp</code>, <code>.uk</code>), and the <em>inverse domain</em> (IP → name). The slide says inverse domains "are now deprecated"; see the trap below.</li>
<li><strong>Read the tree in the figure</strong> — a dark "Root level" circle at the top, and below it the generic top-level domains drawn as black circles: <code>aero biz com coop edu gov info int mil museum name net org pro</code>. The red path follows <code>edu → uci → uci.edu</code>, and the box on the right says "Index to addresses" — the leaf is where the actual IP address is stored.</li>
<li><strong>How a lookup really runs, in order</strong> — (1) your machine asks its <em>resolver</em> (usually your ISP's, or 8.8.8.8, or 1.1.1.1); (2) the resolver asks a <strong>root</strong> server "who handles <code>.com</code>?"; (3) it asks the <strong>.com TLD</strong> server "who handles <code>cuongthai.com</code>?"; (4) it asks that <strong>authoritative</strong> server "what is the A record?"; (5) it caches the answer for the record's TTL and returns it. Four questions, and after the first time almost all of them are answered from cache in under 1 ms.</li>
<li><strong>Real numbers</strong> — DNS runs on <strong>port 53</strong>, historically over UDP for small queries (fast, one packet each way) and over TCP when the answer is too big. There are 13 named root server <em>addresses</em> (a through m <code>.root-servers.net</code>) but well over 1.500 physical machines behind them, reachable by anycast. Since the 2012 expansion there are over 1.500 top-level domains, not the 13 in this figure.</li>
<li><strong>Why it matters to a web developer</strong> — every page load starts with a DNS lookup you did not write. When a site "is down for some people and fine for others", DNS caching and TTL are the first suspect, not the server.</li>
</ul>
<p class="pitfall">⚠️ The slide's claim that "the inverse domains are now deprecated" is misleading and worth correcting in an exam answer only if asked to comment. The <em>in-addr.arpa</em> reverse zone (PTR records, IP → name) is very much alive: mail servers routinely reject mail from an address with no matching PTR record. What became obsolete is the separate "inverse query" opcode of early DNS, not reverse lookup itself.</p>`,
        `<p class="y-chinh">🎯 DNS là dịch vụ tầng ứng dụng biến một <strong>cái tên</strong> thành một <strong>địa chỉ IP</strong>. Không có nó thì dòng "names" trong bảng ở slide 11 vô dụng, vì tầng mạng chỉ định tuyến được bằng số.</p>
<ul>
<li><strong>Ba phần ban đầu của không gian tên</strong> — <em>miền chung</em> (định nghĩa các máy đã đăng ký), <em>miền quốc gia</em> (<code>.vn</code>, <code>.jp</code>, <code>.uk</code>), và <em>miền ngược</em> (IP → tên). Slide nói miền ngược "nay đã bỏ"; xem phần bẫy bên dưới.</li>
<li><strong>Đọc cái cây trong hình</strong> — một vòng tròn sẫm "Root level" trên đỉnh, dưới nó là các miền cấp cao nhất dạng chung vẽ thành các vòng tròn đen: <code>aero biz com coop edu gov info int mil museum name net org pro</code>. Đường màu đỏ đi <code>edu → uci → uci.edu</code>, và cái hộp bên phải ghi "Index to addresses" — cái lá mới là chỗ chứa địa chỉ IP thật.</li>
<li><strong>Một lần tra cứu chạy thật ra sao, theo thứ tự</strong> — (1) máy bạn hỏi <em>bộ phân giải</em> của nó (thường là của nhà mạng, hoặc 8.8.8.8, hoặc 1.1.1.1); (2) bộ phân giải hỏi máy chủ <strong>gốc</strong>: "ai phụ trách <code>.com</code>?"; (3) hỏi máy chủ <strong>TLD .com</strong>: "ai phụ trách <code>cuongthai.com</code>?"; (4) hỏi máy chủ <strong>có thẩm quyền</strong>: "bản ghi A là gì?"; (5) nó lưu đệm câu trả lời trong thời hạn TTL rồi trả về. Bốn câu hỏi, và sau lần đầu thì gần như mọi lần sau đều lấy từ bộ đệm trong chưa tới 1 ms.</li>
<li><strong>Con số thật</strong> — DNS chạy ở <strong>cổng 53</strong>, theo truyền thống đi trên UDP với các truy vấn nhỏ (nhanh, mỗi chiều một gói) và chuyển sang TCP khi câu trả lời quá lớn. Có 13 <em>địa chỉ</em> máy chủ gốc được đặt tên (a tới m <code>.root-servers.net</code>) nhưng đằng sau là hơn 1.500 cỗ máy vật lý, tới được nhờ anycast. Từ đợt mở rộng năm 2012, có hơn 1.500 miền cấp cao nhất chứ không phải 13 cái như trong hình.</li>
<li><strong>Vì sao nó quan trọng với người làm web</strong> — mọi lần tải trang đều bắt đầu bằng một lần tra DNS mà bạn không hề viết ra. Khi một trang "người vào được người không", thì bộ đệm DNS và TTL là nghi phạm đầu tiên, chứ không phải máy chủ.</li>
</ul>
<p class="pitfall">⚠️ Câu "miền ngược nay đã bỏ" trên slide là gây hiểu nhầm, và chỉ nên đính chính trong bài thi nếu đề yêu cầu bình luận. Vùng ngược <em>in-addr.arpa</em> (bản ghi PTR, IP → tên) vẫn sống rất khoẻ: máy chủ thư thường xuyên từ chối thư đến từ một địa chỉ không có bản ghi PTR khớp. Thứ đã lỗi thời là mã lệnh "inverse query" riêng của DNS thời đầu, chứ không phải bản thân việc tra ngược.</p>`],

      [17, '2.2 TRANSPORT LAYER',
        `<p class="y-chinh">🎯 Layer 4 defined by its neighbours: it sits <strong>between the application layer and the network layer</strong>, provides services upward and receives services downward. The slide's own metaphor is the one to keep: it "acts as a <strong>liaison</strong> between a client program and a server program".</p>
<ul>
<li><strong>The one job that defines it</strong> — the network layer gets data to the right <em>machine</em>; the transport layer gets it to the right <em>program on that machine</em>. That gap is exactly what port numbers fill, and slide 19 is about nothing else.</li>
<li><strong>The logical connection at this layer (Figure 4.10)</strong> — it still runs end-to-end, Alice's Transport box straight to Bob's Transport box, skipping every router, exactly as at layer 5. Routers have no transport layer either. So layers 4 and 5 are the <em>end-to-end</em> layers, and layers 1–3 are the <em>hop-by-hop</em> ones.</li>
<li><strong>The four services a transport protocol may offer</strong> — process-to-process delivery (always), plus optionally: reliability (retransmit what was lost), ordering (deliver in the order sent), flow control (do not drown a slow receiver) and congestion control (do not drown the network). TCP does all of them; UDP does only the first.</li>
<li><strong>Why it is not part of the network layer</strong> — because IP was deliberately built to be <em>simple and unreliable</em>: it may lose, duplicate, delay or reorder datagrams, and it never apologises. Everything that makes a connection feel dependable was pushed up into layer 4, inside the two end hosts only. That decision is called the end-to-end principle, and it is why the Internet scaled.</li>
<li><strong>Where you meet it in code</strong> — a socket. <code>listen(3000)</code> in Node is you asking the operating system for a transport-layer port. Everything below is the kernel's problem.</li>
</ul>
<p class="meo">💡 Two words separate layer 3 from layer 4 and they are worth memorising verbatim: the network layer does <strong>host-to-host</strong> delivery, the transport layer does <strong>process-to-process</strong> delivery. Slide 18 exists purely to hammer that in.</p>`,
        `<p class="y-chinh">🎯 Tầng 4 được định nghĩa bằng hai hàng xóm: nó nằm <strong>giữa tầng ứng dụng và tầng mạng</strong>, cung cấp dịch vụ lên trên và nhận dịch vụ từ dưới. Hình ảnh của chính slide đáng giữ: nó "đóng vai <strong>liên lạc viên</strong> giữa chương trình khách và chương trình chủ".</p>
<ul>
<li><strong>Một việc duy nhất định nghĩa nó</strong> — tầng mạng đưa dữ liệu tới đúng <em>cỗ máy</em>; tầng giao vận đưa nó tới đúng <em>chương trình trên cỗ máy đó</em>. Cái khoảng hở ấy đúng là chỗ số hiệu cổng lấp vào, và slide 19 không nói gì khác ngoài chuyện đó.</li>
<li><strong>Kết nối lô-gic ở tầng này (Hình 4.10)</strong> — nó vẫn chạy thẳng từ đầu tới cuối, hộp Transport của Alice sang thẳng hộp Transport của Bob, bỏ qua mọi router, y hệt tầng 5. Router cũng không có tầng giao vận. Vậy tầng 4 và 5 là các tầng <em>đầu-cuối</em>, còn tầng 1–3 là các tầng <em>chặng-một</em>.</li>
<li><strong>Bốn dịch vụ mà một giao thức giao vận CÓ THỂ cung cấp</strong> — giao tiến-trình-tới-tiến-trình (luôn có), cộng thêm tuỳ chọn: tin cậy (gửi lại cái đã mất), đúng thứ tự (giao theo đúng trình tự đã gửi), điều khiển luồng (đừng dìm chết bên nhận chậm) và điều khiển tắc nghẽn (đừng dìm chết cả mạng). TCP làm hết; UDP chỉ làm cái đầu tiên.</li>
<li><strong>Vì sao nó không nằm trong tầng mạng</strong> — vì IP được cố ý dựng cho <em>đơn giản và không tin cậy</em>: nó có thể làm mất, nhân đôi, làm trễ hoặc đảo thứ tự datagram, và chẳng bao giờ xin lỗi. Mọi thứ làm cho kết nối có cảm giác đáng tin đều bị đẩy lên tầng 4, và chỉ nằm trong hai máy đầu cuối. Quyết định ấy gọi là nguyên lý đầu-cuối, và nó là lý do Internet mở rộng được.</li>
<li><strong>Bạn gặp nó ở đâu trong mã nguồn</strong> — cái socket. Câu <code>listen(3000)</code> trong Node chính là bạn đi xin hệ điều hành một cổng ở tầng giao vận. Mọi thứ phía dưới là việc của nhân hệ điều hành.</li>
</ul>
<p class="meo">💡 Hai cụm từ tách tầng 3 khỏi tầng 4, đáng thuộc nguyên văn: tầng mạng giao <strong>máy tới máy (host-to-host)</strong>, tầng giao vận giao <strong>tiến trình tới tiến trình (process-to-process)</strong>. Slide 18 tồn tại thuần tuý để đóng đinh ý đó.</p>`],

      [18, 'Process-to-Process Communication',
        `<p class="y-chinh">🎯 One definition and one contrast. Definition: a <strong>process</strong> is "an application-layer entity — a running program — that uses the services of the transport layer". Contrast: the network layer reaches the <em>computer</em>; the transport layer reaches the <em>process</em>.</p>
<ul>
<li><strong>Read Figure 4.11 for the phrase in red</strong> — two "Process" boxes sit above a Client laptop and a Server, with the Internet cloud between them. The red arrow between the two processes is labelled <strong>"Domain of transport-layer protocol"</strong>, and it is drawn <em>above</em> the machines, not between them. The machines' own connection is the grey line below. Two different journeys drawn in one picture.</li>
<li><strong>Why the machine alone is not enough — a concrete count</strong> — open your laptop's task manager: 200–400 processes are running. Of those, several are talking to the network at once — a browser with 15 tabs, a mail client, a messaging app, the OS update service. A datagram arrives carrying only the IP address 192.168.1.10. Which of the 400 should receive it? Without a port number the question has no answer, and the data is undeliverable.</li>
<li><strong>"A process is a running program"</strong> — link this back to CSI106's Chapter 5 on operating systems. A <em>program</em> is a file on disk; a <em>process</em> is that program loaded and executing with its own memory. Two browser windows can be two processes of one program, and each can hold its own port.</li>
<li><strong>What the process does not have to know</strong> — routing, retransmission, framing, voltages. It calls <code>send()</code> and the transport layer takes over. That is the "service to the application layer" from slide 17, made concrete.</li>
<li><strong>The reverse direction, called demultiplexing</strong> — on arrival, the transport layer reads the destination port and hands the payload to exactly one process. One IP address in, hundreds of processes out: the port number is the only thing doing the sorting.</li>
</ul>
<p class="dap-an">✅ A typical exam question: "Why is the network layer not sufficient for delivery?" Answer in one sentence: <em>because the network layer only identifies hosts by IP address, so it can deliver a datagram to the right computer but cannot say which of the many running processes on that computer should receive it — the transport layer adds port numbers to complete the delivery.</em></p>`,
        `<p class="y-chinh">🎯 Một định nghĩa và một phép tương phản. Định nghĩa: <strong>tiến trình</strong> là "một thực thể tầng ứng dụng — một chương trình đang chạy — dùng dịch vụ của tầng giao vận". Tương phản: tầng mạng với tới <em>cỗ máy</em>; tầng giao vận với tới <em>tiến trình</em>.</p>
<ul>
<li><strong>Đọc Hình 4.11 để thấy dòng chữ đỏ</strong> — hai hộp "Process" nằm phía trên một laptop máy khách và một máy chủ, giữa chúng là đám mây Internet. Mũi tên đỏ nối hai tiến trình ghi <strong>"Domain of transport-layer protocol"</strong>, và nó được vẽ <em>bên trên</em> hai cỗ máy chứ không phải giữa chúng. Đường nối của bản thân hai cỗ máy là vạch xám bên dưới. Hai hành trình khác nhau vẽ trong cùng một bức tranh.</li>
<li><strong>Vì sao chỉ có cỗ máy thì chưa đủ — đếm cho cụ thể</strong> — mở trình quản lý tác vụ trên laptop của bạn: 200–400 tiến trình đang chạy. Trong số đó vài cái đang cùng lúc nói chuyện với mạng — một trình duyệt mở 15 thẻ, một trình thư, một ứng dụng nhắn tin, dịch vụ cập nhật hệ điều hành. Một datagram bay tới, trên mình chỉ mang địa chỉ IP 192.168.1.10. Trong 400 tiến trình ấy, đứa nào được nhận? Không có số hiệu cổng thì câu hỏi này không có lời đáp, và dữ liệu không giao được.</li>
<li><strong>"Tiến trình là một chương trình đang chạy"</strong> — nối ngược về Chương 5 của CSI106 nói về hệ điều hành. <em>Chương trình</em> là một tệp trên đĩa; <em>tiến trình</em> là tệp ấy đã được nạp và đang thực thi với vùng nhớ riêng. Hai cửa sổ trình duyệt có thể là hai tiến trình của cùng một chương trình, và mỗi cái giữ cổng riêng.</li>
<li><strong>Cái mà tiến trình KHÔNG cần biết</strong> — định tuyến, gửi lại, đóng khung, hiệu điện thế. Nó gọi <code>send()</code> và tầng giao vận nhận việc. Đó chính là "dịch vụ cho tầng ứng dụng" ở slide 17, được cụ thể hoá.</li>
<li><strong>Chiều ngược lại, gọi là phân kênh (demultiplexing)</strong> — lúc tới nơi, tầng giao vận đọc cổng đích và trao phần tải cho đúng MỘT tiến trình. Một địa chỉ IP đi vào, hàng trăm tiến trình đi ra: số hiệu cổng là thứ duy nhất làm việc phân loại đó.</li>
</ul>
<p class="dap-an">✅ Một câu hỏi thi điển hình: "Vì sao tầng mạng chưa đủ để giao dữ liệu?" Trả lời trong một câu: <em>vì tầng mạng chỉ định danh các máy bằng địa chỉ IP, nên nó đưa được datagram tới đúng cỗ máy nhưng không nói được trong số nhiều tiến trình đang chạy trên máy đó thì tiến trình nào phải nhận — tầng giao vận thêm số hiệu cổng vào để hoàn tất việc giao.</em></p>`],

      [19, 'Addressing: Port Numbers',
        `<p class="y-chinh">🎯 Four things must be known before any transport-layer conversation: <strong>local host (IP), local process, remote host (IP), remote process</strong>. The IPs come from layer 3; the two processes need a second identifier, and that identifier is the <strong>port number: an integer from 0 to 65.535 (16 bits)</strong>.</p>
<table>
<tr><th>Range</th><th>Name</th><th>Who assigns it</th><th>Examples</th></tr>
<tr><td>0 – 1023</td><td>well-known ports</td><td>IANA; on Unix only root may bind them</td><td>13 daytime, 20/21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS</td></tr>
<tr><td>1024 – 49151</td><td>registered ports</td><td>IANA, on request</td><td>3000 Node dev server, 3306 MySQL, 5432 PostgreSQL, 8080 alt-HTTP</td></tr>
<tr><td>49152 – 65535</td><td>dynamic / ephemeral</td><td>the operating system, per connection</td><td>the 52.000 in the figure</td></tr>
</table>
<ul>
<li><strong>Read the figure — it is a worked example</strong> — a <em>Daytime client</em> on the left has been given the ephemeral port <strong>52.000</strong> by its operating system; the <em>Daytime server</em> on the right sits permanently on port <strong>13</strong>. The red arrow goes from 52.000 up to 13. Both boxes are drawn among other grey boxes: other processes on the same machines, each with their own ports.</li>
<li><strong>Why the client's port is temporary and the server's is not</strong> — the server must be findable by strangers, so its port is fixed and published. The client is the one doing the finding, so any free number will do, and a fresh one is taken for every connection. When your browser opens 6 connections to one site, it uses 6 different ephemeral ports.</li>
<li><strong>"Recommended to be greater than 1023"</strong> — exactly as the slide says, because 0–1023 are reserved. Real ranges differ by system: Linux uses 32768–60999 by default (see <code>/proc/sys/net/ipv4/ip_local_port_range</code>), and IANA recommends 49152–65535. Both satisfy the slide's rule.</li>
<li><strong>The four-part identifier has a name</strong> — <em>the socket address pair</em>, or in practice the <strong>4-tuple</strong>: (source IP, source port, destination IP, destination port). Two connections are different if any one of the four differs — which is how a server on port 443 can hold 50.000 simultaneous connections on a single port.</li>
<li><strong>16 bits, so exactly 2^16 = 65.536 values</strong> — 0 through 65.535. Port 0 is reserved and never used on the wire. This is also why a single machine cannot hold more than ~64.000 simultaneous <em>outgoing</em> connections to one destination IP and port: it runs out of ephemeral numbers.</li>
</ul>
<p class="pitfall">⚠️ A very common confusion: a port is <strong>not</strong> a piece of hardware. The USB port on your laptop and the transport-layer port 443 have nothing in common but the English word. A port number is a 16-bit integer written into a header — it is a label, not a socket you can touch.</p>`,
        `<p class="y-chinh">🎯 Phải biết bốn thứ trước khi có bất kỳ cuộc trò chuyện nào ở tầng giao vận: <strong>máy cục bộ (IP), tiến trình cục bộ, máy ở xa (IP), tiến trình ở xa</strong>. Hai cái IP do tầng 3 cấp; hai tiến trình cần một định danh thứ hai, và định danh ấy là <strong>số hiệu cổng: một số nguyên từ 0 tới 65.535 (16 bit)</strong>.</p>
<table>
<tr><th>Dải</th><th>Tên gọi</th><th>Ai cấp</th><th>Ví dụ</th></tr>
<tr><td>0 – 1023</td><td>cổng nổi tiếng (well-known)</td><td>IANA; trên Unix chỉ root mới gắn được</td><td>13 daytime, 20/21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS</td></tr>
<tr><td>1024 – 49151</td><td>cổng đã đăng ký</td><td>IANA, khi có đơn xin</td><td>3000 máy chủ Node lúc dev, 3306 MySQL, 5432 PostgreSQL, 8080 HTTP phụ</td></tr>
<tr><td>49152 – 65535</td><td>động / tạm thời (ephemeral)</td><td>hệ điều hành, cấp theo từng kết nối</td><td>số 52.000 trong hình</td></tr>
</table>
<ul>
<li><strong>Đọc hình — đó là một ví dụ có lời giải</strong> — một <em>máy khách Daytime</em> bên trái vừa được hệ điều hành cấp cổng tạm <strong>52.000</strong>; <em>máy chủ Daytime</em> bên phải ngồi vĩnh viễn ở cổng <strong>13</strong>. Mũi tên đỏ đi từ 52.000 lên 13. Cả hai hộp đều nằm xen giữa các hộp xám khác: những tiến trình khác trên cùng cỗ máy, mỗi cái có cổng riêng.</li>
<li><strong>Vì sao cổng của máy khách là tạm còn của máy chủ thì không</strong> — máy chủ phải để người lạ tìm ra được, nên cổng của nó cố định và được công bố. Máy khách là bên đi tìm, nên số nào rảnh cũng được, và mỗi kết nối lại lấy một số mới. Khi trình duyệt mở 6 kết nối tới một trang, nó dùng 6 cổng tạm khác nhau.</li>
<li><strong>"Nên lớn hơn 1023"</strong> — đúng như slide nói, vì 0–1023 đã được giữ chỗ. Dải thật khác nhau tuỳ hệ: Linux mặc định dùng 32768–60999 (xem <code>/proc/sys/net/ipv4/ip_local_port_range</code>), còn IANA khuyến nghị 49152–65535. Cả hai đều thoả luật của slide.</li>
<li><strong>Bộ định danh bốn phần này có tên</strong> — <em>cặp địa chỉ socket</em>, hay trong thực tế gọi là <strong>bộ bốn (4-tuple)</strong>: (IP nguồn, cổng nguồn, IP đích, cổng đích). Hai kết nối là khác nhau nếu chỉ cần một trong bốn thành phần khác — nhờ đó một máy chủ ở cổng 443 giữ được 50.000 kết nối đồng thời trên đúng một cổng.</li>
<li><strong>16 bit, nên đúng 2^16 = 65.536 giá trị</strong> — từ 0 tới 65.535. Cổng 0 được giữ chỗ và không bao giờ dùng trên đường truyền. Đây cũng là lý do một cỗ máy không thể có quá chừng 64.000 kết nối <em>đi ra</em> đồng thời tới cùng một IP và cổng đích: nó hết số tạm để cấp.</li>
</ul>
<p class="pitfall">⚠️ Một nhầm lẫn rất phổ biến: cổng <strong>KHÔNG</strong> phải một mẩu phần cứng. Cái cổng USB trên laptop và cổng 443 của tầng giao vận chẳng liên quan gì nhau ngoài chữ "cổng". Số hiệu cổng là một số nguyên 16 bit được ghi vào phần đầu gói tin — nó là một cái nhãn, không phải cái lỗ cắm.</p>`],

      [20, 'Transport-Layer Protocols: UDP and TCP',
        `<p class="y-chinh">🎯 The two protocols of layer 4, and the comparison the exam will ask for. <strong>UDP is connectionless and unreliable with minimum overhead; TCP is connection-oriented and reliable</strong>, with explicit connection establishment, data transfer and teardown phases.</p>
<table>
<tr><th></th><th>UDP</th><th>TCP</th></tr>
<tr><td>Connection</td><td>connectionless — just send</td><td>connection-oriented — 3-way handshake first</td></tr>
<tr><td>Reliability</td><td>none: lost packets stay lost</td><td>acknowledgements + retransmission</td></tr>
<tr><td>Ordering</td><td>none: may arrive out of order</td><td>guaranteed in-order delivery</td></tr>
<tr><td>Flow / congestion control</td><td>none</td><td>both (sliding window, slow start)</td></tr>
<tr><td>Header size</td><td><strong>fixed 8 bytes</strong></td><td><strong>20 to 60 bytes</strong></td></tr>
<tr><td>Data unit</td><td>user datagram</td><td>segment</td></tr>
<tr><td>Best for</td><td>small messages, live media, DNS, games</td><td>files, web pages, mail, anything that must be exact</td></tr>
</table>
<ul>
<li><strong>Read the two figures under the text</strong> — UDP: "8 to 65.535 bytes" total, with an 8-byte Header and the rest Data. TCP: "20 to 60 bytes" of Header and then Data. That header-size difference is the whole cost of reliability, and it is visible as a picture.</li>
<li><strong>What the 8 bytes of the UDP header contain</strong> — four 2-byte fields and nothing else: source port, destination port, length, checksum. Compare with TCP's minimum 20 bytes, which additionally carry a 32-bit sequence number, a 32-bit acknowledgement number, window size and flags. Every one of those extra fields exists to support a promise UDP does not make.</li>
<li><strong>"Connection establishment" = the 3-way handshake</strong> — the client sends <strong>SYN</strong>, the server replies <strong>SYN+ACK</strong>, the client sends <strong>ACK</strong>. Only then may data flow. That costs one full round trip before the first useful byte: on a 200 ms link to the US, 200 ms lost before anything happens. UDP sends the data in the first packet.</li>
<li><strong>The exam's favourite question — why do video calls use UDP and file downloads use TCP?</strong> Because their definitions of "correct" differ. In a file, a missing byte ruins the file, and waiting 300 ms for a retransmission costs nothing you can perceive. In a live call, a frame that arrives 300 ms late is <em>worse than useless</em> — the moment has passed, and playing it would break the conversation. So video prefers a fresh lost frame over a stale correct one. Same reason DNS (one small question, one small answer) and online games use UDP.</li>
<li><strong>The modern twist worth knowing</strong> — since 2021, HTTP/3 runs over <strong>QUIC, which is built on UDP</strong>, and it is reliable: Google rebuilt TCP's guarantees inside the application layer to escape TCP's handshake latency and head-of-line blocking. So "UDP = unimportant data" is wrong; the accurate statement is "UDP = the transport layer promises nothing, so the application decides what to promise".</li>
</ul>
<p class="pitfall">⚠️ Two problems with this slide. First, the title is a typo: <em>"Translayer-Layer Protocols"</em> should read "Transport-Layer Protocols". Second, "the total length needs to be less 65 535 bytes" is imprecise: the UDP <em>Length</em> field is 16 bits, so the total (8-byte header + data) is at most exactly <strong>65.535</strong> bytes and the data alone at most <strong>65.527</strong>. In practice you never approach that — Ethernet's MTU is 1.500 bytes, so anything larger gets fragmented at layer 3.</p>`,
        `<p class="y-chinh">🎯 Hai giao thức của tầng 4, và chính là phép so sánh mà đề thi sẽ hỏi. <strong>UDP phi kết nối và không tin cậy, chi phí tối thiểu; TCP hướng kết nối và tin cậy</strong>, có hẳn ba pha: thiết lập kết nối, truyền dữ liệu, và dỡ kết nối.</p>
<table>
<tr><th></th><th>UDP</th><th>TCP</th></tr>
<tr><td>Kết nối</td><td>phi kết nối — cứ thế gửi</td><td>hướng kết nối — bắt tay 3 bước trước đã</td></tr>
<tr><td>Độ tin cậy</td><td>không có: mất là mất luôn</td><td>báo nhận + gửi lại</td></tr>
<tr><td>Thứ tự</td><td>không đảm bảo: có thể tới lộn xộn</td><td>bảo đảm giao đúng thứ tự</td></tr>
<tr><td>Điều khiển luồng / tắc nghẽn</td><td>không có</td><td>có cả hai (cửa sổ trượt, khởi động chậm)</td></tr>
<tr><td>Kích thước phần đầu</td><td><strong>cố định 8 byte</strong></td><td><strong>20 tới 60 byte</strong></td></tr>
<tr><td>Đơn vị dữ liệu</td><td>user datagram</td><td>segment</td></tr>
<tr><td>Hợp với</td><td>thông điệp nhỏ, phát trực tiếp, DNS, game</td><td>tệp, trang web, thư, mọi thứ phải chính xác</td></tr>
</table>
<ul>
<li><strong>Đọc hai hình dưới phần chữ</strong> — UDP: tổng "8 to 65.535 bytes", trong đó Header 8 byte, còn lại là Data. TCP: Header "20 to 60 bytes" rồi mới tới Data. Chênh lệch kích thước phần đầu ấy chính là toàn bộ cái giá của sự tin cậy, và nó hiện ra thành hình.</li>
<li><strong>8 byte phần đầu UDP chứa gì</strong> — bốn trường 2 byte, không gì thêm: cổng nguồn, cổng đích, độ dài, tổng kiểm. So với tối thiểu 20 byte của TCP, vốn còn mang số thứ tự 32 bit, số báo nhận 32 bit, kích thước cửa sổ và các cờ. Mỗi trường dư ấy tồn tại để chống đỡ cho một lời hứa mà UDP không hề hứa.</li>
<li><strong>"Thiết lập kết nối" = bắt tay 3 bước</strong> — máy khách gửi <strong>SYN</strong>, máy chủ đáp <strong>SYN+ACK</strong>, máy khách gửi <strong>ACK</strong>. Chỉ sau đó dữ liệu mới được chảy. Cái giá là trọn một vòng khứ hồi trước byte hữu ích đầu tiên: trên một đường 200 ms đi Mỹ, mất 200 ms trước khi có gì xảy ra. UDP thì gửi dữ liệu ngay trong gói đầu tiên.</li>
<li><strong>Câu hỏi khoái khẩu của đề thi — vì sao gọi video dùng UDP còn tải tệp dùng TCP?</strong> Vì định nghĩa "đúng" của chúng khác nhau. Trong một tệp, thiếu một byte là hỏng cả tệp, mà chờ 300 ms để gửi lại thì bạn chẳng cảm nhận được gì. Trong cuộc gọi trực tiếp, một khung hình tới trễ 300 ms còn <em>tệ hơn là không có</em> — khoảnh khắc ấy trôi qua rồi, phát nó lên chỉ làm vỡ cuộc trò chuyện. Nên video thà mất một khung mới còn hơn nhận một khung cũ đúng. Cùng lý do đó, DNS (một câu hỏi nhỏ, một câu trả lời nhỏ) và game trực tuyến đều dùng UDP.</li>
<li><strong>Cú lật hiện đại đáng biết</strong> — từ 2021, HTTP/3 chạy trên <strong>QUIC, mà QUIC dựng trên UDP</strong>, và nó VẪN tin cậy: Google dựng lại các bảo đảm của TCP ngay trong tầng ứng dụng để thoát khỏi độ trễ bắt tay và hiện tượng nghẽn đầu hàng của TCP. Vậy câu "UDP = dữ liệu không quan trọng" là SAI; phát biểu đúng là "UDP = tầng giao vận không hứa gì cả, nên ứng dụng tự quyết định mình hứa gì".</li>
</ul>
<p class="pitfall">⚠️ Slide này có hai vấn đề. Thứ nhất, tiêu đề gõ nhầm: <em>"Translayer-Layer Protocols"</em> phải là "Transport-Layer Protocols". Thứ hai, câu "tổng độ dài phải nhỏ hơn 65 535 byte" là thiếu chính xác: trường <em>Length</em> của UDP dài 16 bit, nên TỔNG (8 byte header + dữ liệu) tối đa đúng bằng <strong>65.535</strong> byte, và riêng phần dữ liệu tối đa <strong>65.527</strong> byte. Trên thực tế bạn chẳng bao giờ tới gần con số ấy — MTU của Ethernet là 1.500 byte, cái gì lớn hơn sẽ bị phân mảnh ở tầng 3.</p>`],

      [21, '2.3 NETWORK LAYER',
        `<p class="y-chinh">🎯 Layer 3 in one word: <strong>host-to-host delivery</strong>. The slide then gives the exact three-step mechanic: accept a packet from the transport layer, <em>encapsulate</em> it in a datagram, hand it to the data-link layer; at the destination, <em>decapsulate</em> and hand the packet up.</p>
<ul>
<li><strong>"Host-to-host" is the phrase to memorise</strong> — compare it with slide 17's "process-to-process" (layer 4) and slide 25's "node-to-node" (layer 2). Three layers, three scopes, three hyphenated phrases. Examiners love this triple.</li>
<li><strong>The logical connection at this layer changes shape</strong> — in Figure 4.13 the red line no longer jumps straight from Alice to Bob. It now steps through <em>every router</em>: Alice → R2 → R4 → R5 → R7 → Bob, touching each router's Network box. This is the first layer where intermediate devices participate, and it is the visual difference between layers 4 and 3.</li>
<li><strong>Two responsibilities, and only the second needs routers</strong> — <em>packetizing</em> (slide 22), done only at the two ends; and <em>routing and forwarding</em>, done at every hop. A router's whole job is: read the destination IP, look it up in a routing table, and send the datagram out of the right interface. It does this tens of millions of times a second.</li>
<li><strong>Why IP is deliberately "best-effort"</strong> — no acknowledgements, no retransmission, no ordering, no connection. A datagram may be lost, duplicated, delayed or reordered and nobody is notified. That weakness is a design choice: it keeps routers simple and stateless, which is what let the Internet scale from four nodes in 1969 to billions.</li>
<li><strong>Count the hops yourself</strong> — run <code>traceroute cuongthai.com</code> (or <code>tracert</code> on Windows). Each line is one router that decremented the TTL field of your datagram. A typical path inside Vietnam is 6–12 hops; to the US, 15–25. Every one of those lines is a "Network" box in Figure 4.13.</li>
</ul>
<p class="meo">💡 The word <em>encapsulate</em> (put a header on, going down) and <em>decapsulate</em> (take the header off, going up) will now appear at every layer. Picture Russian dolls: each layer adds a shell on the way out and removes exactly its own shell on the way in.</p>`,
        `<p class="y-chinh">🎯 Tầng 3 gói trong một cụm: <strong>giao từ máy tới máy (host-to-host)</strong>. Rồi slide đưa ra đúng ba nhịp cơ học: nhận một gói từ tầng giao vận, <em>đóng gói</em> nó vào một datagram, trao cho tầng liên kết dữ liệu; tới nơi thì <em>bóc gói</em> và trao ngược lên trên.</p>
<ul>
<li><strong>"Host-to-host" là cụm phải thuộc</strong> — đặt cạnh "process-to-process" của slide 17 (tầng 4) và "node-to-node" của slide 25 (tầng 2). Ba tầng, ba phạm vi, ba cụm từ có gạch nối. Người ra đề rất khoái bộ ba này.</li>
<li><strong>Đường kết nối lô-gic ở tầng này ĐỔI hình dạng</strong> — trong Hình 4.13, đường đỏ không còn nhảy thẳng từ Alice tới Bob nữa. Nó nay bước qua <em>TỪNG router</em>: Alice → R2 → R4 → R5 → R7 → Bob, chạm vào hộp Network của mỗi router. Đây là tầng đầu tiên mà thiết bị trung gian có tham gia, và đó chính là khác biệt nhìn thấy được giữa tầng 4 và tầng 3.</li>
<li><strong>Hai trách nhiệm, và chỉ cái thứ hai cần tới router</strong> — <em>đóng gói (packetizing)</em>, chỉ làm ở hai đầu (slide 22); và <em>định tuyến rồi chuyển tiếp</em>, làm ở mọi chặng. Toàn bộ công việc của router là: đọc IP đích, tra trong bảng định tuyến, rồi đẩy datagram ra đúng cổng. Nó làm việc đó hàng chục triệu lần mỗi giây.</li>
<li><strong>Vì sao IP được CỐ Ý làm "nỗ lực tối đa" (best-effort)</strong> — không báo nhận, không gửi lại, không giữ thứ tự, không kết nối. Một datagram có thể mất, bị nhân đôi, bị trễ hoặc đảo thứ tự mà chẳng ai được báo. Cái yếu ấy là một lựa chọn thiết kế: nó giữ cho router đơn giản và không phải nhớ trạng thái, và chính điều đó cho phép Internet lớn từ bốn nút năm 1969 lên hàng tỉ.</li>
<li><strong>Tự đếm số chặng</strong> — chạy <code>traceroute cuongthai.com</code> (hoặc <code>tracert</code> trên Windows). Mỗi dòng là một router đã trừ đi một đơn vị trường TTL của datagram bạn gửi. Đường đi trong nước thường 6–12 chặng; đi Mỹ 15–25 chặng. Mỗi dòng ấy là một hộp "Network" trong Hình 4.13.</li>
</ul>
<p class="meo">💡 Hai chữ <em>đóng gói</em> (gắn thêm phần đầu, khi đi xuống) và <em>bóc gói</em> (gỡ phần đầu ra, khi đi lên) từ giờ sẽ xuất hiện ở mọi tầng. Hãy hình dung búp bê Nga: mỗi tầng chụp thêm một lớp vỏ lúc đi ra, và gỡ đúng lớp vỏ của chính mình lúc đi vào.</p>`],

      [22, 'Packetizing at Network Layer',
        `<p class="y-chinh">🎯 The definition of packetizing: <strong>encapsulating the payload in a network-layer packet at the source, and decapsulating it at the destination</strong> — plus the three numbered steps that say exactly who does what.</p>
<ul>
<li><strong>Step 1 — the source adds a header</strong> — "a header that contains source and destination addresses and some other information". The "other information" in an IPv4 header (20 bytes minimum) is: version, header length, total length, an identification field, flags and fragment offset, <strong>TTL</strong>, protocol number (6 = TCP, 17 = UDP), and a checksum.</li>
<li><strong>Step 2 — logical delivery to the destination's network layer</strong> — "logically", because the datagram physically passes through every router in between. The routers read and rewrite only what they must: each one decrements the TTL by 1 and recomputes the header checksum. If TTL reaches 0, the datagram is discarded and an ICMP message goes back — which is precisely how <code>traceroute</code> works.</li>
<li><strong>Step 3 — the destination decapsulates and delivers upward</strong> — it strips the IP header and hands the payload to TCP or UDP, chosen by the protocol number in the header.</li>
<li><strong>Read the figure's caption first — it says something important</strong> — "A transport-layer payload may become <em>several</em> network-layer packets". One TCP segment does not always equal one IP datagram: if the segment is larger than the link's MTU (1.500 bytes on Ethernet), IP fragments it into pieces that are reassembled only at the final destination.</li>
<li><strong>Read the legend</strong> — <code>P</code> = Payload, <code>H</code> = Header. On the Sender side the grey Transport row shows [H|P] and an arrow pushes it down into the yellow Network row, which wraps it as [H|[H|P]]. On the Receiver side the arrow points up and the wrapping is removed. The whole of encapsulation in one small picture.</li>
</ul>
<p class="dap-an">✅ <strong>The full journey, end to end — what actually happens when you type <code>cuongthai.com</code> into a browser.</strong> This is the story that ties the whole chapter together; learn the ten steps and you can answer almost any "explain how..." question.</p>
<table>
<tr><th>#</th><th>Layer</th><th>What happens</th><th>Result</th></tr>
<tr><td>1</td><td>5 Application</td><td>the browser asks a resolver for the IP address of <code>cuongthai.com</code> — a small UDP query to port 53</td><td>203.0.113.45</td></tr>
<tr><td>2</td><td>4 Transport</td><td>TCP opens a connection from ephemeral port 52.000 to port 443: SYN → SYN+ACK → ACK</td><td>one round trip spent</td></tr>
<tr><td>3</td><td>5 Application</td><td><code>GET / HTTP/1.1</code> plus headers is handed down to the transport layer</td><td>a <em>message</em></td></tr>
<tr><td>4</td><td>4 Transport</td><td>TCP adds a 20-byte header: the two port numbers and a sequence number</td><td>a <em>segment</em></td></tr>
<tr><td>5</td><td>3 Network</td><td>IP adds a 20-byte header: source IP 192.168.1.10, destination IP 203.0.113.45</td><td>a <em>datagram</em></td></tr>
<tr><td>6</td><td>2 Data link</td><td>Ethernet adds a 14-byte header (destination MAC = <em>your router</em>, source MAC = your card, type 0x0800) and a 4-byte CRC</td><td>a <em>frame</em></td></tr>
<tr><td>7</td><td>1 Physical</td><td>the frame is pushed out as voltages on copper or pulses of light on fibre</td><td><em>bits</em></td></tr>
<tr><td>8</td><td>2 and 3, each hop</td><td>the switch reads the MAC and forwards; each router strips the frame, reads the IP, decrements TTL and <strong>builds a brand-new frame</strong> for the next hop</td><td>IP never changes, MAC changes every hop</td></tr>
<tr><td>9</td><td>1 → 5 at the server</td><td>the five shells come off in reverse order and the process listening on port 443 receives your request</td><td>bits → frame → datagram → segment → message</td></tr>
<tr><td>10</td><td>all of them, backwards</td><td>the response travels back the same way</td><td>the browser starts drawing</td></tr>
</table>
<p class="meo">💡 Count the overhead: an empty TCP/IP packet over Ethernet costs 14 + 20 + 20 + 4 = 58 bytes of headers. That is why sending one byte at a time is catastrophically wasteful, and why protocols batch.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của packetizing: <strong>đóng phần tải vào một gói tầng mạng ở nguồn, và bóc nó ra ở đích</strong> — cộng ba bước đánh số nói rõ ai làm gì.</p>
<ul>
<li><strong>Bước 1 — bên nguồn gắn phần đầu</strong> — "một header chứa địa chỉ nguồn, địa chỉ đích và vài thông tin khác". "Vài thông tin khác" trong header IPv4 (tối thiểu 20 byte) gồm: phiên bản, độ dài header, tổng độ dài, trường định danh, các cờ và độ dời mảnh, <strong>TTL</strong>, số hiệu giao thức (6 = TCP, 17 = UDP), và một tổng kiểm.</li>
<li><strong>Bước 2 — giao "lô-gic" tới tầng mạng bên đích</strong> — chữ "lô-gic" là vì datagram thật ra phải đi xuyên qua mọi router ở giữa. Các router chỉ đọc và viết lại đúng thứ chúng buộc phải đụng: mỗi cái trừ TTL đi 1 rồi tính lại tổng kiểm của header. Nếu TTL về 0, datagram bị vứt và một thông điệp ICMP quay về — và đó chính xác là cách <code>traceroute</code> hoạt động.</li>
<li><strong>Bước 3 — bên đích bóc gói và giao lên trên</strong> — nó lột phần đầu IP ra và trao phần tải cho TCP hoặc UDP, chọn theo số hiệu giao thức ghi trong header.</li>
<li><strong>Đọc dòng chú thích của hình trước đã — nó nói một điều quan trọng</strong> — "Một phần tải của tầng giao vận CÓ THỂ trở thành <em>NHIỀU</em> gói tầng mạng". Một segment TCP không phải lúc nào cũng bằng một datagram IP: nếu segment lớn hơn MTU của đường truyền (1.500 byte trên Ethernet), IP sẽ cắt nó thành các mảnh, và các mảnh chỉ được ghép lại ở đích cuối cùng.</li>
<li><strong>Đọc phần chú giải</strong> — <code>P</code> = Payload (tải), <code>H</code> = Header (đầu). Bên Sender, hàng xám Transport hiện [H|P] và một mũi tên đẩy nó xuống hàng vàng Network, nơi nó bị bọc thành [H|[H|P]]. Bên Receiver mũi tên chỉ lên và lớp bọc bị gỡ. Toàn bộ chuyện đóng gói nằm gọn trong một bức hình nhỏ.</li>
</ul>
<p class="dap-an">✅ <strong>Trọn vòng hành trình — điều gì THẬT SỰ xảy ra khi bạn gõ <code>cuongthai.com</code> vào trình duyệt.</strong> Đây là câu chuyện xâu chuỗi cả chương; thuộc được mười bước này là bạn trả lời được gần như mọi câu "hãy giải thích cách…".</p>
<table>
<tr><th>#</th><th>Tầng</th><th>Chuyện gì xảy ra</th><th>Kết quả</th></tr>
<tr><td>1</td><td>5 Ứng dụng</td><td>trình duyệt hỏi bộ phân giải địa chỉ IP của <code>cuongthai.com</code> — một truy vấn UDP nhỏ tới cổng 53</td><td>203.0.113.45</td></tr>
<tr><td>2</td><td>4 Giao vận</td><td>TCP mở kết nối từ cổng tạm 52.000 tới cổng 443: SYN → SYN+ACK → ACK</td><td>tốn một vòng khứ hồi</td></tr>
<tr><td>3</td><td>5 Ứng dụng</td><td><code>GET / HTTP/1.1</code> kèm các header được trao xuống tầng giao vận</td><td>một <em>message</em></td></tr>
<tr><td>4</td><td>4 Giao vận</td><td>TCP gắn header 20 byte: hai số hiệu cổng và một số thứ tự</td><td>một <em>segment</em></td></tr>
<tr><td>5</td><td>3 Mạng</td><td>IP gắn header 20 byte: IP nguồn 192.168.1.10, IP đích 203.0.113.45</td><td>một <em>datagram</em></td></tr>
<tr><td>6</td><td>2 Liên kết dữ liệu</td><td>Ethernet gắn header 14 byte (MAC đích = <em>router nhà bạn</em>, MAC nguồn = card của bạn, type 0x0800) và 4 byte CRC</td><td>một <em>frame</em></td></tr>
<tr><td>7</td><td>1 Vật lý</td><td>khung được đẩy ra thành hiệu điện thế trên dây đồng hoặc xung ánh sáng trên sợi quang</td><td>các <em>bit</em></td></tr>
<tr><td>8</td><td>2 và 3, mỗi chặng</td><td>switch đọc MAC rồi chuyển tiếp; mỗi router lột khung, đọc IP, trừ TTL và <strong>dựng một khung HOÀN TOÀN MỚI</strong> cho chặng kế</td><td>IP không bao giờ đổi, MAC đổi mọi chặng</td></tr>
<tr><td>9</td><td>1 → 5 ở máy chủ</td><td>năm lớp vỏ được lột theo thứ tự ngược, và tiến trình đang nghe ở cổng 443 nhận được yêu cầu của bạn</td><td>bit → frame → datagram → segment → message</td></tr>
<tr><td>10</td><td>tất cả, theo chiều ngược</td><td>phản hồi đi ngược đúng con đường ấy</td><td>trình duyệt bắt đầu vẽ</td></tr>
</table>
<p class="meo">💡 Đếm thử chi phí: một gói TCP/IP rỗng chạy trên Ethernet đã tốn 14 + 20 + 20 + 4 = 58 byte chỉ riêng phần đầu. Đó là lý do gửi từng byte một là lãng phí thảm hại, và là lý do các giao thức luôn gom lô.</p>`],

      [23, 'Network-Layer Protocols',
        `<p class="y-chinh">🎯 The main protocol is <strong>IP (Internet Protocol)</strong>, in two versions in use today: <strong>IPv4 and IPv6</strong>. And one IP address can be written three ways: binary (base 2), dotted-decimal (base 256) and hexadecimal (base 16).</p>
<table>
<tr><th></th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Address length</td><td><strong>32 bits</strong></td><td><strong>128 bits</strong></td></tr>
<tr><td>Number of addresses</td><td>2^32 ≈ 4,3 tỉ</td><td>2^128 ≈ 3,4 × 10^38</td></tr>
<tr><td>Written as</td><td>4 decimal bytes: <code>129.3.7.30</code></td><td>8 hex groups: <code>2001:0db8:85a3::8a2e:0370:7334</code></td></tr>
<tr><td>Header</td><td>20–60 bytes, has a checksum</td><td>fixed 40 bytes, no checksum</td></tr>
<tr><td>Fragmentation</td><td>routers may fragment</td><td>only the source may</td></tr>
<tr><td>Status</td><td>pool exhausted; kept alive by NAT</td><td>the long-term answer, ~45% of traffic to Google in 2026</td></tr>
</table>
<ul>
<li><strong>Work through the figure's own example</strong> — binary <code>10000001 00000011 00000111 00011110</code>. Convert byte by byte: 10000001 = 128+1 = <strong>129</strong>; 00000011 = <strong>3</strong>; 00000111 = <strong>7</strong>; 00011110 = 16+8+4+2 = <strong>30</strong>. So the dotted-decimal form is <code>129.3.7.30</code>, exactly as printed.</li>
<li><strong>Now the hexadecimal</strong> — group the bits in fours: 1000 0001 → 8 1; 0000 0011 → 0 3; 0000 0111 → 0 7; 0001 1110 → 1 E. So the hex form is <code>8103071E</code>. See the trap below about what the slide prints.</li>
<li><strong>Why "base 256" is the right name for dotted-decimal</strong> — each of the four positions holds one byte, i.e. a digit in base 256 (values 0–255), and the dots are just separators. That is why 192.168.1.256 is not a valid address: 256 does not fit in a base-256 digit.</li>
<li><strong>IPv4 exhaustion is not a prediction, it already happened</strong> — 2^32 = 4.294.967.296 addresses, minus large reserved blocks. IANA handed out its last free block on <strong>3 February 2011</strong>; APNIC (Asia-Pacific, which serves Vietnam) ran out on 15 April 2011; RIPE on 25 November 2019. What keeps IPv4 working is <strong>NAT</strong>: your whole home shares one public address, and the router rewrites port numbers to tell the internal machines apart. That is also why your phone's IP starts with 192.168 or 10.</li>
<li><strong>How big 2^128 really is</strong> — about 3,4 × 10^38 addresses, roughly 5 × 10^28 per person alive. The point of the size is not counting devices; it is that addresses can be handed out in huge wasteful blocks so routing tables stay simple and no one ever has to do this again.</li>
</ul>
<p class="pitfall">⚠️ The figure's hexadecimal value is wrong. It prints <code>8003071E</code>, but the first byte of the address is 129 = binary 10000001 = <strong>0x81</strong>, not 0x80 (which would be 128). The correct conversion of 129.3.7.30 is <strong>8103071E</strong>. Do the conversion yourself in the exam instead of copying the figure — the other three bytes (03, 07, 1E) are correct, so the error is easy to miss.</p>`,
        `<p class="y-chinh">🎯 Giao thức chính là <strong>IP (Internet Protocol)</strong>, hôm nay dùng hai phiên bản: <strong>IPv4 và IPv6</strong>. Và một địa chỉ IP viết được theo ba cách: nhị phân (cơ số 2), thập phân có dấu chấm (cơ số 256) và thập lục phân (cơ số 16).</p>
<table>
<tr><th></th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Độ dài địa chỉ</td><td><strong>32 bit</strong></td><td><strong>128 bit</strong></td></tr>
<tr><td>Số địa chỉ</td><td>2^32 ≈ 4,3 tỉ</td><td>2^128 ≈ 3,4 × 10^38</td></tr>
<tr><td>Viết dạng</td><td>4 byte thập phân: <code>129.3.7.30</code></td><td>8 nhóm hệ 16: <code>2001:0db8:85a3::8a2e:0370:7334</code></td></tr>
<tr><td>Phần đầu</td><td>20–60 byte, có tổng kiểm</td><td>cố định 40 byte, bỏ tổng kiểm</td></tr>
<tr><td>Phân mảnh</td><td>router được phép cắt mảnh</td><td>chỉ bên nguồn được cắt</td></tr>
<tr><td>Tình trạng</td><td>đã cạn kho; sống nhờ NAT</td><td>lời giải dài hạn, ~45% lưu lượng vào Google năm 2026</td></tr>
</table>
<ul>
<li><strong>Tự làm ví dụ của chính bức hình</strong> — nhị phân <code>10000001 00000011 00000111 00011110</code>. Đổi từng byte: 10000001 = 128+1 = <strong>129</strong>; 00000011 = <strong>3</strong>; 00000111 = <strong>7</strong>; 00011110 = 16+8+4+2 = <strong>30</strong>. Vậy dạng thập phân chấm là <code>129.3.7.30</code>, đúng như hình in.</li>
<li><strong>Giờ tới hệ mười sáu</strong> — gom bit thành từng nhóm bốn: 1000 0001 → 8 1; 0000 0011 → 0 3; 0000 0111 → 0 7; 0001 1110 → 1 E. Vậy dạng hệ 16 là <code>8103071E</code>. Xem phần bẫy bên dưới về con số mà slide in ra.</li>
<li><strong>Vì sao gọi dạng chấm là "cơ số 256" mới đúng</strong> — mỗi trong bốn vị trí giữ một byte, tức một chữ số hệ 256 (giá trị 0–255), còn các dấu chấm chỉ là dấu ngăn. Vì thế 192.168.1.256 không phải địa chỉ hợp lệ: 256 không nhét vừa một chữ số hệ 256.</li>
<li><strong>Chuyện cạn IPv4 không phải dự báo, nó ĐÃ xảy ra</strong> — 2^32 = 4.294.967.296 địa chỉ, còn phải trừ những khối lớn đã giữ chỗ. IANA phát khối trống cuối cùng ngày <strong>03/02/2011</strong>; APNIC (khu vực châu Á – Thái Bình Dương, phục vụ Việt Nam) hết ngày 15/04/2011; RIPE hết ngày 25/11/2019. Thứ giữ cho IPv4 còn chạy là <strong>NAT</strong>: cả nhà bạn dùng chung một địa chỉ công cộng, và router viết lại số hiệu cổng để phân biệt các máy bên trong. Đó cũng là lý do IP của điện thoại bạn bắt đầu bằng 192.168 hay 10.</li>
<li><strong>2^128 lớn cỡ nào</strong> — chừng 3,4 × 10^38 địa chỉ, khoảng 5 × 10^28 cái cho mỗi người đang sống. Ý nghĩa của con số ấy không phải để đếm thiết bị; mà là để phát địa chỉ theo những khối to tướng, lãng phí thoải mái, nhờ đó bảng định tuyến gọn và không ai phải làm lại chuyện này lần nữa.</li>
</ul>
<p class="pitfall">⚠️ Giá trị hệ mười sáu trong hình bị SAI. Hình in <code>8003071E</code>, nhưng byte đầu của địa chỉ là 129 = nhị phân 10000001 = <strong>0x81</strong>, không phải 0x80 (0x80 ứng với 128). Chuyển đổi đúng của 129.3.7.30 là <strong>8103071E</strong>. Vào phòng thi hãy TỰ đổi thay vì chép theo hình — ba byte còn lại (03, 07, 1E) đều đúng, nên cái sai rất dễ lọt.</p>`],

      [24, '2.4 DATA-LINK LAYER',
        `<p class="y-chinh">🎯 The most surprising sentence in the chapter: <strong>"The TCP/IP suite does not define any protocol in the data-link layer."</strong> This layer is left to "the territories of networks that, when connected, make up the Internet" — wired or wireless, they receive services from and provide services to the network layer.</p>
<ul>
<li><strong>Why TCP/IP deliberately defines nothing here</strong> — because it cannot know what you will build the link out of. In 1974 it was telephone lines and radio; since then it has been Ethernet, Token Ring, ATM, Wi-Fi, DOCSIS, 4G, 5G, fibre, satellite and Bluetooth. If TCP/IP had standardised layer 2, the Internet would have died with the first obsolete cable.</li>
<li><strong>That single design choice is why the Internet survived</strong> — IP is often drawn as an hourglass: hundreds of applications on top, hundreds of link technologies underneath, and exactly one protocol in the narrow waist. Everything must speak IP; nothing must agree on anything else.</li>
<li><strong>Who does define layer 2, then</strong> — the <strong>IEEE</strong>, mostly: 802.3 for Ethernet (1983), 802.11 for Wi-Fi (1997), 802.15 for Bluetooth. That is why slides 26–29 leave TCP/IP behind and start naming IEEE technologies.</li>
<li><strong>What the data-link layer is responsible for, whoever writes it</strong> — <em>framing</em> (marking where a frame begins and ends), <em>physical addressing</em> (MAC addresses), <em>error detection</em> (the CRC you will see on slide 26), and <em>medium access control</em> (whose turn is it to transmit on a shared cable or on shared air).</li>
<li><strong>Figure 4.14 shows the shortest logical connections yet</strong> — no single line from Alice to Bob any more. Instead, a separate short link for each hop: Alice–R2, R2–R4, R4–R5, and so on. Each of those links may be a completely different technology, and none of them knows about the others.</li>
</ul>
<p class="meo">💡 Remember the hourglass: <strong>many applications above, many link technologies below, one IP in the middle.</strong> If you can draw that shape you can explain in one sentence why your phone keeps its session when it switches from Wi-Fi to 5G.</p>`,
        `<p class="y-chinh">🎯 Câu bất ngờ nhất cả chương: <strong>"Bộ TCP/IP KHÔNG định nghĩa bất kỳ giao thức nào ở tầng liên kết dữ liệu."</strong> Tầng này được nhường cho "lãnh địa của các mạng mà khi nối lại với nhau thì làm nên Internet" — có dây hay không dây, chúng nhận dịch vụ từ và cấp dịch vụ cho tầng mạng.</p>
<ul>
<li><strong>Vì sao TCP/IP cố ý không định nghĩa gì ở đây</strong> — vì nó không thể biết bạn sẽ dựng đường truyền bằng cái gì. Năm 1974 đó là đường điện thoại và sóng vô tuyến; từ bấy tới nay đã là Ethernet, Token Ring, ATM, Wi-Fi, DOCSIS, 4G, 5G, sợi quang, vệ tinh và Bluetooth. Nếu TCP/IP chuẩn hoá cứng tầng 2, Internet đã chết cùng sợi cáp lỗi thời đầu tiên.</li>
<li><strong>Chính một lựa chọn thiết kế ấy khiến Internet sống sót</strong> — người ta hay vẽ IP thành cái đồng hồ cát: hàng trăm ứng dụng ở trên, hàng trăm công nghệ đường truyền ở dưới, và đúng MỘT giao thức ở cái eo hẹp. Mọi thứ đều phải nói IP; và ngoài ra không phải thống nhất với nhau chuyện gì nữa.</li>
<li><strong>Vậy ai định nghĩa tầng 2</strong> — phần lớn là <strong>IEEE</strong>: 802.3 cho Ethernet (1983), 802.11 cho Wi-Fi (1997), 802.15 cho Bluetooth. Vì thế slide 26–29 bỏ TCP/IP lại phía sau và bắt đầu gọi tên các công nghệ của IEEE.</li>
<li><strong>Tầng liên kết dữ liệu chịu trách nhiệm gì, bất kể ai viết nó</strong> — <em>đóng khung</em> (đánh dấu khung bắt đầu và kết thúc ở đâu), <em>đánh địa chỉ vật lý</em> (địa chỉ MAC), <em>phát hiện lỗi</em> (cái CRC bạn sẽ thấy ở slide 26), và <em>điều khiển truy nhập môi trường</em> (tới lượt ai được phát trên sợi cáp dùng chung hay trên vùng không khí dùng chung).</li>
<li><strong>Hình 4.14 vẽ những kết nối lô-gic ngắn nhất từ đầu chương tới giờ</strong> — không còn một đường liền từ Alice tới Bob nữa. Thay vào đó là từng đoạn ngắn rời cho mỗi chặng: Alice–R2, R2–R4, R4–R5, và cứ thế. Mỗi đoạn ấy có thể là một công nghệ hoàn toàn khác nhau, và không đoạn nào biết gì về đoạn nào.</li>
</ul>
<p class="meo">💡 Nhớ cái đồng hồ cát: <strong>nhiều ứng dụng ở trên, nhiều công nghệ đường truyền ở dưới, một IP ở giữa.</strong> Vẽ được hình đó là bạn giải thích được trong một câu vì sao điện thoại giữ nguyên phiên khi nó nhảy từ Wi-Fi sang 5G.</p>`],

      [25, 'Nodes and Links',
        `<p class="y-chinh">🎯 The third hyphenated phrase: communication at the data-link layer is <strong>node-to-node</strong>. And the vocabulary: the two end hosts and the routers are called <strong>nodes</strong>; the networks between them are called <strong>links</strong>.</p>
<table>
<tr><th>Device</th><th>Works at layer</th><th>Decides using</th><th>What it does with a frame</th></tr>
<tr><td>Hub / repeater</td><td>1 — physical</td><td>nothing at all</td><td>repeats every bit out of every other port; everyone hears everyone</td></tr>
<tr><td>Switch / bridge</td><td>2 — data link</td><td><strong>MAC address</strong></td><td>learns which MAC is on which port, forwards out one port only</td></tr>
<tr><td>Router</td><td>3 — network</td><td><strong>IP address</strong></td><td>strips the frame, routes the datagram, builds a brand-new frame</td></tr>
</table>
<ul>
<li><strong>Read the figure in its two halves</strong> — panel <em>a. A small part of the Internet</em> shows three LANs joined by four red routers through two "Point-to-point network" links. Panel <em>b. Nodes and links</em> abstracts exactly the same thing into six black dots labelled Node with five segments labelled Link between them. Same picture, all detail removed.</li>
<li><strong>Why the abstraction is useful</strong> — once you see the chain of nodes and links, "what does the data-link layer do?" has an obvious answer: it gets a frame safely across <strong>one</strong> link, then its job is finished and the next node's data-link layer starts a new job.</li>
<li><strong>The consequence you must be able to state</strong> — because each link is a separate delivery, the frame is rebuilt at every node. New source MAC, new destination MAC, new CRC, possibly a completely different frame format (Ethernet on one link, Wi-Fi on the next). The IP datagram inside is carried unchanged, except that its TTL drops by one.</li>
<li><strong>Hub vs switch, the practical difference</strong> — on a hub, all ports share one collision domain: if two machines talk at once the signals collide and both must retry (that is the CSMA/CD algorithm). On a switch each port is its own collision domain, so all ports can transmit at full speed simultaneously. That is why hubs disappeared.</li>
<li><strong>Why a switch does not appear in the layer-3 figure</strong> — look back at Figure 4.13 on slide 21: only routers are drawn between the hosts. Switches are invisible at layer 3 because they never touch the IP header; they are part of the <em>link</em>, not a node on the IP path. This is also why a switch does not appear in <code>traceroute</code> output.</li>
</ul>
<p class="meo">💡 One sentence that gets you through every device question: <strong>hub repeats bits, switch reads MAC, router reads IP.</strong> Layer 1, layer 2, layer 3 — in that order, and the address gets more global at each step.</p>`,
        `<p class="y-chinh">🎯 Cụm gạch nối thứ ba: liên lạc ở tầng liên kết dữ liệu là <strong>nút tới nút (node-to-node)</strong>. Và phần từ vựng: hai host đầu cuối cùng các router được gọi là <strong>nút (node)</strong>; các mạng nằm giữa chúng được gọi là <strong>liên kết (link)</strong>.</p>
<table>
<tr><th>Thiết bị</th><th>Làm ở tầng</th><th>Quyết định dựa vào</th><th>Nó làm gì với một khung</th></tr>
<tr><td>Hub / bộ lặp</td><td>1 — vật lý</td><td>không gì cả</td><td>lặp mọi bit ra mọi cổng còn lại; ai cũng nghe thấy ai</td></tr>
<tr><td>Switch / cầu nối</td><td>2 — liên kết dữ liệu</td><td><strong>địa chỉ MAC</strong></td><td>học xem MAC nào ở cổng nào, chỉ đẩy ra đúng một cổng</td></tr>
<tr><td>Router</td><td>3 — mạng</td><td><strong>địa chỉ IP</strong></td><td>lột khung ra, định tuyến datagram, rồi dựng một khung hoàn toàn mới</td></tr>
</table>
<ul>
<li><strong>Đọc hình theo hai nửa</strong> — bảng <em>a. A small part of the Internet</em> vẽ ba LAN nối với nhau qua bốn router đỏ và hai đường "Point-to-point network". Bảng <em>b. Nodes and links</em> trừu tượng hoá đúng cái đó thành sáu chấm đen ghi Node và năm đoạn ghi Link ở giữa. Cùng một bức tranh, đã gỡ sạch chi tiết.</li>
<li><strong>Vì sao phép trừu tượng ấy có ích</strong> — một khi bạn nhìn ra chuỗi nút–liên kết, câu "tầng liên kết dữ liệu làm gì?" có câu trả lời hiển nhiên: nó đưa một khung qua an toàn <strong>MỘT</strong> liên kết, xong việc, rồi tầng liên kết dữ liệu ở nút kế tiếp bắt đầu một việc mới.</li>
<li><strong>Hệ quả mà bạn phải phát biểu được</strong> — vì mỗi liên kết là một lần giao riêng, khung được dựng lại ở MỌI nút. MAC nguồn mới, MAC đích mới, CRC mới, thậm chí có thể là một định dạng khung hoàn toàn khác (Ethernet ở chặng này, Wi-Fi ở chặng sau). Datagram IP nằm bên trong được chở nguyên vẹn, chỉ có TTL giảm đi một.</li>
<li><strong>Hub với switch, khác nhau ở đâu trên thực tế</strong> — trên hub, mọi cổng chung một miền đụng độ: hai máy nói cùng lúc thì tín hiệu chồng nhau và cả hai phải thử lại (đó là thuật toán CSMA/CD). Trên switch, mỗi cổng là một miền đụng độ riêng, nên mọi cổng cùng phát hết tốc độ được. Vì thế hub biến mất.</li>
<li><strong>Vì sao switch không hiện ra trong hình tầng 3</strong> — nhìn lại Hình 4.13 ở slide 21: giữa hai host chỉ vẽ router. Switch vô hình ở tầng 3 vì nó không bao giờ đụng vào phần đầu IP; nó là một phần của <em>liên kết</em> chứ không phải một nút trên đường đi IP. Đó cũng là lý do switch không xuất hiện trong kết quả <code>traceroute</code>.</li>
</ul>
<p class="meo">💡 Một câu đưa bạn qua mọi câu hỏi về thiết bị: <strong>hub lặp bit, switch đọc MAC, router đọc IP.</strong> Tầng 1, tầng 2, tầng 3 — đúng thứ tự ấy, và địa chỉ càng lúc càng mang tính toàn cầu hơn.</p>`],

      [26, 'Wired LANs: Ethernet',
        `<p class="y-chinh">🎯 The dominant wired LAN technology, born in the <strong>1970s</strong> at Xerox PARC from <strong>Robert Metcalfe and David Boggs</strong>, and still the thing in the wall socket next to you. The slide gives four generations and the frame format.</p>
<table>
<tr><th>Generation</th><th>Speed</th><th>Standard / year</th></tr>
<tr><td>Standard Ethernet</td><td>10 Mb/s</td><td>IEEE 802.3, 1983</td></tr>
<tr><td>Fast Ethernet</td><td>100 Mb/s</td><td>802.3u, 1995</td></tr>
<tr><td>Gigabit Ethernet</td><td>1 Gb/s</td><td>802.3ab (copper), 1999</td></tr>
<tr><td>10 Gigabit Ethernet</td><td>10 Gb/s</td><td>802.3ae, 2002</td></tr>
</table>
<ul>
<li><strong>Read the frame format in the figure, field by field</strong> — <code>Destination address 6 bytes | Source address 6 bytes | Type 2 bytes | Data and padding 46–1500 bytes | CRC 4 bytes</code>. The figure also states: minimum frame length <strong>512 bits = 64 bytes</strong>, maximum <strong>12.144 bits = 1518 bytes</strong>. Check the arithmetic yourself: 6+6+2+1500+4 = 1518 ✓, and 6+6+2+46+4 = 64 ✓.</li>
<li><strong>The two 48-bit addresses on the slide are the MAC addresses</strong> — 6 bytes each, exactly as slide 6 promised, written <code>3C:22:FB:9A:04:71</code>. The special destination <code>FF:FF:FF:FF:FF:FF</code> means broadcast: every machine on the LAN must accept it.</li>
<li><strong>Why there is a minimum length at all</strong> — 64 bytes is not arbitrary. On the original shared cable, a sender had to still be transmitting when a collision signal could get back to it, otherwise it would never notice the collision. 64 bytes at 10 Mb/s over 2.500 m of cable is exactly that round-trip window. A modern switched network has no collisions, but the 64-byte floor stayed for compatibility — short frames are padded.</li>
<li><strong>What the Type field does</strong> — it says which layer-3 protocol is inside: <code>0x0800</code> = IPv4, <code>0x86DD</code> = IPv6, <code>0x0806</code> = ARP. This is how decapsulation on slide 22 knows where to hand the payload.</li>
<li><strong>CRC = Cyclic Redundancy Check</strong> — 4 bytes computed over the whole frame. The receiver recomputes it; if it does not match, the frame is <strong>silently discarded</strong>. Note carefully: Ethernet <em>detects</em> errors, it does not correct them and it does not ask for a resend. Recovery is TCP's job, three layers up.</li>
</ul>
<p class="pitfall">⚠️ Two things about this slide. The title is a typo — <em>"Wred LANs"</em> should be "Wired LANs". And the speed table stops at 10 Gb/s because the textbook is from 2017: since then 25G (802.3by, 2016), 40G and 100G (802.3ba, 2010), 400G (802.3bs, 2017) and 800G (802.3df, 2024) have all been standardised, and data centres run 100–400 Gb/s as normal. Also note that the figure shows the frame <em>without</em> the 7-byte preamble and 1-byte start-frame delimiter that physically precede it on the wire.</p>`,
        `<p class="y-chinh">🎯 Công nghệ LAN có dây thống trị, sinh ra những năm <strong>1970</strong> tại Xerox PARC do <strong>Robert Metcalfe và David Boggs</strong>, và tới nay vẫn là cái ổ cắm trên tường cạnh bạn. Slide đưa bốn thế hệ và định dạng khung.</p>
<table>
<tr><th>Thế hệ</th><th>Tốc độ</th><th>Chuẩn / năm</th></tr>
<tr><td>Standard Ethernet</td><td>10 Mb/s</td><td>IEEE 802.3, 1983</td></tr>
<tr><td>Fast Ethernet</td><td>100 Mb/s</td><td>802.3u, 1995</td></tr>
<tr><td>Gigabit Ethernet</td><td>1 Gb/s</td><td>802.3ab (cáp đồng), 1999</td></tr>
<tr><td>10 Gigabit Ethernet</td><td>10 Gb/s</td><td>802.3ae, 2002</td></tr>
</table>
<ul>
<li><strong>Đọc định dạng khung trong hình, từng trường một</strong> — <code>Địa chỉ đích 6 byte | Địa chỉ nguồn 6 byte | Type 2 byte | Dữ liệu và đệm 46–1500 byte | CRC 4 byte</code>. Hình cũng ghi rõ: khung ngắn nhất <strong>512 bit = 64 byte</strong>, dài nhất <strong>12.144 bit = 1518 byte</strong>. Tự kiểm tra phép tính: 6+6+2+1500+4 = 1518 ✓, và 6+6+2+46+4 = 64 ✓.</li>
<li><strong>Hai địa chỉ 48 bit trên slide chính là địa chỉ MAC</strong> — mỗi cái 6 byte, đúng như slide 6 đã hứa, viết kiểu <code>3C:22:FB:9A:04:71</code>. Địa chỉ đích đặc biệt <code>FF:FF:FF:FF:FF:FF</code> nghĩa là quảng bá: mọi máy trong LAN đều buộc phải nhận.</li>
<li><strong>Vì sao lại có độ dài TỐI THIỂU</strong> — 64 byte không phải con số tuỳ tiện. Trên sợi cáp dùng chung thời đầu, bên gửi phải CÒN đang phát vào lúc tín hiệu đụng độ kịp quay về tới nó, nếu không nó sẽ chẳng bao giờ biết đã có đụng độ. 64 byte ở tốc độ 10 Mb/s trên 2.500 m cáp đúng bằng cái cửa sổ khứ hồi ấy. Mạng chuyển mạch hiện đại không còn đụng độ, nhưng cái sàn 64 byte vẫn giữ để tương thích — khung ngắn thì được độn thêm.</li>
<li><strong>Trường Type làm gì</strong> — nó nói bên trong là giao thức tầng 3 nào: <code>0x0800</code> = IPv4, <code>0x86DD</code> = IPv6, <code>0x0806</code> = ARP. Nhờ nó mà bước bóc gói ở slide 22 biết phải trao phần tải cho ai.</li>
<li><strong>CRC = Cyclic Redundancy Check</strong> — 4 byte tính trên toàn khung. Bên nhận tính lại; nếu không khớp thì khung bị <strong>vứt im lặng</strong>. Để ý cho kỹ: Ethernet <em>PHÁT HIỆN</em> lỗi chứ không sửa lỗi, và cũng không đòi gửi lại. Việc khôi phục là của TCP, ở trên ba tầng.</li>
</ul>
<p class="pitfall">⚠️ Hai điều về slide này. Tiêu đề gõ nhầm — <em>"Wred LANs"</em> phải là "Wired LANs". Và bảng tốc độ dừng ở 10 Gb/s vì giáo trình xuất bản năm 2017: từ đó tới nay 25G (802.3by, 2016), 40G và 100G (802.3ba, 2010), 400G (802.3bs, 2017) và 800G (802.3df, 2024) đều đã được chuẩn hoá, và các trung tâm dữ liệu chạy 100–400 Gb/s là chuyện thường. Cũng để ý hình vẽ khung mà KHÔNG có 7 byte mở đầu (preamble) và 1 byte đánh dấu bắt đầu khung, hai thứ thật ra đi trước nó trên dây.</p>`],

      [27, 'Wireless Ethernet (Wi-Fi)',
        `<p class="y-chinh">🎯 Wireless Ethernet, i.e. <strong>Wi-Fi</strong>, is a wireless LAN — same layer, same MAC addresses, different medium. The slide defines two service types: the <strong>basic service set (BSS)</strong> and the <strong>extended service set (ESS)</strong>.</p>
<ul>
<li><strong>BSS — the basic building block</strong> — in the figure's left panel, four laptops with antennas inside one rounded rectangle and <em>nothing else</em>. A BSS with no access point is an <em>ad hoc</em> network: the machines talk directly to each other. A BSS with an AP is an <em>infrastructure</em> network, which is what every café and classroom actually uses.</li>
<li><strong>ESS — two or more BSSs joined</strong> — the right panel shows two BSS boxes, each with a red AP, both connected upward to a <strong>Distribution system</strong> and then to a <strong>Server or gateway</strong>. The slide's own wording: the AP "serves as a switch for connection to other LANs or WANs".</li>
<li><strong>Why ESS is what makes a campus work</strong> — walking from one building to another, your phone moves from AP to AP without dropping the connection, because all the APs share one ESS identifier (the network name you see, the SSID) and one distribution system behind them. Roaming is an ESS feature.</li>
<li><strong>The physics that makes Wi-Fi different from Ethernet</strong> — a radio station cannot listen while it transmits, so it cannot detect a collision the way Ethernet does. Wi-Fi therefore <em>avoids</em> collisions instead of detecting them (CSMA/CA): listen, wait a random backoff, then send, and expect an acknowledgement for every frame. That per-frame ACK is why real Wi-Fi throughput is roughly half its advertised rate.</li>
<li><strong>The numbers the 2017 slide does not give</strong> — 802.11b (1999) 11 Mb/s · 802.11g (2003) 54 Mb/s · 802.11n / Wi-Fi 4 (2009) up to 600 Mb/s · 802.11ac / Wi-Fi 5 (2013) ~3,5 Gb/s · 802.11ax / <strong>Wi-Fi 6</strong> (2019) 9,6 Gb/s, plus Wi-Fi 6E which opened the 6 GHz band · 802.11be / <strong>Wi-Fi 7</strong> (2024). Bands: 2,4 GHz travels further through walls; 5 and 6 GHz are faster but shorter-ranged. That trade-off is why your router offers two network names.</li>
</ul>
<p class="pitfall">⚠️ "Wi-Fi is the same as the Internet" is the single most common misunderstanding outside this course, and it is exactly what the layer model refutes: Wi-Fi is one <em>layer-2 link technology</em>, one possible first hop. You can have perfect Wi-Fi and no Internet at all if the router's WAN side is down — and now you can say precisely which layer failed.</p>`,
        `<p class="y-chinh">🎯 Ethernet không dây, tức <strong>Wi-Fi</strong>, là một mạng LAN không dây — cùng tầng, cùng loại địa chỉ MAC, chỉ khác môi trường. Slide định nghĩa hai kiểu dịch vụ: <strong>tập dịch vụ cơ bản (BSS)</strong> và <strong>tập dịch vụ mở rộng (ESS)</strong>.</p>
<ul>
<li><strong>BSS — viên gạch cơ bản</strong> — trong bảng trái của hình là bốn laptop có ăng-ten nằm trong một khung bo tròn và <em>không có gì khác</em>. Một BSS không có điểm truy cập là mạng <em>ad hoc</em>: các máy nói thẳng với nhau. Một BSS có AP là mạng <em>có hạ tầng</em>, và đó mới là thứ mọi quán cà phê và phòng học thật sự dùng.</li>
<li><strong>ESS — hai BSS trở lên nối lại</strong> — bảng phải vẽ hai khung BSS, mỗi khung có một AP màu đỏ, cả hai nối lên một <strong>Distribution system</strong> rồi tới một <strong>Server or gateway</strong>. Đúng lời slide: AP "đóng vai một switch để nối ra các LAN hoặc WAN khác".</li>
<li><strong>Vì sao ESS là thứ làm cho một khuôn viên trường chạy được</strong> — đi từ toà nhà này sang toà nhà khác, điện thoại bạn nhảy từ AP này sang AP kia mà không rớt kết nối, vì mọi AP dùng chung một định danh ESS (chính cái tên mạng bạn nhìn thấy, SSID) và chung một hệ phân phối phía sau. Chuyển vùng (roaming) là một tính năng của ESS.</li>
<li><strong>Vật lý khiến Wi-Fi khác Ethernet</strong> — một trạm vô tuyến không thể vừa phát vừa nghe, nên nó không phát hiện được đụng độ theo kiểu Ethernet. Vì thế Wi-Fi <em>TRÁNH</em> đụng độ thay vì phát hiện (CSMA/CA): nghe ngóng, chờ một khoảng lùi ngẫu nhiên, rồi phát, và chờ báo nhận cho MỌI khung. Cái ACK từng khung ấy là lý do thông lượng Wi-Fi thực tế chỉ chừng một nửa con số quảng cáo.</li>
<li><strong>Những con số mà slide năm 2017 không đưa</strong> — 802.11b (1999) 11 Mb/s · 802.11g (2003) 54 Mb/s · 802.11n / Wi-Fi 4 (2009) tới 600 Mb/s · 802.11ac / Wi-Fi 5 (2013) ~3,5 Gb/s · 802.11ax / <strong>Wi-Fi 6</strong> (2019) 9,6 Gb/s, cùng Wi-Fi 6E mở thêm băng 6 GHz · 802.11be / <strong>Wi-Fi 7</strong> (2024). Băng tần: 2,4 GHz xuyên tường xa hơn; 5 và 6 GHz nhanh hơn nhưng gần hơn. Đánh đổi ấy là lý do router nhà bạn hiện ra hai tên mạng.</li>
</ul>
<p class="pitfall">⚠️ "Wi-Fi tức là Internet" là hiểu nhầm phổ biến nhất bên ngoài môn này, và nó chính là thứ mà mô hình phân tầng bác bỏ: Wi-Fi chỉ là MỘT <em>công nghệ đường truyền tầng 2</em>, một chặng đầu tiên khả dĩ. Bạn có thể có Wi-Fi đầy vạch mà không có Internet nào cả, nếu phía WAN của router chết — và giờ bạn nói được chính xác tầng nào hỏng.</p>`],

      [28, 'Cable Service',
        `<p class="y-chinh">🎯 A link technology that came from somewhere else entirely: <strong>cable networks were originally created to provide access to TV programs</strong>, and were later repurposed to carry data, giving "high-data-rate connections for residential subscribers over the local loop".</p>
<ul>
<li><strong>Read the figure's two zones</strong> — on the left, <em>Customer premises</em> (yellow): a TV receiving Video, a laptop sending Data, both connected to a box labelled <strong>CM</strong> = cable modem. On the right, <em>Central office</em> (grey): a box labelled <strong>CMTS</strong> = cable modem termination system, which splits the stream — Video goes to the TV service, Data goes to a Server and then through a red router to the Internet cloud. Between them: a <em>point-to-point network</em>, i.e. the coaxial cable in your street.</li>
<li><strong>Why an existing TV cable could carry the Internet at all</strong> — coaxial cable has enormous bandwidth (up to ~1 GHz) divided into 6 or 8 MHz TV channels. Take two of those hundreds of channels, put digital data on them instead of a picture, and you have a network. That is the whole trick, and it is why cable Internet was deployed so fast in the 1990s: the wire was already in the ground.</li>
<li><strong>Cable's structural weakness — the shared medium</strong> — unlike a telephone line, the coaxial segment is <em>shared</em> by a whole neighbourhood. When everyone streams at 21:00, you all divide the same channel. This is why cable speeds in an apartment block sag in the evening, and it is exactly the same layer-2 medium-access problem you met in Ethernet and Wi-Fi.</li>
<li><strong>The standard has a name</strong> — <strong>DOCSIS</strong>. DOCSIS 3.0 (2006) reaches about 1 Gb/s down; DOCSIS 3.1 (2013) about 10 Gb/s down and 1–2 Gb/s up. Note the asymmetry: the design assumes you download far more than you upload, a legacy of the one-way TV network it grew out of.</li>
<li><strong>Where this stands in Vietnam</strong> — cable Internet never became the main access technology here as it did in the US. Vietnamese households mostly went straight to fibre (GPON: typically 2,5 Gb/s shared down, 1,25 Gb/s up per fibre, split among 32–64 homes). The slide's structure is still worth knowing: modem at the home, termination system at the provider, shared medium in between — that is exactly how GPON works too.</li>
</ul>
<p class="pitfall">⚠️ The slide's sentence "Cable TV network can also support DSL technology" is misleading. <strong>DSL</strong> (Digital Subscriber Line) runs over the <em>telephone</em> twisted pair, not over coaxial cable; the cable equivalent is DOCSIS. Both do the same trick — squeeze data into unused frequencies on a wire installed for something else — but they are different technologies on different wires.</p>`,
        `<p class="y-chinh">🎯 Một công nghệ đường truyền đến từ chỗ hoàn toàn khác: <strong>mạng cáp vốn được dựng để xem chương trình truyền hình</strong>, sau mới được tận dụng để chở dữ liệu, cho "kết nối tốc độ cao tới thuê bao dân cư trên vòng nội hạt".</p>
<ul>
<li><strong>Đọc hai vùng trong hình</strong> — bên trái, <em>Customer premises</em> (nền vàng): một cái TV nhận Video, một laptop gửi Data, cả hai nối vào hộp ghi <strong>CM</strong> = cable modem. Bên phải, <em>Central office</em> (nền xám): hộp ghi <strong>CMTS</strong> = cable modem termination system, nó tách dòng ra — Video đi về dịch vụ truyền hình, Data đi tới một Server rồi qua router đỏ ra đám mây Internet. Ở giữa là một <em>mạng điểm-điểm</em>, tức sợi cáp đồng trục ngoài đường nhà bạn.</li>
<li><strong>Vì sao một sợi cáp TV có sẵn lại chở nổi Internet</strong> — cáp đồng trục có băng thông khổng lồ (tới ~1 GHz) chia thành các kênh truyền hình 6 hoặc 8 MHz. Lấy hai trong hàng trăm kênh ấy, nhét dữ liệu số vào thay cho hình ảnh, thế là có một mạng. Toàn bộ mẹo chỉ có vậy, và đó là lý do Internet cáp triển khai nhanh khủng khiếp trong thập niên 1990: sợi dây đã nằm sẵn dưới đất.</li>
<li><strong>Điểm yếu cấu trúc của cáp — môi trường DÙNG CHUNG</strong> — khác đường dây điện thoại, đoạn cáp đồng trục bị <em>cả khu phố dùng chung</em>. Tối 21 giờ ai cũng xem phim thì tất cả chia nhau cùng một kênh. Vì thế tốc độ cáp trong một chung cư tụt vào buổi tối, và đó đúng là bài toán truy nhập môi trường ở tầng 2 mà bạn đã gặp ở Ethernet và Wi-Fi.</li>
<li><strong>Chuẩn của nó có tên</strong> — <strong>DOCSIS</strong>. DOCSIS 3.0 (2006) đạt chừng 1 Gb/s chiều xuống; DOCSIS 3.1 (2013) chừng 10 Gb/s xuống và 1–2 Gb/s lên. Để ý sự bất đối xứng: thiết kế giả định bạn tải về nhiều hơn tải lên rất nhiều, một di sản của cái mạng truyền hình một chiều mà nó sinh ra từ đó.</li>
<li><strong>Ở Việt Nam thì sao</strong> — Internet qua cáp truyền hình chưa bao giờ thành công nghệ truy nhập chính ở đây như ở Mỹ. Hộ gia đình Việt Nam phần lớn đi thẳng lên cáp quang (GPON: thường 2,5 Gb/s chiều xuống dùng chung, 1,25 Gb/s chiều lên trên mỗi sợi, chia cho 32–64 hộ). Cấu trúc trên slide vẫn đáng biết: modem ở nhà, hệ thống kết cuối ở nhà mạng, môi trường dùng chung ở giữa — GPON cũng hoạt động đúng như vậy.</li>
</ul>
<p class="pitfall">⚠️ Câu "Mạng truyền hình cáp cũng hỗ trợ được công nghệ DSL" trên slide là gây hiểu nhầm. <strong>DSL</strong> (Digital Subscriber Line) chạy trên đôi dây xoắn <em>điện thoại</em>, không chạy trên cáp đồng trục; thứ tương đương bên cáp là DOCSIS. Cả hai làm cùng một mẹo — nhét dữ liệu vào các dải tần bỏ trống của một sợi dây vốn lắp cho việc khác — nhưng chúng là hai công nghệ khác nhau trên hai sợi dây khác nhau.</p>`],

      [29, 'Wireless WAN: WiMAX',
        `<p class="y-chinh">🎯 The last access technology on the slide deck: <strong>WiMAX — Worldwide Interoperability for Microwave Access</strong>, described as "the wireless version of DSL or Cable connection to the Internet". Wireless, but a WAN, not a LAN: it covers a town, not a room.</p>
<ul>
<li><strong>Read the figure's vocabulary</strong> — a large <strong>BS (Base station)</strong> tower on the right, connected to an <strong>ISP</strong> server and then a red router into the Internet cloud. Red zig-zag radio links reach out to two <strong>FSub (Fixed subscriber station)</strong> antennas on buildings and one <strong>MSub</strong> — a mobile subscriber, drawn as a cellular phone. The red caption at the bottom generalises: "Wireless WAN: Cellular / Satellite Networks".</li>
<li><strong>The two services the slide means</strong> — <em>fixed WiMAX</em> (IEEE 802.16d, 2004) connects the base station to an antenna bolted to a building, replacing a cable into the home; <em>mobile WiMAX</em> (802.16e, 2005) connects to devices that move. The slide names only the first, which makes its sentence incomplete — see the trap.</li>
<li><strong>Why anyone wanted it</strong> — laying cable to every house is slow and expensive, especially where houses are far apart. A radio link from a tower covers everyone within several kilometres immediately. That is why "wireless last mile" keeps being reinvented — WiMAX in the 2000s, fixed 5G in the 2020s, and low-orbit satellite (Starlink) today.</li>
<li><strong>Where it sits in the layer model</strong> — exactly where Ethernet, Wi-Fi and cable sit: it is a layer-2 link technology, one possible first hop for your IP datagrams. Nothing above layer 2 changes when you switch from Wi-Fi to WiMAX to 5G. That interchangeability is the whole payoff of slide 24's "TCP/IP defines no data-link protocol".</li>
<li><strong>How big a "wireless WAN" cell is</strong> — a 4G/5G macro cell covers roughly 1–10 km in open country and a few hundred metres in a dense city; a Wi-Fi AP covers 20–50 m indoors. That three-orders-of-magnitude difference is precisely the LAN/WAN distinction of slide 7, applied to radio.</li>
</ul>
<p class="pitfall">⚠️ Three problems here. (1) The sentence "It provide two types of services (fixed WiMax)" promises two and names one — the missing one is mobile WiMAX. (2) This figure is captioned <strong>Figure 4.17</strong>, exactly like slide 28's figure; there is no Figure 4.18 anywhere in the deck. (3) Most importantly, WiMAX is <strong>commercially dead</strong>: it lost the 4G standards war to LTE around 2010–2012, and Sprint, its biggest operator, shut its network down in 2016. Learn it as the exam expects, but know that the real "wireless WAN" today is 4G/5G and satellite — exactly what the red caption in the figure already hints at.</p>`,
        `<p class="y-chinh">🎯 Công nghệ truy nhập cuối cùng trong bộ slide: <strong>WiMAX — Worldwide Interoperability for Microwave Access</strong>, được mô tả là "phiên bản không dây của kết nối DSL hoặc cáp vào Internet". Không dây, nhưng là WAN chứ không phải LAN: nó phủ một thị trấn, không phải một căn phòng.</p>
<ul>
<li><strong>Đọc từ vựng trong hình</strong> — một cột <strong>BS (Base station — trạm gốc)</strong> lớn bên phải, nối tới máy chủ <strong>ISP</strong> rồi qua router đỏ ra đám mây Internet. Các tia vô tuyến đỏ hình răng cưa với tới hai ăng-ten <strong>FSub (Fixed subscriber station — trạm thuê bao cố định)</strong> gắn trên nóc nhà và một <strong>MSub</strong> — thuê bao di động, vẽ thành cái điện thoại. Dòng chữ đỏ dưới cùng khái quát: "Wireless WAN: Cellular / Satellite Networks".</li>
<li><strong>Hai dịch vụ mà slide muốn nói</strong> — <em>WiMAX cố định</em> (IEEE 802.16d, 2004) nối trạm gốc tới một ăng-ten bắt vít trên toà nhà, thay cho việc kéo cáp vào nhà; <em>WiMAX di động</em> (802.16e, 2005) nối tới các thiết bị đang di chuyển. Slide chỉ gọi tên cái đầu, nên câu của nó bị cụt — xem phần bẫy.</li>
<li><strong>Vì sao người ta từng muốn nó</strong> — kéo cáp tới từng nhà thì chậm và tốn, nhất là nơi nhà cửa thưa thớt. Một tia vô tuyến từ cột phủ ngay lập tức tất cả những ai nằm trong bán kính vài cây số. Vì thế "chặng cuối không dây" cứ được phát minh lại mãi — WiMAX thập niên 2000, 5G cố định thập niên 2020, và vệ tinh quỹ đạo thấp (Starlink) hôm nay.</li>
<li><strong>Nó nằm ở đâu trong mô hình phân tầng</strong> — đúng chỗ mà Ethernet, Wi-Fi và cáp truyền hình nằm: nó là một công nghệ đường truyền tầng 2, một chặng đầu tiên khả dĩ cho các datagram IP của bạn. Không có gì trên tầng 2 phải đổi khi bạn nhảy từ Wi-Fi sang WiMAX sang 5G. Tính thay thế lẫn nhau ấy chính là phần thưởng của câu "TCP/IP không định nghĩa giao thức tầng liên kết dữ liệu" ở slide 24.</li>
<li><strong>Một ô "WAN không dây" rộng bao nhiêu</strong> — một ô lớn 4G/5G phủ chừng 1–10 km ở vùng trống và vài trăm mét trong phố đông; một AP Wi-Fi phủ 20–50 m trong nhà. Chênh nhau ba bậc độ lớn ấy chính là phép phân biệt LAN/WAN ở slide 7, đem áp vào sóng vô tuyến.</li>
</ul>
<p class="pitfall">⚠️ Ba vấn đề ở đây. (1) Câu "It provide two types of services (fixed WiMax)" hứa hai mà chỉ kể một — cái thiếu là WiMAX di động. (2) Hình này được chú thích là <strong>Figure 4.17</strong>, trùng y hệt hình ở slide 28; và trong cả bộ slide không có hình nào mang số 4.18. (3) Quan trọng nhất: WiMAX trên thực tế đã <strong>CHẾT về mặt thương mại</strong> — nó thua LTE trong cuộc đua chuẩn 4G khoảng 2010–2012, và Sprint, nhà mạng lớn nhất từng chạy nó, đã tắt mạng năm 2016. Cứ học theo đúng thứ đề thi chờ, nhưng hãy biết rằng "WAN không dây" thật của hôm nay là 4G/5G và vệ tinh — đúng như dòng chữ đỏ trong hình đã gợi ý sẵn.</p>`],

      [30, '2.5 PHYSICAL LAYER',
        `<p class="y-chinh">🎯 The bottom of the stack, and the only layer that is not software: its role is "to transfer the <strong>bits</strong> received from the data-link layer and <strong>convert them to electromagnetic signals</strong> for transmission", then deliver those signals to the transmission media.</p>
<ul>
<li><strong>Its data unit is the bit, and it has no address</strong> — this is the missing row from slide 11's table, and it is the reason we only need four addresses. A bit is not addressed to anyone; it is simply pushed onto a wire that leads exactly one place.</li>
<li><strong>Read Figure 4.19 carefully — it is the payoff of the whole of Part 2</strong> — Alice on the left shows five boxes, and only <em>Physical</em> is written in red. Bob on the right, likewise. And the routers R2, R4, R5, R7 each show only <strong>three</strong> boxes (Network, Data-link, Physical), again with Physical in red. The red line now hops from one Physical box to the next, all the way across. Compare it with Figure 4.7 on slide 13, where one straight line jumped from Alice to Bob, and you have seen the entire argument of Part 2 in two pictures.</li>
<li><strong>The note inside the figure is worth reading</strong> — "For simplicity, we assume there is only one available path from the source to the destination". In reality there are many, chosen hop by hop by routing protocols, and two packets of the same conversation can take different paths — which is exactly why TCP must be able to reorder.</li>
<li><strong>What "electromagnetic signal" actually means in practice</strong> — voltage on copper (Ethernet), pulses of light on glass (fibre, typically at 1310 nm or 1550 nm wavelength), or radio waves in air (Wi-Fi at 2,4/5/6 GHz, 4G/5G, satellite). Three media, one job: make a 1 distinguishable from a 0 at the far end.</li>
<li><strong>The hard limit that nothing above can beat</strong> — Shannon's theorem sets a maximum data rate for any channel from its bandwidth and its signal-to-noise ratio. Everything from slide 1 to slide 29 runs inside that ceiling. When your Wi-Fi is slow because you are far from the router, this is the layer that is failing — not the website.</li>
</ul>
<p class="meo">💡 The physical layer is where the abstraction finally touches the world. Every layer above manipulates <em>meaning</em>; this one manipulates <em>energy</em>. That is why it is the only layer you can break with a pair of scissors.</p>`,
        `<p class="y-chinh">🎯 Đáy của chồng tầng, và là tầng duy nhất không phải phần mềm: vai trò của nó là "chuyển các <strong>bit</strong> nhận từ tầng liên kết dữ liệu và <strong>biến chúng thành tín hiệu điện từ</strong> để truyền đi", rồi đưa tín hiệu ấy ra môi trường truyền dẫn.</p>
<ul>
<li><strong>Đơn vị dữ liệu của nó là bit, và nó KHÔNG có địa chỉ</strong> — đây chính là cái ô trống trong bảng ở slide 11, và là lý do ta chỉ cần bốn loại địa chỉ. Một bit không được gửi cho ai cả; nó chỉ đơn giản bị đẩy lên một sợi dây dẫn tới đúng một nơi.</li>
<li><strong>Nhìn kỹ Hình 4.19 — nó là phần thưởng của cả Phần 2</strong> — Alice bên trái hiện năm hộp, và chỉ mỗi chữ <em>Physical</em> in màu đỏ. Bob bên phải cũng vậy. Còn các router R2, R4, R5, R7 mỗi cái chỉ hiện <strong>ba</strong> hộp (Network, Data-link, Physical), cũng với Physical màu đỏ. Đường đỏ bây giờ nhảy từ hộp Physical này sang hộp Physical kế tiếp, suốt cả chặng đường. Đặt nó cạnh Hình 4.7 ở slide 13, nơi một đường thẳng duy nhất nhảy thẳng từ Alice tới Bob, là bạn đã thấy trọn lập luận của Phần 2 chỉ trong hai bức hình.</li>
<li><strong>Dòng ghi chú bên trong hình đáng đọc</strong> — "Để cho đơn giản, ta giả định chỉ có một đường đi khả dụng từ nguồn tới đích". Thực tế có rất nhiều đường, được chọn theo từng chặng bởi các giao thức định tuyến, và hai gói của cùng một cuộc trò chuyện có thể đi hai đường khác nhau — đó đúng là lý do TCP phải biết sắp xếp lại thứ tự.</li>
<li><strong>"Tín hiệu điện từ" trên thực tế nghĩa là gì</strong> — hiệu điện thế trên dây đồng (Ethernet), xung ánh sáng trong sợi thuỷ tinh (cáp quang, thường ở bước sóng 1310 nm hoặc 1550 nm), hoặc sóng vô tuyến trong không khí (Wi-Fi ở 2,4/5/6 GHz, 4G/5G, vệ tinh). Ba môi trường, một công việc: làm cho bit 1 phân biệt được với bit 0 ở đầu bên kia.</li>
<li><strong>Cái trần cứng mà không tầng nào phía trên vượt nổi</strong> — định lý Shannon đặt ra tốc độ dữ liệu tối đa cho mọi kênh truyền, tính từ băng thông và tỉ số tín hiệu trên nhiễu. Mọi thứ từ slide 1 tới slide 29 đều chạy bên dưới cái trần ấy. Khi Wi-Fi của bạn chậm vì bạn ngồi xa router, thì đây mới là tầng đang hỏng — chứ không phải cái trang web.</li>
</ul>
<p class="meo">💡 Tầng vật lý là chỗ mà sự trừu tượng cuối cùng chạm vào thế giới thật. Mọi tầng phía trên thao tác trên <em>ý nghĩa</em>; riêng tầng này thao tác trên <em>năng lượng</em>. Vì thế nó là tầng duy nhất bạn phá được bằng một cái kéo.</p>`],

      [31, 'Analog and Digital Transmission',
        `<p class="y-chinh">🎯 The four conversions the physical layer may have to perform, arranged in two columns. <strong>Analog transmission</strong> covers digital-to-analog and analog-to-analog; <strong>digital transmission</strong> covers digital-to-digital and analog-to-digital.</p>
<table>
<tr><th>Conversion</th><th>Column</th><th>What goes in → out</th><th>Real example</th></tr>
<tr><td>Digital-to-analog</td><td>Analog transmission</td><td>bits <code>0101…101</code> → an analog wave</td><td>a modem, Wi-Fi, 4G: data on a radio carrier</td></tr>
<tr><td>Analog-to-analog</td><td>Analog transmission</td><td>an analog signal → an analog signal at another frequency</td><td>AM/FM radio broadcasting</td></tr>
<tr><td>Digital-to-digital</td><td>Digital transmission</td><td>bits → a square digital signal</td><td>Ethernet on copper, USB</td></tr>
<tr><td>Analog-to-digital</td><td>Digital transmission</td><td>an analog wave → <em>Sampling</em> → bits</td><td>your microphone, a scanner, a camera sensor</td></tr>
</table>
<ul>
<li><strong>Read the four small diagrams</strong> — each has the same shape: a Sender box on the left, a Link in the middle, a Receiver box on the right, with the signal drawn above the link. The digital signals are square pulses; the analog signals are smooth curves. In the analog-to-digital diagram, look for the two extra black boxes: <strong>"Sampling"</strong> on the sender side and <strong>"Connecting and filtering"</strong> on the receiver side — those are the steps that lose and then rebuild the waveform.</li>
<li><strong>Why "modem" is the word for the first row</strong> — <em>mo</em>dulator + <em>dem</em>odulator. Slide 5 already called a modem "a device that changes the form of data"; now you know precisely which form into which form. That is also why slide 28's cable modem exists.</li>
<li><strong>Why analog-to-digital is the one that connects to Chapter 3</strong> — sampling is exactly the process CSI106 taught you for storing audio: measure the wave at a fixed rate, quantise each measurement into an integer. CD audio takes 44.100 samples per second at 16 bits per sample, per channel — which is why one minute of stereo CD audio is 44.100 × 16 × 2 × 60 / 8 ≈ 10,6 MB.</li>
<li><strong>Why digital beat analog everywhere</strong> — a digital signal can be <em>regenerated</em>: a repeater reads "is this above or below the threshold?", decides 1 or 0, and emits a perfectly clean new pulse. Noise does not accumulate. An analog signal can only be <em>amplified</em>, and amplifying it amplifies its noise too. That single asymmetry is why photocopying a photocopy degrades and copying a file does not.</li>
<li><strong>Where each one still lives</strong> — the last analog stretch in most people's lives disappeared with analog TV (Vietnam completed its digital switchover in 2020) and with the old copper telephone. Wi-Fi and 5G are still digital-to-analog at the bottom, because radio is inherently a wave.</li>
</ul>
<p class="pitfall">⚠️ This figure is captioned <strong>Figure 4.19</strong>, the same number as slide 30's figure — the second duplicated figure number in the deck. If an exam question cites "Figure 4.19", check which topic it means: communication at the physical layer, or the four conversions.</p>`,
        `<p class="y-chinh">🎯 Bốn phép biến đổi mà tầng vật lý có thể phải làm, xếp thành hai cột. <strong>Truyền tương tự</strong> gồm số-sang-tương-tự và tương-tự-sang-tương-tự; <strong>truyền số</strong> gồm số-sang-số và tương-tự-sang-số.</p>
<table>
<tr><th>Phép biến đổi</th><th>Cột</th><th>Vào → ra</th><th>Ví dụ thật</th></tr>
<tr><td>Số → tương tự</td><td>Truyền tương tự</td><td>bit <code>0101…101</code> → một sóng tương tự</td><td>modem, Wi-Fi, 4G: dữ liệu cưỡi trên sóng mang</td></tr>
<tr><td>Tương tự → tương tự</td><td>Truyền tương tự</td><td>tín hiệu tương tự → tín hiệu tương tự ở tần số khác</td><td>phát thanh AM/FM</td></tr>
<tr><td>Số → số</td><td>Truyền số</td><td>bit → tín hiệu số dạng xung vuông</td><td>Ethernet trên cáp đồng, USB</td></tr>
<tr><td>Tương tự → số</td><td>Truyền số</td><td>sóng tương tự → <em>Lấy mẫu</em> → bit</td><td>micro của bạn, máy quét, cảm biến máy ảnh</td></tr>
</table>
<ul>
<li><strong>Đọc bốn sơ đồ nhỏ</strong> — cái nào cũng cùng một dáng: hộp Sender bên trái, một Link ở giữa, hộp Receiver bên phải, tín hiệu vẽ phía trên đường link. Tín hiệu số là các xung vuông; tín hiệu tương tự là đường cong mượt. Trong sơ đồ tương-tự-sang-số, hãy tìm hai hộp đen phụ: <strong>"Sampling"</strong> (lấy mẫu) bên gửi và <strong>"Connecting and filtering"</strong> (nối lại và lọc) bên nhận — đó là hai bước làm mất rồi dựng lại dạng sóng.</li>
<li><strong>Vì sao "modem" là cái tên của dòng đầu tiên</strong> — <em>mo</em>dulator + <em>dem</em>odulator (điều chế + giải điều chế). Slide 5 đã gọi modem là "thiết bị đổi dạng dữ liệu"; giờ bạn biết chính xác đổi từ dạng nào sang dạng nào. Đó cũng là lý do tồn tại của cái cable modem ở slide 28.</li>
<li><strong>Vì sao tương-tự-sang-số là chỗ nối về Chương 3</strong> — lấy mẫu chính là quy trình mà CSI106 đã dạy bạn để lưu âm thanh: đo sóng theo một nhịp cố định, rồi lượng tử hoá mỗi phép đo thành một số nguyên. Âm thanh CD lấy 44.100 mẫu mỗi giây, 16 bit mỗi mẫu, mỗi kênh — nên một phút nhạc CD hai kênh nặng 44.100 × 16 × 2 × 60 / 8 ≈ 10,6 MB.</li>
<li><strong>Vì sao tín hiệu số thắng ở mọi nơi</strong> — tín hiệu số <em>TÁI SINH</em> được: một bộ lặp chỉ cần hỏi "cái này cao hay thấp hơn ngưỡng?", kết luận 1 hay 0, rồi phát ra một xung mới sạch tinh. Nhiễu không tích luỹ. Tín hiệu tương tự thì chỉ <em>khuếch đại</em> được, mà khuếch đại nó thì khuếch đại luôn cả nhiễu của nó. Đúng một sự bất đối xứng ấy là lý do photo lại bản photo thì mờ dần, còn chép lại một file thì không.</li>
<li><strong>Mỗi thứ nay còn sống ở đâu</strong> — đoạn tương tự cuối cùng trong đời sống phần lớn mọi người biến mất cùng truyền hình analog (Việt Nam hoàn tất số hoá truyền hình năm 2020) và cùng đường dây điện thoại đồng cũ. Wi-Fi và 5G ở tầng đáy vẫn là số-sang-tương-tự, vì sóng vô tuyến bản chất là sóng.</li>
</ul>
<p class="pitfall">⚠️ Hình này được chú thích là <strong>Figure 4.19</strong>, trùng số với hình ở slide 30 — lần trùng số hình thứ hai trong bộ slide. Nếu đề trích "Figure 4.19", hãy xem nó đang nói chủ đề nào: liên lạc ở tầng vật lý, hay bốn phép biến đổi.</p>`],

      [32, 'Summary of TCP/IP Protocol Layers',
        `<p class="y-chinh">🎯 The closing figure, and the one page to revise from. It puts everything side by side: for each of the five layers — the <strong>data unit</strong> on the left, the <strong>protocols</strong> in the middle, and the <strong>address</strong> on the right.</p>
<table>
<tr><th>Layer</th><th>Data unit</th><th>Protocols in the figure</th><th>Address</th><th>Device</th><th>Scope of one delivery</th></tr>
<tr><td>5 Application</td><td>Messages</td><td>Processes (HTTP, FTP, SSH, SMTP, DNS)</td><td>Application-layer addresses (names)</td><td>the program</td><td>process to process by name</td></tr>
<tr><td>4 Transport</td><td>Segments, user datagrams, or packets</td><td><strong>SCTP · TCP · UDP</strong></td><td>Port numbers</td><td>firewall</td><td>process to process</td></tr>
<tr><td>3 Network</td><td>Datagrams</td><td>IP and other protocols (ICMP, ARP)</td><td>IP addresses</td><td>router</td><td>host to host</td></tr>
<tr><td>2 Data link</td><td>Frames</td><td>LAN, WAN, and MAN protocols (Ethernet, Wi-Fi, DOCSIS)</td><td>Link addresses (MAC)</td><td>switch</td><td>node to node</td></tr>
<tr><td>1 Physical</td><td>Bits</td><td>Converting bits to signals</td><td><strong>none</strong></td><td>hub, cable</td><td>one bit across one wire</td></tr>
</table>
<ul>
<li><strong>Notice the third transport protocol</strong> — the figure shows <strong>SCTP</strong> next to TCP and UDP. Stream Control Transmission Protocol (RFC 4960, 2000) is reliable like TCP but message-oriented and multi-streamed, so one lost message does not stall the others. It is not used on the web, but it carries signalling traffic inside 4G and 5G core networks.</li>
<li><strong>Notice what has no address</strong> — the Physical layer row on the far right is empty. That blank square is the visual proof of slide 11's sentence "we normally have only four".</li>
<li><strong>Notice the layer-2 row says "LAN, WAN, and MANs protocols"</strong> — it is the only place in the deck where MAN appears, and it confirms slide 24: TCP/IP does not name a layer-2 protocol, it just points at whatever technologies exist.</li>
<li><strong>The five-minute revision drill</strong> — cover the figure and write the five rows from memory, in this order: layer name → data unit → address → device. If you can also say the hyphenated scope for layers 2, 3 and 4 (node-to-node, host-to-host, process-to-process), you have covered the bulk of what this chapter can ask.</li>
<li><strong>And the one story that ties it together</strong> — go back to the ten numbered steps in the answer on slide 22 and read them again with this table open. Each step is one row of this figure, once on the way down and once on the way up. That is the chapter.</li>
</ul>
<p class="dap-an">✅ Final self-check, six questions with their answers. <em>Which layer has no address?</em> → physical. <em>Which addresses change at every hop?</em> → MAC (link) addresses; IP addresses never change. <em>How many bits in an IPv4 address, an IPv6 address, a MAC address, a port number?</em> → 32, 128, 48, 16. <em>Which device reads which address?</em> → switch reads MAC, router reads IP, firewall reads ports. <em>Which transport protocol for a video call, and why?</em> → UDP, because a late frame is worse than a missing one. <em>What are the five data units, top to bottom?</em> → message, segment/user datagram, datagram, frame, bit.</p>`,
        `<p class="y-chinh">🎯 Hình khép lại chương, và cũng là trang duy nhất cần để ôn. Nó bày mọi thứ cạnh nhau: với mỗi tầng trong năm tầng — <strong>đơn vị dữ liệu</strong> bên trái, <strong>các giao thức</strong> ở giữa, và <strong>địa chỉ</strong> bên phải.</p>
<table>
<tr><th>Tầng</th><th>Đơn vị dữ liệu</th><th>Giao thức trong hình</th><th>Địa chỉ</th><th>Thiết bị</th><th>Phạm vi một lần giao</th></tr>
<tr><td>5 Ứng dụng</td><td>Messages</td><td>Các tiến trình (HTTP, FTP, SSH, SMTP, DNS)</td><td>Địa chỉ tầng ứng dụng (tên)</td><td>chính chương trình</td><td>tiến trình tới tiến trình, theo tên</td></tr>
<tr><td>4 Giao vận</td><td>Segments, user datagrams, hoặc packets</td><td><strong>SCTP · TCP · UDP</strong></td><td>Số hiệu cổng</td><td>tường lửa</td><td>tiến trình tới tiến trình</td></tr>
<tr><td>3 Mạng</td><td>Datagrams</td><td>IP và các giao thức khác (ICMP, ARP)</td><td>Địa chỉ IP</td><td>router</td><td>máy tới máy</td></tr>
<tr><td>2 Liên kết dữ liệu</td><td>Frames</td><td>Giao thức LAN, WAN và MAN (Ethernet, Wi-Fi, DOCSIS)</td><td>Địa chỉ liên kết (MAC)</td><td>switch</td><td>nút tới nút</td></tr>
<tr><td>1 Vật lý</td><td>Bits</td><td>Biến bit thành tín hiệu</td><td><strong>không có</strong></td><td>hub, dây cáp</td><td>một bit qua một sợi dây</td></tr>
</table>
<ul>
<li><strong>Để ý giao thức giao vận thứ ba</strong> — hình vẽ <strong>SCTP</strong> nằm cạnh TCP và UDP. Stream Control Transmission Protocol (RFC 4960, năm 2000) tin cậy như TCP nhưng hướng thông điệp và đa luồng, nên một thông điệp mất không làm nghẽn các thông điệp khác. Nó không dùng trên web, nhưng nó chở lưu lượng báo hiệu trong lõi mạng 4G và 5G.</li>
<li><strong>Để ý chỗ KHÔNG có địa chỉ</strong> — ô ngoài cùng bên phải của hàng tầng Vật lý bỏ trống. Chính cái ô trống ấy là bằng chứng bằng hình cho câu ở slide 11: "ta thường chỉ có bốn".</li>
<li><strong>Để ý hàng tầng 2 ghi "LAN, WAN, and MANs protocols"</strong> — đây là chỗ duy nhất trong cả bộ slide chữ MAN xuất hiện, và nó xác nhận slide 24: TCP/IP không gọi tên giao thức tầng 2 nào cả, nó chỉ trỏ tay vào những công nghệ đang tồn tại.</li>
<li><strong>Bài tập ôn năm phút</strong> — che hình đi rồi viết lại năm hàng từ trí nhớ, theo thứ tự này: tên tầng → đơn vị dữ liệu → địa chỉ → thiết bị. Nếu nói thêm được cụm phạm vi có gạch nối cho tầng 2, 3 và 4 (nút-tới-nút, máy-tới-máy, tiến-trình-tới-tiến-trình) thì bạn đã phủ gần hết những gì chương này hỏi được.</li>
<li><strong>Và một câu chuyện buộc tất cả lại</strong> — quay về mười bước đánh số trong phần Đáp án ở slide 22 và đọc lại chúng với cái bảng này đang mở. Mỗi bước là một hàng của bức hình này, một lần lúc đi xuống và một lần lúc đi lên. Đó chính là cả chương.</li>
</ul>
<p class="dap-an">✅ Tự kiểm lần cuối, sáu câu kèm đáp án. <em>Tầng nào không có địa chỉ?</em> → tầng vật lý. <em>Địa chỉ nào đổi ở mỗi chặng?</em> → địa chỉ MAC (tầng liên kết); địa chỉ IP thì không bao giờ đổi. <em>Địa chỉ IPv4, IPv6, MAC và số hiệu cổng dài bao nhiêu bit?</em> → 32, 128, 48, 16. <em>Thiết bị nào đọc địa chỉ nào?</em> → switch đọc MAC, router đọc IP, tường lửa đọc cổng. <em>Cuộc gọi video dùng giao thức giao vận nào, vì sao?</em> → UDP, vì một khung tới trễ còn tệ hơn một khung bị mất. <em>Năm đơn vị dữ liệu từ trên xuống là gì?</em> → message, segment/user datagram, datagram, frame, bit.</p>`],

    ]),
  ].join('\n'),
};
