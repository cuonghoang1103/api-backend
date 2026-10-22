#!/usr/bin/env node
/**
 * Tạo KHUNG 12 khoá mới (22/10/2026) — "làm khung trước, học đến đâu làm đến đó".
 * Mỗi khoá: ảnh bìa (URL tương lai), tên + mô tả song ngữ, mục lục chương/bài (KHÔNG nội dung), `status = COMING_SOON`.
 * Trang /courses hiện chúng ở "Môn tự chọn · Sắp ra mắt"; mọi cửa học/mua/ghi danh đóng — xem src/services/khoaSapRaMat.ts.
 *
 *   node scripts/tao-khung-khoa-moi.mjs              # CHẠY THỬ (mặc định) — in ra sẽ tạo gì, không ghi
 *   node scripts/tao-khung-khoa-moi.mjs --ghi        # ghi vào CSDL ở DATABASE_URL
 *   node scripts/tao-khung-khoa-moi.mjs --chi ios-swift-swiftui,golang
 *
 * Production (sau migration của nhánh này):
 *   docker exec -it cuonghoangdev_backend node scripts/tao-khung-khoa-moi.mjs          # xem trước
 *   docker exec -it cuonghoangdev_backend node scripts/tao-khung-khoa-moi.mjs --ghi
 *
 * Mục lục: scripts/khung-khoa-moi/<slug>.json — { slug, ma, chuong: [{ tieuDe, bai: [tiêu đề] }] }, tiêu đề "EN|||VI".
 *
 * IDEMPOTENT theo slug, và KHÔNG BAO GIỜ đè việc đã làm:
 *   - chưa có khoá ⇒ tạo khoá + chương + bài (bài `isPublished = false`, không content);
 *   - có khoá, còn COMING_SOON ⇒ chỉ cập nhật tên/mô tả/ảnh/cấp độ/danh mục nếu khác; chưa có chương nào thì tạo khung;
 *     đã có chương ⇒ GIỮ NGUYÊN (có thể đã bắt đầu soạn bài);
 *   - có khoá mà đã PUBLISHED/DRAFT ⇒ không đụng gì, chỉ báo.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ANH = (slug) => `https://media.cuongthai.com/images/course-covers/${slug}.png?v=1`;

/** Thông tin khoá. `danhMuc` = slug CourseCategory sẵn có gần nhất (không có ⇒ để trống, báo). `bia` = tham số ảnh bìa. */
export const KHOA_MOI = [
  {
    slug: 'ios-swift-swiftui', level: 'BEGINNER', danhMuc: 'frontend',
    title: 'iOS & iPadOS with Swift + SwiftUI: Zero to App Store|||iOS & iPadOS với Swift + SwiftUI: từ số 0 đến App Store',
    shortDescription: 'Build real iPhone and iPad apps in Swift and SwiftUI — state with Observation, SwiftData, networking, push, widgets, Apple Pencil — then sign, TestFlight and ship to the App Store, including how to get past review rejections.|||Làm app iPhone và iPad thật bằng Swift + SwiftUI — state với Observation, SwiftData, gọi API, push, widget, Apple Pencil — rồi ký, TestFlight và đưa lên App Store, kể cả cách vượt qua khi bị Apple từ chối.',
    bia: { icon: 'swift', color: 'F05138', title: 'iOS & iPadOS', subtitle: 'Swift + SwiftUI → App Store' },
  },
  {
    slug: 'android-kotlin-compose', level: 'BEGINNER', danhMuc: 'frontend',
    title: 'Android with Kotlin + Jetpack Compose: Zero to Google Play|||Android với Kotlin + Jetpack Compose: từ số 0 đến Google Play',
    shortDescription: 'Kotlin and Jetpack Compose from scratch: navigation, Room, Retrofit/Ktor, coroutines and Flow, sign-in, FCM, tablets and foldables, testing — then Play Console, the Data safety form, closed testing and policy appeals.|||Kotlin và Jetpack Compose từ số 0: điều hướng, Room, Retrofit/Ktor, coroutine và Flow, đăng nhập, FCM, máy tính bảng và máy gập, kiểm thử — rồi Play Console, form Data safety, closed testing và kháng nghị chính sách.',
    bia: { icon: 'android', color: '3DDC84', title: 'Android', subtitle: 'Kotlin + Jetpack Compose' },
  },
  {
    slug: 'microservices-event-driven', level: 'ADVANCED', danhMuc: 'backend',
    title: 'Microservices & Event-Driven Architecture|||Microservices & Event-Driven Architecture',
    shortDescription: 'When to split and when not to, then the patterns that keep distributed systems honest: API gateway, gRPC, database per service, saga and outbox, CQRS, Kafka and RabbitMQ, tracing, resilience, contract tests, Kubernetes.|||Khi nào nên tách và khi nào không, rồi các mẫu giữ cho hệ phân tán đáng tin: API gateway, gRPC, database riêng mỗi service, saga và outbox, CQRS, Kafka và RabbitMQ, tracing, resilience, contract test, Kubernetes.',
    bia: { icon: 'apachekafka', color: 'E8E8E8', title: 'Microservices', subtitle: 'Event-Driven Architecture' },
  },
  {
    slug: 'cau-truc-du-lieu-giai-thuat', level: 'BEGINNER', danhMuc: 'cs-fundamentals',
    title: 'Data Structures & Algorithms|||Cấu trúc dữ liệu & Giải thuật',
    shortDescription: 'Big-O, arrays and hashing, lists, stacks and queues, trees, heaps, graphs, greedy and dynamic programming — taught through how real systems (indexes, caches, schedulers) use them.|||Big-O, mảng và băm, danh sách, ngăn xếp và hàng đợi, cây, heap, đồ thị, tham lam và quy hoạch động — học qua cách các hệ thống thật (chỉ mục, cache, bộ lập lịch) dùng chúng.',
    bia: { icon: 'thealgorithms', color: '00BCB4', title: 'Data Structures', subtitle: '& Algorithms' },
  },
  {
    slug: 'design-patterns-clean-code', level: 'INTERMEDIATE', danhMuc: 'backend',
    title: 'Design Patterns, Clean Code & Refactoring|||Design Patterns, Clean Code & Refactoring',
    shortDescription: 'Readable code first, then SOLID, the GoF patterns that still matter in modern TypeScript and Java, code smells, and refactoring legacy code safely behind tests.|||Code dễ đọc trước, rồi SOLID, những mẫu GoF còn đáng dùng trong TypeScript và Java hiện đại, code smell, và refactor code cũ an toàn nhờ test.',
    bia: { icon: 'patterns-grid', color: 'C2E86C', title: 'Design Patterns', subtitle: 'Clean Code & Refactoring' },
  },
  {
    slug: 'domain-driven-design', level: 'ADVANCED', danhMuc: 'backend',
    title: 'Domain-Driven Design|||Domain-Driven Design',
    shortDescription: 'Model complex business domains: ubiquitous language, bounded contexts and context maps, event storming, aggregates and invariants, domain events, hexagonal architecture, and DDD with CQRS and event sourcing.|||Mô hình hoá nghiệp vụ phức tạp: ngôn ngữ chung, bounded context và context map, event storming, aggregate và bất biến, domain event, kiến trúc hexagonal, và DDD cùng CQRS, event sourcing.',
    bia: { icon: 'hexagon-ddd', color: 'F08705', title: 'Domain-Driven', subtitle: 'Design' },
  },
  {
    slug: 'golang', level: 'INTERMEDIATE', danhMuc: 'languages',
    title: 'Go (Golang) for Backend & Cloud|||Go (Golang) cho Backend & Cloud',
    shortDescription: 'Go the way production teams write it: interfaces, errors, generics, goroutines and channels, context, testing and fuzzing, HTTP and gRPC services, Postgres with sqlc, observability and shipping on Kubernetes.|||Go theo cách các đội production viết: interface, lỗi, generics, goroutine và channel, context, test và fuzz, dịch vụ HTTP và gRPC, Postgres với sqlc, quan sát hệ thống và đưa lên Kubernetes.',
    bia: { icon: 'go', color: '00ADD8', title: 'Go', subtitle: 'Backend & Cloud' },
  },
  {
    slug: 'tieng-anh-it-viet-tai-lieu', level: 'BEGINNER', danhMuc: 'career',
    title: 'English for Developers & Technical Writing|||Tiếng Anh cho dân IT & Viết tài liệu kỹ thuật',
    shortDescription: 'Read docs and errors without fear, then write what engineering teams actually write — commit messages, PR descriptions, bug reports, design docs, RFCs, postmortems — and speak up in stand-ups, demos and interviews.|||Đọc tài liệu và thông báo lỗi không còn sợ, rồi viết đúng thứ đội kỹ thuật cần — commit, mô tả PR, báo lỗi, design doc, RFC, postmortem — và nói được trong stand-up, demo, phỏng vấn.',
    bia: { icon: 'readthedocs', color: '8CA1AF', title: 'English for Devs', subtitle: '& Technical Writing' },
  },
  {
    slug: 'ai-engineering-thuc-chien', level: 'ADVANCED', danhMuc: 'ai',
    title: 'AI Engineering in Practice: Fine-tuning, Self-hosted LLMs, Cost Control|||AI Engineering thực chiến: fine-tuning, LLM tự host, tối ưu chi phí',
    shortDescription: 'Beyond calling an API: evaluation harnesses, RAG done properly, LoRA fine-tuning, self-hosting with vLLM and llama.cpp, quantization and GPU sizing, serving at scale, guardrails, and keeping the bill under control.|||Vượt qua việc gọi API: bộ đánh giá, RAG làm đúng, fine-tune LoRA, tự host bằng vLLM và llama.cpp, lượng tử hoá và chọn GPU, phục vụ ở quy mô lớn, guardrail, và giữ hoá đơn trong tầm kiểm soát.',
    bia: { icon: 'huggingface', color: 'FFD21E', title: 'AI Engineering', subtitle: 'Fine-tune · Self-host · Cost' },
  },
  {
    slug: 'ky-su-dung-agent-ai', level: 'INTERMEDIATE', danhMuc: 'ai',
    title: 'Engineering with AI Agents: Claude Code, Cursor & Reviewing AI Code|||Kỹ sư dùng agent AI chuyên nghiệp: Claude Code, Cursor, review code AI',
    shortDescription: 'Work with coding agents like a senior engineer: project instructions, planning, test-first loops, reviewing AI-written code for hidden bugs and security holes, MCP tools, parallel agents, CI bots and team policy.|||Làm việc với agent viết code như một kỹ sư lâu năm: chỉ dẫn dự án, lập kế hoạch, vòng test trước, review code do AI viết để bắt lỗi ẩn và lỗ hổng, công cụ MCP, agent song song, bot CI và quy tắc nhóm.',
    bia: { icon: 'claude', color: 'D97757', title: 'AI Agents', subtitle: 'Claude Code · Cursor · Review' },
  },
  {
    slug: 'platform-engineering', level: 'ADVANCED', danhMuc: 'devops',
    title: 'Platform Engineering: IDPs, Backstage & GitOps with Argo CD|||Platform Engineering: IDP, Backstage, GitOps với ArgoCD',
    shortDescription: 'Build the internal developer platform your teams want to use: golden paths, Backstage catalog and templates, GitOps with Argo CD and Rollouts, Crossplane and Terraform, policy as code, multi-tenancy and platform metrics.|||Dựng nền tảng nội bộ mà các đội muốn dùng: golden path, catalog và template Backstage, GitOps với Argo CD và Rollouts, Crossplane và Terraform, policy as code, multi-tenancy và đo hiệu quả nền tảng.',
    bia: { icon: 'backstage', color: '9BF0E1', title: 'Platform Eng', subtitle: 'IDP · Backstage · GitOps · Argo CD' },
  },
  {
    slug: 'tech-lead', level: 'ADVANCED', danhMuc: 'career',
    title: 'Tech Lead & Senior Teamwork|||Tech Lead & làm việc nhóm cấp cao',
    shortDescription: 'The step from strong engineer to tech lead: technical vision, design reviews and RFCs, estimation, tech debt, mentoring and delegation, hiring, incidents, stakeholders, feedback and measuring team health.|||Bước từ kỹ sư giỏi lên tech lead: tầm nhìn kỹ thuật, design review và RFC, ước lượng, nợ kỹ thuật, kèm cặp và giao việc, tuyển người, sự cố, làm việc với các bên, góp ý và đo sức khoẻ đội.',
    bia: { icon: 'team-lead', color: '8B93F8', title: 'Tech Lead', subtitle: 'Senior Teamwork' },
  },
];

