/**
 * Trợ lý CT Work kiểu mentor (18/10/2026) — phần THUẦN, không cần CSDL:
 *   npx tsx --test src/services/work/ai.mentor.test.ts
 *
 * 1. Hồi quy 500 ngày 18/10: model trả JSON THIẾU `actions` ⇒ `checkCommandActions(undefined)` từng gọi `.some` trên
 *    undefined ⇒ mọi câu hỏi thường của thành viên PRJ301 nhận 500.
 * 2. Các chỗ khác trong luồng chat có thể vỡ khi model trả JSON lệch: `reply` null/mảng/object, `reads` lệch từng mục,
 *    câu trả lời rỗng (từng lưu thành tin nhắn TRỐNG).
 * 3. Nhận ý định câu hỏi + link nội bộ.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { answerOf, askWithReads, checkCommandActions, coerceReply, parseReads, readModelOutput, _setAskForTests } from './ai.service.js';
import { askIntent, internalRefs, workLinks } from './aiMentor.js';
import type { ProjectAccess } from './permissions.js';

// checkCommandActions chỉ chạm `access` khi có đề xuất `command` — các ca dưới không có ⇒ không cần CSDL.
const NO_ACCESS = {} as ProjectAccess;

test('hồi quy 18/10: JSON thiếu `actions` (undefined) ⇒ không ném, không đề xuất', async () => {
  assert.deepEqual(await checkCommandActions(undefined, NO_ACCESS), { kept: [], rejected: [] });
});

test('`actions` lệch kiểu (null, object, chuỗi, số) ⇒ coi như không đề xuất, không ném', async () => {
  for (const raw of [null, { type: 'add_comment', number: 1, text: 'x' }, 'create_issue', 42, true]) {
    assert.deepEqual(await checkCommandActions(raw, NO_ACCESS), { kept: [], rejected: [] }, JSON.stringify(raw));
  }
});

test('mảng lẫn rác: giữ đề xuất hợp lệ, ghi lý do cho `command` sai khung', async () => {
  const r = await checkCommandActions([null, 7, 'x', { type: 'add_comment', number: 3, text: 'ok' }, { type: 'command', args: [] }], NO_ACCESS);
  assert.deepEqual(r.kept, [{ type: 'add_comment', number: 3, text: 'ok' }]);
  assert.equal(r.rejected.length, 1);
  assert.match(r.rejected[0].error, /not shaped/);
});

test('readModelOutput: JSON chỉ xin đọc (không có reply) vẫn đọc được — reply rỗng', () => {
  const o = readModelOutput('{"reads":[{"tool":"read_page","number":2}]}');
  assert.equal(o.reply, '');
  assert.deepEqual(o.reads, [{ tool: 'read_page', number: 2 }]);
});

test('readModelOutput: reply null / mảng / object ⇒ chuỗi; chữ thường ⇒ chính nó', () => {
  assert.equal(readModelOutput('{"reply":null,"actions":[]}').reply, '');
  assert.equal(readModelOutput('{"reply":["Dòng 1","Dòng 2"]}').reply, 'Dòng 1\nDòng 2');
  assert.equal(readModelOutput('{"reply":{"markdown":"**Xin chào**"}}').reply, '**Xin chào**');
  assert.equal(readModelOutput('Chỉ là chữ thường thôi.').reply, 'Chỉ là chữ thường thôi.');
  assert.equal(readModelOutput('```json\n{"reply":"Ok","actions":[]}\n```').reply, 'Ok');
  assert.equal(coerceReply(12), '12');
});

test('answerOf (luyện bảo vệ / việc một chạm): reply lệch kiểu ⇒ chuỗi; rỗng ⇒ 502 thay vì lưu tin trống', () => {
  assert.equal(answerOf('{"reply":["a","b"],"actions":[]}').reply, 'a\nb');
  assert.equal(answerOf('Chữ thường').reply, 'Chữ thường');
  assert.throws(() => answerOf('{"reply":null}'), (e: { code?: string }) => e.code === 'WORK_AI_BAD_OUTPUT');
  assert.throws(() => answerOf('{"actions":[]}'), (e: { code?: string }) => e.code === 'WORK_AI_BAD_OUTPUT');
});

test('parseReads: sửa dạng lệch hay gặp, bỏ mục hỏng, giữ mục tốt', () => {
  const { reads, dropped } = parseReads([
    { tool: 'read_page', number: '3' },                       // số dạng chuỗi
    { tool: 'read_issue', issue: 12 },                         // tool là TÊN LỆNH, tham số nằm ngoài args
    { name: 'read_attachment', args: '{"attachment":5}' },     // thiếu tool, args là chuỗi JSON
    { tool: 'command', name: 'member_work', user: 'khoa' },    // tham số nằm ngoài args
    { tool: 'search_pages', query: 'git' },
    'rác', null, { tool: 'read_page', number: -1 }, { tool: 'command' },
  ]);
  assert.deepEqual(reads, [
    { tool: 'read_page', number: 3 },
    { tool: 'command', name: 'read_issue', args: { issue: 12 } },
    { tool: 'command', name: 'read_attachment', args: { attachment: 5 } },
    { tool: 'command', name: 'member_work', args: { user: 'khoa' } },
    { tool: 'search_pages', query: 'git' },
  ]);
  assert.equal(dropped, 4);
  assert.deepEqual(parseReads(undefined), { reads: [], dropped: 0 });
  assert.deepEqual(parseReads({ tool: 'read_page', number: 1 }).reads, [{ tool: 'read_page', number: 1 }], 'một object thay vì mảng');
});

test('askWithReads: trả lời rỗng ⇒ hỏi lại MỘT lần "trả lời ngay"; vẫn rỗng ⇒ 502, không lưu câu trống', async () => {
  const seen: string[] = [];
  let replies = ['{"actions":[]}', '{"reply":"Đây là câu trả lời"}'];
  _setAskForTests(async (_s, u) => { seen.push(u); return replies.shift() ?? '{"reply":""}'; });
  try {
    const r = await askWithReads(1, NO_ACCESS, 'sys', 'Hỏi gì đó', 100, false);
    assert.equal(r.reply, 'Đây là câu trả lời');
    assert.equal(r.stats.calls, 2);
    assert.match(seen[1], /Answer the user NOW/);

    replies = ['{"reply":""}', '{"reply":null}'];
    await assert.rejects(askWithReads(1, NO_ACCESS, 'sys', 'Hỏi', 100, false), (e: { code?: string }) => e.code === 'WORK_AI_BAD_OUTPUT');
  } finally {
    _setAskForTests(null);
  }
});

test('askWithReads: câu trả lời thường ⇒ đúng MỘT lượt gọi, actions đi qua nguyên vẹn', async () => {
  _setAskForTests(async () => '{"reply":"Xong","actions":[{"type":"add_comment","number":1,"text":"hi"}]}');
  try {
    const r = await askWithReads(1, NO_ACCESS, 'sys', 'Hỏi', 100, false);
    assert.equal(r.stats.calls, 1);
    assert.equal(r.reply, 'Xong');
    assert.ok(Array.isArray(r.actions));
  } finally {
    _setAskForTests(null);
  }
});

test('askIntent: câu hỏi kiểu thành viên', () => {
  const a = askIntent('Việc của tôi tuần này là gì?', 'NT');
  assert.equal(a.myWork, true);
  assert.equal(a.change, false);
  const b = askIntent('Thẻ NT-3 em cần đọc gì trước khi làm?', 'NT');
  assert.deepEqual(b.issues, [3]);
  assert.equal(b.understand, true);
  assert.equal(b.change, false);
  assert.deepEqual(askIntent('Giải thích yêu cầu của thẻ 12 và #14', 'NT').issues, [12, 14]);
  assert.equal(askIntent('What should I work on next?', 'NT').myWork, true);
  assert.equal(askIntent('Tạo 3 subtask cho NT-3', 'NT').change, true);
  assert.equal(askIntent('Add a boundary test for register', 'NT').change, true);
  assert.deepEqual(askIntent('Tuần 6 họp gì?', 'NT').issues, [], '"tuần 6" không phải số thẻ');
});

test('internalRefs: link Docs/thẻ CỦA dự án này (tương đối lẫn tuyệt đối); dự án khác bỏ qua', () => {
  const L = workLinks('nhom-3', 'NT');
  assert.equal(L.issue(4), '/work/nhom-3/NT/issue/4');
  assert.equal(L.doc(2), '/work/nhom-3/NT/docs/2');
  const r = internalRefs('Đọc [hướng dẫn](/work/nhom-3/NT/docs/1) và https://cuongthai.com/work/nhom-3/NT/docs/7, xem /work/nhom-3/NT/issue/9; bỏ /work/khac/NT/docs/5 và /work/nhom-3/AB/docs/6', L);
  assert.deepEqual(r, { docs: [1, 7], issues: [9] });
});
