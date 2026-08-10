/**
 * Phase 9 — Speech-to-text for the interview (candidate's spoken answer).
 *
 * STT and TTS are INDEPENDENT decisions (see phase9-voice-prompt). TTS stays in
 * the browser (free, and a neutral synthetic voice suits an interviewer). STT is
 * where accuracy matters — a mis-transcribed "Kubernetes" would make Pass A miss
 * a keyword and wrongly fail a correct answer. So:
 *
 *   STT_PROVIDER=browser  (default) → transcription happens client-side (free).
 *   STT_PROVIDER=groq              → this module transcribes via Groq Whisper
 *                                     (whisper-large-v3-turbo), reusing the
 *                                     EXISTING GROQ_API_KEY — no new vendor/key.
 *
 * Guardrails baked in:
 * - Audio is NEVER written to disk or logged (it's PII — the user's voice). It
 *   lives only in memory for the duration of the request, then is discarded.
 * - A domain-vocabulary hint (built from the question's mustMention/shouldMention
 *   + topic) is passed to Whisper to bias decoding toward the exact technical
 *   terms scoring depends on. Cheapest, highest-leverage accuracy win.
 * - The caller ALWAYS shows the transcript back editable before grading.
 */
import { prisma } from '../../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../../middleware/errorHandler.js';

export type SttProvider = 'browser' | 'groq';

/** Which STT backend is active platform-wide. Default browser (free, client-side). */
export function sttProvider(): SttProvider {
  return String(process.env.STT_PROVIDER ?? 'browser').toLowerCase() === 'groq' ? 'groq' : 'browser';
}

/** Whether server transcription (Groq) is actually usable right now. */
export function serverSttEnabled(): boolean {
  return sttProvider() === 'groq' && !!process.env.GROQ_API_KEY;
}

function groqModel(): string {
  return process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo';
}

/**
 * Build the Whisper vocabulary hint for a turn from the question's key terms +
 * topic. Whisper accepts a `prompt` that biases decoding — feeding it the exact
 * words scoring cares about materially improves accuracy on technical speech.
 */
export async function buildHintForTurn(sessionId: number, order: number): Promise<string> {
  try {
    const turn = await prisma.interviewTurn.findUnique({
      where: { uk_interview_turn_order: { sessionId, order } },
      select: { question: { select: { mustMention: true, shouldMention: true, tags: true, topic: { select: { name: true } } } } },
    });
    const q = turn?.question;
    if (!q) return '';
    const terms = [
      ...(q.mustMention ?? []),
      ...(q.shouldMention ?? []),
      ...(q.tags ?? []),
      q.topic?.name ?? '',
    ]
      .map((t) => String(t).trim())
      .filter(Boolean);
    // De-dup, cap length (Whisper prompt is bounded; keep it tight).
    return [...new Set(terms)].join(', ').slice(0, 500);
  } catch {
    return '';
  }
}

export interface TranscriptResult {
  text: string;
  provider: SttProvider;
  /**
   * Whisper's own estimate that the clip contains NO speech (0..1), averaged
   * over segments. Only present when `detail: true` is requested.
   *
   * Worth having because Whisper never returns "I heard nothing" — fed pure
   * room noise it emits the most common thing in its training data, which for
   * Vietnamese is YouTube subtitle boilerplate ("đừng quên like share
   * subscribe", "cảm ơn các bạn đã xem video"). The text looks perfectly
   * confident; this number is the only place the model admits doubt.
   */
  noSpeechProb?: number;
  /** Mean log-probability of the decoded tokens. Very low = the model guessed. */
  avgLogprob?: number;
}

/**
 * Transcribe an audio buffer via Groq Whisper. Throws on any failure so the
 * route can tell the client to fall back to browser STT / typing.
 */
export async function transcribeWithGroq(
  audio: Buffer,
  filename: string,
  mimetype: string,
  // `language` is an ISO-639-1 code Whisper understands (vi/en/ja/zh/…). The
  // interview passes vi/en; My Language pronunciation scoring passes ja/zh too.
  opts: { language: string; hints?: string; detail?: boolean },
): Promise<TranscriptResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY missing');

  const form = new FormData();
  // Blob keeps the audio in memory only — never touches disk.
  form.append('file', new Blob([new Uint8Array(audio)], { type: mimetype || 'audio/webm' }), filename || 'answer.webm');
  form.append('model', groqModel());
  form.append('language', opts.language);
  // `verbose_json` costs nothing extra but carries the per-segment confidence
  // numbers. Opt-in so the interview keeps its existing lighter response.
  form.append('response_format', opts.detail ? 'verbose_json' : 'json');
  form.append('temperature', '0');
  if (opts.hints) form.append('prompt', opts.hints);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), Number(process.env.STT_TIMEOUT_MS) || 30_000);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`groq stt HTTP ${res.status} ${detail.slice(0, 120)}`);
    }
    const json = (await res.json()) as {
      text?: string;
      segments?: Array<{ no_speech_prob?: number; avg_logprob?: number }>;
    };
    const text = (json.text ?? '').trim();
    if (!opts.detail || !json.segments?.length) return { text, provider: 'groq' };

    const segs = json.segments;
    const mean = (pick: (s: (typeof segs)[number]) => number | undefined) => {
      const vals = segs.map(pick).filter((v): v is number => typeof v === 'number');
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : undefined;
    };
    return {
      text,
      provider: 'groq',
      noSpeechProb: mean((s) => s.no_speech_prob),
      avgLogprob: mean((s) => s.avg_logprob),
    };
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('groq stt timeout');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Orchestrates a server transcription: ownership check → hint → Groq. Throws
 * AppError subclasses the route can surface; on Groq failure the client falls
 * back to browser STT / typing.
 */
export async function transcribeAnswerAudio(params: {
  userId: number;
  sessionId: number;
  order: number;
  language: 'vi' | 'en';
  audio: Buffer;
  filename: string;
  mimetype: string;
}): Promise<TranscriptResult> {
  if (!serverSttEnabled()) throw new BadRequestError('Chuyển giọng nói phía máy chủ đang tắt (dùng trình duyệt).');
  if (!params.audio?.length) throw new BadRequestError('Không nhận được audio');
  const session = await prisma.interviewSession.findUnique({ where: { id: params.sessionId }, select: { userId: true } });
  if (!session) throw new NotFoundError('Phiên phỏng vấn không tồn tại');
  if (session.userId !== params.userId) throw new ForbiddenError('Bạn không có quyền với phiên này');
  const hints = await buildHintForTurn(params.sessionId, params.order);
  return transcribeWithGroq(params.audio, params.filename, params.mimetype, { language: params.language, hints });
}
