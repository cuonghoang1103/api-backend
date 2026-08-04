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
import { UNITS, KEYS, EXERCISES_BY_LESSON } from './data/stage1';
import ExercisePanel from './ExercisePanel';

export default function LessonsView({
  speak, current, supported,
}: {
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const [unitId, setUnitId] = useState(UNITS[0].id);
  const [lessonId, setLessonId] = useState(UNITS[0].lessons[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(KEYS.lessonDone);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn — vẫn học được, chỉ không nhớ tiến độ */
    }
  }, []);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(KEYS.lessonDone, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, []);

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
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Bài đã học</span>
            <span>{doneCount}/40</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(doneCount / 40) * 100}%` }}
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
                  ? 'bg-sky-500/20 border-sky-400/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{u.icon}</span>
              <span className="whitespace-nowrap">{u.title.split(' — ')[0]}</span>
              <span className={`text-[10px] px-1.5 rounded ${uDone === u.lessons.length ? 'bg-emerald-500/25 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>
                {uDone}/{u.lessons.length}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-400 mb-4">{unit.subtitle}</p>

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
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                <span className="text-[10px] font-bold text-sky-400">Bài {l.n}</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">{l.title}</p>
            </button>
          );
        })}
      </div>

      {/* Nội dung bài */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
              Bài {lesson.n}/40
            </span>
            <h3 className="text-xl font-bold text-white mt-2">{lesson.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => toggleDone(lesson.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
              hydrated && done[lesson.id]
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {hydrated && done[lesson.id] ? 'Đã học' : 'Đánh dấu đã học'}
          </button>
        </div>

        {/* Mục tiêu */}
        <div className="mt-4 rounded-xl border border-violet-500/25 bg-violet-500/10 p-4">
          <p className="flex items-center gap-2 text-violet-300 text-sm font-semibold mb-1.5">
            <Target className="w-4 h-4" />
            Học xong bài này bạn làm được gì
          </p>
          <p className="text-slate-200 text-sm leading-relaxed">{lesson.goal}</p>
        </div>

        {/* Các khối giảng */}
        <div className="mt-5 space-y-5">
          {lesson.blocks.map((b, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              {b.formula && (
                <p className="inline-block text-sm font-mono text-sky-300 bg-sky-500/10 border border-sky-500/25 rounded-lg px-3 py-1.5 mb-3">
                  {b.formula}
                </p>
              )}
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{b.explain}</p>

              <div className="mt-3 space-y-2">
                {b.examples.map((ex, j) => (
                  <div key={j} className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm leading-relaxed">{ex.en}</p>
                      {ex.vi && <p className="text-slate-400 text-xs mt-0.5">{ex.vi}</p>}
                    </div>
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(ex.en)}
                        aria-label={`Nghe: ${ex.en}`}
                        className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
                          current === ex.en ? 'bg-violet-500/30 text-violet-300' : 'text-slate-500 hover:text-violet-300'
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
                  <p className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Lỗi người Việt hay mắc
                  </p>
                  <p className="text-sm text-rose-200/90">
                    <span className="text-rose-400 font-mono text-xs mr-1.5">SAI</span>
                    {b.mistake.wrong}
                  </p>
                  <p className="text-sm text-emerald-200/90 mt-1">
                    <span className="text-emerald-400 font-mono text-xs mr-1.5">ĐÚNG</span>
                    {b.mistake.right}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{b.mistake.why}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Từ khoá của bài */}
        {lesson.keyWords && lesson.keyWords.length > 0 && (
          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <BookMarked className="w-4 h-4 text-sky-400" />
              Từ cần thuộc ngay
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {lesson.keyWords.map((w, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{w.en}</p>
                    <p className="text-violet-300/70 text-[11px] font-mono">{w.ipa}</p>
                    <p className="text-slate-400 text-xs">{w.vi}</p>
                  </div>
                  {supported && (
                    <button
                      type="button"
                      onClick={() => speak(w.en)}
                      aria-label={`Nghe: ${w.en}`}
                      className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-violet-300 transition-colors"
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
        {EXERCISES_BY_LESSON[lesson.id] && (
          <div className="mt-5">
            <ExercisePanel
              items={EXERCISES_BY_LESSON[lesson.id]}
              title={`Bài tập bài ${lesson.n}`}
              storageKeyHint={lesson.id}
            />
          </div>
        )}

        {/* Tự luyện */}
        <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
          <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
            <ListChecks className="w-4 h-4" />
            Tự luyện ngoài trang này
          </p>
          <ul className="space-y-1.5">
            {lesson.practice.map((p, i) => (
              <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                <span className="text-amber-400 shrink-0">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
