/**
 * build-pmg201c-pe22.mjs — sinh content/exams/PMG201c-PE22.mjs.
 *
 * Nguồn thật: "PMG201c - SP26 - PE1" ("PMG201c - Practical Exam 1
 * (Spring 2026)", chiến dịch truyền thông quốc gia "Read Every Day" —
 * Bộ Thông tin và Truyền thông, Cục Xuất bản, In và Phát hành). Không
 * có solution. Không có CPM/EVM số học — Request 4 chỉ yêu cầu XÁC ĐỊNH
 * quan hệ trình tự (FS/SS/SF/FF), không tính ES/EF/LS/LF hay đường găng.
 *
 * Trọng số gốc: Req1=20%, Req2=20%, Req3=30%, Req4=30% → 2/2/3/3 (10đ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE22.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE22.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context:</b><p>Under the Ministry of Information and Communications, the Authority of Publication, Printing and Distribution launches the national communication campaign <b>"Read Every Day"</b>, which targets teenagers and young adults aged 13–22 nationwide as a response to the trend of declining reading time amid the boom of social media and short videos. The campaign runs for <b>6 months</b> and covers the following activities: producing a series of <b>12 viral short videos</b> on TikTok/YouTube/Instagram in collaboration with youth KOLs and influencers; organizing an online book review competition; building the "Viet Books" community on social media platforms; and coordinating with <b>500 high schools and universities</b> across the country to set up reading corners. The project team is composed of a PM from the Authority of Publication, a content production group, representatives from Kim Dong Publishing House (strategic partner), and an executing communication agency. The budget is <b>VND 1.8 billion</b> sourced from the state cultural career fund. Success indicators include total video views, the number of participating schools, and the rate of increase in reading time among the surveyed group.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh:</b><p>Dưới Bộ Thông tin và Truyền thông, Cục Xuất bản, In và Phát hành phát động chiến dịch truyền thông quốc gia <b>"Read Every Day"</b>, nhắm tới thanh thiếu niên và người trẻ 13–22 tuổi toàn quốc, đáp lại xu hướng giảm thời gian đọc sách giữa làn sóng mạng xã hội và video ngắn. Chiến dịch chạy <b>6 tháng</b>, gồm: sản xuất chuỗi <b>12 video ngắn viral</b> trên TikTok/YouTube/Instagram phối hợp KOL/influencer trẻ; tổ chức cuộc thi review sách online; xây dựng cộng đồng "Viet Books" trên mạng xã hội; và phối hợp <b>500 trường THPT và đại học</b> toàn quốc lập góc đọc sách. Đội dự án gồm PM từ Cục Xuất bản, nhóm sản xuất nội dung, đại diện Nhà xuất bản Kim Đồng (đối tác chiến lược), và agency truyền thông thực thi. Ngân sách <b>1,8 tỷ VND</b> từ quỹ sự nghiệp văn hóa nhà nước. Chỉ số thành công gồm tổng lượt xem video, số trường tham gia, và tỉ lệ tăng thời gian đọc sách trong nhóm khảo sát.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 1 (Spring 2026)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 1 (Spring 2026)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> write a narrative charter statement that includes: (1) Project name; (2) Justifications (purpose &amp; reasons to implement this project); (3) Project constraints, in terms of scope, time, cost/budget, and quality.</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> viết bản charter dạng tường thuật gồm: (1) Tên dự án; (2) Lý do (mục đích &amp; lý do thực hiện); (3) Ràng buộc dự án theo phạm vi, thời gian, chi phí/ngân sách, chất lượng.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Project name:</strong> "Read Every Day" National Reading Communication Campaign.</p>
     <p><strong>2. Justifications:</strong> purpose — reverse the decline in reading time among Vietnamese teenagers and young adults (13-22) driven by the rise of social media and short-video consumption. Reasons: (1) national trend data shows reading time among this age group falling as short-video platforms absorb their attention, threatening long-term literacy and reading culture; (2) building a reading habit in an audience already living on TikTok/YouTube/Instagram requires meeting them on those platforms with native-format content (viral short videos, KOL collaborations) rather than relying on traditional print-only promotion, which this age group largely no longer engages with.</p>
     <p><strong>3. Project constraints:</strong></p>
     <ul><li><b>Scope:</b> 12 viral short videos with youth KOLs/influencers, an online book review competition, the "Viet Books" social media community, and coordination with 500 high schools/universities for reading corners — no broader curriculum change or activities beyond these four workstreams.</li>
     <li><b>Time:</b> a 6-month campaign.</li>
     <li><b>Cost/Budget:</b> VND 1.8 billion total, sourced from the state cultural career fund.</li>
     <li><b>Quality:</b> success measured by total video views across the 12-video series, the number of participating schools (target 500), and the rate of increase in reading time among the surveyed group.</li></ul>`,
    `<p><strong>1. Tên dự án:</strong> Chiến dịch truyền thông quốc gia "Read Every Day".</p>
     <p><strong>2. Lý do:</strong> mục đích — đảo ngược đà giảm thời gian đọc sách của thanh thiếu niên/người trẻ Việt Nam (13-22 tuổi) do sự trỗi dậy của mạng xã hội và video ngắn. Lý do: (1) dữ liệu xu hướng quốc gia cho thấy thời gian đọc sách nhóm tuổi này giảm khi nền tảng video ngắn chiếm thời gian chú ý, đe dọa văn hóa đọc và kỹ năng đọc lâu dài; (2) xây thói quen đọc cho khán giả đã sống trên TikTok/YouTube/Instagram cần gặp họ đúng nền tảng đó bằng nội dung định dạng gốc (video ngắn viral, hợp tác KOL) thay vì chỉ dựa vào quảng bá in ấn truyền thống mà nhóm tuổi này phần lớn không còn tiếp xúc.</p>
     <p><strong>3. Ràng buộc dự án:</strong></p>
     <ul><li><b>Phạm vi:</b> 12 video ngắn viral với KOL/influencer trẻ, cuộc thi review sách online, cộng đồng mạng xã hội "Viet Books", và phối hợp 500 trường THPT/đại học lập góc đọc — không thay đổi chương trình học rộng hơn hay hoạt động ngoài 4 luồng công việc này.</li>
     <li><b>Thời gian:</b> chiến dịch 6 tháng.</li>
     <li><b>Chi phí/Ngân sách:</b> tổng 1,8 tỷ VND, từ quỹ sự nghiệp văn hóa nhà nước.</li>
     <li><b>Chất lượng:</b> thành công đo qua tổng lượt xem chuỗi 12 video, số trường tham gia (mục tiêu 500), và tỉ lệ tăng thời gian đọc sách trong nhóm khảo sát.</li></ul>`,
  ),
  rubric: [
    { id: 'project_name', criterion: B('Gives a clear, specific project name.', 'Đặt tên dự án rõ ràng, cụ thể.'), weight: 1, maxScore: 0.3 },
    { id: 'justifications', criterion: B('Explains a coherent purpose and reasons tied to the declining-reading-time trend and reaching youth on their own platforms, not just restating the task.', 'Giải thích lý do mạch lạc, gắn với xu hướng giảm thời gian đọc và tiếp cận giới trẻ trên đúng nền tảng của họ, không chỉ chép lại đề.'), weight: 1, maxScore: 0.7 },
    { id: 'constraints_all4', criterion: B('Covers all 4 constraint dimensions with the specific figures from the scenario (6 months, VND 1.8 billion, 500 schools, 12 videos).', 'Bao quát đủ 4 ràng buộc với đúng số liệu tình huống (6 tháng, 1,8 tỷ VND, 500 trường, 12 video).'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (20%):</strong> define measurable project objectives and related success criteria — list at least two project objectives and explain how each one of those objectives will be measured.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> xác định mục tiêu dự án đo được và tiêu chí thành công liên quan — nêu ít nhất 2 mục tiêu và giải thích cách đo từng mục tiêu.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Objective 1 — Reach at least 5,000,000 combined views across the 12-video series within the 6-month campaign.</strong> Measurement: platform analytics (TikTok/YouTube/Instagram native view counters), aggregated monthly by the content production group; success = combined total ≥ 5,000,000 by campaign end.</p>
     <p><strong>Objective 2 — Onboard at least 500 high schools/universities to set up a reading corner.</strong> Measurement: signed participation confirmations tracked in a registration database by the Authority of Publication; success = 500 confirmed participating schools by campaign end.</p>
     <p><strong>Objective 3 — Raise reading time among the surveyed group by at least 15%.</strong> Measurement: a standardized pre/post survey administered by the executing communication agency at campaign start (baseline) and campaign end; success = the surveyed group's average reading time increases by ≥15% relative to baseline.</p>
     <p><strong>Objective 4 — Achieve at least 10,000 submitted entries in the online book review competition.</strong> Measurement: a submission-tracking log on the competition platform; success = cumulative submissions ≥ 10,000 by the competition's closing date.</p>`,
    `<p><strong>Mục tiêu 1 — Đạt ít nhất 5.000.000 lượt xem cộng dồn qua chuỗi 12 video trong 6 tháng chiến dịch.</strong> Đo: phân tích nền tảng (bộ đếm lượt xem gốc TikTok/YouTube/Instagram), gộp hằng tháng bởi nhóm sản xuất nội dung; thành công = tổng cộng dồn ≥ 5.000.000 vào cuối chiến dịch.</p>
     <p><strong>Mục tiêu 2 — Thu hút ít nhất 500 trường THPT/đại học lập góc đọc sách.</strong> Đo: xác nhận tham gia đã ký theo dõi trong cơ sở dữ liệu đăng ký bởi Cục Xuất bản; thành công = 500 trường xác nhận tham gia vào cuối chiến dịch.</p>
     <p><strong>Mục tiêu 3 — Tăng thời gian đọc sách của nhóm khảo sát ít nhất 15%.</strong> Đo: khảo sát chuẩn hóa trước/sau do agency truyền thông thực thi thực hiện đầu chiến dịch (mức nền) và cuối chiến dịch; thành công = thời gian đọc trung bình nhóm khảo sát tăng ≥15% so mức nền.</p>
     <p><strong>Mục tiêu 4 — Đạt ít nhất 10.000 bài dự thi trong cuộc thi review sách online.</strong> Đo: nhật ký theo dõi bài dự thi trên nền tảng cuộc thi; thành công = tổng bài dự thi cộng dồn ≥ 10.000 tới hạn đóng cuộc thi.</p>`,
  ),
  rubric: [
    { id: 'two_objectives', criterion: B('Provides at least 2 objectives, each specific and directly tied to the scenario\'s stated success indicators.', 'Nêu đủ ít nhất 2 mục tiêu, mỗi cái cụ thể và gắn trực tiếp chỉ số thành công đề nêu.'), weight: 1, maxScore: 0.9 },
    { id: 'measurement_method', criterion: B('Each objective has a genuinely measurable success criterion with a stated measurement method/instrument.', 'Mỗi mục tiêu có tiêu chí thành công đo được thật, kèm phương pháp/công cụ đo cụ thể.'), weight: 1, maxScore: 1.1 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 (30%):</strong> develop a communication plan for the project in which you: (1) define at least three project stakeholders (project-internal, organization-internal, external); (2) create a communication plan for each of those stakeholders and the communications you believe they should receive. Each communication needs to include: information, purpose, frequency, method or format, responsible.</p>`,
    `<p><strong>Yêu cầu 3 (30%):</strong> xây kế hoạch giao tiếp cho dự án: (1) xác định ít nhất 3 bên liên quan (nội bộ dự án, nội bộ tổ chức, bên ngoài); (2) tạo kế hoạch giao tiếp cho từng bên với các mục giao tiếp bạn cho là cần thiết. Mỗi mục giao tiếp gồm: thông tin, mục đích, tần suất, phương thức/định dạng, người phụ trách.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Stakeholder 1 — Content production group (project-internal):</strong></p>
     <ul><li>Information: weekly video-production schedule status and view-count performance of already-published videos. Purpose: keep production on pace for the 12-video release schedule and catch an underperforming video early enough to adjust promotion. Frequency: weekly. Method/format: internal status meeting plus a shared performance dashboard. Responsible: the Project Manager.</li></ul>
     <p><strong>Stakeholder 2 — Ministry of Information and Communications leadership (organization-internal):</strong></p>
     <ul><li>Information: monthly progress report — total views to date, number of schools onboarded, budget spend against the VND 1.8 billion cap. Purpose: keep the ministry informed, since this is a state-funded national campaign drawing on the cultural career fund. Frequency: monthly. Method/format: a written report plus a review meeting. Responsible: the Project Manager.</li></ul>
     <p><strong>Stakeholder 3 — Kim Dong Publishing House (external, strategic partner):</strong></p>
     <ul><li>Information: book-review competition content/branding alignment, and reading-corner book-donation logistics for the 500 participating schools. Purpose: ensure the partner's book content and branding are represented correctly, and coordinate the physical book packages needed for the reading corners. Frequency: at key milestones (competition launch, reading-corner rollout) plus ad hoc as needed. Method/format: email plus partner-coordination meetings. Responsible: the executing communication agency's partnership liaison.</li></ul>`,
    `<p><strong>Bên liên quan 1 — Nhóm sản xuất nội dung (nội bộ dự án):</strong></p>
     <ul><li>Thông tin: tình trạng lịch sản xuất video hằng tuần và hiệu suất lượt xem các video đã phát hành. Mục đích: giữ sản xuất đúng nhịp lịch phát hành 12 video và bắt sớm video hiệu suất kém để điều chỉnh quảng bá. Tần suất: hằng tuần. Phương thức/định dạng: họp trạng thái nội bộ + bảng theo dõi hiệu suất chung. Người phụ trách: Project Manager.</li></ul>
     <p><strong>Bên liên quan 2 — Lãnh đạo Bộ Thông tin và Truyền thông (nội bộ tổ chức):</strong></p>
     <ul><li>Thông tin: báo cáo tiến độ hằng tháng — tổng lượt xem tới hiện tại, số trường đã tham gia, chi tiêu ngân sách so trần 1,8 tỷ VND. Mục đích: giữ Bộ nắm thông tin, vì đây là chiến dịch quốc gia dùng ngân sách nhà nước từ quỹ văn hóa. Tần suất: hằng tháng. Phương thức/định dạng: báo cáo văn bản + họp review. Người phụ trách: Project Manager.</li></ul>
     <p><strong>Bên liên quan 3 — Nhà xuất bản Kim Đồng (bên ngoài, đối tác chiến lược):</strong></p>
     <ul><li>Thông tin: khớp nội dung/thương hiệu cuộc thi review sách, và hậu cần tặng sách cho góc đọc tại 500 trường tham gia. Mục đích: đảm bảo nội dung sách và thương hiệu đối tác được thể hiện đúng, phối hợp gói sách vật lý cần cho góc đọc. Tần suất: tại các mốc chính (khởi động cuộc thi, triển khai góc đọc) cộng thêm khi cần. Phương thức/định dạng: email + họp điều phối đối tác. Người phụ trách: đầu mối đối tác của agency truyền thông thực thi.</li></ul>`,
  ),
  rubric: [
    { id: 'three_stakeholder_types', criterion: B('Correctly identifies exactly the 3 required stakeholder categories: project-internal, organization-internal, external.', 'Xác định đúng đủ 3 loại bên liên quan yêu cầu: nội bộ dự án, nội bộ tổ chức, bên ngoài.'), weight: 1, maxScore: 1 },
    { id: 'complete_comm_fields', criterion: B('Each stakeholder\'s communication plan includes all 5 required fields: information, purpose, frequency, method/format, responsible.', 'Kế hoạch giao tiếp mỗi bên có đủ 5 mục yêu cầu: thông tin, mục đích, tần suất, phương thức/định dạng, người phụ trách.'), weight: 1, maxScore: 1.5 },
    { id: 'context_relevance', criterion: B('Communications are genuinely relevant to this national reading campaign, not generic filler.', 'Nội dung giao tiếp thực sự gắn với chiến dịch đọc sách quốc gia này, không chung chung.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 4 (30%):</strong> provide at least three main project milestones that will be used to mark project progress. Pick the project milestone that you know best, then determine at least ten activities and their sequences with relevant relationships (FS, SS, SF, FF) among them to complete that milestone.</p>`,
    `<p><strong>Yêu cầu 4 (30%):</strong> nêu ít nhất 3 mốc dự án chính dùng để đánh dấu tiến độ. Chọn 1 mốc bạn hiểu rõ nhất, rồi xác định ít nhất 10 hoạt động và trình tự của chúng với quan hệ phù hợp (FS, SS, SF, FF) để hoàn thành mốc đó.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Three main milestones:</strong></p>
     <ol><li>Campaign launch complete — first video published, "Viet Books" community live, book-review competition opened (end of month 1).</li>
     <li>Mid-campaign milestone — 6 of 12 videos published, 250 schools onboarded with reading corners set up (end of month 3).</li>
     <li>Campaign completion (project end) — all 12 videos published, 500 schools onboarded, final survey conducted (end of month 6).</li></ol>
     <p><strong>Selected milestone: "Campaign launch complete."</strong> Activities and sequencing:</p>
     <ol><li>A1 — Finalize the creative concept and script for video 1 with KOL/influencer partners. (start of the chain)</li>
     <li>A2 — Confirm KOL/influencer contracts. Relationship: <b>SS</b> with A1 (contracting can start once the concept is being finalized, in parallel).</li>
     <li>A3 — Produce (film/record) video 1. Relationship: <b>FS</b> after both A1 and A2.</li>
     <li>A4 — Edit and post-produce video 1. Relationship: <b>FS</b> after A3.</li>
     <li>A5 — Set up the "Viet Books" social media community pages (TikTok/YouTube/Instagram/Facebook). Relationship: <b>SS</b> with A4 (a separate workstream, built in parallel with video editing).</li>
     <li>A6 — Publish video 1 across TikTok/YouTube/Instagram. Relationship: <b>FS</b> after both A4 and A5 (needs the edited video AND the community pages to post it to).</li>
     <li>A7 — Design the online book-review competition's rules and submission platform. Relationship: <b>SS</b> with A1 (a separate workstream, running in parallel from the start).</li>
     <li>A8 — Launch the book-review competition. Relationship: <b>FS</b> after A7.</li>
     <li>A9 — Send the reading-corner participation invitation to the first batch of partner high schools/universities. Relationship: <b>SS</b> with A6 (invitations go out around the same time as the first video launch, to ride the campaign's initial momentum).</li>
     <li>A10 — Coordinate with Kim Dong Publishing House to prepare book-donation packages for the reading corners. Relationship: <b>SS</b> with A9 (book preparation runs alongside sending invitations).</li>
     <li>A11 — Confirm the first batch of participating schools and deliver initial reading-corner book packages. Relationship: <b>FS</b> after both A9 and A10.</li>
     <li>A12 — Monitor month-1 view counts, competition submissions, and school sign-ups to confirm launch success. Relationship: <b>FF</b> with A6, A8, and A11 (the launch milestone only finishes once all three tracks — video, competition, and schools — have reported in).</li></ol>
     <p><i>Note: no genuine Start-to-Finish (SF) relationship is used, as none of this workflow's real dependencies are Start-to-Finish in nature — SF is rare in practice, and forcing one in would misrepresent the actual dependency rather than reflect it.</i></p>`,
    `<p><strong>3 mốc dự án chính:</strong></p>
     <ol><li>Khởi động chiến dịch xong — video 1 phát hành, cộng đồng "Viet Books" hoạt động, cuộc thi review sách mở (cuối tháng 1).</li>
     <li>Mốc giữa chiến dịch — 6/12 video phát hành, 250 trường tham gia lập góc đọc (cuối tháng 3).</li>
     <li>Kết thúc chiến dịch (kết thúc dự án) — cả 12 video phát hành, 500 trường tham gia, khảo sát cuối thực hiện (cuối tháng 6).</li></ol>
     <p><strong>Mốc được chọn: "Khởi động chiến dịch xong".</strong> Hoạt động và trình tự:</p>
     <ol><li>A1 — Chốt ý tưởng sáng tạo và kịch bản video 1 với đối tác KOL/influencer. (đầu chuỗi)</li>
     <li>A2 — Xác nhận hợp đồng KOL/influencer. Quan hệ: <b>SS</b> với A1 (ký hợp đồng bắt đầu ngay khi ý tưởng đang chốt, song song).</li>
     <li>A3 — Sản xuất (quay/ghi) video 1. Quan hệ: <b>FS</b> sau cả A1 và A2.</li>
     <li>A4 — Dựng và hậu kỳ video 1. Quan hệ: <b>FS</b> sau A3.</li>
     <li>A5 — Thiết lập trang cộng đồng "Viet Books" trên mạng xã hội (TikTok/YouTube/Instagram/Facebook). Quan hệ: <b>SS</b> với A4 (luồng công việc riêng, dựng song song với dựng video).</li>
     <li>A6 — Phát hành video 1 trên TikTok/YouTube/Instagram. Quan hệ: <b>FS</b> sau cả A4 và A5 (cần video đã dựng VÀ trang cộng đồng để đăng).</li>
     <li>A7 — Thiết kế thể lệ và nền tảng nộp bài cuộc thi review sách online. Quan hệ: <b>SS</b> với A1 (luồng riêng, chạy song song từ đầu).</li>
     <li>A8 — Khởi động cuộc thi review sách. Quan hệ: <b>FS</b> sau A7.</li>
     <li>A9 — Gửi lời mời tham gia góc đọc tới đợt đầu trường THPT/đại học đối tác. Quan hệ: <b>SS</b> với A6 (lời mời gửi cùng lúc khoảng thời gian video 1 phát hành, để tận dụng đà chiến dịch).</li>
     <li>A10 — Phối hợp Nhà xuất bản Kim Đồng chuẩn bị gói sách tặng cho góc đọc. Quan hệ: <b>SS</b> với A9 (chuẩn bị sách chạy song song gửi lời mời).</li>
     <li>A11 — Xác nhận đợt trường tham gia đầu tiên và giao gói sách góc đọc ban đầu. Quan hệ: <b>FS</b> sau cả A9 và A10.</li>
     <li>A12 — Giám sát lượt xem tháng 1, bài dự thi cuộc thi, và số trường đăng ký để xác nhận khởi động thành công. Quan hệ: <b>FF</b> với A6, A8, và A11 (mốc khởi động chỉ xong khi cả 3 luồng — video, cuộc thi, trường — đều báo về).</li></ol>
     <p><i>Lưu ý: không dùng quan hệ Start-to-Finish (SF) thật vì không có phụ thuộc thật nào của quy trình này mang bản chất Start-to-Finish — SF vốn hiếm trong thực tế, ép dùng sẽ phản ánh sai phụ thuộc thay vì đúng.</i></p>`,
  ),
  explanation: B(
    `<p>No source solution existed for this request. Sequencing was reasoned from first principles of a realistic multi-track campaign-launch workflow (video production, competition, school outreach), using FS/SS/FF where each genuinely applies.</p>`,
    `<p>Đề này không có solution nguồn cho yêu cầu này. Trình tự được suy luận từ nguyên lý gốc của quy trình khởi động chiến dịch đa luồng thực tế (sản xuất video, cuộc thi, tiếp cận trường học), dùng FS/SS/FF ở đúng chỗ áp dụng thật.</p>`,
  ),
  rubric: [
    { id: 'three_milestones', criterion: B('Provides at least 3 distinct, meaningful project milestones consistent with the scenario.', 'Nêu ít nhất 3 mốc dự án khác nhau, có ý nghĩa, nhất quán với tình huống đề.'), weight: 1, maxScore: 0.6 },
    { id: 'ten_activities', criterion: B('Determines at least 10 distinct, realistic activities to complete the chosen milestone.', 'Xác định ít nhất 10 hoạt động khác nhau, thực tế để hoàn thành mốc đã chọn.'), weight: 1, maxScore: 1 },
    { id: 'sequencing_relationships', criterion: B('Each activity has a stated, logically correct sequencing relationship (FS/SS/SF/FF) that genuinely reflects real dependency — not force-fit or contradictory.', 'Mỗi hoạt động có quan hệ trình tự (FS/SS/SF/FF) nêu rõ, đúng logic, phản ánh đúng phụ thuộc thật — không gượng ép hay mâu thuẫn.'), weight: 1, maxScore: 1.4 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE22',
    title: 'PMG201c – Practical Exam 1 (Spring 2026), "Read Every Day" National Campaign|||PMG201c – Thi thực hành 1 (Spring 2026), Chiến dịch "Read Every Day"',
    description: 'PMG201c PE (WRITE): project charter, measurable objectives, communication plan, milestone activity sequencing (FS/SS/SF/FF) for a national reading-promotion campaign, AI-graded.|||PE PMG201c (viết): charter dự án, mục tiêu đo được, kế hoạch giao tiếp, trình tự hoạt động theo mốc (FS/SS/SF/FF) cho chiến dịch quốc gia khuyến đọc, chấm AI.',
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
