'use client';

/**
 * Tab Đời sống & Việc làm.
 *
 * Mỗi tình huống mở đầu bằng hai câu: "khi nào bạn cần tới nó" và "nó nối vào
 * phần nào của kỳ thi". Câu thứ hai quan trọng hơn vẻ ngoài — không có nó thì
 * người học đang ôn thi sẽ bỏ qua cả tab này vì tưởng là học lệch.
 */
import { useState } from 'react';
import { Volume2, Lightbulb, Target, GraduationCap, Quote } from 'lucide-react';
import { LIFE } from './data/stage1';
import ExercisePanel from './ExercisePanel';

const GROUPS = ['Tất cả', 'Đời sống', 'Công việc', 'Lập trình viên'] as const;

export default function LifeView({
  speak, current, supported,
}: {
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>('Tất cả');
  const [id, setId] = useState(LIFE[0].id);

  const visible = group === 'Tất cả' ? LIFE : LIFE.filter((l) => l.group === group);
  const s = LIFE.find((l) => l.id === id) ?? LIFE[0];

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        Phần lớn người học bỏ cuộc không phải vì khó, mà vì không thấy tiếng Anh dùng được vào đâu.
        Mỗi tình huống dưới đây là việc bạn có thể gặp ngay trong tháng tới — mà từ vựng thì dùng lại
        được cho kỳ thi, nên không hề học lệch.
      </p>

      {/* Lọc nhóm */}
      <div className="flex gap-2 flex-wrap mb-3">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setGroup(g);
              const first = g === 'Tất cả' ? LIFE[0] : LIFE.find((l) => l.group === g);
              if (first) setId(first.id);
            }}
            className={`px-3 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
              group === g
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Chọn tình huống */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {visible.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setId(l.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              l.id === id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>{l.icon}</span>
            {l.titleVi}
          </button>
        ))}
      </div>

      {/* Đầu tình huống */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">{s.group}</span>
        </div>
        <h3 className="text-xl font-bold text-white mt-2">{s.title}</h3>
        <p className="text-slate-400 text-sm mt-0.5">{s.titleVi}</p>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-xl border border-violet-500/25 bg-violet-500/[0.08] p-3">
            <p className="flex items-center gap-1.5 text-violet-300 text-xs font-semibold mb-1">
              <Target className="w-3.5 h-3.5" />
              Khi nào bạn cần tới
            </p>
            <p className="text-slate-200 text-sm leading-relaxed">{s.when}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] p-3">
            <p className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Nối vào phần nào của kỳ thi
            </p>
            <p className="text-slate-200 text-sm leading-relaxed">{s.examLink}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Hội thoại */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-sm font-semibold text-white mb-3">Hội thoại mẫu</p>
          <div className="space-y-2">
            {s.dialogue.map((d, i) => {
              const isYou = d.who === 'Bạn';
              return (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2.5 ${
                    isYou ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-white/[0.03] border border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[10px] uppercase tracking-wide ${isYou ? 'text-sky-300' : 'text-slate-500'}`}>
                      {d.who}
                    </p>
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(d.en)}
                        aria-label={`Nghe: ${d.en}`}
                        className={`shrink-0 p-1 rounded transition-all active:scale-90 ${
                          current === d.en ? 'bg-violet-500/30 text-violet-300' : 'text-slate-600 hover:text-violet-300'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-100 text-sm leading-relaxed mt-0.5">{d.en}</p>
                  <p className="text-slate-500 text-xs mt-1">{d.vi}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Cụm từ */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Quote className="w-4 h-4 text-violet-400" />
              Câu dùng được ngay
            </p>
            <div className="space-y-2">
              {s.phrases.map((p, i) => (
                <div key={i} className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white text-sm leading-relaxed">{p.en}</p>
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(p.en)}
                        aria-label={`Nghe: ${p.en}`}
                        className={`shrink-0 p-1 rounded transition-all active:scale-90 ${
                          current === p.en ? 'bg-violet-500/30 text-violet-300' : 'text-slate-600 hover:text-violet-300'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{p.vi}</p>
                  {p.note && (
                    <p className="text-amber-300/80 text-xs mt-1.5 flex items-start gap-1.5">
                      <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{p.note}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo */}
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
              <Lightbulb className="w-4 h-4" />
              Mẹo dùng cho đúng
            </p>
            <ul className="space-y-2">
              {s.tips.map((t, i) => (
                <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                  <span className="text-amber-400 shrink-0">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bài tập áp dụng */}
      <div className="mt-4">
        <ExercisePanel items={s.items} title="Bài tập áp dụng" storageKeyHint={s.id} />
      </div>
    </div>
  );
}
