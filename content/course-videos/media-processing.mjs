/**
 * Curated YouTube track for the "Media Processing (Sharp + FFmpeg)" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/media-processing.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/media-processing.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'media-processing',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Vì sao xử lý media quan trọng ── */
    'mp-0-1-formats': { yt: 'JMrVC53-q1g', credit: 'Explainer Chris — Every Image Format Explained in 9 Minutes' }, // Every Image Format Explained in 9 Minutes
    'mp-0-2-where': { yt: 'zLEtzg04HUI', credit: 'Codeminer42 — Background Jobs in NodeJS with BullMQ. by Douglas Marques' },   // Background Jobs in NodeJS with BullMQ. by Douglas Marques

    /* ── Chương 1 — Nền tảng Sharp ── */
    'mp-1-1-pipeline': { yt: 'UoNVywzzINY', credit: 'Kritika & Pranav | Programmer Couple — Process images the right way with SharpJS | Image cropping, reducing size and more...' }, // Process images the right way with SharpJS | Image cropping, reducing size and more...
    'mp-1-2-metadata': { yt: 'bWZjLkzHvC8', credit: 'SoftApp Technologies — Image Processing in Node js with Sharp' }, // Image Processing in Node js with Sharp
    'mp-1-3-resize': { yt: 'GCkQRMMbLn8', credit: 'Mitter - Your Tech Mate — Resize Images Using Sharp | JavaScript | Node Js' },   // Resize Images Using Sharp | JavaScript | Node Js

    /* ── Chương 2 — Sharp trên production ── */
    'mp-2-1-svg': { yt: 'hT1764wkBdk', credit: 'Tejas Kumar — The Best Image Format, from AVIF to WebP to JPG with Core Web Vitals and Progressive Enhancement' },      // The Best Image Format, from AVIF to WebP to JPG with Core Web Vitals and Progressive Enhancement
    'mp-2-2-animated': { yt: 'Ti5RcuAFoPQ', credit: 'linkarzu — PNG, AVIF or WEBP? Which image format should I use and why?' }, // PNG, AVIF or WEBP? Which image format should I use and why?
    'mp-2-3-tuning': { yt: '9bRh9EW-xJE', credit: 'Neural Nexus — JPEG vs PNG vs WebP vs AVIF: Which One Actually Wins?' },   // JPEG vs PNG vs WebP vs AVIF: Which One Actually Wins?

    /* ── Chương 3 — FFmpeg gọi từ Node ── */
    'mp-3-1-exec': { yt: 'I_4MJvHnw8A', credit: 'Coding Shiksha — FFMPEG Tutorial | Video Converter App in Node.js Fluent FFMPEG | Javascript FFMPEG Tutorial' },       // FFMPEG Tutorial | Video Converter App in Node.js Fluent FFMPEG | Javascript FFMPEG Tutorial
    'mp-3-2-thumbnails': { yt: 'FPp6Xox6-Kk', credit: 'Coding Shiksha — Node.js FFMPEG Project to Generate Video Thumbnail as PNG Image at Certain Time in Express' }, // Node.js FFMPEG Project to Generate Video Thumbnail as PNG Image at Certain Time in Express
    'mp-3-3-transcode': { yt: 'Sl2AY9B9NP4', credit: 'freemediatools — FFMPEG Command to Convert MP4 to H 264 with libx264, CRF Quality Control, AAC Audio Encoding in CMD' },  // FFMPEG Command to Convert MP4 to H.264 with libx264, CRF Quality Control, AAC Audio Encoding in CMD

    /* ── Chương 4 — Âm thanh: giải mã, chuẩn hoá, chảy dòng ── */
    'mp-4-1-pipes': { yt: 'iMfTfh--0nU', credit: 'Sound Peaks — How to edit \ normalize \ replace audio in a video without re-encoding the video' },    // How to edit / normalize / replace audio in a video without re-encoding the video
    'mp-4-2-loudnorm': { yt: 'AQ16L9Sd0oc', credit: 'NapoleonWils0n — How to Get Perfect Audio Levels: Using the FFmpeg Loudnorm Filter' }, // How to Get Perfect Audio Levels: Using the FFmpeg Loudnorm Filter
    'mp-4-3-formats': { yt: 'FpWy0CYWH5k', credit: 'ZAchary Indy — Convert Audio like a PRO: FLAC to MP3 and AAC in High Quality format with ffmpeg' },  // Convert Audio like a PRO: FLAC to MP3 and AAC in High Quality format with ffmpeg

    /* ── Chương 5 — Đường ống upload ── */
    'mp-5-1-one-door': { yt: '2kKvI3HlpZU', credit: 'John Ahn — Generate Video Thumbnails and Metadata with Node JS, React JS Hook' }, // Generate Video Thumbnails and Metadata with Node JS, React JS Hook
    'mp-5-2-keys': { yt: '0Z4D1_v9Bo0', credit: 'Founder at work — How to batch process video conversions using FFMPEG with Node.js' },     // How to batch process video conversions using FFMPEG with Node.js
    'mp-5-3-jobs': { yt: 'zpkj9Z-JWKQ', credit: 'Raj Kapadia — How to Handle Heavy Background Jobs in Next.js using BullMQ & Redis' },     // How to Handle Heavy Background Jobs in Next.js using BullMQ & Redis

    /* ── Chương 6 — Media thật sự tốn cái gì ── */
    'mp-6-1-cpu': { yt: 'Ww1sgWv0Mhk', credit: 'Coding Shiksha — Node.js Fluent-FFMPEG Example to Change Video Resolution & Compress to Smaller Size in Command Line' },     // Node.js Fluent-FFMPEG Example to Change Video Resolution & Compress to Smaller Size in Command Line
    'mp-6-2-measure': { yt: 'ULZxAghhI_I', credit: 'LearnCode lightly — FFmpeg command to change bit rate of video,audio  easily.' }, // FFmpeg command to change bit rate of video, audio easily

    /* ── Chương 7 — Chảy dòng: HLS và giao thích ứng ── */
    'mp-7-1-progressive': { yt: 'lVPylWzxwgs', credit: 'Tech with Monir — HTTP Live Streaming (HLS) Explained with an MP4 Streaming' }, // HTTP Live Streaming (HLS) Explained with an MP4 Streaming
    'mp-7-2-hls': { yt: 'x-FhiTS7Y-4', credit: 'freemediatools — FFMPEG Command to Convert MP4 to HLS Streaming Format with .m3u8 Playlist and .ts Video Segments' },         // FFMPEG Command to Convert MP4 to HLS Streaming Format with .m3u8 Playlist and .ts Video Segments

    /* ── Chương 8 — Media trực tiếp và thời gian thực ── */
    'mp-8-1-latency': { yt: 'ziDvFQ9BKk8', credit: 'Wowza — WebRTC vs. HLS: What\'s the Difference' }, // Video Streaming Protocols Explained | HLS, DASH, WebRTC

    /* ── Chương 9 — Sách công thức chẩn đoán ── */
    'mp-9-1-symptoms': { yt: 'XSWkF8heIrE', credit: 'Coding Shiksha — FFMPEG Tutorial | Generating Thumbnail of Video on Command Line' }, // FFMPEG Tutorial | Generating Thumbnail of Video on Command Line
    'mp-9-2-silent': { yt: 'Kb2JEYFyvqs', credit: 'FFmpeg Tutorials — (FFMPEG) HOW TO NORMALIZE AUDIO?' },   // (FFMPEG) HOW TO NORMALIZE AUDIO?

    /* ── Chương 10 — Cái sống sót qua đo đạc ── */
    'mp-10-1-wrap': { yt: '2uqdstsb8WI', credit: 'Coding With Sam — Node.js Image Optimization with sharp in 5 minutes!' }, // Node.js Image Optimization with sharp in 5 minutes!
  },
};
