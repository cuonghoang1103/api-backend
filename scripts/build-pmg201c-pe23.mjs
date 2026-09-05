/**
 * build-pmg201c-pe23.mjs — sinh content/exams/PMG201c-PE23.mjs.
 *
 * Nguồn thật: "PMG201c - SP26 - PE2" ("PMG201c - Practical Exam 2
 * (Spring 2026)", dự án mở rộng chuỗi cà phê "Coi Cafe" vào 5 tỉnh
 * miền Trung). Không có solution.
 *
 * Request 2 (chi phí): 6 khoản tự dựng cộng đúng 8.500 triệu VND =
 * 8,5 tỷ VND — khớp CHÍNH XÁC tổng ngân sách đề cho, có chủ đích.
 *
 * Trọng số gốc: Req1=20%, Req2=20%, Req3=30%, Req4=30% → 2/2/3/3 (10đ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE23.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE23.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context:</b><p>Coi Cafe is a purely Vietnamese coffee brand that runs 12 stores in Hanoi and Ho Chi Minh City, well known for its nostalgic space, traditional drink menu, and sustainable business model (using reusable cups and purchasing coffee directly from Dak Lak farmers). The management decided to carry out an expansion project into <b>5 Central provinces</b> (Da Nang, Hue, Quang Nam, Quang Ngai, Binh Dinh), opening <b>1 flagship store in each province within 12 months</b>. The project involves surveying and selecting premises, designing and constructing interiors consistent with the brand, recruiting and training local personnel, building a raw material supply chain from Central region suppliers, and launching campaigns for each store. The Market Development Director acts as the PM leading the project, coordinating with the interior design team, HR team, and marketing team. The total budget is <b>VND 8.5 billion</b> (approximately VND 1.7 billion/store) from equity and commercial bank loans. Each store must reach the break-even point within <b>8 months</b> after opening.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh:</b><p>Coi Cafe là thương hiệu cà phê thuần Việt vận hành 12 cửa hàng tại Hà Nội và TP.HCM, nổi tiếng với không gian hoài cổ, thực đơn đồ uống truyền thống, và mô hình kinh doanh bền vững (dùng cốc tái sử dụng, mua cà phê trực tiếp từ nông dân Đắk Lắk). Ban lãnh đạo quyết định mở rộng vào <b>5 tỉnh miền Trung</b> (Đà Nẵng, Huế, Quảng Nam, Quảng Ngãi, Bình Định), mở <b>1 cửa hàng chủ lực mỗi tỉnh trong 12 tháng</b>. Dự án gồm: khảo sát và chọn mặt bằng, thiết kế và thi công nội thất đúng thương hiệu, tuyển và đào tạo nhân sự địa phương, xây chuỗi cung ứng nguyên liệu từ nhà cung cấp miền Trung, và khởi động chiến dịch cho từng cửa hàng. Giám đốc Phát triển Thị trường làm PM dẫn dắt dự án, phối hợp nhóm thiết kế nội thất, nhóm HR, và nhóm marketing. Tổng ngân sách <b>8,5 tỷ VND</b> (khoảng 1,7 tỷ VND/cửa hàng) từ vốn chủ sở hữu và vay ngân hàng thương mại. Mỗi cửa hàng phải đạt điểm hòa vốn trong <b>8 tháng</b> sau khai trương.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 2 (Spring 2026)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 2 (Spring 2026)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> write a narrative charter statement that covers: (1) Project name; (2) Justifications (the purpose &amp; reasons for implementing this project); (3) Project constraints, in terms of scope, time, cost/budget, and quality.</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> viết bản charter dạng tường thuật gồm: (1) Tên dự án; (2) Lý do (mục đích &amp; lý do thực hiện); (3) Ràng buộc dự án theo phạm vi, thời gian, chi phí/ngân sách, chất lượng.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Project name:</strong> Coi Cafe Central Vietnam Expansion Project.</p>
     <p><strong>2. Justifications:</strong> purpose — expand Coi Cafe's nostalgic, sustainable Vietnamese coffee brand beyond its current 2-city footprint into 5 growing Central-province markets. Reasons: (1) the brand's 12 stores are concentrated only in Hanoi and Ho Chi Minh City, leaving substantial untapped demand in Central Vietnam's urban markets; (2) Coi Cafe already sources coffee directly from Dak Lak farmers in the Central Highlands — geographically close to these 5 provinces — making a Central-region supply chain a natural, lower-friction expansion synergy rather than starting from scratch.</p>
     <p><strong>3. Project constraints:</strong></p>
     <ul><li><b>Scope:</b> 5 flagship stores, 1 each in Da Nang, Hue, Quang Nam, Quang Ngai, and Binh Dinh, covering premises survey/selection, brand-consistent interior design/construction, local personnel recruiting/training, a Central-region raw material supply chain, and per-store launch campaigns.</li>
     <li><b>Time:</b> all 5 stores must open within 12 months; each individual store must then reach break-even within 8 months of its own opening.</li>
     <li><b>Cost/Budget:</b> VND 8.5 billion total (~VND 1.7 billion/store), funded by equity and commercial bank loans.</li>
     <li><b>Quality:</b> each store must be fully brand-consistent (nostalgic space, traditional menu, reusable cups, direct Dak Lak sourcing) and must hit break-even within the 8-month window.</li></ul>`,
    `<p><strong>1. Tên dự án:</strong> Dự án Mở rộng Coi Cafe vào Miền Trung.</p>
     <p><strong>2. Lý do:</strong> mục đích — mở rộng thương hiệu cà phê Việt hoài cổ, bền vững của Coi Cafe vượt ra ngoài phạm vi 2 thành phố hiện tại vào 5 thị trường tỉnh miền Trung đang tăng trưởng. Lý do: (1) 12 cửa hàng thương hiệu chỉ tập trung ở Hà Nội và TP.HCM, để lại nhu cầu chưa khai thác đáng kể ở các thị trường đô thị miền Trung; (2) Coi Cafe đã mua cà phê trực tiếp từ nông dân Đắk Lắk vùng Tây Nguyên — gần về địa lý với 5 tỉnh này — khiến chuỗi cung ứng miền Trung là cộng hưởng mở rộng tự nhiên, ít ma sát hơn là bắt đầu từ đầu.</p>
     <p><strong>3. Ràng buộc dự án:</strong></p>
     <ul><li><b>Phạm vi:</b> 5 cửa hàng chủ lực, mỗi tỉnh 1 (Đà Nẵng, Huế, Quảng Nam, Quảng Ngãi, Bình Định), gồm khảo sát/chọn mặt bằng, thiết kế/thi công nội thất đúng thương hiệu, tuyển/đào tạo nhân sự địa phương, chuỗi cung ứng nguyên liệu miền Trung, và chiến dịch khai trương từng cửa hàng.</li>
     <li><b>Thời gian:</b> cả 5 cửa hàng phải mở trong 12 tháng; mỗi cửa hàng riêng lẻ phải đạt hòa vốn trong 8 tháng kể từ ngày khai trương của chính nó.</li>
     <li><b>Chi phí/Ngân sách:</b> tổng 8,5 tỷ VND (~1,7 tỷ VND/cửa hàng), từ vốn chủ sở hữu và vay ngân hàng thương mại.</li>
     <li><b>Chất lượng:</b> mỗi cửa hàng phải đúng thương hiệu toàn diện (không gian hoài cổ, thực đơn truyền thống, cốc tái sử dụng, nguồn Đắk Lắk trực tiếp) và phải đạt hòa vốn trong 8 tháng.</li></ul>`,
  ),
  rubric: [
    { id: 'project_name', criterion: B('Gives a clear, specific project name.', 'Đặt tên dự án rõ ràng, cụ thể.'), weight: 1, maxScore: 0.3 },
    { id: 'justifications', criterion: B('Explains a coherent purpose and reasons tied to market expansion and the Dak Lak supply-chain synergy, not just restating the task.', 'Giải thích lý do mạch lạc, gắn với mở rộng thị trường và cộng hưởng chuỗi cung ứng Đắk Lắk, không chỉ chép lại đề.'), weight: 1, maxScore: 0.7 },
    { id: 'constraints_all4', criterion: B('Covers all 4 constraint dimensions with the specific figures from the scenario (5 provinces, 12 months, 8 months break-even, VND 8.5 billion).', 'Bao quát đủ 4 ràng buộc với đúng số liệu tình huống (5 tỉnh, 12 tháng, hòa vốn 8 tháng, 8,5 tỷ VND).'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (20%):</strong> provide at least five main cost/budget items. For each cost/budget item, provide: name, description, estimation along with the way to estimate (how to estimate), person in charge.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> nêu ít nhất 5 khoản chi phí/ngân sách chính. Mỗi khoản gồm: tên, mô tả, ước tính kèm cách ước tính, người phụ trách.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Premises survey &amp; lease/acquisition</strong> — description: site-scouting and securing a lease or purchase for 5 flagship locations across the 5 provinces. Estimation: <b>VND 2,500,000,000</b> (~VND 500M/store). Method: market-rate lease/purchase quotes per province × 5 locations. Person in charge: the Market Development Director (PM).</p>
     <p><strong>2. Interior design &amp; construction</strong> — description: designing and building brand-consistent nostalgic-style interiors for 5 stores. Estimation: <b>VND 3,000,000,000</b> (~VND 600M/store). Method: the interior design team's per-store build quote × 5. Person in charge: interior design team lead.</p>
     <p><strong>3. Personnel recruiting &amp; training</strong> — description: recruiting and training local staff at each of the 5 new locations to the brand's service standards. Estimation: <b>VND 750,000,000</b> (~VND 150M/store). Method: the HR team's per-store hiring/training cost estimate × 5. Person in charge: HR team lead.</p>
     <p><strong>4. Raw material supply chain setup</strong> — description: establishing Central-region logistics to supply Dak Lak-sourced coffee and other ingredients to all 5 new stores. Estimation: <b>VND 1,000,000,000</b>. Method: a logistics-vendor quote for a regional distribution route serving 5 provinces. Person in charge: the Market Development Director.</p>
     <p><strong>5. Store launch campaigns</strong> — description: marketing and launch events for each of the 5 stores' grand openings. Estimation: <b>VND 750,000,000</b> (~VND 150M/store). Method: the marketing team's per-store launch-campaign budget × 5. Person in charge: marketing team lead.</p>
     <p><strong>6. Equipment &amp; fixtures</strong> — description: coffee-brewing equipment, furniture, and fixtures for 5 stores. Estimation: <b>VND 500,000,000</b> (~VND 100M/store). Method: supplier catalog quote × 5. Person in charge: interior design team lead.</p>
     <p><i>Total of the 6 items above: VND 8,500,000,000 — exactly matching the scenario's VND 8.5 billion total budget, by design.</i></p>`,
    `<p><strong>1. Khảo sát &amp; thuê/mua mặt bằng</strong> — mô tả: khảo sát địa điểm và thuê/mua cho 5 vị trí chủ lực qua 5 tỉnh. Ước tính: <b>2.500.000.000 VND</b> (~500 triệu/cửa hàng). Cách ước tính: báo giá thuê/mua theo giá thị trường mỗi tỉnh × 5 vị trí. Người phụ trách: Giám đốc Phát triển Thị trường (PM).</p>
     <p><strong>2. Thiết kế &amp; thi công nội thất</strong> — mô tả: thiết kế và xây dựng nội thất phong cách hoài cổ đúng thương hiệu cho 5 cửa hàng. Ước tính: <b>3.000.000.000 VND</b> (~600 triệu/cửa hàng). Cách ước tính: báo giá thi công mỗi cửa hàng của nhóm thiết kế nội thất × 5. Người phụ trách: trưởng nhóm thiết kế nội thất.</p>
     <p><strong>3. Tuyển dụng &amp; đào tạo nhân sự</strong> — mô tả: tuyển và đào tạo nhân sự địa phương tại mỗi 5 vị trí mới theo chuẩn dịch vụ thương hiệu. Ước tính: <b>750.000.000 VND</b> (~150 triệu/cửa hàng). Cách ước tính: ước tính chi phí tuyển/đào tạo mỗi cửa hàng của nhóm HR × 5. Người phụ trách: trưởng nhóm HR.</p>
     <p><strong>4. Xây chuỗi cung ứng nguyên liệu</strong> — mô tả: thiết lập hậu cần miền Trung để cung cà phê nguồn Đắk Lắk và nguyên liệu khác cho cả 5 cửa hàng mới. Ước tính: <b>1.000.000.000 VND</b>. Cách ước tính: báo giá đơn vị logistics cho tuyến phân phối vùng phục vụ 5 tỉnh. Người phụ trách: Giám đốc Phát triển Thị trường.</p>
     <p><strong>5. Chiến dịch khai trương cửa hàng</strong> — mô tả: marketing và sự kiện khai trương cho từng 5 cửa hàng. Ước tính: <b>750.000.000 VND</b> (~150 triệu/cửa hàng). Cách ước tính: ngân sách chiến dịch khai trương mỗi cửa hàng của nhóm marketing × 5. Người phụ trách: trưởng nhóm marketing.</p>
     <p><strong>6. Thiết bị &amp; nội thất</strong> — mô tả: máy pha cà phê, bàn ghế, nội thất cho 5 cửa hàng. Ước tính: <b>500.000.000 VND</b> (~100 triệu/cửa hàng). Cách ước tính: báo giá catalogue nhà cung cấp × 5. Người phụ trách: trưởng nhóm thiết kế nội thất.</p>
     <p><i>Tổng 6 khoản trên: 8.500.000.000 VND — khớp CHÍNH XÁC tổng ngân sách 8,5 tỷ VND của tình huống đề, có chủ đích.</i></p>`,
  ),
  rubric: [
    { id: 'five_items', criterion: B('Lists at least 5 distinct, realistic cost items relevant to opening 5 flagship coffee-shop stores across 5 provinces.', 'Nêu đủ ít nhất 5 khoản chi phí khác nhau, thực tế, gắn với mở 5 cửa hàng cà phê chủ lực qua 5 tỉnh.'), weight: 1, maxScore: 0.7 },
    { id: 'complete_fields', criterion: B('Each item includes name, description, estimation, a stated estimating method, and person in charge.', 'Mỗi khoản có đủ tên, mô tả, ước tính, cách ước tính, và người phụ trách.'), weight: 1, maxScore: 1 },
    { id: 'within_budget', criterion: B('Total estimated cost is consistent with (or thoughtfully discusses) the VND 8.5 billion cap.', 'Tổng chi phí ước tính khớp (hoặc bàn luận hợp lý) với trần 8,5 tỷ VND.'), weight: 1, maxScore: 0.3 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 (30%):</strong> identify three project risks by listing the risk title/name, description, possible impacts (in terms of scope or quality, time, and cost), and relevant risk response plans (mitigation, contingency).</p>`,
    `<p><strong>Yêu cầu 3 (30%):</strong> xác định 3 rủi ro dự án, nêu tên/tiêu đề rủi ro, mô tả, tác động khả dĩ (phạm vi/chất lượng, thời gian, chi phí), và kế hoạch ứng phó (giảm thiểu, dự phòng).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Risk 1 — Central-region supply chain disruption:</strong> description: logistics carrying Dak Lak-sourced coffee and other ingredients to the 5 new stores fail to reach them reliably (transport delays, quality inconsistency). Impacts — Scope/Quality: could force serving an inconsistent menu or running out of key traditional-menu ingredients, breaking brand consistency. Time: could delay a store's opening if initial stock isn't ready in time. Cost: potential higher emergency-logistics costs or spoilage losses.<br/>Response: Mitigation — establish and test the Central-region supply route well before each store's planned opening, with buffer stock on hand. Contingency — if a specific store's supply chain has issues, temporarily source ingredients through the nearest already-operating Hanoi/HCMC supply channel (even at higher cost) until the Central route stabilizes.</p>
     <p><strong>Risk 2 — Difficulty recruiting qualified local personnel across 5 new provinces simultaneously:</strong> description: hiring enough local staff who can uphold the brand's nostalgic service standards proves harder than expected when done in parallel across 5 unfamiliar markets. Impacts — Scope/Quality: risks the brand's service-consistency reputation if staff aren't properly trained in time. Time: could delay individual store openings if hiring targets aren't met. Cost: potential added recruiting/training cost (recruiter fees, extended training periods).<br/>Response: Mitigation — start local recruiting and training well ahead of each store's target opening date, using one standardized training curriculum shared across all 5 sites. Contingency — if a specific province's hiring falls short, temporarily deploy experienced staff from existing Hanoi/HCMC stores to that location so it can still open on schedule while local hiring continues.</p>
     <p><strong>Risk 3 — A store fails to reach break-even within the 8-month target:</strong> description: Central-region demand for the brand's price point or style turns out lower than in Hanoi/HCMC. Impacts — Scope/Quality: doesn't directly breach the physical scope, but signals the expansion model may need local adjustment; risks lender/investor confidence given the equity-plus-bank-loan funding. Time: no direct delay to that store's own timeline, though it affects confidence in the timeline for any future 6th/7th store decision. Cost: continued operating losses beyond month 8 increase the loan-servicing burden.<br/>Response: Mitigation — conduct thorough local market research and price-sensitivity testing before finalizing each store's pricing/menu localization ahead of opening. Contingency — if a specific store is trending behind by month 4-5, run a targeted local marketing push and consider a limited local-menu adjustment to boost demand before the 8-month deadline.</p>`,
    `<p><strong>Rủi ro 1 — Gián đoạn chuỗi cung ứng miền Trung:</strong> mô tả: hậu cần chở cà phê nguồn Đắk Lắk và nguyên liệu khác tới 5 cửa hàng mới không tới đều đặn (trễ vận chuyển, chất lượng không ổn định). Tác động — Phạm vi/Chất lượng: có thể buộc phục vụ thực đơn không nhất quán hoặc hết nguyên liệu chính của thực đơn truyền thống, phá vỡ nhất quán thương hiệu. Thời gian: có thể trễ khai trương cửa hàng nếu tồn kho ban đầu chưa sẵn sàng kịp. Chi phí: có thể tăng chi phí hậu cần khẩn cấp hoặc thất thoát do hỏng hàng.<br/>Ứng phó: Giảm thiểu — thiết lập và thử nghiệm tuyến cung ứng miền Trung từ trước ngày khai trương dự kiến mỗi cửa hàng, có tồn kho đệm sẵn. Dự phòng — nếu 1 cửa hàng cụ thể có vấn đề chuỗi cung ứng, tạm lấy nguyên liệu qua kênh cung ứng Hà Nội/TP.HCM đang hoạt động gần nhất (dù chi phí cao hơn) tới khi tuyến miền Trung ổn định.</p>
     <p><strong>Rủi ro 2 — Khó tuyển nhân sự địa phương đủ chuẩn ở 5 tỉnh mới cùng lúc:</strong> mô tả: tuyển đủ nhân sự địa phương giữ được chuẩn dịch vụ hoài cổ của thương hiệu khó hơn dự kiến khi làm song song ở 5 thị trường chưa quen. Tác động — Phạm vi/Chất lượng: rủi ro danh tiếng nhất quán dịch vụ nếu nhân sự chưa đào tạo kịp. Thời gian: có thể trễ khai trương từng cửa hàng nếu không đạt chỉ tiêu tuyển. Chi phí: có thể tăng chi phí tuyển/đào tạo (phí tuyển dụng, kéo dài đào tạo).<br/>Ứng phó: Giảm thiểu — bắt đầu tuyển và đào tạo địa phương sớm trước ngày khai trương mục tiêu mỗi cửa hàng, dùng 1 chương trình đào tạo chuẩn hóa chung cho cả 5 nơi. Dự phòng — nếu tỉnh cụ thể tuyển không đủ, tạm điều nhân sự có kinh nghiệm từ cửa hàng Hà Nội/TP.HCM hiện có tới vị trí đó để vẫn khai trương đúng lịch trong khi tuyển địa phương tiếp tục.</p>
     <p><strong>Rủi ro 3 — 1 cửa hàng không đạt hòa vốn trong mục tiêu 8 tháng:</strong> mô tả: nhu cầu miền Trung với mức giá/phong cách thương hiệu thấp hơn Hà Nội/TP.HCM. Tác động — Phạm vi/Chất lượng: không vi phạm trực tiếp phạm vi vật lý, nhưng báo hiệu mô hình mở rộng cần điều chỉnh địa phương; rủi ro niềm tin nhà cho vay/nhà đầu tư vì dùng vốn chủ sở hữu cộng vay ngân hàng. Thời gian: không trễ trực tiếp lịch của cửa hàng đó, nhưng ảnh hưởng niềm tin vào lịch quyết định cửa hàng thứ 6/7 tương lai. Chi phí: lỗ vận hành kéo dài quá tháng 8 tăng gánh nặng trả nợ vay.<br/>Ứng phó: Giảm thiểu — nghiên cứu thị trường địa phương kỹ và thử độ nhạy giá trước khi chốt giá/địa phương hóa thực đơn mỗi cửa hàng trước khai trương. Dự phòng — nếu 1 cửa hàng cụ thể có xu hướng chậm tới tháng 4-5, chạy chiến dịch marketing địa phương có mục tiêu và cân nhắc điều chỉnh thực đơn địa phương giới hạn để tăng nhu cầu trước hạn 8 tháng.</p>`,
  ),
  rubric: [
    { id: 'three_risks', criterion: B('Identifies 3 distinct, realistic risks with clear titles and descriptions grounded in the scenario.', 'Xác định 3 rủi ro khác nhau, thực tế, có tiêu đề và mô tả rõ, gắn với tình huống đề.'), weight: 1, maxScore: 0.9 },
    { id: 'impact_dimensions', criterion: B('Each risk correctly analyzes impact across scope/quality, time, and cost.', 'Mỗi rủi ro phân tích đúng tác động theo phạm vi/chất lượng, thời gian, và chi phí.'), weight: 1, maxScore: 1.2 },
    { id: 'response_plans', criterion: B('Each risk has both a mitigation plan and a contingency plan, both specific to the Coi Cafe expansion scenario.', 'Mỗi rủi ro có cả kế hoạch giảm thiểu và dự phòng, cụ thể theo tình huống mở rộng Coi Cafe.'), weight: 1, maxScore: 0.9 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 4 (30%):</strong> describe a RACI chart in which you: (1) define at least three project roles; (2) list out at least ten tasks, activities, or deliverables; (3) for each task/activity/deliverable, list out the responsibilities of the project roles.</p>`,
    `<p><strong>Yêu cầu 4 (30%):</strong> mô tả bảng RACI: (1) xác định ít nhất 3 vai trò dự án; (2) liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm bàn giao; (3) với mỗi nhiệm vụ, nêu trách nhiệm từng vai trò.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Roles:</strong> Market Development Director/PM, Interior Design Team (IDT), HR Team, Marketing Team.</p>
     <table><tr><th>Task/Activity/Deliverable</th><th>PM</th><th>IDT</th><th>HR</th><th>Marketing</th></tr>
     <tr><td>1. Survey/select premises for all 5 provinces</td><td>R, A</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>2. Negotiate/finalize lease or purchase agreements</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>3. Design brand-consistent interior per store</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>4. Construct/build out each store's interior</td><td>A</td><td>R</td><td>I</td><td>I</td></tr>
     <tr><td>5. Recruit local personnel per store</td><td>A</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>6. Train personnel on brand service standards</td><td>A</td><td>I</td><td>R</td><td>C</td></tr>
     <tr><td>7. Establish the Central-region supply chain</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>8. Procure equipment/fixtures</td><td>A</td><td>R</td><td>I</td><td>I</td></tr>
     <tr><td>9. Plan/execute each store's launch campaign</td><td>A</td><td>C</td><td>I</td><td>R</td></tr>
     <tr><td>10. Monitor each store's break-even progress post-opening</td><td>R, A</td><td>I</td><td>I</td><td>C</td></tr>
     <tr><td>11. Track overall project budget against the VND 8.5B cap</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>12. Compile the final expansion completion report</td><td>A</td><td>C</td><td>C</td><td>C</td></tr></table>
     <p><i>R=Responsible, A=Accountable, C=Consulted, I=Informed. Every row has exactly one A (several rows show the PM as both Responsible and Accountable, since the Market Development Director does that work personally), and no cell is left ambiguous.</i></p>`,
    `<p><strong>Vai trò:</strong> Giám đốc Phát triển Thị trường/PM, Nhóm Thiết kế Nội thất (IDT), Nhóm HR, Nhóm Marketing.</p>
     <table><tr><th>Nhiệm vụ/Hoạt động/Sản phẩm</th><th>PM</th><th>IDT</th><th>HR</th><th>Marketing</th></tr>
     <tr><td>1. Khảo sát/chọn mặt bằng cho cả 5 tỉnh</td><td>R, A</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>2. Đàm phán/chốt hợp đồng thuê/mua</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>3. Thiết kế nội thất đúng thương hiệu mỗi cửa hàng</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>4. Thi công nội thất từng cửa hàng</td><td>A</td><td>R</td><td>I</td><td>I</td></tr>
     <tr><td>5. Tuyển nhân sự địa phương mỗi cửa hàng</td><td>A</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>6. Đào tạo nhân sự theo chuẩn dịch vụ thương hiệu</td><td>A</td><td>I</td><td>R</td><td>C</td></tr>
     <tr><td>7. Xây chuỗi cung ứng miền Trung</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>8. Mua sắm thiết bị/nội thất</td><td>A</td><td>R</td><td>I</td><td>I</td></tr>
     <tr><td>9. Lên kế hoạch/thực hiện chiến dịch khai trương mỗi cửa hàng</td><td>A</td><td>C</td><td>I</td><td>R</td></tr>
     <tr><td>10. Giám sát tiến độ hòa vốn mỗi cửa hàng sau khai trương</td><td>R, A</td><td>I</td><td>I</td><td>C</td></tr>
     <tr><td>11. Theo dõi ngân sách tổng dự án so trần 8,5 tỷ VND</td><td>R, A</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>12. Tổng hợp báo cáo hoàn thành mở rộng cuối</td><td>A</td><td>C</td><td>C</td><td>C</td></tr></table>
     <p><i>R=Chịu trách nhiệm thực hiện, A=Chịu trách nhiệm giải trình, C=Được tham vấn, I=Được thông báo. Mỗi dòng đúng 1 A (nhiều dòng PM vừa Responsible vừa Accountable vì Giám đốc Phát triển Thị trường tự làm việc đó), không ô nào mơ hồ.</i></p>`,
  ),
  rubric: [
    { id: 'three_roles', criterion: B('Defines at least 3 clear, distinct project roles relevant to a multi-store expansion project.', 'Xác định ít nhất 3 vai trò dự án rõ ràng, khác nhau, gắn với dự án mở rộng đa cửa hàng.'), weight: 1, maxScore: 0.6 },
    { id: 'ten_tasks', criterion: B('Lists at least 10 distinct, realistic tasks/activities/deliverables.', 'Liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm khác nhau, thực tế.'), weight: 1, maxScore: 1 },
    { id: 'raci_assignment', criterion: B('Each task has a full RACI assignment across all roles, with exactly one Accountable per task and no ambiguous/missing cells.', 'Mỗi nhiệm vụ có đủ gán RACI cho mọi vai trò, đúng 1 người Accountable mỗi nhiệm vụ, không ô nào mơ hồ/thiếu.'), weight: 1, maxScore: 1.4 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE23',
    title: 'PMG201c – Practical Exam 2 (Spring 2026), Coi Cafe Central Vietnam Expansion|||PMG201c – Thi thực hành 2 (Spring 2026), Coi Cafe mở rộng miền Trung',
    description: 'PMG201c PE (WRITE): project charter, cost/budget items, risk register, RACI chart for a coffee-brand expansion project, AI-graded.|||PE PMG201c (viết): charter dự án, khoản mục chi phí/ngân sách, sổ rủi ro, bảng RACI cho dự án mở rộng thương hiệu cà phê, chấm AI.',
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
