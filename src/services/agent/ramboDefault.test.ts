/**
 * Rambo bật lại — CuongMini Default (19/10/2026). Không CSDL, cổng giả (fetch thay):
 *   • bảng model khi rambo BẬT / TẮT + đúng thứ tự (Default → Classic → free → cần khoá);
 *   • `cm-default` chọn rambo khi sống / lùi Solid khi cầu dao mở / tự chuyển cổng GIỮA lượt;
 *   • app cũ gửi `sonnet-5` khi rambo bật/tắt; app đời `?bang=cm` nhận mã nằm trong z.enum cũ;
 *   • tên không lộ; `language_tutor` không đi rambo; CT Work đi rambo Sonnet; hạn mức nhóm dùng được Classic;
 *   • tài khoản Free: rambo không chạy ⇒ bảo trì, KHÔNG gọi cổng tốn tiền; chống spam lượt/phút/ngày/IP.
 *
 *   npx tsx --test src/services/agent/ramboDefault.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.JWT_SECRET ||= 'bi-mat-chi-de-test-rambo-default';

const {
  MA_DEFAULT, anTenThat, bangChoApp, docBanApp, dungChoNhom, giaiDefault, laDefault, maChoApp, maMacDinhCho, timModel,
} = await import('./bangModel.js');
const { dsModelChoAppThuan, mucChoApp } = await import('./anthropicChinhHang/dinhTuyen.js');
const gw = await import('../llm/gateway.js');
const { BoDemDefault, kiemThuan, gopGioiHan, kiemBuocThuan, ipChongSpam } = await import('./defaultGioiHan.js');

const KHONG_QUYEN = { laAdmin: false, modelCao: false, invisible: false };
const TEN_THAT = /claude|gpt|anthropic|modelapi|opus|sonnet|haiku|fable|rambo|openai/i;
const ENV = ['AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY', 'RAMBO_BAT', 'LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY_GPT', 'LLM_GATEWAY_BASE_URL', 'RAMBO_MODEL_SONIC'];

function datRambo(bat: boolean): () => void {
  const luu = ENV.map((k) => [k, process.env[k]] as const);
  process.env.AGENT_GATEWAY_BASE_URL = 'https://rambo.vi-du.test/api/claude';
  process.env.AGENT_GATEWAY_API_KEY = 'sk-gia-rambo';
  process.env.RAMBO_BAT = bat ? '1' : '0';
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap';
  process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-gia-lap';
  process.env.LLM_GATEWAY_BASE_URL = 'https://core.vi-du.test/v1';
  delete process.env.RAMBO_MODEL_SONIC;
  gw.baoRamboOk();
  return () => {
    gw.baoRamboOk();
    for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  };
}

const ID_BAT = ['cm-default', 'cm-classic-optimum', 'cm-classic-sonic', 'cm-classic-heshin',
  'cm-sonic', 'cm-solid', 'cm-nova', 'cm-shin', 'cm-heshin', 'cm-eco', 'cm-invisible', 'cm-optimum'];

test('bảng model: rambo BẬT ⇒ Default → Classic → free → cần khoá; TẮT ⇒ Default → free → cần khoá (Classic ẩn)', () => {
  const tra = datRambo(true);
  try {
    assert.deepEqual(bangChoApp().map((m) => m.id), ID_BAT);
    assert.deepEqual(dsModelChoAppThuan(KHONG_QUYEN, true).map((m) => m.id), ID_BAT);
    process.env.RAMBO_BAT = '0';
    assert.deepEqual(dsModelChoAppThuan(KHONG_QUYEN, true).map((m) => m.id), ID_BAT.filter((x) => !x.startsWith('cm-classic')));
    /* Default vẫn hiện khi rambo tắt (chạy Solid). */
    assert.equal(dsModelChoAppThuan(KHONG_QUYEN, true)[0]!.ten, 'CuongMini Default');
  } finally { tra(); }
});

