/**
 * Dạng sóng một đường tiếng, vẽ bằng canvas.
 *
 * ─── Vì sao canvas chứ không SVG ───
 * Một dải là 1200 cột, và bàn làm việc có năm dải. SVG thì thành 6.000 phần tử
 * DOM, và con trỏ chạy 60 lần một giây bắt trình duyệt tính lại bố cục từng
 * ấy phần tử. Canvas vẽ xong là xong.
 *
 * ─── Con trỏ vẽ RIÊNG, không vẽ lại cả sóng ───
 * Dạng sóng chỉ đổi khi đổi bài hay đổi bề rộng; con trỏ đổi 60 lần một giây.
 * Gộp chung thì mỗi khung hình phải vẽ lại 1200 cột × 5 dải. Ở đây sóng nằm
 * trên canvas, con trỏ là một `div` mỏng dịch bằng `transform` — trình duyệt
 * làm việc đó trên GPU và không đụng tới canvas.
 */
import { useEffect, useRef } from 'react';

interface Props {
  min: Float32Array | undefined;
  max: Float32Array | undefined;
  /** 0…1. Vị trí con trỏ phát. `null` = không hiện. */
  viTri: number | null;
  mau: string;
  cao: number;
  /** Bấm vào để nhảy tới. Nhận 0…1. */
  onNhay?: ((ti: number) => void) | undefined;
}

export function Song({ min, max, viTri, mau, cao, onNhay }: Props) {
  const oRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const o = oRef.current;
    if (!o || !min || !max) return;
    const rong = o.clientWidth;
    if (rong === 0) return;

    /* Vẽ theo `devicePixelRatio`, nếu không thì trên màn Retina mọi nét đều
       nhoè — và dạng sóng nhoè trông y như dạng sóng của một bản thu tệ. */
    const dpr = window.devicePixelRatio || 1;
    o.width = Math.round(rong * dpr);
    o.height = Math.round(cao * dpr);
    const g = o.getContext('2d');
    if (!g) return;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, rong, cao);

    const giua = cao / 2;
    g.fillStyle = mau;
    const n = min.length;
    for (let x = 0; x < rong; x++) {
      const i = Math.min(n - 1, Math.floor((x * n) / rong));
      const tren = giua - (max[i] ?? 0) * giua;
      const duoi = giua - (min[i] ?? 0) * giua;
      /* Tối thiểu một điểm ảnh: đoạn im lặng mà vẽ cao 0 thì dải đứt quãng,
         nhìn như dữ liệu thiếu chứ không như nhạc im. */
      g.fillRect(x, tren, 1, Math.max(1, duoi - tren));
    }
  }, [min, max, mau, cao]);

  return (
    <div
      className="ct-xr-song"
      style={{ height: cao }}
      onPointerDown={onNhay
        ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onNhay(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
        }
        : undefined}
      data-bam={onNhay ? '1' : undefined}
    >
      <canvas ref={oRef} className="ct-xr-song-canvas" />
      {viTri !== null && (
        <div className="ct-xr-song-troc" style={{ transform: `translateX(${viTri * 100}%)` }} />
      )}
    </div>
  );
}
