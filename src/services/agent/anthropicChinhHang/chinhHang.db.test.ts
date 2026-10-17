/**
 * Cổng Claude chính hãng — kiểm CÓ CSDL + máy chủ Anthropic GIẢ trên 127.0.0.1.
 * KHÔNG BAO GIỜ gọi api.anthropic.com thật (`gocChinhHang()` ném nếu trỏ vào đó lúc test).
 *
 *   WORK_DB_TEST=1 DATABASE_URL=postgresql://…/csdl_test_trong \
 *     npx tsx --test src/services/agent/anthropicChinhHang/chinhHang.db.test.ts
 *
 * Bỏ qua khi không có WORK_DB_TEST=1. CSDL phải là CSDL TEST (dựng bằng
 * `scripts/db-test-tu-migration.mjs`) — test XOÁ sạch các bảng anthropic_*.
 */
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import test, { after, before, beforeEach } from 'node:test';

const BAT = process.env.WORK_DB_TEST === '1';

type HanhVi = 'ok' | 'credit' | '401' | '429' | '529' | 'badreq' | 'betaloi';
const hanhViKey = new Map<string, HanhVi>();
const daGoi: Array<{ duong: string; key: string; beta: string | undefined; body: any }> = [];
let ramboStatus = 502;

function sse(res: http.ServerResponse, mau: unknown[]): void {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  for (const m of mau) res.write(`data: ${JSON.stringify(m)}\n\n`);
  res.end();
}

let server: http.Server;
let goc = '';

const K = (c: string) => `sk-ant-usr-test-${c.repeat(24)}`;

before(async () => {
  if (!BAT) return;
  server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      const body = raw ? JSON.parse(raw) : null;
      const key = String(req.headers['x-api-key'] ?? req.headers.authorization ?? '');
      daGoi.push({ duong: req.url ?? '', key, beta: req.headers['anthropic-beta'] as string | undefined, body });
      if (req.url?.startsWith('/rambo/')) {
        res.writeHead(ramboStatus, { 'content-type': 'application/json' });
        res.end('{"error":"rambo bảo trì"}');
        return;
      }
      if (req.url?.startsWith('/modelapi/v1/chat/completions')) {
        sse(res, [
          { choices: [{ delta: { content: 'Trả lời từ modelapi.' } }] },
          { choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 50, completion_tokens: 5 } },
        ]);
        return;
      }
      if (req.url?.startsWith('/v1/models/')) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ id: req.url.slice('/v1/models/'.length), max_input_tokens: 1_000_000, max_tokens: 128_000 }));
        return;
      }
      if (req.url === '/v1/messages') {
        const hv = hanhViKey.get(key) ?? 'ok';
        const loi = (s: number, type: string, message: string) => {
          res.writeHead(s, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ type: 'error', error: { type, message } }));
        };
        if (hv === 'credit') return loi(400, 'invalid_request_error', 'Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.');
        if (hv === '401') return loi(401, 'authentication_error', 'invalid x-api-key');
        if (hv === '429') return loi(429, 'rate_limit_error', 'rate limited');
        if (hv === '529') return loi(529, 'overloaded_error', 'Overloaded');
        if (hv === 'badreq') return loi(400, 'invalid_request_error', 'messages: field required');
        if (hv === 'betaloi' && body?.context_management) return loi(400, 'invalid_request_error', 'context_management: Extra inputs are not permitted');
        const chuCuoi = JSON.stringify(body?.messages?.at(-1) ?? '');
        if (chuCuoi.includes('GOI_TOOL')) {
          sse(res, [
            { type: 'message_start', message: { usage: { input_tokens: 300, cache_read_input_tokens: 0, cache_creation_input_tokens: 2000 } } },
            { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '' } },
            { type: 'content_block_delta', index: 0, delta: { type: 'signature_delta', signature: 'CHU_KY_THINKING_1' } },
            { type: 'content_block_start', index: 1, content_block: { type: 'text', text: '' } },
            { type: 'content_block_delta', index: 1, delta: { type: 'text_delta', text: 'Để tôi đọc file.' } },
            { type: 'content_block_start', index: 2, content_block: { type: 'tool_use', id: 'toolu_1', name: 'read_file', input: {} } },
            { type: 'content_block_delta', index: 2, delta: { type: 'input_json_delta', partial_json: '{"path":"a.ts"}' } },
            { type: 'message_delta', delta: { stop_reason: 'tool_use' }, usage: { output_tokens: 30 } },
          ]);
          return;
        }
        if (chuCuoi.includes('NEN_DI')) {
          sse(res, [
            { type: 'message_start', message: { usage: { input_tokens: 1000 } } },
            { type: 'content_block_start', index: 0, content_block: { type: 'compaction', content: '' } },
            { type: 'content_block_delta', index: 0, delta: { type: 'compaction_delta', content: 'TÓM TẮT CŨ' } },
            { type: 'content_block_start', index: 1, content_block: { type: 'text', text: '' } },
            { type: 'content_block_delta', index: 1, delta: { type: 'text_delta', text: 'Sau khi nén.' } },
            { type: 'message_delta', delta: { stop_reason: 'end_turn' },
              usage: { output_tokens: 10, iterations: [
                { type: 'compaction', input_tokens: 200_000, output_tokens: 3_000 },
                { type: 'message', input_tokens: 1000, output_tokens: 10 },
              ] } },
          ]);
          return;
        }
        sse(res, [
          { type: 'message_start', message: { usage: { input_tokens: 100, cache_read_input_tokens: 1000, cache_creation_input_tokens: 50, output_tokens: 1 } } },
          { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '' } },
          { type: 'content_block_delta', index: 0, delta: { type: 'signature_delta', signature: 'abc' } },
          { type: 'content_block_start', index: 1, content_block: { type: 'text', text: '' } },
          { type: 'content_block_delta', index: 1, delta: { type: 'text_delta', text: 'Xin chào từ chính hãng.' } },
          { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 20 } },
          { type: 'message_stop' },
        ]);
        return;
      }
      res.writeHead(404).end();
    });
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  goc = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  Object.assign(process.env, {
    ANTHROPIC_CHINH_HANG_BASE_URL: goc,
    AGENT_GATEWAY_BASE_URL: `${goc}/rambo`,
    AGENT_GATEWAY_API_KEY: 'sk-rambo-gia',
    LLM_GATEWAY_BASE_URL: `${goc}/modelapi`,
    LLM_GATEWAY_API_KEY: 'sk-modelapi-gia',
    JWT_SECRET: process.env.JWT_SECRET || 'bi-mat-test',
  });
  delete process.env.ANTHROPIC_CHINH_HANG_KEYS;
  delete process.env.ANTHROPIC_CHINH_HANG_MODEL_FREE;
});

