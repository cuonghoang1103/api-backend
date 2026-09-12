/**
 * ============================================================
 * DỰNG BẢN MASHUP — nhiều bài, cắt ra, xếp lại thành một track
 * ============================================================
 *
 * Tới đây Xưởng Remix đã làm được mọi việc trên MỘT bài: tách, đo, trộn,
 * master, xuất. Thiếu đúng một thứ để nó thành công cụ làm nhạc thật — ghép
 * NHIỀU bài lại. Đó là toàn bộ nội dung của tệp này.
 *
 * ─── Ba phép quy đổi, và thứ tự của chúng ───
 * Mỗi mảnh cắt ra từ một bài có nhịp riêng và tông riêng. Muốn chúng chạy
 * cùng nhau thì phải kéo về CÙNG một nhịp và CÙNG một tông:
 *
 *   1. Cắt   — lấy đoạn [tuGiay, denGiay] trong bài GỐC
 *   2. Kéo   — nhân độ dài với `bpmGoc / bpmDich`, và dịch tông
 *   3. Xếp   — đặt vào bản dựng ở `datGiay`, có gain và có fade
 *
 * ⚠️ Cắt TRƯỚC rồi mới kéo, không phải ngược lại. Kéo cả bài 5 phút rồi cắt
 * lấy 8 giây là làm 37 lần công việc thừa, và WSOLA là bước đắt nhất của cả
 * xưởng. Với một bản dựng 20 mảnh thì khác biệt là vài giây so với vài phút.
 *
 * ─── Vì sao fade là ĐẲNG CÔNG SUẤT, không phải đường thẳng ───
 * Fade ở đây gần như luôn là một nửa của cú chuyển bài. Hai đường thẳng chồng
 * lên nhau cho tổng công suất tụt xuống 0,707 ở đúng điểm giữa — nghe ra rõ
 * ràng như một cái hụt hơi giữa hai bài. Cặp sin/cos thì giữ tổng công suất
 * không đổi suốt cú chuyển. Đây là chuyện đã ngã ngũ trong ngành, không phải
 * lựa chọn thẩm mỹ.
 *
 * ─── Vì sao dịch tông chọn quãng NGẮN NHẤT ───
 * Từ La lên Rê là +5 nửa cung, mà xuống cũng tới nơi ở −7. Hai đường ra cùng
 * một tông, nhưng WSOLA càng dịch xa càng để lại tiếng lạo xạo. Nên luôn chọn
 * đường ngắn hơn.
 */
import type { AmThanh } from './wav';
import { chinhBai, tiLeTuBpm } from './keoGian';

/** Một mảnh cắt ra từ một bài, đã đặt chỗ trên bản dựng. */
export interface Manh {
  /** Khoá riêng của mảnh — giao diện dùng nó làm `key`. */
  id: string;
  /** Bài nguồn (id phiên của Xưởng Remix). */
  baiId: string;
  /** `goc` = cả bài, hoặc tên một stem. */
  nguon: string;
  /** Cắt từ giây nào tới giây nào TRONG BÀI GỐC. */
  tuGiay: number;
  denGiay: number;
  /** Đặt ở giây nào TRÊN BẢN DỰNG. */
  datGiay: number;
  gainDb: number;
  /** Fade vào và fade ra, giây, tính theo thời gian ĐÃ KÉO. */
  vaoGiay: number;
  raGiay: number;
}

/**
 * Khoá tra nguồn của một mảnh: BÀI cộng ĐƯỜNG.
 *
 * Không phải chỉ `baiId`. Hai mảnh cắt từ cùng một bài có thể lấy hai đường
 * khác nhau — trống của bài A ghép với giọng của bài A là chuyện thường nhất
 * trong một bản mashup. Tra theo `baiId` không thôi thì mảnh thứ hai nhận
 * nhầm tiếng của mảnh thứ nhất, và bản dựng ra vẫn nghe được: chỉ là sai
 * đường, không có lỗi nào để thấy.
 */
export function khoaNguon(m: { baiId: string; nguon: string }): string {
  return `${m.baiId}/${m.nguon}`;
}

/** Thông tin về một ĐƯỜNG của một bài mà bước dựng cần. */
export interface NguonManh {
  am: AmThanh;
  bpm: number;
  /** Chủ âm 0…11, hoặc `null` khi không dò được / không muốn dịch tông. */
  chuAm: number | null;
}

