'use client';

/**
 * Lịch học tuần này — bản WEB.
 *
 * Cùng dữ liệu, cùng bảng màu, cùng quy tắc với app desktop (`@/lib/lich/chung`),
 * khác mỗi lớp vỏ: desktop dùng CSS biến chủ đề, web dùng Tailwind trên nền tối.
 *
 * ─── Vì sao khung giờ suy ra từ DỮ LIỆU ───
 * Cứng 12 slot của trường thì lịch nào lệch slot (lớp bù, lớp tối) rơi ra
 * ngoài bảng mà không có gì báo. Lấy tập giờ bắt đầu có thật rồi xếp lên —
 * không hàng trống, không thiếu hàng cho một giờ lạ.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Check, CircleSlash, FileText, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { lichHocApi } from '@/lib/api';
import {
  TRAN_NGHI, conMayPhut, mauMon, ngayCuaThu, ngayISO,
  type Buoi, type DiemDanh,
} from '@/lib/lich/chung';
import SoanLich from './SoanLich';

const THU = [
  { n: 2, ten: 'Thứ 2' }, { n: 3, ten: 'Thứ 3' }, { n: 4, ten: 'Thứ 4' },
  { n: 5, ten: 'Thứ 5' }, { n: 6, ten: 'Thứ 6' }, { n: 7, ten: 'Thứ 7' }, { n: 8, ten: 'CN' },
];

export default function LichHoc({ onHomNay }: { onHomNay?: (ds: Buoi[]) => void }) {
  const [buoi, datBuoi] = useState<Buoi[]>([]);
  const [diemDanh, datDiemDanh] = useState<DiemDanh[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [moChon, datMoChon] = useState<string | null>(null); // `${id}|${ngay}`
  const [moSoan, datMoSoan] = useState(false);

  const homNay = new Date();
  const thuHomNay = homNay.getDay() === 0 ? 8 : homNay.getDay() + 1;

  const nap = useCallback(async () => {
    try {
      const ds = await lichHocApi.list(ngayISO(new Date()));
      const items = ds.data?.data?.items ?? [];
      datBuoi(items);
      const t = new Date().getDay() === 0 ? 8 : new Date().getDay() + 1;
      onHomNay?.(items.filter((b) => b.weekday === t));

      const tu = ngayISO(ngayCuaThu(new Date(), 2));
      const den = ngayISO(ngayCuaThu(new Date(), 8));
      const dd = await lichHocApi.diemDanh(tu, den);
      datDiemDanh(dd.data?.data?.items ?? []);
    } catch {
      /* Chưa có lịch thì API trả rỗng, không phải lỗi. Lỗi mạng thì lần vào
         trang sau nạp lại — không chặn cả trang Tổng quan vì một khối. */
    } finally {
      datDangTai(false);
    }
  }, [onHomNay]);

  useEffect(() => { void nap(); }, [nap]);

  const khungGio = useMemo(
    () => [...new Set(buoi.map((b) => b.startTime))].sort(),
    [buoi],
  );

  const trangThai = useCallback((id: number, ngay: string): string | null =>
    diemDanh.find((d) => d.scheduleId === id && d.date.slice(0, 10) === ngay)?.status ?? null,
  [diemDanh]);

  const cham = async (id: number, ngay: string, status: 'co' | 'vang' | 'phep' | null) => {
    datMoChon(null);
    try {
      await lichHocApi.cham(id, ngay, status);
      await nap();
    } catch {
      toast.error('Chấm điểm danh không được, thử lại giúp tôi.');
      await nap(); // nạp lại để màn hình không nói dối
    }
  };

  if (dangTai) return null;

  if (buoi.length === 0) {
    return (
      <>
        {moSoan && <SoanLich onDong={() => setTimeout(() => datMoSoan(false), 0)} onXong={() => void nap()} />}
        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <CalendarDays className="w-6 h-6 text-violet-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-200">Chưa có thời khoá biểu</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm buổi học để thấy lịch tuần, đếm buổi nghỉ và tô lên dải 24 giờ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => datMoSoan(true)}
            className="ml-auto shrink-0 flex items-center gap-1.5 rounded-xl bg-violet-500/90 hover:bg-violet-500 px-3.5 py-2 text-xs font-bold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm buổi học
          </button>
        </div>
      </>
    );
  }

  /* Cảnh báo gom theo TÊN MÔN chứ không theo buổi: một môn thường có 2-3 buổi
     mỗi tuần, mà trường đếm số buổi nghỉ của CẢ MÔN. */
  const canhBao = Object.entries(
    buoi.reduce<Record<string, number>>((acc, b) => {
      acc[b.subject] = (acc[b.subject] ?? 0) + (b.soBuoiVang ?? 0);
      return acc;
    }, {}),
  ).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
      {moSoan && <SoanLich onDong={() => datMoSoan(false)} onXong={() => void nap()} />}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <CalendarDays className="w-4 h-4 text-violet-300" /> Lịch học tuần này
        </h2>
        <span className="text-[11px] text-slate-500">Bấm vào buổi để chấm điểm danh</span>
        <button
          type="button"
          onClick={() => datMoSoan(true)}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors"
        >
          <Pencil className="w-3 h-3" /> Sửa lịch
        </button>
      </div>

      {canhBao.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {canhBao.map(([mon, n]) => {
            const nguy = n >= TRAN_NGHI;
            return (
              <span
                key={mon}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                  nguy
                    ? 'bg-red-500/15 text-red-300 font-bold'
                    : 'bg-amber-500/12 text-amber-300'
                }`}
              >
                {nguy
                  ? <AlertTriangle className="w-3 h-3" />
                  : <i className="w-2 h-2 rounded-full shrink-0" style={{ background: mauMon(mon) }} />}
                {mon}: nghỉ <b>{n}</b>/{TRAN_NGHI}{nguy && ' — KHÔNG QUA MÔN'}
              </span>
            );
          })}
        </div>
      )}

      {/* Cuộn ngang riêng: 7 cột × ô có chữ không bao giờ vừa màn hình hẹp, mà
          bóp cột lại thì mã môn bị cắt — thứ duy nhất trong ô cần đọc được. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <table className="w-full min-w-[720px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-12" />
              {THU.map((t) => {
                const d = ngayCuaThu(homNay, t.n);
                const nay = t.n === thuHomNay;
                return (
                  <th
                    key={t.n}
                    className={`rounded-lg px-1 py-1.5 text-center ${
                      nay ? 'bg-violet-500/15 ring-1 ring-violet-400/40' : ''
                    }`}
                  >
                    <span className={`block text-[11px] font-bold ${nay ? 'text-violet-200' : 'text-slate-400'}`}>
                      {t.ten}
                    </span>
                    <span className="block text-[9.5px] text-slate-600">
                      {d.getDate()}/{d.getMonth() + 1}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {khungGio.map((gio) => (
              <tr key={gio}>
                <th className="align-top pt-2 text-right pr-1 text-[10px] font-mono text-slate-600">{gio}</th>
                {THU.map((t) => {
                  const o = buoi.filter((b) => b.weekday === t.n && b.startTime === gio);
                  const ngay = ngayISO(ngayCuaThu(homNay, t.n));
                  return (
                    <td key={t.n} className={`align-top ${t.n === thuHomNay ? 'bg-violet-500/[0.06] rounded-lg' : ''}`}>
                      {o.map((b) => {
                        const tt = trangThai(b.id, ngay);
                        const con = t.n === thuHomNay ? conMayPhut(b.startTime) : null;
                        const sapToi = con !== null && con > 0 && con <= 120;
                        const khoa = `${b.id}|${ngay}`;
                        const mau = mauMon(b.subject, b.color);
                        return (
                          <div key={b.id} className="relative">
                            <button
                              type="button"
                              onClick={() => datMoChon(moChon === khoa ? null : khoa)}
                              className="block w-full rounded-lg border p-1.5 text-left transition-all hover:brightness-125"
                              style={{
                                borderColor: `${mau}55`,
                                borderLeft: `3px solid ${
                                  tt === 'co' ? '#4ade80' : tt === 'vang' ? '#f87171' : tt === 'phep' ? '#fbbf24' : mau
                                }`,
                                background: `linear-gradient(135deg, ${mau}26, ${mau}0d)`,
                                boxShadow: sapToi ? `0 0 0 2px ${mau}88` : undefined,
                              }}
                            >
                              <span className="block text-[11.5px] font-bold" style={{ color: mau }}>
                                {b.classCode || b.subject}
                              </span>
                              {b.room && <span className="block text-[10px] text-slate-400">{b.room}</span>}
                              <span className="block text-[9.5px] text-slate-500">{b.startTime}–{b.endTime}</span>
                              {sapToi && (
                                <span className="block mt-0.5 text-[10px] font-bold" style={{ color: mau }}>
                                  còn {con}′
                                </span>
                              )}
                              <span className="absolute top-1 right-1">
                                {tt === 'co' && <Check className="w-3 h-3 text-green-400" />}
                                {tt === 'vang' && <CircleSlash className="w-3 h-3 text-red-400" />}
                                {tt === 'phep' && <FileText className="w-3 h-3 text-amber-400" />}
                              </span>
                            </button>

                            {moChon === khoa && (
                              <div className="absolute left-0 top-full z-20 mt-1 flex w-max flex-col gap-0.5 rounded-xl border border-white/12 bg-[#0d0b1a] p-1 shadow-2xl">
                                {([['co', 'Có mặt'], ['vang', 'Vắng'], ['phep', 'Có phép']] as const).map(([k, ten]) => (
                                  <button
                                    key={k}
                                    type="button"
                                    onClick={() => void cham(b.id, ngay, k)}
                                    className="rounded-lg px-3 py-1.5 text-left text-[11px] text-slate-300 hover:bg-white/10"
                                  >
                                    {ten}
                                  </button>
                                ))}
                                {tt && (
                                  <button
                                    type="button"
                                    onClick={() => void cham(b.id, ngay, null)}
                                    className="rounded-lg px-3 py-1.5 text-left text-[11px] text-slate-500 hover:bg-white/10"
                                  >
                                    Bỏ chấm
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => { datMoChon(null); datMoSoan(true); }}
                                  className="rounded-lg px-3 py-1.5 text-left text-[11px] text-slate-500 hover:bg-white/10"
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
    </div>
  );
}
