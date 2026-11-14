/**
 * Thi thử CT Language — luật thuần + KIỂM MỌI ĐỀ trong repo. `npx tsx --test src/services/ctlanguage/thiThuan.test.ts`
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { GIONG } from '../ielts/docTo.service.js';
import {
  CAP_THEO_NN, GIONG_THI, SO_CAU_CHUAN, chamCau, chamDe, chuanHoaDapAn, dauTuanVn, deChoApp, duocThi, kiemDe, tatCaCau,
  tomTatDe, xepVinhDanh, type DeThi,
} from './thiThuan.js';

const THU_MUC = path.join(process.cwd(), 'content', 'ctlanguage', 'de-thi');
const docDe = (): DeThi[] => fs.readdirSync(THU_MUC).filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(THU_MUC, f), 'utf8')));

/** Đề mẫu nhỏ — bộ ví dụ này cũng nằm trong test iOS (`ThiThuCTLTests.swift`): hai bên phải ra CÙNG điểm. */
const MAU: DeThi = {
  id: 'mau-de-1', nn: 'zh', kyThi: 'HSK', cap: 'MAU', ten: 'Đề mẫu', moTa: 'Đề mẫu cho test', diemDat: 120, xepHang: true,
  phan: [
    { id: 'nghe', ten: 'Nghe', kyNang: 'nghe', phut: 5, diemToiDa: 100, nhom: [{ huongDan: 'Nghe rồi chọn đáp án đúng.', cau: [
      { id: '1', kieu: 'chon', nghe: [{ g: 'zh-nu', t: '喝茶' }], de: 'Hình: uống trà', luaChon: ['Đúng', 'Sai'], dapAn: 0, giaiThich: '喝茶 = uống trà, khớp mô tả của hình.', tu: ['喝', '茶'] },
      { id: '2', kieu: 'chon', nghe: [{ g: 'zh-nam', t: '我是学生' }], luaChon: ['Giáo viên', 'Học sinh', 'Bác sĩ'], dapAn: 1, giaiThich: '学生 = học sinh. 老师 mới là giáo viên.', tu: ['学生'] },
      { id: '3', kieu: 'chon', nghe: [{ g: 'zh-nu', t: '今天很冷' }], luaChon: ['Nóng', 'Lạnh', 'Mưa'], dapAn: 1, giaiThich: '冷 = lạnh; 热 = nóng — cặp trái nghĩa hay nhầm.', tu: ['冷'] },
    ] }] },
    { id: 'viet', ten: 'Viết', kyNang: 'viet', phut: 5, diemToiDa: 100, nhom: [{ huongDan: 'Sắp xếp câu / điền chữ Hán.', cau: [
      { id: '4', kieu: 'sapXep', manh: ['小船', '河上', '一条', '有'], dapAn: ['河上有一条小船'], giaiThich: 'Câu tồn tại: nơi chốn + 有 + số lượng + danh từ.', tu: ['有'] },
      { id: '5', kieu: 'dien', de: '请把门（guān）___上。', dapAn: ['关'], giaiThich: '关 (guān) = đóng; 把 + tân ngữ + động từ + 上.', tu: ['关'] },
      { id: '6', kieu: 'noi', noiKieu: 'nhacLai', nghe: [{ g: 'zh-nu', t: '我喜欢喝茶' }], mau: '我喜欢喝茶', giaiThich: 'Wǒ xǐhuan hē chá — tôi thích uống trà.', diem: 2 },
    ] }] },
  ],
};

test('mọi giọng thi có trong GIONG của /ielts/doc', () => {
  for (const g of GIONG_THI) assert.ok(g in GIONG, `giọng ${g} không có ở máy chủ đọc to`);
});

test('đề mẫu hợp lệ; các lỗi kinh điển bị bắt', () => {
  assert.deepEqual(kiemDe(MAU), []);
  const hong = structuredClone(MAU);
  hong.phan[0].nhom[0].cau[0].dapAn = 2;                 // ngoài khoảng
  hong.phan[0].nhom[0].cau[1].luaChon = ['A', 'A', 'B']; // trùng ⇒ hai đáp án
  hong.phan[0].nhom[0].cau[2].giaiThich = 'ngắn';         // thiếu giải thích
  delete hong.phan[0].nhom[0].cau[2].nghe;               // câu nghe không có kịch bản
  hong.phan[1].nhom[0].cau[0].dapAn = ['河上有两条小船'];  // không ghép được từ mảnh
  hong.phan[1].nhom[0].cau[1].dapAn = [];
  const loi = kiemDe(hong).join('\n');
  for (const m of ['dapAn phải là chỉ số', 'lựa chọn trùng nhau', 'giaiThich phải', 'phải có kịch bản nghe', 'không ghép được', 'đáp án chấp nhận']) assert.match(loi, new RegExp(m));
  const sai = structuredClone(MAU); sai.cap = 'HSK1';
  assert.match(kiemDe(sai).join('\n'), /phần "nghe" có 3 câu, chuẩn HSK1 là 20/);
  const xao = structuredClone(MAU); xao.phan[1].nhom[0].cau[0].manh = ['河上', '有', '一条', '小船'];
  assert.match(kiemDe(xao).join('\n'), /phải xáo/);
});

