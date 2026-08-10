/**
 * ============================================================
 * Maker Lab — Voice loop
 * ============================================================
 *
 *   mic (PCM 16 kHz) → WAV wrapper → Groq Whisper → LLM(persona)
 *                                                      ↓
 *   speaker ← MP3 ← TTS ←── { say, actions[] } ────────┘
 *                                  ↓
 *                          validated commands → motors / eyes / LEDs
 *
 * Budget on the current VPS (measured RTT to the board's network is
 * ~25 ms, so the network is not the problem):
 *   Whisper large-v3-turbo on Groq   ~250–400 ms
 *   llama-3.1-8b-instant on Groq     ~200–400 ms
 *   Edge TTS                         ~250–500 ms
 *   ────────────────────────────────────────────
 *   ≈ 1 second from end-of-speech to first audio.
 *
 * Everything here is fail-soft. A robot that answers "tôi nghe không
 * rõ" is fine; a robot whose backend throws and goes silent is not.
 */

import OpenAI from 'openai';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';
import { loadPersona, buildSystemPrompt, buildFewShot, type PersonaConfig } from './persona.js';
import { validateCommand, type ValidatedCommand } from './commands.js';
import { synthesizeSpeech } from './tts.js';
import { checkHeardSpeech } from './hallucination.js';

// ─── Conversation memory ───────────────────────────────────
// Short-term only, in process memory. Long-term recall (pgvector over
// past conversations) is a separate feature — see the Overview tab's
// upgrade list. Keeping this small is deliberate: every extra turn is
// tokens on the critical path of a real-time reply.
const MAX_HISTORY_TURNS = 8;
const HISTORY_TTL_MS = 30 * 60 * 1000;

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}
interface History {
  turns: Turn[];
  touchedAt: number;
}
const histories = new Map<number, History>();

function getHistory(deviceId: number): Turn[] {
  const h = histories.get(deviceId);
  if (!h) return [];
  if (Date.now() - h.touchedAt > HISTORY_TTL_MS) {
    histories.delete(deviceId);
    return [];
  }
  return h.turns;
}

function pushHistory(deviceId: number, ...turns: Turn[]): void {
  const h = histories.get(deviceId) ?? { turns: [], touchedAt: Date.now() };
  h.turns.push(...turns);
  if (h.turns.length > MAX_HISTORY_TURNS * 2) {
    h.turns = h.turns.slice(-MAX_HISTORY_TURNS * 2);
  }
  h.touchedAt = Date.now();
  histories.set(deviceId, h);
}

export function clearHistory(deviceId: number): void {
  histories.delete(deviceId);
}

// ─── Chốt chặn chi phí ─────────────────────────────────────
/**
 * Trần số lượt nói mỗi ngày, mỗi thiết bị.
 *
 * Không phải lo xa. Đúng hôm nay, VAD đặt ngưỡng cố định đã bắt nhầm
 * tiếng phòng và tự mở lượt liên tục — mỗi lượt là một lần gọi LLM
 * cộng một lần gọi TTS. Bộ lọc câu bịa chặn được phần lớn, nhưng nó
 * chặn SAU khi Whisper đã chạy, và một con robot cắm điện 24/7 cạnh
 * cái quạt là thứ có thể tiêu tiền cả đêm mà không ai biết.
 *
 * 2000 lượt/ngày rộng hơn nhiều so với mức dùng thật của một con
 * robot để bàn (nói cả ngày cũng khó quá 300), nên nó không bao giờ
 * chặn nhầm việc dùng bình thường — nó chỉ chặn lúc có gì đó hỏng.
 */
const DAILY_TURN_CAP = Number(process.env.MAKERLAB_DAILY_TURN_CAP) || 2000;
const turnCounts = new Map<number, { day: string; n: number }>();

