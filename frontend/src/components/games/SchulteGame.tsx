'use client';

/**
 * Bảng Schulte — luyện TẬP TRUNG và TẦM NHÌN NGOẠI VI (bài tập kinh điển của tâm lý học, dùng
 * để luyện đọc nhanh): bấm các số theo thứ tự tăng dần nhanh nhất có thể, mắt giữ ở chấm giữa.
 *
 * Nâng cấp 05/10/2026 — 12 cấp tăng dần, lưới 3×3 → 7×7, ba chế độ:
 *  - Thường: ô màu kẹo đều nhau.
 *  - Nhiễu: ô xoay lệch, cỡ chữ to nhỏ, màu lộn xộn — mắt không bám được vào "hình" quen.
 *  - Xen kẽ (kiểu bảng Gorbov–Schulte rút gọn): hai dãy CAM và NGỌC, bấm luân phiên
 *    cam 1 → ngọc 1 → cam 2 → ngọc 2… — luyện chuyển chú ý giữa hai dãy.
 *  Thứ tự cấp: 3×3 · 4×4 · 4×4 nhiễu · 5×5 · 5×5 nhiễu · 6×6 · 5×5 xen · 6×6 nhiễu · 7×7 ·
 *  6×6 xen · 7×7 nhiễu · 7×7 xen.
 *
 * Bấm sai cộng 1 giây phạt (không dừng vòng — bấm bừa phải tốn hơn bấm cẩn thận). Có bàn phím:
 * gõ số rồi đợi nửa giây (hoặc Enter).
 *
 * Điểm mỗi cấp = số ô × 400 / số giây × hệ số chế độ (thường 1, nhiễu 1,2, xen 1,5). Người rất
 * nhanh (~0,6 giây/ô) cả 12 cấp ≈ 9–10 nghìn; trần máy chủ 12 000 (vẫn kẹp trần cho chắc).
 *
 * Hợp đồng GameProps: chỉ chơi, gọi onScore đúng một lần. Tạm dừng dò qua class div bọc của
 * GameShell — đồng hồ không chạy lúc nghỉ.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, Flame, Crosshair } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './schulte.module.css';

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
type CheDo = 'thuong' | 'nhieu' | 'xen';
const CAP: { n: number; che: CheDo }[] = [
  { n: 3, che: 'thuong' }, { n: 4, che: 'thuong' }, { n: 4, che: 'nhieu' }, { n: 5, che: 'thuong' },
  { n: 5, che: 'nhieu' }, { n: 6, che: 'thuong' }, { n: 5, che: 'xen' }, { n: 6, che: 'nhieu' },
  { n: 7, che: 'thuong' }, { n: 6, che: 'xen' }, { n: 7, che: 'nhieu' }, { n: 7, che: 'xen' },
];
const HE_SO: Record<CheDo, number> = { thuong: 1, nhieu: 1.2, xen: 1.5 };
const PHAT_S = 1;
const TRAN = 12_000;
/** Băng "Cấp N" che giữa bàn — đồng hồ chỉ chạy (và mới bấm được) sau khi băng tan. */
const CHO_BANG = 950;

type O = { id: number; so: number; mau: 0 | 1 | null; xoay: number; co: number; hue: number };
type Can = { so: number; mau: 0 | 1 | null };

