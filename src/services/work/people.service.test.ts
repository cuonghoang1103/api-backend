/** Thành viên + trạng thái hoạt động — phần thuần: npx tsx --test src/services/work/people.service.test.ts */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NGUONG_TRUC_TUYEN_GIAY, sapXepNguoi, trangThaiCho } from './people.service.js';

const bayGio = new Date('2026-10-21T10:00:00Z');
const truoc = (giay: number) => new Date(bayGio.getTime() - giay * 1000);
const bat = { showActiveStatus: true };

test('đang nối socket ⇒ online; mốc trong 60 s ⇒ online; cũ hơn ⇒ chỉ có mốc', () => {
  assert.equal(NGUONG_TRUC_TUYEN_GIAY, 60);
  assert.deepEqual(trangThaiCho(bat, { showActiveStatus: true, lastActiveAt: truoc(3600), dangNoi: true }, bayGio),
    { visible: true, online: true, lastActiveAt: truoc(3600) });
  assert.equal(trangThaiCho(bat, { showActiveStatus: true, lastActiveAt: truoc(30), dangNoi: false }, bayGio).online, true);
  const cu = trangThaiCho(bat, { showActiveStatus: true, lastActiveAt: truoc(300), dangNoi: false }, bayGio);
  assert.equal(cu.online, false);
  assert.equal(cu.visible, true);
  assert.equal(cu.lastActiveAt?.toISOString(), truoc(300).toISOString());
});

test('riêng tư: người kia tắt ⇒ ẩn; NGƯỜI XEM tắt ⇒ cũng ẩn (đối ứng); agent/chặn ⇒ ẩn', () => {
  const an = { visible: false, online: false, lastActiveAt: null };
  assert.deepEqual(trangThaiCho(bat, { showActiveStatus: false, lastActiveAt: truoc(5), dangNoi: true }, bayGio), an);
  assert.deepEqual(trangThaiCho({ showActiveStatus: false }, { showActiveStatus: true, lastActiveAt: truoc(5), dangNoi: true }, bayGio), an);
  assert.deepEqual(trangThaiCho(bat, { showActiveStatus: true, lastActiveAt: truoc(5), dangNoi: true, kind: 'AGENT' }, bayGio), an);
  assert.deepEqual(trangThaiCho(bat, { showActiveStatus: true, lastActiveAt: truoc(5), dangNoi: true, chan: true }, bayGio), an);
});

test('sắp như Messenger: online trước, rồi gần nhất, rồi theo tên', () => {
  const p = (ten: string, online: boolean, giay: number | null) => ({ ten, presence: { visible: true, online, lastActiveAt: giay === null ? null : truoc(giay) } });
  const ds = sapXepNguoi([p('Bình', false, 600), p('An', false, null), p('Cường', true, 10), p('Dũng', false, 60 * 5)]);
  assert.deepEqual(ds.map((x) => x.ten), ['Cường', 'Dũng', 'Bình', 'An']);
});
