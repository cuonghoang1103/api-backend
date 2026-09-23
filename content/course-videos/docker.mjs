/**
 * Curated YouTube track for the "Docker" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * 24/09/2026: rà lại cả khoá theo yêu cầu "video chuyên sâu đúng bài" — giữ 24, thay 39 (kênh nghi AI,
 * video chung chung, lệch trọng tâm), thêm 15 cho bài mới (2 bài "Bắt đầu tại đây" + 13 bài slide N.0).
 * Credit = đúng `author_name — title` của oEmbed. Ghép bằng scripts/ghep-video-khoa.mjs (TSV), kiểm bằng
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/docker.mjs --cham
 * (24/09: 78/78 sống, nhúng được, xem được — không members-only).
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'docker',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Docker giải quyết gì, và cài đặt ── */
    'dk-0-5-bat-dau-tai-day': { yt: '3N3n9FzebAA', credit: "dotconferences — dotScale 2013 - Solomon Hykes - Why we built Docker" },
    'dk-0-6-bat-dau-khi-khong-co': { yt: 'zFa9_K8BS8I', credit: "TechWorld with Nana — Learn Docker in 2026 - Complete Roadmap Beginner to Pro" },
    'dk-0-0-slides': { yt: 'xfBbLg6-4xY', credit: "Việt Nguyễn AI — Tất tần tật về Docker trong 10 phút" },
    'dk-0-1-van-de': { yt: 'ZZ10b63xnQc', credit: "KodeKloud — Docker Explained for Absolute Beginners [2026]" },
    'dk-0-2-cai-dat': { yt: 'Ic48-WLhtHg', credit: "Hỏi Dân IT — #2 GETTING STARTED VỚI DOCKER DESKTOP -  CHUẨN BỊ MÔI TRƯỜNG CHO DOCKER |Docker Siêu Dễ Cho Beginner" },
    'dk-0-3-nam-phut': { yt: 'krHjeCT8g3s', credit: "Hỏi Dân IT — #3 HELLO WORLD VỚI DOCKER - CHẠY ỨNG DỤNG ĐẦU TIÊN BẰNG DOCKER | Docker Siêu Dễ Cho Beginners" },

    /* ── Chương 1 — Container & image: mô hình tư duy ── */
    'dk-1-0-slides': { yt: 'sK5i-N34im8', credit: "Docker — Cgroups, namespaces, and beyond: what are containers made from?" },
    'dk-1-1-container-la-gi': { yt: '8fi7uSYlOdc', credit: "GOTO Conferences — Containers From Scratch • Liz Rice • GOTO 2018" },
    'dk-1-2-tang-anh': { yt: 'U_9o_KtffNM', credit: "Krish Dinesh — How Docker REALLY Edits Files 😳 | OverlayFS, COW & Whiteout Explained" },
    'dk-1-3-vong-doi': { yt: 'Orrwfu1lvS8', credit: "CNCF [Cloud Native Computing Foundation] — PID 1, SIG Handling, Hooks & Probes: Managing Container Lifecycle Correctly - Anmol Krishan Sachdeva" },
    'dk-1-4-tang-ghi-duoc': { yt: 'hXbXSRLXiS8', credit: "WhatsCoding — Understanding OverlayFS | OverlayFS | Docker" },
    'dk-1-5-ngan-xep-runtime': { yt: 'RyXL1zOa8Bw', credit: "CNCF [Cloud Native Computing Foundation] — OCI, CRI, ??: Making Sense of the Container Runtime Landscape in Kubernetes - Phil Estes, IBM" },

    /* ── Chương 2 — Chạy container ── */
    'dk-2-0-slides': { yt: 'QTnVztPl2Uw', credit: "Elton Stoneman — Learn Docker in a Month of Lunches: DIAMOL 01" },
    'dk-2-1-docker-run': { yt: 'pry-Vs4Ew6Y', credit: "DheerajTechInsight — Docker CLI Explained | run, exec, logs & inspect (Daily Docker Commands) | Cloud & Devops" },
    'dk-2-2-quan-sat': { yt: 'lZvPcj9kMz4', credit: "DevOps Journey — Using Docker Inspection like a Boss" },
    'dk-2-3-vao-ben-trong': { yt: 'tLK9nNFHWH8', credit: "TechWorld with Nana — Debugging Docker Containers with docker exec and docker logs || Docker Tutorial 5" },
    'dk-2-4-moi-truong-nguoi-dung': { yt: 'vOoCFxlQIbE', credit: "Bret Fisher — Docker Environment Configs, Variables, and Entrypoints" },
    'dk-2-5-gioi-han-restart': { yt: 'mgMhQo279Xk', credit: "Leela Web Dev — 45. Docker HEALTHCHECK Instruction Explained with Examples - #docker" },

    /* ── Chương 3 — Image & registry ── */
    'dk-3-0-slides': { yt: 'F1aMrAqUjQk', credit: "Elton Stoneman — DIAMOL 04: Sharing images with Docker Hub and other registries" },
    'dk-3-1-ten-anh': { yt: 'CvSFl4jI8Hg', credit: "Docker — Container Images Deep Dive (DockerCon 2023)" },
    'dk-3-2-tag-digest': { yt: 'AiAU7wnPCrQ', credit: "anthonywritescode — docker pull by sha256 digest (advanced) anthony explains #537" },
    'dk-3-3-registry': { yt: 'TGLfQZ9qRaI', credit: "package main — Self-Hosting a Container Registry" },
    'dk-3-4-da-kien-truc': { yt: 'jtc28pCkN0k', credit: "Nick Janetakis — Build Multi-CPU Architecture Docker Images with Buildx" },
    'dk-3-5-don-dia': { yt: '3Q0cVWR7RU4', credit: "TroubleChute Linux — Docker Quietly Eats Drives | Docker Prune & Cleanup Guide" },

    /* ── Chương 4 — Dockerfile, từ cơ bản tới trôi chảy ── */
    'dk-4-0-slides': { yt: 'saSJa9YVroA', credit: "Docker — Dockerfile: From Start to Optimized (DockerCon 2023)" },
    'dk-4-1-dockerfile-dau-tien': { yt: 'SnSH8Ht3MIc', credit: "Techno Tim — Build YOUR OWN Dockerfile, Image, and Container - Docker Tutorial" },
    'dk-4-2-cac-chi-thi': { yt: '1ymi24PeF3M', credit: "Cloud Champ — Dockerfile creation Tutorial - Dockerfile Instructions Explained with example!" },
    'dk-4-3-cmd-entrypoint': { yt: 'U1P7bqVM7xM', credit: "Manuel Castellin — Docker ENTRYPOINT vs CMD With Examples - Docker Development Tips & Tricks" },
    'dk-4-4-arg-env': { yt: 'MaoGm1rO_Qc', credit: "Mohamad Lawand — Understanding Docker Args vs Env [Weekly Tech Tips]" },
    'dk-4-5-cong-thuc': { yt: 'W8yZUCzy4SI', credit: "KodeKloud — Docker Init Explained: Your Shortcut to Effortless Containerization" },

    /* ── Chương 5 — Tầng ảnh, cache & dựng nhanh ── */
    'dk-5-0-slides': { yt: 'kkpQ_UZn2uo', credit: "Docker — Supercharged Docker Build with BuildKit" },
    'dk-5-1-cache-quyet-dinh': { yt: 'dSpOBSRJFwg', credit: "Amigoscode — Docker Tutorial - Improve Docker builds with Caching and Layers" },
    'dk-5-2-thu-tu': { yt: 'oZ9nyCWERYc', credit: "kubucation — Proper DOCKER CACHING: Speed up your build with this optimized Dockerfile" },
    'dk-5-3-cache-mount': { yt: '8fILYOtoesQ', credit: "Nilesh Gule — Supercharge Docker builds using Cache Mount" },
    'dk-5-4-cache-ci': { yt: '77j6JFBTmTc', credit: "anthonywritescode — docker: fast CI rebuilds with --cache-from (intermediate) anthony explains #448" },
    'dk-5-5-chan-doan-dung-cham': { yt: '3B89b_gXAPU', credit: "Ardan Labs — Docker BuildKit Tutorial: Why do we need a new Docker Builder?" },

    /* ── Chương 6 — Ảnh nhỏ và an toàn ── */
    'dk-6-0-slides': { yt: '8vXoMqWgbQQ', credit: "TechWorld with Nana — Top 8 Docker Best Practices for using Docker in Production" },
    'dk-6-1-multi-stage': { yt: 'V0kTEk7YA70', credit: "Raghav Dua — Docker Multistage builds explained in 8 minutes" },
    'dk-6-2-chon-anh-nen': { yt: '82ZCJw9poxM', credit: "DevOps & AI Toolkit — Containers Are Not VMs! Which Base Container (Docker) Images Should We Use?" },
    'dk-6-3-cat-kich-thuoc': { yt: 't779DVjCKCs', credit: "Better Stack — Docker Image BEST Practices - From 1.2GB to 10MB" },
    'dk-6-4-chay-an-toan': { yt: 'CQLtT_qeB40', credit: "HackerSploit — How To Secure & Harden Docker Containers" },
    'dk-6-5-quet-chuoi-cung-ung': { yt: 'Kibk6qq7ZCs', credit: "Aqua Security Open Source — Generate SBOMs with Trivy & Scan SBOMs for vulnerabilities" },

    /* ── Chương 7 — Dữ liệu: volume, bind mount, tmpfs ── */
    'dk-7-0-slides': { yt: 'aEqxUnZuh8A', credit: "Elton Stoneman — DIAMOL 05: Using Docker volumes for persistent storage" },
    'dk-7-1-ba-cach-gan': { yt: 'BJ-KwdBvbVE', credit: "Pål-Kristian Hamre — Docker Volumes Explained: Bind Mount vs Named Volume vs tmpfs" },
    'dk-7-2-volume': { yt: 'r1tIdACdJeE', credit: "Network Direction — Learn Docker Storage (Volumes & Bind Mounts) | Docker Tutorial" },
    'dk-7-3-bind-mount': { yt: 'g76hYK4rTxw', credit: "Hỏi Dân IT — #8 DEV SERVER VỚI DOCKER BIND MOUNTS - LIVE RELOADING CODE | Docker Siêu Dễ Cho Beginners Từ A đến Z" },
    'dk-7-4-tmpfs-bi-mat': { yt: 'oU2nNBwlOTA', credit: "Infisical — The Best Way to Manage .env Variables in Docker (Compose, Secrets & More)" },
    'dk-7-5-sao-luu': { yt: 'ZEy8iFbgbPA', credit: "Christian Lempa — Migrate Docker Volumes from one Host to another // backup and restore" },

    /* ── Chương 8 — Mạng ── */
    'dk-8-0-slides': { yt: 'k1SwXOxvMdE', credit: "XuanThuLab — D05 - Mạng | Networking trong Docker, tạo và quản lý network trong container Docker" },
    'dk-8-1-mang-bridge': { yt: 'bKFMS5C4CG0', credit: "NetworkChuck — Docker networking is CRAZY!! (you NEED to learn it)" },
    'dk-8-2-cong-bo-cong': { yt: 'bpWytcz4uMw', credit: "Awesome Open Source — Docker and Firewalls - Docker wants to punch holes in the local firewall, let's mitigate that issue" },
    'dk-8-3-goi-nhau': { yt: 'itZ_x_nDBxU', credit: "Matt Williams — Docker Networking Made Simple: Connecting Containers Like a Pro" },
    'dk-8-4-toi-may-chu': { yt: 'NZGu-9KQVsE', credit: "anthonywritescode — docker: connecting to localhost outside the container (intermediate) anthony explains #555" },
    'dk-8-5-chan-doan-mang': { yt: 'wqtEUFDdZXU', credit: "VirtualizationHowto — Netshoot Docker container for Docker compose networking host troubleshooting" },

    /* ── Chương 9 — Docker Compose ── */
    'dk-9-0-slides': { yt: 'WX0YLs1Jnjs', credit: "Hỏi Dân IT — #10 DOCKER COMPOSE -  Dung Hợp Ứng Dụng Docker Thành Duy Nhất | Docker Siêu Dễ Cho Beginners" },
    'dk-9-1-file-dau-tien': { yt: 'HGKfE-cn9y4', credit: "typecraft — Master Docker Compose the Way I Wish I Did – Docker for Newbs EP 2" },
    'dk-9-2-tra-cuu-dich-vu': { yt: 'n7fuMqisdR4', credit: "Sarvin Style Coding — Docker Compose Tutorial for Beginners (2026) | Run Multiple Containers with YAML" },
    'dk-9-3-thu-tu-khoi-dong': { yt: 'jf6sQsz0M1M', credit: "TECH SCHOOL — [Backend #25] How to write docker-compose file and control service start-up orders with wait-for.sh" },
    'dk-9-4-bien-profile': { yt: 'pgf0Tc1ugEY', credit: "Nick Janetakis — Docker Compose v2 and Profiles Are the Best Thing Ever" },
    'dk-9-5-nhieu-file': { yt: 'VOyyGX1MOU0', credit: "Docker — Docker Compose to the Rescue for Complex Projects (DockerCon 2023)" },

    /* ── Chương 10 — Compose trong đời thật ── */
    'dk-10-0-slides': { yt: 'YMBT1NguJJw', credit: "Anton Putra — Docker Compose Tutorial for Beginners (Networks - Volumes - Secrets - Postgres - Letsencrypt)" },
    'dk-10-1-ban-ve': { yt: 'SXwC9fSwct8', credit: "TechWorld with Nana — Ultimate Docker Compose Tutorial" },
    'dk-10-2-tang-du-lieu': { yt: 'aetqo2nkQcA', credit: "Ben Awad — Docker Compose Node.js, Redis, and PostgreSQL" },
    'dk-10-3-api-migration': { yt: 'OzU3rh0ROt8', credit: "OpenJS Foundation — Master Production-grade Best Practices to Build your Node.js Docker Images - Liran Tal, Snyk" },
    'dk-10-4-frontend': { yt: '-XiPUoCIKSw', credit: "ByteGrad — Docker + Next.js Best Practices (Depot)" },
    'dk-10-5-nginx-lap-rap': { yt: 'J9jKKeV1XVE', credit: "Programonaut — How to Secure Your Applications with HTTPS Using Docker, NGINX, and Let's Encrypt" },

    /* ── Chương 11 — Chạy trên production ── */
    'dk-11-0-slides': { yt: 'F-9KWQByeU0', credit: "Dreams of Code — Setting up a production ready VPS is a lot easier than I thought." },
    'dk-11-1-restart': { yt: 'CsIZy4mBM5A', credit: "DheerajTechInsight — Docker Healthchecks & Restart Policies Explained | Make Containers Production-Ready | Cloud & Devops" },
    'dk-11-2-han-muc-137': { yt: '1wH0KyQ5kiE', credit: "Mr. Singh — Resource Managment in Docker -12 | how to limit CPU and memory in a container| Resource Utilisation" },
    'dk-11-3-log': { yt: 'Zlj39xXPu2k', credit: "Better Stack — Docker Logging - \"docker logs\" Command | Log Drivers | Logging Strategies" },
    'dk-11-4-cap-nhat-quay-lui': { yt: '-9LhRHXWjrc', credit: "Petabridge — Continuous Deployment of Docker Compose Applications Using GitHub Actions" },
    'dk-11-5-dia-giam-sat': { yt: 'w77eQ8LMn8g', credit: "kubernetesWay — Docker Maintenance | How to fix the running out of disk space error in Docker?" },

    /* ── Chương 12 — Chẩn đoán container ── */
    'dk-12-0-slides': { yt: 'dLlxAzKVZNg', credit: "Docker — Debugging Innovation with Docker (DockerCon 2023)" },
    'dk-12-1-phuong-phap': { yt: 'DK1ew1HpmeY', credit: "Docker — Troubleshooting Tips from a Docker Support Engineer" },
    'dk-12-2-khong-khoi-dong': { yt: 'kkV6z4bNBGw', credit: "DotComIt — How to Debug a Docker Container that Doesn't Start?" },
    'dk-12-3-khoi-dong-roi-chet': { yt: 'PYssZ081c3I', credit: "NextOps Videos — 11 Troubleshooting Docker Containers - Container Logs, Restart Policies" },
    'dk-12-4-dung-hong': { yt: 'hd1AKYGiWNk', credit: "anthonywritescode — debugging a failed docker build (intermediate) anthony explains #339" },
    'dk-12-5-ket-khoa': { yt: 'fqMOX6JJhGo', credit: "freeCodeCamp.org — Docker Tutorial for Beginners - A Full DevOps Course on How to Run Applications in Containers" },
  },
};
