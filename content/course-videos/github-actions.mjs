/**
 * Curated YouTube track for the "GitHub Actions" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/github-actions.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/github-actions.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'github-actions',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — CI thật ra giải quyết vấn đề gì ── */
    'ga-0-1-may-toi-chay-duoc': { yt: 'sG3RdNW2EHo', credit: '' }, // What a CI/CD Pipeline Actually Does?
    'ga-0-2-bon-tang': { yt: 'q9AY_kZmbVs', credit: '' },          // GitHub Actions Tutorial for Beginners 2026 Episode 1: What is GitHub Actions? + First Workflow
    'ga-0-3-doc-mot-workflow': { yt: 'ljINpvCvHnQ', credit: '' },  // Introduction to GitHub Actions - Part 1 - Your First GitHub Actions Workflow
    'ga-0-4-ban-do': { yt: 'Xwpi0ITkL3U', credit: '' },            // Complete GitHub Actions Course - From BEGINNER to PRO

    /* ── Chương 1 — Tệp workflow, và những cái bẫy tới từ YAML ── */
    'ga-1-1-la-yaml': { yt: 'nK7PZOrPqkA', credit: '' },      // GitHub Actions YAML Tutorial for Beginners (Workflow Syntax Explained)
    'ga-1-2-kich-hoat': { yt: '3tC42nIui6A', credit: '' },    // Part 3 - Workflow Triggers | Different Types of Triggers in Github Actions | Scheduling Workflow
    'ga-1-3-lich-cron': { yt: 'kh7piyS2XeE', credit: '' },    // Schedule GitHub Actions Using Cron Expressions
    'ga-1-4-merge-commit': { yt: 'cCpRgmTpC2Y', credit: '' }, // GitHub # 0015 # GitHub Actions - Push and Pull Request Event
    'ga-1-5-bo-loc': { yt: 'KF5GtYZUtys', credit: '' },       // Controlling When Pipeline Workflows Run with Triggers - Github Actions

    /* ── Chương 2 — Job, runner, và những cỗ máy ngồi chờ ── */
    'ga-2-1-may-moi': { yt: 'zpDH_tfOOqc', credit: '' },       // GitHub Actions Triggers & Runners Explained | Events, Contexts & Hosted Runners
    'ga-2-2-needs': { yt: 'E2RRxcq_08E', credit: '' },         // GitHub Actions Tutorial: Advanced Concepts You Should Know
    'ga-2-3-ba-nen-tang': { yt: 'B5XzHnO_guo', credit: '' },   // GitHub Actions Matrix Strategy Explained | Multi-OS, Multi-Version Testing at Scale
    'ga-2-4-buoc-ma-thoat': { yt: 'ylEy4eLdhFs', credit: '' }, // GitHub Actions Step by Step DEMO for Beginners
    'ga-2-5-ma-tran': { yt: 'Pj23Yy6J3oA', credit: '' },       // GitHub # 0011 # GitHub Actions - Strategy Matrix (Run Job on Multiple Versions) and Fail Fast

    /* ── Chương 3 — Biểu thức, context, và lúc nào thứ gì tồn tại ── */
    'ga-3-1-ranh-gioi': { yt: 'y8eJTk4lPks', credit: '' },  // Part 5 - Understanding Context and Env variables with ${{ Expression }}
    'ga-3-2-context': { yt: 'zI7WVWe9bHM', credit: '' },    // Part 4 | Contexts | Different Contexts in Github Actions
    'ga-3-3-ep-kieu': { yt: 'Br6vyKKCwr4', credit: '' },    // Github Action If-else Statement
    'ga-3-4-ham': { yt: 'r4Z_khNOEs4', credit: '' },        // Github Actions Tutorial | Status check functions - always(), success(), failure(), cancelled()
    'ga-3-5-dieu-kien': { yt: 'swS_7tMqHE0', credit: '' },  // GitHub Actions conditionals : how "if" works

    /* ── Chương 4 — Action, và chuyện chạy mã của người khác ── */
    'ga-4-1-action-la-gi': { yt: 'JYOGmLzMbpM', credit: '' }, // Introduction to GitHub Actions - Part 4 - The GitHub Marketplace
    'ga-4-2-ghim': { yt: '8uQLyErG4EE', credit: '' },         // Ensure your GitHub Actions are pinned to a SHA
    'ga-4-3-checkout': { yt: '-61_kIikldQ', credit: '' },     // How to Use the Checkout Action in Github Actions
    'ga-4-4-setup': { yt: 'gRPIPiiTH-c', credit: '' },        // CI #5 - Why use the setup-node action?
    'ga-4-5-tu-viet': { yt: 'zQdEsIBbVjE', credit: '' },      // Create Your First Custom GitHub Action

    /* ── Chương 5 — Cache và artifact, đo thật ── */
    'ga-5-1-cache-mua-gi': { yt: 'BDQivAobxKA', credit: '' }, // Caching Dependencies to SPEED UP Workflows in GitHub Actions
    'ga-5-2-khoa-cache': { yt: 'lkn3FPRh5ps', credit: '' },   // Cache GitHub Actions Workflow Dependencies
    'ga-5-3-cache-chet': { yt: '7PVUjRXUY0o', credit: '' },   // Cache Management with GitHub actions
    'ga-5-4-artifact': { yt: 'vlySg5UPIm4', credit: '' },     // GitHub Actions - Upload Artifacts
    'ga-5-5-hoa-von': { yt: 'tw9e61Bct-E', credit: '' },      // GitHub Actions Artifacts & Caching Explained | Share Files & Optimize Builds

    /* ── Chương 6 — Bí mật, quyền, và cái token ── */
    'ga-6-1-che-bi-mat': { yt: 'TLB5MY9BBa4', credit: '' }, // GitHub Actions Tutorial | From Zero to Hero in 90 minutes (Environments, Secrets, Runners, etc)
    'ga-6-2-token': { yt: 'jEK07KPEjnY', credit: '' },      // GitHub Actions: GITHUB_TOKEN Explained | How it works, Change Permissions, Customizations
    'ga-6-3-oidc': { yt: 'Sdzd4N6L5Hg', credit: '' },       // Authenticate GitHub Actions with AWS Using OIDC — No Secrets Needed
    'ga-6-4-be-mat': { yt: '4dnniFk5i2Q', credit: '' },     // GitHub Actions Policy Update: Blocking & SHA Pinning Explained!
    'ga-6-5-soat': { yt: 'ntZwaRzhVSA', credit: '' },       // Building Scalable Enterprise Secrets Management with GitHub OIDC and HashiCorp Vault

    /* ── Chương 7 — Tốc độ, concurrency, và cái giá của nó ── */
    'ga-7-1-duong-toi-han': { yt: 'reRT-uZoJpk', credit: '' }, // Matrix Builds & Parallel Jobs in GitHub Actions | Speed Up Your CI/CD!
    'ga-7-2-concurrency': { yt: 'yAb8OSYCHTc', credit: '' },   // GitHub Actions · 7/14 · Controlling Flow with Concurrency
    'ga-7-3-phuong-sai': { yt: 'FSQDtRMtSHo', credit: '' },    // GitHub Actions Matrix Strategy: Run Jobs Faster & Smarter
    'ga-7-4-xep-hang': { yt: 'WBJkaREvTss', credit: '' },      // GitHub Actions Tutorial: Save Time with Dependency Caching
    'ga-7-5-gia-tri': { yt: 'AHIaVb22U2o', credit: '' },       // GitHub Actions Is NOT Free | Pricing Explained + Self-Hosted Runners & Jenkins Comparison

    /* ── Chương 8 — Khi CI đỏ ── */
    'ga-8-1-ma-thoat': { yt: 'Y8KdR-AyyyA', credit: '' },    // Fix "Error: Process completed with exit code" errors on GitHub Actions
    'ga-8-2-flake': { yt: 'Mhe-quHWe60', credit: '' },       // 3 Steps to Fix Flaky Tests
    'ga-8-3-tai-lap': { yt: 'OW121yjV1IM', credit: '' },     // Pascal Führlich: Debugging GitHub Actions Locally
    'ga-8-4-thu-tu-doc': { yt: 'RIeLtfGdB3w', credit: '' },  // 3 Tips for Debugging GitHub Actions
    'ga-8-5-kiem-ban-va': { yt: 'Oqq-_QZWzhg', credit: '' }, // GitHub Actions + Cypress: Debugging Test Failures in CI

    /* ── Chương 9 — Deploy từ CI, và vì sao kho này ĐÃ THÔI ── */
    'ga-9-1-push-de-deploy': { yt: 'X3F3El_yvFg', credit: '' }, // Automatic Deployment With Github Actions
    'ga-9-2-o-dau': { yt: 'NIAEruc-eP8', credit: '' },          // Complete CI/CD Pipeline Tutorial with GitHub Actions & Docker | DevOps Masterclass
    'ga-9-3-rollback': { yt: 'sVl6De94evo', credit: '' },       // Multi-stage deployments with GitHub Actions
    'ga-9-4-moi-truong': { yt: 'EOlm3ft0VPo', credit: '' },     // Deploying to Environments with GitHub Actions (#212)
    'ga-9-5-thong-bao': { yt: 'cNcorU57m94', credit: '' },      // Send Slack Notifications from GitHub Actions | Pass/Fail Alerts

    /* ── Chương 10 — Chẩn đoán bằng ca thật ── */
    'ga-10-1-build-cu': { yt: 'lEcULR30-GM', credit: '' },     // Master Full-Stack Docker & CI/CD – Build a Production-Ready Pipeline
    'ga-10-2-seed-vo': { yt: 'PX881bVAPxM', credit: '' },      // Prisma essentials: from development to production (Prisma Migrate workflow)
    'ga-10-3-checker-hong': { yt: 'm1oMj29P--Y', credit: '' }, // 3 Reasons Your CI/CD Pipeline Isn't Working As It Should...
    'ga-10-4-diet-cong': { yt: 'ZZxhzr3GGlY', credit: '' },    // The actions/checkout action fails with two possible error messages
    'ga-10-5-migration': { yt: '0Ik45qw8KhM', credit: '' },    // Let's learn Prisma ORM: migrate in detail (seeding, down migration, production)

    /* ── Chương 11 — Ôn tổng và kỳ thi cuối ── */
    'ga-11-1-chot': { yt: 'BQrohJ3PT7I', credit: '' }, // How to use GitHub Actions | GitHub for Beginners
  },
};
