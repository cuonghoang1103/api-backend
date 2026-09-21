/**
 * NWC204 · Chapter 10 — IPv4 Addressing (Cisco Module 11).
 * FLM buổi 30–31 (lý thuyết) + buổi 32–33 (Lab 2.2) + buổi 34 (Midterm Progress Test).
 *
 * Slide: scripts/slides-src/nwc204-ch10.mjs → deck 'nwc204-ch10', 36 ảnh.
 *
 * ⚠️ Chương NẶNG NHẤT của môn, và là chỗ chương bù ch04b (hệ đếm) được dùng đến:
 *    trường KHÔNG xếp buổi nào cho Cisco Module 5, mà buổi 30–33 chia subnet thì
 *    không làm được nếu không đọc được nhị phân và phép AND theo bit.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 11: đọc mạng của chính máy chủ thật
 *     bằng ip -br addr / ip route, hai mạng Docker đã biến VPS thành router, CIDR
 *     trong luật tường lửa và nginx, dải CGNAT 100.64/10, /31 và /32, và ba kiểu
 *     đụng dải địa chỉ trông y như lỗi phần mềm.
 *
 * ⚠️ MỌI con số subnet trong file này đã kiểm lại bằng python3 ipaddress
 *    (hợp đồng môn, mục 9). Không con số nào viết bằng trí nhớ.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 30 KHÔNG có câu hỏi kiến tạo nào (ô bỏ trống).
 *   - Buổi 31 mang CQ11.1 mà nội dung là "Progress Test 2" — không phải câu hỏi,
 *     và môn chỉ có MỘT Midterm Progress Test, ở buổi 34.
 *   - Buổi 32 mang CQ11.2 (unicast/broadcast/multicast) = mục 10.2, tức buổi 30.
 *   - Buổi 33 mang CQ11.3 (mấy loại địa chỉ IPv4) = mục 10.3, tức buổi 30.
 *   - Buổi 34 mang CQ12.1 (cấu trúc một địa chỉ IPv4) = mục 10.1, tức buổi 30.
 *     Tức là CẢ BỐN câu đều lệch, và ba câu cuối đều hỏi nội dung của buổi 30.
 *   - Buổi 34 ghi "CLO1 - CLO9"; buổi 60 ghi "CLO1-CLO11" dù môn chỉ có 10 CLO.
 *
 * ⚠️ File này CHỈ chứa chương 10. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch10', {
  code: 'NWC204',
  en: 'IPv4 Addressing',
  vi: 'Địa chỉ IPv4',
  total: 36,
});

/* ──────────────────────── Lesson 10.1 — session 30 ─────────────────────── */

