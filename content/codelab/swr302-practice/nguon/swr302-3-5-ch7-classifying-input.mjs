/**
 * SWR302 · 3.3 — Classifying customer input (Wiegers Ch.7 slides 27–32).
 */
import { tn, kiemKhoa } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const LOAI = ['Business requirement', 'User requirement', 'Business rule', 'Functional requirement', 'Quality attribute', 'External interface', 'Constraint', 'Data requirement', 'Solution idea'];

const E1 = tracNghiem({
  tieuDe: 'Classifying input 1 — clue words',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers suggests listening for clue words to classify what stakeholders say into nine buckets: business requirements, user requirements, business rules, functional requirements, quality attributes, external interfaces, constraints, data requirements and solution ideas.</p>', vi: '<p>Wiegers gợi ý nghe các từ khoá để xếp lời bên liên quan vào chín nhóm: yêu cầu nghiệp vụ, yêu cầu người dùng, business rule, yêu cầu chức năng, thuộc tính chất lượng, giao diện ngoài, ràng buộc, yêu cầu dữ liệu và ý tưởng giải pháp.</p>' },
  cau: [
    { en: '"…increase market share by 10%…", "…save $200,000 a year…" usually signal a…', vi: '"…tăng thị phần 10%…", "…tiết kiệm 200.000 đô mỗi năm…" thường báo hiệu…', lc: [['a', 'business requirement'], ['b', 'quality attribute'], ['c', 'constraint'], ['d', 'data requirement']], dap: 'a', giai: ['Financial or market benefits = business requirements.', 'Lợi ích tài chính, thị trường = yêu cầu nghiệp vụ.'] },
    { en: '"I need to…", "I want to be able to…" from a user usually signal a…', vi: '"Tôi cần…", "Tôi muốn có thể…" từ người dùng thường báo hiệu…', lc: [['a', 'user requirement'], ['b', 'business rule'], ['c', 'external interface'], ['d', 'solution idea']], dap: 'a', giai: ['A task or goal of the user.', 'Một việc hay mục tiêu của người dùng.'] },
    { en: '"…must comply with…", "…according to the policy…" usually signal a…', vi: '"…phải tuân theo…", "…theo chính sách…" thường báo hiệu…', lc: [['a', 'business rule'], ['b', 'functional requirement'], ['c', 'user requirement'], ['d', 'quality attribute']], dap: 'a', giai: ['Policies and regulations exist outside the software.', 'Chính sách và quy định tồn tại ngoài phần mềm.'] },
    { en: '"…fast, easy, secure, reliable…" usually signal a…', vi: '"…nhanh, dễ, an toàn, ổn định…" thường báo hiệu…', lc: [['a', 'quality attribute (to be made measurable)'], ['b', 'business requirement'], ['c', 'constraint'], ['d', 'data requirement']], dap: 'a', giai: ['Adjectives about how well ⇒ quality attributes; the BA must quantify them.', 'Tính từ về mức độ tốt ⇒ thuộc tính chất lượng; BA phải lượng hoá.'] },
    { en: '"Use a drop-down list…", "Store it in a spreadsheet…" usually signal a…', vi: '"Dùng danh sách thả xuống…", "Lưu vào bảng tính…" thường báo hiệu…', lc: [['a', 'solution idea'], ['b', 'functional requirement'], ['c', 'business rule'], ['d', 'external interface']], dap: 'a', giai: ['A how, not a what — look for the need behind it.', 'Một cách làm, không phải điều cần — tìm nhu cầu đằng sau.'] },
  ],
  goiY: ['Tiền, thị phần ⇒ business; "tôi cần" ⇒ user; "theo chính sách" ⇒ business rule.', 'Tính từ chất lượng ⇒ quality attribute; cách làm cụ thể ⇒ solution idea.'],
  loiHayGap: ['Chép ý tưởng giải pháp thành yêu cầu.', 'Ghi "nhanh" vào SRS mà không lượng hoá.'],
  giaiThich: '<p>Answers: a · a · a · a · a.</p>',
  thuatNgu: tn('businessReq', 'userReq', 'businessRule', 'qualityAttr'),
  khaiNiem: ['classifying customer input'],
});

