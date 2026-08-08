/**
 * Case-study 3.1 — Real-Time Collaboration Tool (Figma-like).
 *
 * Trello fixed lost updates by sending operations on DIFFERENT fields. Here
 * two people edit the SAME text at the same instant, so there is no field to
 * separate them. This is the CRDT project: immutable identifiers instead of
 * positional indices, and the three bills CRDTs quietly hand you afterwards.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./realtime-collaboration-figma-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./realtime-collaboration-figma-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'realtime-collaboration-figma-like',
  title: 'Real-Time Collaboration Tool (Figma-like)',
  titleEn: 'Real-Time Collaboration Tool (Figma-like)',
  description:
    'Bảng vẽ nhiều người cùng sửa theo thời gian thực, có chế độ ngoại tuyến. Dự án đưa bài toán "hai người sửa cùng một thứ" tới tận cùng: chỉ số vị trí không dùng được nữa, và lời giải — CRDT — là một trong số ít thứ trong lộ trình đã được chứng minh bằng toán học.',
  descriptionEn:
    'A multi-user real-time canvas with offline support. This project takes "two people editing the same thing" to its limit: positional indices stop working, and the answer — CRDTs — is one of the few things in this roadmap proved mathematically rather than by experience.',
  techStack: [
    'Next.js 15', 'TypeScript', 'Yjs', 'y-websocket', 'Socket.IO', 'Canvas API',
    'tldraw', 'Node.js', 'PostgreSQL', 'Redis', 'IndexedDB', 'Cloudflare R2',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '6–8 tuần',
  durationEn: '6–8 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'ADVANCED',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Điểm khác biệt lớn nhất so với mọi dự án trước: NỘI DUNG tài liệu
-- KHÔNG nằm trong các bảng quan hệ. Nó là một khối nhị phân do CRDT quản lý.
-- Database chỉ lo phần mà CRDT không lo được: ai sở hữu, ai được sửa,
-- và các mốc để không phải phát lại lịch sử từ đầu.

CREATE TABLE boards (
    id         TEXT        PRIMARY KEY,
    owner_id   TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    -- Sinh lại khi người dùng NGỪNG vẽ (debounce), không phải mỗi thao tác.
    thumbnail  TEXT,
    is_public  BOOLEAN     NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE snapshots (
    id         TEXT        PRIMARY KEY,
    board_id   TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    -- Y.encodeStateAsUpdate(doc): toàn bộ trạng thái ở dạng nhị phân.
    -- Không có mốc này thì mở bảng phải phát lại hàng trăm nghìn thao tác.
    y_doc_state BYTEA      NOT NULL,
    op_count   INTEGER     NOT NULL DEFAULT 0,
    -- Gộp theo PHIÊN LÀM VIỆC, không phải theo từng thao tác — đó mới là
    -- đơn vị người dùng nghĩ tới khi muốn "quay lại lúc trước".
    label      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX snapshots_board_idx ON snapshots (board_id, created_at DESC);

CREATE TABLE board_permissions (
    board_id TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- CRDT KHÔNG có khái niệm "không được phép". Vai trò này phải được
    -- kiểm ở server TRƯỚC khi áp và phát lại gói tin, nếu không người
    -- chỉ có quyền xem vẫn sửa được bằng cách gửi thẳng qua WebSocket.
    role     VARCHAR(16) NOT NULL DEFAULT 'EDITOR',
    PRIMARY KEY (board_id, user_id)
);

CREATE TABLE comments (
    id        TEXT        PRIMARY KEY,
    board_id  TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    author_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Neo vào ID ĐỐI TƯỢNG trong tài liệu CRDT, KHÔNG neo vào toạ độ x/y.
    -- Neo theo toạ độ thì ai kéo hình đi là bình luận lơ lửng giữa khoảng trống.
    anchor_id TEXT        NOT NULL,
    body      TEXT        NOT NULL,
    resolved  BOOLEAN     NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KHÔNG có bảng nào cho con trỏ hay vùng chọn, và đó là chủ ý.
-- Trạng thái hiện diện là PHÙ DU: đi kênh awareness riêng, không bao giờ lưu.
-- Lưu nó là cách chắc chắn để lịch sử phiên bản thành rác.`,

  schemaCodeEn: `-- The biggest departure from every earlier project: document CONTENT does
-- NOT live in relational tables. It is a binary blob managed by the CRDT.
-- The database handles only what the CRDT cannot: who owns what, who may
-- edit, and the restore points that avoid replaying history from scratch.

CREATE TABLE boards (
    id         TEXT        PRIMARY KEY,
    owner_id   TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    -- Regenerated when drawing PAUSES (debounced), not on every operation.
    thumbnail  TEXT,
    is_public  BOOLEAN     NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE snapshots (
    id         TEXT        PRIMARY KEY,
    board_id   TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    -- Y.encodeStateAsUpdate(doc): the full state in binary form. Without
    -- these, opening a board replays hundreds of thousands of operations.
    y_doc_state BYTEA      NOT NULL,
    op_count   INTEGER     NOT NULL DEFAULT 0,
    -- Grouped by SESSION rather than per operation — that is the unit users
    -- actually mean when they say "go back to how it was".
    label      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX snapshots_board_idx ON snapshots (board_id, created_at DESC);

CREATE TABLE board_permissions (
    board_id TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- A CRDT has NO concept of "not allowed". This role must be checked on
    -- the server BEFORE applying and rebroadcasting a packet, or view-only
    -- users can still edit by pushing straight onto the WebSocket.
    role     VARCHAR(16) NOT NULL DEFAULT 'EDITOR',
    PRIMARY KEY (board_id, user_id)
);

CREATE TABLE comments (
    id        TEXT        PRIMARY KEY,
    board_id  TEXT        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    author_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Anchored to the OBJECT ID inside the CRDT document, NOT to x/y coords.
    -- Anchor by coordinates and moving a shape leaves the comment in the void.
    anchor_id TEXT        NOT NULL,
    body      TEXT        NOT NULL,
    resolved  BOOLEAN     NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- There is NO table for cursors or selections, and that is deliberate.
-- Presence is EPHEMERAL: it rides a separate awareness channel and is never
-- persisted. Storing it is the reliable way to turn version history into noise.`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Hiểu vì sao chỉ số vị trí là một tham chiếu hỏng',
      titleEn: 'Understand why a positional index is a broken reference',
      description:
        'Thao tác "chèn ở vị trí 4" nói về vị trí 4 trong tài liệu CŨ của người gửi, không phải tài liệu hiện tại. Hai người cùng sửa thì mỗi thao tác làm đổi ý nghĩa vị trí của thao tác kia, và hệ thống KHÔNG báo lỗi — hai người chỉ lặng lẽ nhìn hai tài liệu khác nhau. Đây là chỗ phải hiểu trước khi viết bất kỳ dòng nào.',
      descriptionEn:
        'An operation saying "insert at position 4" refers to position 4 in the sender\'s OLD document, not the current one. With two concurrent editors, each operation changes what the other\'s position means, and nothing raises an error — the two people simply look at different documents. This must be understood before writing any code.',
    },
    {
      phase: 'DESIGN',
      title: 'Chọn CRDT thay vì OT, và biết mình đánh đổi cái gì',
      titleEn: 'Choose CRDT over OT, and know what you are trading',
      description:
        'OT biến đổi thao tác đến muộn cho khớp ngữ cảnh — Google Docs chạy kiểu này, nhưng nó cần một server làm trọng tài và số hàm biến đổi tăng theo bình phương số loại thao tác (nhiều bài báo về OT về sau bị chứng minh là sai). CRDT bỏ chỉ số hoàn toàn: mỗi phần tử có định danh bất biến, thao tác nói "chèn sau phần tử X". Đổi lại là ngoại tuyến thật và không cần trọng tài.',
      descriptionEn:
        'OT rewrites late operations to fit their context — Google Docs works this way, but it needs a central arbiter and its transformation functions grow with the square of the operation types (several OT papers were later shown incorrect). CRDTs drop indices entirely: every element carries an immutable id and operations say "insert after element X". The payoff is genuine offline editing and no arbiter.',
      codeBlock:
        '// Ba tính chất BẮT BUỘC phải có, không phải chọn một:\n'
        + '//   giao hoán  — áp X rồi Y = áp Y rồi X   (mạng giao gói lộn xộn)\n'
        + '//   kết hợp    — gộp theo cụm nào cũng như nhau (hoà từng phần)\n'
        + '//   luỹ đẳng   — áp hai lần = áp một lần    (gửi lại sau lỗi mạng)\n'
        + '\n'
        + '// Có đủ ba thì THỨ TỰ ÁP KHÔNG CÒN QUAN TRỌNG,\n'
        + '// nên server không cần làm trọng tài nữa.',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Awareness đi kênh riêng và KHÔNG BAO GIỜ được lưu',
      titleEn: 'Awareness on its own channel, NEVER persisted',
      description:
        'Con trỏ đổi vị trí 60 lần mỗi giây. Nhét nó vào tài liệu CRDT thì mỗi cử động chuột thành một thao tác vĩnh viễn: lịch sử phiên bản đầy rác, kích thước tài liệu phình theo thời gian ngồi nhìn màn hình, và bấm hoàn tác có thể hoàn tác một cú di chuột. Đây là lỗi phổ biến nhất khi dựng công cụ cộng tác và chỉ lộ ra sau vài tuần dùng thật.',
      descriptionEn:
        'A cursor moves 60 times a second. Put it in the CRDT document and every mouse movement becomes a permanent operation: version history fills with noise, document size grows with time spent staring at the screen, and undo can reverse a mouse movement. This is the most common mistake in collaborative tools and only surfaces after weeks of real use.',
      codeBlock:
        '// Kênh riêng, không đụng vào Y.Doc. Người ngắt kết nối thì trạng\n'
        + '// thái của họ tự hết hạn và biến mất — đúng bản chất phù du.\n'
        + "provider.awareness.setLocalStateField('cursor', { x, y });\n"
        + "provider.awareness.setLocalStateField('user', { name, color });\n"
        + '\n'
        + '// Vẫn giới hạn 50ms: 20 lần/giây đủ mượt với mắt người,\n'
        + '// mà lưu lượng giảm ba lần so với gửi theo mọi sự kiện chuột.',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Ảnh chụp trạng thái và đồng bộ bằng vector chênh lệch',
      titleEn: 'State snapshots and delta sync by state vector',
      description:
        'Bảng dùng vài tháng có hàng trăm nghìn thao tác; phát lại từ đầu là chờ vài chục giây. Ghi ảnh chụp mỗi 5 phút hoặc 500 thao tác. Khi đồng bộ lại sau ngoại tuyến, đừng gửi cả tài liệu — gửi vector trạng thái (bản tóm tắt "tôi đã có tới đâu", không mang nội dung) rồi nhận đúng phần còn thiếu.',
      descriptionEn:
        'A board used for months holds hundreds of thousands of operations; replaying from scratch takes tens of seconds. Snapshot every 5 minutes or 500 operations. When resyncing after offline work, do not send the whole document — send a state vector (a content-free summary of "how far I have got") and receive only the delta.',
      codeBlock:
        'const stateVector = Y.encodeStateVector(localDoc);\n'
        + 'const diff = Y.encodeStateAsUpdate(serverDoc, stateVector);  // CHỈ phần thiếu\n'
        + 'Y.applyUpdate(localDoc, diff);\n'
        + '\n'
        + '// Ngoại tuyến ba ngày mở lại cũng chỉ tải phần chưa có,\n'
        + '// không phải cả tài liệu.',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Kiểm quyền ở server — CRDT không giúp gì ở khoản này',
      titleEn: 'Authorise on the server — CRDTs help nothing here',
      description:
        'CRDT lo hội tụ, không lo ai được phép làm gì. Người có vai VIEWER hoàn toàn mở được DevTools và gửi thẳng gói cập nhật lên WebSocket. Kiểm vai trò TRƯỚC khi áp và phát lại. Kèm giới hạn kích thước gói: cập nhật bình thường vài chục byte, gói 10MB nghĩa là có người đang phá hoặc client bị lỗi vòng lặp.',
      descriptionEn:
        'CRDTs handle convergence, not authorisation. A VIEWER can open DevTools and push update packets onto the WebSocket. Check the role BEFORE applying and rebroadcasting. Add a packet size cap: a normal update is a few dozen bytes, so a 10MB packet means either an attacker or a client-side loop bug.',
    },
    {
      phase: 'FRONTEND',
      title: 'Vẽ thẳng lên canvas, React chỉ lo giao diện xung quanh',
      titleEn: 'Draw straight to canvas; React owns only the surrounding UI',
      description:
        'Bảng 5.000 hình mà mỗi hình là một component React thì khung hình rớt xuống mức không dùng được. Vẽ trong vòng lặp requestAnimationFrame, chia lớp nền tĩnh và lớp đang kéo, bỏ qua đối tượng ngoài khung nhìn, gộp các cập nhật CRDT đến trong cùng một khung hình rồi vẽ một lần.',
      descriptionEn:
        'With 5,000 shapes and one React component each, the frame rate collapses. Draw inside a requestAnimationFrame loop, separate static background from the dragging layer, cull off-screen objects, and batch CRDT updates arriving in the same frame into a single draw.',
    },
    {
      phase: 'FRONTEND',
      title: 'Hoàn tác theo từng người và chế độ ngoại tuyến',
      titleEn: 'Per-user undo and offline mode',
      description:
        'Ngăn xếp hoàn tác dùng chung sẽ hoàn tác nhầm việc của người khác — giới hạn UndoManager theo nguồn gốc của chính client đó. Ngoại tuyến thì thao tác dồn vào IndexedDB và người dùng vẽ tiếp bình thường; có mạng lại thì hoà tự động. Nhưng nhớ: hoà tự động không có nghĩa là hoà ĐÚNG Ý — với trường quan trọng vẫn phải báo cho người dùng biết có xung đột.',
      descriptionEn:
        'A shared undo stack reverses other people\'s work — scope the UndoManager to that client\'s own origin. Offline, operations queue into IndexedDB and drawing continues normally; on reconnect they merge automatically. But remember: automatic merging is not CORRECT merging — for fields that matter, still surface the conflict to the user.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm hội tụ bằng cách so byte, không so bằng mắt',
      titleEn: 'Verify convergence by comparing bytes, not by eye',
      description:
        'Ba trình duyệt cùng sửa 10 phút rồi so Y.encodeStateAsUpdate của từng cái — phải giống nhau tới từng byte. Nhìn màn hình thấy "có vẻ giống" không phải phép kiểm, vì lệch nhỏ có thể nằm ở phần đang ngoài khung nhìn. Thêm phép kiểm quan trọng: ngồi yên không làm gì 10 phút với 5 người cùng mở, kích thước tài liệu KHÔNG được tăng.',
      descriptionEn:
        'Have three browsers edit for 10 minutes, then compare each one\'s Y.encodeStateAsUpdate — they must match byte for byte. "Looks the same on screen" is not a check, since a small divergence may sit off-screen. One more that matters: sit idle for 10 minutes with 5 people connected and document size must NOT grow.',
    },
  ],

  features: [
    { title: 'Bảng vẽ nhiều người theo thời gian thực', titleEn: 'Real-time multi-user canvas', description: 'Hình khối, đường, chữ, ảnh — đồng bộ qua Yjs, không cần server làm trọng tài.', descriptionEn: 'Shapes, lines, text and images synced through Yjs with no central arbiter.', status: 'PLANNED' },
    { title: 'Con trỏ và vùng chọn của từng người', titleEn: 'Per-user cursors and selections', description: 'Kênh awareness riêng, giới hạn 50ms, không bao giờ lưu vào tài liệu.', descriptionEn: 'A separate awareness channel, throttled to 50ms, never written to the document.', status: 'PLANNED' },
    { title: 'Chế độ ngoại tuyến đầy đủ', titleEn: 'Full offline mode', description: 'Thao tác dồn vào IndexedDB, hoà tự động khi có mạng lại.', descriptionEn: 'Operations queue into IndexedDB and merge automatically on reconnect.', status: 'PLANNED' },
    { title: 'Hoàn tác / làm lại theo từng người', titleEn: 'Per-user undo / redo', description: 'UndoManager giới hạn theo nguồn gốc, không hoàn tác nhầm việc người khác.', descriptionEn: 'An origin-scoped UndoManager that never reverses someone else\'s work.', status: 'PLANNED' },
    { title: 'Bình luận neo vào đối tượng', titleEn: 'Comments anchored to objects', description: 'Neo theo id trong CRDT nên kéo hình đi bình luận vẫn bám đúng.', descriptionEn: 'Anchored by CRDT id, so moving a shape keeps the comment attached.', status: 'PLANNED' },
    { title: 'Lịch sử phiên bản theo phiên làm việc', titleEn: 'Version history grouped by session', description: 'Ảnh chụp mỗi 5 phút hoặc 500 thao tác, gộp theo phiên chứ không theo thao tác.', descriptionEn: 'Snapshots every 5 minutes or 500 operations, grouped by session rather than operation.', status: 'PLANNED' },
    { title: 'Phân quyền xem / sửa kiểm ở server', titleEn: 'Server-enforced view / edit permissions', description: 'Kiểm trước khi áp và phát lại, kèm giới hạn kích thước gói tin.', descriptionEn: 'Checked before applying and rebroadcasting, with a packet size cap.', status: 'PLANNED' },
    { title: 'Xuất PNG và SVG', titleEn: 'PNG and SVG export', description: 'Dựng lại từ trạng thái CRDT phía server để bản xuất luôn khớp bản đang xem.', descriptionEn: 'Rendered server-side from CRDT state so exports always match what is on screen.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Yjs — Documentation', titleEn: 'Yjs — Documentation', url: 'https://docs.yjs.dev/', type: 'LINK', description: 'Y.Doc, kiểu dữ liệu chung, awareness, và cách mã hoá cập nhật dạng nhị phân.', descriptionEn: 'Y.Doc, shared types, awareness, and the binary update encoding.' },
    { title: 'YATA — A CRDT for real-time collaboration', titleEn: 'YATA — A CRDT for real-time collaboration', url: 'https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types', type: 'LINK', description: 'Bài báo gốc của thuật toán Yjs dựa trên — đọc để hiểu định danh bất biến hoạt động ra sao.', descriptionEn: 'The original paper behind the algorithm Yjs is built on — read it to see how immutable identifiers actually work.' },
    { title: 'Automerge', titleEn: 'Automerge', url: 'https://automerge.org/', type: 'LINK', description: 'CRDT thay thế, thiên về JSON tài liệu. So sánh hai cái giúp thấy rõ đánh đổi.', descriptionEn: 'An alternative CRDT oriented around JSON documents. Comparing the two makes the trade-offs visible.' },
    { title: 'Local-first software', titleEn: 'Local-first software', url: 'https://www.inkandswitch.com/local-first/', type: 'LINK', description: 'Bài viết đặt nền cho cả hướng tiếp cận: vì sao dữ liệu nên thuộc về máy người dùng.', descriptionEn: 'The essay that framed this whole approach: why data should belong to the user\'s device.' },
    { title: 'tldraw', titleEn: 'tldraw', url: 'https://github.com/tldraw/tldraw', type: 'REPO', description: 'Bộ canvas mã nguồn mở, đọc được cách họ tách tầng vẽ khỏi vòng đời React.', descriptionEn: 'An open-source canvas; read how they separate the render layer from React\'s lifecycle.' },
  ],

  coreKnowledge: [
    { vi: 'CRDT: ba tính chất giao hoán, kết hợp, luỹ đẳng và vì sao cần đủ cả ba', en: 'CRDTs: commutativity, associativity, idempotence — and why all three are required' },
    { vi: 'Operational Transformation: cơ chế, và vì sao nó cần một trọng tài trung tâm', en: 'Operational Transformation: how it works, and why it needs a central arbiter' },
    { vi: 'Định danh bất biến thay cho vị trí tương đối — ý tưởng dùng lại được ở nhiều chỗ', en: 'Immutable identifiers instead of relative positions — an idea that reappears everywhere' },
    { vi: 'Trạng thái phù du và trạng thái bền: tách hai loại là quyết định kiến trúc', en: 'Ephemeral vs durable state: separating them is an architectural decision' },
    { vi: 'Vector trạng thái và đồng bộ theo phần chênh lệch', en: 'State vectors and delta-based synchronisation' },
    { vi: 'Bia mộ, dọn dẹp bộ nhớ, và chi phí thật của CRDT', en: 'Tombstones, garbage collection, and the real cost of CRDTs' },
    { vi: 'Kiến trúc ưu tiên máy cục bộ: dữ liệu thuộc về người dùng, server là nơi chuyển tiếp', en: 'Local-first architecture: data belongs to the user, the server is a relay' },
    { vi: 'Vẽ canvas hiệu năng cao: vòng lặp khung hình, chia lớp, bỏ qua ngoài khung nhìn', en: 'High-performance canvas rendering: frame loops, layering, viewport culling' },
  ],

  portfolioBonus: [
    { vi: 'Video hai cửa sổ cùng ngoại tuyến, cùng sửa một đối tượng, rồi hội tụ khi nối lại', en: 'A video of two windows editing the same object offline, then converging on reconnect' },
    { vi: 'Số đo kích thước tài liệu trước và sau bước dọn dẹp bia mộ', en: 'Document size measured before and after tombstone garbage collection' },
    { vi: 'Mục README so sánh OT và CRDT bằng chính trải nghiệm khi làm dự án này', en: 'A README section comparing OT and CRDT from what building this actually taught you' },
    { vi: 'Biểu đồ khung hình mỗi giây theo số lượng hình trên bảng', en: 'A frames-per-second chart against the number of shapes on the board' },
    { vi: 'Bài kiểm hội tụ tự động: sinh ngẫu nhiên thao tác cho 3 client rồi so byte cuối', en: 'An automated convergence test: random operations across 3 clients, final bytes compared' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu vì sao đồng thời là bài toán của cấu trúc dữ liệu, không phải của thư viện', en: 'Understand that concurrency is a data-structure problem, not a library problem' },
    { vi: 'Biết đọc một thuật toán phân tán và đánh giá được nó đúng ở điều kiện nào', en: 'Read a distributed algorithm and judge the conditions under which it holds' },
    { vi: 'Tách được trạng thái phù du khỏi trạng thái bền — sai chỗ này là hỏng về sau', en: 'Separate ephemeral from durable state — getting this wrong breaks things later' },
    { vi: 'Dựng được ứng dụng chạy thật khi mất mạng, không chỉ báo lỗi', en: 'Build an application that genuinely works offline rather than showing an error' },
    { vi: 'Nhận ra giới hạn của một công cụ: CRDT giải quyết hội tụ, không giải quyết quyền và ý định', en: 'Recognise a tool\'s limits: CRDTs solve convergence, not authorisation or intent' },
  ],

  bodyMdx,
  bodyMdxEn,
};