const L1 = {
  title: '10.1 — IPv4 address structure, types and segmentation (FLM session 30)|||10.1 — Cấu trúc, các loại địa chỉ IPv4 và phân đoạn mạng (buổi 30 của FLM)',
  slug: 'nwc204-10-1-cau-truc-dia-chi-ipv4',
  type: 'DOCUMENT',
  description: 'Buổi 30: 32 bit và bốn octet, mặt nạ mạng quyết định ranh giới network/host, phép AND theo bit là thứ router thật sự làm, ba điểm cố định của mọi subnet và nguồn gốc của phép trừ 2, cách đọc một subnet trong bốn dòng bằng kích thước khối, unicast so với broadcast so với multicast, hai loại broadcast và vì sao router chặn chúng, dải riêng RFC 1918 cùng các dải dành riêng hay gặp thật (loopback, link-local 169.254, CGNAT 100.64, TEST-NET), lớp A/B/C đã chết nhưng bóng ma còn lại, và bốn lý do phải chia mạng. Kèm phần ★ đọc mạng của chính máy chủ của bạn.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 10 · Lesson 10.1 · FLM session 30 of 60 · CLO5, CLO9 · Cisco Module 11</span>
<h2>The address that decides who is a neighbour</h2>
<p class="lead">After this lesson you can take any IPv4 address and mask, say which network it belongs to, name its first host, last host and broadcast address, and recognise on sight whether an address is private, public, loopback, link-local or multicast — without a calculator and without a lookup table.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 30 — "10. IPv4 Addressing · 10.1 IPv4 Address Structure · 10.2 IPv4 Unicast, Broadcast, and Multicast · 10.3 Types of IPv4 Addresses · 10.4 Network Segmentation"</p>
<p><strong>Opening question.</strong> Two machines sit on the same switch, plugged into adjacent ports. One is 192.168.1.10 with mask 255.255.255.0. The other is 192.168.1.200 with mask 255.255.255.192. The cable is fine, both links are up, and neither machine can ping the other. Nothing is misconfigured in any way a log file would notice. What is wrong, and which of the two machines is at fault?</p>
<p>You will be able to answer that in about four minutes. The answer is the whole content of this lesson, and the reason it is worth four minutes is that this failure happens constantly in real networks and produces no error message anywhere.</p>
<div class="callout warn"><strong>Prerequisite.</strong> This chapter needs binary, hexadecimal and the bitwise AND operation. FPT schedules no session for Cisco Module 5, so this site added <strong>Chapter 4B — Number Systems</strong> to fill the gap. If reading 11000000 as 192 is not automatic yet, go back to 4B first. Everything here is bit arithmetic wearing decimal clothes.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 11. The school's syllabus is covered in full first.</p>`,
      `<span class="eyebrow">NWC204 · Chương 10 · Bài 10.1 · Buổi 30/60 của FLM · CLO5, CLO9 · Cisco Module 11</span>
<h2>Cái địa chỉ quyết định ai là hàng xóm</h2>
<p class="lead">Học xong bài này bạn cầm bất kỳ địa chỉ IPv4 nào kèm mặt nạ và nói ngay được nó thuộc mạng nào, host đầu tiên là gì, host cuối là gì, địa chỉ broadcast là gì, và nhìn một cái là biết địa chỉ đó là riêng, công cộng, loopback, link-local hay multicast — không cần máy tính, không cần tra bảng.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 30 — "10. IPv4 Addressing · 10.1 IPv4 Address Structure · 10.2 IPv4 Unicast, Broadcast, and Multicast · 10.3 Types of IPv4 Addresses · 10.4 Network Segmentation"</p>
<p><strong>Câu hỏi mở đầu.</strong> Hai máy cắm vào cùng một con switch, hai cổng cạnh nhau. Máy thứ nhất là 192.168.1.10 mặt nạ 255.255.255.0. Máy thứ hai là 192.168.1.200 mặt nạ 255.255.255.192. Dây tốt, hai cổng đều lên, và không máy nào ping được máy kia. Không có gì sai theo kiểu mà một file log sẽ để ý. Hỏng ở đâu, và trong hai máy thì máy nào sai?</p>
<p>Khoảng bốn phút nữa bạn sẽ trả lời được. Đáp án chính là toàn bộ nội dung bài này, và lý do nó đáng bốn phút là vì cái hỏng đó xảy ra liên tục trong mạng thật mà không sinh ra một dòng báo lỗi nào ở đâu cả.</p>
<div class="callout warn"><strong>Điều kiện cần trước.</strong> Chương này cần hệ nhị phân, thập lục phân và phép AND theo bit. Trường KHÔNG xếp buổi nào cho Cisco Module 5, nên trang này thêm <strong>Chương 4B — Hệ đếm</strong> để bù vào. Nếu đọc 11000000 ra 192 chưa thành phản xạ thì quay lại 4B trước đã. Mọi thứ ở đây là số học trên bit khoác áo thập phân.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 11. Giáo trình của trường được phủ đủ trước.</p>`,
    ),

    walkHead('nwc204-ch10', 1, 15,
      'Slides 1–15 cover FLM session 30: 10.1 Address Structure, 10.2 Unicast/Broadcast/Multicast, 10.3 Types of IPv4 Addresses, 10.4 Network Segmentation.',
      'Slide 1–15 là buổi 30 của FLM: 10.1 Cấu trúc địa chỉ, 10.2 Unicast/Broadcast/Multicast, 10.3 Các loại địa chỉ IPv4, 10.4 Phân đoạn mạng.'),

    walk('nwc204-ch10', [
      [1, 'Cover — Chapter 10, IPv4 Addressing',
        `<p>Chapter 10 is <strong>Cisco Module 11</strong>, and FPT gives it five sessions — the largest block the course spends on any single module.</p>
<ul>
<li>Session 30 — 10.1 Address Structure, 10.2 Unicast/Broadcast/Multicast, 10.3 Types, 10.4 Segmentation.</li>
<li>Session 31 — 10.5 to 10.7 subnetting, <strong>10.8 VLSM</strong>, 10.9 Structured Design, 10.10 AI tools.</li>
<li>Sessions 32–33 — Lab 2.2: calculate subnets and implement a VLSM scheme.</li>
<li>Session 34 — <strong>Midterm Progress Test</strong>, listed as CLO1 to CLO9.</li>
<li>Outcomes: <strong>CLO5</strong> "design and implement IPv4 and IPv6 addressing schemes by calculating subnets", and <strong>CLO9</strong> (AI tools).</li>
</ul>
<p>Five sessions out of sixty on one module is the syllabus telling you where the weight is. Subnetting is also the single most reliable source of exam questions in any CCNA-based course, because it is objectively markable: an answer is right or it is not.</p>`,
        `<p>Chương 10 là <strong>Module 11 của Cisco</strong>, và trường xếp cho nó năm buổi — khối lớn nhất mà môn này dành cho một module duy nhất.</p>
<ul>
<li>Buổi 30 — 10.1 Cấu trúc địa chỉ, 10.2 Unicast/Broadcast/Multicast, 10.3 Các loại, 10.4 Phân đoạn.</li>
<li>Buổi 31 — 10.5 đến 10.7 chia subnet, <strong>10.8 VLSM</strong>, 10.9 Thiết kế có cấu trúc, 10.10 công cụ AI.</li>
<li>Buổi 32–33 — Lab 2.2: tính subnet và triển khai một sơ đồ VLSM.</li>
<li>Buổi 34 — <strong>Midterm Progress Test</strong>, ghi là CLO1 đến CLO9.</li>
<li>Chuẩn đầu ra: <strong>CLO5</strong> "thiết kế và triển khai sơ đồ địa chỉ IPv4 và IPv6 bằng cách tính subnet", và <strong>CLO9</strong> (công cụ AI).</li>
</ul>
<p>Năm buổi trên sáu mươi cho một module là cách syllabus nói cho bạn biết trọng tâm nằm ở đâu. Chia subnet cũng là nguồn câu hỏi thi đáng tin nhất trong mọi môn dựa trên CCNA, bởi vì nó chấm được một cách khách quan: một đáp án hoặc đúng hoặc không.</p>`],

      [2, 'Why this is the heaviest chapter, and what it depends on',
        `<p>Three facts about this chapter are worth knowing before you start.</p>
<ul>
<li><strong>Everything after it depends on it.</strong> Chapter 11 (IPv6), Chapter 12 (ICMP), Chapter 13 (transport layer and port numbers) all assume you can read an address and a prefix without thinking.</li>
<li><strong>Its prerequisite is missing from the school plan.</strong> Cisco Module 5 is Number Systems; the sixty-session plan never schedules it. That is why Chapter 4B exists on this site.</li>
<li><strong>The Midterm is at the end of it.</strong> Session 34 examines CLO1 to CLO9, which is everything up to and including this chapter.</li>
</ul>
<p><strong>How to use the chapter.</strong> Do not memorise subnet tables. Every printed table is a consequence of two facts — a mask is a run of ones followed by a run of zeros, and a router ANDs the address with the mask — and if you hold those two facts you can regenerate any row of any table in seconds. People who memorise tables are fine until the question is phrased sideways, and then they are stuck.</p>`,
        `<p>Có ba điều nên biết về chương này trước khi bắt đầu.</p>
<ul>
<li><strong>Mọi thứ sau nó đều dựa vào nó.</strong> Chương 11 (IPv6), Chương 12 (ICMP), Chương 13 (tầng giao vận và số hiệu cổng) đều mặc định là bạn đọc được một địa chỉ và một tiền tố mà không cần nghĩ.</li>
<li><strong>Điều kiện cần của nó bị thiếu trong kế hoạch của trường.</strong> Module 5 của Cisco là Hệ đếm; kế hoạch 60 buổi không bao giờ xếp buổi nào cho nó. Đó là lý do Chương 4B tồn tại trên trang này.</li>
<li><strong>Bài thi giữa kỳ nằm ngay cuối chương.</strong> Buổi 34 kiểm CLO1 đến CLO9, tức là toàn bộ cho tới hết chương này.</li>
</ul>
<p><strong>Cách dùng chương này.</strong> Đừng học thuộc bảng subnet. Mọi bảng in ra đều là hệ quả của hai sự thật — mặt nạ là một dãy số 1 rồi tới một dãy số 0, và router lấy địa chỉ AND với mặt nạ — và nếu nắm được hai sự thật đó thì bạn dựng lại được bất kỳ dòng nào của bất kỳ bảng nào trong vài giây. Người học thuộc bảng thì ổn cho tới khi câu hỏi được hỏi theo chiều khác, và lúc đó thì tắc.</p>`],

      [3, '10.1 Thirty-two bits, and a line drawn through them',
        `<p>An IPv4 address is <strong>32 bits</strong>. Nothing more. The dots and the decimal numbers are a convenience for humans: four groups of eight bits, each group written as a number from 0 to 255.</p>
<p>Those 32 bits answer two separate questions, and the address alone does not tell you where one question ends and the other begins:</p>
<ul>
<li><strong>Which network?</strong> — the leading bits. Every device on the same network shares this part exactly.</li>
<li><strong>Which host on it?</strong> — the trailing bits. Unique within that network, and free to repeat on a different network.</li>
</ul>
<p><strong>The consequence that matters.</strong> Because the address does not carry the split, 192.168.1.200 is not a complete statement. It is half a statement. The other half is the mask, and until you have both you cannot say which network the host is on. This is why every real configuration asks for two values and never one, and why an address written without a prefix in a ticket or a chat message is an incomplete bug report.</p>`,
        `<p>Một địa chỉ IPv4 là <strong>32 bit</strong>. Không gì hơn. Mấy dấu chấm và các số thập phân là tiện nghi dành cho con người: bốn nhóm tám bit, mỗi nhóm viết thành một số từ 0 đến 255.</p>
<p>Ba mươi hai bit đó trả lời hai câu hỏi riêng biệt, và riêng cái địa chỉ thì không nói cho bạn biết câu hỏi này kết thúc ở đâu để câu kia bắt đầu:</p>
<ul>
<li><strong>Mạng nào?</strong> — các bit đầu. Mọi thiết bị trên cùng một mạng đều giống hệt nhau ở phần này.</li>
<li><strong>Host nào trong mạng đó?</strong> — các bit cuối. Duy nhất trong mạng đó, và được phép lặp lại ở một mạng khác.</li>
</ul>
<p><strong>Hệ quả đáng kể.</strong> Vì bản thân địa chỉ không mang theo ranh giới, nên 192.168.1.200 không phải là một phát biểu đầy đủ. Nó là nửa phát biểu. Nửa còn lại là mặt nạ, và chừng nào chưa có cả hai thì bạn chưa nói được host đó nằm trên mạng nào. Đây là lý do mọi cấu hình thật đều hỏi hai giá trị chứ không bao giờ một, và là lý do một địa chỉ viết không kèm tiền tố trong một cái ticket hay một tin nhắn là một báo lỗi chưa đủ dữ kiện.</p>`],

      [4, 'Dotted decimal is a convenience, not the thing itself',
        `<p>Each octet holds eight bits, and each bit position carries a fixed weight: <strong>128, 64, 32, 16, 8, 4, 2, 1</strong>. Add the weights where the bit is 1.</p>
<p>So 11000000 is 128 + 64 = 192. That table is the entire conversion, in both directions — going the other way, subtract the largest weight that fits, repeatedly.</p>
<p><strong>Why it is worth being fluent.</strong> A mask like 255.255.255.192 looks arbitrary in decimal. In binary it is obvious: 192 is 11000000, which is two ones then six zeros, so the mask is 24 + 2 = 26 network bits. Every mask you will ever meet is one of nine values per octet — 0, 128, 192, 224, 240, 248, 252, 254, 255 — because a mask must be a solid run of ones. Any other number in a mask is invalid, and recognising that instantly is worth a mark in an exam and a minute of debugging in real life.</p>`,
        `<p>Mỗi octet chứa tám bit, và mỗi vị trí bit mang một trọng số cố định: <strong>128, 64, 32, 16, 8, 4, 2, 1</strong>. Cộng các trọng số ở chỗ bit bằng 1.</p>
<p>Vậy 11000000 là 128 + 64 = 192. Cái bảng đó chính là toàn bộ phép chuyển đổi, cho cả hai chiều — đi chiều ngược lại thì trừ đi trọng số lớn nhất còn vừa, lặp lại.</p>
<p><strong>Vì sao đáng để thành thạo.</strong> Một mặt nạ như 255.255.255.192 nhìn trong hệ thập phân thì tuỳ tiện. Nhìn trong nhị phân thì hiển nhiên: 192 là 11000000, tức hai số 1 rồi sáu số 0, nên mặt nạ có 24 + 2 = 26 bit mạng. Mọi mặt nạ bạn từng gặp đều là một trong chín giá trị cho mỗi octet — 0, 128, 192, 224, 240, 248, 252, 254, 255 — bởi vì mặt nạ bắt buộc phải là một dãy số 1 liền mạch. Bất kỳ số nào khác nằm trong một mặt nạ đều không hợp lệ, và nhận ra điều đó ngay lập tức đáng giá một điểm trong bài thi và một phút gỡ lỗi ngoài đời.</p>`],

      [5, 'The mask is a sliding boundary',
        `<p>The mask is also 32 bits: a run of ones, then a run of zeros, never mixed. The ones mark the network portion, the zeros mark the host portion.</p>
<p><strong>The trade is fixed and total.</strong> There are 32 bits and no more. Every bit you give to the network is a bit taken from the hosts. A /24 has 8 host bits and 254 usable hosts; a /25 has 7 and 126; a /26 has 6 and 62. Doubling the number of subnets always halves the number of hosts in each. Nothing is created by subnetting — you are choosing how to spend a fixed budget.</p>
<p><strong>Two ways to write the same thing.</strong> <code>/26</code> is the prefix length, the count of one-bits. <code>255.255.255.192</code> is the same value in dotted decimal. IOS accepts the dotted form in interface commands, Linux and most modern tools take the slash form, and every exam mixes both deliberately. Being able to convert in your head — count the ones — is not optional.</p>`,
        `<p>Mặt nạ cũng là 32 bit: một dãy số 1, rồi một dãy số 0, không bao giờ trộn lẫn. Các số 1 đánh dấu phần mạng, các số 0 đánh dấu phần host.</p>
<p><strong>Cuộc đánh đổi là cố định và triệt để.</strong> Có 32 bit và không hơn. Mỗi bit bạn cho phần mạng là một bit lấy đi của phần host. Một /24 có 8 bit host và 254 host dùng được; /25 có 7 và 126; /26 có 6 và 62. Gấp đôi số subnet thì luôn luôn giảm một nửa số host trong mỗi cái. Chia subnet không tạo ra cái gì cả — bạn đang chọn cách tiêu một ngân sách cố định.</p>
<p><strong>Hai cách viết cùng một thứ.</strong> <code>/26</code> là độ dài tiền tố, tức số bit 1. <code>255.255.255.192</code> là cùng giá trị đó viết dạng thập phân có dấu chấm. IOS nhận dạng chấm trong lệnh cấu hình cổng, Linux và phần lớn công cụ hiện đại nhận dạng gạch chéo, và mọi đề thi đều cố ý trộn cả hai. Chuyển đổi được trong đầu — đếm số bit 1 — không phải là chuyện tuỳ chọn.</p>`],

      [6, 'The nine masks, and the block-size shortcut',
        `<p>This table is worth reading until it is boring, but not worth memorising, because one shortcut regenerates it.</p>
<div class="formula">block size = 256 &minus; (last non-zero octet of the mask)</div>
<p>For /26 the mask ends in 192, so the block is 256 &minus; 192 = <strong>64</strong>. The subnets therefore start at .0, .64, .128, .192, and each one is 64 addresses wide with 62 usable.</p>
<p>For /28 the mask ends in 240, so the block is 16: subnets at .0, .16, .32, .48 and so on. For /27 the mask ends in 224, block 32.</p>
<p><strong>Why this one shortcut is enough.</strong> Once you know the block size you know where every subnet starts, and therefore where every one of them ends. The broadcast address of any subnet is the start of the next one minus one. There is no second technique, and everything else in this chapter is that idea applied to bigger prefixes.</p>`,
        `<p>Bảng này đáng đọc tới mức thấy chán, nhưng không đáng học thuộc, bởi vì có một mẹo dựng lại được nó.</p>
<div class="formula">kích thước khối = 256 &minus; (octet khác 0 cuối cùng của mặt nạ)</div>
<p>Với /26 thì mặt nạ kết thúc bằng 192, nên khối là 256 &minus; 192 = <strong>64</strong>. Vậy các subnet bắt đầu ở .0, .64, .128, .192, và mỗi cái rộng 64 địa chỉ với 62 cái dùng được.</p>
<p>Với /28 thì mặt nạ kết thúc bằng 240, nên khối là 16: subnet ở .0, .16, .32, .48 và cứ thế. Với /27 thì mặt nạ kết thúc bằng 224, khối 32.</p>
<p><strong>Vì sao một mẹo này là đủ.</strong> Khi đã biết kích thước khối là bạn biết mọi subnet bắt đầu ở đâu, và do đó biết mỗi cái kết thúc ở đâu. Địa chỉ broadcast của bất kỳ subnet nào là điểm bắt đầu của subnet kế tiếp trừ một. Không có kỹ thuật thứ hai nào, và mọi thứ còn lại trong chương này là chính ý đó áp dụng cho tiền tố lớn hơn.</p>`],

      [7, 'What a router actually does: bitwise AND',
        `<p>Here is the operation, and it is the only one. A router takes the destination address, ANDs it bit by bit with the mask, and the result is the network address. AND keeps a bit only where both inputs are 1.</p>
<p>192.168.1.200 AND 255.255.255.192 gives 192.168.1.192. The mask's zeros erase the host bits to zero, leaving the network's name.</p>
<p><strong>Now the opening question answers itself.</strong> Change only the mask to /24 and redo the AND: 192.168.1.200 AND 255.255.255.0 = 192.168.1.0. Same address, different network. So the machine at 192.168.1.10/24 believes it lives on 192.168.1.0/24 and that .200 is a neighbour it can ARP for. The machine at 192.168.1.200/26 believes it lives on 192.168.1.192/26 and that .10 is <em>remote</em> — it will not ARP for it at all; it will hand the packet to its default gateway, which may not exist. One side shouts on the wire and gets no reply, the other never shouts.</p>
<p><strong>Which one is at fault?</strong> Neither, on its own. A mask is a property of the <em>subnet</em>, not of a host, so every host on one wire must carry the same mask. Two different masks on one segment is the fault, and whichever one disagrees with the network's design is the one to fix.</p>`,
        `<p>Đây là phép toán, và nó là phép duy nhất. Router lấy địa chỉ đích, AND từng bit với mặt nạ, và kết quả là địa chỉ mạng. AND giữ lại một bit chỉ khi cả hai đầu vào đều là 1.</p>
<p>192.168.1.200 AND 255.255.255.192 ra 192.168.1.192. Các số 0 của mặt nạ xoá sạch phần bit host về 0, để lại đúng cái tên của mạng.</p>
<p><strong>Giờ thì câu hỏi mở đầu tự trả lời.</strong> Chỉ đổi mặt nạ thành /24 rồi AND lại: 192.168.1.200 AND 255.255.255.0 = 192.168.1.0. Cùng một địa chỉ, khác mạng. Vậy máy 192.168.1.10/24 tin rằng nó sống trên 192.168.1.0/24 và .200 là hàng xóm mà nó ARP tìm được. Máy 192.168.1.200/26 tin rằng nó sống trên 192.168.1.192/26 và .10 là <em>ở xa</em> — nó sẽ không ARP tìm gì cả; nó đưa gói cho cổng ra mặc định, mà cổng đó có thể không tồn tại. Một bên hét lên trên dây và không ai đáp, bên kia thì không hề hét.</p>
<p><strong>Máy nào sai?</strong> Tự thân thì không máy nào. Mặt nạ là thuộc tính của <em>subnet</em>, không phải của một host, nên mọi host trên cùng một sợi dây bắt buộc phải mang cùng một mặt nạ. Hai mặt nạ khác nhau trên một đoạn mạng chính là cái sai, và cái nào lệch với thiết kế của mạng thì cái đó phải sửa.</p>`],

      [8, 'Three fixed points in every subnet',
        `<p>Inside any subnet, two addresses are reserved and cannot be assigned to an interface.</p>
<ul>
<li><strong>The network address</strong> — all host bits 0. It names the subnet. 192.168.1.192 for a /26 starting there.</li>
<li><strong>The broadcast address</strong> — all host bits 1. It means "every host on this subnet". 192.168.1.255 for that /26.</li>
<li>Everything between them is usable: 192.168.1.193 to 192.168.1.254, which is <strong>62</strong> addresses.</li>
</ul>
<p><strong>This is where the minus two comes from.</strong> The formula 2^h &minus; 2 is not a rule of thumb or a safety margin. It is two specific addresses with two specific jobs. A /26 has 2^6 = 64 addresses and 62 usable, and both numbers are correct answers to different questions — "how big is the block" and "how many hosts fit".</p>
<p><strong>The exception.</strong> A /31 has no network and no broadcast (RFC 3021): both of its two addresses are usable, which is exactly right for a link between two routers. A /32 is a single address, used for loopback interfaces and host routes. For those two prefixes, subtracting 2 gives a wrong answer — and in the /31 case it gives zero, which is how you know the rule is being misapplied.</p>`,
        `<p>Bên trong bất kỳ subnet nào cũng có hai địa chỉ bị giữ lại và không được gán cho một cổng nào.</p>
<ul>
<li><strong>Địa chỉ mạng</strong> — mọi bit host bằng 0. Nó là tên của subnet. Là 192.168.1.192 cho một /26 bắt đầu ở đó.</li>
<li><strong>Địa chỉ broadcast</strong> — mọi bit host bằng 1. Nó có nghĩa "mọi host trên subnet này". Là 192.168.1.255 cho cái /26 đó.</li>
<li>Mọi thứ nằm giữa hai cái đó thì dùng được: 192.168.1.193 đến 192.168.1.254, tức <strong>62</strong> địa chỉ.</li>
</ul>
<p><strong>Phép trừ 2 đến từ đây.</strong> Công thức 2^h &minus; 2 không phải một quy ước ước chừng hay một biên an toàn. Nó là hai địa chỉ cụ thể với hai nhiệm vụ cụ thể. Một /26 có 2^6 = 64 địa chỉ và 62 cái dùng được, và cả hai con số đều là đáp án đúng cho hai câu hỏi khác nhau — "khối này lớn bao nhiêu" và "nhét được bao nhiêu host".</p>
<p><strong>Ngoại lệ.</strong> Một /31 không có địa chỉ mạng và không có broadcast (RFC 3021): cả hai địa chỉ của nó đều dùng được, đúng bằng thứ cần cho một đường nối giữa hai router. Một /32 là một địa chỉ đơn lẻ, dùng cho cổng loopback và cho tuyến tới một host. Với hai tiền tố đó thì trừ 2 cho ra đáp án sai — và với /31 thì nó cho ra số không, đó là cách bạn biết mình đang áp nhầm quy tắc.</p>`],

      [9, 'Reading a subnet in four lines',
        `<p>This is the exam skill, and it takes under thirty seconds once the block-size shortcut is automatic. Given <strong>192.168.1.200/26</strong>:</p>
<ol>
<li><strong>Block size</strong> = 256 &minus; 192 = 64.</li>
<li><strong>Network</strong> = the largest multiple of 64 not greater than 200 = 192. So 192.168.1.192.</li>
<li><strong>Broadcast</strong> = network + block &minus; 1 = 192 + 64 &minus; 1 = 255. So 192.168.1.255.</li>
<li><strong>Host range</strong> = network + 1 to broadcast &minus; 1 = .193 to .254.</li>
</ol>
<p><strong>Step 2 is the one to practise.</strong> "Largest multiple of the block not greater than the address" is a rounding-down operation, and doing it in your head is the whole trick. Multiples of 64 are 0, 64, 128, 192, 256 — and 256 is too big, so 192 it is. For a /28 with block 16 and an address ending in .37, the multiples are 0, 16, 32, 48, so the answer is 32.</p>`,
        `<p>Đây là kỹ năng đi thi, và nó mất chưa tới ba mươi giây khi mẹo kích thước khối đã thành phản xạ. Cho <strong>192.168.1.200/26</strong>:</p>
<ol>
<li><strong>Kích thước khối</strong> = 256 &minus; 192 = 64.</li>
<li><strong>Địa chỉ mạng</strong> = bội số lớn nhất của 64 mà không vượt quá 200 = 192. Vậy là 192.168.1.192.</li>
<li><strong>Broadcast</strong> = mạng + khối &minus; 1 = 192 + 64 &minus; 1 = 255. Vậy là 192.168.1.255.</li>
<li><strong>Dải host</strong> = mạng + 1 đến broadcast &minus; 1 = .193 đến .254.</li>
</ol>
<p><strong>Bước 2 là bước cần luyện.</strong> "Bội số lớn nhất của khối mà không vượt quá địa chỉ" là một phép làm tròn xuống, và làm được nó trong đầu chính là toàn bộ mẹo. Bội số của 64 là 0, 64, 128, 192, 256 — mà 256 thì quá lớn, nên là 192. Với một /28 khối 16 và địa chỉ kết thúc bằng .37, các bội số là 0, 16, 32, 48, nên đáp án là 32.</p>`],

      [10, '10.2 Unicast, broadcast, multicast',
        `<p>The destination address answers one more question: <em>how many receivers did I mean?</em></p>
<ul>
<li><strong>Unicast</strong> — one sender, one receiver. The destination is an ordinary host address. This is essentially all of your traffic: every web request, every SSH session, every database query.</li>
<li><strong>Broadcast</strong> — one sender, every host on the subnet. The destination is 255.255.255.255 or the subnet's own broadcast address. Every machine on the segment must process it, whether it cares or not.</li>
<li><strong>Multicast</strong> — one sender, a group. The destination is in 224.0.0.0/4. Only machines that joined the group listen; the rest drop it in hardware and are not interrupted.</li>
</ul>
<p><strong>Why multicast exists at all.</strong> Suppose a router needs to tell all other routers on a segment about a route change. Unicast means sending the same packet once per neighbour. Broadcast means interrupting every PC and printer on the wire about something none of them can use. Multicast to 224.0.0.5 sends it once and interrupts only routers. That is the whole design argument, and it is why routing protocols use it.</p>`,
        `<p>Địa chỉ đích trả lời thêm một câu hỏi nữa: <em>tôi nhắm tới bao nhiêu người nhận?</em></p>
<ul>
<li><strong>Unicast</strong> — một người gửi, một người nhận. Đích là một địa chỉ host bình thường. Đây gần như là toàn bộ lưu lượng của bạn: mọi yêu cầu web, mọi phiên SSH, mọi truy vấn cơ sở dữ liệu.</li>
<li><strong>Broadcast</strong> — một người gửi, mọi host trên subnet. Đích là 255.255.255.255 hoặc địa chỉ broadcast của chính subnet đó. Mọi máy trên đoạn mạng buộc phải xử lý nó, dù có quan tâm hay không.</li>
<li><strong>Multicast</strong> — một người gửi, một nhóm. Đích nằm trong 224.0.0.0/4. Chỉ những máy đã tham gia nhóm mới nghe; số còn lại vứt nó ngay ở phần cứng và không bị làm phiền.</li>
</ul>
<p><strong>Vì sao lại cần multicast.</strong> Giả sử một router cần báo cho mọi router khác trên đoạn mạng về một thay đổi tuyến. Unicast nghĩa là gửi cùng một gói, mỗi láng giềng một lần. Broadcast nghĩa là làm phiền mọi cái PC và cái máy in trên dây về một chuyện không cái nào dùng được. Multicast tới 224.0.0.5 gửi một lần và chỉ làm phiền các router. Đó là toàn bộ lập luận thiết kế, và là lý do các giao thức định tuyến dùng nó.</p>`],

      [11, 'Two kinds of broadcast, and the boundary that stops them',
        `<p>The distinction matters in practice more than it looks.</p>
<ul>
<li><strong>Limited broadcast, 255.255.255.255.</strong> "Everyone on this wire." A router never forwards it, full stop. It has no network portion to route on.</li>
<li><strong>Directed broadcast, 192.168.1.255.</strong> "Everyone on that specific subnet." A router <em>could</em> forward it, but Cisco has disabled this by default since IOS 12.0, because it was the mechanism behind the Smurf amplification attack.</li>
</ul>
<p><strong>The practical consequence, DHCP.</strong> A machine with no address yet cannot send a unicast — it does not know the server's address and has no address of its own. So DHCP Discover goes out as a limited broadcast from 0.0.0.0 to 255.255.255.255. That is why a DHCP server must be on the same subnet as its clients, or a router must be told to relay with <code>ip helper-address</code>. If you have ever wondered why DHCP is configured per-VLAN, this is the reason.</p>
<p><strong>The other one you will meet.</strong> mDNS uses multicast 224.0.0.251 with a TTL of 1, meaning it dies at the first router. Printers and AirPlay devices "disappear" at the office and work at home not because anything is broken, but because home is one flat subnet and the office is not.</p>`,
        `<p>Chỗ phân biệt này trong thực tế quan trọng hơn vẻ ngoài của nó.</p>
<ul>
<li><strong>Broadcast giới hạn, 255.255.255.255.</strong> "Mọi người trên sợi dây này." Router không bao giờ chuyển tiếp nó, hết chuyện. Nó không có phần mạng nào để mà định tuyến.</li>
<li><strong>Broadcast có hướng, 192.168.1.255.</strong> "Mọi người trên đúng cái subnet kia." Router thì <em>có thể</em> chuyển tiếp, nhưng Cisco đã tắt mặc định từ IOS 12.0, vì đó là cơ chế đứng sau đòn khuếch đại Smurf.</li>
</ul>
<p><strong>Hệ quả thực tế, chuyện DHCP.</strong> Một máy chưa có địa chỉ thì không gửi unicast được — nó không biết địa chỉ máy chủ và bản thân cũng chưa có địa chỉ. Nên gói DHCP Discover đi ra dạng broadcast giới hạn, từ 0.0.0.0 tới 255.255.255.255. Đó là lý do máy chủ DHCP phải nằm cùng subnet với máy khách, hoặc phải bảo router tiếp sức bằng <code>ip helper-address</code>. Nếu bạn từng thắc mắc vì sao DHCP lại được cấu hình theo từng VLAN thì đây là lý do.</p>
<p><strong>Cái nữa bạn sẽ gặp.</strong> mDNS dùng multicast 224.0.0.251 với TTL bằng 1, nghĩa là nó chết ở router đầu tiên. Máy in và thiết bị AirPlay "biến mất" ở công ty mà chạy tốt ở nhà không phải vì có gì hỏng, mà vì ở nhà là một subnet phẳng còn ở công ty thì không.</p>`],

      [12, '10.3 Public and private address space',
        `<p>RFC 1918 sets aside three ranges that anybody may use inside their own network, and that no router on the public Internet will carry.</p>
<ul>
<li><strong>10.0.0.0/8</strong> — 16,777,216 addresses. Campuses, clouds, anything large.</li>
<li><strong>172.16.0.0/12</strong> — 1,048,576 addresses. This is <strong>172.16.x.x through 172.31.x.x</strong>.</li>
<li><strong>192.168.0.0/16</strong> — 65,536 addresses. Home routers, labs, small offices.</li>
</ul>
<p><strong>The /12 is the one people get wrong,</strong> and it gets asked in exams precisely because of that. A /12 means 12 network bits, so the second octet is not fixed at 16 — it ranges from 16 to 31. 172.20.0.1 is private. 172.32.0.1 is <em>public</em> and belongs to someone else, and using it internally means you can never reach the real owner.</p>
<p><strong>What "private" actually buys you.</strong> Reuse. Every company on earth can use 192.168.1.0/24 simultaneously with no conflict, because those packets never leave the building — NAT rewrites the source address on the way out. The cost appears the day two such networks are joined by a VPN, and both sides think 192.168.1.0/24 is themselves.</p>`,
        `<p>RFC 1918 để riêng ba dải mà ai cũng được dùng trong mạng của mình, và không router nào trên Internet công cộng chịu mang chúng.</p>
<ul>
<li><strong>10.0.0.0/8</strong> — 16.777.216 địa chỉ. Khuôn viên trường, đám mây, bất cứ thứ gì lớn.</li>
<li><strong>172.16.0.0/12</strong> — 1.048.576 địa chỉ. Đây là <strong>172.16.x.x đến 172.31.x.x</strong>.</li>
<li><strong>192.168.0.0/16</strong> — 65.536 địa chỉ. Router gia đình, phòng lab, văn phòng nhỏ.</li>
</ul>
<p><strong>Cái /12 là chỗ người ta hay nhầm,</strong> và nó được hỏi trong đề thi đúng vì lẽ đó. /12 nghĩa là 12 bit mạng, nên octet thứ hai không bị cố định ở 16 — nó chạy từ 16 đến 31. 172.20.0.1 là địa chỉ riêng. 172.32.0.1 là địa chỉ <em>công cộng</em> và thuộc về người khác, dùng nó trong nội bộ nghĩa là bạn vĩnh viễn không tới được chủ thật của nó.</p>
<p><strong>"Riêng" thực ra mua được gì.</strong> Được dùng lại. Mọi công ty trên trái đất có thể dùng 192.168.1.0/24 cùng lúc mà không đụng nhau, vì những gói đó không bao giờ ra khỏi toà nhà — NAT viết lại địa chỉ nguồn trên đường ra. Cái giá hiện ra vào ngày hai mạng như vậy được nối bằng một đường VPN, và cả hai bên đều nghĩ 192.168.1.0/24 là chính mình.</p>`],

      [13, 'The reserved ranges you will actually meet',
        `<p>Beyond the private ranges, five more are worth recognising instantly.</p>
<ul>
<li><strong>127.0.0.0/8 — loopback.</strong> 16.7 million addresses for one machine. 127.0.0.1 is localhost, but 127.0.0.2 also works, which occasionally surprises people binding services.</li>
<li><strong>169.254.0.0/16 — link-local (APIPA).</strong> A host that asked for DHCP and got no answer gives itself one of these. Seeing 169.254.x.x on a PC means <em>DHCP failed</em>, and that is a complete diagnosis on its own.</li>
<li><strong>100.64.0.0/10 — CGNAT (RFC 6598).</strong> Carriers hand these out when they have run out of public IPv4. ★ Tailscale also uses 100.x for its virtual network.</li>
<li><strong>224.0.0.0/4 — multicast.</strong> Already covered.</li>
<li><strong>192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 — TEST-NET.</strong> Reserved for documentation. Use these in your own diagrams instead of inventing addresses that belong to real companies.</li>
</ul>
<p>★ <strong>169.254.169.254 is worth memorising.</strong> That single address is the metadata service on AWS, GCP, Azure and most VPS providers. If it appears in a routing table, you are on a virtual machine. It lives in the link-local range precisely so that it can never be routed off the host — a neat piece of design you can now read the reasoning behind.</p>`,
        `<p>Ngoài các dải riêng, còn năm dải nữa đáng nhận ra ngay tức khắc.</p>
<ul>
<li><strong>127.0.0.0/8 — loopback.</strong> 16,7 triệu địa chỉ cho một cái máy. 127.0.0.1 là localhost, nhưng 127.0.0.2 cũng chạy, điều này thỉnh thoảng làm người ta bất ngờ khi gắn dịch vụ vào cổng.</li>
<li><strong>169.254.0.0/16 — link-local (APIPA).</strong> Một máy hỏi DHCP mà không ai trả lời thì tự cấp cho mình một địa chỉ loại này. Thấy 169.254.x.x trên một cái PC nghĩa là <em>DHCP hỏng</em>, và tự nó đã là một chẩn đoán đầy đủ.</li>
<li><strong>100.64.0.0/10 — CGNAT (RFC 6598).</strong> Nhà mạng phát loại này ra khi đã hết IPv4 công cộng. ★ Tailscale cũng dùng 100.x cho mạng ảo của nó.</li>
<li><strong>224.0.0.0/4 — multicast.</strong> Đã nói ở trên.</li>
<li><strong>192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 — TEST-NET.</strong> Dành riêng cho tài liệu. Dùng mấy dải này trong sơ đồ của bạn thay vì bịa ra địa chỉ vốn thuộc về công ty có thật.</li>
</ul>
<p>★ <strong>169.254.169.254 đáng thuộc lòng.</strong> Đúng một địa chỉ đó là dịch vụ metadata trên AWS, GCP, Azure và phần lớn nhà cung cấp VPS. Nếu nó xuất hiện trong bảng định tuyến thì bạn đang ở trên một máy ảo. Nó nằm trong dải link-local đúng để nó không bao giờ bị định tuyến ra khỏi máy chủ — một chỗ thiết kế gọn gàng mà giờ bạn đọc được lý lẽ đằng sau.</p>`],

      [14, 'Classful addressing is dead, and its ghost is useful',
        `<p>Until 1993, the first octet decided the mask. Class A was /8, class B was /16, class C was /24, with no choice in the matter.</p>
<p><strong>Why it had to go.</strong> The granularity was absurd. An organisation needing 300 addresses could have 254 (too few) or 65,534 (wasting 65,000). There was nothing in between. CIDR — Classless Inter-Domain Routing — replaced it with an explicit prefix length, and that is the world you live in: every address is written with its prefix because the prefix is now a free choice.</p>
<p><strong>Why the ghost still matters.</strong> Three reasons. IOS still <em>offers</em> the old classful mask as a default when you type an address, so accepting the default silently gives you /8 on a 10.x address. Exam questions still say "class C address" meaning "starts with 192–223". And the intuition that 10.x is "a big network" and 192.168.x is "a small one" comes entirely from this dead scheme — which is harmless as intuition and dangerous as an assumption.</p>`,
        `<p>Cho tới 1993, octet đầu tiên quyết định mặt nạ. Lớp A là /8, lớp B là /16, lớp C là /24, không có lựa chọn nào khác.</p>
<p><strong>Vì sao nó phải chết.</strong> Độ mịn thật vô lý. Một tổ chức cần 300 địa chỉ thì được 254 (quá ít) hoặc 65.534 (phí 65.000). Không có gì ở giữa. CIDR — Classless Inter-Domain Routing — thay nó bằng một độ dài tiền tố khai tường minh, và đó là thế giới bạn đang sống: mọi địa chỉ đều viết kèm tiền tố vì tiền tố giờ là một lựa chọn tự do.</p>
<p><strong>Vì sao bóng ma của nó vẫn đáng kể.</strong> Ba lý do. IOS vẫn <em>gợi ý</em> mặt nạ theo lớp cũ làm mặc định khi bạn gõ một địa chỉ, nên nhận mặc định là lặng lẽ nhận /8 cho một địa chỉ 10.x. Đề thi vẫn nói "địa chỉ lớp C" với nghĩa "bắt đầu bằng 192–223". Và cái cảm giác rằng 10.x là "mạng lớn" còn 192.168.x là "mạng nhỏ" hoàn toàn đến từ cái sơ đồ đã chết này — vô hại khi là cảm giác, và nguy hiểm khi là giả định.</p>`],

      [15, '10.4 Why segment a network at all',
        `<p>Subnetting costs addresses — two per subnet, plus administrative effort. Three things buy it back.</p>
<ul>
<li><strong>Broadcast containment.</strong> One subnet is one broadcast domain. Five hundred hosts on one flat LAN means every ARP request and every DHCP Discover interrupts all five hundred. Split it into five subnets and each broadcast reaches a hundred.</li>
<li><strong>Security.</strong> A router is a place where a rule can live. Guests on their own subnet cannot reach the accounting server, because the packet must pass a device capable of saying no. On one flat network, there is nowhere to put the rule.</li>
<li><strong>Structure.</strong> Addresses that encode meaning are addresses a human can debug. If 10.20.x is floor 2 and 10.30.x is floor 3, a log line identifies a location without a lookup.</li>
</ul>
<p>★ <strong>You have already done this.</strong> Putting a database container on a Docker compose network rather than publishing port 5432 is network segmentation, exactly as described here. The container has an address on 172.18.0.0/16, which no router on the Internet will carry, so it is unreachable from outside no matter what the firewall does or does not say. The isolation comes from the addressing, not from a rule — which is why it cannot be accidentally deleted.</p>`,
        `<p>Chia subnet thì tốn địa chỉ — hai cái mỗi subnet, cộng thêm công quản trị. Ba thứ sau bù lại khoản đó.</p>
<ul>
<li><strong>Khoanh vùng broadcast.</strong> Một subnet là một miền broadcast. Năm trăm host trên một LAN phẳng nghĩa là mọi yêu cầu ARP và mọi gói DHCP Discover đều làm phiền cả năm trăm. Chia thành năm subnet thì mỗi lần broadcast chỉ tới một trăm.</li>
<li><strong>An ninh.</strong> Router là chỗ mà một luật có thể sống. Khách trên subnet riêng của họ không tới được máy chủ kế toán, bởi vì gói tin buộc phải đi qua một thiết bị có khả năng nói không. Trên một mạng phẳng thì không có chỗ nào để đặt cái luật đó.</li>
<li><strong>Cấu trúc.</strong> Địa chỉ mang nghĩa là địa chỉ mà con người gỡ lỗi được. Nếu 10.20.x là tầng 2 và 10.30.x là tầng 3 thì một dòng log tự nói ra vị trí mà không cần tra cứu.</li>
</ul>
<p>★ <strong>Bạn đã làm chuyện này rồi.</strong> Đặt một container cơ sở dữ liệu vào mạng compose của Docker thay vì công bố cổng 5432 chính là phân đoạn mạng, đúng như mô tả ở đây. Container có một địa chỉ trên 172.18.0.0/16, mà không router nào trên Internet chịu mang, nên nó không tới được từ bên ngoài bất kể tường lửa có nói gì hay không nói gì. Sự cô lập đến từ cách đánh địa chỉ, không phải từ một luật — và đó là lý do nó không thể bị xoá nhầm.</p>`],
    ]),

    bi(
      `<h3>🗺️ The one decision every host makes before sending a packet</h3>
<p>Every time a host is about to send anything, it runs this and nothing else. The whole chapter exists to make this diagram computable.</p>
<pre><code class="language-mermaid">graph TD
  A["Host wants to send<br/>to destination D"] --> B["AND my own address<br/>with my mask = MY network"]
  B --> C["AND D with my mask<br/>= D's network"]
  C --> D{"Same result?"}
  D -->|"yes — D is LOCAL"| E["ARP for D<br/>send the frame straight to it"]
  D -->|"no — D is REMOTE"| F["ARP for the DEFAULT GATEWAY<br/>send the frame to the router"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class D ask
  class A,B,C act
  class E,F ok</code></pre>
<p>Notice that the mask appears twice and the destination's <em>real</em> mask appears nowhere. A host judges everyone else by its own mask. That single fact explains the opening question, and it explains why a mask typo produces a one-way failure rather than a symmetric one.</p>`,
      `<h3>🗺️ Cái quyết định duy nhất mà mọi host đưa ra trước khi gửi một gói</h3>
<p>Mỗi lần một host sắp gửi bất cứ thứ gì, nó chạy đúng cái này và không gì khác. Cả chương này tồn tại để làm cho sơ đồ này tính được.</p>
<pre><code class="language-mermaid">graph TD
  A["Host muốn gửi<br/>tới đích D"] --> B["AND địa chỉ của mình<br/>với mặt nạ = mạng CỦA TÔI"]
  B --> C["AND D với mặt nạ của mình<br/>= mạng của D"]
  C --> D{"Hai kết quả có giống nhau?"}
  D -->|"giống — D ở NỘI BỘ"| E["ARP tìm D<br/>gửi thẳng khung tới nó"]
  D -->|"khác — D ở XA"| F["ARP tìm CỔNG RA MẶC ĐỊNH<br/>gửi khung tới router"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class D ask
  class A,B,C act
  class E,F ok</code></pre>
<p>Để ý rằng mặt nạ xuất hiện hai lần còn mặt nạ <em>thật</em> của phía đích thì không xuất hiện ở đâu cả. Một host phán xét mọi người khác bằng mặt nạ của chính nó. Đúng một sự thật đó giải thích câu hỏi mở đầu, và giải thích vì sao gõ sai mặt nạ lại gây ra một cái hỏng một chiều chứ không đối xứng.</p>`,
    ),

    bi(
      `<h3>🔍 How to check any of this yourself</h3>
<p>Do not take an answer from a book, a model or this page. Every claim in this lesson can be verified in one line.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('192.168.1.200/26', strict=False); print(n.network_address, n.broadcast_address, n.netmask, n.num_addresses-2)"</code></pre>
<pre><code class="language-plaintext">192.168.1.192 192.168.1.255 255.255.255.192 62</code></pre>
<p>The <code>strict=False</code> matters: it tells Python you are handing it a host address with a prefix, not a network address, and to compute the containing network rather than complain.</p>
<p>To see the bits, which is where understanding actually lives:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_address('192.168.1.200'); print('.'.join(format(o,'08b') for o in a.packed))"</code></pre>
<pre><code class="language-plaintext">11000000.10101000.00000001.11001000</code></pre>
<div class="callout ok"><strong>Cách tự kiểm.</strong> Compute the four values by hand first, then run the command. If they match, the method is in your hands. If they do not, the command tells you which of the four steps you got wrong, which is far more useful than being told you were wrong in general.</div>`,
      `<h3>🔍 Cách tự kiểm mọi thứ trong bài này</h3>
<p>Đừng nhận một đáp án từ sách, từ một mô hình AI hay từ trang này. Mọi khẳng định trong bài đều kiểm được bằng một dòng lệnh.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('192.168.1.200/26', strict=False); print(n.network_address, n.broadcast_address, n.netmask, n.num_addresses-2)"</code></pre>
<pre><code class="language-plaintext">192.168.1.192 192.168.1.255 255.255.255.192 62</code></pre>
<p>Chỗ <code>strict=False</code> có ý nghĩa: nó nói với Python rằng bạn đang đưa một địa chỉ host kèm tiền tố chứ không phải một địa chỉ mạng, và hãy tính ra mạng chứa nó thay vì kêu lỗi.</p>
<p>Muốn nhìn thấy các bit, tức là chỗ mà sự hiểu thật sự nằm ở đó:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_address('192.168.1.200'); print('.'.join(format(o,'08b') for o in a.packed))"</code></pre>
<pre><code class="language-plaintext">11000000.10101000.00000001.11001000</code></pre>
<div class="callout ok"><strong>Cách tự kiểm.</strong> Tính bốn giá trị bằng tay trước đã, rồi mới chạy lệnh. Khớp thì phương pháp đã nằm trong tay bạn. Không khớp thì lệnh chỉ ra bạn sai ở bước nào trong bốn bước, và điều đó hữu ích hơn nhiều so với việc bị bảo là sai một cách chung chung.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — treating an address without a mask as complete.</strong> "The server is at 10.0.5.20" tells you nothing about which network it is on. Depending on the mask it could be 10.0.5.0/24, 10.0.4.0/23 or 10.0.0.0/8. <b>Symptom:</b> a route or firewall rule that looks right and matches nothing, or matches far too much.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — assuming .1 is always the gateway.</strong> It is a widespread convention, not a rule. In 192.168.1.192/26 the first usable address is .193, and .1 is not even in the subnet. <b>Symptom:</b> a PC configured with an unreachable gateway; local pings work, everything else times out.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — thinking 172.16.0.0/12 stops at 172.16.</strong> It runs to 172.31.255.255. <b>Symptom:</b> a firewall rule written as 172.16.0.0/12 quietly admits sixteen times the address space the author pictured, or a "private" 172.32.x.x address that is actually public and unreachable.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — assigning the network or broadcast address to a host.</strong> Most systems accept it without complaint at configuration time. <b>Symptom:</b> the interface comes up, the address appears in <code>ipconfig</code>, and nothing ever replies. There is no error message anywhere, which is what makes it expensive.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — coi một địa chỉ không kèm mặt nạ là đủ.</strong> "Máy chủ ở 10.0.5.20" không nói gì về chuyện nó nằm trên mạng nào. Tuỳ mặt nạ mà nó có thể là 10.0.5.0/24, 10.0.4.0/23 hoặc 10.0.0.0/8. <b>Triệu chứng:</b> một tuyến hay một luật tường lửa nhìn thì đúng mà không khớp gì cả, hoặc khớp quá nhiều.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — mặc định .1 luôn là cổng ra.</strong> Đó là một thói quen phổ biến, không phải một quy tắc. Trong 192.168.1.192/26 thì địa chỉ dùng được đầu tiên là .193, còn .1 thậm chí không nằm trong subnet đó. <b>Triệu chứng:</b> một cái PC được cấu hình cổng ra không tới được; ping nội bộ thì chạy, mọi thứ khác thì hết giờ.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — tưởng 172.16.0.0/12 dừng ở 172.16.</strong> Nó chạy tới 172.31.255.255. <b>Triệu chứng:</b> một luật tường lửa viết là 172.16.0.0/12 lặng lẽ cho vào gấp mười sáu lần không gian địa chỉ mà người viết hình dung, hoặc một địa chỉ 172.32.x.x tưởng là "riêng" mà thật ra là công cộng và không tới được.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — gán địa chỉ mạng hoặc broadcast cho một host.</strong> Phần lớn hệ thống nhận nó mà không kêu ca gì lúc cấu hình. <b>Triệu chứng:</b> cổng lên, địa chỉ hiện ra trong <code>ipconfig</code>, và không bao giờ có ai trả lời. Không có thông báo lỗi ở đâu cả, và chính điều đó làm nó đắt.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> For 10.1.200.77/20, give the network address, the first and last usable host, and the broadcast address.</p>
<div class="dap-an"><p>The mask for /20 is 255.255.240.0, so the interesting octet is the third and the block size is 256 &minus; 240 = <b>16</b>.</p>
<ul>
<li>Multiples of 16 not greater than 200: 192. So the network is <b>10.1.192.0</b>.</li>
<li>Broadcast = next network minus one = 10.1.208.0 &minus; 1 = <b>10.1.207.255</b>.</li>
<li>First usable <b>10.1.192.1</b>, last usable <b>10.1.207.254</b>. That is 4,094 hosts.</li>
</ul>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('10.1.200.77/20', strict=False); print(n, n.network_address, n.broadcast_address, n.num_addresses-2)"</code></pre>
<pre><code class="language-plaintext">10.1.192.0/20 10.1.192.0 10.1.207.255 4094</code></pre>
<p>The step people get wrong is rounding 200 down inside the <em>third</em> octet rather than the fourth. Find the octet where the mask is neither 255 nor 0 — that is where the block lives.</p></div>

<p><b>E2.</b> A host is 192.168.4.130 with mask 255.255.255.224. Its default gateway is configured as 192.168.4.129. A second host on the same switch is 192.168.4.170/27 with the same gateway. Can they reach each other? Can the second one reach the Internet?</p>
<div class="dap-an"><p>Block size = 256 &minus; 224 = <b>32</b>. Subnets start at .0, .32, .64, .96, .128, .160, .192, .224.</p>
<ul>
<li>130 falls in the block starting at 128 → <b>192.168.4.128/27</b>, usable .129 to .158.</li>
<li>170 falls in the block starting at 160 → <b>192.168.4.160/27</b>, usable .161 to .190.</li>
</ul>
<p>They are on <b>different subnets</b>, so they cannot talk directly even though they share a switch. Worse, the second host's gateway .129 is not in its own subnet at all, so it cannot reach the gateway either — it will try to ARP for an address it believes is remote, send to a gateway it cannot address, and fail. <b>It reaches nothing outside .160–.190.</b></p>
<p>This is the single most common lab fault in this chapter: picking host addresses without checking which block they land in.</p></div>

<p><b>E3.</b> Classify each address: 172.31.5.1 · 169.254.8.9 · 100.66.1.1 · 224.0.0.5 · 203.0.113.7.</p>
<div class="dap-an"><ul>
<li><b>172.31.5.1</b> — private, RFC 1918. It is inside 172.16.0.0/12 because the /12 runs to 172.31.</li>
<li><b>169.254.8.9</b> — link-local (APIPA). Means DHCP failed; this host assigned it to itself.</li>
<li><b>100.66.1.1</b> — CGNAT, RFC 6598 (100.64.0.0/10 covers 100.64 to 100.127). Not a public address, and not routable to you.</li>
<li><b>224.0.0.5</b> — multicast, and specifically the OSPF "all routers" group.</li>
<li><b>203.0.113.7</b> — TEST-NET-3, reserved for documentation. Valid to write in a diagram, never to deploy.</li>
</ul>
<pre><code class="language-bash">python3 -c "import ipaddress as i; [print(a, 'private' if i.ip_address(a).is_private else 'public', 'linklocal' if i.ip_address(a).is_link_local else '', 'multicast' if i.ip_address(a).is_multicast else '') for a in ['172.31.5.1','169.254.8.9','100.66.1.1','224.0.0.5','203.0.113.7']]"</code></pre>
<p class="ghi-chu">Python reports 100.66.1.1 as private, since RFC 6598 space is treated as non-globally-reachable. The practical meaning is the same: nobody on the Internet can route to it.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Với 10.1.200.77/20, cho biết địa chỉ mạng, host đầu và host cuối dùng được, và địa chỉ broadcast.</p>
<div class="dap-an"><p>Mặt nạ của /20 là 255.255.240.0, nên octet đáng chú ý là octet thứ ba và kích thước khối là 256 &minus; 240 = <b>16</b>.</p>
<ul>
<li>Bội số của 16 không vượt quá 200: là 192. Vậy mạng là <b>10.1.192.0</b>.</li>
<li>Broadcast = mạng kế tiếp trừ một = 10.1.208.0 &minus; 1 = <b>10.1.207.255</b>.</li>
<li>Host đầu <b>10.1.192.1</b>, host cuối <b>10.1.207.254</b>. Tức 4.094 host.</li>
</ul>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('10.1.200.77/20', strict=False); print(n, n.network_address, n.broadcast_address, n.num_addresses-2)"</code></pre>
<pre><code class="language-plaintext">10.1.192.0/20 10.1.192.0 10.1.207.255 4094</code></pre>
<p>Bước người ta hay sai là làm tròn 200 xuống ở octet <em>thứ ba</em> chứ không phải thứ tư. Hãy tìm octet mà mặt nạ không phải 255 cũng không phải 0 — khối nằm ở đó.</p></div>

<p><b>E2.</b> Một host là 192.168.4.130 mặt nạ 255.255.255.224. Cổng ra mặc định của nó đặt là 192.168.4.129. Một host thứ hai trên cùng con switch là 192.168.4.170/27 với cùng cổng ra đó. Hai máy có tới được nhau không? Máy thứ hai có ra được Internet không?</p>
<div class="dap-an"><p>Kích thước khối = 256 &minus; 224 = <b>32</b>. Các subnet bắt đầu ở .0, .32, .64, .96, .128, .160, .192, .224.</p>
<ul>
<li>130 rơi vào khối bắt đầu ở 128 → <b>192.168.4.128/27</b>, dùng được .129 đến .158.</li>
<li>170 rơi vào khối bắt đầu ở 160 → <b>192.168.4.160/27</b>, dùng được .161 đến .190.</li>
</ul>
<p>Hai máy nằm trên <b>hai subnet khác nhau</b>, nên không nói chuyện trực tiếp được dù chung một con switch. Tệ hơn, cổng ra .129 của máy thứ hai thậm chí không nằm trong subnet của chính nó, nên nó cũng không tới được cổng ra — nó sẽ đi ARP tìm một địa chỉ mà nó tin là ở xa, gửi tới một cổng ra mà nó không đánh địa chỉ được, và hỏng. <b>Nó không tới được gì ngoài dải .160–.190.</b></p>
<p>Đây là lỗi lab hay gặp nhất của chương này: chọn địa chỉ host mà không kiểm xem nó rơi vào khối nào.</p></div>

<p><b>E3.</b> Phân loại từng địa chỉ: 172.31.5.1 · 169.254.8.9 · 100.66.1.1 · 224.0.0.5 · 203.0.113.7.</p>
<div class="dap-an"><ul>
<li><b>172.31.5.1</b> — riêng, RFC 1918. Nó nằm trong 172.16.0.0/12 vì cái /12 chạy tới 172.31.</li>
<li><b>169.254.8.9</b> — link-local (APIPA). Nghĩa là DHCP hỏng; host này tự gán cho mình.</li>
<li><b>100.66.1.1</b> — CGNAT, RFC 6598 (100.64.0.0/10 phủ từ 100.64 đến 100.127). Không phải địa chỉ công cộng, và không định tuyến tới bạn được.</li>
<li><b>224.0.0.5</b> — multicast, và cụ thể là nhóm "mọi router" của OSPF.</li>
<li><b>203.0.113.7</b> — TEST-NET-3, dành riêng cho tài liệu. Viết trong sơ đồ thì hợp lệ, triển khai thật thì không bao giờ.</li>
</ul>
<pre><code class="language-bash">python3 -c "import ipaddress as i; [print(a, 'private' if i.ip_address(a).is_private else 'public', 'linklocal' if i.ip_address(a).is_link_local else '', 'multicast' if i.ip_address(a).is_multicast else '') for a in ['172.31.5.1','169.254.8.9','100.66.1.1','224.0.0.5','203.0.113.7']]"</code></pre>
<p class="ghi-chu">Python báo 100.66.1.1 là private, vì không gian RFC 6598 được coi là không tới được từ toàn cầu. Ý nghĩa thực tế thì như nhau: không ai trên Internet định tuyến tới nó được.</p></div>`,
    ),

    bi(
      `<div class="note-ct"><h3>💬 The school's constructive questions — session 30</h3>
<p><strong>The published table leaves session 30 blank.</strong> It lists CQ11.1 at session 31, CQ11.2 at 32, CQ11.3 at 33 and CQ12.1 at 34, with no entry for session 30 at all — one of eight sessions (6, 9, 15, 16, 22, 30, 36, 56) where the column is empty. We report that as published and do not invent a school question to fill it.</p>
<p><strong>Stranger still:</strong> three of the four questions in this chapter's range ask about <em>this</em> session's material while being assigned to later ones. CQ11.2 (session 32) asks about unicast, broadcast and multicast — section 10.2, taught here. CQ11.3 (session 33) asks how many types of IPv4 address there are — section 10.3, taught here. CQ12.1 (session 34, the Midterm) asks what the structure of an IPv4 address is — section 10.1, taught here. The question numbering has drifted about one chapter behind the session plan since session 19, and this is where the drift is most visible.</p>
<p><strong>★ Two questions of our own for session 30,</strong> to fill the gap in the same spirit:</p>
<ul>
<li>Your machine and mine are on the same switch. Mine is 192.168.1.10/24 and yours is 192.168.1.200/26. Neither of us can reach the other. Explain the failure from each machine's point of view, and say which one is misconfigured.</li>
<li>Why does a subnet lose exactly two addresses, and name the one prefix where it loses none.</li>
</ul></div>`,
      `<div class="note-ct"><h3>💬 Câu hỏi kiến tạo của trường — buổi 30</h3>
<p><strong>Bảng đã công bố để trống buổi 30.</strong> Nó ghi CQ11.1 ở buổi 31, CQ11.2 ở buổi 32, CQ11.3 ở buổi 33 và CQ12.1 ở buổi 34, hoàn toàn không có mục nào cho buổi 30 — một trong tám buổi (6, 9, 15, 16, 22, 30, 36, 56) mà cột này bỏ trống. Chúng tôi nêu đúng như bảng công bố và không bịa ra một câu hỏi của trường để lấp vào.</p>
<p><strong>Lạ hơn nữa:</strong> ba trong bốn câu hỏi thuộc phạm vi chương này đều hỏi về nội dung của <em>chính</em> buổi 30 trong khi lại được gán cho các buổi sau. CQ11.2 (buổi 32) hỏi về unicast, broadcast và multicast — mục 10.2, dạy ở đây. CQ11.3 (buổi 33) hỏi có mấy loại địa chỉ IPv4 — mục 10.3, dạy ở đây. CQ12.1 (buổi 34, tức buổi thi giữa kỳ) hỏi cấu trúc một địa chỉ IPv4 là gì — mục 10.1, dạy ở đây. Cách đánh số câu hỏi đã trôi chậm hơn kế hoạch buổi học khoảng một chương kể từ buổi 19, và đây là chỗ độ trôi ấy lộ rõ nhất.</p>
<p><strong>★ Hai câu của chúng tôi cho buổi 30,</strong> để lấp chỗ trống theo đúng tinh thần đó:</p>
<ul>
<li>Máy bạn và máy tôi cắm cùng một con switch. Máy tôi là 192.168.1.10/24 còn máy bạn là 192.168.1.200/26. Không ai tới được ai. Hãy giải thích cái hỏng đó từ góc nhìn của từng máy, và nói máy nào bị cấu hình sai.</li>
<li>Vì sao một subnet mất đúng hai địa chỉ, và kể tên tiền tố duy nhất mà nó không mất cái nào.</li>
</ul></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 10.2 — session 31 ─────────────────────── */

const L2 = {
  title: '10.2 — Subnetting, VLSM and structured design (FLM session 31)|||10.2 — Chia subnet, VLSM và thiết kế có cấu trúc (buổi 31 của FLM)',
  slug: 'nwc204-10-2-chia-subnet-va-vlsm',
  type: 'DOCUMENT',
  description: 'Buổi 31: mượn bit là ý tưởng duy nhất của việc chia subnet, hai công thức 2^n và 2^h trừ 2 cùng câu hỏi mà mỗi cái trả lời, chia một /24 thành bốn /26 với bảng đầy đủ, chia /16 và /8 và mẹo tìm octet đáng chú ý, chia theo yêu cầu số host so với theo yêu cầu số subnet, VLSM từ chỗ chia đều bị hết chỗ đến vòng lặp bốn bước và lời giải đầy đủ cho 192.168.20.0/24, vì sao đường WAN dùng /30 hay /31, thiết kế có cấu trúc và tóm tắt tuyến, và cách dùng công cụ AI mà vẫn kiểm được. Mọi con số kiểm bằng python3.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 10 · Lesson 10.2 · FLM session 31 of 60 · CLO5, CLO9 · Cisco Module 11</span>
<h2>Cutting one network into many</h2>
<p class="lead">After this lesson you can take a network and a list of requirements, produce a complete VLSM addressing table largest-first, prove that no two blocks overlap, and explain to someone else why the block after a subnet starts where it does.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 31 — "10.5 Subnet an IPv4 · 10.6 Subnet a /16 and /8 Prefix · 10.7 Subnet to Meet Requirements · 10.8 Variable Length Subnet Masking · 10.9 Structured Design · 10.10 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Opening question.</strong> You are given 192.168.20.0/24 and five networks to address: 58 hosts, 28 hosts, 12 hosts, and two router-to-router links of 2 hosts each. A colleague suggests cutting the /24 into equal /26 blocks, "because 58 needs a /26 and that is the biggest". Do it their way and see what happens. Then explain, in one sentence, what went wrong and what it cost.</p>
<div class="callout warn">⚠️ <strong>A note on the school's question table.</strong> The published plan lists <strong>CQ11.1</strong> against this session, and its content is the words "Progress Test 2". That is not a question, and the course has only one Midterm Progress Test — at session 34. We quote the table as published rather than silently correcting it. See the discussion at the end of this lesson.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 11.</p>`,
      `<span class="eyebrow">NWC204 · Chương 10 · Bài 10.2 · Buổi 31/60 của FLM · CLO5, CLO9 · Cisco Module 11</span>
<h2>Cắt một mạng thành nhiều mạng</h2>
<p class="lead">Học xong bài này bạn cầm một mạng và một danh sách yêu cầu là dựng được một bảng địa chỉ VLSM hoàn chỉnh theo lối lớn-trước, chứng minh được không có hai khối nào chồng nhau, và giải thích được cho người khác vì sao khối sau một subnet lại bắt đầu ở đúng chỗ đó.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 31 — "10.5 Subnet an IPv4 · 10.6 Subnet a /16 and /8 Prefix · 10.7 Subnet to Meet Requirements · 10.8 Variable Length Subnet Masking · 10.9 Structured Design · 10.10 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Câu hỏi mở đầu.</strong> Bạn được cho 192.168.20.0/24 và năm mạng cần đánh địa chỉ: 58 host, 28 host, 12 host, và hai đường nối router-với-router mỗi đường 2 host. Một đồng nghiệp đề nghị cắt cái /24 thành các khối /26 đều nhau, "vì 58 thì cần một /26 mà đó là cái lớn nhất". Hãy làm theo cách của họ và xem chuyện gì xảy ra. Rồi giải thích trong một câu: sai ở đâu và cái giá là gì.</p>
<div class="callout warn">⚠️ <strong>Một ghi chú về bảng câu hỏi của trường.</strong> Kế hoạch đã công bố ghi <strong>CQ11.1</strong> cho buổi này, và nội dung của nó là mấy chữ "Progress Test 2". Đó không phải một câu hỏi, và môn chỉ có một Midterm Progress Test — ở buổi 34. Chúng tôi trích bảng đúng như công bố thay vì lặng lẽ sửa nó. Xem phần bàn ở cuối bài.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 11.</p>`,
    ),

    walkHead('nwc204-ch10', 16, 27,
      'Slides 16–27 cover FLM session 31: 10.5 to 10.7 subnetting, 10.8 VLSM, 10.9 structured design, 10.10 AI tools.',
      'Slide 16–27 là buổi 31 của FLM: 10.5 đến 10.7 chia subnet, 10.8 VLSM, 10.9 thiết kế có cấu trúc, 10.10 công cụ AI.'),

    walk('nwc204-ch10', [
      [16, 'What session 31 covers, and the anomaly in its question',
        `<p>Six sections in one session, and they are not six ideas — they are one idea at increasing scale, plus a design discussion.</p>
<ul>
<li><strong>10.5</strong> Subnet an IPv4 network — borrowing bits.</li>
<li><strong>10.6</strong> Subnet a /16 and a /8 prefix — the same operation with more room.</li>
<li><strong>10.7</strong> Subnet to meet requirements — start from need, not from a table.</li>
<li><strong>10.8</strong> Variable Length Subnet Masking — the part that separates passing from fluent.</li>
<li><strong>10.9</strong> Structured design — addressing a human can still read in three years.</li>
<li><strong>10.10</strong> Integrate AI tools for explaining concepts (self learning).</li>
</ul>
<p><strong>The anomaly.</strong> The school's constructive-question table puts CQ11.1 on this session, and CQ11.1 reads "Progress Test 2". The course schedule has exactly one Midterm Progress Test, at session 34, and no second progress test anywhere in the sixty sessions. This is one of several places where the question table has drifted out of step with the session plan; we note it and move on.</p>`,
        `<p>Sáu mục trong một buổi, và chúng không phải sáu ý tưởng — chúng là một ý tưởng ở quy mô tăng dần, cộng thêm một phần bàn về thiết kế.</p>
<ul>
<li><strong>10.5</strong> Chia subnet một mạng IPv4 — mượn bit.</li>
<li><strong>10.6</strong> Chia subnet một tiền tố /16 và /8 — cùng thao tác đó với nhiều chỗ hơn.</li>
<li><strong>10.7</strong> Chia subnet theo yêu cầu — xuất phát từ nhu cầu, không từ một cái bảng.</li>
<li><strong>10.8</strong> Variable Length Subnet Masking — phần tách người vừa đủ qua môn khỏi người thật sự thạo.</li>
<li><strong>10.9</strong> Thiết kế có cấu trúc — đánh địa chỉ sao cho ba năm sau người ta còn đọc được.</li>
<li><strong>10.10</strong> Tích hợp công cụ AI để giải thích khái niệm (tự học).</li>
</ul>
<p><strong>Chỗ bất thường.</strong> Bảng câu hỏi kiến tạo của trường đặt CQ11.1 vào buổi này, và nội dung CQ11.1 là "Progress Test 2". Lịch môn có đúng một Midterm Progress Test, ở buổi 34, và không có bài kiểm tra tiến độ thứ hai nào trong suốt sáu mươi buổi. Đây là một trong vài chỗ mà bảng câu hỏi đã lệch nhịp với kế hoạch buổi học; chúng tôi ghi nhận rồi đi tiếp.</p>`],

      [17, '10.5 Borrowing bits — the only idea here',
        `<p>Subnetting is one operation: move the network/host boundary to the right, taking bits from the host portion and giving them to the network portion.</p>
<p>Start with 192.168.1.0/24 — 24 network bits, 8 host bits, 254 usable hosts, one network. Borrow two bits and it becomes /26 — 26 network bits, 6 host bits. Those two borrowed bits can hold four values (00, 01, 10, 11), which is why you now have <strong>four</strong> networks, each with 2^6 &minus; 2 = <strong>62</strong> hosts.</p>
<p><strong>The accounting.</strong> Before: 254 usable. After: 4 &times; 62 = 248 usable. You lost six addresses, which is two per new subnet. That is the price of the split, and it is worth naming out loud because it is the reason not to subnet more finely than you need.</p>
<p>Nothing was created. There were 32 bits before and 32 bits after. You only chose where to spend them.</p>`,
        `<p>Chia subnet là một thao tác: dịch ranh giới mạng/host sang phải, lấy bit từ phần host đưa cho phần mạng.</p>
<p>Bắt đầu với 192.168.1.0/24 — 24 bit mạng, 8 bit host, 254 host dùng được, một mạng. Mượn hai bit thì nó thành /26 — 26 bit mạng, 6 bit host. Hai bit mượn đó giữ được bốn giá trị (00, 01, 10, 11), và đó là lý do bây giờ bạn có <strong>bốn</strong> mạng, mỗi mạng 2^6 &minus; 2 = <strong>62</strong> host.</p>
<p><strong>Tính sổ.</strong> Trước: 254 dùng được. Sau: 4 &times; 62 = 248 dùng được. Bạn mất sáu địa chỉ, tức hai cái cho mỗi subnet mới. Đó là cái giá của việc cắt, và đáng gọi tên nó ra vì đó là lý do đừng chia nhỏ hơn mức bạn cần.</p>
<p>Không có gì được tạo ra cả. Trước là 32 bit, sau vẫn là 32 bit. Bạn chỉ chọn cách tiêu chúng.</p>`],

      [18, 'The two formulas, and the question each one answers',
        `<p>There are exactly two, and confusing them is the most common exam mistake in the whole course.</p>
<div class="formula">2^n = number of subnets, where n = bits BORROWED</div>
<div class="formula">2^h &minus; 2 = usable hosts per subnet, where h = bits REMAINING</div>
<p><strong>Read the question before touching a number.</strong> "How many subnets do I get?" uses the first. "How many hosts fit in each?" uses the second. "I need at least six networks" is a subnets-first question; "I need at least 200 hosts" is a hosts-first question. They lead to different prefixes and there is no shortcut that covers both.</p>
<p><strong>A sanity check that always works.</strong> n + h + (original prefix) = 32. If your two numbers do not add up with the prefix to 32, one of them is wrong. For a /24 borrowed to /26: 2 + 6 + 24 = 32. For a /16 borrowed to /20: 4 + 12 + 16 = 32. Doing that addition takes one second and catches most arithmetic slips before they propagate through a whole table.</p>`,
        `<p>Có đúng hai công thức, và nhầm lẫn giữa chúng là lỗi thi hay gặp nhất của cả môn.</p>
<div class="formula">2^n = số subnet, với n = số bit ĐÃ MƯỢN</div>
<div class="formula">2^h &minus; 2 = số host dùng được mỗi subnet, với h = số bit CÒN LẠI</div>
<p><strong>Đọc câu hỏi trước khi đụng vào con số nào.</strong> "Tôi được bao nhiêu subnet?" thì dùng cái đầu. "Mỗi cái chứa bao nhiêu host?" thì dùng cái sau. "Tôi cần ít nhất sáu mạng" là câu hỏi theo-số-subnet; "tôi cần ít nhất 200 host" là câu hỏi theo-số-host. Chúng dẫn tới hai tiền tố khác nhau và không có lối tắt nào phủ được cả hai.</p>
<p><strong>Một phép kiểm tỉnh táo luôn đúng.</strong> n + h + (tiền tố ban đầu) = 32. Nếu hai con số của bạn cộng với tiền tố mà không ra 32 thì một trong hai sai. Với /24 mượn thành /26: 2 + 6 + 24 = 32. Với /16 mượn thành /20: 4 + 12 + 16 = 32. Làm phép cộng đó mất một giây và bắt được phần lớn lỗi số học trước khi chúng lan ra cả cái bảng.</p>`],

      [19, '10.5 worked — 192.168.1.0/24 into four /26',
        `<p>Block size = 256 &minus; 192 = 64, so the four networks are at .0, .64, .128 and .192. That is the whole calculation; the rest of the table follows mechanically.</p>
<table>
<thead><tr><th>#</th><th>Network</th><th>First host</th><th>Last host</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>0</td><td>192.168.1.0</td><td>192.168.1.1</td><td>192.168.1.62</td><td>192.168.1.63</td></tr>
<tr><td>1</td><td>192.168.1.64</td><td>192.168.1.65</td><td>192.168.1.126</td><td>192.168.1.127</td></tr>
<tr><td>2</td><td>192.168.1.128</td><td>192.168.1.129</td><td>192.168.1.190</td><td>192.168.1.191</td></tr>
<tr><td>3</td><td>192.168.1.192</td><td>192.168.1.193</td><td>192.168.1.254</td><td>192.168.1.255</td></tr>
</tbody></table>
<p><strong>Three patterns worth noticing,</strong> because they are the self-checks that catch a broken table.</p>
<ul>
<li>Each row's broadcast is the next row's network <em>minus one</em>. There is no gap anywhere; the blocks are contiguous by construction.</li>
<li>The last broadcast is .255, the end of the original /24. If it is not, something is wrong.</li>
<li>Every network address is even and every broadcast is odd, for any prefix shorter than /31.</li>
</ul>`,
        `<p>Kích thước khối = 256 &minus; 192 = 64, nên bốn mạng nằm ở .0, .64, .128 và .192. Đó là toàn bộ phép tính; phần còn lại của bảng suy ra một cách máy móc.</p>
<table>
<thead><tr><th>#</th><th>Mạng</th><th>Host đầu</th><th>Host cuối</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>0</td><td>192.168.1.0</td><td>192.168.1.1</td><td>192.168.1.62</td><td>192.168.1.63</td></tr>
<tr><td>1</td><td>192.168.1.64</td><td>192.168.1.65</td><td>192.168.1.126</td><td>192.168.1.127</td></tr>
<tr><td>2</td><td>192.168.1.128</td><td>192.168.1.129</td><td>192.168.1.190</td><td>192.168.1.191</td></tr>
<tr><td>3</td><td>192.168.1.192</td><td>192.168.1.193</td><td>192.168.1.254</td><td>192.168.1.255</td></tr>
</tbody></table>
<p><strong>Ba quy luật đáng để ý,</strong> vì đó là các phép tự kiểm bắt được một cái bảng bị hỏng.</p>
<ul>
<li>Broadcast của mỗi dòng là địa chỉ mạng của dòng kế tiếp <em>trừ một</em>. Không có khoảng hở nào; các khối liền nhau theo đúng cách dựng.</li>
<li>Broadcast cuối cùng là .255, tức điểm cuối của cái /24 ban đầu. Nếu không phải thì có gì đó sai.</li>
<li>Mọi địa chỉ mạng đều chẵn và mọi broadcast đều lẻ, với bất kỳ tiền tố nào ngắn hơn /31.</li>
</ul>`],

      [20, '10.6 The same mechanics on a /16 and a /8',
        `<p>Nothing new happens — only the octet the block lands in changes.</p>
<p><strong>172.16.0.0/16 borrowed to /20.</strong> Four bits borrowed, so 2^4 = 16 subnets. Twelve host bits remain, so 2^12 &minus; 2 = 4,094 hosts each. The mask is 255.255.240.0, so the interesting octet is the <em>third</em> and the block is 256 &minus; 240 = 16. The subnets are 172.16.0.0, 172.16.16.0, 172.16.32.0 ... up to 172.16.240.0, whose broadcast is 172.16.255.255.</p>
<p><strong>10.0.0.0/8 borrowed to /14.</strong> Six bits borrowed, 2^6 = 64 subnets. Eighteen host bits remain, 2^18 &minus; 2 = 262,142 hosts each. Mask 255.252.0.0, interesting octet is the <em>second</em>, block is 256 &minus; 252 = 4. Subnets at 10.0.0.0, 10.4.0.0, 10.8.0.0 and so on.</p>
<p><strong>The method, stated once for any prefix.</strong> Find the octet where the mask is neither 255 nor 0 — call it the interesting octet. Everything to its left is fixed. Everything to its right is host space. The block size applies inside the interesting octet. That single rule handles /9 through /30 without any special cases.</p>`,
        `<p>Không có gì mới xảy ra cả — chỉ đổi cái octet mà khối rơi vào.</p>
<p><strong>172.16.0.0/16 mượn thành /20.</strong> Mượn bốn bit, nên 2^4 = 16 subnet. Còn lại mười hai bit host, nên 2^12 &minus; 2 = 4.094 host mỗi cái. Mặt nạ là 255.255.240.0, nên octet đáng chú ý là octet <em>thứ ba</em> và khối là 256 &minus; 240 = 16. Các subnet là 172.16.0.0, 172.16.16.0, 172.16.32.0 ... đến 172.16.240.0, mà broadcast của nó là 172.16.255.255.</p>
<p><strong>10.0.0.0/8 mượn thành /14.</strong> Mượn sáu bit, 2^6 = 64 subnet. Còn mười tám bit host, 2^18 &minus; 2 = 262.142 host mỗi cái. Mặt nạ 255.252.0.0, octet đáng chú ý là octet <em>thứ hai</em>, khối là 256 &minus; 252 = 4. Subnet ở 10.0.0.0, 10.4.0.0, 10.8.0.0 và cứ thế.</p>
<p><strong>Phương pháp, phát biểu một lần cho mọi tiền tố.</strong> Tìm octet mà mặt nạ không phải 255 cũng không phải 0 — gọi nó là octet đáng chú ý. Mọi thứ bên trái nó là cố định. Mọi thứ bên phải nó là không gian host. Kích thước khối áp dụng bên trong octet đáng chú ý. Đúng một quy tắc đó xử được từ /9 tới /30 mà không có trường hợp đặc biệt nào.</p>`],

      [21, '10.7 Start from the requirement, not from a table',
        `<p>Two shapes of question, two different procedures, and reading which one you have been asked is half the mark.</p>
<p><strong>Hosts-first.</strong> "The floor needs 200 hosts." Try prefixes until one fits: 2^7 &minus; 2 = 126, too small. 2^8 &minus; 2 = 254, fits. Answer: /24. You always round <em>up</em> to the next size that fits, because a subnet one address too small is useless.</p>
<p><strong>Subnets-first.</strong> "We need six separate networks out of one /24." Try borrowed bits: 2^2 = 4, not enough. 2^3 = 8, enough. Borrow 3, so /27, giving 8 subnets of 30 hosts. Two of the eight are spare, and that is fine — spares are growth room.</p>
<p><strong>The trap that lives between them.</strong> A question often gives both constraints: "six networks, the largest with 40 hosts, from one /24". Solve both and take the stricter. Six networks needs /27 or longer; 40 hosts needs 2^6 &minus; 2 = 62, so /26 or shorter. /27 gives 30 hosts — not enough for 40. /26 gives only 4 subnets — not enough for six. <strong>A single /24 cannot satisfy both</strong>, and saying so is the correct answer. VLSM is what you reach for next.</p>`,
        `<p>Hai dạng câu hỏi, hai quy trình khác nhau, và đọc ra mình đang được hỏi dạng nào đã là một nửa số điểm.</p>
<p><strong>Theo số host trước.</strong> "Tầng này cần 200 host." Thử các tiền tố cho tới khi vừa: 2^7 &minus; 2 = 126, quá nhỏ. 2^8 &minus; 2 = 254, vừa. Đáp án: /24. Luôn làm tròn <em>lên</em> tới cỡ kế tiếp còn vừa, vì một subnet thiếu một địa chỉ là một subnet vô dụng.</p>
<p><strong>Theo số subnet trước.</strong> "Chúng tôi cần sáu mạng riêng từ một /24." Thử số bit mượn: 2^2 = 4, không đủ. 2^3 = 8, đủ. Mượn 3, tức /27, được 8 subnet mỗi cái 30 host. Hai trong tám cái để dư, và như vậy là ổn — cái dư là chỗ để lớn lên.</p>
<p><strong>Cái bẫy nằm giữa hai dạng.</strong> Một câu hỏi thường cho cả hai ràng buộc: "sáu mạng, mạng lớn nhất 40 host, từ một /24". Giải cả hai rồi lấy cái chặt hơn. Sáu mạng cần /27 trở lên; 40 host cần 2^6 &minus; 2 = 62, tức /26 trở xuống. /27 cho 30 host — không đủ cho 40. /26 chỉ cho 4 subnet — không đủ cho sáu. <strong>Một cái /24 đơn thuần không thoả được cả hai</strong>, và nói ra điều đó chính là đáp án đúng. VLSM là thứ bạn với tới tiếp theo.</p>`],

      [22, '10.8 VLSM — why fixed-size subnetting runs out',
        `<p>Take the opening question seriously and do it the colleague's way. 192.168.20.0/24, five networks needing 58, 28, 12, 2 and 2 hosts. The largest needs a /26, so cut everything into /26 blocks.</p>
<p>A /24 contains exactly <strong>four</strong> /26 blocks. There are five networks. You run out on the fifth, and there is nothing left to give it.</p>
<p><strong>And look at what the first four cost.</strong> Sales uses 58 of its 62. Engineering uses 28 of 62, wasting 34. Admin uses 12 of 62, wasting 50. The WAN link uses 2 of 62, wasting 60. That is 144 addresses thrown away to still not have enough networks.</p>
<p><strong>The insight.</strong> Fixed-size subnetting forces every network to be as large as the largest one, which means every network smaller than the largest pays for space it cannot use. VLSM removes that constraint: subnet the /24 into blocks of different sizes, giving each network the size it actually needs. There is no new algorithm — VLSM is simply subnetting applied again to a subnet.</p>`,
        `<p>Hãy xem câu hỏi mở đầu một cách nghiêm túc và làm theo cách của người đồng nghiệp. 192.168.20.0/24, năm mạng cần 58, 28, 12, 2 và 2 host. Mạng lớn nhất cần một /26, vậy cắt tất cả thành khối /26.</p>
<p>Một cái /24 chứa đúng <strong>bốn</strong> khối /26. Mà có năm mạng. Bạn hết chỗ ở mạng thứ năm, và không còn gì để cho nó.</p>
<p><strong>Rồi nhìn xem bốn cái đầu tốn bao nhiêu.</strong> Kinh doanh dùng 58 trên 62. Kỹ thuật dùng 28 trên 62, phí 34. Hành chính dùng 12 trên 62, phí 50. Đường WAN dùng 2 trên 62, phí 60. Tức là vứt đi 144 địa chỉ mà vẫn không đủ số mạng.</p>
<p><strong>Chỗ vỡ lẽ.</strong> Chia đều bắt mọi mạng phải to bằng mạng to nhất, nghĩa là mọi mạng nhỏ hơn cái to nhất đều phải trả tiền cho phần chỗ mà nó không dùng được. VLSM gỡ bỏ ràng buộc đó: chia cái /24 thành những khối cỡ khác nhau, cho mỗi mạng đúng cỡ nó thật sự cần. Không có thuật toán mới nào — VLSM đơn giản là chia subnet áp dụng lại lên một subnet.</p>`],

      [23, '10.8 The method — four steps, repeated',
        `<p>The loop is short enough to memorise, and each step has exactly one thing that can go wrong.</p>
<ol>
<li><strong>Sort</strong> the requirements largest first: 58, 28, 12, 2, 2.</li>
<li><strong>Size</strong> each one: find the smallest h with 2^h &minus; 2 &ge; need, then the prefix is 32 &minus; h.</li>
<li><strong>Place</strong> it at the next free address.</li>
<li><strong>Advance</strong>: the next block starts at <em>this block's broadcast, plus one</em>.</li>
</ol>
<p><strong>Why largest first is not a style preference.</strong> A /26 must start at an address that is a multiple of 64. If you place a /30 at .0 first, the next free address is .4 — and there is no /26 that can start at .4. You would have to skip forward to .64 and waste the whole block from .4 to .63. Allocating largest first keeps every boundary naturally aligned, so nothing is ever skipped.</p>
<p><strong>Step 4 is where marks are lost.</strong> The next block starts after the <em>broadcast</em>, not after the last host. For a /26 at .0: last host is .62, broadcast is .63, next block starts at <strong>.64</strong>. Starting at .63 puts two subnets one address apart and they overlap. Nothing warns you; some hosts simply become unreachable.</p>`,
        `<p>Vòng lặp đủ ngắn để thuộc, và mỗi bước có đúng một chỗ có thể sai.</p>
<ol>
<li><strong>Sắp xếp</strong> các yêu cầu theo thứ tự lớn trước: 58, 28, 12, 2, 2.</li>
<li><strong>Định cỡ</strong> từng cái: tìm h nhỏ nhất sao cho 2^h &minus; 2 &ge; nhu cầu, rồi tiền tố là 32 &minus; h.</li>
<li><strong>Đặt</strong> nó vào địa chỉ trống kế tiếp.</li>
<li><strong>Tiến lên</strong>: khối kế tiếp bắt đầu ở <em>broadcast của khối này, cộng một</em>.</li>
</ol>
<p><strong>Vì sao lớn-trước không phải là chuyện gu thẩm mỹ.</strong> Một /26 buộc phải bắt đầu ở một địa chỉ là bội của 64. Nếu bạn đặt một /30 ở .0 trước thì địa chỉ trống kế tiếp là .4 — và không có cái /26 nào bắt đầu được ở .4. Bạn sẽ phải nhảy tới .64 và phí trọn khối từ .4 tới .63. Cấp phát lớn-trước giữ cho mọi ranh giới tự nhiên thẳng hàng, nên không bao giờ phải bỏ qua cái gì.</p>
<p><strong>Bước 4 là chỗ mất điểm.</strong> Khối kế tiếp bắt đầu sau <em>broadcast</em>, không phải sau host cuối. Với một /26 ở .0: host cuối là .62, broadcast là .63, khối kế tiếp bắt đầu ở <strong>.64</strong>. Bắt đầu ở .63 thì hai subnet lệch nhau một địa chỉ và chúng chồng lên nhau. Không có gì cảnh báo bạn; chỉ là vài host đơn giản trở nên không tới được.</p>`],

      [24, '10.8 worked in full — 192.168.20.0/24',
        `<p>Apply the four steps to the five requirements, in order.</p>
<table>
<thead><tr><th>Network</th><th>Need</th><th>h</th><th>Prefix</th><th>Subnet</th><th>Host range</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>Sales</td><td>58</td><td>6</td><td>/26</td><td>192.168.20.0</td><td>.1 &ndash; .62</td><td>.63</td></tr>
<tr><td>Engineering</td><td>28</td><td>5</td><td>/27</td><td>192.168.20.64</td><td>.65 &ndash; .94</td><td>.95</td></tr>
<tr><td>Admin</td><td>12</td><td>4</td><td>/28</td><td>192.168.20.96</td><td>.97 &ndash; .110</td><td>.111</td></tr>
<tr><td>WAN R1&ndash;R2</td><td>2</td><td>2</td><td>/30</td><td>192.168.20.112</td><td>.113 &ndash; .114</td><td>.115</td></tr>
<tr><td>WAN R2&ndash;R3</td><td>2</td><td>2</td><td>/30</td><td>192.168.20.116</td><td>.117 &ndash; .118</td><td>.119</td></tr>
</tbody></table>
<p><strong>Read the advance step down the table:</strong> .63 then .64, .95 then .96, .111 then .112, .115 then .116. Every subnet starts exactly one after the previous broadcast. If any row breaks that pattern, that row is wrong.</p>
<p><strong>The result.</strong> All five networks fit in 120 of 256 addresses, leaving <strong>136 free</strong> and contiguous from .120 to .255 — enough room for another department without redesigning anything. Compare that with the fixed-/26 attempt, which ran out at four networks and wasted 144 addresses.</p>`,
        `<p>Áp bốn bước vào năm yêu cầu, theo đúng thứ tự.</p>
<table>
<thead><tr><th>Mạng</th><th>Cần</th><th>h</th><th>Tiền tố</th><th>Subnet</th><th>Dải host</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>Kinh doanh</td><td>58</td><td>6</td><td>/26</td><td>192.168.20.0</td><td>.1 &ndash; .62</td><td>.63</td></tr>
<tr><td>Kỹ thuật</td><td>28</td><td>5</td><td>/27</td><td>192.168.20.64</td><td>.65 &ndash; .94</td><td>.95</td></tr>
<tr><td>Hành chính</td><td>12</td><td>4</td><td>/28</td><td>192.168.20.96</td><td>.97 &ndash; .110</td><td>.111</td></tr>
<tr><td>WAN R1&ndash;R2</td><td>2</td><td>2</td><td>/30</td><td>192.168.20.112</td><td>.113 &ndash; .114</td><td>.115</td></tr>
<tr><td>WAN R2&ndash;R3</td><td>2</td><td>2</td><td>/30</td><td>192.168.20.116</td><td>.117 &ndash; .118</td><td>.119</td></tr>
</tbody></table>
<p><strong>Hãy đọc bước tiến-lên dọc theo bảng:</strong> .63 rồi .64, .95 rồi .96, .111 rồi .112, .115 rồi .116. Mỗi subnet bắt đầu đúng một đơn vị sau broadcast của cái trước. Dòng nào phá vỡ quy luật đó thì dòng đó sai.</p>
<p><strong>Kết quả.</strong> Cả năm mạng vừa trong 120 trên 256 địa chỉ, còn lại <strong>136 địa chỉ trống</strong> và liền mạch từ .120 tới .255 — đủ chỗ cho thêm một phòng ban mà không phải thiết kế lại gì cả. So với cách chia đều /26, vốn hết chỗ ở mạng thứ tư và phí 144 địa chỉ.</p>`],

      [25, 'Why a WAN link gets a /30, or a /31',
        `<p>A point-to-point link has exactly two interfaces. Ever. So the question is how small a block can legally hold two hosts.</p>
<ul>
<li><strong>/30</strong> gives four addresses: network, two hosts, broadcast. Two of four are overhead — 50% waste — but it is legal everywhere and it is what Lab 2.2 expects.</li>
<li><strong>/31</strong> gives two addresses and, under RFC 3021, has no network and no broadcast. Both addresses are usable. Zero waste.</li>
<li><strong>/24 on a WAN link</strong> burns 254 addresses to connect two routers, and you will see it in real networks built by people who never did this chapter.</li>
</ul>
<p><strong>Which to use.</strong> /31 is standard on modern router-to-router links and saves real address space at scale — a service provider with ten thousand links saves twenty thousand addresses. But Packet Tracer and older IOS images may reject it. <strong>Use /30 for Lab 2.2</strong>, and know /31 exists so that you are not confused the first time you see one in production.</p>
<p>★ The same logic explains <strong>/32</strong>: a single address with no room for anyone else, used for router loopback interfaces and for a host route that says "to reach exactly this one machine, go this way".</p>`,
        `<p>Một đường nối điểm-điểm có đúng hai cổng. Luôn luôn. Nên câu hỏi là một khối nhỏ tới mức nào thì còn chứa hợp lệ được hai host.</p>
<ul>
<li><strong>/30</strong> cho bốn địa chỉ: mạng, hai host, broadcast. Hai trên bốn là phần thừa — phí 50% — nhưng nó hợp lệ ở mọi nơi và là thứ Lab 2.2 mong đợi.</li>
<li><strong>/31</strong> cho hai địa chỉ và, theo RFC 3021, không có địa chỉ mạng cũng không có broadcast. Cả hai địa chỉ đều dùng được. Không phí chút nào.</li>
<li><strong>/24 cho một đường WAN</strong> đốt 254 địa chỉ để nối hai con router, và bạn sẽ gặp chuyện đó trong mạng thật do những người chưa từng học chương này dựng lên.</li>
</ul>
<p><strong>Dùng cái nào.</strong> /31 là chuẩn trên các đường router-với-router hiện đại và tiết kiệm không gian địa chỉ thật ở quy mô lớn — một nhà cung cấp dịch vụ có mười nghìn đường tiết kiệm được hai mươi nghìn địa chỉ. Nhưng Packet Tracer và các bản IOS cũ có thể từ chối nó. <strong>Dùng /30 cho Lab 2.2</strong>, và biết rằng /31 tồn tại để lần đầu gặp nó trong môi trường thật thì bạn không bối rối.</p>
<p>★ Cùng lối suy luận đó giải thích <strong>/32</strong>: một địa chỉ đơn lẻ không còn chỗ cho ai khác, dùng cho cổng loopback của router và cho một tuyến tới host, nói rằng "muốn tới đúng cái máy này thì đi lối này".</p>`],

      [26, '10.9 Structured design — addressing a human can read',
        `<p>Subnetting correctly is arithmetic. Designing an address plan is a different skill, and four habits cover most of it.</p>
<ul>
<li><strong>Encode meaning in the octets.</strong> 10.20.x for floor 2, 10.30.x for floor 3. A log line then identifies a location without anyone opening a spreadsheet.</li>
<li><strong>Keep each site's blocks contiguous.</strong> This is what makes summarisation possible.</li>
<li><strong>Leave room after each block.</strong> Allocate by need, but place blocks so each can grow into the gap that follows it.</li>
<li><strong>Reserve a pattern inside every subnet.</strong> .1 is the gateway, .2 to .9 are infrastructure, .10 upward is the DHCP pool. The same everywhere, so nobody has to ask.</li>
</ul>
<p><strong>Summarisation is the payoff.</strong> Four contiguous /24 networks — 10.20.0.0, 10.20.1.0, 10.20.2.0 and 10.20.3.0 — can be advertised as a single route, 10.20.0.0/22, because they share the first 22 bits. One routing table entry instead of four. Scale that to a network with hundreds of subnets and the difference is between a routing table a router can hold comfortably and one it cannot.</p>
<p>Scattered allocations cannot be summarised, ever. That is the real cost of an unplanned address scheme, and it is paid years later by someone else.</p>`,
        `<p>Chia subnet cho đúng là số học. Thiết kế một sơ đồ địa chỉ lại là một kỹ năng khác, và bốn thói quen sau phủ gần hết.</p>
<ul>
<li><strong>Mã hoá ý nghĩa vào các octet.</strong> 10.20.x cho tầng 2, 10.30.x cho tầng 3. Khi đó một dòng log tự nói ra vị trí mà không ai phải mở bảng tính.</li>
<li><strong>Giữ các khối của mỗi cơ sở liền mạch.</strong> Đây là thứ làm cho việc tóm tắt tuyến trở nên khả thi.</li>
<li><strong>Chừa chỗ sau mỗi khối.</strong> Cấp phát theo nhu cầu, nhưng đặt các khối sao cho mỗi cái lớn lên được vào khoảng trống ngay sau nó.</li>
<li><strong>Đặt một quy ước trong mọi subnet.</strong> .1 là cổng ra, .2 đến .9 là hạ tầng, từ .10 trở lên là dải DHCP. Ở đâu cũng vậy, nên không ai phải đi hỏi.</li>
</ul>
<p><strong>Tóm tắt tuyến là phần thưởng.</strong> Bốn mạng /24 liền nhau — 10.20.0.0, 10.20.1.0, 10.20.2.0 và 10.20.3.0 — quảng bá được thành một tuyến duy nhất, 10.20.0.0/22, vì chúng chung 22 bit đầu. Một dòng trong bảng định tuyến thay vì bốn. Nhân chuyện đó lên một mạng có hàng trăm subnet thì khác biệt là giữa một bảng định tuyến router chứa thoải mái và một bảng nó không chứa nổi.</p>
<p>Cấp phát rải rác thì không bao giờ tóm tắt được. Đó là cái giá thật của một sơ đồ địa chỉ không có kế hoạch, và nó được trả nhiều năm sau, bởi một người khác.</p>`],

      [27, '10.10 Using AI tools, and checking them',
        `<p>The syllabus asks for this explicitly, as a self-learning item, so here is how to do it in a way that is actually worth marks.</p>
<p><strong>Good uses.</strong> "Explain why 2^h &minus; 2 subtracts two." "Check this VLSM table for overlaps and tell me which rows conflict." "Give me five practice questions on /27 subnetting with answers." These use the tool for explanation and for generating practice — both of which you can verify.</p>
<p><strong>Bad use.</strong> "Subnet 192.168.20.0/24 for these five departments," followed by pasting the answer into the lab without checking a single boundary.</p>
<p><strong>Why the bad use is genuinely dangerous here.</strong> A language model produces subnet tables that are <em>plausible</em> and sometimes wrong, and a wrong broadcast address reads exactly like a right one. There is no syntax error, no red underline, nothing that looks off. The table is confidently formatted and quietly incorrect, and you find out during the lab assessment.</p>
<p><strong>So verify, every time.</strong> One command per row settles it, and the habit is the point — this whole course teaches checking the checker rather than trusting a green-looking answer.</p>`,
        `<p>Syllabus yêu cầu mục này một cách tường minh, dưới dạng tự học, nên đây là cách làm nó sao cho thật sự đáng điểm.</p>
<p><strong>Cách dùng tốt.</strong> "Giải thích vì sao 2^h &minus; 2 lại trừ đi hai." "Kiểm bảng VLSM này xem có chồng lấn không và chỉ ra dòng nào xung đột." "Cho tôi năm câu luyện tập về chia /27 kèm đáp án." Mấy cách này dùng công cụ để giải thích và để sinh bài luyện — cả hai đều kiểm chứng được.</p>
<p><strong>Cách dùng dở.</strong> "Chia 192.168.20.0/24 cho năm phòng ban này giúp tôi", rồi dán đáp án vào bài lab mà không kiểm một ranh giới nào.</p>
<p><strong>Vì sao cách dùng dở ở đây thật sự nguy hiểm.</strong> Một mô hình ngôn ngữ sinh ra những bảng subnet <em>trông hợp lý</em> và đôi khi sai, mà một địa chỉ broadcast sai thì đọc lên y hệt một cái đúng. Không có lỗi cú pháp, không có gạch chân đỏ, không có gì trông lạ cả. Cái bảng được trình bày đầy tự tin và sai một cách lặng lẽ, rồi bạn phát hiện ra lúc đang bị chấm lab.</p>
<p><strong>Nên hãy kiểm, mọi lần.</strong> Mỗi dòng một câu lệnh là xong, và bản thân cái thói quen mới là điều đáng nói — cả môn này dạy chuyện kiểm lại bộ kiểm thay vì tin một đáp án nhìn có vẻ xanh.</p>`],
    ]),

    bi(
      `<h3>🗺️ The VLSM loop, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["Sort all requirements<br/>LARGEST first"] --> B["Take the next requirement N"]
  B --> C["Smallest h with<br/>2^h - 2 >= N<br/>prefix = 32 - h"]
  C --> D["Place block at the<br/>next free address"]
  D --> E["next free = this block's<br/>BROADCAST + 1"]
  E --> F{"Any requirement left?"}
  F -->|"yes"| B
  F -->|"no — done"| G["Verify: no two blocks overlap<br/>python3 ipaddress"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class F ask
  class A,B,C,D,E act
  class G ok</code></pre>
<p>The final box is not decoration. A VLSM table that has not been checked for overlaps is a table you believe rather than a table you know.</p>`,
      `<h3>🗺️ Vòng lặp VLSM, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Sắp mọi yêu cầu<br/>LỚN TRƯỚC"] --> B["Lấy yêu cầu kế tiếp N"]
  B --> C["h nhỏ nhất sao cho<br/>2^h - 2 >= N<br/>tiền tố = 32 - h"]
  C --> D["Đặt khối vào<br/>địa chỉ trống kế tiếp"]
  D --> E["trống kế tiếp = BROADCAST<br/>của khối này + 1"]
  E --> F{"Còn yêu cầu nào không?"}
  F -->|"còn"| B
  F -->|"hết — xong"| G["Nghiệm thu: không khối nào chồng nhau<br/>python3 ipaddress"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class F ask
  class A,B,C,D,E act
  class G ok</code></pre>
<p>Cái hộp cuối cùng không phải đồ trang trí. Một bảng VLSM chưa được kiểm chồng lấn là một bảng bạn tin, chứ không phải một bảng bạn biết.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — prove your own table</h3>
<p>Write the table by hand first. Then let the machine try to break it. This script checks every pair of blocks for overlap and reports the total used.</p>
<pre><code class="language-bash">python3 - &lt;&lt;'PY'
import ipaddress as ip
plan = [("Sales",58),("Engineering",28),("Admin",12),("WAN R1-R2",2),("WAN R2-R3",2)]
cur, rows = ip.ip_address('192.168.20.0'), []
for name, need in plan:
    h = 1
    while 2**h - 2 &lt; need: h += 1
    net = ip.ip_network(str(cur) + '/' + str(32-h))
    rows.append((name, net))
    print(name, net, net.network_address+1, '-', net.broadcast_address-1, 'bcast', net.broadcast_address)
    cur = net.broadcast_address + 1
for i in range(len(rows)):
    for j in range(i+1, len(rows)):
        assert not rows[i][1].overlaps(rows[j][1]), (rows[i], rows[j])
print('no overlap; used', sum(r[1].num_addresses for r in rows), 'of 256')
PY</code></pre>
<pre><code class="language-plaintext">Sales 192.168.20.0/26 192.168.20.1 - 192.168.20.62 bcast 192.168.20.63
Engineering 192.168.20.64/27 192.168.20.65 - 192.168.20.94 bcast 192.168.20.95
Admin 192.168.20.96/28 192.168.20.97 - 192.168.20.110 bcast 192.168.20.111
WAN R1-R2 192.168.20.112/30 192.168.20.113 - 192.168.20.114 bcast 192.168.20.115
WAN R2-R3 192.168.20.116/30 192.168.20.117 - 192.168.20.118 bcast 192.168.20.119
no overlap; used 120 of 256</code></pre>
<div class="callout ok"><strong>What each result means.</strong> If the script prints your table, the arithmetic is right. If <code>ip_network</code> raises <em>has host bits set</em>, you placed a block at an address that is not a legal boundary for its prefix — almost always the "advance" step off by one. If the assertion fails, it names the two blocks that overlap.</div>`,
      `<h3>🔍 Cách tự kiểm — tự chứng minh bảng của mình</h3>
<p>Viết cái bảng bằng tay trước đã. Rồi để máy thử đập nó. Đoạn script này kiểm mọi cặp khối xem có chồng nhau không và báo tổng số địa chỉ đã dùng.</p>
<pre><code class="language-bash">python3 - &lt;&lt;'PY'
import ipaddress as ip
plan = [("Sales",58),("Engineering",28),("Admin",12),("WAN R1-R2",2),("WAN R2-R3",2)]
cur, rows = ip.ip_address('192.168.20.0'), []
for name, need in plan:
    h = 1
    while 2**h - 2 &lt; need: h += 1
    net = ip.ip_network(str(cur) + '/' + str(32-h))
    rows.append((name, net))
    print(name, net, net.network_address+1, '-', net.broadcast_address-1, 'bcast', net.broadcast_address)
    cur = net.broadcast_address + 1
for i in range(len(rows)):
    for j in range(i+1, len(rows)):
        assert not rows[i][1].overlaps(rows[j][1]), (rows[i], rows[j])
print('no overlap; used', sum(r[1].num_addresses for r in rows), 'of 256')
PY</code></pre>
<pre><code class="language-plaintext">Sales 192.168.20.0/26 192.168.20.1 - 192.168.20.62 bcast 192.168.20.63
Engineering 192.168.20.64/27 192.168.20.65 - 192.168.20.94 bcast 192.168.20.95
Admin 192.168.20.96/28 192.168.20.97 - 192.168.20.110 bcast 192.168.20.111
WAN R1-R2 192.168.20.112/30 192.168.20.113 - 192.168.20.114 bcast 192.168.20.115
WAN R2-R3 192.168.20.116/30 192.168.20.117 - 192.168.20.118 bcast 192.168.20.119
no overlap; used 120 of 256</code></pre>
<div class="callout ok"><strong>Mỗi kết quả nghĩa là gì.</strong> Nếu script in ra đúng bảng của bạn thì phép tính đúng. Nếu <code>ip_network</code> ném lỗi <em>has host bits set</em> thì bạn đã đặt một khối vào một địa chỉ không phải ranh giới hợp lệ cho tiền tố của nó — gần như luôn là bước "tiến lên" bị lệch một. Nếu phép assert hỏng thì nó chỉ đích danh hai khối chồng nhau.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — allocating smallest first.</strong> Place a /30 at .0 and the next free address is .4, where no /26 can legally start. <b>Symptom:</b> you either skip to .64 and waste 60 addresses, or you place the /26 at .4 and Python tells you it has host bits set. Always largest first.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — advancing from the last host instead of the broadcast.</strong> A /26 at .0 ends at broadcast .63, so the next block starts at .64. Starting at .63 makes two subnets overlap by one address. <b>Symptom:</b> no error anywhere, and one host — usually the gateway — is unreachable from one side.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — using 2^n when the question asked about hosts.</strong> Borrowing 3 bits gives 8 subnets, not 8 hosts. <b>Symptom:</b> an answer that is off by a factor of four or more and looks confidently wrong. The check n + h + prefix = 32 catches it instantly.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — designing for today's host count exactly.</strong> A department with 60 staff gets a /26 with 62 usable and is full after two hires. <b>Symptom:</b> a renumbering project. Size for the need, then place the blocks so each can grow into the space after it.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — forgetting that WAN links are networks too.</strong> Students routinely count only the LANs and then discover they have no addresses left for the router-to-router links. <b>Symptom:</b> a lab that is correct on paper and cannot be cabled. Count every segment between two routers as a requirement of 2.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — cấp phát nhỏ trước.</strong> Đặt một /30 ở .0 thì địa chỉ trống kế tiếp là .4, chỗ mà không /26 nào bắt đầu hợp lệ được. <b>Triệu chứng:</b> hoặc bạn nhảy tới .64 và phí 60 địa chỉ, hoặc bạn đặt /26 ở .4 và Python báo có bit host bị đặt. Luôn luôn lớn trước.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — tiến lên từ host cuối thay vì từ broadcast.</strong> Một /26 ở .0 kết thúc ở broadcast .63, nên khối kế tiếp bắt đầu ở .64. Bắt đầu ở .63 làm hai subnet chồng nhau đúng một địa chỉ. <b>Triệu chứng:</b> không có lỗi ở đâu cả, và một host — thường là cổng ra — không tới được từ một phía.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — dùng 2^n trong khi câu hỏi hỏi về host.</strong> Mượn 3 bit cho ra 8 subnet, không phải 8 host. <b>Triệu chứng:</b> một đáp án lệch bốn lần trở lên mà trông rất tự tin. Phép kiểm n + h + tiền tố = 32 bắt được nó ngay lập tức.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — thiết kế vừa khít số host của hôm nay.</strong> Một phòng ban 60 người được cấp một /26 với 62 chỗ dùng được và đầy sau khi tuyển thêm hai người. <b>Triệu chứng:</b> một dự án đánh số lại. Hãy định cỡ theo nhu cầu, rồi đặt các khối sao cho mỗi cái lớn lên được vào khoảng trống sau nó.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — quên rằng đường WAN cũng là mạng.</strong> Sinh viên thường chỉ đếm các LAN rồi mới phát hiện không còn địa chỉ nào cho các đường nối router-với-router. <b>Triệu chứng:</b> một bài lab đúng trên giấy mà không đi dây được. Hãy đếm mỗi đoạn giữa hai router là một yêu cầu 2 host.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> From 172.20.0.0/22, design a VLSM scheme for: Production 500 hosts, Office 200 hosts, Lab 100 hosts, Management 20 hosts, and one /30 WAN link. Give the full table and say how many addresses remain.</p>
<div class="dap-an"><p>A /22 has 1,024 addresses, from 172.20.0.0 to 172.20.3.255. Size each requirement first:</p>
<ul>
<li>500 hosts → 2^9 &minus; 2 = 510 → <b>/23</b> (512 addresses)</li>
<li>200 hosts → 2^8 &minus; 2 = 254 → <b>/24</b> (256)</li>
<li>100 hosts → 2^7 &minus; 2 = 126 → <b>/25</b> (128)</li>
<li>20 hosts → 2^5 &minus; 2 = 30 → <b>/27</b> (32)</li>
<li>WAN → <b>/30</b> (4)</li>
</ul>
<table>
<thead><tr><th>Network</th><th>Prefix</th><th>Subnet</th><th>Host range</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>Production</td><td>/23</td><td>172.20.0.0</td><td>172.20.0.1 &ndash; 172.20.1.254</td><td>172.20.1.255</td></tr>
<tr><td>Office</td><td>/24</td><td>172.20.2.0</td><td>172.20.2.1 &ndash; 172.20.2.254</td><td>172.20.2.255</td></tr>
<tr><td>Lab</td><td>/25</td><td>172.20.3.0</td><td>172.20.3.1 &ndash; 172.20.3.126</td><td>172.20.3.127</td></tr>
<tr><td>Management</td><td>/27</td><td>172.20.3.128</td><td>172.20.3.129 &ndash; 172.20.3.158</td><td>172.20.3.159</td></tr>
<tr><td>WAN</td><td>/30</td><td>172.20.3.160</td><td>172.20.3.161 &ndash; 172.20.3.162</td><td>172.20.3.163</td></tr>
</tbody></table>
<p>Used: 512 + 256 + 128 + 32 + 4 = <b>932</b>. Remaining: 1024 &minus; 932 = <b>92 addresses</b>, contiguous from 172.20.3.164 to 172.20.3.255.</p>
<p>The instructive step is Production: a /23 spans two whole third-octet values, so its broadcast is 172.20.<b>1</b>.255, not 172.20.0.255. Prefixes shorter than /24 make the third octet part of the host space.</p></div>

<p><b>E2.</b> Your colleague hands you this table for 10.5.0.0/24. Find every error without running anything, then verify.</p>
<pre><code class="language-plaintext">A  10.5.0.0/26    hosts .1-.63     bcast .63
B  10.5.0.63/27   hosts .64-.94    bcast .95
C  10.5.0.96/28   hosts .97-.110   bcast .111
D  10.5.0.112/30  hosts .113-.115  bcast .115</code></pre>
<div class="dap-an"><p>Three errors, and they are the three classic ones.</p>
<ul>
<li><b>Row A</b> — the host range is wrong. .63 is the broadcast, so hosts run .1 to <b>.62</b>. The range cannot include its own broadcast.</li>
<li><b>Row B</b> — the subnet address is wrong. The next block starts at broadcast + 1 = <b>.64</b>, not .63. As written, B starts one address inside A. Also, .63 is not a legal /27 boundary (multiples of 32 are 0, 32, 64, 96).</li>
<li><b>Row D</b> — the host range is wrong. A /30 at .112 has broadcast .115, so hosts are .113 to <b>.114</b>. Two hosts, not three.</li>
</ul>
<p>Row C is correct. Verify row B's illegality directly:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; i.ip_network('10.5.0.63/27')"</code></pre>
<pre><code class="language-plaintext">ValueError: 10.5.0.63/27 has host bits set</code></pre>
<p>That error message is Python telling you the address is not a legal network boundary for that prefix — which is exactly the check to run on every row of a table you did not write.</p></div>

<p><b>E3.</b> Four /24 networks — 10.20.0.0, 10.20.1.0, 10.20.2.0, 10.20.3.0 — are to be advertised as one route. What is it, and why does 10.20.4.0 break it?</p>
<div class="dap-an"><p>Write the third octets in binary: 0 = 000000<b>00</b>, 1 = 000000<b>01</b>, 2 = 000000<b>10</b>, 3 = 000000<b>11</b>. The first six bits are identical and only the last two vary, so the four share 16 + 6 = <b>22</b> bits. The summary is <b>10.20.0.0/22</b>.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; print(list(i.collapse_addresses([i.ip_network(x) for x in ['10.20.0.0/24','10.20.1.0/24','10.20.2.0/24','10.20.3.0/24']])))"</code></pre>
<pre><code class="language-plaintext">[IPv4Network('10.20.0.0/22')]</code></pre>
<p>Adding 10.20.4.0 breaks it because 4 is 00000<b>100</b> — the sixth bit now differs. The five networks no longer share 22 bits, and the smallest prefix covering all five is 10.20.0.0/21, which also drags in 10.20.5.0, 10.20.6.0 and 10.20.7.0 whether they belong to you or not.</p>
<p><b>This is why contiguity is a design rule and not a tidiness preference.</b> Summarisation only works on blocks that are both contiguous and aligned to a power-of-two boundary.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Từ 172.20.0.0/22, hãy thiết kế một sơ đồ VLSM cho: Sản xuất 500 host, Văn phòng 200 host, Phòng lab 100 host, Quản trị 20 host, và một đường WAN /30. Cho bảng đầy đủ và nói còn dư bao nhiêu địa chỉ.</p>
<div class="dap-an"><p>Một /22 có 1.024 địa chỉ, từ 172.20.0.0 tới 172.20.3.255. Định cỡ từng yêu cầu trước:</p>
<ul>
<li>500 host → 2^9 &minus; 2 = 510 → <b>/23</b> (512 địa chỉ)</li>
<li>200 host → 2^8 &minus; 2 = 254 → <b>/24</b> (256)</li>
<li>100 host → 2^7 &minus; 2 = 126 → <b>/25</b> (128)</li>
<li>20 host → 2^5 &minus; 2 = 30 → <b>/27</b> (32)</li>
<li>WAN → <b>/30</b> (4)</li>
</ul>
<table>
<thead><tr><th>Mạng</th><th>Tiền tố</th><th>Subnet</th><th>Dải host</th><th>Broadcast</th></tr></thead>
<tbody>
<tr><td>Sản xuất</td><td>/23</td><td>172.20.0.0</td><td>172.20.0.1 &ndash; 172.20.1.254</td><td>172.20.1.255</td></tr>
<tr><td>Văn phòng</td><td>/24</td><td>172.20.2.0</td><td>172.20.2.1 &ndash; 172.20.2.254</td><td>172.20.2.255</td></tr>
<tr><td>Phòng lab</td><td>/25</td><td>172.20.3.0</td><td>172.20.3.1 &ndash; 172.20.3.126</td><td>172.20.3.127</td></tr>
<tr><td>Quản trị</td><td>/27</td><td>172.20.3.128</td><td>172.20.3.129 &ndash; 172.20.3.158</td><td>172.20.3.159</td></tr>
<tr><td>WAN</td><td>/30</td><td>172.20.3.160</td><td>172.20.3.161 &ndash; 172.20.3.162</td><td>172.20.3.163</td></tr>
</tbody></table>
<p>Đã dùng: 512 + 256 + 128 + 32 + 4 = <b>932</b>. Còn lại: 1024 &minus; 932 = <b>92 địa chỉ</b>, liền mạch từ 172.20.3.164 tới 172.20.3.255.</p>
<p>Bước đáng học là phần Sản xuất: một /23 trải qua trọn hai giá trị của octet thứ ba, nên broadcast của nó là 172.20.<b>1</b>.255 chứ không phải 172.20.0.255. Tiền tố ngắn hơn /24 làm cho octet thứ ba trở thành một phần của không gian host.</p></div>

<p><b>E2.</b> Đồng nghiệp đưa bạn bảng này cho 10.5.0.0/24. Hãy tìm mọi lỗi mà không chạy gì cả, rồi kiểm lại.</p>
<pre><code class="language-plaintext">A  10.5.0.0/26    host .1-.63     bcast .63
B  10.5.0.63/27   host .64-.94    bcast .95
C  10.5.0.96/28   host .97-.110   bcast .111
D  10.5.0.112/30  host .113-.115  bcast .115</code></pre>
<div class="dap-an"><p>Ba lỗi, và chúng là ba lỗi kinh điển.</p>
<ul>
<li><b>Dòng A</b> — dải host sai. .63 là broadcast, nên host chạy .1 tới <b>.62</b>. Dải host không được chứa chính cái broadcast của nó.</li>
<li><b>Dòng B</b> — địa chỉ subnet sai. Khối kế tiếp bắt đầu ở broadcast + 1 = <b>.64</b>, không phải .63. Viết như trên thì B bắt đầu lọt vào trong A một địa chỉ. Thêm nữa, .63 không phải ranh giới /27 hợp lệ (bội của 32 là 0, 32, 64, 96).</li>
<li><b>Dòng D</b> — dải host sai. Một /30 ở .112 có broadcast .115, nên host là .113 tới <b>.114</b>. Hai host, không phải ba.</li>
</ul>
<p>Dòng C thì đúng. Kiểm trực tiếp chỗ bất hợp lệ của dòng B:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; i.ip_network('10.5.0.63/27')"</code></pre>
<pre><code class="language-plaintext">ValueError: 10.5.0.63/27 has host bits set</code></pre>
<p>Dòng báo lỗi đó là Python nói cho bạn biết địa chỉ này không phải ranh giới mạng hợp lệ cho tiền tố đó — và đó đúng là phép kiểm cần chạy trên mọi dòng của một cái bảng không phải bạn viết.</p></div>

<p><b>E3.</b> Bốn mạng /24 — 10.20.0.0, 10.20.1.0, 10.20.2.0, 10.20.3.0 — cần được quảng bá thành một tuyến. Tuyến đó là gì, và vì sao 10.20.4.0 phá vỡ nó?</p>
<div class="dap-an"><p>Viết octet thứ ba dưới dạng nhị phân: 0 = 000000<b>00</b>, 1 = 000000<b>01</b>, 2 = 000000<b>10</b>, 3 = 000000<b>11</b>. Sáu bit đầu giống hệt nhau và chỉ hai bit cuối thay đổi, nên bốn mạng chung 16 + 6 = <b>22</b> bit. Tuyến tóm tắt là <b>10.20.0.0/22</b>.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; print(list(i.collapse_addresses([i.ip_network(x) for x in ['10.20.0.0/24','10.20.1.0/24','10.20.2.0/24','10.20.3.0/24']])))"</code></pre>
<pre><code class="language-plaintext">[IPv4Network('10.20.0.0/22')]</code></pre>
<p>Thêm 10.20.4.0 vào là hỏng, vì 4 là 00000<b>100</b> — bit thứ sáu giờ đã khác. Năm mạng không còn chung 22 bit nữa, và tiền tố nhỏ nhất phủ được cả năm là 10.20.0.0/21, mà nó lôi theo cả 10.20.5.0, 10.20.6.0 và 10.20.7.0 dù mấy cái đó có phải của bạn hay không.</p>
<p><b>Đây là lý do tính liền mạch là một quy tắc thiết kế chứ không phải sở thích gọn gàng.</b> Tóm tắt tuyến chỉ chạy được trên những khối vừa liền nhau vừa thẳng hàng với một ranh giới luỹ thừa của hai.</p></div>`,
    ),

    bi(
      `<div class="note-ct"><h3>💬 The school's constructive question — session 31</h3>
<p>The published table lists <strong>CQ11.1</strong> against session 31, and its Details column contains the words <strong>"Progress Test 2"</strong>, quoted exactly.</p>
<p>That is not a question, and it does not describe anything in the sixty-session plan either: the schedule contains one <em>Midterm Progress Test</em>, at session 34, and no second progress test anywhere. We report the entry as published and do not substitute a question of our own for it, because altering the school's table would hide the discrepancy from you rather than from us.</p>
<p><strong>★ If you want a discussion question for this session,</strong> here are two that match what session 31 actually teaches:</p>
<ul>
<li>A colleague cuts a /24 into equal /26 blocks because the largest network needs 58 hosts. Explain what happens on the fifth network, and quantify what the approach cost before it failed.</li>
<li>Why must VLSM allocate the largest requirement first? Construct a specific example where allocating smallest first wastes an entire block.</li>
</ul></div>`,
      `<div class="note-ct"><h3>💬 Câu hỏi kiến tạo của trường — buổi 31</h3>
<p>Bảng đã công bố ghi <strong>CQ11.1</strong> cho buổi 31, và cột Details của nó chứa mấy chữ <strong>"Progress Test 2"</strong>, trích nguyên văn.</p>
<p>Đó không phải một câu hỏi, và nó cũng không mô tả thứ gì trong kế hoạch sáu mươi buổi: lịch học có một <em>Midterm Progress Test</em>, ở buổi 34, và không có bài kiểm tra tiến độ thứ hai nào ở đâu cả. Chúng tôi nêu đúng mục đó như đã công bố và không thay một câu hỏi của mình vào chỗ đó, bởi vì sửa bảng của trường là giấu chỗ vênh ấy khỏi bạn chứ không phải khỏi chúng tôi.</p>
<p><strong>★ Nếu bạn muốn một câu hỏi thảo luận cho buổi này,</strong> đây là hai câu khớp với nội dung buổi 31 thật sự dạy:</p>
<ul>
<li>Một đồng nghiệp cắt một /24 thành các khối /26 đều nhau vì mạng lớn nhất cần 58 host. Hãy giải thích chuyện gì xảy ra ở mạng thứ năm, và định lượng xem cách làm đó tốn bao nhiêu trước khi nó hỏng.</li>
<li>Vì sao VLSM buộc phải cấp phát yêu cầu lớn nhất trước? Hãy dựng một ví dụ cụ thể mà cấp phát nhỏ trước làm phí trọn một khối.</li>
</ul></div>`,
    ),
  ].join('\n'),
};

