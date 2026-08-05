'use client';

/**
 * Bảng tra cứu SQL Server ↔ PostgreSQL.
 *
 * Tìm kiếm BỎ DẤU, vì người dùng sẽ gõ "phan trang" chứ không gõ "phân trang"
 * khi đang vội tra giữa lúc làm bài. Và tìm cả trong cột ghi chú — nhiều khi
 * người ta nhớ mô tả chứ không nhớ tên câu lệnh.
 */
import { useMemo, useState } from 'react';
import { Search, X, ArrowLeftRight } from 'lucide-react';
import { MSSQL_ROWS, MSSQL_GROUPS, deaccent } from './data';

export default function MssqlView() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = deaccent(q.trim());
    return MSSQL_ROWS.filter((r) => {
      if (group && r.group !== group) return false;
      if (!needle) return true;
      return deaccent(`${r.topic} ${r.ms} ${r.pg} ${r.note ?? ''} ${r.group}`).includes(needle);
    });
  }, [q, group]);

  return (
    <div>
      {/* Lời dẫn: đặt kỳ vọng đúng trước khi người học lo lắng */}
      <div className="mb-5 rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-4 sm:p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-orange-300">
          <ArrowLeftRight className="h-4 w-4" />
          Trường dạy SQL Server, web chạy PostgreSQL — có phải học lại từ đầu không?
        </p>
        <p className="text-[14.5px] leading-relaxed text-slate-300">
          <b className="text-white">Không.</b> Phần lõi của SQL là một chuẩn chung (ANSI SQL):
          {' '}<code className="font-mono text-violet-300">SELECT</code>,{' '}
          <code className="font-mono text-violet-300">WHERE</code>,{' '}
          <code className="font-mono text-violet-300">JOIN</code>,{' '}
          <code className="font-mono text-violet-300">GROUP BY</code>,{' '}
          <code className="font-mono text-violet-300">transaction</code> — giống nhau tới khoảng 90%.
          Bài bạn làm ở trường vẫn dùng được gần nguyên vẹn.
        </p>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-300">
          Khác nhau nằm ở phần rìa: <b className="text-white">kiểu dữ liệu</b>, <b className="text-white">hàm xử lý chuỗi và ngày</b>,
          {' '}<b className="text-white">cách phân trang</b>, <b className="text-white">cách sinh số tự tăng</b>.
          Đó là danh sách bên dưới — {MSSQL_ROWS.length} dòng, mỗi dòng là một thứ đã thực sự làm ai đó vấp.
        </p>
        <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
          {[
            { t: 'Khác biệt gây vấp nhất', d: 'Postgres PHÂN BIỆT hoa/thường khi so chuỗi. SQL Server thì không.' },
            { t: 'Khác biệt gặp sớm nhất', d: 'TOP 10 → LIMIT 10, và LIMIT phải đứng cuối câu.' },
            { t: 'Khác biệt tốn tiền nhất', d: 'DATETIME2 → timestamptz. Quên múi giờ là lệch giờ toàn hệ thống.' },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-orange-300/80">{x.t}</p>
              <p className="text-[12.5px] leading-relaxed text-slate-400">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tìm kiếm + lọc nhóm */}
      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tra nhanh — gõ không dấu cũng được: phan trang, kieu tien, noi chuoi…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-violet-400/50 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="Xoá từ khoá"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setGroup(null)}
            className={[
              'rounded-lg border px-2.5 py-1 text-xs transition-all active:scale-95',
              group === null
                ? 'border-violet-400/50 bg-violet-500/20 text-white'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
            ].join(' ')}
          >
            Tất cả
          </button>
          {MSSQL_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g === group ? null : g)}
              className={[
                'rounded-lg border px-2.5 py-1 text-xs transition-all active:scale-95',
                group === g
                  ? 'border-violet-400/50 bg-violet-500/20 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
              ].join(' ')}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs text-slate-500">
        <b className="text-slate-300">{rows.length}</b> / {MSSQL_ROWS.length} dòng
      </p>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-slate-500">
          Không tìm thấy. Thử một từ khoá ngắn hơn.
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={`${r.group}-${r.topic}`} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-white/[0.07] px-3.5 py-2">
                <span className="text-[13.5px] font-semibold text-slate-100">{r.topic}</span>
                <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-px text-[10px] text-slate-500">{r.group}</span>
              </div>
              <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
                <div className="bg-[#0b0b12] px-3.5 py-2.5">
                  <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wide text-orange-300/80">SQL Server</p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-slate-300">{r.ms}</pre>
                </div>
                <div className="bg-[#0b0b12] px-3.5 py-2.5">
                  <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wide text-sky-300/80">PostgreSQL</p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-slate-300">{r.pg}</pre>
                </div>
              </div>
              {r.note && (
                <p className="border-t border-white/[0.07] px-3.5 py-2 text-[12.5px] leading-relaxed text-slate-400">{r.note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
