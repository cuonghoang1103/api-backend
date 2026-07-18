'use client';
/**
 * My Language — Hội thoại AI (role-play chat). Pro/Max.
 * Pick a scenario → chat with the AI (in character) by typing or speaking.
 * Each AI line: target language + Vietnamese translation + a gentle correction
 * of the learner's last message. Voice input via Groq STT (/ai/stt).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bot, Send, Mic, Square, Loader2, Languages, RotateCcw, AlertTriangle } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import { SectionShell, SpeakerButton } from '@/components/language/primitives';
import { usePro } from '@/hooks/usePro';
import { useSpeech } from '@/hooks/useSpeech';
import type { VocabLang } from '@/lib/notesTts';

function speakLang(code: string): VocabLang | undefined {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'ja-JP';
  if (c === 'zh') return 'zh-CN';
  if (c === 'en') return 'en-US';
  return undefined;
}

const SCENARIOS = [
  { emoji: '🍜', label: 'Gọi món ở nhà hàng', value: 'Gọi món ăn tại nhà hàng — AI đóng vai nhân viên phục vụ.' },
  { emoji: '🧭', label: 'Hỏi đường', value: 'Hỏi đường đến một địa điểm — AI đóng vai người dân địa phương.' },
  { emoji: '🏨', label: 'Nhận phòng khách sạn', value: 'Nhận phòng (check-in) khách sạn — AI đóng vai lễ tân.' },
  { emoji: '💼', label: 'Phỏng vấn xin việc', value: 'Phỏng vấn xin việc — AI đóng vai nhà tuyển dụng.' },
  { emoji: '🛍️', label: 'Mua sắm', value: 'Mua sắm ở cửa hàng — AI đóng vai người bán hàng.' },
  { emoji: '👋', label: 'Làm quen bạn mới', value: 'Làm quen một người bạn mới — AI đóng vai người bạn đó.' },
];

type Turn = { role: 'user' | 'assistant'; content: string; translation?: string; correction?: string };

export default function RolePlayPage() {
  const code = String(useParams().code);
  const router = useRouter();
  const { isPro } = usePro();
  const { startRecording, stopRecording, recording, recordSupported } = useSpeech();

  const [scenario, setScenario] = useState<string>('');
  const [custom, setCustom] = useState('');
  const [started, setStarted] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrans, setShowTrans] = useState<Record<number, boolean>>({});
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const forceLang = speakLang(code);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, sending]);

  useEffect(() => () => { if (autoStop.current) clearTimeout(autoStop.current); }, []);

  // Send one turn. `userMsg` empty = request the opener.
  const send = useCallback(async (sc: string, userMsg: string, history: Turn[]) => {
    setSending(true);
    setError(null);
    try {
      const r = await languageApi.rolePlayTurn({
        languageCode: code,
        scenario: sc,
        history: history.map((t) => ({ role: t.role, content: t.content })),
        message: userMsg,
      });
      const reply = r.data.data;
      if (!reply) throw new Error('empty');
      setTurns((prev) => {
        const next = [...prev];
        // Attach the correction to the learner's last message.
        if (userMsg && reply.correction) {
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === 'user') { next[i] = { ...next[i], correction: reply.correction }; break; }
          }
        }
        next.push({ role: 'assistant', content: reply.reply, translation: reply.translation });
        return next;
      });
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không gửi được, thử lại sau.';
      setError(msg);
    } finally {
      setSending(false);
    }
  }, [code]);

  const begin = () => {
    if (!isPro) { router.push('/pro'); return; }
    const sc = (custom.trim() || scenario).trim();
    if (!sc) return;
    setScenario(sc);
    setStarted(true);
    setTurns([]);
    setShowTrans({});
    void send(sc, '', []);
  };

  const submitMsg = () => {
    if (!isPro) { router.push('/pro'); return; }
    const msg = input.trim();
    if (!msg || sending) return;
    const history = turns;
    setTurns((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    void send(scenario, msg, history);
  };

  const toggleMic = () => {
    if (recording) { stopRecording(); return; }
    if (!isPro) { router.push('/pro'); return; }
    void startRecording(async (blob) => {
      if (autoStop.current) { clearTimeout(autoStop.current); autoStop.current = null; }
      if (!blob) { setError('Không ghi âm được — micro bị chặn?'); return; }
      setTranscribing(true);
      try {
        const r = await languageApi.transcribe({ audio: blob, languageCode: code });
        const txt = (r.data.data?.text || '').trim();
        if (txt) setInput((p) => (p.trim() ? p.trimEnd() + ' ' : '') + txt);
      } catch {
        setError('Không nhận dạng được giọng nói.');
      } finally {
        setTranscribing(false);
      }
    });
    autoStop.current = setTimeout(() => stopRecording(), 15_000);
  };

  const restart = () => {
    setStarted(false);
    setTurns([]);
    setInput('');
    setError(null);
  };

  return (
    <SectionShell code={code} title="Hội thoại AI" icon={<Bot className="text-neon-cyan" />}>
      <div className="mx-auto max-w-2xl">
        {!started ? (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">Chọn tình huống rồi trò chuyện với AI (đóng vai). Bạn có thể gõ hoặc nói.</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => { setScenario(s.value); setCustom(''); }}
                  className={`flex flex-col items-start gap-1 rounded-2xl p-3 text-left ring-1 transition ${
                    scenario === s.value && !custom.trim()
                      ? 'bg-neon-violet/15 ring-neon-violet/40'
                      : 'bg-[var(--bg-surface)] ring-[var(--border-color)] hover:ring-neon-violet/30'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-sm font-medium text-text-primary">{s.label}</span>
                </button>
              ))}
            </div>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="…hoặc tự nhập tình huống"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/60"
            />
            <button
              type="button"
              onClick={begin}
              disabled={!custom.trim() && !scenario}
              className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              <Bot size={16} /> Bắt đầu
              {!isPro && <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none">Pro</span>}
            </button>
          </div>
        ) : (
          <div className="flex h-[calc(100dvh-220px)] min-h-[420px] flex-col">
            {/* Scenario bar */}
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] px-3 py-2 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
              <Bot size={16} className="shrink-0 text-neon-cyan" />
              <p className="min-w-0 flex-1 truncate text-xs text-text-secondary">{scenario}</p>
              <button type="button" onClick={restart} title="Đổi tình huống" className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-neon-violet">
                <RotateCcw size={13} /> Đổi
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-0.5 py-2">
              {turns.map((t, i) => (
                <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 ring-1 ${
                    t.role === 'user'
                      ? 'rounded-tr-sm bg-neon-violet/20 ring-neon-violet/30'
                      : 'rounded-tl-sm bg-[var(--bg-surface)] ring-[var(--border-color)]'
                  }`}>
                    <p className="break-words text-sm text-text-primary">{t.content}</p>
                    {t.role === 'assistant' && (
                      <div className="mt-1 flex items-center gap-1">
                        <SpeakerButton text={t.content} forceLang={forceLang} size={14} className="h-6 w-6" rate={0.9} />
                        {t.translation && (
                          <button type="button" onClick={() => setShowTrans((s) => ({ ...s, [i]: !s[i] }))} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-text-muted hover:text-neon-violet">
                            <Languages size={12} /> {showTrans[i] ? 'Ẩn' : 'Dịch'}
                          </button>
                        )}
                      </div>
                    )}
                    {t.role === 'assistant' && showTrans[i] && t.translation && (
                      <p className="mt-1 border-t border-[var(--border-color)] pt-1 text-xs text-text-secondary">{t.translation}</p>
                    )}
                  </div>
                  {t.role === 'user' && t.correction && (
                    <p className="mt-1 max-w-[85%] rounded-xl bg-neon-orange/10 px-2.5 py-1.5 text-[11px] text-neon-orange ring-1 ring-neon-orange/25">
                      ✏️ {t.correction}
                    </p>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Loader2 size={16} className="animate-spin text-neon-cyan" /> AI đang trả lời…
                </div>
              )}
            </div>

            {error && (
              <div className="mb-2 flex items-start gap-2 rounded-xl bg-neon-orange/10 p-2.5 text-neon-orange ring-1 ring-neon-orange/30">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p className="text-xs">{error}</p>
              </div>
            )}

            {/* Input bar */}
            <div className="flex items-end gap-2 pt-1">
              {recordSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={transcribing || sending}
                  title={recording ? 'Dừng' : 'Nói'}
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition disabled:opacity-50 ${
                    recording ? 'animate-pulse bg-neon-pink/20 text-neon-pink ring-neon-pink/40' : 'bg-[var(--bg-surface)] text-neon-violet ring-[var(--border-color)] hover:ring-neon-violet/40'
                  }`}
                >
                  {transcribing ? <Loader2 size={18} className="animate-spin" /> : recording ? <Square size={18} /> : <Mic size={18} />}
                </button>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMsg(); } }}
                placeholder="Nhập câu trả lời…"
                rows={1}
                className="max-h-32 min-h-[40px] flex-1 resize-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-neon-violet/60"
              />
              <button
                type="button"
                onClick={submitMsg}
                disabled={!input.trim() || sending}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-violet text-white transition hover:opacity-90 disabled:opacity-40"
                aria-label="Gửi"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
