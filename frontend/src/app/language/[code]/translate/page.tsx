'use client';
/**
 * My Language — Dịch văn bản (AI translation, VI ⇄ target). Pro/Max.
 * Not a black-box translator: alongside the translation it returns the reading
 * (romaji/pinyin), a literal gloss, grammar notes and alternative phrasings, so
 * the learner can see WHY it reads that way.
 */
import { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Languages, Sparkles, Loader2, AlertTriangle, BookmarkPlus, Check, ArrowLeftRight, Copy, Mic, Square } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type TranslateResult } from '@/lib/language-api';
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

const LANG_LABEL: Record<string, string> = { ja: 'Tiếng Nhật', zh: 'Tiếng Trung', en: 'Tiếng Anh', ko: 'Tiếng Hàn', fr: 'Tiếng Pháp' };

const TONES = [
  { key: '', label: 'Tự nhiên' },
  { key: 'trang trọng, lịch sự', label: 'Trang trọng' },
  { key: 'thân mật, đời thường', label: 'Thân mật' },
  { key: 'ngắn gọn, súc tích', label: 'Ngắn gọn' },
  { key: 'văn phong email công việc', label: 'Email công việc' },
];

export default function TranslatePage() {
  const code = String(useParams().code);
  const router = useRouter();
  const { isPro } = usePro();
  const { startRecording, stopRecording, recording, recordSupported } = useSpeech();
  const [direction, setDirection] = useState<'to' | 'from'>('to');
  const [tone, setTone] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [saved, setSaved] = useState(false);
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (autoStop.current) clearTimeout(autoStop.current); }, []);

  const target = LANG_LABEL[code.toLowerCase()] || 'ngôn ngữ đang học';
  const forceLang = speakLang(code);
  // TTS only covers the target languages (VocabLang has no vi-VN), so the
  // speaker only appears when the output IS the target language.
  const outLang = direction === 'to' ? forceLang : undefined;
  const canSpeak = direction === 'to' && !!forceLang;
  const srcLabel = direction === 'to' ? 'Tiếng Việt' : target;
  const dstLabel = direction === 'to' ? target : 'Tiếng Việt';

  const swap = () => {
    setDirection((d) => (d === 'to' ? 'from' : 'to'));
    // Chained translations are the common case: feed the result back in.
    if (result?.translation) setText(result.translation);
    setResult(null);
    setError(null);
    setSaved(false);
  };

  const toggleMic = async () => {
    if (recording) { stopRecording(); return; }
    if (!isPro) { router.push('/pro'); return; }
    startRecording(async (blob) => {
      if (autoStop.current) clearTimeout(autoStop.current);
      if (!blob) return;
      setTranscribing(true);
      try {
        const r = await languageApi.transcribe({ audio: blob, languageCode: direction === 'to' ? 'vi' : code });
        const said = r.data.data?.text?.trim();
        if (said) setText((t) => (t ? `${t} ${said}` : said));
      } catch {
        toast.error('Không nhận dạng được giọng nói.');
      } finally {
        setTranscribing(false);
      }
    });
    autoStop.current = setTimeout(() => stopRecording(), 15_000);
  };

  const run = async () => {
    if (!isPro) { router.push('/pro'); return; }
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const r = await languageApi.translate({ languageCode: code, text, direction, tone: tone || undefined });
      setResult(r.data.data ?? null);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không dịch được, thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (s: string) => {
    try {
      await navigator.clipboard.writeText(s);
      toast.success('Đã sao chép');
    } catch {
      toast.error('Không sao chép được.');
    }
  };

  const saveToNotebook = async () => {
    if (!result || saved) return;
    const body = [
      `### ${srcLabel}\n${text.trim()}`,
      `### ${dstLabel}\n${result.translation}${result.reading ? `\n\n*${result.reading}*` : ''}`,
      result.literal ? `**Nghĩa sát:** ${result.literal}` : '',
      result.notes ? `### Ghi chú\n${result.notes}` : '',
      result.alternatives.length
        ? `### Cách nói khác\n${result.alternatives.map((a) => `- ${a.text}${a.note ? ` — ${a.note}` : ''}`).join('\n')}`
        : '',
    ].filter(Boolean).join('\n\n');
    try {
      await notebookApi.save({ code, title: text.trim().slice(0, 60) || 'Bản dịch', kind: 'translate', body });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được.');
    }
  };

  return (
    <SectionShell code={code} title="Dịch văn bản" icon={<Languages className="text-neon-blue" />}>
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-text-muted">
          Dịch hai chiều chuẩn ngữ pháp — kèm phiên âm, nghĩa sát từng phần, ghi chú ngữ pháp và các cách diễn đạt khác để bạn học được từ bản dịch.
        </p>

        {/* Direction */}
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--bg-surface)] p-2 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
          <span className="flex-1 truncate text-center text-sm font-semibold text-text-primary">{srcLabel}</span>
          <button
            type="button"
            onClick={swap}
            aria-label="Đảo chiều dịch"
            className="rounded-full bg-neon-blue/15 p-2 text-neon-blue ring-1 ring-neon-blue/30 transition hover:bg-neon-blue/25"
          >
            <ArrowLeftRight size={16} />
          </button>
          <span className="flex-1 truncate text-center text-sm font-semibold text-text-primary">{dstLabel}</span>
        </div>

        {/* Tone */}
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTone(t.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                tone === t.key
                  ? 'bg-neon-blue/15 text-neon-blue ring-neon-blue/40'
                  : 'bg-[var(--bg-surface)] text-text-muted ring-[var(--border-color)] hover:text-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={direction === 'to' ? 'Nhập tiếng Việt cần dịch…' : `Nhập ${target.toLowerCase()} cần dịch…`}
            rows={6}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 pr-11 text-sm text-text-primary outline-none focus:border-neon-blue/60"
          />
          {recordSupported && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={transcribing}
              aria-label={recording ? 'Dừng ghi âm' : 'Nhập bằng giọng nói'}
              className={`absolute right-2 top-2 rounded-full p-2 ring-1 transition disabled:opacity-60 ${
                recording
                  ? 'animate-pulse bg-neon-pink/20 text-neon-pink ring-neon-pink/40'
                  : 'bg-[var(--bg-surface)] text-text-muted ring-[var(--border-color)] hover:text-neon-blue'
              }`}
            >
              {transcribing ? <Loader2 size={15} className="animate-spin" /> : recording ? <Square size={15} /> : <Mic size={15} />}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{text.trim().length} ký tự</span>
          <button
            type="button"
            onClick={run}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-neon-blue/15 px-4 py-2 text-sm font-semibold text-neon-blue ring-1 ring-neon-blue/30 transition hover:bg-neon-blue/25 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Đang dịch…' : 'Dịch'}
            {!isPro && <span className="rounded-full bg-neon-blue/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none">Pro</span>}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--bg-surface)] p-4 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-neon-blue">{dstLabel}</span>
                {canSpeak && <SpeakerButton text={result.translation} forceLang={outLang} size={15} className="h-6 w-6" rate={0.9} />}
                <button
                  type="button"
                  onClick={() => copy(result.translation)}
                  aria-label="Sao chép bản dịch"
                  className="ml-auto rounded-full p-1.5 text-text-muted transition hover:text-neon-blue"
                >
                  <Copy size={14} />
                </button>
              </div>
              <p className="whitespace-pre-wrap text-base text-text-primary">{result.translation}</p>
              {result.reading && <p className="mt-1 text-sm italic text-text-muted">{result.reading}</p>}
            </div>

            {result.literal && (
              <div className="rounded-xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Nghĩa sát từng phần</h3>
                <p className="text-sm text-text-secondary">{result.literal}</p>
              </div>
            )}

            {result.notes && (
              <div className="rounded-xl bg-neon-violet/10 p-3 ring-1 ring-neon-violet/30">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neon-violet">Ghi chú ngữ pháp</h3>
                <p className="whitespace-pre-wrap text-sm text-text-secondary">{result.notes}</p>
              </div>
            )}

            {result.alternatives.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Cách nói khác</h3>
                <ul className="space-y-2">
                  {result.alternatives.map((a, i) => (
                    <li key={i} className="rounded-xl bg-[var(--bg-surface)] p-3 text-sm ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
                      <div className="flex items-start gap-2">
                        <p className="min-w-0 flex-1 text-text-primary">{a.text}</p>
                        {canSpeak && <SpeakerButton text={a.text} forceLang={outLang} size={14} className="h-6 w-6 shrink-0" rate={0.9} />}
                      </div>
                      {a.note && <p className="mt-1 text-text-muted">{a.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={saveToNotebook}
              disabled={saved}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-70 ${saved ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-blue hover:ring-neon-blue/40'}`}
            >
              {saved ? <Check size={15} /> : <BookmarkPlus size={15} />} {saved ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
