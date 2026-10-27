'use client';

/**
 * Khung TRẢ LỜI cho đề chấm tĩnh (đợt Academy 28/10/2026) — thay chỗ editor code:
 *   choice: trắc nghiệm một/nhiều đáp án · order: sắp thứ tự (nút ↑/↓, kéo-thả) · table: điền bảng
 *   (ô chữ hoặc ô chọn) — dạng SWT301 (phân vùng, giá trị biên, bảng quyết định) / SWR302.
 * Đáp án không có ở trình duyệt (chỉ băm); chấm ở cham/chamTinh.ts, máy chủ chấm lại khi Nộp.
 */
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical, XCircle } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import type { KetQuaKiem, TestsJson } from './cham/kieu';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const html = (s: unknown) => ({ __html: sanitizeHtml(String(s ?? '')) });

interface Props {
  tj: TestsJson;
  traLoi: Record<string, unknown>;
  onChange: (t: Record<string, unknown>) => void;
  ketQua: KetQuaKiem[] | null;
  /** Đã Nộp ⇒ hiện giải thích từng câu. */
  daNop: boolean;
}

function Dau({ r }: { r: KetQuaKiem | undefined }) {
  if (!r) return null;
  return r.dat
    ? <CheckCircle2 size={16} className="cl-tl-ic ok" aria-label="Đúng" />
    : <XCircle size={16} className="cl-tl-ic bad" aria-label="Sai" />;
}

