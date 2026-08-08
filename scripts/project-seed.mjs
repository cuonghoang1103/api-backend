/**
 * project-seed.mjs — publish ONE case-study into `Project` (+ its milestone,
 * feature, resource and list-item children) from a spec in `content/projects/`.
 * ─────────────────────────────────────────────────────────────────────────────
 * Why a spec file instead of the admin editor at /admin/projects/<id>:
 * a case-study for a live system goes stale the moment the system changes, and
 * the only way to keep it honest is to edit it in the same commit as the code it
 * describes. A row in Postgres cannot be reviewed in a diff; this file can.
 *
 *   node scripts/project-seed.mjs --file ./content/projects/<slug>.mjs --dry
 *   node scripts/project-seed.mjs --file ./content/projects/<slug>.mjs --apply
 *
 * PURE DATA — no LLM anywhere in this path. Idempotent: the project is keyed by
 * `slug`, so re-running re-authors it in place. Deliberately preserved across
 * re-runs:
 *   • `viewCount` / `likeCount` — re-authoring must not reset the counters, and
 *     `project_likes` rows key on projectId, which never changes
 *   • `createdAt`               — the original publish date
 *   • `thumbnailUrl` / `images` — uploaded through the admin UI to R2, not
 *     tracked here; a spec that omits them must not wipe them
 *
 * The four child tables ARE replaced wholesale on every run (delete + create).
 * They are ordered lists with no inbound foreign keys, so identity carries no
 * meaning — merging by title would just be a slower way to reach the same rows,
 * with drift when an entry is renamed.
 *
 * SPEC SHAPE (default-exported object) — see content/projects/*.mjs:
 *   {
 *     slug, title, description, techStack, role, duration, status,
 *     category, difficulty, projectUrl, githubUrl,
 *     startDate: '2026-06-08', endDate: null, isFeatured, isPublished,
 *     schemaCode, schemaLang,
 *     bodyMdx: `# heading …`,
 *     milestones: [{ phase, title, description, date, codeBlock, codeLang }],
 *     features:   [{ title, description, status }],   // DONE|IN_PROGRESS|PLANNED
 *     resources:  [{ title, url, type, description }], // PDF|DOC|REPO|LINK|OTHER
 *     coreKnowledge: ['…'], portfolioBonus: ['…'], completionOutcomes: ['…'],
 *   }
 *
 * BILINGUAL (VI/EN) — every field below is optional, and a spec with none of
 * them seeds exactly as before:
 *   titleEn, descriptionEn, roleEn, durationEn, schemaCodeEn,
 *   bodyMdxEn: `# heading …`,          → rendered to bodyHtmlEn with the SAME
 *                                        renderer, so both languages get
 *                                        identical callout/mermaid/heading-id
 *                                        treatment
 *   milestones: [{ …, titleEn, descriptionEn }]   // codeBlock is shared
 *   features:   [{ …, titleEn, descriptionEn }]
 *   resources:  [{ …, titleEn, descriptionEn }]   // url is shared
 *   coreKnowledge: ['chỉ tiếng Việt', { vi: '…', en: '…' }]
 *                                      → list entries take either a plain
 *                                        string (VI only) or a {vi,en} pair.
 *                                        Two parallel arrays would silently
 *                                        mis-pair on any edit that inserts a
 *                                        line in one language only.
 * A missing EN value is NULL in the DB, and the API falls back to Vietnamese —
 * a half-translated project renders, it never goes blank.
 *
 * WHY THE RENDERER COMES FROM dist/
 * The public page reads the cached `bodyHtml` column and nothing else — no
 * markdown parser runs on a read. So the seeder has to produce byte-identical
 * HTML to what the admin route produces, which means calling the SAME renderer
 * (`src/services/projectMarkdown.service.ts`) rather than a second pipeline that
 * would slowly drift. This file is .mjs, so it imports the compiled build. Run
 * `npm run build` first if dist is missing — the seeder says so loudly instead
 * of silently rendering with an old sanitiser.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const FILE = val('--file');
const ROOT = path.resolve(import.meta.dirname, '..');

if (!FILE) {
  console.error('cần --file ./content/projects/<slug>.mjs');
  process.exit(1);
}

/* ── The shared renderer, from the compiled build ───────────────────────────
   A missing dist is the single most likely way to run this script wrong, so it
   gets a real error message rather than a bare MODULE_NOT_FOUND. A stale dist
   only warrants a warning: the renderer changes rarely, and blocking a content
   seed because an unrelated service was edited would be worse. */
