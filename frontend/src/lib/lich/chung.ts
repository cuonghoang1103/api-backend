/**
 * Thời khoá biểu — phần DÙNG CHUNG giữa web và app desktop.
 *
 * Ở đây vì cả hai bên cùng cần đúng những thứ này, và chép sang hai chỗ là
 * mầm trôi dạt: đổi bảng màu một bên thì cùng một môn ra hai màu khác nhau
 * trên hai màn hình, mà không có gì báo. Desktop nạp lại tệp này qua bí danh
 * `@/lib/...` giống mọi mã web nó dùng lại.
 *
 * Chỉ chứa hàm THUẦN — không React, không gọi mạng.
 */

/** Nghỉ quá con số này là không qua môn. Quy định của trường. */
export const TRAN_NGHI = 4;

/**
 * Màu cho từng môn.
 *
 * Tám màu chọn tay chứ không sinh từ HSL: HSL rải đều cho ra vàng và lục sát
 * nhau tới mức liếc qua không phân biệt được, mà phân biệt được mới là toàn bộ
 * mục đích. Tám màu này đều đọc rõ trên CẢ nền tối lẫn nền sáng — chúng chỉ
 * làm viền và chữ, còn nền ô là `color-mix` pha loãng nên độ tương phản chữ
 * vẫn do biến chủ đề quyết định.
 */
export const MAU_MON = [
  '#f87171', '#fb923c', '#fbbf24', '#4ade80',
  '#2dd4bf', '#60a5fa', '#c084fc', '#f472b6',
] as const;

/**
 * Môn nào ra màu nấy, CỐ ĐỊNH giữa các lần mở app.
 *
 * Băm theo tên chứ không phát màu theo thứ tự xuất hiện: xếp theo thứ tự thì
 * thêm một buổi mới là cả bảng đổi màu, và người dùng vừa học thuộc "xanh lá
 * là Lab" đã phải học lại.
 */
export function mauMon(ten: string, dat?: string | null): string {
  if (dat && /^#[0-9a-f]{3,8}$/i.test(dat)) return dat;
  let h = 0;
  for (let i = 0; i < ten.length; i++) h = (h * 31 + ten.charCodeAt(i)) >>> 0;
  return MAU_MON[h % MAU_MON.length]!;
}


export interface Buoi {
  id: number;
  subject: string;
  classCode?: string | null;
  teacher?: string | null;
  room?: string | null;
  weekday: number;
  startTime: string;
  endTime: string;
  note?: string | null;
  color?: string | null;
  remindMinutes?: number;
  soBuoiVang?: number;
}

export interface DiemDanh { id: number; scheduleId: number; date: string; status: string }

/** `Date` → `YYYY-MM-DD` theo GIỜ MÁY (không dùng toISOString — nó cho giờ UTC). */
export function ngayISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Ngày của thứ `n` (2..8) trong tuần chứa `moc`. Tuần bắt đầu từ thứ Hai. */
export function ngayCuaThu(moc: Date, n: number): Date {
  const d = new Date(moc);
  const thuHienTai = d.getDay() === 0 ? 8 : d.getDay() + 1; // CN=0 → 8
  d.setDate(d.getDate() + (n - thuHienTai));
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Còn bao lâu tới giờ học, tính bằng phút. Âm = đã qua. */
export function conMayPhut(startTime: string, bayGio = new Date()): number {
  const [g, p] = startTime.split(':').map(Number);
  const t = new Date(bayGio);
  t.setHours(g ?? 0, p ?? 0, 0, 0);
  return Math.round((t.getTime() - bayGio.getTime()) / 60000);
}



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

/**
 * Giờ nào trong ngày có buổi học — cho lưới giờ CUỘN DÒNG của web.
 *
 * Desktop vẽ dải 24 giờ trên MỘT hàng nên đặt được ô học trải ngang bằng
 * `xepLan`. Web xếp 24 ô thành nhiều dòng (6/8/12 cột tuỳ bề rộng), nên một
 * buổi 3 tiếng có thể bị ngắt giữa dòng — không có "ô trải ngang" nào để vẽ.
 * Ở đó phải đánh dấu TỪNG Ô.
 *
 * `dau` = ô đầu của buổi, chỗ DUY NHẤT ghi tên môn: lặp "SWT301" ba lần liền
 * nhau trong ba ô vuông bé thì chữ chen hết chỗ mà không thêm thông tin nào.
 */
export function phuTheoGio(ds: Buoi[]): Map<number, { buoi: Buoi; dau: boolean }> {
  const ra = new Map<number, { buoi: Buoi; dau: boolean }>();
  for (const x of xepLan(ds).o) {
    for (let h = x.tu; h < x.den; h++) {
      // Giờ đã có buổi khác thì giữ buổi ĐẦU TIÊN (xepLan đã xếp theo giờ bắt
      // đầu) — đè lên nhau thì mất hẳn một buổi khỏi tầm mắt.
      if (!ra.has(h)) ra.set(h, { buoi: x.buoi, dau: h === x.tu });
    }
  }
  return ra;
}