const E2 = phanLoai({
  tieuDe: 'Classifying input 2 — notes from a library interview',
  doKho: 'MEDIUM', phut: 9,
  moTa: { en: '<p>Notes from interviews about a new university library system. Classify each into one of the nine buckets.</p>', vi: '<p>Ghi chép phỏng vấn về hệ thống thư viện mới. Xếp mỗi câu vào một trong chín nhóm.</p>' },
  cot: 'Bucket', luaChon: LOAI,
  hang: [
    ['Director: "We want to cut the cost of manual check-out by 40% in two years."', 'Business requirement'],
    ['Student: "I need to renew my loans from my phone."', 'User requirement'],
    ['Librarian: "Reference books may never be borrowed — that is the library charter."', 'Business rule'],
    ['Librarian: "When a reserved book is returned, the system tells the next reader in the queue."', 'Functional requirement'],
    ['IT: "Search must answer in under 2 seconds with 500 users online."', 'Quality attribute'],
    ['IT: "It has to read student status from the student information system through its API."', 'External interface'],
    ['IT: "It must use the university’s Oracle licence."', 'Constraint'],
    ['Cataloguer: "A book record has ISBN, title, authors, edition and up to 5 subject codes."', 'Data requirement'],
    ['Student: "Add a big red Renew all button on the home page."', 'Solution idea'],
  ],
  giaiThich: '<p>One example per bucket. The hardest pair is functional requirement (what the system does) vs user requirement (what the user wants to do).</p>',
  goiY: ['"The system tells…" ⇒ hành vi hệ thống ⇒ functional; "I need to…" ⇒ user.', 'Cấu trúc bản ghi ⇒ data requirement.'],
  loiHayGap: ['Xếp "dùng bản quyền Oracle" là external interface — đó là constraint.', 'Xếp danh sách trường dữ liệu là functional.'],
  thuatNgu: tn('businessReq', 'userReq', 'functionalReq', 'qualityAttr', 'externalInterface', 'constraint', 'businessRule'),
  khaiNiem: ['classifying customer input'],
});

const E3 = phanLoai({
  tieuDe: 'Classifying input 3 — tricky sentences',
  doKho: 'HARD', phut: 10,
  moTa: { en: '<p>Some sentences look like one bucket but belong to another. Classify carefully.</p>', vi: '<p>Có câu trông như nhóm này nhưng thuộc nhóm khác. Phân loại cẩn thận.</p>' },
  cot: 'Bucket', luaChon: LOAI,
  hang: [
    ['"Students should be able to pay fines with the e-wallet." (student)', 'User requirement'],
    ['"The fine is 2,000 VND per day, capped at the price of the book." (charter)', 'Business rule'],
    ['"Store the fines in a separate table so finance can query them." (finance officer)', 'Solution idea'],
    ['"Loans must be retained for 5 years for audit and then deleted." (auditor)', ['Business rule', 'Data requirement']],
    ['"If the e-wallet does not answer within 10 seconds, the payment is cancelled and the reader is told to try later." (IT)', 'Functional requirement'],
    ['"Only librarians may waive a fine." (director)', 'Business rule'],
    ['"The kiosks are the old Windows 8 touch screens we already own." (IT)', 'Constraint'],
    ['"Library users are students, lecturers and alumni; alumni may only read in the library." (director)', 'Business rule'],
  ],
  giaiThich: '<p>A fine formula and who may waive a fine are policies (business rules); "should be able to pay" is a user goal; a table design is a solution idea; the timeout behaviour is functional; reusing old kiosks is a constraint. Retention periods required by audit are business rules that later produce data requirements.</p>',
  goiY: ['Câu nói về luật/chính sách tồn tại dù không có phần mềm ⇒ business rule, kể cả khi nghe như yêu cầu chức năng.', 'Đề xuất bảng/cột/màn hình ⇒ solution idea.'],
  loiHayGap: ['Xếp công thức tính phạt là functional.', 'Xếp "lưu ở bảng riêng" là data requirement.'],
  thuatNgu: tn('businessRule', 'constraint'),
  khaiNiem: ['classifying customer input'],
});

