'use client';

import { CheckCircle2, CornerDownRight, Flag } from 'lucide-react';
import type { TienDoKhoa } from './chung';
import type { Nghe } from './ngheData';
import { GhimODay, Khoi, San3D } from './Khoi3D';

/**
 * Bậc thang đi lên: mỗi bậc một khoá, bậc sau cao hơn, lệch phải và lùi vào trong một
 * nhịp — đúng hình một cầu thang thật nhìn chéo từ trên. Nhánh tuỳ chọn là khối viền đứt
 * mọc cạnh bậc nó gắn vào, ở phía còn trống (bậc thấp trống bên phải, bậc cao trống bên trái).
 */
export default function BacThang3D({
  la3D,
  nghe,
  tienDo,
  coTienDo,
  daDangNhap,
  chon,
  oDay,
  onChon,
}: {
  la3D: boolean;
  nghe: Nghe;
  tienDo: Record<string, TienDoKhoa>;
  coTienDo: boolean;
  daDangNhap: boolean;
  /** slug đang chọn */
  chon: string;
  /** chỉ số bậc "Bạn đang ở đây" */
  oDay: number;
  onChon: (slug: string) => void;
}) {
  const n = nghe.buoc.length;

  if (!la3D) {
    // Màn hẹp: cầu thang dựng đứng, bậc cao nhất ở trên, thụt dần sang phải khi đi lên.
    const thut = Math.min(3.2, 26 / Math.max(1, n - 1));
    return (
      <div className="flex flex-col gap-2.5 py-1">
        {[...nghe.buoc].map((b, i) => ({ b, i })).reverse().map(({ b, i }) => {
          const td = tienDo[b.slug];
          const nhanh = nghe.tuyChon.filter((t) => t.canh === i + 1);
          return (
            <div key={b.slug} className="flex flex-col gap-1.5" style={{ paddingLeft: `${i * thut}%` }}>
              {nhanh.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => onChon(t.slug)}
                  className={`self-start ml-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-dashed text-text-secondary ${
                    chon === t.slug ? 'border-neon-violet text-text-primary' : 'border-[var(--border-color)]'
                  }`}
                >
                  <CornerDownRight className="w-3.5 h-3.5" /> Tuỳ chọn: {t.ten}
                </button>
              ))}
              <Khoi
                la3D={false}
                rong="100%"
                cao={56}
                hex={nghe.hex}
                chon={chon === b.slug}
                tre={0.05 + i * 0.06}
                onClick={() => onChon(b.slug)}
                ariaLabel={`Bậc ${i + 1}: ${b.ten}`}
                ariaPressed={chon === b.slug}
              >
                <NoiDungBac so={i + 1} ten={b.ten} td={td} coTienDo={coTienDo} cuoi={i === n - 1} />
                {i === oDay && (
                  <span className="absolute -top-2.5 right-2">
                    <GhimODay nhan={daDangNhap ? 'Bạn ở đây' : 'Bắt đầu'} />
                  </span>
                )}
              </Khoi>
            </div>
          );
        })}
      </div>
    );
  }

  const CAO = 50;
  const RONG = 56; // % bề rộng mỗi bậc
  const buocNgang = n > 1 ? (100 - RONG) / (n - 1) : 0;
  const caoSan = n * CAO + 20;

  return (
    <San3D la3D gocX={-15} gocY={-10} className="pt-12 pb-8 px-8">
      <div className="relative" style={{ height: caoSan, transformStyle: 'preserve-3d' }}>
        {nghe.buoc.map((b, i) => {
          const td = tienDo[b.slug];
          const trai = i * buocNgang;
          return (
            <Khoi
              key={b.slug}
              la3D
              rong={`${RONG}%`}
              cao={CAO}
              sau={56}
              lui={-i * 20}
              hex={nghe.hex}
              chon={chon === b.slug}
              tre={0.08 + i * 0.09}
              onClick={() => onChon(b.slug)}
              ariaLabel={`Bậc ${i + 1}: ${b.ten}`}
              ariaPressed={chon === b.slug}
              viTri={{ position: 'absolute', left: `${trai}%`, bottom: i * CAO }}
            >
              <NoiDungBac so={i + 1} ten={b.ten} td={td} coTienDo={coTienDo} cuoi={i === n - 1} />
              {i === oDay && (
                <span className="absolute -top-3 left-3">
                  <GhimODay nhan={daDangNhap ? 'Bạn đang ở đây' : 'Bắt đầu ở đây'} />
                </span>
              )}
            </Khoi>
          );
        })}
        {nghe.tuyChon.map((t, k) => {
          const neo = Math.min(n, Math.max(1, t.canh ?? n)) - 1;
          const traiNeo = neo * buocNgang;
          const conTrai = traiNeo;
          const conPhai = 100 - traiNeo - RONG;
          const benPhai = conPhai >= conTrai;
          const rong = Math.max(20, Math.min(34, (benPhai ? conPhai : conTrai) - 3));
          const trai = benPhai ? traiNeo + RONG + 3 : traiNeo - rong - 3;
          const td = tienDo[t.slug];
          return (
            <Khoi
              key={t.slug}
              la3D
              vienDut
              rong={`${rong}%`}
              cao={CAO - 12}
              lui={-neo * 20}
              hex={nghe.hex}
              chon={chon === t.slug}
              tre={0.5 + n * 0.09 + k * 0.1}
              onClick={() => onChon(t.slug)}
              ariaLabel={`Nhánh tuỳ chọn: ${t.ten}`}
              ariaPressed={chon === t.slug}
              viTri={{ position: 'absolute', left: `${Math.max(0, trai)}%`, bottom: neo * CAO + 6 }}
            >
              <div className="h-full flex items-center gap-1.5 px-2.5 text-[12px] font-semibold min-w-0">
                <CornerDownRight className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span className="truncate">{t.ten}</span>
                {coTienDo && td && <span className="ml-auto tabular-nums shrink-0">{td.pct}%</span>}
              </div>
            </Khoi>
          );
        })}
      </div>
    </San3D>
  );
}

function NoiDungBac({
  so,
  ten,
  td,
  coTienDo,
  cuoi,
}: {
  so: number;
  ten: string;
  td?: TienDoKhoa;
  coTienDo: boolean;
  cuoi: boolean;
}) {
  const xong = td && td.pct >= 100;
  return (
    <div className="h-full flex items-center gap-2.5 px-3 min-w-0">
      <span className="shrink-0 w-7 h-7 rounded-full bg-white/20 ring-1 ring-white/40 flex items-center justify-center text-xs font-bold tabular-nums">
        {xong ? <CheckCircle2 className="w-4 h-4" /> : cuoi ? <Flag className="w-3.5 h-3.5" /> : so}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold leading-tight truncate">{ten}</div>
        {coTienDo && td && !xong && (
          <div className="mt-1 h-1 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${td.pct}%` }} />
          </div>
        )}
      </div>
      {coTienDo && td && <span className="shrink-0 text-xs font-bold tabular-nums">{td.pct}%</span>}
    </div>
  );
}
