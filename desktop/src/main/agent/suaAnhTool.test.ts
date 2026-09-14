/**
 * Vỏ của `sua_anh`: ngục, chống ghi đè, kiểm đuôi file.
 *
 * Phần BIẾN ĐỔI ẢNH (`nativeImage`) không kiểm được ở đây — Electron không
 * chạy dưới vitest — nên nó đã được đo riêng bằng một lượt chạy Electron thật
 * (cắt, cắt tràn mép, co, bìa 1200×630, vừa khung có viền, jpeg: sáu phép đều
 * ra đúng màu và đúng kích thước). Ở đây chỉ gác những cửa mà một lần sửa vô ý
 * có thể mở ra: ghi đè mất ảnh gốc, và thoát khỏi thư mục dự án.
 */
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({
  app: { getPath: () => tmpdir(), isPackaged: false },
  // Ảnh giả: `isEmpty()` true ⇒ `suaAnh` ném ngay, nên mọi phép kiểm dưới đây
  // dừng TRƯỚC phần biến đổi. Đúng ý: ở đây ta gác cái vỏ, không gác ruột.
  nativeImage: { createFromPath: () => ({ isEmpty: () => true, getSize: () => ({ width: 0, height: 0 }) }) },
}));

const goc = mkdtempSync(path.join(tmpdir(), 'suaanh-'));
writeFileSync(path.join(goc, 'goc.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
writeFileSync(path.join(goc, 'daco.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));

async function chay(args: Record<string, unknown>) {
  const { chayToolAgent } = await import('./tools');
  return chayToolAgent(goc, 'sua_anh', args, {
    xinPhep: () => {},
    signal: new AbortController().signal,
    so: { hoanTac: [], quyen: new Set() } as never,
    tuDuyet: true,
  });
}

describe('sua_anh — vỏ', () => {
  it('từ chối "viec" lạ thay vì đoán', async () => {
    const r = await chay({ path: 'goc.png', viec: 'lam dep' });
    expect(r.noiDung).toContain('viec');
  });

  it('từ chối đuôi file không ghi ra được', async () => {
    // `nativeImage` đọc được .webp nhưng KHÔNG ghi được. Cho qua là tạo một
    // file tên .webp chứa dữ liệu PNG — hỏng câm.
    const r = await chay({ path: 'goc.png', viec: 'co', dich: 'ra.webp', rong: 100 });
    expect(r.noiDung).toContain('.png');
  });

  it('KHÔNG ghi đè ảnh đã có', async () => {
    // Ảnh gốc thường chưa từng được commit (vừa tải, vừa chụp) — ghi đè là mất
    // hẳn, không `git checkout` nào cứu.
    const r = await chay({ path: 'goc.png', viec: 'co', dich: 'daco.png', rong: 100 });
    expect(r.noiDung).toContain('đã tồn tại');
  });

  it('không thoát được ra ngoài thư mục dự án', async () => {
    const r = await chay({ path: 'goc.png', viec: 'co', dich: '../thoat.png', rong: 100 });
    expect(r.noiDung.toLowerCase()).toMatch(/chặn|ngoài|lỗi/);
    expect(existsSync(path.join(goc, '..', 'thoat.png'))).toBe(false);
  });

  it('thiếu "dich" thì báo rõ, không ghi bừa', async () => {
    const r = await chay({ path: 'goc.png', viec: 'bia', rong: 1200, cao: 630 });
    expect(r.noiDung).toContain('dich');
  });
});
