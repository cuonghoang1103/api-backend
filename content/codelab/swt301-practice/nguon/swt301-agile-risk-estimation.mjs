/**
 * SWT301 · 9.7 — Quality risk per story, planning poker, testable acceptance criteria, Agile tools (Agile Tester §3.2–3.4).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const E1 = jsDe({
  tieuDe: 'Agile estimation 1 — Run a planning poker round',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>Planning poker (FA-3.2.2): everyone shows a card at the same time; if the estimates are far apart the highest and lowest voters explain, then the team votes again. The deck is the modified Fibonacci <code>[1, 2, 3, 5, 8, 13, 20, 40, 100]</code>.</p>
<p>Write <code>pokerRound(votes)</code> — <code>votes</code> = <code>{ name: card }</code>. If any card is not in the deck return <code>{ error: 'INVALID_CARD' }</code>. Two cards are “close” when they are equal or neighbours in the deck. If the highest and lowest cards are close, return <code>{ consensus: true, estimate }</code> where estimate is the highest card. Otherwise return <code>{ consensus: false, explain: [names with the lowest card, then names with the highest card, each group sorted A→Z] }</code>.</p>`, vi: `<p>Planning poker: mọi người lật bài cùng lúc; nếu ước lượng cách xa nhau thì người cao nhất và thấp nhất giải thích rồi bỏ phiếu lại. Bộ bài Fibonacci cải biên như trên. Viết <code>pokerRound(votes)</code>: bài lạ ⇒ INVALID_CARD; nếu lá cao nhất và thấp nhất “gần nhau” (bằng hoặc kề nhau trong bộ bài) ⇒ đồng thuận, ước lượng = lá cao nhất; ngược lại trả danh sách người cần giải thích (nhóm thấp nhất rồi nhóm cao nhất, mỗi nhóm sắp A→Z).</p>` },
  yeuCau: [{ en: 'The tester’s estimate counts like everyone else’s — testing effort is part of the story’s size.', vi: 'Ước lượng của tester tính như mọi người — công sức test là một phần kích thước story.' }],
  viDu: [{ input: "pokerRound({ An: 3, Binh: 5, Chi: 13, Dung: 5 })", output: "{ consensus: false, explain: ['An', 'Chi'] }", explanation: '3 and 13 are far apart: An and Chi explain (often the tester saw extra test work).|||3 và 13 cách xa: An và Chi giải thích (thường tester thấy thêm việc test).' }],
  goiY: ['Đổi lá bài thành vị trí trong bộ bài; “gần” = chênh vị trí ≤ 1.', 'Tên có thể trùng lá: gom tất cả người có lá thấp nhất / cao nhất.'],
  loiHayGap: ['Lấy trung bình các lá — planning poker tìm đồng thuận, không lấy trung bình.', 'Coi 5 và 13 là gần vì chỉ “lệch hai lá”.'],
  giaiThich: '<p>The discussion between the extremes is the value of planning poker: hidden work (test data, non-functional tests, regression) comes to light before the sprint starts.</p>',
  thuatNgu: [{ en: 'planning poker', vi: 'ước lượng bằng bài theo nhóm' }, { en: 'consensus', vi: 'đồng thuận' }],
  khaiNiem: ['Agile estimation'],
  tep: {
    'poker.js': [
      'function pokerRound(votes) {\n  return { consensus: true, estimate: 0 };\n}\n',
      `const DECK = [1, 2, 3, 5, 8, 13, 20, 40, 100];
function pokerRound(votes) {
  const names = Object.keys(votes);
  if (names.some((n) => DECK.indexOf(votes[n]) < 0)) return { error: 'INVALID_CARD' };
  const idx = names.map((n) => DECK.indexOf(votes[n]));
  const lo = Math.min(...idx), hi = Math.max(...idx);
  if (hi - lo <= 1) return { consensus: true, estimate: DECK[hi] };
  const who = (i) => names.filter((n) => DECK.indexOf(votes[n]) === i).sort();
  return { consensus: false, explain: [...who(lo), ...who(hi)] };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = pokerRound({ An: 3, Binh: 5, Chi: 13, Dung: 5 }); return JSON.stringify(r) === '{"consensus":false,"explain":["An","Chi"]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'neighbouring cards reach consensus on the higher one', vi: 'lá kề nhau đồng thuận theo lá cao hơn' }, () => { const r = pokerRound({ a: 5, b: 8, c: 8 }); return JSON.stringify(r) === '{"consensus":true,"estimate":8}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'groups of extremes are sorted', vi: 'nhóm cực trị được sắp' }, () => { const r = pokerRound({ Zed: 1, Amy: 1, Bob: 20, Cat: 3, Al: 20 }); return JSON.stringify(r.explain) === '["Amy","Zed","Al","Bob"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'invalid card', vi: 'lá bài không hợp lệ' }, () => (JSON.stringify(pokerRound({ a: 4, b: 5 })) === '{"error":"INVALID_CARD"}' ? 'OK' : 'a 4 is not in the deck')),
    kiemTuy({ en: 'all equal', vi: 'tất cả bằng nhau' }, () => (JSON.stringify(pokerRound({ a: 13, b: 13 })) === '{"consensus":true,"estimate":13}' ? 'OK' : 'expected consensus 13'), { an: true }),
  ],
});

const MUC = ['High — test early, extensively, several techniques', 'Medium — standard tests of the acceptance criteria', 'Low — light tests or exploratory only'];
const E2 = tinhDe({
  tieuDe: 'Agile estimation 2 — Quality risk per story (K3)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>FA-3.2.1: in every iteration the team assesses the quality risk of each story (likelihood × impact) and adapts the testing. Rate each story of LabBook sprint 12.</p>', vi: '<p>FA-3.2.1: ở mọi iteration, đội đánh giá rủi ro chất lượng của từng story (khả năng × tác động) và điều chỉnh việc test. Đánh giá từng story của sprint 12 LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Story → risk and testing', 'Story → rủi ro và việc test'),
    cot: [{ ma: 's', ten: 'Story' }, { ma: 'r', ten: 'Risk', luaChon: MUC }],
    hang: [
      'Online payment of late-cancellation fees (new payment gateway, money involved)',
      'Change the colour of the “Book” button to the university blue',
      'Show the waitlist position next to each PENDING booking (simple read of existing data)',
      'Rewrite the weekly-limit calculation for the new exam-week rule (complex, used by every booking)',
      'Add a link to the lab rules PDF in the footer',
      'Filter the lab list by building',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.r': MUC[0], 'r1.r': MUC[2], 'r2.r': MUC[1], 'r3.r': MUC[0], 'r4.r': MUC[2], 'r5.r': MUC[1] },
    giaiThich: giai('Money, new technology and complex logic used everywhere ⇒ high; cosmetic or static content ⇒ low; ordinary features ⇒ medium.', 'Tiền, công nghệ mới và logic phức tạp dùng khắp nơi ⇒ cao; giao diện hay nội dung tĩnh ⇒ thấp; tính năng thông thường ⇒ trung bình.'),
  }],
  goiY: ['Có tiền / công nghệ mới / logic phức tạp ⇒ cao.', 'Chỉ đổi màu, thêm liên kết ⇒ thấp.'],
  loiHayGap: ['Cho mọi story cùng một mức test.', 'Đánh giá rủi ro một lần cho cả bản phát hành rồi thôi.'],
  giaiThich: '<p>High · Low · Medium · High · Low · Medium.</p>',
  thuatNgu: [{ en: 'quality risk', vi: 'rủi ro chất lượng' }],
  khaiNiem: ['Agile risk'],
});

const E3 = tinhDe({
  tieuDe: 'Agile estimation 3 — Acceptance criteria, ATDD, exploratory and tools (K2–K3)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions on FA-3.3.1–3.4.1: testable acceptance criteria, ATDD test cases, exploratory testing and tools in Agile projects.</p>', vi: '<p>Sáu câu về FA-3.3.1–3.4.1: acceptance criteria kiểm thử được, test case ATDD, kiểm thử khám phá và công cụ trong dự án Agile.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which acceptance criterion is testable?', 'Acceptance criterion nào kiểm thử được?'), luaChon: lc(['a', 'The booking page loads quickly'], ['b', 'For 95% of requests with 300 concurrent users, the booking page loads within 2 seconds'], ['c', 'The booking page is user-friendly'], ['d', 'Booking works well']), dapAn: ['b'], giaiThich: giai('Measurable condition and expected result.', 'Điều kiện và kết quả mong đợi đo được.') },
    { ma: 'q2', de: hai('Which aspects should acceptance criteria cover (FA-3.3.2)?', 'Acceptance criteria nên bao phủ những khía cạnh nào (FA-3.3.2)?'), luaChon: lc(['a', 'Only the happy path'], ['b', 'Functional behaviour, quality characteristics, scenarios, business rules, external interfaces, constraints and data definitions'], ['c', 'Only the UI'], ['d', 'Only performance']), dapAn: ['b'], giaiThich: giai('The syllabus list.', 'Danh sách của syllabus.') },
    { ma: 'q3', de: hai('In ATDD, when are the acceptance tests written?', 'Trong ATDD, acceptance test được viết khi nào?'), luaChon: lc(['a', 'After the code is finished'], ['b', 'Before coding, in a specification workshop, from the acceptance criteria'], ['c', 'During UAT'], ['d', 'Never']), dapAn: ['b'], giaiThich: giai('They become executable requirements.', 'Chúng thành yêu cầu chạy được.') },
    { ma: 'q4', de: hai('Why is exploratory testing important in Agile projects?', 'Vì sao kiểm thử khám phá quan trọng trong dự án Agile?'), luaChon: lc(['a', 'It needs no skills'], ['b', 'Short iterations and limited time for test analysis: exploratory sessions with charters find what the automated checks miss'], ['c', 'It replaces automation'], ['d', 'It is required by Scrum']), dapAn: ['b'], giaiThich: giai('FA-3.3.5.', 'FA-3.3.5.') },
    { ma: 'q5', de: hai('Which tool is typical for Agile teams to make status visible?', 'Công cụ nào điển hình để đội Agile làm trạng thái hiển thị?'), luaChon: lc(['a', 'Task-management and tracking tools (electronic task boards, burndowns)'], ['b', 'Only spreadsheets e-mailed weekly'], ['c', 'Printed test plans'], ['d', 'None']), dapAn: ['a'], giaiThich: giai('Plus communication tools, wikis, CI, configuration management, test design, implementation and execution tools.', 'Cùng công cụ giao tiếp, wiki, CI, quản lý cấu hình, công cụ thiết kế và thực thi test.') },
    { ma: 'q6', de: hai('How is test effort included in Agile estimation?', 'Công sức test được tính vào ước lượng Agile thế nào?'), luaChon: lc(['a', 'It is estimated separately after the sprint'], ['b', 'It is part of each story’s size, estimated by the whole team including the tester'], ['c', 'It is ignored'], ['d', 'Only the test manager estimates it']), dapAn: ['b'], giaiThich: giai('Planning poker by the whole team.', 'Planning poker của cả đội.') },
  ],
  goiY: ['Kiểm thử được = có điều kiện + kết quả đo được.', 'ATDD = trước khi code.'],
  loiHayGap: ['Chọn “nhanh” cho tiêu chí kiểm thử được.', 'Ước lượng công sức test riêng sau sprint.'],
  giaiThich: '<p>Answers: b · b · b · b · a · b.</p>',
  thuatNgu: [{ en: 'executable requirement', vi: 'yêu cầu chạy được' }],
  khaiNiem: ['acceptance criteria', 'Agile tools'],
});

export default doiDau({
  slug: 'swt301-agile-risk-estimation',
  ten: '9.7 Agile risk, estimation and acceptance criteria',
  moTaModule: 'Viết code một vòng planning poker (bộ bài Fibonacci, đồng thuận, ai giải thích), rủi ro chất lượng theo story, acceptance criteria kiểm thử được, ATDD, khám phá và công cụ Agile.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-risk-estimation',
  de: [E1, E2, E3],
});
