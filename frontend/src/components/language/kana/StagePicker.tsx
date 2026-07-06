'use client';
/**
 * Screen 1 — "Chọn bài luyện": pick kana groups + stages + question count,
 * then start. Settings persist to localStorage.
 */
import { useMemo } from 'react';
import { Check, Play, ListChecks, CheckCheck, Square } from 'lucide-react';
import {
  COUNT_OPTIONS,
  STAGE_TYPES,
  type KanaGroup,
  type PracticeSettings,
  type StageType,
} from './types';
import { STAGE_META, STAGE_ORDER, ACCENT_TEXT } from './stages';

export function StagePicker({
  groups,
  settings,
  onChange,
  onStart,
}: {
  groups: KanaGroup[];
  settings: PracticeSettings;
  onChange: (next: PracticeSettings) => void;
  onStart: () => void;
}) {
  const groupSel = useMemo(() => new Set(settings.groupIds), [settings.groupIds]);
  const stageSel = useMemo(() => new Set(settings.stages), [settings.stages]);

  const poolCount = useMemo(
    () => groups.filter((g) => groupSel.has(g.id)).reduce((n, g) => n + g.items.length, 0),
    [groups, groupSel],
  );

  const toggleGroup = (id: number) => {
    const next = new Set(groupSel);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...settings, groupIds: [...next] });
  };

  const toggleStage = (s: StageType) => {
    const next = new Set(stageSel);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    onChange({ ...settings, stages: [...next] });
  };

  const setAllStages = (on: boolean) =>
    onChange({ ...settings, stages: on ? [...STAGE_TYPES] : [] });

  const canStart = groupSel.size > 0 && stageSel.size > 0 && poolCount > 0;

  return (
    <div className="space-y-7">
      {/* Groups */}
      <section>
        <div className="mb-2.5 flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-text-primary">Nhóm chữ</h2>
          <span className="text-sm text-text-muted">{poolCount} chữ đã chọn</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const active = groupSel.has(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGroup(g.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition ${
                  active
                    ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40'
                    : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
                }`}
              >
                {active && <Check size={14} />}
                {g.name}
                <span className={active ? 'text-neon-violet/70' : 'text-text-muted'}>· {g.items.length}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stages */}
      <section>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-text-primary">Bài luyện</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAllStages(true)}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary transition hover:text-neon-violet"
            >
              <CheckCheck size={14} /> Tất cả
            </button>
            <button
              type="button"
              onClick={() => setAllStages(false)}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary transition hover:text-neon-red"
            >
              <Square size={14} /> Bỏ hết
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {STAGE_ORDER.map((s) => {
            const meta = STAGE_META[s];
            const Icon = meta.icon;
            const active = stageSel.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStage(s)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-neon-violet/50 bg-neon-violet/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-neon-violet/30'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-card)] ${ACCENT_TEXT[meta.accent]}`}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-text-muted">{meta.n}.</span>
                    <span className="truncate text-sm font-semibold text-text-primary">{meta.name}</span>
                  </span>
                  <span className="block truncate text-xs text-text-muted">{meta.desc}</span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                    active
                      ? 'border-neon-violet bg-neon-violet text-white'
                      : 'border-[var(--border-color)] text-transparent'
                  }`}
                >
                  <Check size={14} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Count */}
      <section>
        <h2 className="mb-2.5 font-heading text-lg font-semibold text-text-primary">Số câu</h2>
        <div className="flex flex-wrap gap-2">
          {COUNT_OPTIONS.map((opt) => {
            const active = settings.count === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onChange({ ...settings, count: opt.value })}
                aria-pressed={active}
                className={`min-w-[3.5rem] rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition ${
                  active
                    ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40'
                    : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Start */}
      <div className="sticky bottom-3 z-10">
        <button
          type="button"
          disabled={!canStart}
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon-violet px-6 py-3.5 text-base font-bold text-white shadow-neon transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play size={18} />
          Bắt đầu
        </button>
        {!canStart && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
            <ListChecks size={13} /> Chọn ít nhất một nhóm chữ và một bài luyện
          </p>
        )}
      </div>
    </div>
  );
}