after(async () => {
  if (!BAT) return;
  server?.close();
  const { prisma } = await import('../../../config/database.js');
  await prisma.$disconnect();
});

async function don() {
  const { prisma } = await import('../../../config/database.js');
  await prisma.anthropicUsage.deleteMany({});
  await prisma.anthropicKey.deleteMany({});
  await prisma.anthropicUserCap.deleteMany({});
  await prisma.appSetting.deleteMany({ where: { key: { in: ['anthropic_chinh_hang_mat_khau', 'anthropic_chinh_hang_tran_goi', 'agent_du_phong_mat_khau'] } } });
  const kho = await import('./khoKey.js');
  kho.datLaiNapMoiTruong();
  const gw = await import('../../llm/gateway.js');
  gw.baoRamboOk();
  hanhViKey.clear();
  daGoi.length = 0;
  ramboStatus = 502;
}

beforeEach(async () => { if (BAT) await don(); });

async function taoNguoi(ten: string, o: { admin?: boolean; pro?: boolean } = {}): Promise<number> {
  const { prisma } = await import('../../../config/database.js');
  const email = `${ten}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@anthropic-test.invalid`;
  const u = await prisma.user.create({ data: { username: email.slice(0, 40), email, isPro: Boolean(o.pro) } as any });
  if (o.admin) {
    const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
    await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
  }
  return u.id;
}

async function themKeys(...ds: Array<[string, HanhVi]>): Promise<number[]> {
  const { themKey } = await import('./khoKey.js');
  const ids: number[] = [];
  for (const [i, [c, hv]] of ds.entries()) {
    hanhViKey.set(K(c), hv);
    ids.push(await themKey({ nhan: `Key ${c}`, khoa: K(c), thuTu: i }));
  }
  return ids;
}

const ngu = { userId: null, viec: 'agent_code' as const, hang: 'cao' as const, model: 'claude-sonnet-5-5' };
const than = () => ({ model: 'claude-sonnet-5-5', max_tokens: 10, stream: true, messages: [{ role: 'user', content: 'hi' }] });

