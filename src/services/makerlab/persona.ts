import { CHE_DO, laCheDo, type CheDo } from './cheDo.js';
import { laNao, type Nao } from './nao.js';
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
  /** Dự án nào — khoá để tra đúng kho kiến thức của robot này (kienThuc.ts). */
  projectId: number;
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
  /**
   * Tốc độ đọc, 0,25–4,0 (1 = bình thường). Chỉ Google Cloud dùng.
   *
   * Cất trong `traits` chứ không phải một cột riêng, vì thêm cột nghĩa
   * là thêm migration — mà `prisma migrate dev` hỏng sẵn trong repo này
   * (xem CLAUDE.md), nên mỗi cột mới là một file SQL viết tay. Không
   * đáng cho một con số tuỳ chọn, trong khi `traits` đã là chỗ chứa
   * JSON sẵn có và đang giữ `knowledge`.
   */
  speechRate: number;
  /** Chế độ tiếng đang bật: vi | en | robot. */
  cheDo: CheDo;
  /**
   * Giọng RIÊNG cho từng chế độ tiếng.
   *
   * ⚠️ MỘT Ô GIỌNG CHUNG CHO BA CHẾ ĐỘ LÀ SAI NGAY TỪ Ý TƯỞNG.
   *
   * Bản trước chỉ có `voiceId` chung. Chế độ Anh/Robot ép giọng của
   * riêng nó nên chạy được, còn chế độ Việt dùng ô chung — và ô đó bị
   * xoá trắng thì tiếng Việt tụt xuống giọng Google, thứ cắt văn bản
   * thành mẩu ~200 ký tự rồi dán lại.
   *
   * Người dùng nghe ra ba triệu chứng rời rạc: "nói lắp", "lặp lại từ",
   * và "quay lại tiếng Việt thì thành giọng mặc định chứ không phải
   * giọng tôi đã lưu". Cả ba là MỘT gốc.
   *
   * Tách theo chế độ thì đổi qua đổi lại không bao giờ mất giọng của
   * chế độ kia, và mỗi chế độ chọn được giọng hợp với nó.
   */
  giongTheoCheDo: Partial<Record<CheDo, string>> | null;
  /** Âm lượng loa 10-100, lưu bền để bo mất điện vẫn nhớ. */
  amLuong: number;
  /**
   * Não đang dùng: `'may-nha'` | `'cong'` | `null` (theo cấu hình máy chủ).
   *
   * Ghim ở đây ĐÈ LÊN `LLM_LOCAL_PURPOSES`. Có nó thì người dùng quay về
   * model cũ được ngay bằng một câu nói, không cần deploy — đúng thứ cần
   * khi model mới nói không vừa ý giữa chừng.
   */
  nao: Nao | null;
}

/**
 * Lọc bảng giọng-theo-chế-độ đọc từ cột JSON.
 *
 * `traits` là JSON tự do — bất cứ thứ gì cũng có thể nằm trong đó, kể cả
 * số, mảng, hay `null`. Tin thẳng vào nó là mời một `voiceId` kiểu số
 * đi thẳng xuống máy đọc.
 */
function chuanGiongTheoCheDo(raw: unknown): Partial<Record<CheDo, string>> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const ra: Partial<Record<CheDo, string>> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (laCheDo(k) && typeof v === 'string' && v.trim()) ra[k] = v.trim().slice(0, 120);
  }
  return Object.keys(ra).length ? ra : null;
}

