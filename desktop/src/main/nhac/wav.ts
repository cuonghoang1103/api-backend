/**
 * ============================================================
 * ĐỌC / GHI WAV — cửa vào và cửa ra của bộ máy
 * ============================================================
 *
 * ─── Vì sao main process chỉ nhận WAV, không nhận MP3 ───
 * Giải mã MP3/M4A/FLAC trong Node nghĩa là cõng thêm ffmpeg (~70MB mỗi nền)
 * hoặc một bộ giải mã gốc. Nhưng renderer của Electron LÀ Chromium: nó đã có
 * sẵn bộ giải mã cho mọi định dạng đó, và `decodeAudioData` trả thẳng ra mẫu
 * số thực. `RemixDeck.tsx` đã đi đúng đường này từ trước.
 *
 * Nên phân vai giống hệt `ipc/music.ts` ("renderer tải, main chỉ ghi"):
 * **renderer giải mã, main tính toán**. Không thêm phụ thuộc nào.
 *
 * ⚠️ 24-bit KHÔNG phải thứ bỏ qua được. Nhạc tải về từ sàn bán nhạc số (và
 * mọi bản xuất từ FL Studio ở chất lượng cao) mặc định là 24-bit. Bỏ qua nó
 * nghĩa là người dùng chọn đúng file xịn nhất của họ thì app báo "không đọc
 * được" — lỗi trông như app hỏng chứ không như thiếu tính năng.
 */

export interface AmThanh {
  /** Mỗi phần tử là một kênh, mẫu nằm trong [-1, 1]. */
  kenh: Float32Array[];
  tanSoMau: number;
}

/** Một khối trong tệp RIFF: 4 ký tự tên + độ dài + dữ liệu. */
interface Khoi {
  ten: string;
  dau: number;
  dai: number;
}

function docKhoi(v: DataView, tu: number, het: number): Khoi[] {
  const ra: Khoi[] = [];
  let i = tu;
  // Cần đủ 8 byte cho phần đầu khối; thiếu thì tệp cụt, dừng ở đây.
  while (i + 8 <= het) {
    const ten = String.fromCharCode(
      v.getUint8(i), v.getUint8(i + 1), v.getUint8(i + 2), v.getUint8(i + 3),
    );
    const dai = v.getUint32(i + 4, true);
    ra.push({ ten, dau: i + 8, dai });
    /* Khối RIFF luôn căn theo 2 byte: khối lẻ byte có một byte đệm KHÔNG tính
       vào `dai`. Quên nó thì mọi khối sau đều lệch một byte, và triệu chứng là
       "đọc được file này, file kia thì ra nhiễu trắng". */
    i += 8 + dai + (dai % 2);
  }
  return ra;
}

/**
 * Đọc WAV thành mẫu số thực.
 *
 * Nhận PCM số nguyên 8/16/24/32-bit và IEEE float 32/64-bit, kể cả dạng
 * WAVE_FORMAT_EXTENSIBLE (mã 0xFFFE) mà Pro Tools và FL Studio hay xuất ra.
 */
export function docWav(buf: ArrayBuffer): AmThanh {
  const v = new DataView(buf);
  if (buf.byteLength < 12) throw new Error('WAV hỏng: tệp quá ngắn');

  const riff = String.fromCharCode(v.getUint8(0), v.getUint8(1), v.getUint8(2), v.getUint8(3));
  const wave = String.fromCharCode(v.getUint8(8), v.getUint8(9), v.getUint8(10), v.getUint8(11));
  if (riff !== 'RIFF' || wave !== 'WAVE') throw new Error('Không phải tệp WAV');

  const khoi = docKhoi(v, 12, buf.byteLength);
  const fmt = khoi.find((k) => k.ten === 'fmt ');
  const data = khoi.find((k) => k.ten === 'data');
  if (!fmt) throw new Error('WAV hỏng: thiếu khối fmt');
  if (!data) throw new Error('WAV hỏng: thiếu khối data');

  let ma = v.getUint16(fmt.dau, true);
  const soKenh = v.getUint16(fmt.dau + 2, true);
  const tanSoMau = v.getUint32(fmt.dau + 4, true);
  const bit = v.getUint16(fmt.dau + 14, true);

  /* WAVE_FORMAT_EXTENSIBLE giấu mã thật trong GUID ở cuối khối fmt. Hai byte
     đầu của GUID chính là mã gốc, nên chỉ cần đọc đúng chỗ đó. */
  if (ma === 0xfffe && fmt.dai >= 40) ma = v.getUint16(fmt.dau + 24, true);

  if (soKenh < 1) throw new Error('WAV hỏng: số kênh bằng 0');
  if (tanSoMau < 1) throw new Error('WAV hỏng: tần số mẫu bằng 0');

  const byteMoiMau = bit >> 3;
  const soMau = Math.floor(data.dai / (byteMoiMau * soKenh));
  const kenh: Float32Array[] = [];
  for (let c = 0; c < soKenh; c++) kenh.push(new Float32Array(soMau));

  const doc = docMau(ma, bit);
  for (let i = 0; i < soMau; i++) {
    const goc = data.dau + i * byteMoiMau * soKenh;
    for (let c = 0; c < soKenh; c++) kenh[c]![i] = doc(v, goc + c * byteMoiMau);
  }

  return { kenh, tanSoMau };
}

