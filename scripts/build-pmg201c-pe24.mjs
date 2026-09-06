/**
 * build-pmg201c-pe24.mjs — sinh content/exams/PMG201c-PE24.mjs.
 *
 * Nguồn thật: "PMG201c_SU25_Trial" (_tai-lieu/paper.pdf, 2 trang, KHÔNG có
 * ảnh rời nào khác). PDF là ảnh raster (jsPDF, pdftotext trả 0 byte) — đã đọc
 * bằng pdftoppm 400dpi + xem trực tiếp từng vùng crop.
 *
 * ⚠️ ĐÂY LÀ "BÀI THỰC HÀNH" (Trial / practice paper), KHÔNG phải đề thi thật
 * của trường. Đã ghi rõ điều này ở title, description (song ngữ) và ngay dòng
 * đầu instructions để người học không hiểu nhầm. (PE7/PE8 của chính môn này
 * cũng là "Final *Practice* Examination" nên vẫn dựng deck.)
 *
 * Bối cảnh đề: bạn là PM của dự án "vinh danh sinh viên xuất sắc kỳ FA22"
 * cho sinh viên FPTU Đà Nẵng. 5 phần: 1 WBS · 2 Milestone & deliverable ·
 * 3 Network Diagram & estimate · 4 Cost tracking (EVM) · 5 Schedule adjusting.
 * Đề KHÔNG gán điểm cho phần nào → chia câu theo đúng 5 phần đánh số của đề,
 * tự phân bổ điểm theo khối lượng: 2 + 1.5 + 2.5 + 2 + 2 = 10.
 *
 * ══════════════════════════════════════════════════════════════════════
 * ⚠️⚠️ HAI CHỖ THIẾU/MÂU THUẪN TRONG NGUỒN — KHÔNG chép mù, đã nêu rõ
 * trong prompt câu 3 (khối "Editorial note"):
 *
 * (1) Phần 3, bảng activity: hoạt động A có Duration = "–" (BỎ TRỐNG).
 *     Cùng ký hiệu "–" đó được dùng cho hàng End — vốn là mốc thời lượng 0.
 *     ⇒ Đọc A là mốc khởi động thời lượng 0 là cách hiểu TỰ NHẤT QUÁN với
 *     chính bảng, không phải bịa. Và kết quả BỀN với giá trị bị thiếu: đã
 *     kiểm bằng độ nhạy A = 0,1,2,3 → duration vẫn 10 tháng, critical path
 *     vẫn Start→F→H→End; chỉ khi A ≥ 4 mới đổi (A=4 → 11, A=5 → 12).
 *
 * (2) Phần 3: D (sau B) và E (sau C) KHÔNG là predecessor của bất cứ gì, mà
 *     hàng End chỉ ghi predecessor = "H, I". Hai hoạt động treo lơ lửng.
 *     Theo quy ước CPM chuẩn, mọi hoạt động không có successor đều nối về
 *     End (nếu không thì LF của D/E vô định và float không tính được).
 *     Việc này KHÔNG ảnh hưởng critical path (D, E nằm trên nhánh ngắn).
 *
 * (3) Phần 5: sơ đồ mạng là ẢNH. Đã transcribe bằng mắt ở 400dpi:
 *     Start→A(5); A→B(5) và A→C(2); B→D(5); D→E(4) và D→F(1);
 *     C→G(6) và F→G(6); E→End và G→End.
 *     Lớp text ẩn do người biên soạn PDF chèn lại mô tả "từ B có nhánh → C"
 *     — MÂU THUẪN với ảnh (mũi tên đi C xuất phát đúng ở cạnh phải của A,
 *     cùng điểm gốc với mũi tên đi B). Tin ẢNH. Đã kiểm: cả hai cách đọc
 *     đều cho critical path Start→A→B→D→F→G→End và duration 22 tuần
 *     (chỉ float của C đổi 9 ↔ 4) ⇒ mâu thuẫn này VÔ HẠI với đáp án.
 * ══════════════════════════════════════════════════════════════════════
 *
 * ✅ CPM/EVM ĐÃ TỰ TÍNH TAY ĐỘC LẬP (full forward + backward pass), rồi
 * đối chiếu lại bằng script CPM tự viết — khớp 100%:
 *   • Phần 3: duration 10 tháng, critical path Start→F→H→End (float 0 chỉ ở
 *     F và H). 6 đường: F-H=10, G-I=8, A-B-H=7, A-C-I=6, A-B-D=4, A-C-E=4.
 *   • Phần 4: PV=2.000$, EV=2.000$, AC=2.500$, SV=0, CV=−500$, SPI=1,00,
 *     CPI=0,80, EAC=12.500$, ETC=10.000$, VAC=−2.500$, EDAC=10 tuần
 *     ⇒ ĐÚNG tiến độ nhưng VƯỢT ngân sách.
 *   • Phần 5: duration 22 tuần, critical path Start→A→B→D→F→G→End;
 *     float: E=3, C=9, còn lại 0. Đường A-B-D-E dài 19 tuần — đúng bằng mục
 *     tiêu sau khi rút 3 tuần, nên nó thành đường găng thứ hai (chi tiết này
 *     nằm trong sampleSolution câu 5).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE24.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE24.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>PMG201c – Practice Paper (SU25 Trial) — "FA22 Outstanding Student Awards", FPTU Da Nang</strong>.</p>
   <p><strong>⚠️ This is a PRACTICE / TRIAL paper, not a real school exam.</strong> The source document is titled "Bài thực hành PMG201c" (PMG201c practice assignment). Use it to rehearse the PE format; do not treat its wording or weighting as an official past paper.</p>
   <p>This is a written project-management practical exam — 5 parts, matching the 5 numbered sections of the source. There is no code to write; each answer is graded by an AI grader against the rubric shown per question. The source assigns no marks per part, so the point split (2 + 1.5 + 2.5 + 2 + 2 = 10) is this deck's own, based on workload.</p>
   <p><strong>Context.</strong> You are the project manager of the project "FA22 outstanding student awards ceremony" for FPTU Da Nang students.</p>
   <p><strong>Note on gaps in the source:</strong> the activity table in Part 3 leaves activity A's duration blank and leaves activities D and E without a successor, and the Part 5 network diagram exists only as a picture. Each question states exactly how those gaps are read — read those notes before answering.</p>`,
  `<p><strong>PMG201c – Bài thực hành (SU25 Trial) — "Vinh danh sinh viên xuất sắc kỳ FA22", FPTU Đà Nẵng</strong>.</p>
   <p><strong>⚠️ Đây là BÀI THỰC HÀNH/ĐỀ THỬ, KHÔNG phải đề thi thật của trường.</strong> Tài liệu nguồn có tiêu đề "Bài thực hành PMG201c". Hãy dùng nó để luyện đúng định dạng PE; đừng coi câu chữ hay thang điểm của nó là đề thi chính thức.</p>
   <p>Đây là bài thi thực hành quản lý dự án dạng viết — 5 phần, khớp đúng 5 mục đánh số của đề gốc. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu. Đề gốc KHÔNG gán điểm cho từng phần, nên cách chia điểm (2 + 1,5 + 2,5 + 2 + 2 = 10) là của deck này, phân bổ theo khối lượng công việc.</p>
   <p><strong>Ngữ cảnh.</strong> Bạn đang giữ vai trò quản lý của dự án "vinh danh sinh viên xuất sắc kỳ FA22" dành cho sinh viên FPTU Đà Nẵng.</p>
   <p><strong>Lưu ý về chỗ thiếu trong đề gốc:</strong> bảng hoạt động ở Phần 3 bỏ trống thời lượng của A và để D, E không có hoạt động kế tiếp; sơ đồ mạng ở Phần 5 chỉ tồn tại dưới dạng ảnh. Mỗi câu đều ghi rõ cách đọc những chỗ đó — hãy đọc trước khi làm.</p>`,
);

/* ── Part 3: bảng activity, giữ NGUYÊN như đề (kể cả ô trống của A) ── */
const actTableEn = `<table><tr><th>Activity</th><th>Predecessor</th><th>Duration (month)</th></tr>
<tr><td>A</td><td>Start</td><td>– (blank in the source)</td></tr>
<tr><td>B</td><td>A</td><td>2</td></tr>
<tr><td>C</td><td>A</td><td>1</td></tr>
<tr><td>D</td><td>B</td><td>2</td></tr>
<tr><td>E</td><td>C</td><td>3</td></tr>
<tr><td>F</td><td>Start</td><td>5</td></tr>
<tr><td>G</td><td>Start</td><td>3</td></tr>
<tr><td>H</td><td>B, F</td><td>5</td></tr>
<tr><td>I</td><td>C, G</td><td>5</td></tr>
<tr><td>End</td><td>H, I</td><td>–</td></tr></table>`;
const actTableVi = `<table><tr><th>Hoạt động</th><th>Hoạt động trước</th><th>Thời lượng (tháng)</th></tr>
<tr><td>A</td><td>Start</td><td>– (đề bỏ trống)</td></tr>
<tr><td>B</td><td>A</td><td>2</td></tr>
<tr><td>C</td><td>A</td><td>1</td></tr>
<tr><td>D</td><td>B</td><td>2</td></tr>
<tr><td>E</td><td>C</td><td>3</td></tr>
<tr><td>F</td><td>Start</td><td>5</td></tr>
<tr><td>G</td><td>Start</td><td>3</td></tr>
<tr><td>H</td><td>B, F</td><td>5</td></tr>
<tr><td>I</td><td>C, G</td><td>5</td></tr>
<tr><td>End</td><td>H, I</td><td>–</td></tr></table>`;

