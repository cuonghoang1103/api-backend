/**
 * Curated YouTube track for the "Tailwind CSS" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/tailwind-css.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/tailwind-css.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'tailwind-css',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Tailwind thật ra là cái gì ── */
    'tw-0-1-trinh-sinh': { yt: '3O_3X7InOw8', credit: 'Tailwind Labs — Just-In-Time: The Next Generation of Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/00-tailwind-la-gi/00-03-trinh-sinh-9975131a.mp4' }, defaultVideoTrack: 'VI'},  // Just-In-Time: The Next Generation of Tailwind CSS
    'tw-0-2-phan-doi': { yt: 'DenUCuq4G04', credit: 'Lukas | Web Development & Design — Tailwind CSS Tutorial for Beginners (2024) – What YOU need to know', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/00-tailwind-la-gi/00-04-phan-doi-inline-style-745a0677.mp4' }, defaultVideoTrack: 'VI'},    // Tailwind CSS Tutorial for Beginners (2024) – What YOU need to know
    'tw-0-3-bon-bo-phan': { yt: 'H_kSd4kn0E8', credit: 'PedroTech — Tailwind CSS V4 Crash Course 2025 | Become a Tailwind Pro in 1.5 Hours', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/00-tailwind-la-gi/00-05-bon-bo-phan-12ea5f50.mp4' }, defaultVideoTrack: 'VI'}, // Tailwind CSS V4 Crash Course 2025 | Become a Tailwind Pro in 1.5 Hours

    /* ── Chương 1 — Cái thang, thứ đáng học nhất ── */
    'tw-1-1-nhan-bon': { yt: 'qWVnYzG3ras', credit: 'Can Boz — #16 Tailwind CSS Margin & Padding | Spacing Utilities', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/01-cai-thang/01-01-nhan-bon-a51bdeb2.mp4' }, defaultVideoTrack: 'VI'},  // #16 Tailwind CSS Margin & Padding | Spacing Utilities
    'tw-1-2-thang-het': { yt: 'l3JtX3W5-T4', credit: 'simonswiss — Tailwind Toot — Controlling "In-Between" Spacing #tailwindcss', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/01-cai-thang/01-02-thang-het-280e12d8.mp4' }, defaultVideoTrack: 'VI'}, // Tailwind Toot — Controlling "In-Between" Spacing
    'tw-1-3-thang-mau': { yt: '7Os-Bt41yp8', credit: 'Cand Dev — How to Customize Colors in Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/01-cai-thang/01-03-thang-mau-f3c9d7c3.mp4' }, defaultVideoTrack: 'VI'}, // How to Customize Colors in Tailwind CSS
    'tw-1-4-bo-cuc': { yt: 'lTWR_DuQAvw', credit: 'AyyazTech — Tailwind CSS: A Deep Dive into Flexbox and Grid Layouts', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/01-cai-thang/01-04-bo-cuc-d1d1f98e.mp4' }, defaultVideoTrack: 'VI'},    // Tailwind CSS: A Deep Dive into Flexbox and Grid Layouts
    'tw-1-5-dinh-co': { yt: 'cq3EnXRMxxM', credit: 'JDCodebase — Tailwind Layout & Box Model – Flexbox, Grid & Spacing | Web Development Series | JDCodebase', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/01-cai-thang/01-05-dinh-co-cec95942.mp4' }, defaultVideoTrack: 'VI'},   // Tailwind Layout & Box Model – Flexbox, Grid & Spacing | JDCodebase

    /* ── Chương 2 — Biến thể, và chúng biên dịch ra cái gì ── */
    'tw-2-1-nam-hinh-dang': { yt: '5_BPDve5-3M', credit: 'Tailwind Labs — 04: Hover, Focus and Other States – Tailwind CSS v2.0: From Zero to Production', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/02-bien-the/02-01-nam-hinh-dang-e0b1351c.mp4' }, defaultVideoTrack: 'VI'},   // 04: Hover, Focus and Other States – Tailwind CSS v2.0: From Zero to Production
    'tw-2-2-group-peer': { yt: 'M0umy5gvO1w', credit: 'Can Boz — #31 Tailwind CSS Group Utilities | Style Child Elements on Hover', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/02-bien-the/02-02-group-peer-0396166b.mp4' }, defaultVideoTrack: 'VI'},      // #31 Tailwind CSS Group Utilities | Style Child Elements on Hover
    'tw-2-3-diem-ngat': { yt: '3IQdyIH878I', credit: 'Nick Vogel — Everything You Need to Know About TailwindCSS Breakpoints', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/02-bien-the/02-03-diem-ngat-42326907.mp4' }, defaultVideoTrack: 'VI'},       // Everything You Need to Know About TailwindCSS Breakpoints
    'tw-2-4-che-do-toi': { yt: 'kSWclcHpj5U', credit: 'Dom Habersack — Responsive grid layout and dark mode with Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/02-bien-the/02-04-che-do-toi-d040c6a8.mp4' }, defaultVideoTrack: 'VI'},      // Responsive grid layout and dark mode with Tailwind CSS
    'tw-2-5-bien-the-tuy-y': { yt: 'jevYcOlcUsc', credit: 'Tailwind Labs — Extending Variants – What\'s new in Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/02-bien-the/02-05-bien-the-tuy-y-b3106c20.mp4' }, defaultVideoTrack: 'VI'},  // Extending Variants – What's new in Tailwind CSS

    /* ── Chương 3 — Xung đột, chỗ mô hình rò rỉ ── */
    'tw-3-1-thu-tu-viet': { yt: '0i40IAXXYh4', credit: 'Jolly Coding — 5 Tips to Master Tailwind…', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/03-xung-dot/03-01-thu-tu-viet-29ec7165.mp4' }, defaultVideoTrack: 'VI'}, // 5 Tips to Master Tailwind…
    'tw-3-2-phep-sap': { yt: 'Wluk2d7hxG4', credit: 'Hey Delphi — CSS : See exact CSS specificity in Chrome Dev Tools?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/03-xung-dot/03-02-phep-sap-5175f17d.mp4' }, defaultVideoTrack: 'VI'},    // CSS : See exact CSS specificity in Chrome Dev Tools?
    'tw-3-3-phoi-nhiem': { yt: 'FagAbvxUkIc', credit: 'Trackunit Developers — Mastering Tailwind, CVA, and tw-merge for Optimized Components -  Code Tracks Tue 26  Sep 2023', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/03-xung-dot/03-03-phoi-nhiem-929718ba.mp4' }, defaultVideoTrack: 'VI'},  // Mastering Tailwind, CVA, and tw-merge for Optimized Components
    'tw-3-4-twmerge': { yt: 'h3s47owx8io', credit: 'webdecoded — Cn, twMerge, clsx, cva - Write Clean Tailwind Code with these utility functions', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/03-xung-dot/03-04-twmerge-31dce333.mp4' }, defaultVideoTrack: 'VI'},     // Cn, twMerge, clsx, cva - Write Clean Tailwind Code with these utility functions
    'tw-3-5-important': { yt: '4WmNmAIEYEA', credit: 'aaron decoded — Useful utility functions with tailwind, cn(), tailwind-merge, clsx', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/03-xung-dot/03-05-important-1d527e08.mp4' }, defaultVideoTrack: 'VI'},   // Useful utility functions with tailwind, cn(), tailwind-merge, clsx

    /* ── Chương 4 — Component, và chỗ tái dùng cho đúng ── */
    'tw-4-1-do-canh-lop': { yt: 'dcRenJApot0', credit: 'Tyler Potts — Tailwind CSS for Beginners: Build Websites FASTER', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/04-component/04-01-do-canh-lop-108a029b.mp4' }, defaultVideoTrack: 'VI'},  // Tailwind CSS for Beginners: Build Websites FASTER
    'tw-4-2-apply': { yt: 'fCHxFM6r9jI', credit: 'CodeWithHarry — When to use @apply and @layer directive?: Tailwind Tutorial #11', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/04-component/04-02-apply-24083880.mp4' }, defaultVideoTrack: 'VI'},        // When to use @apply and @layer directive?: Tailwind Tutorial #11
    'tw-4-3-hop-dong': { yt: 'kHQNK2jU_TQ', credit: 'Coding in Public — Class Variance Authority (CVA) Quickstart', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/04-component/04-03-hop-dong-5a002f6d.mp4' }, defaultVideoTrack: 'VI'},     // Class Variance Authority (CVA) Quickstart
    'tw-4-4-bien-the-cva': { yt: 'qGQRdCg6JRQ', credit: 'React Tips with Brooks Lybrand — Authoring Components with CVA + tailwindcss — Basic Buttons (1 / 4)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/04-component/04-04-bien-the-cva-cb586eaf.mp4' }, defaultVideoTrack: 'VI'}, // Authoring Components with CVA + tailwindcss — Basic Buttons (1 / 4)
    'tw-4-5-primitives': { yt: 'B4aT_UO2NLU', credit: 'React Tips with Brooks Lybrand — Authoring Components with CVA + tailwindcss — Compound Variants (2 / 4)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/04-component/04-05-primitives-d2f4af33.mp4' }, defaultVideoTrack: 'VI'},   // Authoring Components with CVA + tailwindcss — Compound Variants (2 / 4)

    /* ── Chương 5 — Mở rộng config ── */
    'tw-5-1-extend': { yt: 'kB35zJMMIFs', credit: 'Imran Sayed - Codeytek Academy — #27 The Complete Guide To Customizing A Tailwind CSS theme | Nextjs | Configuration - Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/05-mo-rong-cau-hinh/05-01-extend-09e418b3.mp4' }, defaultVideoTrack: 'VI'},     // #27 The Complete Guide To Customizing A Tailwind CSS theme | Nextjs | Configuration
    'tw-5-2-soat-config': { yt: 'v9vcWt5us-Y', credit: 'this.stephie — Customize tailwind.css theme', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/05-mo-rong-cau-hinh/05-02-soat-config-96b011de.mp4' }, defaultVideoTrack: 'VI'},// Customize tailwind.css theme
    'tw-5-3-dat-ten': { yt: 'zGgUR2P7U3I', credit: 'AyyazTech — How to add custom colors in Tailwind CSS?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/05-mo-rong-cau-hinh/05-03-dat-ten-96cdffe9.mp4' }, defaultVideoTrack: 'VI'},    // How to add custom colors in Tailwind CSS?
    'tw-5-4-hoat-anh': { yt: 'phWZ_f-Qndw', credit: 'AyyazTech — Tailwind CSS Animations  From Beginner to Pro', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/05-mo-rong-cau-hinh/05-04-hoat-anh-f6e073cc.mp4' }, defaultVideoTrack: 'VI'},   // Tailwind CSS Animations From Beginner to Pro
    'tw-5-5-plugin': { yt: 'qg4MbF9SApk', credit: 'Imran Sayed - Codeytek Academy — #7 Customize the Tailwind | Theme Configuration - Tailwind CSS | Nav Nextjs | Next.js tutorial 2021', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/05-mo-rong-cau-hinh/05-05-plugin-82fe2fcc.mp4' }, defaultVideoTrack: 'VI'},     // #7 Customize the Tailwind | Theme Configuration - Tailwind CSS | Nav Nextjs

    /* ── Chương 6 — Biến CSS làm cơ chế chủ đề ── */
    'tw-6-1-mot-lop': { yt: 'MAtaT8BZEAo', credit: 'Tailwind Labs — Theming Tailwind with CSS Variables', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/06-bien-css-theme/06-01-mot-lop-9966e3ea.mp4' }, defaultVideoTrack: 'VI'},       // Theming Tailwind with CSS Variables
    'tw-6-2-bay-alpha': { yt: 'gfYJvTBu_sk', credit: 'Thirus — Add Custom Colors in Tailwind CSS v4', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/06-bien-css-theme/06-02-bay-alpha-7164f23a.mp4' }, defaultVideoTrack: 'VI'},     // Add Custom Colors in Tailwind CSS v4
    'tw-6-3-cau-truc': { yt: 'AJL1KbKrtAA', credit: 'Muslim Helalee — Variables - Tailwind CSS for Devs in a Hurry', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/06-bien-css-theme/06-03-cau-truc-999cfc47.mp4' }, defaultVideoTrack: 'VI'},      // Variables - Tailwind CSS for Devs in a Hurry
    'tw-6-4-khi-nao-khong': { yt: 'TavBrPEqkbY', credit: 'Skies Dev — How to Create Themes with Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/06-bien-css-theme/06-04-khi-nao-khong-898cec0e.mp4' }, defaultVideoTrack: 'VI'}, // How to Create Themes with Tailwind CSS
    'tw-6-5-di-tru': { yt: 'TFfWsOa5GfE', credit: 'Jamie Barton — Dynamic Theme Switching with CSS Variables and Tailwind', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/06-bien-css-theme/06-05-di-tru-cac8a485.mp4' }, defaultVideoTrack: 'VI'},        // Dynamic Theme Switching with CSS Variables and Tailwind

    /* ── Chương 7 — @layer, và cơ chế thật sự của nó ── */
    'tw-7-1-strip-layer': { yt: '_wcuT6FPsxU', credit: 'AyyazTech — How to add @layer directive in Tailwind CSS?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/07-layer/07-01-strip-layer-7befc1c3.mp4' }, defaultVideoTrack: 'VI'}, // How to add @layer directive in Tailwind CSS?
    'tw-7-2-phan-loai': { yt: 'fCHxFM6r9jI', credit: 'CodeWithHarry — When to use @apply and @layer directive?: Tailwind Tutorial #11', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/07-layer/07-02-phan-loai-dc8458be.mp4' }, defaultVideoTrack: 'VI'},   // When to use @apply and @layer directive?: Tailwind Tutorial #11
    'tw-7-3-ba-dai': { yt: 'F0k0Nhmjx8w', credit: 'Sanan Ali — Styling Base Elements in TailwindCSS v4   Layers in TailwindCSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/07-layer/07-03-ba-dai-06dcfe4a.mp4' }, defaultVideoTrack: 'VI'},      // Styling Base Elements in TailwindCSS v4 Layers in TailwindCSS
    'tw-7-4-preflight': { yt: 'tV84IS9505c', credit: 'Code With Sasha — Tailwind CSS Preflight (Default Styles)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/07-layer/07-04-preflight-371f80bf.mp4' }, defaultVideoTrack: 'VI'},   // Tailwind CSS Preflight (Default Styles)
    'tw-7-5-doc-dau-ra': { yt: 'uL1d3D5gc2w', credit: 'Sanan Ali — How to use @apply and @utility directives in TailwindCSS v4', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/07-layer/07-05-doc-dau-ra-ea80fb2d.mp4' }, defaultVideoTrack: 'VI'},  // How to use @apply and @utility directives in TailwindCSS v4

    /* ── Chương 8 — Kích thước đầu ra, đo thật ── */
    'tw-8-1-can-no': { yt: 'p1iv2-7uNDk', credit: 'Federico Tartarini — Tailwind CSS optimize bundle size', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/08-kich-thuoc-dau-ra/08-01-can-no-6e6a3fc6.mp4' }, defaultVideoTrack: 'VI'},    // Tailwind CSS optimize bundle size
    'tw-8-2-gzip': { yt: 'bhoDwo24K5Q', credit: 'Adam Wathan — Designing with Tailwind CSS: Optimizing for Production with Purgecss', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/08-kich-thuoc-dau-ra/08-02-gzip-8162d6a5.mp4' }, defaultVideoTrack: 'VI'},      // Designing with Tailwind CSS: Optimizing for Production with Purgecss
    'tw-8-3-tap-trung': { yt: 'l6_fC_Xg9cI', credit: 'Code With Dary — How To Purge Your Tailwind File | Tailwind CSS Tutorial | Tailwind Tutorial | Learn Tailwind 2 CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/08-kich-thuoc-dau-ra/08-03-tap-trung-a21e9e5f.mp4' }, defaultVideoTrack: 'VI'}, // How To Purge Your Tailwind File | Tailwind CSS Tutorial
    'tw-8-4-glob-hong': { yt: 'VSl0xEgoTkY', credit: 'Nick Janetakis — Tailwind\'s JIT Compiler Makes Tailwind + Webpack Faster in Development', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/08-kich-thuoc-dau-ra/08-04-glob-hong-54fb7e76.mp4' }, defaultVideoTrack: 'VI'}, // Tailwind's JIT Compiler Makes Tailwind + Webpack Faster in Development
    'tw-8-5-thu-tu': { yt: '8sViNkNm2Ao', credit: 'Tailwind Labs — Advanced PurgeCSS Features – What\'s new in Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/08-kich-thuoc-dau-ra/08-05-thu-tu-e6c7a160.mp4' }, defaultVideoTrack: 'VI'},    // Advanced PurgeCSS Features – What's new in Tailwind CSS

    /* ── Chương 9 — Khả năng tiếp cận, đo thật ── */
    'tw-9-1-tuong-phan': { yt: 'D8TPUqbhRmA', credit: 'The Accessibility Guy — How to test for Color Contrast | TPGI & WebAIM | WCAG', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/09-tiep-can/09-01-tuong-phan-a9ddec45.mp4' }, defaultVideoTrack: 'VI'},  // How to test for Color Contrast | TPGI & WebAIM | WCAG
    'tw-9-2-nen-toi': { yt: '34MjM67qOPM', credit: 'Accessible Web — Beyond Dark Mode: Comprehensive Color Contrast Strategies for Accessibility | Accessible Web Webinar', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/09-tiep-can/09-02-nen-toi-d274a1a1.mp4' }, defaultVideoTrack: 'VI'},     // Beyond Dark Mode: Comprehensive Color Contrast Strategies for Accessibility
    'tw-9-3-lop-ma': { yt: '0TvTblD1DWo', credit: 'WP Accessibility Day — Understanding Color and Contrast Requirements in WCAG 2', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/09-tiep-can/09-03-lop-ma-e0b657b4.mp4' }, defaultVideoTrack: 'VI'},      // Understanding Color and Contrast Requirements in WCAG 2
    'tw-9-4-focus': { yt: 'OaNNOoT5Z9k', credit: 'Envato Tuts+ — Better Focus Styles with CSS Pseudo-Class :focus-visible', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/09-tiep-can/09-04-focus-72c35d72.mp4' }, defaultVideoTrack: 'VI'},       // Better Focus Styles with CSS Pseudo-Class :focus-visible
    'tw-9-5-chuyen-dong': { yt: 'r6W1hf7xcrs', credit: 'Pope Tech — Designing accessible animation and movement on your website', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/09-tiep-can/09-05-chuyen-dong-8f986ab2.mp4' }, defaultVideoTrack: 'VI'}, // Designing accessible animation and movement on your website

    /* ── Chương 10 — Sách công thức chẩn đoán ── */
    'tw-10-1-cay': { yt: '2ThuIqMMJJc', credit: 'Kevin Powell — CSS Debugging Tips', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/10-chan-doan/10-01-cay-1f4104b1.mp4' }, defaultVideoTrack: 'VI'}, // CSS Debugging Tips
    'tw-10-2-q1': { yt: 'lYWQdxHGnkc', credit: 'Thirus — Install & Explore JIT Compiler for Tailwind CSS in a simple project', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/10-chan-doan/10-02-q1-f96c1f5c.mp4' }, defaultVideoTrack: 'VI'},  // Install & Explore JIT Compiler for Tailwind CSS in a simple project
    'tw-10-3-q2': { yt: 'iuZx0kHS0Xs', credit: 'Chrome for Developers — Discover CSS issues with DevTools #DevToolsTips', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/10-chan-doan/10-03-q2-1b2bad4a.mp4' }, defaultVideoTrack: 'VI'},  // Discover CSS issues with DevTools #DevToolsTips
    'tw-10-4-q34': { yt: '93t-h4Fpowk', credit: 'Steve Harrison — Viewing CSS specificity in DevTools (new in Chrome 115!)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/10-chan-doan/10-04-q34-a0a58a5c.mp4' }, defaultVideoTrack: 'VI'}, // Viewing CSS specificity in DevTools (new in Chrome 115!)
    'tw-10-5-ai': { yt: 'ndeClnyHSo8', credit: 'Kevin Powell — Debugging CSS, no extensions required - Using your devtools', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/10-chan-doan/10-05-ai-b9f78061.mp4' }, defaultVideoTrack: 'VI'},  // Debugging CSS, no extensions required - Using your devtools

    /* ── Chương 11 — Cái sống sót qua đo đạc ── */
    'tw-11-1-song-qua': { yt: '9I3JQ1q4IMk', credit: 'Coder Coder — Tailwind CSS v4 for Beginners | Full Course 2026', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/11-song-qua-do-luong/11-01-song-qua-8debb390.mp4' }, defaultVideoTrack: 'VI'}, // Tailwind CSS v4 for Beginners | Full Course 2026
    'tw-0-0-start-here-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/00-tailwind-la-gi/00-01-tailwind-la-gi-dcca7564.mp4' }, defaultVideoTrack: 'VI'},
    'tw-0-0-start-here-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tailwind-css/00-tailwind-la-gi/00-02-can-biet-gi-truoc-e6257398.mp4' }, defaultVideoTrack: 'VI'},
  },
};
