/**
 * My Language — memory aids for a single kana.
 *
 * Split by what each side is actually good at:
 *
 *   - WHICH kana get confused is a closed, well-known list — シ/ツ, ソ/ン,
 *     ね/れ/わ, め/ぬ. It is answered from the table below, not by the model:
 *     the answer is already known, and a model asked "what looks like ツ?"
 *     will sooner or later volunteer something that does not.
 *   - HOW to remember one is writing, not lookup. That is the model's half.
 *
 * So the confusables ship as data and the mnemonic is generated, and the two
 * are never confused for each other.
 */
import { BadRequestError, ForbiddenError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { isProEffective } from './pro.service.js';
import { looseJson } from './myLanguage.ai.service.js';

export interface KanaTip {
  char: string;
  romaji: string;
  /** One image that ties the SHAPE to the sound. */
  mnemonic: string;
  /** How the strokes go, in words. */
  strokeTip: string;
  /** Pairs that are genuinely mixed up, with what separates them. */
  confusable: Array<{ char: string; romaji: string; how: string }>;
  /** Words a beginner already knows, to see it in use. */
  examples: Array<{ word: string; reading: string; meaningVi: string }>;
}

/**
 * The kana pairs learners actually confuse, and the tell that separates them.
 *
 * Hand-written on purpose: this is the part where being wrong teaches a learner
 * the wrong thing, and it is small enough to be right.
 */
const CONFUSABLE: Record<string, Array<{ char: string; how: string }>> = {
  // The classic four. Direction of the short strokes is the whole answer.
  'シ': [{ char: 'ツ', how: 'シ viết nét cuối từ DƯỚI lên, 2 nét nhỏ nằm NGANG. ツ nét cuối từ TRÊN xuống, 2 nét nhỏ ĐỨNG.' }],
  'ツ': [{ char: 'シ', how: 'ツ 2 nét nhỏ ĐỨNG, viết từ trên xuống. シ 2 nét nhỏ NGANG, nét cuối hất từ dưới lên.' }],
  'ソ': [{ char: 'ン', how: 'ソ nét dài đi từ TRÊN xuống dưới-trái. ン nét dài hất từ DƯỚI lên trên-phải.' }, { char: 'リ', how: 'リ có 2 nét thẳng đứng song song, ソ chỉ có 1 nét xiên.' }],
  'ン': [{ char: 'ソ', how: 'ン hất từ DƯỚI lên (như チ của "n"). ソ đâm từ TRÊN xuống.' }],
  'ね': [{ char: 'れ', how: 'ね đuôi CUỘN TRÒN lại. れ đuôi hất thẳng ra ngoài, không cuộn.' }, { char: 'わ', how: 'わ đuôi cong nhẹ vào trong, không cuộn kín như ね.' }],
  'れ': [{ char: 'ね', how: 'れ đuôi hất RA NGOÀI. ね đuôi cuộn tròn vào.' }, { char: 'わ', how: 'わ đuôi cong VÀO, れ hất RA.' }],
  'わ': [{ char: 'ね', how: 'ね cuộn tròn kín ở đuôi, わ chỉ cong nhẹ.' }, { char: 'れ', how: 'れ hất ra ngoài, わ cong vào trong.' }],
  'め': [{ char: 'ぬ', how: 'ぬ có VÒNG CUỘN ở cuối, め thì không.' }],
  'ぬ': [{ char: 'め', how: 'め kết thúc bằng nét thẳng, ぬ có vòng cuộn thêm.' }],
  'る': [{ char: 'ろ', how: 'る có VÒNG TRÒN nhỏ ở cuối, ろ kết thúc trơn không vòng.' }],
  'ろ': [{ char: 'る', how: 'る cuộn thành vòng ở cuối, ろ thì dừng luôn.' }],
  'は': [{ char: 'ほ', how: 'ほ có THÊM một nét ngang ở trên so với は.' }],
  'ほ': [{ char: 'は', how: 'は thiếu nét ngang trên cùng mà ほ có.' }],
  'さ': [{ char: 'き', how: 'き có 2 nét ngang, さ chỉ có 1.' }],
  'き': [{ char: 'さ', how: 'さ chỉ 1 nét ngang, き có 2.' }],
  'コ': [{ char: 'ユ', how: 'ユ nét ngang nằm DƯỚI, コ nét ngang nằm TRÊN.' }],
  'ユ': [{ char: 'コ', how: 'コ mở sang phải ở dưới, ユ có nét ngang chân.' }],
  'ク': [{ char: 'ケ', how: 'ケ có thêm nét xiên ngắn bên trái, ク thì không.' }, { char: 'タ', how: 'タ có thêm 1 nét xiên bên trong.' }],
  'ケ': [{ char: 'ク', how: 'ク không có nét xiên ngắn đầu bên trái.' }],
  'タ': [{ char: 'ク', how: 'ク không có nét gạch bên trong bụng chữ.' }, { char: 'ノ', how: 'ノ chỉ có đúng 1 nét.' }],
  'ア': [{ char: 'マ', how: 'マ nét dưới đi từ giữa xuống, ア có nét móc bên trái.' }],
  'マ': [{ char: 'ア', how: 'ア có móc câu ở nét cuối, マ thì thẳng.' }],
  'チ': [{ char: 'テ', how: 'テ có 2 nét ngang SONG SONG ở trên, チ chỉ có 1 nét xiên.' }],
  'テ': [{ char: 'チ', how: 'チ nét trên là nét xiên ngắn, không phải nét ngang.' }],
  'フ': [{ char: 'ワ', how: 'ワ có nét đứng bên trái tạo thành ô, フ chỉ 1 nét gấp.' }, { char: 'ラ', how: 'ラ có thêm nét ngang ngắn ở trên.' }],
  'ワ': [{ char: 'フ', how: 'フ không có nét đứng bên trái.' }, { char: 'ウ', how: 'ウ có dấu chấm-nét ở đỉnh.' }],
  'ウ': [{ char: 'ワ', how: 'ワ không có nét nhỏ trên đỉnh.' }],
  'い': [{ char: 'り', how: 'り 2 nét DÍNH nhau ở trên và dài xuống, い 2 nét rời và ngắn.' }],
  'り': [{ char: 'い', how: 'い 2 nét tách rời, り nét phải kéo dài xuống móc.' }],
  'た': [{ char: 'な', how: 'な có vòng cuộn nhỏ ở góc dưới phải, た thì không.' }],
  'な': [{ char: 'た', how: 'た không có vòng cuộn cuối.' }],
};

const ROMAJI: Record<string, string> = {
  'シ': 'shi', 'ツ': 'tsu', 'ソ': 'so', 'ン': 'n', 'リ': 'ri', 'ね': 'ne', 'れ': 're', 'わ': 'wa',
  'め': 'me', 'ぬ': 'nu', 'る': 'ru', 'ろ': 'ro', 'は': 'ha', 'ほ': 'ho', 'さ': 'sa', 'き': 'ki',
  'コ': 'ko', 'ユ': 'yu', 'ク': 'ku', 'ケ': 'ke', 'タ': 'ta', 'ノ': 'no', 'ア': 'a', 'マ': 'ma',
  'チ': 'chi', 'テ': 'te', 'フ': 'fu', 'ワ': 'wa', 'ラ': 'ra', 'ウ': 'u', 'い': 'i', 'り': 'ri',
  'た': 'ta', 'な': 'na',
};

/** The known-confusable set for one kana. Pure lookup — no model involved. */
export function confusablesFor(char: string): Array<{ char: string; romaji: string; how: string }> {
  return (CONFUSABLE[char] ?? []).map((c) => ({ char: c.char, romaji: ROMAJI[c.char] ?? '', how: c.how }));
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const KANA_RE = /^[぀-ゟ゠-ヿ]$/u;

/** AI memory aid for one kana (Pro). Confusables are attached from the table. */
export async function kanaTip(userId: number, body: { char?: string; romaji?: string }): Promise<KanaTip> {
  const char = str(body?.char);
  if (!KANA_RE.test(char)) throw new BadRequestError('Chỉ nhận đúng 1 ký tự kana.');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Mẹo nhớ AI dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const romaji = str(body?.romaji) || ROMAJI[char] || '';
  const known = confusablesFor(char);

  const system =
    'Bạn dạy bảng chữ cái tiếng Nhật cho người Việt mới bắt đầu. Với MỘT chữ kana, trả về:\n' +
    '- "mnemonic": MỘT câu tiếng Việt nối HÌNH DÁNG chữ với ÂM đọc của nó. Phải bám vào nét chữ thật ' +
    '(ví dụ き trông như cái chìa khoá — "key" — đọc là "ki"). Không nói chung chung.\n' +
    '- "strokeTip": thứ tự viết nét, mô tả ngắn bằng tiếng Việt (viết nét nào trước, hướng nào).\n' +
    '- "examples": 2–3 TỪ THÔNG DỤNG cho người mới, CÓ CHỨA chữ này. reading = hiragana.\n' +
    'CHỈ trả JSON gọn: {"mnemonic":string,"strokeTip":string,"examples":[{"word":string,"reading":string,"meaningVi":string}]}. ' +
    'Không có chữ nào ngoài JSON.';

  const user =
    `Chữ kana: ${char}${romaji ? ` (đọc: ${romaji})` : ''}\n` +
    // Told, not asked: the model's job is the mnemonic, and handing it the
    // confusables stops it from inventing a different, wrong set.
    (known.length ? `Chữ này hay bị nhầm với: ${known.map((k) => k.char).join(', ')} — có thể nhắc tới trong mẹo nhớ.\n` : '');

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'generation',
      // 'language', not a new value: this IS language AI, and the admin's
      // Ngôn ngữ analytics counts that feature — a bespoke tag would hide it.
      feature: 'language',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 700,
      maxRetries: 1,
      timeoutMs: 45_000,
      userId,
    });
    raw = res.text;
  } catch {
    throw new BadRequestError('Gia sư AI đang bận, thử lại sau giây lát nhé.');
  }

  const o = looseJson(raw) as Record<string, unknown>;
  const examples = (Array.isArray(o.examples) ? o.examples : [])
    .map((e) => {
      const eo = (e ?? {}) as Record<string, unknown>;
      const word = str(eo.word);
      // An example that does not contain the kana shows nothing about it.
      if (!word || !word.includes(char)) return null;
      return { word: word.slice(0, 40), reading: str(eo.reading).slice(0, 60), meaningVi: str(eo.meaningVi).slice(0, 120) };
    })
    .filter((e): e is { word: string; reading: string; meaningVi: string } => e != null)
    .slice(0, 3);

  const mnemonic = str(o.mnemonic).slice(0, 500);
  if (!mnemonic) throw new BadRequestError('Chưa đọc được kết quả, thử lại nhé.');

  return { char, romaji, mnemonic, strokeTip: str(o.strokeTip).slice(0, 300), confusable: known, examples };
}
