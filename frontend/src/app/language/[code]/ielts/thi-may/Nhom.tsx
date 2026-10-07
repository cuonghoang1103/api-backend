'use client';

/**
 * Vẽ MỘT nhóm câu hỏi (Questions 1–7…) đúng kiểu phòng thi máy tính:
 * ô điền đánh số trong câu/ghi chú/bảng/lưu đồ, radio TFNG/MCQ, hộp chọn hai đáp án,
 * danh sách tiêu đề/người/từ kéo-thả vào ô (có ô chọn thay thế cho bàn phím),
 * lưới chữ cái cho bản đồ. Chế độ `xem` (xem lại) tô đúng/sai + lời giải + nút "📍 Vị trí".
 */
import { Fragment, useState } from 'react';
import type { DapAn, Nhom, Opt } from './de/types';
import type { KetQuaCau } from './cham';
import { HinhSvg } from './HinhSvg';
import s from '../chung/cdt.module.css';

export type NhomProps = {
  g: Nhom;
  dapAn: Record<number, DapAn>;
  ans: Record<number, string>;
  set: (n: number, v: string) => void;
  xem: boolean;
  kq?: Map<number, KetQuaCau>;
  co: Set<number>;
  datCo: (n: number) => void;
  dang: number | null;
  onFocus: (n: number) => void;
  onViTri?: (n: number) => void;
  /** Ẩn phần hướng dẫn chung (dùng khi làm lại MỘT câu trong Sổ lỗi). */
  chiCau?: number[];
};

/** **đậm** → <b>. */
export function ChuDam({ t }: { t: string }) {
  const parts = t.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => (p.startsWith('**') && p.endsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <Fragment key={i}>{p}</Fragment>))}</>;
}

function Co({ n, co, datCo, xem }: { n: number; co: Set<number>; datCo: (n: number) => void; xem: boolean }) {
  if (xem) return null;
  const on = co.has(n);
  return (
    <button type="button" className={`${s.co} ${on ? s.coOn : ''}`} onClick={() => datCo(n)} aria-pressed={on}
      aria-label={on ? `Bỏ cờ xem lại câu ${n}` : `Cắm cờ xem lại câu ${n}`} title="Cờ xem lại (Alt+F)">⚑</button>
  );
}

function Giai({ n, p }: { n: number; p: NhomProps }) {
  if (!p.xem) return null;
  const k = p.kq?.get(n);
  const da = p.dapAn[n];
  if (!k || !da) return null;
  return (
    <div className={`${s.giai} ${k.dung ? s.giaiDung : s.giaiSai}`}>
      <b>{n}.</b> {k.dung ? <span style={{ color: 'var(--c-ok)' }}>✓ Đúng</span> : <span style={{ color: 'var(--c-red)' }}>✗ {k.traLoi ? <>Bạn: <s>{k.traLoi}</s></> : 'Bỏ trống'}</span>}
      {' · '}Đáp án: <b>{p.g.dang === 'mcq2' ? da.a.join(' + ') : da.a.join(' / ')}</b>
      {da.ev && p.onViTri && <button type="button" className={s.nutViTri} onClick={() => p.onViTri!(n)}>📍 Vị trí trong bài</button>}
      <div style={{ marginTop: 4 }}><ChuDam t={da.vi} /></div>
    </div>
  );
}

const lopO = (p: NhomProps, n: number) => {
  if (!p.xem) return p.dang === n ? s.oDangChon : '';
  return p.kq?.get(n)?.dung ? s.oDung : s.oSai;
};

/** Ô gõ chữ đánh số. */
function OGo({ n, p, ngan }: { n: number; p: NhomProps; ngan?: boolean }) {
  return (
    <input
      id={`q-${n}`} data-cau={n} className={`${s.o} ${ngan ? s.oNgan : ''} ${lopO(p, n)}`} value={p.ans[n] ?? ''} placeholder={String(n)}
      readOnly={p.xem} onChange={(e) => p.set(n, e.target.value)} onFocus={() => p.onFocus(n)}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} aria-label={`Câu ${n}`}
    />
  );
}

