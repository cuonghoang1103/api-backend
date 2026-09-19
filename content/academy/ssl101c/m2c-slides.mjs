/**
 * SSL101c · Mooc 2 (deck 'ssl2') — slide 52–76, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl2.txt RỖNG chữ (101/101 slide ghi "không có
 * chữ") — không dùng được. Toàn bộ 25 slide của dải này đã được ĐỌC THẲNG TỪ
 * ẢNH (/tmp/ssl101c-slides/ssl2/052.webp … 076.webp), từng chữ một.
 *
 * Nội dung THẬT của dải 52–76:
 *   52–53  Specialised Knowledge — hai bảng theo khối ngành (HSS 3 ý · MSE 4 ý)
 *   54–59  3.4 Problem-Solving with Special Cases (3.4a · 3.4b · 3.4c)
 *   60–64  4.1a Seeking Different Perspectives — hai cái đầu, ghép ngành, nói ra
 *   65–70  4.2a Applying Forms of Reasoning & Thinking + Summary
 *   71     4.2c Questioning Assumptions: The Nine Dot Problem
 *   72–76  4.3a Using Creative Strategies — Random Juxtaposition, Intermediate
 *          Impossible
 *
 * ⚠️ Slide 54 (3.4a) và slide 58 (3.4b) in ĐÚNG BỐN BULLET GIỐNG HỆT NHAU dù
 * tiêu đề mục khác nhau. Đó là lỗi của chính file gốc — đã nêu thẳng trong bài.
 *
 * ⚠️ Slide 59 và slide 71 dùng TEMPLATE KHÁC HẲN: không có khiên logo Sydney ở
 * góc, có vạch dọc mảnh sát mép trái và chân trang "…niversity of Sydney" +
 * "Page 1". Đây là slide dựng lại/chèn thêm, không cùng khuôn với 23 slide kia.
 *
 * ⚠️ Đánh số mục NHẢY: 4.2a (slide 65) → 4.2c (slide 71). Không có slide mở đầu
 * 4.2b nào trong dải này.
 *
 * ⚠️ Slide 73 và 74 KHÔNG CÓ TIÊU ĐỀ — chỉ có thân bullet / một khối trích dẫn
 * dài. Tiêu đề trong bảng dưới là do người soạn đặt để tra cứu, có ghi rõ.
 *
 * ⚠️ Slide 57 chữ chạy sát mép phải, chữ cuối ("deviant case") gần như chạm
 * biên khung — giữ nguyên, không tự thêm chữ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl2';

export default {
  title: '2.0c — Slide by slide: Specialised knowledge, special cases, other perspectives, reasoning and creative strategies (slides 52–76)|||2.0c — Slide bài giảng: Kiến thức chuyên ngành, ca đặc biệt, góc nhìn khác, suy luận & chiến lược sáng tạo (slide 52–76)',
  slug: 'ssl101c-2-0c-slides-ca-dac-biet-suy-luan-sang-tao',
  type: 'DOCUMENT',
  description: 'Học theo từng slide 25 slide giữa của Mooc 2 (slide 52–76) — khối kỹ thuật giải quyết vấn đề dày nhất của cả MOOC. Đi từ kiến thức chuyên ngành dùng khác nhau ra sao ở khối Nhân văn (3 ý) và khối Toán–Khoa học–Kỹ thuật (4 ý), qua ba cách dùng CA ĐẶC BIỆT (so sánh, ví dụ, chạy ca cụ thể) với hai nhánh Toán (Pólya: bài tương tự · đặc biệt hoá · ca cực trị) và Y–Xã hội–Nhân văn (telling case · negative/deviant case), rồi tới bốn nguồn GÓC NHÌN KHÁC (người khác, chuyên gia, người ngoại đạo, ghép ngành), ba hình thức SUY LUẬN (chất vấn giả định · diễn dịch · quy nạp · tầng và hệ thống), bài Chín Chấm, và cuối cùng hai chiến lược SÁNG TẠO của de Bono: Random Juxtaposition và The Intermediate Impossible (negative brainstorming). Mọi khung đều chạy trọn trên một tình huống thật: nhóm SWP391 trễ tiến độ hai tuần vì một thành viên không nộp phần việc.',
  content: [
    walkHead(D, 52, 76,
      'These 25 slides are the technical core of Mooc 2: how specialised knowledge is used, how special cases crack a problem, how other people and other disciplines change what you can see, the three forms of reasoning, and two named creative strategies.',
      'Đây là 25 slide lõi kỹ thuật của Mooc 2: dùng kiến thức chuyên ngành thế nào, ca đặc biệt phá bài toán ra sao, người khác và ngành khác đổi được những gì bạn nhìn thấy, ba hình thức suy luận, và hai chiến lược sáng tạo có tên gọi hẳn hoi.'),
    walk(D, [

      [52, 'Specialised Knowledge – Humanities & Social Sciences',
        `<p class="y-chinh">🎯 In the humanities and social sciences, specialised knowledge means doing <strong>three things with theory</strong>: <strong>draw on specific theory or theories</strong> · <strong>adapt the theory for your specific circumstances</strong> · <strong>use the theory as evidence and justification for a new approach</strong>. Three bullets, three verbs.</p>
<table>
<tr><th>The slide's move</th><th>What it actually asks of you</th><th>A real example</th></tr>
<tr><td><strong>Draw on specific theory</strong></td><td>Name the theory and its author. "Some people say" is not a theory</td><td>Tuckman's forming–storming–norming–performing, to explain why your SWP391 team stalled in week 4</td></tr>
<tr><td><strong>Adapt for your circumstances</strong></td><td>A theory is general; your case is one particular situation. You must show the fit, and the misfit</td><td>Tuckman assumes a team that meets daily; yours meets once a week online — say so, then adjust</td></tr>
<tr><td><strong>Use theory as evidence and justification</strong></td><td>The theory carries argumentative weight: it is <em>why</em> your new approach should work</td><td>"Because storming is a normal phase, we scheduled a conflict-surfacing meeting instead of replacing the member"</td></tr>
</table>
<ul>
<li><strong>Why theory counts as evidence here.</strong> In an experimental discipline the evidence is a measurement. In the humanities and social sciences you usually cannot measure — so an established theory, correctly applied, is what makes your claim more than an opinion.</li>
<li><strong>"Adapt", not "apply".</strong> The slide deliberately does not say <em>apply</em>. Copying a framework onto a case it does not fit is the most common weak move in a student essay; naming where it does not fit is what looks expert.</li>
<li><strong>Applied at FPTU.</strong> This is exactly what SSG104, MGT103 and the introduction of an SWP391 report want: a named model, honestly fitted to your situation, then used to justify what you decided to do.</li>
</ul>
<p class="meo">💡 Memory hook: <strong>DRAW → ADAPT → JUSTIFY</strong>. Three bullets for humanities and social sciences. Count them — the next slide has four.</p>`,
        `<p class="y-chinh">🎯 Ở khối Nhân văn và Khoa học Xã hội, kiến thức chuyên ngành nghĩa là làm <strong>BA việc với LÝ THUYẾT</strong>: <strong>dựa vào một hoặc vài lý thuyết cụ thể</strong> · <strong>điều chỉnh lý thuyết cho hoàn cảnh riêng của bạn</strong> · <strong>dùng lý thuyết làm bằng chứng và lý do biện minh cho một cách làm mới</strong>. Ba gạch đầu dòng, ba động từ.</p>
<table>
<tr><th>Bước trên slide</th><th>Thực chất đòi bạn làm gì</th><th>Ví dụ thật</th></tr>
<tr><td><strong>Dựa vào lý thuyết cụ thể</strong></td><td>Gọi TÊN lý thuyết và tác giả. "Nhiều người nói rằng" không phải lý thuyết</td><td>Mô hình Tuckman forming–storming–norming–performing, để giải thích vì sao nhóm SWP391 của bạn khựng lại ở tuần 4</td></tr>
<tr><td><strong>Điều chỉnh cho hoàn cảnh riêng</strong></td><td>Lý thuyết thì chung, ca của bạn thì riêng. Bạn phải chỉ ra chỗ KHỚP, và cả chỗ KHÔNG khớp</td><td>Tuckman giả định nhóm gặp nhau hằng ngày; nhóm bạn họp online mỗi tuần một lần — nói thẳng ra, rồi chỉnh</td></tr>
<tr><td><strong>Dùng lý thuyết làm bằng chứng và biện minh</strong></td><td>Lý thuyết gánh sức nặng lập luận: nó là <em>LÝ DO</em> cách làm mới của bạn sẽ chạy</td><td>"Vì storming là giai đoạn bình thường, nhóm đặt một buổi họp bóc mâu thuẫn thay vì thay thành viên"</td></tr>
</table>
<ul>
<li><strong>Vì sao lý thuyết được tính là bằng chứng ở đây.</strong> Ngành thực nghiệm thì bằng chứng là một phép đo. Khối nhân văn – xã hội thường không đo được — nên một lý thuyết có chỗ đứng, áp dụng đúng, chính là thứ nâng khẳng định của bạn lên trên mức ý kiến cá nhân.</li>
<li><strong>"Điều chỉnh", chứ không phải "áp dụng".</strong> Slide cố ý KHÔNG viết <em>apply</em>. Bê nguyên một khung lý thuyết lên một ca không vừa là nước đi yếu phổ biến nhất trong bài viết sinh viên; chỉ ra chỗ nó không vừa mới là nước đi trông có nghề.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đây đúng là thứ SSG104, MGT103 và phần mở đầu báo cáo SWP391 đang đòi: một mô hình có tên, được lắp vào tình huống một cách thành thật, rồi dùng để biện minh cho quyết định bạn đã làm.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>DỰA → CHỈNH → BIỆN MINH</strong>. BA gạch đầu dòng cho khối nhân văn – xã hội. Đếm cho kỹ — slide ngay sau có BỐN.</p>`],

      [53, 'Specialised Knowledge – Maths, Sciences & Engineering',
        `<p class="y-chinh">🎯 The same idea for the technical disciplines, but <strong>four bullets</strong> and the emphasis moves from <em>theory</em> to <em>correctness</em>: <strong>apply correct formula, theory or experimental method</strong> · <strong>knowing what to use and how to use it</strong> · <strong>research &amp; provide evidence</strong> · <strong>using certain tools correctly</strong>.</p>
<table>
<tr><th></th><th>Humanities &amp; Social Sciences (slide 52)</th><th>Maths, Sciences &amp; Engineering (slide 53)</th></tr>
<tr><td><strong>Number of bullets</strong></td><td><strong>3</strong></td><td><strong>4</strong></td></tr>
<tr><td><strong>Central object</strong></td><td>A theory</td><td>A formula, theory <em>or</em> experimental method</td></tr>
<tr><td><strong>Key verb</strong></td><td>Adapt</td><td>Apply <em>correctly</em></td></tr>
<tr><td><strong>Evidence comes from</strong></td><td>The theory itself, justified</td><td>Research you carry out and report</td></tr>
<tr><td><strong>Extra requirement</strong></td><td>—</td><td><strong>Using certain tools correctly</strong></td></tr>
</table>
<ul>
<li><strong>"Knowing what to use AND how to use it" is two skills in one line.</strong> Selection and execution fail independently. Choosing the right sorting algorithm and then implementing it wrong scores as badly as implementing the wrong one perfectly.</li>
<li><strong>"Using certain tools correctly" is the bullet with no counterpart on slide 52.</strong> It is why your degree spends time on Git, Postman, JUnit, Figma, SPSS — the tool is part of the specialised knowledge, not an accessory to it.</li>
<li><strong>"Correct" appears twice on one slide.</strong> That repetition is the whole difference between the two disciplinary families: in technical work there is usually a right answer and a wrong one, so adaptation matters less than accuracy.</li>
<li><strong>Applied at FPTU.</strong> On the SWP391 problem, the technical reading is: pick the right estimation method (planning poker vs. ideal-hours), execute it properly, measure the actual velocity for two sprints, and use the project tool (Jira board) the way it is meant to be used so the slippage is visible before week 10.</li>
</ul>
<p class="pitfall">⚠️ Exam trap on numbers: <strong>Humanities/Social Sciences = 3 items, Maths/Sciences/Engineering = 4 items</strong>. A distractor will move "using certain tools correctly" over to the humanities list, or count both as three.</p>`,
        `<p class="y-chinh">🎯 Cùng ý đó cho khối kỹ thuật, nhưng <strong>BỐN gạch đầu dòng</strong> và trọng tâm dịch từ <em>lý thuyết</em> sang <em>tính ĐÚNG</em>: <strong>áp dụng đúng công thức, lý thuyết hoặc phương pháp thực nghiệm</strong> · <strong>biết dùng CÁI GÌ và dùng NHƯ THẾ NÀO</strong> · <strong>nghiên cứu &amp; đưa ra bằng chứng</strong> · <strong>dùng đúng một số công cụ nhất định</strong>.</p>
<table>
<tr><th></th><th>Nhân văn &amp; KHXH (slide 52)</th><th>Toán, Khoa học &amp; Kỹ thuật (slide 53)</th></tr>
<tr><td><strong>Số gạch đầu dòng</strong></td><td><strong>3</strong></td><td><strong>4</strong></td></tr>
<tr><td><strong>Đối tượng trung tâm</strong></td><td>Một lý thuyết</td><td>Một công thức, lý thuyết <em>hoặc</em> phương pháp thực nghiệm</td></tr>
<tr><td><strong>Động từ then chốt</strong></td><td>Điều chỉnh (adapt)</td><td>Áp dụng cho <em>ĐÚNG</em> (apply correctly)</td></tr>
<tr><td><strong>Bằng chứng đến từ</strong></td><td>Chính lý thuyết, có biện minh</td><td>Nghiên cứu do bạn tự làm và báo cáo lại</td></tr>
<tr><td><strong>Yêu cầu thêm</strong></td><td>—</td><td><strong>Dùng đúng công cụ</strong></td></tr>
</table>
<ul>
<li><strong>"Biết dùng cái gì VÀ dùng thế nào" là hai kỹ năng nhét trong một dòng.</strong> Chọn và thực thi hỏng độc lập với nhau. Chọn đúng thuật toán sắp xếp rồi cài sai thì điểm cũng tệ y như cài hoàn hảo một thuật toán sai.</li>
<li><strong>"Dùng đúng công cụ" là gạch đầu dòng KHÔNG có bản tương ứng ở slide 52.</strong> Đó là lý do chương trình học của bạn tốn thời gian cho Git, Postman, JUnit, Figma, SPSS — công cụ là MỘT PHẦN của kiến thức chuyên ngành, không phải đồ phụ kiện.</li>
<li><strong>Chữ "correct" xuất hiện HAI lần trên cùng một slide.</strong> Chính sự lặp đó là toàn bộ khác biệt giữa hai khối ngành: trong công việc kỹ thuật thường có một đáp án đúng và một đáp án sai, nên việc điều chỉnh ít quan trọng bằng độ chính xác.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với ca SWP391, cách đọc kỹ thuật là: chọn đúng phương pháp ước lượng (planning poker hay giờ lý tưởng), thực hiện cho chuẩn, đo velocity thật trong hai sprint, và dùng công cụ dự án (bảng Jira) đúng cách nó được thiết kế để độ trễ lộ ra TRƯỚC tuần 10.</li>
</ul>
<p class="pitfall">⚠️ Bẫy con số trong đề: <strong>Nhân văn/KHXH = 3 mục, Toán/Khoa học/Kỹ thuật = 4 mục</strong>. Đáp án nhiễu sẽ đẩy "using certain tools correctly" sang danh sách nhân văn, hoặc cho cả hai cùng ba mục.</p>`],

      [54, '3.4a Problem-Solving with Special Cases (learning outcomes)',
        `<p class="y-chinh">🎯 A section-opening slide with <strong>four learning outcomes</strong>: <strong>identify how similar problems can assist in finding solutions</strong> · <strong>recognise how simpler versions, special cases or anomalies for specific problems can assist in finding solutions</strong> · <strong>use analogies to better understand &amp; solve problems</strong> · <strong>apply comparison techniques to solve problems</strong>.</p>
<table>
<tr><th>Outcome</th><th>The idea in one line</th><th>On the SWP391 problem</th></tr>
<tr><td><strong>Similar problems</strong></td><td>Someone has already solved something close to this</td><td>Last semester's SWR302 team hit the same slip — ask them what they did</td></tr>
<tr><td><strong>Simpler versions / special cases / anomalies</strong></td><td>Shrink the problem, or look at the odd instance, to expose the mechanism</td><td>Why did ONE sprint go fine? What was different that week?</td></tr>
<tr><td><strong>Analogies</strong></td><td>Import structure from a different domain</td><td>A late team member is like an unacknowledged packet — the system needs a timeout, not louder shouting</td></tr>
<tr><td><strong>Comparison techniques</strong></td><td>Put two instances side by side and read off the difference</td><td>Compare the member who delivers with the one who does not — what differs in their task size?</td></tr>
</table>
<ul>
<li><strong>Three words that are not synonyms.</strong> A <em>simpler version</em> is the same problem with parameters reduced. A <em>special case</em> is a legitimate instance with extra structure. An <em>anomaly</em> is the instance that breaks the pattern. The slide lists all three because they are different tools.</li>
<li><strong>"Assist in finding solutions" appears twice.</strong> The MOOC is careful: special cases do not <em>give</em> you the solution, they <em>assist</em>. They generate a hypothesis you still have to verify on the full problem.</li>
<li><strong>Applied at FPTU.</strong> Before you invent anything, run the four outcomes as four questions. Most student "new problems" are old problems wearing a different course code.</li>
</ul>
<p class="pitfall">⚠️ Remember this list of <strong>four</strong>. Slide 58 (section 3.4b) prints these four bullets <em>word for word again</em> under a different heading — see the note there.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu một mục, với <strong>BỐN mục tiêu học tập</strong>: <strong>nhận ra những bài toán TƯƠNG TỰ có thể giúp tìm lời giải thế nào</strong> · <strong>nhận ra các phiên bản ĐƠN GIẢN HƠN, các CA ĐẶC BIỆT hoặc các BẤT THƯỜNG của bài toán cụ thể có thể giúp tìm lời giải thế nào</strong> · <strong>dùng phép loại suy để hiểu &amp; giải bài toán tốt hơn</strong> · <strong>áp dụng kỹ thuật SO SÁNH để giải quyết vấn đề</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Ý tưởng gói trong một dòng</th><th>Trên ca SWP391</th></tr>
<tr><td><strong>Bài toán tương tự</strong></td><td>Đã có người giải một thứ gần giống thế này rồi</td><td>Nhóm SWR302 kỳ trước cũng trễ y hệt — đi hỏi họ đã làm gì</td></tr>
<tr><td><strong>Bản đơn giản hơn / ca đặc biệt / bất thường</strong></td><td>Thu nhỏ bài toán lại, hoặc soi ca kỳ lạ, để lộ ra cơ chế</td><td>Vì sao có ĐÚNG MỘT sprint chạy trơn? Tuần đó khác cái gì?</td></tr>
<tr><td><strong>Loại suy (analogy)</strong></td><td>Mượn cấu trúc từ một lĩnh vực khác</td><td>Thành viên trễ giống một gói tin không được báo nhận — hệ thống cần một timeout, không cần quát to hơn</td></tr>
<tr><td><strong>Kỹ thuật so sánh</strong></td><td>Đặt hai trường hợp cạnh nhau rồi đọc ra chỗ khác biệt</td><td>So thành viên nộp đúng hạn với thành viên không nộp — kích thước đầu việc của hai người khác nhau ra sao?</td></tr>
</table>
<ul>
<li><strong>Ba chữ KHÔNG đồng nghĩa với nhau.</strong> <em>Bản đơn giản hơn</em> là cùng bài toán nhưng giảm tham số. <em>Ca đặc biệt</em> là một trường hợp hợp lệ có thêm cấu trúc. <em>Bất thường</em> là trường hợp phá vỡ quy luật. Slide liệt kê cả ba vì chúng là ba công cụ khác nhau.</li>
<li><strong>Cụm "assist in finding solutions" xuất hiện HAI lần.</strong> MOOC nói rất cẩn thận: ca đặc biệt không <em>CHO</em> bạn lời giải, nó <em>TRỢ GIÚP</em>. Nó đẻ ra một giả thuyết mà bạn vẫn phải kiểm lại trên bài toán đầy đủ.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước khi phát minh bất cứ thứ gì, hãy chạy bốn mục tiêu này thành bốn câu hỏi. Phần lớn "vấn đề mới" của sinh viên là vấn đề cũ khoác mã môn khác.</li>
</ul>
<p class="pitfall">⚠️ Nhớ danh sách <strong>BỐN</strong> này. Slide 58 (mục 3.4b) in lại <em>ĐÚNG TỪNG CHỮ</em> bốn gạch đầu dòng đó dưới một tiêu đề khác — xem ghi chú ở slide ấy.</p>`],

      [55, 'Problem-Solving with Special Cases — compare, exemplify, work through',
        `<p class="y-chinh">🎯 The three concrete techniques behind the section, stated in three bullets: <strong>comparing &amp; contrasting other instances</strong> · <strong>using examples</strong> · <strong>working through specific cases</strong>.</p>
<table>
<tr><th>Technique</th><th>What you actually do</th><th>Real example (SWP391 is two weeks late)</th></tr>
<tr><td><strong>Comparing &amp; contrasting other instances</strong></td><td>Line up several instances of the same kind of thing and read the differences</td><td>Sprint 1 (on time), sprint 2 (1 week late), sprint 3 (2 weeks late) — the one thing that changed is that tasks stopped being split under 4 hours</td></tr>
<tr><td><strong>Using examples</strong></td><td>Replace the abstract statement with one concrete instance you can hold in your head</td><td>Instead of "communication is poor", use: "on 12 March, Minh's API task sat unstarted for 9 days and nobody noticed"</td></tr>
<tr><td><strong>Working through specific cases</strong></td><td>Run the whole problem end to end on one small instance, by hand</td><td>Re-plan ONE feature properly — estimate, split, assign, daily check — and see whether it lands. If it does, the method scales</td></tr>
</table>
<ul>
<li><strong>Comparing is diagnosis, examples are communication, working through is testing.</strong> The three bullets are not three ways of saying the same thing; they sit at three different points of the problem-solving process.</li>
<li><strong>An example makes an argument checkable.</strong> "The team has a communication problem" cannot be disproved and therefore cannot be fixed. One dated instance can be examined, and the fix can be tested against it.</li>
<li><strong>"Working through" costs time and buys certainty.</strong> It is the only one of the three that tells you whether a proposed solution actually works, because you have run it, not reasoned about it.</li>
<li><strong>Applied at FPTU.</strong> In a report, this is exactly the sequence that earns marks: a comparison table, one worked example, then one case run end to end with the result recorded.</li>
</ul>
<p class="meo">💡 Hook: <strong>COMPARE · EXAMPLE · WORK THROUGH</strong> — three, and they map onto diagnose, explain, test.</p>`,
        `<p class="y-chinh">🎯 Ba kỹ thuật cụ thể của cả mục, gói trong ba gạch đầu dòng: <strong>so sánh &amp; đối chiếu các trường hợp khác</strong> · <strong>dùng ví dụ</strong> · <strong>chạy hết một ca cụ thể</strong>.</p>
<table>
<tr><th>Kỹ thuật</th><th>Bạn thật sự làm gì</th><th>Ví dụ thật (SWP391 trễ hai tuần)</th></tr>
<tr><td><strong>So sánh &amp; đối chiếu các trường hợp khác</strong></td><td>Xếp vài trường hợp cùng loại cạnh nhau rồi đọc ra khác biệt</td><td>Sprint 1 (đúng hạn), sprint 2 (trễ 1 tuần), sprint 3 (trễ 2 tuần) — thứ duy nhất đổi là đầu việc thôi không còn được chẻ nhỏ dưới 4 giờ</td></tr>
<tr><td><strong>Dùng ví dụ</strong></td><td>Thay câu nói trừu tượng bằng MỘT trường hợp cụ thể giữ được trong đầu</td><td>Thay vì "giao tiếp kém", hãy nói: "ngày 12/3, đầu việc API của Minh nằm im 9 ngày chưa ai bắt đầu và không ai nhận ra"</td></tr>
<tr><td><strong>Chạy hết một ca cụ thể</strong></td><td>Chạy trọn bài toán từ đầu tới cuối trên một trường hợp nhỏ, bằng tay</td><td>Lập kế hoạch lại cho ĐÚNG MỘT tính năng — ước lượng, chẻ nhỏ, giao việc, kiểm hằng ngày — rồi xem có về đích không. Về được thì cách làm đó nhân rộng được</td></tr>
</table>
<ul>
<li><strong>So sánh là CHẨN ĐOÁN, ví dụ là TRUYỀN ĐẠT, chạy ca là KIỂM CHỨNG.</strong> Ba gạch đầu dòng không phải ba cách nói cùng một điều; chúng nằm ở ba điểm khác nhau của quy trình giải quyết vấn đề.</li>
<li><strong>Một ví dụ làm cho lập luận KIỂM ĐƯỢC.</strong> "Nhóm có vấn đề giao tiếp" không thể bác bỏ nên cũng không thể sửa. Một trường hợp có ngày tháng thì soi được, và bản sửa đối chiếu lại được với nó.</li>
<li><strong>"Chạy hết ca" tốn thời gian và mua về sự chắc chắn.</strong> Đây là cái duy nhất trong ba cái cho bạn biết giải pháp đề xuất có chạy thật không, vì bạn đã CHẠY nó chứ không suy luận về nó.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong báo cáo, đây đúng là trình tự ăn điểm: một bảng so sánh, một ví dụ được làm trọn, rồi một ca chạy từ đầu tới cuối có ghi lại kết quả.</li>
</ul>
<p class="meo">💡 Mẹo: <strong>SO SÁNH · VÍ DỤ · CHẠY CA</strong> — ba cái, và chúng ứng với chẩn đoán, giải thích, kiểm chứng.</p>`],

      [56, 'Problem-solving with special cases in mathematics (Briggs, 2005; Pólya, 1945)',
        `<p class="y-chinh">🎯 The mathematical branch of the technique, as <strong>three questions</strong>: <strong>Is there a related problem?</strong> · <strong>Has this kind of problem been seen before?</strong> · <strong>Using specialisation and extreme cases</strong>. The citation on the slide is <strong>(Briggs, 2005; Pólya, 1945)</strong>.</p>
<table>
<tr><th>Move</th><th>The question to ask</th><th>Worked illustration</th></tr>
<tr><td><strong>Related problem</strong></td><td>What known problem shares the structure of this one?</td><td>Sum 1+2+…+100. A related problem: sum 1+2+…+n. Solve the general one and the specific one falls out</td></tr>
<tr><td><strong>Seen before</strong></td><td>Have I met this shape, even with different words?</td><td>"Shortest route through all offices" is the travelling salesman shape — known to be hard, so look for a good-enough heuristic instead of a perfect answer</td></tr>
<tr><td><strong>Specialisation</strong></td><td>What happens if I fix the parameters at small values?</td><td>Try n = 1, 2, 3. The pattern shows up long before the proof does</td></tr>
<tr><td><strong>Extreme cases</strong></td><td>What happens at zero, one, infinity, or the boundary?</td><td>A sorting function: test on an empty list and a one-element list. Most real bugs live there</td></tr>
</table>
<ul>
<li><strong>Pólya, 1945 is the reference behind the whole section.</strong> His book <em>How to Solve It</em> is the origin of "is there a related problem?" — when a MOOC cites a 1945 source, it is signalling a foundational, examinable idea.</li>
<li><strong>Specialisation is deliberately going backwards.</strong> Making the problem smaller feels like giving up, but a pattern visible at n = 3 is usually the pattern that holds at n = 300.</li>
<li><strong>Extreme cases are where systems break.</strong> Zero, one, maximum, empty, negative, duplicate. This is the same instinct as boundary-value testing in SWT301 — the MOOC and your testing course are teaching one idea in two vocabularies.</li>
<li><strong>Applied at FPTU.</strong> On a MAD101 or MAE101 exercise you cannot start, set every variable to its smallest legal value and compute by hand. On a CS problem, run your function on the empty input first.</li>
</ul>
<p class="pitfall">⚠️ Don't confuse the two halves of the third bullet. <strong>Specialisation</strong> = make it smaller/simpler. <strong>Extreme case</strong> = push it to a boundary. Both are on this slide, under one bullet, and an exam may split them apart.</p>`,
        `<p class="y-chinh">🎯 Nhánh TOÁN của kỹ thuật này, gói trong <strong>BA câu hỏi</strong>: <strong>Có bài toán nào liên quan không?</strong> · <strong>Dạng bài này đã gặp bao giờ chưa?</strong> · <strong>Dùng đặc biệt hoá và các ca cực trị</strong>. Trích dẫn in trên slide là <strong>(Briggs, 2005; Pólya, 1945)</strong>.</p>
<table>
<tr><th>Nước đi</th><th>Câu hỏi phải đặt</th><th>Minh hoạ chạy thật</th></tr>
<tr><td><strong>Bài toán liên quan</strong></td><td>Bài toán đã biết nào có CÙNG CẤU TRÚC với bài này?</td><td>Tính 1+2+…+100. Bài liên quan: tính 1+2+…+n. Giải cái tổng quát thì cái cụ thể rơi ra</td></tr>
<tr><td><strong>Đã gặp chưa</strong></td><td>Tôi từng gặp hình dạng này chưa, dù chữ nghĩa khác?</td><td>"Đường ngắn nhất đi qua hết các văn phòng" chính là hình dạng bài người bán hàng rong — đã biết là khó, nên đi tìm lời giải đủ tốt thay vì lời giải hoàn hảo</td></tr>
<tr><td><strong>Đặc biệt hoá</strong></td><td>Chuyện gì xảy ra nếu tôi cố định tham số ở giá trị nhỏ?</td><td>Thử n = 1, 2, 3. Quy luật lộ ra từ rất lâu trước khi chứng minh lộ ra</td></tr>
<tr><td><strong>Ca cực trị</strong></td><td>Chuyện gì xảy ra ở 0, ở 1, ở vô cực, hay ở biên?</td><td>Một hàm sắp xếp: thử với danh sách rỗng và danh sách một phần tử. Phần lớn lỗi thật sống ở đó</td></tr>
</table>
<ul>
<li><strong>Pólya, 1945 là nguồn nằm sau cả mục này.</strong> Cuốn <em>How to Solve It</em> của ông là gốc của câu "có bài toán liên quan không?" — khi một MOOC trích một nguồn năm 1945, nó đang báo hiệu đây là ý nền tảng và sẽ vào đề.</li>
<li><strong>Đặc biệt hoá là cố ý ĐI LÙI.</strong> Làm bài toán nhỏ lại thì cảm giác như đang bỏ cuộc, nhưng quy luật nhìn thấy ở n = 3 thường đúng là quy luật đúng ở n = 300.</li>
<li><strong>Ca cực trị là chỗ hệ thống vỡ.</strong> Không, một, tối đa, rỗng, âm, trùng lặp. Đây chính là bản năng kiểm thử giá trị biên trong SWT301 — MOOC và môn kiểm thử của bạn đang dạy cùng một ý bằng hai hệ từ vựng.</li>
<li><strong>Áp dụng ở FPTU.</strong> Gặp bài MAD101 hay MAE101 không biết bắt đầu từ đâu, hãy đặt mọi biến về giá trị hợp lệ nhỏ nhất rồi tính tay. Gặp bài lập trình, chạy hàm của bạn với đầu vào rỗng trước đã.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn hai nửa của gạch đầu dòng thứ ba. <strong>Đặc biệt hoá</strong> = làm nhỏ/đơn giản đi. <strong>Ca cực trị</strong> = đẩy ra biên. Cả hai nằm trên slide này trong MỘT gạch đầu dòng, và đề thi có thể tách chúng ra.</p>`],

      [57, 'Problem-solving with cases in medicine, the social sciences and humanities',
        `<p class="y-chinh">🎯 The non-mathematical branch, and it names <strong>two kinds of case</strong>: the <strong>'telling case'</strong> (Mitchell, 1984) and the <strong>'negative case'</strong> (Corbin &amp; Strauss, 2008) <strong>or deviant case</strong> (e.g. Clayman &amp; Maynard, 1995).</p>
<table>
<tr><th>Kind of case</th><th>Definition</th><th>What it does for you</th><th>Real example</th></tr>
<tr><td><strong>Telling case</strong><br />(Mitchell, 1984)</td><td>An instance where the mechanism is unusually visible — it "tells" you how the thing works</td><td>Turns an invisible process into something you can point at</td><td>The one sprint where the team delivered early: the tasks were all under 4 hours. That sprint tells you the mechanism</td></tr>
<tr><td><strong>Negative / deviant case</strong><br />(Corbin &amp; Strauss, 2008; Clayman &amp; Maynard, 1995)</td><td>An instance that does <em>not</em> fit your explanation</td><td>Tests and sharpens the theory — or destroys it, which is also progress</td><td>One member always delivers on time even with huge tasks. Your "task size" explanation does not cover him — so the real rule has a second clause</td></tr>
</table>
<ul>
<li><strong>Two names for one thing in the second bullet.</strong> "Negative case" and "deviant case" are different research traditions' words for the same move. The slide gives both because different disciplines will use different terms — count it as <strong>two kinds of case</strong>, not three.</li>
<li><strong>Why hunting for the negative case is a discipline.</strong> The natural instinct is to collect confirmations. Deliberately looking for the instance that contradicts you is what separates analysis from opinion, and it is the same logic as falsification in science.</li>
<li><strong>A telling case is chosen, not found at random.</strong> You pick the instance where the process is exposed, the way a doctor teaches from one unusually clear patient presentation — which is why medicine is named first on this slide.</li>
<li><strong>Applied at FPTU.</strong> On the SWP391 problem: the telling case is your best sprint, the negative case is the teammate who breaks your explanation. Look at both before writing the "lessons learned" section, or you will write a story that fits only half the data.</li>
</ul>
<p class="pitfall">⚠️ Note the layout: the text on this slide runs right to the edge of the frame — "or deviant case" sits hard against the right margin. Nothing is missing; that is how the original slide is set.</p>`,
        `<p class="y-chinh">🎯 Nhánh PHI TOÁN, và nó gọi tên <strong>HAI loại ca</strong>: <strong>'telling case' — ca biết nói</strong> (Mitchell, 1984) và <strong>'negative case' — ca phủ định</strong> (Corbin &amp; Strauss, 2008) <strong>hay deviant case — ca lệch chuẩn</strong> (ví dụ Clayman &amp; Maynard, 1995).</p>
<table>
<tr><th>Loại ca</th><th>Định nghĩa</th><th>Nó làm gì cho bạn</th><th>Ví dụ thật</th></tr>
<tr><td><strong>Telling case — ca biết nói</strong><br />(Mitchell, 1984)</td><td>Trường hợp mà cơ chế hiện ra rõ bất thường — nó "kể" cho bạn nghe thứ đó vận hành ra sao</td><td>Biến một quá trình vô hình thành thứ chỉ tay vào được</td><td>Cái sprint duy nhất nhóm về đích sớm: mọi đầu việc đều dưới 4 giờ. Sprint ấy kể cho bạn nghe cơ chế</td></tr>
<tr><td><strong>Negative / deviant case — ca phủ định / lệch chuẩn</strong><br />(Corbin &amp; Strauss, 2008; Clayman &amp; Maynard, 1995)</td><td>Trường hợp KHÔNG khớp với lời giải thích của bạn</td><td>Kiểm lại và mài sắc lý thuyết — hoặc đập vỡ nó, mà đó cũng là tiến bộ</td><td>Một thành viên luôn nộp đúng hạn dù đầu việc rất lớn. Lời giải thích "kích thước đầu việc" của bạn không phủ được anh ta — vậy quy luật thật có thêm một vế nữa</td></tr>
</table>
<ul>
<li><strong>Gạch đầu dòng thứ hai có HAI tên cho MỘT thứ.</strong> "Negative case" và "deviant case" là chữ của hai truyền thống nghiên cứu khác nhau cho cùng một nước đi. Slide đưa cả hai vì mỗi ngành dùng một từ — hãy đếm là <strong>HAI loại ca</strong>, không phải ba.</li>
<li><strong>Vì sao đi săn ca phủ định là một kỷ luật.</strong> Bản năng tự nhiên là gom bằng chứng ủng hộ mình. Cố ý đi tìm trường hợp bác lại mình mới là thứ tách phân tích khỏi ý kiến, và đó cũng chính là logic phủ chứng trong khoa học.</li>
<li><strong>Telling case là ca được CHỌN, không phải bắt gặp ngẫu nhiên.</strong> Bạn chọn đúng trường hợp mà quá trình phơi ra, y như bác sĩ dạy học từ một ca bệnh biểu hiện rõ bất thường — chính vì thế slide này gọi tên ngành Y trước tiên.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với ca SWP391: telling case là sprint tốt nhất, negative case là người đồng đội phá vỡ lời giải thích của bạn. Soi cả hai trước khi viết phần "bài học rút ra", không thì bạn viết ra một câu chuyện chỉ khớp một nửa dữ liệu.</li>
</ul>
<p class="pitfall">⚠️ Để ý cách trình bày: chữ trên slide này chạy sát mép khung — cụm "or deviant case" nằm đè vào lề phải. Không thiếu chữ nào; slide gốc vốn được đặt như vậy.</p>`],

      [58, '3.4b Strategies for Problem-Solving with Specialised Knowledge & Special Cases (same four outcomes as 3.4a)',
        `<p class="y-chinh">🎯 A section opener for 3.4b — and it prints the <strong>exact same four bullets as slide 54</strong>, word for word: identify how similar problems can assist · recognise how simpler versions, special cases or anomalies can assist · use analogies · apply comparison techniques.</p>
<ul>
<li><strong>Say it plainly: this is a duplication in the original deck.</strong> The heading changed from "3.4a Problem-Solving with Special Cases" to "3.4b Strategies for Problem-Solving with Specialised Knowledge &amp; Special Cases", but the objectives underneath were not rewritten. Do not read a hidden distinction into it — there is none on the slide.</li>
<li><strong>What 3.4b really adds, by position.</strong> The word that is new in the heading is <strong>Specialised Knowledge</strong>, which links back to slides 52–53. The section is the <em>join</em>: bring your discipline's theory (52–53) together with the special-case technique (55–57).</li>
<li><strong>Why the repetition is still useful to you.</strong> A list a MOOC prints twice is a list the MOOC wants you to know. Four items: similar problems · simpler versions/special cases/anomalies · analogies · comparison techniques.</li>
<li><strong>Applied at FPTU.</strong> The joined version of the SWP391 problem is: use software-engineering knowledge (velocity, WIP limits, task decomposition — your specialised knowledge) <em>and</em> the special case (the one good sprint) together. Neither alone tells you what to do next.</li>
</ul>
<p class="meo">💡 If an exam question asks for the outcomes of 3.4a or of 3.4b, the answer is the same four items. That is not a trick — it is what the deck prints.</p>
<p class="pitfall">⚠️ Do not "fix" this by inventing different objectives for 3.4b. Quote what is on the slide; flag the repetition; move on.</p>`,
        `<p class="y-chinh">🎯 Slide mở mục 3.4b — và nó in <strong>ĐÚNG BỐN GẠCH ĐẦU DÒNG Y HỆT slide 54</strong>, từng chữ một: nhận ra bài toán tương tự giúp được gì · nhận ra bản đơn giản hơn, ca đặc biệt hoặc bất thường giúp được gì · dùng loại suy · áp dụng kỹ thuật so sánh.</p>
<ul>
<li><strong>Nói thẳng: đây là lỗi LẶP của chính bộ slide gốc.</strong> Tiêu đề đã đổi từ "3.4a Problem-Solving with Special Cases" sang "3.4b Strategies for Problem-Solving with Specialised Knowledge &amp; Special Cases", nhưng phần mục tiêu bên dưới thì chưa viết lại. Đừng cố đọc ra một phân biệt ngầm nào — trên slide không có.</li>
<li><strong>3.4b thật sự thêm gì, xét theo vị trí.</strong> Chữ MỚI trong tiêu đề là <strong>Specialised Knowledge</strong>, nối ngược về slide 52–53. Mục này chính là chỗ GHÉP: đem lý thuyết của ngành bạn (52–53) lại với kỹ thuật ca đặc biệt (55–57).</li>
<li><strong>Vì sao sự lặp này vẫn có ích cho bạn.</strong> Danh sách nào MOOC in hai lần là danh sách MOOC muốn bạn thuộc. Bốn mục: bài toán tương tự · bản đơn giản hơn/ca đặc biệt/bất thường · loại suy · kỹ thuật so sánh.</li>
<li><strong>Áp dụng ở FPTU.</strong> Bản đã ghép của ca SWP391 là: dùng kiến thức công nghệ phần mềm (velocity, giới hạn việc đang làm, chẻ nhỏ đầu việc — kiến thức chuyên ngành của bạn) <em>CÙNG VỚI</em> ca đặc biệt (sprint tốt duy nhất). Một mình cái nào cũng không nói được bước tiếp theo.</li>
</ul>
<p class="meo">💡 Đề hỏi mục tiêu của 3.4a hay của 3.4b thì đáp án là CÙNG bốn mục đó. Không phải mẹo lừa — slide in ra đúng như thế.</p>
<p class="pitfall">⚠️ Đừng "sửa" bằng cách bịa ra mục tiêu khác cho 3.4b. Trích đúng chữ trên slide, nêu rõ chỗ lặp, rồi đi tiếp.</p>`],

      [59, '3.4c Using Special Cases to Solve Problems (different template)',
        `<p class="y-chinh">🎯 The third opener of section 3.4, with only <strong>two outcomes</strong>: <strong>identify how similar problems can assist in finding solutions</strong>, and <strong>understand how to solve problems by comparing situations WITH and WITHOUT the problem as a way to generate solutions</strong>. The second bullet is the new, genuinely useful idea.</p>
<ul>
<li><strong>This slide uses a different template from the rest of the deck.</strong> No University of Sydney shield in the corner, a thin vertical rule at the far left edge, and a footer reading "…niversity of Sydney" with "Page 1" at bottom right. It is a re-made or inserted slide, not one of the original Sydney renderings — worth knowing so you do not think a logo is missing.</li>
<li><strong>"With and without" is a controlled comparison.</strong> You are not comparing good and bad in the abstract; you are finding two situations that are as similar as possible and differ mainly in whether the problem occurs. Whatever else differs is your candidate cause.</li>
<li><strong>It generates solutions, not just diagnoses.</strong> The slide says "as a way to generate solutions". Once you know what the problem-free situation had, the solution is often simply: reproduce that condition deliberately.</li>
<li><strong>Applied at FPTU, run end to end.</strong> Situation WITHOUT the problem: sprint 1 — tasks under 4 hours, a 10-minute stand-up on Mon/Wed/Fri, one shared Jira board. Situation WITH the problem: sprints 2–3 — tasks of 2–3 days, stand-ups dropped, status tracked in a Messenger thread. Three differences, and they are testable one at a time.</li>
</ul>
<p class="dap-an">✅ Worked decision: three candidate solutions scored against three weighted criteria — impact on the 2-week slip (weight 3), effort to adopt (weight 2), team acceptance (weight 1); each rated 1–5.</p>
<table>
<tr><th>Option</th><th>Impact ×3</th><th>Low effort ×2</th><th>Acceptance ×1</th><th>Total</th></tr>
<tr><td><strong>A. Split every task below 4 hours + restore the 3 stand-ups</strong></td><td>5 → 15</td><td>4 → 8</td><td>4 → 4</td><td><strong>27</strong></td></tr>
<tr><td>B. Reassign the late member's work to the other three</td><td>4 → 12</td><td>2 → 4</td><td>1 → 1</td><td>17</td></tr>
<tr><td>C. Ask the lecturer to extend the deadline</td><td>3 → 9</td><td>5 → 10</td><td>3 → 3</td><td>22</td></tr>
</table>
<p class="dap-an">✅ Option A wins (27). Note that it is exactly "reproduce the conditions of the situation without the problem" — which is what the slide told you to do.</p>
<p class="meo">💡 Remember this slide as the <strong>WITH / WITHOUT comparison</strong>. Slide 55's "comparing &amp; contrasting other instances" is the general technique; 3.4c is the specific, most powerful version of it.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu thứ ba của mục 3.4, chỉ có <strong>HAI mục tiêu</strong>: <strong>nhận ra bài toán tương tự giúp tìm lời giải thế nào</strong>, và <strong>hiểu cách giải quyết vấn đề bằng cách SO SÁNH tình huống CÓ và KHÔNG CÓ vấn đề, coi đó là cách sinh ra giải pháp</strong>. Gạch đầu dòng thứ hai mới là ý mới và thật sự dùng được.</p>
<ul>
<li><strong>Slide này dùng TEMPLATE KHÁC hẳn phần còn lại của bộ.</strong> Không có khiên logo University of Sydney ở góc, có một vạch dọc mảnh sát mép trái, và chân trang ghi "…niversity of Sydney" cùng "Page 1" ở góc phải dưới. Đây là slide dựng lại hoặc chèn thêm, không thuộc bộ kết xuất gốc của Sydney — biết để khỏi tưởng bị mất logo.</li>
<li><strong>"Có và không có" là một phép SO SÁNH CÓ KIỂM SOÁT.</strong> Bạn không so tốt với xấu chung chung; bạn đi tìm hai tình huống giống nhau nhất có thể và khác nhau chủ yếu ở chỗ vấn đề có xảy ra hay không. Mọi khác biệt còn lại chính là ứng viên nguyên nhân.</li>
<li><strong>Nó SINH RA giải pháp, không chỉ chẩn đoán.</strong> Slide viết rõ "as a way to generate solutions". Một khi biết tình huống không-có-vấn-đề đã có những gì, giải pháp thường chỉ đơn giản là: tái tạo lại điều kiện đó một cách có chủ đích.</li>
<li><strong>Áp dụng ở FPTU, chạy trọn.</strong> Tình huống KHÔNG CÓ vấn đề: sprint 1 — đầu việc dưới 4 giờ, họp nhanh 10 phút thứ 2/4/6, một bảng Jira dùng chung. Tình huống CÓ vấn đề: sprint 2–3 — đầu việc 2–3 ngày, bỏ họp nhanh, theo dõi tiến độ trong một luồng Messenger. Ba khác biệt, và kiểm được từng cái một.</li>
</ul>
<p class="dap-an">✅ Quyết định chạy thật: ba phương án chấm theo ba tiêu chí có TRỌNG SỐ — tác động lên độ trễ 2 tuần (trọng số 3), công sức áp dụng (trọng số 2), nhóm chấp nhận được (trọng số 1); mỗi tiêu chí cho điểm 1–5.</p>
<table>
<tr><th>Phương án</th><th>Tác động ×3</th><th>Ít công ×2</th><th>Chấp nhận ×1</th><th>Tổng</th></tr>
<tr><td><strong>A. Chẻ mọi đầu việc xuống dưới 4 giờ + khôi phục 3 buổi họp nhanh</strong></td><td>5 → 15</td><td>4 → 8</td><td>4 → 4</td><td><strong>27</strong></td></tr>
<tr><td>B. Chia lại phần việc của người trễ cho ba người còn lại</td><td>4 → 12</td><td>2 → 4</td><td>1 → 1</td><td>17</td></tr>
<tr><td>C. Xin giảng viên gia hạn nộp bài</td><td>3 → 9</td><td>5 → 10</td><td>3 → 3</td><td>22</td></tr>
</table>
<p class="dap-an">✅ Phương án A thắng (27 điểm). Để ý: nó đúng là "tái tạo điều kiện của tình huống không có vấn đề" — chính điều slide vừa bảo bạn làm.</p>
<p class="meo">💡 Nhớ slide này bằng cụm <strong>SO SÁNH CÓ / KHÔNG CÓ</strong>. "Comparing &amp; contrasting other instances" ở slide 55 là kỹ thuật chung; 3.4c là phiên bản cụ thể và mạnh nhất của nó.</p>`],

      [60, '4.1a Seeking Different Perspectives (learning outcomes)',
        `<p class="y-chinh">🎯 A new top-level section opens — 4.1a — with <strong>two outcomes</strong>: <strong>appreciate the importance of outside contribution &amp; collaboration in the problem-solving process</strong>, and <strong>change perspectives &amp; view problems through a different disciplinary lens</strong>.</p>
<table>
<tr><th>Outcome</th><th>Where the new view comes from</th><th>Covered by which slide</th></tr>
<tr><td><strong>Outside contribution &amp; collaboration</strong></td><td>Other <em>people</em> — peers, experts, amateurs, children</td><td>Slide 61 (Two Heads), 63 (Talking Things Over), 64 (Evidence)</td></tr>
<tr><td><strong>A different disciplinary lens</strong></td><td>Other <em>fields</em> — biology into traffic control, physics into genetics</td><td>Slide 62 (Combining Different Fields)</td></tr>
</table>
<ul>
<li><strong>Two different mechanisms, deliberately separated.</strong> Bullet one is social (bring a person in); bullet two is intellectual (bring a discipline in). You can do the first without the second — a room of four IT students is collaboration with no change of lens.</li>
<li><strong>"Appreciate the importance" is a low-effort verb doing heavy work.</strong> The MOOC's claim is that solitary thinking has a ceiling, and that the ceiling is raised by other minds, not by more hours from the same mind.</li>
<li><strong>Why this section sits right after special cases.</strong> Sections 3.4a–3.4c gave you ways to interrogate the problem yourself. 4.1 says: when your own interrogation stalls, the next move is not to try harder, it is to change who is looking.</li>
<li><strong>Applied at FPTU.</strong> On the SWP391 slip, "outside contribution" is a 20-minute talk with a senior who has shipped a capstone; "different disciplinary lens" is asking how a logistics or psychology student would read the same delay. Both are cheap; neither is what a stuck team usually does.</li>
</ul>
<p class="meo">💡 Section 4.1a = <strong>PEOPLE + DISCIPLINES</strong>. Two outcomes, two sources of fresh perspective.</p>`,
        `<p class="y-chinh">🎯 Một mục lớn mới mở ra — 4.1a — với <strong>HAI mục tiêu</strong>: <strong>nhận thức được tầm quan trọng của đóng góp từ bên ngoài &amp; sự cộng tác trong quy trình giải quyết vấn đề</strong>, và <strong>đổi góc nhìn &amp; soi vấn đề qua lăng kính của một ngành khác</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Góc nhìn mới đến từ đâu</th><th>Slide nào phủ</th></tr>
<tr><td><strong>Đóng góp bên ngoài &amp; cộng tác</strong></td><td>NGƯỜI khác — bạn bè, chuyên gia, người ngoại đạo, trẻ con</td><td>Slide 61 (Hai cái đầu), 63 (Nói ra), 64 (Bằng chứng)</td></tr>
<tr><td><strong>Lăng kính ngành khác</strong></td><td>NGÀNH khác — sinh học vào điều khiển giao thông, vật lý vào di truyền</td><td>Slide 62 (Ghép các ngành)</td></tr>
</table>
<ul>
<li><strong>HAI cơ chế khác nhau, cố ý tách riêng.</strong> Gạch một là xã hội (kéo thêm một NGƯỜI vào); gạch hai là trí tuệ (kéo thêm một NGÀNH vào). Bạn có thể làm cái thứ nhất mà không có cái thứ hai — một phòng bốn sinh viên CNTT là cộng tác nhưng không đổi lăng kính nào cả.</li>
<li><strong>"Appreciate the importance" là động từ nhẹ nhưng gánh việc nặng.</strong> Khẳng định của MOOC là: nghĩ một mình có trần, và cái trần đó được nâng lên bởi những cái đầu KHÁC, chứ không bởi thêm giờ của cùng một cái đầu.</li>
<li><strong>Vì sao mục này nằm ngay sau phần ca đặc biệt.</strong> Mục 3.4a–3.4c cho bạn cách tự chất vấn bài toán. Mục 4.1 nói: khi phép chất vấn của chính bạn bế tắc, nước đi tiếp theo không phải cố gắng hơn, mà là ĐỔI NGƯỜI ĐANG NHÌN.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với độ trễ SWP391, "đóng góp bên ngoài" là 20 phút nói chuyện với một anh khoá trên đã bảo vệ xong đồ án; "lăng kính ngành khác" là hỏi xem một sinh viên logistics hay tâm lý sẽ đọc cùng độ trễ đó ra sao. Cả hai đều rẻ; và cả hai đều không phải thứ một nhóm đang bí thường làm.</li>
</ul>
<p class="meo">💡 Mục 4.1a = <strong>NGƯỜI + NGÀNH</strong>. Hai mục tiêu, hai nguồn góc nhìn mới.</p>`],

      [61, 'Two Heads are Better Than One (Beebe & Masterson, 2015; Brick, 2014; de Bono, 1973)',
        `<p class="y-chinh">🎯 <strong>Three</strong> reasons another person helps: <strong>other people will often see a problem differently to how we do</strong> · <strong>experts might be able to point out aspects or give you a hint</strong> · <strong>amateurs or children can see missed connections</strong>. Cited: (see Beebe &amp; Masterson, 2015; Brick, 2014; de Bono, 1973).</p>
<table>
<tr><th>Who</th><th>What they bring</th><th>What to ask them</th><th>Real example</th></tr>
<tr><td><strong>Anyone else</strong></td><td>A different default framing</td><td>"Describe this problem back to me in your own words"</td><td>A teammate says "it's not a coding delay, it's a review delay" — and they are right</td></tr>
<tr><td><strong>An expert</strong></td><td>Aspects you cannot see, and hints</td><td>"What am I not asking that I should be?"</td><td>The lecturer points out your burndown never had a baseline, so "two weeks late" is not even measured</td></tr>
<tr><td><strong>An amateur or a child</strong></td><td>Missed connections, because they have no habits to protect</td><td>"Why is it done that way?"</td><td>A first-year asks why four people wait for one person's module instead of stubbing it — nobody had questioned the dependency</td></tr>
</table>
<ul>
<li><strong>The third bullet is the surprising one, and therefore examinable.</strong> Everyone expects experts to help. The MOOC deliberately says <em>amateurs or children</em> see missed connections — because expertise builds habits, and habits hide options.</li>
<li><strong>Expertise helps by narrowing; inexperience helps by not narrowing.</strong> That is one sentence worth memorising, and it explains why the slide lists both instead of just the expert.</li>
<li><strong>de Bono, 1973 shows up here and again on slides 75–76.</strong> He is the lateral-thinking author of this MOOC; when you see his name, the idea is about breaking an established way of looking.</li>
<li><strong>Applied at FPTU.</strong> Explain your stuck problem to someone outside your major — a Business or Design student — and to a first-year. Both conversations cost 15 minutes; both routinely produce a question your own team stopped asking in week 2.</li>
</ul>
<p class="pitfall">⚠️ Exam wording: the slide says amateurs or children <strong>can see missed connections</strong> — not "solve the problem" and not "know more". The claim is about noticing connections, nothing more.</p>`,
        `<p class="y-chinh">🎯 <strong>BA</strong> lý do một người khác giúp được bạn: <strong>người khác thường nhìn vấn đề khác cách ta nhìn</strong> · <strong>chuyên gia có thể chỉ ra những khía cạnh hoặc cho bạn một gợi ý</strong> · <strong>người ngoại đạo hoặc trẻ con nhìn ra những mối liên hệ bị bỏ sót</strong>. Trích: (xem Beebe &amp; Masterson, 2015; Brick, 2014; de Bono, 1973).</p>
<table>
<tr><th>Ai</th><th>Họ mang lại gì</th><th>Hỏi họ câu gì</th><th>Ví dụ thật</th></tr>
<tr><td><strong>Bất kỳ ai khác</strong></td><td>Một khung nhìn mặc định khác</td><td>"Bạn hãy mô tả lại vấn đề này bằng lời của bạn"</td><td>Một thành viên nói "đây không phải trễ code, đây là trễ review" — và đúng là như vậy</td></tr>
<tr><td><strong>Chuyên gia</strong></td><td>Những khía cạnh bạn không thấy, và các gợi ý</td><td>"Tôi đang KHÔNG hỏi điều gì mà lẽ ra phải hỏi?"</td><td>Giảng viên chỉ ra biểu đồ burndown của bạn chưa từng có mốc nền, nên "trễ hai tuần" thật ra còn chưa đo được</td></tr>
<tr><td><strong>Người ngoại đạo hoặc trẻ con</strong></td><td>Những liên hệ bị bỏ sót, vì họ không có thói quen nào cần bảo vệ</td><td>"Sao lại làm theo cách đó?"</td><td>Một bạn năm nhất hỏi vì sao bốn người phải ngồi chờ module của một người thay vì tạo bản giả — chưa ai từng chất vấn cái phụ thuộc đó</td></tr>
</table>
<ul>
<li><strong>Gạch đầu dòng thứ ba mới là cái bất ngờ, nên chắc chắn vào đề.</strong> Ai cũng chờ chuyên gia giúp. MOOC cố ý nói <em>người ngoại đạo hoặc trẻ con</em> nhìn ra liên hệ bị bỏ sót — vì chuyên môn đẻ ra thói quen, mà thói quen thì che mất lựa chọn.</li>
<li><strong>Chuyên môn giúp bằng cách THU HẸP; thiếu kinh nghiệm giúp bằng cách KHÔNG thu hẹp.</strong> Một câu đáng thuộc, và nó giải thích vì sao slide liệt kê cả hai chứ không chỉ chuyên gia.</li>
<li><strong>de Bono, 1973 xuất hiện ở đây và quay lại ở slide 75–76.</strong> Ông là tác giả tư duy phi tuyến (lateral thinking) của cả MOOC này; thấy tên ông là ý tưởng đang nói về việc phá vỡ một lối nhìn đã đóng khuôn.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hãy kể vấn đề đang bí của bạn cho một người ngoài ngành — sinh viên Kinh doanh hay Thiết kế — và cho một bạn năm nhất. Cả hai cuộc nói chuyện tốn 15 phút; và cả hai thường xuyên đẻ ra một câu hỏi mà chính nhóm bạn đã thôi hỏi từ tuần 2.</li>
</ul>
<p class="pitfall">⚠️ Chữ nghĩa trong đề: slide nói người ngoại đạo/trẻ con <strong>NHÌN RA LIÊN HỆ BỊ BỎ SÓT</strong> — không phải "giải được vấn đề", cũng không phải "biết nhiều hơn". Khẳng định chỉ về việc NHẬN RA liên hệ, không hơn.</p>`],

      [62, 'Combining Different Fields (Keim, 2009; Cryer, 2006)',
        `<p class="y-chinh">🎯 The disciplinary half of section 4.1: combining fields <strong>stimulates new ways of thinking</strong>, because <strong>each field has incredible depth of knowledge, but often too specific</strong>. Then two named examples.</p>
<table>
<tr><th>Example on the slide</th><th>From</th><th>To</th><th>Source</th></tr>
<tr><td>How ant populations move and organise</td><td>Biology / entomology</td><td><strong>Traffic control and data transmission</strong></td><td>(Keim, 2009)</td></tr>
<tr><td>Francis Crick</td><td><strong>Physicist</strong></td><td><strong>Double-helix model of DNA</strong></td><td>(Cryer, 2006, p. 209)</td></tr>
</table>
<ul>
<li><strong>The diagnosis is sharper than the prescription.</strong> "Incredible depth… but often too specific" is the reason cross-field work pays: depth gives a field powerful tools, and specificity stops it from noticing where else they apply.</li>
<li><strong>The ant example is real and it is in your syllabus.</strong> Ant colony optimisation is a working routing algorithm — biology's answer to "find a short path with no central planner" became a network-routing and traffic-control method. A biology observation became an IT algorithm.</li>
<li><strong>Crick is the "outsider wins" case.</strong> A physicist worked on the structure of DNA — precisely because the problem was structural, and structure is what physicists are trained on. The lesson is not "ignore your training", it is "your training is portable".</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 delay has known analogues in other fields: queueing theory (a queue with one server blocks everything behind it), logistics (the bottleneck station sets the throughput of the whole line), and medicine (triage — treat by severity, not by arrival order). Any of the three gives you a concrete move.</li>
</ul>
<p class="meo">💡 Two examples, two directions to remember: <strong>ants → traffic and data</strong>, <strong>physicist → DNA</strong>. Both names and both fields are the kind of detail a multiple-choice item likes to swap around.</p>`,
        `<p class="y-chinh">🎯 Nửa "ngành khác" của mục 4.1: ghép các ngành lại <strong>kích thích những lối nghĩ mới</strong>, bởi vì <strong>ngành nào cũng có chiều sâu kiến thức kinh khủng, nhưng thường quá hẹp</strong>. Rồi hai ví dụ có tên tuổi hẳn hoi.</p>
<table>
<tr><th>Ví dụ trên slide</th><th>Từ ngành</th><th>Sang ngành</th><th>Nguồn</th></tr>
<tr><td>Nghiên cứu đàn kiến di chuyển và tổ chức ra sao</td><td>Sinh học / côn trùng học</td><td><strong>Điều khiển giao thông và truyền dữ liệu</strong></td><td>(Keim, 2009)</td></tr>
<tr><td>Francis Crick</td><td><strong>Nhà vật lý</strong></td><td><strong>Mô hình xoắn kép của ADN</strong></td><td>(Cryer, 2006, tr. 209)</td></tr>
</table>
<ul>
<li><strong>Phần chẩn đoán sắc hơn phần kê đơn.</strong> "Chiều sâu kinh khủng… nhưng thường quá hẹp" chính là lý do làm việc xuyên ngành có lãi: chiều sâu cho một ngành những công cụ mạnh, còn sự hẹp ngăn nó nhận ra công cụ ấy còn dùng được ở đâu nữa.</li>
<li><strong>Ví dụ đàn kiến là thật và nó nằm ngay trong chương trình học của bạn.</strong> Ant colony optimisation là một thuật toán định tuyến đang chạy thật — câu trả lời của sinh học cho bài "tìm đường ngắn mà không có ai điều phối trung tâm" đã thành phương pháp định tuyến mạng và điều khiển giao thông. Một quan sát sinh học biến thành một thuật toán CNTT.</li>
<li><strong>Crick là ca "người ngoài thắng".</strong> Một nhà vật lý lại làm ra cấu trúc ADN — chính vì bài toán đó là bài toán CẤU TRÚC, mà cấu trúc là thứ dân vật lý được rèn. Bài học không phải "bỏ qua chuyên môn của mình", mà là "chuyên môn của bạn MANG ĐI ĐƯỢC".</li>
<li><strong>Áp dụng ở FPTU.</strong> Độ trễ SWP391 của bạn có bản tương đương đã biết ở ngành khác: lý thuyết hàng đợi (một hàng đợi chỉ có một người phục vụ thì chặn hết phía sau), logistics (trạm nghẽn quyết định năng suất cả dây chuyền), và y khoa (phân loại cấp cứu — xử theo mức nặng, không theo thứ tự đến). Cái nào trong ba cái cũng cho bạn một nước đi cụ thể.</li>
</ul>
<p class="meo">💡 Hai ví dụ, hai chiều phải nhớ: <strong>kiến → giao thông và dữ liệu</strong>, <strong>nhà vật lý → ADN</strong>. Cả tên người lẫn tên ngành đều là loại chi tiết mà câu trắc nghiệm rất thích tráo đổi.</p>`],

      [63, 'Talking Things Over (Cryer, 2006)',
        `<p class="y-chinh">🎯 Two bullets, and the second is a direct quote: <strong>creativity can be inspired by talking over the issues</strong> (Cryer, 2006), and <strong>"The very act of talking seems to stimulate one's own thinking"</strong> (Cryer, 2006, p.205).</p>
<ul>
<li><strong>The claim is about YOUR thinking, not about the other person's advice.</strong> Read the quote carefully: talking stimulates <em>one's own</em> thinking. The benefit arrives even if the listener says nothing useful — which is why programmers call it rubber-duck debugging.</li>
<li><strong>Why speaking works when thinking does not.</strong> Speech is linear and public; it forces you to make explicit the steps you were skipping silently. The gap you skip in your head becomes audible the moment you have to say it out loud to someone.</li>
<li><strong>It is the cheapest technique in the whole MOOC.</strong> No preparation, no expertise required in the listener, ten minutes. Compared with the special-case analysis of section 3.4, this is the move to try first when you are stuck.</li>
<li><strong>Page number matters here.</strong> The slide gives <strong>p.205</strong> for the quote, and slide 74 quotes Cryer at <strong>p.204</strong>. Direct quotes carry page numbers; that is the referencing rule from Mooc 1 being demonstrated inside Mooc 2.</li>
<li><strong>Applied at FPTU.</strong> Before the next SWP391 meeting, spend ten minutes explaining the delay out loud to one teammate with no slides. You will usually locate the real blocker mid-sentence, before they have replied.</li>
</ul>
<p class="meo">💡 Contrast the two nearby slides: slide 61 says other people <em>see</em> differently (their contribution). Slide 63 says talking helps <em>your own</em> thinking (no contribution needed). Different mechanisms, adjacent slides — a classic exam pairing.</p>`,
        `<p class="y-chinh">🎯 Hai gạch đầu dòng, và cái thứ hai là trích dẫn nguyên văn: <strong>sự sáng tạo có thể được khơi lên bằng cách nói ra vấn đề</strong> (Cryer, 2006), và <strong>"Chính hành động nói dường như kích thích tư duy của chính mình"</strong> (Cryer, 2006, tr.205).</p>
<ul>
<li><strong>Khẳng định này nói về tư duy CỦA BẠN, không phải về lời khuyên của người kia.</strong> Đọc kỹ câu trích: nói ra kích thích tư duy <em>của chính mình</em>. Cái lợi đến ngay cả khi người nghe chẳng nói gì hữu ích — chính vì thế dân lập trình gọi nó là gỡ lỗi với con vịt cao su.</li>
<li><strong>Vì sao NÓI chạy được trong khi NGHĨ thì không.</strong> Lời nói là tuyến tính và công khai; nó ép bạn phải nói rõ những bước bạn vẫn âm thầm nhảy cóc. Cái khe bạn nhảy qua trong đầu trở thành nghe được ngay khoảnh khắc bạn phải phát ra thành tiếng cho ai đó.</li>
<li><strong>Đây là kỹ thuật RẺ NHẤT trong cả MOOC.</strong> Không cần chuẩn bị, không đòi người nghe có chuyên môn, mười phút. So với phân tích ca đặc biệt của mục 3.4, đây là nước đi nên thử TRƯỚC khi bạn bí.</li>
<li><strong>Số trang có ý nghĩa ở đây.</strong> Slide ghi <strong>tr.205</strong> cho câu trích, còn slide 74 trích Cryer ở <strong>tr.204</strong>. Trích nguyên văn thì phải có số trang; đó chính là quy tắc trích dẫn của Mooc 1 đang được làm mẫu ngay trong Mooc 2.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước buổi họp SWP391 tới, hãy dành mười phút nói to độ trễ đó cho một thành viên nghe, không slide gì hết. Bạn thường sẽ định vị được điểm nghẽn thật ngay giữa câu, trước khi người kia kịp trả lời.</li>
</ul>
<p class="meo">💡 Đối chiếu hai slide kề nhau: slide 61 nói người khác <em>NHÌN</em> khác đi (đóng góp của họ). Slide 63 nói NÓI RA giúp tư duy <em>của chính bạn</em> (không cần ai đóng góp gì). Hai cơ chế khác nhau, hai slide sát nhau — cặp đề thi kinh điển.</p>`],

      [64, 'Evidence (Brick, 2014) — knowledge develops through debate and argument',
        `<p class="y-chinh">🎯 The slide that backs the whole section with research: <strong>education research indicates that we learn better by and through interaction</strong>, and <strong>"[One] of the central ideas of academic culture…is…that knowledge develops through debate and argument"</strong> (Brick, 2014, p.4).</p>
<ul>
<li><strong>The title is doing argumentative work.</strong> The slide is literally called "Evidence" — section 4.1 has been making claims about collaboration, and this is where the MOOC supplies the support. That is the behaviour it wants you to copy in your own writing.</li>
<li><strong>"By and through interaction" is two prepositions, not a stylistic flourish.</strong> We learn <em>by</em> interacting (the act itself teaches) and <em>through</em> interaction (it is the channel by which knowledge arrives). Both readings are intended.</li>
<li><strong>"Debate and argument" is not conflict.</strong> In academic culture an argument is a claim supported by reasons. The slide says knowledge <em>develops</em> through it — disagreement is the engine, not a breakdown of the process.</li>
<li><strong>This licenses you to disagree in class.</strong> Many students treat challenging a lecturer or a teammate as rude. The MOOC's position is the opposite: a seminar where nobody disagrees has produced no knowledge.</li>
<li><strong>Applied at FPTU.</strong> In a SWP391 retrospective, the useful meeting is the one where two people defend different explanations of the delay with evidence. A meeting where everyone nods ends with the same plan that already failed twice.</li>
</ul>
<p class="meo">💡 Remember the chain of section 4.1: <strong>61 other people → 62 other fields → 63 talking → 64 evidence for all three</strong>. A summary-style question about section 4.1 is really asking for that chain.</p>`,
        `<p class="y-chinh">🎯 Slide chống lưng cho cả mục bằng nghiên cứu: <strong>nghiên cứu giáo dục cho thấy chúng ta học tốt hơn BẰNG và QUA tương tác</strong>, và <strong>"[Một] trong những ý tưởng trung tâm của văn hoá học thuật… là… tri thức phát triển qua tranh luận và lập luận"</strong> (Brick, 2014, tr.4).</p>
<ul>
<li><strong>Chính cái tiêu đề đang làm việc lập luận.</strong> Slide này tên đúng là "Evidence" — mục 4.1 vừa đưa ra một loạt khẳng định về cộng tác, và đây là chỗ MOOC nộp bằng chứng. Đó chính là hành vi nó muốn bạn bắt chước trong bài viết của mình.</li>
<li><strong>"By and through interaction" là HAI giới từ, không phải lối viết cho đẹp.</strong> Ta học <em>BẰNG</em> việc tương tác (chính hành động đó dạy ta) và <em>QUA</em> tương tác (đó là kênh mà tri thức đi tới). Cả hai cách đọc đều được chủ ý.</li>
<li><strong>"Tranh luận và lập luận" KHÔNG phải xung đột.</strong> Trong văn hoá học thuật, một lập luận là một khẳng định có lý do chống đỡ. Slide nói tri thức <em>PHÁT TRIỂN</em> qua đó — bất đồng là động cơ, không phải sự đổ vỡ của quy trình.</li>
<li><strong>Điều này CẤP PHÉP cho bạn phản biện trong lớp.</strong> Nhiều sinh viên coi việc chất vấn giảng viên hay đồng đội là bất lịch sự. Lập trường của MOOC thì ngược lại: một buổi seminar không ai bất đồng là buổi không sản xuất ra tri thức nào.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong buổi retrospective SWP391, buổi họp có ích là buổi có hai người bảo vệ hai lời giải thích khác nhau về độ trễ, kèm bằng chứng. Buổi họp ai cũng gật kết thúc bằng đúng cái kế hoạch đã hỏng hai lần.</li>
</ul>
<p class="meo">💡 Nhớ chuỗi của mục 4.1: <strong>61 người khác → 62 ngành khác → 63 nói ra → 64 bằng chứng cho cả ba</strong>. Câu hỏi dạng tóm tắt về mục 4.1 thực chất đang hỏi đúng chuỗi đó.</p>`],

      [65, '4.2a Applying Forms of Reasoning & Thinking (learning outcomes)',
        `<p class="y-chinh">🎯 Section 4.2a opens with <strong>three outcomes</strong>: <strong>question the assumptions that underlie stated problems</strong> · <strong>consider different levels and systems</strong> · <strong>apply inductive and deductive reasoning</strong>. Each one gets its own slide in the next few pages.</p>
<table>
<tr><th>Outcome</th><th>Delivered on slide</th><th>The one-line version</th></tr>
<tr><td><strong>Question assumptions</strong></td><td>66 (and again at 71, the Nine Dot Problem)</td><td>"Judge unstated assumptions" — the rules you were never actually given</td></tr>
<tr><td><strong>Consider different levels and systems</strong></td><td>69</td><td>Analyse systems rather than events</td></tr>
<tr><td><strong>Apply inductive and deductive reasoning</strong></td><td>67 (deductive) and 68 (inductive)</td><td>Top-down vs bottom-up</td></tr>
</table>
<ul>
<li><strong>The phrase "stated problems" is the sharp bit.</strong> A problem as <em>stated</em> already contains someone's assumptions — about what counts as the problem, what is fixed, and what may be changed. Section 4.2 attacks the statement, not just the solution.</li>
<li><strong>Three outcomes, four slides.</strong> The third outcome splits into two slides because deductive and inductive are separate machines. Expect to be asked which is which.</li>
<li><strong>This is the analytical counterweight to section 4.1.</strong> 4.1 changed <em>who</em> looks at the problem; 4.2 changes <em>how</em> you reason about it on your own. The MOOC gives you both because neither is sufficient.</li>
<li><strong>Applied at FPTU.</strong> "Our SWP391 project is two weeks late" is a <em>stated</em> problem loaded with assumptions: that the original plan was correct, that late means the same thing for every feature, that the deadline is fixed. All three are worth testing before you optimise anything.</li>
</ul>
<p class="meo">💡 Count: <strong>3 outcomes for 4.2a</strong>, and the summary on slide 70 repeats them in the same order. When a list appears at the start of a section and again at its end, it is examinable.</p>`,
        `<p class="y-chinh">🎯 Mục 4.2a mở đầu với <strong>BA mục tiêu</strong>: <strong>chất vấn các GIẢ ĐỊNH nằm dưới những vấn đề được PHÁT BIỂU ra</strong> · <strong>xét các TẦNG và HỆ THỐNG khác nhau</strong> · <strong>áp dụng suy luận QUY NẠP và DIỄN DỊCH</strong>. Mỗi mục tiêu có riêng một slide ở vài trang kế tiếp.</p>
<table>
<tr><th>Mục tiêu</th><th>Giao ở slide</th><th>Bản một dòng</th></tr>
<tr><td><strong>Chất vấn giả định</strong></td><td>66 (và lặp lại ở 71, bài Chín Chấm)</td><td>"Judge unstated assumptions" — những luật chưa ai thật sự đưa cho bạn</td></tr>
<tr><td><strong>Xét các tầng và hệ thống</strong></td><td>69</td><td>Phân tích HỆ THỐNG thay vì phân tích SỰ KIỆN</td></tr>
<tr><td><strong>Áp dụng quy nạp và diễn dịch</strong></td><td>67 (diễn dịch) và 68 (quy nạp)</td><td>Từ trên xuống so với từ dưới lên</td></tr>
</table>
<ul>
<li><strong>Cụm "stated problems" mới là chỗ sắc.</strong> Một vấn đề khi được PHÁT BIỂU ra thì đã mang sẵn giả định của ai đó — về chuyện cái gì được tính là vấn đề, cái gì cố định, cái gì được phép đổi. Mục 4.2 tấn công vào CÁCH PHÁT BIỂU, không chỉ vào lời giải.</li>
<li><strong>Ba mục tiêu, bốn slide.</strong> Mục tiêu thứ ba tách thành hai slide vì diễn dịch và quy nạp là hai cỗ máy riêng. Hãy chờ bị hỏi cái nào là cái nào.</li>
<li><strong>Đây là đối trọng phân tích của mục 4.1.</strong> Mục 4.1 đổi <em>AI</em> nhìn vấn đề; mục 4.2 đổi <em>CÁCH</em> bạn tự suy luận về nó. MOOC cho bạn cả hai vì một mình cái nào cũng chưa đủ.</li>
<li><strong>Áp dụng ở FPTU.</strong> "Đồ án SWP391 của nhóm trễ hai tuần" là một vấn đề ĐÃ ĐƯỢC PHÁT BIỂU, chở đầy giả định: rằng kế hoạch ban đầu đúng, rằng "trễ" có cùng ý nghĩa cho mọi tính năng, rằng hạn nộp là cố định. Cả ba đều đáng kiểm trước khi bạn tối ưu bất cứ thứ gì.</li>
</ul>
<p class="meo">💡 Đếm: <strong>3 mục tiêu cho 4.2a</strong>, và slide tóm tắt 70 lặp lại đúng thứ tự đó. Một danh sách xuất hiện ở đầu mục rồi lại ở cuối mục thì chắc chắn vào đề.</p>`],

      [66, 'Question assumptions (Ennis, 2015)',
        `<p class="y-chinh">🎯 Two bullets, one quoted: <strong>"judge unstated assumptions"</strong> (Ennis, 2015), and <strong>assumptions lie at the heart of every problem, subject and academic field</strong>.</p>
<ul>
<li><strong>The key word is UNSTATED.</strong> A stated assumption is easy — it is written down and you can argue with it. The dangerous ones were never said, by anyone, and are therefore invisible until you deliberately hunt for them.</li>
<li><strong>"Judge", not "remove".</strong> Ennis says judge. Some assumptions are sound and should stay; the skill is deciding which. A student who throws out every assumption cannot start work at all.</li>
<li><strong>"Every problem, subject and academic field" — the claim is universal.</strong> Each discipline rests on assumptions it no longer notices: economics on rational actors, classical physics on continuous space, software estimation on the idea that effort is additive. Naming your field's assumptions is a mark of maturity in it.</li>
<li><strong>Ennis, 2015 is a critical-thinking reference.</strong> Judging unstated assumptions is one of the standard critical-thinking dispositions, which is why it heads section 4.2 rather than sitting in the creativity section.</li>
</ul>
<table>
<tr><th>Unstated assumption in "SWP391 is 2 weeks late"</th><th>How to test it</th><th>What you find</th></tr>
<tr><td>The original estimate was correct</td><td>Compare the estimate with actual hours on the two finished features</td><td>The estimate was 40% low from the start — the team is not late, the plan was wrong</td></tr>
<tr><td>All remaining features must ship</td><td>Ask the lecturer which features the rubric actually scores</td><td>Two of the five are optional extras worth no marks</td></tr>
<tr><td>Only the silent member can do his module</td><td>Check whether the interface is defined</td><td>It is — so another member can stub it and unblock three people today</td></tr>
</table>
<p class="dap-an">✅ Judging those three assumptions changes the problem from "work faster" to "cut two features and stub one interface" — a different problem with a much cheaper solution.</p>
<p class="meo">💡 Quotable for the exam: assumptions lie at the heart of <strong>every problem, subject and academic field</strong> — three nouns, and an option that shortens the list to just "every problem" is incomplete.</p>`,
        `<p class="y-chinh">🎯 Hai gạch đầu dòng, một cái là trích nguyên văn: <strong>"phán xét những giả định KHÔNG ĐƯỢC NÓI RA"</strong> (Ennis, 2015), và <strong>giả định nằm ở trung tâm của MỌI vấn đề, MỌI môn học và MỌI lĩnh vực học thuật</strong>.</p>
<ul>
<li><strong>Chữ then chốt là KHÔNG ĐƯỢC NÓI RA.</strong> Giả định đã được nói ra thì dễ — nó nằm trên giấy và bạn cãi lại được. Những cái nguy hiểm là những cái chưa ai từng nói, nên chúng vô hình cho tới khi bạn cố ý đi săn.</li>
<li><strong>"Phán xét", không phải "vứt bỏ".</strong> Ennis nói JUDGE. Có những giả định lành mạnh và nên giữ; kỹ năng nằm ở chỗ quyết định cái nào. Sinh viên vứt sạch mọi giả định thì không bắt đầu làm được việc gì.</li>
<li><strong>"Mọi vấn đề, môn học và lĩnh vực" — khẳng định mang tính phổ quát.</strong> Ngành nào cũng đứng trên những giả định nó đã thôi để ý: kinh tế học trên chủ thể duy lý, vật lý cổ điển trên không gian liên tục, ước lượng phần mềm trên ý nghĩ rằng công sức cộng được vào nhau. Gọi tên được giả định của ngành mình là dấu hiệu bạn đã trưởng thành trong ngành đó.</li>
<li><strong>Ennis, 2015 là nguồn về tư duy phản biện.</strong> Phán xét giả định ngầm là một trong những phẩm chất chuẩn của tư duy phản biện, và đó là lý do nó đứng ĐẦU mục 4.2 chứ không nằm trong mục sáng tạo.</li>
</ul>
<table>
<tr><th>Giả định ngầm trong câu "SWP391 trễ 2 tuần"</th><th>Kiểm bằng cách nào</th><th>Phát hiện ra gì</th></tr>
<tr><td>Ước lượng ban đầu là đúng</td><td>So ước lượng với số giờ thực tế của hai tính năng đã xong</td><td>Ước lượng thiếu 40% ngay từ đầu — nhóm không trễ, cái KẾ HOẠCH mới sai</td></tr>
<tr><td>Mọi tính năng còn lại đều buộc phải làm</td><td>Hỏi giảng viên xem thang chấm thật sự tính điểm tính năng nào</td><td>Hai trong năm cái là phần thêm không có điểm</td></tr>
<tr><td>Chỉ thành viên đang im mới làm được module của cậu ấy</td><td>Kiểm xem giao diện (interface) đã định nghĩa chưa</td><td>Đã định nghĩa rồi — nên người khác tạo bản giả được và gỡ nghẽn cho ba người ngay hôm nay</td></tr>
</table>
<p class="dap-an">✅ Phán xét ba giả định đó đổi bài toán từ "làm nhanh hơn" thành "cắt hai tính năng và tạo bản giả cho một giao diện" — một bài toán khác hẳn với lời giải rẻ hơn nhiều.</p>
<p class="meo">💡 Câu đáng thuộc để đi thi: giả định nằm ở trung tâm của <strong>mọi vấn đề, mọi môn học và mọi lĩnh vực học thuật</strong> — BA danh từ, và đáp án nào rút gọn danh sách còn mỗi "mọi vấn đề" là đáp án thiếu.</p>`],

      [67, 'Deductive reasoning (Kelley, 2013; LeBlanc, 1998)',
        `<p class="y-chinh">🎯 Two lines, and they are the whole definition: <strong>top-down reasoning</strong>, in which <strong>general premises lead to a specific conclusion</strong>. Cited (Kelley, 2013; LeBlanc, 1998).</p>
<ul>
<li><strong>Direction of travel: general → specific.</strong> You start from something already accepted as true and derive what must follow in your particular case. That is why it is called top-down.</li>
<li><strong>If the premises are true and the form is valid, the conclusion is guaranteed.</strong> This is the strength of deduction and the reason mathematics runs on it: the conclusion is not likely, it is certain — <em>conditional on the premises</em>.</li>
<li><strong>Its weakness is that it adds no new information.</strong> Deduction unpacks what was already contained in the premises. It cannot discover that a rule exists; it can only apply one.</li>
<li><strong>Worked example on the SWP391 problem.</strong> Premise 1 (general, from the course rules): any feature not merged by the freeze date is not graded. Premise 2 (specific): the payment module will not be merged by the freeze date. Conclusion (specific, certain): the payment module will not be graded. Therefore stop investing hours in it.</li>
<li><strong>Applied at FPTU.</strong> Every time you reason from a rubric, a specification, a standard or a theorem to your own case, you are reasoning deductively — and the quality of your answer depends entirely on whether you read the general rule correctly.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>De</strong>ductive = <strong>De</strong>scending, general at the top, specific at the bottom. Slide 68 is its mirror image.</p>
<p class="pitfall">⚠️ Both slides cite <strong>Kelley, 2013</strong>; only the deductive slide adds <strong>LeBlanc, 1998</strong>. That asymmetry is exactly the kind of detail a citation-matching question uses.</p>`,
        `<p class="y-chinh">🎯 Hai dòng, và đó là toàn bộ định nghĩa: <strong>suy luận TỪ TRÊN XUỐNG</strong>, trong đó <strong>các tiền đề TỔNG QUÁT dẫn tới một kết luận CỤ THỂ</strong>. Trích (Kelley, 2013; LeBlanc, 1998).</p>
<ul>
<li><strong>Chiều đi: tổng quát → cụ thể.</strong> Bạn xuất phát từ một thứ đã được chấp nhận là đúng rồi rút ra điều tất yếu phải xảy ra trong ca riêng của bạn. Vì thế mới gọi là từ trên xuống.</li>
<li><strong>Tiền đề đúng và hình thức hợp lệ thì kết luận được BẢO ĐẢM.</strong> Đây là sức mạnh của diễn dịch và là lý do toán học chạy bằng nó: kết luận không phải "có khả năng", mà là CHẮC CHẮN — <em>với điều kiện các tiền đề đúng</em>.</li>
<li><strong>Điểm yếu của nó là KHÔNG thêm thông tin mới.</strong> Diễn dịch chỉ mở gói những gì vốn đã nằm sẵn trong tiền đề. Nó không khám phá ra rằng có một quy luật; nó chỉ áp dụng được một quy luật đã có.</li>
<li><strong>Ví dụ chạy thật trên ca SWP391.</strong> Tiền đề 1 (tổng quát, lấy từ quy định môn): tính năng nào không merge trước ngày đóng băng mã thì không được chấm. Tiền đề 2 (cụ thể): module thanh toán sẽ không kịp merge trước ngày đó. Kết luận (cụ thể, chắc chắn): module thanh toán sẽ không được chấm. Vậy hãy NGỪNG đổ giờ vào nó.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mỗi lần bạn suy từ một thang chấm, một bản đặc tả, một tiêu chuẩn hay một định lý xuống ca của mình là bạn đang suy luận diễn dịch — và chất lượng câu trả lời phụ thuộc hoàn toàn vào chuyện bạn đọc đúng cái quy tắc tổng quát hay không.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>Diễn Dịch = Đi Xuống</strong>, tổng quát ở trên, cụ thể ở dưới. Slide 68 là ảnh soi gương của nó.</p>
<p class="pitfall">⚠️ Cả hai slide đều trích <strong>Kelley, 2013</strong>; chỉ riêng slide diễn dịch có thêm <strong>LeBlanc, 1998</strong>. Sự lệch đó đúng là loại chi tiết mà câu hỏi ghép trích dẫn hay dùng.</p>`],

      [68, 'Inductive reasoning (Kelley, 2013)',
        `<p class="y-chinh">🎯 The mirror of slide 67: <strong>bottom-up reasoning</strong>, in which <strong>specific observations lead to a more general truth</strong>. Cited (Kelley, 2013) only.</p>
<table>
<tr><th></th><th>Deductive (slide 67)</th><th>Inductive (slide 68)</th></tr>
<tr><td><strong>Direction</strong></td><td>Top-down</td><td>Bottom-up</td></tr>
<tr><td><strong>Starts from</strong></td><td>General premises</td><td>Specific observations</td></tr>
<tr><td><strong>Arrives at</strong></td><td>A specific conclusion</td><td>A more general truth</td></tr>
<tr><td><strong>Strength of the conclusion</strong></td><td>Certain, if premises are true</td><td>Probable — never proven</td></tr>
<tr><td><strong>Adds new knowledge?</strong></td><td>No — unpacks the premises</td><td>Yes — that is the point</td></tr>
<tr><td><strong>Citation on the slide</strong></td><td>Kelley, 2013; LeBlanc, 1998</td><td>Kelley, 2013</td></tr>
<tr><td><strong>SWP391 example</strong></td><td>Unmerged features are not graded → the payment module is not graded</td><td>Sprints 2, 3 and 4 all slipped when tasks exceeded one day → tasks over one day cause slippage in this team</td></tr>
</table>
<ul>
<li><strong>Induction is how every empirical claim in your degree is made.</strong> Testing, benchmarking, user studies, surveys: you observe some cases and generalise. That is also why every such claim carries a sample size and a caveat.</li>
<li><strong>The conclusion is "a more general truth", not a proven law.</strong> The slide's wording is careful. Ten green tests do not prove a function correct — the eleventh input can still break it, which is exactly why SWT301 teaches coverage rather than counting passes.</li>
<li><strong>Real problem-solving alternates between the two.</strong> Induce a rule from your observations, then deduce a prediction from that rule, then check the prediction. That loop is the scientific method compressed into two slides.</li>
<li><strong>Applied at FPTU.</strong> Induce from your three sprints that long tasks cause slippage; deduce that the four remaining long tasks will slip; act now by splitting them. Neither form of reasoning alone gets you to the action.</li>
</ul>
<p class="pitfall">⚠️ The classic exam swap: "specific → general" is <strong>inductive</strong>; "general → specific" is <strong>deductive</strong>. If you can only remember one, remember that deduction ends at the specific case.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương của slide 67: <strong>suy luận TỪ DƯỚI LÊN</strong>, trong đó <strong>các quan sát CỤ THỂ dẫn tới một chân lý TỔNG QUÁT hơn</strong>. Chỉ trích (Kelley, 2013).</p>
<table>
<tr><th></th><th>Diễn dịch (slide 67)</th><th>Quy nạp (slide 68)</th></tr>
<tr><td><strong>Chiều</strong></td><td>Từ trên xuống</td><td>Từ dưới lên</td></tr>
<tr><td><strong>Xuất phát từ</strong></td><td>Tiền đề tổng quát</td><td>Quan sát cụ thể</td></tr>
<tr><td><strong>Đi tới</strong></td><td>Một kết luận cụ thể</td><td>Một chân lý tổng quát hơn</td></tr>
<tr><td><strong>Độ mạnh của kết luận</strong></td><td>Chắc chắn, nếu tiền đề đúng</td><td>Chỉ là xác suất — không bao giờ được chứng minh</td></tr>
<tr><td><strong>Có thêm tri thức mới không?</strong></td><td>Không — chỉ mở gói tiền đề</td><td>CÓ — đó chính là mục đích</td></tr>
<tr><td><strong>Trích dẫn trên slide</strong></td><td>Kelley, 2013; LeBlanc, 1998</td><td>Kelley, 2013</td></tr>
<tr><td><strong>Ví dụ SWP391</strong></td><td>Tính năng chưa merge thì không chấm → module thanh toán không được chấm</td><td>Sprint 2, 3 và 4 đều trễ khi đầu việc vượt một ngày → đầu việc trên một ngày gây trễ ở nhóm này</td></tr>
</table>
<ul>
<li><strong>Quy nạp là cách mọi khẳng định thực nghiệm trong chương trình học của bạn được tạo ra.</strong> Kiểm thử, đo hiệu năng, nghiên cứu người dùng, khảo sát: bạn quan sát một số ca rồi khái quát lên. Cũng vì thế mọi khẳng định kiểu đó đều phải kèm cỡ mẫu và một câu dè dặt.</li>
<li><strong>Kết luận là "một chân lý tổng quát HƠN", không phải một định luật đã chứng minh.</strong> Chữ trên slide rất cẩn thận. Mười test xanh không chứng minh một hàm đúng — đầu vào thứ mười một vẫn có thể làm vỡ, và đó đúng là lý do SWT301 dạy độ bao phủ chứ không dạy đếm số test đạt.</li>
<li><strong>Giải quyết vấn đề thật là LUÂN PHIÊN giữa hai cái.</strong> Quy nạp ra một quy luật từ quan sát, rồi diễn dịch ra một dự đoán từ quy luật ấy, rồi kiểm dự đoán. Vòng lặp đó chính là phương pháp khoa học nén vào hai slide.</li>
<li><strong>Áp dụng ở FPTU.</strong> Quy nạp từ ba sprint rằng đầu việc dài gây trễ; diễn dịch rằng bốn đầu việc dài còn lại sẽ trễ; hành động ngay bằng cách chẻ nhỏ chúng. Một mình hình thức suy luận nào cũng không đưa bạn tới hành động.</li>
</ul>
<p class="pitfall">⚠️ Cú tráo kinh điển trong đề: "cụ thể → tổng quát" là <strong>QUY NẠP</strong>; "tổng quát → cụ thể" là <strong>DIỄN DỊCH</strong>. Nếu chỉ nhớ được một cái, hãy nhớ rằng diễn dịch KẾT THÚC ở ca cụ thể.</p>`],

      [69, 'Levels & Systems (Thomas & Lok, 2015)',
        `<p class="y-chinh">🎯 The third outcome of 4.2a, in two lines: <strong>think beyond the initial problem</strong>, and <strong>analyse systems rather than events</strong> (Thomas &amp; Lok, 2015).</p>
<table>
<tr><th>Level you look at</th><th>The question</th><th>SWP391, same facts read at each level</th><th>What you would do</th></tr>
<tr><td><strong>Event</strong></td><td>What happened?</td><td>Minh did not submit his module this week</td><td>Message Minh</td></tr>
<tr><td><strong>Pattern</strong></td><td>What keeps happening?</td><td>Someone has missed a handover in 3 of the last 4 sprints</td><td>Add a handover checkpoint</td></tr>
<tr><td><strong>Structure / system</strong></td><td>What arrangement makes this keep happening?</td><td>One person owns each module end to end, with no stub, no pairing and no review deadline</td><td>Change ownership rules — that is the fix that lasts</td></tr>
</table>
<ul>
<li><strong>"Events" are the cheapest and least useful level.</strong> They are what everyone sees and what every meeting talks about. Fixing at the event level produces a fix that lasts exactly one week, then the next event arrives.</li>
<li><strong>"Think beyond the initial problem" is permission to redefine the brief.</strong> The initial problem was handed to you already framed; the systems view asks what produced that framing. This is the same instinct as slide 66's unstated assumptions, applied to structure instead of belief.</li>
<li><strong>Levels also means zoom.</strong> The same delay can be examined at the level of one task, one person, one team, one course, or the whole curriculum. Each level supports different solutions, and choosing the wrong level is why some fixes never stick.</li>
<li><strong>Applied at FPTU.</strong> Blaming one teammate is event-level thinking and it is where most retrospectives stop. The system-level reading — single-owner modules with no stubs — explains every sprint including the good one, and it is a rule you can change in one meeting.</li>
</ul>
<p class="meo">💡 Exam phrasing to hold onto: <strong>"analyse systems rather than events"</strong>. If an option says "focus on the specific event that caused the delay", it is the distractor.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu thứ ba của 4.2a, gói trong hai dòng: <strong>nghĩ VƯỢT RA NGOÀI vấn đề ban đầu</strong>, và <strong>phân tích HỆ THỐNG thay vì phân tích SỰ KIỆN</strong> (Thomas &amp; Lok, 2015).</p>
<table>
<tr><th>Tầng bạn nhìn</th><th>Câu hỏi</th><th>SWP391 — cùng dữ kiện, đọc ở mỗi tầng</th><th>Bạn sẽ làm gì</th></tr>
<tr><td><strong>Sự kiện</strong></td><td>Chuyện gì đã xảy ra?</td><td>Tuần này Minh không nộp module</td><td>Nhắn tin cho Minh</td></tr>
<tr><td><strong>Quy luật lặp</strong></td><td>Chuyện gì CỨ xảy ra?</td><td>3 trong 4 sprint gần nhất đều có người lỡ một lần bàn giao</td><td>Thêm một mốc kiểm bàn giao</td></tr>
<tr><td><strong>Cấu trúc / hệ thống</strong></td><td>Cách sắp xếp nào khiến chuyện đó CỨ xảy ra?</td><td>Mỗi module do đúng một người ôm từ đầu tới cuối, không bản giả, không làm cặp, không hạn review</td><td>Đổi luật sở hữu module — đó mới là bản sửa sống lâu</td></tr>
</table>
<ul>
<li><strong>"Sự kiện" là tầng rẻ nhất và ít hữu dụng nhất.</strong> Đó là thứ ai cũng thấy và mọi cuộc họp đều bàn. Sửa ở tầng sự kiện cho ra một bản sửa sống đúng một tuần, rồi sự kiện tiếp theo ập tới.</li>
<li><strong>"Nghĩ vượt ra ngoài vấn đề ban đầu" là lời CẤP PHÉP định nghĩa lại đề bài.</strong> Vấn đề ban đầu được trao cho bạn ở dạng đã đóng khung sẵn; cái nhìn hệ thống hỏi cái gì đã sinh ra cái khung ấy. Đây cùng một bản năng với giả định ngầm ở slide 66, nhưng áp vào CẤU TRÚC thay vì vào niềm tin.</li>
<li><strong>"Tầng" còn có nghĩa là ĐỘ PHÓNG TO.</strong> Cùng một độ trễ có thể soi ở tầng một đầu việc, một con người, một nhóm, một môn học, hay cả chương trình đào tạo. Mỗi tầng chống đỡ cho những giải pháp khác nhau, và chọn sai tầng chính là lý do có những bản sửa không bao giờ dính.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đổ lỗi cho một thành viên là tư duy tầng sự kiện, và phần lớn buổi retrospective dừng đúng ở đó. Cách đọc tầng hệ thống — module một chủ, không bản giả — giải thích được MỌI sprint kể cả sprint tốt, và đó là một luật bạn đổi được trong một buổi họp.</li>
</ul>
<p class="meo">💡 Câu chữ đáng giữ để đi thi: <strong>"analyse systems rather than events"</strong>. Đáp án nào nói "tập trung vào sự kiện cụ thể đã gây ra độ trễ" thì đó là đáp án nhiễu.</p>`],

      [70, 'Summary: Applying forms of reasoning and thinking',
        `<p class="y-chinh">🎯 A pure recall slide closing section 4.2a, repeating the three outcomes in the same order they were introduced: <strong>question assumptions</strong> · <strong>use deductive and inductive reasoning</strong> · <strong>think in terms of levels and systems, not events</strong>.</p>
<table>
<tr><th>#</th><th>Summary line (the slide's wording)</th><th>Detail slide</th><th>Key source</th></tr>
<tr><td>1</td><td>Question assumptions</td><td>66</td><td>Ennis, 2015</td></tr>
<tr><td>2</td><td>Use deductive and inductive reasoning</td><td>67, 68</td><td>Kelley, 2013; LeBlanc, 1998</td></tr>
<tr><td>3</td><td>Think in terms of levels and systems, not events</td><td>69</td><td>Thomas &amp; Lok, 2015</td></tr>
</table>
<ul>
<li><strong>Note the wording change between slide 65 and slide 70.</strong> The opener said "consider different levels and systems"; the summary says "think in terms of levels and systems, <em>not events</em>". The summary adds the contrast. That is a genuine sharpening, not a slip — and the "not events" half is the examinable part.</li>
<li><strong>Order is preserved between opener and summary.</strong> 65 gave assumptions → levels/systems → induction/deduction; 70 gives assumptions → deduction/induction → levels/systems. The <em>set</em> is identical; the middle two swap places. Learn the set of three, not the order.</li>
<li><strong>Three items, and the third is the one with a negation in it.</strong> Negations are what multiple-choice questions attack, so keep "not events" attached to item three.</li>
<li><strong>How to revise from this slide.</strong> Cover the table's right-hand columns and reconstruct: which slide, which author. If you can do that for all three lines, section 4.2a is finished.</li>
</ul>
<p class="meo">💡 Compact hook for the whole section: <strong>ASSUME? · DEDUCE/INDUCE · SYSTEMS NOT EVENTS</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide THUẦN ÔN LẠI, khép mục 4.2a, lặp lại ba mục tiêu đúng thứ tự đã giới thiệu: <strong>chất vấn giả định</strong> · <strong>dùng suy luận diễn dịch và quy nạp</strong> · <strong>nghĩ theo tầng và hệ thống, KHÔNG theo sự kiện</strong>.</p>
<table>
<tr><th>#</th><th>Dòng tóm tắt (chữ của slide)</th><th>Slide chi tiết</th><th>Nguồn chính</th></tr>
<tr><td>1</td><td>Question assumptions</td><td>66</td><td>Ennis, 2015</td></tr>
<tr><td>2</td><td>Use deductive and inductive reasoning</td><td>67, 68</td><td>Kelley, 2013; LeBlanc, 1998</td></tr>
<tr><td>3</td><td>Think in terms of levels and systems, not events</td><td>69</td><td>Thomas &amp; Lok, 2015</td></tr>
</table>
<ul>
<li><strong>Để ý chữ ĐỔI giữa slide 65 và slide 70.</strong> Slide mở đầu viết "consider different levels and systems"; slide tóm tắt viết "think in terms of levels and systems, <em>not events</em>". Bản tóm tắt THÊM vế đối lập. Đó là một sự mài sắc thật sự chứ không phải lỡ tay — và nửa "not events" mới là phần vào đề.</li>
<li><strong>Thứ tự giữa slide mở và slide tóm có xê dịch.</strong> Slide 65 cho: giả định → tầng/hệ thống → quy nạp/diễn dịch; slide 70 cho: giả định → diễn dịch/quy nạp → tầng/hệ thống. TẬP HỢP thì y hệt; hai mục giữa đổi chỗ cho nhau. Hãy thuộc TẬP BA MỤC, đừng thuộc thứ tự.</li>
<li><strong>Ba mục, và mục thứ ba là mục có phủ định trong đó.</strong> Phủ định là thứ câu trắc nghiệm hay đánh vào, nên hãy dính chặt chữ "không theo sự kiện" vào mục ba.</li>
<li><strong>Ôn từ slide này thế nào.</strong> Che hai cột bên phải của bảng rồi dựng lại: slide nào, tác giả nào. Làm được cho cả ba dòng là xong mục 4.2a.</li>
</ul>
<p class="meo">💡 Mẹo gọn cho cả mục: <strong>GIẢ ĐỊNH? · DIỄN DỊCH/QUY NẠP · HỆ THỐNG CHỨ KHÔNG SỰ KIỆN</strong>.</p>`],

      [71, '4.2c Questioning Assumptions: The Nine Dot Problem (different template)',
        `<p class="y-chinh">🎯 A section opener with <strong>two outcomes</strong>: <strong>question the assumptions that underlie stated problems</strong>, and <strong>apply questioning assumptions to see how it can solve a problem</strong>. The first bullet is repeated word for word from slide 65; the second is new — this section is where the technique gets <em>used</em>.</p>
<ul>
<li><strong>The numbering jumps: 4.2a (slide 65) → 4.2c (this slide).</strong> There is no 4.2b opener anywhere in slides 52–76. Don't invent one; note the gap and move on.</li>
<li><strong>This slide uses the same non-standard template as slide 59.</strong> No Sydney shield, a thin rule at the far left, and a footer reading "…niversity of Sydney" with "Page 1". Both inserted slides happen to be the practical, apply-it openers.</li>
<li><strong>The Nine Dot Problem is the canonical assumption puzzle.</strong> Nine dots in a 3 by 3 grid. Join all nine using four straight lines, drawn without lifting the pen and without retracing. Almost everybody fails, and everybody fails for the same reason.</li>
</ul>
<p class="dap-an">✅ Answer. Label the dots by column and row, with (1,1) at top-left and (3,3) at bottom-right. Line 1: start at (1,1), go through (2,1) and (3,1) and <strong>keep going</strong> to an empty point level with the top row, call it (5,1). Line 2: from there go diagonally down-left through (3,2) and (2,3), continuing to (1,4) — again outside the grid. Line 3: go straight up the left column through (1,3), (1,2), (1,1)… in the standard version, line 3 runs up from (1,4) through (1,3) and (1,2) to (1,1); line 4 then runs diagonally down-right through (2,2) and (3,3). All nine dots are covered by four lines. The solution <strong>only exists outside the square</strong>.</p>
<table>
<tr><th>Unstated assumption</th><th>Was it in the instructions?</th><th>Effect</th></tr>
<tr><td>The lines must stay inside the square formed by the dots</td><td><strong>No</strong> — nobody ever said it</td><td>This single invented rule makes the puzzle impossible</td></tr>
<tr><td>Lines must start and end on a dot</td><td>No</td><td>Blocks the overshoot that the solution needs</td></tr>
<tr><td>Each line must cover exactly three dots</td><td>No</td><td>The real solution has lines covering three, three, three and three — but only because of the overshoot, not by design</td></tr>
</table>
<ul>
<li><strong>The lesson, stated exactly.</strong> The puzzle is not hard; the self-imposed boundary is. This is where the English phrase "think outside the box" comes from — literally this box.</li>
<li><strong>Applied at FPTU.</strong> "Finish all five features in two weeks" is your nine-dot square. Nobody said you may not cut scope, negotiate the rubric, stub an interface, or pair on the blocked module. Draw the line outside the square first, then check whether the rules actually forbid it — usually they do not.</li>
</ul>
<p class="pitfall">⚠️ Careful with the outcome wording: 4.2c is about <strong>applying</strong> assumption-questioning to solve a problem. 4.2a was about <strong>identifying</strong> assumptions. Same technique, different verb, different section.</p>`,
        `<p class="y-chinh">🎯 Slide mở mục, với <strong>HAI mục tiêu</strong>: <strong>chất vấn các giả định nằm dưới những vấn đề được phát biểu ra</strong>, và <strong>ÁP DỤNG việc chất vấn giả định để thấy nó giải được vấn đề ra sao</strong>. Gạch đầu dòng thứ nhất lặp nguyên văn slide 65; cái thứ hai mới — mục này là chỗ kỹ thuật ấy được ĐEM RA DÙNG.</p>
<ul>
<li><strong>Số hiệu NHẢY: 4.2a (slide 65) → 4.2c (slide này).</strong> Không có slide mở đầu 4.2b nào trong cả dải 52–76. Đừng bịa ra; ghi nhận khoảng trống rồi đi tiếp.</li>
<li><strong>Slide này dùng đúng cái template bất thường của slide 59.</strong> Không khiên Sydney, một vạch mảnh sát mép trái, chân trang ghi "…niversity of Sydney" và "Page 1". Hai slide chèn thêm đều tình cờ là hai slide mở đầu phần THỰC HÀNH.</li>
<li><strong>Bài Chín Chấm là bài toán giả định kinh điển.</strong> Chín chấm xếp lưới 3 hàng 3 cột. Hãy nối cả chín chấm bằng BỐN đoạn thẳng, vẽ liền tay không nhấc bút và không vẽ đè lại. Gần như ai cũng thất bại, và ai cũng thất bại vì CÙNG một lý do.</li>
</ul>
<p class="dap-an">✅ Đáp án. Đánh dấu chấm theo (cột, hàng), (1,1) ở góc trên trái và (3,3) ở góc dưới phải. Đoạn 1: bắt đầu ở (1,1), đi qua (2,1), (3,1) rồi <strong>ĐI TIẾP</strong> tới một điểm trống ngang hàng trên, gọi là (5,1). Đoạn 2: từ đó đi chéo xuống trái qua (3,2) và (2,3), rồi đi tiếp tới (1,4) — lại nằm NGOÀI lưới. Đoạn 3: từ (1,4) đi thẳng lên cột trái qua (1,3), (1,2) tới (1,1). Đoạn 4: từ (1,1) đi chéo xuống phải qua (2,2) và (3,3). Cả chín chấm được phủ bằng bốn đoạn. Lời giải <strong>CHỈ tồn tại ở bên ngoài hình vuông</strong>.</p>
<table>
<tr><th>Giả định ngầm</th><th>Đề bài có nói không?</th><th>Hậu quả</th></tr>
<tr><td>Các đoạn thẳng phải nằm TRONG hình vuông do chín chấm tạo ra</td><td><strong>KHÔNG</strong> — chưa ai từng nói thế</td><td>Đúng một luật tự bịa này làm bài toán thành vô nghiệm</td></tr>
<tr><td>Đoạn thẳng phải bắt đầu và kết thúc trên một cái chấm</td><td>Không</td><td>Chặn mất cú vẽ lố ra ngoài mà lời giải cần</td></tr>
<tr><td>Mỗi đoạn phải phủ đúng ba chấm</td><td>Không</td><td>Lời giải thật có các đoạn phủ ba, ba, ba và ba chấm — nhưng nhờ vẽ lố ra ngoài, chứ không phải do thiết kế</td></tr>
</table>
<ul>
<li><strong>Bài học, nói cho chính xác.</strong> Bài toán không khó; cái ranh giới TỰ ÁP ĐẶT mới khó. Đây chính là gốc của thành ngữ tiếng Anh "think outside the box" — đúng nghĩa đen cái hộp này.</li>
<li><strong>Áp dụng ở FPTU.</strong> "Làm xong cả năm tính năng trong hai tuần" chính là hình vuông chín chấm của bạn. Chưa ai nói bạn không được cắt phạm vi, không được thương lượng thang chấm, không được tạo bản giả cho một giao diện, không được ghép cặp làm module đang nghẽn. Cứ vẽ đường ra ngoài hình vuông trước, rồi mới kiểm xem quy định có thật sự cấm không — thường là không.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận với chữ trong mục tiêu: 4.2c nói về <strong>ÁP DỤNG</strong> việc chất vấn giả định để giải vấn đề. 4.2a nói về <strong>NHẬN DIỆN</strong> giả định. Cùng kỹ thuật, khác động từ, khác mục.</p>`],

      [72, '4.3a Using Creative Strategies (learning outcomes)',
        `<p class="y-chinh">🎯 The final section of this range opens with <strong>three outcomes</strong>: <strong>use lateral thinking techniques to solve problems</strong> · <strong>apply negative brainstorming techniques</strong> · <strong>generate solutions to problems using unconventional &amp; alternative approaches</strong>.</p>
<table>
<tr><th>Outcome</th><th>The named technique that delivers it</th><th>Slide</th></tr>
<tr><td><strong>Lateral thinking techniques</strong></td><td><strong>Random Juxtaposition</strong> — a random dictionary word applied to your problem</td><td>75</td></tr>
<tr><td><strong>Negative brainstorming</strong></td><td><strong>The Intermediate Impossible</strong> — the slide says so in its first line</td><td>76</td></tr>
<tr><td><strong>Unconventional &amp; alternative approaches</strong></td><td>Both of the above, plus the argument that creativity belongs in academic work</td><td>73, 74</td></tr>
</table>
<ul>
<li><strong>The second outcome and slide 76 are the same thing under two names.</strong> "Negative brainstorming" is the generic label; "The Intermediate Impossible" is de Bono's name for it. Learn the pair — a question can give you either name and expect the other.</li>
<li><strong>"Lateral thinking" is a technical term, not a compliment.</strong> De Bono coined it for deliberately moving sideways out of an established line of thought, as opposed to vertical thinking, which digs the existing line deeper. The strategies here are ways of forcing that sideways move.</li>
<li><strong>Creativity here is a procedure, not a talent.</strong> That is the MOOC's whole position in this section: you do not wait to feel inspired, you run a technique. Both named strategies are mechanical enough to do on demand.</li>
<li><strong>Applied at FPTU.</strong> When the SWP391 team has been circling the same three options for a week, section 4.3a says stop arguing and run a technique for ten minutes. Slides 75 and 76 give you two you can run immediately.</li>
</ul>
<p class="meo">💡 Count: <strong>3 outcomes for 4.3a</strong>, and <strong>2 named strategies</strong> in this range (Random Juxtaposition, The Intermediate Impossible). Keep the two numbers separate.</p>`,
        `<p class="y-chinh">🎯 Mục cuối của dải này mở đầu với <strong>BA mục tiêu</strong>: <strong>dùng các kỹ thuật tư duy PHI TUYẾN (lateral thinking) để giải quyết vấn đề</strong> · <strong>áp dụng kỹ thuật động não NGƯỢC (negative brainstorming)</strong> · <strong>sinh ra giải pháp bằng những cách tiếp cận KHÁC THƯỜNG &amp; thay thế</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Kỹ thuật có tên thực hiện nó</th><th>Slide</th></tr>
<tr><td><strong>Kỹ thuật tư duy phi tuyến</strong></td><td><strong>Random Juxtaposition</strong> — lấy một từ ngẫu nhiên trong từ điển áp vào vấn đề</td><td>75</td></tr>
<tr><td><strong>Động não ngược</strong></td><td><strong>The Intermediate Impossible</strong> — chính slide nói vậy ngay dòng đầu</td><td>76</td></tr>
<tr><td><strong>Cách tiếp cận khác thường &amp; thay thế</strong></td><td>Cả hai cái trên, cộng với lập luận rằng sáng tạo thuộc về công việc học thuật</td><td>73, 74</td></tr>
</table>
<ul>
<li><strong>Mục tiêu thứ hai và slide 76 là CÙNG MỘT THỨ mang hai tên.</strong> "Negative brainstorming" là nhãn chung; "The Intermediate Impossible" là tên de Bono đặt cho nó. Hãy học thành CẶP — đề có thể cho bạn tên này và đòi tên kia.</li>
<li><strong>"Lateral thinking" là thuật ngữ kỹ thuật, không phải lời khen.</strong> De Bono đặt ra nó để chỉ việc cố ý dịch NGANG ra khỏi một mạch nghĩ đã thành nếp, đối lập với tư duy dọc — thứ chỉ đào sâu thêm cái mạch sẵn có. Các chiến lược ở đây là cách ÉP cú dịch ngang đó xảy ra.</li>
<li><strong>Sáng tạo ở đây là một QUY TRÌNH, không phải năng khiếu.</strong> Đó là toàn bộ lập trường của MOOC trong mục này: bạn không ngồi chờ cảm hứng, bạn CHẠY một kỹ thuật. Cả hai chiến lược có tên đều đủ máy móc để làm theo yêu cầu.</li>
<li><strong>Áp dụng ở FPTU.</strong> Khi nhóm SWP391 đã xoay quanh đúng ba phương án suốt một tuần, mục 4.3a nói: thôi cãi nhau, chạy một kỹ thuật trong mười phút. Slide 75 và 76 đưa cho bạn hai cái chạy được ngay.</li>
</ul>
<p class="meo">💡 Đếm: <strong>3 mục tiêu cho 4.3a</strong>, và <strong>2 chiến lược có tên</strong> trong dải này (Random Juxtaposition, The Intermediate Impossible). Giữ hai con số này tách bạch.</p>`],

      [73, '(untitled) Universities create knowledge — the critical/creative distinction is false (Manuel, 2009)',
        `<p class="y-chinh">🎯 <strong>This slide carries no title</strong> — only three body bullets: <strong>universities are places where knowledge is created and shared</strong> · a quote that <strong>"[The] distinction between the [critical and creative]… is a false one, since … to imagine, express, shape or produce something 'new', relies on creativity and often, on collaboration"</strong> (Manuel, 2009, p.69) · <strong>creativity forms an integral part of academic culture</strong>.</p>
<ul>
<li><strong>The slide is arguing against a belief most students hold.</strong> University work feels like it rewards critical analysis and treats creativity as decoration. Manuel's claim is that the split is <em>false</em>: producing anything new is a creative act, and analysis alone produces nothing new.</li>
<li><strong>"Created AND shared" — two verbs.</strong> Creation is only half a university's job; sharing (publishing, teaching, citing) is the other half. This is the same logic that made plagiarism and referencing so heavy in Mooc 1 — sharing only works if attribution works.</li>
<li><strong>"and often, on collaboration" ties this section back to 4.1.</strong> Manuel puts creativity and collaboration in one sentence, which is why slides 60–64 came before this one.</li>
<li><strong>"Integral part" is a strong phrase.</strong> Not "a useful addition", not "welcome where appropriate" — integral, meaning the academic culture does not work without it. Expect that adjective in an answer option.</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 report is graded on analysis, but the design decisions it reports were creative acts. Say so explicitly — describe the alternatives you generated and why you rejected them. That is the section where creativity becomes visible to a grader.</li>
</ul>
<p class="pitfall">⚠️ Two slides in this range (73 and 74) have <strong>no heading at all</strong> — they are body-only slides. The titles used here were written for navigation, not copied from the deck; do not quote them as slide titles.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide này KHÔNG có tiêu đề</strong> — chỉ có ba gạch đầu dòng: <strong>đại học là nơi tri thức được TẠO RA và CHIA SẺ</strong> · một câu trích <strong>"[Sự] phân biệt giữa [phản biện và sáng tạo]… là một phân biệt SAI, bởi lẽ … việc hình dung, diễn đạt, định hình hay tạo ra một thứ 'mới' đều dựa vào sáng tạo và thường là vào cộng tác"</strong> (Manuel, 2009, tr.69) · <strong>sáng tạo là một phần KHÔNG THỂ TÁCH RỜI của văn hoá học thuật</strong>.</p>
<ul>
<li><strong>Slide đang cãi lại một niềm tin phần lớn sinh viên đang giữ.</strong> Việc học ở đại học có cảm giác chỉ thưởng cho phân tích phản biện, còn sáng tạo bị coi là đồ trang trí. Khẳng định của Manuel là sự chia đôi đó <em>SAI</em>: tạo ra bất cứ cái gì mới đều là hành vi sáng tạo, và một mình phân tích thì không sinh ra cái mới nào.</li>
<li><strong>"Created AND shared" — HAI động từ.</strong> Tạo ra mới chỉ là một nửa việc của đại học; chia sẻ (công bố, giảng dạy, trích dẫn) là nửa kia. Đây cùng một logic đã làm phần đạo văn và trích dẫn nặng đến thế ở Mooc 1 — chia sẻ chỉ chạy được nếu việc ghi công chạy được.</li>
<li><strong>"and often, on collaboration" nối mục này ngược về 4.1.</strong> Manuel đặt sáng tạo và cộng tác trong cùng một câu, và đó là lý do slide 60–64 đứng trước slide này.</li>
<li><strong>"Integral part" là cụm rất mạnh.</strong> Không phải "một bổ sung hữu ích", không phải "được hoan nghênh khi phù hợp" — mà là KHÔNG THỂ TÁCH RỜI, nghĩa là văn hoá học thuật không vận hành được nếu thiếu nó. Hãy chờ tính từ đó xuất hiện trong một đáp án.</li>
<li><strong>Áp dụng ở FPTU.</strong> Báo cáo SWP391 của bạn được chấm theo phân tích, nhưng những quyết định thiết kế nó kể lại đều là hành vi sáng tạo. Hãy nói thẳng ra — mô tả các phương án bạn đã nghĩ ra và vì sao loại chúng. Đó chính là phần làm cho sáng tạo trở nên NHÌN THẤY ĐƯỢC với người chấm.</li>
</ul>
<p class="pitfall">⚠️ Hai slide trong dải này (73 và 74) <strong>hoàn toàn không có tiêu đề</strong> — chúng chỉ có phần thân. Tiêu đề dùng ở đây là do người soạn đặt để tra cứu, không chép từ slide; đừng trích chúng như tiêu đề slide.</p>`],

      [74, '(untitled) Full-page quote: creative scientists begin with imagery, metaphor and hunches (Bargar & Duncan, 1982, cited in Cryer, 2006)',
        `<p class="y-chinh">🎯 A <strong>full-page quotation slide</strong> with no heading: <em>"If we look carefully at how creative, eminent scientists describe their own work, we find [a world] which uses logical analysis as a critical tool in the refinement of ideas, but which often begins in a very different place, where imagery, metaphor, analogy, intuitive hunches, kinesthetic feeling states, and even dreams or dream-like states are prepotent"</em> (Bargar &amp; Duncan, 1982, p.2 cited in Cryer, 2006, p.204).</p>
<ul>
<li><strong>The argument in one line: logic refines ideas, it does not originate them.</strong> "Uses logical analysis as a critical tool in the <em>refinement</em> of ideas, but… <em>begins</em> in a very different place." Two stages, two different faculties, and students routinely try to do both with logic alone.</li>
<li><strong>Six sources of the beginning are listed.</strong> Imagery · metaphor · analogy · intuitive hunches · kinesthetic feeling states · dreams or dream-like states. Note that <em>analogy</em> is on this list and was also outcome three of section 3.4a — the MOOC is threading one idea through two sections.</li>
<li><strong>"Prepotent" means dominant, taking precedence.</strong> The claim is not that hunches are pleasant extras; it is that at the origin of the work they are the <em>leading</em> mode. Do not soften that word when you revise.</li>
<li><strong>This is a secondary citation, and it is set out correctly.</strong> "Bargar &amp; Duncan, 1982, p.2 cited in Cryer, 2006, p.204" — you read Cryer, who quoted Bargar &amp; Duncan. Mooc 1's referencing rules say you must show that chain rather than pretend you read the 1982 original. This slide is a live example of the rule.</li>
<li><strong>Applied at FPTU.</strong> Permission, from eminent scientists, to start an assignment with a rough sketch, a metaphor, or a gut feeling about the architecture — and then to submit only after logical analysis has refined it. The mistake is trying to be rigorous at minute one, which produces nothing to be rigorous about.</li>
</ul>
<p class="meo">💡 Exam-friendly compression: <strong>creativity STARTS the work, logic REFINES it</strong> — and the page detail to remember is that the quote reaches you <em>cited in</em> Cryer, 2006, p.204, one page before the p.205 quote on slide 63.</p>`,
        `<p class="y-chinh">🎯 Một <strong>slide TRÍCH DẪN toàn trang</strong>, không có tiêu đề: <em>"Nếu ta nhìn kỹ cách các nhà khoa học lỗi lạc và giàu sáng tạo mô tả công việc của chính họ, ta thấy [một thế giới] dùng phân tích logic như một công cụ phản biện để TINH CHỈNH ý tưởng, nhưng lại thường BẮT ĐẦU ở một nơi rất khác, nơi hình ảnh, ẩn dụ, loại suy, linh cảm trực giác, các trạng thái cảm nhận cơ thể, và thậm chí cả giấc mơ hay trạng thái nửa mơ mới là thứ chiếm ưu thế"</em> (Bargar &amp; Duncan, 1982, tr.2, dẫn theo Cryer, 2006, tr.204).</p>
<ul>
<li><strong>Lập luận gói trong một dòng: logic TINH CHỈNH ý tưởng, nó không SINH RA ý tưởng.</strong> "Dùng phân tích logic như công cụ phản biện trong việc <em>tinh chỉnh</em> ý tưởng, nhưng… <em>bắt đầu</em> ở một nơi rất khác." Hai giai đoạn, hai năng lực khác nhau, mà sinh viên thì thường xuyên cố làm cả hai bằng mỗi logic.</li>
<li><strong>Có SÁU nguồn của giai đoạn khởi đầu được liệt kê.</strong> Hình ảnh · ẩn dụ · loại suy · linh cảm trực giác · trạng thái cảm nhận cơ thể · giấc mơ hoặc trạng thái nửa mơ. Để ý <em>loại suy</em> nằm trong danh sách này, mà nó cũng là mục tiêu thứ ba của mục 3.4a — MOOC đang xâu một ý xuyên qua hai mục.</li>
<li><strong>"Prepotent" nghĩa là CHIẾM ƯU THẾ, giành phần lấn át.</strong> Khẳng định không phải "linh cảm là món phụ dễ chịu"; nó nói rằng ở điểm KHỞI ĐẦU của công việc, đó mới là phương thức DẪN ĐẦU. Đừng làm nhẹ chữ đó khi ôn.</li>
<li><strong>Đây là một TRÍCH DẪN THỨ CẤP, và nó được viết đúng chuẩn.</strong> "Bargar &amp; Duncan, 1982, tr.2 dẫn theo Cryer, 2006, tr.204" — bạn đọc Cryer, mà Cryer trích Bargar &amp; Duncan. Quy tắc trích dẫn của Mooc 1 buộc bạn phơi ra chuỗi đó chứ không được giả vờ đã đọc bản gốc năm 1982. Slide này là ví dụ SỐNG của quy tắc ấy.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đây là lời cho phép — từ chính các nhà khoa học lỗi lạc — được bắt đầu một bài tập bằng một bản phác thô, một ẩn dụ, hay một cảm giác về kiến trúc; rồi chỉ nộp sau khi phân tích logic đã tinh chỉnh nó. Sai lầm là cố chặt chẽ ngay từ phút thứ nhất, để rồi chẳng có gì để mà chặt chẽ.</li>
</ul>
<p class="meo">💡 Bản nén dễ đi thi: <strong>sáng tạo KHỞI ĐỘNG công việc, logic TINH CHỈNH nó</strong> — và chi tiết trang cần nhớ là câu trích tới tay bạn <em>dẫn theo</em> Cryer, 2006, tr.204, đúng một trang trước câu trích tr.205 ở slide 63.</p>`],

      [75, 'Creative Strategy: Random Juxtaposition (de Bono, 1973)',
        `<p class="y-chinh">🎯 The first named strategy, in three lines: <strong>pick a random word from the dictionary and apply it to your topic or problem</strong> · <strong>the more different, the better!</strong> · and de Bono's reason: <strong>"If you look at a situation only from within your established way of looking at it, no amount of will power is going to take you to a new way of looking at it"</strong> (de Bono, 1973, p.100).</p>
<ul>
<li><strong>"The more different, the better" is the counter-intuitive instruction.</strong> Most people, asked for a random word, choose something vaguely related — and a related word keeps you inside the same frame. The word must be genuinely unconnected or the technique does nothing.</li>
<li><strong>The quote explains WHY a random input is needed.</strong> Effort cannot move you out of an established frame, because the effort is itself applied inside the frame. Only something external can force the jump — which is what the dictionary word is for.</li>
<li><strong>Randomness is the point, so do not curate.</strong> Open a dictionary and take the first noun, or use a random word generator. Rejecting words until one "feels useful" reintroduces exactly the frame you were escaping.</li>
</ul>
<p class="dap-an">✅ Worked run on the SWP391 delay. Random word: <strong>"umbrella"</strong>.</p>
<table>
<tr><th>Property of an umbrella</th><th>Forced connection to the problem</th><th>Usable idea</th></tr>
<tr><td>You carry it before it rains</td><td>We only react after a task is late</td><td>Add an early-warning rule: any task with no commit for 48 hours is flagged automatically</td></tr>
<tr><td>It is shared — two people under one</td><td>Each module has exactly one owner</td><td>Pair on the blocked module for two days; ownership becomes shared, not transferred</td></tr>
<tr><td>It folds away when not needed</td><td>Our process is the same weight every week</td><td>Run full ceremonies in the first week of a sprint and a 10-minute version in the second</td></tr>
<tr><td>It fails in strong wind</td><td>Our plan has no failure mode</td><td>Decide NOW which two features get cut if we are still behind on Friday</td></tr>
</table>
<p class="dap-an">✅ Four ideas in five minutes, and none of them was on the team's list before. That is what the technique is for — quantity of unusual starting points, which you then judge normally.</p>
<p class="meo">💡 Keep the two halves together: the <strong>technique</strong> is a random dictionary word; the <strong>justification</strong> is that will power cannot escape an established way of looking (de Bono, 1973, p.100).</p>`,
        `<p class="y-chinh">🎯 Chiến lược có tên thứ nhất, gói trong ba dòng: <strong>lấy một từ NGẪU NHIÊN trong từ điển và áp nó vào chủ đề hoặc vấn đề của bạn</strong> · <strong>càng khác biệt càng tốt!</strong> · và lý do của de Bono: <strong>"Nếu bạn chỉ nhìn một tình huống từ bên trong lối nhìn đã thành nếp của mình, thì bao nhiêu ý chí cũng không đưa bạn tới được một lối nhìn mới"</strong> (de Bono, 1973, tr.100).</p>
<ul>
<li><strong>"Càng khác biệt càng tốt" là chỉ dẫn ngược với trực giác.</strong> Phần lớn người ta khi được bảo chọn một từ ngẫu nhiên lại chọn thứ liên quan mang máng — mà từ liên quan thì giữ bạn nguyên trong cái khung cũ. Từ đó phải THẬT SỰ không dính dáng, không thì kỹ thuật này chẳng làm được gì.</li>
<li><strong>Câu trích giải thích VÌ SAO cần một đầu vào ngẫu nhiên.</strong> Nỗ lực không kéo bạn ra khỏi khung được, vì chính nỗ lực ấy đang được vận dụng BÊN TRONG cái khung. Chỉ thứ gì đó từ bên ngoài mới ép được cú nhảy — và cái từ trong từ điển sinh ra để làm đúng việc đó.</li>
<li><strong>Ngẫu nhiên chính là điểm mấu chốt, nên đừng lựa chọn.</strong> Mở từ điển lấy danh từ đầu tiên, hoặc dùng công cụ sinh từ ngẫu nhiên. Cứ loại từ này từ kia tới khi gặp một từ "trông có vẻ dùng được" là bạn đã rước lại đúng cái khung vừa định thoát ra.</li>
</ul>
<p class="dap-an">✅ Chạy thật trên độ trễ SWP391. Từ ngẫu nhiên: <strong>"cái ô"</strong>.</p>
<table>
<tr><th>Tính chất của cái ô</th><th>Nối ép vào vấn đề</th><th>Ý tưởng dùng được</th></tr>
<tr><td>Ta cầm nó TRƯỚC khi trời mưa</td><td>Nhóm chỉ phản ứng SAU khi đầu việc đã trễ</td><td>Thêm luật cảnh báo sớm: đầu việc nào không có commit trong 48 giờ thì tự động bị gắn cờ</td></tr>
<tr><td>Nó dùng chung — hai người chung một cái</td><td>Mỗi module có đúng MỘT chủ</td><td>Ghép cặp làm module đang nghẽn trong hai ngày; quyền sở hữu thành dùng chung, không phải bị chuyển giao</td></tr>
<tr><td>Nó gập lại được khi không cần</td><td>Quy trình của nhóm nặng y như nhau mọi tuần</td><td>Chạy đủ nghi thức ở tuần đầu sprint, tuần sau chỉ chạy bản 10 phút</td></tr>
<tr><td>Nó hỏng khi gió mạnh</td><td>Kế hoạch của nhóm không có phương án cho lúc hỏng</td><td>Quyết NGAY BÂY GIỜ hai tính năng nào sẽ bị cắt nếu thứ Sáu vẫn còn trễ</td></tr>
</table>
<p class="dap-an">✅ Bốn ý tưởng trong năm phút, và không ý nào từng nằm trong danh sách của nhóm. Đó đúng là công dụng của kỹ thuật này — sinh ra SỐ LƯỢNG điểm xuất phát lạ, rồi bạn phán xét chúng một cách bình thường.</p>
<p class="meo">💡 Giữ hai nửa đi cùng nhau: <strong>KỸ THUẬT</strong> là một từ ngẫu nhiên trong từ điển; <strong>LÝ DO</strong> là ý chí không thoát nổi một lối nhìn đã thành nếp (de Bono, 1973, tr.100).</p>`],

      [76, 'Creative Strategy: The Intermediate Impossible (de Bono, 1973)',
        `<p class="y-chinh">🎯 The second named strategy, with <strong>five bullets</strong>: <strong>sometimes called negative brainstorming</strong> · <strong>taking a solution or idea you know is wrong and looking for the positives</strong> · <strong>wrong ideas can be stepping stones that lead to better ones</strong> · <strong>points out assumptions</strong> · <strong>helps in understanding the problem</strong> (de Bono, 1973).</p>
<table>
<tr><th>Bullet</th><th>What it claims</th><th>Why it works</th></tr>
<tr><td><strong>Also called negative brainstorming</strong></td><td>Two names, one technique</td><td>This is the term used in outcome 2 on slide 72 — learn the pair</td></tr>
<tr><td><strong>Take a wrong idea, look for positives</strong></td><td>The method itself, in one line</td><td>Suspending judgement for two minutes is what lets an idea be examined at all</td></tr>
<tr><td><strong>Stepping stones to better ideas</strong></td><td>The wrong idea is a means, never the destination</td><td>"Intermediate" is right there in the name — you are meant to move on from it</td></tr>
<tr><td><strong>Points out assumptions</strong></td><td>It exposes the hidden rules</td><td>Asking why an idea is "obviously wrong" forces you to state the rule it breaks — which links straight back to slide 66 and the nine dots</td></tr>
<tr><td><strong>Helps in understanding the problem</strong></td><td>It is a diagnostic, not only a generator</td><td>You learn the problem's real constraints by pushing against fake ones</td></tr>
</table>
<p class="dap-an">✅ Worked run on the SWP391 delay. Deliberately impossible idea: <strong>"Ship the project with no testing at all."</strong> Positives: it removes the review queue entirely; it makes every task independent; it ends the waiting. The assumption it exposes: <em>every change must pass one person's manual review before merge</em> — a rule nobody wrote down. Real solution reached through it: keep testing, but let automated tests gate the merge and reserve human review for the two risky modules. The delay was never about testing; it was about the single human reviewer.</p>
<ul>
<li><strong>Judgement is postponed, not abandoned.</strong> You know the idea is wrong from the start — that is the premise of the technique. What you suspend is the reflex to discard it before extracting anything.</li>
<li><strong>It pairs naturally with slide 75.</strong> Random Juxtaposition brings something in from outside; the Intermediate Impossible pushes from inside against a boundary. Both are ways to leave an established frame without waiting for inspiration.</li>
<li><strong>Applied at FPTU.</strong> In a stuck retrospective, put one deliberately impossible proposal on the board — "we cancel all meetings", "we ship one feature only", "everyone works on one file" — and spend five minutes on its positives only. The rule it violates is usually the real constraint you should have been discussing.</li>
</ul>
<p class="pitfall">⚠️ Count carefully: <strong>five</strong> bullets on this slide, and the last two (<em>points out assumptions</em>, <em>helps in understanding the problem</em>) are the ones students forget — they read like extras but they are what connect this strategy back to section 4.2.</p>`,
        `<p class="y-chinh">🎯 Chiến lược có tên thứ hai, với <strong>NĂM gạch đầu dòng</strong>: <strong>đôi khi gọi là động não NGƯỢC (negative brainstorming)</strong> · <strong>lấy một giải pháp hoặc ý tưởng mà bạn BIẾT LÀ SAI rồi đi tìm những mặt TÍCH CỰC của nó</strong> · <strong>ý tưởng sai có thể là những viên đá lót đường dẫn tới ý tưởng tốt hơn</strong> · <strong>nó chỉ ra các giả định</strong> · <strong>nó giúp hiểu vấn đề</strong> (de Bono, 1973).</p>
<table>
<tr><th>Gạch đầu dòng</th><th>Nó khẳng định gì</th><th>Vì sao nó chạy</th></tr>
<tr><td><strong>Còn gọi là động não ngược</strong></td><td>Hai tên, một kỹ thuật</td><td>Đây chính là thuật ngữ dùng ở mục tiêu 2 trên slide 72 — học thành cặp</td></tr>
<tr><td><strong>Lấy ý sai, tìm mặt tích cực</strong></td><td>Chính phương pháp, gói trong một dòng</td><td>Treo phán xét lại trong hai phút mới là thứ cho phép một ý tưởng được đem ra soi</td></tr>
<tr><td><strong>Đá lót đường tới ý tốt hơn</strong></td><td>Ý sai là PHƯƠNG TIỆN, không bao giờ là đích</td><td>Chữ "Intermediate" — trung gian — nằm ngay trong tên gọi: bạn được kỳ vọng phải ĐI TIẾP khỏi nó</td></tr>
<tr><td><strong>Chỉ ra các giả định</strong></td><td>Nó phơi ra những luật ngầm</td><td>Hỏi vì sao một ý "hiển nhiên sai" buộc bạn phải PHÁT BIỂU ra cái luật mà nó vi phạm — nối thẳng về slide 66 và bài chín chấm</td></tr>
<tr><td><strong>Giúp hiểu vấn đề</strong></td><td>Nó là công cụ CHẨN ĐOÁN, không chỉ công cụ sinh ý</td><td>Bạn học được ràng buộc thật của bài toán bằng cách đẩy vào những ràng buộc giả</td></tr>
</table>
<p class="dap-an">✅ Chạy thật trên độ trễ SWP391. Ý tưởng cố tình bất khả: <strong>"Nộp đồ án mà KHÔNG kiểm thử gì hết."</strong> Mặt tích cực: nó xoá sạch hàng đợi review; nó làm mọi đầu việc độc lập với nhau; nó chấm dứt cảnh chờ đợi. Giả định nó phơi ra: <em>mọi thay đổi đều phải qua review thủ công của MỘT người trước khi merge</em> — một luật chưa ai viết ra. Giải pháp thật đi tới được nhờ nó: vẫn kiểm thử, nhưng để test tự động gác cổng merge và chỉ dành review của người cho hai module rủi ro. Độ trễ chưa bao giờ là chuyện kiểm thử; nó là chuyện chỉ có MỘT người review.</p>
<ul>
<li><strong>Phán xét được HOÃN LẠI, không phải bị bỏ.</strong> Bạn biết ý tưởng đó sai ngay từ đầu — đó là tiền đề của kỹ thuật. Thứ bạn treo lại là cái phản xạ vứt bỏ nó trước khi rút được thứ gì ra.</li>
<li><strong>Nó ghép rất tự nhiên với slide 75.</strong> Random Juxtaposition mang thứ gì đó từ NGOÀI vào; Intermediate Impossible đẩy từ TRONG ra ép vào một ranh giới. Cả hai đều là cách rời khỏi một khung nhìn đã đóng nếp mà không cần ngồi chờ cảm hứng.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong buổi retrospective đang bí, hãy đặt lên bảng một đề xuất cố tình bất khả — "huỷ hết mọi cuộc họp", "chỉ nộp đúng một tính năng", "cả nhóm cùng sửa một file" — rồi dành năm phút chỉ nói mặt tích cực của nó. Cái luật mà nó vi phạm thường chính là ràng buộc thật mà lẽ ra cả nhóm phải bàn.</li>
</ul>
<p class="pitfall">⚠️ Đếm cho kỹ: slide này có <strong>NĂM</strong> gạch đầu dòng, và hai cái cuối (<em>chỉ ra giả định</em>, <em>giúp hiểu vấn đề</em>) là hai cái sinh viên hay quên — chúng đọc như phần phụ nhưng chính chúng nối chiến lược này ngược về mục 4.2.</p>`],

    ]),
  ].join('\n'),
};
