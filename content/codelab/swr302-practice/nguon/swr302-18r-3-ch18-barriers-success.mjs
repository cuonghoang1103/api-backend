/**
 * SWR302 · 18R.3 — Reuse barriers and success factors (Wiegers Ch.18 slides 15–21).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Reuse barriers 1 — barrier or success factor?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Barriers: missing or poor requirements · NIH ("not invented here") and NAH ("not applicable here") · writing style · inconsistent organisation · project type · ownership. Success factors: repository · quality · interactions (trace links) · terminology · organisational culture. Classify.</p>', vi: '<p>Rào cản và yếu tố thành công của tái sử dụng.</p>' },
  cot: 'Kind', luaChon: ['Barrier', 'Success factor'],
  hang: [
    ['A searchable repository of past requirements with keywords', 'Success factor'],
    ['"We don’t use other departments’ requirements, ours are special."', 'Barrier'],
    ['Previous projects never wrote their requirements down', 'Barrier'],
    ['Management rewards teams that contribute reusable requirements', 'Success factor'],
    ['Every BA used a different notation and level of detail', 'Barrier'],
    ['A shared glossary so requirements use consistent terms', 'Success factor'],
  ],
  giaiThich: '<p>You cannot reuse what you cannot find, do not trust, or do not understand.</p>',
  goiY: ['NIH/NAH, tài liệu thiếu, văn phong lộn xộn ⇒ rào cản.', 'Kho tìm được, chất lượng, thuật ngữ, văn hoá ⇒ thành công.'],
  loiHayGap: ['Coi "yêu cầu của mình đặc biệt" là lý do chính đáng.', 'Bỏ qua thuật ngữ thống nhất.'],
  thuatNgu: [{ en: 'NIH (not invented here)', vi: 'tâm lý "không phải do mình làm ra"' }],
  khaiNiem: ['reuse barriers and success factors'],
});

const E2 = phanLoai({
  tieuDe: 'Reuse barriers 2 — name the barrier',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Name the barrier each situation shows.</p>', vi: '<p>Gọi tên rào cản trong từng tình huống.</p>' },
  cot: 'Barrier', luaChon: ['Missing or poor requirements', 'NIH and NAH', 'Writing style', 'Inconsistent organization', 'Project type', 'Ownership'],
  hang: [
    ['The old requirements exist but are obsolete — nobody updated them as the app evolved.', 'Missing or poor requirements'],
    ['"That library is from the banking division; it can’t apply to insurance."', 'NIH and NAH'],
    ['Requirements are buried in long narrative paragraphs mixed with design notes.', 'Writing style'],
    ['Each project stores requirements in a different structure, so nobody can search across them.', 'Inconsistent organization'],
    ['The app is tied to a specific device platform, so its requirements fit nowhere else.', 'Project type'],
    ['The product was built for one client, who owns its requirements.', 'Ownership'],
  ],
  giaiThich: '<p>Some barriers are cultural (NIH/NAH), some technical (style, organisation), some legal (ownership).</p>',
  goiY: ['"Không áp dụng được ở đây" ⇒ NAH.', 'Khách hàng sở hữu yêu cầu ⇒ ownership.'],
  loiHayGap: ['Nhầm writing style với inconsistent organization.', 'Bỏ qua vấn đề sở hữu.'],
  thuatNgu: [{ en: 'NAH (not applicable here)', vi: 'tâm lý "không áp dụng được ở đây"' }],
  khaiNiem: ['reuse barriers'],
});

const E3 = tracNghiem({
  tieuDe: 'Reuse barriers 3 — making reuse work',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Success factors: a searchable repository; quality (no one reuses junk — improve a requirement when you reuse it); interactions (trace links show what you take along); consistent terminology; and an organisational culture that rewards both contributing and reusing.</p>', vi: '<p>Làm cho tái sử dụng thành công.</p>' },
  cau: [
    { en: 'You reuse a requirement and notice it is ambiguous. What should you do?', vi: 'Bạn tái dùng một yêu cầu và thấy nó mơ hồ. Nên làm gì?', lc: [['a', 'Improve it in the shared repository so the next reuser gets a better version'], ['b', 'Use it as it is'], ['c', 'Copy it and fix only your copy'], ['d', 'Delete it from the repository']], dap: 'a', giai: ['Raise its reuse potential.', 'Nâng giá trị tái dùng.'] },
    { en: 'Why check trace links before reusing a requirement?', vi: 'Vì sao xem liên kết truy vết trước khi tái dùng?', lc: [['a', 'To see which other requirements, rules and tests it depends on'], ['b', 'To count words'], ['c', 'It is not needed'], ['d', 'To find the author’s phone number']], dap: 'a', giai: ['Know what you take along.', 'Biết mình mang theo những gì.'] },
    { en: 'In a reuse culture, a BA starting a new feature first…', vi: 'Trong văn hoá tái sử dụng, BA bắt đầu tính năng mới sẽ trước tiên…', lc: [['a', 'searches the repository for existing requirements'], ['b', 'writes everything from scratch'], ['c', 'asks developers to code'], ['d', 'skips elicitation']], dap: 'a', giai: ['Look before you write.', 'Tìm trước khi viết.'] },
  ],
  goiY: ['Sửa bản gốc, không chỉ bản của mình.', 'Liên kết cho biết phụ thuộc.'],
  loiHayGap: ['Sửa riêng bản sao.', 'Viết lại từ đầu dù đã có sẵn.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('rtm'),
  khaiNiem: ['reuse success factors'],
});

const E4 = tracNghiem({
  tieuDe: 'Reuse barriers 4 — terminology',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>You may overlook a reusable requirement simply because its terms differ from your stakeholders’ ("client" vs "customer" vs "account holder"). Consistent terminology and glossaries make reuse findable.</p>', vi: '<p>Thuật ngữ khác nhau làm bỏ sót yêu cầu tái dùng được.</p>' },
  cau: [
    { en: 'Searching the repository for "patient" finds nothing, but "client record" requirements exist. The fix is…', vi: 'Tìm "patient" không ra, nhưng có yêu cầu về "client record". Cách sửa là…', lc: [['a', 'a shared glossary with synonyms, and keywords on repository items'], ['b', 'stop searching'], ['c', 'rename all patients'], ['d', 'nothing']], dap: 'a', giai: ['Glossary + keywords.', 'Glossary + từ khoá.'] },
  ],
  goiY: ['Glossary có từ đồng nghĩa.', 'Gắn từ khoá cho mục trong kho.'],
  loiHayGap: ['Bỏ cuộc khi tìm không ra.', 'Đổi tên lung tung.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'glossary', vi: 'bảng thuật ngữ' }],
  khaiNiem: ['terminology'],
});

export default moDun({
  slug: 'swr302-18r-3-ch18-barriers-success',
  ten: '7.11 Reuse barriers and success factors',
  moTaModule: 'Rào cản (thiếu yêu cầu, NIH/NAH, văn phong, tổ chức không nhất quán, loại dự án, quyền sở hữu) và yếu tố thành công (kho, chất lượng, liên kết, thuật ngữ, văn hoá) của tái sử dụng yêu cầu.',
  de: [E1, E2, E3, E4],
});
