/**
 * Nhận xét học tập tuần — phần THUẦN: tuần giờ VN, số liệu do mã tính, chọn điểm yếu có bằng chứng, kế hoạch có link
 * thật, prompt, kiểm số bịa trong chữ model, chữ dự phòng, mục lục khoá không lệch manifest frontend.
 *
 *   npx tsx --test src/services/ielts/nhanXetTuan.test.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  buoiKeTiep, buoiTuId, cacSo, chonDiemYeu, congNgay, dungChiMuc, dungPrompt, goiYDiemManh, khungTuan, kiemNhanXet,
  lapKeHoach, nguonDuLieu, nhanXetDuPhong, thuHaiCua, tieuChiNoi, tieuChiViet, tinhSoLieu, tuanCua, tuanDaXongGanNhat,
  tuanHopLe, type DuLieuTho, type MucLuc,
} from './nhanXetTuanThuan.js';

const ML: MucLuc = {
  khoa: {
    sach2: {
      duong: '/language/en/ielts/tap-2', ten: 'IELTS Tập 2', soBuoi: 4,
      buoi: {
        1: { phut: 60, bai: [['t2d1-doc', 'reading', 'Đọc 1', 30], ['t2d1-bai-tap', 'homework', 'Bài tập 1', 30]], quiz: [['t2d1-q1', 'Chia động từ (8 câu)', 't2d1-bai-tap']] },
        2: { phut: 50, bai: [['t2d2-doc', 'reading', 'Đọc 2', 25], ['t2d2-noi', 'speaking', 'Nói 2', 25]], quiz: [['t2d2-q1', 'TFNG (6 câu)', 't2d2-doc']] },
        3: { phut: 40, bai: [['t2d3-doc', 'reading', 'Đọc 3', 40]], quiz: [] },
        4: { phut: 40, bai: [['t2d4-doc', 'reading', 'Đọc 4', 40]], quiz: [] },
      },
    },
    giaotiep1: {
      duong: '/language/en/giao-tiep', ten: 'Tiếng Anh giao tiếp', soBuoi: 2,
      buoi: { 1: { phut: 30, bai: [['gtd1-nghe', 'listening', 'Nghe 1', 30]], quiz: [] }, 2: { phut: 30, bai: [['gtd2-nghe', 'listening', 'Nghe 2', 30]], quiz: [] } },
    },
  },
};

// Tuần 16/11/2026 (thứ Hai) → 22/11; "bây giờ" = thứ Ba 24/11 ⇒ tuần đã khép.
const TUAN = '2026-11-16';
const BG = new Date('2026-11-24T03:00:00Z');
const luc = (ngay: string, gio = 3) => new Date(`${ngay}T${String(gio).padStart(2, '0')}:00:00Z`);

function rong(): DuLieuTho {
  return {
    tuan: TUAN, bayGio: BG, tienDo: [], ngayHocKhoa: [], theIelts: { tong: 0, daThuoc: 0 }, onIelts: [], luotThi: [], soLoi: [],
    ctlNgay: [], theCtl: [], ctlThi: [], xepLop: null, loTrinhTu: null,
  };
}

function day(): DuLieuTho {
  const d = rong();
  d.tienDo = [
    { stage: 'sach2', kind: 'bai', muc: 't2d1-doc', xong: true, diem: null, createdAt: luc('2026-11-16'), updatedAt: luc('2026-11-16') },
    { stage: 'sach2', kind: 'bai', muc: 't2d1-bai-tap', xong: true, diem: null, createdAt: luc('2026-11-17'), updatedAt: luc('2026-11-17') },
    { stage: 'sach2', kind: 'bai', muc: 't2d2-doc', xong: true, diem: null, createdAt: luc('2026-11-18'), updatedAt: luc('2026-11-18') },
    // tuần trước: 1 bài
    { stage: 'sach2', kind: 'bai', muc: 't2d0-x', xong: true, diem: null, createdAt: luc('2026-11-10'), updatedAt: luc('2026-11-10') },
    { stage: 'sach2', kind: 'baitap', muc: 't2d1-q1', xong: true, diem: 55, createdAt: luc('2026-11-17'), updatedAt: luc('2026-11-17') },
    { stage: 'sach2', kind: 'baitap', muc: 't2d2-q1', xong: true, diem: 90, createdAt: luc('2026-11-18'), updatedAt: luc('2026-11-18') },
  ];
  d.ngayHocKhoa = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-20', '2026-11-12'];
  d.onIelts = [
    ...Array.from({ length: 20 }, (_, i) => ({ ngay: '2026-11-19', diem: i < 8 ? 1 : 3, moi: i < 10 })),
    { ngay: '2026-11-11', diem: 3, moi: true },
  ];
  d.theIelts = { tong: 120, daThuoc: 30 };
  d.luotThi = [
    { kyNang: 'doc', cheDo: 'full', dung: 26, tong: 40, band: 6, giay: 3600, createdAt: luc('2026-11-21') },
    { kyNang: 'nghe', cheDo: 'full', dung: 30, tong: 40, band: 7, giay: 1800, createdAt: luc('2026-11-21', 5) },
    { kyNang: 'viet', cheDo: 'full', dung: null, tong: null, band: 6, giay: 2400, createdAt: luc('2026-11-20'), tieuChi: { TR: 6, CC: 6.5, LR: 6, GRA: 5 } },
    { kyNang: 'doc', cheDo: 'full', dung: 22, tong: 40, band: 5.5, giay: 3600, createdAt: luc('2026-11-12') },
  ];
  d.soLoi = [
    ...Array.from({ length: 4 }, (_, i) => ({ kyNang: 'doc', dang: 'TFNG', lyDo: 'ng-false', lanSai: i === 0 ? 3 : 1, daXong: false, hanOn: luc('2026-11-23'), createdAt: luc('2026-11-21'), updatedAt: luc('2026-11-21'), lanOnCuoi: null })),
    { kyNang: 'nghe', dang: 'Gap-fill', lyDo: 'chinh-ta', lanSai: 1, daXong: false, hanOn: luc('2026-11-30'), createdAt: luc('2026-11-21'), updatedAt: luc('2026-11-21'), lanOnCuoi: null },
  ];
  d.ctlNgay = [{ ngay: '2026-11-22', giay: 900, theOn: 30, goi: 0, thi: 0 }];
  d.theCtl = [
    { chu: 'Abandon', themLuc: luc('2026-11-22'), khoangNgay: 1, lanOnCuoi: null, denHan: luc('2026-11-23'), trongSoHtv: true },
    { chu: 'ability', themLuc: luc('2026-10-01'), khoangNgay: 30, lanOnCuoi: luc('2026-11-22'), denHan: luc('2026-12-20'), trongSoHtv: true },
  ];
  d.loTrinhTu = [
    { id: 'en-ngay-1', ten: 'Ngày 1 · Cốt lõi', k: ['abandon', 'ability'] },
    { id: 'en-ngay-2', ten: 'Ngày 2 · Cốt lõi', k: ['able', 'about'] },
  ];
  return d;
}

test('tuần giờ VN: thứ Hai, khung, tuần đã khép gần nhất', () => {
  assert.equal(thuHaiCua('2026-11-22'), '2026-11-16'); // CN thuộc tuần bắt đầu thứ Hai trước
  assert.equal(thuHaiCua('2026-11-16'), '2026-11-16');
  // 23/11 00:30 giờ VN = 22/11 17:30 UTC ⇒ đã sang tuần mới
  assert.equal(tuanCua(new Date('2026-11-22T17:30:00Z')), '2026-11-23');
  assert.equal(tuanDaXongGanNhat(BG), '2026-11-16');
  const k = khungTuan(TUAN);
  assert.equal(k.tuLuc.toISOString(), '2026-11-15T17:00:00.000Z');
  assert.equal(k.denLuc.toISOString(), '2026-11-22T17:00:00.000Z');
  assert.ok(tuanHopLe('2026-11-16'));
  assert.ok(!tuanHopLe('2026-11-17'));
  assert.ok(!tuanHopLe('16/11/2026'));
  assert.equal(congNgay('2026-11-30', 1), '2026-12-01');
});

test('id bài ⇒ số buổi; buổi kế tiếp theo mục lục', () => {
  assert.equal(buoiTuId('d3-doc'), 3);
  assert.equal(buoiTuId('t2d14-bai-tap'), 14);
  assert.equal(buoiTuId('gtd7-nghe'), 7);
  assert.equal(buoiTuId('tra-cuu'), null);
  assert.equal(buoiKeTiep(ML.khoa.sach2!, new Set(['t2d1-doc', 't2d1-bai-tap'])), 2);
  assert.equal(buoiKeTiep(ML.khoa.sach2!, new Set(['t2d1-doc'])), 1);
  // buổi không có trong mục lục (Tập 1 Ngày 1) ⇒ coi là xong nếu có bài nào của buổi đó xong
  const k = { ...ML.khoa.sach2!, buoi: { ...ML.khoa.sach2!.buoi } };
  delete (k.buoi as Record<string, unknown>)['1'];
  assert.equal(buoiKeTiep(k, new Set()), 1);
  assert.equal(buoiKeTiep(k, new Set(['t2d1-gi-do'])), 2);
});

test('đọc chiTiet thi máy: tiêu chí Writing (TA gộp TR) + Speaking + Azure theo số từ', () => {
  const v = tieuChiViet({ ai: { 1: { tieuChi: [{ ma: 'TA', band: 6 }, { ma: 'GRA', band: 5 }] }, 2: { tieuChi: [{ ma: 'TR', band: 7 }, { ma: 'GRA', band: 6 }] } } });
  assert.deepEqual(v, { TR: 6.5, GRA: 5.5 });
  assert.equal(tieuChiViet({ bai: {} }), null);
  const n = tieuChiNoi({ tieuChi: { fc: 6, lr: 6.5, gra: 5.5, p: 6 }, banGhi: [{ phatAm: { tong: 80, soTu: 30 } }, { phatAm: { tong: 60, soTu: 10 } }, { phatAm: null }] });
  assert.deepEqual(n.tieuChi, { fc: 6, lr: 6.5, gra: 5.5, p: 6 });
  assert.equal(n.azure, 75);
});

test('số liệu tuần do MÃ tính: ngày học, phút, bài xong, bài tập, thẻ, thi, sổ lỗi, lộ trình từ', () => {
  const s = tinhSoLieu(day(), ML);
  assert.equal(s.dangDo, false);
  assert.equal(s.trong, false);
  assert.equal(s.soNgayTinh, 7);
  // 16,17,18 (bài) · 19 (thẻ) · 20 (hoc_ngay + viết) · 21 (thi) · 22 (app CTL + thẻ CTL) = 7 ngày
  assert.equal(s.ngayHoc.so, 7);
  assert.equal(s.ngayHoc.truoc, 3); // 10 (bài) · 11 (thẻ) · 12 (hoc_ngay + thi)
  const k2 = s.khoa.find((k) => k.stage === 'sach2')!;
  assert.equal(k2.baiXong, 3);
  assert.equal(k2.baiXongTruoc, 1);
  assert.equal(k2.daXongTong, 3);
  assert.equal(k2.tongBai, 6);
  assert.equal(k2.tiLe, 50);
  assert.equal(k2.buoiKeTiep, 2);
  assert.equal(k2.baiTap.so, 2);
  assert.equal(k2.baiTap.tb, 73);
  assert.deepEqual(k2.baiTap.thap.map((t) => [t.ten, t.diem, t.buoi, t.lessonId]), [['Chia động từ (8 câu)', 55, 1, 't2d1-bai-tap']]);
  // phút: bài 30+30+25 = 85 · thi 60+30+40 = 130 · app 15 · thẻ 20 × 0,2 = 4
  assert.deepEqual(s.phut, { tong: 234, baiHoc: 85, thiMay: 130, appCTL: 15, onThe: 4, truoc: 25 + 60 + 0 });
  assert.equal(s.theoNgay.length, 7);
  assert.equal(s.theoNgay.reduce((a, x) => a + x.phut, 0), 234);
  assert.equal(s.tuVung.ielts.moi, 10);
  assert.equal(s.tuVung.ielts.luotOn, 20);
  assert.equal(s.tuVung.ielts.tiLeNho, 60);
  assert.equal(s.tuVung.ielts.quen, 8);
  assert.equal(s.tuVung.ctl.moi, 1);
  assert.equal(s.tuVung.ctl.nhoSau, 1);
  assert.deepEqual(s.tuVung.loTrinh, { ngayKeTiep: { id: 'en-ngay-2', ten: 'Ngày 2 · Cốt lõi' }, ngayDaXong: 1, tongNgay: 2 });
  assert.equal(s.thi.soLuot, 3);
  assert.equal(s.thi.soLuotTruoc, 1);
  assert.deepEqual(s.thi.kyNang.doc, { so: 1, bandTb: 6, bandTruoc: 5.5, dungTb: 65 });
  assert.deepEqual(s.thi.tieuChiViet, { TR: 6, CC: 6.5, LR: 6, GRA: 5 });
  assert.equal(s.soLoi.moi, 5);
  assert.deepEqual(s.soLoi.theoDang[0], { dang: 'TFNG', ky: 'doc', so: 4, lanSai: 6 });
  assert.deepEqual(s.soLoi.theoLyDo[0], { lyDo: 'ng-false', so: 4, ngoaiDangDau: 0 });
  assert.equal(s.soLoi.denHan, 4);
});

test('tuần đang dở: chỉ tính tới hôm nay, không nhận "học chưa đều" khi mới qua 2 ngày', () => {
  const d = rong();
  d.tuan = '2026-11-23';
  d.ngayHocKhoa = ['2026-11-23'];
  const s = tinhSoLieu(d, ML);
  assert.equal(s.dangDo, true);
  assert.equal(s.soNgayTinh, 2);
  assert.equal(s.ngayHoc.so, 1);
  assert.ok(!chonDiemYeu(s).some((y) => y.ma === 'deu-dan'));
});

test('3 điểm yếu có bằng chứng số liệu, nặng nhất trước, mỗi loại một mục', () => {
  const s = tinhSoLieu(day(), ML);
  const yeu = chonDiemYeu(s);
  assert.equal(yeu.length, 3);
  // GRA 5 lệch ~1,2 band so với 3 tiêu chí còn lại (90) > TFNG 4 câu (70) = Reading thấp hơn Listening 1 band (70; khai sau)
  // > bài tập 55% (55, rơi khỏi top 3).
  assert.deepEqual(yeu.map((y) => y.ma), ['tieu-chi-viet', 'dang-cau', 'ky-nang']);
  assert.match(yeu[0]!.bangChung, /^GRA trung bình 5 qua 1 bài Writing, thấp nhất trong 4 tiêu chí \(band Writing 6\)\./);
  assert.match(yeu[1]!.bangChung, /4 câu sai dạng "TFNG".*6 lần sai/);
  assert.match(yeu[2]!.bangChung, /^Reading band 6, thấp hơn Listening \(7\) 1 band\./);
  assert.equal(yeu[1]!.lienKet.href, '/language/en/ielts/so-loi');
  // bỏ thi Writing ⇒ bài tập 55% vào top 3, link thẳng tới bài chứa bài tập đó
  const d2 = day(); d2.luotThi = d2.luotThi.filter((l) => l.kyNang !== 'viet');
  const y2 = chonDiemYeu(tinhSoLieu(d2, ML));
  assert.deepEqual(y2.map((y) => y.ma), ['dang-cau', 'ky-nang', 'bai-tap']);
  assert.equal(y2[2]!.lienKet.href, '/language/en/ielts/tap-2?bai=t2d1-bai-tap');
  assert.match(y2[2]!.bangChung, /"Chia động từ \(8 câu\)" \(IELTS Tập 2, Ngày 1\) đạt 55%/);
  assert.ok(yeu.every((y) => /\d/.test(y.bangChung)), 'mỗi điểm yếu phải có số');
  const manh = goiYDiemManh(s);
  assert.ok(manh.some((m) => m.includes('Reading lên band 6 (tuần trước 5.5)')));
  assert.ok(manh.some((m) => m.startsWith('Học đều 7/7 ngày')));
});

test('kế hoạch tuần sau: 7 ngày của tuần kế, link thẳng tới buổi kế tiếp + điểm yếu + từ vựng', () => {
  const s = tinhSoLieu(day(), ML);
  const yeu = chonDiemYeu(s);
  const kh = lapKeHoach(s, yeu, ML);
  assert.deepEqual(kh.map((d) => d.thu), ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']);
  assert.equal(kh[0]!.ngay, '2026-11-23');
  const href = kh.flatMap((d) => d.viec.map((v) => v.href));
  // nhịp 7/7 ngày ⇒ 4 buổi mới, nhưng Tập 2 (mẫu) chỉ còn buổi 2..4
  assert.ok(href.includes('/language/en/ielts/tap-2?buoi=2'));
  assert.ok(href.includes('/language/en/ielts/tap-2?buoi=4'));
  assert.ok(!href.includes('/language/en/ielts/tap-2?buoi=5'));
  assert.ok(href.includes('/language/en/hoc-tu-vung?bai=en-ngay-2'));
  assert.ok(href.includes('/language/en/ielts/so-loi'));
  assert.ok(href.includes('/language/en/ielts/thi-may'));
  assert.ok(kh[6]!.viec.some((v) => v.href === '/language/en/nhan-xet-tuan'));
  assert.ok(kh.every((d) => d.viec.every((v) => v.href.startsWith('/language/en/') && v.phut > 0)));
});

test('không có dữ liệu: nói thẳng, không điểm yếu, kế hoạch bắt đầu (test đầu vào + Ngày 1)', () => {
  const s = tinhSoLieu(rong(), ML);
  assert.equal(s.trong, true);
  assert.deepEqual(chonDiemYeu(s), []);
  const kh = lapKeHoach(s, [], ML);
  const href = kh.flatMap((d) => d.viec.map((v) => v.href));
  assert.ok(href.includes('/language/en/ielts/thi-may'));
  assert.ok(href.includes('/language/en/ielts/tap-2?buoi=1')); // mẫu không có sach1 ⇒ khoá IELTS đầu tiên có
  assert.ok(href.includes('/language/en/giao-tiep?buoi=1'));
  const nx = nhanXetDuPhong(s, [], []);
  assert.match(nx.tongQuan, /chưa có hoạt động học/);
  assert.ok(nguonDuLieu(rong(), s).every((n) => !n.co));
  // xếp lớp ⇒ bắt đầu đúng buổi được xếp
  const d = rong(); d.xepLop = { tap: 2, ngay: 3, overall: 4.5 };
  const kh2 = lapKeHoach(tinhSoLieu(d, ML), [], ML);
  assert.ok(kh2.flatMap((x) => x.viec.map((v) => v.href)).includes('/language/en/ielts/tap-2?buoi=3'));
});

test('prompt mang đủ số liệu + điểm yếu + kế hoạch; model bịa số ⇒ thay bằng chữ dự phòng', () => {
  const s = tinhSoLieu(day(), ML);
  const yeu = chonDiemYeu(s);
  const manh = goiYDiemManh(s);
  const kh = lapKeHoach(s, yeu, ML);
  const p = dungPrompt(s, yeu, manh, kh);
  assert.match(p.system, /KHÔNG tự tính/);
  const vao = JSON.parse(p.user);
  assert.deepEqual(vao.diemYeu.map((y: { ma: string }) => y.ma), ['tieu-chi-viet', 'dang-cau', 'ky-nang']);
  assert.equal(vao.soLieu.ngayHoc.so, 7);
  const dp = nhanXetDuPhong(s, yeu, manh);
  const tot = {
    tongQuan: 'Tuần này bạn học 7/7 ngày, khoảng 234 phút, xong 3 bài IELTS Tập 2.',
    diemManh: ['Reading lên band 6 so với 5.5 tuần trước.'],
    diemYeu: [
      { ma: 'tieu-chi-viet', nhanXet: 'GRA 5 kéo band Writing 6 xuống.', cachSua: 'Viết lại một đoạn với câu phức.' },
      { ma: 'dang-cau', nhanXet: '4 câu TFNG sai, 6 lần sai.', cachSua: 'Gạch từ khoá câu hỏi rồi tìm đồng nghĩa.' },
      { ma: 'ky-nang', nhanXet: 'Reading 6 so với Listening 7.', cachSua: 'Luyện skimming 2 buổi.' },
    ],
    keHoachGhiChu: { T2: 'Vào Ngày 2 khi còn nhớ Ngày 1.', XX: 'bỏ' },
    loiNhan: 'Tuần sau giữ nhịp.',
  };
  const ok = kiemNhanXet(tot, dp, p.user);
  assert.equal(ok.soBiThay, 0);
  assert.equal(ok.nhanXet.tongQuan, tot.tongQuan);
  assert.deepEqual(Object.keys(ok.nhanXet.keHoachGhiChu), ['T2']);
  const bia = kiemNhanXet({ ...tot, tongQuan: 'Bạn học 6 ngày, 987 phút, band dự kiến 7.25.', diemYeu: [tot.diemYeu[0], { ma: 'la', nhanXet: 'x', cachSua: 'y' }] }, dp, p.user);
  assert.equal(bia.nhanXet.tongQuan, dp.tongQuan, 'số 987 / 7.25 không có trong dữ liệu ⇒ dùng chữ dự phòng');
  assert.equal(bia.nhanXet.diemYeu.length, 3);
  assert.equal(bia.nhanXet.diemYeu[1]!.nhanXet, dp.diemYeu[1]!.nhanXet, 'thiếu điểm yếu ⇒ dự phòng');
  assert.ok(bia.soBiThay >= 3);
  // rác ⇒ toàn bộ dự phòng
  assert.deepEqual(kiemNhanXet('không phải JSON', dp, p.user).nhanXet.diemYeu, dp.diemYeu);
  assert.deepEqual(cacSo('band 6,5 và 72% sau 3 ngày'), ['6.5', '72', '3']);
});

test('mục lục khoá (content/ielts/muc-luc-khoa.json) không lệch manifest frontend', async (t) => {
  let dungMucLuc: (() => Promise<unknown>) | null = null;
  try {
    // Đường dẫn qua biến: script nằm ngoài rootDir `src/` của tsc — chỉ tsx nạp nó lúc chạy test.
    const tep = '../../../scripts/ielts-muc-luc-khoa.mts';
    ({ dungMucLuc } = (await import(tep)) as { dungMucLuc: () => Promise<unknown> });
  } catch {
    t.skip('không có frontend/ (image backend) — bỏ qua');
    return;
  }
  const tep = readFileSync(join(process.cwd(), 'content/ielts/muc-luc-khoa.json'), 'utf8');
  assert.equal(tep, `${JSON.stringify(await dungMucLuc!())}\n`, 'chạy lại: npx tsx scripts/ielts-muc-luc-khoa.mts');
  const ml = JSON.parse(tep) as MucLuc;
  assert.deepEqual(Object.keys(ml.khoa), ['sach1', 'sach2', 'sach3', 'sach4', 'sach5', 'giaotiep1']);
  assert.equal(ml.khoa.sach1!.soBuoi, 15);
  assert.equal(ml.khoa.giaotiep1!.soBuoi, 30);
  const cm = dungChiMuc(ml);
  assert.ok(cm.bai.size > 500 && cm.quiz.size > 1000);
});
