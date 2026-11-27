'use client';

/**
 * dm5 G2 (27/11/2026): các nút "điền từ dữ liệu" theo loại Report trong menu ⋯ của trang Docs + hộp kết quả.
 *   Report 2  RACI trung thực (sinh viên + supervisor) / RACI nội bộ theo mũ C1–C5   (B2)
 *   Report 4  bảng CSDL 7 cột + sơ đồ + Class Specifications (từ sơ đồ SQL hoặc repo)   (B16/B17)
 *   Report 6  khung User Manual từ màn hình SRS + cảnh báo tiêu đề lệch                  (B20)
 *   Report 7  đối soát chéo Report 1–6 (trước khi ghép / sau khi ghép)                   (B19)
 *   ADR       đánh dấu "Superseded by ADR-…"                                             (B15)
 * Tách khỏi DocView.tsx để không giẫm tệp chung; DocView chỉ gọi `useDm5bDocActions` + đặt `menu` và `dialogs`.
 */

import { useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Database, GitBranch, ListChecks, Replace, Users, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { workDocsApi, workDocsKeys, workError } from '@/lib/work-api';
import { workDocs3aApi } from '@/lib/work-docs3a-api';
import { workDm5bApi, type FinalCheck, type RaciMode } from '@/lib/work-dm5b-api';
import { wt } from '@/components/work/i18n';
import { Dialog, Field, Spinner } from '../ui';

type MenuItemC = (p: { icon: typeof Wand2; label: string; onClick: () => void }) => ReactNode;

/** Danh sách phát hiện của đối soát Report 7 (dùng lại ở School › Soát trước nộp). */
export function FinalChecksList({ checks }: { checks: FinalCheck[] }) {
  if (!checks.length) return <p className="flex items-center gap-2 text-[13px] text-[var(--w-green-text)]"><CheckCircle2 size={15} /> {wt('g2.checksClean')}</p>;
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {checks.map((c, i) => (
        <li key={i} className="rounded-md border border-[var(--w-border)] px-3 py-2 text-[13px]">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: c.severity === 'error' ? 'var(--w-red-text)' : 'var(--w-orange-text)' }} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              {c.report ? <span className="mr-1 font-medium">{wt('g2.reportN', { n: c.report })}:</span> : null}{c.message}
              {!!c.items.length && <span className="mt-1 block text-[12px] text-[var(--w-text-2)]">{c.items.slice(0, 12).join(' · ')}{c.items.length > 12 ? ' …' : ''}</span>}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function useDm5bDocActions(o: {
  pid: number; num: number; templateKey: string | null; title: string; editable: boolean;
  flush: () => Promise<unknown>; baseVersion: () => number | undefined; reload: () => Promise<void> | void; MenuItem: MenuItemC; close: () => void;
}) {
  const tk = o.templateKey ?? '';
  const isAdr = tk === 'adr' || tk === 'sep490-adr' || /^ADR-\d+/i.test(o.title);
  const [checks, setChecks] = useState<FinalCheck[] | null>(null);
  const [adrOpen, setAdrOpen] = useState(false);
  const [adrBy, setAdrBy] = useState<number | ''>('');
  const after = async () => { await o.reload(); };

  const raci = useMutation({
    mutationFn: async (mode: RaciMode) => { await o.flush(); return workDocs3aApi.autofill(o.pid, o.num, { version: o.baseVersion(), sections: ['raci'], raciMode: mode }); },
    onSuccess: async (r) => { if (!r.filled.length) { toast.message(wt('docs.nothingFill')); return; } await after(); toast.success(wt('docs.filledV', { what: 'Responsibility Assignments', v: r.page.currentVersion })); },
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });
  const r4 = useMutation({
    mutationFn: async (fromRepo: boolean) => { await o.flush(); return workDm5bApi.fillReport4(o.pid, { page: o.num, version: o.baseVersion(), fromRepo }); },
    onSuccess: async (r) => {
      if (r.filled.length) { await after(); toast.success(wt('g2.filledR4', { what: r.filled.join('; ') })); }
      if (r.skipped.length) toast.message(wt('g2.skippedR4', { what: r.skipped.map((s) => `${s.part} — ${s.reason}`).join(' · ') }));
    },
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });
  const r6 = useMutation({
    mutationFn: async () => { await o.flush(); return workDm5bApi.fillReport6(o.pid, { page: o.num, version: o.baseVersion() }); },
    onSuccess: async (r) => {
      if (r.changed) { await after(); toast.success(wt('g2.r6Added', { n: r.added.length })); } else toast.message(wt('g2.r6Nothing'));
      if (r.warnings.length) toast.warning(wt('g2.r6Warn', { list: r.warnings.map((w) => `${w.heading}${w.suggestion ? ` → ${w.suggestion}` : ''}`).join(' · ') }), { duration: 12_000 });
    },
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });
  const check = useMutation({
    mutationFn: () => workDm5bApi.finalChecks(o.pid),
    onSuccess: (r) => setChecks(r.checks),
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });
  const adrs = useQuery({
    queryKey: workDocsKeys.list(o.pid), queryFn: () => workDocsApi.list(o.pid), enabled: adrOpen, staleTime: 15_000,
  });
  const supersede = useMutation({
    mutationFn: async () => { await o.flush(); return workDm5bApi.supersedeAdr(o.pid, o.num, Number(adrBy)); },
    onSuccess: async (r) => { setAdrOpen(false); await after(); toast.success(wt('g2.adrDone', { old: r.superseded, by: r.by })); },
    onError: (e) => toast.error(workError(e, wt('docs.fillFailed'))),
  });

  const M = o.MenuItem;
  const go = (f: () => void) => () => { o.close(); f(); };
  const menu: ReactNode = (
    <>
      {o.editable && tk === 'fpt-report2-project-management-plan' && <>
        <M icon={Users} label={wt('g2.fillRaciHonest')} onClick={go(() => raci.mutate('honest'))} />
        <M icon={Users} label={wt('g2.fillRaciRoles')} onClick={go(() => raci.mutate('roles'))} />
      </>}
      {o.editable && tk === 'fpt-report4-sds' && <>
        <M icon={Database} label={wt('g2.fillReport4')} onClick={go(() => r4.mutate(false))} />
        <M icon={GitBranch} label={wt('g2.fillReport4Repo')} onClick={go(() => r4.mutate(true))} />
      </>}
      {o.editable && tk === 'fpt-report6-user-guides' && <M icon={Wand2} label={wt('g2.fillReport6')} onClick={go(() => r6.mutate())} />}
      {tk === 'fpt-report7-final-report' && <M icon={ListChecks} label={check.isPending ? wt('common.loading') : wt('g2.checkFinal')} onClick={go(() => check.mutate())} />}
      {o.editable && isAdr && <M icon={Replace} label={wt('g2.adrSupersede')} onClick={go(() => setAdrOpen(true))} />}
    </>
  );
  const others = (adrs.data?.pages ?? []).filter((p) => p.number !== o.num && /^ADR-\d+/i.test(p.title));
  const errors = checks?.filter((c) => c.severity === 'error').length ?? 0;
  const dialogs: ReactNode = (
    <>
      <Dialog open={!!checks} onClose={() => setChecks(null)} title={wt('g2.checksTitle')} width={680}
        footer={<button type="button" className="w-btn w-btn-primary" onClick={() => setChecks(null)}>{wt('common.close')}</button>}>
        {checks && !!checks.length && <p className="mb-2 text-[13px]" style={{ color: errors ? 'var(--w-red-text)' : 'var(--w-orange-text)' }}>{wt('g2.checksErrors', { n: errors, w: checks.length - errors })}</p>}
        {checks && <FinalChecksList checks={checks} />}
      </Dialog>
      <Dialog open={adrOpen} onClose={() => setAdrOpen(false)} title={wt('g2.adrSupersedeTitle')} width={480}
        footer={<><button type="button" className="w-btn" onClick={() => setAdrOpen(false)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!adrBy || supersede.isPending} onClick={() => supersede.mutate()}>{supersede.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('g2.adrPick')}>
          <select className="w-input" value={adrBy} onChange={(e) => setAdrBy(e.target.value ? Number(e.target.value) : '')}>
            <option value="">—</option>
            {others.map((p) => <option key={p.number} value={p.number}>{p.title}</option>)}
          </select>
        </Field>
      </Dialog>
    </>
  );
  /** Gọi sau khi ghép Report 7: có phát hiện ⇒ mở hộp (banner đỏ khi có lỗi). */
  const showChecks = (c: FinalCheck[] | undefined) => { if (c?.length) setChecks(c); };
  return { menu, dialogs, showChecks };
}
