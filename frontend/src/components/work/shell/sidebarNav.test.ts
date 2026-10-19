/**
 * Đợt 8D — thanh bên dự án gọn (lõi thuần). Chạy từ gốc repo:
 *   npx tsx --test frontend/src/components/work/shell/sidebarNav.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { coreFor, foldSearch, isCustomized, isPrimary, matchesQuery, primaryOrder, sidebarKind, togglePin } from './sidebarNav';

describe('sidebarNav — bộ cốt lõi theo loại dự án', () => {
  it('PERSONAL chỉ Board · Thẻ · Docs · Lịch', () => {
    assert.deepEqual(coreFor({ kind: 'PERSONAL', template: 'BLANK', type: 'KANBAN' }), ['board', 'list', 'docs', 'timeline']);
  });
  it('SOFTWARE có Backlog/Code/Phát hành; Kanban bỏ Backlog', () => {
    assert.deepEqual(coreFor({ kind: 'SOFTWARE', type: 'SCRUM' }), ['backlog', 'board', 'list', 'docs', 'chat', 'code', 'releases']);
    assert.equal(coreFor({ kind: 'SOFTWARE', type: 'KANBAN' }).includes('backlog'), false);
  });
  it('CLIENT thêm Phê duyệt + Cổng khách; SCHOOL thêm Chat/Họp/Nộp bài', () => {
    const c = coreFor({ kind: 'CLIENT', type: 'SCRUM' });
    assert.ok(c.includes('approvals') && c.includes('portal'));
    const s = coreFor({ kind: 'SCHOOL', type: 'SCRUM' });
    for (const x of ['backlog', 'chat', 'meetings', 'submit']) assert.ok(s.includes(x), x);
  });
  it('mẫu môn học thêm mục dùng hằng ngày', () => {
    assert.ok(coreFor({ kind: 'SCHOOL', template: 'SWT301' }).includes('tests'));
    assert.ok(coreFor({ kind: 'SCHOOL', template: 'SWR302' }).includes('wiegers'));
  });
  it('dự án cũ thiếu kind ⇒ suy từ mẫu', () => {
    assert.equal(sidebarKind({ template: 'FREELANCE' }), 'CLIENT');
    assert.equal(sidebarKind({ template: 'SWP391' }), 'SCHOOL');
    assert.equal(sidebarKind({ kind: null, template: 'BLANK' }), 'SOFTWARE');
    assert.equal(sidebarKind({ kind: 'PERSONAL', template: 'FREELANCE' }), 'PERSONAL');
  });
});

describe('sidebarNav — ghim / bỏ ghim', () => {
  const core = ['board', 'list', 'docs', 'timeline'];
  it('chưa tuỳ chỉnh ⇒ đúng bộ cốt lõi', () => {
    assert.deepEqual(primaryOrder(core, undefined), core);
    assert.equal(isPrimary('raid', core, undefined), false);
    assert.equal(isCustomized(undefined), false);
  });
  it('ghim mục ngoài cốt lõi ⇒ lên cuối nhóm chính; bỏ ghim ⇒ về Thêm', () => {
    const a = togglePin('raid', true, core, undefined);
    assert.deepEqual(a, { pin: ['raid'], hide: [] });
    assert.deepEqual(primaryOrder(core, a), [...core, 'raid']);
    const b = togglePin('raid', false, core, a);
    assert.deepEqual(b, { pin: [], hide: [] });
    assert.equal(isCustomized(b), false);
  });
  it('bỏ ghim mục cốt lõi ⇒ ẩn khỏi nhóm chính; ghim lại ⇒ về đúng chỗ', () => {
    const a = togglePin('timeline', false, core, undefined);
    assert.deepEqual(primaryOrder(core, a), ['board', 'list', 'docs']);
    const b = togglePin('timeline', true, core, a);
    assert.deepEqual(primaryOrder(core, b), core);
  });
  it('ghim hai lần không trùng', () => {
    const a = togglePin('okrs', true, core, togglePin('okrs', true, core, undefined));
    assert.deepEqual(a.pin, ['okrs']);
  });
});

describe('sidebarNav — tìm mục', () => {
  it('bỏ dấu, nhiều từ, khớp tên phụ', () => {
    assert.equal(foldSearch('Họp  Đặc tả'), 'hop  dac ta');
    assert.ok(matchesQuery('hop', 'Họp'));
    assert.ok(matchesQuery('phe duyet', 'Phê duyệt'));
    assert.ok(matchesQuery('meet', 'Họp', 'meetings'));
    assert.equal(matchesQuery('raid xyz', 'RAID'), false);
    assert.ok(matchesQuery('   ', 'bất kỳ'));
  });
});
