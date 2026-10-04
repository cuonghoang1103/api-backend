'use client';

/**
 * Ma trận IQ — SUY LUẬN QUY LUẬT kiểu Raven's Progressive Matrices, sinh tự động.
 *
 * Mỗi ô là một nhóm hình mô tả bằng 5 thuộc tính: hình, số lượng, màu, kiểu tô, góc
 * xoay. Mỗi đề chọn vài thuộc tính và gán cho mỗi cái MỘT luật theo hàng:
 *   - "tăng dần"  : giá trị cột sau = cột trước + 1 (số lượng 1→2→3, xoay 0→45→90…)
 *   - "đủ bộ ba"  : mỗi hàng là một hoán vị của cùng ba giá trị (luật khó nhất với người)
 *   - "cộng"      : số lượng cột 3 = cột 1 + cột 2
 *   - "giữ nguyên": cả hàng một giá trị, đổi theo hàng
 * Ô dưới-phải để trống; 6 đáp án = đáp án đúng + 5 đáp án nhiễu, mỗi cái chỉ LỆCH
 * MỘT thuộc tính so với đáp án đúng — nên không thể loại trừ bằng "cái nào trông lạ",
 * phải tìm ra luật thật.
 *
 * Độ khó tăng theo câu: câu đầu 1 luật, sau đó 2, cuối ván 3 luật cùng lúc (có "đủ bộ
 * ba" và "cộng"). 12 câu, mỗi câu 60 giây. Điểm = Σ (100 + 40 × bậc) + thưởng thời gian.
 *
 * ⚠️ Không gọi đây là "IQ" có chuẩn hoá — cuối ván chỉ báo số câu đúng theo bậc khó.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Brain, Clock, Check, X } from 'lucide-react';
import type { GameProps } from './registry';
import s from './maTranIq.module.css';

/* ── Mô hình ô ── */
type O = { hinh: number; so: number; mau: number; to: number; xoay: number };
type ThuocTinh = keyof O;
type Luat = 'tang' | 'boBa' | 'cong' | 'giu';

const SO_HINH = 5, SO_MAU = 4, SO_TO = 3, SO_XOAY = 4;
const MAU = ['#22d3ee', '#f472b6', '#facc15', '#a78bfa'];
const SO_CAU = 12;
const GIAY_CAU = 60;

const rnd = (n: number) => Math.floor(Math.random() * n);
const tron = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j]!, b[i]!]; } return b; };
/**
 * Góc xoay NHÌN THẤY được: tròn xoay kiểu gì cũng vậy; vuông đối xứng 90° nên xoay 0 ≡ 90.
 * So đáp án theo cái MẮT thấy — hai lựa chọn khác số liệu mà trông y hệt là đề sai.
 */
const xoayThay = (o: O) => (o.hinh === 0 ? 0 : o.hinh === 1 ? o.xoay % 2 : o.xoay);
const giongNhau = (a: O, b: O) => a.hinh === b.hinh && a.so === b.so && a.mau === b.mau && a.to === b.to && xoayThay(a) === xoayThay(b);
const mien: Record<ThuocTinh, number> = { hinh: SO_HINH, so: 4, mau: SO_MAU, to: SO_TO, xoay: SO_XOAY };

