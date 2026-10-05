'use client';

/**
 * Màu chữ (Stroop) — luyện KIỂM SOÁT ỨC CHẾ: não đọc chữ tự động, nên chọn MÀU MỰC của chữ "ĐỎ"
 * tô xanh là phải ghìm phản xạ đọc lại (hiệu ứng Stroop, 1935).
 *
 * Nâng cấp 05/10/2026 — vô tận có lên cấp (8 câu đúng = lên cấp), 3 mạng:
 *  - Cấp 1–2: 4 màu, chọn MÀU MỰC, thời gian mỗi câu rộng (3,6 giây).
 *  - Cấp 3–4: đủ 5 màu, câu "lệch" (chữ ≠ màu) nhiều dần.
 *  - Cấp 5–6: ĐỔI LUẬT — cứ 4 câu đúng đảo giữa MÀU MỰC và NGHĨA của chữ (có băng báo).
 *  - Cấp 7+: TRỘN LUẬT từng câu — khung thẻ hồng = theo MÀU MỰC, khung vàng = theo NGHĨA
 *    (luyện chuyển luật, task switching).
 *  - Cấp 9+: thẻ nhuốm một màu nhiễu thứ ba, chữ xoay lệch; cấp 12+ cỡ chữ đổi từng câu.
 *  - Thời gian mỗi câu giảm 0,2 giây mỗi cấp (sàn 1,15 giây). Hết giờ hoặc sai ⇒ mất mạng.
 *
 * Nút trả lời chỉ là ô màu, KHÔNG có chữ — có chữ thì người chơi so chữ với chữ và bài tập mất
 * tác dụng. Điểm mỗi câu đúng = (8 + cấp) × hệ số chuỗi (5 đúng liền ×2, 12 ×3) + 3 nếu trả lời
 * trong 40% thời gian. Ván cực giỏi tới cấp ~15 ≈ 4–5 nghìn < trần 6 000 (vẫn kẹp trần).
 *
 * Hợp đồng GameProps: chỉ chơi, gọi onScore đúng một lần. Tạm dừng dò qua class div bọc của
 * GameShell — đồng hồ câu đứng yên lúc nghỉ.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Flame, Palette, BookOpen } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './stroop.module.css';

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
const MAU = [
  { vi: 'ĐỎ', en: 'RED', hex: '#ef4444' },
  { vi: 'XANH', en: 'BLUE', hex: '#3b82f6' },
  { vi: 'VÀNG', en: 'YELLOW', hex: '#facc15' },
  { vi: 'LỤC', en: 'GREEN', hex: '#22c55e' },
  { vi: 'TÍM', en: 'PURPLE', hex: '#a855f7' },
];
const MANG = 3;
const TRAN = 6_000;
const CAU_MOI_CAP = 8;
const DOI_SAU = 4; // cấp 5–6: đổi luật sau mỗi 4 câu đúng

type Luat = 'muc' | 'nghia';
type KieuLuat = 'muc' | 'doi' | 'tron';
function cauHinh(cap: number) {
  return {
    soMau: cap <= 2 ? 4 : 5,
    hanMs: Math.round(Math.max(1.15, 3.6 - 0.2 * (cap - 1)) * 1000),
    lech: Math.min(0.85, 0.6 + cap * 0.025),
    kieu: (cap <= 4 ? 'muc' : cap <= 6 ? 'doi' : 'tron') as KieuLuat,
    nhieu: cap >= 9,
    coDoi: cap >= 12,
  };
}
const heSo = (chuoi: number) => (chuoi >= 12 ? 3 : chuoi >= 5 ? 2 : 1);

type Cau = { id: number; chu: number; muc: number; luat: Luat; nen: number; xoay: number; dx: number; co: number };
const ngauNhien = (n: number) => Math.floor(Math.random() * n);

type Pha = 'choi' | 'len' | 'het';
type Mo = {
  cap: number; mang: number; diem: number; chuoi: number; dungCap: number; tongDung: number; tongSai: number;
  luatDoi: Luat; cau: Cau; pha: Pha; hetHan: number; tamTu: number;
  loe: 'dung' | 'sai' | null; loeId: number; doiLuatId: number; dongBang: number;
};

function taoCau(cap: number, luatDoi: Luat, truoc: Cau | null, id: number): Cau {
  const c = cauHinh(cap);
  for (;;) {
    const chu = ngauNhien(c.soMau);
    const muc = Math.random() < c.lech ? (chu + 1 + ngauNhien(c.soMau - 1)) % c.soMau : chu;
    if (truoc && truoc.chu === chu && truoc.muc === muc) continue;
    const luat: Luat = c.kieu === 'muc' ? 'muc' : c.kieu === 'doi' ? luatDoi : Math.random() < 0.5 ? 'muc' : 'nghia';
    let nen = -1;
    if (c.nhieu) { do nen = ngauNhien(c.soMau); while (nen === chu || nen === muc); }
    return {
      id, chu, muc, luat, nen,
      xoay: c.nhieu ? Math.round((Math.random() - 0.5) * 16) : 0,
      dx: c.nhieu ? Math.round((Math.random() - 0.5) * 18) : 0,
      co: c.coDoi ? 0.75 + Math.random() * 0.4 : 1,
    };
  }
}

export default function StroopGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const theRef = useRef<HTMLDivElement>(null);
  const k = useKhungChoi(gocRef);

  const g = useRef<Mo | null>(null);
  if (!g.current) {
    g.current = {
      cap: 1, mang: MANG, diem: 0, chuoi: 0, dungCap: 0, tongDung: 0, tongSai: 0,
      luatDoi: 'muc', cau: taoCau(1, 'muc', null, 1), pha: 'len', hetHan: 0, tamTu: 0,
      loe: null, loeId: 0, doiLuatId: 0, dongBang: 1,
    };
  }
  const m0 = g.current;
  const [v, setV] = useState<Mo>(() => ({ ...m0 }));
  const dong = useCallback(() => setV({ ...g.current! }), []);

  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const tamRef = useRef(false);
  const henLen = useRef<ReturnType<typeof setTimeout>>();
  const henLoe = useRef<ReturnType<typeof setTimeout>>();

  const ketThuc = useCallback(() => {
    const m = g.current!;
    m.pha = 'het';
    dong();
    if (daBao.current || !onScore) return;
    daBao.current = true;
    onScore(Math.min(TRAN, Math.round(m.diem)), Math.round((Date.now() - t0.current) / 1000));
  }, [onScore, dong]);

  /** Câu mới + đặt hạn giờ. */
  const cauMoi = useCallback(() => {
    const m = g.current!;
    m.cau = taoCau(m.cap, m.luatDoi, m.cau, m.cau.id + 1);
    m.hetHan = performance.now() + cauHinh(m.cap).hanMs;
  }, []);

  /** Mở cấp (sau băng "Cấp N"): bắt đầu tính giờ câu đầu. */
  const moCap = useCallback(() => {
    const m = g.current!;
    if (m.pha !== 'len') return;
    m.pha = 'choi';
    cauMoi();
    dong();
  }, [cauMoi, dong]);

  const henMoCap = useCallback((ms: number) => {
    clearTimeout(henLen.current);
    henLen.current = setTimeout(moCap, ms);
  }, [moCap]);

  // Cấp 1: băng "Cấp 1" rồi mới bắt đầu.
  useEffect(() => { henMoCap(1200); return () => clearTimeout(henLen.current); }, [henMoCap]);
  useEffect(() => () => clearTimeout(henLoe.current), []);

  const loe = (kieu: 'dung' | 'sai') => {
    const m = g.current!;
    m.loe = kieu; m.loeId += 1;
    clearTimeout(henLoe.current);
    henLoe.current = setTimeout(() => { g.current!.loe = null; dong(); }, 260);
  };

  const matMang = useCallback((hetGio: boolean) => {
    const m = g.current!;
    m.mang -= 1; m.chuoi = 0; m.tongSai += 1;
    sfx('sai');
    rung(theRef.current);
    if (theRef.current && hetGio) {
      const r = theRef.current.getBoundingClientRect();
      diemBay(theRef.current, r.width / 2, r.height * 0.22, vi ? 'Hết giờ!' : 'Too slow!', '#fb7185');
    }
    loe('sai');
    if (m.mang <= 0) { ketThuc(); return; }
    cauMoi();
    dong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cauMoi, dong, ketThuc, vi]);

  // Đồng hồ câu: RAF kiểm hạn (không setState mỗi khung — thanh thời gian là animation CSS).
  useEffect(() => {
    let raf = 0;
    const vong = () => {
      const m = g.current!;
      if (m.pha === 'choi' && !tamRef.current && performance.now() > m.hetHan) matMang(true);
      raf = requestAnimationFrame(vong);
    };
    raf = requestAnimationFrame(vong);
    return () => cancelAnimationFrame(raf);
  }, [matMang]);

  // Tạm dừng: dời hạn câu; đang chờ băng cấp thì chờ lại.
  useEffect(() => {
    if (k.tam === tamRef.current) return;
    const m = g.current!;
    if (k.tam) {
      tamRef.current = true;
      m.tamTu = performance.now();
      clearTimeout(henLen.current);
      return;
    }
    tamRef.current = false;
    m.hetHan += performance.now() - m.tamTu;
    if (m.pha === 'len') henMoCap(700);
  }, [k.tam, henMoCap]);

  const tra = useCallback((chon: number) => {
    const m = g.current!;
    if (m.pha !== 'choi' || tamRef.current) return;
    const c = cauHinh(m.cap);
    if (chon >= c.soMau) return;
    const dapAn = m.cau.luat === 'muc' ? m.cau.muc : m.cau.chu;
    const the = theRef.current;
    if (chon !== dapAn) { matMang(false); return; }

    const conLai = m.hetHan - performance.now();
    m.chuoi += 1; m.dungCap += 1; m.tongDung += 1;
    const cong = Math.round((8 + m.cap) * heSo(m.chuoi)) + (conLai > c.hanMs * 0.6 ? 3 : 0);
    m.diem = Math.min(TRAN, m.diem + cong);
    if (m.chuoi >= 3) sfx('combo', { muc: m.chuoi - 2 }); else sfx('dung');
    if (the) {
      const r = the.getBoundingClientRect();
      diemBay(the, r.width / 2, r.height * 0.24, `+${cong}`, MAU[m.cau.muc]!.hex);
      phaoGiay(the, { x: r.width / 2, y: r.height / 2, it: true, mau: [MAU[m.cau.muc]!.hex, '#ffffff', '#f0abfc'] });
    }
    loe('dung');

    if (m.dungCap >= CAU_MOI_CAP) {
      // Lên cấp: băng + tiếng, nghỉ một nhịp rồi mới tính giờ câu kế.
      m.cap += 1; m.dungCap = 0; m.pha = 'len'; m.dongBang += 1;
      const moi = cauHinh(m.cap);
      if (moi.kieu === 'doi' && cauHinh(m.cap - 1).kieu !== 'doi') m.luatDoi = 'muc';
      sfx('lenCap');
      m.cau = taoCau(m.cap, m.luatDoi, m.cau, m.cau.id + 1);
      dong();
      if (!tamRef.current) henMoCap(1300);
      return;
    }
    if (c.kieu === 'doi' && m.dungCap % DOI_SAU === 0) {
      m.luatDoi = m.luatDoi === 'muc' ? 'nghia' : 'muc';
      m.doiLuatId += 1;
      sfx('nhay');
    }
    cauMoi();
    dong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matMang, cauMoi, dong, henMoCap]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const so = Number(e.key);
      if (so >= 1 && so <= MAU.length) { e.preventDefault(); tra(so - 1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [tra]);

  /* ───────────── Vẽ ───────────── */
  const c = cauHinh(v.cap);
  const cau = v.cau;
  const W = Math.round(Math.max(270, Math.min(k.w - 8, k.fs ? 880 : 540)));
  const cao = Math.round(Math.max(170, Math.min(W * 0.48, k.h - 270, k.fs ? 420 : 260)));
  const nut = Math.round(Math.max(46, Math.min(k.fs ? 100 : 72, (W - 16 * (c.soMau - 1)) / c.soMau)));
  const hs = heSo(v.chuoi);
  const capKe = cauHinh(v.cap);

  return (
    <div ref={gocRef} className={s.goc} data-tam={k.tam} style={{ width: W, ['--w' as string]: `${W}px`, ['--nut' as string]: `${nut}px` }}>
      <div className={s.hud}>
        <div className={s.chip}><span>{vi ? 'Cấp' : 'Level'}</span><b>{v.cap}</b></div>
        <div className={s.chip}><span>{vi ? 'Điểm' : 'Score'}</span><b>{v.diem.toLocaleString()}</b></div>
        <div className={s.chip}><span>✓</span><b>{v.tongDung}</b><span>✗</span><b>{v.tongSai}</b></div>
        {v.chuoi >= 3 && <div key={hs * 1000 + Math.min(v.chuoi, 3)} className={s.combo} data-hs={hs}><Flame size={14} /> {v.chuoi}{hs > 1 ? ` · ×${hs}` : ''}</div>}
        <div className={s.tim} aria-label={`${v.mang} ${vi ? 'mạng' : 'lives'}`}>
          {Array.from({ length: MANG }, (_, i) => <Heart key={i} size={18} data-con={i < v.mang} />)}
        </div>
      </div>

      <div className={s.tienDo} aria-hidden="true">
        {Array.from({ length: CAU_MOI_CAP }, (_, i) => <i key={i} data-xong={i < v.dungCap} />)}
      </div>

      <div
        ref={theRef}
        className={s.the}
        style={{ height: cao, ['--nen' as string]: cau.nen >= 0 ? MAU[cau.nen]!.hex : 'transparent' }}
        data-luat={cau.luat}
        data-loe={v.loe}
        data-nhieu={cau.nen >= 0}
      >
        {v.pha !== 'len' && (
          <div key={`l${cau.id}`} className={s.nhanLuat} data-luat={cau.luat}>
            {cau.luat === 'muc' ? <Palette size={14} /> : <BookOpen size={14} />}
            {cau.luat === 'muc' ? (vi ? 'Chọn MÀU MỰC' : 'Pick the INK colour') : (vi ? 'Chọn theo NGHĨA chữ' : 'Pick what the WORD says')}
          </div>
        )}
        {v.pha === 'choi' && (
          <span
            key={cau.id}
            className={s.chu}
            style={{
              color: MAU[cau.muc]!.hex,
              fontSize: `${Math.round(Math.min(W * 0.16, cao * 0.42) * cau.co)}px`,
              ['--xoay' as string]: `${cau.xoay}deg`, ['--dx' as string]: `${cau.dx}px`,
            }}
          >
            {vi ? MAU[cau.chu]!.vi : MAU[cau.chu]!.en}
          </span>
        )}
        {v.pha === 'choi' && (
          <div className={s.dongHo}><i key={cau.id} style={{ animationDuration: `${c.hanMs}ms` }} /></div>
        )}
        {v.pha === 'len' && (
          <div key={`b${v.dongBang}`} className={s.bangCap}>
            <b>{vi ? 'Cấp' : 'Level'} {v.cap}</b>
            <span>
              {capKe.kieu === 'tron'
                ? (vi ? 'Khung HỒNG = màu mực · khung VÀNG = nghĩa' : 'PINK frame = ink · GOLD frame = word')
                : capKe.kieu === 'doi'
                  ? (vi ? `Luật đổi sau mỗi ${DOI_SAU} câu đúng` : `Rule flips every ${DOI_SAU} correct`)
                  : (vi ? `${capKe.soMau} màu · ${(capKe.hanMs / 1000).toFixed(1)} giây/câu` : `${capKe.soMau} colours · ${(capKe.hanMs / 1000).toFixed(1)}s each`)}
            </span>
          </div>
        )}
        {v.doiLuatId > 0 && v.pha === 'choi' && c.kieu === 'doi' && v.dungCap > 0 && v.dungCap % DOI_SAU === 0 && (
          <div key={`d${v.doiLuatId}`} className={s.doiLuat}>{vi ? 'Đổi luật!' : 'Rule switch!'}</div>
        )}
      </div>

      <div className={s.nut}>
        {MAU.slice(0, c.soMau).map((m, i) => (
          <button
            key={m.hex}
            type="button"
            style={{ ['--m' as string]: m.hex }}
            onPointerDown={(e) => { e.preventDefault(); tra(i); }}
            aria-label={vi ? m.vi : m.en}
            tabIndex={-1}
          >
            <kbd>{i + 1}</kbd>
          </button>
        ))}
      </div>
      <p className={s.goiY}>
        {vi
          ? `Bấm ô màu (hoặc phím 1–${c.soMau}). Đúng liền tay để nhân điểm; sai hoặc hết giờ mất 1 mạng.`
          : `Tap a colour (or keys 1–${c.soMau}). Streaks multiply points; a miss or timeout costs a life.`}
      </p>
    </div>
  );
}
