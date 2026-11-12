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
import { MUC_LUC, BO_DE, deCuaBo, coDe, TEN_KY_NANG } from '../../app/language/[code]/ielts/thi-may/de/index';
import { MANIFEST } from '../../app/language/[code]/ielts/ngay/manifest';
import { MANIFEST as MANIFEST_T2 } from '../../app/language/[code]/ielts/tap-2/ngay/manifest';

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
  for (const [id, de] of [['doc-01', DOC_01], ['nghe-01', NGHE_01], ['doc-00', DOC_00], ['nghe-00', NGHE_00], ['doc-de1', DOC_DE1], ['nghe-de1', NGHE_DE1], ['doc-de2', DOC_DE2], ['nghe-de2', NGHE_DE2], ['doc-de3', DOC_DE3], ['nghe-de3', NGHE_DE3]] as const) {
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
  assert.deepEqual(BO_DE.map((b) => b.so), [0, 1, 2, 3, 6], 'bộ đề xếp theo số đề');
  for (const b of [bo1, bo2, bo3, bo6]) for (const d of deCuaBo(b)) assert.ok(coDe(d.id), `${b.id}: ${d.id} phải có tệp đề`);
  for (const b of BO_DE) for (const d of deCuaBo(b)) if (coDe(d.id)) assert.ok(MUC_LUC.some((m) => m.id === d.id && m.kyNang === d.kyNang), `${b.id}: ${d.id} phải có trong MUC_LUC đúng kỹ năng`);
  assert.deepEqual(Object.keys(TEN_KY_NANG).sort(), ['doc', 'nghe', 'noi', 'sangloc', 'viet']);
});

test('BAI_ON: mỗi id bài ôn theo dạng câu phải có thật trong ngay/manifest.ts (Tập 2: tap-2/ngay/manifest.ts)', () => {
  const taCa = new Set(Object.values(MANIFEST).flatMap((d) => d.lessons.map((l) => l.id)));
  const taCa2 = new Set(Object.values(MANIFEST_T2).flatMap((d) => d.lessons.map((l) => l.id)));
  for (const [dang, ids] of Object.entries(BAI_ON)) for (const id of ids) {
    const t2 = tapCuaBai(id) === 2;
    assert.ok((t2 ? taCa2 : taCa).has(id), `BAI_ON[${dang}]: ${id} không có trong manifest ${t2 ? 'Tập 2' : 'Tập 1'}`);
    assert.equal(ngayCuaBai(id), Number(/^(?:t2)?d(\d+)-/.exec(id)![1]));
  }
  assert.equal(linkBai('d12-doc'), '/language/en/ielts?buoi=12&bai=d12-doc');
  // Tập 2 (12/11/2026): id `t2dN-…` ⇒ trang /tap-2; id Tập 1 không đổi nghĩa.
  assert.equal(tapCuaBai('d12-doc'), 1);
  assert.equal(tapCuaBai('t2d5-nghe'), 2);
  assert.equal(ngayCuaBai('t2d5-nghe'), 5);
  assert.equal(linkBai('t2d5-nghe'), '/language/en/ielts/tap-2?buoi=5&bai=t2d5-nghe');
});
