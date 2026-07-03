'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Star, Trophy, Calendar, Plus, Zap } from 'lucide-react';
import type { Task } from './types';
import { expToNextLevel } from './store';

const CONGRATS_MESSAGES = [
  '🌟 Onii-chan hôm nay tuyệt vời lắm! Level up thôi!',
  '💖 Senpai đã hoàn thành xuất sắc mọi nhiệm vụ!',
  '✨ Bạn làm được rồi! Ngày mai sẽ còn tuyệt vời hơn!',
  '🔥 Fantastic! Tiếp tục phát huy nhé, champion!',
  '🎯 Hôm nay bạn đã rất nỗ lực! Tự hào về bạn!',
];

const ENCOURAGE_MESSAGES = [
  '💪 Ngày mai chúng ta sẽ làm tốt hơn! Cố lên nhé!',
  '🌈 Không sao cả, ngày mai là cơ hội mới. Đừng bỏ cuộc!',
  '🚀 Mỗi ngày là một bước tiến. Tiếp tục nhé!',
  '⭐ Bạn đã cố gắng rất nhiều rồi! Ngày mai sẽ thành công!',
];

function pickMsg(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Props {
  open: boolean;
  todayTasks: Task[];
  expGained: number;
  currentExp: number;
  currentLevel: number;
  alreadyPlanned: boolean;
  onClose: () => void;
  onPlanTomorrow: (titles: string[]) => void;
  onCelebrate: () => void;
}

export default function StatsModal({
  open,
  todayTasks,
  expGained,
  currentExp,
  currentLevel,
  alreadyPlanned,
  onClose,
  onPlanTomorrow,
  onCelebrate,
}: Props) {
  const planInputsRef = useRef<HTMLInputElement[]>([]);
  const confettiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const done = todayTasks.filter((t) => t.done);
  const pct = todayTasks.length ? Math.round((done.length / todayTasks.length) * 100) : 0;
  const isPerfect = pct === 100;
  const neededNext = expToNextLevel(currentLevel);
  const expProgress = (currentExp / neededNext) * 100;

  // Gather plan inputs — track at component level so they persist between renders
  const plans = planInputsRef.current
    .map((el) => el?.value.trim() ?? '')
    .filter(Boolean);
  const hasPlan = plans.length >= 1;

  // Cleanup confetti interval when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    };
  }, []);

  const handleOpen = () => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
    }
    if (isPerfect) {
      confettiIntervalRef.current = setInterval(() => {
        confetti({
          particleCount: 140,
          spread: 110,
          origin: { x: Math.random(), y: 0.5 },
          colors: ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ffffff', '#fb923c', '#4ade80'],
          startVelocity: 45,
          gravity: 0.8,
          scalar: 1.4,
          ticks: 200,
        });
      }, 400);
      setTimeout(() => {
        if (confettiIntervalRef.current) {
          clearInterval(confettiIntervalRef.current);
          confettiIntervalRef.current = null;
        }
      }, 2800);
    }
  };

  const handleClose = () => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
    if (hasPlan) {
      // onPlanTomorrow hits the server (/api/v1/dashboard/plan-tomorrow)
      // and only commits if the user typed at least one title.
      onPlanTomorrow(plans);
      // onCelebrate is now a no-op for logged-in users (the
      // server already locked today's celebration when the
      // modal was opened). We still call it so guests see the
      // local lastCelebratedDate flip — the same UX as before.
      onCelebrate();
      onClose();
    }
  };

  useEffect(() => {
    if (open) handleOpen();
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #1a1c2e 0%, #161830 50%, #0f111a 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 80px rgba(168,85,247,0.2), 0 40px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Header ── */}
        <div className="relative px-8 pt-8 pb-6 text-center overflow-hidden">
          {/* Glow background */}
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: isPerfect
                 ? 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.25) 0%, transparent 70%)'
                 : 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />

          {/* Big emoji character */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
            className="text-7xl mb-3 drop-shadow-2xl"
          >
            {isPerfect ? '🌟' : pct >= 50 ? '💪' : '🌙'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent mb-1"
          >
            {isPerfect ? 'Level Up!' : 'Tổng kết ngày'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-slate-400"
          >
            {isPerfect ? 'Ngày hoàn hảo tuyệt đối!' : `Bạn đã hoàn thành ${pct}% nhiệm vụ hôm nay`}
          </motion.p>
        </div>

        {/* ── Body ── */}
        <div className="px-8 pb-6 space-y-5">

          {/* Completion ring */}
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Track */}
                <circle cx="50" cy="50" r="40" fill="none"
                        stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                {/* Progress */}
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke={isPerfect ? 'url(#perfectGrad)' : 'url(#normalGrad)'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - pct / 100) }}
                  transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
                />
                <defs>
                  <linearGradient id="perfectGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="normalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={pct}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-3xl font-black text-white"
                >
                  {pct}%
                </motion.span>
                <span className="text-[10px] text-slate-400 font-medium">hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3.5 text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="text-xl font-black text-white">{done.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Hoàn thành</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3.5 text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-xl font-black text-white">+{expGained}</div>
              <div className="text-[10px] text-slate-500 font-medium">EXP nhận</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3.5 text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white">Lv.{currentLevel}</div>
              <div className="text-[10px] text-slate-500 font-medium">Cấp độ</div>
            </motion.div>
          </div>

          {/* EXP bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
              <span>EXP — Level {currentLevel}</span>
              <span className="font-mono font-bold">
                <span className="text-white">{currentExp}</span>
                <span className="text-slate-600">/{neededNext}</span>
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(expProgress, 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                style={{ boxShadow: '0 0 12px rgba(168,85,247,0.6)' }}
              />
            </div>
          </motion.div>

          {/* Anime message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border p-4 text-center"
            style={{
              background: isPerfect
                ? 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))'
                : 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(168,85,247,0.06))',
              border: isPerfect ? '1px solid rgba(168,85,247,0.25)' : '1px solid rgba(6,182,212,0.2)',
            }}
          >
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {isPerfect ? pickMsg(CONGRATS_MESSAGES) : pickMsg(ENCOURAGE_MESSAGES)}
            </p>
          </motion.div>

          {/* ── Plan tomorrow (always shown) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-white/[0.06] p-5"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Lên kế hoạch ngày mai</h3>
                <p className="text-[11px] text-slate-500">Nhập ít nhất 1 task để đóng tổng kết</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 flex items-center justify-center text-xs font-black text-white/80">
                    {i + 1}
                  </div>
                  <input
                    ref={(el) => { if (el) planInputsRef.current[i] = el; }}
                    placeholder={`Task ${i + 1} cho ngày mai...`}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/[0.04] transition-all duration-200"
                  />
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-[11px] text-slate-500">
                {plans.length >= 1
                  ? `${plans.length} task — sẵn sàng đóng!`
                  : 'Nhập ít nhất 1 task để tiếp tục'}
              </span>
              {plans.length >= 1 && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  OK!
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Action button ── */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={handleClose}
            disabled={!hasPlan}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-300
              ${hasPlan
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white'
                : 'bg-white/[0.06] text-slate-500 cursor-not-allowed'}`}
            style={hasPlan ? {
              boxShadow: '0 0 30px rgba(168,85,247,0.4), 0 8px 20px rgba(0,0,0,0.3)',
            } : {}}
          >
            {hasPlan ? '✨ Hoàn tất tổng kết!' : '🔒 Nhập ít nhất 1 task để tiếp tục'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
