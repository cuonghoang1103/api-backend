/**
 * Bảng model CuongMini + khoá/vé + tự chuyển cổng + công tắc rambo + tóm tắt bằng model của cuộc
 * (18/10/2026). Thuần — không gọi mạng, không cần CSDL.
 *
 *   npx tsx --test src/services/agent/bangModel.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.JWT_SECRET ||= 'bi-mat-chi-de-test-bang-model';

const {
  MA_MAC_DINH, TEN_CONG, TEN_INVISIBLE, anTenThat, bangModel, baoCongHong, baoCongOk, congDangHong, laLoiCongHong,
  timModel, tuongDuongFree,
} = await import('./bangModel.js');
const { daMoKhoa, mucChoApp } = await import('./anthropicChinhHang/dinhTuyen.js');
const { HAN_VE_MS, docBoVe, docMotVe, kyVe } = await import('./anthropicChinhHang/ve.js');
const { chamTran, gopTran } = await import('./tranModel.js');
const { congAgent, datRamboBatAdmin, ramboBat } = await import('../llm/gateway.js');
const { ghiNhoLuotDaBo } = await import('./tomTatLuotCu.js');
const { effortGpt, nguongNen, tranKyTuCua } = await import('./turn.js');

const KHONG_QUYEN = { laAdmin: false, modelCao: false, invisible: false };

test('bảng model: xếp năng lực cao → thấp, mặc định CuongMini Solid = gpt-6-sol', () => {
  const ds = bangModel();
  for (let i = 1; i < ds.length; i++) assert.ok(ds[i - 1]!.nangLuc >= ds[i]!.nangLuc, `${ds[i - 1]!.id} phải đứng trên ${ds[i]!.id}`);
  assert.equal(ds[0]!.ten, TEN_INVISIBLE);
  assert.equal(MA_MAC_DINH, 'cm-solid');
  const solid = timModel(undefined);
  assert.equal(solid.model, 'gpt-6-sol');
  assert.equal(solid.ten, 'CuongMini Solid');
  assert.equal(solid.cong, 'modelapi');
  // Bộ tên chủ app chốt.
  const theoModel = Object.fromEntries(ds.map((m) => [m.model, m]));
  assert.equal(theoModel['claude-haiku-5-5']!.ten, 'CuongMini Heshin 5.5');
  assert.equal(theoModel['claude-sonnet-5-5']!.ten, 'CuongMini Sonic 5.5');
  assert.equal(theoModel['claude-opus-5-5']!.ten, 'CuongMini Optimum 5.5');
  assert.equal(theoModel['claude-fable-5-1']!.ten, 'CuongMini Invisible 5.1');
  assert.equal(theoModel['gpt-5.6-sol']!.ten, 'CuongMini Shin');
  assert.equal(TEN_CONG.anthropic, 'CuongMini Code Max');
});

test('nhóm free / khoá chung / khoá Invisible đúng như chủ app chốt', () => {
  const khoa = (model: string) => bangModel().find((m) => m.model === model)!.khoa;
  for (const m of ['gpt-6-sol', 'gpt-5.6-sol', 'claude-haiku-5-5', 'claude-sonnet-5-5']) assert.equal(khoa(m), 'free', m);
  assert.equal(khoa('claude-opus-5-5'), 'chung');
  assert.equal(khoa('claude-fable-5-1'), 'invisible');
});

test('mã cũ / lạ ⇒ đúng model (bí danh) hoặc Solid — không bao giờ null', () => {
  assert.equal(timModel('cl-opus-5-5').id, 'cm-optimum');
  assert.equal(timModel('cl-free').id, 'cm-heshin');
  assert.equal(timModel('gpt-sol').id, 'cm-solid');
  assert.equal(timModel('sonnet-5').id, 'cm-solid');
  assert.equal(timModel('opus-5').id, 'cm-solid');
  assert.equal(timModel(42).id, 'cm-solid');
});

test('ẩn tên thật: mục gửi app không có tên model / tên cổng thật', () => {
  for (const m of bangModel()) {
    const muc = mucChoApp(m, KHONG_QUYEN, true) as unknown as Record<string, unknown>;
    assert.equal(muc.model, undefined, 'lộ trường `model`');
    const chu = [muc.id, muc.ten, muc.mo, muc.moEn, muc.nhom].join(' ');
    assert.doesNotMatch(chu, /claude|gpt|anthropic|modelapi|opus|sonnet|haiku|fable|rambo|openai/i, `lộ tên thật: ${chu}`);
    assert.match(String(muc.ten), /^CuongMini /);
  }
});

test('máy chủ từ chối model trả phí khi không có vé; free luôn mở; admin mở hết', () => {
  const optimum = timModel('cm-optimum');
  const inv = timModel('cm-invisible');
  assert.equal(daMoKhoa(optimum, KHONG_QUYEN), false);
  assert.equal(daMoKhoa(inv, KHONG_QUYEN), false);
  assert.equal(daMoKhoa(timModel('cm-sonic'), KHONG_QUYEN), true);
  assert.equal(daMoKhoa(timModel('cm-solid'), KHONG_QUYEN), true);
  assert.equal(mucChoApp(optimum, KHONG_QUYEN, true).canMoKhoa, true);
  assert.equal(mucChoApp(optimum, KHONG_QUYEN, true).loaiKhoa, 'chung');
  assert.equal(mucChoApp(inv, KHONG_QUYEN, true).loaiKhoa, 'invisible');
  const admin = { laAdmin: true, modelCao: true, invisible: true };
  assert.equal(daMoKhoa(inv, admin), true);
});

test('khoá chung và khoá Invisible TÁCH nhau', () => {
  const chiChung = { laAdmin: false, modelCao: true, invisible: false };
  const chiInv = { laAdmin: false, modelCao: false, invisible: true };
  assert.equal(daMoKhoa(timModel('cm-optimum'), chiChung), true);
  assert.equal(daMoKhoa(timModel('cm-invisible'), chiChung), false, 'khoá chung KHÔNG được mở Invisible');
  assert.equal(daMoKhoa(timModel('cm-invisible'), chiInv), true);
  assert.equal(daMoKhoa(timModel('cm-optimum'), chiInv), false, 'khoá Invisible KHÔNG được mở model khoá chung');
});

test('vé sống 48 giờ rồi tự chết; vé hạn xa hơn 48 giờ (vé 30 ngày cũ) bị từ chối', () => {
  const now = 1_800_000_000_000;
  const { ve } = kyVe('chung', 7, 'bam-gia', now);
  assert.equal(HAN_VE_MS, 48 * 3600_000);
  assert.ok(docMotVe(ve, 7, now + 47 * 3600_000), 'vé còn hạn ở giờ thứ 47');
  assert.equal(docMotVe(ve, 7, now + 48 * 3600_000 + 1), null, 'vé phải chết sau 48 giờ');
  assert.equal(docMotVe(ve, 8, now), null, 'vé của người khác');
  // Vé có hạn 30 ngày (đời cũ, cùng chữ ký hợp lệ) ⇒ từ chối.
  const { ve: veDai } = kyVe('chung', 7, 'bam-gia', now + 28 * 86_400_000);
  assert.equal(docMotVe(veDai, 7, now), null);
});

test('admin đổi mật khẩu ⇒ vé cũ chết; không đổi ⇒ vé vẫn sống; vé chung không giả làm vé Invisible', async () => {
  const now = Date.now();
  const bo = [kyVe('chung', 9, 'bam-chung-1', now).ve, kyVe('invisible', 9, 'bam-inv-1', now).ve].join('~');
  const cu = await docBoVe(9, bo, async (l) => (l === 'chung' ? 'bam-chung-1' : 'bam-inv-1'), now);
  assert.deepEqual([cu.chung, cu.invisible], [true, true]);
  const doiChung = await docBoVe(9, bo, async (l) => (l === 'chung' ? 'bam-chung-2' : 'bam-inv-1'), now);
  assert.deepEqual([doiChung.chung, doiChung.invisible], [false, true], 'đổi khoá chung chỉ giết vé chung');
  const tat = await docBoVe(9, bo, async () => null, now);
  assert.deepEqual([tat.chung, tat.invisible], [false, false]);
  // Đổi tiền tố `ca` → `ci` (giả vé Invisible từ vé chung) ⇒ sai chữ ký.
  const gia = kyVe('chung', 9, 'bam-inv-1', now).ve.replace(/^ca\./, 'ci.');
  assert.equal((await docBoVe(9, gia, async () => 'bam-inv-1', now)).invisible, false);
});

test('tự chuyển cổng: free ⇄ free tương đương ở cổng KIA; trả phí chỉ về free, không tự nâng', () => {
  for (const m of bangModel()) {
    const d = tuongDuongFree(m);
    assert.ok(d, `${m.id} không có model tương đương`);
    assert.equal(d!.khoa, 'free', `${m.id} lùi sang model trả phí`);
    assert.notEqual(d!.cong, m.cong, `${m.id} lùi sang CÙNG cổng`);
  }
  assert.equal(tuongDuongFree(timModel('cm-sonic'))!.id, 'cm-solid');
  assert.equal(tuongDuongFree(timModel('cm-solid'))!.id, 'cm-sonic');
  assert.equal(tuongDuongFree(timModel('cm-optimum'))!.id, 'cm-solid');
  assert.equal(tuongDuongFree(timModel('cm-invisible'))!.id, 'cm-solid');
});

test('tự chuyển cổng: phân loại lỗi cổng hỏng ≠ lỗi yêu cầu; cầu dao 60s', () => {
  for (const t of ['HTTP 502 Bad Gateway', 'HTTP 529 overloaded', 'HTTP 429 rate', 'fetch failed', 'This operation was aborted',
    'HTTP 400 Your credit balance is too low', 'HTTP 503 No available channel for model gpt-6-sol', 'HTTP 403 insufficient quota']) {
    assert.ok(laLoiCongHong(t), t);
  }
  assert.ok(laLoiCongHong('mọi key lỗi', 'CONG_ANTHROPIC_HONG'));
  for (const t of ['HTTP 400 invalid_request_error: messages.0', 'HTTP 413 request too large', 'HTTP 401 invalid api key']) {
    assert.equal(laLoiCongHong(t), false, t);
  }
  const now = 1_000_000;
  baoCongHong('anthropic', now);
  assert.ok(congDangHong('anthropic', now + 1000));
  assert.equal(congDangHong('modelapi', now + 1000), false);
  assert.equal(congDangHong('anthropic', now + 61_000), false);
  baoCongOk('anthropic');
});

test('rambo TẮT mặc định — kể cả khi có AGENT_GATEWAY_*; env RAMBO_BAT / công tắc admin bật lại', () => {
  const luu = ['AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY', 'RAMBO_BAT'].map((t) => [t, process.env[t]] as const);
  process.env.AGENT_GATEWAY_BASE_URL = 'https://rambo.ai.vn/api/claude';
  process.env.AGENT_GATEWAY_API_KEY = 'sk-gia';
  delete process.env.RAMBO_BAT;
  try {
    datRamboBatAdmin(false);
    assert.equal(ramboBat(), false);
    assert.equal(congAgent(), null);
    datRamboBatAdmin(true);
    assert.equal(ramboBat(), true);
    assert.equal(congAgent()?.label, 'cong-agent');
    process.env.RAMBO_BAT = '0';
    assert.equal(congAgent(), null, 'env RAMBO_BAT=0 phải thắng công tắc admin');
    datRamboBatAdmin(false);
    process.env.RAMBO_BAT = '1';
    assert.equal(congAgent()?.label, 'cong-agent');
  } finally {
    datRamboBatAdmin(false);
    for (const [t, gt] of luu) { if (gt === undefined) delete process.env[t]; else process.env[t] = gt; }
  }
});

test('tóm tắt khi hội thoại đầy dùng CHÍNH model của cuộc (đệm theo băm, khoá có model)', async () => {
  const hoiThoai = [
    { role: 'user' as const, content: 'Đề bài: sửa lỗi đăng nhập' },
    { role: 'assistant' as const, content: 'Đã đọc auth.ts' },
    { role: 'user' as const, content: 'Giờ thêm test' },
    { role: 'assistant' as const, content: 'Đã thêm test' },
    { role: 'user' as const, content: 'Câu mới nhất' },
  ];
  const daGoi: string[] = [];
  const goiCua = (ma: string) => Object.assign(async (_s: string, u: string) => {
    daGoi.push(ma);
    return `TÓM TẮT bằng ${ma}: ${u.slice(0, 30)} — đủ dài để vượt ngưỡng bốn mươi ký tự.`;
  }, { maModel: ma });
  const a = await ghiNhoLuotDaBo(hoiThoai, 1, undefined, goiCua('cm-sonic'));
  assert.equal(a.daGoiModel, true);
  assert.match(a.tomTat ?? '', /cm-sonic/);
  const b = await ghiNhoLuotDaBo(hoiThoai, 1, undefined, goiCua('cm-sonic'));
  assert.equal(b.daGoiModel, false, 'cùng phần bỏ + cùng model ⇒ trúng đệm');
  const c = await ghiNhoLuotDaBo(hoiThoai, 1, undefined, goiCua('cm-optimum'));
  assert.equal(c.daGoiModel, true, 'đổi model ⇒ tóm tắt lại bằng model mới');
  assert.match(c.tomTat ?? '', /cm-optimum/);
  assert.deepEqual(daGoi, ['cm-sonic', 'cm-optimum']);
});

test('trần theo model: mặc định đủ mọi model, admin ghi đè từng ô, null = không giới hạn', () => {
  const t = gopTran({ 'cm-solid': { pro: { thang: 1, ngay: null } } });
  for (const m of bangModel()) assert.ok(t[m.id], `thiếu trần cho ${m.id}`);
  assert.deepEqual(t['cm-solid']!.pro, { thang: 1, ngay: null });
  assert.ok((t['cm-invisible']!.pro.thang ?? 0) < (t['cm-nova']!.pro.thang ?? 0), 'model đắt phải có trần thấp hơn');
  assert.equal(chamTran(1, 0, { thang: 1, ngay: null }), true);
  assert.equal(chamTran(0.5, 0.5, { thang: 1, ngay: null }), false);
});

test('không giới hạn năng lực: trần ký tự theo cửa sổ thật, effort theo mức người dùng', () => {
  // Nén sớm 55% cửa sổ (18/10/2026).
  assert.equal(tranKyTuCua(1_000_000), 1_320_000);
  assert.equal(tranKyTuCua(400_000), 528_000);
  assert.equal(nguongNen(400_000), 480_000);
  assert.equal(effortGpt('thap'), 'low');
  assert.equal(effortGpt('ultracode'), 'xhigh');
  assert.equal(effortGpt(undefined), 'medium');
});

test('QA 18/10: app CŨ gửi mã cũ (rambo/modelapi/cl-*) ⇒ không lỗi, không mở khoá ngầm model trả phí', () => {
  for (const cu of ['sonnet-5', 'opus-4-8', 'sonnet-4-6', 'haiku-4-5', 'opus-4-6', 'opus-4-7', 'fable-5', 'gpt-terra', '', undefined, null, 42]) {
    const m = timModel(cu);
    assert.equal(m.khoa, 'free', `mã cũ ${String(cu)} không được rơi vào model cần khoá`);
    assert.equal(m.id, MA_MAC_DINH);
  }
  assert.equal(timModel('cl-opus-5-5').id, 'cm-optimum');
  assert.equal(daMoKhoa(timModel('cl-opus-5-5'), KHONG_QUYEN), false, 'cl-opus-5-5 vẫn cần khoá');
  assert.equal(daMoKhoa(timModel('cl-fable-5-1'), { laAdmin: false, modelCao: true, invisible: false }), false, 'khoá chung không mở Invisible');
});

test('QA 18/10: câu lỗi gửi app không lộ tên model thật / tên cổng thật', () => {
  const loi = 'HTTP 503 {"error":{"message":"No available channel for model gpt-6-sol under group default"}}';
  const ra = anTenThat(loi);
  assert.ok(!ra.includes('gpt-6-sol') && ra.includes('CuongMini Solid'), ra);
  assert.ok(!anTenThat('gpt-6-luna lỗi').includes('gpt-6-luna'));
  assert.equal(anTenThat('Mọi key của cổng Claude chính hãng đều lỗi'), `Mọi key của ${TEN_CONG.anthropic} đều lỗi`);
  assert.ok(!/claude-|gpt-|anthropic|modelapi/i.test(anTenThat('claude-sonnet-5-5 via api.anthropic.com / modelapi.vn: gpt-5.6-sol')));
  assert.equal(anTenThat('x gpt-9 y', { 'gpt-9': 'CuongMini Z' }), 'x CuongMini Z y');
});
