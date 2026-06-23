import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { renderProjectMarkdown } from '../src/services/projectMarkdown.service.js';

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
  const adminPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'cuongthaihnhe176322@gmail.com',
      fullName: 'Cuong Hoang Dev',
      password: adminPassword,
      roles: {
        create: [{ roleId: roleAdmin.id }],
      },
    },
  });

  console.log('✅ Admin user created:', admin.email);

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
 bodyHtml = renderProjectMarkdown(bodyMdx);
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

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
