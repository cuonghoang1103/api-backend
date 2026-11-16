import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CAP_PODCAST, NN_PODCAST, kiemTap, tomTatTap, type TapPodcast } from './podcastThuan.js';
import { THU_MUC_PODCAST, napPodcast } from './podcast.js';
import { GIONG } from '../ielts/docTo.service.js';

test('podcast: MỌI tệp nội dung đúng khuôn (tệp sai bị bỏ lúc chạy ⇒ phải bắt ở đây)', () => {
  let dem = 0;
  for (const nn of NN_PODCAST) {
    let tep: string[] = [];
    try { tep = fs.readdirSync(path.join(THU_MUC_PODCAST, nn)).filter((f) => f.endsWith('.json')); } catch { /* chưa có */ }
    for (const f of tep) {
      const t = JSON.parse(fs.readFileSync(path.join(THU_MUC_PODCAST, nn, f), 'utf8')) as TapPodcast;
      const loi = kiemTap(t);
      if (t.nn !== nn) loi.push('nn khác thư mục');
      if (`${t.id}.json` !== f) loi.push('tên tệp khác id');
      assert.deepEqual(loi, [], `${nn}/${f}`);
      dem++;
    }
  }
  assert.ok(dem >= 1);
  assert.equal(napPodcast().length, dem, 'nạp đủ mọi tệp');
});

test('podcast: không trùng id, không trùng (cấp, số) trong một ngôn ngữ', () => {
  const ds = napPodcast();
  assert.equal(new Set(ds.map((t) => t.id)).size, ds.length);
  assert.equal(new Set(ds.map((t) => `${t.nn}|${t.danhMuc ?? 'doi-song'}|${t.cap}|${t.so}`)).size, ds.length);
});

test('podcast: giọng khai trong luật là giọng máy chủ có thật', () => {
  const co = new Set(Object.keys(GIONG));
  for (const nn of NN_PODCAST) assert.ok(CAP_PODCAST[nn].length >= 4);
  for (const t of napPodcast()) for (const n of t.nguoi) assert.ok(co.has(n.giong), `${t.id}: ${n.giong}`);
});

test('kiemTap bắt lỗi khuôn thường gặp', () => {
  const tot = napPodcast().find((t) => t.id === 'en-a1-01')!;
  assert.deepEqual(kiemTap(tot), []);
  assert.ok(kiemTap({ ...tot, cap: 'N5' }).some((l) => l.startsWith('cap lạ')));
  assert.ok(kiemTap({ ...tot, nguoi: [{ ...tot.nguoi[0], giong: 'ja-nu' }, tot.nguoi[1]] }).some((l) => l.includes('không hợp lệ')));
  assert.ok(kiemTap({ ...tot, cauHoi: [{ hoi: 'x', chon: ['a', 'b'], dung: 2 }, tot.cauHoi[0]] }).some((l) => l.includes('dung ngoài phạm vi')));
  assert.ok(kiemTap({ ...tot, tuVung: [...tot.tuVung, { chu: 'xyzzy', nghia: 'không có' }] }).some((l) => l.includes('không xuất hiện')));
  assert.ok(kiemTap({ ...tot, nn: 'ja', id: 'ja-n5-01', cap: 'N5', nguoi: [{ ma: 'L', ten: 'A', giong: 'ja-nu' }, { ma: 'B', ten: 'B', giong: 'ja-nam' }] }).some((l) => l.includes('.doc thiếu')));
  const tt = tomTatTap(tot);
  assert.equal(tt.soDong, tot.loi.length);
  assert.ok(tt.phut >= 1);
});

test('danh sách theo danh mục: mặc định Đời sống, có bảng danh mục kèm số tập', async () => {
  const { danhSachPodcast } = await import('./podcast.js');
  const d = danhSachPodcast('en');
  assert.equal(d.danhMucDangXem, 'doi-song');
  assert.ok(d.danhMuc.some((x) => x.ma === 'doi-song'));
  for (const g of d.cap) for (const t of g.tap) assert.equal(t.danhMuc, 'doi-song');
  assert.equal(danhSachPodcast('en', 'khong-co').danhMucDangXem, 'doi-song');
});

test('kiemTap: cách nói khác đúng khuôn', () => {
  const tot = napPodcast().find((t) => t.id === 'en-a1-01')!;
  const loi0 = { ...tot.loi[0], khac: [{ kieu: 'lịch sự', t: 'Excuse me, is this seat taken?', v: 'Xin lỗi, ghế này có ai ngồi chưa ạ?' }] };
  assert.deepEqual(kiemTap({ ...tot, loi: [loi0, ...tot.loi.slice(1)] }), []);
  const sai = { ...tot.loi[0], khac: [{ kieu: 'bựa', t: 'x', v: 'y' }] };
  assert.ok(kiemTap({ ...tot, loi: [sai, ...tot.loi.slice(1)] }).some((l) => l.includes('kieu lạ')));
  assert.ok(kiemTap({ ...tot, danhMuc: 'xyz' as never }).some((l) => l.includes('danhMuc lạ')));
});
