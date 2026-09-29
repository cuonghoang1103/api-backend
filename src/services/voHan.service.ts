/**
 * Vở viết tay (iPad) — "Vẽ giúp → Chữ Hán": TRA chữ.
 * ─────────────────────────────────────────────────────────────────────
 * Người học gõ "học", "HỌC", "gaku", "nhật bản ngữ" hoặc dán thẳng 学 → app
 * cần biết CHỮ nào, và thông tin kèm (Hán Việt, On, Kun, nghĩa) để hiện thẻ.
 *
 * ⚠️ NÉT chữ KHÔNG đi qua đây và KHÔNG do AI vẽ: AI tự vẽ chữ Hán là sai thứ
 * tự nét, sai số nét. App lấy nét chuẩn ở `GET /my-language/hanzi-stroke/:char`
 * (hanzi-writer-data / KanjiVG). Chỗ này chỉ trả CHỮ + thông tin.
 *
 * Thứ tự nguồn:
 *   1. Bảng `LangHanziChar` (tiếng Nhật) — On/Kun/nghĩa do admin soạn, đúng hơn AI.
 *   2. LLM (`han_tra`) — Hán Việt (bảng không có cột này), chữ ngoài bảng, và
 *      mọi lượt tra từ âm/nghĩa. AI hỏng thì vẫn trả phần có trong bảng.
 */
import { prisma } from '../config/database.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { tachJson } from './voVietLai.service.js';

export interface ThongTinChu {
  chu: string;
  hanViet: string | null;
  on: string | null;
  kun: string | null;
  nghia: string | null;
  soNet: number | null;
}

export interface UngVienHan {
  /** Một hoặc nhiều chữ (日本語). Chỉ gồm chữ Hán / kana. */
  chu: string;
  hanViet: string | null;
  nghia: string | null;
  /** Cách đọc cả từ (にほんご) — chỉ khi là từ ghép. */
  doc: string | null;
  chiTiet: ThongTinChu[];
}

const LA_HAN = /\p{Script=Han}/u;
const CHU_VE_DUOC = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]+$/u;
const TOI_DA_CHU = 8;

const chuoi = (v: unknown, dai = 80): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.replace(/\s+/g, ' ').trim().slice(0, dai);
  return s || null;
};

const SYSTEM_TRA = [
  'Bạn là từ điển Hán tự cho người Việt học tiếng Nhật.',
  'Người dùng gõ âm Hán Việt, nghĩa tiếng Việt, romaji, hoặc chính chữ Hán. Tìm CHỮ HÁN (kanji tiếng Nhật, dạng chữ Nhật hiện hành) khớp nhất.',
  'Trả về DUY NHẤT một đối tượng JSON, không giải thích:',
  '{"ungVien":[{"chu":"学","hanViet":"HỌC","nghia":"học, việc học","doc":null,"chiTiet":[{"chu":"学","hanViet":"HỌC","on":"ガク","kun":"まな.ぶ","nghia":"học"}]}]}',
  '- "chu" chỉ gồm chữ Hán (và kana nếu là từ có okurigana). Từ ghép (vd "nhật bản" → 日本) thì "chu" là cả từ, "doc" là cách đọc hiragana, "chiTiet" có từng chữ.',
  '- Âm Hán Việt có nhiều chữ đồng âm (vd "học" → 学; "nhật" → 日) thì đưa tối đa 5 ứng viên, THÔNG DỤNG nhất trước.',
  '- "hanViet" viết HOA có dấu. "on" bằng katakana, "kun" bằng hiragana, nhiều cách đọc ngăn bằng "、". Không có thì null.',
  '- Không chắc thì đưa ít ứng viên hơn, KHÔNG bịa chữ.',
].join('\n');

const SYSTEM_THONG_TIN = [
  'Bạn là từ điển Hán tự cho người Việt học tiếng Nhật.',
  'Cho mỗi chữ Hán trong danh sách, trả về DUY NHẤT một đối tượng JSON, không giải thích:',
  '{"chiTiet":[{"chu":"学","hanViet":"HỌC","on":"ガク","kun":"まな.ぶ","nghia":"học, việc học"}],"hanViet":"HỌC","nghia":"học","doc":null}',
  '- "hanViet"/"nghia"/"doc" ở ngoài là của CẢ CHUỖI (từ ghép thì "doc" là cách đọc hiragana của từ, chữ đơn thì null).',
  '- "hanViet" viết HOA có dấu. "on" bằng katakana, "kun" bằng hiragana, nhiều cách đọc ngăn bằng "、". Không có thì null.',
].join('\n');

/** Thông tin có sẵn trong bảng Hán tự tiếng Nhật của web. */
async function tuBang(chus: string[]): Promise<Map<string, ThongTinChu>> {
  const kq = new Map<string, ThongTinChu>();
  if (!chus.length) return kq;
  try {
    const rows = await prisma.langHanziChar.findMany({
      where: { char: { in: chus }, language: { code: 'ja' } },
      select: { char: true, onyomi: true, kunyomi: true, meaningVi: true, strokeCount: true },
    });
    for (const r of rows) {
      kq.set(r.char, {
        chu: r.char, hanViet: null, on: r.onyomi || null, kun: r.kunyomi || null,
        nghia: r.meaningVi || null, soNet: r.strokeCount ?? null,
      });
    }
  } catch (e) {
    // Bảng hỏng không được làm chết cả tính năng — còn đường AI.
    console.error('[voHan] đọc bảng Hán tự lỗi:', (e as Error).message);
  }
  return kq;
}

