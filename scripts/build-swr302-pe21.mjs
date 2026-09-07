/**
 * build-swr302-pe21.mjs — sinh content/exams/SWR302-PE21.mjs.
 *
 * Nguồn thật: thư mục "Đề 21 - Đề Thi PE Sample PE SWR302 v1.0 + key (key tự
 * làm)", chỉ có 1 file .rar → giải ra 2 file .docx (đọc bằng textutil):
 *   • "Sample PE SWR302 v1.0 Short.docx"  → ĐỀ TRẮNG kèm THANG ĐIỂM từng ý.
 *   • "Sample-PE-SWR302-v1.0-Long.docx"   → cùng đề đó nhưng ĐÃ ĐIỀN đáp án
 *     (đây chính là "key tự làm" của sinh viên).
 *   ⚠️ Tên file đánh lừa: "Short" mới là bản có thang điểm, "Long" là bản có
 *   bài làm. Đừng đảo ngược.
 *
 * ⚠️⚠️ HAI ĐIỀU PHẢI GHI NHÃN (đã ghi ở title, câu đầu description, và một
 * đoạn in đậm ở đầu CẢ HAI khối ml-en/ml-vi của instructions):
 *   (1) Đây là ĐỀ MẪU (Sample PE SWR302 v1.0), KHÔNG phải đề thi thật của một
 *       kỳ cụ thể — không có mã kỳ (SP/SU/FA) nào trong nguồn.
 *   (2) KEY đi kèm là do SINH VIÊN TỰ LÀM, không phải đáp án chính thức.
 *
 * Bối cảnh đề: EduNext (website học tập theo lối kiến tạo của Đại học FPT).
 * KHÔNG trùng với SWR302-PE9 (FA 2023 - PE1) dù cùng cấu trúc điểm 1/4/4/1:
 * PE9 lấy hệ thống FUPB (FPT University Project Bank) làm đối tượng, chỉ nhắc
 * edunext.fpt.edu.vn như một hệ thống ngoài mà FUPB trao đổi dữ liệu.
 * Grep "EduNext" trong content/exams/SWR302-*.mjs chỉ ra đúng PE9 vì lý do đó.
 *
 * Thang điểm LẤY TỪ BẢN SHORT, cộng lại đúng 10:
 *   Q1 = 0,25×4 = 1,0 (tên sản phẩm · người soạn · tổ chức · ngày)
 *   Q2 = 0,1+0,6+1,0+0,1+0,1+0,2+0,2 + (0,3+0,2+0,2+0,1) + (0,3+0,2+0,2+0,2)
 *      = 4,0
 *   Q3 = 0,1+0,1+0,1+0,2+0,2+0,3+0,1+0,3+0,3+0,7+0,7+0,3+0,1+0,1+0,2+0,1+0,1
 *      = 4,0  (17 trường của mẫu use case)
 *   Q4 = 0,5+0,5 = 1,0
 *
 * ══════════════════════════════════════════════════════════════════════
 * ⛔ NHỮNG CHỖ KEY CỦA SINH VIÊN SAI / THIẾU — ĐÃ SỬA, và mỗi chỗ đều được
 *    nói rõ trong `explanation` của câu tương ứng:
 *
 * (1) Q1 — key thiếu hẳn dòng "Prepared by <tên>" (0,25đ trong 4 ô của bản
 *     Short). Bản Long chỉ có: tên sản phẩm, Version, tổ chức, ngày.
 *
 * (2) Q2/8d — SAI KIẾN THỨC UML. Key trả lời mũi tên nét đứt «extend» chỉ vào
 *     "Grade other students" (tức use case MỞ RỘNG). Sai: ở «extend», mũi tên
 *     đi TỪ use case mở rộng CHỈ VỀ use case CƠ SỞ. Đã sửa: chỉ vào use case
 *     cơ sở.
 *
 * (3) Q2/8a — "Grade other students" KHÔNG phải chức năng nào của EduNext
 *     được đề nêu (đề nói "vote answers by students / by teacher", không nói
 *     grade), mà đề lại cảnh báo dùng từ khoá ngoài đề thì ĐƯỢC 0 ĐIỂM. Đã
 *     đổi cặp extend sang "Answer Question" (cơ sở) ← "Comment Answer" (mở
 *     rộng), cả hai đều lấy đúng chữ trong đề ("reply or comment the answers
 *     of other students").
 *
 * (4) Q2/9a-9d — key BỎ TRỐNG toàn bộ phần include (0,9đ). Đã bổ sung:
 *     "Create Student Group" (cơ sở) include "Display Student List" (được bao
 *     gồm), mũi tên chỉ vào use case ĐƯỢC BAO GỒM. Cả hai use case đều nằm
 *     trong danh sách chức năng đề nêu.
 *
 * (5) Q3/Primary Actor — key ghi "Content Creator/Administrator", một vai
 *     KHÔNG tồn tại trong đề (đề chỉ có Students, Teachers, FAP system), lại
 *     MÂU THUẪN với chính câu 2 của key (đã trả lời Teachers). Đã sửa về
 *     Teacher.
 *
 * (6) Q3/Secondary Actors — key ghi "None", cũng mâu thuẫn với câu 2 của
 *     chính key ("Students"). Đã thống nhất một đáp án cho cả hai câu.
 *
 * (7) Q3/Date Created — key ghi 06/03/2022 trong khi trang bìa SRS ở câu 1
 *     ghi 06/03/2023. Đã sửa cho khớp.
 *
 * (8) Q3/Normal Flow — key đánh số 10.1, 10.2, 10.3, 10.5, 10.6, 10.7 (NHẢY
 *     mất 10.4). Đã đánh số liên tục.
 *
 * (9) Q3/Other Information — bản Short chấm trường này 0,1đ nhưng key KHÔNG
 *     viết. Đã bổ sung.
 *
 * (10) Q4/(b) — key chỉ gõ tiêu đề "b. Security:" rồi BỎ TRỐNG (mất trọn
 *      0,5đ). Đã viết đủ 2 phát biểu bảo mật đo được kèm cách kiểm thử.
 *
 * (11) Lỗi ĐÁNH MÁY của chính bản Short: nhãn 8.c ghi "included use case"
 *      (đúng ra là "extend use case" vì mục 8 nói về quan hệ extend) và 9.c
 *      ghi "extend use case" (đúng ra là "included use case"). Bản Long ghi
 *      đúng. Prompt của deck dùng nhãn ĐÚNG và nói rõ chỗ hoán vị này.
 * ══════════════════════════════════════════════════════════════════════
 *
 * Deck này KHÔNG có ảnh đề gốc (nguồn chỉ có .docx, không webp/pdf) →
 * không có imageUrl, không upload gì.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWR302-PE21.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('content/exams/SWR302-PE21.mjs');

/* ─────────────────────────── instructions ─────────────────────────── */
/* Dùng khối ml-en / ml-vi, KHÔNG chứa "|||". */
const instructions = [
  '<div class="ml-en">',
  '<p><strong>⚠️ Read this before you start: this is a SAMPLE paper, and the key that came with it was written by a student.</strong>',
  ' The source document is titled <em>"Sample PE SWR302 v1.0"</em> — it is a specimen practical paper, <strong>not</strong> the real exam of any particular term (there is no SP/SU/FA term code anywhere in it).',
  ' The filled-in answers that shipped alongside it are a <strong>student\'s own attempt</strong>, not an official marking key.',
  ' Every answer in this deck was re-derived from SRS / use-case theory; where the student key was wrong or incomplete, this deck differs from it and says so in the explanation under that question.</p>',
  '<p><b>How to take this practical exam.</b></p>',
  '<ol>',
  '<li>Read the system/context for <b>EduNext</b>, then answer each question <b>in writing, in English</b>, in the answer box. The paper warns that any answer using keywords unrelated to this paper scores ZERO.</li>',
  '<li>For the use case diagram, describe it clearly in text or list form — the model answer shows a reference diagram.</li>',
  '<li>Marks come from the source paper itself (Question 1 = 1, Question 2 = 4, Question 3 = 4, Question 4 = 1), broken down per sub-item exactly as the paper prints them.</li>',
  '<li>When you submit, AI grades each answer against a <b>rubric</b> and a reference solution, then shows a bilingual model answer.</li>',
  '</ol>',
  '</div>',
  '<div class="ml-vi">',
  '<p><strong>⚠️ Đọc trước khi làm: đây là ĐỀ MẪU, và KEY đi kèm là do SINH VIÊN TỰ LÀM.</strong>',
  ' Tài liệu nguồn có tên <em>"Sample PE SWR302 v1.0"</em> — là đề mẫu minh hoạ, <strong>KHÔNG</strong> phải đề thi thật của một kỳ cụ thể nào (trong nguồn không có mã kỳ SP/SU/FA nào).',
  ' Phần đáp án điền sẵn đi kèm là <strong>bài tự làm của một sinh viên</strong>, không phải đáp án chính thức của trường.',
  ' Mọi đáp án trong deck này đã được tự suy lại từ lý thuyết SRS / use case; chỗ nào key của sinh viên sai hoặc thiếu thì deck làm khác và ghi rõ lý do trong phần giải thích của câu đó.</p>',
  '<p><b>Cách làm bài thi thực hành.</b></p>',
  '<ol>',
  '<li>Đọc phần hệ thống/bối cảnh của <b>EduNext</b>, rồi trả lời mỗi câu <b>bằng chữ, bằng tiếng Anh</b> trong ô trả lời. Đề cảnh báo: câu trả lời dùng từ khoá không liên quan tới đề sẽ bị 0 ĐIỂM.</li>',
  '<li>Với sơ đồ use case, hãy mô tả rõ bằng chữ hoặc liệt kê — đáp án mẫu có sơ đồ tham chiếu.</li>',
  '<li>Thang điểm lấy từ chính đề gốc (Câu 1 = 1, Câu 2 = 4, Câu 3 = 4, Câu 4 = 1), chia nhỏ theo từng ý đúng như đề in.</li>',
  '<li>Khi nộp, AI chấm từng câu theo <b>rubric</b> và một đáp án mẫu, rồi hiện đáp án mẫu song ngữ.</li>',
  '</ol>',
  '</div>',
].join('');

/* ─────────────────────────── bối cảnh (Q1) ─────────────────────────── */
const contextEn =
  '<div class="pe-system"><b>System / Context:</b><br/>' +
  '<p>When developing new software, the development team must describe the software requirements in a <strong>Software Requirements Specification (SRS)</strong> before design and coding. Requirements are described using text, formulas, models and table descriptions.</p>' +
  '<p><strong>The software tools department at FPT University wants to develop a new software tool named the EduNext website</strong>, which lets students learn many courses in the <em>constructivism</em> way: students build up their knowledge more actively by searching content on the internet, reading textbooks, and interacting with other students in the same group or the same class.</p>' +
  '<p><strong>EduNext must provide functions that allow:</strong> importing the student list from the <strong>FAP system</strong>; displaying the student list; updating the student list; adding questions; updating questions; listing questions; creating student groups within one class (done by the teacher); answering the questions (done by students); voting answers by students; voting answers by the teacher; and signing in to EduNext using <strong>@fpt.edu.vn</strong> email accounts of students or teachers.</p>' +
  '<p>Besides that, EduNext records data about the interaction process between students at FPT University: posting answers to questions, replying to or commenting on other students\' answers, voting other students\' answers, and chatting with other students.</p>' +
  '<p><em>The use case approach is one of the most effective ways to describe software requirements.</em></p>' +
  '<p><strong>Exam rule printed on the paper:</strong> all answers must be in English and must reflect this exam paper. If an answer contains keywords not related to this exam paper, that answer scores ZERO.</p></div>';

