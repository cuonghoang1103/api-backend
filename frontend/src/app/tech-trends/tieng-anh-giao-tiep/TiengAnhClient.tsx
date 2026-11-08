'use client';

/**
 * Khoá "Tiếng Anh Giao Tiếp" — 20 ngày từ câu chào tới kể chuyện.
 *
 * Ghi chú giao diện:
 *  - Trang tự mang nền tối cố định (#0a0a0f) giống trang ôn thi JPD113, KHÔNG
 *    dùng biến thể `dark:` của Tailwind. Ở dự án này `dark:` được giữ riêng
 *    cho khối Notes; đặt class `dark` ra ngoài phạm vi đó từng làm hỏng bộ
 *    đổi theme của Notes.
 *  - Tiến độ lưu ở localStorage và CHỈ đọc sau khi mount, nếu không sẽ lệch
 *    HTML giữa server và client (hydration mismatch).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, CheckCircle2, Circle, MessageSquare,
  Mic, Volume2, GraduationCap, Lightbulb, Target, ListChecks, Code2, Search,
  ClipboardCheck,
} from 'lucide-react';
import {
  WEEKS, ALL_DAYS, STATS, PROGRESS_KEY, TECH_VOCAB, DEV_SECTIONS, DEV_PLAN,
  type DayLesson,
} from './data';
import { useSpeak } from './useSpeak';
import RoadmapView from './RoadmapView';
import SearchView from './SearchView';
import VocabPanel from './VocabPanel';
import WeeklyTest from './WeeklyTest';

type TabId = 'days' | 'vocab' | 'test' | 'sounds' | 'dev' | 'search';

const TABS: { id: TabId; label: string; icon: typeof Target }[] = [
  { id: 'days', label: 'Lộ trình', icon: Target },
  { id: 'vocab', label: 'Từ vựng', icon: BookOpen },
  { id: 'test', label: 'Kiểm tra tuần', icon: ClipboardCheck },
  { id: 'sounds', label: 'Phát âm', icon: Mic },
  { id: 'dev', label: 'Cho Dev', icon: Code2 },
  { id: 'search', label: 'Tra cứu', icon: Search },
];

/** Nút loa — bấm là đọc câu tiếng Anh. */
function SpeakBtn({
  text, onSpeak, active, supported,
}: {
  text: string;
  onSpeak: (t: string) => void;
  active: boolean;
  supported: boolean;
}) {
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => onSpeak(text)}
      aria-label={`Nghe: ${text}`}
      title="Nghe phát âm"
      className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
        active
          ? 'bg-violet-500/30 text-tone-violet'
          : 'text-text-muted hover:text-tone-violet hover:bg-violet-500/10'
      }`}
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
}

/** Nội dung một ngày. */
function DayView({
  day, speak, current, supported,
}: {
  day: DayLesson;
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Mục tiêu */}
      <div className="rounded-2xl border border-violet-500/25 bg-violet-500/10 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 text-tone-violet text-sm font-semibold">
          <Target className="w-4 h-4" />
          Mục tiêu ngày {day.day}
        </div>
        <p className="text-text-primary leading-relaxed">{day.goal}</p>
      </div>

      {/* Hỏi — Đáp */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          <MessageSquare className="w-5 h-5 text-tone-violet" />
          Câu hỏi &amp; cách trả lời
          <span className="text-xs font-normal text-text-muted">({day.qa.length} nhóm)</span>
        </h3>
        <div className="space-y-4">
          {day.qa.map((pair, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
              {/* Câu hỏi */}
              <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-surface-hover)]">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-xs font-bold text-tone-violet bg-violet-500/15 px-2 py-0.5 rounded">HỎI</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="font-semibold text-text-primary leading-snug">{pair.q.en}</p>
                      <SpeakBtn text={pair.q.en} onSpeak={speak} active={current === pair.q.en} supported={supported} />
                    </div>
                    <p className="text-text-secondary text-sm mt-1">{pair.q.vi}</p>
                    {pair.q.ipa && <p className="text-tone-violet text-xs mt-1 font-mono">{pair.q.ipa}</p>}
                    {pair.q.note && (
                      <p className="text-tone-amber text-xs mt-2 flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{pair.q.note}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Các cách trả lời */}
              <div className="divide-y divide-[var(--border-light)]">
                {pair.answers.map((a, j) => (
                  <div key={j} className="p-4 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5 text-xs font-bold text-tone-emerald bg-emerald-500/15 px-2 py-0.5 rounded">ĐÁP</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-text-primary leading-snug">{a.en}</p>
                        <SpeakBtn text={a.en} onSpeak={speak} active={current === a.en} supported={supported} />
                      </div>
                      <p className="text-text-secondary text-sm mt-1">{a.vi}</p>
                      {a.ipa && <p className="text-tone-violet text-xs mt-1 font-mono">{a.ipa}</p>}
                      {a.note && (
                        <p className="text-tone-amber text-xs mt-1.5 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{a.note}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hội thoại */}
      {day.dialogues.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
            <MessageSquare className="w-5 h-5 text-tone-sky" />
            Hội thoại mẫu
          </h3>
          <div className="space-y-5">
            {day.dialogues.map((d, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
                <div className="mb-3">
                  <p className="font-semibold text-tone-sky">{d.title}</p>
                  <p className="text-text-muted text-sm">{d.titleVi}</p>
                </div>
                <div className="space-y-3">
                  {d.lines.map((l, j) => (
                    <div key={j} className="flex gap-3">
                      <span className="shrink-0 w-20 sm:w-28 text-xs font-medium text-text-muted pt-1 truncate">{l.who}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className="text-text-primary">{l.en}</p>
                          <SpeakBtn text={l.en} onSpeak={speak} active={current === l.en} supported={supported} />
                        </div>
                        <p className="text-text-secondary text-sm">{l.vi}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => speak(d.lines.map((l) => l.en).join('. '))}
                  className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-sky-500/15 text-tone-sky hover:bg-sky-500/25 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe cả đoạn
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Từ vựng */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          <BookOpen className="w-5 h-5 text-tone-emerald" />
          Từ vựng ngày {day.day}
          <span className="text-xs font-normal text-text-muted">({day.vocab.length} từ)</span>
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {day.vocab.map((v, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-text-primary">{v.en}</span>
                    {v.pos && <span className="text-[10px] text-text-muted border border-[var(--border-light)] px-1.5 rounded">{v.pos}</span>}
                  </div>
                  <p className="text-tone-violet text-xs font-mono mt-0.5">{v.ipa}</p>
                  <p className="text-text-secondary text-sm mt-1">{v.vi}</p>
                  {v.ex && (
                    <p className="text-text-muted text-xs mt-1.5 italic">
                      {v.ex} {v.exVi && <span className="not-italic">— {v.exVi}</span>}
                    </p>
                  )}
                </div>
                <SpeakBtn text={v.en} onSpeak={speak} active={current === v.en} supported={supported} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ngữ pháp */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          <GraduationCap className="w-5 h-5 text-tone-amber" />
          Ngữ pháp
        </h3>
        <div className="space-y-4">
          {day.grammar.map((g, i) => (
            <div key={i} className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
              <p className="font-semibold text-tone-amber mb-2">{g.title}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{g.explain}</p>
              {g.formula && (
                <div className="mt-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-light)] px-3 py-2">
                  <p className="text-xs text-text-muted mb-0.5">Công thức</p>
                  <p className="text-tone-amber text-sm font-mono break-words">{g.formula}</p>
                </div>
              )}
              <div className="mt-3 space-y-1.5">
                {g.examples.map((ex, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-tone-amber text-xs mt-1">▸</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-text-primary text-sm">{ex.en}</p>
                        <SpeakBtn text={ex.en} onSpeak={speak} active={current === ex.en} supported={supported} />
                      </div>
                      <p className="text-text-muted text-xs">{ex.vi}</p>
                    </div>
                  </div>
                ))}
              </div>
              {g.mistake && (
                <p className="mt-3 text-xs text-tone-rose bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  ⚠️ {g.mistake}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Phát âm */}
      {day.sound && (
        <section>
          <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
            <Mic className="w-5 h-5 text-tone-rose" />
            Luyện âm {day.sound.sound}
          </h3>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4">
            <p className="text-text-secondary text-sm leading-relaxed">{day.sound.how}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {day.sound.words.map((w, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => speak(w.en)}
                  className={`text-left rounded-xl border px-3 py-2 transition-all active:scale-95 ${
                    current === w.en
                      ? 'border-rose-400/50 bg-rose-500/20'
                      : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] hover:border-rose-400/30'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-semibold text-text-primary text-sm">
                    {w.en}
                    <Volume2 className="w-3 h-3 text-text-muted" />
                  </span>
                  <span className="block text-tone-violet text-[11px] font-mono">{w.ipa}</span>
                  <span className="block text-text-muted text-xs">{w.vi}</span>
                </button>
              ))}
            </div>
            {day.sound.sentence && (
              <div className="mt-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-light)] px-3 py-2">
                <div className="flex items-start gap-2">
                  <p className="text-text-primary text-sm flex-1">{day.sound.sentence.en}</p>
                  <SpeakBtn text={day.sound.sentence.en} onSpeak={speak} active={current === day.sound.sentence.en} supported={supported} />
                </div>
                <p className="text-text-muted text-xs mt-0.5">{day.sound.sentence.vi}</p>
              </div>
            )}
            {day.sound.trap && (
              <p className="mt-3 text-xs text-tone-rose bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                ⚠️ Bẫy người Việt hay mắc: {day.sound.trap}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Luyện tập */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          <ListChecks className="w-5 h-5 text-tone-teal" />
          Việc cần làm hôm nay
        </h3>
        <ul className="space-y-2">
          {day.practice.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-teal-500/20 text-tone-teal text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="text-text-primary text-sm leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function TiengAnhClient() {
  const [tab, setTab] = useState<TabId>('days');
  const [activeDay, setActiveDay] = useState(1);
  const [query, setQuery] = useState('');
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const { speak, current, supported } = useSpeak();

  // Đọc localStorage SAU khi mount — trước đó server và client phải khớp HTML.
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn — vẫn học được, chỉ là không nhớ tiến độ */
    }
  }, []);

  const toggleDone = useCallback((d: number) => {
    setDone((prev) => {
      const next = { ...prev, [d]: !prev[d] };
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, []);

  const day = useMemo(
    () => ALL_DAYS.find((d) => d.day === activeDay) ?? ALL_DAYS[0],
    [activeDay],
  );

  const doneCount = useMemo(
    () => (hydrated ? ALL_DAYS.filter((d) => done[d.day]).length : 0),
    [done, hydrated],
  );

  /** Gom mọi từ vựng, chống trùng theo chữ viết. */
  const allVocab = useMemo(() => {
    const seen = new Set<string>();
    return ALL_DAYS.flatMap((d) => d.vocab).filter((v) => {
      const k = v.en.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  const allSounds = useMemo(
    () => ALL_DAYS.filter((d) => d.sound).map((d) => ({ day: d.day, sound: d.sound! })),
    [],
  );

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/tech-trends"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tech Trends
        </Link>

        {/* Tiêu đề */}
        <header className="mb-8">
          <p className="text-tone-violet text-sm font-medium tracking-wide uppercase mb-2">
            Khoá giao tiếp · {STATS.days} ngày
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
            Tiếng Anh Giao Tiếp
          </h1>
          <p className="text-text-secondary mt-3 max-w-3xl leading-relaxed">
            Học đúng thứ tự người ta thật sự cần: những câu bật ra mỗi ngày trước, rồi mới tới
            tiếng Anh công việc. Mỗi ngày có sẵn câu hỏi kèm nhiều cách trả lời, hội thoại mẫu,
            từ vựng, ngữ pháp và một âm khó để luyện. Bấm biểu tượng loa ở bất kỳ câu nào để nghe đọc.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.days}</b> ngày</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.phrases}</b> câu mẫu</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.vocab}</b> lượt từ vựng</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.grammar}</b> điểm ngữ pháp</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.dialogues}</b> hội thoại</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.sounds}</b> âm luyện</span>
          </div>

          {hydrated && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
                <span>Tiến độ của bạn</span>
                <span>{doneCount}/{STATS.days} ngày</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-surface-active)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(doneCount / STATS.days) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!supported && (
            <p className="mt-4 text-xs text-tone-amber bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              Trình duyệt này chưa có giọng đọc tiếng Anh nên nút loa sẽ ẩn. Phiên âm IPA vẫn đầy đủ ở mỗi câu.
            </p>
          )}
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 border ${
                  on
                    ? 'bg-violet-500/20 border-violet-400/40 text-text-primary'
                    : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary hover:border-[var(--border-light-hover)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Lộ trình 20 ngày ── */}
        {tab === 'days' && (
          <div>
            {/* Sơ đồ lộ trình — thay lưới nút phẳng, xem được mình đang ở đâu */}
            <div className="mb-8">
              <RoadmapView
                weeks={WEEKS}
                activeDay={activeDay}
                done={done}
                hydrated={hydrated}
                onPick={setActiveDay}
              />
            </div>

            {/* Nội dung ngày đang chọn */}
            <div className="rounded-3xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-light)]">
                <div>
                  <p className="text-xs text-tone-violet font-medium">NGÀY {day.day}</p>
                  <h2 className="text-2xl font-bold text-text-primary mt-0.5">
                    {day.icon} {day.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDone(day.day)}
                  className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
                    hydrated && done[day.day]
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-tone-emerald'
                      : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {hydrated && done[day.day]
                    ? <><CheckCircle2 className="w-4 h-4" /> Đã xong</>
                    : <><Circle className="w-4 h-4" /> Đánh dấu xong</>}
                </button>
              </div>

              <DayView day={day} speak={speak} current={current} supported={supported} />

              {/* Điều hướng ngày */}
              <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--border-light)]">
                <button
                  type="button"
                  disabled={activeDay <= 1}
                  onClick={() => setActiveDay((d) => Math.max(1, d - 1))}
                  className="px-4 py-2 rounded-xl text-sm border border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary disabled:opacity-30 hover:border-[var(--border-light-hover)] transition-all"
                >
                  ← Ngày {Math.max(1, activeDay - 1)}
                </button>
                <button
                  type="button"
                  disabled={activeDay >= STATS.days}
                  onClick={() => setActiveDay((d) => Math.min(STATS.days, d + 1))}
                  className="px-4 py-2 rounded-xl text-sm border border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary disabled:opacity-30 hover:border-[var(--border-light-hover)] transition-all"
                >
                  Ngày {Math.min(STATS.days, activeDay + 1)} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Từ vựng ── */}
        {tab === 'vocab' && (
          <div>
            <p className="text-text-secondary text-sm mb-5">
              Toàn bộ <b className="text-text-primary">{allVocab.length}</b> từ và cụm của khoá học, đã gộp trùng.
              Ba chế độ: xem danh sách, lật thẻ để tự kiểm tra, hoặc làm bài trắc nghiệm 10 câu.
            </p>
            <VocabPanel words={allVocab} speak={speak} current={current} supported={supported} />
          </div>
        )}

        {/* ── Tab: Phát âm ── */}
        {tab === 'sounds' && (
          <div>
            <p className="text-text-secondary text-sm mb-5">
              <b className="text-text-primary">{allSounds.length}</b> âm khó nhất với người Việt, rải đều qua 20 ngày.
              Mỗi âm có cách đặt lưỡi, từ luyện, câu luyện và bẫy hay mắc.
            </p>
            <div className="space-y-4">
              {allSounds.map(({ day: dNum, sound }) => (
                <div key={dNum} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-tone-rose font-mono">{sound.sound}</span>
                    <span className="text-xs text-text-muted">Ngày {dNum}</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{sound.how}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sound.words.map((w, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => speak(w.en)}
                        className={`text-left rounded-lg border px-2.5 py-1.5 transition-all active:scale-95 ${
                          current === w.en
                            ? 'border-rose-400/50 bg-rose-500/20'
                            : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] hover:border-rose-400/30'
                        }`}
                      >
                        <span className="block text-text-primary text-sm font-medium">{w.en}</span>
                        <span className="block text-tone-violet text-[10px] font-mono">{w.ipa}</span>
                      </button>
                    ))}
                  </div>
                  {sound.trap && (
                    <p className="mt-3 text-xs text-tone-rose bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                      ⚠️ {sound.trap}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Kiểm tra tuần ── */}
        {tab === 'test' && (
          <div>
            <p className="text-text-secondary text-sm mb-5">
              Học xong mỗi tuần thì làm bài này để biết mình thật sự nói được chưa.
              Phần tự nói cố ý để bạn <b className="text-text-primary">tự chấm</b> — không có cách nào
              chấm phát âm bằng trắc nghiệm, và mục tiêu là mở miệng nói ra thành tiếng.
            </p>
            <WeeklyTest weeks={WEEKS} speak={speak} current={current} supported={supported} />
          </div>
        )}

        {/* ── Tab: Tra cứu ── */}
        {tab === 'search' && (
          <SearchView
            query={query}
            onQuery={setQuery}
            speak={speak}
            current={current}
            supported={supported}
            onGoDay={(d) => { setActiveDay(d); setTab('days'); }}
          />
        )}

        {/* ── Tab: Cho Dev ── */}
        {tab === 'dev' && (
          <div className="space-y-10">
            <div className="rounded-2xl border border-sky-500/25 bg-sky-500/10 p-4 sm:p-5">
              <p className="text-text-primary leading-relaxed">
                Phần này dành cho việc <b className="text-text-primary">đi làm</b>: trao đổi với khách hàng,
                phỏng vấn, và quay video khoá học nói tiếng Anh 100%. Nên bắt đầu sau khi đã đi hết
                20 ngày giao tiếp — vì mọi câu ở đây đều dựa trên nền đó.
              </p>
            </div>

            {/* Lịch học gợi ý */}
            <section>
              <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
                <Target className="w-5 h-5 text-tone-violet" />
                Lộ trình sau 20 ngày
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {DEV_PLAN.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
                    <p className="font-semibold text-tone-violet">{p.phase}</p>
                    <p className="text-xs text-text-muted mt-0.5">{p.weeks}</p>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">{p.focus}</p>
                    <p className="text-tone-emerald text-xs mt-2">🎯 {p.goal}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mẫu câu theo tình huống */}
            {DEV_SECTIONS.map((sec) => (
              <section key={sec.id}>
                <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-1">
                  <span>{sec.icon}</span>
                  {sec.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 leading-relaxed">{sec.intro}</p>
                <div className="space-y-4">
                  {sec.groups.map((g, gi) => (
                    <div key={gi} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
                      <p className="px-4 py-2.5 bg-[var(--bg-surface-hover)] border-b border-[var(--border-light)] text-sm font-semibold text-tone-sky">
                        {g.label}
                      </p>
                      <div className="divide-y divide-[var(--border-light)]">
                        {g.phrases.map((ph, pi) => (
                          <div key={pi} className="p-4">
                            <div className="flex items-start gap-2">
                              <p className="text-text-primary leading-relaxed flex-1">{ph.en}</p>
                              <SpeakBtn text={ph.en} onSpeak={speak} active={current === ph.en} supported={supported} />
                            </div>
                            <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">{ph.vi}</p>
                            {ph.note && (
                              <p className="text-tone-amber text-xs mt-2 flex items-start gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{ph.note}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Từ vựng kỹ thuật */}
            <section>
              <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
                <Code2 className="w-5 h-5 text-tone-emerald" />
                Từ vựng kỹ thuật theo chủ đề
              </h3>
              <div className="space-y-5">
                {TECH_VOCAB.map((g) => (
                  <div key={g.key}>
                    <p className="text-sm font-semibold text-text-primary mb-2">
                      {g.icon} {g.name}
                      <span className="ml-2 text-xs font-normal text-text-muted">({g.words.length} từ)</span>
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {g.words.map((w, i) => (
                        <div key={i} className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3 flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-primary text-sm">{w.en}</p>
                            <p className="text-tone-violet text-[11px] font-mono mt-0.5">{w.ipa}</p>
                            <p className="text-text-secondary text-sm mt-1">{w.vi}</p>
                          </div>
                          <SpeakBtn text={w.en} onSpeak={speak} active={current === w.en} supported={supported} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
