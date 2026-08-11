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
import { canTraCuu, tinMoiNhat, timTrenWeb, dungDoanTraCuu } from './web.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';
import { loadPersona, buildSystemPrompt, buildFewShot, type PersonaConfig } from './persona.js';
import { validateCommand, type ValidatedCommand } from './commands.js';
import { synthesizeSpeech } from './tts.js';
import { checkHeardSpeech } from './hallucination.js';
import { PCM_SAMPLE_RATE } from './audio.js';
import { gatewayKey, gatewayRoot, modelFor } from '../llm/gateway.js';

// ─── Conversation memory ───────────────────────────────────
// Short-term only, in process memory. Long-term recall (pgvector over
// past conversations) is a separate feature — see the Overview tab's
// upgrade list. Keeping this small is deliberate: every extra turn is
// tokens on the critical path of a real-time reply.
/**
 * Nhớ 4 lượt gần nhất, không phải 8.
 *
 * Mỗi lượt cũ là token phải trả lại trên đường nóng của MỌI câu sau.
 * Đo thật: prompt cơ bản 885 token, nhưng lúc dùng thật đã phình lên
 * 2096 — hơn một nửa là lịch sử. Và thời gian nghĩ tỉ lệ thẳng với số
 * token vào.
 *
 * Bốn lượt vẫn đủ để robot theo được mạch chuyện ("cái đó" trỏ về câu
 * trước), mà cắt gần một nghìn token khỏi mỗi lần gọi.
 */
const MAX_HISTORY_TURNS = 4;
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
      // Cùng cổng, cùng khoá với cả web — xem src/services/llm/gateway.ts.
      return { baseURL: `${gatewayRoot()}/v1`, key: gatewayKey(), label: 'compat' };
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
      // Cùng bản đồ model với phần còn lại của web (src/services/llm/gateway.ts)
      // → đổi model robot bằng `LLM_MODEL_ROBOT_VOICE`, không cần sửa mã.
      return modelFor('robot_voice');
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
/**
 * Trần độ dài câu nói, tính bằng ký tự.
 *
 * Từng là 500 — và đó là chỗ cắt cụt câu trả lời dài, không phải trần
 * token. `max_tokens` trong DB là 800, tức model viết thoải mái được
 * ~1.500 ký tự tiếng Việt, rồi bị dòng `slice(0, 500)` này xén mất quá
 * nửa. Người nghe thấy robot đang nói ngon lành thì im bặt giữa chừng,
 * và không có gì trong log nói ra chuyện đó.
 *
 * 2.000 để `max_tokens` trở lại làm cái trần thật — muốn robot nói ngắn
 * hay dài thì chỉnh ở đó, chỗ có tên đúng với việc nó làm, chứ không
 * phải ở một hằng số giấu trong hàm phân tích JSON.
 */