const RENDERER_SRC = path.join(ROOT, 'src/services/projectMarkdown.service.ts');
const RENDERER_DIST = path.join(ROOT, 'dist/services/projectMarkdown.service.js');
if (!fs.existsSync(RENDERER_DIST)) {
  console.error(`  ✗ thiếu ${path.relative(ROOT, RENDERER_DIST)} — chạy \`npm run build\` trước.`);
  console.error('    (seeder phải dùng ĐÚNG renderer của backend để bodyHtml khớp với admin route)');
  process.exit(1);
}
if (fs.existsSync(RENDERER_SRC) && fs.statSync(RENDERER_SRC).mtimeMs > fs.statSync(RENDERER_DIST).mtimeMs) {
  console.warn('  ⚠ dist/projectMarkdown cũ hơn src/ — cân nhắc `npm run build` để HTML khớp backend.');
}
const { renderProjectMarkdown, computeReadingTime } = await import(pathToFileURL(RENDERER_DIST).href);

const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;

/* ── Guards ────────────────────────────────────────────────────────────────
   Everything here is a mistake we can catch in a second, versus a bad row we
   would only notice when a reader hits a blank page. */
const problems = [];
const warnings = [];

const need = (field) => { if (!spec?.[field]) problems.push(`thiếu \`${field}\``); };
['slug', 'title', 'description', 'bodyMdx'].forEach(need);

const slug = String(spec.slug ?? '');
if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  problems.push(`slug "${slug}" phải là kebab-case a-z0-9 (nó là URL công khai)`);
}

/* VarChar columns truncate silently in some drivers; fail loudly instead. */
const varchar = (field, value, max) => {
  if (value != null && String(value).length > max) {
    problems.push(`\`${field}\` ${String(value).length} ký tự > ${max} (giới hạn cột)`);
  }
};
varchar('title', spec.title, 255);
varchar('slug', slug, 255);
varchar('role', spec.role, 100);
varchar('duration', spec.duration, 100);
varchar('titleEn', spec.titleEn, 255);
varchar('roleEn', spec.roleEn, 100);
varchar('durationEn', spec.durationEn, 100);
varchar('category', spec.category, 80);
varchar('status', spec.status, 20);
varchar('difficulty', spec.difficulty, 20);
varchar('schemaLang', spec.schemaLang, 40);
varchar('projectUrl', spec.projectUrl, 500);
varchar('githubUrl', spec.githubUrl, 500);

/* EXPERT was added for the 5-level roadmap (Beginner → World-Class): levels 4
   and 5 are genuinely a different tier from "advanced web app", and collapsing
   them into ADVANCED made the hardest projects indistinguishable from the
   mid-tier ones on the listing page. */
const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
if (spec.difficulty && !DIFFICULTIES.includes(spec.difficulty)) {
  problems.push(`difficulty "${spec.difficulty}" không thuộc ${DIFFICULTIES.join(', ')}`);
}

/* `description` is the card blurb on /projects and the <meta description>. */
const description = String(spec.description ?? '');
if (description.length > 400) {
  warnings.push(`description ${description.length} ký tự — thẻ ở trang danh sách sẽ tràn (nên < 300)`);
}

const bodyMdx = String(spec.bodyMdx ?? '');
const bodyMdxEn = spec.bodyMdxEn != null ? String(spec.bodyMdxEn) : '';
const descriptionEn = spec.descriptionEn != null ? String(spec.descriptionEn) : '';

/* ── Children ──────────────────────────────────────────────────────────────
   Validated against exactly what the UI can render. A status the checklist has
   no column for silently disappears from the page; a resource type with no icon
   falls back to OTHER. Both are worth catching here. */
const FEATURE_STATUS = ['DONE', 'IN_PROGRESS', 'PLANNED'];
const RESOURCE_TYPES = ['PDF', 'DOC', 'REPO', 'LINK', 'OTHER'];

