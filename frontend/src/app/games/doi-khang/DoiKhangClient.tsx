'use client';

/**
 * Bộ định tuyến phía client của /games/doi-khang: sảnh · phòng online · ván với máy (theo query).
 */
import { useSearchParams } from 'next/navigation';
import type { CapDoBot, MaTro } from '@/lib/doiKhang/luat';
import SanhDoiKhang from '@/components/doiKhang/SanhDoiKhang';
import KhungPhong from '@/components/doiKhang/KhungPhong';
import { useVanMay, useVanOnline } from '@/components/doiKhang/dieuKhien';

const TRO: MaTro[] = ['co-vua', 'co-tuong', 'tien-len', 'caro'];

function PhongOnline({ ma }: { ma: string }) {
  const dk = useVanOnline(ma);
  return <KhungPhong dk={dk} />;
}

function VanMay({ tro, cap, ben, soBot }: { tro: MaTro; cap: CapDoBot; ben: 0 | 1 | null; soBot: number }) {
  const dk = useVanMay(tro, cap, ben, soBot);
  return <KhungPhong dk={dk} />;
}

export default function DoiKhangClient() {
  const q = useSearchParams();
  const phong = (q.get('phong') ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (phong) return <PhongOnline key={phong} ma={phong} />;

  const choi = q.get('choi') as MaTro | null;
  if (choi && TRO.includes(choi)) {
    const capSo = Number(q.get('cap'));
    const cap = (capSo === 1 || capSo === 3 ? capSo : 2) as CapDoBot;
    const benQ = q.get('ben');
    const ben = benQ === '0' ? 0 : benQ === '1' ? 1 : null;
    const soBot = Math.min(3, Math.max(1, Number(q.get('bot')) || 3));
    return <VanMay key={`${choi}-${cap}-${benQ}-${soBot}`} tro={choi} cap={cap} ben={ben} soBot={soBot} />;
  }
  return <SanhDoiKhang />;
}
