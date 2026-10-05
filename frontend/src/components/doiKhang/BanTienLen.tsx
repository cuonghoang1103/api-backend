'use client';

/**
 * Bàn TIẾN LÊN (05/10/2026): bàn nỉ xanh viền gỗ, đối thủ ngồi quanh với lưng bài + số lá, bài
 * vừa đánh bay vào giữa bàn, "Chặt!" nổ to; bài trên tay xoè hình quạt, bấm nhấc lá; nút Đánh /
 * Bỏ lượt / Sắp xếp / Gợi ý.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  chanDuoc, giaTriLa, nhanBo, tenLa, tienLen,
  type NhinTienLen, type NuocTienLen, type TrangThaiTienLen,
} from '@/lib/doiKhang/luat';
import type { GheDTO } from '@/lib/doiKhang/client';
import { LaBai, LungBai } from './LaBai';
import { AnhDaiDien, useKichThuoc } from './chung';
import { amBan } from './amThanhDk';
import css from './doiKhang.module.css';

type ViTri = 'duoi' | 'phai' | 'tren' | 'trai';
const BO_CUC: Record<number, ViTri[]> = {
  2: ['duoi', 'tren'],
  3: ['duoi', 'phai', 'trai'],
  4: ['duoi', 'phai', 'tren', 'trai'],
};
const HUONG_BAY: Record<ViTri, [string, string, string]> = {
  duoi: ['0px', '220px', '-10deg'],
  tren: ['0px', '-220px', '10deg'],
  phai: ['260px', '-20px', '25deg'],
  trai: ['-260px', '-20px', '-25deg'],
};
const HANG_VE = ['Nhất', 'Nhì', 'Ba', 'Bét'];
const TEN_LOAI: Record<string, string> = { rac: 'Rác', doi: 'Đôi', ba: 'Sám', 'tu-quy': 'Tứ quý', sanh: 'Sảnh', 'doi-thong': 'Đôi thông' };

export default function BanTienLen({
  nhin,
  ghe,
  choPhepDi,
  onDi,
}: {
  nhin: NhinTienLen;
  ghe: GheDTO[];
  choPhepDi: boolean;
  onDi: (n: NuocTienLen) => void;
}) {
  const [khungRef, kt] = useKichThuoc<HTMLDivElement>();
  const toi = nhin.gheCuaToi ?? 0;
  const n = nhin.soNguoi;
  const boCuc = BO_CUC[n] ?? BO_CUC[4];
  const viTriCua = (g: number): ViTri => boCuc[(g - toi + n) % n] ?? 'tren';

  const [chon, setChon] = useState<string[]>([]);
  const [sapTheoChat, setSapTheoChat] = useState(false);
  const [goiY, setGoiY] = useState(0);
  const [chat, setChat] = useState<{ id: number; chu: string } | null>(null);
  const truocRef = useRef<{ soNuoc: number; ban: NhinTienLen['banTren'] }>({ soNuoc: nhin.soNuoc, ban: nhin.banTren });

  const tay = useMemo(() => {
    const t = [...(nhin.baiCuaToi ?? [])];
    if (sapTheoChat) t.sort((a, b) => 'SCDH'.indexOf(a[1]) - 'SCDH'.indexOf(b[1]) || giaTriLa(a) - giaTriLa(b));
    else t.sort((a, b) => giaTriLa(a) - giaTriLa(b));
    return t;
  }, [nhin.baiCuaToi, sapTheoChat]);

  // Bỏ chọn những lá không còn trên tay; reset gợi ý mỗi nước.
  useEffect(() => {
    setChon((c) => c.filter((x) => nhin.baiCuaToi?.includes(x)));
    setGoiY(0);
  }, [nhin.soNuoc, nhin.baiCuaToi]);

  // "Chặt!" — bộ mới khác loại bộ đang nằm trên bàn.
  useEffect(() => {
    const truoc = truocRef.current;
    if (nhin.soNuoc !== truoc.soNuoc) {
      const nc = nhin.nuocCuoi;
      if (nc && nc.nuoc.loai === 'danh' && truoc.ban && nhin.banTren && nhin.banTren.loai !== truoc.ban.loai) {
        setChat({ id: nhin.soNuoc, chu: 'Chặt!' });
        amBan('chieu');
      } else if (nc && nc.nuoc.loai === 'danh') {
        amBan('danhBai');
      }
    }
    truocRef.current = { soNuoc: nhin.soNuoc, ban: nhin.banTren };
  }, [nhin.soNuoc, nhin.nuocCuoi, nhin.banTren]);
  useEffect(() => {
    if (!chat) return;
    const t = setTimeout(() => setChat(null), 1300);
    return () => clearTimeout(t);
  }, [chat]);

  // Các nước đánh được (cho Gợi ý + bật/tắt nút Đánh) — dựng trạng thái giả chỉ có tay mình.
  const cacNuoc = useMemo<string[][]>(() => {
    if (!choPhepDi || !nhin.baiCuaToi) return [];
    const bai = Array.from({ length: n }, (_, g) => (g === toi ? [...nhin.baiCuaToi!] : ['3S']));
    const gia: TrangThaiTienLen = {
      soNguoi: n, bai, luotGhe: toi, banTren: nhin.banTren, boLuot: [...nhin.boLuot], daVe: [...nhin.daVe],
      nguoiDiTruoc: nhin.nguoiDiTruoc, laDau: nhin.laBatBuoc ?? '', soNuoc: nhin.soNuoc, nuocCuoi: nhin.nuocCuoi,
    };
    try {
      return tienLen.cacNuoc(gia).flatMap((m) => (m.loai === 'danh' ? [m.la] : []))
        .sort((a, b) => (nhanBo(a)!.cao - nhanBo(b)!.cao) || a.length - b.length);
    } catch {
      return [];
    }
  }, [choPhepDi, nhin, n, toi]);

  const loiChon = useMemo(() => {
    if (chon.length === 0) return 'Chọn lá để đánh';
    const b = nhanBo(chon);
    if (!b) return 'Bộ này không hợp lệ';
    if (nhin.laBatBuoc && !chon.includes(nhin.laBatBuoc)) return `Nước đầu phải có ${tenLa(nhin.laBatBuoc)}`;
    if (nhin.banTren) {
      const tren = nhanBo(nhin.banTren.la);
      if (tren && !chanDuoc(b, tren)) return 'Không chặn được bài trên bàn';
    }
    return null;
  }, [chon, nhin.banTren, nhin.laBatBuoc]);

  const danh = () => {
    if (!choPhepDi || loiChon) return;
    onDi({ loai: 'danh', la: chon });
    setChon([]);
  };

  // Kích thước lá theo khung
  const W = kt.w, H = kt.h;
  const rongTay = Math.max(W < 500 ? 54 : 44, Math.min(W * 0.1, H * 0.15, 92));
  const buoc = Math.min(rongTay * 0.52, (W * 0.9 - rongTay) / Math.max(1, tay.length - 1));
  const rongNho = Math.max(26, Math.min(rongTay * 0.48, 46));
  const rongGiua = Math.max(42, Math.min(rongTay * 0.86, 88));

  const veDoiThu = (g: number) => {
    const vt = viTriCua(g);
    const info = ghe[g];
    const so = nhin.soLa[g] ?? 0;
    const toiLuot = nhin.luot === g && !nhin.baiLo;
    const ve = nhin.daVe.indexOf(g);
    const hien = nhin.baiLo?.[g];
    const ngang = vt === 'tren';
    const viTriStyle: React.CSSProperties =
      vt === 'tren' ? { top: '3%', left: '50%', transform: 'translateX(-50%)' }
        : vt === 'trai' ? { left: '2.5%', top: '40%', transform: 'translateY(-50%)' }
          : { right: '2.5%', top: '40%', transform: 'translateY(-50%)' };
    return (
      <div key={g} className="absolute z-10 flex flex-col items-center gap-1.5" style={viTriStyle}>
        <div className="relative flex items-center gap-2 rounded-full border border-white/15 bg-black/40 py-1 pl-1 pr-3 backdrop-blur-md" style={{ boxShadow: toiLuot ? '0 0 0 2px #facc15, 0 0 22px rgba(250,204,21,.5)' : '0 6px 16px rgba(0,0,0,.35)' }}>
          <AnhDaiDien ten={info?.ten || `Ghế ${g + 1}`} src={info?.avatar} kich={30} bot={!!info?.bot} />
          <div className="leading-tight">
            <div className="max-w-[110px] truncate text-xs font-semibold text-white">{info?.ten || `Ghế ${g + 1}`}</div>
            <div className="text-[10px] text-white/60">{ve >= 0 ? `Về ${HANG_VE[ve]}` : `${so} lá`}</div>
          </div>
          {nhin.boLuot[g] && !nhin.baiLo && (
            <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white/80 ring-1 ring-white/20 ${css.boBubble}`}>Bỏ lượt</span>
          )}
        </div>
        <div className="relative" style={{ height: rongNho * 1.4, width: ngang ? rongNho + Math.min(so, 13) * rongNho * 0.22 : rongNho * 1.6 }}>
          {hien
            ? hien.map((la, i) => (
              <div key={la} className="absolute" style={{ left: i * rongNho * 0.36, top: 0 }}>
                <LaBai la={la} rong={rongNho} />
              </div>
            ))
            : Array.from({ length: Math.min(so, 13) }, (_, i) => (
              <div key={i} className="absolute" style={{ left: ngang ? i * rongNho * 0.22 : i * rongNho * 0.05, top: ngang ? 0 : 0, transform: ngang ? undefined : `rotate(${(i - so / 2) * 2}deg)`, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }}>
                <LungBai rong={rongNho} />
              </div>
            ))}
          {so > 0 && !hien && (
            <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 px-1.5 text-[11px] font-black text-slate-900 shadow-lg">{so}</span>
          )}
        </div>
      </div>
    );
  };

  const vtNguoiDanh = nhin.banTren ? viTriCua(nhin.banTren.ghe) : 'duoi';
  const [bx, by, br] = HUONG_BAY[vtNguoiDanh];

  return (
    <div ref={khungRef} className="relative h-full w-full select-none overflow-hidden" style={{ borderRadius: 28 }}>
      {/* bàn nỉ */}
      <div
        className="absolute inset-[2%]"
        style={{
          borderRadius: '42% / 34%',
          background: 'linear-gradient(160deg, #6b3a1d, #3a1d0b)',
          boxShadow: '0 40px 70px -30px rgba(0,0,0,.85), inset 0 2px 0 rgba(255,220,180,.3), inset 0 -4px 0 rgba(0,0,0,.4)',
          padding: '1.6%',
        }}
      >
        <div
          className="h-full w-full"
          style={{
            borderRadius: '42% / 34%',
            background: 'radial-gradient(ellipse at 50% 42%, #1f8a5b 0%, #136b45 45%, #0b4a30 100%)',
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08), inset 0 18px 50px rgba(0,0,0,.45)',
          }}
        >
          <div
            aria-hidden
            className="h-full w-full"
            style={{ borderRadius: 'inherit', background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.018) 0 2px, transparent 2px 5px)' }}
          />
        </div>
      </div>

      {Array.from({ length: n }, (_, g) => g).filter((g) => g !== toi).map(veDoiThu)}

      {/* giữa bàn */}
      <div className="absolute left-1/2 top-[40%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
        {nhin.banTren ? (
          <>
            <div key={nhin.soNuoc} className="relative flex" style={{ height: rongGiua * 1.4 }}>
              {nhin.banTren.la.map((la, i, ds) => (
                <div
                  key={la}
                  className={css.baiBay}
                  style={{
                    marginLeft: i === 0 ? 0 : -rongGiua * 0.45,
                    ['--tu-x' as string]: bx,
                    ['--tu-y' as string]: by,
                    ['--tu-r' as string]: br,
                    ['--r' as string]: `${(i - (ds.length - 1) / 2) * 4}deg`,
                    animationDelay: `${i * 35}ms`,
                    filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.4))',
                  }}
                >
                  <LaBai la={la} rong={rongGiua} />
                </div>
              ))}
            </div>
            <span className="rounded-full bg-black/35 px-3 py-0.5 text-[11px] font-semibold text-emerald-50/90 ring-1 ring-white/10">
              {ghe[nhin.banTren.ghe]?.ten || `Ghế ${nhin.banTren.ghe + 1}`} · {TEN_LOAI[nhin.banTren.loai] ?? ''}
            </span>
          </>
        ) : (
          !nhin.baiLo && (
            <span className="rounded-full bg-black/30 px-4 py-1.5 text-xs font-semibold text-emerald-50/80 ring-1 ring-white/10">
              {nhin.luot === toi ? (nhin.laBatBuoc ? `Bạn đi trước — phải có ${tenLa(nhin.laBatBuoc)}` : 'Bạn được đi tự do') : 'Vòng mới'}
            </span>
          )
        )}
      </div>

      {chat && (
        <div
          key={chat.id}
          className={`pointer-events-none absolute left-1/2 top-[40%] z-40 ${css.chat}`}
          style={{
            fontSize: Math.max(44, Math.min(W, H) * 0.14),
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#fff7ed',
            WebkitTextStroke: '2px #b91c1c',
            textShadow: '0 6px 0 #7f1d1d, 0 12px 30px rgba(239,68,68,.65)',
            letterSpacing: '-0.02em',
          }}
        >
          {chat.chu}
        </div>
      )}

      {/* tay mình */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center">
        {nhin.boLuot[toi] && !nhin.baiLo && (
          <span className={`mb-1 rounded-full bg-slate-900/80 px-3 py-0.5 text-[11px] font-bold text-white/80 ring-1 ring-white/15 ${css.boBubble}`}>Bạn đã bỏ lượt vòng này</span>
        )}
        {nhin.baiCuaToi && !nhin.baiLo && (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2 px-2">
            <button type="button" className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur-md hover:bg-black/55" onClick={() => setSapTheoChat((x) => !x)}>
              Sắp xếp: {sapTheoChat ? 'theo chất' : 'theo số'}
            </button>
            <button
              type="button"
              disabled={!choPhepDi || cacNuoc.length === 0}
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-amber-200 backdrop-blur-md hover:bg-black/55 disabled:opacity-40"
              onClick={() => {
                if (!cacNuoc.length) return;
                setChon(cacNuoc[goiY % cacNuoc.length]);
                setGoiY((x) => x + 1);
              }}
            >
              Gợi ý
            </button>
            <button
              type="button"
              disabled={!choPhepDi || !nhin.banTren}
              className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-slate-700 disabled:opacity-40"
              onClick={() => { setChon([]); onDi({ loai: 'bo' }); }}
            >
              Bỏ lượt
            </button>
            <button
              type="button"
              disabled={!choPhepDi || !!loiChon}
              title={loiChon ?? undefined}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2 text-sm font-black text-slate-900 shadow-[0_8px_24px_-6px_rgba(251,146,60,.7)] transition hover:brightness-110 active:scale-95 disabled:opacity-40"
              onClick={danh}
            >
              Đánh{chon.length ? ` (${chon.length})` : ''}
            </button>
            {choPhepDi && chon.length > 0 && loiChon && <span className="w-full text-center text-[11px] text-amber-100/80">{loiChon}</span>}
          </div>
        )}
        <div className="relative" style={{ height: rongTay * 1.4 + rongTay * 0.32 + 8, marginBottom: 6, width: Math.max(rongTay, buoc * (tay.length - 1) + rongTay) }}>
          {tay.map((la, i) => {
            const giua = (tay.length - 1) / 2;
            const goc = (i - giua) * Math.min(3.2, 34 / Math.max(1, tay.length));
            // Vòng cung lồi lên: lá giữa cao nhất, hai mép chạm đáy.
            const cong = (Math.abs(i - giua) ** 2 - giua ** 2) * rongTay * 0.012;
            const nhac = chon.includes(la);
            return (
              <button
                key={la}
                type="button"
                className="absolute bottom-0 origin-bottom transition-transform duration-150 ease-out focus-visible:outline-none"
                style={{
                  left: i * buoc,
                  transform: `translateY(${cong - (nhac ? rongTay * 0.32 : 0)}px) rotate(${goc}deg)`,
                  filter: nhac ? 'drop-shadow(0 14px 14px rgba(0,0,0,.5))' : 'drop-shadow(0 4px 5px rgba(0,0,0,.35))',
                  zIndex: i,
                  cursor: nhin.baiCuaToi ? 'pointer' : 'default',
                }}
                onClick={() => setChon((c) => (c.includes(la) ? c.filter((x) => x !== la) : [...c, la]))}
                aria-pressed={nhac}
                aria-label={tenLa(la)}
              >
                <div style={{ borderRadius: rongTay * 0.08, boxShadow: nhac ? '0 0 0 2px #facc15' : undefined }}>
                  <LaBai la={la} rong={rongTay} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
