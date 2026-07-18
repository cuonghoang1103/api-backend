'use client';
/**
 * My Language — Practice (Duolingo-style path).
 *
 * Lessons grouped into units that follow the Roadmap (each unit = a roadmap
 * stage; lessons = vocab categories bound to it). Top HUD shows streak, hearts,
 * XP and the daily-goal ring. A second tab shows the weekly leaderboard. Tapping
 * an unlocked lesson opens the full-screen LessonPlayer (choose / listen /
 * arrange, and speak-and-score for Pro). Auth required. Theme-aware.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Heart, Zap, Crown, Lock, Bell, Loader2, Check, Trophy, Route, Award, Star, Sparkles, BookOpenCheck } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, type PracticeOverview, type PracticeLesson, type PracticeCompleteResult, type Leaderboard, type AchievementsResult, type AchievementBadge } from '@/lib/language-api';
import { SectionShell, EmptyState, ProgressRing, useLangUser } from '@/components/language/primitives';
import { usePro } from '@/hooks/usePro';
import LessonPlayer from '@/components/language/practice/LessonPlayer';
import { MascotRow, MascotScene } from '@/components/language/mascot/MascotScene';
import { Mascot } from '@/components/language/mascot/mascot';
import { useMotion } from '@/lib/motion';
import { dailyMascot, mascotName } from '@/lib/mascotData';

const PATH_OFFSETS = [0, 44, 64, 44, 0, -44, -64, -44];

// Node geometry — the connector is drawn from these, so the line and the
// circles cannot drift apart when one of them is retuned.
const NODE = 64;   // circle diameter
const GAP = 12;    // vertical gap between node rows
const ROW = NODE + 46 + GAP; // circle + label block + gap

/**
 * The dashed trail between two nodes.
 *
 * Drawn as an SVG cubic curve rather than a border on a div: the nodes zigzag
 * up to 128px apart horizontally, and a straight connector between them looks
 * like a mistake. Solid green behind you, dashed grey ahead — the line itself
 * reports progress, so it is not decoration.
 */
function Connector({ fromX, toX, done }: { fromX: number; toX: number; done: boolean }) {
  const w = Math.abs(toX - fromX) + 8;
  const h = GAP + 46;
  const x1 = fromX < toX ? 4 : w - 4;
  const x2 = fromX < toX ? w - 4 : 4;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute left-1/2 top-full -z-10"
      style={{ transform: `translateX(calc(-50% + ${(fromX + toX) / 2 - fromX}px))` }}
      aria-hidden
    >
      <path
        d={`M ${x1} 0 C ${x1} ${h * 0.5}, ${x2} ${h * 0.5}, ${x2} ${h}`}
        fill="none"
        stroke={done ? '#58CC02' : 'var(--border-color)'}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={done ? undefined : '2 9'}
      />
    </svg>
  );
}