/* ─────────────── Lesson 10.3 — sessions 32–33 (Lab 2.2) + 34 ───────────── */

const L3 = {
  title: '10.3 — Lab 2.2 and the Midterm Progress Test (FLM sessions 32-34)|||10.3 — Lab 2.2 và bài thi giữa kỳ (buổi 32-34 của FLM)',
  slug: 'nwc204-10-3-lab-2-2-va-thi-giua-ky',
  type: 'DOCUMENT',
  description: 'Buổi 32-33 Lab 2.2 và buổi 34 Midterm: ba sản phẩm lab phải nộp, trình tự nghiệm thu từ dưới lên và vì sao dừng ở bước hỏng đầu tiên, cấu hình Cisco đầy đủ cho sơ đồ VLSM, mặt nạ sai trên PC gây triệu chứng lạ nhất, phần ★ đọc ba mạng IPv4 trên một máy chủ thật bằng ip -br addr và ip route, CIDR trong luật ufw và nginx, ba kiểu đụng dải địa chỉ trông y như lỗi phần mềm, phạm vi thi giữa kỳ CLO1-CLO9 và bốn lỗi mất điểm nhiều nhất.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 10 · Lesson 10.3 · FLM sessions 32, 33, 34 of 60 · CLO5, CLO9 · Cisco Module 11</span>
<h2>Putting the arithmetic on real devices</h2>
<p class="lead">After this lesson you can take a VLSM table and turn it into a working network, verify it bottom-up so that you always know which layer failed, and read the address plan of a real Linux server the same way you read a lab diagram.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 32-33 — "Lab 2.2 (Dialogue-based Assessment &amp; Self Learning) - Calculate IPv4 Subnets - Design and Implement a VLSM Addressing Scheme - Use AI Tools for Calculating IPv4 Subnets"; tài liệu "11.6.6 Lab Manual" và "11.10.2 Lab Manual"; buổi 34 — "Midterm Progress Test", ghi CLO1 - CLO9</p>
<p><strong>Opening question.</strong> A PC is configured with 192.168.20.100, mask 255.255.255.0, gateway 192.168.20.65. The network was designed with the VLSM table from the previous lesson. The PC can ping some machines on its own wire and cannot ping the gateway at all. Which single field is wrong, and why does it produce that particular mixture of working and not working?</p>
<div class="callout"><strong>ITU type U.</strong> Sessions 32 and 33 are marked <strong>U</strong> — Use. You are expected to do it, not watch it. The assessment is <strong>dialogue-based</strong>, which means you will be asked to explain your choices out loud, so a correct table you cannot justify is worth less than you think.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 11.</p>`,
      `<span class="eyebrow">NWC204 · Chương 10 · Bài 10.3 · Buổi 32, 33, 34/60 của FLM · CLO5, CLO9 · Cisco Module 11</span>
<h2>Đưa phép tính lên thiết bị thật</h2>
<p class="lead">Học xong bài này bạn cầm một bảng VLSM là biến được nó thành một mạng chạy được, nghiệm thu từ dưới lên để lúc nào cũng biết tầng nào hỏng, và đọc được sơ đồ địa chỉ của một máy chủ Linux thật y như đọc một sơ đồ trong bài lab.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 32-33 — "Lab 2.2 (Dialogue-based Assessment &amp; Self Learning) - Calculate IPv4 Subnets - Design and Implement a VLSM Addressing Scheme - Use AI Tools for Calculating IPv4 Subnets"; tài liệu "11.6.6 Lab Manual" và "11.10.2 Lab Manual"; buổi 34 — "Midterm Progress Test", ghi CLO1 - CLO9</p>
<p><strong>Câu hỏi mở đầu.</strong> Một cái PC được cấu hình 192.168.20.100, mặt nạ 255.255.255.0, cổng ra 192.168.20.65. Mạng được thiết kế theo bảng VLSM của bài trước. PC ping được vài máy trên cùng sợi dây của nó và hoàn toàn không ping được cổng ra. Đúng một trường nào bị sai, và vì sao nó sinh ra đúng cái hỗn hợp vừa chạy vừa không chạy như vậy?</p>
<div class="callout"><strong>ITU loại U.</strong> Buổi 32 và 33 được đánh dấu <strong>U</strong> — Use, tức Dùng. Bạn được yêu cầu LÀM, không phải ngồi xem. Cách chấm là <strong>dialogue-based</strong>, nghĩa là bạn sẽ bị hỏi để giải thích các lựa chọn của mình thành lời, nên một cái bảng đúng mà bạn không biện minh được thì đáng ít điểm hơn bạn tưởng.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 11.</p>`,
    ),

    walkHead('nwc204-ch10', 28, 36,
      'Slides 28-36 cover FLM sessions 32-33 (Lab 2.2) and session 34 (Midterm Progress Test), plus the ★ material on reading a real server.',
      'Slide 28-36 là buổi 32-33 của FLM (Lab 2.2) và buổi 34 (thi giữa kỳ), kèm phần ★ về việc đọc một máy chủ thật.'),

    walk('nwc204-ch10', [
      [28, 'Lab 2.2 — the three things you must produce',
        `<p>The syllabus lists three deliverables for sessions 32 and 33, and they are three different skills.</p>
<ol>
<li><strong>Calculate IPv4 subnets.</strong> Given a network and a requirement, produce the table: network, first host, last host, broadcast, mask.</li>
<li><strong>Design and implement a VLSM addressing scheme.</strong> Note the word <em>implement</em>. The table on paper is half of it; the other half is typing it into the devices.</li>
<li><strong>Use AI tools for calculating IPv4 subnets.</strong> And, if you want the mark, show how you verified what came back.</li>
</ol>
<p><strong>Where people lose marks.</strong> Almost always on the second one, and almost always the same way: the table is correct, the addresses are typed correctly, and <code>no shutdown</code> was never issued. Router interfaces ship administratively down on purpose — that was Chapter 9 — and a perfect address on a shut interface routes nothing.</p>
<p><strong>What to bring to the dialogue.</strong> Be ready to answer three questions about your own table: why that prefix for that network, why the blocks are in that order, and where the next department would go.</p>`,
        `<p>Syllabus liệt kê ba sản phẩm phải nộp cho buổi 32 và 33, và chúng là ba kỹ năng khác nhau.</p>
<ol>
<li><strong>Tính subnet IPv4.</strong> Cho một mạng và một yêu cầu, dựng ra cái bảng: mạng, host đầu, host cuối, broadcast, mặt nạ.</li>
<li><strong>Thiết kế và TRIỂN KHAI một sơ đồ địa chỉ VLSM.</strong> Chú ý chữ <em>triển khai</em>. Cái bảng trên giấy mới là một nửa; nửa còn lại là gõ nó vào thiết bị.</li>
<li><strong>Dùng công cụ AI để tính subnet IPv4.</strong> Và, nếu muốn có điểm, hãy trình bày cách bạn đã kiểm lại thứ nó trả về.</li>
</ol>
<p><strong>Chỗ người ta mất điểm.</strong> Gần như luôn ở mục thứ hai, và gần như luôn theo cùng một kiểu: bảng đúng, địa chỉ gõ đúng, và <code>no shutdown</code> thì chưa bao giờ được gõ. Cổng router xuất xưởng ở trạng thái tắt là có chủ ý — đó là Chương 9 — và một địa chỉ hoàn hảo trên một cổng đang tắt thì không định tuyến được gì.</p>
<p><strong>Mang gì tới buổi vấn đáp.</strong> Hãy sẵn sàng trả lời ba câu về chính cái bảng của bạn: vì sao dùng tiền tố đó cho mạng đó, vì sao các khối xếp theo thứ tự đó, và phòng ban tiếp theo sẽ đặt vào đâu.</p>`],

      [29, 'Verify bottom-up, and stop at the first failure',
        `<p>The order matters more than the commands. Check layer 1, then 2, then 3, and stop the moment something fails — everything above a broken layer will also fail, and chasing those symptoms wastes the whole lab session.</p>
<ol>
<li><code>show ip interface brief</code> — Status is layer 1, Protocol is layer 2. Both must read <em>up</em>.</li>
<li><code>show ip route</code> — is there a connected route for each configured interface? No route means no address was actually applied, whatever the previous command showed.</li>
<li><code>ipconfig</code> on the PC — address, <strong>mask</strong> and gateway. Read all three, not just the address.</li>
<li><code>ping</code> your own gateway — proves layers 1 to 3 on your own subnet.</li>
<li><code>ping</code> a host on another subnet — proves routing.</li>
</ol>
<p><strong>Now the opening question.</strong> The PC is 192.168.20.100 with mask 255.255.255.0. In our VLSM table, .100 belongs to Admin's 192.168.20.96/28, whose range is .97 to .110 with gateway .97. With a /24 mask the PC believes its subnet is the whole 192.168.20.0/24, so it thinks .65 (Engineering's gateway) is <em>local</em> and ARPs for it on its own wire — where nobody answers, because .65 is on a different segment behind a router. Meanwhile it can reach .97 to .110 because those genuinely are on its wire. <strong>The mask is the wrong field.</strong> It should be 255.255.255.240, and the gateway should be .97.</p>`,
        `<p>Thứ tự quan trọng hơn bản thân các câu lệnh. Kiểm tầng 1, rồi tầng 2, rồi tầng 3, và dừng lại ngay khi có thứ gì hỏng — mọi thứ nằm trên một tầng đã hỏng thì cũng sẽ hỏng, và đuổi theo những triệu chứng đó làm phí trọn buổi lab.</p>
