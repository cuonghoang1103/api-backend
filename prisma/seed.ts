import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { renderProjectMarkdown } from '../src/services/projectMarkdown.service.js';
import { seedGames } from './seed.games.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Create default roles ───────────────────────────
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ROLE_ADMIN' },
    update: {},
    create: { name: 'ROLE_ADMIN' },
  });

  const roleUser = await prisma.role.upsert({
    where: { name: 'ROLE_USER' },
    update: {},
    create: { name: 'ROLE_USER' },
  });

  console.log('✅ Roles created');

  // ─── Create admin user ─────────────────────────────
  // Idempotent + collision-safe. An admin account may already
  // exist under a *different* username (the real `Cuong03dx`
  // account is seeded separately by seed-cuong03dx.cjs) but with
  // this same email. Upserting by `username: 'admin'` would miss
  // that row, fall through to create, and hit a P2002 unique
  // violation on `email` — which aborts the whole seed before the
  // project / content-creator / idea seeds below ever run. So we
  // look the user up by its unique email first and only create one
  // when none exists.
  const adminEmail = 'cuongthaihnhe176322@gmail.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const adminPassword = await bcrypt.hash('admin123', 12);
    admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        fullName: 'Cuong Hoang Dev',
        password: adminPassword,
        roles: {
          create: [{ roleId: roleAdmin.id }],
        },
      },
    });
  }

  console.log('✅ Admin user ready:', admin.email);

  // ─── Seed AI Config ────────────────────────────────
  const aiConfigs = [
    { configKey: 'embedding_model', configValue: 'gemini-embedding-002', description: 'Embedding model' },
    { configKey: 'chat_model', configValue: 'gemini-2.0-flash-lite', description: 'Chat model' },
    { configKey: 'max_tokens', configValue: '2048', description: 'Max tokens per response' },
    { configKey: 'temperature', configValue: '0.7', description: 'AI temperature (0-1)' },
    { configKey: 'chunk_size', configValue: '1000', description: 'Document chunk size' },
    { configKey: 'chunk_overlap', configValue: '200', description: 'Chunk overlap' },
    { configKey: 'similarity_threshold', configValue: '0.7', description: 'Min similarity threshold' },
  ];

  for (const config of aiConfigs) {
    await prisma.aiConfig.upsert({
      where: { configKey: config.configKey },
      update: {},
      create: config,
    });
  }
  console.log('✅ AI configs seeded');

  // ─── Seed AI Prompts ────────────────────────────────
  const aiPrompts = [
    {
      promptKey: 'system_default',
      promptTemplate: 'Bạn là trợ lý AI thông minh của CuongHoangDev Portfolio. Hãy trả lời bằng tiếng Việt, thân thiện và chính xác.',
      description: 'System prompt mặc định',
    },
    {
      promptKey: 'greeting',
      promptTemplate: 'Xin chào! Tôi là trợ lý AI của CuongHoangDev. Tôi có thể giúp gì cho bạn hôm nay?',
      description: 'Lời chào khi bắt đầu chat',
    },
    {
      promptKey: 'fallback',
      promptTemplate: 'Xin lỗi, tôi không có đủ thông tin để trả lời câu hỏi này. Bạn có thể hỏi tôi về portfolio, kỹ năng, dự án, hoặc các khóa học của CuongHoangDev nhé!',
      description: 'Tin nhắn khi không tìm thấy thông tin',
    },
  ];

  for (const prompt of aiPrompts) {
    await prisma.aiPrompt.upsert({
      where: { promptKey: prompt.promptKey },
      update: {},
      create: prompt,
    });
  }
  console.log('✅ AI prompts seeded');

  // ─── Seed Discount Codes ───────────────────────────
  const discountCodes = [
    { code: 'WELCOME10', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 0, description: 'Welcome 10% off' },
    { code: 'SUMMER50', discountType: 'PERCENT', discountValue: 50, minOrderAmount: 200000, maxDiscountAmount: 100000, maxUses: 100, description: 'Summer sale 50% off' },
    { code: 'VIP20', discountType: 'PERCENT', discountValue: 20, minOrderAmount: 100000, maxDiscountAmount: 50000, description: 'VIP 20% off' },
    { code: 'FREESHIP', discountType: 'FIXED', discountValue: 30000, minOrderAmount: 100000, maxUses: 200, description: 'Free shipping' },
    { code: 'LAUNCH50K', discountType: 'FIXED', discountValue: 50000, minOrderAmount: 150000, maxUses: 50, description: 'Launch special 50k off' },
  ];

  for (const code of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: code.code },
      update: {},
      create: code,
    });
  }
  console.log('✅ Discount codes seeded');

  console.log('🌱 Seed complete!');

 // ─── Seed sample case-study project ──────────────────
 // Idempotent upsert keyed on slug. We re-render bodyHtml
 // every run so the cache always reflects bodyMdx.
 await seedCaseStudyProject();

 // ─── Seed Content Creator demo project (Phase 1) ────
 // Wipes + recreates the demo project so the upcoming
 // editor UI always has a non-trivial dataset.
 await seedContentCreator();

 // ─── Seed Content Idea Bank (Phase 5) ─────────────
 // Idempotent: re-uses any matching title so re-runs
 // don't duplicate ideas. Used to populate the
 // /creator/ideas page on a fresh install.
 await seedContentIdeas();

 // ─── Seed Game Library (Playground) ────────────────
 // Categories + the initial catalogue, migrated from the old
 // static GAMES_DATA. Create-if-missing only, so admin edits
 // in /admin/games survive every re-deploy.
 await seedGames(prisma);
}

