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

// ─── LLM client ────────────────────────────────────────────
// Its own client rather than reusing AIService: the robot wants the
// fastest small model, not the best one, and it must not inherit the
// chat product's RAG context or model switching.
let _groq: OpenAI | null = null;
function groq(): OpenAI {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY missing');
    _groq = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey });
  }
  return _groq;
}

function robotModel(): string {
  return process.env.MAKERLAB_LLM_MODEL || 'llama-3.1-8b-instant';
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
    const tr = await transcribeWithGroq(wav, 'turn.wav', 'audio/wav', { language: lang });
    heard = tr.text.trim();
    timing.stt = Date.now() - t0;
  }

  if (!heard) {
    timing.total = Date.now() - started;
    return { heard: '', said: '', actions: [], spoken: false, ms: timing };
  }

  emitTranscript(input.deviceId, 'user', heard);

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

  try {
    const res = await groq().chat.completions.create({
      model: robotModel(),
      messages,
      temperature: persona.temperature,
      max_tokens: persona.maxTokens,
      response_format: { type: 'json_object' },
    });
    const raw = res.choices[0]?.message?.content ?? '';
    const parsed = parseRobotReply(raw);
    if (parsed.say) return parsed;
  } catch (err) {
    logger.warn('MakerLab LLM failed', {
      deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
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
