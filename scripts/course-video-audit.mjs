/**
 * course-video-audit.mjs — kiểm bản đồ video NGOẠI TUYẾN, không gọi mạng.
 * ─────────────────────────────────────────────────────────────────────────────
 * `verify-youtube-videos.mjs` hỏi YouTube xem link còn sống không. Cái đó cần
 * ra được internet. Bộ kiểm này hỏi những câu KHÔNG cần mạng, và đó đúng là
 * những câu hay sai nhất khi viết bản đồ bằng tay:
 *
 *   1. Có bài lý thuyết nào chưa có video không?  (thiếu → học viên thấy khung trống)
 *   2. Có entry nào trỏ vào slug KHÔNG TỒN TẠI không?  (gõ nhầm → seed bỏ qua im lặng)
 *   3. Có entry nào gắn video cho bài QUIZ không?  (quiz không có khung video)
 *   4. Có id nào dùng lại ở nhiều bài không?  (một video kể hai chuyện khác nhau)
 *   5. Id có đúng 11 ký tự YouTube không?
 *   6. Còn bao nhiêu credit rỗng — tức chưa chạy --fix-credits?
 *
 *   node scripts/course-video-audit.mjs --all
 *   node scripts/course-video-audit.mjs --file ./content/course-videos/nodejs.mjs
 *
 * Thoát 1 khi có lỗi thật (thiếu bài, sai slug, id hỏng, quiz có video).
 * Credit rỗng và id dùng lại chỉ CẢNH BÁO — chúng có thể là cố ý.
 */
import { pathToFileURL } from 'node:url';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const MAP_DIR = './content/course-videos';
const COURSE_DIR = './content/courses';

const files = has('--all')
  ? readdirSync(MAP_DIR).filter((f) => f.endsWith('.mjs')).sort().map((f) => path.join(MAP_DIR, f))
  : [val('--file')].filter(Boolean);
if (!files.length) { console.error('cần --file <map.mjs> hoặc --all'); process.exit(1); }

const load = async (p) => (await import(pathToFileURL(path.resolve(p)).href)).default;
let errors = 0, warns = 0;

for (const file of files) {
  const map = await load(file);
  const coursePath = path.join(COURSE_DIR, `${map.courseSlug}.mjs`);
  console.log(`\n── ${path.basename(file)} · ${map.courseSlug} ──`);
  if (!existsSync(coursePath)) { console.error(`  ✗ không thấy khoá ${coursePath}`); errors++; continue; }

  const course = await load(coursePath);
  const lessons = course.sections.flatMap((s) => s.lessons);
  const theory = lessons.filter((l) => l.type !== 'QUIZ').map((l) => l.slug);
  const quiz = new Set(lessons.filter((l) => l.type === 'QUIZ').map((l) => l.slug));
  const known = new Set(lessons.map((l) => l.slug));
  const entries = Object.entries(map.lessons || {});

  const missing = theory.filter((s) => !map.lessons?.[s]?.yt);
  if (missing.length) { console.error(`  ✗ ${missing.length} bài lý thuyết CHƯA có video:`); missing.forEach((s) => console.error(`      ${s}`)); errors += missing.length; }

  for (const [slug, e] of entries) {
    if (!known.has(slug)) { console.error(`  ✗ slug không tồn tại trong khoá: ${slug}`); errors++; continue; }
    if (quiz.has(slug)) { console.error(`  ✗ ${slug} là bài QUIZ — không có khung video`); errors++; }
    if (e.yt && !/^[A-Za-z0-9_-]{11}$/.test(String(e.yt).trim())) { console.error(`  ✗ ${slug}: id YouTube không hợp lệ "${e.yt}"`); errors++; }
  }

  const byId = new Map();
  for (const [slug, e] of entries) { if (e.yt) (byId.get(e.yt) ?? byId.set(e.yt, []).get(e.yt)).push(slug); }
  for (const [id, slugs] of byId) if (slugs.length > 1) { console.warn(`  ! id ${id} dùng lại ở ${slugs.length} bài: ${slugs.join(', ')}`); warns++; }

  const noCredit = entries.filter(([, e]) => e.yt && !String(e.credit || '').trim()).length;
  if (noCredit) { console.warn(`  ! ${noCredit} credit còn rỗng — chạy verify-youtube-videos.mjs --fix-credits`); warns++; }

  console.log(`  · ${entries.length}/${theory.length} bài lý thuyết có video · ${byId.size} video khác nhau`);
}

console.log(`\nTổng: ${errors} lỗi · ${warns} cảnh báo.`);
process.exit(errors > 0 ? 1 : 0);
