/**
 * Tailwind cho app desktop.
 *
 * `content` quét CẢ hai cây: mã của desktop, VÀ các component Notes của web mà
 * desktop dùng lại. Thiếu cây thứ hai thì Tailwind không thấy lớp nào trong đó,
 * không sinh CSS tương ứng, và giao diện Notes hiện ra TRẦN TRỤI — không lỗi,
 * không cảnh báo, chỉ là chữ đen trên nền trắng.
 *
 * Cấu hình cố ý tối thiểu: chỉ cần đủ để các lớp Tailwind trong component web
 * có CSS. Hệ màu riêng của app desktop nằm ở styles.css dạng biến CSS, không
 * trộn vào đây.
 */
export default {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
    /**
     * ⚠️ Quét CẢ cây nguồn của web, không chỉ `components/notes`.
     *
     * Bản đầu chỉ liệt kê `components/notes` và bỏ sót `app/notes/page.tsx` —
     * chính là nơi giữ bố cục ngoài cùng: `h-[calc(100dvh-…)]` và BA
     * `overflow-y-auto`. Không quét thì Tailwind không sinh những lớp đó, ba
     * vùng cuộn không tồn tại, và cây môn học bị cắt cụt ở đáy — không kéo
     * được, không lỗi, không cảnh báo.
     *
     * Liệt kê từng thư mục là mời gọi bỏ sót lần nữa: cây Notes import chéo
     * sang `components/ui`, `lib`, `store`, `types`, và sẽ còn mở rộng. Quét cả
     * cây tốn thêm chút thời gian dựng, đổi lấy việc không bao giờ phải đoán
     * xem còn thiếu thư mục nào.
     */
    '../frontend/src/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
