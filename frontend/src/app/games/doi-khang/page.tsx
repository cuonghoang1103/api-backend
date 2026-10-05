import type { Metadata } from 'next';
import { Suspense } from 'react';
import DoiKhangClient from './DoiKhangClient';

/**
 * /games/doi-khang — sảnh đối kháng (cờ vua · cờ tướng · tiến lên · caro).
 *   ?phong=MÃ                       — vào thẳng phòng online (link mời)
 *   ?choi=co-vua&cap=2[&ben=0|1]    — chơi với máy (chạy hoàn toàn ở máy người chơi)
 *   ?choi=tien-len&cap=2&bot=3      — tiến lên với 1–3 máy
 */
const SITE_URL = 'https://cuongthai.com';

export const metadata: Metadata = {
  title: 'Đối kháng — Cờ vua, Cờ tướng, Tiến lên, Caro',
  description: 'Chơi cờ vua, cờ tướng, tiến lên miền Nam và caro với máy hoặc với bạn bè theo thời gian thực — có tỷ số, đồng hồ và xếp hạng Elo.',
  alternates: { canonical: `${SITE_URL}/games/doi-khang` },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#05040f' }} />}>
      <DoiKhangClient />
    </Suspense>
  );
}
