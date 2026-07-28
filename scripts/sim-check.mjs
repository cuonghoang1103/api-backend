/**
 * sim-check.mjs — đối chiếu giáo trình với sổ kịch bản của /simulation.
 * ─────────────────────────────────────────────────────────────────────────────
 * Bắt đúng những lỗi mà `tsc` và `npm run build` KHÔNG thấy, vì chúng là lỗi
 * DỮ LIỆU giữa hai thế giới (content/*.mjs ↔ frontend/…/scenarios/*.ts) chứ
 * không phải lỗi kiểu:
 *
 *   • `scenario: 'cpu-cyle'` sai chính tả  → getScenario() rơi về kịch bản ĐẦU
 *     TIÊN, bài học minh hoạ nhầm nội dung mà không có lỗi nào hiện ra.
 *   • `options: { view: 'swap' }` trên kịch bản chỉ có `mode` → sanitizeOptions()
 *     im lặng dùng nhánh mặc định. Bài "thay trang" mở ra bản "dịch địa chỉ".
 *   • `course.slug` trong file nội dung lệch slug thật trong CSDL → mọi link
 *     "Quay lại bài học" trỏ vào trang 404 (seeder KHÔNG cập nhật slug của
 *     khoá đã tồn tại — xem cảnh báo trong academy-seed-course.mjs).
 *   • Khối chèn làm lệch số vế `ml-en` / `ml-vi` → vỡ bộ chuyển song ngữ.
 *
 * KHÔNG phụ thuộc npm — chỉ `node:fs` + import động file .mjs (giáo trình là
 * dữ liệu thuần). Chạy được cả trên máy dev lẫn trong container.
 *
 *   node scripts/sim-check.mjs            # kiểm, in báo cáo
 *   node scripts/sim-check.mjs --quiet    # chỉ in lỗi và dòng tổng kết
 *
 * Thoát 1 nếu có lỗi ⇒ cắm thẳng vào deploy.sh trước bước rsync.
 *
 * Sổ kịch bản được đọc bằng CÁCH PHÂN TÍCH VĂN BẢN file .ts, không biên dịch:
 * script này chạy ở chỗ không có bundler, và nếu phải build cả frontend chỉ để
 * kiểm dữ liệu thì không ai chạy nó trước mỗi deploy nữa.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { withSimulation } from './lib/simulation-block.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCEN_DIR = path.join(ROOT, 'frontend/src/components/simulation/scenarios');
const QUIET = process.argv.includes('--quiet');

const errors = [];
const warns = [];
const say = (msg) => { if (!QUIET) console.log(msg); };
const err = (msg) => { errors.push(msg); console.log(`  ✗ ${msg}`); };
const warn = (msg) => { warns.push(msg); if (!QUIET) console.log(`  ! ${msg}`); };

/* ── 1. Sổ kịch bản ───────────────────────────────────────────────────────── */

/**
 * Đọc id / tuỳ chọn / lesson của từng kịch bản.
 *
 * Neo vào thụt lề: `^  id:` là trường của object kịch bản ở cấp ngoài cùng,
 * còn `^      id:` là id của một tuỳ chọn. Chính thụt lề phân biệt hai thứ —
 * cùng tên trường, khác cấp.
 */
