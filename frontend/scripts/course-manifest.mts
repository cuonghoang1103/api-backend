/**
 * Sinh mục lục nhẹ (manifest.ts) cho các khoá kiểu sách — Dekiru và IELTS.
 *
 * Vì sao: trang khoá từng import TĨNH toàn bộ nội dung (Dekiru ~4 MB JS một
 * cục). Giờ trang chỉ mang mục lục + tóm tắt từng buổi (tệp sinh ra ở đây),
 * còn nội dung một buổi tải khi mở (`loadBai` / `loadNgay`, mỗi buổi một chunk).
 *
 *   npm run course:manifest          # ghi lại manifest.ts (cũng chạy ở `prebuild`)
 *   npm run course:manifest:check    # KHÔNG ghi; lệch nội dung thì exit 1
 *
 * Chạy bằng Node thuần (tách kiểu TS, Node ≥ 22.6) để không cần thêm `tsx` vào
 * image frontend; `npx tsx scripts/course-manifest.mts` cũng chạy được. Nhờ
 * vậy các tệp nội dung chỉ được có `import type` — đúng như hiện nay.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Lesson = { id: string; kind: string; title: string; goal: string; minutes: number; blocks?: unknown[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = join(ROOT, 'src/app/language/[code]');
const load = (p: string) => import(pathToFileURL(p).href);

const { dayMeta } = await load(join(ROOT, 'src/components/sach-hoc/manifest.ts'));

/** Số N của các tệp `<prefix>N.ts` trong thư mục, tăng dần. */
const numbered = (dir: string, prefix: string) =>
  readdirSync(dir)
    .map((f) => new RegExp(`^${prefix}(\\d+)\\.ts$`).exec(f)?.[1])
    .filter((x): x is string => !!x)
    .map(Number)
    .sort((a, b) => a - b);

type Spec = {
  name: string;
  dir: string;
  /** Tệp bộ nạp — phải có `import('./<prefix>N')` cho MỌI N trong manifest. */
  loader: string;
  prefix: string;
  /** Nội dung đầy đủ theo số tệp — PHẢI khớp với những gì bộ nạp trả về. */
  written: () => Promise<Record<number, Lesson[]>>;
};

const SPECS: Spec[] = [
  {
    name: 'Dekiru',
    dir: join(LANG, 'dekiru/bai'),
    loader: 'index.ts',
    prefix: 'bai',
    // Cùng luật với loadBai (bai/index.ts): các bài soạn + mục 📖 Theo sách ở cuối + Chữ Hán của lớp.
    written: async () => {
      const dir = join(LANG, 'dekiru/bai');
      const sach: Record<number, Lesson> = {
        ...(await load(join(dir, 'sach.ts'))).SACH,
        ...(await load(join(dir, 'sach2.ts'))).SACH_2,
      };
      // Bài "Chữ Hán của lớp" chèn sau bN-kanji — cùng hàm với bộ nạp.
      const { chenHanLop } = await load(join(dir, 'hanLop.ts'));
      const out: Record<number, Lesson[]> = {};
      for (const n of numbered(dir, 'bai')) {
        const m = await load(join(dir, `bai${n}.ts`));
        const bai: Lesson[] = m[`BAI_${n}`];
        if (!Array.isArray(bai)) throw new Error(`bai${n}.ts không export BAI_${n}`);
        const extra: Lesson | undefined = m[`SACH_${n}`] ?? sach[n];
        out[n] = chenHanLop(n, extra ? [...bai, extra] : bai);
      }
      return out;
    },
  },
  {
    name: 'IELTS',
    dir: join(LANG, 'ielts/ngay'),
    loader: 'index.ts',
    prefix: 'ngay',
    written: async () => {
      const dir = join(LANG, 'ielts/ngay');
      const out: Record<number, Lesson[]> = {};
      for (const n of numbered(dir, 'ngay')) {
        const ls: Lesson[] = (await load(join(dir, `ngay${n}.ts`)))[`NGAY_${n}`];
        if (!Array.isArray(ls)) throw new Error(`ngay${n}.ts không export NGAY_${n}`);
        out[n] = ls;
      }
      return out;
    },
  },
];

/** Mỗi phần tử một dòng — diff của git đọc được khi thêm/sửa một bài. */
function render(spec: Spec, written: Record<number, Lesson[]>): string {
  const j = (x: unknown) => JSON.stringify(x);
  const arr = (xs: unknown[], pad: string) => (xs.length ? `[\n${xs.map((x) => `${pad}  ${j(x)},`).join('\n')}\n${pad}]` : '[]');
  const days = Object.keys(written)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => {
      const d = dayMeta(written[n]);
      return [
        `  ${n}: {`,
        `    lessons: ${arr(d.lessons, '    ')},`,
        `    grammar: ${arr(d.grammar, '    ')},`,
        `    vocab: ${arr(d.vocab, '    ')},`,
        `    quizzes: ${arr(d.quizzes, '    ')},`,
        `    minutes: ${d.minutes},`,
        '  },',
      ].join('\n');
    });
  return [
    '/**',
    ` * TỆP SINH TỰ ĐỘNG — đừng sửa tay. Nguồn: các tệp ${spec.prefix}N.ts cạnh đây.`,
    ' * Sinh lại: `npm run course:manifest` (tự chạy trước `next build`);',
    ' * kiểm lệch: `npm run course:manifest:check`.',
    ' *',
    ` * Mục lục ${spec.name} không kèm nội dung bài; khoá = số tệp (${spec.prefix}N).`,
    ' */',
    "import type { CourseManifest } from '@/components/sach-hoc/manifest';",
    '',
    'export const MANIFEST: CourseManifest = {',
    ...days,
    '};',
    '',
  ].join('\n');
}

const check = process.argv.includes('--check');
let bad = 0;
for (const spec of SPECS) {
  const written = await spec.written();
  const file = join(spec.dir, 'manifest.ts');
  const rel = relative(ROOT, file);
  const next = render(spec, written);

  // Bộ nạp viết tay (switch với import tĩnh để webpack tách chunk) — thiếu
  // một case là buổi đó hiện trong mục lục mà mở ra không tải được.
  const loaderSrc = readFileSync(join(spec.dir, spec.loader), 'utf8');
  for (const n of Object.keys(written)) {
    if (!loaderSrc.includes(`import('./${spec.prefix}${n}')`)) {
      console.error(`✗ ${spec.name}: ${spec.loader} thiếu import('./${spec.prefix}${n}') trong bộ nạp`);
      bad++;
    }
  }

  let cur = '';
  try { cur = readFileSync(file, 'utf8'); } catch { /* chưa có */ }
  if (cur === next) {
    console.log(`✓ ${rel} khớp nội dung (${Object.keys(written).length} buổi, ${(next.length / 1024).toFixed(1)} KB)`);
  } else if (check) {
    console.error(`✗ ${rel} LỖI THỜI so với nội dung — chạy: npm run course:manifest`);
    bad++;
  } else {
    writeFileSync(file, next);
    console.log(`✎ đã ghi ${rel} (${Object.keys(written).length} buổi, ${(next.length / 1024).toFixed(1)} KB)`);
  }
}
if (bad) process.exit(1);
