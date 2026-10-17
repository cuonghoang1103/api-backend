import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { guiThangDuoc, tachAnh } from '../anh';

const co = (ds: string[]) => (p: string) => ds.includes(p);

test('ảnh: @đường tương đối, đường kéo vào (thoát dấu cách / bọc nháy), bỏ qua file không tồn tại', () => {
  // Đường kỳ vọng dựng bằng `path` — test chạy cả trên Windows (CI), nơi '/du-an' resolve thành 'D:\\du-an'.
  const a = path.resolve('/du-an', 'shots/a.png');
  const r = tachAnh("xem @shots/a.png và /Users/me/My\\ Shot.heic với '/tmp/b c.jpg' rồi x.png", '/du-an',
    co([a, '/Users/me/My Shot.heic', '/tmp/b c.jpg']));
  assert.deepEqual(r.anh, ['/tmp/b c.jpg', a, '/Users/me/My Shot.heic']);
  assert.equal(r.text, 'xem [ảnh: a.png] và [ảnh: My Shot.heic] với [ảnh: b c.jpg] rồi x.png');
  assert.deepEqual([...r.daNhac], ['shots/a.png']);
});

test('ảnh: không tồn tại ⇒ giữ nguyên chữ; tối đa 8 ảnh; định dạng gửi thẳng', () => {
  assert.equal(tachAnh('@khong.png', '/d', co([])).text, '@khong.png');
  const nhieu = Array.from({ length: 10 }, (_, i) => `/a/${i}.png`);
  assert.equal(tachAnh(nhieu.join(' '), '/', co(nhieu)).anh.length, 8);
  assert.equal(guiThangDuoc('data:image/png;base64,AAAA'), true);
  assert.equal(guiThangDuoc('data:image/heic;base64,AAAA'), false);
});
