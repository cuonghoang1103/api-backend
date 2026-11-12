/**
 * Luật đếm lượt gọi CuongMini của bản free (không gọi AI, không CSDL — phụ thuộc giả).
 *   npx tsx --test src/services/ctlanguage/goiCuongMini.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { chayLuotGoi, LUOT_FREE_NGAY, luotGoi, type PhuThuocGoi } from './goiCuongMini.js';
import type { SuKienTC } from '../ielts/troChuyen/troChuyenLuong.service.js';

const audio = Buffer.from('x');
const ghi = () => { const ds: { type: string; lyDo?: string; conLai?: number | null }[] = []; return { ds, gui: (e: { type: string }) => ds.push(e as never) }; };
const gia = (laPro: boolean, phat: SuKienTC[]): PhuThuocGoi => ({
  laPro: async () => laPro,
  chay: (async (_u: number, _v: unknown, gui: (e: SuKienTC) => void) => { for (const e of phat) gui(e); }) as PhuThuocGoi['chay'],
});
const ngheDuoc: SuKienTC[] = [{ type: 'nghe', text: 'konnichiwa', ms: 1 }];

test('free: đủ lượt rồi ⇒ can_pro, không gọi phòng trò chuyện', async () => {
  const uid = 900_001;
  for (let i = 0; i < LUOT_FREE_NGAY; i++) await chayLuotGoi(uid, { audio }, () => {}, undefined, gia(false, ngheDuoc));
  let daChay = false;
  const g = ghi();
  await chayLuotGoi(uid, { audio }, g.gui, undefined, { laPro: async () => false, chay: (async () => { daChay = true; }) as never });
  assert.equal(g.ds[0].lyDo, 'can_pro');
  assert.equal(daChay, false);
});

test('câu mở đầu (không audio) không tính lượt', async () => {
  const uid = 900_002;
  for (let i = 0; i < 20; i++) await chayLuotGoi(uid, {}, () => {}, undefined, gia(false, []));
  const g = ghi();
  await chayLuotGoi(uid, {}, g.gui, undefined, gia(false, []));
  assert.equal(g.ds[0].conLai, LUOT_FREE_NGAY);
});

test('không nghe ra chữ / AI lỗi ⇒ hoàn lượt', async () => {
  const uid = 900_003;
  await chayLuotGoi(uid, { audio }, () => {}, undefined, gia(false, [{ type: 'nghe', text: '  ', ms: 1 }]));
  await chayLuotGoi(uid, { audio }, () => {}, undefined, gia(false, [{ type: 'loi', lyDo: 'loi_ai', message: 'x' }]));
  await chayLuotGoi(uid, { audio }, () => {}, undefined, gia(false, ngheDuoc));
  const g = ghi();
  await chayLuotGoi(uid, {}, g.gui, undefined, gia(false, []));
  assert.equal(g.ds[0].conLai, LUOT_FREE_NGAY - 1, 'chỉ lượt nghe được bị trừ');
});

test('Pro: không đếm, conLai = null', async () => {
  const g = ghi();
  for (let i = 0; i < LUOT_FREE_NGAY + 3; i++) await chayLuotGoi(900_004, { audio }, g.gui, undefined, gia(true, ngheDuoc));
  assert.ok(g.ds.filter((e) => e.type === 'luot').every((e) => e.conLai === null));
  assert.ok(!g.ds.some((e) => e.lyDo === 'can_pro'));
  void luotGoi;
});
