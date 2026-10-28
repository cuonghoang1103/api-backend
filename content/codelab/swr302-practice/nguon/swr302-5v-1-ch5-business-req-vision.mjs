/**
 * SWR302 · 2.4 — Business requirements and the vision (Wiegers Ch.5 slides 1–17).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Business requirements 1 — opportunity, objective, metric, vision, risk or assumption?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Section 1 of the vision and scope document holds the <b>business requirements</b>: background, business opportunity, business objectives, success metrics, vision statement, business risks, business assumptions and dependencies. Classify each statement of a campus food-delivery project, <b>FoodRun</b>.</p>', vi: '<p>Phần 1 của tài liệu tầm nhìn & phạm vi chứa <b>yêu cầu nghiệp vụ</b>: bối cảnh, cơ hội nghiệp vụ, mục tiêu nghiệp vụ, chỉ số thành công, tuyên bố tầm nhìn, rủi ro nghiệp vụ, giả định và phụ thuộc. Phân loại từng phát biểu của dự án giao đồ ăn trong khuôn viên <b>FoodRun</b>.</p>' },
  cot: 'Part', luaChon: ['Business opportunity', 'Business objective', 'Success metric', 'Vision statement', 'Business risk', 'Business assumption or dependency'],
  hang: [
    ['70% of students now order food on their phones, but no service delivers inside the dormitories.', 'Business opportunity', '70% sinh viên đặt đồ ăn trên điện thoại nhưng chưa dịch vụ nào giao vào ký túc xá.'],
    ['Reach 3,000 orders per month by the end of the first semester.', 'Business objective', 'Đạt 3.000 đơn mỗi tháng vào cuối học kỳ đầu.'],
    ['Average delivery time below 15 minutes, measured every month.', 'Success metric', 'Thời gian giao trung bình dưới 15 phút, đo hằng tháng.'],
    ['For dormitory students who are hungry between classes, FoodRun is a delivery app that brings canteen food to their door in 15 minutes.', 'Vision statement', 'Cho sinh viên KTX đói giữa giờ học, FoodRun là app giao đồ ăn căng-tin tận cửa trong 15 phút.'],
    ['Dormitory security may refuse couriers at night, cutting evening sales.', 'Business risk', 'Bảo vệ KTX có thể chặn người giao buổi tối, làm giảm doanh số tối.'],
    ['The canteen will keep its kitchen open until 22:00.', 'Business assumption or dependency', 'Căng-tin sẽ mở bếp tới 22:00.'],
    ['Increase canteen revenue by 20% within one year.', 'Business objective', 'Tăng doanh thu căng-tin 20% trong một năm.'],
    ['At least 4.2 stars average rating in the first three months.', 'Success metric', 'Đánh giá trung bình ít nhất 4,2 sao trong ba tháng đầu.'],
  ],
  giaiThich: '<p>An objective states the business result the organisation wants; a success metric is an indicator that tells, along the way or after delivery, whether the objective is being reached; the opportunity explains why now; a risk may make the project fail; an assumption is something believed true that the project depends on.</p>',
  goiY: ['Mục tiêu = kết quả nghiệp vụ muốn đạt; chỉ số = con số cho biết có đang/đã đạt hay không.', 'Rủi ro = điều có thể làm hỏng dự án; giả định = điều ta TIN là đúng và dựa vào.'],
  loiHayGap: ['Xếp chỉ số thành công vào mục tiêu vì cùng có con số.', 'Xếp giả định (căng-tin mở tới 22:00) vào rủi ro.'],
  thuatNgu: [...tn('businessReq', 'visionScope'), { en: 'success metric', vi: 'chỉ số thành công' }, { en: 'business opportunity', vi: 'cơ hội nghiệp vụ — vì sao bây giờ nên làm' }],
  khaiNiem: ['business requirements', 'vision and scope'],
});

const E2 = tracNghiem({
  tieuDe: 'Business requirements 2 — SMART objectives',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Good business objectives are <b>SMART</b>: Specific, Measurable, Attainable, Relevant, Time-bound. Pick the SMART one each time.</p>', vi: '<p>Mục tiêu nghiệp vụ tốt phải <b>SMART</b>: cụ thể, đo được, khả thi, liên quan, có thời hạn. Chọn mục tiêu SMART.</p>' },
  cau: [
    { en: 'Which objective is SMART?', vi: 'Mục tiêu nào SMART?', lc: [['a', 'Make students happier with food.'], ['b', 'Increase canteen revenue by 20% by December 2027.'], ['c', 'Become the best food app in Vietnam.'], ['d', 'Use machine learning for recommendations.']], dap: 'b', giai: ['Specific, measurable (20%), time-bound (Dec 2027).', 'Cụ thể, đo được (20%), có hạn (12/2027).'] },
    { en: 'Which candidate is a solution, not a business objective?', vi: 'Phương án nào là giải pháp, không phải mục tiêu nghiệp vụ?', lc: [['a', 'Cut the lunch queue time from 20 to 5 minutes by June.'], ['b', 'Build the app with Flutter.'], ['c', 'Reduce food waste by 30% this year.'], ['d', 'Serve 500 more students per day.']], dap: 'b', giai: ['A technology choice is not a business result.', 'Lựa chọn công nghệ không phải kết quả nghiệp vụ.'] },
    { en: '"Improve customer satisfaction" becomes SMART when written as…', vi: '"Tăng sự hài lòng" trở thành SMART khi viết…', lc: [['a', 'Greatly improve customer satisfaction.'], ['b', 'Raise the average rating from 3.6 to 4.3 stars within six months of launch.'], ['c', 'Customers will love us.'], ['d', 'Improve satisfaction using surveys.']], dap: 'b', giai: ['Baseline, target and deadline make it measurable and time-bound.', 'Mốc hiện tại, mục tiêu và hạn làm nó đo được và có thời hạn.'] },
  ],
  goiY: ['Có con số? Có hạn? Có nói KẾT QUẢ nghiệp vụ (không phải công nghệ)?', 'Mục tiêu tốt thường có mốc hiện tại → mục tiêu → thời hạn.'],
  loiHayGap: ['Chọn "become the best" vì nghe tham vọng.', 'Nhầm giải pháp công nghệ với mục tiêu.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: [{ en: 'SMART', vi: 'Specific · Measurable · Attainable · Relevant · Time-bound' }],
  khaiNiem: ['SMART objectives'],
});

const E3 = sapXep({
  tieuDe: 'Business requirements 3 — the parts of the Moore vision template',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Geoffrey Moore’s template: <i>For</i> [target customer] <i>who</i> [statement of need or opportunity], <i>the</i> [product name] <i>is a</i> [product category] <i>that</i> [key benefit, compelling reason to buy or use]. <i>Unlike</i> [primary competitive alternative, current system or current process], <i>our product</i> [statement of primary differentiation and advantages]. Put the parts of the FoodRun vision back in order.</p>', vi: '<p>Khuôn của Geoffrey Moore (bản tiếng Anh). Sắp lại các phần của tuyên bố tầm nhìn FoodRun cho đúng thứ tự.</p>' },
  cau: [{ en: 'Order the parts', vi: 'Sắp các phần', dung: ['For dormitory students', 'who are hungry between classes and cannot leave campus,', 'FoodRun', 'is a campus food-delivery app', 'that brings canteen meals to their door in 15 minutes.', 'Unlike walking to the canteen and queuing,', 'our product lets them order between classes and pay with the campus e-wallet.'], hien: [4, 0, 6, 2, 5, 1, 3], giai: ['For → who → the (name) → is a → that → unlike → our product.', 'For → who → tên → is a → that → unlike → our product.'] }],
  goiY: ['Bắt đầu bằng For (khách hàng đích), kết thúc bằng our product (khác biệt).', 'Tên sản phẩm đứng ngay trước "is a".'],
  loiHayGap: ['Đặt "Unlike" trước "that".', 'Đưa tên sản phẩm lên đầu câu.'],
  giaiThich: '<p>For → who → product name → is a → that → unlike → our product.</p>',
  thuatNgu: [{ en: 'vision statement', vi: 'tuyên bố tầm nhìn — một đoạn ngắn nói sản phẩm cho ai, giải quyết gì, khác gì' }],
  khaiNiem: ['vision statement'],
});

const E4 = baiJs({
  tieuDe: 'Business requirements 4 — write the vision statement of PrintPal',
  doKho: 'HARD', phut: 12,
  moTa: { en: '<p><b>PrintPal</b> lets students send documents from their phones to the campus printers and pick them up with their student card. Today students must queue at the library copy shop, carry a USB stick and pay in cash. Write PrintPal’s vision statement with the Moore template, one property per part, in the object <code>VISION</code>.</p>', vi: '<p><b>PrintPal</b> cho sinh viên gửi tài liệu từ điện thoại tới máy in trong trường và lấy bản in bằng thẻ sinh viên. Hiện sinh viên phải xếp hàng ở tiệm photo thư viện, mang USB và trả tiền mặt. Viết tuyên bố tầm nhìn của PrintPal theo khuôn Moore, mỗi phần một thuộc tính trong object <code>VISION</code>.</p>' },
  yeuCau: [{ en: 'Fill forWho, who, productName, isA, that, unlike, ourProduct with meaningful phrases about PrintPal.', vi: 'Điền forWho, who, productName, isA, that, unlike, ourProduct bằng cụm từ có nghĩa về PrintPal.' }],
  viDu: [{ input: 'productName', output: '"PrintPal"', explanation: 'The exact product name.|||Đúng tên sản phẩm.' }],
  tep: { 'answer.js': [
    "const VISION = { forWho: '', who: '', productName: '', isA: '', that: '', unlike: '', ourProduct: '' };\n",
    "// For students who need printouts, who waste time queuing with a USB stick, the PrintPal is a mobile printing service that\n// sends documents from a phone to any campus printer. Unlike the library copy shop, our product releases the job with the student card and charges the e-wallet.\nconst VISION = {\n  forWho: 'students who need to print assignments and slides',\n  who: 'waste time queuing at the copy shop with a USB stick and cash',\n  productName: 'PrintPal',\n  isA: 'mobile printing service',\n  that: 'sends documents from a phone to any campus printer in seconds',\n  unlike: 'the library copy shop with its queues, USB sticks and cash payments',\n  ourProduct: 'releases the print job when the student taps the student card and charges the campus e-wallet',\n};\n",
  ] },
  kiem: [
    kiemTuy({ en: 'every part of the template is filled', vi: 'điền đủ mọi phần của khuôn' }, function () {
      if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
      var can = ['forWho', 'who', 'productName', 'isA', 'that', 'unlike', 'ourProduct'];
      for (var i = 0; i < can.length; i++) if (String(VISION[can[i]] || '').trim().split(/\s+/).length < (can[i] === 'productName' ? 1 : 3)) return 'part "' + can[i] + '" is empty or too short';
      return 'OK';
    }),
    kiemTuy({ en: 'productName is PrintPal and isA names a product category', vi: 'productName là PrintPal và isA là một loại sản phẩm' }, function () {
      if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
      if (String(VISION.productName).trim().toLowerCase() !== 'printpal') return 'productName: PrintPal';
      return /app|service|system|platform|solution|tool/i.test(String(VISION.isA)) ? 'OK' : 'isA: a product category (app, service, platform…)';
    }),
    kiemTuy({ en: 'the parts carry the facts of the case (students, queue/USB/cash today, phone-to-printer, student card)', vi: 'các phần mang đúng sự kiện của đề (sinh viên, hàng đợi/USB/tiền mặt hiện nay, điện thoại tới máy in, thẻ sinh viên)' }, function () {
      if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
      var t = function (k) { return String(VISION[k] || '').toLowerCase(); };
      if (!/student/.test(t('forWho'))) return 'forWho: who are the target customers?';
      if (!/print|queue|usb|cash|time/.test(t('who'))) return 'who: their need or problem today';
      if (!/phone|mobile|send|printer|anywhere/.test(t('that'))) return 'that: the key benefit (from the phone to a campus printer)';
      if (!/copy shop|queue|usb|cash|library/.test(t('unlike'))) return 'unlike: the current alternative (the copy shop, USB stick, cash)';
      if (!/card|wallet|tap|release/.test(t('ourProduct'))) return 'ourProduct: the differentiation (student card, e-wallet)';
      return 'OK';
    }),
  ],
  goiY: ['Ghép câu: "For … who …, the PrintPal is a … that … . Unlike …, our product …".', 'Khác biệt chính: lấy bản in bằng thẻ sinh viên, trả bằng ví điện tử.'],
  loiHayGap: ['Liệt kê tính năng thay vì lợi ích chính.', 'Phần "unlike" nói về đối thủ chung chung thay vì cách làm hiện tại.'],
  giaiThich: '<p>A vision statement is short, names the target customers, their need, the key benefit, today’s alternative and the differentiation — it guides scope decisions for the whole project.</p>',
  thuatNgu: [{ en: 'vision statement', vi: 'tuyên bố tầm nhìn' }, { en: 'differentiation', vi: 'điểm khác biệt' }],
  khaiNiem: ['vision statement'],
});

export default moDun({
  slug: 'swr302-5v-1-ch5-business-req-vision',
  ten: '2.4 Business requirements and the vision statement',
  moTaModule: 'Các phần của yêu cầu nghiệp vụ (cơ hội, mục tiêu, chỉ số thành công, tầm nhìn, rủi ro, giả định), mục tiêu SMART, khuôn tầm nhìn của Moore và tự viết tuyên bố tầm nhìn có chấm.',
  de: [E2, E3, E1, E4],
});