/** Ô chọn (danh sách tiêu đề / người / từ) — nhận kéo-thả từ hộp lựa chọn. */
function OChon({ n, p, ds }: { n: number; p: NhomProps; ds: Opt[] }) {
  const [tha, setTha] = useState(false);
  return (
    <span
      className={tha ? s.tha : ''}
      onDragOver={(e) => { if (!p.xem) { e.preventDefault(); setTha(true); } }}
      onDragLeave={() => setTha(false)}
      onDrop={(e) => { e.preventDefault(); setTha(false); const k = e.dataTransfer.getData('text/plain'); if (k && !p.xem) p.set(n, k); }}
    >
      <select id={`q-${n}`} data-cau={n} className={`${s.chonO} ${lopO(p, n)}`} value={p.ans[n] ?? ''} disabled={p.xem}
        onChange={(e) => p.set(n, e.target.value)} onFocus={() => p.onFocus(n)} aria-label={`Câu ${n}`}>
        <option value="">{n}</option>
        {ds.map((o) => <option key={o.k} value={o.k}>{o.k}{o.t !== o.k ? ` — ${o.t.length > 48 ? `${o.t.slice(0, 46)}…` : o.t}` : ''}</option>)}
      </select>
    </span>
  );
}

/** Thay [[n]] trong một dòng bằng ô điền/ô chọn. */
function Dong({ text, p }: { text: string; p: NhomProps }) {
  const parts = text.split(/(\[\[\d+\]\])/g);
  return (
    <>
      {parts.map((x, i) => {
        const m = /^\[\[(\d+)\]\]$/.exec(x);
        if (!m) return <ChuDam key={i} t={x} />;
        const n = Number(m[1]);
        return (
          <span key={i} style={{ whiteSpace: 'nowrap' }}>
            {p.g.dang === 'summary-box' && p.g.hop ? <OChon n={n} p={p} ds={p.g.hop.ds} /> : <OGo n={n} p={p} />}
            <Co n={n} co={p.co} datCo={p.datCo} xem={p.xem} />
          </span>
        );
      })}
    </>
  );
}

function HopLuaChon({ p }: { p: NhomProps }) {
  const h = p.g.hop;
  if (!h || p.g.dang === 'map') return null;
  const daDung = new Set(Object.entries(p.ans).filter(([n]) => Number(n) >= p.g.tu && Number(n) <= p.g.den).map(([, v]) => v));
  return (
    <div className={s.hop}>
      {h.tieuDe && <div className={s.hopTieuDe}>{h.tieuDe}</div>}
      <div className={s.hopDs}>
        {h.ds.map((o) => (
          <span key={o.k} className={`${s.manh} ${daDung.has(o.k) && p.g.dang === 'heading' ? s.manhDaDung : ''}`} draggable={!p.xem}
            onDragStart={(e) => { e.dataTransfer.setData('text/plain', o.k); e.dataTransfer.effectAllowed = 'copy'; }}
            title={p.xem ? undefined : 'Kéo thả vào ô câu hỏi, hoặc chọn trong ô'}>
            <b style={{ minWidth: 22 }}>{o.k}</b>{o.t !== o.k && <span>{o.t}</span>}
          </span>
        ))}
      </div>
      {h.ghiChu && <div className={s.mo} style={{ marginTop: 6 }}>{h.ghiChu}</div>}
    </div>
  );
}

const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'];
const YNNG = ['YES', 'NO', 'NOT GIVEN'];

