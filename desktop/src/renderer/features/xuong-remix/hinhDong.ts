/**
 * Phần TÍNH của dòng thời gian: đổi giây ↔ điểm ảnh, bắt nhịp, hình mảnh.
 *
 * ⚠️ Tên tệp CỐ Ý không phải `dongThoiGian.ts`. Nó từng mang tên đó, nằm cạnh
 * `DongThoiGian.tsx` — chỉ khác nhau một chữ hoa. Trên Linux đó là hai tệp;
 * trên macOS và Windows đó là MỘT, nên `import { DongThoiGian } from
 * './DongThoiGian'` rơi vào tệp này và lượt dựng chết:
 *     "DongThoiGian" is not exported by ".../dongThoiGian.ts"
 * Cả `tsc`, 1210 phép kiểm, `vite build` lẫn bộ đo bố cục đều xanh — tất cả
 * chạy trên Linux. Chốt chặn nằm ở `src/tenTepDungHoa.test.ts`.
 *
 * Tách khỏi phần vẽ vì đây là chỗ một lỗi đi thẳng vào bản nhạc: kéo một mảnh
 * lệch nửa ô thì bản mashup lệch nhịp, mà trên màn hình nó vẫn nằm "trông như
 * đúng chỗ". Ở dạng hàm thuần thì chốt được từng con số.
 */
import type { ManhDung } from '../../../shared/ipc';

/** Một Ô nhạc = 4 phách. Đơn vị mà người làm nhạc thật sự nghĩ bằng. */
export const PHACH_MOI_O = 4;

export function giayMoiPhach(bpm: number): number {
  return bpm > 0 ? 60 / bpm : 0.5;
}

export function giayMoiO(bpm: number): number {
  return giayMoiPhach(bpm) * PHACH_MOI_O;
}

/**
 * Bắt về lưới nhạc.
 *
 * `chia` là số phần một Ô bị chia ra: 1 = bắt theo ô, 4 = theo phách, 16 = theo
 * nốt móc kép. `0` là tắt hẳn.
 *
 * ⚠️ Bắt theo GIÂY chứ không theo điểm ảnh. Bắt theo điểm ảnh thì lưới đổi
 * theo mức phóng to, và cùng một thao tác kéo ra hai kết quả khác nhau tuỳ
 * người dùng đang zoom bao nhiêu — thứ không ai gỡ ra được là mình đã làm gì.
 */
export function batNhip(giay: number, bpm: number, chia: number): number {
  if (chia <= 0) return Math.max(0, giay);
  const buoc = giayMoiO(bpm) / chia;
  if (!(buoc > 0)) return Math.max(0, giay);
  return Math.max(0, Math.round(giay / buoc) * buoc);
}

/** Tỉ lệ kéo của một mảnh. Trùng `tiLeManh` của main, chép ở đây vì renderer
    không nạp được mã main — nên có phép kiểm chốt hai bên khớp nhau. */
export function tiLeKeo(bpmGoc: number, bpmDich: number): number {
  if (!(bpmGoc > 0) || !(bpmDich > 0)) return 1;
  return bpmGoc / bpmDich;
}

/** Mảnh chiếm bao nhiêu giây TRÊN dòng thời gian (đã kéo). */
export function daiTrenDong(m: ManhDung, tiLe: number): number {
  return Math.max(0, m.denGiay - m.tuGiay) * tiLe;
}

/** Khung của mảnh trên dòng thời gian, theo điểm ảnh. */
export function khungManh(
  m: ManhDung, tiLe: number, pxMoiGiay: number,
): { trai: number; rong: number } {
  return {
    trai: m.datGiay * pxMoiGiay,
    /* Tối thiểu 6px: một mảnh 40ms ở mức phóng nhỏ ra 0px, và một mảnh rộng 0
       thì không bấm vào được để xoá — nó thành rác vĩnh viễn trên bản dựng. */
    rong: Math.max(6, daiTrenDong(m, tiLe) * pxMoiGiay),
  };
}

