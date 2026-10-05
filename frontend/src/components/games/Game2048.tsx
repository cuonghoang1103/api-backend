'use client';

/**
 * 2048 — chiến lược gộp số. Trượt cả bảng; hai ô cùng số chạm nhau thì gộp.
 *
 * Nâng cấp 05/10/2026:
 *  - CẤP theo mục tiêu: cấp 1 cần ô 32, mỗi cấp gấp đôi (64 → 128 → … → 2048 ở cấp 7 → 65536
 *    ở cấp 12). Chạm mục tiêu ⇒ băng "Cấp N" + âm lên cấp + pháo giấy, +1 lượt hoàn tác.
 *  - HOÀN TÁC GIỚI HẠN: 2 lượt lúc đầu, +1 mỗi cấp, tối đa 5 (phím U / Ctrl+Z). Hết nước mà
 *    còn lượt thì được chọn hoàn tác hay kết thúc.
 *  - Ô nổi khối (viền sáng trên, mép dày dưới, bóng đổ), màu theo giá trị chuyển dần sứ →
 *    trời → ngọc → vàng → cam → hồng → tím, ô ≥128 phát sáng; gộp thì nảy + bụi sao + điểm bay.
 *  - Chuỗi: các nước liên tiếp có gộp ⇒ ×N; một nước gộp nhiều cặp ⇒ âm combo cao dần.
 *
 * Mỗi ô là một ĐỐI TƯỢNG có id riêng, vẽ bằng `transform: translate` theo hàng/cột —
 * CSS tự trượt mượt từ chỗ cũ sang chỗ mới. Điểm = tổng giá trị các lần gộp (luật gốc,
 * trần máy chủ 400 000 không đổi). Hết nước đi ⇒ báo điểm một lần.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Undo2, Flame, Target, Trophy } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './game2048.module.css';

type O = { id: number; v: number; r: number; c: number; moi?: boolean; gop?: boolean; xoa?: boolean };
type Huong = 'trai' | 'phai' | 'len' | 'xuong';
const N = 4;
const HOAN_TAC_DAU = 2, HOAN_TAC_TOI_DA = 5;
const mucTieu = (cap: number) => 2 ** (cap + 4); // cấp 1 → 32, cấp 7 → 2048
let demId = 1;

function themNgauNhien(ds: O[]): O[] {
  const trong: [number, number][] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!ds.some((o) => !o.xoa && o.r === r && o.c === c)) trong.push([r, c]);
  if (!trong.length) return ds;
  const [r, c] = trong[Math.floor(Math.random() * trong.length)]!;
  return [...ds, { id: demId++, v: Math.random() < 0.9 ? 2 : 4, r, c, moi: true }];
}

/** Trượt theo một hướng. Trả về bảng mới, điểm cộng, các ô vừa gộp, và có gì di chuyển không. */
function truot(ds0: O[], h: Huong): { ds: O[]; cong: number; doi: boolean; gop: O[] } {
  const ds = ds0.filter((o) => !o.xoa).map((o) => ({ ...o, moi: false, gop: false }));
  let cong = 0, doi = false;
  const ra: O[] = [];
  const gopDs: O[] = [];
  const ngang = h === 'trai' || h === 'phai';
  for (let k = 0; k < N; k++) {
    const dong = ds
      .filter((o) => (ngang ? o.r === k : o.c === k))
      .sort((a, b) => {
        const ka = ngang ? a.c : a.r, kb = ngang ? b.c : b.r;
        return h === 'trai' || h === 'len' ? ka - kb : kb - ka;
      });
    let viTri = 0;
    for (let i = 0; i < dong.length; i++) {
      const o = dong[i]!;
      const sau = dong[i + 1];
      const dat = (x: O, p: number) => {
        const col = h === 'trai' ? p : h === 'phai' ? N - 1 - p : x.c;
        const row = h === 'len' ? p : h === 'xuong' ? N - 1 - p : x.r;
        if (x.r !== row || x.c !== col) doi = true;
        x.r = row; x.c = col;
      };
      if (sau && sau.v === o.v) {
        dat(o, viTri); dat(sau, viTri);
        o.xoa = true; sau.xoa = true; // hai ô cũ trượt vào chỗ rồi biến mất…
        const g: O = { id: demId++, v: o.v * 2, r: o.r, c: o.c, gop: true }; // …ô mới nảy lên
        ra.push(o, sau, g);
        gopDs.push(g);
        cong += g.v; doi = true; i++;
      } else {
        dat(o, viTri);
        ra.push(o);
      }
      viTri++;
    }
  }
  return { ds: ra, cong, doi, gop: gopDs };
}

