/**
 * Máy chấm Code Lab — phần thuần phía máy chủ (đợt Academy 28/10/2026).
 *   npx tsx --test src/services/codeLab.cham.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  bam,
  chamTinh,
  chuanHoaKetQuaClient,
  coMayChamTrinhDuyet,
  dapAnChuan,
  demKiem,
  gradeKindOf,
  testsCongKhai,
  testsDayDu,
  tinhDiem,
} from './codeLab.cham.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Bản sao `tinhDiem` phía frontend — nạp động (đường dẫn biến) để tsc của backend (rootDir ./src) không
// kéo tệp frontend vào; tsx chạy được .ts trực tiếp.
const tepFe = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/src/components/code-lab/cham/diem.ts');
const { tinhDiem: tinhDiemFe } = (await import(tepFe)) as { tinhDiem: typeof tinhDiem };

const dom = {
  loai: 'dom',
  phienBan: 1,
  tepHtml: 'index.html',
  kiem: [
    { moTa: 'có h1', kiem: 'ton-tai', selector: 'h1' },
    { moTa: 'ẩn: đúng một h1', kiem: 'so-luong', selector: 'h1', giaTri: 1, an: true },
    { moTa: 'có title', kiem: 'ton-tai', selector: 'title' },
  ],
};

describe('đếm + công khai', () => {
  it('đếm kiểm và kiểm ẩn', () => {
    assert.deepEqual(demKiem(dom), { tong: 3, an: 1 });
    assert.deepEqual(demKiem(null), { tong: 0, an: 0 });
  });
  it('công khai bỏ kiểm ẩn nhưng giữ chỉ số gốc', () => {
    const c = testsCongKhai(dom, 5)!;
    const kiem = c.kiem as Array<{ i: number; moTa: string }>;
    assert.equal(kiem.length, 2);
    assert.deepEqual(kiem.map((k) => k.i), [0, 2]);
    assert.equal(c.soKiem, 3);
    assert.equal(c.soAn, 1);
  });
  it('đủ giữ mọi kiểm, có chỉ số', () => {
    const d = testsDayDu(dom, 5)!;
    assert.equal((d.kiem as unknown[]).length, 3);
  });
  it('loại chấm: cột thắng tests_json.loai', () => {
    assert.equal(gradeKindOf(dom), 'dom');
    assert.equal(gradeKindOf(dom, 'manual'), 'manual');
    assert.equal(gradeKindOf(null), null);
    assert.equal(coMayChamTrinhDuyet(dom), true);
    assert.equal(coMayChamTrinhDuyet({ loai: 'java', kiem: [{}] }), false);
    assert.equal(coMayChamTrinhDuyet({ loai: 'dom', kiem: [] }), false);
  });
});

const choice = {
  loai: 'choice',
  thangDiem: [{ ma: 'ep', ten: '1. Equivalence partitioning', diem: 2 }],
  cauHoi: [
    { ma: 'q1', de: 'Một?', luaChon: [{ ma: 'a', noiDung: 'A' }, { ma: 'b', noiDung: 'B' }], dapAn: ['b'], nhom: 'ep' },
    { ma: 'q2', de: 'Nhiều?', nhieu: true, luaChon: [{ ma: 'a' }, { ma: 'b' }, { ma: 'c' }], dapAn: [['a', 'c']], nhom: 'ep' },
  ],
};

describe('choice / order / table', () => {
  it('công khai KHÔNG mang đáp án, chỉ băm', () => {
    const c = testsCongKhai(choice, 9)!;
    const s = JSON.stringify(c);
    assert.ok(!s.includes('"dapAn"'));
    const q1 = (c.cauHoi as Array<{ dapAnBam: string[] }>)[0];
    assert.deepEqual(q1.dapAnBam, [bam(9, 'q1', 'b')]);
    const q2 = (c.cauHoi as Array<{ dapAnBam: string[] }>)[1];
    assert.deepEqual(q2.dapAnBam, [bam(9, 'q2', 'a,c')]);
  });
  it('dạng chuẩn: choice không kể thứ tự, order giữ thứ tự, ô bảng gộp khoảng trắng + chữ thường', () => {
    assert.equal(dapAnChuan('choice', ['c', 'a', 'a']), 'a,c');
    assert.equal(dapAnChuan('order', ['c', 'a']), 'c>a');
    assert.equal(dapAnChuan('table', '  Invalid   Age '), 'invalid age');
    assert.equal(dapAnChuan('table', 'X', { phanBietHoa: true }), 'X');
  });
  it('máy chủ chấm lại', () => {
    const kq = chamTinh(choice, { q1: 'b', q2: ['c', 'a'] });
    assert.deepEqual(kq.map((k) => k.dat), [true, true]);
    const sai = chamTinh(choice, { q1: 'a', q2: ['a'] });
    assert.deepEqual(sai.map((k) => k.dat), [false, false]);
    assert.deepEqual(chamTinh(choice, {}).map((k) => k.dat), [false, false]);
  });
  it('bảng: mỗi ô đáp án là một kiểm', () => {
    const table = {
      loai: 'table',
      bang: [{
        ma: 'bva',
        cot: [{ ma: 'gt', ten: 'Giá trị' }, { ma: 'kq', ten: 'Kết quả' }],
        hang: [{ ma: 'r1', o: { gt: '17' } }, { ma: 'r2', o: { gt: '18' } }],
        dapAn: { 'r1.kq': ['Invalid', 'Không hợp lệ'], 'r2.kq': 'Valid' },
      }],
    };
    assert.equal(demKiem(table).tong, 2);
    const kq = chamTinh(table, { 'bva.r1.kq': 'không hợp lệ', 'bva.r2.kq': 'valid ' });
    assert.deepEqual(kq.map((k) => k.dat), [true, true]);
    const c = testsCongKhai(table, 1)!;
    assert.ok(!JSON.stringify(c).includes('Invalid'));
  });
});

describe('kết quả trình duyệt + điểm', () => {
  it('từ chối số kết quả lệch', () => {
    const r = chuanHoaKetQuaClient(dom, [{ dat: true }]);
    assert.ok('loi' in r);
  });
  it('kiểm ẩn không lưu "thấy"', () => {
    const r = chuanHoaKetQuaClient(dom, [{ dat: true, thay: 'a' }, { dat: false, thay: 'lộ' }, { dat: true }]);
    assert.ok('ketQua' in r);
    if ('ketQua' in r) {
      assert.equal(r.ketQua[1].thay, undefined);
      assert.equal(r.ketQua[1].an, true);
      assert.equal(r.ketQua[0].thay, 'a');
    }
  });
  it('phần trăm khi không có thang điểm', () => {
    assert.deepEqual(tinhDiem(dom, [{ dat: true }, { dat: false }, { dat: true }]), { score: 67, maxScore: 100, nhom: [] });
  });
  it('thang điểm theo chức năng, làm tròn 0,25', () => {
    const tj = {
      loai: 'react',
      thangDiem: [{ ma: 'f1', ten: '1. Display', diem: 1.5 }, { ma: 'f2', ten: '2. Search', diem: 1 }],
      kiem: [{ nhom: 'f1' }, { nhom: 'f1' }, { nhom: 'f1' }, { nhom: 'f2' }, {}],
    };
    const kq = [{ dat: true, nhom: 'f1' }, { dat: true, nhom: 'f1' }, { dat: false, nhom: 'f1' }, { dat: true, nhom: 'f2' }, { dat: false, nhom: null }];
    const d = tinhDiem(tj, kq);
    assert.equal(d.nhom[0].diemDat, 1); // 1.5 × 2/3 = 1.0
    assert.equal(d.nhom[1].diemDat, 1);
    assert.equal(d.score, 2);
    assert.equal(d.maxScore, 2.5);
    // bản sao phía frontend phải cho đúng cùng kết quả
    assert.deepEqual(tinhDiemFe(tj, kq), d);
    assert.deepEqual(tinhDiemFe(dom, [{ dat: true }, { dat: false }, { dat: true }]), tinhDiem(dom, [{ dat: true }, { dat: false }, { dat: true }]));
  });
});

describe('máy chấm trình duyệt ↔ máy chấm Node', () => {
  it('HARNESS của frontend là bản sao NGUYÊN VĂN của scripts/codelab-cham-js.mjs', async () => {
    const fs = await import('node:fs');
    const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const lay = (tep: string) => {
      const s = fs.readFileSync(path.join(goc, tep), 'utf8');
      const dau = 'export const HARNESS = String.raw`';
      const a = s.indexOf(dau) + dau.length;
      return s.slice(a, s.indexOf('`;', a));
    };
    const node = lay('scripts/codelab-cham-js.mjs');
    assert.ok(node.length > 1000);
    assert.equal(lay('frontend/src/components/code-lab/cham/harness.ts'), node);
  });
});

describe('băm đáp án: trình duyệt ↔ máy chủ', () => {
  it('chamTinh của frontend (băm sha256 thuần JS) chấm đúng như máy chủ', async () => {
    const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const fe = (await import(path.join(goc, 'frontend/src/components/code-lab/cham/chamTinh.ts'))) as {
      sha256Js: (s: string) => string;
      chamTinh: (id: number, tj: unknown, tl: Record<string, unknown>) => Promise<Array<{ dat: boolean }>>;
    };
    assert.equal(fe.sha256Js('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    assert.equal(fe.sha256Js(`9|q1|b`), bam(9, 'q1', 'b'));
    const pub = testsCongKhai(choice, 9)!;
    const dung = await fe.chamTinh(9, pub, { q1: 'b', q2: ['c', 'a'] });
    assert.deepEqual(dung.map((k) => k.dat), [true, true]);
    const sai = await fe.chamTinh(9, pub, { q1: 'a', q2: ['a', 'b', 'c'] });
    assert.deepEqual(sai.map((k) => k.dat), [false, false]);
    const table = { loai: 'table', bang: [{ ma: 'b', cot: [{ ma: 'x' }, { ma: 'y', phanBietHoa: true }], hang: [{ ma: 'r' }], dapAn: { 'r.x': ['Hợp lệ'], 'r.y': 'ABC' } }] };
    const pt = testsCongKhai(table, 3)!;
    assert.deepEqual((await fe.chamTinh(3, pt, { 'b.r.x': ' hợp  lệ ', 'b.r.y': 'ABC' })).map((k) => k.dat), [true, true]);
    assert.deepEqual((await fe.chamTinh(3, pt, { 'b.r.x': 'x', 'b.r.y': 'abc' })).map((k) => k.dat), [false, false]);
  });
});
