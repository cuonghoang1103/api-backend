import test from 'node:test';
import assert from 'node:assert/strict';
import { caiDatMacDinh, chuanCaiDat, giongCho, heSoCredit, uocCredit, xetQuyen } from './elevenlabs.js';
import { tachChan } from '../makerlab/giongEl.js';

const cd = caiDatMacDinh();
const co = { cd, coKhoa: true, laAdmin: false, laPro: false, daDungHomNay: 0, kyTu: 200, conLai: 100_000 };

test('robot: được khi bật + còn quỹ; tắt robot / hết quỹ thì không', () => {
  assert.equal(xetQuyen({ ...co, viec: 'robot' }).duoc, true);
  assert.equal(xetQuyen({ ...co, viec: 'robot', cd: { ...cd, robot: false } }).lyDo, 'tat_robot');
  assert.equal(xetQuyen({ ...co, viec: 'robot', conLai: 50 }).lyDo, 'het_quy');
  // robot KHÔNG bị chặn bởi mức giữ quỹ — mức đó giữ CHO nó
  assert.equal(xetQuyen({ ...co, viec: 'robot', conLai: 1_000 }).duoc, true);
});

test('web: admin không trần; Pro trần 8.000 ký tự/ngày; Free không', () => {
  assert.equal(xetQuyen({ ...co, viec: 'phong_van', laAdmin: true, laPro: true, daDungHomNay: 9_999_999 }).lyDo, 'admin');
  assert.equal(xetQuyen({ ...co, viec: 'phong_van', laPro: true, daDungHomNay: 7_800 }).duoc, true);
  assert.equal(xetQuyen({ ...co, viec: 'phong_van', laPro: true, daDungHomNay: 7_900 }).lyDo, 'het_tran_ngay');
  assert.equal(xetQuyen({ ...co, viec: 'phong_van' }).lyDo, 'khong_pro');
});

test('web: quỹ xuống dưới mức giữ cho robot ⇒ cả admin cũng ngưng; tắt việc riêng lẻ', () => {
  assert.equal(xetQuyen({ ...co, viec: 'ai_chat', laAdmin: true, laPro: true, conLai: cd.giuChoRobot }).lyDo, 'giu_cho_robot');
  assert.equal(xetQuyen({ ...co, viec: 'ai_chat', laAdmin: true, laPro: true, cd: { ...cd, viec: { ...cd.viec, ai_chat: false } } }).lyDo, 'tat_viec');
  assert.equal(xetQuyen({ ...co, viec: 'ai_chat', laAdmin: true, cd: { ...cd, bat: false } }).lyDo, 'tat_tong');
  assert.equal(xetQuyen({ ...co, viec: 'ai_chat', laAdmin: true, coKhoa: false }).lyDo, 'chua_co_khoa');
  // không đọc được số dư ⇒ không chặn vì số dư
  assert.equal(xetQuyen({ ...co, viec: 'ai_chat', laAdmin: true, laPro: true, conLai: null }).duoc, true);
});

test('chuanCaiDat: kẹp số, bỏ giá trị lạ, giữ mặc định', () => {
  const c = chuanCaiDat({ tranProNgay: -5, giuChoRobot: '20000', model: 'gpt-4', giongMacDinh: 'x', viec: { gia_su: false }, giongTheoNgonNgu: { en: 'abcdefghij1234567890', xx1: 'bad' } });
  assert.equal(c.tranProNgay, 8_000);
  assert.equal(c.giuChoRobot, 20_000);
  assert.equal(c.model, 'eleven_v4_turbo');
  assert.equal(c.giongMacDinh, cd.giongMacDinh);
  assert.equal(c.viec.gia_su, false);
  assert.equal(c.viec.phong_van, true);
  assert.equal(giongCho(c, 'en-US'), 'abcdefghij1234567890');
  assert.equal(giongCho(c, 'ja'), cd.giongMacDinh);
});

test('credit: v4_turbo 0,5/ký tự, v3 1/ký tự', () => {
  assert.equal(heSoCredit('eleven_v4_turbo'), 0.5);
  assert.equal(heSoCredit('eleven_v3'), 1);
  assert.equal(uocCredit(201, 'eleven_v4_turbo'), 101);
});

test('tachChan: không bao giờ đẩy byte lẻ xuống bo', () => {
  const a = tachChan(null, Buffer.from([1, 2, 3]));
  assert.equal(a.chan.length, 2);
  assert.deepEqual([...a.le!], [3]);
  const b = tachChan(a.le, Buffer.from([4, 5, 6]));
  assert.deepEqual([...b.chan], [3, 4, 5, 6]);
  assert.equal(b.le, null);
});
