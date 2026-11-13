/**
 * Luật tệp đính kèm Messenger — lỗi 13/11/2026: chủ kênh trên Windows (app desktop) không gửi được .md/.zip/.rar.
 * Chạy: npx tsx --test src/storage/chatAttachmentPolicy.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  CHAT_BLOCKED_EXT,
  CHAT_MAX_BYTES,
  chatExtOf,
  checkChatAttachment,
  utf8FileName,
} from './chatAttachmentPolicy.js';

const txt = (s = 'hello') => Buffer.from(s);
const ZIP = Buffer.from('504b030414000000', 'hex');
const RAR = Buffer.from('526172211a0700cf', 'hex');
const PNG = Buffer.from('89504e470d0a1a0a', 'hex');
const MZ = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(64)]);
const ELF = Buffer.from('7f454c4602010100', 'hex');

const check = (originalName: string, mimetype: string, buffer: Buffer = txt(), size = buffer.length) =>
  checkChatAttachment({ originalName, mimetype, buffer, size, maxImageBytes: 10 * 1024 * 1024 });

test('Windows MIME rỗng / lạ cho .md .zip .rar .7z .pptx ⇒ NHẬN, Content-Type theo đuôi, tải về', () => {
  const cases: Array<[string, string, Buffer, string]> = [
    ['ghi-chu.md', '', txt('# hi'), 'text/markdown; charset=utf-8'],
    ['ghi-chu.md', 'application/octet-stream', txt('# hi'), 'text/markdown; charset=utf-8'],
    ['code.zip', 'application/x-zip-compressed', ZIP, 'application/zip'],
    ['code.zip', '', ZIP, 'application/zip'],
    ['code.rar', '', RAR, 'application/vnd.rar'],
    ['code.rar', 'application/x-rar-compressed', RAR, 'application/vnd.rar'],
    ['code.7z', '', Buffer.from('377abcaf271c0004', 'hex'), 'application/x-7z-compressed'],
    ['slide.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ZIP,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['Main.java', '', txt('class A{}'), 'text/plain; charset=utf-8'],
    ['pom.xml', 'text/xml', txt('<a/>'), 'text/plain; charset=utf-8'],
    ['du-lieu.bin', '', txt('\u0001\u0002'), 'application/octet-stream'],
    ['khong-duoi', '', txt('x'), 'application/octet-stream'],
  ];
  for (const [name, mime, buf, ct] of cases) {
    const r = check(name, mime, buf);
    assert.equal(r.ok, true, `${name} (${mime || 'MIME rỗng'}) phải được nhận`);
    if (!r.ok) continue;
    assert.equal(r.kind, 'document', name);
    assert.equal(r.contentType, ct, name);
    assert.match(r.contentDisposition ?? '', /^attachment; filename="/, name);
  }
});

test('MIME client KHÔNG bao giờ được lưu nguyên văn cho tệp thường (text/html khai cho .txt)', () => {
  const r = check('a.txt', 'text/html', txt('<script>alert(1)</script>'));
  // text/html tự nó bị chặn — kể cả đuôi vô hại.
  assert.equal(r.ok, false);
  const r2 = check('a.csv', 'application/x-weird', txt('a,b'));
  assert.ok(r2.ok && r2.contentType === 'text/csv; charset=utf-8');
});

test('tệp chạy được bị chặn: đuôi, đuôi kép, dấu chấm cuối kiểu Windows, MIME, chữ ký MZ/ELF', () => {
  for (const name of ['setup.exe', 'SETUP.EXE', 'run.bat', 'x.cmd', 'x.ps1', 'x.vbs', 'x.js', 'x.msi', 'x.scr',
    'x.lnk', 'x.hta', 'x.jar', 'x.iso', 'x.html', 'x.svg', 'bao-cao.pdf.exe', 'virus.exe.', 'virus.exe   ', 'x.docm']) {
    const r = check(name, '', txt());
    assert.equal(r.ok, false, `${name} phải bị chặn`);
    if (!r.ok) assert.equal(r.code, 'FILE_BLOCKED');
  }
  assert.equal(check('a.bin', 'application/x-msdownload', txt()).ok, false);
  assert.equal(check('hinh.png', 'image/png', MZ).ok, false, 'exe đổi tên .png');
  assert.equal(check('ghi-chu.md', '', MZ).ok, false, 'exe đổi tên .md');
  assert.equal(check('a.txt', '', ELF).ok, false, 'ELF đổi tên');
});

test('ảnh ⇒ đường sharp; MIME rỗng + đuôi ảnh vẫn là ảnh; ảnh quá trần ảnh ⇒ gửi như tệp', () => {
  const a = check('anh.png', 'image/png', PNG);
  assert.ok(a.ok && a.kind === 'image');
  const b = check('anh.jpg', '', PNG);
  assert.ok(b.ok && b.kind === 'image');
  const big = checkChatAttachment({ originalName: 'to.jpg', mimetype: 'image/jpeg', buffer: PNG, size: 12 * 1024 * 1024, maxImageBytes: 10 * 1024 * 1024 });
  assert.ok(big.ok && big.kind === 'document' && big.contentType === 'image/jpeg');
  const psd = check('thiet-ke.psd', 'image/vnd.adobe.photoshop', txt('8BPS'));
  assert.ok(psd.ok && psd.kind === 'document' && psd.contentType === 'application/octet-stream');
});

test('tin thoại (audio/webm;codecs=opus) ⇒ media, bỏ tham số codecs, không ép tải về', () => {
  const r = check('thoai.webm', 'audio/webm;codecs=opus', txt('webm'));
  assert.ok(r.ok && r.kind === 'media');
  if (r.ok) {
    assert.equal(r.contentType, 'audio/webm');
    assert.equal(r.contentDisposition, undefined);
  }
  const mp3 = check('bai.mp3', '', txt('ID3'));
  assert.ok(mp3.ok && mp3.kind === 'media' && mp3.contentType === 'audio/mpeg');
});

test('cỡ: rỗng ⇒ 400, quá 25MB ⇒ 413', () => {
  const r = check('a.md', '', Buffer.alloc(0), 0);
  assert.ok(!r.ok && r.code === 'FILE_EMPTY' && r.status === 400);
  const big = check('a.zip', '', ZIP, CHAT_MAX_BYTES + 1);
  assert.ok(!big.ok && big.code === 'FILE_TOO_LARGE' && big.status === 413);
});

test('tên tệp tiếng Việt: busboy đọc latin1 ⇒ sửa về UTF-8; tên latin1 thật giữ nguyên', () => {
  const raw = Buffer.from('Báo cáo tuần.md', 'utf8').toString('latin1');
  assert.equal(utf8FileName(raw), 'Báo cáo tuần.md');
  assert.equal(utf8FileName('café.md'), 'café.md');
  const r = check(raw, '', txt());
  assert.ok(r.ok && r.fileName === 'Báo cáo tuần.md');
  if (r.ok) assert.match(r.contentDisposition!, /filename\*=UTF-8''B%C3%A1o%20c%C3%A1o%20tu%E1%BA%A7n\.md$/);
  const sneaky = check('..\\..\\a/b.md', '', txt());
  assert.ok(sneaky.ok && !/[\\/]/.test(sneaky.fileName));
});

test('chatExtOf theo cách Windows hiểu', () => {
  assert.equal(chatExtOf('a.PDF'), 'pdf');
  assert.equal(chatExtOf('a.pdf.exe'), 'exe');
  assert.equal(chatExtOf('a.exe. . '), 'exe');
  assert.equal(chatExtOf('.bashrc'), '');
  assert.equal(chatExtOf('README'), '');
});

test('danh sách đuôi bị chặn ở client (frontend/src/lib/tinNhan/tepDinhKem.ts) KHỚP máy chủ', () => {
  const src = fs.readFileSync(path.resolve('frontend/src/lib/tinNhan/tepDinhKem.ts'), 'utf8');
  const m = /DUOI_BI_CHAN[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(src);
  assert.ok(m, 'không tìm thấy DUOI_BI_CHAN trong tệp client');
  const client = new Set([...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
  assert.deepEqual([...client].sort(), [...CHAT_BLOCKED_EXT].sort());
  const tran = /TRAN_CO_TEP\s*=\s*(\d+)\s*\*\s*1024\s*\*\s*1024/.exec(src);
  assert.equal(Number(tran?.[1]) * 1024 * 1024, CHAT_MAX_BYTES);
});