function readRegistry() {
  if (!fs.existsSync(SCEN_DIR)) return null;
  const reg = new Map();

  for (const file of fs.readdirSync(SCEN_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
    const src = fs.readFileSync(path.join(SCEN_DIR, file), 'utf8');
    const id = src.match(/^  id: '([^']+)',$/m)?.[1];
    if (!id) { warn(`${file}: không đọc được \`id\` ở cấp ngoài cùng`); continue; }
    if (reg.has(id)) err(`id kịch bản trùng nhau: '${id}' (${file} và ${reg.get(id).file})`);

    // Tuỳ chọn: cắt ĐÚNG mảng `options: [ … ]` rồi tách theo từng `id:` cấp 6
    // dấu cách.
    //
    // ⚠️ Phải chặn ở dòng `  ],` đóng mảng. Cắt "từ options tới hết file" thì
    // `id` của các BƯỚC (`dns`, `mw-in`, `click-1`…) cũng thụt đúng 6 dấu cách
    // và bị nhận nhầm thành tên tuỳ chọn — bộ kiểm khi đó chấp nhận cả những
    // tên sai, tức là hỏng đúng việc nó sinh ra để làm.
    const options = new Map();
    const optAt = src.indexOf('\n  options: [');
    if (optAt >= 0) {
      const rest = src.slice(optAt + 1);
      const end = rest.search(/^  \],$/m);
      const block = end >= 0 ? rest.slice(0, end) : rest;
      if (end < 0) warn(`${file}: không thấy dòng '  ],' đóng mảng options — có thể đọc thiếu`);
      const marks = [...block.matchAll(/^      id: '([^']+)',$/gm)].map((m) => ({ name: m[1], at: m.index }));
      marks.forEach((mark, i) => {
        const seg = block.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : undefined);
        options.set(mark.name, new Set([...seg.matchAll(/value: '([^']+)'/g)].map((x) => x[1])));
      });
    }

    const lessonBlock = src.match(/^  lesson: \{([\s\S]*?)^  \},$/m)?.[1] ?? null;
    const lesson = lessonBlock
      ? {
          course: lessonBlock.match(/course: '([^']+)'/)?.[1] ?? null,
          subject: lessonBlock.match(/subject: '([^']+)'/)?.[1] ?? null,
          code: lessonBlock.match(/code: '([^']+)'/)?.[1] ?? null,
          slug: lessonBlock.match(/slug: '([^']+)'/)?.[1] ?? null,
        }
      : null;

    reg.set(id, { file, options, lesson });
  }
  return reg;
}

/* ── 2. Giáo trình ────────────────────────────────────────────────────────── */

/** Mọi spec khoá học: môn Academy + khoá CuongThai (file .mjs cấp ngoài). */
async function readCourses() {
  const out = [];
  const dirs = [
    { dir: path.join(ROOT, 'content/academy'), kind: 'academy' },
    { dir: path.join(ROOT, 'content/courses'), kind: 'course' },
  ];
  for (const { dir, kind } of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mjs'))) {
      const rel = path.relative(ROOT, path.join(dir, f));
      let spec;
      try {
        spec = (await import(pathToFileURL(path.join(dir, f)).href)).default;
      } catch (e) {
        err(`${rel}: không nạp được (${e.message})`);
        continue;
      }
      if (!spec?.course) { warn(`${rel}: không có \`course\` — bỏ qua`); continue; }
      out.push({ rel, kind, slug: spec.course.slug ?? null, code: spec.course.courseCode ?? null, sections: spec.sections ?? [] });
    }
  }
  return out;
}

const simsOf = (lesson) => [
  ...(Array.isArray(lesson.simulations) ? lesson.simulations : []),
  ...(lesson.simulation ? [lesson.simulation] : []),
].filter(Boolean);

/* ── 3. Chạy kiểm ─────────────────────────────────────────────────────────── */

const registry = readRegistry();
if (!registry) {
  say('ⓘ Không thấy thư mục kịch bản (frontend/) — bỏ qua phần đối chiếu sổ kịch bản.');
} else {
  say(`Sổ kịch bản: ${registry.size} kịch bản.`);
}

const courses = await readCourses();
say(`Giáo trình: ${courses.length} khoá.`);

const lessonIndex = new Map();   // slug bài → { courseSlug, rel }
let totalSims = 0, lessonsWithSims = 0;

