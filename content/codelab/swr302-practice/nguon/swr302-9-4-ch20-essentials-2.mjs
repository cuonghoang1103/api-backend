/**
 * SWR302 · 9.4 — Agile essentials 2: timing, epics/stories/features, expect change, transitioning (Wiegers Ch.20 · 12–17).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Agile essentials 4 — epic, user story or feature?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A <b>user story</b> is a concise statement of a user need, sized to be implemented in <b>one iteration</b>. An <b>epic</b> is a story too large for one iteration and is split (story decomposition). A <b>feature</b> is a grouping of capabilities that provides user value; it may span several stories or epics.</p>', vi: '<p><b>User story</b>: nhu cầu ngắn gọn, vừa <b>một vòng</b>. <b>Epic</b>: story quá lớn, phải tách. <b>Feature</b>: nhóm khả năng đem giá trị, có thể trải nhiều story/epic.</p>' },
  cot: 'Kind', luaChon: ['Epic', 'User story', 'Feature'],
  hang: [
    ['"As a patient, I want to manage all my health records online." (several months of work)', 'Epic'],
    ['"As a patient, I want to download my last lab result as PDF so I can send it to another doctor." (3 points)', 'User story'],
    ['"Online payments" — card, e-wallet, refunds, receipts.', 'Feature'],
    ['"As a receptionist, I want to search a patient by phone number so I can check them in quickly." (2 points)', 'User story'],
    ['"As a clinic owner, I want a full analytics suite." (spans many sprints)', 'Epic'],
  ],
  giaiThich: '<p>Size and form decide: one-iteration "As a… I want… so that…" ⇒ story; too big for one iteration ⇒ epic; a named capability grouping ⇒ feature.</p>',
  goiY: ['Vừa một vòng ⇒ story.', 'Tên một nhóm khả năng ⇒ feature.'],
  loiHayGap: ['Gọi mọi thứ lớn là feature.', 'Đưa epic vào sprint mà không tách.'],
  thuatNgu: tn('epic', 'userStory'),
  khaiNiem: ['epics, stories, features'],
});

const E2 = tracNghiem({
  tieuDe: 'Agile essentials 5 — timing and expecting change',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Agile projects need the same requirements activities, but not all at once: high-level stories fill the backlog early; details are clarified in the iteration that implements them (Figure 20-1). Exception: learn about <b>nonfunctional requirements early</b> so the architecture can support them. When change arises, the BA says "Okay, let’s talk about the change" and prioritises it against the backlog — while still looking ahead.</p>', vi: '<p>Agile vẫn làm đủ hoạt động yêu cầu nhưng rải theo thời gian; ngoại lệ: tìm hiểu <b>yêu cầu phi chức năng sớm</b>. Khi có thay đổi: "Được, ta bàn về thay đổi này" rồi xếp ưu tiên với backlog.</p>' },
  cau: [
    { en: 'When are the details of a story usually worked out?', vi: 'Chi tiết của story thường được làm rõ khi nào?', lc: [['a', 'In the iteration that implements it (just in time)'], ['b', 'All at the start of the project'], ['c', 'After release'], ['d', 'Never']], dap: 'a', giai: ['Figure 20-1.', 'Hình 20-1.'] },
    { en: 'Which requirements should be explored early even on agile projects?', vi: 'Yêu cầu nào nên tìm hiểu sớm kể cả trong agile?', lc: [['a', 'Nonfunctional requirements that shape the architecture (performance, security, scalability)'], ['b', 'Button colours'], ['c', 'Report fonts'], ['d', 'None']], dap: 'a', giai: ['They are costly to retrofit.', 'Thêm sau rất tốn.'] },
    { en: 'The client asks to add a feature mid-project. The agile BA’s first response is…', vi: 'Khách xin thêm tính năng giữa dự án. Phản ứng đầu tiên của BA agile là…', lc: [['a', '"Okay, let’s talk about the change" — write the story and prioritise it against the backlog'], ['b', '"No changes allowed"'], ['c', 'Start coding it immediately'], ['d', 'Ignore it until the end']], dap: 'a', giai: ['Embrace change, but manage it.', 'Đón nhận thay đổi nhưng có quản lý.'] },
    { en: 'Change in agile can also mean…', vi: 'Thay đổi trong agile cũng có thể là…', lc: [['a', 'removing items from the backlog that are no longer valuable'], ['b', 'only adding items'], ['c', 'changing the team every sprint'], ['d', 'rewriting the vision daily']], dap: 'a', giai: ['Dropping work is a change too.', 'Bỏ việc cũng là thay đổi.'] },
  ],
  goiY: ['Chi tiết ⇒ đúng lúc (trong vòng thực hiện).', 'NFR định hình kiến trúc ⇒ sớm.'],
  loiHayGap: ['Chi tiết hoá mọi story ngay đầu dự án.', 'Để yêu cầu hiệu năng tới cuối.'],
  giaiThich: '<p>Answers: a · a · a · a.</p>',
  thuatNgu: tn('backlog', 'nfr'),
  khaiNiem: ['timing', 'expect change'],
});

const E3 = baiJs({
  tieuDe: 'Agile essentials 6 — decompose an epic into stories',
  doKho: 'HARD', phut: 18,
  moTa: { en: '<p>Epic (ClinicCare): "<i>As a patient, I want to pay for my visit online.</i>" The team’s iteration capacity is 20 points; no story may exceed 8 points. Decompose the epic into <code>STORIES</code>: an array of 4–8 objects <code>{ id, text, points, criteria }</code>:</p><ul><li><code>text</code> follows "As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;".</li><li>Together they must cover: paying by <b>card</b>, paying by <b>e-wallet</b>, getting a <b>receipt</b>, and a <b>refund</b> when a visit is cancelled.</li><li><code>points</code> is a Fibonacci number 1, 2, 3, 5 or 8.</li><li>Each story has at least 2 <code>criteria</code> (acceptance criteria).</li><li>Not all stories may be for the patient — at least one other role (e.g. cashier, clinic manager) should appear.</li></ul>', vi: '<p>Tách epic "bệnh nhân thanh toán trực tuyến" thành 4–8 story <code>{ id, text, points, criteria }</code>: đúng mẫu "As a…, I want… so that…", phủ thẻ, ví điện tử, biên lai, hoàn tiền; điểm thuộc 1,2,3,5,8 (≤ 8); mỗi story ≥ 2 tiêu chí chấp nhận; có ít nhất một vai trò khác bệnh nhân.</p>' },
  yeuCau: [{ en: 'Each story must fit in one iteration (≤ 8 points).', vi: 'Mỗi story vừa một vòng (≤ 8 điểm).' }],
  viDu: [{ input: 'card payment', output: "{ id: 'PAY-1', text: 'As a patient, I want to pay my visit fee by card so that I do not need cash at the clinic.', points: 5, criteria: ['…', '…'] }", explanation: '|||' }],
  tep: { 'stories.js': ["const STORIES = [\n  // { id: 'PAY-1', text: 'As a patient, I want … so that …', points: 5, criteria: ['…', '…'] },\n];\n", "const STORIES = [\n  { id: 'PAY-1', text: 'As a patient, I want to pay my visit fee by card so that I do not need cash at the clinic.', points: 5, criteria: ['Given a confirmed visit, when the card payment succeeds, then the visit is marked Paid.', 'Given a declined card, when the patient pays, then an error is shown and the visit stays Unpaid.'] },\n  { id: 'PAY-2', text: 'As a patient, I want to pay by e-wallet so that I can pay from my phone.', points: 5, criteria: ['Given a confirmed visit, when the e-wallet confirms, then the visit is marked Paid.', 'Given the e-wallet times out after 60 seconds, then the patient can retry.'] },\n  { id: 'PAY-3', text: 'As a patient, I want to receive an electronic receipt so that I can claim insurance.', points: 2, criteria: ['When a payment succeeds, a PDF receipt is e-mailed within 5 minutes.', 'The receipt shows the visit, the amount and the tax.'] },\n  { id: 'PAY-4', text: 'As a patient, I want a refund when the clinic cancels my visit so that I do not lose money.', points: 5, criteria: ['When the clinic cancels a paid visit, a full refund is started within 1 hour.', 'The patient is notified of the refund.'] },\n  { id: 'PAY-5', text: 'As a cashier, I want to see the list of online payments for today so that I can reconcile the cash register.', points: 3, criteria: ['The list shows time, patient, method and amount.', 'The total of the list equals the sum of the payments.'] },\n];\n"] },
  kiem: (function () {
    var LIB = "if (typeof STORIES === 'undefined' || !Array.isArray(STORIES)) return 'STORIES must be an array';\nvar T = STORIES.map(function(s){ return String(s && s.text || ''); }), A = T.join(' ').toLowerCase();\n";
    function k(moTa, body, ex) { return kiemTuy(moTa, new Function(LIB + body), ex); }
    return [
      k({ en: '4 to 8 stories with unique ids', vi: '4–8 story, id không trùng' }, "if (STORIES.length < 4 || STORIES.length > 8) return 'write 4 to 8 stories (got ' + STORIES.length + ')'; var seen = {}; for (var i = 0; i < STORIES.length; i++) { var id = String(STORIES[i].id||''); if (!id) return 'story ' + i + ' has no id'; if (seen[id]) return 'duplicate id ' + id; seen[id] = 1; } return 'OK';"),
      k({ en: 'every story follows As a … I want … so that …', vi: 'mọi story theo mẫu As a … I want … so that …' }, "for (var i = 0; i < T.length; i++) if (!/^as an? [^,]{2,40},? i want (to )?.{5,}\\bso that\\b.{5,}/i.test(T[i].trim())) return 'story ' + (STORIES[i].id||i) + ' does not follow \"As a <role>, I want <goal> so that <benefit>\"'; return 'OK';"),
      k({ en: 'each story fits one iteration (Fibonacci ≤ 8)', vi: 'mỗi story vừa một vòng (Fibonacci ≤ 8)' }, "for (var i = 0; i < STORIES.length; i++) if ([1,2,3,5,8].indexOf(STORIES[i].points) < 0) return (STORIES[i].id||i) + ': points must be 1, 2, 3, 5 or 8 (got ' + STORIES[i].points + ')'; return 'OK';"),
      k({ en: 'covers card, e-wallet, receipt and refund', vi: 'phủ thẻ, ví điện tử, biên lai, hoàn tiền' }, "var need = [['card', /\\bcard\\b/], ['e-wallet', /e-?wallet|momo|zalopay|wallet/], ['receipt', /receipt|invoice/], ['refund', /refund/]]; for (var i = 0; i < need.length; i++) if (!need[i][1].test(A)) return 'no story covers ' + need[i][0]; var c = T.filter(function(t){ return /\\bcard\\b/i.test(t) && /wallet/i.test(t); }); return c.length ? 'card and e-wallet are separate stories — split them' : 'OK';"),
      k({ en: 'each story has at least 2 acceptance criteria', vi: 'mỗi story ≥ 2 tiêu chí chấp nhận' }, "for (var i = 0; i < STORIES.length; i++) { var c = STORIES[i].criteria; if (!Array.isArray(c) || c.filter(function(x){ return String(x).trim().length > 10; }).length < 2) return (STORIES[i].id||i) + ' needs at least 2 real acceptance criteria'; } return 'OK';"),
      k({ en: 'more than one role appears', vi: 'có hơn một vai trò' }, "var roles = {}; T.forEach(function(t){ var m = t.match(/^as an? ([^,]+?),? i want/i); if (m) roles[m[1].toLowerCase().trim()] = 1; }); return Object.keys(roles).length >= 2 ? 'OK' : 'add a story for another role (cashier, clinic manager…)';", { an: true }),
    ];
  })(),
  goiY: ['Tách theo phương thức (thẻ, ví), theo bước (biên lai), theo trường hợp đặc biệt (hoàn tiền).', 'Điểm Fibonacci; story > 8 điểm là epic, phải tách tiếp.'],
  loiHayGap: ['Gộp thẻ và ví trong một story.', 'Story vai "the system".'],
  giaiThich: '<p>Story decomposition continues until each story can be estimated, implemented and tested in one iteration, each with acceptance criteria. Splitting by payment method, by step (receipt) and by exception (refund) gives small, valuable, testable slices.</p>',
  thuatNgu: tn('epic', 'userStory', 'acceptanceCriteria', 'invest'),
  khaiNiem: ['story decomposition'],
  boYeu: [{ ten: 'story gộp, 13 điểm, một vai', tep: { 'stories.js': "const STORIES=[{id:'A',text:'As a patient, I want to pay by card or e-wallet so that it is easy.',points:13,criteria:['works','ok']},{id:'B',text:'As a patient, I want a receipt so that I have proof.',points:2,criteria:['a receipt is sent by e-mail','it shows the amount']},{id:'C',text:'As a patient, I want a refund so that I get money back.',points:3,criteria:['refund is started in 1 hour','patient is notified']},{id:'D',text:'The system shall log payments.',points:2,criteria:['log row written','log has time']}];\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Agile essentials 7 — transitioning to agile',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Wiegers’ transition advice: determine your role on the team; identify the agile practices that fit your organisation best; pilot a small project first, or adopt a few agile practices on your next project; in a hybrid model, start with a few low-risk practices that work in any methodology.</p>', vi: '<p>Lời khuyên chuyển sang agile của Wiegers.</p>' },
  cau: [
    { en: 'Your company has never used agile. Best first step?', vi: 'Công ty chưa từng dùng agile. Bước đầu tốt nhất?', lc: [['a', 'Pilot agile on a small project, or adopt a few low-risk practices'], ['b', 'Switch every project to Scrum tomorrow'], ['c', 'Stop writing requirements'], ['d', 'Fire the BAs']], dap: 'a', giai: ['Transition incrementally.', 'Chuyển đổi từng bước.'] },
    { en: 'In agile, does the BA role disappear?', vi: 'Trong agile, vai trò BA có biến mất không?', lc: [['a', 'No — the BA may act as or support the product owner and keep doing requirements work continuously'], ['b', 'Yes, always'], ['c', 'Only in big teams'], ['d', 'Only testers remain']], dap: 'a', giai: ['The activities remain; the timing changes.', 'Hoạt động vẫn còn; thời điểm thay đổi.'] },
  ],
  goiY: ['Thí điểm nhỏ trước.', 'Vai trò BA vẫn còn.'],
  loiHayGap: ['Chuyển đổi toàn bộ trong một đêm.', 'Bỏ hẳn việc làm yêu cầu.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('backlog'),
  khaiNiem: ['transitioning to agile'],
});

export default moDun({
  slug: 'swr302-9-4-ch20-essentials-2',
  ten: '9.4 Agile essentials: timing, epics and change',
  moTaModule: 'Phân biệt epic / user story / feature, thời điểm làm rõ chi tiết và NFR sớm, đón nhận thay đổi, tự tách epic thanh toán trực tuyến thành story có điểm và tiêu chí chấp nhận, chuyển đổi sang agile.',
  de: [E1, E2, E3, E4],
});
