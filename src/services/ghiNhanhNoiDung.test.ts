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
  markdownToDoc, docToHtml, htmlToDoc, NOTE_TEMPLATES, themDongSoLenh, docSoLenh, sapXepSoLenh, tachLenh, nodeText,
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

test('Sổ lệnh: mẫu gom nhóm Terminal, lệnh gốc gộp ô, đọc lại đúng', () => {
  const doc = htmlToDoc(NOTE_TEMPLATES.find((t) => t.key === 'so-lenh')!.html);
  assert.deepEqual(docSoLenh(doc).map((d) => d.lenh), ['pwd', 'ls', 'ls -la', 'cd <thư-mục>']);
  assert.ok(docSoLenh(doc).every((d) => d.nhom === 'Terminal'));
  // Ô "ls" gộp 2 dòng (ls + ls -la).
  const bang = doc.content.find((n) => n.type === 'table')!;
  assert.equal(bang.content![2].content![0].attrs!.rowspan, 2);
  moDuocTrongRealtime(doc);
});

test('Sổ lệnh: mkdir và các tuỳ chọn gom một khối, trùng thì gộp, nhóm mới có tiêu đề riêng', () => {
  const doc = htmlToDoc(NOTE_TEMPLATES.find((t) => t.key === 'so-lenh')!.html);
  themDongSoLenh(doc, { lenh: 'mkdir -p <tên>', nghia: 'tạo cả thư mục cha nếu thiếu', nhom: 'Terminal' });
  themDongSoLenh(doc, { lenh: 'mkdir', nghia: 'tạo thư mục', nhom: 'Terminal' });
  themDongSoLenh(doc, { lenh: 'mkdir -p a/b/c', nghia: 'tạo cả thư mục cha nếu thiếu', nhom: 'terminal', loi: 'No such file — quên -p' });
  themDongSoLenh(doc, { lenh: 'mkdir -v', nghia: 'in ra thư mục vừa tạo', nhom: 'Terminal' });
  themDongSoLenh(doc, { lenh: 'git commit -m "x"', nghia: 'lưu một mốc', nhom: 'Git' });
  const ds = docSoLenh(doc);
  const mk = ds.filter((d) => d.lenh.startsWith('mkdir'));
  // Dòng gốc lên đầu khối; -p hai lần gộp làm một, giữ chỗ điền <tên>; đối số thật sang Ví dụ.
  assert.deepEqual(mk.map((d) => d.lenh), ['mkdir', 'mkdir -p <tên>', 'mkdir -v']);
  assert.equal(mk[1].viDu, 'mkdir -p a/b/c');
  assert.equal(mk[1].loi, 'No such file — quên -p');
  assert.equal(mk[1].nghia, 'tạo cả thư mục cha nếu thiếu');
  assert.deepEqual(ds.find((d) => d.nhom === 'Git'), { lenh: 'git commit -m', nghia: 'lưu một mốc', viDu: 'git commit -m "x"', nhom: 'Git', loi: '' });
  const tieuDe = doc.content.filter((n) => n.type === 'heading').map((n) => nodeText(n));
  assert.deepEqual(tieuDe, ['💻 Terminal', '🌿 Git']);
  // Idempotent: dựng lại lần nữa không đổi gì.
  const truoc = JSON.stringify(doc);
  sapXepSoLenh(doc);
  assert.equal(JSON.stringify(doc), truoc);
  moDuocTrongRealtime(doc);
});

test('Sổ lệnh: bảng kiểu cũ 5 cột (có cột Nhóm) được chuyển sang bố cục mới, giữ chữ khác trên trang', () => {
  const cu = htmlToDoc('<p>Ghi chú riêng</p><table><tbody><tr><th><p>Lệnh</p></th><th><p>Nghĩa</p></th><th><p>Ví dụ</p></th><th><p>Nhóm</p></th><th><p>Lỗi từng gặp</p></th></tr>'
    + '<tr><td><p><code>mkdir -p &lt;tên&gt;</code></p></td><td><p>tạo thư mục</p></td><td><p></p></td><td><p>Terminal</p></td><td><p></p></td></tr>'
    + '<tr><td><p><code>mkdir</code></p></td><td><p>make directory</p></td><td><p></p></td><td><p>Terminal</p></td><td><p></p></td></tr>'
    + '<tr><td><p><code>mkdir -p a/b/c</code></p></td><td><p>tự tạo a, rồi b</p></td><td><p></p></td><td><p>Terminal</p></td><td><p></p></td></tr>'
    + '</tbody></table><p>Cuối trang</p>');
  sapXepSoLenh(cu);
  assert.equal(nodeText(cu.content[0]), 'Ghi chú riêng');
  assert.equal(nodeText(cu.content[cu.content.length - 1]), 'Cuối trang');
  assert.deepEqual(docSoLenh(cu).map((d) => [d.lenh, d.nghia]), [
    ['mkdir', 'make directory'],
    ['mkdir -p <tên>', 'tạo thư mục · tự tạo a, rồi b'],
  ]);
  moDuocTrongRealtime(cu);
});

test('tách lệnh', () => {
  assert.deepEqual(tachLenh('cd ..'), { goc: 'cd', tuyChon: '..', khoa: '..', viDuTuLenh: '' });
  assert.equal(tachLenh('npm run dev').goc, 'npm run');
  assert.equal(tachLenh('mkdir -m 700 bi-mat').tuyChon, '-m');
});

test('Sổ lệnh: người dùng đảo cột vẫn đọc đúng; trang không có bảng thì tự chèn bảng', () => {
  const dao = htmlToDoc('<table><tbody><tr><th><p>Nghĩa</p></th><th><p>Lệnh</p></th></tr><tr><td><p>xoá màn hình</p></td><td><p><code>clear</code></p></td></tr></tbody></table>');
  assert.deepEqual(docSoLenh(dao), [{ lenh: 'clear', nghia: 'xoá màn hình' }]);
  themDongSoLenh(dao, { lenh: 'cls', nghia: 'xoá màn hình (Windows)' });
  assert.deepEqual(docSoLenh(dao).map((d) => d.lenh), ['clear', 'cls']);

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
