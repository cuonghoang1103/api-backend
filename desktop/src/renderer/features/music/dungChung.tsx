/**
 * Mẩu dùng chung của trang Nhạc: ảnh bìa, móc đọc âm thanh nền, định dạng.
 */
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Music2 } from 'lucide-react';
import { layMucKhongGian, ngheKhongGian, type MucKhongGian } from './khongGian';
import type { Track } from './player';
import { dichP } from '../../i18n';

/** Mức âm thanh nền hiện tại — tự vẽ lại khi bất kỳ chỗ nào đổi. */
export function useKhongGian(): MucKhongGian {
  return useSyncExternalStore(ngheKhongGian, layMucKhongGian);
}

/** "1 giờ 23 phút" — dễ đọc hơn "83 phút" khi danh sách đã dài. */
export function doDaiDanhSach(tracks: Track[]): string {
  const phut = Math.round(tracks.reduce((t, b) => t + (b.durationSeconds ?? 0), 0) / 60);
  if (phut < 60) return dichP('{n} phút', { n: phut });
  return dichP('{h} giờ {m} phút', { h: Math.floor(phut / 60), m: phut % 60 });
}

/** Ảnh bìa có chỗ thay thế — bài không có ảnh vẫn ra một ô đẹp, không vỡ. */
/** Băm tên ⇒ cặp màu ổn định (cùng bài luôn cùng bìa). */
function mauTheoTen(ten: string): [number, number] {
  let h = 2166136261;
  for (let i = 0; i < ten.length; i++) { h ^= ten.charCodeAt(i); h = Math.imul(h, 16777619); }
  const g = (h >>> 0) % 360;
  return [g, (g + 38 + ((h >>> 9) % 50)) % 360];
}

/**
 * Ảnh bìa. Không có ảnh ⇒ BÌA TỰ TẠO theo tên (05/10/2026 — người dùng: "ảnh, khung, logo nhạc xấu quá"):
 * nền hai màu suy từ tên bài, đĩa than mờ, chữ cái đầu — mỗi bài một bìa riêng, không còn ô xám.
 */
export function AnhBia({ src, co = 40, className, ten }: { src?: string | null | undefined; co?: number; className?: string; ten?: string | null | undefined }) {
  const [hong, setHong] = useState(false);
  if (src && !hong) return <img src={src} alt="" loading="lazy" className={`mz-art ${className ?? ''}`} style={{ width: co, height: co }} onError={() => setHong(true)} />;
  if (!ten) {
    return (
      <span className={`mz-art mz-art-trong ${className ?? ''}`} style={{ width: co, height: co }}>
        <Music2 size={Math.round(co * 0.4)} aria-hidden />
      </span>
    );
  }
  const [a, b] = mauTheoTen(ten);
  const chu = (ten.trim().match(/[\p{L}\p{N}]/u)?.[0] ?? '♪').toUpperCase();
  return (
    <span className={`mz-art mz-art-tao ${className ?? ''}`} style={{ width: co, height: co, ['--h1' as string]: a, ['--h2' as string]: b, fontSize: co * 0.42 }} aria-hidden>
      <i className="mz-art-dia" />
      {co >= 30 && <b>{chu}</b>}
    </span>
  );
}

/** Ghép bốn ảnh bìa thành một ô vuông — bìa của playlist/thư viện. */
export function BiaGhep({ tracks, co = 132 }: { tracks: Track[]; co?: number }) {
  const anh = tracks.map((t) => t.coverImage).filter((u): u is string => Boolean(u)).slice(0, 4);
  if (anh.length < 4) return <AnhBia src={anh[0]} co={co} className="mz-bia-ghep" ten={tracks[0]?.title ?? 'Playlist'} />;
  return (
    <span className="mz-bia-ghep mz-bia-ghep-4" style={{ width: co, height: co }} aria-hidden>
      {anh.map((u, i) => <img key={i} src={u} alt="" loading="lazy" />)}
    </span>
  );
}

/**
 * Đưa lớp phủ (menu ⋯, chế độ thư giãn, bảng phím tắt) ra NGOÀI trang.
 *
 * ⚠️ Trang Nhạc là một CONTAINER (`container-type: inline-size`) để bố cục co
 * theo vùng nội dung — mà container kéo theo layout containment, tức nó thành
 * khung chứa của mọi con `position: fixed`. Để lớp phủ nằm trong trang thì
 * `fixed` không còn bám cửa sổ: menu lệch, màn thư giãn bị cắt. Gắn vào
 * `.ct-shell` (không phải `body`) để vẫn ăn bảng màu Graphite của vỏ app.
 */
export function RaNgoai({ children }: { children: ReactNode }) {
  const dich = typeof document !== 'undefined' ? (document.querySelector('.ct-shell') ?? document.body) : null;
  return dich ? createPortal(children, dich) : <>{children}</>;
}
