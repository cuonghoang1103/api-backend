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
 * Cắt bỏ DÒNG CHỮ dính ở mép mẩu hình.
 *
 * Khung do model chỉ ra hay ôm thêm một dòng đề bài phía trên hoặc phía dưới
 * ("sau.", "góc đối đỉnh có trên hình vẽ."). Nhận ra chúng bằng hình dạng:
 * một dải mực MỎNG (dưới ~9% chiều cao) nằm tách khỏi khối chính bởi một
 * quãng giấy trắng. Hình vẽ thì cao và liền mạch, không bị nhầm.
 *
 * Chỉ được phép gọt tối đa 25% mỗi đầu — thà để sót một dòng chữ còn hơn cắt
 * cụt mất hình.
 */
export async function catChuODau(anh: Buffer): Promise<Buffer> {
  try {
    const { data, info } = await sharp(anh).grayscale().raw().toBuffer({ resolveWithObject: true });
    const W = info.width;
    const H = info.height;

    // Dải nào có mực: đếm điểm tối mỗi hàng.
    const coMuc: boolean[] = [];
    for (let y = 0; y < H; y++) {
      let toi = 0;
      for (let x = 0; x < W; x += 2) if (data[y * W + x] < 150) toi++;
      coMuc.push(toi > W / 2 / 60); // >~1,7% bề ngang mới tính là có mực
    }

    // Gom thành các dải liên tiếp.
    const daiTho: Array<{ dau: number; cuoi: number }> = [];
    for (let y = 0; y < H; y++) {
      if (!coMuc[y]) continue;
      const cuoiDai = daiTho[daiTho.length - 1];
      if (cuoiDai && y - cuoiDai.cuoi <= 2) cuoiDai.cuoi = y;
      else daiTho.push({ dau: y, cuoi: y });
    }

    // ⚠️ VỨT CHẤM NHIỄU TRƯỚC ĐÃ. Đo trên ảnh thật: dưới dòng chữ đề còn một
    // chấm CAO 1 PIXEL cách đó 4px. Vòng lặp gọt gặp chấm đó trước, thấy khe
    // trắng chưa đủ rộng nên DỪNG NGAY — và thế là dòng chữ ngay trên nó không
    // bao giờ bị gọt. Một hạt bụi chặn đứng cả tính năng.
    const dai = daiTho.filter((d) => {
      const cao = d.cuoi - d.dau + 1;
      if (cao > 3) return true;
      let dem = 0;
      for (let y = d.dau; y <= d.cuoi; y++) for (let x = 0; x < W; x += 2) if (data[y * W + x] < 150) dem++;
      return dem > W / 2 * 0.06; // dải mỏng mà thưa mực ⇒ bụi, bỏ
    });
    if (dai.length < 2) return anh; // chỉ một khối → không có gì để gọt

    /** Dải này trải ngang bao nhiêu phần bề rộng — dòng chữ trải rộng, còn
     *  một nhãn lẻ ("S" trên đỉnh hình chóp) thì chỉ vài phần trăm. Thiếu
     *  phép thử này, chữ S bị gọt mất y như một dòng đề bài. */
    const trongNgang = (dau: number, cuoi: number): number => {
      let trai = W;
      let phai = 0;
      for (let y = dau; y <= cuoi; y++) {
        for (let x = 0; x < W; x += 2) {
          if (data[y * W + x] < 150) {
            if (x < trai) trai = x;
            if (x > phai) phai = x;
          }
        }
      }
      return phai > trai ? (phai - trai) / W : 0;
    };
    const RONG_NHU_DONG_CHU = 0.22;   // đo thật: dòng chữ đề 38%, nhãn lẻ "S" ~5%
    // Nhãn của hình LUÔN dính sát nét (cách vài pixel). Dải nào nằm cách khối
    // hình cả một quãng lớn thì chắc chắn không thuộc hình — đo thật: chữ
    // "sau:" ở đầu trang cách hình 200px (28% chiều cao) mà chỉ rộng 6%, tức
    // bằng một nhãn, nên chỉ xét bề rộng thì không tài nào phân biệt được.
    const KHE_XA = H * 0.08;

    // Bốn điều kiện để coi một dải là DÒNG CHỮ chứ không phải phần của hình:
    //   • mỏng (một dòng chữ thấp hơn hẳn khối hình),
    //   • nằm ở rìa (không gọt vào giữa),
    //   • và CÓ KHOẢNG TRẮNG rõ ràng ngăn nó với phần còn lại — đây là điều
    //     kiện quan trọng nhất: nét hình dù đứt đoạn vẫn nằm sát nhau, còn
    //     dòng chữ thì cách hình một quãng giấy trắng.
    const MONG = H * 0.07;
    const TOI_DA_GOT = H * 0.2;    // gọt tối đa 20% mỗi đầu
    const KHE_TRANG = Math.max(5, H * 0.012);
    let tren = 0;
    let duoi = H;

    for (let i = 0; i < dai.length - 1; i++) {
      const d = dai[i];
      const khe = dai[i + 1].dau - d.cuoi;
      const laChu = khe >= KHE_XA || (khe >= KHE_TRANG && trongNgang(d.dau, d.cuoi) >= RONG_NHU_DONG_CHU);
      if (d.cuoi - d.dau + 1 <= MONG && d.cuoi < TOI_DA_GOT && laChu) tren = d.cuoi + 2;
      else break;
    }
    for (let i = dai.length - 1; i > 0; i--) {
      const d = dai[i];
      const khe = d.dau - dai[i - 1].cuoi;
      const laChu = khe >= KHE_XA || (khe >= KHE_TRANG && trongNgang(d.dau, d.cuoi) >= RONG_NHU_DONG_CHU);
      if (d.cuoi - d.dau + 1 <= MONG && d.dau > H - TOI_DA_GOT && laChu) duoi = d.dau - 2;
      else break;
    }

    const dinh = Math.max(0, tren);
    const cao = Math.max(20, Math.min(H, duoi) - dinh);
    if (cao >= H - 4) return anh; // không gọt được gì

    // ⛔ CHỐT CHẶN: đếm mực trước và sau. Trên ảnh chụp tối, nhiễu làm hình bị
    // vỡ thành nhiều dải rời và phép gọt ở trên ăn luôn phần dưới của hình
    // (đã đo: mất chữ "y" và đuôi một đường). Gọt mà mất quá 12% mực thì thà
    // giữ nguyên cả dòng chữ thừa — chữ thừa còn xoá tay được, hình cụt thì
    // không.
    const demMuc = (tu: number, den: number): number => {
      let n = 0;
      for (let y = tu; y < den; y++) for (let x = 0; x < W; x += 2) if (data[y * W + x] < 150) n++;
      return n;
    };
    const mucTruoc = demMuc(0, H);
    const mucSau = demMuc(dinh, dinh + cao);
    if (mucTruoc > 0 && mucSau / mucTruoc < 0.55) return anh;  // chốt cuối: đừng bao giờ ăn mất nửa hình

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
