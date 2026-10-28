'use client';

/**
 * Bảng kết quả SQL trong khung kiểm thử (loại 'sql', 29/10/2026):
 *  - `BangSqlNho`: một bảng nhỏ (mong đợi ở tab "Kiểm mẫu");
 *  - `BangSqlSo`: "Mong đợi" cạnh "Bạn nhận" — dòng thiếu tô ở bảng mong đợi, dòng thừa tô ở bảng của bạn,
 *    dòng lệch thứ tự tô ở cả hai. Hẹp (điện thoại) ⇒ xếp chồng.
 */
import type { KetQuaKiem } from './cham/kieu';

type Bang = { cot: string[]; hang: unknown[][]; tong?: number };

const o = (v: unknown) => (v === null || v === undefined ? 'NULL' : String(v));
const khoa = (h: unknown[]) => JSON.stringify(h.map((v) => (typeof v === 'string' ? v.replace(/\s+$/, '') : v)));

function BangMot({ b, to, dong, tieuDe }: { b: Bang; to?: Set<string>; dong?: number; tieuDe: string }) {
  const tong = b.tong ?? b.hang.length;
  return (
    <figure className="cl-sql-fig">
      <figcaption>{tieuDe} <span>· {tong} {tong === 1 ? 'dòng' : 'dòng'}{tong > b.hang.length ? ` (hiện ${b.hang.length})` : ''}</span></figcaption>
      <div className="cl-sql-cuon">
        <table className="cl-sql-bang">
          <thead><tr><th className="cl-sql-so">#</th>{b.cot.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
          <tbody>
            {b.hang.length === 0 && <tr><td className="cl-sql-rong" colSpan={b.cot.length + 1}>(0 dòng)</td></tr>}
            {b.hang.map((h, i) => (
              <tr key={i} data-to={(to?.has(khoa(h)) || dong === i) ? 'true' : undefined}>
                <td className="cl-sql-so">{i + 1}</td>
                {h.map((v, j) => <td key={j} data-null={v === null ? 'true' : undefined}>{o(v)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function BangSqlNho({ b, tieuDe = 'Mong đợi' }: { b: Bang; tieuDe?: string }) {
  return <div className="cl-sql-so-sanh is-mot"><BangMot b={{ ...b, hang: b.hang.slice(0, 8), tong: b.tong ?? b.hang.length }} tieuDe={tieuDe} /></div>;
}

export function BangSqlSo({ d }: { d: NonNullable<KetQuaKiem['bangSql']> }) {
  const thieu = new Set((d.thieu ?? []).map(khoa));
  const thua = new Set((d.thua ?? []).map(khoa));
  return (
    <div className="cl-sql-so-sanh">
      {d.mong && <BangMot b={d.mong} to={thieu} dong={d.dongLech} tieuDe="Mong đợi · Expected" />}
      {d.thay && <BangMot b={d.thay} to={thua} dong={d.dongLech} tieuDe="Bạn nhận · Yours" />}
    </div>
  );
}
