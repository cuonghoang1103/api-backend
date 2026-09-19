/**
 * SSL101c · Mooc 2 (deck 'ssl2') — slide 77→101, hết deck.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl2.txt báo "không có chữ" cho CẢ 25 slide của
 * đoạn này — nó KHÔNG dùng được. Toàn bộ 25 ảnh 077–101 đã được ĐỌC THẲNG TỪ
 * /tmp/ssl101c-slides/ssl2/NNN.webp, chữ chép lại đúng từng dòng.
 *
 * ⚠️ NỘI DUNG THẬT. Đoạn 77–101 KHÔNG phải là bài tập đánh giá cuối khoá như
 * đoán ban đầu. Nó gồm:
 *   · 77–78: NỐT phần 4.3 — chiến lược sáng tạo "Doing the Opposite" + slide
 *     tóm tắt đủ BA chiến lược sáng tạo
 *   · 79: 4.3b chuẩn đầu ra (đứng SAU slide tóm tắt của chính nó)
 *   · 80–85: 4.4a/4.4b — đánh giá giải pháp: HAI nhóm phương pháp, bốn bước
 *     Fogler & LeBlanc (1995), và đánh giá trong văn hoá học thuật
 *   · 86–94: 5.1a — truyền đạt giải pháp: BỐN hình thức (nói/hình/số/viết)
 *   · 95–96: 5.1b + tóm tắt truyền đạt giải pháp TRONG PHÒNG THI
 *   · 97–101: 5.3a/5.3b — giải quyết vấn đề theo NHÓM (Interaction + Structure)
 *
 * Đặc tính của chính file .pptx, đã đối chiếu 25 ảnh — bài này nói thẳng,
 * KHÔNG giả vờ các slide lặp là nội dung mới:
 *   · Khối chuẩn đầu ra LẶP: 80 ≡ 85 (4.4a ≡ 4.4b), 86 ≡ 87 ≡ 95 (5.1a ≡ 5.1b),
 *     97 ≡ 99 ≡ 100 (5.3a ≡ 5.3b), và slide 98 ≡ 101 lặp NGUYÊN KHỐI tóm tắt.
 *   · HAI slide 83 và 84 CÙNG tiêu đề "Evaluating solutions in academic culture"
 *     nhưng nội dung KHÁC HẲN nhau (nguyên tắc chung ↔ rubric/người chấm).
 *   · ĐỔI TÊN tiêu chí giữa slide 89 (Verbally/Visually/Numerically/Written) và
 *     slide tóm tắt 94 (Spoken/Numbers/Visuals/Writing).
 *   · SAI THỨ TỰ: slide 89 liệt kê Verbally→Visually→Numerically→Written nhưng
 *     các slide chi tiết lại chạy 90 Verbally → 91 Numerically → 92 Visually →
 *     93 Written.
 *   · Slide 99 dùng TEMPLATE KHÁC (không có khiên Sydney, chân trang
 *     "University of Sydney … Page 1", font khác, và viết "group problem
 *     solving" KHÔNG gạch nối trong khi 97/100 viết "problem-solving").
 *   · Mục 5.2 KHÔNG có slide chuẩn đầu ra trong deck ôn tập — chỉ còn mỗi slide
 *     tóm tắt 96 về phòng thi.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl2';

export default {
  title: '2.0d — Slide by slide: Doing the Opposite, evaluating solutions, communicating them, and group problem-solving (slides 77–101)|||2.0d — Slide bài giảng: Làm ngược lại, đánh giá giải pháp, truyền đạt giải pháp & giải quyết vấn đề theo nhóm (slide 77–101)',
  slug: 'ssl101c-2-0d-slides-danh-gia-truyen-dat-giai-phap-va-lam-viec-nhom',
  type: 'DOCUMENT',
  description: 'Đoạn cuối Mooc 2 của SSL101c (slide 77–101), đọc thẳng từ 25 ảnh slide gốc University of Sydney. Khép lại chiến lược sáng tạo thứ ba (Doing the Opposite) và bộ ba Random Juxtaposition · The Intermediate Impossible · Doing the Opposite; rồi ĐÁNH GIÁ giải pháp theo hai nhóm phương pháp (bốn bước Fogler & LeBlanc 1995 với musts/wants, và các nguyên tắc riêng của văn hoá học thuật); rồi TRUYỀN ĐẠT giải pháp bằng bốn hình thức nói/số/hình/viết cùng luật "truyền đạt CON ĐƯỜNG tới giải pháp, không chỉ giải pháp"; và khép Mooc 2 bằng giải quyết vấn đề theo NHÓM với hai trụ Interaction và Structure.',
  content: [
    walkHead(D, 77, 101),
    walk(D, [

      [77, 'Creative Strategy: Doing the Opposite — breaks down self-imposed boundaries (Cryer, 2006; de Bono, 1973)',
        `<p class="y-chinh">🎯 The third and last creative strategy of Mooc 2. The slide gives it exactly two justifications: it <strong>breaks down self-imposed boundaries</strong> and it <strong>helps you to understand the problem better</strong>. Source line printed on the slide: <em>(Cryer, 2006; de Bono, 1973)</em>.</p>
<ul>
<li><strong>What the technique is.</strong> Take the goal you are actually chasing, state its exact opposite, then work seriously on the opposite for a few minutes. "How do we make the app load faster?" becomes "how do we make the app load as slowly as possible?" You list the answers — load everything up-front, no caching, query in a loop — and each one, flipped, is a real fix.</li>
<li><strong>"Self-imposed boundaries" is the key phrase.</strong> Most stuck problems are not blocked by the rules of the world; they are blocked by assumptions nobody ever wrote down. Reversing the goal is a cheap way to make those assumptions visible, because the reversed version sounds absurd only where an assumption is hiding.</li>
<li><strong>Why it "helps you understand the problem better" — and not just solve it.</strong> To describe a perfect failure you must know precisely what success depends on. Doing the Opposite is therefore a diagnostic tool first and an idea generator second; that ordering is exactly how the slide phrases its two bullets.</li>
<li><strong>Note the two dates.</strong> <em>de Bono, 1973</em> is the lateral-thinking source; <em>Cryer, 2006</em> is the research-student handbook that re-packaged it for universities. Both citations appear together on slides 77 and 78, so the deck treats the whole creative-strategy block as coming from that pair.</li>
<li><strong>FPTU application.</strong> Your SWP391 team is two weeks behind schedule. Instead of "how do we catch up?", ask "how could we guarantee we finish even later?" — answers come fast: keep changing the scope, never merge branches, let one person own a module alone, hold no stand-ups. Flip each one and you have the actual recovery plan: freeze scope, merge daily, pair on the critical module, 10-minute daily check-in.</li>
</ul>
<p class="meo">💡 Memory hook for the exam: Doing the Opposite has <strong>2</strong> stated benefits (boundaries, understanding) and shares one citation line with the other creative strategies. If an option credits it with "guaranteeing an original solution", that is not what the slide claims.</p>`,
        `<p class="y-chinh">🎯 Chiến lược sáng tạo thứ ba và cũng là cuối cùng của Mooc 2. Slide cho nó đúng hai lý do tồn tại: nó <strong>phá vỡ những ranh giới do chính mình tự đặt ra</strong> (breaks down self-imposed boundaries) và nó <strong>giúp bạn hiểu vấn đề rõ hơn</strong>. Dòng nguồn in trên slide: <em>(Cryer, 2006; de Bono, 1973)</em>.</p>
<ul>
<li><strong>Kỹ thuật này là gì.</strong> Lấy mục tiêu bạn đang thật sự theo đuổi, phát biểu điều NGƯỢC LẠI hoàn toàn, rồi làm việc nghiêm túc với cái ngược đó vài phút. "Làm sao cho app tải nhanh hơn?" thành "làm sao cho app tải CHẬM NHẤT có thể?" Bạn liệt kê đáp án — tải hết mọi thứ ngay từ đầu, không cache, truy vấn trong vòng lặp — và mỗi đáp án lật ngược lại chính là một cách sửa thật.</li>
<li><strong>Cụm "self-imposed boundaries" là chìa khoá.</strong> Phần lớn vấn đề bị tắc KHÔNG phải vì luật của thế giới, mà vì những giả định chưa ai viết ra. Lật ngược mục tiêu là cách rẻ tiền để những giả định đó lộ diện, vì bản ngược chỉ nghe vô lý ở đúng chỗ đang có một giả định nấp.</li>
<li><strong>Vì sao nó "giúp hiểu vấn đề rõ hơn" chứ không chỉ giải được vấn đề.</strong> Muốn mô tả một thất bại hoàn hảo, bạn buộc phải biết chính xác thành công phụ thuộc vào cái gì. Vậy nên Doing the Opposite trước hết là công cụ CHẨN ĐOÁN, sau đó mới là máy sinh ý tưởng — đúng thứ tự hai gạch đầu dòng của slide.</li>
<li><strong>Để ý HAI mốc năm.</strong> <em>de Bono, 1973</em> là nguồn của tư duy ngoài lối mòn (lateral thinking); <em>Cryer, 2006</em> là cuốn cẩm nang dành cho nghiên cứu sinh đã đóng gói lại nó cho môi trường đại học. Hai trích dẫn này đi cùng nhau ở cả slide 77 và 78, tức là deck coi CẢ cụm chiến lược sáng tạo đến từ cặp nguồn đó.</li>
<li><strong>Áp vào FPTU.</strong> Nhóm SWP391 của bạn trễ tiến độ hai tuần. Thay vì hỏi "làm sao đuổi kịp?", hãy hỏi "làm thế nào để CHẮC CHẮN còn trễ hơn nữa?" — đáp án ra rất nhanh: cứ đổi phạm vi liên tục, không bao giờ merge nhánh, để một người ôm trọn một module, không họp ngày nào. Lật từng cái lại là ra đúng kế hoạch cứu vãn: đóng băng phạm vi, merge hằng ngày, ghép đôi ở module then chốt, họp nhanh 10 phút mỗi ngày.</li>
</ul>
<p class="meo">💡 Mẹo nhớ để thi: Doing the Opposite có ĐÚNG <strong>2</strong> lợi ích được nêu (phá ranh giới, hiểu vấn đề) và dùng chung một dòng trích nguồn với các chiến lược sáng tạo khác. Phương án nào gán cho nó công dụng "bảo đảm ra được giải pháp độc đáo" thì đó KHÔNG phải điều slide nói.</p>`],

      [78, 'Summary: Creative Strategies — creativity forms an integral part of academic culture (3 strategies)',
        `<p class="y-chinh">🎯 The summary slide for the whole creativity block. One headline claim — <strong>"Creativity forms an integral part of academic culture"</strong> — and beneath it exactly <strong>three named strategies</strong>: Random Juxtaposition, The Intermediate Impossible, Doing the Opposite. Same citation line: <em>(Cryer, 2006; de Bono, 1973)</em>.</p>
<table>
<tr><th>Strategy</th><th>The move in one line</th><th>What it is best at</th></tr>
<tr><td><strong>Random Juxtaposition</strong></td><td>Force your problem next to an unrelated object or word and list the links</td><td>Escaping a blank page; producing many raw ideas fast</td></tr>
<tr><td><strong>The Intermediate Impossible</strong></td><td>Accept an impossible idea on purpose as a stepping stone, then walk from it to something workable</td><td>Getting past "that would never work" too early</td></tr>
<tr><td><strong>Doing the Opposite</strong></td><td>State the reverse goal and solve that instead, then flip the answers</td><td>Exposing hidden assumptions; understanding the problem</td></tr>
</table>
<ul>
<li><strong>Count it: THREE, and the exam counts with you.</strong> The safest single fact to carry out of this block is the number and the three names in this order. A four-item option, or one that swaps in "brainstorming" or "mind mapping" as a fourth creative strategy, is wrong — those belong to earlier sections of Mooc 2, not to this list.</li>
<li><strong>The headline is an argument, not decoration.</strong> Students often file creativity under art subjects. The slide states the opposite: it is <em>integral</em> to academic culture, because research is by definition the production of something not already known. Marks for "originality" in a rubric are this claim made operational.</li>
<li><strong>All three share one mechanism: deliberately breaking a rule of ordinary thinking.</strong> Juxtaposition breaks relevance, the Intermediate Impossible breaks feasibility, Doing the Opposite breaks direction. Seeing the family resemblance makes all three easier to recall under time pressure.</li>
<li><strong>These are generators, not evaluators.</strong> Nothing here tells you whether an idea is good — that is precisely the job of section 4.4, which starts on the very next slides. Creativity widens the field; evaluation narrows it. Mooc 2 teaches them back to back on purpose.</li>
<li><strong>FPTU application.</strong> In a CodeLab or Capstone ideation session, run one round of each: 5 minutes juxtaposition (open a random Wikipedia page), 5 minutes intermediate impossible ("the app writes itself"), 5 minutes opposite ("how do we make users hate this?"). Fifteen minutes gives a longer candidate list than an hour of unstructured discussion.</li>
</ul>
<p class="pitfall">⚠️ Trap: treating creativity as a personality trait ("I am not a creative person"). Every one of the three items is a <strong>procedure</strong> with steps anyone can run. The slide calls them <em>strategies</em>, not talents — and that wording is exactly what a multiple-choice question will test.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt cho cả cụm sáng tạo. Một khẳng định tiêu đề — <strong>"Creativity forms an integral part of academic culture"</strong> (sáng tạo là một phần KHÔNG THỂ TÁCH RỜI của văn hoá học thuật) — và bên dưới là đúng <strong>ba chiến lược có tên</strong>: Random Juxtaposition, The Intermediate Impossible, Doing the Opposite. Vẫn dòng nguồn ấy: <em>(Cryer, 2006; de Bono, 1973)</em>.</p>
<table>
<tr><th>Chiến lược</th><th>Thao tác trong một dòng</th><th>Mạnh nhất ở chỗ nào</th></tr>
<tr><td><strong>Random Juxtaposition</strong><br/>(đặt cạnh ngẫu nhiên)</td><td>Ép vấn đề của bạn nằm cạnh một đồ vật/từ ngữ chẳng liên quan rồi liệt kê các mối nối</td><td>Thoát khỏi trang giấy trắng; ra thật nhiều ý thô thật nhanh</td></tr>
<tr><td><strong>The Intermediate Impossible</strong><br/>(cái bất khả trung gian)</td><td>Cố ý chấp nhận một ý bất khả thi làm bậc đá, rồi đi từ đó tới cái làm được</td><td>Không bị chặn quá sớm bởi câu "cái đó không bao giờ chạy được"</td></tr>
<tr><td><strong>Doing the Opposite</strong><br/>(làm ngược lại)</td><td>Phát biểu mục tiêu ngược rồi giải cái ngược đó, sau đó lật đáp án lại</td><td>Làm lộ giả định ngầm; hiểu rõ vấn đề</td></tr>
</table>
<ul>
<li><strong>Đếm đi: BA, và đề thi cũng đếm cùng bạn.</strong> Sự thật an toàn nhất mang ra khỏi cụm này là CON SỐ và ba cái tên theo đúng thứ tự. Phương án bốn mục, hoặc phương án nhét "brainstorming" / "mind mapping" vào làm chiến lược sáng tạo thứ tư, đều SAI — những thứ đó thuộc phần trước của Mooc 2, không thuộc danh sách này.</li>
<li><strong>Câu tiêu đề là một LẬP LUẬN, không phải trang trí.</strong> Sinh viên hay xếp sáng tạo vào nhóm môn nghệ thuật. Slide nói ngược lại: nó là phần <em>không thể tách rời</em> của văn hoá học thuật, vì nghiên cứu theo định nghĩa là tạo ra thứ chưa ai biết. Điểm "tính mới/originality" trong rubric chính là khẳng định này được đem ra chấm.</li>
<li><strong>Cả ba dùng CHUNG một cơ chế: cố tình phá một luật của lối nghĩ thông thường.</strong> Juxtaposition phá luật LIÊN QUAN, Intermediate Impossible phá luật KHẢ THI, Doing the Opposite phá luật CHIỀU HƯỚNG. Thấy được nét họ hàng đó thì nhớ cả ba dễ hơn nhiều lúc bị áp lực thời gian.</li>
<li><strong>Đây là công cụ SINH, không phải công cụ ĐÁNH GIÁ.</strong> Không có gì ở đây nói ý tưởng nào tốt — đó đúng là việc của mục 4.4, bắt đầu ngay ở các slide kế tiếp. Sáng tạo MỞ RỘNG vùng lựa chọn; đánh giá THU HẸP nó lại. Mooc 2 dạy hai cái liền nhau là có chủ đích.</li>
<li><strong>Áp vào FPTU.</strong> Trong buổi tìm ý tưởng của CodeLab hay Capstone, chạy mỗi thứ một vòng: 5 phút juxtaposition (mở một trang Wikipedia ngẫu nhiên), 5 phút intermediate impossible ("app tự viết ra chính nó"), 5 phút làm ngược ("làm sao cho người dùng GHÉT cái này?"). Mười lăm phút cho danh sách ứng viên dài hơn cả tiếng bàn luận không có cấu trúc.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: coi sáng tạo là một nét tính cách ("em không phải người sáng tạo"). Cả ba mục đều là <strong>QUY TRÌNH</strong> có các bước mà ai cũng chạy được. Slide gọi chúng là <em>strategies</em> (chiến lược), không phải tài năng — và chính chữ đó là thứ câu trắc nghiệm sẽ kiểm.</p>`],

      [79, '4.3b The Importance of Creativity (module objectives — printed AFTER its own summary)',
        `<p class="y-chinh">🎯 The objectives slide for sub-section 4.3b, with three outcomes: <strong>use lateral thinking techniques to solve problems</strong>, <strong>apply negative brainstorming techniques</strong>, and <strong>generate solutions to problems using unconventional &amp; alternative approaches</strong>.</p>
<ul>
<li><strong>Read the position of this slide, not just its words.</strong> It comes AFTER slide 78, which already summarised the creativity block. In a review deck the objectives page is a divider that got left in when the original teaching order was flattened — so do not read slide 79 as "new material after the summary". It is a label, printed late.</li>
<li><strong>"Negative brainstorming" is the term most likely to appear in the exam.</strong> It is the formal name of the family that Doing the Opposite belongs to: brainstorm how to <em>cause</em> the problem, make it worse, or guarantee failure — then invert the list. If a question asks which technique deliberately generates bad ideas, negative brainstorming is the answer.</li>
<li><strong>"Lateral thinking" points straight back at de Bono.</strong> Lateral thinking means moving sideways to a different framing instead of pushing harder in the current direction (which is vertical or logical thinking). All three strategies on slide 78 are lateral techniques.</li>
<li><strong>"Unconventional &amp; alternative approaches" is the outcome, not a fourth technique.</strong> The first two bullets name methods; the third names what you are able to produce once you have them. Exam options that list it as a separate strategy are misreading the slide.</li>
<li><strong>FPTU application.</strong> Before a Capstone defence, run a negative-brainstorm on your own project: "how would a hostile reviewer sink this in two minutes?" The list you produce is the same list the council will use — and you get to prepare answers first. This is negative brainstorming used as rehearsal, not as sabotage.</li>
</ul>
<table>
<tr><th>Objective wording on the slide</th><th>What it actually asks you to do</th></tr>
<tr><td>use lateral thinking techniques to solve problems</td><td>Change the framing sideways instead of pushing harder on the same line</td></tr>
<tr><td>apply negative brainstorming techniques</td><td>Generate ways to FAIL, then invert them into fixes</td></tr>
<tr><td>generate solutions … using unconventional &amp; alternative approaches</td><td>Produce options a conventional approach would never have reached</td></tr>
</table>
<p class="meo">💡 Pair to memorise: <strong>lateral thinking = de Bono, 1973</strong>; <strong>negative brainstorming = "brainstorm the failure, then flip it"</strong>. Two terms, two one-line definitions — that is the whole examinable content of this slide.</p>`,
        `<p class="y-chinh">🎯 Slide chuẩn đầu ra của tiểu mục 4.3b, với ba mục tiêu: <strong>dùng kỹ thuật tư duy ngoài lối mòn (lateral thinking) để giải quyết vấn đề</strong>, <strong>áp dụng kỹ thuật động não NGƯỢC (negative brainstorming)</strong>, và <strong>sinh ra giải pháp bằng những cách tiếp cận phi quy ước &amp; thay thế</strong>.</p>
<ul>
<li><strong>Hãy đọc VỊ TRÍ của slide này, không chỉ đọc chữ.</strong> Nó đứng SAU slide 78 — slide đã tóm tắt xong cả cụm sáng tạo. Trong một deck ôn tập, trang chuẩn đầu ra là tấm phân cách bị sót lại khi thứ tự dạy gốc bị dàn phẳng — nên ĐỪNG đọc slide 79 như "nội dung mới sau phần tóm tắt". Nó là một cái NHÃN, in muộn.</li>
<li><strong>"Negative brainstorming" là thuật ngữ dễ ra đề nhất ở đây.</strong> Đó là tên chính thức của họ kỹ thuật mà Doing the Opposite thuộc về: động não xem làm sao GÂY RA vấn đề, làm nó tệ hơn, hay bảo đảm thất bại — rồi lật ngược danh sách. Nếu đề hỏi kỹ thuật nào CỐ Ý sinh ra ý tưởng tồi, đáp án là negative brainstorming.</li>
<li><strong>"Lateral thinking" trỏ thẳng về de Bono.</strong> Tư duy ngoài lối mòn nghĩa là đi NGANG sang một khung nhìn khác, thay vì đẩy mạnh hơn theo hướng đang đi (đó là tư duy dọc/logic). Cả ba chiến lược ở slide 78 đều là kỹ thuật lateral.</li>
<li><strong>"Cách tiếp cận phi quy ước &amp; thay thế" là KẾT QUẢ, không phải kỹ thuật thứ tư.</strong> Hai gạch đầu dòng đầu gọi tên PHƯƠNG PHÁP; gạch thứ ba gọi tên thứ bạn LÀM ĐƯỢC khi đã có phương pháp. Phương án thi nào liệt kê nó thành một chiến lược riêng là đang đọc sai slide.</li>
<li><strong>Áp vào FPTU.</strong> Trước buổi bảo vệ Capstone, hãy chạy động não ngược lên chính đồ án của mình: "một người phản biện khó tính sẽ dìm đồ án này trong hai phút bằng cách nào?" Danh sách bạn viết ra chính là danh sách hội đồng sẽ dùng — và bạn được chuẩn bị câu trả lời trước. Đây là negative brainstorming dùng để DIỄN TẬP, không phải để phá.</li>
</ul>
<table>
<tr><th>Chữ trên slide</th><th>Thực chất đòi bạn làm gì</th></tr>
<tr><td>use lateral thinking techniques to solve problems</td><td>Đổi khung nhìn sang NGANG thay vì cố đẩy mạnh trên cùng một đường</td></tr>
<tr><td>apply negative brainstorming techniques</td><td>Nghĩ ra các cách để THẤT BẠI, rồi lật chúng thành cách sửa</td></tr>
<tr><td>generate solutions … using unconventional &amp; alternative approaches</td><td>Sinh ra phương án mà lối tiếp cận thông thường không bao giờ chạm tới</td></tr>
</table>
<p class="meo">💡 Cặp cần thuộc: <strong>lateral thinking = de Bono, 1973</strong>; <strong>negative brainstorming = "động não về thất bại rồi lật lại"</strong>. Hai thuật ngữ, hai định nghĩa một dòng — đó là toàn bộ phần ra đề được của slide này.</p>`],

      [80, '4.4a Evaluating solutions (module objectives — three outcomes)',
        `<p class="y-chinh">🎯 Section 4.4 opens: <strong>recognise techniques for the evaluation of solutions</strong>, <strong>understand the process of evaluating a solution</strong>, and <strong>evaluate solutions to a number of different problems and reflect on the process &amp; result</strong>. Creativity produced the options; this section decides which option survives.</p>
<ul>
<li><strong>The three verbs are a ladder, and they are in order.</strong> <em>Recognise</em> a technique (you can name it), <em>understand</em> the process (you can explain the steps), <em>evaluate and reflect</em> (you can run it on a real problem and then judge how the run went). Exam questions live mostly on the first two rungs; assignments live on the third.</li>
<li><strong>"Reflect on the process &amp; result" is two things, not one.</strong> The result answers "was the decision right?"; the process answers "was the way we decided sound?" A good decision reached by luck is still a bad process, and it will fail next time. This distinction is the single most-missed idea of section 4.4.</li>
<li><strong>Why evaluation needs teaching at all.</strong> Left alone, people pick the option they thought of first, or the one argued loudest. Evaluation makes the criteria explicit BEFORE the comparison, which is what stops the loudest voice from winning by default.</li>
<li><strong>Where it sits in the whole Mooc 2 arc.</strong> Define the problem → generate options (including creatively) → <strong>evaluate and choose</strong> → communicate the chosen solution (5.1) → do all of it as a group (5.3). Slides 80–85 are the middle link of that chain.</li>
<li><strong>FPTU application.</strong> SWP391 must choose a database. "Recognise a technique" = you know the weighted-criteria method exists. "Understand the process" = you can list Fogler &amp; LeBlanc's four steps from slide 82. "Evaluate and reflect" = you actually score PostgreSQL / MySQL / MongoDB against weighted criteria and afterwards write a paragraph on whether your weights were honest.</li>
</ul>
<p class="pitfall">⚠️ Careful: this exact three-bullet block is printed AGAIN on slide 85 under the heading 4.4b, with "and" changed to "&amp;". Same objectives, different section label — the deck is signposting, not adding content. Do not spend memory trying to distinguish 4.4a from 4.4b by their objectives; they are identical.</p>`,
        `<p class="y-chinh">🎯 Mục 4.4 mở màn: <strong>nhận diện được các kỹ thuật đánh giá giải pháp</strong>, <strong>hiểu quy trình đánh giá một giải pháp</strong>, và <strong>đánh giá giải pháp cho nhiều vấn đề khác nhau rồi phản tư về cả quy trình &amp; kết quả</strong>. Sáng tạo đẻ ra phương án; mục này quyết định phương án nào sống sót.</p>
<ul>
<li><strong>Ba động từ là một cái THANG, và chúng có thứ tự.</strong> <em>Recognise</em> — nhận ra kỹ thuật (gọi được tên), <em>understand</em> — hiểu quy trình (giải thích được các bước), <em>evaluate &amp; reflect</em> — chạy thật trên một vấn đề rồi tự đánh giá lần chạy đó. Câu trắc nghiệm sống chủ yếu ở hai bậc đầu; assignment sống ở bậc thứ ba.</li>
<li><strong>"Phản tư về quy trình &amp; kết quả" là HAI thứ, không phải một.</strong> Kết quả trả lời "quyết định có đúng không?"; quy trình trả lời "cách chúng ta quyết có vững không?" Một quyết định đúng nhờ ăn may vẫn là một quy trình tồi, và lần sau nó sẽ hỏng. Đây là ý bị bỏ sót nhiều nhất của mục 4.4.</li>
<li><strong>Vì sao đánh giá lại phải DẠY.</strong> Để mặc, người ta chọn phương án nghĩ ra đầu tiên, hoặc phương án được cãi to nhất. Đánh giá buộc phải nói rõ TIÊU CHÍ TRƯỚC khi so sánh — đó chính là thứ chặn không cho giọng to nhất thắng mặc định.</li>
<li><strong>Chỗ đứng của nó trong mạch Mooc 2.</strong> Định nghĩa vấn đề → sinh phương án (kể cả bằng sáng tạo) → <strong>đánh giá và chọn</strong> → truyền đạt giải pháp đã chọn (5.1) → làm tất cả những việc đó theo NHÓM (5.3). Slide 80–85 là mắt xích giữa của chuỗi ấy.</li>
<li><strong>Áp vào FPTU.</strong> Nhóm SWP391 phải chọn hệ quản trị CSDL. "Nhận diện kỹ thuật" = bạn biết có phương pháp chấm điểm theo tiêu chí có trọng số. "Hiểu quy trình" = bạn liệt kê được bốn bước Fogler &amp; LeBlanc ở slide 82. "Đánh giá và phản tư" = bạn thật sự chấm PostgreSQL / MySQL / MongoDB theo tiêu chí có trọng số, rồi viết một đoạn xem trọng số mình đặt có thành thật không.</li>
</ul>
<p class="pitfall">⚠️ Lưu ý: đúng khối ba gạch đầu dòng này được in LẠI ở slide 85 dưới tiêu đề 4.4b, chỉ đổi chữ "and" thành "&amp;". Cùng chuẩn đầu ra, khác nhãn mục — deck đang cắm biển chỉ đường chứ không thêm nội dung. Đừng tốn trí nhớ phân biệt 4.4a với 4.4b qua chuẩn đầu ra; chúng GIỐNG HỆT nhau.</p>`],

      [81, 'Two methods for evaluating solutions — 1. General methods 2. Methods specific to academic culture',
        `<p class="y-chinh">🎯 The structural slide of the whole section, and one of the easiest facts in the deck to be asked about: there are <strong>TWO</strong> kinds of evaluation method — <strong>1. General methods</strong> and <strong>2. Methods specific to academic culture</strong>. Everything in slides 82–84 hangs under one of these two headings.</p>
<table>
<tr><th></th><th>1. General methods</th><th>2. Methods specific to academic culture</th></tr>
<tr><td>Where it comes from</td><td>Decision science / engineering — Fogler &amp; LeBlanc (1995)</td><td>The conventions of your discipline and of the university</td></tr>
<tr><td>What it asks</td><td>"Which option scores highest against weighted criteria?"</td><td>"Would this be accepted as good work in MY field?"</td></tr>
<tr><td>Typical tools</td><td>Decision statement, musts/wants, weighted objectives (slide 82)</td><td>Common sense, evidence, the field's body of knowledge, the rubric, the assessor (slides 83–84)</td></tr>
<tr><td>Slides in this deck</td><td>82</td><td>83 and 84</td></tr>
<tr><td>Fails when used alone</td><td>A beautifully scored answer that ignores what the assignment asked</td><td>A safe, conventional answer with no explicit comparison behind it</td></tr>
</table>
<ul>
<li><strong>The split is the point, so memorise the number first.</strong> Two methods, in this order, with "general" first. A multiple-choice option offering three categories (for example adding "personal methods" or "financial methods") is inventing a third.</li>
<li><strong>General methods are portable; academic methods are local.</strong> Fogler &amp; LeBlanc's steps work equally for choosing a database, a supplier or a flatmate. The academic-culture criteria change from discipline to discipline — what counts as evidence in software engineering is not what counts in literary studies.</li>
<li><strong>You are expected to use BOTH, not to choose between them.</strong> The general method tells you which option wins on your own criteria; the academic-culture method checks that your criteria are the ones your field and your marker actually recognise.</li>
<li><strong>Why students who skip step 2 lose marks.</strong> A team can run a flawless weighted matrix and still fail the assignment because the brief asked for something else. That failure is not a thinking failure — it is a failure to evaluate against the academic context, which is exactly what slides 83–84 are for.</li>
<li><strong>FPTU application.</strong> For the SWP391 database choice: the general method produces "PostgreSQL scores 8.4, MongoDB 7.1". The academic-culture method then asks: does the SWP391 rubric reward justified technology choices? Does the supervisor expect a relational schema for this domain? Both answers must point the same way before you commit.</li>
</ul>
<p class="meo">💡 One-line hook: <strong>general = "score it"; academic = "will it be accepted?"</strong> Two methods, never one.</p>`,
        `<p class="y-chinh">🎯 Slide khung sườn của cả mục, và là một trong những dữ kiện dễ bị hỏi nhất deck này: có <strong>HAI</strong> loại phương pháp đánh giá — <strong>1. Phương pháp chung (General methods)</strong> và <strong>2. Phương pháp riêng của văn hoá học thuật</strong>. Mọi thứ ở slide 82–84 đều treo dưới một trong hai đầu mục này.</p>
<table>
<tr><th></th><th>1. Phương pháp CHUNG</th><th>2. Phương pháp riêng của VĂN HOÁ HỌC THUẬT</th></tr>
<tr><td>Xuất xứ</td><td>Khoa học ra quyết định / kỹ thuật — Fogler &amp; LeBlanc (1995)</td><td>Quy ước của ngành bạn và của trường đại học</td></tr>
<tr><td>Nó hỏi gì</td><td>"Phương án nào chấm điểm cao nhất theo tiêu chí có trọng số?"</td><td>"Cái này có được coi là bài làm tốt trong NGÀNH CỦA TÔI không?"</td></tr>
<tr><td>Công cụ điển hình</td><td>Decision statement, musts/wants, trọng số cho mục tiêu (slide 82)</td><td>Lẽ thường, bằng chứng, kho tri thức của ngành, rubric, người chấm (slide 83–84)</td></tr>
<tr><td>Slide trong deck</td><td>82</td><td>83 và 84</td></tr>
<tr><td>Dùng một mình thì hỏng ở đâu</td><td>Một đáp án chấm điểm rất đẹp nhưng lệch hẳn đề bài</td><td>Một đáp án an toàn, quy ước, mà không có so sánh tường minh nào phía sau</td></tr>
</table>
<ul>
<li><strong>Chính cái CHIA ĐÔI mới là điểm, nên nhớ con số trước.</strong> Hai phương pháp, theo thứ tự này, "chung" đứng trước. Phương án trắc nghiệm nào đưa ra ba loại (ví dụ thêm "phương pháp cá nhân" hay "phương pháp tài chính") là đang bịa ra loại thứ ba.</li>
<li><strong>Phương pháp chung MANG ĐI ĐƯỢC; phương pháp học thuật thì ĐỊA PHƯƠNG.</strong> Bốn bước của Fogler &amp; LeBlanc dùng được như nhau cho việc chọn CSDL, chọn nhà cung cấp, hay chọn bạn ở ghép. Tiêu chí văn hoá học thuật thì đổi theo ngành — thứ được coi là bằng chứng trong kỹ thuật phần mềm không giống thứ được coi là bằng chứng trong nghiên cứu văn học.</li>
<li><strong>Bạn được kỳ vọng dùng CẢ HAI, không phải chọn một.</strong> Phương pháp chung cho biết phương án nào thắng theo tiêu chí của chính bạn; phương pháp văn hoá học thuật kiểm lại xem tiêu chí đó có đúng là thứ ngành bạn và người chấm công nhận hay không.</li>
<li><strong>Vì sao sinh viên bỏ bước 2 thì mất điểm.</strong> Một nhóm có thể chạy ma trận trọng số không tì vết mà vẫn trượt, vì đề bài hỏi thứ khác. Đó không phải lỗi tư duy — đó là lỗi không đánh giá theo bối cảnh học thuật, đúng thứ slide 83–84 sinh ra để chặn.</li>
<li><strong>Áp vào FPTU.</strong> Với việc chọn CSDL cho SWP391: phương pháp chung cho ra "PostgreSQL 8,4 điểm, MongoDB 7,1". Phương pháp văn hoá học thuật rồi hỏi tiếp: rubric SWP391 có thưởng điểm cho việc lý giải lựa chọn công nghệ không? Giảng viên hướng dẫn có chờ đợi một lược đồ quan hệ cho bài toán này không? Cả hai câu trả lời phải chỉ về cùng một hướng thì mới chốt.</li>
</ul>
<p class="meo">💡 Câu nhớ một dòng: <strong>chung = "chấm điểm nó"; học thuật = "nó có được chấp nhận không?"</strong> Hai phương pháp, không bao giờ một.</p>`],

      [82, 'Evaluating solutions using general methods (Fogler & LeBlanc, 1995) — four steps',
        `<p class="y-chinh">🎯 The four-step general method, attributed on the slide to <strong>(Fogler &amp; LeBlanc, 1995)</strong>: <strong>1. Create a decision statement · 2. Decide on 'musts' and 'wants' · 3. Create a list of objectives · 4. Weight the objectives according to importance.</strong> Learn the count, the order, and the two quoted words.</p>
<table>
<tr><th>Step</th><th>Slide wording</th><th>What you actually write down</th><th>Failure if skipped</th></tr>
<tr><td>1</td><td>Create a decision statement</td><td>One sentence naming what is being decided and for what purpose</td><td>Everyone argues about different questions</td></tr>
<tr><td>2</td><td>Decide on 'musts' and 'wants'</td><td>Two lists: non-negotiable requirements, and desirable extras</td><td>A charming option that fails a hard requirement stays in the race</td></tr>
<tr><td>3</td><td>Create a list of objectives</td><td>The criteria you will score the surviving options against</td><td>Comparison becomes a matter of taste</td></tr>
<tr><td>4</td><td>Weight the objectives according to importance</td><td>A number per criterion, agreed BEFORE scoring</td><td>Ten trivial criteria outvote one decisive one</td></tr>
</table>
<ul>
<li><strong>'Musts' and 'wants' is the highest-value idea on the slide.</strong> A <em>must</em> is a filter: any option failing it is eliminated, no matter how well it scores elsewhere. A <em>want</em> is a scorer: it adds points. Mixing them is the classic mistake — it lets a cheap, fast option survive even though it cannot meet a hard constraint.</li>
<li><strong>Order matters: objectives are weighted BEFORE options are scored.</strong> Weighting after you have seen the scores is just rationalising the answer you already wanted. Step 4 coming last in the list — and still before any scoring — is the whole point of a documented method.</li>
<li><strong>The decision statement has to be written, not assumed.</strong> "Choose a database" and "choose a database we can still maintain after the project ends" lead to different winners. One sentence at the top of the page saves hours of circular argument later.</li>
<li><strong>Note what the slide does NOT include.</strong> There is no step 5 "score the options" and no step 6 "decide" printed here. The deck stops at weighting. If an exam option adds extra steps to this method, check it against the four printed lines — four is the number.</li>
<li><strong>The method is also your audit trail.</strong> Because every step leaves a written artefact, you can later explain <em>why</em> you chose what you chose — which is exactly the "communicate the solution path, not just the solution" rule that arrives at slide 88.</li>
</ul>
<p class="dap-an">✅ Worked example — SWP391, two weeks behind, one member not delivering. <strong>Step 1 decision statement:</strong> "Decide how to deliver a demonstrable increment by the sprint deadline without dropping a graded requirement." <strong>Step 2 musts:</strong> all graded features present; code compiles and deploys; every member has an assessable contribution. <strong>Wants:</strong> nice UI, full test coverage, extra analytics. <strong>Step 3 objectives:</strong> deadline safety, grading coverage, workload fairness, maintainability. <strong>Step 4 weights:</strong> deadline 40%, grading coverage 30%, fairness 20%, maintainability 10%. Now the option "redistribute the missing member's module and cut the analytics page" wins visibly — and the reasoning is on paper for the supervisor.</p>
<p class="meo">💡 Mnemonic for the four steps: <strong>Statement → Sort (musts/wants) → Set (objectives) → Score-weights</strong>. Four S-words, same order as the slide.</p>`,
        `<p class="y-chinh">🎯 Phương pháp chung bốn bước, trên slide ghi nguồn <strong>(Fogler &amp; LeBlanc, 1995)</strong>: <strong>1. Tạo một phát biểu quyết định · 2. Xác định 'musts' và 'wants' · 3. Lập danh sách mục tiêu · 4. Gán trọng số cho các mục tiêu theo mức quan trọng.</strong> Thuộc SỐ LƯỢNG, THỨ TỰ, và hai chữ trong nháy đơn.</p>
<table>
<tr><th>Bước</th><th>Chữ trên slide</th><th>Bạn thực sự viết ra cái gì</th><th>Bỏ qua thì hỏng ra sao</th></tr>
<tr><td>1</td><td>Create a decision statement</td><td>Một câu nêu rõ đang quyết định điều gì, để phục vụ mục đích gì</td><td>Mỗi người cãi về một câu hỏi khác nhau</td></tr>
<tr><td>2</td><td>Decide on 'musts' and 'wants'</td><td>Hai danh sách: yêu cầu KHÔNG THỂ nhân nhượng, và thứ mong muốn có thêm</td><td>Một phương án nghe hay nhưng trượt điều kiện cứng vẫn còn trong cuộc đua</td></tr>
<tr><td>3</td><td>Create a list of objectives</td><td>Bộ tiêu chí sẽ dùng để chấm các phương án còn sống</td><td>So sánh biến thành chuyện cảm tính</td></tr>
<tr><td>4</td><td>Weight the objectives according to importance</td><td>Một con số cho mỗi tiêu chí, thống nhất TRƯỚC khi chấm</td><td>Mười tiêu chí vụn thắng phiếu một tiêu chí quyết định</td></tr>
</table>
<ul>
<li><strong>'Musts' và 'wants' là ý giá trị nhất của slide.</strong> <em>Must</em> là BỘ LỌC: phương án nào trượt nó thì bị loại, dù chấm điểm chỗ khác cao đến đâu. <em>Want</em> là BỘ CỘNG ĐIỂM. Trộn hai thứ là lỗi kinh điển — nó cho một phương án rẻ và nhanh sống sót dù không đáp ứng nổi một ràng buộc cứng.</li>
<li><strong>Thứ tự quan trọng: gán trọng số TRƯỚC khi chấm phương án.</strong> Gán trọng số sau khi đã thấy điểm chỉ là hợp lý hoá cái đáp án mình vốn muốn. Bước 4 đứng cuối danh sách — mà vẫn trước mọi thao tác chấm — chính là toàn bộ lý do tồn tại của một phương pháp được ghi chép.</li>
<li><strong>Phát biểu quyết định phải được VIẾT RA, không phải ngầm hiểu.</strong> "Chọn một CSDL" và "chọn một CSDL mà chúng ta còn bảo trì nổi sau khi đồ án kết thúc" dẫn tới hai người thắng khác nhau. Một câu ở đầu trang tiết kiệm hàng giờ cãi vòng quanh về sau.</li>
<li><strong>Để ý thứ slide KHÔNG có.</strong> Ở đây không in bước 5 "chấm điểm các phương án", cũng không có bước 6 "ra quyết định". Deck dừng ở bước gán trọng số. Nếu phương án thi thêm bước vào phương pháp này, hãy đối chiếu với bốn dòng in trên slide — con số là BỐN.</li>
<li><strong>Phương pháp này cũng chính là dấu vết kiểm toán của bạn.</strong> Vì mỗi bước để lại một sản phẩm viết, sau này bạn giải thích được <em>VÌ SAO</em> chọn như vậy — đúng luật "truyền đạt con đường tới giải pháp, không chỉ giải pháp" sẽ xuất hiện ở slide 88.</li>
</ul>
<p class="dap-an">✅ Ví dụ chạy trọn — SWP391 trễ hai tuần, một thành viên không nộp phần việc. <strong>Bước 1 phát biểu quyết định:</strong> "Quyết định cách bàn giao được một bản chạy demo được trước hạn sprint mà không bỏ mất yêu cầu nào có chấm điểm." <strong>Bước 2 musts:</strong> đủ mọi tính năng có trong barem; mã build và deploy được; mỗi thành viên có phần đóng góp chấm được. <strong>Wants:</strong> giao diện đẹp, phủ kín unit test, thêm trang thống kê. <strong>Bước 3 mục tiêu:</strong> an toàn tiến độ, phủ barem, công bằng khối lượng, khả năng bảo trì. <strong>Bước 4 trọng số:</strong> tiến độ 40%, phủ barem 30%, công bằng 20%, bảo trì 10%. Lúc này phương án "chia lại module của thành viên vắng và cắt trang thống kê" thắng một cách nhìn thấy được — và lập luận đã nằm sẵn trên giấy để trình giảng viên.</p>
<p class="meo">💡 Mẹo nhớ bốn bước: <strong>Phát biểu → Phân loại (musts/wants) → Đặt mục tiêu → Đặt trọng số</strong>. Bốn chữ P-P-Đ-Đ, đúng thứ tự trên slide.</p>`],

      [83, "Evaluating solutions in academic culture — common sense, evidence, your field's body of knowledge",
        `<p class="y-chinh">🎯 The first of TWO slides carrying this identical title. This one gives the three general principles of academic evaluation: <strong>Don't forget common sense!</strong> · <strong>Use evidence</strong> · <strong>Make reference to your field's body of knowledge</strong>.</p>
<ul>
<li><strong>"Don't forget common sense!" is the only bullet in the deck with an exclamation mark.</strong> That emphasis is deliberate: a weighted matrix can produce an answer that is arithmetically correct and obviously silly. The sanity check belongs to you, not to the method. If the winning option feels absurd, the criteria or the weights are wrong — go back, do not ship the absurdity.</li>
<li><strong>"Use evidence" means data, not conviction.</strong> In an academic evaluation, "I think this is faster" is worth nothing; a measurement, a cited study or a documented benchmark is worth marks. This is the same standard Mooc 1 set for sources, now applied to decisions instead of essays.</li>
<li><strong>"Your field's body of knowledge" is what stops you re-inventing a solved problem.</strong> Somebody has already evaluated most of what you are evaluating. Referring to that literature does two jobs at once: it improves the decision, and it shows the marker you know your discipline.</li>
<li><strong>The three work as a sequence of filters.</strong> Common sense removes the absurd, evidence removes the merely plausible, and the body of knowledge removes what your field has already tried and rejected. What survives all three is defensible.</li>
<li><strong>FPTU application.</strong> Choosing between JWT and server-side sessions for a SWP391 project: common sense (does our app even have a mobile client that needs stateless auth?), evidence (measure the latency and check the OWASP guidance), body of knowledge (what do the course materials and standard references in software security actually recommend?). A one-line answer citing none of the three will be marked as opinion.</li>
</ul>
<p class="pitfall">⚠️ Important deck quirk: slides <strong>83 and 84 have the SAME title</strong> but summarise two different things — 83 is the general principles (common sense / evidence / field knowledge), 84 is the assessment-specific check (rubric / assessor). They are not a repeat of each other. Keep both sets of bullets, and keep them apart.</p>
<p class="meo">💡 Three words to carry: <strong>SENSE · EVIDENCE · FIELD</strong>. Exactly three items — an option adding "consult your friends" or "trust your instinct alone" is not on the slide.</p>`,
        `<p class="y-chinh">🎯 Slide ĐẦU trong HAI slide mang y hệt tiêu đề này. Slide này nêu ba nguyên tắc chung của việc đánh giá trong môi trường học thuật: <strong>Đừng quên lẽ thường! (Don't forget common sense!)</strong> · <strong>Dùng bằng chứng (Use evidence)</strong> · <strong>Dẫn chiếu tới kho tri thức của ngành bạn</strong>.</p>
<ul>
<li><strong>"Don't forget common sense!" là gạch đầu dòng DUY NHẤT trong deck có dấu chấm than.</strong> Nhấn mạnh đó là có chủ đích: một ma trận trọng số hoàn toàn có thể đẻ ra đáp án đúng về số học mà ngớ ngẩn thấy rõ. Phép kiểm tỉnh táo thuộc về BẠN, không thuộc về phương pháp. Nếu phương án thắng nghe vô lý thì tiêu chí hoặc trọng số sai — quay lại sửa, đừng bàn giao cái vô lý.</li>
<li><strong>"Use evidence" nghĩa là DỮ LIỆU, không phải niềm tin.</strong> Trong đánh giá học thuật, "em nghĩ cái này nhanh hơn" đáng giá bằng không; một phép đo, một nghiên cứu có trích dẫn, một benchmark có ghi chép thì đáng điểm. Đây đúng là chuẩn mà Mooc 1 đã đặt ra cho nguồn tài liệu, nay đem áp lên QUYẾT ĐỊNH thay vì bài viết.</li>
<li><strong>"Kho tri thức của ngành" là thứ chặn bạn phát minh lại cái bánh xe.</strong> Phần lớn thứ bạn đang đánh giá thì đã có người đánh giá rồi. Dẫn chiếu tới phần tài liệu đó làm hai việc cùng lúc: cải thiện quyết định, và cho người chấm thấy bạn nắm ngành của mình.</li>
<li><strong>Ba thứ này hoạt động như một dãy BỘ LỌC nối tiếp.</strong> Lẽ thường loại cái vô lý, bằng chứng loại cái chỉ nghe-có-vẻ-hợp-lý, kho tri thức loại cái mà ngành bạn đã thử và đã bác bỏ. Thứ sống sót qua cả ba là thứ bảo vệ được.</li>
<li><strong>Áp vào FPTU.</strong> Chọn giữa JWT và session phía máy chủ cho đồ án SWP391: lẽ thường (ứng dụng của nhóm có client di động nào cần xác thực phi trạng thái không?), bằng chứng (đo độ trễ và đọc khuyến nghị của OWASP), kho tri thức (tài liệu môn học và các nguồn chuẩn về an toàn phần mềm thật sự khuyên gì?). Một câu trả lời không dẫn được thứ nào trong ba thứ đó sẽ bị chấm là ý kiến cá nhân.</li>
</ul>
<p class="pitfall">⚠️ Đặc tính quan trọng của deck: slide <strong>83 và 84 CÙNG tiêu đề</strong> nhưng tóm tắt hai thứ khác nhau — 83 là nguyên tắc chung (lẽ thường / bằng chứng / tri thức ngành), 84 là phép kiểm riêng cho bài có chấm điểm (rubric / người chấm). Chúng KHÔNG phải bản lặp của nhau. Giữ cả hai bộ gạch đầu dòng, và giữ chúng tách bạch.</p>
<p class="meo">💡 Ba chữ mang theo: <strong>LẼ THƯỜNG · BẰNG CHỨNG · NGÀNH</strong>. Đúng ba mục — phương án nào thêm "hỏi bạn bè" hay "tin vào trực giác là đủ" thì không có trên slide.</p>`],

      [84, 'Evaluating solutions in academic culture (same title, different content) — the rubric and the assessor',
        `<p class="y-chinh">🎯 The second slide with that title, and it narrows the lens to assessed work. Two bullets, both starting with the same condition: <strong>If assessed, check against the rubric and the question</strong> · <strong>If assessed, make sure your assessor will approve</strong>.</p>
<table>
<tr><th></th><th>Slide 83 — general principles</th><th>Slide 84 — assessed work</th></tr>
<tr><td>Question it answers</td><td>"Is this solution sound?"</td><td>"Will this solution earn marks?"</td></tr>
<tr><td>Items</td><td>3 (common sense, evidence, field knowledge)</td><td>2 (rubric + question, assessor approval)</td></tr>
<tr><td>Applies when</td><td>Always</td><td>Only when the work is graded ("If assessed…")</td></tr>
<tr><td>Reference point</td><td>Your discipline</td><td>The specific brief and the specific marker</td></tr>
</table>
<ul>
<li><strong>"The rubric AND the question" is two checks, not one.</strong> The rubric says how marks are distributed; the question says what was asked. A solution can satisfy every rubric row and still answer a question nobody set — a comparison essay written as a description, for instance. Check both documents side by side before you finalise.</li>
<li><strong>"Make sure your assessor will approve" is about the discipline's conventions, not about flattery.</strong> Different supervisors accept different evidence, different formats, different levels of risk. Asking "is this approach acceptable for this assignment?" in week two costs one email; discovering the answer at submission costs a grade.</li>
<li><strong>The repeated "If assessed" is a real qualifier.</strong> The slide is explicitly limiting these two checks to graded work. For a decision with no marker — a personal project, a startup idea — you still run slide 83, but slide 84 has no counterpart. Knowing which rules are conditional is the kind of detail a careful exam question exploits.</li>
<li><strong>This is where students lose the most avoidable marks in the whole course.</strong> Not through weak thinking, but through an excellent answer to a question that was not asked. The rubric is a published checklist of where the marks are — reading it is free.</li>
<li><strong>FPTU application.</strong> Before submitting SWP391 documentation, print the rubric and tick each row against your report. If a row says "justification of technology choices, 10%", your Fogler &amp; LeBlanc table from slide 82 goes into the report — because that is where those ten marks live. Then send the supervisor a two-line summary of your approach and get confirmation in writing.</li>
</ul>
<p class="dap-an">✅ Self-test: which slide does each check belong to? (a) "cite the standard reference in your field" → <strong>83</strong>. (b) "confirm the marker accepts a prototype instead of a full build" → <strong>84</strong>. (c) "the winning option must not be obviously ridiculous" → <strong>83</strong>. (d) "re-read the assignment question after choosing" → <strong>84</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide thứ HAI mang tiêu đề đó, và nó thu hẹp ống kính vào bài CÓ CHẤM ĐIỂM. Hai gạch đầu dòng, cả hai đều mở bằng cùng một điều kiện: <strong>Nếu bài được chấm, hãy đối chiếu với rubric VÀ với đề bài</strong> · <strong>Nếu bài được chấm, hãy bảo đảm người chấm của bạn sẽ chấp nhận</strong>.</p>
<table>
<tr><th></th><th>Slide 83 — nguyên tắc chung</th><th>Slide 84 — bài có chấm điểm</th></tr>
<tr><td>Trả lời câu hỏi</td><td>"Giải pháp này có vững không?"</td><td>"Giải pháp này có ĂN ĐIỂM không?"</td></tr>
<tr><td>Số mục</td><td>3 (lẽ thường, bằng chứng, tri thức ngành)</td><td>2 (rubric + đề bài, người chấm chấp nhận)</td></tr>
<tr><td>Áp dụng khi</td><td>Luôn luôn</td><td>Chỉ khi bài được chấm ("If assessed…")</td></tr>
<tr><td>Mốc đối chiếu</td><td>Ngành của bạn</td><td>Đề bài cụ thể và người chấm cụ thể</td></tr>
</table>
<ul>
<li><strong>"Rubric VÀ đề bài" là HAI phép kiểm, không phải một.</strong> Rubric cho biết điểm chia ra sao; đề bài cho biết người ta hỏi cái gì. Một bài có thể thoả mãn từng dòng rubric mà vẫn trả lời một câu hỏi không ai đặt ra — ví dụ đề bảo SO SÁNH mà bài viết thành MÔ TẢ. Đặt hai văn bản cạnh nhau mà soát trước khi chốt.</li>
<li><strong>"Bảo đảm người chấm chấp nhận" nói về quy ước của ngành, không phải về việc lấy lòng.</strong> Mỗi giảng viên hướng dẫn chấp nhận loại bằng chứng, định dạng và mức rủi ro khác nhau. Hỏi "cách tiếp cận này có chấp nhận được cho bài này không?" ở tuần thứ hai tốn một cái email; phát hiện câu trả lời lúc nộp bài thì tốn cả điểm môn.</li>
<li><strong>Chữ "If assessed" lặp lại là một điều kiện THẬT.</strong> Slide đang giới hạn rõ hai phép kiểm này cho bài có chấm điểm. Với một quyết định không có người chấm — dự án cá nhân, ý tưởng khởi nghiệp — bạn vẫn chạy slide 83, nhưng slide 84 không có đối ứng. Biết luật nào là CÓ ĐIỀU KIỆN chính là loại chi tiết mà một câu hỏi thi cẩn thận sẽ khai thác.</li>
<li><strong>Đây là chỗ sinh viên mất điểm oan nhất trong cả môn.</strong> Không phải vì nghĩ kém, mà vì trả lời xuất sắc cho một câu hỏi không được hỏi. Rubric là bảng kiểm CÔNG KHAI chỉ rõ điểm nằm ở đâu — đọc nó không tốn gì.</li>
<li><strong>Áp vào FPTU.</strong> Trước khi nộp tài liệu SWP391, in rubric ra và tick từng dòng đối chiếu với báo cáo. Nếu có dòng "lý giải lựa chọn công nghệ, 10%", thì cái bảng Fogler &amp; LeBlanc ở slide 82 phải vào báo cáo — vì mười điểm đó nằm ở đúng chỗ ấy. Rồi gửi giảng viên hai dòng tóm tắt cách làm và xin xác nhận bằng văn bản.</li>
</ul>
<p class="dap-an">✅ Tự kiểm: mỗi phép kiểm sau thuộc slide nào? (a) "trích nguồn chuẩn của ngành" → <strong>83</strong>. (b) "xác nhận người chấm chấp nhận bản mẫu thay cho bản hoàn chỉnh" → <strong>84</strong>. (c) "phương án thắng không được vô lý thấy rõ" → <strong>83</strong>. (d) "đọc lại đề bài sau khi đã chọn" → <strong>84</strong>.</p>`],

      [85, '4.4b Strategies for Evaluating Solutions (objectives repeated from 4.4a, "and" → "&")',
        `<p class="y-chinh">🎯 The same three objectives as slide 80, reprinted under a new label: <strong>4.4b Strategies for Evaluating Solutions</strong>. The only textual difference in the whole block is that "and reflect on the process &amp; result" is now "&amp; reflect on the process &amp; result".</p>
<ul>
<li><strong>Say it plainly: this slide adds no new content.</strong> Slides 80 and 85 print the identical objective list. The deck uses the objectives page as a section divider, so 4.4a and 4.4b are two halves of one topic rather than two topics. Do not build a mental table of "differences between 4.4a and 4.4b" — there are none in this deck.</li>
<li><strong>The label does tell you something, though.</strong> 4.4a was called <em>Evaluating solutions</em>; 4.4b is called <em>Strategies for Evaluating Solutions</em>. The shift from the activity to the strategies is the same move you saw in the creativity block: first the thing, then the named techniques for doing the thing.</li>
<li><strong>What you should actually be able to do by now.</strong> Name the two method families (slide 81), recite the four Fogler &amp; LeBlanc steps (82), list the three academic-culture principles (83) and the two assessment checks (84). That is 2 + 4 + 3 + 2 — a compact and very examinable set of counts.</li>
<li><strong>Typography is not content, but inconsistency is a signal.</strong> The ampersand swap between slides 80 and 85 is the same kind of drift you saw in Mooc 1 between British and American spelling. It tells you the deck was assembled from several sources — useful to know when two slides seem to contradict each other: check whether it is a real difference or an editing artefact.</li>
<li><strong>FPTU application.</strong> When you revise, treat 4.4a + 4.4b as ONE card in your flashcard deck, titled "Evaluating solutions", with the four counts above on the back. Two cards for identical objectives is wasted revision time, and the exam will not ask you to attribute an objective to 4.4a rather than 4.4b.</li>
</ul>
<p class="pitfall">⚠️ Trap the deck sets up by accident: seeing the same list twice can convince you that you have read new material. You have not. When a slide repeats verbatim, the correct study action is to <strong>check the counts you already learned</strong>, not to re-read the words.</p>`,
        `<p class="y-chinh">🎯 Vẫn ba chuẩn đầu ra ấy của slide 80, in lại dưới một nhãn mới: <strong>4.4b Strategies for Evaluating Solutions</strong>. Khác biệt chữ nghĩa duy nhất trong cả khối là "and reflect on the process &amp; result" nay thành "&amp; reflect on the process &amp; result".</p>
<ul>
<li><strong>Nói thẳng: slide này KHÔNG thêm nội dung nào.</strong> Slide 80 và 85 in y hệt danh sách chuẩn đầu ra. Deck dùng trang chuẩn đầu ra làm tấm phân cách, nên 4.4a và 4.4b là hai NỬA của một chủ đề chứ không phải hai chủ đề. Đừng dựng bảng "khác nhau giữa 4.4a và 4.4b" trong đầu — trong deck này không có khác biệt nào.</li>
<li><strong>Dù vậy, cái NHÃN có nói một điều.</strong> 4.4a tên là <em>Evaluating solutions</em>; 4.4b tên là <em>Strategies for Evaluating Solutions</em>. Bước chuyển từ HOẠT ĐỘNG sang CÁC CHIẾN LƯỢC đúng là bước bạn đã thấy ở cụm sáng tạo: trước là bản thân việc đó, sau là các kỹ thuật có tên để làm việc đó.</li>
<li><strong>Tới đây bạn thực sự phải làm được gì.</strong> Gọi tên hai họ phương pháp (slide 81), đọc thuộc bốn bước Fogler &amp; LeBlanc (82), liệt kê ba nguyên tắc văn hoá học thuật (83) và hai phép kiểm khi bài có chấm (84). Tức là 2 + 4 + 3 + 2 — một bộ con số gọn và rất dễ ra đề.</li>
<li><strong>Cách trình bày không phải nội dung, nhưng sự KHÔNG NHẤT QUÁN là một tín hiệu.</strong> Việc đổi "and" thành "&amp;" giữa slide 80 và 85 cùng loại trôi dạt với chuyện chính tả Anh-Anh/Anh-Mỹ ở Mooc 1. Nó cho biết deck được ghép từ nhiều nguồn — điều đáng nhớ khi hai slide trông như mâu thuẫn nhau: hãy kiểm xem đó là khác biệt thật hay chỉ là dấu vết biên tập.</li>
<li><strong>Áp vào FPTU.</strong> Lúc ôn, hãy coi 4.4a + 4.4b là MỘT thẻ trong bộ flashcard, tên "Đánh giá giải pháp", mặt sau ghi bốn con số ở trên. Làm hai thẻ cho cùng một bộ chuẩn đầu ra là phí thời gian ôn, và đề thi sẽ không bắt bạn gán một chuẩn đầu ra về 4.4a thay vì 4.4b.</li>
</ul>
<p class="pitfall">⚠️ Cái bẫy mà deck vô tình giăng ra: nhìn thấy cùng một danh sách hai lần có thể khiến bạn tưởng mình vừa đọc tài liệu mới. KHÔNG hề. Khi một slide lặp nguyên văn, hành động ôn tập đúng là <strong>kiểm lại các CON SỐ bạn đã học</strong>, chứ không phải đọc lại chữ.</p>`],

      [86, '5.1a Communicating solutions in academic contexts (module objectives — three outcomes)',
        `<p class="y-chinh">🎯 Module 5 opens. Three objectives: <strong>identify your target audience</strong>, <strong>understand how to communicate solutions at university in a range of forms — verbally, visually and numerically</strong>, and <strong>recognise how solutions are communicated differently in academic contexts</strong>.</p>
<ul>
<li><strong>Note the three forms named in the objective: verbally, visually, numerically.</strong> That is THREE. But the content slide at 89 lists FOUR forms by adding <em>Written</em>, and the summary at 94 lists four again under different names. This mismatch is real and it is the single most likely place for an exam question to catch you — see the pitfall below.</li>
<li><strong>"Identify your target audience" comes FIRST for a reason.</strong> Everything else — how much jargon, how much background, how long, which form — is decided by who is receiving the solution. Audience is not politeness; it is the input that determines the format.</li>
<li><strong>"Communicated differently in academic contexts" is the comparison you are being asked to make.</strong> Outside university, a solution is usually communicated as a conclusion ("use PostgreSQL"). Inside, the working is part of the deliverable ("here is how we compared three options, here is the evidence, therefore PostgreSQL"). Slide 88 states this as an explicit rule.</li>
<li><strong>This block is where problem-solving becomes visible to other people.</strong> An unexplained solution earns nothing, however good it is: markers, supervisors and clients can only reward what they can follow. Section 5.1 is therefore where the marks of Mooc 2 concentrate.</li>
<li><strong>FPTU application.</strong> The same SWP391 database decision gets communicated three ways during one semester: a 5-minute spoken update at a progress meeting, a comparison table in the report, and a slide in the defence deck. One decision, three audiences, three formats — that is exactly what this objective is asking you to plan for.</li>
</ul>
<p class="pitfall">⚠️ Count trap: the OBJECTIVE says three forms (verbal, visual, numerical); the CONTENT says four (adds Written). If a question asks "which forms does the module cover?", the safe answer follows the content slides — <strong>four</strong>: verbally, visually, numerically, written. The objective simply names three examples with a dash, not a closed list.</p>`,
        `<p class="y-chinh">🎯 Module 5 mở màn. Ba chuẩn đầu ra: <strong>xác định đối tượng người nghe/đọc mục tiêu</strong>, <strong>hiểu cách truyền đạt giải pháp ở đại học qua nhiều hình thức — bằng lời, bằng hình ảnh và bằng số liệu</strong>, và <strong>nhận ra giải pháp được truyền đạt KHÁC ĐI như thế nào trong bối cảnh học thuật</strong>.</p>
<ul>
<li><strong>Để ý ba hình thức được nêu trong chuẩn đầu ra: verbally, visually, numerically.</strong> Tức BA. Nhưng slide nội dung 89 lại liệt kê BỐN hình thức vì thêm <em>Written</em>, và slide tóm tắt 94 cũng bốn nhưng đổi tên. Sự vênh này là THẬT và đây là chỗ dễ bị đề thi bắt nhất — xem phần bẫy ở dưới.</li>
<li><strong>"Xác định đối tượng" đứng ĐẦU là có lý do.</strong> Mọi thứ còn lại — dùng bao nhiêu thuật ngữ, cần bao nhiêu nền tảng, dài bao nhiêu, chọn hình thức nào — đều do người NHẬN giải pháp quyết định. Đối tượng không phải phép lịch sự; nó là dữ liệu đầu vào quyết định định dạng.</li>
<li><strong>"Truyền đạt khác đi trong bối cảnh học thuật" chính là phép so sánh bạn được yêu cầu thực hiện.</strong> Ngoài trường, giải pháp thường được truyền đạt dưới dạng KẾT LUẬN ("dùng PostgreSQL"). Trong trường, phần LÀM cũng là sản phẩm bàn giao ("đây là cách chúng tôi so ba phương án, đây là bằng chứng, do đó PostgreSQL"). Slide 88 phát biểu điều này thành một luật tường minh.</li>
<li><strong>Cụm này là nơi việc giải quyết vấn đề trở nên NHÌN THẤY ĐƯỢC với người khác.</strong> Một giải pháp không được giải thích thì không ăn điểm nào, dù nó hay đến đâu: người chấm, giảng viên hướng dẫn và khách hàng chỉ thưởng được cho thứ họ theo dõi được. Vì thế điểm của Mooc 2 tụ lại ở mục 5.1.</li>
<li><strong>Áp vào FPTU.</strong> Cùng một quyết định chọn CSDL của SWP391 được truyền đạt ba cách trong một học kỳ: báo cáo miệng 5 phút ở buổi họp tiến độ, một bảng so sánh trong báo cáo, và một slide trong bộ bảo vệ. Một quyết định, ba đối tượng, ba định dạng — đúng thứ chuẩn đầu ra này bắt bạn phải tính trước.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đếm số: CHUẨN ĐẦU RA nói ba hình thức (nói, hình, số); phần NỘI DUNG nói bốn (thêm Written — viết). Nếu đề hỏi "module này bàn những hình thức nào?", đáp án an toàn theo các slide nội dung — <strong>BỐN</strong>: verbally, visually, numerically, written. Chuẩn đầu ra chỉ nêu ba ví dụ sau dấu gạch ngang, không phải một danh sách đóng.</p>`],

      [87, '5.1a Communicating solutions in academic contexts (the SAME objectives slide, printed twice in a row)',
        `<p class="y-chinh">🎯 Slide 87 repeats slide 86 word for word — the same heading <strong>5.1a Communicating solutions in academic contexts</strong> and the same three bullets. Only the layout differs slightly (type size and the position of the Sydney shield). No new content.</p>
<ul>
<li><strong>Two consecutive identical slides is the clearest duplication in this whole stretch.</strong> Elsewhere the deck repeats a block after several slides; here it repeats immediately. Almost certainly an artefact of merging two source files when the review deck was built.</li>
<li><strong>What to do with a duplicate while revising.</strong> Nothing — skip it. But DO use it as a checkpoint: can you state, without looking, the three objectives and the trap about "three forms versus four"? If yes, move on; if no, slide 86 is the one to re-read.</li>
<li><strong>Why it is worth mentioning rather than silently passing over.</strong> Students who notice a repeat and assume they mis-scrolled often re-read the whole section, losing revision time. Naming the duplication explicitly removes that doubt. The same thing happens at slides 97/99/100 and 98/101 at the end of the deck.</li>
<li><strong>A duplicate is not evidence of importance.</strong> It is tempting to think the deck is emphasising something by repeating it. It is not — the repeated pages are always the objectives block, never a content page, which is the signature of a structural artefact rather than deliberate emphasis.</li>
<li><strong>FPTU application.</strong> When you build revision notes from a slide deck, deduplicate first: list unique slide titles, count them, and only then write notes. For this 25-slide stretch, the unique-content count is far lower than 25 — five of these pages are repeats, which is useful to know when budgeting revision time before the 60-minute exam.</li>
</ul>
<table>
<tr><th>Repeated block in slides 77–101</th><th>Slides</th><th>Times printed</th></tr>
<tr><td>4.4 objectives (evaluating solutions)</td><td>80, 85</td><td>2</td></tr>
<tr><td>5.1 objectives (communicating solutions)</td><td>86, 87, 95</td><td>3</td></tr>
<tr><td>5.3 objectives (group problem-solving)</td><td>97, 99, 100</td><td>3</td></tr>
<tr><td>Summary: Group Problem-Solving</td><td>98, 101</td><td>2</td></tr>
</table>
<p class="meo">💡 Revision maths: of the 25 slides in this stretch, <strong>7</strong> are verbatim repeats of a page you have already seen. Your real workload here is 18 pages, not 25.</p>`,
        `<p class="y-chinh">🎯 Slide 87 lặp lại slide 86 từng chữ — cùng tiêu đề <strong>5.1a Communicating solutions in academic contexts</strong> và cùng ba gạch đầu dòng. Chỉ khác chút bố cục (cỡ chữ và vị trí khiên Sydney). Không có nội dung mới.</p>
<ul>
<li><strong>Hai slide giống hệt nhau đứng LIỀN KỀ là ca trùng lặp rõ nhất trong cả đoạn này.</strong> Chỗ khác deck lặp một khối sau vài slide; ở đây nó lặp ngay lập tức. Gần như chắc chắn là dấu vết của việc ghép hai file nguồn khi dựng deck ôn tập.</li>
<li><strong>Gặp slide trùng thì làm gì lúc ôn.</strong> Không làm gì — bỏ qua. Nhưng HÃY dùng nó làm điểm kiểm: bạn có nói lại được, không cần nhìn, ba chuẩn đầu ra và cái bẫy "ba hình thức hay bốn hình thức" không? Được thì đi tiếp; chưa được thì quay lại slide 86.</li>
<li><strong>Vì sao phải nói ra chứ không lặng lẽ lướt qua.</strong> Sinh viên thấy trùng thường tưởng mình cuộn nhầm rồi đọc lại cả mục, mất thời gian ôn. Gọi tên chỗ trùng lặp một cách dứt khoát sẽ xoá ngờ vực đó. Chuyện y hệt lặp lại ở slide 97/99/100 và 98/101 ở cuối deck.</li>
<li><strong>Trùng lặp KHÔNG phải bằng chứng của tầm quan trọng.</strong> Rất dễ nghĩ rằng deck đang nhấn mạnh điều gì đó bằng cách lặp. Không phải — trang bị lặp luôn luôn là khối chuẩn đầu ra, không bao giờ là trang nội dung, đó là dấu vân tay của lỗi cấu trúc chứ không phải chủ ý nhấn mạnh.</li>
<li><strong>Áp vào FPTU.</strong> Khi dựng ghi chú ôn từ một bộ slide, hãy KHỬ TRÙNG trước: liệt kê các tiêu đề slide duy nhất, đếm chúng, rồi mới viết ghi chú. Với đoạn 25 slide này, số trang có nội dung riêng thấp hơn 25 nhiều — năm trang trong đó là bản lặp, điều đáng biết khi phân bổ thời gian ôn cho bài thi 60 phút.</li>
</ul>
<table>
<tr><th>Khối bị lặp trong slide 77–101</th><th>Slide</th><th>Số lần in</th></tr>
<tr><td>Chuẩn đầu ra 4.4 (đánh giá giải pháp)</td><td>80, 85</td><td>2</td></tr>
<tr><td>Chuẩn đầu ra 5.1 (truyền đạt giải pháp)</td><td>86, 87, 95</td><td>3</td></tr>
<tr><td>Chuẩn đầu ra 5.3 (giải quyết vấn đề nhóm)</td><td>97, 99, 100</td><td>3</td></tr>
<tr><td>Summary: Group Problem-Solving</td><td>98, 101</td><td>2</td></tr>
</table>
<p class="meo">💡 Toán ôn thi: trong 25 slide của đoạn này, <strong>7</strong> slide là bản lặp nguyên văn của trang bạn đã xem. Khối lượng thật ở đây là 18 trang, không phải 25.</p>`],

      [88, 'Communicating solutions in academic contexts — audience, the solution PATH, field-specific knowledge',
        `<p class="y-chinh">🎯 The first content slide of Module 5, and the rule that defines academic communication: <strong>Understand your audience</strong> · <strong>Communicate the solution path, not just the solution</strong> · <strong>Display specific knowledge to your academic field</strong>.</p>
<ul>
<li><strong>"The solution path, not just the solution" is the sentence to memorise verbatim.</strong> It is the single most quotable line in Mooc 2. In academic work the reasoning IS the product: how you framed the problem, which options you generated, what criteria you used, why the winner won. Delivering only the answer throws away most of the marks even when the answer is right.</li>
<li><strong>Why the path matters more than the answer at university.</strong> The marker already knows a good answer. What is being assessed is whether YOU can get there reliably — and that is only visible in the path. This is also why partial credit exists: a sound path with a wrong final number still earns marks; a right number with no path often does not.</li>
<li><strong>"Understand your audience" governs the other two.</strong> An expert audience wants the path compressed and the technical detail dense; a general audience wants the path in plain language with the jargon unpacked. Same solution, same path, different surface.</li>
<li><strong>"Display specific knowledge to your academic field" is an instruction to use the right vocabulary and the right conventions.</strong> Using your discipline's terms precisely signals membership; using them loosely signals the opposite. Note the slightly awkward phrasing "knowledge to your academic field" — the slide's own wording; read it as "knowledge specific to your field".</li>
<li><strong>FPTU application, run end to end.</strong> SWP391 progress meeting, the team is two weeks behind. Bad version: "We're behind, we'll catch up." Good version, following all three bullets: audience = supervisor who grades process; path = "we ran a weighted comparison of three recovery options, our musts were full rubric coverage and an assessable contribution per member, deadline weighted 40%"; field knowledge = framed as scope freeze, re-allocation and a revised sprint backlog, using the project-management vocabulary the course teaches. Same facts, completely different mark.</li>
</ul>
<p class="meo">💡 Three-word hook: <strong>AUDIENCE → PATH → FIELD</strong>. If you remember only one line from Module 5, make it "communicate the solution path, not just the solution".</p>`,
        `<p class="y-chinh">🎯 Slide nội dung đầu tiên của Module 5, và là luật định nghĩa cả việc truyền đạt trong môi trường học thuật: <strong>Hiểu đối tượng của bạn</strong> · <strong>Truyền đạt CON ĐƯỜNG tới giải pháp, không chỉ giải pháp</strong> · <strong>Thể hiện tri thức riêng của ngành bạn</strong>.</p>
<ul>
<li><strong>"The solution path, not just the solution" là câu phải thuộc NGUYÊN VĂN.</strong> Đây là dòng đáng trích dẫn nhất của cả Mooc 2. Trong công việc học thuật, LẬP LUẬN chính là sản phẩm: bạn đóng khung vấn đề thế nào, sinh ra những phương án nào, dùng tiêu chí gì, vì sao phương án thắng lại thắng. Chỉ nộp mỗi đáp án là vứt đi phần lớn số điểm, kể cả khi đáp án đúng.</li>
<li><strong>Vì sao ở đại học CON ĐƯỜNG quan trọng hơn ĐÁP ÁN.</strong> Người chấm đã biết đáp án tốt rồi. Thứ đang được chấm là liệu BẠN có tới đó một cách đáng tin cậy được không — và điều đó chỉ nhìn thấy trong con đường. Đây cũng là lý do có điểm thành phần: con đường vững mà con số cuối sai vẫn được điểm; con số đúng mà không có con đường thì thường không.</li>
<li><strong>"Hiểu đối tượng" CHI PHỐI hai điều còn lại.</strong> Đối tượng chuyên gia muốn con đường được nén lại và chi tiết kỹ thuật đậm đặc; đối tượng phổ thông muốn con đường bằng ngôn ngữ thường và thuật ngữ được mở ra. Cùng giải pháp, cùng con đường, khác lớp vỏ.</li>
<li><strong>"Display specific knowledge to your academic field" là lệnh dùng ĐÚNG từ vựng và ĐÚNG quy ước.</strong> Dùng thuật ngữ của ngành một cách chính xác là tín hiệu bạn thuộc về ngành đó; dùng lỏng lẻo là tín hiệu ngược lại. Để ý cách diễn đạt hơi trúc trắc "knowledge to your academic field" — đó là chữ của chính slide; hãy đọc nó thành "tri thức riêng của ngành bạn".</li>
<li><strong>Áp vào FPTU, chạy trọn từ đầu tới cuối.</strong> Buổi họp tiến độ SWP391, nhóm trễ hai tuần. Bản tồi: "Tụi em bị trễ, tụi em sẽ đuổi kịp." Bản tốt, bám đủ ba gạch đầu dòng: đối tượng = giảng viên hướng dẫn, người chấm cả QUY TRÌNH; con đường = "nhóm đã chấm ba phương án cứu vãn theo trọng số, musts là phủ đủ rubric và mỗi thành viên có phần đóng góp chấm được, tiến độ trọng số 40%"; tri thức ngành = trình bày theo ngôn ngữ đóng băng phạm vi, phân bổ lại và sprint backlog đã hiệu chỉnh, đúng từ vựng quản lý dự án mà môn học dạy. Cùng dữ kiện, điểm khác hẳn.</li>
</ul>
<p class="meo">💡 Móc nhớ ba chữ: <strong>ĐỐI TƯỢNG → CON ĐƯỜNG → NGÀNH</strong>. Nếu chỉ nhớ được một dòng của Module 5, hãy nhớ "truyền đạt con đường tới giải pháp, không chỉ giải pháp".</p>`],

      [89, 'Communicating solutions in academic contexts — the FOUR forms: Verbally, Visually, Numerically, Written',
        `<p class="y-chinh">🎯 The list that organises the next four slides: solutions are communicated <strong>Verbally · Visually · Numerically · Written</strong>. Four forms — one more than the objectives slide promised.</p>
<table>
<tr><th>Form (slide 89)</th><th>Detail slide</th><th>What it covers there</th><th>Name used again in the summary (slide 94)</th></tr>
<tr><td>Verbally</td><td>90</td><td>Group work, presentations</td><td>Spoken</td></tr>
<tr><td>Visually</td><td>92</td><td>Tables/charts/diagrams, plans/blueprints, artworks</td><td>Visuals</td></tr>
<tr><td>Numerically</td><td>91</td><td>Maths, engineering, sciences; written explanation often required</td><td>Numbers</td></tr>
<tr><td>Written</td><td>93</td><td>Lab notes, Results &amp; Discussion, Recommendations, Rationale</td><td>Writing</td></tr>
</table>
<ul>
<li><strong>The order on this slide does NOT match the order of the detail slides.</strong> Here it is Verbally → Visually → Numerically → Written; the detail pages run 90 Verbally → <strong>91 Numerically</strong> → <strong>92 Visually</strong> → 93 Written. Visual and numerical are swapped. Learn the four items as a SET; do not memorise a sequence the deck itself does not keep.</li>
<li><strong>Four, not three — and the fourth is the one you use most.</strong> Written communication is the dominant academic form: reports, essays, lab notes, documentation. Its absence from the objectives line on slides 86/87/95 is an oversight in the deck, not a claim that writing does not count.</li>
<li><strong>The forms are not alternatives; real deliverables combine them.</strong> A capstone report is written, contains numbers, and carries diagrams; a defence is spoken over visuals. Slide 91 makes the combination explicit for numbers ("written explanation often required").</li>
<li><strong>Choosing a form is an audience decision, per slide 88.</strong> Same content: a trend goes to a chart for a general audience, to a table of figures for a technical one, and to one spoken sentence in a stand-up. The skill assessed is matching form to audience, not mastering one form.</li>
<li><strong>FPTU application.</strong> Map your own SWP391 deliverables onto the four: daily stand-up = verbal; architecture and ER diagrams = visual; performance benchmarks and test coverage = numerical; the report and code documentation = written. If any of the four is empty for a whole project, that is usually where marks are being silently lost.</li>
</ul>
<p class="pitfall">⚠️ Exam trap built into this deck: the names CHANGE between slide 89 (Verbally / Visually / Numerically / Written) and the summary slide 94 (Spoken / Numbers / Visuals / Writing). They are the same four categories under different labels. If an option offers "Spoken, Numbers, Visuals, Writing", that is still the correct four-item list.</p>`,
        `<p class="y-chinh">🎯 Danh sách tổ chức cả bốn slide kế tiếp: giải pháp được truyền đạt <strong>Bằng lời · Bằng hình ảnh · Bằng số liệu · Bằng chữ viết</strong>. BỐN hình thức — nhiều hơn một so với lời hứa của slide chuẩn đầu ra.</p>
<table>
<tr><th>Hình thức (slide 89)</th><th>Slide chi tiết</th><th>Ở đó bàn gì</th><th>Tên gọi lại ở slide tóm tắt 94</th></tr>
<tr><td>Verbally (bằng lời)</td><td>90</td><td>Làm việc nhóm, thuyết trình</td><td>Spoken</td></tr>
<tr><td>Visually (bằng hình)</td><td>92</td><td>Bảng/biểu đồ/sơ đồ, bản vẽ/bản thiết kế, tác phẩm nghệ thuật</td><td>Visuals</td></tr>
<tr><td>Numerically (bằng số)</td><td>91</td><td>Toán, kỹ thuật, khoa học; thường vẫn cần giải thích bằng chữ</td><td>Numbers</td></tr>
<tr><td>Written (bằng chữ viết)</td><td>93</td><td>Ghi chép thí nghiệm, mục Kết quả &amp; Bàn luận, mục Khuyến nghị, Rationale</td><td>Writing</td></tr>
</table>
<ul>
<li><strong>Thứ tự trên slide này KHÔNG khớp với thứ tự các slide chi tiết.</strong> Ở đây là Verbally → Visually → Numerically → Written; các trang chi tiết lại chạy 90 Verbally → <strong>91 Numerically</strong> → <strong>92 Visually</strong> → 93 Written. Hình và số bị hoán đổi. Hãy học bốn mục như một TẬP HỢP; đừng học thuộc một trình tự mà chính deck cũng không giữ.</li>
<li><strong>BỐN, không phải ba — và cái thứ tư mới là cái bạn dùng nhiều nhất.</strong> Truyền đạt bằng chữ viết là hình thức học thuật thống trị: báo cáo, tiểu luận, ghi chép thí nghiệm, tài liệu kỹ thuật. Việc nó vắng mặt ở dòng chuẩn đầu ra tại slide 86/87/95 là sơ suất của deck, không phải khẳng định rằng viết không tính.</li>
<li><strong>Các hình thức không loại trừ nhau; sản phẩm thật luôn PHỐI HỢP.</strong> Báo cáo capstone là chữ viết, có số liệu, có sơ đồ; buổi bảo vệ là lời nói trên nền hình ảnh. Slide 91 nói thẳng sự phối hợp đó cho phần số ("thường vẫn cần giải thích bằng chữ").</li>
<li><strong>Chọn hình thức là một quyết định theo ĐỐI TƯỢNG, đúng tinh thần slide 88.</strong> Cùng một nội dung: một xu hướng thì vẽ biểu đồ cho người ngoài ngành, lập bảng số cho người trong ngành, và gói thành một câu nói trong buổi họp nhanh. Kỹ năng được chấm là KHỚP hình thức với đối tượng, không phải giỏi một hình thức.</li>
<li><strong>Áp vào FPTU.</strong> Hãy ánh xạ các sản phẩm SWP391 của chính bạn vào bốn ô: họp nhanh hằng ngày = bằng lời; sơ đồ kiến trúc và ERD = bằng hình; số đo hiệu năng và độ phủ test = bằng số; báo cáo và tài liệu mã nguồn = bằng chữ. Nếu suốt cả đồ án mà một ô trong bốn ô để trống, đó thường chính là chỗ đang âm thầm mất điểm.</li>
</ul>
<p class="pitfall">⚠️ Bẫy thi cài sẵn trong deck: TÊN GỌI ĐỔI giữa slide 89 (Verbally / Visually / Numerically / Written) và slide tóm tắt 94 (Spoken / Numbers / Visuals / Writing). Vẫn là bốn nhóm đó dưới nhãn khác. Nếu phương án đưa ra "Spoken, Numbers, Visuals, Writing" thì đó vẫn là danh sách bốn mục ĐÚNG.</p>`],

      [90, 'Communicating solutions — Verbally: group work and presentations',
        `<p class="y-chinh">🎯 The first of the four forms, with exactly two sub-items: <strong>Verbally → Group work · Presentations</strong>. Two contexts, two completely different sets of demands.</p>
<table>
<tr><th></th><th>Group work</th><th>Presentations</th></tr>
<tr><td>Direction</td><td>Two-way — you talk AND listen</td><td>Mostly one-way, then questions</td></tr>
<tr><td>Audience</td><td>Peers who share your context</td><td>Assessors or a wider audience</td></tr>
<tr><td>Preparation</td><td>Light, but continuous</td><td>Heavy, rehearsed, timed</td></tr>
<tr><td>What fails</td><td>Nobody states a decision, so nothing is agreed</td><td>Reading slides aloud; running over time</td></tr>
<tr><td>Where the solution path goes</td><td>Into a shared note after the discussion</td><td>Into the structure of the talk itself</td></tr>
</table>
<ul>
<li><strong>Group work is verbal communication, even though it feels like "just talking".</strong> The deck classifies it here deliberately: in a group, your solution only exists once you have said it clearly enough for others to act on. An idea kept in your head contributes nothing to the group's output.</li>
<li><strong>Presentations are where the solution path becomes a structure.</strong> Problem → options → criteria → chosen solution → evidence. That is slide 88's rule turned into a running order. A presentation that opens with the answer and never shows the comparison has skipped what it is being marked on.</li>
<li><strong>Spoken communication is lossy, so it needs repetition and a written residue.</strong> Listeners cannot scroll back. Say the key decision at the start, support it, then say it again at the end — and put it in a message or minutes afterwards so it survives the meeting.</li>
<li><strong>Timing is part of the skill for presentations.</strong> A twelve-minute talk delivered in twenty is a failure of the communication, not of the content. Rehearse against a clock; cut the section you like most if it does not carry a mark.</li>
<li><strong>FPTU application.</strong> In SWP391, verbal communication does two jobs. In group work: each stand-up ends with one spoken sentence per person — what is done, what is blocked, what is next. In the defence: your 10 minutes follow the path structure above, with the weighted-criteria table on screen while you narrate why the winner won.</li>
</ul>
<p class="meo">💡 Remember Verbally as a PAIR: <strong>group work + presentations</strong>. Two items exactly — an option that adds "phone calls" or "tutorials" is padding a list the slide keeps short.</p>`,
        `<p class="y-chinh">🎯 Hình thức đầu tiên trong bốn hình thức, với đúng hai mục con: <strong>Bằng lời → Làm việc nhóm · Thuyết trình</strong>. Hai bối cảnh, hai bộ đòi hỏi hoàn toàn khác nhau.</p>
<table>
<tr><th></th><th>Làm việc nhóm</th><th>Thuyết trình</th></tr>
<tr><td>Chiều</td><td>Hai chiều — bạn vừa nói VỪA nghe</td><td>Chủ yếu một chiều, sau đó hỏi đáp</td></tr>
<tr><td>Đối tượng</td><td>Bạn cùng nhóm, chung bối cảnh</td><td>Người chấm hoặc khán giả rộng hơn</td></tr>
<tr><td>Chuẩn bị</td><td>Nhẹ, nhưng LIÊN TỤC</td><td>Nặng, có tập dượt, có bấm giờ</td></tr>
<tr><td>Hỏng ở đâu</td><td>Không ai phát biểu thành quyết định, nên chẳng chốt được gì</td><td>Đọc nguyên slide; cháy giờ</td></tr>
<tr><td>Con đường tới giải pháp nằm ở đâu</td><td>Trong ghi chú chung sau buổi thảo luận</td><td>Trong chính CẤU TRÚC bài nói</td></tr>
</table>
<ul>
<li><strong>Làm việc nhóm LÀ truyền đạt bằng lời, dù cảm giác chỉ là "nói chuyện".</strong> Deck xếp nó vào đây có chủ đích: trong nhóm, giải pháp của bạn chỉ TỒN TẠI khi bạn nói ra đủ rõ để người khác hành động được. Một ý nằm trong đầu thì đóng góp bằng không vào sản phẩm của nhóm.</li>
<li><strong>Thuyết trình là nơi con đường tới giải pháp biến thành CẤU TRÚC.</strong> Vấn đề → các phương án → tiêu chí → giải pháp được chọn → bằng chứng. Đó chính là luật của slide 88 biến thành trình tự bài nói. Bài thuyết trình mở màn bằng đáp án rồi không bao giờ cho thấy phép so sánh là đã bỏ qua đúng thứ đang được chấm.</li>
<li><strong>Lời nói HAO HỤT, nên phải lặp lại và phải để lại dấu vết bằng chữ.</strong> Người nghe không cuộn ngược lại được. Hãy nói quyết định then chốt ở đầu, chứng minh nó, rồi nói lại ở cuối — và sau đó đưa vào tin nhắn hoặc biên bản để nó sống sót khỏi buổi họp.</li>
<li><strong>Canh giờ là một phần của kỹ năng thuyết trình.</strong> Bài mười hai phút mà nói hai mươi phút là hỏng ở khâu truyền đạt, không phải hỏng nội dung. Tập với đồng hồ; cắt đúng cái đoạn bạn thích nhất nếu nó không gánh điểm nào.</li>
<li><strong>Áp vào FPTU.</strong> Trong SWP391, truyền đạt bằng lời làm hai việc. Ở làm việc nhóm: mỗi buổi họp nhanh kết bằng một câu của mỗi người — xong gì, tắc gì, kế tiếp làm gì. Ở buổi bảo vệ: 10 phút của bạn đi theo cấu trúc con đường ở trên, để bảng tiêu chí có trọng số trên màn hình trong lúc bạn kể vì sao phương án thắng lại thắng.</li>
</ul>
<p class="meo">💡 Nhớ "Verbally" như một CẶP: <strong>làm việc nhóm + thuyết trình</strong>. Đúng hai mục — phương án nào thêm "gọi điện" hay "buổi tutorial" là đang độn thêm vào một danh sách mà slide cố ý giữ ngắn.</p>`],

      [91, 'Communicating solutions — Numerically: maths, engineering and sciences; written explanation often required',
        `<p class="y-chinh">🎯 The numerical form, with two bullets: it is <strong>used often in maths, engineering and sciences</strong>, and a <strong>written explanation is often required</strong> alongside the numbers. Note that the deck places this slide SECOND among the details, even though slide 89 listed it third.</p>
<ul>
<li><strong>"Written explanation often required" is the examinable half of this slide.</strong> Numbers do not speak for themselves. A result of 8.4 means nothing until you say what was measured, under what conditions, and what it implies. In academic contexts the number is evidence; the sentence around it is the argument.</li>
<li><strong>This is the solution-path rule (slide 88) applied to quantitative work.</strong> Showing only the final figure hides the path. Showing the method, the assumptions and the units makes the path checkable — which is exactly what a marker needs in order to award partial credit.</li>
<li><strong>The three named fields are examples, not a boundary.</strong> Maths, engineering and sciences use numbers most heavily, but a business report's Recommendations section (slide 93) and a survey in a social-science essay are numerical too. If an exam option claims numerical communication is "only used in science subjects", that is an over-reading.</li>
<li><strong>Precision conventions carry marks.</strong> Units, significant figures, sample size and the difference between an absolute and a relative change are all part of communicating numerically. "40% faster" without a baseline is not a measurement; it is a claim.</li>
<li><strong>FPTU application.</strong> In a SWP391 performance section, do not write "the API is fast". Write: "median response time fell from 420 ms to 180 ms (n = 500 requests, local test environment, after adding an index on order_id)" — then one sentence saying why that matters for the user. Number, conditions, meaning: that is the whole slide in one line.</li>
</ul>
<p class="dap-an">✅ Quick fix drill. Weak: "Our test coverage is good." Better (numerical + written): "Unit-test coverage is 78% of statements across the service layer; the untested 22% is concentrated in the reporting module, which we flag as the main regression risk for the next sprint." Same fact, now checkable and arguable.</p>
<p class="pitfall">⚠️ Careful with the deck's own ordering: slide 89 lists Numerically THIRD, but the detail slides put it SECOND (here, at 91) and Visually third (at 92). If you revise by slide number you will meet them in a different order from the list — that is the deck's inconsistency, not your misreading.</p>`,
        `<p class="y-chinh">🎯 Hình thức bằng SỐ, với hai gạch đầu dòng: nó <strong>được dùng nhiều trong toán, kỹ thuật và khoa học</strong>, và <strong>thường vẫn cần một phần giải thích bằng chữ</strong> đi kèm con số. Để ý deck xếp slide này ở vị trí THỨ HAI trong phần chi tiết, dù slide 89 liệt kê nó thứ ba.</p>
<ul>
<li><strong>"Written explanation often required" là nửa dễ ra đề của slide này.</strong> Con số không tự nói. Kết quả 8,4 chẳng nghĩa gì cho tới khi bạn nói đo cái gì, trong điều kiện nào, và nó hàm ý điều gì. Trong bối cảnh học thuật, con số là BẰNG CHỨNG; câu chữ bao quanh nó mới là LẬP LUẬN.</li>
<li><strong>Đây chính là luật con-đường-tới-giải-pháp (slide 88) áp vào công việc định lượng.</strong> Chỉ đưa con số cuối là giấu mất con đường. Đưa cả phương pháp, giả định và đơn vị thì con đường KIỂM ĐƯỢC — đúng thứ người chấm cần để cho điểm thành phần.</li>
<li><strong>Ba ngành được nêu tên là VÍ DỤ, không phải ranh giới.</strong> Toán, kỹ thuật và khoa học dùng số nhiều nhất, nhưng mục Khuyến nghị của một báo cáo kinh doanh (slide 93) hay một khảo sát trong tiểu luận khoa học xã hội cũng là giao tiếp bằng số. Phương án thi nào bảo giao tiếp bằng số "chỉ dùng trong các môn khoa học" là đọc quá lên.</li>
<li><strong>Quy ước về độ chính xác cũng ăn điểm.</strong> Đơn vị, số chữ số có nghĩa, cỡ mẫu, và phân biệt thay đổi TUYỆT ĐỐI với thay đổi TƯƠNG ĐỐI đều thuộc về việc truyền đạt bằng số. "Nhanh hơn 40%" mà không có mốc so sánh thì không phải phép đo; đó là một lời tuyên bố.</li>
<li><strong>Áp vào FPTU.</strong> Trong phần hiệu năng của SWP391, đừng viết "API chạy nhanh". Hãy viết: "thời gian phản hồi trung vị giảm từ 420 ms xuống 180 ms (n = 500 lượt gọi, môi trường thử nghiệm cục bộ, sau khi thêm chỉ mục trên order_id)" — rồi một câu nói vì sao điều đó quan trọng với người dùng. Con số, điều kiện, ý nghĩa: cả slide gói trong một dòng.</li>
</ul>
<p class="dap-an">✅ Bài tập sửa nhanh. Yếu: "Độ phủ test của nhóm em tốt." Tốt hơn (số + chữ): "Độ phủ unit test đạt 78% số câu lệnh ở tầng service; 22% chưa phủ tập trung ở module báo cáo, nhóm đánh dấu đây là rủi ro hồi quy chính cho sprint tới." Cùng một sự việc, nay kiểm được và tranh luận được.</p>
<p class="pitfall">⚠️ Cẩn thận với chính thứ tự của deck: slide 89 xếp Numerically THỨ BA, nhưng các slide chi tiết lại đặt nó THỨ HAI (chính là đây, slide 91) và Visually thứ ba (slide 92). Ôn theo số slide thì bạn sẽ gặp chúng theo trình tự khác danh sách — đó là sự không nhất quán của deck, không phải bạn đọc nhầm.</p>`],

      [92, 'Communicating solutions — Visually: tables, charts or diagrams; plans or blueprints; artworks',
        `<p class="y-chinh">🎯 The visual form, with three sub-items: <strong>Tables, charts or diagrams · Plans or blueprints · Artworks</strong>. Three, and the third one is the surprise.</p>
<table>
<tr><th>Sub-item</th><th>What it is for</th><th>Typical discipline</th><th>FPTU example</th></tr>
<tr><td>Tables, charts or diagrams</td><td>Showing comparison, trend, structure or flow</td><td>Any</td><td>Weighted-criteria table; ER diagram; sequence diagram</td></tr>
<tr><td>Plans or blueprints</td><td>Specifying something to be built, to scale</td><td>Architecture, engineering, construction</td><td>System architecture diagram; deployment topology; wireframes</td></tr>
<tr><td>Artworks</td><td>The solution IS the visual object</td><td>Design, fine arts, media</td><td>UI mock-ups, poster, motion graphic for a multimedia subject</td></tr>
</table>
<ul>
<li><strong>Why "artworks" belongs on an academic slide.</strong> In creative disciplines the artefact is the answer — there is no separate written solution it merely illustrates. Including it makes the point that "communicating a solution" is not a synonym for "writing about a solution". Expect this as the odd-one-out option in a multiple-choice question; it is genuinely on the slide.</li>
<li><strong>Tables versus charts is a real decision, not a style choice.</strong> Use a table when exact values must be read and compared row by row; use a chart when the shape of the data — trend, spread, proportion — is the message. Putting six numbers in a pie chart hides them; putting a hundred numbers in a table hides the trend.</li>
<li><strong>A visual still needs a caption and a sentence.</strong> Same principle as the numerical slide: the reader must be told what to look at and what conclusion it supports. An uncaptioned diagram dropped into a report is decoration, and markers treat it as such.</li>
<li><strong>Diagrams are how you show a solution PATH compactly.</strong> A one-page flow from problem to chosen option does in a glance what three paragraphs do slowly. That makes the visual form unusually efficient at satisfying slide 88's rule.</li>
<li><strong>FPTU application.</strong> A SWP391 report should carry at least: an ER diagram (structure), a sequence diagram for the critical use case (behaviour), and one chart of the recovery plan or the sprint burndown (trend). Each with a numbered caption and a sentence in the body that refers to it — otherwise the marker is not obliged to read it.</li>
</ul>
<p class="meo">💡 Count to hold: Verbally <strong>2</strong>, Numerically <strong>2</strong>, Visually <strong>3</strong>, Written <strong>4</strong>. The four detail slides have 2-2-3-4 sub-items in slide-number order 90-91-92-93 — an easy numeric spine for recall.</p>`,
        `<p class="y-chinh">🎯 Hình thức bằng HÌNH, với ba mục con: <strong>Bảng, biểu đồ hoặc sơ đồ · Bản vẽ hoặc bản thiết kế · Tác phẩm nghệ thuật</strong>. Ba mục, và mục thứ ba mới là bất ngờ.</p>
<table>
<tr><th>Mục con</th><th>Dùng để làm gì</th><th>Ngành điển hình</th><th>Ví dụ ở FPTU</th></tr>
<tr><td>Bảng, biểu đồ, sơ đồ</td><td>Cho thấy so sánh, xu hướng, cấu trúc hoặc luồng</td><td>Mọi ngành</td><td>Bảng tiêu chí có trọng số; sơ đồ ERD; sequence diagram</td></tr>
<tr><td>Bản vẽ / bản thiết kế</td><td>Đặc tả thứ sắp được xây, theo tỉ lệ</td><td>Kiến trúc, kỹ thuật, xây dựng</td><td>Sơ đồ kiến trúc hệ thống; sơ đồ triển khai; wireframe</td></tr>
<tr><td>Tác phẩm nghệ thuật</td><td>Bản thân hình ảnh CHÍNH LÀ giải pháp</td><td>Thiết kế, mỹ thuật, truyền thông</td><td>Bản mock-up giao diện, poster, motion graphic cho môn đa phương tiện</td></tr>
</table>
<ul>
<li><strong>Vì sao "artworks" lại nằm trên một slide học thuật.</strong> Ở các ngành sáng tạo, chính TÁC PHẨM là câu trả lời — không có một giải pháp bằng chữ riêng biệt mà nó chỉ đi minh hoạ. Đưa mục này vào là để nói rằng "truyền đạt giải pháp" KHÔNG đồng nghĩa với "viết về giải pháp". Hãy chờ nó xuất hiện như phương án lạc loài trong câu trắc nghiệm; nó có thật trên slide.</li>
<li><strong>Chọn bảng hay biểu đồ là một quyết định thật, không phải chuyện thẩm mỹ.</strong> Dùng BẢNG khi phải đọc và so từng giá trị chính xác theo dòng; dùng BIỂU ĐỒ khi thông điệp là HÌNH DẠNG của dữ liệu — xu hướng, độ phân tán, tỉ lệ. Nhét sáu con số vào biểu đồ tròn là giấu chúng đi; nhét một trăm con số vào bảng là giấu mất xu hướng.</li>
<li><strong>Hình ảnh vẫn cần CHÚ THÍCH và một câu dẫn.</strong> Cùng nguyên tắc với slide về số: người đọc phải được chỉ cho biết nhìn vào đâu và điều đó chứng minh kết luận nào. Một sơ đồ thả vào báo cáo mà không có chú thích là đồ trang trí, và người chấm sẽ đối xử với nó đúng như vậy.</li>
<li><strong>Sơ đồ là cách trình bày CON ĐƯỜNG tới giải pháp một cách gọn nhất.</strong> Một trang luồng đi từ vấn đề tới phương án được chọn làm trong một cái liếc mắt cái việc mà ba đoạn văn làm rất chậm. Điều đó khiến hình thức trực quan đặc biệt hiệu quả trong việc thoả luật của slide 88.</li>
<li><strong>Áp vào FPTU.</strong> Báo cáo SWP391 nên có tối thiểu: một ERD (cấu trúc), một sequence diagram cho ca sử dụng then chốt (hành vi), và một biểu đồ về kế hoạch cứu vãn hoặc burndown của sprint (xu hướng). Mỗi hình kèm chú thích có đánh số và một câu trong thân bài dẫn tới nó — không thì người chấm không có nghĩa vụ phải đọc.</li>
</ul>
<p class="meo">💡 Bộ số cần giữ: Verbally <strong>2</strong>, Numerically <strong>2</strong>, Visually <strong>3</strong>, Written <strong>4</strong>. Bốn slide chi tiết có 2-2-3-4 mục con theo đúng thứ tự slide 90-91-92-93 — một xương sống số dễ nhớ.</p>`],

      [93, 'Communicating solutions — Written: lab notes, Results & Discussion, Recommendations, Rationale',
        `<p class="y-chinh">🎯 The written form, and the only one whose headline bullet carries a condition: <strong>"Written: sometimes just the solution, sometimes different solutions and evaluation"</strong>. Then four places where it happens: <strong>Lab notes · Results and Discussion sections of research reports · Recommendations section in business reports · Rationale</strong>.</p>
<table>
<tr><th>Genre</th><th>Contains</th><th>Path shown?</th><th>FPTU counterpart</th></tr>
<tr><td>Lab notes</td><td>What was done, observed, measured, as it happened</td><td>Yes — it IS the path, in real time</td><td>Sprint log, experiment notebook, debugging journal</td></tr>
<tr><td>Results and Discussion (research reports)</td><td>The findings, then what they mean and their limits</td><td>Yes — evaluation is the Discussion</td><td>Testing chapter + analysis in a capstone report</td></tr>
<tr><td>Recommendations (business reports)</td><td>The chosen course of action, for a decision-maker</td><td>Often compressed — sometimes just the solution</td><td>Proposal to a mock client; final section of a project report</td></tr>
<tr><td>Rationale</td><td>The justification: why this and not that</td><td>Yes — it is nothing BUT the path</td><td>Technology-choice justification; design-decision record</td></tr>
</table>
<ul>
<li><strong>The conditional headline is the point of the slide.</strong> Sometimes the genre wants only the answer (an executive summary, a recommendation to a busy client); sometimes it wants the full set of options and the evaluation (a discussion section, a rationale). Knowing which genre you are writing in tells you how much of the path to expose — this is the most sophisticated idea in Module 5.</li>
<li><strong>"Rationale" is the term worth memorising.</strong> It is the genre whose entire purpose is the reasoning. If an exam asks which written form exists specifically to justify a choice, the answer is Rationale — not Results, not Recommendations.</li>
<li><strong>Lab notes are written for the future, including future you.</strong> Their value is that they are contemporaneous: written while the work happens, not reconstructed afterwards. A reconstructed lab note is a story; a real one is evidence.</li>
<li><strong>Results and Discussion is deliberately two things.</strong> Results state what was found without interpretation; Discussion interprets, compares with the literature and admits limitations. Merging them is the most common structural error in student research reports.</li>
<li><strong>FPTU application, running the delayed SWP391 project end to end.</strong> Lab note: the daily log showing when the missing member's module stalled. Results: measured sprint velocity and the two-week gap. Discussion: why the gap opened and what the evidence says about the cause. Recommendations: freeze scope, redistribute the module, cut the analytics page. Rationale: the Fogler &amp; LeBlanc table from slide 82 with musts, wants and weights. Four written genres, one problem, one coherent document.</li>
</ul>
<p class="meo">💡 Four written genres, and an easy sorting rule: <strong>Lab notes = as it happened · Results = what was found · Recommendations = what to do · Rationale = why</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình thức bằng CHỮ VIẾT, và là hình thức duy nhất có gạch đầu dòng tiêu đề mang một ĐIỀU KIỆN: <strong>"Written: sometimes just the solution, sometimes different solutions and evaluation"</strong> (khi thì chỉ mỗi giải pháp, khi thì nhiều giải pháp kèm phần đánh giá). Rồi bốn nơi nó xuất hiện: <strong>Ghi chép thí nghiệm · Mục Kết quả và Bàn luận của báo cáo nghiên cứu · Mục Khuyến nghị trong báo cáo kinh doanh · Rationale (phần lý giải)</strong>.</p>
<table>
<tr><th>Thể loại</th><th>Chứa gì</th><th>Có phơi con đường không?</th><th>Đối ứng ở FPTU</th></tr>
<tr><td>Lab notes (ghi chép thí nghiệm)</td><td>Đã làm gì, quan sát gì, đo gì — ngay lúc nó diễn ra</td><td>Có — nó CHÍNH LÀ con đường, theo thời gian thực</td><td>Nhật ký sprint, sổ thí nghiệm, nhật ký gỡ lỗi</td></tr>
<tr><td>Results and Discussion (báo cáo nghiên cứu)</td><td>Kết quả, rồi ý nghĩa và giới hạn của chúng</td><td>Có — phần đánh giá nằm ở Discussion</td><td>Chương kiểm thử + phân tích trong báo cáo capstone</td></tr>
<tr><td>Recommendations (báo cáo kinh doanh)</td><td>Phương án hành động được chọn, cho người ra quyết định</td><td>Thường bị nén — đôi khi chỉ còn giải pháp</td><td>Đề xuất gửi khách hàng giả lập; mục cuối của báo cáo đồ án</td></tr>
<tr><td>Rationale</td><td>Phần biện minh: vì sao chọn cái này mà không phải cái kia</td><td>Có — nó KHÔNG CÓ GÌ KHÁC ngoài con đường</td><td>Lý giải lựa chọn công nghệ; biên bản quyết định thiết kế</td></tr>
</table>
<ul>
<li><strong>Cái gạch đầu dòng CÓ ĐIỀU KIỆN mới là trọng tâm của slide.</strong> Có lúc thể loại chỉ cần đáp án (bản tóm tắt cho lãnh đạo, một khuyến nghị gửi khách hàng bận rộn); có lúc nó cần trọn bộ phương án kèm phần đánh giá (mục Bàn luận, phần Rationale). Biết mình đang viết trong THỂ LOẠI nào sẽ cho biết phải phơi bao nhiêu phần con đường — đây là ý tinh tế nhất của Module 5.</li>
<li><strong>"Rationale" là thuật ngữ đáng thuộc.</strong> Đó là thể loại mà toàn bộ mục đích tồn tại là LẬP LUẬN. Nếu đề hỏi hình thức viết nào sinh ra riêng để biện minh cho một lựa chọn, đáp án là Rationale — không phải Results, không phải Recommendations.</li>
<li><strong>Lab notes viết cho TƯƠNG LAI, kể cả cho chính bạn sau này.</strong> Giá trị của nó nằm ở tính ĐỒNG THỜI: viết trong lúc công việc diễn ra, không phải dựng lại sau đó. Một ghi chép dựng lại là một câu chuyện; một ghi chép thật là bằng chứng.</li>
<li><strong>Results và Discussion cố ý là HAI thứ.</strong> Results nêu cái tìm được mà không diễn giải; Discussion mới diễn giải, so với tài liệu đã có và thừa nhận giới hạn. Gộp hai phần là lỗi cấu trúc phổ biến nhất trong báo cáo nghiên cứu của sinh viên.</li>
<li><strong>Áp vào FPTU, chạy trọn ca SWP391 bị trễ.</strong> Lab note: nhật ký hằng ngày cho thấy module của thành viên vắng mặt kẹt từ lúc nào. Results: vận tốc sprint đo được và khoảng hụt hai tuần. Discussion: vì sao khoảng hụt mở ra và bằng chứng nói gì về nguyên nhân. Recommendations: đóng băng phạm vi, chia lại module, cắt trang thống kê. Rationale: chính cái bảng Fogler &amp; LeBlanc ở slide 82 với musts, wants và trọng số. Bốn thể loại viết, một vấn đề, một tài liệu mạch lạc.</li>
</ul>
<p class="meo">💡 Bốn thể loại viết, và một luật phân loại dễ nhớ: <strong>Lab notes = diễn ra thế nào · Results = tìm được gì · Recommendations = nên làm gì · Rationale = vì sao</strong>.</p>`],

      [94, 'Summary: Communicating solutions in academic contexts — the four forms RENAMED (Spoken, Numbers, Visuals, Writing)',
        `<p class="y-chinh">🎯 The section summary: <strong>Understand your audience · Communicate the solution path · Forms solutions take: Spoken – group work and presentation · Numbers · Visuals – charts, diagrams, artworks · Writing – lab notes, reports.</strong> Same content as slides 88–93, with two visible changes.</p>
<table>
<tr><th>Slide 89 name</th><th>Slide 94 name</th><th>Detail kept in the summary</th></tr>
<tr><td>Verbally</td><td><strong>Spoken</strong></td><td>group work and presentation</td></tr>
<tr><td>Numerically</td><td><strong>Numbers</strong></td><td>(no detail given)</td></tr>
<tr><td>Visually</td><td><strong>Visuals</strong></td><td>charts, diagrams, artworks</td></tr>
<tr><td>Written</td><td><strong>Writing</strong></td><td>lab notes, reports</td></tr>
</table>
<ul>
<li><strong>Change 1 — the labels move from adverbs to nouns.</strong> Verbally/Visually/Numerically/Written become Spoken/Numbers/Visuals/Writing. Nothing conceptual changes, but an exam option written in either vocabulary can be correct, so recognise both sets.</li>
<li><strong>Change 2 — the truncation of bullet two.</strong> Slide 88 said "Communicate the solution path, <em>not just the solution</em>"; the summary keeps only "Communicate the solution path". The contrast that gave the rule its bite has been dropped. Learn the LONG version — it is the one that explains why the rule exists.</li>
<li><strong>The summary also fixes the ordering problem.</strong> Slide 89 listed Verbally→Visually→Numerically→Written, but the detail slides ran Verbal→Numerical→Visual→Written. Slide 94 matches the detail order (Spoken, Numbers, Visuals, Writing). If you need one canonical order, use this one.</li>
<li><strong>Losing detail in a summary is normal; losing a contrast is not.</strong> Notice that "Numbers" arrives here with no sub-items at all, while slide 91 had two. A summary slide is a reminder, not a replacement — revise from 88–93 and use 94 only as a checklist.</li>
<li><strong>FPTU application.</strong> Use slide 94 as the actual pre-submission checklist for any SWP391 or capstone deliverable: (1) Do I know who reads this? (2) Is the path visible, not just the answer? (3) Have I used spoken, numeric, visual and written forms where each is strongest? Three questions, one minute, and they catch most avoidable losses.</li>
</ul>
<p class="pitfall">⚠️ This is the "renamed criteria" trap the deck sets more than once. The SAME four categories appear under two different label sets, five slides apart. An exam option using either set of names can be the correct answer — what would be WRONG is a list of <strong>three</strong> forms, or one that adds a fifth.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục: <strong>Hiểu đối tượng · Truyền đạt con đường tới giải pháp · Các hình thức mà giải pháp mang: Spoken – làm việc nhóm và thuyết trình · Numbers · Visuals – biểu đồ, sơ đồ, tác phẩm · Writing – ghi chép thí nghiệm, báo cáo.</strong> Cùng nội dung với slide 88–93, nhưng có hai thay đổi nhìn thấy được.</p>
<table>
<tr><th>Tên ở slide 89</th><th>Tên ở slide 94</th><th>Chi tiết còn giữ trong bản tóm tắt</th></tr>
<tr><td>Verbally</td><td><strong>Spoken</strong></td><td>làm việc nhóm và thuyết trình</td></tr>
<tr><td>Numerically</td><td><strong>Numbers</strong></td><td>(không nêu chi tiết nào)</td></tr>
<tr><td>Visually</td><td><strong>Visuals</strong></td><td>biểu đồ, sơ đồ, tác phẩm nghệ thuật</td></tr>
<tr><td>Written</td><td><strong>Writing</strong></td><td>ghi chép thí nghiệm, báo cáo</td></tr>
</table>
<ul>
<li><strong>Thay đổi 1 — nhãn chuyển từ TRẠNG TỪ sang DANH TỪ.</strong> Verbally/Visually/Numerically/Written thành Spoken/Numbers/Visuals/Writing. Về khái niệm không có gì đổi, nhưng phương án thi viết theo bộ từ vựng nào cũng có thể đúng, nên phải nhận ra CẢ HAI bộ.</li>
<li><strong>Thay đổi 2 — gạch đầu dòng thứ hai bị CẮT CỤT.</strong> Slide 88 viết "Communicate the solution path, <em>not just the solution</em>"; bản tóm tắt chỉ còn "Communicate the solution path". Vế đối lập — thứ làm nên sức nặng của luật — đã bị bỏ. Hãy thuộc bản DÀI: đó mới là bản giải thích vì sao luật này tồn tại.</li>
<li><strong>Bản tóm tắt cũng SỬA luôn lỗi thứ tự.</strong> Slide 89 liệt kê Verbally→Visually→Numerically→Written, nhưng các slide chi tiết chạy Verbal→Numerical→Visual→Written. Slide 94 khớp với thứ tự chi tiết (Spoken, Numbers, Visuals, Writing). Nếu cần một thứ tự chuẩn để nhớ, hãy dùng thứ tự này.</li>
<li><strong>Tóm tắt mất chi tiết là bình thường; mất VẾ ĐỐI LẬP thì không.</strong> Để ý "Numbers" đến đây không còn mục con nào, trong khi slide 91 có hai. Slide tóm tắt là lời nhắc, không phải bản thay thế — hãy ôn từ 88–93 và chỉ dùng 94 làm bảng kiểm.</li>
<li><strong>Áp vào FPTU.</strong> Hãy dùng slide 94 làm bảng kiểm trước khi nộp cho bất kỳ sản phẩm SWP391 hay capstone nào: (1) Mình có biết ai sẽ đọc cái này không? (2) Con đường có nhìn thấy được không, hay chỉ có đáp án? (3) Mình đã dùng hình thức nói, số, hình và chữ ở đúng chỗ mỗi thứ mạnh nhất chưa? Ba câu hỏi, một phút, và chúng chặn được phần lớn những mất mát oan uổng.</li>
</ul>
<p class="pitfall">⚠️ Đây chính là bẫy "đổi tên tiêu chí" mà deck giăng không chỉ một lần. CÙNG bốn nhóm ấy xuất hiện dưới hai bộ nhãn khác nhau, cách nhau năm slide. Phương án thi dùng bộ tên nào cũng có thể là đáp án đúng — thứ SAI sẽ là danh sách <strong>ba</strong> hình thức, hoặc danh sách thêm hình thức thứ năm.</p>`],

      [95, '5.1b Communicating Solutions in Written & Oral Form (objectives repeated a THIRD time)',
        `<p class="y-chinh">🎯 A new section label — <strong>5.1b Communicating Solutions in Written &amp; Oral Form</strong> — sitting on top of the SAME three objectives printed on slides 86 and 87. Third printing of the identical block.</p>
<ul>
<li><strong>The heading promises a split the objectives do not deliver.</strong> "Written &amp; Oral Form" suggests a section contrasting the two; the bullets underneath are still "identify your target audience / verbally, visually and numerically / communicated differently in academic contexts". The deck labels the section but reuses the divider page.</li>
<li><strong>What 5.1b actually covers, judged by what follows.</strong> The next slide (96) is a summary about exams — i.e. written solutions under time pressure. So in this review deck the practical content of 5.1b is the exam-answer material, and the objectives page is just the divider that precedes it.</li>
<li><strong>Written and oral do differ in one way worth knowing.</strong> Written communication is re-readable: the reader controls the pace and can check back, so density is affordable. Oral communication is single-pass: the listener cannot rewind, so you repeat the key point and keep one idea per sentence. Same solution path, different delivery budget.</li>
<li><strong>Say it plainly again: no new examinable content on this slide.</strong> If you have the three objectives and the four forms, slide 95 asks nothing more of you. The value of reading it is confirming that 5.1a and 5.1b are two labels over one body of material.</li>
<li><strong>FPTU application.</strong> The same SWP391 result gets an oral version (defence: one claim per sentence, the key decision repeated at start and end) and a written version (report: dense, with the full weighted table and citations). Write the dense one first, then cut it down for speech — never the reverse, or the report inherits the thinness of the talk.</li>
</ul>
<table>
<tr><th></th><th>Written form</th><th>Oral form</th></tr>
<tr><td>Reader/listener controls pace</td><td>Yes</td><td>No</td></tr>
<tr><td>Can re-check a detail</td><td>Yes</td><td>No</td></tr>
<tr><td>Affordable density</td><td>High</td><td>Low — one idea per sentence</td></tr>
<tr><td>Repetition</td><td>Looks like padding</td><td>Necessary</td></tr>
<tr><td>Evidence appears as</td><td>Tables, citations, appendices</td><td>One headline number, plus a slide</td></tr>
</table>
<p class="meo">💡 Running count of repeats: this is the <strong>third</strong> printing of the 5.1 objectives (86, 87, 95). Two more repeated blocks follow at 97/99/100 and 98/101. Recognising them is what keeps the last seven slides from feeling like new material.</p>`,
        `<p class="y-chinh">🎯 Một nhãn mục mới — <strong>5.1b Communicating Solutions in Written &amp; Oral Form</strong> — đặt lên trên ĐÚNG ba chuẩn đầu ra đã in ở slide 86 và 87. Lần in thứ ba của cùng một khối.</p>
<ul>
<li><strong>Tiêu đề hứa một sự phân đôi mà phần chuẩn đầu ra không giao.</strong> "Written &amp; Oral Form" gợi ý một mục đối chiếu viết với nói; nhưng các gạch đầu dòng bên dưới vẫn là "xác định đối tượng / bằng lời, hình, số / truyền đạt khác đi trong bối cảnh học thuật". Deck đặt nhãn cho mục nhưng dùng lại trang phân cách cũ.</li>
<li><strong>5.1b thật sự bàn gì, xét theo thứ đứng sau nó.</strong> Slide kế tiếp (96) là bản tóm tắt về PHÒNG THI — tức là giải pháp viết ra dưới áp lực thời gian. Vậy trong deck ôn tập này, nội dung thực dụng của 5.1b là phần bài thi, còn trang chuẩn đầu ra chỉ là tấm phân cách đứng trước.</li>
<li><strong>Viết và nói có MỘT khác biệt đáng biết.</strong> Bản viết ĐỌC LẠI ĐƯỢC: người đọc làm chủ nhịp và kiểm tra ngược được, nên chịu được mật độ cao. Bản nói chỉ đi một lượt: người nghe không tua lại được, nên phải lặp ý then chốt và giữ mỗi câu một ý. Cùng con đường tới giải pháp, khác hạn mức truyền tải.</li>
<li><strong>Nói thẳng lần nữa: slide này không có nội dung mới nào ra đề được.</strong> Nếu bạn đã nắm ba chuẩn đầu ra và bốn hình thức, slide 95 không đòi hỏi gì thêm. Giá trị của việc đọc nó là xác nhận rằng 5.1a và 5.1b là hai cái nhãn phủ lên MỘT khối tài liệu.</li>
<li><strong>Áp vào FPTU.</strong> Cùng một kết quả SWP391 sẽ có bản nói (bảo vệ: mỗi câu một khẳng định, quyết định then chốt lặp ở đầu và cuối) và bản viết (báo cáo: đậm đặc, có đủ bảng trọng số và trích dẫn). Hãy viết bản ĐẬM trước rồi rút gọn cho bài nói — đừng làm ngược, không thì báo cáo sẽ thừa hưởng sự mỏng của bài nói.</li>
</ul>
<table>
<tr><th></th><th>Bản VIẾT</th><th>Bản NÓI</th></tr>
<tr><td>Người nhận làm chủ nhịp</td><td>Có</td><td>Không</td></tr>
<tr><td>Kiểm tra lại một chi tiết</td><td>Được</td><td>Không được</td></tr>
<tr><td>Mật độ chịu được</td><td>Cao</td><td>Thấp — mỗi câu một ý</td></tr>
<tr><td>Lặp lại</td><td>Trông như độn bài</td><td>BẮT BUỘC</td></tr>
<tr><td>Bằng chứng xuất hiện dưới dạng</td><td>Bảng, trích dẫn, phụ lục</td><td>Một con số chủ chốt, kèm một slide</td></tr>
</table>
<p class="meo">💡 Đếm dồn số lần lặp: đây là lần in <strong>thứ ba</strong> của khối chuẩn đầu ra 5.1 (86, 87, 95). Còn hai khối lặp nữa ở 97/99/100 và 98/101. Nhận ra chúng chính là thứ giữ cho bảy slide cuối không bị cảm giác như tài liệu mới.</p>`],

      [96, 'Summary: Communicating solutions in exams — Before the day (3) and On exam day (4)',
        `<p class="y-chinh">🎯 The most directly useful slide in this whole stretch, and the one closest to the SSL101c assessment itself. Two headings with <strong>3 + 4</strong> items: <strong>Before the day</strong> — know the date, time and format of the exam; create a revision timetable; revise actively. <strong>On exam day</strong> — manage your time carefully; include brainstorming and planning time; choose questions quickly and carefully; follow question instructions accurately.</p>
<table>
<tr><th>Before the day (3)</th><th>What it means in practice</th></tr>
<tr><td>Know the date, time and format</td><td>Three separate facts. FORMAT is the one students skip — and it decides how you revise</td></tr>
<tr><td>Create a revision timetable</td><td>Distributed sessions with named topics, not "revise everything Sunday"</td></tr>
<tr><td>Revise actively</td><td>Self-test, recall from blank paper, explain aloud — NOT re-reading slides</td></tr>
</table>
<table>
<tr><th>On exam day (4)</th><th>What it means in practice</th></tr>
<tr><td>Manage your time carefully</td><td>Minutes per question, decided before you start writing</td></tr>
<tr><td>Include brainstorming and planning time</td><td>Planning is part of the budget, not stolen from it</td></tr>
<tr><td>Choose questions quickly and carefully</td><td>Both at once: read all options fast, then commit and stop second-guessing</td></tr>
<tr><td>Follow question instructions accurately</td><td>Compare, evaluate, list, justify — the verb is the instruction</td></tr>
</table>
<ul>
<li><strong>"Revise actively" is the highest-yield line on the slide.</strong> Re-reading feels productive and produces almost nothing: recognition is not recall. Active revision means closing the deck and writing out the four Fogler &amp; LeBlanc steps, the two evaluation method families, the four communication forms — then checking. Every count in this lesson is a ready-made active-recall prompt.</li>
<li><strong>"Include brainstorming and planning time" is the section's own idea applied to exams.</strong> Mooc 2 spent forty slides arguing that you generate options before choosing one. Under exam pressure the instinct is to start writing immediately; the slide says budget the thinking instead.</li>
<li><strong>"Quickly AND carefully" is deliberately a tension.</strong> Spend too long choosing and you lose writing time; choose carelessly and you commit to a question you cannot finish. The practical resolution: read every question once at speed, mark the two you can answer best, pick within 60 seconds, then never revisit the choice.</li>
<li><strong>"Follow question instructions accurately" is the exam version of slide 84's "check against the rubric and the question".</strong> The same idea appears twice in Module 5 in two different registers — which is a signal it really does decide marks.</li>
<li><strong>FPTU application, specific to SSL101c.</strong> This subject is 100% one 60-minute multiple-choice exam covering all five MOOCs, and you must hold certificates for all five to sit it. So: know the format (multiple-choice, 60 minutes, on campus); timetable a pass over each Mooc's counts; revise actively from the numbers (2 methods, 4 steps, 3 academic principles, 4 communication forms, 3+4 exam habits, 4+4 group factors); on the day, budget roughly one minute per question and do not leave blanks.</li>
</ul>
<p class="meo">💡 Memorise this slide as <strong>3 before + 4 during</strong>. It is also the only slide in the stretch whose content you will use on the SSL101c exam itself — which makes it worth writing out from memory tonight.</p>`,
        `<p class="y-chinh">🎯 Slide có ích trực tiếp nhất trong cả đoạn này, và là slide gần bài thi SSL101c nhất. Hai đề mục với <strong>3 + 4</strong> mục: <strong>Trước ngày thi</strong> — biết ngày, giờ và ĐỊNH DẠNG bài thi; lập thời khoá biểu ôn; ôn CHỦ ĐỘNG. <strong>Vào ngày thi</strong> — quản lý thời gian cẩn thận; dành sẵn thời gian động não và lập dàn ý; chọn câu hỏi nhanh mà vẫn kỹ; bám ĐÚNG yêu cầu của đề.</p>
<table>
<tr><th>Trước ngày thi (3)</th><th>Thực tế nghĩa là gì</th></tr>
<tr><td>Biết ngày, giờ và định dạng</td><td>BA dữ kiện riêng biệt. ĐỊNH DẠNG là thứ sinh viên hay bỏ qua — mà nó quyết định cách ôn</td></tr>
<tr><td>Lập thời khoá biểu ôn</td><td>Các buổi rải ra, có ghi rõ chủ đề, chứ không phải "chủ nhật ôn hết"</td></tr>
<tr><td>Ôn CHỦ ĐỘNG</td><td>Tự kiểm, nhớ lại từ giấy trắng, giảng to thành tiếng — KHÔNG phải đọc lại slide</td></tr>
</table>
<table>
<tr><th>Vào ngày thi (4)</th><th>Thực tế nghĩa là gì</th></tr>
<tr><td>Quản lý thời gian cẩn thận</td><td>Số phút cho mỗi câu, quyết định TRƯỚC khi bắt đầu viết</td></tr>
<tr><td>Dành thời gian động não và lập dàn ý</td><td>Việc nghĩ nằm TRONG ngân sách, không phải bị xén từ ngân sách</td></tr>
<tr><td>Chọn câu hỏi nhanh mà kỹ</td><td>Cả hai cùng lúc: đọc lướt hết mọi lựa chọn, rồi chốt và thôi phân vân</td></tr>
<tr><td>Bám đúng yêu cầu của đề</td><td>So sánh, đánh giá, liệt kê, biện minh — ĐỘNG TỪ chính là mệnh lệnh</td></tr>
</table>
<ul>
<li><strong>"Ôn chủ động" là dòng cho năng suất cao nhất trên slide.</strong> Đọc lại cho cảm giác đang làm việc mà gần như không sinh ra gì: NHẬN RA không phải là NHỚ LẠI. Ôn chủ động là gập slide lại rồi viết ra bốn bước Fogler &amp; LeBlanc, hai họ phương pháp đánh giá, bốn hình thức truyền đạt — rồi mới đối chiếu. Mọi con số trong bài học này đều là một câu gợi nhớ chủ động dựng sẵn.</li>
<li><strong>"Dành thời gian động não và lập dàn ý" là chính ý tưởng của mục này áp vào phòng thi.</strong> Mooc 2 đã dùng bốn chục slide để lập luận rằng phải sinh phương án trước khi chọn. Dưới áp lực thi, bản năng là viết ngay lập tức; slide bảo hãy cấp ngân sách cho việc NGHĨ.</li>
<li><strong>"Nhanh MÀ kỹ" là một sự căng thẳng có chủ đích.</strong> Chọn quá lâu thì mất thời gian viết; chọn ẩu thì cam kết với một câu mình không làm xong nổi. Cách gỡ thực dụng: đọc lướt toàn bộ đề một lượt, đánh dấu hai câu làm tốt nhất, chốt trong vòng 60 giây, rồi TUYỆT ĐỐI không quay lại xét lại lựa chọn.</li>
<li><strong>"Bám đúng yêu cầu của đề" chính là bản phòng thi của luật "đối chiếu rubric và đề bài" ở slide 84.</strong> Cùng một ý xuất hiện HAI lần trong Module 5 ở hai giọng khác nhau — đó là tín hiệu cho thấy nó thật sự quyết định điểm.</li>
<li><strong>Áp vào FPTU, riêng cho SSL101c.</strong> Môn này 100% là MỘT bài trắc nghiệm 60 phút phủ cả năm MOOC, và phải có chứng chỉ đủ năm MOOC mới được thi. Vậy: biết định dạng (trắc nghiệm, 60 phút, thi tại trường); xếp lịch quét qua các CON SỐ của từng Mooc; ôn chủ động từ những con số đó (2 phương pháp, 4 bước, 3 nguyên tắc học thuật, 4 hình thức truyền đạt, 3+4 thói quen thi, 4+4 yếu tố nhóm); ngày thi phân bổ khoảng một phút mỗi câu và không để trống câu nào.</li>
</ul>
<p class="meo">💡 Nhớ slide này thành <strong>3 trước + 4 trong</strong>. Đây cũng là slide DUY NHẤT của đoạn mà nội dung được dùng ngay trên chính bài thi SSL101c — đáng để viết lại từ trí nhớ ngay tối nay.</p>`],

      [97, '5.3a Group Problem-Solving (module objectives — two outcomes)',
        `<p class="y-chinh">🎯 The final section of Mooc 2 opens with just <strong>TWO</strong> objectives — the shortest objectives block in the deck: <strong>identify ways to increase group problem-solving effectiveness</strong> and <strong>recognise problems within groups and identify strategies for overcoming group problems</strong>.</p>
<ul>
<li><strong>Two objectives, and they are two different jobs.</strong> The first is proactive — how to make a group work well from the start. The second is reactive — how to spot and fix a group that is already going wrong. Slides 98 and 101 answer the first; the second is what your own project experience has to supply.</li>
<li><strong>Note the phrase "problems WITHIN groups".</strong> Mooc 2 has spent its whole length on problems the group is solving; this section turns the lens around to problems the group IS. A team can be technically capable and still fail on coordination, and that failure mode is the subject here.</li>
<li><strong>Why group problem-solving is a taught skill, not a social accident.</strong> Groups do not automatically beat individuals: they beat individuals when interaction and structure are deliberately arranged. Slide 98 names exactly those two conditions. Without them a group is slower than one competent person.</li>
<li><strong>This closes the Mooc 2 arc.</strong> Define → generate (creatively) → evaluate → communicate → and now do all four together with other people. Every technique you learned individually has a group version: brainstorming needs a facilitator, evaluation needs agreed weights, communication needs a shared record.</li>
<li><strong>FPTU application.</strong> SWP391, SWR302, SWT301 and the capstone are all graded group work, and they are where these two objectives are tested for real. "Identify ways to increase effectiveness" = you set up check-ins and a shared timeline in week one. "Recognise problems within groups" = you notice a silent member in week three, not in week ten when the deadline is gone.</li>
</ul>
<table>
<tr><th>Objective</th><th>Timing</th><th>Slides that answer it</th></tr>
<tr><td>Increase group problem-solving effectiveness</td><td>Set up, before trouble</td><td>98 and 101 (Interaction + Structure)</td></tr>
<tr><td>Recognise problems within groups &amp; overcome them</td><td>Repair, during trouble</td><td>Named in the objectives; the deck gives no dedicated content slide</td></tr>
</table>
<p class="pitfall">⚠️ Be honest about the deck here: this same two-bullet block is printed THREE times (97, 99, 100) and the summary slide is printed TWICE (98, 101). The last five slides of Mooc 2 contain only two distinct pages of content.</p>`,
        `<p class="y-chinh">🎯 Mục cuối cùng của Mooc 2 mở màn với chỉ <strong>HAI</strong> chuẩn đầu ra — khối chuẩn đầu ra ngắn nhất deck: <strong>xác định các cách làm tăng hiệu quả giải quyết vấn đề theo nhóm</strong> và <strong>nhận ra các vấn đề BÊN TRONG nhóm và xác định chiến lược khắc phục chúng</strong>.</p>
<ul>
<li><strong>Hai chuẩn đầu ra, và đó là hai công việc khác nhau.</strong> Cái thứ nhất mang tính CHỦ ĐỘNG — làm sao để nhóm chạy tốt ngay từ đầu. Cái thứ hai mang tính ỨNG PHÓ — làm sao phát hiện và sửa một nhóm đang hỏng. Slide 98 và 101 trả lời cái thứ nhất; cái thứ hai phải do chính trải nghiệm đồ án của bạn bù vào.</li>
<li><strong>Để ý cụm "problems WITHIN groups" — vấn đề BÊN TRONG nhóm.</strong> Suốt chiều dài Mooc 2 nói về vấn đề mà nhóm ĐANG GIẢI; mục này quay ống kính lại phía vấn đề mà nhóm CHÍNH LÀ. Một đội có thể giỏi kỹ thuật mà vẫn hỏng ở khâu phối hợp, và đúng kiểu hỏng đó là chủ đề ở đây.</li>
<li><strong>Vì sao giải quyết vấn đề theo nhóm là kỹ năng ĐƯỢC DẠY, không phải tai nạn xã hội.</strong> Nhóm KHÔNG tự động thắng cá nhân: nhóm thắng khi tương tác và cấu trúc được sắp đặt có chủ đích. Slide 98 gọi tên đúng hai điều kiện đó. Thiếu chúng, một nhóm còn chậm hơn một người có năng lực.</li>
<li><strong>Mục này khép lại mạch của Mooc 2.</strong> Định nghĩa → sinh phương án (bằng sáng tạo) → đánh giá → truyền đạt → và giờ là làm cả bốn việc đó CÙNG VỚI NGƯỜI KHÁC. Mọi kỹ thuật bạn học ở mức cá nhân đều có phiên bản nhóm: động não cần người điều phối, đánh giá cần trọng số đã thống nhất, truyền đạt cần một bản ghi chung.</li>
<li><strong>Áp vào FPTU.</strong> SWP391, SWR302, SWT301 và đồ án tốt nghiệp đều là bài nhóm có chấm điểm, và đó là nơi hai chuẩn đầu ra này bị kiểm tra thật. "Xác định cách tăng hiệu quả" = bạn dựng lịch check-in và một timeline chung ngay tuần đầu. "Nhận ra vấn đề trong nhóm" = bạn phát hiện một thành viên im lặng ở tuần ba, chứ không phải tuần mười khi hạn đã mất.</li>
</ul>
<table>
<tr><th>Chuẩn đầu ra</th><th>Thời điểm</th><th>Slide trả lời</th></tr>
<tr><td>Tăng hiệu quả giải quyết vấn đề nhóm</td><td>Thiết lập, TRƯỚC khi có sự cố</td><td>98 và 101 (Interaction + Structure)</td></tr>
<tr><td>Nhận ra &amp; khắc phục vấn đề trong nhóm</td><td>Sửa chữa, TRONG lúc có sự cố</td><td>Được nêu tên trong chuẩn đầu ra; deck không có slide nội dung riêng</td></tr>
</table>
<p class="pitfall">⚠️ Hãy sòng phẳng về deck ở đoạn này: đúng khối hai gạch đầu dòng này được in BA lần (97, 99, 100) và slide tóm tắt được in HAI lần (98, 101). Năm slide cuối của Mooc 2 chỉ chứa HAI trang nội dung khác nhau.</p>`],

      [98, 'Summary: Group Problem-Solving — Interaction (4) + Structure (4), with five cited sources',
        `<p class="y-chinh">🎯 The densest and most examinable slide of the section: group effectiveness rests on <strong>TWO pillars with FOUR items each</strong>. <strong>Interaction:</strong> happens early, happens often · group members know each other · group members know and agree upon their goal · group members appreciate the importance of individual contributions and sharing ideas. <strong>Structure:</strong> clear idea of expectations · arrange meetings and check-ins · check-list or timeline to streamline the process · use peer facilitation techniques. Sources printed on the slide: <em>(See: Beebe &amp; Masterson, 2015; Brick, 2014; Fava-Verdé et al., 2015; Kaner et al., 2007; Pólya, 1957)</em>.</p>
<table>
<tr><th>Pillar</th><th>Item</th><th>What goes wrong without it</th></tr>
<tr><td rowspan="4"><strong>Interaction</strong><br/>(the human side)</td><td>Happens early, happens often</td><td>First real conversation is the week before the deadline</td></tr>
<tr><td>Group members know each other</td><td>Nobody knows who is strong at what, so work is allocated blind</td></tr>
<tr><td>Know and AGREE upon their goal</td><td>Two people build two different products, both sincerely</td></tr>
<tr><td>Appreciate individual contributions &amp; sharing ideas</td><td>The quiet member stops contributing; the loud one absorbs the work</td></tr>
<tr><td rowspan="4"><strong>Structure</strong><br/>(the process side)</td><td>Clear idea of expectations</td><td>"I thought you were doing that" — the classic group failure</td></tr>
<tr><td>Arrange meetings and check-ins</td><td>Problems surface at submission instead of at week three</td></tr>
<tr><td>Check-list or timeline</td><td>No shared view of what is done, so no one can see the slippage</td></tr>
<tr><td>Use peer facilitation techniques</td><td>Meetings drift; the loudest voice decides by default</td></tr>
</table>
<ul>
<li><strong>The 4 + 4 shape is the single most likely exam target in this section.</strong> Two headings, four items each, in this order. If an option puts "arrange meetings" under Interaction, or "group members know each other" under Structure, it has swapped the pillars — that is the standard distractor.</li>
<li><strong>Interaction is about PEOPLE; Structure is about PROCESS.</strong> That one-line test sorts every item correctly: knowing each other, agreeing the goal, valuing contributions = people. Expectations, meetings, checklists, facilitation = process. Use it if you blank in the exam.</li>
<li><strong>"Know AND AGREE upon their goal" is two verbs on purpose.</strong> Everyone can know the goal and still not agree with it, which produces silent non-compliance — the member who nods in the meeting and then builds something else. Agreement has to be asked for explicitly.</li>
<li><strong>"Peer facilitation" is the term to memorise from the Structure list.</strong> It means a group member — not a lecturer — actively runs the process: keeps time, invites the quiet members to speak, restates decisions, closes the loop. Kaner et al. (2007) is the facilitation source in the citation line.</li>
<li><strong>Note who is cited.</strong> Five sources for one summary slide: Beebe &amp; Masterson (2015) on group communication, Brick (2014) on academic culture, Fava-Verdé et al. (2015), Kaner et al. (2007) on facilitation, and <strong>Pólya (1957)</strong> — the same problem-solving classic that underpins the whole of Mooc 2. Copy the years exactly; multiple-choice questions in this course do ask about citations.</li>
<li><strong>FPTU application, run end to end on the delayed project.</strong> SWP391, two weeks behind, one member not delivering. Interaction repair: a 20-minute call where the member is asked directly what is blocking them (early and often, arriving late); re-state and re-agree the goal for the remaining sprint; name each person's contribution out loud so the quiet member has a visible stake. Structure repair: write the expectations as a table of owner-per-task; schedule two 10-minute check-ins per week; put a shared timeline in the repo with the graded deliverables marked; rotate a facilitator each meeting whose job is to close every item with a decision. Those eight moves are literally the eight bullets of this slide.</li>
</ul>
<p class="meo">💡 Memory hook: <strong>4 + 4 = PEOPLE + PROCESS</strong>. And the citation line has <strong>five</strong> sources — the longest in the deck, with Pólya (1957) the oldest.</p>`,
        `<p class="y-chinh">🎯 Slide đặc nhất và dễ ra đề nhất của mục: hiệu quả nhóm dựa trên <strong>HAI TRỤ, mỗi trụ BỐN mục</strong>. <strong>Interaction (tương tác):</strong> diễn ra SỚM, diễn ra THƯỜNG XUYÊN · các thành viên biết nhau · các thành viên biết VÀ đồng thuận về mục tiêu · các thành viên coi trọng đóng góp cá nhân và việc chia sẻ ý tưởng. <strong>Structure (cấu trúc):</strong> hiểu rõ kỳ vọng · sắp xếp các buổi họp và check-in · có bảng kiểm hoặc timeline để làm trơn quy trình · dùng kỹ thuật điều phối đồng đẳng (peer facilitation). Nguồn in trên slide: <em>(See: Beebe &amp; Masterson, 2015; Brick, 2014; Fava-Verdé et al., 2015; Kaner et al., 2007; Pólya, 1957)</em>.</p>
<table>
<tr><th>Trụ</th><th>Mục</th><th>Thiếu nó thì hỏng ra sao</th></tr>
<tr><td rowspan="4"><strong>Interaction</strong><br/>(phần CON NGƯỜI)</td><td>Diễn ra sớm, diễn ra thường xuyên</td><td>Cuộc trò chuyện thật đầu tiên rơi vào tuần trước hạn nộp</td></tr>
<tr><td>Các thành viên biết nhau</td><td>Không ai biết ai mạnh ở đâu, nên chia việc mù</td></tr>
<tr><td>Biết VÀ ĐỒNG THUẬN về mục tiêu</td><td>Hai người làm ra hai sản phẩm khác nhau, cả hai đều thành tâm</td></tr>
<tr><td>Coi trọng đóng góp cá nhân &amp; chia sẻ ý tưởng</td><td>Thành viên trầm lặng ngừng đóng góp; người nói to ôm hết việc</td></tr>
<tr><td rowspan="4"><strong>Structure</strong><br/>(phần QUY TRÌNH)</td><td>Hiểu rõ kỳ vọng</td><td>"Em tưởng anh làm phần đó" — thất bại nhóm kinh điển</td></tr>
<tr><td>Sắp xếp họp và check-in</td><td>Vấn đề nổi lên lúc nộp bài thay vì ở tuần thứ ba</td></tr>
<tr><td>Bảng kiểm hoặc timeline</td><td>Không có tầm nhìn chung về việc đã xong, nên không ai thấy chỗ trượt tiến độ</td></tr>
<tr><td>Dùng kỹ thuật điều phối đồng đẳng</td><td>Buổi họp trôi dạt; giọng to nhất quyết định mặc định</td></tr>
</table>
<ul>
<li><strong>Hình dạng 4 + 4 là mục tiêu ra đề khả dĩ nhất của mục này.</strong> Hai đề mục, mỗi đề mục bốn mục, theo đúng thứ tự này. Nếu phương án xếp "sắp xếp họp" vào Interaction, hay xếp "các thành viên biết nhau" vào Structure, thì nó đã HOÁN ĐỔI hai trụ — đó là kiểu phương án nhiễu chuẩn.</li>
<li><strong>Interaction là CON NGƯỜI; Structure là QUY TRÌNH.</strong> Phép thử một dòng đó phân loại đúng mọi mục: biết nhau, đồng thuận mục tiêu, coi trọng đóng góp = con người. Kỳ vọng, họp, bảng kiểm, điều phối = quy trình. Dùng nó nếu vào phòng thi bị trống đầu.</li>
<li><strong>"Biết VÀ ĐỒNG THUẬN về mục tiêu" cố ý có hai động từ.</strong> Ai cũng có thể BIẾT mục tiêu mà vẫn KHÔNG đồng thuận với nó, sinh ra kiểu bất tuân âm thầm — thành viên gật đầu trong buổi họp rồi về làm thứ khác. Sự đồng thuận phải được HỎI TƯỜNG MINH.</li>
<li><strong>"Peer facilitation" là thuật ngữ đáng thuộc trong nhóm Structure.</strong> Nó nghĩa là một THÀNH VIÊN — không phải giảng viên — chủ động vận hành quy trình: canh giờ, mời người trầm lặng phát biểu, nhắc lại các quyết định, chốt vòng. Kaner và cộng sự (2007) chính là nguồn về điều phối trong dòng trích dẫn.</li>
<li><strong>Để ý ai được trích.</strong> Năm nguồn cho một slide tóm tắt: Beebe &amp; Masterson (2015) về giao tiếp nhóm, Brick (2014) về văn hoá học thuật, Fava-Verdé và cộng sự (2015), Kaner và cộng sự (2007) về điều phối, và <strong>Pólya (1957)</strong> — cuốn kinh điển về giải quyết vấn đề nâng đỡ toàn bộ Mooc 2. Chép đúng năm xuất bản; đề trắc nghiệm của môn này CÓ hỏi về trích dẫn.</li>
<li><strong>Áp vào FPTU, chạy trọn ca đồ án bị trễ.</strong> SWP391 trễ hai tuần, một thành viên không nộp phần việc. Sửa phần TƯƠNG TÁC: một cuộc gọi 20 phút hỏi thẳng thành viên đó đang vướng gì (sớm và thường xuyên — dù đến muộn còn hơn không); phát biểu lại và thống nhất lại mục tiêu cho phần sprint còn lại; gọi tên đóng góp của từng người thành tiếng để thành viên trầm lặng có phần hiện diện thấy được. Sửa phần CẤU TRÚC: viết kỳ vọng thành bảng mỗi việc một chủ; xếp hai buổi check-in 10 phút mỗi tuần; đặt một timeline chung trong repo có đánh dấu các sản phẩm bị chấm điểm; luân phiên một người điều phối mỗi buổi, nhiệm vụ là chốt mọi mục bằng một quyết định. Tám nước đi đó đúng là tám gạch đầu dòng của slide này.</li>
</ul>
<p class="meo">💡 Móc nhớ: <strong>4 + 4 = CON NGƯỜI + QUY TRÌNH</strong>. Và dòng trích dẫn có <strong>năm</strong> nguồn — dài nhất deck, trong đó Pólya (1957) là cổ nhất.</p>`],

      [99, '5.3b Solving Group Problems — an INSERTED slide on a different template',
        `<p class="y-chinh">🎯 The same two objectives again, under the label <strong>5.3b Solving Group Problems</strong> — but printed on a <strong>DIFFERENT template</strong>. No Sydney shield; a footer reading "…niversity of Sydney" on the left and "Page 1" on the right; a different typeface and different line spacing; and the text says "group problem solving" with <strong>no hyphen</strong>, where slides 97 and 100 write "group problem-solving".</p>
<ul>
<li><strong>Read the template, not just the text.</strong> Every other slide in this stretch carries the Sydney crest and no page number. This one carries a page footer and calls itself "Page 1" — the signature of a page pasted in from a different document, not part of the original Sydney deck.</li>
<li><strong>"Page 1" is the strongest clue.</strong> It means this slide was page one of something else. Whatever that source was, its numbering survived the copy — so the page you are looking at is an insert, and it is safe to treat its content as a duplicate label rather than new material.</li>
<li><strong>The missing hyphen is a genuine textual difference, and you keep it as it is.</strong> 97/100 print "problem-solving"; 99 prints "problem solving". Do not "correct" either version when quoting the deck. Small inconsistencies like this are how you tell which pages came from which source.</li>
<li><strong>The label 5.3b is nonetheless informative.</strong> 5.3a was <em>Group Problem-Solving</em> (solving problems as a group); 5.3b is <em>Solving Group Problems</em> (fixing the group itself). Those are the two objectives, one each — the word order flips the meaning, and that flip is exactly the kind of thing a multiple-choice question can be built on.</li>
<li><strong>FPTU application.</strong> The 5.3a/5.3b distinction is the practical one for any FPTU group subject: 5.3a is "we are behind, how do we recover the project?"; 5.3b is "one member has stopped replying, how do we fix the team?" They need different responses — a Fogler &amp; LeBlanc table solves the first; a direct conversation plus the eight items of slide 98 solves the second.</li>
</ul>
<table>
<tr><th></th><th>Slides 97 / 100</th><th>Slide 99 (this one)</th></tr>
<tr><td>Sydney crest</td><td>Present</td><td><strong>Absent</strong></td></tr>
<tr><td>Footer</td><td>None</td><td>"University of Sydney" + <strong>"Page 1"</strong></td></tr>
<tr><td>Heading</td><td>5.3a Group Problem-Solving</td><td>5.3b Solving Group Problems</td></tr>
<tr><td>Hyphenation</td><td>"problem-solving"</td><td>"problem solving"</td></tr>
<tr><td>Objectives</td><td>The same two</td><td>The same two</td></tr>
</table>
<p class="pitfall">⚠️ Do not assume a different-looking slide contains different content. Here the template changed and the words did not. The reverse also happens in this deck — slides 83 and 84 look identical and say different things. <strong>Judge by the text, and mention the template only as evidence of where a page came from.</strong></p>`,
        `<p class="y-chinh">🎯 Vẫn hai chuẩn đầu ra ấy, dưới nhãn <strong>5.3b Solving Group Problems</strong> — nhưng in trên một <strong>TEMPLATE KHÁC</strong>. Không có khiên Sydney; chân trang ghi "…niversity of Sydney" bên trái và "Page 1" bên phải; phông chữ và giãn dòng khác; và chữ trên slide viết "group problem solving" <strong>KHÔNG có gạch nối</strong>, trong khi slide 97 và 100 viết "group problem-solving".</p>
<ul>
<li><strong>Hãy đọc cái TEMPLATE, đừng chỉ đọc chữ.</strong> Mọi slide khác trong đoạn này đều mang huy hiệu Sydney và không có số trang. Slide này có chân trang và tự xưng "Page 1" — dấu vân tay của một trang được dán vào từ tài liệu khác, không thuộc bộ slide Sydney gốc.</li>
<li><strong>"Page 1" là manh mối mạnh nhất.</strong> Nó nghĩa là slide này từng là trang một của một thứ khác. Dù nguồn đó là gì, cách đánh số của nó vẫn sống sót qua thao tác chép — nên trang bạn đang nhìn là trang CHÈN THÊM, và có thể yên tâm coi nội dung của nó là một cái nhãn lặp chứ không phải tài liệu mới.</li>
<li><strong>Thiếu gạch nối là một khác biệt chữ nghĩa THẬT, và cứ giữ nguyên như vậy.</strong> 97/100 in "problem-solving"; 99 in "problem solving". Đừng "sửa lại" bản nào khi trích deck. Chính những chỗ không nhất quán nhỏ như thế cho biết trang nào đến từ nguồn nào.</li>
<li><strong>Dù vậy, cái nhãn 5.3b vẫn có thông tin.</strong> 5.3a là <em>Group Problem-Solving</em> (giải quyết vấn đề THEO nhóm); 5.3b là <em>Solving Group Problems</em> (sửa chính CÁI NHÓM). Đó đúng là hai chuẩn đầu ra, mỗi cái một vế — đảo trật tự từ là đảo luôn nghĩa, và cú đảo đó chính là loại chi tiết dựng nên được một câu trắc nghiệm.</li>
<li><strong>Áp vào FPTU.</strong> Phân biệt 5.3a/5.3b mới là cái thiết thực cho mọi môn có bài nhóm ở FPTU: 5.3a là "nhóm đang trễ, làm sao cứu đồ án?"; 5.3b là "một thành viên ngừng trả lời, làm sao sửa cái đội?" Hai thứ cần cách xử lý khác nhau — một bảng Fogler &amp; LeBlanc giải cái thứ nhất; một cuộc nói chuyện trực diện cộng với tám mục của slide 98 giải cái thứ hai.</li>
</ul>
<table>
<tr><th></th><th>Slide 97 / 100</th><th>Slide 99 (trang này)</th></tr>
<tr><td>Huy hiệu Sydney</td><td>Có</td><td><strong>KHÔNG</strong></td></tr>
<tr><td>Chân trang</td><td>Không có</td><td>"University of Sydney" + <strong>"Page 1"</strong></td></tr>
<tr><td>Tiêu đề</td><td>5.3a Group Problem-Solving</td><td>5.3b Solving Group Problems</td></tr>
<tr><td>Gạch nối</td><td>"problem-solving"</td><td>"problem solving"</td></tr>
<tr><td>Chuẩn đầu ra</td><td>Vẫn hai mục ấy</td><td>Vẫn hai mục ấy</td></tr>
</table>
<p class="pitfall">⚠️ Đừng mặc định rằng slide trông khác đi thì chứa nội dung khác. Ở đây template đổi mà chữ thì không. Điều ngược lại cũng xảy ra trong chính deck này — slide 83 và 84 trông y hệt nhau mà nói hai thứ khác nhau. <strong>Hãy phán xét theo CHỮ, và chỉ nhắc tới template như bằng chứng về nguồn gốc của trang.</strong></p>`],

      [100, '5.3a Group Problem-Solving (the objectives block printed a third time)',
        `<p class="y-chinh">🎯 Back to the original Sydney template, and back to <strong>5.3a Group Problem-Solving</strong> with the same two objectives. Third printing of this block (97, 99, 100), and the last objectives slide in Mooc 2.</p>
<ul>
<li><strong>Nothing new — and saying so is the honest reading.</strong> Slide 100 is character-for-character the same as slide 97, hyphen included. The deck has looped back to the original template after the inserted page at 99.</li>
<li><strong>The loop tells you how the review deck was built.</strong> A 5.3 block from the Sydney master (97–98), then a page from another file (99), then the Sydney block again (100–101). Reviewing a deck like this efficiently means identifying the seams, not reading every page as if it were new.</li>
<li><strong>Use this slide as a final self-test on section 5.3.</strong> Before moving to 101, answer from memory: what are the two pillars of group effectiveness? How many items under each? Name one item from each pillar. Which source is cited for facilitation? If all four answers come, you are done with Mooc 2.</li>
<li><strong>Two objectives, and both are assessed in FPTU group subjects.</strong> "Increase effectiveness" is what your process documentation demonstrates; "recognise and overcome group problems" is what your peer-evaluation form and your reflection section demonstrate. Both are graded, both are visible in artefacts you produce, not in intentions.</li>
<li><strong>FPTU application.</strong> Turn the two objectives into one week-one ritual: at the first meeting of any group subject, spend 30 minutes on the eight items of slide 98 — introductions, the agreed goal in writing, the expectations table, the meeting schedule, the shared timeline, and who facilitates first. Thirty minutes at the start routinely saves the two weeks that this lesson's running example lost.</li>
</ul>
<table>
<tr><th>Printing</th><th>Slide</th><th>Template</th><th>Heading</th></tr>
<tr><td>1st</td><td>97</td><td>Sydney (crest)</td><td>5.3a Group Problem-Solving</td></tr>
<tr><td>2nd</td><td>99</td><td>Inserted (footer, "Page 1")</td><td>5.3b Solving Group Problems</td></tr>
<tr><td>3rd</td><td>100</td><td>Sydney (crest)</td><td>5.3a Group Problem-Solving</td></tr>
</table>
<p class="meo">💡 If you are short of revision time, the whole of section 5.3 reduces to ONE slide: number 98. Its 4 + 4 structure is the only content in the last five pages of the deck.</p>`,
        `<p class="y-chinh">🎯 Quay lại template Sydney gốc, và quay lại <strong>5.3a Group Problem-Solving</strong> với đúng hai chuẩn đầu ra ấy. Lần in thứ ba của khối này (97, 99, 100), và là slide chuẩn đầu ra cuối cùng của Mooc 2.</p>
<ul>
<li><strong>Không có gì mới — và nói ra điều đó mới là cách đọc trung thực.</strong> Slide 100 giống slide 97 tới từng ký tự, kể cả cái gạch nối. Deck đã vòng về template gốc sau trang chèn thêm ở 99.</li>
<li><strong>Vòng lặp đó cho biết deck ôn tập được dựng thế nào.</strong> Một khối 5.3 từ bản gốc Sydney (97–98), rồi một trang từ file khác (99), rồi lại khối Sydney (100–101). Ôn một deck kiểu này cho hiệu quả nghĩa là nhận ra các ĐƯỜNG NỐI, chứ không phải đọc mọi trang như thể nó mới.</li>
<li><strong>Hãy dùng slide này làm phép tự kiểm cuối cho mục 5.3.</strong> Trước khi sang 101, trả lời từ trí nhớ: hai trụ của hiệu quả nhóm là gì? Mỗi trụ bao nhiêu mục? Nêu một mục của mỗi trụ. Nguồn nào được trích cho phần điều phối? Nếu cả bốn câu đều ra, bạn đã xong Mooc 2.</li>
<li><strong>Hai chuẩn đầu ra, và cả hai đều bị CHẤM trong các môn có bài nhóm ở FPTU.</strong> "Tăng hiệu quả" là thứ tài liệu quy trình của bạn chứng minh; "nhận ra và khắc phục vấn đề nhóm" là thứ phiếu đánh giá đồng đẳng và phần phản tư của bạn chứng minh. Cả hai đều có điểm, và cả hai đều thể hiện qua SẢN PHẨM bạn tạo ra, không phải qua ý định.</li>
<li><strong>Áp vào FPTU.</strong> Hãy biến hai chuẩn đầu ra thành một nghi thức tuần đầu: ở buổi họp đầu tiên của bất kỳ môn nhóm nào, dành 30 phút chạy tám mục của slide 98 — giới thiệu nhau, ghi mục tiêu đã thống nhất thành văn bản, bảng kỳ vọng, lịch họp, timeline chung, và ai điều phối buổi đầu. Ba mươi phút lúc bắt đầu thường xuyên tiết kiệm đúng hai tuần mà ví dụ xuyên suốt bài học này đã đánh mất.</li>
</ul>
<table>
<tr><th>Lần in</th><th>Slide</th><th>Template</th><th>Tiêu đề</th></tr>
<tr><td>1</td><td>97</td><td>Sydney (có khiên)</td><td>5.3a Group Problem-Solving</td></tr>
<tr><td>2</td><td>99</td><td>Chèn thêm (có chân trang, "Page 1")</td><td>5.3b Solving Group Problems</td></tr>
<tr><td>3</td><td>100</td><td>Sydney (có khiên)</td><td>5.3a Group Problem-Solving</td></tr>
</table>
<p class="meo">💡 Nếu thiếu thời gian ôn, cả mục 5.3 rút gọn về MỘT slide: số 98. Cấu trúc 4 + 4 của nó là nội dung duy nhất trong năm trang cuối của deck.</p>`],

      [101, 'Summary: Group Problem-Solving (repeated) — the closing slide of Mooc 2',
        `<p class="y-chinh">🎯 Mooc 2 ends on a repeat: slide 101 reprints slide 98 exactly — Interaction (4) + Structure (4), five citations, no closing statement of its own. So the last thing the deck says is <strong>how to make a group work</strong>. Take that as the intended final message.</p>
<ul>
<li><strong>The deck does not end with a conclusion slide, so build one yourself.</strong> Mooc 2 taught a single chain: define the problem → generate options (Random Juxtaposition, The Intermediate Impossible, Doing the Opposite) → evaluate them (2 method families, the 4 Fogler &amp; LeBlanc steps, the academic-culture checks) → communicate the chosen solution (audience, the solution PATH, 4 forms) → and run all of it with other people (Interaction + Structure). Five links, and each one is useless alone.</li>
<li><strong>The single sentence worth carrying out of Mooc 2:</strong> "Communicate the solution path, not just the solution." It is the reason every other step leaves a written artefact — the decision statement, the musts/wants list, the weighted objectives table, the rationale. Those artefacts ARE the path.</li>
<li><strong>Where you will use this again.</strong> Mooc 5's Capstone asks you to run the whole chain on one problem and present it. SWP391, SWR302 and the graduation project assess the group version every semester. And in work, a technology decision you cannot justify is a decision your team will reopen every six months.</li>
<li><strong>What the exam will actually ask.</strong> SSL101c is 100% one 60-minute multiple-choice exam over all five MOOCs, so it tests names, counts and pairings rather than essays. From this stretch: 3 creative strategies · 2 evaluation method families · 4 Fogler &amp; LeBlanc steps · 3 academic-culture principles + 2 assessment checks · 4 communication forms (two name-sets) · 3 + 4 exam habits · 4 + 4 group factors.</li>
<li><strong>FPTU application — one final pass on the running example.</strong> SWP391, two weeks behind, one member not delivering. Creativity: negative-brainstorm "how do we finish even later?" to expose the real blockers. Evaluation: decision statement, musts (full rubric coverage, an assessable contribution per member), wants, weights. Communication: bring the weighted table to the supervisor and narrate the path, not the verdict. Group: repair Interaction (early direct conversation, re-agree the goal, name every contribution) and Structure (expectations table, twice-weekly check-ins, shared timeline, a rotating facilitator). That is the entire Mooc 2 chain applied to one real problem — which is exactly what the Capstone will ask you to write up.</li>
</ul>
<table>
<tr><th>Mooc 2 stage</th><th>Key counts to recall</th><th>Slides in this lesson</th></tr>
<tr><td>Creative strategies</td><td>3 named strategies</td><td>77–79</td></tr>
<tr><td>Evaluating solutions</td><td>2 method families · 4 steps · 3 + 2 academic checks</td><td>80–85</td></tr>
<tr><td>Communicating solutions</td><td>3 rules · 4 forms (2 name-sets)</td><td>86–94</td></tr>
<tr><td>Communicating in exams</td><td>3 before + 4 during</td><td>95–96</td></tr>
<tr><td>Group problem-solving</td><td>2 objectives · 4 Interaction + 4 Structure · 5 sources</td><td>97–101</td></tr>
</table>
<p class="meo">💡 Last hook: the deck's final page is a repeat, which means its final CONTENT page is slide 98. If you revise one slide from the end of Mooc 2, revise the 4 + 4.</p>`,
        `<p class="y-chinh">🎯 Mooc 2 kết thúc bằng một bản lặp: slide 101 in lại y hệt slide 98 — Interaction (4) + Structure (4), năm trích dẫn, không có câu kết riêng nào. Vậy điều cuối cùng deck nói ra là <strong>làm sao để một cái nhóm chạy được</strong>. Hãy nhận lấy đó như thông điệp cuối được chủ ý gửi đi.</p>
<ul>
<li><strong>Deck không kết bằng slide kết luận, nên bạn tự dựng lấy một cái.</strong> Mooc 2 dạy MỘT chuỗi duy nhất: định nghĩa vấn đề → sinh phương án (Random Juxtaposition, The Intermediate Impossible, Doing the Opposite) → đánh giá chúng (2 họ phương pháp, 4 bước Fogler &amp; LeBlanc, các phép kiểm của văn hoá học thuật) → truyền đạt giải pháp đã chọn (đối tượng, CON ĐƯỜNG, 4 hình thức) → và chạy tất cả những thứ đó CÙNG người khác (Interaction + Structure). Năm mắt xích, và mỗi cái đứng một mình đều vô dụng.</li>
<li><strong>Một câu duy nhất đáng mang ra khỏi Mooc 2:</strong> "Truyền đạt CON ĐƯỜNG tới giải pháp, không chỉ giải pháp." Đó là lý do mọi bước còn lại đều để lại một sản phẩm VIẾT — phát biểu quyết định, danh sách musts/wants, bảng mục tiêu có trọng số, phần rationale. Chính những thứ đó LÀ con đường.</li>
<li><strong>Bạn sẽ dùng lại nó ở đâu.</strong> Capstone của Mooc 5 yêu cầu bạn chạy trọn chuỗi này trên một vấn đề rồi trình bày. SWP391, SWR302 và đồ án tốt nghiệp chấm phiên bản NHÓM của nó mỗi học kỳ. Còn khi đi làm, một quyết định công nghệ mà bạn không biện minh được là một quyết định cả đội sẽ mở lại sáu tháng một lần.</li>
<li><strong>Đề thi thực sự sẽ hỏi gì.</strong> SSL101c là 100% một bài trắc nghiệm 60 phút phủ cả năm MOOC, nên nó kiểm TÊN, SỐ LƯỢNG và các CẶP ĐI ĐÔI chứ không kiểm khả năng viết luận. Từ đoạn này: 3 chiến lược sáng tạo · 2 họ phương pháp đánh giá · 4 bước Fogler &amp; LeBlanc · 3 nguyên tắc văn hoá học thuật + 2 phép kiểm khi bài có chấm · 4 hình thức truyền đạt (hai bộ tên) · 3 + 4 thói quen thi · 4 + 4 yếu tố nhóm.</li>
<li><strong>Áp vào FPTU — lượt cuối trên ví dụ xuyên suốt.</strong> SWP391 trễ hai tuần, một thành viên không nộp phần việc. Sáng tạo: động não ngược "làm sao để còn trễ hơn nữa?" để phơi ra các nút thắt thật. Đánh giá: phát biểu quyết định, musts (phủ đủ rubric, mỗi thành viên có phần đóng góp chấm được), wants, trọng số. Truyền đạt: mang bảng trọng số tới gặp giảng viên hướng dẫn và KỂ CON ĐƯỜNG, không phải tuyên bố phán quyết. Nhóm: sửa Interaction (nói chuyện trực diện sớm, thống nhất lại mục tiêu, gọi tên mọi đóng góp) và Structure (bảng kỳ vọng, check-in hai lần mỗi tuần, timeline chung, người điều phối luân phiên). Đó là toàn bộ chuỗi Mooc 2 áp lên một vấn đề thật — đúng thứ mà Capstone sẽ yêu cầu bạn viết lại.</li>
</ul>
<table>
<tr><th>Chặng của Mooc 2</th><th>Con số cần nhớ</th><th>Slide trong bài này</th></tr>
<tr><td>Chiến lược sáng tạo</td><td>3 chiến lược có tên</td><td>77–79</td></tr>
<tr><td>Đánh giá giải pháp</td><td>2 họ phương pháp · 4 bước · 3 + 2 phép kiểm học thuật</td><td>80–85</td></tr>
<tr><td>Truyền đạt giải pháp</td><td>3 luật · 4 hình thức (2 bộ tên)</td><td>86–94</td></tr>
<tr><td>Truyền đạt trong phòng thi</td><td>3 trước + 4 trong</td><td>95–96</td></tr>
<tr><td>Giải quyết vấn đề theo nhóm</td><td>2 chuẩn đầu ra · 4 Interaction + 4 Structure · 5 nguồn</td><td>97–101</td></tr>
</table>
<p class="meo">💡 Móc nhớ cuối: trang cuối của deck là bản lặp, nghĩa là trang NỘI DUNG cuối cùng là slide 98. Nếu chỉ ôn một slide ở cuối Mooc 2, hãy ôn cái 4 + 4.</p>`],

    ]),
  ].join('\n'),
};
