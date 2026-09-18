/**
 * ============================================================
 * LƯỚI LỊCH THÁNG
 * ============================================================
 *
 * Thuần, không React, không `Date.now()` ẩn — mọi hàm nhận mốc thời
 * gian từ ngoài vào. Lịch là thứ sai một ô thì sai cả tháng, và một
 * phép kiểm chạy 3ms rẻ hơn nhiều so với phát hiện ra vào ngày mùng 1.
 *
 * ⚠️ Tuần ở Việt Nam bắt đầu từ THỨ HAI, còn `Date.getDay()` coi Chủ
 * Nhật là 0. Đây là chỗ sai kinh điển: quên đổi thì cả lưới lệch một
 * ô, và nó chỉ lộ ra ở những tháng bắt đầu vào Chủ Nhật.
 */

export const TEN_THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;
const THU_DAY_DU = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/** `Date` → `YYYY-MM-DD` theo giờ MÁY, không theo UTC. */
export function ngayMay(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Chỉ số cột của một ngày trong lưới bắt đầu từ Thứ Hai: T2 = 0 … CN = 6.
 *
 * `(getDay() + 6) % 7` chứ không phải `getDay() - 1`: trừ 1 cho Chủ
 * Nhật ra −1, và −1 thì không phải một cột nào cả.
 */
export function cotCuaThu(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export interface ONgay {
  /** YYYY-MM-DD */
  ngay: string;
  /** Số ngày trong tháng, để hiện trong ô. */
  so: number;
  /** Thuộc tháng đang xem hay là ngày đệm của tháng trước/sau. */
  trongThang: boolean;
  /** Thứ Bảy hoặc Chủ Nhật. */
  cuoiTuan: boolean;
}

/**
 * Lưới 6 hàng × 7 cột cho một tháng.
 *
 * Luôn 6 hàng, kể cả khi tháng chỉ cần 5: lưới co giãn làm cả trang
 * nhảy lên nhảy xuống mỗi lần đổi tháng, và mắt người đọc lịch bằng
 * VỊ TRÍ — đổi chiều cao là bắt họ tìm lại từ đầu.
 */
export function luoiThang(nam: number, thang: number): ONgay[] {
  const dau = new Date(nam, thang - 1, 1);
  const lui = cotCuaThu(dau);
  const o: ONgay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(nam, thang - 1, 1 - lui + i);
    o.push({
      ngay: ngayMay(d),
      so: d.getDate(),
      trongThang: d.getMonth() === thang - 1 && d.getFullYear() === nam,
      cuoiTuan: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  return o;
}

/** `'2026-09-18'` → `'Thứ Sáu, 18/09/2026'`. */
export function ngayDayDu(iso: string): string {
  const [n, t, g] = iso.split('-').map(Number);
  if (!n || !t || !g) return iso;
  const d = new Date(n, t - 1, g);
  return `${THU_DAY_DU[d.getDay()]}, ${String(g).padStart(2, '0')}/${String(t).padStart(2, '0')}/${n}`;
}

/** Nhích tháng, tự cuộn năm. `(2026, 12, +1)` → `{nam: 2027, thang: 1}`. */
export function nhichThang(nam: number, thang: number, buoc: number): { nam: number; thang: number } {
  const t = thang - 1 + buoc;
  return { nam: nam + Math.floor(t / 12), thang: ((t % 12) + 12) % 12 + 1 };
}

/** `'2026-09'`. */
export function maThang(nam: number, thang: number): string {
  return `${nam}-${String(thang).padStart(2, '0')}`;
}

/**
 * `Date` → chuỗi cho `<input type="time">` (`'14:30'`), theo giờ MÁY.
 */
export function gioMay(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * `('2026-09-18', '14:30')` → ISO của đúng 14:30 giờ MÁY hôm đó.
 *
 * ⚠️ KHÔNG ghép chuỗi thành `'2026-09-18T14:30'` rồi `new Date(...)`:
 * chuỗi ISO có chữ `T` mà KHÔNG có múi giờ được engine hiểu là giờ máy
 * — nhưng `'2026-09-18'` trần (không có `T`) lại được hiểu là UTC. Hai
 * cách đọc khác nhau cho hai chuỗi trông gần giống nhau là đúng loại
 * bẫy sinh ra lỗi lệch 7 tiếng chỉ xuất hiện với một số người dùng.
 * Dựng bằng `new Date(nam, thang, ngay, giờ, phút)` thì không có chỗ
 * nào để hiểu nhầm.
 */
export function ghepGio(ngay: string, gio: string): string | null {
  if (!ngay || !gio) return null;
  const [n, t, g] = ngay.split('-').map(Number);
  const [h, p] = gio.split(':').map(Number);
  if (!n || !t || !g || Number.isNaN(h) || Number.isNaN(p)) return null;
  return new Date(n, t - 1, g, h, p, 0, 0).toISOString();
}

/** `95` → `'1 giờ 35 phút'`. Cho thời lượng dự kiến. */
export function moTaPhut(phut: number | null | undefined): string {
  if (!phut || phut <= 0) return '';
  if (phut < 60) return `${phut} phút`;
  const g = Math.floor(phut / 60);
  const p = phut % 60;
  return p === 0 ? `${g} giờ` : `${g} giờ ${p} phút`;
}

/**
 * Tổng số phút đã xếp trong một ngày.
 *
 * Để giao diện nói được "đã xếp 9 giờ 30" TRƯỚC khi ngày bắt đầu. Kế
 * hoạch xa thực tế là nguyên nhân số một của việc trượt, và nó nhìn
 * thấy được — nhưng chỉ khi có ai đó cộng hộ.
 */
export function tongPhut(ds: Array<{ phutLam?: number | null }>): number {
  return ds.reduce((t, v) => t + (v.phutLam ?? 0), 0);
}

export interface Cham {
  batDauAt?: string | null;
  phutLam?: number | null;
  title?: string;
}

/**
 * Các cặp việc CHỒNG GIỜ nhau trong ngày.
 *
 * Không chặn — người ta có quyền xếp chồng, và đôi khi là cố ý. Nhưng
 * xếp chồng mà KHÔNG BIẾT mình đang xếp chồng thì đến giờ mới phát
 * hiện, và lúc đó một trong hai việc chắc chắn trượt.
 */
export function chongGio<T extends Cham>(ds: T[]): Array<[T, T]> {
  const co = ds
    .map((v) => {
      if (!v.batDauAt || !v.phutLam) return null;
      const t = new Date(v.batDauAt).getTime();
      if (Number.isNaN(t)) return null;
      return { v, dau: t, cuoi: t + v.phutLam * 60_000 };
    })
    .filter((x): x is { v: T; dau: number; cuoi: number } => x !== null)
    .sort((a, b) => a.dau - b.dau);

  const ra: Array<[T, T]> = [];
  for (let i = 1; i < co.length; i += 1) {
    /* So với NGƯỜI TRƯỚC LIỀN KỀ là đủ vì đã sắp theo giờ bắt đầu —
       nhưng chỉ đủ khi việc trước không bao trùm nhiều việc sau. Nên
       so ngược lại tới khi hết chồng, chứ không chỉ so một bước. */
    for (let j = i - 1; j >= 0; j -= 1) {
      if (co[j]!.cuoi <= co[i]!.dau) continue;
      ra.push([co[j]!.v, co[i]!.v]);
    }
  }
  return ra;
}