const milestones = Array.isArray(spec.milestones) ? spec.milestones : [];
milestones.forEach((m, i) => {
  if (!m?.phase) problems.push(`milestones[${i}] thiếu \`phase\``);
  if (!m?.title) problems.push(`milestones[${i}] thiếu \`title\``);
  varchar(`milestones[${i}].phase`, m?.phase, 40);
  varchar(`milestones[${i}].title`, m?.title, 255);
  varchar(`milestones[${i}].titleEn`, m?.titleEn, 255);
  varchar(`milestones[${i}].codeLang`, m?.codeLang, 40);
  if (m?.date && Number.isNaN(Date.parse(m.date))) problems.push(`milestones[${i}].date "${m.date}" không phải ngày hợp lệ`);
  if (m?.codeBlock && !m?.codeLang) warnings.push(`milestones[${i}] có codeBlock nhưng thiếu codeLang → không tô màu cú pháp`);
});

const features = Array.isArray(spec.features) ? spec.features : [];
features.forEach((f, i) => {
  if (!f?.title) problems.push(`features[${i}] thiếu \`title\``);
  varchar(`features[${i}].title`, f?.title, 255);
  varchar(`features[${i}].titleEn`, f?.titleEn, 255);
  const st = f?.status ?? 'PLANNED';
  if (!FEATURE_STATUS.includes(st)) problems.push(`features[${i}].status "${st}" không thuộc ${FEATURE_STATUS.join('/')}`);
});

const resources = Array.isArray(spec.resources) ? spec.resources : [];
resources.forEach((r, i) => {
  if (!r?.title) problems.push(`resources[${i}] thiếu \`title\``);
  if (!r?.url) problems.push(`resources[${i}] thiếu \`url\``);
  varchar(`resources[${i}].title`, r?.title, 255);
  varchar(`resources[${i}].titleEn`, r?.titleEn, 255);
  varchar(`resources[${i}].url`, r?.url, 1000);
  const ty = r?.type ?? 'LINK';
  if (!RESOURCE_TYPES.includes(ty)) problems.push(`resources[${i}].type "${ty}" không thuộc ${RESOURCE_TYPES.join('/')}`);
});

const LIST_KINDS = [
  ['coreKnowledge', 'CORE_KNOWLEDGE'],
  ['portfolioBonus', 'PORTFOLIO_BONUS'],
  ['completionOutcomes', 'COMPLETION_OUTCOME'],
];
const listItems = [];
for (const [specKey, kind] of LIST_KINDS) {
  const arr = Array.isArray(spec[specKey]) ? spec[specKey] : [];
  arr.forEach((entry, i) => {
    /* A list entry is either a plain string (Vietnamese only) or a {vi,en}
       pair. Accepting both keeps older specs valid and, more importantly,
       keeps a translation glued to its own line — parallel VI/EN arrays go
       out of sync the first time someone inserts a bullet in one of them. */
    const isPair = entry && typeof entry === 'object' && !Array.isArray(entry);
    const s = String((isPair ? entry.vi : entry) ?? '');
    const sEn = isPair && entry.en != null ? String(entry.en) : '';
    if (!s.trim()) { problems.push(`${specKey}[${i}] rỗng`); return; }
    if (s.length > 500) problems.push(`${specKey}[${i}] ${s.length} ký tự > 500 (giới hạn cột)`);
    if (sEn.length > 500) problems.push(`${specKey}[${i}].en ${sEn.length} ký tự > 500 (giới hạn cột)`);
    listItems.push({ kind, content: s, contentEn: sEn.trim() || null, order: i });
  });
}

/* ── Render, then look at what came out ────────────────────────────────────*/
const html = await renderProjectMarkdown(bodyMdx);
if (bodyMdx.trim() && !html.trim()) problems.push('render ra HTML rỗng — sanitizer đã ăn hết nội dung?');

/* The English body goes through the identical renderer, not a second pipeline:
   same callout syntax, same heading ids, same mermaid handling. A separate path
   would drift, and the drift would only show up on the EN half of the page. */
const htmlEn = bodyMdxEn.trim() ? await renderProjectMarkdown(bodyMdxEn) : '';
if (bodyMdxEn.trim() && !htmlEn.trim()) problems.push('bodyMdxEn render ra HTML rỗng');

