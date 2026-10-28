/**
 * Kỹ năng nghề · 📝 3.2 — Cấu trúc báo cáo lab (khuôn FPT / Report 5.x): thứ tự mục, nội dung vào mục nào, tính thống kê,
 * Kết quả vs Phân tích vs Kết luận, hình/bảng/bằng chứng. Số liệu thật SportShop module A.
 */
import { moDun, sapXep, phanLoai, tracNghiem, TN } from './_chung.mjs';

const R1 = sapXep({
  tieuDe: 'Report 1 — Order the sections of a lab report',
  doKho: 'EASY', phut: 5,
  moTa: {
    en: '<p>FPT lab reports and the test reports of SWT301 (Report 5.1 / 5.2 / 5.3) follow the scientific-report order: why you did it, with what, how, what came out, what it means, what you conclude — and the raw evidence at the back. A reader who knows the order finds anything in seconds. Order the sections, then the four sentences of a good results paragraph.</p>',
    vi: '<p>Báo cáo lab ở FPT và báo cáo kiểm thử SWT301 (Report 5.1 / 5.2 / 5.3) theo thứ tự báo cáo khoa học: làm để làm gì, bằng gì, làm thế nào, ra kết quả gì, nghĩa là gì, kết luận gì — và bằng chứng thô ở cuối. Người đọc biết thứ tự này tìm được mọi thứ trong vài giây. Sắp các mục, rồi bốn câu của một đoạn kết quả tốt.</p>',
  },
  cau: [
    {
      en: 'Sections of a lab report', vi: 'Các mục của báo cáo lab',
      dung: ['Summary (5–8 lines: result + conclusion)', 'Purpose and scope', 'Environment (system, tools, data)', 'Method (procedure, rounds, criteria)', 'Results (tables, figures, no opinions)', 'Analysis (why the results look like this)', 'Conclusion and recommendations', 'Appendix (evidence: logs, screenshots, raw data)'],
      giai: ['The summary goes first even though you write it last; evidence goes to the appendix so the body stays readable.', 'Tóm tắt đặt đầu dù viết sau cùng; bằng chứng xuống phụ lục để thân báo cáo dễ đọc.'],
    },
    {
      en: 'Sentences of one results paragraph', vi: 'Các câu của một đoạn kết quả',
      dung: ['Claim: “Integration results did not change across rounds.”', 'Numbers: “16 of 22 cases passed in rounds 1, 2 and 3 (72.73%).”', 'Reference: “Table 3 and the Newman reports R1–R3 in Appendix B.”', 'Meaning: “The 6 failures are reproducible defects, not flaky tests.”'],
      giai: ['Claim → numbers → where to verify → what it means. The meaning sentence leads into the analysis.', 'Khẳng định → số liệu → kiểm ở đâu → nghĩa là gì. Câu ý nghĩa dẫn sang phần phân tích.'],
    },
  ],
  goiY: ['Tóm tắt luôn ở đầu; phụ lục luôn ở cuối.', 'Kết quả chỉ nêu sự việc; "vì sao" thuộc phân tích; "nên làm gì" thuộc kết luận.'],
  loiHayGap: ['Trộn phân tích vào bảng kết quả — người đọc không tách được số và ý kiến.', 'Đặt ảnh chụp giữa thân bài — 144 ảnh làm báo cáo dài 100 trang.', 'Để tóm tắt ở cuối — người chấm đọc câu đầu và không thấy kết quả.'],
  thuatNgu: [{ en: 'scope', vi: 'phạm vi — cái gì được kiểm, cái gì không' }, { en: 'appendix', vi: 'phụ lục' }, { en: 'procedure', vi: 'quy trình thực hiện' }],
  khaiNiem: ['report structure'],
});

