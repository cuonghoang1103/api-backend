/**
 * ============================================================
 * MÃ HOÁ RA MP3 / FLAC — cửa ra cuối cùng
 * ============================================================
 *
 * Trước tệp này Xưởng Remix chỉ đẻ ra WAV. Đúng cho stem (kéo vào FL Studio
 * để chỉnh tiếp thì đừng nén), nhưng SAI cho bản cuối: không ai gửi cho nhau
 * một tệp 50 MB, và không phần mềm DJ nào thích chép nguyên đĩa WAV vào USB.
 *
 * ─── Vì sao KHÔNG dùng ffmpeg ───
 * ffmpeg là ~70 MB nhị phân MỖI NỀN, và nó là nhị phân gốc — tức là đúng cái
 * mớ vừa phải gỡ với `onnxruntime-node` (tỉa theo nền, `asarUnpack`, móc
 * `afterPack`, chốt kiểm libc). Hai bộ mã hoá ở đây là JS thuần: gói vào asar
 * đọc thẳng được, không có nhánh theo nền nào để tỉa, không có gì để hỏng
 * riêng trên máy người dùng.
 *
 *   @breezystack/lamejs   471 KB   MP3   (bản LAME viết lại bằng JS)
 *   libflacjs             ~1 MB    FLAC  (chính libFLAC dịch sang asm.js)
 *
 * ─── Vì sao bản asm.js của libFLAC chứ không bản wasm ───
 * Bản wasm nhỏ hơn (132 KB) và nhanh hơn, nhưng lớp keo emscripten của nó nạp
 * tệp `.wasm` bằng `fetch()` với một ĐƯỜNG DẪN ĐĨA. Node 22 (và Electron) có
 * `fetch` toàn cục nên nhánh "đang chạy trong Node" không được chọn, và nó
 * chết ngay lúc nạp: `TypeError: Failed to parse URL from …/libflac.wasm.wasm`.
 * Bản `libflac.js` là MỘT tệp tự chứa, không đọc thêm gì (bản `.min.js` thì
 * cần thêm `.min.js.mem` — một tệp nữa để lạc mất lúc đóng gói).
 *
 * Giá phải trả, đo thật trên bài 5 phút stereo: FLAC nén mức 5 hết 4-5 giây,
 * tức nhanh gấp ~66 lần thời gian thật. Không đáng để đổi lấy rủi ro nạp.
 *
 * ─── Mức nén FLAC: 5, không phải 8 ───
 * Đo cùng bài đó: mức 5 hết 5,0s, mức 8 hết 15,5s và ra tệp **bằng đúng từng
 * byte**. Mức 8 chỉ hơn ở nhạc rất dễ đoán; trả gấp ba thời gian cho một con
 * số không là lựa chọn tồi mặc định.
 */
import { createRequire } from 'node:module';
import { KBPS_CHO_PHEP, type CaiXuat } from '../../shared/dinhDangXuat';
import type { AmThanh } from './wav';
import { ghiWav, ghiWav16 } from './wav';

/* Bảng định dạng nằm ở `shared/dinhDangXuat.ts` — giao diện cũng đọc nó, và
   hai bảng chép tay ở hai nơi thì sớm muộn cũng lệch. */
export { duoiTep, mimeCua, moTaDinhDang, KBPS_CHO_PHEP } from '../../shared/dinhDangXuat';
export type { CaiXuat, DinhDang } from '../../shared/dinhDangXuat';

/** Bao nhiêu mẫu một lần đưa vào bộ mã hoá. */
const KHUC = 1 << 16;

/* ══════════════════════════════════════════════════════════
   Đưa mẫu số thực về số nguyên
   ══════════════════════════════════════════════════════════ */

