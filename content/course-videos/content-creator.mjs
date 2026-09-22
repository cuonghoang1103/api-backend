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

    /* ── Chương 1 — Nền tảng & khán giả ── */
    'cr-01-0-slides': { yt: 'rHLjxrbXmmY', credit: 'Creator Insider — YouTube Algorithm 2026 - What Creators Need to Know' },
    'cr-01-1-bon-nen-tang': { yt: 'qpTy422YaWQ', credit: 'Nathan — Which Platform Should You Start On in 2025? (TikTok vs YouTube vs Instagram)' },
    'cr-01-2-thuat-toan-de-xuat': { yt: 'dhYIb72L1hU', credit: 'Creator Insider — The YouTube Algorithms in 2025 — Explained!' },
    'cr-01-3-chon-ngach-khan-gia': { yt: 'ZGN_bxJXnmM', credit: 'Aprilynne Alter — How to Select Your YouTube Niche | How You Can Use Your Niche to Grow on YouTube' },
    'cr-01-4-thuong-hieu-ca-nhan': { yt: '71oNb0HPf5E', credit: 'Vanessa Lau — Don\'t build a social media account. Build a personal brand instead.' },

    /* ── Chương 3 — Kịch bản & kể chuyện ── */
    'cr-03-0-slides': { yt: '7I50PECz7SU', credit: 'Kallaway — How To Write A Killer Script That Keeps Viewers Hooked' },
    'cr-03-1-hook': { yt: 'TOHQXdCAo5k', credit: 'Aprilynne Alter — how to make a killer youtube intro (to blow up your channel)' },
    'cr-03-2-cau-truc-cau-chuyen': { yt: 't5Z-Q1bg1tU', credit: 'Kallaway — How To Become A Master Storyteller' },
    'cr-03-3-viet-kich-ban': { yt: '8s0i1LutAc4', credit: 'Think Media — How to Write a Script for a YouTube Video (Made Easy!)' },
    'cr-03-4-len-hinh-tu-nhien': { yt: 'Y11SX2oHmw8', credit: 'Ali Abdaal — How to Be Confident on Camera (5 Tips)' },

    /* ── Chương 4 — Phân cảnh: shot list & storyboard ── */
    'cr-04-0-slides': { yt: 'OSQTq1E6NHU', credit: 'Gaku Lange — How To PLAN & ORGANIZE Your Videos + FREE Filmmaking Template' },
    'cr-04-1-bay-quay-mot-leo': { yt: 't2P9Z_UPTdU', credit: 'Matthew Encina — How to Film Yourself – Planning: Idea, Script, and Shot List' },
    'cr-04-2-canh-shot-take': { yt: '2N4hEbcX2N8', credit: 'Jeven Dovey — Use This Formula To NEVER MISS A SHOT!' },
    'cr-04-3-shot-list': { yt: 'IhXMpBk3GDA', credit: 'StudioBinder — How to Make a Shot List for Film: A Step-by-Step Guide' },
    'cr-04-4-storyboard-ngay-quay': { yt: 'NPrkxj2MyZI', credit: 'The Media Insider — How to draw A-grade storyboards (even if you can\'t draw!) | Media studies tutorial' },

    /* ── Chương 5 — Máy quay hoạt động thế nào ── */
    'cr-05-0-slides': { yt: 'HTUjJoMNWqo', credit: "Tomorrows Filmmakers — Master Your Camera in 20 Minutes | Tomorrow's Filmmakers" },
    'cr-05-1-do-phan-giai-fps': { yt: 'e6HZPmSlS5c', credit: 'Potato Jet — What Frame Rate Should You Be Filming In?' },
    'cr-05-2-phoi-sang': { yt: 'SsIEcGbwgN0', credit: 'StudioBinder — What is Shutter Speed — Camera Shutter and the Exposure Triangle Explained [Ep. 3]' },
    'cr-05-3-can-bang-trang-lay-net': { yt: 'APLq7aPlDhk', credit: "StudioBinder — Color Temperature Explained — The Cinematographer's Guide to White Balance & Color Temp Fundamentals" },
    'cr-05-4-codec-bitrate-log': { yt: '-4NXxY4maYc', credit: 'ExplainingComputers — Explaining Digital Video: Formats, Codecs & Containers' },

    /* ── Chương 6 — Cài đặt đồ nghề của bạn ── */
    'cr-06-0-slides': { yt: '47-cCQ1qY04', credit: 'The Drone Creative — DJI OSMO POCKET 3 | 20 SETTINGS You SHOULD CHANGE IMMEDIATELY!' },
    'cr-06-1-pocket-3': { yt: 'Mhub0XyAF7Y', credit: 'Hallease — New Osmo Pocket 3? Must-Have Settings for Beginners and Vloggers (Get Cinematic Footage!)' },
    'cr-06-2-iphone-16-pro-max': { yt: 'PBOhLnie2iw', credit: 'Tyler Stalman — All the iPhone Video Setting You Need to Know' },
    'cr-06-3-ipad-mac-linux': { yt: 'C51uC1ItUdU', credit: 'Andy To — M5 iPad Pro: The Complete Creator (Edited on iPad)' },
    'cr-06-4-the-nho-pin-dung-luong': { yt: 'g5PkExucy4I', credit: 'Kingston Technology — SD and microSD Card Specification Labels Explained – DIY in 5 Ep 141' },

    /* ── Chương 12 — Dựng nhanh với CapCut ── */
    'cr-12-0-slides': { yt: 'EMDrgqepVhM', credit: 'Metics Media — CapCut Tutorial for Beginners 2026' },
    'cr-12-1-giao-dien-capcut': { yt: 'j5_471mO14c', credit: 'Metics Media — CapCut Tutorial for Beginners (2026) – Full Video Editing Guide' },
    'cr-12-2-cat-dung-co-ban': { yt: 'Zv9u0aLkfK0', credit: 'Matt Loui — CapCut Beginner Tutorial (2026) - Beginner to Pro' },
    'cr-12-3-chu-phu-de-hieu-ung': { yt: 't5yFQJy9ZLM', credit: 'Creative Suite Tutorials — Learn 90% about Captions Under 10 minutes | CapCut Captions Masterclass' },
    'cr-12-4-xuat-quy-trinh-capcut': { yt: 'Ex1R3rsdlms', credit: 'Content Creators — Edit PRO Youtube Videos in Capcut | In Depth Tutorial' },

    /* ── Chương 13 — Dựng chuyên nghiệp với DaVinci Resolve ── */
    'cr-13-0-slides': { yt: 'gjxiH2Tm4JE', credit: 'Casey Faris — Making Videos in Resolve 21 - Full Course for Beginners' },
    'cr-13-1-lam-quen-resolve': { yt: 'aCTJ7MjpAOw', credit: 'Ben Claremont — DaVinci Resolve 21 Beginners Tutorial: Edit Like A Pro For FREE!' },
    'cr-13-2-cong-cu-trang-edit': { yt: 'UJ3oZqmZ0tc', credit: 'Quanta  — DaVinci Resolve 18.5 | Timeline Edit & Trim Tools for Beginners [Roll, Ripple, Slip, and Slide]' },
    'cr-13-3-da-may-dong-bo': { yt: 'WgzUvtRgeCM', credit: 'DaVinci Dojo — How to Edit with Multiple Camera Angles in DaVinci Resolve 20 | Multicam Editing' },
    'cr-13-4-resolve-ipad-linux': { yt: 'h6gBFvbNZgE', credit: 'Justin Brown - Primal Video — DaVinci Resolve iPad Tutorial - How To Edit Video On iPad!' },

    /* ── Chương 14 — Nghệ thuật cắt dựng ── */
    'cr-14-0-slides': { yt: 'FVR8zz8ci2k', credit: 'StudioBinder — 6 Ways to Edit Any Scene — Essential Film & Video Editing Techniques Explained [Shot List Ep. 10]' },
    'cr-14-1-quy-trinh-dung': { yt: 'qKPHNWEV5_o', credit: 'StudioBinder — Post-Production Explained — Each Step of the Post-Production Process [Stages of Filmmaking, Ep 4]' },
    'cr-14-2-kieu-cat-chuyen-canh': { yt: 'OAH0MoAv2CI', credit: 'RocketJump Film School — Cuts & Transitions 101' },
    'cr-14-3-nhip-giu-chan': { yt: 'sLgHqZSe2o0', credit: 'Learn By Leo — How to edit SO good your viewers get addicted to your videos' },
    'cr-14-4-nhac-thiet-ke-am-thanh': { yt: '8LV1bqf8ZVo', credit: 'Artlist — How To SOUND DESIGN | Step by step tutorial' },
  },
};