/** Sinh ma trận 3×3 theo các luật đã chọn. `so` lưu 0..3 nghĩa là 1..4 hình. */
function sinhDe(bac: number): { maTran: O[]; dapAn: O; luat: [ThuocTinh, Luat][] } {
  const soLuat = bac <= 1 ? 1 : bac <= 3 ? 2 : 3;
  // Hai câu đầu chỉ dùng thuộc tính nhìn là thấy ngay (số lượng, màu, hình) — vào game đừng làm khó.
  let ung: ThuocTinh[] = tron((bac === 0 ? ['hinh', 'so', 'mau'] : ['hinh', 'so', 'mau', 'to', 'xoay']) as ThuocTinh[]).slice(0, soLuat);
  // Luật xoay cần hình mà mọi góc 0/45/90/135 đều khác RÕ (tam giác) ⇒ không
  // đi cùng luật đổi hình; trùng thì đổi xoay sang thuộc tính khác.
  if (ung.includes('xoay') && ung.includes('hinh')) ung = ung.map((t) => (t === 'xoay' ? (['so', 'mau', 'to'] as ThuocTinh[]).find((x) => !ung.includes(x))! : t));
  const luat: [ThuocTinh, Luat][] = ung.map((t) => {
    const coThe: Luat[] = t === 'so' ? (bac >= 3 ? ['tang', 'boBa', 'cong'] : ['tang', 'boBa'])
      : t === 'xoay' ? ['tang', 'boBa'] : bac >= 2 ? ['boBa', 'giu', 'tang'] : ['boBa', 'giu'];
    return [t, coThe[rnd(coThe.length)]!];
  });
  // Giá trị nền cho thuộc tính KHÔNG có luật: cố định cả ma trận.
  const nen: O = { hinh: ung.includes('xoay') ? 2 /* tam giác: xoay 45° thấy rõ nhất */ : rnd(SO_HINH), so: rnd(2), mau: rnd(SO_MAU), to: rnd(SO_TO), xoay: 0 };
  const maTran: O[] = Array.from({ length: 9 }, () => ({ ...nen }));
  for (const [t, l] of luat) {
    const m = mien[t];
    if (l === 'tang') {
      for (let r = 0; r < 3; r++) {
        const goc = t === 'so' ? rnd(2) : rnd(m);
        for (let c = 0; c < 3; c++) maTran[r * 3 + c]![t] = t === 'so' ? goc + c : (goc + c) % m;
      }
    } else if (l === 'boBa') {
      const ba = tron(Array.from({ length: m }, (_, i) => i)).slice(0, 3);
      const hoanVi = tron([[0, 1, 2], [1, 2, 0], [2, 0, 1]]);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) maTran[r * 3 + c]![t] = ba[hoanVi[r]![c]!]!;
    } else if (l === 'cong') {
      // so: 1..4 hình ⇒ a + b ≤ 4 với a,b ≥ 1 ⇒ lưu (a−1)+(b−1)+1.
      for (let r = 0; r < 3; r++) {
        const a = rnd(2), b = rnd(2);
        maTran[r * 3]!.so = a; maTran[r * 3 + 1]!.so = b; maTran[r * 3 + 2]!.so = a + b + 1;
      }
    } else {
      const ba = tron(Array.from({ length: m }, (_, i) => i)).slice(0, 3);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) maTran[r * 3 + c]![t] = ba[r]!;
    }
  }
  return { maTran, dapAn: maTran[8]!, luat };
}

/** 5 đáp án nhiễu, mỗi cái lệch đúng MỘT thuộc tính; ưu tiên lệch ở thuộc tính có luật. */
function sinhLuaChon(dung: O, luat: [ThuocTinh, Luat][]): O[] {
  const ds: O[] = [dung];
  const uuTien = [...luat.map(([t]) => t), ...(['hinh', 'so', 'mau', 'to', 'xoay'] as ThuocTinh[])];
  let thu = 0;
  while (ds.length < 6 && thu++ < 200) {
    const t = uuTien[rnd(Math.min(uuTien.length, thu < 40 ? luat.length * 2 + 1 : uuTien.length))]!;
    const m = mien[t];
    const moi = { ...dung, [t]: (dung[t] + 1 + rnd(m - 1)) % m } as O;
    if (t === 'xoay' && (dung.hinh === 0 || dung.hinh === 1)) continue; // xoay hình đối xứng: trông y hệt
    if (!ds.some((x) => giongNhau(x, moi))) ds.push(moi);
  }
  return tron(ds);
}

