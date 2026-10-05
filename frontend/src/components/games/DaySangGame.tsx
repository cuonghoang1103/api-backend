'use client';

/**
 * Dãy sáng — luyện TRÍ NHỚ KHÔNG GIAN (kiểu bài Corsi block của tâm lý học nhận thức).
 *
 * Nâng cấp 05/10/2026: các ô là PHÍM ĐÀN kính — mỗi ô một nốt riêng (thang ngũ cung, hàng dưới
 * trầm → hàng trên cao) nên dãy sáng nghe thành một giai điệu, nhớ bằng cả tai lẫn mắt.
 *
 *  - Vô tận có lên cấp: mỗi dãy đúng = lên một cấp, có băng "Cấp N" + tiếng lên cấp.
 *  - Lưới 3×3 (cấp 1–4) → 4×4 (cấp 5–10) → 5×5 (cấp 11+); dãy dài dần 3 → 4 → 5…; nhịp chiếu
 *    nhanh dần. Cấp 4, 8, 12… là màn ĐẢO NGƯỢC (bấm từ ô cuối về ô đầu — Corsi đảo luyện trí
 *    nhớ LÀM VIỆC chứ không chỉ ghi nhớ thụ động).
 *  - 3 mạng; sai thì mất mạng và chơi lại cấp đó với dãy MỚI (dãy cũ đã lộ đáp án), chuỗi về 0.
 *
 * Điểm mỗi dãy = độ dài × 10 (×1,5 nếu đảo) × (1 + 0,1 × chuỗi, tối đa ×2) + thưởng nhanh ≤ 50.
 * Ván cực giỏi tới cấp ~20 ≈ 6–7 nghìn, dưới trần máy chủ 15 000 (vẫn kẹp trần cho chắc).
 *
 * Hợp đồng GameProps: chỉ chơi, gọi onScore đúng một lần. GameShell lo bắt đầu/đếm ngược/tạm
 * dừng/tắt tiếng/kết quả. Tạm dừng: khung làm mờ div bọc (class pointer-events-none) — game dò
 * class đó để ngưng chiếu dãy và không tính giờ lúc nghỉ.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, RotateCcw, Flame, Brain } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx, tatTieng } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './daySang.module.css';

/* ───────────── Khung co giãn + dò tạm dừng (đọc từ GameShell, không sửa GameShell) ───────────── */
type Khung = { w: number; h: number; fs: boolean; tam: boolean };
function useKhungChoi(goc: React.RefObject<HTMLDivElement | null>): Khung {
  const [k, setK] = useState<Khung>({ w: 560, h: 600, fs: false, tam: false });
  useEffect(() => {
    const el = goc.current;
    if (!el) return;
    const boc = el.parentElement; // div key=runKey của GameShell — bị làm mờ + khoá khi tạm dừng
    const vung = boc?.parentElement ?? boc ?? el; // vùng w-full của sân khấu
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
type Pha = 'cho' | 'xem' | 'lam' | 'dung' | 'sai' | 'het';
type SauDo = 'phat' | 'lenCap' | 'thuLai' | 'het' | null;

const MANG = 3;
const TRAN = 15_000;
const coLuoi = (c: number) => (c <= 4 ? 3 : c <= 10 ? 4 : 5);
const doDai = (c: number) => 3 + Math.floor((c - 1) * 0.75);
const daoNguoc = (c: number) => c >= 4 && c % 4 === 0;
const nhip = (c: number) => ({ bat: Math.max(300, 600 - c * 16), nghi: Math.max(110, 190 - c * 4) });

/** Thang ngũ cung C4 → A6 (15 nốt) — ô nào cũng nghe êm khi nối nhau. */
const THANG = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
/** Nốt của ô: xếp như phím đàn — hàng dưới trầm, hàng trên cao, trái → phải đi lên. */
function notCuaO(o: number, n: number) {
  const hang = Math.floor(o / n), cot = o % n;
  const bac = (n - 1 - hang) * n + cot;
  return THANG[Math.round((bac * (THANG.length - 1)) / Math.max(1, n * n - 1))]!;
}
/** Phím tắt: 3×3 dùng 1–9; 4×4 dùng 4 hàng phím 1234 / QWER / ASDF / ZXCV. */
const PHIM4 = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];
function phimCuaO(o: number, n: number): string | null {
  if (n === 3) return String(o + 1);
  if (n === 4) return PHIM4[o]!.toUpperCase();
  return null;
}

/** Dãy ngẫu nhiên, không lặp ô liền kề (sáng hai lần liền một ô thì mắt không phân biệt được). */
function taoDay(n: number, soO: number): number[] {
  const d: number[] = [];
  while (d.length < n) {
    const o = Math.floor(Math.random() * soO);
    if (o !== d[d.length - 1]) d.push(o);
  }
  return d;
}

type Mo = {
  cap: number; mang: number; diem: number; chuoi: number; tamNho: number;
  pha: Pha; day: number[]; daBam: number; sang: number | null; loiO: number | null;
  tBam: number; tamTu: number; sauDo: SauDo; bangCap: number; dongBang: number;
};

export default function DaySangGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const banRef = useRef<HTMLDivElement>(null);
  const k = useKhungChoi(gocRef);

  const g = useRef<Mo>({
    cap: 1, mang: MANG, diem: 0, chuoi: 0, tamNho: 0, pha: 'cho', day: [], daBam: 0, sang: null, loiO: null,
    tBam: 0, tamTu: 0, sauDo: null, bangCap: 0, dongBang: 0,
  });
  const [v, setV] = useState<Mo>(() => ({ ...g.current }));
  const dong = useCallback(() => setV({ ...g.current }), []);

  const hen = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ngung = () => { for (const h of hen.current) clearTimeout(h); hen.current = []; };
  const sau = (ms: number, f: () => void) => { hen.current.push(setTimeout(f, ms)); };
  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const tamRef = useRef(false);

  /* Âm phím đàn — nốt riêng mỗi ô (sine + bội âm triangle, tắt dần như marimba). */
  const ac = useRef<AudioContext | null>(null);
  const danNot = useCallback((f: number, dai = 0.55, to = 0.22) => {
    if (tatTieng()) return;
    try {
      if (!ac.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ac.current = new AC();
      }
      const c = ac.current;
      if (c.state === 'suspended') void c.resume().catch(() => undefined);
      const t = c.currentTime;
      const tong = c.createGain();
      tong.gain.setValueAtTime(0.0001, t);
      tong.gain.exponentialRampToValueAtTime(to, t + 0.006);
      tong.gain.exponentialRampToValueAtTime(0.0001, t + dai);
      tong.connect(c.destination);
      const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
      const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
      const g2 = c.createGain(); g2.gain.setValueAtTime(0.35, t); g2.gain.exponentialRampToValueAtTime(0.001, t + dai * 0.4);
      o1.connect(tong); o2.connect(g2).connect(tong);
      o1.start(t); o2.start(t); o1.stop(t + dai + 0.03); o2.stop(t + dai + 0.03);
    } catch { /* không có âm thanh cũng chơi được */ }
  }, []);

  const ketThuc = useCallback(() => {
    ngung();
    g.current.pha = 'het'; g.current.sauDo = null; g.current.sang = null;
    dong();
    if (daBao.current || !onScore) return;
    daBao.current = true;
    onScore(Math.min(TRAN, Math.round(g.current.diem)), Math.round((Date.now() - t0.current) / 1000));
  }, [onScore, dong]);

  /** Chiếu dãy đang có trong g.day (sau `tre` ms). */
  const phat = useCallback((tre: number) => {
    ngung();
    const m = g.current;
    m.pha = 'xem'; m.daBam = 0; m.loiO = null; m.sang = null; m.sauDo = 'phat';
    dong();
    if (tamRef.current) return; // đang tạm dừng: tiếp tục sẽ chiếu lại
    const n = coLuoi(m.cap);
    const { bat, nghi } = nhip(m.cap);
    let t = tre;
    m.day.forEach((o) => {
      sau(t, () => { g.current.sang = o; dong(); danNot(notCuaO(o, n)); });
      sau(t + bat, () => { g.current.sang = null; dong(); });
      t += bat + nghi;
    });
    sau(t + 100, () => { g.current.pha = 'lam'; g.current.sauDo = null; g.current.tBam = performance.now(); dong(); });
  }, [danNot, dong]);

  const vaoCap = useCallback((c: number, tre: number) => {
    const m = g.current;
    m.cap = c;
    const n = coLuoi(c);
    m.day = taoDay(doDai(c), n * n);
    phat(tre);
  }, [phat]);

  const lenCap = useCallback(() => {
    const m = g.current;
    m.cap += 1;
    m.bangCap = m.cap; m.dongBang += 1;
    sfx('lenCap');
    const n = coLuoi(m.cap);
    m.day = taoDay(doDai(m.cap), n * n);
    phat(1350);
  }, [phat]);

  const chayTiep = useCallback((viec: SauDo) => {
    if (viec === 'phat') phat(500);
    else if (viec === 'lenCap') lenCap();
    else if (viec === 'thuLai') vaoCap(g.current.cap, 600);
    else if (viec === 'het') ketThuc();
  }, [phat, lenCap, vaoCap, ketThuc]);

  // Vào game là chiếu cấp 1; rời game thì dọn hẹn giờ + đóng âm thanh.
  useEffect(() => {
    vaoCap(1, 700);
    return () => { ngung(); };
  }, [vaoCap]);
  useEffect(() => () => { void ac.current?.close().catch(() => undefined); ac.current = null; }, []);

  // Tạm dừng / tiếp tục (GameShell không báo — dò qua class của div bọc).
  useEffect(() => {
    const m = g.current;
    if (k.tam === tamRef.current) return;
    tamRef.current = k.tam;
    if (k.tam) {
      m.tamTu = performance.now();
      if (m.pha !== 'lam' && m.pha !== 'het') { ngung(); m.sang = null; dong(); }
      return;
    }
    if (m.pha === 'lam') m.tBam += performance.now() - m.tamTu;
    else if (m.sauDo) chayTiep(m.sauDo);
  }, [k.tam, chayTiep, dong]);

  const bam = useCallback((o: number) => {
    const m = g.current;
    if (m.pha !== 'lam' || tamRef.current) return;
    const n = coLuoi(m.cap);
    const nguoc = daoNguoc(m.cap);
    const can = nguoc ? m.day[m.day.length - 1 - m.daBam] : m.day[m.daBam];
    danNot(notCuaO(o, n), 0.4);
    m.sang = o; dong();
    sau(170, () => { if (g.current.sang === o && g.current.pha !== 'xem') { g.current.sang = null; dong(); } });

    const ban = banRef.current;
    const nut = ban?.querySelector<HTMLElement>(`[data-o="${o}"]`);
    const toaDo = () => {
      if (!ban || !nut) return { x: 0, y: 0 };
      const a = ban.getBoundingClientRect(), b = nut.getBoundingClientRect();
      return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
    };

    if (o !== can) {
      m.loiO = o; m.mang -= 1; m.chuoi = 0; m.pha = 'sai';
      sfx('sai'); rung(ban);
      m.sauDo = m.mang <= 0 ? 'het' : 'thuLai';
      dong();
      sau(m.mang <= 0 ? 1000 : 1200, () => chayTiep(g.current.sauDo));
      return;
    }
    m.daBam += 1;
    if (m.daBam < m.day.length) { dong(); return; }

    // Xong dãy — chấm điểm.
    const giayMoiO = (performance.now() - m.tBam) / 1000 / m.day.length;
    const thuong = Math.max(0, Math.round(50 - Math.max(0, giayMoiO - 0.6) * 40));
    const heSo = 1 + Math.min(10, m.chuoi) * 0.1;
    const cong = Math.round(m.day.length * 10 * (nguoc ? 1.5 : 1) * heSo) + thuong;
    m.diem = Math.min(TRAN, m.diem + cong);
    m.chuoi += 1;
    m.tamNho = Math.max(m.tamNho, m.day.length);
    m.pha = 'dung'; m.sauDo = 'lenCap';
    dong();
    if (m.chuoi >= 2) sfx('combo', { muc: m.chuoi - 1 }); else sfx('dung');
    const { x, y } = toaDo();
    diemBay(ban, x, y - 10, `+${cong}`, '#86efac');
    phaoGiay(ban, { x, y, it: true });
    sau(900, () => chayTiep(g.current.sauDo));
  }, [danNot, dong, chayTiep]);

  // Bàn phím: đọc mọi thứ qua ref ⇒ bấm dồn dập không lệch trạng thái.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = coLuoi(g.current.cap);
      const ph = e.key.toLowerCase();
      let o = -1;
      if (n === 3 && /^[1-9]$/.test(ph)) o = Number(ph) - 1;
      else if (n === 4) o = PHIM4.indexOf(ph);
      if (o >= 0) { e.preventDefault(); bam(o); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [bam]);

  /* ───────────── Vẽ ───────────── */
  const n = coLuoi(v.cap);
  const soO = n * n;
  const nguoc = daoNguoc(v.cap);
  const B = Math.round(Math.max(240, Math.min(k.w - 8, k.h - 190, k.fs ? 880 : 520)));
  const rong = Math.min(k.w, Math.max(B, 380));

  const nhan: Record<Pha, string> = vi
    ? { cho: 'Chuẩn bị…', xem: 'Nhìn và nghe giai điệu…', lam: nguoc ? 'Bấm NGƯỢC lại — từ ô cuối về ô đầu' : 'Đến lượt bạn — bấm lại đúng thứ tự', dung: 'Chính xác!', sai: v.mang > 0 ? 'Sai rồi — xem dãy mới nhé' : 'Hết mạng', het: 'Hết ván' }
    : { cho: 'Get ready…', xem: 'Watch and listen…', lam: nguoc ? 'REVERSE — tap from last to first' : 'Your turn — repeat the order', dung: 'Correct!', sai: v.mang > 0 ? 'Wrong — watch a new sequence' : 'Out of lives', het: 'Game over' };

  return (
    <div ref={gocRef} className={s.goc} data-pha={v.pha} style={{ width: rong, ['--b' as string]: `${B}px` }}>
      <div className={s.hud}>
        <div className={s.chip}><span>{vi ? 'Cấp' : 'Level'}</span><b>{v.cap}</b></div>
        <div className={s.chip}><span>{vi ? 'Điểm' : 'Score'}</span><b>{v.diem.toLocaleString()}</b></div>
        <div className={s.chip} data-an={v.tamNho === 0}><Brain size={14} /><b>{v.tamNho || '–'}</b></div>
        {v.chuoi >= 2 && (
          <div key={v.chuoi} className={s.combo}><Flame size={14} /> ×{(1 + Math.min(10, v.chuoi) * 0.1).toFixed(1)}</div>
        )}
        <div className={s.tim} aria-label={`${v.mang} ${vi ? 'mạng' : 'lives'}`}>
          {Array.from({ length: MANG }, (_, i) => <Heart key={i} size={18} data-con={i < v.mang} />)}
        </div>
      </div>

      <div className={s.nhanPha} data-nguoc={nguoc && v.pha === 'lam'}>
        {nguoc && v.pha !== 'het' && <span className={s.huyHieu}><RotateCcw size={13} /> {vi ? 'Đảo ngược' : 'Reverse'}</span>}
        <span>{nhan[v.pha]}</span>
      </div>

      <div className={s.cham} aria-hidden="true">
        {v.day.map((_, i) => (
          <i key={`${v.cap}-${i}`} data-xong={v.pha === 'lam' || v.pha === 'dung' || v.pha === 'sai' ? i < v.daBam : false} />
        ))}
      </div>

      <div ref={banRef} className={s.ban} style={{ ['--n' as string]: n, width: B, height: B }} data-pha={v.pha}>
        {Array.from({ length: soO }, (_, o) => {
          const phim = phimCuaO(o, n);
          return (
            <button
              key={`${n}-${o}`}
              type="button"
              data-o={o}
              className={s.o}
              style={{ ['--hue' as string]: Math.round(200 + (o * 160) / Math.max(1, soO - 1)) }}
              data-sang={v.sang === o}
              data-loi={v.loiO === o}
              data-mo={v.pha === 'lam'}
              tabIndex={-1}
              onPointerDown={(e) => { e.preventDefault(); bam(o); }}
              aria-label={`${vi ? 'Ô' : 'Tile'} ${o + 1}`}
            >
              {phim && <kbd>{phim}</kbd>}
            </button>
          );
        })}
        {v.bangCap > 0 && (
          <div key={v.dongBang} className={s.bangCap} aria-live="polite">
            <b>{vi ? 'Cấp' : 'Level'} {v.bangCap}</b>
            <span>
              {coLuoi(v.bangCap) !== coLuoi(v.bangCap - 1)
                ? (vi ? `Lưới mới ${coLuoi(v.bangCap)}×${coLuoi(v.bangCap)}!` : `New ${coLuoi(v.bangCap)}×${coLuoi(v.bangCap)} grid!`)
                : daoNguoc(v.bangCap)
                  ? (vi ? 'Màn đảo ngược' : 'Reverse round')
                  : (vi ? `Dãy ${doDai(v.bangCap)} nốt` : `${doDai(v.bangCap)}-note sequence`)}
            </span>
          </div>
        )}
      </div>

      <p className={s.goiY}>
        {vi
          ? `Dãy ${doDai(v.cap)} nốt · lưới ${n}×${n}${n === 3 ? ' · phím 1–9' : n === 4 ? ' · phím 1234 / QWER / ASDF / ZXCV' : ' · bấm chuột hoặc chạm'}`
          : `${doDai(v.cap)}-note sequence · ${n}×${n} grid${n === 3 ? ' · keys 1–9' : n === 4 ? ' · keys 1234 / QWER / ASDF / ZXCV' : ' · mouse or touch'}`}
      </p>
    </div>
  );
}
