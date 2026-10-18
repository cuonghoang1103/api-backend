/**
 * Phép kiểm THUẦN (không CSDL, không mạng) của cổng Claude chính hãng.
 * Phần cần CSDL + máy chủ Anthropic giả: `chinhHang.db.test.ts`.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { gocChinhHang, modelChinhHangTu, modelFree, modelTuongDuong, laMaChinhHang, dungFallbacks, effortTheoMuc } from './cauHinh.js';
import { chonModelPhu, docMucModelPhu } from './modelPhu.js';
import { sapTool, thanAnToan } from './thanYeuCau.js';
import { tinhUsd, giaCua } from './gia.js';
import { phanLoaiLoi, ganCache } from './goi.js';
import { docKhoaMoiTruong, dauChuKy, chuKyKe } from './khoKey.js';
import { giaiMaKhoa, maHoaKhoa, duoiKhoa } from './maHoa.js';

test('phân loại lỗi HTTP ⇒ đúng hành động chuyển key', () => {
  const credit = '{"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."}}';
  assert.equal(phanLoaiLoi(400, credit), 'hetCredit');
  assert.equal(phanLoaiLoi(402, '{"error":{"type":"billing_error"}}'), 'hetCredit');
  assert.equal(phanLoaiLoi(401, '{"error":{"type":"authentication_error"}}'), 'loi');
  assert.equal(phanLoaiLoi(403, '{"error":{"type":"permission_error"}}'), 'loi');
  for (const s of [429, 529, 500, 502, 503, 408]) assert.equal(phanLoaiLoi(s, ''), 'thuKeKe', String(s));
  // 400 KHÔNG phải credit = yêu cầu sai ⇒ key nào cũng trả y hệt ⇒ không xoay key.
  assert.equal(phanLoaiLoi(400, '{"error":{"type":"invalid_request_error","message":"messages: field required"}}'), 'tatDinh');
  assert.equal(phanLoaiLoi(413, ''), 'tatDinh');
});

test('USD theo bảng giá chính thức — gồm đọc/ghi đệm, bậc prompt dài của Haiku 5.5', () => {
  // Sonnet 5.5: $2 vào, $10 ra, đọc đệm $0,20, ghi đệm $2,50.
  assert.equal(tinhUsd('claude-sonnet-5-5', { input: 1_000_000, output: 0, cacheDoc: 0, cacheGhi: 0 }), 2);
  assert.equal(tinhUsd('claude-sonnet-5-5', { input: 0, output: 1_000_000, cacheDoc: 0, cacheGhi: 0 }), 10);
  assert.equal(tinhUsd('claude-sonnet-5-5', { input: 0, output: 0, cacheDoc: 1_000_000, cacheGhi: 0 }), 0.2);
  assert.equal(tinhUsd('claude-sonnet-5-5', { input: 0, output: 0, cacheDoc: 0, cacheGhi: 1_000_000 }), 2.5);
  // Opus 5.5 đọc đệm $0,20; Fable 5.1 đọc đệm $0,25.
  assert.equal(giaCua('claude-opus-5-5').cacheDoc, 0.2);
  assert.equal(giaCua('claude-fable-5-1').cacheDoc, 0.25);
  assert.equal(tinhUsd('claude-fable-5-1', { input: 100_000, output: 10_000, cacheDoc: 0, cacheGhi: 0 }), 1.5);
  // Haiku 5.5: ≤100K ⇒ $0,10/$0,50; >100K ⇒ $0,50/$2,50.
  assert.equal(tinhUsd('claude-haiku-5-5', { input: 100_000, output: 0, cacheDoc: 0, cacheGhi: 0 }), 0.01);
  assert.equal(tinhUsd('claude-haiku-5-5', { input: 200_000, output: 0, cacheDoc: 0, cacheGhi: 0 }), 0.1);
  // Model lạ ⇒ giá Opus cũ (đắt) — không bao giờ đếm thiếu.
  assert.equal(tinhUsd('claude-moi-tinh', { input: 1_000_000, output: 0, cacheDoc: 0, cacheGhi: 0 }), 5);
});

test('giá sửa được bằng env ANTHROPIC_CHINH_HANG_GIA', (t) => {
  const cu = process.env.ANTHROPIC_CHINH_HANG_GIA;
  t.after(() => { if (cu === undefined) delete process.env.ANTHROPIC_CHINH_HANG_GIA; else process.env.ANTHROPIC_CHINH_HANG_GIA = cu; });
  process.env.ANTHROPIC_CHINH_HANG_GIA = JSON.stringify({ 'claude-sonnet-5-5': { in: 3 } });
  assert.equal(giaCua('claude-sonnet-5-5').in, 3);
  assert.equal(giaCua('claude-sonnet-5-5').out, 10, 'trường thiếu giữ giá trong bảng');
  process.env.ANTHROPIC_CHINH_HANG_GIA = '{hỏng';
  assert.equal(giaCua('claude-sonnet-5-5').in, 2, 'JSON hỏng ⇒ bảng mặc định');
});

test('đọc ANTHROPIC_CHINH_HANG_KEYS: thứ tự ưu tiên + nhãn/ngân sách/ngày tuỳ chọn', () => {
  const k1 = 'sk-ant-usr-' + 'a'.repeat(30);
  const k2 = 'sk-ant-usr-' + 'b'.repeat(30);
  const k3 = 'sk-ant-usr-' + 'c'.repeat(30);
  const ds = docKhoaMoiTruong(`Key 2|100|${k2}, Key 1|200|15|${k1}\n${k3}`);
  assert.deepEqual(ds.map((d) => [d.nhan, d.nganSach, d.ngayLamMoi, d.khoa]), [
    ['Key 2', 100, 1, k2],
    ['Key 1', 200, 15, k1],
    ['Key 3', 0, 1, k3],
  ]);
  assert.deepEqual(docKhoaMoiTruong(''), []);
  assert.deepEqual(docKhoaMoiTruong('nhan|ngan'), [], 'mục không có khoá thật bị bỏ');
});

test('chu kỳ tháng theo giờ Việt Nam', () => {
  // 17/10/2026 10:00 VN = 03:00Z. Ngày làm mới 15 ⇒ chu kỳ từ 15/10 00:00 VN = 14/10 17:00Z.
  const luc = new Date('2026-10-17T03:00:00Z');
  assert.equal(dauChuKy(15, luc).toISOString(), '2026-10-14T17:00:00.000Z');
  assert.equal(chuKyKe(15, luc).toISOString(), '2026-11-14T17:00:00.000Z');
  // Ngày làm mới 20 chưa tới ⇒ chu kỳ bắt đầu 20/09.
  assert.equal(dauChuKy(20, luc).toISOString(), '2026-09-19T17:00:00.000Z');
  // Biên: 31/10 23:30 VN (16:30Z) vẫn thuộc tháng 10.
  assert.equal(dauChuKy(1, new Date('2026-10-31T16:30:00Z')).toISOString(), '2026-09-30T17:00:00.000Z');
  // Qua tháng Giêng.
  assert.equal(dauChuKy(10, new Date('2027-01-05T00:00:00Z')).toISOString(), '2026-12-09T17:00:00.000Z');
});

test('mã hoá key: giải lại đúng, không lộ khoá, đổi bí mật thì không giải được', (t) => {
  const cu = { a: process.env.APP_ENCRYPTION_KEY, j: process.env.JWT_SECRET };
  t.after(() => {
    if (cu.a === undefined) delete process.env.APP_ENCRYPTION_KEY; else process.env.APP_ENCRYPTION_KEY = cu.a;
    if (cu.j === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = cu.j;
  });
  const khoa = 'sk-ant-usr-' + 'x'.repeat(40) + 'WXYZ';
  delete process.env.APP_ENCRYPTION_KEY;
  process.env.JWT_SECRET = 'bi-mat-thu';
  const j = maHoaKhoa(khoa);
  assert.match(j, /^j1\./);
  assert.ok(!j.includes('xxxx'), 'chuỗi mã hoá không được chứa khoá thô');
  assert.equal(giaiMaKhoa(j), khoa);
  assert.equal(duoiKhoa(khoa), 'WXYZ');
  process.env.APP_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
  const v = maHoaKhoa(khoa);
  assert.match(v, /^v1\./, 'có APP_ENCRYPTION_KEY ⇒ dùng utils/crypto.ts');
  assert.equal(giaiMaKhoa(v), khoa);
  assert.equal(giaiMaKhoa(j), khoa, 'token cũ dạng j1 vẫn giải được');
  process.env.JWT_SECRET = 'bi-mat-khac';
  assert.throws(() => giaiMaKhoa(j));
});

test('prompt caching: tool cuối + system + 2 tin user cuối; prefill ⇒ thêm tin user; ≤ 4 mốc', () => {
  const body = {
    system: 'Bạn là agent.',
    tools: [{ name: 'a', input_schema: {} }, { name: 'b', input_schema: {} }],
    messages: [
      { role: 'user', content: 'hỏi' },
      { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: 's' }, { type: 'tool_use', id: 't1', name: 'a', input: {} }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't1', content: 'kq' }] },
      { role: 'assistant', content: [{ type: 'text', text: 'đang viết dở' }] },
    ] as Array<{ role: string; content: unknown }>,
  };
  ganCache(body);
  assert.deepEqual(body.system, [{ type: 'text', text: 'Bạn là agent.', cache_control: { type: 'ephemeral' } }]);
  assert.equal((body.tools[1] as any).cache_control?.type, 'ephemeral');
  assert.equal((body.tools[0] as any).cache_control, undefined);
  assert.equal(body.messages.at(-1)!.role, 'user', 'model 5.5 từ chối prefill ⇒ tin cuối phải là user');
  assert.equal((body.messages.at(-1)!.content as any[])[0].cache_control.type, 'ephemeral');
  assert.equal((body.messages[2]!.content as any[])[0].cache_control?.type, 'ephemeral', 'mốc trượt ở tin user kế cuối');
  assert.ok(!JSON.stringify(body.messages[1]).includes('cache_control'), 'không gắn mốc vào khối thinking/assistant');
  const soMoc = JSON.stringify(body).match(/cache_control/g)!.length;
  assert.equal(soMoc, 4);
  // pause_turn: giữ assistant cuối, không thêm tin.
  const b2 = { messages: [{ role: 'user', content: 'x' }, { role: 'assistant', content: [{ type: 'server_tool_use', id: 's', name: 'web_search', input: {} }] }] };
  ganCache(b2, true);
  assert.equal(b2.messages.at(-1)!.role, 'assistant');
});

test('thứ tự tool ổn định bất kể thứ tự app gửi', () => {
  const a = sapTool([{ name: 'read_file' }, { name: 'bash' }, { name: 'mcp__x' }]);
  const b = sapTool([{ name: 'mcp__x' }, { name: 'read_file' }, { name: 'bash' }]);
  assert.deepEqual(a, b);
});

test('effort theo đúng mức người dùng, mặc định high (không tự hạ)', (t) => {
  const cu = process.env.ANTHROPIC_CHINH_HANG_EFFORT;
  t.after(() => { if (cu === undefined) delete process.env.ANTHROPIC_CHINH_HANG_EFFORT; else process.env.ANTHROPIC_CHINH_HANG_EFFORT = cu; });
  delete process.env.ANTHROPIC_CHINH_HANG_EFFORT;
  assert.deepEqual(['thap', 'vua', 'cao', 'ratCao', 'toiDa', 'ultracode'].map(effortTheoMuc), ['low', 'medium', 'high', 'xhigh', 'max', 'max']);
  assert.equal(effortTheoMuc(undefined), 'high');
  assert.equal(effortTheoMuc('la'), 'high');
  process.env.ANTHROPIC_CHINH_HANG_EFFORT = 'xhigh';
  assert.equal(effortTheoMuc(undefined), 'xhigh', 'env chỉ đổi MẶC ĐỊNH');
  assert.equal(effortTheoMuc('thap'), 'low', 'lựa chọn người dùng thắng env');
});

test('bản tối giản: bỏ beta + khối thinking/compaction, giữ adaptive', () => {
  const than = {
    model: 'claude-sonnet-5-5', stream: true, max_tokens: 1,
    thinking: { type: 'adaptive', block_binding: { prefix_mismatch_behavior: 'drop_block' } },
    context_management: { edits: [] }, fallbacks: 'default',
    messages: [{ role: 'user', content: 'a' }, { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: 's' }, { type: 'compaction', content: 'x' }, { type: 'text', text: 'b' }] }],
  };
  const r = thanAnToan(than as any);
  assert.deepEqual(r.thinking, { type: 'adaptive' });
  assert.equal(r.context_management, undefined);
  assert.equal(r.fallbacks, undefined);
  assert.deepEqual(r.messages[1]!.content, [{ type: 'text', text: 'b' }]);
  assert.ok(than.context_management, 'không sửa bản gốc');
});

test('agent phụ chọn model theo việc, không bao giờ đắt hơn model chính', () => {
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-opus-5-5', muc: 'nhanh' }), 'claude-haiku-5-5');
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-opus-5-5', muc: 'can_bang' }), 'claude-sonnet-5-5');
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-fable-5-1', muc: 'manh' }), 'claude-fable-5-1');
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-sonnet-5-5', muc: 'manh' }), 'claude-sonnet-5-5');
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-haiku-5-5', muc: 'can_bang' }), 'claude-haiku-5-5', 'không nâng lên đắt hơn');
  assert.equal(chonModelPhu({ cong: 'anthropic', modelChinh: 'claude-opus-5-5', muc: undefined }), 'claude-opus-5-5', 'mặc định kế thừa');
  assert.equal(chonModelPhu({ cong: 'rambo', modelChinh: 'claude-opus-5', muc: 'nhanh' }), 'claude-haiku-4-5');
  assert.equal(chonModelPhu({ cong: 'rambo', modelChinh: 'claude-opus-5', muc: 'can_bang' }), 'claude-sonnet-5');
  assert.equal(docMucModelPhu('haiku'), 'nhanh', 'khoá model: của .claude/agents/*.md');
  assert.equal(docMucModelPhu('inherit'), 'ke_thua');
  assert.equal(docMucModelPhu('gpt-9'), 'ke_thua');
});

test('danh sách trắng model chính hãng', () => {
  assert.equal(modelChinhHangTu('cl-free')?.model, modelFree());
  assert.equal(modelChinhHangTu('cl-free')?.hang, 'free');
  /* 18/10/2026: mã chuẩn nay là `cm-*` (bảng CuongMini); `cl-*` còn là bí danh. */
  assert.equal(modelChinhHangTu('cl-haiku-5-5')?.id, 'cm-heshin', 'bí danh cũ');
  assert.equal(modelChinhHangTu('cl-free')?.id, 'cm-heshin');
  assert.equal(modelChinhHangTu('cl-opus-5-5')?.model, 'claude-opus-5-5');
  assert.equal(modelChinhHangTu('cl-opus-5-5')?.hang, 'cao');
  assert.equal(modelChinhHangTu('cm-sonic')?.hang, 'free', 'Sonic 5.5 thuộc nhóm free (18/10/2026)');
  assert.equal(modelChinhHangTu('cm-solid'), null, 'Solid ở cổng modelapi, không phải chính hãng');
  assert.equal(modelChinhHangTu('cl-khong-co'), null);
  assert.equal(modelChinhHangTu('sonnet-5'), null);
  assert.ok(laMaChinhHang('cl-sonnet-5-5'));
  assert.equal(modelTuongDuong('claude-opus-4-8'), 'claude-opus-5-5');
  assert.equal(modelTuongDuong('claude-sonnet-5'), 'claude-sonnet-5-5');
  assert.equal(modelTuongDuong('claude-haiku-4-5'), 'claude-haiku-5-5');
  assert.ok(dungFallbacks('claude-opus-5-5'));
  assert.ok(!dungFallbacks('claude-haiku-5-5'), 'Haiku 5.5 không có lùi phía máy chủ');
});

test('chốt an toàn: đang test mà trỏ api.anthropic.com thật ⇒ ném', (t) => {
  const cu = process.env.ANTHROPIC_CHINH_HANG_BASE_URL;
  t.after(() => { if (cu === undefined) delete process.env.ANTHROPIC_CHINH_HANG_BASE_URL; else process.env.ANTHROPIC_CHINH_HANG_BASE_URL = cu; });
  delete process.env.ANTHROPIC_CHINH_HANG_BASE_URL;
  assert.throws(() => gocChinhHang(), /máy chủ giả/);
  process.env.ANTHROPIC_CHINH_HANG_BASE_URL = 'http://127.0.0.1:9/';
  assert.equal(gocChinhHang(), 'http://127.0.0.1:9');
});
