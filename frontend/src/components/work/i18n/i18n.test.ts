/**
 * CT Work i18n — từ điển hai bên đủ khoá như nhau, biến {x} khớp, nội suy + số nhiều + định dạng đúng, map lỗi.
 *   npx tsx --test frontend/src/components/work/i18n/i18n.test.ts
 * (tsc đã chặn thiếu/thừa khoá qua kiểu Strings<>; test này là lưới thứ hai và bắt thêm lỗi biến lệch, chuỗi rỗng.)
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { en } from './en';
import { vi } from './vi';
import { formatDate, formatNumber, interpolate, relativeTime, translate } from './core';
import { localizeError } from './errors';

const vars = (s: string) => [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();

describe('từ điển en / vi', () => {
  const E = en as unknown as Record<string, Record<string, string>>;
  const V = vi as unknown as Record<string, Record<string, string>>;

  it('cùng bộ miền', () => {
    assert.deepEqual(Object.keys(V).sort(), Object.keys(E).sort());
  });

  for (const dom of Object.keys(E)) {
    it(`miền "${dom}": cùng bộ khoá, không chuỗi rỗng, biến khớp`, () => {
      const ek = Object.keys(E[dom]).sort();
      const vk = Object.keys(V[dom] ?? {}).sort();
      assert.deepEqual(vk.filter((k) => !ek.includes(k)), [], 'vi thừa khoá');
      assert.deepEqual(ek.filter((k) => !vk.includes(k)), [], 'vi thiếu khoá');
      for (const k of ek) {
        assert.ok(E[dom][k].trim().length > 0, `en.${dom}.${k} rỗng`);
        assert.ok(V[dom][k].trim().length > 0, `vi.${dom}.${k} rỗng`);
        assert.deepEqual(vars(V[dom][k]), vars(E[dom][k]), `biến lệch ở ${dom}.${k}`);
      }
    });
  }
});

describe('nội suy', () => {
  it('thay biến, để nguyên biến không truyền', () => {
    assert.equal(interpolate('en', 'Hi {name}, {x}', { name: 'An' }), 'Hi An, {x}');
    assert.equal(interpolate('en', 'Hi {name}', { name: null }), 'Hi ');
  });
  it('số nhiều theo count (en hai vế, vi một vế)', () => {
    assert.equal(translate('en', 'common.issueCount', { count: 1 }), '1 issue');
    assert.equal(translate('en', 'common.issueCount', { count: 0 }), '0 issues');
    assert.equal(translate('en', 'common.issueCount', { count: 5 }), '5 issues');
    assert.equal(translate('vi', 'common.issueCount', { count: 5 }), '5 thẻ');
    assert.equal(translate('vi', 'common.issueCount', { count: 1 }), '1 thẻ');
  });
  it('"|" chỉ tách khi có count', () => {
    assert.equal(interpolate('en', 'a|b'), 'a|b');
    assert.equal(interpolate('en', 'a|b', { count: 2 }), 'b');
  });
  it('số theo locale', () => {
    assert.equal(translate('en', 'common.issueCount', { count: 1234 }), '1,234 issues');
    assert.equal(translate('vi', 'common.issueCount', { count: 1234 }), '1.234 thẻ');
    assert.equal(formatNumber('vi', 1234.5), '1.234,5');
  });
  it('vi thiếu ⇒ lùi en; khoá lạ ⇒ trả khoá', () => {
    assert.equal(translate('vi', 'common.save'), 'Lưu');
    assert.equal(translate('en', 'nope.nope' as never), 'nope.nope');
  });
});

describe('ngày giờ', () => {
  it('ngày lịch không lệch múi giờ', () => {
    assert.equal(formatDate('en', '2026-10-09'), 'Oct 9, 2026');
    assert.match(formatDate('vi', '2026-10-09'), /9.*10.*2026/);
  });
  it('tương đối', () => {
    const now = Date.parse('2026-10-09T12:00:00Z');
    assert.equal(relativeTime('en', '2026-10-09T11:59:40Z', now), 'just now');
    assert.equal(relativeTime('vi', '2026-10-09T11:55:00Z', now), '5 phút trước');
    assert.equal(relativeTime('en', '2026-10-09T09:00:00Z', now), '3h ago');
    assert.equal(relativeTime('vi', '2026-10-07T12:00:00Z', now), '2 ngày trước');
  });
});

describe('lỗi máy chủ ⇒ câu theo ngôn ngữ', () => {
  it('en giữ câu máy chủ, trừ mạng / 5xx', () => {
    assert.equal(localizeError('en', { status: 404, code: 'NOT_FOUND', message: 'Issue not found' }), null);
    assert.match(localizeError('en', { network: true }) ?? '', /reach the server/);
    assert.match(localizeError('en', { status: 500, message: 'Internal Server Error' }) ?? '', /server/);
  });
  it('vi theo mã, câu nguyên văn, mẫu not found / stale, mã HTTP', () => {
    assert.equal(localizeError('vi', { status: 423, code: 'WORK_EDIT_LOCKED', message: 'locked' }), 'Dự án đang khoá chỉnh sửa. Mở khoá để thay đổi.');
    assert.equal(localizeError('vi', { status: 400, message: 'Title is required' }), 'Cần nhập tiêu đề');
    assert.equal(localizeError('vi', { status: 404, message: 'Issue not found' }), 'Không tìm thấy thẻ');
    assert.equal(localizeError('vi', { status: 400, message: 'Version not found in this project' }), 'Không tìm thấy phiên bản');
    assert.equal(localizeError('vi', { status: 404, message: 'Widget not found' }), 'Không tìm thấy');
    assert.equal(localizeError('vi', { status: 409, message: 'Someone else changed this use case — reload to see their version' }), 'Có người vừa sửa use case này. Tải lại để xem bản mới nhất.');
    assert.equal(localizeError('vi', { status: 429, message: 'Too many' }), 'Bạn thao tác quá nhanh. Đợi một chút rồi thử lại.');
    assert.equal(localizeError('vi', { status: 403, code: 'FORBIDDEN', message: 'Only owners can do X' }), 'Bạn không có quyền làm việc này. (Only owners can do X)');
    assert.equal(localizeError('vi', { status: 400, message: 'Some rare message' }), null);
  });
});