function docChiTiet(v: unknown): ThongTinChu[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    const chu = chuoi(o.chu, 4);
    if (!chu || [...chu].length !== 1 || !LA_HAN.test(chu)) return [];
    return [{
      chu, hanViet: chuoi(o.hanViet, 40), on: chuoi(o.on), kun: chuoi(o.kun),
      nghia: chuoi(o.nghia, 120), soNet: null,
    }];
  });
}

/** Trộn: bảng của web thắng On/Kun/nghĩa/số nét; AI lấp Hán Việt và chỗ trống. */
function tron(chu: string, ai: ThongTinChu[], bang: Map<string, ThongTinChu>): ThongTinChu[] {
  return [...chu].filter((c) => LA_HAN.test(c)).map((c) => {
    const a = ai.find((x) => x.chu === c);
    const b = bang.get(c);
    return {
      chu: c,
      hanViet: a?.hanViet ?? null,
      on: b?.on ?? a?.on ?? null,
      kun: b?.kun ?? a?.kun ?? null,
      nghia: b?.nghia ?? a?.nghia ?? null,
      soNet: b?.soNet ?? null,
    };
  });
}

async function hoiAI(userId: number, system: string, cau: string) {
  const kq = await llmComplete({
    step: 'generation', feature: 'chat', purpose: 'han_tra', userId,
    system, messages: [{ role: 'user', content: cau }],
    maxTokens: 1500, maxRetries: 1, timeoutMs: 45_000,
  });
  return { o: tachJson(kq?.text ?? ''), model: kq?.model ?? null };
}

export async function traChuHan(userId: number, b: { q?: unknown }) {
  const q = String(b.q ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!q) throw new BadRequestError('Gõ chữ Hán, âm Hán Việt, nghĩa hoặc romaji.');

  const coAI = isAiAvailable() && (await checkTokenQuota(userId));

  // ── Gõ thẳng chữ: không cần tra, chỉ lấy thông tin ────────────────────
  const gon = q.replace(/\s/g, '');
  if (CHU_VE_DUOC.test(gon)) {
    const chu = [...gon].slice(0, TOI_DA_CHU).join('');
    const hans = [...new Set([...chu].filter((c) => LA_HAN.test(c)))];
    const bang = await tuBang(hans);
    let ai: ThongTinChu[] = [];
    let ngoai: Record<string, unknown> = {};
    let model: string | null = null;
    if (hans.length && coAI) {
      try {
        const r = await hoiAI(userId, SYSTEM_THONG_TIN, `Chuỗi: ${chu}\nCác chữ: ${hans.join(' ')}`);
        ai = docChiTiet(r.o?.chiTiet);
        ngoai = r.o ?? {};
        model = r.model;
      } catch (e) {
        console.error('[voHan] AI thông tin lỗi:', (e as Error).message);
      }
    }
    const chiTiet = tron(chu, ai, bang);
    const motChu = [...chu].length === 1;
    return {
      ungVien: [{
        chu,
        hanViet: chuoi(ngoai.hanViet, 60) ?? (chiTiet.length ? chiTiet.map((c) => c.hanViet ?? '?').join(' ') : null),
        nghia: chuoi(ngoai.nghia, 120) ?? (motChu ? chiTiet[0]?.nghia ?? null : null),
        doc: motChu ? null : chuoi(ngoai.doc, 40),
        chiTiet,
      }] as UngVienHan[],
      model,
    };
  }

  // ── Gõ âm / nghĩa / romaji: phải tra ────────────────────────────────
  if (!isAiAvailable()) throw new AppError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 503, 'AI_UNAVAILABLE');
  if (!coAI) throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');

  const r = await hoiAI(userId, SYSTEM_TRA, `Tra: ${q}`);
  const ds = Array.isArray(r.o?.ungVien) ? (r.o!.ungVien as unknown[]) : [];
  const tho: UngVienHan[] = [];
  for (const x of ds) {
    const o = (x ?? {}) as Record<string, unknown>;
    const chu = chuoi(o.chu, 16)?.replace(/\s/g, '');
    if (!chu || !CHU_VE_DUOC.test(chu) || ![...chu].some((c) => LA_HAN.test(c))) continue;
    if ([...chu].length > TOI_DA_CHU || tho.some((t) => t.chu === chu)) continue;
    tho.push({
      chu, hanViet: chuoi(o.hanViet, 60), nghia: chuoi(o.nghia, 120), doc: chuoi(o.doc, 40),
      chiTiet: docChiTiet(o.chiTiet),
    });
    if (tho.length >= 5) break;
  }
  if (!tho.length) {
    throw new AppError(`Chưa tìm ra chữ Hán cho “${q}” — thử âm Hán Việt khác hoặc dán thẳng chữ.`, 404, 'HAN_KHONG_THAY');
  }
  const bang = await tuBang([...new Set(tho.flatMap((t) => [...t.chu].filter((c) => LA_HAN.test(c))))]);
  return {
    ungVien: tho.map((t) => ({ ...t, chiTiet: tron(t.chu, t.chiTiet, bang) })),
    model: r.model,
  };
}
