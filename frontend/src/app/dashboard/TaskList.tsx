'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Plus, Trash2, Sparkles, Zap, X } from 'lucide-react';
import type { Task, TaskScope, ActivityType } from './types';

const SCOPE_COLORS: Record<TaskScope, { from: string; to: string; glow: string }> = {
  today: { from: 'from-violet-500', to: 'to-fuchsia-500', glow: 'rgba(168,85,247,' },
  week:  { from: 'from-cyan-500',   to: 'to-blue-500',   glow: 'rgba(6,182,212,'  },
  month: { from: 'from-amber-400', to: 'to-orange-500', glow: 'rgba(251,191,36,' },
};

const SCOPE_LABELS: Record<TaskScope, string> = {
  today: 'Hôm nay',
  week:  'Tuần này',
  month: 'Mục tiêu tháng',
};

const ACTIVITY_META: Record<ActivityType, { label: string; color: string; glow: string }> = {
  study:    { label: 'Học tập',  color: '#8b5cf6', glow: 'rgba(139,92,246,' },
  work:     { label: 'Làm việc',   color: '#06b6d4', glow: 'rgba(6,182,212,'  },
  exercise: { label: 'Thể dục',  color: '#10b981', glow: 'rgba(16,185,129,' },
  cook:     { label: 'Nấu ăn',   color: '#f97316', glow: 'rgba(249,115,22,' },
  sleep:    { label: 'Đi ngủ',   color: '#6366f1', glow: 'rgba(99,102,241,' },
  rest:     { label: 'Nghỉ ngơi', color: '#ec4899', glow: 'rgba(236,72,153,' },
  leisure:  { label: 'Giải trí', color: '#f59e0b', glow: 'rgba(245,158,11,' },
  social:   { label: 'Bạn bè',  color: '#14b8a6', glow: 'rgba(20,184,166,' },
};

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface Props {
  /** All tasks of the current scope */
  tasks: Task[];
  /** Currently active activity filter */
  activityFilter: ActivityType | null;
  /** Pre-filtered tasks (already filtered by page if filter active) */
  filteredTasks: Task[];
  onToggle: (id: string) => void;
  onAddTask: (title: string, scope: TaskScope, activityType?: ActivityType) => void;
  onRemove: (id: string) => void;
  onClearFilter: () => void;
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function TaskList({
  tasks, activityFilter, filteredTasks,
  onToggle, onAddTask, onRemove, onClearFilter,
}: Props) {
  const [activeScope, setActiveScope] = useState<TaskScope>('today');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const checkboxRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Show filtered tasks when filter active; fall back to scope tasks
  const visible = activityFilter ? filteredTasks : tasks.filter((t) => t.scope === activeScope);
  const allScopeTasks = tasks.filter((t) => t.scope === activeScope);
  const done = visible.filter((t) => t.done);
  const pct = visible.length ? Math.round((done.length / visible.length) * 100) : 0;
  const colors = SCOPE_COLORS[activeScope];

  const handleToggle = (id: string) => {
    const el = checkboxRefs.current[id];
    const wasDone = tasks.find((t) => t.id === id)?.done ?? false;
    if (!wasDone && el) {
      const rect = el.getBoundingClientRect();
      confetti({
        particleCount: 55,
        spread: 55,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ffffff'],
        startVelocity: 35, gravity: 0.85, scalar: 1.1, ticks: 120,
      });
    }
    onToggle(id);
  };

  const handleAdd = () => {
    if (!newTaskTitle.trim()) return;
    // If filtered, inherit the active activityType; otherwise use current scope
    onAddTask(newTaskTitle.trim(), activeScope, activityFilter ?? undefined);
    setNewTaskTitle('');
    setAdding(false);
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#161830]/90 via-[#161830] to-[#0f111a]/90 backdrop-blur-xl p-5 md:p-7 shadow-2xl shadow-violet-500/5">

      {/* ── Activity filter banner ── */}
      <AnimatePresence>
        {activityFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm"
              style={{
                background: `linear-gradient(135deg, ${ACTIVITY_META[activityFilter].glow}0.15), ${ACTIVITY_META[activityFilter].glow}0.05)`,
                border: `1px solid ${ACTIVITY_META[activityFilter].glow}0.35)`,
                boxShadow: `0 0 16px ${ACTIVITY_META[activityFilter].glow}0.15)`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: ACTIVITY_META[activityFilter].color, boxShadow: `0 0 8px ${ACTIVITY_META[activityFilter].color}` }}
                />
                <span className="font-bold text-white">
                  Lọc: <span style={{ color: ACTIVITY_META[activityFilter].color }}>{ACTIVITY_META[activityFilter].label}</span>
                </span>
                <span className="text-slate-400 text-xs">
                  — {filteredTasks.length} task
                </span>
              </div>
              <button
                onClick={onClearFilter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors"
                style={{ color: ACTIVITY_META[activityFilter].color, border: `1px solid ${ACTIVITY_META[activityFilter].glow}0.4)` }}
              >
                <X className="w-3.5 h-3.5" />
                Hiển thị tất cả
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tab bar ── */}
      <div className="flex gap-1.5 mb-5">
        {(Object.keys(SCOPE_LABELS) as TaskScope[]).map((scope) => {
          const sc = SCOPE_COLORS[scope];
          const count = tasks.filter((t) => t.scope === scope && !t.done).length;
          const total = tasks.filter((t) => t.scope === scope).length;
          const doneCount = tasks.filter((t) => t.scope === scope && t.done).length;
          const scopePct = total ? Math.round((doneCount / total) * 100) : 0;
          const isActive = activeScope === scope;

          return (
            <button
              key={scope}
              onClick={() => setActiveScope(scope)}
              className={`
                flex-1 relative flex items-center justify-center gap-1.5 px-3 py-2.5
                rounded-2xl text-sm font-bold transition-all overflow-hidden
                ${isActive
                  ? `bg-gradient-to-r ${sc.from} ${sc.to} text-white`
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'}`}
              style={isActive ? { boxShadow: `0 0 20px ${sc.glow}0.35)` } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="taskTabBg"
                  className="absolute inset-0"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{SCOPE_LABELS[scope]}</span>
              {count > 0 && (
                <span className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-black
                  ${isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {count}
                </span>
              )}
              {scopePct === 100 && total > 0 && (
                <Sparkles className="relative z-10 w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-5">
        <div className="flex justify-between text-[11px] text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Zap className={`w-3 h-3 ${pct === 100 ? 'text-yellow-400' : 'text-violet-400'}`} />
            {done.length}/{visible.length} hoàn thành
          </span>
          <span className={`font-mono font-black ${pct === 100 ? 'text-yellow-400' : 'text-white'}`}>
            {pct}%
          </span>
        </div>
        <div className="relative h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${pct}%`, background: `linear-gradient(to right, var(--from), var(--to))` }}
            initial={{ width: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ boxShadow: `0 0 16px ${colors.glow}0.55)`, ['--from' as string]: colors.from, ['--to' as string]: colors.to }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* ── Task items ── */}
      <div className="space-y-2 min-h-[120px]">
        <AnimatePresence>
          {visible.map((task) => {
            const actColor = task.activityType ? ACTIVITY_META[task.activityType] : null;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -24, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="group flex items-center gap-3.5 py-2 px-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
              >
                {/* Checkbox */}
                <button
                  ref={(el) => { checkboxRefs.current[task.id] = el; }}
                  onClick={() => handleToggle(task.id)}
                  className={`
                    shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center
                    transition-all duration-300
                    ${task.done
                      ? actColor
                        ? 'border-transparent'
                        : `bg-gradient-to-br ${colors.from} ${colors.to} border-transparent`
                      : 'border-white/20 hover:border-violet-400/60 bg-white/[0.03] hover:bg-violet-500/10'}`}
                  style={task.done && actColor ? {
                    background: `linear-gradient(135deg, ${actColor.color}, ${actColor.glow}0.6))`,
                    boxShadow: `0 0 18px ${actColor.glow}0.6)`,
                  } : task.done ? {
                    boxShadow: `0 0 18px ${colors.glow}0.6)`,
                  } : {}}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: task.done ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </svg>
                </button>

                {/* Title */}
                <div className="flex-1 min-w-0 relative">
                  <span className={`
                    block text-sm font-medium transition-all duration-500
                    ${task.done ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}
                  >
                    {task.title}
                  </span>
                  {/* Strike-through */}
                  <motion.div
                    className="absolute left-0 top-1/2 h-[2px] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: task.done ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={actColor ? {
                      background: `linear-gradient(to right, ${actColor.color}, ${actColor.glow}0.6))`,
                      boxShadow: `0 0 8px ${actColor.glow}0.5)`,
                    } : {
                      background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                      boxShadow: '0 0 8px rgba(168,85,247,0.7)',
                    }}
                  />
                  {/* Activity tag */}
                  {actColor && !task.done && (
                    <span
                      className="absolute -top-3 left-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        color: actColor.color,
                        background: `${actColor.glow}0.15)`,
                        border: `1px solid ${actColor.glow}0.35)`,
                      }}
                    >
                      {actColor.label}
                    </span>
                  )}
                </div>

                {/* EXP badge */}
                <span className={`
                  shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold
                  px-2.5 py-1 rounded-lg transition-all duration-300
                  ${task.done
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300'}`}>
                  <Zap className="w-3 h-3" />+{task.exp}
                </span>

                {/* Delete */}
                <button
                  onClick={() => onRemove(task.id)}
                  className="shrink-0 p-1.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-14 text-slate-500"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-sm font-medium">
              {activityFilter ? 'Không có task cho hoạt động này' : 'Chưa có task nào. Bắt đầu thôi!'}
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Add task ── */}
      {adding ? (
        <div className="mt-5 flex gap-2">
          <input
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={`Task mới${activityFilter ? ` (${ACTIVITY_META[activityFilter].label})` : ''}...`}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-violet-500/[0.05]"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
            style={{ boxShadow: '0 0 18px rgba(168,85,247,0.4)' }}
          >
            Thêm
          </button>
          <button
            onClick={() => { setAdding(false); setNewTaskTitle(''); }}
            className="px-4 py-3 rounded-2xl border border-white/10 text-slate-400 hover:bg-white/5 text-sm transition-colors"
          >
            Hủy
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setAdding(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-all duration-200 text-sm font-medium group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Thêm task mới
        </motion.button>
      )}
    </div>
  );
}
