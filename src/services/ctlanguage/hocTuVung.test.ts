/**
 * Mục Học từ vựng — `npx tsx --test src/services/ctlanguage/hocTuVung.test.ts`: chia bài 10–15 từ, mỗi từ đúng MỘT bài
 * (cả hai lộ trình), cấp dễ → khó, gợi ý ngữ pháp là id có thật, bộ bổ sung đọc được (kể cả thư mục trống).
 */
import 'dotenv/config';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CAP_CUA } from './chuDeTuThuan.js';
import { chiTiet } from './nguPhap.js';
import {
  _datKhoHtv, baiHtv, lamSachDoc, chiaDeu, dungKhoHtv, khoHtv, khoaTuHtv, TU_MOI_NGAY, loTrinhHtv, napBoSung, nguonCua, tongQuanHtv, type NhomNguonHtv,
} from './hocTuVung.js';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

test('chiaDeu: tổng đúng, mỗi phần 10–15 khi chia được', () => {
  for (let n = 1; n <= 400; n++) {
    const p = chiaDeu(n);
    assert.equal(p.reduce((a, b) => a + b, 0), n, `n=${n}`);
    if (n >= 20) assert.ok(p.every((x) => x >= 10 && x <= 15), `n=${n}: ${p}`);
    if (n <= 15) assert.equal(p.length, 1);
    if (n > 15 && n < 20) assert.ok(p.length === 2 && p.every((x) => x >= 8 && x <= 10), `n=${n}: ${p}`);
  }
  assert.deepEqual(chiaDeu(0), []);
});

for (const nn of ['en', 'ja', 'zh'] as const) {
  test(`${nn}: hai lộ trình phủ cùng một tập từ, không từ nào lặp, id bài duy nhất, ngữ pháp có thật`, () => {
    const k = khoHtv(nn);
    const caps = CAP_CUA[nn];
    for (const lt of [k.theoCap, k.theoChuDe]) {
      const thay = new Map<string, string>();
      const ids = new Set<string>();
      for (const n of lt.nhom) for (const b of n.bai) {
        assert.ok(!ids.has(b.id), `id trùng ${b.id}`);
        ids.add(b.id);
        assert.match(b.id, new RegExp(`^${nn}-[a-z0-9-]+-\\d+$`));
        assert.ok(b.tu.length >= 1 && b.tu.length <= 15, `${b.id}: ${b.tu.length} từ`);
        if (b.nguPhap) assert.equal(chiTiet(b.nguPhap.id).id, b.nguPhap.id);
        for (const t of b.tu) {
          assert.ok(!thay.has(t.k), `${lt.theo}: "${t.chu}" ở cả ${thay.get(t.k)} và ${b.id}`);
          thay.set(t.k, b.id);
          assert.equal(t.k, khoaTuHtv(nn, t.chu));
          assert.ok(caps.includes(t.cap));
        }
      }
      // Bài < 10 từ: chỉ là bài lẻ cuối của một cấp (tổng hợp) hoặc chủ đề quá ít từ — không quá vài bài.
      const nho = lt.nhom.flatMap((n) => n.bai).filter((b) => b.tu.length < 10);
      assert.ok(nho.length <= lt.nhom.length + 6, `${lt.theo}: ${nho.length} bài < 10 từ`);
    }
    const dem = (lt: typeof k.theoCap) => lt.nhom.reduce((s, n) => s + n.bai.reduce((x, b) => x + b.tu.length, 0), 0);
    // Theo chủ đề = lộ trình chung + nhóm CHUYÊN NGÀNH (`cn-…`, chỉ ở đây, không lặp từ chung).
    const chung = { ...k.theoChuDe, nhom: k.theoChuDe.nhom.filter((n) => !n.ma.startsWith('cn-')) };
    assert.equal(dem(k.theoCap), dem(chung));
    if (nn === 'en') {
      assert.ok(k.theoChuDe.nhom.some((n) => n.ma.startsWith('cn-')), 'en: thiếu nhóm chuyên ngành');
      // Theo ngày: đúng tập từ của theo cấp, id en-ngay-1…N liên tục, mỗi ngày 10–29 từ, chặng theo thứ tự cấp.
      const ngay = k.theoNgay!;
      assert.equal(dem(ngay), dem(k.theoCap));
      const ds = ngay.nhom.flatMap((n) => n.bai);
      ds.forEach((b, i) => { assert.equal(b.id, `en-ngay-${i + 1}`); assert.ok(b.tu.length >= 10 && b.tu.length < 2 * TU_MOI_NGAY, `${b.id}: ${b.tu.length}`); });
      assert.deepEqual(ngay.nhom.map((n) => n.ma), k.theoCap.nhom.map((n) => n.ma));
      assert.equal(k.bai.get('en-ngay-1')!.ke, 'en-ngay-2');
      // Bài theo cấp cũ vẫn mở được theo id.
      assert.ok(k.bai.has(k.theoCap.nhom[0]!.bai[0]!.id));
    } else assert.equal(k.theoNgay, null);
    assert.ok(dem(k.theoCap) > 3000, `${nn}: ${dem(k.theoCap)} từ`);
    // Theo cấp: nhóm đúng thứ tự dễ → khó, mọi từ của nhóm đúng cấp đó.
    const thuTu = k.theoCap.nhom.map((n) => caps.indexOf(n.ma));
    assert.deepEqual(thuTu, [...thuTu].sort((a, b) => a - b));
    for (const n of k.theoCap.nhom) for (const b of n.bai) assert.ok(b.tu.every((t) => t.cap === n.ma), b.id);
    // Đa số bài có gợi ý ngữ pháp (thư viện có điểm ở mọi cấp nn này dùng).
    const tatCa = k.theoCap.nhom.flatMap((n) => n.bai);
    assert.ok(tatCa.filter((b) => b.nguPhap).length / tatCa.length > 0.95);
    // Bài kế / trước nối liền trong cùng lộ trình.
    const dau = k.bai.get(tatCa[0]!.id)!;
    assert.equal(dau.truoc, null);
    assert.equal(dau.ke, tatCa[1]?.id ?? null);
  });
}

