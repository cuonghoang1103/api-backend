'use client';

/**
 * dm5 G2 (27/11/2026) B16 — từ sơ đồ SQL (Database designer) xem MỖI BẢNG một bảng 7 cột đúng mẫu Report 4 §1.3
 * (No · Field · PK · FK · UN · NN · Description) + Constraints, rồi một bấm đưa vào trang Report 4. MCP: diagram_extras db_design_table.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workDm5bApi, workDm5bKeys } from '@/lib/work-dm5b-api';
import { wt } from '@/components/work/i18n';
import { Dialog, PageLoading, Spinner } from '../ui';

const TH = 'border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-1 text-left text-[11.5px] font-medium text-[var(--w-text-2)]';
const TD = 'border-b border-[var(--w-border)] px-2 py-1 align-top text-[12px]';

export default function DbDesignDialog({ pid, diagram, open, onClose, canEdit }: { pid: number; diagram: number; open: boolean; onClose: () => void; canEdit: boolean }) {
  const q = useQuery({ queryKey: workDm5bKeys.dbDesign(pid, diagram), queryFn: () => workDm5bApi.dbDesign(pid, { diagram }), enabled: open });
  const put = useMutation({
    mutationFn: () => workDm5bApi.fillDbDesign(pid, { diagram }),
    onSuccess: (r) => { toast.success(wt('g2.dbPut', { n: r.tables })); onClose(); },
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} width={860} title={q.data ? wt('g2.dbTablesTitle', { n: q.data.tables.length }) : wt('g2.dbTables')}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>{canEdit && <button type="button" className="w-btn w-btn-primary" disabled={!q.data || put.isPending} onClick={() => put.mutate()}>{put.isPending && <Spinner size={12} />} {wt('g2.dbToReport4')}</button>}</>}>
      {q.isLoading && <PageLoading rows={4} />}
      {q.error && <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error)}</p>}
      {q.data && (
        <div className="flex max-h-[62vh] flex-col gap-4 overflow-auto">
          <p className="text-[12px] text-[var(--w-text-2)]">{q.data.source.label}</p>
          {!!q.data.source.problems.length && <p className="text-[12px] text-[var(--w-orange-text)]">{wt('g2.dbProblems', { list: q.data.source.problems.join(' · ') })}</p>}
          {q.data.tables.map((tb, i) => (
            <section key={tb.name} aria-label={tb.name}>
              <h3 className="mb-1 text-[13px] font-semibold">1.3.{i + 1} {tb.name}</h3>
              <table className="w-full border-separate border-spacing-0">
                <thead><tr>{['No', 'Field', 'PK', 'FK', 'UN', 'NN', 'Description'].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {tb.fields.map((f) => (
                    <tr key={f.field}>
                      <td className={`${TD} w-10 tabular-nums`}>{f.no}</td><td className={`${TD} font-mono`}>{f.field}</td>
                      {[f.pk, f.fk, f.un, f.nn].map((b, k) => <td key={k} className={`${TD} w-10 text-center`}>{b ? 'X' : ''}</td>)}
                      <td className={TD}>{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!!tb.constraints.length && <p className="mt-1 text-[12px] text-[var(--w-text-2)]"><b>{wt('g2.dbConstraints')}:</b> {tb.constraints.join(' · ')}</p>}
            </section>
          ))}
        </div>
      )}
    </Dialog>
  );
}
