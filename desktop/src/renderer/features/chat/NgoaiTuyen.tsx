/**
 * ============================================================
 * GIAO DIỆN "ĐANG CHẠY NGOẠI TUYẾN" — dùng chung cho AI Code và Chat
 * ============================================================
 *
 * Chủ app 03/10/2026: *"…giao diện của AI cũng đổi theo để user còn biết nó
 * đã hoạt động rồi."*
 *
 * Ba thứ đổi cùng lúc, cố ý thừa — một dấu hiệu duy nhất là thứ người ta lướt
 * qua không thấy:
 *   1. Dải trạng thái trên đầu khung: "🔌 Ngoại tuyến · <model> · chạy trên máy này".
 *   2. Màu nhấn của CẢ khung AI đổi sang xanh mòng két (`data-ngoai-tuyen` trên
 *      khung gốc ⇒ `--ct-accent` đổi trong styles.css, sáng/tối đều có bản).
 *   3. Mỗi câu trả lời từ máy mang nhãn riêng (ranh giới 2) — `NhanMay`.
 *
 * Luật chọn dải nằm ở `shared/cheDoAi.ts` (thuần, có test) — tệp này chỉ vẽ.
 */
import { useCallback, useEffect, useState } from 'react';
import { PlugZap, RotateCcw, Settings2, WifiOff } from 'lucide-react';
import type { AiCucBoCheDoCode } from '../../../shared/ipc';
import { giaoDienAi, type TrangThaiGiaoDien } from '../../../shared/cheDoAi';
import { useAppState } from '../../app-state';
import { INTERNAL_ROUTES } from '../../routes';
import { useDich } from '../../i18n';

/** Mở Cài đặt và cuộn thẳng tới mục AI ngoại tuyến. */
export function useMoCaiNgoaiTuyen(): () => void {
  const { navigate } = useAppState();
  return useCallback(() => navigate(INTERNAL_ROUTES.settings, 'muc=ai-ngoai-tuyen'), [navigate]);
}

/**
 * Model AI Code sẽ dùng khi mất mạng. Nạp lại mỗi lần trạng thái mạng đổi —
 * mất mạng là lúc cần biết NGAY có gì để chạy.
 */
export function useCheDoCode(): AiCucBoCheDoCode | null {
  const { online } = useAppState();
  const [cd, datCd] = useState<AiCucBoCheDoCode | null>(null);
  useEffect(() => {
    let huy = false;
    void window.cuongthai?.aiCucBo?.cheDoCode?.()
      .then((r) => { if (!huy) datCd(r ?? null); })
      .catch(() => {});
    return () => { huy = true; };
  }, [online]);
  return cd;
}

/**
 * Trạng thái giao diện cho MỘT khung AI.
 *
 * `daQuayVe` tự đặt lại mỗi lần mất mạng: lần mất mạng sau, khi có mạng lại,
 * phải hỏi lại — không phải nhớ cú bấm của lần trước.
 */
export function useGiaoDienNgoaiTuyen(o: {
  dangChay: boolean;
  luotLaCucBo: boolean;
  coModel: boolean;
  choPhep: boolean;
}): TrangThaiGiaoDien & { quayVe: () => void } {
  const { online } = useAppState();
  const [daQuayVe, datDaQuayVe] = useState(false);
  useEffect(() => { if (!online) datDaQuayVe(false); }, [online]);
  const tt = giaoDienAi({ online, daQuayVe, ...o });
  return { ...tt, quayVe: () => datDaQuayVe(true) };
}

export function DaiNgoaiTuyen({
  tt, tenModel, nhan, lyDo, dangChay,
}: {
  tt: TrangThaiGiaoDien & { quayVe: () => void };
  /** Tên model trên máy sẽ/đang trả lời. Rỗng = chưa có. */
  tenModel: string;
  nhan?: string;
  /** Câu giải thích khi chưa có model (vì sao / nên tải bản nào). */
  lyDo?: string;
  dangChay: boolean;
}) {
  const { dich, dichP } = useDich();
  const moCai = useMoCaiNgoaiTuyen();
  if (tt.nen === 'mayChu') return null;

  if (tt.nen === 'matMangChuaCai' || tt.nen === 'matMangDaTat') {
    return (
      <div className="ct-ngoai-tuyen-dai" data-loai="thieu" role="status">
        <WifiOff size={15} aria-hidden />
        <span className="ct-ngoai-tuyen-chu">
          {tt.nen === 'matMangDaTat'
            ? dich('Mất mạng — AI ngoại tuyến đang tắt trong Cài đặt.')
            : `${dich('Mất mạng — chưa có AI ngoại tuyến để chạy thay.')}${lyDo ? ` ${lyDo}` : ''}`}
        </span>
        <button type="button" className="ct-ngoai-tuyen-nut" onClick={moCai}>
          <Settings2 size={13} aria-hidden /> {tt.nen === 'matMangDaTat' ? dich('Mở cài đặt') : dich('Cài AI ngoại tuyến')}
        </button>
      </div>
    );
  }

  return (
    <div className="ct-ngoai-tuyen-dai" data-loai={tt.hoiQuayVe ? 'coMang' : 'chay'} role="status" aria-live="polite">
      <PlugZap size={15} aria-hidden />
      <span className="ct-ngoai-tuyen-chu">
        <strong>{dich('Ngoại tuyến')}</strong>
        {tenModel && <> · {tenModel}</>}
        {' · '}{nhan || dich('chạy trên máy này')}
      </span>
      {tt.hoiQuayVe && (
        <span className="ct-ngoai-tuyen-hoi">
          {tt.hoiQuayVe.sauLuot || dangChay
            ? dich('Đã có mạng — sẽ quay về AI máy chủ khi lượt này xong.')
            : dich('Đã có mạng — quay về AI máy chủ?')}
        </span>
      )}
      {tt.hoiQuayVe && !tt.hoiQuayVe.sauLuot && !dangChay && (
        <button type="button" className="ct-ngoai-tuyen-nut" onClick={tt.quayVe}>
          <RotateCcw size={13} aria-hidden /> {dich('Quay về AI máy chủ')}
        </button>
      )}
      {!tt.hoiQuayVe && (
        <span className="ct-ngoai-tuyen-phu">{dichP('Có mạng lại sẽ hỏi quay về {x}.', { x: dich('AI máy chủ') })}</span>
      )}
    </div>
  );
}

/** Nhãn gắn trên MỖI câu trả lời từ máy (ranh giới 2). */
export function NhanMay({ ten }: { ten: string }) {
  const { dich } = useDich();
  return (
    <div className="ct-nhan-may" title={dich('Model nhỏ chạy trên máy bạn — có thể sót hoặc sai. Có mạng lại thì hỏi lại để có câu đầy đủ hơn.')}>
      <PlugZap size={11} aria-hidden /> {dich('AI trên máy')} · {ten} · {dich('có thể sót, kiểm lại khi có mạng')}
    </div>
  );
}
