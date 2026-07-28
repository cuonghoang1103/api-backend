#!/usr/bin/env node
/**
 * sim-render-lessons.mjs — dựng video THEO TỪNG KHỐI trong giáo trình.
 * ─────────────────────────────────────────────────────────────────────────────
 * `sim-render.mjs` dựng theo KỊCH BẢN: một kịch bản → một video, nhánh mặc
 * định, và bản kê nó ghi ra lấy `lesson` từ chính kịch bản đó.
 *
 * Nhưng giáo trình gắn cùng một kịch bản vào NHIỀU bài ở NHIỀU nhánh khác
 * nhau — OSG202 2.2 mở `algo=rr`, NWC203c 5.1 mở `view=nat`, CSD201 3.1 mở
 * `view=overflow`. Dựng theo kịch bản thì:
 *   • mọi bài phụ nhận video của nhánh MẶC ĐỊNH — sai nội dung đang dạy;
 *   • bản kê ghi `lesson` = bài CHÍNH của kịch bản, nên `sim-attach` vá nhầm
 *     bài và đặt sai khoá R2.
 *
 * Script này đọc thẳng giáo trình, dựng mỗi khối một video với ĐÚNG tuỳ chọn
 * của khối đó, rồi ghép thành một bản kê trong đó `lesson` là bài THẬT SỰ
 * chứa khối — thứ mà `sim-attach` cần.
 *
 *   node scripts/sim-render-lessons.mjs --base http://localhost:3300
 *   node scripts/sim-render-lessons.mjs --only cea201,osg202   # lọc theo slug bài
 *   node scripts/sim-render-lessons.mjs --limit 3 --dry
 *
 * Bỏ qua khối đã có `url` (đã dựng rồi) và khối nằm trong `simulations: [ … ]`
 * (nhiều kịch bản trên một bài ⇒ trùng khoá R2 theo slug; xử lý riêng).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const val = (n, d = null) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const has = (n) => argv.includes(n);

const BASE = val('--base', 'http://localhost:3300');
const OUT = path.resolve(val('--out', '_render_lessons'));
const LANG = val('--lang', 'vi');
const ONLY = (val('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const LIMIT = Number(val('--limit', '0')) || 0;
const DRY = has('--dry');
// Khối nằm trong `simulations: [ … ]` mặc định bị bỏ qua: chúng cần khoá R2 có
// đuôi id kịch bản và cách vá riêng. `--multi` dựng ĐÚNG những khối đó.
const MULTI = has('--multi');

/* ── Gom mọi khối cần dựng ────────────────────────────────────────────────── */

const contentFiles = [
  ...fs.readdirSync(path.join(ROOT, 'content/academy')).map((f) => `content/academy/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'content/courses')).filter((f) => f.endsWith('.mjs')).map((f) => `content/courses/${f}`),
].filter((f) => f.endsWith('.mjs'));

const jobs = [];
let already = 0, inArray = 0;

for (const rel of contentFiles) {
  const spec = (await import(pathToFileURL(path.join(ROOT, rel)).href)).default;
  if (!spec?.course) continue;
  const courseSlug = spec.course.slug;
  const subject = spec.course.courseCode ?? null;

  for (const sec of spec.sections ?? []) {
    for (const lesson of sec.lessons ?? []) {
      const arr = Array.isArray(lesson.simulations) ? lesson.simulations : null;
      const single = lesson.simulation ? [lesson.simulation] : [];

      for (const sim of [...(arr ?? []), ...single]) {
        if (sim.url) { already++; continue; }
        if (arr && !MULTI) { inArray++; continue; }
        if (ONLY.length && !ONLY.some((p) => lesson.slug.includes(p))) continue;
        jobs.push({
          lessonSlug: lesson.slug,
          courseSlug,
          subject: rel.startsWith('content/academy/') ? subject : null,
          scenario: sim.scenario,
          options: sim.options ?? {},
          caption: sim.caption ?? {},
          // Bài nhiều kịch bản: `sim-attach` phải thêm đuôi id vào khoá R2,
          // nếu không các video của cùng một bài ghi đè lẫn nhau.
          multiScenario: Boolean(arr),
          file: rel,
        });
      }
    }
  }
}

const list = LIMIT ? jobs.slice(0, LIMIT) : jobs;
console.log(`Cần dựng: ${jobs.length} khối (bỏ qua ${already} đã có video, ${inArray} nằm trong simulations:[…]).`);
if (LIMIT) console.log(`--limit ${LIMIT} ⇒ chỉ dựng ${list.length}.`);
if (DRY) {
  for (const j of list) console.log(`  · ${j.lessonSlug.padEnd(42)} ${j.scenario}${Object.keys(j.options).length ? ` (${Object.entries(j.options).map(([k, v]) => `${k}=${v}`).join(',')})` : ''}`);
  process.exit(0);
}

/* ── Dựng từng cái ────────────────────────────────────────────────────────── */

fs.mkdirSync(OUT, { recursive: true });
const videos = [];
let ok = 0, fail = 0;
const t0 = Date.now();

for (const [i, job] of list.entries()) {
  // Mỗi khối một thư mục riêng: cùng kịch bản ở hai nhánh sẽ ra cùng TÊN FILE
  // (`<kịch bản>__vi.mp4`) nên để chung thư mục là cái sau đè cái trước.
  const dir = path.join(OUT, job.multiScenario ? `${job.lessonSlug}--${job.scenario}` : job.lessonSlug);
  const args = ['scripts/sim-render.mjs', '--scenario', job.scenario, '--base', BASE, '--lang', LANG, '--out', dir];
  if (Object.keys(job.options).length) {
    args.push('--opts', Object.entries(job.options).map(([k, v]) => `${k}=${v}`).join(','));
  }

  const label = `[${i + 1}/${list.length}] ${job.lessonSlug} ← ${job.scenario}`;
  console.log(label);
  const r = spawnSync('node', args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) {
    fail++;
    console.error(`  ✗ dựng hỏng: ${(r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' | ')}`);
    continue;
  }

  const subManifest = path.join(dir, 'manifest.json');
  if (!fs.existsSync(subManifest)) { fail++; console.error('  ✗ không thấy manifest con'); continue; }
  const entry = JSON.parse(fs.readFileSync(subManifest, 'utf8')).videos?.[0];
  if (!entry) { fail++; console.error('  ✗ manifest con rỗng'); continue; }

  // ĐÂY là điểm khác biệt của script này: ghi đè `lesson` bằng bài THẬT SỰ
  // chứa khối, thay cho bài "chính chủ" mà kịch bản tự khai.
  entry.lesson = {
    course: job.courseSlug,
    ...(job.subject ? { subject: job.subject } : {}),
    slug: job.lessonSlug,
  };
  if (job.multiScenario) entry.multiScenario = true;
  if (job.caption?.vi || job.caption?.en) entry.name = job.caption;
  videos.push(entry);
  ok++;
  console.log(`  ✓ ${(entry.bytes / 1048576).toFixed(1)} MB · ${entry.durationSeconds}s`);
}

const manifest = { renderedAt: new Date().toISOString(), base: BASE, lang: LANG, videos };
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

const mins = ((Date.now() - t0) / 60000).toFixed(1);
console.log(`\n✓ ${ok} video, ✗ ${fail} hỏng, ${mins} phút. Bản kê: ${path.join(OUT, 'manifest.json')}`);
if (fail) process.exitCode = 1;
