/**
 * exp-hub-seed-taxonomy.mjs — dựng sẵn "khung xương" danh mục cho EXP_Hub.
 * ─────────────────────────────────────────────────────────────────────────────
 * Tạo cây danh mục 2 tầng chuyên nghiệp: nhóm lớn (Backend / Frontend /
 * Database / DevOps / Linux / Mobile / Tools / AI) → công nghệ con
 * (Node.js, Java, PostgreSQL, MongoDB, Ubuntu, Terminal, …), kèm icon (Lucide),
 * màu accent, mô tả ngắn tiếng Việt, và link tài liệu chính thức (docsUrl).
 *
 * IDEMPOTENT — khớp theo `slug`:
 *   • Danh mục CHƯA có  → tạo mới (parentId + sortOrder + metadata).
 *   • Danh mục ĐÃ có    → BỎ QUA (không đụng, giữ nguyên chỉnh sửa của bạn),
 *                          trừ khi chạy với --update-meta.
 *
 * Chạy được nhiều lần an toàn. Bạn tự thêm/sửa/xoá trong /admin/exp-hub sau.
 *
 *   # xem trước, KHÔNG ghi (mặc định):
 *   node scripts/exp-hub-seed-taxonomy.mjs
 *   # ghi thật:
 *   node scripts/exp-hub-seed-taxonomy.mjs --apply
 *   # ghi thật + cập nhật icon/màu/mô tả/docs cho cả danh mục đã tồn tại:
 *   node scripts/exp-hub-seed-taxonomy.mjs --apply --update-meta
 *
 * Trên VPS chạy trong container (DATABASE_URL có sẵn trong env container):
 *   docker exec cuonghoangdev_backend node scripts/exp-hub-seed-taxonomy.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const UPDATE_META = args.includes('--update-meta');

// slugify — PHẢI khớp hệt slugify() trong src/services/snippets.service.ts
// để slug seed trùng với slug do admin UI sinh ra.
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Cây taxonomy đề xuất (bạn sửa thoải mái sau) ───────────────────────────
// Mỗi node: { name, description?, icon?, color?, docsUrl?, children? }
// icon = tên icon Lucide (frontend map ra component). color = hex accent.
const TREE = [
  {
    name: 'Backend', icon: 'Server', color: '#10b981',
    description: 'Máy chủ, API, xử lý nghiệp vụ và dữ liệu phía sau.',
    children: [
      { name: 'Node.js', color: '#339933', docsUrl: 'https://nodejs.org/en/docs', description: 'Runtime JavaScript phía server.' },
      { name: 'Express', color: '#259dff', docsUrl: 'https://expressjs.com/' },
      { name: 'NestJS', color: '#e0234e', docsUrl: 'https://docs.nestjs.com/' },
      { name: 'Java Core', color: '#ed8b00', docsUrl: 'https://docs.oracle.com/en/java/', description: 'Nền tảng ngôn ngữ Java: OOP, Collections, đa luồng.' },
      { name: 'Spring Boot', color: '#6db33f', docsUrl: 'https://docs.spring.io/spring-boot/', description: 'Framework Java xây REST API nhanh, cấu hình tối thiểu.' },
      { name: 'Python (Backend)', color: '#3776ab', docsUrl: 'https://docs.python.org/3/' },
      { name: 'Django / FastAPI', color: '#092e20', docsUrl: 'https://fastapi.tiangolo.com/' },
      { name: 'PHP / Laravel', color: '#777bb4', docsUrl: 'https://laravel.com/docs' },
      { name: 'Go', color: '#00add8', docsUrl: 'https://go.dev/doc/' },
      { name: '.NET / C#', color: '#512bd4', docsUrl: 'https://learn.microsoft.com/dotnet/' },
      { name: 'REST API Design', color: '#10b981', description: 'Quy ước tài nguyên, status code, versioning, phân trang.' },
      { name: 'GraphQL', color: '#e10098', docsUrl: 'https://graphql.org/learn/' },
      { name: 'Auth & JWT', color: '#f97316', description: 'Xác thực, phân quyền, JWT, OAuth, refresh token.' },
      { name: 'WebSocket / Socket.IO', color: '#010101', docsUrl: 'https://socket.io/docs/' },
      { name: 'Message Queue (Redis/RabbitMQ/Kafka)', color: '#ff6600' },
    ],
  },
  {
    name: 'Frontend', icon: 'LayoutDashboard', color: '#3b82f6',
    description: 'Giao diện người dùng chạy trên trình duyệt.',
    children: [
      { name: 'HTML & CSS', color: '#e34f26', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web' },
      { name: 'JavaScript', color: '#f7df1e', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', color: '#3178c6', docsUrl: 'https://www.typescriptlang.org/docs/' },
      { name: 'React', color: '#61dafb', docsUrl: 'https://react.dev/' },
      { name: 'Next.js', color: '#000000', docsUrl: 'https://nextjs.org/docs' },
      { name: 'Vue', color: '#4fc08d', docsUrl: 'https://vuejs.org/guide/' },
      { name: 'Angular', color: '#dd0031', docsUrl: 'https://angular.dev/' },
      { name: 'Svelte', color: '#ff3e00', docsUrl: 'https://svelte.dev/docs' },
      { name: 'TailwindCSS', color: '#06b6d4', docsUrl: 'https://tailwindcss.com/docs' },
      { name: 'State (Redux / Zustand)', color: '#764abc' },
      { name: 'Build Tools (Vite / Webpack)', color: '#646cff', docsUrl: 'https://vitejs.dev/' },
      { name: 'Testing (Jest / Playwright)', color: '#c21325' },
    ],
  },
  {
    name: 'Database', icon: 'Database', color: '#f59e0b',
    description: 'Lưu trữ, truy vấn và mô hình hoá dữ liệu.',
    children: [
      { name: 'PostgreSQL', color: '#336791', docsUrl: 'https://www.postgresql.org/docs/', description: 'CSDL quan hệ mã nguồn mở mạnh nhất.' },
      { name: 'MySQL', color: '#4479a1', docsUrl: 'https://dev.mysql.com/doc/' },
      { name: 'SQL Server', color: '#cc2927', docsUrl: 'https://learn.microsoft.com/sql/sql-server/' },
      { name: 'MongoDB', color: '#47a248', docsUrl: 'https://www.mongodb.com/docs/', description: 'CSDL tài liệu NoSQL.' },
      { name: 'Redis', color: '#dc382d', docsUrl: 'https://redis.io/docs/' },
      { name: 'SQLite', color: '#003b57', docsUrl: 'https://www.sqlite.org/docs.html' },
      { name: 'Prisma ORM', color: '#2d3748', docsUrl: 'https://www.prisma.io/docs' },
      { name: 'TypeORM', color: '#fe0803', docsUrl: 'https://typeorm.io/' },
      { name: 'SQL Cheatsheet', color: '#f59e0b', description: 'Câu lệnh SQL hay dùng: JOIN, index, transaction.' },
    ],
  },
  {
    name: 'DevOps & Cloud', icon: 'Container', color: '#06b6d4',
    description: 'Đóng gói, triển khai, hạ tầng và tự động hoá.',
    children: [
      { name: 'Docker', color: '#2496ed', docsUrl: 'https://docs.docker.com/', description: 'Đóng gói ứng dụng vào container.' },
      { name: 'Docker Compose', color: '#2496ed', docsUrl: 'https://docs.docker.com/compose/' },
      { name: 'Kubernetes', color: '#326ce5', docsUrl: 'https://kubernetes.io/docs/' },
      { name: 'CI/CD (GitHub Actions)', color: '#2088ff', docsUrl: 'https://docs.github.com/actions' },
      { name: 'Nginx', color: '#009639', docsUrl: 'https://nginx.org/en/docs/' },
      { name: 'Cloudflare', color: '#f38020', docsUrl: 'https://developers.cloudflare.com/' },
      { name: 'AWS', color: '#ff9900', docsUrl: 'https://docs.aws.amazon.com/' },
      { name: 'Terraform', color: '#7b42bc', docsUrl: 'https://developer.hashicorp.com/terraform/docs' },
      { name: 'Monitoring & Logging', color: '#06b6d4' },
    ],
  },
  {
    name: 'Linux & Terminal', icon: 'TerminalSquare', color: '#a855f7',
    description: 'Hệ điều hành máy chủ, dòng lệnh và công cụ CLI.',
    children: [
      { name: 'Ubuntu Linux', color: '#e95420', docsUrl: 'https://ubuntu.com/server/docs', description: 'Bản phân phối Linux phổ biến nhất cho server.' },
      { name: 'Fedora Linux', color: '#51a2da', docsUrl: 'https://docs.fedoraproject.org/' },
      { name: 'Debian', color: '#a81d33', docsUrl: 'https://www.debian.org/doc/' },
      { name: 'CentOS / RHEL', color: '#ee0000', docsUrl: 'https://access.redhat.com/documentation/' },
      { name: 'Bash / Zsh', color: '#4eaa25', description: 'Shell scripting, alias, ống lệnh, biến môi trường.' },
      { name: 'Terminal macOS', color: '#999999' },
      { name: 'Windows (PowerShell / WSL)', color: '#012456', docsUrl: 'https://learn.microsoft.com/powershell/' },
      { name: 'Vim / Neovim', color: '#019733', docsUrl: 'https://neovim.io/doc/' },
      { name: 'SSH', color: '#a855f7', description: 'Kết nối, khoá SSH, tunnel, cấu hình ~/.ssh/config.' },
      { name: 'tmux', color: '#1bb91f' },
      { name: 'systemd / services', color: '#30d475' },
    ],
  },
  {
    name: 'Mobile', icon: 'Smartphone', color: '#ec4899',
    description: 'Ứng dụng di động iOS / Android.',
    children: [
      { name: 'Flutter', color: '#02569b', docsUrl: 'https://docs.flutter.dev/' },
      { name: 'React Native', color: '#61dafb', docsUrl: 'https://reactnative.dev/docs/getting-started' },
      { name: 'Android (Kotlin)', color: '#3ddc84', docsUrl: 'https://developer.android.com/docs' },
      { name: 'iOS (Swift / SwiftUI)', color: '#fa7343', docsUrl: 'https://developer.apple.com/documentation/' },
    ],
  },
  {
    name: 'Tools & Workflow', icon: 'Wrench', color: '#64748b',
    description: 'Công cụ lập trình hằng ngày và quy trình làm việc.',
    children: [
      { name: 'Git & GitHub', color: '#f05032', docsUrl: 'https://git-scm.com/doc', description: 'Quản lý phiên bản, branch, merge, rebase, PR.' },
      { name: 'VS Code', color: '#007acc', docsUrl: 'https://code.visualstudio.com/docs' },
      { name: 'Postman', color: '#ff6c37', docsUrl: 'https://learning.postman.com/docs/' },
      { name: 'Regex', color: '#64748b', description: 'Biểu thức chính quy — mẫu hay dùng.' },
      { name: 'npm / yarn / pnpm', color: '#cb3837', docsUrl: 'https://docs.npmjs.com/' },
      { name: 'Env & Config (.env)', color: '#ecd53f' },
      { name: 'Makefile', color: '#427819' },
    ],
  },
  {
    name: 'AI & Data', icon: 'Brain', color: '#8b5cf6',
    description: 'Trí tuệ nhân tạo, LLM và xử lý dữ liệu.',
    children: [
      { name: 'Python Data (pandas / numpy)', color: '#150458', docsUrl: 'https://pandas.pydata.org/docs/' },
      { name: 'LLM API (OpenAI / Claude)', color: '#8b5cf6', docsUrl: 'https://docs.anthropic.com/' },
      { name: 'Prompt Engineering', color: '#a78bfa' },
      { name: 'LangChain', color: '#1c3c3c', docsUrl: 'https://python.langchain.com/docs/' },
    ],
  },
];

let created = 0;
let skipped = 0;
let updated = 0;

async function upsertNode(node, parentId, sortOrder, depth = 0) {
  const slug = slugify(node.name);
  const meta = {
    description: node.description ?? null,
    icon: node.icon ?? null,
    color: node.color ?? null,
    docsUrl: node.docsUrl ?? null,
  };
  const existing = await prisma.snippetCategory.findUnique({ where: { slug } });

  let id;
  if (existing) {
    id = existing.id;
    if (UPDATE_META) {
      if (APPLY) {
        await prisma.snippetCategory.update({ where: { id }, data: meta });
      }
      updated++;
      console.log(`  ~ cập nhật meta: ${node.name} (#${id})`);
    } else {
      skipped++;
      console.log(`  = bỏ qua (đã có): ${node.name} (#${id})`);
    }
  } else {
    created++;
    if (APPLY) {
      const row = await prisma.snippetCategory.create({
        data: { name: node.name, slug, parentId: parentId ?? null, sortOrder, ...meta },
      });
      id = row.id;
    } else {
      id = null; // dry-run: không có id thật cho con
    }
    console.log(`  + tạo mới: ${'  '.repeat(depth)}${node.name}${depth === 0 ? '  [nhóm lớn]' : ''}`);
  }

  if (node.children?.length) {
    for (let i = 0; i < node.children.length; i++) {
      await upsertNode(node.children[i], id, i, depth + 1);
    }
  }
}

async function main() {
  console.log(APPLY
    ? `\n▶ GHI THẬT vào DB${UPDATE_META ? ' (+ cập nhật meta danh mục đã tồn tại)' : ''}\n`
    : '\n▶ XEM TRƯỚC (dry-run) — không ghi gì. Thêm --apply để ghi thật.\n');

  for (let i = 0; i < TREE.length; i++) {
    await upsertNode(TREE[i], null, i);
  }

  const totalTech = TREE.reduce((n, g) => n + (g.children?.length ?? 0), 0);
  console.log(`\n── Tổng kết ──`);
  console.log(`Nhóm lớn: ${TREE.length} · Công nghệ con: ${totalTech}`);
  console.log(`Tạo mới: ${created} · Bỏ qua (đã có): ${skipped} · Cập nhật meta: ${updated}`);
  if (!APPLY) console.log(`\n(Chưa ghi gì. Chạy lại với --apply để tạo thật.)`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
