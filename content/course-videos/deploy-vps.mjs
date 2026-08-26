/**
 * Curated YouTube track for the "Deploy lên VPS" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/deploy-vps.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/deploy-vps.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'deploy-vps',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Deploy thật ra là gì ── */
    'deploy-0-1-bon-buoc': { yt: 'H5z70EBtEow', credit: 'CodeLucky — Deployment Strategies Explained: Blue-Green vs. Canary vs. Rolling' },        // Deployment Strategies Explained: Blue-Green vs. Canary vs. Rolling
    'deploy-0-2-may-nhan': { yt: 'IbJMb-qsgaY', credit: '6 Pack Programmer — How to Deploy Node.js App on VPS for Beginners | UltaHost' },        // How to Deploy Node.js App on VPS for Beginners | UltaHost
    'deploy-0-3-lan-dau-lam-tay': { yt: 'M9gUjO26P94', credit: 'Usama Imdad Sian — Node JS deployment on Ubuntu Server (VPS) using PM2, NGINX & Git' }, // Node JS deployment on Ubuntu Server (VPS) using PM2, NGINX & Git
    'deploy-0-4-chua-giai-quyet': { yt: 'SPeQJ-fINoU', credit: 'Alexa Fazio — Deploy a Node.js app to Ubuntu Server' }, // Deploy a Node.js app to Ubuntu Server

    /* ── Chương 1 — Tạo tác: quyết định chính xác cái gì lên máy chủ ── */
    'deploy-1-1-cay-lam-viec-co-gi': { yt: 'YqU20hJCgAI', credit: 'Avinashkumar - The Learning Destination — CICD: Learn Build Once Deploy Multiple Times in FIVE minutes #cicd #devops #artifact' },        // CICD: Learn Build Once Deploy Multiple Times in FIVE minutes
    'deploy-1-2-tao-tac-tai-lap-duoc': { yt: 'UWQ4GVVdPYw', credit: 'NDC Conferences — Binary Reproducible Builds with Docker - Mike Long' },      // Binary Reproducible Builds with Docker - Mike Long
    'deploy-1-3-tao-tac-phai-dung': { yt: 'ilu6yMBGS6I', credit: 'media.ccc.de — Reproducible Builds' },         // Reproducible Builds
    'deploy-1-4-dat-ten-ban-phat-hanh': { yt: 'mxPfbwJ0FiU', credit: 'Data Lab Tech — Automated Semantic Releases on GitHub' },     // Automated Semantic Releases on GitHub
    'deploy-1-5-giu-ban-cu-khong-day-dia': { yt: 'FHrwssNGkfk', credit: 'Red Hat Enterprise Linux — File System Out of Space? Learn How to Quickly Fix It' },  // File System Out of Space? Learn How to Quickly Fix It

    /* ── Chương 2 — Vận chuyển: đưa tạo tác lên máy ── */
    'deploy-2-1-rsync-va-hai-moi-nguy': { yt: 'BP0v98sD0qs', credit: 'Programonaut — How To Use Rsync To Easily Deploy Your Application Or Website' },     // How To Use Rsync To Easily Deploy Your Application Or Website
    'deploy-2-2-git-push-de-deploy': { yt: 'BJw-D5iwmdM', credit: 'smbCloud — #1 Deploy Rust Axum API to Production Server  - Setup Git Post-receive Hooks' },        // #1 Deploy Rust Axum API to Production Server - Setup Git Post-receive Hooks
    'deploy-2-3-tao-tac-la-anh-container': { yt: 'pf46F-dvdMM', credit: 'DevOps Bunker — How to Push Docker Images to GitHub Container Registry (GHCR) | Step-by-Step' },  // How to Push Docker Images to GitHub Container Registry (GHCR) | Step-by-Step
    'deploy-2-4-chon-duong-va-dung-o-dau': { yt: 'gDGT4Gf_4JM', credit: 'CNCF [Cloud Native Computing Foundation] — Git-push Workflows (using git hooks) for Deploying Applications - Tanmai Gopal & Vamshi Surabhi Rao' },  // Git-push Workflows (using git hooks) for Deploying Applications
    'deploy-2-5-hong-nua-chung': { yt: '-PJW17vkQak', credit: 'Research Rocks — How to Use Rsync Over SSH for Secure File Transfer on Linux | Beginner-Friendly Rsync Tutorial' },            // How to Use Rsync Over SSH for Secure File Transfer on Linux

    /* ── Chương 3 — Cú tráo: đổi phiên bản mà không rớt request nào ── */
    'deploy-3-1-trao-ngay-tho-ton-bao-nhieu': { yt: 'um24VlkkqGo', credit: 'Nick Janetakis — lcurl Is a Script to Visit a Site Every X Seconds Using curl' },// lcurl Is a Script to Visit a Site Every X Seconds Using curl
    'deploy-3-2-tat-tu-te': { yt: '-OjPhPV6Rjs', credit: 'Software Developer Diaries — Here\'s how to Gracefully Shutdown your apps (with Node.js examples)' },                  // Here's how to Gracefully Shutdown your apps (with Node.js examples)
    'deploy-3-3-xanh-lam': { yt: 'FRXwz4zH7zU', credit: 'Imran Codes — Blue-Green Deployments Explained: How to Deploy Without Downtime' },                   // Blue-Green Deployments Explained: How to Deploy Without Downtime
    'deploy-3-4-trinh-quan-ly-dich-vu': { yt: 'fUwtYWqVK8w', credit: 'it10x — PM2 Full Guide: Run Node.js & Next.js Apps 24/7' },      // PM2 Full Guide: Run Node.js & Next.js Apps 24/7
    'deploy-3-5-script-trao-hoan-chinh': { yt: 'eQPYsGrZW_E', credit: 'DevOps & AI Toolkit — Stop Losing Requests! Learn Graceful Shutdown Techniques' },     // Stop Losing Requests! Learn Graceful Shutdown Techniques

    /* ── Chương 4 — Cấu hình và bí mật ── */
    'deploy-4-1-cau-hinh-song-ngoai-tao-tac': { yt: 'p85yYqLPiUk', credit: 'dotenvx — What is a .env.vault file' },  // What is a .env.vault file
    'deploy-4-2-luc-dung-va-luc-chay': { yt: '7UY6sp5K72E', credit: 'Back4app — ARG and ENV in your Dockerfile' },         // ARG and ENV in your Dockerfile
    'deploy-4-3-env-khong-phai-mot-dinh-dang': { yt: 'r7Yd1b-aEq4', credit: 'Technical Rajni — 🔥 Unlock the Secrets of .env Files: Master Environment Variables in 5 Minutes! 🚀' }, // Unlock the Secrets of .env Files: Master Environment Variables in 5 Minutes
    'deploy-4-4-bi-mat-trong-lich-su-git': { yt: 's-z6kJxdNJw', credit: 'Merill Fernando — How to Remove Leaked Secrets from Git History FAST!' },     // How to Remove Leaked Secrets from Git History FAST!
    'deploy-4-5-xoay-bi-mat': { yt: 'DIVQdzgWEiY', credit: 'dotenvx — 10x your .env security with encryption to .env.vault files' },                  // 10x your .env security with encryption to .env.vault files

    /* ── Chương 5 — Cơ sở dữ liệu: migration và khoảng trống giữa hai lần ── */
    'deploy-5-1-hai-thoi-diem-khac-nhau': { yt: 'zpM-lIRscXM', credit: 'Thorben Janssen — Database Migration: Update your schema without a downtime' },   // Database Migration: Update your schema without a downtime
    'deploy-5-2-mo-rong-thu-hep': { yt: 'ONSCQWLD9d0', credit: 'Software Developer Diaries — Every engineer should know this.. (Expand-Contract Pattern)' },           // Every engineer should know this.. (Expand-Contract Pattern)
    'deploy-5-3-khoa-va-thoi-gian': { yt: 'NJBQNnfSWzY', credit: 'pganalyze — Avoiding deadlocks in Postgres migrations' },         // Avoiding deadlocks in Postgres migrations
    'deploy-5-4-migration-nua-chung': { yt: 'U6iLxllyhxM', credit: 'pganalyze — Finding the root cause of locking problems in Postgres' },       // Finding the root cause of locking problems in Postgres
    'deploy-5-5-lap-du-lieu-va-vi-tri': { yt: '-1aO6UznfI0', credit: 'Xata — How to perform Postgres schema changes in production with zero downtime' },     // How to perform Postgres schema changes in production with zero downtime

    /* ── Chương 6 — Lùi bản, và cái không lùi được ── */
    'deploy-6-1-lui-chay-duoc': { yt: 'sQJq-MGEyB8', credit: 'CodeLucky — Rollback Procedures: Fix Deployments Fast' },  // Rollback Procedures: Fix Deployments Fast
    'deploy-6-2-lui-noi-doi': { yt: 'w-1nqcigsm4', credit: 'Cloud Stack Studio — What Is A Successful Rollback Strategy In CI/CD Pipelines? - Cloud Stack Studio' },    // What Is A Successful Rollback Strategy In CI/CD Pipelines?
    'deploy-6-3-du-lieu-hong': { yt: 'ka-PLyjV3AI', credit: 'DevOps Unicorns — Michiel Rook - Database schema migrations with zero downtime' },   // Michiel Rook - Database schema migrations with zero downtime
    'deploy-6-4-cua-mot-chieu': { yt: 'cw5K2O4AHJc', credit: 'Web Dev Cody — How do software projects achieve zero downtime database migrations?' },  // How do software projects achieve zero downtime database migrations?
    'deploy-6-5-chung-minh': { yt: 'fFsWbOdseFw', credit: 'GitLab — Auto rollback in case of failure' },     // Auto rollback in case of failure

    /* ── Chương 7 — Script deploy: hỏng phải kêu, và chạy hai lần vẫn an toàn ── */
    'deploy-7-1-co-shell': { yt: 'Cbv3PY6YCXQ', credit: 'vlogize — Understanding set -eo pipefail: Why Your Shell Script Might Not Work as Expected' },       // Understanding set -eo pipefail: Why Your Shell Script Might Not Work as Expected
    'deploy-7-2-chay-lai-duoc': { yt: 'F3UzOrEtMYI', credit: 'Learn Linux TV — How to Automate Linux Backups Using rsync and systemd' },  // How to Automate Linux Backups Using rsync and systemd
    'deploy-7-3-tu-choi': { yt: 's9DBQ585MvI', credit: 'vlogize — Understanding the Importance of set -o pipefail in Bash Scripts' },        // Understanding the Importance of set -o pipefail in Bash Scripts
    'deploy-7-4-kiem-khoi': { yt: 'cDyDv0laDZA', credit: 'Semaphore — Smoke Testing: Stop Bugs Early and Fast' },      // Smoke Testing: Stop Bugs Early and Fast
    'deploy-7-5-ca-script': { yt: 'hsEhcwI6qGE', credit: 'Edik Mkoyan — shell script for checking status of server' },      // shell script for checking status of server

    /* ── Chương 8 — Sống trên máy nhỏ: bộ nhớ, OOM killer và đĩa ── */
    'deploy-8-1-ma-137': { yt: '4yXl-7Zc-dU', credit: 'SystemDR - Scalable System Design  — How the Linux OOM Killer Works | Algorithm, Scoring, and How to Prevent OOM Events' },            // How the Linux OOM Killer Works | Algorithm, Scoring, and How to Prevent OOM Events
    'deploy-8-2-giet-ai': { yt: 'UByJxVVFQdQ', credit: 'SystemDR - Scalable System Design  — Practical Linux OOM Killer Tuning Guide | Protect Critical Services from Out Of Memory Crashes' },           // Practical Linux OOM Killer Tuning Guide
    'deploy-8-3-swap': { yt: 'dpZljibTAQI', credit: 'SStract — Linux Memory & OOM Killer' },              // Linux Memory & OOM Killer
    'deploy-8-4-day-dia': { yt: 'v_bZEcx-mXo', credit: 'MrDIY — How To Fix \'No Space Left on Device\' Error with a Not Full Disk on Linux' },           // How To Fix 'No Space Left on Device' Error with a Not Full Disk on Linux
    'deploy-8-5-dung-tren-may-nho': { yt: 'raQK1vRF_V0', credit: 'Shubham Sahoo — Exit 137: Your Container Didn\'t Crash. Linux Killed It. Here\'s Why.' },   // Exit 137: Your Container Didn't Crash. Linux Killed It.

    /* ── Chương 9 — Giám sát: con số nói dối và con số không ── */
    'deploy-9-1-do-cai-gi': { yt: 'ZdhIWieJqzQ', credit: 'Conf42 — 15 NGINX Metrics to Monitor | Dave McAllister | Conf42 DevOps 2025' },   // 15 NGINX Metrics to Monitor | Dave McAllister | Conf42 DevOps 2025
    'deploy-9-2-trung-binh': { yt: '9rlGSahksLQ', credit: 'Kamran Ahmed — What are P50, P95, P99? - Backend Performance 101' },  // What are P50, P95, P99? - Backend Performance 101
    'deploy-9-3-log': { yt: 'iD0xmhJAjwk', credit: 'Bo Morgan Tech — Learn journalctl in 7 Minutes — Become the Linux Troubleshooting Hero' },         // Learn journalctl in 7 Minutes — Become the Linux Troubleshooting Hero
    'deploy-9-4-bao-dong': { yt: '_jnpQImcLTg', credit: 'Sascha Brockel — Reliable monitoring of cronjobs 🖥️, scripts and more with Healthchecks.io  - Simple & Effective' },    // Reliable monitoring of cronjobs, scripts and more with Healthchecks.io
    'deploy-9-5-cua-truoc': { yt: '-_aB9jswZaU', credit: 'Easy Self Host — Uptime Kuma: Self-Hosted Uptime Monitor' },   // Uptime Kuma: Self-Hosted Uptime Monitor

    /* ── Chương 10 — Sao lưu, và lần phục hồi chưa ai bấm giờ ── */
    'deploy-10-1-tao-sao-luu': { yt: '0NUV49elsX8', credit: 'InterviewBuddies — Backup and Restore PostgreSQL Database: pg_dump and pg_restore Explained' }, // Backup and Restore PostgreSQL Database: pg_dump and pg_restore Explained
    'deploy-10-2-phuc-hoi': { yt: 'WB6WzuFHcP8', credit: 'WittCode — Backing Up a Postgres Database with pg_dump and pg_restore' },    // Backing Up a Postgres Database with pg_dump and pg_restore
    'deploy-10-3-noi-doi': { yt: 'uboZI90SSf4', credit: 'Learnomate Technologies — PostgreSQL Logical Backup & Restore | Explained by Ankush Sir' },     // PostgreSQL Logical Backup & Restore
    'deploy-10-4-kiem-chung': { yt: '_f7C1ebxc9o', credit: 'E-MultiSkills Database  services — 62 - pgbackrest : PostgreSQL backup and restore' },  // 62 - pgbackrest : PostgreSQL backup and restore
    'deploy-10-5-thieu-gi': { yt: '3k1QEEzFpDI', credit: 'NetSecProf — Creating Archives backups with tar, cron, and rsync over ssh' },    // Creating Archives backups with tar, cron, and rsync over ssh

    /* ── Chương 11 — Chẩn đoán, nghiệm thu và bài thi cuối ── */
    'deploy-11-1-nam-phut-dau': { yt: '4MGVTpXAAmo', credit: 'Cyber connect — Incident Response Lifecycle Explained' },        // Incident Response Lifecycle Explained
    'deploy-11-2-chu-ky': { yt: 'DR4iGzBN6wg', credit: 'CYBRIXEN — Incident Response Process Explained' },              // Incident Response Process Explained
    'deploy-11-3-cong-thuc-deploy': { yt: '5zmCTO2UCIk', credit: 'Nozomi Networks — Incident Response (5 Step process) – A Guide.' },    // Incident Response (5 Step process) – A Guide.
    'deploy-11-4-cong-thuc-tai-nguyen': { yt: 'aDNM1hW9Ods', credit: 'quidsup — Solving Disk Usage Issue on Linux Server' },// Solving Disk Usage Issue on Linux Server
    'deploy-11-5-nghiem-thu': { yt: 'iLVoA1DTE60', credit: 'Steve Griffith - Prof3ssorSt3v3 — Testing APIs with the cURL Command' },          // Testing APIs with the cURL Command
  },
};
