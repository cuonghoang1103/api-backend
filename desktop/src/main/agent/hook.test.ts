/**
 * HOOK — canh phần lọc cấu hình và chốt chặn.
 *
 * Cấu hình hook do người dùng gõ tay vào một file JSON, nên thứ đáng kiểm không
 * phải "hook chạy được", mà là **file gõ sai không được làm chết cả lượt agent**.
 */
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const thuMucApp = await mkdtemp(join(tmpdir(), 'ct-hookcfg-'));
vi.mock('electron', () => ({ app: { getPath: () => thuMucApp, isPackaged: false } }));

const { docHook, quenDemHook, chayHook } = await import('./hook');

const ghiCauHinh = (o: unknown) => writeFile(join(thuMucApp, 'hooks.json'), JSON.stringify(o), 'utf8');

beforeEach(() => { quenDemHook(); });

describe('lọc cấu hình hook', () => {
  it('bỏ mục thiếu trường bắt buộc, giữ mục đúng', async () => {
    await ghiCauHinh({ hooks: [
      { khi: 'sauTool', lenh: 'echo ok' },
      { khi: 'moc-khong-co', lenh: 'echo x' },
      { khi: 'sauTool' },
      { khi: 'sauTool', lenh: '   ' },
      'không phải object',
    ] });
    const ds = await docHook();
    expect(ds).toHaveLength(1);
    expect(ds[0]!.lenh).toBe('echo ok');
  });

  it('bỏ mục có regex HỎNG — ngay lúc đọc, không phải lúc khớp', async () => {
    await ghiCauHinh({ hooks: [
      { khi: 'sauTool', khop: '([', lenh: 'echo x' },
      { khi: 'sauTool', khop: 'edit_file', lenh: 'echo ok' },
    ] });
    /* Để lọt tới lúc khớp thì `new RegExp` ném GIỮA vòng lặp tool — một dấu
       ngoặc thừa trong file cấu hình giết cả lượt agent đang chạy dở. */
    const ds = await docHook();
    expect(ds.map((h) => h.lenh)).toEqual(['echo ok']);
  });

  it('file JSON hỏng ⇒ mảng rỗng, KHÔNG ném', async () => {
    await writeFile(join(thuMucApp, 'hooks.json'), '{ hỏng', 'utf8');
    quenDemHook();
    await expect(docHook()).resolves.toEqual([]);
  });
});

describe('chạy hook', () => {
  const goc = process.cwd();
  const ac = () => new AbortController().signal;

  it('lọc theo TÊN TOOL', async () => {
    await ghiCauHinh({ hooks: [{ khi: 'sauTool', khop: '^edit_file$', lenh: 'echo TRUNG' }] });
    quenDemHook();
    const trung = await chayHook({ moc: 'sauTool', goc, tenTool: 'edit_file', signal: ac() });
    const truot = await chayHook({ moc: 'sauTool', goc, tenTool: 'read_file', signal: ac() });
    expect(trung.ra).toContain('TRUNG');
    expect(truot.ra).toBe('');
  });

  it('hook ĐẠT mà không in gì ⇒ IM LẶNG, không nhồi vào kết quả tool', async () => {
    await ghiCauHinh({ hooks: [{ khi: 'sauTool', lenh: 'exit 0' }] });
    quenDemHook();
    const kq = await chayHook({ moc: 'sauTool', goc, tenTool: 'edit_file', signal: ac() });
    /* Nhồi "hook xong, mã 0" vào MỌI lời gọi tool là bắt model đọc — và trả
       tiền cho — một dòng không mang tin gì, ở mỗi bước. */
    expect(kq.ra).toBe('');
  });

  it('truocTool thoát khác 0 + chan:true ⇒ CHẶN', async () => {
    await ghiCauHinh({ hooks: [{ khi: 'truocTool', lenh: 'echo KHONG_CHO; exit 1', chan: true }] });
    quenDemHook();
    const kq = await chayHook({ moc: 'truocTool', goc, tenTool: 'run_command', signal: ac() });
    expect(kq.chan).toBe(true);
    expect(kq.ra, 'phải nói LÝ DO, không chỉ báo bị chặn').toContain('KHONG_CHO');
  });

  it('thoát khác 0 mà KHÔNG có chan ⇒ chỉ báo, không chặn', async () => {
    await ghiCauHinh({ hooks: [{ khi: 'truocTool', lenh: 'exit 3' }] });
    quenDemHook();
    const kq = await chayHook({ moc: 'truocTool', goc, tenTool: 'x', signal: ac() });
    expect(kq.chan).toBe(false);
    expect(kq.ra).toContain('thoát 3');
  });

  it('lọc theo dự án — hook của dự án khác KHÔNG chạy', async () => {
    await ghiCauHinh({ hooks: [{ khi: 'sauTool', duAn: '/mot/duong/dan/khac', lenh: 'echo X' }] });
    quenDemHook();
    const kq = await chayHook({ moc: 'sauTool', goc, tenTool: 'edit_file', signal: ac() });
    expect(kq.ra).toBe('');
  });
});
