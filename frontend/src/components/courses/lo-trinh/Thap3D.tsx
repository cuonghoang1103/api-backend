'use client';

import { ArrowUp, CheckCircle2 } from 'lucide-react';
import type { TangThap } from '../roadmapData';
import { GhimODay, Khoi, San3D } from './Khoi3D';

export interface SoLieuTang {
  tong: number;
  xong: number;
  pctTB: number;
}

// Đáy rộng nhất. Màn hẹp thì thu ít lại để chữ vẫn đọc được ở 360px.
const RONG_3D = ['100%', '90%', '80%', '70%', '61%', '53%'];
const RONG_PHANG = ['100%', '96%', '92%', '88%', '84%', '80%'];

export default function Thap3D({
  la3D,
  tangs,
  soLieu,
  chon,
  oDay,
  coTienDo,
  daDangNhap,
  onChon,
}: {
  la3D: boolean;
  tangs: TangThap[];
  soLieu: Record<number, SoLieuTang>;
  chon: number;
  oDay: number;
  coTienDo: boolean;
  daDangNhap: boolean;
  onChon: (so: number) => void;
}) {
  const cao = la3D ? 74 : 66;
  return (
    <div className="relative">
      <San3D la3D={la3D} gocX={-17} className={la3D ? 'pt-10 pb-6 px-6' : 'py-2'}>
        <div className="flex flex-col items-center" style={la3D ? { transformStyle: 'preserve-3d' } : { gap: 10 }}>
          {[...tangs].reverse().map((t) => {
            const i = t.so - 1; // 0 = đáy
            const s = soLieu[t.so] ?? { tong: t.buoc.length, xong: 0, pctTB: 0 };
            const dangChon = t.so === chon;
            const laODay = t.so === oDay;
            const xongHet = coTienDo && s.tong > 0 && s.xong === s.tong;
            return (
              <Khoi
                key={t.so}
                la3D={la3D}
                rong={(la3D ? RONG_3D : RONG_PHANG)[i]}
                cao={cao}
                sau={72}
                // Tầng đỉnh lộ cả mặt trên; tầng dưới chỉ lộ gờ 15px (+26 khi tầng được chọn nhô ra).
                sauTren={i === tangs.length - 1 ? 72 : 15 + (dangChon ? 26 : 0)}
                lui={-i * 15}
                hex={t.hex}
                chon={dangChon}
                tre={0.1 + i * 0.11}
                onClick={() => onChon(t.so)}
                ariaLabel={`Tầng ${t.so}: ${t.ten}. ${s.xong} trên ${s.tong} khoá xong. Bấm để xem các môn.`}
                ariaPressed={dangChon}
              >
                <div className="h-full flex items-center gap-3 px-3 sm:px-4">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-white/20 ring-1 ring-white/40 flex items-center justify-center font-heading font-bold text-base">
                    {xongHet ? <CheckCircle2 className="w-5 h-5" /> : t.so}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-heading font-bold text-[15px] leading-tight truncate">{t.ten}</span>
                      {laODay && (
                        <span className="hidden sm:inline-flex">
                          <GhimODay nhan={daDangNhap ? 'Bạn đang ở đây' : 'Bắt đầu ở đây'} />
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-white/85 truncate">{t.phu}</div>
                    {coTienDo && (
                      <div className="mt-1 h-1 rounded-full bg-white/25 overflow-hidden max-w-[220px]">
                        <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${s.pctTB}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-[11px] leading-tight">
                    {coTienDo ? (
                      <>
                        <div className="font-heading font-bold text-base tabular-nums">{s.pctTB}%</div>
                        <div className="text-white/85 tabular-nums">
                          {s.xong}/{s.tong} xong
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold tabular-nums">{s.tong} khoá</div>
                        <div className="text-white/85 hidden sm:block">{t.thoiGian}</div>
                      </>
                    )}
                  </div>
                </div>
                {laODay && (
                  <span className="sm:hidden absolute -top-2.5 right-2">
                    <GhimODay nhan={daDangNhap ? 'Bạn ở đây' : 'Bắt đầu'} />
                  </span>
                )}
              </Khoi>
            );
          })}
        </div>
        {/* Bóng đổ dưới chân tháp. */}
        {la3D && (
          <div
            aria-hidden
            className="pointer-events-none mx-auto mt-3 h-6 w-[92%] rounded-[50%] blur-xl opacity-60"
            style={{ background: 'radial-gradient(closest-side, rgba(79,70,229,.55), transparent)' }}
          />
        )}
      </San3D>
      <p className="mt-2 text-center text-xs text-text-muted flex items-center justify-center gap-1">
        <ArrowUp className="w-3.5 h-3.5" /> Học từ tầng 1 ở đáy lên. Bấm một tầng để xem các môn của tầng đó.
      </p>
    </div>
  );
}
