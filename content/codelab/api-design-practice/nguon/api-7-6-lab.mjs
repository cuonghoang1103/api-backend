/** API Design · Lab 7 — Hàng chờ thiết kế trước: thứ tự làm việc, dự đoán câu trả lời (output thật Lab 7). */
import { doiDau, KHOA, cs, ord, bang1, tn } from './_api.mjs';

const E1 = cs({
  ten: 'Lab 7 · 1 — The design-first order of work', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps of Lab 7 as in the reference solution.',
  vi: 'Sắp các bước của Lab 7 như lời giải tham khảo.',
  cau: [ord('o1', ['From first to last', 'Từ đầu tới cuối'], [
    'Copy the document to openapi-v2.0.0.yaml (the baseline)',
    'Add the three waitlist operations, errors and examples; version 2.1.0',
    'npm run api:lint (0 errors) and npm run api:diff (no breaking change)',
    'Start the Prism mock and regenerate the client types',
    'Write client/waitlist.ts and run it against the mock',
    'Implement the routes and extend check-drift.mjs',
    'Run the same client against the real server; check-drift all ✓',
  ], ['Contract first, gates before anyone builds on it, the client against the mock, then the server — and the contract check decides when you are done.', 'Hợp đồng trước, qua các cổng trước khi ai dựa vào nó, client làm với mock, rồi mới tới server — và bộ kiểm hợp đồng quyết định khi nào xong.'])],
  goiY: [['The gate needs a baseline to compare with.', 'Cổng cần một bản mốc để so.'], ['The client should not change when the server arrives.', 'Client không phải sửa khi server xuất hiện.']],
  loi: [['Writing the server first, then documenting it (that is code-first).', 'Viết server trước rồi mới ghi tài liệu (đó là code-first).'], ['Skipping the baseline copy — the gate has nothing to compare.', 'Bỏ bước chép bản mốc — cổng không có gì để so.']],
  tns: [tn('baseline', 'bản mốc để so sánh'), tn('mock-first', 'làm với mock trước khi có server')],
  kn: ['design-first'],
});

const A = ['201 + Location', '204', '400', '404', '409 SLOT_AVAILABLE', '409 ALREADY_WAITING', '422'];
const E2 = cs({
  ten: 'Lab 7 · 2 — Predict the waitlist answers', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'Bin works with the waitlist of lab_2 on 9 March 08:00–10:00. Predict each answer of the reference solution, in order.',
  vi: 'Bình dùng hàng chờ của lab_2 ngày 9/3, 08:00–10:00. Dự đoán từng câu trả lời của lời giải tham khảo, theo thứ tự.',
  bang: [bang1('b1', ['Request → answer', 'Request → câu trả lời'], [{ ma: 'x', ten: 'Request' }, { ma: 'a', ten: 'Answer', luaChon: A }], [
    { o: { x: 'Bin joins — nobody has booked the slot yet' }, a: { a: '409 SLOT_AVAILABLE' } },
    { o: { x: 'An books the slot; Bin joins again' }, a: { a: '201 + Location' } },
    { o: { x: 'Bin joins the same slot a second time' }, a: { a: '409 ALREADY_WAITING' } },
    { o: { x: 'Bin joins with an extra field seats: 3' }, a: { a: '400' } },
    { o: { x: 'Bin joins with end before start (slot booked)' }, a: { a: '422' } },
    { o: { x: 'An deletes Bin’s entry wl_1' }, a: { a: '404' } },
    { o: { x: 'Bin deletes his own entry wl_1' }, a: { a: '204' } },
  ], ['Real runs (check-drift, 27 ✓): free slot ⇒ 409 SLOT_AVAILABLE; booked ⇒ 201 at position 1; twice ⇒ 409; strict body ⇒ 400; end ≤ start ⇒ 422; someone else’s entry ⇒ 404 (6.2); own ⇒ 204.', 'Lần chạy thật (check-drift, 27 ✓): khung trống ⇒ 409 SLOT_AVAILABLE; đã có người đặt ⇒ 201 ở vị trí 1; lần hai ⇒ 409; body chặt ⇒ 400; end ≤ start ⇒ 422; lượt chờ của người khác ⇒ 404 (6.2); của mình ⇒ 204.'])],
  goiY: [['Which check comes first in the handler: lab, time range, slot, duplicate?', 'Handler kiểm gì trước: phòng, khoảng thời gian, khung giờ, trùng?'], ['Hidden records answer like missing ones.', 'Bản ghi bị ẩn trả lời như không tồn tại.']],
  loi: [['Expecting 403 when An deletes Bin’s entry — LabFlow hides it (404).', 'Chờ 403 khi An xoá lượt chờ của Bình — LabFlow ẩn nó (404).'], ['Expecting 201 for a free slot — the waitlist is only for booked slots.', 'Chờ 201 cho khung giờ trống — hàng chờ chỉ dành cho khung đã có người đặt.']],
  tns: [tn('waitlist', 'hàng chờ'), tn('position', 'vị trí trong hàng (tính, không lưu)')],
  kn: ['design-first'],
});

export default doiDau({ slug: 'api-7-6-lab', ten: 'Lab 7 — Design-first waitlist', khoa: KHOA, baiHoc: 'api-7-6-lab', de: [E1, E2] });
