/**
 * build-pmg201c-pe19.mjs — sinh content/exams/PMG201c-PE19.mjs.
 *
 * Nguồn thật: "PMG201c - SU26 - PE1" ("PMG201c - Practical Exam 1
 * (Summer 2026)", ảnh 001.webp, dựng lễ hội "Flavours of Vietnam" tại
 * Hồ Hoàn Kiếm). Không có solution. Điểm gốc không đều: Q1=3, Q2=2.5,
 * Q3=2.5, Q4=2 (giữ nguyên, không quy đổi).
 *
 * Request 2 (chi phí): 7 khoản tự dựng cộng đúng 3.200 triệu VND =
 * 3,2 tỷ VND — khớp CHÍNH XÁC tổng ngân sách đề cho, có chủ đích.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE19.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE19.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Project Scenario:</b><p>The Hoan Kiem District People's Committee, in collaboration with the Hanoi Tourism Association, is organising a Local Food and Culture Festival called <b>"Flavours of Vietnam"</b> at the Hoan Kiem Lake area in Hanoi. The goal is to promote the traditional culinary heritage of all 63 provinces, stimulate domestic tourism, and attract international visitors during the post-summer off-peak period.</p>
   <p>The festival runs for three days (Friday to Sunday) and features a food market with 200 vendor stalls, three outdoor folk arts performance stages, a traditional craft-making experience zone, and a photo check-in area designed to generate social media engagement. The scope does NOT include a commercial trade fair, industrial product exhibitions, or any online sales activities operating under the festival brand.</p>
   <p>The organising committee consists of a Project Manager from the District Department of Culture and Information, a representative from the Hanoi Tourism Association, a communications team, and logistics service providers. All preparation work — including permit applications, vendor selection, and booth construction — must be completed within four months before the opening day. The total budget is VND 3.2 billion, sourced from the district budget (VND 2 billion) and corporate sponsorship (VND 1.2 billion), and must not be exceeded.</p>
   <p>The event must obtain all required permits and maintain full compliance with food safety and hygiene regulations. Success will be evaluated based on visitor attendance (minimum 50,000 footfalls across three days), zero food safety and hygiene incidents, zero public security incidents, and a vendor satisfaction score of at least 4.0 out of 5.0 collected through a post-event survey.</p></div>`,
  `<div class="pe-system"><b>Tình huống dự án:</b><p>Ủy ban Nhân dân Quận Hoàn Kiếm, phối hợp Hiệp hội Du lịch Hà Nội, tổ chức Lễ hội Ẩm thực và Văn hóa địa phương mang tên <b>"Flavours of Vietnam"</b> tại khu vực Hồ Hoàn Kiếm, Hà Nội. Mục tiêu là quảng bá di sản ẩm thực truyền thống của cả 63 tỉnh thành, kích cầu du lịch nội địa, và thu hút khách quốc tế trong giai đoạn thấp điểm sau hè.</p>
   <p>Lễ hội diễn ra 3 ngày (Thứ Sáu đến Chủ Nhật), gồm khu chợ ẩm thực 200 gian hàng, 3 sân khấu biểu diễn nghệ thuật dân gian ngoài trời, khu trải nghiệm làm thủ công truyền thống, và khu check-in ảnh thiết kế để tạo hiệu ứng mạng xã hội. Phạm vi KHÔNG bao gồm hội chợ thương mại, triển lãm sản phẩm công nghiệp, hay bất kỳ hoạt động bán hàng online nào dưới thương hiệu lễ hội.</p>
   <p>Ban tổ chức gồm Project Manager từ Phòng Văn hóa Thông tin Quận, đại diện Hiệp hội Du lịch Hà Nội, nhóm truyền thông, và đơn vị cung cấp hậu cần. Mọi công tác chuẩn bị — xin phép, chọn nhà cung cấp gian hàng, dựng gian hàng — phải hoàn tất trong 4 tháng trước ngày khai mạc. Tổng ngân sách 3,2 tỷ VND, từ ngân sách quận (2 tỷ) và tài trợ doanh nghiệp (1,2 tỷ), không được vượt.</p>
   <p>Sự kiện phải xin đủ giấy phép và tuân thủ đầy đủ quy định an toàn vệ sinh thực phẩm. Thành công đánh giá qua: lượng khách tham dự (tối thiểu 50.000 lượt qua 3 ngày), zero sự cố an toàn vệ sinh thực phẩm, zero sự cố an ninh công cộng, và điểm hài lòng nhà cung cấp gian hàng tối thiểu 4.0/5.0 qua khảo sát sau sự kiện.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 1 (Summer 2026)</strong>. Time allowed: 115 minutes. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 1 (Summer 2026)</strong>. Thời gian: 115 phút. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Question 1 – Project Charter Statement (3 marks):</strong> develop a narrative charter statement that includes: Project name; Justifications (purpose and at least two reasons to implement this project); and Project constraints (in terms of scope, time, cost/budget, and quality).</p>`,
    `<p><strong>Câu 1 – Bản Charter dự án (3 điểm):</strong> viết charter dạng tường thuật gồm: Tên dự án; Lý do (mục đích và ít nhất 2 lý do thực hiện); Ràng buộc dự án (phạm vi, thời gian, chi phí/ngân sách, chất lượng).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Project name:</strong> "Flavours of Vietnam" Food and Culture Festival 2026.</p>
     <p><strong>Justifications:</strong> Purpose — promote the traditional culinary heritage of Vietnam's 63 provinces in one unified showcase, while stimulating domestic tourism and attracting international visitors during Hanoi's post-summer off-peak period. Reasons: (1) Hanoi's tourism traffic typically dips after summer, and a signature cultural festival gives the city a concrete draw during this slow window; (2) many provincial culinary traditions currently have no unified national platform for exposure, so bringing all 63 provinces together in one event builds cultural pride and helps preserve this heritage; (3) a successful first edition lays the groundwork for Hoan Kiem to establish this as a recurring annual cultural-tourism event, building longer-term sponsor and visitor relationships.</p>
     <p><strong>Project constraints:</strong></p>
     <ul><li><b>Scope:</b> a food market with 200 vendor stalls, 3 outdoor folk-arts performance stages, a craft-making experience zone, and a photo check-in area — explicitly excluding any commercial trade fair, industrial product exhibitions, or online sales under the festival brand.</li>
     <li><b>Time:</b> a 3-day event (Friday-Sunday); all preparation (permits, vendor selection, booth construction) must be completed within a hard 4-month window before opening day.</li>
     <li><b>Cost/Budget:</b> VND 3.2 billion total (VND 2 billion district budget + VND 1.2 billion corporate sponsorship), which must not be exceeded.</li>
     <li><b>Quality:</b> all required permits obtained and full food-safety/hygiene compliance maintained; success measured by ≥50,000 visitor footfalls across 3 days, zero food-safety/hygiene incidents, zero public-security incidents, and a vendor satisfaction score of at least 4.0/5.0.</li></ul>`,
    `<p><strong>Tên dự án:</strong> Lễ hội Ẩm thực và Văn hóa "Flavours of Vietnam" 2026.</p>
     <p><strong>Lý do:</strong> Mục đích — quảng bá di sản ẩm thực truyền thống của 63 tỉnh thành Việt Nam trong 1 sự kiện thống nhất, đồng thời kích cầu du lịch nội địa và thu hút khách quốc tế trong giai đoạn thấp điểm sau hè của Hà Nội. Lý do: (1) lượng khách du lịch Hà Nội thường giảm sau hè, một lễ hội văn hóa đặc trưng cho thành phố lý do cụ thể để thu hút khách trong giai đoạn chậm này; (2) nhiều truyền thống ẩm thực địa phương hiện chưa có nền tảng quốc gia thống nhất để quảng bá, gộp cả 63 tỉnh vào 1 sự kiện xây tự hào văn hóa và giúp bảo tồn di sản này; (3) một mùa đầu thành công đặt nền móng cho Hoàn Kiếm biến đây thành sự kiện văn hóa-du lịch thường niên, xây quan hệ nhà tài trợ và du khách dài hạn.</p>
     <p><strong>Ràng buộc dự án:</strong></p>
     <ul><li><b>Phạm vi:</b> chợ ẩm thực 200 gian hàng, 3 sân khấu nghệ thuật dân gian ngoài trời, khu trải nghiệm thủ công, khu check-in ảnh — loại trừ rõ hội chợ thương mại, triển lãm sản phẩm công nghiệp, hay bán hàng online dưới thương hiệu lễ hội.</li>
     <li><b>Thời gian:</b> sự kiện 3 ngày (Thứ Sáu-Chủ Nhật); toàn bộ chuẩn bị (giấy phép, chọn nhà cung cấp, dựng gian hàng) phải hoàn tất trong 4 tháng cứng trước ngày khai mạc.</li>
     <li><b>Chi phí/Ngân sách:</b> tổng 3,2 tỷ VND (2 tỷ ngân sách quận + 1,2 tỷ tài trợ doanh nghiệp), không được vượt.</li>
     <li><b>Chất lượng:</b> đủ mọi giấy phép và tuân thủ đầy đủ an toàn vệ sinh thực phẩm; thành công đo qua ≥50.000 lượt khách qua 3 ngày, zero sự cố an toàn vệ sinh thực phẩm, zero sự cố an ninh, điểm hài lòng nhà cung cấp gian hàng tối thiểu 4.0/5.0.</li></ul>`,
  ),
  rubric: [
    { id: 'project_name', criterion: B('Gives a clear, specific project name.', 'Đặt tên dự án rõ ràng, cụ thể.'), weight: 1, maxScore: 0.4 },
    { id: 'justifications', criterion: B('States the purpose and at least 2 distinct reasons, coherent and grounded in the scenario, not just restating the task.', 'Nêu mục đích và ít nhất 2 lý do khác nhau, mạch lạc, gắn với tình huống đề, không chỉ chép lại đề.'), weight: 1, maxScore: 1.1 },
    { id: 'constraints_all4', criterion: B('Covers all 4 constraint dimensions (scope, time, cost/budget, quality) with the specific figures from the scenario (200 stalls, 3 days, 4 months, VND 3.2B, 50,000 footfalls, zero incidents, 4.0/5.0).', 'Bao quát đủ 4 ràng buộc với đúng số liệu tình huống (200 gian hàng, 3 ngày, 4 tháng, 3,2 tỷ VND, 50.000 lượt, zero sự cố, 4.0/5.0).'), weight: 1, maxScore: 1.5 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2.5,
  prompt: B(
    `<p><strong>Question 2 – Cost and Budget Plan (2.5 marks):</strong> provide at least five main cost/budget items. For each item, include: Name, Description, and Estimation (the estimated amount and how you estimated it — method, basis, person in charge).</p>`,
    `<p><strong>Câu 2 – Kế hoạch chi phí và ngân sách (2.5 điểm):</strong> nêu ít nhất 5 khoản chi phí/ngân sách chính. Mỗi khoản gồm: Tên, Mô tả, Ước tính (số tiền ước tính và cách ước tính — phương pháp, căn cứ, người phụ trách).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Vendor stall construction &amp; setup</strong> — description: building/renting 200 food-vendor stalls including tents, tables, and power hookups. Estimation: <b>VND 1,000,000,000</b>. Method: unit cost per stall (~VND 5,000,000) × 200 stalls. Person in charge: logistics service provider.</p>
     <p><strong>2. Performance stage rental &amp; production</strong> — description: 3 outdoor folk-arts stages including sound/lighting equipment and performer fees across the 3-day run. Estimation: <b>VND 600,000,000</b>. Method: stage-production vendor quote per stage-day × 3 stages × 3 days. Person in charge: Project Manager.</p>
     <p><strong>3. Permits &amp; regulatory compliance</strong> — description: event permits and food-safety/hygiene and security-permit fees. Estimation: <b>VND 150,000,000</b>. Method: published government fee schedule for events of this scale. Person in charge: Project Manager.</p>
     <p><strong>4. Marketing &amp; communications</strong> — description: social-media campaign, press outreach, printed materials, and the photo check-in area's design/build. Estimation: <b>VND 500,000,000</b>. Method: quote from the communications team's proposed campaign plan. Person in charge: communications team lead.</p>
     <p><strong>5. Security &amp; crowd management</strong> — description: security staff and crowd-control barriers across 3 days for a 200-stall, multi-stage site expecting 50,000+ visitors. Estimation: <b>VND 400,000,000</b>. Method: security-vendor quote based on per-day staffing rate × estimated headcount needed for the site size. Person in charge: logistics service provider.</p>
     <p><strong>6. Food safety &amp; hygiene monitoring</strong> — description: on-site inspectors and waste-management services to maintain zero food-safety incidents across 200 stalls. Estimation: <b>VND 250,000,000</b>. Method: per-day inspector/waste-crew staffing rate × 3 days. Person in charge: Hanoi Tourism Association representative (compliance liaison).</p>
     <p><strong>7. Contingency reserve</strong> — description: reserve for unforeseen costs (weather contingency, last-minute vendor replacement). Estimation: <b>VND 300,000,000</b>. Method: a standard ~10% contingency reserve on top of the itemized estimate. Person in charge: Project Manager.</p>
     <p><i>Total of the 7 items above: VND 3,200,000,000 — exactly matching the scenario's VND 3.2 billion total budget, by design.</i></p>`,
    `<p><strong>1. Dựng &amp; lắp đặt gian hàng</strong> — mô tả: dựng/thuê 200 gian hàng ẩm thực gồm lều, bàn, kết nối điện. Ước tính: <b>1.000.000.000 VND</b>. Cách ước tính: đơn giá mỗi gian (~5.000.000 VND) × 200 gian. Người phụ trách: đơn vị hậu cần.</p>
     <p><strong>2. Thuê &amp; dựng sân khấu biểu diễn</strong> — mô tả: 3 sân khấu nghệ thuật dân gian ngoài trời gồm thiết bị âm thanh/ánh sáng và phí biểu diễn suốt 3 ngày. Ước tính: <b>600.000.000 VND</b>. Cách ước tính: báo giá đơn vị dựng sân khấu theo ngày/sân × 3 sân × 3 ngày. Người phụ trách: Project Manager.</p>
     <p><strong>3. Giấy phép &amp; tuân thủ quy định</strong> — mô tả: phí xin phép sự kiện, phí kiểm định an toàn vệ sinh thực phẩm và an ninh. Ước tính: <b>150.000.000 VND</b>. Cách ước tính: biểu phí nhà nước công bố cho sự kiện quy mô này. Người phụ trách: Project Manager.</p>
     <p><strong>4. Truyền thông &amp; marketing</strong> — mô tả: chiến dịch mạng xã hội, quan hệ báo chí, tài liệu in, thiết kế/dựng khu check-in ảnh. Ước tính: <b>500.000.000 VND</b>. Cách ước tính: báo giá theo kế hoạch chiến dịch nhóm truyền thông đề xuất. Người phụ trách: trưởng nhóm truyền thông.</p>
     <p><strong>5. An ninh &amp; quản lý đám đông</strong> — mô tả: nhân viên an ninh và rào chắn kiểm soát đám đông suốt 3 ngày cho khu 200 gian hàng, nhiều sân khấu, dự kiến 50.000+ khách. Ước tính: <b>400.000.000 VND</b>. Cách ước tính: báo giá đơn vị an ninh theo mức nhân sự/ngày × số người ước tính cần cho quy mô khu vực. Người phụ trách: đơn vị hậu cần.</p>
     <p><strong>6. Giám sát an toàn vệ sinh thực phẩm</strong> — mô tả: thanh tra tại chỗ và dịch vụ quản lý rác để giữ zero sự cố an toàn thực phẩm qua 200 gian hàng. Ước tính: <b>250.000.000 VND</b>. Cách ước tính: mức nhân sự thanh tra/thu gom rác theo ngày × 3 ngày. Người phụ trách: đại diện Hiệp hội Du lịch Hà Nội (đầu mối tuân thủ).</p>
     <p><strong>7. Quỹ dự phòng</strong> — mô tả: quỹ cho chi phí phát sinh (dự phòng thời tiết, thay nhà cung cấp phút chót). Ước tính: <b>300.000.000 VND</b>. Cách ước tính: quỹ dự phòng chuẩn ~10% trên tổng ước tính theo khoản mục. Người phụ trách: Project Manager.</p>
     <p><i>Tổng 7 khoản trên: 3.200.000.000 VND — khớp CHÍNH XÁC tổng ngân sách 3,2 tỷ VND của tình huống đề, có chủ đích.</i></p>`,
  ),
  rubric: [
    { id: 'five_items', criterion: B('Lists at least 5 distinct, realistic cost items relevant to organizing a 3-day, 200-stall food and culture festival.', 'Nêu đủ ít nhất 5 khoản chi phí khác nhau, thực tế, gắn với tổ chức lễ hội ẩm thực-văn hóa 3 ngày, 200 gian hàng.'), weight: 1, maxScore: 0.9 },
    { id: 'complete_fields', criterion: B('Each item includes name, description, an estimated amount, and a stated estimating method/basis with a person in charge.', 'Mỗi khoản có đủ tên, mô tả, số tiền ước tính, kèm phương pháp/căn cứ ước tính và người phụ trách.'), weight: 1, maxScore: 1.1 },
    { id: 'within_budget', criterion: B('Total estimated cost is consistent with (or thoughtfully discusses) the VND 3.2 billion cap.', 'Tổng chi phí ước tính khớp (hoặc bàn luận hợp lý) với trần 3,2 tỷ VND.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 2.5,
  prompt: B(
    `<p><strong>Question 3 – Risk Register (2.5 marks):</strong> identify three project risks. For each risk, provide: Risk title/name, Description, Possible impacts (in terms of scope or quality, time, and cost), and Risk response plans (mitigation plan and contingency plan).</p>`,
    `<p><strong>Câu 3 – Sổ rủi ro (2.5 điểm):</strong> xác định 3 rủi ro dự án. Mỗi rủi ro gồm: Tên rủi ro, Mô tả, Tác động khả dĩ (phạm vi/chất lượng, thời gian, chi phí), và Kế hoạch ứng phó (giảm thiểu, dự phòng).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Risk 1 — Adverse weather during the 3-day outdoor event:</strong> description: heavy rain or a storm hits during the Friday-Sunday run, disrupting the outdoor stages and food stalls. Impacts — Scope/Quality: could force cancelling outdoor performances, degrading the visitor experience and risking the ≥50,000-footfall target. Time: could shorten or delay festival hours. Cost: emergency tenting/covering, or refunding vendor stall fees for lost days.<br/>Response: Mitigation — book weatherproof tenting for all stages and stalls in advance, and monitor forecasts closely in the week before the event. Contingency — have an extended-hours plan for the following weekend, or shift outdoor programming to covered spaces near Hoan Kiem Lake if severe weather hits.</p>
     <p><strong>Risk 2 — Food safety/hygiene incident at a vendor stall:</strong> description: a food-poisoning or hygiene-violation incident occurs at one of the 200 stalls. Impacts — Scope/Quality: directly breaches the "zero food safety and hygiene incidents" success criterion and harms the festival's reputation. Time: could force temporarily closing the affected stall/area. Cost: potential liability, medical-response costs, and increased monitoring costs afterward.<br/>Response: Mitigation — mandatory food-safety training and health certification for every vendor before entry, with on-site inspectors doing spot checks across all 3 days. Contingency — a pre-arranged protocol to immediately close the affected stall, provide on-site medical response, and issue a public communication to maintain trust.</p>
     <p><strong>Risk 3 — Lower-than-target visitor attendance or vendor turnout:</strong> description: fewer than 50,000 visitors attend, or planned vendors withdraw, due to competing events or insufficient promotion. Impacts — Scope/Quality: directly breaches the attendance success criterion and risks the vendor satisfaction score if vendors don't get expected foot traffic. Time: none directly. Cost: sponsors expecting a certain visibility/footfall may see reduced value, risking future sponsorship renewal (a longer-term cost).<br/>Response: Mitigation — start the marketing campaign well ahead of the 4-month prep deadline, using multi-channel promotion (social media, press, Tourism Association partner channels). Contingency — if early interest signals trend low, add last-minute promotional incentives (e.g. free craft-workshop slots, influencer partnerships) to boost turnout.</p>`,
    `<p><strong>Rủi ro 1 — Thời tiết xấu trong 3 ngày sự kiện ngoài trời:</strong> mô tả: mưa lớn/bão xảy ra trong Thứ Sáu-Chủ Nhật, làm gián đoạn sân khấu và gian hàng ngoài trời. Tác động — Phạm vi/Chất lượng: có thể buộc huỷ biểu diễn ngoài trời, làm giảm trải nghiệm khách và rủi ro mục tiêu ≥50.000 lượt. Thời gian: có thể rút ngắn/trì hoãn giờ mở cửa. Chi phí: lều/che chắn khẩn cấp, hoặc hoàn phí gian hàng cho ngày mất.<br/>Ứng phó: Giảm thiểu — đặt lều chống thấm cho mọi sân khấu và gian hàng từ trước, theo dõi sát dự báo thời tiết tuần trước sự kiện. Dự phòng — có kế hoạch kéo dài giờ cho cuối tuần sau, hoặc chuyển chương trình ngoài trời sang không gian có mái gần Hồ Hoàn Kiếm nếu thời tiết xấu.</p>
     <p><strong>Rủi ro 2 — Sự cố an toàn vệ sinh thực phẩm tại 1 gian hàng:</strong> mô tả: sự cố ngộ độc/vi phạm vệ sinh xảy ra tại 1 trong 200 gian hàng. Tác động — Phạm vi/Chất lượng: vi phạm trực tiếp tiêu chí "zero sự cố an toàn vệ sinh thực phẩm" và hại danh tiếng lễ hội. Thời gian: có thể buộc đóng tạm gian/khu vực bị ảnh hưởng. Chi phí: rủi ro trách nhiệm, chi phí y tế phản ứng, tăng chi phí giám sát sau đó.<br/>Ứng phó: Giảm thiểu — bắt buộc đào tạo an toàn thực phẩm và chứng nhận sức khỏe cho mọi nhà cung cấp trước khi vào, kèm thanh tra tại chỗ kiểm tra đột xuất suốt 3 ngày. Dự phòng — quy trình đã chuẩn bị sẵn để đóng ngay gian bị ảnh hưởng, phản ứng y tế tại chỗ, và ra thông cáo công khai để giữ niềm tin.</p>
     <p><strong>Rủi ro 3 — Lượng khách/nhà cung cấp tham gia thấp hơn mục tiêu:</strong> mô tả: dưới 50.000 khách tham dự, hoặc nhà cung cấp đã lên kế hoạch rút lui, do sự kiện cạnh tranh hoặc quảng bá chưa đủ. Tác động — Phạm vi/Chất lượng: vi phạm trực tiếp tiêu chí thành công về tham dự và rủi ro điểm hài lòng nhà cung cấp nếu không có đủ lượng khách như kỳ vọng. Thời gian: không trực tiếp. Chi phí: nhà tài trợ kỳ vọng độ hiển thị/lượt khách nhất định có thể thấy giá trị giảm, rủi ro không gia hạn tài trợ (chi phí dài hạn).<br/>Ứng phó: Giảm thiểu — bắt đầu chiến dịch marketing sớm trước hạn chuẩn bị 4 tháng, quảng bá đa kênh (mạng xã hội, báo chí, kênh đối tác Hiệp hội Du lịch). Dự phòng — nếu tín hiệu quan tâm sớm thấp, thêm ưu đãi quảng bá phút chót (VD suất workshop thủ công miễn phí, hợp tác influencer) để tăng lượng khách.</p>`,
  ),
  rubric: [
    { id: 'three_risks', criterion: B('Identifies 3 distinct, realistic risks with clear titles and descriptions grounded in the scenario.', 'Xác định 3 rủi ro khác nhau, thực tế, có tiêu đề và mô tả rõ, gắn với tình huống đề.'), weight: 1, maxScore: 0.8 },
    { id: 'impact_dimensions', criterion: B('Each risk correctly analyzes impact across scope/quality, time, and cost.', 'Mỗi rủi ro phân tích đúng tác động theo phạm vi/chất lượng, thời gian, và chi phí.'), weight: 1, maxScore: 1 },
    { id: 'response_plans', criterion: B('Each risk has both a mitigation plan and a contingency plan, both specific to the festival scenario.', 'Mỗi rủi ro có cả kế hoạch giảm thiểu và dự phòng, cụ thể theo tình huống lễ hội.'), weight: 1, maxScore: 0.7 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Question 4 – Milestones and Activity Sequencing (2 marks):</strong> provide at least three main project milestones. Select one milestone you know best, then: (1) determine at least ten activities needed to complete that milestone; (2) determine the sequence and relationships among those activities using FS, SS, SF, or FF where appropriate.</p>`,
    `<p><strong>Câu 4 – Mốc và trình tự hoạt động (2 điểm):</strong> nêu ít nhất 3 mốc dự án chính. Chọn 1 mốc bạn hiểu rõ nhất, rồi: (1) xác định ít nhất 10 hoạt động cần để hoàn thành mốc đó; (2) xác định trình tự và quan hệ giữa các hoạt động dùng FS, SS, SF, hoặc FF khi phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Three main milestones:</strong></p>
     <ol><li>Permits &amp; vendor selection complete — all permits obtained and 200 vendor stalls confirmed (end of month 2 of the 4-month prep window).</li>
     <li>Booth construction &amp; site setup complete — stages, stalls, craft zone, and photo area all built (end of month 4, just before opening day).</li>
     <li>Festival execution complete — all 3 days run, closing/breakdown done (project end).</li></ol>
     <p><strong>Selected milestone: "Booth construction &amp; site setup complete."</strong> Activities and sequencing:</p>
     <ol><li>A1 — Finalize the site layout plan (stalls, stages, craft zone, photo-area placement). (start of the chain)</li>
     <li>A2 — Obtain final site/construction permits for booth building. Relationship: <b>FS</b> after A1.</li>
     <li>A3 — Procure construction materials (tents, stage rigging, power/electrical equipment). Relationship: <b>SS</b> with A2 (procurement can start once the layout is final, in parallel with the permit process).</li>
     <li>A4 — Construct the 200 vendor stalls. Relationship: <b>FS</b> after both A2 and A3.</li>
     <li>A5 — Install power/electrical hookups at each stall. Relationship: <b>SS</b> with A4 (wired stall-by-stall as each frame finishes, not waiting for all 200 first).</li>
     <li>A6 — Construct the 3 outdoor performance stages (staging, sound, lighting). Relationship: <b>SS</b> with A4 (a separate site zone with a separate crew, built in parallel).</li>
     <li>A7 — Build the traditional craft-making experience zone. Relationship: <b>SS</b> with A6 (also a separate zone/crew).</li>
     <li>A8 — Build the photo check-in area. Relationship: <b>SS</b> with A7.</li>
     <li>A9 — Conduct a full-site safety inspection (structural, fire, electrical). Relationship: <b>FS</b> after A5, A6, A7, and A8 (needs every physical structure actually built first).</li>
     <li>A10 — Conduct a food-safety/hygiene compliance check on all 200 stalls. Relationship: <b>SS</b> with A9 (a separate compliance track running alongside the general safety inspection).</li>
     <li>A11 — Fix any issues found during inspections. Relationship: <b>FF</b> with both A9 and A10 (fixes close out together with the inspections, not strictly starting only after they fully finish).</li>
     <li>A12 — Final walkthrough sign-off by the Project Manager and the Hanoi Tourism Association representative. Relationship: <b>FS</b> after A11.</li></ol>
     <p><i>Note: no genuine Start-to-Finish (SF) relationship is used, as none of this workflow's real dependencies are Start-to-Finish in nature — SF is rare in practice, and forcing one in would misrepresent the actual dependency rather than reflect it.</i></p>`,
    `<p><strong>3 mốc dự án chính:</strong></p>
     <ol><li>Giấy phép &amp; chọn nhà cung cấp gian hàng xong — đủ mọi giấy phép và xác nhận 200 gian hàng (cuối tháng 2 trong 4 tháng chuẩn bị).</li>
     <li>Dựng gian hàng &amp; thiết lập mặt bằng xong — sân khấu, gian hàng, khu thủ công, khu check-in ảnh đều đã dựng (cuối tháng 4, ngay trước khai mạc).</li>
     <li>Thực hiện lễ hội xong — cả 3 ngày diễn ra, đã dọn dẹp/bế mạc (kết thúc dự án).</li></ol>
     <p><strong>Mốc được chọn: "Dựng gian hàng &amp; thiết lập mặt bằng xong".</strong> Hoạt động và trình tự:</p>
     <ol><li>A1 — Chốt sơ đồ mặt bằng (vị trí gian hàng, sân khấu, khu thủ công, khu ảnh). (đầu chuỗi)</li>
     <li>A2 — Xin giấy phép xây dựng/mặt bằng cuối cùng cho dựng gian hàng. Quan hệ: <b>FS</b> sau A1.</li>
     <li>A3 — Mua vật tư xây dựng (lều, giàn sân khấu, thiết bị điện). Quan hệ: <b>SS</b> với A2 (mua sắm bắt đầu ngay khi sơ đồ chốt, song song quá trình xin phép).</li>
     <li>A4 — Dựng 200 gian hàng. Quan hệ: <b>FS</b> sau cả A2 và A3.</li>
     <li>A5 — Lắp điện từng gian hàng. Quan hệ: <b>SS</b> với A4 (lắp theo từng gian khi khung xong, không đợi hết 200 gian).</li>
     <li>A6 — Dựng 3 sân khấu biểu diễn ngoài trời (khung sân khấu, âm thanh, ánh sáng). Quan hệ: <b>SS</b> với A4 (khu vực và đội thi công riêng, dựng song song).</li>
     <li>A7 — Dựng khu trải nghiệm làm thủ công. Quan hệ: <b>SS</b> với A6 (cũng khu/đội riêng).</li>
     <li>A8 — Dựng khu check-in ảnh. Quan hệ: <b>SS</b> với A7.</li>
     <li>A9 — Kiểm tra an toàn toàn khu (kết cấu, cháy nổ, điện). Quan hệ: <b>FS</b> sau A5, A6, A7, A8 (cần mọi công trình đã dựng xong thật sự).</li>
     <li>A10 — Kiểm tra tuân thủ an toàn vệ sinh thực phẩm ở cả 200 gian hàng. Quan hệ: <b>SS</b> với A9 (nhánh tuân thủ riêng, chạy song song kiểm tra an toàn chung).</li>
     <li>A11 — Sửa các vấn đề phát hiện trong kiểm tra. Quan hệ: <b>FF</b> với cả A9 và A10 (sửa xong cùng lúc kiểm tra đóng lại, không nhất thiết chỉ bắt đầu sau khi kiểm tra xong hẳn).</li>
     <li>A12 — Đi kiểm tra cuối và ký duyệt bởi PM và đại diện Hiệp hội Du lịch Hà Nội. Quan hệ: <b>FS</b> sau A11.</li></ol>
     <p><i>Lưu ý: không dùng quan hệ Start-to-Finish (SF) thật vì không có phụ thuộc thật nào của quy trình này mang bản chất Start-to-Finish — SF vốn hiếm trong thực tế, ép dùng sẽ phản ánh sai phụ thuộc thay vì đúng.</i></p>`,
  ),
  explanation: B(
    `<p>No source solution existed for this request. Sequencing was reasoned from first principles of a realistic multi-zone event-construction workflow, using FS/SS/FF where each genuinely applies.</p>`,
    `<p>Đề này không có solution nguồn cho yêu cầu này. Trình tự được suy luận từ nguyên lý gốc của quy trình dựng sự kiện đa khu thực tế, dùng FS/SS/FF ở đúng chỗ áp dụng thật.</p>`,
  ),
  rubric: [
    { id: 'three_milestones', criterion: B('Provides at least 3 distinct, meaningful project milestones consistent with the scenario.', 'Nêu ít nhất 3 mốc dự án khác nhau, có ý nghĩa, nhất quán với tình huống đề.'), weight: 1, maxScore: 0.5 },
    { id: 'ten_activities', criterion: B('Determines at least 10 distinct, realistic activities to complete the chosen milestone.', 'Xác định ít nhất 10 hoạt động khác nhau, thực tế để hoàn thành mốc đã chọn.'), weight: 1, maxScore: 0.8 },
    { id: 'sequencing_relationships', criterion: B('Each activity has a stated, logically correct sequencing relationship (FS/SS/SF/FF) that genuinely reflects real dependency.', 'Mỗi hoạt động có quan hệ trình tự (FS/SS/SF/FF) nêu rõ, đúng logic, phản ánh đúng phụ thuộc thật.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE19',
    title: 'PMG201c – Practical Exam 1 (Summer 2026), Flavours of Vietnam Festival|||PMG201c – Thi thực hành 1 (Summer 2026), Lễ hội Flavours of Vietnam',
    description: 'PMG201c PE (WRITE): project charter, cost/budget plan, risk register, milestone activity sequencing (FS/SS/SF/FF) for a food and culture festival in Hanoi, AI-graded.|||PE PMG201c (viết): charter dự án, kế hoạch chi phí/ngân sách, sổ rủi ro, trình tự hoạt động theo mốc (FS/SS/SF/FF) cho lễ hội ẩm thực-văn hóa Hà Nội, chấm AI.',
    durationMinutes: 115,
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
