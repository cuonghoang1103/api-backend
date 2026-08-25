/**
 * Curated YouTube track for the "Object Storage (Cloudflare R2)" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/object-storage.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/object-storage.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'object-storage',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Object storage thật ra là cái gì ── */
    'os-0-1-vs-fs': { yt: 'kmU7ik0oGFA', credit: '' }, // Is Cloudflare R2 The Future of Data Storage?
    'os-0-2-model': { yt: 'TIp5sUZO4Uo', credit: '' }, // Getting started with R2

    /* ── Chương 1 — API S3 ── */
    'os-1-1-client': { yt: 'F6LdiDzitFo', credit: '' },    // Using presigned urls in Javascript/Nodejs AWS SDK V3 with Storj
    'os-1-2-ops': { yt: '1DUi04zgIXM', credit: '' },       // AWS S3 PutObject API Walkthrough with NodeJS
    'os-1-3-multipart': { yt: '2Jq0UeqB4nw', credit: '' }, // AWS S3 CompleteMultipartUpload API Walkthrough with NodeJS

    /* ── Chương 2 — Đặc thù Cloudflare R2 ── */
    'os-2-1-egress': { yt: '2qq94qs1ZmM', credit: '' }, // Cloudflare R2: Free S3 compatible object storage solution with $0 egress fees
    'os-2-2-quirks': { yt: 'ohfg-lCt6hc', credit: '' }, // R2 - S3 API compatibility
    'os-2-3-keys': { yt: 'R-rTiIC6p3o', credit: '' },   // How to Upload Files to Cloudflare R2 | Cloudflare R2 vs. Amazon S3 vs. DigitalOcean Spaces

    /* ── Chương 3 — URL và quyền truy cập ── */
    'os-3-1-three-urls': { yt: 'buvsmqjRLrU', credit: '' }, // R2 Public Buckets
    'os-3-2-cache': { yt: 'ZvczexjXt7E', credit: '' },      // Cloudflare R2 Object Storage Tutorial: Create Bucket & Custom Domain Setup
    'os-3-3-signed': { yt: 'V2arOZ72d6M', credit: '' },     // Amazon S3 Presigned URLs Uploads and Downloads Tutorial

    /* ── Chương 4 — An toàn của presigned upload ── */
    'os-4-1-vi-sao': { yt: 'awxLumuVR9I', credit: '' },    // How to Securely Upload Files to AWS S3 with Presigned URL | Node JS presigned url
    'os-4-2-sigv4-bug': { yt: 'UGwY2iT4F80', credit: '' }, // How to generate a time limited presigned S3 URL using the nodejs AWS SDK?

    /* ── Chương 5 — CORS cho upload từ trình duyệt ── */
    'os-5-1-vi-sao-cors': { yt: 'Kj4FvSI3CNU', credit: '' },  // S3 CORS - AWS SCS-C03
    'os-5-2-preflight': { yt: 'MrLVvrHlrnA', credit: '' },    // How do I configure CORS in Amazon S3 and confirm the CORS rules using cURL?
    'os-5-3-common-bugs': { yt: 'dRHqGTOI3Ik', credit: '' },  // How to solve S3 CORS file error with "Access-Control-Allow-Origin" header block

    /* ── Chương 6 — Luật vòng đời và dọn dẹp ── */
    'os-6-1-abort': { yt: 'mCbwZQfgMaA', credit: '' },      // AWS S3 Lifecycle Rules Tutorial
    'os-6-2-expiration': { yt: 'WiIow2AECho', credit: '' }, // How to set up S3 Lifecycle Rules to save on S3 costs
    'os-6-3-orphans': { yt: 'IVzf4gNIoTQ', credit: '' },    // Amazon S3 Data Lifecycle Management

    /* ── Chương 7 — Quản lý chi phí ── */
    'os-7-1-drivers': { yt: 'LVAchRqGzLw', credit: '' },              // The S3 Optimization Playbook | The Keys to AWS Optimization | S10 E13
    'os-7-2-thumbnail-explosion': { yt: 'Nj0Htnsbq1w', credit: '' },  // Amazon (AWS) S3 Storage Classes Tutorial | Lifecycle Rule | Intelligent Tiering | Glacier Storage
    'os-7-3-budgets': { yt: 'yGNXn7jOytA', credit: '' },              // AWS re:Invent 2021 - Amazon S3 Lifecycle best practices to optimize your storage spend

    /* ── Chương 8 — Di trú S3 → R2 ── */
    'os-8-1-migrator': { yt: 'O9Wlb6GX5d8', credit: '' }, // Upload Large Files to R2 Object Storage using Actors
    'os-8-2-sipper': { yt: '6VHc41idHZs', credit: '' },   // The Ultimate S3 & Nodejs Guide | Bucket & Objects | Put Object, Pre-signed URL, Multipart Upload, etc
    'os-8-3-verify': { yt: 'LP_KT6U73M0', credit: '' },   // Ten Minute Tutorial for Research: Amazon S3 Storage Classes & Lifecycle Policies

    /* ── Chương 9 — Sách công thức chẩn đoán ── */
    'os-9-1-common': { yt: 'rn4qLXhMesg', credit: '' },  // Why am I getting an HTTP 403 Forbidden error when I try to upload files using the Amazon S3 console?
    'os-9-2-latency': { yt: 'QU38nUVAuhE', credit: '' }, // Solving the 403 Forbidden Error on PUT Requests for S3 Image Uploads Using Lambda

    /* ── Chương 10 — Cái sống sót qua đo đạc ── */
    'os-10-1-song-qua': { yt: 'JXnMXgCUpuw', credit: '' }, // Amazon S3 Lifecycle Policies: Save Costs on Storage | Amazon S3 Lifecycle for Beginners
  },
};
