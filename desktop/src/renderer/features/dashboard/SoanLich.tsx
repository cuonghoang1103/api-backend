/**
 * Soạn thời khoá biểu — nhập tay từng buổi, hoặc dán cả bảng từ FAP.
 *
 * ─── Vì sao KHÔNG lưu bằng `POST /bulk { thayThe: true }` ───
 * Nó xoá sạch lịch cũ rồi tạo lại. Mà `ClassAttendance.schedule` khai
 * `onDelete: Cascade`, nên xoá một buổi là xoá luôn MỌI lần điểm danh của
 * buổi đó — chính con số quyết định đỗ hay trượt môn. Sửa giờ một buổi mà
 * mất sạch lịch sử nghỉ là hỏng im lặng: màn hình báo lưu xong, số buổi
 * nghỉ về 0, không ai biết vì sao.
 *
 * Nên lưu chia làm ba đường, và XOÁ đi CUỐI CÙNG:
 *   • dòng mới (chưa có id) → `POST /bulk` với `thayThe: false`
 *   • dòng đã đổi           → `PATCH /:id` (giữ nguyên id ⇒ giữ điểm danh)
 *   • dòng người dùng bỏ    → `DELETE /:id`, sau khi đã hỏi lại
 * Hỏng ở giữa thì phần đã thêm/sửa còn đó và chưa xoá gì.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ClipboardPaste, Plus, Trash2, X } from 'lucide-react';
import { useSession } from '../../auth/session';
import { docLichFAP } from './docLichFAP';
import type { Buoi } from './LichHoc';
import { useDich } from '../../i18n';

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

function chup(d: Dong): string {
  return JSON.stringify([d.subject, d.classCode, d.room, d.weekday, d.startTime, d.endTime, d.remindMinutes]);
}

function dongTrong(): Dong {
  const d: Dong = {
    khoa: khoaMoi(), id: null, subject: '', classCode: '', room: '',
    weekday: 2, startTime: '07:30', endTime: '09:50', remindMinutes: 15, soBuoiVang: 0, goc: '',
  };
  return d;
}

/** Câu lỗi của một dòng, `null` nếu dòng hợp lệ. */
export function loiDong(d: Pick<Dong, 'subject' | 'weekday' | 'startTime' | 'endTime'>): string | null {
  if (!d.subject.trim()) return 'Thiếu tên môn';
  if (!(d.weekday >= 2 && d.weekday <= 8)) return 'Chưa chọn thứ';
  const re = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!re.test(d.startTime) || !re.test(d.endTime)) return 'Giờ phải dạng HH:mm';
  if (d.endTime <= d.startTime) return 'Giờ kết thúc phải sau giờ bắt đầu';
  return null;
}

