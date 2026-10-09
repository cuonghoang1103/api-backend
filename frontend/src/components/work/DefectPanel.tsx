'use client';

/**
 * CTW đợt 4 (A16 + B5) — khung "Defect" trên mọi thẻ Bug: Severity (mức nặng, KHÁC Priority), Activity, Product,
 * Product details — đúng cột sheet Defects của Report2_Project Tracking. Bug sinh từ spec review hiện nguồn.
 * Backend: GET/PUT /projects/:pid/issues/:num/defect (defects.service.ts).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { SEVERITY_LABEL, workCtw4Api, workCtw4Keys, type Severity } from '@/lib/work-ctw4-api';
import { wk } from './hooks';

const ACTIVITY_LABEL: Record<string, string> = { Review: 'Review (documents)', UT: 'UT — unit test', IT: 'IT — integration test', ST: 'ST — system test', AT: 'AT — acceptance test' };

function Row({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[108px_1fr] items-center gap-2 py-0.5">
      <label htmlFor={id} className="truncate text-[12px] text-[var(--w-text-3)]">{label}</label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function DefectPanel({ pid, num, editable }: { pid: number; num: number; editable: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: workCtw4Keys.defect(pid, num), queryFn: () => workCtw4Api.defect(pid, num) });
  const [details, setDetails] = useState('');
  useEffect(() => { setDetails(q.data?.productDetails ?? ''); }, [q.data?.productDetails]);
  const save = useMutation({
    mutationFn: (body: Parameters<typeof workCtw4Api.setDefect>[2]) => workCtw4Api.setDefect(pid, num, body),
    onSuccess: (d) => {
      qc.setQueryData(workCtw4Keys.defect(pid, num), d);
      qc.invalidateQueries({ queryKey: wk.history(pid, num) });
    },
    onError: (err) => toast.error(workError(err, 'Could not save the defect fields')),
  });
  if (!q.data?.isBug) return null;
  const d = q.data;
  const sel = 'w-input w-input-bare';
  return (
    <section aria-labelledby={`w-defect-${num}`} className="mt-4 border-t border-[var(--w-border)] pt-3">
      <div className="mb-1 flex items-baseline gap-2">
        <span id={`w-defect-${num}`} className="text-[12px] font-medium text-[var(--w-text-2)]">Defect</span>
        {d.source && <span className="text-[11.5px] text-[var(--w-text-2)]">From spec review #{d.source.reviewId}</span>}
      </div>
      <Row label="Severity" id={`w-def-sev-${num}`}>
        <select id={`w-def-sev-${num}`} className={sel} disabled={!editable || save.isPending} value={d.severity ?? ''} onChange={(e) => save.mutate({ severity: (e.target.value || null) as Severity | null })}>
          <option value="">Not set</option>
          {d.options.severities.map((s) => <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>)}
        </select>
      </Row>
      <Row label="Activity" id={`w-def-act-${num}`}>
        <select id={`w-def-act-${num}`} className={sel} disabled={!editable || save.isPending} value={d.activity ?? ''} onChange={(e) => save.mutate({ activity: e.target.value || null })}>
          <option value="">Not set</option>
          {d.options.activities.map((a) => <option key={a} value={a}>{ACTIVITY_LABEL[a] ?? a}</option>)}
        </select>
      </Row>
      <Row label="Product" id={`w-def-prod-${num}`}>
        <select id={`w-def-prod-${num}`} className={sel} disabled={!editable || save.isPending} value={d.product ?? ''} onChange={(e) => save.mutate({ product: e.target.value || null })}>
          <option value="">Not set</option>
          {d.options.products.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Row>
      <Row label="Product details" id={`w-def-det-${num}`}>
        <input id={`w-def-det-${num}`} className={sel} maxLength={300} disabled={!editable} placeholder="Screen, module or section" value={details}
          onChange={(e) => setDetails(e.target.value)}
          onBlur={() => { if (details.trim() !== (d.productDetails ?? '')) save.mutate({ productDetails: details.trim() || null }); }} />
      </Row>
      <p className="mt-1 text-[11.5px] text-[var(--w-text-2)]">Severity is how bad the defect is; Priority is when to fix it.</p>
    </section>
  );
}