async function seedCaseStudyProject() {
 const slug = 'cuonghoang-dev-portal';

 const bodyMdx = `# cuonghoang.com — Portfolio + CMS

Trang portfolio cá nhân được tái cấu trúc năm 2026 thành một **build-log đầy đủ**, hỗ trợ viết case study dài hạn với markdown, code highlight, callouts, timeline và tài nguyên đính kèm.

## Vấn đề

Trang portfolio cũ chỉ có **2 trường** \`description\` + \`content\`, render markdown qua regex tự viết. Khi viết case study dài (>5 phút đọc), hệ thống cũ:

- Không có mục lục — độc giả lạc trong bài viết.
- Không hỗ trợ code block highlight — chỉ escape HTML.
- Không có callout (tip/warning/danger) — không thể nhấn mạnh điểm quan trọng.
- Không có timeline / features / resources — mỗi dự án phải viết thủ công bằng emoji.

## Giải pháp

Thiết kế lại schema với 3 model mới:

\`\`\`prisma
model Project {
 // ...legacy fields...
 bodyMdx String? @db.Text
 bodyHtml String? @db.Text
 viewCount Int @default(0)
 likeCount Int @default(0)
 isPublished Boolean @default(true)

 milestones ProjectMilestone[]
 features ProjectFeature[]
 resources ProjectResource[]
 likes ProjectLike[]
}

model ProjectMilestone {
 id Int @id @default(autoincrement())
 projectId Int
 phase String
 title String
 description String?
 date DateTime?
 imageUrl String?
 order Int @default(0)
}
\`\`\`

Render pipeline chạy trên server:

> :::tip[Lý do render server-side]
> Backend cache \`bodyHtml\` để frontend không phải ship 500KB unified pipeline xuống browser. Lần đầu tiên truy cập, route \`GET /projects/:slug\` lazy-backfill cache nếu rỗng.
> :::

## Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| Markdown + directives | Hỗ trợ GFM, code highlight, 4 callout variants |
| TOC | Tự sinh từ headings, click anchor mượt |
| Reading progress | Thanh tiến trình trên đầu trang, đo theo content wrapper |
| Timeline | Milestone với icon theo phase, gradient line |
| Features checklist | 3 trạng thái: DONE / IN_PROGRESS / PLANNED |
| Resources | PDF / DOC / REPO / LINK với icon và file size |
| Like ẩn danh | IP HMAC-SHA256 dedup, idempotent |

## Cảnh báo

:::warning[Thận trọng khi sanitize]
\`rehype-sanitize\` strip mọi tag nguy hiểm nhưng cũng strip \`id\` trên heading. Phải inject lại id *sau khi* sanitize để TOC có anchor hoạt động.
:::

:::danger[Không trust client gửi bodyHtml]
Client **không bao giờ** được phép gửi \`bodyHtml\` lên server. Render chỉ chạy server-side từ \`bodyMdx\`. Nếu nhận bodyHtml từ client thì drop ngay.
:::

## Đường học

\`\`\`bash
# Clone
git clone https://github.com/cuonghoang/cuonghoang-dev-portal

# Setup
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed

# Run
npm run dev
\`\`\`

## Kết quả

- **Build log** đầy đủ cho mỗi dự án lớn.
- **Tìm kiếm full-text** trên bodyMdx (planned).
- **PDF export** cho CV-style download (planned).
`;

 const project = await prisma.project.upsert({
 where: { slug },
 update: {
 bodyMdx,
 // bodyHtml is re-rendered below
 },
 create: {
 title: 'cuonghoang.com — Portfolio + Build Log',
 slug,
 description: 'Trang portfolio cá nhân với hệ thống case study / build log đầy đủ: markdown, TOC, code highlight, callouts, timeline, features, resources.',
 content: null,
 thumbnailUrl: null,
 images: JSON.stringify([]),
 projectUrl: 'https://cuonghoang.com',
 videoUrl: null,
 githubUrl: 'https://github.com/cuonghoang/cuonghoang-dev-portal',
 techStack: 'Next.js, TypeScript, Express, Prisma, PostgreSQL, Cloudflare R2',
 role: 'Full-stack Developer',
 duration: '2 tháng',
 status: 'IN_PROGRESS',
 isFeatured: true,
 startDate: new Date('2026-04-01'),
 endDate: null,
 category: 'Web',
 difficulty: 'ADVANCED',
 bodyMdx,
 schemaCode: `model Project {
 id Int @id @default(autoincrement())
 title String @db.VarChar(255)
 slug String @unique @db.VarChar(255)
 description String? @db.Text
 content String? @db.Text
 thumbnailUrl String? @map("thumbnail_url")
 images String? @db.Text
 projectUrl String? @map("project_url")
 videoUrl String? @map("video_url")
 githubUrl String? @map("github_url")
 techStack String? @map("tech_stack")
 role String? @db.VarChar(100)
 duration String? @db.VarChar(100)
 status String @default("COMPLETED")
 isFeatured Boolean @default(false)
 startDate DateTime?
 endDate DateTime?
 category String?
 difficulty String?
 bodyMdx String? @map("body_mdx")
 bodyHtml String? @map("body_html")
 schemaCode String? @map("schema_code")
 schemaLang String? @map("schema_lang")
 viewCount Int @default(0)
 likeCount Int @default(0)
 isPublished Boolean @default(true)
 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}`,
 schemaLang: 'prisma',
 viewCount: 0,
 likeCount: 0,
 isPublished: true,
 },
 });

 // Render + persist bodyHtml so the public detail page
 // doesn't have to lazy-backfill on first read.
 let bodyHtml: string | null = null;
 try {
 bodyHtml = await renderProjectMarkdown(bodyMdx);
 } catch (err) {
 console.error('[seed] renderProjectMarkdown failed:', err);
 }
 if (bodyHtml) {
 await prisma.project.update({
 where: { id: project.id },
 data: { bodyHtml },
 });
 }

 // ─── Milestones ────────────────────────────────────
 await prisma.projectMilestone.deleteMany({ where: { projectId: project.id } });
 await prisma.projectMilestone.createMany({
 data: [
 {
 projectId: project.id,
 phase: 'IDEATION',
 title: 'Phát hiện vấn đề',
 description: 'Trang portfolio cũ chỉ có 2 trường, không hỗ trợ case study dài. Regex markdown tự viết bắt đầu lộ bug khi nội dung >5 phút đọc.',
 date: new Date('2026-04-05'),
 order: 0,
 },
 {
 projectId: project.id,
 phase: 'DESIGN',
 title: 'Thiết kế schema Phase 2',
 description: 'Thêm 9 field mới vào Project (bodyMdx, bodyHtml, schemaCode, schemaLang, viewCount, likeCount, isPublished, category, difficulty) + 3 model con (Milestone, Feature, Resource) + 1 model Like. Migration additive — không DROP column nào.',
 date: new Date('2026-04-15'),
 order: 1,
 // Demo of the new milestone.codeBlock / codeLang fields —
 // picked SQL because the schema diff above is naturally
 // SQL-shaped (ALTER TABLE … ADD COLUMN). The public page
 // renders it with highlight.js via CodeBlock.
 codeBlock: 'ALTER TABLE "projects" ADD COLUMN "body_mdx" TEXT;\nALTER TABLE "projects" ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT true;',
 codeLang: 'sql',
 },
 {
 projectId: project.id,
 phase: 'BACKEND',
 title: 'Markdown service + 13 admin routes',
 description: 'unified pipeline (remark-parse → gfm → rehype-raw → highlight → sanitize → stringify), callout preprocessor cho 4 variant, lazy bodyHtml backfill, IP HMAC-SHA256 cho like, fire-and-forget viewCount++.',
 date: new Date('2026-05-10'),
 order: 2,
 },
 {
 projectId: project.id,
 phase: 'FRONTEND',
 title: 'Trang /projects/[slug] + 8 components',
 description: 'MarkdownRenderer, CodeBlock (lazy hljs), TableOfContents (sticky + mobile drawer), ReadingProgressBar (rAF), MilestoneTimeline, FeatureChecklist, ResourcesList, ProjectLikeButton (optimistic).',
 date: new Date('2026-05-25'),
 order: 3,
 },
 {
 projectId: project.id,
 phase: 'POLISH',
 title: 'Admin editor split-pane + autosave',
 description: 'MarkdownEditor với toolbar, live preview, R2 image upload, autosave debounce 2s với isPublished=false. Drag-reorder milestones/features/resources bằng @dnd-kit.',
 date: new Date('2026-06-15'),
 order: 4,
 },
 ],
 });

 // ─── List items (3 sections share the same table) ──
 // Re-create the rows from scratch so the seed is
 // idempotent: deleting by (projectId, kind) clears any
 // stale rows left over from a previous seed.
 await prisma.projectListItem.deleteMany({ where: { projectId: project.id } });
 await prisma.projectListItem.createMany({
 data: [
 // Core Knowledge
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'React Server Components (RSC) vs Client Components', order: 0 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'Next.js App Router routing conventions', order: 1 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'Prisma ORM (migrations, queries, relations)', order: 2 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'NextAuth.js v5 flow (JWT, sessions)', order: 3 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'bcrypt password hashing', order: 4 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'Zod validation', order: 5 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'TailwindCSS utility classes', order: 6 },
 { projectId: project.id, kind: 'CORE_KNOWLEDGE', content: 'TypeScript strict mode', order: 7 },
 // Portfolio Bonus
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'Live demo trên Vercel', order: 0 },
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'GitHub Actions CI/CD', order: 1 },
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'README với screenshots + GIF demo', order: 2 },
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'Unit tests với Vitest', order: 3 },
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'E2E tests với Playwright', order: 4 },
 { projectId: project.id, kind: 'PORTFOLIO_BONUS', content: 'Storybook cho components', order: 5 },
 // Completion Outcomes
 { projectId: project.id, kind: 'COMPLETION_OUTCOME', content: 'Full CRUD với Next.js', order: 0 },
 { projectId: project.id, kind: 'COMPLETION_OUTCOME', content: 'Authentication flow', order: 1 },
 { projectId: project.id, kind: 'COMPLETION_OUTCOME', content: 'Basic database design', order: 2 },
 { projectId: project.id, kind: 'COMPLETION_OUTCOME', content: 'TypeScript end-to-end', order: 3 },
 { projectId: project.id, kind: 'COMPLETION_OUTCOME', content: 'Production deployment', order: 4 },
 ],
 });

 // ─── Features ──────────────────────────────────────
 await prisma.projectFeature.deleteMany({ where: { projectId: project.id } });
 await prisma.projectFeature.createMany({
 data: [
 { projectId: project.id, title: 'Markdown + GFM', description: 'Tables, strikethrough, task lists, autolinks.', status: 'DONE', order: 0 },
 { projectId: project.id, title: '4 callout variants', description: 'tip / note / warning / danger với emoji icon.', status: 'DONE', order: 1 },
 { projectId: project.id, title: 'Code highlight (hljs)', description: 'Lazy-load 16+ ngôn ngữ, fallback plaintext.', status: 'DONE', order: 2 },
 { projectId: project.id, title: 'TOC với scroll-spy', description: 'IntersectionObserver, Vietnamese slugifier.', status: 'DONE', order: 3 },
 { projectId: project.id, title: 'Reading progress bar', description: 'rAF-throttled, đo content wrapper.', status: 'DONE', order: 4 },
 { projectId: project.id, title: 'Like ẩn danh', description: 'IP HMAC-SHA256 dedup, optimistic UI.', status: 'DONE', order: 5 },
 { projectId: project.id, title: 'Full-text search', description: 'Postgres to_tsvector GIN index trên bodyMdx.', status: 'PLANNED', order: 6 },
 { projectId: project.id, title: 'PDF export', description: 'jsPDF cho CV-style download.', status: 'PLANNED', order: 7 },
 ],
 });

 // ─── Resources ─────────────────────────────────────
 await prisma.projectResource.deleteMany({ where: { projectId: project.id } });
 await prisma.projectResource.createMany({
 data: [
 {
 projectId: project.id,
 title: 'Source code (GitHub)',
 url: 'https://github.com/cuonghoang/cuonghoang-dev-portal',
 type: 'REPO',
 description: 'Full monorepo: Next.js frontend + Express/Prisma backend.',
 order: 0,
 },
 {
 projectId: project.id,
 title: 'Database schema docs',
 url: 'https://cuonghoang.com/admin/projects/1',
 type: 'LINK',
 description: 'Xem schema tương tác trong admin panel.',
 order: 1,
 },
 {
 projectId: project.id,
 title: 'unified pipeline docs',
 url: 'https://unifiedjs.com/',
 type: 'LINK',
 description: 'Tài liệu tham khảo về unified, remark, rehype.',
 order: 2,
 },
 ],
 });

 console.log(`✅ Seeded case study project "${slug}" with ${5} milestones, ${8} features, ${3} resources, ${19} list items`);
}

