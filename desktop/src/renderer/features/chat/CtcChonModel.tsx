/**
 * Bộ chọn model TRONG ô soạn (góc dưới-phải), kiểu Claude.
 *
 * Bốn bậc máy chủ mở cho `/ai/chat` (09/11/2026). ⛔ KHÔNG BAO GIỜ hiện tên
 * model thật — chỉ tên CuongMini. Ba bậc trên cần Pro: người không Pro vẫn
 * THẤY (để biết có gì), nhưng bị khoá kèm nhãn "Cần Pro".
 */
import { ChevronDown, Lock } from 'lucide-react';
import { CtcMenu, useCtcMo } from './CtcMenu';
import { useCtcChu } from './CtcChu';

export const MODEL_CHAT = [
  { id: 'cuongmini-3.11', ten: 'CuongMini 3.11', mo: 'Nhanh · mặc định', canPro: false },
  { id: 'cuongmini-pro', ten: 'CuongMini Pro', mo: 'Nhanh, thông minh · việc hằng ngày', canPro: true },
  { id: 'cuongmini-pro-2', ten: 'CuongMini Pro 2', mo: 'Cân bằng · viết, code, phân tích', canPro: true },
  { id: 'cuongmini-max', ten: 'CuongMini Max', mo: 'Mạnh nhất · bài khó, đọc file dài', canPro: true },
] as const;

export type MaModel = (typeof MODEL_CHAT)[number]['id'];
export const MODEL_MAC_DINH: MaModel = 'cuongmini-3.11';

export function tenModel(id: string | undefined | null): string {
  return MODEL_CHAT.find((m) => m.id === id)?.ten ?? 'CuongMini';
}

/** Model hợp lệ cho người dùng này (không Pro ⇒ luôn về bậc mặc định). */
export function modelHopLe(id: string | null | undefined, pro: boolean): MaModel {
  const m = MODEL_CHAT.find((x) => x.id === id);
  if (!m || (m.canPro && !pro)) return MODEL_MAC_DINH;
  return m.id;
}

export function CtcChonModel({
  giaTri, pro, khoa, onChon, huong = 'tren',
}: {
  giaTri: string;
  pro: boolean;
  khoa?: boolean;
  onChon: (id: MaModel) => void;
  /** Ô soạn ở giữa trang (màn trống) ⇒ mở xuống, khỏi che lời chào. */
  huong?: 'tren' | 'duoi';
}) {
  const { c } = useCtcChu();
  const { mo, bat, dong, neo } = useCtcMo();

  return (
    <>
      <button
        ref={neo}
        type="button"
        className="ctc-model-nut"
        data-nut="chonModel"
        data-mo={mo}
        disabled={khoa === true}
        onClick={bat}
        aria-haspopup="menu"
        aria-expanded={mo}
        title={c('Chọn model')}
      >
        <span>{tenModel(giaTri)}</span>
        <ChevronDown size={14} aria-hidden />
      </button>
      <CtcMenu
        mo={mo}
        onDong={dong}
        neo={neo}
        huong={huong}
        canh="phai"
        rong={280}
        nhan={c('Chọn model')}
        muc={MODEL_CHAT.map((m) => {
          const biKhoa = m.canPro && !pro;
          return {
            nhan: m.ten,
            phu: c(m.mo),
            chon: m.id === giaTri,
            khoa: biKhoa,
            onChon: () => onChon(m.id),
            ...(biKhoa
              ? { duoi: <span className="ctc-menu-pro"><Lock size={11} aria-hidden />{c('Cần Pro')}</span> }
              : {}),
          };
        })}
      />
    </>
  );
}
