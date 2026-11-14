/**
 * Trang từ "dày" (Đợt A) — khoá băm, kiểm JSON của model, chống trùng, lượt/ngày. Model + R2 + Redis đều GIẢ.
 *   npx tsx --test src/services/ctlanguage/tuDienSau.test.ts
 */
import { strict as assert } from 'node:assert';
import { beforeEach, test } from 'node:test';
import { chuanCapDo, docHien, dungChuViet, khoaMoRong, kiemMoRong, nhacMoRong, tachJson } from './tuDienSauThuan.js';
import { luotFree, sinhMoRong, xemMoRong, xoaDemMoRong, xoaMoRong, type PhuThuocSau, type TuCoSo } from './tuDienSau.js';

const KIEN_KHANG = {
  nghia: [
    { loai: 'Tính từ', vi: 'khoẻ mạnh', donNgu: '身体好，没有病。', viDu: [
      { cau: '他的身体很健康。', doc: 'Tā de shēntǐ hěn jiànkāng.', vi: 'Cơ thể anh ấy rất khoẻ mạnh.' },
      { cau: '多吃蔬菜对身体好。', doc: 'x', vi: 'Câu này KHÔNG chứa từ ⇒ bị bỏ.' },
    ] },
    { loai: 'danh từ', vi: 'sức khoẻ', donNgu: 'state of being healthy', viDu: [{ cau: '祝你健康！', doc: 'Zhù nǐ jiànkāng!', vi: 'Chúc bạn mạnh khoẻ!' }] },
    { loai: 'x', vi: '', viDu: [] },
  ],
  tuGhep: [{ chu: '健康码', doc: 'jiànkāngmǎ', vi: 'mã sức khoẻ' }, { chu: '健康', doc: 'jiànkāng', vi: 'chính nó ⇒ bỏ' }, { chu: 'health', doc: '', vi: 'sai chữ viết ⇒ bỏ' }, { chu: '身体', doc: 'shēntǐ', vi: 'không chứa từ ⇒ bỏ' }],
  canNghia: [{ chu: '健壮', doc: 'jiànzhuàng', vi: 'cường tráng' }, { chu: '健壮', doc: 'jiànzhuàng', vi: 'trùng ⇒ bỏ' }],
  traiNghia: [{ chu: '虚弱', doc: 'xūruò', vi: 'yếu ớt' }],
  ketHop: [{ cum: '身体健康', doc: 'shēntǐ jiànkāng', vi: 'thân thể khoẻ mạnh' }, { cum: 'good health', vi: 'sai chữ viết' }],
  phanBiet: [{ voi: '健壮', doc: 'jiànzhuàng', vi: 'cường tráng', giong: ['• Đều nói về thể trạng tốt'], khac: ['健康 nói chung về sức khoẻ', '健壮 nhấn vào cơ bắp'] }, { voi: '健康', khac: ['chính nó'] }],
  giaiThich: { cachDung: 'Dùng làm **tính từ** hoặc danh từ.', sacThai: 'Trung tính.', loiHayMac: ['Sai: 我健康很好 → Đúng: 我身体很健康'], meoNho: 'Kiện khang = khoẻ mạnh.' },
  chuDe: ['Sức khoẻ', 'Y tế', 'Đời sống', 'Thừa'],
  capDo: ['hsk2', 'TOCFL 1', 'N5', 'cấp khó'],
  chuHan: [
    { chu: '健', lucThu: 'Hình thanh & hội ý', hinhThai: '亻+建', giaiNghia: 'Bộ nhân gợi nghĩa, 建 gợi âm.', meoNho: 'Người (亻) xây (建) nhà thì khoẻ.' },
    { chu: '康', lucThu: 'bịa', hinhThai: '广+隶' },
    { chu: '学', lucThu: 'hội ý', hinhThai: 'x' },
  ],
};

test('khoá băm: ổn định, phân biệt ngôn ngữ + cách đọc, không lộ chữ', () => {
  const k = khoaMoRong('zh', '健康', 'jiànkāng');
  assert.match(k, /^ctlanguage\/tu-mo-rong\/zh\/[0-9a-f]{32}\.json$/);
  assert.equal(k, khoaMoRong('zh', ' 健康 ', 'JiànKāng'));
  assert.notEqual(k, khoaMoRong('ja', '健康', 'jiànkāng'));
  assert.notEqual(khoaMoRong('ja', '日', 'にち'), khoaMoRong('ja', '日', 'ひ'));
  assert.equal(khoaMoRong('en', 'Take', null), khoaMoRong('en', 'take', ''));
  // NFD (dấu rời) và NFC ra cùng khoá.
  assert.equal(khoaMoRong('zh', '健康', 'jiànkāng'.normalize('NFD')), k);
});

