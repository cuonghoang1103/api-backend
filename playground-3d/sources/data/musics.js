/**
 * Nhạc nền của thế giới 3D.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Ba bản nhạc của bản gốc (do Kounine sáng tác cho portfolio của Bruno Simon)
 * đã được GỠ BỎ khỏi fork này. Danh sách để RỖNG là CÓ CHỦ ĐÍCH.
 *
 * Khi danh sách rỗng:
 *   - không có nhạc nền nào phát;
 *   - jukebox trong khu Bowling tự ẩn nút "Change song" và tắt hiệu ứng nốt
 *     nhạc bay (`BowlingArea.setJukebox`);
 *   - MỌI hiệu ứng âm thanh khác vẫn chạy đầy đủ như cũ.
 *
 * ➕ CÁCH GẮN NHẠC RIÊNG (chỉ sửa đúng file này):
 *
 *      1. Chép file .mp3 vào `static/sounds/musics/`
 *      2. Thêm một dòng vào mảng bên dưới:
 *
 *             { path: 'sounds/musics/ten-file.mp3', name: 'Tên bài hát' }
 *
 *    Xong. Tự phát, tự chuyển bài khi hết, jukebox và thông báo "Now playing"
 *    hoạt động lại ngay, không phải sửa thêm chỗ nào khác.
 *
 * ⚠️ `path` KHÔNG có gạch chéo đầu — đường dẫn tính từ thư mục `static/`, và
 *    Howler nối nó với `<base href>` nên phải là đường dẫn tương đối thì mới
 *    chạy đúng khi site nằm dưới thư mục con `/playground/`.
 *
 * ⚠️ `name` hiện ra trong thông báo "Now playing" ở góc màn hình — đặt tên
 *    người đọc được, đừng để nguyên tên file.
 *
 * ⚠️ GIẤY PHÉP: chỉ dùng nhạc mình có quyền — tự làm, mua bản quyền, hoặc giấy
 *    phép cho phép (CC0, CC-BY…). Nếu giấy phép đòi ghi công thì thêm dòng ghi
 *    công vào mục Credits trong `sources/data/consoleLog.js` và mục "Behind the
 *    scene" trong `sources/index.html`.
 *
 * ⚠️ Nhạc là file NẶNG nhất trong gói (bản gốc 3 bài đã ~19MB). Cân nhắc nén
 *    xuống ~128kbps và giới hạn 1–2 bài để trang không tải quá lâu.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default []
