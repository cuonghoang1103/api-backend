/**
 * Dựng `content/quy-trinh/client-project-template.json` — mẫu dự án "Dự án
 * khách hàng" cho CT Work (gói BE đọc file JSON này lúc chạy).
 *
 *   npx tsx content/quy-trinh/dung-mau-du-an.mts          # dựng lại JSON
 *   npx tsx content/quy-trinh/dung-mau-du-an.mts --check  # chỉ kiểm, báo lệch nếu JSON cũ
 *
 * Nguồn:
 *   · giai đoạn  ← frontend/src/app/about/quy-trinh/data.ts (STAGES, DEPT_*)
 *   · việc       ← content/quy-trinh/viec-theo-giai-doan.mjs
 * Việc "Cổng chất lượng" cuối mỗi giai đoạn được SINH: checklist = exitCriteria.
 *
 * Kết quả xác định (không có timestamp) — dựng hai lần ra cùng một file, nên
 * `git diff` chỉ hiện thay đổi thật.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPT_KEYS, DEPT_NAMES, PHASES, STAGES, type DeptKey } from '../../frontend/src/app/about/quy-trinh/data';
import TASKS from './viec-theo-giai-doan.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'client-project-template.json');
const SITE = 'https://cuongthai.com';

const errs: string[] = [];
const isRole = (k: string): k is DeptKey => (DEPT_KEYS as readonly string[]).includes(k);

// ── Kiểm đồng bộ slug hai chiều ──
const slugs = new Set(STAGES.map((s) => s.slug));
for (const s of STAGES) if (!TASKS[s.slug]) errs.push(`viec-theo-giai-doan.mjs thiếu giai đoạn "${s.slug}"`);
for (const k of Object.keys(TASKS)) if (!slugs.has(k)) errs.push(`viec-theo-giai-doan.mjs có slug lạ "${k}" (không có trong data.ts)`);

const pad = (n: number) => String(n).padStart(2, '0');

const stages = STAGES.map((s) => {
  const src = TASKS[s.slug] ?? { gateRole: 'pm', tasks: [] };
  const phase = PHASES.find((p) => p.key === s.phase)!;

  if (!isRole(src.gateRole)) errs.push(`${s.slug}: gateRole "${src.gateRole}" không hợp lệ`);
  if (src.tasks.length < 2 || src.tasks.length > 7) errs.push(`${s.slug}: cần 2–7 việc thường (đang ${src.tasks.length})`);
  for (const t of src.tasks) {
    if (!isRole(t.role)) errs.push(`${s.slug} · "${t.summary}": role "${t.role}" không hợp lệ`);
    if (!Array.isArray(t.checklist) || t.checklist.length < 3) errs.push(`${s.slug} · "${t.summary}": checklist < 3 mục`);
    if (t.summary.length > 255) errs.push(`${s.slug} · "${t.summary.slice(0, 40)}…": summary > 255 ký tự`);
  }
  const exit = (s.exitCriteria ?? []).map((b) => b[0]);
  if (exit.length < 3) errs.push(`${s.slug}: exitCriteria < 3 mục (checklist của cổng chất lượng)`);

  const lines: string[] = [];
  lines.push(`**Mục tiêu:** ${s.goal[0]}`, '');
  lines.push(`Nhóm: ${phase.label[0]} (${phase.label[1]}) · Giai đoạn ${pad(s.n)}/${pad(STAGES.length - 1)} · ${s.title[1]}`, '');
  const sec = (title: string, items?: readonly (readonly [string, string])[]) => {
    if (!items?.length) return;
    lines.push(`### ${title}`, ...items.map((b) => `- ${b[0]}`), '');
  };
  sec('Đầu vào', s.inputs);
  sec('Điều kiện vào (entry criteria)', s.entryCriteria);
  sec('Đầu ra bàn giao', s.deliverables);
  sec('Khách hàng tham gia', s.client);
  if (s.team?.length) {
    lines.push('### Bộ phận tham gia', ...s.team.map((t) => `- \`vai:${t.dept}\` ${DEPT_NAMES[t.dept][0]} — ${t.role[0]}`), '');
  }
  if (s.templates?.length) {
    lines.push('### Mẫu tài liệu', ...s.templates.map((d) => `- [${d.name[0]}](${SITE}${d.href})`), '');
  }
  if (s.standards.length) {
    lines.push('### Tiêu chuẩn tham chiếu', ...s.standards.map((x) => `- ${x.name} — ${x.note[0]}`), '');
  }
  if (s.learn.length) {
    lines.push('### Học thêm', ...s.learn.map((l) => `- [${l.label}](${SITE}${l.href})`), '');
  }
  sec('Sai lầm hay gặp', s.pitfalls);
  lines.push(`Quy trình đầy đủ: ${SITE}/about/quy-trinh`);

  return {
    slug: s.slug,
    n: s.n,
    phase: s.phase,
    title: s.title[0],
    titleEn: s.title[1],
    epic: {
      summary: `GĐ ${pad(s.n)} · ${s.title[0]}`,
      description: lines.join('\n'),
    },
    tasks: [
      ...src.tasks.map((t) => ({ summary: t.summary, role: t.role, checklist: t.checklist })),
      {
        summary: `Cổng chất lượng — ${s.title[0]}`,
        role: src.gateRole,
        checklist: exit,
        gate: true,
      },
    ],
  };
});

const template = {
  version: '2.0',
  name: 'Dự án khách hàng',
  description:
    'Mẫu dự án theo quy trình nhận & làm dự án của cuongthai.com: mỗi giai đoạn một epic, việc gắn nhãn vai `vai:<key>`, việc cuối mỗi giai đoạn là cổng chất lượng (gate) với checklist = điều kiện ra.',
  source: {
    stages: 'frontend/src/app/about/quy-trinh/data.ts',
    tasks: 'content/quy-trinh/viec-theo-giai-doan.mjs',
    build: 'npx tsx content/quy-trinh/dung-mau-du-an.mts',
  },
  labelPrefix: 'vai:',
  roles: DEPT_KEYS.map((k) => ({ key: k, name: DEPT_NAMES[k][0], nameEn: DEPT_NAMES[k][1] })),
  stages,
};

if (errs.length) {
  console.error(`✗ ${errs.length} lỗi:\n  - ${errs.join('\n  - ')}`);
  process.exit(1);
}

const json = JSON.stringify(template, null, 2) + '\n';
const nTasks = stages.reduce((a, s) => a + s.tasks.length, 0);
const nGates = stages.reduce((a, s) => a + s.tasks.filter((t) => 'gate' in t && t.gate).length, 0);
const summary = `${stages.length} giai đoạn (epic) · ${nTasks} việc (${nGates} cổng) · ${template.roles.length} vai`;

if (process.argv.includes('--check')) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (cur !== json) {
    console.error(`✗ ${OUT} đã cũ so với data.ts / viec-theo-giai-doan.mjs — chạy lại không có --check`);
    process.exit(1);
  }
  console.log(`✓ JSON khớp nguồn — ${summary}`);
} else {
  writeFileSync(OUT, json);
  console.log(`✓ Đã ghi ${OUT} — ${summary}`);
}
