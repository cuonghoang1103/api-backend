/**
 * Đọc PDF — kiểm bằng PDF THẬT, dựng tại chỗ.
 *
 * ─── Không mock `unpdf` ───
 * Cả điểm của bài kiểm này là chứng minh thư viện chạy được trong tiến trình
 * chính và dựng lại ĐÚNG THỨ TỰ ĐỌC từ toạ độ. Mock nó đi thì bài kiểm chỉ còn
 * kiểm chính cái mock — xem [[feedback_verify_the_checker_before_the_content]].
 *
 * ─── Không mượn `pdfkit` của backend ───
 * Bản đầu `import` pdfkit từ `../../../node_modules`. Nó chạy trên máy này và
 * sẽ hỏng ở bất cứ đâu chạy `desktop/` một mình. PDF tối thiểu viết tay dưới
 * đây dài 30 dòng, không phụ thuộc gì, và quan trọng hơn: nó cho phép đặt CHÍNH
 * XÁC toạ độ từng mẩu chữ — thứ cần để kiểm việc dựng lại dòng.
 */
import { describe, it, expect } from 'vitest';
import { docPdf } from './docPdf';

/** Một mẩu chữ đặt tại toạ độ (x, y) theo hệ của PDF: gốc ở ĐÁY trang. */
interface Chu { x: number; y: number; co: number; chu: string }

/**
 * Dựng một PDF hợp lệ, không nén, nhiều trang.
 *
 * Bảng `xref` phải mang OFFSET BYTE thật của từng object, nên phải dựng thân
 * file trước rồi mới tính được — đó là lý do hàm này ghép chuỗi theo thứ tự
 * chứ không dùng template.
 */
