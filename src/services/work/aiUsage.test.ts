/**
 * Đợt 8B — phần THUẦN của sổ AI usage + checklist: npx tsx --test src/services/work/aiUsage.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV ??= 'test';

const { phanBoLuot, phanLoaiModel, targetOf, nhomProjectOf } = await import('./aiUsage.service.js');
const { checklistOf, setChecklist, pickItems } = await import('./toolRegistry/memberOps.js');

const at = (s: number) => new Date(Date.UTC(2026, 9, 19, 2, 0, s));
const turn = (id: number, s: number, extra: Partial<{ userId: number; step: string; costUsd: number; model: string }> = {}) => ({
  id, userId: extra.userId ?? 1, at: at(s), model: extra.model ?? 'gpt-6-sol', inputTokens: 100, outputTokens: 10, costUsd: extra.costUsd ?? 0.01, step: extra.step ?? 'interview',
});

describe('phanBoLuot — lượt CuongMini ⇒ dự án theo lời gọi tool trong lượt', () => {
  it('lượt có tool của dự án ⇒ tính; lượt sau không có tool ⇒ không; hai dự án ⇒ chia theo số lời gọi', () => {
    const calls = [
      { userId: 1, projectId: 10, at: at(5) }, { userId: 1, projectId: 10, at: at(6) }, { userId: 1, projectId: 20, at: at(7) },
    ];
    const r = phanBoLuot([turn(1, 30), turn(2, 300)], calls, new Set([10, 20]));
    assert.deepEqual(r.map((x) => [x.turn.id, x.projectId, Math.round(x.share * 100)]).sort(), [[1, 10, 67], [1, 20, 33]]);
  });
  it('các dòng cách nhau < 3 s là MỘT lượt (tự chuyển cổng) — cùng phần', () => {
    const r = phanBoLuot([turn(1, 30), turn(2, 31, { model: 'claude-haiku-4-5', costUsd: 0 })], [{ userId: 1, projectId: 10, at: at(10) }], new Set([10]));
    assert.deepEqual(r.map((x) => x.turn.id).sort(), [1, 2]);
  });
  it('lời gọi thuộc lượt TRƯỚC không được tính lại cho lượt sau; người khác không lẫn', () => {
    const calls = [{ userId: 1, projectId: 10, at: at(10) }, { userId: 2, projectId: 10, at: at(40) }];
    const r = phanBoLuot([turn(1, 20), turn(2, 50)], calls, new Set([10]));
    assert.deepEqual(r.map((x) => x.turn.id), [1]);
  });
  it('lượt hạn mức nhóm (nhom:p<pid>:u<chủ>) ⇒ đúng dự án đó, không cần lời gọi tool', () => {
    assert.equal(nhomProjectOf('nhom:p42:u7'), 42);
    assert.equal(nhomProjectOf('interview'), null);
    const r = phanBoLuot([turn(1, 20, { step: 'nhom:p42:u7' }), turn(2, 20, { step: 'nhom:p43:u7' })], [], new Set([42]));
    assert.deepEqual(r.map((x) => [x.turn.id, x.projectId, x.share]), [[1, 42, 1]]);
  });
  it('dự án không nằm trong phạm vi xem ⇒ không trả', () => {
    assert.deepEqual(phanBoLuot([turn(1, 20)], [{ userId: 1, projectId: 99, at: at(10) }], new Set([10])), []);
  });
});

describe('phanLoaiModel — nguồn tiền + tên CuongMini (không lộ tên thật)', () => {
  it('modelapi / chính hãng / rambo (0 $) / lạ', () => {
    assert.deepEqual(phanLoaiModel('gpt-6-sol', 0.02), { source: 'modelapi', name: 'CuongMini Solid' });
    assert.deepEqual(phanLoaiModel('gpt-6-luna', 0.01), { source: 'modelapi', name: 'CuongMini Nova' });
    assert.equal(phanLoaiModel('claude-sonnet-5-5', 0.3).source, 'chinh_hang');
    assert.equal(phanLoaiModel('claude-sonnet-5-5', 0.3).name, 'CuongMini Sonic 5.5');
    assert.equal(phanLoaiModel('claude-haiku-5-5', 0.01).name, 'CuongMini Heshin 5.5');
    assert.equal(phanLoaiModel('claude-sonnet-5-5', 0).source, 'rambo', 'gói trả trọn ghi 0 $');
    assert.equal(phanLoaiModel('claude-haiku-4-5', 0).source, 'rambo');
    const la = phanLoaiModel('some-secret-model-x', 0.1);
    assert.equal(la.source, 'modelapi');
    assert.ok(!la.name.includes('secret'));
  });
});

describe('targetOf — đối tượng của lời gọi', () => {
  it('thẻ theo số / mã; trang; không có ⇒ null', () => {
    assert.equal(targetOf({ issue: 12 }, 'NT'), 'NT-12');
    assert.equal(targetOf({ issue: '7' }, 'NT'), 'NT-7');
    assert.equal(targetOf({ issue: 'nt-3' }, 'NT'), 'NT-3');
    assert.equal(targetOf({ page: 4 }, 'NT'), 'page:4');
    assert.equal(targetOf({ markdown: 'x' }, 'NT'), null);
    assert.equal(targetOf(null, 'NT'), null);
  });
});

describe('checklist (Tự kiểm / tiêu chí chấp nhận) — đọc, chọn, tích', () => {
  const P = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
  const T = (t: string, c = false, sub?: unknown) => ({ type: 'taskItem', attrs: { checked: c }, content: [P(t), ...(sub ? [sub] : [])] });
  const doc = {
    type: 'doc', content: [
      { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tự kiểm' }] },
      { type: 'taskList', content: [T('Chạy test'), T('Review', true, { type: 'taskList', content: [T('Đặt tên biến')] })] },
      P('chữ thường'),
      { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'AC' }] },
      { type: 'taskList', content: [T('Sai mật khẩu báo lỗi')] },
    ],
  };
  it('đánh số theo thứ tự đọc (kể cả mục lồng), kèm tiêu đề mục', () => {
    const items = checklistOf(doc);
    assert.deepEqual(items.map((x) => [x.n, x.text, x.checked, x.section]), [
      [1, 'Chạy test', false, 'Tự kiểm'], [2, 'Review', true, 'Tự kiểm'], [3, 'Đặt tên biến', false, 'Tự kiểm'], [4, 'Sai mật khẩu báo lỗi', false, 'AC'],
    ]);
  });
  it('chọn theo số / chữ đúng / chữ con duy nhất; mơ hồ ⇒ lỗi', () => {
    const items = checklistOf(doc);
    assert.deepEqual(pickItems(items, [1, 'review', 'mật khẩu']).sort(), [1, 2, 4]);
    assert.throws(() => pickItems(items, ['t']), /matches/);
    assert.throws(() => pickItems(items, [9]), /does not exist/);
    assert.throws(() => pickItems(items, ['không có']), /No checklist item/);
  });
  it('tích/bỏ tích chỉ đúng mục, không đụng phần còn lại, không sửa bản gốc', () => {
    const before = JSON.stringify(doc);
    const out = setChecklist(doc, new Set([1, 3]), true);
    assert.equal(JSON.stringify(doc), before);
    assert.deepEqual(checklistOf(out).map((x) => x.checked), [true, true, true, false]);
    assert.deepEqual(checklistOf(setChecklist(out, new Set([2]), false)).map((x) => x.checked), [true, false, true, false]);
  });
});
