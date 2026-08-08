/**
 * Case-study 1.5 — Real-Time Chat App (1-1).
 *
 * The first project where the server pushes rather than answers: WebSocket,
 * long-lived connections, presence counting, cursor pagination, and the
 * multi-process fan-out problem that only appears after you deploy a second
 * replica.
 *
 * Slug preserved from the existing production row.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./real-time-chat-app-1-1.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./real-time-chat-app-1-1.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'real-time-chat-app-1-1',
  title: 'Real-Time Chat App (1-1)',
  titleEn: 'Real-Time Chat App (1-1)',
  description:
    'Nhắn tin thời gian thực với Socket.IO: server chủ động đẩy dữ liệu thay vì chờ hỏi. Nhỏ về tính năng nhưng đủ về khái niệm — kết nối sống lâu, hiện diện đếm theo tab, phân trang cursor, và bài toán nhiều tiến trình chỉ lộ ra sau khi deploy bản sao thứ hai.',
  descriptionEn:
    'Real-time messaging on Socket.IO, where the server pushes instead of waiting to be asked. Small in features, complete in concepts — long-lived connections, tab-counted presence, cursor pagination, and the multi-process problem that only appears after you deploy a second replica.',
  techStack: [
    'Node.js', 'Express', 'Socket.IO', 'TypeScript', 'PostgreSQL', 'Prisma',
    'Redis', 'JWT', 'Next.js 15', 'TailwindCSS', 'Cloudflare R2',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '7–10 ngày',
  durationEn: '7–10 days',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'BEGINNER',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `model Conversation {
  id        String   @id @default(cuid())
  // Thiết kế thành viên theo dạng nhiều-nhiều NGAY TỪ ĐẦU dù hiện
  // tại chỉ dùng 1-1: đổi từ userAId/userBId sang bảng thành viên
  // về sau là cuộc di trú đau đớn, còn thừa một bảng thì không tốn gì.
  type      String   @default("DIRECT")  // DIRECT | GROUP
  members   ConversationMember[]
  messages  Message[]
  createdAt DateTime @default(now())
  @@map("conversations")
}

model ConversationMember {
  conversationId String
  userId         String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  // MỘT con trỏ "đã đọc tới đâu" cho mỗi người, thay vì một dòng
  // read-receipt cho mỗi cặp (tin nhắn, người đọc): 10.000 tin ×
  // 2 người = 20.000 dòng chỉ để trả lời "đã xem chưa".
  lastReadAt     DateTime?
  joinedAt       DateTime  @default(now())

  @@id([conversationId, userId])
  @@index([userId])
  @@map("conversation_members")
}

model Message {
  id             String    @id @default(cuid())
  conversationId String
  senderId       String
  body           String    @db.Text
  attachmentUrl  String?
  editedAt       DateTime?
  // Xoá MỀM: giữ dòng để không phá thứ tự và con trỏ lastReadAt,
  // và để phân trang cursor không nhảy lung tung.
  deletedAt      DateTime?
  createdAt      DateTime  @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation(fields: [senderId], references: [id], onDelete: Cascade)

  // Khớp đúng truy vấn DUY NHẤT của màn hình chat:
  // "tin của cuộc trò chuyện X, mới nhất trước, 50 cái".
  @@index([conversationId, createdAt])
  @@map("messages")
}`,
  schemaCodeEn: `model Conversation {
  id        String   @id @default(cuid())
  // Model membership as many-to-many FROM DAY ONE even though only
  // 1-1 exists now: migrating from userAId/userBId to a members table
  // later is painful, whereas an extra table costs nothing.
  type      String   @default("DIRECT")  // DIRECT | GROUP
  members   ConversationMember[]
  messages  Message[]
  createdAt DateTime @default(now())
  @@map("conversations")
}

model ConversationMember {
  conversationId String
  userId         String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  // ONE "read up to here" pointer per person, rather than a receipt
  // row per (message, reader) pair: 10,000 messages × 2 people =
  // 20,000 rows just to answer "has this been seen".
  lastReadAt     DateTime?
  joinedAt       DateTime  @default(now())

  @@id([conversationId, userId])
  @@index([userId])
  @@map("conversation_members")
}

model Message {
  id             String    @id @default(cuid())
  conversationId String
  senderId       String
  body           String    @db.Text
  attachmentUrl  String?
  editedAt       DateTime?
  // SOFT delete: keep the row so ordering and the lastReadAt pointer
  // survive, and so cursor pagination does not jump around.
  deletedAt      DateTime?
  createdAt      DateTime  @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation(fields: [senderId], references: [id], onDelete: Cascade)

  // Matches the ONE query the chat screen ever runs:
  // "messages in conversation X, newest first, 50 of them".
  @@index([conversationId, createdAt])
  @@map("messages")
}`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'SETUP',
      title: 'Vì sao WebSocket, và ba cách người ta từng thử trước đó',
      titleEn: 'Why WebSocket, and the three things people tried first',
      description:
        'Polling tạo 30 request/phút/người chỉ để nghe "không có gì mới". Long polling đỡ hơn nhưng mỗi tin nhắn vẫn tốn một lần thiết lập kết nối. SSE chỉ một chiều nên không làm được typing indicator. WebSocket là đúng bài toán, đổi lại kết nối có trạng thái và khó mở rộng ngang hơn.',
      descriptionEn:
        'Polling generates 30 requests/minute/person just to hear "nothing new". Long polling is better but every message still costs a connection setup. SSE is one-way so typing indicators are impossible. WebSocket fits, at the cost of stateful connections and harder horizontal scaling.',
    },
    {
      phase: 'BACKEND',
      title: 'Xác thực lúc bắt tay, và phòng theo userId chứ không socket.id',
      titleEn: 'Authenticate at handshake, and rooms keyed by userId',
      description:
        'Kiểm token trong io.use() chạy MỘT LẦN trước khi socket được coi là đã kết nối — kiểm trong từng handler thì socket chưa xác thực vẫn nằm trong danh sách kết nối và vẫn nhận broadcast. Token đọc từ cookie httpOnly, không qua query string (query string bị ghi vào access log của mọi proxy).',
      descriptionEn:
        'Checking the token in io.use() runs ONCE before the socket counts as connected — check inside each handler and an unauthenticated socket is already in the connection list receiving broadcasts. The token comes from an httpOnly cookie, not a query string (query strings land in every proxy access log).',
      codeBlock:
        '// socket.id đổi mỗi lần kết nối lại, và mỗi tab một id khác.\n'
        + '// Gửi theo socket.id = gửi nhầm sau khi rớt mạng, và chỉ\n'
        + '// một tab nhận được.\n'
        + 'socket.join(`user:${userId}`);\n\n'
        + '// Sau đó luôn gửi theo phòng:\n'
        + "io.to(`user:${m.userId}`).emit('message:new', message);",
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Redis adapter — lỗi chỉ xuất hiện khi có bản sao thứ hai',
      titleEn: 'The Redis adapter — a bug that needs a second replica to appear',
      description:
        'Chạy hai tiến trình thì A có thể nối vào tiến trình 1 còn B vào tiến trình 2, và io.to(room).emit từ tiến trình 1 không bao giờ tới B. Cần hai kết nối Redis riêng cho pub và sub, vì một kết nối đang subscribe không chạy được lệnh publish — ràng buộc của giao thức Redis, không phải của Socket.IO.',
      descriptionEn:
        'With two processes, A may land on process 1 and B on process 2, and io.to(room).emit from process 1 never reaches B. It needs two separate Redis connections for pub and sub, because a connection in subscribe mode cannot publish — a Redis protocol constraint, not a Socket.IO one.',
      codeBlock:
        '// Hai kết nối RIÊNG. Một kết nối Redis đang subscribe KHÔNG\n'
        + '// chạy được publish — ràng buộc của giao thức Redis.\n'
        + 'io.adapter(createAdapter(redis.duplicate(), redis.duplicate()));',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Hiện diện: đếm tab chứ không bật/tắt cờ',
      titleEn: 'Presence: count tabs, do not toggle a flag',
      description:
        'Cờ boolean sai ngay khi người dùng mở hai tab rồi đóng một. Dùng INCR/DECR trên Redis, chỉ về 0 mới thật sự offline. Kèm khoảng chờ 5 giây trước khi báo offline: chuyển wifi sang 4G là rớt rồi nối lại trong 1-3 giây, báo ngay khiến danh sách bạn bè nhấp nháy liên tục.',
      descriptionEn:
        'A boolean is wrong the moment someone opens two tabs and closes one. Use Redis INCR/DECR; only zero means offline. Plus a 5-second grace period: switching wifi to 4G drops and reconnects within 1–3 seconds, and announcing immediately makes everyone\'s friend list flicker.',
    },
    {
      phase: 'BACKEND',
      title: 'Lưu trước, phát sau — và ack để client khớp tin lạc quan',
      titleEn: 'Persist first, broadcast second — and ack to match optimistic sends',
      description:
        'Phát trước rồi lưu thì người nhận thấy tin trên màn hình, database ghi lỗi, và tin biến mất khi F5 — kiểu lỗi phá niềm tin vào cả sản phẩm. Kiểm quyền thành viên trước khi ghi (IDOR qua đường WebSocket vẫn là IDOR). clientId trả về trong ack để client biết bong bóng "đang gửi" nào vừa được xác nhận.',
      descriptionEn:
        'Broadcast before persisting and the recipient sees a message, the write fails, and it vanishes on refresh — the kind of bug that destroys trust in the product. Check membership before writing (IDOR over WebSocket is still IDOR). The echoed clientId tells the client which "sending" bubble was confirmed.',
    },
    {
      phase: 'FRONTEND',
      title: 'Phân trang cursor, và typing indicator throttle chứ không debounce',
      titleEn: 'Cursor pagination, and throttled (not debounced) typing',
      description:
        'OFFSET hỏng ngay khi có tin nhắn mới trong lúc người dùng cuộn: mọi thứ dịch đi và trang sau lặp lại tin vừa đọc. Cursor neo vào createdAt thật nên tin mới không làm dịch chuyển gì. Typing phải throttle — debounce chỉ gửi khi người dùng NGỪNG gõ, ngược hoàn toàn với ý nghĩa "đang gõ".',
      descriptionEn:
        'OFFSET breaks the moment a message arrives while the user scrolls: everything shifts and the next page repeats what they just read. A cursor anchored to a real createdAt value shifts nothing. Typing must be throttled — debounce only fires when the user STOPS typing, the exact opposite of "is typing".',
      codeBlock:
        '// Cursor neo vào giá trị THẬT trong dữ liệu, nên tin nhắn\n'
        + '// mới tới không làm dịch chuyển trang.\n'
        + 'where: {\n'
        + '  conversationId,\n'
        + '  ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),\n'
        + '},\n'
        + "orderBy: { createdAt: 'desc' },\n"
        + 'take: 50,',
      codeLang: 'typescript',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng hai tiến trình, ba tab và một lần rớt mạng',
      titleEn: 'Verify with two processes, three tabs and one network drop',
      description:
        'Ba phép thử bắt đúng ba lỗi kinh điển: chạy 2 tiến trình sau load balancer (bắt lỗi thiếu adapter), mở 3 tab rồi đóng 2 (bắt lỗi hiện diện dùng cờ), ngắt wifi 10 giây (bắt lỗi mất tin khi kết nối lại).',
      descriptionEn:
        'Three checks catch three classic bugs: run 2 processes behind a load balancer (catches the missing adapter), open 3 tabs and close 2 (catches flag-based presence), kill wifi for 10 seconds (catches messages lost on reconnect).',
    },
  ],

  features: [
    { title: 'Tin nhắn 1-1 thời gian thực', titleEn: 'Real-time 1-to-1 messaging', description: 'Socket.IO với phòng theo userId, lưu database trước khi phát.', descriptionEn: 'Socket.IO with userId-keyed rooms, persisted before broadcast.', status: 'PLANNED' },
    { title: 'Trạng thái trực tuyến chính xác theo nhiều tab', titleEn: 'Multi-tab accurate presence', description: 'Bộ đếm Redis kèm khoảng chờ 5 giây chống nhấp nháy khi đổi mạng.', descriptionEn: 'A Redis counter plus a 5-second grace period against network-switch flicker.', status: 'PLANNED' },
    { title: 'Đang gõ (throttle 2 giây)', titleEn: 'Typing indicator (2s throttle)', description: 'Không bao giờ ghi trạng thái gõ xuống database.', descriptionEn: 'Typing state is never written to the database.', status: 'PLANNED' },
    { title: 'Đã xem, dùng con trỏ lastReadAt', titleEn: 'Read receipts via a lastReadAt pointer', description: 'Một con trỏ mỗi người thay vì một dòng mỗi cặp tin-người.', descriptionEn: 'One pointer per person instead of a row per message-reader pair.', status: 'PLANNED' },
    { title: 'Gửi ảnh và file', titleEn: 'Image and file attachments', description: 'Tải thẳng lên R2 bằng presigned URL, không đi qua server chat.', descriptionEn: 'Direct-to-R2 uploads with presigned URLs, bypassing the chat server.', status: 'PLANNED' },
    { title: 'Phân trang cursor cho lịch sử', titleEn: 'Cursor pagination for history', description: 'Không dùng OFFSET — tin nhắn mới tới không làm dịch chuyển trang.', descriptionEn: 'No OFFSET — incoming messages never shift the page.', status: 'PLANNED' },
    { title: 'Sửa và xoá mềm tin nhắn', titleEn: 'Edit and soft-delete messages', description: 'Giữ dòng lại để con trỏ đã đọc và thứ tự không bị phá.', descriptionEn: 'Rows are kept so read pointers and ordering stay intact.', status: 'PLANNED' },
    { title: 'Tự kết nối lại không mất tin', titleEn: 'Reconnect without message loss', description: 'Sau khi nối lại, đồng bộ những tin bỏ lỡ theo mốc thời gian.', descriptionEn: 'After reconnecting, missed messages are synced from a timestamp.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Socket.IO — tài liệu chính thức', titleEn: 'Socket.IO — official documentation', url: 'https://socket.io/docs/v4/', type: 'LINK', description: 'Đọc kỹ mục Rooms, Adapters và Acknowledgements.', descriptionEn: 'Focus on Rooms, Adapters and Acknowledgements.' },
    { title: 'Socket.IO Redis Adapter', titleEn: 'Socket.IO Redis Adapter', url: 'https://socket.io/docs/v4/redis-adapter/', type: 'LINK', description: 'Bắt buộc đọc trước khi deploy nhiều hơn một tiến trình.', descriptionEn: 'Required reading before deploying more than one process.' },
    { title: 'MDN — WebSocket API', titleEn: 'MDN — WebSocket API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API', type: 'LINK', description: 'Giao thức nền dưới Socket.IO, nên biết cái gì là chuẩn và cái gì Socket.IO thêm vào.', descriptionEn: 'The protocol under Socket.IO — worth knowing what is standard and what Socket.IO adds.' },
    { title: 'Use The Index, Luke — phân trang', titleEn: 'Use The Index, Luke — pagination', url: 'https://use-the-index-luke.com/no-offset', type: 'LINK', description: 'Giải thích cặn kẽ vì sao OFFSET sai cả về đúng đắn lẫn hiệu năng.', descriptionEn: 'A thorough explanation of why OFFSET is wrong on both correctness and performance.' },
  ],

  coreKnowledge: [
    { vi: 'WebSocket khác HTTP ở chỗ nào, và khi nào KHÔNG nên dùng WebSocket', en: 'How WebSocket differs from HTTP, and when NOT to reach for it' },
    { vi: 'Socket.IO rooms: vì sao khoá theo userId chứ không phải socket.id', en: 'Socket.IO rooms: why to key by userId rather than socket.id' },
    { vi: 'Fan-out giữa nhiều tiến trình bằng Redis pub/sub adapter', en: 'Cross-process fan-out with the Redis pub/sub adapter' },
    { vi: 'Xác thực kết nối sống lâu: kiểm tra lúc bắt tay, và vấn đề token hết hạn giữa chừng', en: 'Authenticating long-lived connections: check at handshake, and the mid-session expiry problem' },
    { vi: 'Hiện diện bằng bộ đếm, và vì sao cần khoảng chờ trước khi báo offline', en: 'Counter-based presence, and why a grace period before "offline" matters' },
    { vi: 'Phân trang cursor và vì sao OFFSET sai với dữ liệu đang thay đổi', en: 'Cursor pagination, and why OFFSET is wrong for changing data' },
    { vi: 'Throttle khác debounce, và chọn sai làm hỏng ý nghĩa tính năng', en: 'Throttle versus debounce, and how the wrong choice inverts a feature' },
    { vi: 'Xoá mềm: khi nào cần giữ dòng lại thay vì xoá thật', en: 'Soft deletes: when keeping the row matters more than removing it' },
    { vi: 'Acknowledgement callback: cho một sự kiện có phản hồi như HTTP', en: 'Acknowledgement callbacks: giving an event an HTTP-like response' },
    { vi: 'Cập nhật lạc quan trong ngữ cảnh realtime, và cách khớp bằng clientId', en: 'Optimistic updates in a real-time context, reconciled with a clientId' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh GIF quay màn hình hai cửa sổ nhắn tin cho nhau theo thời gian thực', en: 'A screen-recorded GIF of two windows messaging each other live' },
    { vi: 'Chạy 2 bản sao sau nginx và chứng minh adapter hoạt động', en: 'Two replicas behind nginx, proving the adapter works' },
    { vi: 'Sơ đồ trạng thái kết nối: connecting, connected, reconnecting, offline', en: 'A connection state diagram: connecting, connected, reconnecting, offline' },
    { vi: 'Kịch bản test tự động mô phỏng rớt mạng và kiểm tra không mất tin', en: 'An automated test that simulates a network drop and asserts no message loss' },
    { vi: 'Mục "Vì sao không dùng polling" trong README, có số liệu so sánh', en: 'A "Why not polling" section in the README with comparative numbers' },
  ],

  completionOutcomes: [
    { vi: 'Xây hệ thống realtime chạy đúng trên nhiều tiến trình, không chỉ trên máy dev', en: 'Build a real-time system that works across processes, not just on a dev machine' },
    { vi: 'Thiết kế trạng thái hiện diện đúng với thực tế nhiều thiết bị, nhiều tab', en: 'Model presence correctly for the reality of many devices and many tabs' },
    { vi: 'Phân trang danh sách đang thay đổi mà không lặp và không thiếu', en: 'Paginate a changing list without duplicates or gaps' },
    { vi: 'Nhận ra IDOR trong hệ thống sự kiện, nơi không có URL để nhìn vào', en: 'Spot IDOR inside an event system, where there is no URL to inspect' },
    { vi: 'Hiểu đánh đổi giữa dữ liệu sống trong bộ nhớ và dữ liệu phải bền vững', en: 'Understand the trade-off between ephemeral in-memory state and durable data' },
  ],

  bodyMdx,
  bodyMdxEn,
};
