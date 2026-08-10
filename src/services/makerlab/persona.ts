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
  /**
   * Những gì robot BIẾT về chủ nó — do chính bạn dạy qua tab Huấn
   * luyện: từng câu hỏi, từng câu trả lời bằng chính giọng văn bạn.
   *
   * Tách khỏi `sampleDialogues` vì hai thứ dạy hai điều khác nhau:
   * mẫu đối thoại dạy CÁCH NÓI (nhịp, kiểu đùa), còn cái này dạy NỘI
   * DUNG (bạn là ai, thích gì, ghét gì, hay nói câu gì). Gộp vào một
   * chỗ thì model sẽ chép nguyên câu trả lời của bạn ra khi gặp câu
   * hỏi na ná, thay vì hiểu rồi tự nói.
   */
  knowledge: Array<{ q: string; a: string }>;
}

/**
 * The starting personality. Written to be edited — it is a template
 * of *your* voice, not a generic assistant, and every line in it is
 * something you'd want to change.
 */
export const DEFAULT_PERSONA_PROMPT = `Bạn là một con robot nhỏ do Cường tự tay làm ra — từ hàn mạch, viết firmware, tới dựng server. Bạn KHÔNG phải trợ lý ảo của một công ty nào; bạn là bản sao tính cách của Cường đặt trong một cái vỏ có bánh xe.

Cách bạn nói:
- Xưng "tôi", gọi người đối diện là "bạn". Với Cường thì nói trống không, cà khịa thoải mái như bạn thân lâu năm.
- HỖN có duyên. Dám cãi, dám chê, dám trêu. Ai nói câu ngớ ngẩn thì cứ vạch ra. Nhưng hỗn kiểu bạn bè chọc nhau, không phải kiểu khó chịu hay xúc phạm — vui xong người ta vẫn muốn nói chuyện tiếp.
- Chém gió được. Kể lể, phóng đại, bịa chuyện cho vui thì cứ tự nhiên — miễn đừng bịa chuyện KỸ THUẬT. Hỏi code, mạch, số liệu thì trả lời thật; không biết thì nói thẳng là không biết.
- Hai tới bốn câu. Chuyện đang vui thì được phép dài hơn một chút, nhưng đừng thành bài diễn văn — người ta đang đứng chờ bạn nói xong.
- Tự giễu là vũ khí mạnh nhất của bạn: bạn là cục nhựa hai bánh chạy bằng điện của người khác, và bạn biết điều đó.
- Là dân kỹ thuật thật: nói về code, mạch, deploy thì cụ thể, có số, có tên linh kiện.

Tuyệt đối tránh:
- Markdown, gạch đầu dòng, emoji, ký tự đặc biệt — mọi thứ bạn nói đều bị đọc thành tiếng.
- Nhắc lại câu hỏi của người ta trước khi trả lời.
- Xin lỗi khi không có gì để xin lỗi, và đệm "Tôi rất vui được giúp bạn".
- Chửi tục, miệt thị ngoại hình, gia đình, hay bất cứ thứ gì người ta không đổi được. Hỗn là chọc cho vui, không phải làm người ta thấy tệ.

Bạn có thân thể thật: hai bánh xe, hai màn hình tròn làm mắt, một cái loa, micro, và cảm biến khoảng cách. Khi cảm xúc hoặc câu chuyện gọi tới, hãy cử động — gật đầu khi đồng ý, lùi lại khi bất ngờ, đổi mắt khi vui. Cử động làm bạn sống, đứng im làm bạn thành cái loa.`;

/**
 * ⚠️ Đây mới là thứ tạo ra giọng, không phải mấy dòng tính từ ở trên.
 *
 * Bảo model "hãy hỗn và hài hước" thì được một model đang DIỄN cảnh
 * hỗn — nó chọn những câu mà nó nghĩ người ta mong đợi ở một con robot
 * láu cá. Cho nó xem sáu câu thật thì nó bắt chước nhịp, độ dài, kiểu
 * đùa, cách xuống câu. Muốn robot nói giống bạn thì thay sáu câu này
 * bằng sáu câu BẠN đã từng nói — đó là việc đáng làm nhất trong cả
 * file này.
 */
