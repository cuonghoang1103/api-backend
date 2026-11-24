import { describe, expect, it, vi } from 'vitest';

vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
const { chanWebCtwork, laTrangHocLieu } = await import('./ctworkChanWeb');

/** 24/11/2026: đọc trang học liệu bằng trình duyệt ngầm ⇒ chỉ sang mcp__ctwork__hoc_tap (người dùng gặp "Log in" ở Dekiru). */
describe('chặn đọc trang học liệu bằng trình duyệt', () => {
  it('nhận đúng trang học liệu của cuongthai.com', () => {
    for (const u of [
      'https://cuongthai.com/language/ja/dekiru?bai=1',
      'https://cuongthai.com/courses/linux-bash/learn?lessonSlug=lnx-1-1',
      'https://cuongthai.com/academy/courses/elementary-japanese-1-a11/learn',
      'https://cuongthai.com/code-lab/react-practice/abc',
      'https://cuongthai.com/exam/mo-phong',
      'cuongthai.com/language/en/ielts/tap-5',
    ]) expect(laTrangHocLieu(u), u).toBe(true);
    for (const u of ['https://cuongthai.com/courses/linux-bash', 'https://cuongthai.com/', 'https://example.com/language/ja/dekiru', 'http://localhost:3000/language/ja/dekiru', '']) {
      expect(laTrangHocLieu(u), u).toBe(false);
    }
  });
  it('đọc trang (web_tai/web_doc/web_bam) ⇒ từ chối, chỉ hoc_tap; mở trang cho người xem (web_mo) vẫn được', () => {
    expect(chanWebCtwork('web_tai', { url: 'https://cuongthai.com/language/ja/dekiru?bai=1' }, '', true)).toMatch(/mcp__ctwork__hoc_tap[\s\S]*book=dekiru/);
    expect(chanWebCtwork('web_doc', {}, 'https://cuongthai.com/language/ja/dekiru?bai=1', true)).toMatch(/TỪ CHỐI/);
    expect(chanWebCtwork('web_bam', { selector: 'button' }, 'https://cuongthai.com/courses/x/learn', false)).toMatch(/gõ \/ctwork/);
    expect(chanWebCtwork('web_mo', { url: 'https://cuongthai.com/language/ja/dekiru?bai=1' }, '', true)).toBeNull();
    expect(chanWebCtwork('web_doc', {}, 'https://cuongthai.com/blog/abc', true)).toBeNull();
  });
});
