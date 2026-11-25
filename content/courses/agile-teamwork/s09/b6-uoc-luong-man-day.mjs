/**
 * 9.6 — Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm và rủi ro (agl-9-6-uoc-luong-man-day). Soạn 24/11/2026.
 * Số liệu: bảng Uoc-luong-man-day-mau.xlsx do LibreOffice tính (ΣE 65,6 h; σ 3,46 h; 69,1 h; 9 MD) + mô phỏng chạy thật
 * scratchpad/agl/lab/uoc-luong/mo-phong.mjs (Node 22.22.2, hạt giống cố định).
 * Nguồn: PERT — Văn phòng Dự án Đặc biệt Hải quân Mỹ, chương trình Polaris (1958); F. Brooks, The Mythical Man-Month (1975);
 * B. Boehm, Software Engineering Economics (1981) và S. McConnell, Software Estimation: Demystifying the Black Art (2006) — nón bất định
 * (0,25×–4× ở giai đoạn khởi đầu); D. Kahneman & A. Tversky (1979) — "planning fallacy".
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ac, ag, vo, taiMau } from '../_chung.mjs';
import { UL, UL_COT, UL_TONG, bangHtml } from '../_mau.mjs';

// Giá trị LibreOffice đã tính (cột G, H) — chép từ CSV xuất ra, khớp công thức trên sheet.
const E_TINH = ['4.5', '2.2', '6.3', '6.7', '6.7', '5.2', '6.3', '4.2', '6.2', '6.3', '4.7', '4.3', '2'];
const S_TINH = ['0.83', '0.5', '1', '1.33', '1.33', '0.83', '1', '0.5', '0.83', '1', '1.33', '1', '0.33'];
const tinh = UL.hang.map((_, r) => ({ 6: E_TINH[r], 7: S_TINH[r] }));

const MO_PHONG = js(`
// Mô phỏng 100 000 lần "làm thật" chức năng 13 hạng mục: mỗi hạng mục rút ngẫu nhiên theo phân phối tam giác (O, M, P).
// Hạt giống cố định ⇒ chạy lại ra đúng số này.
const HM = [[3,4,8],[1,2,4],[4,6,10],[4,6,12],[4,6,12],[3,5,8],[4,6,10],[3,4,6],[4,6,9],[4,6,10],[2,4,10],[2,4,8],[1,2,3]];
let s = 20261124;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const tamGiac = (o, m, p) => { const u = rnd(), c = (m - o) / (p - o);
  return u < c ? o + Math.sqrt(u * (p - o) * (m - o)) : p - Math.sqrt((1 - u) * (p - o) * (p - m)); };
const N = 100000, tong = [];
for (let i = 0; i < N; i++) tong.push(HM.reduce((a, [o, m, p]) => a + tamGiac(o, m, p), 0));
tong.sort((a, b) => a - b);
const xacSuat = (h) => (100 * tong.filter((t) => t <= h).length / N).toFixed(1);
// … in: cộng M, cộng O, hứa 8 / 8,5 / 9 / 10 MD, trung vị, mốc 90 %`);
const MO_PHONG_OUT = out(`$ node mo-phong.mjs
Cộng các số khả dĩ M: 61 h = 7.6 MD   → xác suất xong kịp: 1.8 %
Cộng các số lạc quan O: 39 h = 4.9 MD → xác suất xong kịp: 0.0 %
Hứa 8 MD (64 h)                       → xác suất xong kịp: 9.0 %
Hứa 8.5 MD (68 h)                     → xác suất xong kịp: 34.2 %
Hứa 9 MD (72 h)                       → xác suất xong kịp: 69.3 %
Hứa 10 MD (80 h)                      → xác suất xong kịp: 99.2 %
Trung vị: 69.7 h · 90 % số lần xong trong: 75.3 h`);

export const L96 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.6 — Estimating in man-days: WBS, buffer, three-point estimates and risk', '9.6 — Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm và rủi ro')}</h2>
<p class="lead">${t(
    '"How many days do you need for this?" is the question you will hear most in your first month. The honest answer is not a single number pulled from the air, and it is certainly not the time it takes you to type the code. This lesson teaches the method outsourcing teams use — break the work down, estimate each piece with three numbers, add what juniors forget, and state the risk — and then shows with a real simulation why adding up "likely" numbers almost guarantees you will be late.',
    '"Việc này em cần mấy ngày?" là câu bạn nghe nhiều nhất tháng đầu. Câu trả lời trung thực không phải một con số chộp từ không khí, càng không phải thời gian gõ xong code. Bài này dạy cách đội outsourcing làm — chia nhỏ việc, ước mỗi phần bằng ba con số, cộng những thứ người mới hay quên, và nói rõ rủi ro — rồi dùng một mô phỏng chạy thật để cho thấy vì sao cộng các con số "khả dĩ" gần như chắc chắn khiến bạn trễ.')}</p>

<h3>${t('Units: man-hour, man-day, man-month', 'Đơn vị: man-hour, man-day, man-month')}</h3>
<ul>
<li>${t('<strong>Man-day (MD, 人日 nin-nichi)</strong>: one person working one standard day — usually 8 hours of <em>effort</em>.', '<strong>Man-day (MD, 人日 nin-nichi)</strong>: một người làm một ngày chuẩn — thường 8 giờ <em>công</em>.')}</li>
<li>${t('<strong>Man-month (MM, 人月 nin-getsu)</strong>: about 20–22 MD depending on the contract. Prices in outsourcing are quoted per MM.', '<strong>Man-month (MM, 人月 nin-getsu)</strong>: khoảng 20–22 MD tuỳ hợp đồng. Giá outsourcing thường báo theo MM.')}</li>
<li>${t('<strong>Effort ≠ duration</strong>: 4 MD of effort may take 6 calendar days if you also attend meetings, fix other bugs and wait for answers. A real working day gives perhaps 6–6.5 focused hours. Say which one you mean.', '<strong>Công ≠ thời lượng</strong>: 4 MD công có thể kéo dài 6 ngày lịch nếu bạn còn họp, sửa bug khác, chờ câu trả lời. Một ngày làm thật có lẽ chỉ được 6–6,5 giờ tập trung. Nói rõ bạn đang nói cái nào.')}</li>
</ul>

<h3>${t('Man-days vs story points (chapter 2)', 'Man-day và story point (chương 2)')}</h3>
${bang(['', t('Story points', 'Story point'), t('Man-days', 'Man-day')], [
    [t('Measures', 'Đo'), t('Relative size/complexity, team-specific', 'Độ lớn/độ phức tạp tương đối, riêng của đội'), t('Absolute effort of a person', 'Công tuyệt đối của một người')],
    [t('Turned into dates by', 'Đổi ra ngày nhờ'), t('Velocity measured over sprints', 'Velocity đo qua các sprint'), t('Directly (÷ people, + calendar)', 'Trực tiếp (÷ số người, + lịch)')],
    [t('Used for', 'Dùng cho'), t('Planning inside a product team', 'Lập kế hoạch trong đội sản phẩm'), t('Prices, contracts, invoices, CRs', 'Báo giá, hợp đồng, hoá đơn, CR')],
    [t('Why outsourcing needs it', 'Vì sao outsourcing cần'), '—', t('The customer pays money; money is counted in MM/MD', 'Khách trả tiền; tiền được đếm bằng MM/MD')],
  ])}
<p>${t('Many hybrid projects use both: points inside the sprint, man-days for the contract and for each CR. Story points are in ', 'Nhiều dự án lai dùng cả hai: point trong sprint, man-day cho hợp đồng và từng CR. Story point ở ')}${ag('agl-2-3-uoc-luong', t('lesson 2.3', 'bài 2.3'))}.</p>

<h3>${t('Step 1 — WBS: break it down until each piece is ≤ 1–2 days', 'Bước 1 — WBS: chia tới khi mỗi mảnh ≤ 1–2 ngày')}</h3>
<p>${t('A Work Breakdown Structure splits the deliverable into pieces small enough to estimate honestly. WBS construction is taught in ', 'Work Breakdown Structure chia sản phẩm thành những mảnh đủ nhỏ để ước lượng trung thực. Cách dựng WBS có ở ')}${ac('project-management', 'pmg201c-2-1-wbs-estimating', 'PMG201c 2.1')}${t('. The developer\'s version is simple: one line per activity per screen, and <strong>never only "code"</strong>. The things juniors forget:', '. Bản của lập trình viên đơn giản: mỗi hoạt động của mỗi màn hình một dòng, và <strong>không bao giờ chỉ có "code"</strong>. Những thứ người mới hay quên:')}</p>
<ul>
<li>${t('Reading the documents and writing Q&amp;A; meetings to clarify.', 'Đọc tài liệu và viết Q&amp;A; họp làm rõ.')}</li>
<li>${t('Writing test cases, running them, <strong>capturing evidence</strong> (often as long as coding).', 'Viết test case, chạy, <strong>chụp evidence</strong> (thường lâu ngang code).')}</li>
<li>${t('Fixing your own UT bugs and re-running.', 'Sửa bug UT của chính mình và chạy lại.')}</li>
<li>${t('Self-review, receiving review, fixing comments.', 'Tự review, nhận review, sửa theo nhận xét.')}</li>
<li>${t('Updating documents, daily reports, environment problems.', 'Cập nhật tài liệu, báo cáo ngày, sự cố môi trường.')}</li>
</ul>

<h3>${t('Step 2 — three numbers per line (PERT)', 'Bước 2 — ba con số mỗi dòng (PERT)')}</h3>
<p>${t(
    'For each line give <strong>O</strong> (optimistic: everything goes right), <strong>M</strong> (most likely) and <strong>P</strong> (pessimistic: realistic bad case, not a disaster). The PERT technique, created for the US Navy\'s Polaris missile programme in 1958, combines them:',
    'Mỗi dòng cho <strong>O</strong> (lạc quan: mọi thứ suôn sẻ), <strong>M</strong> (khả dĩ nhất) và <strong>P</strong> (bi quan: trường hợp xấu thực tế, không phải thảm hoạ). Kỹ thuật PERT, ra đời cho chương trình tên lửa Polaris của Hải quân Mỹ năm 1958, gộp chúng lại:')}</p>
<pre><code>E = (O + 4M + P) / 6        σ = (P − O) / 6
${t('Total: ΣE, and σ_total = √(Σσ²)  (assuming the lines are independent)', 'Tổng: ΣE, và σ_tổng = √(Σσ²)  (giả định các dòng độc lập)')}</code></pre>
<p>${t('Why three numbers? Because tasks are <strong>skewed</strong>: a task can finish at most a bit early but can run very late (an unclear rule, a library bug, a waiting answer). A single "likely" number hides that tail.', 'Sao phải ba số? Vì công việc <strong>lệch</strong>: một việc chỉ xong sớm được chút ít, nhưng có thể trễ rất nhiều (quy tắc chưa rõ, thư viện lỗi, chờ câu trả lời). Một con số "khả dĩ" duy nhất giấu mất cái đuôi đó.')}</p>

<h3>${t('Worked example: "Appointment management", 4 CRUD screens', 'Ví dụ: "Quản lý lịch khám", 4 màn hình CRUD')}</h3>
${taiMau('Uoc-luong-man-day-mau.xlsx', en)}
${bangHtml({ cot: UL_COT, hang: UL.hang }, { tinh })}
<p>${t('Totals computed by the spreadsheet (LibreOffice):', 'Phần tổng do bảng tính (LibreOffice) tính:')}</p>
${bang([t('Line', 'Dòng'), t('Formula', 'Công thức'), t('Value', 'Giá trị')], [
    [t('Expected total ΣE', 'Tổng kỳ vọng ΣE'), '<code>=SUM(G2:G14)</code>', '65.6 h'],
    [t('σ total', 'σ tổng'), '<code>=SQRT(SUMSQ(H2:H14))</code>', '3.46 h'],
    [t('≈ 84 % level: ΣE + 1σ', 'Mức ≈ 84 %: ΣE + 1σ'), '<code>=G15+H16</code>', '69.1 h'],
    [t('Man-days (÷ 8, rounded up to 0.5)', 'Man-day (÷ 8, làm tròn 0,5 lên)'), '<code>=CEILING(G17/8;0.5)</code>', '<strong>9 MD</strong>'],
  ])}
<p>${t('Look at what "coding" is: lines 2.1–2.6 add up to 33 h of likely effort — about half of the total. A junior who answers "4 days" after looking only at the code is not lazy; they simply did not see the other half.', 'Nhìn phần "code": dòng 2.1–2.6 cộng lại 33 h công khả dĩ — chỉ khoảng một nửa tổng. Người mới trả lời "4 ngày" sau khi chỉ nhìn phần code không phải lười; họ chỉ không thấy nửa còn lại.')}</p>

<h3>${t('See it: what happens if you just add the "likely" numbers?', 'Thấy tận mắt: chỉ cộng các số "khả dĩ" thì sao?')}</h3>
<p>${t('The script below "does" the 13 tasks 100,000 times, drawing each task\'s duration at random between its O and P (triangular distribution, peak at M), and counts how often the total fits each promise. The seed is fixed, so you get the same numbers:', 'Đoạn mã dưới "làm" 13 việc 100.000 lần, mỗi lần rút ngẫu nhiên thời gian mỗi việc giữa O và P (phân phối tam giác, đỉnh ở M), rồi đếm bao nhiêu lần tổng nằm trong từng lời hứa. Hạt giống cố định nên bạn sẽ ra đúng các số này:')}</p>
${MO_PHONG}
${MO_PHONG_OUT}
<ul>
<li>${t('Promising the sum of likely values (61 h ≈ 7.6 MD) succeeds in <strong>1.8 %</strong> of runs. Every task\'s "likely" is fine on its own; their sum is almost never achieved because delays add up and early finishes are small.', 'Hứa bằng tổng các số khả dĩ (61 h ≈ 7,6 MD) chỉ đúng trong <strong>1,8 %</strong> số lần. "Khả dĩ" của từng việc đều ổn; nhưng tổng của chúng gần như không bao giờ đạt, vì trễ thì cộng dồn, còn sớm thì chỉ sớm chút xíu.')}</li>
<li>${t('9 MD succeeds about <strong>69 %</strong> of the time in this simulation, 10 MD about 99 %. (The triangular model is a bit more pessimistic than the PERT formula — the PERT ≈84 % level becomes ≈69 % here. Different models, same lesson: the answer is a range with a probability, not a point.)', '9 MD đúng khoảng <strong>69 %</strong> số lần trong mô phỏng này, 10 MD khoảng 99 %. (Mô hình tam giác bi quan hơn công thức PERT một chút — mức ≈84 % của PERT thành ≈69 % ở đây. Mô hình khác nhau nhưng bài học như nhau: câu trả lời là một khoảng kèm xác suất, không phải một điểm.)')}</li>
<li>${t('Promising optimistic numbers (39 h) never works — 0.0 %.', 'Hứa bằng số lạc quan (39 h) thì không bao giờ đúng — 0,0 %.')}</li>
</ul>

<h3>${t('Step 3 — buffer and risk, stated openly', 'Bước 3 — dự phòng và rủi ro, nói công khai')}</h3>
<p>${t('Buffer is not padding hidden in every line (that makes every task expand to fill it). Put it visibly at the end and tie it to named risks:', 'Dự phòng không phải "độn" lén vào từng dòng (làm thế thì việc nào cũng phình ra cho vừa). Đặt nó công khai ở cuối và gắn với rủi ro có tên:')}</p>
${bang([t('Risk', 'Rủi ro'), t('Effect if it happens', 'Ảnh hưởng nếu xảy ra'), t('What we do', 'Cách xử lý')], [
    [t('Overlap rule for appointments not defined (line 2.3)', 'Quy tắc trùng giờ khám chưa định nghĩa (dòng 2.3)'), '+0.5–1 MD', t('Q&amp;A sent today; estimate assumes "same doctor, overlapping time = reject"', 'Đã gửi Q&amp;A hôm nay; ước lượng giả định "cùng bác sĩ, trùng giờ = từ chối"')],
    [t('First time using the project\'s date-picker component', 'Lần đầu dùng component chọn ngày của dự án'), '+0.5 MD', t('Ask the leader for an example screen', 'Xin leader một màn hình mẫu')],
    [t('Test server shared with another team', 'Server test dùng chung với đội khác'), t('Waiting time', 'Thời gian chờ'), t('Book slots in advance', 'Đặt lịch dùng trước')],
  ])}
<p>${t('Then answer like this: <em>"About 9 MD, likely between 8.5 and 10. It assumes QA-021 is answered as we proposed; if the overlap rule is more complex, add up to 1 MD. Coding is about half; the rest is tests, evidence and review."</em>', 'Rồi trả lời như sau: <em>"Khoảng 9 MD, nhiều khả năng từ 8,5 đến 10. Ước lượng giả định QA-021 được trả lời theo đề xuất; nếu quy tắc trùng giờ phức tạp hơn thì cộng tối đa 1 MD. Code chiếm khoảng một nửa; còn lại là test, evidence và review."</em>')}</p>

<h3>${t('Why estimates go wrong — known effects', 'Vì sao ước lượng sai — những hiệu ứng đã được biết')}</h3>
<ul>
<li>${t('<strong>Planning fallacy</strong> (Kahneman &amp; Tversky, 1979): people underestimate their own tasks even when they know similar tasks ran late. Cure: compare with your <em>actual</em> numbers from the last tickets.', '<strong>Ngụy biện lập kế hoạch</strong> (Kahneman &amp; Tversky, 1979): con người ước thấp việc của chính mình kể cả khi biết việc tương tự từng trễ. Thuốc chữa: so với số <em>thực tế</em> của các ticket trước.')}</li>
<li>${t('<strong>Cone of uncertainty</strong> (Boehm 1981; McConnell 2006): at the very beginning of a project, estimates can be off by a factor of 4 either way; the range narrows as requirements and design become clear. Estimating from a BD is less precise than from a reviewed DD — say so.', '<strong>Nón bất định</strong> (Boehm 1981; McConnell 2006): ở lúc khởi đầu dự án, ước lượng có thể lệch tới 4 lần về mỗi phía; khoảng lệch hẹp dần khi yêu cầu và thiết kế rõ ra. Ước từ BD kém chính xác hơn ước từ DD đã review — hãy nói rõ điều đó.')}</li>
<li>${t('<strong>Estimate ≠ target ≠ commitment</strong> (McConnell): the estimate is your honest prediction; the target is what the business wants; the commitment is what the team promises after discussing both. Do not change your estimate because someone wants a smaller number — change the scope or the plan instead.', '<strong>Ước lượng ≠ mục tiêu ≠ cam kết</strong> (McConnell): ước lượng là dự đoán trung thực của bạn; mục tiêu là điều phía kinh doanh muốn; cam kết là điều cả đội hứa sau khi cân cả hai. Đừng đổi ước lượng vì ai đó muốn con số nhỏ hơn — hãy đổi phạm vi hoặc kế hoạch.')}</li>
<li>${t('<strong>Brooks\'s law</strong> (<em>The Mythical Man-Month</em>, 1975): "adding manpower to a late software project makes it later" — newcomers need onboarding and communication paths grow. Man-days and months are not interchangeable.', '<strong>Định luật Brooks</strong> (<em>The Mythical Man-Month</em>, 1975): "thêm người vào một dự án phần mềm đang trễ chỉ làm nó trễ thêm" — người mới cần thời gian làm quen, đường giao tiếp tăng lên. Man-day và tháng không đổi qua lại tuỳ ý được.')}</li>
</ul>

<h3>${t('Track actuals — the only way to get better', 'Ghi số thực tế — cách duy nhất để giỏi lên')}</h3>
<p>${t('Keep your own small table: ticket, estimate, actual, why it differed. After ten tickets you will know your personal factor (for example "my UT takes 1.4× my estimate"). This is also what the lab in 9.8 grades: an estimate within 30 % <em>and</em> an explanation of the difference.', 'Giữ một bảng nhỏ của riêng bạn: ticket, ước lượng, thực tế, vì sao lệch. Sau mười ticket bạn sẽ biết hệ số của chính mình (ví dụ "UT của mình mất 1,4 lần ước lượng"). Đây cũng là thứ lab 9.8 chấm: ước lượng lệch dưới 30 % <em>và</em> giải thích được chỗ lệch.')}</p>

<h3>${t('Lab: estimate a CRUD feature with 4 screens', 'Lab: ước lượng một chức năng CRUD 4 màn hình')}</h3>
<p>${t('Feature "Doctor management" for the clinic: list (search by name/specialty, paging 20), add, edit, detail + deactivate. BD is approved; you write DD yourself. Build the WBS (≥ 12 lines), give O/M/P per line, compute ΣE, σ and the 84 % level, convert to MD, and list three risks with their effect. Use the empty template (copy the header row of the table above) or the downloadable sheet.', 'Chức năng "Quản lý bác sĩ" của phòng khám: danh sách (tìm theo tên/chuyên khoa, phân trang 20), thêm, sửa, chi tiết + ngừng hoạt động. BD đã duyệt; bạn tự viết DD. Dựng WBS (≥ 12 dòng), cho O/M/P từng dòng, tính ΣE, σ và mức 84 %, đổi ra MD, liệt kê ba rủi ro kèm ảnh hưởng. Dùng mẫu trống (chép hàng tiêu đề của bảng trên) hoặc sheet tải về.')}</p>
${giai(t('What a good answer looks like', 'Một bài làm tốt trông thế nào'), `<ul>
<li>${t('Contains DD writing + DD review lines (BD given, DD is yours) — commonly forgotten.', 'Có dòng viết DD + review DD (BD có sẵn, DD là của bạn) — hay bị quên.')}</li>
<li>${t('Test + evidence + fix lines together ≈ 35–50 % of the total.', 'Các dòng test + evidence + sửa lỗi cộng lại ≈ 35–50 % tổng.')}</li>
<li>${t('P/O ratios differ by line: uncertain lines (search, deactivate rules) have wide ranges.', 'Tỉ lệ P/O khác nhau theo dòng: dòng chưa chắc (tìm kiếm, quy tắc ngừng hoạt động) có khoảng rộng.')}</li>
<li>${t('Ends in a range sentence with assumptions, like the one above — typically 9–12 MD for this scope with DD included.', 'Kết bằng một câu khoảng kèm giả định như mẫu ở trên — với phạm vi này có cả DD thường ra 9–12 MD.')}</li>
<li>${t('Risks are specific ("deactivating a doctor who has future appointments — rule unknown") not generic ("requirements may change").', 'Rủi ro cụ thể ("ngừng hoạt động một bác sĩ còn lịch khám tương lai — chưa rõ quy tắc") chứ không chung chung ("yêu cầu có thể thay đổi").')}</li>
</ul>`)}

${phongVan([
    [t('How do you estimate a task?', 'Bạn ước lượng một việc thế nào?'), t('Break it into a WBS where each piece is ≤ 1–2 days, include tests, evidence, review and fixes, give three-point values, compute the expected value and spread, state assumptions and risks, and give a range. Afterwards I compare with actuals.', 'Chia thành WBS mỗi mảnh ≤ 1–2 ngày, có cả test, evidence, review và sửa lỗi, cho ba điểm, tính kỳ vọng và độ lệch, nói rõ giả định và rủi ro, đưa ra một khoảng. Sau đó so với thực tế.')],
    [t('Your leader says your estimate is too high. What do you do?', 'Leader nói ước lượng của bạn cao quá. Bạn làm gì?'), t('Walk through the WBS together; if a line is wrong, fix it; if the number is right but too big for the deadline, propose reducing scope or phasing — not silently cutting tests.', 'Cùng đi qua WBS; dòng nào sai thì sửa; nếu số đúng mà vượt hạn thì đề xuất giảm phạm vi hoặc chia giai đoạn — không lặng lẽ cắt phần test.')],
    [t('Story points or hours — which is better?', 'Story point hay giờ — cái nào tốt hơn?'), t('Different purposes: points for relative sizing and velocity inside a team; man-days when effort is priced (contracts, CRs). I have used both and can convert using measured velocity.', 'Mục đích khác nhau: point để so độ lớn tương đối và velocity trong đội; man-day khi công được tính tiền (hợp đồng, CR). Tôi đã dùng cả hai và có thể quy đổi qua velocity đo được.')],
    [t('The project is late. Should we add people?', 'Dự án trễ. Có nên thêm người không?'), t('Rarely the first answer (Brooks\'s law). First cut or phase scope, remove blockers, protect focus time; add people only to well-separated work with someone available to onboard them.', 'Hiếm khi là lựa chọn đầu tiên (định luật Brooks). Trước hết cắt hoặc chia giai đoạn phạm vi, gỡ vướng, giữ thời gian tập trung; chỉ thêm người cho phần việc tách bạch và có người kèm họ.')],
  ], en)}

${thuatNgu([
    [t('Man-day / man-month (人日/人月)', 'Man-day / man-month (人日/人月)'), t('Effort of one person for a day / a month', 'Công của một người trong một ngày / một tháng')],
    ['WBS', t('Work Breakdown Structure — hierarchical list of work pieces', 'Cấu trúc phân rã công việc — danh sách phân cấp các mảnh việc')],
    [t('Three-point estimate (PERT)', 'Ước lượng ba điểm (PERT)'), 'E = (O+4M+P)/6, σ = (P−O)/6'],
    [t('Buffer (contingency)', 'Dự phòng (buffer)'), t('Visible reserve tied to named risks', 'Phần dự trữ công khai gắn với rủi ro có tên')],
    [t('Cone of uncertainty', 'Nón bất định'), t('Estimate error shrinks as the project becomes clearer', 'Sai số ước lượng giảm khi dự án rõ dần')],
    [t('Effort vs duration', 'Công và thời lượng'), t('Hours of work vs calendar days elapsed', 'Số giờ làm và số ngày lịch trôi qua')],
  ], en)}

${tomTat([
    t('Outsourcing prices work in man-days/man-months, so estimates are money.', 'Outsourcing tính giá bằng man-day/man-month, nên ước lượng là tiền.'),
    t('WBS with all activities — coding is often only about half.', 'WBS đủ mọi hoạt động — code thường chỉ chiếm khoảng một nửa.'),
    t('Three points per line; summing "likely" values is almost always late.', 'Ba điểm mỗi dòng; cộng các số "khả dĩ" gần như luôn trễ.'),
    t('Answer with a range, assumptions and named risks; track actuals.', 'Trả lời bằng một khoảng, giả định và rủi ro có tên; ghi lại số thực tế.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-9-7-bao-cao-hourensou', t('9.7 — daily reports and hourensou', '9.7 — báo cáo ngày và hourensou'))}.</p>
`);
};
