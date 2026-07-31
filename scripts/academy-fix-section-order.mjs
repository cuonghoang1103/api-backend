// Sinh SQL đặt lại sort_order cho TOÀN BỘ section theo đúng thứ tự trong file .mjs
// Dùng: node gen-order-sql.mjs <path-to-course.mjs>
const file = process.argv[2];
const mod = (await import(file)).default;
const code = mod.course.courseCode;
const esc = (s) => s.replace(/'/g, "''");

const lines = [`-- ${code}: ${mod.sections.length} sections`, 'BEGIN;'];
mod.sections.forEach((s, i) => {
  lines.push(
    `UPDATE course_sections SET sort_order = ${i} ` +
    `WHERE course_id = (SELECT id FROM courses WHERE course_code = '${code}' AND academy_type = 'FPT') ` +
    `AND title = '${esc(s.title)}';`
  );
});
lines.push('COMMIT;');
console.log(lines.join('\n'));
