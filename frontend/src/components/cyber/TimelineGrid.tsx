'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Clock, Zap, BookOpen, Repeat } from 'lucide-react';
import type { CyberTask, CyberTaskType } from '@/lib/api';

interface TimelineGridProps {
  tasks: CyberTask[];
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onAddTask: (slot: string) => void;
  togglingIds: Set<number>;
  completedId: number | null;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, '0')}:00`
);

const typeConfig: Record<CyberTaskType, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  TASK: {
    color: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/30',
    icon: <Zap size={12} />,
  },
  STUDY: {
    color: 'text-neon-amber',
    bg: 'bg-neon-amber/10',
    border: 'border-neon-amber/30',
    icon: <BookOpen size={12} />,
  },
  ROUTINE: {
    color: 'text-neon-green',
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    icon: <Repeat size={12} />,
  },
};

function getSlotForTime(startTime: string): string {
  const hour = parseInt(startTime.split(':')[0]);
  return `${String(hour).padStart(2, '0')}:00`;
}

export function TimelineGrid({ tasks, onToggle, onDelete, onAddTask, togglingIds, completedId }: TimelineGridProps) {
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'TASK' as CyberTaskType,
    startTime: '09:00',
    endTime: '10:00',
    expReward: 20,
  });

  const tasksBySlot = new Map<string, CyberTask[]>();
  for (const task of tasks) {
    const slot = getSlotForTime(task.startTime);
    if (!tasksBySlot.has(slot)) tasksBySlot.set(slot, []);
    tasksBySlot.get(slot)!.push(task);
  }

  const handleAdd = (slot: string) => {
    setShowAddForm(slot);
    setNewTask((prev) => ({ ...prev, startTime: slot }));
  };

  const submitAdd = (slot: string) => {
    if (!newTask.title.trim()) return;
    // Dispatch custom event with data — parent handles the actual API call
    window.dispatchEvent(
      new CustomEvent('cyber:add-task', {
        detail: { ...newTask, date: new Date().toISOString().split('T')[0] },
      })
    );
    setShowAddForm(null);
    setNewTask({ title: '', type: 'TASK', startTime: slot, endTime: `${String(parseInt(slot) + 1).padStart(2, '0')}:00`, expReward: 20 });
  };

  return (
    <div className="space-y-0.5">
      {HOURS.map((hour) => {
        const slotTasks = tasksBySlot.get(hour) || [];
        const isAdding = showAddForm === hour;

        return (
          <div key={hour} className="flex min-h-[48px] group">
            {/* Time label */}
            <div className="w-16 flex-shrink-0 flex items-start pt-1 pr-2 text-right">
              <span className="text-xs text-white/30 font-mono">{hour}</span>
            </div>

            {/* Divider */}
            <div className="w-px bg-white/5 mr-3" />

            {/* Content area */}
            <div className="flex-1 min-h-[48px] py-1 flex flex-col gap-1">
              {slotTasks.map((task) => {
                const cfg = typeConfig[task.type];
                const isToggling = togglingIds.has(task.id);
                const isJustCompleted = completedId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded border
                      ${cfg.bg} ${cfg.border}
                      transition-all duration-300
                      ${isJustCompleted ? 'animate-laser-complete' : ''}
                    `}
                  >
                    <button
                      onClick={() => !isToggling && onToggle(task.id)}
                      disabled={isToggling}
                      className={`flex-shrink-0 transition-transform ${isToggling ? 'animate-pulse' : 'hover:scale-110'}`}
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 size={18} className="text-neon-green" />
                      ) : (
                        <Circle size={18} className={`${cfg.color} opacity-60`} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${cfg.color} flex items-center gap-1`}>
                          {cfg.icon}
                          <span className="font-mono text-[10px]">{task.type}</span>
                        </span>
                        <span
                          className={`text-sm font-mono truncate ${task.isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                        <span>{task.startTime} - {task.endTime}</span>
                        <span className="text-neon-amber">+{task.expReward} EXP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}

              {/* Add task inline form */}
              {isAdding && (
                <div className={`px-3 py-2 rounded border border-dashed border-neon-green/30 bg-neon-green/5 space-y-2`}>
                  <input
                    autoFocus
                    value={newTask.title}
                    onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Task title..."
                    className="w-full bg-transparent border-b border-neon-green/30 text-white/90 font-mono text-sm outline-none placeholder:text-white/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitAdd(hour);
                      if (e.key === 'Escape') setShowAddForm(null);
                    }}
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask((p) => ({ ...p, type: e.target.value as CyberTaskType }))}
                      className="bg-cyber-bg border border-white/20 rounded px-2 py-0.5 text-xs font-mono text-white/70 outline-none"
                    >
                      <option value="TASK">TASK</option>
                      <option value="STUDY">STUDY</option>
                      <option value="ROUTINE">ROUTINE</option>
                    </select>
                    <input
                      type="time"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask((p) => ({ ...p, startTime: e.target.value }))}
                      className="bg-cyber-bg border border-white/20 rounded px-2 py-0.5 text-xs font-mono text-white/70 outline-none"
                    />
                    <input
                      type="time"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask((p) => ({ ...p, endTime: e.target.value }))}
                      className="bg-cyber-bg border border-white/20 rounded px-2 py-0.5 text-xs font-mono text-white/70 outline-none"
                    />
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={newTask.expReward}
                      onChange={(e) => setNewTask((p) => ({ ...p, expReward: parseInt(e.target.value) || 1 }))}
                      className="w-16 bg-cyber-bg border border-white/20 rounded px-2 py-0.5 text-xs font-mono text-white/70 outline-none"
                    />
                    <span className="text-[10px] text-neon-amber font-mono">EXP</span>
                    <button
                      onClick={() => submitAdd(hour)}
                      className="ml-auto px-3 py-0.5 rounded bg-neon-green/20 border border-neon-green/40 text-neon-green text-xs font-mono hover:bg-neon-green/30 transition-colors"
                    >
                      [ADD]
                    </button>
                  </div>
                </div>
              )}

              {/* Add button */}
              {!isAdding && (
                <button
                  onClick={() => handleAdd(hour)}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-white/20 hover:text-neon-green font-mono transition-colors py-0.5"
                >
                  <Plus size={10} /> add task @ {hour}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
