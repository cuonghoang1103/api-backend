/**
 * SWR302 · 7.7 — Requirements tracing: concepts and motivations (Wiegers Ch.29 slides 1–7, 10–11).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Tracing 1 — which motivation for tracing?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers’ motivations for tracing: finding missing requirements · finding unnecessary requirements · certification and compliance · change impact analysis · maintenance · project tracking · reengineering · reuse · testing. Name the motivation behind each use of the trace data.</p>', vi: '<p>Các lý do để truy vết. Gọi tên lý do đằng sau từng cách dùng dữ liệu truy vết.</p>' },
  cot: 'Motivation', luaChon: ['Finding missing requirements', 'Finding unnecessary requirements', 'Certification and compliance', 'Change impact analysis', 'Maintenance', 'Project tracking', 'Reengineering', 'Reuse', 'Testing'],
  hang: [
    ['A business requirement traces to no user requirement.', 'Finding missing requirements'],
    ['A functional requirement traces to no user or business requirement.', 'Finding unnecessary requirements'],
    ['The auditor asks to see that every safety requirement is implemented and tested.', 'Certification and compliance'],
    ['A tax rule changes; the team finds every design element and code module that handles it.', 'Maintenance'],
    ['Links from requirements to code are missing for 12 requirements — that work is not done yet.', 'Project tracking'],
    ['The functions of the 1998 system are listed and traced into the new system’s requirements.', 'Reengineering'],
    ['A test fails; the team identifies which requirement is not satisfied.', 'Testing'],
    ['The team takes the payment requirements, design and code of one product into another.', 'Reuse'],
  ],
  giaiThich: '<p>The same links serve many purposes — which is why tracing pays off when done consistently.</p>',
  goiY: ['Không có con ⇒ thiếu yêu cầu; không có cha ⇒ yêu cầu thừa.', 'Thiếu liên kết tới code ⇒ việc chưa làm (theo dõi dự án).'],
  loiHayGap: ['Nhầm maintenance với change impact.', 'Nhầm reuse với reengineering.'],
  thuatNgu: tn('rtm'),
  khaiNiem: ['motivations for tracing'],
});

const E2 = tracNghiem({
  tieuDe: 'Tracing 2 — how much tracing?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Figure 29-2 shows many possible trace relationships — you do not need them all. Do a cost-benefit analysis: often most of the benefit comes from a few links (e.g. system tests back to functional or user requirements). Each requirement must have a unique, persistent label for tracing to work.</p>', vi: '<p>Không cần mọi liên kết — phân tích chi phí–lợi ích.</p>' },
  cau: [
    { en: 'A small team asks whether to trace every requirement to every artefact. Best answer?', vi: 'Một đội nhỏ hỏi có cần truy mọi yêu cầu tới mọi sản phẩm không. Trả lời tốt nhất?', lc: [['a', 'No — choose the links that give most value (e.g. tests ↔ requirements, core high-risk functions first)'], ['b', 'Yes, always all links'], ['c', 'No tracing at all'], ['d', 'Only trace the glossary']], dap: 'a', giai: ['Cost-benefit.', 'Chi phí–lợi ích.'] },
    { en: 'What must exist before any tracing can work?', vi: 'Điều gì phải có trước khi truy vết được?', lc: [['a', 'Unique, persistent labels for requirements'], ['b', 'A 3D model'], ['c', 'A finished system'], ['d', 'A burndown chart']], dap: 'a', giai: ['You cannot link what you cannot name.', 'Không gọi tên được thì không nối được.'] },
  ],
  goiY: ['Bắt đầu từ liên kết giá trị cao.', 'Nhãn duy nhất, bền vững.'],
  loiHayGap: ['Truy vết mọi thứ rồi bỏ cuộc.', 'Truy vết khi yêu cầu chưa có nhãn.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('rtm'),
  khaiNiem: ['tracing scope'],
});

const E3 = phanLoai({
  tieuDe: 'Tracing 3 — who supplies the trace links?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Trace links should be defined by whoever has the knowledge (Table 29-3): the <b>BA</b> knows links between needs and requirements; <b>developers</b> know links between requirements and design/code; <b>testers</b> know links between requirements and tests.</p>', vi: '<p>Ai nắm thông tin thì người đó ghi liên kết.</p>' },
  cot: 'Supplied by', luaChon: ['Business analyst', 'Developer', 'Tester'],
  hang: [
    ['UC-04 → FR-12', 'Business analyst'],
    ['FR-12 → booking.service.ts', 'Developer'],
    ['FR-12 → TC-33', 'Tester'],
    ['BR-07 → FR-15', 'Business analyst'],
    ['FR-15 → class FeeCalculator', 'Developer'],
  ],
  giaiThich: '<p>A coordinator (usually the BA) makes sure each role supplies its links as work is completed.</p>',
  goiY: ['Nhu cầu/luật → yêu cầu ⇒ BA.', 'Yêu cầu → code ⇒ dev; yêu cầu → test ⇒ tester.'],
  loiHayGap: ['Để BA tự ghi cả liên kết tới code.', 'Không ai phụ trách liên kết tới test.'],
  thuatNgu: tn('rtm'),
  khaiNiem: ['trace link sources'],
});

const E4 = tracNghiem({
  tieuDe: 'Tracing 4 — tracing nonfunctional requirements',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Nonfunctional requirements often do not trace to one piece of code: a response-time requirement may dictate hardware, algorithms, database structure or architecture; a portability requirement may restrict language features. Some quality attributes do produce code (e.g. security functions such as login lock-out) — trace those to it.</p>', vi: '<p>Yêu cầu phi chức năng thường không truy về một đoạn code cụ thể.</p>' },
  cau: [
    { en: '"95% of searches in under 2 seconds" most likely traces to…', vi: '"95% lượt tìm dưới 2 giây" nhiều khả năng truy tới…', lc: [['a', 'architecture and design decisions (indexes, caching, hardware) and performance tests'], ['b', 'one function named search()'], ['c', 'nothing'], ['d', 'the glossary']], dap: 'a', giai: ['Quality → architecture + tests.', 'Chất lượng → kiến trúc + test.'] },
    { en: '"Lock the account after 5 failed logins" traces to…', vi: '"Khoá tài khoản sau 5 lần đăng nhập sai" truy tới…', lc: [['a', 'specific code (the lock-out function) and its tests'], ['b', 'only the hardware'], ['c', 'nothing'], ['d', 'the vision statement only']], dap: 'a', giai: ['This quality requirement produces code.', 'Yêu cầu chất lượng này sinh ra code.'] },
  ],
  goiY: ['Hiệu năng ⇒ kiến trúc, thiết kế, test hiệu năng.', 'Chức năng bảo mật cụ thể ⇒ code.'],
  loiHayGap: ['Đòi mọi NFR phải trỏ tới một hàm.', 'Bỏ NFR khỏi truy vết.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('nfr', 'rtm'),
  khaiNiem: ['tracing nonfunctional requirements'],
});

export default moDun({
  slug: 'swr302-7-7-ch29-tracing-concepts',
  ten: '7.7 Requirements tracing: concepts and motivations',
  moTaModule: 'Chín lý do truy vết, truy vết bao nhiêu là đủ (chi phí–lợi ích), ai cung cấp liên kết nào (BA/dev/tester), truy vết yêu cầu phi chức năng.',
  de: [E1, E2, E3, E4],
});