export interface BanDung {
  /** Nhịp chung của cả bản dựng. */
  bpm: number;
  /** Chủ âm chung 0…11, hoặc `null` để không dịch tông mảnh nào. */
  chuAm: number | null;
  manh: Manh[];
}

/* ══════════════════════════════════════════════════════════
   Những phép tính thuần — chốt được từng con số
   ══════════════════════════════════════════════════════════ */

/**
 * Dịch bao nhiêu nửa cung để đi từ `tu` tới `den`, chọn đường NGẮN NHẤT.
 *
 * Kết quả luôn nằm trong [−6, +6]: quá 6 thì đi vòng kia gần hơn.
 */
export function nuaCungGan(tu: number, den: number): number {
  const d = (((den - tu) % 12) + 12) % 12;
  return d > 6 ? d - 12 : d;
}

/** Tỉ lệ kéo của một mảnh: <1 là ngắn lại (bài chậm kéo lên nhanh hơn). */
export function tiLeManh(bpmGoc: number, bpmDich: number): number {
  if (!(bpmGoc > 0) || !(bpmDich > 0)) return 1;
  return tiLeTuBpm(bpmGoc, bpmDich);
}

/** Độ dài mảnh SAU khi kéo, giây. */
export function daiSauKeo(m: Manh, tiLe: number): number {
  return Math.max(0, m.denGiay - m.tuGiay) * tiLe;
}

/**
 * Độ dài cả bản dựng, giây — mảnh kết thúc muộn nhất.
 *
 * `nguon` cho biết nhịp gốc từng bài; thiếu bài nào thì mảnh của nó coi như
 * không kéo (tỉ lệ 1) chứ không bị bỏ qua, vì bỏ qua sẽ làm bản dựng NGẮN đi
 * một cách âm thầm.
 */
export function daiBanDung(bd: BanDung, nguon: Record<string, { bpm: number }>): number {
  let het = 0;
  for (const m of bd.manh) {
    const tl = tiLeManh(nguon[khoaNguon(m)]?.bpm ?? 0, bd.bpm);
    het = Math.max(het, m.datGiay + daiSauKeo(m, tl));
  }
  return het;
}

/**
 * Đường bao fade của một mảnh dài `n` mẫu.
 *
 * Đẳng công suất: `sin(π/2 · t)` lên và `cos` xuống. Hai mảnh chồng nhau bằng
 * cặp này thì tổng công suất phẳng suốt cú chuyển.
 *
 * ⚠️ Fade vào và fade ra cộng lại KHÔNG được vượt `n`. Vượt thì hai đường bao
 * chồng lên nhau và đoạn giữa bị nhân hai lần — mảnh tụt xuống gần im ở đúng
 * giữa. Ở đây chúng bị co lại theo tỉ lệ chứ không bị cắt cụt một cái.
 */
export function baoFade(n: number, vaoMau: number, raMau: number): Float32Array {
  const bao = new Float32Array(n);
  let v = Math.max(0, Math.min(n, Math.round(vaoMau)));
  let r = Math.max(0, Math.min(n, Math.round(raMau)));
  if (v + r > n && v + r > 0) {
    const co = n / (v + r);
    v = Math.floor(v * co);
    r = Math.floor(r * co);
  }
  for (let i = 0; i < n; i++) {
    let g = 1;
    if (v > 0 && i < v) g = Math.sin((Math.PI / 2) * (i / v));
    if (r > 0 && i >= n - r) {
      g = Math.min(g, Math.cos((Math.PI / 2) * ((i - (n - r)) / r)));
    }
    bao[i] = g;
  }
  return bao;
}

/* ══════════════════════════════════════════════════════════
   Dựng
   ══════════════════════════════════════════════════════════ */

export interface KetQuaDung {
  am: AmThanh;
  /** Mảnh nào đã vào được, theo `id`. */
  daDung: string[];
  /** Mảnh bị bỏ, kèm lý do — giao diện PHẢI hiện, không được nuốt. */
  boQua: Array<{ id: string; viSao: string }>;
  /** Đỉnh của bản tổng TRƯỚC khi hạn biên. >1 nghĩa là đã cộng quá tay. */
  dinhTruoc: number;
}

/** Trần tỉ lệ kéo mà WSOLA còn nghe được. Ngoài khoảng này thì mảnh bị bỏ. */
const KEO_MIN = 0.5;
const KEO_MAX = 2;