const contextVi =
  '<div class="pe-system"><b>Hệ thống / Bối cảnh:</b><br/>' +
  '<p>Khi phát triển một phần mềm mới, đội phát triển phải mô tả yêu cầu phần mềm trong tài liệu <strong>Đặc tả yêu cầu phần mềm (SRS)</strong> trước khi thiết kế và lập trình. Yêu cầu được mô tả bằng chữ, công thức, mô hình và bảng mô tả.</p>' +
  '<p><strong>Bộ phận công cụ phần mềm của Đại học FPT muốn phát triển một công cụ phần mềm mới tên là website EduNext</strong>, cho phép sinh viên học nhiều môn theo lối <em>kiến tạo (constructivism)</em>: sinh viên chủ động xây dựng kiến thức bằng cách tìm nội dung trên internet, đọc giáo trình, và tương tác với các sinh viên khác trong cùng nhóm hoặc cùng lớp.</p>' +
  '<p><strong>EduNext phải có các chức năng cho phép:</strong> nhập danh sách sinh viên từ <strong>hệ thống FAP</strong>; hiển thị danh sách sinh viên; cập nhật danh sách sinh viên; thêm câu hỏi; cập nhật câu hỏi; liệt kê câu hỏi; tạo nhóm sinh viên trong cùng một lớp (do giảng viên thực hiện); trả lời câu hỏi (do sinh viên thực hiện); sinh viên bình chọn câu trả lời; giảng viên bình chọn câu trả lời; và đăng nhập EduNext bằng tài khoản email <strong>@fpt.edu.vn</strong> của sinh viên hoặc giảng viên.</p>' +
  '<p>Ngoài ra, EduNext ghi nhận dữ liệu về quá trình tương tác giữa các sinh viên Đại học FPT: đăng câu trả lời, phản hồi hoặc bình luận câu trả lời của sinh viên khác, bình chọn câu trả lời của sinh viên khác, và trò chuyện với sinh viên khác.</p>' +
  '<p><em>Tiếp cận theo use case là một trong những cách mô tả yêu cầu phần mềm hiệu quả nhất.</em></p>' +
  '<p><strong>Quy định in trên đề:</strong> mọi câu trả lời phải bằng tiếng Anh và phải phản ánh đúng đề thi này. Nếu câu trả lời chứa từ khoá không liên quan tới đề, câu đó bị 0 ĐIỂM.</p></div>';

/* ────────────────────────────── Câu 1 ────────────────────────────── */
const q1 = {
  kind: 'WRITE',
  points: 1,
  prompt:
    contextEn +
    '<p><b>Question 1 (1 point).</b> Complete all parts of the <strong>first page</strong> of the Software Requirements Specification for EduNext.</p>' +
    '<p>The template printed on the paper is:</p>' +
    '<pre>Software Requirements Specification\nfor\n&lt;product name&gt;                (0.25)\nVersion 1.0 approved\nPrepared by &lt;author&gt;           (0.25)\n&lt;organization&gt;                 (0.25)\n&lt;date created&gt;                 (0.25)</pre>' +
    '<p>Fill in each of the four angle-bracket blanks with a value that belongs to <em>this</em> exam paper.</p>' +
    '|||' +
    contextVi +
    '<p><b>Câu 1 (1 điểm).</b> Điền đầy đủ tất cả các phần của <strong>trang đầu tiên</strong> trong tài liệu Đặc tả yêu cầu phần mềm (SRS) cho EduNext.</p>' +
    '<p>Mẫu in trên đề là:</p>' +
    '<pre>Software Requirements Specification\nfor\n&lt;tên sản phẩm&gt;                (0,25)\nVersion 1.0 approved\nPrepared by &lt;người soạn&gt;      (0,25)\n&lt;tổ chức&gt;                      (0,25)\n&lt;ngày lập&gt;                     (0,25)</pre>' +
    '<p>Điền vào bốn ô ngoặc nhọn bằng giá trị thuộc về <em>chính</em> đề thi này.</p>',
  sampleSolution:
    '<p><strong>SRS title page — EduNext</strong></p>' +
    '<pre>Software Requirements Specification\nfor\nEduNext\nVersion 1.0 approved\nPrepared by Nguyen Van A (student, SWR302)\nSoftware Tools Department - FPT University, FU Hoa Lac\n06/03/2023</pre>' +
    '<p><strong>Why each blank takes that value:</strong></p>' +
    '<ul>' +
    '<li><strong>&lt;product name&gt; = EduNext</strong> — the paper names exactly one product to be specified: "a new software tool named EduNext website". Writing anything else (a generic "Learning System", or another FPTU tool) is an off-paper keyword and is scored zero by the rule printed on the paper.</li>' +
    '<li><strong>Prepared by = the author of the document</strong>, i.e. you as the requirements engineer sitting the exam. Write a real name plus your role, not "&lt;author&gt;".</li>' +
    '<li><strong>&lt;organization&gt; = Software Tools Department, FPT University (FU Hoa Lac)</strong> — the paper states the tool is developed by "the software tools department at FPT University", and the header of the source paper shows FU Hoa Lac as the campus.</li>' +
    '<li><strong>&lt;date created&gt; = 06/03/2023</strong> — the date printed on the source title page. Any date you write must then be used consistently in Question 3 (field "Date Created").</li>' +
    '</ul>' +
    '<p><strong>Note.</strong> "Version 1.0 approved" is already pre-printed on the template, so it is not one of the four graded blanks; do not delete it.</p>' +
    '|||' +
    '<p><strong>Trang bìa SRS — EduNext</strong></p>' +
    '<pre>Software Requirements Specification\nfor\nEduNext\nVersion 1.0 approved\nPrepared by Nguyen Van A (sinh viên, SWR302)\nSoftware Tools Department - FPT University, FU Hoa Lac\n06/03/2023</pre>' +
    '<p><strong>Vì sao mỗi ô nhận giá trị đó:</strong></p>' +
    '<ul>' +
    '<li><strong>&lt;tên sản phẩm&gt; = EduNext</strong> — đề chỉ nêu đúng một sản phẩm cần đặc tả: "a new software tool named EduNext website". Viết thứ khác (một cái tên chung chung kiểu "Learning System", hay một công cụ khác của FPTU) là từ khoá ngoài đề và bị 0 điểm theo đúng quy định in trên đề.</li>' +
    '<li><strong>Prepared by = người soạn tài liệu</strong>, tức chính bạn trong vai kỹ sư yêu cầu đang làm bài. Hãy ghi một cái tên thật kèm vai trò, đừng để nguyên "&lt;author&gt;".</li>' +
    '<li><strong>&lt;tổ chức&gt; = Bộ phận công cụ phần mềm, Đại học FPT (FU Hoà Lạc)</strong> — đề nói công cụ do "the software tools department at FPT University" phát triển, còn phần đầu đề gốc ghi cơ sở là FU Hoa Lac.</li>' +
    '<li><strong>&lt;ngày lập&gt; = 06/03/2023</strong> — ngày in trên trang bìa đề gốc. Ghi ngày nào thì Câu 3 (trường "Date Created") phải dùng đúng ngày đó.</li>' +
    '</ul>' +
    '<p><strong>Lưu ý.</strong> Dòng "Version 1.0 approved" đã in sẵn trong mẫu nên không nằm trong 4 ô được chấm điểm; đừng xoá nó.</p>',
  explanation:
    '<p><b>Difference from the student key that shipped with the source.</b> The filled-in ("Long") document writes only four lines — <em>EduNext</em>, <em>Version 1.0 approved</em>, <em>FU Hoa Lac</em>, <em>06/03/2023</em> — and <b>drops the "Prepared by &lt;author&gt;" line completely</b>. The blank ("Short") document prices that line at 0.25 of the 1.0 available, so the key as written loses a quarter of this question. This deck restores it.</p>' +
    '<p><b>Also worth knowing:</b> the four blanks are the standard IEEE-830 / Wiegers SRS title page. The page that follows it (Revision History, then the Table of Contents) is <em>not</em> asked for here — the paper says "the first page", and the four priced blanks are all on it.</p>' +
    '|||' +
    '<p><b>Khác với key sinh viên đi kèm nguồn.</b> Bản đã điền ("Long") chỉ viết bốn dòng — <em>EduNext</em>, <em>Version 1.0 approved</em>, <em>FU Hoa Lac</em>, <em>06/03/2023</em> — và <b>bỏ hẳn dòng "Prepared by &lt;author&gt;"</b>. Bản đề trắng ("Short") chấm dòng đó 0,25 trên tổng 1,0, nên key như đã viết mất một phần tư số điểm của câu này. Deck đã bổ sung lại.</p>' +
    '<p><b>Cần biết thêm:</b> bốn ô này chính là trang bìa SRS chuẩn IEEE-830 / Wiegers. Trang ngay sau nó (Revision History, rồi Mục lục) <em>không</em> nằm trong yêu cầu — đề chỉ hỏi "trang đầu tiên", và cả bốn ô có điểm đều nằm trên trang đó.</p>',
  rubric: [
    {
      id: 'c1_product',
      criterion:
        'Product name blank filled with EduNext (the one product this paper specifies), not a generic or off-paper name.|||Ô tên sản phẩm điền EduNext (sản phẩm duy nhất đề này đặc tả), không phải tên chung chung hay tên ngoài đề.',
      weight: 1,
      maxScore: 0.25,
    },
    {
      id: 'c2_author',
      criterion:
        'The "Prepared by <author>" line is present and filled with a real author name/role — the line the source key omitted.|||Có dòng "Prepared by <người soạn>" và điền tên/vai trò thật — đúng dòng mà key nguồn đã bỏ sót.',
      weight: 1,
      maxScore: 0.25,
    },
    {
      id: 'c3_org',
      criterion:
        'Organization blank filled with the owner named in the paper: the Software Tools Department of FPT University (FU Hoa Lac).|||Ô tổ chức điền đúng đơn vị chủ quản mà đề nêu: Bộ phận công cụ phần mềm của Đại học FPT (FU Hoà Lạc).',
      weight: 1,
      maxScore: 0.25,
    },
    {
      id: 'c4_date',
      criterion:
        'Date blank filled (06/03/2023 on the source page) and used consistently with the "Date Created" field in Question 3.|||Ô ngày được điền (đề gốc ghi 06/03/2023) và dùng nhất quán với trường "Date Created" ở Câu 3.',
      weight: 1,
      maxScore: 0.25,
    },
  ],
};