function taoPdf(trang: Chu[][]): Buffer {
  const obj: string[] = [];
  const soTrang = trang.length;

  // 1 = Catalog, 2 = Pages, rồi mỗi trang chiếm 2 object (Page + Contents),
  // object cuối là Font.
  const idFont = 3 + soTrang * 2;
  const idTrang = (i: number) => 3 + i * 2;
  const idNoi = (i: number) => 4 + i * 2;

  obj[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  obj[2] = `<< /Type /Pages /Kids [${trang.map((_, i) => `${idTrang(i)} 0 R`).join(' ')}] /Count ${soTrang} >>`;

  trang.forEach((chu, i) => {
    const than = chu
      .map((c) => `BT /F1 ${c.co} Tf ${c.x} ${c.y} Td (${c.chu.replace(/([()\\])/g, '\\$1')}) Tj ET`)
      .join('\n');
    obj[idTrang(i)] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] `
      + `/Resources << /Font << /F1 ${idFont} 0 R >> >> /Contents ${idNoi(i)} 0 R >>`;
    obj[idNoi(i)] = `<< /Length ${Buffer.byteLength(than)} >>\nstream\n${than}\nendstream`;
  });

  obj[idFont] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  let ra = '%PDF-1.4\n';
  const offset: number[] = [];
  for (let i = 1; i < obj.length; i += 1) {
    offset[i] = Buffer.byteLength(ra);
    ra += `${i} 0 obj\n${obj[i]}\nendobj\n`;
  }

  const xref = Buffer.byteLength(ra);
  ra += `xref\n0 ${obj.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < obj.length; i += 1) {
    ra += `${String(offset[i]).padStart(10, '0')} 00000 n \n`;
  }
  ra += `trailer\n<< /Size ${obj.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  return Buffer.from(ra, 'latin1');
}

describe('docPdf', () => {
  it('rút được chữ và GIỮ ĐÚNG THỨ TỰ ĐỌC (trên→dưới)', async () => {
    /* Cố tình xếp NGƯỢC trong mảng: mẩu nằm dưới cùng trang được ghi TRƯỚC.
       Nếu code chỉ nối theo thứ tự pdfjs trả về thì phép so sánh dưới sẽ đảo. */
    const pdf = taoPdf([[
      { x: 50, y: 600, co: 12, chu: 'MA SO: 4242' },
      { x: 50, y: 700, co: 20, chu: 'KE HOACH 20 TUAN' },
      { x: 50, y: 650, co: 12, chu: 'Tuan 1: dung nen tang' },
    ]]);

    const r = await docPdf(pdf);
    expect(r.soTrang).toBe(1);
    expect(r.banScan).toBe(false);
    expect(r.text).toContain('KE HOACH 20 TUAN');
    expect(r.text).toContain('MA SO: 4242');
    expect(r.text.indexOf('KE HOACH')).toBeLessThan(r.text.indexOf('Tuan 1'));
    expect(r.text.indexOf('Tuan 1')).toBeLessThan(r.text.indexOf('MA SO'));
  });

  it('gộp các mẩu CÙNG MỘT DÒNG theo trái→phải, không xé thành nhiều dòng', async () => {
    // Ba mẩu cùng y — đúng cách pdfjs cắt một dòng có nhiều kiểu chữ.
    const pdf = taoPdf([[
      { x: 300, y: 700, co: 12, chu: 'GIUA' },
      { x: 50, y: 700, co: 12, chu: 'TRAI' },
      { x: 500, y: 700, co: 12, chu: 'PHAI' },
    ]]);
    const r = await docPdf(pdf);
    expect(r.text.split('\n').filter(Boolean)).toHaveLength(1);
    expect(r.text).toMatch(/TRAI.*GIUA.*PHAI/);
  });

  it('lấy chữ của MỌI trang và đếm đúng số trang', async () => {
    const pdf = taoPdf([
      [{ x: 50, y: 700, co: 14, chu: 'TRANG MOT' }],
      [{ x: 50, y: 700, co: 14, chu: 'TRANG HAI' }],
      [{ x: 50, y: 700, co: 14, chu: 'TRANG BA' }],
    ]);
    const r = await docPdf(pdf);
    expect(r.soTrang).toBe(3);
    expect(r.text).toContain('TRANG MOT');
    expect(r.text).toContain('TRANG HAI');
    expect(r.text).toContain('TRANG BA');
  });

  it('PDF KHÔNG có chữ chọn được ⇒ báo BẢN SCAN, không trả chuỗi rỗng câm', async () => {
    const r = await docPdf(taoPdf([[], [], []]));
    expect(r.banScan).toBe(true);
    expect(r.text).toBe('');
  });

  /*
   * HỒI QUY. Bắt được bằng cách CHẠY chunk đã dựng, không phải bằng đọc mã:
   * ngưỡng `banScan` ban đầu là `max(30, soTrang*20)`, nên một PDF một trang
   * chứa 18 ký tự bị gắn cờ "bản scan" dù chữ rút ra hoàn toàn đúng — và
   * `read_file` sẽ bảo người dùng đi OCR một file nó vừa đọc được.
   */
  it('PDF NGẮN nhưng CÓ chữ thì KHÔNG được gắn cờ bản scan', async () => {
    const r = await docPdf(taoPdf([[{ x: 50, y: 700, co: 20, chu: 'BAN DUNG CHAY DUOC' }]]));
    expect(r.text).toBe('BAN DUNG CHAY DUOC');
    expect(r.banScan).toBe(false);
  });

  it('chữ CỰC ít trải trên nhiều trang thì vẫn là nghi vấn bản scan', async () => {
    // Chỉ số trang lọt ra — dấu hiệu kinh điển của bản scan.
    const r = await docPdf(taoPdf([
      [{ x: 300, y: 40, co: 8, chu: '1' }],
      [{ x: 300, y: 40, co: 8, chu: '2' }],
      [{ x: 300, y: 40, co: 8, chu: '3' }],
    ]));
    expect(r.banScan).toBe(true);
    expect(r.text).not.toBe('');     // vẫn giữ lại thứ rút được
  });

  it('file không phải PDF thì NÉM, để chỗ gọi báo đúng lý do', async () => {
    await expect(docPdf(Buffer.from('day khong phai pdf'))).rejects.toThrow();
  });

  it('cắt bớt khi quá dài và BÁO là đã cắt', async () => {
    /* ~200 trang × 40 dòng × ~60 ký tự ≈ 480k ký tự, vượt xa trần 120k. */
    const dai = Array.from({ length: 200 }, (_, t) =>
      Array.from({ length: 40 }, (_, d): Chu => ({
        x: 50, y: 760 - d * 18, co: 9,
        chu: `Trang ${t} dong ${d} — noi dung lap lai de lam day file cho du dai.`,
      })));
    const r = await docPdf(taoPdf(dai));
    expect(r.catBot).toBe(true);
    expect(r.text.length).toBe(120_000);
  }, 60_000);
});
