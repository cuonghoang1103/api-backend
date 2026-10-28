/**
 * SWT301 · 9.3 — User stories (3C, INVEST, testable — K3), retrospectives, continuous integration (Topic 8 slide 48–64).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const INV = ['Independent', 'Negotiable', 'Valuable', 'Estimable', 'Small', 'Testable'];
const E1 = tinhDe({
  tieuDe: 'User stories 1 — Which INVEST letter does each story break?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>INVEST: <b>I</b>ndependent, <b>N</b>egotiable, <b>V</b>aluable, <b>E</b>stimable, <b>S</b>mall, <b>T</b>estable. Each LabBook story below breaks mainly one letter.</p>', vi: '<p>INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. Mỗi story LabBook dưới đây vi phạm chủ yếu một chữ.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Story → broken criterion', 'Story → tiêu chí bị vi phạm'),
    cot: [{ ma: 's', ten: 'Story' }, { ma: 'c', ten: 'Criterion', luaChon: INV }],
    hang: [
      'As a student I want the booking page to be fast and user-friendly',
      'As a developer I want to refactor the repository layer into three classes',
      'As a student I want to book, cancel, join waitlists, see statistics, export to PDF and pay fees online',
      'As a student I want to cancel a booking — it can only be done after story US-31 (“book a seat”) is finished in the same sprint',
      'As a manager I want AI to predict lab demand — nobody in the team knows how to build or size it',
      'As a student I want to book a seat by clicking the blue button in the top-left corner, exactly 40 px wide',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.c': INV[5], 'r1.c': INV[2], 'r2.c': INV[4], 'r3.c': INV[0], 'r4.c': INV[3], 'r5.c': INV[1] },
    giaiThich: giai('“Fast, user-friendly” cannot be checked; a refactoring task gives no user value; six features do not fit one iteration; a story that only works after another is not independent; an unknown technology cannot be estimated; a story that fixes the UI design leaves nothing to negotiate.', '“Nhanh, thân thiện” không kiểm được; refactor không mang giá trị cho người dùng; sáu tính năng không vừa một iteration; story chỉ làm được sau story khác thì không độc lập; công nghệ chưa ai biết thì không ước lượng được; story quy định cứng thiết kế UI thì không còn gì để thương lượng.'),
  }],
  goiY: ['Từ mơ hồ (fast, friendly) ⇒ Testable.', 'Quy định chi tiết thiết kế ⇒ Negotiable.'],
  loiHayGap: ['Gán story refactor cho Small.', 'Gán story quá nhiều tính năng cho Estimable.'],
  giaiThich: '<p>T · V · S · I · E · N.</p>',
  thuatNgu: [{ en: 'INVEST', vi: 'tiêu chí story tốt của Bill Wake' }, { en: '3C — card, conversation, confirmation', vi: 'thẻ, trao đổi, xác nhận' }],
  khaiNiem: ['user stories'],
});

const VAGUE = ['fast', 'quick', 'easy', 'user-friendly', 'user friendly', 'simple', 'nice', 'etc', 'appropriate', 'some', 'many', 'flexible', 'efficient'];
const E2 = jsDe({
  tieuDe: 'User stories 2 — Write a testable story with acceptance criteria (K3)',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>The department says: “Students should be warned before they lose their seat if they forget to check in — something like a reminder, and the seat should go to someone else if they don’t come.” Facts agreed in the three-amigos conversation: a booking must be checked in within <b>15 minutes</b> after its start; a reminder e-mail is sent <b>10 minutes</b> after the start if not checked in; after 15 minutes the booking becomes <b>NO_SHOW</b> and the first waiting student is promoted.</p>
<p>Write <code>STORY</code> = <code>{ role, goal, benefit, acceptanceCriteria: [{ given, when, then }] }</code> — the <b>card</b> (As a… I want… so that…) and the <b>confirmation</b>.</p>`, vi: `<p>Phòng lab nói: “Nên nhắc sinh viên trước khi mất chỗ nếu quên check-in — kiểu như nhắc nhở, và chỗ phải chuyển cho người khác nếu không tới.” Sự kiện đã chốt trong buổi ba người: phải check-in trong <b>15 phút</b> sau giờ bắt đầu; gửi thư nhắc <b>10 phút</b> sau giờ bắt đầu nếu chưa check-in; quá 15 phút booking thành <b>NO_SHOW</b> và người chờ đầu tiên được nâng hạng. Viết <code>STORY</code> gồm thẻ (As a… I want… so that…) và phần xác nhận (acceptance criteria Given/When/Then).</p>` },
  yeuCau: [
    { en: 'At least 3 acceptance criteria, each with non-empty given, when, then.', vi: 'Ít nhất 3 acceptance criteria, mỗi cái đủ given, when, then.' },
    { en: 'No vague words anywhere: ' + VAGUE.join(', ') + '.', vi: 'Không có từ mơ hồ: ' + VAGUE.join(', ') + '.' },
    { en: 'The criteria must mention the numbers 10 and 15 (minutes), NO_SHOW and the promotion of the waitlist.', vi: 'Các tiêu chí phải có số 10 và 15 (phút), NO_SHOW và việc nâng hạng người chờ.' },
  ],
  viDu: [{ input: 'given / when / then', output: "{ given: 'a CONFIRMED booking starting at 09:00 that is not checked in', when: 'it is 09:10', then: 'the student receives a reminder e-mail' }", explanation: 'Concrete, checkable, with the agreed number.|||Cụ thể, kiểm được, có con số đã chốt.' }],
  goiY: ['role là sinh viên hoặc người chờ; benefit nói rõ lợi ích (không mất chỗ / chỗ không bỏ trống).', 'Mỗi con số chốt trong buổi trao đổi nên có một tiêu chí riêng, kể cả trường hợp check-in đúng hạn.'],
  loiHayGap: ['Giữ chữ “something like a reminder” của yêu cầu gốc.', 'Viết tiêu chí không có con số.'],
  giaiThich: '<p>Card + conversation + confirmation: the conversation turned “something like a reminder” into numbers, and the confirmation turns those numbers into checkable criteria — the basis of the ATDD tests.</p>',
  thuatNgu: [{ en: 'acceptance criteria', vi: 'tiêu chí chấp nhận' }, { en: 'Given/When/Then', vi: 'cho trước / khi / thì' }, { en: 'check-in', vi: 'xác nhận có mặt' }],
  khaiNiem: ['user stories', 'acceptance criteria'],
  tep: {
    'story.js': [
      "const STORY = {\n  role: '',\n  goal: '',\n  benefit: '',\n  acceptanceCriteria: [\n    { given: '', when: '', then: '' },\n  ],\n};\n",
      `const STORY = {
  role: 'student with a lab booking',
  goal: 'to be reminded to check in and to know when my seat is released',
  benefit: 'I do not lose my seat by accident and seats are not left empty for students who are waiting',
  acceptanceCriteria: [
    { given: 'a CONFIRMED booking starting at 09:00 that is not checked in', when: 'it is 09:10 (10 minutes after the start)', then: 'the student receives one reminder e-mail' },
    { given: 'a CONFIRMED booking starting at 09:00', when: 'the student checks in at 09:15 (15 minutes after the start)', then: 'the booking stays CONFIRMED and no further e-mail is sent' },
    { given: 'a CONFIRMED booking starting at 09:00 that is not checked in, and a waiting student', when: 'it is 09:16 (more than 15 minutes after the start)', then: 'the booking becomes NO_SHOW and the first waiting student is promoted and e-mailed' },
    { given: 'a CONFIRMED booking that was checked in at 09:05', when: 'it is 09:10', then: 'no reminder e-mail is sent' },
  ],
};
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the card: role, goal and benefit are written', vi: 'thẻ: có role, goal, benefit' }, () => (typeof STORY === 'object' && String(STORY.role).trim().length >= 3 && String(STORY.goal).trim().length >= 10 && String(STORY.benefit).trim().length >= 10 ? 'OK' : 'write role, goal and benefit (As a … I want … so that …)')),
    kiemTuy({ en: 'at least 3 complete Given/When/Then criteria', vi: 'ít nhất 3 tiêu chí Given/When/Then đầy đủ' }, () => { const a = Array.isArray(STORY.acceptanceCriteria) ? STORY.acceptanceCriteria : []; return a.length >= 3 && a.every((c) => c && ['given', 'when', 'then'].every((k) => String(c[k] || '').trim().length >= 5)) ? 'OK' : 'need ≥ 3 criteria with given, when and then filled in'; }),
    kiemTuy({ en: 'no vague words', vi: 'không có từ mơ hồ' }, () => { const all = JSON.stringify(STORY).toLowerCase(); const w = ['fast', 'quick', 'easy', 'user-friendly', 'user friendly', 'simple', 'nice', 'etc', 'appropriate', 'some', 'many', 'flexible', 'efficient', 'something'].filter((x) => new RegExp('\\b' + x.replace('-', '\\-') + '\\b').test(all)); return w.length ? 'vague: ' + w.join(', ') : 'OK'; }),
    kiemTuy({ en: 'the agreed facts are in the criteria (10, 15, NO_SHOW, promotion)', vi: 'các sự kiện đã chốt có trong tiêu chí (10, 15, NO_SHOW, nâng hạng)' }, () => { const t = JSON.stringify(STORY.acceptanceCriteria || []); const thieu = []; if (!/\b10\b/.test(t)) thieu.push('10 minutes'); if (!/\b15\b/.test(t)) thieu.push('15 minutes'); if (!/NO_SHOW/.test(t)) thieu.push('NO_SHOW'); if (!/promot/i.test(t)) thieu.push('promotion of the waitlist'); return thieu.length ? 'missing: ' + thieu.join(', ') : 'OK'; }),
  ],
});

const LOAI = ['Retrospective', 'Continuous integration', 'Collaborative user story creation'];
const E3 = tinhDe({
  tieuDe: 'User stories 3 — Retrospectives and continuous integration (K2)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Three of the four common Agile practices. Which practice does each statement describe?</p>', vi: '<p>Ba trong bốn thực hành chung của Agile. Mỗi phát biểu mô tả thực hành nào?</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → practice', 'Phát biểu → thực hành'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'p', ten: 'Practice', luaChon: LOAI }],
    hang: [
      'At the end of the sprint the team discusses what succeeded, what could be improved and how to include the improvements',
      'Every change is integrated at least daily, followed by an automated build and regression run',
      'The tester asks “what happens when the lab is full?” while the product owner writes the story with the developers',
      'Testers bring up test-effectiveness issues — e.g. too many defects escaped — and the team agrees an action',
      'A failing build is visible to everyone at once and fixing it becomes the team’s first priority',
      'Brainstorming and mind maps produce acceptance criteria before any code is written',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.p': LOAI[0], 'r1.p': LOAI[1], 'r2.p': LOAI[2], 'r3.p': LOAI[0], 'r4.p': LOAI[1], 'r5.p': LOAI[2] },
    giaiThich: giai('Retrospectives improve the process; CI gives fast, visible feedback on every change; collaborative story creation makes stories testable before code.', 'Retrospective cải tiến quy trình; CI cho phản hồi nhanh, ai cũng thấy với mỗi thay đổi; viết story cùng nhau làm story kiểm thử được trước khi có mã.'),
  }],
  goiY: ['“Cải tiến quy trình” ⇒ retrospective.', '“Build tự động, regression mỗi ngày” ⇒ CI.'],
  loiHayGap: ['Cho rằng tester không tham gia retrospective.', 'Cho rằng CI chỉ là build, không gồm test.'],
  giaiThich: '<p>R · CI · S · R · CI · S.</p>',
  thuatNgu: [{ en: 'retrospective', vi: 'buổi nhìn lại cuối iteration' }],
  khaiNiem: ['retrospectives', 'continuous integration'],
});

export default doiDau({
  slug: 'swt301-agile-user-stories-ci',
  ten: '9.3 User stories, retrospectives and continuous integration',
  moTaModule: 'INVEST trên story LabBook, viết story kiểm thử được với acceptance criteria Given/When/Then (K3), phân biệt retrospective, CI và viết story cùng nhau.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-user-stories-ci',
  de: [E1, E2, E3],
});