test('tên không lộ: Default + Classic chỉ tên CuongMini; câu lỗi có tên model rambo ⇒ tên Classic', () => {
  const tra = datRambo(true);
  try {
    for (const m of bangChoApp()) {
      const muc = mucChoApp(m, KHONG_QUYEN, true) as unknown as Record<string, unknown>;
      assert.equal(muc.model, undefined, 'lộ trường `model`');
      const chu = [muc.id, muc.ten, muc.mo, muc.moEn, muc.nhom].join(' ');
      assert.doesNotMatch(chu, TEN_THAT, `lộ tên thật: ${chu}`);
      assert.match(String(muc.ten), /^CuongMini /);
    }
    assert.deepEqual(bangChoApp().filter((m) => m.cong === 'rambo').map((m) => m.ten),
      ['CuongMini Classic Optimum', 'CuongMini Classic Sonic', 'CuongMini Classic Heshin']);
    const ra = anTenThat('HTTP 503 model claude-sonnet-5 / claude-opus-4-8 / claude-haiku-4-5 qua rambo.ai.vn');
    assert.doesNotMatch(ra, /claude-|rambo/i, ra);
    assert.match(ra, /CuongMini Classic Sonic/);
  } finally { tra(); }
});

test('cm-default: rambo sống ⇒ Classic Sonic; cầu dao mở ⇒ Solid; rambo tắt ⇒ Solid; Sonnet 5.5 tự lên khi rambo có', () => {
  const tra = datRambo(true);
  try {
    assert.equal(timModel('cm-default').id, 'cm-classic-sonic');
    assert.equal(timModel(undefined).id, 'cm-classic-sonic');
    assert.equal(timModel('cm-tu-dong').id, 'cm-classic-sonic', 'bí danh bản nháp');
    assert.equal(timModel('cm-default').model, 'claude-sonnet-5', 'rambo chưa có 5.5 ⇒ Sonnet 5');
    gw.datDsModelRambo(['claude-opus-5', 'claude-sonnet-5-5', 'claude-sonnet-5']);
    assert.equal(timModel('cm-default').model, 'claude-sonnet-5-5', 'rambo có 5.5 ⇒ dùng 5.5');
    gw.datDsModelRambo(['claude-opus-5', 'claude-sonnet-5']);
    gw.baoRamboHong();
    assert.equal(timModel('cm-default').id, 'cm-solid', 'cầu dao mở ⇒ Solid');
    assert.equal(timModel('cm-classic-sonic').id, 'cm-classic-sonic', 'chọn TAY Classic ⇒ giữ (turn tự chuyển, có dòng báo)');
    gw.baoRamboOk();
    process.env.RAMBO_BAT = '0';
    assert.equal(timModel('cm-default').id, 'cm-solid');
    assert.equal(timModel('cm-classic-optimum').id, 'cm-solid', 'rambo tắt ⇒ Classic lặng lẽ về Solid');
    assert.equal(giaiDefault(false).id, 'cm-solid');
    assert.ok(laDefault(undefined) && laDefault('cm-default') && laDefault('cm-tu-dong'));
    assert.equal(laDefault('cm-solid'), false);
    assert.equal(laDefault('ma-rac'), false, 'mã rác không mở cửa Free');
  } finally { tra(); }
});

test('app cũ gửi `sonnet-5` (mặc định cũ): rambo bật ⇒ Sonnet thật trên rambo; tắt ⇒ Solid', () => {
  const tra = datRambo(true);
  try {
    assert.equal(timModel('sonnet-5').id, 'cm-classic-sonic');
    assert.equal(timModel('haiku-4-5').id, 'cm-classic-heshin');
    assert.equal(timModel('opus-4-8').id, 'cm-classic-optimum');
    assert.equal(timModel('fable-5').id, 'cm-classic-optimum', 'không tự nâng lên model đắt hơn');
    process.env.RAMBO_BAT = '0';
    assert.equal(timModel('sonnet-5').id, 'cm-solid');
  } finally { tra(); }
});

