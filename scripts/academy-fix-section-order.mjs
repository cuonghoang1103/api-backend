// Sinh SQL đặt lại sort_order cho TOÀN BỘ section VÀ bài học theo đúng thứ tự trong file .mjs
//
// Vì sao cần: seeder (academy-seed-course.mjs) tạo section mới ở CUỐI khoá và bài học mới ở
// CUỐI chương (sort_order = max + 1), không bao giờ chèn vào giữa. Nên mỗi lần đào sâu một môn
// (thêm chương/bài vào giữa file), thứ tự trên prod sẽ SAI dù file .mjs đúng.
//
// Dùng: node scripts/academy-fix-section-order.mjs <path-to-course.mjs> [--sections-only]
// Khớp section theo TITLE đầy đủ và bài học theo SLUG nên chạy được ở mọi DB (ID prod khác local).
const file = process.argv[2];
const sectionsOnly = process.argv.includes('--sections-only');
if (!file) { console.error('Usage: node scripts/academy-fix-section-order.mjs <file.mjs>'); process.exit(1); }

const mod = (await import(file.startsWith('/') ? file : `${process.cwd()}/${file.replace(/^\.\//, '')}`)).default;
const code = mod.course.courseCode;
const esc = (s) => String(s).replace(/'/g, "''");
const COURSE = `(SELECT id FROM courses WHERE course_code = '${code}' AND academy_type = 'FPT')`;

let nLessons = 0;
const lines = [`-- ${code}: ${mod.sections.length} sections`, 'BEGIN;'];

mod.sections.forEach((s, i) => {
  lines.push(
    `UPDATE course_sections SET sort_order = ${i} ` +
    `WHERE course_id = ${COURSE} AND title = '${esc(s.title)}';`
  );
  if (sectionsOnly) return;
  (s.lessons || []).forEach((l, j) => {
    if (!l.slug) return;
    nLessons++;
    lines.push(
      `UPDATE lessons SET sort_order = ${j} ` +
      `WHERE slug = '${esc(l.slug)}' ` +
      `AND section_id IN (SELECT id FROM course_sections WHERE course_id = ${COURSE});`
    );
  });
});

lines.push('COMMIT;');
lines.splice(1, 0, `-- ${nLessons} lessons`);
console.log(lines.join('\n'));
