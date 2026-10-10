/**
 * DataTable (UX-C) — lõi thuần + bộ ghi .xlsx. Chạy từ gốc repo: npx tsx --test frontend/src/components/work/table/tableLogic.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  cellText, clampWidth, compareValues, DEFAULT_PREFS, filterRows, fold, normalizePrefs, pageCount, pageSlice, rangeKeys, sortRows,
  toggleColumn, virtualWindow, visibleColumnIds,
} from './tableLogic';
import { buildXlsx, colName, crc32, sheetName, sheetXml, zipStored } from './xlsx';

describe('DataTable — sắp xếp + lọc', () => {
  it('ô trống luôn cuối, số so số, chữ so tự nhiên', () => {
    assert.ok(compareValues(2, 10) < 0);
    assert.ok(compareValues('Iter2', 'Iter10') < 0);
    assert.ok(compareValues(null, 'a') > 0);
    assert.equal(compareValues('', null), 0);
    assert.ok(compareValues(new Date('2026-01-01'), new Date('2026-02-01')) < 0);
  });
  it('sortRows ổn định, trống cuối cả khi đảo chiều', () => {
    const rows = [{ id: 1, v: 3 }, { id: 2, v: null }, { id: 3, v: 1 }, { id: 4, v: 3 }];
    const val = (r: { v: number | null }) => r.v;
    assert.deepEqual(sortRows(rows, { col: 'v', dir: 'asc' }, val).map((r) => r.id), [3, 1, 4, 2]);
    assert.deepEqual(sortRows(rows, { col: 'v', dir: 'desc' }, val).map((r) => r.id), [1, 4, 3, 2]);
    assert.deepEqual(sortRows(rows, null, val).map((r) => r.id), [1, 2, 3, 4]);
  });
  it('lọc nhanh: bỏ dấu, mọi từ phải khớp ở ít nhất một cột', () => {
    const rows = [{ n: 'Nguyễn Văn An', r: 'Dev' }, { n: 'Trần Bình', r: 'QA lead' }, { n: 'Lê Đức', r: 'Dev' }];
    const t = (x: { n: string; r: string }) => [x.n, x.r];
    assert.deepEqual(filterRows(rows, 'nguyen', t).map((x) => x.n), ['Nguyễn Văn An']);
    assert.deepEqual(filterRows(rows, 'dev duc', t).map((x) => x.n), ['Lê Đức']);
    assert.equal(filterRows(rows, '  ', t).length, 3);
    assert.equal(fold('ĐƯỜNG'), 'duong');
  });
});

describe('DataTable — cuộn ảo + phân trang', () => {
  it('cửa sổ hàng 2.000 dòng: chỉ vẽ ~ (khung/hàng + đệm), đệm trên/dưới đúng', () => {
    const w = virtualWindow({ scrollTop: 40 * 1000, viewport: 600, rowHeight: 40, count: 2000, overscan: 8 });
    assert.equal(w.start, 992);
    assert.equal(w.end, 1000 + 16 + 8);
    assert.equal(w.padTop, 992 * 40);
    assert.equal(w.padBottom, (2000 - 1024) * 40);
    assert.ok(w.end - w.start < 40);
    // Đầu bảng / cuối bảng / bảng rỗng.
    assert.deepEqual(virtualWindow({ scrollTop: 0, viewport: 400, rowHeight: 32, count: 5 }), { start: 0, end: 5, padTop: 0, padBottom: 0 });
    const tail = virtualWindow({ scrollTop: 1e9, viewport: 400, rowHeight: 32, count: 100 });
    assert.equal(tail.end, 100);
    assert.deepEqual(virtualWindow({ scrollTop: 0, viewport: 400, rowHeight: 32, count: 0 }), { start: 0, end: 0, padTop: 0, padBottom: 0 });
  });
  it('trang', () => {
    assert.equal(pageCount(0, 50), 1);
    assert.equal(pageCount(101, 50), 3);
    assert.deepEqual(pageSlice([1, 2, 3, 4, 5], 1, 2), [3, 4]);
    assert.deepEqual(pageSlice([1, 2, 3], 9, 2), [3]);
  });
});

describe('DataTable — lựa chọn cột đã lưu + chọn dải', () => {
  const cols = [{ id: 'key', required: true }, { id: 'title' }, { id: 'due', defaultHidden: true }, { id: 'owner' }];
  it('normalizePrefs bỏ cột lạ, độ rộng vô lý, sort hỏng', () => {
    const p = normalizePrefs({ hidden: ['owner', 'gone'], shown: ['due'], widths: { title: 320, owner: 5, zz: 100 }, density: 'compact', sort: { col: 'gone', dir: 'asc' } }, cols.map((c) => c.id));
    assert.deepEqual(p, { hidden: ['owner'], shown: ['due'], widths: { title: 320 }, density: 'compact', sort: null });
    assert.deepEqual(normalizePrefs('garbage', ['a']), DEFAULT_PREFS);
  });
  it('cột hiện: mặc định − ẩn + bật thêm; cột bắt buộc không tắt được', () => {
    assert.deepEqual(visibleColumnIds(cols, DEFAULT_PREFS), ['key', 'title', 'owner']);
    let p = toggleColumn(DEFAULT_PREFS, cols[2]);
    p = toggleColumn(p, cols[3]);
    p = toggleColumn(p, cols[0]);
    assert.deepEqual(visibleColumnIds(cols, p), ['key', 'title', 'due']);
    assert.deepEqual(toggleColumn(toggleColumn(p, cols[3]), cols[3]).hidden, ['owner']);
  });
  it('Shift chọn dải theo thứ tự hiện tại (xuôi/ngược)', () => {
    assert.deepEqual(rangeKeys([5, 3, 9, 1], 3, 1), [3, 9, 1]);
    assert.deepEqual(rangeKeys([5, 3, 9, 1], 1, 5), [5, 3, 9, 1]);
    assert.deepEqual(rangeKeys([5, 3], 7, 3), [3]);
  });
  it('kẹp độ rộng, chữ ô', () => {
    assert.equal(clampWidth(10), 60);
    assert.equal(clampWidth(5000), 1200);
    assert.equal(cellText(new Date('2026-10-11T08:00:00Z')), '2026-10-11');
    assert.equal(cellText(null), '');
    assert.equal(cellText(true), 'Yes');
  });
});

describe('DataTable — xuất .xlsx (ZIP stored + CRC-32)', () => {
  it('CRC-32 chuẩn ("123456789" = CBF43926)', () => {
    assert.equal(crc32(new TextEncoder().encode('123456789')).toString(16), 'cbf43926');
  });
  it('tên cột A…Z, AA…', () => {
    assert.deepEqual([0, 25, 26, 27, 701, 702].map(colName), ['A', 'Z', 'AA', 'AB', 'ZZ', 'AAA']);
    assert.equal(sheetName('Issues: [CLI]/all?'), 'Issues   CLI  all');
  });
  it('sheet: tiêu đề đậm, số là số, chữ có dấu, ký tự đặc biệt được thoát', () => {
    const x = sheetXml(['Key', 'Điểm', 'Ghi chú'], [['CLI-1', 5, 'a < b & "c"'], ['CLI-2', null, 'Tiếng Việt']]);
    assert.ok(x.includes('<c r="A1" t="inlineStr" s="1"><is><t xml:space="preserve">Key</t></is></c>'));
    assert.ok(x.includes('<c r="B2"><v>5</v></c>'));
    assert.ok(!x.includes('r="B3"'));
    assert.ok(x.includes('a &lt; b &amp; &quot;c&quot;'));
    assert.ok(x.includes('Tiếng Việt'));
    assert.ok(x.includes('<autoFilter ref="A1:C3"/>'));
  });
  it('ZIP đọc lại được: đủ 6 phần, kích thước khớp, chữ ký thư mục trung tâm', () => {
    const buf = buildXlsx({ sheet: 'Issues', header: ['A'], rows: [[1], ['x']] });
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    // End of central directory ở 22 byte cuối.
    const eocd = buf.length - 22;
    assert.equal(dv.getUint32(eocd, true), 0x06054b50);
    assert.equal(dv.getUint16(eocd + 10, true), 6);
    const cenOff = dv.getUint32(eocd + 16, true);
    assert.equal(dv.getUint32(cenOff, true), 0x02014b50);
    // Tệp đầu tiên: [Content_Types].xml, CRC trong local header = CRC của dữ liệu.
    assert.equal(dv.getUint32(0, true), 0x04034b50);
    const nameLen = dv.getUint16(26, true);
    const size = dv.getUint32(18, true);
    const name = new TextDecoder().decode(buf.slice(30, 30 + nameLen));
    assert.equal(name, '[Content_Types].xml');
    const data = buf.slice(30 + nameLen, 30 + nameLen + size);
    assert.equal(dv.getUint32(14, true), crc32(data));
    assert.equal(zipStored([]).length, 22);
  });
});

describe('WBS (UX-C) — cây gập/mở, Gantt theo nhánh, kéo-thả', async () => {
  const { visibleTree, branchSpans, planDrop, siblingsOf } = await import('../school/wbsLogic');
  // E1 ⊃ S1 ⊃ K ; E1 ⊃ S2 ; S3 (gốc)
  const rows = [
    { issueId: 1, number: 1, depth: 0, childCount: 2, parentNumber: null, level: 1, start: null, due: null },
    { issueId: 2, number: 2, depth: 1, childCount: 1, parentNumber: 1, level: 0, start: '2026-10-01', due: '2026-10-03' },
    { issueId: 3, number: 3, depth: 2, childCount: 0, parentNumber: 2, level: -1, start: '2026-10-02', due: '2026-10-08' },
    { issueId: 4, number: 4, depth: 1, childCount: 0, parentNumber: 1, level: 0, start: null, due: '2026-09-28' },
    { issueId: 5, number: 5, depth: 0, childCount: 0, parentNumber: null, level: 0, start: '2026-10-10', due: null },
  ];
  const n = (k: number) => rows.find((r) => r.number === k)!;
  it('gập nhánh ẩn đúng con cháu', () => {
    assert.deepEqual(visibleTree(rows, new Set([2])).map((r) => r.number), [1, 2, 4, 5]);
    assert.deepEqual(visibleTree(rows, new Set([1])).map((r) => r.number), [1, 5]);
    assert.deepEqual(visibleTree(rows, new Set()).map((r) => r.number), [1, 2, 3, 4, 5]);
  });
  it('khoảng ngày theo nhánh', () => {
    const s = branchSpans(rows);
    assert.deepEqual(s.get(1), { start: '2026-09-28', end: '2026-10-08', own: false });
    assert.deepEqual(s.get(2), { start: '2026-10-01', end: '2026-10-08', own: true });
    assert.deepEqual(s.get(5), { start: '2026-10-10', end: '2026-10-10', own: true });
  });
  it('kéo-thả hợp lệ / không hợp lệ', () => {
    assert.deepEqual(planDrop(rows, n(4), n(2), 'before'), { parentNumber: 1, beforeNumber: 2 });
    assert.deepEqual(planDrop(rows, n(5), n(1), 'into'), { parentNumber: 1, afterNumber: 4 });
    assert.deepEqual(planDrop(rows, n(3), n(4), 'into'), { parentNumber: 4 });
    assert.equal(planDrop(rows, n(3), n(5), 'after'), null, 'sub-task không đứng gốc');
    assert.equal(planDrop(rows, n(2), n(3), 'into'), null, 'không thả vào con cháu');
    assert.equal(planDrop(rows, n(4), n(5), 'into'), null, 'story không làm cha story');
    assert.equal(planDrop(rows, n(1), n(1), 'before'), null);
    assert.deepEqual(siblingsOf(rows, n(2)).map((r) => r.number), [2, 4]);
  });
});
