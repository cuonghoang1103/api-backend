/**
 * Trò chuyện cùng CuongMini — chảy dần (19/10/2026): cắt câu cho TTS, đọc thẻ sửa lỗi,
 * định tuyến cổng + lùi + trần $, thứ tự phát, tiến độ buổi. Không gọi mạng/CSDL thật.
 *   npx tsx --test src/services/ielts/troChuyen/troChuyen.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BoCatCau, chonDuong, docCaiDat, docMeta, dungPrompt, loiNoiSach, thanhTinNhan, TRAN_NGAY_MAC_DINH } from './luong.js';
import { CHU_DE, cauMoDau, dsChoWeb, timChuDe, MA_BAI_HIEN_TAI } from './chuDe.js';
import { HangDoc, cauHoiGanNhat, chayLuot, docKetQuaCham, traLoiNhanhLanguage, type PhuThuocTC, type SuKienTC } from './troChuyenLuong.service.js';
import { gotPhien, kiemMuc, tomTat } from './phien.service.js';

/** Đẩy một chuỗi vào bộ cắt theo từng mẩu `n` ký tự (giả lập model chảy chữ). */
function chay(text: string, n = 3) {
  const bo = new BoCatCau();
  const ra: string[] = [];
  for (let i = 0; i < text.length; i += n) ra.push(...bo.them(text.slice(i, i + n)));
  ra.push(...bo.ket());
  return { ra, meta: bo.meta };
}

test('cắt câu: câu đầu cắt sớm, thẻ [en] luôn cân, phần sau ### không bị đọc', () => {
  const { ra, meta } = chay('[en]Nice![/en] Câu của bạn gần đúng rồi, nói [en]I like playing[/en] nhé. [en]What else do you like to do?[/en]\n###\n{"sua":null,"tu":[],"dich":"Hay đó!","cam":"khen"}');
  assert.equal(ra[0], '[en]Nice![/en]');
  for (const c of ra) assert.equal((c.match(/\[en\]/g) ?? []).length, (c.match(/\[\/en\]/g) ?? []).length, c);
  assert.ok(!ra.join(' ').includes('###') && !ra.join(' ').includes('"sua"'));
  assert.ok(meta.includes('"cam":"khen"'));
  assert.ok(ra.at(-1)!.includes('What else do you like to do?'));
});

test('cắt câu: câu dài bị cắt GIỮA thẻ [en] thì đóng/mở lại thẻ', () => {
  const { ra } = chay('Đúng rồi. [en]I went to the market yesterday. Then I bought some fruit and vegetables for dinner. What did you do?[/en]', 4);
  assert.ok(ra.length >= 3, JSON.stringify(ra));
  assert.ok(ra[1]!.startsWith('[en]') && ra[1]!.endsWith('[/en]'), ra[1]);
  assert.ok(ra[2]!.startsWith('[en]'), ra[2]);
});

test('cắt câu: số thập phân và tiếng Nhật/Trung (dấu câu CJK không cần khoảng trắng)', () => {
  assert.deepEqual(chay('Band 6.5 là mục tiêu tốt lắm nha bạn ơi.').ra, ['Band 6.5 là mục tiêu tốt lắm nha bạn ơi.']);
  const ja = chay('[en]いいですね！ラーメンがすきですか。どこでたべますか？[/en]', 2).ra;
  assert.equal(ja[0], '[en]いいですね！[/en]');
  assert.ok(ja.every((c) => c.startsWith('[en]') && c.endsWith('[/en]')), JSON.stringify(ja));
});

test('cắt câu: "###" bị cắt đôi giữa hai mẩu vẫn nhận ra', () => {
  const bo = new BoCatCau();
  const ra = [...bo.them('Chào bạn! Hôm nay thế nào? #'), ...bo.them('##{"cam":"vui"}'), ...bo.ket()];
  assert.ok(!ra.join('').includes('#'));
  assert.equal(docMeta(bo.meta).cam, 'vui');
});

test('docMeta: khoan dung + thẻ sửa lỗi chỉ khi câu đúng KHÁC câu người học', () => {
  const m = docMeta('```json\n{"sua":{"ban":"I like play football","dung":"I like playing football","viSao":"like + V-ing","doc":""},"tu":[{"tu":"weekend","nghia":"cuối tuần"},{"tu":"x"}],"dich":"Hay đó","cam":"sua"}\n```');
  assert.equal(m.sua?.dung, 'I like playing football');
  assert.equal(m.tu.length, 1);
  assert.equal(docMeta('{"sua":{"ban":"OK","dung":"OK"}}').sua, null);
  assert.deepEqual(docMeta('không có json'), { sua: null, tu: [], dich: '', cam: 'hoi' });
  assert.equal(loiNoiSach('**Hi!** bạn\n###\n{}'), 'Hi! bạn');
});