/**
 * Float → số nguyên `bit` bit, có rắc nhiễu TPDF khi cần.
 *
 * ⚠️ Nhân theo 2^(bit-1), KHÔNG phải 2^(bit-1)−1. Cùng quy ước với `docWav`
 * và `ghiWav16` — lệch một nấc ở đây là sai số HỆ THỐNG trên mọi mẫu, và nó
 * không nghe ra được nên chỉ có phép kiểm mới bắt.
 *
 * Rắc nhiễu chỉ ở 16-bit. Ở 24-bit nền lượng tử đã nằm dưới −144 dBFS, tức
 * dưới cả nhiễu nhiệt của bất kỳ mạch nào phát nó ra: rắc thêm nhiễu chỉ tổ
 * làm FLAC hết nén được (nhiễu là thứ không nén nổi) mà không đổi lại gì.
 */
function veNguyen(kenh: Float32Array, bit: number, rac: boolean): Int32Array {
  const thang = 2 ** (bit - 1);
  const tran = thang - 1;
  const bac = 1 / thang;
  const ra = new Int32Array(kenh.length);
  for (let i = 0; i < kenh.length; i++) {
    const nhieu = rac ? (Math.random() - Math.random()) * bac : 0;
    const q = Math.round((kenh[i]! + nhieu) * thang);
    /* Chặn SAU khi làm tròn, theo số nguyên: nhiễu đẩy một mẫu sát trần lên
       đúng `thang` thì nó tràn thành số âm lớn nhất — một mẫu lật dấu, nghe
       ra là tiếng "tách". Bài master nào cũng chạy sát trần nên đây không
       phải trường hợp hiếm. */
    ra[i] = q < -thang ? -thang : q > tran ? tran : q;
  }
  return ra;
}

/**
 * Như `veNguyen(k, 16, false)` nhưng trả thẳng `Int16Array` — LAME chỉ nhận
 * kiểu đó. Chép qua một `Int32Array` trung gian rồi hạ cỡ là tốn gấp đôi bộ
 * nhớ cho một bài 5 phút mà chẳng để làm gì.
 */
function ve16(kenh: Float32Array): Int16Array {
  const ra = new Int16Array(kenh.length);
  for (let i = 0; i < kenh.length; i++) {
    const q = Math.round(kenh[i]! * 32768);
    ra[i] = q < -32768 ? -32768 : q > 32767 ? 32767 : q;
  }
  return ra;
}

/* ══════════════════════════════════════════════════════════
   MP3
   ══════════════════════════════════════════════════════════ */

/** Tần số mẫu mà LAME nhận. Ngoài bảng này nó im lặng đẻ ra tệp sai tốc độ. */
const FS_MP3 = new Set([8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000]);

/** LAME làm việc theo khung 1152 mẫu — đưa đúng cỡ đó thì không phải đệm. */
const KHUNG_LAME = 1152;

interface LameMod {
  Mp3Encoder: new (kenh: number, fs: number, kbps: number) => {
    encodeBuffer(l: Int16Array, r?: Int16Array): Int8Array;
    flush(): Int8Array;
  };
}

/**
 * Nạp LAME.
 *
 * ⚠️ PHẢI là `import()` động, KHÔNG được `require()`. Gói này khai
 * `"type": "module"`, và nhánh `require` trong `exports` của nó trỏ vào bản
 * IIFE — mà bản IIFE gán vào một biến toàn cục rồi thôi, KHÔNG hề đặt
 * `module.exports`. Nên `require('@breezystack/lamejs')` trả về `{}` và ta
 * chết ở `new Mp3Encoder(...)` với "is not a constructor". Đó là lỗi của
 * thượng nguồn, không phải của ta, và nó không hiện ra lúc build.
 *
 * Bản `lamejs` gốc (1.2.1) thì require được nhưng ném
 * `ReferenceError: MPEGMode is not defined` ngay lời gọi đầu — chính lỗi đó
 * đẻ ra bản fork này. Cả hai đường đều đã thử tay.
 *
 * `require(esm)` của Node 22 giải được, nhưng Electron 33 chạy Node 20 nên
 * không dùng được ở đây: nó xanh trên máy dựng và chết trên máy người dùng.
 */
