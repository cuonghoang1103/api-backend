/**
 * Case-study 1.1 — Todo List App (Full-Stack). First rung of the 25-project
 * roadmap: the smallest app that still contains a users table, per-user data
 * isolation, validation on both ends, and a real deployment.
 *
 * Prose lives in two sibling files (VI + EN) for the same reason as
 * cuonghoang-dev-portal.md: long-form markdown with code fences and mermaid
 * diagrams is unreadable inside a JS template literal, and a `.md` file gets
 * proper syntax highlighting in review.
 *
 * The slug is kept EXACTLY as it already exists in production so the row is
 * re-authored in place — viewCount / likeCount / thumbnailUrl survive. See the
 * idempotency notes in scripts/project-seed.mjs.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./todo-list-app-full-stack.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./todo-list-app-full-stack.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'todo-list-app-full-stack',
  title: 'Todo List App (Full-Stack)',
  titleEn: 'Todo List App (Full-Stack)',
  description:
    'Dự án đầu tiên của lộ trình: ứng dụng công việc cá nhân với NextAuth v5, Prisma và PostgreSQL. Nhỏ nhưng chứa đủ bốn mảnh ghép mà mọi app sau này đều dùng lại — bảng người dùng, dữ liệu thuộc về người dùng, cơ chế chứng minh danh tính, và một tầng API biết từ chối.',
  descriptionEn:
    'The first project on the roadmap: a personal task app built on NextAuth v5, Prisma and PostgreSQL. Small, but it already contains the four pieces every later app reuses — a users table, user-owned rows, a way to prove identity, and an API layer that knows how to say no.',
  techStack: [
    'Next.js 15 (App Router)', 'React 19', 'TypeScript', 'TailwindCSS',
    'Prisma', 'PostgreSQL', 'NextAuth.js v5', 'Zod', 'bcrypt', 'Vitest', 'Vercel',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–7 ngày',
  durationEn: '3–7 days',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'BEGINNER',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/todo-list-app-full-stack.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// Hai bảng, một quan hệ — nhưng mọi quyết định đều có lý do.

model User {
  // cuid() thay vì autoincrement(): id không đoán được, và
  // không tiết lộ hệ thống có bao nhiêu tài khoản.
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // CHUỖI BĂM bcrypt, không phải mật khẩu
  todos     Todo[]
  createdAt DateTime @default(now())
  @@map("users")
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime? // null = không có hạn (đúng hơn ngày quy ước)

  userId      String
  // Cascade: xoá user thì todo biến mất theo, không để lại
  // bản ghi mồ côi trỏ tới user không tồn tại.
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // MỌI truy vấn đều có dạng "todo của user X, mới nhất trước".
  @@index([userId, createdAt])
  @@map("todos")
}

enum Priority { LOW MEDIUM HIGH }`,
  schemaCodeEn: `// Two tables, one relation — but every decision has a reason.

model User {
  // cuid() instead of autoincrement(): ids are unguessable, and
  // they do not reveal how many accounts the system holds.
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // a bcrypt HASH, never the password
  todos     Todo[]
  createdAt DateTime @default(now())
  @@map("users")
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime? // null = no deadline (better than a sentinel date)

  userId      String
  // Cascade: deleting a user removes their todos instead of
  // leaving orphan rows pointing at a user that is gone.
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // EVERY query has the shape "this user's todos, newest first".
  @@index([userId, createdAt])
  @@map("todos")
}

enum Priority { LOW MEDIUM HIGH }`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'SETUP',
      title: 'Dựng môi trường: Node, Postgres, Next.js, Prisma',
      titleEn: 'Environment: Node, Postgres, Next.js, Prisma',
      description:
        'Cài Node 20 qua nvm, chạy Postgres 16 bằng Docker, khởi tạo Next.js với TypeScript + Tailwind, cài Prisma và NextAuth v5 beta. Kết thúc bước này phải chạy được `prisma migrate dev` và thấy bảng thật trong DB — không dừng ở "npm run dev lên được trang mặc định".',
      descriptionEn:
        'Install Node 20 via nvm, run Postgres 16 in Docker, scaffold Next.js with TypeScript + Tailwind, add Prisma and NextAuth v5 beta. This step is done when `prisma migrate dev` runs and you can see real tables in the database — not when the default page renders.',
      codeBlock:
        'docker run --name todo-pg -e POSTGRES_PASSWORD=devpassword \\\n'
        + '  -e POSTGRES_DB=todoapp -p 5432:5432 -d postgres:16\n\n'
        + 'npx create-next-app@latest todo-app --typescript --tailwind --app\n'
        + 'cd todo-app\n'
        + 'npm install prisma @prisma/client next-auth@beta bcryptjs zod\n'
        + 'npx prisma init\n'
        + 'npx prisma migrate dev --name init',
      codeLang: 'bash',
    },
    {
      phase: 'DATABASE',
      title: 'Schema hai bảng và những quyết định phía sau',
      titleEn: 'A two-table schema and the decisions behind it',
      description:
        'cuid() thay id tăng dần, enum thay chuỗi tự do cho priority, dueDate cho phép null, và chỉ mục kép [userId, createdAt] khớp đúng hình dạng của mọi truy vấn trong app. Bốn quyết định nhỏ này là khác biệt giữa một schema chạy được và một schema còn dùng được sau sáu tháng.',
      descriptionEn:
        'cuid() instead of incrementing ids, an enum instead of a free-form string for priority, a nullable dueDate, and a composite [userId, createdAt] index matching the shape of every query in the app. These four small decisions separate a schema that runs from one that still works six months later.',
    },
    {
      phase: 'BACKEND',
      title: 'Đăng ký + đăng nhập: băm mật khẩu và JWT httpOnly',
      titleEn: 'Register + sign in: password hashing and httpOnly JWTs',
      description:
        'bcrypt với salt và cost factor 10, thông báo lỗi cố tình mơ hồ để không rò rỉ danh sách email đang tồn tại, JWT ký bằng AUTH_SECRET và đặt trong cookie httpOnly. Hai callback jwt/session bắt buộc phải có — thiếu chúng thì session.user.id là undefined và mọi truy vấn lọc theo user trả rỗng mà không báo lỗi nào.',
      descriptionEn:
        'bcrypt with a salt and cost factor 10, deliberately vague error messages so the list of registered emails does not leak, a JWT signed with AUTH_SECRET and stored in an httpOnly cookie. The jwt/session callbacks are mandatory — without them session.user.id is undefined and every per-user query silently returns nothing.',
      codeBlock:
        'callbacks: {\n'
        + '  // Mặc định JWT của NextAuth KHÔNG chứa id. Thiếu hai\n'
        + '  // callback này, session.user.id là undefined và mọi\n'
        + '  // truy vấn lọc theo user trả rỗng — bug im lặng.\n'
        + '  async jwt({ token, user }) {\n'
        + '    if (user) token.id = user.id;\n'
        + '    return token;\n'
        + '  },\n'
        + '  async session({ session, token }) {\n'
        + '    if (session.user) session.user.id = token.id as string;\n'
        + '    return session;\n'
        + '  },\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Route Handler và lằn ranh "ai thấy được gì"',
      titleEn: 'Route Handlers and the "who sees what" line',
      description:
        'userId luôn lấy từ session đã ký, không bao giờ từ body hay query string. Sửa/xoá dùng updateMany/deleteMany với where kèm userId — chống IDOR ở tầng truy vấn thay vì tin vào một câu if. Trả 404 chứ không 403 khi không sở hữu, vì 403 vô tình xác nhận bản ghi đó tồn tại.',
      descriptionEn:
        'userId always comes from the signed session, never from the body or a query string. Updates and deletes use updateMany/deleteMany with userId in the where clause — IDOR defence at the query layer instead of trusting a single if statement. Non-owners get 404 rather than 403, because 403 quietly confirms the record exists.',
      codeBlock:
        '// updateMany + userId trong where = chống IDOR ở tầng truy vấn.\n'
        + '// Viết update({ where: { id } }) là bất kỳ ai đăng nhập cũng\n'
        + '// sửa được todo của người khác chỉ bằng cách đoán id.\n'
        + 'const result = await prisma.todo.updateMany({\n'
        + '  where: { id, userId: session.user.id },\n'
        + '  data: { completed: Boolean(body.completed) },\n'
        + '});\n\n'
        + '// 404 chứ không 403: 403 xác nhận bản ghi TỒN TẠI.\n'
        + 'if (result.count === 0) {\n'
        + '  return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'FRONTEND',
      title: 'Server Component dựng trang, Client Component xử lý tương tác',
      titleEn: 'Server Components render, Client Components interact',
      description:
        'Dashboard là Server Component truy vấn Prisma trực tiếp nên lần tải đầu đã có dữ liệu, không có nhấp nháy "loading". Danh sách là Client Component với cập nhật lạc quan CÓ hoàn tác, và pendingIds là Set chứ không phải một biến loading chung — bấm ba checkbox liên tiếp thì chỉ đúng cái đang gửi bị khoá.',
      descriptionEn:
        'The dashboard is a Server Component querying Prisma directly, so the first paint already has data and there is no loading flash. The list is a Client Component with an optimistic update that also rolls back, and pendingIds is a Set rather than one shared loading flag — tick three checkboxes and only the row in flight is disabled.',
    },
    {
      phase: 'TESTING',
      title: 'Ba bài test bắt đúng lỗi không tự thấy được',
      titleEn: 'Three tests that catch what clicking around cannot',
      description:
        'Tự bấm tay không bao giờ phát hiện IDOR, vì bạn chỉ có một tài khoản. Ba test: B không sửa được todo của A, B không xoá được, và xoá user thì todo biến mất theo (kiểm tra onDelete Cascade thật sự chạy chứ không chỉ nằm trong schema).',
      descriptionEn:
        'Clicking around never finds IDOR, because you only have one account. Three tests: B cannot edit A\'s todo, B cannot delete it, and deleting a user removes their todos — proving onDelete Cascade actually runs rather than merely existing in the schema.',
      codeBlock:
        "it('B không sửa được todo của A', async () => {\n"
        + '  const result = await prisma.todo.updateMany({\n'
        + '    where: { id: todoOfA.id, userId: userB.id },\n'
        + "    data: { title: 'bị chiếm' },\n"
        + '  });\n'
        + '  expect(result.count).toBe(0);\n'
        + '});',
      codeLang: 'typescript',
    },
    {
      phase: 'DEVOPS',
      title: 'Deploy Vercel, và vì sao migrate deploy chứ không migrate dev',
      titleEn: 'Deploy to Vercel, and why migrate deploy not migrate dev',
      description:
        'AUTH_SECRET sinh bằng openssl rand, kiểm .gitignore bằng git check-ignore TRƯỚC lần commit đầu. Trên production dùng prisma migrate deploy: migrate dev có thể tự sinh migration và trong vài tình huống đề nghị reset cả database — trên production nghĩa là mất sạch dữ liệu người dùng.',
      descriptionEn:
        'Generate AUTH_SECRET with openssl rand, and verify .gitignore with git check-ignore BEFORE the first commit. Production uses prisma migrate deploy: migrate dev can generate migrations and, in some situations, offers to reset the database — on production that means losing every user record.',
      codeBlock:
        '# Kiểm TRƯỚC lần commit đầu tiên. Có output = an toàn.\n'
        + 'git check-ignore -v .env.local\n\n'
        + '# Sinh khoá ký JWT. Ai có khoá này thì tạo được token\n'
        + '# hợp lệ cho BẤT KỲ tài khoản nào.\n'
        + 'openssl rand -base64 32\n\n'
        + '# package.json — production KHÔNG dùng migrate dev\n'
        + '"build": "prisma migrate deploy && next build"',
      codeLang: 'bash',
    },
  ],

  features: [
    { title: 'Đăng ký / đăng nhập / đăng xuất', titleEn: 'Register / sign in / sign out', description: 'NextAuth v5 Credentials provider, mật khẩu băm bcrypt, JWT trong cookie httpOnly.', descriptionEn: 'NextAuth v5 Credentials provider, bcrypt-hashed passwords, JWT in an httpOnly cookie.', status: 'PLANNED' },
    { title: 'CRUD công việc đầy đủ', titleEn: 'Full task CRUD', description: 'Tạo, sửa, xoá, đánh dấu hoàn thành — mọi thao tác đều kiểm quyền sở hữu ở tầng truy vấn.', descriptionEn: 'Create, edit, delete, mark done — every operation checks ownership at the query layer.', status: 'PLANNED' },
    { title: 'Lọc, tìm kiếm, sắp xếp', titleEn: 'Filter, search, sort', description: 'Lọc theo trạng thái, tìm theo tiêu đề, sắp xếp theo hạn chót hoặc mức ưu tiên.', descriptionEn: 'Filter by status, search by title, sort by due date or priority.', status: 'PLANNED' },
    { title: 'Cập nhật lạc quan có hoàn tác', titleEn: 'Optimistic updates with rollback', description: 'Giao diện phản hồi tức thì; khi server từ chối thì trả về trạng thái cũ thay vì để lệch với DB.', descriptionEn: 'Instant UI feedback; when the server refuses, the previous state is restored rather than drifting from the DB.', status: 'PLANNED' },
    { title: 'Validate hai tầng bằng Zod', titleEn: 'Two-layer validation with Zod', description: 'Client validate để lịch sự, server validate để sống sót — cùng một schema, hai mục đích khác nhau.', descriptionEn: 'The client validates to be polite, the server validates to survive — one schema, two different purposes.', status: 'PLANNED' },
    { title: 'Chống IDOR ở tầng truy vấn', titleEn: 'Query-level IDOR defence', description: 'updateMany/deleteMany luôn kèm userId trong where; không sở hữu thì khớp 0 dòng và nhận 404.', descriptionEn: 'updateMany/deleteMany always carry userId in the where clause; a non-owner matches zero rows and gets a 404.', status: 'PLANNED' },
    { title: 'Giao diện tối/sáng, responsive', titleEn: 'Dark/light theme, responsive', description: 'Tailwind với biến thể dark:, bố cục mobile-first.', descriptionEn: 'Tailwind dark: variants, mobile-first layout.', status: 'PLANNED' },
    { title: 'Test phân tách dữ liệu', titleEn: 'Data-isolation tests', description: 'Vitest kiểm tra người dùng B không đọc/sửa/xoá được dữ liệu của A, và Cascade thật sự chạy.', descriptionEn: 'Vitest proves user B cannot read/edit/delete user A\'s rows, and that Cascade actually runs.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Next.js App Router — tài liệu chính thức', titleEn: 'Next.js App Router — official docs', url: 'https://nextjs.org/docs/app', type: 'LINK', description: 'Đọc kỹ mục Server và Client Components trước khi viết dòng code đầu tiên.', descriptionEn: 'Read the Server and Client Components chapter before writing the first line of code.' },
    { title: 'Prisma — Getting Started với PostgreSQL', titleEn: 'Prisma — Getting Started with PostgreSQL', url: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql', type: 'LINK', description: 'Từ schema đầu tiên tới migration đầu tiên.', descriptionEn: 'From first schema to first migration.' },
    { title: 'NextAuth.js v5 (Auth.js)', titleEn: 'NextAuth.js v5 (Auth.js)', url: 'https://authjs.dev/getting-started', type: 'LINK', description: 'Bản viết lại cho App Router. Chú ý phần callbacks jwt/session.', descriptionEn: 'The App Router rewrite. Pay attention to the jwt/session callbacks.' },
    { title: 'OWASP — Broken Access Control', titleEn: 'OWASP — Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/', type: 'LINK', description: 'IDOR nằm ở mục A01, lỗ hổng đứng đầu bảng xếp hạng OWASP. Đọc trước khi viết route sửa/xoá.', descriptionEn: 'IDOR sits under A01, the top entry in the OWASP ranking. Read it before writing update/delete routes.' },
    { title: 'Zod — schema validation', titleEn: 'Zod — schema validation', url: 'https://zod.dev', type: 'LINK', description: 'Một schema dùng chung cho cả kiểm tra dữ liệu lẫn suy ra kiểu TypeScript.', descriptionEn: 'One schema serving both runtime validation and TypeScript type inference.' },
    { title: 'NIST SP 800-63B — hướng dẫn về mật khẩu', titleEn: 'NIST SP 800-63B — password guidelines', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html', type: 'LINK', description: 'Vì sao bắt buộc ký tự đặc biệt lại phản tác dụng, và độ dài quan trọng hơn độ phức tạp.', descriptionEn: 'Why mandatory special characters backfire, and why length beats complexity.' },
  ],

  coreKnowledge: [
    { vi: 'React Server Components và Client Components — ranh giới, và cái gì truyền qua được', en: 'React Server Components vs Client Components — the boundary, and what can cross it' },
    { vi: 'Quy ước định tuyến của Next.js App Router: page, layout, route handler, middleware', en: 'Next.js App Router routing conventions: page, layout, route handler, middleware' },
    { vi: 'Prisma: schema, migration, quan hệ, và vì sao migrate deploy khác migrate dev', en: 'Prisma: schema, migrations, relations, and why migrate deploy differs from migrate dev' },
    { vi: 'NextAuth v5: luồng JWT, cookie httpOnly, và hai callback bắt buộc để có user id', en: 'NextAuth v5: the JWT flow, httpOnly cookies, and the two callbacks needed to get a user id' },
    { vi: 'bcrypt: băm khác mã hoá, vai trò của salt và cost factor', en: 'bcrypt: hashing is not encryption, and what salt and cost factor actually do' },
    { vi: 'Zod: một schema vừa validate lúc chạy vừa suy ra kiểu TypeScript', en: 'Zod: one schema that both validates at runtime and infers TypeScript types' },
    { vi: 'IDOR và cách chặn nó ở tầng truy vấn thay vì bằng một câu if', en: 'IDOR and how to block it at the query layer instead of with an if statement' },
    { vi: 'Chỉ mục kép trong Postgres và cách nó khớp với hình dạng truy vấn', en: 'Composite indexes in Postgres and how they match query shape' },
    { vi: 'TypeScript strict mode, và cách khai báo mở rộng kiểu của thư viện ngoài', en: 'TypeScript strict mode, and how to augment a third-party library\'s types' },
    { vi: 'Biến môi trường: cái gì bí mật, cái gì lộ ra client, và vì sao .gitignore phải kiểm trước khi commit', en: 'Environment variables: what is secret, what reaches the client, and why to verify .gitignore before committing' },
  ],

  portfolioBonus: [
    { vi: 'Live demo chạy thật trên Vercel với tên miền riêng, mở được trên điện thoại', en: 'A live demo on Vercel with a custom domain, working on a phone' },
    { vi: 'README có ảnh chụp màn hình và ba dòng lệnh chạy lại được trên máy trắng', en: 'A README with screenshots and three commands that work on a clean machine' },
    { vi: 'GitHub Actions chạy lint + test + tsc trên mỗi pull request', en: 'GitHub Actions running lint + tests + tsc on every pull request' },
    { vi: 'Test E2E bằng Playwright cho luồng đăng nhập và tạo công việc', en: 'Playwright end-to-end tests covering sign-in and task creation' },
    { vi: 'Một mục "Bảo mật" trong README nói rõ IDOR được chặn ở đâu và kiểm bằng cách nào', en: 'A "Security" section in the README naming where IDOR is blocked and how it is verified' },
    { vi: 'Storybook cho các component dùng lại (Button, Input, TodoItem)', en: 'Storybook for the reusable components (Button, Input, TodoItem)' },
  ],

  completionOutcomes: [
    { vi: 'Viết CRUD đầy đủ trên Next.js App Router mà không nhầm ranh giới server/client', en: 'Write full CRUD on the Next.js App Router without confusing the server/client boundary' },
    { vi: 'Dựng luồng xác thực từ đầu và giải thích được từng bước, không chỉ chép cấu hình', en: 'Build an auth flow from scratch and explain each step rather than copying a config' },
    { vi: 'Thiết kế schema quan hệ có chỉ mục đúng và ràng buộc xoá đúng', en: 'Design a relational schema with the right indexes and the right delete behaviour' },
    { vi: 'Nhận ra IDOR trong code người khác, và biết cách kiểm chứng bằng hai tài khoản', en: 'Spot IDOR in someone else\'s code, and know how to prove it with two accounts' },
    { vi: 'Đưa một ứng dụng có database lên production mà không rò rỉ khoá bí mật', en: 'Ship a database-backed app to production without leaking a secret key' },
  ],

  bodyMdx,
  bodyMdxEn,
};