/** Chọn cách đọc một mẫu, một lần cho cả tệp thay vì rẽ nhánh trong vòng lặp. */
function docMau(ma: number, bit: number): (v: DataView, i: number) => number {
  if (ma === 3) {
    if (bit === 32) return (v, i) => v.getFloat32(i, true);
    if (bit === 64) return (v, i) => v.getFloat64(i, true);
    throw new Error(`WAV: float ${bit}-bit không hỗ trợ`);
  }
  if (ma !== 1) throw new Error(`WAV: mã định dạng ${ma} không hỗ trợ (chỉ PCM và float)`);

  switch (bit) {
    // 8-bit WAV là số nguyên KHÔNG DẤU, lệch tâm ở 128 — khác mọi độ sâu khác.
    case 8: return (v, i) => (v.getUint8(i) - 128) / 128;
    case 16: return (v, i) => v.getInt16(i, true) / 32768;
    case 24: return (v, i) => {
      // Không có getInt24: ghép ba byte rồi tự nới dấu từ bit 23.
      const tho = v.getUint8(i) | (v.getUint8(i + 1) << 8) | (v.getUint8(i + 2) << 16);
      return (tho & 0x800000 ? tho - 0x1000000 : tho) / 8388608;
    };
    case 32: return (v, i) => v.getInt32(i, true) / 2147483648;
    default: throw new Error(`WAV: PCM ${bit}-bit không hỗ trợ`);
  }
}

/**
 * Ghi WAV 32-bit float.
 *
 * ─── Vì sao float chứ không phải 16-bit ───
 * Đây là tệp TRUNG GIAN: stem tách ra còn phải kéo nhịp, đổi tông, trộn lại.
 * Số thực không có trần ở ±1, nên một stem hơi vượt đỉnh vẫn giữ nguyên dạng
 * sóng và lấy lại được bằng cách hạ âm lượng ở bước sau. 16-bit thì phần vượt
 * bị CẮT CỤT ngay lúc ghi, và không bước nào sau đó cứu lại được.
 *
 * Giá phải trả là tệp to gấp đôi. Với tệp trung gian thì đó là món hời.
 */
export function ghiWav(am: AmThanh): ArrayBuffer {
  const soKenh = am.kenh.length;
  if (soKenh === 0) throw new Error('ghiWav: không có kênh nào');
  const soMau = am.kenh[0]!.length;
  for (const k of am.kenh) {
    if (k.length !== soMau) throw new Error('ghiWav: các kênh lệch độ dài');
  }

  const byteDuLieu = soMau * soKenh * 4;
  const buf = new ArrayBuffer(44 + byteDuLieu);
  const v = new DataView(buf);

  const chu = (i: number, s: string) => {
    for (let k = 0; k < s.length; k++) v.setUint8(i + k, s.charCodeAt(k));
  };

  chu(0, 'RIFF');
  v.setUint32(4, 36 + byteDuLieu, true);
  chu(8, 'WAVE');
  chu(12, 'fmt ');
  v.setUint32(16, 16, true);       // độ dài khối fmt
  v.setUint16(20, 3, true);        // 3 = IEEE float
  v.setUint16(22, soKenh, true);
  v.setUint32(24, am.tanSoMau, true);
  v.setUint32(28, am.tanSoMau * soKenh * 4, true); // byte mỗi giây
  v.setUint16(32, soKenh * 4, true);               // byte mỗi khối
  v.setUint16(34, 32, true);       // bit mỗi mẫu
  chu(36, 'data');
  v.setUint32(40, byteDuLieu, true);

  let i = 44;
  for (let n = 0; n < soMau; n++) {
    for (let c = 0; c < soKenh; c++) {
      v.setFloat32(i, am.kenh[c]![n]!, true);
      i += 4;
    }
  }
  return buf;
}