test('đời app: `cm` (z.enum cố định 0.5.201–0.5.203) nhận mã cũ thay cho Default/Classic; `cm2` nhận nguyên; không trùng mã', () => {
  const tra = datRambo(true);
  try {
    const CM_DOI_1 = new Set(['sonnet-5', 'opus-4-8', 'gpt-sol', 'haiku-4-5', 'sonnet-4-6', 'opus-4-6', 'opus-4-7', 'opus-5', 'fable-5',
      'cl-free', 'cl-sonnet-5-5', 'cl-opus-5-5', 'cl-fable-5-1',
      'cm-invisible', 'cm-optimum', 'cm-sonic', 'cm-solid', 'cm-nova', 'cm-shin', 'cm-heshin', 'cm-eco']);
    const ds = maChoApp(bangChoApp().map((m) => ({ id: m.id, ten: m.ten })), docBanApp('cm'));
    for (const m of ds) assert.ok(CM_DOI_1.has(m.id), `app đời cm nhận mã lạ ${m.id}`);
    assert.equal(new Set(ds.map((m) => m.id)).size, ds.length, 'trùng mã');
    assert.equal(ds[0]!.ten, 'CuongMini Default');
    assert.equal(ds[0]!.id, 'sonnet-5');
    assert.equal(maMacDinhCho('cm'), 'sonnet-5');
    assert.equal(maMacDinhCho('cu'), 'sonnet-5');
    assert.equal(maMacDinhCho('cm2'), MA_DEFAULT);
    assert.deepEqual(maChoApp(bangChoApp().map((m) => ({ id: m.id })), 'cm2').map((m) => m.id), ID_BAT);
  } finally { tra(); }
});

test('web: `language_tutor` KHÔNG đi rambo (kể cả khi bật); CT Work đi rambo Sonnet, sập ⇒ gpt-6-sol', () => {
  const tra = datRambo(true);
  try {
    const lt = gw.endpointFor('language_tutor');
    assert.notEqual(lt.label, 'cong-agent');
    assert.equal(gw.modelFor('language_tutor', lt), 'gpt-6-sol', 'không gọi Claude qua modelapi');
    for (const v of ['work_assistant', 'work_spec_review', 'work_digest'] as const) {
      const ep = gw.endpointFor(v);
      assert.equal(ep.label, 'cong-agent', `${v} phải đi rambo`);
      assert.equal(gw.modelFor(v, ep), 'claude-sonnet-5', `${v} = Sonnet mới nhất rambo có`);
    }
    /* Việc web có model claude-* trong bản đồ vẫn đi rambo như trước. */
    assert.equal(gw.endpointFor('course_tutor').label, 'cong-agent');
    /* work_agent / VIEC_CHI_OPENAI giữ modelapi. */
    assert.notEqual(gw.endpointFor('work_agent').label, 'cong-agent');
    gw.baoRamboHong();
    const wa = gw.endpointFor('work_assistant');
    assert.notEqual(wa.label, 'cong-agent', 'cầu dao mở ⇒ lùi');
    assert.equal(gw.modelFor('work_assistant', wa), 'gpt-6-sol');
  } finally { tra(); }
});

test('hạn mức nhóm dùng được Classic + Default; Free chỉ Default (model khác `canPro`)', () => {
  const tra = datRambo(true);
  try {
    assert.ok(dungChoNhom(timModel('cm-classic-sonic')));
    assert.ok(dungChoNhom({ id: 'cm-default' }));
    assert.ok(dungChoNhom(timModel('cm-solid')));
    assert.equal(dungChoNhom(timModel('cm-sonic')), false, 'Code Max (chính hãng) vẫn không cho nhóm');
    const free = dsModelChoAppThuan(KHONG_QUYEN, true, { chiDefault: true });
    assert.equal(free[0]!.id, 'cm-default');
    assert.equal(free[0]!.dungDuoc, true);
    assert.ok(free.slice(1).every((m) => m.canPro === true && m.dungDuoc === false && !m.canMoKhoa));
    gw.baoRamboHong();
    assert.equal(dsModelChoAppThuan(KHONG_QUYEN, true, { chiDefault: true })[0]!.dungDuoc, false, 'rambo nghỉ ⇒ Default của Free tạm bảo trì');
  } finally { tra(); }
});

