/**
 * Lệnh gạch chéo tự tạo. Đọc file THẬT trong thư mục tạm — thứ đang kiểm là
 * cách nó xử lý những file người ta thật sự đặt vào đó, gồm cả file dở.
 */
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({ app: { getPath: () => tmpdir(), isPackaged: false } }));

const mod = await import('./lenhTuTao');
const { docLenhDuAn, tachDau, ghepThamSo } = mod;

async function duAn(file: Record<string, string>, thuMuc = '.claude/commands'): Promise<string> {
  const goc = await mkdtemp(join(tmpdir(), 'ct-lenh-'));
  await mkdir(join(goc, ...thuMuc.split('/')), { recursive: true });
  for (const [ten, noiDung] of Object.entries(file)) {
    await writeFile(join(goc, ...thuMuc.split('/'), ten), noiDung, 'utf8');
  }
  return goc;
}

describe('tách phần đầu YAML', () => {
  it('lấy description khi có', () => {
    expect(tachDau('---\ndescription: Ra đề thi\n---\nThân lệnh').mo).toBe('Ra đề thi');
    expect(tachDau('---\ndescription: "Có nháy"\n---\nx').mo).toBe('Có nháy');
  });
  it('không có phần đầu ⇒ giữ nguyên toàn bộ làm thân', () => {
    expect(tachDau('# Tiêu đề\nnội dung')).toEqual({ mo: null, than: '# Tiêu đề\nnội dung' });
  });
});

describe('ghép tham số', () => {
  it('thay $ARGUMENTS', () => {
    expect(ghepThamSo('Ra đề môn $ARGUMENTS ngay', 'IOT102')).toBe('Ra đề môn IOT102 ngay');
  });
  it('KHÔNG có $ARGUMENTS mà vẫn gõ thêm ⇒ nối vào cuối, không nuốt mất', () => {
    expect(ghepThamSo('Ra đề thi', 'IOT102')).toBe('Ra đề thi\n\nIOT102');
  });
  it('không gõ thêm gì ⇒ giữ nguyên thân', () => {
    expect(ghepThamSo('Ra đề thi', '   ')).toBe('Ra đề thi');
  });
});

describe('đọc lệnh của dự án', () => {
  it('đọc được, mô tả rút từ tiêu đề khi không khai description', async () => {
    const goc = await duAn({ 'rade.md': '# Ra đề thi 50 câu\nChi tiết…' });
    const ds = await docLenhDuAn(goc);
    expect(ds).toHaveLength(1);
    expect(ds[0]!.ten).toBe('/rade');
    expect(ds[0]!.mo).toBe('Ra đề thi 50 câu');
  });

  it('BỎ file có tên không gõ được thành lệnh', async () => {
    const goc = await duAn({
      'ok.md': 'nội dung',
      'Ra đề (bản 2).md': 'nội dung',
      'CÓ DẤU.md': 'nội dung',
    });
    const ds = await docLenhDuAn(goc);
    /* Một lệnh không ai gõ trúng vẫn chiếm chỗ trong bảng gợi ý và đẩy lệnh
       thật xuống — bỏ hẳn tốt hơn là hiện ra rồi không dùng được. */
    expect(ds.map((l) => l.ten)).toEqual(['/ok']);
  });

  it('BỎ file rỗng và file không phải .md', async () => {
    const goc = await duAn({ 'rong.md': '   \n\n', 'ghichu.txt': 'x', 'that.md': 'có nội dung' });
    expect((await docLenhDuAn(goc)).map((l) => l.ten)).toEqual(['/that']);
  });

  it('dự án không có thư mục lệnh ⇒ mảng rỗng, KHÔNG ném', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-lenh-'));
    await expect(docLenhDuAn(goc)).resolves.toEqual([]);
  });

  it('cũng đọc .agent/commands cho dự án không muốn mang tên công cụ khác', async () => {
    const goc = await duAn({ 'trienkhai.md': '# Triển khai' }, '.agent/commands');
    expect((await docLenhDuAn(goc)).map((l) => l.ten)).toEqual(['/trienkhai']);
  });
});