/** Đọc + kiểm mục lục của một khoá. Trả { ma, chuong } hoặc ném lỗi mô tả rõ. */
export function docKhung(slug, thuMuc = path.join(GOC, 'scripts/khung-khoa-moi')) {
  const k = JSON.parse(readFileSync(path.join(thuMuc, `${slug}.json`), 'utf8'));
  const loi = [];
  if (k.slug !== slug) loi.push(`slug trong tệp là "${k.slug}"`);
  if (!/^[a-z]{2,4}$/.test(k.ma ?? '')) loi.push('thiếu "ma" (2–4 chữ thường)');
  if (!Array.isArray(k.chuong) || k.chuong.length < 13) loi.push('cần Mục 0 + ít nhất 12 chương');
  const dau = k.chuong?.[0]?.bai ?? [];
  if (!/^Start here \(1\/2\)/.test(dau[0] ?? '') || !/^Start here \(2\/2\)/.test(dau[1] ?? '')) {
    loi.push('Mục 0 phải mở đầu bằng hai bài "Start here (1/2)" / "Start here (2/2)"');
  }
  for (const [i, c] of (k.chuong ?? []).entries()) {
    if (!String(c.tieuDe).includes('|||')) loi.push(`chương ${i}: tiêu đề phải "EN|||VI"`);
    if (i > 0 && (c.bai.length < 4 || c.bai.length > 8)) loi.push(`chương ${i}: ${c.bai.length} bài (cần 4–8)`);
    for (const b of c.bai) {
      if (!String(b).includes('|||')) loi.push(`chương ${i}: bài "${String(b).slice(0, 40)}" thiếu "|||"`);
      if (String(b).length > 255) loi.push(`chương ${i}: tiêu đề bài > 255 ký tự`);
    }
  }
  if (loi.length) throw new Error(`Mục lục ${slug} sai:\n  - ${loi.join('\n  - ')}`);
  return k;
}