test('chấm từng kiểu câu', () => {
  const [c1, , , c4, c5, c6] = tatCaCau(MAU).map((x) => x.cau);
  assert.equal(chamCau(c1, 0), 1);
  assert.equal(chamCau(c1, 1), 0);
  assert.equal(chamCau(c1, null), 0);
  assert.equal(chamCau(c1, '0'), 0, 'chữ "0" không phải lựa chọn 0');
  assert.equal(chamCau(c4, '河上 有一条小船。'), 1, 'bỏ khoảng trắng + dấu câu');
  assert.equal(chamCau(c4, '小船河上有一条'), 0);
  assert.equal(chamCau(c5, ' 关 '), 1);
  assert.equal(chamCau(c5, '开'), 0);
  assert.equal(chamCau(c6, 0.8), 0.8);
  assert.equal(chamCau(c6, 7), 1, 'kẹp về 1');
  assert.equal(chamCau(c6, -1), 0);
  assert.equal(chuanHoaDapAn('Ｆｉｆｔｅｅｎ！'), 'fifteen');
});

test('chấm đề: điểm phần theo hệ số, đạt/chưa đạt, từ cần ôn', () => {
  // Nghe 2/3 ⇒ round(66,67) = 67. Viết: hệ số 1+1+2; đúng câu 4, sai câu 5, nói 0,5 ⇒ (1+0+1)/4 ⇒ 50.
  const kq = chamDe(MAU, { '1': 0, '2': 1, '3': 0, '4': '河上有一条小船', '5': '开', '6': 0.5 });
  assert.deepEqual(kq.phan.map((p) => [p.dung, p.tong, p.diem]), [[2, 3, 67], [1, 3, 50]]);
  assert.equal(kq.diem, 117);
  assert.equal(kq.diemToiDa, 200);
  assert.equal(kq.dat, false);
  assert.deepEqual(kq.sai, ['3', '5', '6']);
  assert.deepEqual(kq.tuCanOn, ['冷', '关']);
  const het = chamDe(MAU, { '1': 0, '2': 1, '3': 1, '4': '河上有一条小船', '5': '关', '6': 1 });
  assert.equal(het.diem, 200);
  assert.equal(het.dat, true);
  assert.equal(chamDe(MAU, {}).diem, 0);
});

test('free không nhận giải thích chi tiết (trừ 2 câu mẫu mỗi phần) nhưng vẫn có đáp án', () => {
  const free = deChoApp(MAU, false);
  assert.equal(free.coGiaiThich, false);
  const cau = tatCaCau(free).map((x) => x.cau);
  assert.deepEqual(cau.map((c) => c.giaiThich !== ''), [true, true, false, true, true, false]);
  assert.ok(cau.every((c) => c.kieu === 'noi' || c.dapAn !== undefined));
  assert.equal(tatCaCau(deChoApp(MAU, true)).every((x) => x.cau.giaiThich.length > 0), true);
  assert.equal(tatCaCau(MAU)[2].cau.giaiThich.length > 0, true, 'không sửa đề gốc');
});

test('giới hạn free: 1 đề/cấp/tuần, làm lại đúng đề thì được; Pro + xếp lớp không giới hạn', () => {
  assert.equal(duocThi({ laPro: false, kyThi: 'HSK', deId: 'hsk1-de-1', deDaThiTuanNay: [] }).duoc, true);
  assert.equal(duocThi({ laPro: false, kyThi: 'HSK', deId: 'hsk1-de-1', deDaThiTuanNay: ['hsk1-de-1'] }).duoc, true);
  assert.deepEqual(duocThi({ laPro: false, kyThi: 'HSK', deId: 'hsk1-de-2', deDaThiTuanNay: ['hsk1-de-1'] }), { duoc: false, conLai: 0 });
  assert.equal(duocThi({ laPro: true, kyThi: 'HSK', deId: 'hsk1-de-2', deDaThiTuanNay: ['hsk1-de-1'] }).duoc, true);
  assert.equal(duocThi({ laPro: false, kyThi: 'XEP-LOP', deId: 'xep-lop-zh', deDaThiTuanNay: ['a', 'b'] }).duoc, true);
});

