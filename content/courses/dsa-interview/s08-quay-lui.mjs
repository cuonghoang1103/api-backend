/**
 * Chương 8 — Quay lui. Mọi mã/output trong chương đọc từ ./ma/ch08 (chạy thật: _chay.mjs).
 * Một khuôn xuyên chương: chọn → đi tiếp → bỏ chọn; 8.2 thêm "start + bỏ trùng cùng tầng", 8.3 thêm cắt nhánh.
 */
import b1 from './ch08/b1-mau.mjs';
import b2 from './ch08/b2-to-hop.mjs';
import b3 from './ch08/b3-cat-nhanh.mjs';
import b4 from './ch08/b4-luyen.mjs';
import b5 from './ch08/b5-quiz.mjs';

export default {
  title: 'Chapter 8 — Backtracking|||Chương 8 — Quay lui',
  description: 'Một khuôn quay lui (chọn → đi tiếp → bỏ chọn) cho tập con, hoán vị, tổ hợp, combination sum có khử trùng, sinh ngoặc, phân tách palindrome, N-Queens, Word Search, Sudoku — kèm cây trạng thái nhìn thấy được, đo số nút có/không cắt nhánh và bảng n tối đa đo thật.',
  lessons: [
    b1, // 8.1 — khuôn, tập con, hoán vị, mọi đường trong menu, bảng n tối đa, góc kẻ xấu OTP
    b2, // 8.2 — bốn núm vặn: tổ hợp, combination sum I/II, bỏ trùng cùng tầng, bàn phím, ngoặc, palindrome
    b3, // 8.3 — cắt nhánh: N-Queens (đo n = 4…15), Word Search, Sudoku MRV, lịch thi, rò rỉ thời gian
    b4, // 8.4 — bộ luyện 8 đề
    b5, // 8.5 — quiz (bài mới)
  ],
};
