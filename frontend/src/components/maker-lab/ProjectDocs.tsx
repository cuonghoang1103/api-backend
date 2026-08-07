'use client';

/**
 * Maker Lab — build diary + personality config.
 *
 * The persona panel is read-only here on purpose: it shows what makes
 * the robot sound like you and how to swap in a cloned voice, but the
 * editing lives behind the admin API. A page anyone can open should
 * not let a visitor rewrite what your robot says.
 */

import { Mic2, MessageSquare, ScrollText, Sliders } from 'lucide-react';
import type { MakerProjectDetail } from '@/types/maker-lab';

const TRAIT_LABEL: Record<string, [string, string]> = {
  humor: ['nghiêm túc', 'hay đùa'],
  formality: ['suồng sã', 'trang trọng'],
  verbosity: ['cực ngắn', 'thích giải thích'],
  warmth: ['lạnh lùng', 'ấm áp'],
  curiosity: ['ít hỏi lại', 'hay hỏi ngược'],
  energy: ['điềm đạm', 'hoạt bát'],
};

const CLONE_STEPS = [
  'Thu 3–5 phút giọng của bạn: đọc rõ, phòng yên, một micro duy nhất, không nhạc nền.',
  'Lên elevenlabs.io → Voices → Add Voice → Instant Voice Cloning → tải file lên.',
  'Sao chép Voice ID mà nó sinh ra.',
  'Thêm vào /opt/cuonghoangdev/.env trên VPS: MAKERLAB_TTS_PROVIDER=elevenlabs, ELEVENLABS_API_KEY=…, MAKERLAB_TTS_VOICE=<voice id>',
  'Khởi động lại container backend. Không build lại, không sửa một dòng code nào.',
];

export function ProjectDocs({ project }: { project: MakerProjectDetail }) {
  const p = project.persona;

  return (
    <div className="space-y-8">
      {/* ── Personality ── */}
      {p && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            <Sliders size={17} /> Tính cách
          </h2>

          <div
            className="rounded-xl border p-4"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <Field label="Tên" value={p.name} />
              <Field label="Giọng" value={`${p.voiceProvider}${p.voiceId ? ` · ${p.voiceId}` : ''}`} />
              <Field label="Ngôn ngữ" value={p.language} />
              {p.wakeWord && <Field label="Từ đánh thức" value={`"${p.wakeWord}"`} />}
              <Field label="Nhiệt độ" value={String(p.temperature)} />
            </div>

            {p.traits && (
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {Object.entries(TRAIT_LABEL).map(([key, [lo, hi]]) => {
                  const v = (p.traits as Record<string, unknown>)[key];
                  if (typeof v !== 'number') return null;
                  return (
                    <div key={key} className="flex items-center gap-3 text-xs">
                      <span className="w-20 shrink-0 text-right" style={{ color: 'var(--text-muted)' }}>
                        {lo}
                      </span>
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className="h-1.5 flex-1 rounded-full"
                            style={{
                              background: n <= v ? 'var(--accent-color)' : 'var(--bg-surface)',
                            }}
                          />
                        ))}
                      </div>
                      <span className="w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {hi}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <details>
              <summary className="cursor-pointer text-xs font-medium" style={{ color: 'var(--accent-color)' }}>
                Xem system prompt đầy đủ
              </summary>
              <pre
                className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg p-3 text-[12px] leading-relaxed"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
              >
                {p.systemPrompt}
              </pre>
            </details>
          </div>

          {/* Few-shot examples */}
          {p.sampleDialogues?.length ? (
            <div className="mt-4">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare size={14} /> Ví dụ mẫu
              </h3>
              <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                Bốn đoạn hội thoại này định hình giọng điệu tốt hơn mọi tính từ trong prompt — bảo
                mô hình &quot;hãy hài hước&quot; thì nó diễn vai hài hước; cho nó xem thì nó nói đúng giọng.
              </p>
              <div className="space-y-2">
                {p.sampleDialogues.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border p-3 text-sm"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
                  >
                    <p style={{ color: 'var(--text-muted)' }}>— {d.user}</p>
                    <p className="mt-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                      — {d.bot}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Voice cloning */}
          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Mic2 size={14} /> Đổi sang giọng của chính bạn
            </h3>
            <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              Lớp TTS đã tách provider từ đầu, nên việc này không đụng tới code:
            </p>
            <ol className="space-y-1.5">
              {CLONE_STEPS.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Build log ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          <ScrollText size={17} /> Nhật ký làm
        </h2>
        {!project.buildLog?.length ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Chưa có ghi chép nào.
          </p>
        ) : (
          <div className="space-y-3">
            {project.buildLog.map((e, i) => (
              <article
                key={i}
                className="rounded-xl border p-4"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              >
                <div className="mb-1.5 flex items-baseline gap-3">
                  <time className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {e.date}
                  </time>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {e.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {e.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </span>
  );
}
