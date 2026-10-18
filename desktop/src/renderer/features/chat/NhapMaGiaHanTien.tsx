/**
 * ============================================================
 * MÃ GIA HẠN THEO $ (19/10/2026) — thẻ dưới khối lỗi chạm trần tiền
 * ============================================================
 *
 * Máy chủ gắn `giaHanTien` vào lỗi khi người dùng chạm một trần TIỀN gia hạn được (trần model × người, ví AI Code, nhóm
 * free cổng chính hãng, hạn mức nhóm từng người) VÀ admin đã đặt mã. Thẻ:
 *   "Đã chạm giới hạn … · Nhập mã gia hạn để dùng tiếp" + ô nhập ẨN ký tự.
 *   • Lần 1 trong kỳ ⇒ máy chủ cộng ngay một mức ⇒ tự LÀM TIẾP đúng lượt vừa bị chặn (`agent:lamTiep`).
 *   • Lần 2+ ⇒ yêu cầu chờ duyệt ⇒ "Đã gửi yêu cầu, chờ admin duyệt" + TỰ KIỂM LẠI mỗi 30 s (và nút "Kiểm lại ngay");
 *     duyệt ⇒ nút "Làm tiếp"; từ chối ⇒ báo rõ (kèm lý do nếu có).
 * Gọi máy chủ qua main (`agent:giaHanTien` / `agent:giaHanTienKiem`) — main gửi kèm vé khoá. Mã KHÔNG lưu ở đâu cả.
 */
import { useEffect, useRef, useState } from 'react';
import { Check, Clock, KeyRound, X } from 'lucide-react';
import type { AgentGiaHanTien, AgentKetQuaGiaHan } from '../../../shared/ipc';
import { ngonNguHienTai } from '../../i18n';

const L = (vi: string, en: string): string => (ngonNguHienTai() === 'en' ? en : vi);
const usd = (n: number): string => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
/** Nhịp tự kiểm lại yêu cầu chờ duyệt — ≥ 30 s (nhẹ cho máy chủ). */
export const NHIP_KIEM_MS = 30_000;

type TrangThai =
  | { loai: 'nhap' }
  | { loai: 'cho'; id: number }
  | { loai: 'daCap'; soUsd: number; tuDong: boolean }
  | { loai: 'tuChoi'; lyDo: string | null }
  | { loai: 'hetKy' };