// ============================================================
// Phase 1: Content Creator seed
// ------------------------------------------------------------
// Idempotent upsert keyed on `slug`. Deletes-then-recreates
// child lists (days, scenes, products, posts, checklist) so
// any drift between code and DB self-heals on re-run.
//
// The demo project covers every Status enum and every Scene
// Type at least once, so the editor UI has a non-trivial
// dataset to render in the upcoming Phase 4 view.
// ============================================================
async function seedContentCreator() {
 const slug = 'vlog-hau-truong-ai';

 // If a previous seed ran with a different shape, wipe the
 // project and recreate from scratch. Safe because this seed
 // only ever owns a single demo project.
 const existing = await prisma.contentProject.findUnique({ where: { slug } });
 if (existing) {
 await prisma.contentProject.delete({ where: { id: existing.id } });
 }

 const project = await prisma.contentProject.create({
 data: {
 slug,
 title: 'Vlog hậu trường AI: tôi build production tool 30 ngày',
 type: 'VLOG',
 status: 'SCRIPTING',
 ideaDate: new Date('2026-06-20'),
 filmDate: new Date('2026-07-05'),
 publishDate: new Date('2026-07-12'),
 concept:
 '30 ngày, 1 production tool, 0 framework AI hype. Tôi sẽ ghi lại từng commit, từng bug, từng decision trong quá trình build Content Creator cho portfolio của mình.',
 mainHook:
 'Tôi đã build production tool trong 30 ngày — đây là 5 bài học đắt giá nhất',
 tags: ['vlog', 'ai', 'build-in-public', 'productivity'],
 referenceLinks: [
 { label: 'Building in Public — Marc Lou', url: 'https://marclou.com' },
 { label: 'Notion Calendar', url: 'https://notion.so/calendar' },
 ],
 days: {
 create: [
 {
 dayNumber: 1,
 date: new Date('2026-07-05'),
 location: 'Home studio',
 notes: 'Day 1: Intro + kể chuyện + show dashboard trước/sau',
 order: 0,
 scenes: {
 create: [
 {
 sceneNumber: 1,
 sceneType: 'HOOK',
 shotType: 'CLOSEUP',
 voiceover:
 'Tôi bắt đầu 30 ngày trước, và tôi gần như bỏ cuộc ở ngày thứ 8.',
 durationSeconds: 8,
 order: 0,
 },
 {
 sceneNumber: 2,
 sceneType: 'INTRO',
 shotType: 'MEDIUM',
 voiceover:
 'Đây là Content Creator — production tool cá nhân tôi build để quản lý tất cả video tôi đăng lên TikTok, YouTube, Facebook và Instagram.',
 durationSeconds: 12,
 order: 1,
 },
 {
 sceneNumber: 3,
 sceneType: 'BROLL',
 shotType: 'OVERHEAD',
 action: 'Screen recording dashboard với cursor di chuyển giữa các tab',
 durationSeconds: 6,
 order: 2,
 },
 ],
 },
 },
 {
 dayNumber: 2,
 date: new Date('2026-07-08'),
 location: 'Quán cafe',
 notes: 'Day 2: Bài học + interview mini với 2 dev khác',
 order: 1,
 scenes: {
 create: [
 {
 sceneNumber: 1,
 sceneType: 'HOOK',
 shotType: 'WIDE',
 voiceover:
 'Bài học #3: Đừng build dashboard trước khi biết daily workflow thật của bạn.',
 durationSeconds: 10,
 order: 0,
 },
 {
 sceneNumber: 2,
 sceneType: 'OUTRO',
 shotType: 'MEDIUM',
 voiceover:
 'Nếu bạn thích series này, subcribe để tuần sau có phần 2 — debug session thật.',
 durationSeconds: 7,
 order: 1,
 },
 ],
 },
 },
 ],
 },
 affiliateProducts: {
 create: [
 {
 name: 'Saramonic Vmic Mini',
 url: 'https://example.com/vmic',
 discountCode: 'CUONG10',
 commissionPercent: 8,
 revenue: 0,
 notes: 'Mic gắn máy ảnh giá rẻ, dùng cho Day 2 ngoài trời',
 order: 0,
 },
 ],
 },
 platformPosts: {
 create: [
 {
 platform: 'TIKTOK',
 caption:
 '30 ngày, 1 production tool, 0 AI hype. Đây là 5 bài học đắt giá nhất 🧵',
 hashtags: ['buildinpublic', 'productivity', 'vlog', 'ai'],
 scheduledTime: new Date('2026-07-10T18:00:00Z'),
 isPublished: false,
 order: 0,
 },
 {
 platform: 'YOUTUBE',
 caption:
 'Vlog hậu trường AI — 30 ngày build Content Creator (full breakdown)',
 hashtags: ['vlog', 'buildinpublic', 'productivity', 'ai', 'tutorial'],
 scheduledTime: new Date('2026-07-12T17:00:00Z'),
 isPublished: false,
 order: 1,
 },
 ],
 },
 checklistItems: {
 create: [
 { phase: 'PRE', label: 'Outline 5 bài học + script hook 15s', done: true, order: 0 },
 { phase: 'PRE', label: 'Thuê mic backup (SM7B)', done: false, order: 1 },
 { phase: 'PRODUCTION', label: 'Quay Day 1 (3 scenes)', done: false, order: 0 },
 { phase: 'PRODUCTION', label: 'Quay Day 2 (2 scenes + 2 interview)', done: false, order: 1 },
 { phase: 'POST', label: 'Edit Day 1 cắt thô', done: false, order: 0 },
 { phase: 'POST', label: 'Color grade + add subtitles', done: false, order: 1 },
 { phase: 'PUBLISH', label: 'Upload TikTok (vertical 9:16)', done: false, order: 0 },
 { phase: 'PUBLISH', label: 'Upload YouTube (16:9 long-form)', done: false, order: 1 },
 ],
 },
 performance: {
 create: {
 views: 0,
 likes: 0,
 comments: 0,
 shares: 0,
 platformMetrics: {},
 },
 },
 },
 include: {
 days: { include: { scenes: true } },
 affiliateProducts: true,
 platformPosts: true,
 checklistItems: true,
 performance: true,
 },
 });

 const dayCount = project.days.length;
 const sceneCount = project.days.reduce((sum, d) => sum + d.scenes.length, 0);
 const productCount = project.affiliateProducts.length;
 const postCount = project.platformPosts.length;
 const checklistCount = project.checklistItems.length;
 const hasPerformance = Boolean(project.performance);

 console.log(
 `✅ Seeded content project "${slug}" with ${dayCount} days, ${sceneCount} scenes, ${productCount} products, ${postCount} posts, ${checklistCount} checklist items, performance=${hasPerformance}`,
 );
}