test('chuyển key: hết credit ⇒ hetCredit, 401 ⇒ loi, 429 ⇒ thử kế không đánh dấu', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const { guiChinhHang } = await import('./goi.js');
  const [kc, k401, k429, kok] = await themKeys(['a', 'credit'], ['b', '401'], ['c', '429'], ['d', 'ok']);
  const g = await guiChinhHang({ body: than(), signal: new AbortController().signal, nguCanh: ngu });
  assert.equal(g.key.id, kok);
  await g.res.text();
  assert.deepEqual(daGoi.filter((x) => x.duong === '/v1/messages').map((x) => x.key), [K('a'), K('b'), K('c'), K('d')], 'thử đúng thứ tự ưu tiên');
  const rows = await prisma.anthropicKey.findMany({ orderBy: { thuTu: 'asc' } });
  assert.equal(rows.find((r) => r.id === kc)!.trangThai, 'hetCredit');
  assert.ok(rows.find((r) => r.id === kc)!.hetCreditLuc);
  assert.equal(rows.find((r) => r.id === k401)!.trangThai, 'loi');
  const r429 = rows.find((r) => r.id === k429)!;
  assert.equal(r429.trangThai, 'hoatDong', '429 không đánh dấu');
  assert.match(r429.loiCuoi ?? '', /429/);
  // Lượt sau: key hết credit / lỗi không còn được thử.
  daGoi.length = 0;
  const { xoaNho } = await import('./khoKey.js');
  xoaNho();
  const g2 = await guiChinhHang({ body: than(), signal: new AbortController().signal, nguCanh: ngu });
  await g2.res.text();
  assert.deepEqual(daGoi.map((x) => x.key), [K('c'), K('d')]);
  // Mỗi lần thử hỏng đều có một dòng sổ (để admin đếm lỗi).
  await new Promise((r) => setTimeout(r, 100));
  assert.ok((await prisma.anthropicUsage.count({ where: { thanhCong: false } })) >= 4);
});

test('400 không phải credit = yêu cầu sai ⇒ ném luôn, KHÔNG xoay key', { skip: !BAT }, async () => {
  const { guiChinhHang } = await import('./goi.js');
  await themKeys(['e', 'badreq'], ['f', 'ok']);
  await assert.rejects(guiChinhHang({ body: than(), signal: new AbortController().signal, nguCanh: ngu }), /HTTP 400/);
  assert.equal(daGoi.length, 1);
});

test('mọi key hỏng ⇒ CONG_ANTHROPIC_HONG; không có key ⇒ CONG_ANTHROPIC_HET_KEY', { skip: !BAT }, async () => {
  const { guiChinhHang, CongAnthropicLoi } = await import('./goi.js');
  await assert.rejects(guiChinhHang({ body: than(), signal: new AbortController().signal, nguCanh: ngu }),
    (e: unknown) => e instanceof CongAnthropicLoi && e.code === 'CONG_ANTHROPIC_HET_KEY');
  await themKeys(['g', '529'], ['h', '429']);
  await assert.rejects(guiChinhHang({ body: than(), signal: new AbortController().signal, nguCanh: ngu }),
    (e: unknown) => e instanceof CongAnthropicLoi && e.code === 'CONG_ANTHROPIC_HONG');
});

test('hetCredit tự mở lại khi qua ngày làm mới; chạm ngân sách tháng ⇒ bỏ qua key; quá hạn ⇒ bỏ qua', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const kho = await import('./khoKey.js');
  const [a, b, c] = await themKeys(['i', 'ok'], ['j', 'ok'], ['k', 'ok']);
  await prisma.anthropicKey.update({ where: { id: a }, data: { trangThai: 'hetCredit', hetCreditLuc: new Date(Date.now() - 40 * 86_400_000), ngayLamMoi: 1 } });
  await prisma.anthropicKey.update({ where: { id: b }, data: { nganSachThangUsd: 1 } });
  await prisma.anthropicUsage.create({ data: { keyId: b, viec: 'agent_code', model: 'claude-sonnet-5-5', costUsd: 1.2 } });
  await prisma.anthropicKey.update({ where: { id: c }, data: { hetHanLuc: new Date(Date.now() - 1000) } });
  kho.xoaNho();
  const ds = await kho.keyKhaDung();
  assert.deepEqual(ds.map((k) => k.id), [a], 'chỉ còn key vừa mở lại');
  assert.equal((await prisma.anthropicKey.findUnique({ where: { id: a } }))!.trangThai, 'hoatDong');
  // Hết credit TRONG chu kỳ hiện tại ⇒ vẫn đóng.
  await prisma.anthropicKey.update({ where: { id: a }, data: { trangThai: 'hetCredit', hetCreditLuc: new Date() } });
  kho.xoaNho();
  assert.deepEqual((await kho.keyKhaDung()).map((k) => k.id), []);
});