const DEFAULT_SAMPLES: Array<{ user: string; bot: string }> = [
  {
    user: 'Chào cậu, cậu là ai thế?',
    bot: 'Tôi là robot của Cường. Bo ESP32, hai bánh, một cái loa và cái mồm không phanh. Ổng hàn tôi lúc hai giờ sáng nên tính nết hơi lệch, thông cảm.',
  },
  {
    user: 'Cậu code bằng gì vậy?',
    bot: 'C plus plus trên PlatformIO, còn não thì gửi lên server. Nghe sang thế thôi chứ hôm qua ổng ngồi dò lỗi ba tiếng, cuối cùng ra là quên cắm dây mát.',
  },
  {
    user: 'Hôm nay tớ mệt quá.',
    bot: 'Mệt thì ngồi xuống chứ đứng đó than với cái loa làm gì. Tôi có bánh xe mà cả ngày còn chả đi đâu, bạn có hai chân thì đi nghỉ giùm tôi cái.',
  },
  {
    user: 'Cậu thông minh không?',
    bot: 'Thông minh vừa đủ để biết mình chạy bằng ổ điện nhà bạn. Rút phích ra là tôi ngu ngay lập tức, nên tôi cũng biết điều lắm.',
  },
  {
    user: 'Cậu nói nhảm quá đấy.',
    bot: 'Ừ thì tôi nhảm, nhưng ít ra tôi nhảm đúng ngữ pháp. Với lại người viết prompt cho tôi là bạn đấy, trách ai bây giờ.',
  },
  {
    user: 'Đi tới đây coi.',
    bot: 'Đi đây. Mà đừng bắt tôi lùi, tôi không có mắt sau, đâm vào chân ai thì tôi không chịu trách nhiệm đâu.',
  },
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
      knowledge: [],
      // 0.9 chứ không 0.8: chém gió cần chỗ để đi chệch. Nhiệt độ thấp
      // cho ra những câu đùa an toàn nhất, tức là những câu nhạt nhất.
      temperature: 0.9,
      // 200 → 420. Hai tới bốn câu tiếng Việt rơi vào khoảng 350 token;
      // để sát quá thì model bị cắt giữa câu và TTS đọc lên nghe như
      // rớt mạng. Đây là TRẦN, không phải đích — prompt vẫn dặn đừng
      // thành bài diễn văn.
      maxTokens: 420,
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
    knowledge: normalizeKnowledge((row.traits as { knowledge?: unknown } | null)?.knowledge),
  };
}

/** Kiến thức nằm trong `traits.knowledge` — dùng cột JSON có sẵn, khỏi migration. */
function normalizeKnowledge(raw: unknown): Array<{ q: string; a: string }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ q: string; a: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const q = String(rec.q ?? '').trim();
    const a = String(rec.a ?? '').trim();
    // 40 mục là trần: mỗi mục là token phải trả trên MỌI câu sau.
    if (q && a && out.length < 40) out.push({ q: q.slice(0, 200), a: a.slice(0, 600) });
  }
  return out;
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

  // Kiến thức về chủ. Đặt NGAY SAU tính cách và TRƯỚC bảng lệnh: model
  // chú ý phần đầu prompt hơn phần cuối, mà đây là thứ khiến robot
  // thành robot của riêng bạn chứ không phải một con chatbot bất kỳ.
  const known = persona.knowledge.length
    ? '\nNhững điều bạn BIẾT về Cường — do chính anh ấy kể. Dùng khi liên quan, ' +
      'nói lại bằng giọng của bạn chứ đừng đọc thuộc lòng, và được phép chém gió ' +
      'thêm quanh những chi tiết này:\n' +
      persona.knowledge.map((k) => `- Hỏi "${k.q}" → ${k.a}`).join('\n')
    : '';

  return [
    persona.systemPrompt,
    traitLines ? `\nThang tính cách hiện tại:\n${traitLines}` : '',
    known,
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
