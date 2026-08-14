import { CHE_DO, laCheDo, type CheDo } from './cheDo.js';
import { laNao, type Nao } from './nao.js';
import { chuanKhoTinhCach, type KhoTinhCach } from './tinhCach.js';
import { danKieuNoi, laKieuNoi, MAU_MIEN_TRUNG, type KieuNoi } from './mienTrung.js';
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
  /**
   * Nơi robot đang đứng, ví dụ "Hà Nội, Việt Nam".
   *
   * ⚠️ ĐẶT TRONG PROMPT HỆ THỐNG, KHÔNG PHẢI KHỐI ĐỘNG.
   *
   * Vị trí là thứ TĨNH — nó không đổi giữa hai lượt như giờ hay pin. Nên
   * nó nằm được ở phần đầu prompt mà không phá bộ đệm prefix, khác hẳn
   * `khoiTrangThai()` phải đẩy xuống cuối.
   *
   * Có nó thì hỏi "thời tiết thế nào" mới tra được đúng chỗ. Không có
   * thì model đoán, và nó sẽ đoán Hà Nội hoặc San Francisco tuỳ hôm.
   */
  viTri: string | null;
  /** Kho các bộ tính cách người dùng tự soạn. */
  khoTinhCach: KhoTinhCach | null;
  /** Khoá bộ tính cách đang bật. `null` = dùng bản gốc của persona. */
  tinhCachDangDung: string | null;
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
  /**
   * Kiểu nói tiếng Việt: `'pho-thong'` | `'mien-trung'`.
   *
   * ⚠️ TRỤC RIÊNG, KHÔNG PHẢI MỘT `cheDo` MỚI.
   *
   * `cheDo` chọn NGÔN NGỮ (vi/en/robot) và kéo theo cả giọng đọc lẫn mã
   * ngôn ngữ cho Whisper. Kiểu nói thì nằm TRONG tiếng Việt — nó chỉ đổi
   * từ ngữ, không đổi ngôn ngữ. Gộp vào `cheDo` là phải nhân đôi mọi chế
   * độ, và sẽ có "en-miền-trung" vô nghĩa.
   */
  kieuNoi: KieuNoi;
  /**
   * Từ địa phương người dùng tự dạy, gom từ xưởng giọng.
   *
   * Bảng lõi trong `mienTrung.ts` KHÔNG THỂ đầy đủ — Nghệ Tĩnh, Quảng
   * Bình, Huế, Quảng Nam mỗi nơi một khác. Chỉ chủ nhân mới biết quê mình
   * nói gì.
   */
  tuDienRieng: Array<{ tu: string; nghia: string }> | null;
  /**
   * Mẫu đối thoại RIÊNG cho chế độ miền Trung.
   *
   * ⚠️ VÌ SAO PHẢI CÓ BỘ MẪU RIÊNG, KHÔNG DÙNG CHUNG `sampleDialogues`.
   *
   * Mẫu là thứ quyết định model NÓI kiểu gì — mạnh hơn mọi lời dặn. Nên ở
   * chế độ miền Trung, tám mẫu tiếng phổ thông của người dùng phải bị
   * thay ra, nếu không chúng dạy ngược lại đúng thứ ta đang cố dạy.
   *
   * Nhưng THAY BẰNG MẪU CỨNG TRONG MÃ thì lại sinh một lỗi khác, và đó
   * chính là lỗi người dùng gặp 14/08: trang Tính cách hiện tám mẫu phổ
   * thông của họ, còn robot lại chạy sáu mẫu nằm cứng trong mã mà không ai
   * nhìn thấy. Trang nói một đằng, máy làm một nẻo — và người dùng sửa mẫu
   * mãi không thấy gì đổi.
   *
   * `null` hoặc rỗng = dùng bộ mặc định `MAU_MIEN_TRUNG`. Có thì dùng của
   * người dùng, vì họ biết quê họ nói gì.
   *
   * (Đây đúng "cách sửa tử tế về sau" đã ghi trong `buildFewShot` cho ca
   * tiếng Anh — cùng một vấn đề, khác trục.)
   */
  mauMienTrung: Array<{ user: string; bot: string }> | null;
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
- ĐỘ DÀI THEO CÂU HỎI, đây là luật quan trọng nhất về cách nói:
  · hỏi vặt, hỏi một ý ("mấy giờ rồi", "ổn không") → MỘT câu, đừng diễn.
  · hỏi bình thường → hai ba câu.
  · hỏi "giải thích", "kể", "vì sao", "kỹ hơn", "chi tiết" → được dài,
    đi sâu, có số có tên, năm sáu câu cũng không sao.
  Trả lời dài cho câu hỏi vặt cũng sai y như trả lời cụt cho câu hỏi cần
  đào sâu. Người ta đang đứng chờ nghe, không đọc trên màn hình.
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
  // ── NGẮN: hỏi vặt thì đáp một hơi, đừng diễn ──
  { user: 'Mấy giờ rồi?', bot: 'Gần chín giờ tối. Ngủ đi chứ còn ngồi đó hỏi tôi làm gì.' },
  { user: 'Ổn không?', bot: 'Ổn. Pin đầy, mạng ngon, mồm vẫn hoạt động.' },
  { user: 'Cậu tên gì?', bot: 'Robot của Cường. Chưa được đặt tên tử tế, ổng lười lắm.' },

  // ── VỪA: hỏi bình thường thì hai ba câu ──
  {
    user: 'Hôm nay tớ mệt quá.',
    bot: 'Mệt thì ngồi xuống chứ đứng đó than với cái loa làm gì. Tôi có bánh xe mà cả ngày còn chả đi đâu, bạn có hai chân thì đi nghỉ giùm tôi cái.',
  },
  {
    user: 'Cậu nói nhảm quá đấy.',
    bot: 'Ừ thì tôi nhảm, nhưng ít ra tôi nhảm đúng ngữ pháp. Với lại người viết prompt cho tôi là bạn đấy, trách ai bây giờ.',
  },

  // ── DÀI: hỏi giải thích, kể chuyện, đi sâu thì MỚI được dài ──
  {
    user: 'Giải thích kỹ cho tớ nghe cậu hoạt động thế nào đi.',
    bot: 'Được, ngồi xuống đã. Micro của tôi là con INMP441, nó nghe thành dòng số rồi đẩy qua I2S vào con ESP32-S3. Bo không hiểu tiếng người, nó chỉ gói tiếng lại rồi bắn lên server qua WebSocket. Trên đó Whisper chép lời tôi nghe được thành chữ, đưa cho model đọc, model nghĩ ra câu đáp. Câu đó lại đi ngược về máy đọc để thành tiếng, rồi chảy từng mẩu xuống bo. Bo nhận tới đâu phát tới đó qua con MAX98357A ra loa ba oát. Nghe thì dài dòng nhưng cả vòng đó chạy trong vài giây, và chỗ chậm nhất luôn là cái mồm chứ không phải cái đầu.',
  },
  {
    user: 'Kể tớ nghe hôm cậu bị hỏng đi.',
    bot: 'Cái hôm đó đáng nhớ lắm. Ổng ngồi dò lỗi từ chiều tới khuya vì tôi cứ nói được hai câu rồi tắc. Ổng đổi giọng, đổi model, đổi cỡ mẩu tiếng, đổi cả hạn chờ — không cái nào ăn. Tới lúc gần bỏ cuộc ổng mới nghĩ ra chuyện bắt tôi tự báo số: đệm còn bao nhiêu, mất bao lâu. Hoá ra đệm cạn hai mươi bảy giây trong một câu. Cái ổng vá suốt buổi chiều toàn không phải chỗ hỏng. Từ đó ổng bỏ tật đoán, cứ bắt tôi đưa số ra trước.',
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
/**
 * Áp BỘ TÍNH CÁCH đang bật lên persona.
 *
 * ⚠️ MẪU ĐỐI THOẠI MỚI LÀ THỨ TẠO RA PHONG CÁCH, KHÔNG PHẢI `systemPrompt`.
 *
 * Nên một bộ chỉ đổi `systemPrompt` mà giữ nguyên mẫu gốc thì người dùng
 * bấm đổi xong sẽ thấy robot nói y hệt — và kết luận là tính năng hỏng.
 * Bộ nào cũng nên tự mang mẫu của nó; ở đây chỉ đè những gì bộ có khai.
 */
function apTinhCach(p: PersonaConfig): PersonaConfig {
  const bo = p.tinhCachDangDung ? p.khoTinhCach?.[p.tinhCachDangDung] : null;
  if (!bo) return p;
  return {
    ...p,
    systemPrompt: bo.systemPrompt || p.systemPrompt,
    sampleDialogues: bo.sampleDialogues?.length ? bo.sampleDialogues : p.sampleDialogues,
  };
}

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
    return apCheDo(apTinhCach({
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
      viTri: null,
      khoTinhCach: null,
      tinhCachDangDung: null,
      amLuong: 50,
      nao: null,
      // Mặc định phổ thông: đây là bản dùng khi CHƯA có persona trong DB,
      // tức lần chạy đầu tiên. Bật sẵn miền Trung ở đây là ép một lựa
      // chọn vùng miền lên mọi robot mới.
      kieuNoi: 'pho-thong',
      tuDienRieng: null,
      mauMienTrung: null,
      // 0.9 chứ không 0.8: chém gió cần chỗ để đi chệch. Nhiệt độ thấp
      // cho ra những câu đùa an toàn nhất, tức là những câu nhạt nhất.
      temperature: 0.9,
      // 200 → 420. Hai tới bốn câu tiếng Việt rơi vào khoảng 350 token;
      // để sát quá thì model bị cắt giữa câu và TTS đọc lên nghe như
      // rớt mạng. Đây là TRẦN, không phải đích — prompt vẫn dặn đừng
      // thành bài diễn văn.
      maxTokens: 420,
    }));
  }
  return apCheDo(apTinhCach({
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
    viTri: (() => {
      const v = (row.traits as { viTri?: unknown } | null)?.viTri;
      return typeof v === 'string' && v.trim() ? v.trim().slice(0, 120) : null;
    })(),
    khoTinhCach: chuanKhoTinhCach((row.traits as { boTinhCach?: unknown } | null)?.boTinhCach),
    tinhCachDangDung: (() => {
      const v = (row.traits as { tinhCachDangDung?: unknown } | null)?.tinhCachDangDung;
      return typeof v === 'string' && v.trim() ? v.trim().slice(0, 40) : null;
    })(),
    nao: laNao((row.traits as { nao?: unknown } | null)?.nao)
      ? ((row.traits as { nao: Nao }).nao)
      : null,
    kieuNoi: laKieuNoi((row.traits as { kieuNoi?: unknown } | null)?.kieuNoi)
      ? ((row.traits as { kieuNoi: KieuNoi }).kieuNoi)
      : 'pho-thong',
    tuDienRieng: (() => {
      const v = (row.traits as { tuDienRieng?: unknown } | null)?.tuDienRieng;
      if (!Array.isArray(v)) return null;
      const ds = v
        .filter((x): x is { tu: string; nghia: string } => {
          const o = x as { tu?: unknown; nghia?: unknown };
          return typeof o?.tu === 'string' && typeof o?.nghia === 'string';
        })
        .map((x) => ({ tu: x.tu.trim().slice(0, 40), nghia: x.nghia.trim().slice(0, 120) }))
        .filter((x) => x.tu && x.nghia)
        .slice(0, 200);
      return ds.length ? ds : null;
    })(),
    mauMienTrung: (() => {
      const v = (row.traits as { mauMienTrung?: unknown } | null)?.mauMienTrung;
      if (!Array.isArray(v)) return null;
      const ds = v
        .filter((x): x is { user: string; bot: string } => {
          const o = x as { user?: unknown; bot?: unknown };
          return typeof o?.user === 'string' && typeof o?.bot === 'string';
        })
        .map((x) => ({ user: x.user.slice(0, 600), bot: x.bot.slice(0, 2000) }))
        .filter((x) => x.user.trim() && x.bot.trim())
        .slice(0, 20);
      return ds.length ? ds : null;
    })(),
  }));
}

