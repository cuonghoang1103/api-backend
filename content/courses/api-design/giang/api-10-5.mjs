/** Giảng theo slide — bài 10.5 "Webhook (1): gửi" (deck api-10-5, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-5', 'Webhooks (1): sending', 'Webhook (1): gửi', [
  [1, 'Cover', `<p>Now LabFlow is the client.</p>`, `<p>Giờ LabFlow là bên gọi (client).</p>`],
  [2, 'Registering', `<p>A webhook URL is an SSRF target; the secret is shown once.</p>`, `<p>URL webhook là mục tiêu SSRF (giả mạo request phía server); khoá bí mật chỉ hiện một lần.</p>`],
  [3, 'Signed POST', `<p>One message per subscription, queued, signed with HMAC.</p>`, `<p>Mỗi đăng ký (subscription) một thông điệp, vào hàng đợi, ký bằng HMAC (băm có khoá).</p>`],
  [4, 'The receiver gets', `<p>Id to dedupe, timestamp, signature.</p>`, `<p>Id để lọc trùng, mốc giờ, chữ ký.</p>`],
  [5, 'Retries', `<p>503 three times, then 204, all in the log. Backoff with jitter.</p>`, `<p>Ba lần 503 rồi 204, tất cả nằm trong nhật ký giao. Lùi dần có độ lệch ngẫu nhiên (jitter).</p>`],
  [6, 'Summary', `<p>Next: receiving webhooks.</p>`, `<p>Tiếp theo: nhận webhook.</p>`],
]);