<ol>
<li><code>show ip interface brief</code> — cột Status là tầng 1, cột Protocol là tầng 2. Cả hai phải ghi <em>up</em>.</li>
<li><code>show ip route</code> — có tuyến kết nối cho từng cổng đã cấu hình không? Không có tuyến nghĩa là thật ra chưa có địa chỉ nào được áp, bất kể lệnh trước hiện ra gì.</li>
<li><code>ipconfig</code> trên PC — địa chỉ, <strong>mặt nạ</strong> và cổng ra. Đọc cả ba, đừng chỉ đọc địa chỉ.</li>
<li><code>ping</code> cổng ra của chính mình — chứng minh tầng 1 tới 3 trên subnet của mình.</li>
<li><code>ping</code> một host ở subnet khác — chứng minh việc định tuyến.</li>
</ol>
<p><strong>Giờ tới câu hỏi mở đầu.</strong> PC là 192.168.20.100 mặt nạ 255.255.255.0. Trong bảng VLSM của ta, .100 thuộc về mạng Hành chính 192.168.20.96/28, dải .97 đến .110 với cổng ra .97. Với mặt nạ /24 thì PC tin rằng subnet của nó là trọn cái 192.168.20.0/24, nên nó nghĩ .65 (cổng ra của Kỹ thuật) là <em>nội bộ</em> và đi ARP tìm nó ngay trên sợi dây của mình — nơi không ai trả lời, vì .65 nằm ở một đoạn khác phía sau router. Trong khi đó nó vẫn tới được .97 đến .110 vì mấy cái đó thật sự nằm trên dây của nó. <strong>Mặt nạ là cái trường sai.</strong> Nó phải là 255.255.255.240, và cổng ra phải là .97.</p>`],

      [30, '★ Read your own server: three networks on one machine',
        `<p>Everything in this chapter describes a machine you already own. A production VPS running Docker has at least three IPv4 networks on it, and you should be able to name all three.</p>
