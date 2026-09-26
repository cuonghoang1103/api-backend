/**
 * Nén ngữ cảnh — thứ quyết định giá của một việc.
 *
 * Viết 15/09/2026 sau khi tìm ra một lỗ chảy tiền không có phép kiểm nào gác:
 * kết quả tool bị lược thì phần CHỮ co còn 180 ký tự, nhưng tấm ẢNH kèm theo
 * vẫn được gửi lại ở mọi lượt sau. Sổ `kyTuDaCat` chỉ đếm ký tự nên nó vẫn báo
 * "đã tiết kiệm" trong khi phần đắt nhất chưa hề bị đụng tới.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { manhLuoc, nenNguCanh, rutThamSo, tinhMoc, TRAN_NGUYEN_VAN } from './compact.js';
import type { AgentMessage } from './turn.js';

/** Một lượt gọi tool đầy đủ: model gọi → kết quả trả về. */
function luot(i: number, dai = 4000, anh = false): AgentMessage[] {
  return [
    { role: 'assistant', content: null, tool_calls: [{ id: `c${i}`, type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    {
      role: 'tool',
      tool_call_id: `c${i}`,
      content: 'x'.repeat(dai),
      ...(anh ? { anh: [{ media_type: 'image/png', data: 'A'.repeat(200_000) }] } : {}),
    },
  ] as AgentMessage[];
}

test('ít lượt thì không nén gì', () => {
  const ds = [{ role: 'user', content: 'chào' } as AgentMessage, ...Array.from({ length: 3 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  assert.equal(kq.soDaLuoc, 0);
  assert.equal(kq.kyTuDaCat, 0);
});

test('nhiều lượt thì kết quả CŨ bị lược, kết quả gần nhất giữ nguyên văn', () => {
  const ds = [{ role: 'user', content: 'chào' } as AgentMessage, ...Array.from({ length: 20 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  assert.ok(kq.soDaLuoc > 0, 'phải lược được cái gì đó');

  const tool = kq.messages.filter((m) => m.role === 'tool') as Array<{ content: string }>;
  // Cái CUỐI là cái gần hiện tại nhất — nó phải còn nguyên.
  assert.equal(tool[tool.length - 1].content.length, 4000);
  // Cái ĐẦU là cũ nhất — phải bị lược.
  assert.ok(tool[0].content.includes('đã lược'));
});

test('KHÔNG bao giờ xoá hẳn một tin nhắn role:tool', () => {
  // Giao thức đòi mỗi tool_call có đúng một tin trả lời mang đúng id. Thiếu
  // một cái là cổng từ chối CẢ LƯỢT với lỗi không nói rõ thiếu ở đâu.
  const ds = [...Array.from({ length: 20 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  const idVao = ds.filter((m) => m.role === 'tool').map((m) => (m as { tool_call_id: string }).tool_call_id);
  const idRa = kq.messages.filter((m) => m.role === 'tool').map((m) => (m as { tool_call_id: string }).tool_call_id);
  assert.deepEqual(idRa, idVao);
});

test('ẢNH kèm kết quả tool CŨ bị gỡ, không chỉ cắt chữ', () => {
  // Đây là lỗ đã chảy tiền: `...m` chở nguyên `anh` qua bước nén.
  const ds = [...Array.from({ length: 20 }, (_, i) => luot(i, 4000, i % 4 === 0)).flat()];
  const kq = nenNguCanh(ds);
  const tool = kq.messages.filter((m) => m.role === 'tool') as Array<{ content: string; anh?: unknown[] }>;

  const cuNhatCoAnh = tool[0];
  assert.equal(cuNhatCoAnh.anh, undefined, 'ảnh của kết quả cũ phải bị gỡ');
  assert.ok(cuNhatCoAnh.content.includes('ảnh đã được gỡ'), 'phải nói rõ với model là ảnh đã bị gỡ');

  // Ảnh chỉ còn ở VÙNG GIỮ NGUYÊN (thứ tự ≥ mốc). 20 kết quả ⇒ mốc 8, ảnh ở
  // 0,4,8,12,16 ⇒ còn đúng 8,12,16 (mốc bậc thang, 26/09/2026).
  assert.equal(kq.moc, 8);
  const conAnh = tool.filter((t) => Array.isArray(t.anh) && t.anh.length > 0).length;
  assert.equal(conAnh, 3, `còn ${conAnh} kết quả mang ảnh — phải đúng 3`);
});

test('ảnh của người dùng: chỉ giữ tấm của lượt GẦN NHẤT', () => {
  const anh = { type: 'image_url' as const, image_url: { url: 'data:image/png;base64,AAAA' } };
  const ds: AgentMessage[] = [
    { role: 'user', content: [{ type: 'text', text: 'ảnh 1' }, anh] },
    { role: 'assistant', content: 'đã xem' },
    { role: 'user', content: [{ type: 'text', text: 'ảnh 2' }, anh] },
  ];
  const kq = nenNguCanh(ds);
  const u = kq.messages.filter((m) => m.role === 'user') as Array<{ content: unknown[] }>;
  assert.ok(!JSON.stringify(u[0].content).includes('image_url'), 'ảnh cũ phải bị gỡ');
  assert.ok(JSON.stringify(u[1].content).includes('image_url'), 'ảnh mới nhất phải còn');
});

// ─── 26/09/2026: mốc BẬC THANG, mẩu lược có cấu trúc, rút tham số ───


/** Một lượt gọi tool với tên + tham số + nội dung tuỳ chọn. */
function goi(id: string, ten: string, args: Record<string, unknown>, noiDung: string): AgentMessage[] {
  return [
    { role: 'assistant', content: null, tool_calls: [{ id, type: 'function', function: { name: ten, arguments: JSON.stringify(args) } }] },
    { role: 'tool', tool_call_id: id, content: noiDung },
  ] as AgentMessage[];
}

test('tinhMoc: chỉ nhảy mỗi 8 kết quả', () => {
  const m = (n: number): number => tinhMoc(Array.from({ length: n }, () => 100));
  assert.equal(m(8), 0);
  assert.equal(m(9), 0);
  assert.equal(m(15), 0);
  assert.equal(m(16), 8);
  assert.equal(m(23), 8);
  assert.equal(m(24), 16);
});

test('tinhMoc: vượt trần an toàn thì dịch THEO BẬC 8, không dịch từng cái', () => {
  const to = Math.ceil(TRAN_NGUYEN_VAN / 10);
  const moc = tinhMoc(Array.from({ length: 20 }, () => to)); // mốc gốc 8, phần giữ 12 × to > trần
  assert.equal(moc % 8, 0);
  assert.ok(moc > 8, `mốc ${moc} phải dịch khỏi 8`);
});

test('TIỀN TỐ KHÔNG ĐỔI giữa hai bước liên tiếp trong cùng một bậc', () => {
  // Đây là cả lý do của mốc bậc thang: cổng rambo đệm tiền tố, tiền tố đứng yên
  // thì bước sau đọc đệm. Cửa sổ trượt cũ đổi tiền tố ở MỌI bước.
  const dung = (n: number): AgentMessage[] => [
    { role: 'user', content: 'làm việc' } as AgentMessage,
    ...Array.from({ length: n }, (_, i) => goi(`c${i}`, 'read_file', { path: `f${i}.ts` }, `dòng ${i}\n`.repeat(400))).flat(),
  ];
  const a = nenNguCanh(dung(17)).messages;   // mốc 8
  const b = nenNguCanh(dung(18)).messages;   // vẫn mốc 8
  assert.deepEqual(b.slice(0, a.length), a, 'phần đầu của bước sau phải trùng khít bước trước');

  // Sang bậc mới (24 kết quả ⇒ mốc 16) thì mới đổi.
  const c = nenNguCanh(dung(24));
  assert.equal(c.moc, 16);
});

test('mẩu lược GIỮ lỗi: dòng đầu + dòng lỗi + 3 dòng cuối', () => {
  const noiDung = [
    'Lệnh HỎNG, mã thoát 1 (4.2s).',
    ...Array.from({ length: 300 }, (_, i) => `  biên dịch mô-đun ${i} ổn`),
    'src/a.ts(12,5): error TS2345: Argument of type string is not assignable',
    ...Array.from({ length: 200 }, (_, i) => `  dòng rác ${i}`),
    'npm ERR! code ELIFECYCLE',
    'npm ERR! errno 1',
    'npm ERR! Exit status 1',
  ].join('\n');
  const m = manhLuoc('run_command', { command: 'npm run build' }, noiDung);
  assert.ok(m.includes('Lệnh HỎNG, mã thoát 1'), m);
  assert.ok(m.includes('error TS2345'), 'mất dòng lỗi đầu tiên');
  assert.ok(m.includes('npm ERR! Exit status 1'), 'mất dòng cuối — chỗ lỗi thật hay nằm');
  assert.ok(m.length < 900, `mẩu lỗi quá dài: ${m.length}`);
});

test('mẩu lược theo LOẠI: read_file nói đọc hẹp, grep giữ số dòng + 5 dòng đầu', () => {
  const r = manhLuoc('read_file', { path: 'src/boot.ts' }, 'x'.repeat(5000));
  assert.ok(r.includes('read_file src/boot.ts'));
  assert.ok(r.includes('offset/limit'));

  const g = manhLuoc('grep', { pattern: 'foo' }, Array.from({ length: 40 }, (_, i) => `a.ts:${i}: foo`).join('\n'));
  assert.ok(g.includes('40 dòng'));
  assert.ok(g.includes('a.ts:4: foo') && !g.includes('a.ts:5: foo'));

  const d = manhLuoc('web_doc', {}, `ĐẦU${'y'.repeat(3000)}CUỐI`);
  assert.ok(d.includes('ĐẦU') && d.includes('CUỐI'), 'mặc định phải giữ cả đầu lẫn cuối');
  assert.ok(d.includes('Chỉ gọi lại nếu THỰC SỰ cần nguyên văn'));
});

test('mẩu lược TẤT ĐỊNH — cùng đầu vào ra cùng chuỗi', () => {
  const nd = 'LỖI: không tìm thấy\n' + 'z\n'.repeat(500);
  assert.equal(manhLuoc('edit_file', {}, nd), manhLuoc('edit_file', {}, nd));
});

test('rút tham số tool_call CŨ: vẫn JSON hợp lệ, giữ trường ngắn, giữ cặp gọi/trả', () => {
  const dai = 'const x = 1;\n'.repeat(500);
  const ds: AgentMessage[] = [
    { role: 'user', content: 'viết file' },
    ...goi('w0', 'create_file', { path: 'src/moi.ts', content: dai }, 'Đã tạo src/moi.ts'),
    ...Array.from({ length: 20 }, (_, i) => goi(`c${i}`, 'read_file', { path: `f${i}.ts` }, 'x'.repeat(2000))).flat(),
  ];
  const kq = nenNguCanh(ds);
  const a = kq.messages.find((m) => m.role === 'assistant' && m.tool_calls?.[0]?.id === 'w0') as
    Extract<AgentMessage, { role: 'assistant' }>;
  const args = JSON.parse(a.tool_calls![0]!.function.arguments);          // ném nếu JSON hỏng
  assert.equal(args.path, 'src/moi.ts', 'trường ngắn phải giữ');
  assert.match(String(args.content), /^<đã lược \d+ ký tự>$/);

  // Mỗi tool_call vẫn có đúng một tin tool trả lời.
  const idGoi = kq.messages.flatMap((m) => (m.role === 'assistant' ? (m.tool_calls ?? []).map((c) => c.id) : []));
  const idTra = kq.messages.filter((m) => m.role === 'tool').map((m) => (m as { tool_call_id: string }).tool_call_id);
  assert.deepEqual(idTra, idGoi);

  // Lời gọi GẦN (vùng giữ nguyên) KHÔNG bị rút.
  const moiNhat = kq.messages.filter((m) => m.role === 'assistant').pop() as Extract<AgentMessage, { role: 'assistant' }>;
  assert.equal(moiNhat.tool_calls![0]!.function.arguments, JSON.stringify({ path: 'f19.ts' }));
});

test('rutThamSo: chuỗi hỏng vẫn ra JSON hợp lệ; chuỗi ngắn giữ nguyên', () => {
  assert.equal(rutThamSo('{"path":"a"}'), '{"path":"a"}');
  const hong = `{"content": "${'q'.repeat(1000)}`;
  assert.doesNotThrow(() => JSON.parse(rutThamSo(hong)));
  const mang = JSON.stringify({ path: 'a.ts', edits: Array.from({ length: 30 }, () => ({ old_string: 'aaaa', new_string: 'bbbb' })) });
  const r = JSON.parse(rutThamSo(mang));
  assert.equal(r.path, 'a.ts');
  assert.match(String(r.edits), /^<đã lược/);
});
