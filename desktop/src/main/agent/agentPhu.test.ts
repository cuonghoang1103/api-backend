/**
 * Kiểm AGENT PHỤ TỰ ĐỊNH NGHĨA — `.claude/agents/*.md`.
 *
 * Thân file đi vào chỗ PROMPT HỆ THỐNG của lượt phụ, và nó đến từ kho mã. Nên
 * hai câu hỏi phải tách bạch: đọc có đúng không, và nó có thêm được QUYỀN
 * không (phải là KHÔNG — xem `prompt.test.ts` phía máy chủ).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { dsAgentPhu, docThanAgentPhu } from './agentPhu';

async function duAn(file: Record<string, string>): Promise<string> {
  const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ap-'));
  await fs.mkdir(path.join(goc, '.claude', 'agents'), { recursive: true });
  for (const [ten, noi] of Object.entries(file)) {
    await fs.writeFile(path.join(goc, '.claude', 'agents', ten), noi, 'utf8');
  }
  return goc;
}

const MAU = `---
name: ra-bao-mat
description: Rà một vùng mã tìm lỗ bảo mật
---
Bạn là người rà bảo mật. Mỗi phát hiện kèm đường/dẫn.ts:42.`;

describe('đọc .claude/agents', () => {
  it('lấy tên + mô tả từ phần đầu, thân từ phần sau', async () => {
    const goc = await duAn({ 'ra-bao-mat.md': MAU });
    expect(await dsAgentPhu(goc)).toEqual([{ ten: 'ra-bao-mat', moTa: 'Rà một vùng mã tìm lỗ bảo mật' }]);
    const than = await docThanAgentPhu(goc, 'ra-bao-mat');
    expect(than).toContain('Bạn là người rà bảo mật');
    expect(than).not.toContain('description:');   // phần đầu KHÔNG lọt vào thân
  });

  it('thiếu `name` ⇒ lùi về tên file', async () => {
    // Chép một file mẫu về rồi quên sửa `name` vẫn phải dùng được.
    const goc = await duAn({ 'do-hieu-nang.md': '---\ndescription: Đo hiệu năng\n---\nThân.' });
    expect((await dsAgentPhu(goc))[0]?.ten).toBe('do-hieu-nang');
  });

  it('thiếu `description` ⇒ BỎ HẲN, không đưa vào danh sách', async () => {
    // Không có mô tả thì model không biết khi nào gọi; một dòng trống trong
    // danh sách chỉ khiến nó đoán.
    const goc = await duAn({ 'x.md': '---\nname: x\n---\nThân.' });
    expect(await dsAgentPhu(goc)).toEqual([]);
  });

  it('tên không hợp lệ hoặc file không .md ⇒ bỏ qua', async () => {
    const goc = await duAn({
      'Loại Việt.md': '---\nname: Loại Việt\ndescription: m\n---\nx',
      'ghi-chu.txt': 'không phải .md',
    });
    expect(await dsAgentPhu(goc)).toEqual([]);
  });

  it('không có thư mục / chưa mở dự án ⇒ rỗng, KHÔNG ném', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-trong-'));
    expect(await dsAgentPhu(goc)).toEqual([]);
    expect(await dsAgentPhu(null)).toEqual([]);
    expect(await docThanAgentPhu(goc, 'khong-co')).toBeNull();
    expect(await docThanAgentPhu(null, 'x')).toBeNull();
  });

  it('gọi loại KHÔNG tồn tại ⇒ null, để bên gọi báo lỗi kèm danh sách', async () => {
    // Im lặng chạy loại mặc định là cách hỏng khó thấy nhất: model tưởng nó đã
    // được thứ vừa yêu cầu.
    const goc = await duAn({ 'ra-bao-mat.md': MAU });
    expect(await docThanAgentPhu(goc, 'khong-he-co')).toBeNull();
  });
});
