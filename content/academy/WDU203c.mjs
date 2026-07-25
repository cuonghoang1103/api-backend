/**
 * WDU203c — UI/UX Design (Kỳ 9).
 * Thiết kế trải nghiệm người dùng theo Coursera Michigan UX Specialization (6 MOOC):
 * intro UX principles & processes, understanding user needs, evaluating designs with users,
 * concept→wireframe, research at scale, và UX capstone.
 * KHÔNG code → link Coursera MOOC + Exp Hub (Figma/Miro/Maze); KHÔNG CodeLab.
 * Grading: TE 100% (50 câu trắc nghiệm, 60'), pass TE>=4 & (TE+bonus)>=5; gate = hoàn thành 6 MOOC + chứng chỉ Specialization.
 * Chuẩn SWP391 gold: Mục 0 6 bài (intro+lz-map, thang điểm+cổng MOOC, CLO, công cụ,
 * ngân hàng đề tài capstone 12 + rubric chọn, anti-fail/high-mark) + chương bám 6 MOOC
 * + chương ÔN THI (ngân hàng câu hỏi theo CLO + chiến lược thi TE) + chương NÂNG CAO ★.
 * Song ngữ EN/VN đối xứng (ml-en == ml-vi). shortDescription < 500.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/WDU203c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    academyType: 'FPT',
    courseCode: 'WDU203c',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Design products people love: learn UX research (interviews, user testing, surveys, analytics) and UX design (ideation, sketching, wireframes, prototypes) the Michigan/Coursera way, then run a full multi-phase capstone.|||Thiết kế sản phẩm người dùng yêu thích: học nghiên cứu UX (phỏng vấn, kiểm thử người dùng, khảo sát, analytics) và thiết kế UX (ý tưởng, phác thảo, wireframe, prototype) theo Michigan/Coursera, rồi chạy một đồ án capstone nhiều pha.',
    description: 'WDU203c (UI/UX Design — Thiết kế trải nghiệm người dùng) dạy bạn cách tạo ra sản phẩm số vừa dễ dùng vừa đáng yêu, dựa trên bộ chuyên đề UX của Đại học Michigan trên Coursera (6 khoá). Môn học tích hợp HAI nửa của nghề: UX RESEARCH (hiểu người dùng thật — phỏng vấn định tính, quan sát, kiểm thử khả dụng, khảo sát định lượng, phân tích hành vi, A/B test) và UX DESIGN (biến hiểu biết thành giải pháp — phác ý tưởng, sketch, kịch bản, storyboard, wireframe, prototype từ thấp đến cao độ trung thực). Bạn đi qua trọn vòng thiết kế lấy người dùng làm trung tâm (double diamond): khám phá nhu cầu → định nghĩa vấn đề → phát triển giải pháp → kiểm thử với người thật → lặp lại. Cuối môn là một đồ án CAPSTONE nhiều pha: bạn tự chọn một sản phẩm, nghiên cứu người dùng, thiết kế, prototype, kiểm thử và viết báo cáo. Đánh giá 100% qua bài thi trắc nghiệm cuối kỳ (TE), nhưng ĐIỀU KIỆN dự thi là hoàn thành cả 6 MOOC và lấy chứng chỉ Specialization — nên môn này ăn điểm bằng việc HỌC ĐỀU và HIỂU quy trình, không phải nhồi phút chót.',
    whatYouLearn: 'Phân biệt UX vs UI, UX research vs UX design; quy trình thiết kế lấy người dùng làm trung tâm (double diamond); nguyên tắc nhận thức (Gestalt, mental model, affordance) và 10 heuristic của Nielsen + đánh giá heuristic; phỏng vấn định tính đúng cách + quan sát + affinity wall; thiết kế và điều phối một buổi kiểm thử khả dụng (think-aloud) + viết báo cáo; sinh ý tưởng, sketch, scenario, storyboard, wireframe và prototype lo→hi fidelity; nghiên cứu ở quy mô lớn: khảo sát tránh 3 loại lỗi (coverage/nonresponse/measurement), behavioral analytics, remote testing, A/B & preference testing; và chạy một đồ án UX nhiều pha từ nghiên cứu tới báo cáo cuối. Kèm chuẩn ngoài giáo trình: WCAG accessibility, design system/design token, và các chỉ số UX (SUS, HEART, SUPR-Q).',
    requirements: 'Không có môn tiên quyết. Cần: tài khoản Coursera (đăng ký qua FPT để học 6 MOOC Michigan UX Specialization), một công cụ thiết kế (Figma — miễn phí, có gói Education), một công cụ vẽ sơ đồ/affinity (Miro/FigJam), và người dùng thật để phỏng vấn/kiểm thử (5 người là đủ cho mỗi vòng). Nên có laptop, tai nghe có mic để phỏng vấn từ xa.',
    documentsNote: 'Tài nguyên chính: Michigan "User Experience Research and Design" Specialization trên Coursera (6 khoá) — introtoux-principles-and-processes • understanding-user-needs • evaluating-designs-with-users • ux-design-concept-wireframe • ux-research-at-scale • user-experience-capstone. Sách tham khảo: The Design of Everyday Things (Don Norman) • Don\'t Make Me Think (Steve Krug) • Rocket Surgery Made Easy (Krug) • 100 Things Every Designer Needs to Know About People (Susan Weinschenk). Công cụ cài đặt & template → Exp Hub. Đây là môn thiết kế — vừa học vừa làm đồ án UX thật.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học vận hành thế nào, thang điểm TE 100% + cổng hoàn thành MOOC, CLO, công cụ, ngân hàng đề tài capstone và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What WDU203c is & the UX process map|||0.1 — WDU203c là gì & bản đồ quy trình UX',
          slug: 'wdu203c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: môn tích hợp UX Research + UX Design theo bộ Michigan UX, đi trọn vòng double diamond và kết thúc bằng capstone.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>WDU203c — you design for real people, then prove it with real users</h2>
<p class="lead">WDU203c (UI/UX Design) teaches you to build digital products that are both <strong>usable</strong> and <strong>enjoyable</strong>. It follows the University of Michigan <strong>"User Experience Research and Design"</strong> specialization on Coursera — six courses that integrate the two halves of the job: <strong>UX Research</strong> (understanding real users) and <strong>UX Design</strong> (turning that understanding into screens people can actually use).</p>
<p>UX is <strong>not</strong> just making things pretty. A beautiful screen that confuses users is bad UX. The discipline is a repeatable loop: <em>discover what people need → define the real problem → develop candidate designs → test them with real users → iterate</em>. This loop is often drawn as the <strong>Double Diamond</strong>.</p>

<h3>The whole course in one map</h3>
<div class="lz-map">
  <div class="lz-stage">Discover</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">UX principles & processes</div><div class="lz-nsub">What is UX · perception · Nielsen heuristics</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Understanding user needs</div><div class="lz-nsub">Qualitative research · interviews · affinity walls</div></div></div>
  <div class="lz-stage">Define & test</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Evaluating designs with users</div><div class="lz-nsub">Usability testing · think-aloud · reporting</div></div></div>
  <div class="lz-stage">Develop</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Concept → wireframe</div><div class="lz-nsub">Ideation · sketching · wireframes · prototypes</div></div></div>
  <div class="lz-stage">Scale</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">UX research at scale</div><div class="lz-nsub">Surveys · analytics · remote · A/B testing</div></div></div>
  <div class="lz-stage">Integrate</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">UX capstone</div><div class="lz-nsub">Multi-phase project · 5 milestones · final report</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Accessibility · design systems · UX metrics</div><div class="lz-nsub">WCAG · design tokens · SUS/HEART</div></div></div>
</div>

<h3>The Double Diamond — how designers avoid solving the wrong problem</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Diverge</div><div class="lz-t">Discover</div><div class="lz-d">research widely, gather needs</div></div>
  <div class="lz-step"><div class="lz-k">Converge</div><div class="lz-t">Define</div><div class="lz-d">frame the real problem</div></div>
  <div class="lz-step"><div class="lz-k">Diverge</div><div class="lz-t">Develop</div><div class="lz-d">ideate many solutions</div></div>
  <div class="lz-step"><div class="lz-k">Converge</div><div class="lz-t">Deliver</div><div class="lz-d">prototype, test, ship</div></div>
</div>

<div class="callout ok"><strong>The one rule that decides good UX:</strong> <em>you are not the user.</em> Your intuition about what is "obvious" is almost always wrong, because you built it. Every claim about usability must be checked against real people — 5 users per round catches ~85% of problems. Research is not a luxury; it is how you avoid confidently shipping the wrong thing.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>UX vs UI vs product design.</b> UX = the whole felt experience (can I accomplish my goal, does it frustrate me). UI = the visual/interactive surface (buttons, colors, spacing). Product design usually means both plus business goals. This course leans UX (research + interaction), but employers use the terms loosely. <em>Knowing the distinction lets you read job posts correctly — it is not spelled out in the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>WDU203c — bạn thiết kế cho người thật, rồi chứng minh bằng người dùng thật</h2>
<p class="lead">WDU203c (UI/UX Design) dạy bạn xây sản phẩm số vừa <strong>dễ dùng</strong> vừa <strong>đáng yêu</strong>. Môn theo bộ chuyên đề <strong>"User Experience Research and Design"</strong> của Đại học Michigan trên Coursera — sáu khoá tích hợp hai nửa của nghề: <strong>UX Research</strong> (hiểu người dùng thật) và <strong>UX Design</strong> (biến hiểu biết đó thành màn hình người ta thực sự dùng được).</p>
<p>UX <strong>không</strong> chỉ là làm cho đẹp. Một màn hình đẹp nhưng khiến người dùng bối rối là UX tồi. Bộ môn này là một vòng lặp lặp lại được: <em>khám phá người ta cần gì → định nghĩa vấn đề thật → phát triển các phương án → kiểm thử với người thật → lặp lại</em>. Vòng lặp này thường được vẽ thành <strong>Double Diamond (Kim cương đôi)</strong>.</p>

<h3>Cả môn học trong một bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">Khám phá</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nguyên tắc & quy trình UX</div><div class="lz-nsub">UX là gì · nhận thức · heuristic Nielsen</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hiểu nhu cầu người dùng</div><div class="lz-nsub">Nghiên cứu định tính · phỏng vấn · affinity wall</div></div></div>
  <div class="lz-stage">Định nghĩa & kiểm thử</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đánh giá thiết kế với người dùng</div><div class="lz-nsub">Kiểm thử khả dụng · think-aloud · báo cáo</div></div></div>
  <div class="lz-stage">Phát triển</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Ý tưởng → wireframe</div><div class="lz-nsub">Ideation · sketch · wireframe · prototype</div></div></div>
  <div class="lz-stage">Quy mô</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Nghiên cứu UX quy mô lớn</div><div class="lz-nsub">Khảo sát · analytics · từ xa · A/B test</div></div></div>
  <div class="lz-stage">Tích hợp</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Đồ án UX capstone</div><div class="lz-nsub">Dự án nhiều pha · 5 milestone · báo cáo cuối</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Accessibility · design system · chỉ số UX</div><div class="lz-nsub">WCAG · design token · SUS/HEART</div></div></div>
</div>

<h3>Double Diamond — cách nhà thiết kế tránh giải sai vấn đề</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">Khám phá</div><div class="lz-d">nghiên cứu rộng, gom nhu cầu</div></div>
  <div class="lz-step"><div class="lz-k">Đóng</div><div class="lz-t">Định nghĩa</div><div class="lz-d">khung lại vấn đề thật</div></div>
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">Phát triển</div><div class="lz-d">nghĩ nhiều giải pháp</div></div>
  <div class="lz-step"><div class="lz-k">Đóng</div><div class="lz-t">Giao</div><div class="lz-d">prototype, kiểm thử, ra mắt</div></div>
</div>

<div class="callout ok"><strong>Một quy tắc quyết định UX tốt:</strong> <em>bạn không phải là người dùng.</em> Trực giác của bạn về cái gì "hiển nhiên" gần như luôn sai, vì chính bạn xây ra nó. Mọi tuyên bố về khả dụng phải được kiểm với người thật — 5 người mỗi vòng bắt được ~85% lỗi. Nghiên cứu không phải xa xỉ; đó là cách bạn tránh tự tin ra mắt sai thứ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>UX vs UI vs product design.</b> UX = toàn bộ trải nghiệm cảm nhận (tôi có đạt được mục tiêu không, có bực không). UI = bề mặt hình ảnh/tương tác (nút, màu, khoảng cách). Product design thường là cả hai cộng thêm mục tiêu kinh doanh. Môn này nghiêng về UX (nghiên cứu + tương tác), nhưng nhà tuyển dụng dùng các từ này khá lỏng lẻo. <em>Hiểu sự khác biệt giúp bạn đọc tin tuyển dụng cho đúng — điều này không được ghi rõ trong syllabus.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded: TE 100% + the MOOC gate|||0.2 — Cách tính điểm: TE 100% + cổng hoàn thành MOOC',
          slug: 'wdu203c-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm đầy đủ: thi trắc nghiệm cuối kỳ 100%, điều kiện dự thi = hoàn thành 6 MOOC, bonus 1 điểm, công thức pass.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown — one exam, but a hard gate before it</h2>
<p class="lead">WDU203c is graded <strong>100% by a Final Theory Exam (TE)</strong> — a 50-question, 60-minute multiple-choice test marked by computer. But there is a <strong>gate</strong>: you may only sit the TE after you have completed all six online courses and earned the Specialization certificate.</p>

<table>
<thead><tr><th>Component</th><th>Weight</th><th>Form</th><th>Detail</th></tr></thead>
<tbody>
<tr><td>Final Theory Exam (TE)</td><td><strong>100%</strong></td><td>50 MCQ · 60'</td><td>All CLOs · marked by computer</td></tr>
<tr><td>MOOC completion</td><td><em>Gate</em></td><td>6 courses + cert</td><td>Required to be allowed into the TE</td></tr>
<tr><td>On-time bonus</td><td><strong>+1</strong></td><td>—</td><td>Finish all MOOCs before the deadline</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass gate 1</span><span class="v">TE ≥ 4.0</span></div>
<div class="kv"><span class="k">Pass gate 2</span><span class="v">(TE + bonus) ≥ 5.0</span></div>
<div class="kv"><span class="k">Bonus</span><span class="v">+1 if all MOOCs done early</span></div>
</div>

<h3>What "final result" means, precisely</h3>
<div class="formula"><span class="lbl">FINAL RESULT</span> FR = min(10, TE + Bonus) &nbsp;·&nbsp; Pass ⟺ TE ≥ 4 <strong>AND</strong> FR ≥ 5</div>
<p>Worked example: you score <strong>TE = 4.5</strong> and finished all MOOCs early (<strong>Bonus = 1</strong>). Then FR = min(10, 4.5 + 1) = <strong>5.5</strong>. TE 4.5 ≥ 4 ✓ and FR 5.5 ≥ 5 ✓ → <strong>PASS</strong>. Without the bonus, FR = 4.5 < 5 → <strong>FAIL</strong>. That single bonus point is often the difference.</p>

<div class="callout warn"><strong>The gate is the real risk, not the exam.</strong> Students rarely fail the TE on knowledge — they fail because they left the six MOOCs until the last week, could not finish the certificate in time, and were <em>not allowed to sit the exam at all</em>. Treat the MOOCs as weekly homework from day 1.</div>

<div class="pitfall"><strong>Peer-graded assignments have deadlines too.</strong> Several Coursera courses in this specialization use peer review — you must submit AND review classmates' work to complete the course. Reviews can take days to come back, so submitting on the last day can leave you "incomplete" even though you did the work. Submit early.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bank the bonus, then relax.</b> Because FR is capped at 10 and the bonus is +1, the smartest play is to finish all MOOCs early (locking Bonus = 1), which drops the exam bar you need from 5.0 to 4.0. You convert a stressful exam into a comfortable one purely by being on time. <em>This scheduling insight is not in the rubric but is the highest-leverage move in the course.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm — một bài thi, nhưng có cổng cứng trước đó</h2>
<p class="lead">WDU203c chấm <strong>100% qua bài thi lý thuyết cuối kỳ (TE)</strong> — 50 câu trắc nghiệm, 60 phút, máy chấm. Nhưng có một <strong>cổng</strong>: bạn chỉ được dự thi TE sau khi hoàn thành cả sáu khoá online và lấy chứng chỉ Specialization.</p>

<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Chi tiết</th></tr></thead>
<tbody>
<tr><td>Thi lý thuyết cuối kỳ (TE)</td><td><strong>100%</strong></td><td>50 câu · 60'</td><td>Tất cả CLO · máy chấm</td></tr>
<tr><td>Hoàn thành MOOC</td><td><em>Cổng</em></td><td>6 khoá + chứng chỉ</td><td>Bắt buộc mới được vào thi TE</td></tr>
<tr><td>Thưởng đúng hạn</td><td><strong>+1</strong></td><td>—</td><td>Xong hết MOOC trước hạn</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Cổng qua 1</span><span class="v">TE ≥ 4.0</span></div>
<div class="kv"><span class="k">Cổng qua 2</span><span class="v">(TE + thưởng) ≥ 5.0</span></div>
<div class="kv"><span class="k">Thưởng</span><span class="v">+1 nếu xong MOOC sớm</span></div>
</div>

<h3>"Kết quả cuối" nghĩa chính xác là gì</h3>
<div class="formula"><span class="lbl">KẾT QUẢ CUỐI</span> FR = min(10, TE + Thưởng) &nbsp;·&nbsp; Qua ⟺ TE ≥ 4 <strong>VÀ</strong> FR ≥ 5</div>
<p>Ví dụ có lời giải: bạn được <strong>TE = 4.5</strong> và đã xong hết MOOC sớm (<strong>Thưởng = 1</strong>). Khi đó FR = min(10, 4.5 + 1) = <strong>5.5</strong>. TE 4.5 ≥ 4 ✓ và FR 5.5 ≥ 5 ✓ → <strong>QUA</strong>. Không có thưởng, FR = 4.5 < 5 → <strong>TRƯỢT</strong>. Một điểm thưởng đó thường chính là ranh giới.</p>

<div class="callout warn"><strong>Rủi ro thật là cái cổng, không phải bài thi.</strong> Sinh viên hiếm khi trượt TE vì thiếu kiến thức — họ trượt vì để dồn sáu MOOC tới tuần cuối, không kịp lấy chứng chỉ, và <em>không được dự thi</em>. Coi các MOOC như bài tập tuần từ ngày đầu.</div>

<div class="pitfall"><strong>Bài chấm chéo (peer-graded) cũng có hạn nộp.</strong> Vài khoá Coursera trong bộ này dùng chấm chéo — bạn phải nộp VÀ chấm bài bạn học mới hoàn thành khoá. Bài chấm có thể mất vài ngày mới về, nên nộp ngày cuối có thể khiến bạn "chưa hoàn thành" dù đã làm xong. Hãy nộp sớm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ẵm điểm thưởng trước, rồi thư giãn.</b> Vì FR trần 10 và thưởng +1, nước đi khôn nhất là xong hết MOOC sớm (khoá chặt Thưởng = 1), kéo ngưỡng thi bạn cần từ 5.0 xuống 4.0. Bạn biến một kỳ thi căng thành một kỳ thi thoải mái chỉ nhờ đúng hạn. <em>Mẹo lịch trình này không có trong rubric nhưng là nước đi lợi nhất môn học.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'wdu203c-clo',
          type: 'article',
          description: '8 CLO của môn và bản đồ CLO → chương để bạn biết học gì phục vụ mục tiêu nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>What you must be able to do by the end</h2>
<p class="lead">FPT defines eight Course Learning Outcomes (CLOs). The Final Exam draws from all of them. Use this as a checklist: if you can honestly do each line, you are ready.</p>
<table>
<thead><tr><th>CLO</th><th>You can…</th><th>Covered in</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Explain what UX research involves (interviews, evaluating systems)</td><td>Ch 1-2</td></tr>
<tr><td>CLO2</td><td>Describe UX design work: generating promising designs</td><td>Ch 1, 4</td></tr>
<tr><td>CLO3</td><td>Describe techniques to gather data from and about users</td><td>Ch 2, 5</td></tr>
<tr><td>CLO4</td><td>Design and conduct tests with users</td><td>Ch 3</td></tr>
<tr><td>CLO5</td><td>Apply sketching, scenarios, storyboarding, wireframing</td><td>Ch 4</td></tr>
<tr><td>CLO6</td><td>Turn wireframes into interactive, testable prototypes</td><td>Ch 4</td></tr>
<tr><td>CLO7</td><td>Gain UX insights from large numbers of users (analytics)</td><td>Ch 5</td></tr>
<tr><td>CLO8</td><td>Design and run an integrated multi-phase UX project</td><td>Ch 6 (capstone)</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two axes, not eight items.</b> Notice the CLOs cluster on two axes: <em>research</em> (1, 3, 4, 7) and <em>design</em> (2, 5, 6), with 8 integrating both. If you always ask "is this a research skill or a design skill, and where in the double diamond does it sit?" the eight outcomes collapse into one mental model. <em>This grouping is our teaching aid, not in the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Kết thúc môn bạn phải LÀM được gì</h2>
<p class="lead">FPT định nghĩa tám Chuẩn đầu ra (CLO). Bài thi cuối rút từ tất cả. Dùng đây làm checklist: nếu thành thật làm được từng dòng, bạn đã sẵn sàng.</p>
<table>
<thead><tr><th>CLO</th><th>Bạn có thể…</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Giải thích UX research gồm gì (phỏng vấn, đánh giá hệ thống)</td><td>Ch 1-2</td></tr>
<tr><td>CLO2</td><td>Mô tả công việc UX design: sinh ra các thiết kế tiềm năng</td><td>Ch 1, 4</td></tr>
<tr><td>CLO3</td><td>Mô tả kỹ thuật thu thập dữ liệu từ và về người dùng</td><td>Ch 2, 5</td></tr>
<tr><td>CLO4</td><td>Thiết kế và tiến hành kiểm thử với người dùng</td><td>Ch 3</td></tr>
<tr><td>CLO5</td><td>Áp dụng sketch, scenario, storyboard, wireframe</td><td>Ch 4</td></tr>
<tr><td>CLO6</td><td>Biến wireframe thành prototype tương tác kiểm thử được</td><td>Ch 4</td></tr>
<tr><td>CLO7</td><td>Rút hiểu biết UX từ số lượng lớn người dùng (analytics)</td><td>Ch 5</td></tr>
<tr><td>CLO8</td><td>Thiết kế và chạy một dự án UX tích hợp nhiều pha</td><td>Ch 6 (capstone)</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai trục, không phải tám mục.</b> Để ý các CLO gom trên hai trục: <em>nghiên cứu</em> (1, 3, 4, 7) và <em>thiết kế</em> (2, 5, 6), với 8 tích hợp cả hai. Nếu luôn hỏi "đây là kỹ năng nghiên cứu hay thiết kế, và nằm ở đâu trên double diamond?" thì tám chuẩn đầu ra thu về một mô hình tư duy. <em>Cách gom này là công cụ dạy của chúng tôi, không có trong syllabus.</em></div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup (Exp Hub)|||0.4 — Công cụ & cài đặt (Exp Hub)',
          slug: 'wdu203c-cong-cu',
          type: 'article',
          description: 'Công cụ miễn phí: Figma (thiết kế/prototype), Miro/FigJam (affinity/sơ đồ), Google Forms/Maze (khảo sát/test), Coursera (6 MOOC).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The UX toolkit — all free for students</h2>
<p class="lead">You do not need to code. You need tools to <em>learn, talk to users, design, prototype, and test</em>. Everything below has a free tier or a student plan. Full install guide is in the Exp Hub card.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Learn</div><div class="lz-t">Coursera</div><div class="lz-d">6 Michigan UX MOOCs</div></div>
  <div class="lz-step"><div class="lz-k">Design</div><div class="lz-t">Figma</div><div class="lz-d">wireframe → hi-fi prototype</div></div>
  <div class="lz-step"><div class="lz-k">Synthesize</div><div class="lz-t">Miro / FigJam</div><div class="lz-d">affinity walls, journey maps</div></div>
  <div class="lz-step"><div class="lz-k">Test</div><div class="lz-t">Maze / Forms</div><div class="lz-d">unmoderated tests & surveys</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/wdu203c-cong-cu-thiet-ke?ref=%2Fcourses%2Fui-ux-design%2Flearn&reflabel=WDU203c%20·%20Công%20cụ" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — WDU203c design toolkit setup</span><span class="lc-sub">Figma · Miro · Maze · Coursera · step-by-step install</span></span>
  <span class="lc-cta">Open →</span>
</a>
<div class="callout ok"><strong>Minimum viable setup:</strong> a Figma account (design + clickable prototype) + Google Forms (surveys) + a webcam/mic (remote user tests). That trio covers every deliverable in the capstone.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ UX — đều miễn phí cho sinh viên</h2>
<p class="lead">Bạn không cần code. Bạn cần công cụ để <em>học, nói chuyện với người dùng, thiết kế, prototype và kiểm thử</em>. Tất cả dưới đây đều có bản miễn phí hoặc gói sinh viên. Hướng dẫn cài đặt đầy đủ ở thẻ Exp Hub.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">Coursera</div><div class="lz-d">6 MOOC UX Michigan</div></div>
  <div class="lz-step"><div class="lz-k">Thiết kế</div><div class="lz-t">Figma</div><div class="lz-d">wireframe → prototype hi-fi</div></div>
  <div class="lz-step"><div class="lz-k">Tổng hợp</div><div class="lz-t">Miro / FigJam</div><div class="lz-d">affinity wall, journey map</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm thử</div><div class="lz-t">Maze / Forms</div><div class="lz-d">test không điều phối & khảo sát</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/wdu203c-cong-cu-thiet-ke?ref=%2Fcourses%2Fui-ux-design%2Flearn&reflabel=WDU203c%20·%20Công%20cụ" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — Cài đặt bộ công cụ thiết kế WDU203c</span><span class="lc-sub">Figma · Miro · Maze · Coursera · hướng dẫn từng bước</span></span>
  <span class="lc-cta">Mở →</span>
</a>
<div class="callout ok"><strong>Bộ tối thiểu chạy được:</strong> một tài khoản Figma (thiết kế + prototype bấm được) + Google Forms (khảo sát) + webcam/mic (test người dùng từ xa). Bộ ba đó phủ mọi sản phẩm nộp của capstone.</div>
</div>`,
        },
        {
          title: '0.5 — Capstone project bank (12 topics) + how to pick|||0.5 — Ngân hàng đề tài capstone (12) + cách chọn',
          slug: 'wdu203c-ngan-hang-de-tai',
          type: 'article',
          description: 'Ngân hàng 12 đề tài UX capstone đã kiểm scope + rubric 6 phép thử chọn đề đúng tầm cho một bài kiểm thử 5 người.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Pick a capstone you can actually research with 5 users</h2>
<p class="lead">The capstone asks you to run a full UX process on one product. The #1 mistake is picking something <em>too big</em> ("redesign a bank app") that you cannot research or prototype in the time you have. Below are 12 pre-scoped topics; each is small enough for real interviews and a clickable prototype, but rich enough to show every skill.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Everyday campus</span> 1) FPT course-registration flow · 2) Library seat/room booking · 3) Canteen pre-order & pickup · 4) Club/event sign-up</div>
  <div class="lz-layer"><span class="lz-lk">Local services</span> 5) Motorbike-repair booking · 6) Homestay/room finder for students · 7) Second-hand textbook marketplace · 8) Neighborhood grocery reorder</div>
  <div class="lz-layer"><span class="lz-lk">Health & habit</span> 9) Water/medication reminder · 10) Gym class booking · 11) Study-focus timer with stats</div>
  <div class="lz-layer"><span class="lz-lk">Civic</span> 12) Public-bus route & arrival helper</div>
</div>
<h3>The 6-test rubric — score a topic before you commit</h3>
<table>
<thead><tr><th>Test</th><th>Ask</th><th>Red flag</th></tr></thead>
<tbody>
<tr><td>Reachable users</td><td>Can I interview 5 real users this week?</td><td>Users are strangers/experts you can't access</td></tr>
<tr><td>Real task</td><td>Is there one concrete task to test end-to-end?</td><td>Vague "explore" with no goal</td></tr>
<tr><td>Small surface</td><td>Can I prototype 6-10 screens, not 60?</td><td>A whole super-app</td></tr>
<tr><td>Observable pain</td><td>Do users struggle today in a way I can see?</td><td>You only assume the pain</td></tr>
<tr><td>Not solved-for-you</td><td>Room to design, not just copy an existing app 1:1?</td><td>Perfect solution already exists</td></tr>
<tr><td>Personal access</td><td>Do I understand the context enough to recruit?</td><td>Domain you've never touched</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Green light:</strong> a topic that passes 5-6 tests. <strong>Yellow:</strong> 3-4 — narrow it. <strong>Red:</strong> ≤2 — pick another. "FPT course registration" passes all six for an FPT student; "redesign Grab" fails reachable-users and small-surface.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Narrow the task, not the ambition.</b> Pros scope by <em>task</em>, not by product size: instead of "design a food app," they scope "help a hungry student order a repeat lunch in under 30 seconds." A sharp task statement makes your interviews, prototype, and usability test all point the same way. <em>Task-framing is a professional habit the syllabus assumes but never teaches explicitly.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn capstone mà bạn thực sự nghiên cứu được với 5 người</h2>
<p class="lead">Capstone yêu cầu bạn chạy trọn quy trình UX trên một sản phẩm. Lỗi số 1 là chọn thứ <em>quá lớn</em> ("thiết kế lại app ngân hàng") mà bạn không thể nghiên cứu hay prototype trong thời gian có. Dưới đây là 12 đề đã kiểm scope; mỗi đề đủ nhỏ để phỏng vấn thật và prototype bấm được, nhưng đủ giàu để thể hiện mọi kỹ năng.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Trong trường</span> 1) Luồng đăng ký môn FPT · 2) Đặt chỗ/phòng thư viện · 3) Đặt trước & lấy đồ căng-tin · 4) Đăng ký CLB/sự kiện</div>
  <div class="lz-layer"><span class="lz-lk">Dịch vụ địa phương</span> 5) Đặt lịch sửa xe máy · 6) Tìm homestay/phòng trọ cho SV · 7) Chợ giáo trình cũ · 8) Đặt lại đồ tạp hoá gần nhà</div>
  <div class="lz-layer"><span class="lz-lk">Sức khoẻ & thói quen</span> 9) Nhắc uống nước/uống thuốc · 10) Đặt lớp phòng gym · 11) Đồng hồ tập trung học có thống kê</div>
  <div class="lz-layer"><span class="lz-lk">Cộng đồng</span> 12) Trợ lý tuyến & giờ xe buýt</div>
</div>
<h3>Rubric 6 phép thử — chấm đề trước khi cam kết</h3>
<table>
<thead><tr><th>Phép thử</th><th>Hỏi</th><th>Cờ đỏ</th></tr></thead>
<tbody>
<tr><td>Người dùng tiếp cận được</td><td>Tuần này tôi phỏng vấn được 5 người thật không?</td><td>Người dùng là người lạ/chuyên gia không với tới</td></tr>
<tr><td>Nhiệm vụ thật</td><td>Có một nhiệm vụ cụ thể để test đầu-cuối không?</td><td>Mơ hồ "khám phá" không có mục tiêu</td></tr>
<tr><td>Bề mặt nhỏ</td><td>Prototype được 6-10 màn, không phải 60?</td><td>Cả một siêu ứng dụng</td></tr>
<tr><td>Nỗi đau quan sát được</td><td>Người dùng hôm nay có vật lộn theo cách tôi thấy?</td><td>Bạn chỉ giả định nỗi đau</td></tr>
<tr><td>Chưa giải sẵn</td><td>Còn chỗ để thiết kế, không phải chép y app cũ?</td><td>Đã có giải pháp hoàn hảo</td></tr>
<tr><td>Có bối cảnh cá nhân</td><td>Bạn hiểu bối cảnh đủ để tuyển người test?</td><td>Lĩnh vực chưa bao giờ chạm</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Đèn xanh:</strong> đề qua 5-6 phép thử. <strong>Vàng:</strong> 3-4 — thu hẹp lại. <strong>Đỏ:</strong> ≤2 — chọn đề khác. "Đăng ký môn FPT" qua cả sáu với SV FPT; "thiết kế lại Grab" trượt tiếp-cận-người-dùng và bề-mặt-nhỏ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thu hẹp NHIỆM VỤ, không thu hẹp tham vọng.</b> Dân chuyên nghiệp giới hạn theo <em>nhiệm vụ</em>, không theo kích cỡ sản phẩm: thay vì "thiết kế app đồ ăn", họ giới hạn "giúp sinh viên đói đặt lại bữa trưa quen trong dưới 30 giây". Một phát biểu nhiệm vụ sắc làm phỏng vấn, prototype và usability test đều chỉ về một hướng. <em>Đóng khung nhiệm vụ là thói quen nghề mà syllabus giả định nhưng không dạy rõ.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'wdu203c-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm phổ biến + cờ xanh/đỏ theo tuần + công thức điểm cao cho môn UX thi trắc nghiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Anti-fail & high-mark guide</h2>
<p class="lead">Because the grade is one exam behind a completion gate, almost all failure is <em>logistical</em>, not intellectual. Here are the seven ways students lose this course and the green/red flags to watch weekly.</p>
<h3>7 ways students lose points</h3>
<table>
<thead><tr><th>#</th><th>How you lose</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Left 6 MOOCs to the last week → not allowed to sit TE</td><td>~1 course/week from week 1</td></tr>
<tr><td>2</td><td>Submitted peer-graded work late → course stayed "incomplete"</td><td>Submit + review classmates early</td></tr>
<tr><td>3</td><td>Missed the on-time bonus → needed TE ≥ 5 instead of 4</td><td>Finish all MOOCs before deadline for +1</td></tr>
<tr><td>4</td><td>Memorized definitions, failed "apply the concept" MCQs</td><td>Study scenarios, not just terms</td></tr>
<tr><td>5</td><td>Confused similar terms (formative vs summative, qual vs quant)</td><td>Build a compare-table (Ch 7)</td></tr>
<tr><td>6</td><td>Ran out of time on 50 MCQ in 60'</td><td>~70s/question, flag & move on</td></tr>
<tr><td>7</td><td>Trusted intuition over evidence in "what should the designer do" items</td><td>Default to "test with users"</td></tr>
</tbody>
</table>
<h3>Weekly green / red flags</h3>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Green</span><span class="v">On pace: 1 MOOC/week, certificate on track</span></div>
<div class="kv"><span class="k">🟢 Green</span><span class="v">You keep a term-compare sheet as you go</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">Two weeks in, still on course 1</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">Peer reviews unsubmitted near a deadline</span></div>
</div>
<h3>The high-mark formula</h3>
<div class="formula"><span class="lbl">SCORE HIGH</span> finish MOOCs early (+1 bonus) &nbsp;+&nbsp; study by scenario not definition &nbsp;+&nbsp; a one-page compare-table of every paired term</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Answer MCQs like a designer, not a student.</b> When an exam item asks "what should the team do next," the UX-correct answer is almost always the one that <em>gathers evidence from users</em> (test it, interview, observe) rather than the one that assumes/decides. Michigan's exams reward this reflex. <em>This meta-strategy is not stated but reliably lifts scores on judgment questions.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Cẩm nang chống trượt & ăn điểm cao</h2>
<p class="lead">Vì điểm là một bài thi nằm sau cổng hoàn thành, gần như mọi thất bại là <em>hậu cần</em>, không phải trí tuệ. Đây là bảy cách sinh viên mất môn này và cờ xanh/đỏ theo dõi hàng tuần.</p>
<h3>7 cách mất điểm</h3>
<table>
<thead><tr><th>#</th><th>Cách bạn mất</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Dồn 6 MOOC tới tuần cuối → không được dự thi TE</td><td>~1 khoá/tuần từ tuần 1</td></tr>
<tr><td>2</td><td>Nộp bài chấm chéo trễ → khoá vẫn "chưa hoàn thành"</td><td>Nộp + chấm bạn học sớm</td></tr>
<tr><td>3</td><td>Lỡ điểm thưởng đúng hạn → cần TE ≥ 5 thay vì 4</td><td>Xong hết MOOC trước hạn để +1</td></tr>
<tr><td>4</td><td>Học thuộc định nghĩa, trượt câu "áp dụng khái niệm"</td><td>Học theo tình huống, không chỉ thuật ngữ</td></tr>
<tr><td>5</td><td>Nhầm thuật ngữ giống nhau (formative vs summative, định tính vs định lượng)</td><td>Lập bảng so sánh (Ch 7)</td></tr>
<tr><td>6</td><td>Hết giờ 50 câu trong 60'</td><td>~70 giây/câu, đánh dấu & đi tiếp</td></tr>
<tr><td>7</td><td>Tin trực giác hơn bằng chứng ở câu "nhà thiết kế nên làm gì"</td><td>Mặc định "kiểm thử với người dùng"</td></tr>
</tbody>
</table>
<h3>Cờ xanh / đỏ theo tuần</h3>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">Đúng nhịp: 1 MOOC/tuần, chứng chỉ đúng lộ trình</span></div>
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">Bạn giữ một tờ so sánh thuật ngữ dọc đường</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Hai tuần rồi, vẫn còn ở khoá 1</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Bài chấm chéo chưa nộp mà gần hạn</span></div>
</div>
<h3>Công thức điểm cao</h3>
<div class="formula"><span class="lbl">ĐIỂM CAO</span> xong MOOC sớm (+1 thưởng) &nbsp;+&nbsp; học theo tình huống không theo định nghĩa &nbsp;+&nbsp; một trang bảng so sánh mọi cặp thuật ngữ</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trả lời trắc nghiệm như nhà thiết kế, không như học sinh.</b> Khi câu hỏi hỏi "đội nên làm gì tiếp theo", đáp án đúng-UX gần như luôn là cái <em>thu thập bằng chứng từ người dùng</em> (kiểm thử, phỏng vấn, quan sát) chứ không phải cái giả định/quyết định. Đề Michigan thưởng phản xạ này. <em>Chiến lược meta này không được nêu nhưng đều đặn nâng điểm câu phán đoán.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — UX PRINCIPLES & PROCESSES ══════════════════ */
    {
      title: 'Chapter 1 — UX principles & processes|||Chương 1 — Nguyên tắc & quy trình UX',
      description: 'Coursera 1/6: UX là gì, con người nhận thức & hành động ra sao, và 10 heuristic của Nielsen + đánh giá heuristic.',
      lessons: [
        {
          title: '1.1 — What is UX? Research vs design & the process|||1.1 — UX là gì? Nghiên cứu vs thiết kế & quy trình',
          slug: 'wdu203c-1-1-what-is-ux',
          type: 'VIDEO',
          description: 'Định nghĩa UX, phân biệt UX research và UX design, và quy trình lấy người dùng làm trung tâm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>User experience is everything a person feels using your product</h2>
<p class="lead">Don Norman, who coined "user experience," meant it broadly: not just the screen, but the whole journey — discovering the product, learning it, using it, getting stuck, recovering. UX work splits into two collaborating halves.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">UX Research</span> Understand <em>who</em> the users are, <em>what</em> they need, and <em>whether</em> a design works — via interviews, observation, usability tests, surveys, analytics.</div>
  <div class="lz-layer"><span class="lz-lk">UX Design</span> Turn that understanding into concrete solutions — information architecture, flows, sketches, wireframes, prototypes.</div>
</div>
<h3>The user-centered design process</h3>
<p>UX is a <strong>cycle</strong>, not a straight line. Norman's classic loop: <em>observe → generate ideas → prototype → test →</em> (repeat). You never "finish" after one pass; each test teaches you what to fix.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Understand</div><div class="lz-d">who &amp; what — research</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Ideate</div><div class="lz-d">many candidate designs</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Prototype</div><div class="lz-d">cheap, testable version</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Evaluate</div><div class="lz-d">test with real users → iterate</div></div>
</div>
<div class="callout ok"><strong>Usability vs experience.</strong> <em>Usability</em> = can people accomplish the task efficiently and without errors (measurable). <em>Experience</em> = how it feels overall, including trust, delight, and emotion. Good UX needs both — a usable-but-cold product and a delightful-but-confusing product both fail.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The 7 UX honeycomb facets.</b> Peter Morville's model says great UX is: useful, usable, desirable, findable, accessible, credible, valuable. It is a handy checklist when critiquing any design and shows why "usable" alone is not enough. <em>Not in the Michigan syllabus but widely used in industry reviews.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Trải nghiệm người dùng là mọi thứ một người CẢM NHẬN khi dùng sản phẩm</h2>
<p class="lead">Don Norman — người đặt ra khái niệm "user experience" — hiểu nó rộng: không chỉ màn hình, mà cả hành trình — biết đến sản phẩm, học nó, dùng nó, bị kẹt, phục hồi. Công việc UX chia thành hai nửa hợp tác.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">UX Research</span> Hiểu người dùng <em>là ai</em>, họ <em>cần gì</em>, và một thiết kế <em>có chạy không</em> — qua phỏng vấn, quan sát, usability test, khảo sát, analytics.</div>
  <div class="lz-layer"><span class="lz-lk">UX Design</span> Biến hiểu biết đó thành giải pháp cụ thể — kiến trúc thông tin, luồng, sketch, wireframe, prototype.</div>
</div>
<h3>Quy trình thiết kế lấy người dùng làm trung tâm</h3>
<p>UX là một <strong>vòng lặp</strong>, không phải đường thẳng. Vòng kinh điển của Norman: <em>quan sát → sinh ý tưởng → prototype → kiểm thử →</em> (lặp). Bạn không bao giờ "xong" sau một lượt; mỗi lần test dạy bạn phải sửa gì.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Hiểu</div><div class="lz-d">ai &amp; cái gì — nghiên cứu</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Sinh ý tưởng</div><div class="lz-d">nhiều phương án thiết kế</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Prototype</div><div class="lz-d">bản rẻ, kiểm thử được</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Đánh giá</div><div class="lz-d">test với người thật → lặp</div></div>
</div>
<div class="callout ok"><strong>Khả dụng vs trải nghiệm.</strong> <em>Khả dụng (usability)</em> = người ta có làm được nhiệm vụ hiệu quả và không lỗi (đo được). <em>Trải nghiệm</em> = cảm giác tổng thể, gồm niềm tin, thích thú, cảm xúc. UX tốt cần cả hai — sản phẩm khả-dụng-mà-lạnh và sản phẩm thích-thú-mà-rối đều thất bại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>7 mặt của tổ ong UX.</b> Mô hình của Peter Morville nói UX tuyệt vời là: hữu ích, dễ dùng, đáng khao khát, tìm được, tiếp cận được, đáng tin, có giá trị. Đây là checklist tiện khi phê bình bất kỳ thiết kế nào và cho thấy vì sao "dễ dùng" thôi chưa đủ. <em>Không có trong syllabus Michigan nhưng dùng rộng rãi khi review trong ngành.</em></div>
</div>`,
        },
        {
          title: '1.2 — How people perceive & act: Gestalt & mental models|||1.2 — Con người nhận thức & hành động: Gestalt & mô hình tinh thần',
          slug: 'wdu203c-1-2-perception',
          type: 'VIDEO',
          description: 'Nguyên tắc Gestalt, mental model, affordance & signifier — nền tảng tâm lý của thiết kế trực quan.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Design works with the brain's shortcuts, not against them</h2>
<p class="lead">People do not read screens pixel by pixel — they perceive patterns. The <strong>Gestalt principles</strong> describe how the brain groups things automatically. Design that respects them feels "obvious"; design that violates them feels "cluttered."</p>
<table>
<thead><tr><th>Gestalt principle</th><th>Meaning</th><th>Design use</th></tr></thead>
<tbody>
<tr><td>Proximity</td><td>Close items feel related</td><td>Group a label with its input</td></tr>
<tr><td>Similarity</td><td>Alike items feel like a set</td><td>Same style = same kind of action</td></tr>
<tr><td>Common region</td><td>Items in one box feel grouped</td><td>Cards, panels</td></tr>
<tr><td>Continuity</td><td>Eyes follow lines/alignment</td><td>Align fields on a grid</td></tr>
<tr><td>Closure</td><td>Brain completes shapes</td><td>Icons, logos</td></tr>
<tr><td>Figure/ground</td><td>We separate object from background</td><td>Modals, focus states</td></tr>
</tbody>
</table>
<h3>Mental models, affordances & signifiers</h3>
<p>A <strong>mental model</strong> is the user's belief about how a system works, built from past experience. If your trash icon deletes but users expect "archive," their model clashes with reality → errors. An <strong>affordance</strong> is what an object lets you do (a button affords pressing); a <strong>signifier</strong> is the visible clue that reveals it (the button <em>looks</em> pressable). Norman: most "user error" is really <em>missing signifiers</em>.</p>
<div class="pitfall"><strong>Don't fight the mental model.</strong> A clever, "original" navigation that ignores what users learned from every other app forces them to relearn from zero. Consistency with the wider world (external consistency) usually beats novelty. Innovate on value, not on where the back button lives.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Hick's Law & Fitts's Law.</b> Two quantitative laws designers lean on: <em>Hick's Law</em> — decision time rises with the number/complexity of choices (so trim menus); <em>Fitts's Law</em> — time to hit a target falls as it gets bigger and closer (so make primary buttons big and reachable, especially on mobile thumbs). <em>These predictive laws aren't in the syllabus but explain many layout decisions.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Thiết kế đi CÙNG lối tắt của não bộ, không chống lại nó</h2>
<p class="lead">Người ta không đọc màn hình từng điểm ảnh — họ nhận thức theo mẫu (pattern). Các <strong>nguyên tắc Gestalt</strong> mô tả cách não tự động nhóm các thứ. Thiết kế tôn trọng chúng thấy "hiển nhiên"; thiết kế vi phạm chúng thấy "rối".</p>
<table>
<thead><tr><th>Nguyên tắc Gestalt</th><th>Nghĩa</th><th>Dùng trong thiết kế</th></tr></thead>
<tbody>
<tr><td>Gần nhau (Proximity)</td><td>Vật gần nhau thấy liên quan</td><td>Nhóm nhãn với ô nhập của nó</td></tr>
<tr><td>Tương đồng (Similarity)</td><td>Vật giống nhau thấy cùng một bộ</td><td>Cùng kiểu = cùng loại hành động</td></tr>
<tr><td>Vùng chung (Common region)</td><td>Vật trong một hộp thấy được nhóm</td><td>Thẻ (card), bảng (panel)</td></tr>
<tr><td>Liên tục (Continuity)</td><td>Mắt đi theo đường/căn lề</td><td>Căn các ô theo lưới</td></tr>
<tr><td>Khép kín (Closure)</td><td>Não tự hoàn thiện hình</td><td>Icon, logo</td></tr>
<tr><td>Hình/nền (Figure/ground)</td><td>Ta tách vật khỏi nền</td><td>Modal, trạng thái focus</td></tr>
</tbody>
</table>
<h3>Mô hình tinh thần, affordance & signifier</h3>
<p>Một <strong>mô hình tinh thần (mental model)</strong> là niềm tin của người dùng về cách hệ thống hoạt động, dựng từ kinh nghiệm cũ. Nếu icon thùng rác của bạn xoá nhưng người dùng mong "lưu trữ", mô hình của họ xung đột thực tế → lỗi. Một <strong>affordance</strong> là thứ vật thể cho phép bạn làm (nút cho phép bấm); một <strong>signifier</strong> là dấu hiệu nhìn thấy được tiết lộ điều đó (nút <em>trông</em> bấm được). Norman: đa số "lỗi người dùng" thực ra là <em>thiếu signifier</em>.</p>
<div class="pitfall"><strong>Đừng chống lại mô hình tinh thần.</strong> Một điều hướng "độc đáo", thông minh mà phớt lờ thứ người dùng đã học từ mọi app khác buộc họ học lại từ đầu. Nhất quán với thế giới rộng (external consistency) thường thắng sự mới lạ. Sáng tạo ở giá trị, không phải ở chỗ đặt nút back.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định luật Hick & Fitts.</b> Hai định luật định lượng nhà thiết kế dựa vào: <em>Định luật Hick</em> — thời gian quyết định tăng theo số/độ phức tạp lựa chọn (nên cắt bớt menu); <em>Định luật Fitts</em> — thời gian chạm mục tiêu giảm khi nó to hơn và gần hơn (nên làm nút chính to và dễ với, nhất là ngón cái trên mobile). <em>Các định luật dự đoán này không có trong syllabus nhưng giải thích nhiều quyết định bố cục.</em></div>
</div>`,
        },
        {
          title: '1.3 — Design heuristics & heuristic evaluation|||1.3 — Heuristic thiết kế & đánh giá heuristic',
          slug: 'wdu203c-1-3-heuristics',
          type: 'VIDEO',
          description: '10 heuristic của Nielsen và cách chạy một buổi đánh giá heuristic nhanh, rẻ — không cần người dùng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Nielsen's 10 heuristics — a checklist experts use to find problems fast</h2>
<p class="lead">A <strong>heuristic evaluation</strong> is a cheap, fast inspection: 3-5 evaluators judge an interface against a list of usability rules, <em>without</em> users. It won't catch everything, but it removes obvious problems before you spend real users on a test.</p>
<table>
<thead><tr><th>#</th><th>Heuristic</th><th>One-line</th></tr></thead>
<tbody>
<tr><td>1</td><td>Visibility of system status</td><td>Always show what's happening (loading, saved)</td></tr>
<tr><td>2</td><td>Match system & real world</td><td>Use users' words, not jargon</td></tr>
<tr><td>3</td><td>User control & freedom</td><td>Easy undo / exit ("emergency exit")</td></tr>
<tr><td>4</td><td>Consistency & standards</td><td>Same thing = same word/place</td></tr>
<tr><td>5</td><td>Error prevention</td><td>Stop mistakes before they happen</td></tr>
<tr><td>6</td><td>Recognition over recall</td><td>Show options; don't make me remember</td></tr>
<tr><td>7</td><td>Flexibility & efficiency</td><td>Shortcuts for experts</td></tr>
<tr><td>8</td><td>Aesthetic & minimalist design</td><td>No noise; every element earns its place</td></tr>
<tr><td>9</td><td>Help users with errors</td><td>Plain-language messages + a way out</td></tr>
<tr><td>10</td><td>Help & documentation</td><td>Findable help when needed</td></tr>
</tbody>
</table>
<h3>Worked example — run a heuristic evaluation</h3>
<div class="out"><strong>Screen:</strong> a checkout page.
<strong>Finding 1</strong> — no confirmation after "Pay" (violates #1 Visibility). Severity 3/4.
<strong>Finding 2</strong> — error "Err 0x2F" on a bad card (violates #9 Help with errors). Severity 3/4.
<strong>Finding 3</strong> — "Submit" here but "Confirm" on the previous step (violates #4 Consistency). Severity 2/4.
<strong>Output:</strong> a ranked list (heuristic + location + severity 0-4) the team can fix before user testing.</div>
<div class="callout ok"><strong>Heuristic vs user test — use both.</strong> Heuristic evaluation is expert-based, fast, and finds <em>known</em> problem types. User testing is people-based, slower, and finds <em>surprising</em> problems you never imagined. Do a heuristic pass first (clean the obvious), then test with users (find the unknown).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Severity ratings turn a list into a plan.</b> Nielsen rates each issue 0 (not a problem) to 4 (usability catastrophe) by frequency × impact × persistence. Without severity, a list of 30 issues is paralyzing; with it, the team fixes the three 4s first. <em>Severity scoring is the practical half of heuristic evaluation the syllabus mentions only briefly.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>10 heuristic của Nielsen — checklist chuyên gia dùng để tìm lỗi nhanh</h2>
<p class="lead">Một buổi <strong>đánh giá heuristic</strong> là kiểm tra rẻ, nhanh: 3-5 người đánh giá soi giao diện theo một danh sách quy tắc khả dụng, <em>không</em> cần người dùng. Nó không bắt được mọi thứ, nhưng loại bỏ lỗi hiển nhiên trước khi bạn tiêu người dùng thật vào một buổi test.</p>
<table>
<thead><tr><th>#</th><th>Heuristic</th><th>Một dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>Hiển thị trạng thái hệ thống</td><td>Luôn cho thấy đang xảy ra gì (đang tải, đã lưu)</td></tr>
<tr><td>2</td><td>Khớp hệ thống & thế giới thật</td><td>Dùng từ của người dùng, không thuật ngữ</td></tr>
<tr><td>3</td><td>Kiểm soát & tự do</td><td>Dễ hoàn tác / thoát ("lối thoát khẩn")</td></tr>
<tr><td>4</td><td>Nhất quán & chuẩn</td><td>Cùng một thứ = cùng từ/vị trí</td></tr>
<tr><td>5</td><td>Phòng lỗi</td><td>Chặn sai sót trước khi xảy ra</td></tr>
<tr><td>6</td><td>Nhận ra hơn nhớ lại</td><td>Hiện lựa chọn; đừng bắt tôi nhớ</td></tr>
<tr><td>7</td><td>Linh hoạt & hiệu quả</td><td>Phím tắt cho người thạo</td></tr>
<tr><td>8</td><td>Thẩm mỹ & tối giản</td><td>Không nhiễu; mọi thành phần phải xứng chỗ</td></tr>
<tr><td>9</td><td>Giúp người dùng khi lỗi</td><td>Thông báo dễ hiểu + lối ra</td></tr>
<tr><td>10</td><td>Trợ giúp & tài liệu</td><td>Trợ giúp tìm được khi cần</td></tr>
</tbody>
</table>
<h3>Ví dụ có lời giải — chạy một buổi đánh giá heuristic</h3>
<div class="out"><strong>Màn hình:</strong> trang thanh toán.
<strong>Lỗi 1</strong> — không xác nhận sau khi bấm "Trả tiền" (vi phạm #1 Hiển thị). Mức 3/4.
<strong>Lỗi 2</strong> — báo "Err 0x2F" khi thẻ sai (vi phạm #9 Giúp khi lỗi). Mức 3/4.
<strong>Lỗi 3</strong> — chỗ này "Submit" nhưng bước trước "Confirm" (vi phạm #4 Nhất quán). Mức 2/4.
<strong>Kết quả:</strong> một danh sách xếp hạng (heuristic + vị trí + mức 0-4) để đội sửa trước khi test người dùng.</div>
<div class="callout ok"><strong>Heuristic vs test người dùng — dùng cả hai.</strong> Đánh giá heuristic dựa vào chuyên gia, nhanh, tìm loại lỗi <em>đã biết</em>. Test người dùng dựa vào con người, chậm hơn, tìm lỗi <em>bất ngờ</em> bạn chưa từng nghĩ. Làm một lượt heuristic trước (dọn cái hiển nhiên), rồi test với người dùng (tìm cái chưa biết).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chấm mức nghiêm trọng biến danh sách thành kế hoạch.</b> Nielsen chấm mỗi vấn đề từ 0 (không phải lỗi) tới 4 (thảm hoạ khả dụng) theo tần suất × tác động × dai dẳng. Không có mức, danh sách 30 lỗi làm tê liệt; có mức, đội sửa ba lỗi mức 4 trước. <em>Chấm mức là nửa thực hành của đánh giá heuristic mà syllabus chỉ nhắc thoáng qua.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'What best describes UX (user experience)?|||Điều gì mô tả đúng nhất UX (trải nghiệm người dùng)?',
                options: [
                  'Only the visual look of a screen|||Chỉ là vẻ ngoài hình ảnh của màn hình',
                  'Everything a person feels while discovering, learning and using a product|||Mọi thứ một người cảm nhận khi biết đến, học và dùng sản phẩm',
                  'The database schema|||Lược đồ cơ sở dữ liệu',
                  'The marketing plan|||Kế hoạch marketing',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'A signifier is:|||Signifier là:',
                options: [
                  'What an object lets you do|||Thứ vật thể cho phép bạn làm',
                  'The visible clue that reveals what you can do|||Dấu hiệu nhìn thấy được tiết lộ bạn có thể làm gì',
                  'A type of database index|||Một loại index cơ sở dữ liệu',
                  'A color palette|||Một bảng màu',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Grouping a text label right next to its input field mainly uses which Gestalt principle?|||Nhóm một nhãn ngay cạnh ô nhập của nó chủ yếu dùng nguyên tắc Gestalt nào?',
                options: ['Closure|||Khép kín', 'Proximity|||Gần nhau', 'Figure/ground|||Hình/nền', 'Continuity|||Liên tục'],
                correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A heuristic evaluation is best described as:|||Đánh giá heuristic được mô tả đúng nhất là:',
                options: [
                  'A test with many real users|||Một buổi test với nhiều người dùng thật',
                  'An expert inspection against usability rules, without users|||Chuyên gia soi giao diện theo quy tắc khả dụng, không cần người dùng',
                  'An A/B test on live traffic|||Một A/B test trên lưu lượng thật',
                  'A survey of 500 people|||Một khảo sát 500 người',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Showing a "Saved ✓" message after an action best satisfies which Nielsen heuristic?|||Hiện thông báo "Đã lưu ✓" sau một hành động thoả mãn tốt nhất heuristic Nielsen nào?',
                options: [
                  'Visibility of system status|||Hiển thị trạng thái hệ thống',
                  'Aesthetic & minimalist design|||Thẩm mỹ & tối giản',
                  'Help & documentation|||Trợ giúp & tài liệu',
                  'Flexibility & efficiency|||Linh hoạt & hiệu quả',
                ], correctIndex: 0,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) Hick\'s Law implies a designer should:|||(Ngoài giáo trình) Định luật Hick hàm ý nhà thiết kế nên:',
                options: [
                  'Add as many menu options as possible|||Thêm càng nhiều lựa chọn menu càng tốt',
                  'Reduce the number/complexity of choices to speed decisions|||Giảm số/độ phức tạp lựa chọn để quyết định nhanh hơn',
                  'Make buttons smaller|||Làm nút nhỏ hơn',
                  'Remove all help text|||Bỏ hết chữ trợ giúp',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — UNDERSTANDING USER NEEDS ══════════════════ */
    {
      title: 'Chapter 2 — Understanding user needs|||Chương 2 — Hiểu nhu cầu người dùng',
      description: 'Coursera 2/6: nghiên cứu định tính, kịch bản phỏng vấn, quan sát, trích xuất dữ liệu và affinity wall.',
      lessons: [
        {
          title: '2.1 — Qualitative research & interview protocols|||2.1 — Nghiên cứu định tính & kịch bản phỏng vấn',
          slug: 'wdu203c-2-1-interviews',
          type: 'VIDEO',
          description: 'Vì sao phỏng vấn định tính, cách viết kịch bản câu hỏi mở, và bẫy câu hỏi mớm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>To design for people, first understand them in their own words</h2>
<p class="lead"><strong>Qualitative research</strong> answers <em>why</em> and <em>how</em> — the goals, contexts, and frustrations behind behavior. Interviews are its core tool. Unlike a survey (which confirms things you already suspect at scale), an interview <em>discovers</em> things you didn't know to ask.</p>
<h3>The interview protocol</h3>
<p>A <strong>protocol</strong> is your planned guide: an intro (build rapport, get consent), warm-up questions, the core questions (open-ended, about real past behavior), and a wrap-up. You follow it loosely — good interviewers chase interesting threads.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Open</div><div class="lz-t">Rapport + consent</div><div class="lz-d">put them at ease, ask to record</div></div>
  <div class="lz-step"><div class="lz-k">Warm-up</div><div class="lz-t">Easy background</div><div class="lz-d">"tell me about your day"</div></div>
  <div class="lz-step"><div class="lz-k">Core</div><div class="lz-t">Past behavior</div><div class="lz-d">"last time you… what happened?"</div></div>
  <div class="lz-step"><div class="lz-k">Close</div><div class="lz-t">Anything else?</div><div class="lz-d">let them add, thank them</div></div>
</div>
<div class="out"><strong>Good (open, about the past):</strong> "Walk me through the last time you booked a study room. What did you do first?"
<strong>Bad (leading):</strong> "Wouldn't a faster booking app be great?" → everyone says yes; you learn nothing.
<strong>Bad (hypothetical):</strong> "Would you use a feature that…?" → people are terrible at predicting their future behavior.</div>
<div class="pitfall"><strong>Leading & hypothetical questions poison your data.</strong> Ask about concrete past events ("the last time…"), not opinions about the future ("would you…"). And never pitch your solution mid-interview — you want their problem, not their politeness.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Mom Test.</b> Rob Fitzpatrick's rule: ask questions even your mom couldn't lie to you about — talk about <em>their life</em>, not <em>your idea</em>; ask about specifics in the past, not generics/opinions; and listen more than you talk. It is the single best filter against false encouragement. <em>Not in the Michigan syllabus but the industry standard for customer discovery.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Muốn thiết kế cho con người, trước hết hiểu họ bằng chính lời họ</h2>
<p class="lead"><strong>Nghiên cứu định tính</strong> trả lời <em>vì sao</em> và <em>như thế nào</em> — mục tiêu, bối cảnh và bực bội đằng sau hành vi. Phỏng vấn là công cụ cốt lõi. Khác khảo sát (xác nhận ở quy mô lớn thứ bạn đã ngờ), phỏng vấn <em>khám phá</em> thứ bạn không biết để mà hỏi.</p>
<h3>Kịch bản phỏng vấn (protocol)</h3>
<p>Một <strong>protocol</strong> là bản hướng dẫn đã lên: mở đầu (tạo thiện cảm, xin đồng ý), câu làm nóng, câu cốt lõi (mở, về hành vi quá khứ thật), và kết. Bạn theo nó lỏng lẻo — người phỏng vấn giỏi bám theo những mạch thú vị.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">Thiện cảm + đồng ý</div><div class="lz-d">làm họ thoải mái, xin ghi âm</div></div>
  <div class="lz-step"><div class="lz-k">Làm nóng</div><div class="lz-t">Nền dễ</div><div class="lz-d">"kể tôi nghe một ngày của bạn"</div></div>
  <div class="lz-step"><div class="lz-k">Cốt lõi</div><div class="lz-t">Hành vi quá khứ</div><div class="lz-d">"lần gần nhất bạn… đã xảy ra gì?"</div></div>
  <div class="lz-step"><div class="lz-k">Kết</div><div class="lz-t">Còn gì nữa?</div><div class="lz-d">để họ bổ sung, cảm ơn</div></div>
</div>
<div class="out"><strong>Tốt (mở, về quá khứ):</strong> "Kể tôi nghe lần gần nhất bạn đặt phòng học. Bạn làm gì trước tiên?"
<strong>Tệ (mớm):</strong> "Một app đặt phòng nhanh hơn thì tuyệt nhỉ?" → ai cũng gật; bạn chẳng học được gì.
<strong>Tệ (giả định):</strong> "Bạn có dùng tính năng mà…?" → người ta rất dở khi dự đoán hành vi tương lai của mình.</div>
<div class="pitfall"><strong>Câu mớm & giả định đầu độc dữ liệu.</strong> Hỏi về sự kiện quá khứ cụ thể ("lần gần nhất…"), không hỏi ý kiến về tương lai ("bạn có sẽ…"). Và đừng bao giờ chào bán giải pháp giữa buổi phỏng vấn — bạn muốn VẤN ĐỀ của họ, không phải phép lịch sự.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>The Mom Test.</b> Quy tắc của Rob Fitzpatrick: hỏi những câu mà ngay cả mẹ bạn cũng không nói dối được — nói về <em>đời họ</em>, không phải <em>ý tưởng của bạn</em>; hỏi cụ thể trong quá khứ, không chung chung/ý kiến; và nghe nhiều hơn nói. Đó là bộ lọc tốt nhất chống lời động viên giả. <em>Không có trong syllabus Michigan nhưng là chuẩn ngành cho khám phá khách hàng.</em></div>
</div>`,
        },
        {
          title: '2.2 — Observation, data extraction & affinity walls|||2.2 — Quan sát, trích xuất dữ liệu & affinity wall',
          slug: 'wdu203c-2-2-affinity',
          type: 'VIDEO',
          description: 'Quan sát tại chỗ, trích các quan sát thành mẩu tin, và nhóm chúng thành affinity wall để tìm chủ đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>From raw quotes to insights: the affinity wall</h2>
<p class="lead">Interviews give you a pile of messy quotes and observations. <strong>Observation</strong> (watching people do the task in their real context) adds what they <em>do</em> vs what they <em>say</em>. But raw data isn't insight — you must synthesize.</p>
<h3>The bottom-up synthesis process</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Extract</div><div class="lz-d">one observation per sticky note</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cluster</div><div class="lz-d">group similar notes, no labels yet</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Label</div><div class="lz-d">name each cluster with a theme</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Insight</div><div class="lz-d">read themes → design implications</div></div>
</div>
<div class="out"><strong>Notes:</strong> "gave up after 3 taps", "asked a friend instead", "didn't trust the price", "screenshot to remember the room".
<strong>Cluster A (labelled "Low trust in the info"):</strong> "didn't trust the price" + "screenshot to remember".
<strong>Cluster B ("Faster to ask a human"):</strong> "gave up after 3 taps" + "asked a friend instead".
<strong>Insight:</strong> users abandon the app when it feels slower or less trustworthy than asking a person → design for speed + visible, trustworthy info.</div>
<p>Building the wall <em>bottom-up</em> (let themes emerge from notes) rather than <em>top-down</em> (sort into boxes you decided beforehand) is what stops you from just confirming your assumptions.</p>
<div class="callout ok"><strong>Say-do gap.</strong> People often can't accurately report their own behavior. Observation catches what interviews miss: someone says "I always compare prices" but you watch them buy the first result. When they conflict, trust behavior over self-report.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Personas & journey maps.</b> Teams often distill synthesis into a <em>persona</em> (a believable archetype user with goals/frustrations) and a <em>journey map</em> (the steps + emotions across a task, marking pain points). Both are communication tools that keep the whole team designing for the same person. <em>Introduced lightly here but heavily used in real UX teams.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Từ trích dẫn thô tới hiểu biết: affinity wall</h2>
<p class="lead">Phỏng vấn cho bạn một đống trích dẫn và quan sát lộn xộn. <strong>Quan sát</strong> (nhìn người ta làm nhiệm vụ trong bối cảnh thật) bổ sung thứ họ <em>làm</em> so với thứ họ <em>nói</em>. Nhưng dữ liệu thô chưa phải hiểu biết — bạn phải tổng hợp.</p>
<h3>Quy trình tổng hợp từ dưới lên</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Trích</div><div class="lz-d">một quan sát mỗi mẩu giấy dán</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gom cụm</div><div class="lz-d">nhóm mẩu giống nhau, chưa đặt tên</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đặt nhãn</div><div class="lz-d">đặt tên mỗi cụm bằng một chủ đề</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Hiểu biết</div><div class="lz-d">đọc chủ đề → hàm ý thiết kế</div></div>
</div>
<div class="out"><strong>Mẩu tin:</strong> "bỏ cuộc sau 3 lần chạm", "hỏi bạn thay vì app", "không tin giá", "chụp màn hình để nhớ phòng".
<strong>Cụm A (nhãn "Ít tin thông tin"):</strong> "không tin giá" + "chụp màn hình để nhớ".
<strong>Cụm B ("Hỏi người nhanh hơn"):</strong> "bỏ cuộc sau 3 lần chạm" + "hỏi bạn".
<strong>Hiểu biết:</strong> người dùng bỏ app khi thấy chậm hoặc kém tin cậy hơn hỏi một người → thiết kế cho tốc độ + thông tin rõ ràng, đáng tin.</div>
<p>Dựng affinity wall <em>từ dưới lên</em> (để chủ đề trồi lên từ mẩu tin) thay vì <em>từ trên xuống</em> (nhét vào các hộp bạn đã quyết trước) mới ngăn bạn chỉ xác nhận giả định của mình.</p>
<div class="callout ok"><strong>Khoảng cách nói-làm (say-do gap).</strong> Người ta thường không tường thuật chính xác hành vi của mình. Quan sát bắt được thứ phỏng vấn bỏ lỡ: ai đó nói "tôi luôn so giá" nhưng bạn thấy họ mua kết quả đầu tiên. Khi mâu thuẫn, tin hành vi hơn tự thuật.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Persona & journey map.</b> Đội thường chưng cất tổng hợp thành một <em>persona</em> (một mẫu người dùng đáng tin với mục tiêu/bực bội) và một <em>journey map</em> (các bước + cảm xúc qua một nhiệm vụ, đánh dấu điểm đau). Cả hai là công cụ truyền đạt giữ cả đội thiết kế cho cùng một người. <em>Giới thiệu nhẹ ở đây nhưng dùng rất nhiều trong đội UX thật.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Qualitative research (like interviews) is best for answering:|||Nghiên cứu định tính (như phỏng vấn) tốt nhất để trả lời:',
                options: [
                  'How many users clicked a button|||Bao nhiêu người dùng bấm một nút',
                  'Why and how users behave — goals, context, frustrations|||Vì sao và như thế nào người dùng hành xử — mục tiêu, bối cảnh, bực bội',
                  'Server response time|||Thời gian phản hồi máy chủ',
                  'The exact conversion percentage|||Tỷ lệ chuyển đổi chính xác',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which is the best interview question?|||Câu phỏng vấn nào tốt nhất?',
                options: [
                  'Wouldn\'t a cheaper option be better?|||Một lựa chọn rẻ hơn thì tốt hơn nhỉ?',
                  'Would you use an app that does X?|||Bạn có dùng app làm X không?',
                  'Walk me through the last time you did this task|||Kể tôi nghe lần gần nhất bạn làm nhiệm vụ này',
                  'Do you like our design?|||Bạn có thích thiết kế của bọn tôi không?',
                ], correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'An affinity wall is built best by:|||Affinity wall được dựng tốt nhất bằng cách:',
                options: [
                  'Sorting notes into categories you decided in advance|||Nhét mẩu tin vào các danh mục bạn quyết trước',
                  'Letting themes emerge bottom-up from clustered notes|||Để chủ đề trồi lên từ dưới lên từ các cụm mẩu tin',
                  'Counting how many notes there are|||Đếm xem có bao nhiêu mẩu tin',
                  'Only using quotes that support your idea|||Chỉ dùng trích dẫn ủng hộ ý tưởng của bạn',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The "say-do gap" means:|||"Khoảng cách nói-làm" nghĩa là:',
                options: [
                  'Users always tell the truth|||Người dùng luôn nói thật',
                  'What people report about their behavior can differ from what they actually do|||Điều người ta tường thuật về hành vi có thể khác điều họ thực sự làm',
                  'Designers should never observe users|||Nhà thiết kế không nên quan sát người dùng',
                  'Surveys are always better than observation|||Khảo sát luôn tốt hơn quan sát',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) The Mom Test advises you to:|||(Ngoài giáo trình) The Mom Test khuyên bạn:',
                options: [
                  'Talk about your idea and ask if they like it|||Nói về ý tưởng của bạn và hỏi họ có thích không',
                  'Talk about their life and specifics of the past, not your idea|||Nói về đời họ và cụ thể quá khứ, không phải ý tưởng của bạn',
                  'Only interview family members|||Chỉ phỏng vấn người nhà',
                  'Avoid recording anything|||Tránh ghi lại bất cứ gì',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — EVALUATING DESIGNS WITH USERS ══════════════════ */
    {
      title: 'Chapter 3 — Evaluating designs with users|||Chương 3 — Đánh giá thiết kế với người dùng',
      description: 'Coursera 3/6: usability testing là gì, cách điều phối buổi think-aloud, và phân tích + viết báo cáo.',
      lessons: [
        {
          title: '3.1 — Usability testing & the think-aloud method|||3.1 — Kiểm thử khả dụng & phương pháp think-aloud',
          slug: 'wdu203c-3-1-usability-testing',
          type: 'VIDEO',
          description: 'Cách thiết kế nhiệm vụ test, điều phối buổi think-aloud, và vì sao 5 người là đủ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Watch real users try real tasks — the fastest way to find problems</h2>
<p class="lead">A <strong>usability test</strong> gives a real user a realistic task and watches them attempt it on your design (or prototype). You are testing the <em>design</em>, not the user — if they fail, the design failed.</p>
<h3>Anatomy of a session</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Task, not tour</div><div class="lz-d">"book a room for tomorrow 3pm"</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Think aloud</div><div class="lz-d">"say what you're thinking"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Don't help</div><div class="lz-d">stay silent; let them struggle</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Probe after</div><div class="lz-d">"what did you expect there?"</div></div>
</div>
<div class="pitfall"><strong>The moderator's hardest job: shut up.</strong> The instinct to rescue a stuck user destroys your data — their struggle IS the finding. Don't lead ("try the menu"), don't defend the design, don't ask "was that easy?" (they'll be polite). Give the task, then mostly stay quiet.</div>
<h3>Why 5 users?</h3>
<div class="formula"><span class="lbl">NIELSEN</span> problems found ≈ 1 − (1 − L)ⁿ &nbsp;·&nbsp; with L ≈ 0.31, n = 5 → ~85% of usability problems</div>
<p>Testing 5 users per round finds about 85% of problems. Beyond 5 you mostly re-see the same issues — better to fix them and test 5 <em>more</em> on the improved design (iterative testing) than to run one giant 15-person test.</p>
<div class="callout ok"><strong>Formative vs summative.</strong> <em>Formative</em> testing happens <em>during</em> design to find and fix problems (small n, qualitative, "why"). <em>Summative</em> testing happens <em>after</em>, to measure/benchmark (larger n, quantitative, "how well"). Most course work is formative.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Moderated vs unmoderated.</b> <em>Moderated</em> tests have a live facilitator (rich, but slow/expensive). <em>Unmoderated</em> tools (Maze, Useberry) let users do tasks alone while the tool records taps and time — cheap and fast for many users, but you can't ask follow-ups. Real teams mix both. <em>The moderated/unmoderated axis matters for the capstone but is only implied in the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Xem người dùng thật làm nhiệm vụ thật — cách nhanh nhất tìm lỗi</h2>
<p class="lead">Một buổi <strong>usability test</strong> giao cho người dùng thật một nhiệm vụ thực tế và xem họ thử làm trên thiết kế (hoặc prototype) của bạn. Bạn đang test <em>thiết kế</em>, không phải người dùng — nếu họ thất bại, thiết kế thất bại.</p>
<h3>Giải phẫu một buổi test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Nhiệm vụ, không dẫn tour</div><div class="lz-d">"đặt phòng cho 15h mai"</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nghĩ thành lời</div><div class="lz-d">"nói ra bạn đang nghĩ gì"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đừng giúp</div><div class="lz-d">im lặng; để họ vật lộn</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Hỏi sâu sau</div><div class="lz-d">"bạn mong gì ở chỗ đó?"</div></div>
</div>
<div class="pitfall"><strong>Việc khó nhất của người điều phối: im miệng.</strong> Bản năng cứu người dùng đang kẹt phá huỷ dữ liệu — sự vật lộn của họ CHÍNH LÀ phát hiện. Đừng dẫn ("thử menu đi"), đừng bênh thiết kế, đừng hỏi "vậy dễ không?" (họ sẽ lịch sự). Giao nhiệm vụ, rồi phần lớn giữ im lặng.</div>
<h3>Vì sao 5 người?</h3>
<div class="formula"><span class="lbl">NIELSEN</span> lỗi tìm được ≈ 1 − (1 − L)ⁿ &nbsp;·&nbsp; với L ≈ 0.31, n = 5 → ~85% lỗi khả dụng</div>
<p>Test 5 người mỗi vòng tìm ra khoảng 85% lỗi. Quá 5, bạn phần lớn thấy lại cùng những lỗi cũ — tốt hơn nên sửa chúng rồi test 5 người <em>nữa</em> trên bản cải tiến (test lặp) thay vì chạy một buổi khổng lồ 15 người.</p>
<div class="callout ok"><strong>Formative vs summative.</strong> Test <em>formative</em> xảy ra <em>trong khi</em> thiết kế để tìm và sửa lỗi (n nhỏ, định tính, "vì sao"). Test <em>summative</em> xảy ra <em>sau đó</em>, để đo/đối chuẩn (n lớn hơn, định lượng, "tốt đến đâu"). Phần lớn bài trên lớp là formative.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Có điều phối vs không điều phối.</b> Test <em>có điều phối (moderated)</em> có người dẫn trực tiếp (giàu thông tin, nhưng chậm/tốn). Công cụ <em>không điều phối (unmoderated)</em> (Maze, Useberry) để người dùng làm nhiệm vụ một mình trong khi công cụ ghi lại thao tác và thời gian — rẻ và nhanh cho nhiều người, nhưng không hỏi thêm được. Đội thật trộn cả hai. <em>Trục moderated/unmoderated quan trọng cho capstone nhưng syllabus chỉ ngụ ý.</em></div>
</div>`,
        },
        {
          title: '3.2 — Analysis & the user test report|||3.2 — Phân tích & báo cáo kiểm thử',
          slug: 'wdu203c-3-2-test-report',
          type: 'VIDEO',
          description: 'Biến quan sát test thành phát hiện xếp hạng theo mức nghiêm trọng và một báo cáo đội có thể hành động.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>A test is worthless until it becomes a ranked list of fixes</h2>
<p class="lead">After sessions you have notes, recordings, and metrics. Analysis turns them into <strong>findings</strong> — patterns seen across users — each rated by severity so the team knows what to fix first.</p>
<h3>Metrics you can capture</h3>
<table>
<thead><tr><th>Metric</th><th>What it tells you</th></tr></thead>
<tbody>
<tr><td>Task success rate</td><td>Could they finish at all? (effectiveness)</td></tr>
<tr><td>Time on task</td><td>How efficient was it?</td></tr>
<tr><td>Error count</td><td>Where do people slip?</td></tr>
<tr><td>Satisfaction (e.g. SUS)</td><td>How did it feel?</td></tr>
</tbody>
</table>
<div class="out"><strong>From 5 sessions →</strong>
<strong>Finding 1</strong> (4/5 users): couldn't find "cancel booking" — looked in profile, not the booking. Severity 4.
<strong>Finding 2</strong> (3/5): mistook the read-only date for editable. Severity 3.
<strong>Finding 3</strong> (2/5): wanted a confirmation email. Severity 2.
<strong>Report =</strong> goal + method + participants + findings (ranked) + recommendations + evidence clips.</div>
<p>A good report leads with the <em>most severe, most frequent</em> issues and pairs each with a concrete recommendation and a quote/clip as evidence. Stakeholders act on evidence, not opinion.</p>
<div class="callout ok"><strong>Severity = frequency × impact × persistence.</strong> An issue that hits everyone (frequent), blocks the task (high impact), and recurs even after they "learn" it (persistent) is a 4 — fix first. A cosmetic nit one person hit once is a 1.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Triangulate methods.</b> Strong UX conclusions combine sources: usability test (behavior) + interview quotes (why) + analytics (scale). If all three point the same way, you can act confidently; if they disagree, you've found something worth digging into. <em>Triangulation is a research-quality idea the capstone rewards but the syllabus doesn't name.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Một buổi test vô giá trị cho tới khi thành danh sách sửa xếp hạng</h2>
<p class="lead">Sau các buổi test bạn có ghi chú, bản ghi và chỉ số. Phân tích biến chúng thành <strong>phát hiện (finding)</strong> — mẫu thấy được trên nhiều người dùng — mỗi cái chấm mức nghiêm trọng để đội biết sửa gì trước.</p>
<h3>Chỉ số bạn có thể thu</h3>
<table>
<thead><tr><th>Chỉ số</th><th>Nó cho bạn biết gì</th></tr></thead>
<tbody>
<tr><td>Tỷ lệ hoàn thành nhiệm vụ</td><td>Họ có làm xong được không? (hiệu lực)</td></tr>
<tr><td>Thời gian làm nhiệm vụ</td><td>Hiệu quả đến đâu?</td></tr>
<tr><td>Số lỗi</td><td>Người ta trượt ở đâu?</td></tr>
<tr><td>Độ hài lòng (vd SUS)</td><td>Cảm giác thế nào?</td></tr>
</tbody>
</table>
<div class="out"><strong>Từ 5 buổi →</strong>
<strong>Phát hiện 1</strong> (4/5 người): không tìm ra "huỷ đặt phòng" — tìm trong profile, không phải ở đơn đặt. Mức 4.
<strong>Phát hiện 2</strong> (3/5): tưởng ngày chỉ-đọc là sửa được. Mức 3.
<strong>Phát hiện 3</strong> (2/5): muốn có email xác nhận. Mức 2.
<strong>Báo cáo =</strong> mục tiêu + phương pháp + người tham gia + phát hiện (xếp hạng) + khuyến nghị + clip bằng chứng.</div>
<p>Một báo cáo tốt mở đầu bằng vấn đề <em>nghiêm trọng nhất, thường gặp nhất</em> và ghép mỗi cái với một khuyến nghị cụ thể cùng một trích dẫn/clip làm bằng chứng. Các bên liên quan hành động theo bằng chứng, không theo ý kiến.</p>
<div class="callout ok"><strong>Mức = tần suất × tác động × dai dẳng.</strong> Một lỗi trúng mọi người (thường gặp), chặn nhiệm vụ (tác động cao), và lặp lại kể cả sau khi họ "học" được (dai dẳng) là mức 4 — sửa trước. Một tì vết thẩm mỹ một người gặp một lần là mức 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tam giác hoá phương pháp.</b> Kết luận UX mạnh kết hợp nhiều nguồn: usability test (hành vi) + trích dẫn phỏng vấn (vì sao) + analytics (quy mô). Nếu cả ba chỉ cùng hướng, bạn hành động tự tin; nếu bất đồng, bạn tìm ra thứ đáng đào sâu. <em>Tam giác hoá là ý về chất lượng nghiên cứu mà capstone thưởng nhưng syllabus không nêu tên.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In a usability test, if the user fails the task, it means:|||Trong usability test, nếu người dùng thất bại nhiệm vụ, điều đó nghĩa là:',
                options: [
                  'The user is not smart enough|||Người dùng không đủ thông minh',
                  'The design has a problem to fix|||Thiết kế có một vấn đề cần sửa',
                  'You should pick easier users|||Bạn nên chọn người dùng dễ hơn',
                  'The test is invalid|||Buổi test không hợp lệ',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The "think-aloud" method asks the participant to:|||Phương pháp "think-aloud" yêu cầu người tham gia:',
                options: [
                  'Stay completely silent|||Giữ hoàn toàn im lặng',
                  'Say what they are thinking as they work|||Nói ra điều họ đang nghĩ khi thao tác',
                  'Rate the design 1-10 first|||Chấm thiết kế 1-10 trước',
                  'Read the instructions aloud|||Đọc to hướng dẫn',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Roughly how many users per round does Nielsen suggest to find ~85% of usability problems?|||Nielsen gợi ý khoảng bao nhiêu người mỗi vòng để tìm ~85% lỗi khả dụng?',
                options: ['1', '5', '30', '100'],
                correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Formative usability testing is mainly used to:|||Test khả dụng formative chủ yếu dùng để:',
                options: [
                  'Benchmark a finished product with large numbers|||Đối chuẩn sản phẩm hoàn thiện với số lượng lớn',
                  'Find and fix problems during design (small n, qualitative)|||Tìm và sửa lỗi trong khi thiết kế (n nhỏ, định tính)',
                  'Measure server load|||Đo tải máy chủ',
                  'Replace all research|||Thay thế mọi nghiên cứu',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Which issue should a report recommend fixing FIRST?|||Báo cáo nên khuyến nghị sửa vấn đề nào TRƯỚC?',
                options: [
                  'A cosmetic nit one user hit once (severity 1)|||Một tì vết thẩm mỹ một người gặp một lần (mức 1)',
                  'A task-blocking issue 4 of 5 users hit (severity 4)|||Một lỗi chặn nhiệm vụ 4/5 người gặp (mức 4)',
                  'A nice-to-have feature request|||Một đề xuất tính năng có thì tốt',
                  'Whatever is easiest to fix|||Cái gì dễ sửa nhất',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — CONCEPT TO WIREFRAME ══════════════════ */
    {
      title: 'Chapter 4 — UX design: from concept to prototype|||Chương 4 — Thiết kế UX: từ ý tưởng tới prototype',
      description: 'Coursera 4/6: quy trình thiết kế, ideation, sketch/scenario/storyboard, wireframe và prototype lo→hi fidelity.',
      lessons: [
        {
          title: '4.1 — Ideation, sketching, scenarios & storyboards|||4.1 — Ideation, sketch, scenario & storyboard',
          slug: 'wdu203c-4-1-ideation',
          type: 'VIDEO',
          description: 'Sinh nhiều ý tưởng trước khi chọn, và dùng sketch/scenario/storyboard để nghĩ bằng hình ảnh thật rẻ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Generate many ideas before you fall in love with one</h2>
<p class="lead">Design starts by <strong>diverging</strong> — producing lots of candidate ideas — before <strong>converging</strong> on the strongest. Jumping to the first idea is the classic trap; the first idea is rarely the best, and you can't compare against alternatives you never drew.</p>
<h3>The cheap thinking tools</h3>
<table>
<thead><tr><th>Tool</th><th>What it is</th><th>Answers</th></tr></thead>
<tbody>
<tr><td>Sketch</td><td>Rough hand drawing of a screen/idea</td><td>What could it look like?</td></tr>
<tr><td>Scenario</td><td>A short story of a user reaching a goal</td><td>What's the flow, in context?</td></tr>
<tr><td>Storyboard</td><td>A comic-strip of key moments</td><td>How does the experience unfold over time?</td></tr>
</tbody>
</table>
<div class="out"><strong>Scenario example:</strong> "Mai, between classes, opens the app to grab lunch. She sees her usual order pinned at the top, taps 'reorder', picks a pickup time, and pays — 20 seconds, no queue."
<strong>Why it helps:</strong> it exposes needs (a 'usual order', pickup time, speed) BEFORE you design a single button — so the screens serve the story, not the other way round.</div>
<p>Sketching by hand (not in Figma yet) is deliberate: it's fast, disposable, and keeps you from polishing a bad idea. Ten ugly sketches beat one pretty mockup this early.</p>
<div class="callout ok"><strong>Diverge, then converge.</strong> Techniques like Crazy 8s (eight sketches in eight minutes) force quantity, which fights premature attachment. Then use criteria (does it fit user needs? feasible? distinctive?) to converge on 1-2 to prototype.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Design studio / parallel design.</b> Research shows teams that design <em>in parallel</em> (everyone sketches independently, then critiques together) reach better outcomes than a single shared design, because it surfaces diverse approaches before groupthink sets in. <em>A team technique the capstone benefits from but the syllabus doesn't require.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Sinh nhiều ý tưởng trước khi phải lòng một cái</h2>
<p class="lead">Thiết kế bắt đầu bằng <strong>mở rộng (diverge)</strong> — tạo ra nhiều ý tưởng ứng viên — trước khi <strong>hội tụ (converge)</strong> vào cái mạnh nhất. Nhảy ngay vào ý tưởng đầu là cái bẫy kinh điển; ý tưởng đầu hiếm khi tốt nhất, và bạn không thể so với những phương án chưa bao giờ vẽ ra.</p>
<h3>Các công cụ tư duy rẻ tiền</h3>
<table>
<thead><tr><th>Công cụ</th><th>Là gì</th><th>Trả lời</th></tr></thead>
<tbody>
<tr><td>Sketch</td><td>Vẽ tay thô một màn hình/ý tưởng</td><td>Nó có thể trông thế nào?</td></tr>
<tr><td>Scenario</td><td>Một câu chuyện ngắn người dùng đạt mục tiêu</td><td>Luồng ra sao, trong bối cảnh?</td></tr>
<tr><td>Storyboard</td><td>Một dải truyện tranh các khoảnh khắc chính</td><td>Trải nghiệm diễn ra theo thời gian thế nào?</td></tr>
</tbody>
</table>
<div class="out"><strong>Ví dụ scenario:</strong> "Mai, giữa hai tiết, mở app để mua bữa trưa. Cô thấy đơn quen được ghim trên cùng, chạm 'đặt lại', chọn giờ lấy, và trả tiền — 20 giây, không xếp hàng."
<strong>Vì sao hữu ích:</strong> nó phơi bày nhu cầu (một 'đơn quen', giờ lấy, tốc độ) TRƯỚC KHI bạn thiết kế dù chỉ một nút — nên màn hình phục vụ câu chuyện, không ngược lại.</div>
<p>Vẽ tay (chưa vào Figma) là có chủ đích: nhanh, vứt được, và giữ bạn khỏi đánh bóng một ý tưởng tồi. Mười sketch xấu hơn một mockup đẹp ở giai đoạn sớm này.</p>
<div class="callout ok"><strong>Mở rộng, rồi hội tụ.</strong> Kỹ thuật như Crazy 8s (tám sketch trong tám phút) ép số lượng, chống việc bám dính sớm. Rồi dùng tiêu chí (có khớp nhu cầu người dùng? khả thi? khác biệt?) để hội tụ về 1-2 cái đem prototype.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Design studio / thiết kế song song.</b> Nghiên cứu cho thấy đội thiết kế <em>song song</em> (mỗi người sketch độc lập, rồi cùng phê bình) đạt kết quả tốt hơn một thiết kế chung duy nhất, vì nó phơi bày các cách tiếp cận đa dạng trước khi tư duy bầy đàn đặt vào. <em>Một kỹ thuật đội mà capstone hưởng lợi nhưng syllabus không bắt buộc.</em></div>
</div>`,
        },
        {
          title: '4.2 — Wireframes & lo→hi fidelity prototyping|||4.2 — Wireframe & prototype từ thấp tới cao độ trung thực',
          slug: 'wdu203c-4-2-prototyping',
          type: 'VIDEO',
          description: 'Wireframe, các mức fidelity, và biến wireframe thành prototype tương tác kiểm thử được (CLO6).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Prototype at the lowest fidelity that can answer your question</h2>
<p class="lead">A <strong>wireframe</strong> is a stripped-down layout — boxes, labels, hierarchy — with no color or real content, so people react to <em>structure and flow</em> instead of "I don't like blue." A <strong>prototype</strong> makes it interactive so users can actually attempt a task.</p>
<h3>The fidelity ladder</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lo-fi</div><div class="lz-t">Paper / boxes</div><div class="lz-d">test flow &amp; concept, minutes to make</div></div>
  <div class="lz-step"><div class="lz-k">Mid-fi</div><div class="lz-t">Clickable wireframe</div><div class="lz-d">test navigation &amp; layout</div></div>
  <div class="lz-step"><div class="lz-k">Hi-fi</div><div class="lz-t">Realistic UI</div><div class="lz-d">test visual, micro-interactions, polish</div></div>
</div>
<div class="out"><strong>Turning wireframes into a prototype (CLO6), in Figma:</strong>
1. Lay out each screen as a frame (list → detail → confirm).
2. Add hotspots: link the "Book" button on screen 1 → screen 2.
3. Set the interaction (on tap → navigate) and a transition.
4. Open Present mode → now a user can tap through the real flow.
5. Give a tester the task "book tomorrow 3pm" and watch — no code written.</div>
<div class="pitfall"><strong>Don't over-polish too early.</strong> A hi-fi prototype tempts users to comment on colors while ignoring a broken flow, and it's expensive to change — so people defend it instead of fixing it (sunk-cost). Match fidelity to the question: testing "is the flow right?" → lo-fi is better <em>and</em> cheaper.</div>
<div class="callout ok"><strong>Prototype = a question, not a product.</strong> Every prototype should be built to answer one thing ("can users find checkout?"). Build only enough to answer it, test, throw it away, and build the next. This is the develop→test loop of the double diamond in action.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Wireflow.</b> A <em>wireflow</em> combines wireframes with a flowchart — showing each screen AND the decisions/branches between them (what happens on error, on empty state). It communicates dynamic behavior that static wireframes miss, and is invaluable for handing off to developers. <em>A practitioner artifact beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Prototype ở mức fidelity thấp nhất đủ trả lời câu hỏi của bạn</h2>
<p class="lead">Một <strong>wireframe</strong> là bố cục lược bỏ — hộp, nhãn, thứ bậc — không màu, không nội dung thật, để người ta phản ứng với <em>cấu trúc và luồng</em> thay vì "tôi không thích màu xanh". Một <strong>prototype</strong> làm nó tương tác để người dùng thực sự thử một nhiệm vụ.</p>
<h3>Thang độ trung thực (fidelity)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lo-fi</div><div class="lz-t">Giấy / hộp</div><div class="lz-d">test luồng &amp; concept, làm trong vài phút</div></div>
  <div class="lz-step"><div class="lz-k">Mid-fi</div><div class="lz-t">Wireframe bấm được</div><div class="lz-d">test điều hướng &amp; bố cục</div></div>
  <div class="lz-step"><div class="lz-k">Hi-fi</div><div class="lz-t">UI thực tế</div><div class="lz-d">test hình ảnh, vi tương tác, độ hoàn thiện</div></div>
</div>
<div class="out"><strong>Biến wireframe thành prototype (CLO6), trong Figma:</strong>
1. Bố trí mỗi màn thành một frame (danh sách → chi tiết → xác nhận).
2. Thêm hotspot: nối nút "Đặt" ở màn 1 → màn 2.
3. Đặt tương tác (khi chạm → điều hướng) và một chuyển cảnh.
4. Mở chế độ Present → giờ người dùng có thể chạm qua luồng thật.
5. Giao người test nhiệm vụ "đặt 15h mai" và quan sát — không viết dòng code nào.</div>
<div class="pitfall"><strong>Đừng đánh bóng quá sớm.</strong> Một prototype hi-fi dụ người dùng bình luận về màu sắc trong khi bỏ qua luồng hỏng, và nó tốn kém để đổi — nên người ta bênh nó thay vì sửa (chi phí chìm). Khớp fidelity với câu hỏi: test "luồng có đúng không?" → lo-fi tốt hơn <em>và</em> rẻ hơn.</div>
<div class="callout ok"><strong>Prototype = một câu hỏi, không phải sản phẩm.</strong> Mỗi prototype nên được dựng để trả lời một thứ ("người dùng có tìm ra checkout?"). Chỉ dựng đủ để trả lời nó, test, vứt đi, và dựng cái tiếp. Đây là vòng phát-triển→kiểm-thử của double diamond đang chạy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Wireflow.</b> Một <em>wireflow</em> kết hợp wireframe với sơ đồ luồng — hiện mỗi màn VÀ các quyết định/nhánh giữa chúng (xảy ra gì khi lỗi, khi trạng thái rỗng). Nó truyền đạt hành vi động mà wireframe tĩnh bỏ lỡ, và cực quý khi bàn giao cho lập trình viên. <em>Một tạo tác của người hành nghề ngoài syllabus.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Why sketch many ideas by hand before designing in a tool?|||Vì sao sketch nhiều ý tưởng bằng tay trước khi thiết kế trong công cụ?',
                options: [
                  'Because hand drawing is more accurate|||Vì vẽ tay chính xác hơn',
                  'To diverge cheaply and avoid attaching to the first idea|||Để mở rộng rẻ và tránh bám dính ý tưởng đầu tiên',
                  'Because tools are not allowed|||Vì không được dùng công cụ',
                  'To make the final UI|||Để làm ra UI cuối cùng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'A wireframe deliberately omits color and real content so that reviewers focus on:|||Wireframe cố tình bỏ màu và nội dung thật để người xem tập trung vào:',
                options: [
                  'Brand identity|||Bản sắc thương hiệu',
                  'Structure, layout and flow|||Cấu trúc, bố cục và luồng',
                  'Font licensing|||Bản quyền font',
                  'Animation timing|||Thời lượng animation',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'To test whether the basic task flow is right, which fidelity is usually best?|||Để test xem luồng nhiệm vụ cơ bản có đúng không, mức fidelity nào thường tốt nhất?',
                options: [
                  'High fidelity, fully polished|||Cao, hoàn thiện đầy đủ',
                  'Low fidelity, quick and disposable|||Thấp, nhanh và vứt được',
                  'Only real production code|||Chỉ code sản phẩm thật',
                  'No prototype at all|||Không prototype gì cả',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Turning wireframes into an interactive prototype (CLO6) mainly means:|||Biến wireframe thành prototype tương tác (CLO6) chủ yếu nghĩa là:',
                options: [
                  'Writing backend code|||Viết code backend',
                  'Linking screens with hotspots so users can tap through a task|||Nối các màn bằng hotspot để người dùng chạm qua một nhiệm vụ',
                  'Adding a database|||Thêm cơ sở dữ liệu',
                  'Publishing to an app store|||Đăng lên app store',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) One risk of an over-polished hi-fi prototype tested too early is:|||(Ngoài giáo trình) Một rủi ro của prototype hi-fi quá bóng bẩy đem test quá sớm là:',
                options: [
                  'It is too cheap to build|||Nó quá rẻ để dựng',
                  'Users comment on visuals and the team defends it instead of fixing the flow (sunk cost)|||Người dùng bình luận hình ảnh và đội bênh nó thay vì sửa luồng (chi phí chìm)',
                  'It cannot be tested|||Nó không thể test được',
                  'It always fails|||Nó luôn thất bại',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — UX RESEARCH AT SCALE ══════════════════ */
    {
      title: 'Chapter 5 — UX research at scale|||Chương 5 — Nghiên cứu UX ở quy mô lớn',
      description: 'Coursera 5/6: khảo sát & 3 loại lỗi, behavioral analytics, remote testing, A/B & preference testing.',
      lessons: [
        {
          title: '5.1 — Surveys & the three survey errors|||5.1 — Khảo sát & ba loại lỗi khảo sát',
          slug: 'wdu203c-5-1-surveys',
          type: 'VIDEO',
          description: 'Khi nào dùng khảo sát, và ba nguồn lỗi: coverage, nonresponse, measurement — cùng cách viết câu hỏi tốt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Surveys measure at scale — but only if you avoid three errors</h2>
<p class="lead">Where interviews <em>discover</em>, surveys <em>quantify</em> ("how common is this?") across many people. Their power is scale; their danger is that a badly-built survey confidently produces <em>wrong</em> numbers. Michigan frames survey quality as avoiding three errors.</p>
<table>
<thead><tr><th>Error</th><th>Question it fails</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Coverage error</td><td>Did I include the right people at all?</td><td>Only surveying app users misses people who quit the app</td></tr>
<tr><td>Nonresponse error</td><td>Are responders different from non-responders?</td><td>Only happy users bother to reply → rosy bias</td></tr>
<tr><td>Measurement error</td><td>Does the question measure what I think?</td><td>Vague/leading wording produces noisy answers</td></tr>
</tbody>
</table>
<h3>Writing questions that measure cleanly</h3>
<div class="out"><strong>Leading:</strong> "How great was our fast checkout?" → biased. <strong>Better:</strong> "How would you rate the checkout speed?" (1-5).
<strong>Double-barreled:</strong> "Was the app fast and easy?" → which one? Split into two.
<strong>Vague scale:</strong> "often / sometimes" → define it: "0-1 / 2-4 / 5+ times per week".
<strong>Loaded assumption:</strong> "How much did you enjoy the reminders?" assumes they did.</div>
<div class="pitfall"><strong>Sampling decides validity before wording ever matters.</strong> A perfectly-worded survey sent only to your friends tells you about your friends. Decide who must be represented, then reach them — coverage and nonresponse errors sink more student surveys than bad questions do.</div>
<div class="callout ok"><strong>Closed vs open questions.</strong> Closed (scales, multiple choice) are easy to quantify but limited to options you thought of. A few open questions ("what almost stopped you?") catch the surprises. Use mostly closed for scale, a couple open for discovery.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sampling error & confidence.</b> Even a perfect survey of a random sample has <em>sampling error</em> — the margin of uncertainty from not asking everyone (shrinks with √n). This is why "63% (±4%)" is honest and "63%" alone is not, and why tiny samples can't support confident percentages. <em>A statistics link the syllabus assumes from MAS291 but doesn't re-teach.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Khảo sát đo ở quy mô lớn — nhưng chỉ khi bạn tránh ba loại lỗi</h2>
<p class="lead">Nơi phỏng vấn <em>khám phá</em>, khảo sát <em>định lượng</em> ("cái này phổ biến đến đâu?") trên nhiều người. Sức mạnh của nó là quy mô; nguy hiểm là một khảo sát dựng tồi tự tin cho ra con số <em>sai</em>. Michigan đóng khung chất lượng khảo sát là tránh ba loại lỗi.</p>
<table>
<thead><tr><th>Lỗi</th><th>Câu hỏi nó trượt</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Lỗi bao phủ (coverage)</td><td>Tôi có bao gồm đúng người ngay từ đầu không?</td><td>Chỉ khảo sát người dùng app → bỏ sót người đã bỏ app</td></tr>
<tr><td>Lỗi không phản hồi (nonresponse)</td><td>Người trả lời có khác người không trả lời?</td><td>Chỉ người hài lòng chịu trả lời → thiên lệch hồng</td></tr>
<tr><td>Lỗi đo lường (measurement)</td><td>Câu hỏi có đo đúng thứ tôi nghĩ?</td><td>Từ ngữ mơ hồ/mớm cho ra câu trả lời nhiễu</td></tr>
</tbody>
</table>
<h3>Viết câu hỏi đo sạch</h3>
<div class="out"><strong>Mớm:</strong> "Thanh toán nhanh của chúng tôi tuyệt cỡ nào?" → thiên lệch. <strong>Tốt hơn:</strong> "Bạn đánh giá tốc độ thanh toán thế nào?" (1-5).
<strong>Hai nòng:</strong> "App có nhanh và dễ không?" → cái nào? Tách thành hai.
<strong>Thang mơ hồ:</strong> "thường xuyên / thỉnh thoảng" → định nghĩa: "0-1 / 2-4 / 5+ lần mỗi tuần".
<strong>Giả định cài sẵn:</strong> "Bạn thích các lời nhắc đến mức nào?" giả định là họ có thích.</div>
<div class="pitfall"><strong>Chọn mẫu quyết định tính hợp lệ trước cả khi từ ngữ có ý nghĩa.</strong> Một khảo sát diễn đạt hoàn hảo nhưng chỉ gửi cho bạn bè bạn thì chỉ nói về bạn bè bạn. Quyết ai phải được đại diện, rồi tiếp cận họ — lỗi bao phủ và không phản hồi nhấn chìm nhiều khảo sát sinh viên hơn cả câu hỏi tồi.</div>
<div class="callout ok"><strong>Câu đóng vs mở.</strong> Câu đóng (thang, trắc nghiệm) dễ định lượng nhưng giới hạn ở các lựa chọn bạn nghĩ ra. Vài câu mở ("điều gì suýt ngăn bạn?") bắt được bất ngờ. Dùng chủ yếu câu đóng cho quy mô, vài câu mở để khám phá.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lỗi lấy mẫu & độ tin cậy.</b> Ngay cả một khảo sát hoàn hảo trên mẫu ngẫu nhiên vẫn có <em>lỗi lấy mẫu</em> — biên độ bất định do không hỏi tất cả (co lại theo √n). Vì thế "63% (±4%)" là trung thực còn "63%" trơ trọi thì không, và vì sao mẫu quá nhỏ không thể chống lưng cho phần trăm tự tin. <em>Một liên kết thống kê syllabus giả định từ MAS291 nhưng không dạy lại.</em></div>
</div>`,
        },
        {
          title: '5.2 — Analytics, remote & A/B testing|||5.2 — Analytics, remote & A/B testing',
          slug: 'wdu203c-5-2-analytics-ab',
          type: 'VIDEO',
          description: 'Behavioral analytics, remote testing, và A/B test — đo hành vi thật của số đông và so hai phương án bằng dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>At scale, watch what people do — not only what they say</h2>
<p class="lead">Once a product is live, thousands of real users generate behavioral data. This complements interviews (deep but few) with analytics (shallow but many). The three big tools at scale are analytics, remote testing, and A/B testing.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Behavioral analytics</span> What users actually do: funnels (where they drop off), heatmaps (where they tap), retention. Tells you <em>where</em> a problem is, rarely <em>why</em>.</div>
  <div class="lz-layer"><span class="lz-lk">Remote testing</span> Usability tasks done by users anywhere — moderated (video call) or unmoderated (tool records). Scales research beyond your city.</div>
  <div class="lz-layer"><span class="lz-lk">A/B &amp; preference testing</span> Show version A to half, version B to half; measure which performs better on a real metric. Preference tests just ask which of two designs people prefer.</div>
</div>
<h3>How an A/B test decides</h3>
<div class="out"><strong>Question:</strong> does a green "Book now" button beat a blue one on completion?
<strong>Setup:</strong> randomly show A (blue) or B (green); everything else identical.
<strong>Result:</strong> A = 8.0% complete, B = 9.6% complete over 5,000 users each.
<strong>Check:</strong> is the gap real or luck? → statistical significance (p-value / confidence). Only ship B if the difference is unlikely to be chance.</div>
<div class="pitfall"><strong>Analytics shows WHERE, not WHY.</strong> A funnel screaming "70% drop at step 3" doesn't tell you the cause — confusing label? broken button? scary price? You pair the quantitative "where" with qualitative "why" (a few user tests on step 3). Numbers without stories lead to guessing.</div>
<div class="callout ok"><strong>Match method to question.</strong> Discovery → interviews. How common? → survey. Where do users fail? → analytics. Which design wins on a metric? → A/B test. Does the flow work at all? → usability test. Great researchers pick the cheapest method that answers the actual question.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Peeking & the significance trap.</b> Stopping an A/B test the moment it "looks significant" (peeking) massively inflates false positives — you must fix sample size in advance or use sequential methods. Many real product teams ship losing variants because they called the test early. <em>An experiment-design caution beyond the syllabus but vital in practice.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Ở quy mô lớn, xem người ta LÀM gì — không chỉ nói gì</h2>
<p class="lead">Khi sản phẩm đã chạy, hàng nghìn người dùng thật sinh ra dữ liệu hành vi. Điều này bổ trợ cho phỏng vấn (sâu nhưng ít) bằng analytics (nông nhưng nhiều). Ba công cụ lớn ở quy mô là analytics, remote testing, và A/B testing.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Behavioral analytics</span> Người dùng thực sự làm gì: funnel (rớt ở đâu), heatmap (chạm ở đâu), retention. Cho bạn biết vấn đề ở <em>đâu</em>, hiếm khi <em>vì sao</em>.</div>
  <div class="lz-layer"><span class="lz-lk">Remote testing</span> Nhiệm vụ khả dụng do người dùng ở bất cứ đâu làm — có điều phối (gọi video) hoặc không (công cụ ghi lại). Mở rộng nghiên cứu ra ngoài thành phố bạn.</div>
  <div class="lz-layer"><span class="lz-lk">A/B &amp; preference testing</span> Cho một nửa xem bản A, một nửa xem bản B; đo bản nào tốt hơn trên một chỉ số thật. Preference test chỉ hỏi người ta thích bản nào hơn trong hai.</div>
</div>
<h3>Một A/B test quyết định thế nào</h3>
<div class="out"><strong>Câu hỏi:</strong> nút "Đặt ngay" màu xanh lá có thắng màu xanh dương về tỷ lệ hoàn thành?
<strong>Bố trí:</strong> ngẫu nhiên hiện A (xanh dương) hoặc B (xanh lá); mọi thứ khác y hệt.
<strong>Kết quả:</strong> A = 8.0% hoàn thành, B = 9.6% hoàn thành trên mỗi 5.000 người.
<strong>Kiểm:</strong> chênh lệch thật hay do may? → ý nghĩa thống kê (p-value / độ tin cậy). Chỉ ra mắt B nếu khác biệt khó là ngẫu nhiên.</div>
<div class="pitfall"><strong>Analytics cho thấy Ở ĐÂU, không phải VÌ SAO.</strong> Một funnel hét "rớt 70% ở bước 3" không cho bạn nguyên nhân — nhãn khó hiểu? nút hỏng? giá đáng sợ? Bạn ghép "ở đâu" định lượng với "vì sao" định tính (vài buổi test trên bước 3). Con số không có câu chuyện dẫn tới đoán mò.</div>
<div class="callout ok"><strong>Khớp phương pháp với câu hỏi.</strong> Khám phá → phỏng vấn. Phổ biến đến đâu? → khảo sát. Người dùng thất bại ở đâu? → analytics. Thiết kế nào thắng trên một chỉ số? → A/B test. Luồng có chạy không? → usability test. Nhà nghiên cứu giỏi chọn phương pháp rẻ nhất trả lời đúng câu hỏi thật.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bẫy "nhìn lén" & ý nghĩa.</b> Dừng một A/B test ngay khi nó "trông có ý nghĩa" (peeking) làm phồng dương tính giả rất mạnh — bạn phải cố định cỡ mẫu từ trước hoặc dùng phương pháp tuần tự. Nhiều đội sản phẩm thật ra mắt bản thua vì gọi kết quả test sớm. <em>Một lưu ý về thiết kế thí nghiệm ngoài syllabus nhưng thiết yếu trong thực tế.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Only surveying current app users, thereby missing people who already quit, is an example of:|||Chỉ khảo sát người đang dùng app, do đó bỏ sót người đã bỏ, là ví dụ của:',
                options: [
                  'Measurement error|||Lỗi đo lường',
                  'Coverage error|||Lỗi bao phủ',
                  'Rounding error|||Lỗi làm tròn',
                  'Prototype error|||Lỗi prototype',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: '"Was the app fast and easy?" is a poor question because it is:|||"App có nhanh và dễ không?" là câu tồi vì nó:',
                options: [
                  'Too short|||Quá ngắn',
                  'Double-barreled (asks two things at once)|||Hai nòng (hỏi hai thứ cùng lúc)',
                  'Open-ended|||Câu mở',
                  'About the past|||Về quá khứ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Behavioral analytics (funnels, heatmaps) is best at telling you:|||Behavioral analytics (funnel, heatmap) giỏi nhất trong việc cho bạn biết:',
                options: [
                  'Exactly why users behave that way|||Chính xác vì sao người dùng hành xử như vậy',
                  'Where in a flow users drop off or tap|||Ở đâu trong luồng người dùng rớt hoặc chạm',
                  'What users feel emotionally|||Người dùng cảm nhận cảm xúc gì',
                  'The best color palette|||Bảng màu tốt nhất',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'In an A/B test, before trusting that B beat A you must check:|||Trong A/B test, trước khi tin B thắng A bạn phải kiểm:',
                options: [
                  'That B is prettier|||Rằng B đẹp hơn',
                  'Whether the difference is statistically significant (not chance)|||Chênh lệch có ý nghĩa thống kê không (không phải ngẫu nhiên)',
                  'That the team likes B|||Rằng đội thích B',
                  'That B was built second|||Rằng B được dựng sau',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'You want to know WHY 70% of users drop at step 3. The best follow-up is:|||Bạn muốn biết VÌ SAO 70% người dùng rớt ở bước 3. Bước tiếp tốt nhất là:',
                options: [
                  'Add more analytics dashboards|||Thêm bảng analytics',
                  'Run a few usability tests on step 3|||Chạy vài usability test trên bước 3',
                  'Ignore it|||Bỏ qua',
                  'Change the logo|||Đổi logo',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — UX CAPSTONE ══════════════════ */
    {
      title: 'Chapter 6 — UX capstone: the integrated project|||Chương 6 — Đồ án capstone: dự án tích hợp',
      description: 'Coursera 6/6: chạy trọn một dự án UX nhiều pha qua 5 milestone và viết báo cáo cuối (CLO8).',
      lessons: [
        {
          title: '6.1 — The 5 milestones & the final report|||6.1 — 5 milestone & báo cáo cuối',
          slug: 'wdu203c-6-1-capstone',
          type: 'VIDEO',
          description: 'Cấu trúc capstone: từ chọn đề & nghiên cứu tới thiết kế, prototype, kiểm thử và báo cáo — với checklist theo mốc.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Put it all together: one project, every skill (CLO8)</h2>
<p class="lead">The capstone integrates the whole course into a single multi-phase project. You pick a problem and walk the double diamond end to end — research, define, design, prototype, test, report. It is graded on process rigor, not on shipping a real app.</p>
<h3>The five milestones</h3>
<div class="lz-map">
  <div class="lz-stage">M1 · Discover</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Scope & research plan</div><div class="lz-nsub">pick topic (0.5 rubric) · who to study · questions</div></div></div>
  <div class="lz-stage">M2 · Understand</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">User research & synthesis</div><div class="lz-nsub">interviews/observation · affinity wall · insights</div></div></div>
  <div class="lz-stage">M3 · Develop</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Ideation & wireframes</div><div class="lz-nsub">sketches · scenarios · low-fi structure</div></div></div>
  <div class="lz-stage">M4 · Deliver</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Prototype & usability test</div><div class="lz-nsub">clickable prototype · test 5 users · findings</div></div></div>
  <div class="lz-stage">M5 · Report</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Iterate & final report</div><div class="lz-nsub">fix top issues · write up the journey</div></div></div>
</div>
<h3>Milestone checklist — don't submit without these</h3>
<table>
<thead><tr><th>Milestone</th><th>Must include</th></tr></thead>
<tbody>
<tr><td>M1</td><td>A sharp <em>task statement</em> + who you'll research + 5-6 interview questions</td></tr>
<tr><td>M2</td><td>≥5 interviews/observations + an affinity wall + 3-5 written insights</td></tr>
<tr><td>M3</td><td>Multiple sketched ideas + chosen direction + low-fi wireframes of the core flow</td></tr>
<tr><td>M4</td><td>Clickable prototype + a test plan + results from ≥5 users, ranked by severity</td></tr>
<tr><td>M5</td><td>Revised design + report: goal, method, findings, changes, evidence</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>The report tells a story, not a checklist.</strong> The strongest final reports read as a narrative: "we thought X, users showed us Y, so we changed Z — here's the evidence." Show the <em>pivot</em>. A project where nothing changed after testing is a red flag that you didn't really listen.</div>
<div class="pitfall"><strong>Don't skip synthesis to rush to pretty screens.</strong> The most common capstone failure is jumping from "I did interviews" straight to a hi-fi design, with no affinity wall and no stated insights — so the design isn't traceable to any real need. Graders look for the <em>thread</em> from evidence → insight → design decision.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Keep a decision log.</b> Alongside deliverables, keep a running log: date · decision · why · evidence. It makes the final report almost write itself, defends every choice under questioning, and is exactly how professional design teams stay aligned and auditable. <em>A practitioner habit that turns a good capstone into a great one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Ghép tất cả lại: một dự án, mọi kỹ năng (CLO8)</h2>
<p class="lead">Capstone tích hợp cả môn vào một dự án nhiều pha. Bạn chọn một vấn đề và đi trọn double diamond từ đầu tới cuối — nghiên cứu, định nghĩa, thiết kế, prototype, kiểm thử, báo cáo. Nó được chấm theo độ chặt chẽ quy trình, không theo việc ra mắt một app thật.</p>
<h3>Năm milestone</h3>
<div class="lz-map">
  <div class="lz-stage">M1 · Khám phá</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Phạm vi & kế hoạch nghiên cứu</div><div class="lz-nsub">chọn đề (rubric 0.5) · nghiên cứu ai · câu hỏi</div></div></div>
  <div class="lz-stage">M2 · Hiểu</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Nghiên cứu người dùng & tổng hợp</div><div class="lz-nsub">phỏng vấn/quan sát · affinity wall · hiểu biết</div></div></div>
  <div class="lz-stage">M3 · Phát triển</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Ideation & wireframe</div><div class="lz-nsub">sketch · scenario · cấu trúc lo-fi</div></div></div>
  <div class="lz-stage">M4 · Giao</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Prototype & usability test</div><div class="lz-nsub">prototype bấm được · test 5 người · phát hiện</div></div></div>
  <div class="lz-stage">M5 · Báo cáo</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lặp & báo cáo cuối</div><div class="lz-nsub">sửa lỗi hàng đầu · viết lại hành trình</div></div></div>
</div>
<h3>Checklist theo milestone — đừng nộp thiếu những thứ này</h3>
<table>
<thead><tr><th>Milestone</th><th>Phải có</th></tr></thead>
<tbody>
<tr><td>M1</td><td>Một <em>phát biểu nhiệm vụ</em> sắc + nghiên cứu ai + 5-6 câu phỏng vấn</td></tr>
<tr><td>M2</td><td>≥5 phỏng vấn/quan sát + một affinity wall + 3-5 hiểu biết viết ra</td></tr>
<tr><td>M3</td><td>Nhiều ý tưởng sketch + hướng đã chọn + wireframe lo-fi của luồng chính</td></tr>
<tr><td>M4</td><td>Prototype bấm được + kế hoạch test + kết quả từ ≥5 người, xếp theo mức nghiêm trọng</td></tr>
<tr><td>M5</td><td>Thiết kế đã sửa + báo cáo: mục tiêu, phương pháp, phát hiện, thay đổi, bằng chứng</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Báo cáo kể một câu chuyện, không phải checklist.</strong> Báo cáo cuối mạnh nhất đọc như một tường thuật: "bọn em nghĩ X, người dùng cho thấy Y, nên bọn em đổi Z — đây là bằng chứng." Hãy khoe <em>bước xoay hướng</em>. Một dự án không thay đổi gì sau khi test là cờ đỏ cho thấy bạn chưa thực sự lắng nghe.</div>
<div class="pitfall"><strong>Đừng bỏ tổng hợp để lao vào màn hình đẹp.</strong> Thất bại capstone phổ biến nhất là nhảy từ "em đã phỏng vấn" thẳng tới thiết kế hi-fi, không affinity wall, không hiểu biết nêu ra — nên thiết kế không truy được về bất kỳ nhu cầu thật nào. Người chấm tìm <em>sợi chỉ</em> từ bằng chứng → hiểu biết → quyết định thiết kế.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giữ nhật ký quyết định.</b> Bên cạnh sản phẩm nộp, giữ một nhật ký chạy: ngày · quyết định · vì sao · bằng chứng. Nó làm báo cáo cuối gần như tự viết, bảo vệ mọi lựa chọn dưới câu hỏi, và chính là cách đội thiết kế chuyên nghiệp giữ nhất quán và kiểm toán được. <em>Một thói quen nghề biến capstone tốt thành capstone tuyệt.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — ÔN THI (EXAM PREP) ══════════════════ */
    {
      title: 'Chapter 7 — Exam prep: TE question bank & strategy|||Chương 7 — Ôn thi: ngân hàng câu hỏi TE & chiến lược',
      description: 'Ngân hàng câu hỏi ôn theo CLO + bảng so sánh cặp thuật ngữ hay nhầm + chiến lược làm 50 câu trong 60 phút.',
      lessons: [
        {
          title: '7.1 — TE question bank by CLO + exam strategy|||7.1 — Ngân hàng câu hỏi TE theo CLO + chiến lược thi',
          slug: 'wdu203c-7-1-exam-prep',
          type: 'article',
          description: 'Câu hỏi ôn theo từng CLO, bảng thuật ngữ dễ nhầm, và cách phân bổ thời gian 50 câu/60 phút.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Prepare for the 50-question, 60-minute TE the smart way</h2>
<p class="lead">The exam is all multiple choice across all CLOs. It rewards <em>applying</em> concepts to scenarios, not reciting definitions. Use this question bank to self-check by CLO, then drill the compare-table of terms students most often confuse.</p>
<h3>Self-check question bank (by CLO)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">CLO1/3 Research</span> When do you interview vs survey vs run analytics? Why is a leading question bad? What are coverage/nonresponse/measurement errors?</div>
  <div class="lz-layer"><span class="lz-lk">CLO2/5 Design</span> Why diverge before converge? What does a wireframe deliberately leave out? What are scenarios and storyboards for?</div>
  <div class="lz-layer"><span class="lz-lk">CLO4 Testing</span> Why test the design, not the user? Why ~5 users? Why must the moderator stay quiet? Formative vs summative?</div>
  <div class="lz-layer"><span class="lz-lk">CLO6 Prototype</span> Match fidelity to the question — why not always hi-fi? What makes a prototype "interactive/testable"?</div>
  <div class="lz-layer"><span class="lz-lk">CLO7 Scale</span> What does analytics tell you vs not? How does an A/B test decide? Why check significance?</div>
  <div class="lz-layer"><span class="lz-lk">CLO8 Process</span> Order the double diamond stages. Why does the report need a pivot backed by evidence?</div>
</div>
<h3>Compare-table — the terms students confuse</h3>
<table>
<thead><tr><th>Pair</th><th>Key difference</th></tr></thead>
<tbody>
<tr><td>Qualitative vs Quantitative</td><td>why/how (few, deep) vs how-many (many, measured)</td></tr>
<tr><td>Formative vs Summative</td><td>during design to fix vs after to measure/benchmark</td></tr>
<tr><td>Usability vs UX</td><td>can they do the task vs the whole felt experience</td></tr>
<tr><td>Affordance vs Signifier</td><td>what it lets you do vs the visible clue that shows it</td></tr>
<tr><td>Moderated vs Unmoderated</td><td>live facilitator vs tool records users alone</td></tr>
<tr><td>Lo-fi vs Hi-fi</td><td>test flow, cheap vs test visual/polish, costly</td></tr>
<tr><td>Coverage vs Nonresponse error</td><td>wrong people invited vs responders ≠ non-responders</td></tr>
</tbody>
</table>
<h3>Exam-day time strategy</h3>
<div class="formula"><span class="lbl">PACING</span> 50 questions ÷ 60 min ≈ 72 sec/question &nbsp;·&nbsp; flag &amp; skip hard ones, return at the end</div>
<div class="callout ok"><strong>The judgment-question reflex:</strong> when an item asks "what should the team do next?", the UX-correct answer usually <em>gathers evidence from users</em> (test, interview, observe) rather than assumes or decides from opinion. When unsure between two options, pick the more user-evidence-based one.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lock the bonus = lower the bar.</b> Recall from 0.2: finishing all six MOOCs early gives +1, dropping your needed exam score from 5.0 to 4.0. The single highest-value exam-prep action is not more revision — it is finishing the certificate on time. <em>Strategy, not content, but it wins the course.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Ôn cho bài TE 50 câu, 60 phút một cách khôn ngoan</h2>
<p class="lead">Bài thi toàn trắc nghiệm trải khắp các CLO. Nó thưởng việc <em>áp dụng</em> khái niệm vào tình huống, không phải đọc thuộc định nghĩa. Dùng ngân hàng câu hỏi này để tự kiểm theo CLO, rồi luyện bảng so sánh các thuật ngữ sinh viên hay nhầm nhất.</p>
<h3>Ngân hàng câu tự kiểm (theo CLO)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">CLO1/3 Nghiên cứu</span> Khi nào phỏng vấn vs khảo sát vs analytics? Vì sao câu mớm là tồi? Lỗi bao phủ/không phản hồi/đo lường là gì?</div>
  <div class="lz-layer"><span class="lz-lk">CLO2/5 Thiết kế</span> Vì sao mở rộng trước hội tụ? Wireframe cố tình bỏ gì? Scenario và storyboard để làm gì?</div>
  <div class="lz-layer"><span class="lz-lk">CLO4 Kiểm thử</span> Vì sao test thiết kế, không phải người dùng? Vì sao ~5 người? Vì sao người điều phối phải im? Formative vs summative?</div>
  <div class="lz-layer"><span class="lz-lk">CLO6 Prototype</span> Khớp fidelity với câu hỏi — vì sao không luôn hi-fi? Điều gì làm prototype "tương tác/kiểm thử được"?</div>
  <div class="lz-layer"><span class="lz-lk">CLO7 Quy mô</span> Analytics cho biết gì vs không? A/B test quyết định thế nào? Vì sao kiểm ý nghĩa?</div>
  <div class="lz-layer"><span class="lz-lk">CLO8 Quy trình</span> Sắp thứ tự các pha double diamond. Vì sao báo cáo cần một bước xoay hướng có bằng chứng?</div>
</div>
<h3>Bảng so sánh — các thuật ngữ sinh viên hay nhầm</h3>
<table>
<thead><tr><th>Cặp</th><th>Khác biệt then chốt</th></tr></thead>
<tbody>
<tr><td>Định tính vs Định lượng</td><td>vì sao/thế nào (ít, sâu) vs bao nhiêu (nhiều, đo được)</td></tr>
<tr><td>Formative vs Summative</td><td>trong khi thiết kế để sửa vs sau đó để đo/đối chuẩn</td></tr>
<tr><td>Khả dụng vs UX</td><td>họ có làm được nhiệm vụ vs toàn bộ trải nghiệm cảm nhận</td></tr>
<tr><td>Affordance vs Signifier</td><td>thứ nó cho phép làm vs dấu hiệu nhìn thấy tiết lộ điều đó</td></tr>
<tr><td>Có điều phối vs Không điều phối</td><td>có người dẫn trực tiếp vs công cụ ghi người dùng làm một mình</td></tr>
<tr><td>Lo-fi vs Hi-fi</td><td>test luồng, rẻ vs test hình ảnh/độ hoàn thiện, tốn</td></tr>
<tr><td>Lỗi bao phủ vs không phản hồi</td><td>mời sai người vs người trả lời ≠ người không trả lời</td></tr>
</tbody>
</table>
<h3>Chiến lược thời gian ngày thi</h3>
<div class="formula"><span class="lbl">NHỊP ĐỘ</span> 50 câu ÷ 60 phút ≈ 72 giây/câu &nbsp;·&nbsp; đánh dấu &amp; bỏ câu khó, quay lại ở cuối</div>
<div class="callout ok"><strong>Phản xạ câu phán đoán:</strong> khi câu hỏi hỏi "đội nên làm gì tiếp?", đáp án đúng-UX thường <em>thu thập bằng chứng từ người dùng</em> (test, phỏng vấn, quan sát) chứ không giả định hay quyết theo ý kiến. Khi phân vân giữa hai lựa chọn, chọn cái dựa trên bằng chứng người dùng hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoá điểm thưởng = hạ ngưỡng.</b> Nhớ từ bài 0.2: xong sớm cả sáu MOOC cho +1, kéo điểm thi bạn cần từ 5.0 xuống 4.0. Hành động ôn thi giá trị nhất không phải ôn thêm — mà là hoàn thành chứng chỉ đúng hạn. <em>Chiến lược, không phải nội dung, nhưng thắng cả môn.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Formative vs summative testing differ mainly in:|||Test formative vs summative khác nhau chủ yếu ở:',
                options: [
                  'The color of the report|||Màu của báo cáo',
                  'When they run: during design to fix vs after to measure|||Khi nào chạy: trong khi thiết kế để sửa vs sau đó để đo',
                  'The number of screens|||Số màn hình',
                  'Nothing, they are the same|||Không gì cả, chúng giống nhau',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'An affordance differs from a signifier in that an affordance is:|||Affordance khác signifier ở chỗ affordance là:',
                options: [
                  'The visible clue|||Dấu hiệu nhìn thấy',
                  'What the object lets you do|||Thứ vật thể cho phép bạn làm',
                  'A color|||Một màu sắc',
                  'A survey error|||Một lỗi khảo sát',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Correct order of the double diamond stages:|||Thứ tự đúng các pha double diamond:',
                options: [
                  'Deliver → Develop → Define → Discover|||Giao → Phát triển → Định nghĩa → Khám phá',
                  'Discover → Define → Develop → Deliver|||Khám phá → Định nghĩa → Phát triển → Giao',
                  'Define → Discover → Deliver → Develop|||Định nghĩa → Khám phá → Giao → Phát triển',
                  'Develop → Deliver → Discover → Define|||Phát triển → Giao → Khám phá → Định nghĩa',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'With 50 questions in 60 minutes, a good pacing habit is:|||Với 50 câu trong 60 phút, thói quen phân bổ thời gian tốt là:',
                options: [
                  'Spend 5 minutes on question 1|||Dành 5 phút cho câu 1',
                  '~72s/question; flag hard ones and return at the end|||~72 giây/câu; đánh dấu câu khó và quay lại ở cuối',
                  'Answer only the easy half|||Chỉ trả lời nửa dễ',
                  'Read every option three times|||Đọc mọi lựa chọn ba lần',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'On a "what should the team do next?" question, the safest UX default is the option that:|||Với câu "đội nên làm gì tiếp?", mặc định UX an toàn nhất là lựa chọn:',
                options: [
                  'Assumes the answer from intuition|||Giả định đáp án từ trực giác',
                  'Gathers evidence from users (test/interview/observe)|||Thu thập bằng chứng từ người dùng (test/phỏng vấn/quan sát)',
                  'Ships immediately|||Ra mắt ngay',
                  'Adds more features|||Thêm nhiều tính năng',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) The highest-leverage move to secure a pass is:|||(Ngoài giáo trình) Nước đi lợi nhất để chắc suất qua môn là:',
                options: [
                  'Skipping the MOOCs|||Bỏ qua các MOOC',
                  'Finishing all MOOCs early to lock the +1 bonus (bar drops 5.0 → 4.0)|||Xong sớm hết MOOC để khoá thưởng +1 (ngưỡng tụt 5.0 → 4.0)',
                  'Only studying the night before|||Chỉ học đêm trước',
                  'Guessing every answer|||Đoán mọi câu',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — NÂNG CAO ★ (BEYOND SYLLABUS) ══════════════════ */
    {
      title: 'Chapter 8 — Beyond the syllabus ★: accessibility, design systems, UX metrics|||Chương 8 — Nâng cao ★: accessibility, design system, chỉ số UX',
      description: 'Cả chương ★ ngoài giáo trình: thiết kế tiếp cận được (WCAG), design system/design token, và đo UX bằng SUS/HEART.',
      lessons: [
        {
          title: '8.1 — Accessibility (WCAG), design systems & UX metrics ★|||8.1 — Accessibility (WCAG), design system & chỉ số UX ★',
          slug: 'wdu203c-8-1-advanced',
          type: 'VIDEO',
          description: 'Ba chủ đề nghề nghiệp ngoài giáo trình Michigan: thiết kế cho mọi người (a11y), hệ thống thiết kế nhất quán, và đo UX định lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · ★ Beyond the syllabus</span>
<h2>Three things real UX teams do that the six MOOCs only hint at</h2>
<p class="lead">This whole chapter is <span class="badge">★ Beyond the syllabus</span> — professional practice the exam won't test but every UX job assumes. Learn them and your capstone (and portfolio) jump a level.</p>

<h3>1 — Accessibility & WCAG: design for everyone</h3>
<p>Roughly 15% of people have a disability. <strong>Accessibility (a11y)</strong> means people using screen readers, keyboard-only, low vision, or color blindness can still succeed. The <strong>WCAG</strong> guidelines organize this under four principles — <em>Perceivable, Operable, Understandable, Robust (POUR)</em>.</p>
<div class="formula"><span class="lbl">CONTRAST</span> WCAG AA: normal text ≥ 4.5:1 · large text ≥ 3:1 &nbsp;·&nbsp; never rely on color alone to convey meaning</div>
<div class="out"><strong>Quick a11y wins:</strong>
• Text contrast ≥ 4.5:1 (check in Figma or a contrast tool).
• Every input has a real, tappable label; tap targets ≥ 44×44 px.
• Don't signal errors by red color alone — add an icon + text.
• Images have alt text; the page works with keyboard Tab order.</div>

<h3>2 — Design systems & design tokens: consistency at scale</h3>
<p>Once a product grows past a few screens, redesigning each button by hand is chaos. A <strong>design system</strong> is a reusable library of components (buttons, inputs, cards) + rules. <strong>Design tokens</strong> are named values — <code>color.primary</code>, <code>space.4</code>, <code>radius.md</code> — so one change updates everywhere and design & code speak the same language.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tokens</div><div class="lz-t">Named values</div><div class="lz-d">color/space/type/radius</div></div>
  <div class="lz-step"><div class="lz-k">Components</div><div class="lz-t">Reusable parts</div><div class="lz-d">button, input, card</div></div>
  <div class="lz-step"><div class="lz-k">Patterns</div><div class="lz-t">Proven layouts</div><div class="lz-d">forms, empty states</div></div>
  <div class="lz-step"><div class="lz-k">Guidelines</div><div class="lz-t">When/why</div><div class="lz-d">usage rules, do/don't</div></div>
</div>
<p>Nielsen heuristic #4 (consistency) is basically what a design system enforces automatically. Figma's component + variables features let you build a mini design system for your capstone.</p>

<h3>3 — UX metrics: making "better" measurable</h3>
<table>
<thead><tr><th>Metric</th><th>What it measures</th></tr></thead>
<tbody>
<tr><td>SUS (System Usability Scale)</td><td>10-item questionnaire → single 0-100 usability score</td></tr>
<tr><td>HEART (Google)</td><td>Happiness, Engagement, Adoption, Retention, Task success</td></tr>
<tr><td>SUPR-Q</td><td>Standardized UX quality (usability, trust, loyalty, appearance)</td></tr>
<tr><td>Task success / time / errors</td><td>Core behavioral outcomes from usability tests</td></tr>
</tbody>
</table>
<div class="formula"><span class="lbl">SUS</span> alternate odd(+) / even(−) items, sum, × 2.5 → 0-100 &nbsp;·&nbsp; ~68 = average, 80+ = excellent</div>
<div class="callout ok"><strong>Why metrics matter.</strong> "The new design is better" is an opinion; "SUS went 62 → 79 and task success 60% → 92%" is evidence a stakeholder can act on. Pairing a number (how much) with a story (why) is the mark of a mature UX practitioner — and it makes your capstone report far more convincing.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Goal-Signal-Metric (HEART).</b> Google's method: for each goal, name a <em>signal</em> (an observable behavior) and a <em>metric</em> (a number tracking it). "Goal: users find lunch fast → Signal: reorder taps → Metric: median time-to-order." It stops teams from measuring vanity numbers and ties every metric back to a real user goal. <em>The professional bridge from research to measurable product decisions.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · ★ Ngoài giáo trình</span>
<h2>Ba thứ đội UX thật làm mà sáu MOOC chỉ nhắc thoáng</h2>
<p class="lead">Cả chương này là <span class="badge">★ Ngoài giáo trình</span> — thực hành nghề mà bài thi không kiểm nhưng mọi việc làm UX đều giả định. Học chúng, capstone (và portfolio) của bạn nhảy một bậc.</p>

<h3>1 — Accessibility & WCAG: thiết kế cho MỌI người</h3>
<p>Khoảng 15% dân số có khuyết tật. <strong>Accessibility (a11y)</strong> nghĩa là người dùng trình đọc màn hình, chỉ bàn phím, thị lực kém, hay mù màu vẫn thành công được. Bộ hướng dẫn <strong>WCAG</strong> tổ chức điều này dưới bốn nguyên tắc — <em>Cảm nhận được, Vận hành được, Hiểu được, Bền vững (POUR)</em>.</p>
<div class="formula"><span class="lbl">TƯƠNG PHẢN</span> WCAG AA: chữ thường ≥ 4.5:1 · chữ lớn ≥ 3:1 &nbsp;·&nbsp; đừng bao giờ chỉ dựa vào màu để truyền nghĩa</div>
<div class="out"><strong>Thắng nhanh về a11y:</strong>
• Tương phản chữ ≥ 4.5:1 (kiểm trong Figma hoặc công cụ tương phản).
• Mỗi ô nhập có nhãn thật, chạm được; vùng chạm ≥ 44×44 px.
• Đừng báo lỗi chỉ bằng màu đỏ — thêm icon + chữ.
• Ảnh có alt text; trang chạy được với thứ tự Tab bàn phím.</div>

<h3>2 — Design system & design token: nhất quán ở quy mô</h3>
<p>Khi sản phẩm lớn quá vài màn, thiết kế lại từng nút bằng tay là hỗn loạn. Một <strong>design system</strong> là thư viện component tái dùng (nút, ô nhập, card) + quy tắc. <strong>Design token</strong> là các giá trị được đặt tên — <code>color.primary</code>, <code>space.4</code>, <code>radius.md</code> — để một thay đổi cập nhật khắp nơi và thiết kế & code nói cùng ngôn ngữ.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Token</div><div class="lz-t">Giá trị đặt tên</div><div class="lz-d">màu/khoảng cách/chữ/bo góc</div></div>
  <div class="lz-step"><div class="lz-k">Component</div><div class="lz-t">Phần tái dùng</div><div class="lz-d">nút, ô nhập, card</div></div>
  <div class="lz-step"><div class="lz-k">Pattern</div><div class="lz-t">Bố cục đã kiểm</div><div class="lz-d">biểu mẫu, trạng thái rỗng</div></div>
  <div class="lz-step"><div class="lz-k">Guideline</div><div class="lz-t">Khi nào/vì sao</div><div class="lz-d">quy tắc dùng, nên/không</div></div>
</div>
<p>Heuristic Nielsen #4 (nhất quán) về cơ bản là thứ một design system tự động thực thi. Tính năng component + variables của Figma cho bạn dựng một design system nhỏ cho capstone.</p>

<h3>3 — Chỉ số UX: làm cho "tốt hơn" đo được</h3>
<table>
<thead><tr><th>Chỉ số</th><th>Đo gì</th></tr></thead>
<tbody>
<tr><td>SUS (System Usability Scale)</td><td>Bảng 10 câu → một điểm khả dụng 0-100</td></tr>
<tr><td>HEART (Google)</td><td>Happiness, Engagement, Adoption, Retention, Task success</td></tr>
<tr><td>SUPR-Q</td><td>Chất lượng UX chuẩn hoá (khả dụng, tin cậy, trung thành, ngoại hình)</td></tr>
<tr><td>Task success / time / errors</td><td>Kết quả hành vi cốt lõi từ usability test</td></tr>
</tbody>
</table>
<div class="formula"><span class="lbl">SUS</span> đảo câu lẻ(+) / chẵn(−), cộng, × 2.5 → 0-100 &nbsp;·&nbsp; ~68 = trung bình, 80+ = xuất sắc</div>
<div class="callout ok"><strong>Vì sao chỉ số quan trọng.</strong> "Thiết kế mới tốt hơn" là ý kiến; "SUS đi 62 → 79 và tỷ lệ hoàn thành 60% → 92%" là bằng chứng bên liên quan hành động được. Ghép một con số (bao nhiêu) với một câu chuyện (vì sao) là dấu hiệu của người làm UX chín — và làm báo cáo capstone của bạn thuyết phục hơn nhiều.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Goal-Signal-Metric (HEART).</b> Phương pháp của Google: với mỗi mục tiêu, đặt một <em>tín hiệu</em> (hành vi quan sát được) và một <em>chỉ số</em> (con số theo dõi nó). "Mục tiêu: người dùng tìm bữa trưa nhanh → Tín hiệu: số lần chạm đặt-lại → Chỉ số: thời gian trung vị tới lúc đặt." Nó ngăn đội đo con số phù phiếm và buộc mọi chỉ số về một mục tiêu người dùng thật. <em>Cây cầu chuyên nghiệp từ nghiên cứu tới quyết định sản phẩm đo được.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The four WCAG accessibility principles are summarized as POUR —|||Bốn nguyên tắc accessibility WCAG tóm tắt là POUR —',
                options: [
                  'Pretty, Original, Unique, Rich|||Đẹp, Nguyên bản, Độc đáo, Giàu',
                  'Perceivable, Operable, Understandable, Robust|||Cảm nhận được, Vận hành được, Hiểu được, Bền vững',
                  'Popular, Open, Usable, Ready|||Phổ biến, Mở, Dùng được, Sẵn sàng',
                  'Portable, Online, Updated, Responsive|||Di động, Trực tuyến, Cập nhật, Đáp ứng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Signaling a form error using ONLY red color is an accessibility problem because:|||Báo lỗi biểu mẫu CHỈ bằng màu đỏ là vấn đề accessibility vì:',
                options: [
                  'Red is expensive|||Màu đỏ đắt tiền',
                  'Color-blind users may not perceive it — add an icon and text|||Người mù màu có thể không nhận ra — hãy thêm icon và chữ',
                  'Red is unprofessional|||Màu đỏ thiếu chuyên nghiệp',
                  'It slows the page|||Nó làm chậm trang',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A design token such as color.primary mainly helps by:|||Một design token như color.primary chủ yếu giúp bằng cách:',
                options: [
                  'Making the app faster|||Làm app nhanh hơn',
                  'Letting one named value update consistently everywhere it is used|||Để một giá trị đặt tên cập nhật nhất quán khắp nơi nó được dùng',
                  'Encrypting the design|||Mã hoá thiết kế',
                  'Replacing user research|||Thay thế nghiên cứu người dùng',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'SUS (System Usability Scale) produces:|||SUS (System Usability Scale) cho ra:',
                options: [
                  'A list of bugs|||Một danh sách lỗi',
                  'A single 0-100 usability score from a 10-item questionnaire|||Một điểm khả dụng 0-100 từ bảng 10 câu',
                  'A color palette|||Một bảng màu',
                  'A wireframe|||Một wireframe',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Why report "SUS went 62 → 79" instead of "the design is better"?|||Vì sao báo cáo "SUS đi 62 → 79" thay vì "thiết kế tốt hơn"?',
                options: [
                  'It sounds more technical|||Nghe kỹ thuật hơn',
                  'A measured number is evidence stakeholders can act on, not just opinion|||Một con số đo được là bằng chứng bên liên quan hành động được, không chỉ ý kiến',
                  'Numbers are always right|||Con số luôn đúng',
                  'It hides the real result|||Nó giấu kết quả thật',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
