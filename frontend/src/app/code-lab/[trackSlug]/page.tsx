'use client';

/**
 * Code Lab — track roadmap.
 * Modules in order; each lists its exercises with a difficulty badge and a
 * solved checkmark. A progress ring shows how much of the track is solved.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle, Loader2, Clock, ExternalLink, Target, FlaskConical, CheckSquare, Square } from 'lucide-react';
import { codeLabApi, locFromTitle } from '@/lib/code-lab-api';
import type { CodeTrack, MyProgressItem } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { DifficultyBadge, LevelPill, ProgressRing, TechIcon, VerifiedBadge, parseVerified } from '@/components/code-lab/shared';
import { ModuleLesson } from '@/components/code-lab/ModuleLesson';
import { CourseBackLink } from '@/components/code-lab/CourseBackLink';
import { SkillCoverage } from '@/components/code-lab/SkillCoverage';
import { LabRoomBar } from '@/components/code-lab/LabRoomBar';

export default function TrackRoadmapPage() {
  const params = useParams<{ trackSlug: string }>();
  const slug = params.trackSlug;
  const searchParams = useSearchParams();
  // Carry ?ref=&reflabel= (set by an Academy/Courses lesson link) onto the
  // exercise links too, so the "back to course" button survives one more hop.
  const refQS = searchParams.get('ref') ? `?${searchParams.toString()}` : '';
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [track, setTrack] = useState<CodeTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, MyProgressItem>>({});
  // A deep link like /code-lab/java-core#module-249 arrives BEFORE the modules
  // exist, so the browser's own anchor jump finds nothing and stays at the top.
  // Resolve it ourselves once the data is in, and open that module's lesson —
  // the whole point of such a link is "take me to this topic".
  const [focusModuleId, setFocusModuleId] = useState<number | null>(null);
  // Chế độ chọn bài để lập Phòng Lab. Tách hẳn khỏi luồng bấm-vào-bài thường:
  // trong chế độ này một cú bấm là TICK, không phải mở bài — trộn hai nghĩa vào
  // cùng một cú bấm là cách chắc chắn nhất để người dùng mất chỗ đang đọc.
  const [dangChon, setDangChon] = useState(false);
  const [daChon, setDaChon] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getTrack(slug);
        setTrack(res.data.data);
        if (isAuthed && res.data.data?.id) {
          try {
            const p = await codeLabApi.myProgress(res.data.data.id);
            const map: Record<number, MyProgressItem> = {};
            (p.data.data || []).forEach((it) => { map[it.exerciseId] = it; });
            setProgress(map);
          } catch { /* ignore */ }
        }
      } catch { setTrack(null); } finally { setLoading(false); }
    })();
  }, [slug, isAuthed]);

  useEffect(() => {
    if (!track) return;
    const m = /#module-(\d+)/.exec(window.location.hash);
    if (!m) return;
    const id = Number(m[1]);
    setFocusModuleId(id);
    // one frame after paint, so the section is mounted
    const t = window.setTimeout(() => {
      document.getElementById(`module-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [track]);

  const { total, solved } = useMemo(() => {
    const all = (track?.modules || []).flatMap((m) => m.exercises || []);
    const s = all.filter((e) => progress[e.id]?.status === 'SOLVED').length;
    return { total: all.length, solved: s };
  }, [track, progress]);

  // LOC nằm trong TIÊU ĐỀ bài (LAB211 ghi "... (37 LOC)"), track khác không có.
  // `coLoc` quyết định thanh dưới có hiện phần LOC hay chỉ đếm số bài.
  const { picked, totalLoc, coLoc } = useMemo(() => {
    const all = (track?.modules || []).flatMap((m) => m.exercises || []);
    const byId = new Map(all.map((e) => [e.id, e]));
    const list = daChon
      .map((id) => byId.get(id))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .map((e) => ({ id: e.id, title: e.title, loc: locFromTitle(e.title) }));
    return {
      picked: list,
      totalLoc: list.reduce((a, b) => a + b.loc, 0),
      coLoc: all.some((e) => locFromTitle(e.title) > 0),
    };
  }, [track, daChon]);

  const toggleChon = (id: number) =>
    setDaChon((cu) => (cu.includes(id) ? cu.filter((x) => x !== id) : [...cu, id]));

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!track) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Track not found. <Link href="/code-lab" className="underline">Back to Code Lab</Link>
    </div>
  );

  const accent = track.color || 'var(--accent-color)';
  const pct = total ? Math.round((solved / total) * 100) : 0;
  // Back to the track's own section (e.g. CuongThai), not the whole hub.
  const backHref = track.group?.slug ? `/code-lab?group=${track.group.slug}` : '/code-lab';
  const backLabel = track.group?.name || 'Code Lab';

  return (
    <div className="cl-root mx-auto max-w-4xl px-4 pb-14 pt-20" style={{ color: 'var(--text-primary)', ['--cl-accent' as string]: accent } as React.CSSProperties}>
      <CourseBackLink />
      <Link href={backHref} className="mb-4 ml-2 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> {backLabel}
      </Link>

      {/* Track header — hero */}
      <div className="cl-hero cl-in mb-6 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="cl-track-icon shrink-0" style={{ height: 60, width: 60, borderRadius: 16 }}>
            <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={32} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="cl-display text-2xl">{track.name}</h1>
              <LevelPill level={track.level} />
              {parseVerified(track.description).verified && <VerifiedBadge />}
            </div>
            {parseVerified(track.description).text && <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{parseVerified(track.description).text}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={13} />{track.language}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                <Target size={12} />{total} exercises
              </span>
              {track.docsUrl && (
                <a href={track.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: accent }}>
                  <ExternalLink size={12} /> Official docs
                </a>
              )}
              {isAuthed && total > 0 && (
                <button
                  onClick={() => { setDangChon((v) => !v); if (dangChon) setDaChon([]); }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors"
                  style={dangChon
                    ? { background: accent, borderColor: accent, color: '#fff' }
                    : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                  <FlaskConical size={12} /> {dangChon ? 'Xong, thoát chọn' : 'Chọn bài lập phòng Lab'}
                </button>
              )}
              {isAuthed && (
                <Link href="/code-lab/phong-lab" className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[var(--bg-surface-hover)]"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
                  Phòng Lab của tôi
                </Link>
              )}
            </div>
          </div>
          {isAuthed && total > 0 && (
            <div className="flex shrink-0 flex-col items-center">
              <div className="relative">
                <ProgressRing value={total ? solved / total : 0} size={64} />
                <span className="cl-stat-num absolute inset-0 flex items-center justify-center text-sm">{pct}%</span>
              </div>
              <span className="mt-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{solved}/{total} solved</span>
            </div>
          )}
        </div>
        {isAuthed && total > 0 && (
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, #22c55e))` }} />
          </div>
        )}
      </div>

      {/* Modules */}
      {(track.modules || []).length === 0 && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          No modules yet.
        </div>
      )}
      <SkillCoverage trackSlug={slug} />

      <div className="space-y-5">
        {(track.modules || []).map((m, mi) => {
          const modAll = (m.exercises || []).length;
          const modSolved = (m.exercises || []).filter((e) => progress[e.id]?.status === 'SOLVED').length;
          const modDone = modAll > 0 && modSolved === modAll;
          const focused = focusModuleId === m.id;
          return (
          <section
            key={m.id}
            id={`module-${m.id}`}
            className="scroll-mt-24 overflow-hidden rounded-2xl border transition-all"
            style={{
              background: 'var(--bg-card)',
              borderColor: focused ? accent : 'var(--border-color)',
              boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accent} 25%, transparent)` : undefined,
            }}
          >
            <header className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold cl-stat-num"
                style={modDone
                  ? { background: '#22c55e', color: '#fff' }
                  : { background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}>
                {modDone ? <CheckCircle2 size={17} /> : mi + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</h2>
                  <LevelPill level={m.level} />
                </div>
                {m.description && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{m.description}</p>}
              </div>
              {isAuthed && modAll > 0 && (
                <span className="hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums sm:inline-block"
                  style={{ background: 'var(--bg-surface)', color: modDone ? '#22c55e' : 'var(--text-muted)' }}>
                  {modSolved}/{modAll}
                </span>
              )}
            </header>
            <ModuleLesson moduleId={m.id} hasLesson={m.hasLesson} autoOpen={focused} />
            <ul>
              {modAll === 0 && (
                <li className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>No exercises in this module yet.</li>
              )}
              {(m.exercises || []).map((ex, i) => {
                const isSolved = progress[ex.id]?.status === 'SOLVED';
                const inProgress = progress[ex.id]?.status === 'IN_PROGRESS';
                const loc = locFromTitle(ex.title);
                const ticked = daChon.includes(ex.id);
                const noiDung = (
                  <>
                    {dangChon
                      ? (ticked
                        ? <CheckSquare size={19} className="shrink-0" style={{ color: accent }} />
                        : <Square size={19} className="shrink-0" style={{ color: 'var(--border-color)' }} />)
                      : (isSolved
                        ? <CheckCircle2 size={19} className="shrink-0" style={{ color: '#22c55e' }} />
                        : <Circle size={19} className="shrink-0" style={{ color: inProgress ? '#d97706' : 'var(--border-color)' }} />)}
                    <span className="w-6 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium transition-colors group-hover:text-[var(--cl-accent)]" style={{ color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{ex.title}</span>
                    {inProgress && !isSolved && !dangChon && (
                      <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block" style={{ background: 'rgba(217,119,6,0.14)', color: '#d97706' }}>In progress</span>
                    )}
                    {dangChon && loc > 0 && (
                      <span className="shrink-0 text-xs font-semibold tabular-nums" style={{ color: ticked ? accent : 'var(--text-muted)' }}>{loc} LOC</span>
                    )}
                    {!dangChon && ex.estimatedMinutes ? (
                      <span className="hidden items-center gap-1 text-xs sm:flex" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={12} />{ex.estimatedMinutes}m
                      </span>
                    ) : null}
                    <DifficultyBadge difficulty={ex.difficulty} small />
                  </>
                );
                return (
                  <li key={ex.id} className="group border-t first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                    {dangChon ? (
                      <button
                        type="button" onClick={() => toggleChon(ex.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                        style={ticked ? { background: `color-mix(in srgb, ${accent} 9%, transparent)` } : undefined}>
                        {noiDung}
                      </button>
                    ) : (
                      <Link href={`/code-lab/${track.slug}/${ex.slug}${refQS}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-surface-hover)]">
                        {noiDung}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
          );
        })}
      </div>

      {/* Thanh chọn bài dính đáy. Chừa chỗ cuộn để nó không che mất bài cuối. */}
      {dangChon && picked.length > 0 && <div style={{ height: coLoc ? 132 : 96 }} />}
      {dangChon && (
        <LabRoomBar
          trackSlug={track.slug} trackName={track.name}
          picked={picked} totalLoc={totalLoc} coLoc={coLoc}
          onClear={() => setDaChon([])}
          onRemove={(id) => setDaChon((cu) => cu.filter((x) => x !== id))}
        />
      )}
    </div>
  );
}
