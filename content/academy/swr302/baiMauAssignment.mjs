/**
 * SWR302 — Bài mẫu Assignment nhóm (TP2 · OMFS · 9,6 điểm bảo vệ), đưa lên 21/11/2026 theo yêu cầu người dùng
 * ("để khoá sau họ còn có mẫu tham khảo"). Tệp đã ẩn tên thành viên/giảng viên và mã lớp (thay bằng vai trò).
 * Tệp nằm ở R2: files/exam-attachments/SWR302/mau-assignment-omfs/.
 */
const R2 = 'https://media.cuongthai.com/files/exam-attachments/SWR302/mau-assignment-omfs';
const TEP = [
  ['D1', 'TP2_D1_Vision_and_Scope.docx', 'Vision & Scope', 'Tầm nhìn & phạm vi: bối cảnh, cơ hội kinh doanh, mục tiêu BO-1…BO-5, chỉ số thành công, rủi ro, giả định, tính năng FE-1…FE-10, những gì KHÔNG làm, hồ sơ stakeholder.'],
  ['D2', 'D2_Use_Cases_OMFS.docx', 'Use Cases', '14 use case UC-01…UC-14 theo mẫu Wiegers: actor, trigger, tiền/hậu điều kiện, luồng chính, luồng thay thế, ngoại lệ, quy tắc nghiệp vụ liên quan, sơ đồ use case.'],
  ['D3', 'D3_Business_Rules_OMFS.docx', 'Business Rules', 'Danh mục quy tắc nghiệp vụ BR-xx: loại quy tắc, nguồn, mức tĩnh/động, use case áp dụng.'],
  ['D4', 'TP2_D4_SRS.docx', 'SRS', 'Đặc tả yêu cầu phần mềm đầy đủ theo mẫu Wiegers/IEEE: 71 yêu cầu chức năng, 22 yêu cầu chất lượng, giao diện ngoài, ràng buộc, phụ lục mô hình phân tích, TBD và ma trận truy vết.'],
  ['D5', 'D5_Data_Dictionary_OMFS.docx', 'Data Dictionary', 'Từ điển dữ liệu: thực thể, thuộc tính, kiểu, miền giá trị, ràng buộc — một bộ từ vựng chung cho mọi tài liệu.'],
  ['D6', 'D6_Mockups_OMFS.docx', 'Mockups', 'Wireframe/mock-up cho các use case chính, kèm bảng hiển thị – hành động – phản hồi.'],
  ['D7', 'D7_Requirements_Prioritization_OMFS.xlsx', 'Prioritization', 'Bảng ưu tiên yêu cầu (giá trị / chi phí / rủi ro) — cách chọn cái làm trước cho bản phát hành 1.0.'],
  ['D8', 'D8_Estimation_OMFS.xlsx', 'Estimation', 'Ước lượng công sức theo yêu cầu/tính năng — cách ra con số và giả định đằng sau.'],
];
const bang = TEP.map(([d, f, en, vi]) => `<tr><td><strong>${d}</strong></td><td>${en}</td><td>${vi}</td><td><a href="${R2}/${f}" target="_blank" rel="noopener">Tải ${d}</a></td></tr>`).join('\n');