test('nạp lần đầu từ ANTHROPIC_CHINH_HANG_KEYS — chỉ khi bảng rỗng, khoá lưu mã hoá', { skip: !BAT }, async (t) => {
  const { prisma } = await import('../../../config/database.js');
  const kho = await import('./khoKey.js');
  process.env.ANTHROPIC_CHINH_HANG_KEYS = `Key 2|100|${K('m')},Key 1|200|${K('n')}`;
  t.after(() => { delete process.env.ANTHROPIC_CHINH_HANG_KEYS; });
  kho.datLaiNapMoiTruong();
  assert.equal(await kho.napTuMoiTruong(), 2);
  const rows = await prisma.anthropicKey.findMany({ orderBy: { thuTu: 'asc' } });
  assert.deepEqual(rows.map((r) => [r.nhan, r.nganSachThangUsd, r.duoiKhoa]), [['Key 2', 100, 'mmmm'], ['Key 1', 200, 'nnnn']]);
  assert.ok(rows.every((r) => !r.khoaMaHoa.includes('sk-ant')), 'khoá không được lưu thô');
  kho.datLaiNapMoiTruong();
  assert.equal(await kho.napTuMoiTruong(), 0, 'bảng đã có ⇒ không nạp lại');
});

test('trần theo gói / người: admin không giới hạn, Free và model cao tách riêng', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const hm = await import('./hanMuc.js');
  const pro = await taoNguoi('pro', { pro: true });
  const ad = await taoNguoi('admin', { admin: true });
  const thuong = await taoNguoi('thuong');
  // Mặc định Pro: free 0,5 $/ngày.
  await prisma.anthropicUsage.create({ data: { userId: pro, viec: 'agent_code', hang: 'free', model: 'claude-haiku-5-5', costUsd: 0.6 } });
  await prisma.anthropicUsage.create({ data: { userId: ad, viec: 'agent_code', hang: 'free', model: 'claude-haiku-5-5', costUsd: 999 } });
  const hPro = await hm.xemHanMucChinhHang(pro, 'free');
  assert.equal(hPro.goi, 'pro');
  assert.equal(hPro.het, true, 'vượt trần ngày Free');
  assert.match(hm.loiHetHanMucChinhHang(hPro), /hôm nay/);
  assert.equal((await hm.xemHanMucChinhHang(pro, 'cao')).het, false, 'phần cao tính riêng');
  const hAd = await hm.xemHanMucChinhHang(ad, 'free');
  assert.equal(hAd.khongGioiHan, true);
  assert.equal(hAd.het, false, 'admin không bao giờ bị chặn');
  assert.equal(hAd.daDungThang, 999, 'admin vẫn được đếm');
  // Không phải Pro, không key terminal ⇒ trần 0.
  assert.equal((await hm.xemHanMucChinhHang(thuong, 'free')).het, true);
  // Trần riêng ghi đè gói.
  await hm.datTranRieng(pro, { freeNgayUsd: 1 });
  const hRieng = await hm.xemHanMucChinhHang(pro, 'free');
  assert.equal(hRieng.nguon, 'rieng');
  assert.equal(hRieng.het, false);
  // Trần gói đổi được.
  await hm.xoaTranRieng(pro);
  await hm.datTranGoi({ pro: { free: { ngay: null, thang: 10 } } });
  assert.equal((await hm.xemHanMucChinhHang(pro, 'free')).het, false);
});

