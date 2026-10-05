'use client';

/**
 * Ma trận IQ — SUY LUẬN QUY LUẬT kiểu Raven's Progressive Matrices, sinh tự động.
 *
 * Nâng cấp 05/10/2026: 15 CẤP tăng dần, 3 mạng, chuỗi đúng, băng "Cấp N", âm thanh,
 * bụi sao/điểm bay, ô đáp án LẬT 3D, khung co giãn theo GameShell (cả toàn màn hình).
 *
 * Mỗi ô = một nhóm hình mô tả bằng 6 thuộc tính: hình, số lượng, màu, kiểu tô, góc xoay,
 * và "nét" (bitmask 8 nét — dùng cho đề CHỒNG HÌNH). Mỗi đề gán vài luật theo hàng:
 *   - tăng dần (số lượng +1, xoay 45°/90° mỗi cột) · đủ bộ ba · giữ nguyên
 *   - cộng / trừ số lượng (cột 3 = cột 1 ± cột 2)
 *   - chồng hình: gộp nét (OR) · nét trùng thì mất (XOR) · bỏ nét của cột 2 (A − B)
 *
 * CHỐNG ĐỀ MƠ HỒ: sau khi sinh, với từng thuộc tính nhìn thấy được, thử MỌI luật khớp hai
 * hàng đầu — nếu có luật nào khớp mà đoán ra đáp án khác thì bỏ đề, sinh lại. 5 đáp án nhiễu
 * mỗi cái chỉ lệch một thuộc tính (đề chồng hình thì nhiễu là kết quả của phép chồng KHÁC) ⇒
 * không loại trừ được bằng "cái nào trông lạ", phải tìm ra luật thật.
 *
 * Sai/hết giờ: mất 1 mạng, làm đề KHÁC cùng cấp. Đúng: lên cấp. Hết mạng hoặc qua cấp 15 ⇒
 * báo điểm một lần. Điểm mỗi câu đúng = 60 + 14×cấp + thưởng giờ (≤50) + 8×min(chuỗi−1, 5).
 * Tối đa lý thuyết ≈ 3 810 (< trần 4 000).
 *
 * ⚠️ Không gọi đây là "IQ" có chuẩn hoá — chỉ là luyện suy luận quy luật.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Brain, Check, X, Heart, Flame } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './maTranIq.module.css';

/* ── Mô hình ô ── */
type O = { hinh: number; so: number; mau: number; to: number; xoay: number; net: number };
type ThuocTinh = keyof O;
type Luat = 'tang' | 'tang2' | 'boBa' | 'cong' | 'tru' | 'giu' | 'hop' | 'xor' | 'hieu';

const SO_HINH = 6; // 0 tròn · 1 vuông · 2 tam giác · 3 ngũ giác · 4 lục giác · 5 mũi tên
const SO_MAU = 5, SO_TO = 3, SO_XOAY = 8;
const MAU = ['#38bdf8', '#f472b6', '#fbbf24', '#a78bfa', '#34d399'];
const MAU_SANG = ['#e0f2fe', '#fce7f3', '#fef3c7', '#ede9fe', '#d1fae5'];
const TONG_CAP = 15;
const MANG = 3;
const giayCap = (cap: number) => 50 - cap; // 49 giây ở cấp 1 → 35 giây ở cấp 15

const rnd = (n: number) => Math.floor(Math.random() * n);
const tron = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j]!, b[i]!]; } return b; };
const day = (n: number) => Array.from({ length: n }, (_, i) => i);

/**
 * Góc xoay NHÌN THẤY được (bước 45°): tròn thì mọi góc như nhau; vuông đối xứng 90° ⇒ chu kỳ 2;
 * lục giác đối xứng 60° ⇒ 45k mod 60 lặp sau 4 bước; tam giác/ngũ giác/mũi tên: 8 góc đều khác.
 */
