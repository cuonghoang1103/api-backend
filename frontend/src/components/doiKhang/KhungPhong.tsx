'use client';

/**
 * KHUNG PHÒNG CHUNG cho mọi trò đối kháng (05/10/2026): thẻ người chơi (avatar, tên, Elo, đồng hồ
 * đếm lùi sáng khi tới lượt), TỶ SỐ to ở giữa, Đầu hàng / Xin hoà / Tái đấu, lịch sử nước, chat
 * nhanh + cảm xúc bay, màn kết quả (pháo giấy khi thắng), Elo +/−, băng "Đang nối lại…", "Chờ
 * đối thủ quay lại (60 s)", phòng chờ (mời bạn, sẵn sàng, thêm máy cho tiến lên).
 */
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Copy, Check, Flag, Handshake, RotateCcw, Maximize2, Minimize2, Volume2, VolumeX,
  Send, Eye, WifiOff, UserPlus, X, Bot, Loader2,
} from 'lucide-react';
import { LUAT, type CapDoBot, type MaTro } from '@/lib/doiKhang/luat';
import type { GheDTO, PhongDTO } from '@/lib/doiKhang/client';
import { layBanOnline, type BanOnline } from '@/lib/doiKhang/client';
import { tatTieng, datTatTieng } from '@/components/games/shared/amThanh';
import { phaoGiay } from '@/components/games/shared/hieuUng';
import type { DieuKhienPhong } from './dieuKhien';
import { AnhDaiDien, CHIP, NUT_CHINH, NUT_KINH, TEN_TRO, MAU_TRO, chuDongHo, lyDoChu } from './chung';
import { amBan } from './amThanhDk';
import BanCoVua from './BanCoVua';
import BanCoTuong from './BanCoTuong';
import BanTienLen from './BanTienLen';
import BanCaro from './BanCaro';
import css from './doiKhang.module.css';

const CAU_MAU = ['Chào bạn! 👋', 'Nước hay đấy!', 'Nhanh lên nào ⏳', 'Suýt nữa thì…', 'Ván nữa nhé?', 'GG 🤝'];
const CAM_XUC = ['👍', '😂', '😮', '😡', '🔥', '🎉', '😭', '🤝'];
const BEN: Record<MaTro, [string, string]> = {
  'co-vua': ['Trắng', 'Đen'],
  'co-tuong': ['Đỏ', 'Đen'],
  caro: ['X', 'O'],
  'tien-len': ['', ''],
};
const HANG_VE = ['Nhất', 'Nhì', 'Ba', 'Bét'];

// ─── Đồng hồ: tự đếm, chỉ chính nó render lại ────────────────────────────────
function DongHo({ ms, moc, chay, tong }: { ms: number; moc: number; chay: boolean; tong: number }) {
  const [, setNhip] = useState(0);
  useEffect(() => {
    if (!chay) return;
    const t = setInterval(() => setNhip((x) => x + 1), 100);
    return () => clearInterval(t);
  }, [chay]);
  const con = Math.max(0, chay ? ms - (Date.now() - moc) : ms);
  const it = con < 20_000;
  const tile = tong > 0 ? Math.min(1, con / tong) : 0;
  return (
    <div
      className="relative overflow-hidden rounded-xl px-3 py-1.5 font-mono text-lg font-bold tabular-nums sm:text-xl"
      style={{
        background: chay ? (it ? 'linear-gradient(135deg,#7f1d1d,#b91c1c)' : 'linear-gradient(135deg,#f8fafc,#e2e8f0)') : 'rgba(255,255,255,.06)',
        color: chay ? (it ? '#fff' : '#0f172a') : 'rgba(255,255,255,.55)',
        boxShadow: chay ? '0 6px 18px -6px rgba(0,0,0,.6), inset 0 -2px 0 rgba(0,0,0,.12)' : 'inset 0 0 0 1px rgba(255,255,255,.08)',
        minWidth: 84,
        textAlign: 'center',
      }}
    >
      {chuDongHo(con)}
      <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: chay ? (it ? '#fecaca' : '#8b5cf6') : 'rgba(255,255,255,.12)', transform: `scaleX(${tile})`, transformOrigin: 'left' }} />
    </div>
  );
}