/** Kẹp tốc độ đọc về dải Google chấp nhận; ngoài dải là API trả 400. */
function normalizeSpeechRate(raw: unknown): number {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.max(0.25, Math.min(4, n));
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
/**
 * Đè giọng + nhà cung cấp của CHẾ ĐỘ lên persona.
 *
 * ⚠️ PHẢI LÀM Ở ĐÂY, KHÔNG PHẢI Ở TỪNG CHỖ GỌI.
 *
 * `voiceLoop.ts` gọi máy đọc ở BA chỗ: đường luồng, đường dự phòng khi
 * luồng hỏng, và đường nói câu chào lúc đổi chế độ. Bản trước chỉ có
 * đường luồng biết tới chế độ; hai đường kia đọc thẳng `persona.voiceId`
 * nên vẫn dùng giọng Việt để đọc tiếng Anh — mà chúng chỉ chạy lúc có
 * sự cố, tức đúng lúc không ai ngồi soi log.
 *
 * Giải ngay chỗ nạp thì mọi chỗ gọi ĐÃ đúng sẵn, và chỗ gọi thứ tư thêm
 * sau này cũng đúng mà không cần ai nhớ.
 */
function apCheDo(p: PersonaConfig): PersonaConfig {
  const cf = CHE_DO[p.cheDo];
  // Thứ tự ưu tiên: giọng người dùng chọn RIÊNG cho chế độ này → giọng
  // mặc định của chế độ → giọng chung trong persona.
  const rieng = p.giongTheoCheDo?.[p.cheDo] || null;
  const giong = rieng ?? cf.giong ?? p.voiceId;
  if (!giong && !cf.nhaCungCap && !cf.ngonNgu) return p;
  return {
    ...p,
    voiceId: giong,
    voiceProvider: cf.nhaCungCap ?? p.voiceProvider,
    // Ngôn ngữ đi theo chế độ, không theo cấu hình gốc của persona. Lưới
    // đỡ Google lấy trường này — để nguyên `vi-VN` là nó đọc tiếng Anh
    // bằng âm tiếng Việt.
    language: cf.ngonNgu ?? p.language,
  };
}

export async function loadPersona(projectId: number): Promise<PersonaConfig> {
  const row = await prisma.makerPersona.findUnique({ where: { projectId } });
  if (!row) {
    return apCheDo({
      projectId,
      name: 'Robot',
      systemPrompt: DEFAULT_PERSONA_PROMPT,
      voiceProvider: 'edge',
      voiceId: null,
      language: 'vi-VN',
      traits: null,
      sampleDialogues: DEFAULT_SAMPLES,
      wakeWord: null,
      knowledge: [],
      speechRate: 1,
      cheDo: 'vi',
      giongTheoCheDo: null,
      amLuong: 50,
      nao: null,
      // 0.9 chứ không 0.8: chém gió cần chỗ để đi chệch. Nhiệt độ thấp
      // cho ra những câu đùa an toàn nhất, tức là những câu nhạt nhất.
      temperature: 0.9,
      // 200 → 420. Hai tới bốn câu tiếng Việt rơi vào khoảng 350 token;
      // để sát quá thì model bị cắt giữa câu và TTS đọc lên nghe như
      // rớt mạng. Đây là TRẦN, không phải đích — prompt vẫn dặn đừng
      // thành bài diễn văn.
      maxTokens: 420,
    });
  }
  return apCheDo({
    projectId,
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
    speechRate: normalizeSpeechRate((row.traits as { speechRate?: unknown } | null)?.speechRate),
    // Chế độ tiếng nằm cùng chỗ với tốc độ đọc — cột JSON có sẵn, khỏi
    // migration, và sống sót qua restart. Để trong bộ nhớ tiến trình thì
    // mỗi lần deploy robot lại quay về tiếng Việt mà không ai hiểu vì sao.
    amLuong: (() => {
      const v = Number((row.traits as { amLuong?: unknown } | null)?.amLuong);
      return Number.isFinite(v) && v > 0 ? Math.max(10, Math.min(100, v)) : 50;
    })(),
    cheDo: laCheDo((row.traits as { cheDo?: unknown } | null)?.cheDo)
      ? ((row.traits as { cheDo: CheDo }).cheDo)
      : 'vi',
    giongTheoCheDo: chuanGiongTheoCheDo(
      (row.traits as { giongTheoCheDo?: unknown } | null)?.giongTheoCheDo,
    ),
    nao: laNao((row.traits as { nao?: unknown } | null)?.nao)
      ? ((row.traits as { nao: Nao }).nao)
      : null,
  });
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
  ctx: {
    deviceName?: string;
    battery?: number | null;
    nearbyMm?: number | null;
    ssid?: string | null;
    rssi?: number | null;
    pingMs?: number | null;
  } = {},
): string {
  const traitLines = describeTraits(persona.traits);
  const state: string[] = [];

  // ── Thời gian thực ──
  //
  // Model không có đồng hồ. Không nói cho nó biết thì hỏi "mấy giờ rồi"
  // nó sẽ BỊA một con số nghe rất tự tin — tệ hơn là nói "tôi không
  // biết", vì người nghe tin theo.
  //
  // ⚠️ Bắt buộc ghi rõ `timeZone`. Container chạy giờ UTC còn người
  // dùng ở +07, nên để mặc định là robot lệch đúng bảy tiếng — và lệch
  // bảy tiếng thì buổi sáng thành nửa đêm, lời chào sai hết.
  const now = new Date();
  const gio = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  const h = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      hour12: false,
    }).format(now),
  );
  const buoi =
    h < 5 ? 'đêm khuya' : h < 11 ? 'buổi sáng' : h < 14 ? 'buổi trưa' : h < 18 ? 'buổi chiều' : 'buổi tối';
  state.push(
    `BÂY GIỜ là ${gio} (giờ Việt Nam), đang là ${buoi}. ` +
      `Hỏi giờ hay ngày thì trả lời theo đúng con số này, đừng đoán. ` +
      // ⚠️ "đừng đoán" không chặn được việc LÀM TRÒN. Đo 13/08/2026 lúc
      //    07:47, model 9B nói "mới bảy rưỡi sáng" — nó không đoán, nó
      //    làm tròn cho tự nhiên, và sai 17 phút. Phải cấm riêng.
      //
      // ⛔ VÀ TUYỆT ĐỐI KHÔNG ĐƯỢC VIẾT MỘT GIỜ CỤ THỂ LÀM VÍ DỤ Ở ĐÂY.
      //    Bản vá đầu tiên ghi: `07:47 là "bảy giờ bốn mươi bảy"`. Model 9B
      //    liền CHÉP LUÔN VÍ DỤ: đề bài ghi 08:34 mà nó vẫn khai "bảy giờ
      //    bốn mươi bảy", sai 47 phút, và sai y hệt nhau qua nhiều lần
      //    chạy nên nhìn cứ như lỗi bộ nhớ đệm — restart server vẫn thế.
      //    Một con số trông giống dữ liệu, đặt cạnh dữ liệu thật, thì model
      //    nhỏ đọc nó NHƯ dữ liệu. Luật phải trỏ về con số ở trên, không
      //    được mang theo con số của riêng nó.
      `Đọc ĐÚNG cả số giờ lẫn số phút ghi ngay trên, không làm tròn: ` +
      `không nói "rưỡi", không nói "gần", không bỏ phút. ` +
      `Chào hỏi cũng nên hợp buổi.`,
  );

  if (ctx.deviceName) state.push(`Bạn đang chạy trên thiết bị "${ctx.deviceName}".`);
  if (typeof ctx.battery === 'number') state.push(`Pin còn ${ctx.battery}%.`);
  if (typeof ctx.nearbyMm === 'number')
    state.push(`Cảm biến phía trước báo có vật cách ${ctx.nearbyMm} mm.`);

  // Mạng. Đổi dBm sang chữ NGƯỜI hiểu ngay tại đây, đừng đưa con số thô
  // cho model rồi mong nó tự diễn giải — model sẽ nói "âm bốn mươi hai
  // dBm" và người nghe không rút ra được gì. Mốc lấy theo thang quen
  // dùng của WiFi: trên -50 rất mạnh, dưới -80 gần như không dùng được.
  if (ctx.ssid) {
    const suc =
      typeof ctx.rssi !== 'number'
        ? ''
        : ctx.rssi > -50
          ? ', sóng rất mạnh'
          : ctx.rssi > -60
            ? ', sóng mạnh'
            : ctx.rssi > -70
              ? ', sóng khá'
              : ctx.rssi > -80
                ? ', sóng yếu'
                : ', sóng rất yếu, hay rớt';
    const tre =
      typeof ctx.pingMs === 'number'
        ? `, tới server mất ${ctx.pingMs} mili giây${ctx.pingMs < 50 ? ' (nhanh)' : ctx.pingMs < 200 ? '' : ' (chậm)'}`
        : '';
    state.push(`Đang nối WiFi "${ctx.ssid}"${suc}${tre}.`);
  }

  // ⚠️ Dạy model cách xử lý yêu cầu đổi WiFi — nếu không nói, nó sẽ tự
  // nghĩ ra cách tệ nhất. Đo thật 12/08/2026: người dùng nói "kết nối
  // một wifi mới đi", model bảo họ ĐỌC CHÍNH TẢ tên mạng và mật khẩu.
  // Không ai đọc nổi "TP-Link_5332" hay một mật khẩu có ký tự lạ, và
  // sai một ký tự thì hỏng mà không biết sai ở đâu.
  state.push(
    'Ai muốn nối WiFi mới thì phát lệnh `wifi_portal` — TUYỆT ĐỐI đừng bắt họ ' +
      'đọc tên mạng hay mật khẩu cho mày nghe. Lệnh đó làm robot phát ra một WiFi ' +
      'riêng để họ vào cài bằng bàn phím điện thoại. Nói cho họ biết: nối vào WiFi ' +
      '"Mini-Me-Setup", mật khẩu 12345678, rồi trang cài đặt tự hiện lên. Cài xong ' +
      'robot nhớ luôn mạng đó, lần sau tới nơi là tự vào.',
  );

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
    // ⚠️ NHẮC NGÔN NGỮ ĐẶT NGAY SAU tính cách, TRƯỚC mọi thứ khác.
    //
    // Đặt ở cuối prompt thì model đã đọc xong cả đoạn tiếng Việt mô tả
    // tính cách rồi mới gặp lệnh "reply in English" — và nó hay bỏ qua,
    // trả lời tiếng Việt như thường. Triệu chứng khó chịu ở chỗ nó KHÔNG
    // sai hẳn: robot nghe tiếng Anh, hiểu đúng, rồi đáp bằng tiếng Việt.
    `\n${CHE_DO[persona.cheDo].nhacLlm}`,
    traitLines ? `\nThang tính cách hiện tại:\n${traitLines}` : '',
    known,
    state.length ? `\nTrạng thái lúc này:\n${state.map((s) => `- ${s}`).join('\n')}` : '',
    `\nBạn điều khiển được thân thể bằng các lệnh sau:\n${commandCheatSheet()}`,
    // ⚠️ Hai luật dưới đây sinh ra từ phép đo 13/08/2026, khi so model cục
    //    bộ 9B với model của cổng. Model to tự biết mấy điều này; model nhỏ
    //    thì KHÔNG, và nó hỏng theo đúng hai kiểu ghi ở đây.
    `\nBA LUẬT VỀ CÁCH LÀM VIỆC:

1. AI BẢO LÀM GÌ BẰNG THÂN THỂ THÌ PHẢI RA ĐÚNG LỆNH ĐÓ, ngay lượt này.
   "Nhảy một bài đi" ⇒ actions PHẢI có {"type":"dance"}. Không được hứa
   suông kiểu "đợi bật nhạc lên rồi tao nhảy" rồi để actions trống — người
   ta bảo nhảy là muốn thấy nhảy, không phải nghe kể về việc nhảy.
   Cãi được, cà khịa được, nhưng vẫn phải ra lệnh. Hỗn là ở lời nói, không
   phải ở chỗ không làm.

2. TỤC NGỮ, THÀNH NGỮ, CA DAO: KHÔNG THUỘC THÌ NÓI LÀ KHÔNG THUỘC.
   Bịa nửa câu tục ngữ nghe rất trôi chảy nên người nghe tin ngay, và đó
   là kiểu sai tệ nhất. Không chắc chắn từng chữ vế sau thì nói thẳng
   "tao không nhớ chính xác", cà khịa một câu rồi thôi — đừng ghép đại
   mấy chữ cho có vần. Chỉ đọc nguyên văn khi chắc chắn, hoặc khi đoạn
   tra cứu ở trên có sẵn câu đó.

3. AI XIN NÓI DÀI THÌ NÓI DÀI THẬT — VÀ CHỈ KHI ĐƯỢC XIN.
   "Kể dài vào", "giải thích kỹ", "kể tao nghe hết đi" ⇒ viết ít nhất 6-8
   câu, có đầu có đuôi, có ví von, kể tới nơi tới chốn rồi mới dừng. Đừng
   bỏ câu giữa chừng.
   Còn lại — tán gẫu, chào hỏi, than vãn, sai việc — giữ NGẮN đúng thang
   verbosity ở trên, một hai câu là đủ. "Tao mệt quá" không phải lời mời
   diễn thuyết. Luật dài chỉ bật khi người ta nói rõ là muốn dài; nó không
   phải giấy phép để câu nào cũng nói tràng giang.`,
    `\nTrả lời BẮT BUỘC bằng JSON đúng một dòng, không bọc trong markdown:
{"say":"<câu bạn nói>","actions":[{"type":"face","payload":{"emotion":"happy","ms":2000}}]}
- "say": lời thoại thuần, không ký tự đặc biệt. Bắt buộc có.
- "actions": 0 đến 3 lệnh. Bỏ trống nếu câu trả lời không cần cử động.
Không viết gì ngoài JSON đó.`,
    // ⚠️ NHẮC LẠI NGÔN NGỮ Ở CUỐI — chỉ khi KHÔNG phải tiếng Việt.
    //
    // Câu nhắc ở đầu prompt là cần nhưng KHÔNG đủ. Giữa nó và câu người
    // dùng còn ~5.000 ký tự TIẾNG VIỆT: tính cách, thang trait, trạng thái,
    // bảng lệnh, ba luật, hợp đồng JSON. Model đọc hết bức tường tiếng Việt
    // đó rồi mới tới lượt nói — và model 9B đáp lại bằng thứ tiếng nó vừa
    // đọc nhiều nhất. Đo 13/08/2026: chế độ EN, bị hỏi bằng tiếng Việt thì
    // 1 trong 3 lần nó đáp tiếng Việt.
    //
    // Không dịch cả prompt sang tiếng Anh: người sửa persona là người Việt,
    // và tính cách viết bằng tiếng Việt mới ra đúng giọng. Rẻ hơn là đặt
    // câu nhắc ở chỗ GẦN câu hỏi nhất — vị trí model chú ý nhất.
    persona.cheDo === 'vi'
      ? ''
      : `\n${CHE_DO[persona.cheDo].nhacLlm}\nThis rule beats everything above. The persona, the rules and the command list are written in Vietnamese for the author's convenience — that is NOT permission to answer in Vietnamese. Even if the person speaks to you in Vietnamese, the "say" field MUST be in English.`,
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
  // ⛔ CHẾ ĐỘ KHÔNG PHẢI TIẾNG VIỆT: KHÔNG GỬI FEW-SHOT.
  //
  // `sampleDialogues` viết bằng tiếng Việt. Ở chế độ EN, chúng biến thành
  // sáu ví dụ dạy model rằng "người hỏi kiểu này → trả lời BẰNG TIẾNG VIỆT".
  // Và đúng như ghi ở đầu file: few-shot mạnh hơn tính từ — nó cũng mạnh hơn
  // cả câu lệnh "Reply ENTIRELY in English".
  //
  // Đo thật 13/08/2026, cùng một câu hỏi, chỉ đổi mỗi biến này:
  //     giữ few-shot tiếng Việt      → giữ được tiếng Anh  1/8
  //     bỏ few-shot                  → giữ được tiếng Anh  7/8
  //     giữ few-shot + nhắc thêm     → giữ được tiếng Anh  5/8
  // Nhắc thêm bao nhiêu lần cũng không thắng nổi sáu ví dụ ngược chiều.
  //
  // Cái mất: ở chế độ EN robot nói nhạt hơn, vì giọng riêng nằm trong mấy
  // ví dụ đó. Chấp nhận được — nói nhạt bằng đúng thứ tiếng vẫn hơn nói
  // duyên bằng thứ tiếng người nghe không hiểu.
  //
  // Cách sửa tử tế về sau: thêm `sampleDialoguesEn` vào `MakerPersona` để
  // chủ tự viết vài cặp thoại tiếng Anh, rồi chọn bộ theo `cheDo`.
  if (persona.cheDo !== 'vi') return [];

  const out: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const s of persona.sampleDialogues) {
    out.push({ role: 'user', content: s.user });
    // Shown in the same JSON envelope the model must produce, so the
    // format is learned by example instead of by instruction.
    out.push({ role: 'assistant', content: JSON.stringify({ say: s.bot, actions: [] }) });
  }
  return out;
}
