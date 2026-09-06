/**
 * Parser lịch FAP — chỗ này sai thì lịch vào DB sai mà màn hình vẫn xanh.
 *
 * Hai điều được canh chặt nhất, vì cả hai đều hỏng IM LẶNG:
 *  1. Không bao giờ bịa giờ. Không moi được giờ ⇒ dòng đó phải nằm ở `boQua`
 *     để người dùng THẤY, chứ không được biến mất.
 *  2. Không bao giờ đoán bừa thứ. Không suy được ⇒ `weekday = 0`, màn xem
 *     trước bắt chọn. Đoán bừa tạo ra buổi học nằm sai ngày và không ai biết.
 */
import { describe, expect, it } from 'vitest';
import { docLichFAP } from './docLichFAP';

/** Dán y như Chrome trả ra khi bôi đen bảng FAP: ô ngăn bằng TAB. */
const BANG_FAP = [
  '\tMON 07/09\tTUE 08/09\tWED 09/09\tTHU 10/09\tFRI 11/09\tSAT 12/09\tSUN 13/09',
  'Slot 1\tSWT301-View Materials at DE-412 (7:30-9:50) Meet URL\t\tSWT301-View Materials at DE-412 (7:30-9:50)\t\t\t\t',
  'Slot 2\t\tFER202-View Materials at DE-324 (10:00-12:20)\t\tFER202-View Materials at DE-324 (10:00-12:20)\t\t\t',
  'Slot 3\tJPD123-View Materials at BE-101 (12:50-15:10)\t\t\t\tLAB211-View Materials at AL-R201 (12:50-15:10)\t\t',
].join('\n');

describe('docLichFAP — bảng dán từ FAP', () => {
  const kq = docLichFAP(BANG_FAP);

  it('đọc đủ 6 buổi, không bỏ sót ô nào', () => {
    expect(kq.dong).toHaveLength(6);
    expect(kq.boQua).toEqual([]);
  });

  it('cột nào ra thứ nấy', () => {
    const swt = kq.dong.filter((d) => d.subject === 'SWT301');
    expect(swt.map((d) => d.weekday).sort()).toEqual([2, 4]); // MON, WED
    const lab = kq.dong.find((d) => d.subject === 'LAB211');
    expect(lab?.weekday).toBe(6); // FRI
  });

  it('giờ được đệm về HH:mm', () => {
    const swt = kq.dong.find((d) => d.subject === 'SWT301')!;
    expect(swt.startTime).toBe('07:30');
    expect(swt.endTime).toBe('09:50');
  });

  it('moi được phòng và số slot', () => {
    const jpd = kq.dong.find((d) => d.subject === 'JPD123')!;
    expect(jpd.room).toBe('BE-101');
    expect(jpd.slot).toBe(3);
  });

  it('bỏ đuôi rác "View Materials"/"Meet URL" khỏi tên môn', () => {
    for (const d of kq.dong) expect(d.subject).toMatch(/^[A-Z]{2,4}\d{3}$/);
  });

  it('cột nhãn "Slot 1" không bị hiểu thành buổi học', () => {
    expect(kq.dong.every((d) => d.subject !== 'Slot')).toBe(true);
  });
});

describe('docLichFAP — dán theo dòng (mỗi thứ một đoạn)', () => {
  const kq = docLichFAP([
    'Thứ 2',
    'SWT301 phòng DE-412 7:30-9:50',
    'MAE101 phòng DE-115 10:00-12:20',
    'Thứ 4',
    'SWT301 phòng DE-412 7:30-9:50',
  ].join('\n'));

  it('thứ của đoạn áp cho các dòng bên dưới, xếp theo giờ', () => {
    expect(kq.dong.map((d) => `${d.weekday}:${d.subject}@${d.startTime}`))
      .toEqual(['2:SWT301@07:30', '2:MAE101@10:00', '4:SWT301@07:30']);
  });

  it('nhận "phòng X" tiếng Việt', () => {
    expect(kq.dong.map((d) => d.room)).toEqual(['DE-412', 'DE-115', 'DE-412']);
  });
});

describe('docLichFAP — không bao giờ hỏng im lặng', () => {
  it('có mã môn mà KHÔNG có giờ ⇒ vào boQua, không vào dòng', () => {
    const kq = docLichFAP('SWT301-View Materials at DE-412 (Not yet)');
    expect(kq.dong).toEqual([]);
    expect(kq.boQua).toEqual(['SWT301-View Materials at DE-412 (Not yet)']);
  });

  it('có giờ mà không suy được thứ ⇒ weekday = 0, KHÔNG đoán bừa', () => {
    const kq = docLichFAP('SWT301 at DE-412 7:30-9:50');
    expect(kq.dong).toHaveLength(1);
    expect(kq.dong[0]?.weekday).toBe(0);
  });

  it('giờ kết thúc trước giờ bắt đầu ⇒ không nhận', () => {
    const kq = docLichFAP('Thứ 2\nSWT301 9:50-7:30');
    expect(kq.dong).toEqual([]);
    expect(kq.boQua).toHaveLength(1);
  });

  it('giờ vô lý (25:00) ⇒ không nhận', () => {
    expect(docLichFAP('Thứ 2\nSWT301 25:00-26:00').dong).toEqual([]);
  });

  it('chữ rác thuần tuý thì im, không nhét vào boQua', () => {
    expect(docLichFAP('Xin chào\n\nabc').boQua).toEqual([]);
  });

  it('dán rỗng không nổ', () => {
    expect(docLichFAP('')).toEqual({ dong: [], boQua: [] });
  });
});

describe('docLichFAP — bẫy tên thứ', () => {
  it('"THU" của FAP là thứ Năm, không phải "Thứ" tiếng Việt', () => {
    const kq = docLichFAP('\tMON\tTHU\nSlot 1\tSWT301 (7:30-9:50)\tFER202 (7:30-9:50)');
    expect(kq.dong.find((d) => d.subject === 'FER202')?.weekday).toBe(5);
  });

  it('"Thứ 5" tiếng Việt cũng ra 5 dù chứa chữ "Th"', () => {
    expect(docLichFAP('Thứ 5\nSWT301 7:30-9:50').dong[0]?.weekday).toBe(5);
  });

  it('buổi trùng hệt nhau chỉ giữ một', () => {
    const kq = docLichFAP('Thứ 2\nSWT301 7:30-9:50\nSWT301 7:30-9:50');
    expect(kq.dong).toHaveLength(1);
  });
});