const MUC = ['Purpose and scope', 'Environment', 'Method', 'Results', 'Analysis', 'Conclusion', 'Appendix'];
const R2 = phanLoai({
  tieuDe: 'Report 2 — Which section does each piece of content belong to?',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p>The draft of the SportShop Lab 4 report (Report 5.3, module A) has its content in one long list. Put each piece into the right section. The test: <b>Results</b> state what happened with numbers; <b>Analysis</b> explains why; <b>Conclusion</b> says what to do; <b>Method</b> says how you would repeat it; <b>Environment</b> says on what.</p>',
    vi: '<p>Bản nháp báo cáo Lab 4 SportShop (Report 5.3, module A) để mọi nội dung trong một danh sách dài. Đưa mỗi mảnh vào đúng mục. Cách phân biệt: <b>Kết quả</b> nêu chuyện gì xảy ra kèm số; <b>Phân tích</b> giải thích vì sao; <b>Kết luận</b> nói nên làm gì; <b>Phương pháp</b> nói làm lại thế nào; <b>Môi trường</b> nói chạy trên gì.</p>',
  },
  cotCau: 'Content',
  cot: 'Section',
  luaChon: MUC,
  hang: [
    ['Scope: module A (Authentication & Account) only; modules B–E are out of scope.', MUC[0], 'Phạm vi: chỉ module A; module B–E nằm ngoài phạm vi.'],
    ['Tomcat 10.1, SQL Server in Docker (container sportshop-mssql), Chromium driven by Playwright.', MUC[1], 'Tomcat 10.1, SQL Server trong Docker, Chromium điều khiển bằng Playwright.'],
    ['Each case starts from the seed data; 3 rounds; one screenshot per step per round.', MUC[2], 'Mỗi ca bắt đầu từ dữ liệu mẫu; 3 round; mỗi bước mỗi round một ảnh.'],
    ['12 of 18 cases pass in each of the 3 rounds (66.67%).', MUC[3], '12/18 ca đạt ở mỗi round (66,67%).'],
    ['Three of the six failures (AC05–AC07) cluster in the account-management pages: profile update and logout.', MUC[4], 'Ba trong sáu ca fail (AC05–AC07) dồn vào trang quản lý tài khoản: cập nhật hồ sơ và đăng xuất.'],
    ['Do not release module A yet; fix SS-31 (logout) and SS-27 (false success message) first.', MUC[5], 'Chưa phát hành module A; sửa SS-31 và SS-27 trước.'],
    ['144 screenshots named &lt;case&gt;_S&lt;step&gt;_R&lt;round&gt;.jpg, e.g. RL02_S1_R1.jpg.', MUC[6], '144 ảnh đặt tên &lt;ca&gt;_S&lt;bước&gt;_R&lt;round&gt;.jpg.'],
    ['Identical rounds on a freshly loaded database show the failures are not caused by dirty data.', MUC[4], 'Các round giống nhau trên CSDL nạp lại cho thấy fail không do dữ liệu bẩn.'],
    ['Purpose: verify that the customer journeys of module A meet the SRS end to end.', MUC[0], 'Mục đích: kiểm các hành trình khách hàng của module A đúng SRS từ đầu tới cuối.'],
  ],
  giaiBang: ['A sentence with “because / shows that” is analysis; a sentence with “should / do not / fix first” is a conclusion; a bare count is a result.', 'Câu có "vì / cho thấy" là phân tích; câu có "nên / chưa / sửa trước" là kết luận; câu chỉ có số đếm là kết quả.'],
  goiY: ['Câu "cho thấy…" ⇒ phân tích, kể cả khi có số.', 'Tên tệp ảnh, log ⇒ phụ lục.'],
  loiHayGap: ['Đặt "đề xuất sửa trước" vào kết quả.', 'Đặt cách đặt tên ảnh vào phương pháp thay vì phụ lục (phương pháp chỉ cần nói "mỗi bước một ảnh").'],
  giaiThich: '<p>Purpose · Environment · Method · Results · Analysis · Conclusion · Appendix · Analysis · Purpose.</p>',
  thuatNgu: [{ en: 'results vs analysis', vi: 'kết quả (chuyện gì) và phân tích (vì sao)' }, TN.evidence],
  khaiNiem: ['report sections'],
});