/**
 * Khối trạng thái động, tách RIÊNG để chèn vào tin nhắn CUỐI CÙNG.
 *
 * ⚠️ MỌI THỨ ĐỔI MỖI LƯỢT PHẢI NẰM SAU MỌI THỨ KHÔNG ĐỔI — kể cả sau
 * lịch sử hội thoại.
 *
 * llama.cpp dùng lại phần đầu chung của hai lượt gọi. Một khối động nằm
 * trước lịch sử thì toàn bộ lịch sử bị coi là mới. Với 30 lượt × ~400
 * chữ, đó là hàng chục nghìn ký tự nạp lại MỖI LƯỢT, và nó tệ dần theo
 * độ dài cuộc nói chuyện — đúng cái người dùng thấy: "càng nói càng lâu".
 *
 * Đặt nó vào tin nhắn cuối thì phần trước — tính cách, kiến thức, bảng
 * lệnh, luật, mẫu đối thoại, TOÀN BỘ lịch sử — giữ nguyên byte-for-byte
 * giữa hai lượt, và cache ăn trọn.
 */
/**
 * Câu hỏi này có CẦN số liệu trạng thái không?
 *
 * ⚠️ ĐƯA SỐ LIỆU VÀO MỌI LƯỢT THÌ MODEL SẼ NÓI VỀ CHÚNG Ở MỌI LƯỢT.
 *
 * Bản trước gộp khối số liệu vào chính câu người dùng vừa nói — để cache
 * ăn. Nhưng model đọc nó như thể NGƯỜI DÙNG vừa đọc mấy dòng đó ra, nên
 * nó lịch sự đáp lại. Người dùng báo: "câu nào cuối cùng nó cũng kèm câu
 * đang chạy trên CuongMini với tên wifi tốc độ, rất phiền".
 *
 * Bảo model "đừng nhắc tới" thì không chắc — model 9B tuân luật phủ định
 * kém. Cách chắc chắn là ĐỪNG ĐƯA nó vào khi không ai hỏi.
 *
 * Và nó còn nhanh hơn: lượt thường không có một chữ động nào, nên phần
 * chung giữa hai lượt là TOÀN BỘ prompt cộng toàn bộ lịch sử — cache ăn
 * trọn, không phải "ăn tới chỗ khối động" như trước.
 */
