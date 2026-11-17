import { describe, expect, it } from 'vitest';
import { cauTaiThoiDiem, docSrt } from './srt';

describe('docSrt', () => {
  it('đọc SRT chuẩn, nhiều dòng', () => {
    const ds = docSrt('1\n00:00:01,000 --> 00:00:02,500\nXin chào\nthế giới\n\n2\n00:00:03,000 --> 00:00:04,000\nCâu hai\n');
    expect(ds).toEqual([
      { batDau: 1, ketThuc: 2.5, chu: 'Xin chào\nthế giới' },
      { batDau: 3, ketThuc: 4, chu: 'Câu hai' },
    ]);
  });
  it('chịu BOM, CRLF, mili giây dấu chấm, giờ một chữ số, thiếu số thứ tự, thẻ định dạng', () => {
    const s = '﻿1\r\n0:00:01.5 --> 0:00:02.25\r\n<i>nghiêng</i> {\\an8}trên\r\n\r\n00:01:00,000 --> 00:01:01,000\r\n大家好\r\n';
    const ds = docSrt(s);
    expect(ds).toHaveLength(2);
    expect(ds[0]).toEqual({ batDau: 1.5, ketThuc: 2.25, chu: 'nghiêng trên' });
    expect(ds[1]).toEqual({ batDau: 60, ketThuc: 61, chu: '大家好' });
  });
  it('bỏ câu rỗng, sắp theo thời gian, tệp rác ⇒ rỗng', () => {
    expect(docSrt('2\n00:00:05,000 --> 00:00:06,000\nB\n\n1\n00:00:01,000 --> 00:00:02,000\nA\n\n3\n00:00:07,000 --> 00:00:08,000\n\n').map((c) => c.chu)).toEqual(['A', 'B']);
    expect(docSrt('không phải phụ đề')).toEqual([]);
  });
});

describe('cauTaiThoiDiem', () => {
  const ds = docSrt('1\n00:00:01,000 --> 00:00:03,000\nA\n\n2\n00:00:02,000 --> 00:00:10,000\nB dài\n\n3\n00:00:04,000 --> 00:00:05,000\nC\n');
  it('trả câu đang hiện, kể cả câu chồng lên nhau', () => {
    expect(cauTaiThoiDiem(ds, 0.5)).toBeNull();
    expect(cauTaiThoiDiem(ds, 1)?.chu).toBe('A');
    expect(cauTaiThoiDiem(ds, 2.5)?.chu).toBe('B dài');
    expect(cauTaiThoiDiem(ds, 4.5)?.chu).toBe('C');
    expect(cauTaiThoiDiem(ds, 6)?.chu).toBe('B dài');
    expect(cauTaiThoiDiem(ds, 10)).toBeNull();
    expect(cauTaiThoiDiem([], 1)).toBeNull();
  });
});
