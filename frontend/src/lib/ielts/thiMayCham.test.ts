/**
 * Chấm từng dạng câu + duyệt MỌI đề của phòng thi máy tính.
 * Chạy: npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts (đặt ngoài thư mục [code] vì trình chạy test của node hiểu [ ] là glob)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoa, demTu, vuotGioiHan, dungCauGo, chamNhom, bandTuDiem, doanLyDo, dinhDangGio, nhomCuaDe, conChu, lamTronBand, bandTong, BAI_ON, ngayCuaBai, linkBai, tapCuaBai } from '../../app/language/[code]/ielts/thi-may/cham';
import type { Nhom, DeDoc, DeNghe, DeNoi, DeViet, DapAn, DangCau } from '../../app/language/[code]/ielts/thi-may/de/types';
import { DANG_GO } from '../../app/language/[code]/ielts/thi-may/de/types';
import { DOC_01 } from '../../app/language/[code]/ielts/thi-may/de/doc-01';
import { NGHE_01 } from '../../app/language/[code]/ielts/thi-may/de/nghe-01';
import { VIET_01 } from '../../app/language/[code]/ielts/thi-may/de/viet-01';
import { DOC_00 } from '../../app/language/[code]/ielts/thi-may/de/doc-00';
import { NGHE_00 } from '../../app/language/[code]/ielts/thi-may/de/nghe-00';
import { DOC_DE1 } from '../../app/language/[code]/ielts/thi-may/de/doc-de1';
import { NGHE_DE1 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de1';
import { VIET_DE1 } from '../../app/language/[code]/ielts/thi-may/de/viet-de1';
import { NOI_DE1 } from '../../app/language/[code]/ielts/thi-may/de/noi-de1';
import { NOI_06 } from '../../app/language/[code]/ielts/thi-may/de/noi-06';
import { DOC_DE2 } from '../../app/language/[code]/ielts/thi-may/de/doc-de2';
import { NGHE_DE2 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de2';
import { VIET_DE2 } from '../../app/language/[code]/ielts/thi-may/de/viet-de2';
import { NOI_DE2 } from '../../app/language/[code]/ielts/thi-may/de/noi-de2';
import { DOC_DE3 } from '../../app/language/[code]/ielts/thi-may/de/doc-de3';
import { NGHE_DE3 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de3';
import { VIET_DE3 } from '../../app/language/[code]/ielts/thi-may/de/viet-de3';
import { NOI_DE3 } from '../../app/language/[code]/ielts/thi-may/de/noi-de3';
import { DOC_DE4 } from '../../app/language/[code]/ielts/thi-may/de/doc-de4';
import { NGHE_DE4 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de4';
import { VIET_DE4 } from '../../app/language/[code]/ielts/thi-may/de/viet-de4';
import { NOI_DE4 } from '../../app/language/[code]/ielts/thi-may/de/noi-de4';
import { DOC_DE5 } from '../../app/language/[code]/ielts/thi-may/de/doc-de5';
import { NGHE_DE5 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de5';
import { VIET_DE5 } from '../../app/language/[code]/ielts/thi-may/de/viet-de5';
import { NOI_DE5 } from '../../app/language/[code]/ielts/thi-may/de/noi-de5';
import { DOC_DE7 } from '../../app/language/[code]/ielts/thi-may/de/doc-de7';
import { NGHE_DE7 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de7';
import { VIET_DE7 } from '../../app/language/[code]/ielts/thi-may/de/viet-de7';
import { NOI_DE7 } from '../../app/language/[code]/ielts/thi-may/de/noi-de7';
import { DOC_DE8 } from '../../app/language/[code]/ielts/thi-may/de/doc-de8';
import { NGHE_DE8 } from '../../app/language/[code]/ielts/thi-may/de/nghe-de8';
import { VIET_DE8 } from '../../app/language/[code]/ielts/thi-may/de/viet-de8';
import { NOI_DE8 } from '../../app/language/[code]/ielts/thi-may/de/noi-de8';
import { MUC_LUC, BO_DE, deCuaBo, coDe, TEN_KY_NANG } from '../../app/language/[code]/ielts/thi-may/de/index';
import { MANIFEST } from '../../app/language/[code]/ielts/ngay/manifest';
import { MANIFEST as MANIFEST_T2 } from '../../app/language/[code]/ielts/tap-2/ngay/manifest';
import { MANIFEST as MANIFEST_T3 } from '../../app/language/[code]/ielts/tap-3/ngay/manifest';
import { MANIFEST as MANIFEST_T4 } from '../../app/language/[code]/ielts/tap-4/ngay/manifest';

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
test('Đề 0 Reading (doc-00): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_00));
test('Đề 0 Listening (nghe-00): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_00));
test('Đề 1 Reading (doc-de1): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE1));
test('Đề 1 Listening (nghe-de1): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE1));

test('Đề 1 (thi cuối Tập 1): chỉ dùng dạng Tập 1 đã dạy, passage đủ dài, trắc nghiệm rải đều, Writing + Speaking đủ khuôn', () => {
  // Mọi dạng câu của Đề 1 phải có bài ôn trong Tập 1 (BAI_ON khác rỗng) — đề cuối tập không được hỏi dạng chưa dạy.
  for (const de of [DOC_DE1, NGHE_DE1]) for (const g of nhomCuaDe(de)) assert.ok(BAI_ON[g.dang].length > 0, `${de.id} ${g.id}: dạng ${g.dang} chưa có bài ôn ở Tập 1`);
  for (const p of DOC_DE1.phan) assert.ok(p.doan.map((d) => d.s).join(' ').split(/\s+/).length >= 550, `doc-de1 passage ${p.so} đủ dài`);
  // TFNG: đủ cả ba loại đáp án, không loại nào quá nửa.
  const tfng = nhomCuaDe(DOC_DE1).filter((g) => g.dang === 'tfng').flatMap((g) => Array.from({ length: g.den - g.tu + 1 }, (_, i) => DOC_DE1.dapAn[g.tu + i].a[0]));
  for (const k of ['TRUE', 'FALSE', 'NOT GIVEN']) { const n = tfng.filter((x) => x === k).length; assert.ok(n >= 2 && n <= tfng.length / 2, `doc-de1 TFNG: ${k} xuất hiện ${n}/${tfng.length}`); }
  // MCQ Listening (giao diện KHÔNG xáo): A/B/C đều nhau, không quá 2 câu liền cùng chữ.
  const mcq = nhomCuaDe(NGHE_DE1).filter((g) => g.dang === 'mcq').flatMap((g) => g.cau!.map((c) => NGHE_DE1.dapAn[c.n].a[0]));
  for (const k of ['A', 'B', 'C']) assert.equal(mcq.filter((x) => x === k).length, 3, `nghe-de1 MCQ: ${k} phải 3/9`);
  for (let i = 2; i < mcq.length; i++) assert.ok(!(mcq[i] === mcq[i - 1] && mcq[i] === mcq[i - 2]), 'nghe-de1 MCQ: 3 câu liền cùng đáp án');
  // Listening ≥ 3 giọng.
  assert.ok(new Set(NGHE_DE1.phan.flatMap((p) => p.loi.map((l) => l.giong))).size >= 3, 'nghe-de1: ít nhất 3 giọng');
  // Writing: 2 task, bài mẫu đủ số từ, Task 1 là line graph có số liệu khớp số mốc.
  assert.equal(VIET_DE1.task.length, 2);
  for (const t of VIET_DE1.task) assert.ok(t.mau.s.split(/\s+/).length >= t.minTu, `viet-de1 bài mẫu Task ${t.so} đủ ${t.minTu} từ`);
  const fig = VIET_DE1.task[0].figure!;
  assert.equal(fig.kind, 'line');
  for (const c of fig.series!) assert.equal(c.values.length, fig.categories!.length, `viet-de1: chuỗi ${c.name} đủ số mốc`);
  // Speaking (Đề 1 + Đề 6): Part 1 hai chủ đề × 3 câu, cue card đủ 4 ý, Part 3 4–5 câu, mẫu đủ 3 Part.
  for (const de of [NOI_DE1, NOI_06]) {
    assert.equal(de.part1.length, 2, `${de.id}: Part 1 hai chủ đề`);
    assert.equal(de.part1.flatMap((c) => c.cau).length, 6, `${de.id}: Part 1 sáu câu`);
    assert.equal(de.part2.cueCard.split('\n').filter((d) => d.startsWith('• ')).length, 3, `${de.id}: cue card 3 gạch đầu dòng`);
    assert.match(de.part2.cueCard, /^Describe .+\n\nYou should say:\n[\s\S]+\n\nand explain /, `${de.id}: cue card đúng khuôn (3 ý + "and explain")`);
    const p3 = de.part3.flatMap((c) => c.cau).length;
    assert.ok(p3 >= 4 && p3 <= 5, `${de.id}: Part 3 có ${p3} câu`);
    for (const part of [1, 2, 3] as const) assert.ok(de.mau.some((m) => m.part === part), `${de.id}: thiếu câu trả lời mẫu Part ${part}`);
    // Câu mẫu phải là câu hỏi có thật trong đề.
    const moiCau = new Set([...de.part1.flatMap((c) => c.cau), de.part2.cueCard.split('\n')[0], ...de.part3.flatMap((c) => c.cau)]);
    for (const m of de.mau) assert.ok(moiCau.has(m.cau), `${de.id}: câu mẫu "${m.cau}" không có trong đề`);
  }
});

/* ── Đề 2 (Tập 2 · Ngày 12, band 4.5) + Đề 3 (thi cuối Tập 2, band 5.0) — soạn 12/11/2026 ─────────── */
test('Đề 2 Reading (doc-de2): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE2));
test('Đề 2 Listening (nghe-de2): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE2));
test('Đề 3 Reading (doc-de3): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE3));
test('Đề 3 Listening (nghe-de3): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE3));

const dapAnNhom = (de: DeDoc | DeNghe, dang: DangCau) =>
  nhomCuaDe(de).filter((g) => g.dang === dang).flatMap((g) => Array.from({ length: g.den - g.tu + 1 }, (_, i) => de.dapAn[g.tu + i].a[0]));

/** Kiểm chung cho Writing + Speaking của một đề đủ (khuôn Đề 1). */
function kiemVietNoi(viet: DeViet, noi: DeNoi) {
  assert.equal(viet.task.length, 2);
  assert.deepEqual(viet.task.map((t) => [t.so, t.phut, t.minTu]), [[1, 20, 150], [2, 40, 250]], `${viet.id}: Task 1 20′/150 từ, Task 2 40′/250 từ`);
  for (const t of viet.task) {
    assert.ok(t.mau.s.split(/\s+/).length >= t.minTu, `${viet.id} bài mẫu Task ${t.so} đủ ${t.minTu} từ`);
    assert.ok(t.mau.phanTich.length >= 5 && t.moTaSo && t.goiY.length >= 5, `${viet.id} Task ${t.so}: đủ phân tích, mô tả số, gợi ý`);
    assert.match(t.de, new RegExp(`Write at least ${t.minTu} words\\.$`), `${viet.id} Task ${t.so}: đề ghi số từ tối thiểu`);
  }
  assert.equal(noi.part1.length, 2, `${noi.id}: Part 1 hai chủ đề`);
  assert.equal(noi.part1.flatMap((c) => c.cau).length, 6, `${noi.id}: Part 1 sáu câu`);
  assert.equal(noi.part2.cueCard.split('\n').filter((d) => d.startsWith('• ')).length, 3, `${noi.id}: cue card 3 gạch đầu dòng`);
  assert.match(noi.part2.cueCard, /^Describe .+\n\nYou should say:\n[\s\S]+\n\nand explain /, `${noi.id}: cue card đúng khuôn (3 ý + "and explain")`);
  const p3 = noi.part3.flatMap((c) => c.cau).length;
  assert.ok(p3 >= 4 && p3 <= 5, `${noi.id}: Part 3 có ${p3} câu`);
  for (const part of [1, 2, 3] as const) assert.ok(noi.mau.some((m) => m.part === part), `${noi.id}: thiếu câu trả lời mẫu Part ${part}`);
  const moiCau = new Set([...noi.part1.flatMap((c) => c.cau), noi.part2.cueCard.split('\n')[0], ...noi.part3.flatMap((c) => c.cau)]);
  for (const m of noi.mau) assert.ok(moiCau.has(m.cau) && m.phanTich.length >= 4, `${noi.id}: câu mẫu "${m.cau}" phải có trong đề + đủ phân tích`);
}

/** Phân bố đáp án của một đề Listening/Reading: MCQ rải đều, không 3 câu liền cùng chữ; T/F/NG và Y/N/NG đủ ba loại. */
function kiemPhanBo(doc: DeDoc, nghe: DeNghe) {
  for (const p of doc.phan) assert.ok(p.doan.map((d) => d.s).join(' ').split(/\s+/).length >= 650, `${doc.id} passage ${p.so} đủ dài (≥ 650 từ)`);
  for (const [dang, ba] of [['tfng', ['TRUE', 'FALSE', 'NOT GIVEN']], ['ynng', ['YES', 'NO', 'NOT GIVEN']]] as const) {
    const ds = dapAnNhom(doc, dang);
    if (ds.length) for (const k of ba) { const n = ds.filter((x) => x === k).length; assert.ok(n >= 2 && n <= ds.length / 2, `${doc.id} ${dang}: ${k} xuất hiện ${n}/${ds.length}`); }
  }
  // MCQ Reading 4 lựa chọn: mỗi chữ A–D đúng một lần (4 câu).
  const mcqDoc = dapAnNhom(doc, 'mcq');
  assert.deepEqual([...mcqDoc].sort(), ['A', 'B', 'C', 'D'], `${doc.id} MCQ: A–D mỗi chữ một lần`);
  // MCQ Listening (giao diện KHÔNG xáo): 9 câu, A/B/C mỗi chữ 3 lần, không quá 2 câu liền cùng chữ.
  const mcq = dapAnNhom(nghe, 'mcq');
  for (const k of ['A', 'B', 'C']) assert.equal(mcq.filter((x) => x === k).length, 3, `${nghe.id} MCQ: ${k} phải 3/9`);
  for (let i = 2; i < mcq.length; i++) assert.ok(!(mcq[i] === mcq[i - 1] && mcq[i] === mcq[i - 2]), `${nghe.id} MCQ: 3 câu liền cùng đáp án`);
  // Nối (matching) khi nghe: không chữ nào dùng hai lần; bản đồ: các câu trỏ tới các chữ khác nhau.
  for (const dang of ['match-feature', 'map'] as const) { const ds = dapAnNhom(nghe, dang); assert.equal(new Set(ds).size, ds.length, `${nghe.id} ${dang}: mỗi chữ một lần`); }
  assert.ok(new Set(nghe.phan.flatMap((p) => p.loi.map((l) => l.giong))).size >= 3, `${nghe.id}: ít nhất 3 giọng`);
  assert.deepEqual(nghe.phan.map((p) => nhomCuaDe(nghe, [p.so]).reduce((a, g) => a + g.den - g.tu + 1, 0)), [10, 10, 10, 10], `${nghe.id}: mỗi Part 10 câu`);
  assert.deepEqual(doc.phan.map((p) => nhomCuaDe(doc, [p.so]).reduce((a, g) => a + g.den - g.tu + 1, 0)), [13, 13, 14], `${doc.id}: 13 + 13 + 14 câu`);
}

test('Đề 2 (Tập 2 · Ngày 12): chỉ dùng dạng đã dạy tới T2 N12, phân bố đáp án, Writing bar + Discussion, Speaking đủ khuôn', () => {
  // Dạng được phép: Tập 1 + Tập 2 Ngày 1–12 (docs/ielts-lo-trinh-0-8.md mục 3.2). CHƯA có: match-info (N16), match-ending (N18),
  // ynng (N20), diagram (N22) khi đọc; mcq2 / flow (N13), sentence / short (N19) khi nghe.
  const docOk = new Set<DangCau>(['sentence', 'table', 'flow', 'match-feature', 'tfng', 'summary-box', 'short', 'summary', 'note', 'mcq', 'heading']);
  const ngheOk = new Set<DangCau>(['form', 'note', 'mcq', 'map', 'match-feature', 'summary', 'table']);
  for (const g of nhomCuaDe(DOC_DE2)) assert.ok(docOk.has(g.dang), `doc-de2 ${g.id}: dạng ${g.dang} chưa dạy tới T2 N12`);
  for (const g of nhomCuaDe(NGHE_DE2)) assert.ok(ngheOk.has(g.dang), `nghe-de2 ${g.id}: dạng ${g.dang} chưa dạy tới T2 N12`);
  // Bốn dạng mới của nửa đầu Tập 2 phải có mặt (mục 4.2: + Note / Short answer / MCQ / Headings).
  for (const d of ['note', 'short', 'mcq', 'heading'] as const) assert.ok(nhomCuaDe(DOC_DE2).some((g) => g.dang === d), `doc-de2 thiếu dạng ${d}`);
  assert.ok(new Set(nhomCuaDe(DOC_DE2).map((g) => g.dang)).size >= 6, 'doc-de2: ≥ 6 dạng');
  kiemPhanBo(DOC_DE2, NGHE_DE2);
  // Matching headings: 6 đoạn, 9 tiêu đề, không tiêu đề nào dùng hai lần.
  const hd = dapAnNhom(DOC_DE2, 'heading');
  assert.equal(new Set(hd).size, 6);
  assert.equal(nhomCuaDe(DOC_DE2).find((g) => g.dang === 'heading')!.hop!.ds.length, 9);
  // Writing: Task 1 bar chart (2 chuỗi × 5 nhóm), Task 2 Discussion.
  const fig = VIET_DE2.task[0].figure!;
  assert.equal(fig.kind, 'bar');
  for (const c of fig.series!) assert.equal(c.values.length, fig.categories!.length, `viet-de2: chuỗi ${c.name} đủ số nhóm`);
  assert.match(VIET_DE2.task[1].de, /Discuss both these views and give your own opinion\./);
  kiemVietNoi(VIET_DE2, NOI_DE2);
});

test('Đề 3 (thi cuối Tập 2): đủ dạng nửa sau Tập 2, phân bố đáp án, Writing 2 pie + Advantages/disadvantages, Speaking đủ khuôn', () => {
  // Reading: bốn dạng dạy ở N16–N22 phải có mặt; chưa dùng mcq2 (Tập 3 Ngày 13).
  for (const d of ['match-info', 'match-ending', 'ynng', 'diagram'] as const) assert.ok(nhomCuaDe(DOC_DE3).some((g) => g.dang === d), `doc-de3 thiếu dạng ${d}`);
  assert.ok(!nhomCuaDe(DOC_DE3).some((g) => g.dang === 'mcq2'), 'doc-de3: mcq2 chưa dạy ở Tập 2');
  // Listening: dạng của T2 N13 + N19.
  for (const d of ['mcq2', 'flow', 'sentence', 'short'] as const) assert.ok(nhomCuaDe(NGHE_DE3).some((g) => g.dang === d), `nghe-de3 thiếu dạng ${d}`);
  kiemPhanBo(DOC_DE3, NGHE_DE3);
  // Matching information / sentence endings: mỗi chữ một lần.
  for (const dang of ['match-info', 'match-ending'] as const) { const ds = dapAnNhom(DOC_DE3, dang); assert.equal(new Set(ds).size, ds.length, `doc-de3 ${dang}: mỗi chữ một lần`); }
  // Chọn TWO: hai đáp án khác nhau, cùng khai ở cả hai câu.
  const m2 = nhomCuaDe(NGHE_DE3).find((g) => g.dang === 'mcq2')!;
  for (const n of m2.nhieu!.ns) assert.deepEqual(NGHE_DE3.dapAn[n].a, ['B', 'E']);
  // Ba đề liên tiếp (Đề 1–3) phủ 15/16 dạng Reading (mục 4.1) — thiếu đúng mcq2 vì Tập 3 mới dạy.
  const baDe = new Set([DOC_DE1, DOC_DE2, DOC_DE3].flatMap((d) => nhomCuaDe(d).map((g) => g.dang)));
  for (const d of ['sentence', 'flow', 'table', 'match-feature', 'tfng', 'summary-box', 'summary', 'note', 'short', 'mcq', 'heading', 'match-info', 'match-ending', 'ynng', 'diagram'] as const) assert.ok(baDe.has(d), `Đề 1–3 Reading thiếu dạng ${d}`);
  // Writing: Task 1 hai pie chart, mỗi hình cộng đúng 100%, cùng bộ nhãn; Task 2 Advantages / disadvantages.
  const [f1, f2] = [VIET_DE3.task[0].figure!, VIET_DE3.task[0].figure2!];
  for (const f of [f1, f2]) { assert.equal(f.kind, 'pie'); assert.equal(f.slices!.reduce((a, x) => a + x.value, 0), 100, `viet-de3: "${f.title}" cộng 100%`); }
  assert.deepEqual(f1.slices!.map((x) => x.label), f2.slices!.map((x) => x.label));
  assert.match(VIET_DE3.task[1].de, /What are the advantages and disadvantages of this/);
  kiemVietNoi(VIET_DE3, NOI_DE3);
});

/* ── Đề 4 (giữa Tập 3, sau Ngày 15, band 5.5) — soạn 18/11/2026 ─────────── */
test('Đề 4 Reading (doc-de4): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE4));
test('Đề 4 Listening (nghe-de4): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE4));

test('Đề 4 (giữa Tập 3 · sau Ngày 15): dạng đã dạy tới T3 N15, phân bố đáp án, Writing table + Problem–solution, Speaking đủ khuôn', () => {
  // Dạng được phép: mọi dạng Tập 1–2 + Tập 3 Ngày 1–15 (docs/ielts-lo-trinh-0-8.md mục 3.3) — Reading đã đủ 16 dạng (mcq2 dạy ở T3 N13).
  // Listening: mọi dạng đã dạy; Đề 4 dùng đúng các dạng Tập 3 vừa luyện (N4 + N12 MCQ + map, N8 matching 3 người nói, N13 note).
  const ngheOk = new Set<DangCau>(['form', 'note', 'mcq', 'map', 'match-feature', 'summary', 'table', 'mcq2', 'flow', 'sentence', 'short']);
  for (const g of nhomCuaDe(NGHE_DE4)) assert.ok(ngheOk.has(g.dang), `nghe-de4 ${g.id}: dạng ${g.dang} chưa dạy tới T3 N15`);
  for (const de of [DOC_DE4, NGHE_DE4]) for (const g of nhomCuaDe(de)) assert.ok(BAI_ON[g.dang].length > 0, `${de.id} ${g.id}: dạng ${g.dang} chưa có bài ôn`);
  // Reading: các dạng Tập 3 Ngày 1–15 dạy lại / dạy mới phải có mặt (N3 TFNG · N5 headings · N7 + N15 short · N9 summary hộp từ · N11 MCQ · N13 chọn TWO · N15 table).
  for (const d of ['tfng', 'heading', 'short', 'summary-box', 'mcq', 'mcq2', 'table'] as const) assert.ok(nhomCuaDe(DOC_DE4).some((g) => g.dang === d), `doc-de4 thiếu dạng ${d}`);
  assert.ok(new Set(nhomCuaDe(DOC_DE4).map((g) => g.dang)).size >= 6, 'doc-de4: ≥ 6 dạng');
  // Listening: map + matching + note (T3 N4, N8, N13) phải có mặt.
  for (const d of ['map', 'match-feature', 'note', 'mcq'] as const) assert.ok(nhomCuaDe(NGHE_DE4).some((g) => g.dang === d), `nghe-de4 thiếu dạng ${d}`);
  kiemPhanBo(DOC_DE4, NGHE_DE4);
  // Độ dài passage theo mục 4.1 (~700 / 800 / 900): Passage 3 dài nhất, 800–900 từ.
  const soTu = DOC_DE4.phan.map((p) => p.doan.map((d) => d.s).join(' ').split(/\s+/).length);
  assert.ok(soTu[2] >= 800 && soTu[2] <= 900, `doc-de4 Passage 3 có ${soTu[2]} từ (cần 800–900)`);
  assert.ok(soTu[0] <= soTu[1] && soTu[1] <= soTu[2], `doc-de4: passage dài dần (${soTu.join(' / ')})`);
  // Matching headings: 7 đoạn A–G, 9 tiêu đề, không tiêu đề nào dùng hai lần.
  const hd = dapAnNhom(DOC_DE4, 'heading');
  assert.equal(new Set(hd).size, 7);
  assert.equal(nhomCuaDe(DOC_DE4).find((g) => g.dang === 'heading')!.hop!.ds.length, 9);
  assert.deepEqual(DOC_DE4.phan[1].doan.map((d) => d.nhan), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  // Summary hộp từ + sentence endings: mỗi chữ một lần; chọn TWO: hai đáp án khác nhau, cùng khai ở cả hai câu.
  for (const dang of ['summary-box', 'match-ending'] as const) { const ds = dapAnNhom(DOC_DE4, dang); assert.equal(new Set(ds).size, ds.length, `doc-de4 ${dang}: mỗi chữ một lần`); }
  const m2 = nhomCuaDe(DOC_DE4).find((g) => g.dang === 'mcq2')!;
  for (const n of m2.nhieu!.ns) assert.deepEqual(DOC_DE4.dapAn[n].a, ['B', 'D']);
  // Listening: Part 1 giọng Mỹ (cả hai người), Part 3 ba người nói, Part 4 giọng Canada (mục 4.2).
  const giong = (so: number) => new Set(NGHE_DE4.phan.find((p) => p.so === so)!.loi.map((l) => l.giong));
  assert.deepEqual([...giong(1)].sort(), ['us-nam', 'us-nu']);
  assert.equal(new Set(NGHE_DE4.phan.find((p) => p.so === 3)!.loi.map((l) => l.ai)).size, 3, 'nghe-de4 Part 3: ba người nói');
  assert.ok([...giong(4)].every((g) => g.startsWith('ca-')), 'nghe-de4 Part 4: giọng Canada');
  // Bản đồ: mọi chữ trong hộp đều có trên hình; đáp án trỏ tới chữ có thật.
  const map = nhomCuaDe(NGHE_DE4).find((g) => g.dang === 'map')!;
  assert.deepEqual(map.hinh!.ve.filter((v) => v.t === 'chu').map((v) => (v as { k: string }).k).sort(), map.hop!.ds.map((o) => o.k).sort());
  // Writing: Task 1 table (mỗi cột cộng 100%), Task 2 Problem–solution (hai câu hỏi).
  const fig = VIET_DE4.task[0].figure!;
  assert.equal(fig.kind, 'table');
  for (const c of fig.series!) assert.equal(c.values.length, fig.categories!.length, `viet-de4: hàng ${c.name} đủ số cột`);
  fig.categories!.forEach((nam, i) => assert.equal(fig.series!.reduce((a, c) => a + c.values[i], 0), 100, `viet-de4: cột ${nam} cộng 100%`));
  assert.match(VIET_DE4.task[1].de, /What problems does this cause[\s\S]+What solutions can you suggest\?/);
  kiemVietNoi(VIET_DE4, NOI_DE4);
  // Speaking: chủ đề theo mục 4.2 (Shopping, Technology · Describe a skill) + một câu giả định ở Part 3 (T3 N15).
  assert.deepEqual(NOI_DE4.part1.map((c) => c.chuDe), ['Shopping', 'Technology']);
  assert.match(NOI_DE4.part2.cueCard, /^Describe a skill /);
  assert.ok(NOI_DE4.part3.flatMap((c) => c.cau).some((c) => /^What would happen if /.test(c)), 'noi-de4 Part 3: có câu giả định');
});

/* ── Đề 5 (thi cuối Tập 3, sau Ngày 30, band 6.0) — soạn 18/11/2026 ─────────── */
test('Đề 5 Reading (doc-de5): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE5));
test('Đề 5 Listening (nghe-de5): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE5));

test('Đề 5 (thi cuối Tập 3 · sau Ngày 30): phủ dạng nửa sau Tập 3, phân bố đáp án, Writing process + Two-part, Speaking đủ khuôn', () => {
  for (const de of [DOC_DE5, NGHE_DE5]) for (const g of nhomCuaDe(de)) assert.ok(BAI_ON[g.dang].length > 0, `${de.id} ${g.id}: dạng ${g.dang} chưa có bài ôn`);
  // Reading: các dạng Tập 3 Ngày 16–30 phải có mặt (N17 diagram · N19 matching information · N21 matching features · N23 YNNG ·
  // N25 summary từ trong bài + sentence completion) + TFNG, MCQ; tổng ≥ 8 dạng. Cùng Đề 4, hai đề liền nhau phủ ≥ 14/16 dạng.
  for (const d of ['tfng', 'sentence', 'diagram', 'match-info', 'match-feature', 'summary', 'ynng', 'mcq', 'match-ending'] as const) assert.ok(nhomCuaDe(DOC_DE5).some((g) => g.dang === d), `doc-de5 thiếu dạng ${d}`);
  assert.ok(new Set(nhomCuaDe(DOC_DE5).map((g) => g.dang)).size >= 8, 'doc-de5: ≥ 8 dạng');
  assert.ok(new Set([DOC_DE4, DOC_DE5].flatMap((d) => nhomCuaDe(d).map((g) => g.dang))).size >= 14, 'Đề 4 + Đề 5 Reading: ≥ 14 dạng');
  // Listening: form + short (N16, N28) · MCQ + plan (N4, N12) · matching + chọn TWO (N17, N20) · note + flow-chart (N13, N17); ≥ 8 dạng.
  for (const d of ['form', 'short', 'mcq', 'map', 'match-feature', 'mcq2', 'note', 'flow'] as const) assert.ok(nhomCuaDe(NGHE_DE5).some((g) => g.dang === d), `nghe-de5 thiếu dạng ${d}`);
  kiemPhanBo(DOC_DE5, NGHE_DE5);
  // Độ dài passage theo mục 4.1 / 4.2 (Passage 3 ~900 từ): dài dần, Passage 3 trong khoảng 850–950 từ.
  const soTu = DOC_DE5.phan.map((p) => p.doan.map((d) => d.s).join(' ').split(/\s+/).length);
  assert.ok(soTu[2] >= 850 && soTu[2] <= 950, `doc-de5 Passage 3 có ${soTu[2]} từ (cần 850–950)`);
  assert.ok(soTu[0] <= soTu[1] && soTu[1] <= soTu[2], `doc-de5: passage dài dần (${soTu.join(' / ')})`);
  // Matching information: 7 đoạn A–G, 5 câu trỏ tới 5 đoạn khác nhau; matching features + sentence endings: mỗi chữ một lần.
  assert.deepEqual(DOC_DE5.phan[1].doan.map((d) => d.nhan), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  for (const dang of ['match-info', 'match-feature', 'match-ending'] as const) { const ds = dapAnNhom(DOC_DE5, dang); assert.equal(new Set(ds).size, ds.length, `doc-de5 ${dang}: mỗi chữ một lần`); }
  // Diagram: mỗi ô số trên hình đúng một lần, đáp án một từ lấy từ bài.
  const dg = nhomCuaDe(DOC_DE5).find((g) => g.dang === 'diagram')!;
  assert.deepEqual(dg.hinh!.ve.filter((v) => v.t === 'o').map((v) => (v as { n: number }).n).sort((a, b) => a - b), [10, 11, 12, 13]);
  // Listening: chọn TWO — hai đáp án khác nhau, cùng khai ở cả hai câu; Part 1 có giọng Úc, Part 3 ba người nói ba giọng, Part 4 giọng New Zealand (mục 4.2).
  const m2 = nhomCuaDe(NGHE_DE5).find((g) => g.dang === 'mcq2')!;
  for (const n of m2.nhieu!.ns) assert.deepEqual(NGHE_DE5.dapAn[n].a, ['A', 'C']);
  const giong = (so: number) => new Set(NGHE_DE5.phan.find((p) => p.so === so)!.loi.map((l) => l.giong));
  assert.deepEqual([...giong(1)].sort(), ['au-nu', 'uk-nam']);
  assert.equal(new Set(NGHE_DE5.phan.find((p) => p.so === 3)!.loi.map((l) => l.ai)).size, 3, 'nghe-de5 Part 3: ba người nói');
  assert.equal(giong(3).size, 3, 'nghe-de5 Part 3: ba giọng khác nhau');
  assert.ok([...giong(4)].every((g) => g.startsWith('nz-')), 'nghe-de5 Part 4: giọng New Zealand');
  assert.ok(new Set(NGHE_DE5.phan.flatMap((p) => p.loi.map((l) => l.giong))).size >= 5, 'nghe-de5: ít nhất 5 giọng');
  // Sơ đồ tầng: mọi chữ trong hộp đều có trên hình.
  const map = nhomCuaDe(NGHE_DE5).find((g) => g.dang === 'map')!;
  assert.deepEqual(map.hinh!.ve.filter((v) => v.t === 'chu').map((v) => (v as { k: string }).k).sort(), map.hop!.ds.map((o) => o.k).sort());
  // Tốc độ ~150–160 wpm: lời thoại dài hơn Đề 4 không đáng kể nhưng phải đủ dày (≥ 2.300 từ cả đề).
  const tuNghe = NGHE_DE5.phan.flatMap((p) => p.loi.map((l) => l.s)).join(' ').split(/\s+/).length;
  assert.ok(tuNghe >= 2300, `nghe-de5: lời thoại ${tuNghe} từ`);
  // Writing: Task 1 process (≥ 6 bước, mỗi bước có nhãn + ghi chú), Task 2 Two-part question (hai câu hỏi khác loại).
  const fig = VIET_DE5.task[0].figure!;
  assert.equal(fig.kind, 'process');
  assert.ok(fig.steps!.length >= 6 && fig.steps!.every((b) => b.label && b.note), 'viet-de5: quy trình đủ bước, bước nào cũng có ghi chú');
  assert.match(VIET_DE5.task[1].de, /Why do you think this is happening\? Is this a positive or a negative development\?/);
  kiemVietNoi(VIET_DE5, NOI_DE5);
  // Speaking: chủ đề theo mục 4.2 (Music, Sleep · Describe a change) + câu tường thuật (T3 N19), đánh giá (N23), giả định (N15) ở Part 3.
  assert.deepEqual(NOI_DE5.part1.map((c) => c.chuDe), ['Music', 'Sleep']);
  assert.match(NOI_DE5.part2.cueCard, /^Describe a positive change /);
  const p3 = NOI_DE5.part3.flatMap((c) => c.cau);
  for (const re of [/^Some people say that /, /^Is it a good thing that /, /^What would happen if /]) assert.ok(p3.some((c) => re.test(c)), `noi-de5 Part 3: thiếu câu dạng ${re}`);
});

test('Đề 7 Reading (doc-de7): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE7));
test('Đề 7 Listening (nghe-de7): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE7));

test('Đề 7 (giữa Tập 4 · sau Ngày 15): dạng Tập 4 N1–15 + table/flow/short, phân bố đáp án, Writing line nhiều đường + Opinion, Speaking đủ khuôn', () => {
  for (const de of [DOC_DE7, NGHE_DE7]) for (const g of nhomCuaDe(de)) assert.ok(BAI_ON[g.dang].length > 0, `${de.id} ${g.id}: dạng ${g.dang} chưa có bài ôn`);
  // Reading: dạng Tập 4 Ngày 1–15 (N3 headings · N5 TFNG/YNNG · N7 MCQ một + nhiều đáp án · N15 sentence endings) + ba dạng mà
  // Đề 5 và Đề 6 chưa có (table, flow, short) ⇒ ba đề liền nhau (5 · 6 · 7) phủ đủ 16 dạng của Reading.
  for (const d of ['tfng', 'table', 'short', 'heading', 'flow', 'mcq2', 'ynng', 'mcq', 'match-ending'] as const) assert.ok(nhomCuaDe(DOC_DE7).some((g) => g.dang === d), `doc-de7 thiếu dạng ${d}`);
  assert.ok(new Set(nhomCuaDe(DOC_DE7).map((g) => g.dang)).size >= 8, 'doc-de7: ≥ 8 dạng');
  assert.equal(new Set([DOC_DE5, DOC_01, DOC_DE7].flatMap((d) => nhomCuaDe(d).map((g) => g.dang))).size, 16, 'Đề 5 + Đề 6 + Đề 7 Reading: đủ 16 dạng');
  // Listening: form + table (N1, N9) · MCQ + plan hai tầng (N4, N9) · MCQ + matching 4 người + chọn TWO (N5, N12) · note + summary (N8, N13).
  for (const d of ['form', 'table', 'mcq', 'map', 'match-feature', 'mcq2', 'note', 'summary'] as const) assert.ok(nhomCuaDe(NGHE_DE7).some((g) => g.dang === d), `nghe-de7 thiếu dạng ${d}`);
  kiemPhanBo(DOC_DE7, NGHE_DE7);
  // Độ dài passage theo mục 4.1 (~700 / 800 / 900 từ): dài dần, Passage 1 ≥ 700, Passage 3 trong khoảng 850–950 từ.
  const soTu = DOC_DE7.phan.map((p) => p.doan.map((d) => d.s).join(' ').split(/\s+/).length);
  assert.ok(soTu[0] >= 700, `doc-de7 Passage 1 có ${soTu[0]} từ (cần ≥ 700)`);
  assert.ok(soTu[2] >= 850 && soTu[2] <= 950, `doc-de7 Passage 3 có ${soTu[2]} từ (cần 850–950)`);
  assert.ok(soTu[0] <= soTu[1] && soTu[1] <= soTu[2], `doc-de7: passage dài dần (${soTu.join(' / ')})`);
  // Matching headings: 7 đoạn A–G, 10 tiêu đề (3 tiêu đề nhiễu), mỗi tiêu đề dùng tối đa một lần; sentence endings mỗi chữ một lần.
  assert.deepEqual(DOC_DE7.phan[1].doan.map((d) => d.nhan), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.equal(nhomCuaDe(DOC_DE7).find((g) => g.dang === 'heading')!.hop!.ds.length, 10);
  for (const dang of ['heading', 'match-ending'] as const) { const ds = dapAnNhom(DOC_DE7, dang); assert.equal(new Set(ds).size, ds.length, `doc-de7 ${dang}: mỗi chữ một lần`); }
  // Chọn TWO (Reading + Listening): hai đáp án khác nhau, cùng khai ở cả hai câu.
  const m2Doc = nhomCuaDe(DOC_DE7).find((g) => g.dang === 'mcq2')!;
  for (const n of m2Doc.nhieu!.ns) assert.deepEqual(DOC_DE7.dapAn[n].a, ['C', 'E']);
  const m2 = nhomCuaDe(NGHE_DE7).find((g) => g.dang === 'mcq2')!;
  for (const n of m2.nhieu!.ns) assert.deepEqual(NGHE_DE7.dapAn[n].a, ['B', 'E']);
  // Giọng: Part 1 Mỹ + New Zealand; Part 3 BỐN người nói bốn giọng (mục 4.2: "4 người đánh giá đồ án"); Part 4 giọng Ireland
  // (bảng 4.2 ghi Scotland nhưng không có giọng máy Scotland ⇒ dùng `ie-*`, không giả giọng); cả đề ≥ 6 giọng.
  const giong = (so: number) => new Set(NGHE_DE7.phan.find((p) => p.so === so)!.loi.map((l) => l.giong));
  assert.deepEqual([...giong(1)].sort(), ['nz-nam', 'us-nu']);
  assert.equal(new Set(NGHE_DE7.phan.find((p) => p.so === 3)!.loi.map((l) => l.ai)).size, 4, 'nghe-de7 Part 3: bốn người nói');
  assert.equal(giong(3).size, 4, 'nghe-de7 Part 3: bốn giọng khác nhau');
  assert.equal(nhomCuaDe(NGHE_DE7).find((g) => g.dang === 'match-feature')!.cau!.length, 4, 'nghe-de7 matching: mỗi người một câu');
  assert.ok([...giong(4)].every((g) => g.startsWith('ie-')), 'nghe-de7 Part 4: giọng Ireland');
  assert.ok(new Set(NGHE_DE7.phan.flatMap((p) => p.loi.map((l) => l.giong))).size >= 6, 'nghe-de7: ít nhất 6 giọng');
  // Sơ đồ HAI tầng: mọi chữ trong hộp đều có trên hình, hình ghi rõ hai tầng, có đáp án ở cả hai tầng.
  const map = nhomCuaDe(NGHE_DE7).find((g) => g.dang === 'map')!;
  assert.deepEqual(map.hinh!.ve.filter((v) => v.t === 'chu').map((v) => (v as { k: string }).k).sort(), map.hop!.ds.map((o) => o.k).sort());
  const chuTang = map.hinh!.ve.filter((v) => v.t === 'text').map((v) => (v as { s: string }).s);
  assert.ok(chuTang.includes('GROUND FLOOR') && chuTang.includes('FIRST FLOOR'), 'nghe-de7: sơ đồ ghi hai tầng');
  const xChu = (k: string) => (map.hinh!.ve.find((v) => v.t === 'chu' && (v as { k: string }).k === k) as { x: number }).x;
  const tang = dapAnNhom(NGHE_DE7, 'map').map((k) => (xChu(k) < map.hinh!.w / 2 ? 0 : 1));
  assert.ok(tang.includes(0) && tang.includes(1), 'nghe-de7: câu sơ đồ rải ở cả hai tầng');
  // Tốc độ ~165 wpm (mục 4.2, Đề 7–9): lời thoại dày hơn Đề 5 (≥ 2.700 từ cả đề, và nhiều hơn Đề 5).
  const tu = (de: DeNghe) => de.phan.flatMap((p) => p.loi.map((l) => l.s)).join(' ').split(/\s+/).length;
  assert.ok(tu(NGHE_DE7) >= 2700 && tu(NGHE_DE7) > tu(NGHE_DE5), `nghe-de7: lời thoại ${tu(NGHE_DE7)} từ`);
  // Writing: Task 1 line NHIỀU đường (≥ 4 đường, mỗi đường đủ số theo trục), Task 2 Opinion "To what extent…".
  const fig = VIET_DE7.task[0].figure!;
  assert.equal(fig.kind, 'line');
  assert.ok(fig.series!.length >= 4 && fig.series!.every((c) => c.values.length === fig.categories!.length), 'viet-de7: ≥ 4 đường, đủ số theo trục');
  for (const c of fig.series!) for (const [i, v] of c.values.entries()) assert.ok(VIET_DE7.task[0].moTaSo!.includes(`${fig.categories![i]} ${v}%`), `viet-de7: moTaSo thiếu ${c.name} ${fig.categories![i]} ${v}%`);
  assert.match(VIET_DE7.task[1].de, /To what extent do you agree or disagree\?/);
  kiemVietNoi(VIET_DE7, NOI_DE7);
  // Speaking: chủ đề theo mục 4.2 (Books, Time management · Describe a rule) + Part 3 có câu nguyên nhân (T4 N15), mức độ (N11), dự đoán (N7).
  assert.deepEqual(NOI_DE7.part1.map((c) => c.chuDe), ['Books', 'Time management']);
  assert.match(NOI_DE7.part2.cueCard, /^Describe a rule /);
  const p3 = NOI_DE7.part3.flatMap((c) => c.cau);
  for (const re of [/^Why do some /, /^To what extent /, /^How do you think .+ will change in the future\?$/]) assert.ok(p3.some((c) => re.test(c)), `noi-de7 Part 3: thiếu câu dạng ${re}`);
});

test('Đề 8 Reading (doc-de8): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(DOC_DE8));
test('Đề 8 Listening (nghe-de8): 40 câu, đáp án + bằng chứng nguyên văn hợp lệ', () => kiemDe(NGHE_DE8));

test('Đề 8 (thi cuối Tập 4 · sau Ngày 30): phủ dạng nửa sau Tập 4, khó hơn Đề 7, phân bố đáp án, Writing mixed + Advantages/disadvantages, Speaking đủ khuôn', () => {
  for (const de of [DOC_DE8, NGHE_DE8]) for (const g of nhomCuaDe(de)) assert.ok(BAI_ON[g.dang].length > 0, `${de.id} ${g.id}: dạng ${g.dang} chưa có bài ôn`);
  // Reading: dạng nửa sau Tập 4 (N19 matching information · N23 matching features · N25 summary hộp từ + từ trong bài) + dạng chủ lực
  // (N3 headings · N5 TFNG/YNNG · N7 MCQ · N15 sentence endings); ≥ 9 dạng. Đề 6 + Đề 7 + Đề 8 (ba đề Tập 4) phủ đủ 16 dạng.
  for (const d of ['match-info', 'tfng', 'summary', 'heading', 'match-feature', 'summary-box', 'ynng', 'mcq', 'match-ending'] as const) assert.ok(nhomCuaDe(DOC_DE8).some((g) => g.dang === d), `doc-de8 thiếu dạng ${d}`);
  assert.ok(new Set(nhomCuaDe(DOC_DE8).map((g) => g.dang)).size >= 9, 'doc-de8: ≥ 9 dạng');
  assert.equal(new Set([DOC_01, DOC_DE7, DOC_DE8].flatMap((d) => nhomCuaDe(d).map((g) => g.dang))).size, 16, 'Đề 6 + Đề 7 + Đề 8 Reading: đủ 16 dạng');
  // Listening: form + sentence (N1, N21) · MCQ + map theo la bàn (N4, N16) · MCQ + chọn TWO + matching (N5, N12, N28) · note + table (N8, N13, N20).
  for (const d of ['form', 'sentence', 'mcq', 'map', 'mcq2', 'match-feature', 'note', 'table'] as const) assert.ok(nhomCuaDe(NGHE_DE8).some((g) => g.dang === d), `nghe-de8 thiếu dạng ${d}`);
  kiemPhanBo(DOC_DE8, NGHE_DE8);
  // Độ dài passage (mục 4.1, band 7.0): dài dần, mỗi passage ≥ passage cùng số của Đề 7, Passage 3 lập luận ~950 từ (900–980).
  const soTu = (de: DeDoc) => de.phan.map((p) => p.doan.map((d) => d.s).join(' ').split(/\s+/).length);
  const tu8 = soTu(DOC_DE8), tu7 = soTu(DOC_DE7);
  assert.ok(tu8[2] >= 900 && tu8[2] <= 980, `doc-de8 Passage 3 có ${tu8[2]} từ (cần 900–980)`);
  assert.ok(tu8[0] <= tu8[1] && tu8[1] <= tu8[2], `doc-de8: passage dài dần (${tu8.join(' / ')})`);
  for (let i = 0; i < 3; i++) assert.ok(tu8[i] >= tu7[i], `doc-de8 Passage ${i + 1} (${tu8[i]} từ) phải dài ≥ Đề 7 (${tu7[i]})`);
  // Matching information: 6 đoạn A–F ở Passage 1, mỗi câu một đoạn khác nhau; headings: 7 đoạn A–G, 10 tiêu đề, đáp án không theo
  // thứ tự i, ii, iii…; matching features + sentence endings: mỗi chữ một lần.
  assert.deepEqual(DOC_DE8.phan[0].doan.map((d) => d.nhan), ['A', 'B', 'C', 'D', 'E', 'F']);
  assert.deepEqual(DOC_DE8.phan[1].doan.map((d) => d.nhan), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.equal(nhomCuaDe(DOC_DE8).find((g) => g.dang === 'heading')!.hop!.ds.length, 10);
  for (const dang of ['match-info', 'heading', 'match-feature', 'match-ending', 'summary-box'] as const) { const ds = dapAnNhom(DOC_DE8, dang); assert.equal(new Set(ds).size, ds.length, `doc-de8 ${dang}: mỗi chữ một lần`); }
  const la = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  const tieuDe = dapAnNhom(DOC_DE8, 'heading');
  assert.ok(tieuDe.some((k, i) => k !== la[i]), 'doc-de8 headings: đáp án không được xếp i, ii, iii… theo thứ tự đoạn');
  // Listening: chọn TWO — hai đáp án khác nhau, cùng khai ở cả hai câu.
  const m2 = nhomCuaDe(NGHE_DE8).find((g) => g.dang === 'mcq2')!;
  for (const n of m2.nhieu!.ns) assert.deepEqual(NGHE_DE8.dapAn[n].a, ['B', 'E']);
  // Giọng (mục 4.2: "chuyển nhà (giọng Ireland)"): Part 1 có giọng Ireland THẬT; Part 3 sinh viên + người hướng dẫn hai giọng;
  // Part 4 giọng New Zealand; cả đề ≥ 6 giọng.
  const giong = (so: number) => new Set(NGHE_DE8.phan.find((p) => p.so === so)!.loi.map((l) => l.giong));
  assert.deepEqual([...giong(1)].sort(), ['ie-nam', 'uk-nu']);
  assert.equal(giong(3).size, 2, 'nghe-de8 Part 3: hai người nói hai giọng');
  assert.equal(nhomCuaDe(NGHE_DE8).find((g) => g.dang === 'match-feature')!.cau!.length, 4, 'nghe-de8 matching: bốn chương');
  assert.ok([...giong(4)].every((g) => g.startsWith('nz-')), 'nghe-de8 Part 4: giọng New Zealand');
  assert.ok(new Set(NGHE_DE8.phan.flatMap((p) => p.loi.map((l) => l.giong))).size >= 6, 'nghe-de8: ít nhất 6 giọng');
  // Bản đồ theo la bàn: mọi chữ trong hộp có trên hình, hình có chữ "N" (hướng bắc), 3 chữ nhiễu không phải đáp án.
  const map = nhomCuaDe(NGHE_DE8).find((g) => g.dang === 'map')!;
  assert.deepEqual(map.hinh!.ve.filter((v) => v.t === 'chu').map((v) => (v as { k: string }).k).sort(), map.hop!.ds.map((o) => o.k).sort());
  assert.ok(map.hinh!.ve.some((v) => v.t === 'text' && (v as { s: string }).s === 'N'), 'nghe-de8: bản đồ có mũi tên hướng bắc');
  assert.equal(map.hop!.ds.length - dapAnNhom(NGHE_DE8, 'map').length, 3, 'nghe-de8 map: 3 chữ nhiễu');
  // Tốc độ ~165 wpm (Đề 7–9) nhưng đề CUỐI tập dày hơn Đề 7: lời thoại > Đề 7, Part 4 ≥ 850 từ (~5 phút).
  const tu = (de: DeNghe) => de.phan.flatMap((p) => p.loi.map((l) => l.s)).join(' ').split(/\s+/).length;
  assert.ok(tu(NGHE_DE8) >= 3000 && tu(NGHE_DE8) > tu(NGHE_DE7), `nghe-de8: lời thoại ${tu(NGHE_DE8)} từ (Đề 7: ${tu(NGHE_DE7)})`);
  const p4 = NGHE_DE8.phan.find((p) => p.so === 4)!.loi.map((l) => l.s).join(' ').split(/\s+/).length;
  assert.ok(p4 >= 850, `nghe-de8 Part 4: ${p4} từ`);
  // Writing: Task 1 MIXED = bar (≥ 2 chuỗi, đủ số theo trục) + pie (cộng 100%), mọi số có trong moTaSo; Task 2 "outweigh".
  const t1 = VIET_DE8.task[0];
  assert.equal(t1.figure!.kind, 'bar');
  assert.equal(t1.figure2!.kind, 'pie');
  const bar = t1.figure!;
  assert.ok(bar.series!.length >= 2 && bar.series!.every((c) => c.values.length === bar.categories!.length), 'viet-de8: cột đủ số theo trục');
  for (const [i, cat] of bar.categories!.entries()) assert.ok(t1.moTaSo!.includes(`${cat} ${bar.series![0].name} ${bar.series![0].values[i]}, ${bar.series![1].name} ${bar.series![1].values[i]}`), `viet-de8: moTaSo thiếu số của ${cat}`);
  assert.equal(t1.figure2!.slices!.reduce((a, b) => a + b.value, 0), 100, 'viet-de8: hình tròn cộng đủ 100%');
  for (const sl of t1.figure2!.slices!) assert.ok(t1.moTaSo!.includes(`${sl.label} ${sl.value}%`), `viet-de8: moTaSo thiếu ${sl.label} ${sl.value}%`);
  assert.match(VIET_DE8.task[1].de, /Do the advantages of this outweigh the disadvantages\?/);
  kiemVietNoi(VIET_DE8, NOI_DE8);
  // Bài mẫu cố ý giữ 2 lỗi: câu sai phải có thật trong bài mẫu (sửa bài thì sửa phân tích).
  assert.ok(t1.mau.s.includes('had increased with 86,000') && t1.mau.s.includes('the amount of students'), 'viet-de8 Task 1: 2 lỗi soi');
  assert.ok(VIET_DE8.task[1].mau.s.includes('an experience of work') && VIET_DE8.task[1].mau.s.includes('Despite of'), 'viet-de8 Task 2: 2 lỗi soi');
  // Speaking: chủ đề theo mục 4.2 (Plants, Noise · Describe a piece of advice) + Part 3 có nguyên nhân (T4 N15), đạo đức (N23),
  // giả định (N19), dự đoán (N7).
  assert.deepEqual(NOI_DE8.part1.map((c) => c.chuDe), ['Plants', 'Noise']);
  assert.match(NOI_DE8.part2.cueCard, /^Describe a piece of advice /);
  const p3 = NOI_DE8.part3.flatMap((c) => c.cau);
  for (const re of [/^Why do some /, /^Is it ever /, /^What would happen if /, /^Do you think .+ in the future\?$/]) assert.ok(p3.some((c) => re.test(c)), `noi-de8 Part 3: thiếu câu dạng ${re}`);
});

test('đề Writing 01 + mục lục khớp nội dung', () => {
  assert.equal(VIET_01.task.length, 2);
  for (const t of VIET_01.task) assert.ok(t.mau.s.split(/\s+/).length >= t.minTu, `bài mẫu Task ${t.so} đủ ${t.minTu} từ`);
  const bd = VIET_01.task[0].bieuDo;
  if (bd?.loai === 'cot') for (let i = 0; i < bd.chuoi.length; i++) assert.equal(bd.chuoi[i].so.reduce((a, b) => a + b, 0), 100);
  // Đề 0 (sangloc-00, nghe-00, doc-00, viet-00, noi-00) sẽ nối vào đầu khi phiên soạn đề xong — ba đề của Đề 6 phải luôn có.
  for (const id of ['doc-01', 'nghe-01', 'viet-01']) assert.ok(MUC_LUC.some((m) => m.id === id) && coDe(id), `${id} có trong mục lục + tải được`);
  for (const m of MUC_LUC) assert.ok(coDe(m.id), `${m.id}: có trong MUC_LUC thì phải có tệp đề (TEP_DE)`);
  // Dạng câu khai trên thẻ đề khớp nội dung đề thật.
  const dangThat = (de: DeDoc | DeNghe) => new Set(nhomCuaDe(de).map((g) => g.dang));
  for (const [id, de] of [['doc-01', DOC_01], ['nghe-01', NGHE_01], ['doc-00', DOC_00], ['nghe-00', NGHE_00], ['doc-de1', DOC_DE1], ['nghe-de1', NGHE_DE1], ['doc-de2', DOC_DE2], ['nghe-de2', NGHE_DE2], ['doc-de3', DOC_DE3], ['nghe-de3', NGHE_DE3], ['doc-de4', DOC_DE4], ['nghe-de4', NGHE_DE4], ['doc-de5', DOC_DE5], ['nghe-de5', NGHE_DE5], ['doc-de7', DOC_DE7], ['nghe-de7', NGHE_DE7], ['doc-de8', DOC_DE8], ['nghe-de8', NGHE_DE8]] as const) {
    const m = MUC_LUC.find((x) => x.id === id)!;
    assert.deepEqual(new Set(m.dang ?? []), dangThat(de), `${id}: MUC_LUC.dang khớp đề`);
  }
  for (const p of DOC_01.phan) assert.ok(p.doan.map((d) => d.s).join(' ').split(/\s+/).length >= 550, `passage ${p.so} đủ dài`);
});


/* ── 12/11/2026: đồng hồ "minutes left", band tổng, bộ đề, bài ôn theo dạng ─────────── */
test('đồng hồ kiểu CDT: "34 minutes left", dưới 1 phút đếm giây, phút làm tròn lên', () => {
  assert.equal(conChu(34 * 60), '34 minutes left');
  assert.equal(conChu(33 * 60 + 1), '34 minutes left');
  assert.equal(conChu(60), '1 minute left');
  assert.equal(conChu(59), '59 seconds left');
  assert.equal(conChu(1), '1 second left');
  assert.equal(conChu(0), '0 seconds left');
});

test('band tổng (mục 1.5): .25 → .5, .75 → lên nguyên, .125 → .0, .625 → .5; thiếu Speaking tính 3 kỹ năng', () => {
  assert.equal(lamTronBand(6.25), 6.5);
  assert.equal(lamTronBand(6.75), 7);
  assert.equal(lamTronBand(6.125), 6);
  assert.equal(lamTronBand(6.625), 6.5);
  assert.deepEqual(bandTong({ nghe: 6.5, doc: 6.5, viet: 5, noi: 7 }), { band: 6.5, soKy: 4 });
  assert.deepEqual(bandTong({ nghe: 7, doc: 7.5, viet: 6.5 }), { band: 7, soKy: 3 });
  assert.deepEqual(bandTong({ nghe: null, doc: undefined }), null);
});

test('bộ đề: Đề 6 = nghe-01/doc-01/viet-01/noi-06, Đề 1 = bộ -de1; mọi id trong bộ có tệp thì cũng có trong MUC_LUC; tên kỹ năng đủ 5', () => {
  const bo6 = BO_DE.find((b) => b.so === 6)!;
  assert.deepEqual(deCuaBo(bo6).map((d) => d.id), ['nghe-01', 'doc-01', 'viet-01', 'noi-06']);
  const bo1 = BO_DE.find((b) => b.so === 1)!;
  assert.deepEqual(deCuaBo(bo1).map((d) => d.id), ['nghe-de1', 'doc-de1', 'viet-de1', 'noi-de1']);
  const bo2 = BO_DE.find((b) => b.id === 'bo-02')!, bo3 = BO_DE.find((b) => b.id === 'bo-03')!;
  assert.deepEqual([bo2.so, ...deCuaBo(bo2).map((d) => d.id)], [2, 'nghe-de2', 'doc-de2', 'viet-de2', 'noi-de2']);
  assert.deepEqual([bo3.so, ...deCuaBo(bo3).map((d) => d.id)], [3, 'nghe-de3', 'doc-de3', 'viet-de3', 'noi-de3']);
  const bo4 = BO_DE.find((b) => b.id === 'bo-04')!;
  assert.deepEqual([bo4.so, bo4.viTri, ...deCuaBo(bo4).map((d) => d.id)], [4, 'Giữa Tập 3 (sau Ngày 15)', 'nghe-de4', 'doc-de4', 'viet-de4', 'noi-de4']);
  for (const d of deCuaBo(bo4)) assert.ok(coDe(d.id), `bo-04: ${d.id} phải có tệp đề`);
  const bo5 = BO_DE.find((b) => b.id === 'bo-05')!;
  assert.deepEqual([bo5.so, bo5.viTri, bo5.capDo, ...deCuaBo(bo5).map((d) => d.id)], [5, 'Thi cuối Tập 3 (sau Ngày 30)', 'Band 6.0', 'nghe-de5', 'doc-de5', 'viet-de5', 'noi-de5']);
  for (const d of deCuaBo(bo5)) assert.ok(coDe(d.id), `bo-05: ${d.id} phải có tệp đề`);
  const bo7 = BO_DE.find((b) => b.id === 'bo-07')!;
  assert.deepEqual([bo7.so, bo7.viTri, bo7.capDo, ...deCuaBo(bo7).map((d) => d.id)], [7, 'Giữa Tập 4 (sau Ngày 15)', 'Band 6.5', 'nghe-de7', 'doc-de7', 'viet-de7', 'noi-de7']);
  for (const d of deCuaBo(bo7)) assert.ok(coDe(d.id), `bo-07: ${d.id} phải có tệp đề`);
  const bo8 = BO_DE.find((b) => b.id === 'bo-08')!;
  assert.deepEqual([bo8.so, bo8.viTri, bo8.capDo, ...deCuaBo(bo8).map((d) => d.id)], [8, 'Thi cuối Tập 4 (sau Ngày 30)', 'Band 7.0', 'nghe-de8', 'doc-de8', 'viet-de8', 'noi-de8']);
  for (const d of deCuaBo(bo8)) assert.ok(coDe(d.id), `bo-08: ${d.id} phải có tệp đề`);
  assert.equal(BO_DE.findIndex((b) => b.id === 'bo-08'), BO_DE.findIndex((b) => b.id === 'bo-07') + 1, 'bo-08 đứng ngay sau bo-07');
  assert.deepEqual(BO_DE.map((b) => b.so), [0, 1, 2, 3, 4, 5, 6, 7, 8], 'bộ đề xếp theo số đề');
  for (const b of [bo1, bo2, bo3, bo6]) for (const d of deCuaBo(b)) assert.ok(coDe(d.id), `${b.id}: ${d.id} phải có tệp đề`);
  for (const b of BO_DE) for (const d of deCuaBo(b)) if (coDe(d.id)) assert.ok(MUC_LUC.some((m) => m.id === d.id && m.kyNang === d.kyNang), `${b.id}: ${d.id} phải có trong MUC_LUC đúng kỹ năng`);
  assert.deepEqual(Object.keys(TEN_KY_NANG).sort(), ['doc', 'nghe', 'noi', 'sangloc', 'viet']);
});

test('BAI_ON: mỗi id bài ôn theo dạng câu phải có thật trong ngay/manifest.ts (Tập 2: tap-2/ngay/manifest.ts)', () => {
  const taCa = new Set(Object.values(MANIFEST).flatMap((d) => d.lessons.map((l) => l.id)));
  const taCa2 = new Set(Object.values(MANIFEST_T2).flatMap((d) => d.lessons.map((l) => l.id)));
  const taCa3 = new Set(Object.values(MANIFEST_T3).flatMap((d) => d.lessons.map((l) => l.id)));
  const taCa4 = new Set(Object.values(MANIFEST_T4).flatMap((d) => d.lessons.map((l) => l.id)));
  for (const [dang, ids] of Object.entries(BAI_ON)) for (const id of ids) {
    const tap = tapCuaBai(id);
    assert.ok((tap === 4 ? taCa4 : tap === 3 ? taCa3 : tap === 2 ? taCa2 : taCa).has(id), `BAI_ON[${dang}]: ${id} không có trong manifest Tập ${tap}`);
    assert.equal(ngayCuaBai(id), Number(/^(?:t[234])?d(\d+)-/.exec(id)![1]));
  }
  assert.equal(linkBai('d12-doc'), '/language/en/ielts?buoi=12&bai=d12-doc');
  // Tập 2 (12/11/2026): id `t2dN-…` ⇒ trang /tap-2; id Tập 1 không đổi nghĩa.
  assert.equal(tapCuaBai('d12-doc'), 1);
  assert.equal(tapCuaBai('t2d5-nghe'), 2);
  assert.equal(ngayCuaBai('t2d5-nghe'), 5);
  assert.equal(linkBai('t2d5-nghe'), '/language/en/ielts/tap-2?buoi=5&bai=t2d5-nghe');
  // Tập 3 (18/11/2026): id `t3dN-…` ⇒ trang /tap-3.
  assert.equal(tapCuaBai('t3d15-doc'), 3);
  assert.equal(ngayCuaBai('t3d15-doc'), 15);
  assert.equal(linkBai('t3d15-doc'), '/language/en/ielts/tap-3?buoi=15&bai=t3d15-doc');
  assert.equal(linkBai('t4d7-doc'), '/language/en/ielts/tap-4?buoi=7&bai=t4d7-doc');
});
