'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Briefcase, Dumbbell, UtensilsCrossed, Moon, Coffee, Gamepad2, Users } from 'lucide-react';
import type { ActivityType, TimelineSlot } from './types';

/** Maps each ActivityType to its display metadata */
export const ACTIVITY_META: Record<ActivityType, {
  label: string; icon: any;
  gradient: string; ring: string;
  glowColor: string; dotColor: string;
}> = {
  study:    { label: 'Học tập',  icon: BookOpen,        gradient: 'from-violet-500/35 to-fuchsia-500/20',  ring: 'ring-violet-400/60',  glowColor: '#8b5cf6', dotColor: '#7c3aed' },
  work:     { label: 'Làm việc',   icon: Briefcase,       gradient: 'from-cyan-500/35 to-sky-500/20',        ring: 'ring-cyan-400/60',   glowColor: '#06b6d4', dotColor: '#0891b2' },
  exercise: { label: 'Thể dục',   icon: Dumbbell,        gradient: 'from-emerald-500/35 to-mint-500/20',   ring: 'ring-emerald-400/60', glowColor: '#10b981', dotColor: '#059669' },
  cook:     { label: 'Nấu ăn',     icon: UtensilsCrossed, gradient: 'from-orange-500/35 to-rose-500/20',    ring: 'ring-orange-400/60',  glowColor: '#f97316', dotColor: '#ea580c' },
  sleep:    { label: 'Đi ngủ',     icon: Moon,            gradient: 'from-indigo-500/35 to-blue-500/20',     ring: 'ring-indigo-400/60',  glowColor: '#6366f1', dotColor: '#4f46e5' },
  rest:     { label: 'Nghỉ ngơi',  icon: Coffee,          gradient: 'from-pink-500/35 to-rose-400/20',       ring: 'ring-pink-400/60',    glowColor: '#ec4899', dotColor: '#db2777' },
  leisure:  { label: 'Giải trí',  icon: Gamepad2,        gradient: 'from-amber-500/35 to-yellow-500/20',   ring: 'ring-amber-400/60',   glowColor: '#f59e0b', dotColor: '#d97706' },
  social:   { label: 'Bạn bè',    icon: Users,           gradient: 'from-teal-500/35 to-cyan-500/20',      ring: 'ring-teal-400/60',    glowColor: '#14b8a6', dotColor: '#0d9488' },
};

const ACTIVITY_LIST = Object.entries(ACTIVITY_META) as [ActivityType, typeof ACTIVITY_META[ActivityType]][];

const formatHour = (h: number) =>
  h === 0 ? '0:00' : h === 12 ? '12:00 CH' : h < 12 ? `${h} SA` : `${h - 12} CH`;

interface Props {
  timeline: TimelineSlot[];
  activeFilter: ActivityType | null;
  onSetActivity: (hour: number, activity: TimelineSlot['activity']) => void;
  onFilterActivity: (filter: ActivityType | null) => void;
}