/**
 * Cắt bớt đầu mảnh (kéo mép TRÁI).
 *
 * Kéo mép trái phải đổi CẢ HAI: `tuGiay` (cắt sâu hơn vào bài gốc) và
 * `datGiay` (mảnh bắt đầu muộn hơn trên dòng thời gian). Đổi mỗi một cái là
 * mảnh trượt đi thay vì bị cắt — thao tác trông giống hệt nhau mà kết quả
 * khác hẳn.
 *
 * `dGiayDong` là quãng dịch tính TRÊN DÒNG THỜI GIAN; trong bài gốc nó tương
 * ứng `dGiayDong / tiLe`.
 */
export function catTrai(m: ManhDung, dGiayDong: number, tiLe: number): ManhDung {
  const dGoc = dGiayDong / (tiLe || 1);
  /* Không cho mép trái vượt qua mép phải, và không cho nó lùi trước đầu bài. */
  const tu = Math.min(m.denGiay - 0.05, Math.max(0, m.tuGiay + dGoc));
  const that = tu - m.tuGiay;                  // lượng THẬT SỰ cắt được
  return { ...m, tuGiay: tu, datGiay: Math.max(0, m.datGiay + that * tiLe) };
}

/** Cắt bớt đuôi mảnh (kéo mép PHẢI). Chỉ đổi `denGiay`. */
export function catPhai(m: ManhDung, dGiayDong: number, tiLe: number, daiBai: number): ManhDung {
  const dGoc = dGiayDong / (tiLe || 1);
  const den = Math.max(m.tuGiay + 0.05, Math.min(daiBai, m.denGiay + dGoc));
  return { ...m, denGiay: den };
}

/**
 * Xếp mảnh vào LÀN theo bài nguồn.
 *
 * Một làn cho mỗi bài, theo đúng thứ tự bài xuất hiện lần đầu. Đó là cách đọc
 * tự nhiên của một bản mashup — "chỗ này bài A hát, chỗ kia bài B vào" — và nó
 * không cần thêm một trường `lan` nào trong dữ liệu, tức không có gì để lệch
 * giữa thứ hiện trên màn hình và thứ gửi xuống bộ dựng.
 */
export function lanTheoBai(manh: readonly ManhDung[]): string[] {
  const ra: string[] = [];
  for (const m of manh) if (!ra.includes(m.baiId)) ra.push(m.baiId);
  return ra;
}

/**
 * Vạch lưới nên vẽ, theo giây.
 *
 * Thưa dần khi thu nhỏ: dưới ~12px một ô thì vẽ mỗi ô một vạch là một mảng
 * xám đặc, không còn là lưới nữa.
 */
export function vachLuoi(daiGiay: number, bpm: number, pxMoiGiay: number): number[] {
  /* Chặn `bpm` TRỰC TIẾP, không dựa vào `giayMoiO`.
     `giayMoiPhach` có lưới đỡ chia-cho-0 trả về 0,5s — hợp lý cho phép tính,
     nhưng ở đây nó biến "không biết nhịp" thành một lưới 120 BPM trông y hệt
     một lưới thật. Không có nhịp thì đừng vẽ lưới: dòng thời gian trống nói
     đúng sự thật, còn lưới bịa thì người dùng căn mảnh theo nó. */
  if (!(bpm > 0) || !(daiGiay > 0)) return [];
  const oGiay = giayMoiO(bpm);
  if (!(oGiay > 0)) return [];
  let buocO = 1;
  while (oGiay * buocO * pxMoiGiay < 12 && buocO < 1024) buocO *= 2;
  const ra: number[] = [];
  for (let t = 0; t <= daiGiay; t += oGiay * buocO) ra.push(t);
  return ra;
}

/** Số Ô tại một mốc giây — nhãn của vạch lưới, đếm từ 1 như mọi DAW. */
export function soO(giay: number, bpm: number): number {
  const o = giayMoiO(bpm);
  return o > 0 ? Math.round(giay / o) + 1 : 1;
}