/* A translated article that is a fraction of the original is nearly always a
   truncated paste, not a terser language. Warn rather than block — some specs
   legitimately ship a short EN summary first. */
if (bodyMdxEn.trim()) {
  const ratio = bodyMdxEn.length / Math.max(bodyMdx.length, 1);
  if (ratio < 0.5) {
    warnings.push(`bodyMdxEn chỉ bằng ${(ratio * 100).toFixed(0)}% độ dài bản VI — bản dịch có bị cắt cụt không?`);
  }
  const enHeadingIds = [...htmlEn.matchAll(/<h[1-4][^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
  const enDupes = enHeadingIds.filter((id, i) => enHeadingIds.indexOf(id) !== i);
  if (enDupes.length) {
    warnings.push(`bản EN có heading trùng id: ${[...new Set(enDupes)].join(', ')} — mục lục EN sẽ nhảy sai chỗ`);
  }
}

/* The sidebar TOC is built from h1-h4 ids the renderer injects. No ids means a
   long article with no way to navigate it. */
const headingIds = [...html.matchAll(/<h[1-4][^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
if (bodyMdx.trim() && headingIds.length === 0) warnings.push('không có heading nào → mục lục bên phải sẽ trống');
const dupeHeadings = headingIds.filter((id, i) => headingIds.indexOf(id) !== i);
if (dupeHeadings.length) {
  warnings.push(`heading trùng id: ${[...new Set(dupeHeadings)].join(', ')} — mục lục sẽ nhảy sai chỗ`);
}

/* Images must exist under frontend/public: the site's CSP is
   `img-src 'self' data:`, so a remote URL is blocked outright, not merely
   broken. This same script runs inside the backend container during deploy,
   where frontend/ is not copied — so the check runs where the tree exists (a
   dev machine, where you are authoring and can fix it) and says so otherwise. */
const imgSrcs = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
const localImgs = [...new Set(imgSrcs.filter((s) => s.startsWith('/')))];
const PUBLIC_DIR = path.join(ROOT, 'frontend/public');
const canCheckImages = fs.existsSync(PUBLIC_DIR);
if (!canCheckImages && localImgs.length) {
  console.log('   (bỏ qua kiểm ảnh: không có frontend/public ở đây — bình thường khi chạy trong container backend)');
}
if (canCheckImages) {
  for (const src of localImgs) {
    if (!fs.existsSync(path.join(PUBLIC_DIR, src.split('?')[0]))) {
      problems.push(`ảnh không có trên đĩa: ${src} (tìm ở frontend/public${src})`);
    }
  }
}
for (const src of imgSrcs.filter((s) => /^https?:/i.test(s) && !s.startsWith('data:'))) {
  problems.push(`ảnh ngoài site bị CSP chặn (img-src 'self'): ${src} — tải về frontend/public/ rồi trỏ đường dẫn tương đối`);
}

const internalLinks = [...new Set([...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((m) => m[1]))];
const words = bodyMdx.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
const codeFences = (bodyMdx.match(/^```/gm) ?? []).length / 2;
const diagrams = (bodyMdx.match(/^```mermaid\b/gm) ?? []).length;

const wordsEn = bodyMdxEn.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
const enTranslated = {
  title: Boolean(spec.titleEn), description: Boolean(descriptionEn), body: Boolean(bodyMdxEn.trim()),
  milestones: milestones.filter((m) => m?.titleEn).length,
  features: features.filter((f) => f?.titleEn).length,
  resources: resources.filter((r) => r?.titleEn).length,
  listItems: listItems.filter((li) => li.contentEn).length,
};

console.log(`── project-seed ${slug || '(no slug)'} : ${APPLY ? 'APPLY' : 'DRY'} ──`);
console.log(`   ${words.toLocaleString('en-US')} từ (không tính code) · ${codeFences} khối code (${diagrams} sơ đồ mermaid) · ${headingIds.length} heading · bodyMdx ${(bodyMdx.length / 1024).toFixed(1)}KB · đọc ~${computeReadingTime(bodyMdx)}′`);
console.log(`   ${milestones.length} mốc · ${features.length} tính năng · ${resources.length} tài nguyên · ${listItems.length} mục danh sách`);
console.log(bodyMdxEn.trim()
  ? `   EN: ${wordsEn.toLocaleString('en-US')} từ · bodyMdxEn ${(bodyMdxEn.length / 1024).toFixed(1)}KB · mốc ${enTranslated.milestones}/${milestones.length} · tính năng ${enTranslated.features}/${features.length} · tài nguyên ${enTranslated.resources}/${resources.length} · danh sách ${enTranslated.listItems}/${listItems.length}`
  : '   EN: (chưa dịch — trang sẽ hiện tiếng Việt khi người xem bật EN)');
console.log(`   link nội bộ: ${internalLinks.length ? internalLinks.join(', ') : '(không có)'}`);

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (problems.length) {
  for (const p of problems) console.error(`  ✗ ${p}`);
  await prisma.$disconnect();
  process.exit(1);
}

const existing = await prisma.project.findUnique({
  where: { slug },
  select: { id: true, viewCount: true, likeCount: true, thumbnailUrl: true, images: true },
});

if (!APPLY) {
  console.log(existing
    ? `   DRY: sẽ CẬP NHẬT dự án #${existing.id} (giữ viewCount ${existing.viewCount}, likeCount ${existing.likeCount}) và thay toàn bộ 4 bảng con`
    : '   DRY: sẽ TẠO MỚI dự án này');
  console.log('   chạy lại với --apply để ghi.');
  await prisma.$disconnect();
  process.exit(0);
}

/* Fields the spec owns. `viewCount`/`likeCount`/`createdAt` are absent on
   purpose — see the header. `thumbnailUrl` and `images` are only written when
   the spec actually names them, so an R2 upload done through the admin UI
   survives a re-seed. */
const data = {
  title: String(spec.title).slice(0, 255),
  description,
  bodyMdx,
  bodyHtml: html,
  techStack: Array.isArray(spec.techStack) ? spec.techStack.join(', ') : (spec.techStack ?? null),
  role: spec.role ?? null,
  duration: spec.duration ?? null,
  status: spec.status ?? 'IN_PROGRESS',
  category: spec.category ?? null,
  difficulty: spec.difficulty ?? null,
  projectUrl: spec.projectUrl ?? null,
  githubUrl: spec.githubUrl ?? null,
  videoUrl: spec.videoUrl ?? null,
  schemaCode: spec.schemaCode ?? null,
  schemaLang: spec.schemaLang ?? null,
  titleEn: spec.titleEn ?? null,
  descriptionEn: descriptionEn || null,
  roleEn: spec.roleEn ?? null,
  durationEn: spec.durationEn ?? null,
  bodyMdxEn: bodyMdxEn || null,
  bodyHtmlEn: htmlEn || null,
  schemaCodeEn: spec.schemaCodeEn ?? null,
  startDate: spec.startDate ? new Date(spec.startDate) : null,
  endDate: spec.endDate ? new Date(spec.endDate) : null,
  isFeatured: spec.isFeatured !== undefined ? Boolean(spec.isFeatured) : true,
  isPublished: spec.isPublished !== undefined ? Boolean(spec.isPublished) : true,
  ...(spec.thumbnailUrl !== undefined ? { thumbnailUrl: spec.thumbnailUrl } : {}),
  ...(spec.images !== undefined ? { images: JSON.stringify(spec.images) } : {}),
};

/* One transaction: a crash between "delete the old milestones" and "write the
   new ones" would leave the live page with a case-study body and no timeline. */
const projectId = await prisma.$transaction(async (tx) => {
  const saved = existing
    ? await tx.project.update({ where: { id: existing.id }, data })
    : await tx.project.create({ data: { ...data, slug } });

  await tx.projectMilestone.deleteMany({ where: { projectId: saved.id } });
  await tx.projectFeature.deleteMany({ where: { projectId: saved.id } });
  await tx.projectResource.deleteMany({ where: { projectId: saved.id } });
  await tx.projectListItem.deleteMany({ where: { projectId: saved.id } });

  if (milestones.length) {
    await tx.projectMilestone.createMany({
      data: milestones.map((m, i) => ({
        projectId: saved.id,
        phase: String(m.phase).slice(0, 40),
        title: String(m.title).slice(0, 255),
        description: m.description ?? null,
        date: m.date ? new Date(m.date) : null,
        imageUrl: m.imageUrl ?? null,
        codeBlock: m.codeBlock ?? null,
        codeLang: m.codeLang ?? null,
        titleEn: m.titleEn ?? null,
        descriptionEn: m.descriptionEn ?? null,
        order: i,
      })),
    });
  }
  if (features.length) {
    await tx.projectFeature.createMany({
      data: features.map((f, i) => ({
        projectId: saved.id,
        title: String(f.title).slice(0, 255),
        description: f.description ?? null,
        status: f.status ?? 'PLANNED',
        titleEn: f.titleEn ?? null,
        descriptionEn: f.descriptionEn ?? null,
        order: i,
      })),
    });
  }
  if (resources.length) {
    await tx.projectResource.createMany({
      data: resources.map((r, i) => ({
        projectId: saved.id,
        title: String(r.title).slice(0, 255),
        url: String(r.url).slice(0, 1000),
        type: r.type ?? 'LINK',
        fileSize: Number.isFinite(r.fileSize) ? Number(r.fileSize) : null,
        description: r.description ?? null,
        titleEn: r.titleEn ?? null,
        descriptionEn: r.descriptionEn ?? null,
        order: i,
      })),
    });
  }
  if (listItems.length) {
    await tx.projectListItem.createMany({
      data: listItems.map((li) => ({ projectId: saved.id, ...li })),
    });
  }
  return saved.id;
});

/* Read back rather than trusting the write: bodyHtml is the only thing the
   public page renders, and a silently-empty column looks exactly like a
   successful seed from the log alone. */
const check = await prisma.project.findUnique({
  where: { id: projectId },
  select: {
    slug: true, isPublished: true, bodyHtml: true, bodyHtmlEn: true, titleEn: true,
    viewCount: true, likeCount: true,
    _count: { select: { milestones: true, features: true, resources: true, listItems: true } },
  },
});
const htmlLen = check?.bodyHtml?.length ?? 0;
if (htmlLen < 500) {
  console.error(`  ✗ đọc lại thấy sai: bodyHtml chỉ ${htmlLen} ký tự`);
  await prisma.$disconnect();
  process.exit(1);
}
/* The EN column is checked the same way: a spec that carries a translation but
   lands an empty column is the one failure this script exists to catch, and it
   is invisible from the success log otherwise. */
const htmlEnLen = check?.bodyHtmlEn?.length ?? 0;
if (bodyMdxEn.trim() && htmlEnLen < 500) {
  console.error(`  ✗ đọc lại thấy sai: bodyHtmlEn chỉ ${htmlEnLen} ký tự (spec CÓ bodyMdxEn ${(bodyMdxEn.length / 1024).toFixed(1)}KB)`);
  await prisma.$disconnect();
  process.exit(1);
}
const c = check._count;
if (c.milestones !== milestones.length || c.features !== features.length
  || c.resources !== resources.length || c.listItems !== listItems.length) {
  console.error(`  ✗ đọc lại thấy sai số bản ghi con: mốc ${c.milestones}/${milestones.length}, tính năng ${c.features}/${features.length}, tài nguyên ${c.resources}/${resources.length}, danh sách ${c.listItems}/${listItems.length}`);
  await prisma.$disconnect();
  process.exit(1);
}

console.log(`  ✓ ${existing ? 'cập nhật' : 'tạo'} dự án #${projectId} · ${check.isPublished ? 'PUBLISHED' : 'ẨN'} · bodyHtml ${(htmlLen / 1024).toFixed(1)}KB · ${c.milestones} mốc · ${c.features} tính năng · ${c.resources} tài nguyên · ${c.listItems} mục`);
console.log(htmlEnLen
  ? `    EN: bodyHtmlEn ${(htmlEnLen / 1024).toFixed(1)}KB · tiêu đề "${check.titleEn ?? '(chưa có)'}"`
  : '    EN: (không có bản dịch)');
console.log(`    giữ nguyên: ${check.viewCount} lượt xem · ${check.likeCount} lượt thích`);
console.log(`    /projects/${check.slug}`);
console.log('Done.');
await prisma.$disconnect();