const tron = <T,>(a: T[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };

function taoBan(cap: number): { o: O[]; thuTu: Can[] } {
  const { n, che } = CAP[cap]!;
  const N = n * n;
  let nhan: Can[];
  let thuTu: Can[];
  if (che === 'xen') {
    const a = Math.ceil(N / 2), b = N - a;
    nhan = [...Array.from({ length: a }, (_, i) => ({ so: i + 1, mau: 0 as const })), ...Array.from({ length: b }, (_, i) => ({ so: i + 1, mau: 1 as const }))];
    thuTu = [];
    for (let i = 1; i <= a; i++) { thuTu.push({ so: i, mau: 0 }); if (i <= b) thuTu.push({ so: i, mau: 1 }); }
  } else {
    nhan = Array.from({ length: N }, (_, i) => ({ so: i + 1, mau: null }));
    thuTu = nhan.slice();
  }
  const o = tron(nhan.slice()).map((x, id): O => ({
    id, so: x.so, mau: x.mau,
    xoay: che === 'nhieu' ? Math.round((Math.random() - 0.5) * 30) : 0,
    co: che === 'nhieu' ? 0.75 + Math.random() * 0.5 : 1,
    hue: che === 'nhieu' ? Math.floor(Math.random() * 360) : x.mau === 0 ? 22 : x.mau === 1 ? 172 : 28 + ((id * 37) % 40),
  }));
  return { o, thuTu };
}

type Pha = 'choi' | 'xong' | 'het';
type Mo = {
  cap: number; ban: O[]; thuTu: Can[]; idx: number; xong: Set<number>;
  pha: Pha; batDau: number; nghiTong: number; tamTu: number; phat: number;
  diem: number; chuoi: number; saiId: number | null; saiDem: number;
  ketCap: { giay: number; cong: number } | null; lichSu: number[]; dongBang: number;
};

export default function SchulteGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const banRef = useRef<HTMLDivElement>(null);
  const k = useKhungChoi(gocRef);

  const g = useRef<Mo | null>(null);
  if (!g.current) {
    const b = taoBan(0);
    g.current = {
      cap: 0, ban: b.o, thuTu: b.thuTu, idx: 0, xong: new Set(),
      pha: 'choi', batDau: performance.now() + CHO_BANG, nghiTong: 0, tamTu: 0, phat: 0,
      diem: 0, chuoi: 0, saiId: null, saiDem: 0, ketCap: null, lichSu: [], dongBang: 1,
    };
  }
  const m0 = g.current;
  const [v, setV] = useState<Mo>(() => ({ ...m0, xong: new Set(m0.xong) }));
  const dong = useCallback(() => { const m = g.current!; setV({ ...m, xong: new Set(m.xong) }); }, []);
  const [giayHien, setGiayHien] = useState(0);

  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const tamRef = useRef(false);
  const henTiep = useRef<ReturnType<typeof setTimeout>>();
  const henSai = useRef<ReturnType<typeof setTimeout>>();

  /** Giây đã chơi của cấp hiện tại (đã trừ lúc tạm dừng, đã cộng phạt). */
  const giayCap = useCallback(() => {
    const m = g.current!;
    const den = tamRef.current ? m.tamTu : performance.now();
    return Math.max(0, (den - m.batDau - m.nghiTong) / 1000) + m.phat;
  }, []);

  // Đồng hồ: cập nhật ~10 lần/giây (đủ mượt cho số lẻ một chữ số, không tốn render mỗi khung).
  useEffect(() => {
    let raf = 0, cuoi = -1;
    const vong = () => {
      const m = g.current!;
      if (m.pha === 'choi') {
        const x = Math.floor(giayCap() * 10);
        if (x !== cuoi) { cuoi = x; setGiayHien(x / 10); }
      }
      raf = requestAnimationFrame(vong);
    };
    raf = requestAnimationFrame(vong);
    return () => cancelAnimationFrame(raf);
  }, [giayCap]);

  const ketThuc = useCallback(() => {
    const m = g.current!;
    m.pha = 'het';
    dong();
    if (daBao.current || !onScore) return;
    daBao.current = true;
    onScore(Math.min(TRAN, Math.round(m.diem)), Math.round((Date.now() - t0.current) / 1000));
  }, [onScore, dong]);

  const sangCap = useCallback(() => {
    const m = g.current!;
    if (m.cap + 1 >= CAP.length) { ketThuc(); return; }
    m.cap += 1;
    const b = taoBan(m.cap);
    m.ban = b.o; m.thuTu = b.thuTu; m.idx = 0; m.xong = new Set();
    m.pha = 'choi'; m.batDau = performance.now() + CHO_BANG; m.nghiTong = 0; m.phat = 0;
    m.ketCap = null; m.saiId = null; m.dongBang += 1;
    sfx('lenCap');
    dong();
  }, [dong, ketThuc]);

  const henSangCap = useCallback((ms: number) => {
    clearTimeout(henTiep.current);
    henTiep.current = setTimeout(sangCap, ms);
  }, [sangCap]);

  // Tạm dừng / tiếp tục.
  useEffect(() => {
    if (k.tam === tamRef.current) return;
    const m = g.current!;
    if (k.tam) {
      m.tamTu = performance.now();
      tamRef.current = true;
      clearTimeout(henTiep.current);
      return;
    }
    m.nghiTong += performance.now() - m.tamTu;
    tamRef.current = false;
    if (m.pha === 'xong') henSangCap(900);
  }, [k.tam, henSangCap]);

  useEffect(() => () => { clearTimeout(henTiep.current); clearTimeout(henSai.current); }, []);

  const toaDo = (id: number) => {
    const ban = banRef.current;
    const el = ban?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!ban || !el) return { x: 0, y: 0 };
    const a = ban.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
  };

  const bam = useCallback((id: number) => {
    const m = g.current!;
    if (m.pha !== 'choi' || tamRef.current || m.xong.has(id) || performance.now() < m.batDau + m.nghiTong) return;
    const o = m.ban[id]!;
    const can = m.thuTu[m.idx]!;
    const ban = banRef.current;
    if (o.so !== can.so || o.mau !== can.mau) {
      m.phat += PHAT_S; m.chuoi = 0; m.saiId = id; m.saiDem += 1;
      sfx('sai'); rung(ban);
      const { x, y } = toaDo(id);
      diemBay(ban, x, y - 10, `+${PHAT_S}s`, '#fb7185');
      clearTimeout(henSai.current);
      henSai.current = setTimeout(() => { if (g.current!.saiId === id) { g.current!.saiId = null; dong(); } }, 340);
      dong();
      return;
    }
    m.xong.add(id); m.idx += 1; m.chuoi += 1;
    if (m.chuoi > 0 && m.chuoi % 5 === 0) {
      sfx('combo', { muc: m.chuoi / 5 });
      const { x, y } = toaDo(id);
      phaoGiay(ban, { x, y, it: true, mau: ['#fde047', '#fb923c', '#f472b6', '#ffffff', '#5eead4'] });
    } else sfx('chon');

    if (m.idx < m.thuTu.length) { dong(); return; }
    // Xong cấp.
    const giay = giayCap();
    const { n, che } = CAP[m.cap]!;
    const cong = Math.round((n * n * 400) / Math.max(1, giay) * HE_SO[che]);
    m.diem = Math.min(TRAN, m.diem + cong);
    m.ketCap = { giay, cong };
    m.lichSu = [...m.lichSu, giay];
    m.pha = 'xong';
    setGiayHien(Math.floor(giay * 10) / 10);
    dong();
    sfx('dung');
    if (ban) {
      const r = ban.getBoundingClientRect();
      diemBay(ban, r.width / 2, r.height * 0.3, `+${cong}`, '#fde047');
      phaoGiay(ban, { it: true, x: r.width / 2, y: r.height / 2 });
    }
    if (!tamRef.current) henSangCap(m.cap + 1 >= CAP.length ? 1500 : 2100);
  }, [dong, giayCap, henSangCap]);

  // Bàn phím: gõ số (đợi 0,5 giây hoặc Enter); Space/Enter lúc nghỉ giữa cấp thì đi tiếp ngay.
  const go = useRef({ buf: '', hen: undefined as ReturnType<typeof setTimeout> | undefined });
  useEffect(() => {
    const go_ = go.current;
    const chot = () => {
      const m = g.current!;
      const so = Number(go.current.buf);
      go.current.buf = '';
      if (!so) return;
      const can = m.thuTu[m.idx];
      const o = m.ban.find((x) => x.so === so && !m.xong.has(x.id) && (can ? x.mau === can.mau : true))
        ?? m.ban.find((x) => x.so === so && !m.xong.has(x.id));
      if (o) bam(o.id);
    };
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || tamRef.current) return;
      const m = g.current!;
      if (m.pha === 'xong' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); clearTimeout(henTiep.current); sangCap(); return; }
      if (m.pha !== 'choi') return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        go.current.buf += e.key;
        clearTimeout(go.current.hen);
        // Còn số dài hơn bắt đầu bằng phần đã gõ (vd gõ "1" khi còn 12) thì đợi; không thì chốt ngay.
        const buf = go.current.buf;
        const conDai = m.ban.some((x) => !m.xong.has(x.id) && String(x.so).length > buf.length && String(x.so).startsWith(buf));
        if (!conDai) chot();
        else go.current.hen = setTimeout(chot, 550);
      } else if (e.key === 'Enter') { e.preventDefault(); clearTimeout(go.current.hen); chot(); }
    };
    window.addEventListener('keydown', h);
    return () => { window.removeEventListener('keydown', h); clearTimeout(go_.hen); };
  }, [bam, sangCap]);

  /* ───────────── Vẽ ───────────── */
  const { n, che } = CAP[v.cap]!;
  const can = v.thuTu[v.idx];
  const B = Math.round(Math.max(240, Math.min(k.w - 8, k.h - 200, k.fs ? 860 : 520)));
  const rong = Math.min(k.w, Math.max(B, 400));
  const tenCheDo = (c: CheDo) => (vi ? { thuong: 'Thường', nhieu: 'Nhiễu', xen: 'Xen kẽ' } : { thuong: 'Classic', nhieu: 'Noise', xen: 'Alternate' })[c];
  const capKe = CAP[v.cap];

  return (
    <div ref={gocRef} className={s.goc} style={{ width: rong, ['--b' as string]: `${B}px` }}>
      <div className={s.hud}>
        <div className={s.dongHo}><Timer size={16} /> <b>{giayHien.toFixed(1)}</b>s</div>
        <div className={s.can}>
          <span>{vi ? 'Tìm' : 'Find'}</span>
          <b key={`${v.cap}-${v.idx}`} data-mau={can?.mau ?? 'x'}>{can ? can.so : '✓'}</b>
        </div>
        <div className={s.chip}><span>{vi ? 'Cấp' : 'Level'}</span><b>{v.cap + 1}/{CAP.length}</b></div>
        <div className={s.chip}><span>{vi ? 'Điểm' : 'Score'}</span><b>{v.diem.toLocaleString()}</b></div>
        {v.chuoi >= 5 && <div key={Math.floor(v.chuoi / 5)} className={s.combo}><Flame size={14} /> {v.chuoi}</div>}
      </div>

      <div className={s.thanh}><i style={{ width: `${(v.idx / v.thuTu.length) * 100}%` }} /></div>

      <div
        ref={banRef}
        className={s.ban}
        style={{ ['--n' as string]: n, width: B, height: B }}
        data-che={che}
        data-pha={v.pha}
      >
        {v.ban.map((o) => (
          <button
            key={`${v.dongBang}-${o.id}`}
            type="button"
            data-id={o.id}
            className={s.o}
            style={{ ['--hue' as string]: o.hue, ['--xoay' as string]: `${o.xoay}deg`, ['--co' as string]: o.co }}
            data-mau={o.mau ?? 'x'}
            data-xong={v.xong.has(o.id)}
            data-sai={v.saiId === o.id}
            tabIndex={-1}
            onPointerDown={(e) => { e.preventDefault(); bam(o.id); }}
          >
            <span>{o.so}</span>
          </button>
        ))}
        <span className={s.tam} aria-hidden="true" />

        {v.pha === 'choi' && v.idx === 0 && (
          <div key={`b${v.dongBang}`} className={s.bangCap}>
            <b>{vi ? 'Cấp' : 'Level'} {v.cap + 1}</b>
            <span>{n}×{n} · {tenCheDo(che)}{che === 'xen' ? (vi ? ' — cam 1, ngọc 1, cam 2…' : ' — orange 1, teal 1, orange 2…') : ''}</span>
          </div>
        )}
        {v.pha !== 'choi' && v.ketCap && (
          <div className={s.lop}>
            <b>{v.pha === 'het' || v.cap + 1 >= CAP.length ? (vi ? 'Hoàn thành!' : 'All done!') : (vi ? 'Tuyệt!' : 'Nice!')}</b>
            <p><strong>{v.ketCap.giay.toFixed(1)}s</strong> · +{v.ketCap.cong}</p>
            <small>{(v.ketCap.giay / (n * n)).toFixed(2)} {vi ? 'giây/ô' : 's per cell'}</small>
            {v.pha === 'xong' && v.cap + 1 < CAP.length && (
              <em>{vi ? 'Tiếp: ' : 'Next: '}{CAP[v.cap + 1]!.n}×{CAP[v.cap + 1]!.n} · {tenCheDo(CAP[v.cap + 1]!.che)} — {vi ? 'Space để đi ngay' : 'Space to skip'}</em>
            )}
          </div>
        )}
      </div>

      <p className={s.goiY}>
        <Crosshair size={13} />
        {capKe?.che === 'xen'
          ? (vi ? 'Luân phiên hai màu: CAM 1 → NGỌC 1 → CAM 2 → NGỌC 2… Bấm sai +1 giây.' : 'Alternate colours: ORANGE 1 → TEAL 1 → ORANGE 2… Wrong tap = +1s.')
          : (vi ? 'Giữ mắt ở chấm giữa, dùng tầm nhìn ngoại vi. Bấm hoặc gõ số. Bấm sai +1 giây.' : 'Eyes on the centre dot, use peripheral vision. Tap or type the number. Wrong tap = +1s.')}
      </p>
    </div>
  );
}
