/**
 * Khung xem ảnh phóng to (lightbox).
 *
 * ⚠️ CHẶN CUỘN TRANG NỀN khi mở. Không chặn thì lăn chuột trong khung ảnh làm
 * bảng tin phía sau chạy, và đóng khung ra thì người dùng đứng ở một chỗ khác
 * hẳn chỗ họ vừa bấm — mất dấu bài đang đọc.
 */
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { Media } from './kieu';
import { useDich } from '../../i18n';

export function AnhPhongTo({
  media, chiSo, onDoiChiSo, onDong,
}: {
  media: Media[];
  chiSo: number;
  onDoiChiSo: (i: number) => void;
  onDong: () => void;
}) {
  const { dich } = useDich();
  const m = media[chiSo];

  useEffect(() => {
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const phim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDong();
      if (e.key === 'ArrowLeft' && chiSo > 0) onDoiChiSo(chiSo - 1);
      if (e.key === 'ArrowRight' && chiSo < media.length - 1) onDoiChiSo(chiSo + 1);
    };
    window.addEventListener('keydown', phim);
    return () => {
      document.body.style.overflow = cu;
      window.removeEventListener('keydown', phim);
    };
  }, [chiSo, media.length, onDoiChiSo, onDong]);

  if (!m) return null;

  return (
    <div className="ct-bt-xem" onClick={onDong} role="dialog" aria-modal="true" aria-label={dich('Xem ảnh')}>
      <button type="button" className="ct-bt-xem-dong" aria-label={dich('Đóng')} onClick={onDong}>
        <X size={20} aria-hidden />
      </button>

      {chiSo > 0 && (
        <button
          type="button"
          className="ct-bt-xem-lui"
          aria-label={dich('Ảnh trước')}
          onClick={(e) => { e.stopPropagation(); onDoiChiSo(chiSo - 1); }}
        >
          <ChevronLeft size={22} aria-hidden />
        </button>
      )}

      {/* `stopPropagation` trên chính tấm ảnh: bấm vào ảnh không được đóng
          khung, chỉ bấm ra NỀN mới đóng. */}
      {m.type === 'VIDEO'
        ? <video src={m.url} poster={m.thumbnail ?? undefined} controls autoPlay onClick={(e) => e.stopPropagation()} />
        : <img src={m.url} alt="" onClick={(e) => e.stopPropagation()} />}

      {chiSo < media.length - 1 && (
        <button
          type="button"
          className="ct-bt-xem-toi"
          aria-label={dich('Ảnh sau')}
          onClick={(e) => { e.stopPropagation(); onDoiChiSo(chiSo + 1); }}
        >
          <ChevronRight size={22} aria-hidden />
        </button>
      )}

      {media.length > 1 && (
        <span className="ct-bt-xem-dem">{chiSo + 1} / {media.length}</span>
      )}
    </div>
  );
}