const NOI_DUNG = `
<div class="ml-en">
<span class="eyebrow">Sample assignment · 9.6/10 at the defence</span>
<h2>A real SWR302 group assignment you can study (OMFS — Order Management &amp; Fulfillment System)</h2>
<p class="lead">This is a complete TP2 group assignment from a previous class: eight deliverables D1–D8 for one system, scored <strong>9.6/10</strong> at the oral defence. Member and lecturer names were removed. Use it to see what "good" looks like — then do your own project. Copying it is pointless: lecturers know this sample and every team gets a different brief.</p>
<p><a href="${R2}/SWR302-Assignment-mau-OMFS.zip" target="_blank" rel="noopener"><strong>Download all 8 files (zip, 3.4 MB)</strong></a></p>
<table><thead><tr><th>#</th><th>Deliverable</th><th>What it contains</th><th>File</th></tr></thead><tbody>
${bang}
</tbody></table>
<h3>Why it scored high</h3>
<ul>
<li><strong>One consistent story.</strong> Every requirement traces back to a business objective (D1) and forward to a use case (D2), a rule (D3) and a test-able statement in the SRS (D4).</li>
<li><strong>Numbers, not adjectives.</strong> "Pick-and-pack a three-line order unaided after 15 minutes of instruction", "weight 0.01–50.00 kg" — every quality requirement can be tested.</li>
<li><strong>Same vocabulary everywhere.</strong> The data dictionary (D5) and the SRS glossary list the words <em>not</em> to use, so documents never contradict each other.</li>
<li><strong>Alternative and exception flows</strong> are written for every use case — that is where most teams lose marks.</li>
<li><strong>Revision history</strong> shows the documents evolved with the brief, which is exactly what the defence panel asks about.</li>
</ul>
<h3>How to use it</h3>
<ol>
<li>Read D1 first, then D2 for one use case end to end, then find that use case in D4 and in the traceability matrix.</li>
<li>Do the same for your own project, deliverable by deliverable, while you study the matching chapter.</li>
<li>Before your defence, prepare answers to: "Where does this requirement come from?", "How would you test it?", "What changes if the client changes this rule?"</li>
</ol>
</div>
<div class="ml-vi">
<span class="eyebrow">Bài mẫu assignment · bảo vệ 9,6/10</span>
<h2>Một assignment nhóm SWR302 thật để tham khảo (OMFS — Hệ thống quản lý và xử lý đơn hàng)</h2>
<p class="lead">Đây là trọn bộ assignment TP2 của một nhóm khoá trước: tám deliverable D1–D8 cho một hệ thống, <strong>bảo vệ được 9,6/10</strong>. Tên thành viên và giảng viên đã được ẩn. Hãy dùng nó để thấy một bài "tốt" trông thế nào — rồi tự làm dự án của bạn. Chép lại là vô ích: giảng viên biết bài mẫu này và mỗi nhóm nhận một đề khác nhau.</p>
<p><a href="${R2}/SWR302-Assignment-mau-OMFS.zip" target="_blank" rel="noopener"><strong>Tải cả 8 tệp (zip, 3,4 MB)</strong></a></p>
<table><thead><tr><th>#</th><th>Deliverable</th><th>Nội dung</th><th>Tệp</th></tr></thead><tbody>
${bang}
</tbody></table>
<h3>Vì sao bài được điểm cao</h3>
<ul>
<li><strong>Một câu chuyện xuyên suốt.</strong> Mỗi yêu cầu truy ngược được về mục tiêu kinh doanh (D1) và truy xuôi tới use case (D2), quy tắc (D3) và một câu kiểm thử được trong SRS (D4).</li>
<li><strong>Con số thay cho tính từ.</strong> "Nhân viên kho tự đóng gói được đơn ba dòng sau 15 phút hướng dẫn", "khối lượng 0,01–50,00 kg" — yêu cầu chất lượng nào cũng kiểm thử được.</li>
<li><strong>Một bộ từ vựng chung.</strong> Từ điển dữ liệu (D5) và bảng thuật ngữ của SRS ghi cả những từ <em>không được dùng</em>, nên các tài liệu không bao giờ mâu thuẫn nhau.</li>
<li><strong>Luồng thay thế và ngoại lệ</strong> được viết cho mọi use case — chỗ đa số nhóm mất điểm.</li>
<li><strong>Lịch sử sửa đổi</strong> cho thấy tài liệu tiến hoá theo đề — đúng thứ hội đồng hay hỏi khi bảo vệ.</li>
</ul>
<h3>Cách dùng bài mẫu</h3>
<ol>
<li>Đọc D1 trước, rồi đọc trọn một use case trong D2, rồi tìm đúng use case đó trong D4 và trong ma trận truy vết.</li>
<li>Làm tương tự cho dự án của bạn, từng deliverable một, song song với chương học tương ứng.</li>
<li>Trước buổi bảo vệ, chuẩn bị trả lời: "Yêu cầu này đến từ đâu?", "Kiểm thử nó thế nào?", "Khách đổi quy tắc này thì sửa những gì?"</li>
</ol>
</div>`;

export const baiMauAssignmentSection = {
  title: '📁 Sample group assignment — OMFS (9.6/10)|||📁 Bài mẫu Assignment nhóm — OMFS (9,6 điểm)',
  description: 'Trọn bộ D1–D8 của một nhóm khoá trước (đã ẩn tên), bảo vệ 9,6/10 — tải về, xem vì sao điểm cao, cách dùng để làm bài của bạn.',
  lessons: [
    {
      title: 'Sample assignment D1–D8: OMFS — download & what makes it a 9.6|||Bài mẫu D1–D8: OMFS — tải về & vì sao được 9,6',
      slug: 'swr302-bai-mau-assignment-omfs',
      type: 'DOCUMENT',
      description: 'Tám deliverable Vision & Scope → Use Cases → Business Rules → SRS → Data Dictionary → Mockups → Prioritization → Estimation.',
      content: NOI_DUNG,
    },
  ],
};