/* ────────────────────────────── Câu 2 ────────────────────────────── */
const mermaid = [
  '<pre class="mermaid">graph LR;',
  '  Student([Student]);',
  '  Teacher([Teacher]);',
  '  FAP([FAP system]);',
  '  subgraph EduNext[EduNext]',
  '    UC1((Sign In));',
  '    UC2((Import Student List));',
  '    UC3((Display Student List));',
  '    UC4((Add New Question));',
  '    UC5((Display Questions));',
  '    UC6((Create Student Group));',
  '    UC7((Answer Question));',
  '    UC8((Comment Answer));',
  '    UC9((Vote Answer));',
  '  end',
  '  FAP --- UC2;',
  '  Teacher --- UC1;',
  '  Teacher --- UC3;',
  '  Teacher --- UC4;',
  '  Teacher --- UC6;',
  '  Teacher --- UC9;',
  '  Student --- UC1;',
  '  Student --- UC5;',
  '  Student --- UC7;',
  '  Student --- UC9;',
  '  UC8 -. extend .-> UC7;',
  '  UC6 -. include .-> UC3;',
  '</pre>',
].join('\n');

const q2 = {
  kind: 'WRITE',
  points: 4,
  prompt:
    '<p><b>Question 2 (4 points).</b> A use case diagram is an effective way to visualise the interaction between actors and the software system. One use case diagram needs one <strong>rectangle</strong> representing one system or application; one <strong>oval</strong> represents one use case; the name of a use case must begin with a <em>verb</em> followed by an <em>object</em>.</p>' +
    '<p>Draw one use case diagram for EduNext and answer every item below.</p>' +
    '<ol>' +
    '<li>In this exam paper, the name of the rectangle is: ______ <em>(0.1)</em></li>' +
    '<li>An actor may be a human, another software system or a device. In this exam paper, list the names of &ge; 3 actors: ______ <em>(0.6)</em></li>' +
    '<li>In this exam paper, list the names of &ge; 5 use cases: ______ <em>(1.0)</em></li>' +
    '<li>Are the actors inside or outside the rectangle? ______ <em>(0.1)</em></li>' +
    '<li>Are the ovals representing use cases inside or outside the rectangle? ______ <em>(0.1)</em></li>' +
    '<li>The primary actor of the use case <strong>Add New Question</strong> is: ______ <em>(0.2)</em></li>' +
    '<li>The secondary actor of the use case <strong>Add New Question</strong> is: ______ <em>(0.2)</em></li>' +
    '<li>Based on the fact that you have already used the EduNext website, the use cases in this exam paper may have an <strong>extend</strong> relationship.' +
    '<ul>' +
    '<li>8.a List the names of two use cases that have an extend relationship: ______ <em>(0.3)</em></li>' +
    '<li>8.b The name of the <strong>base</strong> use case (in 8.a) is: ______ <em>(0.2)</em></li>' +
    '<li>8.c The name of the <strong>extending</strong> use case (in 8.a) is: ______ <em>(0.2)</em></li>' +
    '<li>8.d The dashed line with an arrow points to which use case? ______ <em>(0.1)</em></li>' +
    '</ul></li>' +
    '<li>The use cases in this exam paper may also have an <strong>include</strong> relationship.' +
    '<ul>' +
    '<li>9.a List the names of two use cases that have an include relationship: ______ <em>(0.3)</em></li>' +
    '<li>9.b The name of the <strong>base</strong> use case (in 9.a) is: ______ <em>(0.2)</em></li>' +
    '<li>9.c The name of the <strong>included</strong> use case (in 9.a) is: ______ <em>(0.2)</em></li>' +
    '<li>9.d The dashed line with an arrow points to which use case? ______ <em>(0.2)</em></li>' +
    '</ul></li>' +
    '</ol>' +
    '<p><em>Editorial note on the source paper:</em> the blank version of this paper mislabels two sub-items — it prints "included use case" at 8.c (which belongs to the <strong>extend</strong> group) and "extend use case" at 9.c (which belongs to the <strong>include</strong> group). The labels above are corrected; answer 8.c as the extending use case and 9.c as the included use case.</p>' +
    '|||' +
    '<p><b>Câu 2 (4 điểm).</b> Sơ đồ use case là cách hiệu quả để trực quan hoá tương tác giữa các tác nhân và hệ thống phần mềm. Một sơ đồ use case cần một <strong>hình chữ nhật</strong> đại diện cho một hệ thống hoặc ứng dụng; mỗi <strong>hình bầu dục</strong> là một use case; tên use case phải bắt đầu bằng <em>động từ</em> theo sau là <em>tân ngữ</em>.</p>' +
    '<p>Hãy vẽ một sơ đồ use case cho EduNext và trả lời tất cả các ý dưới đây.</p>' +
    '<ol>' +
    '<li>Trong đề này, tên của hình chữ nhật là: ______ <em>(0,1)</em></li>' +
    '<li>Tác nhân có thể là người, phần mềm khác hoặc thiết bị. Trong đề này, hãy liệt kê tên &ge; 3 tác nhân: ______ <em>(0,6)</em></li>' +
    '<li>Trong đề này, hãy liệt kê tên &ge; 5 use case: ______ <em>(1,0)</em></li>' +
    '<li>Các tác nhân nằm trong hay ngoài hình chữ nhật? ______ <em>(0,1)</em></li>' +
    '<li>Các hình bầu dục biểu diễn use case nằm trong hay ngoài hình chữ nhật? ______ <em>(0,1)</em></li>' +
    '<li>Tác nhân chính của use case <strong>Add New Question</strong> là: ______ <em>(0,2)</em></li>' +
    '<li>Tác nhân phụ của use case <strong>Add New Question</strong> là: ______ <em>(0,2)</em></li>' +
    '<li>Dựa trên việc bạn đã dùng website EduNext, các use case trong đề này có thể có quan hệ <strong>extend</strong>.' +
    '<ul>' +
    '<li>8.a Liệt kê tên hai use case có quan hệ extend: ______ <em>(0,3)</em></li>' +
    '<li>8.b Tên use case <strong>cơ sở</strong> (ở 8.a) là: ______ <em>(0,2)</em></li>' +
    '<li>8.c Tên use case <strong>mở rộng</strong> (ở 8.a) là: ______ <em>(0,2)</em></li>' +
    '<li>8.d Đường nét đứt có mũi tên chỉ vào use case nào? ______ <em>(0,1)</em></li>' +
    '</ul></li>' +
    '<li>Các use case trong đề này cũng có thể có quan hệ <strong>include</strong>.' +
    '<ul>' +
    '<li>9.a Liệt kê tên hai use case có quan hệ include: ______ <em>(0,3)</em></li>' +
    '<li>9.b Tên use case <strong>cơ sở</strong> (ở 9.a) là: ______ <em>(0,2)</em></li>' +
    '<li>9.c Tên use case <strong>được bao gồm</strong> (ở 9.a) là: ______ <em>(0,2)</em></li>' +
    '<li>9.d Đường nét đứt có mũi tên chỉ vào use case nào? ______ <em>(0,2)</em></li>' +
    '</ul></li>' +
    '</ol>' +
    '<p><em>Ghi chú biên tập về đề gốc:</em> bản đề trắng ghi nhầm nhãn hai ý — in "included use case" ở 8.c (vốn thuộc nhóm <strong>extend</strong>) và "extend use case" ở 9.c (vốn thuộc nhóm <strong>include</strong>). Nhãn ở trên đã được sửa; hãy trả lời 8.c là use case mở rộng và 9.c là use case được bao gồm.</p>',
  sampleSolution:
    '<p><strong>1. Name of the rectangle:</strong> <b>EduNext</b>.</p>' +
    '<p><strong>2. Actors (&ge; 3):</strong> <b>Student</b>, <b>Teacher</b>, <b>FAP system</b> (the external software system EduNext imports the student list from). An optional fourth is the <b>Email/Account service</b> that validates @fpt.edu.vn sign-in.</p>' +
    '<p><strong>3. Use cases (&ge; 5)</strong> — each named verb + object, each taken straight from the function list in the paper: <b>Sign In</b>; <b>Import Student List</b>; <b>Display Student List</b>; <b>Update Student List</b>; <b>Add New Question</b>; <b>Update Question</b>; <b>Display Questions</b>; <b>Create Student Group</b>; <b>Answer Question</b>; <b>Comment Answer</b>; <b>Vote Answer</b>; <b>Chat With Student</b>.</p>' +
    '<p><strong>4. The actors are OUTSIDE the rectangle.</strong> The rectangle is the system boundary; anything outside the boundary is an actor.</p>' +
    '<p><strong>5. The ovals (use cases) are INSIDE the rectangle.</strong> A use case is behaviour the system provides, so it lives inside the boundary.</p>' +
    '<p><strong>6. Primary actor of Add New Question:</strong> <b>Teacher</b> — the actor who initiates the use case and gets the value from it. (An Admin of the software tools department may hold the same role, but the paper only names Students, Teachers and the FAP system, so answer Teacher.)</p>' +
    '<p><strong>7. Secondary actor of Add New Question:</strong> <b>Student</b> — the actor the system involves so the use case reaches its goal: the question is added <em>to a class/group of students</em> and is published to them for answering. (A strict UML reading — a secondary actor is one the <em>system</em> communicates with during the use case — would accept "none" or "the FAP system", which supplies the class and student data the question is attached to. Say which reading you are using.)</p>' +
    '<p><strong>8. Extend relationship</strong></p>' +
    '<ul>' +
    '<li><b>8.a</b> <b>Answer Question</b> and <b>Comment Answer</b>. The paper says students "post the answers of the questions, reply or comment the answers of other students" — commenting is <em>optional</em> extra behaviour that happens while a student is in the answer thread, which is exactly what &laquo;extend&raquo; models.</li>' +
    '<li><b>8.b</b> Base use case: <b>Answer Question</b>. The base runs on its own and is complete without the extension.</li>' +
    '<li><b>8.c</b> Extending use case: <b>Comment Answer</b>. It only makes sense in the context of the base, and only sometimes happens.</li>' +
    '<li><b>8.d</b> The dashed arrow points to the <b>BASE use case = Answer Question</b>. In &laquo;extend&raquo;, the dependency is drawn <em>from the extending use case towards the base use case</em>: Comment Answer &nbsp;- - -&raquo;&nbsp; Answer Question, stereotyped &laquo;extend&raquo;. Memory hook: the arrow always points at the use case that does <em>not</em> know about the other one.</li>' +
    '</ul>' +
    '<p><strong>9. Include relationship</strong></p>' +
    '<ul>' +
    '<li><b>9.a</b> <b>Create Student Group</b> and <b>Display Student List</b>. The paper lists both functions, and grouping students of one class is impossible without first pulling up that class\'s student list — the sub-behaviour is <em>mandatory</em>, which is what &laquo;include&raquo; models.</li>' +
    '<li><b>9.b</b> Base use case: <b>Create Student Group</b>.</li>' +
    '<li><b>9.c</b> Included use case: <b>Display Student List</b>.</li>' +
    '<li><b>9.d</b> The dashed arrow points to the <b>INCLUDED use case = Display Student List</b>. In &laquo;include&raquo;, the dependency is drawn <em>from the base use case towards the included one</em>: Create Student Group &nbsp;- - -&raquo;&nbsp; Display Student List, stereotyped &laquo;include&raquo;. Same memory hook: the base knows it needs the included use case, the included one knows nothing, so the arrow points at the included one.</li>' +
    '</ul>' +
    '<p><strong>Reference diagram</strong> (actors outside the boundary, use cases inside; dashed arrows show the two relationships):</p>' +
    mermaid +
    '|||' +
    '<p><strong>1. Tên hình chữ nhật:</strong> <b>EduNext</b>.</p>' +
    '<p><strong>2. Tác nhân (&ge; 3):</strong> <b>Student</b> (Sinh viên), <b>Teacher</b> (Giảng viên), <b>FAP system</b> (hệ thống phần mềm bên ngoài mà EduNext nhập danh sách sinh viên từ đó). Có thể thêm tác nhân thứ tư là <b>dịch vụ Email/Tài khoản</b> xác thực đăng nhập @fpt.edu.vn.</p>' +
    '<p><strong>3. Use case (&ge; 5)</strong> — mỗi tên đều theo dạng động từ + tân ngữ, lấy thẳng từ danh sách chức năng trong đề: <b>Sign In</b>; <b>Import Student List</b>; <b>Display Student List</b>; <b>Update Student List</b>; <b>Add New Question</b>; <b>Update Question</b>; <b>Display Questions</b>; <b>Create Student Group</b>; <b>Answer Question</b>; <b>Comment Answer</b>; <b>Vote Answer</b>; <b>Chat With Student</b>.</p>' +
    '<p><strong>4. Các tác nhân nằm NGOÀI hình chữ nhật.</strong> Hình chữ nhật là ranh giới hệ thống; cái gì ngoài ranh giới thì là tác nhân.</p>' +
    '<p><strong>5. Các hình bầu dục (use case) nằm TRONG hình chữ nhật.</strong> Use case là hành vi do hệ thống cung cấp nên phải nằm trong ranh giới.</p>' +
    '<p><strong>6. Tác nhân chính của Add New Question:</strong> <b>Teacher</b> (Giảng viên) — người khởi tạo use case và nhận giá trị từ nó. (Quản trị viên của bộ phận công cụ phần mềm cũng có thể giữ vai này, nhưng đề chỉ nêu Students, Teachers và hệ thống FAP, nên hãy trả lời Teacher.)</p>' +
    '<p><strong>7. Tác nhân phụ của Add New Question:</strong> <b>Student</b> (Sinh viên) — tác nhân mà hệ thống có liên quan để use case đạt mục tiêu: câu hỏi được thêm <em>vào một lớp/nhóm sinh viên</em> và được công bố cho họ trả lời. (Cách đọc UML chặt hơn — tác nhân phụ là bên mà <em>hệ thống</em> trao đổi trong lúc chạy use case — thì chấp nhận "không có" hoặc "hệ thống FAP", nơi cung cấp dữ liệu lớp và sinh viên mà câu hỏi gắn vào. Hãy nói rõ bạn dùng cách đọc nào.)</p>' +
    '<p><strong>8. Quan hệ extend</strong></p>' +
    '<ul>' +
    '<li><b>8.a</b> <b>Answer Question</b> và <b>Comment Answer</b>. Đề viết sinh viên "post the answers of the questions, reply or comment the answers of other students" — bình luận là hành vi <em>tuỳ chọn</em> xảy ra khi sinh viên đang ở luồng trả lời, đúng bản chất của &laquo;extend&raquo;.</li>' +
    '<li><b>8.b</b> Use case cơ sở: <b>Answer Question</b>. Nó chạy độc lập và trọn vẹn dù không có phần mở rộng.</li>' +
    '<li><b>8.c</b> Use case mở rộng: <b>Comment Answer</b>. Nó chỉ có nghĩa trong ngữ cảnh của use case cơ sở, và chỉ thỉnh thoảng mới xảy ra.</li>' +
    '<li><b>8.d</b> Mũi tên nét đứt chỉ vào <b>use case CƠ SỞ = Answer Question</b>. Ở &laquo;extend&raquo;, quan hệ phụ thuộc được vẽ <em>từ use case mở rộng hướng về use case cơ sở</em>: Comment Answer &nbsp;- - -&raquo;&nbsp; Answer Question, gắn nhãn &laquo;extend&raquo;. Mẹo nhớ: mũi tên luôn chỉ vào use case <em>không</em> biết gì về use case kia.</li>' +
    '</ul>' +
    '<p><strong>9. Quan hệ include</strong></p>' +
    '<ul>' +
    '<li><b>9.a</b> <b>Create Student Group</b> và <b>Display Student List</b>. Đề liệt kê cả hai chức năng, và không thể chia nhóm sinh viên của một lớp nếu chưa lấy được danh sách sinh viên lớp đó — hành vi con là <em>bắt buộc</em>, đúng bản chất của &laquo;include&raquo;.</li>' +
    '<li><b>9.b</b> Use case cơ sở: <b>Create Student Group</b>.</li>' +
    '<li><b>9.c</b> Use case được bao gồm: <b>Display Student List</b>.</li>' +
    '<li><b>9.d</b> Mũi tên nét đứt chỉ vào <b>use case ĐƯỢC BAO GỒM = Display Student List</b>. Ở &laquo;include&raquo;, quan hệ được vẽ <em>từ use case cơ sở hướng tới use case được bao gồm</em>: Create Student Group &nbsp;- - -&raquo;&nbsp; Display Student List, gắn nhãn &laquo;include&raquo;. Vẫn mẹo nhớ đó: use case cơ sở biết nó cần use case kia, còn use case được bao gồm thì không biết gì, nên mũi tên chỉ vào nó.</li>' +
    '</ul>' +
    '<p><strong>Sơ đồ tham chiếu</strong> (tác nhân ngoài ranh giới, use case trong ranh giới; hai mũi tên nét đứt là hai quan hệ):</p>' +
    mermaid,
  explanation:
    '<p><b>Two places where this deck deliberately differs from the student key that shipped with the source.</b></p>' +
    '<p><b>(1) Item 8.d in the key is wrong on UML.</b> The key answers that the dashed &laquo;extend&raquo; arrow points to "Grade other students", i.e. to the <em>extending</em> use case. The direction is the other way round: in &laquo;extend&raquo; the dependency runs <em>from the extending use case to the base use case</em>, so the arrowhead lands on the base. (In &laquo;include&raquo; it runs from base to included, so the arrowhead lands on the included one — that is why 8.d and 9.d have different answers, and why the paper prices them separately.) A quick check that settles it every time: the arrow points at the use case that has no knowledge of the other.</p>' +
    '<p><b>(2) Item 8.a in the key uses vocabulary that is not in this paper.</b> The key names "Grade other students". Nothing in this exam paper grades anyone — the function list says "voting answers by students, voting answers by teacher". The paper prints the rule that an answer containing keywords not related to the paper scores ZERO, so "grade" is a risky word to hand a marker. This deck therefore uses <b>Answer Question</b> (base) with <b>Comment Answer</b> (extending), both of which are literal phrases from the paper ("reply or comment the answers of other students"), and both of which pass the optional-behaviour test that &laquo;extend&raquo; requires.</p>' +
    '<p><b>(3) Item 9 is blank in the key.</b> The whole include group (9.a-9.d, 0.9 of the 4.0) is left as "……" in the student\'s document, so it scores nothing. This deck supplies <b>Create Student Group</b> include <b>Display Student List</b>: both are named functions of EduNext, and the sub-behaviour is mandatory rather than optional, which is the test that separates &laquo;include&raquo; from &laquo;extend&raquo;.</p>' +
    '<p><b>Kept from the key:</b> rectangle = EduNext; actors Students / Teachers / FAP system; actors outside, ovals inside; primary actor of Add New Question = Teacher; secondary actor = Student. Those are all defensible and consistent with the paper.</p>' +
    '|||' +
    '<p><b>Hai chỗ deck này cố ý làm khác key sinh viên đi kèm nguồn.</b></p>' +
    '<p><b>(1) Ý 8.d trong key SAI về UML.</b> Key trả lời mũi tên nét đứt &laquo;extend&raquo; chỉ vào "Grade other students", tức chỉ vào use case <em>mở rộng</em>. Hướng đúng thì ngược lại: ở &laquo;extend&raquo;, quan hệ phụ thuộc đi <em>từ use case mở rộng tới use case cơ sở</em>, nên đầu mũi tên nằm ở use case cơ sở. (Ở &laquo;include&raquo; thì đi từ cơ sở tới use case được bao gồm, nên đầu mũi tên nằm ở use case được bao gồm — chính vì thế 8.d và 9.d có đáp án khác nhau và đề chấm riêng hai ý.) Cách kiểm nhanh luôn đúng: mũi tên chỉ vào use case không hề biết gì về use case kia.</p>' +
    '<p><b>(2) Ý 8.a trong key dùng từ ngữ KHÔNG có trong đề.</b> Key nêu "Grade other students". Đề này không có chỗ nào chấm điểm ai cả — danh sách chức năng ghi "voting answers by students, voting answers by teacher". Đề lại in rõ quy định: câu trả lời chứa từ khoá không liên quan tới đề sẽ bị 0 ĐIỂM, nên "grade" là chữ rất rủi ro khi đưa cho người chấm. Vì vậy deck dùng <b>Answer Question</b> (cơ sở) với <b>Comment Answer</b> (mở rộng) — cả hai đều là cụm chữ nguyên văn trong đề ("reply or comment the answers of other students") và đều thoả tính "hành vi tuỳ chọn" mà &laquo;extend&raquo; đòi hỏi.</p>' +
    '<p><b>(3) Ý 9 trong key BỎ TRỐNG.</b> Cả nhóm include (9.a-9.d, 0,9 trên tổng 4,0) trong bài của sinh viên chỉ là "……" nên không được điểm nào. Deck bổ sung <b>Create Student Group</b> include <b>Display Student List</b>: cả hai đều là chức năng đề nêu tên, và hành vi con ở đây là bắt buộc chứ không tuỳ chọn — đúng phép thử để phân biệt &laquo;include&raquo; với &laquo;extend&raquo;.</p>' +
    '<p><b>Giữ lại từ key:</b> hình chữ nhật = EduNext; tác nhân Students / Teachers / FAP system; tác nhân ở ngoài, bầu dục ở trong; tác nhân chính của Add New Question = Teacher; tác nhân phụ = Student. Những ý này đều hợp lý và nhất quán với đề.</p>',
  rubric: [
    {
      id: 'c1_boundary',
      criterion:
        'Rectangle named EduNext (0.1); actors stated as OUTSIDE the rectangle (0.1); use case ovals stated as INSIDE the rectangle (0.1).|||Hình chữ nhật đặt tên EduNext (0,1); nêu tác nhân nằm NGOÀI hình chữ nhật (0,1); nêu các bầu dục use case nằm TRONG hình chữ nhật (0,1).',
      weight: 1,
      maxScore: 0.3,
    },
    {
      id: 'c2_actors_ucs',
      criterion:
        'Lists >= 3 actors drawn from this paper, including at least one non-human actor such as the FAP system (0.6); lists >= 5 use cases named verb + object and taken from the paper\'s function list (1.0).|||Liệt kê >= 3 tác nhân lấy từ đề, trong đó có ít nhất một tác nhân không phải người như hệ thống FAP (0,6); liệt kê >= 5 use case đặt tên động từ + tân ngữ và lấy từ danh sách chức năng của đề (1,0).',
      weight: 1,
      maxScore: 1.6,
    },
    {
      id: 'c3_add_question_actors',
      criterion:
        'Primary actor of Add New Question = Teacher (0.2); a secondary actor is named and justified — Student, or under the strict UML reading the FAP system / none (0.2).|||Tác nhân chính của Add New Question = Teacher (0,2); nêu và lý giải tác nhân phụ — Student, hoặc theo cách đọc UML chặt là hệ thống FAP / không có (0,2).',
      weight: 1,
      maxScore: 0.4,
    },
    {
      id: 'c4_relationships',
      criterion:
        'Extend: two use cases with genuinely optional extra behaviour, both named from this paper (0.3), base identified (0.2), extending use case identified (0.2), and the dashed arrow correctly said to point at the BASE (0.1). Include: two use cases with mandatory shared behaviour (0.3), base identified (0.2), included use case identified (0.2), and the dashed arrow correctly said to point at the INCLUDED use case (0.2).|||Extend: hai use case có hành vi bổ sung thực sự tuỳ chọn, đều lấy tên từ đề (0,3), xác định use case cơ sở (0,2), xác định use case mở rộng (0,2), và nói đúng mũi tên nét đứt chỉ vào use case CƠ SỞ (0,1). Include: hai use case có hành vi dùng chung bắt buộc (0,3), xác định use case cơ sở (0,2), xác định use case được bao gồm (0,2), và nói đúng mũi tên nét đứt chỉ vào use case ĐƯỢC BAO GỒM (0,2).',
      weight: 1,
      maxScore: 1.7,
    },
  ],
};

