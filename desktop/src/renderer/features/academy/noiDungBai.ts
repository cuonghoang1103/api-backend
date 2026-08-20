/**
 * CSS cho nội dung bài học — CẮT TỪ file của web, không chép.
 *
 * ─── Vì sao ───
 * Bài học là HTML do trình soạn thảo của web sinh ra, dùng khoảng 40 lớp riêng
 * (`lz-map`, `lz-node`, `callout`, `link-card`, `lead`…). Không có CSS ấy thì
 * một bản đồ lộ trình đẹp đẽ rơi thành hai chục dòng chữ phẳng — đúng thứ đo
 * được lúc dựng trang này lần đầu.
 *
 * Chép 700 dòng CSS sang đây thì hai bản lệch nhau ngay lần web sửa đầu tiên,
 * và không ai phát hiện được vì cả hai vẫn "chạy". Nên app CẮT vùng đó ra từ
 * `frontend/src/app/globals.css` lúc dựng, giữa hai dòng mốc `ct-desktop:`.
 * Một nguồn duy nhất; mốc mất là bản dựng hỏng ồn ào.
 *
 * ─── Biến màu ───
 * Vùng CSS đó gọi 11 biến của chủ đề web (`--text-primary`, `--bg-card`…).
 * Chúng không tồn tại trong app, và `var()` không có giá trị lùi thì cả khai
 * báo bị bỏ — chữ mất màu, khối mất nền. Nên ánh xạ sang token `--ct-*` ngay
 * trên chính phần bọc, xem `.ct-hv-noidung` trong `styles.css`.
 */
import 'virtual:noi-dung-bai.css';
