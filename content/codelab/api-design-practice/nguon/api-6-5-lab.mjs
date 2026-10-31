/** API Design · Lab 6 — Review bảo mật: thứ tự làm việc của người review, dự đoán bản lỗi/bản vá (output thật Lab 6). */
import { doiDau, KHOA, cs, ord, bang1, tn } from './_api.mjs';

const E1 = cs({
  ten: 'Lab 6 · 1 — A reviewer’s order of work', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps of the Lab 6 security review as in the reference solution.',
  vi: 'Sắp các bước của buổi review bảo mật Lab 6 như lời giải tham khảo.',
  cau: [ord('o1', ['From first to last', 'Từ đầu tới cuối'], [
    'Run node audit.mjs against the LABFLOW_VULN=1 build and list every FAIL',
    'Prove each FAIL with one curl exploit and its real output',
    'Explain the chain: API3 escalation makes API5 and API6 fail too',
    'Close each hole: policy + 404, HS256 only + expiry + login limit, strict schema, safeFetch, CORS list',
    'Write test/security.test.mjs: green on the fixed build',
    'Switch the holes back on: the same tests must turn red',
  ], ['Find, prove, understand, fix, then leave tests that are green on the fix and red on the hole — a test that passes both tests nothing.', 'Tìm, chứng minh, hiểu, vá, rồi để lại bộ test xanh trên bản vá và đỏ trên lỗ hổng — test đạt cả hai thì không kiểm gì.'])],
  goiY: [['You cannot fix what you have not proved.', 'Không vá được thứ chưa chứng minh.'], ['When is a test worth keeping?', 'Khi nào một test đáng giữ lại?']],
  loi: [['Fixing before writing down the exploit — no evidence for the report.', 'Vá trước khi ghi lại cách khai thác — báo cáo không có bằng chứng.'], ['Never running the tests against the vulnerable build.', 'Không bao giờ chạy test với bản có lỗ hổng.']],
  tns: [tn('finding', 'phát hiện (một lỗ hổng đã chứng minh)'), tn('exploit', 'cách khai thác')],
  kn: ['security review'],
});

const A = ['200', '400', '401', '404', '422', '429'];
const E2 = cs({
  ten: 'Lab 6 · 2 — Vulnerable vs fixed: predict the status', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'Predict the status code of each request on the vulnerable build (LABFLOW_VULN=1) and on the fixed build.',
  vi: 'Dự đoán mã trạng thái của từng request trên bản có lỗ (LABFLOW_VULN=1) và trên bản đã vá.',
  bang: [bang1('b1', ['Request → vulnerable / fixed', 'Request → bản lỗi / bản vá'], [{ ma: 'x', ten: 'Request' }, { ma: 'v', ten: 'Vulnerable', luaChon: A }, { ma: 'f', ten: 'Fixed', luaChon: A }], [
    { o: { x: 'Bin: GET /v2/bookings/<An’s id>/receipt' }, a: { v: '200', f: '404' } },
    { o: { x: 'GET /v2/admin/deprecations with a forged "alg":"none" manager token' }, a: { v: '200', f: '401' } },
    { o: { x: 'The 6th wrong password for Bin within a minute' }, a: { v: '401', f: '429' } },
    { o: { x: 'An: PATCH /v2/me {"role":"LAB_MANAGER"}' }, a: { v: '200', f: '400' } },
    { o: { x: 'Lan: POST /v2/devices/dev_1/manual {"url":"http://127.0.0.1:4000/health"}' }, a: { v: '200', f: '422' } },
  ], ['Real runs: BOLA 200 ⇒ 404; alg none accepted ⇒ 401; no limit (401 again) ⇒ 429; mass assignment 200 ⇒ strict schema 400; SSRF probe 200 ⇒ 422 “https only”.', 'Lần chạy thật: BOLA 200 ⇒ 404; alg none được nhận ⇒ 401; không giới hạn (vẫn 401) ⇒ 429; gán hàng loạt 200 ⇒ schema chặt 400; dò SSRF 200 ⇒ 422 “https only”.'])],
  goiY: [['Without the limit, a wrong password is simply wrong.', 'Không có giới hạn thì mật khẩu sai chỉ đơn giản là sai.'], ['A strict schema rejects unknown fields with 400.', 'Schema chặt từ chối trường lạ bằng 400.']],
  loi: [['Expecting 403 for Bin on the fixed build — hidden objects answer 404.', 'Chờ 403 cho Bình trên bản vá — đối tượng bị ẩn trả 404.'], ['Expecting 422 for the role field — unknown fields are a 400 at the edge (2.2).', 'Chờ 422 cho trường role — trường lạ là 400 ngay ở cửa (2.2).']],
  tns: [tn('vulnerable build', 'bản dựng có lỗ hổng'), tn('regression test', 'test chống lỗi quay lại')],
  kn: ['security review'],
});

export default doiDau({ slug: 'api-6-5-lab', ten: 'Lab 6 — Security review', khoa: KHOA, baiHoc: 'api-6-5-lab', de: [E1, E2] });
