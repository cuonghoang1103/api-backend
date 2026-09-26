/**
 * ============================================================
 * CUONG FABLE 5 — hạn mức + xin thêm (26/09/2026)
 * ============================================================
 *
 * Người dùng: *"Fable tốn token gấp 3,5 lần nên giới hạn và cảnh báo user.
 * Admin dùng không giới hạn, Pro thì có giới hạn — dùng hết có nút gửi yêu cầu
 * cho admin, admin duyệt thì được dùng thêm một chút."*
 *
 * Máy chủ giữ con số (`services/agent/fable.ts`), app chỉ HIỆN và XIN:
 *   · `useHanMucFable` — đọc `GET /api/v1/agent/fable` cho menu chọn model;
 *   · `XinThemFable`   — hiện dưới lỗi `FABLE_QUOTA_EXCEEDED`, gửi
 *                        `POST /api/v1/agent/fable/xin` rồi báo "đang chờ".
 * Không chép con số trần vào app: máy chủ đổi env là app tự đúng theo.
 */
import { useCallback, useEffect, useState } from 'react';
import { Sparkles, Send, Clock } from 'lucide-react';
import { useSession } from '../../auth/session';

export interface HanMucFable {
  khongGioiHan: boolean;
  daDung: number;
  tran: number;
  conLai: number;
  phanTram: number;
  hetHan: boolean;
  soNgay: number;
  dangChoDuyet: boolean;
  tuChoiGanNhat: { adminNote: string | null; luc: string } | null;
}

/** Mã id của Fable trong bảng model máy chủ (`src/services/agent/models.ts`). */
export const ID_FABLE = 'fable-5';

export const nghin = (n: number): string => `${Math.round(n / 1000).toLocaleString('vi-VN')}k`;

/** Câu ngắn cho menu model: "còn 120k/400k token · 30 ngày" hoặc "không giới hạn (admin)". */
export function moTaHanMuc(h: HanMucFable | null): string | null {
  if (!h) return null;
  if (h.khongGioiHan) return 'Admin — không giới hạn';
  if (h.hetHan) return h.dangChoDuyet ? 'Đã hết — đang chờ admin duyệt thêm' : `Đã hết ${nghin(h.tran)} token (${h.soNgay} ngày)`;
  return `Còn ${nghin(h.conLai)}/${nghin(h.tran)} token trong ${h.soNgay} ngày`;
}

export function useHanMucFable(bat: boolean): { h: HanMucFable | null; napLai: () => void } {
  const { api } = useSession();
  const [h, datH] = useState<HanMucFable | null>(null);
  const napLai = useCallback(() => {
    if (!api) return;
    /* Máy chủ cũ chưa có route này ⇒ 404 ⇒ im lặng, menu chỉ không hiện dòng hạn mức. */
    api.request<HanMucFable>('/api/v1/agent/fable').then(datH).catch(() => datH(null));
  }, [api]);
  useEffect(() => { if (bat) napLai(); }, [bat, napLai]);
  return { h, napLai };
}

/** Hiện dưới thông báo hết hạn mức: một ô lý do + nút gửi cho admin. */
export function XinThemFable() {
  const { api } = useSession();
  const { h, napLai } = useHanMucFable(true);
  const [lyDo, datLyDo] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [daGui, datDaGui] = useState(false);

  const gui = async (): Promise<void> => {
    if (!api || dangGui) return;
    if (lyDo.trim().length < 10) { datLoi('Viết ngắn gọn bạn cần thêm để làm gì (ít nhất 10 ký tự).'); return; }
    datDangGui(true);
    datLoi(null);
    try {
      await api.request('/api/v1/agent/fable/xin', { method: 'POST', body: { lyDo: lyDo.trim() } });
      datDaGui(true);
      napLai();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : 'Không gửi được.');
    } finally {
      datDangGui(false);
    }
  };

  if (daGui || h?.dangChoDuyet) {
    return (
      <div className="ct-fable-xin" data-trang-thai="cho">
        <Clock size={13} aria-hidden />
        <span>Đã gửi yêu cầu — admin duyệt xong là bạn dùng tiếp được Cuong Fable. Trong lúc chờ, hãy chọn CuongMini Max 5.</span>
      </div>
    );
  }

  return (
    <div className="ct-fable-xin">
      <p className="ct-fable-xin-dau">
        <Sparkles size={13} aria-hidden />
        <strong>Xin thêm hạn mức Cuong Fable</strong>
        {h && !h.khongGioiHan && <em>đã dùng {nghin(h.daDung)}/{nghin(h.tran)} token</em>}
      </p>
      {h?.tuChoiGanNhat && (
        <p className="ct-fable-xin-tuchoi">
          Lần xin trước bị từ chối{h.tuChoiGanNhat.adminNote ? `: “${h.tuChoiGanNhat.adminNote}”` : '.'}
        </p>
      )}
      <textarea
        rows={2}
        value={lyDo}
        maxLength={1000}
        placeholder="Bạn cần thêm để làm việc gì? (vd: refactor module thanh toán, cần model mạnh nhất)"
        onChange={(e) => datLyDo(e.target.value)}
      />
      {loi && <p className="ct-fable-xin-loi">{loi}</p>}
      <button type="button" className="ct-btn" onClick={() => void gui()} disabled={dangGui}>
        <Send size={12} aria-hidden /> {dangGui ? 'Đang gửi…' : 'Gửi yêu cầu cho admin'}
      </button>
    </div>
  );
}