export default function Timeline({
  timeline, activeFilter, onSetActivity, onFilterActivity,
}: Props) {
  const [editingHour, setEditingHour] = useState<number | null>(null);
  const currentHour = new Date().getHours();

  /** Called when user clicks an hour that has an activity — toggle filter */
  const handleHourClick = (slot: TimelineSlot) => {
    if (slot.activity) {
      // Toggle filter: if same activity already filtered → clear; else → filter
      onFilterActivity(activeFilter === slot.activity.type ? null : slot.activity.type);
    }
    setEditingHour(slot.hour);
  };

  return (
    <div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-[#161830]/90 to-[#0f111a]/90 backdrop-blur-xl p-5 md:p-7 shadow-2xl shadow-violet-500/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Timeline 24h
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">Click giờ để gán · Click giờ đã gán để lọc task</p>
        </div>

        {/* Active filter badge */}
        {activeFilter && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onFilterActivity(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:opacity-80"
            style={{
              background: `linear-gradient(135deg, ${ACTIVITY_META[activeFilter].glowColor}22, ${ACTIVITY_META[activeFilter].dotColor}15)`,
              borderColor: `${ACTIVITY_META[activeFilter].glowColor}55`,
              color: ACTIVITY_META[activeFilter].dotColor,
              boxShadow: `0 0 12px ${ACTIVITY_META[activeFilter].glowColor}33`,
            }}
          >
            <span>{ACTIVITY_META[activeFilter].label}</span>
            <X className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Hour grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 mb-4">
        {timeline.map((slot) => {
          const meta = slot.activity ? ACTIVITY_META[slot.activity.type] : null;
          const Icon = meta?.icon;
          const isNow = slot.hour === currentHour;
          const isPast = slot.hour < currentHour;
          const isFiltered = activeFilter && slot.activity?.type === activeFilter;

          return (
            <motion.button
              key={slot.hour}
              whileHover={{ scale: slot.activity ? 1.07 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHourClick(slot)}
              className={`
                group relative aspect-square rounded-2xl border text-left p-2
                transition-all duration-300 overflow-hidden cursor-pointer
                ${slot.activity
                  ? `bg-gradient-to-br ${meta!.gradient} border-white/15`
                  : isPast
                  ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                  : 'bg-white/[0.04] border-white/8 hover:bg-white/[0.07] hover:border-white/12'}
                ${isFiltered ? 'ring-2 ring-white/60 scale-[1.06] z-10' : ''}
                ${isNow ? 'ring-2 ring-pink-400/80' : ''}
              `}
              style={slot.activity ? {
                boxShadow: isFiltered
                  ? `0 0 20px ${meta!.glowColor}60, 0 0 30px ${meta!.glowColor}30`
                  : `0 0 12px ${meta!.glowColor}33`,
              } : isNow ? {
                boxShadow: '0 0 18px rgba(244,114,182,0.3)',
              } : {}}
            >
              {/* Hour label */}
              <div className="relative z-10 flex items-center justify-between h-full">
                <span className={`text-[10px] font-mono font-bold ${slot.activity ? 'text-white/90' : isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                  {String(slot.hour).padStart(2, '0')}
                </span>
                {slot.activity && Icon && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="self-end"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/90 drop-shadow" />
                  </motion.div>
                )}
              </div>

              {/* Color band at bottom */}
              {slot.activity && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{
                    background: `linear-gradient(to right, ${meta!.dotColor}, ${meta!.glowColor})`,
                    boxShadow: `0 0 8px ${meta!.glowColor}`,
                  }}
                />
              )}

              {/* Activity dot */}
              {slot.activity && (
                <span
                  className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full z-20"
                  style={{ background: meta!.dotColor, boxShadow: `0 0 6px ${meta!.glowColor}` }}
                />
              )}

              {/* Now indicator */}
              {isNow && (
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse z-20"
                  style={{ boxShadow: '0 0 8px rgba(244,114,182,0.8)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Activity legend */}
      <div className="flex flex-wrap gap-1.5">
        {ACTIVITY_LIST.map(([type, meta]) => {
          const Icon = meta.icon;
          const isActive = activeFilter === type;
          return (
            <button
              key={type}
              onClick={() => onFilterActivity(isActive ? null : type)}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium
                transition-all duration-200 ring-1
                ${isActive ? 'ring-white/50 scale-105' : `hover:scale-105 ${meta.ring}`}
              `}
              style={{
                background: `linear-gradient(135deg, ${meta.glowColor}22, ${meta.dotColor}15)`,
                color: meta.dotColor,
                boxShadow: isActive ? `0 0 14px ${meta.glowColor}44` : `0 0 8px ${meta.glowColor}22`,
              }}
            >
              <Icon className="w-2.5 h-2.5 shrink-0" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* ── Activity picker modal ── */}
      <AnimatePresence>
        {editingHour !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setEditingHour(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[#1a1c2e] via-[#161830] to-[#0f111a] border border-white/10 p-6 shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(168,85,247,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-white">
                    Giờ <span className="text-cyan-300 font-mono">{formatHour(editingHour)}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {timeline[editingHour]?.activity
                      ? `Đang: ${timeline[editingHour].activity!.label} — click để đổi`
                      : 'Gán hoạt động cho giờ này'}
                  </p>
                </div>
                <button
                  onClick={() => setEditingHour(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {ACTIVITY_LIST.map(([type, meta]) => {
                  const Icon = meta.icon;
                  const isActive = timeline[editingHour]?.activity?.type === type;
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onSetActivity(editingHour, { type, label: meta.label });
                        setEditingHour(null);
                      }}
                      className={`
                        relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left text-sm
                        transition-all duration-200 overflow-hidden
                        ${isActive ? 'ring-2 ring-white/60' : 'hover:ring-white/30'}
                      `}
                      style={{
                        background: `linear-gradient(135deg, ${meta.glowColor}30, ${meta.dotColor}15)`,
                        border: `1px solid ${meta.glowColor}55`,
                        boxShadow: isActive
                          ? `0 0 20px ${meta.glowColor}55`
                          : `0 0 10px ${meta.glowColor}22`,
                      }}
                    >
                      <Icon className="w-5 h-5 shrink-0" style={{ color: meta.dotColor }} />
                      <span className="text-white/95 font-bold">{meta.label}</span>
                      {isActive && (
                        <span
                          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                          style={{ background: meta.dotColor, boxShadow: `0 0 6px ${meta.glowColor}` }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  onSetActivity(editingHour, undefined);
                  onFilterActivity(null);
                  setEditingHour(null);
                }}
                className="mt-3 w-full py-2.5 rounded-2xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200 text-sm font-medium transition-all"
              >
                Xóa hoạt động
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