const xoayThay = (o: O) => (o.so < 0 || o.hinh === 0 ? 0 : o.hinh === 1 ? o.xoay % 2 : o.hinh === 4 ? o.xoay % 4 : o.xoay);
const giongNhau = (a: O, b: O) => {
  if (a.so !== b.so || a.net !== b.net) return false;
  if (a.so < 0) return true; // đề chỉ có nét — các thuộc tính hình không hiện ra
  return a.hinh === b.hinh && a.mau === b.mau && a.to === b.to && xoayThay(a) === xoayThay(b);
};
const mien: Record<ThuocTinh, number> = { hinh: SO_HINH, so: 4, mau: SO_MAU, to: SO_TO, xoay: SO_XOAY, net: 256 };

/* ── Cấu hình từng cấp: câu đầu dễ, thuộc tính "nhìn là thấy" trước ── */
type CauHinh = { attrs: ThuocTinh[]; soLuat: number; net: Luat | null; kho: boolean };
const TAT_CA: ThuocTinh[] = ['hinh', 'so', 'mau', 'to', 'xoay'];
const CAP: CauHinh[] = [
  { attrs: ['so', 'mau', 'hinh'], soLuat: 1, net: null, kho: false }, // 1
  { attrs: ['so', 'mau', 'hinh', 'to'], soLuat: 1, net: null, kho: false }, // 2
  { attrs: ['xoay', 'to', 'so'], soLuat: 1, net: null, kho: false }, // 3
  { attrs: ['so', 'mau', 'hinh', 'to'], soLuat: 2, net: null, kho: false }, // 4
  { attrs: [], soLuat: 0, net: 'hop', kho: false }, // 5 — chồng hình đầu tiên
  { attrs: ['so', 'mau', 'to', 'xoay'], soLuat: 2, net: null, kho: false }, // 6
  { attrs: ['so', 'mau', 'hinh', 'to'], soLuat: 2, net: null, kho: true }, // 7
  { attrs: [], soLuat: 0, net: 'xor', kho: false }, // 8
  { attrs: TAT_CA, soLuat: 2, net: null, kho: true }, // 9
  { attrs: ['mau', 'hinh', 'to'], soLuat: 1, net: 'hop', kho: false }, // 10
  { attrs: TAT_CA, soLuat: 3, net: null, kho: false }, // 11
  { attrs: [], soLuat: 0, net: 'hieu', kho: false }, // 12
  { attrs: TAT_CA, soLuat: 3, net: null, kho: true }, // 13
  { attrs: ['mau', 'hinh', 'to', 'xoay'], soLuat: 1, net: 'xor', kho: false }, // 14
  { attrs: ['mau', 'hinh', 'to', 'xoay'], soLuat: 2, net: 'hieu', kho: true }, // 15
];

const phep = (l: Luat, a: number, b: number) => (l === 'hop' ? a | b : l === 'xor' ? a ^ b : a & ~b & 255);
const maskNgauNhien = () => { let m = 0; const k = 2 + rnd(3); for (const b of tron(day(8)).slice(0, k)) m |= 1 << b; return m; };

type De = { maTran: O[]; dapAn: O; luat: [ThuocTinh, Luat][]; chiNet: boolean };

