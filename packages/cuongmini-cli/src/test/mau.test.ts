import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boMau, catVua, datCapMau, doCapMau, mau, rgbSang256 } from '../mau';
import { coNgonNgu, htmlSangAnsi, ngonNguTuDuong, toMauCode } from '../toMau';

test('NO_COLOR tắt màu, FORCE_COLOR ép mức, pipe không màu', () => {
  assert.equal(doCapMau({ NO_COLOR: '1' }, true), 0);
  assert.equal(doCapMau({ NO_COLOR: '' , COLORTERM: 'truecolor' }, true), 3);
  assert.equal(doCapMau({}, false), 0);
  assert.equal(doCapMau({ FORCE_COLOR: '2' }, false), 2);
  assert.equal(doCapMau({ TERM_PROGRAM: 'iTerm.app' }, true, 'darwin'), 3);
  assert.equal(doCapMau({ TERM_PROGRAM: 'Apple_Terminal', TERM: 'xterm-256color' }, true, 'darwin'), 2);
  assert.equal(doCapMau({ TERM: 'dumb' }, true, 'linux'), 0);
});

test('256 màu: dải xám và khối màu', () => {
  assert.equal(rgbSang256(0, 0, 0), 16);
  assert.equal(rgbSang256(255, 0, 0), 196);
  assert.ok(rgbSang256(128, 128, 128) >= 232);
});

test('mau() chỉ huỷ màu chữ (39), không huỷ nền', () => {
  datCapMau(3);
  const s = mau('#ff0000')('x');
  assert.equal(s, '\x1b[38;2;255;0;0mx\x1b[39m');
  datCapMau(0);
  assert.equal(mau('#ff0000')('x'), 'x');
});

test('catVua cắt theo cột, tính chữ rộng', () => {
  assert.equal(catVua('abcdef', 4), 'abc…');
  assert.equal(catVua('ab', 4), 'ab');
  assert.equal(catVua('中文字', 4), '中…');
});

test('tô màu cú pháp: từ khoá tím, chuỗi xanh neon, số cam, chú thích nghiêng', () => {
  datCapMau(3);
  const ra = toMauCode('const a = "x"; // ghi chú\nlet n = 42;', 'ts');
  assert.match(ra, /\x1b\[38;2;198;120;221mconst/); // #c678dd
  assert.match(ra, /\x1b\[38;2;80;250;123m"x"/); // #50fa7b
  assert.match(ra, /\x1b\[38;2;255;158;100m42/); // #ff9e64
  assert.match(ra, /\x1b\[3m\x1b\[38;2;127;132;142m\/\/ ghi chú/);
  assert.ok(!ra.includes('\x1b[0m'), 'không được huỷ toàn bộ (mất nền diff)');
  assert.equal(boMau(ra), 'const a = "x"; // ghi chú\nlet n = 42;');
  datCapMau(0);
  assert.equal(toMauCode('const a = 1', 'ts'), 'const a = 1');
});

test('HTML highlight.js ⇒ ANSI: giải mã thực thể, span lồng', () => {
  datCapMau(3);
  const ra = htmlSangAnsi('<span class="hljs-string">&quot;a &amp; b&quot;</span> &lt;x&gt;');
  assert.equal(boMau(ra), '"a & b" <x>');
  assert.match(htmlSangAnsi('<span class="hljs-title function_">f</span>'), /38;2;97;175;239mf/);
  datCapMau(0);
});

test('đoán ngôn ngữ theo đường dẫn', () => {
  assert.equal(ngonNguTuDuong('src/a.tsx'), 'typescript');
  assert.equal(ngonNguTuDuong('Dockerfile'), 'dockerfile');
  assert.equal(ngonNguTuDuong('.env.local'), 'ini');
  assert.equal(ngonNguTuDuong('x.unknown'), null);
  assert.ok(coNgonNgu('sh') && coNgonNgu('py') && !coNgonNgu('cobol'));
});