/**
 * Ghi WAV 16-bit PCM, có rắc nhiễu (dither).
 *
 * ─── Khi nào dùng bản này thay cho bản float ───
 * Khi tệp là BẢN GIAO, không phải bản trung gian: bản trộn hay bản master đã
 * đi qua bộ hạn biên nên chắc chắn nằm trong ±1, và nó sắp được nghe hoặc
 * được đẩy lên máy chủ. 16-bit nhỏ đúng một nửa, và một bản 5 phút là 53 MB
 * thay vì 106 MB — chênh lệch ấy là thật khi đẩy lên bằng mạng nhà.
 *
 * ─── ⚠️ VÌ SAO PHẢI RẮC NHIỄU ───
 * Làm tròn thẳng float xuống 16-bit sinh ra sai số BÁM THEO tín hiệu, không
 * phải nhiễu ngẫu nhiên — tai nghe ra nó như một lớp méo bẩn bám lấy đuôi
 * tiếng vang và những đoạn nhỏ dần, rõ nhất đúng ở chỗ nhạc êm. Cộng một
 * lượng nhiễu tam giác (TPDF) bằng ±1 bậc lượng tử trước khi làm tròn thì sai
 * số trở thành nhiễu nền TRẮNG, độc lập với tín hiệu: to hơn về mặt con số,
 * nhưng tai không bám vào được, nên nghe SẠCH hơn. Đây là chuyện đã ngã ngũ
 * từ lâu trong ngành, không phải lựa chọn thẩm mỹ.
 *
 * Nhiễu TPDF dựng bằng hiệu hai số ngẫu nhiên đều — đó chính là định nghĩa
 * của phân phối tam giác.
 */
export function ghiWav16(am: AmThanh): ArrayBuffer {
  const soKenh = am.kenh.length;
  if (soKenh === 0) throw new Error('ghiWav16: không có kênh nào');
  const soMau = am.kenh[0]!.length;
  for (const k of am.kenh) {
    if (k.length !== soMau) throw new Error('ghiWav16: các kênh lệch độ dài');
  }

  const byteDuLieu = soMau * soKenh * 2;
  const buf = new ArrayBuffer(44 + byteDuLieu);
  const v = new DataView(buf);
  const chu = (i: number, s: string) => {
    for (let k = 0; k < s.length; k++) v.setUint8(i + k, s.charCodeAt(k));
  };

  chu(0, 'RIFF');
  v.setUint32(4, 36 + byteDuLieu, true);
  chu(8, 'WAVE');
  chu(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);        // 1 = PCM nguyên
  v.setUint16(22, soKenh, true);
  v.setUint32(24, am.tanSoMau, true);
  v.setUint32(28, am.tanSoMau * soKenh * 2, true);
  v.setUint16(32, soKenh * 2, true);
  v.setUint16(34, 16, true);
  chu(36, 'data');
  v.setUint32(40, byteDuLieu, true);

  /* ⚠️ NHÂN 32768, KHÔNG PHẢI 32767 — phải khớp với trình ĐỌC.
     `docWav` chia 16-bit cho 32768 (đó là quy ước đúng: dải số nguyên có dấu
     là −32768…+32767, và toàn thang ứng với 32768). Bản đầu ở đây nhân 32767,
     tức lệch hệ số 1/32768 so với lúc đọc lại — nghe không ra (−0,00026 dB)
     nhưng nó là sai số HỆ THỐNG cộng thêm vào mọi mẫu, và phép kiểm vòng tròn
     phải nới ngưỡng ra để chịu nó. Nới ngưỡng để chiều một lỗi là cách đánh
     mất chính phép kiểm đó. */
  const BAC = 1 / 32768;
  let i = 44;
  for (let n = 0; n < soMau; n++) {
    for (let c = 0; c < soKenh; c++) {
      const nhieu = (Math.random() - Math.random()) * BAC;
      /* Chặn theo SỐ NGUYÊN sau khi làm tròn: nhiễu có thể đẩy một mẫu đang
         sát trần lên 32768, mà `setInt16` cắt cụt hai byte thấp nên 32768
         thành −32768 — một mẫu lật dấu, nghe ra là tiếng "tách" rất rõ, và
         chỉ xảy ra ở bài master sát trần, tức gần như mọi bài nhạc sàn. */
      const q = Math.round((am.kenh[c]![n]! + nhieu) * 32768);
      v.setInt16(i, Math.max(-32768, Math.min(32767, q)), true);
      i += 2;
    }
  }
  return buf;
}

/**
 * Trộn nhiều kênh thành một (mono).
 *
 * Dò nhịp và dò tông đều làm trên mono: hai kênh gần như cùng nội dung, tính
 * cả hai là tốn gấp đôi thời gian để ra cùng một đáp án.
 */
export function gopMono(am: AmThanh): Float32Array {
  const [dau] = am.kenh;
  if (!dau) throw new Error('gopMono: không có kênh nào');
  if (am.kenh.length === 1) return dau;

  const ra = new Float32Array(dau.length);
  for (let i = 0; i < ra.length; i++) {
    let tong = 0;
    for (const k of am.kenh) tong += k[i]!;
    ra[i] = tong / am.kenh.length;
  }
  return ra;
}
