/**
 * GỢI Ý `@` CHO HÀM / LỚP — quét nhanh định nghĩa bằng regex (không LSP, không
 * cài gì thêm). Chạy nền theo từng mẻ có nhường vòng lặp sự kiện, có TRẦN THỜI
 * GIAN và trần số file: repo khổng lồ thì nhận một phần, ô nhập không bao giờ khựng.
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export interface KyHieu { ten: string; kieu: string; file: string; dong: number }

const MAU: Array<{ duoi: RegExp; luat: Array<[RegExp, string]> }> = [
  {
    duoi: /\.(m?[jt]sx?|cjs|cts|mts)$/,
    luat: [
      [/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, 'hàm'],
      [/^\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/, 'lớp'],
      [/^\s*(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)/, 'interface'],
      [/^\s*(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*(?:<[^=]*>)?\s*=/, 'kiểu'],
      [/^\s*(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z_$][\w$]*)/, 'enum'],
      [/^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]+)?=>/, 'hàm'],
    ],
  },
  { duoi: /\.py$/, luat: [[/^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)/, 'hàm'], [/^\s*class\s+([A-Za-z_]\w*)/, 'lớp']] },
  { duoi: /\.go$/, luat: [[/^func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/, 'hàm'], [/^type\s+([A-Za-z_]\w*)\s+(?:struct|interface)/, 'kiểu']] },
  { duoi: /\.rs$/, luat: [[/^\s*(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?fn\s+([A-Za-z_]\w*)/, 'hàm'], [/^\s*(?:pub\s+)?(?:struct|enum|trait)\s+([A-Za-z_]\w*)/, 'kiểu']] },
  {
    duoi: /\.(java|kt|kts|cs|swift|scala|dart)$/,
    luat: [
      [/^\s*(?:(?:public|private|protected|internal|static|final|abstract|sealed|data|open|partial)\s+)*(?:class|interface|enum|record|struct|object|protocol)\s+([A-Za-z_]\w*)/, 'lớp'],
      [/^\s*(?:(?:public|private|protected|internal|static|final|override|suspend|async|virtual)\s+)+[\w<>[\],.? ]+?\s+([a-z_]\w*)\s*\(/, 'hàm'],
      [/^\s*(?:(?:public|private|internal|override|suspend)\s+)*fun\s+(?:<[^>]*>\s*)?(?:[\w.]+\.)?([A-Za-z_]\w*)/, 'hàm'],
      [/^\s*(?:(?:public|private|static)\s+)*func\s+([A-Za-z_]\w*)/, 'hàm'],
    ],
  },
  { duoi: /\.(c|h|cc|cpp|hpp)$/, luat: [[/^(?:static\s+|inline\s+)*[\w*&:<> ]+?\s+\*?([A-Za-z_]\w*)\s*\([^;]*$/, 'hàm'], [/^\s*(?:class|struct)\s+([A-Za-z_]\w*)\s*[:{]?/, 'lớp']] },
  { duoi: /\.(rb)$/, luat: [[/^\s*def\s+(?:self\.)?([A-Za-z_]\w*[?!]?)/, 'hàm'], [/^\s*(?:class|module)\s+([A-Z]\w*)/, 'lớp']] },
  { duoi: /\.php$/, luat: [[/^\s*(?:(?:public|private|protected|static|final|abstract)\s+)*function\s+([A-Za-z_]\w*)/, 'hàm'], [/^\s*(?:final\s+|abstract\s+)?class\s+([A-Za-z_]\w*)/, 'lớp']] },
];

const TU_KHOA_BO = new Set(['if', 'for', 'while', 'switch', 'return', 'catch', 'new', 'else', 'do', 'try', 'function']);

/** Định nghĩa trong MỘT file (thuần — test được). */
export function quetNoiDung(noiDung: string, file: string): KyHieu[] {
  const bo = MAU.find((m) => m.duoi.test(file));
  if (!bo) return [];
  const ra: KyHieu[] = [];
  const dong = noiDung.split('\n');
  for (let i = 0; i < dong.length && ra.length < 400; i += 1) {
    const d = dong[i]!;
    if (d.length > 400) continue;
    for (const [re, kieu] of bo.luat) {
      const m = re.exec(d);
      if (m?.[1] && !TU_KHOA_BO.has(m[1])) { ra.push({ ten: m[1], kieu, file, dong: i + 1 }); break; }
    }
  }
  return ra;
}

export const coTheQuet = (file: string): boolean => MAU.some((m) => m.duoi.test(file)) && !/(\.min\.|\.d\.ts$|\.test\.|\.spec\.)/.test(file);

/** Quét cả dự án, dừng ở `tranMs` hoặc `tranFile`. */
export async function quetDuAn(goc: string, file: readonly string[], o: { tranMs?: number; tranFile?: number } = {}): Promise<{ ds: KyHieu[]; xong: boolean }> {
  const het = Date.now() + (o.tranMs ?? 1500);
  const ds: KyHieu[] = [];
  const can = file.filter((f) => !f.endsWith('/') && coTheQuet(f)).slice(0, o.tranFile ?? 6000);
  for (let i = 0; i < can.length; i += 1) {
    if (Date.now() > het) return { ds, xong: false };
    const f = can[i]!;
    try {
      const p = path.join(goc, f);
      if ((await stat(p)).size > 300_000) continue;
      ds.push(...quetNoiDung(await readFile(p, 'utf8'), f));
    } catch { /* file vừa bị xoá */ }
  }
  return { ds, xong: true };
}