/* ────────────────────────────── Câu 3 ────────────────────────────── */
const q3 = {
  kind: 'WRITE',
  points: 4,
  prompt:
    '<p><b>Question 3 (4 points).</b> Write the detailed description of one use case — the use case that <strong>adds (+) a new question</strong> — using the template below. Every field is graded; the mark of each field is shown in brackets.</p>' +
    '<ul>' +
    '<li>UC ID and Name <em>(0.1)</em></li>' +
    '<li>Created By <em>(0.1)</em></li>' +
    '<li>Date Created <em>(0.1)</em></li>' +
    '<li>Primary Actor <em>(0.2)</em></li>' +
    '<li>Secondary Actors <em>(0.2)</em></li>' +
    '<li>Trigger <em>(0.3)</em></li>' +
    '<li>Description <em>(0.1)</em></li>' +
    '<li>Preconditions <em>(0.3)</em></li>' +
    '<li>Postconditions <em>(0.3)</em></li>' +
    '<li>Normal Flow <em>(0.7)</em></li>' +
    '<li>Alternative Flows <em>(0.7)</em></li>' +
    '<li>Exceptions <em>(0.3)</em></li>' +
    '<li>Priority <em>(0.1)</em></li>' +
    '<li>Frequency of Use <em>(0.1)</em></li>' +
    '<li>Business Rules <em>(0.2)</em></li>' +
    '<li>Other Information <em>(0.1)</em></li>' +
    '<li>Assumptions <em>(0.1)</em></li>' +
    '</ul>' +
    '<p>Keep every field consistent with your answers in Question 1 and Question 2 (same product, same actors, same date).</p>' +
    '|||' +
    '<p><b>Câu 3 (4 điểm).</b> Viết mô tả chi tiết một use case — use case <strong>thêm (+) câu hỏi mới</strong> — theo mẫu dưới đây. Mọi trường đều được chấm; điểm từng trường ghi trong ngoặc.</p>' +
    '<ul>' +
    '<li>UC ID and Name <em>(0,1)</em></li>' +
    '<li>Created By <em>(0,1)</em></li>' +
    '<li>Date Created <em>(0,1)</em></li>' +
    '<li>Primary Actor <em>(0,2)</em></li>' +
    '<li>Secondary Actors <em>(0,2)</em></li>' +
    '<li>Trigger <em>(0,3)</em></li>' +
    '<li>Description <em>(0,1)</em></li>' +
    '<li>Preconditions <em>(0,3)</em></li>' +
    '<li>Postconditions <em>(0,3)</em></li>' +
    '<li>Normal Flow <em>(0,7)</em></li>' +
    '<li>Alternative Flows <em>(0,7)</em></li>' +
    '<li>Exceptions <em>(0,3)</em></li>' +
    '<li>Priority <em>(0,1)</em></li>' +
    '<li>Frequency of Use <em>(0,1)</em></li>' +
    '<li>Business Rules <em>(0,2)</em></li>' +
    '<li>Other Information <em>(0,1)</em></li>' +
    '<li>Assumptions <em>(0,1)</em></li>' +
    '</ul>' +
    '<p>Giữ mọi trường nhất quán với câu trả lời ở Câu 1 và Câu 2 (cùng sản phẩm, cùng tác nhân, cùng ngày).</p>',
  sampleSolution:
    '<p><strong>Use Case Detailed Description — Add New Question (EduNext)</strong></p>' +
    '<ul>' +
    '<li><b>1. UC ID and Name:</b> UC-04 Add New Question</li>' +
    '<li><b>2. Created By:</b> Nguyen Van A (requirements engineer) — the same author written on the SRS title page in Question 1.</li>' +
    '<li><b>3. Date Created:</b> 06/03/2023 — the same date as the SRS title page.</li>' +
    '<li><b>4. Primary Actor:</b> Teacher (the lecturer of the class). This is the same answer given in Question 2, item 6.</li>' +
    '<li><b>5. Secondary Actors:</b> Student — the question is published to the students of the selected class/group, who are the recipients of the use case\'s output. The FAP system is a further secondary actor if the class and student list must be refreshed while choosing the target class.</li>' +
    '<li><b>6. Trigger:</b> The teacher needs a new discussion question for a course session, and selects "Add New Question" in the question bank of that course on EduNext.</li>' +
    '<li><b>7. Description:</b> This use case allows a teacher to add a new question to the question bank of a course on EduNext, so that the students of the chosen class/group can answer it in the constructivism learning flow.</li>' +
    '<li><b>8. Preconditions:</b>' +
    '<ul>' +
    '<li>8.1. The teacher has signed in to EduNext with a valid @fpt.edu.vn account.</li>' +
    '<li>8.2. The teacher is authorised for the course whose question bank is being edited.</li>' +
    '<li>8.3. The course, the class and its student list already exist in EduNext (imported from the FAP system).</li>' +
    '</ul></li>' +
    '<li><b>9. Postconditions:</b>' +
    '<ul>' +
    '<li>9.1. Success: the new question is stored in the question bank of the course and appears in the question list (use case Display Questions).</li>' +
    '<li>9.2. Success: the question becomes visible and answerable to the students of the chosen class/group, and EduNext confirms the addition to the teacher.</li>' +
    '<li>9.3. Failure: nothing is stored; the question bank is unchanged and EduNext shows the reason.</li>' +
    '</ul></li>' +
    '<li><b>10. Normal Flow:</b>' +
    '<ol>' +
    '<li>10.1. The teacher signs in to EduNext and selects the course.</li>' +
    '<li>10.2. The teacher opens the question bank of that course and selects "Add New Question".</li>' +
    '<li>10.3. EduNext displays the new-question form (question content, session/slot, class or group it belongs to, deadline, attachments).</li>' +
    '<li>10.4. The teacher enters the question content and the accompanying information.</li>' +
    '<li>10.5. The teacher submits the form.</li>' +
    '<li>10.6. EduNext validates the input (mandatory fields present, deadline in the future, no duplicate question in the same session).</li>' +
    '<li>10.7. EduNext saves the new question into the question bank of the course.</li>' +
    '<li>10.8. EduNext publishes the question to the chosen class/group and shows the teacher a message confirming the question was added successfully.</li>' +
    '</ol></li>' +
    '<li><b>11. Alternative Flows:</b>' +
    '<ul>' +
    '<li>11.1. <em>Cancel.</em> At any step before 10.5 the teacher chooses Cancel; the use case ends and the question bank is unchanged.</li>' +
    '<li>11.2. <em>Invalid data.</em> At step 10.6 validation fails; EduNext highlights the offending field, shows an error message, and returns to step 10.4 so the teacher can correct the data.</li>' +
    '<li>11.3. <em>Save as draft.</em> At step 10.5 the teacher chooses "Save draft" instead of publishing; the question is stored but is not visible to students until it is published later.</li>' +
    '<li>11.4. <em>Duplicate question detected.</em> At step 10.6 EduNext finds an identical question already in the same session; it warns the teacher, who may edit the content, publish it anyway, or cancel.</li>' +
    '</ul></li>' +
    '<li><b>12. Exceptions:</b>' +
    '<ul>' +
    '<li>12.1. Save failure: EduNext cannot write the question to the database; it shows an error, keeps the entered content in the form, and asks the teacher to try again later.</li>' +
    '<li>12.2. Session expired: the teacher\'s login has timed out during data entry; EduNext asks the teacher to sign in again and restores the entered content.</li>' +
    '<li>12.3. Class list unavailable: the FAP system cannot be reached while the target class is being selected; EduNext shows the last imported list and warns that it may be out of date.</li>' +
    '</ul></li>' +
    '<li><b>13. Priority:</b> High — without questions there is nothing for students to answer, so the whole constructivism flow of EduNext depends on this use case.</li>' +
    '<li><b>14. Frequency of Use:</b> Daily — every teacher adds questions for each session of each class throughout the semester.</li>' +
    '<li><b>15. Business Rules:</b>' +
    '<ul>' +
    '<li>BR-1. A question must be unique inside one course session; the same question must not be repeated in the question bank.</li>' +
    '<li>BR-2. Only the teacher assigned to the course may add a question to that course\'s question bank.</li>' +
    '<li>BR-3. A question must belong to exactly one course session and to at least one class or student group.</li>' +
    '<li>BR-4. The answer deadline of a question must be later than the time the question is published.</li>' +
    '</ul></li>' +
    '<li><b>16. Other Information:</b> The question content is stored with formatting and may carry attachments (images or links). The system logs who added the question and when, because EduNext records the interaction data of the class. The use case is web-only in version 1.0 — there is no mobile screen for it yet.</li>' +
    '<li><b>17. Assumptions:</b> The teacher knows the subject matter of the course and has a stable internet connection; the student list of the class has already been imported from the FAP system.</li>' +
    '</ul>' +
    '|||' +
    '<p><strong>Mô tả chi tiết use case — Add New Question (EduNext)</strong></p>' +
    '<ul>' +
    '<li><b>1. UC ID and Name:</b> UC-04 Add New Question</li>' +
    '<li><b>2. Created By:</b> Nguyen Van A (kỹ sư yêu cầu) — đúng người soạn đã ghi trên trang bìa SRS ở Câu 1.</li>' +
    '<li><b>3. Date Created:</b> 06/03/2023 — trùng ngày trên trang bìa SRS.</li>' +
    '<li><b>4. Primary Actor:</b> Teacher (giảng viên của lớp). Đây đúng là đáp án đã trả lời ở Câu 2, ý 6.</li>' +
    '<li><b>5. Secondary Actors:</b> Student (sinh viên) — câu hỏi được công bố tới sinh viên của lớp/nhóm đã chọn, họ là bên nhận kết quả của use case. Hệ thống FAP là tác nhân phụ tiếp theo nếu cần làm mới danh sách lớp và sinh viên trong lúc chọn lớp đích.</li>' +
    '<li><b>6. Trigger:</b> Giảng viên cần một câu hỏi thảo luận mới cho một buổi học, và chọn "Add New Question" trong ngân hàng câu hỏi của môn đó trên EduNext.</li>' +
    '<li><b>7. Description:</b> Use case này cho phép giảng viên thêm một câu hỏi mới vào ngân hàng câu hỏi của một môn trên EduNext, để sinh viên của lớp/nhóm được chọn trả lời theo luồng học kiến tạo.</li>' +
    '<li><b>8. Preconditions:</b>' +
    '<ul>' +
    '<li>8.1. Giảng viên đã đăng nhập EduNext bằng tài khoản @fpt.edu.vn hợp lệ.</li>' +
    '<li>8.2. Giảng viên có quyền trên môn học có ngân hàng câu hỏi đang được sửa.</li>' +
    '<li>8.3. Môn học, lớp và danh sách sinh viên của lớp đã tồn tại trong EduNext (nhập từ hệ thống FAP).</li>' +
    '</ul></li>' +
    '<li><b>9. Postconditions:</b>' +
    '<ul>' +
    '<li>9.1. Thành công: câu hỏi mới được lưu vào ngân hàng câu hỏi của môn và xuất hiện trong danh sách câu hỏi (use case Display Questions).</li>' +
    '<li>9.2. Thành công: câu hỏi hiển thị và có thể trả lời được với sinh viên của lớp/nhóm đã chọn, và EduNext xác nhận với giảng viên là đã thêm xong.</li>' +
    '<li>9.3. Thất bại: không lưu gì cả; ngân hàng câu hỏi giữ nguyên và EduNext hiện lý do.</li>' +
    '</ul></li>' +
    '<li><b>10. Normal Flow:</b>' +
    '<ol>' +
    '<li>10.1. Giảng viên đăng nhập EduNext và chọn môn học.</li>' +
    '<li>10.2. Giảng viên mở ngân hàng câu hỏi của môn đó và chọn "Add New Question".</li>' +
    '<li>10.3. EduNext hiển thị biểu mẫu thêm câu hỏi (nội dung câu hỏi, buổi/slot, lớp hoặc nhóm áp dụng, hạn trả lời, tệp đính kèm).</li>' +
    '<li>10.4. Giảng viên nhập nội dung câu hỏi và các thông tin kèm theo.</li>' +
    '<li>10.5. Giảng viên gửi biểu mẫu.</li>' +
    '<li>10.6. EduNext kiểm tra dữ liệu (đủ trường bắt buộc, hạn trả lời ở tương lai, không trùng câu hỏi trong cùng buổi).</li>' +
    '<li>10.7. EduNext lưu câu hỏi mới vào ngân hàng câu hỏi của môn.</li>' +
    '<li>10.8. EduNext công bố câu hỏi tới lớp/nhóm đã chọn và hiện thông báo xác nhận đã thêm câu hỏi thành công.</li>' +
    '</ol></li>' +
    '<li><b>11. Alternative Flows:</b>' +
    '<ul>' +
    '<li>11.1. <em>Huỷ.</em> Ở bất kỳ bước nào trước 10.5, giảng viên chọn Cancel; use case kết thúc và ngân hàng câu hỏi không đổi.</li>' +
    '<li>11.2. <em>Dữ liệu không hợp lệ.</em> Ở bước 10.6 kiểm tra thất bại; EduNext tô sáng trường sai, hiện thông báo lỗi, và quay về bước 10.4 để giảng viên sửa.</li>' +
    '<li>11.3. <em>Lưu nháp.</em> Ở bước 10.5 giảng viên chọn "Save draft" thay vì công bố; câu hỏi được lưu nhưng sinh viên chưa thấy cho tới khi công bố sau.</li>' +
    '<li>11.4. <em>Phát hiện câu hỏi trùng.</em> Ở bước 10.6 EduNext thấy đã có câu hỏi y hệt trong cùng buổi; hệ thống cảnh báo, giảng viên có thể sửa nội dung, vẫn công bố, hoặc huỷ.</li>' +
    '</ul></li>' +
    '<li><b>12. Exceptions:</b>' +
    '<ul>' +
    '<li>12.1. Lỗi khi lưu: EduNext không ghi được câu hỏi xuống CSDL; hệ thống báo lỗi, giữ nguyên nội dung đã nhập trong biểu mẫu, và đề nghị thử lại sau.</li>' +
    '<li>12.2. Hết phiên đăng nhập: phiên của giảng viên hết hạn trong lúc nhập liệu; EduNext yêu cầu đăng nhập lại và khôi phục nội dung đã nhập.</li>' +
    '<li>12.3. Không lấy được danh sách lớp: không kết nối được hệ thống FAP khi chọn lớp đích; EduNext hiện danh sách đã nhập lần cuối và cảnh báo dữ liệu có thể cũ.</li>' +
    '</ul></li>' +
    '<li><b>13. Priority:</b> High (cao) — không có câu hỏi thì sinh viên không có gì để trả lời, nên toàn bộ luồng học kiến tạo của EduNext phụ thuộc vào use case này.</li>' +
    '<li><b>14. Frequency of Use:</b> Daily (hằng ngày) — mỗi giảng viên thêm câu hỏi cho từng buổi của từng lớp suốt học kỳ.</li>' +
    '<li><b>15. Business Rules:</b>' +
    '<ul>' +
    '<li>BR-1. Câu hỏi phải duy nhất trong một buổi học của môn; không được lặp lại cùng một câu hỏi trong ngân hàng.</li>' +
    '<li>BR-2. Chỉ giảng viên được phân công môn học mới được thêm câu hỏi vào ngân hàng của môn đó.</li>' +
    '<li>BR-3. Mỗi câu hỏi phải thuộc đúng một buổi học và ít nhất một lớp hoặc nhóm sinh viên.</li>' +
    '<li>BR-4. Hạn trả lời của câu hỏi phải muộn hơn thời điểm công bố câu hỏi.</li>' +
    '</ul></li>' +
    '<li><b>16. Other Information:</b> Nội dung câu hỏi được lưu kèm định dạng và có thể có tệp đính kèm (ảnh hoặc liên kết). Hệ thống ghi nhật ký ai thêm câu hỏi và thêm lúc nào, vì EduNext có nhiệm vụ ghi lại dữ liệu tương tác của lớp. Ở phiên bản 1.0, use case này chỉ có trên web — chưa có màn hình di động.</li>' +
    '<li><b>17. Assumptions:</b> Giảng viên nắm chuyên môn của môn học và có kết nối internet ổn định; danh sách sinh viên của lớp đã được nhập từ hệ thống FAP.</li>' +
    '</ul>',
  explanation:
    '<p><b>Five corrections to the student key on this question.</b></p>' +
    '<p><b>(1) Primary Actor.</b> The key writes "Content Creator/Administrator". No such role exists anywhere in this paper — the paper names Students, Teachers and the FAP system, and it prints the rule that off-paper keywords score ZERO. It is also self-contradictory: the same student answered "Teachers" for the primary actor of Add New Question back in Question 2. Corrected to <b>Teacher</b>.</p>' +
    '<p><b>(2) Secondary Actors.</b> The key writes "None" here while answering "Students" in Question 2 — the two questions describe the same use case, so they cannot disagree. This deck answers <b>Student</b> in both places and explains the strict-UML alternative, so the answer is defensible under either reading.</p>' +
    '<p><b>(3) Date Created.</b> The key writes 06/03/2022 while its own SRS title page in Question 1 says 06/03/2023. A one-year gap between the SRS and the use case it contains is exactly the kind of inconsistency this field is priced to catch. Corrected to <b>06/03/2023</b>.</p>' +
    '<p><b>(4) Normal Flow numbering.</b> The key numbers its steps 10.1, 10.2, 10.3, 10.5, 10.6, 10.7 — <b>10.4 is missing</b>, which reads as a lost step rather than a typo, and the alternative flows have nothing to branch back to. This deck renumbers continuously (10.1 to 10.8) and inserts the missing "teacher enters the content" step so 11.2 has a step to return to.</p>' +
    '<p><b>(5) Other Information.</b> The blank version of the paper prices this field at 0.1, but the key never writes it — that mark is simply dropped. Added here.</p>' +
    '<p><b>Also strengthened:</b> the key gives a single business rule ("questions should be unique"). Four rules are given here, all derivable from the paper (uniqueness, teacher authorisation, question belongs to a session and a class/group, deadline after publication). And the exception list is extended from one to three, since the field is worth 0.3 and one exception is thin for that.</p>' +
    '|||' +
    '<p><b>Năm chỗ sửa so với key sinh viên ở câu này.</b></p>' +
    '<p><b>(1) Primary Actor.</b> Key ghi "Content Creator/Administrator". Không có vai nào như vậy trong đề — đề chỉ nêu Students, Teachers và hệ thống FAP, lại in rõ quy định từ khoá ngoài đề bị 0 ĐIỂM. Nó còn tự mâu thuẫn: chính sinh viên đó đã trả lời "Teachers" cho tác nhân chính của Add New Question ở Câu 2. Đã sửa về <b>Teacher</b>.</p>' +
    '<p><b>(2) Secondary Actors.</b> Key ghi "None" ở đây trong khi trả lời "Students" ở Câu 2 — hai câu cùng nói về một use case nên không thể vênh nhau. Deck trả lời <b>Student</b> ở cả hai chỗ và nêu thêm phương án theo UML chặt, để đáp án đứng vững ở cả hai cách đọc.</p>' +
    '<p><b>(3) Date Created.</b> Key ghi 06/03/2022 trong khi chính trang bìa SRS ở Câu 1 của nó ghi 06/03/2023. Lệch một năm giữa tài liệu SRS và use case nằm trong nó đúng là loại mâu thuẫn mà trường này được chấm điểm để bắt. Đã sửa về <b>06/03/2023</b>.</p>' +
    '<p><b>(4) Đánh số Normal Flow.</b> Key đánh số 10.1, 10.2, 10.3, 10.5, 10.6, 10.7 — <b>thiếu 10.4</b>, đọc lên giống mất hẳn một bước chứ không như lỗi gõ, và luồng thay thế không có bước nào để quay về. Deck đánh số liên tục (10.1 tới 10.8) và chèn lại bước "giảng viên nhập nội dung" để 11.2 có chỗ quay về.</p>' +
    '<p><b>(5) Other Information.</b> Bản đề trắng chấm trường này 0,1 điểm nhưng key không viết gì — mất trắng điểm đó. Deck đã bổ sung.</p>' +
    '<p><b>Bổ sung thêm:</b> key chỉ nêu một business rule ("câu hỏi phải duy nhất"). Ở đây nêu bốn quy tắc, đều suy được từ đề (tính duy nhất, quyền của giảng viên, câu hỏi thuộc một buổi và một lớp/nhóm, hạn trả lời sau thời điểm công bố). Danh sách ngoại lệ cũng tăng từ một lên ba, vì trường này đáng 0,3 điểm mà một ngoại lệ là quá mỏng.</p>',
  rubric: [
    {
      id: 'c1_header',
      criterion:
        'Header fields correct and mutually consistent: UC ID and Name (0.1), Created By (0.1), Date Created matching the SRS title page from Question 1 (0.1), Primary Actor = Teacher (0.2), Secondary Actors named and justified (0.2), Trigger written as the concrete event that starts the use case (0.3), Description (0.1).|||Các trường đầu đúng và nhất quán với nhau: UC ID and Name (0,1), Created By (0,1), Date Created khớp trang bìa SRS ở Câu 1 (0,1), Primary Actor = Teacher (0,2), Secondary Actors có nêu và có lý giải (0,2), Trigger viết đúng dạng sự kiện cụ thể khởi động use case (0,3), Description (0,1).',
      weight: 1,
      maxScore: 1.1,
    },
    {
      id: 'c2_conditions',
      criterion:
        'Preconditions are things that must be true before the use case starts — signed in with @fpt.edu.vn, authorised for the course, class data present (0.3). Postconditions state the system state after success and after failure (0.3).|||Preconditions là những điều phải đúng TRƯỚC khi use case chạy — đã đăng nhập @fpt.edu.vn, có quyền trên môn học, đã có dữ liệu lớp (0,3). Postconditions nêu trạng thái hệ thống sau khi thành công và sau khi thất bại (0,3).',
      weight: 1,
      maxScore: 0.6,
    },
    {
      id: 'c3_normal_flow',
      criterion:
        'Normal Flow is a continuously numbered actor/system step sequence for adding a question (open the bank, open the form, enter content, submit, validate, save, publish and confirm) with no gap in the numbering.|||Normal Flow là chuỗi bước tác nhân/hệ thống đánh số liên tục để thêm câu hỏi (mở ngân hàng, mở biểu mẫu, nhập nội dung, gửi, kiểm tra, lưu, công bố và xác nhận), không đứt quãng số thứ tự.',
      weight: 1,
      maxScore: 0.7,
    },
    {
      id: 'c4_alt_exceptions',
      criterion:
        'At least two alternative flows, each branching from a named step of the normal flow and returning to one (cancel, invalid data, draft, duplicate) (0.7); at least one exception describing a system failure and its recovery (0.3).|||Có ít nhất hai luồng thay thế, mỗi luồng rẽ nhánh từ một bước có tên trong luồng chính và quay về một bước (huỷ, dữ liệu sai, lưu nháp, trùng câu hỏi) (0,7); có ít nhất một ngoại lệ mô tả sự cố hệ thống và cách khắc phục (0,3).',
      weight: 1,
      maxScore: 1,
    },
    {
      id: 'c5_metadata',
      criterion:
        'Remaining fields all filled and specific to EduNext: Priority (0.1), Frequency of Use (0.1), Business Rules (0.2), Other Information (0.1) and Assumptions (0.1) — none left blank.|||Các trường còn lại đều được điền và gắn với EduNext: Priority (0,1), Frequency of Use (0,1), Business Rules (0,2), Other Information (0,1) và Assumptions (0,1) — không bỏ trống trường nào.',
      weight: 1,
      maxScore: 0.6,
    },
  ],
};

