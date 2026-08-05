'use client';

/**
 * Bộ điều phối widget.
 *
 * Nạp động (`next/dynamic`, `ssr: false`) vì mỗi widget đều là trạng thái
 * tương tác thuần client — render chúng phía server chỉ tốn HTML cho một
 * khung tĩnh mà người dùng sẽ thấy nhảy khi hydrate. Chương nào không có
 * widget thì không tải một byte nào của chúng.
 */
import dynamic from 'next/dynamic';
import type { WidgetName } from '../data/types';

function Skeleton() {
  return (
    <div className="my-2 h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
  );
}

const ScanCompare = dynamic(() => import('./ScanCompare'), { ssr: false, loading: Skeleton });
const BTreeExplorer = dynamic(() => import('./BTreeExplorer'), { ssr: false, loading: Skeleton });
const QuerySim = dynamic(() => import('./QuerySim'), { ssr: false, loading: Skeleton });
const NullLab = dynamic(() => import('./NullLab'), { ssr: false, loading: Skeleton });
const JoinVenn = dynamic(() => import('./JoinVenn'), { ssr: false, loading: Skeleton });
const TxnSim = dynamic(() => import('./TxnSim'), { ssr: false, loading: Skeleton });

const MAP: Record<WidgetName, React.ComponentType> = {
  'scan-compare': ScanCompare,
  btree: BTreeExplorer,
  'query-sim': QuerySim,
  'null-lab': NullLab,
  'join-venn': JoinVenn,
  'txn-sim': TxnSim,
};

export default function Widget({
  name, title, hint,
}: { name: WidgetName; title?: string; hint?: string }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return (
    <section className="my-6">
      {title && (
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
          <span className="rounded-md border border-violet-400/25 bg-violet-500/10 px-1.5 py-px text-[10px] font-medium text-violet-300">
            bấm được
          </span>
        </div>
      )}
      {hint && <p className="mb-2.5 text-xs leading-relaxed text-slate-500">{hint}</p>}
      <Cmp />
    </section>
  );
}
