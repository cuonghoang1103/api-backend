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
    'tw-0-1-trinh-sinh': { yt: '3O_3X7InOw8', credit: '' },  // Just-In-Time: The Next Generation of Tailwind CSS
    'tw-0-2-phan-doi': { yt: 'DenUCuq4G04', credit: '' },    // Tailwind CSS Tutorial for Beginners (2024) – What YOU need to know
    'tw-0-3-bon-bo-phan': { yt: 'H_kSd4kn0E8', credit: '' }, // Tailwind CSS V4 Crash Course 2025 | Become a Tailwind Pro in 1.5 Hours

    /* ── Chương 1 — Cái thang, thứ đáng học nhất ── */
    'tw-1-1-nhan-bon': { yt: 'qWVnYzG3ras', credit: '' },  // #16 Tailwind CSS Margin & Padding | Spacing Utilities
    'tw-1-2-thang-het': { yt: 'l3JtX3W5-T4', credit: '' }, // Tailwind Toot — Controlling "In-Between" Spacing
    'tw-1-3-thang-mau': { yt: '7Os-Bt41yp8', credit: '' }, // How to Customize Colors in Tailwind CSS
    'tw-1-4-bo-cuc': { yt: 'lTWR_DuQAvw', credit: '' },    // Tailwind CSS: A Deep Dive into Flexbox and Grid Layouts
    'tw-1-5-dinh-co': { yt: 'cq3EnXRMxxM', credit: '' },   // Tailwind Layout & Box Model – Flexbox, Grid & Spacing | JDCodebase

    /* ── Chương 2 — Biến thể, và chúng biên dịch ra cái gì ── */
    'tw-2-1-nam-hinh-dang': { yt: '5_BPDve5-3M', credit: '' },   // 04: Hover, Focus and Other States – Tailwind CSS v2.0: From Zero to Production
    'tw-2-2-group-peer': { yt: 'M0umy5gvO1w', credit: '' },      // #31 Tailwind CSS Group Utilities | Style Child Elements on Hover
    'tw-2-3-diem-ngat': { yt: '3IQdyIH878I', credit: '' },       // Everything You Need to Know About TailwindCSS Breakpoints
    'tw-2-4-che-do-toi': { yt: 'kSWclcHpj5U', credit: '' },      // Responsive grid layout and dark mode with Tailwind CSS
    'tw-2-5-bien-the-tuy-y': { yt: 'jevYcOlcUsc', credit: '' },  // Extending Variants – What's new in Tailwind CSS

    /* ── Chương 3 — Xung đột, chỗ mô hình rò rỉ ── */
    'tw-3-1-thu-tu-viet': { yt: '0i40IAXXYh4', credit: '' }, // 5 Tips to Master Tailwind…
    'tw-3-2-phep-sap': { yt: 'Wluk2d7hxG4', credit: '' },    // CSS : See exact CSS specificity in Chrome Dev Tools?
    'tw-3-3-phoi-nhiem': { yt: 'FagAbvxUkIc', credit: '' },  // Mastering Tailwind, CVA, and tw-merge for Optimized Components
    'tw-3-4-twmerge': { yt: 'h3s47owx8io', credit: '' },     // Cn, twMerge, clsx, cva - Write Clean Tailwind Code with these utility functions
    'tw-3-5-important': { yt: '4WmNmAIEYEA', credit: '' },   // Useful utility functions with tailwind, cn(), tailwind-merge, clsx

    /* ── Chương 4 — Component, và chỗ tái dùng cho đúng ── */
    'tw-4-1-do-canh-lop': { yt: 'dcRenJApot0', credit: '' },  // Tailwind CSS for Beginners: Build Websites FASTER
    'tw-4-2-apply': { yt: 'fCHxFM6r9jI', credit: '' },        // When to use @apply and @layer directive?: Tailwind Tutorial #11
    'tw-4-3-hop-dong': { yt: 'kHQNK2jU_TQ', credit: '' },     // Class Variance Authority (CVA) Quickstart
    'tw-4-4-bien-the-cva': { yt: 'qGQRdCg6JRQ', credit: '' }, // Authoring Components with CVA + tailwindcss — Basic Buttons (1 / 4)
    'tw-4-5-primitives': { yt: 'B4aT_UO2NLU', credit: '' },   // Authoring Components with CVA + tailwindcss — Compound Variants (2 / 4)

    /* ── Chương 5 — Mở rộng config ── */
    'tw-5-1-extend': { yt: 'kB35zJMMIFs', credit: '' },     // #27 The Complete Guide To Customizing A Tailwind CSS theme | Nextjs | Configuration
    'tw-5-2-soat-config': { yt: 'v9vcWt5us-Y', credit: '' },// Customize tailwind.css theme
    'tw-5-3-dat-ten': { yt: 'zGgUR2P7U3I', credit: '' },    // How to add custom colors in Tailwind CSS?
    'tw-5-4-hoat-anh': { yt: 'phWZ_f-Qndw', credit: '' },   // Tailwind CSS Animations From Beginner to Pro
    'tw-5-5-plugin': { yt: 'qg4MbF9SApk', credit: '' },     // #7 Customize the Tailwind | Theme Configuration - Tailwind CSS | Nav Nextjs

    /* ── Chương 6 — Biến CSS làm cơ chế chủ đề ── */
    'tw-6-1-mot-lop': { yt: 'MAtaT8BZEAo', credit: '' },       // Theming Tailwind with CSS Variables
    'tw-6-2-bay-alpha': { yt: 'gfYJvTBu_sk', credit: '' },     // Add Custom Colors in Tailwind CSS v4
    'tw-6-3-cau-truc': { yt: 'AJL1KbKrtAA', credit: '' },      // Variables - Tailwind CSS for Devs in a Hurry
    'tw-6-4-khi-nao-khong': { yt: 'TavBrPEqkbY', credit: '' }, // How to Create Themes with Tailwind CSS
    'tw-6-5-di-tru': { yt: 'TFfWsOa5GfE', credit: '' },        // Dynamic Theme Switching with CSS Variables and Tailwind

    /* ── Chương 7 — @layer, và cơ chế thật sự của nó ── */
    'tw-7-1-strip-layer': { yt: '_wcuT6FPsxU', credit: '' }, // How to add @layer directive in Tailwind CSS?
    'tw-7-2-phan-loai': { yt: 'JkWS-S51s-U', credit: '' },   // TailwindCSS - How To Use @apply & @layer directives
    'tw-7-3-ba-dai': { yt: 'F0k0Nhmjx8w', credit: '' },      // Styling Base Elements in TailwindCSS v4 Layers in TailwindCSS
    'tw-7-4-preflight': { yt: 'YpJHtFghF78', credit: '' },   // How Can I Use Tailwind CSS to Create Base Styles and Component Styling?
    'tw-7-5-doc-dau-ra': { yt: 'uL1d3D5gc2w', credit: '' },  // How to use @apply and @utility directives in TailwindCSS v4

    /* ── Chương 8 — Kích thước đầu ra, đo thật ── */
    'tw-8-1-can-no': { yt: 'p1iv2-7uNDk', credit: '' },    // Tailwind CSS optimize bundle size
    'tw-8-2-gzip': { yt: 'bhoDwo24K5Q', credit: '' },      // Designing with Tailwind CSS: Optimizing for Production with Purgecss
    'tw-8-3-tap-trung': { yt: 'l6_fC_Xg9cI', credit: '' }, // How To Purge Your Tailwind File | Tailwind CSS Tutorial
    'tw-8-4-glob-hong': { yt: 'VSl0xEgoTkY', credit: '' }, // Tailwind's JIT Compiler Makes Tailwind + Webpack Faster in Development
    'tw-8-5-thu-tu': { yt: '8sViNkNm2Ao', credit: '' },    // Advanced PurgeCSS Features – What's new in Tailwind CSS

    /* ── Chương 9 — Khả năng tiếp cận, đo thật ── */
    'tw-9-1-tuong-phan': { yt: 'D8TPUqbhRmA', credit: '' },  // How to test for Color Contrast | TPGI & WebAIM | WCAG
    'tw-9-2-nen-toi': { yt: '34MjM67qOPM', credit: '' },     // Beyond Dark Mode: Comprehensive Color Contrast Strategies for Accessibility
    'tw-9-3-lop-ma': { yt: '0TvTblD1DWo', credit: '' },      // Understanding Color and Contrast Requirements in WCAG 2
    'tw-9-4-focus': { yt: 'OaNNOoT5Z9k', credit: '' },       // Better Focus Styles with CSS Pseudo-Class :focus-visible
    'tw-9-5-chuyen-dong': { yt: 'r6W1hf7xcrs', credit: '' }, // Designing accessible animation and movement on your website

    /* ── Chương 10 — Sách công thức chẩn đoán ── */
    'tw-10-1-cay': { yt: '2ThuIqMMJJc', credit: '' }, // CSS Debugging Tips
    'tw-10-2-q1': { yt: 'lYWQdxHGnkc', credit: '' },  // Install & Explore JIT Compiler for Tailwind CSS in a simple project
    'tw-10-3-q2': { yt: 'iuZx0kHS0Xs', credit: '' },  // Discover CSS issues with DevTools #DevToolsTips
    'tw-10-4-q34': { yt: '93t-h4Fpowk', credit: '' }, // Viewing CSS specificity in DevTools (new in Chrome 115!)
    'tw-10-5-ai': { yt: 'ndeClnyHSo8', credit: '' },  // Debugging CSS, no extensions required - Using your devtools

    /* ── Chương 11 — Cái sống sót qua đo đạc ── */
    'tw-11-1-song-qua': { yt: '9I3JQ1q4IMk', credit: '' }, // Tailwind CSS v4 for Beginners | Full Course 2026
  },
};
