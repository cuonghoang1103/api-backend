/**
 * Trình xem tệp CT Work — phần thuần.
 *   npx tsx --test frontend/src/components/work/xemTep/loaiTep.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canNoiDungChu, canXemTruoc, dinhDangJson, doanDauPhan, duoiTep, giaiMa, kepZoom, laSvg, loaiTep, nhanNgonNgu, tachCsv, tachDong, ZOOM_MAX, ZOOM_MIN } from './loaiTep';

describe('loaiTep — đuôi trước, mime sau', () => {
  it('bảng đuôi', () => {
    const bang: Array<[string, string]> = [
      ['a.PNG', 'image'], ['b.jpeg', 'image'], ['c.svg', 'image'], ['d.pdf', 'pdf'], ['e.mp4', 'video'], ['f.mov', 'video'], ['g.mp3', 'audio'],
      ['h.m4a', 'audio'], ['i.md', 'markdown'], ['j.csv', 'csv'], ['k.tsv', 'csv'], ['l.json', 'json'], ['m.tsx', 'code'], ['n.java', 'code'],
      ['o.yaml', 'code'], ['p.xml', 'code'], ['q.html', 'code'], ['r.log', 'text'], ['s.txt', 'text'], ['Báo cáo.docx', 'docx'], ['t.xlsx', 'xlsx'],
      ['u.pptx', 'none'], ['v.zip', 'none'], ['w.heic', 'none'], ['x.xls', 'none'], ['y.doc', 'none'], ['Dockerfile', 'code'], ['.env.local', 'code'],
    ];
    for (const [n, l] of bang) assert.equal(loaiTep(n, 'application/octet-stream'), l, n);
  });
  it('đuôi lạ ⇒ theo mime; .webm có mime audio ⇒ audio', () => {
    assert.equal(loaiTep('anh', 'image/png'), 'image');
    assert.equal(loaiTep('tai-lieu', 'application/pdf'), 'pdf');
    assert.equal(loaiTep('ghi', 'text/plain; charset=utf-8'), 'text');
    assert.equal(loaiTep('x', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'), 'xlsx');
    assert.equal(loaiTep('voice.webm', 'audio/webm'), 'audio');
    assert.equal(loaiTep('clip.webm', 'video/webm'), 'video');
    assert.equal(loaiTep('x', ''), 'none');
    assert.equal(loaiTep('x', null), 'none');
  });
  it('nhóm tuyến máy chủ', () => {
    assert.ok(['markdown', 'csv', 'json', 'code', 'text'].every((l) => canNoiDungChu(l as never)));
    assert.ok(!canNoiDungChu('image') && !canNoiDungChu('docx'));
    assert.ok(canXemTruoc('docx') && canXemTruoc('xlsx') && !canXemTruoc('pdf'));
  });
  it('đuôi, nhãn ngôn ngữ, svg', () => {
    assert.equal(duoiTep('thu.muc/A.B.Ts'), 'ts');
    assert.equal(duoiTep('.gitignore'), '.gitignore');
    assert.equal(duoiTep('noext'), '');
    assert.equal(nhanNgonNgu('Main.java'), 'Java');
    assert.equal(nhanNgonNgu('a.txt'), null);
    assert.ok(laSvg('x.svg') && laSvg('x', 'image/svg+xml') && !laSvg('x.png', 'image/png'));
  });
});

describe('CSV', () => {
  it('ngoặc kép chứa dấu phẩy, xuống dòng, "" ; CRLF; BOM', () => {
    const { rows, truncated } = tachCsv('﻿Tên,Ghi chú\r\n"Nguyễn, An","dòng 1\ndòng 2"\r\nBình,"nói ""chào"""\r\n');
    assert.deepEqual(rows, [['Tên', 'Ghi chú'], ['Nguyễn, An', 'dòng 1\ndòng 2'], ['Bình', 'nói "chào"']]);
    assert.equal(truncated, false);
  });
  it('ô trống, dòng cuối không xuống dòng, trần số dòng', () => {
    assert.deepEqual(tachCsv('a,,c\n1,2,').rows, [['a', '', 'c'], ['1', '2', '']]);
    const r = tachCsv('1\n2\n3\n4\n', ',', 2);
    assert.deepEqual(r.rows, [['1'], ['2']]);
    assert.equal(r.truncated, true);
    assert.equal(tachCsv('1\n2\n', ',', 2).truncated, false);
  });
  it('đoán dấu phân cách', () => {
    assert.equal(doanDauPhan('a;b;c\n1;2;3'), ';');
    assert.equal(doanDauPhan('a,b\n'), ',');
    assert.equal(doanDauPhan('a\tb\tc'), '\t');
    assert.equal(doanDauPhan('"x;y",b,c'), ',', 'dấu ; trong ngoặc không tính');
    assert.equal(doanDauPhan('a,b', 'f.tsv'), '\t');
    assert.deepEqual(tachCsv('a;b\n1;2', ';').rows, [['a', 'b'], ['1', '2']]);
  });
});

describe('chữ', () => {
  it('JSON đẹp hoặc giữ nguyên', () => {
    assert.deepEqual(dinhDangJson('{"a":1}'), { text: '{\n  "a": 1\n}', ok: true });
    assert.deepEqual(dinhDangJson('{oops'), { text: '{oops', ok: false });
  });
  it('tách dòng: bỏ dòng trống cuối do xuống dòng kết thúc tệp', () => {
    assert.deepEqual(tachDong('a\nb\n'), ['a', 'b']);
    assert.deepEqual(tachDong('a\r\nb'), ['a', 'b']);
    assert.deepEqual(tachDong(''), ['']);
  });
  it('giải mã UTF-8 / UTF-16 có BOM', () => {
    assert.equal(giaiMa(new TextEncoder().encode('Tiếng Việt').buffer as ArrayBuffer), 'Tiếng Việt');
    const u16 = new Uint8Array([0xff, 0xfe, 0x41, 0x00, 0x42, 0x00]);
    assert.equal(giaiMa(u16.buffer), 'AB');
  });
  it('kẹp zoom', () => {
    assert.equal(kepZoom(100), ZOOM_MAX);
    assert.equal(kepZoom(0), ZOOM_MIN);
    assert.equal(kepZoom(1.5), 1.5);
  });
});