// ─── Phase 5: Idea Bank seed ────────────────────────
// A handful of demo ideas so the /creator/ideas page has
// something to show on a fresh install. Idempotent via
// upsert-by-title.
async function seedContentIdeas() {
 // Each idea is { title, hook, notes, score, suggestedType, status, tags }.
 // The first one ("Build a 30-day public journal of building an AI studio")
 // is the "promoted" example — we point it at the demo ContentProject
 // we just seeded.
 const demoProject = await prisma.contentProject.findFirst({
 where: { slug: 'vlog-hau-truong-ai' },
 select: { id: true },
 });

 const ideas: Array<{
 title: string;
 hook: string | null;
 notes: string | null;
 score: number | null;
 suggestedType: 'VLOG' | 'AFFILIATE' | 'CODE' | 'REVIEW' | 'IDEA' | 'OTHER' | null;
 status: 'CAPTURED' | 'REFINED' | 'PROMOTED' | 'ARCHIVED';
 tags: string[];
 promotedToProjectId?: number;
 promotedAt?: Date;
 }> = [
 {
 title: 'Build a 30-day public journal of building an AI studio',
 hook: 'Một tháng public nhật ký build Content Studio: lý do, quyết định, thất bại.',
 notes:
 'Doc-style. Mỗi ngày một clip ngắn 60-90s. Audience: indie creators. CTA: subscribe để theo dõi 30 ngày.',
 score: 5,
 suggestedType: 'VLOG',
 status: 'PROMOTED',
 tags: ['series', 'behind-the-scenes', 'ai'],
 promotedToProjectId: demoProject?.id,
 promotedAt: new Date(),
 },
 {
  title: 'Top 5 mẫu Cloud Resume gây ấn tượng với HR (2026 edition)',
 hook: 'Đi qua 5 portfolio thật — chỉ ra điểm khiến HR nhấn "mời phỏng vấn".',
 notes:
 'Affiliate-friendly: có thể chèn link tới template cá nhân. Cần B-roll chụp màn hình, 2-3 case study.',
 score: 4,
 suggestedType: 'AFFILIATE',
 status: 'REFINED',
 tags: ['portfolio', 'career', 'review'],
 },
 {
 title: 'Code review: 3 open-source "AI wrapper" đáng học nhất tuần này',
 hook: 'Pick 3 repos trending trên GitHub, đi qua 1 file then chốt mỗi cái.',
 notes: 'Series idea. Mỗi tập 5-7 phút. Có thể bắt đầu bằng Perplexity-style wrappers.',
 score: 4,
 suggestedType: 'CODE',
 status: 'CAPTURED',
 tags: ['code-review', 'open-source', 'ai'],
 },
 {
 title: 'Một ngày của mình: 5:00 AM → midnight, 5 quyết định đã đổi cả năm',
 hook: 'Story-time format, pacing chậm, voiceover + B-roll đời thường.',
 notes: 'Hook mạnh, ít text. Kết bằng CTA "bạn thì sao?".',
 score: 3,
 suggestedType: 'VLOG',
 status: 'CAPTURED',
 tags: ['lifestyle', 'story-time'],
 },
 {
 title: 'Review Logitech MX Master 4 sau 6 tháng dùng thật',
 hook: 'Không phải unbox — đây là sau 6 tháng dùng cho code + design.',
 notes: 'Pros/cons thật. Affiliate link authorized qua Amazon Associates.',
 score: 3,
 suggestedType: 'REVIEW',
 status: 'CAPTURED',
 tags: ['gear', 'review', 'long-term'],
 },
 {
 title: '"Tôi đã build một SaaS bằng Cursor mà không code" — honest take',
 hook: 'Nói thẳng: cái gì hoạt động, cái gì không, cái gì tôi phải code lại.',
 notes: 'Format: 3 phần (works / does not / lessons). Cần screen record thật.',
 score: 4,
 suggestedType: 'IDEA',
 status: 'CAPTURED',
 tags: ['cursor', 'saas', 'no-code', 'honest'],
 },
 ];

 let created = 0;
 let reused = 0;
 for (const idea of ideas) {
 // Upsert by title. We re-write all fields so the seed
 // is always self-correcting (e.g. if you change the
 // suggestedType in the seed file, re-running will
 // update the DB to match).
 const existing = await prisma.contentIdea.findFirst({
 where: { title: idea.title },
 select: { id: true },
 });
 if (existing) {
 await prisma.contentIdea.update({
 where: { id: existing.id },
 data: {
 hook: idea.hook,
 notes: idea.notes,
 score: idea.score,
 suggestedType: idea.suggestedType,
 status: idea.status,
 tags: idea.tags,
 promotedToProjectId: idea.promotedToProjectId ?? null,
 promotedAt: idea.promotedAt ?? null,
 },
 });
 reused++;
 } else {
 await prisma.contentIdea.create({ data: idea });
 created++;
 }
 }

 console.log(
 `💡 Seeded content ideas: ${created} created, ${reused} updated (total ${ideas.length})`,
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