function overDailyCap(deviceId: number): boolean {
  if (DAILY_TURN_CAP <= 0) return false; // 0 = tắt trần
  const day = new Date().toISOString().slice(0, 10);
  const c = turnCounts.get(deviceId);
  if (!c || c.day !== day) {
    turnCounts.set(deviceId, { day, n: 1 });
    return false;
  }
  c.n += 1;
  if (c.n === DAILY_TURN_CAP + 1)
    logger.warn('MakerLab chạm trần lượt nói trong ngày', { deviceId, cap: DAILY_TURN_CAP });
  return c.n > DAILY_TURN_CAP;
}

// ─── LLM client ────────────────────────────────────────────
// Its own client rather than reusing AIService: the robot wants the
// fastest small model, not the best one, and it must not inherit the
// chat product's RAG context or model switching.
/**
 * Nhà cung cấp model — đổi bằng BIẾN MÔI TRƯỜNG, không sửa code.
 *
 *   MAKERLAB_LLM_PROVIDER = compat | groq | openai | custom
 *   MAKERLAB_LLM_MODEL    = tên model
 *
 * Mặc định là `compat`: dùng lại đúng cổng modelapi.vn mà CV Builder
 * và Jobs AI đã cấu hình sẵn (`OPENAI_COMPAT_BASE_URL` +
 * `OPENAI_COMPAT_API_KEY`). Không thêm khoá mới, không thêm hoá đơn
 * mới — robot tiêu chung một ví với phần còn lại của web.
 *
 * ⚠️ Cổng Rambo (`LLM_BASE_URL` + các model `rb-*`) ĐÃ HẾT HẠN, đừng
 * trỏ về đó nữa dù mã cũ vẫn còn nhắc tới nó.
 *
 * Model trên modelapi.vn (đọc từ trang Rankings công khai, 10/08/2026):
 *   gpt-5.6-sol · gpt-5.6-terra · gpt-5.6-luna · gpt-5.5 · gpt-5.4
 *   gpt-5.4-mini · deepseek-v4-flash · grok-4.5
 *   claude-opus-5 · claude-sonnet-5 · claude-fable-5 · …
 *
 * Với robot đối thoại thì độ trễ quan trọng ngang độ thông minh —
 * mỗi 100 ms đều nghe ra được. `gpt-5.6-terra` là mức cân bằng, và
 * nếu thấy chậm thì `gpt-5.4-mini` hoặc `deepseek-v4-flash` rẻ và
 * nhanh hơn rõ; đổi chỉ là một biến môi trường.
 */
interface LlmProvider {
  baseURL: string;
  key: string | undefined;
  label: string;
}

function providerNamed(which: string): LlmProvider {
  switch (which) {
    case 'groq':
      return { baseURL: 'https://api.groq.com/openai/v1', key: process.env.GROQ_API_KEY, label: 'groq' };
    case 'openai':
      return { baseURL: 'https://api.openai.com/v1', key: process.env.OPENAI_API_KEY, label: 'openai' };
    case 'custom':
      return {
        baseURL: (process.env.MAKERLAB_LLM_BASE_URL || '').replace(/\/+$/, ''),
        key: process.env.MAKERLAB_LLM_API_KEY,
        label: 'custom',
      };
    default:
      return {
        baseURL: (process.env.OPENAI_COMPAT_BASE_URL || '').replace(/\/+$/, ''),
        key: process.env.OPENAI_COMPAT_API_KEY,
        label: 'compat',
      };
  }
}

function usable(p: LlmProvider): boolean {
  return !!p.key && !!p.baseURL;
}

/**
 * Nhà chính, và nhà dự phòng nếu nhà chính chưa cấu hình.
 *
 * Một con robot không nên câm chỉ vì hết credit hay sai một biến môi
 * trường. Groq miễn phí nên nó là cái lưới đỡ phía dưới — chậm hơn,
 * kém hơn, nhưng còn nói được.
 */
