/**
 * Networking for Developers — Chương 12: Mạng trong phỏng vấn (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-12-1 … netdev-12-3); thêm quiz netdev-12-4. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Không có lab Docker riêng — bài TÁI DÙNG output đã có (c113-path curl -w, c41-tay bắt tay, c45-ka keep-alive,
 * c114-checklist openssl/nc) làm BẰNG CHỨNG cho câu trả lời; thực hành là bài tập tự diễn giải/đo.
 */
import b121 from './bai/120-cau-hoi.mjs';
import b122 from './bai/121-tinh-huong.mjs';
import b123 from './bai/122-chung-chi.mjs';
import q12 from './bai/123-quiz-ch12.mjs';

export default {
  title: 'Chapter 12 — Networking in interviews|||Chương 12 — Mạng trong phỏng vấn',
  description: 'Học xong chương: trả lời các câu hỏi mạng kinh điển CÓ CHIỀU SÂU và kèm MỘT PHÉP ĐO (không phải định nghĩa suông) — "gõ URL → thấy trang" đi qua gì (đo bằng curl -w), bắt tay TCP 3 bước là một vòng khứ hồi (bắt gói thật + keep-alive dùng lại kết nối), TCP vs UDP là một đánh đổi, HTTP/1.1 vs 2 vs 3 theo cái mỗi bản SỬA (ghép kênh, rồi nghẽn đầu hàng TCP qua QUIC), TLS/DNS là các vòng khứ hồi; xử lý VÒNG TÌNH HUỐNG bằng khuôn triệu-chứng→giả-thuyết→phép-đo→kết-luận (chậm một vùng, timeout mỗi tối đọc mã 504/503/502, chỉ client cũ lỗi chứng chỉ đọc chuỗi bằng openssl — ĐỊNH VỊ trước khi đổ lỗi); và đánh giá chứng chỉ (Network+/CCNA là chứng chỉ kỹ-sư-mạng; kỹ năng trước, chứng chỉ chỉ để mở một cánh cửa cụ thể) — tái dùng mọi phép đo của khoá làm câu trả lời nổi bật.',
  lessons: [b121, b122, b123, q12],
};
