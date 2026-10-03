// @vitest-environment jsdom
/**
 * `/model`, `/memory`, `/hooks`, `/mcp` và menu "⋯" mở ĐÚNG tấm gốc qua `moTam`
 * — và chỉ ở ĐÚNG tab (mọi tab đều dựng một `AgentMode`).
 */
import { describe, expect, it } from 'vitest';

import { moTam } from './moTam';
import { PROMPT_INIT } from './lenhGach';

describe('moTam', () => {
  it('bắn sự kiện mang cuocId + tên tấm', () => {
    const nhan: unknown[] = [];
    const f = (e: Event): void => { nhan.push((e as CustomEvent).detail); };
    window.addEventListener('ct-agent-mo-tam', f);
    moTam('cuoc-2', 'boNho');
    moTam('cuoc-3', 'mcp');
    window.removeEventListener('ct-agent-mo-tam', f);
    expect(nhan).toEqual([{ cuocId: 'cuoc-2', ten: 'boNho' }, { cuocId: 'cuoc-3', ten: 'mcp' }]);
  });
});

describe('/init', () => {
  it('nhắm đúng file app nạp mỗi lượt và giữ nội dung người dùng đã viết', () => {
    expect(PROMPT_INIT).toContain('AGENTS.md');
    expect(PROMPT_INIT).toMatch(/GIỮ nội dung/);
  });
});