/* ────────────────────────────── Câu 4 ────────────────────────────── */
const q4 = {
  kind: 'WRITE',
  points: 1,
  prompt:
    '<p><b>Question 4 (1 point).</b> Write 2 non-functional requirements for EduNext.</p>' +
    '<ul>' +
    '<li><b>(a)</b> State the term of the <strong>most important</strong> non-functional requirement, and write at least 2 statements for it. Each statement should be specific in number, and you must explain the number so that a tester can test the software and conclude that the test is passed or failed. <em>(0.5)</em></li>' +
    '<li><b>(b)</b> State the term of the <strong>second most important</strong> non-functional requirement, with at least 2 statements under the same rule. <em>(0.5)</em></li>' +
    '</ul>' +
    '|||' +
    '<p><b>Câu 4 (1 điểm).</b> Viết 2 yêu cầu phi chức năng cho EduNext.</p>' +
    '<ul>' +
    '<li><b>(a)</b> Nêu tên yêu cầu phi chức năng <strong>quan trọng nhất</strong>, và viết ít nhất 2 phát biểu cho nó. Mỗi phát biểu phải cụ thể về con số, và bạn phải giải thích con số đó để người kiểm thử có thể kiểm tra phần mềm và kết luận đạt hay không đạt. <em>(0,5)</em></li>' +
    '<li><b>(b)</b> Nêu tên yêu cầu phi chức năng <strong>quan trọng thứ hai</strong>, kèm ít nhất 2 phát biểu theo cùng quy định. <em>(0,5)</em></li>' +
    '</ul>',
  sampleSolution:
    '<p><strong>(a) NFR #1 — Performance</strong></p>' +
    '<ul>' +
    '<li><b>P1.</b> EduNext shall load a question page and its answer thread within <b>3 seconds</b> for <b>95%</b> of requests when <b>2,000 students are online concurrently</b>. <em>Why these numbers:</em> a discussion slot at FPT University typically opens for several classes at the same time, so 2,000 concurrent students is the realistic peak; 3 seconds is the point past which students start re-clicking. <em>How a tester concludes pass/fail:</em> run a load test with 2,000 virtual users opening question pages, record every response time, sort them, and read the 95th percentile — pass if it is &le; 3 s, fail otherwise.</li>' +
    '<li><b>P2.</b> EduNext shall accept and store a submitted answer within <b>2 seconds</b>, and shall import a student list of <b>1,000 records</b> from the FAP system within <b>60 seconds</b>. <em>Why these numbers:</em> answer submission happens under exam-like time pressure so it must feel immediate; a 1,000-record import covers a whole semester intake of one campus and is run rarely, so a minute is acceptable. <em>How a tester concludes pass/fail:</em> submit 200 answers and measure each round trip (pass if all &le; 2 s); import a prepared 1,000-row file three times and time it (pass if every run &le; 60 s and all 1,000 rows land in the student list).</li>' +
    '</ul>' +
    '<p><strong>(b) NFR #2 — Security</strong></p>' +
    '<ul>' +
    '<li><b>S1.</b> EduNext shall allow sign-in <b>only</b> with an @fpt.edu.vn email account, and shall reject <b>100%</b> of sign-in attempts from any other email domain. <em>Why this number:</em> the paper states that students and teachers sign in using @fpt.edu.vn accounts, so any accepted non-FPT account is a breach, not a degradation — the threshold is therefore 100% and not 99%. <em>How a tester concludes pass/fail:</em> attempt to sign in with 50 accounts from other domains (gmail.com, outlook.com, a look-alike such as fpt.edu.vn.attacker.com); pass only if all 50 are rejected and none creates a session.</li>' +
    '<li><b>S2.</b> EduNext shall lock an account for <b>15 minutes</b> after <b>5</b> consecutive failed sign-in attempts, and shall end an idle session after <b>30 minutes</b>. <em>Why these numbers:</em> 5 attempts leave room for ordinary typing mistakes while making password guessing impractical; a 15-minute lock and a 30-minute idle timeout protect a shared lab computer that a student walks away from. <em>How a tester concludes pass/fail:</em> fail the password 5 times and check that the 6th attempt is refused with the correct password and that access returns after 15 minutes; sign in, leave the session idle for 31 minutes, and check that the next action requires signing in again.</li>' +
    '</ul>' +
    '<p><strong>Why these two, in this order.</strong> Performance comes first because EduNext\'s whole model is many students of a class interacting on the same question at the same time — if the page is slow at peak, the constructivism learning flow itself fails. Security comes second because EduNext holds the student list imported from FAP and records every interaction of identifiable students, so account control is what keeps that data with the right people.</p>' +
    '|||' +
    '<p><strong>(a) NFR #1 — Hiệu năng (Performance)</strong></p>' +
    '<ul>' +
    '<li><b>P1.</b> EduNext phải tải trang câu hỏi và luồng câu trả lời trong vòng <b>3 giây</b> cho <b>95%</b> số lượt truy cập khi có <b>2.000 sinh viên trực tuyến đồng thời</b>. <em>Vì sao chọn con số này:</em> một buổi thảo luận ở Đại học FPT thường mở cho nhiều lớp cùng lúc, nên 2.000 sinh viên đồng thời là đỉnh thực tế; 3 giây là mốc mà quá đó sinh viên bắt đầu bấm lại. <em>Người kiểm thử kết luận đạt/không đạt thế nào:</em> chạy load test với 2.000 người dùng ảo mở trang câu hỏi, ghi mọi thời gian phản hồi, sắp xếp, rồi đọc phân vị 95 — đạt nếu &le; 3 giây, không đạt nếu ngược lại.</li>' +
    '<li><b>P2.</b> EduNext phải nhận và lưu một câu trả lời đã gửi trong vòng <b>2 giây</b>, và phải nhập danh sách <b>1.000 sinh viên</b> từ hệ thống FAP trong vòng <b>60 giây</b>. <em>Vì sao chọn con số này:</em> việc gửi câu trả lời diễn ra dưới áp lực thời gian như đi thi nên phải cảm giác tức thì; một lượt nhập 1.000 bản ghi đủ cho cả đợt tuyển sinh một cơ sở và rất ít khi chạy, nên một phút là chấp nhận được. <em>Người kiểm thử kết luận đạt/không đạt thế nào:</em> gửi 200 câu trả lời và đo từng vòng (đạt nếu tất cả &le; 2 giây); nhập một file 1.000 dòng đã chuẩn bị ba lần và bấm giờ (đạt nếu mọi lần &le; 60 giây và cả 1.000 dòng vào đúng danh sách sinh viên).</li>' +
    '</ul>' +
    '<p><strong>(b) NFR #2 — Bảo mật (Security)</strong></p>' +
    '<ul>' +
    '<li><b>S1.</b> EduNext <b>chỉ</b> cho đăng nhập bằng tài khoản email @fpt.edu.vn, và phải từ chối <b>100%</b> lượt đăng nhập từ mọi tên miền email khác. <em>Vì sao là con số này:</em> đề nêu rõ sinh viên và giảng viên đăng nhập bằng tài khoản @fpt.edu.vn, nên bất kỳ tài khoản ngoài FPT nào được chấp nhận đều là lỗ hổng chứ không phải suy giảm chất lượng — vì thế ngưỡng là 100% chứ không phải 99%. <em>Người kiểm thử kết luận đạt/không đạt thế nào:</em> thử đăng nhập với 50 tài khoản thuộc tên miền khác (gmail.com, outlook.com, và một tên miền nhái như fpt.edu.vn.attacker.com); chỉ đạt nếu cả 50 đều bị từ chối và không lượt nào tạo được phiên.</li>' +
    '<li><b>S2.</b> EduNext phải khoá tài khoản <b>15 phút</b> sau <b>5</b> lần đăng nhập sai liên tiếp, và phải kết thúc phiên không hoạt động sau <b>30 phút</b>. <em>Vì sao chọn con số này:</em> 5 lần đủ chỗ cho lỗi gõ nhầm thông thường nhưng khiến việc dò mật khẩu bất khả thi; khoá 15 phút và hết phiên sau 30 phút bảo vệ máy phòng lab dùng chung khi sinh viên bỏ đi. <em>Người kiểm thử kết luận đạt/không đạt thế nào:</em> nhập sai mật khẩu 5 lần rồi kiểm tra lần thứ 6 bị từ chối dù mật khẩu đúng, và sau 15 phút thì vào lại được; đăng nhập, để phiên yên 31 phút, rồi kiểm tra thao tác kế tiếp có bắt đăng nhập lại không.</li>' +
    '</ul>' +
    '<p><strong>Vì sao chọn hai loại này và theo thứ tự này.</strong> Hiệu năng đứng trước vì toàn bộ mô hình của EduNext là nhiều sinh viên một lớp cùng tương tác trên một câu hỏi vào cùng thời điểm — trang chậm lúc cao điểm thì chính luồng học kiến tạo hỏng. Bảo mật đứng thứ hai vì EduNext giữ danh sách sinh viên nhập từ FAP và ghi lại mọi tương tác của những sinh viên định danh được, nên kiểm soát tài khoản là thứ giữ dữ liệu đó ở đúng người.</p>',
  explanation:
    '<p><b>Half of this question is missing from the student key.</b> The filled-in document writes part (a) — Performance, with two statements and their explanations — and then types only the heading "b. Security:" and stops. Part (b) is worth 0.5 of the 1.0, so the key as it stands scores at most half this question. This deck writes part (b) out in full.</p>' +
    '<p><b>The part (a) numbers were also re-anchored.</b> The key asks for "1000 transactions per minute" and "10,000 concurrent users" — numbers that are testable but belong to no particular system; the paper\'s own rule is that answers must reflect <em>this</em> exam paper. The statements here are tied to EduNext\'s actual load story (a discussion slot opened for several classes at once, a student list imported from FAP), which is what makes the numbers explainable rather than merely large.</p>' +
    '<p><b>What the grader is really checking</b> is not the size of the number but whether a tester could act on it. Each statement above therefore carries three parts: the threshold, why that threshold, and the measurement procedure that produces a pass or a fail. A statement such as "the system must be fast and secure" scores zero here no matter how true it is, because there is nothing to measure.</p>' +
    '<p><b>One caution on the 100% figure in S1.</b> Percentage thresholds below 100 are normal for performance and availability, but a security boundary is pass/fail by nature — accepting one non-FPT account out of a hundred is a breach, not a 99% success. That is why S1 is the one statement in this answer where 100% is the right threshold.</p>' +
    '|||' +
    '<p><b>Một nửa câu này bị thiếu trong key sinh viên.</b> Bản đã điền viết phần (a) — Hiệu năng, hai phát biểu kèm giải thích — rồi chỉ gõ đúng tiêu đề "b. Security:" và dừng. Phần (b) đáng 0,5 trên tổng 1,0, nên key như hiện có nhiều nhất chỉ được nửa câu. Deck đã viết đầy đủ phần (b).</p>' +
    '<p><b>Các con số ở phần (a) cũng được neo lại.</b> Key nêu "1000 giao dịch mỗi phút" và "10.000 người dùng đồng thời" — những con số kiểm thử được nhưng không thuộc về hệ thống cụ thể nào; trong khi chính đề quy định câu trả lời phải phản ánh <em>đề này</em>. Các phát biểu ở đây gắn với câu chuyện tải thật của EduNext (một buổi thảo luận mở cho nhiều lớp cùng lúc, danh sách sinh viên nhập từ FAP), và đó mới là thứ khiến con số giải thích được chứ không chỉ là con số to.</p>' +
    '<p><b>Điều người chấm thật sự soi</b> không phải con số to cỡ nào mà là người kiểm thử có làm gì được với nó không. Vì thế mỗi phát biểu ở trên gồm ba phần: ngưỡng, vì sao là ngưỡng đó, và quy trình đo cho ra kết luận đạt hay không đạt. Một phát biểu kiểu "hệ thống phải nhanh và bảo mật" ở đây được 0 điểm dù đúng đến mấy, vì không có gì để đo.</p>' +
    '<p><b>Một lưu ý về con số 100% ở S1.</b> Ngưỡng phần trăm dưới 100 là bình thường với hiệu năng và tính sẵn sàng, nhưng ranh giới bảo mật thì bản chất là đạt/không đạt — chấp nhận một tài khoản ngoài FPT trên một trăm lượt là lỗ hổng chứ không phải thành công 99%. Đó là lý do S1 là phát biểu duy nhất trong câu trả lời này lấy ngưỡng 100%.</p>',
  rubric: [
    {
      id: 'c1_nfr1',
      criterion:
        'NFR (a) named with a proper quality-attribute term (e.g. Performance) and given >= 2 statements, each carrying a specific number, an explanation of why that number, and a measurement a tester can run to conclude pass or fail — all tied to EduNext.|||NFR (a) gọi đúng tên một thuộc tính chất lượng (vd Hiệu năng) và có >= 2 phát biểu, mỗi phát biểu có con số cụ thể, giải thích vì sao là con số đó, và cách đo mà người kiểm thử chạy được để kết luận đạt hay không đạt — tất cả gắn với EduNext.',
      weight: 1,
      maxScore: 0.5,
    },
    {
      id: 'c2_nfr2',
      criterion:
        'NFR (b) is a different quality attribute from (a) (e.g. Security) and is actually written — not just named — with >= 2 number-specific, explained, testable statements tied to EduNext.|||NFR (b) là một thuộc tính chất lượng khác với (a) (vd Bảo mật) và được viết thật sự chứ không chỉ nêu tên — có >= 2 phát biểu cụ thể về số, có giải thích, kiểm thử được và gắn với EduNext.',
      weight: 1,
      maxScore: 0.5,
    },
  ],
};