test('đầu tuần theo giờ Việt Nam (thứ Hai 00:00 +07)', () => {
  // Chủ nhật 15/11/2026 23:30 giờ VN = 16:30Z ⇒ tuần bắt đầu thứ Hai 09/11 00:00 VN = 08/11 17:00Z.
  assert.equal(dauTuanVn(new Date('2026-11-15T16:30:00Z')).toISOString(), '2026-11-08T17:00:00.000Z');
  // Thứ Hai 16/11 00:10 giờ VN = 15/11 17:10Z ⇒ tuần mới.
  assert.equal(dauTuanVn(new Date('2026-11-15T17:10:00Z')).toISOString(), '2026-11-15T17:00:00.000Z');
});

test('vinh danh: mỗi người một dòng tốt nhất; bằng điểm ⇒ nhanh hơn đứng trên', () => {
  const t = (s: string) => new Date(s);
  const b = xepVinhDanh([
    { userId: 1, diem: 150, giay: 900, luc: t('2026-11-10') },
    { userId: 1, diem: 180, giay: 1200, luc: t('2026-11-11') },
    { userId: 2, diem: 180, giay: 1000, luc: t('2026-11-12') },
    { userId: 3, diem: 120, giay: 500, luc: t('2026-11-09') },
  ]);
  assert.deepEqual(b.map((d) => [d.hang, d.userId, d.diem]), [[1, 2, 180], [2, 1, 180], [3, 3, 120]]);
});

test('xếp lớp: dừng ở mức đầu tiên chưa đạt ngưỡng; qua hết ⇒ vượt', () => {
  const xl = docDe().find((d) => d.id === 'xep-lop-zh')!;
  const dung = (soPhanDat: number) => {
    const tl: Record<string, number> = {};
    xl.phan.forEach((p, i) => { if (i < soPhanDat) for (const g of p.nhom) for (const c of g.cau) tl[c.id] = c.dapAn as number; });
    return chamDe(xl, tl).xepLop!;
  };
  assert.equal(dung(0).cap, xl.xepLop!.muc[0].cap);
  assert.equal(dung(2).cap, xl.xepLop!.muc[2].cap);
  assert.equal(dung(2).vuot, false);
  assert.deepEqual([dung(4).cap, dung(4).vuot], [xl.xepLop!.vuot.cap, true]);
});

test('MỌI đề trong repo hợp lệ; đủ đề theo từng cấp; mỗi ngôn ngữ có bài xếp lớp', () => {
  const de = docDe();
  for (const d of de) assert.deepEqual(kiemDe(d), [], `đề ${d.id} có lỗi`);
  assert.equal(new Set(de.map((d) => d.id)).size, de.length);
  for (const [nn, caps] of Object.entries(CAP_THEO_NN)) {
    for (const c of caps) {
      const n = de.filter((d) => d.nn === nn && d.cap === c.cap).length;
      assert.ok(n >= (c.cap === 'HSKK-SO' ? 1 : 2), `${c.cap} mới có ${n} đề`);
      assert.ok(SO_CAU_CHUAN[c.cap], `thiếu chuẩn số câu của ${c.cap}`);
    }
    assert.ok(de.some((d) => d.nn === nn && d.kyThi === 'XEP-LOP'), `thiếu bài xếp lớp ${nn}`);
  }
  // Đáp án trắc nghiệm không dồn một vị trí (đề soạn ẩu hay để toàn A).
  for (const d of de) {
    const cau = tatCaCau(d).map((x) => x.cau).filter((c) => c.kieu === 'chon' && (c.luaChon?.length ?? 0) >= 3);
    if (cau.length < 12) continue;
    const dem = [0, 0, 0, 0];
    for (const c of cau) dem[c.dapAn as number]++;
    assert.ok(Math.max(...dem) / cau.length <= 0.5, `${d.id}: đáp án dồn một vị trí ${dem}`);
  }
  const tt = tomTatDe(de.find((d) => d.id === 'hsk3-de-1')!);
  assert.deepEqual([tt.soCau, tt.diemToiDa, tt.phut], [80, 300, 80]);
});