const E4 = baiJs({
  tieuDe: 'Classifying input 4 — split one paragraph into requirements',
  doKho: 'HARD', phut: 12,
  moTa: { en: `<p>The head of the student dormitory said in one breath:</p><blockquote>"<b>[1]</b> We want fewer complaints about repairs — half as many by next year. <b>[2]</b> Students need to report a broken item from their phone at any time. <b>[3]</b> By regulation, electrical faults must be fixed within 24 hours. <b>[4]</b> When a report is created, the system sends it to the technician on duty for that building. <b>[5]</b> The technicians use cheap Android phones, Android 10. <b>[6]</b> A report has the room number, the item, a photo and a description of at most 500 characters. <b>[7]</b> Put the reports on a big map of the buildings. <b>[8]</b> It has to work even with the weak Wi-Fi in building C."</blockquote><p>Classify each numbered part in <code>BUCKETS</code>.</p>`, vi: '<p>Trưởng KTX nói một mạch (bản tiếng Anh, tám phần [1]–[8]). Phân loại từng phần trong <code>BUCKETS</code>.</p>' },
  yeuCau: [{ en: `Values: ${LOAI.join(' | ')}`, vi: `Giá trị: ${LOAI.join(' | ')}` }],
  viDu: [{ input: '[1] We want fewer complaints about repairs — half as many by next year.', output: 'Business requirement', explanation: 'A business objective with a target and a deadline.|||Mục tiêu nghiệp vụ có chỉ tiêu và thời hạn.' }],
  tep: { 'answer.js': [
    "const BUCKETS = { 1: 'Business requirement', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' };\n",
    "// [8] is a quality attribute (robustness under a poor network) to be quantified later.\nconst BUCKETS = { 1: 'Business requirement', 2: 'User requirement', 3: 'Business rule', 4: 'Functional requirement', 5: 'Constraint', 6: 'Data requirement', 7: 'Solution idea', 8: 'Quality attribute' };\n",
  ] },
  kiem: kiemKhoa([2, 3, 4, 5, 6, 7, 8].map((k) => ({ moTa: { en: `part [${k}]`, vi: `phần [${k}]` }, bieuThuc: `BUCKETS[${k}]`, chap: [{ 2: 'User requirement', 3: 'Business rule', 4: 'Functional requirement', 5: 'Constraint', 6: 'Data requirement', 7: 'Solution idea', 8: 'Quality attribute' }[k]] }))),
  goiY: ['Mỗi phần thuộc một nhóm khác nhau (trừ phần 1 đã cho sẵn).', 'Phần [8] là "hoạt động được dù mạng yếu" — một thuộc tính chất lượng.'],
  loiHayGap: ['Xếp [7] (bản đồ) là functional — đó là ý tưởng giải pháp, cần hỏi nhu cầu thật (thấy nhanh chỗ nào đang hỏng).', 'Xếp [5] là external interface — điện thoại của kỹ thuật viên giới hạn nền tảng ⇒ constraint.'],
  giaiThich: '<p>[1] business · [2] user · [3] business rule · [4] functional · [5] constraint · [6] data · [7] solution idea · [8] quality attribute. One paragraph, eight different kinds of requirement information — that is why notes must be classified before they go into the documents.</p>',
  thuatNgu: tn('businessReq', 'userReq', 'businessRule', 'functionalReq', 'constraint', 'qualityAttr'),
  khaiNiem: ['classifying customer input'],
});

export default moDun({
  slug: 'swr302-3-5-ch7-classifying-input',
  ten: '3.5 Classifying customer input',
  moTaModule: 'Chín nhóm đầu vào khách hàng của Wiegers Ch.7 và từ khoá nhận biết, phân loại ghi chép phỏng vấn thư viện, các câu dễ nhầm, tách một đoạn nói liền thành tám loại thông tin yêu cầu.',
  de: [E1, E2, E3, E4],
});