test('mật khẩu + vé riêng: sai/đúng/đổi mật khẩu; vé dự phòng không dùng được ở đây', { skip: !BAT }, async () => {
  const ve = await import('./ve.js');
  const dp = await import('../congDuPhong.js');
  const uid = await taoNguoi('ve', { pro: true });
  await assert.rejects(ve.moKhoaAnthropic(uid, 'x'), (e: any) => e.code === 'CHUA_BAT');
  await ve.datMatKhauAnthropic('mat-khau-ca');
  await assert.rejects(ve.moKhoaAnthropic(uid, 'sai'), (e: any) => e.code === 'SAI_MAT_KHAU');
  const { ve: v, hetHan } = await ve.moKhoaAnthropic(uid, 'mat-khau-ca');
  assert.ok(new Date(hetHan).getTime() - Date.now() > 29 * 86_400_000, 'vé 30 ngày');
  assert.equal(await ve.veAnthropicHopLe(uid, v), true);
  assert.equal(await ve.veAnthropicHopLe(uid + 1, v), false, 'vé người khác');
  await dp.datMatKhauDuPhong('mat-khau-dp');
  const vdp = (await dp.moKhoaDuPhong(uid, 'mat-khau-dp')).ve;
  assert.equal(await ve.veAnthropicHopLe(uid, vdp), false, 'vé dự phòng ≠ vé chính hãng');
  assert.equal(await dp.veDuPhongHopLe(uid, v), false, 'và ngược lại');
  await ve.datMatKhauAnthropic('mat-khau-moi');
  assert.equal(await ve.veAnthropicHopLe(uid, v), false, 'đổi mật khẩu ⇒ vé cũ chết');
  // Bộ đếm sai DÙNG CHUNG với dự phòng: 5 lần sai (trộn hai cổng) ⇒ khoá.
  const u2 = await taoNguoi('dem', { pro: true });
  for (let i = 0; i < 3; i++) await assert.rejects(ve.moKhoaAnthropic(u2, 'sai'));
  for (let i = 0; i < 2; i++) await assert.rejects(dp.moKhoaDuPhong(u2, 'sai'));
  await assert.rejects(ve.moKhoaAnthropic(u2, 'mat-khau-moi'), (e: any) => e.code === 'THU_QUA_NHIEU');
});

async function chay(input: Record<string, unknown>) {
  const { runAgentTurn } = await import('../turn.js');
  const sk: any[] = [];
  await runAgentTurn(
    { messages: [{ role: 'user', content: 'Chào' }], capabilities: [], mucNoLuc: 'vua', ...input } as any,
    (e) => sk.push(e),
    new AbortController().signal,
  );
  return sk;
}

test('thứ tự lùi: rambo hỏng ⇒ CuongMini Free (chính hãng) + lời mời nâng cấp', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  await themKeys(['p', 'ok']);
  const uid = await taoNguoi('free', { pro: true });
  const sk = await chay({ userId: uid });
  const duong = daGoi.map((x) => x.duong);
  assert.equal(duong[0], '/rambo/v1/messages', 'đi rambo trước');
  assert.ok(duong.includes('/v1/messages'), `phải sang chính hãng. Đường: ${duong.join(', ')}`);
  const cong = sk.find((e) => e.type === 'cong');
  assert.equal(cong?.cong, 'anthropic');
  assert.equal(cong?.ma, 'CONG_CHINH_HONG_FREE');
  assert.equal(cong?.thongDiep, 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.');
  assert.equal(cong?.moiNangCap, true);
  assert.deepEqual(cong?.cacCong.map((c: any) => c.cong), ['anthropic', 'modelapi']);
  assert.equal(cong?.cacCong[0].canMatKhau, true);
  const xong = sk.find((e) => e.type === 'done');
  assert.ok(xong, JSON.stringify(sk.map((e) => e.type)));
  assert.equal(xong.append.at(-1).content, 'Xin chào từ chính hãng.');
  // Thân gửi Anthropic: model Free, prompt caching, không fallbacks (Haiku).
  const gui = daGoi.find((x) => x.duong === '/v1/messages')!;
  assert.equal(gui.body.model, 'claude-haiku-5-5');
  assert.equal(gui.body.system[0].cache_control.type, 'ephemeral');
  assert.equal(gui.body.fallbacks, undefined);
  // Sổ: một dòng free, USD đúng bảng giá (gồm đệm).
  const { tinhUsd } = await import('./gia.js');
  const dong = await prisma.anthropicUsage.findFirst({ where: { userId: uid, thanhCong: true } });
  assert.equal(dong?.hang, 'free');
  assert.equal(dong?.cacheDocTokens, 1000);
  assert.equal(dong?.cacheGhiTokens, 50);
  assert.equal(dong?.costUsd, tinhUsd('claude-haiku-5-5', { input: 100, output: 20, cacheDoc: 1000, cacheGhi: 50 }));
  assert.equal(xong.usage.costUsd, dong?.costUsd, 'khung done mang USD chính hãng');
});

