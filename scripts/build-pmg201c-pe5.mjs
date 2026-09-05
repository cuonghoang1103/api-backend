/**
 * build-pmg201c-pe5.mjs — sinh content/exams/PMG201c-PE5.mjs.
 *
 * Nguồn thật: "PMG201c - SP 2025 - PE3" (paper.pdf tự đặt tên nội bộ là
 * "PMG201c.PE3" — số riêng của trường theo học kỳ, KHÔNG liên quan tới mã
 * "PE5" dùng trong hệ thống này, chỉ là số thứ tự dựng đề độc lập). Có kèm
 * `example.txt` (lời giải mẫu) VÀ `script.txt` (chép lại đề bài, không
 * phải lời giải).
 *
 * Đã ĐỐI CHIẾU TÍNH TAY ĐỘC LẬP toàn bộ Request 3 (CPM) và Request 4
 * (EVM) với example.txt — CẢ HAI phần số liệu (17/15/12/14 ngày, đường
 * găng A-D-E; SPI=0.6, CPI=0.75, EAC=1,066,667, dự báo ~10 tháng) đều
 * KHỚP ĐÚNG với tính tay. ⚠️ NHƯNG Request 3c của example.txt có 1 chỗ
 * THIẾU CHÍNH XÁC: nói "hoạt động linh hoạt nhất là B, F, C, H, và I" —
 * gộp chung mọi hoạt động không nằm trên đường găng, trong khi float thật
 * của chúng KHÁC NHAU (B=5, F=5 là CAO NHẤT; C=3, H=3, I=3 thấp hơn; G=2
 * thấp nhất trong số không-găng). Đã sửa lại câu trả lời cho CHÍNH XÁC:
 * chỉ B và F mới thực sự "linh hoạt NHẤT" (float=5), không lumping chung
 * với C/H/I (float=3).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE5.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context — E-Commerce Website for Small Businesses:</b><br/><p>You are acting as the PM for this project. A company is building a multi-vendor e-commerce platform designed for small businesses. The platform needs to offer: <b>user registration</b> so businesses can set up their online stores; <b>payment integration</b> with various payment providers; features for <b>product listing and order tracking</b>; a <b>customer review system</b> for feedback and ratings.</p><p>The website must handle up to <b>10,000 vendors</b> and <b>100,000 daily transactions</b>.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh — Website Thương mại điện tử cho Doanh nghiệp nhỏ:</b><br/><p>Bạn đóng vai PM của dự án này. Một công ty đang xây nền tảng thương mại điện tử đa gian hàng cho doanh nghiệp nhỏ. Nền tảng cần cung cấp: <b>đăng ký người dùng</b> để doanh nghiệp lập cửa hàng online; <b>tích hợp thanh toán</b> với nhiều nhà cung cấp; tính năng <b>đăng sản phẩm và theo dõi đơn hàng</b>; <b>hệ thống đánh giá khách hàng</b> cho phản hồi và xếp hạng.</p><p>Website phải xử lý tới <b>10,000 gian hàng</b> và <b>100,000 giao dịch/ngày</b>.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c.PE3 – E-Commerce Website for Small Businesses (Spring 2025)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c.PE3 – Website Thương mại điện tử cho Doanh nghiệp nhỏ (Spring 2025)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const cpmTable = `<table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (days)</th></tr>
<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>4</td></tr>
<tr><td>B</td><td>Start</td><td>2</td></tr><tr><td>C</td><td>Start</td><td>3</td></tr>
<tr><td>D</td><td>A</td><td>8</td></tr><tr><td>E</td><td>D</td><td>5</td></tr>
<tr><td>F</td><td>B</td><td>7</td></tr><tr><td>G</td><td>D, F</td><td>3</td></tr>
<tr><td>H</td><td>C</td><td>8</td></tr><tr><td>I</td><td>H</td><td>3</td></tr>
<tr><td>End</td><td>E, G, I</td><td>0</td></tr></table>`;

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (weight 20%):</strong> identify 4 stakeholders and the relevant influence each of them has on the project. Define the strategy to manage each of those stakeholders.</p>`,
    `<p><strong>Yêu cầu 1 (trọng số 20%):</strong> xác định 4 bên liên quan và mức độ ảnh hưởng của mỗi bên tới dự án. Định nghĩa chiến lược quản lý cho từng bên.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Project Sponsor</strong> — Influence: provides funding and approves major decisions. <strong>Strategy:</strong> keep them regularly updated with reports; involve them in key milestone reviews.</p>
     <p><strong>Development Team</strong> — Influence: builds the platform features (registration, payment integration, etc.). <strong>Strategy:</strong> daily standups and sprint demos; remove blockers quickly.</p>
     <p><strong>Vendors</strong> — Influence: will use the platform to sell products; their adoption is critical to the project's success. <strong>Strategy:</strong> gather feedback early; offer beta-testing opportunities.</p>
     <p><strong>Payment Providers</strong> — Influence: need to be integrated smoothly for successful transactions. <strong>Strategy:</strong> maintain constant communication; hold early technical alignment sessions.</p>`,
    `<p><strong>Nhà tài trợ dự án</strong> — Ảnh hưởng: cấp vốn và duyệt các quyết định lớn. <strong>Chiến lược:</strong> cập nhật báo cáo thường xuyên; mời tham gia rà soát các mốc chính.</p>
     <p><strong>Nhóm phát triển</strong> — Ảnh hưởng: xây dựng các tính năng nền tảng (đăng ký, tích hợp thanh toán...). <strong>Chiến lược:</strong> họp standup hàng ngày và demo cuối sprint; gỡ vướng nhanh.</p>
     <p><strong>Gian hàng (Vendors)</strong> — Ảnh hưởng: sẽ dùng nền tảng để bán hàng; mức độ tiếp nhận của họ quyết định thành công dự án. <strong>Chiến lược:</strong> thu thập phản hồi sớm; mời tham gia beta-testing.</p>
     <p><strong>Nhà cung cấp thanh toán</strong> — Ảnh hưởng: cần tích hợp trơn tru để giao dịch thành công. <strong>Chiến lược:</strong> duy trì liên lạc thường xuyên; họp thống nhất kỹ thuật sớm.</p>`,
  ),
  rubric: [
    { id: 'four_stakeholders', criterion: B('Identifies 4 distinct, plausible stakeholders relevant to this specific project.', 'Xác định đủ 4 bên liên quan khác nhau, hợp lý, gắn với đúng dự án.'), weight: 1, maxScore: 0.6 },
    { id: 'influence', criterion: B('States a specific influence/impact for each stakeholder (not generic).', 'Nêu ảnh hưởng cụ thể của từng bên (không chung chung).'), weight: 1, maxScore: 0.7 },
    { id: 'strategy', criterion: B('Proposes a distinct, actionable management strategy for each stakeholder.', 'Đề xuất chiến lược quản lý riêng biệt, khả thi cho từng bên.'), weight: 1, maxScore: 0.7 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (weight 20%):</strong> identify at least 4 significant risks that you think the project faces. For each risk, determine the evaluation (possibility, impact) and relevant mitigation strategies.</p>`,
    `<p><strong>Yêu cầu 2 (trọng số 20%):</strong> xác định ít nhất 4 rủi ro đáng kể mà dự án có thể gặp. Với mỗi rủi ro, đánh giá (khả năng, tác động) và chiến lược giảm thiểu phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Payment gateway integration delays</strong> — Possibility: Medium. Impact: High. <strong>Mitigation:</strong> early technical meetings with providers; mock/sandbox testing before real integration.</p>
     <p><strong>Platform scalability issues (traffic spikes)</strong> — Possibility: High. Impact: High. <strong>Mitigation:</strong> load testing early in development; use scalable cloud infrastructure that can auto-scale under load.</p>
     <p><strong>Poor vendor adoption</strong> — Possibility: Medium. Impact: High. <strong>Mitigation:</strong> vendor onboarding campaigns; simple, intuitive UX/UI design to lower the barrier to entry.</p>
     <p><strong>Security breach (given the volume of transactions)</strong> — Possibility: Low. Impact: Very High. <strong>Mitigation:</strong> penetration testing before launch; implement strong encryption and secure payment-handling standards.</p>`,
    `<p><strong>Trễ tích hợp cổng thanh toán</strong> — Khả năng: Trung bình. Tác động: Cao. <strong>Giảm thiểu:</strong> họp kỹ thuật sớm với nhà cung cấp; kiểm thử mock/sandbox trước khi tích hợp thật.</p>
     <p><strong>Vấn đề khả năng mở rộng nền tảng (traffic tăng đột biến)</strong> — Khả năng: Cao. Tác động: Cao. <strong>Giảm thiểu:</strong> load-test sớm trong quá trình phát triển; dùng hạ tầng cloud có khả năng auto-scale khi tải cao.</p>
     <p><strong>Gian hàng tiếp nhận kém</strong> — Khả năng: Trung bình. Tác động: Cao. <strong>Giảm thiểu:</strong> chiến dịch thu hút gian hàng; thiết kế UX/UI đơn giản, trực quan để giảm rào cản tham gia.</p>
     <p><strong>Rò rỉ bảo mật (do khối lượng giao dịch lớn)</strong> — Khả năng: Thấp. Tác động: Rất cao. <strong>Giảm thiểu:</strong> penetration testing trước ra mắt; áp dụng mã hoá mạnh và chuẩn xử lý thanh toán an toàn.</p>`,
  ),
  rubric: [
    { id: 'four_risks', criterion: B('Identifies at least 4 distinct, plausible, project-relevant risks.', 'Xác định đủ ít nhất 4 rủi ro khác nhau, hợp lý, gắn với dự án.'), weight: 1, maxScore: 0.6 },
    { id: 'evaluation', criterion: B('Gives a possibility and impact rating for each risk, consistently applied.', 'Đánh giá khả năng và tác động cho từng rủi ro, nhất quán.'), weight: 1, maxScore: 0.7 },
    { id: 'mitigation', criterion: B('Gives a specific, actionable mitigation strategy for each risk.', 'Nêu chiến lược giảm thiểu cụ thể, khả thi cho từng rủi ro.'), weight: 1, maxScore: 0.7 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3.5,
  prompt: B(
    `<p><strong>Request 3 (weight 35%):</strong> assume that you have defined and estimated the schedule for one of the main project deliverables, with the high-level activities below:</p>${cpmTable}
     <p>a. What are the paths in the network diagram for the deliverable?</p>
     <p>b. Identify the minimum duration to complete that deliverable?</p>
     <p>c. What are the activities which have the most flexibility (in terms of time)?</p>
     <p>d. On the 5th day, you are executing activity D and found that you need to speed up the project schedule to recover a 3-day delay. Define at least four solutions, with relevant explanations and assumptions (if needed), to achieve that.</p>`,
    `<p><strong>Yêu cầu 3 (trọng số 35%):</strong> giả sử bạn đã xác định và ước lượng lịch trình cho 1 sản phẩm bàn giao chính, với các hoạt động mức cao sau:</p>${cpmTable}
     <p>a. Các đường đi trong sơ đồ mạng lưới là gì?</p>
     <p>b. Xác định thời lượng tối thiểu cần để hoàn thành sản phẩm bàn giao đó?</p>
     <p>c. Hoạt động nào có độ linh hoạt (về thời gian) nhiều nhất?</p>
     <p>d. Ở ngày thứ 5, bạn đang thực hiện hoạt động D và phát hiện cần đẩy nhanh lịch trình để bù lại độ trễ 3 ngày. Nêu ít nhất 4 giải pháp, kèm giải thích và giả định (nếu cần), để đạt được điều đó.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>a. All paths (Start to End):</strong></p>
     <ul><li>Start→A→D→E→End: 4+8+5 = <b>17 days</b></li>
     <li>Start→A→D→G→End: 4+8+3 = 15 days</li>
     <li>Start→B→F→G→End: 2+7+3 = 12 days</li>
     <li>Start→C→H→I→End: 3+8+3 = 14 days</li></ul>
     <p><strong>b. Minimum duration:</strong> 17 days (Start→A→D→E→End, the critical path).</p>
     <p><strong>c. Most flexible activities:</strong> B and F, each with <b>5 days of float</b> — the largest in the network. (For reference: A, D, E are on the critical path with 0 float; C, H, I each have 3 days of float; G has 2 days of float — so B and F are strictly the MOST flexible, not merely "any non-critical activity".)</p>
     <p><strong>d. Recovering a 3-day delay while executing D on day 5:</strong> since A→D→E is the critical path (0 float), a 3-day delay here directly delays the whole 17-day project unless corrected.</p>
     <ul><li><b>Solution 1 — Crashing D:</b> add extra resources to D itself (e.g. more developers/support) to finish the remaining work faster than originally planned — directly claws back time on the activity currently causing the delay, though likely at extra cost.</li>
     <li><b>Solution 2 — Fast-tracking:</b> start part of E's work in parallel with D's remaining work, instead of waiting for D to fully finish. Assumption: some of E's early tasks don't strictly require 100% of D's final output, so a limited overlap is technically possible with some rework risk.</li>
     <li><b>Solution 3 — Reduce scope (de-scope):</b> drop or defer some non-critical feature (e.g. minor vendor-customization options) to save time on D or E directly. Assumption: the sponsor approves cutting that specific piece of scope from this release.</li>
     <li><b>Solution 4 — Overtime/extra shifts:</b> ask the team to work extra hours temporarily on D (and E once reached) to recover the lost time. Assumption: the team has the capacity/morale for this and the budget allows the extra cost.</li></ul>`,
    `<p><strong>a. Tất cả đường đi (Start tới End):</strong></p>
     <ul><li>Start→A→D→E→End: 4+8+5 = <b>17 ngày</b></li>
     <li>Start→A→D→G→End: 4+8+3 = 15 ngày</li>
     <li>Start→B→F→G→End: 2+7+3 = 12 ngày</li>
     <li>Start→C→H→I→End: 3+8+3 = 14 ngày</li></ul>
     <p><strong>b. Thời lượng tối thiểu:</strong> 17 ngày (Start→A→D→E→End, đường găng).</p>
     <p><strong>c. Hoạt động linh hoạt nhất:</strong> B và F, mỗi cái có <b>float 5 ngày</b> — lớn nhất mạng lưới. (Tham khảo: A, D, E nằm trên đường găng, float=0; C, H, I mỗi cái float 3 ngày; G float 2 ngày — nên B và F mới thực sự là LINH HOẠT NHẤT, không phải "bất kỳ hoạt động không-găng nào".)</p>
     <p><strong>d. Phục hồi độ trễ 3 ngày khi đang thực hiện D ở ngày 5:</strong> vì A→D→E là đường găng (float=0), độ trễ 3 ngày ở đây trực tiếp làm trễ cả dự án 17 ngày nếu không khắc phục.</p>
     <ul><li><b>Giải pháp 1 — Crashing D:</b> thêm nguồn lực cho chính D (ví dụ thêm lập trình viên/hỗ trợ) để xong phần việc còn lại nhanh hơn kế hoạch gốc — lấy lại trực tiếp thời gian từ hoạt động đang gây trễ, dù có thể tốn thêm chi phí.</li>
     <li><b>Giải pháp 2 — Fast-tracking:</b> bắt đầu 1 phần việc của E song song với phần việc còn lại của D, thay vì đợi D xong hẳn. Giả định: một số việc đầu của E không nhất thiết cần 100% đầu ra cuối cùng của D, nên chồng lấn giới hạn khả thi kỹ thuật với rủi ro làm lại nào đó.</li>
     <li><b>Giải pháp 3 — Giảm phạm vi (de-scope):</b> bỏ hoặc dời 1 tính năng không găng (ví dụ tuỳ chỉnh gian hàng nhỏ) để tiết kiệm thời gian trực tiếp cho D hoặc E. Giả định: nhà tài trợ duyệt cắt đúng phần phạm vi đó khỏi bản phát hành này.</li>
     <li><b>Giải pháp 4 — Tăng ca/ca làm thêm:</b> yêu cầu nhóm làm thêm giờ tạm thời cho D (và E khi tới) để bù thời gian đã mất. Giả định: nhóm đủ sức/tinh thần và ngân sách cho phép chi phí thêm.</li></ul>`,
  ),
  explanation: B(
    `<p><b>Verified independently by hand</b> (full forward + backward CPM pass) against this deck's own <code>example.txt</code> — paths and critical path (17 days) match exactly. However, the example's answer to part (c) was imprecise: it lumped B, F, C, H, and I together as "most flexible" without noting that B and F (float=5) are strictly MORE flexible than C, H, I (float=3) — this deck's answer corrects that with the exact float value for every activity.</p>`,
    `<p><b>Đã tự tính tay độc lập</b> (đầy đủ CPM xuôi+ngược) đối chiếu với <code>example.txt</code> của chính đề này — đường đi và đường găng (17 ngày) khớp chính xác. Tuy nhiên câu trả lời (c) của example.txt THIẾU CHÍNH XÁC: gộp chung B, F, C, H, I là "linh hoạt nhất" mà không nói rõ B và F (float=5) LINH HOẠT HƠN C, H, I (float=3) — câu trả lời của đề này đã sửa lại đúng với giá trị float chính xác cho từng hoạt động.</p>`,
  ),
  rubric: [
    { id: 'all_paths', criterion: B('Correctly lists all 4 distinct start-to-end paths with correct durations.', 'Liệt kê đúng đủ 4 đường đi với thời lượng đúng.'), weight: 1, maxScore: 0.6 },
    { id: 'min_duration', criterion: B('Correctly identifies the minimum duration (17 days) and critical path (A-D-E).', 'Xác định đúng thời lượng tối thiểu (17 ngày) và đường găng (A-D-E).'), weight: 1, maxScore: 0.7 },
    { id: 'most_flexible_precise', criterion: B('Correctly and precisely identifies B and F (float=5) as the most flexible, not conflating them with lower-float activities.', 'Xác định đúng và chính xác B và F (float=5) là linh hoạt nhất, không gộp lẫn với hoạt động float thấp hơn.'), weight: 1, maxScore: 0.6 },
    { id: 'four_solutions', criterion: B('Proposes at least 4 distinct, technically sound recovery solutions with relevant assumptions.', 'Đề xuất đủ ít nhất 4 giải pháp phục hồi khác nhau, kỹ thuật hợp lý, kèm giả định phù hợp.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 2.5,
  prompt: B(
    `<p><strong>Request 4 (weight 25%):</strong> the project team has completed a workload equivalent to $300,000 and has spent $400,000 to date. Assume that you were budgeted $500,000 for the work scheduled. At the start, the team estimated a total project budget of $800,000, and the project needs 6 months to finish. Evaluate the current project status and give forecasts to complete the project in terms of schedule and cost, showing your calculations in detail.</p>`,
    `<p><strong>Yêu cầu 4 (trọng số 25%):</strong> nhóm dự án đã hoàn thành khối lượng công việc tương đương $300,000 và đã chi $400,000 tính đến nay. Giả sử ngân sách phân bổ cho công việc đã lên lịch là $500,000. Ban đầu, nhóm ước lượng tổng ngân sách dự án $800,000, dự án cần 6 tháng để hoàn thành. Đánh giá tình trạng dự án hiện tại và đưa ra dự báo hoàn thành về tiến độ và chi phí, trình bày chi tiết cách tính.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Given:</strong> EV = $300,000; AC = $400,000; PV = $500,000; BAC = $800,000; planned duration = 6 months.</p>
     <p><strong>Calculations:</strong></p>
     <ul><li>CPI = EV/AC = 300,000/400,000 = <b>0.75</b></li>
     <li>SPI = EV/PV = 300,000/500,000 = <b>0.6</b></li>
     <li>SV = EV−PV = 300,000−500,000 = <b>−$200,000</b></li>
     <li>CV = EV−AC = 300,000−400,000 = <b>−$100,000</b></li>
     <li>EAC = BAC/CPI = 800,000/0.75 ≈ <b>$1,066,667</b></li>
     <li>ETC = EAC−AC = 1,066,667−400,000 ≈ <b>$666,667</b></li></ul>
     <p><strong>Current status:</strong> CPI=0.75&lt;1 means cost efficiency is poor — only $0.75 of value is being earned for every $1 spent. SPI=0.6&lt;1 means the project is severely behind schedule — only 60% of the planned progress has actually been achieved.</p>
     <p><strong>Cost forecast:</strong> at the current cost efficiency, the project is forecast to cost about $1,066,667 instead of the $800,000 originally budgeted — an overrun of about $266,667 (33% over budget) if this trend continues.</p>
     <p><strong>Schedule forecast:</strong> using the SPI as a schedule-rate multiplier on the originally planned 6-month duration: estimated total duration ≈ (1/SPI) × 6 = (1/0.6) × 6 ≈ <b>10 months</b> — about 4 months longer than planned, if the current pace continues unchanged.</p>
     <p><strong>Summary/recommended action:</strong> the project is both significantly over budget and significantly behind schedule — a serious double-underperformance situation. Recommended actions: formally re-baseline the schedule and budget with the sponsor rather than silently absorbing the overrun; add resources to critical-path work; consider reducing scope for lower-priority features; investigate and fix the root cause of the cost/schedule slippage before approving further spending.</p>`,
    `<p><strong>Dữ liệu cho:</strong> EV = $300,000; AC = $400,000; PV = $500,000; BAC = $800,000; thời lượng kế hoạch = 6 tháng.</p>
     <p><strong>Tính toán:</strong></p>
     <ul><li>CPI = EV/AC = 300,000/400,000 = <b>0.75</b></li>
     <li>SPI = EV/PV = 300,000/500,000 = <b>0.6</b></li>
     <li>SV = EV−PV = 300,000−500,000 = <b>−$200,000</b></li>
     <li>CV = EV−AC = 300,000−400,000 = <b>−$100,000</b></li>
     <li>EAC = BAC/CPI = 800,000/0.75 ≈ <b>$1,066,667</b></li>
     <li>ETC = EAC−AC = 1,066,667−400,000 ≈ <b>$666,667</b></li></ul>
     <p><strong>Tình trạng hiện tại:</strong> CPI=0.75&lt;1 nghĩa là hiệu suất chi phí kém — chỉ thu được $0.75 giá trị cho mỗi $1 chi ra. SPI=0.6&lt;1 nghĩa là dự án trễ tiến độ nghiêm trọng — chỉ đạt 60% tiến độ so với kế hoạch.</p>
     <p><strong>Dự báo chi phí:</strong> với hiệu suất chi phí hiện tại, dự án dự báo tốn khoảng $1,066,667 thay vì $800,000 ngân sách ban đầu — vượt khoảng $266,667 (33% vượt ngân sách) nếu xu hướng này tiếp diễn.</p>
     <p><strong>Dự báo tiến độ:</strong> dùng SPI làm hệ số nhân nhịp độ trên thời lượng kế hoạch ban đầu 6 tháng: thời lượng dự báo ≈ (1/SPI) × 6 = (1/0.6) × 6 ≈ <b>10 tháng</b> — trễ khoảng 4 tháng so với kế hoạch nếu nhịp độ hiện tại không đổi.</p>
     <p><strong>Tóm tắt/đề xuất hành động:</strong> dự án VỪA vượt ngân sách đáng kể VỪA trễ tiến độ đáng kể — tình huống kém hiệu suất nghiêm trọng ở cả 2 mặt. Đề xuất: lập lại baseline tiến độ và ngân sách chính thức với nhà tài trợ thay vì âm thầm gánh chịu vượt chi; thêm nguồn lực cho công việc đường găng; cân nhắc giảm phạm vi các tính năng ưu tiên thấp; tìm và sửa nguyên nhân gốc của việc trễ/vượt chi trước khi duyệt chi thêm.</p>`,
  ),
  explanation: B(
    `<p>Verified independently and cross-checked against this deck's own <code>example.txt</code> — every figure matches exactly (CPI=0.75, SPI=0.6, EAC≈$1,066,667, schedule forecast ≈10 months), confirming both the given data and the standard EVM formulas were applied correctly.</p>`,
    `<p>Đã tự verify độc lập và đối chiếu với <code>example.txt</code> của chính đề này — mọi con số khớp chính xác (CPI=0.75, SPI=0.6, EAC≈$1,066,667, dự báo tiến độ ≈10 tháng), xác nhận cả dữ liệu đề cho lẫn công thức EVM chuẩn đều được áp dụng đúng.</p>`,
  ),
  rubric: [
    { id: 'cpi_spi', criterion: B('Correctly calculates CPI (0.75) and SPI (0.6).', 'Tính đúng CPI (0.75) và SPI (0.6).'), weight: 1, maxScore: 0.5 },
    { id: 'sv_cv', criterion: B('Correctly calculates SV (-$200,000) and CV (-$100,000).', 'Tính đúng SV (-$200,000) và CV (-$100,000).'), weight: 1, maxScore: 0.4 },
    { id: 'cost_forecast', criterion: B('Correctly calculates EAC (≈$1,066,667) using BAC/CPI, and states the resulting overrun.', 'Tính đúng EAC (≈$1,066,667) dùng BAC/CPI, nêu đúng mức vượt chi phí.'), weight: 1, maxScore: 0.6 },
    { id: 'schedule_forecast', criterion: B('Correctly calculates a schedule forecast (≈10 months) using the SPI as a rate multiplier on the planned duration.', 'Tính đúng dự báo tiến độ (≈10 tháng) dùng SPI làm hệ số nhân trên thời lượng kế hoạch.'), weight: 1, maxScore: 0.5 },
    { id: 'commentary', criterion: B('Correctly identifies the project as both over budget and behind schedule, with sensible recommended actions.', 'Nhận ra đúng dự án vừa vượt ngân sách vừa trễ tiến độ, kèm đề xuất hợp lý.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE5',
    title: 'PMG201c.PE3 – E-Commerce Website for Small Businesses (Spring 2025)|||PMG201c.PE3 – Website Thương mại điện tử cho Doanh nghiệp nhỏ (Spring 2025)',
    description: 'PMG201c PE (WRITE): stakeholder management, risk register, critical path method (CPM) with schedule recovery, and earned value management (EVM) with dual schedule+cost forecasting, AI-graded.|||PE PMG201c (viết): quản lý bên liên quan, sổ rủi ro, phân tích đường găng (CPM) kèm phục hồi tiến độ, và quản lý giá trị thu được (EVM) kèm dự báo cả tiến độ lẫn chi phí, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
