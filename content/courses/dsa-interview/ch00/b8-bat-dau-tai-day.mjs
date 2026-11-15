/** Bắt đầu tại đây (1/2) — vòng coding kiểm tra gì, vì sao công ty vẫn dùng. Mốc lịch sử đã kiểm nguồn 15/11/2026 (thẻ nguồn cuối bài). */
import { ma, ketQua, nguon, lienKet, baiNay, lc } from '../_chung.mjs';

export default {
  title: 'Start here (1/2) — What the coding round tests, and why companies still use it|||Bắt đầu tại đây (1/2) — Vòng coding kiểm tra gì, và vì sao công ty vẫn dùng',
  slug: 'dsa-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vòng phỏng vấn coding là gì, có những dạng nào, người phỏng vấn chấm bốn trục gì, nó ra đời ra sao và vì sao vẫn còn — và khoá này đưa bạn tới đâu trước hạn hồ sơ OJT.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What the coding round tests, and why companies still use it</h2>
<p class="lead">Hello. If you opened this course, you probably have an internship or a first job application coming up, and somewhere in it there is a step called "online test", "technical interview" or "coding round". This first lesson does three things: it shows you exactly what that step is (it is less mysterious than it sounds), it tells you honestly why companies still use it despite all the complaints, and it shows you where this course will take you — concretely, problem by problem, before your deadline.</p>

<h3>A picture first: the driving test</h3>
<p>A driving test does not check whether you have memorised every road in the city. The examiner sits next to you for twenty minutes and watches a handful of things: do you check the mirrors, do you signal, do you stay calm when a motorbike cuts in, can you park. From those twenty minutes they bet on how you will drive for the next ten years.</p>
<p>A coding interview is the same bet. In 45 minutes, one engineer watches you solve one or two small problems and asks themselves: <em>does this person understand a problem before typing, choose a sensible approach, turn it into working code, check their own work, and explain what they are doing?</em> The problem is just the road. Nobody will ask you to invert a binary tree at work next Tuesday — but they will hand you a vague ticket, a deadline, and a colleague who needs to understand your pull request.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Vòng coding kiểm tra gì, và vì sao công ty vẫn dùng</h2>
<p class="lead">Chào bạn. Nếu bạn mở khoá này, nhiều khả năng bạn sắp nộp hồ sơ thực tập (OJT) hay việc làm đầu tiên, và đâu đó trong quy trình có một bước tên là "bài test online", "phỏng vấn kỹ thuật" hay "vòng coding". Bài đầu tiên này làm ba việc: cho bạn thấy bước đó CHÍNH XÁC là gì (nó bớt đáng sợ hơn bạn nghĩ nhiều), nói thật vì sao công ty vẫn dùng nó dù bị chê đủ đường, và cho bạn thấy khoá này đưa bạn tới đâu — cụ thể từng mẫu bài, từng đề, kịp trước hạn nộp hồ sơ.</p>

<h3>Hình dung trước: thi sát hạch lái xe</h3>
<p>Thi sát hạch lái xe không kiểm tra bạn thuộc hết đường trong thành phố. Giám khảo ngồi cạnh bạn hai mươi phút và nhìn vài thứ: có nhìn gương không, có xi-nhan không, có bình tĩnh khi một chiếc xe máy tạt đầu không, có đỗ xe được không. Từ hai mươi phút đó, họ đặt cược bạn sẽ lái thế nào trong mười năm tới.</p>
<p>Vòng phỏng vấn coding là cùng một cuộc đặt cược. Trong 45 phút, một kỹ sư nhìn bạn giải một hai bài nhỏ và tự hỏi: <em>người này có hiểu vấn đề trước khi gõ không, có chọn được hướng đi hợp lý không, có biến nó thành code chạy đúng không, có tự kiểm tra lại không, và có giải thích được mình đang làm gì không?</em> Bài toán chỉ là con đường. Không ai bắt bạn đảo ngược cây nhị phân vào thứ Ba tuần sau ở công ty — nhưng họ sẽ đưa bạn một ticket mơ hồ, một hạn chót, và một đồng nghiệp cần hiểu được pull request của bạn.</p>
</div>

<div class="ml-en">
<h3>The four forms you will meet</h3>
<table>
<thead><tr><th>Form</th><th>What happens</th><th>What it really tests</th></tr></thead>
<tbody>
<tr><td><strong>Online assessment (OA)</strong></td><td>A timed link on HackerRank, Codility, LeetCode or the company's own system: 2–4 problems, 60–120 minutes, graded automatically by hidden tests.</td><td>Correctness on edge cases, speed, reading input/output formats. Nobody hears you talk.</td></tr>
<tr><td><strong>Live coding</strong></td><td>A video call with a shared editor (CoderPad, a Google Doc, or your own IDE shared). One engineer, 45–60 minutes, one or two problems.</td><td>Everything in the rubric below — especially communication.</td></tr>
<tr><td><strong>On-site / whiteboard</strong></td><td>The same, in person, sometimes on paper or a whiteboard. Returning in 2025–2026 because of AI cheating in remote rounds (see below).</td><td>Same rubric; plus calm without autocomplete.</td></tr>
<tr><td><strong>Take-home</strong></td><td>A small project (an API, a page) to finish in a few days.</td><td>Code structure, tests, README — closer to real work, but costs you evenings.</td></tr>
</tbody></table>
<p>Many internship processes in Vietnam use an OA first (to filter hundreds of CVs) and then a live or on-site technical interview that mixes a coding problem with questions about your projects. This course trains both: Chapters 1–9 build the problem-solving, Chapter 10 trains the talking, the testing and the OA format, Chapter 11 puts it together in timed mock interviews.</p>
</div>
<div class="ml-vi">
<h3>Bốn dạng bạn sẽ gặp</h3>
<table>
<thead><tr><th>Dạng</th><th>Diễn ra thế nào</th><th>Thật ra kiểm tra gì</th></tr></thead>
<tbody>
<tr><td><strong>Online assessment — OA (bài test online)</strong></td><td>Một đường link có giờ trên HackerRank, Codility, LeetCode hoặc hệ thống riêng của công ty: 2–4 bài, 60–120 phút, chấm tự động bằng bộ test ẩn.</td><td>Đúng cả ở trường hợp biên, tốc độ, đọc đúng định dạng vào/ra. Không ai nghe bạn nói.</td></tr>
<tr><td><strong>Live coding (code trực tiếp)</strong></td><td>Gọi video, chung một trình soạn thảo (CoderPad, Google Doc, hoặc chia sẻ màn hình IDE của bạn). Một kỹ sư, 45–60 phút, một hai bài.</td><td>Mọi thứ trong bảng chấm bên dưới — đặc biệt là giao tiếp.</td></tr>
<tr><td><strong>On-site / whiteboard (tại văn phòng / bảng trắng)</strong></td><td>Như trên nhưng gặp trực tiếp, đôi khi viết giấy hoặc bảng. Đang quay lại mạnh trong 2025–2026 vì gian lận bằng AI ở vòng online (xem dưới).</td><td>Cùng bảng chấm; thêm khả năng bình tĩnh khi không có gợi ý tự động.</td></tr>
<tr><td><strong>Take-home (bài mang về nhà)</strong></td><td>Một dự án nhỏ (một API, một trang) làm trong vài ngày.</td><td>Cấu trúc code, test, README — giống việc thật hơn, nhưng tốn của bạn vài buổi tối.</td></tr>
</tbody></table>
<p>Nhiều quy trình thực tập ở Việt Nam dùng OA trước (để lọc hàng trăm CV) rồi tới một buổi phỏng vấn kỹ thuật trực tiếp hoặc online, trộn một bài code với câu hỏi về dự án của bạn. Khoá này luyện cả hai: Chương 1–9 xây khả năng giải bài, Chương 10 luyện nói, tự test và định dạng OA, Chương 11 ghép tất cả lại trong các buổi phỏng vấn thử có bấm giờ.</p>
</div>

<div class="ml-en">
<h3>What the interviewer actually writes down</h3>
<p>Big tech companies publish surprisingly little about their rubrics, but the widely used Tech Interview Handbook (written by a former Meta engineer) summarises what almost every company scores. Four axes:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Communication</span><span class="lz-d">Asks clarifying questions, explains the approach and the trade-offs clearly, thinks out loud.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Problem solving</span><span class="lz-d">Understands the problem, approaches it systematically, reaches an efficient solution, knows its complexity.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Technical competency</span><span class="lz-d">Turns the idea into working, readable code without a big struggle.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Testing</span><span class="lz-d">Checks the code against normal and edge cases, finds and fixes its own bugs.</span></div>
</div>
<p>Look at that list again: only one of the four is "write code". A candidate who reaches the optimal solution in silence and never tests it often scores <em>lower</em> than one who explains a slightly slower solution clearly, catches their own off-by-one, and fixes it. This is the single most useful fact in the whole course, and Lesson 0.2 (the six-step framework) is built around it. Every lesson after that ends with a sample conversation that shows these four axes in action.</p>
</div>
<div class="ml-vi">
<h3>Người phỏng vấn thật sự ghi gì vào phiếu</h3>
<p>Các công ty lớn công bố rất ít về bảng chấm của mình, nhưng cuốn Tech Interview Handbook (do một cựu kỹ sư Meta viết, được dùng rất rộng rãi) tóm tắt những gì gần như công ty nào cũng chấm. Bốn trục:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Communication (giao tiếp)</span><span class="lz-d">Hỏi làm rõ, giải thích hướng đi và đánh đổi rõ ràng, nghĩ thành tiếng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Problem solving (giải quyết vấn đề)</span><span class="lz-d">Hiểu đề, tiếp cận có hệ thống, đi tới lời giải hiệu quả, biết độ phức tạp của nó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Technical competency (năng lực kỹ thuật)</span><span class="lz-d">Biến ý tưởng thành code chạy được, dễ đọc, không chật vật.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Testing (kiểm thử)</span><span class="lz-d">Tự chạy code với trường hợp thường và trường hợp biên, tự tìm và sửa lỗi của mình.</span></div>
</div>
<p>Nhìn lại danh sách: chỉ một trong bốn trục là "viết code". Một ứng viên tới được lời giải tối ưu nhưng im lặng suốt và không hề test thường được điểm <em>thấp hơn</em> một người giải thích rõ ràng một lời giải chậm hơn chút, tự bắt được lỗi lệch một của mình và sửa nó. Đây là sự thật hữu ích nhất của cả khoá, và bài 0.2 (khung 6 bước) được dựng quanh nó. Mọi bài sau đó đều kết thúc bằng một đoạn hội thoại mẫu cho bạn thấy bốn trục này vận hành ra sao.</p>
</div>

<div class="ml-en">
<h3>Where it came from: a short, checked history</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1990s</span><span class="lz-t">Puzzle interviews</span><span class="lz-d">Microsoft and later Google became famous for brainteasers ("how many golf balls fit in a plane?").</span></div>
<div class="lz-step"><span class="lz-k">2008</span><span class="lz-t">Cracking the Coding Interview</span><span class="lz-d">Gayle Laakmann McDowell, a former Google engineer, self-publishes the book that turned "prepare for the coding round" into a genre. 6th edition 2015; a follow-up, <em>Beyond Cracking the Coding Interview</em>, in 2025.</span></div>
<div class="lz-step"><span class="lz-k">2013</span><span class="lz-t">Google drops brainteasers</span><span class="lz-d">Google's head of people operations, Laszlo Bock, told the New York Times that brainteasers were "a complete waste of time" — they did not predict job performance. Structured interviews with real problems remained.</span></div>
<div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">LeetCode founded</span><span class="lz-d">Founded in Silicon Valley by Winston Tang (August 2015). By January 2026 it listed over 3,800 problems.</span></div>
<div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">The backlash tweet</span><span class="lz-d">Max Howell, creator of Homebrew (a tool a huge share of Mac engineers use), complained publicly that Google rejected him after asking him to invert a binary tree on a whiteboard. It became the symbol of "these interviews test the wrong thing".</span></div>
<div class="lz-step"><span class="lz-k">2018+</span><span class="lz-t">Curated lists</span><span class="lz-d">Yangshun Tay's "Blind 75" (later Grind 75) and NeetCode's roadmap shift the advice from "grind thousands" to "learn ~15 patterns with ~150 problems".</span></div>
<div class="lz-step"><span class="lz-k">2025</span><span class="lz-t">AI and the return of in-person rounds</span><span class="lz-d">Tools that feed AI answers into remote interviews spread; Google's CEO said the company was bringing back at least one in-person round, and other firms followed.</span></div>
</div>
<p>Notice the direction: from tricks that test nothing, to standard problems, to <em>patterns</em>. That is exactly why this course is organised by pattern and not by problem.</p>
</div>
<div class="ml-vi">
<h3>Nó từ đâu ra: lịch sử ngắn, đã kiểm nguồn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1990s</span><span class="lz-t">Phỏng vấn bằng câu đố</span><span class="lz-d">Microsoft rồi Google nổi tiếng với câu đố mẹo ("bao nhiêu quả bóng golf nhét vừa một chiếc máy bay?").</span></div>
<div class="lz-step"><span class="lz-k">2008</span><span class="lz-t">Cracking the Coding Interview</span><span class="lz-d">Gayle Laakmann McDowell, cựu kỹ sư Google, tự xuất bản cuốn sách biến "ôn vòng coding" thành cả một thể loại. Bản thứ 6 năm 2015; cuốn tiếp theo <em>Beyond Cracking the Coding Interview</em> năm 2025.</span></div>
<div class="lz-step"><span class="lz-k">2013</span><span class="lz-t">Google bỏ câu đố mẹo</span><span class="lz-d">Trưởng bộ phận nhân sự của Google, Laszlo Bock, nói với New York Times rằng câu đố mẹo là "hoàn toàn phí thời gian" (a complete waste of time) — chúng không dự đoán được năng lực làm việc. Phỏng vấn có cấu trúc với bài toán thật thì ở lại.</span></div>
<div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">LeetCode ra đời</span><span class="lz-d">Do Winston Tang lập ở Thung lũng Silicon (tháng 8/2015). Tới tháng 1/2026 đã có hơn 3.800 đề.</span></div>
<div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">Dòng tweet phản ứng</span><span class="lz-d">Max Howell, tác giả Homebrew (công cụ mà rất nhiều kỹ sư dùng Mac đều cài), than công khai rằng Google từ chối anh sau khi bắt anh đảo ngược cây nhị phân trên bảng trắng. Nó thành biểu tượng của câu "phỏng vấn kiểu này kiểm tra sai thứ".</span></div>
<div class="lz-step"><span class="lz-k">2018+</span><span class="lz-t">Danh sách chọn lọc</span><span class="lz-d">"Blind 75" (sau là Grind 75) của Yangshun Tay và lộ trình NeetCode đổi lời khuyên từ "cày hàng nghìn đề" sang "học ~15 mẫu bài qua ~150 đề".</span></div>
<div class="lz-step"><span class="lz-k">2025</span><span class="lz-t">AI và sự trở lại của phỏng vấn trực tiếp</span><span class="lz-d">Công cụ bơm câu trả lời của AI vào buổi phỏng vấn online lan rộng; CEO Google nói công ty đưa lại ít nhất một vòng gặp trực tiếp, nhiều công ty khác làm theo.</span></div>
</div>
<p>Để ý hướng đi: từ mẹo vặt chẳng kiểm tra gì, sang bài toán chuẩn, sang <em>mẫu bài</em>. Đó chính là lý do khoá này sắp xếp theo mẫu bài chứ không theo từng đề.</p>
</div>

<div class="ml-en">
<h3>"But this is not real work" — the honest answer</h3>
<p>The complaint is half right. Real work is reading other people's code, debugging, designing APIs, talking to teammates. You almost never write a heap from scratch. So why do companies keep the coding round?</p>
<ul>
<li><strong>It is cheap and comparable.</strong> With 500 applicants for 10 internship seats, a company needs a test that every candidate takes under the same conditions. A take-home for 500 people is unmarkable; an OA is not.</li>
<li><strong>It samples the habits that matter.</strong> Clarifying a vague request, considering edge cases, estimating cost before building, explaining yourself — these <em>are</em> daily work, and 45 minutes is enough to see whether someone has them.</li>
<li><strong>Complexity does bite in real code.</strong> Lesson 1.1 measured a Two Sum that takes 2.7 seconds instead of 6 milliseconds. Put that inside an API handler called once per request and the page dies. Chapters later you will see real incidents caused by an accidental O(n²).</li>
</ul>
<p>So treat it like the driving test: a slightly artificial exam that still checks real skills — and one you can pass reliably with the right practice.</p>
</div>
<div class="ml-vi">
<h3>"Nhưng cái này đâu phải việc thật" — câu trả lời thẳng thắn</h3>
<p>Lời chê đúng một nửa. Việc thật là đọc code người khác, gỡ lỗi, thiết kế API, nói chuyện với đồng đội. Bạn gần như không bao giờ tự viết một cái heap từ đầu. Vậy vì sao công ty vẫn giữ vòng coding?</p>
<ul>
<li><strong>Nó rẻ và so sánh được.</strong> 500 hồ sơ cho 10 suất thực tập, công ty cần một bài kiểm tra mà ai cũng làm trong cùng điều kiện. Một bài take-home cho 500 người thì không ai chấm nổi; một bài OA thì chấm được.</li>
<li><strong>Nó lấy mẫu đúng những thói quen quan trọng.</strong> Làm rõ một yêu cầu mơ hồ, nghĩ tới trường hợp biên, ước lượng chi phí trước khi làm, giải thích được việc mình làm — đó CHÍNH LÀ việc hằng ngày, và 45 phút đủ để thấy một người có những thói quen đó hay không.</li>
<li><strong>Độ phức tạp có cắn thật trong code thật.</strong> Bài 1.1 đo được một lời giải Two Sum mất 2,7 giây thay vì 6 mili-giây. Đặt nó trong một API được gọi mỗi request là trang chết. Các chương sau bạn sẽ gặp những sự cố thật gây ra bởi một O(n²) vô tình.</li>
</ul>
<p>Vậy hãy coi nó như kỳ thi sát hạch lái xe: một bài thi hơi "nhân tạo" nhưng vẫn kiểm tra kỹ năng thật — và là bài bạn có thể qua một cách chắc chắn nếu luyện đúng cách.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: the fake interview</h3>
<p>Interviews are also an attack surface — against <em>you</em>. Since November 2023, Palo Alto Networks' Unit 42 has documented a campaign it calls "Contagious Interview": attackers pose as recruiters, invite developers to a "technical interview", and ask them to clone a GitHub project and run <code>npm install</code> / <code>npm start</code> as part of the task. The project contains malware (BeaverTail, which steals browser data and crypto wallets, and downloads a backdoor). Microsoft published another write-up of the same pattern in March 2026.</p>
<p>How to protect yourself, starting with your very first internship application: a real coding round runs in the company's platform (HackerRank, CoderPad, Codility) or in a blank file you write yourself — it does not need you to run their code on your laptop; if a take-home ships with dependencies, read <code>package.json</code> scripts before installing, run it in a throw-away container or VM, never on the machine that holds your wallets, SSH keys or company VPN; check that the recruiter's email domain matches the company's website.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: buổi phỏng vấn giả</h3>
<p>Phỏng vấn cũng là một bề mặt tấn công — nhắm vào chính <em>bạn</em>. Từ tháng 11/2023, nhóm Unit 42 của Palo Alto Networks ghi nhận một chiến dịch họ đặt tên "Contagious Interview": kẻ tấn công đóng vai nhà tuyển dụng, mời lập trình viên vào "phỏng vấn kỹ thuật", rồi yêu cầu clone một dự án GitHub và chạy <code>npm install</code> / <code>npm start</code> như một phần của bài. Dự án chứa mã độc (BeaverTail — đánh cắp dữ liệu trình duyệt, ví tiền mã hoá, rồi tải về một cửa hậu). Tháng 3/2026 Microsoft công bố thêm một phân tích về đúng kiểu tấn công này.</p>
<p>Cách tự bảo vệ, ngay từ hồ sơ thực tập đầu tiên: vòng coding thật chạy trên nền tảng của công ty (HackerRank, CoderPad, Codility) hoặc trong một tệp trắng bạn tự viết — nó không cần bạn chạy code của họ trên máy mình; nếu bài take-home có kèm thư viện phụ thuộc, đọc phần <code>scripts</code> trong <code>package.json</code> trước khi cài, chạy trong container hoặc máy ảo dùng một lần, không bao giờ trên máy đang giữ ví, khoá SSH hay VPN công ty; kiểm tra tên miền email của người tuyển dụng có khớp website công ty không.</p>
</div>

<div class="ml-en">
<h3>What this course will get you, concretely</h3>
<table>
<thead><tr><th>After</th><th>You can</th></tr></thead>
<tbody>
<tr><td>Section 0</td><td>Estimate in 10 seconds whether an idea will pass (n ↔ complexity table), and run the six-step framework on any problem.</td></tr>
<tr><td>Chapters 1–4</td><td>Solve the "easy + most mediums" tier: hashing, prefix sums, two pointers, sliding windows, stacks, linked lists, binary search (also on the answer).</td></tr>
<tr><td>Chapters 5–7</td><td>Trees, tries, heaps, intervals, graphs (BFS/DFS, topological sort, Dijkstra, union-find).</td></tr>
<tr><td>Chapters 8–9</td><td>Backtracking, greedy and dynamic programming — the topics that separate "pass" from "strong pass".</td></tr>
<tr><td>Chapters 10–11</td><td>Talk through a solution in English or Vietnamese, test it yourself, survive an OA, and run three timed mock interviews with a self-grading rubric.</td></tr>
</tbody></table>
<p>Every pattern comes with: the signals that reveal it, a template in <strong>TypeScript and Java</strong> (you take exams in Java at FPT; many interviews let you choose), a step-by-step state table generated by running the code, an interactive simulation, complexity with real measurements, 6–10 verified LeetCode problems, the classic mistakes, and a sample conversation with an interviewer.</p>
${lienKet({ khoa: 'dsa-interview', bai: 'dsa-11-1-lo-trinh', title: 'Chapter 11 — the 6-week plan', sub: 'The day-by-day schedule, if you want to see the whole road first', cta: 'Open' })}
</div>
<div class="ml-vi">
<h3>Khoá này đưa bạn tới đâu, cụ thể</h3>
<table>
<thead><tr><th>Học xong</th><th>Bạn làm được</th></tr></thead>
<tbody>
<tr><td>Mục 0</td><td>Ước lượng trong 10 giây một ý tưởng có qua được không (bảng n ↔ độ phức tạp), và chạy khung 6 bước trên bất kỳ đề nào.</td></tr>
<tr><td>Chương 1–4</td><td>Giải tầng "dễ + phần lớn bài vừa": băm, tổng tiền tố, hai con trỏ, cửa sổ trượt, stack, danh sách liên kết, tìm kiếm nhị phân (cả trên không gian đáp án).</td></tr>
<tr><td>Chương 5–7</td><td>Cây, trie, heap, bài khoảng, đồ thị (BFS/DFS, sắp xếp tô-pô, Dijkstra, union-find).</td></tr>
<tr><td>Chương 8–9</td><td>Quay lui, tham lam và quy hoạch động — những chủ đề phân biệt "qua" với "qua chắc".</td></tr>
<tr><td>Chương 10–11</td><td>Trình bày lời giải bằng tiếng Anh hoặc tiếng Việt, tự test, vượt qua bài OA, và chạy ba buổi phỏng vấn thử có bấm giờ cùng bảng tự chấm.</td></tr>
</tbody></table>
<p>Mỗi mẫu bài đều có: dấu hiệu để nhận ra, khung lời giải bằng <strong>TypeScript và Java</strong> (ở FPT bạn thi bằng Java; nhiều buổi phỏng vấn cho chọn ngôn ngữ), bảng trạng thái từng bước sinh ra từ chính code chạy thật, một mô phỏng tương tác, độ phức tạp kèm số đo thật, 6–10 đề LeetCode đã kiểm, các lỗi kinh điển, và một đoạn hội thoại mẫu với người phỏng vấn.</p>
<div class="callout"><p><strong>🎓 Bạn đã học CSD201?</strong> Rất tốt — môn đó dạy cấu trúc dữ liệu bên trong (cài heap, cây AVL, bảng băm). Khoá này dùng chúng như công cụ: nhận ra mẫu, chọn công cụ, trình bày. Chỗ nào chạm bài CSD201, bài sẽ có hộp "Bạn đã gặp ở CSD201" kèm đường dẫn đúng bài để ôn nhanh. Chưa học CSD201 cũng không sao: mỗi khái niệm được giải thích ngay tại chỗ trước khi dùng.</p>
<p><a href="/academy/courses/data-structures-and-algorithms/learn?lessonSlug=csd201-gioi-thieu" target="_blank" rel="noopener">Mở CSD201 — bài giới thiệu môn →</a></p></div>
${lienKet({ khoa: 'dsa-interview', bai: 'dsa-11-1-lo-trinh', title: 'Chương 11 — lộ trình 6 tuần', sub: 'Lịch từng ngày, nếu bạn muốn nhìn cả con đường trước', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>Set up your practice folder (5 minutes)</h3>
<p>You will run every solution yourself, in both languages. Create a folder (for example <code>~/luyen-dsa</code>), put this tiny program in it twice — once as <code>xin-chao.ts</code>, once as <code>XinChao.java</code> — and run it. If you see the three lines below, your machine is ready for the whole course.</p>
</div>
<div class="ml-vi">
<h3>Dựng thư mục luyện tập (5 phút)</h3>
<p>Bạn sẽ tự chạy mọi lời giải, bằng cả hai ngôn ngữ. Tạo một thư mục (ví dụ <code>~/luyen-dsa</code>), đặt chương trình nhỏ này vào hai lần — một lần là <code>xin-chao.ts</code>, một lần là <code>XinChao.java</code> — rồi chạy. Thấy ba dòng bên dưới là máy bạn đã sẵn sàng cho cả khoá. (TypeScript chạy bằng <code>npx tsx</code> — cần Node 18 trở lên; Java cần JDK 17 trở lên, <code>java XinChao.java</code> chạy thẳng tệp nguồn không cần <code>javac</code> riêng.)</p>
</div>
${ma('ch00/xin-chao.ts', { nhan: 'TypeScript' })}
${ma('ch00/XinChao.java', { nhan: 'Java' })}
${ketQua('ch00/xin-chao.ts')}
${ketQua('ch00/XinChao.java')}

<div class="ml-en">
<h3>🧪 Practice (10 minutes — a first win)</h3>
<div class="callout ok"><ol>
<li>Create <code>~/luyen-dsa</code> and run both programs above. Same three lines in both languages?</li>
<li>Create a free LeetCode account. Open ${lc(1, 'two-sum', 'Two Sum', 'Easy')}, read it, and write in one sentence, in your own words, what it asks.</li>
<li>Submit any solution — even the double loop. Seeing "Accepted" once is the point today.</li>
<li>Write your target date at the top of a notebook page: "OJT application deadline: ___ — mock interview 1 by: ___".</li>
</ol>
<p><strong>Done when:</strong> both programs print the same three lines, you have one accepted submission, and a dated page in your notebook.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OA (online assessment)</span><span class="v">A timed online test graded automatically by hidden tests.</span></div>
  <div class="kv"><span class="k">live coding</span><span class="v">Solving a problem in a shared editor while an engineer watches and talks with you.</span></div>
  <div class="kv"><span class="k">take-home</span><span class="v">A small project finished at home over a few days.</span></div>
  <div class="kv"><span class="k">rubric</span><span class="v">The scoring sheet: communication, problem solving, technical competency, testing.</span></div>
  <div class="kv"><span class="k">pattern</span><span class="v">A reusable way of solving a family of problems (two pointers, BFS, DP…).</span></div>
  <div class="kv"><span class="k">edge case</span><span class="v">An unusual input (empty, one element, all equal, very large) that breaks careless code.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>The coding round is a 45-minute bet on how you work, not a memory test.</li>
<li>Four forms: OA, live coding, on-site, take-home — this course trains the first three directly.</li>
<li>Interviewers score four axes and only one of them is "write code".</li>
<li>History moved from brainteasers to standard problems to patterns; so does this course.</li>
<li>A fake interview can be an attack: never run a stranger's project on your main machine.</li>
<li>Your practice folder runs TypeScript and Java; you are ready for "Start here (2/2)".</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview prep', 'How long to prepare and the four evaluation criteria quoted above', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
${nguon('📰', 'The Register (2013) — Google: brainteasers a complete waste of time', 'Laszlo Bock on what did and did not predict performance', 'https://www.theregister.com/2013/06/20/google_hiring_procedures/')}
${nguon('📰', 'Entrepreneur (2025) — Google, McKinsey bring back in-person interviews', 'The AI-cheating reason behind the return of on-site rounds', 'https://www.entrepreneur.com/business-news/google-mckinsey-reintroduce-in-person-interviews-due-to-ai/496041')}
${nguon('🔐', 'Unit 42 — fake job interviews targeting developers', 'The "Contagious Interview" campaign: npm projects carrying BeaverTail', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/')}
${nguon('📚', 'Wikipedia — LeetCode', 'Founding (2015), size of the problem set', 'https://en.wikipedia.org/wiki/LeetCode')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (10 phút — một chiến thắng đầu tiên)</h3>
<div class="callout ok"><ol>
<li>Tạo <code>~/luyen-dsa</code> và chạy cả hai chương trình trên. Hai ngôn ngữ có in ra cùng ba dòng không?</li>
<li>Tạo tài khoản LeetCode miễn phí. Mở ${lc(1, 'two-sum', 'Two Sum', 'Easy')}, đọc, và viết bằng lời của mình trong một câu: đề hỏi gì.</li>
<li>Nộp một lời giải bất kỳ — kể cả hai vòng lặp lồng nhau. Hôm nay chỉ cần thấy chữ "Accepted" một lần.</li>
<li>Ghi ngày đích lên đầu một trang sổ: "Hạn nộp hồ sơ OJT: ___ — phỏng vấn thử lần 1 trước ngày: ___".</li>
</ol>
<p><strong>Đạt khi:</strong> hai chương trình in cùng ba dòng, có một lượt nộp Accepted, và một trang sổ có ghi ngày.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OA — online assessment (bài test online)</span><span class="v">Bài thi online có giờ, chấm tự động bằng bộ test ẩn.</span></div>
  <div class="kv"><span class="k">live coding (code trực tiếp)</span><span class="v">Giải bài trong trình soạn thảo chung, có kỹ sư xem và trò chuyện cùng.</span></div>
  <div class="kv"><span class="k">take-home (bài mang về)</span><span class="v">Dự án nhỏ làm ở nhà trong vài ngày.</span></div>
  <div class="kv"><span class="k">rubric (bảng tiêu chí chấm)</span><span class="v">Phiếu chấm: giao tiếp, giải quyết vấn đề, năng lực kỹ thuật, kiểm thử.</span></div>
  <div class="kv"><span class="k">pattern (mẫu bài)</span><span class="v">Một cách giải dùng lại được cho cả một họ đề (hai con trỏ, BFS, quy hoạch động…).</span></div>
  <div class="kv"><span class="k">edge case (trường hợp biên)</span><span class="v">Đầu vào bất thường (rỗng, một phần tử, toàn giống nhau, rất lớn) làm hỏng code cẩu thả.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Vòng coding là cuộc đặt cược 45 phút về cách bạn làm việc, không phải bài kiểm tra trí nhớ.</li>
<li>Bốn dạng: OA, code trực tiếp, tại văn phòng, mang về nhà — khoá này luyện thẳng ba dạng đầu.</li>
<li>Người phỏng vấn chấm bốn trục, chỉ một trục là "viết code".</li>
<li>Lịch sử đi từ câu đố mẹo sang bài chuẩn rồi sang mẫu bài; khoá này cũng vậy.</li>
<li>Phỏng vấn giả có thể là một vụ tấn công: đừng chạy dự án của người lạ trên máy chính.</li>
<li>Thư mục luyện tập đã chạy được TypeScript và Java; bạn sẵn sàng cho "Bắt đầu tại đây (2/2)".</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview prep', 'Chuẩn bị bao lâu, và bốn tiêu chí chấm trích ở trên (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
${nguon('📰', 'The Register (2013) — Google: câu đố mẹo hoàn toàn phí thời gian', 'Laszlo Bock nói về điều gì dự đoán được năng lực, điều gì không', 'https://www.theregister.com/2013/06/20/google_hiring_procedures/')}
${nguon('📰', 'Entrepreneur (2025) — Google, McKinsey đưa lại phỏng vấn trực tiếp', 'Lý do gian lận bằng AI đằng sau sự trở lại của vòng gặp mặt', 'https://www.entrepreneur.com/business-news/google-mckinsey-reintroduce-in-person-interviews-due-to-ai/496041')}
${nguon('🔐', 'Unit 42 — phỏng vấn giả nhắm vào lập trình viên', 'Chiến dịch "Contagious Interview": dự án npm mang mã độc BeaverTail', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/')}
${nguon('📚', 'Wikipedia — LeetCode', 'Năm thành lập (2015), quy mô kho đề', 'https://en.wikipedia.org/wiki/LeetCode')}
</div>
`,
};
