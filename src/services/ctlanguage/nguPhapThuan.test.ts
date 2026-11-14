/**
 * Thư viện ngữ pháp CT Language — luật thuần + NỘI DUNG THẬT trong repo. `npx tsx --test src/services/ctlanguage/nguPhapThuan.test.ts`
 * (không CSDL): khuôn mọi điểm, kiểm chéo `soSanh`, đủ số điểm tối thiểu mỗi cấp, tìm kiếm ra đúng điểm, bộ kiểm bắt được lỗi.
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { napNguPhap, _datKhoNguPhap, chiTiet, danhMuc, tim, tongQuan } from './nguPhap.js';
import {
  CAP_NGU_PHAP, NN_NGU_PHAP, SAN_VI_TRI_DAP_AN, bamChuoi, chuanHoaTim, diemKhop, kanaKhop, kiemDiem, kiemPhanBoDapAn, kiemTatCa, timNguPhap, xaoQuizDiem,
  type DiemDaNap, type DiemNguPhap,
} from './nguPhapThuan.js';

const kho = napNguPhap();
_datKhoNguPhap(kho);

const mau = (): DiemNguPhap => ({
  id: 'ja-n5-thu-nghiem', nhom: 'Thể て', tieuDe: '〜てもいいです', mau: 'V-て + も + いいです', nghia: 'được phép làm ~',
  giaiThich: 'Dùng để cho phép hoặc xin phép làm một việc gì đó trong hội thoại hằng ngày.',
  cachGhep: ['V-て + もいいです'],
  viDu: [
    { c: 'ここで写真を撮ってもいいですか。', d: 'ここで しゃしんを とっても いいですか。', v: 'Tôi chụp ảnh ở đây được không?' },
    { c: '窓を開けてもいいです。', d: 'まどを あけても いいです。', v: 'Mở cửa sổ cũng được.' },
    { c: 'ペンで書いてもいいですか。', d: 'ペンで かいても いいですか。', v: 'Viết bằng bút mực được không?' },
  ],
  luuY: ['Chia đúng thể て.'], tuKhoa: ['te mo ii', 'xin phép'],
  quiz: [
    { h: '座って（　）いいですか。', lc: ['も', 'は', 'が'], da: 0, gt: 'Mẫu xin phép: V-て + も + いいですか.' },
    { h: 'Câu nào đúng?', lc: ['食べるもいい', '食べてもいい', '食べたもいい'], da: 1, gt: 'Phải dùng thể て trước もいい.' },
    { h: 'ここで 吸って（　）。', lc: ['もいいます', 'もいくです', 'もいいです'], da: 2, gt: 'いい là tính từ đuôi い + です.' },
  ],
});

test('nội dung thật: không điểm nào bị bỏ, không lỗi kiểm chéo, đủ số điểm tối thiểu mỗi cấp', () => {
  assert.deepEqual(kiemTatCa(kho.ds), []);
  const tq = tongQuan();
  const so = Object.fromEntries(tq.ngonNgu.flatMap((n) => n.cap.map((c) => [c.cap, c.soDiem])));
  // Sàn theo bản giao việc (N5+N4 ~150, N3 phần lớn; HSK1–3 đủ, HSK4 phần lớn; A1–B1 đủ, B2 điểm chính).
  const san: Record<string, number> = {
    N5: 80, N4: 80, N3: 85, N2: 115, N1: 95, HSK1: 40, HSK2: 50, HSK3: 60, HSK4: 55, HSK5: 75, HSK6: 65, A1: 36, A2: 45, B1: 50, B2: 48, C1: 40,
  };
  for (const [cap, n] of Object.entries(san)) assert.ok((so[cap] ?? 0) >= n, `${cap}: ${so[cap]} < ${n}`);
  assert.equal(tq.tong, kho.ds.length);
  for (const d of kho.ds) assert.deepEqual(kiemDiem(d, d.nn, d.cap), [], d.id);
});

test('danh mục: cấp đúng thứ tự, nhóm không bị xé đôi, tổng khớp', () => {
  for (const nn of NN_NGU_PHAP) {
    const dm = danhMuc(nn);
    assert.deepEqual(dm.cap.map((c) => c.cap), [...CAP_NGU_PHAP[nn]]);
    assert.equal(dm.cap.reduce((a, c) => a + c.soDiem, 0), dm.tong);
    for (const c of dm.cap) {
      assert.equal(new Set(c.nhom.map((n) => n.ten)).size, c.nhom.length);
      assert.equal(c.nhom.reduce((a, n) => a + n.diem.length, 0), c.soDiem);
      assert.ok(c.nhom.length <= 18, `${c.cap} có ${c.nhom.length} nhóm`);
    }
  }
  assert.throws(() => danhMuc('vi'), /nn phải là/);
  assert.throws(() => danhMuc(undefined), /nn phải là/);
});

test('chi tiết: so sánh hai chiều, trước / sau, id lạ ⇒ 404', () => {
  const d = chiTiet('ja-n5-te-mo-ii');
  assert.equal(d.cap, 'N5');
  assert.ok(d.viDu.length >= 3 && d.quiz.length === 3);
  assert.ok(d.soSanh.every((s) => s.id && s.tieuDe && s.nghia));
  // Liên kết ngược: điểm B ghi soSanh → A thì mở A cũng thấy B.
  for (const x of kho.ds.slice(0, 200)) for (const s of x.soSanh ?? []) {
    const kia = chiTiet(s);
    if (kia.soSanh.length < 6) assert.ok(kia.soSanh.some((y) => y.id === x.id), `${s} thiếu liên kết ngược về ${x.id}`);
  }
  assert.ok(d.truoc && d.sau);
  assert.throws(() => chiTiet('khong-co'), /Không tìm thấy/);
});

test('tìm kiếm: gõ mẫu / chữ Hán / romaji / tiếng Việt không dấu ra đúng điểm', () => {
  const dau = (q: string, nn?: string) => tim(q, nn).items.map((x) => x.id);
  assert.equal(dau('てもいい', 'ja')[0], 'ja-n5-te-mo-ii');
  assert.equal(dau('〜てもいいです', 'ja')[0], 'ja-n5-te-mo-ii');
  assert.ok(dau('食べてもいいですか', 'ja').includes('ja-n5-te-mo-ii'), 'cả câu chứa mẫu');
  assert.ok(dau('了', 'zh').slice(0, 6).some((x) => x.includes('-le')), '了');
  assert.ok(dau('把', 'zh').slice(0, 3).some((x) => x.includes('-ba-')), '把');
  assert.ok(dau('present perfect', 'en')[0]!.includes('present-perfect'));
  assert.ok(dau('bi dong', 'en').length > 0, 'tiếng Việt không dấu');
  assert.ok(dau('bị động', 'ja').length > 0);
  assert.ok(dau('てもいい').includes('ja-n5-te-mo-ii'), 'không nn ⇒ cả ba ngôn ngữ');
  assert.deepEqual(tim('   ', 'ja').items, []);
  assert.deepEqual(dau('zzzzqqqq', 'ja'), []);
  assert.ok(tim('の', 'ja').items.length <= 20);
  assert.throws(() => tim('a', 'vi'), /nn phải là/);
});

test('luật thuần: chuẩn hoá, kana khớp, điểm khớp', () => {
  assert.equal(chuanHoaTim('〜テ も いい'), 'てもいい');
  assert.equal(chuanHoaTim('Bị động'), 'bidong');
  assert.equal(chuanHoaTim('nǚ péngyou'), 'nupengyou');
  assert.ok(kanaKhop('学校へ行きます。', 'がっこうへ いきます。'));
  assert.ok(!kanaKhop('学校へ行きます。', 'がっこうに いきます。'));
  assert.ok(kanaKhop('コーヒーを飲みます', 'こーひーを のみます'));
  const d = { ...mau(), nn: 'ja' as const, cap: 'N5' };
  assert.equal(diemKhop(d, '〜てもいいです'), 100);
  assert.equal(diemKhop(d, 'te mo ii'), 90);
  assert.ok(diemKhop(d, 'てもいい') >= 70);
  assert.equal(diemKhop(d, 'i'), 0, 'chữ Latin 1 ký tự không khớp bừa');
  assert.equal(diemKhop(d, ''), 0);
  assert.equal(timNguPhap([d], 'xin phep').length, 1);
});

test('bộ kiểm bắt lỗi: đáp án ngoài lựa chọn, pinyin thiếu dấu, cách đọc còn chữ Hán, soSanh trỏ hụt', () => {
  assert.deepEqual(kiemDiem(mau(), 'ja', 'N5'), []);
  const a = mau(); a.quiz[0]!.da = 3;
  assert.ok(kiemDiem(a, 'ja', 'N5').some((l) => l.includes('ngoài lựa chọn')));
  const b = mau(); b.viDu[0]!.d = 'ここで 写真を とっても いいですか。';
  assert.ok(kiemDiem(b, 'ja', 'N5').some((l) => l.includes('còn chữ Hán')));
  const c = mau(); c.viDu[1]!.d = 'まどを しめても いいです。';
  assert.ok(kiemDiem(c, 'ja', 'N5').some((l) => l.includes('không khớp kana')));
  const z = mau(); z.id = 'zh-hsk1-thu-nghiem';
  z.viDu = [{ c: '我是学生。', d: 'Wo shi xuesheng.', v: 'Tôi là học sinh.' }, { c: '他不是老师。', d: 'Tā bú shì lǎoshī.', v: 'Anh ấy không phải giáo viên.' }, { c: '你是谁？', d: 'Ni3 shi4 shei2?', v: 'Bạn là ai?' }];
  const lz = kiemDiem(z, 'zh', 'HSK1');
  assert.ok(lz.some((l) => l.includes('viDu[0]') && l.includes('không có dấu thanh')));
  assert.ok(lz.some((l) => l.includes('viDu[2]')));
  assert.ok(!lz.some((l) => l.includes('viDu[1]')));
  const e = mau(); e.quiz.forEach((q) => { q.da = 0; });
  assert.ok(kiemDiem(e, 'ja', 'N5').some((l) => l.includes('rải đáp án')));
  const f = mau(); f.quiz[1]!.lc = ['a', 'a', 'b'];
  assert.ok(kiemDiem(f, 'ja', 'N5').some((l) => l.includes('trùng')));
  assert.ok(kiemDiem(mau(), 'ja', 'N4').some((l) => l.includes('id phải bắt đầu')));
  const g = { ...mau(), soSanh: ['ja-n5-khong-co'], nn: 'ja' as const, cap: 'N5' };
  assert.ok(kiemTatCa([g]).some((l) => l.includes('không tồn tại')));
  assert.ok(kiemTatCa([g, g]).some((l) => l.includes('trùng')));
});

test('cấp cao (N2 / N1 / HSK5 / HSK6 / C1): có trong danh mục, soSanh dày, tìm ra đúng điểm', () => {
  assert.deepEqual([...CAP_NGU_PHAP.ja], ['N5', 'N4', 'N3', 'N2', 'N1']);
  assert.deepEqual([...CAP_NGU_PHAP.zh], ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']);
  assert.deepEqual([...CAP_NGU_PHAP.en], ['A1', 'A2', 'B1', 'B2', 'C1']);
  for (const cap of ['N2', 'N1', 'HSK5', 'HSK6', 'C1']) {
    const ds = kho.ds.filter((d) => d.cap === cap);
    // Mẫu cấp cao dễ nhầm nhau ⇒ gần như điểm nào cũng phải có "so sánh với".
    const co = ds.filter((d) => (d.soSanh ?? []).length > 0).length;
    assert.ok(co / ds.length >= 0.95, `${cap}: chỉ ${co}/${ds.length} điểm có soSanh`);
    for (const d of ds) assert.ok(d.quiz.every((q) => q.lc.length === 4), `${d.id}: quiz cấp cao phải 4 lựa chọn`);
  }
  const dau = (q: string, nn: string) => tim(q, nn).items.map((x) => x.id);
  assert.equal(dau('ざるを得ない', 'ja')[0], 'ja-n2-zaru-wo-enai');
  assert.equal(dau('や否や', 'ja')[0], 'ja-n1-ya-ina-ya');
  assert.equal(dau('与其', 'zh')[0], 'zh-hsk5-yuqi-buru');
  assert.ok(dau('为所', 'zh').includes('zh-hsk6-wei-suo'));
  assert.ok(dau('no sooner', 'en').includes('en-c1-inversion-no-sooner-hardly'));
  assert.equal(chiTiet('ja-n1-ya-ina-ya').tenCap, 'JLPT N1');
});

test('quiz: xáo bằng máy ổn định + phân bố vị trí đáp án mỗi cấp không lệch', () => {
  // Nội dung trong repo ĐÃ xáo: xáo lại không đổi gì (ai soạn thêm mà quên chạy script thì test này đỏ).
  for (const d of kho.ds) assert.deepEqual(xaoQuizDiem(d).quiz, d.quiz, `${d.id}: chưa chạy scripts/ctlanguage-xao-quiz-ngu-phap.mts`);
  const pb = kiemPhanBoDapAn(kho.ds);
  assert.deepEqual(pb.loi, []);
  for (const cap of ['ja N2', 'ja N1', 'zh HSK5', 'zh HSK6', 'en C1']) {
    const dem = pb.bang[cap]!; const tong = dem.reduce((a, b) => a + b, 0);
    for (const n of dem) assert.ok(n / tong >= SAN_VI_TRI_DAP_AN, `${cap}: ${dem.join('/')}`);
  }
  // Xáo: giữ nguyên tập lựa chọn + đáp án đúng, 3 câu ở 3 vị trí khác nhau, không phụ thuộc thứ tự người soạn viết.
  const d = mau();
  d.quiz = d.quiz.map((q) => ({ ...q, lc: [...q.lc, 'を'].slice(0, 4).length === 4 ? [q.lc[q.da]!, ...q.lc.filter((_, j) => j !== q.da), 'zz'] : q.lc, da: 0 }));
  const x = xaoQuizDiem(d);
  x.quiz.forEach((q, i) => {
    assert.equal(q.lc[q.da], d.quiz[i]!.lc[0]);
    assert.deepEqual([...q.lc].sort(), [...d.quiz[i]!.lc].sort());
  });
  assert.equal(new Set(x.quiz.map((q) => q.da)).size, 3);
  const dao = { ...d, quiz: d.quiz.map((q) => ({ ...q, lc: [...q.lc].reverse(), da: q.lc.length - 1 })) };
  assert.deepEqual(xaoQuizDiem(dao).quiz, x.quiz);
  assert.equal(bamChuoi('ja-n5-te-mo-ii'), bamChuoi('ja-n5-te-mo-ii'));
  // Bộ kiểm phân bố bắt được cấp dồn đáp án về một vị trí.
  const lech: DiemDaNap[] = Array.from({ length: 20 }, (_, i) => ({ ...d, id: `ja-n5-lech-${i}`, nn: 'ja' as const, cap: 'N5', quiz: d.quiz.map((q) => ({ ...q, da: 0 })) }));
  assert.ok(kiemPhanBoDapAn(lech).loi.some((l) => l.includes('lựa chọn 4')));
});