function conNuoc(ds: O[]): boolean {
  const song = ds.filter((o) => !o.xoa);
  if (song.length < N * N) return true;
  const o = (r: number, c: number) => song.find((x) => x.r === r && x.c === c)?.v;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (o(r, c) === o(r, c + 1) || o(r, c) === o(r + 1, c)) return true;
  return false;
}

/** Bảng màu chuyển dần theo log2: sứ → trời → ngọc → lá → vàng → cam → đỏ → hồng → tím → chàm → lục lam. */
const MAU: Record<number, [string, string]> = {
  2: ['#eef2f7', '#4b5563'], 4: ['#dbeafe', '#1e3a8a'], 8: ['#7dd3fc', '#0c3a57'], 16: ['#5eead4', '#064e3b'],
  32: ['#86efac', '#14532d'], 64: ['#fde047', '#713f12'], 128: ['#fdba74', '#7c2d12'], 256: ['#fb923c', '#ffffff'],
  512: ['#f87171', '#ffffff'], 1024: ['#f472b6', '#ffffff'], 2048: ['#c084fc', '#ffffff'], 4096: ['#818cf8', '#ffffff'],
  8192: ['#22d3ee', '#ffffff'], 16384: ['#2dd4bf', '#ffffff'], 32768: ['#facc15', '#422006'], 65536: ['#f43f5e', '#ffffff'],
};
const mauO = (v: number) => MAU[v] ?? ['#0f172a', '#facc15'];

