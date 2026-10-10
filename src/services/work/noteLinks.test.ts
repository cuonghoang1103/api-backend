/**
 * Cầu nối Notes ↔ CT Work — phần HÀM THUẦN (không chạm DB):
 *   npx tsx --test src/services/work/noteLinks.test.ts
 *
 * `issueIdsInDoc` là trái tim giữ chiều A (chip trong ghi chú) và chiều B (mục
 * "Ghi chú liên kết" trên thẻ) KHỚP nhau: mỗi lần lưu, bảng liên kết được dựng
 * lại từ đúng tập id mà nó rút ra khỏi tài liệu. Rút sai = hai chiều lệch nhau.
 * Phần kiểm quyền + ràng buộc duy nhất nằm ở noteLinks.db.test.ts (cần DB thật).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { issueIdsInDoc } from './noteLinks.service.js';

describe('issueIdsInDoc — rút id thẻ CT Work khỏi tài liệu TipTap', () => {
  it('rút id từ chip lồng sâu và bỏ trùng', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [
          { type: 'text', text: 'Xem ' },
          { type: 'ctworkIssue', attrs: { issueId: 42, key: 'SWP-7', title: 'Login' } },
          { type: 'text', text: ' và ' },
          { type: 'ctworkIssue', attrs: { issueId: 99, key: 'API-3' } },
        ] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [
            { type: 'paragraph', content: [{ type: 'ctworkIssue', attrs: { issueId: 42 } }] }, // trùng
          ] },
        ] },
      ],
    };
    assert.deepEqual(issueIdsInDoc(doc).sort((a, b) => a - b), [42, 99]);
  });

  it('chấp nhận issueId dạng chuỗi số, bỏ giá trị không hợp lệ', () => {
    const doc = { type: 'doc', content: [
      { type: 'ctworkIssue', attrs: { issueId: '7' } },
      { type: 'ctworkIssue', attrs: { issueId: 0 } },
      { type: 'ctworkIssue', attrs: { issueId: -5 } },
      { type: 'ctworkIssue', attrs: { issueId: 'abc' } },
      { type: 'ctworkIssue', attrs: {} },
      { type: 'ctworkIssue' },
    ] };
    assert.deepEqual(issueIdsInDoc(doc), [7]);
  });

  it('tài liệu không có chip ⇒ rỗng; đầu vào rác ⇒ rỗng (không ném)', () => {
    assert.deepEqual(issueIdsInDoc({ type: 'doc', content: [{ type: 'paragraph' }] }), []);
    assert.deepEqual(issueIdsInDoc(null), []);
    assert.deepEqual(issueIdsInDoc(undefined), []);
    assert.deepEqual(issueIdsInDoc('xin chào'), []);
    assert.deepEqual(issueIdsInDoc(12345), []);
  });

  it('không nhầm node khác tên là chip (bookmark/mention)', () => {
    const doc = { type: 'doc', content: [
      { type: 'bookmark', attrs: { url: 'https://x', issueId: 11 } },
      { type: 'mention', attrs: { issueId: 22 } },
    ] };
    assert.deepEqual(issueIdsInDoc(doc), []);
  });
});