/* ── Vẽ ── */
function HinhSvg({ hinh, x, y, r, mau, to, xoay }: { hinh: number; x: number; y: number; r: number; mau: string; to: number; xoay: number }) {
  const fill = to === 0 ? mau : to === 1 ? 'none' : `url(#soc-${mau.slice(1)})`;
  const net = { stroke: mau, strokeWidth: 2.4, fill, strokeLinejoin: 'round' as const };
  const t = `rotate(${xoay * 45} ${x} ${y})`;
  if (hinh === 0) return <circle cx={x} cy={y} r={r} {...net} />;
  if (hinh === 1) return <rect x={x - r * 0.88} y={y - r * 0.88} width={r * 1.76} height={r * 1.76} rx={r * 0.18} transform={t} {...net} />;
  const da = (n: number, xoayGoc: number) => Array.from({ length: n }, (_, i) => {
    const a = xoayGoc + (i * 2 * Math.PI) / n;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  if (hinh === 2) return <polygon points={da(3, -Math.PI / 2)} transform={t} {...net} />;
  if (hinh === 3) return <polygon points={da(5, -Math.PI / 2)} transform={t} {...net} />; // ngũ giác — KHÔNG dùng hình thoi (≡ vuông xoay 45°)
  return <polygon points={da(6, 0)} transform={t} {...net} />;
}

const VI_TRI: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[30, 50], [70, 50]], 3: [[50, 28], [28, 70], [72, 70]], 4: [[30, 30], [70, 30], [30, 70], [70, 70]],
};
function O9({ o }: { o: O }) {
  const n = o.so + 1;
  const r = n === 1 ? 26 : n === 2 ? 17 : 15;
  return (
    <svg viewBox="0 0 100 100" className={s.svg} aria-hidden="true">
      <defs>
        {MAU.map((m) => (
          <pattern key={m} id={`soc-${m.slice(1)}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={m} strokeWidth="2.4" />
          </pattern>
        ))}
      </defs>
      {VI_TRI[n]!.map(([x, y], i) => <HinhSvg key={i} hinh={o.hinh} x={x} y={y} r={r} mau={MAU[o.mau]!} to={o.to} xoay={o.xoay} />)}
    </svg>
  );
}

const TEN_LUAT: Record<Luat, string> = { tang: 'tăng dần theo cột', boBa: 'mỗi hàng đủ bộ ba', cong: 'cột 3 = cột 1 + cột 2', giu: 'giữ nguyên trong hàng' };
const TEN_TT: Record<ThuocTinh, string> = { hinh: 'Hình', so: 'Số lượng', mau: 'Màu', to: 'Kiểu tô', xoay: 'Góc xoay' };

export default function MaTranIqGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [cau, setCau] = useState(0);
  const bac = Math.min(5, Math.floor(cau / 2.4));
  const de = useMemo(() => sinhDe(bac), [cau]); // eslint-disable-line react-hooks/exhaustive-deps
  const luaChon = useMemo(() => sinhLuaChon(de.dapAn, de.luat), [de]);
  const [chon, setChon] = useState<number | null>(null);
  const [diem, setDiem] = useState(0);
  const [dung, setDung] = useState(0);
  const [con, setCon] = useState(GIAY_CAU);
  const t0 = useRef(Date.now());
  const daBao = useRef(false);

  const xong = cau >= SO_CAU;
  const tiep = useCallback(() => {
    setChon(null);
    setCon(GIAY_CAU);
    setCau((c) => c + 1);
  }, []);

  useEffect(() => {
    if (xong || chon !== null) return;
    const id = setInterval(() => setCon((c) => {
      if (c <= 1) { clearInterval(id); setChon(-1); return 0; }
      return c - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [cau, chon, xong]);

  useEffect(() => {
    if (!xong || daBao.current || !onScore) return;
    daBao.current = true;
    onScore(diem, Math.round((Date.now() - t0.current) / 1000));
  }, [xong, diem, onScore]);

  const tra = (i: number) => {
    if (chon !== null) return;
    setChon(i);
    if (giongNhau(luaChon[i]!, de.dapAn)) {
      setDung((d) => d + 1);
      setDiem((d) => d + 100 + 40 * bac + Math.round((con / GIAY_CAU) * 60));
    }
  };

  if (xong) {
    return (
      <div className={s.goc}>
        <div className={s.ketQua}>
          <Brain size={42} />
          <b>{dung}/{SO_CAU} {vi ? 'câu đúng' : 'correct'}</b>
          <span>{diem} {vi ? 'điểm' : 'points'}</span>
        </div>
      </div>
    );
  }

  const daTra = chon !== null;
  const dungCau = daTra && chon! >= 0 && giongNhau(luaChon[chon!]!, de.dapAn);
  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <span className={s.chip}><Brain size={15} /> {vi ? 'Câu' : 'Q'} <b>{cau + 1}/{SO_CAU}</b></span>
        <span className={s.chip}>{vi ? 'Bậc' : 'Level'} <b>{'★'.repeat(bac + 1)}</b></span>
        <span className={s.chip}>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        <span className={s.chip} data-gap={con <= 10}><Clock size={15} /> <b>{con}</b>s</span>
      </div>

      <div className={s.khung}>
        <div className={s.maTran}>
          {de.maTran.map((o, i) => (
            <div key={`${cau}-${i}`} className={s.o} data-trong={i === 8} style={{ animationDelay: `${i * 40}ms` }}>
              {i === 8 ? (daTra ? <O9 o={de.dapAn} /> : <span className={s.hoi}>?</span>) : <O9 o={o} />}
            </div>
          ))}
        </div>

        <div className={s.luaChon}>
          {luaChon.map((o, i) => (
            <button
              key={`${cau}-${i}`}
              type="button"
              className={s.lc}
              data-kq={!daTra ? undefined : giongNhau(o, de.dapAn) ? 'dung' : chon === i ? 'sai' : 'mo'}
              onClick={() => tra(i)}
              disabled={daTra}
            >
              <O9 o={o} />
              <kbd>{String.fromCharCode(65 + i)}</kbd>
            </button>
          ))}
        </div>
      </div>

      {daTra && (
        <div className={s.giaiThich} data-dung={dungCau}>
          <p>
            {dungCau ? <><Check size={16} /> {vi ? 'Chính xác!' : 'Correct!'}</> : <><X size={16} /> {chon === -1 ? (vi ? 'Hết giờ.' : 'Time up.') : (vi ? 'Chưa đúng.' : 'Not quite.')}</>}
            {' '}{vi ? 'Quy luật:' : 'Rule:'} {de.luat.map(([t, l]) => `${TEN_TT[t]} — ${TEN_LUAT[l]}`).join(' · ')}
          </p>
          <button type="button" className={s.nutTiep} onClick={tiep}>{cau + 1 >= SO_CAU ? (vi ? 'Xem kết quả' : 'Results') : (vi ? 'Câu tiếp' : 'Next')} →</button>
        </div>
      )}
    </div>
  );
}