/* ── Khung co giãn ── */
function useKhung(ref: React.RefObject<HTMLElement | null>) {
  const [k, setK] = useState({ w: 640, h: 460 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const san = el.parentElement?.parentElement ?? null;
    const doLai = () => {
      const fs = !!document.fullscreenElement;
      const w = Math.floor(san?.clientWidth || Math.min(window.innerWidth - 32, 900));
      const h = Math.floor(fs ? window.innerHeight - 84 : Math.min(720, Math.max(400, window.innerHeight - 170)));
      setK((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    doLai();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(doLai) : null;
    if (san) ro?.observe(san);
    window.addEventListener('resize', doLai);
    document.addEventListener('fullscreenchange', doLai);
    return () => { ro?.disconnect(); window.removeEventListener('resize', doLai); document.removeEventListener('fullscreenchange', doLai); };
  }, [ref]);
  return k;
}

type AnhChup = { ds: O[]; diem: number; chuoi: number };

export default function Game2048({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const banRef = useRef<HTMLDivElement>(null);
  const kh = useKhung(gocRef);

  const [ds, setDs] = useState<O[]>(() => themNgauNhien(themNgauNhien([])));
  const [diem, setDiem] = useState(0);
  const [congNoi, setCongNoi] = useState<{ v: number; k: number } | null>(null);
  const [het, setHet] = useState(false);
  const [cap, setCap] = useState(1);
  const [chuoi, setChuoi] = useState(0);
  const [luotHt, setLuotHt] = useState(HOAN_TAC_DAU);
  const [lichSu, setLichSu] = useState<AnhChup[]>([]);
  const [bang, setBang] = useState<{ cap: number; k: number } | null>(null);
  const daBao = useRef(false);
  const t0 = useRef(Date.now());
  const [best, setBest] = useState(0);
  useEffect(() => { try { setBest(Number(localStorage.getItem('game:2048:best') || 0)); } catch { /* bỏ qua */ } }, []);
  const henGio = useRef<number[]>([]);
  const hen = (fn: () => void, ms: number) => { henGio.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => henGio.current.forEach((t) => clearTimeout(t)), []);

  // Trạng thái đọc qua ref: phím/vuốt dồn dập tới trước khi React vẽ lại, và hàm cập nhật
  // state phải THUẦN (StrictMode chạy hai lần) ⇒ tính nước đi ở NGOÀI setState.
  const st = useRef({ ds, diem, cap, chuoi, luotHt, lichSu, het });
  st.current = { ds, diem, cap, chuoi, luotHt, lichSu, het };

  const dungRef = useRef(paused);
  dungRef.current = paused;
  const dangDung = () => dungRef.current;

  const bao = useCallback((d: number) => {
    if (daBao.current) return;
    daBao.current = true;
    try { if (d > Number(localStorage.getItem('game:2048:best') || 0)) localStorage.setItem('game:2048:best', String(d)); } catch { /* bỏ qua */ }
    onScore?.(d, Math.round((Date.now() - t0.current) / 1000));
  }, [onScore]);

  const toaDo = (r: number, c: number) => {
    const goc = gocRef.current, ban = banRef.current;
    if (!goc || !ban) return null;
    const a = goc.getBoundingClientRect(), b = ban.getBoundingClientRect();
    const k = b.width * 0.03, o = (b.width - 5 * k) / 4;
    return { x: b.left - a.left + k + c * (o + k) + o / 2, y: b.top - a.top + k + r * (o + k) + o / 2 };
  };

  const di = useCallback((h: Huong) => {
    const cur = st.current;
    if (cur.het || daBao.current || dangDung()) return;
    const kq = truot(cur.ds, h);
    if (!kq.doi) return;
    const moi = themNgauNhien(kq.ds);
    st.current.ds = moi;
    setDs(moi);
    const ls = [...cur.lichSu.slice(-(HOAN_TAC_TOI_DA - 1)), { ds: cur.ds.filter((o) => !o.xoa).map((o) => ({ ...o, moi: false, gop: false })), diem: cur.diem, chuoi: cur.chuoi }];
    st.current.lichSu = ls;
    setLichSu(ls);

    if (kq.cong) {
      const diemMoi = cur.diem + kq.cong;
      const ch = cur.chuoi + 1;
      st.current.diem = diemMoi;
      st.current.chuoi = ch;
      setDiem(diemMoi);
      setChuoi(ch);
      setCongNoi({ v: kq.cong, k: Date.now() });
      if (kq.gop.length >= 2) sfx('combo', { muc: Math.min(8, kq.gop.length + Math.floor(ch / 3)) });
      else sfx(ch >= 4 ? 'combo' : 'gop', { muc: Math.min(8, ch - 2) });
      // Hiệu ứng ở ô lớn nhất vừa gộp — sau khi trượt xong.
      const lon = kq.gop.reduce((m, g) => (g.v > m.v ? g : m), kq.gop[0]!);
      hen(() => {
        const p = toaDo(lon.r, lon.c);
        if (!p) return;
        diemBay(gocRef.current, p.x, p.y - 10, `+${kq.cong}`, lon.v >= 128 ? '#fde047' : '#86efac');
        if (lon.v >= 16) phaoGiay(gocRef.current, { x: p.x, y: p.y, it: true, mau: [mauO(lon.v)[0], '#ffffff', '#fde047'] });
      }, 110);
    } else {
      st.current.chuoi = 0;
      setChuoi(0);
      sfx('truot');
    }

    // Lên cấp: ô lớn nhất chạm mục tiêu (có thể vượt nhiều cấp một lúc với ô 4 hiếm hoi — lặp).
    const lonNhat = moi.reduce((m, o) => (o.xoa ? m : Math.max(m, o.v)), 0);
    let c = cur.cap;
    while (lonNhat >= mucTieu(c)) c++;
    if (c > cur.cap) {
      st.current.cap = c;
      setCap(c);
      st.current.luotHt = Math.min(HOAN_TAC_TOI_DA, cur.luotHt + (c - cur.cap));
      setLuotHt(st.current.luotHt);
      setBang({ cap: c, k: Date.now() });
      hen(() => { sfx('lenCap'); phaoGiay(gocRef.current); }, 180);
    }
    if (!conNuoc(moi)) {
      st.current.het = true;
      setHet(true);
      hen(() => sfx('sai'), 300);
      // Không còn lượt hoàn tác ⇒ tự kết thúc sau hoạt cảnh.
      if (st.current.luotHt <= 0) hen(() => bao(st.current.diem), 1600);
    }
  }, [bao]); // eslint-disable-line react-hooks/exhaustive-deps

  const hoanTac = useCallback(() => {
    const cur = st.current;
    const b = cur.lichSu[cur.lichSu.length - 1];
    if (!b || cur.luotHt <= 0 || daBao.current || dangDung()) { if (!b || cur.luotHt <= 0) rung(banRef.current); return; }
    sfx('lat');
    const ds2 = b.ds.map((o) => ({ ...o }));
    Object.assign(st.current, { ds: ds2, diem: b.diem, chuoi: b.chuoi, lichSu: cur.lichSu.slice(0, -1), luotHt: cur.luotHt - 1, het: false });
    setDs(ds2);
    setDiem(b.diem);
    setChuoi(b.chuoi);
    setLichSu(cur.lichSu.slice(0, -1));
    setLuotHt(cur.luotHt - 1);
    setHet(false);
  }, []);

  // Dọn ô đã gộp sau khi hoạt cảnh trượt xong — không thì mảng phình mãi.
  useEffect(() => {
    if (!ds.some((o) => o.xoa)) return;
    const t = setTimeout(() => setDs((x) => x.filter((o) => !o.xoa)), 170);
    return () => clearTimeout(t);
  }, [ds]);

  useEffect(() => {
    if (!bang) return;
    const t = window.setTimeout(() => setBang(null), 1800);
    return () => clearTimeout(t);
  }, [bang]);

  useEffect(() => {
    const m: Record<string, Huong> = { arrowleft: 'trai', arrowright: 'phai', arrowup: 'len', arrowdown: 'xuong', a: 'trai', d: 'phai', w: 'len', s: 'xuong' };
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'z') { e.preventDefault(); hoanTac(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (k === 'u') { hoanTac(); return; }
      const x = m[k];
      if (x) { e.preventDefault(); di(x); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [di, hoanTac]);

  // Vuốt trên màn cảm ứng / kéo chuột.
  const cham = useRef<{ x: number; y: number } | null>(null);
  const batDauVuot = (e: React.PointerEvent) => { cham.current = { x: e.clientX, y: e.clientY }; };
  const ketVuot = (e: React.PointerEvent) => {
    const a = cham.current; cham.current = null;
    if (!a) return;
    const dx = e.clientX - a.x, dy = e.clientY - a.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    di(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'phai' : 'trai') : (dy > 0 ? 'xuong' : 'len'));
  };

  /* ── Bố cục ── */
  const W = Math.min(kh.w, 1000);
  const H = Math.max(260, kh.h - 74 - 30);
  const ban = Math.floor(Math.max(240, Math.min(W, H, 720)));
  const k = ban * 0.03;
  const oPx = (ban - 5 * k) / 4;

  const lon = ds.reduce((m, o) => (o.xoa ? m : Math.max(m, o.v)), 0);
  const muc = mucTieu(cap);
  const tienDo = Math.min(1, Math.log2(Math.max(2, lon)) / Math.log2(muc));

  return (
    <div ref={gocRef} className={s.goc} style={{ width: Math.min(W, Math.max(ban, 420)), ['--o' as string]: `${oPx}px`, ['--k' as string]: `${k}px` }}>
      <div className={s.hud}>
        <div className={s.hop} data-to="true"><span>{vi ? 'Điểm' : 'Score'}</span><b>{diem.toLocaleString()}</b>{congNoi && <i key={congNoi.k} className={s.bay}>+{congNoi.v}</i>}</div>
        <div className={s.hop}><span>{vi ? 'Kỷ lục' : 'Best'}</span><b>{Math.max(best, diem).toLocaleString()}</b></div>
        <div className={s.hop} data-cap="true">
          <span>{vi ? 'Cấp' : 'Level'} {cap}</span>
          <b><Target size={13} /> {muc >= 1024 ? `${muc / 1024}K` : muc}</b>
          <em className={s.tienDo}><i style={{ transform: `scaleX(${tienDo})` }} /></em>
        </div>
        <div className={s.hop} data-nong={chuoi >= 3}><span>{vi ? 'Chuỗi' : 'Chain'}</span><b><Flame size={13} /> ×{chuoi}</b></div>
        <button type="button" className={s.nutHt} onClick={hoanTac} disabled={!lichSu.length || luotHt <= 0} title={vi ? 'Hoàn tác (U)' : 'Undo (U)'}>
          <Undo2 size={16} /><b>{luotHt}</b>
        </button>
      </div>

      <div ref={banRef} className={s.ban} style={{ width: ban, height: ban, touchAction: 'none' }} onPointerDown={batDauVuot} onPointerUp={ketVuot} onPointerCancel={() => { cham.current = null; }}>
        {Array.from({ length: N * N }, (_, i) => <div key={i} className={s.nen} />)}
        {ds.map((o) => {
          const [nen, chu] = mauO(o.v);
          const so = String(o.v).length;
          return (
            <div
              key={o.id}
              className={s.o}
              data-moi={o.moi}
              data-gop={o.gop}
              data-xoa={o.xoa}
              data-sang={o.v >= 128}
              style={{ ['--r' as string]: o.r, ['--c' as string]: o.c, ['--nen' as string]: nen, color: chu, zIndex: o.xoa ? 1 : o.gop ? 3 : 2 }}
            >
              <span style={{ fontSize: so >= 5 ? '0.5em' : so === 4 ? '0.62em' : so === 3 ? '0.78em' : '1em' }}>{o.v}</span>
            </div>
          );
        })}
        {het && !daBao.current && (
          <div className={s.lop}>
            <Trophy size={40} />
            <b>{vi ? 'Hết nước đi' : 'No moves left'}</b>
            <span>{diem.toLocaleString()} {vi ? 'điểm' : 'pts'} · {vi ? 'ô lớn nhất' : 'top tile'} {lon}</span>
            {luotHt > 0 && lichSu.length > 0 && (
              <div className={s.nutLop}>
                <button type="button" onClick={hoanTac}><Undo2 size={16} /> {vi ? `Hoàn tác (${luotHt})` : `Undo (${luotHt})`}</button>
                <button type="button" data-chinh="true" onClick={() => bao(st.current.diem)}>{vi ? 'Kết thúc' : 'Finish'}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className={s.goiY}>
        <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> / <kbd>WASD</kbd> {vi ? 'hoặc vuốt · ' : 'or swipe · '}<kbd>U</kbd> {vi ? 'hoàn tác' : 'undo'} · {vi ? `Mục tiêu cấp ${cap}: ô ${muc}` : `Level ${cap} goal: ${muc}`}
      </p>

      {bang && (
        <div key={bang.k} className={s.bang} aria-live="polite">
          <small>{vi ? 'Lên cấp' : 'Level up'}</small>
          <b>{bang.cap}</b>
          <span>{vi ? 'Mục tiêu mới' : 'Next goal'}: {mucTieu(bang.cap)} · +1 {vi ? 'hoàn tác' : 'undo'}</span>
        </div>
      )}
    </div>
  );
}
