/**
 * Kho kỹ năng lấy được từ NHIỀU kho GitHub, không chỉ kho tổng hợp.
 *
 * Thêm 15/09/2026 để bổ sung `wondelai/skills` (196 kỹ năng đóng vai chuyên
 * gia), `obra/superpowers` (14) và `anthropics/skills` (20) — kho tổng hợp
 * `davila7/claude-code-templates` chỉ mirror vài cái trong số đó.
 *
 * ⚠️ CHỖ DỄ SAI NHẤT là ghép đường dẫn. Kho tổng hợp xếp mọi thứ dưới
 * `cli-tool/components/<loại>/`, còn mỗi kho riêng xếp theo cách của nó. Ghép
 * tiền tố của kho tổng hợp vào một mục của kho riêng là **404 ở mọi mục** —
 * và người dùng chỉ thấy "không tải được", không biết vì sao.
 *
 * Đường dẫn dưới đây đã được gọi THẬT và trả 200 (15/09/2026):
 *   wondelai/skills/main/37signals-way/SKILL.md
 *   obra/superpowers/main/skills/brainstorming/SKILL.md
 *   anthropics/skills/main/skills/academy-guide/SKILL.md
 */
import { describe, expect, it } from 'vitest';
import { duongTai } from './khoKyNang';

describe('duongTai', () => {
  it('kho RIÊNG: dùng đường trong kho đó, KHÔNG ghép tiền tố kho tổng hợp', () => {
    expect(duongTai({
      ten: '37signals-way', duong: '37signals-way', danhMuc: 'chuyen-gia', loai: 'skill',
      goc: 'https://raw.githubusercontent.com/wondelai/skills/main',
    })).toBe('https://raw.githubusercontent.com/wondelai/skills/main/37signals-way/SKILL.md');
  });

  it('kho riêng có thư mục con', () => {
    expect(duongTai({
      ten: 'brainstorming', duong: 'skills/brainstorming', danhMuc: 'development', loai: 'skill',
      goc: 'https://raw.githubusercontent.com/obra/superpowers/main',
    })).toBe('https://raw.githubusercontent.com/obra/superpowers/main/skills/brainstorming/SKILL.md');
  });

  it('KHÔNG có `goc` ⇒ đi kho tổng hợp y như cũ (865 mục cũ không đổi)', () => {
    expect(duongTai({ ten: 'x', duong: 'development/x', danhMuc: 'development', loai: 'skill' }))
      .toBe('https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/skills/development/x/SKILL.md');
  });

  it('agent/command là TỆP, không phải thư mục ⇒ không thêm /SKILL.md', () => {
    const d = duongTai({ ten: 'y', duong: 'ops/y.md', danhMuc: 'ops', loai: 'agent' });
    expect(d.endsWith('/SKILL.md')).toBe(false);
    expect(d.endsWith('ops/y.md')).toBe(true);
  });
});
