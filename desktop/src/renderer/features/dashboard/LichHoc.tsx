/**
 * ============================================================
 * THỜI KHOÁ BIỂU + ĐIỂM DANH
 * ============================================================
 *
 * Dựng theo đúng cách trường bày lịch (FAP): hàng = khung giờ, cột = thứ. Đó là
 * hình dạng người học đã quen đọc — đổi sang danh sách dọc thì họ phải dịch lại
 * trong đầu mỗi lần nhìn.
 *
 * ─── Ba việc nó phải làm, theo thứ tự quan trọng ───
 *  1. "Hôm nay tôi học gì, mấy giờ, phòng nào?" → cột hôm nay tô sáng, buổi
 *     sắp tới có nhãn đếm ngược.
 *  2. "Tôi nghỉ mấy buổi rồi?" → nghỉ quá 4 buổi là KHÔNG QUA MÔN, nên con số
 *     đó phải đập vào mắt chứ không nằm trong một trang thống kê nào đó.
 *  3. "Chấm điểm danh nhanh" → bấm thẳng vào ô buổi học, không qua màn nào.
 *
 * ─── Vì sao khung giờ suy ra từ dữ liệu, không cứng 12 slot ───
 * FAP có Slot 0-12, nhưng lịch ở đây do người dùng tự nhập và có thể là lớp
 * ngoài trường, học thêm, gia sư. Gom theo `startTime` có thật thì bảng luôn
 * vừa khít: không có hàng trống, và không thiếu hàng cho một giờ lạ.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Check, CircleSlash, FileText, Plus } from 'lucide-react';
import { useSession } from '../../auth/session';

/** Nghỉ quá con số này là không qua môn. Quy định của trường. */
export const TRAN_NGHI = 4;

const THU = [
  { n: 2, ten: 'Thứ 2' }, { n: 3, ten: 'Thứ 3' }, { n: 4, ten: 'Thứ 4' },
  { n: 5, ten: 'Thứ 5' }, { n: 6, ten: 'Thứ 6' }, { n: 7, ten: 'Thứ 7' }, { n: 8, ten: 'CN' },
];

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

