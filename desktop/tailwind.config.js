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
    '../frontend/src/components/notes/**/*.{ts,tsx}',
    '../frontend/src/components/ui/**/*.{ts,tsx}',
    '../frontend/src/lib/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