function thuSinh(ch: CauHinh): De | null {
  const chiNet = ch.soLuat === 0 && !!ch.net;
  let ung = tron(ch.attrs).slice(0, ch.soLuat);
  // Luật xoay cần hình mà 8 góc đều khác rõ (tam giác/mũi tên) ⇒ không đi cùng luật đổi hình.
  if (ung.includes('xoay') && ung.includes('hinh')) ung = ung.filter((t) => t !== 'hinh');
  const luat: [ThuocTinh, Luat][] = ung.map((t) => {
    const coThe: Luat[] = t === 'so' ? (ch.kho ? ['tang', 'boBa', 'cong', 'tru'] : ['tang', 'boBa', 'giu'])
      : t === 'xoay' ? ['tang', 'tang2', 'boBa'] : ['boBa', 'giu'];
    return [t, coThe[rnd(coThe.length)]!];
  });
  if (ch.net) luat.push(['net', ch.net]);
  const nen: O = {
    hinh: ung.includes('xoay') ? (rnd(2) ? 2 : 5) : rnd(SO_HINH),
    so: chiNet ? -1 : ch.net ? 0 : rnd(2),
    mau: rnd(SO_MAU), to: rnd(SO_TO), xoay: 0, net: 0,
  };
  const M: O[] = Array.from({ length: 9 }, () => ({ ...nen }));
  const dat = (r: number, c: number, t: ThuocTinh, v: number) => { M[r * 3 + c]![t] = v; };
  for (const [t, l] of luat) {
    const m = mien[t];
    if (l === 'giu') {
      const ba = tron(day(m)).slice(0, 3);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dat(r, c, t, ba[r]!);
    } else if (l === 'boBa') {
      const ba = tron(day(m)).slice(0, 3);
      const hv = tron([[0, 1, 2], [1, 2, 0], [2, 0, 1]]);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dat(r, c, t, ba[hv[r]![c]!]!);
    } else if (l === 'tang' || l === 'tang2') {
      const buoc = l === 'tang2' ? 2 : 1;
      for (let r = 0; r < 3; r++) {
        const goc = t === 'so' ? rnd(2) : rnd(m);
        for (let c = 0; c < 3; c++) dat(r, c, t, t === 'so' ? goc + c : (goc + c * buoc) % m);
      }
    } else if (l === 'cong') {
      for (let r = 0; r < 3; r++) { const a = rnd(2), b = rnd(2); dat(r, 0, t, a); dat(r, 1, t, b); dat(r, 2, t, a + b + 1); }
    } else if (l === 'tru') {
      for (let r = 0; r < 3; r++) {
        const c1 = 3 + rnd(2), c2 = 1 + rnd(c1 - 1);
        dat(r, 0, t, c1 - 1); dat(r, 1, t, c2 - 1); dat(r, 2, t, c1 - c2 - 1);
      }
    } else {
      for (let r = 0; r < 3; r++) {
        const a = maskNgauNhien(), b = maskNgauNhien(), c = phep(l, a, b);
        if (!c || c === a || c === b) return null;
        dat(r, 0, t, a); dat(r, 1, t, b); dat(r, 2, t, c);
      }
    }
  }
  return { maTran: M, dapAn: M[8]!, luat, chiNet };
}

/** Mọi đáp án mà một luật bất kỳ (khớp hai hàng đầu) có thể đoán cho ô thứ 9. */
function duDoan(t: ThuocTinh, v: number[]): Set<number> {
  const kq = new Set<number>();
  const r0 = v.slice(0, 3), r1 = v.slice(3, 6), a = v[6]!, b = v[7]!;
  if (t === 'net') {
    for (const l of ['hop', 'xor', 'hieu'] as Luat[]) {
      if (phep(l, r0[0]!, r0[1]!) === r0[2] && phep(l, r1[0]!, r1[1]!) === r1[2]) kq.add(phep(l, a, b));
    }
    if (r0[2] === (r0[1]! & ~r0[0]! & 255) && r1[2] === (r1[1]! & ~r1[0]! & 255)) kq.add(b & ~a & 255);
    if (r0[2] === (r0[0]! & r0[1]!) && r1[2] === (r1[0]! & r1[1]!)) kq.add(a & b);
    if (r0[2] === r0[0] && r1[2] === r1[0]) kq.add(a);
    if (r0[2] === r0[1] && r1[2] === r1[1]) kq.add(b);
    return kq;
  }
  const mod = t === 'xoay' ? 8 : 0;
  const tru = (x: number, y: number) => (mod ? (((x - y) % mod) + mod) % mod : x - y);
  const cong = (x: number, y: number) => (mod ? (x + y) % mod : x + y);
  const giu = (r: number[]) => r[0] === r[1] && r[1] === r[2];
  if (giu(r0) && giu(r1) && a === b) kq.add(a);
  const d = tru(r0[1]!, r0[0]!);
  if (d !== 0 && tru(r0[2]!, r0[1]!) === d && tru(r1[1]!, r1[0]!) === d && tru(r1[2]!, r1[1]!) === d && tru(b, a) === d) kq.add(cong(b, d));
  const s0 = [...r0].sort().join(), s1 = [...r1].sort().join();
  if (new Set(r0).size === 3 && s0 === s1 && a !== b && r0.includes(a) && r0.includes(b)) kq.add(r0.find((x) => x !== a && x !== b)!);
  if (t === 'so') {
    if (r0[2] === r0[0]! + r0[1]! && r1[2] === r1[0]! + r1[1]!) kq.add(a + b);
    if (r0[2] === r0[0]! - r0[1]! && r1[2] === r1[0]! - r1[1]!) kq.add(a - b);
  }
  // Hai hàng đầu giống hệt nhau ⇒ người chơi có thể đoán "hàng 3 cũng thế".
  if (r0.join() === r1.join() && a === r0[0] && b === r0[1]) kq.add(r0[2]!);
  return kq;
}

