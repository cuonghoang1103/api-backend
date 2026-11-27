/**
 * Chương 11 — Hồ sơ cuối & bảo vệ 8–9 điểm (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài kiến thức (11.1–11.5), 1 bài Lab tổng duyệt bảo vệ trên CT Work LF #2 (11.6, dm5-11-lab) và bài kiểm tra 10 câu (11.7, dm5-11-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s11/b1-report7-rtm.mjs';
import B2 from './s11/b2-slide-demo-plan-b.mjs';
import B3 from './s11/b3-hoi-dong-5-vai.mjs';
import B4 from './s11/b4-rubric-tong-duyet.mjs';
import B5 from './s11/b5-trung-thuc-5-vai-ai.mjs';
import B6 from './s11/b6-lab.mjs';

const QUIZ11 = [
  Q('dm5-11-q1',
    'When pasting frozen Report 1–6 sections into the Report 7 template in Word, which paste mode keeps tables/images intact while preserving Report 7\'s uniform fonts and headings?|||Khi dán nội dung bản cuối Report 1–6 vào file mẫu Report 7 trong Word, chế độ dán nào vừa giữ nguyên bảng/ảnh vừa ăn đúng font và style Heading đồng nhất của Report 7?',
    [
      'Keep Text Only (strips all tables and images so you can retype them)|||Keep Text Only (xoá sạch bảng và ảnh để gõ lại từ đầu)',
      'Keep Source Formatting (imports all conflicting fonts and styles from 6 separate files)|||Keep Source Formatting (kéo nguyên các font và style xung đột từ 6 file riêng)',
      'Use Destination Styles — followed by real Heading 1–5 styles, Cross-references, Ctrl/Cmd+A → F9, and exporting PDF with Heading bookmarks|||Use Destination Styles — kết hợp style Heading 1–5 thật, Cross-reference, nhấn Ctrl/Cmd+A → F9 và xuất PDF có bookmark theo Heading',
      'Screenshot every page of Report 1–6 and paste them as PNG images into Report 7|||Chụp màn hình từng trang Report 1–6 rồi dán dạng ảnh PNG vào Report 7',
    ],
    2,
    'Use Destination Styles preserves tables/images while enforcing Report 7\'s typography cleanly; real Heading styles + F9 keep TOC and Figure/Table numbering error-free. Lesson 11.1.|||Use Destination Styles giữ nguyên bảng/ảnh mà vẫn ăn đúng kiểu chữ Report 7; dùng Heading thật + F9 giúp Mục lục và số Figure/Table không bao giờ lỗi. Bài 11.1.'),

  Q('dm5-11-q2',
    'In your final 14-column bidirectional Requirement Traceability Matrix (RTM), what do (A) a blank SDS § cell on a "Coded" or "Tested" UC row, and (B) an "Orphan Test" (a test linked to zero UC/BR) indicate?|||Trong Ma trận truy vết yêu cầu hai chiều (RTM) 14 cột cuối cùng, (A) một ô SDS § trống trên dòng UC đã "Coded" hoặc "Tested" và (B) một "Test mồ côi" (không trỏ về UC/BR nào) báo hiệu điều gì?',
    [
      'Both are harmless cosmetic details that examiners never check|||Cả hai đều là chi tiết trang trí vô hại, hội đồng không bao giờ soi',
      '(A) flags a classic Report 4 trap — a coded/tested function missing its Sequence/Class diagram; (B) signals either a redundant test or an undocumented requirement missing from SRS|||(A) bắt trúng lỗi kinh điển ở Report 4 — hàm đã code/test nhưng thiếu Sequence/Class diagram; (B) báo hiệu test thừa hoặc yêu cầu đã làm nhưng quên ghi vào SRS',
      '(A) means you should delete the code; (B) means you have 100% coverage|||(A) nghĩa là nên xoá code đó đi; (B) nghĩa là bạn đã đạt độ phủ 100%',
      'Both mean you should remove the RTM sheet from Project Tracking|||Cả hai nghĩa là nên xoá luôn sheet RTM khỏi Project Tracking',
    ],
    1,
    'Forward traceability (UC → SDS → Code → Test) catches missing diagrams/tests on both Coded and Tested rows before submission; backward traceability (Test → UC/BR) catches orphan tests or SRS gaps (ISO/IEC/IEEE 29148). Lesson 11.1.|||Truy vết xuôi (UC → SDS → Code → Test) bắt sơ đồ/test thiếu ở cả dòng Coded lẫn Tested trước khi nộp; truy vết ngược (Test → UC/BR) bắt test mồ côi hoặc lỗ hổng SRS (ISO/IEC/IEEE 29148). Bài 11.1.'),

  Q('dm5-11-q3',
    'Which slide design follows Michael Alley\'s Assertion–Evidence method best for a 15-minute defense?|||Cách thiết kế slide nào tuân thủ đúng phương pháp Khẳng định – Bằng chứng (Assertion–Evidence, Michael Alley) cho buổi bảo vệ 15 phút?',
    [
      'Title "Database Design" followed by 10 bullet points of 12pt text and a tiny blurred Word screenshot of 22 tables|||Tiêu đề "Thiết kế CSDL" kèm 10 gạch đầu dòng chữ 12pt và ảnh chụp mờ thu nhỏ 22 bảng từ Word',
      'Full-sentence claim headline ("PostgreSQL exclusion constraint enforces 1 winner under 50 parallel bookings"), clean redrawn visual diagram/chart (≥ 18pt), and a source footer (test ID, tag, Report 7 section)|||Tiêu đề dạng một câu khẳng định ("Ràng buộc Exclusion trên PostgreSQL bảo đảm đúng 1 lượt thành công dưới 50 request song song"), sơ đồ/biểu đồ vẽ sắc nét (≥ 18pt) và chân slide ghi nguồn (mã test, tag, mục Report 7)',
      'Zero text on any slide — only animated stock photos while you improvise|||Không có chữ nào trên slide — chỉ để ảnh minh hoạ có hiệu ứng bay nhảy rồi nói ứng biến',
      'Spending 12 of the 15 minutes reading Problem Background slides so only 3 minutes remain for Demo|||Dành 12 trong 15 phút đọc slide bối cảnh để còn đúng 3 phút cho Demo',
    ],
    1,
    'Assertion–Evidence pairs a 1-sentence claim headline with high-contrast visual proof and verifiable source footers, while keeping slides concise so Live Demo starts by minute 5:15. Lesson 11.2.|||Khẳng định – Bằng chứng ghép tiêu đề một câu khẳng định với bằng chứng trực quan sắc nét kèm nguồn kiểm chứng, giữ slide gọn để Demo bắt đầu chậm nhất ở phút 5:15. Bài 11.2.'),

  Q('dm5-11-q4',
    'Halfway through your live demo, the auditorium Wi-Fi gets congested or blocks your broker/API port (congestion much like Apple\'s 2010 WWDC Wi-Fi incident). What is the RIGHT execution of the 30-Second Plan B Protocol?|||Giữa buổi demo trực tiếp, Wi-Fi hội trường bị nghẽn hoặc chặn cổng broker/API (nghẽn mạng như sự cố Wi-Fi tại WWDC 2010 của Apple). Cách thực hiện ĐÚNG Giao thức Kế hoạch B 30 giây là gì?',
    [
      'Spend 5 silent minutes editing config files live and restarting Docker repeatedly while hoping it recovers|||Im lặng suốt 5 phút sửa file cấu hình trực tiếp và khởi động lại Docker liên tục với hy vọng nó tự chạy lại',
      'State calmly out loud what happened, try ONE pre-tested local fallback (personal 4G/5G hotspot or local simulator), and if still blocked at 30 seconds explicitly announce you are switching to the pre-recorded Plan-B video (date & same release tag) on SSD/USB, narrate that step, then return to the live app for unaffected steps|||Bình tĩnh nói rõ sự cố gì vừa xảy ra, thử ĐÚNG MỘT phương án dự phòng cục bộ đã kiểm (hotspot 4G/5G riêng hoặc simulator), nếu quá 30 giây vẫn kẹt thì nói rõ đây là video dự phòng quay sẵn (ngày quay & đúng tag đã nộp) trên SSD/USB, thuyết minh qua bước bị lỗi rồi chuyển về demo sống ở các bước sau',
      'Play your pre-recorded video silently without telling the panel so it looks like the live app is still running|||Bật video quay sẵn chạy im lặng không báo hội đồng để trông như ứng dụng vẫn đang chạy sống',
      'Open pgAdmin and manually flip status columns in the database so the UI looks like it worked|||Mở pgAdmin sửa tay cột trạng thái trong DB để giao diện trông như đã chạy',
    ],
    1,
    'Examiners respect calm, transparent recovery within 30 seconds — ALWAYS declare explicitly that Plan-B video is pre-recorded from the same release tag (passing video off as live is deception). Lesson 11.2.|||Hội đồng đánh giá cao xử lý bình tĩnh, minh bạch trong 30 giây — LUÔN nói rõ video Plan B là bản quay sẵn từ cùng tag đã nộp (chiếu video giả làm demo sống là hành vi che giấu). Bài 11.2.'),

  Q('dm5-11-q5',
    'During Q&A, an examiner asks a Hat C2 question (backed by Hat C5 test proof): "How do you guarantee a Student cannot query staff-only SOPs through your RAG Lab Assistant?" Which response follows the 40-second PREP + Evidence Cockpit method?|||Lúc Q&A, giám khảo hỏi câu thuộc mũ C2 (kèm bằng chứng test của mũ C5): "Làm sao em chắc sinh viên không hỏi ra được tài liệu SOP chỉ dành cho nhân viên qua trợ lý RAG?" Câu trả lời nào đúng khuôn PREP 40 giây + Buồng lái Bằng chứng?',
    [
      '"We told the LLM in the system prompt please never reveal staff documents — it works great."|||"Bọn em dặn LLM trong system prompt là đừng tiết lộ tài liệu nhân viên — chạy tốt lắm ạ."',
      '"Yes — role-based scope filtering runs in SQL at retrieval BEFORE chunks ever enter the LLM prompt (filtering after the model reads a doc is already a leak). May I show you? [opens Tab 4 SQL filter + Tab 5 permission-leakage test report in < 10s]. We scored 0 leaks on our test suite; the limit is new docs must have role metadata tagged at ingest."|||"Có ạ — bộ lọc phạm vi quyền chạy ngay ở tầng SQL truy xuất TRƯỚC khi đoạn văn vào prompt LLM (lọc sau khi model đã đọc là đã rò). Em xin mở cho thầy/cô xem [mở Tab 4 câu SQL lọc + Tab 5 báo cáo test rò quyền trong < 10 giây]. Bộ test ghi nhận 0 ca rò; giới hạn là tài liệu mới tải lên phải gắn đúng metadata quyền."',
      '"That is a backend question, not my role, so I cannot answer it."|||"Câu này thuộc phần backend, không phải vai em nên em không trả lời được ạ."',
      '"We hide the Staff Docs tab in React so students cannot see them."|||"Em ẩn tab Tài liệu nhân viên trên React nên sinh viên không thấy được ạ."',
    ],
    1,
    'Point → Reason → Evidence opened in ≤ 10s (course drill standard) → Honest Limit in ≤ 40s — proving real pre-prompt SQL authorization rather than fragile prompt-only promises. Lesson 11.3.|||Khẳng định → Lý do → Bằng chứng mở trong ≤ 10 giây (chuẩn luyện của khoá) → Giới hạn trung thực trong ≤ 40 giây — chứng minh lọc quyền SQL trước prompt thay vì chỉ dặn miệng LLM. Bài 11.3.'),

  Q('dm5-11-q6',
    'Midway through Q&A, an examiner challenges you: "Change the max length of Purpose from 250 to 100 characters right now." What is the safest, highest-scoring 3-minute live-edit sequence?|||Giữa buổi Q&A, hội đồng yêu cầu: "Đổi độ dài tối đa trường Purpose từ 250 xuống 100 ký tự ngay bây giờ." Quy trình sửa sống 3 phút an toàn và ăn điểm cao nhất là gì?',
    [
      'Edit only maxLength="100" inside the React JSX input so it takes 15 seconds|||Chỉ sửa mỗi maxLength="100" trong thẻ input React cho nhanh 15 giây',
      'Edit files directly on your clean release tag without a scratch branch and skip testing|||Sửa thẳng lên bản checkout tag sạch không tách nhánh và bỏ qua chạy test',
      'Branch off first (git switch -c demo-live-edit), narrate all 3 layers aloud (backend DTO validation + frontend schema + boundary test 100/101), apply minimal edit, verify 101 fails with 400, show git diff, and restore cleanly if anything breaks|||Tách nhánh nháp trước (git switch -c demo-live-edit), nói rõ đủ 3 tầng (validate DTO backend + schema frontend + test biên 100/101), sửa gọn, kiểm chứng 101 bị chặn 400, hiện git diff và bình tĩnh git restore nếu trục trặc',
      'Refuse to touch the IDE because Code Freeze forbids any edits|||Từ chối mở IDE vì Code Freeze cấm mọi thao tác sửa',
    ],
    2,
    'Isolating on a scratch branch protects your clean tag while narrating & editing Backend + Frontend + Boundary Test proves genuine full-stack code ownership. Lesson 11.3.|||Tách nhánh nháp bảo vệ bản tag sạch, còn nói và sửa đủ Backend + Frontend + Test biên chứng minh bạn thật sự làm chủ code full-stack. Bài 11.3.'),

  Q('dm5-11-q7',
    'How should you treat SWP391\'s 20/40/20/20 Final Presentation weights when preparing for a SEP490 Capstone defense?|||Bạn nên đối xử thế nào với bộ trọng số 20/40/20/20 của Final Presentation SWP391 khi chuẩn bị bảo vệ đồ án tốt nghiệp SEP490?',
    [
      'Assume SEP490 uses the exact same 20/40/20/20 weights and never ask your supervisor|||Mặc định SEP490 dùng y hệt trọng số 20/40/20/20 và khỏi cần hỏi giảng viên',
      'Do NOT assume SWP391 weights apply directly — confirm SEP490\'s exact grading rubric, duration, and language with your supervisor by Week 19, while still self-grading against the 5 universal engineering pillars + v2 research rigor (baselines, eval datasets, limits)|||KHÔNG mặc định áp trọng số SWP391 sang SEP490 — hỏi thầy ngay từ Tuần 19 về thang điểm, thời lượng, ngôn ngữ thật của SEP490, đồng thời tự chấm trên 5 trụ cột kỹ thuật phổ quát + độ chặt đánh giá nghiên cứu v2 (baseline, tập eval, giới hạn)',
      'Ignore all rubrics because SEP490 only grades slides|||Bỏ qua mọi rubric vì SEP490 chỉ chấm slide',
      'Use SWP391\'s LOC formula to grade IoT hardware sensors|||Dùng công thức tính LOC của SWP391 để chấm cảm biến phần cứng IoT',
    ],
    1,
    'Never fabricate or assume internal school weights — verify exact SEP490 rules with your supervisor while self-assessing quality against universal engineering & research standards. Lesson 11.4.|||Không tự đoán quy định nội bộ trường — luôn hỏi thầy luật SEP490 thật, đồng thời tự đánh giá chất lượng theo 5 trụ cột kỹ thuật và chuẩn đánh giá nghiên cứu. Bài 11.4.'),

  Q('dm5-11-q8',
    'Which of the following is an instant "Defense Red Flag" in SEP490 research claims (Lesson 11.4)?|||Điều nào sau đây là một "Cờ đỏ" nghiêm trọng ngay lập tức khi trình bày phần nghiên cứu SEP490 (Bài 11.4)?',
    [
      'Publishing recall@k, groundedness, and no-answer accuracy with sample size n = 52, eval dataset version, and a 1-command reproduction script|||Công bố recall@k, groundedness và no-answer accuracy kèm cỡ mẫu n = 52, phiên bản tập eval và lệnh chạy lại 1 bước',
      'Claiming "Our ML Anomaly Detector achieved 95% accuracy" with no dataset description, no sample size, and NO rule-based baseline comparison on the same split|||Tuyên bố "Model phát hiện bất thường ML đạt chính xác 95%" mà không nêu tập dữ liệu, không cỡ mẫu và KHÔNG so sánh với rule baseline trên cùng tập chia',
      'Explicitly listing "single ESP32 bench & self-authored eval set" inside Limitations|||Ghi thẳng "một bench ESP32 & tập eval tự soạn" vào mục Limitations',
      'Showing a live fallback where turning off the AI gateway leaves core booking working|||Demo sống chế độ fallback: tắt AI gateway nhưng đặt phòng lõi vẫn chạy bình thường',
    ],
    1,
    'Unsourced accuracy claims without sample size or baseline comparisons immediately signal pseudo-research to capstone committees. Lesson 11.4.|||Tuyên bố độ chính xác không nguồn, không cỡ mẫu và không có baseline so sánh lập tức bật cờ đỏ "làm màu" trước hội đồng tốt nghiệp. Bài 11.4.'),

  Q('dm5-11-q9',
    'What is the core integrity lesson of the real federal court case Mata v. Avianca, Inc. (SDNY, June 2023) for students defending a capstone project?|||Bài học liêm chính cốt lõi từ vụ án liên bang có thật Mata v. Avianca, Inc. (SDNY, tháng 6/2023) dành cho sinh viên bảo vệ đồ án là gì?',
    [
      'Using any AI tool for brainstorming or proofreading is strictly illegal everywhere|||Dùng bất kỳ công cụ AI nào để gợi ý hay soát lỗi chính tả đều bị cấm ở mọi nơi',
      'Using a tool is not the offense — submitting UNVERIFIED AI output (hallucinated citations/code) and hiding/bluffing about it before a panel destroys credibility and triggers sanctions|||Dùng công cụ không phải cái tội — nộp đầu ra AI CHƯA KIỂM CHỨNG (trích dẫn/code bịa) rồi che giấu/chống chế trước hội đồng mới phá huỷ uy tín và dẫn tới xử phạt',
      'You should delete your Template5 AI Usage Log before submitting Report 7|||Bạn nên xoá sạch sổ Template5 AI Usage Log trước khi nộp Report 7',
      'Only lawyers need to verify references; software engineers do not|||Chỉ luật sư mới cần kiểm tra nguồn trích dẫn; kỹ sư phần mềm không cần',
    ],
    1,
    'Declare AI mentor/review use transparently (Use of AI Tools + Template5 with real Verified/Rejected rows) and verify 100% of every citation, metric, and code line you submit. Lesson 11.5.|||Công khai minh bạch việc dùng AI làm mentor/phản biện (đoạn Use of AI Tools + Template5 kèm dòng đã Kiểm chứng/Từ chối thật) và xác minh 100% mọi trích dẫn, số đo, dòng code nộp lên. Bài 11.5.'),

  Q('dm5-11-q10',
    'An examiner asks: "Why does CT Work show five roles (C1–C5) if you built this alone, and which part is new vs. inherited from SWP391?" What is the strongest, most honest response?|||Giám khảo hỏi: "Em làm một mình sao trên CT Work lại có đủ 5 vai C1–C5, và phần nào mới so với SWP391?" Câu trả lời trung thực và thuyết phục nhất là gì?',
    [
      'Claim the C2–C5 roles are teammates who dropped out yesterday, and say everything was written from scratch last month|||Nói dối rằng các vai C2–C5 là bạn cùng nhóm mới nghỉ hôm qua, và bảo toàn bộ code mới viết lại từ đầu tháng trước',
      'Backdate Git commits under 5 different emails so GitHub matches CT Work|||Chỉnh lùi ngày commit Git bằng 5 email khác nhau để GitHub khớp với CT Work',
      'Explain clearly that Cover/Report 7 (§II.4)/CT Work openly state "1 person rotating 5 roles" to simulate cross-role review discipline under ONE real Git identity (explicitly noting in Limitations that it does NOT replace true multi-person Separation of Duties); open GitHub Compare between v1.0-swp391-reference and v2.0-sep490-reference to show the exact inherited core vs. new v2 delta; and invite the panel to pick any file for a live walkthrough or 3-minute edit|||Giải thích rõ Bìa/Report 7 (§II.4)/CT Work đều ghi công khai "1 người luân phiên 5 vai" để mô phỏng review chéo luyện kỷ luật dưới MỘT danh tính Git thật (đồng thời ghi rõ trong Limitations rằng cách này KHÔNG thay thế Tách biệt nhiệm vụ thật nhiều người); mở GitHub Compare giữa tag v1.0-swp391-reference và v2.0-sep490-reference chỉ rõ lõi kế thừa với phần làm mới v2; và mời hội đồng chọn bất kỳ tệp nào để giải thích hoặc sửa sống 3 phút',
      'Say "I don\'t remember which part was SWP391" and quickly change the slide|||Nói "Em không nhớ phần nào của SWP391" rồi chuyển nhanh sang slide khác',
    ],
    2,
    'Full transparency (1 person 5 hats simulating cross-role review + honest Limitations + 1 real Git author + exact Git tag diff v1 vs. v2 + live code ownership) turns potential suspicion into rock-solid engineering credibility. Lesson 11.5 & Lab 11.6.|||Minh bạch tuyệt đối (1 người 5 mũ mô phỏng review chéo + ghi trung thực vào Limitations + 1 tác giả Git thật + diff rõ ràng giữa tag v1 và v2 + sẵn sàng mở/sửa code sống) biến nghi ngờ thành điểm cộng uy tín kỹ thuật. Bài 11.5 & Lab 11.6.'),
];

export default {
  title: 'Chapter 11 — Final Reports & 8–9 Defense|||Chương 11 — Hồ sơ cuối & bảo vệ 8–9 điểm',
  description: 'Hoàn tất bộ hồ sơ cuối nhất quán và làm chủ buổi bảo vệ mốc 8–9 điểm khi một mình đóng 5 vai: ghép Report 7 (Final Project Report) từ bản cuối Report 1–6 không vỡ định dạng + Ma trận truy vết hai chiều RTM 14 cột (ISO/IEC/IEEE 29148), dựng slide Khẳng định–Bằng chứng (Michael Alley 2013) + kịch bản demo SWP391 & SEP490 có đường lỗi sống + Kế hoạch B 30 giây, ma trận hỏi đáp PREP 40 giây qua cả 5 mũ C1–C5 + Buồng lái 6 tab + sửa code sống 3 phút, Rubric tự chấm thống nhất & Tổng duyệt 3 vòng R1–R3, nghệ thuật nói thật về "1 người 5 vai" & AI mentor, Lab tổng duyệt trọn gói trên CT Work LF #2 và Kiểm tra 10 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    {
      title: '11.7 — Chapter 11 Quiz|||11.7 — Kiểm tra Chương 11',
      slug: 'dm5-11-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu hỏi tình huống bao trọn Chương 11: kỹ thuật ghép Report 7 (Use Destination Styles, F9, bookmark), truy vết hai chiều RTM 14 cột & test mồ côi, slide Khẳng định–Bằng chứng (vào Demo ≤ 5:15), Kế hoạch B 30 giây & công bố video quay sẵn, phản xạ PREP 40 giây & lọc quyền RAG, sửa code sống 3 phút, phân biệt thang SWP391 vs SEP490, cờ đỏ thiếu baseline, bài học Mata v. Avianca (2023) và minh bạch 1 người 5 vai / v1–v2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>11.7 — Check your readiness for Final Reports &amp; an 8–9 Defense</h2>
<p class="lead">Ten scenario-based questions covering Lessons 11.1–11.6 (two per lesson). Aim for at least 8/10 before moving on to Chapter 12 (After the Project, Changing Topics &amp; Enterprise Scale). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>11.7 — Kiểm tra độ sẵn sàng Hồ sơ cuối &amp; Bảo vệ 8–9 điểm</h2>
<p class="lead">Mười câu hỏi tình huống bao trọn Bài 11.1–11.6 (mỗi bài hai câu). Hãy đặt mục tiêu đạt tối thiểu 8/10 trước khi sang Chương 12 (Sau đồ án, Đổi đề tài &amp; Lên quy mô doanh nghiệp). Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ11 },
    },
  ],
};
