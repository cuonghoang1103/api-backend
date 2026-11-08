/**
 * Một câu mô tả ngắn cho mỗi trang trên thanh bên — hiện trong thẻ gợi ý khi thanh bên THU GỌN
 * (08/11/2026). Chỉ biểu tượng thì "01/10", "bình thí nghiệm", "đường cong" khó đoán là trang gì;
 * tên trang + một dòng nói trang đó để làm gì là đủ để người dùng không phải bấm thử.
 *
 * Giữ tiếng Việt ở đây, dịch tại chỗ dựng (`dich()`), cùng lý do với `MODE_LABEL` ở Sidebar.
 * Trang không có trong bảng thì thẻ chỉ hiện tên — không sao.
 */
export const MO_TA_TRANG: Readonly<Record<string, string>> = {
  '/dashboard': 'Hôm nay, kế hoạch học và việc đang dở',
  '/notifications': 'Lượt thích, bình luận, lời mời mới',
  '/messages': 'Nhắn tin và gọi với bạn bè',
  '/notes': 'Sổ ghi chú theo môn học',
  '/friends': 'Bạn bè, lời mời kết bạn, ai đang online',
  '/chat': 'Trò chuyện và viết code cùng AI',
  '/ai-templates': 'Mẫu lệnh AI dùng lại được',
  '/books': 'Thư viện sách và giáo trình',
  '/ielts': 'Khoá IELTS 0 → 7.5, luyện nói có chấm điểm',
  '/jp': 'Tiếng Nhật theo lớp (できる日本語) → N2',
  '/ch': 'Tiếng Trung từ số 0 đến HSK 6',
  '/academy': 'Môn học theo chương trình đại học',
  '/courses': 'Khoá học kỹ năng đi làm',
  '/code-lab': 'Bài tập code có máy chấm',
  '/exam': 'Phòng thi thử PE / FE',
  '/interview': 'Luyện phỏng vấn cùng AI',
  '/language': 'Từ vựng, ngữ pháp, luyện các ngôn ngữ',
  '/algorithms': 'Xem thuật toán chạy từng bước',
  '/simulation': 'Mô phỏng trực quan các khái niệm',
  '/roadmap': 'Lộ trình học theo nghề',
  '/creator': 'Soạn bài, video, nội dung',
  '/maker-lab': 'Lập trình phần cứng IoT',
  '/projects': 'Dự án cá nhân và portfolio',
  '/work': 'Quản lý dự án nhóm kiểu Jira',
  '/games': 'Trò chơi luyện não, đối kháng với bạn',
  '/music': 'Nghe nhạc, danh sách phát',
  '/toc-do-mang': 'Đo tốc độ mạng',
  '/finance': 'Quản lý thu chi',
  '/quan-tri': 'Quản trị hệ thống (chỉ admin)',
  '/app/settings': 'Giao diện, thông báo, tài khoản',
};
