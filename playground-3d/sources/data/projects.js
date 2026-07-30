/**
 * Khu Dự án — 8 khu học tập của cuongthai.com.
 *
 * Ghi chú cấu trúc (đọc từ ProjectsArea.js, đừng đoán lại):
 * - `titleSmall`: mỗi phần tử là MỘT DÒNG chữ khắc trên biển.
 * - `attributes`: ProjectsArea.js:695 chốt cứng đúng ba nhãn `role`, `at`, `with`.
 *   Tên nhãn không đổi được, nội dung thì tự do.
 * - `distinctions`: ProjectsArea.js:1045 chỉ nhận 'awwwards', 'cssda', 'fwa' —
 *   đó là giải thưởng RIÊNG của tác giả gốc. Để MẢNG RỖNG ở mọi mục.
 * - `images`: số lượng linh hoạt, một ảnh cũng chạy. Dùng .png, KHÔNG phải .ktx.
 *   ⚠️ Mọi tên ảnh ở đây PHẢI có file thật trong static/projects/images/ —
 *   thiếu file là thế giới treo ở màn hình tải, không báo lỗi gì.
 *   ⚠️ TỐI ĐA 5 ẢNH mỗi dự án. Dãy chấm phân trang là mesh CÓ SẴN trong
 *   areas.glb: `refPagination → inner → 5 plane`, kèm đúng 5 `refIntersectPagination`.
 *   Ảnh thứ 6 trở đi vẫn lật tới được nhưng không có chấm, và
 *   `intersectPagination[i]` (ProjectsArea.js:592) thành undefined. Con số 5 này
 *   ĐO TỪ FILE .glb ngày 31/7/2026, không phải phỏng đoán.
 * - Ảnh chụp bằng Playwright ở 1600×900 @2x rồi thu về 960×540 (16:9), trình
 *   duyệt sạch KHÔNG đăng nhập nên chỉ có nội dung công khai. Quy trình đầy đủ
 *   nằm trong scratchpad/PLAYGROUND-HANDOFF.md.
 */
export default [
    {
        title: 'Code Lab',
        titleSmall: [ 'Code', 'Lab' ],
        url: 'https://cuongthai.com/code-lab',
        attributes: { role: 'Learn by running real code', at: 'cuongthai.com', with: 'Exercises that actually execute' },
        distinctions: [],
        images: [ 'code-lab-1.png', 'code-lab-2.png', 'code-lab-3.png' ]
    },
    {
        title: 'Academy',
        titleSmall: [ 'Academy' ],
        url: 'https://cuongthai.com/academy',
        attributes: { role: 'Full course material', at: 'cuongthai.com', with: '49 subjects, 9 semesters' },
        distinctions: [],
        images: [ 'academy-1.png', 'academy-2.png', 'academy-3.png' ]
    },
    {
        title: 'Exam Room',
        titleSmall: [ 'Exam', 'Room' ],
        url: 'https://cuongthai.com/exam',
        attributes: { role: 'Practice papers', at: 'cuongthai.com', with: 'Every answer verified by running it' },
        distinctions: [],
        images: [ 'exam-1.png', 'exam-2.png' ]
    },
    {
        title: 'Simulation Studio',
        titleSmall: [ 'Simulation', 'Studio' ],
        url: 'https://cuongthai.com/simulation',
        attributes: { role: 'Concepts made visual', at: 'cuongthai.com', with: 'Animated scenarios, rendered to video' },
        distinctions: [],
        images: [ 'simulation-1.png', 'simulation-2.png', 'simulation-3.png' ]
    },
    {
        title: 'Roadmap',
        titleSmall: [ 'Roadmap' ],
        url: 'https://cuongthai.com/roadmap',
        attributes: { role: 'Learning paths', at: 'cuongthai.com', with: '33 roadmaps, every link checked' },
        distinctions: [],
        images: [ 'roadmap-1.png', 'roadmap-2.png', 'roadmap-3.png' ]
    },
    {
        title: 'My Language',
        titleSmall: [ 'My', 'Language' ],
        url: 'https://cuongthai.com/language',
        attributes: { role: 'Language learning', at: 'cuongthai.com', with: 'Japanese, English, Chinese' },
        distinctions: [],
        images: [ 'language-1.png', 'language-2.png', 'language-3.png' ]
    },
    {
        title: 'Courses',
        titleSmall: [ 'Online', 'Courses' ],
        url: 'https://cuongthai.com/courses',
        attributes: { role: 'Video courses', at: 'cuongthai.com', with: 'Node.js Zero to Production, 112 lessons' },
        distinctions: [],
        images: [ 'courses-1.png', 'courses-2.png' ]
    },
    {
        title: 'Experience Log',
        titleSmall: [ 'Experience', 'Log' ],
        url: 'https://cuongthai.com/blog',
        attributes: { role: 'Engineering deep-dives', at: 'cuongthai.com', with: 'Production patterns, written after the incident' },
        distinctions: [],
        images: [ 'blog-1.png' ]
    },
]