async function napLame(): Promise<LameMod> {
  try {
    return (await import('@breezystack/lamejs')) as unknown as LameMod;
  } catch (e) {
    throw new Error(
      'Chưa cài được bộ mã hoá MP3 (@breezystack/lamejs). '
      + `Bản cài này thiếu gói đó — xuất WAV hoặc FLAC vẫn dùng được. (${(e as Error).message})`,
    );
  }
}

async function maHoaMp3(am: AmThanh, kbps: number): Promise<ArrayBuffer> {
  const soKenh = am.kenh.length;
  if (soKenh !== 1 && soKenh !== 2) {
    throw new Error(`MP3 chỉ nhận 1 hoặc 2 kênh, bài này có ${soKenh}`);
  }
  if (!FS_MP3.has(am.tanSoMau)) {
    throw new Error(
      `LAME không mã hoá được ${am.tanSoMau} Hz. `
      + `Nhận: ${[...FS_MP3].join(', ')} Hz.`,
    );
  }
  if (!KBPS_CHO_PHEP.includes(kbps as (typeof KBPS_CHO_PHEP)[number])) {
    throw new Error(`Tốc độ bit lạ: ${kbps}. Nhận ${KBPS_CHO_PHEP.join('/')} kbps.`);
  }

  const { Mp3Encoder } = await napLame();
  const enc = new Mp3Encoder(soKenh, am.tanSoMau, kbps);

  /* KHÔNG rắc nhiễu trước một bộ nén CÓ MẤT. Nhiễu TPDF sinh ra để cứu bước
     lượng tử ở đầu ra cuối cùng; đưa nó vào MP3 thì bộ mã hoá phải tiêu bit
     để tả lại chính cái nhiễu ấy, mà nền nhiễu của MP3 320 vốn đã cao hơn
     nền 16-bit vài bậc. Làm tròn là đủ. */
  const l16 = ve16(am.kenh[0]!);
  const r16 = soKenh === 2 ? ve16(am.kenh[1]!) : null;

  const manh: Buffer[] = [];
  for (let i = 0; i < l16.length; i += KHUNG_LAME) {
    const a = l16.subarray(i, i + KHUNG_LAME);
    const b = r16 ? r16.subarray(i, i + KHUNG_LAME) : undefined;
    const ra = b ? enc.encodeBuffer(a, b) : enc.encodeBuffer(a);
    if (ra.length > 0) manh.push(Buffer.from(ra));
  }
  const cuoi = enc.flush();
  if (cuoi.length > 0) manh.push(Buffer.from(cuoi));

  const gop = Buffer.concat(manh);
  return gop.buffer.slice(gop.byteOffset, gop.byteOffset + gop.byteLength) as ArrayBuffer;
}

/* ══════════════════════════════════════════════════════════
   FLAC
   ══════════════════════════════════════════════════════════ */

interface FlacEnc {
  encode(pcm?: Int32Array[], soMau?: number): boolean;
  getSamples(): Uint8Array;
  getState(): number;
  destroy(): void;
}

interface FlacMod {
  isReady(): boolean;
  on(su: string, f: () => void): void;
}

let flacDaSan: Promise<{ Flac: FlacMod; Encoder: new (f: FlacMod, o: object) => FlacEnc }> | null = null;

/**
 * Nạp libFLAC một lần và nhớ lại.
 *
 * Emscripten khởi tạo BẤT ĐỒNG BỘ — gọi `new Encoder` trước khi nó sẵn sàng
 * thì không ném lỗi, nó chỉ trả về một bộ mã hoá chết và ta ghi ra một tệp
 * rỗng. Nên phải chờ `ready` cho tử tế.
 */
