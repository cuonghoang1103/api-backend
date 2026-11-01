/** Giảng theo slide — bài 11.5 "Chat" (deck api-11-5, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-5', 'A chat', 'Chat', [
  [1, 'Cover', `<p>Duplicates, order and many devices.</p>`, `<p>Tin trùng, thứ tự và nhiều thiết bị.</p>`],
  [2, 'Contract', `<p>Send over HTTP, receive over a socket with a ticket.</p>`, `<p>Gửi qua HTTP, nhận qua socket bằng vé (ticket).</p>`],
  [3, 'Twice', `<p>Lost responses made 66 duplicates of 200; clientMessageId made 0.</p>`, `<p>Phản hồi bị mất tạo 66 tin trùng trên 200; clientMessageId đưa về 0.</p>`],
  [4, 'Order', `<p>A slow phone clock put 200 of 200 out of place; the server's seq did not.</p>`, `<p>Đồng hồ điện thoại chậm làm 200/200 tin sai chỗ; seq của server thì không.</p>`],
  [5, 'Devices', `<p>Sync after a seq, a read cursor that only moves forward.</p>`, `<p>Đồng bộ sau một seq, con trỏ đã đọc chỉ đi tới.</p>`],
  [6, 'Summary', `<p>Weak versus strong answers. Next: booking.</p>`, `<p>Câu yếu và câu mạnh. Tiếp theo: đặt lịch.</p>`],
]);