test('tách JSON: bọc ``` vẫn đọc; văn bản rác ⇒ null', () => {
  assert.deepEqual(tachJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(tachJson('Đây là kết quả: {"a":{"b":2}} hết.'), { a: { b: 2 } });
  assert.equal(tachJson('không có gì'), null);
  assert.equal(tachJson('{"a": 1,'), null);
});

test('kiểm JSON: giữ mục đúng, bỏ từng mục hỏng', () => {
  const m = kiemMoRong('zh', { chu: '健康' }, KIEN_KHANG)!;
  assert.ok(m);
  assert.equal(m.nghia.length, 2);
  assert.equal(m.nghia[0].loai, 'tính từ');
  assert.equal(m.nghia[0].viDu.length, 1, 'ví dụ tiếng Trung không chứa từ phải bị bỏ');
  assert.equal(m.nghia[1].donNgu, null, 'giải thích đơn ngữ sai chữ viết ⇒ null');
  assert.deepEqual(m.tuGhep.map((t) => t.chu), ['健康码']);
  assert.deepEqual(m.canNghia.map((t) => t.chu), ['健壮']);
  assert.deepEqual(m.ketHop.map((t) => t.cum), ['身体健康']);
  assert.equal(m.phanBiet.length, 1);
  assert.deepEqual(m.phanBiet[0].giong, ['Đều nói về thể trạng tốt']);
  assert.equal(m.giaiThich.cachDung, 'Dùng làm tính từ hoặc danh từ.');
  assert.deepEqual(m.chuDe, ['Sức khoẻ', 'Y tế', 'Đời sống']);
  assert.deepEqual(m.capDo, ['HSK 2', 'TOCFL 1']);
  assert.deepEqual(m.chuHan.map((c) => [c.chu, c.lucThu]), [['健', 'hình thanh & hội ý'], ['康', null]]);
});

test('kiểm JSON: thiếu phần cốt lõi ⇒ null (không lưu nửa vời)', () => {
  assert.equal(kiemMoRong('zh', { chu: '健康' }, null), null);
  assert.equal(kiemMoRong('zh', { chu: '健康' }, []), null);
  assert.equal(kiemMoRong('zh', { chu: '健康' }, { ...KIEN_KHANG, nghia: [] }), null);
  assert.equal(kiemMoRong('zh', { chu: '健康' }, { ...KIEN_KHANG, giaiThich: { cachDung: '' } }), null);
  // Có nghĩa nhưng KHÔNG câu ví dụ nào hợp lệ.
  assert.equal(kiemMoRong('zh', { chu: '健康' }, { ...KIEN_KHANG, nghia: [{ vi: 'khoẻ', viDu: [{ cau: 'hello', vi: 'x' }] }] }), null);
});

test('tiếng Nhật: cách đọc kana ⇒ kèm romaji; lẫn chữ Hán ⇒ bỏ cách đọc; tiếng Anh: ví dụ không phiên âm', () => {
  assert.equal(docHien('ja', 'べんきょう'), 'べんきょう · benkyou');
  assert.equal(docHien('zh', 'jiànkāng'), 'jiànkāng');
  const ja = kiemMoRong('ja', { chu: '勉強' }, {
    nghia: [{ loai: 'danh từ', vi: 'việc học', donNgu: '学ぶこと。', viDu: [
      { cau: '毎日日本語を勉強します。', doc: 'わたしは まいにち にほんごを べんきょうします。', vi: 'Tôi học tiếng Nhật mỗi ngày.' },
      { cau: '勉強が好きです。', doc: '勉強がすきです。', vi: 'Tôi thích học.' }] }],
    giaiThich: { cachDung: 'Đi với する.' }, capDo: ['N5'], chuHan: [{ chu: '勉', lucThu: 'hình thanh', hinhThai: '免+力' }],
  })!;
  assert.match(ja.nghia[0].viDu[0].doc!, / · watashiwa mainichi nihongoo benkyoushimasu$/);
  assert.equal(ja.nghia[0].viDu[1].doc, null);
  assert.deepEqual(ja.capDo, ['JLPT N5']);
  const en = kiemMoRong('en', { chu: 'take' }, {
    nghia: [{ loai: 'động từ', vi: 'lấy, cầm', donNgu: 'to get something with your hands', viDu: [{ cau: 'She took my hand.', doc: '/ʃi tʊk/', vi: 'Cô ấy nắm tay tôi.' }] }],
    tuGhep: [{ chu: 'take off', doc: '/teɪk ɒf/', vi: 'cất cánh' }, { chu: 'Take', vi: 'chính nó' }, { chu: '取る', vi: 'sai chữ' }],
    giaiThich: { cachDung: 'Động từ bất quy tắc.' }, capDo: ['a1'], chuHan: [{ chu: '取', lucThu: 'hội ý' }],
  })!;
  assert.equal(en.nghia[0].viDu[0].doc, null);
  assert.deepEqual(en.tuGhep.map((t) => t.chu), ['take off']);
  assert.deepEqual(en.capDo, ['CEFR A1']);
  assert.deepEqual(en.chuHan, []);
});

test('tiện ích: chữ viết, cấp độ, lời nhắc theo ngôn ngữ', () => {
  assert.ok(dungChuViet('zh', '健康') && !dungChuViet('zh', 'health') && dungChuViet('en', 'take off') && !dungChuViet('en', '取る'));
  assert.equal(chuanCapDo('zh', 'HSK 7-9'), 'HSK 7-9');
  assert.equal(chuanCapDo('ja', 'jlpt n3'), 'JLPT N3');
  assert.equal(chuanCapDo('en', 'B2'), 'CEFR B2');
  assert.equal(chuanCapDo('en', 'N5'), null);
  assert.match(nhacMoRong('zh'), /HSK 3\.0/);
  assert.match(nhacMoRong('ja'), /HIRAGANA/);
  assert.match(nhacMoRong('en'), /"chuHan": \[\]/);
});

// ─── Dịch vụ với phụ thuộc giả ───────────────────────────────

const TU: TuCoSo = { id: 7, nn: 'zh', chu: '健康', doc: 'jiànkāng', hanViet: 'kiện khang', nghiaVi: 'khoẻ mạnh, sức khoẻ' };
function gia(o: { laPro?: boolean; traLoi?: () => Promise<string>; biCat?: boolean; chan?: boolean } = {}) {
  const kho = new Map<string, string>();
  const so = new Map<string, number>();
  let soLanGoi = 0;
  const pt: PhuThuocSau = {
    layTu: async (id) => (id === TU.id ? TU : id === 8 ? { ...TU, id: 8, chu: '身体', doc: 'shēntǐ' } : null),
    duLieuThat: async () => ({ tuGhep: [{ id: 99, chu: '健康码', doc: 'jiànkāngmǎ', hanViet: null, vi: 'mã sức khoẻ' }], capDo: ['HSK 2'], chuDe: ['Sức khoẻ'] }),
    doc: async (k) => kho.get(k) ?? null,
    ghi: async (k, j) => { kho.set(k, j); },
    xoa: async (k) => { kho.delete(k); },
    goi: async () => { soLanGoi++; return { text: o.traLoi ? await o.traLoi() : JSON.stringify(KIEN_KHANG), biCat: o.biCat, model: 'gia' }; },
    laPro: async () => !!o.laPro,
    tang: async (k, b) => { const n = (so.get(k) ?? 0) + b; so.set(k, n); return n; },
    dem: async (k) => so.get(k) ?? 0,
    lamGiau: async (_nn, m) => ({ ...m, canNghia: m.canNghia.map((c) => ({ ...c, id: 123, hanViet: 'kiện tráng' })) }),
    biChan: () => !!o.chan,
  };
  return { pt, kho, so, lanGoi: () => soLanGoi };
}
const loi = async (f: () => Promise<unknown>) => { try { await f(); } catch (e) { return e as { code?: string; statusCode?: number }; } return null; };

beforeEach(() => xoaDemMoRong());

test('xem: chưa có ⇒ ai null, vẫn trả dữ liệu thật; khách không có sổ lượt; KHÔNG gọi model', async () => {
  const g = gia();
  const r = await xemMoRong('zh', 7, null, g.pt);
  assert.equal(r.ai, null);
  assert.equal(r.luot, null);
  assert.deepEqual(r.that.capDo, ['HSK 2']);
  assert.equal(g.lanGoi(), 0);
  assert.equal((await loi(() => xemMoRong('ja', 7, null, g.pt)))?.statusCode, 404, 'sai ngôn ngữ của mục ⇒ 404');
  assert.equal((await loi(() => xemMoRong('zh', 1, null, g.pt)))?.statusCode, 404);
});

test('sinh: lưu một lần, lần sau (kể cả người khác, khách) đọc kho — không gọi model, không tốn lượt', async () => {
  const g = gia();
  const r = await sinhMoRong('zh', 7, 1, g.pt);
  assert.equal(r.ai!.nghia.length, 2);
  assert.equal(r.ai!.canNghia[0].id, 123, 'đã làm giàu bằng dữ liệu thật');
  assert.deepEqual(r.luot, { tran: luotFree(), conLai: luotFree() - 1 });
  assert.equal(g.kho.size, 1);
  const luu = JSON.parse([...g.kho.values()][0]);
  assert.equal(luu.chu, '健康');
  assert.equal(luu.model, 'gia');
  const r2 = await sinhMoRong('zh', 7, 2, g.pt);
  assert.equal(g.lanGoi(), 1);
  assert.equal(r2.luot!.conLai, luotFree());
  const khach = await xemMoRong('zh', 7, null, g.pt);
  assert.equal(khach.ai!.giaiThich.meoNho, 'Kiện khang = khoẻ mạnh.');
  // Đệm RAM mất (khởi động lại) ⇒ vẫn đọc được từ kho.
  xoaDemMoRong();
  assert.ok((await xemMoRong('zh', 7, null, g.pt)).ai);
  assert.equal(g.lanGoi(), 1);
});

test('chống trùng: 6 yêu cầu cùng lúc ⇒ model chạy MỘT lần, chỉ người đầu mất lượt', async () => {
  let tha!: () => void;
  const cho = new Promise<void>((r) => { tha = r; });
  const g = gia({ traLoi: async () => { await cho; return JSON.stringify(KIEN_KHANG); } });
  const ds = [1, 2, 3, 1, 2, 3].map((u) => sinhMoRong('zh', 7, u, g.pt));
  await new Promise((r) => setTimeout(r, 20));
  tha();
  const kq = await Promise.all(ds);
  assert.equal(g.lanGoi(), 1);
  assert.ok(kq.every((k) => k.ai?.nghia.length === 2));
  const luot = [...g.so.entries()].filter(([k]) => k.includes(':luot:'));
  assert.equal(luot.reduce((a, [, n]) => a + n, 0), 1);
});

test('model trả rác / bị cắt / lọt từ xấu ⇒ 503, KHÔNG lưu, trả lại lượt', async () => {
  for (const o of [{ traLoi: async () => 'xin lỗi, tôi không làm được' }, { biCat: true }, { chan: true }, { traLoi: async () => { throw new Error('mạng'); } }]) {
    xoaDemMoRong();
    const g = gia(o);
    const e = await loi(() => sinhMoRong('zh', 7, 1, g.pt));
    assert.equal(e?.code, 'CTL_TU_SAU_AI_LOI');
    assert.equal(e?.statusCode, 503);
    assert.equal(g.kho.size, 0);
    assert.ok([...g.so.values()].every((n) => n === 0), 'lượt phải được trả lại');
    assert.equal((await xemMoRong('zh', 7, 1, g.pt)).ai, null);
  }
});

test('hết lượt/ngày ⇒ 429, không gọi model; từ ĐÃ có vẫn xem được; người chờ nhờ không bị vạ lây', async () => {
  const g = gia();
  // Người 1 đã dùng hết lượt.
  const ngay = [...(await (async () => { await sinhMoRong('zh', 7, 1, g.pt); return g.so.keys(); })())].find((k) => k.includes(':luot:'))!;
  g.so.set(ngay, luotFree());
  const e = await loi(() => sinhMoRong('zh', 8, 1, g.pt));
  assert.equal(e?.code, 'CTL_TU_SAU_HET_LUOT');
  assert.equal(e?.statusCode, 429);
  assert.equal(g.lanGoi(), 1);
  assert.ok((await sinhMoRong('zh', 7, 1, g.pt)).ai, 'từ đã có trong kho không cần lượt');
  // Người 1 (hết lượt) và người 2 (còn lượt) cùng bấm từ MỚI: người 2 vẫn được.
  const [a, b] = await Promise.allSettled([sinhMoRong('zh', 8, 1, g.pt), sinhMoRong('zh', 8, 2, g.pt)]);
  assert.equal(a.status, 'rejected');
  assert.equal(b.status, 'fulfilled');
  assert.equal(g.lanGoi(), 2);
});

test('admin xoá ⇒ lượt sau sinh lại', async () => {
  const g = gia();
  await sinhMoRong('zh', 7, 1, g.pt);
  await xoaMoRong('zh', 7, g.pt);
  assert.equal(g.kho.size, 0);
  assert.equal((await xemMoRong('zh', 7, null, g.pt)).ai, null);
  await sinhMoRong('zh', 7, 1, g.pt);
  assert.equal(g.lanGoi(), 2);
});
