/**
 * ============================================================
 * KEY GIA HẠN HẠN MỨC AI CODE (02/10/2026)
 * ============================================================
 *
 * Chủ web: hết hạn mức token 5 giờ (`AGENT_QUOTA_EXCEEDED`) thì cho nhập key
 * (admin đặt ở /admin/commerce?tab=fable) để làm tiếp — *"dùng tiếp thì AI sẽ
 * tiếp tục làm ở chỗ còn dở khi bị limit đó không gián đoạn"*.
 *
 * Hiện NGAY dưới khối lỗi, chỉ khi máy chủ báo `coKeyGiaHan` (admin chưa bật
 * thì không có ô nào). Nhập đúng ⇒ `POST /api/v1/agent/gia-han` ⇒ máy chủ
 * cộng token vào trần ⇒ gọi `onXong` để tự GỬI LẠI đúng lượt vừa bị chặn
 * (`agent:lamTiep` — nguyên hội thoại, kế hoạch đang chạy giữ nguyên).
 *
 * Key được NHỚ TRONG BỘ NHỚ của phiên app (biến module, không ghi đĩa) để lần
 * hết sau chỉ cần bấm "Dùng lại key". Máy chủ trả key sai (admin đã đổi/tắt)
 * ⇒ xoá nhớ và hỏi lại.
 */
import { useState } from 'react';
import { KeyRound, Check } from 'lucide-react';
import { useSession } from '../../auth/session';
import { ApiError } from '../../api/client';
import type { AgentQuota } from '../../../shared/ipc';

/** CHỈ trong bộ nhớ — đóng app là mất, không bao giờ ghi ra đĩa. */
let keyDaNho: string | null = null;

interface KetQuaGiaHan extends AgentQuota {
  soToken: number;
}

const trieu = (n: number): string => (n / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 });

export function NhapKeyGiaHan({ khoa = false, onXong }: {
  /** Agent đang chạy (vd. đã làm tiếp ở tab này) ⇒ không cho gửi. */
  khoa?: boolean;
  onXong: (quota: AgentQuota) => void;
}) {
  const { api } = useSession();
  const [key, datKey] = useState('');
  const [nhapMoi, datNhapMoi] = useState(keyDaNho === null);
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [xong, datXong] = useState<number | null>(null);

  const gui = async (k: string): Promise<void> => {
    if (!api || dangGui || khoa || !k) return;
    datDangGui(true);
    datLoi(null);
    try {
      const kq = await api.request<KetQuaGiaHan>('/api/v1/agent/gia-han', { method: 'POST', body: { key: k } });
      keyDaNho = k;
      datKey('');
      datXong(kq.soToken);
      onXong({ daDung: kq.daDung, tran: kq.tran, phanTram: kq.phanTram, hoiLucNao: kq.hoiLucNao });
    } catch (e) {
      /* 403 = key sai hoặc admin đã đổi; 409 = admin đã tắt ⇒ key đang nhớ vô dụng. */
      if (e instanceof ApiError && (e.failure.kind === 'forbidden' || e.failure.kind === 'conflict')) {
        keyDaNho = null;
        datNhapMoi(true);
      }
      datLoi(e instanceof Error ? e.message : 'Không gia hạn được.');
    } finally {
      datDangGui(false);
    }
  };

  if (xong !== null) {
    return (
      <p className="ct-duphong-chu">
        <Check size={12} aria-hidden /> Đã cộng {trieu(xong)} triệu token — agent đang làm tiếp chỗ dở.
        Hết lần nữa thì nhập lại đúng key này.
      </p>
    );
  }

  return (
    <div className="ct-duphong">
      {!nhapMoi && keyDaNho ? (
        <div className="ct-duphong-hang">
          <KeyRound size={13} aria-hidden />
          <button type="button" className="ct-btn" disabled={dangGui || khoa} onClick={() => void gui(keyDaNho!)}>
            {dangGui ? 'Đang kiểm…' : 'Dùng lại key để làm tiếp'}
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" disabled={dangGui} onClick={() => datNhapMoi(true)}>
            Nhập key khác
          </button>
        </div>
      ) : (
        <form className="ct-duphong-hang" onSubmit={(e) => { e.preventDefault(); void gui(key.trim()); }}>
          <KeyRound size={13} aria-hidden />
          <input
            type="password"
            className="ct-duphong-o"
            placeholder="Nhập key để làm tiếp"
            autoComplete="off"
            value={key}
            autoFocus
            onChange={(e) => datKey(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button type="submit" className="ct-btn" disabled={dangGui || khoa || !key.trim()}>
            {dangGui ? 'Đang kiểm…' : 'Làm tiếp'}
          </button>
        </form>
      )}
      {loi && <p className="ct-duphong-loi">{loi}</p>}
    </div>
  );
}
