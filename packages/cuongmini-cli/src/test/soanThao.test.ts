import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import * as ST from '../ui/soanThao';

// Các phép kiểm dưới so chữ giao diện tiếng Việt.
datNgonNgu('vi');

test('ô nhập: chèn, xoá lùi giữ nguyên ký tự có dấu và emoji', () => {
  let o = ST.chen(ST.rong(), 'Việt 😀');
  assert.deepEqual(o, { text: 'Việt 😀', contro: 'Việt 😀'.length });
  o = ST.xoaLui(o);
  assert.equal(o.text, 'Việt ');
  o = ST.chen(o, 'a\r\nb\tc');
  assert.equal(o.text, 'Việt a\nb  c');
});

test('ô nhập: \\ cuối dòng + Enter ⇒ xuống dòng; Enter thường ⇒ gửi', () => {
  const r = ST.enter({ text: 'dòng 1\\', contro: 7 });
  assert.deepEqual(r, { o: { text: 'dòng 1\n', contro: 7 }, guiDi: false });
  assert.equal(ST.enter({ text: 'x', contro: 1 }).guiDi, true);
});

test('ô nhập: đi lên/xuống dòng, đầu/cuối dòng, xoá từ', () => {
  const o = { text: 'ab\ncdef', contro: 6 };
  assert.deepEqual(ST.lenDong(o), { text: o.text, contro: 2 });
  assert.equal(ST.lenDong({ text: 'ab', contro: 1 }), null);
  assert.deepEqual(ST.xuongDong({ text: o.text, contro: 1 }), { text: o.text, contro: 4 });
  assert.equal(ST.dauDong(o).contro, 3);
  assert.equal(ST.cuoiDong({ text: o.text, contro: 4 }).contro, 7);
  assert.deepEqual(ST.xoaTu({ text: 'hello world ', contro: 12 }), { text: 'hello ', contro: 6 });
  assert.deepEqual(ST.xoaVeDau({ text: 'ab\ncd', contro: 5 }), { text: 'ab\n', contro: 3 });
  assert.deepEqual(ST.thayDoan({ text: 'xem @sr', contro: 7 }, 4, '@src/ '), { text: 'xem @src/ ', contro: 10 });
});

test('lịch sử: ↑ lùi, ↓ tiến rồi trả lại chữ đang gõ dở; mã hoá xuống dòng', () => {
  const ls = new ST.LichSu(['a', 'b']);
  assert.equal(ls.truoc('dở'), 'b');
  assert.equal(ls.truoc('dở'), 'a');
  assert.equal(ls.truoc('dở'), null);
  assert.equal(ls.sau(), 'b');
  assert.equal(ls.sau(), 'dở');
  ls.them('b');
  assert.deepEqual(ls.ds, ['a', 'b'], 'không lặp câu liền nhau');
  const tho = 'dòng 1\nC:\\duong';
  assert.equal(ST.giaiMaDong(ST.maHoaDong(tho)), tho);
  assert.ok(!ST.maHoaDong(tho).includes('\n'));
});
