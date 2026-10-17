/**
 * GỢI Ý `@` — tìm mờ file/thư mục trong dự án.
 *
 * Danh sách lấy từ `git ls-files` (nhanh, tự bỏ những gì `.gitignore` bỏ);
 * không phải kho git ⇒ tự duyệt thư mục, bỏ node_modules/.git/dist… và dừng ở
 * 20.000 mục (một thư mục home lỡ mở nhầm không được làm treo ô nhập).
 */
import { execFile } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';

export const THU_MUC_BO = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.turbo', '.cache', 'coverage',
  '.venv', 'venv', '__pycache__', '.idea', '.vscode-test', 'target', '.gradle', 'Pods', 'DerivedData',
]);
const TRAN_MUC = 20_000;

/** Duyệt thư mục (đồng bộ, đủ nhanh cho ≤20k mục). Trả đường tương đối, `/` ở mọi hệ điều hành. */
export function duyetThuMuc(goc: string, tran = TRAN_MUC): string[] {
  const ra: string[] = [];
  const hang: string[] = [''];
  while (hang.length && ra.length < tran) {
    const tuongDoi = hang.shift()!;
    let ds: import('node:fs').Dirent[];
    try {
      ds = readdirSync(path.join(goc, tuongDoi), { withFileTypes: true });
    } catch {
      continue;
    }
    ds.sort((a, b) => a.name.localeCompare(b.name));
    for (const d of ds) {
      if (THU_MUC_BO.has(d.name) || d.name === '.DS_Store') continue;
      const p = tuongDoi ? `${tuongDoi}/${d.name}` : d.name;
      if (d.isDirectory()) hang.push(p);
      else ra.push(p);
      if (ra.length >= tran) break;
    }
  }
  return ra;
}

function gitLsFiles(goc: string): Promise<string[] | null> {
  return new Promise((xong) => {
    execFile('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: goc, maxBuffer: 32 * 1024 * 1024, timeout: 4000 }, (loi, ra) => {
      if (loi) { xong(null); return; }
      xong(ra.split('\n').filter(Boolean).slice(0, TRAN_MUC * 5));
    });
  });
}

/** File của dự án + thư mục suy ra từ chúng (thư mục kết thúc bằng `/`). */
export async function chiMucDuAn(goc: string): Promise<string[]> {
  const file = (await gitLsFiles(goc)) ?? duyetThuMuc(goc);
  const thuMuc = new Set<string>();
  for (const f of file) {
    const phan = f.split('/');
    for (let i = 1; i < phan.length; i += 1) thuMuc.add(`${phan.slice(0, i).join('/')}/`);
  }
  return [...file, ...thuMuc];
}

/**
 * Điểm khớp mờ (càng LỚN càng hợp), `-1` = không khớp.
 * Thưởng: khớp liền nhau, khớp đầu tên file, khớp sau `/ . _ -`, khớp trong
 * tên file (không phải thư mục cha). Phạt nhẹ đường dài.
 */
export function diemMo(q: string, s: string): number {
  if (!q) return 1;
  const qq = q.toLowerCase();
  const ss = s.toLowerCase();
  const tenFile = ss.replace(/\/$/, '').split('/').pop() ?? ss;
  const batDauTen = ss.length - tenFile.length - (ss.endsWith('/') ? 1 : 0);
  let diem = 0;
  // Khớp nguyên chuỗi con: rất mạnh, nhất là trong tên file.
  const viTriTen = tenFile.indexOf(qq);
  if (viTriTen === 0) diem += 120;
  else if (viTriTen > 0) diem += 80;
  else if (ss.includes(qq)) diem += 50;
  let j = 0;
  let lienTiep = 0;
  let truoc = -2;
  for (let i = 0; i < ss.length && j < qq.length; i += 1) {
    if (ss[i] !== qq[j]) continue;
    let d = 1;
    if (i === truoc + 1) { lienTiep += 1; d += 2 + lienTiep; } else lienTiep = 0;
    const c = i === 0 ? '/' : ss[i - 1]!;
    if ('/._- '.includes(c)) d += 4;
    if (i >= batDauTen) d += 2;
    diem += d;
    truoc = i;
    j += 1;
  }
  if (j < qq.length) return -1;
  return diem - Math.min(20, ss.length / 10);
}

export function timMo(q: string, ds: readonly string[], gioiHan = 12): string[] {
  const qq = q.replace(/\\/g, '/').trim();
  if (!qq) {
    // Chưa gõ gì: thư mục cấp đầu + file ở gốc trước — thứ người dùng hay cần nhất.
    const goc = ds.filter((x) => !x.replace(/\/$/, '').includes('/'));
    return goc.sort((a, b) => Number(b.endsWith('/')) - Number(a.endsWith('/')) || a.localeCompare(b)).slice(0, gioiHan);
  }
  return ds
    .map((s) => ({ s, d: diemMo(qq, s) }))
    .filter((x) => x.d >= 0)
    .sort((a, b) => b.d - a.d || a.s.length - b.s.length)
    .slice(0, gioiHan)
    .map((x) => x.s);
}

/** Lấy token `@...` ngay trước con trỏ (để gợi ý). `null` = không ở trong token `@`. */
export function tokenNhac(truocConTro: string): { q: string; dau: number } | null {
  const m = /(^|\s)@([^\s@]*)$/.exec(truocConTro);
  if (!m) return null;
  return { q: m[2]!, dau: truocConTro.length - m[2]!.length - 1 };
}

/** Đường được nhắc bằng `@` ⇒ thêm dòng nhắc model đọc chúng (như extension VS Code). */
export function phuLucNhac(text: string, boQua: ReadonlySet<string> = new Set()): string {
  const ds = [...new Set([...text.matchAll(/(?:^|\s)@([\w./\\~-][^\s]*)/g)].map((m) => m[1]!))]
    .filter((d) => !boQua.has(d))
    .slice(0, 20);
  if (!ds.length) return text;
  return `${text}\n\nFile/thư mục tôi nhắc tới (đọc bằng read_file / list_dir trước khi trả lời):\n${ds.map((d) => `- ${d}`).join('\n')}`;
}
