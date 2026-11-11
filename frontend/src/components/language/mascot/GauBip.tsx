'use client';

/**
 * 🐻 Gấu Bíp — linh vật hệ /language, nay là GẤU PIXEL (11/11/2026; thay bản SVG 18 cảm xúc trước đó).
 *
 * Ngang với web /chat + app desktop (cùng {@link GauPixel}). Giữ NGUYÊN API cũ (emotion/talking/size/
 * variant/vayKey/saoKey/className/nhinTheoTro/onClick/ariaLabel/khuon) nên GauChao, LoTrinh3D, trangThaiBip…
 * không phải sửa. 18 cảm xúc (vui/nhớ/buồn/streak/chấm bài…) vẽ bằng pixel qua `emotion` — KHÔNG mất tính năng
 * phản ứng theo trạng thái học. `nhinTheoTro` ⇒ mắt nhìn theo con trỏ. `talking` ⇒ sóng âm + nhún nhanh.
 *
 * Bỏ qua (pixel một dáng): variant (khăn luôn cam), vayKey/saoKey, khuon — vẫn nhận để nơi gọi không vỡ.
 */
import { GauPixel, type EmoGau } from '../../chat/claude/GauPixel';

export type CamXucGau = EmoGau;
export type VariantGau = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';
/** Giữ để không vỡ import ngoài (chỉ dùng khi so phương án mặt — pixel không dùng). */
export type KhuonMat = {
  matX: number; matY: number; matRx: number; matRy: number; nguoi: number;
  vanhRx: number; vanhRy: number; vanhGoc: number; vanhDx: number; vanhDy: number;
  tai: number; taiX: number; taiY: number; mui: number;
};

export default function GauBip({
  emotion = 'happy',
  talking = false,
  size = 200,
  className = '',
  nhinTheoTro = true,
  onClick,
  ariaLabel,
}: {
  emotion?: CamXucGau;
  talking?: boolean;
  /** Cạnh khung vuông (px). */
  size?: number;
  variant?: VariantGau;
  vayKey?: number;
  saoKey?: number;
  className?: string;
  nhinTheoTro?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  khuon?: KhuonMat;
}) {
  return (
    <GauPixel
      emotion={emotion}
      talking={talking}
      size={size === 0 ? 160 : size}
      follow={nhinTheoTro}
      className={className}
      onClick={onClick}
      title={ariaLabel}
    />
  );
}
