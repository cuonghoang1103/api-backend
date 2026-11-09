/**
 * Hàng nút nhỏ dưới tin nhắn, kiểu Claude: chỉ biểu tượng, chữ ở tooltip.
 *   • Tin người dùng: [giờ] Sửa · Chép · Tách nhánh   (căn phải, hiện khi rê)
 *   • Câu trả lời:    Chép · Tạo lại                  (hiện khi rê; câu CUỐI luôn hiện)
 */
import { useState, type ReactNode } from 'react';
import { Check, Copy, GitBranch, Pencil, RotateCcw } from 'lucide-react';
import { NhanThoiGian } from './NutTinNhan';
import { useCtcChu } from './CtcChu';

function NutIcon({
  nhan, onBam, khoa, children, nut,
}: { nhan: string; onBam: () => void; khoa?: boolean; children: ReactNode; nut?: string }) {
  return (
    <button
      type="button"
      className="ctc-hd-nut"
      onClick={onBam}
      disabled={khoa === true}
      title={nhan}
      aria-label={nhan}
      {...(nut ? { 'data-nut': nut } : {})}
    >
      {children}
    </button>
  );
}

function NutChep({ text }: { text: string }) {
  const { c } = useCtcChu();
  const [daChep, datDaChep] = useState(false);
  const chep = (): void => {
    void navigator.clipboard.writeText(text).then(() => {
      datDaChep(true);
      setTimeout(() => datDaChep(false), 1400);
    }).catch(() => { /* chép hỏng thì im */ });
  };
  return (
    <NutIcon nhan={daChep ? c('Đã chép') : c('Chép')} onBam={chep} nut="chep">
      {daChep ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
    </NutIcon>
  );
}

export function HanhDongNguoi({
  text, luc, khoa, onSua, onTachNhanh,
}: {
  text: string;
  luc?: number;
  khoa: boolean;
  onSua: () => void;
  onTachNhanh: () => void;
}) {
  const { c } = useCtcChu();
  return (
    <div className="ctc-hd" data-ben="nguoi">
      {luc !== undefined && <NhanThoiGian luc={luc} />}
      <NutIcon nhan={c('Sửa tin nhắn')} onBam={onSua} khoa={khoa} nut="sua">
        <Pencil size={14} aria-hidden />
      </NutIcon>
      <NutChep text={text} />
      <NutIcon nhan={c('Tách nhánh từ đây (cuộc hiện tại giữ nguyên)')} onBam={onTachNhanh} khoa={khoa} nut="tachNhanh">
        <GitBranch size={14} aria-hidden />
      </NutIcon>
    </div>
  );
}

export function HanhDongMay({
  text, khoa, onTaoLai, cuoi, dau,
}: {
  text: string;
  khoa: boolean;
  /** Vắng = không tạo lại được (ví dụ câu trả lời từ model trên máy). */
  onTaoLai?: () => void;
  cuoi: boolean;
  /** Thứ đứng đầu hàng (dấu CuongMini ở câu cuối). */
  dau?: ReactNode;
}) {
  const { c } = useCtcChu();
  return (
    <div className="ctc-hd" data-ben="may" data-cuoi={cuoi}>
      {dau}
      <NutChep text={text} />
      {onTaoLai && (
        <NutIcon nhan={c('Tạo lại câu trả lời')} onBam={onTaoLai} khoa={khoa} nut="taoLai">
          <RotateCcw size={14} aria-hidden />
        </NutIcon>
      )}
    </div>
  );
}