for (const course of courses) {
  for (const sec of course.sections) {
    for (const lesson of sec.lessons ?? []) {
      if (!lesson.slug) continue;
      if (lessonIndex.has(lesson.slug)) {
        err(`slug bài học trùng: '${lesson.slug}' (${course.rel} và ${lessonIndex.get(lesson.slug).rel})`);
      }
      lessonIndex.set(lesson.slug, { courseSlug: course.slug, rel: course.rel });

      const sims = simsOf(lesson);
      if (sims.length === 0) continue;
      lessonsWithSims++;
      totalSims += sims.length;

      const where = `${course.rel} › ${lesson.slug}`;

      for (const sim of sims) {
        if (!sim.scenario) { err(`${where}: khối mô phỏng thiếu \`scenario\``); continue; }

        if (registry) {
          const reg = registry.get(sim.scenario);
          if (!reg) {
            err(`${where}: kịch bản '${sim.scenario}' KHÔNG tồn tại trong sổ`);
          } else {
            for (const [key, value] of Object.entries(sim.options ?? {})) {
              const allowed = reg.options.get(key);
              if (!allowed) {
                err(`${where} › ${sim.scenario}: không có tuỳ chọn '${key}' (có: ${[...reg.options.keys()].join(', ') || 'không có'})`);
              } else if (allowed.size === 0) {
                // Danh sách lựa chọn được SINH RA lúc chạy (rest-api lấy 14 mã
                // HTTP từ `httpStatus.ts` qua `.map()`), nên đọc văn bản không
                // thấy `value: '...'` nào. Không biết thì phải nói là không
                // biết — báo sai ở đây còn tệ hơn không kiểm, vì nó dạy người
                // dùng bỏ qua kết quả của bộ kiểm.
                warn(`${where} › ${sim.scenario}: '${key}' có danh sách sinh động, không kiểm được giá trị '${value}'`);
              } else if (!allowed.has(String(value))) {
                err(`${where} › ${sim.scenario}: '${key}=${value}' không hợp lệ (nhận: ${[...allowed].join(' | ')})`);
              }
            }
          }
        }

        if (!sim.caption?.vi || !sim.caption?.en) err(`${where} › ${sim.scenario}: thiếu caption song ngữ`);
        if (sim.url && !sim.poster) warn(`${where} › ${sim.scenario}: có \`url\` nhưng thiếu \`poster\``);
        if (!sim.url && sim.poster) warn(`${where} › ${sim.scenario}: có \`poster\` nhưng thiếu \`url\``);
      }

      /* Chèn thử: khối phải vào ĐỦ hai vế song ngữ và không phá vỏ `ml-*`. */
      const before = lesson.content ?? '';
      if (!before) { warn(`${where}: có khối mô phỏng nhưng bài không có \`content\``); continue; }
      const after = withSimulation(before, lesson, course.slug);
      const count = (s, re) => (s.match(re) || []).length;
      const en0 = count(before, /<div class="ml-en">/g), vi0 = count(before, /<div class="ml-vi">/g);
      const en1 = count(after, /<div class="ml-en">/g), vi1 = count(after, /<div class="ml-vi">/g);
      if (en1 !== en0 || vi1 !== vi0) err(`${where}: chèn khối làm vỡ vỏ song ngữ (${en0}/${vi0} → ${en1}/${vi1})`);
      else if (en0 !== 1 || vi0 !== 1) warn(`${where}: bài không có đúng một cặp ml-en/ml-vi (${en0}/${vi0}) — khối có thể chèn lệch`);
      const blocks = count(after, /class="sim-(video|card)"/g);
      const links = count(after, /class="sim-open"/g);
      if (blocks !== sims.length * 2) err(`${where}: dựng ra ${blocks} khối, kỳ vọng ${sims.length * 2} (mỗi kịch bản một khối cho mỗi vế)`);
      if (links !== sims.length * 2) err(`${where}: dựng ra ${links} link, kỳ vọng ${sims.length * 2}`);
    }
  }
}

/* Kịch bản khai `lesson`: bài đó phải CÓ THẬT, và slug khoá phải khớp. */
let linked = 0;
if (registry) {
  for (const [id, reg] of registry) {
    if (!reg.lesson) continue;
    linked++;
    const { slug, course } = reg.lesson;
    const found = lessonIndex.get(slug);
    if (!found) {
      err(`kịch bản '${id}' (${reg.file}) khai lesson.slug '${slug}' — không có bài học nào mang slug đó`);
    } else if (course && found.courseSlug && course !== found.courseSlug) {
      err(`kịch bản '${id}': lesson.course='${course}' nhưng bài '${slug}' thuộc khoá '${found.courseSlug}' (${found.rel}) — nút "Quay lại bài học" sẽ 404`);
    }
  }
}

/* ── 4. Báo cáo ───────────────────────────────────────────────────────────── */

say('');
say(`${lessonsWithSims} bài có mô phỏng · ${totalSims} khối · ${linked}/${registry?.size ?? '?'} kịch bản đã nối bài học.`);

if (registry && !QUIET) {
  const orphan = [...registry.entries()].filter(([, r]) => !r.lesson).map(([id]) => id);
  if (orphan.length) say(`ⓘ Chưa nối bài học (${orphan.length}): ${orphan.join(', ')}`);
}

if (errors.length) {
  console.log(`\n✗ ${errors.length} lỗi${warns.length ? `, ${warns.length} cảnh báo` : ''}.`);
  process.exit(1);
}
console.log(`✓ Không có lỗi${warns.length ? ` (${warns.length} cảnh báo)` : ''}.`);
