/**
 * Giao thức trả lời mới của trợ lý CT Work (22/10/2026) — `npx tsx --test src/services/work/aiTraLoi.test.ts`
 *
 * 1. `docTraLoi`: Markdown + khối <ctw-actions> (trọn / cụt / thiếu / rác), khuôn JSON cũ (kể cả cụt), chữ trước + JSON
 *    sau ("above" — lỗi thật 22/10), Markdown có code `{` mà không có JSON (lỗi WORK_AI_BAD_OUTPUT thật) ⇒ KHÔNG BAO GIỜ
 *    mất chữ trả lời, không bao giờ ném.
 * 2. `TraLoiStreamer`: cắt luồng ở MỌI vị trí ⇒ bản nháp luôn là phần đầu câu chuẩn, không lộ nửa thẻ `<ctw-ac`, không
 *    lộ khối JSON; viết tiếp (khử phần lặp, model viết lại từ đầu), quay về mốc (cổng thử lại), giữ đầu lượt có tool.
 * 3. Tiện ích: `doDaiLap`, `tinNoiTiep`, `readsTuToolCalls`, `cacDoiTuongTron`, `docThamSoTool`.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cacDoiTuongTron, docKhoiDeXuat, docPhongBi, docTraLoi, doDaiLap, khuonTraLoi, phanHien, readsTuToolCalls, tinNoiTiep, TraLoiStreamer,
} from './aiTraLoi.js';
import { docThamSoTool } from '../interview/llm/index.js';

const ANSWER = '### LFD-368 — Refactor profile\n\n```java\npublic User load(int id) {\n  return repo.find(id); // "x"\n}\n```\n\n- **Luồng:** Controller → Service → DAO\n- Test: `ProfileServiceTest`';

// ─── docTraLoi ───

test('khuôn mới: Markdown + khối đề xuất trọn ⇒ reply sạch + actions', () => {
  const raw = `${ANSWER}\n\n<ctw-actions>\n[{"type":"add_comment","number":368,"text":"Đã đọc"}]\n</ctw-actions>`;
  const r = docTraLoi(raw);
  assert.equal(r.reply, ANSWER);
  assert.deepEqual(r.actions, [{ type: 'add_comment', number: 368, text: 'Đã đọc' }]);
  assert.equal(r.deXuat, 'ok');
  assert.equal(r.cheDo, 'text');
});

test('khuôn mới: không có khối ⇒ actions undefined, reply = cả câu (kể cả code có `{`)', () => {
  const r = docTraLoi(`\n\n${ANSWER}\n\n`);
  assert.equal(r.reply, ANSWER);
  assert.equal(r.actions, undefined);
  assert.equal(r.deXuat, 'none');
});

test('LỖI THẬT 22/10: Markdown có code `{` mà KHÔNG có JSON ⇒ chính nó là câu trả lời (trước: 502 WORK_AI_BAD_OUTPUT)', () => {
  const raw = 'Bạn cần nắm hàm sau:\n\n```js\nfunction approve(r) { if (!r.slot) { throw new Error("full"); } }\n```\nRồi test biên.';
  assert.equal(docTraLoi(raw).reply, raw);
});

test('LỖI THẬT 22/10: chữ trả lời trước + ```json {"reply":"above"} sau ⇒ giữ CHỮ, lấy actions từ khối', () => {
  const raw = `# Hôm nay bạn thuyết trình gì?\n\n${ANSWER}\n\n---\n\n\`\`\`json\n{\n  "reply": "above",\n  "actions": [{"type":"add_comment","number":1,"text":"x"}]\n}\n\`\`\``;
  const r = docTraLoi(raw);
  assert.equal(r.reply, `# Hôm nay bạn thuyết trình gì?\n\n${ANSWER}\n\n---`);
  assert.deepEqual(r.actions, [{ type: 'add_comment', number: 1, text: 'x' }]);
});

test('chữ dẫn ngắn + khối JSON kiểu cũ ⇒ reply của khối thắng (model quen tay)', () => {
  const r = docTraLoi('Here you go:\n```json\n{ "reply" : "### Việc\\n- [LFD-75](/work/x)" , "actions": [ ] }\n```');
  assert.equal(r.reply, '### Việc\n- [LFD-75](/work/x)');
});

test('khối đề xuất CỤT (chạm trần giữa khối) ⇒ giữ chữ + các đối tượng trọn', () => {
  const raw = `${ANSWER}\n<ctw-actions>\n[{"type":"add_comment","number":1,"text":"a {b} \\"c\\""},{"type":"create_issue","title":"Spi`;
  const r = docTraLoi(raw);
  assert.equal(r.reply, ANSWER);
  assert.deepEqual(r.actions, [{ type: 'add_comment', number: 1, text: 'a {b} "c"' }]);
  assert.equal(r.deXuat, 'partial');
});

test('khối đề xuất RÁC ⇒ giữ chữ, actions undefined (không bịa đề xuất)', () => {
  const r = docTraLoi(`${ANSWER}\n<ctw-actions>\nxin lỗi tôi không đề xuất gì\n</ctw-actions>`);
  assert.equal(r.reply, ANSWER);
  assert.equal(r.actions, undefined);
  assert.equal(r.deXuat, 'bad');
});

test('khối đề xuất có rào ```json, object {actions}, một đối tượng lẻ, thẻ viết HOA', () => {
  assert.deepEqual(docKhoiDeXuat('```json\n[{"type":"a"}]\n```', true).actions, [{ type: 'a' }]);
  assert.deepEqual(docKhoiDeXuat('{"actions":[{"type":"a"}]}', true).actions, [{ type: 'a' }]);
  assert.deepEqual(docKhoiDeXuat('{"type":"a"}', true).actions, [{ type: 'a' }]);
  assert.deepEqual(docTraLoi('Ok\n<CTW-ACTIONS>[{"type":"a"}]</CTW-ACTIONS>').actions, [{ type: 'a' }]);
  assert.equal(docTraLoi('Ok\n<CTW-ACTIONS>[{"type":"a"}]</CTW-ACTIONS>').reply, 'Ok');
});

test('model mở rào ``` ngay trước khối đề xuất ⇒ dòng rào lẻ bị bỏ', () => {
  assert.equal(docTraLoi('Xong.\n```\n<ctw-actions>[]</ctw-actions>\n```').reply, 'Xong.');
});

test('khuôn JSON cũ: chuẩn, cụt giữa reply, cụt giữa escape, reads, reply null', () => {
  assert.equal(docTraLoi('{"reply":"Chào","actions":[]}').reply, 'Chào');
  assert.equal(docTraLoi('{"reply":"Ngày 1: tạo repo. Tiếp theo').reply, 'Ngày 1: tạo repo. Tiếp theo');
  assert.equal(docTraLoi('{"reply":"Bắt đầu\\').reply, 'Bắt đầu');
  assert.deepEqual(docTraLoi('{"reply":"","reads":[{"tool":"read_page","number":2}]}').reads, [{ tool: 'read_page', number: 2 }]);
  assert.equal(docTraLoi('{"reply":null,"actions":[]}').reply, '');
  assert.equal(docTraLoi('```json\n{"reply":"Ok","actions":[]}\n```').reply, 'Ok');
  // reply cụt + actions cụt
  const r = docTraLoi('{"reply":"Ok nhé","actions":[{"type":"create_issue","title":"Spike"');
  assert.equal(r.reply, 'Ok nhé');
});

test('rỗng / chỉ khoảng trắng / chỉ khối đề xuất ⇒ reply rỗng (nơi gọi hỏi lại), không ném', () => {
  assert.equal(docTraLoi('').reply, '');
  assert.equal(docTraLoi('   \n ').reply, '');
  assert.equal(docTraLoi('<ctw-actions>[]</ctw-actions>').reply, '');
});

test('`{` mở đầu nhưng KHÔNG phải khối JSON ⇒ hiện nguyên chữ', () => {
  assert.equal(docTraLoi('{ đây là chữ thường }').reply, '{ đây là chữ thường }');
});

test('docPhongBi: không phải phong bì ⇒ null; actions cụt ⇒ đối tượng trọn', () => {
  assert.equal(docPhongBi('{"name":"x"}'), null);
  assert.equal(docPhongBi('không có gì'), null);
  // Vá đuôi được ⇒ giữ cả đối tượng chỉ thiếu dấu đóng; không vá được ⇒ chỉ đối tượng trọn.
  assert.deepEqual(docPhongBi('{"reply":"a","actions":[{"type":"x"},{"type":"y"')?.actions, [{ type: 'x' }, { type: 'y' }]);
  assert.deepEqual(docPhongBi('{"reply":"a","actions":[{"type":"x"},{"type":"y","n":[1,')?.actions, [{ type: 'x' }]);
});

test('cacDoiTuongTron: biết chuỗi/escape, bỏ đối tượng cụt', () => {
  assert.deepEqual(cacDoiTuongTron('[{"a":"}{"},{"b":[1,{"c":2}]},{"d":'), [{ a: '}{' }, { b: [1, { c: 2 }] }]);
  assert.deepEqual(cacDoiTuongTron('{"a":1} {"b":2}'), [{ a: 1 }, { b: 2 }]);
});

// ─── TraLoiStreamer ───

function chay(raw: string, cuts: number[], o: { giuDau?: number } = {}) {
  const ev: string[] = [];
  let draft = '';
  const s = new TraLoiStreamer((d) => { ev.push(d); draft += d; }, () => { ev.push('<RESET>'); draft = ''; }, o.giuDau ?? 0);
  let prev = 0;
  for (const c of [...cuts, raw.length]) { s.push(raw.slice(prev, c)); prev = c; }
  const truocKhiXong = draft;
  s.ketThuc();
  return { ev, draft, truocKhiXong, s };
}

const MAU: Array<{ ten: string; raw: string }> = [
  { ten: 'Markdown + khối đề xuất', raw: `${ANSWER}\n\n<ctw-actions>\n[{"type":"add_comment","number":1,"text":"<ctw"}]\n</ctw-actions>` },
  { ten: 'Markdown thường', raw: `${ANSWER}\n` },
  { ten: 'chữ + ```json phong bì cũ ("above")', raw: `${ANSWER}\n\n\`\`\`json\n{"reply":"above","actions":[]}\n\`\`\`` },
  { ten: 'JSON kiểu cũ', raw: JSON.stringify({ reply: ANSWER, actions: [] }) },
  { ten: 'rào ```json kiểu cũ', raw: `\`\`\`json\n${JSON.stringify({ reply: ANSWER })}\n\`\`\`` },
];

for (const m of MAU) {
  test(`streamer: ${m.ten} — cắt ở MỌI vị trí ⇒ nháp không reset, = câu chuẩn, không lộ thẻ/JSON`, () => {
    const chuan = docTraLoi(m.raw).reply;
    for (let i = 0; i <= m.raw.length; i++) {
      const r = chay(m.raw, [i]);
      assert.ok(!r.ev.includes('<RESET>'), `reset ở nhát ${i}`);
      assert.equal(r.draft, chuan, `nhát ${i}`);
      assert.ok(!/<ctw|"reply"|```json/i.test(r.truocKhiXong), `lộ ở nhát ${i}: ${JSON.stringify(r.truocKhiXong.slice(-40))}`);
    }
    // Từng ký tự một.
    const tung = chay(m.raw, Array.from({ length: m.raw.length }, (_, i) => i));
    assert.equal(tung.draft, chuan);
    assert.ok(!tung.ev.includes('<RESET>'));
  });
}

test('streamer: stream THẬT — nhiều delta trước khi xong (không gom tới cuối)', () => {
  const raw = `${ANSWER}\n\n${ANSWER}`;
  const r = chay(raw, Array.from({ length: Math.floor(raw.length / 10) }, (_, i) => (i + 1) * 10));
  assert.ok(r.ev.length > 10, `chỉ có ${r.ev.length} delta`);
  assert.ok(r.truocKhiXong.length > raw.length * 0.9);
});

test('streamer: viết tiếp — phần model lặp lại ở đầu đoạn mới bị cắt, nháp nối liền, không reset', () => {
  const ev: string[] = [];
  let draft = '';
  const s = new TraLoiStreamer((d) => { ev.push(d); draft += d; }, () => { ev.push('<RESET>'); draft = ''; });
  s.datMoc();
  s.push('## Phần 1\nHàm `approve()` kiểm tra slot còn trống, rồi ghi');
  s.batDauNoiTiep();
  s.push('kiểm tra slot còn trống, rồi ghi bản ghi vào bảng reservation.\n## Phần 2\nTest biên.');
  s.ketThuc();
  assert.equal(draft, '## Phần 1\nHàm `approve()` kiểm tra slot còn trống, rồi ghi bản ghi vào bảng reservation.\n## Phần 2\nTest biên.');
  assert.ok(!ev.includes('<RESET>'));
  assert.equal(docTraLoi(s.tho).reply, draft);
});

test('streamer: viết tiếp mà model VIẾT LẠI TỪ ĐẦU ⇒ lấy bản mới, không nhân đôi (reset chỉ khi nháp lệch)', () => {
  let draft = '';
  let resets = 0;
  const s = new TraLoiStreamer((d) => { draft += d; }, () => { resets++; draft = ''; });
  const dau = '# Trả lời đầy đủ cho câu hỏi của bạn về luồng duyệt đặt chỗ\nBước 1: ';
  s.datMoc();
  s.push(dau);
  s.batDauNoiTiep();
  s.push(`${dau}mở màn hình. Bước 2: bấm Duyệt.`);
  s.ketThuc();
  assert.equal(resets, 0, 'bản mới vẫn nối tiếp được nháp cũ ⇒ không cần reset');
  assert.equal(draft, `${dau}mở màn hình. Bước 2: bấm Duyệt.`);
  // Viết lại từ đầu với chữ KHÁC đoạn đã phát ⇒ reset một lần, nhận bản mới.
  let d2 = '';
  let r2 = 0;
  const s2 = new TraLoiStreamer((d) => { d2 += d; }, () => { r2++; d2 = ''; });
  s2.datMoc();
  s2.push(`${dau}bấm nhầm chỗ này`);
  s2.batDauNoiTiep();
  s2.push(`${dau}mở màn hình. Bước 2: bấm Duyệt.`);
  s2.ketThuc();
  assert.equal(r2, 1);
  assert.equal(d2, `${dau}mở màn hình. Bước 2: bấm Duyệt.`);
});

test('streamer: quay về mốc (cổng thử lại đoạn) ⇒ reset + giữ phần trước mốc', () => {
  const ev: string[] = [];
  let draft = '';
  const s = new TraLoiStreamer((d) => { ev.push(d); draft += d; }, () => { ev.push('<RESET>'); draft = ''; });
  s.datMoc();
  s.push('Phần chắc chắn. ');
  s.batDauNoiTiep();
  s.push('x'.repeat(500)); // vượt ngưỡng giữ ⇒ đã phát
  s.quayVeMoc();
  s.push('Phần viết lại.');
  s.ketThuc();
  assert.ok(ev.includes('<RESET>'));
  assert.equal(draft, 'Phần chắc chắn. Phần viết lại.');
});

test('streamer: chotDoan — cổng không stream ⇒ bù cả đoạn; stream lệch ⇒ thay đoạn', () => {
  let draft = '';
  const s = new TraLoiStreamer((d) => { draft += d; }, () => { draft = ''; });
  s.datMoc();
  s.chotDoan('Cả câu tới một lần');
  s.ketThuc();
  assert.equal(draft, 'Cả câu tới một lần');
  let d2 = '';
  const s2 = new TraLoiStreamer((d) => { d2 += d; }, () => { d2 = ''; });
  s2.datMoc();
  s2.push('Bản hỏng');
  s2.chotDoan('Bản đúng');
  s2.ketThuc();
  assert.equal(d2, 'Bản đúng');
});

test('streamer: giữ đầu lượt có tool ⇒ đoạn "để tôi đọc thêm…" không bao giờ ra ngoài; câu dài thì vẫn chảy', () => {
  const ev: string[] = [];
  const s = new TraLoiStreamer((d) => ev.push(d), () => ev.push('<RESET>'), 320);
  s.push('Tôi cần đọc thêm thông tin để xác định phần bạn sẽ thuyết trình hôm nay:\n1. Lịch họp\n2. Chi tiết issue');
  s.boHet();
  assert.deepEqual(ev, []);
  const ev2: string[] = [];
  const s2 = new TraLoiStreamer((d) => ev2.push(d), undefined, 320);
  for (const ch of ANSWER.repeat(3)) s2.push(ch);
  assert.ok(ev2.length > 50, 'qua ngưỡng ⇒ chảy từng mẩu');
});

test('streamer: không có onDelta ⇒ vẫn gom chữ thô, không ném', () => {
  const s = new TraLoiStreamer();
  s.push('a');
  s.ketThuc();
  assert.equal(s.tho, 'a');
});

test('phanHien đang stream: giữ nửa thẻ, rào json vừa mở, khoảng trắng cuối', () => {
  assert.equal(phanHien('Xong.\n<ctw-ac', false), 'Xong.');
  assert.equal(phanHien('Xong.\n```js', false), 'Xong.');
  assert.equal(phanHien('Xong.\n```json\n', false), 'Xong.');
  assert.equal(phanHien('Xong.\n\n', false), 'Xong.');
  assert.equal(phanHien('Xong.\n```js\nlet a = 1', false), 'Xong.\n```js\nlet a = 1');
});

// ─── Tiện ích ───

test('doDaiLap: chỉ cắt phần lặp ≥ 12 ký tự', () => {
  assert.equal(doDaiLap('abc rồi ghi bản ghi', 'rồi ghi bản ghi vào bảng'), 'rồi ghi bản ghi'.length);
  assert.equal(doDaiLap('abc. ', '. Tiếp'), 0);
  assert.equal(doDaiLap('', 'x'), 0);
});

test('tinNoiTiep: 3 tin, tin cuối là user (không prefill), giữ ảnh ở câu hỏi gốc', () => {
  const img = { type: 'image' as const, source: { type: 'base64' as const, media_type: 'image/png' as const, data: 'AAAA' } };
  const t = tinNoiTiep([{ type: 'text', text: 'hỏi' }, img], 'đã viết  \n');
  assert.deepEqual(t.map((m) => m.role), ['user', 'assistant', 'user']);
  assert.equal(t[1].content, 'đã viết');
  assert.ok(Array.isArray(t[0].content) && t[0].content.length === 2);
  assert.match(String(t[2].content), /Continue it EXACTLY/);
});

test('readsTuToolCalls + docThamSoTool: tool gốc ⇒ mục đọc; tham số cụt ⇒ {} + raw', () => {
  assert.deepEqual(readsTuToolCalls([
    { name: 'read_command', input: { name: 'read_issue', args: { issue: 5 } } },
    { name: 'read_page', input: { number: 3 } },
    { name: 'search_pages', input: { query: 'git' } },
    { name: 'read_issue', input: { issue: 7 } },
  ]), [
    { tool: 'command', name: 'read_issue', args: { issue: 5 } },
    { tool: 'read_page', number: 3 },
    { tool: 'search_pages', query: 'git' },
    { tool: 'command', name: 'read_issue', args: { issue: 7 } },
  ]);
  assert.deepEqual(docThamSoTool('x', '{"a":1}'), { name: 'x', input: { a: 1 } });
  assert.deepEqual(docThamSoTool('x', ''), { name: 'x', input: {} });
  assert.deepEqual(docThamSoTool('x', '{"a":'), { name: 'x', input: {}, raw: '{"a":' });
});

test('khuonTraLoi: không còn "Return ONLY JSON", có thẻ đề xuất khi được đề xuất', () => {
  const a = khuonTraLoi({ reads: true, actions: true });
  assert.ok(!/ONLY JSON/i.test(a));
  assert.match(a, /<ctw-actions>/);
  assert.match(a, /read_command/);
  assert.ok(!/ctw-actions/.test(khuonTraLoi({ reads: false, actions: false })));
});
