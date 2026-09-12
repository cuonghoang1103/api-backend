/**
 * ============================================================
 * TRỘN STEM — khâu giữa "tách xong" và "kéo vào FL Studio"
 * ============================================================
 *
 * Bốn stem tách ra không tự nghe hay khi cộng lại. Ba việc phải làm, và cả ba
 * đều là hệ quả TRỰC TIẾP của việc chúng vừa được tách bằng máy:
 *
 *  1. **Dọn trầm rò.** Bộ tách để lọt một ít năng lượng trầm vào giọng hát và
 *     nhạc nền. Nghe riêng từng stem thì không thấy gì; cộng bốn đường lại thì
 *     bốn phần trầm ấy chồng lên nhau thành một khối đục, và phần bass thật
 *     không còn chỗ. Chắn trầm bậc 4 trên ba stem không phải bass.
 *  2. **Cân lại mức.** Model trả stem theo mức của bản gốc, không theo mức
 *     người ta muốn khi dựng lại.
 *  3. **Duck theo kick.** Đây mới là thứ làm bản nhạc thành vinahouse.
 *
 * ─── Vì sao KHÔNG dựng một bàn trộn đầy đủ ───
 * FL Studio đã có bàn trộn, và nó tốt hơn bất cứ thứ gì dựng lại được ở đây.
 * Cái mà FL Studio KHÔNG biết là bốn tệp này vốn là một bài bị máy tách ra —
 * nên phần đáng làm ở đây đúng bằng phần cần biết điều đó. Xong là xuất, và
 * mix thật sự thì làm trong DAW.
 *
 * ─── ⚠️ THỜI GIAN HỒI CỦA CÚ DUCK SUY TỪ NHỊP, KHÔNG PHẢI MỘT SỐ CỐ ĐỊNH ───
 * Cú duck hồi trong 250 ms nghe rất khác nhau ở 128 BPM (0,47 s một phách) và
 * ở 150 BPM (0,40 s). Đặt cứng một con số thì cùng một thiết lập cho ra nhịp
 * thở lệch nhau tuỳ bài, và người dùng sẽ chỉnh tay mà không hiểu vì sao phải
 * chỉnh. Ở đây mặc định là 90% của một phách: hồi gần xong đúng lúc cú kick
 * sau tới, tức là bài "thở" đúng một nhịp một hơi.
 */
import { chanTramBac4, locChuoi } from './loc';
import { duckTheoKick, mocKick, mocTuBpm, nen, type TuyChonNen } from './nen';
import { TEN_STEM, type TenStem } from './tachStem';
import type { AmThanh } from './wav';
import type { CaiDatStemTron } from '../../shared/ipc';
import { TRON_MAC_DINH } from '../../shared/tronMacDinh';

/* Kiểu ở `shared/ipc.ts`, bảng mặc định ở `shared/tronMacDinh.ts` — MỘT bảng
   cho cả main lẫn giao diện. Lý do từng con số ghi ở tệp đó. */
export type CaiDatStem = CaiDatStemTron;
export const CAI_MAC_DINH = TRON_MAC_DINH as Record<TenStem, CaiDatStem>;

/** Thiết lập một phần — mỗi trường có thể vắng, hoặc có mặt mà bằng `undefined`. */
export type CaiDatMotPhan = { [K in keyof CaiDatStem]?: CaiDatStem[K] | undefined };

export interface TuyChonTron {
  /** Thiết lập từng stem. Thiếu stem nào thì lấy mặc định của stem đó. */
  stem?: Partial<Record<TenStem, CaiDatMotPhan>>;
  /** Nhịp của bài — quyết định thời gian hồi của cú duck và lưới kick dự phòng. */
  bpm?: number;
  /** Ép thời gian hồi, giây. Bỏ trống thì suy từ `bpm`. */
  hoiPhuc?: number;
  /** Nén tổng sau khi cộng. `null` là tắt. */
  nenTong?: TuyChonNen | null;
}

export interface KetQuaTron {
  kenh: Float32Array[];
  tanSoMau: number;
  /** Số cú kick tìm được — hiện lên giao diện để người dùng biết duck bám vào đâu. */
  soKick: number;
  /** Mốc kick đến từ stem trống hay từ lưới nhịp. */
  nguonKick: 'trong' | 'nhip' | 'khong';
  /** Thời gian hồi thật sự đã dùng, giây. */
  hoiPhuc: number;
  /** Stem nào thật sự có mặt trong bản trộn. */
  daTron: TenStem[];
}