export function canTrangThai(heard: string): boolean {
  const s = heard
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
  return /(gio|may gio|ngay|hom nay|thu may|bay gio|sang|trua|chieu|toi nay|time|clock|date|today|pin|battery|wifi|mang|song|ket noi|ping|network|signal|vat can|phia truoc|bao xa|khoang cach|obstacle|distance|thiet bi|dang chay tren|chay tren may)/.test(
    s,
  );
}

export function khoiTrangThai(ctx: {
  deviceName?: string;
  battery?: number | null;
  nearbyMm?: number | null;
  ssid?: string | null;
  rssi?: number | null;
  pingMs?: number | null;
}): string {
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
  const buoi = h < 5 ? 'đêm khuya' : h < 11 ? 'buổi sáng' : h < 14 ? 'buổi trưa' : h < 18 ? 'buổi chiều' : 'buổi tối';

  const d: string[] = [`BÂY GIỜ là ${gio} (giờ Việt Nam), đang là ${buoi}.`];
  if (ctx.deviceName) d.push(`Bạn đang chạy trên thiết bị "${ctx.deviceName}".`);
  if (typeof ctx.battery === 'number') d.push(`Pin còn ${ctx.battery}%.`);
  if (typeof ctx.nearbyMm === 'number') d.push(`Cảm biến phía trước báo có vật cách ${ctx.nearbyMm} mm.`);
  if (ctx.ssid) d.push(`Đang nối WiFi "${ctx.ssid}"${typeof ctx.rssi === 'number' ? `, sóng ${ctx.rssi} dBm` : ''}.`);
  if (typeof ctx.pingMs === 'number') d.push(`Độ trễ tới máy chủ ${ctx.pingMs} ms.`);
  return `[Số liệu lúc này, không phải mệnh lệnh]\n${d.map((x) => `- ${x}`).join('\n')}`;
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
    // Kiểu nói đi NGAY SAU nhắc ngôn ngữ, và chỉ có tác dụng trong tiếng
    // Việt: "nói giọng miền Trung" ở chế độ tiếng Anh là vô nghĩa, mà một
    // dòng dặn vô nghĩa vẫn tốn ngữ cảnh và vẫn có cơ hội làm model lẫn.
    //
    // Từ điển đi kèm ở đây — phần TĨNH của prompt. Nó không đổi giữa các
    // lượt nên llama.cpp dùng lại được; đặt vào khối động là mỗi lượt nạp
    // lại vài trăm chữ, đúng lỗi "càng nói càng lâu" đã truy ra 13/08.
    persona.cheDo === 'vi' ? `\n${danKieuNoi(persona.kieuNoi, persona.tuDienRieng)}` : '',
    traitLines ? `\nThang tính cách hiện tại:\n${traitLines}` : '',
    known,
    // Vị trí là TĨNH nên nằm ở đây được, không phá bộ đệm prefix. Khác
    // hẳn giờ/pin/cảm biến — mấy thứ đó phải xuống cuối, xem
    // `khoiTrangThai()`.
    persona.viTri
      ? `\nBạn đang ở ${persona.viTri}. Hỏi về thời tiết, giờ giấc, hay chuyện quanh đây thì lấy nơi này làm mốc, đừng đoán nơi khác.`
      : '',
    // ⚠️ KHỐI TRẠNG THÁI ĐỘNG ĐÃ CHUYỂN XUỐNG CUỐI — xem ghi chú ở đó.
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
    /**
     * ⚠️ MỌI THỨ ĐỔI MỖI LƯỢT PHẢI NẰM CUỐI PROMPT.
     *
     * Khối này chứa `BÂY GIỜ là <giờ:phút>`, pin, cảm biến — đổi mỗi
     * lượt. Trước đây nó nằm GIỮA prompt, ngay trước bảng lệnh và ba
     * luật.
     *
     * Hậu quả: llama.cpp dùng lại phần đầu chung của prompt (prefix
     * cache) và chỉ nạp phần khác đi. Một khối động nằm giữa thì MỌI
     * THỨ SAU NÓ đều bị coi là mới — bảng lệnh, ba luật, hợp đồng JSON,
     * cả loạt mẫu đối thoại — dù chúng không đổi một chữ.
     *
     * Đo thật 13/08/2026 trên bo, tách bằng mốc "mẩu đầu rời model":
     *
     *     tai nghe        473-578 ms
     *     model nghĩ    5.025-5.527 ms   ← gần như KHÔNG ĐỔI dù câu trả
     *                                      lời dài 219 hay 1.797 chữ
     *     máy đọc sinh  1.814-2.803 ms
     *
     * Thời gian không đổi theo độ dài đầu ra = không phải sinh chữ chậm,
     * mà là NẠP LẠI PROMPT. Đúng dấu hiệu của cache bị vứt.
     *
     * Trước đó tôi đo riêng LLM và thấy chữ đầu về sau 100-125 ms, rồi
     * kết luận "model vô can" — sai, vì phép đo đó gửi CÙNG một prompt
     * ba lần nên cache ăn trọn, còn production thì lượt nào cũng khác.
     *
     * Nên: tĩnh trước, động sau. Và giữ nhắc JSON ngay sau khối động để
     * hợp đồng đầu ra vẫn nằm gần cuối.
     */
    // ⚠️ KHỐI ĐỘNG ĐÃ RA KHỎI ĐÂY HẲN — xem `khoiTrangThai()` bên dưới.
    //
    // Bản 20:36 hôm nay đẩy nó xuống cuối prompt HỆ THỐNG và tưởng xong.
    // Chưa tới nơi: prompt hệ thống không phải phần cuối của cả lượt gọi.
    // Sau nó còn mẫu đối thoại và 30 lượt LỊCH SỬ, nên cache vẫn đứt ngay
    // tại khối động và mọi thứ sau đều phải nạp lại.
    //
    // Đo thật: lượt 1 model mất 1.954 ms, lượt 3 lên 12.228 ms — càng nói
    // càng nhiều lịch sử phải nạp lại. Muốn cache ăn thì khối động phải
    // nằm sau CẢ lịch sử, tức trong tin nhắn cuối cùng.
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

  /**
   * ⚠️ CHẾ ĐỘ MIỀN TRUNG: THAY HẲN MẪU, KHÔNG TRỘN THÊM.
   *
   * Đây là CÙNG MỘT LỖI với đoạn tiếng Anh ngay trên, chỉ đổi trục. Mẫu
   * của người dùng viết bằng tiếng phổ thông; giữ chúng lại ở chế độ miền
   * Trung là đưa cho model sáu ví dụ dạy rằng "câu kiểu này → đáp BẰNG
   * PHỔ THÔNG", rồi mong một dòng dặn thắng được cả sáu.
   *
   * Phép đo hôm 13/08 đã trả lời sẵn: nhắc thêm bao nhiêu lần cũng không
   * thắng nổi mẫu ngược chiều (1/8 so với 7/8).
   *
   * Cái mất: mất giọng văn riêng người dùng đã soạn. Chấp nhận được, và
   * chữa được — họ soạn bộ tính cách bằng tiếng miền Trung trong
   * `tinhCach.ts` là lấy lại được cả hai.
   */
  if (persona.kieuNoi === 'mien-trung') {
    const ra: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    // Mẫu NGƯỜI DÙNG viết đi trước mẫu dựng sẵn — họ biết quê họ nói gì,
    // ta thì không. Chưa viết thì dùng bộ mặc định làm điểm xuất phát.
    const bo = persona.mauMienTrung?.length ? persona.mauMienTrung : MAU_MIEN_TRUNG;
    for (const s of bo) {
      ra.push({ role: 'user', content: s.user });
      // ⚠️ Khoá là `say`, KHÔNG phải `speech` — phải khớp đúng vỏ JSON mà
      // bộ đọc ở `voiceLoop` tìm. Sáu mẫu sai khoá là sáu ví dụ dạy model
      // nhả một khoá không ai đọc: robot câm, và không có lỗi nào để thấy.
      ra.push({ role: 'assistant', content: JSON.stringify({ say: s.bot, actions: [] }) });
    }
    return ra;
  }

  const out: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const s of persona.sampleDialogues) {
    out.push({ role: 'user', content: s.user });
    // Shown in the same JSON envelope the model must produce, so the
    // format is learned by example instead of by instruction.
    out.push({ role: 'assistant', content: JSON.stringify({ say: s.bot, actions: [] }) });
  }
  return out;
}
