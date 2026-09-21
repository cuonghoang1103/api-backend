import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giangDeConHan, laLuatMoi, vanTayMau } from './banLuu.js';
import { PHIEN_BAN_LUAT } from './checklistThay.js';

const MAU = '--- src/main/Main.java ---\npublic final class Main {\n}';

test('vân tay: rỗng khi chưa có source chuẩn, ổn định và đổi theo nội dung', () => {
  assert.equal(vanTayMau(null), '');
  assert.equal(vanTayMau(MAU), vanTayMau(MAU));
  assert.equal(vanTayMau(MAU).length, 12);
  assert.notEqual(vanTayMau(MAU), vanTayMau(`${MAU} `));
});

test('luật cũ hoặc không có dấu luật thì hết hạn', () => {
  assert.equal(laLuatMoi({ tongQuan: 'x' }), false);
  assert.equal(laLuatMoi({ tongQuan: 'x', _luat: 'cu' }), false);
  assert.equal(laLuatMoi(null), false);
  assert.equal(giangDeConHan({ _luat: 'cu', _mau: vanTayMau(MAU) }, MAU), false);
});

test('đúng luật + đúng source chuẩn thì còn hạn', () => {
  assert.equal(giangDeConHan({ _luat: PHIEN_BAN_LUAT, _mau: vanTayMau(MAU) }, MAU), true);
});

test('source chuẩn đổi (nạp lời giải mới) thì bài giảng cũ hết hạn', () => {
  const cu = { _luat: PHIEN_BAN_LUAT, _mau: vanTayMau(MAU) };
  assert.equal(giangDeConHan(cu, `${MAU}\n// sửa theo tờ checklist`), false);
});

test('bản lưu trước khi có dấu _mau: giữ nếu bài vẫn chưa có source chuẩn, soạn lại nếu nay đã có', () => {
  const truocDo = { _luat: PHIEN_BAN_LUAT, tongQuan: 'x' };
  assert.equal(giangDeConHan(truocDo, null), true);
  assert.equal(giangDeConHan(truocDo, MAU), false);
});