const SO = ['82.30%', '72.73%', '66.67%', '100.00%', '33.33%', '290.49 TC/KLOC', '29.05 TC/KLOC', '81.42%'];
const R3 = phanLoai({
  tieuDe: 'Report 3 — Compute the statistics exactly as the report shows them',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: `<p>The statistics block of Report 5.x uses two ratios, shown with <b>two decimals</b>: <b>test coverage</b> = (Pass + Fail) ÷ Total (how much was executed) and <b>successful coverage</b> = Pass ÷ Total (how much passed). Test density = cases ÷ KLOC. Real numbers of SportShop module A:</p>
<ul><li>Lab 2 (unit): 113 cases, 93 pass, 20 fail, module size 389 lines of code;</li>
<li>Lab 3 (integration): 22 cases, 16 pass, 6 fail;</li>
<li>Lab 4 (system): 18 cases, 12 pass, 6 fail.</li></ul>
<p>Choose the exact value for each row.</p>`,
    vi: '<p>Khối thống kê của Report 5.x dùng hai tỉ lệ, ghi <b>hai chữ số thập phân</b>: <b>test coverage</b> = (Pass + Fail) ÷ Tổng (đã chạy được bao nhiêu) và <b>successful coverage</b> = Pass ÷ Tổng (đạt bao nhiêu). Mật độ test = số ca ÷ KLOC. Số thật module A SportShop: Lab 2 có 113 ca, 93 đạt, 20 fail, module 389 dòng mã; Lab 3 có 22 ca, 16 đạt, 6 fail; Lab 4 có 18 ca, 12 đạt, 6 fail. Chọn giá trị đúng cho mỗi dòng.</p>',
  },
  cotCau: 'Statistic',
  cot: 'Value',
  luaChon: SO,
  hang: [
    ['Lab 2 successful coverage', SO[0], 'Successful coverage Lab 2'],
    ['Lab 3 successful coverage', SO[1], 'Successful coverage Lab 3'],
    ['Lab 4 successful coverage', SO[2], 'Successful coverage Lab 4'],
    ['Lab 2 test coverage', SO[3], 'Test coverage Lab 2'],
    ['Lab 4 failure rate (Fail ÷ Total)', SO[4], 'Tỉ lệ fail Lab 4'],
    ['Lab 2 test density (cases per 1,000 lines)', SO[5], 'Mật độ test Lab 2'],
  ],
  giaiBang: ['93 ÷ 113 = 82.30% · 16 ÷ 22 = 72.73% · 12 ÷ 18 = 66.67% · 113 ÷ 113 = 100.00% · 6 ÷ 18 = 33.33% · 113 ÷ 0.389 = 290.49 cases per KLOC (the rule asks ≥ 100).', '93 ÷ 113 = 82,30% · 16 ÷ 22 = 72,73% · 12 ÷ 18 = 66,67% · 113 ÷ 113 = 100,00% · 6 ÷ 18 = 33,33% · 113 ÷ 0,389 = 290,49 ca/KLOC (quy định ≥ 100).'],
  goiY: ['Successful coverage chỉ dùng Pass; test coverage dùng Pass + Fail.', 'KLOC = nghìn dòng ⇒ 389 dòng = 0,389 KLOC.'],
  loiHayGap: ['Chia cho 389 thay vì 0,389 ⇒ 0,29 ca/KLOC (hoặc lệch 10 lần nếu chia 3,89).', 'Làm tròn một chữ số thập phân (82,3%) trong khi template ghi hai (82,30%).', 'Dùng tỉ lệ của lab khác.'],
  giaiThich: '<p>82.30% · 72.73% · 66.67% · 100.00% · 33.33% · 290.49 TC/KLOC.</p>',
  thuatNgu: [TN.successfulCoverage, { en: 'test coverage (execution)', vi: '(Pass + Fail) ÷ Tổng — tỉ lệ ca đã chạy' }, { en: 'KLOC', vi: 'nghìn dòng mã' }],
  khaiNiem: ['test statistics'],
});