export function NhapMaGiaHanTien({ g, khoa = false, onLamTiep }: {
  g: AgentGiaHanTien;
  /** Agent đang chạy ở tab này ⇒ không gửi. */
  khoa?: boolean;
  onLamTiep: () => void;
}) {
  const [ma, datMa] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [tt, datTt] = useState<TrangThai>(g.dangCho ? { loai: 'cho', id: g.dangCho } : { loai: 'nhap' });
  const lamTiepRef = useRef(onLamTiep);
  lamTiepRef.current = onLamTiep;

  const apKetQua = (kq: AgentKetQuaGiaHan, tuNhap: boolean): void => {
    if (kq.ketQua === 'daCap') {
      datTt({ loai: 'daCap', soUsd: kq.soUsd, tuDong: tuNhap });
      if (tuNhap) lamTiepRef.current();
    } else if (kq.ketQua === 'choDuyet') datTt({ loai: 'cho', id: kq.id });
    else if (kq.ketQua === 'tuChoi') datTt({ loai: 'tuChoi', lyDo: kq.lyDo });
    else datTt({ loai: 'hetKy' });
  };

  const kiem = async (id: number): Promise<void> => {
    try {
      const kq = await window.cuongthai?.agent.giaHanTienKiem(id);
      if (kq && kq.ketQua !== 'choDuyet') apKetQua(kq, false);
    } catch { /* mạng chập chờn — nhịp sau kiểm lại */ }
  };

  /* Tự kiểm lại khi đang chờ duyệt. */
  const idCho = tt.loai === 'cho' ? tt.id : null;
  useEffect(() => {
    if (idCho === null) return undefined;
    const h = setInterval(() => { void kiem(idCho); }, NHIP_KIEM_MS);
    return () => clearInterval(h);
  }, [idCho]);

  const gui = async (): Promise<void> => {
    const m = ma.trim();
    if (!m || dangGui || khoa) return;
    datDangGui(true);
    datLoi(null);
    try {
      const kq = await window.cuongthai?.agent.giaHanTien(m, g.tran);
      datMa('');
      if (kq) apKetQua(kq, true);
    } catch (e) {
      datLoi(e instanceof Error ? e.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, '') : L('Không gia hạn được.', 'Could not extend.'));
    } finally {
      datDangGui(false);
    }
  };

  const ten = L(g.ten, g.tenEn);
  return (
    <div className="ct-duphong" data-gia-han-tien={g.tran}>
      <p className="ct-duphong-chu">
        <KeyRound size={12} aria-hidden />
        {L(`Đã chạm giới hạn ${ten} (${usd(g.daDungUsd)}/${usd(g.tranUsd)}) · Nhập mã gia hạn để dùng tiếp`,
          `Limit reached: ${ten} (${usd(g.daDungUsd)}/${usd(g.tranUsd)}) · Enter an extension code to continue`)}
      </p>
      {tt.loai === 'nhap' && (
        <>
          <p className="ct-duphong-chu">
            {g.canDuyet
              ? L(`Lần ${g.lanThu} trong kỳ — mã đúng sẽ gửi yêu cầu, admin duyệt rồi mới cộng +${usd(g.mucUsd)}.`,
                `Attempt ${g.lanThu} this period — a correct code sends a request; +${usd(g.mucUsd)} after an admin approves.`)
              : L(`Mã đúng ⇒ cộng ngay +${usd(g.mucUsd)} và làm tiếp chỗ dở.`, `Correct code ⇒ +${usd(g.mucUsd)} right away and the task continues.`)}
          </p>
          <form className="ct-duphong-hang" onSubmit={(e) => { e.preventDefault(); void gui(); }}>
            <input
              type="password"
              className="ct-duphong-o"
              placeholder={L('Mã gia hạn', 'Extension code')}
              autoComplete="off"
              value={ma}
              onChange={(e) => datMa(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <button type="submit" className="ct-btn" disabled={dangGui || khoa || !ma.trim()}>
              {dangGui ? L('Đang kiểm…', 'Checking…') : L('Gia hạn', 'Extend')}
            </button>
          </form>
        </>
      )}
      {tt.loai === 'cho' && (
        <div className="ct-duphong-hang">
          <Clock size={13} aria-hidden />
          <span className="ct-duphong-chu">
            {L(`Đã gửi yêu cầu #${tt.id}, chờ admin duyệt — tự kiểm lại mỗi 30 giây.`, `Request #${tt.id} sent, waiting for an admin — re-checking every 30 seconds.`)}
          </span>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void kiem(tt.id)}>{L('Kiểm lại ngay', 'Check now')}</button>
        </div>
      )}
      {tt.loai === 'daCap' && (
        <div className="ct-duphong-hang">
          <Check size={13} aria-hidden />
          <span className="ct-duphong-chu">
            {tt.tuDong
              ? L(`Đã cộng +${usd(tt.soUsd)} — CuongMini làm tiếp chỗ dở.`, `+${usd(tt.soUsd)} added — CuongMini continues.`)
              : L(`Admin đã duyệt: +${usd(tt.soUsd)}.`, `Approved by an admin: +${usd(tt.soUsd)}.`)}
          </span>
          {!tt.tuDong && <button type="button" className="ct-btn" disabled={khoa} onClick={() => onLamTiep()}>{L('Làm tiếp', 'Continue')}</button>}
        </div>
      )}
      {tt.loai === 'tuChoi' && (
        <p className="ct-duphong-loi">
          <X size={12} aria-hidden />
          {L(`Admin đã từ chối yêu cầu gia hạn${tt.lyDo ? `: ${tt.lyDo}` : '.'}`, `An admin rejected the extension request${tt.lyDo ? `: ${tt.lyDo}` : '.'}`)}
          {' '}<button type="button" className="ct-btn ct-btn-ghost" onClick={() => datTt({ loai: 'nhap' })}>{L('Gửi lại', 'Ask again')}</button>
        </p>
      )}
      {tt.loai === 'hetKy' && (
        <p className="ct-duphong-chu">{L('Kỳ đã qua — giới hạn đã tự làm mới, cứ gửi lại câu hỏi.', 'The period ended — the limit already reset; just resend.')}</p>
      )}
      {loi && <p className="ct-duphong-loi">{loi}</p>}
    </div>
  );
}