/* ────────────────────────────── deck ────────────────────────────── */
const spec = {
  course: { courseCode: 'SWR302' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'PE21',
      title:
        'SWR302 — Sample Practice Paper PE21 (Sample PE SWR302 v1.0)|||SWR302 — Đề mẫu thực hành PE21 (Sample PE SWR302 v1.0)',
      description:
        '⚠️ SAMPLE paper ("Sample PE SWR302 v1.0"), NOT the real exam of any specific term — and the answer key that came with the source was written by a student, not by the school. SWR302 PE (WRITE), EduNext context: SRS first page, use case diagram with actors and extend/include relationships, a detailed use case description for Add New Question, and 2 measurable non-functional requirements. AI-graded.' +
        '|||' +
        '⚠️ Đây là ĐỀ MẪU ("Sample PE SWR302 v1.0"), KHÔNG phải đề thi thật của một kỳ cụ thể nào — và KEY đi kèm nguồn là do SINH VIÊN TỰ LÀM, không phải đáp án chính thức của trường. PE SWR302 (viết), bối cảnh EduNext: trang đầu SRS, sơ đồ use case với tác nhân và quan hệ extend/include, mô tả chi tiết use case Add New Question, và 2 yêu cầu phi chức năng đo được. Chấm AI.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      source: 'FUOverflow',
      attachmentUrl: null,
      attachmentName: null,
      instructions,
      isPublished: true,
      questions: [q1, q2, q3, q4],
    },
  ],
};

