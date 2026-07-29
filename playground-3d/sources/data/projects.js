/**
 * Khu Dự án — 6 khu học tập của cuongthai.com.
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
 */
export default [
    {
        title: 'Code Lab',
        titleSmall: [ 'Code', 'Lab' ],
        url: 'https://cuongthai.com/code-lab',
        attributes: { role: 'Learn by running real code', at: 'cuongthai.com', with: 'Exercises that actually execute' },
        distinctions: [],
        images: [ 'code-lab-1.png' ]
    },
    {
        title: 'Academy',
        titleSmall: [ 'Academy' ],
        url: 'https://cuongthai.com/academy',
        attributes: { role: 'Full course material', at: 'cuongthai.com', with: '49 subjects, 9 semesters' },
        distinctions: [],
        images: [ 'academy-1.png' ]
    },
    {
        title: 'Exam Room',
        titleSmall: [ 'Exam', 'Room' ],
        url: 'https://cuongthai.com/exam',
        attributes: { role: 'Practice papers', at: 'cuongthai.com', with: 'Every answer verified by running it' },
        distinctions: [],
        images: [ 'exam-1.png' ]
    },
    {
        title: 'Simulation Studio',
        titleSmall: [ 'Simulation', 'Studio' ],
        url: 'https://cuongthai.com/simulation',
        attributes: { role: 'Concepts made visual', at: 'cuongthai.com', with: 'Animated scenarios, rendered to video' },
        distinctions: [],
        images: [ 'simulation-1.png' ]
    },
    {
        title: 'Roadmap',
        titleSmall: [ 'Roadmap' ],
        url: 'https://cuongthai.com/roadmap',
        attributes: { role: 'Learning paths', at: 'cuongthai.com', with: '33 roadmaps, every link checked' },
        distinctions: [],
        images: [ 'roadmap-1.png' ]
    },
    {
        title: 'My Language',
        titleSmall: [ 'My', 'Language' ],
        url: 'https://cuongthai.com/language',
        attributes: { role: 'Language learning', at: 'cuongthai.com', with: 'Japanese, English, Chinese' },
        distinctions: [],
        images: [ 'language-1.png' ]
    },
]