// Per-unit visual themes — rotate so each stage feels like a new chapter.
const UNIT_THEMES = [
  { grad: 'from-neon-violet/15 to-neon-cyan/10', ring: 'ring-neon-violet/25', text: 'text-neon-violet', bar: 'bg-neon-violet', badge: 'bg-neon-violet', bubble: 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' },
  { grad: 'from-neon-cyan/15 to-neon-green/10', ring: 'ring-neon-cyan/25', text: 'text-neon-cyan', bar: 'bg-neon-cyan', badge: 'bg-neon-cyan', bubble: 'bg-neon-cyan/20 text-neon-cyan ring-neon-cyan/40' },
  { grad: 'from-neon-orange/15 to-neon-pink/10', ring: 'ring-neon-orange/25', text: 'text-neon-orange', bar: 'bg-neon-orange', badge: 'bg-neon-orange', bubble: 'bg-neon-orange/20 text-neon-orange ring-neon-orange/40' },
  { grad: 'from-neon-pink/15 to-neon-violet/10', ring: 'ring-neon-pink/25', text: 'text-neon-pink', bar: 'bg-neon-pink', badge: 'bg-neon-pink', bubble: 'bg-neon-pink/20 text-neon-pink ring-neon-pink/40' },
  { grad: 'from-neon-green/15 to-neon-cyan/10', ring: 'ring-neon-green/25', text: 'text-neon-green', bar: 'bg-neon-green', badge: 'bg-neon-green', bubble: 'bg-neon-green/20 text-neon-green ring-neon-green/40' },
];

/**
 * Today's coach — greets by progress: fresh day, mid-goal, or goal reached.
 *
 * The two moments worth celebrating get a specific mascot rather than whoever is
 * on rotation: finishing the daily goal brings out Sage (crown and star), and a
 * live streak brings out Zippy. Everything else is the rotating greeter, so the
 * special two stay special.
 */
function PracticeGreeting({ dailyPct, streak }: { dailyPct: number; streak: number }) {
  // Rotates daily so the cast takes turns greeting the learner. Resolved in an
  // effect too: dailyMascot() reads the clock, and the server's day and the
  // browser's day can differ — picking during SSR would hydrate-mismatch.
  const [id, setId] = useState(() => dailyMascot());
  useEffect(() => { setId(dailyMascot()); }, []);

  if (dailyPct >= 100) {
    return <MascotScene context="done" text="Mục tiêu hôm nay xong rồi! Ta tự hào về con 👑" size={64} className="mb-4" />;
  }
  if (dailyPct === 0 && streak > 0) {
    return <MascotScene context="streak" text={`Chuỗi ${streak} ngày đang cháy! Làm một bài giữ lửa nào 🔥`} size={64} className="mb-4" />;
  }

  const name = mascotName(id);
  const text =
    dailyPct > 0
      ? `Sắp chạm mục tiêu hôm nay rồi (${dailyPct}%) — cố thêm chút nữa nha! 🔥`
      : `Chào bạn, ${name} đây! Làm một bài ngắn để khởi động nhé 💪`;
  return <MascotRow character={id} emotion="happy" text={text} size={64} className="mb-4" />;
}

export default function PracticePage() {
  const code = String(useParams().code);
  const { isAuthenticated } = useLangUser();
  const { isPro } = usePro();
  const [data, setData] = useState<PracticeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<PracticeLesson | null>(null);
  const [savingReminder, setSavingReminder] = useState(false);
  const [tab, setTab] = useState<'path' | 'board' | 'ach'>('path');
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [boardLoading, setBoardLoading] = useState(false);
  const [ach, setAch] = useState<AchievementsResult | null>(null);
  const [achLoading, setAchLoading] = useState(false);
  // Which node is shaking right now — a tap on a locked lesson.
  const [shakeKey, setShakeKey] = useState<string | null>(null);
  const m = useMotion();

  const load = useCallback(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    setLoading(true);
    languageApi
      .practice(code)
      .then((res) => setData(res.data.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code, isAuthenticated]);

  useEffect(() => { load(); }, [load]);

  const loadBoard = useCallback(() => {
    setBoardLoading(true);
    languageApi
      .practiceLeaderboard(code)
      .then((res) => setBoard(res.data.data ?? null))
      .catch(() => {})
      .finally(() => setBoardLoading(false));
  }, [code]);

  useEffect(() => { if (tab === 'board' && !board) loadBoard(); }, [tab, board, loadBoard]);

  const loadAch = useCallback(() => {
    setAchLoading(true);
    languageApi
      .practiceAchievements(code)
      .then((res) => setAch(res.data.data ?? null))
      .catch(() => {})
      .finally(() => setAchLoading(false));
  }, [code]);

  useEffect(() => { if (tab === 'ach') loadAch(); }, [tab, loadAch]);

  const onLessonClick = (l: PracticeLesson) => {
    if (l.locked) {
      // Shake the node itself: the toast says why, the shake says WHICH.
      setShakeKey(l.lessonKey);
      setTimeout(() => setShakeKey(null), 400);
      toast.info('Hoàn thành bài trước để mở khóa bài này.');
      return;
    }
    if (data && data.state.hearts <= 0) { toast.info('Bạn đã hết tim — chờ hồi phục rồi luyện tiếp nhé.'); return; }
    setActive(l);
  };

  const onFinished = (result: PracticeCompleteResult) => {
    toast.success(`+${result.xpGained} XP${result.leveledUp ? ` · Vương miện ${result.crown}!` : ''}`);
    load();
    setBoard(null); // leaderboard changed
    setAch(null);   // XP/badges changed → refetch on next visit
  };

  const toggleReminder = async () => {
    if (!data) return;
    setSavingReminder(true);
    try {
      const res = await languageApi.practiceReminder({ languageCode: code, enabled: !data.state.reminderEnabled, hour: data.state.reminderHour });
      setData((d) => (d ? { ...d, state: res.data.data } : d));
    } catch {
      toast.error('Không lưu được cài đặt nhắc.');
    } finally {
      setSavingReminder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SectionShell code={code} title="Luyện tập" icon={<Dumbbell className="text-neon-violet" />}>
        <div className="py-10">
          <EmptyState emoji="🏋️" title="Đăng nhập để luyện tập" hint="Theo dõi XP, chuỗi ngày và vương miện của bạn." />
          <div className="mt-5 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 rounded-full bg-neon-violet px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">Đăng nhập</Link>
          </div>
        </div>
      </SectionShell>
    );
  }

  const st = data?.state;
  const dailyPct = st && st.dailyGoalXp > 0 ? Math.min(100, Math.round((st.dailyXp / st.dailyGoalXp) * 100)) : 0;

  return (
    <SectionShell code={code} title="Luyện tập" icon={<Dumbbell className="text-neon-violet" />}>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : !data || data.units.length === 0 ? (
        <EmptyState emoji="🧩" title="Chưa có bài luyện tập" hint="Cần các danh mục từ vựng (≥4 từ) để tạo bài. Quản trị viên có thể thêm trong trang admin." />
      ) : (
        <div className="mx-auto max-w-lg">
          <PracticeGreeting dailyPct={dailyPct} streak={st?.streak ?? 0} />

          {/* HUD */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[var(--bg-surface)] bg-gradient-to-r from-neon-violet/5 via-transparent to-neon-cyan/5 px-4 py-3 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-violet/10 px-2 py-0.5 text-sm font-bold text-neon-violet ring-1 ring-neon-violet/25" title={`Cấp độ ${st!.level} · ${st!.xpIntoLevel}/${st!.xpForLevel} XP đến cấp sau`}><Star size={15} className="fill-neon-violet" /> Lv{st!.level}</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-orange" title="Chuỗi ngày"><Flame size={18} /> {st!.streak}</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-pink" title="Tim"><Heart size={18} className="fill-neon-pink" /> {st!.hearts}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-neon-violet" title="Tổng XP"><Zap size={18} /> {st!.xp}</span>
            <div className="ml-auto flex items-center gap-2" title="Mục tiêu hôm nay">
              <ProgressRing value={dailyPct} size={40} stroke={5} label={`${st!.dailyXp}`} />
              <span className="text-xs text-text-muted">/{st!.dailyGoalXp} XP</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-5 flex items-center gap-2">
            <button onClick={() => setTab('path')} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${tab === 'path' ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' : 'text-text-muted ring-[var(--border-color)] hover:text-text-primary'}`}>
              <Dumbbell size={15} /> Lộ trình bài học
            </button>
            <button onClick={() => setTab('board')} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${tab === 'board' ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' : 'text-text-muted ring-[var(--border-color)] hover:text-text-primary'}`}>
              <Trophy size={15} /> Xếp hạng tuần
            </button>
            <button onClick={() => setTab('ach')} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${tab === 'ach' ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' : 'text-text-muted ring-[var(--border-color)] hover:text-text-primary'}`}>
              <Award size={15} /> Thành tựu
            </button>
            <Link href={`/language/${code}/roadmap`} className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-neon-violet"><Route size={14} /> Lộ trình</Link>
          </div>

          {tab === 'path' ? (
            <>
              {st!.hearts <= 0 && (
                <p className="mb-4 rounded-xl bg-neon-orange/10 px-3 py-2 text-center text-xs text-neon-orange ring-1 ring-neon-orange/25">
                  {/* Say the cap and both ways out. The old copy gave a rate
                      and a countdown and never mentioned that finishing the
                      daily goal refills everything — so waiting looked like the
                      only option it wasn't. */}
                  Hết tim — hồi 1 tim mỗi 12 phút (tối đa {st!.maxHearts}){st!.heartsFullInMin ? `, tim tiếp theo sau ~${st!.heartsFullInMin} phút` : ''}. Xong mục tiêu hôm nay là đầy tim ngay.
                </p>
              )}

              <div className="space-y-10">
                {(() => {
                  // The first unlocked-but-uncrowned lesson across the whole
                  // path is "current" — it gets the pulsing BẮT ĐẦU marker.
                  const currentKey = data.units.flatMap((u) => u.lessons).find((l) => !l.locked && l.crown === 0)?.lessonKey ?? null;
                  return data.units.map((unit, ui) => {
                    const theme = UNIT_THEMES[ui % UNIT_THEMES.length];
                    const done = unit.lessons.filter((l) => l.crown > 0).length;
                    const gold = unit.lessons.filter((l) => l.crown >= 5).length;
                    const words = unit.lessons.reduce((s, l) => s + (l.wordCount ?? 0), 0);
                    const pct = unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0;
                    return (
                      <section key={unit.key}>
                        {/* Unit banner — numbered, themed, with progress */}
                        <div className={`mb-5 overflow-hidden rounded-2xl bg-gradient-to-r ${theme.grad} p-4 ring-1 ${theme.ring}`}>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg font-black ${theme.text}`}>{ui + 1}</span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-80`}>Chặng {ui + 1}</p>
                              <p className="truncate text-base font-bold text-text-primary">{unit.label}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className={`text-sm font-bold ${theme.text}`}>{done}/{unit.lessons.length} bài</p>
                              <p className="text-[10px] text-text-muted">{words > 0 ? `${words} từ` : ''}{gold > 0 ? ` · ${gold} 👑` : ''}</p>
                            </div>
                          </div>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/20">
                            <div className={`h-full rounded-full ${theme.bar} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <motion.div variants={m.pageEnter} initial="hidden" animate="show" className="flex flex-col items-center" style={{ rowGap: GAP }}>
                          {unit.lessons.map((l, li) => {
                            const offset = PATH_OFFSETS[li % PATH_OFFSETS.length];
                            const next = unit.lessons[li + 1];
                            const nextOffset = next ? PATH_OFFSETS[(li + 1) % PATH_OFFSETS.length] : null;
                            const isCurrent = l.lessonKey === currentKey;
                            const isLast = li === unit.lessons.length - 1;
                            // The trail behind a finished lesson is solid; the
                            // one ahead of it is still dashed.
                            const trailDone = l.crown > 0;
                            return (
                              <motion.div
                                key={l.lessonKey}
                                variants={m.childEnter}
                                style={{ transform: `translateX(${offset}px)` }}
                                className="relative flex flex-col items-center"
                              >
                                {nextOffset !== null && (
                                  <Connector fromX={offset} toX={nextOffset} done={trailDone} />
                                )}

                                {isCurrent && (
                                  <motion.span
                                    animate={m.reduce ? undefined : { y: [0, -4, 0] }}
                                    transition={{ duration: 1.2, repeat: Infinity }}
                                    className="mb-1 rounded-lg bg-state-current px-2.5 py-1 font-round text-[10px] font-extrabold uppercase tracking-wide text-[#4A3600] shadow-lg"
                                  >
                                    Bắt đầu
                                  </motion.span>
                                )}

                                {/* The current node is the ONE looping animation
                                    on this screen — plus the mascot's breathing,
                                    which is the whole motion budget. */}
                                <motion.button
                                  type="button"
                                  onClick={() => onLessonClick(l)}
                                  aria-label={l.name}
                                  animate={shakeKey === l.lessonKey ? m.shake.animate : undefined}
                                  transition={m.shake.transition}
                                  {...(isCurrent && !l.locked ? m.pulseRing : {})}
                                  {...m.buttonPress}
                                  className={`relative flex h-16 w-16 items-center justify-center rounded-full ring-4 transition ${
                                    l.locked
                                      ? 'bg-[var(--bg-surface)] text-text-muted opacity-40 ring-[var(--border-color)]'
                                      : l.crown >= 5
                                        ? 'bg-neon-orange/20 text-neon-orange ring-neon-orange/40'
                                        : l.crown > 0
                                          ? 'bg-state-done text-white ring-state-done/30'
                                          : isCurrent
                                            ? 'bg-state-current text-[#4A3600] ring-state-current/30'
                                            : `${theme.bubble}`
                                  }`}
                                >
                                  {l.locked ? <Lock size={22} /> : l.crown >= 5 ? <Crown size={26} /> : l.icon ? <span className="text-2xl leading-none" aria-hidden>{l.icon}</span> : l.crown > 0 ? <Check size={26} strokeWidth={3} /> : <Dumbbell size={24} />}
                                  {!l.locked && l.crown > 0 && (
                                    <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-0.5 rounded-full bg-neon-orange px-1.5 py-0.5 text-[10px] font-bold text-white"><Crown size={9} /> {l.crown}</span>
                                  )}
                                  {!l.locked && l.bestScore > 0 && l.crown < 5 && (
                                    <span className="absolute -top-1 -left-1 rounded-full bg-[var(--bg-surface)] px-1.5 py-0.5 text-[9px] font-bold text-text-secondary ring-1 ring-[var(--border-color)]">{l.bestScore}%</span>
                                  )}
                                </motion.button>

                                {/* Mascot stands beside the current node — it
                                    moves because it is RENDERED there, not
                                    animated to a position that could go stale. */}
                                {isCurrent && (
                                  <span
                                    className="pointer-events-none absolute top-1 hidden sm:block"
                                    style={offset > 0 ? { right: NODE + 18 } : { left: NODE + 18 }}
                                  >
                                    <Mascot character="bip" emotion="happy" size={56} />
                                  </span>
                                )}

                                <span className={`mt-1.5 max-w-[9rem] truncate text-center font-round text-xs font-bold ${l.locked ? 'text-text-muted' : 'text-text-secondary'}`}>{l.name}</span>
                                {!l.locked && l.wordCount > 0 && (
                                  <span className="text-[10px] text-text-muted">{l.wordCount} từ</span>
                                )}
                                {isLast && unit.lessons.every((x) => x.crown > 0) && (
                                  // A real checkpoint: it marks a unit actually
                                  // finished. No treasure chests — there is no
                                  // reward behind one, and a chest that opens
                                  // onto nothing is a lie.
                                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-state-done/15 px-3 py-1.5 font-round text-xs font-extrabold text-state-done ring-1 ring-state-done/30">
                                    <Trophy size={13} /> Xong chặng {ui + 1}
                                  </span>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </section>
                    );
                  });
                })()}
              </div>

              {/* Daily reminder */}
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[var(--bg-surface)] px-4 py-3 ring-1 ring-[var(--border-color)]">
                <Bell size={18} className="text-text-secondary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">Nhắc học hằng ngày</p>
                  <p className="text-xs text-text-muted">Nhắc bạn giữ chuỗi ngày lúc {String(st!.reminderHour).padStart(2, '0')}:00</p>
                </div>
                <button type="button" onClick={toggleReminder} disabled={savingReminder} aria-pressed={st!.reminderEnabled} className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ${st!.reminderEnabled ? 'bg-neon-green' : 'bg-[var(--border-color)]'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${st!.reminderEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-text-muted">Nhắc trong ứng dụng khi bạn quay lại. Nhắc qua email sẽ được bổ sung sau.</p>
            </>
          ) : tab === 'board' ? (
            <LeaderboardView board={board} loading={boardLoading} />
          ) : (
            <AchievementsView ach={ach} loading={achLoading} />
          )}
        </div>
      )}

      {active && (
        <LessonPlayer code={code} lesson={active} initialHearts={data?.state.hearts ?? 5} isPro={isPro} onClose={() => setActive(null)} onFinished={onFinished} />
      )}
    </SectionShell>
  );
}

const BADGE_ICON: Record<string, typeof Award> = { Sparkles, BookOpenCheck, Flame, Zap, Crown, Award, Star };

function AchievementsView({ ach, loading }: { ach: AchievementsResult | null; loading: boolean }) {
  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>;
  if (!ach) return <EmptyState emoji="🏅" title="Chưa có thành tựu" hint="Hoàn thành bài học để mở khóa huy hiệu và lên cấp!" />;
  const pct = ach.level.xpForLevel > 0 ? Math.min(100, Math.round((ach.level.xpIntoLevel / ach.level.xpForLevel) * 100)) : 0;
  return (
    <div className="space-y-5">
      {/* Level card */}
      <div className="rounded-2xl bg-[var(--bg-surface)] bg-gradient-to-br from-neon-violet/10 to-transparent p-4 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neon-violet/15 text-lg font-black text-neon-violet ring-1 ring-neon-violet/30">{ach.level.level}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary">Cấp độ {ach.level.level}</p>
            <p className="text-xs text-text-muted">{ach.level.xpIntoLevel} / {ach.level.xpForLevel} XP đến cấp {ach.level.level + 1}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-neon-violet"><Zap size={14} /> {ach.level.xp}</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--bg-primary)]">
          <div className="h-full rounded-full bg-neon-gradient transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Badges */}
      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <Award size={14} /> Huy hiệu · {ach.earnedCount}/{ach.badges.length}
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ach.badges.map((b) => {
            const Icon = BADGE_ICON[b.icon] ?? Award;
            const pctB = Math.round(b.progress * 100);
            return (
              <div key={b.id} className={`rounded-2xl p-3 ring-1 transition ${b.earned ? 'bg-neon-violet/10 ring-neon-violet/40' : 'bg-[var(--bg-surface)] ring-[var(--border-color)]'}`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${b.earned ? 'bg-neon-violet/20 text-neon-violet' : 'bg-[var(--bg-primary)] text-text-muted'}`}>
                    <Icon size={18} className={b.earned && (b.icon === 'Flame' || b.icon === 'Star') ? 'fill-current' : ''} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-bold ${b.earned ? 'text-text-primary' : 'text-text-secondary'}`}>{b.label}</p>
                    <p className="truncate text-[10px] text-text-muted">{b.description}</p>
                  </div>
                </div>
                {!b.earned && (
                  <div className="mt-2">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-primary)]">
                      <div className="h-full rounded-full bg-neon-violet/50" style={{ width: `${pctB}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[10px] text-text-muted">{Math.min(b.current, b.goal)}/{b.goal}</p>
                  </div>
                )}
                {b.earned && <p className="mt-2 text-right text-[10px] font-semibold text-neon-green">✓ Đã đạt</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LeaderboardView({ board, loading }: { board: Leaderboard | null; loading: boolean }) {
  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>;
  if (!board || (board.entries.length === 0 && (!board.me || board.me.weeklyXp === 0))) {
    return <EmptyState emoji="🏆" title="Chưa có ai lên bảng tuần này" hint="Hoàn thành bài học để nhận XP và leo hạng!" />;
  }
  const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`);
  const inList = board.me && board.entries.some((e) => e.isMe);
  return (
    <div>
      <p className="mb-3 text-center text-xs text-text-muted">Xếp hạng theo XP trong tuần này</p>
      <ul className="space-y-1.5">
        {board.entries.map((e) => (
          <li key={e.userId} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ${e.isMe ? 'bg-neon-violet/10 ring-neon-violet/40' : 'bg-[var(--bg-surface)] ring-[var(--border-color)]'}`}>
            <span className="w-8 shrink-0 text-center text-sm font-bold text-text-secondary">{medal(e.rank)}</span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-xs font-bold text-neon-violet">{e.name.slice(0, 1).toUpperCase()}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{e.name}{e.isMe ? ' (bạn)' : ''}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-neon-violet"><Zap size={14} /> {e.weeklyXp}</span>
          </li>
        ))}
      </ul>
      {board.me && !inList && (
        <div className="mt-3 border-t border-[var(--border-color)] pt-3">
          <div className="flex items-center gap-3 rounded-xl bg-neon-violet/10 px-3 py-2.5 ring-1 ring-neon-violet/40">
            <span className="w-8 shrink-0 text-center text-sm font-bold text-text-secondary">{board.me.rank ? `#${board.me.rank}` : '—'}</span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-xs font-bold text-neon-violet">{board.me.name.slice(0, 1).toUpperCase()}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{board.me.name} (bạn)</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-neon-violet"><Zap size={14} /> {board.me.weeklyXp}</span>
          </div>
        </div>
      )}
    </div>
  );
}
