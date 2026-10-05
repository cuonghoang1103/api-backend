'use client';

/**
 * N-back kép — luyện TRÍ NHỚ LÀM VIỆC (dual n-back, Jaeggi 2008: bài tập trí nhớ làm việc
 * được nghiên cứu nhiều nhất).
 *
 * Mỗi lượt một thẻ trên lưới 3×3 (bỏ ô giữa — 8 vị trí) LẬT 3D để lộ một chữ cái (đọc to nếu
 * máy có giọng). Bấm "Vị trí" khi thẻ lật trùng chỗ thẻ của N lượt trước, "Chữ" khi chữ trùng.
 *
 * Nâng cấp 05/10/2026 — vô tận có lên cấp:
 *  - Cấp 1–2: 1-back · 3–5: 2-back · 6–8: 3-back · 9–10: 4-back · 11–12: 5-back · rồi N tăng dần
 *    (tối đa 9). Trong cùng N, nhịp lượt nhanh dần. Mỗi cấp 14 + N lượt.
 *  - Chấm kiểu "threat score": độ chính xác = trúng / (trúng + bỏ lỡ + bấm nhầm). Không bấm gì
 *    được 0%, bấm bừa ~30% ⇒ không thể qua cấp bằng mẹo. ≥ 60% qua cấp; dưới thì mất 1 mạng
 *    (3 mạng) và chơi lại cấp đó với dãy mới.
 *  - Mỗi lần bấm trúng: +5 × N × hệ số chuỗi (5 trúng liền ×1,5, 10 trúng liền ×2). Qua cấp
 *    thưởng 30 × N × độ chính xác. Ván cực giỏi tới cấp ~18 (6-back) ≈ 6–8 nghìn < trần 10 000.
 *
 * Hợp đồng GameProps: chỉ chơi, gọi onScore đúng một lần. Tạm dừng dò qua class div bọc của
 * GameShell — nhịp lượt ngưng, tiếp tục thì chạy lại lượt đang dở.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Type, Heart, Flame, Target } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx, tatTieng } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './nBack.module.css';

/* ───────────── Khung co giãn + dò tạm dừng (đọc từ GameShell, không sửa GameShell) ───────────── */
type Khung = { w: number; h: number; fs: boolean; tam: boolean };
function useKhungChoi(goc: React.RefObject<HTMLDivElement | null>): Khung {
  const [k, setK] = useState<Khung>({ w: 560, h: 600, fs: false, tam: false });
  useEffect(() => {
    const el = goc.current;
    if (!el) return;
    const boc = el.parentElement;
    const vung = boc?.parentElement ?? boc ?? el;
    const tinh = () => {
      const fs = !!document.fullscreenElement;
      const w = Math.max(280, vung.clientWidth);
      const h = Math.max(400, fs ? window.innerHeight - 96 : Math.min(window.innerHeight - 130, 860));
      const tam = !!boc?.classList.contains('pointer-events-none');
      setK((c) => (c.w === w && c.h === h && c.fs === fs && c.tam === tam ? c : { w, h, fs, tam }));
    };
    tinh();
    const ro = new ResizeObserver(tinh);
    ro.observe(vung);
    const mo = new MutationObserver(tinh);
    if (boc) mo.observe(boc, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', tinh);
    document.addEventListener('fullscreenchange', tinh);
    return () => {
      ro.disconnect(); mo.disconnect();
      window.removeEventListener('resize', tinh);
      document.removeEventListener('fullscreenchange', tinh);
    };
  }, [goc]);
  return k;
}

/* ───────────── Luật chơi ───────────── */
const VI_TRI = [0, 1, 2, 3, 5, 6, 7, 8]; // ô của lưới 3×3, bỏ ô giữa
const CHU = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T']; // phụ âm đọc to dễ phân biệt
const MANG = 3;
const TRAN = 10_000;
const QUA_CAP = 0.6;

const BANG: [number, number][] = [
  [1, 2400], [1, 2100], [2, 2600], [2, 2350], [2, 2100], [3, 2600], [3, 2350], [3, 2150],
  [4, 2600], [4, 2350], [5, 2600], [5, 2400],
];
function cauHinh(cap: number) {
  if (cap <= BANG.length) { const [n, nhip] = BANG[cap - 1]!; return { n, nhip }; }
  const du = cap - BANG.length;
  return { n: Math.min(9, 5 + Math.ceil(du / 2)), nhip: du % 2 ? 2600 : 2400 };
}
const soLuot = (n: number) => 14 + n;
const heSo = (chuoi: number) => (chuoi >= 10 ? 2 : chuoi >= 5 ? 1.5 : 1);

type Luot = { o: number; chu: string };
/** Chọn ngẫu nhiên k chỉ số trong [tu, den). */
function chonViTri(tu: number, den: number, k: number) {
  const ds = Array.from({ length: den - tu }, (_, i) => i + tu);
  for (let i = ds.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ds[i], ds[j]] = [ds[j]!, ds[i]!]; }
  return new Set(ds.slice(0, k));
}
/** Dãy có đúng ~30% lượt trùng mỗi kênh (tối thiểu 3); lượt khác CỐ Ý không trùng. */
function sinhKhoi(n: number): Luot[] {
  const dai = soLuot(n);
  const k = Math.max(3, Math.round((dai - n) * 0.3));
  const trungO = chonViTri(n, dai, k);
  const trungC = chonViTri(n, dai, k);
  const chonKhac = <T,>(ds: T[], tranh: T | undefined) => { let x: T; do x = ds[Math.floor(Math.random() * ds.length)]!; while (x === tranh); return x; };
  const d: Luot[] = [];
  for (let i = 0; i < dai; i++) {
    const truoc = i >= n ? d[i - n] : undefined;
    d.push({
      o: truoc && trungO.has(i) ? truoc.o : chonKhac(VI_TRI, truoc?.o),
      chu: truoc && trungC.has(i) ? truoc.chu : chonKhac(CHU, truoc?.chu),
    });
  }
  return d;
}

