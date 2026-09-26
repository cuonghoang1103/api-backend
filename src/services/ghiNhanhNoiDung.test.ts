/**
 * Kiểm phần nội dung của Ghi nhanh (không cần CSDL).
 *
 *   npx tsx --test src/services/ghiNhanhNoiDung.test.ts
 *
 * Phép kiểm quan trọng nhất là "mở được trong phòng realtime": nội dung ghi
 * vào `contentJson` mà có nút/mark ngoài schema của cổng cộng tác thì trang
 * vẫn tạo được, vẫn hiện trong thanh bên — nhưng MỞ RA là phòng Yjs ném lỗi.
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { noteRealtimeExtensions } from './notesRealtimeSchema.js';
import {
  markdownToDoc, docToHtml, htmlToDoc, NOTE_TEMPLATES, themDongSoLenh, docSoLenh,
  matTruocThe, doanLuuBlocks, docDoanDaLuu, titleFromMarkdown, walk, type TiptapDoc,
} from './ghiNhanhNoiDung.js';

function moDuocTrongRealtime(doc: TiptapDoc) {
  const y = TiptapTransformer.toYdoc(doc, 'default', noteRealtimeExtensions);
  const back = TiptapTransformer.fromYdoc(y, 'default');
  assert.ok(back);
  docToHtml(doc); // cùng hàm cổng realtime dùng để dựng contentHtml
}

test('markdown → TipTap: code inline, khối code giữ ngôn ngữ, danh sách, bảng', () => {
  const md = [
    '# SO-TAY',
    '',
    'Gõ `pwd` để biết mình đang ở đâu.',
    '',
    '```bash',
    'mkdir -p du-an/src',
    '```',
    '',
    '- ls',
    '- cd ..',
    '',
    '| Lệnh | Nghĩa |',
    '|---|---|',
    '| `ls` | liệt kê |',
    '',
    '```',
    'không ngôn ngữ',
    '```',
  ].join('\n');
  const doc = markdownToDoc(md);
  const types: string[] = [];
  const langs: string[] = [];
  let coCodeMark = false;
  walk(doc, (n) => {
    types.push(n.type ?? '');
    if (n.type === 'codeBlock') langs.push(String(n.attrs?.language ?? ''));
    if (n.marks?.some((m) => m.type === 'code') && n.text === 'pwd') coCodeMark = true;
  });
  assert.ok(types.includes('heading'));
  assert.ok(types.includes('bulletList'));
  assert.ok(types.includes('table'));
  assert.deepEqual(langs, ['bash', '']);
  assert.ok(coCodeMark, '`pwd` phải thành mark code');
  moDuocTrongRealtime(doc);
  assert.equal(titleFromMarkdown(md), 'SO-TAY');
});

test('markdown có <script>, iframe và link: script/iframe bị lọc, link http giữ, link javascript: bị bỏ', () => {
  // 26/09/2026: schema realtime đã có mark `link` ⇒ link http(s) được GIỮ; link nguy hiểm thì không.
  const doc = markdownToDoc('Xem [bài](https://x.com) và [xấu](javascript:alert(1))\n\n<script>alert(1)</script>\n\n<iframe src="https://evil"></iframe>\n\n<img src=x onerror=alert(1)>');
  const html = docToHtml(doc);
  assert.ok(!/script:|<script|iframe|onerror/i.test(html), html);
  const hrefs: string[] = [];
  walk(doc, (n) => { for (const m of n.marks ?? []) if (m.type === 'link') hrefs.push(String(m.attrs?.href)); });
  assert.deepEqual(hrefs, ['https://x.com']);
  assert.match(html, /bài/);
  moDuocTrongRealtime(doc);
});

test('ba mẫu trang đều đúng schema và mở được trong realtime', () => {
  assert.deepEqual(NOTE_TEMPLATES.map((t) => t.key), ['ghi-chu-bai-hoc', 'so-lenh', 'nhat-ky-loi']);
  for (const t of NOTE_TEMPLATES) {
    const doc = htmlToDoc(t.html);
    assert.ok(doc.content.length > 1, t.key);
    moDuocTrongRealtime(doc);
  }
  // Callout trong mẫu phải còn là callout (không bị rơi thành đoạn thường).
  const soLenh = htmlToDoc(NOTE_TEMPLATES[1].html);
  assert.equal(soLenh.content[0].type, 'callout');
});

test('Sổ lệnh: mẫu có 4 dòng ví dụ, thêm dòng rồi đọc lại đúng cột', () => {
  const doc = htmlToDoc(NOTE_TEMPLATES.find((t) => t.key === 'so-lenh')!.html);
  const truoc = docSoLenh(doc);
  assert.deepEqual(truoc.map((d) => d.lenh), ['pwd', 'ls -la', 'cd <thư-mục>', 'mkdir -p <tên>']);
  themDongSoLenh(doc, { lenh: 'git status', nghia: 'xem file nào đã đổi', viDu: 'git status -s', nhom: 'Git', loi: '' });
  const sau = docSoLenh(doc);
  assert.equal(sau.length, 5);
  assert.deepEqual(sau[4], { lenh: 'git status', nghia: 'xem file nào đã đổi', viDu: 'git status -s', nhom: 'Git', loi: '' });
  moDuocTrongRealtime(doc);
});

test('Sổ lệnh: người dùng đảo cột vẫn đọc đúng; trang không có bảng thì tự chèn bảng', () => {
  const dao = htmlToDoc('<table><tbody><tr><th><p>Nghĩa</p></th><th><p>Lệnh</p></th></tr><tr><td><p>xoá màn hình</p></td><td><p><code>clear</code></p></td></tr></tbody></table>');
  assert.deepEqual(docSoLenh(dao), [{ lenh: 'clear', nghia: 'xoá màn hình' }]);
  themDongSoLenh(dao, { lenh: 'cls', nghia: 'xoá màn hình (Windows)' });
  assert.equal(docSoLenh(dao)[1].lenh, 'cls');

  const trong: TiptapDoc = { type: 'doc', content: [{ type: 'paragraph' }] };
  themDongSoLenh(trong, { lenh: 'npm i', nghia: 'cài gói' });
  assert.deepEqual(docSoLenh(trong).map((d) => d.lenh), ['npm i']);
  moDuocTrongRealtime(trong);
});

test('mặt trước thẻ', () => {
  assert.equal(matTruocThe('in ra thư mục đang đứng.'), 'Lệnh nào để in ra thư mục đang đứng?');
  assert.equal(matTruocThe('tạo thư mục?'), 'Lệnh nào để tạo thư mục?');
});

test('đoạn lưu từ bài học: trích dẫn/khối code, đọc lại được, mở được trong realtime', () => {
  const doc: TiptapDoc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nguồn: …' }] }] };
  doc.content.push(...doanLuuBlocks('Dòng 1\nDòng 2\n\nĐoạn 2', false, new Date('2026-09-26T03:00:00Z')));
  doc.content.push(...doanLuuBlocks('ls -la\ncd ..', true, new Date()));
  const doan = docDoanDaLuu(doc);
  assert.deepEqual(doan, [
    { laCode: false, text: 'Dòng 1\nDòng 2\n\nĐoạn 2' },
    { laCode: true, text: 'ls -la\ncd ..' },
  ]);
  assert.match(docToHtml(doc), /Lưu lúc 10:00:00 26\/9\/2026|26\/9\/2026/);
  moDuocTrongRealtime(doc);
});
