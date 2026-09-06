/**
 * Xếp buổi học của HÔM NAY lên dải 24 giờ của trang Tổng quan.
 *
 * Dải là một lưới 24 cột, mỗi cột một giờ. Buổi học không rơi đúng đầu giờ
 * (07:30–09:50), nên nó được phủ theo GIỜ NÓ CHẠM: 07:30–09:50 phủ cột 7, 8, 9.
 * Làm tròn xuống ở đầu và lên ở cuối — thà chiếm rộng hơn một chút còn hơn vẽ
 * thiếu mất cái đuôi 50 phút rồi người dùng tưởng giờ đó đang rảnh.
 *
 * Hai buổi chồng giờ thì xuống LÀN dưới thay vì đè lên nhau. Trong thời khoá
 * biểu của trường chuyện này hiếm, nhưng lúc nó xảy ra mà hai ô đè nhau thì
 * người dùng mất hẳn một buổi khỏi tầm mắt và không có gì báo.
 */
import type { Buoi } from './LichHoc';

export interface OHoc {
  buoi: Buoi;
  /** Cột bắt đầu, 0..23. */
  tu: number;
  /** Cột kết thúc (không bao gồm), 1..24. */
  den: number;
  /** Làn, 0 là trên cùng. */
  lan: number;
}

/** `"07:30"` → `450`. Trả `null` khi không phải giờ hợp lệ. */
function phut(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s ?? '').trim());
  if (!m) return null;
  const h = Number(m[1]);
  const p = Number(m[2]);
  if (h > 23 || p > 59) return null;
  return h * 60 + p;
}

export function xepLan(ds: Buoi[]): { o: OHoc[]; soLan: number } {
  const tho: Array<Omit<OHoc, 'lan'>> = [];
  for (const b of ds) {
    const bd = phut(b.startTime);
    const kt = phut(b.endTime);
    if (bd === null || kt === null || kt <= bd) continue;
    const tu = Math.max(0, Math.min(23, Math.floor(bd / 60)));
    const den = Math.max(tu + 1, Math.min(24, Math.ceil(kt / 60)));
    tho.push({ buoi: b, tu, den });
  }
  tho.sort((a, b) => (a.tu - b.tu) || (a.den - b.den) || (a.buoi.id - b.buoi.id));

  /** Cột kết thúc của buổi cuối cùng trên từng làn. */
  const cuoi: number[] = [];
  const o: OHoc[] = [];
  for (const t of tho) {
    let lan = cuoi.findIndex((c) => c <= t.tu);
    if (lan === -1) { lan = cuoi.length; cuoi.push(0); }
    cuoi[lan] = t.den;
    o.push({ ...t, lan });
  }
  return { o, soLan: cuoi.length };
}