/**
 * Đắp thiết lập một phần lên mặc định, BỎ QUA những trường bằng `undefined`.
 *
 * ⚠️ Không dùng spread thẳng. Qua cầu IPC, một trường vắng mặt và một trường
 * có mặt mà bằng `undefined` là hai thứ khác nhau: structured clone giữ
 * nguyên `{ bat: undefined }`, và spread thì `bat` thành `undefined`, và
 * `if (!cd.bat) continue` lặng lẽ vứt cả stem khỏi bản trộn. Người dùng nghe
 * ra là "trộn xong mất mất giọng hát", không ai nghĩ tới cầu IPC.
 */
function dap(goc: CaiDatStem, them: CaiDatMotPhan | undefined): CaiDatStem {
  const ra = { ...goc };
  if (them) {
    if (them.bat !== undefined) ra.bat = them.bat;
    if (them.gainDb !== undefined) ra.gainDb = them.gainDb;
    if (them.chanTramHz !== undefined) ra.chanTramHz = them.chanTramHz;
    if (them.duck !== undefined) ra.duck = them.duck;
  }
  return ra;
}

/** Một phách, giây. Nhịp vô lý thì coi như 128 BPM — đừng chia cho 0. */
function motPhach(bpm?: number): number {
  return 60 / (bpm && bpm > 20 && bpm < 300 ? bpm : 128);
}

/**
 * Trộn các stem đã tách thành một đường stereo.
 *
 * `nguon` thiếu stem nào cũng chạy được: trộn đúng những stem có mặt. Người
 * dùng có thể chỉ tách giọng (model nhẹ), và lúc đó bản trộn là hai đường.
 */
export function tron(
  nguon: Partial<Record<TenStem, AmThanh>>, o: TuyChonTron = {},
): KetQuaTron {
  const co = TEN_STEM.filter((t): t is TenStem => !!nguon[t]);
  if (co.length === 0) throw new Error('Không có stem nào để trộn');

  const mau = nguon[co[0]!]!;
  const fs = mau.tanSoMau;
  const soKenh = Math.max(...co.map((t) => nguon[t]!.kenh.length));
  const n = Math.max(...co.map((t) => nguon[t]!.kenh[0]?.length ?? 0));

  /* Mốc kick: ưu tiên stem trống THẬT. Lưới nhịp chỉ là lối lùi — nó đều tăm
     tắp, nên nếu bài có đoạn break không trống thì cú duck vẫn thở đều ở đó,
     nghe sai hẳn. Dò từ stem trống thì đoạn break tự nhiên không có cú nào. */
  let moc: number[] = [];
  let nguonKick: KetQuaTron['nguonKick'] = 'khong';
  if (nguon.drums) {
    moc = mocKick(nguon.drums.kenh, fs);
    if (moc.length > 0) nguonKick = 'trong';
  }
  if (moc.length === 0 && o.bpm && o.bpm > 0) {
    moc = mocTuBpm(o.bpm, fs, n);
    if (moc.length > 0) nguonKick = 'nhip';
  }

  const hoiPhuc = o.hoiPhuc ?? motPhach(o.bpm) * 0.9;

  const tong = Array.from({ length: soKenh }, () => new Float32Array(n));
  const daTron: TenStem[] = [];

  for (const ten of co) {
    const cd = dap(CAI_MAC_DINH[ten], o.stem?.[ten]);
    if (!cd.bat) continue;
    daTron.push(ten);

    let kenh: Float32Array[] = nguon[ten]!.kenh.map((k) => {
      /* Mọi stem phải dài BẰNG NHAU trước khi cộng. Chúng luôn bằng nhau khi
         cùng ra từ một lượt tách, nhưng `nguon` có thể do người dùng ghép từ
         hai lượt — và cộng lệch độ dài thì `k[i]` thành undefined, ra NaN, và
         NaN lan ra cả bản trộn từ mẫu đó trở đi. */
      if (k.length === n) return k;
      const d = new Float32Array(n);
      d.set(k.subarray(0, Math.min(k.length, n)));
      return d;
    });

    if (cd.chanTramHz > 0) {
      const bo = chanTramBac4(cd.chanTramHz, fs);
      kenh = kenh.map((k) => locChuoi(k, bo));
    }
    if (cd.duck > 0 && moc.length > 0) {
      kenh = duckTheoKick(kenh, moc, fs, { sau: cd.duck, hoiPhuc });
    }

    const he = Math.pow(10, cd.gainDb / 20);
    for (let c = 0; c < soKenh; c++) {
      /* Stem mono trộn vào bản stereo thì đổ vào CẢ HAI kênh, đừng để kênh
         phải im — một stem mono lọt vào sẽ nghe lệch hẳn sang trái. */
      const src = kenh[Math.min(c, kenh.length - 1)]!;
      const dst = tong[c]!;
      for (let i = 0; i < n; i++) dst[i]! += src[i]! * he;
    }
  }

  const kenh = o.nenTong ? nen(tong, fs, o.nenTong) : tong;
  return { kenh, tanSoMau: fs, soKick: moc.length, nguonKick, hoiPhuc, daTron };
}
