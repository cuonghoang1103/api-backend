/**
 * Kiểm dữ liệu trang /about/quy-trinh (bản 2) — chạy:
 *   npx tsx content/quy-trinh/kiem-tra.mts
 *
 * Kiểm: 21 giai đoạn đánh số liền, 15 slug cũ còn nguyên, mỗi giai đoạn đủ
 * trường bản 2, RACI mỗi dòng đúng MỘT A, mọi href mẫu tài liệu có trên đĩa
 * (và không có mẫu mồ côi), mọi link học trỏ slug có thật, bộ phận + luồng
 * chuyển giao hợp lệ, JSON mẫu dự án hợp lệ và khớp data.ts.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CROSS_CUTTING,
  DEPT_KEYS,
  DOCS,
  LEARN,
  PRODUCT_TYPES,
  STAGES,
  type LearnLink,
} from '../../frontend/src/app/about/quy-trinh/data';
import { DEPARTMENTS, raciOverview } from '../../frontend/src/app/about/quy-trinh/departments';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const errs: string[] = [];
const ok: string[] = [];
const fail = (m: string) => errs.push(m);

// 1. Đánh số & slug cũ
const OLD = ['tiep-nhan', 'khao-sat', 'de-xuat', 'dac-ta-yeu-cau', 'thiet-ke-ux-ui', 'kien-truc', 'lap-ke-hoach', 'phat-trien',
  'kiem-thu', 'bao-mat', 'ha-tang-devops', 'uat-nghiem-thu', 'trien-khai-ban-giao', 'bao-hanh-bao-tri', 'cai-tien'];
STAGES.forEach((s, i) => s.n !== i && fail(`giai đoạn ${s.slug}: n=${s.n} ≠ vị trí ${i}`));
for (const o of OLD) if (!STAGES.some((s) => s.slug === o)) fail(`mất slug cũ đã công bố "${o}"`);
if (new Set(STAGES.map((s) => s.slug)).size !== STAGES.length) fail('slug trùng');
ok.push(`${STAGES.length} giai đoạn, n liền 0…${STAGES.length - 1}, đủ 15 slug cũ`);

// 2. Trường bản 2 đủ
const V2 = ['team', 'departments', 'raci', 'inputs', 'entryCriteria', 'exitCriteria', 'checklist', 'templates', 'pitfalls'] as const;
for (const s of STAGES) {
  for (const f of V2) if (!(s[f] as unknown[] | undefined)?.length) fail(`${s.slug}: thiếu "${f}"`);
  if (!s.example) fail(`${s.slug}: thiếu "example"`);
}
ok.push('mọi giai đoạn đủ trường bản 2');

// 3. RACI
let raciRows = 0;
for (const s of STAGES) {
  for (const r of s.raci ?? []) {
    raciRows++;
    const vals = Object.entries(r.roles);
    const a = vals.filter(([, v]) => v === 'A').length;
    if (a !== 1) fail(`${s.slug} · RACI "${r.activity[0]}": ${a} A (phải đúng 1)`);
    for (const [k] of vals) if (!(DEPT_KEYS as readonly string[]).includes(k)) fail(`${s.slug} · RACI: bộ phận lạ "${k}"`);
  }
  for (const t of s.team ?? []) if (!(DEPT_KEYS as readonly string[]).includes(t.dept)) fail(`${s.slug} · team: bộ phận lạ "${t.dept}"`);
}
const ov = raciOverview();
if (ov.length !== STAGES.length) fail('raciOverview() sai số dòng');
ok.push(`${raciRows} dòng RACI, mỗi dòng đúng một A`);

// 4. Mẫu tài liệu
const MAU = join(ROOT, 'frontend/public/quy-trinh/mau');
const used = new Set<string>();
for (const d of Object.values(DOCS)) {
  if (!d.href) { fail(`mẫu "${d.name[0]}" thiếu href`); continue; }
  used.add(d.href);
  const p = join(ROOT, 'frontend/public', d.href);
  if (!existsSync(p)) fail(`mẫu không có trên đĩa: ${d.href}`);
}
for (const s of STAGES) for (const d of s.templates ?? []) if (d.href && !used.has(d.href)) fail(`${s.slug}: mẫu ngoài DOCS ${d.href}`);
const onDisk = readdirSync(MAU).filter((f) => f.endsWith('.md'));
for (const f of onDisk) if (!used.has(`/quy-trinh/mau/${f}`)) fail(`mẫu mồ côi (không giai đoạn nào dùng): ${f}`);
const unusedDocs = Object.entries(DOCS).filter(([, d]) => !STAGES.some((s) => s.templates?.includes(d)));
for (const [k] of unusedDocs) fail(`DOCS.${k} không gắn vào giai đoạn nào`);
ok.push(`${Object.keys(DOCS).length} mẫu tài liệu, đều có trên đĩa và được dùng`);

// 5. Link học
const academySlugs = new Set<string>();
for (const f of readdirSync(join(ROOT, 'content/academy')).filter((x) => x.endsWith('.mjs'))) {
  const src = readFileSync(join(ROOT, 'content/academy', f), 'utf8');
  const m = src.match(/course:\s*\{[\s\S]*?slug:\s*['"]([^'"]+)['"]/) ?? src.match(/slug:\s*['"]([^'"]+)['"]/);
  if (m) academySlugs.add(m[1]);
}
const allLinks: LearnLink[] = [
  ...Object.values(LEARN),
  ...STAGES.flatMap((s) => s.learn),
  ...PRODUCT_TYPES.flatMap((p) => p.learn),
  ...DEPARTMENTS.flatMap((d) => d.learn),
];
const seen = new Set<string>();
for (const l of allLinks) {
  if (seen.has(l.href)) continue;
  seen.add(l.href);
  const [, kind, slug] = l.href.match(/^\/(academy\/courses|courses)\/([^/]+)$/) ?? [];
  if (!slug) { fail(`link học sai dạng: ${l.href}`); continue; }
  if (kind === 'courses' && !existsSync(join(ROOT, 'content/courses', `${slug}.mjs`))) fail(`khoá không có: ${l.href}`);
  if (kind === 'academy/courses' && !academySlugs.has(slug)) fail(`môn không có: ${l.href}`);
  if ((kind === 'courses') !== (l.kind === 'course')) fail(`kind lệch: ${l.href}`);
}
ok.push(`${seen.size} link học, đều trỏ slug có thật`);

// 6. Bộ phận
const dk = DEPARTMENTS.map((d) => d.key);
if (dk.length !== DEPT_KEYS.length || DEPT_KEYS.some((k) => !dk.includes(k))) fail('DEPARTMENTS không khớp DEPT_KEYS');
for (const d of DEPARTMENTS) {
  for (const h of d.handoffs) {
    if (!(DEPT_KEYS as readonly string[]).includes(h.to)) fail(`${d.key}: chuyển giao tới bộ phận lạ "${h.to}"`);
    if (h.to === d.key) fail(`${d.key}: chuyển giao cho chính mình`);
  }
  if (!d.responsibilities.length || !d.outputs.length || !d.handoffs.length || !d.skills.length) fail(`${d.key}: thiếu nội dung`);
}
const inStages = new Set(STAGES.flatMap((s) => (s.raci ?? []).flatMap((r) => Object.keys(r.roles))));
for (const k of DEPT_KEYS) if (!inStages.has(k)) fail(`bộ phận "${k}" không xuất hiện trong RACI giai đoạn nào`);
ok.push(`${DEPARTMENTS.filter((d) => !d.external).length} bộ phận + khách hàng, luồng chuyển giao hợp lệ`);

// 7. Loại sản phẩm
for (const p of PRODUCT_TYPES) for (const n of p.heavy) if (!STAGES[n]) fail(`loại "${p.id}": giai đoạn ${n} không tồn tại`);
if (!CROSS_CUTTING.length) fail('CROSS_CUTTING rỗng');

// 8. JSON mẫu dự án
const JP = join(ROOT, 'content/quy-trinh/client-project-template.json');
try {
  const j = JSON.parse(readFileSync(JP, 'utf8'));
  const roleKeys = new Set(j.roles.map((r: { key: string }) => r.key));
  if (j.stages.length !== STAGES.length) fail(`JSON: ${j.stages.length} giai đoạn ≠ ${STAGES.length}`);
  for (const st of j.stages) {
    const s = STAGES.find((x) => x.slug === st.slug);
    if (!s) { fail(`JSON: slug "${st.slug}" không có trong data.ts`); continue; }
    if (s.n !== st.n) fail(`JSON: ${st.slug} n=${st.n} ≠ ${s.n}`);
    if (st.tasks.length < 3 || st.tasks.length > 8) fail(`JSON: ${st.slug} có ${st.tasks.length} việc (cần 3–8)`);
    const gates = st.tasks.filter((t: { gate?: boolean }) => t.gate);
    if (gates.length !== 1 || !st.tasks[st.tasks.length - 1].gate) fail(`JSON: ${st.slug} phải có đúng 1 cổng ở cuối`);
    for (const t of st.tasks) {
      if (!roleKeys.has(t.role)) fail(`JSON: ${st.slug} vai lạ "${t.role}"`);
      if (!Array.isArray(t.checklist) || t.checklist.length < 3) fail(`JSON: ${st.slug} · "${t.summary}" checklist < 3`);
    }
    const exit = (s.exitCriteria ?? []).map((b) => b[0]);
    if (JSON.stringify(gates[0]?.checklist) !== JSON.stringify(exit)) fail(`JSON: ${st.slug} checklist cổng ≠ exitCriteria`);
  }
  const nTasks = j.stages.reduce((a: number, s: { tasks: unknown[] }) => a + s.tasks.length, 0);
  ok.push(`JSON hợp lệ: ${j.stages.length} epic · ${nTasks} việc · ${j.roles.length} vai, khớp data.ts`);
} catch (e) {
  fail(`JSON không đọc được: ${(e as Error).message}`);
}

if (errs.length) {
  console.error(`✗ ${errs.length} lỗi:\n  - ${errs.join('\n  - ')}`);
  process.exit(1);
}
console.log(ok.map((m) => `✓ ${m}`).join('\n'));