<ul>
<li><strong>eth0</strong> — the public address, a /24 in this case, with 254 usable and a gateway at .1. This is what DNS points at.</li>
<li><strong>docker0</strong> — 172.17.0.1/16. Docker created it. It is RFC 1918 private space, 65,534 usable addresses, for containers not attached to a custom network.</li>
<li><strong>br-&lt;hash&gt;</strong> — 172.18.0.1/16. One of these exists per compose project, and it is where your containers actually talk to each other by service name.</li>
</ul>
<p><strong>And the server is a router.</strong> <code>net.ipv4.ip_forward</code> is 1, which is what makes a Linux host forward packets between its interfaces rather than only sending and receiving its own. Every routing rule from Chapter 7 applies to your machine, right now, and <code>ip route</code> shows the table.</p>
<p><strong>The consequence worth remembering.</strong> If an office VPN also routes 172.18.0.0/16, containers become unreachable from the office and only from the office. Nothing in the Docker logs mentions it, because nothing is wrong with Docker. It is an addressing collision, and this chapter is what lets you name it in thirty seconds instead of a day.</p>`,
        `<p>Mọi thứ trong chương này mô tả một cái máy bạn đã sở hữu. Một VPS sản xuất đang chạy Docker có ít nhất ba mạng IPv4 trên đó, và bạn nên gọi tên được cả ba.</p>
