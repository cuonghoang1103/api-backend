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
import { register } from 'node:module';

type Lesson = { id: string; kind: string; title: string; goal: string; minutes: number; blocks?: unknown[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = join(ROOT, 'src/app/language/[code]');
/*
 * Import TƯƠNG ĐỐI không đuôi giữa các tệp bài (`import { H } from './thiCuoiKy123'`, 09/11/2026) — webpack/Vite
 * tự thêm `.ts`, còn Node thì không ⇒ ERR_MODULE_NOT_FOUND. Hook nhỏ này thêm `.ts` khi tệp đó có thật.
 */
register('data:text/javascript,' + encodeURIComponent(`
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function resolve(spec, ctx, next) {
  if ((spec.startsWith('./') || spec.startsWith('../')) && !/\\.[cm]?[jt]sx?$/.test(spec) && ctx.parentURL && ctx.parentURL.startsWith('file:')) {
    const u = new URL(spec + '.ts', ctx.parentURL);
    if (existsSync(fileURLToPath(u))) return next(u.href, ctx);
  }
  return next(spec, ctx);
}`));
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
      // + mục 🃏 Luyện nhớ / 🎌 Luyện bảng chữ — cùng hàm với bộ nạp (luyenNho.ts).
      const { chenLuyenNho, chenHinh } = await load(join(dir, 'luyenNho.ts'));
      const hinh14 = await load(join(dir, 'hinhB14.ts'));
      const hinh57 = await load(join(dir, 'hinhB57.ts'));
      const hinh810 = await load(join(dir, 'hinhB810.ts'));
      const hinh1113 = await load(join(dir, 'hinhB1113.ts'));
      const hinh1415 = await load(join(dir, 'hinhB1415.ts'));
      const docTo = await load(join(dir, 'docTo14.ts'));
      const thi113 = (await load(join(dir, 'thiThu113.ts'))).THI_THU_113 as Lesson[];
      const kt49 = await load(join(dir, 'kiemTraBai49.ts'));
      const ck123 = (await load(join(dir, 'thiCuoiKy123.ts'))).THI_CUOI_KY_123 as Lesson[];
      const s45 = (await load(join(dir, 'slideB45.ts'))).SLIDE_B45 as Lesson[];
      const s67 = (await load(join(dir, 'slideB67.ts'))).SLIDE_B67 as Lesson[];
      const l45 = await load(join(dir, 'luyenThemB45.ts'));
      const l67 = await load(join(dir, 'luyenThemB67.ts'));
      const slotB4 = /^slot-0[1-4]-/;
      const slotB6 = /^(slot-1[0-4]-|slide-tong-hop-b6$)/;
      const j3 = await load(join(dir, 'jp113B3.ts'));
      const j12 = await load(join(dir, 'jp113B12.ts'));
      const slideVaLuyen = (n: number): Lesson[] =>
        n === 1 ? [...j12.JP113_B1, ...j12.LT_B1]
        : n === 2 ? [...j12.JP113_B2, ...j12.LT_B2]
        : n === 3 ? [...j3.JP113_B3, ...j3.LT_B3]
        : n === 4 ? [...s45.filter((l) => slotB4.test(l.id)), ...l45.LUYEN_THEM_B4]
        : n === 5 ? [...s45.filter((l) => !slotB4.test(l.id)), ...l45.LUYEN_THEM_B5]
        : n === 6 ? [...s67.filter((l) => slotB6.test(l.id)), ...l67.LUYEN_THEM_B6]
        : [...s67.filter((l) => !slotB6.test(l.id)), ...l67.LUYEN_THEM_B7];
      const lt0 = (await load(join(dir, 'luyenThemB0.ts'))).LUYEN_THEM_B0 as Lesson[];
      const l89 = await load(join(dir, 'luyenThemB89.ts'));
      const l10 = (await load(join(dir, 'luyenThemB10.ts'))).LUYEN_THEM_B10 as Lesson[];
      const l1112 = await load(join(dir, 'luyenThemB1112.ts'));
      const l1314 = await load(join(dir, 'luyenThemB1314.ts'));
      const out: Record<number, Lesson[]> = {};
      // Tệp baiN.ts mà bộ nạp CHƯA import (agent đang soạn dở) ⇒ bỏ qua, không đưa vào mục lục (09/11/2026:
      // manifest từng commit kèm Bài 18 dở ⇒ kiểm "khớp nội dung" trên cây sạch báo đỏ).
      const boNap = readFileSync(join(dir, 'index.ts'), 'utf8');
      for (const n of numbered(dir, 'bai')) {
        if (!boNap.includes(`import('./bai${n}')`)) { console.warn(`… Dekiru: bỏ qua bai${n}.ts (chưa có trong bộ nạp index.ts)`); continue; }
        const m = await load(join(dir, `bai${n}.ts`));
        const bai: Lesson[] = m[`BAI_${n}`];
        if (!Array.isArray(bai)) throw new Error(`bai${n}.ts không export BAI_${n}`);
        const extra: Lesson | undefined = m[`SACH_${n}`] ?? sach[n];
        // Bài 4–7: thêm "Theo slide lớp" + "Luyện thêm" — cùng luật chia với loadGoc (bai/index.ts).
        const them: Lesson[] = n >= 1 && n <= 7 ? slideVaLuyen(n) : n === 0 ? lt0 : n === 8 || n === 9 ? l89[`LUYEN_THEM_B${n}`] : n === 10 ? l10 : n === 11 || n === 12 ? l1112[`LUYEN_THEM_B${n}`] : n === 13 || n === 14 ? l1314[`LUYEN_THEM_B${n}`] : [];
        const hinh: Lesson[] | undefined = n >= 1 && n <= 4 ? hinh14[`HINH_B${n}`] : n >= 5 && n <= 7 ? hinh57[`HINH_B${n}`] : n >= 8 && n <= 10 ? hinh810[`HINH_B${n}`] : n >= 11 && n <= 13 ? hinh1113[`HINH_B${n}`] : n >= 14 && n <= 15 ? hinh1415[`HINH_B${n}`] : undefined;
        const sau: Lesson[] = [...(n >= 1 && n <= 4 ? [docTo[`DOC_TO_B${n}`]] : []), ...(n === 3 ? thi113 : []), ...(n >= 4 && n <= 9 ? kt49[`KIEM_TRA_B${n}`] : []), ...(n === 7 ? ck123 : [])];
        out[n] = chenLuyenNho(n, chenHinh(n, [...chenHanLop(n, extra ? [...bai, ...them, extra] : [...bai, ...them]), ...sau], hinh));
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
  // Khoá JP (tiếng Nhật 0→N1) và CH (tiếng Trung 0→HSK 6), 05/10/2026: baiN.ts export BAI_N.
  ...(['jp', 'ch'] as const).map((k): Spec => ({
    name: k.toUpperCase(),
    dir: join(LANG, `${k}/bai`),
    loader: 'index.ts',
    prefix: 'bai',
    written: async () => {
      const dir = join(LANG, `${k}/bai`);
      const out: Record<number, Lesson[]> = {};
      for (const n of numbered(dir, 'bai')) {
        const ls: Lesson[] = (await load(join(dir, `bai${n}.ts`)))[`BAI_${n}`];
        if (!Array.isArray(ls)) throw new Error(`${k}/bai${n}.ts không export BAI_${n}`);
        out[n] = ls;
      }
      return out;
    },
  })),
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
