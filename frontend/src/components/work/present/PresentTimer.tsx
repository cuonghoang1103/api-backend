'use client';

/**
 * dm5 G4 (D15, 27/11/2026) — đồng hồ thuyết trình/bảo vệ: đếm thời lượng, mốc phút (vd 2' vấn đề · 7' demo · 11' thiết kế & test ·
 * 14' chốt), báo QUÁ GIỜ, nút Plan B mở clip demo dự phòng. Cấu hình lưu ở settings.present (ADMIN dự án sửa; máy chủ chuẩn hoá
 * ở dm5g4Rules › normalizeG4Settings). Phím T: bắt đầu / tạm dừng đồng hồ khi đang trình chiếu.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clapperboard, Pause, Play, Plus, RotateCcw, Save, Timer, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

export interface PresentCfg { durationMin: number; marks: Array<{ atMin: number; label: string }>; planBUrl: string | null; planBLabel: string | null }
export const PRESENT_DEFAULT: PresentCfg = {
  durationMin: 15, planBUrl: null, planBLabel: null,
  marks: [{ atMin: 2, label: 'Problem & scope' }, { atMin: 7, label: 'Live demo' }, { atMin: 11, label: 'Design & tests' }, { atMin: 14, label: 'Wrap-up' }],
};
export function presentCfgOf(config: ProjectConfig): PresentCfg {
  const p = (config.settings?.present ?? null) as Partial<PresentCfg> | null;
  return p && typeof p === 'object' ? { ...PRESENT_DEFAULT, ...p, marks: Array.isArray(p.marks) ? p.marks : PRESENT_DEFAULT.marks } : PRESENT_DEFAULT;
}
const mmss = (s: number) => `${s < 0 ? '-' : ''}${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;
const safeUrl = (u: string | null) => (u && /^https?:\/\//i.test(u) ? u : null);

/** Ô cấu hình ở màn chuẩn bị. */
export function PresentTimerSettings({ config }: { config: ProjectConfig }) {
  const qc = useQueryClient();
  const cur = presentCfgOf(config);
  const [cfg, setCfg] = useState<PresentCfg>(cur);
  useEffect(() => setCfg(presentCfgOf(config)), [config]);
  const canEdit = config.role === 'ADMIN';
  const save = useMutation({
    mutationFn: () => workApi.updateProject(config.id, { settings: { present: cfg } }),
    onSuccess: () => { toast.success(wt('g4.saved')); qc.invalidateQueries({ queryKey: wk.project(config.id) }); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <div className="w-card p-4" data-testid="present-timer-settings">
      <h2 className="w-section-title mb-2 flex items-center gap-1.5"><Timer size={14} aria-hidden="true" /> {wt('g4.settingsTitle')}</h2>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[12px] text-[var(--w-text-2)]">{wt('g4.duration')}
          <input type="number" min={1} max={120} className="w-input mt-0.5 !h-8 !w-[90px]" value={cfg.durationMin} disabled={!canEdit} onChange={(e) => setCfg({ ...cfg, durationMin: Math.max(1, Math.min(120, Number(e.target.value) || 1)) })} />
        </label>
        <label className="min-w-[220px] flex-1 text-[12px] text-[var(--w-text-2)]">{wt('g4.planBUrl')}
          <input className="w-input mt-0.5 !h-8 w-full" value={cfg.planBUrl ?? ''} disabled={!canEdit} placeholder="https://…" onChange={(e) => setCfg({ ...cfg, planBUrl: e.target.value || null })} />
        </label>
        <label className="text-[12px] text-[var(--w-text-2)]">{wt('g4.planBLabel')}
          <input className="w-input mt-0.5 !h-8 !w-[160px]" value={cfg.planBLabel ?? ''} disabled={!canEdit} maxLength={80} placeholder={wt('g4.planB')} onChange={(e) => setCfg({ ...cfg, planBLabel: e.target.value || null })} />
        </label>
      </div>
      <div className="mt-3">
        <div className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{wt('g4.marks')}</div>
        <ul className="space-y-1">
          {cfg.marks.map((m, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <input type="number" min={0} max={cfg.durationMin} className="w-input !h-7 !w-[70px] text-[12.5px]" value={m.atMin} disabled={!canEdit} onChange={(e) => setCfg({ ...cfg, marks: cfg.marks.map((x, j) => (j === i ? { ...x, atMin: Number(e.target.value) || 0 } : x)) })} aria-label="min" />
              <span className="text-[12px] text-[var(--w-text-3)]">′</span>
              <input className="w-input !h-7 flex-1 text-[12.5px]" value={m.label} maxLength={60} disabled={!canEdit} placeholder={wt('g4.markLabelPh')} onChange={(e) => setCfg({ ...cfg, marks: cfg.marks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              {canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="×" onClick={() => setCfg({ ...cfg, marks: cfg.marks.filter((_, j) => j !== i) })}><X size={12} /></button>}
            </li>
          ))}
        </ul>
        {canEdit && (
          <div className="mt-2 flex gap-2">
            {cfg.marks.length < 12 && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setCfg({ ...cfg, marks: [...cfg.marks, { atMin: Math.min(cfg.durationMin, (cfg.marks.at(-1)?.atMin ?? 0) + 2), label: '' }] })}><Plus size={12} /> {wt('g4.addMark')}</button>}
            <button type="button" className="w-btn w-btn-sm ml-auto" disabled={save.isPending} onClick={() => save.mutate()} data-testid="present-timer-save">{save.isPending ? <Spinner size={11} /> : <Save size={12} />} {wt('g4.save')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Đồng hồ trên màn trình chiếu. */
export function PresentTimerBar({ config }: { config: ProjectConfig }) {
  const cfg = useMemo(() => presentCfgOf(config), [config]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const toggle = useCallback(() => setRunning((r) => !r), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 't' || e.key === 'T') && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); toggle(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [toggle]);
  const total = cfg.durationMin * 60;
  const left = total - elapsed;
  const over = left < 0;
  const next = cfg.marks.find((m) => m.atMin * 60 > elapsed) ?? null;
  const current = [...cfg.marks].reverse().find((m) => m.atMin * 60 <= elapsed) ?? null;
  const planB = safeUrl(cfg.planBUrl);
  return (
    <div className="flex min-w-0 items-center gap-2" data-testid="present-timer">
      <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={running ? wt('g4.pause') : wt('g4.start')} onClick={toggle}>{running ? <Pause size={14} /> : <Play size={14} />}</button>
      <span className={cn('font-mono text-[13px] tabular-nums', over ? 'font-semibold text-[var(--w-red-text)]' : left <= 60 ? 'text-[var(--w-amber-text,#b45309)]' : 'text-[var(--w-text-2)]')} title={over ? wt('g4.overtime') : undefined}>
        {over ? `${wt('g4.overtime')} ${mmss(-left)}` : mmss(left)}
      </span>
      <div className="relative hidden h-1.5 w-[160px] rounded-full bg-[var(--w-sunken)] sm:block" aria-hidden="true">
        <div className={cn('h-1.5 rounded-full', over ? 'bg-[var(--w-red)]' : 'bg-[var(--w-accent)]')} style={{ width: `${Math.min(100, (elapsed / total) * 100)}%` }} />
        {cfg.marks.map((m) => <span key={`${m.atMin}-${m.label}`} className="absolute top-[-3px] h-3 w-px bg-[var(--w-text-3)]" style={{ left: `${(m.atMin / cfg.durationMin) * 100}%` }} title={`${m.atMin}′ ${m.label}`} />)}
      </div>
      <span className="hidden min-w-0 truncate text-[12px] text-[var(--w-text-3)] md:inline">
        {current?.label}{next ? ` → ${next.atMin}′ ${next.label}` : ''}
      </span>
      <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('g4.reset')} onClick={() => { setElapsed(0); setRunning(false); }}><RotateCcw size={13} /></button>
      {planB && (
        <a href={planB} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-sm" data-testid="present-planb"><Clapperboard size={13} /> {cfg.planBLabel || wt('g4.openPlanB')}</a>
      )}
    </div>
  );
}
