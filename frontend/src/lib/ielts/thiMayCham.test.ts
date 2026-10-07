/**
 * Chấm từng dạng câu + duyệt MỌI đề của phòng thi máy tính.
 * Chạy: npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts (đặt ngoài thư mục [code] vì trình chạy test của node hiểu [ ] là glob)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoa, demTu, vuotGioiHan, dungCauGo, chamNhom, bandTuDiem, doanLyDo, dinhDangGio, nhomCuaDe } from '../../app/language/[code]/ielts/thi-may/cham';
import type { Nhom, DeDoc, DeNghe, DapAn } from '../../app/language/[code]/ielts/thi-may/de/types';
import { DANG_GO } from '../../app/language/[code]/ielts/thi-may/de/types';
import { DOC_01 } from '../../app/language/[code]/ielts/thi-may/de/doc-01';
import { NGHE_01 } from '../../app/language/[code]/ielts/thi-may/de/nghe-01';
import { VIET_01 } from '../../app/language/[code]/ielts/thi-may/de/viet-01';
import { MUC_LUC } from '../../app/language/[code]/ielts/thi-may/de/index';

test('chuẩn hoá: hoa/thường, khoảng trắng, dấu câu hai đầu, phẩy nghìn, ký hiệu tiền', () => {
  assert.equal(chuanHoa('  Salt. '), 'salt');
  assert.equal(chuanHoa('1,500'), '1500');
  assert.equal(chuanHoa('£45'), '45');
  assert.equal(chuanHoa('mind‑wandering'), chuanHoa('mind‑wandering'));
});

test('đếm từ: gạch nối là 1 từ, các nhóm số liền nhau là 1 số', () => {
  assert.deepEqual(demTu('mind-wandering'), { tu: 1, so: 0 });
  assert.deepEqual(demTu('07945 812 663'), { tu: 0, so: 1 });
  assert.deepEqual(demTu('the parent tree'), { tu: 3, so: 0 });
  assert.deepEqual(demTu('15 March'), { tu: 1, so: 1 });
});

test('giới hạn số từ: ONE WORD ONLY / TWO WORDS / ONE WORD AND/OR A NUMBER', () => {
  assert.equal(vuotGioiHan('parent', { tu: 1 }), false);
  assert.equal(vuotGioiHan('parent tree', { tu: 1 }), true);
  assert.equal(vuotGioiHan('arching prop roots', { tu: 2 }), true);
  assert.equal(vuotGioiHan('07945 812 663', { tu: 1, so: true }), false);
  assert.equal(vuotGioiHan('Harbour Road', { tu: 1, so: true }), true);
});

test('gõ chữ: đúng chính tả mới đúng; vượt số từ là sai dù chứa đáp án', () => {
  const da: DapAn = { a: ['parent'], vi: '' };
  assert.equal(dungCauGo('Parent', da, { tu: 1 }), true);
  assert.equal(dungCauGo('the parent', da, { tu: 1 }), false);
  assert.equal(dungCauGo('parrent', da, { tu: 1 }), false);
  assert.equal(dungCauGo('', da, { tu: 1 }), false);
});

const nhomThu: Nhom[] = [
  { id: 'g1', tu: 1, den: 2, dang: 'note', huongDan: '', gioiHan: { tu: 1 }, dong: ['[[1]] [[2]]'] },
  { id: 'g2', tu: 3, den: 4, dang: 'tfng', huongDan: '', cau: [{ n: 3, s: '' }, { n: 4, s: '' }] },
  { id: 'g3', tu: 5, den: 6, dang: 'mcq2', huongDan: '', nhieu: { ns: [5, 6], s: '', chon: [] } },
  { id: 'g4', tu: 7, den: 7, dang: 'heading', huongDan: '', cau: [{ n: 7, s: '' }] },
];
const daThu: Record<number, DapAn> = {
  1: { a: ['salt'], vi: '' }, 2: { a: ['year'], vi: '' }, 3: { a: ['NOT GIVEN'], vi: '' }, 4: { a: ['TRUE'], vi: '' },
  5: { a: ['B', 'D'], vi: '' }, 6: { a: ['B', 'D'], vi: '' }, 7: { a: ['iv'], vi: '' },
};

test('chấm nhiều dạng: TFNG, heading (không phân biệt hoa thường), mcq2 không phụ thuộc thứ tự', () => {
  const kq = chamNhom(nhomThu, daThu, { 1: 'salt', 2: 'years', 3: 'FALSE', 4: 'TRUE', 5: 'D', 6: 'B', 7: 'IV' });
  assert.deepEqual(kq.map((k) => k.dung), [true, false, false, true, true, true, true]);
});

test('mcq2: chọn trùng một chữ hai lần chỉ được một điểm; câu sai hiện chữ đúng còn thiếu', () => {
  const kq = chamNhom(nhomThu, daThu, { 5: 'B', 6: 'B' });
  const c5 = kq.find((k) => k.n === 5)!, c6 = kq.find((k) => k.n === 6)!;
  assert.equal(c5.dung, true);
  assert.equal(c6.dung, false);
  assert.equal(c6.dapAn, 'D');
});

test('quy đổi band ước tính (40 câu)', () => {
  assert.equal(bandTuDiem(40, 'doc'), 9);
  assert.equal(bandTuDiem(30, 'doc'), 7);
  assert.equal(bandTuDiem(33, 'doc'), 7.5);
  assert.equal(bandTuDiem(32, 'nghe'), 7.5);
  assert.equal(bandTuDiem(26, 'nghe'), 6.5);
  assert.equal(bandTuDiem(23, 'doc'), 6);
  assert.equal(bandTuDiem(0, 'doc'), 0);
});

test('đoán lý do sai cho Sổ lỗi', () => {
  const kq = chamNhom(nhomThu, daThu, { 1: 'slat', 2: 'years', 3: 'FALSE' });
  assert.equal(doanLyDo(kq[0], daThu[1], { tu: 1 }, 'doc'), 'chinh-ta');
  assert.equal(doanLyDo(kq[1], daThu[2], { tu: 1 }, 'doc'), 'ngu-phap');
  assert.equal(doanLyDo(kq[2], daThu[3], undefined, 'doc'), 'ng-false');
  assert.equal(doanLyDo(kq[3], daThu[4], undefined, 'doc'), 'het-gio');
});

test('đồng hồ 00:59:58', () => {
  assert.equal(dinhDangGio(3598), '00:59:58');
  assert.equal(dinhDangGio(-3), '00:00:00');
});

/* ── Duyệt nội dung MỌI đề ─────────────────────────────────────────── */
function kiemDe(de: DeDoc | DeNghe) {
  const nhom = nhomCuaDe(de);
  const so = nhom.flatMap((g) => Array.from({ length: g.den - g.tu + 1 }, (_, i) => g.tu + i)).sort((a, b) => a - b);
  assert.deepEqual(so, Array.from({ length: 40 }, (_, i) => i + 1), `${de.id}: câu 1–40 liên tục, không trùng`);
  const nguon = de.kyNang === 'doc'
    ? (de as DeDoc).phan.flatMap((p) => p.doan.map((d) => d.s)).join('\n')
    : (de as DeNghe).phan.flatMap((p) => p.loi.map((l) => l.s)).join('\n');
  for (const g of nhom) {
    // Mỗi ô [[n]] xuất hiện đúng một lần trong nhóm dạng gõ/summary-box.
    if (DANG_GO.has(g.dang) || g.dang === 'summary-box') {
      const chu = [...(g.dong ?? []), ...(g.bang?.hang.flat() ?? []), ...(g.hinh?.ve.filter((v) => v.t === 'o').map((v) => `[[${(v as { n: number }).n}]]`) ?? [])].join(' ');
      for (let n = g.tu; n <= g.den; n++) assert.equal(chu.split(`[[${n}]]`).length - 1, 1, `${de.id} câu ${n}: ô [[${n}]] phải có đúng 1 lần`);
    }
    if (g.cau) for (let n = g.tu; n <= g.den; n++) assert.ok(g.cau.some((c) => c.n === n), `${de.id} câu ${n}: thiếu dòng câu hỏi`);
    for (let n = g.tu; n <= g.den; n++) {
      const da = de.dapAn[n];
      assert.ok(da && da.a.length && da.vi, `${de.id} câu ${n}: thiếu đáp án/giải thích`);
      if (da.ev) assert.ok(nguon.includes(da.ev), `${de.id} câu ${n}: ev không phải chuỗi con nguyên văn: "${da.ev}"`);
      else assert.fail(`${de.id} câu ${n}: thiếu ev`);
      if (DANG_GO.has(g.dang)) {
        // Đáp án CHÍNH phải nằm trong giới hạn số từ của chính nhóm đó.
        assert.equal(vuotGioiHan(da.a[0], g.gioiHan), false, `${de.id} câu ${n}: đáp án "${da.a[0]}" vượt giới hạn từ`);
        // Dạng chép từ bài: đáp án phải xuất hiện trong nguồn.
        assert.ok(da.a.some((x) => chuanHoa(nguon).includes(chuanHoa(x))), `${de.id} câu ${n}: đáp án không có trong bài/lời thoại`);
      } else {
        const chon = new Set<string>([
          ...(g.hop?.ds.map((o) => o.k) ?? []),
          ...(g.cau?.find((c) => c.n === n)?.chon?.map((o) => o.k) ?? []),
          ...(g.nhieu?.chon.map((o) => o.k) ?? []),
          ...(g.dang === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : g.dang === 'ynng' ? ['YES', 'NO', 'NOT GIVEN'] : []),
        ]);
        for (const x of da.a) assert.ok(chon.has(x), `${de.id} câu ${n}: đáp án "${x}" không nằm trong các lựa chọn`);
      }
    }
  }
  // Làm đúng hết ⇒ 40/40.
  const ans: Record<number, string> = {};
  for (const g of nhom) {
    if (g.dang === 'mcq2' && g.nhieu) g.nhieu.ns.forEach((n, i) => { ans[n] = de.dapAn[n].a[i]; });
    else for (let n = g.tu; n <= g.den; n++) ans[n] = de.dapAn[n].a[0];
  }
  assert.equal(chamNhom(nhom, de.dapAn, ans).filter((k) => k.dung).length, 40, `${de.id}: đáp án chuẩn phải ra 40/40`);
}

test('đề Reading 01: 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_01));
test('đề Listening 01: 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_01));

test('đề Writing 01 + mục lục khớp nội dung', () => {
  assert.equal(VIET_01.task.length, 2);
  for (const t of VIET_01.task) assert.ok(t.mau.s.split(/\s+/).length >= t.minTu, `bài mẫu Task ${t.so} đủ ${t.minTu} từ`);
  const bd = VIET_01.task[0].bieuDo;
  if (bd?.loai === 'cot') for (let i = 0; i < bd.chuoi.length; i++) assert.equal(bd.chuoi[i].so.reduce((a, b) => a + b, 0), 100);
  assert.deepEqual(MUC_LUC.map((m) => m.id), ['doc-01', 'nghe-01', 'viet-01']);
  for (const p of DOC_01.phan) assert.ok(p.doan.map((d) => d.s).join(' ').split(/\s+/).length >= 550, `passage ${p.so} đủ dài`);
});