test('dungKhoHtv: cấp dễ nhất thắng, từ thiếu cấp ⇒ cấp giữa (ước lượng), bộ bổ sung giữ cumTu/hoTu/ghiChu', () => {
  const tu = (chu: string, cap?: string, i = 0) => ({ chu, nghia: `nghĩa ${chu}`, cap, viDu: `${chu} ${i}` });
  const nguon: NhomNguonHtv[] = [
    { ma: 'a', ten: 'Chủ đề A', moTa: '', bieuTuong: 'star', anh: null, boSung: false,
      tu: [...Array.from({ length: 12 }, (_, i) => tu(`w${i}`, 'A1', i)), tu('Shared', 'B1'), tu('loose')] },
    { ma: 'bs-x', ten: 'IELTS X', moTa: '', bieuTuong: 'star', anh: null, boSung: true,
      tu: [{ ...tu('shared', 'A2'), cumTu: ['shared goal'], hoTu: ['share (v)'], ghiChu: 'dễ nhầm' },
        ...Array.from({ length: 11 }, (_, i) => tu(`c${i}`, 'C1', i))] },
  ];
  const k = dungKhoHtv('en', nguon, [{ id: 'np-a1', tieuDe: 'to be', nghia: 'là', cap: 'A1' }, { id: 'np-b1', tieuDe: 'pp', nghia: '', cap: 'B1' }]);
  const tim = (chu: string) => [...k.bai.values()].filter((b) => b.theo === 'cap').flatMap((b) => b.bai.tu).find((t) => t.chu.toLowerCase() === chu)!;
  assert.equal(tim('shared').cap, 'A2');
  assert.deepEqual(tim('shared').cumTu, ['shared goal']);
  assert.equal(tim('loose').cap, 'B1');
  assert.equal(tim('loose').capUoc, true);
  assert.deepEqual(k.theoCap.nhom.map((n) => n.ma), ['A1', 'A2', 'B1', 'C1']);
  assert.equal(k.theoCap.nhom[0]!.bai[0]!.id, 'en-a1-a-1');
  assert.equal(k.theoCap.nhom[1]!.bai[0]!.id, 'en-a2-tong-hop-1');
  assert.equal(k.theoCap.nhom[0]!.bai[0]!.nguPhap?.id, 'np-a1');
  // A2 không có điểm ngữ pháp ⇒ lấy cấp gần nhất phía dưới; C1 ⇒ B1.
  assert.equal(k.theoCap.nhom[1]!.bai[0]!.nguPhap?.id, 'np-a1');
  assert.equal(k.theoCap.nhom[3]!.bai[0]!.nguPhap?.id, 'np-b1');
  assert.equal(k.theoChuDe.nhom.map((n) => n.ma).join(), 'a,bs-x');
  assert.equal(k.theoChuDe.nhom[1]!.bai[0]!.nhanCap, 'A2–C1');
});

