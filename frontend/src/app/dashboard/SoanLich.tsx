'use client';

/**
 * Soạn thời khoá biểu — bản WEB. Cùng hợp đồng với bản desktop.
 *
 * ⚠️ KHÔNG lưu bằng `bulk { thayThe: true }`. Nó xoá lịch cũ rồi tạo lại, mà
 * `ClassAttendance.schedule` khai `onDelete: Cascade` — sửa giờ một buổi là
 * mất sạch lịch sử điểm danh, đúng con số quyết định đỗ/trượt môn, và màn hình
 * vẫn báo lưu xong. Ba đường, XOÁ đi CUỐI CÙNG:
 *   • dòng mới → `bulk` (`thayThe: false`)
 *   • dòng đã đổi → `PATCH /:id` (giữ id ⇒ giữ điểm danh)
 *   • dòng bỏ → `DELETE /:id`, sau khi hỏi lại kèm số lần đã chấm sẽ mất theo
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ClipboardPaste, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { lichHocApi } from '@/lib/api';
import { docLichFAP } from '@/lib/lich/fap';
import type { Buoi } from '@/lib/lich/chung';

const THU = [
  { n: 2, ten: 'Thứ 2' }, { n: 3, ten: 'Thứ 3' }, { n: 4, ten: 'Thứ 4' }, { n: 5, ten: 'Thứ 5' },
  { n: 6, ten: 'Thứ 6' }, { n: 7, ten: 'Thứ 7' }, { n: 8, ten: 'Chủ nhật' },
];
const NHAC = [
  { n: 0, ten: 'Không nhắc' }, { n: 5, ten: 'Trước 5 phút' }, { n: 10, ten: 'Trước 10 phút' },
  { n: 15, ten: 'Trước 15 phút' }, { n: 30, ten: 'Trước 30 phút' }, { n: 60, ten: 'Trước 1 giờ' },
];

interface Dong {
  khoa: string;
  id: number | null;
  subject: string;
  classCode: string;
  room: string;
  weekday: number;
  startTime: string;
  endTime: string;
  remindMinutes: number;
  soBuoiVang: number;
  /** Bản chụp lúc nạp — để chỉ PATCH đúng dòng người dùng có động vào. */
  goc: string;
}

let dem = 0;
const khoaMoi = () => `m${++dem}`;

const chup = (d: Dong) =>
  JSON.stringify([d.subject, d.classCode, d.room, d.weekday, d.startTime, d.endTime, d.remindMinutes]);

const dongTrong = (): Dong => ({
  khoa: khoaMoi(), id: null, subject: '', classCode: '', room: '',
  weekday: 2, startTime: '07:30', endTime: '09:50', remindMinutes: 15, soBuoiVang: 0, goc: '',
});

/** Câu lỗi của một dòng, `null` nếu hợp lệ. Giống hệt bản desktop. */
export function loiDong(d: Pick<Dong, 'subject' | 'weekday' | 'startTime' | 'endTime'>): string | null {
  if (!d.subject.trim()) return 'Thiếu tên môn';
  if (!(d.weekday >= 2 && d.weekday <= 8)) return 'Chưa chọn thứ';
  const re = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!re.test(d.startTime) || !re.test(d.endTime)) return 'Giờ phải dạng HH:mm';
  if (d.endTime <= d.startTime) return 'Giờ kết thúc phải sau giờ bắt đầu';
  return null;
}