<ul>
<li><strong>eth0</strong> — địa chỉ công cộng, trong trường hợp này là một /24, có 254 chỗ dùng được và cổng ra ở .1. Đây là thứ mà DNS trỏ tới.</li>
<li><strong>docker0</strong> — 172.17.0.1/16. Docker tạo ra nó. Đó là không gian riêng RFC 1918, 65.534 địa chỉ dùng được, dành cho container không gắn vào mạng tuỳ chỉnh nào.</li>
<li><strong>br-&lt;mã băm&gt;</strong> — 172.18.0.1/16. Mỗi dự án compose có một cái như vậy, và đó là nơi các container của bạn thật sự nói chuyện với nhau bằng tên dịch vụ.</li>
</ul>
<p><strong>Và cái máy chủ đó là một router.</strong> <code>net.ipv4.ip_forward</code> bằng 1, và đó là thứ làm cho một máy Linux chuyển tiếp gói giữa các cổng của nó thay vì chỉ gửi và nhận cho chính nó. Mọi quy tắc định tuyến từ Chương 7 áp dụng cho cái máy của bạn, ngay lúc này, và <code>ip route</code> hiện ra cái bảng đó.</p>
<p><strong>Hệ quả đáng nhớ.</strong> Nếu một đường VPN của công ty cũng định tuyến 172.18.0.0/16 thì các container trở nên không tới được từ công ty và chỉ từ công ty. Không có gì trong log của Docker nhắc tới chuyện đó, vì Docker không hỏng gì cả. Đó là một vụ đụng dải địa chỉ, và chương này là thứ cho phép bạn gọi tên nó trong ba mươi giây thay vì một ngày.</p>`],

      [31, '★ The commands that answer "what is my network?"',
        `<p>Four commands, and between them they answer every addressing question you can ask about a Linux machine.</p>
<ul>
<li><code>ip -br addr</code> — every interface with its CIDR, one line each. The <em>-br</em> is "brief" and it is the difference between a readable answer and forty lines.</li>
<li><code>ip route</code> — which network goes out which interface, and what the default is.</li>
<li><code>ip route get 8.8.8.8</code> — which route <em>would</em> be chosen for this particular destination. This answers "why is this one address behaving differently" better than any amount of reading the table.</li>
<li><code>ipcalc 192.168.20.0/26</code> — network, broadcast, range, if the package is installed. Python does the same job and is always there.</li>
</ul>
<p><strong>Read the slash.</strong> Every number after a slash in that output is this chapter. <code>/8</code> on loopback, <code>/24</code> on the public interface, <code>/16</code> on each Docker bridge — you can now say how many addresses each holds, where each one ends, and whether any two of them overlap.</p>`,
        `<p>Bốn câu lệnh, và gộp lại chúng trả lời mọi câu hỏi về địa chỉ mà bạn có thể đặt ra cho một máy Linux.</p>
<ul>
<li><code>ip -br addr</code> — mọi cổng kèm CIDR của nó, mỗi cái một dòng. Chữ <em>-br</em> là "brief", và nó là khác biệt giữa một câu trả lời đọc được với bốn mươi dòng.</li>
<li><code>ip route</code> — mạng nào đi ra cổng nào, và tuyến mặc định là gì.</li>
<li><code>ip route get 8.8.8.8</code> — tuyến nào <em>sẽ</em> được chọn cho đúng cái đích này. Câu này trả lời "vì sao riêng địa chỉ này lại hành xử khác" tốt hơn mọi công đọc bảng.</li>
<li><code>ipcalc 192.168.20.0/26</code> — mạng, broadcast, dải, nếu gói đó đã cài. Python làm đúng việc ấy và lúc nào cũng có sẵn.</li>
</ul>
<p><strong>Hãy đọc cái dấu gạch chéo.</strong> Mọi con số sau dấu gạch chéo trong kết xuất đó chính là chương này. <code>/8</code> trên loopback, <code>/24</code> trên cổng công cộng, <code>/16</code> trên từng cầu Docker — giờ bạn nói được mỗi cái chứa bao nhiêu địa chỉ, mỗi cái kết thúc ở đâu, và có hai cái nào chồng nhau không.</p>`],

      [32, '★ CIDR is the unit of firewall and web-server rules',
        `<p>Once you can read a prefix, a large part of server administration stops being guesswork. Firewall rules, reverse-proxy access lists and cloud security groups are all written in CIDR.</p>
<p><code>ufw allow from 10.0.0.0/8 to any port 22</code> means "SSH from anywhere on the campus". <code>allow 203.0.113.0/24</code> in an nginx location block means "this office, nobody else".</p>
<p><strong>The danger is silent.</strong> A prefix one bit too short doubles the address space admitted, and nothing logs a warning. Writing <code>/16</code> where you meant <code>/24</code> admits 256 times as many machines, and the rule still looks entirely reasonable in the file. There is no error, no test that fails, and no symptom until someone you did not intend to admit connects.</p>
<p><strong>So compute the range before you write the rule.</strong> One command tells you the first and last address a prefix covers. Doing it takes three seconds and turns an assumption into a fact — which is the habit this whole course is built around.</p>`,
        `<p>Khi đã đọc được một tiền tố thì một phần lớn việc quản trị máy chủ thôi là chuyện đoán mò. Luật tường lửa, danh sách truy cập của reverse proxy và security group trên đám mây đều viết bằng CIDR.</p>
<p><code>ufw allow from 10.0.0.0/8 to any port 22</code> nghĩa là "SSH từ bất cứ đâu trong khuôn viên trường". <code>allow 203.0.113.0/24</code> trong một khối location của nginx nghĩa là "đúng văn phòng này, không ai khác".</p>
<p><strong>Cái nguy hiểm thì lặng lẽ.</strong> Một tiền tố ngắn hơn một bit là gấp đôi không gian địa chỉ được cho vào, và không có gì ghi lại một lời cảnh báo nào. Viết <code>/16</code> trong khi định viết <code>/24</code> là cho vào gấp 256 lần số máy, mà cái luật đó nhìn trong file vẫn hoàn toàn hợp lý. Không có lỗi, không có phép kiểm nào hỏng, và không có triệu chứng nào cho tới khi một người bạn không định cho vào lại kết nối được.</p>
<p><strong>Nên hãy tính cái dải trước khi viết luật.</strong> Một câu lệnh cho bạn biết địa chỉ đầu và cuối mà một tiền tố phủ. Làm việc đó mất ba giây và biến một giả định thành một sự thật — đúng cái thói quen mà cả môn này được dựng quanh nó.</p>`],

      [33, '★ Three collisions that look like broken software',
        `<p>All three of these arrive as a bug report saying "the app is broken". None of them is a software fault.</p>
<ul>
<li><strong>VPN versus Docker.</strong> The office VPN routes 172.18.0.0/16; your compose network uses the same block. Containers vanish from the office and work everywhere else. Each side is individually correct.</li>
<li><strong>Home versus office.</strong> Both ends of a site-to-site VPN use 192.168.1.0/24. The tunnel comes up and no traffic crosses it, because each end evaluates the destination against its own mask and concludes the remote subnet is itself.</li>
<li><strong>CGNAT.</strong> Your ISP gives you 100.64.x.x instead of a public address. Port forwarding cannot work, and no amount of router configuration will fix it — there is no public address to forward <em>from</em>.</li>
</ul>
<p><strong>The diagnosis is always the same move:</strong> list every CIDR block in play on both ends and check whether any two overlap. <code>ip route</code> on each side answers it in under a minute, and the answer is either "they overlap, that is the bug" or "they do not, look elsewhere". Either result is progress.</p>
<p>This is what the chapter buys you beyond the exam: a class of failure that used to be baffling becomes a ten-second check.</p>`,
        `<p>Cả ba chuyện này đều đến dưới dạng một báo lỗi nói rằng "ứng dụng hỏng rồi". Không cái nào là lỗi phần mềm.</p>
<ul>
<li><strong>VPN đụng Docker.</strong> Đường VPN của công ty định tuyến 172.18.0.0/16; mạng compose của bạn dùng đúng khối đó. Container biến mất khi ở công ty và chạy tốt ở mọi nơi khác. Xét riêng thì mỗi bên đều đúng.</li>
<li><strong>Nhà đụng công ty.</strong> Hai đầu của một đường VPN nối hai cơ sở đều dùng 192.168.1.0/24. Đường hầm lên, và không có lưu lượng nào đi qua, vì mỗi đầu đánh giá địa chỉ đích bằng mặt nạ của chính nó rồi kết luận subnet ở xa chính là mình.</li>
<li><strong>CGNAT.</strong> Nhà mạng cho bạn 100.64.x.x thay vì một địa chỉ công cộng. Chuyển tiếp cổng không thể chạy, và cấu hình router bao nhiêu cũng không sửa được — không có địa chỉ công cộng nào để mà chuyển tiếp <em>từ đó</em>.</li>
</ul>
<p><strong>Cách chẩn đoán luôn là cùng một nước đi:</strong> liệt kê mọi khối CIDR đang có mặt ở cả hai đầu và kiểm xem có hai cái nào chồng nhau không. <code>ip route</code> ở mỗi bên trả lời chuyện đó trong chưa tới một phút, và câu trả lời hoặc là "chúng chồng nhau, đó là cái lỗi" hoặc là "không chồng, đi tìm chỗ khác". Kết quả nào cũng là tiến triển.</p>
<p>Đây là thứ chương này mua cho bạn ngoài bài thi: một lớp sự cố vốn khó hiểu trở thành một phép kiểm mười giây.</p>`],

      [34, 'Session 34 — the Midterm Progress Test',
        `<p>The published plan gives session 34 as <strong>Midterm Progress Test</strong> with outcomes listed as <strong>CLO1 - CLO9</strong> and student task "Review". No materials are listed.</p>
<p>That range covers everything from the start of the course through this chapter:</p>
<ul>
<li>Chapters 1-3 — components, OSI and TCP/IP layers, encapsulation, PDUs.</li>
<li>Chapter 4 and 4B — media and signalling, and binary and hexadecimal conversion.</li>
<li>Chapters 5-6 — frames, MAC addresses, the switch MAC table, duplex.</li>
<li>Chapters 7-8 — the routing table, the default gateway, ARP.</li>
<li><strong>Chapter 10</strong> — address structure, address types, subnetting and VLSM.</li>
</ul>
<p><strong>A note on the CLO count.</strong> The syllabus defines ten CLOs. This session lists CLO1 to CLO9, and session 60 lists "CLO1-CLO11" — a range that includes two outcomes the course does not define. We report the table as published rather than correcting it, and you should ask your lecturer if the exact scope matters for your preparation.</p>
<p><strong>Where the marks concentrate.</strong> Subnetting, because it is objectively markable. A question either has a right answer or it does not, which is exactly the property an exam writer wants.</p>`,
        `<p>Kế hoạch đã công bố ghi buổi 34 là <strong>Midterm Progress Test</strong> với chuẩn đầu ra ghi là <strong>CLO1 - CLO9</strong> và nhiệm vụ sinh viên là "Review". Không liệt kê tài liệu nào.</p>
<p>Phạm vi đó phủ mọi thứ từ đầu môn cho tới hết chương này:</p>
<ul>
<li>Chương 1-3 — thành phần mạng, tầng OSI và TCP/IP, đóng gói, các PDU.</li>
<li>Chương 4 và 4B — môi trường truyền và tín hiệu, và chuyển đổi nhị phân, thập lục phân.</li>
<li>Chương 5-6 — khung, địa chỉ MAC, bảng MAC của switch, chế độ song công.</li>
<li>Chương 7-8 — bảng định tuyến, cổng ra mặc định, ARP.</li>
<li><strong>Chương 10</strong> — cấu trúc địa chỉ, các loại địa chỉ, chia subnet và VLSM.</li>
</ul>
<p><strong>Một ghi chú về số lượng CLO.</strong> Syllabus định nghĩa mười CLO. Buổi này ghi CLO1 đến CLO9, còn buổi 60 ghi "CLO1-CLO11" — một khoảng bao gồm hai chuẩn đầu ra mà môn học không định nghĩa. Chúng tôi nêu đúng bảng như đã công bố chứ không sửa nó, và bạn nên hỏi giảng viên nếu phạm vi chính xác có ảnh hưởng tới việc ôn tập.</p>
<p><strong>Điểm tập trung ở đâu.</strong> Ở phần chia subnet, vì nó chấm được một cách khách quan. Một câu hỏi hoặc có đáp án đúng hoặc không, và đó đúng là tính chất mà người ra đề mong muốn.</p>`],

      [35, 'The four mistakes that cost the most marks',
        `<p>Across this chapter, four errors account for most of the lost marks, and all four are avoidable in seconds.</p>
<ul>
<li><strong>Wrong formula.</strong> Using 2^n where the question asked about hosts, or 2^h &minus; 2 where it asked about subnets. The check n + h + prefix = 32 catches this instantly.</li>
<li><strong>Forgetting the minus two.</strong> A /27 has 32 addresses and 30 usable hosts. Both are right answers to different questions; read which one was asked.</li>
<li><strong>Advancing from the last host.</strong> The next subnet starts at <em>broadcast plus one</em>. Off by one there and two blocks overlap.</li>
<li><strong>The 172.16.0.0/12 range.</strong> It ends at 172.31.255.255. 172.32.0.1 is somebody else's public address.</li>
</ul>
<p><strong>Under time pressure, write the block size first.</strong> Block = 256 minus the last non-zero mask octet. From that, network addresses are multiples of the block, and each broadcast is the next network minus one. Three mechanical steps, no memory required, and they work for every prefix from /9 to /30.</p>`,
        `<p>Trên toàn chương này, bốn lỗi sau chiếm phần lớn số điểm bị mất, và cả bốn đều tránh được trong vài giây.</p>
<ul>
<li><strong>Sai công thức.</strong> Dùng 2^n trong khi câu hỏi hỏi về host, hoặc dùng 2^h &minus; 2 trong khi nó hỏi về subnet. Phép kiểm n + h + tiền tố = 32 bắt được chuyện này ngay tức khắc.</li>
<li><strong>Quên phép trừ hai.</strong> Một /27 có 32 địa chỉ và 30 host dùng được. Cả hai đều là đáp án đúng cho hai câu hỏi khác nhau; hãy đọc xem người ta hỏi cái nào.</li>
<li><strong>Tiến lên từ host cuối.</strong> Subnet kế tiếp bắt đầu ở <em>broadcast cộng một</em>. Lệch một chỗ đó là hai khối chồng nhau.</li>
<li><strong>Dải 172.16.0.0/12.</strong> Nó kết thúc ở 172.31.255.255. 172.32.0.1 là địa chỉ công cộng của người khác.</li>
</ul>
<p><strong>Khi bị sức ép thời gian, hãy viết kích thước khối ra trước.</strong> Khối = 256 trừ octet khác 0 cuối cùng của mặt nạ. Từ đó, các địa chỉ mạng là bội số của khối, và mỗi broadcast là mạng kế tiếp trừ một. Ba bước máy móc, không cần trí nhớ, và chúng đúng cho mọi tiền tố từ /9 tới /30.</p>`],

      [36, 'What you can do now, and what comes next',
        `<p>If the chapter worked, all of this is now routine rather than effortful.</p>
<ul>
<li>Split any address into network and host with any mask, using AND, without a calculator.</li>
<li>Produce network, first host, last host and broadcast for any prefix in under thirty seconds.</li>
<li>Choose a prefix from a host requirement, and separately from a subnet-count requirement.</li>
<li>Design a VLSM scheme largest-first and prove no two blocks overlap.</li>
<li>Recognise private, loopback, link-local, CGNAT and multicast ranges on sight.</li>
<li>★ Read <code>ip -br addr</code> and <code>ip route</code> on a real server and name every network on it.</li>
<li>★ Diagnose an addressing collision between a VPN, a Docker bridge and a LAN.</li>
</ul>
<p><strong>Next: Chapter 11 — IPv6 Addressing</strong>, sessions 35-36, Cisco Module 12. Two sessions rather than five, because the hard part is already done: the ideas of a prefix, a network portion and a host portion carry over unchanged. What changes is the size, 128 bits instead of 32, and the notation — which is where the hexadecimal from Chapter 4B finally earns its place.</p>
<p class="ghi-chu">Note on the source table: session 35 lists "11.1 IPv6 Addressing" and then "11.3 IPv6 Addressing" — the same title twice. Another small inconsistency, reported rather than corrected.</p>`,
        `<p>Nếu chương này có tác dụng thì giờ mọi thứ dưới đây đã thành thói quen chứ không còn là việc phải gắng sức.</p>
