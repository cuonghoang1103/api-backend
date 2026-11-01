/** Giảng theo slide — bài 8.3 "Chậm do thiết kế" (deck api-08-3, 9 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-3', 'Slow by design', 'Chậm do thiết kế', [
  [1, 'Cover', `<p>3 ms on localhost, 319 ms on slow Wi-Fi.</p>`, `<p>3 ms trên localhost, 319 ms trên Wi-Fi chậm.</p>`],
  [2, 'What you will get', `<p>Bytes become time only on slow links.</p>`, `<p>Byte chỉ thành thời gian trên đường chậm.</p>`],
  [3, 'How big are the answers?', `<p>25.5 KB → 11.7 KB with fields → 1.4 KB with Brotli.</p>`, `<p>25,5 KB → 11,7 KB khi chọn trường → 1,4 KB khi nén Brotli.</p>`],
  [4, 'Over a slow link', `<p>Delay plus size ÷ bandwidth predicts the measurement.</p>`, `<p>Trễ cộng kích thước ÷ băng thông đoán đúng số đo.</p>`],
  [5, 'Fixing it in the contract', `<p>Small default page, sparse fields, opt-in includes, compression.</p>`, `<p>Trang mặc định nhỏ, chọn trường, nhúng khi xin, nén.</p>`],
  [6, 'Compression in Express', `<p>One line; under 1 KB stays plain; Vary keeps caches correct.</p>`, `<p>Một dòng; dưới 1 KB gửi nguyên; Vary giữ cache đúng.</p>`],
  [7, 'The server pays too', `<p>303 MB vs 26.6 MB in ten seconds.</p>`, `<p>303 MB so với 26,6 MB trong mười giây.</p>`],
  [8, 'Other design costs', `<p>N+1, deep OFFSET, chatty screens, unbounded lists.</p>`, `<p>N+1, OFFSET sâu, màn hình lắm lời, danh sách không giới hạn.</p>`],
  [9, 'Summary', `<p>Next: two instances behind a load balancer.</p>`, `<p>Tiếp theo: hai bản sau bộ cân bằng tải.</p>`],
]);