test('chống spam Default: 10/phút (Free + Pro), 500/ngày Free, 1500/ngày/IP; 0 = tắt; câu nói rõ khi nào dùng lại', () => {
  const gh = gopGioiHan({});
  assert.deepEqual(gh, { phutNguoi: 10, ngayFree: 500, ngayIp: 1500, buocNgayFree: 10_000 });
  const bo = new BoDemDefault();
  const t0 = Date.UTC(2026, 9, 19, 3, 0, 0); // 10:00 giờ VN
  for (let i = 0; i < 10; i++) { assert.ok(kiemThuan(bo, gh, { userId: 1, ip: '1.1.1.1', free: false, now: t0 + i }).ok); bo.ghi(1, '1.1.1.1', t0 + i); }
  const k = kiemThuan(bo, gh, { userId: 1, ip: '1.1.1.1', free: false, now: t0 + 20 });
  assert.equal(k.ok, false);
  assert.ok(!k.ok && k.ma === 'DEFAULT_QUA_NHANH' && k.thuLaiSauGiay <= 60 && /giây/.test(k.cau));
  assert.ok(kiemThuan(bo, gh, { userId: 1, ip: null, free: false, now: t0 + 61_000 }).ok, 'qua một phút ⇒ dùng lại');
  /* Pro không có trần ngày. */
  const bo2 = new BoDemDefault();
  bo2.datNgayNguoi(2, 10_000, t0);
  assert.ok(kiemThuan(bo2, gh, { userId: 2, ip: null, free: false, now: t0 }).ok);
  const h = kiemThuan(bo2, gh, { userId: 2, ip: null, free: true, now: t0 });
  assert.ok(!h.ok && h.ma === 'DEFAULT_HET_NGAY' && /0:00/.test(h.cau));
  /* Đổi ngày (0:00 giờ VN) ⇒ về 0. */
  assert.ok(kiemThuan(bo2, gh, { userId: 2, ip: null, free: true, now: t0 + 15 * 3600_000 }).ok);
  /* IP: nhiều tài khoản Free cùng IP. */
  const bo3 = new BoDemDefault();
  bo3.ngayIp.set('9.9.9.9', { ngay: new Date(Date.UTC(2026, 9, 18, 17)).toISOString(), so: 1500 });
  const ip = kiemThuan(bo3, gh, { userId: 3, ip: '9.9.9.9', free: true, now: t0 });
  assert.ok(!ip.ok && ip.ma === 'DEFAULT_HET_NGAY_IP');
  /* 0 = tắt. */
  assert.ok(kiemThuan(bo2, { phutNguoi: 0, ngayFree: 0, ngayIp: 0, buocNgayFree: 0 }, { userId: 2, ip: '9.9.9.9', free: true, now: t0 }).ok);
});

