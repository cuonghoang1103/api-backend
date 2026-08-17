/**
 * Kiểm việc tìm ghi chú dự án.
 *
 * Ba thứ đáng canh, và cả ba đều hỏng ÂM THẦM:
 *  1. Không có file ⇒ phải trả `null`, KHÔNG được ném. Ném ở đây thì mọi lượt
 *     agent trong một repo không có AGENTS.md đều chết ngay từ đầu.
 *  2. Thứ tự ưu tiên phải cố định. Đổi thứ tự nghĩa là cùng một repo cho ra hai
 *     bộ quy ước khác nhau tuỳ phiên bản app.
 *  3. File rỗng ⇒ bỏ qua, đi tiếp xuống file sau. Gửi lên một khối rỗng chỉ tốn
 *     token cho một khung rào trống rỗng.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { docGhiChuDuAn } from './ghiChu';

const daTao: string[] = [];

async function duAn(files: Record<string, string>): Promise<string> {
  const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ghichu-'));
  daTao.push(goc);
  for (const [ten, noi] of Object.entries(files)) {
    await fs.writeFile(path.join(goc, ten), noi, 'utf8');
  }
  return goc;
}

afterEach(async () => {
  // Xoá theo đường dẫn ĐÃ GHI LÚC TẠO, không quét thư mục tạm tìm cái gì "trông
  // giống" — thư mục tạm là của chung cả máy.
  await Promise.all(daTao.splice(0).map((g) => fs.rm(g, { recursive: true, force: true })));
});

describe('docGhiChuDuAn', () => {
  it('không có file nào ⇒ null, KHÔNG ném', async () => {
    await expect(docGhiChuDuAn(await duAn({ 'README.md': '# x' }))).resolves.toBeNull();
  });

  it('thư mục không tồn tại ⇒ null, KHÔNG ném', async () => {
    await expect(docGhiChuDuAn('/khong/co/thu/muc/nay')).resolves.toBeNull();
  });

  it('đọc được AGENTS.md', async () => {
    const kq = await docGhiChuDuAn(await duAn({ 'AGENTS.md': 'đừng chạy migrate reset' }));
    expect(kq?.ten).toBe('AGENTS.md');
    expect(kq?.noiDung).toContain('migrate reset');
  });

  it('có cả hai ⇒ lấy AGENTS.md, KHÔNG gộp', async () => {
    const kq = await docGhiChuDuAn(await duAn({ 'AGENTS.md': 'A', 'CLAUDE.md': 'C' }));
    expect(kq?.ten).toBe('AGENTS.md');
    expect(kq?.noiDung).toBe('A');
    expect(kq?.noiDung).not.toContain('C');
  });

  it('chỉ có CLAUDE.md ⇒ vẫn lấy', async () => {
    const kq = await docGhiChuDuAn(await duAn({ 'CLAUDE.md': 'luật của repo' }));
    expect(kq?.ten).toBe('CLAUDE.md');
  });

  it('file RỖNG ⇒ bỏ qua, rơi xuống file sau', async () => {
    const kq = await docGhiChuDuAn(await duAn({ 'AGENTS.md': '', 'CLAUDE.md': 'thật' }));
    expect(kq?.ten).toBe('CLAUDE.md');
    expect(kq?.noiDung).toBe('thật');
  });

  it('file khổng lồ ⇒ đọc PHẦN ĐẦU chứ không bỏ hẳn', async () => {
    const to = 'DONG DAU TIEN\n' + 'x'.repeat(400 * 1024);
    const kq = await docGhiChuDuAn(await duAn({ 'AGENTS.md': to }));
    expect(kq).not.toBeNull();
    expect(kq!.noiDung.startsWith('DONG DAU TIEN')).toBe(true);
    expect(kq!.noiDung.length).toBeLessThan(to.length);
  });
});
