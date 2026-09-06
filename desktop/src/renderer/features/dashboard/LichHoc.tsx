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
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bot, BotOff, CalendarDays, Check, CircleSlash, FileText, Pencil, Plus } from 'lucide-react';
import { useSession } from '../../auth/session';
import { useAppState } from '../../app-state';
/* Kiểu, bảng màu và mấy hàm ngày giờ nằm ở `@/lib/lich/chung` vì WEB cũng
   dùng đúng chúng. Tái xuất ở đây để mọi chỗ đang `import ... from './LichHoc'`
   không phải sửa, và để bảng màu không bao giờ tách làm hai. */
export {
  TRAN_NGHI, MAU_MON, mauMon, ngayISO, ngayCuaThu, conMayPhut,
  type Buoi, type DiemDanh,
} from '@/lib/lich/chung';
import {
  TRAN_NGHI, mauMon, ngayISO, ngayCuaThu, conMayPhut,
  type Buoi, type DiemDanh,
} from '@/lib/lich/chung';
import { SoanLich } from './SoanLich';

const THU = [
  { n: 2, ten: 'Thứ 2' }, { n: 3, ten: 'Thứ 3' }, { n: 4, ten: 'Thứ 4' },
  { n: 5, ten: 'Thứ 5' }, { n: 6, ten: 'Thứ 6' }, { n: 7, ten: 'Thứ 7' }, { n: 8, ten: 'CN' },
];

export function LichHoc({ onHomNay }: { onHomNay?: (ds: Buoi[]) => void } = {}) {
  const { api } = useSession();
  const [buoi, datBuoi] = useState<Buoi[]>([]);
  const [diemDanh, datDiemDanh] = useState<DiemDanh[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [moChon, datMoChon] = useState<string | null>(null); // `${id}|${ngay}`
  const [moSoan, datMoSoan] = useState(false);
  const { settings, setSetting } = useAppState();
  const nhacRobot = settings.nhacLichRobot !== false;

  const homNay = new Date();
  const thuHomNay = homNay.getDay() === 0 ? 8 : homNay.getDay() + 1;

  const nap = useCallback(async () => {
    if (!api) return;
    try {
      const ds = await api.request<{ items: Buoi[] }>(
        `/api/v1/class-schedule?ngay=${ngayISO(new Date())}`,
      );
      const items = ds?.items ?? [];
      datBuoi(items);
      /* Đưa buổi HÔM NAY lên trang cha để dải 24 giờ tô được. Lọc ở đây chứ
         không để bên kia gọi lại API: hai lời gọi cùng một dữ liệu, và hai lần
         nạp lệch nhau thì lịch với dải 24 giờ nói hai chuyện khác nhau. */
      const t = new Date().getDay() === 0 ? 8 : new Date().getDay() + 1;
      onHomNay?.(items.filter((b) => b.weekday === t));
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
  }, [api, onHomNay]);

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
      <>
      {moSoan && <SoanLich onDong={() => datMoSoan(false)} onXong={() => void nap()} />}
      <section className="ct-lich ct-lich-trong">
        <CalendarDays size={22} aria-hidden />
        <div>
          <strong>Chưa có thời khoá biểu</strong>
          <p>Thêm buổi học để thấy lịch tuần, nhắc trước giờ và đếm buổi nghỉ.</p>
        </div>
        <button type="button" className="ct-btn ct-btn-chinh" onClick={() => datMoSoan(true)}>
          <Plus size={14} aria-hidden /> Thêm buổi học
        </button>
      </section>
      </>
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
      {moSoan && <SoanLich onDong={() => datMoSoan(false)} onXong={() => void nap()} />}
      <div className="ct-lich-dau">
        <h2><CalendarDays size={15} aria-hidden /> Lịch học tuần này</h2>
        <span className="ct-muted">Bấm vào buổi để chấm điểm danh</span>
        {/* Tắt robot nhắc NGAY TẠI ĐÂY, không bắt đi lục Cài đặt: thứ làm phiền
            phải tắt được ở đúng chỗ nó làm phiền, không thì người ta tắt cả
            robot cho xong. */}
        <button
          type="button"
          className="ct-btn ct-lich-robot"
          data-tat={!nhacRobot}
          onClick={() => setSetting('nhacLichRobot', !nhacRobot)}
          title={nhacRobot
            ? 'Robot đang nhắc 10 phút một lần — bấm để tắt'
            : 'Robot đã tắt nhắc lịch — bấm để bật lại'}
        >
          {nhacRobot ? <Bot size={13} aria-hidden /> : <BotOff size={13} aria-hidden />}
          {nhacRobot ? 'Robot đang nhắc' : 'Robot đã tắt'}
        </button>
        <button type="button" className="ct-btn ct-lich-sua" onClick={() => datMoSoan(true)}>
          <Pencil size={12} aria-hidden /> Sửa lịch
        </button>
      </div>

      {canhBao.length > 0 && (
        <div className="ct-lich-canh">
          {canhBao.map(([mon, n]) => (
            <span key={mon} data-nguy={n >= TRAN_NGHI}>
              {n >= TRAN_NGHI
                ? <AlertTriangle size={11} aria-hidden />
                : <i className="ct-lich-cham-mau" style={{ background: mauMon(mon) }} aria-hidden />}
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
                          <div
                            key={b.id}
                            className="ct-lich-o"
                            data-tt={tt ?? 'chua'}
                            data-sap={sapToi}
                            style={{ '--mau': mauMon(b.subject, b.color) } as React.CSSProperties}
                          >
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
                                <button
                                  type="button"
                                  className="ct-lich-go"
                                  onClick={() => { datMoChon(null); datMoSoan(true); }}
                                >
                                  Sửa buổi học
                                </button>
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
