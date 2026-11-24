/**
 * `/hoc` — lõi (`ctworkHocTap.ts`) với CT Work GIẢ (lời gọi MCP tiêm vào, như dot5.test) — không mạng.
 */
import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-hoc-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, safeStorage: { isEncryptionAvailable: () => false } }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
let svGia: Array<{ ten: string; ok: boolean; soTool: number }> = [{ ten: 'ctwork', ok: true, soTool: 30 }];
vi.mock('./mcp', async (goc) => ({ ...(await goc<typeof import('./mcp')>()), trangThaiServer: () => svGia }));

const H = await import('./ctworkHe');
const { hocTapLenh, veKetQuaHoc } = await import('./ctworkHocTap');

describe('/hoc — lõi vẽ kết quả lệnh MCP hoc_tap', () => {
  it('today/week trả markdown ⇒ giữ nguyên', () => {
    expect(veKetQuaHoc('today', '### 📅 T3 24/11/2026')).toBe('### 📅 T3 24/11/2026');
  });
  it('add / done / undone / start ⇒ một dòng người đọc', () => {
    expect(veKetQuaHoc('add', JSON.stringify({ added: 'C5', title: 'Ôn kana', date: '2026-11-25', time: '20:00', minutes: 45 })))
      .toBe('✅ Đã thêm `C5` **Ôn kana** · 25/11 20:00 · 45′.');
    expect(veKetQuaHoc('done', JSON.stringify({ id: 'C5', title: 'Ôn kana', done: true }))).toMatch(/xong\.$/);
    expect(veKetQuaHoc('undone', JSON.stringify({ id: 'C5', title: 'Ôn kana', done: false }))).toMatch(/bỏ đánh dấu/);
    expect(veKetQuaHoc('start', JSON.stringify({ started: 'H12', title: 'Kana', minutes: 30 }))).toMatch(/nộp bằng chứng/);
  });
  it('list_personal rỗng / có việc tồn', () => {
    expect(veKetQuaHoc('list_personal', JSON.stringify({ tasks: [] }))).toMatch(/Không có việc/);
    expect(veKetQuaHoc('list_personal', JSON.stringify({ tasks: [{ id: 'C6', title: 'Đi chợ', date: '2026-11-23', time: null, minutes: 30, done: false, overdue: true }] })))
      .toBe('- `C6` Đi chợ · 23/11 · 30′ · ⚠ tồn');
  });
});

describe('/hoc — gọi MCP hoc_tap (CT Work giả)', () => {
  it('chuyển đúng tham số, bỏ trường rỗng; sua + khong-gio gửi time ""', async () => {
    const goi: Array<{ tool: string; args: Record<string, unknown> }> = [];
    H._datPhuThuoc({ goi: async (tool, args) => { goi.push({ tool, args }); return { loi: false, noiDung: JSON.stringify({ added: 'C9', title: 'x', minutes: 30 }) }; } });
    const r = await hocTapLenh({ action: 'add', title: 'Ôn kana', date: '2026-11-25', time: '20:00', minutes: 45, note: '' });
    expect(r.ok).toBe(true);
    expect(goi[0]).toEqual({ tool: 'hoc_tap', args: { action: 'add', title: 'Ôn kana', date: '2026-11-25', time: '20:00', minutes: 45 } });
    await hocTapLenh({ action: 'edit', id: 'C9', time: '' });
    expect(goi[1]!.args).toEqual({ action: 'edit', id: 'C9', time: '' });
  });
  it('máy chủ báo lỗi ⇒ chữ lỗi; chưa nối CT Work ⇒ chỉ đường /ctwork', async () => {
    H._datPhuThuoc({ goi: async () => ({ loi: true, noiDung: 'LỖI: Study tasks are completed by submitting evidence' }) });
    const r = await hocTapLenh({ action: 'done', id: 'H3' });
    expect(r).toEqual({ ok: false, loi: 'Study tasks are completed by submitting evidence' });
    svGia = [];
    const r2 = await hocTapLenh({ action: 'today' });
    expect(r2.ok).toBe(false);
    expect(r2.loi).toMatch(/\/ctwork/);
    svGia = [{ ten: 'ctwork', ok: true, soTool: 30 }];
  });
});
