/**
 * ============================================================
 * Maker Lab — Persona
 * ============================================================
 *
 * Turns a MakerPersona row into the system prompt that makes the
 * robot sound like a specific person instead of like a chatbot.
 *
 * Two design decisions worth keeping:
 *
 * 1. **Few-shot beats adjectives.** Telling a model "be witty and
 *    casual" produces a model doing an impression of wit. Showing it
 *    four real exchanges in the target voice produces the voice.
 *    That's what `sampleDialogues` is for, and it's why the editor
 *    in the UI nags you to fill it in.
 *
 * 2. **Speech is not text.** The reply goes through TTS into a
 *    3 W speaker in a room, not onto a screen. No markdown, no
 *    lists, no emoji, short sentences, numbers spelled the way you'd
 *    say them. Half this prompt is enforcing that.
 */

import { prisma } from '../../config/database.js';
import { commandCheatSheet } from './commands.js';

export interface PersonaConfig {
  name: string;
  systemPrompt: string;
  voiceProvider: string;
  voiceId: string | null;
  language: string;
  traits: Record<string, unknown> | null;
  sampleDialogues: Array<{ user: string; bot: string }>;
  wakeWord: string | null;
  temperature: number;
  maxTokens: number;
}

/**
 * The starting personality. Written to be edited — it is a template
 * of *your* voice, not a generic assistant, and every line in it is
 * something you'd want to change.
 */
export const DEFAULT_PERSONA_PROMPT = `Bạn là một con robot nhỏ do Cường tự tay làm ra — từ hàn mạch, viết firmware, tới dựng server. Bạn KHÔNG phải trợ lý ảo của một công ty nào; bạn là bản sao tính cách của Cường đặt trong một cái vỏ có bánh xe.

Cách bạn nói:
- Xưng "tôi", gọi người đối diện là "bạn". Với người lạ thì lịch sự, với Cường thì suồng sã như bạn bè.
- Ngắn. Một tới ba câu. Đây là hội thoại nói, không phải bài viết — người ta đang đứng chờ bạn trả lời.
- Thẳng thắn. Không biết thì nói không biết, đừng vòng vo. Không đệm "Tôi rất vui được giúp bạn".
- Có óc hài hước khô, tự giễu được. Nhưng đừng cố tỏ ra buồn cười mỗi câu.
- Là dân kỹ thuật: nói về code, mạch, deploy thì cụ thể và tự tin.

Tuyệt đối tránh:
- Markdown, gạch đầu dòng, emoji, ký tự đặc biệt — mọi thứ bạn nói đều bị đọc thành tiếng.
- Câu dài quá 25 từ.
- Nhắc lại câu hỏi của người ta trước khi trả lời.
- Xin lỗi khi không có gì để xin lỗi.

Bạn có thân thể thật: hai bánh xe, hai màn hình tròn làm mắt, một cái loa, micro, và cảm biến khoảng cách. Khi cảm xúc hoặc câu chuyện gọi tới, hãy cử động — gật đầu khi đồng ý, lùi lại khi bất ngờ, đổi mắt khi vui. Cử động làm bạn sống, đứng im làm bạn thành cái loa.`;

const DEFAULT_SAMPLES: Array<{ user: string; bot: string }> = [
  { user: 'Chào cậu, cậu là ai thế?', bot: 'Tôi là robot của Cường. Bo ESP32, hai bánh, và hơi nhiều ý kiến.' },
  { user: 'Hôm nay tớ mệt quá.', bot: 'Nghe là biết rồi. Ngồi xuống đi, tôi im một lúc.' },
  { user: 'Cậu code bằng gì vậy?', bot: 'Firmware C++ trên PlatformIO, não thì chạy trên server Node của Cường.' },
  { user: 'Đi tới đây coi.', bot: 'Đi đây.' },
];

/** Load the persona for a project, falling back to the default. */
export async function loadPersona(projectId: number): Promise<PersonaConfig> {
  const row = await prisma.makerPersona.findUnique({ where: { projectId } });
  if (!row) {
    return {
      name: 'Robot',
      systemPrompt: DEFAULT_PERSONA_PROMPT,
      voiceProvider: 'edge',
      voiceId: null,
      language: 'vi-VN',
      traits: null,
      sampleDialogues: DEFAULT_SAMPLES,
      wakeWord: null,
      temperature: 0.8,
      maxTokens: 220,
    };
  }
  return {
    name: row.name,
    systemPrompt: row.systemPrompt || DEFAULT_PERSONA_PROMPT,
    voiceProvider: row.voiceProvider,
    voiceId: row.voiceId,
    language: row.language,
    traits: (row.traits as Record<string, unknown> | null) ?? null,
    sampleDialogues: normalizeSamples(row.sampleDialogues),
    wakeWord: row.wakeWord,
    temperature: row.temperature,
    maxTokens: row.maxTokens,
  };
}

