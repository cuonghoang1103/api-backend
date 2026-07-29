/**
 * Khu mạng xã hội.
 *
 * ⚠️ BẪY: SocialArea.js:41 tính góc bằng `i * Math.PI / (socialData.length - 1)`.
 * Danh sách chỉ còn ĐÚNG 1 mục => chia cho 0 => góc NaN => vị trí NaN. NaN chảy
 * vào ma trận, three ném lỗi ngay trong vòng lặp vẽ và vòng lặp chết mà không
 * báo gì cả. Luôn giữ TỐI THIỂU 2 mục ở đây.
 *
 * `align` chỉ quyết định nhãn nằm bên trái hay bên phải điểm tương tác.
 */
export default [
    { name: 'GitHub', url: 'https://github.com/cuonghoang1103', align: 'right' },
    { name: 'Youtube', url: 'https://www.youtube.com/@cuongthai2003', align: 'right' },
    // Link user gửi là link chia sẻ, đuôi có ?mibextid=…&rdid=…&share_url=… —
    // đó là tham số theo dõi của Facebook, bỏ đi vẫn ra đúng trang và sạch hơn.
    { name: 'Facebook', url: 'https://www.facebook.com/CuongThaiswit', align: 'left' },
]