test('định tuyến: chính hãng khi có key + còn trần; tắt/không key/hết trần ⇒ dự phòng', () => {
  assert.equal(chonDuong({ bat: true, coKey: true, daDungNgayUsd: 0.1, tranNgayUsd: 0.5 }).duong, 'chinh-hang');
  assert.deepEqual(chonDuong({ bat: true, coKey: true, daDungNgayUsd: 0.5, tranNgayUsd: 0.5 }), { duong: 'du-phong', lyDo: 'het-tran' });
  assert.equal(chonDuong({ bat: true, coKey: false, daDungNgayUsd: 0, tranNgayUsd: 0.5 }).lyDo, 'khong-key');
  assert.equal(chonDuong({ bat: false, coKey: true, daDungNgayUsd: 0, tranNgayUsd: 0.5 }).lyDo, 'tat');
  // Sổ hỏng ⇒ vô cực ⇒ không bao giờ tiêu tiền chính hãng.
  assert.equal(chonDuong({ bat: true, coKey: true, daDungNgayUsd: Number.POSITIVE_INFINITY, tranNgayUsd: 100 }).duong, 'du-phong');
  assert.deepEqual(docCaiDat(null), { bat: true, tranNgayUsd: TRAN_NGAY_MAC_DINH });
  assert.deepEqual(docCaiDat('{"bat":false,"tranNgayUsd":2}'), { bat: false, tranNgayUsd: 2 });
  assert.equal(docCaiDat('{"tranNgayUsd":-3}').tranNgayUsd, TRAN_NGAY_MAC_DINH);
});

test('lịch sử ⇒ tin nhắn hợp lệ: bắt đầu bằng user, không hai lượt cùng vai liền nhau', () => {
  const m = thanhTinNhan([{ ai: true, text: 'Hi!' }, { ai: false, text: 'a' }, { ai: false, text: 'b' }, { ai: true, text: 'c' }], 'd');
  assert.deepEqual(m.map((x) => x.role), ['user', 'assistant', 'user']);
  assert.equal(m[0]!.content, 'a\nb');
});

test('chủ đề: đủ ba thứ tiếng, IELTS có Part 1/2/3 + cue card, mở đầu không cố định một câu', () => {
  assert.ok(CHU_DE.en.some((c) => c.cueCard) && CHU_DE.en.some((c) => c.nhom === 'IELTS Part 3'));
  assert.ok(CHU_DE.ja.some((c) => c.nhom === 'JLPT N3') && CHU_DE.zh.some((c) => c.nhom === 'HSK 4'));
  const bai = timChuDe('en', 'khong-co', 'Unit 3');
  assert.equal(bai.id, MA_BAI_HIEN_TAI);
  assert.notEqual(cauMoDau(bai, 0), cauMoDau(bai, 0.99));
  assert.ok(!JSON.stringify(dsChoWeb('en')).includes('"vai"'), 'không lộ prompt nội bộ ra web');
  for (const nn of ['en', 'ja', 'zh'] as const) for (const c of CHU_DE[nn]) for (const m of c.moDau) assert.ok(/\[en\][\s\S]+\[\/en\]/.test(m), `${c.id} thiếu [en]`);
  assert.ok(dungPrompt('en', CHU_DE.en[0]!).includes('KHÔNG chen tiếng Việt'), 'chế độ giám khảo giữ nhịp phòng thi');
});

test('HangDoc: câu sau đọc xong TRƯỚC vẫn gửi SAU câu trước', async () => {
  const ra: string[] = [];
  const cham = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const h = new HangDoc(async (t) => { await cham(t === 'một' ? 40 : 5); return { audioUrls: [t], giongThat: 'mac-dinh' }; }, (e) => { if (e.type === 'cau') ra.push(e.text); }, Date.now());
  h.them('một'); h.them('hai'); h.them('ba');
  await h.doi();
  assert.deepEqual(ra, ['một', 'hai', 'ba']);
});

