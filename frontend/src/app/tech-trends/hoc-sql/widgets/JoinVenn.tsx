'use client';

/**
 * Bốn kiểu JOIN trên hai bảng nhỏ có thật.
 *
 * Cố ý để dữ liệu có CẢ HAI phía lệch: một khách chưa có đơn nào, và một đơn
 * mồ côi không thuộc khách nào. Thiếu một trong hai thì LEFT và RIGHT trông
 * giống nhau, và người học không rút ra được gì.
 */
import { useMemo, useState } from 'react';

type JoinKind = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

const CUSTOMERS = [
  { id: 1, name: 'An' },
  { id: 2, name: 'Bình' },
  { id: 3, name: 'Cường' },
  { id: 4, name: 'Dung' },
];

const ORDERS = [
  { id: 101, customer_id: 1, total: '500k' },
  { id: 102, customer_id: 1, total: '300k' },
  { id: 103, customer_id: 2, total: '900k' },
  { id: 104, customer_id: 9, total: '150k' }, // đơn mồ côi: khách 9 không tồn tại
];

const KINDS: { k: JoinKind; label: string; desc: string }[] = [
  { k: 'INNER', label: 'INNER JOIN', desc: 'Chỉ giữ dòng có cặp ở CẢ HAI bảng' },
  { k: 'LEFT', label: 'LEFT JOIN', desc: 'Giữ MỌI khách, đơn không có thì NULL' },
  { k: 'RIGHT', label: 'RIGHT JOIN', desc: 'Giữ MỌI đơn, khách không có thì NULL' },
  { k: 'FULL', label: 'FULL JOIN', desc: 'Giữ tất cả của cả hai bên' },
];

type Cell = string | null;

export default function JoinVenn() {
  const [kind, setKind] = useState<JoinKind>('INNER');

  const rows = useMemo<Cell[][]>(() => {
    const out: Cell[][] = [];
    const matchedOrderIds = new Set<number>();

    CUSTOMERS.forEach((c) => {
      const os = ORDERS.filter((o) => o.customer_id === c.id);
      if (os.length > 0) {
        os.forEach((o) => {
          matchedOrderIds.add(o.id);
          out.push([String(c.id), c.name, String(o.id), o.total]);
        });
      } else if (kind === 'LEFT' || kind === 'FULL') {
        out.push([String(c.id), c.name, null, null]);
      }
    });

    if (kind === 'RIGHT' || kind === 'FULL') {
      ORDERS.filter((o) => !matchedOrderIds.has(o.id)).forEach((o) => {
        out.push([null, null, String(o.id), o.total]);
      });
    }
    return out;
  }, [kind]);

  const sql = `SELECT c.id, c.name, o.id, o.total
FROM customers c
${kind === 'INNER' ? 'JOIN' : `${kind} JOIN`} orders o ON o.customer_id = c.id;`;

  const on = 'rgba(167,139,250,0.55)';
  const off = 'rgba(255,255,255,0.05)';
  const vLeft = kind === 'LEFT' || kind === 'FULL';
  const vRight = kind === 'RIGHT' || kind === 'FULL';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.k}
            type="button"
            onClick={() => setKind(k.k)}
            className={[
              'rounded-xl border px-3 py-1.5 font-mono text-xs font-medium transition-all active:scale-95',
              kind === k.k
                ? 'border-violet-400/50 bg-violet-500/20 text-white'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white',
            ].join(' ')}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        {/* Bên trái: hai bảng nguồn + Venn */}
        <div className="space-y-3">
          <svg viewBox="0 0 260 130" className="h-auto w-full max-w-[280px]">
            <defs>
              <clipPath id="jv-clip-left"><circle cx="100" cy="62" r="50" /></clipPath>
            </defs>
            <circle cx="100" cy="62" r="50" fill={vLeft ? on : off} />
            <circle cx="160" cy="62" r="50" fill={vRight ? on : off} />
            <g clipPath="url(#jv-clip-left)">
              <circle cx="160" cy="62" r="50" fill={on} />
            </g>
            <circle cx="100" cy="62" r="50" fill="none" stroke="rgba(255,255,255,0.16)" />
            <circle cx="160" cy="62" r="50" fill="none" stroke="rgba(255,255,255,0.16)" />
            <text x="62" y="66" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="700">customers</text>
            <text x="200" y="66" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="700">orders</text>
          </svg>

          <div className="rounded-xl border border-white/10 bg-[#0c0c14] p-3">
            <pre className="overflow-x-auto whitespace-pre font-mono text-[11.5px] leading-relaxed text-slate-300">{sql}</pre>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/[0.05] p-2">
              <p className="mb-1 font-semibold text-emerald-300">customers</p>
              {CUSTOMERS.map((c) => (
                <p key={c.id} className="font-mono text-slate-400">
                  {c.id} · {c.name}
                  {!ORDERS.some((o) => o.customer_id === c.id) && (
                    <span className="ml-1 text-amber-400">← chưa mua</span>
                  )}
                </p>
              ))}
            </div>
            <div className="rounded-lg border border-sky-400/20 bg-sky-500/[0.05] p-2">
              <p className="mb-1 font-semibold text-sky-300">orders</p>
              {ORDERS.map((o) => (
                <p key={o.id} className="font-mono text-slate-400">
                  {o.id} · kh {o.customer_id}
                  {!CUSTOMERS.some((c) => c.id === o.customer_id) && (
                    <span className="ml-1 text-amber-400">← mồ côi</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bên phải: kết quả */}
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-white">{rows.length}</span>
            <span className="text-xs text-slate-400">dòng kết quả</span>
            <span className="ml-auto text-[11px] text-slate-500">{KINDS.find((k) => k.k === kind)?.desc}</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-white/[0.05]">
                  {['c.id', 'c.name', 'o.id', 'o.total'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-mono text-[11px] font-semibold text-violet-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`r-${i}`} className="border-t border-white/[0.07]">
                    {r.map((c, j) => (
                      <td key={`r-${i}-${j}`} className="whitespace-nowrap px-3 py-1.5">
                        {c === null
                          ? <span className="font-mono text-[11px] text-amber-400/80">NULL</span>
                          : <span className="text-slate-200">{c}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500">(không có dòng nào)</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-400">
            {kind === 'INNER' && (
              <>Dung biến mất (chưa có đơn), đơn 104 cũng biến mất (khách 9 không tồn tại). INNER chỉ giữ phần khớp.</>
            )}
            {kind === 'LEFT' && (
              <>Dung xuất hiện với đơn là <span className="font-mono text-amber-400">NULL</span> — đây là điều bạn muốn khi làm báo cáo &quot;mọi khách kèm số đơn&quot;. Nhưng nhớ dùng <code className="font-mono text-emerald-300">COUNT(o.id)</code> chứ không phải <code className="font-mono text-rose-300">COUNT(*)</code>, nếu không Dung sẽ ra 1 thay vì 0.</>
            )}
            {kind === 'RIGHT' && (
              <>Đơn 104 xuất hiện với khách là <span className="font-mono text-amber-400">NULL</span>. Trong thực tế đây là dấu hiệu dữ liệu hỏng — nếu có khoá ngoại thì đơn mồ côi đã không tồn tại được.</>
            )}
            {kind === 'FULL' && (
              <>Cả Dung lẫn đơn 104 đều hiện ra. FULL JOIN chủ yếu dùng để ĐỐI SOÁT hai nguồn dữ liệu và tìm chỗ lệch nhau.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
