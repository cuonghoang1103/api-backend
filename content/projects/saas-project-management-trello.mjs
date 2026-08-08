/**
 * Case-study 2.2 — SaaS Project Management Tool (Trello clone).
 *
 * The real subject is concurrent ordering (fractional indexing, not integer
 * positions) and multi-tenant isolation four levels deep. Also the first
 * appearance of "send operations, not state" — the primitive that CRDTs
 * generalise in project 3.1.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./saas-project-management-trello.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./saas-project-management-trello.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'saas-project-management-trello',
  title: 'SaaS Project Management (Trello Clone)',
  titleEn: 'SaaS Project Management (Trello Clone)',
  description:
    'Bảng Kanban nhiều tổ chức dùng chung. Bài toán thật không phải kéo thả mà là sắp thứ tự khi nhiều người cùng kéo: khoá phân đoạn biến một thao tác kéo từ 500 lệnh UPDATE xuống còn 1. Kèm phân tách dữ liệu bốn tầng và mẫu "gửi thao tác, không gửi trạng thái".',
  descriptionEn:
    'A multi-tenant Kanban board. The real problem is not drag and drop but concurrent ordering: fractional indexing turns one drag from 500 UPDATE statements into 1. Plus four-level tenant isolation and the "send operations, not state" pattern.',
  techStack: [
    'Next.js 15', 'TypeScript', 'Node.js', 'Socket.IO', 'PostgreSQL', 'Prisma',
    'Redis', 'dnd-kit', 'Stripe Billing', 'Row-Level Security', 'Docker',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `model Card {
  id       String @id @default(cuid())
  listId   String
  title    String

  // KHOÁ PHÂN ĐOẠN, không phải số thứ tự.
  //
  // Với số nguyên 1,2,3: kéo một thẻ lên đầu phải cộng 1 cho MỌI
  // thẻ còn lại — bảng 500 thẻ = 500 lệnh UPDATE cho một thao tác.
  // Với số thực: chèn giữa 1.0 và 2.0 thì thẻ mới là 1.5, và CHỈ
  // dòng đó bị ghi. Hai người kéo hai thẻ khác nhau không đụng nhau.
  //
  // Bẫy: chèn liên tục cùng chỗ làm khoảng cách nhỏ dần (1.5 →
  // 1.25 → 1.125…); sau ~50 lần thì float 64-bit hết độ chính xác.
  // Chữa: phát hiện khoảng cách < ngưỡng thì đánh số lại RIÊNG
  // danh sách đó (vài chục dòng), hoặc đổi sang khoá dạng chuỗi
  // base-62 như Figma/Notion.
  position Float

  dueAt    DateTime?
  archived Boolean  @default(false)

  list     List      @relation(fields: [listId], references: [id], onDelete: Cascade)
  comments Comment[]

  @@index([listId, position])
  @@map("cards")
}

model Membership {
  // Một người thuộc NHIỀU workspace với vai trò KHÁC NHAU ở mỗi
  // nơi — nên vai trò nằm ở bảng nối, không nằm trên User.
  workspaceId String
  userId      String
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([workspaceId, userId])
  @@index([userId])
  @@map("memberships")
}

enum Role { OWNER ADMIN MEMBER GUEST }

-- Lưới an toàn DƯỚI tầng ứng dụng: quên where ở một endpoint
-- không còn dẫn tới rò rỉ, vì database tự lọc.
--
-- ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY card_tenant_isolation ON cards USING (
--   list_id IN (SELECT l.id FROM lists l
--               JOIN boards b ON b.id = l.board_id
--               JOIN memberships m ON m.workspace_id = b.workspace_id
--               WHERE m.user_id = current_setting('app.user_id')::uuid));`,
  schemaCodeEn: `model Card {
  id       String @id @default(cuid())
  listId   String
  title    String

  // A FRACTIONAL INDEX, not a sequence number.
  //
  // With integers 1,2,3: dragging a card to the top means adding 1 to
  // EVERY other card — a 500-card board is 500 UPDATEs for one drag.
  // With a float: inserting between 1.0 and 2.0 gives 1.5, and ONLY
  // that row is written. Two people dragging different cards never
  // collide.
  //
  // The trap: repeated insertion at the same slot halves the gap
  // (1.5 → 1.25 → 1.125…); after ~50 times a 64-bit float runs out of
  // precision. Fix: when the gap drops below a threshold, renumber
  // THAT list only (a few dozen rows), or switch to base-62 string
  // keys as Figma/Notion do.
  position Float

  dueAt    DateTime?
  archived Boolean  @default(false)

  list     List      @relation(fields: [listId], references: [id], onDelete: Cascade)
  comments Comment[]

  @@index([listId, position])
  @@map("cards")
}

model Membership {
  // One person belongs to MANY workspaces with a DIFFERENT role in
  // each — so the role lives on the join table, not on User.
  workspaceId String
  userId      String
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([workspaceId, userId])
  @@index([userId])
  @@map("memberships")
}

enum Role { OWNER ADMIN MEMBER GUEST }

-- A safety net BELOW the application layer: forgetting a where clause
-- in one endpoint no longer leaks, because the database filters anyway.
--
-- ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY card_tenant_isolation ON cards USING (
--   list_id IN (SELECT l.id FROM lists l
--               JOIN boards b ON b.id = l.board_id
--               JOIN memberships m ON m.workspace_id = b.workspace_id
--               WHERE m.user_id = current_setting('app.user_id')::uuid));`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Sắp thứ tự: vì sao số nguyên là lựa chọn sai',
      titleEn: 'Ordering: why integers are the wrong choice',
      description:
        'Kéo một thẻ lên đầu bảng 500 thẻ với position là số nguyên = 500 lệnh UPDATE, và hai người cùng kéo thì kết quả phụ thuộc ai ghi sau. Khoá phân đoạn: lấy trung bình hai vị trí kề, một thao tác kéo chỉ ghi đúng một dòng, bất kể bảng lớn cỡ nào.',
      descriptionEn:
        'Dragging a card to the top of a 500-card board with integer positions is 500 UPDATEs, and two simultaneous drags resolve by whoever writes last. Fractional indexing: take the midpoint of the neighbours, and one drag writes exactly one row regardless of board size.',
      codeBlock:
        '// Một thao tác kéo = MỘT lệnh UPDATE trên MỘT dòng.\n'
        + 'function computePosition(prev?: number, next?: number): number {\n'
        + '  if (prev === undefined && next === undefined) return 1;   // bảng rỗng\n'
        + '  if (prev === undefined) return next! / 2;                 // thả lên đầu\n'
        + '  if (next === undefined) return prev + 1;                  // thả xuống cuối\n'
        + '  return (prev + next) / 2;                                 // chèn giữa\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'DATABASE',
      title: 'Bẫy hết độ chính xác, và hai cách chữa',
      titleEn: 'The precision trap, and two remedies',
      description:
        'Chèn liên tục vào cùng một chỗ: 1.5 → 1.25 → 1.125… sau ~50 lần thì float 64-bit hết độ chính xác và hai thẻ trùng vị trí. Chữa: (1) phát hiện khoảng cách quá nhỏ rồi đánh số lại riêng danh sách đó; (2) đổi sang khoá chuỗi base-62 — cách Figma và Notion thực sự dùng.',
      descriptionEn:
        'Insert repeatedly at the same slot: 1.5 → 1.25 → 1.125… and after ~50 times a 64-bit float runs out and two cards collide. Remedies: (1) detect the small gap and renumber that list; (2) switch to base-62 string keys — what Figma and Notion actually use.',
    },
    {
      phase: 'SECURITY',
      title: 'Multi-tenant: kiểm quyền qua bốn tầng lồng nhau',
      titleEn: 'Multi-tenant: authorising through four nested levels',
      description:
        'Thẻ → danh sách → bảng → workspace → bảng thành viên. Viết tay chuỗi kiểm tra đó ở mọi endpoint là đảm bảo sẽ quên ở đâu đó. Hai lựa chọn: một hàm kiểm quyền dùng chung (một truy vấn join thẳng tới membership), hoặc Row-Level Security của Postgres làm lưới an toàn dưới tầng ứng dụng.',
      descriptionEn:
        'Card → list → board → workspace → membership. Hand-writing that chain in every endpoint guarantees it gets forgotten somewhere. Two options: one shared authorisation function (a single query joining straight to membership), or Postgres Row-Level Security as a net below the application.',
      codeBlock:
        '// Một truy vấn join thẳng tới membership, thay vì bốn truy\n'
        + '// vấn nối tiếp. Trả CÙNG một lỗi cho "không tồn tại" và\n'
        + '// "không có quyền" — phân biệt hai cái đó cho phép người\n'
        + '// ngoài dò xem một thẻ có tồn tại hay không.\n'
        + 'const row = await prisma.card.findFirst({\n'
        + '  where: { id: cardId, list: { board: { workspace: {\n'
        + '    memberships: { some: { userId, role: { in: need } } } } } } },\n'
        + '  select: { id: true },\n'
        + '});\n'
        + 'if (!row) throw new ForbiddenError();',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Gửi thao tác, không gửi trạng thái',
      titleEn: 'Send operations, not state',
      description:
        'A kéo thẻ trong khi B đổi tên chính thẻ đó. Hai thay đổi KHÔNG xung đột vì chạm hai trường khác nhau — nhưng nếu client PUT cả đối tượng thì thay đổi tới sau ghi đè cả trường nó không hề động tới (lost update). Sự kiện theo thao tác, và server chỉ ghi đúng cột của thao tác đó.',
      descriptionEn:
        'A drags a card while B renames it. The two changes do NOT conflict — they touch different fields — but if the client PUTs the whole object, the later write clobbers a field it never touched (a lost update). Operation-scoped events, and the server writes only that operation\'s columns.',
    },
    {
      phase: 'BACKEND',
      title: 'Giới hạn gói phải thực thi nơi có tính nguyên tử',
      titleEn: 'Plan limits must be enforced where atomicity lives',
      description:
        'Kiểm ở giao diện thì mở DevTools là qua mặt. Kiểm ở service bằng count rồi create thì hai request cùng lúc đều thấy "đang có 2 bảng" và cùng tạo. Đúng: SELECT ... FOR UPDATE trong giao dịch. Đây là lần thứ TƯ trong lộ trình gặp cùng mẫu hình này.',
      descriptionEn:
        'Checking in the UI is bypassed by opening DevTools. Checking in the service with count-then-create lets two concurrent requests both see "2 boards" and both create. Correct: SELECT ... FOR UPDATE inside a transaction. This is the FOURTH time the roadmap meets this pattern.',
      codeBlock:
        '// Khoá dòng workspace: hai request tạo bảng cùng lúc xếp hàng\n'
        + '// thay vì cùng đọc một con số đã lỗi thời.\n'
        + 'const ws = await tx.$queryRaw`\n'
        + '  SELECT plan, board_count FROM workspaces\n'
        + '   WHERE id = ${workspaceId} FOR UPDATE`;\n'
        + 'if (ws.board_count >= PLAN_LIMITS[ws.plan].boards)\n'
        + '  throw new PlanLimitError();',
      codeLang: 'typescript',
    },
    {
      phase: 'FRONTEND',
      title: 'Kéo thả lạc quan và đồng bộ nhiều người xem',
      titleEn: 'Optimistic drag and multi-viewer sync',
      description:
        'Thẻ phải di chuyển ngay dưới ngón tay, không chờ mạng — nhưng phải trả về chỗ cũ nếu server từ chối. Mọi người đang mở bảng nhận sự kiện qua Socket.IO và áp dụng cùng một thao tác, nên ai cũng thấy một thứ tự giống nhau.',
      descriptionEn:
        'The card must move under the finger immediately, not after a round trip — but must snap back if the server refuses. Everyone with the board open receives the event over Socket.IO and applies the same operation, so all viewers converge on one order.',
    },
    {
      phase: 'TESTING',
      title: 'Đếm số lệnh UPDATE, và thử rò rỉ giữa hai tổ chức',
      titleEn: 'Count the UPDATEs, and probe for cross-tenant leaks',
      description:
        'Bật log truy vấn rồi kéo một thẻ trong bảng 1.000 thẻ — phải thấy đúng 1 lệnh UPDATE. Đăng nhập bằng tài khoản không thuộc workspace rồi gọi thẳng API bằng curl — mọi endpoint phải trả 403. Bấm tạo bảng mười lần thật nhanh ở gói FREE — đúng 3 bảng được tạo.',
      descriptionEn:
        'Enable query logging and drag a card on a 1,000-card board — exactly 1 UPDATE should appear. Sign in as a non-member and hit the API with curl — every endpoint must return 403. Click "create board" ten times rapidly on FREE — exactly 3 should be created.',
    },
  ],

  features: [
    { title: 'Kéo thả thẻ giữa các danh sách', titleEn: 'Drag cards between lists', description: 'Khoá phân đoạn: một thao tác kéo chỉ ghi một dòng.', descriptionEn: 'Fractional indexing: one drag writes one row.', status: 'PLANNED' },
    { title: 'Đồng bộ thời gian thực nhiều người', titleEn: 'Multi-user real-time sync', description: 'Sự kiện theo thao tác qua Socket.IO, không gửi cả đối tượng.', descriptionEn: 'Operation-scoped Socket.IO events rather than whole objects.', status: 'PLANNED' },
    { title: 'Nhiều không gian làm việc, bốn vai trò', titleEn: 'Multiple workspaces, four roles', description: 'Vai trò nằm ở bảng nối vì một người có vai trò khác nhau ở mỗi nơi.', descriptionEn: 'Roles live on the join table because one person differs per workspace.', status: 'PLANNED' },
    { title: 'Phân tách dữ liệu bốn tầng', titleEn: 'Four-level tenant isolation', description: 'Một hàm kiểm quyền dùng chung, kèm tuỳ chọn Row-Level Security.', descriptionEn: 'One shared authorisation function, with Row-Level Security as an option.', status: 'PLANNED' },
    { title: 'Bình luận, đính kèm, nhãn, hạn chót', titleEn: 'Comments, attachments, labels, due dates', description: 'Đính kèm tải thẳng lên S3 bằng presigned URL.', descriptionEn: 'Attachments upload directly to S3 with presigned URLs.', status: 'PLANNED' },
    { title: 'Nhật ký hoạt động', titleEn: 'Activity log', description: 'Bảng chỉ thêm dòng, lưu ai làm gì với payload jsonb.', descriptionEn: 'An append-only table recording who did what, with a jsonb payload.', status: 'PLANNED' },
    { title: 'Gói thanh toán và giới hạn theo gói', titleEn: 'Subscription plans and per-plan limits', description: 'Giới hạn thực thi trong giao dịch có khoá dòng, không phải bằng câu if.', descriptionEn: 'Limits enforced inside a row-locked transaction, not with an if statement.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Figma — Fractional indexing', titleEn: 'Figma — Fractional indexing', url: 'https://www.figma.com/blog/realtime-editing-of-ordered-sequences/', type: 'LINK', description: 'Bài gốc giải thích vì sao khoá phân đoạn là lời giải cho sắp thứ tự đồng thời.', descriptionEn: 'The original write-up on why fractional indexing solves concurrent ordering.' },
    { title: 'PostgreSQL — Row Security Policies', titleEn: 'PostgreSQL — Row Security Policies', url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html', type: 'LINK', description: 'Cách đặt phân tách dữ liệu xuống tận database.', descriptionEn: 'How to push tenant isolation all the way into the database.' },
    { title: 'dnd-kit — thư viện kéo thả', titleEn: 'dnd-kit — drag and drop toolkit', url: 'https://dndkit.com/', type: 'LINK', description: 'Hỗ trợ bàn phím và trình đọc màn hình, thứ mà phần lớn thư viện kéo thả bỏ qua.', descriptionEn: 'Keyboard and screen-reader support, which most drag libraries skip.' },
    { title: 'Stripe — Billing cho SaaS', titleEn: 'Stripe — Billing for SaaS', url: 'https://docs.stripe.com/billing/subscriptions/overview', type: 'LINK', description: 'Vòng đời gói thuê bao: dùng thử, nâng cấp, hạ cấp, thanh toán thất bại.', descriptionEn: 'The subscription lifecycle: trials, upgrades, downgrades, failed payments.' },
  ],

  coreKnowledge: [
    { vi: 'Khoá phân đoạn: giải bài toán sắp thứ tự đồng thời mà không đánh số lại', en: 'Fractional indexing: solving concurrent ordering without renumbering' },
    { vi: 'Giới hạn của số thực, và khi nào phải chuyển sang khoá dạng chuỗi', en: 'The limits of floats, and when to move to string-based keys' },
    { vi: 'Kiến trúc multi-tenant: một cơ sở dữ liệu chung với phân tách theo hàng', en: 'Multi-tenant architecture: one shared database with row-level separation' },
    { vi: 'Row-Level Security của Postgres như lớp phòng thủ cuối cùng', en: 'Postgres Row-Level Security as a last line of defence' },
    { vi: 'Phân quyền theo vai trò khi vai trò thay đổi theo từng tổ chức', en: 'Role-based access control when the role varies per organisation' },
    { vi: 'Lost update, và vì sao gửi thao tác an toàn hơn gửi trạng thái', en: 'Lost updates, and why sending operations beats sending state' },
    { vi: 'Cập nhật lạc quan trong giao diện kéo thả, kèm hoàn tác khi thất bại', en: 'Optimistic updates in a drag-and-drop UI, with rollback on failure' },
    { vi: 'Thực thi quy tắc nghiệp vụ ở nơi có tính nguyên tử (mẫu hình lặp lại lần thứ tư)', en: 'Enforcing business rules where atomicity exists (the fourth recurrence)' },
    { vi: 'Mô hình gói thuê bao: hạn mức, chỗ ngồi, và vòng đời thanh toán', en: 'Subscription modelling: quotas, seats, and the billing lifecycle' },
  ],

  portfolioBonus: [
    { vi: 'Video hai cửa sổ kéo thẻ đồng bộ theo thời gian thực', en: 'A video of two windows dragging cards in sync' },
    { vi: 'Log truy vấn chứng minh một thao tác kéo chỉ sinh một lệnh UPDATE', en: 'Query logs proving one drag produces one UPDATE' },
    { vi: 'Bài viết ngắn giải thích khoá phân đoạn kèm sơ đồ', en: 'A short write-up explaining fractional indexing with a diagram' },
    { vi: 'Bộ test rò rỉ dữ liệu giữa hai tổ chức, chạy tự động trong CI', en: 'A cross-tenant leak test suite running automatically in CI' },
    { vi: 'Bàn phím dùng được toàn bộ thao tác kéo thả (kiểm bằng trình đọc màn hình)', en: 'Fully keyboard-operable drag and drop, verified with a screen reader' },
  ],

  completionOutcomes: [
    { vi: 'Giải bài toán sắp thứ tự đồng thời bằng cấu trúc dữ liệu thay vì khoá', en: 'Solve concurrent ordering with a data structure rather than a lock' },
    { vi: 'Thiết kế hệ thống multi-tenant không rò rỉ dữ liệu giữa khách hàng', en: 'Design a multi-tenant system that does not leak between customers' },
    { vi: 'Nhận ra lost update trong API và sửa bằng cách thiết kế lại giao thức', en: 'Spot lost updates in an API and fix them by redesigning the protocol' },
    { vi: 'Xây giao diện cộng tác cảm giác tức thì nhưng vẫn đúng khi server từ chối', en: 'Build a collaborative UI that feels instant yet stays correct when the server says no' },
    { vi: 'Mô hình hoá sản phẩm SaaS có gói cước và thực thi hạn mức đúng chỗ', en: 'Model a SaaS product with plans and enforce quotas in the right place' },
  ],

  bodyMdx,
  bodyMdxEn,
};