/** Bộ phụ thuộc giả: model "chảy" từng mẩu, TTS trả URL giả, đếm số lần gọi mỗi cổng. */
function gia(o: { chinhHangLoi?: boolean; coKey?: boolean; daChi?: number; tran?: number }) {
  const dem = { chinhHang: 0, duPhong: 0, tts: 0 };
  const loi = '[en]Nice![/en] Bạn nói gần đúng rồi. [en]What do you like?[/en]\n###\n{"sua":{"ban":"I like play","dung":"I like playing","viSao":"like + V-ing"},"tu":[],"dich":"Hay đó","cam":"sua"}';
  const chay = async (onToken?: (d: string) => void) => { for (let i = 0; i < loi.length; i += 7) { onToken?.(loi.slice(i, i + 7)); await new Promise((r) => setTimeout(r, 1)); } };
  const pt: PhuThuocTC = {
    stt: async () => 'I like play football',
    tts: async (t) => { dem.tts++; return { audioUrls: [`u:${t.length}`], giongThat: 'mac-dinh' }; },
    chinhHang: async (x) => { dem.chinhHang++; if (o.chinhHangLoi) throw new Error('HTTP 400 credit balance is too low'); await chay(x.onToken); return { usd: 0.0003 }; },
    duPhong: async (x) => { dem.duPhong++; await chay(x.onToken); return {}; },
    caiDat: async () => ({ bat: true, tranNgayUsd: o.tran ?? 0.5 }),
    coKey: async () => o.coKey ?? true,
    daChi: async () => o.daChi ?? 0,
    aiSan: () => true,
  };
  return { pt, dem };
}
async function luot(pt: PhuThuocTC) {
  const ev: SuKienTC[] = [];
  await chayLuot(1_000_000 + Math.floor(Math.random() * 1e6), { audio: Buffer.from('abc'), mime: 'audio/webm', ngonNgu: 'en' }, (e) => ev.push(e), undefined, pt);
  return ev;
}

test('một lượt: nghe → các câu (đúng thứ tự) → xong; dùng Heshin chính hãng, ghi mốc thời gian', async () => {
  const { pt, dem } = gia({});
  const ev = await luot(pt);
  assert.deepEqual([...new Set(ev.map((e) => e.type))], ['nghe', 'cau', 'xong']);
  const cau = ev.filter((e): e is Extract<SuKienTC, { type: 'cau' }> => e.type === 'cau');
  assert.deepEqual(cau.map((c) => c.i), cau.map((_, i) => i));
  assert.equal(cau[0]!.text, '[en]Nice![/en]');
  const x = ev.at(-1) as Extract<SuKienTC, { type: 'xong' }>;
  assert.equal(x.duong, 'chinh-hang');
  assert.equal(x.meta.sua?.dung, 'I like playing');
  assert.ok(x.moc.stt !== undefined && x.moc.chuDau !== undefined && x.moc.cauDau !== undefined && x.moc.ttsDau !== undefined);
  assert.equal(dem.chinhHang, 1);
  assert.equal(dem.duPhong, 0);
});

test('chính hãng lỗi (hết credit) ⇒ tự lùi gpt-6-sol trong CÙNG lượt, người học không thấy lỗi', async () => {
  const { pt, dem } = gia({ chinhHangLoi: true });
  const ev = await luot(pt);
  const x = ev.at(-1) as Extract<SuKienTC, { type: 'xong' }>;
  assert.equal(x.type, 'xong');
  assert.equal(x.duong, 'du-phong');
  assert.deepEqual([dem.chinhHang, dem.duPhong], [1, 1]);
});

test('chạm trần $/ngày ⇒ không gọi chính hãng, đi thẳng dự phòng', async () => {
  const { pt, dem } = gia({ daChi: 0.51, tran: 0.5 });
  const ev = await luot(pt);
  assert.equal((ev.at(-1) as { duong?: string }).duong, 'du-phong');
  assert.deepEqual([dem.chinhHang, dem.duPhong], [0, 1]);
});

test('lượt mở đầu (không audio): không gọi model, câu mở theo chủ đề', async () => {
  const { pt, dem } = gia({});
  const ev: SuKienTC[] = [];
  await chayLuot(42, { ngonNgu: 'ja', chuDeId: 'ja-n5-jiko' }, (e) => ev.push(e), undefined, pt);
  assert.equal(ev.at(-1)!.type, 'xong');
  assert.equal(dem.chinhHang + dem.duPhong, 0);
  assert.ok((ev.find((e) => e.type === 'cau') as { text: string }).text.includes('[en]'));
});

