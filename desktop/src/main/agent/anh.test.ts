/**
 * Hình học của `sua_anh`.
 *
 * Kiểm phần TÍNH, không kiểm `nativeImage` — Electron không chạy được dưới
 * vitest. Nhưng mọi lỗi đã từng làm hỏng một tấm ảnh đều nằm ở phần tính:
 * khung tràn mép, làm tròn xuống một điểm ảnh, và thứ tự byte BGRA.
 */
import { describe, expect, it } from 'vitest';
import { docMau, ghepLenNen, kepKhung, tinhBia, tinhVua, dinhDangTheoTen } from './anh';

describe('kepKhung', () => {
  it('giữ nguyên khung đã nằm gọn trong ảnh', () => {
    expect(kepKhung({ x: 10, y: 20, rong: 100, cao: 50 }, { rong: 800, cao: 600 }))
      .toEqual({ x: 10, y: 20, rong: 100, cao: 50 });
  });

  it('cắt phần tràn mép thay vì trả về ảnh rỗng', () => {
    // Model ước lượng toạ độ trên tấm ảnh đã co nên hay đưa khung vượt biên.
    // `nativeImage.crop` với khung này trả ảnh RỖNG mà không ném lỗi.
    expect(kepKhung({ x: 700, y: 500, rong: 400, cao: 400 }, { rong: 800, cao: 600 }))
      .toEqual({ x: 700, y: 500, rong: 100, cao: 100 });
  });

  it('trả null khi khung nằm hẳn ngoài ảnh', () => {
    expect(kepKhung({ x: 900, y: 0, rong: 10, cao: 10 }, { rong: 800, cao: 600 }))
      .toEqual({ x: 799, y: 0, rong: 1, cao: 10 });
    expect(kepKhung({ x: 0, y: 0, rong: 0, cao: 10 }, { rong: 800, cao: 600 })).toBeNull();
  });
});

describe('tinhBia', () => {
  it('phủ kín khung đích, không để lọt viền', () => {
    // Ảnh vuông → bìa 1200×630. Bước co PHẢI cho cả hai cạnh ≥ cạnh đích,
    // nếu không bước cắt sau đó trả về ảnh rỗng.
    const { co, cat } = tinhBia({ rong: 1000, cao: 1000 }, { rong: 1200, cao: 630 });
    expect(co.rong).toBeGreaterThanOrEqual(1200);
    expect(co.cao).toBeGreaterThanOrEqual(630);
    expect(cat).toEqual({ x: 0, y: Math.round((co.cao - 630) / 2), rong: 1200, cao: 630 });
  });

  it('ảnh rất ngang thì cắt hai bên, giữ giữa', () => {
    const { co, cat } = tinhBia({ rong: 4000, cao: 1000 }, { rong: 1200, cao: 630 });
    expect(co.cao).toBeGreaterThanOrEqual(630);
    expect(cat.x).toBeGreaterThan(0);
    expect(cat.y).toBe(0);
  });

  it('ảnh nhỏ hơn khung vẫn được phóng lên cho đủ', () => {
    const { co } = tinhBia({ rong: 300, cao: 300 }, { rong: 1200, cao: 630 });
    expect(co.rong).toBeGreaterThanOrEqual(1200);
  });

  /* Đây là phép kiểm bắt lỗi làm tròn XUỐNG. Với `Math.round` thay vì
     `Math.ceil`, một số cặp kích thước cho ra ảnh co HẸP hơn khung đích đúng
     một điểm ảnh, và tấm bìa ra rỗng — hỏng câm, chỉ một vài cỡ mới dính. */
  it('không cặp kích thước nào làm ảnh co hụt so với khung đích', () => {
    for (let w = 101; w < 2000; w += 37) {
      for (let h = 97; h < 2000; h += 53) {
        const { co } = tinhBia({ rong: w, cao: h }, { rong: 1200, cao: 630 });
        expect(co.rong).toBeGreaterThanOrEqual(1200);
        expect(co.cao).toBeGreaterThanOrEqual(630);
      }
    }
  });
});

describe('tinhVua', () => {
  it('giữ trọn ảnh trong khung và canh giữa', () => {
    const { co, le } = tinhVua({ rong: 1000, cao: 500 }, { rong: 400, cao: 400 });
    expect(co).toEqual({ rong: 400, cao: 200 });
    expect(le).toEqual({ x: 0, y: 100 });
  });
});

describe('docMau', () => {
  it('đọc cả dạng 3 và 6 ký tự', () => {
    expect(docMau('#f00')).toEqual([255, 0, 0]);
    expect(docMau('00ff80')).toEqual([0, 255, 128]);
  });
  it('trả null khi sai cú pháp — không đoán bừa', () => {
    expect(docMau('đỏ')).toBeNull();
    expect(docMau('#12345')).toBeNull();
  });
});

describe('ghepLenNen', () => {
  /*
   * ⚠️ PHÉP KIỂM QUAN TRỌNG NHẤT FILE NÀY.
   *
   * Bitmap của Electron là BGRA. Xếp nhầm sang RGBA thì đỏ thành xanh lam —
   * ảnh vẫn dựng ra bình thường, không lỗi nào, và chỉ có người NHÌN tấm ảnh
   * mới phát hiện được.
   */
  it('nền đỏ ra đúng byte BGRA, không phải RGBA', () => {
    const anh = Buffer.alloc(1 * 1 * 4, 0);   // một điểm ảnh đen
    const ra = ghepLenNen(anh, { rong: 1, cao: 1 }, { rong: 3, cao: 1 }, { x: 1, y: 0 }, [255, 0, 0]);
    // Điểm ảnh 0 là nền: B=0, G=0, R=255, A=255
    expect([ra[0], ra[1], ra[2], ra[3]]).toEqual([0, 0, 255, 255]);
    // Điểm ảnh 1 là ảnh đã chép đè lên
    expect([ra[4], ra[5], ra[6], ra[7]]).toEqual([0, 0, 0, 0]);
  });

  it('chép đúng hàng khi ảnh hẹp hơn khung', () => {
    // Ảnh 2×2 toàn 0x11, đặt vào khung 4×2 lệch sang phải 2 cột.
    const anh = Buffer.alloc(2 * 2 * 4, 0x11);
    const ra = ghepLenNen(anh, { rong: 2, cao: 2 }, { rong: 4, cao: 2 }, { x: 2, y: 0 }, [0, 0, 0]);
    // Hàng 1 (chỉ số 1) phải có ảnh ở hai cột CUỐI, không phải hai cột đầu —
    // đây là chỗ một phép tính bước nhảy sai sẽ làm ảnh xô chéo.
    const hang1 = ra.subarray(1 * 4 * 4, 2 * 4 * 4);
    expect([...hang1.subarray(0, 8)]).toEqual([0, 0, 0, 255, 0, 0, 0, 255]);
    expect([...hang1.subarray(8, 16)]).toEqual([0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11]);
  });
});

describe('dinhDangTheoTen', () => {
  it('chỉ nhận đúng thứ nativeImage ghi được', () => {
    expect(dinhDangTheoTen('a/b/bia.PNG')).toBe('png');
    expect(dinhDangTheoTen('bia.jpeg')).toBe('jpeg');
    // webp đọc ĐƯỢC nhưng ghi thì KHÔNG — im lặng cho qua là tạo ra file .webp
    // chứa dữ liệu PNG.
    expect(dinhDangTheoTen('bia.webp')).toBeNull();
    expect(dinhDangTheoTen('bia')).toBeNull();
  });
});