test('QA 19/10: trần BƯỚC/ngày của Free (lưới đỡ khi app khai sai "câu hỏi mới") + IP chống spam không tin X-Forwarded-For', () => {
  const gh = gopGioiHan({ buocNgayFree: 3 });
  assert.equal(gh.buocNgayFree, 3);
  assert.equal(gopGioiHan({ phutNguoi: 5 }, gh).buocNgayFree, 3, 'admin lưu ba ô cũ ⇒ không mất ô thứ tư');
  const bo = new BoDemDefault();
  const t0 = Date.UTC(2026, 9, 19, 3, 0, 0);
  for (let i = 0; i < 3; i++) { assert.ok(kiemBuocThuan(bo, gh, { userId: 7, now: t0 + i }).ok); bo.ghiBuoc(7, t0 + i); }
  const k = kiemBuocThuan(bo, gh, { userId: 7, now: t0 + 9 });
  assert.ok(!k.ok && k.ma === 'DEFAULT_HET_BUOC_NGAY' && /0:00/.test(k.cau) && k.thuLaiSauGiay > 0);
  assert.ok(kiemBuocThuan(bo, gh, { userId: 7, now: t0 + 15 * 3600_000 }).ok, 'qua 0:00 giờ VN ⇒ về 0');
  assert.ok(kiemBuocThuan(bo, { ...gh, buocNgayFree: 0 }, { userId: 7, now: t0 }).ok, '0 = tắt');
  /* nginx (Docker, mạng nội bộ) GHI ĐÈ X-Real-IP = $remote_addr; X-Forwarded-For do client tự gửi KHÔNG được tin. */
  const qua = (sock: string, h: Record<string, string>) => ipChongSpam({ socket: { remoteAddress: sock }, headers: h });
  assert.equal(qua('172.18.0.5', { 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '1.2.3.4, 203.0.113.9' }), '203.0.113.9');
  assert.equal(qua('::ffff:172.18.0.5', { 'x-real-ip': '203.0.113.9' }), '203.0.113.9');
  assert.equal(qua('203.0.113.7', { 'x-real-ip': '1.2.3.4', 'x-forwarded-for': '1.2.3.4' }), '203.0.113.7', 'gọi thẳng (không qua nginx) ⇒ socket');
  assert.equal(qua('172.18.0.5', { 'x-real-ip': 'rác' }), '172.18.0.5');
});

// ─── Chạy THẬT runAgentTurn với cổng giả ─────────────────────────────

type Goi = { url: string; model: string };
function congGia(o: { ramboHong?: boolean }): { goi: Goi[]; tra: () => void } {
  const goc = globalThis.fetch;
  const goi: Goi[] = [];
  const enc = new TextEncoder();
  globalThis.fetch = (async (url: unknown, init: { body?: string }) => {
    const u = String(url);
    const b = JSON.parse(String(init?.body ?? '{}'));
    goi.push({ url: u, model: b.model });
    if (u.includes('rambo.vi-du.test')) {
      if (o.ramboHong) return new Response('{"error":{"message":"upstream overloaded"}}', { status: 503 });
      const ev = (x: unknown) => enc.encode(`event: ${(x as { type: string }).type}\ndata: ${JSON.stringify(x)}\n\n`);
      return new Response(new ReadableStream({ start(c) {
        c.enqueue(ev({ type: 'message_start', message: { usage: { input_tokens: 10, output_tokens: 0 } } }));
        c.enqueue(ev({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }));
        c.enqueue(ev({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'xin chào từ rambo' } }));
        c.enqueue(ev({ type: 'content_block_stop', index: 0 }));
        c.enqueue(ev({ type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 4 } }));
        c.enqueue(ev({ type: 'message_stop' }));
        c.close();
      } }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }
    return new Response(new ReadableStream({ start(c) {
      c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: 'ok từ Solid' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 2 } })}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n')); c.close();
    } }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }) as typeof fetch;
  return { goi, tra: () => { globalThis.fetch = goc; } };
}

async function chay(input: Record<string, unknown>): Promise<Array<Record<string, unknown>>> {
  const { runAgentTurn } = await import('./turn.js');
  const sk: Array<Record<string, unknown>> = [];
  await runAgentTurn({ userId: 1, messages: [{ role: 'user', content: 'chào' }], capabilities: ['fs_read'], ...input } as any,
    (e) => sk.push(e as any), new AbortController().signal);
  return sk;
}

test('lượt thật: cm-default + rambo sống ⇒ gọi rambo Sonnet, tên hiện là CuongMini Classic Sonic', async (t) => {
  const tra = datRambo(true);
  const c = congGia({});
  t.after(() => { c.tra(); tra(); });
  const sk = await chay({ model: 'cm-default' });
  assert.ok(sk.some((e) => e.type === 'done'), JSON.stringify(sk.filter((e) => e.type === 'error')));
  assert.equal(c.goi.length, 1);
  assert.match(c.goi[0]!.url, /rambo\.vi-du\.test\/api\/claude\/v1\/messages/);
  assert.equal(c.goi[0]!.model, 'claude-sonnet-5');
  const start = sk.find((e) => e.type === 'start')!;
  assert.equal(start.model, 'CuongMini Classic Sonic', 'không lộ tên thật');
  const done = sk.find((e) => e.type === 'done') as { usage?: { costUsd?: number } };
  assert.equal(done.usage?.costUsd, 0, 'rambo gói trọn ⇒ 0 $');
});