test('thứ tự lùi: Free hết trần ⇒ modelapi bằng vé dự phòng; không vé ⇒ RAMBO_BAO_TRI', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const dp = await import('../congDuPhong.js');
  const gw = await import('../../llm/gateway.js');
  await themKeys(['q', 'ok']);
  const uid = await taoNguoi('hettran', { pro: true });
  await prisma.anthropicUsage.create({ data: { userId: uid, viec: 'agent_code', hang: 'free', model: 'claude-haiku-5-5', costUsd: 50 } });
  gw.baoRamboHong(); // rambo đang được đánh dấu hỏng
  const sk1 = await chay({ userId: uid });
  assert.equal(sk1.find((e) => e.type === 'error')?.code, 'RAMBO_BAO_TRI');
  await dp.datMatKhauDuPhong('mk-du-phong');
  const ve = (await dp.moKhoaDuPhong(uid, 'mk-du-phong')).ve;
  daGoi.length = 0;
  const sk2 = await chay({ userId: uid, duPhongVe: ve });
  assert.equal(sk2.find((e) => e.type === 'start')?.cong, 'du-phong');
  assert.ok(daGoi.some((x) => x.duong.startsWith('/modelapi/')), daGoi.map((x) => x.duong).join(','));
  assert.ok(!daGoi.some((x) => x.duong === '/v1/messages'), 'hết trần Free ⇒ không gọi chính hãng');
});

test('chọn tay model cao: chưa vé ⇒ CONG_ANTHROPIC_KHOA; có vé ⇒ chính hãng + fallbacks; admin không cần vé', { skip: !BAT }, async () => {
  const ve = await import('./ve.js');
  const { AgentInputError } = await import('../turn.js');
  await themKeys(['r', 'ok']);
  const uid = await taoNguoi('cao', { pro: true });
  await assert.rejects(chay({ userId: uid, model: 'cl-opus-5-5' }),
    (e: unknown) => e instanceof AgentInputError && e.code === 'CONG_ANTHROPIC_KHOA');
  await ve.datMatKhauAnthropic('mk-ca');
  const v = (await ve.moKhoaAnthropic(uid, 'mk-ca')).ve;
  daGoi.length = 0;
  const sk = await chay({ userId: uid, model: 'cl-opus-5-5', congAnthropicVe: v });
  assert.equal(sk.find((e) => e.type === 'start')?.cong, 'anthropic');
  const thuc = () => daGoi.filter((x) => !x.duong.startsWith('/v1/models/'));
  assert.equal(thuc()[0]!.duong, '/v1/messages', 'chọn tay ⇒ đi thẳng chính hãng, không qua rambo');
  assert.equal(thuc()[0]!.body.model, 'claude-opus-5-5');
  assert.equal(thuc()[0]!.body.fallbacks, 'default');
  assert.match(thuc()[0]!.beta ?? '', /server-side-fallback/);
  assert.ok(sk.find((e) => e.type === 'done'));
  // Admin, không vé, Fable 5.1.
  const ad = await taoNguoi('ad2', { admin: true });
  daGoi.length = 0;
  const sk2 = await chay({ userId: ad, model: 'cl-fable-5-1' });
  assert.ok(sk2.find((e) => e.type === 'done'), JSON.stringify(sk2));
  assert.equal(thuc()[0]!.body.model, 'claude-fable-5-1');
});

test('chính hãng hỏng hết key giữa lượt ⇒ lùi modelapi khi có vé; không vé ⇒ mã CONG_ANTHROPIC_HONG', { skip: !BAT }, async () => {
  const dp = await import('../congDuPhong.js');
  await themKeys(['s', '529']);
  const ad = await taoNguoi('ad3', { admin: true });
  // Admin coi như có vé dự phòng ⇒ lùi modelapi.
  const sk = await chay({ userId: ad, model: 'cl-sonnet-5-5' });
  assert.ok(sk.some((e) => e.type === 'cong' && e.cong === 'du-phong'), JSON.stringify(sk.map((e) => e.type)));
  assert.ok(sk.find((e) => e.type === 'done'));
  // Người Pro có vé chính hãng nhưng KHÔNG có vé dự phòng ⇒ báo mã riêng.
  const ve = await import('./ve.js');
  await ve.datMatKhauAnthropic('mk-ca2');
  const uid = await taoNguoi('pro3', { pro: true });
  const v = (await ve.moKhoaAnthropic(uid, 'mk-ca2')).ve;
  const sk2 = await chay({ userId: uid, model: 'cl-sonnet-5-5', congAnthropicVe: v });
  assert.equal(sk2.find((e) => e.type === 'error')?.code, 'CONG_ANTHROPIC_HONG');
  void dp;
});

