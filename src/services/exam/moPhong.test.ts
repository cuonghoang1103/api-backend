/**
 * Phòng thi mô phỏng — phần thuần. `npx tsx --test src/services/exam/moPhong.test.ts`
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  bocDe, chamPaperFe, chiaTheoTrongSo, chuongTuTieuDe, diemTuCham, idCauQuiz, khuTrung, kiemTenTepZip, locTraLoi,
  quizSangCau, taoRand, thongKe, vanBanSangHtml, type CauNganHang, type PaperFe,
} from './moPhong.js';
import { chuanHoaNhanXetTinh } from '../exam.grading.service.js';
import { cauHinhMon } from './moPhongConfig.js';

const cau = (id: number, nhom: string, extra: Partial<CauNganHang> = {}): CauNganHang => ({
  id, nguon: 'DE_THAT', prompt: `<p>Q${id}</p>`, imageUrl: null,
  options: [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }], correctIndexes: [1], explanation: null,
  nhom, nhomTen: nhom, chuong: null, thuTu: Number(nhom.replace(/\D/g, '')) || 0, ...extra,
});

describe('chuongTuTieuDe', () => {
  it('đọc số chương Academy, bỏ mục không đánh số', () => {
    assert.equal(chuongTuTieuDe('Chapter 12 — Flux Architecture & Redux|||Chương 12 — Kiến trúc Flux & Redux'), 12);
    assert.equal(chuongTuTieuDe('Chương 3 — JSX'), 3);
    assert.equal(chuongTuTieuDe('Section 0 — Introduction'), null);
    assert.equal(chuongTuTieuDe('Progress Test 1 — CLO1–CLO6'), null);
    assert.equal(chuongTuTieuDe('Advanced A1 — React Performance'), null);
  });
});

describe('chiaTheoTrongSo', () => {
  it('chia đúng tổng, theo trọng số', () => {
    const r = chiaTheoTrongSo({ a: 2, b: 1, c: 1 }, { a: 100, b: 100, c: 100 }, 50);
    assert.equal(r.a + r.b + r.c, 50);
    assert.equal(r.a, 25);
    assert.ok(Math.abs(r.b - r.c) <= 1);
  });
  it('nhóm thiếu câu ⇒ phần dư chia lại cho nhóm còn câu', () => {
    const r = chiaTheoTrongSo({ a: 10, b: 1 }, { a: 3, b: 100 }, 20);
    assert.equal(r.a, 3);
    assert.equal(r.b, 17);
  });
  it('tổng sức chứa nhỏ hơn số câu cần ⇒ lấy hết, không vượt', () => {
    const r = chiaTheoTrongSo({ a: 1, b: 1 }, { a: 2, b: 3 }, 50);
    assert.deepEqual(r, { a: 2, b: 3 });
  });
  it('trọng số 0 hết ⇒ chia đều', () => {
    const r = chiaTheoTrongSo({}, { a: 10, b: 10 }, 6);
    assert.deepEqual(r, { a: 3, b: 3 });
  });
});

describe('bocDe', () => {
  const ngan = [
    ...Array.from({ length: 30 }, (_, i) => cau(i + 1, 's1')),
    ...Array.from({ length: 30 }, (_, i) => cau(100 + i, 's2')),
    ...Array.from({ length: 5 }, (_, i) => cau(200 + i, 's3')),
  ];
  it('đủ số câu, không trùng, theo phân bố, lặp lại được với cùng hạt', () => {
    const a = bocDe(ngan, { s1: 3, s2: 1, s3: 1 }, 20, taoRand(7));
    const b = bocDe(ngan, { s1: 3, s2: 1, s3: 1 }, 20, taoRand(7));
    assert.equal(a.cau.length, 20);
    assert.equal(new Set(a.cau.map((c) => c.id)).size, 20);
    assert.deepEqual(a.cau.map((c) => c.id), b.cau.map((c) => c.id));
    assert.deepEqual(a.phanBo, [{ nhom: 's1', ten: 's1', soCau: 12 }, { nhom: 's2', ten: 's2', soCau: 4 }, { nhom: 's3', ten: 's3', soCau: 4 }]);
  });
});

describe('quiz Academy ⇒ câu ngân hàng', () => {
  it('chữ thường được thoát HTML, giữ EN|||VI, kèm khối code', () => {
    const c = quizSangCau(
      { question: 'What does <App /> render?|||<App /> hiện gì?', code: 'const x = 1 < 2;', options: ['<div>', 'null', 'x', 'y'], correctIndex: 0, explanation: 'a\\nb' },
      { idAm: idCauQuiz(12, 3), nhom: 's5', nhomTen: 'Ch', chuong: 5, thuTu: 5 },
    )!;
    assert.equal(c.id, -12004);
    assert.match(c.prompt, /^What does &lt;App \/&gt; render\?<pre><code>const x = 1 &lt; 2;<\/code><\/pre>\|\|\|&lt;App \/&gt; hiện gì\?<pre>/);
    assert.equal(c.options[0].text, '&lt;div&gt;');
    assert.equal(c.explanation, 'a<br>b');
    assert.deepEqual(c.correctIndexes, [0]);
  });
  it('bỏ câu tự luận / đáp án ngoài tầm', () => {
    const m = { idAm: -1, nhom: 's1', nhomTen: '', chuong: 1, thuTu: 1 };
    assert.equal(quizSangCau({ question: 'Essay', sampleAnswer: 'x' }, m), null);
    assert.equal(quizSangCau({ question: 'Q', options: ['a', 'b'], correctIndex: 5 }, m), null);
  });
  it('vanBanSangHtml không để lọt thẻ', () => {
    assert.equal(vanBanSangHtml('<script>x</script>'), '&lt;script&gt;x&lt;/script&gt;');
  });
});

describe('khuTrung', () => {
  it('câu đề thật thắng câu quiz trùng nội dung', () => {
    const q = cau(-5, 's1', { nguon: 'QUIZ', prompt: 'Q1' });
    const t = cau(5, 's2', { prompt: '<p>Q1</p>' });
    const r = khuTrung([q, t]);
    assert.equal(r.length, 1);
    assert.equal(r[0].id, 5);
  });
});

describe('chấm FE + thống kê', () => {
  const paper: PaperFe = {
    loai: 'FE', courseCode: 'FER202', nguonNganHang: 'mix', nguonPhanBo: 'DE_THAT', phanBo: [], thangDiem: 10, diemDat: 4,
    cau: [
      { ...cau(1, 's1'), clo: ['CLO1'], points: 1 },
      { ...cau(2, 's1'), clo: ['CLO1'], points: 1, correctIndexes: [0, 2] },
      { ...cau(3, 's2'), clo: ['CLO3'], points: 1 },
      { ...cau(4, 's2'), clo: ['CLO3'], points: 1 },
    ],
  };
  it('locTraLoi chỉ nhận id có trong đề và chỉ số hợp lệ', () => {
    const r = locTraLoi(paper.cau, { 1: [1, 1, 9], 99: [0], 2: 'x', 3: [-1, 2] });
    assert.deepEqual(r, { 1: [1], 3: [2] });
  });
  it('chọn nhiều phải đúng cả tập; điểm quy về thang 10', () => {
    const k = chamPaperFe(paper, { 1: [1], 2: [2, 0], 3: [0] });
    assert.equal(k.correctCount, 2);
    assert.equal(k.score, 5);
    assert.equal(k.passed, true);
  });
  it('thống kê theo chương và CLO', () => {
    const t = thongKe(paper.cau.map((c, i) => ({ nhom: c.nhom, nhomTen: c.nhomTen, thuTu: c.thuTu, clo: c.clo, dung: i < 2 })));
    assert.deepEqual(t.theoChuong.map((x) => [x.khoa, x.dung, x.tong, x.tiLe]), [['s1', 2, 2, 100], ['s2', 0, 2, 0]]);
    assert.deepEqual(t.theoClo.map((x) => [x.khoa, x.tiLe]), [['CLO1', 100], ['CLO3', 0]]);
  });
});

describe('kiểm zip PE', () => {
  it('chặn node_modules, tìm gốc dự án', () => {
    const r = kiemTenTepZip(['bai/resource/package.json', 'bai/resource/src/App.js', 'bai/resource/node_modules/react/index.js']);
    assert.equal(r.loi.length, 1);
    assert.match(r.loi[0], /node_modules/);
    assert.equal(r.goc, 'bai/resource/');
  });
  it('thiếu package.json ⇒ lỗi; có build/ ⇒ cảnh báo', () => {
    assert.equal(kiemTenTepZip(['src/App.js']).loi.length, 1);
    const ok = kiemTenTepZip(['package.json', 'src/App.js', 'build/index.html']);
    assert.equal(ok.loi.length, 0);
    assert.equal(ok.goc, '');
    assert.equal(ok.canhBao.length, 1);
  });
});

describe('tự chấm PE theo rubric', () => {
  it('đạt / một phần / chưa ⇒ điểm từng câu và tổng', () => {
    const r = diemTuCham({
      thangDiem: 10, diemDat: 5,
      cau: [
        { id: 1, prompt: '', points: 4, imageUrl: null, sampleSolution: null, rubric: [{ id: 'c1', criterion: 'x', maxScore: 2 }, { id: 'c2', criterion: 'y', maxScore: 2 }] },
        { id: 2, prompt: '', points: 6, imageUrl: null, sampleSolution: null, rubric: [{ id: 'd1', criterion: 'z', maxScore: 6 }] },
      ],
    }, { 1: { c1: 1, c2: 0.5 }, 2: { d1: 7 } });
    assert.deepEqual(r.theoCau.map((c) => c.diem), [3, 0]);
    assert.equal(r.score, 3);
    assert.equal(r.passed, false);
  });
});

describe('AI nhận xét tĩnh — chuẩn hoá đầu ra', () => {
  it('ánh xạ trạng thái, điểm ƯỚC theo rubric, chịu JSON thiếu', () => {
    const r = chuanHoaNhanXetTinh(
      { summary: 'ok|||ổn', questions: [{ id: 7, criteria: [{ id: 'c1', status: 'yes' }, { id: 'c2', status: 'PARTIAL', comment: 'x' }] }] },
      [{ id: 7, points: 4, rubric: [{ id: 'c1', maxScore: 2 }, { id: 'c2', maxScore: 2 }] }, { id: 8, points: 6, rubric: [] }],
      10,
    );
    assert.deepEqual(r.theoCau.map((c) => c.diemUoc), [3, 0]);
    assert.equal(r.theoCau[0].tieuChi[1].muc, 'mot_phan');
    assert.equal(r.theoCau[1].tieuChi[0].muc, 'khong_ro');
    assert.equal(r.diemUoc, 3);
  });
});

describe('cấu hình FER202', () => {
  it('khớp syllabus: FE 50 câu / 60 phút, đủ CLO1–CLO9, mọi chương 1–12 có CLO', () => {
    const c = cauHinhMon('fer202')!;
    assert.equal(c.fe.soCau, 50);
    assert.equal(c.fe.phut, 60);
    assert.equal(Object.keys(c.cloTen).length, 9);
    for (let i = 1; i <= 12; i++) assert.ok(c.cloTheoChuong[i]?.length, `chương ${i}`);
    for (const ds of Object.values(c.cloTheoChuong)) for (const k of ds) assert.ok(c.cloTen[k], k);
  });
});
