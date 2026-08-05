'use client';

/**
 * Tab Viết — 6 đề, mỗi đề có dàn ý, cụm từ, bài mẫu đạt, bài mẫu kém, lỗi hay mắc.
 *
 * Bài mẫu ĐẠT ẩn mặc định. Nhìn bài mẫu trước khi tự viết thì người học chép ý
 * của bài mẫu và tưởng mình viết được. Bài mẫu KÉM thì để mở sẵn — nhìn cái sai
 * trước khi viết lại có ích, vì phần lớn người học không nhận ra lỗi của chính
 * mình cho tới khi thấy nó trong bài người khác.
 *
 * Có ô nháp đếm từ ngay tại chỗ: thiếu số từ là lỗi mất điểm chắc chắn mà lại
 * dễ tránh nhất.
 */
import { useMemo, useState } from 'react';
import {
  PenLine, Eye, EyeOff, AlertTriangle, ListOrdered, Quote, FileText, Trash2,
} from 'lucide-react';
import type { StageBundle } from './data/bundles';
import FigureView from './FigureView';

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export default function WritingView({ d }: { d: StageBundle }) {
  const WRITINGS = d.writings;
  const [id, setId] = useState(WRITINGS[0].id);
  const [showSample, setShowSample] = useState(false);
  const [draft, setDraft] = useState('');

  const task = WRITINGS.find((w) => w.id === id) ?? WRITINGS[0];
  const words = useMemo(() => countWords(draft), [draft]);
  const enough = words >= task.minWords;


  // Đổi chặng thì về mục đầu — id của chặng cũ không tồn tại ở chặng mới.
  const [owner, setOwner] = useState(d.id);
  if (owner !== d.id) {
    setOwner(d.id);
    setId(WRITINGS[0].id); setShowSample(false); setDraft('');
  }

  return (
    <div>
      {/* Chọn đề */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {WRITINGS.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => { setId(w.id); setShowSample(false); setDraft(''); }}
            className={`shrink-0 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              w.id === id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-bold text-sky-400 mr-1.5">{w.task}</span>
            Đề {i + 1}
          </button>
        ))}
      </div>

      {/* Đề bài */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">{task.task}</span>
          <span className="text-xs text-slate-500">Tối thiểu {task.minWords} từ</span>
          <span className="text-xs text-slate-500">· {task.minutes} phút</span>
        </div>
        <h3 className="text-xl font-bold text-white mt-2">{task.title}</h3>

        {/* Biểu đồ của đề — Task 1 thật luôn có hình, không phải bảng chữ */}
        {task.figure && (
          <div className="mt-4">
            <FigureView figure={task.figure} />
          </div>
        )}

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-white text-sm leading-relaxed whitespace-pre-line font-mono">{task.prompt}</p>
        </div>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{task.promptVi}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Dàn ý */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <ListOrdered className="w-4 h-4 text-sky-400" />
              Dàn ý — viết theo đúng thứ tự này
            </p>
            <div className="space-y-2">
              {task.outline.map((o, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="shrink-0 text-xs font-bold text-sky-300 bg-sky-500/15 rounded px-2 py-0.5 h-fit">
                    {o.part}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1">{o.what}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cụm từ */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Quote className="w-4 h-4 text-violet-400" />
              Cụm từ dùng được ngay
            </p>
            <div className="space-y-1.5">
              {task.phrases.map((p, i) => (
                <div key={i} className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <p className="text-white text-sm">{p.en}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{p.vi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ô nháp đếm từ */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <PenLine className="w-4 h-4 text-emerald-400" />
                Viết nháp tại đây
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  enough ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
                }`}>
                  {words}/{task.minWords} từ
                </span>
                {draft && (
                  <button
                    type="button"
                    onClick={() => setDraft('')}
                    aria-label="Xoá nháp"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              placeholder="Viết bài của bạn ở đây rồi mới mở bài mẫu để so…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400/50 leading-relaxed resize-y"
            />
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Nháp này chỉ nằm trong trình duyệt và mất khi tải lại trang — chép ra chỗ khác nếu muốn giữ.
              Viết xong nhớ soát theo bảng 8 điểm ở bài 39 (tab Bài học).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Bài mẫu đạt */}
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <FileText className="w-4 h-4" />
                Bài mẫu — {task.sample.band}
              </p>
              <button
                type="button"
                onClick={() => setShowSample((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {showSample ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showSample ? 'Ẩn' : 'Hiện bài mẫu'}
              </button>
            </div>
            {showSample ? (
              <>
                <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line">{task.sample.text}</p>
                <p className="mt-3 pt-3 border-t border-emerald-500/20 text-emerald-200/90 text-xs leading-relaxed">
                  <b>Vì sao bài này đạt:</b> {task.sample.note}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed">
                Hãy TỰ VIẾT trước rồi mới mở. Đọc bài mẫu trước thì bạn sẽ chép ý của nó và tưởng mình viết
                được — đây là cách nhanh nhất để mắc kẹt ở band 5.
              </p>
            )}
          </div>

          {/* Bài mẫu kém */}
          {task.weakSample && (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.05] p-4 sm:p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-rose-200 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Bài mẫu KÉM — {task.weakSample.band}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line italic">
                {task.weakSample.text}
              </p>
              <p className="mt-3 pt-3 border-t border-rose-500/20 text-xs text-rose-200/90 font-semibold mb-2">
                Bài này hỏng ở đâu:
              </p>
              <ul className="space-y-1.5">
                {task.weakSample.problems.map((p, i) => (
                  <li key={i} className="text-slate-300 text-xs leading-relaxed flex gap-2">
                    <span className="text-rose-400 shrink-0">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lỗi hay mắc */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Lỗi người Việt hay mắc ở đúng đề này
            </p>
            <div className="space-y-3">
              {task.mistakes.map((m, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm text-rose-200/90">
                    <span className="text-rose-400 font-mono text-xs mr-1.5">SAI</span>
                    {m.wrong}
                  </p>
                  <p className="text-sm text-emerald-200/90 mt-1">
                    <span className="text-emerald-400 font-mono text-xs mr-1.5">ĐÚNG</span>
                    {m.right}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