test('thân yêu cầu lượt agent: thinking adaptive + giữ chữ ký, effort theo mức, context_management, max_tokens rộng, beta đúng', { skip: !BAT }, async () => {
  await themKeys(['t', 'ok']);
  const ad = await taoNguoi('than', { admin: true });
  const sk = await chay({ userId: ad, model: 'cl-sonnet-5-5', mucNoLuc: 'cao', capabilities: ['fs_read'],
    messages: [{ role: 'user', content: 'GOI_TOOL đọc a.ts' }] });
  const gui = daGoi.find((x) => x.duong === '/v1/messages')!;
  const b = gui.body;
  assert.deepEqual(b.thinking, { type: 'adaptive', block_binding: { prefix_mismatch_behavior: 'drop_block' } });
  assert.deepEqual(b.output_config, { effort: 'high' }, 'cao ⇒ high');
  assert.equal(b.max_tokens, 64_000);
  assert.deepEqual(b.context_management.edits.map((e: any) => e.type), ['clear_thinking_20251015', 'clear_tool_uses_20250919', 'compact_20260112'],
    'clear_thinking phải đứng đầu');
  assert.equal(b.context_management.edits[1].keep.value, 25);
  assert.equal(b.context_management.edits[2].trigger.value, 300_000);
  for (const be of ['context-management-2025-06-27', 'compact-2026-01-12', 'thinking-binding-controls-2026-08-01', 'server-side-fallback-2026-07-01']) {
    assert.ok((gui.beta ?? '').includes(be), `thiếu beta ${be}: ${gui.beta}`);
  }
  // Tool sắp theo tên, cache_control ở tool cuối + system.
  const ten = b.tools.map((t: any) => t.name);
  assert.deepEqual(ten, [...ten].sort((x: string, y: string) => x.localeCompare(y)));
  assert.equal(b.tools.at(-1).cache_control.type, 'ephemeral');
  assert.equal(b.system.at(-1).cache_control.type, 'ephemeral');
  // Khung nhẹ "đang nghĩ" + khối Anthropic gốc kèm tin assistant.
  assert.ok(sk.some((e) => e.type === 'nghi'));
  const xong = sk.find((e) => e.type === 'done');
  assert.equal(xong.stop, 'tool_calls');
  assert.ok(xong.tienUsd > 0, 'done mang tienUsd');
  const asst = xong.append[0];
  assert.deepEqual(asst.khoiAnthropic.map((k: any) => k.type), ['thinking', 'text', 'tool_use']);
  assert.equal(asst.khoiAnthropic[0].signature, 'CHU_KY_THINKING_1');
  assert.deepEqual(asst.khoiAnthropic[2].input, { path: 'a.ts' });

  // Vòng 2: app gửi lại NGUYÊN VĂN ⇒ khối thinking có chữ ký đi lại, tiền tố ổn định.
  daGoi.length = 0;
  await chay({ userId: ad, model: 'cl-sonnet-5-5', mucNoLuc: 'cao', capabilities: ['fs_read'],
    messages: [{ role: 'user', content: 'GOI_TOOL đọc a.ts' }, asst, { role: 'tool', tool_call_id: 'toolu_1', content: 'export const a = 1;' }] });
  const b2 = daGoi.find((x) => x.duong === '/v1/messages')!.body;
  assert.deepEqual(b2.messages[1].content, asst.khoiAnthropic, 'tin assistant gửi lại đúng từng khối Anthropic gốc');
  const bo = (x: unknown) => JSON.parse(JSON.stringify(x, (k, v) => (k === 'cache_control' ? undefined : v)));
  assert.deepEqual(bo(b2.tools), bo(b.tools), 'tools giống hệt giữa hai vòng');
  assert.deepEqual(bo(b2.system), bo(b.system), 'system giống hệt giữa hai vòng');
  assert.deepEqual(bo(b2.messages[0]), bo(b.messages[0]), 'tin đầu giống hệt ⇒ tiền tố đệm trúng');
  // Mốc đệm ở 2 tin user cuối (trượt), tổng ≤ 4.
  const soMoc = JSON.stringify(b2).match(/cache_control/g)!.length;
  assert.equal(soMoc, 4);
  assert.ok(JSON.stringify(b2.messages.at(-1)).includes('cache_control'));
  assert.ok(JSON.stringify(b2.messages[0]).includes('cache_control'));
});

