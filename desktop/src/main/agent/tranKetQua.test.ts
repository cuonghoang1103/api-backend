/**
 * Trần kích thước kết quả tool đọc — 26/09/2026.
 *
 * Hai thứ đo thật dẫn tới bản này:
 *   1. Mỗi bước agent gửi lại cả hội thoại ⇒ kết quả tool to bị trả tiền lại
 *      ở MỌI bước sau. read_file 800 dòng, grep 200 × 300 ký tự, lệnh 24k…
 *   2. Nghi cổng cắt ngầm khối nội dung dài ở ~6–8k ký tự ⇒ dòng chân "còn N
 *      dòng, gọi offset=…" ở CUỐI bị mất ⇒ model đọc đi đọc lại.
 *
 * Nên phép kiểm quan trọng nhất ở đây là "thông tin cắt nằm ở ĐẦU" — cụ thể là
 * nằm trong 300 ký tự đầu, xa dưới mọi mép cắt ngầm có thể có.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { catGiua, TRAN_KY_TU_RA } from './lenh';

vi.mock('electron', () => ({ app: { getPath: () => tmpdir(), isPackaged: false } }));

const goc = mkdtempSync(path.join(tmpdir(), 'trankq-'));
let chay: (ten: string, args: Record<string, unknown>) => Promise<{ noiDung: string; tomTat: string }>;

const dau = (s: string): string => s.slice(0, 300);

beforeAll(async () => {
  const m = await import('./tools');
  chay = (ten, args) => m.chayToolAgent(goc, ten, args);

  writeFileSync(path.join(goc, 'dai.ts'), Array.from({ length: 1000 }, (_, i) => `const x${i + 1} = ${i + 1};`).join('\n') + '\n');
  writeFileSync(path.join(goc, 'ngan.ts'), 'a\nb\nc\n');
  writeFileSync(path.join(goc, 'min.js'), `var a=1;${'x'.repeat(5000)}\nvar b=2;\n`);
  // 200 dòng × 150 ký tự = 30k ký tự: chạm trần 16k trước trần 300 dòng.
  writeFileSync(path.join(goc, 'rong.txt'), Array.from({ length: 200 }, () => 'y'.repeat(150)).join('\n'));

  mkdirSync(path.join(goc, 'g'));
  writeFileSync(path.join(goc, 'g', 'mot.ts'), Array.from({ length: 150 }, (_, i) => `// KHOP ${i}`).join('\n'));
  writeFileSync(path.join(goc, 'g', 'hai.ts'), 'khop thuong\nKHOP hoa\nkhac\n');
  writeFileSync(path.join(goc, 'g', 'ba.md'), `KHOP ${'z'.repeat(1000)}\n`);
});

describe('read_file', () => {
  it('mặc định 300 dòng, tiêu đề ĐẦU nói tổng + offset đọc tiếp', async () => {
    const r = await chay('read_file', { path: 'dai.ts' });
    expect(r.noiDung.startsWith('[dai.ts — dòng 1–300 / tổng 1000 dòng, CÒN TIẾP: gọi read_file offset=301')).toBe(true);
    expect(r.noiDung).toContain('300\tconst x300 = 300;');
    expect(r.noiDung).not.toContain('301\tconst x301');
    expect(r.tomTat).toBe('300/1000 dòng');
  });

  it('limit vẫn khai được tới 2000 (nhưng trần 16k ký tự vẫn áp)', async () => {
    const r = await chay('read_file', { path: 'dai.ts', offset: 901, limit: 2000 });
    expect(dau(r.noiDung)).toContain('dòng 901–1000 / tổng 1000 dòng, đã hết file');
    expect(r.noiDung).toContain('1000\tconst x1000 = 1000;');
  });

  it('file kết thúc bằng xuống dòng không đếm dòng rỗng giả', async () => {
    const r = await chay('read_file', { path: 'ngan.ts' });
    expect(dau(r.noiDung)).toContain('dòng 1–3 / tổng 3 dòng, đã hết file');
  });

  it('trần 16k ký tự: dừng ở RANH GIỚI DÒNG và nói ở đầu', async () => {
    const r = await chay('read_file', { path: 'rong.txt' });
    expect(r.noiDung.length).toBeLessThan(17_000);
    const m = /dòng 1–(\d+) \/ tổng 200 dòng, CÒN TIẾP: gọi read_file offset=(\d+)/.exec(dau(r.noiDung));
    expect(m).not.toBeNull();
    expect(Number(m![2])).toBe(Number(m![1]) + 1);
    expect(dau(r.noiDung)).toContain('chạm trần 16k');
    // Dòng cuối cùng của lát phải trọn vẹn 150 ký tự — không cắt giữa dòng.
    const cacDong = r.noiDung.split('\n').filter((d) => /^\d+\t/.test(d));
    expect(cacDong.at(-1)!.split('\t')[1]!.length).toBe(150);
  });

  it('dòng dài quá 500 ký tự bị cắt kèm …(+N ký tự)', async () => {
    const r = await chay('read_file', { path: 'min.js' });
    expect(r.noiDung).toContain(`…(+${5008 - 500} ký tự)`);
    expect(dau(r.noiDung)).toContain('1 dòng dài quá 500 ký tự đã bị cắt');
    expect(r.noiDung).toContain('2\tvar b=2;');
  });

  it('offset quá cuối file báo rõ', async () => {
    const r = await chay('read_file', { path: 'ngan.ts', offset: 10 });
    expect(r.noiDung).toContain('file chỉ có 3 dòng');
  });
});

describe('grep', () => {
  it('GOM THEO FILE: tên file một lần, rồi các dòng "  số: nội dung"', async () => {
    const r = await chay('grep', { pattern: 'khop', path: 'g', glob: '*.ts' });
    const dong = r.noiDung.split('\n');
    expect(dong).toContain('g/hai.ts');
    expect(dong).toContain('  1: khop thuong');
    expect(dong).toContain('  2: KHOP hoa');
    // Đường dẫn không bị lặp lại trên mỗi dòng như bản cũ.
    expect(r.noiDung.split('g/hai.ts').length - 1).toBe(1);
  });

  it('mặc định 100 dòng; tiêu đề ĐẦU nói tổng thật và đã cắt', async () => {
    const r = await chay('grep', { pattern: 'KHOP', path: 'g', glob: '*.ts' });
    expect(dau(r.noiDung)).toMatch(/^\[grep \/KHOP\/i — 152 dòng khớp trong 2 file; ĐÃ CẮT, chỉ hiện 100 dòng đầu/);
    expect(r.noiDung.split('\n').filter((d) => /^ {2}\d+: /.test(d)).length).toBe(100);
  });

  it('max tuỳ chỉnh, trần 300', async () => {
    const r5 = await chay('grep', { pattern: 'KHOP', path: 'g', glob: '*.ts', max: 5 });
    expect(r5.noiDung.split('\n').filter((d) => /^ {2}\d+: /.test(d)).length).toBe(5);
    const r999 = await chay('grep', { pattern: 'KHOP', path: 'g', glob: '*.ts', max: 999 });
    expect(dau(r999.noiDung)).toContain('đủ, không cắt');
    expect(r999.noiDung.split('\n').filter((d) => /^ {2}\d+: /.test(d)).length).toBe(152);
  });

  it('phan_biet_hoa=true thì "khop" thường không khớp "KHOP"', async () => {
    const r = await chay('grep', { pattern: 'khop', path: 'g', phan_biet_hoa: true });
    expect(dau(r.noiDung)).toContain('— 1 dòng khớp trong 1 file');
    expect(r.noiDung).toContain('  1: khop thuong');
    expect(r.noiDung).not.toContain('KHOP hoa');
  });

  it('chi_ten_file=true chỉ liệt kê file + số lần', async () => {
    const r = await chay('grep', { pattern: 'KHOP', path: 'g', chi_ten_file: true });
    expect(r.noiDung).toContain('g/mot.ts (150)');
    expect(r.noiDung).toContain('g/hai.ts (2)');
    expect(r.noiDung).toContain('g/ba.md (1)');
    expect(r.noiDung).not.toMatch(/^ {2}\d+: /m);
  });

  it('dòng khớp dài bị cắt ở 200 ký tự', async () => {
    const r = await chay('grep', { pattern: 'KHOP z', path: 'g' });
    expect(r.noiDung).toContain(`…(+${1005 - 200} ký tự)`);
  });

  it('không khớp vẫn có tiêu đề ở đầu', async () => {
    const r = await chay('grep', { pattern: 'khong_bao_gio_co', path: 'g' });
    expect(r.noiDung).toMatch(/^\[grep .* KHÔNG dòng nào khớp/);
  });
});

describe('glob / list_dir', () => {
  it('glob có tiêu đề tổng ở đầu', async () => {
    const r = await chay('glob', { pattern: 'g/*.ts' });
    expect(r.noiDung.startsWith('[glob "g/*.ts" — 2 file khớp')).toBe(true);
  });

  it('list_dir có tiêu đề ở đầu và trần 200 mục', async () => {
    const thuMuc = path.join(goc, 'nhieu');
    mkdirSync(thuMuc);
    for (let i = 0; i < 250; i++) writeFileSync(path.join(thuMuc, `f${String(i).padStart(3, '0')}.txt`), '');
    const r = await chay('list_dir', { path: 'nhieu' });
    expect(r.noiDung.startsWith('[nhieu — 0 thư mục, 250 file; CHỈ HIỆN 200/250 mục đầu')).toBe(true);
    expect(r.noiDung).toContain('[… còn 50 mục nữa]');
    expect(r.noiDung).not.toContain('f200.txt');
  });
});

describe('git_diff', () => {
  const khoGit = mkdtempSync(path.join(tmpdir(), 'trankq-git-'));
  const git = (...a: string[]): void => {
    execFileSync('git', a, { cwd: khoGit, stdio: 'ignore' });
  };

  beforeAll(() => {
    git('init', '-q');
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    writeFileSync(path.join(khoGit, 'a.txt'), Array.from({ length: 600 }, (_, i) => `cu ${i}`).join('\n'));
    writeFileSync(path.join(khoGit, 'b.txt'), 'b\n');
    git('add', '.');
    git('commit', '-qm', 'dau');
    writeFileSync(path.join(khoGit, 'a.txt'), Array.from({ length: 600 }, (_, i) => `moi ${i}`).join('\n'));
    writeFileSync(path.join(khoGit, 'b.txt'), 'b2\n');
  });

  it('mặc định 400 dòng, tiêu đề đầu nói ĐÃ CẮT', async () => {
    const m = await import('./tools');
    const r = await m.chayToolAgent(khoGit, 'git_diff', {});
    expect(r.noiDung).toMatch(/^\[git diff — \d+ dòng; ĐÃ CẮT, chỉ hiện 400 dòng đầu/);
    expect(r.noiDung.split('\n').length).toBeLessThanOrEqual(402);
  });

  it('stat=true ⇒ danh sách file đổi, không cắt', async () => {
    const m = await import('./tools');
    const r = await m.chayToolAgent(khoGit, 'git_diff', { stat: true });
    expect(r.noiDung).toMatch(/^\[git diff --stat — \d+ dòng, đủ\]/);
    expect(r.noiDung).toContain('a.txt');
    expect(r.noiDung).toContain('b.txt');
    expect(r.noiDung).toContain('2 files changed');
  });
});

describe('catGiua — đầu ra lệnh', () => {
  it('trần 12k', () => {
    expect(TRAN_KY_TU_RA).toBe(12_000);
  });

  it('ngắn thì giữ nguyên', () => {
    expect(catGiua('abc')).toEqual({ ra: 'abc', catBot: false });
  });

  it('giữ ~35% ĐẦU + ~65% CUỐI, đánh dấu số ký tự bỏ ở giữa', () => {
    const s = `DAU_LENH\n${'giua\n'.repeat(10_000)}LOI_O_CUOI: Cannot find module`;
    const { ra, catBot } = catGiua(s);
    expect(catBot).toBe(true);
    expect(ra.startsWith('DAU_LENH')).toBe(true);
    expect(ra.endsWith('LOI_O_CUOI: Cannot find module')).toBe(true);
    const m = /\[… ĐÃ BỎ (\d+) ký tự ở GIỮA đầu ra \(giữ (\d+) ký tự đầu \+ (\d+) ký tự cuối\) …\]/.exec(ra);
    expect(m).not.toBeNull();
    const [bo, giuDau, giuCuoi] = [Number(m![1]), Number(m![2]), Number(m![3])];
    expect(bo + giuDau + giuCuoi).toBe(s.length);
    expect(giuDau).toBeGreaterThan(12_000 * 0.35 - 400);
    expect(giuDau).toBeLessThanOrEqual(12_000 * 0.35);
    expect(giuCuoi).toBeGreaterThan(12_000 * 0.65 - 400);
    expect(giuCuoi).toBeLessThanOrEqual(12_000 * 0.65);
  });

  it('cắt ở ranh giới dòng khi có dòng đủ gần', () => {
    const s = Array.from({ length: 3000 }, (_, i) => `dong-${i}-xxxxxxxx`).join('\n');
    const { ra } = catGiua(s);
    const [phanDau, phanCuoi] = ra.split(/\n\n\[… ĐÃ BỎ .* …\]\n\n/);
    expect(phanDau!.split('\n').every((d) => /^dong-\d+-x{8}$/.test(d))).toBe(true);
    expect(phanCuoi!.split('\n').every((d) => /^dong-\d+-x{8}$/.test(d))).toBe(true);
  });
});
