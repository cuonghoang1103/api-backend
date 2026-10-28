/**
 * SWR302 · 5.6 — Quality attributes (Wiegers Ch.14: external/internal attributes, exploring, trade-offs).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const QA = ['Availability', 'Installability', 'Integrity', 'Interoperability', 'Performance', 'Reliability', 'Robustness', 'Safety', 'Security', 'Usability', 'Efficiency', 'Modifiability', 'Portability', 'Reusability', 'Scalability', 'Verifiability'];

const E1 = phanLoai({
  tieuDe: 'Quality 1 — external or internal attribute?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers splits quality attributes into <b>external</b> (seen by users while the software runs: availability, installability, integrity, interoperability, performance, reliability, robustness, safety, security, usability) and <b>internal</b> (seen by developers and maintainers: efficiency, modifiability, portability, reusability, scalability, verifiability).</p>', vi: '<p>Wiegers chia thuộc tính chất lượng thành <b>bên ngoài</b> (người dùng thấy khi chạy) và <b>bên trong</b> (dev và người bảo trì thấy).</p>' },
  cot: 'Kind', luaChon: ['External', 'Internal'],
  hang: [['Usability', 'External'], ['Modifiability', 'Internal'], ['Availability', 'External'], ['Portability', 'Internal'], ['Safety', 'External'], ['Verifiability', 'Internal'], ['Interoperability', 'External'], ['Reusability', 'Internal']],
  giaiThich: '<p>External: experienced by users at run time. Internal: experienced by the people who build, test and maintain the software.</p>',
  goiY: ['Người dùng có cảm nhận trực tiếp khi dùng không?', 'Sửa/chuyển/tái sử dụng/kiểm thử ⇒ bên trong.'],
  loiHayGap: ['Cho rằng scalability là bên ngoài (Wiegers xếp vào bên trong).', 'Nhầm safety với security.'],
  thuatNgu: tn('qualityAttr', 'nfr'),
  khaiNiem: ['quality attributes'],
});

const E2 = phanLoai({
  tieuDe: 'Quality 2 — name the attribute',
  doKho: 'MEDIUM', phut: 9,
  moTa: { en: '<p>Requirements for a hospital appointment system. Name the main quality attribute of each.</p>', vi: '<p>Yêu cầu của hệ thống đặt lịch khám. Gọi tên thuộc tính chất lượng chính của từng yêu cầu.</p>' },
  cot: 'Attribute', luaChon: QA,
  hang: [
    ['The booking service shall be available 99.5% of the time between 06:00 and 22:00.', 'Availability'],
    ['The mean time between failures of the kiosk shall be at least 30 days.', 'Reliability'],
    ['If the lab system sends a malformed result, the system shall log it and keep running.', 'Robustness'],
    ['Only the patient’s doctor shall be able to view the diagnosis.', 'Security'],
    ['The system shall prevent an appointment record from being changed without leaving an audit entry.', 'Integrity'],
    ['The infusion-dose screen shall ask for confirmation of any dose over the protocol limit.', 'Safety'],
    ['A first-time patient shall be able to book an appointment within 3 minutes without help.', 'Usability'],
    ['The system shall exchange appointments with the national e-health platform using HL7 FHIR.', 'Interoperability'],
    ['The system shall handle 5× today’s bookings by adding servers, without code changes.', 'Scalability'],
    ['A developer shall be able to add a new appointment type in at most 4 hours of work.', 'Modifiability'],
    ['Search results shall appear within 1 second for 95% of searches.', 'Performance'],
    ['The system shall run on both Android 13+ and iOS 17+.', 'Portability'],
  ],
  giaiThich: '<p>Availability = up time; reliability = failure-free operation; robustness = handling bad input/conditions; security = preventing unauthorised access; integrity = data not corrupted/changed improperly; safety = preventing harm; usability = ease of use/learning; interoperability = exchanging with other systems; scalability = growing capacity; modifiability = ease of change; performance = response/throughput; portability = moving across platforms.</p>',
  goiY: ['Ngăn hại cho người ⇒ safety; ngăn truy cập trái phép ⇒ security.', 'Đầu vào hỏng mà vẫn chạy ⇒ robustness.'],
  loiHayGap: ['Nhầm availability với reliability.', 'Nhầm integrity với security.'],
  thuatNgu: tn('qualityAttr', 'nfr'),
  khaiNiem: ['quality attributes'],
});

const E3 = tracNghiem({
  tieuDe: 'Quality 3 — trade-offs and exploring attributes',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Quality attributes interact: improving one can hurt another (Wiegers Figure 14-2). Wiegers also gives a process to explore them: start with a broad list, reduce it, prioritise, elicit specific expectations for each, then specify them in a well-structured, verifiable way.</p>', vi: '<p>Thuộc tính chất lượng tác động lẫn nhau: cải thiện cái này có thể hại cái kia (Hình 14-2). Wiegers cũng đưa quy trình khám phá: bắt đầu bằng danh sách rộng, rút gọn, xếp ưu tiên, khai thác kỳ vọng cụ thể, rồi đặc tả kiểm chứng được.</p>' },
  cau: [
    { en: 'Adding strong encryption and two-factor login usually hurts…', vi: 'Thêm mã hoá mạnh và đăng nhập hai lớp thường làm giảm…', lc: [['a', 'security'], ['b', 'usability and performance'], ['c', 'integrity'], ['d', 'nothing']], dap: 'b', giai: ['Security often trades against usability and performance.', 'Bảo mật thường đánh đổi với tính dễ dùng và hiệu năng.'] },
    { en: 'Making the code highly portable across platforms may reduce…', vi: 'Làm mã chạy được trên nhiều nền tảng có thể làm giảm…', lc: [['a', 'efficiency/performance'], ['b', 'portability'], ['c', 'availability always'], ['d', 'nothing']], dap: 'a', giai: ['Generic code cannot use platform-specific optimisations.', 'Mã chung không tận dụng tối ưu riêng nền tảng.'] },
    { en: 'Why prioritise quality attributes?', vi: 'Vì sao phải xếp ưu tiên thuộc tính chất lượng?', lc: [['a', 'Because you cannot maximise all of them — trade-offs must be decided'], ['b', 'Because the template requires it'], ['c', 'Only to shorten the SRS'], ['d', 'For marketing']], dap: 'a', giai: ['Conflicts need an agreed order.', 'Xung đột cần thứ tự đã thống nhất.'] },
    { en: 'The best first step to elicit a quality requirement is to ask…', vi: 'Bước đầu tốt nhất để khai thác yêu cầu chất lượng là hỏi…', lc: [['a', '"Should it be fast?"'], ['b', '"What would be unacceptable? How long would make you give up?" — and turn the answer into a measurable target'], ['c', '"Which database?"'], ['d', 'Nothing — guess']], dap: 'b', giai: ['Ask for the consequences and limits, then quantify.', 'Hỏi hậu quả và giới hạn, rồi lượng hoá.'] },
  ],
  goiY: ['Bảo mật ↔ dễ dùng/hiệu năng là cặp đánh đổi kinh điển.', 'Câu hỏi "có/không" không khai thác được gì.'],
  loiHayGap: ['Cho rằng mọi thuộc tính đều tối đa được cùng lúc.', 'Hỏi khách "có cần nhanh không?".'],
  giaiThich: '<p>Answers: b · a · a · b.</p>',
  thuatNgu: tn('qualityAttr'),
  khaiNiem: ['quality attribute trade-offs'],
});

const E4 = baiJs({
  tieuDe: 'Quality 4 — turn vague wishes into verifiable quality requirements',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>The clinic manager said: "It must be fast, always up and secure." Write <code>QR</code>: an array of exactly three requirements, one each for <b>performance</b>, <b>availability</b> and <b>security</b>. Each object has <code>{ attr, text }</code>. Each <code>text</code> must start with "The system shall", contain a number with a unit (seconds, %, hours, minutes, attempts…), and must not use vague words (fast, always, secure, user-friendly, quickly, robust).</p>', vi: '<p>Quản lý phòng khám nói: "Phải nhanh, luôn chạy và an toàn." Viết <code>QR</code>: đúng ba yêu cầu cho <b>performance</b>, <b>availability</b> và <b>security</b>. Mỗi đối tượng <code>{ attr, text }</code>; text bắt đầu "The system shall", có số kèm đơn vị, không dùng từ mơ hồ.</p>' },
  yeuCau: [{ en: 'attr values: "performance", "availability", "security".', vi: 'attr là "performance", "availability", "security".' }],
  viDu: [{ input: 'fast', output: 'The system shall display the patient’s appointment list within 2 seconds for 95% of requests.', explanation: 'Action, number, unit, percentile.|||Hành động, số, đơn vị, phân vị.' }],
  tep: { 'qr.js': ["const QR = [\n  { attr: 'performance', text: '' },\n  { attr: 'availability', text: '' },\n  { attr: 'security', text: '' },\n];\n", "const QR = [\n  { attr: 'performance', text: 'The system shall display the appointment list within 2 seconds for 95% of requests under a load of 200 concurrent users.' },\n  { attr: 'availability', text: 'The system shall be available 99.5% of the time between 06:00 and 22:00 each day, excluding announced maintenance.' },\n  { attr: 'security', text: 'The system shall lock a user account for 15 minutes after 5 consecutive failed login attempts.' },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'three requirements: performance, availability, security', vi: 'ba yêu cầu: performance, availability, security' }, function () {
      if (typeof QR === 'undefined' || !Array.isArray(QR)) return 'QR must be an array';
      if (QR.length !== 3) return 'exactly 3 requirements';
      var a = QR.map(function (q) { return String(q && q.attr || '').toLowerCase(); }).sort().join(',');
      return a === 'availability,performance,security' ? 'OK' : 'attr must be performance, availability and security (got ' + a + ')';
    }),
    kiemTuy({ en: 'each text is a "shall" statement without vague words', vi: 'mỗi text là câu "shall" không từ mơ hồ' }, function () {
      if (typeof QR === 'undefined' || !Array.isArray(QR)) return 'QR must be an array';
      for (var i = 0; i < QR.length; i++) {
        var t = String(QR[i] && QR[i].text || '');
        if (!/^the system shall\b/i.test(t)) return QR[i].attr + ': start with "The system shall"';
        if (/\b(fast|always|secure|securely|user-friendly|quickly|robust|easy|efficient)\b/i.test(t)) return QR[i].attr + ': remove the vague word';
        if (t.length < 50) return QR[i].attr + ': too short to be specific';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'each text is measurable (number + unit)', vi: 'mỗi text đo được (số + đơn vị)' }, function () {
      if (typeof QR === 'undefined' || !Array.isArray(QR)) return 'QR must be an array';
      for (var i = 0; i < QR.length; i++) {
        var t = String(QR[i] && QR[i].text || '');
        if (!/\d+(\.\d+)?\s*(%|ms|milliseconds?|seconds?|s\b|minutes?|hours?|days?|attempts?|users?|requests?|characters?)/i.test(t)) return QR[i].attr + ': add a number with a unit';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'the measure fits the attribute', vi: 'thước đo hợp với thuộc tính' }, function () {
      if (typeof QR === 'undefined' || !Array.isArray(QR)) return 'QR must be an array';
      for (var i = 0; i < QR.length; i++) {
        var a = String(QR[i] && QR[i].attr || '').toLowerCase(), t = String(QR[i] && QR[i].text || '');
        if (a === 'performance' && !/(ms|milliseconds?|seconds?|\bs\b|per second|per minute)/i.test(t)) return 'performance: give a time (seconds/ms) or a rate';
        if (a === 'availability' && !/%/.test(t)) return 'availability: give a percentage of up time';
        if (a === 'security' && !/(login|log in|password|attempt|role|authori|authenti|encrypt|access|lock)/i.test(t)) return 'security: say what is protected and how (login, roles, access, encryption…)';
      }
      return 'OK';
    }),
  ],
  goiY: ['Hiệu năng: thời gian + phân vị + điều kiện tải.', 'Sẵn sàng: % thời gian trong khung giờ cụ thể; bảo mật: cơ chế cụ thể (khoá tài khoản, phân quyền…).'],
  loiHayGap: ['Viết "The system shall be secure."', 'Đặt 100% availability — không khả thi.'],
  giaiThich: '<p>A verifiable quality requirement names the action, the measure and the unit, and the conditions (load, time window). See Planguage in 5.7 for a fuller structure.</p>',
  thuatNgu: tn('qualityAttr', 'verifiable'),
  khaiNiem: ['specifying quality requirements'],
  boYeu: [{ ten: 'còn mơ hồ', tep: { 'qr.js': "const QR=[{attr:'performance',text:'The system shall be fast for all users at all times.'},{attr:'availability',text:'The system shall always be available to patients 100%.'},{attr:'security',text:'The system shall be secure against attacks of any kind.'}];\n" } }],
});

export default moDun({
  slug: 'swr302-5-7-ch14-quality-attributes',
  ten: '5.7 Quality attributes',
  moTaModule: 'Thuộc tính chất lượng bên ngoài/bên trong (Wiegers Ch.14), gọi tên thuộc tính của 12 yêu cầu bệnh viện, đánh đổi giữa các thuộc tính, quy trình khám phá; tự viết 3 yêu cầu chất lượng đo được.',
  de: [E1, E2, E3, E4],
});
