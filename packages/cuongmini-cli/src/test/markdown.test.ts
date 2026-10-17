import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boMau, datCapMau, doRong } from '../mau';
import { duoiMarkdown, veMarkdown } from '../markdown';

test('markdown: tiêu đề, đậm, code trong dòng, danh sách, việc', () => {
  datCapMau(3);
  const ra = veMarkdown('# Tiêu đề\n\nĐoạn **đậm** và `mã`.\n\n- một\n- hai\n  1. con\n- [x] xong\n- [ ] chưa', { rong: 60 });
  const tron = boMau(ra);
  assert.match(tron, /^Tiêu đề/);
  assert.match(tron, /Đoạn đậm và mã\./);
  assert.match(tron, /• một\n• hai\n  1\. con/);
  assert.match(tron, /☑ xong\n☐ chưa/);
  assert.match(ra, /\x1b\[1m/); // in đậm
  datCapMau(0);
  assert.match(veMarkdown('# A\n\n`x`', { rong: 40 }), /^# A\n\n`x`$/);
});

test('markdown: bảng khung vừa bề ngang, quá rộng thì in dạng thẻ', () => {
  datCapMau(0);
  const md = '| A | Bảng |\n|---|---:|\n| 1 | 22 |';
  const ra = veMarkdown(md, { rong: 60 }).split('\n');
  assert.equal(ra[0], '┌───┬──────┐');
  assert.equal(ra[1], '│ A │ Bảng │');
  assert.equal(ra[3], '│ 1 │   22 │');
  const hep = veMarkdown('| Cột rất dài một | Cột rất dài hai |\n|---|---|\n| x | y |', { rong: 20 });
  assert.match(hep, /• Cột rất dài một: x/);
});

test('markdown: khối code có khung + nhãn ngôn ngữ + tô màu', () => {
  datCapMau(3);
  const ra = veMarkdown('```ts\nconst a = 1;\n```', { rong: 50 });
  const tron = boMau(ra).split('\n');
  assert.deepEqual(tron, ['┌─ ts', '│ const a = 1;', '└─']);
  assert.match(ra, /38;2;198;120;221mconst/);
  datCapMau(0);
});

test('markdown: tự xuống dòng giữ thụt lề của gạch đầu dòng', () => {
  datCapMau(0);
  const ra = veMarkdown('- một hai ba bốn năm sáu bảy tám chín mười', { rong: 16 }).split('\n');
  assert.ok(ra.length > 1);
  for (const d of ra) assert.ok(doRong(d) <= 16, d);
  assert.ok(ra.slice(1).every((d) => d.startsWith('  ')));
});

test('markdown: link khác chữ thì kèm URL; chữ đang chảy chỉ giữ đuôi', () => {
  datCapMau(0);
  assert.equal(veMarkdown('[web](https://cuongthai.com)', { rong: 80 }), 'web (https://cuongthai.com)');
  const { dong, anBot } = duoiMarkdown(Array.from({ length: 30 }, (_, i) => `dòng ${i}`).join('\n\n'), 40, 5);
  assert.equal(dong.length, 5);
  assert.ok(anBot > 0);
  assert.equal(dong[4], 'dòng 29');
});
