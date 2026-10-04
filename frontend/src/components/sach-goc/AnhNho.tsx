'use client';

/** Ảnh nhỏ một trang sách (dải trang, nút mở Sách gốc) — chạy được cả web lẫn app desktop. */
import { useAnhTrang } from './useSachRieng';

export function AnhNho({ p, rong, cao }: { p: number; rong: number; cao: number }) {
  const src = useAnhTrang(p, true);
  if (!src || src === 'loi') return <span style={{ display: 'block', width: rong, height: cao, maxWidth: '100%', aspectRatio: `${rong} / ${cao}`, background: 'rgba(148,163,184,.12)' }} />;
  // eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API, không qua next/image
  return <img src={src} alt="" loading="lazy" width={rong} height={cao} />;
}