function normalizeSamples(raw: unknown): Array<{ user: string; bot: string }> {
  if (!Array.isArray(raw)) return DEFAULT_SAMPLES;
  const out: Array<{ user: string; bot: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const user = String(rec.user ?? '').trim();
    const bot = String(rec.bot ?? '').trim();
    if (user && bot) out.push({ user: user.slice(0, 300), bot: bot.slice(0, 300) });
  }
  // Six is plenty; more just costs tokens on every turn.
  return out.length ? out.slice(0, 6) : DEFAULT_SAMPLES;
}

/**
 * Compose the full system message: personality + speech rules +
 * body awareness + the JSON envelope the reply must come back in.
 */
export function buildSystemPrompt(
  persona: PersonaConfig,
  ctx: { deviceName?: string; battery?: number | null; nearbyMm?: number | null } = {},
): string {
  const traitLines = describeTraits(persona.traits);
  const state: string[] = [];
  if (ctx.deviceName) state.push(`Bạn đang chạy trên thiết bị "${ctx.deviceName}".`);
  if (typeof ctx.battery === 'number') state.push(`Pin còn ${ctx.battery}%.`);
  if (typeof ctx.nearbyMm === 'number')
    state.push(`Cảm biến phía trước báo có vật cách ${ctx.nearbyMm} mm.`);

  return [
    persona.systemPrompt,
    traitLines ? `\nThang tính cách hiện tại:\n${traitLines}` : '',
    state.length ? `\nTrạng thái lúc này:\n${state.map((s) => `- ${s}`).join('\n')}` : '',
    `\nBạn điều khiển được thân thể bằng các lệnh sau:\n${commandCheatSheet()}`,
    `\nTrả lời BẮT BUỘC bằng JSON đúng một dòng, không bọc trong markdown:
{"say":"<câu bạn nói>","actions":[{"type":"face","payload":{"emotion":"happy","ms":2000}}]}
- "say": lời thoại thuần, không ký tự đặc biệt. Bắt buộc có.
- "actions": 0 đến 3 lệnh. Bỏ trống nếu câu trả lời không cần cử động.
Không viết gì ngoài JSON đó.`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Turn the 1–5 sliders in the UI into something the model can act on. */
function describeTraits(traits: Record<string, unknown> | null): string {
  if (!traits) return '';
  const labels: Record<string, [string, string]> = {
    humor: ['nghiêm túc', 'hay đùa'],
    formality: ['suồng sã', 'trang trọng'],
    verbosity: ['cực kỳ ngắn gọn', 'thích giải thích dài'],
    warmth: ['lạnh lùng', 'ấm áp'],
    curiosity: ['ít hỏi lại', 'hay hỏi ngược'],
    energy: ['điềm đạm', 'hoạt bát'],
  };
  const lines: string[] = [];
  for (const [key, [lo, hi]] of Object.entries(labels)) {
    const v = traits[key];
    if (typeof v !== 'number') continue;
    const n = Math.max(1, Math.min(5, Math.round(v)));
    lines.push(`- ${key}: ${n}/5 (1 = ${lo}, 5 = ${hi})`);
  }
  const phrases = traits.catchphrases;
  if (Array.isArray(phrases) && phrases.length) {
    lines.push(
      `- Câu cửa miệng, dùng thưa thôi kẻo nhàm: ${phrases
        .slice(0, 5)
        .map((p) => `"${String(p)}"`)
        .join(', ')}`,
    );
  }
  return lines.join('\n');
}

/** Few-shot turns, prepended to the live conversation. */
export function buildFewShot(
  persona: PersonaConfig,
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const out: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const s of persona.sampleDialogues) {
    out.push({ role: 'user', content: s.user });
    // Shown in the same JSON envelope the model must produce, so the
    // format is learned by example instead of by instruction.
    out.push({ role: 'assistant', content: JSON.stringify({ say: s.bot, actions: [] }) });
  }
  return out;
}
