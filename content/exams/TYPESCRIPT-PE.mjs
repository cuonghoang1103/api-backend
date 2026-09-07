/**
 * TypeScript — Practical Exam (PE): 5 câu lập trình, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/typescript/s00…s16`. Khác đề FE (50 câu
 * trắc nghiệm, đọc mã), đề này bắt VIẾT mã: thu hẹp union, discriminated union
 * + exhaustiveness, class generic có ràng buộc, mapped type + template literal
 * type, và validate `unknown` tại biên.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `starterCode` DƯỚI ĐÂY ĐÃ CHẠY THẬT:
 *   • `npx tsc --noEmit --strict --target es2022 Qn.ts` — sạch, cả bản khung
 *     lẫn bản lời giải (khung mà không biên dịch được thì học viên mất cả buổi
 *     đi sửa lỗi của người ra đề).
 *   • `node Qn.ts` (Node v22.21.0 tự xoá chú thích kiểu) — `expectedOutput` là
 *     nguyên văn stdout, không phải dự đoán.
 * Kiểm lại bất cứ lúc nào: `node scripts/exam-check.mjs ./content/exams/TYPESCRIPT-PE.mjs`
 *
 * ⚠️ `--target es2022` là BẮT BUỘC trong lệnh kiểm. Gọi `tsc` trần trên một
 * file lẻ thì target mặc định là ES5, và lib ES5 không có `Array.prototype.find`
 * lẫn `Object.assign` → câu 3 trả về TS2550 chứ không phải lỗi của học viên.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TYPESCRIPT-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/typescript-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 * `weight` giữ nguyên vai trò cũ (bộ chấm AI in ra kèm tiêu chí).
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five files named <code>Q1.ts … Q5.ts</code> in your own editor. Each question shows a <b>Starter</b> block — copy it into the file <b>verbatim</b> and write your answer only in the middle region, between the two <code>ĐỀ CHO SẴN</code> markers. The given data and the printing loop are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>No npm packages</b> beyond <code>typescript</code> and <code>tsx</code>. Everything you need is in the language.</li>' +
  '<li>Type-check each file with <code>npx tsc --noEmit --strict --target es2022 Q1.ts</code>. It must print <b>nothing</b>. The <code>--target es2022</code> is not optional: on a lone file <code>tsc</code> defaults to ES5, whose lib has no <code>Array.prototype.find</code> and no <code>Object.assign</code>, and you will chase errors that are not yours.</li>' +
  '<li>Run it with <code>npx tsx Q1.ts</code> and compare with the "expected output" block, <b>line for line</b>.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a program that prints the wrong lines cannot pass. But this is a TypeScript exam, so the <b>types</b> are graded too: an <code>any</code>, an <code>as</code> that papers over a check you did not do, or a <code>!</code> that silences a possible <code>undefined</code> all cost marks <em>even when the output matches</em>. If you find yourself reaching for an assertion, the usual fix is a narrowing check or a type predicate.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.ts … Q5.ts</code> bằng trình soạn thảo của bạn. Mỗi câu có khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào file và chỉ viết lời giải ở vùng giữa, nằm giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần dữ liệu cho sẵn và vòng lặp in kết quả là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Không dùng gói npm nào</b> ngoài <code>typescript</code> và <code>tsx</code>. Mọi thứ cần đến đều nằm sẵn trong ngôn ngữ.</li>' +
  '<li>Kiểm kiểu từng file bằng <code>npx tsc --noEmit --strict --target es2022 Q1.ts</code>. Nó phải <b>không in ra gì</b>. Chữ <code>--target es2022</code> không phải cho vui: chạy <code>tsc</code> trên một file lẻ thì target mặc định là ES5, mà lib ES5 không có <code>Array.prototype.find</code> lẫn <code>Object.assign</code> — bạn sẽ đi sửa những lỗi không phải của mình.</li>' +
  '<li>Chạy bằng <code>npx tsx Q1.ts</code> rồi đối chiếu với khối "kết quả mong đợi", <b>từng dòng một</b>.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — chương trình in sai dòng thì không thể qua. Nhưng đây là bài thi TypeScript, nên <b>kiểu</b> cũng bị chấm: một chữ <code>any</code>, một phép <code>as</code> để lấp chỗ mà bạn lười kiểm, hay một dấu <code>!</code> để bịt miệng cảnh báo <code>undefined</code> đều bị trừ điểm <em>ngay cả khi kết quả in ra đúng</em>. Nếu thấy mình sắp phải ép kiểu, cách sửa gần như luôn là thêm một phép thu hẹp kiểu hoặc một hàm type predicate.</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'type Setting = string | number | boolean | null;\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'function describe(value: Setting): string {\n' +
  "  throw new Error('chưa cài đặt');\n" +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const cases: Setting[] = ['dark', '', 42, 0, true, false, null];\n" +
  'for (const value of cases) console.log(describe(value));\n';

const Q1_SOLUTION =
  'function describe(value: Setting): string {\n' +
  "  if (value === null) return 'empty';\n" +
  "  if (typeof value === 'string') return `str:${value.length}`;\n" +
  "  if (typeof value === 'number') return `num:${value}`;\n" +
  '  // Tới đây union chỉ còn boolean — không cần kiểm thêm, cũng không được ép kiểu.\n' +
  "  return value ? 'bool:on' : 'bool:off';\n" +
  '}\n';

const Q1_OUTPUT =
  'str:4\n' +
  'str:0\n' +
  'num:42\n' +
  'num:0\n' +
  'bool:on\n' +
  'bool:off\n' +
  'empty';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'type UiEvent =\n' +
  "  | { kind: 'click'; x: number; y: number }\n" +
  "  | { kind: 'key'; key: string; shift: boolean }\n" +
  "  | { kind: 'scroll'; dy: number };\n" +
  '\n' +
  'function assertNever(value: never): never {\n' +
  '  throw new Error(`Chưa xử lý biến thể: ${JSON.stringify(value)}`);\n' +
  '}\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'function render(event: UiEvent): string {\n' +
  "  throw new Error('chưa cài đặt');\n" +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const events: UiEvent[] = [\n' +
  "  { kind: 'click', x: 3, y: 4 },\n" +
  "  { kind: 'key', key: 'Enter', shift: true },\n" +
  "  { kind: 'key', key: 'a', shift: false },\n" +
  "  { kind: 'scroll', dy: 120 },\n" +
  "  { kind: 'scroll', dy: -40 },\n" +
  "  { kind: 'scroll', dy: 0 },\n" +
  '];\n' +
  'for (const event of events) console.log(render(event));\n';

const Q2_SOLUTION =
  'function render(event: UiEvent): string {\n' +
  '  switch (event.kind) {\n' +
  "    case 'click':\n" +
  '      return `click(${event.x},${event.y})`;\n' +
  "    case 'key':\n" +
  '      return event.shift ? `key:${event.key}+shift` : `key:${event.key}`;\n' +
  "    case 'scroll':\n" +
  "      if (event.dy === 0) return 'scroll:none';\n" +
  '      return event.dy > 0 ? `scroll:down ${event.dy}` : `scroll:up ${-event.dy}`;\n' +
  '    default:\n' +
  '      // event ở đây có kiểu never. Thêm một biến thể vào UiEvent mà quên xử lý\n' +
  '      // thì chính dòng này là chỗ tsc báo lỗi, chứ không phải người dùng báo.\n' +
  '      return assertNever(event);\n' +
  '  }\n' +
  '}\n';

const Q2_OUTPUT =
  'click(3,4)\n' +
  'key:Enter+shift\n' +
  'key:a\n' +
  'scroll:down 120\n' +
  'scroll:up 40\n' +
  'scroll:none';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'interface User {\n' +
  '  id: number;\n' +
  '  name: string;\n' +
  "  role: 'admin' | 'member';\n" +
  '}\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'class Repository<T extends { id: number }> {\n' +
  '  private items: T[] = [];\n' +
  '\n' +
  '  add(item: T): T {\n' +
  "    throw new Error('chưa cài đặt');\n" +
  '  }\n' +
  '\n' +
  '  get(id: number): T | undefined {\n' +
  "    throw new Error('chưa cài đặt');\n" +
  '  }\n' +
  '\n' +
  "  update(id: number, patch: Partial<Omit<T, 'id'>>): T | undefined {\n" +
  "    throw new Error('chưa cài đặt');\n" +
  '  }\n' +
  '\n' +
  '  findBy<K extends keyof T>(key: K, value: T[K]): T[] {\n' +
  "    throw new Error('chưa cài đặt');\n" +
  '  }\n' +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const users = new Repository<User>();\n' +
  "users.add({ id: 1, name: 'An', role: 'admin' });\n" +
  "users.add({ id: 2, name: 'Bình', role: 'member' });\n" +
  "users.add({ id: 3, name: 'Chi', role: 'member' });\n" +
  '\n' +
  "console.log(users.get(2)?.name ?? 'none');\n" +
  "console.log(users.get(9)?.name ?? 'none');\n" +
  "console.log(users.update(3, { name: 'Chi Nguyễn' })?.name ?? 'none');\n" +
  "console.log(users.update(9, { name: 'X' })?.name ?? 'none');\n" +
  "console.log(users.findBy('role', 'member').map((u) => u.name).join(','));\n" +
  "console.log(users.findBy('name', 'An').length);\n";

const Q3_SOLUTION =
  'class Repository<T extends { id: number }> {\n' +
  '  private items: T[] = [];\n' +
  '\n' +
  '  add(item: T): T {\n' +
  '    this.items.push(item);\n' +
  '    return item;\n' +
  '  }\n' +
  '\n' +
  '  get(id: number): T | undefined {\n' +
  '    // find() trả về T | undefined — trả thẳng ra, KHÔNG dùng ! để bịt miệng.\n' +
  '    return this.items.find((item) => item.id === id);\n' +
  '  }\n' +
  '\n' +
  "  update(id: number, patch: Partial<Omit<T, 'id'>>): T | undefined {\n" +
  '    const found = this.get(id);\n' +
  '    if (found === undefined) return undefined;\n' +
  '    Object.assign(found, patch);\n' +
  '    return found;\n' +
  '  }\n' +
  '\n' +
  '  findBy<K extends keyof T>(key: K, value: T[K]): T[] {\n' +
  '    return this.items.filter((item) => item[key] === value);\n' +
  '  }\n' +
  '}\n';

const Q3_OUTPUT =
  'Bình\n' +
  'none\n' +
  'Chi Nguyễn\n' +
  'none\n' +
  'Bình,Chi Nguyễn\n' +
  '1';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'interface Profile {\n' +
  '  name: string;\n' +
  '  age: number;\n' +
  '  active: boolean;\n' +
  '}\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '// Khung tạm để file biên dịch được ngay từ đầu — hãy thay bằng mapped type thật.\n' +
  'type Getters<T> = Record<string, () => any>;\n' +
  '\n' +
  'function makeGetters<T extends object>(source: T): Getters<T> {\n' +
  "  throw new Error('chưa cài đặt');\n" +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const profile: Profile = { name: 'An', age: 30, active: true };\n" +
  'const g = makeGetters(profile);\n' +
  '\n' +
  '// Ba dòng này là phần kiểm KIỂU: chúng chỉ biên dịch được khi Getters<T>\n' +
  '// giữ đúng kiểu trả về của từng thuộc tính.\n' +
  'const nameIsString: string = g.getName();\n' +
  'const nextAge: number = g.getAge() + 1;\n' +
  'const isActive: boolean = g.getActive();\n' +
  '\n' +
  'console.log(nameIsString);\n' +
  'console.log(nextAge);\n' +
  'console.log(isActive);\n' +
  "console.log(Object.keys(g).join(','));\n";

const Q4_SOLUTION =
  'type Getters<T> = {\n' +
  '  [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];\n' +
  '};\n' +
  '\n' +
  'function makeGetters<T extends object>(source: T): Getters<T> {\n' +
  '  const out: Record<string, () => unknown> = {};\n' +
  '  for (const key of Object.keys(source) as (keyof T & string)[]) {\n' +
  '    out[`get${key.charAt(0).toUpperCase()}${key.slice(1)}`] = () => source[key];\n' +
  '  }\n' +
  '  // Hai phép ép kiểu ở trên và dưới là chỗ duy nhất được phép: mapped type là\n' +
  '  // thứ chỉ tồn tại lúc biên dịch, còn vòng lặp này dựng object lúc chạy.\n' +
  '  return out as Getters<T>;\n' +
  '}\n';

const Q4_OUTPUT =
  'An\n' +
  '31\n' +
  'true\n' +
  'getName,getAge,getActive';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'interface Note {\n' +
  '  title: string;\n' +
  '  tags: string[];\n' +
  '  pinned: boolean;\n' +
  '}\n' +
  '\n' +
  'type Result<T> =\n' +
  '  | { ok: true; value: T }\n' +
  '  | { ok: false; errors: string[] };\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'function parseNote(input: unknown): Result<Note> {\n' +
  "  throw new Error('chưa cài đặt');\n" +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const inputs: unknown[] = [\n' +
  "  { title: '  Học TypeScript  ', tags: ['ts', 'học'], pinned: true },\n" +
  "  { title: '   ', tags: [], pinned: false },\n" +
  "  { title: 'Thiếu tags', tags: 'ts' },\n" +
  "  { title: 'Mặc định', tags: [] },\n" +
  "  { title: 42, tags: [1], pinned: 'yes' },\n" +
  '  null,\n' +
  '  [1, 2, 3],\n' +
  '];\n' +
  'for (const raw of inputs) {\n' +
  '  const parsed = parseNote(raw);\n' +
  "  if (parsed.ok) console.log(`ok \"${parsed.value.title}\" [${parsed.value.tags.join('/')}] pinned=${parsed.value.pinned}`);\n" +
  "  else console.log(`fail ${parsed.errors.join('+')}`);\n" +
  '}\n';

const Q5_SOLUTION =
  'function isRecord(input: unknown): input is Record<string, unknown> {\n' +
  "  // typeof null === 'object' và typeof [] === 'object' — cả hai đều phải rớt.\n" +
  "  return typeof input === 'object' && input !== null && !Array.isArray(input);\n" +
  '}\n' +
  '\n' +
  'function isStringArray(input: unknown): input is string[] {\n' +
  "  return Array.isArray(input) && input.every((item) => typeof item === 'string');\n" +
  '}\n' +
  '\n' +
  'function isValidTitle(input: unknown): input is string {\n' +
  "  return typeof input === 'string' && input.trim() !== '';\n" +
  '}\n' +
  '\n' +
  'function isValidPinned(input: unknown): input is boolean | undefined {\n' +
  "  return input === undefined || typeof input === 'boolean';\n" +
  '}\n' +
  '\n' +
  'function parseNote(input: unknown): Result<Note> {\n' +
  "  if (!isRecord(input)) return { ok: false, errors: ['not-an-object'] };\n" +
  '\n' +
  '  const { title, tags, pinned } = input;\n' +
  '  // Nhánh hợp lệ đi trước: bốn type predicate thu hẹp cả ba biến, nên object\n' +
  '  // dựng ở đây khớp Note mà không cần một phép ép kiểu nào.\n' +
  '  if (isValidTitle(title) && isStringArray(tags) && isValidPinned(pinned)) {\n' +
  '    return { ok: true, value: { title: title.trim(), tags, pinned: pinned === true } };\n' +
  '  }\n' +
  '\n' +
  '  const errors: string[] = [];\n' +
  "  if (!isValidTitle(title)) errors.push('title');\n" +
  "  if (!isStringArray(tags)) errors.push('tags');\n" +
  "  if (!isValidPinned(pinned)) errors.push('pinned');\n" +
  '  return { ok: false, errors };\n' +
  '}\n';

const Q5_OUTPUT =
  'ok "Học TypeScript" [ts/học] pinned=true\n' +
  'fail title\n' +
  'fail tags\n' +
  'ok "Mặc định" [] pinned=false\n' +
  'fail title+tags+pinned\n' +
  'fail not-an-object\n' +
  'fail not-an-object';

export default {
  course: { slug: 'typescript' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the types, not just the code',
        'Thi thực hành — viết kiểu, chứ không chỉ viết mã',
      ),
      description: B(
        'Five coding questions in TypeScript, submitted as a .zip. Narrowing a union, a discriminated union with an exhaustive switch, a generic class with a keyof constraint, a mapped type with template literal keys, and validating unknown input at the boundary — chapters 2, 5, 6, 7, 8, 13, 14 and 16.',
        'Năm câu lập trình bằng TypeScript, nộp dưới dạng .zip. Thu hẹp một union, discriminated union với switch đầy đủ, class generic có ràng buộc keyof, mapped type với khoá kiểu chuỗi mẫu, và validate dữ liệu unknown tại biên — các chương 2, 5, 6, 7, 8, 13, 14 và 16.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 2 + 5 ───────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'typescript',
          prompt: B(
            '<p><b>Q1 — Narrow the union, do not guess (chapters 2 and 5).</b> Implement <code>describe(value: Setting)</code>, where ' + c('Setting = string | number | boolean | null') + '. It returns:</p>' +
            '<ul>' +
            '<li><code>empty</code> when the value is <code>null</code>;</li>' +
            '<li><code>str:&lt;length&gt;</code> for a string — the LENGTH of the string, not the string;</li>' +
            '<li><code>num:&lt;value&gt;</code> for a number;</li>' +
            '<li><code>bool:on</code> for <code>true</code> and <code>bool:off</code> for <code>false</code>.</li>' +
            '</ul>' +
            '<p>Three of the seven test values are <b>falsy but perfectly valid</b>: the empty string, <code>0</code> and <code>false</code>. A single <code>if (!value) return \'empty\'</code> gets three lines wrong at once — that is the whole point of the question.</p>' +
            '<p>Narrow with <code>typeof</code> and an explicit <code>=== null</code>. No <code>any</code>, no <code>as</code>: once the first three branches have returned, the compiler already knows the value is a <code>boolean</code>, and the last <code>return</code> needs no check at all.</p>',

            '<p><b>Câu 1 — Thu hẹp union, đừng đoán (chương 2 và 5).</b> Cài đặt <code>describe(value: Setting)</code>, với ' + c('Setting = string | number | boolean | null') + '. Hàm trả về:</p>' +
            '<ul>' +
            '<li><code>empty</code> khi giá trị là <code>null</code>;</li>' +
            '<li><code>str:&lt;độ dài&gt;</code> với chuỗi — ĐỘ DÀI của chuỗi, không phải chính chuỗi;</li>' +
            '<li><code>num:&lt;giá trị&gt;</code> với số;</li>' +
            '<li><code>bool:on</code> cho <code>true</code> và <code>bool:off</code> cho <code>false</code>.</li>' +
            '</ul>' +
            '<p>Ba trong bảy giá trị thử là <b>falsy nhưng hoàn toàn hợp lệ</b>: chuỗi rỗng, <code>0</code> và <code>false</code>. Một dòng <code>if (!value) return \'empty\'</code> làm sai luôn ba dòng cùng lúc — và đó chính là điều câu này muốn hỏi.</p>' +
            '<p>Hãy thu hẹp bằng <code>typeof</code> và một phép so sánh <code>=== null</code> tường minh. Không <code>any</code>, không <code>as</code>: sau khi ba nhánh đầu đã return, trình biên dịch tự biết giá trị còn lại là <code>boolean</code>, nên <code>return</code> cuối không cần kiểm gì nữa.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['narrowing',
              'Narrows with <code>typeof</code> and an explicit <code>=== null</code>; no <code>any</code>, no <code>as</code>, and the final boolean branch relies on the compiler having eliminated the other members.',
              'Thu hẹp bằng <code>typeof</code> và một phép <code>=== null</code> tường minh; không <code>any</code>, không <code>as</code>, và nhánh boolean cuối dựa vào việc trình biên dịch đã loại hết các thành viên còn lại.',
              0.6],
            ['falsy',
              'Handles the three falsy-but-valid values correctly: <code>\'\'</code> gives <code>str:0</code>, <code>0</code> gives <code>num:0</code>, <code>false</code> gives <code>bool:off</code> — none of them fall into the null branch.',
              'Xử lý đúng ba giá trị falsy nhưng hợp lệ: <code>\'\'</code> ra <code>str:0</code>, <code>0</code> ra <code>num:0</code>, <code>false</code> ra <code>bool:off</code> — không cái nào rơi vào nhánh null.',
              0.5],
            ['output',
              'Compiles clean under <code>tsc --strict</code> and prints the seven lines exactly as specified, in order.',
              'Biên dịch sạch dưới <code>tsc --strict</code> và in đúng bảy dòng theo đúng khuôn, đúng thứ tự.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 5.3 + 5.4 ───────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'typescript',
          prompt: B(
            '<p><b>Q2 — A discriminated union that stays exhaustive (chapter 5).</b> <code>UiEvent</code> has three variants discriminated by <code>kind</code>. Implement <code>render(event: UiEvent)</code> with a <code>switch</code> on <code>event.kind</code>:</p>' +
            '<ul>' +
            '<li><code>click</code> → <code>click(&lt;x&gt;,&lt;y&gt;)</code> — no space after the comma;</li>' +
            '<li><code>key</code> → <code>key:&lt;key&gt;+shift</code> when <code>shift</code> is true, otherwise <code>key:&lt;key&gt;</code>;</li>' +
            '<li><code>scroll</code> → <code>scroll:none</code> when <code>dy</code> is 0, <code>scroll:down &lt;dy&gt;</code> when positive, and <code>scroll:up &lt;dy without the minus sign&gt;</code> when negative.</li>' +
            '</ul>' +
            '<p>The <code>default</code> branch must call the given <code>assertNever(event)</code>. That call only compiles while every variant has been handled, because <code>event</code> is narrowed to <code>never</code> there — so the day someone adds a fourth variant to <code>UiEvent</code>, the compiler points at this file instead of a user reporting a blank screen. Reaching a property that does not belong to the narrowed variant (say <code>event.x</code> inside the <code>key</code> case) is an error, not a runtime <code>undefined</code>.</p>',

            '<p><b>Câu 2 — Discriminated union và giữ cho nó luôn đầy đủ (chương 5).</b> <code>UiEvent</code> có ba biến thể, phân biệt bằng trường <code>kind</code>. Cài đặt <code>render(event: UiEvent)</code> bằng một <code>switch</code> trên <code>event.kind</code>:</p>' +
            '<ul>' +
            '<li><code>click</code> → <code>click(&lt;x&gt;,&lt;y&gt;)</code> — không có dấu cách sau dấu phẩy;</li>' +
            '<li><code>key</code> → <code>key:&lt;key&gt;+shift</code> khi <code>shift</code> là true, còn lại là <code>key:&lt;key&gt;</code>;</li>' +
            '<li><code>scroll</code> → <code>scroll:none</code> khi <code>dy</code> bằng 0, <code>scroll:down &lt;dy&gt;</code> khi dương, và <code>scroll:up &lt;dy đã bỏ dấu trừ&gt;</code> khi âm.</li>' +
            '</ul>' +
            '<p>Nhánh <code>default</code> bắt buộc phải gọi hàm <code>assertNever(event)</code> cho sẵn. Lời gọi đó chỉ biên dịch được chừng nào mọi biến thể đã được xử lý, vì ở chỗ ấy <code>event</code> đã bị thu hẹp thành <code>never</code> — nên hôm nào có người thêm biến thể thứ tư vào <code>UiEvent</code>, trình biên dịch chỉ thẳng vào file này thay vì để người dùng báo màn hình trắng. Chạm vào một thuộc tính không thuộc biến thể đang xét (ví dụ <code>event.x</code> trong nhánh <code>key</code>) là lỗi biên dịch, chứ không phải một giá trị <code>undefined</code> lúc chạy.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['discriminant',
              'Switches on the <code>kind</code> discriminant and reads only the fields that belong to the narrowed variant — no optional chaining or casting to reach <code>x</code>, <code>key</code> or <code>dy</code>.',
              'Dùng <code>switch</code> trên trường phân biệt <code>kind</code> và chỉ đọc những trường thuộc về biến thể đã thu hẹp — không dùng optional chaining hay ép kiểu để với tới <code>x</code>, <code>key</code> hay <code>dy</code>.',
              0.5],
            ['formatting',
              'All six lines are formatted exactly as specified, including the three scroll cases: positive, negative (minus sign dropped) and zero.',
              'Cả sáu dòng đúng khuôn như đề, kể cả ba ca scroll: dương, âm (bỏ dấu trừ) và bằng không.',
              0.5],
            ['exhaustive',
              'The <code>default</code> branch calls the given <code>assertNever</code>, so the exhaustiveness is checked by the compiler rather than by a comment.',
              'Nhánh <code>default</code> gọi hàm <code>assertNever</code> cho sẵn, để tính đầy đủ được chính trình biên dịch kiểm chứ không phải một dòng chú thích.',
              0.5],
          ]),
        }),

        /* ── Q3 · chương 6 + 8 + 14 ──────────────────────────────── */
        codeQ({
          points: 2,
          language: 'typescript',
          prompt: B(
            '<p><b>Q3 — A generic repository (chapters 6, 8 and 14).</b> Fill in the four methods of ' + c('class Repository<T extends { id: number }>') + '. The constraint is what lets the class look up <code>item.id</code> without knowing anything else about <code>T</code>.</p>' +
            '<ul>' +
            '<li><code>add(item: T): T</code> — stores the item in the private array and returns it.</li>' +
            '<li>' + c('get(id: number): T | undefined') + ' — returns the matching item, or <code>undefined</code>. Return the <code>undefined</code> honestly; a <code>!</code> here is exactly the bug the type was trying to prevent.</li>' +
            '<li>' + c("update(id: number, patch: Partial<Omit<T, 'id'>>): T | undefined") + ' — merges the patch into the stored item and returns it, or <code>undefined</code> when no such id exists. The parameter type is the interesting part: <code>Partial</code> makes every field optional, <code>Omit</code> makes <code>id</code> unpatchable.</li>' +
            '<li>' + c('findBy<K extends keyof T>(key: K, value: T[K]): T[]') + ' — returns every item whose <code>key</code> equals <code>value</code>. Because the value is typed ' + c('T[K]') + ', calling ' + c("findBy('role', 'nope')") + ' is a compile error rather than a silently empty array.</li>' +
            '</ul>' +
            '<p>The given block prints six lines. Note the third and fifth: the update happens before the <code>findBy</code>, so the renamed user must appear with the new name.</p>',

            '<p><b>Câu 3 — Một repository generic (chương 6, 8 và 14).</b> Điền bốn phương thức của ' + c('class Repository<T extends { id: number }>') + '. Chính ràng buộc đó cho phép class đọc <code>item.id</code> mà không cần biết gì thêm về <code>T</code>.</p>' +
            '<ul>' +
            '<li><code>add(item: T): T</code> — cất phần tử vào mảng private rồi trả lại nó.</li>' +
            '<li>' + c('get(id: number): T | undefined') + ' — trả về phần tử khớp, hoặc <code>undefined</code>. Hãy trả <code>undefined</code> một cách thành thật; một dấu <code>!</code> ở đây đúng là con bug mà kiểu này đang cố ngăn.</li>' +
            '<li>' + c("update(id: number, patch: Partial<Omit<T, 'id'>>): T | undefined") + ' — trộn patch vào phần tử đã lưu rồi trả về nó, hoặc <code>undefined</code> khi không có id đó. Kiểu của tham số mới là chỗ đáng chú ý: <code>Partial</code> làm mọi trường thành optional, <code>Omit</code> khiến <code>id</code> không sửa được.</li>' +
            '<li>' + c('findBy<K extends keyof T>(key: K, value: T[K]): T[]') + ' — trả về mọi phần tử có <code>key</code> bằng <code>value</code>. Vì giá trị được gõ kiểu ' + c('T[K]') + ', gọi ' + c("findBy('role', 'nope')") + ' là lỗi biên dịch, chứ không phải một mảng rỗng im lặng.</li>' +
            '</ul>' +
            '<p>Khối cho sẵn in ra sáu dòng. Chú ý dòng thứ ba và thứ năm: phép update xảy ra TRƯỚC <code>findBy</code>, nên người vừa đổi tên phải hiện ra với tên mới.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['generic',
              'The class body actually uses the constraint ' + c('T extends { id: number }') + ' to compare ids, and stores items in the private field instead of a module-level array.',
              'Thân class thật sự dùng ràng buộc ' + c('T extends { id: number }') + ' để so id, và cất phần tử vào trường private chứ không phải một mảng ở cấp module.',
              0.5],
            ['optional',
              'Both <code>get</code> and <code>update</code> return ' + c('T | undefined') + ' honestly — no non-null assertion <code>!</code>, no cast, and the missing-id case reaches the printing loop as <code>none</code>.',
              'Cả <code>get</code> lẫn <code>update</code> trả về ' + c('T | undefined') + ' một cách thành thật — không dấu <code>!</code>, không ép kiểu, và ca không tìm thấy id đi tới vòng in ra thành <code>none</code>.',
              0.5],
            ['patch',
              'The patch parameter keeps the given type ' + c("Partial<Omit<T, 'id'>>") + ' and the merge updates the stored object so later reads see the new value.',
              'Tham số patch giữ nguyên kiểu ' + c("Partial<Omit<T, 'id'>>") + ' cho sẵn, và phép trộn cập nhật đúng object đã lưu để những lần đọc sau thấy giá trị mới.',
              0.5],
            ['keyof',
              '<code>findBy</code> keeps its own type parameter ' + c('K extends keyof T') + ' with the value typed ' + c('T[K]') + ', so key and value stay related instead of both becoming <code>string</code>.',
              '<code>findBy</code> giữ tham số kiểu riêng ' + c('K extends keyof T') + ' và giá trị gõ kiểu ' + c('T[K]') + ', nhờ đó khoá và giá trị vẫn ràng buộc với nhau thay vì cùng tụt xuống <code>string</code>.',
              0.5],
          ]),
        }),

        /* ── Q4 · chương 7 ───────────────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'typescript',
          prompt: B(
            '<p><b>Q4 — Build a type, then build the object that fits it (chapter 7).</b> Write the mapped type <code>Getters&lt;T&gt;</code> and the function <code>makeGetters</code> so that ' + c('makeGetters({ name: string; age: number; active: boolean })') + ' returns an object with <code>getName()</code>, <code>getAge()</code> and <code>getActive()</code>.</p>' +
            '<ul>' +
            '<li>The <b>keys</b> come from remapping: for every ' + c('K in keyof T & string') + ', the new key is ' + c('`get${Capitalize<K>}`') + '. The ' + c('& string') + ' matters — <code>keyof T</code> can include <code>number</code> and <code>symbol</code>, which a template literal type cannot capitalize.</li>' +
            '<li>The <b>value</b> of each key is ' + c('() => T[K]') + ' — a function returning that property\'s own type, not <code>unknown</code> and not <code>any</code>.</li>' +
            '<li><code>makeGetters</code> walks <code>Object.keys(source)</code>, upper-cases the first letter and stores a closure that reads the property when called.</li>' +
            '</ul>' +
            '<p>The starter ships a placeholder ' + c('type Getters<T> = Record<string, () => any>') + ' purely so the file compiles before you start. Replacing it is the main part of the question.</p>' +
            '<p>Two type assertions are expected and allowed inside <code>makeGetters</code> — one on <code>Object.keys</code>, which is typed <code>string[]</code>, and one on the returned object — because a mapped type exists only at compile time while the loop builds a real object at runtime. Everything outside the function body must be assertion-free: the three lines <code>const nameIsString: string = g.getName()</code> and friends in the given block are the proof, and they only compile when your mapped type carries the per-property types through.</p>',

            '<p><b>Câu 4 — Dựng một kiểu, rồi dựng object khớp với nó (chương 7).</b> Viết mapped type <code>Getters&lt;T&gt;</code> và hàm <code>makeGetters</code> sao cho ' + c('makeGetters({ name: string; age: number; active: boolean })') + ' trả về một object có <code>getName()</code>, <code>getAge()</code> và <code>getActive()</code>.</p>' +
            '<ul>' +
            '<li><b>Khoá</b> sinh ra bằng phép đổi tên khoá: với mỗi ' + c('K in keyof T & string') + ', khoá mới là ' + c('`get${Capitalize<K>}`') + '. Chỗ ' + c('& string') + ' là quan trọng — <code>keyof T</code> có thể chứa cả <code>number</code> và <code>symbol</code>, mà kiểu chuỗi mẫu thì không viết hoa được hai thứ đó.</li>' +
            '<li><b>Giá trị</b> của mỗi khoá là ' + c('() => T[K]') + ' — một hàm trả về đúng kiểu của thuộc tính đó, không phải <code>unknown</code> và càng không phải <code>any</code>.</li>' +
            '<li><code>makeGetters</code> duyệt <code>Object.keys(source)</code>, viết hoa chữ cái đầu và cất một closure đọc thuộc tính khi được gọi.</li>' +
            '</ul>' +
            '<p>Khung đề cho sẵn một kiểu tạm ' + c('type Getters<T> = Record<string, () => any>') + ' chỉ để file biên dịch được ngay từ đầu. Thay nó đi chính là phần chính của câu hỏi.</p>' +
            '<p>Hai phép ép kiểu bên trong <code>makeGetters</code> là được phép và nằm trong dự tính — một ở <code>Object.keys</code> (vốn được gõ kiểu <code>string[]</code>) và một ở object trả về — bởi mapped type chỉ tồn tại lúc biên dịch, còn vòng lặp thì dựng object thật lúc chạy. Mọi chỗ ngoài thân hàm phải sạch ép kiểu: ba dòng <code>const nameIsString: string = g.getName()</code> và hai dòng anh em của nó trong khối cho sẵn chính là bằng chứng, và chúng chỉ biên dịch được khi mapped type của bạn mang được kiểu của từng thuộc tính đi qua.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['mapped',
              'Uses a mapped type with key remapping — ' + c('[K in keyof T & string as `get${Capitalize<K>}`]') + ' — rather than three hand-written properties or a <code>Record</code>.',
              'Dùng mapped type có đổi tên khoá — ' + c('[K in keyof T & string as `get${Capitalize<K>}`]') + ' — chứ không phải ba thuộc tính chép tay hay một <code>Record</code>.',
              1.0],
            ['valuetype',
              'Each getter is typed ' + c('() => T[K]') + ', so the three typed constants in the given block compile with no cast and no <code>any</code> leaking out of the function.',
              'Mỗi getter được gõ kiểu ' + c('() => T[K]') + ', nhờ đó ba hằng có kiểu trong khối cho sẵn biên dịch được mà không cần ép kiểu, và không có <code>any</code> nào rò ra ngoài hàm.',
              0.6],
            ['runtime',
              'The runtime object is right: keys <code>getName</code>, <code>getAge</code>, <code>getActive</code> in insertion order, each returning the current value of its property.',
              'Object lúc chạy đúng: các khoá <code>getName</code>, <code>getAge</code>, <code>getActive</code> theo thứ tự chèn, mỗi cái trả về giá trị hiện tại của thuộc tính tương ứng.',
              0.6],
            ['assertions',
              'At most the two expected assertions inside <code>makeGetters</code>; the placeholder <code>Record&lt;string, () =&gt; any&gt;</code> is gone and no <code>any</code> remains in the signature.',
              'Nhiều nhất là hai phép ép kiểu đã dự tính bên trong <code>makeGetters</code>; kiểu tạm <code>Record&lt;string, () =&gt; any&gt;</code> đã bị thay, và trong chữ ký hàm không còn <code>any</code> nào.',
              0.3],
          ]),
        }),

        /* ── Q5 · chương 2.3 + 5 + 13 + 16 ───────────────────────── */
        codeQ({
          points: 2.5,
          language: 'typescript',
          prompt: B(
            '<p><b>Q5 — Validate at the boundary (chapters 13 and 16).</b> Data arriving from a request body is <code>unknown</code>, and chapter 13\'s rule is: check it once at the edge, then trust it inside. Implement ' + c('parseNote(input: unknown): Result<Note>') + ' by hand — no Zod, no npm.</p>' +
            '<ul>' +
            '<li>If <code>input</code> is not a plain object, return ' + c("{ ok: false, errors: ['not-an-object'] }") + '. Careful: ' + c("typeof null === 'object'") + ' and an array is an object too — both of the last two test values must land here.</li>' +
            '<li><code>title</code> must be a string that is not empty after <code>trim()</code>; otherwise push <code>title</code>.</li>' +
            '<li><code>tags</code> must be an array in which <b>every</b> element is a string; otherwise push <code>tags</code>. An empty array is valid.</li>' +
            '<li><code>pinned</code> is optional: missing is fine and defaults to <code>false</code>, but a present non-boolean pushes <code>pinned</code>.</li>' +
            '<li>Collect <b>all</b> the field errors before returning, in the order <code>title</code>, <code>tags</code>, <code>pinned</code> — one test value fails all three at once.</li>' +
            '<li>On success return ' + c('{ ok: true, value }') + ' where <code>title</code> is trimmed and <code>pinned</code> is a real boolean.</li>' +
            '</ul>' +
            '<p>Do it with <b>type predicates</b> (' + c('function isStringArray(x: unknown): x is string[]') + ') rather than assertions. That is the difference this question is about: an <code>as Note</code> compiles and lies, whereas a predicate makes the compiler agree with a check you actually performed. The given loop then narrows on <code>parsed.ok</code>, so a correct <code>Result</code> gives you <code>value</code> on one branch and <code>errors</code> on the other with no extra work.</p>',

            '<p><b>Câu 5 — Validate tại biên (chương 13 và 16).</b> Dữ liệu đến từ thân request có kiểu <code>unknown</code>, và luật của chương 13 là: kiểm một lần ở biên, rồi tin phần bên trong. Hãy tự cài ' + c('parseNote(input: unknown): Result<Note>') + ' — không Zod, không npm.</p>' +
            '<ul>' +
            '<li>Nếu <code>input</code> không phải object thường thì trả về ' + c("{ ok: false, errors: ['not-an-object'] }") + '. Cẩn thận: ' + c("typeof null === 'object'") + ' và mảng cũng là object — cả hai giá trị thử cuối cùng đều phải rơi vào đây.</li>' +
            '<li><code>title</code> phải là chuỗi và không rỗng sau <code>trim()</code>; nếu không thì thêm lỗi <code>title</code>.</li>' +
            '<li><code>tags</code> phải là mảng mà <b>mọi</b> phần tử đều là chuỗi; nếu không thì thêm lỗi <code>tags</code>. Mảng rỗng là hợp lệ.</li>' +
            '<li><code>pinned</code> là tuỳ chọn: thiếu thì không sao và mặc định <code>false</code>, nhưng có mặt mà không phải boolean thì thêm lỗi <code>pinned</code>.</li>' +
            '<li>Gom <b>đủ</b> mọi lỗi trường rồi mới trả về, theo thứ tự <code>title</code>, <code>tags</code>, <code>pinned</code> — có một giá trị thử sai cả ba cùng lúc.</li>' +
            '<li>Khi hợp lệ thì trả ' + c('{ ok: true, value }') + ' với <code>title</code> đã trim và <code>pinned</code> là boolean thật.</li>' +
            '</ul>' +
            '<p>Hãy làm bằng <b>type predicate</b> (' + c('function isStringArray(x: unknown): x is string[]') + ') thay vì ép kiểu. Đó chính là điều câu này muốn hỏi: một chữ <code>as Note</code> thì biên dịch được nhưng nói dối, còn một predicate khiến trình biên dịch đồng ý với phép kiểm mà bạn thật sự đã làm. Vòng lặp cho sẵn sau đó thu hẹp theo <code>parsed.ok</code>, nên một <code>Result</code> đúng sẽ cho bạn <code>value</code> ở một nhánh và <code>errors</code> ở nhánh kia mà không phải làm gì thêm.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['predicates',
              'Validation goes through type predicates (<code>x is string[]</code>, <code>x is Record&lt;string, unknown&gt;</code>) so the happy path builds a <code>Note</code> with no <code>as</code> and no <code>any</code>.',
              'Phép kiểm đi qua các type predicate (<code>x is string[]</code>, <code>x is Record&lt;string, unknown&gt;</code>), nhờ đó nhánh hợp lệ dựng ra một <code>Note</code> mà không cần <code>as</code> và không có <code>any</code>.',
              0.7],
            ['allerrors',
              'All failing fields are collected, in the order title, tags, pinned — the fifth test value must print all three joined, not just the first one found.',
              'Gom đủ mọi trường sai, theo thứ tự title, tags, pinned — giá trị thử thứ năm phải in ra cả ba nối lại, không phải chỉ cái sai đầu tiên.',
              0.6],
            ['notobject',
              'The not-an-object case rejects both <code>null</code> and an array, and returns that single error instead of three field errors.',
              'Ca không-phải-object loại được cả <code>null</code> lẫn mảng, và trả về đúng một lỗi đó thay vì ba lỗi trường.',
              0.6],
            ['shape',
              'The success branch returns a well-formed <code>Result</code>: title trimmed, tags carried through, and a missing <code>pinned</code> defaulting to <code>false</code>.',
              'Nhánh thành công trả về một <code>Result</code> đúng dáng: title đã trim, tags giữ nguyên, và <code>pinned</code> thiếu thì mặc định <code>false</code>.',
              0.6],
          ]),
        }),
      ],
    },
  ],
};