test('tiếp tục buổi trước: câu mở nhắc lại ĐÚNG câu hỏi dở, không chào lại từ đầu', async () => {
  const ls = [{ ai: true, text: 'Hay đó! [en]Nice.[/en] [en]Where do you live now?[/en]' }, { ai: false, text: 'Hanoi' }];
  assert.equal(cauHoiGanNhat(ls), 'Where do you live now?');
  const { pt } = gia({});
  const ev: SuKienTC[] = [];
  await chayLuot(43, { ngonNgu: 'en', tiepTuc: true, lichSu: ls }, (e) => ev.push(e), undefined, pt);
  const x = ev.at(-1) as Extract<SuKienTC, { type: 'xong' }>;
  assert.ok(x.noi.startsWith('Chào mừng bạn quay lại') && x.noi.includes('Where do you live now?'), x.noi);
});

test('chấm buổi: band IELTS làm tròn đúng luật (trung bình 4 tiêu chí → 0.5 gần nhất)', () => {
  const k = docKetQuaCham('{"tieuChi":[{"ma":"FC","diem":6},{"ma":"LR","diem":6.5},{"ma":"GRA","diem":5.5},{"ma":"PR","diem":6.5}],"nhanXet":"ok","goiY":["a"]}', 'en');
  assert.equal(k?.tong, 6); // (6+6.5+5.5+6.5)/4 = 6.125 ⇒ 6.0
  const k2 = docKetQuaCham('{"tieuChi":[{"ma":"FC","diem":6},{"ma":"LR","diem":6.5},{"ma":"GRA","diem":6},{"ma":"PR","diem":6.5}]}', 'en');
  assert.equal(k2?.tong, 6.5); // 6.25 ⇒ 6.5
  assert.equal(docKetQuaCham('{"tieuChi":[{"ma":"troi_chay","diem":140}]}', 'ja')?.tong, 100);
  assert.equal(docKetQuaCham('rác', 'en'), null);
});

test('tiến độ buổi: mã hợp lệ, gọt lịch sử giữ đuôi, tóm tắt không gửi cả lịch sử', () => {
  assert.equal(kiemMuc('tc:en-p1-food'), 'tc:en-p1-food');
  assert.throws(() => kiemMuc('xx:../../etc'));
  const d = gotPhien({ cheDo: 'tro-chuyen', ten: 'Food', lichSu: Array.from({ length: 60 }, (_, i) => ({ ai: i % 2 === 1, text: `câu ${i} `.repeat(80) })), soLuot: 30 });
  assert.ok(d.lichSu!.length <= 24 && JSON.stringify(d).length <= 24_000);
  assert.equal(d.lichSu!.at(-1)!.text.startsWith('câu 59'), true);
  const t = tomTat('tc:x', JSON.stringify({ cheDo: 'phat-am', ten: 'Bài 3', viTri: 4, tongCau: 12, lichSu: [{ ai: true, text: '[en]Hi[/en]' }] }), new Date(0));
  assert.deepEqual([t.cheDo, t.viTri, t.tongCau, t.cauCuoi], ['phat-am', 4, 12, 'Hi']);
  assert.ok(!('lichSu' in t));
});

test('hỏi gia sư: Heshin chính hãng trước, hỏng/hết khoá ⇒ tự lùi gpt-6-sol modelapi (20/10/2026)', async () => {
  const vao = { userId: 1, system: 's', content: 'Âm th đọc sao?' };
  const a = gia({});
  const r1 = await traLoiNhanhLanguage(vao, a.pt);
  assert.equal(r1.duong, 'chinh-hang');
  assert.ok(r1.text.includes('Nice'));
  assert.equal(a.dem.duPhong, 0);

  const b = gia({ chinhHangLoi: true });
  b.pt.duPhong = async () => { b.dem.duPhong++; return { text: 'Từ [en]think[/en] cắn nhẹ đầu lưỡi.' }; };
  const r2 = await traLoiNhanhLanguage(vao, b.pt);
  assert.equal(r2.duong, 'du-phong');
  assert.equal(r2.text, 'Từ [en]think[/en] cắn nhẹ đầu lưỡi.');
  assert.equal(b.dem.chinhHang, 1);

  const c = gia({ coKey: false });
  c.pt.duPhong = async () => ({ text: 'ok' });
  const r3 = await traLoiNhanhLanguage(vao, c.pt);
  assert.equal(r3.duong, 'du-phong');
  assert.equal(c.dem.chinhHang, 0);
});