const MAX_SAY_CHARS = 2_000;

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
      return { say: say.slice(0, MAX_SAY_CHARS), actions };
    } catch {
      /* try the next candidate */
    }
  }

  // Not JSON at all — strip any braces and speak whatever is left.
  return {
    say: text.replace(/[{}[\]"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_SAY_CHARS),
    actions: [],
  };
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
    // Độ dài đoạn tiếng là bằng chứng mạnh nhất chống lại chuyện bịa —
    // xem hallucination.ts. Không truyền xuống thì tầng lọc đó tắt câm.
    const audioSec = input.pcm16.length / 2 / PCM_SAMPLE_RATE;
    const check = checkHeardSpeech(heard, { ...tr, audioSec });
    if (!check.ok) {
      // Báo cho bo biết là KHÔNG hiểu, để nó bíp hai nốt đi xuống.
      //
      // Không có tín hiệu này thì người dùng đứng chờ một câu trả lời
      // không bao giờ tới, rồi tự hỏi lại — và câu hỏi thứ hai đè lên
      // lượt đang xử lý. Im lặng là phản hồi tệ nhất có thể.
      void import('../../socket/device.gateway.js')
        .then(({ notifyDevice }) => notifyDevice(input.deviceId, { t: 'nak' }))
        .catch(() => undefined);
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
  const ctx = { deviceName: device?.name, battery: device?.batteryPct ?? null };
  // ── 1b. Tra internet, NẾU câu hỏi cần ──
  //
  // Chạy trước khi gọi model, không phải sau. Xem lý do dài trong
  // `web.ts`: cách chuẩn của ngành là để model tự gọi công cụ rồi gọi
  // model LẦN HAI kèm kết quả, mà một lượt gọi ở đây là 1,6 giây tới
  // chữ đầu tiên — người ta đang đứng chờ nghe tiếng.
  let doanTraCuu = '';
  const kieuTra = canTraCuu(heard);
  if (kieuTra) {
    const t = Date.now();
    const muc =
      kieuTra === 'tim'
        ? await timTrenWeb(heard, 5)
        : await tinMoiNhat(8, kieuTra === 'tin-cong-nghe');
    doanTraCuu = dungDoanTraCuu(muc, kieuTra);
    logger.info('MakerLab tra internet', {
      deviceId: input.deviceId,
      kieu: kieuTra,
      soMuc: muc.length,
      ms: Date.now() - t,
    });
  }

  const t1 = Date.now();

  // ── 2+4. Vừa nghĩ vừa nói ──
  //
  // Trước đây hai bước này nối tiếp: đợi model viết XONG cả câu trả
  // lời, rồi mới đọc thành tiếng, rồi mới gửi. Đo trên robot thật:
  // người dùng chờ 4,5 giây mới nghe được chữ đầu tiên, mà 3 giây
  // trong đó chỉ là ngồi đợi model viết nốt những câu chưa ai cần
  // nghe vội.
  //
  // Giờ câu đầu tiên vừa xong là đọc và gửi ngay, phần sau chảy tiếp
  // trong lúc robot đang nói — giống cách người ta nói chuyện thật.
  let reply: RobotReply;
  let spoken = false;

  if (input.speak !== false) {
    const r = await thinkAndSpeak(persona, heard, input.deviceId, ctx, timing, doanTraCuu);
    reply = r.reply;
    spoken = r.spoken;
    timing.llm = r.llmMs;
  } else {
    reply = await think(persona, heard, input.deviceId, ctx, doanTraCuu);
    timing.llm = Date.now() - t1;
  }

  pushHistory(
    input.deviceId,
    { role: 'user', content: heard },
    { role: 'assistant', content: JSON.stringify({ say: reply.say, actions: reply.actions }) },
  );

  for (const action of reply.actions) {
    void dispatchAction(input.deviceId, action);
  }

  if (!spoken) emitTranscript(input.deviceId, 'bot', reply.say);

  timing.total = Date.now() - started;
  logger.info('MakerLab voice turn', {
    deviceId: input.deviceId,
    heard: heard.slice(0, 60),
    // Ghi cả độ dài tiếng của lượt ĐƯỢC NHẬN, không chỉ lượt bị loại.
    // Chỉ có log của bên được nhận mới cho biết ngưỡng đang cắt nhầm
    // vào đâu — bên bị loại thì đằng nào cũng đã bị loại.
    ...(input.pcm16 ? { giay: +(input.pcm16.length / 2 / PCM_SAMPLE_RATE).toFixed(2) } : {}),
    actions: reply.actions.length,
    ...timing,
  });

  return { heard, said: reply.say, actions: reply.actions, spoken, ms: timing };
}

/**
 * Nghĩ và nói cùng lúc: mỗi câu vừa viết xong là đọc thành tiếng và
 * gửi ngay xuống loa.
 *
 * Hỏng ở bất kỳ đâu thì lùi về đường cũ (nghĩ xong hết rồi mới nói).
 * Một con robot nói chậm vẫn tốt hơn một con robot câm, và đường mới
 * này có nhiều mắt xích hơn nên phải có chỗ lùi.
 */
async function thinkAndSpeak(
  persona: PersonaConfig,
  heard: string,
  deviceId: number,
  ctx: { deviceName?: string; battery?: number | null },
  timing: { tts: number },
  doanTraCuu = '',
): Promise<{ reply: RobotReply; spoken: boolean; llmMs: number }> {
  const started = Date.now();
  const gw = await import('../../socket/device.gateway.js');
  const { PCM_SAMPLE_RATE } = await import('./audio.js');

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: buildSystemPrompt(persona, ctx) },
    ...buildFewShot(persona),
    // Kết quả tra internet đứng NGAY TRƯỚC câu người dùng vừa nói, ở vai
    // system: đặt sau thì model đã đọc câu hỏi rồi mới thấy dữ liệu và
    // hay bỏ qua; đặt lên đầu cùng tính cách thì nó lẫn với "mày là ai"
    // và model dễ nhắc lại danh sách như đọc mục lục.
    ...(doanTraCuu ? [{ role: 'system' as const, content: doanTraCuu }] : []),
    ...getHistory(deviceId),
    { role: 'user', content: heard },
  ];

  const chain = llmChain();
  const p = chain[0];
  const model = robotModel(p);

  let seq: number | null = null;
  let spoken = false;
  let firstAudioMs = 0;

  const speakPiece = async (piece: string) => {
    if (seq === null) return;
    const t = Date.now();
    const tts = await synthesizeSpeech(piece, {
      provider: persona.voiceProvider as never,
      voice: persona.voiceId ?? undefined,
      language: persona.language,
      speakingRate: persona.speechRate,
    });
    timing.tts += Date.now() - t;
    const ok = await gw.speakStreamPush(deviceId, tts.audio, seq);
    if (ok) {
      spoken = true;
      if (!firstAudioMs) firstAudioMs = Date.now() - started;
    }
  };

  try {
    if (noJsonMode.has(model)) throw new Error('model không nhận json_object — dùng đường cũ');

    const stream = await clientFor(p).chat.completions.create({
      model,
      messages,
      temperature: persona.temperature,
      max_tokens: persona.maxTokens,
      response_format: { type: 'json_object' },
      stream: true,
    });

    let raw = '';
    let emitted = 0;

    /**
     * Gom câu trước khi gọi TTS — xem ghi chú dài ở vòng lặp dưới.
     *
     * 150 ký tự ≈ 10 giây tiếng: đủ dài để mối nối thưa hẳn, mà vẫn đủ
     * ngắn để mẩu tiếp theo kịp về trước khi bo phát hết mẩu trước.
     */
    // 150 → 400. Mỗi mẩu TTS là một mối nối, và đo trên bo thật cho
    // thấy mối nối MỚI là thứ nghe thành "giật", chứ không phải đói đệm
    // (`hut dem 0 lan / 0 ms` ở mọi lượt, kể cả lượt 20 giây). Gom dài
    // hơn ⇒ ít mối nối hơn. Mẩu ĐẦU vẫn gửi ngay khi có một câu nên độ
    // trễ mở miệng không đổi; chỉ các mẩu sau mới gom, và lúc đó bo
    // đang bận phát mẩu đầu nên có thừa thời gian.
    const GOM_TOI_THIEU = 400;
    const cho: string[] = [];
    let daGuiMauDau = false;

    for await (const chunk of stream) {
      raw += chunk.choices[0]?.delta?.content ?? '';
      const say = partialSay(raw);
      if (say.length <= emitted) continue;

      const { sentences, consumed } = takeSentences(say, emitted);
      if (!sentences.length) continue;

      if (seq === null) {
        seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
        if (seq === null) break; // bo rớt mạng giữa chừng
      }

      // ⚠️ GOM CÂU LẠI, đừng gọi TTS từng câu một.
      //
      // Bản trước làm `for (const s of sentences) await speakPiece(s)`
      // — mỗi câu một lần gọi TTS. Câu trả lời bốn câu thành bốn đoạn
      // tiếng ghép lại, mà mỗi đoạn TTS trả về đều có khoảng lặng đệm
      // ở đầu và cuối. Ghép bốn đoạn là có bốn cặp khoảng lặng chen
      // vào giữa lời nói.
      //
      // Người nghe gọi đó là "giật giật", nhưng nó KHÔNG phải đói đệm:
      // log của bo cho `hut dem 0 lan / 0 ms` ở mọi lượt, kể cả lượt
      // dài 19 giây. Đo trước rồi mới biết vá đúng chỗ — bản vá ghìm
      // nhịp sáng nay chữa đúng bệnh khác.
      //
      // Cách gom: mẩu ĐẦU gửi ngay khi có một câu, để tiếng ra sớm và
      // độ trễ đối đáp không đổi. Từ mẩu thứ hai trở đi mới gom cho đủ
      // dài — lúc đó bo đang phát mẩu đầu nên có thời gian, và ít mối
      // nối hơn nghĩa là nghe liền mạch hơn.
      for (const s of sentences) {
        cho.push(s);
        const dai = cho.join(' ').length;
        if (!daGuiMauDau || dai >= GOM_TOI_THIEU) {
          await speakPiece(cho.join(' '));
          cho.length = 0;
          daGuiMauDau = true;
        }
      }
      emitted += consumed;
    }

    const parsed = parseRobotReply(raw);
    if (!parsed.say) throw new Error('model trả về rỗng');

    // ⚠️ MỘT mẩu cuối, không phải hai.
    //
    // Bản trước gọi TTS hai lần liền nhau ở đây: một lần cho phần đang
    // chờ gom, rồi ngay sau đó một lần nữa cho phần đuôi chưa có dấu
    // kết câu. Mỗi lần gọi TTS trả về một đoạn tiếng có khoảng lặng đệm
    // ở hai đầu, nên hai lần liền nhau là nhét hai mối nối vào đúng vài
    // giây cuối của câu trả lời.
    //
    // User báo đúng chỗ đó: "câu dài vẫn bị vấp ở CUỐI". Càng dài thì
    // càng dễ còn dư cả hai phần, nên câu ngắn không thấy mà câu dài
    // thì lần nào cũng thấy.
    const tail = parsed.say.slice(emitted).trim();
    const conLai = [...cho, tail].filter(Boolean).join(' ');
    cho.length = 0;
    if (conLai) {
      if (seq === null) seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
      if (seq !== null) await speakPiece(conLai);
    }

    if (seq !== null) gw.speakStreamEnd(deviceId, seq, parsed.say);
    // Ghi luôn ĐUÔI câu và số token ra: đó là hai thứ phân biệt được
    // "model bị cắt ở trần token" với "tiếng bị cắt lúc phát". Không có
    // hai con số này thì cả hai trông giống hệt nhau từ phía người nghe.
    const tailChar = parsed.say.slice(-1);
    logger.info('MakerLab nghĩ-và-nói', {
      deviceId,
      provider: p.label,
      model,
      firstAudioMs,
      totalMs: Date.now() - started,
      chuCuoi: tailChar,
      tronCau: /[.!?…"')\]]/.test(tailChar),
      soChu: parsed.say.length,
      daDoc: emitted,
    });
    return { reply: parsed, spoken, llmMs: Date.now() - started };
  } catch (err) {
    logger.warn('MakerLab đường nghĩ-và-nói hỏng, lùi về đường cũ', {
      deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
    if (seq !== null) gw.speakStreamEnd(deviceId, seq);

    const reply = await think(persona, heard, deviceId, ctx);
    if (reply.say) {
      try {
        const t = Date.now();
        const tts = await synthesizeSpeech(reply.say, {
          provider: persona.voiceProvider as never,
          voice: persona.voiceId ?? undefined,
          language: persona.language,
        });
        timing.tts += Date.now() - t;
        spoken = await gw.speakOnDevice(deviceId, tts.audio, {
          mime: tts.mime,
          text: reply.say,
        });
      } catch {
        /* câm nốt thì đành chịu — transcript vẫn lên console */
      }
    }
    return { reply, spoken, llmMs: Date.now() - started };
  }
}

// ─── Đọc câu ra khỏi dòng JSON đang chảy ───────────────────
/**
 * Model trả về `{"say":"...","actions":[...]}`. Khi đang chảy theo
 * dòng thì ta chỉ có JSON dở dang, chưa `JSON.parse` được — nhưng
 * trường `say` đứng đầu nên moi được nó ra sớm.
 *
 * Vì sao đáng làm: thời gian sinh chữ tỉ lệ với SỐ CHỮ SINH RA. Đợi
 * model viết xong cả đoạn rồi mới nói là bắt người dùng chờ luôn cả
 * những câu họ chưa cần nghe. Đo trên robot thật: 3031 ms cho một câu
 * trả lời, mà câu ĐẦU TIÊN đã xong sau chưa tới 1 giây.
 */
function partialSay(raw: string): string {
  const m = raw.match(/"say"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!m) return '';
  // Bỏ dấu gạch chéo lẻ ở cuối — nó là nửa đầu của một chuỗi thoát bị
  // cắt giữa chừng, để nguyên thì JSON.parse ném lỗi.
  const body = m[1].replace(/\\$/, '');
  try {
    return JSON.parse(`"${body}"`) as string;
  } catch {
    return '';
  }
}

/**
 * Cắt phần chữ mới thành câu trọn vẹn.
 *
 * Chỉ cắt ở dấu kết câu CÓ khoảng trắng theo sau, để "3.5 giây" hay
 * "gpt-5.4-mini" không bị xé đôi giữa con số.
 */
function takeSentences(text: string, from: number): { sentences: string[]; consumed: number } {
  const rest = text.slice(from);
  const out: string[] = [];
  let consumed = 0;
  const re = /[.!?…]+["')\]]*(\s+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    const end = m.index + m[0].length;
    const piece = rest.slice(consumed, end).trim();
    if (piece.length >= 2) {
      out.push(piece);
      consumed = end;
    }
  }
  return { sentences: out, consumed };
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
  doanTraCuu = '',
): Promise<RobotReply> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: buildSystemPrompt(persona, ctx) },
    ...buildFewShot(persona),
    // Kết quả tra internet đứng NGAY TRƯỚC câu người dùng vừa nói, ở vai
    // system: đặt sau thì model đã đọc câu hỏi rồi mới thấy dữ liệu và
    // hay bỏ qua; đặt lên đầu cùng tính cách thì nó lẫn với "mày là ai"
    // và model dễ nhắc lại danh sách như đọc mục lục.
    ...(doanTraCuu ? [{ role: 'system' as const, content: doanTraCuu }] : []),
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

/**
 * Ghi lệnh vào sổ (để console thấy) rồi đẩy xuống bo.
 *
 * Trừ nhạc: `play_music` và `stop_music` do SERVER làm, không đẩy
 * xuống bo. Bo không biết đường ra Internet lấy file, cũng không có
 * chỗ chứa một bài bốn phút — server tải, đổi mã, rồi rót xuống theo
 * đúng đường tiếng đang dùng để nói.
 */
async function dispatchAction(deviceId: number, action: ValidatedCommand): Promise<void> {
  if (action.type === 'play_music' || action.type === 'stop_music') {
    try {
      const music = await import('./music.js');
      if (action.type === 'stop_music') {
        const had = music.stopMusicOn(deviceId);
        logger.info('MakerLab tắt nhạc', { deviceId, dangPhat: had });
      } else {
        const q = String((action.payload as { query?: unknown }).query ?? '');
        const note = await music.playMusicOn(deviceId, q);
        logger.info('MakerLab bật nhạc', { deviceId, query: q, note });
      }
    } catch (err) {
      logger.warn('MakerLab lệnh nhạc hỏng', {
        deviceId,
        type: action.type,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return;
  }

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
