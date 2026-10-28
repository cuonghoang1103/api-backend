/**
 * SWR302 · 3.4 — How do you know when you are done? Finding missing requirements (Wiegers Ch.7 slides 33–38).
 */
import { tn, kiemKhoa, bangHtml } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Done and missing 1 — signals of completeness',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: you are approaching completion when users cannot think of more use cases, new scenarios are variations of existing ones, new ideas are out of scope or low priority, and users propose things for "some day". You are never sure — but these are evidence, unlike budgets and deadlines.</p>', vi: '<p>Wiegers: bạn đang gần xong khi người dùng không nghĩ ra thêm use case, kịch bản mới chỉ là biến thể, ý tưởng mới ngoài phạm vi hoặc ưu tiên thấp, và người dùng đề xuất thứ "để sau". Không bao giờ chắc chắn — nhưng đây là bằng chứng, khác với ngân sách và hạn chót.</p>' },
  cau: [
    { en: 'Which is evidence that elicitation is nearly complete?', vi: 'Điều nào là bằng chứng khai thác sắp xong?', lc: [['a', 'The elicitation budget is spent'], ['b', 'New scenarios are variations of use cases already captured'], ['c', 'The sponsor wants to start coding'], ['d', 'The SRS template is full']], dap: 'b', giai: ['Repetition in what you hear is a sign of saturation.', 'Nghe lặp lại là dấu hiệu bão hoà.'] },
    { en: 'Users start proposing features "that would be nice in a future version". This suggests…', vi: 'Người dùng bắt đầu đề xuất tính năng "có thì hay cho bản sau". Điều đó gợi ý…', lc: [['a', 'scope creep is out of control'], ['b', 'the important requirements for this release are probably captured'], ['c', 'the users are confused'], ['d', 'nothing']], dap: 'b', giai: ['Low-priority ideas mean the core is covered.', 'Ý tưởng ưu tiên thấp nghĩa là phần lõi đã phủ.'] },
    { en: 'Can you ever be completely sure you found all requirements?', vi: 'Có bao giờ chắc chắn tìm đủ mọi yêu cầu không?', lc: [['a', 'Yes, with enough interviews'], ['b', 'No — but you can reduce the risk with modelling, checklists and reviews'], ['c', 'Yes, when the customer signs'], ['d', 'Only on small projects']], dap: 'b', giai: ['Completeness is managed, not proven.', 'Độ đầy đủ được quản lý, không chứng minh được.'] },
  ],
  goiY: ['Bằng chứng đến từ NỘI DUNG khai thác, không từ áp lực dự án.', 'Không bao giờ chắc 100%; dùng mô hình và review để giảm rủi ro.'],
  loiHayGap: ['Dừng khai thác khi hết ngân sách và gọi là "đủ".', 'Cho rằng chữ ký khách hàng chứng minh yêu cầu đầy đủ.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: [{ en: 'saturation', vi: 'bão hoà — thông tin mới chỉ lặp lại cái đã có' }],
  khaiNiem: ['knowing when you are done'],
});

const E2 = phanLoai({
  tieuDe: 'Done and missing 2 — techniques to find missing requirements',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Missing requirements are the hardest defects to spot: you cannot review what is not written. Match each discovery with the technique that found it.</p>', vi: '<p>Yêu cầu thiếu là lỗi khó thấy nhất: không review được cái chưa viết. Ghép mỗi phát hiện với kỹ thuật đã tìm ra nó.</p>' },
  cotCau: 'Discovery', cot: 'Technique',
  luaChon: ['CRUD matrix', 'Decompose high-level requirements', 'Check every user class', 'Ask about exceptions ("what if…")', 'Look for symmetry (add ↔ remove, open ↔ close)', 'Event list (including temporal events)'],
  hang: [
    ['The system can create a reservation but nothing ever deletes old ones.', 'CRUD matrix'],
    ['"Manage loans" turned out to include renew, return, report lost and pay fine.', 'Decompose high-level requirements'],
    ['Nobody had written requirements for alumni, who may read but not borrow.', 'Check every user class'],
    ['What happens when the barcode on a returned book cannot be read?', 'Ask about exceptions ("what if…")'],
    ['There is "suspend a reader" but no "reinstate a reader".', 'Look for symmetry (add ↔ remove, open ↔ close)'],
    ['At midnight, unpaid reservations must expire — no requirement said so.', 'Event list (including temporal events)'],
  ],
  giaiThich: '<p>CRUD finds missing operations on data; decomposition finds hidden sub-functions; user classes find forgotten people; exceptions find unhappy paths; symmetry finds missing inverse actions; the event list finds what nobody triggers by hand.</p>',
  goiY: ['Thiếu thao tác trên dữ liệu ⇒ CRUD; thiếu hành động ngược ⇒ đối xứng.', 'Việc tự xảy ra theo giờ ⇒ sự kiện thời gian.'],
  loiHayGap: ['Nhầm CRUD với đối xứng (CRUD theo thực thể, đối xứng theo cặp hành động).', 'Bỏ qua sự kiện thời gian.'],
  thuatNgu: tn('crud'),
  khaiNiem: ['finding missing requirements'],
});