export function TraLoiTinh({ tj, traLoi, onChange, ketQua, daNop }: Props) {
  const dat = (ma: string, v: unknown) => onChange({ ...traLoi, [ma]: v });

  if (tj.loai === 'table') {
    let chiSo = 0;
    return (
      <div className="cl-tl">
        {(Array.isArray(tj.bang) ? tj.bang : []).filter(isObj).map((b) => {
          const ma = String(b.ma ?? '');
          const cot = (Array.isArray(b.cot) ? b.cot : []).filter(isObj);
          const hang = (Array.isArray(b.hang) ? b.hang : []).filter(isObj);
          const o = Object.keys(isObj(b.dapAnBam) ? b.dapAnBam : {});
          const viTri: Record<string, number> = {};
          for (const k of o) viTri[k] = chiSo++;
          return (
            <div key={ma} className="cl-tl-bang">
              {typeof b.de === 'string' && <div className="prose-cl cl-tl-de" dangerouslySetInnerHTML={html(b.de)} />}
              <div className="cl-tl-scroll">
                <table>
                  <thead><tr>{cot.map((c) => <th key={String(c.ma)}>{String(c.ten ?? c.ma)}</th>)}</tr></thead>
                  <tbody>
                    {hang.map((h) => {
                      const mh = String(h.ma ?? '');
                      const oCo = isObj(h.o) ? h.o : {};
                      return (
                        <tr key={mh}>
                          {cot.map((c) => {
                            const mc = String(c.ma ?? '');
                            const khoa = `${mh}.${mc}`;
                            if (!(khoa in viTri)) return <td key={mc} className="cl-tl-co">{String(oCo[mc] ?? '')}</td>;
                            const ten = `${ma}.${khoa}`;
                            const r = ketQua?.[viTri[khoa]];
                            const v = String(traLoi[ten] ?? '');
                            const lc = Array.isArray(c.luaChon) ? c.luaChon.map(String) : null;
                            return (
                              <td key={mc} className="cl-tl-o" data-ok={r ? (r.dat ? 'true' : 'false') : undefined}>
                                <span className="flex items-center gap-1.5">
                                  {lc ? (
                                    <select value={v} onChange={(e) => dat(ten, e.target.value)} aria-label={`${String(c.ten ?? mc)} — ${mh}`}>
                                      <option value="">— chọn —</option>
                                      {lc.map((x) => <option key={x} value={x}>{x}</option>)}
                                    </select>
                                  ) : (
                                    <input value={v} onChange={(e) => dat(ten, e.target.value)} placeholder="…" aria-label={`${String(c.ten ?? mc)} — ${mh}`} />
                                  )}
                                  <Dau r={r} />
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {daNop && typeof b.giaiThich === 'string' && <div className="prose-cl cl-tl-giai" dangerouslySetInnerHTML={html(b.giaiThich)} />}
            </div>
          );
        })}
      </div>
    );
  }

  const cau = (Array.isArray(tj.cauHoi) ? tj.cauHoi : []).filter(isObj);
  return (
    <ol className="cl-tl">
      {cau.map((c, i) => {
        const ma = String(c.ma ?? i);
        const r = ketQua?.[i];
        const de = <div className="prose-cl cl-tl-de" dangerouslySetInnerHTML={html(c.de)} />;
        if (tj.loai === 'order') {
          const goc = (Array.isArray(c.muc) ? c.muc : []).filter(isObj);
          const thuTu = Array.isArray(traLoi[ma]) ? (traLoi[ma] as string[]) : goc.map((m) => String(m.ma));
          const theoMa = new Map(goc.map((m) => [String(m.ma), m]));
          const doi = (a: number, b: number) => {
            if (b < 0 || b >= thuTu.length) return;
            const t = [...thuTu];
            [t[a], t[b]] = [t[b], t[a]];
            dat(ma, t);
          };
          return (
            <li key={ma} className="cl-tl-cau" data-ok={r ? (r.dat ? 'true' : 'false') : undefined}>
              <div className="cl-tl-dau"><span className="cl-tl-so">{i + 1}</span>{de}<Dau r={r} /></div>
              <ol className="cl-tl-sap">
                {thuTu.map((m, j) => (
                  <li
                    key={m}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', String(j))}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); const tu = Number(e.dataTransfer.getData('text/plain')); if (Number.isFinite(tu) && tu !== j) { const t = [...thuTu]; const [x] = t.splice(tu, 1); t.splice(j, 0, x); dat(ma, t); } }}
                  >
                    <GripVertical size={14} className="cl-tl-keo" aria-hidden />
                    <span className="cl-tl-stt">{j + 1}</span>
                    <span className="min-w-0 flex-1" dangerouslySetInnerHTML={html(theoMa.get(m)?.noiDung ?? m)} />
                    <button type="button" onClick={() => doi(j, j - 1)} disabled={j === 0} aria-label="Lên"><ArrowUp size={14} /></button>
                    <button type="button" onClick={() => doi(j, j + 1)} disabled={j === thuTu.length - 1} aria-label="Xuống"><ArrowDown size={14} /></button>
                  </li>
                ))}
              </ol>
              {daNop && typeof c.giaiThich === 'string' && <div className="prose-cl cl-tl-giai" dangerouslySetInnerHTML={html(c.giaiThich)} />}
            </li>
          );
        }
        const nhieu = c.nhieu === true;
        const chon = traLoi[ma];
        const dangChon = (x: string) => (nhieu ? Array.isArray(chon) && chon.includes(x) : chon === x);
        return (
          <li key={ma} className="cl-tl-cau" data-ok={r ? (r.dat ? 'true' : 'false') : undefined}>
            <div className="cl-tl-dau"><span className="cl-tl-so">{i + 1}</span>{de}<Dau r={r} /></div>
            {nhieu && <p className="cl-tl-ghi">Chọn TẤT CẢ đáp án đúng.</p>}
            <div className="cl-tl-lc" role={nhieu ? 'group' : 'radiogroup'}>
              {(Array.isArray(c.luaChon) ? c.luaChon : []).filter(isObj).map((l) => {
                const x = String(l.ma);
                return (
                  <label key={x} data-on={dangChon(x) ? 'true' : undefined}>
                    <input
                      type={nhieu ? 'checkbox' : 'radio'}
                      name={`cau-${ma}`}
                      checked={dangChon(x)}
                      onChange={() => {
                        if (!nhieu) return dat(ma, x);
                        const cu = Array.isArray(chon) ? (chon as string[]) : [];
                        dat(ma, cu.includes(x) ? cu.filter((y) => y !== x) : [...cu, x]);
                      }}
                    />
                    <span className="cl-tl-ma">{x.toUpperCase()}</span>
                    <span className="min-w-0 flex-1" dangerouslySetInnerHTML={html(l.noiDung ?? x)} />
                  </label>
                );
              })}
            </div>
            {daNop && typeof c.giaiThich === 'string' && <div className="prose-cl cl-tl-giai" dangerouslySetInnerHTML={html(c.giaiThich)} />}
          </li>
        );
      })}
    </ol>
  );
}