function napFlac(): Promise<{ Flac: FlacMod; Encoder: new (f: FlacMod, o: object) => FlacEnc }> {
  if (flacDaSan) return flacDaSan;
  flacDaSan = (async () => {
    const req = createRequire(__filename);
    let Flac: FlacMod;
    let Encoder: new (f: FlacMod, o: object) => FlacEnc;
    try {
      /* Trỏ THẲNG vào tệp dist chứ không vào gốc gói: `libflacjs/index.js` tự
         ghép đường bằng `path.resolve(__dirname, 'dist')` rồi require động —
         một lối mà bundler nào cũng dò trượt. */
      Flac = req('libflacjs/dist/libflac.js') as FlacMod;
      ({ Encoder } = req('libflacjs/lib/encoder.js') as {
        Encoder: new (f: FlacMod, o: object) => FlacEnc });
    } catch (e) {
      throw new Error(
        'Chưa cài được bộ mã hoá FLAC (libflacjs). '
        + `Bản cài này thiếu gói đó — xuất WAV hoặc MP3 vẫn dùng được. (${(e as Error).message})`,
      );
    }
    if (!Flac.isReady()) {
      await new Promise<void>((ok) => { Flac.on('ready', () => ok()); });
    }
    return { Flac, Encoder };
  })();
  return flacDaSan;
}

async function maHoaFlac(am: AmThanh, bit: 16 | 24): Promise<ArrayBuffer> {
  const soKenh = am.kenh.length;
  if (soKenh < 1 || soKenh > 8) throw new Error(`FLAC nhận 1…8 kênh, bài này có ${soKenh}`);
  const soMau = am.kenh[0]!.length;
  for (const k of am.kenh) {
    if (k.length !== soMau) throw new Error('maHoaFlac: các kênh lệch độ dài');
  }

  const { Flac, Encoder } = await napFlac();
  const nguyen = am.kenh.map((k) => veNguyen(k, bit, bit === 16));

  const enc = new Encoder(Flac, {
    sampleRate: am.tanSoMau,
    channels: soKenh,
    bitsPerSample: bit,
    compression: 5,
    totalSamples: soMau,
  });
  try {
    /* Đưa theo KHÚC. Một phát cho bài 5 phút là ~106 MB Int32 nhồi vào heap
       asm.js — mà heap asm.js cấp phát cố định lúc nạp, không nở ra như wasm.
       Đo rồi: hai lối cho ra tệp GIỐNG NHAU TỪNG BYTE, nên khúc không mất gì. */
    for (let i = 0; i < soMau; i += KHUC) {
      const n = Math.min(KHUC, soMau - i);
      const lat = nguyen.map((k) => k.subarray(i, i + n));
      if (!enc.encode(lat, n)) {
        throw new Error(`libFLAC dừng giữa chừng ở mẫu ${i} (trạng thái ${enc.getState()})`);
      }
    }
    if (!enc.encode()) {
      throw new Error(`libFLAC không đóng được tệp (trạng thái ${enc.getState()})`);
    }
    const ra = enc.getSamples();
    if (ra.length < 8) throw new Error('libFLAC trả về tệp rỗng');
    const b = Buffer.from(ra);
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  } finally {
    /* Bắt buộc, kể cả khi ném. Bộ mã hoá giữ bộ nhớ trong heap emscripten —
       heap đó KHÔNG nằm dưới bộ dọn rác của V8, nên quên `destroy` là rò thật
       và nó chỉ lộ ra sau vài chục lần xuất. */
    enc.destroy();
  }
}

/* ══════════════════════════════════════════════════════════
   Cửa chung
   ══════════════════════════════════════════════════════════ */

/**
 * Mã hoá một bài ra định dạng đã chọn.
 *
 * `wav` là 32-bit float (không đụng gì tới mẫu), `wav16` là 16-bit có rắc
 * nhiễu — hai thứ này không cần thư viện nào.
 */
export async function maHoa(am: AmThanh, cai: CaiXuat): Promise<ArrayBuffer> {
  if (am.kenh.length === 0) throw new Error('maHoa: không có kênh nào');
  switch (cai.dinhDang) {
    case 'wav': return ghiWav(am);
    case 'wav16': return ghiWav16(am);
    case 'mp3': return maHoaMp3(am, cai.kbps ?? 320);
    case 'flac': return maHoaFlac(am, cai.bit ?? 24);
    default: {
      const x: never = cai.dinhDang;
      throw new Error(`Định dạng lạ: ${String(x)}`);
    }
  }
}
