/**
 * Bộ kiểm luật đối kháng — chạy: npx tsx --test src/services/doiKhang/luat/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LUAT, coVua, tuFen, perftCoVua, coTuong, tienLen, caro, nhanBo, chanDuoc, taoNgauNhien,
} from './index.js';
import type { CapDoBot, LuatTro, MaTro, TrangThaiCoTuong, TrangThaiTienLen, NuocCoVua, QuanCoTuong } from './index.js';

// ─── Cờ vua ──────────────────────────────────────────────────────────────────
test('cờ vua: perft vị trí đầu 20 / 400 / 8902', () => {
  const s = coVua.khoiTao(2, 1);
  assert.equal(perftCoVua(s, 1), 20);
  assert.equal(perftCoVua(s, 2), 400);
  assert.equal(perftCoVua(s, 3), 8902);
});

test('cờ vua: perft Kiwipete 48 / 2039', () => {
  const s = tuFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -');
  assert.equal(perftCoVua(s, 1), 48);
  assert.equal(perftCoVua(s, 2), 2039);
});

test('cờ vua: perft qua API công khai (cacNuoc + apDung) = 400 ở độ sâu 2', () => {
  const s = coVua.khoiTao(2, 1);
  let n = 0;
  for (const m of coVua.cacNuoc(s)) n += coVua.cacNuoc(coVua.apDung(s, 0, m)).length;
  assert.equal(n, 400);
});

function diCoVua(s: ReturnType<typeof coVua.khoiTao>, ds: [string, string][]) {
  for (const [tu, den] of ds) {
    const ghe = coVua.luot(s);
    const m: NuocCoVua = { tu, den };
    assert.equal(coVua.kiemTra(s, ghe, m), null, `${tu}-${den}`);
    s = coVua.apDung(s, ghe, m);
  }
  return s;
}

test('cờ vua: chiếu hết học trò', () => {
  const s = diCoVua(coVua.khoiTao(2, 1), [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6']]);
  assert.equal(coVua.moTa(s, { tu: 'h5', den: 'f7' }), 'Qh5×f7#');
  const cuoi = diCoVua(s, [['h5', 'f7']]);
  assert.deepEqual(coVua.ketThuc(cuoi), { thang: [0], hoa: false, lyDo: 'chieu-het' });
  assert.equal(coVua.cacNuoc(cuoi).length, 0);
  assert.equal(coVua.kiemTra(cuoi, 1, { tu: 'e8', den: 'e7' }), 'Ván đã kết thúc');
});

test('cờ vua: hết nước = hoà; thiếu quân = hoà; phong cấp phải chọn quân', () => {
  assert.deepEqual(coVua.ketThuc(tuFen('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')), { thang: [], hoa: true, lyDo: 'het-nuoc' });
  assert.equal(coVua.ketThuc(tuFen('7k/8/6K1/8/8/8/8/2B5 b - - 0 1'))?.lyDo, 'thieu-quan');
  const p = tuFen('8/4P3/8/8/8/8/k7/4K3 w - - 0 1');
  assert.equal(coVua.kiemTra(p, 0, { tu: 'e7', den: 'e8' }), 'Hãy chọn quân phong cấp');
  assert.equal(coVua.kiemTra(p, 0, { tu: 'e7', den: 'e8', phong: 'n' }), null);
  assert.equal(coVua.apDung(p, 0, { tu: 'e7', den: 'e8', phong: 'n' }).ban[60], 'N');
});

test('cờ vua: nhập thành, bắt tốt qua đường, lặp 3 lần', () => {
  const nt = tuFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const s1 = coVua.apDung(nt, 0, { tu: 'e1', den: 'g1' });
  assert.equal(s1.ban[5], 'R');
  assert.equal(s1.nhapThanh, 'kq');
  const ep = diCoVua(tuFen('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1'), [['d7', 'd5']]);
  assert.equal(ep.enPassant, 'd6');
  const sau = coVua.apDung(ep, 0, { tu: 'e5', den: 'd6' });
  assert.equal(sau.ban[4 * 8 + 3], null); // tốt d5 đã bị bắt
  const lap = diCoVua(coVua.khoiTao(2, 1), [
    ['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8'],
    ['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8'],
  ]);
  assert.equal(coVua.ketThuc(lap)?.lyDo, 'lap-3');
});

// ─── Cờ tướng ────────────────────────────────────────────────────────────────
function banTrong(ds: [number, number, QuanCoTuong][], luotGhe: 0 | 1 = 0): TrangThaiCoTuong {
  const ban: (QuanCoTuong | null)[] = new Array(90).fill(null);
  for (const [c, r, q] of ds) ban[r * 9 + c] = q;
  return { ban, luotGhe, nuaNuoc: 0, soNuoc: 0, lichSu: ['x'], nuocCuoi: null };
}
const coNuoc = (s: TrangThaiCoTuong, tu: [number, number], den: [number, number]) =>
  coTuong.cacNuoc(s).some((m) => m.tu[0] === tu[0] && m.tu[1] === tu[1] && m.den[0] === den[0] && m.den[1] === den[1]);

test('cờ tướng: đầu ván có đúng 44 nước; ký pháp Việt', () => {
  const s = coTuong.khoiTao(2, 1);
  assert.equal(coTuong.cacNuoc(s).length, 44);
  assert.equal(coTuong.luot(s), 0);
  assert.equal(coTuong.moTa(s, { tu: [7, 2], den: [4, 2] }), 'Pháo 2 bình 5');
  assert.equal(coTuong.moTa(s, { tu: [1, 0], den: [2, 2] }), 'Mã 8 tấn 7');
  const s2 = coTuong.apDung(s, 0, { tu: [7, 2], den: [4, 2] });
  assert.equal(coTuong.moTa(s2, { tu: [7, 9], den: [6, 7] }), 'Mã 8 tấn 7');
});

test('cờ tướng: mã bị cản chân', () => {
  const tuDo = banTrong([[4, 0, 'K'], [3, 9, 'k'], [4, 4, 'N']]);
  assert.ok(coNuoc(tuDo, [4, 4], [5, 6]));
  assert.ok(coNuoc(tuDo, [4, 4], [3, 6]));
  const camChan = banTrong([[4, 0, 'K'], [3, 9, 'k'], [4, 4, 'N'], [4, 5, 'p']]);
  assert.ok(!coNuoc(camChan, [4, 4], [5, 6]));
  assert.ok(!coNuoc(camChan, [4, 4], [3, 6]));
  assert.equal(coTuong.kiemTra(camChan, 0, { tu: [4, 4], den: [5, 6] }), 'Quân này không đi được như vậy');
  assert.ok(coNuoc(camChan, [4, 4], [6, 5]));
});

test('cờ tướng: pháo ăn cách đúng một quân', () => {
  const s = coTuong.khoiTao(2, 1);
  assert.ok(coNuoc(s, [1, 2], [1, 9]), 'pháo ăn mã qua ngòi pháo đen');
  assert.ok(!coNuoc(s, [1, 2], [1, 7]), 'pháo không ăn trực tiếp');
  const s2 = coTuong.apDung(s, 0, { tu: [1, 2], den: [1, 9] });
  assert.equal(s2.ban[9 * 9 + 1], 'C');
  assert.equal(s2.nuaNuoc, 0);
});

test('cờ tướng: tướng không được đối mặt; không được tự để bị chiếu', () => {
  const s = banTrong([[3, 0, 'K'], [4, 9, 'k'], [0, 3, 'P']]);
  assert.ok(!coNuoc(s, [3, 0], [4, 0]));
  assert.match(coTuong.kiemTra(s, 0, { tu: [3, 0], den: [4, 0] }) ?? '', /tướng/);
  const ghim = banTrong([[4, 0, 'K'], [4, 9, 'k'], [4, 5, 'R']]);
  assert.ok(!coNuoc(ghim, [4, 5], [0, 5]), 'xe đứng giữa hai tướng không được bỏ cột');
  assert.ok(coNuoc(ghim, [4, 5], [4, 8]));
  // Hết nước = thua (bí).
  const bi = banTrong([[3, 9, 'k'], [4, 0, 'K'], [3, 1, 'R'], [5, 1, 'R']], 1);
  // tướng đen (3,9): (4,9) bị tướng đỏ đối mặt, (3,8) bị xe (3,1) — chiếu hết
  assert.deepEqual(coTuong.ketThuc(bi), { thang: [0], hoa: false, lyDo: 'chieu-het' });
});

// ─── Tiến lên ────────────────────────────────────────────────────────────────
test('tiến lên: nhận đúng từng loại bộ', () => {
  assert.equal(nhanBo(['3S'])?.loai, 'rac');
  assert.equal(nhanBo(['5S', '5H'])?.loai, 'doi');
  assert.equal(nhanBo(['5S', '5H', '5D'])?.loai, 'ba');
  assert.equal(nhanBo(['5S', '5H', '5D', '5C'])?.loai, 'tu-quy');
  assert.equal(nhanBo(['3S', '5H', '4D'])?.loai, 'sanh');
  assert.equal(nhanBo(['TS', 'JS', 'QD', 'KC', 'AH'])?.loai, 'sanh');
  assert.equal(nhanBo(['KS', 'AS', '2S']), null, 'sảnh không chứa 2');
  assert.equal(nhanBo(['3S', '3H', '4S', '4H', '5S', '5H'])?.loai, 'doi-thong');
  assert.equal(nhanBo(['3S', '3H', '4S', '4H']), null, 'đôi thông phải ≥ 3 đôi');
  assert.equal(nhanBo(['3S', '4S']), null);
  assert.equal(nhanBo(['3S', '3H', '3D', '3C', '4S']), null);
  assert.equal(nhanBo([]), null);
});

test('tiến lên: chặn đúng + chặt heo', () => {
  const b = (ls: string[]) => nhanBo(ls)!;
  assert.ok(chanDuoc(b(['5S', '5H']), b(['5C', '5D'])), 'đôi 5 cơ lớn hơn đôi 5 rô');
  assert.ok(!chanDuoc(b(['5C', '5D']), b(['5S', '5H'])));
  assert.ok(chanDuoc(b(['4S', '5S', '6S']), b(['3H', '4H', '5H'])));
  assert.ok(!chanDuoc(b(['4S', '5S', '6S', '7S']), b(['3H', '4H', '5H'])), 'khác độ dài');
  assert.ok(chanDuoc(b(['2H']), b(['2D'])));
  assert.ok(!chanDuoc(b(['AH']), b(['2S'])));
  const baDoiThong = b(['3S', '3H', '4S', '4H', '5S', '5H']);
  const bonDoiThong = b(['6S', '6H', '7S', '7H', '8S', '8H', '9S', '9H']);
  const tuQuy = b(['7S', '7H', '7D', '7C']);
  const heo = b(['2S']);
  const doiHeo = b(['2S', '2C']);
  assert.ok(chanDuoc(baDoiThong, heo));
  assert.ok(!chanDuoc(baDoiThong, doiHeo));
  assert.ok(chanDuoc(tuQuy, heo));
  assert.ok(chanDuoc(tuQuy, doiHeo));
  assert.ok(chanDuoc(tuQuy, baDoiThong));
  assert.ok(!chanDuoc(tuQuy, bonDoiThong));
  assert.ok(chanDuoc(bonDoiThong, tuQuy));
  assert.ok(chanDuoc(bonDoiThong, doiHeo));
  assert.ok(chanDuoc(bonDoiThong, baDoiThong));
  assert.ok(!chanDuoc(tuQuy, b(['3S'])), 'tứ quý không chặt rác thường');
});

function vanTienLen(bai: string[][], luotGhe = 0): TrangThaiTienLen {
  const s = tienLen.khoiTao(bai.length, 1);
  return { ...s, bai, luotGhe, laDau: 'xx', nguoiDiTruoc: null, soNuoc: 1 };
}

test('tiến lên: 3♠ đi trước, nước đầu phải chứa 3♠; nguoiDiTruoc cho ván sau', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = tienLen.khoiTao(4, seed);
    const ghe = tienLen.luot(s);
    assert.ok(s.bai[ghe].includes('3S'));
    assert.equal(s.laDau, '3S');
    assert.ok(s.bai.every((x) => x.length === 13));
    const khac = s.bai[ghe].find((x) => x !== '3S')!;
    assert.match(tienLen.kiemTra(s, ghe, { loai: 'danh', la: [khac] }) ?? '', /3♠/);
    assert.equal(tienLen.kiemTra(s, ghe, { loai: 'danh', la: ['3S'] }), null);
    assert.ok(tienLen.cacNuoc(s).every((m) => m.loai === 'danh' && m.la.includes('3S')));
    assert.notEqual(tienLen.kiemTra(s, ghe, { loai: 'bo' }), null, 'đi tự do không được bỏ');
  }
  const s = { ...tienLen.khoiTao(4, 7), nguoiDiTruoc: 2 };
  assert.equal(tienLen.luot(s), 2);
  const la = s.bai[2][s.bai[2].length - 1];
  assert.equal(tienLen.kiemTra(s, 2, { loai: 'danh', la: [la] }), null);
  // Cùng seed ⇒ cùng ván bài.
  assert.deepEqual(tienLen.khoiTao(3, 42).bai, tienLen.khoiTao(3, 42).bai);
  assert.equal(tienLen.khoiTao(2, 5).bai[0].length, 13);
});

test('tiến lên: bỏ lượt hết vòng ⇒ người đánh cuối đi tự do', () => {
  let s = vanTienLen([['5S', '9H', 'KD'], ['3C', '4C', 'QH'], ['6D', '7D', 'JS']]);
  s = tienLen.apDung(s, 0, { loai: 'danh', la: ['9H'] });
  assert.equal(tienLen.luot(s), 1);
  assert.equal(tienLen.kiemTra(s, 1, { loai: 'danh', la: ['4C'] }), 'Bộ này không chặn được bài trên bàn');
  s = tienLen.apDung(s, 1, { loai: 'bo' });
  assert.equal(tienLen.luot(s), 2);
  s = tienLen.apDung(s, 2, { loai: 'danh', la: ['JS'] });
  assert.equal(tienLen.luot(s), 0, 'ghế 1 đã bỏ thì bị bỏ qua trong vòng');
  s = tienLen.apDung(s, 0, { loai: 'bo' });
  assert.equal(s.banTren, null, 'hết vòng');
  assert.equal(tienLen.luot(s), 2);
  assert.deepEqual(s.boLuot, [false, false, false]);
  assert.equal(tienLen.moTa(s, { loai: 'bo' }), 'Bỏ lượt');
  assert.equal(tienLen.moTa(s, { loai: 'danh', la: ['6D', '7D'] }), '6♦ 7♦');
});

test('tiến lên: chặt heo bằng 3 đôi thông', () => {
  let s = vanTienLen([['2H', '9S'], ['3S', '3H', '4S', '4H', '5S', '5H', 'KD']]);
  s = tienLen.apDung(s, 0, { loai: 'danh', la: ['2H'] });
  const chat = { loai: 'danh' as const, la: ['3S', '3H', '4S', '4H', '5S', '5H'] };
  assert.equal(tienLen.kiemTra(s, 1, chat), null);
  assert.equal(tienLen.moTa(s, chat), '3 đôi thông 3–5 (chặt)');
  assert.ok(tienLen.cacNuoc(s).some((m) => m.loai === 'danh' && m.la.length === 6));
});

test('tiến lên: người về hết bài, ván kết thúc với thứ hạng đủ', () => {
  let s = vanTienLen([['9S'], ['3C', '4C'], ['5D', '6D']]);
  s = tienLen.apDung(s, 0, { loai: 'danh', la: ['9S'] });
  assert.deepEqual(s.daVe, [0]);
  assert.equal(tienLen.ketThuc(s), null);
  s = tienLen.apDung(s, 1, { loai: 'bo' });
  s = tienLen.apDung(s, 2, { loai: 'bo' });
  // ghế 0 đã về ⇒ ghế kế tiếp còn bài (ghế 1) đi tự do
  assert.equal(s.banTren, null);
  assert.equal(tienLen.luot(s), 1);
  s = tienLen.apDung(s, 1, { loai: 'danh', la: ['3C'] });
  s = tienLen.apDung(s, 2, { loai: 'danh', la: ['6D'] });
  s = tienLen.apDung(s, 1, { loai: 'bo' });
  s = tienLen.apDung(s, 2, { loai: 'danh', la: ['5D'] });
  assert.deepEqual(tienLen.ketThuc(s), { thang: [0], hoa: false, lyDo: 'het-bai', thuHang: [0, 2, 1] });
  const nhin = tienLen.nhinTu(s, 1) as { baiLo: string[][] | null };
  assert.deepEqual(nhin.baiLo, [[], ['4C'], []]);
});

test('tiến lên: nhinTu giấu bài người khác', () => {
  const s = tienLen.khoiTao(4, 3);
  const n = tienLen.nhinTu(s, 1) as Record<string, unknown>;
  assert.deepEqual(n.baiCuaToi, s.bai[1]);
  assert.deepEqual(n.soLa, [13, 13, 13, 13]);
  assert.equal(n.baiLo, null);
  const chuoi = JSON.stringify(n);
  for (const la of s.bai[0]) assert.ok(!chuoi.includes(`"${la}"`) || s.bai[1].includes(la) || la === s.laDau);
  assert.equal((tienLen.nhinTu(s, null) as Record<string, unknown>).baiCuaToi, null);
});

// ─── Caro ────────────────────────────────────────────────────────────────────
function diCaro(ds: [number, number][]) {
  let s = caro.khoiTao(2, 1);
  for (const o of ds) {
    const g = caro.luot(s);
    assert.equal(caro.kiemTra(s, g, { o }), null);
    s = caro.apDung(s, g, { o });
  }
  return s;
}
test('caro: 5 liền ngang / dọc / chéo thắng, 4 thì chưa', () => {
  const xen = (x: [number, number][], o: [number, number][]) => x.flatMap((p, i) => (o[i] ? [p, o[i]] : [p]));
  const ngang = diCaro(xen([[3, 3], [4, 3], [5, 3], [6, 3], [7, 3]], [[0, 0], [0, 1], [0, 2], [0, 3]]));
  assert.deepEqual(caro.ketThuc(ngang), { thang: [0], hoa: false, lyDo: 'nam-lien' });
  assert.equal(ngang.thang?.duong.length, 5);
  const doc = diCaro(xen([[9, 9], [9, 10], [9, 11], [9, 12], [9, 13]], [[0, 0], [0, 1], [0, 2], [0, 3]]));
  assert.equal(caro.ketThuc(doc)?.lyDo, 'nam-lien');
  const cheo = diCaro(xen([[2, 2], [3, 3], [4, 4], [5, 5], [6, 6]], [[0, 9], [0, 1], [0, 2], [0, 3]]));
  assert.equal(caro.ketThuc(cheo)?.thang[0], 0);
  const cheoNguoc = diCaro(xen([[14, 0], [10, 0], [11, 3], [12, 2], [13, 1], [10, 4]], [[0, 9], [0, 1], [0, 2], [0, 3], [1, 1]]));
  assert.deepEqual(caro.ketThuc(cheoNguoc)?.thang, [0]);
  const bon = diCaro(xen([[3, 3], [4, 3], [5, 3], [6, 3]], [[0, 0], [0, 1], [0, 2]]));
  assert.equal(caro.ketThuc(bon), null);
  assert.equal(caro.kiemTra(bon, 1, { o: [3, 3] }), 'Ô này đã có quân');
  assert.equal(caro.moTa(bon, { o: [7, 7] }), 'H8');
});

// ─── Mọi trò ─────────────────────────────────────────────────────────────────
const RAC: unknown[] = [
  null, undefined, {}, [], 'e2e4', 42, NaN, true, { tu: 1, den: 2 }, { tu: 'z9', den: 'e4' }, { tu: [99, 0], den: [0, 0] },
  { tu: [0.5, 0], den: [0, 1] }, { o: [1] }, { o: [-1, 3] }, { o: ['a', 'b'] }, { loai: 'danh', la: 'x' },
  { loai: 'danh', la: [1, 2] }, { loai: 'danh', la: [] }, { loai: 'xyz' }, { loai: 'danh', la: ['ZZ'] },
  { tu: 'e2', den: 'e4', phong: 'k' }, { __proto__: null }, Object.create(null),
];

test('mọi trò: kiemTra chịu dữ liệu rác, không ném lỗi', () => {
  for (const ma of Object.keys(LUAT) as MaTro[]) {
    const l = LUAT[ma];
    const s = l.khoiTao(l.soNguoi.max, 9);
    for (const g of [0, 1, -1, 7, NaN]) {
      for (const m of RAC) {
        let kq: string | null = 'chưa chạy';
        assert.doesNotThrow(() => { kq = l.kiemTra(s, g, m); }, `${ma} ${JSON.stringify(m)}`);
        assert.equal(typeof kq, 'string', `${ma} phải từ chối ${JSON.stringify(m)}`);
      }
    }
    // Đúng nước hợp lệ nhưng sai ghế.
    const m0 = l.cacNuoc(s)[0];
    const sai = (l.luot(s) + 1) % l.soNguoi.max;
    assert.equal(l.kiemTra(s, sai, m0), 'Chưa tới lượt bạn', ma);
  }
});

function tuDau(l: LuatTro<unknown, unknown>, soNguoi: number, seed: number, cap: (ghe: number) => CapDoBot) {
  const rnd = taoNgauNhien(seed);
  let s = l.khoiTao(soNguoi, seed);
  let n = 0;
  while (!l.ketThuc(s)) {
    const ghe = l.luot(s);
    const m = l.nuocBot(s, cap(ghe), rnd);
    const loi = l.kiemTra(s, ghe, JSON.parse(JSON.stringify(m)));
    assert.equal(loi, null, `${l.ma} ván ${seed} nước ${n}: bot đi sai (${JSON.stringify(m)}) — ${loi}`);
    assert.equal(typeof l.moTa(s, m), 'string');
    s = JSON.parse(JSON.stringify(l.apDung(s, ghe, m)));
    n++;
    assert.ok(n < 6000, `${l.ma}: ván không kết thúc`);
  }
  const kq = l.ketThuc(s)!;
  assert.equal(typeof kq.lyDo, 'string');
  assert.ok(kq.hoa ? kq.thang.length === 0 : kq.thang.length === 1);
  return { kq, n };
}

for (const [ma, soNguoi, capDo] of [
  ['co-vua', () => 2, () => 1],
  ['co-tuong', () => 2, () => 1],
  ['tien-len', (i: number) => 2 + (i % 3), (g: number, i: number) => (((g + i) % 3) + 1)],
  ['caro', () => 2, (g: number, i: number) => (((g + i) % 3) + 1)],
] as [MaTro, (i: number) => number, (g: number, i: number) => number][]) {
  test(`${ma}: tự đấu bot-vs-bot 20 ván kết thúc hợp lệ`, () => {
    const lyDo: Record<string, number> = {};
    for (let i = 0; i < 20; i++) {
      const { kq } = tuDau(LUAT[ma], soNguoi(i), 1000 + i, (g) => capDo(g, i) as CapDoBot);
      lyDo[kq.lyDo] = (lyDo[kq.lyDo] ?? 0) + 1;
      if (ma === 'tien-len') assert.equal(kq.thuHang?.length, soNguoi(i));
    }
    console.log(`  ${ma}:`, JSON.stringify(lyDo));
  });
}

test('cờ vua + cờ tướng: một ván cấp 2 đấu cấp 3 vẫn hợp lệ (giới hạn 40 nước)', () => {
  for (const l of [coVua, coTuong] as LuatTro<unknown, unknown>[]) {
    const rnd = taoNgauNhien(77);
    let s = l.khoiTao(2, 1);
    for (let i = 0; i < 40 && !l.ketThuc(s); i++) {
      const ghe = l.luot(s);
      const m = l.nuocBot(s, ghe === 0 ? 2 : 3, rnd);
      assert.equal(l.kiemTra(s, ghe, m), null);
      s = l.apDung(s, ghe, m);
    }
  }
});

test('mọi trò: nước bot cấp 3 < 1,5 giây', () => {
  const viTri: [MaTro, unknown][] = [
    ['co-vua', coVua.khoiTao(2, 1)],
    ['co-vua', tuFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -')],
    ['co-vua', tuFen('r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 8')],
    ['co-tuong', coTuong.khoiTao(2, 1)],
    ['tien-len', tienLen.khoiTao(4, 11)],
    ['caro', caro.khoiTao(2, 1)],
  ];
  // Thêm vị trí giữa ván: tự đấu cấp 1 vài chục nước rồi đo.
  for (const ma of ['co-tuong', 'caro'] as MaTro[]) {
    const l = LUAT[ma];
    const rnd = taoNgauNhien(5);
    let s = l.khoiTao(2, 5);
    for (let i = 0; i < 30 && !l.ketThuc(s); i++) s = l.apDung(s, l.luot(s), l.nuocBot(s, 1, rnd));
    if (!l.ketThuc(s)) viTri.push([ma, s]);
  }
  for (const [ma, s] of viTri) {
    const t0 = Date.now();
    LUAT[ma].nuocBot(s, 3, taoNgauNhien(1));
    const ms = Date.now() - t0;
    console.log(`  ${ma} cấp 3: ${ms} ms`);
    assert.ok(ms < 1500, `${ma} cấp 3 mất ${ms} ms`);
  }
});