function llmChain(): LlmProvider[] {
  const primary = providerNamed((process.env.MAKERLAB_LLM_PROVIDER || 'compat').toLowerCase());
  const chain = usable(primary) ? [primary] : [];
  const groqP = providerNamed('groq');
  if (primary.label !== 'groq' && usable(groqP)) chain.push(groqP);
  if (!chain.length) chain.push(primary); // để lỗi nói rõ là thiếu gì
  return chain;
}

const _clients = new Map<string, OpenAI>();
function clientFor(p: LlmProvider): OpenAI {
  let c = _clients.get(p.baseURL);
  if (!c) {
    if (!p.key) throw new Error(`Thiếu khoá API cho nhà cung cấp "${p.label}"`);
    if (!p.baseURL) throw new Error(`Thiếu base URL cho nhà cung cấp "${p.label}"`);
    c = new OpenAI({ baseURL: p.baseURL, apiKey: p.key });
    _clients.set(p.baseURL, c);
    logger.info('MakerLab dùng LLM', { provider: p.label, baseURL: p.baseURL });
  }
  return c;
}

function robotModel(p: LlmProvider): string {
  if (process.env.MAKERLAB_LLM_MODEL) return process.env.MAKERLAB_LLM_MODEL;
  switch (p.label) {
    case 'groq':
      return 'llama-3.3-70b-versatile';
    case 'openai':
      return 'gpt-4o-mini';
    default:
      return 'gpt-5.6-terra';
  }
}

// ─── PCM → WAV ─────────────────────────────────────────────

/**
 * Whisper needs a container, the ESP32 sends raw samples. A 44-byte
 * RIFF header is all it takes — cheaper than making the firmware do
 * any encoding.
 */
export function pcmToWav(pcm: Buffer, sampleRate = 16_000, channels = 1, bits = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bits) / 8;
  const blockAlign = (channels * bits) / 8;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

// ─── Reply parsing ─────────────────────────────────────────

export interface RobotReply {
  say: string;
  actions: ValidatedCommand[];
}

/**
 * The model is asked for strict JSON, and mostly complies. When it
 * doesn't — a stray sentence before the brace, a markdown fence — we
 * salvage rather than fail: worst case the whole response becomes the
 * spoken line, which is still a working robot.
 */