function hopLe(de: De): boolean {
  const ds: ThuocTinh[] = de.chiNet ? ['net'] : ['hinh', 'so', 'mau', 'to', 'xoay', 'net'];
  for (const t of ds) {
    const v = de.maTran.map((o) => (t === 'so' ? o.so + 1 : t === 'xoay' ? xoayThay(o) : o[t]));
    const dd = duDoan(t, v);
    const dung = v[8]!;
    for (const x of dd) if (x !== dung) return false;
  }
  return true;
}

function sinhDe(cap: number): De {
  const ch = CAP[Math.min(TONG_CAP, Math.max(1, cap)) - 1]!;
  for (let thu = 0; thu < 400; thu++) {
    const de = thuSinh(ch);
    if (de && hopLe(de)) return de;
  }
  for (;;) { const de = thuSinh(CAP[0]!); if (de && hopLe(de)) return de; }
}

/** 5 đáp án nhiễu, mỗi cái lệch MỘT thuộc tính; đề chồng hình thì có cả kết quả của phép chồng khác. */
function sinhLuaChon(de: De): O[] {
  const dung = de.dapAn;
  const ds: O[] = [dung];
  const them = (o: O) => { if (ds.length < 6 && !(o.so >= 0 && o.so > 3) && !ds.some((x) => giongNhau(x, o))) ds.push(o); };
  const coNet = de.luat.some(([t]) => t === 'net');
  if (coNet) {
    const a = de.maTran[6]!.net, b = de.maTran[7]!.net;
    const ung = tron([a | b, a ^ b, a & ~b & 255, b & ~a & 255, a & b, a, b].filter((m) => m && m !== dung.net));
    for (const m of ung.slice(0, de.chiNet ? 3 : 2)) them({ ...dung, net: m });
  }
  const uuTien: ThuocTinh[] = de.chiNet ? ['net'] : [...de.luat.map(([t]) => t), 'hinh', 'mau', 'to', 'xoay', ...(dung.so >= 0 && !coNet ? ['so' as ThuocTinh] : [])];
  let thu = 0;
  while (ds.length < 6 && thu++ < 400) {
    const t = uuTien[rnd(Math.min(uuTien.length, thu < 60 ? de.luat.length * 2 + 1 : uuTien.length))]!;
    if (t === 'net') {
      const m = dung.net ^ (1 << rnd(8)) ^ (thu > 40 ? 1 << rnd(8) : 0);
      if (m) them({ ...dung, net: m });
      continue;
    }
    const m = mien[t];
    them({ ...dung, [t]: (dung[t] + 1 + rnd(m - 1)) % m } as O);
  }
  return tron(ds);
}

