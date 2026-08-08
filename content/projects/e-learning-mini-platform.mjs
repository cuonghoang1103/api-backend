/**
 * Case-study INT605 — E-learning Mini Platform.
 * Semester 6 internship project #5, and the semester's first single-app
 * full-stack build (Next.js 14 App Router).
 *
 * DELIBERATELY NOT a repeat of /projects/learning-management-system: that one
 * is about protecting CONTENT (video, signed URLs, certificates, anti-cheat
 * progress). This one is about the TRUST BOUNDARY — where grading may happen,
 * what the client is allowed to send, and proving the answer key never leaks.
 *
 * Through-line: the concurrency lesson returns as "exactly one attempt",
 * enforced by @@unique instead of a findFirst-then-create if.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./e-learning-mini-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./e-learning-mini-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'e-learning-mini-platform',
  title: 'E-learning Mini Platform (Đồ án thực tập #5)',
  titleEn: 'E-learning Mini Platform (Internship Project #5)',
  description:
    'Đồ án #5 Kỳ 6: full-stack trong MỘT app Next.js 14 App Router + Prisma + Auth.js. Chủ đề không phải video hay chứng chỉ mà là RANH GIỚI TIN CẬY — đáp án đúng không bao giờ được rời máy chủ, điểm số do máy chủ tính, và "mỗi học viên một lượt" thực thi bằng UNIQUE chứ không bằng câu if.',
  descriptionEn:
    'Semester 6 project #5: full-stack inside ONE Next.js 14 App Router app with Prisma and Auth.js. The subject is not video or certificates but the TRUST BOUNDARY — the answer key never leaves the server, the score is computed server-side, and "one attempt per student" is enforced by UNIQUE rather than an if.',
  techStack: [
    'Next.js 14 (App Router)', 'React Server Components', 'Server Actions', 'TypeScript',
    'Prisma', 'PostgreSQL', 'Auth.js', 'zod', 'TailwindCSS', 'Vitest', 'Docker Compose',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3 tuần',
  durationEn: '3 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/e-learning-mini-platform.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// Toàn bộ bảo mật của đồ án này nằm ở HAI dòng có chú thích viết hoa
// bên dưới. Mọi thứ còn lại chỉ là CRUD.

model Question {
  id           Int    @id @default(autoincrement())
  quizId       Int
  text         String @db.Text
  options      Json                  // ["3", "4", "5"]
  // KHÔNG BAO GIỜ select cột này ra client. Props truyền sang Client
  // Component được tuần tự hoá và NHÚNG VÀO HTML — Ctrl+U là đọc được.
  // Dùng select tường minh, không dùng include.
  correctIndex Int
  order        Int
  quiz         Quiz   @relation(fields: [quizId], references: [id], onDelete: Cascade)

  @@index([quizId, order])
  @@map("questions")
}

model Attempt {
  id          Int       @id @default(autoincrement())
  quizId      Int
  userId      String
  // Máy chủ TÍNH ra con số này từ đáp án trong DB. Client gửi lên
  // { score: 100 } thì bỏ qua và tính lại.
  score       Int
  answers     Json                   // để xem lại bài đã làm
  // Giới hạn thời gian được thực thi bằng cách so now() - startedAt
  // ở máy chủ lúc nộp. Đồng hồ đếm ngược trong React là TRANG TRÍ.
  startedAt   DateTime  @default(now())
  submittedAt DateTime?

  quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // MỘT DÒNG NÀY thay cho "findFirst rồi if rồi create" — và không lần
  // gửi lại nào lách được. Đặt tên thì truy vấn phải dùng ĐÚNG tên này,
  // không phải khoá ghép mặc định quizId_userId.
  @@unique([quizId, userId], name: "uk_attempt_per_student")
  @@map("attempts")
}`,
  schemaCodeEn: `// The entire security of this project lives in the TWO lines with
// SHOUTED comments below. Everything else is CRUD.

model Question {
  id           Int    @id @default(autoincrement())
  quizId       Int
  text         String @db.Text
  options      Json                  // ["3", "4", "5"]
  // NEVER select this column out to the client. Props passed to a Client
  // Component are serialised and EMBEDDED IN THE HTML — Ctrl+U reveals them.
  // Use explicit select, never include.
  correctIndex Int
  order        Int
  quiz         Quiz   @relation(fields: [quizId], references: [id], onDelete: Cascade)

  @@index([quizId, order])
  @@map("questions")
}

model Attempt {
  id          Int       @id @default(autoincrement())
  quizId      Int
  userId      String
  // The server COMPUTES this from the key in the database. If the client
  // posts { score: 100 }, ignore it and recompute.
  score       Int
  answers     Json                   // enables attempt review
  // The time limit is enforced by comparing now() - startedAt on the server
  // at submit time. A React countdown is DECORATION.
  startedAt   DateTime  @default(now())
  submittedAt DateTime?

  quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // THIS ONE LINE replaces "findFirst then if then create" — and no retry
  // can get around it. Once named, queries must use THIS name, not the
  // default compound key quizId_userId.
  @@unique([quizId, userId], name: "uk_attempt_per_student")
  @@map("attempts")
}`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Bản đồ ba nơi chạy mã trong App Router',
      titleEn: 'Mapping the three places code runs in the App Router',
      description:
        'Server Component đọc dữ liệu để dựng trang; Server Action ghi dữ liệu do người dùng kích hoạt; Route Handler là endpoint HTTP thật cho webhook và client ngoài. Client Component chạy TRONG trình duyệt. Mũi tên từ Server Component sang Client Component là ranh giới rò rỉ — props được tuần tự hoá và nhúng thẳng vào HTML.',
      descriptionEn:
        'Server Components read data to render; Server Actions handle user-triggered writes; Route Handlers are real HTTP endpoints for webhooks and external clients. Client Components run IN the browser. The arrow from Server to Client Component is the leak boundary — props are serialised straight into the HTML.',
    },
    {
      phase: 'SECURITY',
      title: 'select tường minh thay vì include',
      titleEn: 'Explicit select instead of include',
      description:
        'include: { questions: true } kéo cả correctIndex xuống trình duyệt, và Ctrl+U là đọc được. Cách sửa không phải ẩn đi hay mã hoá mà là KHÔNG GỬI ĐI. Quan trọng hơn: select không bao giờ tự nới rộng, nên cột nhạy cảm ai đó thêm sáu tháng sau cũng không tự lộ ra.',
      descriptionEn:
        'include: { questions: true } drags correctIndex to the browser, where Ctrl+U reveals it. The fix is not hiding or encrypting but NOT SENDING IT. More importantly: a select never widens on its own, so a sensitive column added six months later does not leak automatically.',
      codeBlock:
        '// ✅ chọn tường minh — KHÔNG có correctIndex\n'
        + 'const quiz = await prisma.quiz.findUnique({\n'
        + '  where: { id },\n'
        + '  select: {\n'
        + '    id: true, title: true, timeLimitSec: true,\n'
        + '    questions: {\n'
        + '      select: { id: true, text: true, options: true },\n'
        + "      orderBy: { order: 'asc' },\n"
        + '    },\n'
        + '  },\n'
        + '});',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Chấm điểm trong Server Action, đáp án không rời máy chủ',
      titleEn: 'Grading inside a Server Action, key never leaves the server',
      description:
        'Client được phép gửi ĐÚNG MỘT thứ: các lựa chọn đã chọn. Điểm số, số câu đúng, thời gian còn lại và userId đều do máy chủ tự xác định. Nếu client gửi { score: 100 } thì bỏ qua và tính lại từ đáp án trong DB — đây là dạng cụ thể của "không bao giờ tin client".',
      descriptionEn:
        'The client may send EXACTLY ONE thing: the options it picked. Score, number correct, time remaining and userId are all determined by the server. If the client posts { score: 100 }, ignore it and recompute from the key in the database — the concrete form of "never trust the client".',
      codeBlock:
        "'use server';\n"
        + 'export async function submitAttempt(quizId: number, answers: Record<number, number>) {\n'
        + '  const session = await auth();\n'
        + "  if (!session) throw new Error('Unauthorized');\n"
        + '  const questions = await prisma.question.findMany({\n'
        + '    where: { quizId }, select: { id: true, correctIndex: true },\n'
        + '  });\n'
        + '  let score = 0;\n'
        + '  for (const q of questions)\n'
        + '    if (answers[q.id] === q.correctIndex) score++;   // so với DB\n'
        + '  // ...\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'SECURITY',
      title: 'Giới hạn thời gian thực thi ở máy chủ',
      titleEn: 'Enforcing the time limit on the server',
      description:
        'Đồng hồ đếm ngược trong React là trang trí: người dùng dừng JavaScript bằng debugger hoặc gọi thẳng Server Action ba tiếng sau. Cách đúng là ghi startedAt lúc bắt đầu, rồi lúc nộp máy chủ so now() - startedAt với timeLimitSec và tự quyết định bài đó còn hiệu lực không.',
      descriptionEn:
        'A React countdown is decoration: a user pauses JavaScript in the debugger or calls the Server Action three hours later. The correct design records startedAt at the start, then at submit time the server compares now() - startedAt against timeLimitSec and decides for itself.',
    },
    {
      phase: 'DATABASE',
      title: 'Đúng một lượt: @@unique thay cho câu if',
      titleEn: 'Exactly one attempt: @@unique instead of an if',
      description:
        'findFirst rồi create là đúng cuộc đua của bốn đồ án trước, chỉ đội lốt một quy tắc nghiệp vụ tầm thường. Bấm Nộp hai lần thật nhanh, hoặc chỉ cần mạng chậm khiến React gửi lại, là hai hàng Attempt và hai điểm số cho một bài. @@unique([quizId, userId]) đóng lại vĩnh viễn; bắt P2002 để trả lỗi tử tế.',
      descriptionEn:
        'findFirst then create is the same race as the previous four projects, disguised as a mundane rule. Double-click Submit, or just let a slow network make React retry, and you get two Attempt rows with two scores for one quiz. @@unique([quizId, userId]) closes it permanently; catch P2002 for a clean error.',
      codeBlock:
        'try {\n'
        + '  await prisma.attempt.create({ data: { quizId, userId, score: pct, answers } });\n'
        + '} catch (e) {\n'
        + "  if (e.code === 'P2002')  // vi phạm UNIQUE\n"
        + "    throw new AlreadySubmittedError('Bạn đã nộp bài này rồi');\n"
        + '  throw e;\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'SECURITY',
      title: 'Server Action LÀ endpoint công khai',
      titleEn: 'A Server Action IS a public endpoint',
      description:
        'Trông như một hàm nên rất dễ quên rằng Next.js đăng ký nó thành một route POST mà bất kỳ ai cũng gọi được bằng fetch. Ẩn nút trên giao diện không chặn được gì. Mọi Server Action phải tự kiểm phiên và vai trò ở dòng đầu tiên — cùng bài học "ẩn nút không phải phân quyền" của đồ án #1, chỉ khác hình dạng.',
      descriptionEn:
        'It looks like a function, which makes it easy to forget Next.js registers it as a POST route anyone can call with fetch. Hiding the button blocks nothing. Every Server Action must check session and role on its first line — the same "a hidden button is not authorisation" lesson as project #1, in a new shape.',
    },
    {
      phase: 'FRONTEND',
      title: 'Xem lại bài làm, và revalidatePath sau mỗi mutation',
      titleEn: 'Attempt review, and revalidatePath after every mutation',
      description:
        'Sau khi nộp, ĐÁP ÁN MỚI ĐƯỢC PHÉP hiện — cùng dữ liệu, khác thời điểm, khác quyền. answers lưu dạng JSON là đủ để dựng lại toàn bộ bài làm mà không cần bảng con. Và mỗi Server Action ghi dữ liệu phải gọi revalidatePath, nếu không trang vẫn hiện bản cache cũ và trông như mất dữ liệu.',
      descriptionEn:
        'After submission the key MAY finally be shown — same data, different moment, different permission. Storing answers as JSON is enough to replay the whole attempt without a child table. And every writing Server Action must call revalidatePath, otherwise the page keeps serving a stale cache and looks like data loss.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách tấn công chính mình',
      titleEn: 'Testing by attacking your own app',
      description:
        'Ba phép thử đáng giá hơn mọi unit test ở đồ án này: Ctrl+U rồi tìm correctIndex phải ra rỗng; chặn phản hồi rồi sửa score thành 100 phải không ảnh hưởng DB; gọi thẳng Server Action bằng fetch với answers bịa phải vẫn được chấm đúng. Đây là loại bằng chứng chụp ảnh được và đưa vào README.',
      descriptionEn:
        'Three checks worth more than any unit test here: Ctrl+U and search for correctIndex must return nothing; intercept the response and set score to 100 must not affect the database; call the Server Action directly with invented answers and grading must still be correct. This is the kind of evidence you can screenshot into a README.',
    },
  ],

  features: [
    { title: 'Giảng viên tạo khoá học, bài giảng, quiz', titleEn: 'Instructors create courses, lessons and quizzes', description: 'CRUD đầy đủ qua Server Action, có kiểm quyền sở hữu chứ không chỉ vai trò.', descriptionEn: 'Full CRUD through Server Actions, checking ownership rather than only role.', status: 'PLANNED' },
    { title: 'Học viên ghi danh và theo dõi tiến độ', titleEn: 'Students enrol and track progress', description: 'Danh sách khoá học, bài đã hoàn thành, quiz đã làm.', descriptionEn: 'Course list, completed lessons, attempted quizzes.', status: 'PLANNED' },
    { title: 'Đáp án không bao giờ rời máy chủ', titleEn: 'The answer key never leaves the server', description: 'select tường minh loại correctIndex; kiểm bằng cách tìm trong HTML nguồn.', descriptionEn: 'Explicit select drops correctIndex; verified by searching the page source.', status: 'PLANNED' },
    { title: 'Chấm điểm phía máy chủ', titleEn: 'Server-side grading', description: 'Máy chủ tính điểm từ đáp án trong DB, bỏ qua mọi con số client gửi lên.', descriptionEn: 'The server computes the score from the database key and ignores any client-supplied number.', status: 'PLANNED' },
    { title: 'Giới hạn thời gian do máy chủ thực thi', titleEn: 'Server-enforced time limits', description: 'So now() - startedAt lúc nộp; vô hiệu hoá đồng hồ React cũng không lách được.', descriptionEn: 'Comparing now() - startedAt at submit; disabling the React timer changes nothing.', status: 'PLANNED' },
    { title: 'Đúng một lượt làm mỗi học viên', titleEn: 'Exactly one attempt per student', description: '@@unique([quizId, userId]) + bắt P2002, chống cả trường hợp gửi lại do mạng.', descriptionEn: '@@unique([quizId, userId]) + catching P2002, covering network retries too.', status: 'PLANNED' },
    { title: 'Xem lại bài đã làm sau khi nộp', titleEn: 'Attempt review after submission', description: 'Hiện lựa chọn của học viên cạnh đáp án đúng — giờ mới được phép hiện.', descriptionEn: 'Shows the student\'s picks next to the correct answers — now that they may be shown.', status: 'PLANNED' },
    { title: 'Bảng điểm cho giảng viên', titleEn: 'Gradebook for instructors', description: 'Điểm theo lớp, tỉ lệ đạt, câu hỏi sai nhiều nhất.', descriptionEn: 'Scores per cohort, pass rate, most-missed questions.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT605 trên Academy — bản dạy từng bước', titleEn: 'INT605 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/e-learning-mini-platform', type: 'LINK', description: '9 mục, 21 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 21 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'Next.js — Server Actions and Mutations', titleEn: 'Next.js — Server Actions and Mutations', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations', type: 'DOC', description: 'Đọc kỹ mục Security: Server Action là endpoint công khai.', descriptionEn: 'Read the Security section carefully: a Server Action is a public endpoint.' },
    { title: 'Next.js — Server and Client Components', titleEn: 'Next.js — Server and Client Components', url: 'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns', type: 'DOC', description: 'Ranh giới props và những gì bị tuần tự hoá xuống trình duyệt.', descriptionEn: 'The props boundary and what gets serialised down to the browser.' },
    { title: 'Prisma — select vs include', titleEn: 'Prisma — select vs include', url: 'https://www.prisma.io/docs/orm/prisma-client/queries/select-fields', type: 'DOC', description: 'Vì sao select tường minh an toàn hơn khi schema còn thay đổi.', descriptionEn: 'Why explicit select stays safe as the schema keeps changing.' },
    { title: 'Auth.js — Role-based access control', titleEn: 'Auth.js — Role-based access control', url: 'https://authjs.dev/guides/role-based-access-control', type: 'LINK', description: 'Đưa vai trò vào token và đọc lại trong Server Action.', descriptionEn: 'Getting the role into the token and reading it back inside a Server Action.' },
    { title: 'OWASP — Broken Access Control', titleEn: 'OWASP — Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/', type: 'LINK', description: 'Ẩn nút không phải phân quyền — đọc trước khi viết Server Action đầu tiên.', descriptionEn: 'Hiding a button is not authorisation — read before writing your first Server Action.' },
  ],

  coreKnowledge: [
    { vi: 'Ranh giới máy chủ/trình duyệt trong App Router, và props là nơi rò rỉ', en: 'The server/browser boundary in the App Router, and props as the leak surface' },
    { vi: 'Ba nơi chạy mã: Server Component, Server Action, Route Handler — chọn cái nào khi nào', en: 'Three places code runs: Server Component, Server Action, Route Handler — and when to use each' },
    { vi: 'select tường minh so với include, và vì sao include tự nới rộng theo thời gian', en: 'Explicit select versus include, and why include widens over time' },
    { vi: 'Không bao giờ tin client: điểm số, thời gian, danh tính đều do máy chủ xác định', en: 'Never trust the client: score, time and identity are all server-determined' },
    { vi: 'Server Action là endpoint công khai — phải tự kiểm phiên và vai trò', en: 'A Server Action is a public endpoint — it must check session and role itself' },
    { vi: 'Ràng buộc UNIQUE làm cơ chế idempotent cho thao tác gửi lại', en: 'A UNIQUE constraint as the idempotency mechanism for retried submissions' },
    { vi: 'Đặt tên cho @@unique thì truy vấn phải dùng đúng tên đó', en: 'Naming a @@unique means queries must use that exact name' },
    { vi: 'Lưu JSON khi nào là đúng: dữ liệu đọc nguyên khối, không cần truy vấn theo trường', en: 'When JSON storage is right: data read as a whole, never queried field by field' },
    { vi: 'revalidatePath và vì sao thiếu nó trông giống mất dữ liệu', en: 'revalidatePath, and why forgetting it looks like data loss' },
    { vi: 'Cùng dữ liệu, khác thời điểm, khác quyền: đáp án chỉ được hiện sau khi nộp', en: 'Same data, different moment, different permission: the key may only appear after submission' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh chụp HTML nguồn kèm phép tìm correctIndex ra rỗng, đặt trong README', en: 'A page-source screenshot with an empty search for correctIndex, in the README' },
    { vi: 'Một mục "Threat model" liệt kê ba cách gian lận và cách hệ thống chặn từng cách', en: 'A "Threat model" section listing three cheating routes and how each is blocked' },
    { vi: 'Ngân hàng câu hỏi xáo thứ tự câu và thứ tự lựa chọn theo từng lượt', en: 'A question bank shuffling both question and option order per attempt' },
    { vi: 'Thống kê câu hỏi: độ khó thực tế và câu nào cả lớp sai nhiều nhất', en: 'Question analytics: real difficulty and the most-missed question' },
    { vi: 'Playwright test tự động thử tấn công: sửa score, nộp lại, nộp quá giờ', en: 'Playwright tests that automate the attacks: tamper the score, resubmit, submit late' },
    { vi: 'Xuất bảng điểm ra CSV cho giảng viên', en: 'CSV gradebook export for instructors' },
  ],

  completionOutcomes: [
    { vi: 'Nói được chính xác dữ liệu nào chạy ở máy chủ và dữ liệu nào tới trình duyệt', en: 'State precisely which data stays on the server and which reaches the browser' },
    { vi: 'Thiết kế tính năng mà không thể gian lận được từ phía client', en: 'Design a feature that cannot be cheated from the client side' },
    { vi: 'Dùng ràng buộc cơ sở dữ liệu làm cơ chế idempotent thay vì câu if', en: 'Use a database constraint as an idempotency mechanism instead of an if' },
    { vi: 'Xây full-stack trong một app Next.js mà không nhầm ranh giới', en: 'Build a full stack in one Next.js app without blurring the boundary' },
    { vi: 'Tự tấn công ứng dụng của mình và chụp lại bằng chứng nó chịu được', en: 'Attack your own app and capture the evidence that it held' },
  ],

  bodyMdx,
  bodyMdxEn,
};