test('compact phía máy chủ: khối compaction đi kèm tin, tiền tính cả lượt tóm tắt', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const { tinhUsd } = await import('./gia.js');
  await themKeys(['u', 'ok']);
  const ad = await taoNguoi('nen', { admin: true });
  const sk = await chay({ userId: ad, model: 'cl-opus-5-5', messages: [{ role: 'user', content: 'NEN_DI' }] });
  const xong = sk.find((e) => e.type === 'done');
  assert.equal(xong.append[0].khoiAnthropic[0].type, 'compaction');
  assert.equal(xong.append[0].khoiAnthropic[0].content, 'TÓM TẮT CŨ');
  const dong = await prisma.anthropicUsage.findFirst({ where: { userId: ad, thanhCong: true } });
  assert.equal(dong?.costUsd, tinhUsd('claude-opus-5-5', { input: 1000, output: 10, cacheDoc: 0, cacheGhi: 0, nenVao: 200_000, nenRa: 3_000 }));
  assert.ok((dong?.costUsd ?? 0) > 0.8, 'lượt tóm tắt 200K token phải được tính tiền');
});

test('400 vì tham số beta ⇒ gửi lại bản tối giản MỘT lần, cùng key, không beta', { skip: !BAT }, async () => {
  const { prisma } = await import('../../../config/database.js');
  const [k] = await themKeys(['v', 'betaloi']);
  const ad = await taoNguoi('beta', { admin: true });
  const sk = await chay({ userId: ad, model: 'cl-sonnet-5-5', messages: [{ role: 'user', content: 'Chào' }] });
  assert.ok(sk.find((e) => e.type === 'done'), JSON.stringify(sk));
  const goi = daGoi.filter((x) => x.duong === '/v1/messages');
  assert.equal(goi.length, 2);
  assert.ok(goi[0]!.body.context_management);
  assert.equal(goi[1]!.body.context_management, undefined);
  assert.equal(goi[1]!.beta, undefined, 'bản tối giản không gửi anthropic-beta');
  assert.deepEqual(goi[1]!.body.thinking, { type: 'adaptive' });
  assert.equal((await prisma.anthropicKey.findUnique({ where: { id: k! } }))!.trangThai, 'hoatDong');
});

test('PDF: cổng chính hãng nhận khối document gốc; rambo nhận dòng báo', { skip: !BAT }, async () => {
  await themKeys(['w', 'ok']);
  const ad = await taoNguoi('pdf', { admin: true });
  const pdf = 'data:application/pdf;base64,JVBERi0xLjQK';
  const tin = [{ role: 'user', content: [{ type: 'text', text: 'Đọc tệp' }, { type: 'file', file: { filename: 'de.pdf', file_data: pdf } }] }];
  await chay({ userId: ad, model: 'cl-sonnet-5-5', messages: tin });
  const kh = daGoi.find((x) => x.duong === '/v1/messages')!.body.messages[0].content;
  const doc = kh.find((k: any) => k.type === 'document');
  assert.equal(doc?.source?.data, 'JVBERi0xLjQK');
  assert.equal(doc?.title, 'de.pdf');
  daGoi.length = 0;
  ramboStatus = 502;
  await chay({ userId: ad, messages: tin });
  const ramboBody = daGoi.find((x) => x.duong.startsWith('/rambo/'))!.body;
  const chu = JSON.stringify(ramboBody.messages[0].content);
  assert.ok(!chu.includes('"document"') && chu.includes('de.pdf'), chu.slice(0, 200));
});

test('agent phụ: mucModelPhu "nhanh" ⇒ haiku-5-5 trên cổng chính hãng; không bao giờ đắt hơn model chính', { skip: !BAT }, async () => {
  await themKeys(['x', 'ok']);
  const ad = await taoNguoi('phu', { admin: true });
  await chay({ userId: ad, model: 'cl-opus-5-5', laPhu: true, mucModelPhu: 'nhanh' });
  assert.equal(daGoi.find((x) => x.duong === '/v1/messages')!.body.model, 'claude-haiku-5-5');
  daGoi.length = 0;
  await chay({ userId: ad, model: 'cl-sonnet-5-5', laPhu: true, mucModelPhu: 'manh' });
  assert.equal(daGoi.find((x) => x.duong === '/v1/messages')!.body.model, 'claude-sonnet-5-5', 'manh không vượt model chính');
  daGoi.length = 0;
  await chay({ userId: ad, model: 'cl-opus-5-5', laPhu: true });
  assert.equal(daGoi.find((x) => x.duong === '/v1/messages')!.body.model, 'claude-opus-5-5', 'mặc định kế thừa');
});
