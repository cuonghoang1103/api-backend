/**
 * SWT301 · Chapter 6 — Experience-based techniques (+ choosing techniques).
 * Source: SWT4_tim.pptx visible slides 100–112 (from the CONTENTS slide that
 * opens "Experience-based Test Techniques" to the end of the deck), the
 * teacher's speaker notes on slides 101–105 and 111–112, and the HIDDEN
 * pptx slides 114–115 (internal / external factors — summarised in text).
 * Lesson split:
 *   6.1 Error guessing, exploratory, checklist-based   swt4 100–108
 *   6.2 Choosing test techniques                        swt4 109–112 (+ hidden 114, 115)
 * The checklist example uses the course template
 * 01.Materials/…/CheckList_UT_Blackbox_UI.xlsx; the error-guessing and
 * exploratory examples use the FA23 PE form "Tạo quyết định kiểm tra".
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt4';
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });

/* ─────────────── 6.1 Error guessing, exploratory & checklist-based ─────────────── */
const L61 = {
  title: '6.1 — Experience-based techniques: error guessing, exploratory & checklist-based testing|||6.1 — Kỹ thuật dựa kinh nghiệm: error guessing, exploratory & checklist-based',
  slug: 'swt301-experience-based',
  type: 'VIDEO',
  description: 'SWT4 slide 100–108: kỹ thuật dựa kinh nghiệm, error guessing (danh sách tấn công lỗi), exploratory testing có charter + phiên (session-based) có phiếu ghi mẫu, checklist-based testing theo checklist của môn — kèm đáp án 3 câu hỏi.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.1 · SWT4 slides 100–108</span>
<h2>Experience-based techniques — the tester's knowledge as the test basis</h2>
<p class="lead">Black-box techniques take their tests from a specification, white-box techniques from the code. <strong>Experience-based</strong> techniques take them from the <strong>tester's skill, intuition and experience</strong> with similar applications, technologies and past failures. The syllabus names three: <strong>error guessing</strong>, <strong>exploratory testing</strong> and <strong>checklist-based testing</strong>. They find defects the systematic techniques miss — but their coverage is hard to measure, so they <em>complement</em> the systematic techniques rather than replace them.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.4.1 Explain error guessing (K2) · LO-4.4.2 Explain exploratory testing (K2) · LO-4.4.3 Explain checklist-based testing (K2) · and the experience-based part of LO-4.1.1 (characteristics of the three technique categories, K2). All three are K2: expect "which statement is true/best describes…" questions, not calculations.</div>
<h3>The three techniques side by side</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Error guessing</th><th>Exploratory testing</th><th>Checklist-based testing</th></tr></thead>
<tbody>
<tr><td>Where the tests come from</td><td>A list of likely mistakes, defects and failures</td><td>Learning the system while testing it; each result shapes the next test</td><td>The items / test conditions of a checklist</td></tr>
<tr><td>How much is written in advance</td><td>The attack list</td><td>Only a charter (mission) and a time-box</td><td>The checklist — high-level, not step-by-step</td></tr>
<tr><td>Best when</td><td>Always, as a complement; past defect data exists</td><td>Few or poor specifications, significant time pressure</td><td>A stable area checked repeatedly; guiding less experienced testers</td></tr>
<tr><td>Main weakness</td><td>Depends heavily on the tester</td><td>Hard to reproduce and to measure unless well logged</td><td>High-level items → results vary between testers</td></tr>
</tbody>
</table></div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.1 · SWT4 slide 100–108</span>
<h2>Kỹ thuật dựa kinh nghiệm — kiến thức của tester chính là test basis</h2>
<p class="lead">Kỹ thuật black-box lấy test từ đặc tả, white-box lấy từ code. Kỹ thuật <strong>dựa kinh nghiệm</strong> lấy test từ <strong>kỹ năng, trực giác và kinh nghiệm của tester</strong> với các ứng dụng, công nghệ tương tự và những lần hỏng hóc trước đây. Syllabus nêu ba kỹ thuật: <strong>error guessing</strong> (đoán lỗi), <strong>exploratory testing</strong> (kiểm thử khám phá) và <strong>checklist-based testing</strong> (kiểm thử theo checklist). Chúng tìm được defect mà kỹ thuật hệ thống bỏ sót — nhưng coverage của chúng khó đo, nên chúng <em>bổ sung</em> cho kỹ thuật hệ thống chứ không thay thế.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.4.1 Giải thích error guessing (K2) · LO-4.4.2 Giải thích exploratory testing (K2) · LO-4.4.3 Giải thích checklist-based testing (K2) · và phần dựa kinh nghiệm của LO-4.1.1 (đặc điểm của ba nhóm kỹ thuật, K2). Cả ba đều là K2: hãy chờ câu hỏi dạng "phát biểu nào đúng/mô tả đúng nhất…", không phải bài tính.</div>
<h3>Ba kỹ thuật đặt cạnh nhau</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Error guessing</th><th>Exploratory testing</th><th>Checklist-based testing</th></tr></thead>
<tbody>
<tr><td>Test lấy từ đâu</td><td>Danh sách sai sót, defect và failure có khả năng xảy ra</td><td>Vừa test vừa học hệ thống; mỗi kết quả định hướng test kế tiếp</td><td>Các mục / điều kiện test trong checklist</td></tr>
<tr><td>Viết trước bao nhiêu</td><td>Danh sách tấn công</td><td>Chỉ một charter (nhiệm vụ) và một khung thời gian</td><td>Checklist — ở mức khái quát, không phải từng bước</td></tr>
<tr><td>Phù hợp nhất khi</td><td>Luôn dùng được, như phần bổ sung; có dữ liệu lỗi cũ</td><td>Đặc tả ít hoặc kém, áp lực thời gian lớn</td><td>Vùng ổn định được kiểm lặp lại; hướng dẫn tester ít kinh nghiệm</td></tr>
<tr><td>Điểm yếu chính</td><td>Phụ thuộc rất nhiều vào người test</td><td>Khó lặp lại và khó đo nếu không ghi chép tốt</td><td>Mục khái quát → mỗi tester làm ra kết quả khác nhau</td></tr>
</tbody>
</table></div>`),
    walkHead(D, 100, 108, 'Slides 101–105 carry speaker notes that are a Vietnamese translation of the slide text; they are quoted where they help.', 'Slide 101–105 có ghi chú của thầy/cô là bản dịch tiếng Việt của chính nội dung slide; bài này dẫn lại khi có ích.'),
    walk(D, [
      [100, 'CONTENTS — Experience-based Test Techniques',
        `<p>The last block of SWT4: <strong>Experience-based Test Techniques</strong> is highlighted. After the three techniques and their questions (slides 101–108) the deck ends with "Choosing Test Techniques" (slides 109–112), which this site teaches separately as lesson 6.2. In the CTFL 2018 syllabus experience-based techniques are §4.4, and choosing techniques is part of §4.1.</p>`,
        `<p>Khối cuối của SWT4: <strong>Experience-based Test Techniques</strong> được tô. Sau ba kỹ thuật và các câu hỏi (slide 101–108) bộ slide kết thúc bằng "Choosing Test Techniques" (slide 109–112), trang này dạy riêng thành bài 6.2. Trong syllabus CTFL 2018, kỹ thuật dựa kinh nghiệm là §4.4, còn việc chọn kỹ thuật thuộc §4.1.</p>`],
      [101, 'Experience-based techniques — definition',
        `<p>Four statements, all exam material: (1) test cases are derived from the <strong>tester's skill and intuition</strong> and their <strong>experience with similar applications and technologies</strong>; (2) they can find tests "<strong>not easily identified by other more systematic techniques</strong>"; (3) depending on the tester's approach and experience they achieve <strong>widely varying degrees of coverage and effectiveness</strong>; (4) <strong>coverage can be difficult to assess and may be unmeasurable</strong>. The gauge picture ("Experience-based testing", needle towards Maximum) says the same thing: the result is only as good as the experience behind it.</p>
<p>The teacher's notes are a Vietnamese rendering of these bullets; where the machine translation says "thử nghiệm" or even "xét nghiệm" (a medical test), read it simply as <em>test</em>.</p>`,
        `<p>Bốn phát biểu, đều là kiến thức thi: (1) test case được rút ra từ <strong>kỹ năng và trực giác của tester</strong> cùng <strong>kinh nghiệm của họ với các ứng dụng và công nghệ tương tự</strong>; (2) chúng có thể tìm ra những test "<strong>không dễ nhận ra bằng các kỹ thuật hệ thống hơn</strong>"; (3) tuỳ cách làm và kinh nghiệm của tester, chúng đạt <strong>mức coverage và hiệu quả rất khác nhau</strong>; (4) <strong>coverage có thể khó đánh giá và có thể không đo được</strong>. Hình đồng hồ ("Experience-based testing", kim chỉ về phía Maximum) nói cùng một ý: kết quả chỉ tốt bằng lượng kinh nghiệm đứng sau nó.</p>
<p>Ghi chú của thầy/cô là bản dịch tiếng Việt của các gạch đầu dòng này; chỗ nào bản dịch máy ghi "thử nghiệm" hay thậm chí "xét nghiệm" (xét nghiệm y tế), hãy hiểu đơn giản là <em>test</em>.</p>`],
      [102, 'Error Guessing',
        `<p>Error guessing is <em>not</em> random guessing. The "methodical approach" in red: <strong>create a list of possible mistakes, defects and failures → design tests that will expose those failures and the defects that caused them</strong>. This list is often called a <em>fault attack</em> list. It is built from <strong>experience</strong>, <strong>defect and failure data</strong> (e.g. the bug tracker of the previous release), or <strong>common knowledge about why software fails</strong>. The syllabus adds three sources of anticipation: how the application has worked in the past, what kinds of errors developers tend to make, and failures seen in other applications.</p>
<p>Typical attacks: empty / null / whitespace-only input, zero and negative numbers, division by zero, maximum length + 1, special and Unicode characters, leap days and month ends, duplicate submissions (double click), time-outs. In lesson 5.2 error guessing already found two weak spots: <code>countCharacters(null)</code> throws <code>NullPointerException</code> and <code>calculateRewardPoints(100, "vip")</code> silently returns 0.</p>`,
        `<p>Error guessing <em>không</em> phải đoán bừa. "Cách tiếp cận có phương pháp" in đỏ: <strong>lập danh sách các sai sót, defect và failure có thể xảy ra → thiết kế test làm lộ ra những failure đó và defect gây ra chúng</strong>. Danh sách này thường gọi là danh sách <em>fault attack</em> (tấn công lỗi). Nó được xây từ <strong>kinh nghiệm</strong>, <strong>dữ liệu defect và failure</strong> (vd bug tracker của bản phát hành trước), hoặc <strong>hiểu biết chung về lý do phần mềm hỏng</strong>. Syllabus thêm ba nguồn để dự đoán: ứng dụng đã chạy thế nào trong quá khứ, developer hay mắc loại lỗi gì, và failure đã gặp ở các ứng dụng khác.</p>
<p>Các đòn tấn công điển hình: input rỗng / null / chỉ có khoảng trắng, số 0 và số âm, chia cho 0, độ dài tối đa + 1, ký tự đặc biệt và Unicode, ngày 29/2 và cuối tháng, gửi trùng (bấm đúp), hết thời gian chờ. Ở bài 5.2 error guessing đã tìm ra hai điểm yếu: <code>countCharacters(null)</code> ném <code>NullPointerException</code> và <code>calculateRewardPoints(100, "vip")</code> lặng lẽ trả về 0.</p>`],
      [103, 'Exploratory Testing (1) — what it is',
        `<p>A <strong>hands-on approach</strong> with <strong>minimum planning and maximum test execution</strong>. Test design and execution happen <strong>in parallel</strong>, often without formal documentation; informal tests are <strong>designed, executed, logged and evaluated dynamically</strong> during execution; the results are used to <strong>learn more</strong> about the component or system and to <strong>create tests for the areas that may need more testing</strong>. The explorer with binoculars is the image to keep: you look, you learn, you decide where to look next.</p>
<p>Two corrections to common misunderstandings: exploratory testing is <em>not</em> "ad hoc clicking" — the tester has a goal and keeps notes (slide 104); and it can use the other techniques inside a session (a quick EP/BVA on a field you just discovered is still exploratory testing).</p>`,
        `<p>Một <strong>cách tiếp cận thực hành</strong> với <strong>lập kế hoạch tối thiểu và thực thi test tối đa</strong>. Thiết kế và thực thi test diễn ra <strong>song song</strong>, thường không có tài liệu chính thức; các test không chính thức được <strong>thiết kế, thực thi, ghi lại và đánh giá ngay</strong> trong lúc chạy; kết quả dùng để <strong>hiểu thêm</strong> về thành phần hay hệ thống và để <strong>tạo test cho những vùng có thể cần test thêm</strong>. Hình người cầm ống nhòm là hình cần nhớ: nhìn, học, rồi quyết định nhìn tiếp chỗ nào.</p>
<p>Hai chỗ hay hiểu sai: exploratory testing <em>không</em> phải "bấm lung tung" — tester có mục tiêu và có ghi chép (slide 104); và trong một phiên vẫn có thể dùng các kỹ thuật khác (làm nhanh EP/BVA cho một trường vừa phát hiện vẫn là exploratory testing).</p>`],
      [104, 'Exploratory Testing (2) — session-based, charters, when to use',
        `<p>Exploratory testing is sometimes structured with <strong>session-based testing</strong>: the exploration happens within a <strong>defined time-box</strong> (a session, typically 60–120 minutes of uninterrupted work) and the tester uses a <strong>test charter</strong> containing the <strong>test objectives</strong> to guide the testing. At the end the tester fills in a session sheet and is debriefed (see the worked example below). Exploratory testing is <strong>most useful when there are few or inadequate specifications or significant time pressure</strong>. The syllabus adds that it complements the formal techniques and is strongly associated with <em>reactive</em> test strategies (Chapter 5).</p>`,
        `<p>Exploratory testing đôi khi được tổ chức theo <strong>session-based testing</strong> (kiểm thử theo phiên): việc khám phá diễn ra trong một <strong>khung thời gian xác định</strong> (một phiên, thường 60–120 phút làm liền không bị ngắt) và tester dùng một <strong>test charter</strong> chứa các <strong>mục tiêu test</strong> để định hướng. Cuối phiên tester điền phiếu phiên (session sheet) và được hỏi lại (debrief) — xem ví dụ có lời giải bên dưới. Exploratory testing <strong>hữu ích nhất khi đặc tả ít hoặc không đầy đủ, hoặc áp lực thời gian lớn</strong>. Syllabus nói thêm: nó bổ sung cho các kỹ thuật chính thức và gắn chặt với chiến lược test <em>phản ứng</em> (reactive, Chương 5).</p>`],
      [105, 'Checklist-based Testing',
        `<p>An <strong>experienced tester uses a checklist to design, implement and execute tests</strong> based on the items or test conditions in the list. During test analysis testers <strong>create a new checklist or expand an existing one</strong>, but they may also <strong>use an existing checklist without modification</strong>. Checklists are built from the <strong>experience of the tester</strong>, <strong>knowledge about what is important for the user</strong>, and an <strong>understanding of why and how software fails</strong>.</p>
<p>From the syllabus: checklists support functional and non-functional testing (e.g. usability heuristics); because the items are high-level, two testers will do slightly different things — more variability, somewhat more coverage, less repeatability; when no detailed test cases exist, a checklist gives guidance and consistency. Do not confuse it with the <em>checklist-based reviewing</em> of Chapter 3 (LO-3.2.4): same idea, but there the checklist is used to read a document, here to run the software. The course's own UI checklist is used in the worked example below.</p>`,
        `<p>Một <strong>tester có kinh nghiệm dùng checklist để thiết kế, triển khai và thực thi test</strong> dựa trên các mục hay điều kiện test trong danh sách. Trong lúc phân tích test, tester <strong>tạo checklist mới hoặc mở rộng checklist có sẵn</strong>, nhưng cũng có thể <strong>dùng nguyên checklist có sẵn không sửa</strong>. Checklist được xây từ <strong>kinh nghiệm của tester</strong>, <strong>hiểu biết về điều gì quan trọng với người dùng</strong>, và <strong>hiểu vì sao và bằng cách nào phần mềm hỏng</strong>.</p>
<p>Theo syllabus: checklist hỗ trợ cả test chức năng lẫn phi chức năng (vd heuristic về khả dụng); vì các mục ở mức khái quát, hai tester sẽ làm hơi khác nhau — nhiều biến thiên hơn, coverage có phần rộng hơn, nhưng khó lặp lại hơn; khi không có test case chi tiết, checklist cho định hướng và sự nhất quán. Đừng nhầm với <em>checklist-based reviewing</em> ở Chương 3 (LO-3.2.4): cùng một ý tưởng, nhưng ở đó checklist dùng để đọc tài liệu, ở đây dùng để chạy phần mềm. Checklist UI của chính môn học được dùng trong ví dụ có lời giải bên dưới.</p>`],
      [106, 'Question — a good reason to use experience-based testing',
        AE('A — You can find defects that might be missed by more formal techniques', 'That is slide 101, bullet 2. B confuses the <em>tester\'s</em> experience with experienced <em>users</em>. C describes directing developers\' effort by usage (operational profiles), not a reason for this technique. D is the opposite of the truth: experience-based testing depends on human judgement and is poorly supported by tools and hard to automate.'),
        AV('A — Tìm được defect mà các kỹ thuật chính thức hơn có thể bỏ sót', 'Đúng gạch đầu dòng 2 của slide 101. B nhầm kinh nghiệm của <em>tester</em> với <em>người dùng</em> có kinh nghiệm. C nói về việc hướng công sức của developer theo mức sử dụng (operational profile), không phải lý do dùng kỹ thuật này. D ngược với thực tế: test dựa kinh nghiệm phụ thuộc vào phán đoán của con người, ít được công cụ hỗ trợ và khó tự động hoá.')],
      [107, 'Question — exploratory testing with time-boxes and charters',
        AE('B — Session-based testing', 'Slide 104 word for word: exploratory testing within a defined time-box, guided by a test charter, is session-based testing. A "schedule-based testing" and D "formal chartering" are not ISTQB terms; C risk-based testing is a <em>strategy</em> that prioritises by risk level, not a way of running exploratory sessions.'),
        AV('B — Session-based testing', 'Đúng nguyên văn slide 104: exploratory testing trong một khung thời gian xác định, được dẫn dắt bởi test charter, là session-based testing. A "schedule-based testing" và D "formal chartering" không phải thuật ngữ ISTQB; C risk-based testing là một <em>chiến lược</em> ưu tiên theo mức rủi ro, không phải cách chạy phiên khám phá.')],
      [108, 'Question — what is error guessing?',
        AE('C — A testing technique used to guess where a developer is likely to have made a mistake', 'Error guessing anticipates mistakes, defects and failures (slide 102). A is defect-metrics analysis (test monitoring, Chapter 5); B describes a development/review activity, not a test technique; D is project planning. The word "guess" in C is fine — the guess is informed by a list built from experience and defect data.'),
        AV('C — Kỹ thuật test dùng để đoán chỗ developer nhiều khả năng đã mắc sai sót', 'Error guessing dự đoán sai sót, defect và failure (slide 102). A là phân tích số liệu defect (giám sát test, Chương 5); B mô tả một hoạt động phát triển/review, không phải kỹ thuật test; D là lập kế hoạch dự án. Chữ "đoán" ở C không có vấn đề — việc đoán dựa trên danh sách xây từ kinh nghiệm và dữ liệu lỗi.')],
    ]),
    bi(`<h3>Ví dụ có lời giải 1 · Error guessing — a fault-attack list for a real PE form</h3>
<p>FA23 PE Question 3 describes the form <em>"Tạo quyết định kiểm tra"</em> (create an inspection decision): a decision name of 50–255 characters whose first character must not be a digit and which allows no special characters or blanks; "Chi tiết" up to 10,000 characters; a school chosen from a list (default "Chọn trường để kiểm tra"); at least one attached document, each with a name of 10–100 characters, a code of 3–10 characters and a size of at most 10 MB. EP/BVA give the systematic tests; error guessing adds what experience says developers get wrong:</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Attack (likely mistake)</th><th>Why it often fails</th><th>Concrete test</th></tr></thead>
<tbody>
<tr><td>1</td><td>Whitespace-only or padded text</td><td>Length checked before <code>trim()</code></td><td>Name = 60 spaces; name = 49 letters + 1 trailing space</td></tr>
<tr><td>2</td><td>Vietnamese letters counted as "special"</td><td>Regex <code>[A-Za-z0-9]</code> written for ASCII only</td><td>Name "QuyetDinhKiemTra…" vs "QuyếtĐịnhKiểmTra…" (same length)</td></tr>
<tr><td>3</td><td>Length in bytes instead of characters</td><td>UTF-8 "ế" is 3 bytes</td><td>Name of exactly 255 characters with diacritics</td></tr>
<tr><td>4</td><td>Default list value accepted as a choice</td><td>"Chọn trường…" stored as a real school</td><td>Save without touching the drop-down</td></tr>
<tr><td>5</td><td>File-size boundary in the wrong unit</td><td>10 MB = 10,000,000 or 10,485,760 bytes?</td><td>Files of 10,485,760 and 10,485,761 bytes</td></tr>
<tr><td>6</td><td>Zero or removed attachments</td><td>Check done only on the first add</td><td>Add one document, delete it, then save</td></tr>
<tr><td>7</td><td>Double submission</td><td>No button disabling / idempotency</td><td>Double-click "Lưu" → two decisions created?</td></tr>
<tr><td>8</td><td>Data lost after a validation error</td><td>Form re-rendered empty</td><td>Invalid code + 9,000 chars in "Chi tiết" → are they still there?</td></tr>
<tr><td>9</td><td>Injection / markup in free text</td><td>Output not escaped</td><td>"Chi tiết" = <code>&lt;script&gt;alert(1)&lt;/script&gt;</code></td></tr>
<tr><td>10</td><td>Null / missing parameters in the API</td><td>No null check (like <code>countCharacters(null)</code>)</td><td>POST the form without the "Mã tài liệu" field at all</td></tr>
</tbody>
</table></div>
<p>Attacks 2 and 3 also expose a <strong>specification gap</strong>: "no special characters or blanks" does not say whether Vietnamese letters are allowed, and a Vietnamese decision name without blanks is unusual. Error guessing often ends in a question to the analyst, not only in a bug report.</p>
<h3>Ví dụ có lời giải 2 · Exploratory testing — a test charter and a session sheet</h3>
<p>Session-based test management (SBTM, Jonathan and James Bach) gives exploratory testing the structure of slide 104. Below is a <em>sample</em> charter and session sheet for the same form — an illustration of what a tester writes, not the log of a real system.</p>
<div class="table-wrap"><table>
<tbody>
<tr><th>CHARTER</th><td>Explore the <b>Create inspection decision</b> form <b>with</b> invalid, boundary and Vietnamese-text inputs and with attachments near 10 MB <b>to discover</b> validation defects and data loss.</td></tr>
<tr><th>Areas</th><td>Form fields · attachment upload · error handling · browser Chrome 128</td></tr>
<tr><th>Tester / build / start</th><td>Student A · build 1.4.2 · 09:00, time-box 60 min (normal session)</td></tr>
<tr><th>Task breakdown</th><td>Test design &amp; execution 65% · bug investigation &amp; reporting 25% · session set-up 10% · charter vs opportunity 85 / 15</td></tr>
<tr><th>Data files</th><td>name-49.txt, name-255-vi.txt, doc-10MiB.pdf, doc-10MiB+1.pdf</td></tr>
<tr><th>Test notes</th><td>09:04 name with 50 ASCII letters → saved ✔ · 09:09 49 letters + 1 space → saved ✘ (length counted before trim) · 09:15 Vietnamese name → rejected as "special characters" · 09:22 10 MiB file accepted, 10 MiB + 1 byte accepted ✘ → limit seems to be 10,000,000 × 1.1? investigate · 09:35 validation error on code → "Chi tiết" cleared ✘ · 09:48 opportunity: double-click Lưu → two rows in the list ✘</td></tr>
<tr><th>Bugs</th><td>#1 trailing space counted in length · #2 upload accepts 10 MiB + 1 byte · #3 "Chi tiết" lost after a validation error · #4 double submission creates duplicates</td></tr>
<tr><th>Issues</th><td>Q1 Are Vietnamese letters "special characters"? (ask BA) · Q2 Is 10 MB = 10^7 or 2^20 × 10 bytes? · attachment removal not explored — new charter</td></tr>
</tbody>
</table></div>
<p><strong>Debrief (PROOF):</strong> <em>Past</em> — what happened (4 bugs, 2 questions); <em>Results</em> — what was achieved against the charter (fields and upload covered, removal not); <em>Obstacles</em> — the test file generator was slow; <em>Outlook</em> — next session: attachment removal + edit flow; <em>Feelings</em> — confidence in validation is low. The debrief is how the test manager measures exploratory work (number of sessions, % on charter, bugs per session) — the answer to "coverage is hard to assess" on slide 101.</p>
<h3>Ví dụ có lời giải 3 · Checklist-based testing — the course's own UI checklist</h3>
<p>The course template <em>CheckList_UT_Blackbox_UI.xlsx</em> (columns No · Large item · Medium item · Check item · Result · Note) is a ready-made checklist. Selected items from its "screen operation" and "validation" groups, applied to the same form:</p>
<div class="table-wrap"><table>
<thead><tr><th>No</th><th>Check item (translated from the template)</th><th>Result on the form</th></tr></thead>
<tbody>
<tr><td>19</td><td>Default values shown on the screen (numbers, radio buttons, blanks…) are checked</td><td>OK — school list shows "Chọn trường để kiểm tra"</td></tr>
<tr><td>20</td><td>No input on the screen: one field empty, several fields empty…</td><td>OK — each required field reports its own error</td></tr>
<tr><td>24</td><td>Focus position after an input error is confirmed</td><td>NG — focus stays on the Lưu button</td></tr>
<tr><td>25</td><td>Whether data already entered is kept or cleared after an error is confirmed</td><td>NG — "Chi tiết" is cleared (same as bug #3)</td></tr>
<tr><td>36</td><td>Required / not-required status of each field is checked</td><td>OK</td></tr>
<tr><td>37</td><td>Format of the input values is checked</td><td>NG — first-character-is-digit rule not enforced</td></tr>
<tr><td>16</td><td>Boundary conditions of IF / WHILE statements are checked</td><td>OK — 49/50/255/256 tested (BVA)</td></tr>
<tr><td>12–13</td><td>0 ÷ 0 and non-zero ÷ 0 cases are checked</td><td>N/A — no calculation on this form</td></tr>
</tbody>
</table></div>
<p>Notice how the checklist overlaps with the other techniques (item 16 is BVA, item 25 found the same defect as the exploratory session) and how it standardises what every tester on the team looks at. That consistency — not creativity — is what checklists are for.</p>
<div class="pitfall"><b>Exam traps.</b> (1) "Exploratory testing = unplanned, undocumented testing" — no: session-based testing gives it a charter, a time-box and a session sheet. (2) "Experience-based testing is testing by experienced <em>users</em>" — no, it is based on the <em>tester's</em> experience (Q106 B). (3) "Coverage of experience-based techniques is measured by the checklist" — the syllabus says coverage is difficult to assess and may be unmeasurable. (4) Error guessing is not a planning, metrics or development technique (Q108).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Heuristics that make "experience" teachable.</b> Exploratory testers use named heuristics to vary their attacks systematically: James Bach's <b>SFDPOT</b> ("San Francisco Depot": Structure, Function, Data, Platform, Operations, Time), <b>CRUD</b> for every entity, and James Whittaker's <b>tours</b> (the "money tour" through the features the sales team demos, the "back-alley tour" through the least-used features). Published bug taxonomies (Beizer; Kaner, Falk &amp; Nguyen) turn error guessing into a reusable list. And the newer CTFL v4.0 (2023) keeps the same three experience-based techniques but adds <em>collaboration-based</em> approaches — collaborative user-story writing, acceptance criteria and ATDD. <em>Outside the syllabus because CTFL 2018 only asks you to explain the three techniques, not to apply named heuristics.</em></div>`,
    `<h3>Ví dụ có lời giải 1 · Error guessing — danh sách tấn công lỗi cho một form PE thật</h3>
<p>Câu 3 đề PE FA23 mô tả form <em>"Tạo quyết định kiểm tra"</em>: tên quyết định dài 50–255 ký tự, ký tự đầu không được là số, không cho phép ký tự đặc biệt hay khoảng trắng; "Chi tiết" tối đa 10.000 ký tự; trường kiểm tra chọn từ danh sách (mặc định "Chọn trường để kiểm tra"); ít nhất một tài liệu đính kèm, mỗi tài liệu có tên 10–100 ký tự, mã 3–10 ký tự và dung lượng tối đa 10 MB. EP/BVA cho các test có hệ thống; error guessing thêm những gì kinh nghiệm nói rằng developer hay làm sai:</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Đòn tấn công (sai sót dễ gặp)</th><th>Vì sao hay hỏng</th><th>Test cụ thể</th></tr></thead>
<tbody>
<tr><td>1</td><td>Chuỗi toàn khoảng trắng hoặc có khoảng trắng đầu/cuối</td><td>Kiểm độ dài trước khi <code>trim()</code></td><td>Tên = 60 dấu cách; tên = 49 chữ + 1 dấu cách cuối</td></tr>
<tr><td>2</td><td>Chữ tiếng Việt bị coi là "ký tự đặc biệt"</td><td>Regex <code>[A-Za-z0-9]</code> viết cho ASCII</td><td>Tên "QuyetDinhKiemTra…" so với "QuyếtĐịnhKiểmTra…" (cùng độ dài)</td></tr>
<tr><td>3</td><td>Đếm độ dài theo byte thay vì ký tự</td><td>Chữ "ế" trong UTF-8 chiếm 3 byte</td><td>Tên đúng 255 ký tự có dấu</td></tr>
<tr><td>4</td><td>Giá trị mặc định của danh sách được chấp nhận như một lựa chọn</td><td>"Chọn trường…" bị lưu như một trường thật</td><td>Lưu mà không đụng vào drop-down</td></tr>
<tr><td>5</td><td>Biên dung lượng file sai đơn vị</td><td>10 MB = 10.000.000 hay 10.485.760 byte?</td><td>File 10.485.760 và 10.485.761 byte</td></tr>
<tr><td>6</td><td>Không còn tài liệu nào sau khi xoá</td><td>Chỉ kiểm lúc thêm lần đầu</td><td>Thêm một tài liệu, xoá nó, rồi lưu</td></tr>
<tr><td>7</td><td>Gửi trùng</td><td>Không khoá nút / không idempotent</td><td>Bấm đúp "Lưu" → tạo ra hai quyết định?</td></tr>
<tr><td>8</td><td>Mất dữ liệu sau lỗi validate</td><td>Form vẽ lại trống trơn</td><td>Mã sai + 9.000 ký tự trong "Chi tiết" → còn nguyên không?</td></tr>
<tr><td>9</td><td>Chèn mã / thẻ vào ô văn bản tự do</td><td>Output không được escape</td><td>"Chi tiết" = <code>&lt;script&gt;alert(1)&lt;/script&gt;</code></td></tr>
<tr><td>10</td><td>Tham số null / thiếu trong API</td><td>Không kiểm null (như <code>countCharacters(null)</code>)</td><td>POST form mà bỏ hẳn trường "Mã tài liệu"</td></tr>
</tbody>
</table></div>
<p>Đòn 2 và 3 còn làm lộ một <strong>khoảng trống trong đặc tả</strong>: "không ký tự đặc biệt hay khoảng trắng" không nói chữ tiếng Việt có được phép không, và một tên quyết định tiếng Việt không có khoảng trắng là rất lạ. Error guessing thường kết thúc bằng một câu hỏi cho BA, không chỉ bằng một bug report.</p>
<h3>Ví dụ có lời giải 2 · Exploratory testing — test charter và phiếu phiên</h3>
<p>Session-based test management (SBTM, của Jonathan và James Bach) cho exploratory testing đúng cấu trúc của slide 104. Dưới đây là charter và phiếu phiên <em>mẫu</em> cho cùng form đó — minh hoạ những gì một tester viết ra, không phải log của một hệ thống thật.</p>
<div class="table-wrap"><table>
<tbody>
<tr><th>CHARTER</th><td>Khám phá form <b>Tạo quyết định kiểm tra</b> <b>bằng</b> input sai, input biên, chữ tiếng Việt và tệp đính kèm quanh mức 10 MB <b>để phát hiện</b> lỗi validate và mất dữ liệu.</td></tr>
<tr><th>Vùng</th><td>Các trường của form · tải tệp đính kèm · xử lý lỗi · trình duyệt Chrome 128</td></tr>
<tr><th>Tester / build / bắt đầu</th><td>Sinh viên A · build 1.4.2 · 09:00, khung 60 phút (phiên thường)</td></tr>
<tr><th>Phân bổ thời gian</th><td>Thiết kế &amp; thực thi test 65% · điều tra &amp; báo lỗi 25% · chuẩn bị phiên 10% · đúng charter / việc phát sinh 85 / 15</td></tr>
<tr><th>Tệp dữ liệu</th><td>name-49.txt, name-255-vi.txt, doc-10MiB.pdf, doc-10MiB+1.pdf</td></tr>
<tr><th>Ghi chép test</th><td>09:04 tên 50 chữ ASCII → lưu được ✔ · 09:09 49 chữ + 1 dấu cách → lưu được ✘ (độ dài tính trước khi trim) · 09:15 tên tiếng Việt → bị từ chối là "ký tự đặc biệt" · 09:22 tệp 10 MiB được nhận, 10 MiB + 1 byte cũng được nhận ✘ → có vẻ giới hạn là 10.000.000 × 1,1? cần điều tra · 09:35 lỗi validate ở ô mã → "Chi tiết" bị xoá ✘ · 09:48 phát sinh: bấm đúp Lưu → danh sách có hai dòng ✘</td></tr>
<tr><th>Bug</th><td>#1 khoảng trắng cuối bị tính vào độ dài · #2 tải lên nhận 10 MiB + 1 byte · #3 mất "Chi tiết" sau lỗi validate · #4 gửi trùng tạo bản ghi đôi</td></tr>
<tr><th>Vấn đề</th><td>Q1 Chữ tiếng Việt có phải "ký tự đặc biệt"? (hỏi BA) · Q2 10 MB là 10^7 hay 2^20 × 10 byte? · chưa khám phá việc xoá tệp đính kèm — cần charter mới</td></tr>
</tbody>
</table></div>
<p><strong>Debrief (PROOF):</strong> <em>Past</em> — đã xảy ra gì (4 bug, 2 câu hỏi); <em>Results</em> — đạt được gì so với charter (đã phủ các trường và tải tệp, chưa phủ việc xoá); <em>Obstacles</em> — công cụ sinh tệp test chạy chậm; <em>Outlook</em> — phiên tới: xoá tệp đính kèm + luồng sửa; <em>Feelings</em> — độ tin cậy vào phần validate đang thấp. Buổi debrief là cách test manager đo công việc khám phá (số phiên, % đúng charter, số bug mỗi phiên) — câu trả lời cho "coverage khó đánh giá" ở slide 101.</p>
<h3>Ví dụ có lời giải 3 · Checklist-based testing — checklist UI của chính môn học</h3>
<p>Template của môn <em>CheckList_UT_Blackbox_UI.xlsx</em> (các cột No · Large item · Medium item · Check item · Result · Note) là một checklist dùng ngay được. Một số mục trong nhóm "thao tác màn hình" và "Validation", áp dụng cho cùng form:</p>
<div class="table-wrap"><table>
<thead><tr><th>No</th><th>Check item (theo template)</th><th>Kết quả trên form</th></tr></thead>
<tbody>
<tr><td>19</td><td>Đã check giá trị default hiển thị của màn hình (giá trị số, radio button, blank…)</td><td>OK — danh sách trường hiện "Chọn trường để kiểm tra"</td></tr>
<tr><td>20</td><td>Đã check trường hợp không input giá trị trên màn hình: không input vào 1 trường, nhiều trường…</td><td>OK — mỗi trường bắt buộc báo lỗi riêng</td></tr>
<tr><td>24</td><td>Đã confirm vị trí focus sau khi giá trị input bị error</td><td>NG — focus nằm lại ở nút Lưu</td></tr>
<tr><td>25</td><td>Đã confirm việc xoá hay không xoá data đã input và bị error</td><td>NG — "Chi tiết" bị xoá (trùng bug #3)</td></tr>
<tr><td>36</td><td>Đã check việc một trường bắt buộc nhập / không bắt buộc nhập</td><td>OK</td></tr>
<tr><td>37</td><td>Đã check format của giá trị input</td><td>NG — không chặn quy tắc ký tự đầu là số</td></tr>
<tr><td>16</td><td>Đã check điều kiện biên của câu lệnh if, while</td><td>OK — đã test 49/50/255/256 (BVA)</td></tr>
<tr><td>12–13</td><td>Đã check trường hợp 0 chia cho 0 và khác 0 chia cho 0</td><td>N/A — form không có phép tính</td></tr>
</tbody>
</table></div>
<p>Để ý checklist chồng lấn với các kỹ thuật khác thế nào (mục 16 chính là BVA, mục 25 tìm ra đúng defect mà phiên khám phá đã thấy) và nó chuẩn hoá những gì mọi tester trong nhóm đều phải nhìn. Sự nhất quán ấy — chứ không phải óc sáng tạo — là mục đích của checklist.</p>
<div class="pitfall"><b>Bẫy trong đề.</b> (1) "Exploratory testing = test không kế hoạch, không tài liệu" — không: session-based testing cho nó một charter, một khung thời gian và một phiếu phiên. (2) "Experience-based testing là test do <em>người dùng</em> có kinh nghiệm thực hiện" — không, nó dựa trên kinh nghiệm của <em>tester</em> (Q106 B). (3) "Coverage của kỹ thuật dựa kinh nghiệm được đo bằng checklist" — syllabus nói coverage khó đánh giá và có thể không đo được. (4) Error guessing không phải kỹ thuật lập kế hoạch, đo số liệu hay phát triển (Q108).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các heuristic biến "kinh nghiệm" thành thứ dạy được.</b> Tester khám phá dùng các heuristic có tên để thay đổi đòn tấn công một cách có hệ thống: <b>SFDPOT</b> của James Bach ("San Francisco Depot": Structure, Function, Data, Platform, Operations, Time), <b>CRUD</b> cho mọi thực thể, và các <b>tour</b> của James Whittaker ("money tour" đi qua những tính năng đội bán hàng hay demo, "back-alley tour" đi qua những tính năng ít ai dùng). Các bug taxonomy đã xuất bản (Beizer; Kaner, Falk &amp; Nguyen) biến error guessing thành một danh sách dùng lại được. Còn CTFL v4.0 (2023) giữ nguyên ba kỹ thuật dựa kinh nghiệm này nhưng thêm nhóm <em>collaboration-based</em> — cùng viết user story, acceptance criteria và ATDD. <em>Ngoài giáo trình vì CTFL 2018 chỉ yêu cầu giải thích ba kỹ thuật, không yêu cầu áp dụng các heuristic có tên.</em></div>`),
    books([
      ['fst4', 'Ch.4 §4 "Experience-based test techniques" (error guessing, exploratory, checklist-based) — book pp.140–143 (PDF pp.154–157); chapter review p.143, sample questions pp.144–147', 'Chương 4 §4 "Experience-based test techniques" (error guessing, exploratory, checklist-based) — trang sách 140–143 (PDF 154–157); ôn chương trang 143, câu hỏi mẫu trang 144–147'],
      ['fst', '§4.5 "Experience-based techniques": 4.5.1 error guessing, 4.5.2 exploratory testing — pp.112–114 (PDF pp.115–117)', '§4.5 "Experience-based techniques": 4.5.1 error guessing, 4.5.2 exploratory testing — trang 112–114 (PDF 115–117)'],
      ['sp5', '§5.3 "Experience-Based Test Techniques" — error guessing, checklist-based testing (with the GUI style-guide case study), exploratory testing (with the VSR-II case study) — PDF pp.233–239', '§5.3 "Experience-Based Test Techniques" — error guessing, checklist-based testing (có case study kiểm style-guide GUI), exploratory testing (có case study VSR-II) — PDF 233–239'],
      ['sp4', '§5.3 "Intuitive and Experience-Based Test Case Determination" — pp.161–164 (PDF pp.176–179)', '§5.3 "Intuitive and Experience-Based Test Case Determination" — trang 161–164 (PDF 176–179)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 6.2 Choosing test techniques ───────────────────────── */
const L62 = {
  title: '6.2 — Choosing test techniques: formality and the factors that decide|||6.2 — Chọn kỹ thuật test: mức hình thức và các yếu tố quyết định',
  slug: 'swt301-choosing-test-techniques',
  type: 'VIDEO',
  description: 'SWT4 slide 109–112 + 2 slide ẩn: mức hình thức khi dùng kỹ thuật, 14 yếu tố ảnh hưởng tới việc chọn kỹ thuật (theo ghi chú của thầy/cô), yếu tố bên trong/bên ngoài — kèm bài "bạn sẽ chọn kỹ thuật nào?" có lời giải.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.2 · SWT4 slides 109–112 (+ hidden pptx slides 114–115)</span>
<h2>Choosing test techniques</h2>
<p class="lead">Chapters 4–6 gave you a toolbox: EP, BVA, decision tables, state transitions, use cases, statement and decision coverage, error guessing, exploratory and checklist-based testing. The last four slides of SWT4 answer the practical question: <strong>which ones do I use here, and how formally?</strong> There is no single best technique; the choice depends on a list of factors that you must be able to recognise in a scenario.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.1.1 Explain the characteristics, commonalities and differences between black-box, white-box and experience-based test techniques (K2) — in CTFL 2018 the "choosing test techniques" factors are part of §4.1.1. Exam questions give a short scenario and ask which factor applies or which technique fits best.</div>
<h3>The factors, grouped so you can remember them</h3>
<div class="table-wrap"><table>
<thead><tr><th>Group</th><th>Factors on slides 111–112</th><th>Typical consequence</th></tr></thead>
<tbody>
<tr><td>The product</td><td>Type of component/system · complexity · expected use of the software</td><td>Financial calculations → BVA; complex rules → decision tables; safety-critical → more thorough techniques</td></tr>
<tr><td>Rules from outside</td><td>Regulatory standards · customer or contractual requirements</td><td>Aviation: EP, BVA, state transition for high-integrity systems</td></tr>
<tr><td>Risk and goals</td><td>Risk levels and risk types · test objectives · expected types of defects</td><td>Higher risk → more formal testing; confidence in typical tasks → use cases</td></tr>
<tr><td>What you have</td><td>Available documentation · available tools · time and budget</td><td>A state diagram exists → state transition testing; no spec → exploratory</td></tr>
<tr><td>People and process</td><td>Tester knowledge and skills · previous experience with the techniques · SDLC model</td><td>Sequential → formal techniques; iterative → exploratory approach</td></tr>
</tbody>
</table></div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.2 · SWT4 slide 109–112 (+ slide pptx ẩn 114–115)</span>
<h2>Chọn kỹ thuật test</h2>
<p class="lead">Chương 4–6 đã cho bạn một hộp đồ nghề: EP, BVA, decision table, state transition, use case, statement và decision coverage, error guessing, exploratory và checklist-based testing. Bốn slide cuối của SWT4 trả lời câu hỏi thực tế: <strong>ở đây mình dùng cái nào, và hình thức đến mức nào?</strong> Không có kỹ thuật nào tốt nhất cho mọi trường hợp; lựa chọn phụ thuộc vào một danh sách yếu tố mà bạn phải nhận ra được trong một tình huống.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.1.1 Giải thích đặc điểm, điểm chung và khác biệt giữa kỹ thuật black-box, white-box và dựa kinh nghiệm (K2) — trong CTFL 2018, các yếu tố "chọn kỹ thuật test" nằm trong §4.1.1. Câu hỏi thi thường cho một tình huống ngắn và hỏi yếu tố nào áp dụng hoặc kỹ thuật nào hợp nhất.</div>
<h3>Các yếu tố, gom nhóm cho dễ nhớ</h3>
<div class="table-wrap"><table>
<thead><tr><th>Nhóm</th><th>Yếu tố trên slide 111–112</th><th>Hệ quả điển hình</th></tr></thead>
<tbody>
<tr><td>Sản phẩm</td><td>Loại thành phần/hệ thống · độ phức tạp · cách phần mềm sẽ được dùng</td><td>Tính toán tài chính → BVA; quy tắc phức tạp → decision table; an toàn-sống-còn → kỹ thuật kỹ lưỡng hơn</td></tr>
<tr><td>Quy định từ bên ngoài</td><td>Chuẩn quy định · yêu cầu của khách hàng hoặc hợp đồng</td><td>Hàng không: EP, BVA, state transition cho hệ thống độ toàn vẹn cao</td></tr>
<tr><td>Rủi ro và mục tiêu</td><td>Mức và loại rủi ro · mục tiêu test · loại defect dự kiến</td><td>Rủi ro cao → test hình thức hơn; tin tưởng vào các tác vụ điển hình → use case</td></tr>
<tr><td>Những gì đang có</td><td>Tài liệu sẵn có · công cụ sẵn có · thời gian và ngân sách</td><td>Có sẵn sơ đồ trạng thái → state transition testing; không có đặc tả → exploratory</td></tr>
<tr><td>Con người và quy trình</td><td>Kiến thức, kỹ năng của tester · kinh nghiệm dùng kỹ thuật trước đây · mô hình SDLC</td><td>Tuần tự → kỹ thuật hình thức; lặp → cách tiếp cận khám phá</td></tr>
</tbody>
</table></div>`),
    walkHead(D, 109, 112, 'Slides 111–112 have detailed speaker notes in English; they are the best part of this section and are explained in full.', 'Slide 111–112 có ghi chú tiếng Anh rất chi tiết của thầy/cô; đó là phần giá trị nhất của mục này và được giải thích đầy đủ.'),
    walk(D, [
      [109, 'Choosing Test Techniques (section title)',
        `<p>Section divider: the large title "Choosing Test Techniques" on a dotted background. No new content, but a signal that the question changes from "how does technique X work?" to "when is technique X the right one?".</p>`,
        `<p>Slide chuyển mục: tiêu đề lớn "Choosing Test Techniques" trên nền chấm. Không có nội dung mới, nhưng báo hiệu câu hỏi đổi từ "kỹ thuật X hoạt động thế nào?" sang "khi nào kỹ thuật X là lựa chọn đúng?".</p>`],
      [110, 'Choosing test techniques — formality',
        `<p><strong>Formality</strong>: techniques can be used very informally (little or no documentation, tests in the tester's head) or very formally (every condition, case and coverage figure documented and traced). The level depends on: <strong>safety or regulatory industries</strong> (a medical device or railway signalling needs traceable, formal evidence), <strong>the maturity of the organisation</strong> (a CMMI level-5 company documents; a two-person start-up does not), <strong>the life cycle model</strong> (V-model → formal; Scrum → lighter), and the <strong>knowledge and skills of testers</strong> (experts can work informally and still be effective; beginners need the structure). Remember the pair: <em>which technique</em> (slides 111–112) and <em>how formally</em> (this slide) are two separate decisions.</p>`,
        `<p><strong>Mức hình thức</strong>: kỹ thuật có thể được dùng rất phi hình thức (ít hoặc không có tài liệu, test nằm trong đầu tester) hoặc rất hình thức (mọi điều kiện, test case và số liệu coverage đều được ghi lại và truy vết). Mức đó phụ thuộc: <strong>ngành an toàn hoặc có quy định</strong> (thiết bị y tế hay tín hiệu đường sắt cần bằng chứng hình thức, truy vết được), <strong>độ trưởng thành của tổ chức</strong> (công ty CMMI mức 5 thì ghi chép; start-up hai người thì không), <strong>mô hình vòng đời</strong> (V-model → hình thức; Scrum → nhẹ hơn), và <strong>kiến thức, kỹ năng của tester</strong> (chuyên gia có thể làm phi hình thức mà vẫn hiệu quả; người mới cần có khung). Nhớ cặp này: <em>chọn kỹ thuật nào</em> (slide 111–112) và <em>hình thức đến đâu</em> (slide này) là hai quyết định riêng.</p>`],
      [111, 'Choosing test techniques — factors (1)',
        `<p>Seven factors, each explained in the teacher's notes:</p>
<ul>
<li><strong>Type of component/system</strong> — embedded, graphical, financial… A financial application with many calculations benefits from <em>BVA</em>.</li>
<li><strong>Complexity</strong> — complex systems have more defects, and harder to find ones; use additional techniques. A simple numeric field → <em>EP</em>; a screen with many fields, dependencies, calculations and rules that change over time → add <em>decision tables</em>, <em>state transition</em> and <em>white-box</em> techniques.</li>
<li><strong>Regulatory standards</strong> — the aircraft industry requires <em>EP, BVA and state transition testing</em> for high-integrity systems.</li>
<li><strong>Customer or contractual requirements</strong> — a contract may prescribe techniques or coverage levels.</li>
<li><strong>Risk levels and risk types</strong> — the greater the risk, the more thorough and formal the testing; commercial risk driven by quality issues may make <em>exploratory testing</em> the better choice; the risk type (usability, performance, security, functionality) decides which technique can address it at all.</li>
<li><strong>Test objectives</strong> — confidence that the system performs typical operational tasks → <em>use case testing</em>; very thorough testing → more rigorous techniques such as <em>white-box</em>.</li>
<li><strong>Available documentation</strong> — whether it exists, how up to date it is, its content and style: if the specification already contains decision tables or state graphs, use the associated techniques.</li>
</ul>`,
        `<p>Bảy yếu tố, mỗi yếu tố được giải thích trong ghi chú của thầy/cô:</p>
<ul>
<li><strong>Loại thành phần/hệ thống</strong> — nhúng, đồ hoạ, tài chính… Ứng dụng tài chính có nhiều phép tính sẽ lợi từ <em>BVA</em>.</li>
<li><strong>Độ phức tạp</strong> — hệ thống phức tạp có nhiều defect hơn, và khó tìm hơn; hãy dùng thêm kỹ thuật. Một trường số đơn giản → <em>EP</em>; một màn hình nhiều trường, phụ thuộc lẫn nhau, có tính toán và quy tắc thay đổi theo thời gian → thêm <em>decision table</em>, <em>state transition</em> và kỹ thuật <em>white-box</em>.</li>
<li><strong>Chuẩn quy định</strong> — ngành hàng không yêu cầu <em>EP, BVA và state transition testing</em> cho hệ thống độ toàn vẹn cao.</li>
<li><strong>Yêu cầu của khách hàng hoặc hợp đồng</strong> — hợp đồng có thể quy định kỹ thuật hoặc mức coverage.</li>
<li><strong>Mức và loại rủi ro</strong> — rủi ro càng lớn, test càng phải kỹ lưỡng và hình thức; rủi ro thương mại do vấn đề chất lượng có thể khiến <em>exploratory testing</em> là lựa chọn tốt hơn; loại rủi ro (khả dụng, hiệu năng, bảo mật, chức năng) quyết định kỹ thuật nào xử lý được nó.</li>
<li><strong>Mục tiêu test</strong> — tin rằng hệ thống làm được các tác vụ vận hành điển hình → <em>use case testing</em>; test rất kỹ lưỡng → kỹ thuật chặt chẽ hơn như <em>white-box</em>.</li>
<li><strong>Tài liệu sẵn có</strong> — có tồn tại không, cập nhật đến đâu, nội dung và văn phong: nếu đặc tả đã có sẵn decision table hay đồ thị trạng thái, hãy dùng kỹ thuật tương ứng.</li>
</ul>`],
      [112, 'Choosing test techniques — factors (2)',
        `<p>Seven more factors, with the teacher's notes:</p>
<ul>
<li><strong>Tester knowledge and skills</strong> — experience-based techniques depend on them most.</li>
<li><strong>Available tools</strong> — the notes put it in terms of <em>models</em>: techniques are based on models, so the models available from specification, design and implementation govern to some extent which techniques can be used (and tools support some techniques better than others, e.g. coverage tools for white-box).</li>
<li><strong>Time and budget</strong> — little time → fewer, cheaper techniques, or exploratory sessions.</li>
<li><strong>SDLC model</strong> — a sequential model → more formal techniques; an iterative model → an exploratory approach.</li>
<li><strong>Expected use of the software</strong> — safety-critical situations (medical monitoring devices, car-driving technology) require more thorough testing.</li>
<li><strong>Previous experience with using the test techniques</strong> — on this or similar components.</li>
<li><strong>Expected types of defects</strong> — boundary mistakes → BVA; wrong rule combinations → decision tables; illegal sequences → state transition.</li>
</ul>
<p>With slide 111 this is the full CTFL 2018 list (the syllabus lists "risk levels" and "risk types" separately — 15 items; the slide merges them into 14).</p>`,
        `<p>Thêm bảy yếu tố, kèm ghi chú của thầy/cô:</p>
<ul>
<li><strong>Kiến thức và kỹ năng của tester</strong> — kỹ thuật dựa kinh nghiệm phụ thuộc vào nó nhiều nhất.</li>
<li><strong>Công cụ sẵn có</strong> — ghi chú diễn đạt theo <em>mô hình</em>: kỹ thuật dựa trên mô hình, nên các mô hình có sẵn từ đặc tả, thiết kế và cài đặt phần nào quyết định kỹ thuật nào dùng được (và công cụ hỗ trợ kỹ thuật này tốt hơn kỹ thuật khác, vd công cụ đo coverage cho white-box).</li>
<li><strong>Thời gian và ngân sách</strong> — ít thời gian → ít kỹ thuật hơn, rẻ hơn, hoặc các phiên khám phá.</li>
<li><strong>Mô hình SDLC</strong> — mô hình tuần tự → kỹ thuật hình thức hơn; mô hình lặp → cách tiếp cận khám phá.</li>
<li><strong>Cách phần mềm sẽ được dùng</strong> — tình huống an toàn-sống-còn (thiết bị theo dõi y tế, công nghệ lái xe) đòi test kỹ lưỡng hơn.</li>
<li><strong>Kinh nghiệm dùng kỹ thuật trước đây</strong> — trên chính thành phần này hoặc thành phần tương tự.</li>
<li><strong>Loại defect dự kiến</strong> — lỗi ở biên → BVA; sai tổ hợp quy tắc → decision table; chuỗi thao tác không hợp lệ → state transition.</li>
</ul>
<p>Cùng slide 111, đây là đủ danh sách CTFL 2018 (syllabus tách "mức rủi ro" và "loại rủi ro" thành hai — 15 mục; slide gộp lại thành 14).</p>`],
    ]),
    bi(`<h3>🔒 Hidden slides in SWT4_tim.pptx (pptx slides 114–115)</h3>
<p>Two slides after the last visible one are hidden. They come from the <em>older</em> syllabus (CTFL 2011 / the older Graham et al. textbook, §4.6), which split the factors into two groups:</p>
<ul>
<li><strong>Internal factors</strong> (pptx slide 114): models used · tester knowledge/experience · likely defects · test objective · documentation · life cycle model.</li>
<li><strong>External factors</strong> (pptx slide 115): risk · customer/contractual requirements · type of system · regulatory requirements · time and budget.</li>
</ul>
<p>Every item maps onto slides 111–112 (e.g. "likely defects" = expected types of defects, "models used" = the models behind available tools). The grouping is still a handy memory aid: <em>internal</em> = what the test team knows and has; <em>external</em> = what the project, the customer and the law impose. Older exam questions may say "which is an external factor?" — the answer will be one of the five on pptx slide 115.</p>`,
    `<h3>🔒 Slide ẩn trong file SWT4_tim.pptx (slide pptx 114–115)</h3>
<p>Hai slide sau slide hiện cuối cùng bị ẩn. Chúng lấy từ syllabus <em>cũ</em> (CTFL 2011 / giáo trình Graham và cộng sự bản cũ, §4.6), vốn chia các yếu tố thành hai nhóm:</p>
<ul>
<li><strong>Yếu tố bên trong</strong> (slide pptx 114): mô hình được dùng · kiến thức/kinh nghiệm của tester · defect có khả năng xảy ra · mục tiêu test · tài liệu · mô hình vòng đời.</li>
<li><strong>Yếu tố bên ngoài</strong> (slide pptx 115): rủi ro · yêu cầu của khách hàng/hợp đồng · loại hệ thống · yêu cầu quy định · thời gian và ngân sách.</li>
</ul>
<p>Mục nào cũng khớp với slide 111–112 (vd "likely defects" = loại defect dự kiến, "models used" = mô hình đứng sau công cụ sẵn có). Cách chia nhóm vẫn là mẹo nhớ tiện: <em>bên trong</em> = những gì đội test biết và có; <em>bên ngoài</em> = những gì dự án, khách hàng và luật áp đặt. Câu hỏi thi kiểu cũ có thể hỏi "đâu là yếu tố bên ngoài?" — đáp án sẽ là một trong năm mục ở slide pptx 115.</p>`),
    bi(`<h3>Ví dụ có lời giải · "Which technique would you choose?"</h3>
<p><strong>Part 1 — five short scenarios</strong> (the exam style). For each: the deciding factor, then the technique.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Scenario</th><th>Deciding factor(s)</th><th>Choose</th></tr></thead>
<tbody>
<tr><td>1</td><td>Firmware of an insulin pump</td><td>Expected use (safety-critical) · regulatory standards · risk level</td><td>Formal EP + BVA on doses, state transition on pump modes, decision coverage (or stronger) measured by a tool</td></tr>
<tr><td>2</td><td>A hackathon MVP, no written spec, release in two days</td><td>Available documentation (none) · time · iterative SDLC</td><td>Chartered exploratory sessions + error guessing</td></tr>
<tr><td>3</td><td>Car-insurance premium: age band × car type × claims history × discount card</td><td>Complexity · documentation already written as business rules</td><td>Decision table (then BVA on the age bands)</td></tr>
<tr><td>4</td><td>Account locks after 3 wrong passwords, unlocks after 10 minutes (SWT4 slide 80)</td><td>Documentation describes states and events · expected defects = illegal sequences</td><td>State transition testing</td></tr>
<tr><td>5</td><td>Maintenance release of an old payroll module with a list of last year's production failures</td><td>Previous experience · expected types of defects · time and budget</td><td>Error guessing / checklist from the failure list + regression of those areas</td></tr>
</tbody>
</table></div>
<p><strong>Part 2 — one system, several techniques.</strong> Take the SP25 PE context: <em>TravelEase</em>, an online travel-booking website — 12 months, 10 developers, 5 testers; the system must handle high traffic in holiday seasons, search and recommendation must be fast, payment must be secure and error-free. A good answer assigns techniques <em>per feature</em> and justifies each with a factor from slides 111–112:</p>
<div class="table-wrap"><table>
<thead><tr><th>Feature</th><th>Technique</th><th>Justification (factor)</th></tr></thead>
<tbody>
<tr><td>Discount codes SAVE10 / WELCOME5, reward points</td><td>EP + BVA; statement/decision coverage on <code>calculateRewardPoints</code> (lesson 5.2)</td><td>Type of system (financial calculations) · expected defects at boundaries</td></tr>
<tr><td>Booking status Pending → Confirmed → Paid → Cancelled/Refunded</td><td>State transition (0-switch coverage, plus invalid transitions)</td><td>Documentation has a state model · risk (money refunded twice)</td></tr>
<tr><td>Fare rules: season × travellers × VIP × payment method</td><td>Decision table</td><td>Complexity · rules documented by the business</td></tr>
<tr><td>End-to-end "book a package" flow</td><td>Use case testing (main, alternative and exception flows)</td><td>Test objective: confidence in typical operational tasks</td></tr>
<tr><td>Payment module code</td><td>White-box: ≥ 90% decision coverage measured by JaCoCo</td><td>Risk level and type (security, money) · customer requirement "error-free payments"</td></tr>
<tr><td>New recommendation UI, spec still changing</td><td>Exploratory sessions with charters</td><td>Few/changing specs · iterative SDLC</td></tr>
<tr><td>Everything above, before each release</td><td>Checklist-based regression using the course UI checklist</td><td>Consistency across 5 testers · time pressure in peak season</td></tr>
</tbody>
</table></div>
<p>Note what the table does <em>not</em> do: it never says "we use exploratory testing for everything" or "white-box everywhere". Combining techniques is itself the syllabus answer — each technique finds a different kind of defect.</p>
<div class="pitfall"><b>Exam traps.</b> (1) "The best technique is always the most formal one" — false; formality follows the factors on slide 110. (2) "Choose the technique the tester likes best" — tester skill is a factor, preference is not. (3) Mixing up <em>formality</em> factors (slide 110) with <em>choice</em> factors (slides 111–112): "maturity of the organisation" is a formality factor. (4) "Available documentation" cuts both ways: a state diagram suggests state transition testing, no documentation suggests exploratory testing.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>ISO/IEC/IEEE 29119-4 and defect-based selection.</b> The international standard for test techniques, ISO/IEC/IEEE 29119-4, catalogues specification-based techniques (EP, BVA, decision tables, state transitions, cause-effect graphing, pairwise, use cases…), structure-based techniques (statement, branch, decision, MC/DC, data-flow) and one experience-based technique, error guessing — and for each one defines the coverage items and how to measure them. Mature teams also select techniques <em>from their own defect data</em>: classify last year's escaped defects (boundary, rule combination, sequence, data handling…) and invest in the technique that would have caught the biggest class. <em>Outside the syllabus because CTFL 2018 asks only for the factors and the three categories, not for standards or defect-taxonomy-driven selection.</em></div>`,
    `<h3>Ví dụ có lời giải · "Bạn sẽ chọn kỹ thuật nào?"</h3>
<p><strong>Phần 1 — năm tình huống ngắn</strong> (kiểu câu hỏi thi). Với mỗi tình huống: yếu tố quyết định, rồi kỹ thuật.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Tình huống</th><th>Yếu tố quyết định</th><th>Chọn</th></tr></thead>
<tbody>
<tr><td>1</td><td>Firmware của máy bơm insulin</td><td>Cách dùng (an toàn-sống-còn) · chuẩn quy định · mức rủi ro</td><td>EP + BVA hình thức cho liều, state transition cho các chế độ máy, decision coverage (hoặc mạnh hơn) đo bằng công cụ</td></tr>
<tr><td>2</td><td>MVP làm trong hackathon, không có đặc tả viết, phát hành sau hai ngày</td><td>Tài liệu sẵn có (không có) · thời gian · SDLC lặp</td><td>Các phiên exploratory có charter + error guessing</td></tr>
<tr><td>3</td><td>Phí bảo hiểm ô tô: nhóm tuổi × loại xe × lịch sử bồi thường × thẻ giảm giá</td><td>Độ phức tạp · tài liệu đã viết sẵn dưới dạng quy tắc nghiệp vụ</td><td>Decision table (rồi BVA cho các nhóm tuổi)</td></tr>
<tr><td>4</td><td>Tài khoản bị khoá sau 3 lần sai mật khẩu, mở lại sau 10 phút (SWT4 slide 80)</td><td>Tài liệu mô tả trạng thái và sự kiện · defect dự kiến = chuỗi thao tác sai</td><td>State transition testing</td></tr>
<tr><td>5</td><td>Bản bảo trì của một module tính lương cũ, có danh sách failure trên production năm ngoái</td><td>Kinh nghiệm trước đây · loại defect dự kiến · thời gian và ngân sách</td><td>Error guessing / checklist từ danh sách failure + regression các vùng đó</td></tr>
</tbody>
</table></div>
<p><strong>Phần 2 — một hệ thống, nhiều kỹ thuật.</strong> Lấy bối cảnh đề PE SP25: <em>TravelEase</em>, website đặt tour trực tuyến — 12 tháng, 10 developer, 5 tester; hệ thống phải chịu tải cao mùa lễ, tìm kiếm và gợi ý phải nhanh, thanh toán phải an toàn và không lỗi. Một bài làm tốt phân kỹ thuật <em>theo từng tính năng</em> và giải thích mỗi lựa chọn bằng một yếu tố ở slide 111–112:</p>
<div class="table-wrap"><table>
<thead><tr><th>Tính năng</th><th>Kỹ thuật</th><th>Lý do (yếu tố)</th></tr></thead>
<tbody>
<tr><td>Mã giảm giá SAVE10 / WELCOME5, điểm thưởng</td><td>EP + BVA; statement/decision coverage cho <code>calculateRewardPoints</code> (bài 5.2)</td><td>Loại hệ thống (tính toán tiền) · defect dự kiến ở biên</td></tr>
<tr><td>Trạng thái đặt chỗ Pending → Confirmed → Paid → Cancelled/Refunded</td><td>State transition (phủ 0-switch, cộng các chuyển trạng thái không hợp lệ)</td><td>Tài liệu có mô hình trạng thái · rủi ro (hoàn tiền hai lần)</td></tr>
<tr><td>Quy tắc giá vé: mùa × số khách × VIP × phương thức thanh toán</td><td>Decision table</td><td>Độ phức tạp · quy tắc được nghiệp vụ viết thành tài liệu</td></tr>
<tr><td>Luồng đầu-cuối "đặt một gói tour"</td><td>Use case testing (luồng chính, luồng thay thế, luồng ngoại lệ)</td><td>Mục tiêu test: tin tưởng vào các tác vụ vận hành điển hình</td></tr>
<tr><td>Code module thanh toán</td><td>White-box: ≥ 90% decision coverage đo bằng JaCoCo</td><td>Mức và loại rủi ro (bảo mật, tiền) · yêu cầu khách hàng "thanh toán không lỗi"</td></tr>
<tr><td>Giao diện gợi ý mới, đặc tả còn thay đổi</td><td>Các phiên exploratory có charter</td><td>Đặc tả ít/đang đổi · SDLC lặp</td></tr>
<tr><td>Tất cả những thứ trên, trước mỗi lần phát hành</td><td>Regression theo checklist, dùng checklist UI của môn</td><td>Nhất quán giữa 5 tester · áp lực thời gian mùa cao điểm</td></tr>
</tbody>
</table></div>
<p>Để ý điều bảng này <em>không</em> làm: nó không bao giờ nói "dùng exploratory cho mọi thứ" hay "white-box ở mọi nơi". Kết hợp nhiều kỹ thuật chính là đáp án của syllabus — mỗi kỹ thuật tìm một loại defect khác nhau.</p>
<div class="pitfall"><b>Bẫy trong đề.</b> (1) "Kỹ thuật tốt nhất luôn là kỹ thuật hình thức nhất" — sai; mức hình thức đi theo các yếu tố ở slide 110. (2) "Chọn kỹ thuật tester thích nhất" — kỹ năng của tester là một yếu tố, sở thích thì không. (3) Lẫn yếu tố <em>mức hình thức</em> (slide 110) với yếu tố <em>chọn kỹ thuật</em> (slide 111–112): "độ trưởng thành của tổ chức" là yếu tố hình thức. (4) "Tài liệu sẵn có" có hai chiều: có sơ đồ trạng thái thì gợi ý state transition testing, không có tài liệu thì gợi ý exploratory testing.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>ISO/IEC/IEEE 29119-4 và chọn kỹ thuật theo dữ liệu defect.</b> Chuẩn quốc tế về kỹ thuật test, ISO/IEC/IEEE 29119-4, liệt kê các kỹ thuật dựa đặc tả (EP, BVA, decision table, state transition, cause-effect graph, pairwise, use case…), dựa cấu trúc (statement, branch, decision, MC/DC, data-flow) và một kỹ thuật dựa kinh nghiệm là error guessing — và với mỗi kỹ thuật định nghĩa coverage item và cách đo. Các đội trưởng thành còn chọn kỹ thuật <em>từ chính dữ liệu defect của mình</em>: phân loại các defect lọt ra production năm trước (biên, tổ hợp quy tắc, chuỗi thao tác, xử lý dữ liệu…) rồi đầu tư vào kỹ thuật lẽ ra bắt được nhóm lớn nhất. <em>Ngoài giáo trình vì CTFL 2018 chỉ hỏi các yếu tố và ba nhóm kỹ thuật, không hỏi chuẩn hay việc chọn kỹ thuật theo phân loại defect.</em></div>`),
    books([
      ['fst4', 'Ch.4 §1 "Categories of test techniques", incl. choosing test techniques — book pp.106–111 (PDF pp.120–125); chapter review p.143', 'Chương 4 §1 "Categories of test techniques", gồm phần chọn kỹ thuật test — trang sách 106–111 (PDF 120–125); ôn chương trang 143'],
      ['fst', '§4.6 "Choosing a test technique" — internal and external factors (the source of hidden pptx slides 114–115) — pp.114–116 (PDF pp.117–119)', '§4.6 "Choosing a test technique" — yếu tố bên trong và bên ngoài (nguồn của slide pptx ẩn 114–115) — trang 114–116 (PDF 117–119)'],
      ['sp5', '§5.4 "Selecting the Right Technique" — PDF pp.240–243', '§5.4 "Selecting the Right Technique" — PDF 240–243'],
      ['sp4', '§5.4 "Summary" — the paragraphs on how tester experience, risk and documentation drive the choice of techniques, p.164 (PDF p.179)', '§5.4 "Summary" — các đoạn về việc kinh nghiệm tester, rủi ro và tài liệu quyết định lựa chọn kỹ thuật, trang 164 (PDF 179)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────────────── Quiz 6 ─────────────────────────────────── */
const QUIZ6 = {
  title: 'Quiz 6 — Experience-based techniques & choosing techniques|||Quiz 6 — Kỹ thuật dựa kinh nghiệm & chọn kỹ thuật',
  slug: 'swt301-quiz-6',
  type: 'QUIZ',
  description: '15 câu: đủ 3 câu "Question" trên slide SWT4 (s.106–108) + 12 câu về error guessing, exploratory, checklist-based, mức hình thức và các yếu tố chọn kỹ thuật (kể cả slide ẩn).',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Which of the following is a good reason to use experience-based testing? (SWT4 s.106)|||Đâu là lý do tốt để dùng kiểm thử dựa kinh nghiệm? (SWT4 s.106)', ['You can find defects that might be missed by more formal techniques|||Tìm được defect mà các kỹ thuật chính thức hơn có thể bỏ sót', 'You can test for defects that only experienced users would encounter|||Test được những defect chỉ người dùng có kinh nghiệm mới gặp', 'You can target the developer\'s efforts to the areas users will be more likely to use|||Hướng công sức của developer vào vùng người dùng hay dùng', 'It is supported by strong tools and can be automated|||Được công cụ mạnh hỗ trợ và tự động hoá được'], 0),
      q('When exploratory testing is conducted using time-boxing and test charters, what is it called? (s.107)|||Khi exploratory testing được thực hiện với khung thời gian và test charter, nó được gọi là gì? (s.107)', ['Schedule-based testing', 'Session-based testing', 'Risk-based testing', 'Formal chartering'], 1),
      q('What is error guessing? (s.108)|||Error guessing là gì? (s.108)', ['A technique used for assessing defect metrics|||Kỹ thuật đánh giá số liệu defect', 'A development technique to verify that all error paths have been coded|||Kỹ thuật phát triển để kiểm mọi nhánh lỗi đã được code', 'A testing technique used to guess where a developer is likely to have made a mistake|||Kỹ thuật test dùng để đoán chỗ developer có khả năng mắc sai sót', 'A planning technique to anticipate schedule variances due to faults|||Kỹ thuật lập kế hoạch để lường trước chậm tiến độ do lỗi'], 2),
      q('According to slide 101, what is TRUE about the coverage of experience-based techniques?|||Theo slide 101, phát biểu nào ĐÚNG về coverage của kỹ thuật dựa kinh nghiệm?', ['It is always 100%|||Luôn đạt 100%', 'It can be difficult to assess and may be unmeasurable|||Có thể khó đánh giá và có thể không đo được', 'It is measured in statements|||Được đo theo câu lệnh', 'It is fixed by the checklist|||Do checklist cố định'], 1),
      q('A methodical approach to error guessing starts by… (s.102)|||Cách tiếp cận có phương pháp cho error guessing bắt đầu bằng… (s.102)', ['running random inputs|||chạy input ngẫu nhiên', 'creating a list of possible mistakes, defects and failures|||lập danh sách sai sót, defect và failure có thể xảy ra', 'measuring decision coverage|||đo decision coverage', 'writing a detailed test procedure|||viết thủ tục test chi tiết'], 1),
      q('Exploratory testing is MOST useful when… (s.104)|||Exploratory testing hữu ích NHẤT khi… (s.104)', ['specifications are complete and formally reviewed|||đặc tả đầy đủ và đã review chính thức', 'there are few or inadequate specifications or significant time pressure|||đặc tả ít hoặc không đầy đủ, hoặc áp lực thời gian lớn', 'regulators require traceable evidence|||cơ quan quản lý đòi bằng chứng truy vết được', 'all tests must be automated|||mọi test phải được tự động hoá'], 1),
      q('In session-based testing, what guides the tester during the time-box? (s.104)|||Trong session-based testing, điều gì định hướng tester trong khung thời gian? (s.104)', ['A test charter containing test objectives|||Một test charter chứa các mục tiêu test', 'A detailed test script|||Một test script chi tiết', 'The code coverage report|||Báo cáo code coverage', 'The defect backlog only|||Chỉ danh sách defect tồn đọng'], 0),
      q('Which statement about exploratory testing is TRUE? (s.103)|||Phát biểu nào ĐÚNG về exploratory testing? (s.103)', ['Tests are fully designed before execution starts|||Test được thiết kế xong trước khi bắt đầu chạy', 'Test design and execution happen in parallel and results guide further tests|||Thiết kế và thực thi diễn ra song song và kết quả định hướng các test tiếp theo', 'It needs no logging at all|||Hoàn toàn không cần ghi chép', 'It can only be done by developers|||Chỉ developer mới làm được'], 1),
      q('Checklists for checklist-based testing are built from all of the following EXCEPT… (s.105)|||Checklist cho checklist-based testing được xây từ tất cả những điều sau, TRỪ… (s.105)', ['the experience of the tester|||kinh nghiệm của tester', 'knowledge about what is important for the user|||hiểu biết về điều quan trọng với người dùng', 'understanding of why and how software fails|||hiểu vì sao và bằng cách nào phần mềm hỏng', 'the statement-coverage report of the build|||báo cáo statement coverage của bản build'], 3),
      q('Which factor influences how FORMALLY techniques are used (slide 110)?|||Yếu tố nào ảnh hưởng tới mức HÌNH THỨC khi dùng kỹ thuật (slide 110)?', ['The maturity of the organisation|||Độ trưởng thành của tổ chức', 'The number of screens in the UI|||Số màn hình của giao diện', 'The version of the operating system|||Phiên bản hệ điều hành', 'The colour scheme of the application|||Bảng màu của ứng dụng'], 0),
      q('According to the teacher\'s notes on slide 111, the aircraft industry requires which techniques for high-integrity systems?|||Theo ghi chú của thầy/cô ở slide 111, ngành hàng không yêu cầu kỹ thuật nào cho hệ thống độ toàn vẹn cao?', ['Error guessing and exploratory testing|||Error guessing và exploratory testing', 'EP, BVA and state transition testing|||EP, BVA và state transition testing', 'Use case testing only|||Chỉ use case testing', 'Checklist-based testing only|||Chỉ checklist-based testing'], 1),
      q('The specification already contains a state diagram for the order life cycle. Which technique does the "available documentation" factor suggest? (s.111)|||Đặc tả đã có sẵn sơ đồ trạng thái cho vòng đời đơn hàng. Yếu tố "tài liệu sẵn có" gợi ý kỹ thuật nào? (s.111)', ['State transition testing', 'Error guessing', 'Statement coverage', 'Exploratory testing'], 0),
      q('Per the notes on slide 112, an iterative SDLC tends to favour…|||Theo ghi chú slide 112, SDLC dạng lặp thường ưu tiên…', ['more formal techniques|||kỹ thuật hình thức hơn', 'an exploratory test approach|||cách tiếp cận test khám phá', 'no testing until the last iteration|||không test cho tới vòng lặp cuối', 'white-box testing only|||chỉ test white-box'], 1),
      q('Complex business rules with many combinations of conditions. Best technique?|||Quy tắc nghiệp vụ phức tạp với nhiều tổ hợp điều kiện. Kỹ thuật hợp nhất?', ['Decision table testing', 'Error guessing', 'Statement coverage', 'Checklist-based testing'], 0),
      q('Hidden slide pptx 115 lists EXTERNAL factors. Which one is external?|||Slide ẩn pptx 115 liệt kê các yếu tố BÊN NGOÀI. Đâu là yếu tố bên ngoài?', ['Tester knowledge/experience|||Kiến thức/kinh nghiệm của tester', 'Likely defects|||Defect có khả năng xảy ra', 'Regulatory requirements|||Yêu cầu quy định', 'Models used|||Mô hình được dùng'], 2),
    ],
  },
};

export default {
  title: 'Chapter 6 — Experience-based techniques|||Chương 6 — Kỹ thuật dựa kinh nghiệm',
  description: 'SWT4 slide 100–112 học từng slide: error guessing, exploratory testing (charter + phiếu phiên mẫu), checklist-based testing theo checklist của môn, và cách chọn kỹ thuật test — kèm đáp án mọi câu hỏi trên slide và 2 slide ẩn.',
  lessons: [L61, L62, QUIZ6],
};
