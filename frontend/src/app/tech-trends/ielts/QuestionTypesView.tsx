'use client';

/**
 * Tab Dạng câu hỏi — chỉ hiện ở chặng 2 trở đi.
 *
 * Đây là phần lõi của chặng 2 nên nó được đặt ngay sau tab Lộ trình. Bố cục:
 * chiến lược chung ở trên (đọc một lần), rồi 15 dạng ở dưới (mỗi tuần một dạng).
 *
 * Các dạng gập lại mặc định — mở hết ra thì trang dài tới mức không ai đọc,
 * mà cách dùng đúng cũng là mỗi tuần chỉ mở MỘT dạng.
 */
import { useState } from 'react';
import { ChevronDown, AlertTriangle, ListOrdered, Lightbulb, Headphones, FileText } from 'lucide-react';
import type { QuestionTypeGuide } from './data/types';

const HARD_LABEL: Record<1 | 2 | 3, { text: string; cls: string }> = {
  1: { text: 'Dễ', cls: 'bg-emerald-500/20 text-emerald-300' },
  2: { text: 'Vừa', cls: 'bg-amber-500/20 text-amber-300' },
  3: { text: 'Khó', cls: 'bg-rose-500/20 text-rose-300' },
};

export default function QuestionTypesView({
  types, notes,
}: {
  types: QuestionTypeGuide[];
  notes: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ [types[0].id]: true });
  const [skill, setSkill] = useState<'Tất cả' | 'Nghe' | 'Đọc'>('Tất cả');

  const visible = skill === 'Tất cả' ? types : types.filter((t) => t.skill === skill);

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-3">
        Đây là phần <b className="text-slate-200">quan trọng nhất của chặng 2</b>. Người học ở mức này làm sai
        thường không phải vì kém tiếng Anh mà vì không biết dạng câu hỏi đó đòi hỏi gì — làm thêm mười đề nữa
        vẫn sai y hệt. Cách dùng đúng: đọc hết một lượt để biết có những dạng nào, rồi{' '}
        <b className="text-slate-200">mỗi tuần luyện kỹ MỘT dạng</b>.
      </p>

      {/* Chiến lược chung */}
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 sm:p-5 mb-5">
        <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-3">
          <Lightbulb className="w-4 h-4" />
          Chiến lược chung — đọc trước khi vào từng dạng
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.map((n, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-white text-sm font-semibold">{n.title}</p>
              <p className="text-slate-300 text-sm mt-1 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lọc kỹ năng */}
      <div className="flex gap-2 mb-4">
        {(['Tất cả', 'Nghe', 'Đọc'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSkill(s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
              skill === s
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {s === 'Nghe' && <Headphones className="w-4 h-4" />}
            {s === 'Đọc' && <FileText className="w-4 h-4" />}
            {s}
            <span className="text-[10px] text-slate-500">
              ({s === 'Tất cả' ? types.length : types.filter((t) => t.skill === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Danh sách dạng */}
      <div className="space-y-3">
        {visible.map((t) => {
          const isOpen = !!open[t.id];
          const hard = HARD_LABEL[t.hard];
          return (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded ${
                    t.skill === 'Nghe' ? 'bg-violet-500/20 text-violet-300' : 'bg-sky-500/20 text-sky-300'
                  }`}
                >
                  {t.skill}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white leading-snug">{t.name}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{t.nameVi}</p>
                </div>
                <span className={`shrink-0 text-[10px] px-2 py-1 rounded ${hard.cls}`}>{hard.text}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 mt-1 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500 mb-1">Đề trông như thế nào</p>
                      <p className="text-slate-200 text-sm leading-relaxed">{t.looks}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500 mb-1">Gặp bao nhiêu, ở đâu</p>
                      <p className="text-slate-200 text-sm leading-relaxed">{t.frequency}</p>
                    </div>
                  </div>

                  {/* Các bước */}
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
                    <p className="flex items-center gap-2 text-emerald-300 text-sm font-semibold mb-2">
                      <ListOrdered className="w-4 h-4" />
                      Các bước làm — theo đúng thứ tự này
                    </p>
                    <ol className="space-y-1.5">
                      {t.steps.map((s, i) => (
                        <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                          <span className="text-emerald-400 shrink-0 font-semibold">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Bẫy */}
                  <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4">
                    <p className="flex items-center gap-2 text-rose-300 text-sm font-semibold mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Bẫy riêng của dạng này
                    </p>
                    <ul className="space-y-1.5">
                      {t.traps.map((x, i) => (
                        <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                          <span className="text-rose-400 shrink-0">→</span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ví dụ */}
                  {t.example && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-slate-500 mb-2">Ví dụ minh hoạ</p>
                      <p className="text-slate-200 text-sm leading-relaxed">{t.example.q}</p>
                      <p className="text-emerald-300 text-sm mt-2">
                        Đáp án: <b>{t.example.answer}</b>
                      </p>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t.example.why}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
