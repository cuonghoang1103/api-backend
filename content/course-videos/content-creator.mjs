/**
 * Luồng video YT cho khoá "Content Creator: Quay, Dựng & Đăng Video".
 * ─────────────────────────────────────────────────────────────────────────────
 * Một dòng cho mỗi bài KHÔNG phải quiz (kể cả bài N.0 slide — ở đó đặt video
 * TỔNG QUAN/khoá đầy đủ của cả chương) → video của người làm nghề hiện ở nút YT
 * của trang học, cho tới khi có bản tự quay VI/EN.
 *
 * Mọi id lấy từ trang kết quả YouTube thật (bóc ytInitialData, không đoán), rồi:
 *   node scripts/yt-check.mjs <id…>          → oEmbed 200 + tên kênh/tiêu đề thật
 *   watch page "playableInEmbed": true         → chủ kênh cho phép nhúng
 * `credit` = đúng "author_name — title" mà oEmbed trả về.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/content-creator.mjs
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/content-creator.mjs --apply
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'content-creator',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Bắt đầu hành trình creator ── */
    'cr-00-0-slides': { yt: '0qQa8gCvAwc', credit: 'vidIQ — How to Create a YouTube Channel for Beginners in 2026 (Step-by-Step)' },
    'cr-00-1-hanh-trinh-creator': { yt: 'P4dT-lW9260', credit: 'ColdFusion — How Did YouTube Start?' },
    'cr-00-2-do-nghe-cua-ban': { yt: 'cCISdKD3ikI', credit: 'Think Media — The Ultimate 2026 YouTube Gear Guide! (Everything Beginners Need to Know)' },
    'cr-00-3-quy-trinh-san-xuat': { yt: 'U6I1tMgjW-I', credit: 'StudioBinder — The Pre-Production Process in Film Explained [Stages of Filmmaking, Ep 2]' },
    'cr-00-4-lo-trinh-cach-hoc': { yt: '954L0eVIdaE', credit: 'Gavin Herman — How I Would Learn Video Editing (If I Could Start Over)' },

    /* ── Chương 4 — Phân cảnh: shot list & storyboard ── */
    'cr-04-0-slides': { yt: 'OSQTq1E6NHU', credit: 'Gaku Lange — How To PLAN & ORGANIZE Your Videos + FREE Filmmaking Template' },
    'cr-04-1-bay-quay-mot-leo': { yt: 't2P9Z_UPTdU', credit: 'Matthew Encina — How to Film Yourself – Planning: Idea, Script, and Shot List' },
    'cr-04-2-canh-shot-take': { yt: '2N4hEbcX2N8', credit: 'Jeven Dovey — Use This Formula To NEVER MISS A SHOT!' },
    'cr-04-3-shot-list': { yt: 'IhXMpBk3GDA', credit: 'StudioBinder — How to Make a Shot List for Film: A Step-by-Step Guide' },
    'cr-04-4-storyboard-ngay-quay': { yt: 'NPrkxj2MyZI', credit: 'The Media Insider — How to draw A-grade storyboards (even if you can\'t draw!) | Media studies tutorial' },
  },
};
