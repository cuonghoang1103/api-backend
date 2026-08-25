/**
 * Curated YouTube track for the "Docker" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/docker.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/docker.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'docker',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Docker giải quyết gì, và dựng máy ── */
    'dk-0-1-van-de': { yt: 'ZZ10b63xnQc', credit: '' },   // Docker Explained for Absolute Beginners [2026]
    'dk-0-2-cai-dat': { yt: 'pg19Z8LL06w', credit: '' },  // Docker Crash Course for Absolute Beginners [NEW]
    'dk-0-3-nam-phut': { yt: 'gAkwW2tuIqE', credit: '' }, // Learn Docker in 7 Easy Steps - Full Beginner's Tutorial

    /* ── Chương 1 — Container & ảnh: mô hình trong đầu ── */
    'dk-1-1-container-la-gi': { yt: 'JF9S3MFDNtI', credit: '' },  // What Are Containers? Docker Basics Explained for Absolute Beginners
    'dk-1-2-tang-anh': { yt: 'QqeNcBIlK_s', credit: '' },         // Understanding Docker Images
    'dk-1-3-vong-doi': { yt: 'jetcfvPpTbc', credit: '' },         // Docker Container Lifecycle Explained with hands on example
    'dk-1-4-tang-ghi-duoc': { yt: 'hXbXSRLXiS8', credit: '' },    // Understanding OverlayFS | OverlayFS | Docker
    'dk-1-5-ngan-xep-runtime': { yt: '253o0hxwxm8', credit: '' }, // Docker Architecture | Docker components : daemon, containerd, containerd-shim, runc

    /* ── Chương 2 — Chạy container ── */
    'dk-2-1-docker-run': { yt: 'pry-Vs4Ew6Y', credit: '' },            // Docker CLI Explained | run, exec, logs & inspect (Daily Docker Commands)
    'dk-2-2-quan-sat': { yt: '_2ibA3FX5Ek', credit: '' },              // Mastering the Docker container inspect Command | Docker Series | PART 2.2
    'dk-2-3-vao-ben-trong': { yt: 'UHfGArZFFrY', credit: '' },         // Docker Exec Tutorial: Accessing & Executing Commands in Running Containers
    'dk-2-4-moi-truong-nguoi-dung': { yt: 'vOoCFxlQIbE', credit: '' }, // Docker Environment Configs, Variables, and Entrypoints
    'dk-2-5-gioi-han-restart': { yt: 'mgMhQo279Xk', credit: '' },      // 45. Docker HEALTHCHECK Instruction Explained with Examples

    /* ── Chương 3 — Ảnh & registry ── */
    'dk-3-1-ten-anh': { yt: 'DIVE6B278uE', credit: '' },      // Docker Image Tagging: Naming & Versioning for Beginners
    'dk-3-2-tag-digest': { yt: 'G9RY23vmV00', credit: '' },   // Docker Image Digests - Learn In 7 Minutes | Docker Image Hashes And Digests Explained
    'dk-3-3-registry': { yt: '3XvTSgoayPI', credit: '' },     // Episode 15 | Docker Registry | How to Share Docker Images Like a Pro (Docker Hub, GHCR, Private)
    'dk-3-4-da-kien-truc': { yt: 'v_SApX7N0bI', credit: '' }, // Docker Tip #101: Fix Exec Format Error Due to CPU Architecture Mismatch
    'dk-3-5-don-dia': { yt: '3Q0cVWR7RU4', credit: '' },      // Docker Quietly Eats Drives | Docker Prune & Cleanup Guide

    /* ── Chương 4 — Dockerfile, từ căn bản tới thành thạo ── */
    'dk-4-1-dockerfile-dau-tien': { yt: '3c-iBn73dDE', credit: '' }, // Docker Tutorial for Beginners [FULL COURSE in 3 Hours]
    'dk-4-2-cac-chi-thi': { yt: 'R1ADsoIAaIE', credit: '' },         // DevOps | Docker | Dockerfile | COPY vs ADD | ARG vs ENV | ENTRYPOINT vs CMD
    'dk-4-3-cmd-entrypoint': { yt: 'U1P7bqVM7xM', credit: '' },      // Docker ENTRYPOINT vs CMD With Examples - Docker Development Tips & Tricks
    'dk-4-4-arg-env': { yt: 'CclxfbK9ods', credit: '' },             // Dockerfile ARG Instruction Explained | Dockerfile Tutorial
    'dk-4-5-cong-thuc': { yt: 'ucTmWale9SI', credit: '' },           // Dockerize Next.js app for Development and Production | Step By Step Guide

    /* ── Chương 5 — Tầng, cache & dựng nhanh ── */
    'dk-5-1-cache-quyet-dinh': { yt: 'dSpOBSRJFwg', credit: '' },    // Docker Tutorial - Improve Docker builds with Caching and Layers
    'dk-5-2-thu-tu': { yt: 'oZ9nyCWERYc', credit: '' },              // Proper DOCKER CACHING: Speed up your build with this optimized Dockerfile
    'dk-5-3-cache-mount': { yt: '8fILYOtoesQ', credit: '' },         // Supercharge Docker builds using Cache Mount
    'dk-5-4-cache-ci': { yt: '77j6JFBTmTc', credit: '' },            // docker: fast CI rebuilds with --cache-from (anthony explains #448)
    'dk-5-5-chan-doan-dung-cham': { yt: 'SOZxl761MCI', credit: '' }, // Speed Up Your CI Pipelines with Docker Layer Caching

    /* ── Chương 6 — Ảnh nhỏ và an toàn ── */
    'dk-6-1-multi-stage': { yt: 'yyJrZgoNal0', credit: '' },        // Day-26 | Multi Stage Docker Builds | Reduce Image Size by 800% | Distroless Container Images
    'dk-6-2-chon-anh-nen': { yt: 'GMWyq3rJNG8', credit: '' },       // How Do Alpine And Distroless Make Smaller Docker Images
    'dk-6-3-cat-kich-thuoc': { yt: '6iBxUJN2Wu4', credit: '' },     // Optimizing Docker Images: 6 Best Practices | Multi-Stage, Distroless, Scratch
    'dk-6-4-chay-an-toan': { yt: 'kCZRXXGX7Ww', credit: '' },       // Docker Security: Running Containers as Non-Root User - Best Practices
    'dk-6-5-quet-chuoi-cung-ung': { yt: 'Kibk6qq7ZCs', credit: '' },// Generate SBOMs with Trivy & Scan SBOMs for vulnerabilities

    /* ── Chương 7 — Dữ liệu: volume, bind mount, tmpfs ── */
    'dk-7-1-ba-cach-gan': { yt: 'BJ-KwdBvbVE', credit: '' },   // Docker Volumes Explained: Bind Mount vs Named Volume vs tmpfs
    'dk-7-2-volume': { yt: 'r1tIdACdJeE', credit: '' },        // Learn Docker Storage (Volumes & Bind Mounts) | Docker Tutorial
    'dk-7-3-bind-mount': { yt: 'lD1fD__i_QU', credit: '' },    // Docker Storage | Docker Volumes | Bind Mounts | How to Persist Data in Docker Container
    'dk-7-4-tmpfs-bi-mat': { yt: 'grkzPqdxJM4', credit: '' },  // DOCKER Data Persistence | Volumes, Bind and tmpfs Mounts
    'dk-7-5-sao-luu': { yt: 'ZEy8iFbgbPA', credit: '' },       // Migrate Docker Volumes from one Host to another // backup and restore

    /* ── Chương 8 — Mạng ── */
    'dk-8-1-mang-bridge': { yt: 'itZ_x_nDBxU', credit: '' },    // Docker Networking Made Simple: Connecting Containers Like a Pro
    'dk-8-2-cong-bo-cong': { yt: 'U9VsqLXggv8', credit: '' },   // Docker Networking Explained for Beginners: Bridge, Host, & Compose
    'dk-8-3-goi-nhau': { yt: 'nXHCi_Zt32Q', credit: '' },       // Docker Networking - How containers talk to each other?
    'dk-8-4-toi-may-chu': { yt: 'fBRgw5dyBd4', credit: '' },    // Docker Networking Tutorial (Bridge - None - Host - IPvlan - Macvlan - Overlay)
    'dk-8-5-chan-doan-mang': { yt: 'W7X6u2BGVRY', credit: '' }, // How Docker Networking Actually Works

    /* ── Chương 9 — Docker Compose ── */
    'dk-9-1-file-dau-tien': { yt: 'Vhy2Zrcchuk', credit: '' },     // Episode 12 | Docker Compose explained | Run multiple containers from docker-compose.yml
    'dk-9-2-tra-cuu-dich-vu': { yt: 'n7fuMqisdR4', credit: '' },   // Docker for Beginners (Part4): Docker Compose in real projects
    'dk-9-3-thu-tu-khoi-dong': { yt: 'Z-8-yXLFF-U', credit: '' },  // Docker Compose depends_on Explained: Control Container Startup Order for Beginners
    'dk-9-4-bien-profile': { yt: 'pgf0Tc1ugEY', credit: '' },      // Docker Compose v2 and Profiles Are the Best Thing Ever
    'dk-9-5-nhieu-file': { yt: '1DK6SOJFZR8', credit: '' },        // Docker Compose Override Files: Simplify Multi-Environment Configuration

    /* ── Chương 10 — Compose ngoài đời thật ── */
    'dk-10-1-ban-ve': { yt: 'SXwC9fSwct8', credit: '' },        // Ultimate Docker Compose Tutorial
    'dk-10-2-tang-du-lieu': { yt: 'aetqo2nkQcA', credit: '' },  // Docker Compose Node.js, Redis, and PostgreSQL
    'dk-10-3-api-migration': { yt: 'IDrRtiGkTaI', credit: '' }, // Docker Compose Step-by-Step: Deploy FastAPI, Postgres, Redis & Celery | #3
    'dk-10-4-frontend': { yt: 'd1ntel1pk7s', credit: '' },      // Next.js 14+ Docker Tutorial - Dev and Prod Environments using Dockerfile and Docker Compose
    'dk-10-5-nginx-lap-rap': { yt: '7VndGLkI7ME', credit: '' }, // Dockerizing a Next.js App with Nginx: A Step-by-Step Guide

    /* ── Chương 11 — Chạy nó trên production ── */
    'dk-11-1-restart': { yt: 'CsIZy4mBM5A', credit: '' },          // Docker Healthchecks & Restart Policies Explained | Make Containers Production-Ready
    'dk-11-2-han-muc-137': { yt: 'O0z_LzJCE8w', credit: '' },      // Debug Docker Container Immediately Exit Code 137
    'dk-11-3-log': { yt: 'TFCua2yj09Y', credit: '' },              // How to Follow Docker Logging Best Practices
    'dk-11-4-cap-nhat-quay-lui': { yt: 'MRBzHJaDRqA', credit: '' },// Build CI/CD Pipeline with GitHub Actions | Docker Image to DockerHub
    'dk-11-5-dia-giam-sat': { yt: 'w77eQ8LMn8g', credit: '' },     // Docker Maintenance | How to fix the running out of disk space error in Docker?

    /* ── Chương 12 — Chẩn đoán container ── */
    'dk-12-1-phuong-phap': { yt: 'r_YhfX2YKkI', credit: '' },        // Container Troubleshooting: Debugging & Recovery Strategies for Docker Beginners
    'dk-12-2-khong-khoi-dong': { yt: 'kkV6z4bNBGw', credit: '' },    // How to Debug a Docker Container that Doesn't Start?
    'dk-12-3-khoi-dong-roi-chet': { yt: 'pZsoKMLP81o', credit: '' }, // How Do You Troubleshoot Crashed Docker Containers?
    'dk-12-4-dung-hong': { yt: 'yPoRkVaKhYE', credit: '' },          // Docker Container Not Starting? Fix Docker Errors Fast (15 Common Issues Explained)
    'dk-12-5-ket-khoa': { yt: 'fqMOX6JJhGo', credit: '' },           // Docker Tutorial for Beginners - A Full DevOps Course on How to Run Applications in Containers
  },
};
