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
      ra = await canSangCucBo(ra);
    } catch { /* giữ nguyên */ }
  }

  return ra;
}

/**
 * CÂN SÁNG CỤC BỘ (flat-field) — thứ duy nhất trị được bóng đổ.
 *
 * Bản đầu dùng `normalise()` + `linear()`, tức chỉnh mức xám cho TOÀN ảnh
 * bằng một công thức duy nhất. Ảnh chụp trang giấy dưới đèn thì độ sáng
 * KHÔNG đều — bóng tay, bóng đèn vắt chéo trang — nên một công thức chung
 * không thể vừa cứu chỗ tối vừa không cháy chỗ sáng. Kết quả: người dùng nhận
 * mẩu hình nửa trắng nửa xám đen, "màu không đồng nhau".
 *
 * Cách đúng (mọi app scan tài liệu đều làm): ước lượng ĐỘ SÁNG NỀN tại từng
 * chỗ bằng một bản làm mờ rất mạnh, rồi CHIA ảnh gốc cho nền đó. Nền sáng hay
 * tối gì cũng về trắng, còn nét vẽ — vốn tối hơn hẳn nền quanh nó — vẫn đen.
 */
async function canSangCucBo(anh: Buffer): Promise<Buffer> {
  // Khử hạt TRƯỚC khi chia. Vùng ảnh tối có tỉ lệ tín hiệu/nhiễu rất thấp,
  // phép chia lại khuếch đại nhiễu lên — đo được: ảnh chụp tối nặng cho ra
  // các VỆT SỌC DỌC ở nửa tối. `median` xoá hạt mà vẫn giữ nét thẳng.
  const { data, info } = await sharp(anh).grayscale().median(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const KA = info.channels; // ĐỌC ra, không đoán

  // Bán kính ước lượng nền — chọn con số này là một sự đánh đổi:
  //   quá NHỎ ⇒ chính nét vẽ bị coi là nền và bị xoá trắng;
  //   quá LỚN ⇒ nền không bám kịp MÉP bóng đổ, để lại hai vệt xám dọc theo
  //             ranh giới vùng tối — đúng "vệt đen" người dùng thấy.
  // Đo thật trên mẩu có vệt bóng dọc mép gắt (% điểm XÁM còn sót / % MỰC giữ được):
  //     1/12 → 15,14% xám · 1,68% mực     1/30 → 2,30% · 1,61%
  //     1/45 →  1,19% xám · 1,59% mực     1/60 → 0,34% · 1,55%
  // Tức thu bán kính lại làm vệt xám giảm 44 lần mà chỉ mất ~7% nét. Chọn
  // 1/50 để còn dư an toàn cho hình vẽ nét ĐẬM (bút lông, phô-tô đậm) — nét
  // càng dày thì càng cần bán kính lớn hơn nó nhiều lần.
  const sigma = Math.max(10, Math.round(Math.min(W, H) / 50));

  // ⚠️ Đưa raw 1 kênh vào `sharp` rồi `.blur()` thì bản ra có thể là 3 KÊNH
  // (sharp tự về sRGB). Bản đầu đọc `nen[i]` như thể 1 kênh ⇒ lệch 1/3 bước ⇒
  // bản đồ nền thành rác ⇒ ảnh ra kẻ SỌC NGANG đen trắng. Ép b-w và vẫn đọc
  // số kênh thật ra mà dùng.
  const nenRa = await sharp(data, { raw: { width: W, height: H, channels: KA as 1 | 2 | 3 | 4 } })
    .blur(sigma)
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const nen = nenRa.data;
  const KN = nenRa.info.channels;

  const ra = Buffer.allocUnsafe(W * H);
  for (let i = 0; i < W * H; i++) {
    const g = data[i * KA];
    const b = nen[i * KN] || 1;
    // Tỉ lệ so với nền tại CHỖ ĐÓ: 1.0 = sáng bằng nền → trắng.
    let v = (g / b) * 255;
    // Kéo giãn quanh ngưỡng nền: >98% nền coi như giấy trắng, <62% là nét đen.
    v = ((v - 158) / (250 - 158)) * 255;
    ra[i] = v < 0 ? 0 : v > 255 ? 255 : v;
  }

  return sharp(ra, { raw: { width: W, height: H, channels: 1 } })
    .median(1)
    .sharpen({ sigma: 0.7 })
    .png()
    .toBuffer();
}

/**
 * Bỏ mọi DÒNG CHỮ nằm rời khỏi hình.
 *
 * Cách cũ đi từ MÉP vào: chỉ dám gọt trong rìa 20% chiều cao. Khung do model
 * chỉ ra mà rộng tay — đo trên ảnh thật của người dùng: HAI dòng đề phía trên
 * và HAI dòng phía dưới — thì các dòng bên trong nằm ngoài tầm với, và mẩu
 * hình vẫn "mang theo chữ vào".
 *
 * Cách này ngược lại: tìm KHỐI MỰC CHÍNH (dải cao nhất — chính là hình vẽ),
 * rồi nhận thêm những dải NẰM SÁT nó (đó là nhãn điểm: x, y, A, B… luôn dính
 * quanh nét), và cắt bỏ tất cả phần còn lại. Bao nhiêu dòng chữ, ở trên hay ở
 * dưới, xa hay gần, đều rụng hết.
 */
export async function catChuODau(anh: Buffer): Promise<Buffer> {
  try {
    const { data, info } = await sharp(anh).grayscale().raw().toBuffer({ resolveWithObject: true });
    const W = info.width;
    const H = info.height;
    const C = info.channels;

    const demHang = (y: number): number => {
      let n = 0;
      for (let x = 0; x < W; x += 2) if (data[(y * W + x) * C] < 150) n++;
      return n;
    };

    // Gom các hàng có mực thành dải liên tiếp (cho phép hở tối đa 3 hàng).
    //
    // ⚠️ NGƯỠNG PHẢI RẤT THẤP. Bản trước đòi mỗi hàng có >1,7% bề ngang là
    // mực — mức đó hợp với DÒNG CHỮ (dày đặc) nhưng HÌNH VẼ NÉT MẢNH thì
    // trượt sạch: một hàng cắt ngang hai đường kẻ chỉ có 2-3 điểm tối. Hậu
    // quả đo được: cả hình chỉ hiện ra hai dải cao 4px, còn ba dải "cao nhất"
    // lại chính là ba dòng chữ ⇒ thuật toán tưởng CHỮ mới là hình và giữ lại
    // đúng thứ cần bỏ. Nay chỉ cần 2 mẫu tối là tính có mực; hạt nhiễu do
    // bước lọc bụi bên dưới lo.
    const daiTho: Array<{ dau: number; cuoi: number; muc: number }> = [];
    for (let y = 0; y < H; y++) {
      const m = demHang(y);
      if (m < 2) continue;
      const cuoi = daiTho[daiTho.length - 1];
      if (cuoi && y - cuoi.cuoi <= 3) { cuoi.cuoi = y; cuoi.muc += m; }
      else daiTho.push({ dau: y, cuoi: y, muc: m });
    }

    // Vứt hạt bụi: dải mỏng mà thưa mực. Một chấm 1 pixel từng chặn đứng cả
    // bộ gọt ở bản trước.
    const dai = daiTho.filter((d) => d.cuoi - d.dau + 1 > 3 || d.muc > (W / 2) * 0.06);
    if (dai.length < 2) return anh;

    /**
     * MẬT ĐỘ MỰC — thước phân biệt CHỮ với NÉT VẼ, mạnh hơn mọi thước khác.
     * Một hàng chữ có 10-40% số mẫu là điểm tối; một hàng cắt ngang hình vẽ
     * chỉ có 2-5 mẫu trên vài trăm. Đo trên ảnh dựng lại: dòng chữ 0,101 —
     * hình vẽ 0,012, cách nhau gần 10 lần.
     */
    const matDo = (d: { dau: number; cuoi: number; muc: number }): number =>
      d.muc / ((d.cuoi - d.dau + 1) * (W / 2));
    const NGUONG_CHU = 0.04;

    // Khối chính = dải CAO NHẤT trong số các dải KHÔNG PHẢI CHỮ. Chọn theo mỗi
    // chiều cao là hỏng: một dòng chữ in đậm cao 31px có thể cao hơn một mảnh
    // hình bị đứt quãng.
    let chinh = -1;
    for (let i = 0; i < dai.length; i++) {
      if (matDo(dai[i]) >= NGUONG_CHU) continue;
      if (chinh < 0 || dai[i].cuoi - dai[i].dau > dai[chinh].cuoi - dai[chinh].dau) chinh = i;
    }
    if (chinh < 0) return anh; // toàn chữ, không có hình → đừng đụng
    const caoChinh = dai[chinh].cuoi - dai[chinh].dau + 1;
    // Khối chính phải ra dáng một hình vẽ; nếu nó cũng mỏng như dòng chữ thì
    // mẩu này không phải hình — đừng đụng vào.
    if (caoChinh < H * 0.12) return anh;

    // Nhận thêm các dải NẰM SÁT khối chính — đó là nhãn của hình hoặc mảnh
    // hình bị đứt. TUYỆT ĐỐI không nhận dải nào là CHỮ, dù nó nằm sát tới đâu:
    // đo trên ảnh thật, một dấu ":" nằm ngay trên hình được nhận là nhãn, rồi
    // từ đó "bắc cầu" lên nốt cả dòng chữ đề phía trên.
    const KHE_GAN = Math.min(30, Math.max(6, H * 0.035));
    const nhanDuoc = (i: number): boolean => matDo(dai[i]) < NGUONG_CHU;
    let tren = chinh;
    while (tren > 0 && dai[tren].dau - dai[tren - 1].cuoi <= KHE_GAN && nhanDuoc(tren - 1)) tren--;
    let duoi = chinh;
    while (duoi < dai.length - 1 && dai[duoi + 1].dau - dai[duoi].cuoi <= KHE_GAN && nhanDuoc(duoi + 1)) duoi++;

    const LE_GIU = 8;
    const dinh = Math.max(0, dai[tren].dau - LE_GIU);
    const day = Math.min(H, dai[duoi].cuoi + LE_GIU);
    const cao = day - dinh;
    if (cao >= H - 4 || cao < H * 0.15) return anh; // không gọt được, hoặc gọt quá tay

    return await sharp(anh)
      .extract({ left: 0, top: dinh, width: W, height: cao })
      .png()
      .toBuffer();
  } catch {
    return anh;
  }
}

/**
 * Cắt viền GIẤY TRẮNG thừa quanh hình rồi chừa lại một lề đều.
 *
 * Nhờ bước này mà khung do model chỉ ra được phép chừa RỘNG (đỡ cắt cụt nhãn
 * ở mép — đã đo: chừa hẹp thì mất luôn chữ S, A, B, C của hình chóp), mà mẩu
 * cuối cùng vẫn gọn gàng. Chỉ chạy SAU khi đã cân sáng: lúc đó nền mới thật
 * sự trắng đều để `trim` bám vào.
 */
export async function gonVienTrang(anh: Buffer, leGiu = 10): Promise<Buffer> {
  try {
    return await sharp(anh)
      .trim({ threshold: 12 })
      .extend({ top: leGiu, bottom: leGiu, left: leGiu, right: leGiu, background: '#ffffff' })
      .png()
      .toBuffer();
  } catch {
    return anh; // ảnh toàn trắng thì `trim` ném lỗi — giữ nguyên
  }
}
