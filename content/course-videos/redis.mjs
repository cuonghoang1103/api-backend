/**
 * Curated YouTube track for the "Redis" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/redis.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/redis.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'redis',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Redis giải quyết gì, và cài đặt ── */
    'rd-0-1-van-de': { yt: 'OqCK95AS-YE', credit: 'TechWorld with Nana — Redis Crash Course - the What, Why and How to use Redis as your primary database' },  // Redis Crash Course - the What, Why and How to use Redis as your primary database
    'rd-0-2-cai-dat': { yt: 'qucL1F2YEKE', credit: 'CodeWithRajRanjan — Install Redis using docker and docker compose | Redis Insight docker installation' },   // Install Redis using docker and docker compose | Redis Insight docker installation
    'rd-0-3-nam-phut': { yt: 'Hbt56gFj998', credit: 'Traversy Media — Redis Crash Course Tutorial' },// Redis Crash Course Tutorial

    /* ── Chương 1 — Mô hình thực thi ── */
    'rd-1-1-mot-luong': { yt: 'mNazo-NqHow', credit: 'Lazy Programmer — How Redis Handles 100,000+ Requests with Just ONE Thread' },    // How Redis Handles 100,000+ Requests with Just ONE Thread
    'rd-1-2-vong-doi-lenh': { yt: 'XJVl6BsV0_0', credit: 'Mayank Joshi — Design Redis System Design Architecture | RESP, Event Loop and Data Storage| By Microsoft SDE' },// Design Redis System Design Architecture | RESP, Event Loop and Data Storage | By Microsoft SDE
    'rd-1-3-resp': { yt: 'wnHZHGc8tW8', credit: 'Arpit Bhayani — Implementing Redis\' Wire Protocol - RESP | Redis Internals' },         // Implementing Redis' Wire Protocol - RESP | Redis Internals
    'rd-1-4-pipeline': { yt: 'U2IFZ_hw91o', credit: 'Arpit Bhayani — Event Loops Internals And How Redis Handles Multiple Connects on a Single Thread | Redis Internals' },     // Event Loops Internals And How Redis Handles Multiple Connects on a Single Thread | Redis Internals
    'rd-1-5-client-pool': { yt: 'dQV0xzOeGzU', credit: 'Better Stack — Modern Redis Crash Course: Backend with Express, TypeScript and Zod' },  // Modern Redis Crash Course: Backend with Express, TypeScript and Zod

    /* ── Chương 2 — Khoá, TTL và hết hạn ── */
    'rd-2-1-dat-ten-khoa': { yt: 'Q_ie-hl3GzM', credit: 'Dilruba Köse — Redis Crash Course 🚀 🚀' }, // Redis Crash Course
    'rd-2-2-het-han': { yt: 'Z_NpHS1sw-U', credit: 'Eric Tech — Master Redis EXPIRE and TTL Secrets' },      // Master Redis EXPIRE and TTL Secrets
    'rd-2-3-scan-unlink': { yt: 'JX9Zxk3Evy8', credit: 'LevelUp With Suhail — Access and Delete Keys in Redis | CLI + Java (Ep 04)' },  // 04 Redis Keys Explained: Access & Delete Using CLI and Java (Best Practices)
    'rd-2-4-thong-bao': { yt: 'enc0b3jpBRA', credit: 'Amazon Web Services — How do I implement Redis keyspace notifications in ElastiCache?' },    // How do I implement Redis keyspace notifications in ElastiCache?
    'rd-2-5-db-lenh-khoa': { yt: 'I0esXDazvIM', credit: 'Very Academy — Redis | Managing Expiration with EXPIRE, TTL, and Lifetimes' }, // Redis | Managing Expiration with EXPIRE, TTL, and Lifetimes

    /* ── Chương 3 — Chuỗi, bộ đếm, bitmap, HyperLogLog ── */
    'rd-3-1-chuoi': { yt: 'Z1ep4LaDbDc', credit: 'Hustle With Aditya — Redis Tutorial for Beginners - 5 | Redis Data Types' },            // Redis Tutorial for Beginners - 5 | Redis Data Types
    'rd-3-2-bo-dem': { yt: 'oMPrWwH3oFg', credit: 'Very Academy — Redis | Using Strings as Counters: INCR, DECR' },           // Redis | Using Strings as Counters: INCR, DECR
    'rd-3-3-bitmap': { yt: 'H604RKPS9SM', credit: 'Eric Tech — Learn Redis Data Structures w/ Redis Cloud | STRING, LIST, HASHES, SETS, SORTED SETS and MORE' },           // Learn Redis Data Structures w/ Redis Cloud | STRING, LIST, HASHES, SETS, SORTED SETS and MORE
    'rd-3-4-hyperloglog': { yt: 'MunL8nnwscQ', credit: 'Redis — Redis HyperLogLog Explained' },      // Redis HyperLogLog Explained
    'rd-3-5-gioi-han-tan-suat': { yt: 'YV4ePyW3DO8', credit: 'Redis — Rate limiting with Redis: An essential guide' },// Rate limiting with Redis: An essential guide

    /* ── Chương 4 — List, Set và Sorted Set ── */
    'rd-4-1-list': { yt: 'FCtPVO_E1aQ', credit: 'Redis — Redis Data Structures' },          // Redis Data Structures
    'rd-4-2-set': { yt: 'jgpVdJB2sKQ', credit: 'Web Dev Simplified — Redis Crash Course' },           // Redis Crash Course
    'rd-4-3-zset': { yt: 'MUKlxdBQZ7g', credit: 'Redis — Redis Sorted Sets Explained' },          // Redis Sorted Sets Explained
    'rd-4-4-zset-thuc-te': { yt: '9yEPu8oSrhI', credit: 'SystemDR - Scalable System Design  — Designing Real-Time Leaderboards: Redis Sorted Sets and Architecture Patterns' },  // Designing Real-Time Leaderboards: Redis Sorted Sets and Architecture Patterns
    'rd-4-5-chon-cau-truc': { yt: '0_1x8NnQDPg', credit: 'The Theory Of Code — Redis Sorted Set Data Type -  Redis An In memory NoSQL Database' }, // Redis Sorted Set Data Type - Redis An In memory NoSQL Database

    /* ── Chương 5 — Hash và cách mô hình hoá một đối tượng ── */
    'rd-5-1-hash': { yt: 'nns1mhlxTJ8', credit: 'TechByAni — L23. Redis Crash Course | Hands-On with Node.js & Docker | System Design' },              // L23. Redis Crash Course | Hands-On with Node.js & Docker | System Design
    'rd-5-2-ma-hoa-bo-nho': { yt: 'g6AKdCBVyyg', credit: 'vlogize — How to Easily Calculate Redis Memory Usage for Monitoring and Alerts' },     // How to Easily Calculate Redis Memory Usage for Monitoring and Alerts
    'rd-5-3-mo-hinh-doi-tuong': { yt: 'brw3uVmQgZ8', credit: 'Josh tried coding — Modern Redis in 40 Minutes | Crash Course 2023' }, // Modern Redis in 40 Minutes | Crash Course 2023
    'rd-5-4-hexpire': { yt: 'I0esXDazvIM', credit: 'Very Academy — Redis | Managing Expiration with EXPIRE, TTL, and Lifetimes' },   // Redis | Managing Expiration with EXPIRE, TTL, and Lifetimes
    'rd-5-5-hash-thuc-te': { yt: 'OCOWjTPu9DI', credit: 'ProgrammingKnowledge — Redis Crash Course | Redis Tutorial' },      // Redis Crash Course | Redis Tutorial

    /* ── Chương 6 — Làm bộ đệm cho đúng ── */
    'rd-6-1-bon-khuon': { yt: 'ETvLl-8bPbo', credit: 'System Design Lab — Caching For System Design: Redis, CDN, Cache Patterns Explained' },  // Caching For System Design: Redis, CDN, Cache Patterns Explained
    'rd-6-2-day-khoa-cu': { yt: '8A6s9d0jnWI', credit: 'Software With Shawn — Caching Strategies With Redis' },// Caching Strategies With Redis
    'rd-6-3-giam-dap': { yt: 'CesxZqA1LDk', credit: 'TheTechDump — Cache Stampede / Thundering Herd Deep Dive: What Causes It and How to Fix It 🔥' },   // Cache Stampede / Thundering Herd Deep Dive: What Causes It and How to Fix It
    'rd-6-4-nhat-quan': { yt: 'rNU3afjpTWc', credit: 'YourTechBud Codes — SAVE Your Database With REDIS!!! Write Through Cache Explained!' },  // SAVE Your Database With REDIS!!! Write Through Cache Explained!
    'rd-6-5-do-bo-dem': { yt: 'HzfdUE-aip8', credit: 'Piyush Garg — Monitor Your Redis DB | BetterDB' },  // Monitor Your Redis DB | BetterDB

    /* ── Chương 7 — Tính nguyên tử: MULTI, WATCH, Lua và Function ── */
    'rd-7-1-multi': { yt: '93MiCYL9OgE', credit: 'Coding with Raphael De Lio — Understanding Transactions In Redis (Getting Started)' },         // Understanding Transactions In Redis (Getting Started)
    'rd-7-2-watch': { yt: 'zCBqXJSoCj0', credit: 'Milan Jovanović — Using Distributed Locking To Solve Race Conditions (and why a simple solution works better)' },         // Using Distributed Locking To Solve Race Conditions (and why a simple solution works better)
    'rd-7-3-lua': { yt: 'eyB3xkfelao', credit: 'PerfectAlgos — Running LUA script into REDIS for running high concurrency and relatively complex logic' },           // Running LUA script into REDIS for running high concurrency and relatively complex logic
    'rd-7-4-functions': { yt: 'uptxcaf2s_4', credit: 'DevMonk — [LIVE]: Implementing Distributed Locking With Redis, Lua Scripting & NodeJS' },     // [LIVE]: Implementing Distributed Locking With Redis, Lua Scripting & NodeJS
    'rd-7-5-khoa-phan-tan': { yt: 'pRaqtVBaSEw', credit: 'Learn In Minutes — The Truth About Redis Distributed Locks' }, // The Truth About Redis Distributed Locks

    /* ── Chương 8 — Pub/Sub và Stream ── */
    'rd-8-1-pubsub': { yt: 'KIFA_fFzSbo', credit: 'Coding with Raphael De Lio — Understanding Redis Pub/Sub (Getting Started)' },        // Understanding Redis Pub/Sub (Getting Started)
    'rd-8-2-stream': { yt: 'rBlnHJZKD_M', credit: 'Coding with Raphael De Lio — Understanding Redis Streams' },        // Understanding Redis Streams
    'rd-8-3-consumer-group': { yt: 'jR4I9nXUuFk', credit: 'Ismail Anjrini — 008 - Redis Stream – Group Consumer - Pending Entries' },// 008 - Redis Stream – Group Consumer - Pending Entries
    'rd-8-4-xclaim': { yt: '_cgkSygZ2yw', credit: 'Ismail Anjrini — 010 - Redis Stream – Group Consumer – Pending Messages' },        // 010 - Redis Stream – Group Consumer – Pending Messages
    'rd-8-5-chon-cong-cu': { yt: 'zcCEFByssQU', credit: 'Interview Pen — Using Redis Streams instead of Kafka - Redis Special Topics (2/4) | System Design' },  // Using Redis Streams instead of Kafka - Redis Special Topics (2/4) | System Design

    /* ── Chương 9 — Bộ nhớ, đẩy khoá và lưu lâu dài ── */
    'rd-9-1-bo-nho-di-dau': { yt: 'QemEy97fiY0', credit: 'ScyllaDB — End-To-End Performance Testing, Profiling, and Analysis at Redis' }, // End-To-End Performance Testing, Profiling, and Analysis at Redis
    'rd-9-2-day-khoa': { yt: 'I4TXUbQoaNg', credit: 'Kartikeya Sharma — Redis Expiration & Eviction Policies | TTL, LRU, LFU, RANDOM' },      // Redis Expiration & Eviction Policies | TTL, LRU, LFU, RANDOM
    'rd-9-3-rdb': { yt: 'KOC3SXfYyIc', credit: 'Geeky Shows — Redis Persistence RDB AOF' },   // Redis Persistence RDB AOF
    'rd-9-4-aof': { yt: '5SnkVoatBpA', credit: 'Arpit Bhayani — Implementing AOF Persistence | Redis Internals' },           // Implementing AOF Persistence | Redis Internals
    'rd-9-5-tu-the-ben': { yt: '1pfvz24BAUs', credit: 'Coding with Raphael De Lio — Understanding Redis Persistence - AOF & RDB + Docker' },    // Understanding Redis Persistence - AOF & RDB + Docker

    /* ── Chương 10 — Vận hành Redis: cấu hình, bảo mật và ACL ── */
    'rd-10-1-cau-hinh': { yt: 'X01gn5a2WQ0', credit: 'Scale Your Code — Configure Redis for Production - Redis Series Episode 9' },    // Configure Redis for Production - Redis Series Episode 9
    'rd-10-2-phoi-ra-mang': { yt: 'oD8k3ymbfkY', credit: 'Redis — RedisConf 2020: Rediscover Redis Security' },// Rediscover Redis Security - RedisConf 2020
    'rd-10-3-acl': { yt: 'tWJqx_5C-cM', credit: 'Liv4IT — Introduction to Redis ACL access control lists' },         // Introduction to Redis ACL access control lists
    'rd-10-4-lam-cung': { yt: 'Gl59KCln0Sw', credit: 'All Hacking Cons — Securing Redis with Sedona  Will Urbanski' },    // Securing Redis with Sedona — Will Urbanski
    'rd-10-5-ket-noi': { yt: 'qX2Eq-M6LDU', credit: 'Knowledge Thrusters — Monitor in Redis | Redis In Laravel | Knowledge Thrusters' },     // Monitor in Redis | Redis In Laravel | Knowledge Thrusters

    /* ── Chương 11 — Mở rộng: nhân bản, Sentinel và Cluster ── */
    'rd-11-1-nhan-ban': { yt: 'rwoMTa0Kx-c', credit: 'Geeky Shows — Redis Replication Master Slave | Redis High Availability' },           // Redis Replication Master Slave | Redis High Availability
    'rd-11-2-gioi-han-nhan-ban': { yt: 'p8mK8GBCARE', credit: 'Hussein Nasser — Replication and Clustering in Redis' },  // Replication and Clustering in Redis
    'rd-11-3-sentinel': { yt: 'fBDRO-d6cZQ', credit: 'ZG9ub3R0cnVzdGJlYX VqYW1pc29yY29sdGVy — Demo: How Redis Sentinel Failover Works' },           // Demo: How Redis Sentinel Failover Works
    'rd-11-4-cluster': { yt: 'GEg7s3i6Jak', credit: 'That DevOps Guy — Redis: How to setup a cluster - for beginners' },            // Redis: How to setup a cluster - for beginners
    'rd-11-5-chon-kien-truc': { yt: '-a07Ief51H4', credit: 'Code Academia — Redis and Redis Sentinel Crash Course - Redis Commands and High Availability tutorial' },     // Redis and Redis Sentinel Crash Course - Redis Commands and High Availability tutorial

    /* ── Chương 12 — Chẩn đoán Redis, và đi tiếp về đâu ── */
    'rd-12-1-nam-phut-dau': { yt: 'HIrlMqbApv0', credit: 'Nick Janetakis — Measuring Redis Network Latency and the Stability of Your Server' },  // Measuring Redis Network Latency and the Stability of Your Server
    'rd-12-2-bay-hinh-dang': { yt: 'DgcBFb4L0dI', credit: 'Anton Putra — Redis vs Dragonfly Performance (Latency - Throughput - Saturation)' }, // Redis vs Dragonfly Performance (Latency - Throughput - Saturation)
    'rd-12-3-bo-cong-cu': { yt: 'Ah6EgdtPcLk', credit: 'zz TALK — Redis latency load testing with JMeter' },    // Redis latency load testing with JMeter
    'rd-12-4-giam-sat': { yt: 'DEPYkdnQz5M', credit: 'Jskool — Monitor Redis easily with Grafana  #redis #grafana' },      // Monitor Redis easily with Grafana
    'rd-12-5-ket-khoa': { yt: 'IJkYipYNEtI', credit: 'Harkirat Singh — Complete Redis, Websockets, Pub Subs and Message queues Bootcamp' },      // Complete Redis, Websockets, Pub Subs and Message queues Bootcamp
  },
};
