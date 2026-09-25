/** Khoá chỉnh sửa: danh sách đường vẫn được ghi khi đang khoá — sai một dòng là hoặc khoá hỏng, hoặc chặn cả bình luận. */
import assert from 'node:assert/strict';
import test from 'node:test';
import { isAllowedWhileLocked } from './editLock.service.js';

test('vẫn cho: bình luận, cảm xúc, theo dõi, hỏi AI, hội thoại AI, bỏ qua đề xuất, bộ lọc', () => {
  for (const p of ['/edit-lock', '/issues/17/comments', '/issues/17/comments/5', '/issues/17/comments/5/reactions/%F0%9F%91%8D', '/issues/17/comments/5/report',
    '/issues/17/watch', '/ai/chat', '/ai/quick', '/ai/threads', '/ai/threads/4', '/ai/messages/9/retry', '/ai/messages/9/actions/0', '/filters', '/filters/3', '/dashboards/2']) {
    assert.equal(isAllowedWhileLocked(p), true, p);
  }
});

test('chặn: sửa/kéo/tạo/xoá thẻ, AI Apply, sprint, cài đặt, ghi giờ', () => {
  for (const p of ['', '/issues', '/issues/17', '/issues/17/move', '/issues/bulk', '/issues/17/custom-values', '/issues/17/worklogs', '/ai/apply',
    '/ai/messages/9/actions/0/apply', '/sprints/3/start', '/labels', '/custom-fields/2', '/archive', '/import', '/issues/17/links']) {
    assert.equal(isAllowedWhileLocked(p), false, p || '(dự án)');
  }
});