/* ── Vẽ ── */
function Hinh({ hinh, x, y, r, mau, to, xoay }: { hinh: number; x: number; y: number; r: number; mau: number; to: number; xoay: number }) {
  const fill = to === 0 ? `url(#mtq-g${mau})` : to === 1 ? 'rgba(255,255,255,0.03)' : `url(#mtq-s${mau})`;
  const net = { stroke: MAU[mau], strokeWidth: to === 1 ? 3.4 : 2.2, fill, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const t = `rotate(${xoay * 45} ${x} ${y})`;
  if (hinh === 0) return <circle cx={x} cy={y} r={r} {...net} />;
  if (hinh === 1) return <rect x={x - r * 0.86} y={y - r * 0.86} width={r * 1.72} height={r * 1.72} rx={r * 0.26} transform={t} {...net} />;
  if (hinh === 5) {
    const p = [[0, -1], [0.82, -0.08], [0.34, -0.08], [0.34, 0.95], [-0.34, 0.95], [-0.34, -0.08], [-0.82, -0.08]];
    return <polygon points={p.map(([a, b]) => `${(x + a! * r).toFixed(1)},${(y + b! * r).toFixed(1)}`).join(' ')} transform={t} {...net} />;
  }
  const da = (n: number, g0: number) => Array.from({ length: n }, (_, i) => {
    const a = g0 + (i * 2 * Math.PI) / n;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  if (hinh === 2) return <polygon points={da(3, -Math.PI / 2)} transform={t} {...net} />;
  if (hinh === 3) return <polygon points={da(5, -Math.PI / 2)} transform={t} {...net} />; // ngũ giác — KHÔNG hình thoi (≡ vuông xoay 45°)
  return <polygon points={da(6, 0)} transform={t} {...net} />;
}

/** 8 nét: khi có hình thì nét là khung quanh ô (không đè hình); đề chỉ-nét thì có cả chéo + chữ thập. */
const NET_KHUNG = [[18, 8, 82, 8], [92, 18, 92, 82], [18, 92, 82, 92], [8, 18, 8, 82], [9, 9, 20, 20], [91, 9, 80, 20], [91, 91, 80, 80], [9, 91, 20, 80]];
const NET_DAY = [[16, 16, 84, 16], [84, 16, 84, 84], [16, 84, 84, 84], [16, 16, 16, 84], [16, 16, 84, 84], [84, 16, 16, 84], [16, 50, 84, 50], [50, 16, 50, 84]];

const VI_TRI: Record<number, [number, number][]> = {
  0: [], 1: [[50, 50]], 2: [[30, 50], [70, 50]], 3: [[50, 29], [29, 69], [71, 69]], 4: [[31, 31], [69, 31], [31, 69], [69, 69]],
};
function O9({ o }: { o: O }) {
  const n = o.so + 1;
  const coNet = o.net !== 0;
  const r = (n === 1 ? 25 : n === 2 ? 16.5 : 14.5) * (coNet && n > 0 ? 0.86 : 1);
  const bo = o.so < 0 ? NET_DAY : NET_KHUNG;
  return (
    <svg viewBox="0 0 100 100" className={s.svg} aria-hidden="true">
      {coNet && bo.map(([x1, y1, x2, y2], i) => (o.net >> i) & 1 ? (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MAU[o.mau]} strokeOpacity={0.22} strokeWidth={o.so < 0 ? 11 : 8} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={o.so < 0 ? MAU_SANG[o.mau] : MAU[o.mau]} strokeWidth={o.so < 0 ? 5 : 3.6} strokeLinecap="round" />
        </g>
      ) : null)}
      {VI_TRI[Math.max(0, n)]!.map(([x, y], i) => <Hinh key={i} hinh={o.hinh} x={x} y={y} r={r} mau={o.mau} to={o.to} xoay={o.xoay} />)}
    </svg>
  );
}

const TEN_LUAT: Record<Luat, [string, string]> = {
  tang: ['tăng dần theo cột', 'increases each column'],
  tang2: ['xoay 90° mỗi cột', 'turns 90° each column'],
  boBa: ['mỗi hàng đủ bộ ba', 'each row has all three'],
  cong: ['cột 3 = cột 1 + cột 2', 'col 3 = col 1 + col 2'],
  tru: ['cột 3 = cột 1 − cột 2', 'col 3 = col 1 − col 2'],
  giu: ['giữ nguyên trong hàng', 'constant along the row'],
  hop: ['chồng hình: gộp mọi nét cột 1 + cột 2', 'overlay: union of col 1 and col 2'],
  xor: ['chồng hình: nét trùng nhau thì biến mất', 'overlay: shared strokes cancel out'],
  hieu: ['cột 3 = cột 1 bỏ đi các nét của cột 2', 'col 3 = col 1 minus strokes of col 2'],
};
const TEN_TT: Record<ThuocTinh, [string, string]> = {
  hinh: ['Hình', 'Shape'], so: ['Số lượng', 'Count'], mau: ['Màu', 'Colour'], to: ['Kiểu tô', 'Fill'], xoay: ['Góc xoay', 'Rotation'], net: ['Nét', 'Strokes'],
};
const tenLuat = (t: ThuocTinh, l: Luat, en: boolean) => (t === 'xoay' && l === 'tang' ? (en ? 'turns 45° each column' : 'xoay 45° mỗi cột') : TEN_LUAT[l][en ? 1 : 0]);

/* ── Khung co giãn: đo bề rộng sân khấu của GameShell; cao theo cửa sổ (toàn màn hình thì lấy hết) ── */
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

export default function MaTranIqGame({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const en = !vi;
  const gocRef = useRef<HTMLDivElement>(null);
  const maTranRef = useRef<HTMLDivElement>(null);
  const lcRef = useRef<(HTMLButtonElement | null)[]>([]);
  const kh = useKhung(gocRef);

  const [cap, setCap] = useState(1);
  const [deId, setDeId] = useState(0);
  const de = useMemo(() => sinhDe(cap), [cap, deId]); // eslint-disable-line react-hooks/exhaustive-deps
  const luaChon = useMemo(() => sinhLuaChon(de), [de]);
  const [chon, setChon] = useState<number | null>(null);
  const [diem, setDiem] = useState(0);
  const [chuoi, setChuoi] = useState(0);
  const [mang, setMang] = useState(MANG);
  const [conMs, setConMs] = useState(giayCap(1) * 1000);
  const [bang, setBang] = useState<{ cap: number; k: number } | null>({ cap: 1, k: 0 });
  const [congVua, setCongVua] = useState(0);
  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const henGio = useRef<number[]>([]);
  const hen = (fn: () => void, ms: number) => { henGio.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => henGio.current.forEach((t) => clearTimeout(t)), []);

  // Băng "Cấp N" tự tắt.
  useEffect(() => {
    if (!bang) return;
    const t = window.setTimeout(() => setBang(null), 1700);
    return () => clearTimeout(t);
  }, [bang]);

  // Đồng hồ: đứng yên khi GameShell tạm dừng (prop `paused`).
  const dungRef = useRef(paused);
  dungRef.current = paused;
  const dangDung = () => dungRef.current;
  useEffect(() => {
    if (chon !== null) return;
    const id = window.setInterval(() => { if (!dangDung()) setConMs((c) => Math.max(0, c - 100)); }, 100);
    return () => clearInterval(id);
  }, [chon, cap, deId]);

  const tongMs = giayCap(cap) * 1000;
  const ketThuc = useCallback((d: number) => {
    if (daBao.current) return;
    daBao.current = true;
    onScore?.(d, Math.round((Date.now() - t0.current) / 1000));
  }, [onScore]);

  const diemRef = useRef(diem);
  diemRef.current = diem;

  const tra = (i: number) => {
    if (chon !== null || daBao.current) return;
    setChon(i);
    const dung = i >= 0 && giongNhau(luaChon[i]!, de.dapAn);
    if (dung) {
      const c = chuoi + 1;
      const cong = 60 + 14 * cap + Math.round((50 * conMs) / tongMs) + 8 * Math.min(c - 1, 5);
      setChuoi(c);
      setDiem((d) => d + cong);
      setCongVua(cong);
      sfx('dung');
      if (c >= 2) hen(() => sfx('combo', { muc: c - 1 }), 140);
      const goc = gocRef.current, nut = lcRef.current[i];
      if (goc && nut) {
        const a = goc.getBoundingClientRect(), b = nut.getBoundingClientRect();
        const x = b.left - a.left + b.width / 2, y = b.top - a.top + b.height / 2;
        phaoGiay(goc, { x, y, it: true });
        diemBay(goc, x, y - b.height * 0.35, `+${cong}`, '#86efac');
      }
      // Câu đúng tự sang cấp sau (vẫn kịp đọc quy luật); câu cuối thì báo điểm.
      hen(() => tiepRef.current(), 1700);
    } else {
      setChuoi(0);
      setMang((m) => m - 1);
      sfx('sai');
      rung(maTranRef.current);
    }
  };

  const tiep = () => {
    if (chon === null || daBao.current) return;
    henGio.current.forEach((t) => clearTimeout(t));
    henGio.current = [];
    const dung = chon >= 0 && giongNhau(luaChon[chon]!, de.dapAn);
    if (mang <= 0 || (dung && cap >= TONG_CAP)) { ketThuc(diemRef.current); return; }
    setChon(null);
    if (dung) {
      const c = cap + 1;
      setCap(c);
      setConMs(giayCap(c) * 1000);
      setBang({ cap: c, k: Date.now() });
      sfx('lenCap');
    } else {
      setDeId((x) => x + 1);
      setConMs(tongMs);
      sfx('lat');
    }
  };
  const tiepRef = useRef(tiep);
  tiepRef.current = tiep;
  const traRef = useRef(tra);
  traRef.current = tra;

  // Hết giờ = trả lời sai.
  useEffect(() => { if (conMs <= 0 && chon === null) traRef.current(-1); }, [conMs, chon]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (dangDung()) return;
      const k = e.key.toLowerCase();
      const i = '123456'.indexOf(k) >= 0 ? '123456'.indexOf(k) : 'abcdef'.indexOf(k);
      if (i >= 0 && k.length === 1) { e.preventDefault(); traRef.current(i); return; }
      if (k === 'enter' || k === ' ') { e.preventDefault(); tiepRef.current(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Bố cục theo khung ── */
  const W = Math.min(kh.w, 1120);
  const H = Math.max(260, kh.h - 54 - 68);
  const rong = W >= H * 1.4;
  let mt: number, lc: number;
  if (rong) {
    mt = Math.min(H, W * 0.56);
    lc = Math.min((W - mt - 28 - 24) / 3, (mt - 14) / 2);
  } else {
    mt = Math.min(W, H * 0.64);
    lc = Math.min((W - 50) / 6, H - mt - 14);
  }
  mt = Math.floor(Math.max(200, mt));
  lc = Math.floor(Math.max(44, lc));

  const daTra = chon !== null;
  const dungCau = daTra && chon! >= 0 && giongNhau(luaChon[chon!]!, de.dapAn);
  const tiLe = Math.max(0, conMs / tongMs);

  return (
    <div ref={gocRef} className={s.goc} style={{ width: W, ['--mt' as string]: `${mt}px`, ['--lc' as string]: `${lc}px` }}>
      <svg width="0" height="0" className={s.an} aria-hidden="true">
        <defs>
          {MAU.map((m, i) => (
            <linearGradient key={`g${i}`} id={`mtq-g${i}`} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor={MAU_SANG[i]} />
              <stop offset="0.55" stopColor={m} />
              <stop offset="1" stopColor={m} stopOpacity="0.85" />
            </linearGradient>
          ))}
          {MAU.map((m, i) => (
            <pattern key={`s${i}`} id={`mtq-s${i}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill={m} fillOpacity="0.12" />
              <line x1="0" y1="0" x2="0" y2="6" stroke={m} strokeWidth="2.6" />
            </pattern>
          ))}
        </defs>
      </svg>

      <div className={s.hud}>
        <span className={s.chip}><Brain size={15} /> {vi ? 'Cấp' : 'Level'} <b>{cap}</b><i>/{TONG_CAP}</i></span>
        <span className={s.chip}>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        <span className={s.chip} data-nong={chuoi >= 2}><Flame size={15} /> <b>×{chuoi}</b></span>
        <span className={s.tim} aria-label={`${mang}/${MANG}`}>
          {Array.from({ length: MANG }, (_, i) => <Heart key={i} size={17} data-con={i < mang} />)}
        </span>
        <div className={s.thanhGio} data-gap={tiLe < 0.25 && !daTra}>
          <i style={{ transform: `scaleX(${tiLe})` }} />
          <span>{Math.ceil(conMs / 1000)}s</span>
        </div>
      </div>

      <div className={s.khung} data-rong={rong}>
        <div ref={maTranRef} className={s.maTran}>
          {de.maTran.map((o, i) => (
            <div key={`${cap}-${deId}-${i}`} className={s.o} data-trong={i === 8} style={{ animationDelay: `${i * 35}ms` }}>
              {i === 8 ? (
                <div className={s.the} data-lat={daTra}>
                  <div className={s.matTruoc}><span className={s.hoi}>?</span></div>
                  <div className={s.matSau} data-dung={dungCau}><O9 o={de.dapAn} /></div>
                </div>
              ) : <O9 o={o} />}
            </div>
          ))}
        </div>

        <div className={s.luaChon} data-rong={rong}>
          {luaChon.map((o, i) => (
            <button
              key={`${cap}-${deId}-${i}`}
              ref={(el) => { lcRef.current[i] = el; }}
              type="button"
              className={s.lc}
              style={{ animationDelay: `${300 + i * 45}ms` }}
              data-kq={!daTra ? undefined : giongNhau(o, de.dapAn) ? 'dung' : chon === i ? 'sai' : 'mo'}
              onClick={() => tra(i)}
              disabled={daTra}
              aria-label={`${vi ? 'Đáp án' : 'Option'} ${String.fromCharCode(65 + i)}`}
            >
              <O9 o={o} />
              <kbd>{String.fromCharCode(65 + i)}</kbd>
            </button>
          ))}
        </div>
      </div>

      <div className={s.chan}>
        {daTra ? (
          <div className={s.giaiThich} data-dung={dungCau}>
            <p>
              <b className={s.kq}>
                {dungCau ? <><Check size={16} /> {vi ? `Chính xác! +${congVua}` : `Correct! +${congVua}`}</> : <><X size={16} /> {chon === -1 ? (vi ? 'Hết giờ.' : 'Time up.') : (vi ? 'Chưa đúng.' : 'Not quite.')}</>}
              </b>
              <span>{vi ? 'Quy luật:' : 'Rule:'} {de.luat.map(([t, l]) => `${TEN_TT[t][en ? 1 : 0]} — ${tenLuat(t, l, en)}`).join(' · ')}</span>
            </p>
            <button type="button" className={s.nutTiep} onClick={tiep}>
              {mang <= 0 || (dungCau && cap >= TONG_CAP) ? (vi ? 'Xem kết quả' : 'Results') : dungCau ? (vi ? 'Cấp tiếp' : 'Next level') : (vi ? 'Đề khác' : 'New puzzle')} <kbd>↵</kbd>
            </button>
          </div>
        ) : (
          <p className={s.goiY}>
            {vi ? 'Tìm quy luật theo HÀNG rồi chọn hình cho ô “?” — phím ' : 'Find the row rule, then pick the missing tile — keys '}
            <kbd>A</kbd>–<kbd>F</kbd> / <kbd>1</kbd>–<kbd>6</kbd>
          </p>
        )}
      </div>

      {bang && (
        <div key={bang.k} className={s.bang} aria-live="polite">
          <small>{vi ? 'Cấp' : 'Level'}</small>
          <b>{bang.cap}</b>
          <span>{CAP[bang.cap - 1]!.net && CAP[bang.cap - 1]!.soLuat === 0 ? (vi ? 'Chồng hình' : 'Overlay') : `${(CAP[bang.cap - 1]!.soLuat + (CAP[bang.cap - 1]!.net ? 1 : 0))} ${vi ? 'quy luật' : 'rule(s)'}`}</span>
        </div>
      )}
    </div>
  );
}
