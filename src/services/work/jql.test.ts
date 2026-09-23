import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { compileJql, JqlError, parseJql, resolveDate, type JqlContext } from './jql.js';

const ctx: JqlContext = {
  projectKey: 'SWP',
  userId: 7,
  statuses: [
    { id: 1, name: 'To Do', category: 'TODO' }, { id: 2, name: 'In Progress', category: 'IN_PROGRESS' },
    { id: 3, name: 'Done', category: 'DONE' }, { id: 4, name: 'Open', category: 'TODO' }, { id: 5, name: 'Closed', category: 'DONE' },
  ],
  types: [{ id: 10, key: 'STORY', name: 'Story' }, { id: 11, key: 'BUG', name: 'Bug' }],
  labels: [{ id: 20, name: 'payment' }],
  components: [{ id: 30, name: 'API' }],
  members: [{ id: 7, username: 'cuong' }, { id: 8, username: 'minh' }],
  sprints: [{ id: 40, name: 'Sprint 1', state: 'CLOSED' }, { id: 41, name: 'Sprint 2', state: 'ACTIVE' }],
  customFields: [
    { id: 50, name: 'Browser', kind: 'SELECT', options: [{ id: 'o1', label: 'Chrome' }, { id: 'o2', label: 'Safari' }] },
    { id: 51, name: 'Effort', kind: 'NUMBER', options: [] },
  ],
  now: new Date('2026-09-23T12:00:00Z'),
};
const w = (q: string) => compileJql(parseJql(q), ctx).where;

describe('JQL — cú pháp', () => {
  it('AND/OR/NOT và ngoặc theo đúng độ ưu tiên (AND chặt hơn OR)', () => {
    const q = parseJql('status = Done OR priority = High AND assignee = cuong');
    assert.equal(q.where?.kind, 'or');
    const q2 = parseJql('(status = Done OR priority = High) AND NOT assignee IS EMPTY');
    assert.equal(q2.where?.kind, 'and');
  });
  it('IN, NOT IN, IS EMPTY, chuỗi có dấu nháy, hàm', () => {
    const q = parseJql('type IN (Bug, "Story") AND sprint NOT IN (closedSprints()) AND due IS NOT EMPTY');
    assert.equal(q.where?.kind, 'and');
  });
  it('ORDER BY nhiều trường; truy vấn chỉ có ORDER BY', () => {
    assert.deepEqual(parseJql('ORDER BY priority DESC, created').orderBy, [{ field: 'priority', dir: 'desc' }, { field: 'created', dir: 'asc' }]);
    assert.equal(parseJql('').where, null);
  });
  it('lỗi báo kèm vị trí', () => {
    assert.throws(() => parseJql('status = '), (e: unknown) => e instanceof JqlError && e.pos === 9);
    assert.throws(() => parseJql('status Done'), /Expected an operator/);
    assert.throws(() => parseJql('summary ~ "open'), /Unclosed quote/);
    assert.throws(() => parseJql('type IN (Bug'), /Expected "," or "\)"/);
    assert.throws(() => parseJql('status = Done extra'), /Unexpected "extra"/);
  });
});

describe('JQL — ngày', () => {
  const now = new Date('2026-09-23T12:00:00Z'); // thứ Tư
  it('tương đối và hàm', () => {
    assert.equal(resolveDate({ kind: 'literal', value: '-7d', quoted: false }, now).toISOString(), '2026-09-16T12:00:00.000Z');
    assert.equal(resolveDate({ kind: 'literal', value: '2026-09-01', quoted: false }, now).toISOString(), '2026-09-01T00:00:00.000Z');
    assert.equal(resolveDate({ kind: 'fn', name: 'startofweek', args: [] }, now).toISOString(), '2026-09-21T00:00:00.000Z');
    assert.equal(resolveDate({ kind: 'fn', name: 'startofmonth', args: ['-1'] }, now).toISOString(), '2026-08-01T00:00:00.000Z');
  });
});

describe('JQL — dịch sang Prisma', () => {
  it('trạng thái theo tên (không phân biệt hoa thường), nhóm trạng thái', () => {
    assert.deepEqual(w('status = done'), { statusId: { in: [3] } });
    assert.deepEqual(w('statusCategory != Done'), { statusId: { notIn: [3, 5] } });
  });
  it('currentUser() và EMPTY', () => {
    assert.deepEqual(w('assignee = currentUser()'), { OR: [{ assigneeId: { in: [7] } }] });
    assert.deepEqual(w('assignee IS EMPTY'), { assigneeId: null });
  });
  it('priority > High nghĩa là QUAN TRỌNG hơn (số nhỏ hơn)', () => {
    assert.deepEqual(w('priority > High'), { priority: { lt: 2 } });
    assert.deepEqual(w('priority IN (Highest, 2)'), { priority: { in: [1, 2] } });
  });
  it('mã thẻ, loại theo khoá hoặc tên, nhãn, component', () => {
    assert.deepEqual(w('key = SWP-12'), { number: { in: [12] } });
    assert.deepEqual(w('type = bug'), { typeId: { in: [11] } });
    assert.deepEqual(w('labels = payment'), { labels: { some: { labelId: { in: [20] } } } });
    assert.throws(() => w('key = ABC-1'), /not an issue key of SWP/);
  });
  it('sprint theo hàm', () => {
    assert.deepEqual(w('sprint IN openSprints()'.replace('openSprints()', '(openSprints())')), { sprintId: { in: [41] } });
  });
  it('ngày "=" là cả ngày', () => {
    assert.deepEqual(w('created = 2026-09-01'), { createdAt: { gte: new Date('2026-09-01T00:00:00Z'), lt: new Date('2026-09-02T00:00:00Z') } });
  });
  it('trường tuỳ chỉnh theo tên', () => {
    assert.deepEqual(w('Browser = Chrome'), { customValues: { some: { fieldId: 50, OR: [{ value: { equals: 'o1' } }] } } });
    assert.deepEqual(w('Effort >= 3'), { customValues: { some: { fieldId: 51, value: { gte: 3 } } } });
    assert.throws(() => w('Browser = Edge'), /not an option of Browser/);
  });
  it('tên sai báo rõ', () => {
    assert.throws(() => w('status = Shipped'), /No status "Shipped"/);
    assert.throws(() => w('assignee = ghost'), /No member "ghost"/);
    assert.throws(() => w('colour = red'), /Unknown field "colour"/);
    assert.throws(() => compileJql(parseJql('ORDER BY banana'), ctx), /Cannot order by/);
  });
  it('ORDER BY luôn kết thúc bằng rank + id (thứ tự ổn định)', () => {
    const r = compileJql(parseJql('ORDER BY priority'), ctx);
    assert.deepEqual(r.orderBy, [{ priority: 'asc' }, { rank: 'asc' }, { id: 'asc' }]);
  });
});