/**
 * Dựng cả bản mashup thành một `AmThanh`.
 *
 * KHÔNG hạn biên ở đây: người gọi quyết định trần, và `dinhTruoc` cho họ biết
 * có cần hay không. Trộn hạn biên vào đây thì không đo được "đã cộng quá tay
 * bao nhiêu" nữa — con số đó bị chính bộ hạn biên xoá đi.
 */
export function dungBan(
  bd: BanDung,
  nguon: Record<string, NguonManh>,
  tanSoMau: number,
): KetQuaDung {
  const daDung: string[] = [];
  const boQua: Array<{ id: string; viSao: string }> = [];

  /* Số kênh của bản dựng = nhiều nhất trong các nguồn. Ép về mono vì có một
     bài mono là vứt ảnh stereo của mọi bài còn lại. */
  let soKenh = 1;
  for (const m of bd.manh) {
    const n = nguon[khoaNguon(m)];
    if (n) soKenh = Math.max(soKenh, n.am.kenh.length);
  }

  const dai = daiBanDung(bd, nguon);
  const tongMau = Math.max(1, Math.ceil(dai * tanSoMau));
  const ra: Float32Array[] = [];
  for (let c = 0; c < soKenh; c++) ra.push(new Float32Array(tongMau));

  for (const m of bd.manh) {
    const n = nguon[khoaNguon(m)];
    if (!n) { boQua.push({ id: m.id, viSao: 'Không còn bài nguồn của mảnh này' }); continue; }

    const daiGoc = m.denGiay - m.tuGiay;
    if (!(daiGoc > 0)) { boQua.push({ id: m.id, viSao: 'Đoạn cắt rỗng' }); continue; }

    const tl = tiLeManh(n.bpm, bd.bpm);
    if (tl < KEO_MIN || tl > KEO_MAX) {
      boQua.push({
        id: m.id,
        viSao: `Phải kéo ${tl.toFixed(2)} lần — ngoài khoảng nghe được `
             + `(${KEO_MIN}…${KEO_MAX}). Nhịp gốc dò ra ${n.bpm.toFixed(1)} BPM; `
             + 'nếu con số đó sai thì sửa nó trước.',
      });
      continue;
    }

    /* CẮT TRƯỚC. Kéo cả bài rồi cắt là làm thừa gấp mấy chục lần. */
    const tuMau = Math.max(0, Math.round(m.tuGiay * tanSoMau));
    const denMau = Math.min(n.am.kenh[0]?.length ?? 0, Math.round(m.denGiay * tanSoMau));
    if (denMau <= tuMau) { boQua.push({ id: m.id, viSao: 'Đoạn cắt nằm ngoài bài' }); continue; }
    const lat = n.am.kenh.map((k) => k.subarray(tuMau, denMau));

    const nuaCung = bd.chuAm === null || n.chuAm === null
      ? 0 : nuaCungGan(n.chuAm, bd.chuAm);

    const daKeo = chinhBai(lat, { tiLeNhip: tl, nuaCung });
    const nMau = daKeo[0]?.length ?? 0;
    if (nMau === 0) { boQua.push({ id: m.id, viSao: 'Kéo xong không còn mẫu nào' }); continue; }

    const bao = baoFade(nMau, m.vaoGiay * tanSoMau, m.raGiay * tanSoMau);
    const he = 10 ** (m.gainDb / 20);
    const dat = Math.max(0, Math.round(m.datGiay * tanSoMau));

    for (let c = 0; c < soKenh; c++) {
      /* Nguồn mono vào bản dựng stereo: dùng lại kênh 0 cho mọi kênh, không
         để im một bên. */
      const src = daKeo[Math.min(c, daKeo.length - 1)];
      const dst = ra[c];
      if (!src || !dst) continue;
      const het = Math.min(nMau, dst.length - dat);
      for (let i = 0; i < het; i++) dst[dat + i]! += src[i]! * bao[i]! * he;
    }
    daDung.push(m.id);
  }

  let dinhTruoc = 0;
  for (const k of ra) {
    for (let i = 0; i < k.length; i++) {
      const v = k[i]! < 0 ? -k[i]! : k[i]!;
      if (v > dinhTruoc) dinhTruoc = v;
    }
  }

  return { am: { kenh: ra, tanSoMau }, daDung, boQua, dinhTruoc };
}
