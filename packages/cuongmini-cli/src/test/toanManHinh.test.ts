import assert from 'node:assert/strict';
import { test } from 'node:test';
import { phanTichCo } from '../coDong';
import { capNhatTong, catKhung, cuon, docChuot, nenBatChuot, nenToanManHinh, xoaSach } from '../toanManHinh';

test('toàn màn hình: mặc định bật ở terminal; cờ thắng cài đặt; CI / -p / không TTY / dumb thì không', () => {
  const co = { caiDat: 'bat' as const, cheDoIn: false, tty: true, env: {} };
  assert.equal(nenToanManHinh(co), true);
  assert.equal(nenToanManHinh({ ...co, caiDat: 'tat' }), false);
  assert.equal(nenToanManHinh({ ...co, caiDat: 'tat', co: true }), true);
  assert.equal(nenToanManHinh({ ...co, co: false }), false);
  assert.equal(nenToanManHinh({ ...co, cheDoIn: true, co: true }), false);
  assert.equal(nenToanManHinh({ ...co, tty: false }), false);
  assert.equal(nenToanManHinh({ ...co, env: { CI: 'true' } }), false);
  assert.equal(nenToanManHinh({ ...co, env: { CI: 'false' } }), true);
  assert.equal(nenToanManHinh({ ...co, env: { TERM: 'dumb' } }), false);
  assert.equal(nenToanManHinh({ ...co, env: { CUONGMINI_TOAN_MAN_HINH: '0' }, co: true }), false);
  assert.equal(phanTichCo(['--no-fullscreen']).toanManHinh, false);
  assert.equal(phanTichCo(['--fullscreen']).toanManHinh, true);
  assert.equal(phanTichCo([]).toanManHinh, undefined);
});

test('chuột SGR: con lăn lên/xuống (kể cả giữ phím), nhấn chuột, không phải chuột', () => {
  assert.deepEqual(docChuot('[<64;12;5M'), { kieu: 'cuonLen', x: 12, y: 5 });
  assert.deepEqual(docChuot('\x1b[<65;1;1M'), { kieu: 'cuonXuong', x: 1, y: 1 });
  assert.equal(docChuot('[<81;1;1M')?.kieu, 'cuonXuong', 'ctrl+con lăn');
  assert.equal(docChuot('[<0;3;4m')?.kieu, 'khac');
  assert.equal(docChuot('[I'), null);
  assert.equal(docChuot('a'), null);
  assert.equal(nenBatChuot('win32', {}), false, 'Windows: sự kiện chuột không tới Node ⇒ đừng phá bôi đen');
  assert.equal(nenBatChuot('darwin', {}, 'tat'), false, 'mặc định KHÔNG bắt chuột — bôi đen chép tự nhiên');
  assert.equal(nenBatChuot('darwin', {}, 'bat'), true, '/mouse on');
  assert.equal(nenBatChuot('darwin', { CUONGMINI_CHUOT: '1' }, 'tat'), true);
  assert.equal(nenBatChuot('linux', { CUONGMINI_CHUOT: '0' }, 'bat'), false);
});

test('cuộn bảng ghi: bám đáy, cuộn lên giữ chỗ khi có dòng mới, đếm "N dòng mới", không quá đầu', () => {
  let v = capNhatTong({ cuon: 0, tong: 0, moi: 0 }, 100);
  assert.deepEqual(v, { cuon: 0, tong: 100, moi: 0 });
  v = cuon(v, 30, 20);
  assert.equal(v.cuon, 30);
  v = capNhatTong(v, 112); // 12 dòng mới tới lúc đang đọc ở trên
  assert.deepEqual(v, { cuon: 42, tong: 112, moi: 12 });
  assert.deepEqual(catKhung([...Array(112).keys()], v, 5), [65, 66, 67, 68, 69]);
  assert.equal(cuon(v, 1000, 20).cuon, 92, 'không cuộn quá đầu (còn đủ một khung)');
  const day = cuon(v, -1000, 20);
  assert.deepEqual([day.cuon, day.moi], [0, 0], 'về đáy thì xoá đếm dòng mới');
  assert.deepEqual(capNhatTong(v, 10), { cuon: 0, tong: 10, moi: 0 }, '/clear ⇒ về đáy');
  assert.deepEqual(catKhung(['a', 'b'], { cuon: 0 }, 5), ['a', 'b']);
});

test('xoá sạch (chỉ in nối tiếp): KHÔNG còn mã ClearScrollback riêng của iTerm2 (iTerm2 hỏi "Allow?")', () => {
  assert.equal(xoaSach({}), '\x1b[2J\x1b[3J\x1b[H');
  assert.equal(xoaSach({ TERM_PROGRAM: 'iTerm.app' }), '\x1b[2J\x1b[3J\x1b[H');
});
