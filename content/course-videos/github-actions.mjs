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
    'ga-0-1-may-toi-chay-duoc': { yt: 'sG3RdNW2EHo', credit: 'LearnThatStack — What a CI/CD Pipeline Actually Does?' }, // What a CI/CD Pipeline Actually Does?
    'ga-0-2-bon-tang': { yt: 'q9AY_kZmbVs', credit: 'The Journey of DevOps — GitHub Actions Tutorial for Beginners 2026 🔥 Episode 1: What is GitHub Actions? + First Workflow' },          // GitHub Actions Tutorial for Beginners 2026 Episode 1: What is GitHub Actions? + First Workflow
    'ga-0-3-doc-mot-workflow': { yt: 'ljINpvCvHnQ', credit: 'Mickey Gousset — Introduction to GitHub Actions - Part 1 - Your First GitHub Actions Workflow' },  // Introduction to GitHub Actions - Part 1 - Your First GitHub Actions Workflow
    'ga-0-4-ban-do': { yt: 'Xwpi0ITkL3U', credit: 'DevOps Directive — Complete GitHub Actions Course - From BEGINNER to PRO' },            // Complete GitHub Actions Course - From BEGINNER to PRO

    /* ── Chương 1 — Tệp workflow, và những cái bẫy tới từ YAML ── */
    'ga-1-1-la-yaml': { yt: 'nK7PZOrPqkA', credit: 'MLTut — GitHub Actions YAML Tutorial for Beginners (Workflow Syntax Explained)' },      // GitHub Actions YAML Tutorial for Beginners (Workflow Syntax Explained)
    'ga-1-2-kich-hoat': { yt: '3tC42nIui6A', credit: 'Testing Mini Bytes — Part 3 - Workflow Triggers | Different Types of Triggers in Github Actions | Scheduling Workflow |' },    // Part 3 - Workflow Triggers | Different Types of Triggers in Github Actions | Scheduling Workflow
    'ga-1-3-lich-cron': { yt: 'kh7piyS2XeE', credit: 'Talking tech with Techielass — Schedule GitHub Actions Using Cron Expressions' },    // Schedule GitHub Actions Using Cron Expressions
    'ga-1-4-merge-commit': { yt: 'cCpRgmTpC2Y', credit: 'Sumanshu Nankana — GitHub # 0015 # GitHub Actions - Push and Pull Request Event' }, // GitHub # 0015 # GitHub Actions - Push and Pull Request Event
    'ga-1-5-bo-loc': { yt: 'KF5GtYZUtys', credit: 'Coding with Mat — Controlling When Pipeline Workflows Run with Triggers - Github Actions' },       // Controlling When Pipeline Workflows Run with Triggers - Github Actions

    /* ── Chương 2 — Job, runner, và những cỗ máy ngồi chờ ── */
    'ga-2-1-may-moi': { yt: 'zpDH_tfOOqc', credit: 'Cloud With VarJosh — GitHub Actions Triggers & Runners Explained | Events, Contexts & Hosted Runners' },       // GitHub Actions Triggers & Runners Explained | Events, Contexts & Hosted Runners
    'ga-2-2-needs': { yt: 'E2RRxcq_08E', credit: 'KodeKloud — GitHub Actions Tutorial: Advanced Concepts You Should Know (Part 1)' },         // GitHub Actions Tutorial: Advanced Concepts You Should Know
    'ga-2-3-ba-nen-tang': { yt: 'B5XzHnO_guo', credit: 'Cloud With VarJosh — GitHub Actions Matrix Strategy Explained | Multi-OS, Multi-Version Testing at Scale' },   // GitHub Actions Matrix Strategy Explained | Multi-OS, Multi-Version Testing at Scale
    'ga-2-4-buoc-ma-thoat': { yt: 'ylEy4eLdhFs', credit: 'Automation Step by Step — GitHub Actions Step by Step DEMO for Beginners' }, // GitHub Actions Step by Step DEMO for Beginners
    'ga-2-5-ma-tran': { yt: 'Pj23Yy6J3oA', credit: 'Sumanshu Nankana — GitHub # 0011 # GitHub Actions - Strategy Matrix (Run Job on Multiple Versions) and Fail Fast' },       // GitHub # 0011 # GitHub Actions - Strategy Matrix (Run Job on Multiple Versions) and Fail Fast

    /* ── Chương 3 — Biểu thức, context, và lúc nào thứ gì tồn tại ── */
    'ga-3-1-ranh-gioi': { yt: 'y8eJTk4lPks', credit: 'Execute Automation — Part 5 - Understanding Context and Env variables with ${{ Expression }}' },  // Part 5 - Understanding Context and Env variables with ${{ Expression }}
    'ga-3-2-context': { yt: 'zI7WVWe9bHM', credit: 'Testing Mini Bytes — Part 4 | Contexts | Different Contexts in Github Actions | How to use Contexts in GIthub Actions |' },    // Part 4 | Contexts | Different Contexts in Github Actions
    'ga-3-3-ep-kieu': { yt: 'Br6vyKKCwr4', credit: 'Infrasity — Github Action If-else Statement' },    // Github Action If-else Statement
    'ga-3-4-ham': { yt: 'r4Z_khNOEs4', credit: 'DevOps Topics — Github Actions Tutorial | Status check functions' },        // Github Actions Tutorial | Status check functions - always(), success(), failure(), cancelled()
    'ga-3-5-dieu-kien': { yt: 'swS_7tMqHE0', credit: 'Daminda Dinesh Imaduwa Gamage — GitHub Actions conditionals : how "if" works' },  // GitHub Actions conditionals : how "if" works

    /* ── Chương 4 — Action, và chuyện chạy mã của người khác ── */
    'ga-4-1-action-la-gi': { yt: 'JYOGmLzMbpM', credit: 'Mickey Gousset — Introduction to GitHub Actions - Part 4 - The GitHub Marketplace' }, // Introduction to GitHub Actions - Part 4 - The GitHub Marketplace
    'ga-4-2-ghim': { yt: '8uQLyErG4EE', credit: 'bdougie — Ensure your GitHub Actions are pinned to a SHA' },         // Ensure your GitHub Actions are pinned to a SHA
    'ga-4-4-setup': { yt: 'gRPIPiiTH-c', credit: 'Swashbuckling with Code — CI #5 - Why use the setup-node action?' },        // CI #5 - Why use the setup-node action?
    'ga-4-5-tu-viet': { yt: 'zQdEsIBbVjE', credit: 'Mickey Gousset — Create Your First Custom GitHub Action' },      // Create Your First Custom GitHub Action

    /* ── Chương 5 — Cache và artifact, đo thật ── */
    'ga-5-1-cache-mua-gi': { yt: 'BDQivAobxKA', credit: 'CoderDave — Caching Dependencies to SPEED UP Workflows in GitHub Actions' }, // Caching Dependencies to SPEED UP Workflows in GitHub Actions
    'ga-5-2-khoa-cache': { yt: 'lkn3FPRh5ps', credit: 'Cameron McKenzie — Cache GitHub Actions Workflow Dependencies' },   // Cache GitHub Actions Workflow Dependencies
    'ga-5-3-cache-chet': { yt: '7PVUjRXUY0o', credit: 'Mickey Gousset — Cache Management with GitHub actions' },   // Cache Management with GitHub actions
    'ga-5-4-artifact': { yt: 'vlySg5UPIm4', credit: 'Mickey Gousset — GitHub Actions - Upload Artifacts' },     // GitHub Actions - Upload Artifacts
    'ga-5-5-hoa-von': { yt: 'tw9e61Bct-E', credit: 'Cloud With VarJosh — GitHub Actions Artifacts & Caching Explained | Share Files & Optimize Builds' },      // GitHub Actions Artifacts & Caching Explained | Share Files & Optimize Builds

    /* ── Chương 6 — Bí mật, quyền, và cái token ── */
    'ga-6-1-che-bi-mat': { yt: 'TLB5MY9BBa4', credit: 'CoderDave — GitHub Actions Tutorial | From Zero to Hero in 90 minutes (Environments, Secrets, Runners, etc)' }, // GitHub Actions Tutorial | From Zero to Hero in 90 minutes (Environments, Secrets, Runners, etc)
    'ga-6-2-token': { yt: 'jEK07KPEjnY', credit: 'CoderDave — GitHub Actions: GITHUB_TOKEN Explained | How it works, Change Permissions, Customizations' },      // GitHub Actions: GITHUB_TOKEN Explained | How it works, Change Permissions, Customizations
    'ga-6-3-oidc': { yt: 'Sdzd4N6L5Hg', credit: 'Integrations Ninjas — Authenticate GitHub Actions with AWS Using OIDC — No Secrets Needed' },       // Authenticate GitHub Actions with AWS Using OIDC — No Secrets Needed
    'ga-6-4-be-mat': { yt: '4dnniFk5i2Q', credit: 'Mickey Gousset — GitHub Actions Policy Update: Blocking & SHA Pinning Explained!' },     // GitHub Actions Policy Update: Blocking & SHA Pinning Explained!
    'ga-6-5-soat': { yt: 'ntZwaRzhVSA', credit: 'HashiCorp, an IBM Company — Building Scalable Enterprise Secrets Management with GitHub OIDC and HashiCorp Vault' },       // Building Scalable Enterprise Secrets Management with GitHub OIDC and HashiCorp Vault

    /* ── Chương 7 — Tốc độ, concurrency, và cái giá của nó ── */
    'ga-7-1-duong-toi-han': { yt: 'reRT-uZoJpk', credit: 'DevTips Daily — Matrix Builds & Parallel Jobs in GitHub Actions | Speed Up Your CI/CD!' }, // Matrix Builds & Parallel Jobs in GitHub Actions | Speed Up Your CI/CD!
    'ga-7-2-concurrency': { yt: 'yAb8OSYCHTc', credit: 'DevStoriesEU — GitHub Actions · 7/14 · Controlling Flow with Concurrency' },   // GitHub Actions · 7/14 · Controlling Flow with Concurrency
    'ga-7-3-phuong-sai': { yt: 'FSQDtRMtSHo', credit: 'Techi Nik — GitHub Actions Matrix Strategy: Run Jobs Faster & Smarter' },    // GitHub Actions Matrix Strategy: Run Jobs Faster & Smarter
    'ga-7-4-xep-hang': { yt: 'WBJkaREvTss', credit: 'Techi Nik — GitHub Actions Tutorial: Save Time with Dependency Caching' },      // GitHub Actions Tutorial: Save Time with Dependency Caching
    'ga-7-5-gia-tri': { yt: 'AHIaVb22U2o', credit: 'LearnwithDevOpsEngineer — GitHub Actions Is NOT Free | Pricing Explained + Self-Hosted Runners & Jenkins Comparison' },       // GitHub Actions Is NOT Free | Pricing Explained + Self-Hosted Runners & Jenkins Comparison

    /* ── Chương 8 — Khi CI đỏ ── */
    'ga-8-1-ma-thoat': { yt: 'Y8KdR-AyyyA', credit: 'Jonathan Soma — Fix "Error: Process completed with exit code" errors on GitHub Actions' },    // Fix "Error: Process completed with exit code" errors on GitHub Actions
    'ga-8-2-flake': { yt: 'Mhe-quHWe60', credit: 'Semaphore — 3 Steps to Fix Flaky Tests' },       // 3 Steps to Fix Flaky Tests
    'ga-8-3-tai-lap': { yt: 'OW121yjV1IM', credit: 'Society of Research Software Engineering — Pascal Führlich: Debugging GitHub Actions Locally' },     // Pascal Führlich: Debugging GitHub Actions Locally
    'ga-8-4-thu-tu-doc': { yt: 'RIeLtfGdB3w', credit: 'bdougie — 3 Tips for Debugging GitHub Actions' },  // 3 Tips for Debugging GitHub Actions
    'ga-8-5-kiem-ban-va': { yt: 'Oqq-_QZWzhg', credit: 'Cypress.io — GitHub Actions + Cypress: Debugging Test Failures in CI' }, // GitHub Actions + Cypress: Debugging Test Failures in CI

    /* ── Chương 9 — Deploy từ CI, và vì sao kho này ĐÃ THÔI ── */
    'ga-9-1-push-de-deploy': { yt: 'X3F3El_yvFg', credit: 'Traversy Media — Automatic Deployment With Github Actions' }, // Automatic Deployment With Github Actions
    'ga-9-2-o-dau': { yt: 'NIAEruc-eP8', credit: 'Learn Code With Durgesh — 🚀 Complete CI/CD Pipeline Tutorial with GitHub Actions & Docker | DevOps Masterclass' },          // Complete CI/CD Pipeline Tutorial with GitHub Actions & Docker | DevOps Masterclass
    'ga-9-3-rollback': { yt: 'sVl6De94evo', credit: 'Hello World — Multi-stage deployments with GitHub Actions' },       // Multi-stage deployments with GitHub Actions
    'ga-9-4-moi-truong': { yt: 'EOlm3ft0VPo', credit: 'Asp.Net Monsters — Deploying to Environments with GitHub Actions (#212)' },     // Deploying to Environments with GitHub Actions (#212)
    'ga-9-5-thong-bao': { yt: 'cNcorU57m94', credit: 'DevTips Daily — Send Slack Notifications from GitHub Actions | Pass/Fail Alerts' },      // Send Slack Notifications from GitHub Actions | Pass/Fail Alerts

    /* ── Chương 10 — Chẩn đoán bằng ca thật ── */
    'ga-10-1-build-cu': { yt: 'lEcULR30-GM', credit: 'freeCodeCamp.org — Master Full-Stack Docker & CI/CD – Build a Production-Ready Pipeline' },     // Master Full-Stack Docker & CI/CD – Build a Production-Ready Pipeline
    'ga-10-2-seed-vo': { yt: 'PX881bVAPxM', credit: 'Neon Postgres — Prisma essentials: from development to production (Prisma Migrate workflow)' },      // Prisma essentials: from development to production (Prisma Migrate workflow)
    'ga-10-3-checker-hong': { yt: 'm1oMj29P--Y', credit: 'Modern Software Engineering — 3 Reasons Your CI/CD Pipeline Isn\'t Working As It Should...' }, // 3 Reasons Your CI/CD Pipeline Isn't Working As It Should...
    'ga-10-4-diet-cong': { yt: 'ZZxhzr3GGlY', credit: 'Mickey Gousset — The actions/checkout action fails with two possible error messages' },    // The actions/checkout action fails with two possible error messages
    'ga-10-5-migration': { yt: '0Ik45qw8KhM', credit: 'fromDev2Dev — Let\'s learn Prisma ORM: migrate in detail (seeding, down migration, production)' },    // Let's learn Prisma ORM: migrate in detail (seeding, down migration, production)

    /* ── Chương 11 — Ôn tổng và kỳ thi cuối ── */
    'ga-11-1-chot': { yt: 'BQrohJ3PT7I', credit: 'GitHub — How to use GitHub Actions | GitHub for Beginners' }, // How to use GitHub Actions | GitHub for Beginners
  },
};
