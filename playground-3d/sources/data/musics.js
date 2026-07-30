/**
 * Nhạc nền của thế giới 3D.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Nhạc hiện tại là **beat gốc của Cuong Hoang (CuongThai)** — tự làm, không dính
 * bản quyền của ai. Ba bản nhạc của bản mẫu (Kounine viết cho portfolio của
 * Bruno Simon) đã được gỡ khỏi fork này từ trước.
 *
 * Danh sách chạy TUẦN TỰ từ bài đầu đến bài cuối rồi quay lại bài đầu. Thứ tự
 * trong mảng này CHÍNH LÀ thứ tự phát, nên đổi thứ tự ở đây là đổi thứ tự nghe.
 *
 * ➕ THÊM BÀI MỚI (chỉ sửa đúng file này):
 *
 *      1. Chép file .mp3 vào `static/sounds/musics/`
 *      2. Thêm một dòng vào mảng bên dưới:
 *
 *             { path: 'sounds/musics/ten-file.mp3', name: 'Tên bài' }
 *
 *    Xong. Mục Music trong bảng Cài đặt tự thấy bài mới (nút ‹ › duyệt đúng
 *    theo mảng này), jukebox khu Bowling cũng vậy. Không phải sửa chỗ nào khác.
 *
 * ⚠️ `path` KHÔNG có gạch chéo đầu — đường dẫn tính từ thư mục `static/`, và
 *    Howler nối nó với `<base href>` nên phải là đường dẫn tương đối thì mới
 *    chạy đúng khi site nằm dưới thư mục con `/playground/`.
 *
 * ⚠️ `name` hiện ở hai chỗ: thông báo "Now playing" góc màn hình, và dòng Track
 *    trong bảng Cài đặt. Chỗ trong bảng Cài đặt HẸP — tên dài sẽ bị cắt bằng
 *    dấu ba chấm. Giữ tên ngắn.
 *
 * ⚠️ Danh sách RỖNG vẫn chạy tốt: không nhạc nào phát, mục Music trong bảng Cài
 *    đặt tự ẩn, jukebox tự tắt nút "Change song". Mọi hiệu ứng âm thanh khác
 *    không liên quan gì tới file này.
 *
 * ⚠️ Nhạc là nhóm file NẶNG nhất trong gói (5 bài hiện tại ~22MB). Chúng
 *    `preload: false` nên KHÔNG tải lúc mở trang — chỉ tải đúng bài đang phát.
 *    Nhưng vẫn nằm trong image Docker, nên đừng thêm vô tội vạ.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default [
    { path: 'sounds/musics/CuongThai1.mp3', name: 'Beat 1' },
    { path: 'sounds/musics/CuongThai2.mp3', name: 'Beat 2' },
    { path: 'sounds/musics/CuongThai3.mp3', name: 'Beat 3' },
    { path: 'sounds/musics/CuongThai4.mp3', name: 'Beat 4' },
    { path: 'sounds/musics/CuongThai5.mp3', name: 'Beat 5' },
]