/* ────────────────────────── kiểm trước khi ghi ────────────────────────── */
const exam = spec.exams[0];

const sum = exam.questions.reduce((s, q) => s + q.points, 0);
if (Math.abs(sum - exam.totalPoints) > 1e-9) {
  throw new Error(`Tổng points câu = ${sum} ≠ totalPoints = ${exam.totalPoints}`);
}
for (const [i, q] of exam.questions.entries()) {
  const r = q.rubric.reduce((s, x) => s + x.maxScore, 0);
  if (Math.abs(r - q.points) > 1e-9) throw new Error(`Q${i + 1}: rubric ${r} ≠ points ${q.points}`);
}

/* Song ngữ: mọi trường văn bản phải có ĐÚNG 0 hoặc 1 dấu "|||".
   instructions dùng ml-en/ml-vi nên phải có ĐÚNG 0. */
const countPipe = (s) => s.split('|||').length - 1;
const checkOne = (label, s) => {
  const n = countPipe(s);
  if (n !== 1) throw new Error(`${label}: có ${n} dấu "|||" (phải đúng 1)`);
};
checkOne('title', exam.title);
checkOne('description', exam.description);
if (countPipe(exam.instructions) !== 0) {
  throw new Error('instructions: phải dùng ml-en/ml-vi và KHÔNG chứa "|||"');
}
for (const tag of ['ml-en', 'ml-vi']) {
  if (!exam.instructions.includes(`class="${tag}"`)) throw new Error(`instructions thiếu khối ${tag}`);
}
for (const [i, q] of exam.questions.entries()) {
  checkOne(`Q${i + 1}.prompt`, q.prompt);
  checkOne(`Q${i + 1}.sampleSolution`, q.sampleSolution);
  checkOne(`Q${i + 1}.explanation`, q.explanation);
  for (const r of q.rubric) checkOne(`Q${i + 1}.rubric[${r.id}]`, r.criterion);
}