const R4 = tracNghiem({
  tieuDe: 'Report 4 — Results, analysis or conclusion?',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>The commonest weakness teachers mark in student reports: the analysis repeats the results, and the conclusion is “we learned a lot”. Each part has a different job. Answer these questions about where things belong and what a good conclusion contains.</p>',
    vi: '<p>Điểm yếu thầy cô hay trừ nhất trong báo cáo sinh viên: phần phân tích nhắc lại kết quả, còn kết luận là "em học được nhiều điều". Mỗi phần có một việc khác nhau. Trả lời các câu về nội dung nào thuộc phần nào và kết luận tốt gồm gì.</p>',
  },
  cau: [
    { en: 'Where do you explain why UserDAO branch coverage is 83% while every servlet is at 100%?', vi: 'Giải thích vì sao độ phủ nhánh UserDAO 83% trong khi mọi servlet 100% ở đâu?', lc: [['a', 'Results'], ['b', 'Analysis'], ['c', 'Environment'], ['d', 'Purpose']], dap: 'b', giai: ['“Why” is analysis: unreachable compiler-generated branches.', '"Vì sao" là phân tích: nhánh do trình biên dịch sinh ra không tới được.'] },
    { en: 'Which is a proper conclusion?', vi: 'Câu nào là kết luận đúng nghĩa?', lc: [['a', '“We learned a lot about testing.”'], ['b', '“Module A is not ready for release: 5 open defects, SS-31 blocks logout on two pages. Fix SS-31 and SS-27, then re-run AC05–AC07.”'], ['c', '“Testing is important.”'], ['d', '“The results are shown in Table 3.”']], dap: 'b', giai: ['A verdict against the purpose, the evidence in one clause, and next actions.', 'Phán quyết so với mục đích, bằng chứng một vế, và việc tiếp theo.'] },
    { en: 'Which sentence belongs in Results?', vi: 'Câu nào thuộc Kết quả?', lc: [['a', '“The developers should hash passwords.”'], ['b', '“IT06 failed in rounds 1–3: the Password column contains the plain text Sport@2026.”'], ['c', '“This shows the team did not think about security.”'], ['d', '“Security is very important nowadays.”']], dap: 'b', giai: ['A fact with its observation; no judgement, no advice.', 'Một sự việc kèm quan sát; không phán xét, không khuyên.'] },
    { en: 'The analysis section should mainly…', vi: 'Phần phân tích chủ yếu nên…', lc: [['a', 'repeat the table in sentences'], ['b', 'find patterns and causes: which kind of defect, where they cluster, why rounds match'], ['c', 'list what each member did'], ['d', 'describe the tools in detail']], dap: 'b', giai: ['Patterns and causes add what the table cannot say by itself.', 'Quy luật và nguyên nhân bổ sung điều bảng tự nó không nói được.'] },
    { en: 'Where do “lessons learned” go in a technical report?', vi: '"Bài học rút ra" đặt ở đâu trong báo cáo kỹ thuật?', lc: [['a', 'Mixed into the results'], ['b', 'A short subsection after the conclusion, each lesson tied to a piece of evidence'], ['c', 'In the title'], ['d', 'Nowhere — reports have no lessons']], dap: 'b', giai: ['Lessons are valuable when they point at evidence (“IT05 shows …”).', 'Bài học có giá trị khi chỉ vào bằng chứng ("IT05 cho thấy…").'] },
  ],
  goiY: ['Kết quả = chuyện gì; Phân tích = vì sao; Kết luận = vậy nên làm gì.', 'Kết luận phải trả lời đúng câu hỏi của mục Mục đích.'],
  loiHayGap: ['Kết luận chung chung ("em học được nhiều").', 'Viết lời khuyên trong phần kết quả.'],
  thuatNgu: [{ en: 'verdict', vi: 'phán quyết — đạt/chưa đạt so với mục đích' }, { en: 'lessons learned', vi: 'bài học rút ra' }],
  khaiNiem: ['analysis', 'conclusion'],
});