type Kenh = 'vt' | 'c';
type KetQua = 'dung' | 'sai' | 'lo' | undefined;
type TongKet = { qua: boolean; tl: number; thuong: number; capKe: number } | null;
type Mo = {
  cap: number; mang: number; diem: number; chuoi: number; nCao: number;
  day: Luot[]; i: number; hien: boolean; daBam: { vt: boolean; c: boolean }; kq: { vt?: KetQua; c?: KetQua }; loId: number;
  trung: number; lo: number; nham: number; // của cấp đang chơi
  tTrung: number; tLo: number; tNham: number; // cả ván
  pha: 'choi' | 'nghi' | 'het'; tongKet: TongKet; khoiId: number; dongBang: number;
};

export default function NBackGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const nutRef = useRef<{ vt: HTMLButtonElement | null; c: HTMLButtonElement | null }>({ vt: null, c: null });
  const k = useKhungChoi(gocRef);

  const g = useRef<Mo>({
    cap: 1, mang: MANG, diem: 0, chuoi: 0, nCao: 1,
    day: sinhKhoi(1), i: -1, hien: false, daBam: { vt: false, c: false }, kq: {}, loId: 0,
    trung: 0, lo: 0, nham: 0, tTrung: 0, tLo: 0, tNham: 0,
    pha: 'choi', tongKet: null, khoiId: 1, dongBang: 1,
  });
  const [v, setV] = useState<Mo>(() => ({ ...g.current }));
  const dong = useCallback(() => setV({ ...g.current, daBam: { ...g.current.daBam }, kq: { ...g.current.kq } }), []);

  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const tamRef = useRef(false);
  const henAn = useRef<ReturnType<typeof setTimeout>>();
  const henNghi = useRef<ReturnType<typeof setTimeout>>();

  const doc = useCallback((c: string) => {
    if (tatTieng()) return;
    try {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = 'en-US'; u.rate = 1.1; u.volume = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* không giọng: chữ vẫn hiện trên thẻ */ }
  }, []);

  const ketThuc = useCallback(() => {
    g.current.pha = 'het';
    dong();
    if (daBao.current || !onScore) return;
    daBao.current = true;
    onScore(Math.min(TRAN, Math.round(g.current.diem)), Math.round((Date.now() - t0.current) / 1000));
  }, [onScore, dong]);

  const batDauKhoi = useCallback((cap: number) => {
    const m = g.current;
    const qua = cap > m.cap;
    m.cap = cap;
    const { n } = cauHinh(cap);
    m.nCao = Math.max(m.nCao, n);
    m.day = sinhKhoi(n);
    m.i = -1; m.hien = false; m.daBam = { vt: false, c: false }; m.kq = {};
    m.trung = 0; m.lo = 0; m.nham = 0;
    m.pha = 'choi'; m.tongKet = null; m.khoiId += 1;
    if (qua) { m.dongBang += 1; sfx('lenCap'); }
    dong();
  }, [dong]);

  const xongKhoi = useCallback(() => {
    const m = g.current;
    const { n } = cauHinh(m.cap);
    const mau = m.trung + m.lo + m.nham;
    const tl = mau ? m.trung / mau : 0;
    m.hien = false;
    if (tl >= QUA_CAP) {
      const thuong = Math.round(30 * n * tl);
      m.diem = Math.min(TRAN, m.diem + thuong);
      m.tongKet = { qua: true, tl, thuong, capKe: m.cap + 1 };
      m.pha = 'nghi';
      sfx('sao');
      if (gocRef.current) phaoGiay(gocRef.current, { it: true });
    } else {
      m.mang -= 1; m.chuoi = 0;
      sfx('sai');
      rung(gocRef.current);
      if (m.mang <= 0) { m.tongKet = { qua: false, tl, thuong: 0, capKe: m.cap }; ketThuc(); return; }
      m.tongKet = { qua: false, tl, thuong: 0, capKe: m.cap };
      m.pha = 'nghi';
    }
    dong();
    if (!tamRef.current) henNghi.current = setTimeout(() => batDauKhoi(g.current.tongKet?.capKe ?? g.current.cap), 2600);
  }, [dong, ketThuc, batDauKhoi]);

  /** Chấm lượt vừa xong: bỏ lỡ lượt trùng (cái bấm trúng/nhầm đã chấm ngay lúc bấm). */
  const chamLuot = useCallback(() => {
    const m = g.current;
    const { n } = cauHinh(m.cap);
    const i = m.i;
    if (i < n) return;
    const tVT = m.day[i]!.o === m.day[i - n]!.o;
    const tC = m.day[i]!.chu === m.day[i - n]!.chu;
    let lo = false;
    if (tVT && !m.daBam.vt) { m.lo++; m.tLo++; m.kq.vt = 'lo'; lo = true; }
    if (tC && !m.daBam.c) { m.lo++; m.tLo++; m.kq.c = 'lo'; lo = true; }
    if (lo) { m.chuoi = 0; m.loId += 1; sfx('truot'); }
  }, []);

  // Nhịp chính: mỗi `nhip` ms một lượt mới. Ngưng khi tạm dừng / nghỉ giữa cấp / hết ván.
  useEffect(() => {
    if (v.pha !== 'choi' || k.tam) return;
    const { nhip } = cauHinh(v.cap);
    const id = setTimeout(() => {
      const m = g.current;
      if (m.pha !== 'choi') return;
      if (m.i >= 0) chamLuot();
      const tiep = m.i + 1;
      if (tiep >= m.day.length) { dong(); xongKhoi(); return; }
      const loGiu = m.kq; // giữ dấu "bỏ lỡ" của lượt trước thêm một nhịp để người chơi kịp thấy
      m.i = tiep; m.hien = true; m.daBam = { vt: false, c: false };
      m.kq = { vt: loGiu.vt === 'lo' ? 'lo' : undefined, c: loGiu.c === 'lo' ? 'lo' : undefined };
      dong();
      doc(m.day[tiep]!.chu);
      clearTimeout(henAn.current);
      henAn.current = setTimeout(() => { g.current.hien = false; if (g.current.kq.vt === 'lo') g.current.kq.vt = undefined; if (g.current.kq.c === 'lo') g.current.kq.c = undefined; dong(); }, Math.min(950, nhip * 0.4));
    }, v.i === -1 ? 1500 : nhip);
    return () => clearTimeout(id);
  }, [v.i, v.pha, v.khoiId, v.cap, k.tam, chamLuot, xongKhoi, doc, dong]);

  // Tạm dừng: tắt giọng, úp thẻ; tiếp tục trong lúc nghỉ giữa cấp thì đi tiếp.
  useEffect(() => {
    if (k.tam === tamRef.current) return;
    tamRef.current = k.tam;
    const m = g.current;
    if (k.tam) {
      clearTimeout(henNghi.current);
      try { window.speechSynthesis.cancel(); } catch { /* bỏ qua */ }
      m.hien = false; dong();
      return;
    }
    if (m.pha === 'nghi') henNghi.current = setTimeout(() => batDauKhoi(g.current.tongKet?.capKe ?? g.current.cap), 900);
  }, [k.tam, batDauKhoi, dong]);

  useEffect(() => () => {
    clearTimeout(henAn.current); clearTimeout(henNghi.current);
    try { window.speechSynthesis.cancel(); } catch { /* bỏ qua */ }
  }, []);

  const bam = useCallback((kenh: Kenh) => {
    const m = g.current;
    const { n } = cauHinh(m.cap);
    if (m.pha !== 'choi' || tamRef.current || m.i < n || m.daBam[kenh]) return;
    m.daBam[kenh] = true;
    const luot = m.day[m.i]!, truoc = m.day[m.i - n]!;
    const dung = kenh === 'vt' ? luot.o === truoc.o : luot.chu === truoc.chu;
    const goc = gocRef.current, nut = nutRef.current[kenh];
    let x = 0, y = 0;
    if (goc && nut) {
      const a = goc.getBoundingClientRect(), b = nut.getBoundingClientRect();
      x = b.left - a.left + b.width / 2; y = b.top - a.top + b.height / 2;
    }
    if (dung) {
      m.trung++; m.tTrung++; m.chuoi++;
      const cong = Math.round(5 * n * heSo(m.chuoi));
      m.diem = Math.min(TRAN, m.diem + cong);
      m.kq[kenh] = 'dung';
      if (m.chuoi >= 3) sfx('combo', { muc: m.chuoi - 2 }); else sfx('dung');
      diemBay(goc, x, y - 26, `+${cong}`, '#67e8f9');
      phaoGiay(goc, { x, y, it: true, mau: ['#67e8f9', '#a5f3fc', '#818cf8', '#ffffff', '#4ade80'] });
    } else {
      m.nham++; m.tNham++; m.chuoi = 0;
      m.kq[kenh] = 'sai';
      sfx('sai');
      rung(nut);
    }
    dong();
  }, [dong]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const p = e.key.toLowerCase();
      if (p === 'a' || e.key === 'ArrowLeft') { e.preventDefault(); bam('vt'); }
      else if (p === 'l' || e.key === 'ArrowRight') { e.preventDefault(); bam('c'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [bam]);

  /* ───────────── Vẽ ───────────── */
  const { n } = cauHinh(v.cap);
  const luot = v.i >= 0 ? v.day[v.i] : undefined;
  const mauTong = v.tTrung + v.tLo + v.tNham;
  const chinhXac = mauTong ? Math.round((v.tTrung / mauTong) * 100) : null;
  const choNho = v.pha === 'choi' && v.i < n;
  const B = Math.round(Math.max(220, Math.min(k.w - 8, k.h - 250, k.fs ? 720 : 420)));
  const rong = Math.min(k.w, Math.max(B, 400));

  return (
    <div ref={gocRef} className={s.goc} style={{ width: rong, ['--b' as string]: `${B}px` }}>
      <div className={s.hud}>
        <div className={s.nBadge} key={n}><b>{n}</b>-back</div>
        <div className={s.chip}><span>{vi ? 'Cấp' : 'Level'}</span><b>{v.cap}</b></div>
        <div className={s.chip}><span>{vi ? 'Điểm' : 'Score'}</span><b>{v.diem.toLocaleString()}</b></div>
        <div className={s.chip} title={vi ? 'Độ chính xác cả ván' : 'Overall accuracy'}><Target size={14} /><b>{chinhXac === null ? '–' : `${chinhXac}%`}</b></div>
        {v.chuoi >= 3 && <div key={v.chuoi} className={s.combo}><Flame size={14} /> {v.chuoi}{heSo(v.chuoi) > 1 ? ` · ×${heSo(v.chuoi)}` : ''}</div>}
        <div className={s.tim} aria-label={`${v.mang} ${vi ? 'mạng' : 'lives'}`}>
          {Array.from({ length: MANG }, (_, i) => <Heart key={i} size={18} data-con={i < v.mang} />)}
        </div>
      </div>

      <div className={s.tienDo}>
        <div className={s.thanh}><i style={{ width: `${Math.max(0, ((v.i + 1) / v.day.length) * 100)}%` }} /></div>
        <span>{vi ? 'Lượt' : 'Turn'} <b>{Math.max(0, v.i + 1)}/{v.day.length}</b></span>
        <span className={s.demCap}>✓ <b>{v.trung}</b> · {vi ? 'lỡ' : 'miss'} <b>{v.lo}</b> · {vi ? 'nhầm' : 'false'} <b>{v.nham}</b></span>
      </div>

      <div className={s.ban} style={{ width: B, height: B }}>
        {Array.from({ length: 9 }, (_, o) => {
          if (o === 4) return <div key={o} className={s.giua}><span className={s.tam} /></div>;
          const lat = v.hien && luot?.o === o;
          return (
            <div key={o} className={s.o} data-lat={lat}>
              <div className={s.mat}>
                <div className={s.matTruoc} />
                <div className={s.matSau}>{lat ? luot!.chu : ''}</div>
              </div>
            </div>
          );
        })}
        {v.pha === 'choi' && v.i === -1 && (
          <div key={`b${v.dongBang}`} className={s.bangCap}>
            <b>{vi ? 'Cấp' : 'Level'} {v.cap}</b>
            <span>{n}-back · {soLuot(n)} {vi ? 'lượt' : 'turns'}</span>
          </div>
        )}
        {v.tongKet && v.pha !== 'choi' && (
          <div className={s.tongKet} data-qua={v.tongKet.qua}>
            <b>{v.tongKet.qua ? (vi ? 'Qua cấp!' : 'Level clear!') : v.pha === 'het' ? (vi ? 'Hết mạng' : 'Out of lives') : (vi ? 'Chưa đạt' : 'Not quite')}</b>
            <p>{vi ? 'Chính xác' : 'Accuracy'} <strong>{Math.round(v.tongKet.tl * 100)}%</strong>{v.tongKet.qua ? ` · +${v.tongKet.thuong}` : ` · ${vi ? 'cần' : 'need'} ${QUA_CAP * 100}%`}</p>
            {v.pha === 'nghi' && (
              <small>
                {v.tongKet.qua
                  ? (vi ? `Tiếp: cấp ${v.tongKet.capKe} · ${cauHinh(v.tongKet.capKe).n}-back` : `Next: level ${v.tongKet.capKe} · ${cauHinh(v.tongKet.capKe).n}-back`)
                  : (vi ? `Còn ${v.mang} mạng — chơi lại cấp ${v.cap}` : `${v.mang} lives left — retry level ${v.cap}`)}
              </small>
            )}
          </div>
        )}
      </div>

      <div className={s.nut2}>
        {(['vt', 'c'] as const).map((kenh) => (
          <button
            key={kenh}
            ref={(el) => { nutRef.current[kenh] = el; }}
            type="button"
            className={s.nut}
            data-kq={v.kq[kenh]}
            data-da={v.daBam[kenh]}
            data-tat={choNho}
            onPointerDown={(e) => { e.preventDefault(); bam(kenh); }}
          >
            {kenh === 'vt' ? <MapPin size={20} /> : <Type size={20} />}
            {kenh === 'vt' ? (vi ? 'Vị trí trùng' : 'Position') : (vi ? 'Chữ trùng' : 'Letter')}
            <kbd>{kenh === 'vt' ? 'A' : 'L'}</kbd>
            {v.kq[kenh] === 'lo' && <em key={v.loId} className={s.lo}>{vi ? 'Bỏ lỡ!' : 'Missed!'}</em>}
          </button>
        ))}
      </div>
      <p className={s.goiY}>
        {choNho
          ? (vi ? `Ghi nhớ ${n} thẻ đầu — chưa có gì để so…` : `Memorise the first ${n} cards — nothing to compare yet…`)
          : (vi
            ? `So với ${n} lượt TRƯỚC: thẻ cùng chỗ ⇒ Vị trí (A / ←), cùng chữ ⇒ Chữ (L / →). Không trùng thì đừng bấm.`
            : `Compare with ${n} turns BACK: same place ⇒ Position (A / ←), same letter ⇒ Letter (L / →). Otherwise don't press.`)}
      </p>
    </div>
  );
}
