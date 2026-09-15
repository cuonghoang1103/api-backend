/**
 * Đọc danh sách slide từ nội dung bài (`frontend/src/components/academy/docSlide.ts`).
 *
 * Markup dưới đây lấy NGUYÊN VĂN từ bài 777 (SWT301 · 0.1) trên production
 * 15/09/2026, không phải mẫu tự nghĩ ra. Một bộ kiểm dựng bằng markup tưởng
 * tượng sẽ xanh trong khi hàm không đọc nổi dữ liệu thật — xem
 * [[feedback_verify_by_running_not_reading]].
 *
 * (Phép kiểm của web nằm trong dự án desktop vì web không có bộ chạy kiểm nào;
 * alias `@` của desktop trỏ thẳng sang `frontend/src`.)
 */
import { describe, expect, it } from 'vitest';
import { cauHoiSlide, docSlide, khoaCacheSlide } from '@/components/academy/docSlide';

const THAT = `
<div class="ml-vi giang"><p class="y-chinh">🎯 Bìa bộ slide giới thiệu.</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWT301/v1/swt0/001.webp" alt="SWT0 slide 1: Introduction to the course" loading="lazy" width="1280" height="720" /><p class="chu-thich">📑 <strong>SWT0</strong> · slide 1/21 — Introduction to the course</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWT301/v1/swt0/002.webp" alt="SWT0 slide 2: ISTQB" loading="lazy" width="1280" height="720" /><p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p></div>
<div class="ml-en giang"><p class="y-chinh">🎯 ISTQB writes the syllabus.</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWT301/v1/swt0/004.webp" alt="SWT0 slide 4: Course content (CTFL tree)" loading="lazy" width="1280" height="720" /><p class="chu-thich">📑 <strong>SWT0</strong> · slide 4/21 — Course content (CTFL tree)</p></div>
`;

describe('docSlide', () => {
  it('đọc đúng markup THẬT của bài 777', () => {
    const ds = docSlide(THAT);
    expect(ds).toHaveLength(3);
    expect(ds[0]).toEqual({ so: 1, tong: 21, bo: 'SWT0', ten: 'Introduction to the course' });
    expect(ds[1]).toEqual({ so: 2, tong: 21, bo: 'SWT0', ten: 'ISTQB' });
    expect(ds[2]?.so).toBe(4);   // bài bỏ qua slide 3 — không được tự điền vào
  });

  it('bài không có slide ⇒ mảng rỗng (chỗ gọi ẩn hẳn mục chọn slide)', () => {
    expect(docSlide('<p>bài chỉ có chữ</p>')).toEqual([]);
    expect(docSlide('')).toEqual([]);
    expect(docSlide(null)).toEqual([]);
  });

  it('hai BỘ slide khác nhau, cùng số ⇒ giữ CẢ HAI', () => {
    // Gộp theo số trần là mất một tấm, và người học bấm vào ra nội dung bộ kia.
    const ds = docSlide(`
      <p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p>
      <p class="chu-thich">📑 <strong>SWT1</strong> · slide 2/30 — Test levels</p>
    `);
    expect(ds).toHaveLength(2);
    expect(ds.map((s) => s.bo)).toEqual(['SWT0', 'SWT1']);
  });

  it('cùng bộ, cùng số xuất hiện hai lần ⇒ chỉ giữ một', () => {
    const ds = docSlide(`
      <p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p>
      <p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p>
    `);
    expect(ds).toHaveLength(1);
  });

  it('lùi về alt khi KHÔNG có chú thích nào', () => {
    const ds = docSlide('<img alt="SWT2 slide 7: Static testing" src="x.webp" />');
    expect(ds).toEqual([{ so: 7, tong: 0, bo: 'SWT2', ten: 'Static testing' }]);
  });

  it('có chú thích rồi thì KHÔNG trộn thêm alt', () => {
    // Trộn cả hai là danh sách nửa nọ nửa kia, thứ tự lộn xộn.
    const ds = docSlide(`
      <div class="anh-slide"><img alt="SWT0 slide 9: Khác" src="a.webp" /><p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p></div>
    `);
    expect(ds).toHaveLength(1);
    expect(ds[0]?.so).toBe(2);
  });

  it('giải mã thực thể HTML trong tên slide', () => {
    const ds = docSlide('<p class="chu-thich">📑 <strong>SWT0</strong> · slide 3/21 — Black-box &amp; white-box</p>');
    expect(ds[0]?.ten).toBe('Black-box & white-box');
  });

  it('xếp theo bộ rồi theo số', () => {
    const ds = docSlide(`
      <p class="chu-thich">📑 <strong>SWT1</strong> · slide 1/9 — B</p>
      <p class="chu-thich">📑 <strong>SWT0</strong> · slide 5/21 — A5</p>
      <p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — A2</p>
    `);
    expect(ds.map((s) => `${s.bo}${s.so}`)).toEqual(['SWT02', 'SWT05', 'SWT11']);
  });
});

describe('cauHoiSlide', () => {
  it('nêu CẢ số lẫn tên', () => {
    const q = cauHoiSlide({ so: 2, tong: 21, bo: 'SWT0', ten: 'ISTQB' });
    expect(q).toContain('slide 2/21');
    expect(q).toContain('SWT0');
    expect(q).toContain('ISTQB');
  });
});

describe('khoaCacheSlide', () => {
  it('hai slide khác nhau ⇒ hai khoá khác nhau', () => {
    const a = khoaCacheSlide({ so: 2, tong: 21, bo: 'SWT0', ten: 'x' });
    const b = khoaCacheSlide({ so: 2, tong: 30, bo: 'SWT1', ten: 'y' });
    expect(a).not.toBe(b);
  });

  it('KHÔNG vượt 40 ký tự — máy chủ cắt ở đó', () => {
    // Vượt là hai slide khác nhau bị cắt thành cùng một khoá, và người học
    // nhận nhầm lời giảng của slide khác.
    const k = khoaCacheSlide({ so: 999, tong: 999, bo: 'BO-SLIDE-TEN-RAT-DAI-QUA-MUC-BINH-THUONG', ten: 'z' });
    expect(k.length).toBeLessThanOrEqual(40);
  });
});
