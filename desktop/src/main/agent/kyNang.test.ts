/**
 * KỸ NĂNG phía app — đọc thư mục thật trong tmp.
 *
 * Thứ đáng kiểm không phải "đọc được file", mà là những file bị BỎ: mỗi kỹ
 * năng lọt vào danh sách là một dòng nằm trong prompt hệ thống ở MỌI lượt, của
 * mọi câu hỏi. Một mục rác ở đây là một khoản tiền lặp lại mãi.
 */
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { dsKyNang, docThanKyNang, docDauKyNang } from './kyNang';

async function duAn(kn: Record<string, string>): Promise<string> {
  const goc = await mkdtemp(join(tmpdir(), 'ct-kn-'));
  for (const [ten, noiDung] of Object.entries(kn)) {
    await mkdir(join(goc, '.claude/skills', ten), { recursive: true });
    await writeFile(join(goc, '.claude/skills', ten, 'SKILL.md'), noiDung, 'utf8');
  }
  return goc;
}

const DU = '---\nname: ra-de\ndescription: Soạn đề thi 50 câu\n---\nBước 1. Đọc mẫu…';

describe('đọc kỹ năng', () => {
  it('lấy tên + mô tả, KHÔNG kèm thân', async () => {
    const ds = await dsKyNang(await duAn({ 'ra-de': DU }));
    expect(ds).toEqual([{ ten: 'ra-de', moTa: 'Soạn đề thi 50 câu' }]);
    /* Kèm thân là 30k token nhét vào mọi lượt, kể cả câu hỏi chẳng liên quan —
       đó là cả lý do kỹ năng là một TOOL chứ không phải một khối prompt. */
    expect(JSON.stringify(ds)).not.toContain('Bước 1');
  });

  it('BỎ kỹ năng không có description; không khai `name` thì lấy TÊN THƯ MỤC', async () => {
    const ds = await dsKyNang(await duAn({
      'co-mo-ta': '---\ndescription: Có mô tả\n---\nthân',
      'khong-mo-ta': '---\nname: x\n---\nnội dung',
      'khong-co-dau': '# Chỉ có tiêu đề\nnội dung',
    }));
    /* Model chọn kỹ năng CHỈ dựa vào mô tả. Không mô tả ⇒ vừa không bao giờ
       được chọn đúng lúc, vừa tốn token ở mọi lượt. */
    expect(ds.map((k) => k.ten)).toEqual(['co-mo-ta']);
  });

  it('BỎ thư mục tên không gọi lại được', async () => {
    const ds = await dsKyNang(await duAn({ 'Kỹ Năng (mới)': DU, 'hop-le': DU }));
    expect(ds.map((k) => k.ten)).toEqual(['ra-de']); // 'hop-le' khai name: ra-de
  });

  it('thiếu SKILL.md ⇒ bỏ qua, không ném', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-kn-'));
    await mkdir(join(goc, '.claude/skills/rong'), { recursive: true });
    await expect(dsKyNang(goc)).resolves.toEqual([]);
  });

  it('dự án không có thư mục skills ⇒ mảng rỗng', async () => {
    await expect(dsKyNang(await mkdtemp(join(tmpdir(), 'ct-kn-')))).resolves.toEqual([]);
  });
});

describe('đọc thân kỹ năng', () => {
  it('trả thân đã bỏ phần đầu YAML', async () => {
    const goc = await duAn({ 'ra-de': DU });
    expect(await docThanKyNang(goc, 'ra-de')).toBe('Bước 1. Đọc mẫu…');
  });

  it('tên không có ⇒ null, để tool báo rõ thay vì trả thân rỗng', async () => {
    expect(await docThanKyNang(await duAn({ 'ra-de': DU }), 'khong-ton-tai')).toBeNull();
  });

  it('khớp tên KHÔNG phân biệt hoa thường', async () => {
    expect(await docThanKyNang(await duAn({ 'ra-de': DU }), '  RA-DE ')).toBe('Bước 1. Đọc mẫu…');
  });
});

describe('tách phần đầu', () => {
  it('không có phần đầu ⇒ toàn bộ là thân', () => {
    expect(docDauKyNang('# X\nY')).toEqual({ ten: null, moTa: null, than: '# X\nY' });
  });
});
