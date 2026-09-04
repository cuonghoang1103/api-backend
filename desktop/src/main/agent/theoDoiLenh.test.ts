/**
 * Theo dõi file bị LỆNH thay đổi — dựng kho git THẬT trong thư mục tạm.
 *
 * Không giả `git`: thứ đang kiểm chính là cách đọc `git status --porcelain`, nên
 * một bản giả sẽ chỉ khẳng định lại đúng cái tôi tự nghĩ ra về định dạng của nó.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({ app: { getPath: () => tmpdir(), isPackaged: false } }));

const chay = promisify(execFile);
const { chupTrangThai, ghiThayDoiCuaLenh } = await import('./theoDoiLenh');
const { taoSoCuoc } = await import('./so');
const { luiFileVeLuot } = await import('./tools');

async function kho(): Promise<string> {
  const g = await mkdtemp(join(tmpdir(), 'ct-git-'));
  const q = { cwd: g };
  await chay('git', ['init', '-q', '-b', 'main'], q);
  await chay('git', ['config', 'user.email', 'x@y.z'], q);
  await chay('git', ['config', 'user.name', 'Thu'], q);
  await writeFile(join(g, 'a.txt'), 'GỐC', 'utf8');
  await writeFile(join(g, '.gitignore'), 'dist/\n', 'utf8');
  await chay('git', ['add', '-A'], q);
  await chay('git', ['commit', '-qm', 'đầu'], q);
  return g;
}

describe('theo dõi thay đổi do lệnh', () => {
  it('file SẠCH bị lệnh sửa ⇒ ghi bản gốc từ HEAD, lùi được', async () => {
    const g = await kho();
    const so = taoSoCuoc();
    const truoc = await chupTrangThai(g);
    await writeFile(join(g, 'a.txt'), 'BỊ LỆNH SỬA', 'utf8');   // giả lập prettier --write

    const kq = await ghiThayDoiCuaLenh(g, so, truoc);
    expect(kq.soGhi).toBe(1);

    await luiFileVeLuot(so, 1);
    expect(await readFile(join(g, 'a.txt'), 'utf8'), 'phải về nội dung ở HEAD').toBe('GỐC');
  });

  it('file MỚI do lệnh tạo ⇒ lùi là XOÁ đi', async () => {
    const g = await kho();
    const so = taoSoCuoc();
    const truoc = await chupTrangThai(g);
    await writeFile(join(g, 'sinh-ra.ts', ), 'do codegen tạo', 'utf8');

    expect((await ghiThayDoiCuaLenh(g, so, truoc)).soGhi).toBe(1);
    await luiFileVeLuot(so, 1);
    await expect(readFile(join(g, 'sinh-ra.ts'), 'utf8')).rejects.toThrow();
  });

  it('KHÔNG đụng file bị .gitignore — lùi mà xoá sạch dist/ là thiệt hại lớn hơn', async () => {
    const g = await kho();
    const so = taoSoCuoc();
    const truoc = await chupTrangThai(g);
    await mkdir(join(g, 'dist'), { recursive: true });
    await writeFile(join(g, 'dist/bundle.js'), 'kết quả build', 'utf8');

    expect((await ghiThayDoiCuaLenh(g, so, truoc)).soGhi).toBe(0);
    await luiFileVeLuot(so, 1);
    expect(await readFile(join(g, 'dist/bundle.js'), 'utf8'), 'build phải còn nguyên').toBe('kết quả build');
  });

  it('KHÔNG đè bản gốc sổ đã có — nếu không nút lùi khôi phục về đúng thứ nó định bỏ', async () => {
    const g = await kho();
    const so = taoSoCuoc();
    const { ghiSoTruoc } = await import('./so');

    // agent sửa bằng edit_file trước
    ghiSoTruoc(so, join(g, 'a.txt'), 'GỐC');
    await writeFile(join(g, 'a.txt'), 'agent sửa', 'utf8');
    // rồi chạy một lệnh sửa tiếp chính file đó
    const truoc = await chupTrangThai(g);
    await writeFile(join(g, 'a.txt'), 'lệnh sửa tiếp', 'utf8');
    await ghiThayDoiCuaLenh(g, so, truoc);

    await luiFileVeLuot(so, 1);
    expect(await readFile(join(g, 'a.txt'), 'utf8'), 'phải về GỐC, không phải bản agent sửa').toBe('GỐC');
  });

  it('không phải kho git ⇒ trả null, bỏ qua lặng lẽ', async () => {
    const g = await mkdtemp(join(tmpdir(), 'ct-khonggit-'));
    expect(await chupTrangThai(g)).toBeNull();
    expect((await ghiThayDoiCuaLenh(g, taoSoCuoc(), null)).soGhi).toBe(0);
  });

  it('lệnh không đổi gì ⇒ không ghi gì', async () => {
    const g = await kho();
    const so = taoSoCuoc();
    const truoc = await chupTrangThai(g);
    expect((await ghiThayDoiCuaLenh(g, so, truoc)).soGhi).toBe(0);
  });
});
