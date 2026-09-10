/**
 * ============================================================
 * TỪ ĐIỂN Việt → Anh cho GIAO DIỆN APP
 * ============================================================
 *
 * Khoá là chính câu tiếng Việt trong mã. Lý do chọn thế: xem đầu `index.ts`.
 *
 * ─── ⛔ CHỈ DỊCH CHỮ CỦA APP ───
 * KHÔNG đưa vào đây:
 *  • Nội dung tải từ web (tên bài học, tên khoá, bài viết, tin nhắn) — nó là
 *    dữ liệu của người dùng và của máy chủ, dịch nó là bịa lại nội dung.
 *  • Chỗ SONG NGỮ cố ý (bài học Việt–Anh trong Code Lab, My Language) — cả
 *    điểm của chúng là hiện hai thứ tiếng cùng lúc.
 *  • Tên riêng và thuật ngữ đã là tiếng Anh sẵn: `AI Chat`, `Code Lab`,
 *    `Maker Lab`, `Exp Hub`, `CV Builder`, `Tech Trends`, `Pro`.
 *
 * ─── VĂN PHONG BẢN TIẾNG ANH ───
 * Người dùng đổi sang tiếng Anh để trông CHUYÊN NGHIỆP, nên bản Anh viết theo
 * lối phần mềm chuyên nghiệp: câu ngắn, viết hoa kiểu câu (`Sync now`, không
 * phải `Sync Now`), động từ ở dạng nguyên thể cho nút bấm, không dùng "please".
 *
 * Thiếu một mục thì `t()` trả lại nguyên câu tiếng Việt — lạ mắt nhưng vẫn
 * dùng được, khác hẳn một khoá lòi ra hay một ô trống.
 */
export const TU_DIEN: Record<string, string> = {
  // ── Điều hướng: nhãn các trang ──────────────────────────
  'Tổng quan': 'Dashboard',
  'Bảng tin': 'Feed',
  'Tin nhắn': 'Messages',
  'Ghi chú': 'Notes',
  'Bạn bè': 'Friends',
  'Mẫu AI': 'AI Templates',
  'Giọng nói': 'Voice',
  'Học viện': 'Academy',
  'Khoá học': 'Courses',
  'Phòng thi': 'Exam Room',
  'Ngoại ngữ': 'Languages',
  'Thuật toán': 'Algorithms',
  'Mô phỏng': 'Simulations',
  'Lộ trình': 'Roadmaps',
  'Phỏng vấn': 'Interviews',
  'Xưởng nội dung': 'Creator Studio',
  'Dự án': 'Projects',
  'Kho mã': 'Repositories',
  'Nhạc': 'Music',
  'Trò chơi': 'Games',
  'Tài chính': 'Finance',
  'Diễn đàn': 'Forum',
  'Đã lưu': 'Saved',
  'Trang cá nhân': 'Profile',

  // ── Nhóm trong thanh bên ────────────────────────────────
  'Chính': 'Main',
  'Học tập': 'Learning',
  'Làm & sáng tạo': 'Build & create',
  'Khác': 'More',

  // ── Thanh bên ───────────────────────────────────────────
  'Thu gọn thành biểu tượng': 'Collapse to icons',
  'Ẩn hẳn thanh bên': 'Hide the sidebar',
  'Hiện lại thanh bên': 'Show the sidebar',
  'Hiện lại thanh bên  (⌘B)': 'Show the sidebar  (⌘B)',
  'Điều hướng chính': 'Main navigation',
  'Có màn hình riêng trong app': 'Has a native screen in the app',
  'Cần tài khoản Pro': 'Requires a Pro account',
  'Thu gọn': 'Collapse',

  // ── Thanh trạng thái ────────────────────────────────────
  'Trực tuyến': 'Online',
  'Ngoại tuyến': 'Offline',
  'Đồng bộ ngay': 'Sync now',
  'Đã đồng bộ': 'Synced',
  'Thu nhỏ': 'Zoom out',
  'Phóng to': 'Zoom in',

  // ── Thanh tiêu đề & bảng lệnh ───────────────────────────
  'Cài đặt': 'Settings',
  'Giới thiệu': 'About',
  'Mở bảng lệnh': 'Open the command palette',
  'Tìm kiếm hoặc chạy lệnh': 'Search or run a command',
  'Mở': 'Open',
  'Ứng dụng': 'Application',
  'Mở trang hiện tại trên web': 'Open this page on the web',
  'Trình duyệt': 'Browser',
  'Tải lại ứng dụng': 'Reload the app',
  'Bảng lệnh': 'Command palette',
  'Tìm trang hoặc lệnh…': 'Search pages or commands…',
  'Tìm trang hoặc lệnh': 'Search pages or commands',
  'Kết quả': 'Results',
  'Không có kết quả nào.': 'No results.',
  'Tài khoản': 'Account',

  // ── Trang Cài đặt ───────────────────────────────────────
  'Giao diện': 'Appearance',
  'Chủ đề': 'Theme',
  'Sáng': 'Light',
  'Tối': 'Dark',
  'Theo hệ thống': 'Match system',
  'Ngôn ngữ': 'Language',
  'Tiếng Việt': 'Vietnamese',
  'Tiếng Anh': 'English',
  'Chữ trong app đổi ngay, không cần khởi động lại. Nội dung tải từ web (bài học, bài viết, tin nhắn) giữ nguyên ngôn ngữ gốc.':
    'The app’s own text changes immediately — no restart needed. Content loaded from the web (lessons, posts, messages) keeps its original language.',
  '“Theo hệ thống” sẽ đổi theo cài đặt sáng/tối của máy.':
    '“Match system” follows your computer’s light/dark setting.',
  'Trợ lý Odin': 'Odin assistant',
  'Hiển thị bảng trợ lý ở cạnh phải. Tắt đi thì app vẫn dùng bình thường.':
    'Show the assistant panel on the right. Turning it off changes nothing else.',
  'Dung lượng': 'Storage',
  'Cache HTTP (ảnh, tệp tĩnh)': 'HTTP cache (images, static files)',
  'Dữ liệu ứng dụng đã dùng': 'App data used',
  'Hạn mức trình duyệt cấp': 'Browser quota',
  'Đang xoá…': 'Clearing…',
  'Xoá cache HTTP': 'Clear HTTP cache',
  'Chỉ xoá ảnh và tệp tĩnh đã tải. **Không** đụng tới nháp hay dữ liệu ngoại tuyến của bạn.':
    'Only clears downloaded images and static files. It does **not** touch your drafts or offline data.',
  'Không': 'None',

  // ── Robot ───────────────────────────────────────────────
  'Mở AI Chat': 'Open AI Chat',
  'Cỡ': 'Size',
  'Tự dính mép màn hình': 'Snap to screen edge',
  'Tắt robot nổi': 'Turn off the floating robot',
  'Tắt robot trong app': 'Turn off the in-app robot',
};