export default function SoanLich({ onDong, onXong }: { onDong: () => void; onXong: () => void }) {
  const [dong, datDong] = useState<Dong[]>([]);
  const [banDau, datBanDau] = useState<number[]>([]);
  const [dan, datDan] = useState('');
  const [moDan, datMoDan] = useState(false);
  const [boQua, datBoQua] = useState<string[]>([]);
  const [luu, datLuu] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangTai, datDangTai] = useState(true);
  const oDan = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const nghe = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  }, [onDong]);

  useEffect(() => {
    let huy = false;
    void (async () => {
      try {
        // Không kèm `ngay`: cần CẢ lịch kỳ trước để người dùng sửa/xoá.
        const ds = await lichHocApi.list();
        if (huy) return;
        const ra = (ds.data?.data?.items ?? []).map((b: Buoi): Dong => {
          const d: Dong = {
            khoa: `c${b.id}`, id: b.id, subject: b.subject, classCode: b.classCode ?? '',
            room: b.room ?? '', weekday: b.weekday, startTime: b.startTime, endTime: b.endTime,
            remindMinutes: b.remindMinutes ?? 15, soBuoiVang: b.soBuoiVang ?? 0, goc: '',
          };
          d.goc = chup(d);
          return d;
        });
        datDong(ra.length > 0 ? ra : [dongTrong()]);
        datBanDau(ra.map((d) => d.id!).filter(Boolean));
      } catch {
        datDong([dongTrong()]);
      } finally {
        if (!huy) datDangTai(false);
      }
    })();
    return () => { huy = true; };
  }, []);

  const sua = (khoa: string, vas: Partial<Dong>) =>
    datDong((ds) => ds.map((d) => (d.khoa === khoa ? { ...d, ...vas } : d)));

  const boDong = (d: Dong) => {
    if (d.id && d.soBuoiVang > 0
      && !window.confirm(`Xoá "${d.subject}" cũng xoá ${d.soBuoiVang} lần đã chấm điểm danh của buổi này. Vẫn xoá?`)) {
      return;
    }
    datDong((ds) => {
      const con = ds.filter((x) => x.khoa !== d.khoa);
      return con.length > 0 ? con : [dongTrong()];
    });
  };

  const docDan = () => {
    const kq = docLichFAP(dan);
    datBoQua(kq.boQua);
    if (kq.dong.length === 0) {
      datLoi('Không đọc ra buổi học nào. Cần ít nhất một khoảng giờ dạng 7:30-9:50.');
      return;
    }
    datLoi(null);
    datDong((ds) => [
      ...ds.filter((d) => d.subject.trim() || d.id),
      ...kq.dong.map((b): Dong => ({
        khoa: khoaMoi(), id: null, subject: b.subject, classCode: b.classCode, room: b.room,
        weekday: b.weekday, startTime: b.startTime, endTime: b.endTime,
        remindMinutes: 15, soBuoiVang: 0, goc: '',
      })),
    ]);
    datDan('');
    datMoDan(false);
  };

  const hong = useMemo(() => dong.filter((d) => loiDong(d) !== null), [dong]);

  const ghi = async () => {
    if (hong.length > 0) return;
    datLuu(true);
    datLoi(null);
    try {
      const con = new Set(dong.map((d) => d.id).filter(Boolean) as number[]);
      const canXoa = banDau.filter((id) => !con.has(id));

      const moi = dong.filter((d) => d.id === null);
      if (moi.length > 0) {
        await lichHocApi.themNhieu(moi.map((d) => ({
          subject: d.subject.trim(), classCode: d.classCode.trim() || null,
          room: d.room.trim() || null, weekday: d.weekday,
          startTime: d.startTime, endTime: d.endTime, remindMinutes: d.remindMinutes,
        })));
      }

      for (const d of dong) {
        if (d.id === null || chup(d) === d.goc) continue;
        await lichHocApi.sua(d.id, {
          subject: d.subject.trim(), classCode: d.classCode.trim() || null,
          room: d.room.trim() || null, weekday: d.weekday,
          startTime: d.startTime, endTime: d.endTime, remindMinutes: d.remindMinutes,
        });
      }

      // Xoá SAU CÙNG: hỏng ở bước trên thì chưa mất gì.
      for (const id of canXoa) await lichHocApi.xoa(id);

      toast.success('Đã lưu thời khoá biểu');
      onXong();
      onDong();
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Lưu không được. Thử lại giúp tôi.';
      datLoi(m);
    } finally {
      datLuu(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Soạn thời khoá biểu"
      /* Chỉ đóng khi bấm ĐÚNG tấm nền — không so `currentTarget` thì thả chuột
         sau một cú kéo chọn chữ trong bảng cũng đóng, mất hết dòng đang sửa. */
      onMouseDown={(e) => { if (e.target === e.currentTarget) onDong(); }}
    >
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a18] shadow-2xl">
        <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-200">Thời khoá biểu</h2>
          <button
            type="button"
            onClick={onDong}
            aria-label="Đóng"
            className="ml-auto rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
          <button
            type="button"
            onClick={() => datDong((ds) => [...ds, dongTrong()])}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
          >
            <Plus className="w-3 h-3" /> Thêm dòng
          </button>
          <button
            type="button"
            onClick={() => { datMoDan((v) => !v); setTimeout(() => oDan.current?.focus(), 0); }}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
          >
            <ClipboardPaste className="w-3 h-3" /> Dán từ FAP
          </button>
          <span className="ml-auto text-[11px] text-slate-500">{dong.length} buổi</span>
        </div>

        {moDan && (
          <div className="border-b border-white/8 bg-white/[0.02] px-4 py-3">
            <p className="mb-2 text-[11px] leading-relaxed text-slate-500">
              Mở FAP → bôi đen cả bảng thời khoá biểu → sao chép → dán vào đây.
              Đọc xong bạn xem lại từng dòng bên dưới rồi mới lưu.
            </p>
            <textarea
              ref={oDan}
              value={dan}
              onChange={(e) => datDan(e.target.value)}
              rows={5}
              placeholder={'Slot 1\tSWT301-View Materials at DE-412 (7:30-9:50)\t…'}
              className="w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-[12px] text-slate-200 outline-none focus:border-violet-400/60"
            />
            <button
              type="button"
              onClick={docDan}
              disabled={!dan.trim()}
              className="mt-2 rounded-lg bg-violet-500/90 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-violet-500 disabled:opacity-40"
            >
              Đọc
            </button>
          </div>
        )}

        {boQua.length > 0 && (
          <div className="flex gap-2 border-b border-white/8 bg-amber-500/10 px-4 py-2.5 text-[11px] text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <b>{boQua.length} dòng không đọc được giờ</b> — tự thêm bằng tay giúp tôi:
              <ul className="mt-1 list-disc pl-4 font-mono opacity-80">
                {boQua.slice(0, 6).map((s, i) => <li key={i} className="truncate">{s}</li>)}
              </ul>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto px-4 py-2">
          {dangTai ? (
            <p className="py-6 text-center text-xs text-slate-500">Đang nạp…</p>
          ) : (
            <table className="w-full min-w-[760px] border-collapse text-[12px]">
              <thead>
                <tr className="sticky top-0 z-10 bg-[#0c0a18]">
                  {['Thứ', 'Bắt đầu', 'Kết thúc', 'Môn', 'Mã lớp', 'Phòng', 'Nhắc', ''].map((h) => (
                    <th key={h} className="border-b border-white/8 px-1.5 py-2 text-left text-[11px] font-semibold text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dong.map((d) => {
                  const l = loiDong(d);
                  const o = `w-full rounded-lg border bg-white/[0.04] px-2 py-1.5 text-slate-200 outline-none focus:border-violet-400/60 ${
                    l ? 'border-red-400/50' : 'border-transparent hover:border-white/10'
                  }`;
                  return (
                    <tr key={d.khoa} className="border-b border-white/5">
                      <td className="px-1 py-1">
                        <select value={d.weekday} onChange={(e) => sua(d.khoa, { weekday: Number(e.target.value) })} className={o}>
                          {d.weekday === 0 && <option value={0}>— chọn —</option>}
                          {THU.map((t) => <option key={t.n} value={t.n} className="bg-[#0c0a18]">{t.ten}</option>)}
                        </select>
                      </td>
                      <td className="px-1 py-1">
                        <input type="time" value={d.startTime} onChange={(e) => sua(d.khoa, { startTime: e.target.value })} className={o} />
                      </td>
                      <td className="px-1 py-1">
                        <input type="time" value={d.endTime} onChange={(e) => sua(d.khoa, { endTime: e.target.value })} className={o} />
                      </td>
                      <td className="px-1 py-1 min-w-[130px]">
                        <input value={d.subject} placeholder="SWT301" onChange={(e) => sua(d.khoa, { subject: e.target.value })} className={o} />
                      </td>
                      <td className="px-1 py-1">
                        <input value={d.classCode} placeholder="SE1815" onChange={(e) => sua(d.khoa, { classCode: e.target.value })} className={o} />
                      </td>
                      <td className="px-1 py-1">
                        <input value={d.room} placeholder="DE-412" onChange={(e) => sua(d.khoa, { room: e.target.value })} className={o} />
                      </td>
                      <td className="px-1 py-1">
                        <select value={d.remindMinutes} onChange={(e) => sua(d.khoa, { remindMinutes: Number(e.target.value) })} className={o}>
                          {NHAC.map((n) => <option key={n.n} value={n.n} className="bg-[#0c0a18]">{n.ten}</option>)}
                        </select>
                      </td>
                      <td className="px-1 py-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => boDong(d)}
                          aria-label={`Xoá ${d.subject || 'dòng'}`}
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/15 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {l && <em className="block text-[10px] not-italic text-red-400">{l}</em>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <footer className="flex items-center gap-2 border-t border-white/8 px-4 py-3">
          {(loi || hong.length > 0) && (
            <span className="mr-auto text-[11px] text-red-400">
              {loi ?? `${hong.length} dòng còn thiếu, sửa xong mới lưu được`}
            </span>
          )}
          <button
            type="button"
            onClick={onDong}
            className={`rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-slate-300 hover:bg-white/10 ${
              loi || hong.length > 0 ? '' : 'ml-auto'
            }`}
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => void ghi()}
            disabled={luu || hong.length > 0 || dangTai}
            className="rounded-lg bg-violet-500/90 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-violet-500 disabled:opacity-40"
          >
            {luu ? 'Đang lưu…' : 'Lưu lịch'}
          </button>
        </footer>
      </div>
    </div>
  );
}
