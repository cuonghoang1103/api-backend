/**
 * Chấm từng dạng câu + duyệt MỌI đề của phòng thi máy tính.
 * Chạy: npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts (đặt ngoài thư mục [code] vì trình chạy test của node hiểu [ ] là glob)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoa, demTu, vuotGioiHan, dungCauGo, chamNhom, bandTuDiem, doanLyDo, dinhDangGio, nhomCuaDe, conChu, lamTronBand, bandTong, BAI_ON, ngayCuaBai, linkBai } from '../../app/language/[code]/ielts/thi-may/cham';
import type { Nhom, DeDoc, DeNghe, DapAn } from '../../app/language/[code]/ielts/thi-may/de/types';
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
import { MUC_LUC, BO_DE, deCuaBo, coDe, TEN_KY_NANG } from '../../app/language/[code]/ielts/thi-may/de/index';
import { MANIFEST } from '../../app/language/[code]/ielts/ngay/manifest';

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
  for (const [id, de] of [['doc-01', DOC_01], ['nghe-01', NGHE_01], ['doc-00', DOC_00], ['nghe-00', NGHE_00], ['doc-de1', DOC_DE1], ['nghe-de1', NGHE_DE1]] as const) {
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
  for (const b of [bo1, bo6]) for (const d of deCuaBo(b)) assert.ok(coDe(d.id), `${b.id}: ${d.id} phải có tệp đề`);
  for (const b of BO_DE) for (const d of deCuaBo(b)) if (coDe(d.id)) assert.ok(MUC_LUC.some((m) => m.id === d.id && m.kyNang === d.kyNang), `${b.id}: ${d.id} phải có trong MUC_LUC đúng kỹ năng`);
  assert.deepEqual(Object.keys(TEN_KY_NANG).sort(), ['doc', 'nghe', 'noi', 'sangloc', 'viet']);
});

test('BAI_ON: mỗi id bài ôn theo dạng câu phải có thật trong ngay/manifest.ts', () => {
  const taCa = new Set(Object.values(MANIFEST).flatMap((d) => d.lessons.map((l) => l.id)));
  for (const [dang, ids] of Object.entries(BAI_ON)) for (const id of ids) {
    assert.ok(taCa.has(id), `BAI_ON[${dang}]: ${id} không có trong manifest`);
    assert.equal(ngayCuaBai(id), Number(/^d(\d+)-/.exec(id)![1]));
  }
  assert.equal(linkBai('d12-doc'), '/language/en/ielts?buoi=12&bai=d12-doc');
});