// ─── Thẻ người chơi ─────────────────────────────────────────────────────────
function TheNguoi({
  g, idx, phong, dk, phai, gon,
}: {
  g: GheDTO; idx: number; phong: PhongDTO; dk: DieuKhienPhong; phai?: boolean; gon?: boolean;
}) {
  const toiLuot = phong.trangThai === 'dang-danh' && phong.van?.luot === idx;
  const coDongHo = phong.dongHo.length > idx && phong.thoiGian.phut > 0 && phong.trangThai !== 'cho';
  const doiElo = phong.doiElo?.[idx];
  const laToi = phong.gheCuaToi === idx;
  const ben = BEN[phong.tro][idx] ?? '';
  const trong = !g.bot && g.userId == null;
  const bong = dk.camXuc.filter((c) => c.ghe === idx);
  const chatCuoi = dk.chat.length ? dk.chat[dk.chat.length - 1] : null;
  const [bongChat, setBongChat] = useState<string | null>(null);
  useEffect(() => {
    if (!chatCuoi || chatCuoi.ghe !== idx) return;
    setBongChat(chatCuoi.text);
    const t = setTimeout(() => setBongChat(null), 3500);
    return () => clearTimeout(t);
  }, [chatCuoi, idx]);

  return (
    <div
      className={`relative flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border px-2 py-2 transition-all sm:flex-row sm:gap-3 sm:px-3 sm:py-2.5 ${phai ? 'sm:flex-row-reverse sm:text-right' : ''}`}
      style={{
        borderColor: toiLuot ? 'rgba(250,204,21,.6)' : 'rgba(255,255,255,.08)',
        background: toiLuot ? 'linear-gradient(135deg, rgba(250,204,21,.14), rgba(139,92,246,.12))' : 'rgba(255,255,255,.04)',
        boxShadow: toiLuot ? '0 0 0 1px rgba(250,204,21,.25), 0 10px 30px -12px rgba(250,204,21,.45)' : '0 8px 24px -16px rgba(0,0,0,.8)',
      }}
    >
      <div className="relative">
        <AnhDaiDien ten={g.ten || 'Ghế trống'} src={g.avatar} kich={gon ? 34 : 44} bot={!!g.bot} />
        {!g.bot && g.userId != null && dk.kieu === 'online' && (
          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#0b0a1a] ${g.online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        )}
        {/* cảm xúc bay lên */}
        {bong.map((c, i) => (
          <span
            key={c.id}
            className={`pointer-events-none absolute left-1/2 top-0 z-50 -ml-4 text-3xl ${css.camXuc}`}
            style={{ ['--lech' as string]: `${(i % 3 - 1) * 18}px` }}
          >
            {c.emoji}
          </span>
        ))}
      </div>
      <div className="w-full min-w-0 flex-1 text-center sm:w-auto sm:text-left">
        <div className={`flex items-center justify-center gap-1.5 ${phai ? 'sm:justify-end' : 'sm:justify-start'}`}>
          <span className="truncate text-sm font-semibold text-white">{trong ? 'Ghế trống' : g.ten}</span>
          {laToi && <span className="rounded bg-violet-500/30 px-1.5 text-[10px] font-bold text-violet-100">BẠN</span>}
        </div>
        <div className={`mt-0.5 hidden items-center gap-2 text-[11px] text-white/55 sm:flex ${phai ? 'justify-end' : ''}`}>
          {ben && <span>{ben}</span>}
          {g.bot ? <span>Máy</span> : g.elo != null ? <span>Elo {g.elo}</span> : null}
          {doiElo != null && doiElo !== 0 && (
            <span className={`font-bold ${doiElo > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{doiElo > 0 ? `+${doiElo}` : doiElo}</span>
          )}
          {phong.trangThai === 'cho' && !trong && !g.bot && (
            <span className={g.sanSang ? 'text-emerald-400' : 'text-amber-300'}>{g.sanSang ? 'Sẵn sàng' : 'Chưa sẵn sàng'}</span>
          )}
          {phong.trangThai === 'xong' && g.taiDau && !g.bot && <span className="text-sky-300">Muốn tái đấu</span>}
        </div>
      </div>
      {coDongHo && !gon && <DongHo ms={phong.dongHo[idx]} moc={phong.dongHoLuc} chay={toiLuot && !phong.ketQua} tong={phong.thoiGian.phut * 60_000} />}
      {bongChat && (
        <div className={`absolute top-full z-40 mt-2 max-w-[220px] rounded-2xl bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xl ${phai ? 'right-4' : 'left-4'} ${css.noiLen}`}>
          {bongChat}
        </div>
      )}
    </div>
  );
}

// ─── Lịch sử nước ───────────────────────────────────────────────────────────
function LichSu({ ds, tro }: { ds: string[]; tro: MaTro }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ds.length]);
  const cap = tro !== 'tien-len';
  const hang: string[][] = [];
  if (cap) for (let i = 0; i < ds.length; i += 2) hang.push([ds[i], ds[i + 1] ?? '']);
  return (
    <div ref={ref} className="max-h-48 min-h-[96px] overflow-y-auto pr-1 text-[13px] lg:max-h-none lg:flex-1">
      {ds.length === 0 && <p className="py-6 text-center text-xs text-white/35">Chưa có nước nào</p>}
      {cap
        ? hang.map(([a, b], i) => (
          <div key={i} className={`grid grid-cols-[28px_1fr_1fr] gap-1 rounded-md px-1.5 py-0.5 ${i % 2 ? 'bg-white/[0.03]' : ''}`}>
            <span className="text-white/35">{i + 1}.</span>
            <span className={`font-mono ${i * 2 === ds.length - 1 ? 'text-amber-300' : 'text-white/85'}`}>{a}</span>
            <span className={`font-mono ${i * 2 + 1 === ds.length - 1 ? 'text-amber-300' : 'text-white/85'}`}>{b}</span>
          </div>
        ))
        : ds.map((m, i) => (
          <div key={i} className={`flex gap-2 rounded-md px-1.5 py-0.5 ${i % 2 ? 'bg-white/[0.03]' : ''}`}>
            <span className="w-6 text-white/35">{i + 1}.</span>
            <span className={i === ds.length - 1 ? 'text-amber-300' : 'text-white/85'}>{m}</span>
          </div>
        ))}
    </div>
  );
}

// ─── Chat ───────────────────────────────────────────────────────────────────
function KhungChat({ dk }: { dk: DieuKhienPhong }) {
  const [chu, setChu] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [dk.chat.length]);
  const gui = (t: string) => {
    if (!t.trim()) return;
    dk.guiChat(t);
    amBan('chat');
  };
  return (
    <div className="flex flex-col gap-2">
      <div ref={ref} className="max-h-32 min-h-[52px] space-y-1 overflow-y-auto text-[13px]">
        {dk.chat.length === 0 && <p className="text-xs text-white/35">Chào hỏi đối thủ một câu nhé.</p>}
        {dk.chat.map((c) => (
          <div key={c.id} className={c.cuaToi ? 'text-right' : ''}>
            <span className={`inline-block max-w-[85%] rounded-2xl px-2.5 py-1 ${c.cuaToi ? 'bg-violet-500/30 text-violet-50' : 'bg-white/[0.07] text-white/85'}`}>
              {!c.cuaToi && <b className="mr-1 text-white/60">{c.ten}:</b>}
              {c.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CAU_MAU.map((c) => (
          <button key={c} type="button" onClick={() => gui(c)} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/75 hover:bg-white/[0.12]">
            {c}
          </button>
        ))}
      </div>
      <form
        className="flex gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          gui(chu);
          setChu('');
        }}
      >
        <input
          value={chu}
          onChange={(e) => setChu(e.target.value)}
          maxLength={200}
          placeholder="Nhắn gì đó…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
        />
        <button type="submit" className="grid w-10 place-items-center rounded-xl bg-violet-500/80 text-white hover:bg-violet-500" aria-label="Gửi">
          <Send className="h-4 w-4" />
        </button>
      </form>
      <div className="flex justify-between">
        {CAM_XUC.map((e) => (
          <button key={e} type="button" onClick={() => dk.guiCamXuc(e)} className="grid h-9 w-9 place-items-center rounded-xl text-xl transition hover:scale-125 hover:bg-white/10" aria-label={`Thả ${e}`}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Phòng chờ (online) ─────────────────────────────────────────────────────
function PhongCho({ phong, dk }: { phong: PhongDTO; dk: DieuKhienPhong }) {
  const [ban, setBan] = useState<BanOnline[] | null>(null);
  const [daMoi, setDaMoi] = useState<Record<number, 'dang' | 'xong' | 'loi'>>({});
  const [daChep, setDaChep] = useState(false);
  const [capBot, setCapBot] = useState<CapDoBot>(2);
  useEffect(() => {
    let song = true;
    void layBanOnline().then((b) => song && setBan(b));
    return () => { song = false; };
  }, []);
  const link = typeof window !== 'undefined' ? `${window.location.origin}/games/doi-khang?phong=${phong.maPhong}` : '';
  const toi = phong.gheCuaToi;
  const gheToi = toi != null ? phong.ghe[toi] : null;
  const laChu = dk.kieu === 'online' && phong.chuId != null && gheToi?.userId === phong.chuId;
  const daNgoi = new Set(phong.ghe.map((g) => g.userId).filter(Boolean));
  const conTrong = phong.ghe.some((g) => g.userId == null && !g.bot);

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-[#05040f]/70 p-3 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl border border-white/10 bg-[#100e24]/95 p-5 shadow-2xl ${css.noiLen}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Phòng chờ · {TEN_TRO[phong.tro]}</p>
            <p className="mt-1 font-mono text-3xl font-black tracking-[0.2em] text-white">{phong.maPhong}</p>
          </div>
          <button
            type="button"
            className={NUT_KINH}
            onClick={() => {
              void navigator.clipboard?.writeText(link).then(() => {
                setDaChep(true);
                setTimeout(() => setDaChep(false), 1600);
              });
            }}
          >
            {daChep ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {daChep ? 'Đã chép' : 'Chép link mời'}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {phong.ghe.map((g, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2">
              <AnhDaiDien ten={g.ten || '?'} src={g.avatar} kich={32} bot={!!g.bot} />
              <span className="flex-1 truncate text-sm text-white/90">{g.bot ? g.ten : g.userId == null ? <i className="text-white/40">Ghế trống — đang chờ…</i> : g.ten}</span>
              {g.bot ? (
                laChu && dk.boBot ? (
                  <button type="button" className="text-xs text-rose-300 hover:underline" onClick={() => dk.boBot!(i)}>Bỏ máy</button>
                ) : <span className="text-xs text-white/40">Máy</span>
              ) : g.userId != null ? (
                <span className={`text-xs font-semibold ${g.sanSang ? 'text-emerald-400' : 'text-amber-300'}`}>{g.sanSang ? 'Sẵn sàng' : 'Chưa'}</span>
              ) : null}
            </div>
          ))}
        </div>

        {phong.tro === 'tien-len' && laChu && dk.themBot && (conTrong || phong.ghe.length < 4) && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-white/15 p-2">
            <Bot className="h-4 w-4 text-white/50" />
            <span className="text-xs text-white/60">Thêm máy</span>
            <div className="ml-auto flex gap-1">
              {([1, 2, 3] as CapDoBot[]).map((c) => (
                <button key={c} type="button" onClick={() => setCapBot(c)} className={`rounded-lg px-2 py-1 text-[11px] ${capBot === c ? 'bg-emerald-500/30 text-emerald-100' : 'text-white/50 hover:bg-white/5'}`}>
                  {c === 1 ? 'Dễ' : c === 2 ? 'Vừa' : 'Khó'}
                </button>
              ))}
              <button type="button" className="rounded-lg bg-emerald-500/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500" onClick={() => dk.themBot!(capBot)}>
                + Ngồi
              </button>
            </div>
          </div>
        )}

        {gheToi && dk.sanSang && (
          <button type="button" className={`${gheToi.sanSang ? NUT_KINH : NUT_CHINH} mt-4 w-full`} onClick={() => dk.sanSang!(!gheToi.sanSang)}>
            {gheToi.sanSang ? 'Huỷ sẵn sàng' : 'Sẵn sàng'}
          </button>
        )}
        {!gheToi && <p className="mt-4 text-center text-sm text-white/50"><Eye className="mr-1 inline h-4 w-4" />Bàn đã đủ người — bạn đang xem.</p>}

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Mời bạn bè</p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {ban === null && <p className="py-3 text-center text-xs text-white/40"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Đang tải…</p>}
            {ban?.length === 0 && <p className="py-3 text-center text-xs text-white/40">Chưa có bạn bè nào — gửi link mời ở trên nhé.</p>}
            {ban?.map((b) => {
              const tt = daMoi[b.id];
              return (
                <div key={b.id} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/[0.04]">
                  <div className="relative">
                    <AnhDaiDien ten={b.ten} src={b.avatar} kich={30} />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#100e24] ${b.online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  </div>
                  <span className="flex-1 truncate text-sm text-white/85">{b.ten}</span>
                  <button
                    type="button"
                    disabled={!b.online || daNgoi.has(b.id) || tt === 'dang' || tt === 'xong' || !dk.moiBan}
                    className="inline-flex items-center gap-1 rounded-lg bg-violet-500/25 px-2.5 py-1 text-xs font-semibold text-violet-100 hover:bg-violet-500/40 disabled:opacity-40"
                    onClick={() => {
                      setDaMoi((m) => ({ ...m, [b.id]: 'dang' }));
                      void dk.moiBan!(b.id).then((a) => setDaMoi((m) => ({ ...m, [b.id]: a.ok ? 'xong' : 'loi' })));
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {daNgoi.has(b.id) ? 'Đã vào' : tt === 'xong' ? 'Đã mời' : tt === 'loi' ? 'Mời lại' : b.online ? 'Mời' : 'Offline'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Màn kết quả ────────────────────────────────────────────────────────────
function ManKetQua({ phong, dk, onDong }: { phong: PhongDTO; dk: DieuKhienPhong; onDong: () => void }) {
  const kq = phong.ketQua!;
  const toi = phong.gheCuaToi;
  const viTri = kq.thuHang && toi != null ? kq.thuHang.indexOf(toi) : -1;
  const thang = toi != null && kq.thang.includes(toi);
  const tieuDe = toi == null
    ? kq.hoa ? 'Hoà' : `${phong.ghe[kq.thang[0]]?.ten ?? 'Ai đó'} thắng`
    : kq.hoa ? 'Hoà!' : phong.tro === 'tien-len' && viTri >= 0 ? `Bạn về ${HANG_VE[viTri] ?? viTri + 1}` : thang ? 'Bạn thắng!' : 'Bạn thua';
  const doiElo = toi != null ? phong.doiElo?.[toi] : undefined;
  const gheToi = toi != null ? phong.ghe[toi] : null;
  const mau = kq.hoa ? '#a5b4fc' : thang ? '#facc15' : '#94a3b8';
  return (
    <div className="absolute inset-0 z-40 grid place-items-center rounded-3xl bg-[#05040f]/35 p-4">
      <div className={`relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#110f26]/95 p-6 text-center shadow-2xl ${css.noiLen}`}>
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-40" style={{ background: `radial-gradient(closest-side, ${mau}, transparent)` }} />
        <button type="button" onClick={onDong} className="absolute right-3 top-3 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white" aria-label="Đóng">
          <X className="h-4 w-4" />
        </button>
        <p className="relative text-4xl font-black tracking-tight" style={{ color: mau, textShadow: `0 6px 30px ${mau}55` }}>{tieuDe}</p>
        <p className="relative mt-1 text-sm text-white/55">{lyDoChu(kq.lyDo)}</p>
        {phong.tiSo.length === 2 && (
          <p className="relative mt-4 font-mono text-3xl font-black text-white">
            {phong.tiSo[toi === 1 ? 1 : 0]} <span className="text-white/30">–</span> {phong.tiSo[toi === 1 ? 0 : 1]}
          </p>
        )}
        {dk.kieu === 'online' && toi != null && (
          <p className="relative mt-2 text-sm">
            {doiElo != null ? (
              <span className={`font-bold ${doiElo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>Elo {doiElo >= 0 ? `+${doiElo}` : doiElo}{gheToi?.elo != null ? ` → ${gheToi.elo}` : ''}</span>
            ) : phong.ghe.some((g) => g.bot) ? (
              <span className="text-white/40">Ván có máy — không tính Elo</span>
            ) : (
              <span className="text-white/40"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Đang tính Elo…</span>
            )}
          </p>
        )}
        {dk.kieu === 'may' && <p className="relative mt-2 text-xs text-white/40">Ván với máy không tính Elo</p>}
        <div className="relative mt-6 flex gap-2">
          {toi != null && (
            <button type="button" className={`${NUT_CHINH} flex-1`} onClick={dk.taiDau} disabled={!!gheToi?.taiDau}>
              <RotateCcw className="h-4 w-4" />
              {gheToi?.taiDau ? 'Đang chờ…' : 'Tái đấu'}
            </button>
          )}
          <Link href="/games/doi-khang" className={`${NUT_KINH} flex-1`}>Về sảnh</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Khung chính ────────────────────────────────────────────────────────────
export default function KhungPhong({ dk }: { dk: DieuKhienPhong }) {
  const phong = dk.phong;
  const rootRef = useRef<HTMLDivElement>(null);
  const [toanMan, setToanMan] = useState(false);
  const [tat, setTat] = useState(false);
  const [anKetQua, setAnKetQua] = useState(false);
  const [daChep, setDaChep] = useState(false);
  const [xacNhanThua, setXacNhanThua] = useState(false);
  const [bayGio, setBayGio] = useState(() => Date.now());

  useEffect(() => {
    setTat(tatTieng());
    const f = (e: Event) => setTat(!!(e as CustomEvent).detail?.tat);
    window.addEventListener('game:tieng', f);
    const fs = () => setToanMan(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fs);
    return () => {
      window.removeEventListener('game:tieng', f);
      document.removeEventListener('fullscreenchange', fs);
    };
  }, []);

  // Âm thanh + hiệu ứng theo diễn biến ván (đọc thế trước qua ref, không side effect trong updater).
  const henLuotRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (henLuotRef.current) clearTimeout(henLuotRef.current); }, []);
  const truocRef = useRef<{ soNuoc: number; nhin: unknown; ketQua: unknown; luot: number }>({ soNuoc: -1, nhin: null, ketQua: null, luot: -2 });
  useEffect(() => {
    if (!phong?.van) return;
    const t = truocRef.current;
    const v = phong.van;
    const tro = phong.tro;
    if (t.soNuoc >= 0 && v.soNuoc === t.soNuoc + 1 && tro !== 'tien-len') {
      const dem = (n: unknown) => ((n as { ban?: (string | number | null)[] })?.ban ?? []).filter((x) => x).length;
      const an = tro !== 'caro' && dem(v.nhin) < dem(t.nhin);
      const chieu = !!(v.nhin as { chieu?: boolean }).chieu;
      amBan(chieu ? 'chieu' : an ? 'an' : 'di');
    }
    if (v.luot >= 0 && v.luot === phong.gheCuaToi && t.luot !== v.luot && !phong.ketQua && v.soNuoc > 0) {
      if (henLuotRef.current) clearTimeout(henLuotRef.current);
      henLuotRef.current = setTimeout(() => amBan('toiLuot'), 260);
    }
    if (phong.ketQua && !t.ketQua && t.soNuoc >= 0) {
      const toi = phong.gheCuaToi;
      const kq = phong.ketQua;
      const thang = toi != null && kq.thang.includes(toi);
      if (kq.hoa) amBan('hoa');
      else if (thang) {
        amBan('thang');
        phaoGiay(rootRef.current);
      } else if (toi != null) amBan('thua');
      setAnKetQua(false);
    }
    truocRef.current = { soNuoc: v.soNuoc, nhin: v.nhin, ketQua: phong.ketQua, luot: v.luot };
  }, [phong]);

  // Đối thủ rời mạng giữa ván — đếm 60 s.
  const roiLucRef = useRef(new Map<number, number>());
  const nguoiRoi = useMemo(() => {
    if (!phong || dk.kieu !== 'online' || phong.trangThai !== 'dang-danh') return null;
    return phong.ghe.findIndex((g, i) => i !== phong.gheCuaToi && !g.bot && g.userId != null && !g.online);
  }, [phong, dk.kieu]);
  useEffect(() => {
    const m = roiLucRef.current;
    if (nguoiRoi == null || nguoiRoi < 0) { m.clear(); return; }
    if (!m.has(nguoiRoi)) m.set(nguoiRoi, Date.now());
    const t = setInterval(() => setBayGio(Date.now()), 500);
    return () => clearInterval(t);
  }, [nguoiRoi]);

  const toanManHinh = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else void el.requestFullscreen?.().catch(() => undefined);
  }, []);

  if (dk.hong) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
        <div>
          <p className="text-2xl font-bold text-white">{dk.hong}</p>
          <Link href="/games/doi-khang" className={`${NUT_CHINH} mt-6`}>Về sảnh đối kháng</Link>
        </div>
      </div>
    );
  }
  if (!phong) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24 text-white/60">
        <p><Loader2 className="mr-2 inline h-5 w-5 animate-spin" />Đang vào phòng…</p>
      </div>
    );
  }

  const tro = phong.tro;
  const mau = MAU_TRO[tro];
  const toi = phong.gheCuaToi;
  const nhin = phong.van?.nhin;
  const choPhepDi = phong.trangThai === 'dang-danh' && toi != null && phong.van?.luot === toi && !phong.ketQua && dk.ketNoi;
  const haiNguoi = phong.ghe.length === 2;
  const trai = haiNguoi ? (toi === 1 ? 0 : 1) : 0;
  const phai = haiNguoi ? (toi === 1 ? 1 : 0) : 0;
  const coMay = phong.ghe.some((g) => g.bot);
  const xinHoaDen = phong.xinHoa != null && toi != null && phong.xinHoa !== toi && phong.trangThai === 'dang-danh';
  const doiTaiDau = phong.trangThai === 'xong' && phong.ghe.some((g, i) => i !== toi && g.taiDau && !g.bot);
  const luot = phong.van?.luot ?? -1;
  const tenLuot = luot >= 0 ? phong.ghe[luot]?.ten : '';
  const conLaiRoi = nguoiRoi != null && nguoiRoi >= 0 ? Math.max(0, 60 - Math.floor((bayGio - (roiLucRef.current.get(nguoiRoi) ?? bayGio)) / 1000)) : 0;
  const link = typeof window !== 'undefined' ? `${window.location.origin}/games/doi-khang?phong=${phong.maPhong}` : '';

  let ban: React.ReactNode = null;
  if (nhin) {
    if (tro === 'co-vua') ban = <BanCoVua nhin={nhin as never} gheCuaToi={toi} choPhepDi={choPhepDi} onDi={dk.diNuoc} />;
    else if (tro === 'co-tuong') ban = <BanCoTuong nhin={nhin as never} gheCuaToi={toi} choPhepDi={choPhepDi} onDi={dk.diNuoc} />;
    else if (tro === 'caro') ban = <BanCaro nhin={nhin as never} gheCuaToi={toi} choPhepDi={choPhepDi} onDi={dk.diNuoc} />;
    else ban = <BanTienLen nhin={nhin as never} ghe={phong.ghe} choPhepDi={choPhepDi} onDi={dk.diNuoc} />;
  } else {
    // Phòng chờ chưa có ván: vẽ bàn khởi đầu cho đẹp (không bấm được).
    const s0 = LUAT[tro].khoiTao(Math.max(2, phong.ghe.length), 1);
    const n0 = LUAT[tro].nhinTu(s0, toi ?? 0);
    if (tro === 'co-vua') ban = <BanCoVua nhin={n0 as never} gheCuaToi={toi} choPhepDi={false} onDi={() => undefined} />;
    else if (tro === 'co-tuong') ban = <BanCoTuong nhin={n0 as never} gheCuaToi={toi} choPhepDi={false} onDi={() => undefined} />;
    else if (tro === 'caro') ban = <BanCaro nhin={n0 as never} gheCuaToi={toi} choPhepDi={false} onDi={() => undefined} />;
    else ban = <div className="h-full w-full rounded-[28px] bg-[radial-gradient(ellipse_at_50%_42%,#1f8a5b,#0b4a30)] opacity-60" />;
  }

  const trangThaiChu =
    phong.trangThai === 'cho' ? 'Đang chờ người chơi…'
      : phong.ketQua ? (phong.ketQua.hoa ? 'Ván hoà' : `${phong.ghe[phong.ketQua.thang[0]]?.ten ?? ''} thắng · ${lyDoChu(phong.ketQua.lyDo)}`)
        : choPhepDi ? 'Tới lượt bạn'
          : toi == null ? `Lượt của ${tenLuot}`
            : dk.dangNghi || phong.ghe[luot]?.bot ? `${tenLuot} đang nghĩ…` : `Chờ ${tenLuot} đi…`;

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col text-white lg:h-[100dvh]"
      style={{
        minHeight: '100dvh',
        paddingTop: toanMan ? 0 : 'var(--app-nav-h, 72px)',
        background: `radial-gradient(1200px 600px at 15% -10%, ${mau.b}33, transparent 60%), radial-gradient(900px 500px at 100% 0%, #8b5cf622, transparent 60%), #07061a`,
      }}
    >
      {/* thanh trên */}
      <div className="flex flex-wrap items-center gap-2 px-3 pt-3 sm:px-5">
        <Link href="/games/doi-khang" className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Sảnh
        </Link>
        <h1 className="text-lg font-bold" style={{ color: mau.a }}>{TEN_TRO[tro]}</h1>
        <span className={CHIP}>{dk.nhanCheDo}</span>
        {dk.kieu === 'online' && (
          <button
            type="button"
            className={`${CHIP} hover:bg-white/10`}
            onClick={() => void navigator.clipboard?.writeText(link).then(() => { setDaChep(true); setTimeout(() => setDaChep(false), 1500); })}
          >
            {daChep ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {daChep ? 'Đã chép link' : 'Link mời'}
          </button>
        )}
        {phong.nguoiXem > 0 && <span className={CHIP}><Eye className="h-3.5 w-3.5" /> {phong.nguoiXem}</span>}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className="rounded-xl p-2 text-white/70 hover:bg-white/10" onClick={() => datTatTieng(!tat)} aria-label={tat ? 'Bật tiếng' : 'Tắt tiếng'}>
            {tat ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button type="button" className="rounded-xl p-2 text-white/70 hover:bg-white/10" onClick={toanManHinh} aria-label="Toàn màn hình">
            {toanMan ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* băng trạng thái mạng */}
      {!dk.ketNoi && (
        <div className="mx-3 mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500/15 py-1.5 text-sm text-amber-200 ring-1 ring-amber-400/30 sm:mx-5">
          <WifiOff className="h-4 w-4" /> Đang nối lại…
        </div>
      )}
      {nguoiRoi != null && nguoiRoi >= 0 && (
        <div className="mx-3 mt-2 flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 py-1.5 text-sm text-sky-200 ring-1 ring-sky-400/25 sm:mx-5">
          <Loader2 className="h-4 w-4 animate-spin" /> Chờ {phong.ghe[nguoiRoi]?.ten || 'đối thủ'} quay lại ({conLaiRoi} s)
        </div>
      )}
      {xinHoaDen && (
        <div className={`mx-3 mt-2 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-indigo-500/15 px-3 py-2 text-sm text-indigo-100 ring-1 ring-indigo-400/30 sm:mx-5 ${css.noiLen}`}>
          <Handshake className="h-4 w-4" /> {phong.ghe[phong.xinHoa!]?.ten} xin hoà.
          <button type="button" className="rounded-lg bg-emerald-500/80 px-3 py-1 text-xs font-bold hover:bg-emerald-500" onClick={() => dk.traLoiHoa(true)}>Đồng ý</button>
          <button type="button" className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20" onClick={() => dk.traLoiHoa(false)}>Đánh tiếp</button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-3 sm:p-5 lg:flex-row">
        {/* cột bàn */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          {haiNguoi ? (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <TheNguoi g={phong.ghe[trai]} idx={trai} phong={phong} dk={dk} />
              <div className="px-1 text-center">
                <div className="font-mono text-3xl font-black leading-none tracking-tight sm:text-5xl" style={{ backgroundImage: `linear-gradient(180deg, #fff, ${mau.a})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
                  {phong.tiSo[trai] ?? 0}<span className="mx-1 text-white/25 sm:mx-2">–</span>{phong.tiSo[phai] ?? 0}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">Tỷ số</div>
              </div>
              <TheNguoi g={phong.ghe[phai]} idx={phai} phong={phong} dk={dk} phai />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {phong.ghe.map((g, i) => (
                <div key={i} className="relative">
                  <TheNguoi g={g} idx={i} phong={phong} dk={dk} gon />
                  <span className="absolute -top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-xs font-black text-amber-300 ring-1 ring-white/10">{phong.tiSo[i] ?? 0} thắng</span>
                </div>
              ))}
            </div>
          )}

          <div className={`relative min-h-[300px] lg:h-auto lg:flex-1 ${tro === 'tien-len' ? 'h-[min(135vw,80vh)]' : 'h-[min(94vw,72vh)]'}`}>
            {ban}
            {phong.trangThai === 'cho' && dk.kieu === 'online' && <PhongCho phong={phong} dk={dk} />}
            {phong.ketQua && !anKetQua && <ManKetQua phong={phong} dk={dk} onDong={() => setAnKetQua(true)} />}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span
              className={`rounded-full px-4 py-1.5 font-semibold ${choPhepDi ? `bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/40 ${css.nhipNhe}` : 'bg-white/[0.05] text-white/60'}`}
              style={choPhepDi ? { animationDuration: '2.2s' } : undefined}
            >
              {trangThaiChu}
            </span>
          </div>
        </main>

        {/* cột phải */}
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[330px]">
          <div className="grid grid-cols-3 gap-2 [&>button]:whitespace-nowrap [&>button]:px-2 [&>button]:text-[13px]">
            {phong.trangThai === 'xong' && toi != null ? (
              <>
                <button type="button" className={`${doiTaiDau ? NUT_CHINH : NUT_KINH} col-span-2`} onClick={dk.taiDau} disabled={!!phong.ghe[toi]?.taiDau}>
                  <RotateCcw className="h-4 w-4" /> {phong.ghe[toi]?.taiDau ? 'Chờ đối thủ…' : doiTaiDau ? 'Nhận tái đấu!' : 'Tái đấu'}
                </button>
                <button type="button" className={NUT_KINH} onClick={() => setAnKetQua(false)}>Kết quả</button>
              </>
            ) : (
              <>
                {xacNhanThua ? (
                  <button type="button" className={`${NUT} bg-rose-600 text-white hover:bg-rose-500 col-span-2`} onClick={() => { setXacNhanThua(false); dk.dauHang(); }}>
                    Chắc chắn đầu hàng?
                  </button>
                ) : (
                  <button type="button" className={`${NUT_KINH} col-span-1`} disabled={phong.trangThai !== 'dang-danh' || toi == null} onClick={() => { setXacNhanThua(true); setTimeout(() => setXacNhanThua(false), 3000); }}>
                    <Flag className="h-4 w-4" /> <span className="hidden sm:inline">Đầu hàng</span>
                  </button>
                )}
                {!xacNhanThua && (
                  <button
                    type="button"
                    className={NUT_KINH}
                    disabled={phong.trangThai !== 'dang-danh' || toi == null || !haiNguoi || (dk.kieu === 'online' && coMay) || phong.xinHoa === toi}
                    onClick={dk.xinHoa}
                  >
                    <Handshake className="h-4 w-4" /> <span className="hidden sm:inline">Xin hoà</span>
                  </button>
                )}
                <button type="button" className={NUT_KINH} disabled>
                  <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Tái đấu</span>
                </button>
              </>
            )}
          </div>

          <section className="flex min-h-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 lg:flex-1">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/45">Lịch sử nước · {dk.lichSu.length}</h2>
            <LichSu ds={dk.lichSu} tro={tro} />
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/45">Trò chuyện</h2>
            <KhungChat dk={dk} />
          </section>
        </aside>
      </div>

      {(dk.loi || dk.thongBao) && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div className={`pointer-events-auto rounded-2xl px-4 py-2.5 text-sm font-medium shadow-2xl ${dk.loi ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white ring-1 ring-white/10'} ${css.noiLen}`}>
            {dk.loi ?? dk.thongBao}
          </div>
        </div>
      )}
    </div>
  );
}

const NUT = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97]';