const R5 = tracNghiem({
  tieuDe: 'Report 5 — Tables, figures and evidence references',
  doKho: 'MEDIUM', phut: 5,
  moTa: {
    en: '<p>Figures and tables carry most of the information in a test report, and they are where marks are lost silently: a screenshot without a caption, a table nobody refers to, evidence that cannot be found from the text. Choose the better practice.</p>',
    vi: '<p>Hình và bảng mang phần lớn thông tin của báo cáo kiểm thử, và cũng là chỗ mất điểm âm thầm: ảnh không chú thích, bảng không ai nhắc tới, bằng chứng không tìm được từ văn bản. Chọn cách làm tốt hơn.</p>',
  },
  cau: [
    { en: 'A table of the 3 rounds is in the report. What must the text do?', vi: 'Báo cáo có bảng 3 round. Văn bản phải làm gì?', lc: [['a', 'Nothing, the table speaks for itself'], ['b', 'Refer to it by number and state its key point: “Table 3: results were identical in all rounds (16/22).”'], ['c', 'Copy every cell into a paragraph'], ['d', 'Put it after the appendix']], dap: 'b', giai: ['Every table/figure is numbered, captioned and referred to with its message.', 'Mọi bảng/hình được đánh số, chú thích, và được nhắc tới kèm thông điệp.'] },
    { en: 'Where does a caption go and what does it say?', vi: 'Chú thích đặt đâu và nói gì?', lc: [['a', 'Anywhere; “Image”'], ['b', 'Tables: above; figures: below; it says what, where and when — “Figure 4. RL02 step 1, round 1: guest sees HTTP 500 (SS-19).”'], ['c', 'Only in the file name'], ['d', 'Captions are optional']], dap: 'b', giai: ['The usual academic convention, and a caption that stands alone.', 'Quy ước học thuật thông dụng, và chú thích đọc riêng vẫn hiểu.'] },
    { en: 'The text claims “IT17 changed another user’s password”. How do you support it?', vi: 'Văn bản viết "IT17 đổi mật khẩu người khác". Dẫn chứng thế nào?', lc: [['a', '“Trust us.”'], ['b', 'Cite the evidence: “see the SELECT before/after in Appendix B, db-queries.log, round 1”'], ['c', 'Paste the whole log into the text'], ['d', 'Mention it only in the slides']], dap: 'b', giai: ['A precise pointer lets the reader verify in one step without bloating the body.', 'Một con trỏ chính xác cho người đọc kiểm trong một bước mà thân bài không phình.'] },
    { en: 'Your report has 144 screenshots. How do you include them?', vi: 'Báo cáo có 144 ảnh. Đưa vào thế nào?', lc: [['a', 'All in the results section, full size'], ['b', 'One or two representative figures in the body; all 144 in the appendix / evidence sheet, named consistently'], ['c', 'None — too many'], ['d', 'Only the passing ones']], dap: 'b', giai: ['Body = readable story; appendix = complete evidence, failures included.', 'Thân bài = câu chuyện dễ đọc; phụ lục = bằng chứng đủ, kể cả ca fail.'] },
  ],
  goiY: ['Bảng/hình: đánh số + chú thích + được nhắc trong văn bản.', 'Bằng chứng đầy đủ để phụ lục; thân bài chỉ chọn hình đại diện.'],
  loiHayGap: ['Chú thích kiểu "Hình 1" không nói gì.', 'Chỉ đưa ảnh ca đạt — báo cáo trông đẹp nhưng không trung thực.'],
  thuatNgu: [{ en: 'caption', vi: 'chú thích hình/bảng' }, { en: 'cross-reference', vi: 'tham chiếu chéo ("xem Bảng 3")' }, TN.evidence],
  khaiNiem: ['figures and tables'],
});

export default moDun({
  slug: 'ssg105-3-2-lab-report-structure',
  ten: '3.2 Lab report structure: sections, statistics, results vs analysis',
  moTaModule: 'Thứ tự mục của báo cáo lab/Report 5.x, xếp nội dung báo cáo Lab 4 SportShop vào đúng mục, tính thống kê đúng định dạng (82,30% · 72,73% · 66,67% · 290,49 ca/KLOC), phân biệt kết quả/phân tích/kết luận, hình bảng và dẫn chứng.',
  baiHoc: 'ssg105-3-1-writing',
  de: [R1, R2, R3, R4, R5],
});
