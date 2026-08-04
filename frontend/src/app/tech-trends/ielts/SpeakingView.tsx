'use client';

/**
 * Tab Nói — Part 1 và Part 2, mỗi câu bày CÂU CỤT cạnh CÂU ĐỦ.
 *
 * Đây là cách bày quan trọng nhất của tab này. Người mới học gần như luôn trả
 * lời đúng ngữ pháp nhưng quá ngắn, rồi không hiểu vì sao điểm thấp. Đặt hai
 * câu cạnh nhau thì khoảng cách hiện ra ngay mà không cần giảng.
 *
 * Câu cụt cố ý KHÔNG có nút loa: mục tiêu là bỏ cách nói đó đi, không phải học
 * thuộc nó.
 */
import { useState } from 'react';
import { Volume2, Mic, Lightbulb, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { StageBundle } from './data/bundles';

export default function SpeakingView({
  d, speak, current, supported,
}: {
  d: StageBundle;
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const SPEAKINGS = d.speakings;
  const SPEAKING_RULES = d.speakingRules;
  const [id, setId] = useState(SPEAKINGS[0].id);
  const topic = SPEAKINGS.find((t) => t.id === id) ?? SPEAKINGS[0];


  // Đổi chặng thì về mục đầu — id của chặng cũ không tồn tại ở chặng mới.
  const [owner, setOwner] = useState(d.id);
  if (owner !== d.id) {
    setOwner(d.id);
    setId(SPEAKINGS[0].id);
  }

  return (
    <div>
      {/* Bốn quy tắc chung */}
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {SPEAKING_RULES.map((r, i) => (
          <div key={i} className="rounded-xl border border-violet-500/25 bg-violet-500/[0.07] p-4">
            <p className="flex items-start gap-2 text-violet-200 text-sm font-semibold">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              {r.title}
            </p>
            <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Chọn chủ đề */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {SPEAKINGS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setId(t.id)}
            className={`shrink-0 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              t.id === id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-bold text-sky-400 mr-1.5">{t.part}</span>
            {t.titleVi}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">{topic.part}</span>
          <span className="text-xs text-slate-500">{topic.questions.length} câu</span>
        </div>
        <h3 className="text-xl font-bold text-white mt-2">{topic.title}</h3>
        <p className="text-slate-400 text-sm mt-0.5">{topic.titleVi}</p>

        {topic.phrases && topic.phrases.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-2">Cụm mở câu dùng cho cả chủ đề</p>
            <div className="flex flex-wrap gap-2">
              {topic.phrases.map((p, i) => (
                <span
                  key={i}
                  className="text-xs rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
                >
                  <b className="text-white">{p.en}</b>
                  <span className="text-slate-500 ml-1.5">{p.vi}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Các câu hỏi */}
      <div className="space-y-4">
        {topic.questions.map((q, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {/* Câu hỏi */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-xs font-bold text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded">
                  HỎI
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white leading-relaxed">{q.q}</p>
                  <p className="text-slate-400 text-sm mt-1">{q.qVi}</p>
                </div>
                {supported && (
                  <button
                    type="button"
                    onClick={() => speak(q.q)}
                    aria-label={`Nghe câu hỏi: ${q.q}`}
                    className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
                      current === q.q ? 'bg-violet-500/30 text-violet-300' : 'text-slate-500 hover:text-violet-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Câu cụt */}
            <div className="p-4 border-b border-white/10 bg-rose-500/[0.05]">
              <p className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold mb-1.5">
                <ThumbsDown className="w-3.5 h-3.5" />
                Trả lời kiểu này thì mất điểm
              </p>
              <p className="text-slate-300 text-sm leading-relaxed italic whitespace-pre-line">{q.weak}</p>
            </div>

            {/* Câu đủ */}
            <div className="p-4 bg-emerald-500/[0.05]">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Trả lời như thế này
                </p>
                {supported && (
                  <button
                    type="button"
                    onClick={() => speak(q.good)}
                    aria-label="Nghe câu trả lời mẫu"
                    className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
                      current === q.good ? 'bg-violet-500/30 text-violet-300' : 'text-slate-500 hover:text-violet-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line">{q.good}</p>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed whitespace-pre-line">{q.goodVi}</p>
              <p className="mt-3 pt-3 border-t border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
                <b>Vì sao câu sau ăn điểm hơn:</b> {q.why}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
          <Mic className="w-4 h-4" />
          Cách luyện với những câu này
        </p>
        <ol className="space-y-1.5">
          {[
            'Đọc câu hỏi, TỰ trả lời trước khi nhìn câu mẫu. Bấm loa nghe câu hỏi để quen với ngữ điệu người hỏi.',
            'So câu của bạn với câu mẫu: bạn thiếu lớp nào — lý do hay ví dụ?',
            'Viết lại câu trả lời của RIÊNG bạn (thông tin thật của bạn), đừng học thuộc câu mẫu. Giám khảo nhận ra câu học thuộc rất nhanh.',
            'Thu âm, nghe lại, đếm số lần dừng quá 3 giây. Lặp cho tới khi dừng dưới 3 lần.',
          ].map((s, i) => (
            <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
              <span className="text-amber-400 shrink-0">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
