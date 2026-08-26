/**
 * Curated YouTube track for the "Observability & Monitoring" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id dưới đây lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong
 * đợi ghi ở chú thích cuối dòng. Nhưng máy dựng khoá bị chặn ra youtube.com
 * (proxy trả "CONNECT tunnel failed, response 403") nên KHÔNG gọi được oEmbed
 * ⇒ không đọc được TÊN KÊNH và không biết video có cho nhúng hay không.
 * Vì vậy `credit` để '' — verify coi credit rỗng là HỢP LỆ, và `--fix-credits`
 * sẽ điền đúng `Kênh — Tiêu đề` lấy thẳng từ YouTube.
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ, ĐỪNG BỎ LỆNH ĐẦU:
 *   node scripts/verify-youtube-videos.mjs \
 *     --file ./content/course-videos/observability-monitoring.mjs --fix-credits
 *   node scripts/course-video-seed.mjs \
 *     --file ./content/course-videos/observability-monitoring.mjs --apply
 *
 * Lệnh đầu vừa điền credit vừa in ra link nào đã chết (✗) — thay link đó rồi
 * chạy lại. `course-video-seed.mjs` sẽ TỪ CHỐI --apply khi còn credit rỗng, để
 * không thể lỡ tay seed một bản chưa xác minh (bỏ chốt: --cho-phep-thieu-credit).
 *
 * Đối chiếu nội dung: nếu credit mà --fix-credits điền vào lệch hẳn với tiêu đề
 * mong đợi ở chú thích cùng dòng thì id đó trỏ nhầm video — báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'observability-monitoring',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Trước khi đo bất cứ thứ gì ── */
    'obs-0-1-vi-sao': { yt: 'ytx6jr2TyxI', credit: 'Better Stack — Observability vs Monitoring - Whats the difference?' },            // Observability vs Monitoring - Whats the difference?
    'obs-0-2-ba-tru-cot': { yt: 'z6LPU6YUmtU', credit: 'SystemDR - Scalable System Design  — Observability Explained | Logs, Metrics & Traces (The Three Pillars)' },        // Observability Explained | Logs, Metrics & Traces (The Three Pillars)
    'obs-0-3-dung-moi-truong': { yt: 'kAVBNgsrtik', credit: 'Rayan Slim — Prometheus & Grafana: Docker Compose Monitoring Tutorial' },   // Prometheus & Grafana: Docker Compose Monitoring Tutorial
    'obs-0-4-cach-hoc': { yt: 'h1s_WNwSPkY', credit: 'José Cruz (IT Architect) — Observability: Introduction, architecture and Logs, Metrics & Traces Explained (Ep. 01)' },          // Observability: Introduction, architecture and Logs, Metrics & Traces Explained (Ep. 01)

    /* ── Chương 1 — Log có cấu trúc, và cái giá của nó ── */
    'obs-1-1-tu-console-toi-json': { yt: 'fluDEkA1h6w', credit: 'Better Stack — Pino JS - Logging in JavaScript / Node.js applications' },   // Pino JS - Logging in JavaScript / Node.js applications
    'obs-1-2-cai-gi-thuoc-ve': { yt: '53qCLRFcBSs', credit: 'Debug Agent — Logging Best Practices: Kill the bug, not the rainforest | debug agent' },       // Logging Best Practices: Kill the bug, not the rainforest | debug agent
    'obs-1-3-muc-log': { yt: 'myxlDVC2K74', credit: 'Better Stack — Log Levels Explained (with practical examples!)' },               // Log Levels Explained (with practical examples!)
    'obs-1-4-chi-phi-that': { yt: 'vETUVN-KEgc', credit: 'Nearform — Multithreaded Logging with Pino - Matteo Collina' },          // Multithreaded Logging with Pino - Matteo Collina
    'obs-1-5-stdout-la-mot-cai-ong': { yt: 'sSTdwoP1k8s', credit: 'Leela Web Dev — 16. NodeJS Streams focusing on memory management, internal buffering & handling backpressure' }, // NodeJS Streams focusing on memory management, internal buffering & handling backpressure

    /* ── Chương 2 — Đường ống log: từ stdout tới chỗ hỏi được ── */
    'obs-2-1-docker-bat-log': { yt: 'Zlj39xXPu2k', credit: 'Better Stack — Docker Logging - "docker logs" Command | Log Drivers | Logging Strategies' },   // Docker Logging - "docker logs" Command | Log Drivers | Logging Strategies
    'obs-2-2-xoay-vong': { yt: 'pDQzadfUfpE', credit: 'Sematext — Docker Log Rotation Configuration | Container Logging for Beginners - Sematext' },        // Docker Log Rotation Configuration | Container Logging for Beginners - Sematext
    'obs-2-3-trinh-thu-log': { yt: 'D2IL8DC9bAI', credit: 'Nodematic Tutorials — Intro to Grafana Loki Log Streams (Promtail Example)' },    // Intro to Grafana Loki Log Streams (Promtail Example)
    'obs-2-4-logql': { yt: 'VEGYgPiAazk', credit: 'Laszlo Fogas — Grafana Loki querying basics, log based metrics and setting alerts on logs' },            // Grafana Loki querying basics, log based metrics and setting up alerts
    'obs-2-5-luu-tru': { yt: 'bmdymMVzZ6g', credit: 'Edge Delta — Reduce Observability Costs Through Logs-to-Metric Conversions with Telemetry Pipelines' },   // Reduce Observability Costs Through Logs-to-Metric Conversions with Telemetry Pipelines

    /* ── Chương 3 — Nối một yêu cầu thành một sợi ── */
    'obs-3-1-id-di-den-hu-vo': { yt: 'OaHXz3iiw1U', credit: 'CodeSpace — How To Use CorrelationId in Node Js Microservices' },  // How To Use CorrelationId in Node Js Microservices
    'obs-3-2-asynclocalstorage': { yt: 'ukefzxZ_G9U', credit: 'This Dot Media — Async Context Tracking in Node with Async Local Storage API ft. James Snell | JS Drops' },// Async Context Tracking in Node with Async Local Storage API ft. James Snell | JS Drops
    'obs-3-3-qua-ranh-gioi': { yt: 'ySXZ60R_2_M', credit: 'Concept && Coding - by Shrayansh — Distributed Logging (Part-4) | End-to-End Distributed Logging with MDC + Correlation ID + Trace ID' },    // Distributed Logging (Part-4) | End-to-End Distributed Logging with MDC + Correlation ID + Trace ID
    'obs-3-4-trace-context': { yt: 'lnfKAexAC_E', credit: 'DevOps Hint — OpenTelemetry Context Propagation Explained | Trace ID, Span ID, Baggage & W3C Headers|Observability' },    // OpenTelemetry Context Propagation Explained | Trace ID, Span ID, Baggage & W3C Headers
    'obs-3-5-mot-su-co-ke-hai-lan': { yt: 'yumiqUFbneE', credit: 'CodeLucky — Distributed Tracing Explained: Request Tracking Across Microservices with Trace IDs & Spans' }, // Distributed Tracing Explained: Request Tracking Across Microservices with Trace IDs & Spans

    /* ── Chương 4 — Chỉ số: đếm cái mà log không đếm nổi ── */
    'obs-4-1-bon-loai-chi-so': { yt: 'xRruZ-62QB8', credit: 'DevOps Hint — Prometheus Metrics Types with Real Life Examples | Counter, Gauge, Histogram, Summary in Prometheus' },  // Prometheus Metrics Types with Real Life Examples | Counter, Gauge, Histogram, Summary
    'obs-4-2-trung-binh-noi-doi': { yt: '3JdQOExKtUY', credit: 'Hussein Nasser — Percentile Tail Latency Explained (95%, 99%) Monitor Backend performance with this metric' },// Percentile Tail Latency Explained (95%, 99%) Monitor Backend performance with this metric
    'obs-4-3-histogram': { yt: 'yYbXak-1hew', credit: 'Prometheus Monitoring with Julius | PromLabs — Understanding Prometheus Histograms | Motivation and Concepts, Instrumentation, Querying in PromQL' },        // Understanding Prometheus Histograms | Motivation and Concepts, Instrumentation, Querying in PromQL
    'obs-4-4-luc-luong-nhan': { yt: '_6iXRW3BG1U', credit: 'USENIX — SREcon24 Americas - The Sins of High Cardinality' },   // SREcon24 Americas - The Sins of High Cardinality
    'obs-4-5-thu-thap-cai-gi': { yt: 'OTqikK7bbik', credit: 'Interview Kickstart US — Four Golden Signals for Monitoring Systems | Site Reliability Engineering (SRE)' },  // Four Golden Signals for Monitoring Systems | Site Reliability Engineering (SRE)

    /* ── Chương 5 — Những chỉ số chỉ Node.js mới kể được ── */
    'obs-5-1-tre-vong-lap': { yt: '9YbNdrbZv5s', credit: 'Codeminer42 — Monitoring the event loop lag in a Node.js application, Paulo Souza' },     // Monitoring the event loop lag in a Node.js application, Paulo Souza
    'obs-5-2-bo-nho': { yt: 'csKfZpmcCjk', credit: 'DevTools99 — Node js Memory Leaks Finding and Fixing with Heap Snapshots' },           // Node js Memory Leaks Finding and Fixing with Heap Snapshots
    'obs-5-3-thu-gom-rac': { yt: 'ZhbIReLe-r8', credit: 'Gaurav Sen — Garbage Collection Algorithms: Mark Sweep, Generation Hypothesis and JIT code injection' },      // Garbage Collection Algorithms: Mark Sweep, Generation Hypothesis and JIT code injection
    'obs-5-4-be-va-handle': { yt: 'Cp-aFYHLiCw', credit: 'Devoxx — Database Connection Pool Sizing - Demystified! by Jasmin Fluri' },     // Database Connection Pool Sizing - Demystified! by Jasmin Fluri
    'obs-5-5-bat-het-len': { yt: 'w-eIAFJV8s4', credit: 'evan ugarte — Add custom metrics to Express.js server with prom-client | Node Application Monitoring part 2' },      // Add custom metrics to Express.js server with prom-client | Node Application Monitoring part 2

    /* ── Chương 6 — Trace: thời gian thật sự đi đâu ── */
    'obs-6-1-span-la-gi': { yt: 'yM2BiSo45M0', credit: 'OpenInfra Foundation — The Anatomy of a Distributed Trace' },       // The Anatomy of a Distributed Trace
    'obs-6-2-otel-trong-node': { yt: 'NbVVZlSsvvM', credit: 'Better Stack — OpenTelemetry in Node.js - Traces, Metrics and Logs' },  // OpenTelemetry in Node.js - Traces, Metrics and Logs
    'obs-6-3-lay-mau': { yt: '4bjIkpnen3s', credit: 'Grafana — Tail sampling vs. head sampling in distributed tracing' },          // Tail sampling vs. head sampling in distributed tracing
    'obs-6-4-doc-bieu-do-thac': { yt: 'Oa-zqv-EBpw', credit: 'DevOps & AI Toolkit — Distributed Tracing Explained: OpenTelemetry & Jaeger Tutorial' }, // Distributed Tracing Explained: OpenTelemetry & Jaeger Tutorial
    'obs-6-5-khi-nao-khong-dang': { yt: 'Pu-HiD2QksI', credit: 'Amplication — Distributed tracing & OpenTelemetry in Node.js: Masterclass' },// Distributed tracing & OpenTelemetry in Node.js: Masterclass

    /* ── Chương 7 — Lỗi: trụ cột có tên người đứng sau ── */
    'obs-7-1-loi-khong-phai-log': { yt: 'DzhVEK65eYg', credit: 'Sentry — Sentry 101: Error Monitoring For Backend Applications' },      // Sentry 101: Error Monitoring For Backend Applications
    'obs-7-2-gom-nhom': { yt: 'PopiUAcACfg', credit: 'Sentry — How Grouping Works | Sentry Tutorials' },                // How Grouping Works | Sentry Tutorials
    'obs-7-3-pii': { yt: 'DUILYgs3YLQ', credit: 'Digitam — L06 - How to Redact Sensitive Data from Logs in Datadog' },                     // L06 - How to Redact Sensitive Data from Logs in Datadog
    'obs-7-4-release-va-noi-lai': { yt: 'LF1ill9Nu6w', credit: 'Sentry — How to upload source maps to Sentry' },      // How to upload source maps to Sentry
    'obs-7-5-khong-can-nha-cung-cap': { yt: 'tXf7GrfTsuQ', credit: 'Elestio — GlitchTip: Free Open Source Sentry alternative' },  // GlitchTip: Free Open Source Sentry alternative

    /* ── Chương 8 — Kiểm tra sức khoẻ nói được điều gì ── */
    'obs-8-1-bon-luot-tham-do': { yt: 'fqfieWP1jY4', credit: 'Anton Putra — Kubernetes Health Checks: Liveness vs. Readiness vs. Startup Probe' }, // Kubernetes Health Checks: Liveness vs. Readiness vs. Startup Probe
    'obs-8-2-tu-ban-vao-chan': { yt: 'FAMmbzHm_kg', credit: 'R3ap3rPy — Kubernetes - Liveness, readiness and startup probes' },  // Kubernetes - Liveness, readiness and startup probes
    'obs-8-3-cua-so-deploy': { yt: 'EjOYI1qPdZg', credit: 'Krish Dinesh — How to design Zero Downtime Deployments' },    // How to design Zero Downtime Deployments
    'obs-8-4-kiem-sau-toi-dau': { yt: 'x2e6pIBLKzw', credit: 'Tech Tutorials with Piyush — Day 18/40 - Kubernetes Health Probes Explained | Liveness vs Readiness Probes' }, // Day 18/40 - Kubernetes Health Probes Explained | Liveness vs Readiness Probes
    'obs-8-5-kiem-tu-ben-ngoai': { yt: 'aPA9Ow-QsgY', credit: 'Electronics For You — Monitoring website uptime, performance and SSL certificate expiry using Prometheus' },// Monitoring website uptime, performance and SSL certificate expiry using Prometheus
    'obs-9-1-loi-hua-danh-thuc': { yt: 'GiaYg19-OTM', credit: 'DevopsGuru — Prometheus - How to setup AlertManager in Prometheus' },   // Prometheus - How to setup AlertManager in Prometheus

    /* ── Chương 9 — Cảnh báo: một lời hứa đánh thức người ── */
    'obs-9-2-nguong-suy-ra': { yt: '9joXN3ipABg', credit: 'DevOps Hint — Alerting Rules in Prometheus | Prometheus Tutorial for Beginners | Prometheus Alertmanager Tutorial' },       // Alerting Rules in Prometheus | Prometheus Tutorial for Beginners
    'obs-9-3-slo-va-toc-do-dot': { yt: 'F0vIIxoBom0', credit: 'Data on Kubernetes Community (DoKC) — How to Alert on SLOs using Error Budget Burn Rate // DoK Talks #81' },   // How to Alert on SLOs using Error Budget Burn Rate // DoK Talks #81
    'obs-9-4-met-moi-va-truc-ca': { yt: 'fmV2rCXwIhw', credit: 'Container Solutions — Paige Cruz - Avoiding Alert Bankruptcy and Burnout - WTF is SRE? 2023' },  // Paige Cruz - Avoiding Alert Bankruptcy and Burnout - WTF is SRE? 2023

    /* ── Chương 10 — Bảng theo dõi người ta thật sự đọc ── */
    'obs-10-1-danh-cho-ai': { yt: 'RQQhYiOC5kw', credit: 'Bhoopesh Sharma — How to Build Grafana Dashboards in 2026 | Step-by-Step Explained' },     // How to Build Grafana Dashboards in 2026 | Step-by-Step Explained
    'obs-10-2-do-thi-noi-doi': { yt: 'E91bGT9BjYk', credit: 'TED-Ed — How to spot a misleading graph - Lea Gaslowitz' },  // How to spot a misleading graph - Lea Gaslowitz (TED-Ed)
    'obs-10-3-ba-cu-bam': { yt: '0G5dDDZLrVI', credit: 'Grafana — Grafana Campfire 🔥- Data Visualization Tips and Best Practices (Grafana Community Call- April 2025)' },       // Grafana Campfire - Data Visualization Tips and Best Practices (April 2025)

    /* ── Chương 11 — Chẩn đoán: từ cảnh báo tới nguyên nhân ── */
    'obs-11-1-nam-phut-dau': { yt: 'Gf_3BXTp9Ew', credit: 'Checkly — Incident Management 101' },    // Incident Management 101
    'obs-11-2-bay-hinh-dang': { yt: 'xrizarXJgC8', credit: 'Gaurav Sen — How to avoid cascading failures in a distributed system 💣💥🔥' },   // How to avoid cascading failures in a distributed system
    'obs-11-3-bon-su-co-that': { yt: 'qzzv_Us0hrY', credit: 'HAMY LABS — How Meta runs blameless Post-mortems at scale - Efficient incident reviews for a Product org of 30k' },  // How Meta runs blameless Post-mortems at scale
    'obs-11-4-ban-ghi-lai': { yt: 'Wv4loyVa048', credit: 'Simple Thinker — Incident Postmortems: Creating a Blameless SRE Culture | Blameless Retrospectives' },     // Incident Postmortems: Creating a Blameless SRE Culture | Blameless Retrospectives

    /* ── Chương 12 — Cái gì sống sót qua phép đo ── */
    'obs-12-1-moi-con-so': { yt: '35N2buePMsg', credit: 'Merge Ready — Monitoring vs Observability: Logs, Metrics, Traces, APM, RUM & Costs' },      // Monitoring vs Observability: Logs, Metrics, Traces, APM, RUM & Costs
    'obs-12-2-dung-cai-gi-truoc': { yt: 'rnnhtzIgjvQ', credit: 'IBM Technology — Simplify application monitoring with SRE Golden Signals' },// Simplify application monitoring with SRE Golden Signals
  },
};