export function NhomCau(p: NhomProps) {
  const { g } = p;
  const so = (a: number, b: number) => (a === b ? `Question ${a}` : `Questions ${a}–${b}`);
  const cacSo = Array.from({ length: g.den - g.tu + 1 }, (_, i) => g.tu + i).filter((n) => !p.chiCau || p.chiCau.includes(n));
  const coGo = !!g.dong || !!g.bang || g.dang === 'diagram';

  return (
    <section className={s.nhom} aria-label={so(g.tu, g.den)}>
      <p className={s.nhomDau}>{so(g.tu, g.den)}</p>
      <p className={s.huongDan}><ChuDam t={g.huongDan} /></p>
      <HopLuaChon p={p} />
      {g.tieuDe && <p className={s.tieuDeNhom} style={{ textAlign: g.dang === 'flow' ? 'left' : undefined }}>{g.tieuDe}</p>}

      {/* Hình (sơ đồ / bản đồ) */}
      {g.hinh && <div className={s.hinh} style={{ background: '#fff', borderRadius: 6, padding: 4 }}><HinhSvg hinh={g.hinh} /></div>}
      {g.dang === 'diagram' && (
        <div style={{ display: 'grid', gap: 6 }}>
          {cacSo.map((n) => <div key={n} id={`cau-${n}`} className={s.cau}><b>{n}</b> <OGo n={n} p={p} /><Co n={n} co={p.co} datCo={p.datCo} xem={p.xem} /></div>)}
        </div>
      )}

      {/* Dòng có ô trống: ghi chú, form, câu, tóm tắt, lưu đồ */}
      {g.dong && (
        <div className={g.dang === 'form' ? s.form : undefined}>
          {g.dong.filter((d) => !p.chiCau || p.chiCau.some((n) => d.includes(`[[${n}]]`))).map((d, i, arr) => {
            if (d.startsWith('## ')) return <p key={i} className={s.dongTieuDe}>{d.slice(3)}</p>;
            if (d.startsWith('• ')) return <p key={i} className={`${s.dong} ${s.dongBullet}`}><Dong text={d.slice(2)} p={p} /></p>;
            if (d.startsWith('→ ')) {
              return (
                <Fragment key={i}>
                  <div className={s.buocLuu}><Dong text={d.slice(2)} p={p} /></div>
                  {i < arr.length - 1 && <div className={s.muiTen} aria-hidden>↓</div>}
                </Fragment>
              );
            }
            return <p key={i} className={s.dong}><Dong text={d} p={p} /></p>;
          })}
        </div>
      )}

      {g.bang && (
        <table className={s.bang}>
          <thead><tr>{g.bang.dau.map((x) => <th key={x}>{x}</th>)}</tr></thead>
          <tbody>{g.bang.hang.map((h, i) => <tr key={i}>{h.map((x, j) => <td key={j}><Dong text={x} p={p} /></td>)}</tr>)}</tbody>
        </table>
      )}

      {/* Lời giải cho các ô gõ (xem lại) */}
      {coGo && p.xem && cacSo.map((n) => <div key={n} id={`cau-${n}`}><Giai n={n} p={p} /></div>)}

      {/* Bản đồ: lưới chữ cái */}
      {g.dang === 'map' && g.cau && g.hop && (
        <div style={{ overflowX: 'auto' }}>
          <table className={s.luoiBanDo}>
            <thead><tr><th />{g.hop.ds.map((o) => <th key={o.k}>{o.k}</th>)}</tr></thead>
            <tbody>
              {g.cau.filter((c) => cacSo.includes(c.n)).map((c) => (
                <tr key={c.n} id={`cau-${c.n}`} className={p.xem ? (p.kq?.get(c.n)?.dung ? s.lcDung : s.lcSai) : undefined}>
                  <td><b>{c.n}</b> {c.s} <Co n={c.n} co={p.co} datCo={p.datCo} xem={p.xem} /></td>
                  {g.hop!.ds.map((o, j) => (
                    <td key={o.k} style={p.xem && p.dapAn[c.n]?.a.includes(o.k) ? { background: 'var(--c-ok-soft)', boxShadow: 'inset 0 0 0 2px var(--c-ok)' } : undefined}>
                      <input type="radio" id={j === 0 ? `q-${c.n}` : undefined} data-cau={c.n} name={`q${c.n}`} checked={p.ans[c.n] === o.k} disabled={p.xem}
                        onChange={() => p.set(c.n, o.k)} onFocus={() => p.onFocus(c.n)} aria-label={`Câu ${c.n}: ${o.k}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {p.xem && cacSo.map((n) => <Giai key={n} n={n} p={p} />)}
        </div>
      )}

      {/* Từng câu: TFNG / YNNG / MCQ / nối tiêu đề, người, đoạn kết */}
      {g.cau && g.dang !== 'map' && g.cau.filter((c) => cacSo.includes(c.n)).map((c) => {
        const chon = g.dang === 'tfng' ? TFNG : g.dang === 'ynng' ? YNNG : null;
        const kq = p.kq?.get(c.n);
        return (
          <div key={c.n} id={`cau-${c.n}`} className={s.cau}>
            <div className={s.cauDong}>
              <span className={`${s.soCau} ${p.dang === c.n ? s.soCauOn : ''}`}>{c.n}</span>
              <span style={{ flex: 1 }}>
                <ChuDam t={c.s} />
                {(g.hop && g.dang !== 'summary-box') && <> <OChon n={c.n} p={p} ds={g.hop.ds} /></>}
              </span>
              <Co n={c.n} co={p.co} datCo={p.datCo} xem={p.xem} />
            </div>
            {chon && (
              <div className={s.luaChon} role="radiogroup" aria-label={`Câu ${c.n}`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, max-content))' }}>
                {chon.map((o, j) => (
                  <label key={o} className={p.xem && p.dapAn[c.n]?.a.includes(o) ? s.lcDung : p.xem && p.ans[c.n] === o && !kq?.dung ? s.lcSai : ''}>
                    <input type="radio" id={j === 0 ? `q-${c.n}` : undefined} data-cau={c.n} name={`q${c.n}`} checked={p.ans[c.n] === o} disabled={p.xem}
                      onChange={() => p.set(c.n, o)} onFocus={() => p.onFocus(c.n)} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            )}
            {c.chon && (
              <div className={s.luaChon} role="radiogroup" aria-label={`Câu ${c.n}`}>
                {c.chon.map((o, j) => (
                  <label key={o.k} className={p.xem && p.dapAn[c.n]?.a.includes(o.k) ? s.lcDung : p.xem && p.ans[c.n] === o.k && !kq?.dung ? s.lcSai : ''}>
                    <input type="radio" id={j === 0 ? `q-${c.n}` : undefined} data-cau={c.n} name={`q${c.n}`} checked={p.ans[c.n] === o.k} disabled={p.xem}
                      onChange={() => p.set(c.n, o.k)} onFocus={() => p.onFocus(c.n)} />
                    <span><b>{o.k}</b>&nbsp; {o.t}</span>
                  </label>
                ))}
              </div>
            )}
            <Giai n={c.n} p={p} />
          </div>
        );
      })}

      {/* Chọn HAI đáp án */}
      {g.nhieu && (() => {
        const ns = g.nhieu.ns;
        const daChon = ns.map((n) => p.ans[n]).filter(Boolean);
        const bam = (k: string) => {
          let moi = daChon.includes(k) ? daChon.filter((x) => x !== k) : daChon.length < ns.length ? [...daChon, k] : daChon;
          moi = [...moi].sort();
          ns.forEach((n, i) => p.set(n, moi[i] ?? ''));
        };
        const dung = new Set(ns.flatMap((n) => p.dapAn[n]?.a ?? []));
        return (
          <div id={`cau-${ns[0]}`} className={s.cau}>
            <div className={s.cauDong}>
              <span className={`${s.soCau} ${ns.includes(p.dang ?? -1) ? s.soCauOn : ''}`}>{ns.join('–')}</span>
              <span style={{ flex: 1 }}><ChuDam t={g.nhieu.s} /></span>
              {ns.map((n) => <Co key={n} n={n} co={p.co} datCo={p.datCo} xem={p.xem} />)}
            </div>
            <div className={s.luaChon}>
              {g.nhieu.chon.map((o, j) => (
                <label key={o.k} className={p.xem && dung.has(o.k) ? s.lcDung : p.xem && daChon.includes(o.k) ? s.lcSai : ''}>
                  <input type="checkbox" id={j === 0 ? `q-${ns[0]}` : j === 1 ? `q-${ns[1]}` : undefined} data-cau={ns[0]} checked={daChon.includes(o.k)} disabled={p.xem || (!daChon.includes(o.k) && daChon.length >= ns.length)}
                    onChange={() => bam(o.k)} onFocus={() => p.onFocus(ns[0])} />
                  <span><b>{o.k}</b>&nbsp; {o.t}</span>
                </label>
              ))}
            </div>
            {!p.xem && <div className={s.mo} style={{ marginLeft: 34 }}>Đã chọn {daChon.length}/{ns.length}</div>}
            {ns.map((n) => <Giai key={n} n={n} p={p} />)}
          </div>
        );
      })()}
    </section>
  );
}