export function LichHoc() {
  const { api } = useSession();
  const [buoi, datBuoi] = useState<Buoi[]>([]);
  const [diemDanh, datDiemDanh] = useState<DiemDanh[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [moChon, datMoChon] = useState<string | null>(null); // `${id}|${ngay}`

  const homNay = new Date();
  const thuHomNay = homNay.getDay() === 0 ? 8 : homNay.getDay() + 1;

  const nap = useCallback(async () => {
    if (!api) return;
    try {
      const ds = await api.request<{ items: Buoi[] }>(
        `/api/v1/class-schedule?ngay=${ngayISO(new Date())}`,
      );
      datBuoi(ds?.items ?? []);
      const tu = ngayISO(ngayCuaThu(new Date(), 2));
      const den = ngayISO(ngayCuaThu(new Date(), 8));
      const dd = await api.request<{ items: DiemDanh[] }>(
        `/api/v1/class-schedule/attendance?tu=${tu}&den=${den}`,
      );
      datDiemDanh(dd?.items ?? []);
    } catch {
      /* Chưa có lịch thì API trả rỗng, không phải lỗi. Lỗi mạng thì lần sau
         vào trang sẽ nạp lại — không chặn cả trang Tổng quan vì một khối. */
    } finally {
      datDangTai(false);
    }
  }, [api]);

  useEffect(() => { void nap(); }, [nap]);

  /** Khung giờ có thật, suy từ dữ liệu — xem chú thích đầu tệp. */
  const khungGio = useMemo(
    () => [...new Set(buoi.map((b) => b.startTime))].sort(),
    [buoi],
  );

  const trangThai = useCallback((id: number, ngay: string): string | null =>
    diemDanh.find((d) => d.scheduleId === id && d.date.slice(0, 10) === ngay)?.status ?? null,
  [diemDanh]);

  const cham = async (id: number, ngay: string, status: string | null) => {
    if (!api) return;
    datMoChon(null);
    try {
      await api.request(`/api/v1/class-schedule/${id}/attendance`, {
        method: 'PUT', body: { date: ngay, status },
      });
      await nap();
    } catch { /* nạp lại sẽ trả về sự thật của máy chủ */ }
  };

  if (dangTai) return null;

  if (buoi.length === 0) {
    return (
      <section className="ct-lich ct-lich-trong">
        <CalendarDays size={22} aria-hidden />
        <div>
          <strong>Chưa có thời khoá biểu</strong>
          <p>Thêm buổi học để thấy lịch tuần, nhắc trước giờ và đếm buổi nghỉ.</p>
        </div>
        <button type="button" className="ct-btn ct-btn-chinh" onClick={() => datMoChon('them')}>
          <Plus size={14} aria-hidden /> Thêm buổi học
        </button>
      </section>
    );
  }

  /* Môn đã nghỉ nhiều — gom theo TÊN MÔN chứ không theo buổi: một môn thường có
     2-3 buổi mỗi tuần, và trường đếm số buổi nghỉ của CẢ MÔN. */
  const canhBao = Object.entries(
    buoi.reduce<Record<string, number>>((acc, b) => {
      acc[b.subject] = (acc[b.subject] ?? 0) + (b.soBuoiVang ?? 0);
      return acc;
    }, {}),
  ).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);

  return (
    <section className="ct-lich">
      <div className="ct-lich-dau">
        <h2><CalendarDays size={15} aria-hidden /> Lịch học tuần này</h2>
        <span className="ct-muted">Bấm vào buổi để chấm điểm danh</span>
      </div>

      {canhBao.length > 0 && (
        <div className="ct-lich-canh">
          {canhBao.map(([mon, n]) => (
            <span key={mon} data-nguy={n >= TRAN_NGHI}>
              {n >= TRAN_NGHI && <AlertTriangle size={11} aria-hidden />}
              {mon}: nghỉ <strong>{n}</strong>/{TRAN_NGHI}
              {n >= TRAN_NGHI && ' — KHÔNG QUA MÔN'}
            </span>
          ))}
        </div>
      )}

      <div className="ct-lich-bang-boc">
        <table className="ct-lich-bang">
          <thead>
            <tr>
              <th className="ct-lich-gio" />
              {THU.map((t) => {
                const d = ngayCuaThu(homNay, t.n);
                return (
                  <th key={t.n} data-homnay={t.n === thuHomNay}>
                    <span>{t.ten}</span>
                    <em>{d.getDate()}/{d.getMonth() + 1}</em>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {khungGio.map((gio) => (
              <tr key={gio}>
                <th className="ct-lich-gio">{gio}</th>
                {THU.map((t) => {
                  const o = buoi.filter((b) => b.weekday === t.n && b.startTime === gio);
                  const ngay = ngayISO(ngayCuaThu(homNay, t.n));
                  return (
                    <td key={t.n} data-homnay={t.n === thuHomNay}>
                      {o.map((b) => {
                        const tt = trangThai(b.id, ngay);
                        const phut = t.n === thuHomNay ? conMayPhut(b.startTime) : null;
                        const sapToi = phut !== null && phut > 0 && phut <= 120;
                        const khoa = `${b.id}|${ngay}`;
                        return (
                          <div key={b.id} className="ct-lich-o" data-tt={tt ?? 'chua'} data-sap={sapToi}>
                            <button type="button" onClick={() => datMoChon(moChon === khoa ? null : khoa)}>
                              <strong>{b.classCode || b.subject}</strong>
                              {b.room && <span>{b.room}</span>}
                              <em>{b.startTime}–{b.endTime}</em>
                              {sapToi && <b className="ct-lich-sap">còn {phut}′</b>}
                              {tt === 'co' && <Check size={11} aria-hidden className="ct-lich-dau-co" />}
                              {tt === 'vang' && <CircleSlash size={11} aria-hidden className="ct-lich-dau-vang" />}
                              {tt === 'phep' && <FileText size={11} aria-hidden className="ct-lich-dau-phep" />}
                            </button>

                            {moChon === khoa && (
                              <div className="ct-lich-cham">
                                <button type="button" onClick={() => void cham(b.id, ngay, 'co')}>Có mặt</button>
                                <button type="button" onClick={() => void cham(b.id, ngay, 'vang')}>Vắng</button>
                                <button type="button" onClick={() => void cham(b.id, ngay, 'phep')}>Có phép</button>
                                {tt && (
                                  <button type="button" className="ct-lich-go" onClick={() => void cham(b.id, ngay, null)}>
                                    Bỏ chấm
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