export function SoanLich({ onDong, onXong }: { onDong: () => void; onXong: () => void }) {
  const { dich } = useDich();
  const { api } = useSession();
  const [dong, datDong] = useState<Dong[]>([]);
  const [banDau, datBanDau] = useState<number[]>([]);
  const [dan, datDan] = useState('');
  const [moDan, datMoDan] = useState(false);
  const [boQua, datBoQua] = useState<string[]>([]);
  const [luu, datLuu] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangTai, datDangTai] = useState(true);
  const oDan = useRef<HTMLTextAreaElement | null>(null);

  /* Esc để đóng. Hộp này phủ kín màn hình, nên không có phím thoát thì người
     dùng phải đi tìm cái dấu X — và trên cửa sổ hẹp nó nằm ngoài tầm mắt. */
  useEffect(() => {
    const nghe = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  }, [onDong]);

  useEffect(() => {
    let huy = false;
    void (async () => {
      try {
        // Không kèm `?ngay=`: cần CẢ lịch kỳ trước để người dùng sửa/xoá.
        const ds = await api?.request<{ items: Buoi[] }>('/api/v1/class-schedule');
        if (huy) return;
        const ra = (ds?.items ?? []).map((b): Dong => {
          const d: Dong = {
            khoa: `c${b.id}`, id: b.id, subject: b.subject, classCode: b.classCode ?? '',
            room: b.room ?? '', weekday: b.weekday, startTime: b.startTime, endTime: b.endTime,
            remindMinutes: (b as { remindMinutes?: number }).remindMinutes ?? 15,
            soBuoiVang: b.soBuoiVang ?? 0, goc: '',
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
  }, [api]);

  const sua = (khoa: string, vas: Partial<Dong>) =>
    datDong((ds) => ds.map((d) => (d.khoa === khoa ? { ...d, ...vas } : d)));

  const boDong = (d: Dong) => {
    if (d.id && d.soBuoiVang > 0) {
      const ok = window.confirm(
        `Xoá "${d.subject}" cũng xoá ${d.soBuoiVang} lần đã chấm điểm danh của buổi này. Vẫn xoá?`,
      );
      if (!ok) return;
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
    datDong((ds) => {
      // Bỏ dòng trống mặc định để bảng không mở đầu bằng một dòng rỗng.
      const giu = ds.filter((d) => d.subject.trim() || d.id);
      const them = kq.dong.map((b): Dong => ({
        khoa: khoaMoi(), id: null, subject: b.subject, classCode: b.classCode, room: b.room,
        weekday: b.weekday, startTime: b.startTime, endTime: b.endTime,
        remindMinutes: 15, soBuoiVang: 0, goc: '',
      }));
      return [...giu, ...them];
    });
    datDan('');
    datMoDan(false);
  };

  const hong = useMemo(() => dong.filter((d) => loiDong(d) !== null), [dong]);

  const ghi = async () => {
    if (!api || hong.length > 0) return;
    datLuu(true);
    datLoi(null);
    try {
      const con = new Set(dong.map((d) => d.id).filter(Boolean) as number[]);
      const canXoa = banDau.filter((id) => !con.has(id));

      // 1) Thêm dòng mới. `thayThe` để nguyên false — xem chú thích đầu tệp.
      const moi = dong.filter((d) => d.id === null);
      if (moi.length > 0) {
        await api.request('/api/v1/class-schedule/bulk', {
          method: 'POST',
          body: {
            thayThe: false,
            items: moi.map((d) => ({
              subject: d.subject.trim(), classCode: d.classCode.trim() || null,
              room: d.room.trim() || null, weekday: d.weekday,
              startTime: d.startTime, endTime: d.endTime, remindMinutes: d.remindMinutes,
            })),
          },
        });
      }

      // 2) Sửa dòng ĐÃ ĐỔI — dòng không đổi thì không gửi, để khỏi đụng vào
      //    `updatedAt` của những buổi người dùng chỉ mở ra xem.
      for (const d of dong) {
        if (d.id === null || chup(d) === d.goc) continue;
        await api.request(`/api/v1/class-schedule/${d.id}`, {
          method: 'PATCH',
          body: {
            subject: d.subject.trim(), classCode: d.classCode.trim() || null,
            room: d.room.trim() || null, weekday: d.weekday,
            startTime: d.startTime, endTime: d.endTime, remindMinutes: d.remindMinutes,
          },
        });
      }

      // 3) Xoá SAU CÙNG: hỏng ở bước trên thì chưa mất gì.
      for (const id of canXoa) {
        await api.request(`/api/v1/class-schedule/${id}`, { method: 'DELETE' });
      }

      onXong();
      onDong();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : 'Lưu không được. Thử lại giúp tôi.');
    } finally {
      datLuu(false);
    }
  };

  return (
    <div
      className="ct-soan-nen"
      role="dialog"
      aria-modal="true"
      aria-label={dich('Soạn thời khoá biểu')}
      /* Chỉ đóng khi bấm ĐÚNG tấm nền. Không so `currentTarget` thì thả chuột
         sau một cú kéo chọn chữ trong bảng cũng đóng hộp, mất hết dòng đang sửa. */
      onMouseDown={(e) => { if (e.target === e.currentTarget) onDong(); }}
    >
      <div className="ct-soan">
        <header className="ct-soan-dau">
          <h2>{dich('Thời khoá biểu')}</h2>
          <button type="button" className="ct-soan-x" onClick={onDong} aria-label={dich('Đóng')}>
            <X size={16} aria-hidden />
          </button>
        </header>

        <div className="ct-soan-thanh">
          <button type="button" className="ct-btn" onClick={() => datDong((ds) => [...ds, dongTrong()])}>
            <Plus size={13} aria-hidden /> Thêm dòng
          </button>
          <button
            type="button"
            className="ct-btn"
            onClick={() => { datMoDan((v) => !v); setTimeout(() => oDan.current?.focus(), 0); }}
          >
            <ClipboardPaste size={13} aria-hidden /> Dán từ FAP
          </button>
          <span className="ct-muted">{dong.length} buổi</span>
        </div>

        {moDan && (
          <div className="ct-soan-dan">
            <p className="ct-muted">
              {dich('Mở FAP → bôi đen cả bảng thời khoá biểu → sao chép → dán vào đây.')}
              {dich('Đọc xong bạn xem lại từng dòng bên dưới rồi mới lưu.')}
            </p>
            <textarea
              ref={oDan}
              value={dan}
              onChange={(e) => datDan(e.target.value)}
              rows={5}
              placeholder={'Slot 1\tSWT301-View Materials at DE-412 (7:30-9:50)\t…'}
            />
            <button type="button" className="ct-btn ct-btn-chinh" onClick={docDan} disabled={!dan.trim()}>
              Đọc {dan.trim() ? '' : ''}
            </button>
          </div>
        )}

        {boQua.length > 0 && (
          <div className="ct-soan-boqua">
            <AlertTriangle size={13} aria-hidden />
            <div>
              <strong>{boQua.length} dòng không đọc được giờ</strong> — tự thêm bằng tay giúp tôi:
              <ul>{boQua.slice(0, 6).map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          </div>
        )}

        <div className="ct-soan-bang-boc">
          {dangTai ? <p className="ct-muted">{dich('Đang nạp…')}</p> : (
            <table className="ct-soan-bang">
              <thead>
                <tr>
                  <th>{dich('Thứ')}</th><th>{dich('Bắt đầu')}</th><th>{dich('Kết thúc')}</th><th>{dich('Môn')}</th>
                  <th>{dich('Mã lớp')}</th><th>{dich('Phòng')}</th><th>{dich('Nhắc')}</th><th />
                </tr>
              </thead>
              <tbody>
                {dong.map((d) => {
                  const l = loiDong(d);
                  return (
                    <tr key={d.khoa} data-loi={l !== null}>
                      <td>
                        <select value={d.weekday} onChange={(e) => sua(d.khoa, { weekday: Number(e.target.value) })}>
                          {d.weekday === 0 && <option value={0}>{dich('— chọn —')}</option>}
                          {THU.map((t) => <option key={t.n} value={t.n}>{dich(t.ten)}</option>)}
                        </select>
                      </td>
                      <td><input type="time" value={d.startTime} onChange={(e) => sua(d.khoa, { startTime: e.target.value })} /></td>
                      <td><input type="time" value={d.endTime} onChange={(e) => sua(d.khoa, { endTime: e.target.value })} /></td>
                      <td><input value={d.subject} placeholder="SWT301" onChange={(e) => sua(d.khoa, { subject: e.target.value })} /></td>
                      <td><input value={d.classCode} placeholder="SE1815" onChange={(e) => sua(d.khoa, { classCode: e.target.value })} /></td>
                      <td><input value={d.room} placeholder="DE-412" onChange={(e) => sua(d.khoa, { room: e.target.value })} /></td>
                      <td>
                        <select value={d.remindMinutes} onChange={(e) => sua(d.khoa, { remindMinutes: Number(e.target.value) })}>
                          {NHAC.map((n) => <option key={n.n} value={n.n}>{dich(n.ten)}</option>)}
                        </select>
                      </td>
                      <td>
                        <button type="button" className="ct-soan-xoa" onClick={() => boDong(d)} aria-label={`Xoá ${d.subject || 'dòng'}`}>
                          <Trash2 size={13} aria-hidden />
                        </button>
                        {l && <em className="ct-soan-loi">{l}</em>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {loi && <p className="ct-soan-bao">{loi}</p>}

        <footer className="ct-soan-chan">
          {hong.length > 0 && <span className="ct-soan-bao">{hong.length} dòng còn thiếu, sửa xong mới lưu được</span>}
          <button type="button" className="ct-btn" onClick={onDong}>{dich('Huỷ')}</button>
          <button type="button" className="ct-btn ct-btn-chinh" onClick={() => void ghi()} disabled={luu || hong.length > 0 || dangTai}>
            {luu ? 'Đang lưu…' : 'Lưu lịch'}
          </button>
        </footer>
      </div>
    </div>
  );
}
