/**
 * Socket.IO — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 12 mục (Mục 0 + Chương 1-11), zero → vận hành realtime
 * production, song ngữ EN/VI. Sections tách theo file trong ./socket-io/ cho dễ soạn.
 *
 * KHÔNG trùng khoá Node.js (thuật toán server), Nginx (proxy), hay Redis (cache).
 * Khoá này dạy CÁI TẦNG realtime: engine.io là gì, socket.io ngồi trên gì, room
 * là cái gì, khi nào cần Redis adapter, và vì sao presence lại là bài học O(N²).
 *
 * Mọi số đo lấy từ CHÍNH src/socket/ của kho này (2.430 dòng gateway thật) và
 * từ socket.io 4.8.3 chạy thật trong hộp cát, KHÔNG chép từ tài liệu.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/socket-io.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/socket-io.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/socket-io.mjs --apply
 */

import s00 from './socket-io/s00-intro.mjs';
import s01 from './socket-io/s01-vong-doi.mjs';
import s02 from './socket-io/s02-transport.mjs';
import s03 from './socket-io/s03-room.mjs';
import s04 from './socket-io/s04-presence.mjs';
import s05 from './socket-io/s05-cluster.mjs';
import s06 from './socket-io/s06-ack.mjs';
import s07 from './socket-io/s07-webrtc.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 3 },
  course: {
    slug: 'socket-io',
    title: 'Socket.IO',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/socket-io.png',
    shortDescription: 'Socket.IO is engine.io wrapped in namespaces and rooms. Every surprising thing about it — the two sids, the polling-then-upgrade, the Redis adapter, why presence is an O(N²) trap — follows from that one sentence, measured on 2.430 lines of real gateway code.|||Socket.IO là engine.io bọc bởi namespace và room. Mọi thứ gây bất ngờ ở nó — hai sid, polling-rồi-upgrade, Redis adapter, vì sao presence là bẫy O(N²) — đều suy ra từ một câu đó, đo trên 2.430 dòng gateway thật.',
    description: 'Khoá Socket.IO từ số 0 tới mức vận hành realtime production do CuongThai tự biên soạn. 12 mục đi từ handshake trên dây (engine.io mở connection, socket.io tiếp quản), qua transport và vì sao long-polling KHÔNG chết, room là abstraction thật sự và presence là bẫy O(N²), Redis adapter cho cluster, ack và exactly-once, giọng và WebRTC signalling, CRDT collaboration, backoff và reconnect, ăn chắc, đo được và chẩn đoán. MỌI số đo lấy từ 2.430 dòng gateway THẬT (messaging, calls, listen-together, device gateway, notes CRDT) và socket.io 4.8.3 chạy thật.',
    whatYouLearn: 'Đọc được packet engine.io trên dây và biết mỗi ký tự nghĩa gì; hiểu vì sao có hai sid (engine.io và socket.io); phân biệt namespace với room, và biết dùng cái nào khi nào; đo được vì sao broadcast presence global là O(N²) trong một cụm và vá bằng targeted emit; biết KHI NÀO cần Redis adapter và điều gì xảy ra khi nó fail; xử lý ack đúng cách để không mất tin nhắn khi mạng chập; xây signalling cho video call bằng WebRTC + socket.io; hiểu CRDT là gì và tại sao Yjs khớp với socket.io; debug bằng DevTools tab WS thay vì bằng console.log; và chẩn đoán một realtime feature ĐỎ theo cây quyết định.',
    requirements: 'Biết TypeScript/JavaScript ở mức component & async/await — khoá TypeScript hoặc Node.js của CuongThai bao phần đó. Hiểu HTTP request/response ở mức đọc được DevTools Network. KHÔNG cần biết WebSocket trước; Mục 0 dựng từ đầu. Có Node 18+ và Redis local (docker) để thực hành cluster ở Chương 5.',
    documentsNote: 'Tài liệu tham chiếu chính: socket.io/docs/v4 (chính thức — mục "How it works" + "Rooms" đáng đọc hết) • github.com/socketio/engine.io-protocol (đặc tả wire format packet, ngắn và dễ hiểu) • developer.mozilla.org/en-US/docs/Web/API/WebSockets_API (nền tảng WebSocket mà socket.io ngồi trên). Phần thực hành đi kèm: track "Socket.IO" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
    s06,
    s07,
  ],
};
