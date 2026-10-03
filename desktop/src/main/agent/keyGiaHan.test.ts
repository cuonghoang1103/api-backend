/**
 * KEY GIA HẠN (02/10/2026): hết hạn mức token ⇒ nhập key ⇒ agent làm tiếp
 * ĐÚNG lượt vừa bị chặn. Đọc nguồn — vòng lặp thật cần máy chủ SSE.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const loop = readFileSync(join(import.meta.dirname, 'loop.ts'), 'utf8');
const ipcAgent = readFileSync(join(import.meta.dirname, '..', 'ipc', 'agent.ts'), 'utf8');
const oNhap = readFileSync(
  join(import.meta.dirname, '..', '..', 'renderer', 'features', 'chat', 'NhapKeyGiaHan.tsx'), 'utf8',
);

describe('key gia hạn — làm tiếp không gián đoạn', () => {
  it('lamTiep KHÔNG đẩy câu hỏi mới vào hội thoại', () => {
    const i = loop.indexOf('if (tuyChon.lamTiep) {');
    expect(i).toBeGreaterThan(-1);
    const j = loop.indexOf('} else {', i);
    const nhanhLamTiep = loop.slice(i, j);
    expect(nhanhLamTiep).not.toContain('cauHoi');
    // Câu hỏi mới chỉ được đẩy ở nhánh else.
    expect(loop.slice(j, j + 600)).toContain("{ role: 'user', content: cauHoi }");
  });

  it('cờ coKeyGiaHan đi từ khung SSE tới sự kiện `loi`', () => {
    expect(loop).toMatch(/e\.coKeyGiaHan === true \? \{ coKeyGiaHan: true \}/);
    expect(loop).toMatch(/phanHoi\.coKeyGiaHan \? \{ coKeyGiaHan: true \}/);
  });

  it('hết hạn mức KHÔNG tự thử lại', () => {
    const i = loop.indexOf('const MA_DANG_THU_LAI');
    const than = loop.slice(i, loop.indexOf(']);', i));
    expect(than).not.toContain('AGENT_QUOTA_EXCEEDED');
  });

  it('send và lamTiep dựng CÙNG một bối cảnh (một hàm chung)', () => {
    // 03/10/2026: `agent:send` thêm cờ `chiDoc` (/plan, /review) — vẫn CÙNG hàm `chayCho`.
    expect(ipcAgent).toMatch(/handle\('agent:send'[\s\S]{0,120}chayCho\(cuocId, text, anh, event, false(, chiDoc === true)?\)/);
    expect(ipcAgent).toMatch(/handle\('agent:lamTiep'[\s\S]{0,120}chayCho\(cuocId, '', undefined, event, true\)/);
  });

  it('key chỉ nhớ trong bộ nhớ — không ghi thiết đặt/đĩa', () => {
    expect(oNhap).not.toMatch(/settings\.set|localStorage|sessionStorage/);
    expect(oNhap).toContain('keyDaNho = null');
  });
});
