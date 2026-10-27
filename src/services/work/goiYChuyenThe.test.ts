/**
 * CT Work 27/10/2026 — CuongMini "hỏi nhanh" (gợi ý chuyển trạng thái): phần THUẦN.
 *   npx tsx --test src/services/work/goiYChuyenThe.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chonDich, isBasicIssue, nudgeVisible, type StatusLite } from './goiYChuyenTheRules.js';

const TODO: StatusLite = { id: 1, name: 'To Do', category: 'TODO' };
const PROG: StatusLite = { id: 2, name: 'In Progress', category: 'IN_PROGRESS' };
const REV: StatusLite = { id: 3, name: 'In Review', category: 'IN_PROGRESS' };
const DONE: StatusLite = { id: 4, name: 'Done', category: 'DONE' };
const ALL = [TODO, PROG, REV, DONE];
const others = (cur: StatusLite) => ALL.filter((s) => s.id !== cur.id);

describe('chọn trạng thái đích theo workflow thật', () => {
  it('code merge ⇒ Review; đang Review ⇒ KHÔNG hỏi người làm (người review quyết); cấu hình PR merged ⇒ đúng cấu hình', () => {
    assert.equal(chonDich({ statuses: ALL, current: PROG, allowed: others(PROG), kind: 'CODE_MERGED' })!.id, REV.id);
    assert.equal(chonDich({ statuses: ALL, current: REV, allowed: others(REV), kind: 'CODE_MERGED' }), null);
    assert.equal(chonDich({ statuses: ALL, current: REV, allowed: others(REV), kind: 'CHECKLIST_DONE' }), null);
    assert.equal(chonDich({ statuses: ALL, current: PROG, allowed: others(PROG), kind: 'CODE_MERGED', prMergedStatusId: DONE.id })!.id, DONE.id);
    assert.equal(chonDich({ statuses: ALL, current: PROG, allowed: others(PROG), kind: 'CODE_PUSHED', prMergedStatusId: DONE.id })!.id, REV.id, 'commit lên main không phải PR merge ⇒ Review');
  });
  it('checklist / thẻ con / thẻ cơ bản ⇒ Done; không có Review ⇒ Done; đã DONE ⇒ không gợi ý', () => {
    assert.equal(chonDich({ statuses: ALL, current: TODO, allowed: others(TODO), kind: 'BASIC_STALE' })!.id, DONE.id);
    assert.equal(chonDich({ statuses: ALL, current: PROG, allowed: others(PROG), kind: 'CHECKLIST_DONE' })!.id, DONE.id);
    const noReview = [TODO, PROG, DONE];
    assert.equal(chonDich({ statuses: noReview, current: PROG, allowed: [TODO, DONE], kind: 'CODE_MERGED' })!.id, DONE.id);
    assert.equal(chonDich({ statuses: ALL, current: DONE, allowed: others(DONE), kind: 'CHECKLIST_DONE' }), null);
  });
  it('luật transition: đích không chuyển tới được ⇒ trạng thái cùng loại chuyển được, không có ⇒ không gợi ý', () => {
    const DONE2: StatusLite = { id: 5, name: 'Closed', category: 'DONE' };
    assert.equal(chonDich({ statuses: [...ALL, DONE2], current: TODO, allowed: [PROG, DONE2], kind: 'BASIC_STALE' })!.id, DONE2.id);
    assert.equal(chonDich({ statuses: ALL, current: TODO, allowed: [PROG], kind: 'BASIC_STALE' }), null);
  });
  it('cột review chỉ định (settings.agents.reviewStatusId) thắng tên cột', () => {
    const QA: StatusLite = { id: 9, name: 'Chờ thầy xem', category: 'IN_PROGRESS' };
    assert.equal(chonDich({ statuses: [...ALL, QA], current: PROG, allowed: [REV, QA, DONE], kind: 'CODE_MERGED', reviewStatusId: QA.id })!.id, QA.id);
  });
});

describe('thẻ cơ bản + nhịp hỏi', () => {
  it('nhận ra thẻ cài đặt / đọc / tìm hiểu (Việt + Anh, nhãn)', () => {
    for (const t of ['Cài môi trường', 'Setup project', 'Đọc tài liệu SRS', 'Tìm hiểu Spring Boot', 'Install JDK 21', 'Tạo tài khoản GitHub']) assert.ok(isBasicIssue(t), t);
    for (const t of ['Màn hình đăng nhập', 'API tìm phòng', 'Fix bug thanh toán']) assert.ok(!isBasicIssue(t), t);
    assert.ok(isBasicIssue('Task 3', ['setup']));
  });
  it('chưa hỏi ⇒ hiện + mở cửa sổ; hiện tiếp 24 giờ; ẩn tới đủ 3 ngày; "Chưa" ⇒ ẩn tới hết hoãn', () => {
    const now = new Date('2026-10-27T10:00:00Z');
    const h = (n: number) => new Date(now.getTime() - n * 3_600_000);
    assert.deepEqual(nudgeVisible(null, now), { show: true, openWindow: true });
    assert.deepEqual(nudgeVisible({ lastShownAt: h(2), snoozedUntil: null }, now), { show: true, openWindow: false });
    assert.deepEqual(nudgeVisible({ lastShownAt: h(30), snoozedUntil: null }, now), { show: false, openWindow: false });
    assert.deepEqual(nudgeVisible({ lastShownAt: h(73), snoozedUntil: null }, now), { show: true, openWindow: true });
    assert.deepEqual(nudgeVisible({ lastShownAt: h(1), snoozedUntil: new Date(now.getTime() + 3_600_000) }, now), { show: false, openWindow: false });
    assert.deepEqual(nudgeVisible({ lastShownAt: h(80), snoozedUntil: h(1) }, now), { show: true, openWindow: true });
  });
});
