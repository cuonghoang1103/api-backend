/**
 * Trình xem tệp CT Work — phần thuần: nhận loại, tên tệp inline, chặn zip bomb, dựng xem trước docx/xlsx.
 *   npx tsx --test src/services/work/xemTep.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import { bangXlsx, dispositionInline, htmlDocx, kiemZip, laDocx, laTepChu, laXlsx, XLSX_MAX_ROWS } from './xemTep.js';
import { writeXlsx, XSheet } from './xlsxStyled.js';

/** docx tối thiểu mà mammoth đọc được. */
function docxMau(paras: string[]): Buffer {
  const z = new AdmZip();
  z.addFile('[Content_Types].xml', Buffer.from('<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'));
  z.addFile('_rels/.rels', Buffer.from('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'));
  const body = paras.map((p) => `<w:p><w:r><w:t xml:space="preserve">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`).join('');
  z.addFile('word/document.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`));
  return z.toBuffer();
}

describe('laTepChu — tệp xem được dạng chữ', () => {
  it('theo đuôi (kể cả không phân biệt hoa thường, tệp không đuôi quen thuộc, .env)', () => {
    for (const n of ['a.txt', 'README.md', 'data.CSV', 'x.json', 'app.log', 'cfg.yaml', 'Main.java', 'index.tsx', 'q.sql', 'Dockerfile', 'Makefile', '.env', '.env.local', 'page.html', 'icon.svg']) {
      assert.equal(laTepChu(n, 'application/octet-stream'), true, n);
    }
  });
  it('theo mime khi đuôi lạ', () => {
    assert.equal(laTepChu('ghi-chu', 'text/plain'), true);
    assert.equal(laTepChu('x.bin', 'application/json; charset=utf-8'), true);
  });
  it('nhị phân thì không', () => {
    for (const [n, m] of [['a.png', 'image/png'], ['b.pdf', 'application/pdf'], ['c.docx', ''], ['d.zip', 'application/zip'], ['e.mp4', 'video/mp4'], ['noext', '']]) {
      assert.equal(laTepChu(n, m), false, n);
    }
  });
  it('docx / xlsx theo đuôi hoặc mime', () => {
    assert.equal(laDocx('Báo cáo.DOCX', ''), true);
    assert.equal(laDocx('x', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), true);
    assert.equal(laXlsx('so-lieu.xlsx', ''), true);
    assert.equal(laXlsx('a.xls', 'application/vnd.ms-excel'), false, '.xls (BIFF) không xem trước được');
    assert.equal(laDocx('a.doc', 'application/msword'), false);
  });
});

describe('dispositionInline', () => {
  it('giữ tên tiếng Việt qua filename*, bản ASCII không có ký tự nguy hiểm', () => {
    const h = dispositionInline('Báo cáo "cuối".md');
    assert.match(h, /^inline; filename="Bao cao _cuoi_.md"; filename\*=UTF-8''/);
    assert.ok(h.includes(encodeURIComponent('Báo cáo "cuối".md')));
    assert.ok(!/[\r\n]/.test(dispositionInline('a\r\nSet-Cookie: x.txt')));
  });
});

describe('xem trước Office', () => {
  it('xlsx ⇒ bảng giá trị, bỏ dòng trống cuối, trần số dòng', () => {
    const s = new XSheet('Kết quả');
    s.set(1, 1, 'Tên').set(1, 2, 'Điểm');
    s.set(2, 1, 'An').set(2, 2, 9.5);
    s.set(3, 1, 'Bình').set(3, 2, { f: 'B2-1', v: 8.5 });
    const big = new XSheet('Lớn');
    for (let r = 1; r <= XLSX_MAX_ROWS + 20; r++) big.set(r, 1, `r${r}`);
    const out = bangXlsx(writeXlsx([s, big]));
    assert.equal(out.kind, 'xlsx');
    assert.equal(out.sheets[0].name, 'Kết quả');
    assert.deepEqual(out.sheets[0].rows, [['Tên', 'Điểm'], ['An', '9.5'], ['Bình', '8.5']]);
    assert.deepEqual(out.sheets[0].cols, ['A', 'B']);
    assert.equal(out.sheets[0].truncated, false);
    assert.equal(out.sheets[1].rows.length, XLSX_MAX_ROWS);
    assert.equal(out.sheets[1].truncated, true);
  });
  it('docx ⇒ HTML có chữ, chữ dạng thẻ bị thoát', async () => {
    const r = await htmlDocx(docxMau(['Xin chào', '<script>alert(1)</script>']));
    assert.equal(r.kind, 'docx');
    assert.match(r.html, /<p>Xin chào<\/p>/);
    assert.ok(!r.html.includes('<script>'), 'mammoth thoát chữ');
  });
  it('tệp hỏng ⇒ 422; zip bomb (giải nén vượt trần) ⇒ 413 trước khi giải', async () => {
    await assert.rejects(() => htmlDocx(Buffer.from('not a zip')), (e: any) => e.statusCode === 422);
    assert.throws(() => bangXlsx(Buffer.from('nope')), (e: any) => e.statusCode === 422);
    const z = new AdmZip();
    z.addFile('word/document.xml', Buffer.alloc(3 * 1024 * 1024, 0x20));
    const buf = z.toBuffer();
    assert.ok(buf.length < 100 * 1024, 'nén rất nhỏ');
    assert.throws(() => kiemZip(buf, 1024 * 1024), (e: any) => e.statusCode === 413);
    assert.doesNotThrow(() => kiemZip(buf, 4 * 1024 * 1024));
  });
});