<ul>
<li>Tách bất kỳ địa chỉ nào thành phần mạng và phần host với bất kỳ mặt nạ nào, bằng phép AND, không cần máy tính.</li>
<li>Cho ra địa chỉ mạng, host đầu, host cuối và broadcast cho bất kỳ tiền tố nào trong chưa tới ba mươi giây.</li>
<li>Chọn tiền tố từ một yêu cầu về số host, và tách bạch với một yêu cầu về số subnet.</li>
<li>Thiết kế một sơ đồ VLSM theo lối lớn-trước và chứng minh không có hai khối nào chồng nhau.</li>
<li>Nhìn một cái là nhận ra dải riêng, loopback, link-local, CGNAT và multicast.</li>
<li>★ Đọc <code>ip -br addr</code> và <code>ip route</code> trên một máy chủ thật và gọi tên mọi mạng trên đó.</li>
<li>★ Chẩn đoán một vụ đụng dải địa chỉ giữa một đường VPN, một cầu Docker và một mạng LAN.</li>
</ul>
<p><strong>Tiếp theo: Chương 11 — Địa chỉ IPv6</strong>, buổi 35-36, Module 12 của Cisco. Hai buổi chứ không phải năm, vì phần khó đã xong rồi: các ý niệm tiền tố, phần mạng và phần host chuyển sang nguyên vẹn. Thứ thay đổi là kích cỡ, 128 bit thay vì 32, và cách ký hiệu — và đó là chỗ hệ thập lục phân của Chương 4B cuối cùng cũng được dùng tới.</p>
<p class="ghi-chu">Ghi chú về bảng gốc: buổi 35 ghi "11.1 IPv6 Addressing" rồi lại ghi "11.3 IPv6 Addressing" — cùng một tiêu đề hai lần. Thêm một chỗ vênh nhỏ nữa, nêu ra chứ không sửa.</p>`],
    ]),

    bi(
      `<h3>⚙️ The VLSM table, configured on real devices</h3>
<p>This is the implement half of Lab 2.2. Start from <code>enable</code> every time; a configuration that begins in the middle of a mode is one you cannot hand to somebody else.</p>
<pre><code class="language-bash">enable
configure terminal
hostname R1
!
! Sales LAN — 192.168.20.0/26, gateway is the first usable address
interface gigabitEthernet 0/0
 description Sales LAN 192.168.20.0/26
 ip address 192.168.20.1 255.255.255.192
 no shutdown
!
! Engineering LAN — 192.168.20.64/27
interface gigabitEthernet 0/1
 description Engineering LAN 192.168.20.64/27
 ip address 192.168.20.65 255.255.255.224
 no shutdown
!
! WAN link to R2 — 192.168.20.112/30, R1 takes the first usable
interface serial 0/0/0
 description WAN to R2 192.168.20.112/30
 ip address 192.168.20.113 255.255.255.252
 clock rate 64000
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p><strong>Three things in there are the ones people forget.</strong> <code>no shutdown</code> on every interface, because router ports ship administratively down. <code>clock rate</code> on the DCE end of a serial link, without which Status reads up and Protocol reads down. And <code>copy running-config startup-config</code>, without which the whole thing vanishes at the next power cut.</p>
<p>Note that the masks are written in dotted decimal because that is what IOS accepts here, while your design table used prefix lengths. Converting between the two is now something you do without stopping.</p>`,
      `<h3>⚙️ Bảng VLSM, cấu hình lên thiết bị thật</h3>
<p>Đây là nửa "triển khai" của Lab 2.2. Lần nào cũng bắt đầu từ <code>enable</code>; một cấu hình bắt đầu từ giữa một chế độ là cấu hình bạn không đưa cho người khác được.</p>
<pre><code class="language-bash">enable
configure terminal
hostname R1
!
! LAN Kinh doanh — 192.168.20.0/26, cổng ra là địa chỉ dùng được đầu tiên
interface gigabitEthernet 0/0
 description Sales LAN 192.168.20.0/26
 ip address 192.168.20.1 255.255.255.192
 no shutdown
!
! LAN Kỹ thuật — 192.168.20.64/27
interface gigabitEthernet 0/1
 description Engineering LAN 192.168.20.64/27
 ip address 192.168.20.65 255.255.255.224
 no shutdown
!
! Đường WAN sang R2 — 192.168.20.112/30, R1 lấy địa chỉ dùng được đầu tiên
interface serial 0/0/0
 description WAN to R2 192.168.20.112/30
 ip address 192.168.20.113 255.255.255.252
 clock rate 64000
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p><strong>Ba thứ trong đó là ba thứ người ta hay quên.</strong> <code>no shutdown</code> trên mọi cổng, vì cổng router xuất xưởng ở trạng thái tắt. <code>clock rate</code> ở đầu DCE của một đường serial, thiếu nó thì Status ghi up còn Protocol ghi down. Và <code>copy running-config startup-config</code>, thiếu nó thì cả đống công biến mất ở lần mất điện kế tiếp.</p>
<p>Để ý rằng các mặt nạ được viết dạng thập phân có dấu chấm vì đó là thứ IOS nhận ở đây, trong khi bảng thiết kế của bạn dùng độ dài tiền tố. Chuyển qua lại giữa hai dạng giờ là việc bạn làm mà không cần dừng lại nghĩ.</p>`,
    ),

    bi(
      `<h3>🗺️ Lab 2.2 troubleshooting, bottom-up</h3>
