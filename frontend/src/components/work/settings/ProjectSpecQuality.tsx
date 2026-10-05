'use client';

/**
 * Cài đặt dự án → Spec quality & AI (đợt S6):
 *   · Cổng "Spec Fidelity gate": bật/tắt, ngưỡng tổng (mặc định 70) + mỗi chiều (mặc định 50), giai đoạn áp cổng
 *     (mặc định giai đoạn slug `dac-ta-yeu-cau`). Chỉ có nghĩa khi mô-đun Stages + Approvals bật.
 *   · Luật "AI-assisted work needs an independent reviewer" (mặc định TẮT).
 * Chỉ ADMIN dự án đổi được (server kiểm `studio.configure`).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workS6Api, workS6Keys, type SpecGateConfig } from '@/lib/work-s6-api';
import { PageLoading, Spinner } from '../ui';
import { Section, Switch } from './shared';

export default function ProjectSpecQuality({ config }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: workS6Keys.settings(pid), queryFn: () => workS6Api.settings(pid) });
  const [gate, setGate] = useState<SpecGateConfig | null>(null);
  useEffect(() => { if (q.data) setGate(q.data.specGate); }, [q.data]);
  const save = useMutation({
    mutationFn: (body: Parameters<typeof workS6Api.updateSettings>[1]) => workS6Api.updateSettings(pid, body),
    onSuccess: (r) => { qc.setQueryData(workS6Keys.settings(pid), r); setGate(r.specGate); toast.success('Saved'); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  if (!q.data || !gate) return <PageLoading rows={4} />;
  const s = q.data;
  const can = s.canConfigure;
  const dirty = JSON.stringify(gate) !== JSON.stringify(s.specGate);
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const defaultStage = s.stages.find((x) => x.slug === s.defaultStageSlug);

  return (
    <div className="max-w-[880px]">
      <Section
        title="Spec Fidelity gate"
        description={<>Before a stage can be sent for gate review, its latest Spec Fidelity check must reach the thresholds. The check is attached to the gate approval. Project admins can override with a reason (recorded in the audit log). <Link href={`${base}/spec`} className="text-[var(--w-accent-text)] hover:underline">Open Spec quality</Link></>}
      >
        {!s.stagesOn || !s.approvalsOn ? (
          <p className="text-[13px] text-[var(--w-text-2)]">
            The gate needs the <b className="font-medium">Stages</b> and <b className="font-medium">Approvals</b> modules (Project type &amp; modules). Without them you can still run checks from Docs and from Issues → <i>Check spec quality</i>.
          </p>
        ) : (
          <div className="space-y-4" data-testid="spec-gate-settings">
            <div className="flex items-start gap-3">
              <Switch checked={gate.enabled} onChange={(v) => setGate({ ...gate, enabled: v })} disabled={!can} label="Require a passing Spec Fidelity check before the gate review" />
              <span className="text-[13px]">Require a passing Spec Fidelity check before the gate review</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Minimum overall score</span>
                <input type="number" min={0} max={100} className="w-input !h-8 max-w-[120px]" disabled={!can} value={gate.minOverall} onChange={(e) => setGate({ ...gate, minOverall: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })} />
              </label>
              <label>
                <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Minimum for each dimension</span>
                <input type="number" min={0} max={100} className="w-input !h-8 max-w-[120px]" disabled={!can} value={gate.minDimension} onChange={(e) => setGate({ ...gate, minDimension: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })} />
              </label>
            </div>
            <fieldset>
              <legend className="mb-1 text-[12px] text-[var(--w-text-2)]">Stages with the gate</legend>
              <p className="mb-2 text-[12px] text-[var(--w-text-3)]">
                None ticked ⇒ the requirements stage (slug <code className="font-mono">{s.defaultStageSlug}</code>{defaultStage ? `: ${defaultStage.n}. ${defaultStage.name}` : ' — not in this project yet'}).
              </p>
              <div className="grid max-h-[220px] gap-1 overflow-y-auto sm:grid-cols-2">
                {s.stages.map((st) => (
                  <label key={st.id} className="flex min-w-0 items-center gap-2 text-[13px]">
                    <input
                      type="checkbox" disabled={!can} checked={gate.stageIds.includes(st.id)}
                      onChange={(e) => setGate({ ...gate, stageIds: e.target.checked ? [...gate.stageIds, st.id] : gate.stageIds.filter((x) => x !== st.id) })}
                    />
                    <span className="truncate">{String(st.n).padStart(2, '0')}. {st.name}</span>
                  </label>
                ))}
                {!s.stages.length && <span className="text-[12px] text-[var(--w-text-3)]">No stages yet.</span>}
              </div>
            </fieldset>
            {can && (
              <div className="flex gap-2">
                <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!dirty || save.isPending} onClick={() => save.mutate({ specGate: gate })} data-testid="spec-gate-save">
                  {save.isPending && <Spinner size={11} />} Save gate
                </button>
                {dirty && <button type="button" className="w-btn w-btn-sm" onClick={() => setGate(s.specGate)}>Reset</button>}
              </div>
            )}
          </div>
        )}
      </Section>

      <Section
        title="AI provenance"
        description="Issues and documents created or edited through an applied AI suggestion, or linked to a commit/PR with a Co-Authored-By trailer from an AI model, are labelled AI-assisted (with the model, time and who applied it in the history). You can also mark them by hand."
      >
        <div className="flex items-start gap-3">
          <Switch
            checked={s.aiReview.requireIndependentReviewer}
            disabled={!can || save.isPending}
            onChange={(v) => save.mutate({ aiReview: { requireIndependentReviewer: v } })}
            label="AI-assisted work needs an independent reviewer"
          />
          <span className="min-w-0 text-[13px]">
            <b className="font-medium">AI-assisted work needs an independent reviewer</b>
            <span className="block text-[12.5px] text-[var(--w-text-2)]">Moving an AI-assisted issue to Done requires an approval from someone other than its creator and the person who applied the AI suggestion.</span>
          </span>
        </div>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Off by default. Automation rules and integrations are not blocked; people and the AI assistant are.</p>
      </Section>
    </div>
  );
}
