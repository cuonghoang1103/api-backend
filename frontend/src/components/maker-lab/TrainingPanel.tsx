'use client';

/**
 * ============================================================
 * Maker Lab — dạy robot nói giống bạn
 * ============================================================
 *
 * Robot hỏi, bạn trả lời, câu trả lời đi thẳng vào prompt của nó.
 *
 * Vì sao là HỎI–ĐÁP chứ không phải một ô văn bản trống: đưa ai đó một
 * ô trống và bảo "tả tính cách của bạn đi" thì họ viết ra một bản mô
 * tả — trung tính, chung chung, vô dụng với model. Hỏi "bạn cà khịa
 * bạn bè kiểu gì, cho một câu thật" thì họ viết ra đúng một câu họ hay
 * nói. Câu đó mới dùng được.
 *
 * Mỗi câu hỏi có gợi ý riêng, và gợi ý quyết định chất lượng đầu vào
 * nhiều hơn cả câu hỏi.
 */

import { useEffect, useState } from 'react';
import { GraduationCap, Check, Loader2, Trash2, Sparkles } from 'lucide-react';
import { getTraining, saveTrainingAnswer, type TrainingState } from '@/lib/maker-lab-api';

interface Props {
  projectId: number;
  accent: string;
}

export default function TrainingPanel({ projectId, accent }: Props) {
  const [state, setState] = useState<TrainingState | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const s = await getTraining(projectId);
        setState(s);
        const d: Record<string, string> = {};
        for (const k of s?.knowledge ?? []) d[k.q] = k.a;
        setDrafts(d);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Không tải được');
      }
    })();
  }, [projectId]);

  async function save(question: string, answer: string) {
    setSaving(question);
    setErr(null);
    try {
      const knowledge = await saveTrainingAnswer(projectId, question, answer);
      setState((s) => (s ? { ...s, knowledge, progress: { ...s.progress, answered: knowledge.length } } : s));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(null);
    }
  }

  if (err && !state)
    return (
      <p className="text-sm" style={{ color: '#ef4444' }}>
        {err} — cần đăng nhập để dùng phần này.
      </p>
    );
  if (!state)
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
      </div>
    );

  const answered = state.knowledge.length;
  const groups = [...new Set(state.questions.map((q) => q.group))];

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="flex items-center gap-2 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <GraduationCap className="h-5 w-5" style={{ color: accent }} />
          Dạy robot nói giống bạn
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Trả lời bằng <strong>đúng chữ bạn hay dùng</strong>, kể cả nói trống không hay
          cộc lốc — càng giống lời nói thật càng tốt. Robot đọc những câu này trước mỗi
          lần trả lời, nên nó sẽ biết bạn là ai và bắt chước cách bạn nói. Trả lời được
          câu nào hay câu đó, không cần làm hết một lượt.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (answered / state.questions.length) * 100)}%`,
                background: accent,
              }}
            />
          </div>
          <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
            {answered}/{state.questions.length}
          </span>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g}>
          <h4
            className="mb-3 text-sm font-semibold uppercase tracking-wide"
            style={{ color: accent }}
          >
            {g}
          </h4>
          <div className="space-y-3">
            {state.questions
              .filter((q) => q.group === g)
              .map((q) => {
                const done = state.knowledge.some((k) => k.q === q.q);
                const val = drafts[q.q] ?? '';
                const changed = val !== (state.knowledge.find((k) => k.q === q.q)?.a ?? '');
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: done ? `${accent}66` : 'var(--border-color)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {done && <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />}
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {q.q}
                        </p>
                        <p className="mt-1 text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                          {q.hint}
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={val}
                      onChange={(e) => setDrafts({ ...drafts, [q.q]: e.target.value })}
                      rows={2}
                      placeholder="Trả lời như bạn đang nói với bạn bè…"
                      className="mt-3 w-full rounded-lg border p-2.5 text-sm"
                      style={{
                        borderColor: 'var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                      }}
                    />

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => save(q.q, val)}
                        disabled={!changed || saving === q.q}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition disabled:opacity-40"
                        style={{ background: accent }}
                      >
                        {saving === q.q ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        Dạy
                      </button>
                      {done && (
                        <button
                          type="button"
                          onClick={() => {
                            setDrafts({ ...drafts, [q.q]: '' });
                            void save(q.q, '');
                          }}
                          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition"
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Quên đi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}

      {err && (
        <p className="text-sm" style={{ color: '#ef4444' }}>
          {err}
        </p>
      )}

      <p
        className="rounded-lg p-3 text-xs leading-relaxed"
        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
      >
        Mỗi câu bạn dạy là chữ robot phải đọc lại trước <em>mọi</em> câu trả lời sau đó —
        nên dạy nhiều thì nó hiểu bạn hơn nhưng cũng nghĩ chậm hơn một chút. Trần là 40
        mục. Muốn robot đổi giọng chứ không phải đổi hiểu biết thì sửa ở tab Tính cách,
        mục Mẫu đối thoại.
      </p>
    </div>
  );
}