const MT = [
  ['Register reader', { Reader: 'C' }],
  ['Search catalogue', { Book: 'R', Copy: 'R' }],
  ['Borrow copy', { Reader: 'R', Copy: 'RU', Loan: 'C' }],
  ['Return copy', { Copy: 'U', Loan: 'U' }],
  ['Add book', { Book: 'C', Copy: 'C' }],
  ['Pay fine', { Fine: 'U', Loan: 'R' }],
];
const TT = ['Reader', 'Book', 'Copy', 'Loan', 'Fine'];
const E3 = baiJs({
  tieuDe: 'Done and missing 3 — read a CRUD matrix',
  doKho: 'HARD', phut: 12,
  moTa: { en: `<p>The library team wrote this CRUD matrix (C create, R read, U update, D delete):</p>${bangHtml(['Use case', ...TT], MT.map(([u, o]) => [u, ...TT.map((t) => o[t] || '')]))}<p>Answer in <code>GAPS</code>: <code>neverCreated</code> — entities no use case creates; <code>neverRead</code> — entities never read; <code>neverDeleted</code> — entities nobody can delete; <code>readerUpdated</code> — can a reader’s data ever be updated? (true/false).</p>`, vi: '<p>Đội thư viện viết ma trận CRUD như trên. Trả lời trong <code>GAPS</code>: thực thể không use case nào tạo; thực thể không ai đọc; thực thể không ai xoá được; dữ liệu độc giả có bao giờ được sửa không (true/false).</p>' },
  yeuCau: [{ en: 'Arrays of entity names exactly as in the matrix.', vi: 'Mảng tên thực thể đúng như ma trận.' }],
  viDu: [{ input: 'Fine has only U', output: 'Fine is never created and never read', explanation: 'Something must create the fine (Return copy, when late).|||Phải có use case tạo khoản phạt (Return copy khi trễ).' }],
  tep: { 'answer.js': ["const GAPS = { neverCreated: [], neverRead: [], neverDeleted: [], readerUpdated: null };\n", "// Fine: only U ⇒ never created, never read. Nothing has D. No use case has U on Reader.\nconst GAPS = { neverCreated: ['Fine'], neverRead: ['Fine'], neverDeleted: ['Reader', 'Book', 'Copy', 'Loan', 'Fine'], readerUpdated: false };\n"] },
  kiem: kiemKhoa([
    { moTa: { en: 'entities never created', vi: 'thực thể không bao giờ được tạo' }, bieuThuc: '(GAPS.neverCreated || []).map(String)', chap: [['Fine']], kieu: 'tap' },
    { moTa: { en: 'entities never read', vi: 'thực thể không ai đọc' }, bieuThuc: '(GAPS.neverRead || []).map(String)', chap: [['Fine']], kieu: 'tap' },
    { moTa: { en: 'entities nobody can delete', vi: 'thực thể không ai xoá được' }, bieuThuc: '(GAPS.neverDeleted || []).map(String)', chap: [TT], kieu: 'tap' },
    { moTa: { en: 'reader data can be updated?', vi: 'dữ liệu độc giả có được sửa không?' }, bieuThuc: 'String(GAPS.readerUpdated)', chap: ['false'] },
  ]),
  goiY: ['Đọc theo CỘT: một cột không có C ⇒ không ai tạo; không có R ⇒ không ai đọc.', 'Không cột nào có D.'],
  loiHayGap: ['Đọc theo hàng thay vì theo cột.', 'Coi "Return copy" là nơi tạo Fine dù ma trận không ghi C.'],
  giaiThich: '<p>Each gap is a missing requirement: who creates fines (Return copy when late)? who reads them (a reader sees what they owe)? how are records archived or deleted? how does a reader update an e-mail address?</p>',
  thuatNgu: tn('crud'),
  khaiNiem: ['CRUD analysis'],
});

