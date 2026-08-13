/**
 * Làm sạch ảnh chụp tài liệu — nắn thẳng + đưa nền về trắng.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao cần: cắt hình từ ảnh gốc cho ra hình ĐÚNG 100%, nhưng mẩu cắt mang
 * theo cả nền xám, vệt sáng, nhiễu JPEG và độ nghiêng của tấm ảnh. Dán cạnh
 * chữ Times đen nét căng trong file Word thì nhìn bẩn — người dùng gọi thẳng
 * là "xấu quá", và họ đúng.
 *
 * Ở đây làm hai việc, đều bằng `sharp` (không thêm phụ thuộc nào):
 *
 *  1. NẮN THẲNG bằng "hình chiếu ngang". Xoay thử từng góc nhỏ, mỗi lần cộng
 *     số điểm tối theo từng hàng ngang; trang thẳng thì các dòng chữ nằm gọn
 *     trong ít hàng ⇒ dãy tổng đó dao động MẠNH nhất. Chọn góc cho phương sai
 *     lớn nhất. Đo trên ảnh thu nhỏ 600px nên rất nhẹ.
 *
 *  2. ĐƯA NỀN VỀ TRẮNG: xám hoá → giãn biểu đồ mức xám → tăng tương phản →
 *     làm nét. KHÔNG dùng ngưỡng nhị phân cứng: nét bút chì và nét mảnh của
 *     hình vẽ đứt đoạn ngay, mà hình học thì mất một nét là sai bài.
 */
import sharp from 'sharp';

/** Chỉ dò trong khoảng này — ảnh chụp tay hiếm khi nghiêng quá 6°. */
const GOC_TOI_DA = 6;
const BUOC = 0.5;

/**
 * Đo độ nghiêng và trả về **góc CẦN XOAY để nắn thẳng** — đưa thẳng vào
 * `sharp.rotate()` là xong, không đảo dấu.
 *
 * Đã kiểm bằng ảnh tự xoay sẵn một góc BIẾT TRƯỚC: ảnh xoay +2° → trả −2,0°;
 * ảnh xoay −2° → trả +2,0°; ảnh thẳng → 0,0°. (Bản đầu đảo dấu ở chỗ gọi nên
 * xoay ngược, làm ảnh nghiêng gấp đôi.)
 *
 * Trả 0 khi không chắc — thà để nguyên còn hơn xoay bậy.
 */
export async function doDoNghieng(anh: Buffer): Promise<number> {
  try {
    const nho = await sharp(anh)
      .grayscale()
      .resize({ width: 600, withoutEnlargement: true })
      .normalise()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = nho;
    const W = info.width;
    const H = info.height;
    if (W < 80 || H < 80) return 0;

    /** Phương sai của "số điểm tối mỗi hàng" sau khi xoay `goc` độ. */
    const diem = (goc: number): number => {
      const rad = (goc * Math.PI) / 180;
      const sin = Math.sin(rad);
      const hang = new Float64Array(H);
      // ⚠️ PHẢI quét ĐỦ mọi hàng (y += 1). Bỏ hàng cách hàng thì ở góc 0° mọi
      // điểm rơi trọn vào hàng chẵn còn hàng lẻ trống trơn — dãy tổng thành
      // hình răng lược và phương sai vọt lên giả tạo, khiến góc 0° LÚC NÀO
      // cũng thắng. Đã đo: ảnh xoay đúng 2° vẫn cho đỉnh ở 0°, góc đúng chỉ
      // về nhì. Riêng chiều x thì thưa được, không ảnh hưởng.
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 2) {
          const v = data[y * W * info.channels + x * info.channels];
          if (v > 160) continue; // chỉ đếm điểm tối (chữ/nét)
          const y2 = Math.round(y + (x - W / 2) * sin);
          if (y2 >= 0 && y2 < H) hang[y2] += 1;
        }
      }
      let tong = 0;
      for (let i = 0; i < H; i++) tong += hang[i];
      const tb = tong / H;
      let pv = 0;
      for (let i = 0; i < H; i++) pv += (hang[i] - tb) ** 2;
      return pv / H;
    };

    let tot = 0;
    let diemTot = -1;
    for (let g = -GOC_TOI_DA; g <= GOC_TOI_DA + 1e-9; g += BUOC) {
      const d = diem(g);
      if (d > diemTot) { diemTot = d; tot = g; }
    }
    // Trang gần như trắng (ít điểm tối) thì phép đo vô nghĩa.
    return diemTot > 0 ? tot : 0;
  } catch {
    return 0;
  }
}

export interface TuyChonLamSach {
  /** Nắn thẳng trang. Mặc định bật. */
  nanThang?: boolean;
  /** Đưa nền về trắng. Mặc định bật. */
  langNen?: boolean;
  /** Phóng to nét cho ảnh cắt nhỏ (hình vẽ cắt ra thường chỉ 300-400px). */
  rongToiThieu?: number;
}

/**
 * Làm sạch một ảnh. Hỏng ở bước nào thì trả về ảnh đang có ở bước đó — làm
 * sạch là khâu PHỤ, không được phép làm mất hình của người dùng.
 */
export async function lamSachAnh(anh: Buffer, tuyChon: TuyChonLamSach = {}): Promise<Buffer> {
  const { nanThang = true, langNen = true, rongToiThieu } = tuyChon;
  let ra = anh;

  if (nanThang) {
    try {
      const goc = await doDoNghieng(ra);
      // `doDoNghieng` đã trả về góc CẦN XOAY — không đảo dấu ở đây.
      if (Math.abs(goc) >= 0.4) {
        ra = await sharp(ra).rotate(goc, { background: '#ffffff' }).toBuffer();
      }
    } catch { /* giữ nguyên */ }
  }

  if (rongToiThieu) {
    try {
      const meta = await sharp(ra).metadata();
      if ((meta.width ?? 0) < rongToiThieu) {
        ra = await sharp(ra).resize({ width: rongToiThieu, kernel: 'lanczos3' }).toBuffer();
      }
    } catch { /* giữ nguyên */ }
  }

  if (langNen) {
    try {
      ra = await sharp(ra)
        .grayscale()
        .normalise()                 // giãn mức xám: chỗ sáng nhất → trắng
        .linear(1.45, -48)           // tăng tương phản, đẩy nền xám lên trắng
        .median(1)                   // xoá hạt nhiễu JPEG, giữ nét
        .sharpen({ sigma: 0.8 })
        .png()
        .toBuffer();
    } catch { /* giữ nguyên */ }
  }

  return ra;
}