/* CẤM markdown trong mọi trường text — chỉ HTML thuần. */
const textFields = [exam.title, exam.description, exam.instructions];
for (const q of exam.questions) {
  textFields.push(q.prompt, q.sampleSolution, q.explanation, ...q.rubric.map((r) => r.criterion));
}
const mdPatterns = [
  [/\*\*/, 'in đậm markdown **'],
  [/(^|\n)\s*#{1,6}\s/, 'tiêu đề markdown #'],
  [/(^|\n)\s*[-*+]\s+\S/, 'gạch đầu dòng markdown'],
  [/```/, 'khối mã markdown ```'],
  [/\[[^\]\n]+\]\([^)\n]+\)/, 'liên kết markdown []()'],
];
for (const [idx, s] of textFields.entries()) {
  for (const [re, name] of mdPatterns) {
    if (re.test(s)) throw new Error(`Trường text #${idx} chứa ${name}`);
  }
}

/* Nhãn "đề mẫu + key tự làm" phải có mặt ở title, description và cả 2 khối
   instructions — đây là yêu cầu bắt buộc của deck này. */
if (!/Sample/i.test(exam.title) || !/mẫu/i.test(exam.title)) {
  throw new Error('title thiếu nhãn "Sample / đề mẫu"');
}
if (!/SAMPLE paper/.test(exam.description) || !/ĐỀ MẪU/.test(exam.description)) {
  throw new Error('description thiếu nhãn đề mẫu song ngữ');
}
if (!/written by a student/.test(exam.description) || !/SINH VIÊN TỰ LÀM/.test(exam.description)) {
  throw new Error('description thiếu nhãn "key tự làm" song ngữ');
}
const enBlock = exam.instructions.split('<div class="ml-vi">')[0];
const viBlock = exam.instructions.split('<div class="ml-vi">')[1] || '';
if (!/SAMPLE paper.*written by a student/s.test(enBlock)) {
  throw new Error('instructions ml-en thiếu đoạn cảnh báo đề mẫu + key tự làm');
}
if (!/ĐỀ MẪU.*SINH VIÊN TỰ LÀM/s.test(viBlock)) {
  throw new Error('instructions ml-vi thiếu đoạn cảnh báo đề mẫu + key tự làm');
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(
  `✓ ${OUT} — PE/WRITE ${exam.questions.length} câu, ` +
    `${exam.questions.map((q) => q.points).join(' + ')} = ${sum}/${exam.totalPoints} điểm`,
);