export function parseRobotReply(raw: string): RobotReply {
  const text = raw.trim();
  const candidates: string[] = [];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) candidates.push(fenced[1].trim());
  const braced = text.match(/\{[\s\S]*\}/);
  if (braced) candidates.push(braced[0]);
  candidates.push(text);

  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Record<string, unknown>;
      const say = String(obj.say ?? obj.text ?? '').trim();
      if (!say) continue;
      const actions: ValidatedCommand[] = [];
      if (Array.isArray(obj.actions)) {
        for (const a of obj.actions.slice(0, 3)) {
          if (!a || typeof a !== 'object') continue;
          const rec = a as Record<string, unknown>;
          const cmd = validateCommand(String(rec.type ?? ''), rec.payload, { llmOnly: true });
          if (cmd) actions.push(cmd);
        }
      }
      return { say: say.slice(0, 500), actions };
    } catch {
      /* try the next candidate */
    }
  }

  // Not JSON at all — strip any braces and speak whatever is left.
  return { say: text.replace(/[{}[\]"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500), actions: [] };
}

// ─── The turn ──────────────────────────────────────────────

export interface VoiceTurnInput {
  deviceId: number;
  projectId: number;
  /** Raw mic audio. Either this or `text` must be provided. */
  pcm16?: Buffer;
  /** Pre-transcribed input (device-side STT, or a web console message). */
  text?: string;
  /** Console messages shouldn't play out of the robot's speaker unless asked. */
  speak?: boolean;
}

export interface VoiceTurnResult {
  heard: string;
  said: string;
  actions: ValidatedCommand[];
  spoken: boolean;
  ms: { stt: number; llm: number; tts: number; total: number };
}

/**
 * One full exchange. Called by the device gateway on `audio_end`,
 * and by the REST console when you type at the robot from the web.
 */
export async function runVoiceTurn(input: VoiceTurnInput): Promise<VoiceTurnResult> {
  const started = Date.now();
  const timing = { stt: 0, llm: 0, tts: 0, total: 0 };

  const device = await prisma.makerDevice.findUnique({
    where: { id: input.deviceId },
    select: { id: true, name: true, batteryPct: true },
  });

  // ── 1. Hear ──
  let heard = (input.text ?? '').trim();
  if (!heard && input.pcm16?.length) {
    const t0 = Date.now();
    const wav = pcmToWav(input.pcm16);
    const persona0 = await loadPersona(input.projectId);
    const lang = (persona0.language || 'vi-VN').split('-')[0] || 'vi';
    const tr = await transcribeWithGroq(wav, 'turn.wav', 'audio/wav', {
      language: lang,
      detail: true,
    });
    heard = tr.text.trim();
    timing.stt = Date.now() - t0;

    // Whisper luôn trả về CHỮ, kể cả khi chỉ nghe thấy tiếng quạt — và
    // chữ nó bịa ra là phụ đề YouTube. Không chặn ở đây thì LLM sẽ trả
    // lời rất nghiêm túc câu "đừng quên đăng ký kênh" mà không ai nói,
    // và người dùng kết luận là con AI bị ngu.
    const check = checkHeardSpeech(heard, tr);
    if (!check.ok) {
      logger.info('MakerLab bỏ lượt: Whisper bịa', {
        deviceId: input.deviceId,
        heard: heard.slice(0, 80),
        reason: check.reason,
        noSpeechProb: tr.noSpeechProb,
        bytes: input.pcm16.length,
      });
      timing.total = Date.now() - started;
      return { heard: '', said: '', actions: [], spoken: false, ms: timing };
    }
  }

  if (!heard) {
    timing.total = Date.now() - started;
    return { heard: '', said: '', actions: [], spoken: false, ms: timing };
  }

  emitTranscript(input.deviceId, 'user', heard);

  if (overDailyCap(input.deviceId)) {
    timing.total = Date.now() - started;
    return { heard, said: '', actions: [], spoken: false, ms: timing };
  }

  // ── 2. Think ──
  const persona = await loadPersona(input.projectId);
  const t1 = Date.now();
  const reply = await think(persona, heard, input.deviceId, {
    deviceName: device?.name,
    battery: device?.batteryPct ?? null,
  });
  timing.llm = Date.now() - t1;

  pushHistory(
    input.deviceId,
    { role: 'user', content: heard },
    { role: 'assistant', content: JSON.stringify({ say: reply.say, actions: reply.actions }) },
  );

  // ── 3. Act — fire the body commands before the audio so the robot
  //      starts moving as it starts talking, not after. ──
  for (const action of reply.actions) {
    void dispatchAction(input.deviceId, action);
  }

  // ── 4. Speak ──
  let spoken = false;
  if (input.speak !== false && reply.say) {
    const t2 = Date.now();
    try {
      const tts = await synthesizeSpeech(reply.say, {
        provider: persona.voiceProvider as never,
        voice: persona.voiceId ?? undefined,
        language: persona.language,
      });
      timing.tts = Date.now() - t2;
      const { speakOnDevice } = await import('../../socket/device.gateway.js');
      spoken = await speakOnDevice(input.deviceId, tts.audio, { mime: tts.mime, text: reply.say });
    } catch (err) {
      logger.warn('MakerLab TTS failed for turn', {
        deviceId: input.deviceId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (!spoken) emitTranscript(input.deviceId, 'bot', reply.say);

  timing.total = Date.now() - started;
  logger.info('MakerLab voice turn', {
    deviceId: input.deviceId,
    heard: heard.slice(0, 60),
    actions: reply.actions.length,
    ...timing,
  });

  return { heard, said: reply.say, actions: reply.actions, spoken, ms: timing };
}

/** Model nào không nhận `response_format` thì hỏi lại lần nữa, bỏ trường đó. */
type ChatArgs = {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature: number;
  max_tokens: number;
};

const noJsonMode = new Set<string>();

async function withJsonFallback(client: OpenAI, args: ChatArgs) {
  if (!noJsonMode.has(args.model)) {
    try {
      return await client.chat.completions.create({
        ...args,
        response_format: { type: 'json_object' },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const looksUnsupported = /response_format|400|invalid|unsupported/i.test(msg);
      if (!looksUnsupported) throw err;
      // Nhớ lại để lượt sau khỏi tốn thêm một vòng gọi hỏng.
      noJsonMode.add(args.model);
      logger.info('MakerLab model không nhận json_object, chuyển sang hỏi thường', {
        model: args.model,
      });
    }
  }
  return client.chat.completions.create(args);
}

async function think(
  persona: PersonaConfig,
  heard: string,
  deviceId: number,
  ctx: { deviceName?: string; battery?: number | null },
): Promise<RobotReply> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: buildSystemPrompt(persona, ctx) },
    ...buildFewShot(persona),
    ...getHistory(deviceId),
    { role: 'user', content: heard },
  ];

  // Thử nhà chính, hỏng thì tụt xuống nhà dự phòng. Không lặp lại
  // trên cùng một nhà: đây là đường thời gian thực, thà trả lời câu
  // đỡ hay còn hơn để người dùng ngồi chờ thêm hai giây nữa.
  for (const p of llmChain()) {
    const model = robotModel(p);
    try {
      // `response_format: json_object` là thứ ĐẦU TIÊN vỡ khi đổi model.
      // Cổng gộp nhiều nhà: model OpenAI hiểu trường này, model Claude
      // hay DeepSeek đi qua tuyến tương thích thì có nhà trả 400. Đổi
      // model xong robot câm mà log chỉ nói "HTTP 400" là mất cả buổi.
      // Nên hỏng vì trường này thì bỏ nó ra hỏi lại — parseRobotReply
      // vốn đã tự vớt được JSON lẫn trong văn xuôi.
      const res = await withJsonFallback(clientFor(p), {
        model,
        messages,
        temperature: persona.temperature,
        max_tokens: persona.maxTokens,
      });
      const raw = res.choices[0]?.message?.content ?? '';
      const parsed = parseRobotReply(raw);
      if (parsed.say) {
        const u = res.usage;
        logger.info('MakerLab LLM ok', {
          deviceId,
          provider: p.label,
          model,
          inTok: u?.prompt_tokens ?? 0,
          outTok: u?.completion_tokens ?? 0,
        });
        return parsed;
      }
    } catch (err) {
      logger.warn('MakerLab LLM failed', {
        deviceId,
        provider: p.label,
        model,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Fail-soft: say something in character rather than nothing at all.
  return {
    say: 'Tôi nghe không rõ, nói lại giúp tôi được không.',
    actions: [{ type: 'face', payload: { emotion: 'confused', ms: 2000 } }],
  };
}

/** Persist the command (so the console shows it) then push it down. */
async function dispatchAction(deviceId: number, action: ValidatedCommand): Promise<void> {
  try {
    const row = await prisma.makerCommand.create({
      data: {
        deviceId,
        type: action.type,
        payload: action.payload as object,
        issuedById: null, // authored by the robot itself
      },
    });
    const { pushCommand } = await import('../../socket/device.gateway.js');
    pushCommand(deviceId, { id: row.id, type: row.type, payload: row.payload });
  } catch (err) {
    logger.warn('MakerLab action dispatch failed', {
      deviceId,
      type: action.type,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function emitTranscript(deviceId: number, role: 'user' | 'bot', text: string): void {
  if (!text) return;
  void import('../../socket/messaging.socket.js')
    .then(({ getIO }) => {
      getIO()
        ?.to(`maker:device:${deviceId}`)
        .emit('maker:device:transcript', {
          deviceId,
          role,
          text,
          at: new Date().toISOString(),
        });
    })
    .catch(() => undefined);
}
