'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Zap, Clock, Bot } from 'lucide-react';
import { toast } from 'sonner';

import AvatarCard from './AvatarCard';
import Timeline from './Timeline';
import TaskList from './TaskList';
import StatsModal from './StatsModal';
import { useDashboardStore } from './useDashboardStore';
import { useAuthStore } from '@/store/authStore';
import type { TaskScope, ActivityType } from './types';
import { ACTIVITY_META } from './Timeline';

/** Maps ActivityType → label (shared with Timeline) */
const ACT_LABELS: Record<ActivityType, string> = {
  study:    'Học tập',
  work:     'Làm việc',
  exercise: 'Thể dục',
  cook:     'Nấu ăn',
  sleep:    'Đi ngủ',
  rest:     'Nghỉ ngơi',
  leisure:  'Giải trí',
  social:   'Bạn bè',
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  // Destructuring from the Zustand hook — subscribes to ALL state changes
  const {
    level, exp, timeline, activityFilter, userId: currentUserId,
    tasks, lastCelebrationDate, tomorrowPlanLockedDate,
    setActivity, setActivityFilter,
    addTask, toggleTask, removeTask, awardExp,
    markCelebrated, planTomorrow, ensureScopeSeeded,
  } = useDashboardStore();

  // Track the current userId — seed defaults when userId changes
  const prevUserIdRef = useRef<string>(currentUserId);
  useEffect(() => {
    if (currentUserId !== prevUserIdRef.current) {
      prevUserIdRef.current = currentUserId;
    }
    // Seed default tasks after mount or user switch
    (['today', 'week', 'month'] as TaskScope[]).forEach((s) => ensureScopeSeeded(s));
  }, [currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  const todayTasks = tasks.filter((t) => t.scope === 'today');
  const doneToday = todayTasks.filter((t) => t.done).length;
  const totalToday = todayTasks.length;
  const todayPct = totalToday ? Math.round((doneToday / totalToday) * 100) : 0;
  const todayExpGained = doneToday * 25;

  const todayIso = new Date().toISOString().slice(0, 10);
  const alreadyCelebrated = lastCelebrationDate === todayIso;
  const alreadyPlanned = tomorrowPlanLockedDate === todayIso;
  const isAllDone = totalToday > 0 && todayTasks.every((t) => t.done);

  const [statsOpen, setStatsOpen] = useState(false);

  // ── Real-time clock — safe: useState with default, set inside useEffect ──
  const [clock, setClock] = useState({ hour: -1, minute: -1 });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({ hour: now.getHours(), minute: now.getMinutes() });
    };
    update(); // set immediately on mount
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = clock.hour >= 0
    ? `${String(clock.hour).padStart(2, '0')}:${String(clock.minute).padStart(2, '0')}`
    : '--:--';

  // ── Current activity from timeline — clock.hour starts at -1 (SSR-safe) ──
  const currentHour = clock.hour >= 0 ? clock.hour : 12;
  const currentSlot = timeline[currentHour];
  const currentActivity = currentSlot?.activity?.type ?? null;
  const currentActivityMeta = currentActivity ? (ACTIVITY_META as any)[currentActivity] : null;

  // ── Filtered tasks ──
  const filteredTasks = activityFilter
    ? todayTasks.filter((t) => t.activityType === activityFilter)
    : [];

  const handleEndOfDay = () => {
    awardExp(todayExpGained);
    setStatsOpen(true);
  };

  const handleCelebrate = () => markCelebrated();

  const handlePlanTomorrow = (titles: string[]) => {
    planTomorrow(titles);
    toast.success('Đã lưu kế hoạch cho ngày mai!');
  };

  const handleClearFilter = () => setActivityFilter(null);

  return (
    <div className="min-h-screen bg-[#0f111a] text-white pb-16">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6 space-y-5">
        {/* ── Header row ── */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Theo dõi ngày làm việc của bạn</p>
          </div>

          {/* Clock widget */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-black text-white text-base">{timeStr}</span>
            </div>
            {currentActivityMeta ? (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: currentActivityMeta.glowColor, boxShadow: `0 0 6px ${currentActivityMeta.glowColor}` }}
                />
                <span>
                  Đang: <span style={{ color: currentActivityMeta.glowColor }} className="font-bold">{currentActivityMeta.label}</span>
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-600">Chưa gán hoạt động</span>
            )}
          </div>
        </div>

        {/* ── Avatar Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <AvatarCard level={level} exp={exp} username={user?.username} isAuthenticated={isAuthenticated} />
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Timeline
              timeline={timeline}
              activeFilter={activityFilter}
              onSetActivity={setActivity}
              onFilterActivity={setActivityFilter}
            />
          </motion.div>

          {/* Right: Tasks + End-of-Day */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="lg:col-span-3 space-y-4"
          >
            <TaskList
              tasks={tasks}
              activityFilter={activityFilter}
              filteredTasks={filteredTasks}
              onToggle={toggleTask}
              onAddTask={addTask}
              onRemove={removeTask}
              onClearFilter={handleClearFilter}
            />

            {/* ── End-of-Day panel ── */}
            {totalToday > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-white/[0.06] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />

                <div className="p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Zap className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-black text-white">Tổng kết ngày</span>
                      {isAllDone && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          HOÀN THÀNH
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {doneToday}/{totalToday} task · {todayPct}% · +{todayExpGained} EXP
                    </div>
                    {/* Mini progress */}
                    <div className="mt-2 max-w-[200px] mx-auto sm:mx-0 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${todayPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ boxShadow: '0 0 8px rgba(168,85,247,0.5)' }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0">
                    <motion.button
                      whileHover={!alreadyCelebrated && isAllDone ? { scale: 1.04 } : {}}
                      whileTap={!alreadyCelebrated && isAllDone ? { scale: 0.97 } : {}}
                      onClick={handleEndOfDay}
                      disabled={alreadyCelebrated}
                      className={`
                        relative flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm
                        transition-all duration-300
                        ${alreadyCelebrated
                          ? 'bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/[0.06]'
                          : isAllDone
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                          : 'bg-white/[0.06] text-slate-400 border border-white/[0.06] hover:border-white/[0.1]'}`}
                      style={isAllDone && !alreadyCelebrated ? {
                        boxShadow: '0 0 30px rgba(168,85,247,0.4), 0 8px 20px rgba(0,0,0,0.3)',
                      } : {}}
                    >
                      <Sparkles className="w-4 h-4" />
                      {alreadyCelebrated ? 'Đã tổng kết hôm nay'
                        : isAllDone ? 'Tổng kết ngay!'
                        : 'Tổng kết ngày'}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-slate-700 pb-4">
          Dữ liệu được lưu cục bộ trên thiết bị này
        </p>
      </div>

      {/* End-of-Day Modal */}
      <AnimatePresence>
        {statsOpen && (
          <StatsModal
            open={statsOpen}
            todayTasks={todayTasks}
            expGained={todayExpGained}
            currentExp={exp}
            currentLevel={level}
            alreadyPlanned={alreadyPlanned}
            onClose={() => setStatsOpen(false)}
            onPlanTomorrow={handlePlanTomorrow}
            onCelebrate={handleCelebrate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