test('bộ bổ sung: thư mục trống / thiếu ⇒ rỗng; tệp đúng khuôn ⇒ vào lộ trình; tệp sai ⇒ bỏ', () => {
  const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'htv-'));
  try {
    assert.deepEqual(napBoSung('en', goc), []);
    fs.mkdirSync(path.join(goc, 'en'));
    assert.deepEqual(napBoSung('en', goc), []);
    const bo = {
      ma: 'ielts-thu', nn: 'en', ten: 'IELTS thử', moTa: 'thử', nhom: 'ielts', cap: 'C1',
      tu: Array.from({ length: 20 }, (_, i) => ({ chu: `zzqword${i}`, doc: '/z/', loai: 'n', nghia: 'thử', cap: 'C1', viDu: `A zzqword${i} here.`, viDuNghia: 'thử', cumTu: ['x y'] })),
    };
    fs.writeFileSync(path.join(goc, 'en', 'ielts-thu.json'), JSON.stringify(bo));
    fs.writeFileSync(path.join(goc, 'en', 'hong.json'), '{"ma":"hong"');
    const ds = napBoSung('en', goc);
    assert.equal(ds.length, 1);
    const ng = nguonCua('en', goc);
    assert.equal(ng.filter((g) => !g.chiChuDe).at(-1)!.ma, 'bs-ielts-thu');
    assert.equal(ng.filter((g) => !g.boSung).length > 40, true);
  } finally { fs.rmSync(goc, { recursive: true, force: true }); }
});

test('phục vụ: tổng quan, lộ trình hai kiểu, chi tiết bài (id từ điển hoặc id âm), lỗi đúng mã', async () => {
  _datKhoHtv();
  const tq = tongQuanHtv();
  assert.deepEqual(tq.ngonNgu.map((x) => x.nn), ['en', 'ja', 'zh']);
  const lt = loTrinhHtv('zh', undefined);
  assert.equal(lt.theo, 'cap');
  assert.equal(lt.nhom[0]!.ma, 'HSK1');
  assert.ok(lt.nhom[0]!.bai[0]!.k.length === lt.nhom[0]!.bai[0]!.soTu);
  assert.equal(loTrinhHtv('en', 'chu-de').theo, 'chu-de');
  assert.throws(() => loTrinhHtv('vi', 'cap'), /nn/);
  const b = await baiHtv('en', lt.nhom.length ? loTrinhHtv('en', 'cap').nhom[0]!.bai[0]!.id : '') as { tu: { id: number; k: string; nghia: string }[]; ke: string | null };
  assert.ok(b.tu.length >= 10 && b.tu.every((t) => Number.isInteger(t.id) && t.k && t.nghia));
  assert.ok(b.ke);
  await assert.rejects(() => baiHtv('en', 'khong-co'), /Không có bài/);
});

test('lamSachDoc: gọn IPA từ điển', () => {
  assert.equal(lamSachDoc('/ 『wɒts jɔːr neɪm』 /'), '/wɒts jɔːr neɪm/');
  assert.equal(lamSachDoc('かぞく'), 'かぞく');
  assert.equal(lamSachDoc(null), null);
});
