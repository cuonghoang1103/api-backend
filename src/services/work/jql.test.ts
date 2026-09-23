import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { compileJql, JqlError, parseJql, projectScope, resolveDate, type JqlContext, type JqlMiss } from './jql.js';

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

describe('JQL — thân thiện (23/09)', () => {
  const err = (q: string) => {
    try { compileJql(parseJql(q), ctx); } catch (e) { if (e instanceof JqlError) return e; throw e; }
    throw new Error(`không lỗi: ${q}`);
  };
  it('me / myself = currentUser() trong trường người', () => {
    const cur = w('assignee = currentUser()');
    assert.deepEqual(w('assignee = me'), cur);
    assert.deepEqual(w('assignee = MYSELF'), cur);
    assert.deepEqual(w('reporter IN (me, minh)'), { OR: [{ reporterId: { in: [7, 8] } }] });
    // "me" trong dấu nháy là tên thật — không có ai tên đó thì báo lỗi.
    assert.throws(() => w('assignee = "me"'), /No member "me"/);
  });
  it('lỗi trỏ vào GIÁ TRỊ sai, không phải tên trường', () => {
    const q = 'type = Story AND status = Shipped';
    assert.equal(err(q).pos, q.indexOf('Shipped'));
    const q2 = 'labels IN (payment, paymnet)';
    assert.equal(err(q2).pos, q2.indexOf('paymnet'));
    const q3 = 'created >= yesterday';
    assert.equal(err(q3).pos, q3.indexOf('yesterday'));
    // Trường sai thì vẫn trỏ vào trường.
    assert.equal(err('status = Done AND colour = red').pos, 'status = Done AND '.length);
  });
  it('"did you mean" cho trạng thái, loại, nhãn, người, trường', () => {
    const a = err('status = "In Progres"');
    assert.equal(a.suggestion, '"In Progress"');
    assert.match(a.message, /Did you mean "In Progress"\?/);
    assert.equal(err('status = don').suggestion, 'Done');
    assert.equal(err('type = Bgu').suggestion, 'Bug');
    assert.equal(err('labels = paymnet').suggestion, 'payment');
    assert.equal(err('assignee = cuogn').suggestion, 'cuong');
    assert.equal(err('statsu = Done').suggestion, 'status');
    assert.equal(err('Browsr = Chrome').suggestion, 'Browser');
    assert.equal(err('Browser = Chrom').suggestion, 'Chrome');
    assert.equal(err('priority = Hihg').suggestion, 'High');
    assert.equal(err('ORDER BY prority').suggestion, 'priority');
    assert.equal(err('ORDER BY prority').pos, 'ORDER BY '.length);
  });
  it('không gợi ý bừa khi quá xa', () => {
    assert.equal(err('status = Shipped').suggestion, undefined);
    assert.equal(err('colour = red').suggestion, undefined);
  });
});

describe('JQL — trường project', () => {
  const NONE = { id: { in: [] } };
  const cx = { ...ctx, projectName: 'Shop App' };
  const pw = (q: string, c: JqlContext = cx) => compileJql(parseJql(q), c).where;

  it('một dự án: project = CHÍNH NÓ khớp hết, dự án khác khớp rỗng (không lỗi)', () => {
    assert.deepEqual(pw('project = SWP'), {});
    assert.deepEqual(pw('project = swp'), {});
    assert.deepEqual(pw('project = "Shop App"'), {});
    assert.deepEqual(pw('project = OTHER'), NONE);
    assert.deepEqual(pw('project != OTHER'), {});
    assert.deepEqual(pw('project != SWP'), NONE);
    assert.deepEqual(pw('project IN (QA, SWP)'), {});
    assert.deepEqual(pw('project NOT IN (QA, SWP)'), NONE);
    assert.deepEqual(pw('project IS EMPTY'), NONE);
    assert.deepEqual(pw('project IS NOT EMPTY'), {});
  });
  it('project kết hợp với điều kiện khác', () => {
    assert.deepEqual(pw('project = SWP AND status = Done'), { AND: [{}, { statusId: { in: [3] } }] });
  });
  it('nhiều dự án: project không tồn tại ở đâu ⇒ lỗi + did you mean, trỏ vào giá trị', () => {
    const c = { ...cx, knownProjects: ['SWP', 'Shop App', 'QA', 'Quality'] };
    assert.deepEqual(pw('project = QA', c), NONE);
    const q = 'status = Done AND project = SPW';
    assert.throws(() => pw(q, c), (e: unknown) => e instanceof JqlError && e.pos === q.indexOf('SPW') && e.suggestion === 'SWP' && /No project "SPW"/.test(e.message));
  });
  it('nhiều dự án: tên vắng mặt khớp rỗng và được báo lại (không ném lỗi)', () => {
    const misses: JqlMiss[] = [];
    const c: JqlContext = { ...cx, knownProjects: ['SWP', 'QA'], onMissing: (m) => misses.push(m) };
    assert.deepEqual(pw('status = Shipped', c), { statusId: { in: [] } });
    assert.deepEqual(pw('status != Shipped', c), { statusId: { notIn: [] } });
    assert.deepEqual(pw('assignee = ghost', c), { OR: [{ assigneeId: { in: [-1] } }] });
    assert.deepEqual(pw('Colour = red', c), NONE);
    assert.deepEqual(pw('Browser = Firefox', c), { customValues: { some: { fieldId: 50, OR: [{ value: { equals: '\u0000none' } }] } } });
    assert.deepEqual(misses.map((m) => [m.value, m.pos]), [['Shipped', 9], ['Shipped', 10], ['ghost', 11], ['Colour', 0], ['Firefox', 10]]);
    assert.ok(misses[0].candidates.includes('Done'));
    // Lỗi không phụ thuộc dự án (ưu tiên sai, ngày sai) vẫn ném như cũ.
    assert.throws(() => pw('priority = Hihg', c), JqlError);
  });
  it('nhiều dự án: khoá thẻ của dự án khác khớp rỗng; cùng dự án vẫn chạy', () => {
    const misses: JqlMiss[] = [];
    const c: JqlContext = { ...cx, knownProjects: ['SWP', 'QA'], onMissing: (m) => misses.push(m) };
    assert.deepEqual(pw('key = QA-7', c), { number: { in: [] } });
    assert.deepEqual(pw('key IN (QA-7, SWP-3)', c), { number: { in: [3] } });
    assert.deepEqual(pw('key > QA-7', c), NONE);
    assert.deepEqual(pw('key = 12', c), { number: { in: [12] } });
    assert.equal(misses.length, 3);
    // Một dự án (không onMissing): khoá lạ vẫn là lỗi như trước.
    assert.throws(() => pw('key = QA-7'), /not an issue key of SWP/);
  });
  it('ORDER BY project', () => {
    assert.deepEqual(compileJql(parseJql('ORDER BY project DESC'), cx).orderBy[0], { projectId: 'desc' });
  });
  it('projectScope: chỉ đọc mệnh đề project ở tầng AND ngoài cùng', () => {
    assert.deepEqual(projectScope(parseJql('project = SHOP AND status = Done')), { include: ['shop'], exclude: [] });
    assert.deepEqual(projectScope(parseJql('project IN (SHOP, QA) AND project != QA')), { include: ['shop', 'qa'], exclude: ['qa'] });
    assert.deepEqual(projectScope(parseJql('project = SHOP AND project = QA')), { include: [], exclude: [] });
    assert.deepEqual(projectScope(parseJql('project = SHOP OR status = Done')), { include: null, exclude: [] });
    assert.deepEqual(projectScope(parseJql('ORDER BY created')), { include: null, exclude: [] });
  });
});