const loaiBai = (tieuDe) => (/^\S+ — (Quiz|Final exam|Mock exam)/i.test(tieuDe) ? 'QUIZ' : 'VIDEO');

/** Lõi — nhận PrismaClient (hoặc giả lập) để test được không cần CSDL. */
export async function taoKhung(prisma, { apply = false, chi = null, log = console.log, thuMuc } = {}) {
  const ds = KHOA_MOI.filter((k) => !chi || chi.includes(k.slug));
  const danhMuc = new Map((await prisma.courseCategory.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]));
  const kq = { taoMoi: [], capNhat: [], giuNguyen: [], boQua: [], thieuDanhMuc: [] };

  for (const k of ds) {
    const khung = docKhung(k.slug, thuMuc);
    const categoryId = danhMuc.get(k.danhMuc) ?? null;
    if (categoryId == null) kq.thieuDanhMuc.push(`${k.slug} (${k.danhMuc})`);
    const meta = {
      title: k.title, shortDescription: k.shortDescription, level: k.level, thumbnailUrl: ANH(k.slug), categoryId,
    };
    const soBai = khung.chuong.reduce((t, c) => t + c.bai.length, 0);
    const coSan = await prisma.course.findUnique({
      where: { slug: k.slug },
      select: { id: true, status: true, title: true, shortDescription: true, level: true, thumbnailUrl: true, categoryId: true, _count: { select: { sections: true } } },
    });

    if (coSan && coSan.status !== 'COMING_SOON') {
      kq.boQua.push(`${k.slug} (đang ${coSan.status} — không đụng)`);
      continue;
    }
    const taoChuong = (courseId) => khung.chuong.map((c, i) => ({
      courseId, title: c.tieuDe, sortOrder: i,
      lessons: {
        create: c.bai.map((b, j) => ({
          title: b, slug: `${khung.ma}-${i}-${j + 1}`, sortOrder: j, isPublished: false, lessonType: loaiBai(b),
        })),
      },
    }));

    if (!coSan) {
      log(`${apply ? 'TẠO' : 'THỬ'}  ${k.slug} — ${khung.chuong.length - 1} chương + Mục 0, ${soBai} bài`);
      if (apply) {
        const c = await prisma.course.create({
          data: {
            slug: k.slug, ...meta, language: 'Vietnamese', academyType: 'GENERAL',
            accessType: 'FREE', isFree: true, price: 0,
            status: 'COMING_SOON', isPublished: false,
          },
          select: { id: true },
        });
        for (const ch of taoChuong(c.id)) await prisma.courseSection.create({ data: ch });
      }
      kq.taoMoi.push(k.slug);
      continue;
    }

    const doi = Object.entries(meta).filter(([key, v]) => coSan[key] !== v).map(([key]) => key);
    const canKhung = coSan._count.sections === 0;
    if (!doi.length && !canKhung) { kq.giuNguyen.push(k.slug); continue; }
    log(`${apply ? 'SỬA' : 'THỬ'}  ${k.slug} — ${[...doi, ...(canKhung ? ['+khung'] : [])].join(', ')}`);
    if (apply) {
      if (doi.length) await prisma.course.update({ where: { id: coSan.id }, data: Object.fromEntries(doi.map((key) => [key, meta[key]])) });
      if (canKhung) for (const ch of taoChuong(coSan.id)) await prisma.courseSection.create({ data: ch });
    }
    kq.capNhat.push(k.slug);
  }
  return kq;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--ghi');
  const iChi = args.indexOf('--chi');
  const chi = iChi >= 0 ? String(args[iChi + 1] || '').split(',').filter(Boolean) : null;
  try { (await import('dotenv')).config({ path: path.join(GOC, '.env') }); } catch { /* trong container env có sẵn */ }
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const host = (() => { try { return new URL(process.env.DATABASE_URL).host; } catch { return '?'; } })();
    console.log(`${apply ? '⚠️  GHI THẬT' : 'Chạy thử (thêm --ghi để ghi)'} · CSDL ${host}`);
    const kq = await taoKhung(prisma, { apply, chi });
    console.log(`\nTạo mới: ${kq.taoMoi.length} · cập nhật: ${kq.capNhat.length} · giữ nguyên: ${kq.giuNguyen.length} · bỏ qua: ${kq.boQua.length}`);
    if (kq.boQua.length) console.log(`ℹ️  ${kq.boQua.join(', ')}`);
    if (kq.thieuDanhMuc.length) console.log(`⚠️  Không thấy danh mục — để trống: ${kq.thieuDanhMuc.join(', ')}`);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((e) => { console.error(e.message || e); process.exit(1); });
}
