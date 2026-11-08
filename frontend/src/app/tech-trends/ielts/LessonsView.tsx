'use client';

/**
 * Tab Bài học — 8 chủ điểm, 40 bài.
 *
 * Bố cục hai cấp: chọn chủ điểm ở trên, chọn bài ở dưới. Cố ý KHÔNG đổ cả 40
 * bài ra một danh sách phẳng — trên điện thoại thì cuộn mãi không thấy đâu là
 * đâu, mà người học cũng mất cảm giác về tiến độ.
 *
 * Trạng thái "đã học" lưu localStorage theo id bài.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2, Circle, Target, AlertTriangle, Volume2, ListChecks, BookMarked,
} from 'lucide-react';
import type { StageBundle } from './data/bundles';
import ExercisePanel from './ExercisePanel';

export default function LessonsView({
  d, speak, current, supported,
}: {
  d: StageBundle;
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const UNITS = d.units;
  const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const [unitId, setUnitId] = useState(UNITS[0].id);
  const [lessonId, setLessonId] = useState(UNITS[0].lessons[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Đổi chặng thì nhảy về bài đầu, nếu không id bài của chặng cũ sẽ không tồn tại.
  const [owner, setOwner] = useState(d.id);
  if (owner !== d.id) {
    setOwner(d.id);
    setUnitId(UNITS[0].id);
    setLessonId(UNITS[0].lessons[0].id);
  }

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(d.keys.lessonDone);
      if (raw) setDone(JSON.parse(raw));
      else setDone({});
    } catch {
      /* localStorage bị chặn — vẫn học được, chỉ không nhớ tiến độ */
    }
  }, [d.keys.lessonDone]);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(d.keys.lessonDone, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, [d.keys.lessonDone]);

  const unit = UNITS.find((u) => u.id === unitId) ?? UNITS[0];
  const lesson = unit.lessons.find((l) => l.id === lessonId) ?? unit.lessons[0];
  const doneCount = hydrated
    ? UNITS.flatMap((u) => u.lessons).filter((l) => done[l.id]).length
    : 0;

  return (
    <div>
      {/* Tiến độ chung */}
      {hydrated && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
            <span>Bài đã học</span>
            <span>{doneCount}/{total}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-surface-active)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(doneCount / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Chọn chủ điểm */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {UNITS.map((u) => {
          const uDone = hydrated ? u.lessons.filter((l) => done[l.id]).length : 0;
          const active = u.id === unitId;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => { setUnitId(u.id); setLessonId(u.lessons[0].id); }}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
                active
                  ? 'bg-sky-500/20 border-sky-400/40 text-text-primary'
                  : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{u.icon}</span>
              <span className="whitespace-nowrap">{u.title.split(' — ')[0]}</span>
              <span className={`text-[10px] px-1.5 rounded ${uDone === u.lessons.length ? 'bg-emerald-500/25 text-tone-emerald' : 'bg-[var(--bg-surface-active)] text-text-secondary'}`}>
                {uDone}/{u.lessons.length}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-text-secondary mb-4">{unit.subtitle}</p>

      {/* Chọn bài trong chủ điểm */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        {unit.lessons.map((l) => {
          const ok = hydrated && done[l.id];
          const active = l.id === lessonId;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setLessonId(l.id)}
              className={`text-left rounded-xl border p-3 transition-all active:scale-[0.98] ${
                active
                  ? 'border-sky-400/50 bg-sky-500/10'
                  : ok
                    ? 'border-emerald-400/25 bg-emerald-500/[0.06]'
                    : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] hover:border-[var(--border-light-hover)]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-tone-emerald shrink-0" />
                  : <Circle className="w-3.5 h-3.5 text-text-muted shrink-0" />}
                <span className="text-[10px] font-bold text-tone-sky">Bài {l.n}</span>
              </div>
              <p className="text-xs text-text-primary leading-snug">{l.title}</p>
            </button>
          );
        })}
      </div>

      {/* Nội dung bài */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-tone-sky">
              Bài {lesson.n}/{total}
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-2">{lesson.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => toggleDone(lesson.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
              hydrated && done[lesson.id]
                ? 'bg-emerald-500/20 border-emerald-400/40 text-tone-emerald'
                : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {hydrated && done[lesson.id] ? 'Đã học' : 'Đánh dấu đã học'}
          </button>
        </div>

        {/* Mục tiêu */}
        <div className="mt-4 rounded-xl border border-violet-500/25 bg-violet-500/10 p-4">
          <p className="flex items-center gap-2 text-tone-violet text-sm font-semibold mb-1.5">
            <Target className="w-4 h-4" />
            Học xong bài này bạn làm được gì
          </p>
          <p className="text-text-primary text-sm leading-relaxed">{lesson.goal}</p>
        </div>

        {/* Các khối giảng */}
        <div className="mt-5 space-y-5">
          {lesson.blocks.map((b, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
              {b.formula && (
                <p className="inline-block text-sm font-mono text-tone-sky bg-sky-500/10 border border-sky-500/25 rounded-lg px-3 py-1.5 mb-3">
                  {b.formula}
                </p>
              )}
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{b.explain}</p>

              <div className="mt-3 space-y-2">
                {b.examples.map((ex, j) => (
                  <div key={j} className="flex items-start gap-2 rounded-lg bg-[var(--bg-surface-hover)] px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm leading-relaxed">{ex.en}</p>
                      {ex.vi && <p className="text-text-secondary text-xs mt-0.5">{ex.vi}</p>}
                    </div>
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(ex.en)}
                        aria-label={`Nghe: ${ex.en}`}
                        className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
                          current === ex.en ? 'bg-violet-500/30 text-tone-violet' : 'text-text-muted hover:text-tone-violet'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {b.mistake && (
                <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/[0.07] p-3">
                  <p className="flex items-center gap-1.5 text-tone-rose text-xs font-semibold mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Lỗi người Việt hay mắc
                  </p>
                  <p className="text-sm text-tone-rose">
                    <span className="text-tone-rose font-mono text-xs mr-1.5">SAI</span>
                    {b.mistake.wrong}
                  </p>
                  <p className="text-sm text-tone-emerald mt-1">
                    <span className="text-tone-emerald font-mono text-xs mr-1.5">ĐÚNG</span>
                    {b.mistake.right}
                  </p>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{b.mistake.why}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Từ khoá của bài */}
        {lesson.keyWords && lesson.keyWords.length > 0 && (
          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <BookMarked className="w-4 h-4 text-tone-sky" />
              Từ cần thuộc ngay
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {lesson.keyWords.map((w, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-semibold">{w.en}</p>
                    <p className="text-tone-violet text-[11px] font-mono">{w.ipa}</p>
                    <p className="text-text-secondary text-xs">{w.vi}</p>
                  </div>
                  {supported && (
                    <button
                      type="button"
                      onClick={() => speak(w.en)}
                      aria-label={`Nghe: ${w.en}`}
                      className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-tone-violet transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bài tập chấm ngay — học xong luyện liền */}
        {d.exercisesByLesson[lesson.id] && (
          <div className="mt-5">
            <ExercisePanel
              items={d.exercisesByLesson[lesson.id]}
              title={`Bài tập bài ${lesson.n}`}
              storageKeyHint={`${d.id}:${lesson.id}`}
            />
          </div>
        )}

        {/* Tự luyện */}
        <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
          <p className="flex items-center gap-2 text-tone-amber text-sm font-semibold mb-2">
            <ListChecks className="w-4 h-4" />
            Tự luyện ngoài trang này
          </p>
          <ul className="space-y-1.5">
            {lesson.practice.map((p, i) => (
              <li key={i} className="text-text-primary text-sm leading-relaxed flex gap-2">
                <span className="text-tone-amber shrink-0">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
