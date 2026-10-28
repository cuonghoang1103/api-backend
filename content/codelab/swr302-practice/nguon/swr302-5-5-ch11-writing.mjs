/**
 * SWR302 · 5.4 — Guidelines for writing requirements (Wiegers Ch.11 slides 12–20).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Writing 1 — system or user perspective?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers’ writing guidelines include: write from the system’s perspective ("The system shall…") or the user’s ("The <i>user class</i> shall be able to…"), use the active voice, state one requirement per sentence, write complete sentences with correct grammar, keep a consistent level of detail, and avoid redundancy.</p>', vi: '<p>Hướng dẫn viết của Wiegers: viết từ góc nhìn hệ thống ("The system shall…") hoặc người dùng ("The <i>lớp người dùng</i> shall be able to…"), dùng thể chủ động, mỗi câu một yêu cầu, câu đầy đủ đúng ngữ pháp, mức chi tiết nhất quán, tránh trùng lặp.</p>' },
  cau: [
    { en: 'Which follows the guidelines?', vi: 'Câu nào theo hướng dẫn?', lc: [['a', 'A reminder will be sent.'], ['b', 'The system shall send a reminder to the tenant 3 days before the rent is due.'], ['c', 'Reminders: yes.'], ['d', 'Send reminders, maybe by SMS or e-mail etc.']], dap: 'b', giai: ['Active voice, an actor, a time, a recipient.', 'Chủ động, có chủ thể, thời điểm, người nhận.'] },
    { en: '"The rent shall be calculated." What is the problem?', vi: '"The rent shall be calculated." Vấn đề là gì?', lc: [['a', 'Passive voice hides WHO calculates it and HOW'], ['b', 'It is too long'], ['c', 'It uses shall'], ['d', 'Nothing']], dap: 'a', giai: ['Rewrite in active voice with the rule.', 'Viết lại chủ động kèm luật tính.'] },
    { en: '"The tenant shall be able to cancel a viewing" is written from…', vi: '"The tenant shall be able to cancel a viewing" viết từ…', lc: [['a', 'the system’s perspective'], ['b', 'the user’s perspective — acceptable'], ['c', 'the developer’s perspective'], ['d', 'no perspective']], dap: 'b', giai: ['Both perspectives are acceptable; be consistent.', 'Cả hai góc nhìn đều được; hãy nhất quán.'] },
  ],
  goiY: ['Câu bị động giấu chủ thể.', 'Mỗi câu một yêu cầu.'],
  loiHayGap: ['Viết bị động ("will be sent").', 'Ghép nhiều ý bằng "etc".'],
  giaiThich: '<p>Answers: b · a · b.</p>',
  thuatNgu: [{ en: 'active voice', vi: 'thể chủ động — nêu rõ ai làm' }],
  khaiNiem: ['writing guidelines'],
});

const E2 = phanLoai({
  tieuDe: 'Writing 2 — which guideline does it break?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Each sentence from a draft SRS breaks one writing guideline. Name it.</p>', vi: '<p>Mỗi câu trong bản nháp SRS vi phạm một hướng dẫn viết. Gọi tên.</p>' },
  cot: 'Guideline broken', luaChon: ['One requirement per statement', 'Active voice', 'Avoid design details', 'Avoid vague words', 'Avoid negative and double-negative wording', 'Consistent level of detail'],
  hang: [
    ['The system shall register tenants, send invoices and generate tax reports.', 'One requirement per statement'],
    ['The deposit shall be refunded.', 'Active voice'],
    ['The system shall store contracts as PDFs in an S3 bucket named contracts-prod.', 'Avoid design details'],
    ['The search page shall be intuitive.', 'Avoid vague words'],
    ['The system shall not prevent a tenant who has not unpaid rent from booking.', 'Avoid negative and double-negative wording'],
    ['FR-1 "The system shall manage housing." FR-2 "The system shall display the room price in VND with a thousand separator."', 'Consistent level of detail'],
  ],
  giaiThich: '<p>Split compound requirements; name the actor; state needs not designs; quantify; write positively; keep sibling requirements at the same level of detail.</p>',
  goiY: ['Nhiều động từ nối bằng "and" ⇒ nhiều yêu cầu.', 'Hai phủ định ("not prevent… not unpaid") ⇒ viết lại khẳng định.'],
  loiHayGap: ['Cho rằng câu ghép là "gọn hơn".', 'Coi tên bucket là chi tiết cần thiết.'],
  thuatNgu: [{ en: 'double negative', vi: 'phủ định kép — khó hiểu, dễ sai' }],
  khaiNiem: ['writing guidelines'],
});

const E3 = baiJs({
  tieuDe: 'Writing 3 — rewrite three bad requirements',
  doKho: 'HARD', phut: 12,
  moTa: { en: '<p>Rewrite each requirement so that it follows the guidelines. <b>R1</b>: "The invoice shall be generated." (monthly, on the 1st, for each active contract). <b>R2</b>: "The system shall not fail to notify landlords who have not received no payment." (the rule: e-mail the landlord when rent is 5 days late). <b>R3</b>: "The system shall let tenants report problems, upload photos and chat with the landlord." (split it). Write <code>REWRITES = { R1: "…", R2: "…", R3: ["…", "…", "…"] }</code>.</p>', vi: '<p>Viết lại từng yêu cầu theo hướng dẫn. R1: bị động (hằng tháng, ngày 1, cho mỗi hợp đồng đang hiệu lực). R2: phủ định kép (luật: e-mail chủ nhà khi tiền thuê trễ 5 ngày). R3: tách làm ba.</p>' },
  yeuCau: [{ en: '"The system shall …", active voice, positive wording, R3 as three separate statements.', vi: '"The system shall …", chủ động, khẳng định, R3 thành ba câu riêng.' }],
  viDu: [{ input: 'The invoice shall be generated.', output: 'The system shall generate an invoice for every active contract at 00:00 on the first day of each month.', explanation: 'Who, what, when.|||Ai, cái gì, khi nào.' }],
  tep: { 'rewrites.js': ["const REWRITES = { R1: '', R2: '', R3: [] };\n", "const REWRITES = {\n  R1: 'The system shall generate an invoice for every active contract at 00:00 on the first day of each month.',\n  R2: 'The system shall e-mail the landlord when the rent of a contract is 5 days late.',\n  R3: [\n    'The system shall let a tenant report a problem with the rented room.',\n    'The system shall let a tenant attach up to 5 photos to a problem report.',\n    'The system shall let a tenant exchange chat messages with the landlord of the rented room.',\n  ],\n};\n"] },
  kiem: [
    kiemTuy({ en: 'R1 is active, says who, what and when', vi: 'R1 chủ động, nói ai, cái gì, khi nào' }, function () {
      if (typeof REWRITES === 'undefined' || !REWRITES) return 'REWRITES is missing';
      var r = String(REWRITES.R1 || '');
      if (!/^the system shall\b/i.test(r)) return 'start with "The system shall"';
      if (/\bbe generated\b|\bis generated\b/i.test(r)) return 'still passive';
      return /month|1st|first/i.test(r) && /active|contract/i.test(r) ? 'OK' : 'say when (monthly, the first day) and for which contracts';
    }),
    kiemTuy({ en: 'R2 is positive and states the 5-day rule', vi: 'R2 khẳng định và nêu luật 5 ngày' }, function () {
      if (typeof REWRITES === 'undefined' || !REWRITES) return 'REWRITES is missing';
      var r = String(REWRITES.R2 || '');
      if (!/^the system shall\b/i.test(r)) return 'start with "The system shall"';
      if (/\bnot\b|\bno\b|n't/i.test(r)) return 'remove the negatives — write what the system DOES';
      return /5 days|five days/i.test(r) && /landlord/i.test(r) ? 'OK' : 'state the rule: notify the landlord when rent is 5 days late';
    }),
    kiemTuy({ en: 'R3 is split into three single requirements', vi: 'R3 tách thành ba yêu cầu đơn' }, function () {
      if (typeof REWRITES === 'undefined' || !REWRITES || !Array.isArray(REWRITES.R3)) return 'R3 must be an array of statements';
      if (REWRITES.R3.length !== 3) return 'three requirements ⇒ three statements';
      for (var i = 0; i < 3; i++) { var r = String(REWRITES.R3[i]); if (!/^the system shall\b/i.test(r)) return 'R3[' + i + ']: "The system shall …"'; if (/,|\band\b.*\band\b/i.test(r.replace(/^the system shall let a tenant/i, ''))) return 'R3[' + i + '] still packs several actions'; }
      var t = REWRITES.R3.join(' ').toLowerCase();
      return /report/.test(t) && /photo/.test(t) && /chat|message/.test(t) ? 'OK' : 'cover report, photos and chat';
    }),
  ],
  goiY: ['R1: chủ ngữ là "The system", thêm thời điểm và đối tượng.', 'R2: viết điều hệ thống LÀM, bỏ mọi "not/no".'],
  loiHayGap: ['Giữ bị động ở R1.', 'Viết R3 thành một câu dài với dấu phẩy.'],
  giaiThich: '<p>Active voice names the actor; positive wording removes double negatives; one requirement per statement makes each one testable and traceable on its own.</p>',
  thuatNgu: [{ en: 'active voice', vi: 'thể chủ động' }, { en: 'compound requirement', vi: 'yêu cầu ghép — nhiều yêu cầu trong một câu' }],
  khaiNiem: ['writing requirements'],
  boYeu: [{ ten: 'giữ bị động + phủ định', tep: { 'rewrites.js': "const REWRITES = { R1: 'The invoice shall be generated monthly for contracts.', R2: 'The system shall not fail to notify landlords after 5 days.', R3: ['The system shall let tenants report problems, upload photos and chat.'] };\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Writing 4 — level of detail and redundancy',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Write requirements at a consistent level of detail (siblings under one feature should be similarly granular), avoid redundancy (state each requirement once and refer to it), and write complete sentences with correct grammar. Lists and tables can replace long, repetitive sentences.</p>', vi: '<p>Mức chi tiết nhất quán, tránh trùng lặp, câu đầy đủ; dùng danh sách/bảng thay câu dài lặp lại.</p>' },
  cau: [
    { en: 'The same rule "fee = service fee + 10% VAT" appears in five requirements. Better?', vi: 'Cùng luật "phí = phí dịch vụ + 10% VAT" xuất hiện ở năm yêu cầu. Tốt hơn là?', lc: [['a', 'State it once (e.g. as BR-04) and refer to it from the five requirements'], ['b', 'Keep all five copies'], ['c', 'Delete the rule'], ['d', 'Put it only in the code']], dap: 'a', giai: ['One statement, many references.', 'Một phát biểu, nhiều tham chiếu.'] },
    { en: 'Twelve requirements say "The system shall let a manager export report X to CSV" for twelve reports. Better?', vi: 'Mười hai yêu cầu "cho quản lý xuất báo cáo X ra CSV" cho mười hai báo cáo. Tốt hơn là?', lc: [['a', 'One requirement with a table of the twelve reports'], ['b', 'Keep twelve sentences'], ['c', 'Remove the export'], ['d', 'Write it as a user story only']], dap: 'a', giai: ['Tables reduce repetition.', 'Bảng giảm lặp.'] },
  ],
  goiY: ['Viết một lần, tham chiếu nhiều lần.', 'Bảng thay câu lặp.'],
  loiHayGap: ['Chép luật vào nhiều yêu cầu.', 'Mỗi biến thể một câu dài.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['writing guidelines'],
});

export default moDun({
  slug: 'swr302-5-5-ch11-writing',
  ten: '5.5 Guidelines for writing requirements',
  moTaModule: 'Góc nhìn hệ thống/người dùng, thể chủ động, mỗi câu một yêu cầu, tránh chi tiết thiết kế, từ mơ hồ và phủ định kép, mức chi tiết nhất quán; tự viết lại ba yêu cầu tồi có chấm.',
  de: [E1, E2, E3, E4],
});
