/**
 * SWR302 · 5.2 — Labeling requirements, TBDs and user interfaces in the SRS (Wiegers Ch.10 slides 1–16).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Labeling 1 — which labeling scheme?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Every requirement needs a unique, persistent label so it can be traced and discussed. Wiegers compares <b>sequence numbers</b> (UR-9, FR-26), <b>hierarchical numbering</b> (3.2.4.3) and <b>hierarchical textual tags</b> (Print.ConfirmCopies). Name the scheme of each label.</p>', vi: '<p>Mỗi yêu cầu cần nhãn duy nhất, bền vững để truy vết và trao đổi. Wiegers so sánh <b>số thứ tự</b> (UR-9, FR-26), <b>đánh số phân cấp</b> (3.2.4.3) và <b>thẻ chữ phân cấp</b> (Print.ConfirmCopies). Gọi tên cách đánh nhãn của từng nhãn.</p>' },
  cot: 'Scheme', luaChon: ['Sequence number', 'Hierarchical numbering', 'Hierarchical textual tag'],
  hang: [['FR-26', 'Sequence number'], ['3.2.4.3', 'Hierarchical numbering'], ['Loan.Renew.LimitReached', 'Hierarchical textual tag'], ['UR-9', 'Sequence number'], ['4.1.2', 'Hierarchical numbering'], ['Search.Results.Sort', 'Hierarchical textual tag']],
  giaiThich: '<p>Sequence numbers are simple but say nothing about grouping; hierarchical numbers change when sections move; textual tags survive edits and carry meaning.</p>',
  goiY: ['Chỉ có tiền tố + số tăng dần ⇒ sequence number.', 'Các từ nối bằng dấu chấm ⇒ textual tag.'],
  loiHayGap: ['Nhầm "4.1.2" với số thứ tự.', 'Cho rằng nhãn có thể đổi khi chèn yêu cầu mới.'],
  thuatNgu: [{ en: 'requirement label', vi: 'nhãn yêu cầu — định danh duy nhất, bền vững' }],
  khaiNiem: ['labeling requirements'],
});

const E2 = tracNghiem({
  tieuDe: 'Labeling 2 — strengths and weaknesses of each scheme',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Labels must stay stable when the document changes, otherwise traces and test cases point to the wrong requirement. Answer the questions about the three schemes.</p>', vi: '<p>Nhãn phải ổn định khi tài liệu thay đổi, nếu không các liên kết truy vết và test case sẽ trỏ sai yêu cầu. Trả lời các câu về ba cách đánh nhãn.</p>' },
  cau: [
    { en: 'A new section is inserted before 3.2. What happens to hierarchical numbers like 3.2.4.3?', vi: 'Chèn một mục mới trước 3.2. Số phân cấp như 3.2.4.3 bị gì?', lc: [['a', 'Nothing'], ['b', 'They may shift, breaking every reference to them'], ['c', 'They become textual tags'], ['d', 'They are deleted']], dap: 'b', giai: ['The weakness of hierarchical numbering.', 'Điểm yếu của đánh số phân cấp.'] },
    { en: 'A requirement FR-26 is deleted. What should happen to the number 26?', vi: 'Xoá FR-26. Số 26 xử lý thế nào?', lc: [['a', 'Give it to the next new requirement'], ['b', 'Retire it — never reuse a label'], ['c', 'Renumber all requirements'], ['d', 'Nothing matters']], dap: 'b', giai: ['Reusing labels confuses history and traces.', 'Dùng lại nhãn làm rối lịch sử và truy vết.'] },
    { en: 'Which scheme carries meaning and survives reorganisation best?', vi: 'Cách nào mang ý nghĩa và chịu được sắp xếp lại tốt nhất?', lc: [['a', 'Sequence numbers'], ['b', 'Hierarchical numbering'], ['c', 'Hierarchical textual tags'], ['d', 'Page numbers']], dap: 'c', giai: ['Tags like Print.ConfirmCopies do not change when sections move.', 'Thẻ như Print.ConfirmCopies không đổi khi mục di chuyển.'] },
  ],
  goiY: ['Nhãn tốt: duy nhất, không đổi, không tái sử dụng.', 'Số phân cấp phụ thuộc cấu trúc tài liệu.'],
  loiHayGap: ['Đánh số lại toàn bộ khi xoá một yêu cầu.', 'Tái sử dụng số của yêu cầu đã xoá.'],
  giaiThich: '<p>Answers: b · b · c.</p>',
  thuatNgu: [{ en: 'persistent label', vi: 'nhãn bền vững — không đổi suốt đời yêu cầu' }],
  khaiNiem: ['labeling requirements'],
});

const E3 = tracNghiem({
  tieuDe: 'Labeling 3 — TBDs and user interfaces in the SRS',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers: mark every gap with <b>TBD</b> (to be determined), record who will resolve it and by when, and resolve all TBDs before the requirements are baselined for implementation. UI details in the SRS: describe what the user must be able to do and the essential data, and keep detailed screen designs in separate UI specifications or prototypes.</p>', vi: '<p>Wiegers: đánh dấu mọi chỗ thiếu bằng <b>TBD</b>, ghi ai giải quyết và hạn, giải quyết hết TBD trước khi baseline để hiện thực. Chi tiết giao diện trong SRS: mô tả người dùng phải làm được gì và dữ liệu thiết yếu; thiết kế màn hình chi tiết để ở tài liệu UI riêng hoặc prototype.</p>' },
  cau: [
    { en: 'The fine per day is not decided yet. What do you write?', vi: 'Tiền phạt mỗi ngày chưa quyết. Viết gì?', lc: [['a', 'Leave the requirement out'], ['b', '"The fine per day is TBD" — with the person responsible and a due date in the issue list'], ['c', 'Guess a value'], ['d', 'Write "a reasonable fine"']], dap: 'b', giai: ['Make the gap visible and owned.', 'Làm chỗ thiếu hiện rõ và có người chịu trách nhiệm.'] },
    { en: 'When must all TBDs be resolved?', vi: 'Khi nào phải giải quyết hết TBD?', lc: [['a', 'Never'], ['b', 'Before the affected requirements are baselined and implemented'], ['c', 'After the release'], ['d', 'During testing']], dap: 'b', giai: ['A TBD in a baselined requirement is a defect waiting to happen.', 'TBD trong yêu cầu đã baseline là lỗi chờ xảy ra.'] },
    { en: 'Should the SRS contain the exact pixel layout of every screen?', vi: 'SRS có nên chứa bố cục từng pixel của mọi màn hình?', lc: [['a', 'Yes'], ['b', 'No — state what the user must do and the essential data; keep detailed layouts in UI specs or prototypes'], ['c', 'Only colours'], ['d', 'Only for mobile apps']], dap: 'b', giai: ['Layouts change often; requirements should not.', 'Bố cục đổi thường xuyên; yêu cầu thì không nên.'] },
  ],
  goiY: ['TBD phải có người chịu trách nhiệm và hạn.', 'SRS nói người dùng làm gì; bố cục chi tiết để ở tài liệu UI.'],
  loiHayGap: ['Viết "hợp lý", "phù hợp" thay cho TBD.', 'Nhồi mock-up chi tiết vào SRS.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('tbd', 'srs'),
  khaiNiem: ['TBDs', 'UI in the SRS'],
});

const E4 = phanLoai({
  tieuDe: 'Labeling 4 — is this label scheme robust?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>A good labeling convention gives every requirement a unique, persistent id that survives additions, deletions and moves, so traces and test cases keep pointing at the right requirement. Judge each team practice.</p>', vi: '<p>Quy ước đánh nhãn tốt: duy nhất, bền vững qua thêm/xoá/di chuyển. Đánh giá từng cách làm.</p>' },
  cot: 'Practice', luaChon: ['Robust', 'Fragile'],
  hang: [
    ['Ids are the paragraph numbers that Word generates automatically.', 'Fragile'],
    ['A deleted requirement keeps its id, marked Deleted; the id is never reused.', 'Robust'],
    ['When a requirement moves to another section, its textual tag Booking.Cancel.Deadline stays the same.', 'Robust'],
    ['After deleting FR-7, the team renumbers FR-8…FR-40 to close the gap.', 'Fragile'],
    ['A requirements tool assigns an id at creation that never changes.', 'Robust'],
  ],
  giaiThich: '<p>Anything that renumbers on edit breaks traceability; ids assigned once and never reused are robust.</p>',
  goiY: ['Đánh số tự động theo đoạn ⇒ dễ vỡ.', 'Không tái dùng id ⇒ bền.'],
  loiHayGap: ['Đánh số lại để "cho đẹp".', 'Dùng số trang làm nhãn.'],
  thuatNgu: [{ en: 'persistent label', vi: 'nhãn bền vững' }],
  khaiNiem: ['labeling requirements'],
});

export default moDun({
  slug: 'swr302-5-2-ch10-srs-labeling',
  ten: '5.2 Labeling requirements, TBDs and UI in the SRS',
  moTaModule: 'Ba cách đánh nhãn yêu cầu (số thứ tự, số phân cấp, thẻ chữ phân cấp) và điểm mạnh/yếu, không tái sử dụng nhãn, cách ghi TBD, mức chi tiết giao diện trong SRS.',
  de: [E1, E2, E3, E4],
});