/* ── Part 5: sơ đồ mạng (đề vẽ bằng ảnh) — transcribe thành bảng ── */
const netTableEn = `<table><tr><th>Activity</th><th>Predecessor</th><th>Duration (weeks)</th></tr>
<tr><td>A</td><td>Start</td><td>5</td></tr>
<tr><td>B</td><td>A</td><td>5</td></tr>
<tr><td>C</td><td>A</td><td>2</td></tr>
<tr><td>D</td><td>B</td><td>5</td></tr>
<tr><td>E</td><td>D</td><td>4</td></tr>
<tr><td>F</td><td>D</td><td>1</td></tr>
<tr><td>G</td><td>C, F</td><td>6</td></tr>
<tr><td>End</td><td>E, G</td><td>–</td></tr></table>`;
const netTableVi = `<table><tr><th>Hoạt động</th><th>Hoạt động trước</th><th>Thời lượng (tuần)</th></tr>
<tr><td>A</td><td>Start</td><td>5</td></tr>
<tr><td>B</td><td>A</td><td>5</td></tr>
<tr><td>C</td><td>A</td><td>2</td></tr>
<tr><td>D</td><td>B</td><td>5</td></tr>
<tr><td>E</td><td>D</td><td>4</td></tr>
<tr><td>F</td><td>D</td><td>1</td></tr>
<tr><td>G</td><td>C, F</td><td>6</td></tr>
<tr><td>End</td><td>E, G</td><td>–</td></tr></table>`;

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Part 1 – WBS:</strong> using your knowledge of the project life cycle, build a Work Breakdown Structure for the work of this programme (the FA22 outstanding student awards ceremony for FPTU Da Nang students).</p>
     <p>You may also state some assumptions about a reasonable duration / budget for the programme.</p>
     <p><em>Hint from the paper: Initiation, Planning, Implementation (Executing, monitoring &amp; controlling), Closing.</em></p>`,
    `<p><strong>Phần 1 – WBS:</strong> vận dụng kiến thức về quy trình triển khai dự án, hãy xây dựng WBS cho các công việc của chương trình này (lễ vinh danh sinh viên xuất sắc kỳ FA22 dành cho sinh viên FPTU Đà Nẵng).</p>
     <p>Bạn có thể nêu một số giả định về thời gian thực hiện / ngân sách hợp lý cho chương trình.</p>
     <p><em>Gợi ý của đề: Initiation, Planning, Implementation (Executing, monitoring &amp; controlling), Closing.</em></p>`,
  ),
  sampleSolution: B(
    `<p><strong>Assumptions:</strong> the ceremony runs on one evening at the FPTU Da Nang campus hall for about 300 guests (award-winning students, families, lecturers, sponsors). Preparation duration: 10 weeks from kick-off to closing. Budget: 120,000,000 VND (venue and stage 35M, awards and certificates 25M, catering 30M, media and communications 15M, contingency 15M).</p>
     <p><strong>1. FA22 Outstanding Student Awards Ceremony</strong></p>
     <p><strong>1.1 Initiation</strong></p>
     <ul><li>1.1.1 Collect the requirement from the Student Affairs Department (purpose, scale, expected date).</li>
     <li>1.1.2 Identify stakeholders (BOD, Student Affairs, lecturers, awarded students, families, sponsors, media club).</li>
     <li>1.1.3 Draft and approve the project charter (objectives, budget ceiling, PM authority).</li>
     <li>1.1.4 Form the organising team and assign roles.</li></ul>
     <p><strong>1.2 Planning</strong></p>
     <ul><li>1.2.1 Define the award criteria and confirm the final list of honoured students with the Academic Department.</li>
     <li>1.2.2 Plan scope and build the WBS; plan the schedule (network diagram, critical path).</li>
     <li>1.2.3 Plan the budget and the procurement list (venue, sound and light, printing, catering, gifts).</li>
     <li>1.2.4 Plan communications (invitations, campus posters, fanpage, press) and the risk register (weather, no-show speaker, equipment failure).</li>
     <li>1.2.5 Design the run-of-show script and the MC script; plan the rehearsal.</li></ul>
     <p><strong>1.3 Implementation (Executing + Monitoring &amp; Controlling)</strong></p>
     <ul><li>1.3.1 Book the hall, sign contracts with the sound/light and catering vendors.</li>
     <li>1.3.2 Produce the awards: certificates, medals/trophies, souvenir gifts; proofread every student name.</li>
     <li>1.3.3 Produce media: invitation cards, backdrop, LED slideshow, highlight video of the honoured students.</li>
     <li>1.3.4 Send invitations and confirm attendance (students, families, guests of honour).</li>
     <li>1.3.5 Set up the venue, technical rehearsal, full dress rehearsal.</li>
     <li>1.3.6 Run the ceremony on the day: reception and check-in, opening, BOD speech, award presentation, performances, closing.</li>
     <li>1.3.7 Monitoring &amp; controlling: weekly progress meetings, budget tracking against plan, issue log, change requests.</li></ul>
     <p><strong>1.4 Closing</strong></p>
     <ul><li>1.4.1 Dismantle the venue and return borrowed equipment.</li>
     <li>1.4.2 Settle payments with all vendors and close the budget report.</li>
     <li>1.4.3 Collect feedback from attendees and sponsors; publish the post-event article and photo album.</li>
     <li>1.4.4 Write the lessons-learned report and archive project documents; formally close the project.</li></ul>`,
    `<p><strong>Giả định:</strong> buổi lễ diễn ra trong một tối tại hội trường cơ sở FPTU Đà Nẵng, khoảng 300 khách (sinh viên được vinh danh, phụ huynh, giảng viên, nhà tài trợ). Thời gian chuẩn bị: 10 tuần từ khởi động tới kết thúc. Ngân sách: 120.000.000 VNĐ (địa điểm và sân khấu 35tr, kỷ niệm chương và giấy chứng nhận 25tr, tiệc nhẹ 30tr, truyền thông 15tr, dự phòng 15tr).</p>
     <p><strong>1. Lễ vinh danh sinh viên xuất sắc kỳ FA22</strong></p>
     <p><strong>1.1 Khởi động (Initiation)</strong></p>
     <ul><li>1.1.1 Tiếp nhận yêu cầu từ Phòng Công tác sinh viên (mục đích, quy mô, ngày dự kiến).</li>
     <li>1.1.2 Xác định các bên liên quan (Ban giám hiệu, Phòng CTSV, giảng viên, sinh viên được vinh danh, phụ huynh, nhà tài trợ, CLB truyền thông).</li>
     <li>1.1.3 Soạn và phê duyệt project charter (mục tiêu, trần ngân sách, thẩm quyền của PM).</li>
     <li>1.1.4 Lập ban tổ chức và phân vai.</li></ul>
     <p><strong>1.2 Lập kế hoạch (Planning)</strong></p>
     <ul><li>1.2.1 Xác định tiêu chí vinh danh và chốt danh sách sinh viên cùng Phòng Đào tạo.</li>
     <li>1.2.2 Lập kế hoạch phạm vi và WBS; lập kế hoạch tiến độ (sơ đồ mạng, đường găng).</li>
     <li>1.2.3 Lập kế hoạch ngân sách và danh mục mua sắm (hội trường, âm thanh ánh sáng, in ấn, tiệc nhẹ, quà tặng).</li>
     <li>1.2.4 Lập kế hoạch truyền thông (thư mời, poster trong trường, fanpage, báo chí) và sổ rủi ro (thời tiết, khách mời vắng, hỏng thiết bị).</li>
     <li>1.2.5 Thiết kế kịch bản chương trình và kịch bản MC; lên kế hoạch tổng duyệt.</li></ul>
     <p><strong>1.3 Triển khai (Thực thi + Giám sát &amp; Kiểm soát)</strong></p>
     <ul><li>1.3.1 Đặt hội trường, ký hợp đồng với nhà cung cấp âm thanh ánh sáng và tiệc nhẹ.</li>
     <li>1.3.2 Sản xuất phần thưởng: giấy chứng nhận, kỷ niệm chương/cúp, quà lưu niệm; soát kỹ tên từng sinh viên.</li>
     <li>1.3.3 Sản xuất ấn phẩm truyền thông: thư mời, backdrop, slide LED, video highlight về sinh viên được vinh danh.</li>
     <li>1.3.4 Gửi thư mời và xác nhận tham dự (sinh viên, phụ huynh, khách mời danh dự).</li>
     <li>1.3.5 Setup hội trường, chạy kỹ thuật, tổng duyệt.</li>
     <li>1.3.6 Vận hành buổi lễ: đón khách và check-in, khai mạc, phát biểu của Ban giám hiệu, trao thưởng, tiết mục văn nghệ, bế mạc.</li>
     <li>1.3.7 Giám sát &amp; kiểm soát: họp tiến độ hàng tuần, theo dõi chi phí so kế hoạch, sổ vấn đề, yêu cầu thay đổi.</li></ul>
     <p><strong>1.4 Kết thúc (Closing)</strong></p>
     <ul><li>1.4.1 Tháo dỡ hội trường và trả thiết bị mượn.</li>
     <li>1.4.2 Thanh quyết toán với toàn bộ nhà cung cấp và chốt báo cáo ngân sách.</li>
     <li>1.4.3 Thu thập phản hồi của người tham dự và nhà tài trợ; đăng bài tổng kết và album ảnh.</li>
     <li>1.4.4 Viết báo cáo bài học kinh nghiệm, lưu trữ hồ sơ dự án; đóng dự án chính thức.</li></ul>`,
  ),
  rubric: [
    { id: 'four_phases', criterion: B('Uses the 4 top-level phases suggested by the paper (Initiation, Planning, Implementation/Executing + M&C, Closing) as the level-1 breakdown.', 'Dùng đúng 4 giai đoạn cấp cao mà đề gợi ý (Initiation, Planning, Implementation/Executing + Giám sát & Kiểm soát, Closing) làm phân rã cấp 1.'), weight: 1, maxScore: 0.5 },
    { id: 'decomposition', criterion: B('Each phase is decomposed into concrete work packages (at least 3 per phase), not one-line placeholders.', 'Mỗi giai đoạn được phân rã thành các gói công việc cụ thể (ít nhất 3 gói/giai đoạn), không phải một dòng chung chung.'), weight: 1, maxScore: 0.6 },
    { id: 'context_specific', criterion: B('Work packages are specific to an award/honouring ceremony for FPTU Da Nang students (venue, award list, certificates, invitations, rehearsal...), not a generic template that would fit any project.', 'Các gói công việc gắn đúng bối cảnh lễ vinh danh sinh viên FPTU Đà Nẵng (hội trường, danh sách vinh danh, giấy chứng nhận, thư mời, tổng duyệt...), không phải khuôn mẫu chung áp cho dự án nào cũng được.'), weight: 1, maxScore: 0.6 },
    { id: 'assumptions', criterion: B('States explicit assumptions about the programme duration and budget, with plausible figures.', 'Nêu rõ giả định về thời gian thực hiện và ngân sách của chương trình, kèm con số hợp lý.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 2 – Milestone &amp; deliverable:</strong> identify the milestones of the project you built in Part 1. For each milestone, write a corresponding SMART description, and identify the deliverables of that milestone.</p>
     <p><em>The paper asks for this format:</em></p>
     <table><tr><th>Milestone</th><th>Description</th><th>Deliverable</th></tr></table>`,
    `<p><strong>Phần 2 – Milestone &amp; deliverable:</strong> hãy xác định các milestone của dự án ở câu #1. Với mỗi milestone, viết một mô tả SMART tương ứng, và xác định các deliverable tương ứng của từng milestone đó.</p>
     <p><em>Đề yêu cầu viết theo định dạng sau:</em></p>
     <table><tr><th>Milestone</th><th>Description</th><th>Deliverable</th></tr></table>`,
  ),
  sampleSolution: B(
    `<table><tr><th>Milestone</th><th>SMART description</th><th>Deliverable</th></tr>
     <tr><td>M1 – Project charter approved (end of week 1)</td><td>By the end of week 1, the project charter for the FA22 awards ceremony is signed by the Head of Student Affairs, stating the objective, the 120,000,000 VND budget ceiling and the event date; measured by 1 signed document.</td><td>Signed project charter; organising team list with assigned roles.</td></tr>
     <tr><td>M2 – Honoured student list finalised (end of week 3)</td><td>By the end of week 3, 100% of the honoured students for FA22 are confirmed in writing by the Academic Department, with GPA and name spelling verified; measured by a locked list with zero pending cases.</td><td>Final honoured-student list; award criteria document.</td></tr>
     <tr><td>M3 – Plans and budget baselined (end of week 4)</td><td>By the end of week 4, the scope, schedule, budget and communication plans are approved by the sponsor, with the total planned cost within the 120,000,000 VND ceiling; measured by 4 approved plan documents.</td><td>WBS; schedule with critical path; approved budget; communication plan; risk register.</td></tr>
     <tr><td>M4 – Contracts signed and production started (end of week 6)</td><td>By the end of week 6, contracts with the venue, sound/light and catering vendors are signed and the certificate and trophy production order is placed; measured by 3 signed contracts and 1 purchase order.</td><td>Vendor contracts; purchase order; production schedule.</td></tr>
     <tr><td>M5 – Awards and media assets ready (end of week 8)</td><td>By the end of week 8, 100% of the certificates, trophies and media assets (backdrop, LED slideshow, highlight video) are delivered and proofread with zero misspelled student names; measured by a QC checklist signed off.</td><td>Printed certificates and trophies; backdrop; slideshow; highlight video; signed QC checklist.</td></tr>
     <tr><td>M6 – Dress rehearsal passed (1 day before the event)</td><td>One day before the ceremony, the full dress rehearsal runs end to end within the planned 90-minute run time with all technical issues closed; measured by a rehearsal report with zero open critical issues.</td><td>Rehearsal report; final run-of-show script; venue set-up completed.</td></tr>
     <tr><td>M7 – Ceremony delivered (event day, end of week 9)</td><td>On the event day, the ceremony is delivered to at least 250 attendees with 100% of the honoured students receiving their award on stage; measured by the check-in count and the award handover list.</td><td>Completed ceremony; attendance record; event photos and video.</td></tr>
     <tr><td>M8 – Project closed (end of week 10)</td><td>By the end of week 10, all vendor payments are settled, the final budget report is approved, and the lessons-learned report is archived; measured by zero outstanding invoices and 1 approved closing report.</td><td>Final budget report; feedback summary; lessons-learned report; archived project file.</td></tr></table>
     <p>Each milestone is a zero-duration checkpoint (a decision or an acceptance), not a stretch of work — that is what distinguishes it from the WBS activities in Part 1.</p>`,
    `<table><tr><th>Milestone</th><th>Mô tả SMART</th><th>Deliverable</th></tr>
     <tr><td>M1 – Phê duyệt project charter (cuối tuần 1)</td><td>Đến cuối tuần 1, project charter của lễ vinh danh FA22 được Trưởng phòng CTSV ký, nêu rõ mục tiêu, trần ngân sách 120.000.000 VNĐ và ngày tổ chức; đo bằng 1 văn bản đã ký.</td><td>Project charter đã ký; danh sách ban tổ chức kèm phân vai.</td></tr>
     <tr><td>M2 – Chốt danh sách sinh viên vinh danh (cuối tuần 3)</td><td>Đến cuối tuần 3, 100% sinh viên được vinh danh kỳ FA22 được Phòng Đào tạo xác nhận bằng văn bản, đã soát GPA và chính tả tên; đo bằng danh sách đã khoá, không còn trường hợp treo.</td><td>Danh sách vinh danh cuối cùng; văn bản tiêu chí vinh danh.</td></tr>
     <tr><td>M3 – Chốt baseline kế hoạch và ngân sách (cuối tuần 4)</td><td>Đến cuối tuần 4, kế hoạch phạm vi, tiến độ, ngân sách và truyền thông được nhà tài trợ duyệt, tổng chi phí kế hoạch nằm trong trần 120.000.000 VNĐ; đo bằng 4 văn bản kế hoạch đã duyệt.</td><td>WBS; lịch trình kèm đường găng; ngân sách được duyệt; kế hoạch truyền thông; sổ rủi ro.</td></tr>
     <tr><td>M4 – Ký hợp đồng và bắt đầu sản xuất (cuối tuần 6)</td><td>Đến cuối tuần 6, hợp đồng với hội trường, nhà cung cấp âm thanh ánh sáng và tiệc nhẹ đã ký, đơn đặt sản xuất giấy chứng nhận và kỷ niệm chương đã phát hành; đo bằng 3 hợp đồng đã ký và 1 đơn đặt hàng.</td><td>Hợp đồng nhà cung cấp; đơn đặt hàng; lịch sản xuất.</td></tr>
     <tr><td>M5 – Sẵn sàng phần thưởng và ấn phẩm (cuối tuần 8)</td><td>Đến cuối tuần 8, 100% giấy chứng nhận, kỷ niệm chương và ấn phẩm truyền thông (backdrop, slide LED, video highlight) đã bàn giao và soát lỗi, không sai chính tả tên sinh viên nào; đo bằng checklist QC đã ký duyệt.</td><td>Giấy chứng nhận và kỷ niệm chương đã in; backdrop; slide; video highlight; checklist QC đã ký.</td></tr>
     <tr><td>M6 – Tổng duyệt đạt (trước ngày lễ 1 ngày)</td><td>Trước buổi lễ 1 ngày, buổi tổng duyệt chạy trọn vẹn trong đúng 90 phút kế hoạch và mọi vấn đề kỹ thuật đã đóng; đo bằng biên bản tổng duyệt không còn vấn đề nghiêm trọng nào mở.</td><td>Biên bản tổng duyệt; kịch bản chương trình bản cuối; hội trường đã setup xong.</td></tr>
     <tr><td>M7 – Tổ chức xong buổi lễ (ngày sự kiện, cuối tuần 9)</td><td>Trong ngày sự kiện, buổi lễ được tổ chức cho ít nhất 250 người tham dự, 100% sinh viên được vinh danh nhận thưởng trên sân khấu; đo bằng số liệu check-in và biên bản trao thưởng.</td><td>Buổi lễ đã hoàn thành; bảng ghi nhận tham dự; ảnh và video sự kiện.</td></tr>
     <tr><td>M8 – Đóng dự án (cuối tuần 10)</td><td>Đến cuối tuần 10, toàn bộ khoản thanh toán cho nhà cung cấp đã tất toán, báo cáo ngân sách cuối được duyệt, báo cáo bài học kinh nghiệm đã lưu trữ; đo bằng không còn hoá đơn treo và 1 báo cáo đóng dự án được duyệt.</td><td>Báo cáo ngân sách cuối; tổng hợp phản hồi; báo cáo bài học kinh nghiệm; hồ sơ dự án đã lưu trữ.</td></tr></table>
     <p>Mỗi milestone là một điểm kiểm soát thời lượng bằng 0 (một quyết định hoặc một lần nghiệm thu), không phải một khoảng công việc — đây chính là điểm phân biệt nó với các hoạt động trong WBS ở Phần 1.</p>`,
  ),
  rubric: [
    { id: 'milestones_from_wbs', criterion: B('Identifies at least 5 milestones that clearly map onto the WBS built in Part 1 (consistent with that answer), each a zero-duration checkpoint rather than a stretch of work.', 'Xác định ít nhất 5 milestone gắn rõ với WBS đã xây ở Phần 1 (nhất quán với câu trả lời đó), mỗi milestone là điểm kiểm soát thời lượng 0 chứ không phải một khoảng công việc.'), weight: 1, maxScore: 0.5 },
    { id: 'smart', criterion: B('Each milestone description is genuinely SMART: specific, with a measurable criterion, achievable, relevant, and time-bound to a stated date/week.', 'Mỗi mô tả milestone thực sự SMART: cụ thể, có tiêu chí đo được, khả thi, liên quan, và gắn mốc thời gian rõ ràng.'), weight: 1, maxScore: 0.6 },
    { id: 'deliverables', criterion: B('Names the concrete deliverable(s) produced at each milestone, in the Milestone/Description/Deliverable format the paper asks for.', 'Nêu deliverable cụ thể của từng milestone, trình bày theo đúng định dạng Milestone/Description/Deliverable mà đề yêu cầu.'), weight: 1, maxScore: 0.4 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 2.5,
  prompt: B(
    `<p><strong>Part 3 – Network Diagram &amp; estimate:</strong> draw the full network diagram with ES, EF, LS, LF and Float, and identify the critical path of the project with the following activities:</p>${actTableEn}
     <p><strong>Editorial note on two gaps in the source paper</strong> (answer using these readings, and say in your answer that you are using them):</p>
     <ul><li><b>Activity A has no duration in the source</b> — the cell shows the same "–" marker the End milestone uses, so read A as a zero-duration kick-off milestone (duration 0). The answer is robust to this: any value of A from 0 to 3 gives the same critical path and the same 10-month duration.</li>
     <li><b>D and E are not listed as the predecessor of anything</b>, and the End row names only H and I. By the standard CPM convention, every activity with no successor feeds End — otherwise D and E would have no late finish and no float at all. Treat End as being preceded by H, I, D and E.</li></ul>`,
    `<p><strong>Phần 3 – Network Diagram &amp; estimate:</strong> hãy vẽ network diagram đầy đủ ES, EF, LS, LF, Float, và xác định critical path cho dự án với các hoạt động như sau:</p>${actTableVi}
     <p><strong>Ghi chú biên tập về hai chỗ thiếu trong đề gốc</strong> (hãy làm bài theo hai cách đọc này, và ghi rõ trong bài là bạn đang dùng chúng):</p>
     <ul><li><b>Hoạt động A không có thời lượng trong đề</b> — ô đó ghi đúng dấu "–" mà mốc End cũng dùng, nên hiểu A là mốc khởi động thời lượng 0. Đáp án BỀN với chỗ thiếu này: A nhận bất kỳ giá trị nào từ 0 đến 3 đều cho cùng một đường găng và cùng thời lượng 10 tháng.</li>
     <li><b>D và E không được liệt kê là hoạt động trước của bất cứ gì</b>, còn hàng End chỉ ghi H và I. Theo quy ước CPM chuẩn, mọi hoạt động không có hoạt động kế tiếp đều nối về End — nếu không, D và E sẽ không có late finish và không tính được float. Hãy coi End có các hoạt động trước là H, I, D và E.</li></ul>`,
  ),
  sampleSolution: B(
    `<p><strong>Reading used:</strong> A = 0 (kick-off milestone, "–" in the source); End is preceded by H, I, D and E.</p>
     <p><strong>All paths from Start to End:</strong></p>
     <ul><li>Start→F→H→End: 5+5 = <b>10 months</b> (longest)</li>
     <li>Start→G→I→End: 3+5 = 8 months</li>
     <li>Start→A→B→H→End: 0+2+5 = 7 months</li>
     <li>Start→A→C→I→End: 0+1+5 = 6 months</li>
     <li>Start→A→B→D→End: 0+2+2 = 4 months</li>
     <li>Start→A→C→E→End: 0+1+3 = 4 months</li></ul>
     <p><strong>Critical path:</strong> Start→F→H→End. <strong>Project duration:</strong> 10 months.</p>
     <p><strong>Forward pass then backward pass from LF(End) = 10:</strong></p>
     <table><tr><th>Activity</th><th>Duration</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>Start</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
     <tr><td>A</td><td>0</td><td>0</td><td>0</td><td>3</td><td>3</td><td>3</td></tr>
     <tr><td>B</td><td>2</td><td>0</td><td>2</td><td>3</td><td>5</td><td>3</td></tr>
     <tr><td>C</td><td>1</td><td>0</td><td>1</td><td>4</td><td>5</td><td>4</td></tr>
     <tr><td>D</td><td>2</td><td>2</td><td>4</td><td>8</td><td>10</td><td>6</td></tr>
     <tr><td>E</td><td>3</td><td>1</td><td>4</td><td>7</td><td>10</td><td>6</td></tr>
     <tr><td>F</td><td>5</td><td>0</td><td>5</td><td>0</td><td>5</td><td><b>0 (critical)</b></td></tr>
     <tr><td>G</td><td>3</td><td>0</td><td>3</td><td>2</td><td>5</td><td>2</td></tr>
     <tr><td>H</td><td>5</td><td>5</td><td>10</td><td>5</td><td>10</td><td><b>0 (critical)</b></td></tr>
     <tr><td>I</td><td>5</td><td>3</td><td>8</td><td>5</td><td>10</td><td>2</td></tr>
     <tr><td>End</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>0</td></tr></table>
     <p><strong>Reading the numbers.</strong> Only F and H have zero float, so the critical path is Start→F→H→End and the project takes 10 months. H starts at month 5 because it must wait for both B (finishes at 2) and F (finishes at 5) — F is the binding predecessor. I starts at month 3, waiting for G rather than C. The A branch is the slackest part of the network: A, B and C can all slip several months without moving the finish date, and D and E have the largest float (6 months each) because they only have to be done by the project end.</p>`,
    `<p><strong>Cách đọc đã dùng:</strong> A = 0 (mốc khởi động, đề ghi "–"); End có các hoạt động trước là H, I, D và E.</p>
     <p><strong>Tất cả các đường từ Start tới End:</strong></p>
     <ul><li>Start→F→H→End: 5+5 = <b>10 tháng</b> (dài nhất)</li>
     <li>Start→G→I→End: 3+5 = 8 tháng</li>
     <li>Start→A→B→H→End: 0+2+5 = 7 tháng</li>
     <li>Start→A→C→I→End: 0+1+5 = 6 tháng</li>
     <li>Start→A→B→D→End: 0+2+2 = 4 tháng</li>
     <li>Start→A→C→E→End: 0+1+3 = 4 tháng</li></ul>
     <p><strong>Đường găng:</strong> Start→F→H→End. <strong>Thời lượng dự án:</strong> 10 tháng.</p>
     <p><strong>Tính xuôi rồi tính ngược từ LF(End) = 10:</strong></p>
     <table><tr><th>Hoạt động</th><th>Thời lượng</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>Start</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
     <tr><td>A</td><td>0</td><td>0</td><td>0</td><td>3</td><td>3</td><td>3</td></tr>
     <tr><td>B</td><td>2</td><td>0</td><td>2</td><td>3</td><td>5</td><td>3</td></tr>
     <tr><td>C</td><td>1</td><td>0</td><td>1</td><td>4</td><td>5</td><td>4</td></tr>
     <tr><td>D</td><td>2</td><td>2</td><td>4</td><td>8</td><td>10</td><td>6</td></tr>
     <tr><td>E</td><td>3</td><td>1</td><td>4</td><td>7</td><td>10</td><td>6</td></tr>
     <tr><td>F</td><td>5</td><td>0</td><td>5</td><td>0</td><td>5</td><td><b>0 (găng)</b></td></tr>
     <tr><td>G</td><td>3</td><td>0</td><td>3</td><td>2</td><td>5</td><td>2</td></tr>
     <tr><td>H</td><td>5</td><td>5</td><td>10</td><td>5</td><td>10</td><td><b>0 (găng)</b></td></tr>
     <tr><td>I</td><td>5</td><td>3</td><td>8</td><td>5</td><td>10</td><td>2</td></tr>
     <tr><td>End</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>0</td></tr></table>
     <p><strong>Đọc các con số.</strong> Chỉ F và H có float bằng 0, nên đường găng là Start→F→H→End và dự án mất 10 tháng. H bắt đầu ở tháng 5 vì phải chờ cả B (xong ở tháng 2) lẫn F (xong ở tháng 5) — F mới là hoạt động trước quyết định. I bắt đầu ở tháng 3, chờ G chứ không phải C. Nhánh A là phần dư dả nhất của mạng: A, B, C đều có thể trễ vài tháng mà không dời ngày kết thúc, còn D và E có float lớn nhất (6 tháng mỗi hoạt động) vì chúng chỉ cần xong trước khi dự án kết thúc.</p>`,
  ),
  explanation: B(
    `<p><b>Computed independently by hand</b> (full forward + backward CPM pass from the precedence table), then re-checked with an independently written CPM script — both agree: duration 10 months, critical path Start→F→H→End, floats as tabulated.</p>
     <p><b>Sensitivity to the missing duration of A:</b> re-running the network with A = 0, 1, 2 and 3 all give 10 months with the same critical path; only A = 4 (11 months) or A = 5 (12 months) would change the answer. So the blank cell in the source does not put this answer at risk.</p>
     <p><b>Note on the dangling activities:</b> if you follow the End row literally (End preceded by H and I only), D and E would have no late-finish constraint and their float would be undefined; the critical path and the 10-month duration are unchanged either way.</p>`,
    `<p><b>Đã tự tính tay độc lập</b> (đầy đủ 2 lượt CPM xuôi + ngược từ bảng precedence), rồi kiểm lại bằng một script CPM tự viết — hai kết quả khớp nhau: 10 tháng, đường găng Start→F→H→End, float đúng như bảng.</p>
     <p><b>Độ nhạy với thời lượng bị thiếu của A:</b> chạy lại mạng với A = 0, 1, 2 và 3 đều ra 10 tháng và cùng một đường găng; chỉ A = 4 (11 tháng) hay A = 5 (12 tháng) mới đổi đáp án. Vậy ô trống trong đề gốc không làm hỏng đáp án này.</p>
     <p><b>Về hai hoạt động treo:</b> nếu theo đúng chữ của hàng End (chỉ H và I), D và E sẽ không có ràng buộc late finish và float của chúng vô định; đường găng và thời lượng 10 tháng thì không đổi ở cả hai cách hiểu.</p>`,
  ),
  rubric: [
    { id: 'forward_pass', criterion: B('Correctly computes ES and EF for every activity (forward pass), including that H waits for F at month 5 and I waits for G at month 3.', 'Tính đúng ES và EF cho mọi hoạt động (lượt xuôi), gồm việc H phải chờ F tới tháng 5 và I phải chờ G tới tháng 3.'), weight: 1, maxScore: 0.7 },
    { id: 'backward_pass', criterion: B('Correctly computes LS and LF for every activity (backward pass from LF(End) = 10).', 'Tính đúng LS và LF cho mọi hoạt động (lượt ngược từ LF(End) = 10).'), weight: 1, maxScore: 0.6 },
    { id: 'float', criterion: B('Correctly computes the float of every activity (F = H = 0; G = I = 2; A = B = 3; C = 4; D = E = 6).', 'Tính đúng float của mọi hoạt động (F = H = 0; G = I = 2; A = B = 3; C = 4; D = E = 6).'), weight: 1, maxScore: 0.6 },
    { id: 'critical_path', criterion: B('Correctly identifies the critical path Start-F-H-End and the project duration of 10 months, and states the reading used for A and for the dangling activities D and E.', 'Xác định đúng đường găng Start-F-H-End và thời lượng dự án 10 tháng, đồng thời nêu rõ cách đọc đã dùng cho A và cho hai hoạt động treo D, E.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Part 4 – Cost tracking:</strong> assume you are the PM of a project required to complete 100 features with a budget of $10,000; the budget and the workload are spread evenly over 10 weeks.</p>
     <p>You are at the start of week three. So far you have accepted 20 completed features and have spent $2,500.</p>
     <p>Apply the Earned Value model to compute PV, EV, AC, SV, CV, SPI, CPI, EAC and EDAC for this project, then give your comments on the project.</p>
     <p><em>Hints from the paper:</em> (1) it is only addition, subtraction, multiplication and division; (2) the commentary needs 2 points — (a) is the project ahead of / behind / on schedule? (b) is the project over / on / under budget?</p>
     <p><em>Editorial note:</em> "at the start of week three" is taken to mean 2 full weeks have elapsed, so the status date is the end of week 2. EDAC (estimated duration at completion) = planned duration ÷ SPI.</p>`,
    `<p><strong>Phần 4 – Cost tracking:</strong> giả định bạn là PM của một dự án có yêu cầu hoàn thành 100 tính năng với ngân sách 10.000$, ngân sách (budget) và công việc (workload) được trải đều trong vòng 10 tuần.</p>
     <p>Bạn đang bắt đầu tuần thứ ba. Tính đến hiện tại, bạn đã nghiệm thu xong 20 tính năng và tiêu hết 2.500$.</p>
     <p>Áp dụng mô hình Earned Value để tính các giá trị PV, EV, AC, SV, CV, SPI, CPI, EAC, EDAC cho dự án này, rồi đưa ra nhận xét của bạn về dự án.</p>
     <p><em>Gợi ý của đề:</em> (1) chỉ là cộng trừ nhân chia; (2) nhận định gồm 2 ý — (a) dự án có đang nhanh/chậm/đúng tiến độ? (b) dự án đang dùng vượt/đúng/dưới ngân sách?</p>
     <p><em>Ghi chú biên tập:</em> "đang bắt đầu tuần thứ ba" được hiểu là đã trôi qua trọn 2 tuần, tức mốc đánh giá là cuối tuần 2. EDAC (thời lượng ước tính khi hoàn thành) = thời lượng kế hoạch ÷ SPI.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Baseline:</strong> BAC = $10,000 over 10 weeks for 100 features, spread evenly ⇒ $1,000 and 10 features planned per week. Status date: end of week 2.</p>
     <ul><li><b>PV</b> = 2 weeks × $1,000 = <b>$2,000</b> (20 features were planned by now)</li>
     <li><b>EV</b> = (20 / 100) × $10,000 = <b>$2,000</b> (20 features actually accepted)</li>
     <li><b>AC</b> = <b>$2,500</b> (given)</li>
     <li><b>SV</b> = EV − PV = 2,000 − 2,000 = <b>$0</b></li>
     <li><b>CV</b> = EV − AC = 2,000 − 2,500 = <b>−$500</b></li>
     <li><b>SPI</b> = EV / PV = 2,000 / 2,000 = <b>1.00</b></li>
     <li><b>CPI</b> = EV / AC = 2,000 / 2,500 = <b>0.80</b></li>
     <li><b>EAC</b> = BAC / CPI = 10,000 / 0.80 = <b>$12,500</b></li>
     <li><b>ETC</b> = EAC − AC = 12,500 − 2,500 = <b>$10,000</b> still to spend</li>
     <li><b>VAC</b> = BAC − EAC = 10,000 − 12,500 = <b>−$2,500</b> (forecast overrun)</li>
     <li><b>EDAC</b> = planned duration / SPI = 10 / 1.00 = <b>10 weeks</b></li></ul>
     <p><strong>(a) Schedule: exactly on schedule.</strong> SV = 0 and SPI = 1.00 — 20 features were planned by the end of week 2 and exactly 20 were accepted. The forecast finish date is unchanged: EDAC = 10 weeks.</p>
     <p><strong>(b) Cost: over budget.</strong> CV = −$500 and CPI = 0.80 — every dollar spent is buying only 80 cents of planned work. The project has already burned 25% of the budget for 20% of the scope. If that efficiency holds, the project finishes at EAC = $12,500, which is $2,500 (25%) over the $10,000 budget, with $10,000 still to be spent for the remaining 80 features.</p>
     <p><strong>Recommended actions.</strong> The problem is purely cost, not schedule, so do not add people to go faster — that would make the cost worse. Find the source of the overspend first (unplanned overtime? more expensive resources than estimated? rework on the 20 accepted features?). Then: renegotiate vendor/resource rates or move work to cheaper resources; cut or defer low-value features to bring the remaining scope back inside the budget; raise the $2,500 forecast overrun to the sponsor now rather than at week 10, and request either a budget change or a scope reduction; keep tracking CPI weekly to see whether the corrective action moves it back toward 1.0.</p>`,
    `<p><strong>Đường cơ sở:</strong> BAC = 10.000$ cho 10 tuần và 100 tính năng, trải đều ⇒ mỗi tuần kế hoạch 1.000$ và 10 tính năng. Mốc đánh giá: cuối tuần 2.</p>
     <ul><li><b>PV</b> = 2 tuần × 1.000$ = <b>2.000$</b> (theo kế hoạch tới giờ phải xong 20 tính năng)</li>
     <li><b>EV</b> = (20 / 100) × 10.000$ = <b>2.000$</b> (thực tế đã nghiệm thu 20 tính năng)</li>
     <li><b>AC</b> = <b>2.500$</b> (đề cho)</li>
     <li><b>SV</b> = EV − PV = 2.000 − 2.000 = <b>0$</b></li>
     <li><b>CV</b> = EV − AC = 2.000 − 2.500 = <b>−500$</b></li>
     <li><b>SPI</b> = EV / PV = 2.000 / 2.000 = <b>1,00</b></li>
     <li><b>CPI</b> = EV / AC = 2.000 / 2.500 = <b>0,80</b></li>
     <li><b>EAC</b> = BAC / CPI = 10.000 / 0,80 = <b>12.500$</b></li>
     <li><b>ETC</b> = EAC − AC = 12.500 − 2.500 = <b>10.000$</b> còn phải chi</li>
     <li><b>VAC</b> = BAC − EAC = 10.000 − 12.500 = <b>−2.500$</b> (dự báo vượt ngân sách)</li>
     <li><b>EDAC</b> = thời lượng kế hoạch / SPI = 10 / 1,00 = <b>10 tuần</b></li></ul>
     <p><strong>(a) Tiến độ: ĐÚNG kế hoạch.</strong> SV = 0 và SPI = 1,00 — kế hoạch tới cuối tuần 2 là 20 tính năng và đã nghiệm thu đúng 20. Ngày hoàn thành dự báo không đổi: EDAC = 10 tuần.</p>
     <p><strong>(b) Chi phí: VƯỢT ngân sách.</strong> CV = −500$ và CPI = 0,80 — mỗi đồng chi ra chỉ mua được 80 xu giá trị công việc theo kế hoạch. Dự án đã đốt 25% ngân sách để làm 20% phạm vi. Nếu giữ nguyên hiệu suất này, dự án kết thúc ở EAC = 12.500$, tức vượt 2.500$ (25%) so ngân sách 10.000$, và còn phải chi 10.000$ nữa cho 80 tính năng còn lại.</p>
     <p><strong>Đề xuất hành động.</strong> Vấn đề nằm ở CHI PHÍ chứ không phải tiến độ, nên đừng thêm người để chạy nhanh hơn — làm vậy chỉ khiến chi phí tệ thêm. Trước hết tìm nguyên nhân bội chi (làm thêm giờ ngoài kế hoạch? nhân sự đắt hơn ước tính? làm lại 20 tính năng đã nghiệm thu?). Sau đó: đàm phán lại đơn giá nhà cung cấp/nhân sự hoặc chuyển việc sang nguồn lực rẻ hơn; cắt hoặc hoãn các tính năng giá trị thấp để kéo phạm vi còn lại về trong ngân sách; báo ngay cho nhà tài trợ khoản dự báo vượt 2.500$ ở thời điểm này thay vì đợi tới tuần 10, và đề nghị hoặc điều chỉnh ngân sách hoặc giảm phạm vi; tiếp tục theo dõi CPI hàng tuần để xem biện pháp khắc phục có kéo nó về gần 1,0 không.</p>`,
  ),
  explanation: B(
    `<p><b>Computed independently:</b> the budget and workload are both linear, so the plan is $1,000 and 10 features per week. At the status date (end of week 2) PV = $2,000 and EV = 20% × $10,000 = $2,000, giving the clean SPI = 1.00, CPI = 2,000/2,500 = 0.80, EAC = $12,500, EDAC = 10 weeks.</p>
     <p><b>Watch the status date.</b> "At the start of week three" is read as 2 elapsed weeks (end of week 2). If it were misread as 3 elapsed weeks, PV would become $3,000 and the answer would flip to SPI = 0.67 with SV = −$1,000 and EDAC = 15 weeks — a completely different diagnosis. The 2-week reading is the one that makes EV = PV and produces the intended "on schedule but over budget" case.</p>`,
    `<p><b>Đã tự tính độc lập:</b> ngân sách và khối lượng đều tuyến tính, nên kế hoạch là 1.000$ và 10 tính năng mỗi tuần. Tại mốc đánh giá (cuối tuần 2), PV = 2.000$ và EV = 20% × 10.000$ = 2.000$, cho ra SPI = 1,00 tròn, CPI = 2.000/2.500 = 0,80, EAC = 12.500$, EDAC = 10 tuần.</p>
     <p><b>Cẩn thận mốc đánh giá.</b> "Đang bắt đầu tuần thứ ba" được hiểu là đã trôi qua 2 tuần (cuối tuần 2). Nếu đọc nhầm thành đã qua 3 tuần thì PV thành 3.000$ và đáp án lật ngược: SPI = 0,67, SV = −1.000$, EDAC = 15 tuần — một chẩn đoán hoàn toàn khác. Cách đọc 2 tuần mới là cách làm EV = PV và cho ra đúng tình huống mà đề nhắm tới: đúng tiến độ nhưng vượt ngân sách.</p>`,
  ),
  rubric: [
    { id: 'pv_ev_ac', criterion: B('Correctly derives the baseline ($1,000 and 10 features per week) and computes PV = $2,000, EV = $2,000, AC = $2,500.', 'Suy ra đúng đường cơ sở (1.000$ và 10 tính năng mỗi tuần) và tính PV = 2.000$, EV = 2.000$, AC = 2.500$.'), weight: 1, maxScore: 0.6 },
    { id: 'variances_indices', criterion: B('Correctly computes SV = $0, CV = −$500, SPI = 1.00 and CPI = 0.80.', 'Tính đúng SV = 0$, CV = −500$, SPI = 1,00 và CPI = 0,80.'), weight: 1, maxScore: 0.5 },
    { id: 'forecasts', criterion: B('Correctly computes EAC = BAC/CPI = $12,500 and EDAC = 10/SPI = 10 weeks (ETC = $10,000 and VAC = −$2,500 also accepted as supporting work).', 'Tính đúng EAC = BAC/CPI = 12.500$ và EDAC = 10/SPI = 10 tuần (ETC = 10.000$ và VAC = −2.500$ được tính là phần bổ trợ).'), weight: 1, maxScore: 0.5 },
    { id: 'commentary', criterion: B('Gives both required verdicts explicitly — on schedule (SPI = 1) and over budget (CPI < 1) — and recommends a cost-side corrective action rather than a schedule-side one.', 'Nêu rõ cả hai kết luận đề yêu cầu — đúng tiến độ (SPI = 1) và vượt ngân sách (CPI < 1) — và đề xuất biện pháp khắc phục về CHI PHÍ chứ không phải về tiến độ.'), weight: 1, maxScore: 0.4 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Part 5 – Schedule adjusting:</strong> assume you are managing a project whose network diagram is given below (unit: weeks). Identify the critical path and the duration of the project.</p>
     <p><em>Editorial note: the source gives this network as a picture. It is transcribed below. Arrows in the picture: Start→A; A→B and A→C; B→D; D→E and D→F; C→G and F→G; E→End and G→End.</em></p>${netTableEn}
     <p>After 6 weeks, your superior asks you to plan a 3-week reduction in the project duration. Propose at least 2 options to do this, together with their respective impacts.</p>`,
    `<p><strong>Phần 5 – Schedule adjusting:</strong> giả định bạn đang quản lý một dự án có network diagram như dưới đây (đơn vị: tuần). Hãy xác định critical path và duration của dự án.</p>
     <p><em>Ghi chú biên tập: đề gốc cho sơ đồ mạng này dưới dạng ảnh. Bảng dưới là bản chép lại. Các mũi tên trong ảnh: Start→A; A→B và A→C; B→D; D→E và D→F; C→G và F→G; E→End và G→End.</em></p>${netTableVi}
     <p>Sau 6 tuần, cấp trên yêu cầu bạn lập kế hoạch giảm duration của dự án đi 3 tuần. Hãy đề xuất tối thiểu 2 phương án để thực hiện việc này kèm theo ảnh hưởng tương ứng.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Step 1 – Critical path and duration.</strong> All paths from Start to End:</p>
     <ul><li>Start→A→B→D→F→G→End: 5+5+5+1+6 = <b>22 weeks</b> (longest)</li>
     <li>Start→A→B→D→E→End: 5+5+5+4 = 19 weeks</li>
     <li>Start→A→C→G→End: 5+2+6 = 13 weeks</li></ul>
     <p><strong>Critical path: Start→A→B→D→F→G→End. Project duration: 22 weeks.</strong></p>
     <table><tr><th>Activity</th><th>Duration</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>A</td><td>5</td><td>0</td><td>5</td><td>0</td><td>5</td><td><b>0 (critical)</b></td></tr>
     <tr><td>B</td><td>5</td><td>5</td><td>10</td><td>5</td><td>10</td><td><b>0 (critical)</b></td></tr>
     <tr><td>C</td><td>2</td><td>5</td><td>7</td><td>14</td><td>16</td><td>9</td></tr>
     <tr><td>D</td><td>5</td><td>10</td><td>15</td><td>10</td><td>15</td><td><b>0 (critical)</b></td></tr>
     <tr><td>E</td><td>4</td><td>15</td><td>19</td><td>18</td><td>22</td><td>3</td></tr>
     <tr><td>F</td><td>1</td><td>15</td><td>16</td><td>15</td><td>16</td><td><b>0 (critical)</b></td></tr>
     <tr><td>G</td><td>6</td><td>16</td><td>22</td><td>16</td><td>22</td><td><b>0 (critical)</b></td></tr></table>
     <p><strong>Step 2 – Where the project stands at week 6.</strong> A (5 weeks) is finished and B is 1 week into its 5 weeks, so 4 weeks of B remain. The work still available to compress is B (4 weeks left), D, F and G. The target is 22 − 3 = <b>19 weeks</b>.</p>
     <p><strong>⚠️ The key constraint:</strong> the second-longest path, Start→A→B→D→E→End, is exactly 19 weeks. So 3 weeks is the maximum this network can absorb by compressing F/G alone — cutting them further buys nothing, because E becomes the new binding path. Anything beyond 3 weeks must also shorten B, D or E.</p>
     <p><strong>Option 1 – Crashing G (add resources).</strong> Bring G from 6 weeks down to 3 by putting extra staff and paid overtime on it, or by adding a second crew working in parallel on separable parts of G. New duration = 19 weeks; target met.<br/>
     <em>Impact:</em> direct cost rises (overtime premium, extra headcount, possible new equipment); productivity per person usually drops when a team is enlarged late in the work (added communication and onboarding overhead); quality and defect risk rise because G is compressed to half its planned time; and after the cut, Start→A→B→D→E→End is also 19 weeks, so <b>the project now has two critical paths</b> — E loses all of its 3 weeks of float and must be monitored just as tightly as G.</p>
     <p><strong>Option 2 – Fast-tracking F and G (overlap them).</strong> F takes only 1 week and G waits for both C and F. Instead of finishing F completely before starting G, start G on the parts that do not depend on F's output, and overlap D and F as well — for example release D's interim output to F, and start G's preparation work (resourcing, setup, the C-dependent portion, which is ready at week 7) while F is still running. Overlapping D/F/G by a total of 3 weeks brings the project to 19 weeks.<br/>
     <em>Impact:</em> no extra budget is needed, which makes this cheaper than crashing; but rework risk goes up sharply — if D's or F's final output differs from the interim version G started on, part of G must be redone and the saving is lost; coordination overhead and the need for tighter change control increase; and the same two-critical-path effect applies, so E's float disappears.</p>
     <p><strong>Option 3 – Scope reduction / reallocation from slack activities.</strong> Move people off C (9 weeks of float) onto D and G, and de-scope or defer the least valuable part of G to a post-project phase, so the remaining G work fits in 3 weeks.<br/>
     <em>Impact:</em> no extra cost and low rework risk, but it needs the sponsor's formal approval because it changes the agreed deliverable; the deferred scope becomes a follow-up commitment; and C's float shrinks from 9 weeks to whatever is left after its people are moved, so C must be re-checked in case it becomes critical itself.</p>
     <p><strong>Recommendation.</strong> Combine the cheap moves first: reallocate resources from C, fast-track the F→G handover where it is genuinely safe, and use paid crashing on G only for the residual weeks that fast-tracking cannot cover. Whichever mix is chosen, re-baseline the schedule and treat E as critical from now on.</p>`,
    `<p><strong>Bước 1 – Đường găng và thời lượng.</strong> Tất cả các đường từ Start tới End:</p>
     <ul><li>Start→A→B→D→F→G→End: 5+5+5+1+6 = <b>22 tuần</b> (dài nhất)</li>
     <li>Start→A→B→D→E→End: 5+5+5+4 = 19 tuần</li>
     <li>Start→A→C→G→End: 5+2+6 = 13 tuần</li></ul>
     <p><strong>Đường găng: Start→A→B→D→F→G→End. Thời lượng dự án: 22 tuần.</strong></p>
     <table><tr><th>Hoạt động</th><th>Thời lượng</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>A</td><td>5</td><td>0</td><td>5</td><td>0</td><td>5</td><td><b>0 (găng)</b></td></tr>
     <tr><td>B</td><td>5</td><td>5</td><td>10</td><td>5</td><td>10</td><td><b>0 (găng)</b></td></tr>
     <tr><td>C</td><td>2</td><td>5</td><td>7</td><td>14</td><td>16</td><td>9</td></tr>
     <tr><td>D</td><td>5</td><td>10</td><td>15</td><td>10</td><td>15</td><td><b>0 (găng)</b></td></tr>
     <tr><td>E</td><td>4</td><td>15</td><td>19</td><td>18</td><td>22</td><td>3</td></tr>
     <tr><td>F</td><td>1</td><td>15</td><td>16</td><td>15</td><td>16</td><td><b>0 (găng)</b></td></tr>
     <tr><td>G</td><td>6</td><td>16</td><td>22</td><td>16</td><td>22</td><td><b>0 (găng)</b></td></tr></table>
     <p><strong>Bước 2 – Dự án đang ở đâu tại tuần 6.</strong> A (5 tuần) đã xong, B mới chạy được 1 trong 5 tuần, tức còn 4 tuần B. Phần việc còn có thể rút là B (còn 4 tuần), D, F và G. Mục tiêu là 22 − 3 = <b>19 tuần</b>.</p>
     <p><strong>⚠️ Ràng buộc mấu chốt:</strong> đường dài thứ hai, Start→A→B→D→E→End, đúng bằng 19 tuần. Vậy 3 tuần là mức tối đa mà mạng này hấp thụ được nếu chỉ nén F/G — rút thêm nữa cũng vô ích vì E sẽ trở thành đường quyết định. Muốn rút quá 3 tuần thì phải rút cả B, D hoặc E.</p>
     <p><strong>Phương án 1 – Crashing G (thêm nguồn lực).</strong> Kéo G từ 6 tuần xuống 3 bằng cách bổ sung nhân sự và trả tiền làm thêm giờ, hoặc thêm một nhóm thứ hai làm song song các phần tách rời được của G. Thời lượng mới = 19 tuần; đạt mục tiêu.<br/>
     <em>Ảnh hưởng:</em> chi phí trực tiếp tăng (phụ cấp làm thêm, thêm đầu người, có thể thêm thiết bị); năng suất trên mỗi người thường giảm khi tăng quân vào giai đoạn muộn (tốn thêm giao tiếp và thời gian bắt nhịp); rủi ro chất lượng và lỗi tăng vì G bị nén còn một nửa thời gian kế hoạch; và sau khi rút, đường Start→A→B→D→E→End cũng dài 19 tuần, nên <b>dự án giờ có HAI đường găng</b> — E mất sạch 3 tuần float và phải giám sát chặt ngang G.</p>
     <p><strong>Phương án 2 – Fast-tracking F và G (cho chạy chồng lấn).</strong> F chỉ mất 1 tuần, còn G phải chờ cả C lẫn F. Thay vì làm xong hẳn F rồi mới bắt đầu G, hãy khởi động phần G không phụ thuộc đầu ra của F, đồng thời cho D và F chồng lấn — ví dụ bàn giao kết quả trung gian của D cho F, và bắt đầu phần chuẩn bị của G (bố trí nguồn lực, setup, phần phụ thuộc C vốn đã sẵn sàng từ tuần 7) trong khi F vẫn đang chạy. Chồng lấn D/F/G tổng cộng 3 tuần đưa dự án về 19 tuần.<br/>
     <em>Ảnh hưởng:</em> không cần thêm ngân sách nên rẻ hơn crashing; nhưng rủi ro làm lại tăng mạnh — nếu kết quả cuối của D hoặc F khác với bản trung gian mà G đã dựa vào, một phần G phải làm lại và khoản tiết kiệm mất trắng; chi phí điều phối và yêu cầu kiểm soát thay đổi chặt hơn đều tăng; và hiệu ứng hai đường găng ở trên vẫn xảy ra, float của E biến mất.</p>
     <p><strong>Phương án 3 – Giảm phạm vi / điều chuyển nguồn lực từ hoạt động dư.</strong> Rút người khỏi C (float 9 tuần) đưa sang D và G, đồng thời cắt hoặc hoãn phần ít giá trị nhất của G sang giai đoạn sau dự án, để phần G còn lại vừa 3 tuần.<br/>
     <em>Ảnh hưởng:</em> không tốn thêm tiền và ít rủi ro làm lại, nhưng phải được nhà tài trợ phê duyệt chính thức vì nó thay đổi sản phẩm bàn giao đã thoả thuận; phần phạm vi bị hoãn trở thành cam kết phải làm sau; và float của C tụt từ 9 tuần xuống mức còn lại sau khi rút người, nên phải kiểm tra lại C xem có tự nó thành găng không.</p>
     <p><strong>Khuyến nghị.</strong> Dùng các nước rẻ trước: điều chuyển nguồn lực từ C, fast-track khâu bàn giao F→G ở những chỗ thực sự an toàn, và chỉ dùng crashing tốn tiền cho G ở phần tuần còn thiếu mà fast-tracking không bù nổi. Chọn tổ hợp nào thì cũng phải chốt lại baseline lịch trình và từ nay coi E là hoạt động găng.</p>`,
  ),
  explanation: B(
    `<p><b>Computed independently by hand</b> (full forward + backward CPM pass on the transcribed network), then re-checked with an independently written CPM script — both give 22 weeks with the critical path Start→A→B→D→F→G→End and floats C = 9, E = 3, all others 0.</p>
     <p><b>On the transcription:</b> the network exists only as a picture in the source. The hidden text layer the paper's compiler added describes the branch to C as leaving B, but at 400 dpi both the arrow to B and the arrow to C clearly leave the right-hand edge of A from the same point, so A→C is what the drawing shows. This does not put the answer at risk: under the alternative reading (B→C) the critical path and the 22-week duration are identical — only C's float changes, from 9 weeks to 4.</p>`,
    `<p><b>Đã tự tính tay độc lập</b> (đầy đủ 2 lượt CPM xuôi + ngược trên sơ đồ đã chép lại), rồi kiểm lại bằng một script CPM tự viết — cả hai cho 22 tuần, đường găng Start→A→B→D→F→G→End, float C = 9, E = 3, còn lại bằng 0.</p>
     <p><b>Về việc chép lại sơ đồ:</b> đề gốc chỉ có ảnh. Lớp text ẩn do người biên soạn PDF chèn vào mô tả nhánh đi C là xuất phát từ B, nhưng phóng 400 dpi thì cả mũi tên đi B lẫn mũi tên đi C đều rõ ràng xuất phát từ cùng một điểm ở cạnh phải của A, nên bản vẽ nói A→C. Điều này không làm hỏng đáp án: với cách đọc thay thế (B→C), đường găng và thời lượng 22 tuần y hệt — chỉ float của C đổi từ 9 tuần xuống 4.</p>`,
  ),
  rubric: [
    { id: 'paths_and_cp', criterion: B('Lists the 3 start-to-end paths with correct durations (22, 19, 13) and identifies the critical path Start-A-B-D-F-G-End with a project duration of 22 weeks.', 'Liệt kê đúng 3 đường từ start tới end kèm thời lượng (22, 19, 13) và xác định đường găng Start-A-B-D-F-G-End với thời lượng dự án 22 tuần.'), weight: 1, maxScore: 0.7 },
    { id: 'float', criterion: B('Supports the answer with ES/EF/LS/LF or float values, correctly showing C = 9 weeks and E = 3 weeks of float and zero float on the critical activities.', 'Củng cố đáp án bằng ES/EF/LS/LF hoặc float, chỉ đúng C dư 9 tuần và E dư 3 tuần, các hoạt động găng float bằng 0.'), weight: 1, maxScore: 0.4 },
    { id: 'two_options', criterion: B('Proposes at least 2 distinct, named shortening techniques (e.g. crashing, fast-tracking, scope reduction / resource reallocation) that actually target activities on the critical path and really deliver the 3-week saving.', 'Đề xuất ít nhất 2 phương án rút ngắn khác nhau, gọi đúng tên kỹ thuật (crashing, fast-tracking, giảm phạm vi / điều chuyển nguồn lực...), nhắm đúng vào hoạt động trên đường găng và thực sự rút được 3 tuần.'), weight: 1, maxScore: 0.6 },
    { id: 'impacts', criterion: B('States a specific impact for each option (cost increase, rework/quality risk, scope change approval), and notes that the 3-week cut makes the 19-week path A-B-D-E critical as well.', 'Nêu ảnh hưởng cụ thể của từng phương án (tăng chi phí, rủi ro làm lại/chất lượng, phải duyệt thay đổi phạm vi), và chỉ ra rằng rút 3 tuần sẽ khiến đường 19 tuần A-B-D-E cũng trở thành đường găng.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE24',
    title: 'PMG201c – Practice Paper #24 (SU25 Trial, FA22 Awards)|||PMG201c – Bài thực hành #24 (đề thử SU25, Vinh danh FA22)',
    description: '⚠️ PRACTICE/TRIAL paper, not a real school exam. PMG201c PE (WRITE): work breakdown structure (WBS), SMART milestones and deliverables, network diagram with ES/EF/LS/LF and float, cost tracking with earned value management (EVM), and schedule adjusting (crashing/fast-tracking), AI-graded.|||⚠️ Đây là BÀI THỰC HÀNH/ĐỀ THỬ, KHÔNG phải đề thi thật của trường. PE PMG201c (viết): cấu trúc phân rã công việc (WBS), mốc SMART và sản phẩm bàn giao, sơ đồ mạng với ES/EF/LS/LF và float, theo dõi chi phí bằng quản lý giá trị thu được (EVM), và điều chỉnh lịch trình (rút ngắn/chồng lấn), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5],
  }],
};

const sum = spec.exams[0].questions.reduce((s, q) => s + q.points, 0);
if (Math.abs(sum - spec.exams[0].totalPoints) > 1e-9) {
  throw new Error(`Tổng points câu = ${sum} ≠ totalPoints = ${spec.exams[0].totalPoints}`);
}
for (const [i, q] of spec.exams[0].questions.entries()) {
  const r = q.rubric.reduce((s, x) => s + x.maxScore, 0);
  if (Math.abs(r - q.points) > 1e-9) throw new Error(`Q${i + 1}: rubric ${r} ≠ points ${q.points}`);
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${sum}/${spec.exams[0].totalPoints} điểm`);