<pre><code class="language-mermaid">graph TD
  A["Two hosts cannot reach<br/>each other"] --> B{"show ip int brief<br/>Status and Protocol?"}
  B -->|"not up/up"| C["Layer 1 or 2<br/>see Chapter 9 — no shutdown,<br/>cable, clock rate"]
  B -->|"up/up"| D{"show ip route<br/>connected route present?"}
  D -->|"no"| E["No address applied<br/>check you were in the<br/>right interface sub-mode"]
  D -->|"yes"| F{"On each PC, does the MASK<br/>match the design table?"}
  F -->|"no"| G["THIS is the fault<br/>wrong mask = wrong idea<br/>of who is local"]
  F -->|"yes"| H["Check the gateway is<br/>INSIDE that PC's own subnet"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F ask
  class A,C,E act
  class G,H ok</code></pre>
<p>The two boxes at the bottom are this chapter's contribution. Everything above them is Chapter 9, and in a lab built from a correct VLSM table, the fault is almost always in one of those two.</p>`,
      `<h3>🗺️ Gỡ lỗi Lab 2.2, từ dưới lên</h3>
<pre><code class="language-mermaid">graph TD
  A["Hai host không tới<br/>được nhau"] --> B{"show ip int brief<br/>cột Status và Protocol?"}
  B -->|"không up/up"| C["Tầng 1 hoặc 2<br/>xem Chương 9 — no shutdown,<br/>dây, clock rate"]
  B -->|"up/up"| D{"show ip route<br/>có tuyến kết nối không?"}
  D -->|"không"| E["Chưa áp địa chỉ nào<br/>kiểm xem có đang ở đúng<br/>chế độ con của cổng không"]
  D -->|"có"| F{"Trên mỗi PC, MẶT NẠ có<br/>khớp bảng thiết kế không?"}
  F -->|"không"| G["ĐÂY là cái hỏng<br/>sai mặt nạ = sai quan niệm<br/>về ai là nội bộ"]
  F -->|"có"| H["Kiểm cổng ra có nằm TRONG<br/>subnet của chính PC đó không"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F ask
  class A,C,E act
  class G,H ok</code></pre>
<p>Hai cái hộp dưới cùng là phần đóng góp của chương này. Mọi thứ phía trên chúng là Chương 9, và trong một bài lab dựng từ một bảng VLSM đúng thì cái hỏng gần như luôn nằm ở một trong hai cái đó.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — ★ on your own machine, right now</h3>
<p>You do not need a lab to practise this. Run these on any Linux or macOS machine, including a laptop.</p>
<pre><code class="language-bash">ip -br addr                    # Linux: every interface and its CIDR
ifconfig | grep -E 'inet |netmask'   # macOS equivalent
ip route                       # which network leaves by which interface
ip route get 1.1.1.1           # which route WOULD be used for this destination</code></pre>
<p>Then answer, for each line of output: what is the network address, the broadcast, how many usable hosts, and is it private or public? Check yourself with one command per interface:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('172.18.0.1/16', strict=False); print(n, n.network_address, n.broadcast_address, n.num_addresses-2, 'private' if n.is_private else 'public')"</code></pre>
<pre><code class="language-plaintext">172.18.0.0/16 172.18.0.0 172.18.255.255 65534 private</code></pre>
<div class="callout ok"><strong>What the results tell you.</strong> A 169.254.x.x address means DHCP failed on that interface. A 100.64.x.x to 100.127.x.x address means your provider has you behind carrier NAT and port forwarding cannot work. Two interfaces whose networks overlap means you have found a real misconfiguration on a machine you own — and you found it by reading, not by waiting for something to break.</div>`,
      `<h3>🔍 Cách tự kiểm — ★ ngay trên máy của bạn, lúc này</h3>
<p>Bạn không cần phòng lab mới luyện được việc này. Chạy mấy lệnh sau trên bất kỳ máy Linux hay macOS nào, kể cả máy tính xách tay.</p>
<pre><code class="language-bash">ip -br addr                    # Linux: mọi cổng và CIDR của nó
ifconfig | grep -E 'inet |netmask'   # lệnh tương đương trên macOS
ip route                       # mạng nào đi ra bằng cổng nào
ip route get 1.1.1.1           # tuyến nào SẼ được dùng cho đích này</code></pre>
<p>Rồi trả lời, cho từng dòng kết xuất: địa chỉ mạng là gì, broadcast là gì, bao nhiêu host dùng được, và nó là riêng hay công cộng? Tự kiểm bằng một lệnh cho mỗi cổng:</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; n=i.ip_network('172.18.0.1/16', strict=False); print(n, n.network_address, n.broadcast_address, n.num_addresses-2, 'private' if n.is_private else 'public')"</code></pre>
<pre><code class="language-plaintext">172.18.0.0/16 172.18.0.0 172.18.255.255 65534 private</code></pre>
<div class="callout ok"><strong>Kết quả nói lên điều gì.</strong> Một địa chỉ 169.254.x.x nghĩa là DHCP hỏng trên cổng đó. Một địa chỉ từ 100.64.x.x tới 100.127.x.x nghĩa là nhà mạng đang đặt bạn sau NAT của họ và chuyển tiếp cổng không thể chạy. Hai cổng mà mạng của chúng chồng nhau nghĩa là bạn vừa tìm ra một cấu hình sai thật trên một cái máy của chính mình — và bạn tìm ra nó bằng cách đọc, không phải bằng cách chờ có thứ gì đó hỏng.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — a correct table and a shut interface.</strong> Every address right, nothing forwards. <b>Symptom:</b> <code>show ip interface brief</code> reads <em>administratively down</em>, and <code>show ip route</code> has no connected route for it. One command fixes it: <code>no shutdown</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — the gateway outside its own subnet.</strong> A PC in 192.168.20.96/28 with gateway .65 cannot reach the gateway at all, because .65 is not in .96-.111. <b>Symptom:</b> local pings work, everything off-subnet times out. Always check the gateway is between the subnet's first and last usable address.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — reading only the address on the PC.</strong> The mask is the field that produces the strangest symptoms, and it is the one people skim. <b>Symptom:</b> a host that can reach part of its own wire and not the rest, with no pattern that makes sense until you compute both subnets.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — pasting an AI-generated subnet table into the lab.</strong> A wrong broadcast address reads exactly like a right one and there is no syntax error to catch it. <b>Symptom:</b> everything configures cleanly and one link silently does not work. Verify every row with <code>python3 ipaddress</code> before typing it into a device.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — testing only what you configured last.</strong> After changing R2, test R1 to R3 as well. <b>Symptom:</b> the lab passes your spot check and fails the assessment, because routing is end-to-end and a change on one router can break a path you were not looking at.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — bảng đúng mà cổng đang tắt.</strong> Mọi địa chỉ đều đúng, không có gì chuyển tiếp. <b>Triệu chứng:</b> <code>show ip interface brief</code> ghi <em>administratively down</em>, và <code>show ip route</code> không có tuyến kết nối nào cho nó. Một câu lệnh là xong: <code>no shutdown</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — cổng ra nằm ngoài subnet của chính nó.</strong> Một PC trong 192.168.20.96/28 với cổng ra .65 hoàn toàn không tới được cổng ra, vì .65 không nằm trong .96-.111. <b>Triệu chứng:</b> ping nội bộ chạy, mọi thứ ngoài subnet thì hết giờ. Luôn kiểm xem cổng ra có nằm giữa địa chỉ dùng được đầu và cuối của subnet không.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — trên PC chỉ đọc mỗi địa chỉ.</strong> Mặt nạ là cái trường sinh ra những triệu chứng lạ lùng nhất, và nó lại là cái người ta hay đọc lướt. <b>Triệu chứng:</b> một host tới được một phần sợi dây của chính nó mà không tới được phần còn lại, theo một quy luật chẳng ra đâu vào đâu cho tới khi bạn tính cả hai subnet.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — dán một bảng subnet do AI sinh ra vào bài lab.</strong> Một địa chỉ broadcast sai đọc lên y hệt một cái đúng và không có lỗi cú pháp nào để bắt nó. <b>Triệu chứng:</b> mọi thứ cấu hình trơn tru và một đường lặng lẽ không chạy. Hãy kiểm từng dòng bằng <code>python3 ipaddress</code> trước khi gõ nó vào thiết bị.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — chỉ thử đúng thứ vừa cấu hình xong.</strong> Sau khi đổi R2, hãy thử cả đường R1 tới R3. <b>Triệu chứng:</b> bài lab qua được phép thử vội của bạn rồi trượt lúc bị chấm, vì định tuyến là chuyện đầu-cuối và một thay đổi trên một router có thể làm hỏng một đường mà bạn không nhìn tới.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> Using the VLSM table from lesson 10.2, write the full IOS configuration for R2, which connects to R1 over the first WAN link, to R3 over the second, and hosts the Admin LAN. Give each interface its gateway address.</p>
<div class="dap-an"><p>R2 takes the <em>second</em> usable address on the R1-R2 link and the <em>first</em> on the R2-R3 link, so that the addresses are unambiguous.</p>
<pre><code class="language-bash">enable
configure terminal
hostname R2
!
! Admin LAN — 192.168.20.96/28, gateway .97
interface gigabitEthernet 0/0
 description Admin LAN 192.168.20.96/28
 ip address 192.168.20.97 255.255.255.240
 no shutdown
!
! WAN to R1 — 192.168.20.112/30, R1 has .113 so R2 takes .114
interface serial 0/0/0
 description WAN to R1
 ip address 192.168.20.114 255.255.255.252
 no shutdown
!
! WAN to R3 — 192.168.20.116/30, R2 is DCE here so it sets the clock
interface serial 0/0/1
 description WAN to R3
 ip address 192.168.20.117 255.255.255.252
 clock rate 64000
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p>Note that <code>clock rate</code> appears on serial 0/0/1 only. It belongs on whichever end holds the DCE cable, and putting it on the DTE end is accepted and silently ignored.</p></div>

<p><b>E2.</b> A PC on the Admin LAN is set to 192.168.20.100 / 255.255.255.0 / gateway 192.168.20.65. List, in order, what happens when it pings 192.168.20.105 and then 192.168.20.65, and give the corrected settings.</p>
<div class="dap-an"><p><b>Ping to .105.</b> The PC ANDs .105 with its /24 mask, gets 192.168.20.0, which matches its own network under that mask. It treats .105 as local, ARPs for it on the wire, and .105 answers — because .105 genuinely is on the same segment, inside 192.168.20.96/28. <b>This ping succeeds</b>, which is what makes the fault confusing.</p>
<p><b>Ping to .65.</b> Same calculation: 192.168.20.0, also "local" under the wrong mask. So the PC ARPs for .65 on its own wire. But .65 is Engineering's gateway, on a different segment behind R1, and no device on this wire owns that address. Nobody answers the ARP, so the PC never gets a MAC address, never builds a frame, and the ping fails with <em>host unreachable</em> rather than a timeout. <b>This ping fails.</b></p>
<p><b>Corrected:</b> address 192.168.20.100, mask <b>255.255.255.240</b> (/28), gateway <b>192.168.20.97</b>. With the right mask the PC computes its network as 192.168.20.96/28, sees .65 as remote, and hands the packet to .97 — which is on its wire and does answer.</p>
<p>The lesson: a wrong mask does not fail cleanly. It makes a host believe a larger or smaller set of addresses is local than really is, and the resulting mixture of working and broken depends entirely on which addresses you happen to test.</p></div>

<p><b>E3.</b> ★ On a server you administer, <code>ip -br addr</code> shows <code>172.18.0.1/16</code> on a Docker bridge. Your employer's VPN pushes a route for <code>172.16.0.0/12</code>. Predict what breaks, and prove the overlap.</p>
<div class="dap-an"><p><b>172.16.0.0/12 covers 172.16.0.0 to 172.31.255.255</b>, and 172.18.0.0/16 sits entirely inside that. So while the VPN is connected, your machine has two routes that both claim 172.18.x.x.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_network('172.16.0.0/12'); b=i.ip_network('172.18.0.0/16'); print(a[0], a[-1]); print('overlap:', a.overlaps(b), '| b inside a:', b.subnet_of(a))"</code></pre>
<pre><code class="language-plaintext">172.16.0.0 172.31.255.255
overlap: True | b inside a: True</code></pre>
<p><b>What breaks:</b> Linux prefers the most specific route, so /16 normally wins over /12 and containers keep working. But anything the VPN offers <em>inside</em> 172.18.x.x becomes unreachable, and if the VPN client installs a more specific route or a policy rule, the containers go dark instead — from the office only, with no Docker error anywhere.</p>
<p><b>The fix</b> is to move the Docker network out of the way, by setting an explicit subnet in the compose file that the VPN does not cover. The diagnosis, though, is the point: two CIDR blocks, one <code>overlaps()</code> call, thirty seconds.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Dùng bảng VLSM của bài 10.2, hãy viết cấu hình IOS đầy đủ cho R2, con router nối với R1 qua đường WAN thứ nhất, nối với R3 qua đường thứ hai, và mang LAN Hành chính. Cho mỗi cổng địa chỉ cổng ra của nó.</p>
<div class="dap-an"><p>R2 lấy địa chỉ dùng được <em>thứ hai</em> trên đường R1-R2 và <em>thứ nhất</em> trên đường R2-R3, để các địa chỉ không mơ hồ.</p>
<pre><code class="language-bash">enable
configure terminal
hostname R2
!
! LAN Hành chính — 192.168.20.96/28, cổng ra .97
interface gigabitEthernet 0/0
 description Admin LAN 192.168.20.96/28
 ip address 192.168.20.97 255.255.255.240
 no shutdown
!
! WAN sang R1 — 192.168.20.112/30, R1 giữ .113 nên R2 lấy .114
interface serial 0/0/0
 description WAN to R1
 ip address 192.168.20.114 255.255.255.252
 no shutdown
!
! WAN sang R3 — 192.168.20.116/30, ở đây R2 là DCE nên nó đặt xung nhịp
interface serial 0/0/1
 description WAN to R3
 ip address 192.168.20.117 255.255.255.252
 clock rate 64000
 no shutdown
!
end
copy running-config startup-config</code></pre>
<p>Để ý rằng <code>clock rate</code> chỉ xuất hiện trên serial 0/0/1. Nó thuộc về đầu nào cầm sợi cáp DCE, và đặt nó ở đầu DTE thì được chấp nhận rồi bị bỏ qua lặng lẽ.</p></div>

<p><b>E2.</b> Một PC trên LAN Hành chính được đặt 192.168.20.100 / 255.255.255.0 / cổng ra 192.168.20.65. Hãy liệt kê theo thứ tự điều gì xảy ra khi nó ping 192.168.20.105 rồi ping 192.168.20.65, và cho biết cấu hình đúng.</p>
<div class="dap-an"><p><b>Ping tới .105.</b> PC lấy .105 AND với mặt nạ /24 của nó, ra 192.168.20.0, trùng với mạng của chính nó dưới mặt nạ đó. Nó coi .105 là nội bộ, đi ARP tìm trên dây, và .105 trả lời — vì .105 thật sự nằm trên cùng đoạn mạng, bên trong 192.168.20.96/28. <b>Cú ping này thành công</b>, và chính điều đó làm cái hỏng trở nên khó hiểu.</p>
<p><b>Ping tới .65.</b> Cùng phép tính: ra 192.168.20.0, cũng "nội bộ" dưới cái mặt nạ sai. Nên PC đi ARP tìm .65 ngay trên dây của nó. Nhưng .65 là cổng ra của mạng Kỹ thuật, ở một đoạn khác phía sau R1, và không thiết bị nào trên sợi dây này sở hữu địa chỉ đó. Không ai đáp lại ARP, nên PC không bao giờ có được địa chỉ MAC, không bao giờ dựng được khung, và cú ping hỏng với thông báo <em>host unreachable</em> chứ không phải hết giờ. <b>Cú ping này hỏng.</b></p>
<p><b>Cấu hình đúng:</b> địa chỉ 192.168.20.100, mặt nạ <b>255.255.255.240</b> (/28), cổng ra <b>192.168.20.97</b>. Với mặt nạ đúng thì PC tính ra mạng của nó là 192.168.20.96/28, thấy .65 là ở xa, và đưa gói cho .97 — cái nằm trên dây của nó và có trả lời.</p>
<p>Bài học: một mặt nạ sai không hỏng một cách gọn ghẽ. Nó làm một host tin rằng tập địa chỉ nội bộ lớn hơn hoặc nhỏ hơn thực tế, và cái hỗn hợp vừa chạy vừa hỏng sinh ra từ đó phụ thuộc hoàn toàn vào chuyện bạn tình cờ thử địa chỉ nào.</p></div>

<p><b>E3.</b> ★ Trên một máy chủ bạn quản trị, <code>ip -br addr</code> hiện <code>172.18.0.1/16</code> trên một cầu Docker. Đường VPN của công ty đẩy xuống một tuyến cho <code>172.16.0.0/12</code>. Hãy dự đoán cái gì hỏng, và chứng minh chỗ chồng lấn.</p>
<div class="dap-an"><p><b>172.16.0.0/12 phủ từ 172.16.0.0 tới 172.31.255.255</b>, và 172.18.0.0/16 nằm trọn bên trong đó. Vậy trong lúc VPN đang nối, máy của bạn có hai tuyến cùng nhận 172.18.x.x.</p>
<pre><code class="language-bash">python3 -c "import ipaddress as i; a=i.ip_network('172.16.0.0/12'); b=i.ip_network('172.18.0.0/16'); print(a[0], a[-1]); print('overlap:', a.overlaps(b), '| b inside a:', b.subnet_of(a))"</code></pre>
<pre><code class="language-plaintext">172.16.0.0 172.31.255.255
overlap: True | b inside a: True</code></pre>
<p><b>Cái gì hỏng:</b> Linux ưu tiên tuyến cụ thể hơn, nên /16 bình thường sẽ thắng /12 và container vẫn chạy. Nhưng bất cứ thứ gì VPN cung cấp <em>bên trong</em> 172.18.x.x thì trở nên không tới được, và nếu phần mềm VPN cài một tuyến cụ thể hơn hoặc một luật policy thì ngược lại, container tắt ngóm — chỉ khi ngồi ở công ty, và không có lỗi Docker nào ở đâu cả.</p>
<p><b>Cách sửa</b> là dời mạng Docker ra khỏi đường, bằng cách khai một subnet tường minh trong file compose mà VPN không phủ. Nhưng phần đáng nói là cách chẩn đoán: hai khối CIDR, một lời gọi <code>overlaps()</code>, ba mươi giây.</p></div>`,
    ),

    cq(32, [
      ['CQ11.2',
        'Compare and constrast the characteristics and uses of the unicast, broadcast and multicast IPv4 address',
        'So sánh và đối chiếu đặc điểm cùng cách dùng của địa chỉ IPv4 unicast, broadcast và multicast'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question.</strong> It is quoted exactly as the school published it, including the spelling of "constrast". Note that it asks about section <strong>10.2</strong>, which belongs to session <strong>30</strong> — two sessions earlier than where the table places it. The full answer is in lesson 10.1 of this chapter; in summary:</p>
<ul>
<li><strong>Unicast</strong> — one destination host address, one receiver. Essentially all application traffic. Uses the normal address ranges.</li>
<li><strong>Broadcast</strong> — every host on the subnet must process it. Limited (255.255.255.255) is never forwarded by a router; directed (the subnet's own .255) is dropped by default on Cisco gear since IOS 12.0 because of the Smurf attack. Used by DHCP Discover and by ARP at layer 2.</li>
<li><strong>Multicast</strong> — 224.0.0.0/4, delivered only to hosts that joined the group, so non-members are not interrupted at all. Used by routing protocols (224.0.0.5 and .6 for OSPF, 224.0.0.9 for RIPv2) and by mDNS (224.0.0.251).</li>
</ul>
<p><strong>The contrast worth making out loud in the dialogue assessment</strong> is efficiency versus reach: broadcast reaches everyone at the cost of interrupting everyone, multicast reaches exactly the interested parties at the cost of requiring group membership, and unicast is precise but needs one copy per receiver.</p></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này.</strong> Nó được trích nguyên văn như trường công bố, kể cả chỗ viết sai chính tả "constrast". Để ý rằng nó hỏi về mục <strong>10.2</strong>, vốn thuộc buổi <strong>30</strong> — sớm hơn hai buổi so với chỗ mà bảng đặt nó vào. Câu trả lời đầy đủ nằm ở bài 10.1 của chương này; tóm tắt lại:</p>
<ul>
<li><strong>Unicast</strong> — một địa chỉ host đích, một người nhận. Về cơ bản là toàn bộ lưu lượng ứng dụng. Dùng các dải địa chỉ thông thường.</li>
<li><strong>Broadcast</strong> — mọi host trên subnet buộc phải xử lý nó. Loại giới hạn (255.255.255.255) không bao giờ được router chuyển tiếp; loại có hướng (địa chỉ .255 của chính subnet) bị thiết bị Cisco vứt mặc định từ IOS 12.0 vì đòn tấn công Smurf. Được DHCP Discover dùng, và ARP dùng ở tầng 2.</li>
<li><strong>Multicast</strong> — 224.0.0.0/4, chỉ giao tới những host đã tham gia nhóm, nên người ngoài nhóm hoàn toàn không bị làm phiền. Được các giao thức định tuyến dùng (224.0.0.5 và .6 cho OSPF, 224.0.0.9 cho RIPv2) và mDNS dùng (224.0.0.251).</li>
</ul>
<p><strong>Chỗ đối chiếu đáng nói thành lời trong buổi vấn đáp</strong> là hiệu quả đổi lấy tầm với: broadcast tới được mọi người với cái giá là làm phiền mọi người, multicast tới đúng những bên quan tâm với cái giá là phải có cơ chế tham gia nhóm, còn unicast thì chính xác nhưng cần một bản sao cho mỗi người nhận.</p></div>`,
    ),

    cq(33, [
      ['CQ11.3',
        'how many are there type of the IPv4 address? How to use it?',
        'có bao nhiêu loại địa chỉ IPv4? Dùng chúng thế nào?'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question.</strong> Quoted exactly, including the grammar. It asks about section <strong>10.3</strong>, which also belongs to session <strong>30</strong>. Answering it well means noticing that "type" can be read two ways, and saying so:</p>
<p><strong>By delivery</strong> — three: unicast, broadcast, multicast. That is CQ11.2's answer.</p>
<p><strong>By address range and purpose</strong> — these, which is what section 10.3 actually covers:</p>
<ul>
<li><strong>Public</strong> — globally unique, allocated by a registry, routable on the Internet.</li>
<li><strong>Private (RFC 1918)</strong> — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Reusable, never routed publicly, reaches the Internet only through NAT.</li>
<li><strong>Loopback</strong> — 127.0.0.0/8. Never leaves the host.</li>
<li><strong>Link-local (APIPA)</strong> — 169.254.0.0/16. Self-assigned when DHCP fails; also where cloud metadata lives, at 169.254.169.254.</li>
<li><strong>Multicast</strong> — 224.0.0.0/4, and <strong>experimental</strong> 240.0.0.0/4, which is reserved and unusable.</li>
<li><strong>TEST-NET</strong> — 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24. Documentation only.</li>
<li>★ <strong>CGNAT</strong> — 100.64.0.0/10 (RFC 6598), which the school's material predates but which you will meet on any mobile connection.</li>
</ul>
<p><strong>"How to use it"</strong> is the half people skip. Private space inside your network plus NAT at the edge; public space only where something must be reachable from outside; loopback for services bound to the local machine only; and never assign link-local, multicast or TEST-NET addresses to a real interface.</p></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này.</strong> Trích nguyên văn, kể cả chỗ sai ngữ pháp. Nó hỏi về mục <strong>10.3</strong>, cũng thuộc buổi <strong>30</strong>. Trả lời cho hay nghĩa là nhận ra chữ "loại" đọc được theo hai nghĩa, và nói rõ điều đó:</p>
<p><strong>Theo cách giao</strong> — ba loại: unicast, broadcast, multicast. Đó là đáp án của CQ11.2.</p>
<p><strong>Theo dải địa chỉ và mục đích</strong> — những loại sau, và đây mới là thứ mục 10.3 thật sự dạy:</p>
<ul>
<li><strong>Công cộng</strong> — duy nhất toàn cầu, do một cơ quan đăng ký cấp phát, định tuyến được trên Internet.</li>
<li><strong>Riêng (RFC 1918)</strong> — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Dùng lại được, không bao giờ định tuyến công khai, chỉ ra Internet qua NAT.</li>
<li><strong>Loopback</strong> — 127.0.0.0/8. Không bao giờ rời khỏi máy.</li>
<li><strong>Link-local (APIPA)</strong> — 169.254.0.0/16. Tự gán khi DHCP hỏng; cũng là chỗ metadata của đám mây nằm, ở 169.254.169.254.</li>
<li><strong>Multicast</strong> — 224.0.0.0/4, và dải <strong>thử nghiệm</strong> 240.0.0.0/4, vốn bị giữ lại và không dùng được.</li>
<li><strong>TEST-NET</strong> — 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24. Chỉ dùng cho tài liệu.</li>
<li>★ <strong>CGNAT</strong> — 100.64.0.0/10 (RFC 6598), có sau tài liệu của trường nhưng bạn sẽ gặp nó trên bất kỳ kết nối di động nào.</li>
</ul>
<p><strong>Phần "dùng chúng thế nào"</strong> là nửa mà người ta hay bỏ qua. Không gian riêng dùng bên trong mạng của bạn cộng với NAT ở biên; không gian công cộng chỉ dùng ở chỗ nào cần tới được từ bên ngoài; loopback cho dịch vụ chỉ gắn vào máy cục bộ; và tuyệt đối đừng gán địa chỉ link-local, multicast hay TEST-NET cho một cổng thật.</p></div>`,
    ),

    bi(
      `<div class="note-ct"><h3>💬 One more from the table — session 34</h3>
<p>The published table also assigns <strong>CQ12.1 — "What is the structure of an IPv4 address?"</strong> to session 34, which is the Midterm Progress Test. A written exam session with a discussion question attached to it is unusual, and the content belongs to section 10.1 — session 30 again.</p>
<p>Taken together, the four entries in this chapter's range (CQ11.1 at session 31, CQ11.2 at 32, CQ11.3 at 33, CQ12.1 at 34) are <strong>all displaced</strong>, and three of the four ask about material taught in session 30. The drift between the question numbering and the session plan has been running at about one chapter since session 19; this is where it is easiest to see.</p>
<p>We report the table as published. Do not change it in your own submissions either — if a lecturer asks about CQ12.1 during the midterm review, the expected answer is the one from lesson 10.1: 32 bits, four octets, split by the subnet mask into a network portion and a host portion, where the split is not fixed by the address itself.</p></div>`,
      `<div class="note-ct"><h3>💬 Thêm một câu nữa trong bảng — buổi 34</h3>
<p>Bảng đã công bố còn gán <strong>CQ12.1 — "What is the structure of an IPv4 address?"</strong> cho buổi 34, tức buổi thi giữa kỳ. Một buổi thi viết mà lại kèm một câu hỏi thảo luận là chuyện bất thường, và nội dung của nó thuộc về mục 10.1 — lại là buổi 30.</p>
<p>Gộp lại, bốn mục trong phạm vi chương này (CQ11.1 ở buổi 31, CQ11.2 ở 32, CQ11.3 ở 33, CQ12.1 ở 34) đều <strong>bị lệch chỗ</strong>, và ba trong bốn câu hỏi về nội dung được dạy ở buổi 30. Độ trôi giữa cách đánh số câu hỏi và kế hoạch buổi học đã chạy ở mức khoảng một chương kể từ buổi 19; đây là chỗ dễ thấy nhất.</p>
<p>Chúng tôi nêu đúng bảng như đã công bố. Bạn cũng đừng tự sửa nó trong bài nộp của mình — nếu giảng viên hỏi về CQ12.1 trong buổi ôn giữa kỳ thì đáp án được mong đợi là đáp án ở bài 10.1: 32 bit, bốn octet, được mặt nạ mạng chia thành phần mạng và phần host, mà chỗ chia ấy không do bản thân địa chỉ quy định.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 10 — IPv4 Addressing|||Quiz Chương 10 — Địa chỉ IPv4',
  slug: 'nwc204-ch10-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 10: phép AND ra địa chỉ mạng, kích thước khối, số host dùng được và nguồn gốc phép trừ 2, khối kế tiếp bắt đầu ở đâu, biên thật của 172.16.0.0/12, ý nghĩa của 169.254.x.x, vì sao chia đều hết chỗ còn VLSM thì không, chọn tiền tố theo số host và theo số subnet, thứ tự cấp phát VLSM, /31, hai máy cùng dây khác mặt nạ, và một vụ đụng dải CIDR giữa Docker với VPN. Mỗi câu có giải thích, mọi con số đã kiểm bằng python3.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Which network does 192.168.1.200 with mask 255.255.255.192 belong to?|||Địa chỉ 192.168.1.200 với mặt nạ 255.255.255.192 thuộc mạng nào?',
        ['192.168.1.0', '192.168.1.128', '192.168.1.192', '192.168.1.200'],
        2,
        'Block size = 256 - 192 = 64, so subnets start at .0, .64, .128, .192. The largest multiple of 64 not greater than 200 is 192, giving 192.168.1.192/26. The same result comes from the bitwise AND: 11001000 AND 11000000 = 11000000 = 192. An address is never its own network unless the host bits are all zero.|||Kích thước khối = 256 - 192 = 64, nên các subnet bắt đầu ở .0, .64, .128, .192. Bội số lớn nhất của 64 mà không vượt quá 200 là 192, cho ra 192.168.1.192/26. Kết quả y hệt suy ra từ phép AND theo bit: 11001000 AND 11000000 = 11000000 = 192. Một địa chỉ không bao giờ là mạng của chính nó trừ khi mọi bit host đều bằng 0.'),

      q('How many usable host addresses are in a /27 subnet?|||Một subnet /27 có bao nhiêu địa chỉ host dùng được?',
        ['32', '30', '28', '16'],
        1,
        'A /27 leaves 5 host bits, so 2^5 = 32 addresses in the block, minus the network address and the broadcast address = 30 usable. Both 32 and 30 are correct answers to different questions: 32 is the block size, 30 is the host count. The minus two is not a safety margin, it is two specific addresses with two specific jobs.|||Một /27 để lại 5 bit host, nên 2^5 = 32 địa chỉ trong khối, trừ địa chỉ mạng và địa chỉ broadcast = 30 cái dùng được. Cả 32 lẫn 30 đều là đáp án đúng cho hai câu hỏi khác nhau: 32 là kích thước khối, 30 là số host. Phép trừ hai không phải biên an toàn, nó là hai địa chỉ cụ thể với hai nhiệm vụ cụ thể.'),

      q('A /26 subnet starts at 192.168.20.0. At which address does the NEXT subnet start?|||Một subnet /26 bắt đầu ở 192.168.20.0. Subnet KẾ TIẾP bắt đầu ở địa chỉ nào?',
        ['192.168.20.62', '192.168.20.63', '192.168.20.64', '192.168.20.65'],
        2,
        'The last usable host is .62 and the broadcast is .63, so the next block starts at broadcast + 1 = .64. Starting at .63 is the single most common VLSM error: it places two subnets one address apart so they overlap, and nothing warns you — some hosts simply become unreachable. Always advance from the broadcast, never from the last host.|||Host dùng được cuối cùng là .62 và broadcast là .63, nên khối kế tiếp bắt đầu ở broadcast + 1 = .64. Bắt đầu ở .63 là lỗi VLSM hay gặp nhất: nó đặt hai subnet lệch nhau một địa chỉ nên chúng chồng lên nhau, và không có gì cảnh báo bạn — chỉ là vài host đơn giản trở nên không tới được. Luôn tiến lên từ broadcast, không bao giờ từ host cuối.'),

      q('Where does the private range 172.16.0.0/12 actually end?|||Dải riêng 172.16.0.0/12 thật ra kết thúc ở đâu?',
        ['172.16.255.255', '172.20.255.255', '172.31.255.255', '172.255.255.255'],
        2,
        'A /12 has 12 network bits, so the second octet is not fixed at 16 — it runs from 16 to 31, ending at 172.31.255.255. That is 1,048,576 addresses. 172.20.0.1 is therefore private, while 172.32.0.1 is a PUBLIC address belonging to somebody else, and using it internally means you can never reach its real owner. A firewall rule written as /12 admits sixteen times the space most people picture.|||Một /12 có 12 bit mạng, nên octet thứ hai không bị cố định ở 16 — nó chạy từ 16 đến 31, kết thúc ở 172.31.255.255. Tức 1.048.576 địa chỉ. Vậy 172.20.0.1 là địa chỉ riêng, còn 172.32.0.1 là một địa chỉ CÔNG CỘNG thuộc về người khác, dùng nó trong nội bộ nghĩa là bạn vĩnh viễn không tới được chủ thật của nó. Một luật tường lửa viết là /12 cho vào gấp mười sáu lần không gian mà phần lớn người ta hình dung.'),

      q('A PC shows the address 169.254.12.7. What does that tell you?|||Một cái PC hiện địa chỉ 169.254.12.7. Điều đó cho bạn biết gì?',
        ['It is on a private RFC 1918 network|||Nó đang ở trên một mạng riêng RFC 1918', 'DHCP failed and the host assigned the address to itself|||DHCP hỏng và host tự gán địa chỉ cho chính nó', 'It is behind carrier-grade NAT|||Nó đang nằm sau NAT của nhà mạng', 'The address is a multicast group|||Địa chỉ đó là một nhóm multicast'],
        1,
        '169.254.0.0/16 is link-local, also called APIPA. A host that asked for DHCP and received no answer gives itself one of these, so seeing it is a complete diagnosis on its own: look at the DHCP server or the path to it, not at the PC. Note the related address 169.254.169.254, which is the cloud metadata service on AWS, GCP and Azure — it sits in this range precisely so it can never be routed off the host.|||169.254.0.0/16 là link-local, còn gọi là APIPA. Một host hỏi DHCP mà không nhận được câu trả lời thì tự gán cho mình một địa chỉ loại này, nên nhìn thấy nó là đã có một chẩn đoán đầy đủ: hãy đi xem máy chủ DHCP hoặc đường tới nó, đừng xem cái PC. Để ý địa chỉ họ hàng 169.254.169.254, là dịch vụ metadata của đám mây trên AWS, GCP và Azure — nó nằm trong dải này đúng để không bao giờ bị định tuyến ra khỏi máy chủ.'),

      q('You must address five networks needing 58, 28, 12, 2 and 2 hosts from one /24. What happens if you cut it into equal /26 blocks?|||Bạn phải đánh địa chỉ năm mạng cần 58, 28, 12, 2 và 2 host từ một /24. Chuyện gì xảy ra nếu bạn cắt nó thành các khối /26 đều nhau?',
        ['All five fit with room to spare|||Cả năm vừa vặn và còn dư chỗ', 'A /24 holds only four /26 blocks, so the fifth network has nowhere to go|||Một /24 chỉ chứa bốn khối /26, nên mạng thứ năm không có chỗ nào để đi', 'The two WAN links can share one block|||Hai đường WAN có thể dùng chung một khối', 'It works but the masks must be identical|||Nó vẫn chạy nhưng các mặt nạ phải giống hệt nhau'],
        1,
        'A /24 contains exactly four /26 blocks and there are five networks, so you run out. Worse, the four that did fit wasted 144 addresses: Engineering used 28 of 62, Admin 12 of 62, and a WAN link 2 of 62. Fixed-size subnetting forces every network to be as large as the largest one. VLSM removes that constraint and fits all five in 120 of the 256 addresses, leaving 136 free.|||Một /24 chứa đúng bốn khối /26 mà có năm mạng, nên bạn hết chỗ. Tệ hơn, bốn cái vừa được thì phí 144 địa chỉ: Kỹ thuật dùng 28 trên 62, Hành chính 12 trên 62, và một đường WAN dùng 2 trên 62. Chia đều bắt mọi mạng phải to bằng mạng to nhất. VLSM gỡ ràng buộc đó và nhét cả năm vào 120 trên 256 địa chỉ, còn dư 136.'),

      q('A department needs 500 hosts. Which prefix is the smallest that fits?|||Một phòng ban cần 500 host. Tiền tố nhỏ nhất còn vừa là cái nào?',
        ['/22', '/23', '/24', '/25'],
        1,
        'Work upward with 2^h - 2. A /24 leaves 8 host bits: 254, too few. A /23 leaves 9: 2^9 - 2 = 510, which fits. A /22 would give 1,022 and work, but the question asks for the smallest that fits, and over-allocating wastes 512 addresses. Hosts-first questions always round UP to the next size that fits, because a subnet one address too small is useless.|||Đi lên dần bằng 2^h - 2. Một /24 để lại 8 bit host: 254, quá ít. Một /23 để lại 9: 2^9 - 2 = 510, vừa. Một /22 cho 1.022 và cũng chạy được, nhưng câu hỏi đòi cái nhỏ nhất còn vừa, và cấp thừa thì phí 512 địa chỉ. Câu hỏi theo-số-host thì luôn làm tròn LÊN tới cỡ kế tiếp còn vừa, vì một subnet thiếu một địa chỉ là một subnet vô dụng.'),

      q('You need six separate networks from one /24. How many bits do you borrow, and what do you get?|||Bạn cần sáu mạng riêng từ một /24. Mượn bao nhiêu bit, và được gì?',
        ['2 bits, /26, 4 subnets of 62 hosts|||2 bit, /26, 4 subnet mỗi cái 62 host', '3 bits, /27, 8 subnets of 30 hosts|||3 bit, /27, 8 subnet mỗi cái 30 host', '6 bits, /30, 64 subnets of 2 hosts|||6 bit, /30, 64 subnet mỗi cái 2 host', '3 bits, /27, 6 subnets of 30 hosts|||3 bit, /27, 6 subnet mỗi cái 30 host'],
        1,
        'This is a subnets-first question, so use 2^n where n is the bits borrowed. 2^2 = 4, not enough for six. 2^3 = 8, enough. Borrowing 3 bits gives /27, and 5 host bits remain, so 2^5 - 2 = 30 hosts per subnet. You get EIGHT subnets, not six — two are spare, and spares are growth room. The check n + h + prefix = 32 confirms it: 3 + 5 + 24 = 32.|||Đây là câu hỏi theo-số-subnet, nên dùng 2^n với n là số bit mượn. 2^2 = 4, không đủ cho sáu. 2^3 = 8, đủ. Mượn 3 bit ra /27, và còn lại 5 bit host, nên 2^5 - 2 = 30 host mỗi subnet. Bạn được TÁM subnet chứ không phải sáu — hai cái để dư, và cái dư là chỗ để lớn lên. Phép kiểm n + h + tiền tố = 32 xác nhận: 3 + 5 + 24 = 32.'),

      q('In VLSM, why must you allocate the largest requirement first?|||Trong VLSM, vì sao phải cấp phát yêu cầu lớn nhất trước?',
        ['To make the table easier to read|||Để bảng dễ đọc hơn', 'Because a large block can only start on an address that is a multiple of its size|||Vì một khối lớn chỉ bắt đầu được ở một địa chỉ là bội số của kích thước nó', 'Because routers process larger subnets first|||Vì router xử lý subnet lớn trước', 'It is only a convention and the order does not matter|||Đó chỉ là quy ước và thứ tự không quan trọng'],
        1,
        'A /26 must start at a multiple of 64. Place a /30 at .0 first and the next free address is .4, where no /26 can legally begin — Python rejects it with "has host bits set". You would have to skip forward to .64 and waste the 60 addresses in between. Allocating largest first keeps every boundary naturally aligned, so nothing is ever skipped. It is an arithmetic constraint, not a style preference.|||Một /26 buộc phải bắt đầu ở một bội số của 64. Đặt một /30 ở .0 trước thì địa chỉ trống kế tiếp là .4, chỗ mà không /26 nào bắt đầu hợp lệ được — Python từ chối nó với lỗi "has host bits set". Bạn sẽ phải nhảy tới .64 và phí 60 địa chỉ ở giữa. Cấp phát lớn trước giữ cho mọi ranh giới tự nhiên thẳng hàng, nên không bao giờ phải bỏ qua cái gì. Đó là một ràng buộc số học, không phải chuyện gu thẩm mỹ.'),

      q('How many usable addresses does a /31 subnet have?|||Một subnet /31 có bao nhiêu địa chỉ dùng được?',
        ['0', '1', '2', '4'],
        2,
        'A /31 has 2 addresses and, under RFC 3021, no network address and no broadcast — both are usable. That is exactly right for a point-to-point router link, which has exactly two interfaces. This is the one prefix where subtracting 2 gives a wrong answer, and it gives zero, which is how you know the rule is being misapplied. Use /30 in Packet Tracer and older IOS, which may reject /31, but expect to meet /31 in production.|||Một /31 có 2 địa chỉ và, theo RFC 3021, không có địa chỉ mạng cũng không có broadcast — cả hai đều dùng được. Đó đúng bằng thứ cần cho một đường nối router điểm-điểm, vốn có đúng hai cổng. Đây là tiền tố duy nhất mà trừ 2 cho ra đáp án sai, và nó cho ra số không, đó là cách bạn biết mình đang áp nhầm quy tắc. Dùng /30 trong Packet Tracer và IOS cũ vốn có thể từ chối /31, nhưng hãy chờ gặp /31 trong môi trường thật.'),

      q('Two PCs on the same switch: 192.168.1.10/24 and 192.168.1.200/26. Neither can ping the other. Why?|||Hai cái PC trên cùng một con switch: 192.168.1.10/24 và 192.168.1.200/26. Không máy nào ping được máy kia. Vì sao?',
        ['The cable is faulty|||Dây bị lỗi', 'They compute different networks, so each judges the other wrongly|||Hai máy tính ra hai mạng khác nhau, nên mỗi máy phán đoán sai về máy kia', 'One of the addresses is a broadcast address|||Một trong hai địa chỉ là địa chỉ broadcast', 'The switch needs a default gateway|||Con switch cần một cổng ra mặc định'],
        1,
        'The .10 machine ANDs with /24 and believes its network is 192.168.1.0/24, so it thinks .200 is local and ARPs for it. The .200 machine ANDs with /26 and believes its network is 192.168.1.192/26, so it thinks .10 is REMOTE and hands the packet to a gateway instead of ARPing. One side shouts and gets no useful reply, the other never shouts. A mask is a property of the subnet, not of a host, so every host on one wire must carry the same mask — two different masks on one segment IS the fault.|||Máy .10 lấy AND với /24 và tin rằng mạng của nó là 192.168.1.0/24, nên nó nghĩ .200 là nội bộ và đi ARP tìm. Máy .200 lấy AND với /26 và tin rằng mạng của nó là 192.168.1.192/26, nên nó nghĩ .10 là Ở XA và đưa gói cho cổng ra thay vì ARP. Một bên hét lên mà không nhận được lời đáp hữu ích, bên kia thì không hề hét. Mặt nạ là thuộc tính của subnet chứ không phải của một host, nên mọi host trên cùng một sợi dây phải mang cùng một mặt nạ — hai mặt nạ khác nhau trên một đoạn mạng CHÍNH LÀ cái sai.'),

      q('Your server has a Docker bridge on 172.18.0.0/16. The office VPN pushes a route for 172.16.0.0/12. What is the relationship?|||Máy chủ của bạn có một cầu Docker ở 172.18.0.0/16. Đường VPN của công ty đẩy xuống một tuyến cho 172.16.0.0/12. Quan hệ giữa hai cái là gì?',
        ['They are unrelated ranges|||Đó là hai dải không liên quan', 'The Docker network sits entirely INSIDE the VPN route, so they collide|||Mạng Docker nằm TRỌN bên trong tuyến VPN, nên chúng đụng nhau', 'The VPN route is invalid because /12 is not a legal prefix|||Tuyến VPN không hợp lệ vì /12 không phải tiền tố hợp lệ', 'Docker will refuse to start while the VPN is connected|||Docker sẽ không khởi động được trong lúc VPN đang nối'],
        1,
        '172.16.0.0/12 covers 172.16.0.0 to 172.31.255.255, and 172.18.0.0/16 is entirely inside it. While the VPN is up, two routes both claim 172.18.x.x. Linux prefers the more specific route so containers usually keep working, but anything the VPN offers inside 172.18.x.x becomes unreachable, and a more specific VPN route or policy rule makes the containers go dark instead — from the office only, with no Docker error anywhere. Diagnose it with one call: python3 ipaddress overlaps().|||172.16.0.0/12 phủ từ 172.16.0.0 tới 172.31.255.255, và 172.18.0.0/16 nằm trọn bên trong nó. Trong lúc VPN đang chạy, hai tuyến cùng nhận 172.18.x.x. Linux ưu tiên tuyến cụ thể hơn nên container thường vẫn chạy, nhưng bất cứ thứ gì VPN cung cấp bên trong 172.18.x.x thì trở nên không tới được, còn nếu VPN cài một tuyến cụ thể hơn hoặc một luật policy thì ngược lại, container tắt ngóm — chỉ khi ngồi ở công ty, và không có lỗi Docker nào ở đâu cả. Chẩn đoán bằng một lời gọi: python3 ipaddress overlaps().'),
    ],
  },
};

export default [
  {
    title: 'Chapter 10 — IPv4 Addressing (FLM sessions 30-34)|||Chương 10 — Địa chỉ IPv4 (buổi 30-34 của FLM)',
    slug: 'nwc204-chuong-10-dia-chi-ipv4',
    description: 'Cisco Module 11 theo đúng buổi 30-34 của FLM, chương nặng nhất của môn: 32 bit và bốn octet, mặt nạ quyết định ranh giới mạng/host, phép AND theo bit là thứ router thật sự làm, ba điểm cố định của mọi subnet và nguồn gốc phép trừ 2, đọc một subnet trong bốn dòng bằng kích thước khối, unicast so với broadcast so với multicast và hai loại broadcast, dải riêng RFC 1918 cùng loopback, link-local 169.254, CGNAT 100.64 và TEST-NET, lớp A/B/C đã chết, bốn lý do phân đoạn mạng; rồi mượn bit, hai công thức 2^n và 2^h trừ 2, chia /24 và /16 và /8, chọn tiền tố theo số host hay theo số subnet, VLSM từ chỗ chia đều hết chỗ tới vòng lặp bốn bước và lời giải đầy đủ, /30 và /31 cho đường WAN, thiết kế có cấu trúc và tóm tắt tuyến, công cụ AI và cách kiểm lại; và trọn Lab 2.2 với cấu hình IOS đầy đủ, trình tự nghiệm thu từ dưới lên, cùng phạm vi thi giữa kỳ buổi 34. Kèm phần ★ bổ sung: đọc ba mạng IPv4 trên một máy chủ thật, CIDR trong luật tường lửa và nginx, và ba kiểu đụng dải địa chỉ trông y như lỗi phần mềm. Mọi con số subnet đã kiểm bằng python3. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
