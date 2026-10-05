'use client';

/**
 * SẢNH ĐỐI KHÁNG (05/10/2026): 4 thẻ trò lớn có minh hoạ 3D vẽ tay (CSS/SVG), mỗi thẻ: Chơi với máy
 * (cấp 1–3), Ghép nhanh, Tạo phòng & mời. Ô "Vào bằng mã". Cột phải: bạn bè đang online (Mời),
 * bảng xếp hạng Elo theo trò (tab), lịch sử ván của tôi.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Zap, UserPlus, Swords, Trophy, History, Users, Loader2, X, LogIn, Crown } from 'lucide-react';
import type { CapDoBot, MaTro } from '@/lib/doiKhang/luat';
import * as dk from '@/lib/doiKhang/client';
import type { BanOnline, DongXepHang, HangCuaToi, VanCuaToi } from '@/lib/doiKhang/client';
import { useAuthStore } from '@/store/authStore';
import { AnhDaiDien, CHIP, MAU_TRO, MO_TA_TRO, NUT_KINH, TEN_TRO, lyDoChu } from './chung';
import { MinhHoaCaro, MinhHoaCoTuong, MinhHoaCoVua, MinhHoaTienLen } from './MinhHoa';
import css from './doiKhang.module.css';

const TRO: MaTro[] = ['co-vua', 'co-tuong', 'tien-len', 'caro'];
const MINH_HOA: Record<MaTro, () => JSX.Element> = {
  'co-vua': MinhHoaCoVua,
  'co-tuong': MinhHoaCoTuong,
  'tien-len': MinhHoaTienLen,
  caro: MinhHoaCaro,
};
const THOI_GIAN: Record<MaTro, { phut: number; congGiay: number }> = {
  'co-vua': { phut: 10, congGiay: 0 },
  'co-tuong': { phut: 15, congGiay: 0 },
  'tien-len': { phut: 5, congGiay: 3 },
  caro: { phut: 5, congGiay: 0 },
};
const TEN_CAP = ['', 'Dễ', 'Vừa', 'Khó'];

function TheTro({
  tro, daDangNhap, onGhep, onTao, dangBan,
}: {
  tro: MaTro; daDangNhap: boolean; onGhep: (t: MaTro) => void; onTao: (t: MaTro) => void; dangBan: boolean;
}) {
  const router = useRouter();
  const [cap, setCap] = useState<CapDoBot>(2);
  const [soBot, setSoBot] = useState(3);
  const [ben, setBen] = useState<'0' | '1' | 'r'>('r');
  const mau = MAU_TRO[tro];
  const MH = MINH_HOA[tro];
  const choiMay = () => {
    const q = new URLSearchParams({ choi: tro, cap: String(cap) });
    if (tro === 'tien-len') q.set('bot', String(soBot));
    else if (ben !== 'r') q.set('ben', ben);
    router.push(`/games/doi-khang?${q}`);
  };
  const tenBen = tro === 'co-vua' ? ['Trắng', 'Đen'] : tro === 'co-tuong' ? ['Đỏ', 'Đen'] : ['X', 'O'];
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0d22]/80 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-colors hover:border-white/20"
    >
      <div className="relative h-52 overflow-hidden" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${mau.b}55, transparent 70%), linear-gradient(180deg, #17142f, #0f0d22)` }}>
        <MH />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-md">
          {tro === 'tien-len' ? '2–4 người' : '2 người'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold" style={{ color: mau.a }}>{TEN_TRO[tro]}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/55">{MO_TA_TRO[tro]}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-white/45">Máy:</span>
          <div className="flex rounded-xl border border-white/10 bg-black/25 p-0.5">
            {([1, 2, 3] as CapDoBot[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCap(c)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${cap === c ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}
              >
                {TEN_CAP[c]}
              </button>
            ))}
          </div>
          {tro === 'tien-len' ? (
            <div className="flex rounded-xl border border-white/10 bg-black/25 p-0.5">
              {[1, 2, 3].map((n) => (
                <button key={n} type="button" onClick={() => setSoBot(n)} className={`rounded-lg px-2.5 py-1 font-semibold transition ${soBot === n ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}>
                  {n} máy
                </button>
              ))}
            </div>
          ) : (
            <div className="flex rounded-xl border border-white/10 bg-black/25 p-0.5">
              {(['0', '1', 'r'] as const).map((b) => (
                <button key={b} type="button" onClick={() => setBen(b)} className={`rounded-lg px-2.5 py-1 font-semibold transition ${ben === b ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}>
                  {b === 'r' ? 'Ngẫu nhiên' : tenBen[Number(b)]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1.25fr_1fr_1fr] [&>button]:whitespace-nowrap [&>button]:px-2 [&>button]:text-[13px]">
          <button
            type="button"
            onClick={choiMay}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:brightness-110 active:scale-[0.97]"
            style={{ background: `linear-gradient(135deg, ${mau.a}, ${mau.b})` }}
          >
            <Bot className="h-4 w-4" /> Chơi với máy
          </button>
          <button type="button" disabled={dangBan} onClick={() => (daDangNhap ? onGhep(tro) : router.push(`/login?redirect=${encodeURIComponent('/games/doi-khang')}`))} className={NUT_KINH}>
            <Zap className="h-4 w-4 text-amber-300" /> Ghép nhanh
          </button>
          <button type="button" disabled={dangBan} onClick={() => (daDangNhap ? onTao(tro) : router.push(`/login?redirect=${encodeURIComponent('/games/doi-khang')}`))} className={NUT_KINH}>
            <UserPlus className="h-4 w-4 text-violet-300" /> Tạo phòng
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SanhDoiKhang() {
  const router = useRouter();
  const daDangNhap = useAuthStore((s) => s.isAuthenticated && !!s.user);
  const [ma, setMa] = useState('');
  const [tabHang, setTabHang] = useState<MaTro>('co-vua');
  const [hang, setHang] = useState<DongXepHang[] | null>(null);
  const [ban, setBan] = useState<BanOnline[] | null>(null);
  const [cuaToi, setCuaToi] = useState<{ hang: HangCuaToi[]; van: VanCuaToi[] } | null>(null);
  const [ghepTro, setGhepTro] = useState<MaTro | null>(null);
  const [ghepGiay, setGhepGiay] = useState(0);
  const [dangBan, setDangBan] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moiBan, setMoiBan] = useState<BanOnline | null>(null);
  const ghepRef = useRef<MaTro | null>(null);
  ghepRef.current = ghepTro;

  useEffect(() => {
    if (!daDangNhap) { setBan([]); setCuaToi({ hang: [], van: [] }); return; }
    let song = true;
    void dk.layBanOnline().then((b) => song && setBan(b));
    void dk.layCuaToi().then((c) => song && setCuaToi(c));
    const t = setInterval(() => void dk.layBanOnline().then((b) => song && setBan(b)), 30_000);
    return () => { song = false; clearInterval(t); };
  }, [daDangNhap]);

  useEffect(() => {
    let song = true;
    setHang(null);
    void dk.layXepHang(tabHang).then((h) => song && setHang(h));
    return () => { song = false; };
  }, [tabHang]);

  // Ghép nhanh: chờ `dk:ghep-xong`, đếm giây, huỷ khi rời sảnh.
  useEffect(() => {
    if (!ghepTro) return;
    setGhepGiay(0);
    const t = setInterval(() => setGhepGiay((x) => x + 1), 1000);
    const huy = dk.nghe('dk:ghep-xong', (d) => {
      if (d?.maPhong) {
        ghepRef.current = null;
        router.push(`/games/doi-khang?phong=${d.maPhong}`);
      }
    });
    return () => {
      clearInterval(t);
      huy();
    };
  }, [ghepTro, router]);
  useEffect(() => () => { if (ghepRef.current) void dk.huyGhep(ghepRef.current); }, []);
  useEffect(() => {
    if (!loi) return;
    const t = setTimeout(() => setLoi(null), 3500);
    return () => clearTimeout(t);
  }, [loi]);

  const ghep = useCallback(async (tro: MaTro) => {
    setGhepTro(tro);
    const a = await dk.ghep(tro);
    if (!a.ok) { setGhepTro(null); setLoi(a.loi || 'Không ghép được'); return; }
    if (a.maPhong) {
      ghepRef.current = null;
      router.push(`/games/doi-khang?phong=${a.maPhong}`);
    }
  }, [router]);
  const huyGhep = () => {
    if (ghepTro) void dk.huyGhep(ghepTro);
    setGhepTro(null);
  };

  const taoPhong = useCallback(async (tro: MaTro, moiAi?: number) => {
    setDangBan(true);
    const a = await dk.taoPhong({ tro, thoiGian: THOI_GIAN[tro], rieng: true, soGhe: tro === 'tien-len' ? 4 : 2 });
    setDangBan(false);
    if (!a.ok || !a.phong) { setLoi(a.loi || 'Không tạo được phòng'); return; }
    if (moiAi) void dk.moi(a.phong.maPhong, moiAi);
    router.push(`/games/doi-khang?phong=${a.phong.maPhong}`);
  }, [router]);

  const vaoMa = (e: React.FormEvent) => {
    e.preventDefault();
    const m = ma.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (m.length < 4) return setLoi('Mã phòng gồm 6 ký tự');
    router.push(`/games/doi-khang?phong=${m}`);
  };

  return (
    <div className="relative min-h-screen pb-20 text-white" style={{ background: '#05040f', paddingTop: 'var(--app-nav-h, 72px)' }}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-40" style={{ background: 'radial-gradient(closest-side, #7c3aed, transparent)' }} />
        <div className="absolute -right-40 top-10 h-[460px] w-[460px] rounded-full opacity-30" style={{ background: 'radial-gradient(closest-side, #db2777, transparent)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 pb-8 pt-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/games" className="block w-fit text-xs text-white/40 hover:text-white/70">← Trò chơi</Link>
            <div className={`${CHIP} mt-3`}><Swords className="h-3.5 w-3.5 text-fuchsia-300" /> Đối kháng</div>
            <h1 className="mt-3 bg-gradient-to-br from-white via-violet-200 to-fuchsia-300 bg-clip-text text-4xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-5xl">
              Cờ &amp; bài đối kháng
            </h1>
            <p className="mt-3 max-w-xl text-white/55">Chơi với máy ngay, ghép ngẫu nhiên, hoặc mời bạn bè vào phòng riêng — tỷ số, đồng hồ và Elo đầy đủ.</p>
          </div>
          <form onSubmit={vaoMa} className="flex w-full max-w-sm gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-md">
            <input
              value={ma}
              onChange={(e) => setMa(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="Mã phòng, vd K7Q2MX"
              className="min-w-0 flex-1 bg-transparent px-3 font-mono text-lg tracking-[0.2em] text-white placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-white/30 focus:outline-none"
            />
            <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-bold hover:brightness-110">Vào</button>
          </form>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TRO.map((t) => (
              <TheTro key={t} tro={t} daDangNhap={daDangNhap} onGhep={ghep} onTao={(x) => void taoPhong(x)} dangBan={dangBan || !!ghepTro} />
            ))}
          </div>

          <aside className="flex flex-col gap-5">
            {!daDangNhap && (
              <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5">
                <p className="text-sm text-violet-100">Đăng nhập để ghép trận, mời bạn bè và lên bảng xếp hạng Elo. Chơi với máy thì không cần.</p>
                <Link href={`/login?redirect=${encodeURIComponent('/games/doi-khang')}`} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold hover:bg-violet-400">
                  <LogIn className="h-4 w-4" /> Đăng nhập
                </Link>
              </div>
            )}

            {daDangNhap && (
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Users className="h-4 w-4 text-emerald-300" /> Bạn bè</h2>
                {ban === null && <p className="py-4 text-center text-xs text-white/40"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Đang tải…</p>}
                {ban?.length === 0 && <p className="py-3 text-xs text-white/40">Chưa có bạn bè nào. Tạo phòng rồi gửi link mời nhé.</p>}
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {ban?.map((b) => (
                    <div key={b.id} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/[0.04]">
                      <div className="relative">
                        <AnhDaiDien ten={b.ten} src={b.avatar} kich={32} />
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0b0a18] ${b.online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      </div>
                      <span className={`flex-1 truncate text-sm ${b.online ? 'text-white/90' : 'text-white/45'}`}>{b.ten}</span>
                      <button
                        type="button"
                        disabled={!b.online || dangBan}
                        onClick={() => setMoiBan(b)}
                        className="rounded-lg bg-violet-500/25 px-2.5 py-1 text-xs font-semibold text-violet-100 hover:bg-violet-500/40 disabled:opacity-35"
                      >
                        Mời
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Trophy className="h-4 w-4 text-amber-300" /> Xếp hạng Elo</h2>
              <div className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-black/25 p-1">
                {TRO.map((t) => (
                  <button key={t} type="button" onClick={() => setTabHang(t)} className={`rounded-lg py-1 text-[11px] font-semibold transition ${tabHang === t ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/75'}`}>
                    {TEN_TRO[t]}
                  </button>
                ))}
              </div>
              {hang === null && <p className="py-4 text-center text-xs text-white/40"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Đang tải…</p>}
              {hang?.length === 0 && <p className="py-3 text-center text-xs text-white/40">Chưa ai có hạng — đánh ván đầu tiên đi!</p>}
              <ol className="space-y-1">
                {hang?.slice(0, 10).map((h) => (
                  <li key={h.userId} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/[0.04]">
                    <span className={`w-5 text-center font-mono text-xs font-bold ${h.hang === 1 ? 'text-amber-300' : h.hang === 2 ? 'text-slate-300' : h.hang === 3 ? 'text-orange-400' : 'text-white/35'}`}>
                      {h.hang === 1 ? <Crown className="inline h-3.5 w-3.5" /> : h.hang}
                    </span>
                    <AnhDaiDien ten={h.ten} src={h.avatar} kich={26} />
                    <span className="flex-1 truncate text-sm text-white/85">{h.ten}</span>
                    <span className="text-[11px] text-white/35">{h.thang}T·{h.thua}B</span>
                    <span className="w-12 text-right font-mono text-sm font-bold text-white">{h.elo}</span>
                  </li>
                ))}
              </ol>
            </section>

            {daDangNhap && (
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><History className="h-4 w-4 text-sky-300" /> Ván của tôi</h2>
                {cuaToi && cuaToi.hang.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {cuaToi.hang.map((h) => (
                      <span key={h.tro} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/70">
                        {TEN_TRO[h.tro]} <b className="text-white">{h.elo}</b>
                      </span>
                    ))}
                  </div>
                )}
                {cuaToi === null && <p className="py-4 text-center text-xs text-white/40"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Đang tải…</p>}
                {cuaToi?.van.length === 0 && <p className="py-3 text-xs text-white/40">Chưa có ván online nào.</p>}
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {cuaToi?.van.slice(0, 20).map((v) => (
                    <li key={v.id} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-black ${v.ketQua === 'thang' ? 'bg-emerald-500/20 text-emerald-300' : v.ketQua === 'thua' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-white/60'}`}>
                        {v.ketQua === 'thang' ? 'T' : v.ketQua === 'thua' ? 'B' : 'H'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-white/85">{TEN_TRO[v.tro]} · {v.doiThu}{v.coBot ? ' (có máy)' : ''}</div>
                        <div className="text-[11px] text-white/40">
                          {v.lyDo ? lyDoChu(v.lyDo) : ''}{v.soNuoc ? ` · ${v.soNuoc} nước` : ''}{v.luc ? ` · ${new Date(v.luc).toLocaleDateString('vi-VN')}` : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>

      {/* Chọn trò khi mời một bạn */}
      {moiBan && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setMoiBan(null)}>
          <div className={`w-full max-w-sm rounded-3xl border border-white/10 bg-[#110f26] p-5 ${css.noiLen}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <AnhDaiDien ten={moiBan.ten} src={moiBan.avatar} kich={40} />
              <p className="flex-1 text-sm">Mời <b>{moiBan.ten}</b> chơi…</p>
              <button type="button" onClick={() => setMoiBan(null)} className="rounded-lg p-1 text-white/40 hover:bg-white/10"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {TRO.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={dangBan}
                  onClick={() => { const id = moiBan.id; setMoiBan(null); void taoPhong(t, id); }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold hover:bg-white/[0.1]"
                  style={{ color: MAU_TRO[t].a }}
                >
                  {TEN_TRO[t]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Đang ghép */}
      {ghepTro && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/65 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-xs rounded-3xl border border-white/10 bg-[#110f26] p-6 text-center ${css.noiLen}`}>
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-fuchsia-400 motion-reduce:animate-none" style={{ animationDuration: '1.1s' }} />
              <Swords className="absolute inset-0 m-auto h-8 w-8 text-white/80" />
            </div>
            <p className="mt-4 text-lg font-bold">Đang tìm đối thủ…</p>
            <p className="mt-1 text-sm text-white/50">{TEN_TRO[ghepTro]} · {Math.floor(ghepGiay / 60)}:{String(ghepGiay % 60).padStart(2, '0')}</p>
            <button type="button" onClick={huyGhep} className={`${NUT_KINH} mt-5 w-full`}>Huỷ</button>
          </div>
        </div>
      )}

      {loi && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
          <div className={`rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-2xl ${css.noiLen}`}>{loi}</div>
        </div>
      )}
    </div>
  );
}