const E4 = tracNghiem({
  tieuDe: 'Done and missing 4 — spot the missing requirement',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Each short requirement set below has an obvious hole: an exception with no response, a missing inverse action, or a forgotten user class. Read the set, ask "what if…?" and "who creates this?", then choose the missing requirement.</p>', vi: '<p>Mỗi bộ yêu cầu ngắn dưới đây có một lỗ hổng rõ ràng: ngoại lệ chưa có phản hồi, thiếu hành động ngược, hoặc quên một lớp người dùng. Đọc bộ yêu cầu, hỏi "nếu … thì sao?" và "ai tạo ra cái này?", rồi chọn yêu cầu còn thiếu.</p>' },
  cau: [
    { en: 'ATM: withdraw cash; check balance; print receipt; PIN entered three times wrong ⇒ ?', vi: 'ATM: rút tiền; xem số dư; in hoá đơn; nhập sai PIN ba lần ⇒ ?', lc: [['a', 'Nothing is missing'], ['b', 'What the ATM does with the card after three wrong PINs (retain it, notify the bank)'], ['c', 'The colour of the screen'], ['d', 'The brand of the printer']], dap: 'b', giai: ['An exception with no defined response.', 'Một ngoại lệ chưa có phản hồi.'] },
    { en: 'Library: borrow; return; reserve a book that is on loan. What is missing?', vi: 'Thư viện: mượn; trả; đặt trước sách đang được mượn. Thiếu gì?', lc: [['a', 'Cancel a reservation'], ['b', 'Print the catalogue'], ['c', 'Change the logo'], ['d', 'Nothing']], dap: 'a', giai: ['Symmetry: every reservation needs a way to cancel it.', 'Đối xứng: đặt trước thì phải huỷ được.'] },
    { en: 'Gym: members book classes; trainers record attendance. Which user class is forgotten?', vi: 'Gym: hội viên đặt lớp; huấn luyện viên điểm danh. Lớp người dùng nào bị quên?', lc: [['a', 'The manager who sets the class schedule and capacity'], ['b', 'The members'], ['c', 'The trainers'], ['d', 'None']], dap: 'a', giai: ['Someone must create the classes being booked.', 'Phải có người tạo các lớp để mà đặt.'] },
  ],
  goiY: ['Hỏi "nếu … thì sao?" và "cái ngược lại là gì?".', 'Cái được dùng phải do ai đó tạo ra.'],
  loiHayGap: ['Chỉ đọc đường thuận.', 'Quên vai trò quản trị tạo dữ liệu nền.'],
  giaiThich: '<p>Answers: b · a · a.</p>',
  thuatNgu: [{ en: 'exception', vi: 'ngoại lệ' }, { en: 'symmetry', vi: 'đối xứng — thao tác nào cũng cần thao tác ngược' }],
  khaiNiem: ['finding missing requirements'],
});

export default moDun({
  slug: 'swr302-3-6-ch7-done-missing',
  ten: '3.6 Knowing when you are done and finding missing requirements',
  moTaModule: 'Dấu hiệu khai thác sắp đủ (khác với hết ngân sách), sáu kỹ thuật tìm yêu cầu thiếu (CRUD, phân rã, lớp người dùng, ngoại lệ, đối xứng, sự kiện thời gian), đọc ma trận CRUD, bắt lỗ hổng trong bộ yêu cầu.',
  de: [E1, E4, E2, E3],
});
