/**
 * Curated YouTube track for the "Socket.IO" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/socket-io.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/socket-io.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'socket-io',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Socket.IO thật ra là cái gì ── */
    'io-0-1-la-gi': { yt: '1BfCnjr_Vjg', credit: '' },     // WebSockets in 100 Seconds & Beyond with Socket.io
    'io-0-2-long-poll': { yt: 'sUEq35F-ELY', credit: '' }, // Polling vs WebSockets vs Socket.IO (Simple Explanation) - Chat App Part11
    'io-0-3-tren-day': { yt: 'TzCp9OrCmog', credit: '' },  // How does the WebSocket protocol works under the hood

    /* ── Chương 1 — Vòng đời của một kết nối ── */
    'io-1-1-connect': { yt: 'vQjiN8Qgs3c', credit: '' },    // WebSockets (using Socket.io) Tutorial #1 - What Are WebSockets?
    'io-1-2-disconnect': { yt: 'UwS3wJoi7fY', credit: '' }, // WebSockets (using Socket.io) Tutorial #3 - Using Socket.io
    'io-1-3-reconnect': { yt: 'uVTSBsUmB7A', credit: '' },  // Socket.io websocket connection to your API failed
    'io-1-4-auth': { yt: 'I-RpDyIspsc', credit: '' },       // SocketIO Authenticate User Before Connection
    'io-1-5-state': { yt: 'Agr1FbRcIcA', credit: '' },      // Persistent SocketIO Sessions with Redis and PostgreSQL - Part 15

    /* ── Chương 2 — Transport và điệu nhảy nâng cấp ── */
    'io-2-1-overhead': { yt: 'ZKEqqIO7n-k', credit: '' }, // Learn Socket.io In 30 Minutes
    'io-2-2-ping': { yt: 'cUGRlM3SZ1w', credit: '' },     // Keep Those WebSocket Connections Alive!
    'io-2-3-sticky': { yt: 'Nv4L6f4ysjM', credit: '' },   // Why would we use STICKY SESSIONS for LOAD BALANCERS?
    'io-2-4-curl': { yt: '3MqrbL2Ri50', credit: '' },     // A Demo | How to check WebSocket requests in Browser
    'io-2-5-binary': { yt: 'nyKw0puoyYk', credit: '' },   // WebSocket Send Binary Messages - sgcWebSockets

    /* ── Chương 3 — Room và namespace: định tuyến ở tầng 3 ── */
    'io-3-1-room': { yt: 'in-Llm0rWHY', credit: '' },           // Quick Socket.IO Tutorial, Part 7: Rooms
    'io-3-2-namespace': { yt: 'SAxvToEouB8', credit: '' },      // Socket.IO Solutions : Creating Chat Channels with Namespaces
    'io-3-3-room-lifecycle': { yt: '9A9SlYp1-O8', credit: '' }, // #35 How to Join and leave room in Socket.IO and optimize socket file
    'io-3-4-broadcast': { yt: '0B8TaM752KA', credit: '' },      // Socket.io & WebSockets #11 - Join Room And Emit Event To Room
    'io-3-5-event-name': { yt: 'bxUlKDgpbWs', credit: '' },     // Node.js Socket.io Namespaces, Rooms and Connections 02

    /* ── Chương 4 — Hiện diện và cái bẫy O(N²) ── */
    'io-4-1-presence-naive': { yt: 'jD7FnbI76Hg', credit: '' }, // Realtime Chat With Users & Rooms - Socket.io, Node & Express
    'io-4-2-audience': { yt: 'NwHq1-FkQpU', credit: '' },       // Socket IO Rooms Tutorial (Backend part 1)
    'io-4-3-multi-tab': { yt: '_Pr92QxKQhY', credit: '' },      // Real-Time Chat App as a Beginner (Socket.io Rooms + Join Room) — Part 3
    'io-4-4-typing': { yt: 'q81F7Heixn0', credit: '' },         // Real-Time Chat App with Socket.IO — Events Listeners | Private & Group Chat Typing Indicators
    'io-4-5-read-receipt': { yt: '__aeJtmJnOE', credit: '' },   // How to Build a Chat App with Typing Indicators | JavaScript Chat Tutorial

    /* ── Chương 5 — Redis adapter và chạy nhiều tiến trình ── */
    'io-5-1-vi-sao': { yt: 'dcroxRr8uJc', credit: '' },     // Scaling Websockets Horizontally | SocketIo | Redis Pub\Sub | HandsOn
    'io-5-2-adapter-api': { yt: 'pEUwiD0kOmE', credit: '' },// Socket IO server with Redis!
    'io-5-3-redis-down': { yt: 'gzIcGhJC8hA', credit: '' }, // Scaling Websockets with Redis, HAProxy and Node JS - High-availability Group Chat Application
    'io-5-4-checklist': { yt: 'xQFEQNJQGpE', credit: '' },  // Session 4 - Multiple servers and Socket.IO
    'io-5-5-alt': { yt: 'x-ydCL8pj40', credit: '' },        // Socket.IO Solutions : Performing Load Balancing with the Nginx Server

    /* ── Chương 6 — Ack và bảo đảm giao nhận ── */
    'io-6-1-at-most-once': { yt: 'l6nLt4Km1cA', credit: '' }, // Message delivery (at least-once, at most-once, exactly once?) | Messaging in distributed systems
    'io-6-2-ack-retry': { yt: 'iKIS_8MS7Ks', credit: '' },    // Node JS - Socket.IO - Acknowledging Events
    'io-6-3-exactly-once': { yt: 'V0c0qAP7sWk', credit: '' }, // Kafka Delivery Semantics | At-Least-Once, At-Most-Once & Exactly-Once
    'io-6-4-ordering': { yt: 'ikeQxQJTHGM', credit: '' },     // Beware of the message ordering in Apache Kafka!
    'io-6-5-vs-http': { yt: 'dUh3-65PIAE', credit: '' },      // Quick Socket.IO Tutorial, Part 5: Callbacks

    /* ── Chương 7 — Báo hiệu WebRTC bằng socket.io ── */
    'io-7-1-signalling': { yt: 'XUyFeAQki_w', credit: '' }, // Introduction to WebRTC #17 - Signaling Part 2 - ICE (and STUN)
    'io-7-2-sdp-ice': { yt: 'Ar75UyXkbb0', credit: '' },    // Introduction to WebRTC #18 - PeerConnection, STUN, ICE, and Offer
    'io-7-3-room-call': { yt: 'SsN4gl_wV_8', credit: '' },  // How Does WebRTC Work? Seriously, How?
    'io-7-4-turn': { yt: 'AjLFvHuG0cE', credit: '' },       // ICE, STUN and TURN (WebRTC Tips by WebRTC.ventures)
    'io-7-5-sfu': { yt: 'rpEYmIYBu0s', credit: '' },        // Understanding architecture of WebRTC | TURN & STUN servers | ICE and Signalling

    /* ── Chương 8 — Soạn thảo cộng tác: khi KHÔNG nên dùng socket.io ── */
    'io-8-1-hai-ws': { yt: 'OGJxKQP7TIo', credit: '' },   // CRDT & Collaborative Editing on the Web
    'io-8-2-crdt': { yt: '0l5XgnQ6rB4', credit: '' },     // How Yjs works from the inside out
    'io-8-3-protocol': { yt: 'RqXMh4C_HkI', credit: '' }, // Yjs: A CRDT framework for shared editing
    'io-8-4-persist': { yt: 'q0j4pPnABBc', credit: '' },  // Showcase: Using CRDTs with PowerSync
    'io-8-5-auth': { yt: 'NKGTsxvQK9g', credit: '' },     // Build A Collaborative Code Editor with React, WebRTC, and Yjs

    /* ── Chương 9 — WebSocket trần: khi không có socket.io ── */
    'io-9-1-vi-sao': { yt: 'Gq7fenbjehs', credit: '' },   // Coding a Simple WebSocket Server in Node.js that Scales!
    'io-9-2-reconnect': { yt: 'inXNIMbulZI', credit: '' },// 3.2 How to Write a WebSocket Client in Node.js - Fun with WebSockets!
    'io-9-3-framing': { yt: 'qFoFKLI3O8w', credit: '' },  // Implementing the WebSocket Protocol with JavaScript || Crash Course || Erick Wendel
    'io-9-4-bridge': { yt: '54cW819DRzs', credit: '' },   // Node.js WebSocket Library Example to Stream & Send Data in Between Client & Server in Javascript
    'io-9-5-lai-du': { yt: 'cLRA85RuLNc', credit: '' },   // Create Websocket Server using Node.js

    /* ── Chương 10 — Sách công thức chẩn đoán ── */
    'io-10-1-cay': { yt: 'eiXh7EsEl_Y', credit: '' },          // How to create a WebSocket Server with Nodejs - Nodejs Problems and Solutions
    'io-10-2-q1': { yt: 'lVdi24uVs5k', credit: '' },           // How to fix CORS error in Socket IO - Node JS, Express
    'io-10-3-q2': { yt: 'MChFG-xWWLA', credit: '' },           // Web-Sockets 101 - Implementing WebSockets in JavaScript using Socket.IO
    'io-10-4-q34': { yt: 'mYCpclKeCrs', credit: '' },          // Best way to learn Socket IO | complex chat app
    'io-10-5-cluster-bugs': { yt: 'vJIgFQ5YBvc', credit: '' }, // Sharing Sessions with Express and SocketIO - Part 12

    /* ── Chương 11 — Cái sống sót qua đo đạc ── */
    'io-11-1-song-qua': { yt: 'EtG0tv2a9Uw', credit: '' }, // Socket.IO Mastery: Learn Real-Time Web Development
  },
};