test('lượt thật: rambo lỗi GIỮA lượt ⇒ tự chuyển CuongMini Solid (một dòng `cong`) rồi làm tiếp', async (t) => {
  const tra = datRambo(true);
  const c = congGia({ ramboHong: true });
  t.after(() => { c.tra(); tra(); });
  const sk = await chay({ model: 'cm-default' });
  assert.ok(sk.some((e) => e.type === 'done'), JSON.stringify(sk.filter((e) => e.type === 'error')));
  assert.deepEqual(c.goi.map((g) => g.model), ['claude-sonnet-5', 'gpt-6-sol']);
  const cong = sk.find((e) => e.type === 'cong');
  assert.ok(cong && cong.ma === 'DOI_CONG_TU_DONG' && cong.ten === 'CuongMini Solid', JSON.stringify(cong));
  assert.equal(gw.ramboDangNghi(), true, 'cầu dao đã mở');
});

test('lượt thật: cầu dao đang mở ⇒ cm-default đi thẳng Solid, không đâm vào rambo', async (t) => {
  const tra = datRambo(true);
  const c = congGia({});
  t.after(() => { c.tra(); tra(); });
  gw.baoRamboHong();
  const sk = await chay({ model: 'cm-default' });
  assert.ok(sk.some((e) => e.type === 'done'));
  assert.deepEqual(c.goi.map((g) => g.model), ['gpt-6-sol']);
});

test('lượt thật: app cũ `sonnet-5` — rambo bật ⇒ rambo; rambo tắt ⇒ Solid', async (t) => {
  const tra = datRambo(true);
  const c = congGia({});
  t.after(() => { c.tra(); tra(); });
  await chay({ model: 'sonnet-5' });
  process.env.RAMBO_BAT = '0';
  await chay({ model: 'sonnet-5' });
  assert.deepEqual(c.goi.map((g) => g.model), ['claude-sonnet-5', 'gpt-6-sol']);
});

test('lượt thật: tài khoản FREE — rambo nghỉ ⇒ bảo trì, lỗi giữa lượt ⇒ bảo trì; KHÔNG gọi cổng tốn tiền', async (t) => {
  const tra = datRambo(true);
  const c = congGia({ ramboHong: true });
  t.after(() => { c.tra(); tra(); });
  const a = await chay({ model: 'cm-default', free: true });
  assert.equal(a.find((e) => e.type === 'error')?.code, 'CUONGMINI_BAO_TRI', JSON.stringify(a));
  assert.deepEqual(c.goi.map((g) => g.model), ['claude-sonnet-5'], 'chỉ rambo — không lùi Solid');
  const b = await chay({ model: 'cm-default', free: true });
  assert.equal(b.find((e) => e.type === 'error')?.code, 'CUONGMINI_BAO_TRI');
  assert.equal(c.goi.length, 1, 'cầu dao mở ⇒ Free không gọi gì');
});

test('lượt thật: hạn mức NHÓM chạy được Classic (rambo)', async (t) => {
  const tra = datRambo(true);
  const c = congGia({});
  t.after(() => { c.tra(); tra(); });
  const sk = await chay({ model: 'cm-classic-heshin', nhom: { loai: 'nhom', projectId: 7, key: 'LF', chu: { id: 2 } } });
  assert.ok(sk.some((e) => e.type === 'done'), JSON.stringify(sk.filter((e) => e.type === 'error')));
  assert.deepEqual(c.goi.map((g) => g.model), ['claude-haiku-4-5']);
});
