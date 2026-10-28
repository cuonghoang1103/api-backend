/**
 * SWR302 · 2.5 — Identifying decision makers and reaching agreement (Wiegers Ch.2 slides 30–34).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Agreement 1 — which decision rule?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Agree a decision rule before conflicts arise: the <b>leader decides</b> (with or without discussion); <b>majority vote</b>; <b>unanimous vote</b>; <b>consensus</b> (everyone can live with it and commits); the leader <b>delegates</b> to one person; or the group decides but someone holds a <b>veto</b>. Name the rule in each team charter.</p>', vi: '<p>Thống nhất quy tắc ra quyết định trước khi có xung đột. Gọi tên quy tắc trong từng điều lệ nhóm.</p>' },
  cot: 'Decision rule', luaChon: ['Leader decides', 'Majority vote', 'Unanimous vote', 'Consensus', 'Delegation', 'Group decides with veto'],
  hang: [
    ['"The product manager hears everyone, then makes the call."', 'Leader decides'],
    ['"We count hands; more than half wins."', 'Majority vote'],
    ['"Every member must vote yes."', 'Unanimous vote'],
    ['"We talk until everyone can live with the option and commits to it, even if it was not their first choice."', 'Consensus'],
    ['"The sponsor has asked the lead BA to decide every UI requirement."', 'Delegation'],
    ['"The team decides, but the security officer can block anything that breaks policy."', 'Group decides with veto'],
  ],
  giaiThich: '<p>Deciding how you will decide prevents deadlock later; consensus is not unanimity — it means everyone can live with the decision.</p>',
  goiY: ['Consensus ≠ unanimous: "có thể chấp nhận", không phải "ai cũng thích nhất".', 'Một người được giao quyền ⇒ delegation.'],
  loiHayGap: ['Nhầm consensus với unanimous.', 'Nhầm delegation với leader decides.'],
  thuatNgu: [{ en: 'decision rule', vi: 'quy tắc ra quyết định' }, { en: 'consensus', vi: 'đồng thuận — ai cũng chấp nhận được và cam kết' }],
  khaiNiem: ['decision rules'],
});

const E2 = phanLoai({
  tieuDe: 'Agreement 2 — what each party agrees to',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Reaching agreement on requirements means: <b>customers</b> agree they address their needs; <b>developers</b> agree they understand them and they are feasible; <b>testers</b> agree they are verifiable; <b>management</b> agrees they will achieve the business objectives. Match the statement to the party.</p>', vi: '<p>Mỗi bên thống nhất một điều khác nhau.</p>' },
  cot: 'Party', luaChon: ['Customers', 'Developers', 'Testers', 'Management'],
  hang: [
    ['"Yes, this is what our clinic needs."', 'Customers'],
    ['"We understand it and can build it within the constraints."', 'Developers'],
    ['"We can write a pass/fail test for every requirement."', 'Testers'],
    ['"Delivering this will meet the objectives we funded."', 'Management'],
  ],
  giaiThich: '<p>A signature without this shared understanding is just a ritual.</p>',
  goiY: ['Tester quan tâm "kiểm được không".', 'Quản lý quan tâm mục tiêu nghiệp vụ.'],
  loiHayGap: ['Coi ký duyệt là đủ.', 'Quên vai trò của tester khi thống nhất.'],
  thuatNgu: tn('baseline', 'verifiable'),
  khaiNiem: ['reaching agreement'],
});

const E3 = tracNghiem({
  tieuDe: 'Agreement 3 — baselines and sign-off',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>More important than the sign-off ritual is the <b>baseline</b>: requirements reviewed and agreed at a point in time, the basis for further development; future changes go through the change process and may force renegotiating cost, resources and schedule. Don’t use sign-off as a weapon. If you cannot get agreement, find out why, record the risk, and proceed cautiously on the baseline.</p>', vi: '<p>Baseline quan trọng hơn nghi thức ký; không dùng chữ ký làm vũ khí; không đạt thống nhất thì tìm hiểu lý do, ghi rủi ro, thận trọng tiến lên.</p>' },
  cau: [
    { en: 'A BA e-mails "If I don’t hear back by Friday I’ll assume you agree." This is…', vi: 'BA e-mail "Không trả lời trước thứ Sáu thì coi như đồng ý." Đây là…', lc: [['a', 'not real agreement — find out why they are silent and record the risk'], ['b', 'a valid sign-off'], ['c', 'the agile way'], ['d', 'required by IEEE 830']], dap: 'a', giai: ['Silence ≠ agreement.', 'Im lặng ≠ đồng ý.'] },
    { en: 'Six months later the client says "you made us sign, so now you cannot change anything". What went wrong?', vi: 'Sáu tháng sau khách nói "các anh bắt ký rồi nên không được đổi gì". Sai ở đâu?', lc: [['a', 'Sign-off was used as a weapon instead of a milestone with an agreed change process'], ['b', 'Nothing'], ['c', 'They signed too early'], ['d', 'The SRS was too short']], dap: 'a', giai: ['The baseline subtext: changes go through change control.', 'Ý nghĩa baseline: thay đổi đi qua kiểm soát thay đổi.'] },
    { en: 'What does a baseline imply for later changes?', vi: 'Baseline ngụ ý gì cho thay đổi về sau?', lc: [['a', 'They are possible but go through change control and may require renegotiating cost, resources and schedule'], ['b', 'They are forbidden'], ['c', 'They are free'], ['d', 'Only developers may change it']], dap: 'a', giai: ['Wiegers’ baseline subtext.', 'Ý nghĩa baseline theo Wiegers.'] },
  ],
  goiY: ['Im lặng không phải đồng ý.', 'Baseline = hiểu biết tốt nhất hôm nay + quy trình thay đổi.'],
  loiHayGap: ['Coi chữ ký là bức tường chặn mọi thay đổi.', 'Coi im lặng là đồng ý.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('baseline', 'ccb'),
  khaiNiem: ['baseline', 'sign-off'],
});

const E4 = phanLoai({
  tieuDe: 'Agreement 4 — traditional or agile agreement?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>On agile projects there is no formal up-front sign-off of the full scope: each iteration, the product owner and the team agree in planning which stories to build (by priority and velocity); that set is frozen for the iteration and new requests go to later iterations. The vision and business requirements are still set at the outset.</p>', vi: '<p>Agile không ký duyệt toàn bộ phạm vi từ đầu; mỗi vòng PO và đội thống nhất story sẽ làm và "đóng băng" trong vòng đó.</p>' },
  cot: 'Approach', luaChon: ['Traditional', 'Agile', 'Both'],
  hang: [
    ['The full SRS is baselined before design starts.', 'Traditional'],
    ['The stories chosen in sprint planning are frozen for the sprint; new requests go to the backlog.', 'Agile'],
    ['The vision and business requirements are agreed at the start.', 'Both'],
    ['Approvers sign a page explaining what the baseline means for future changes.', 'Traditional'],
    ['Agreement is reached again at every iteration planning session.', 'Agile'],
  ],
  giaiThich: '<p>Agile changes when and how often agreement happens, not whether it happens.</p>',
  goiY: ['Tầm nhìn và yêu cầu nghiệp vụ ⇒ cả hai.', 'Đóng băng story trong sprint ⇒ agile.'],
  loiHayGap: ['Nghĩ agile không cần thống nhất gì.', 'Nghĩ agile không có tầm nhìn.'],
  thuatNgu: tn('backlog', 'baseline'),
  khaiNiem: ['agreement on agile projects'],
});

export default moDun({
  slug: 'swr302-2-5-ch2-agreement',
  ten: '2.5 Decision makers and reaching agreement',
  moTaModule: 'Sáu quy tắc ra quyết định (leader, đa số, nhất trí, đồng thuận, uỷ quyền, phủ quyết), mỗi bên thống nhất điều gì, baseline và chữ ký, khi không đạt thống nhất, thống nhất trong agile.',
  de: [E1, E2, E3, E4],
});
