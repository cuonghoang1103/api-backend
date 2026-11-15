/**
 * ============================================================
 * Maker Lab — robot làm GIA SƯ tiếng Anh / Nhật / Trung (15/11/2026)
 * ============================================================
 *
 * Dùng DỮ LIỆU HỌC THẬT của chủ robot trên web — không dựng kho riêng:
 *   ôn tập  ⇒ thẻ đến hạn `getReviewQueue` (myLanguage, en/ja/zh) + thẻ IELTS `homNay` (en);
 *             kết quả ghi lại bằng `recordProgress` / `danhGia` ⇒ lịch ôn trên web đổi theo.
 *   từ mới  ⇒ `LangVocabWord` chưa có tiến độ, ưu tiên mục đúng trình độ trong hồ sơ CT Language;
 *             dự phòng bộ chủ đề tĩnh `ctlanguage/chuDeTu.ts`.
 *   luyện nói ⇒ để LLM nói chuyện bằng ngôn ngữ đích, chèn lời dặn gia sư vào prompt.
 *
 * Chạy CHỒNG lên chế độ tiếng Việt (giảng bằng tiếng Việt, từ mẫu bằng ngôn ngữ đích) — KHÔNG thêm chế độ tiếng
 * mới, vì ~15 chỗ trong voiceLoop/lechTieng/web đang giả định chỉ có vi/en/robot.
 *
 * Trạng thái giữ trong bộ nhớ theo thiết bị, hết hạn sau 10 phút không nói gì (mất khi deploy là chấp nhận được:
 * kết quả từng câu đã ghi xuống DB ngay lúc chấm).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type NN = 'en' | 'ja' | 'zh';
export type KieuHoc = 'on' | 'moi' | 'noi' | 'noi-tu' | 'do-vui';
/* 'noi', 'noi-tu', 'do-vui' do LLM dẫn (server giữ phiên + chèn luật vào prompt); 'on', 'moi' server tự chấm. */
export const TEN_NN: Record<NN, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };

export interface TheHoc {
  nguon: 'lang' | 'ielts' | 'chude';
  itemId?: number;
  tu: string;
  doc?: string | null;
  nghia: string;
  viDu?: string | null;
}

interface PhienHoc {
  userId: number;
  nn: NN;
  kieu: KieuHoc;
  the: TheHoc[];
  i: number;
  /** hoi = đang hỏi nhớ lại · nhac-lai = đợi đọc theo · on-lai = vòng kiểm tra sau khi học từ mới */
  buoc: 'hoi' | 'nhac-lai';
  vongKiem: boolean;
  lanThu: number;
  dung: number;
  sai: number;
  capNhat: number;
  cauCuoi: string;
}

const HAN_MS = 10 * 60_000;
const SO_THE = 8;
const SO_TU_MOI = 5;
const _phien = new Map<number, PhienHoc>();

/** Lời mời ôn của robot (chuDong.ts lúc 20:00) — người dùng nói "ừ" trong 2 phút ⇒ vào bài. */
const _moi = new Map<number, { nn: NN; den: number }>();
export function moiHoc(deviceId: number, nn: NN): void {
  _moi.set(deviceId, { nn, den: Date.now() + 120_000 });
}

export function dangHoc(deviceId: number): PhienHoc | null {
  const p = _phien.get(deviceId);
  if (!p) return null;
  if (Date.now() - p.capNhat > HAN_MS) {
    _phien.delete(deviceId);
    return null;
  }
  return p;
}

/** Ngôn ngữ ĐÍCH của buổi học đang chạy — để voiceLoop mở Whisper cho thứ tiếng đó. */
export function ngonNguDangHoc(deviceId: number): NN | null {
  return dangHoc(deviceId)?.nn ?? null;
}

/** Từ mẫu của câu đang hỏi — mồi cho Whisper nghe đúng chữ. */
export function goiYNgheGiaSu(deviceId: number): string {
  const p = dangHoc(deviceId);
  const t = p?.the[p.i];
  return t ? [t.tu, t.doc].filter(Boolean).join(', ') : '';
}

// ─── Hiểu lời người dùng (THUẦN) ────────────────────────────────────────

function khongDau(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function nnTrongCau(s: string): NN | null {
  if (/\b(tieng anh|english|anh van)\b/.test(s)) return 'en';
  if (/\b(tieng nhat|nhat ban|japanese|nihongo)\b/.test(s)) return 'ja';
  if (/\b(tieng trung|tieng hoa|trung quoc|chinese|hoa ngu)\b/.test(s)) return 'zh';
  return null;
}

/** "ôn tập tiếng Nhật", "dạy tao từ mới tiếng Trung", "luyện nói tiếng Anh"… THUẦN. */
export function khopBatDauHoc(heard: string): { nn: NN; kieu: KieuHoc | 'tu-dong' } | null {
  const s = khongDau(heard);
  if (!s || s.length > 90) return null;
  // Trò chơi: không nêu tiếng thì mặc định tiếng Anh.
  const tro = /\b(noi tu|choi noi tu|shiritori|word chain)\b/.test(s) ? 'noi-tu' : /\b(do vui|choi do|do tao|quiz|cau do)\b/.test(s) ? 'do-vui' : null;
  if (tro && /\b(choi|do|noi tu|shiritori|quiz|word chain)\b/.test(s)) return { nn: nnTrongCau(s) ?? 'en', kieu: tro };
  const nn = nnTrongCau(s);
  if (!nn) return null;
  if (/\b(luyen noi|noi chuyen bang|giao tiep|tap noi|hoi thoai)\b/.test(s)) return { nn, kieu: 'noi' };
  if (/\b(tu moi|hoc tu|day tu|bai moi)\b/.test(s)) return { nn, kieu: 'moi' };
  if (/\b(on tap|on tu|on lai|kiem tra|on bai)\b/.test(s)) return { nn, kieu: 'on' };
  if (/\b(hoc|day|kem|luyen)\b/.test(s)) return { nn, kieu: 'tu-dong' };
  return null;
}

export type LenhBai = 'dung' | 'lap-lai' | 'cham' | 'bo-qua' | 'nghia' | 'goi-y';

/** Lệnh điều khiển trong lúc học. THUẦN. Câu dài (> 40 ký tự) coi là câu trả lời, không phải lệnh. */
export function khopLenhTrongBai(heard: string): LenhBai | null {
  const s = khongDau(heard);
  if (!s || s.length > 40) return null;
  if (/\b(dung hoc|thoi hoc|ket thuc|nghi hoc|het gio|dung lai|thoi khong hoc|stop)\b/.test(s)) return 'dung';
  if (/\b(lap lai|noi lai|doc lai|nhac lai|repeat)\b/.test(s)) return 'lap-lai';
  if (/\b(cham thoi|cham lai|noi cham|doc cham|slow)\b/.test(s)) return 'cham';
  if (/\b(bo qua|qua cau|cau khac|tu khac|khong biet|chiu|skip|next)\b/.test(s)) return 'bo-qua';
  if (/\b(nghia la gi|giai thich|vi du|nghia gi)\b/.test(s)) return 'nghia';
  if (/\b(goi y|hint|nhac bai|nhac tao|chut goi y)\b/.test(s)) return 'goi-y';
  return null;
}

/** Katakana ⇒ hiragana, bỏ dấu câu/khoảng trắng; tiếng Anh hạ chữ, chỉ giữ chữ cái. THUẦN. */
export function chuanDapAn(nn: NN, s: string): string {
  const t = (s || '').normalize('NFKC');
  if (nn === 'en') return t.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  const kana = t.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  return kana.replace(/[\s\p{P}\p{S}]/gu, '').toLowerCase();
}

function khoangCach(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let truoc = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tam = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, truoc + (a[i - 1] === b[j - 1] ? 0 : 1));
      truoc = tam;
    }
  }
  return d[b.length];
}

/** Chấm câu trả lời so với đáp án (chữ gốc hoặc cách đọc). THUẦN. */
export function chamTraLoi(nn: NN, the: Pick<TheHoc, 'tu' | 'doc'>, heard: string): 'dung' | 'gan' | 'sai' {
  const nghe = chuanDapAn(nn, heard);
  if (!nghe) return 'sai';
  const dich = [the.tu, nn === 'ja' ? the.doc : null].filter(Boolean).map((x) => chuanDapAn(nn, String(x))).filter(Boolean);
  if (dich.some((d) => (nn === 'en' ? ` ${nghe} `.includes(` ${d} `) : nghe.includes(d)))) return 'dung';
  // Gần đúng: so với cửa sổ cùng độ dài trong câu nghe được.
  let tot = 0;
  for (const d of dich) {
    const n = d.length;
    if (!n) continue;
    for (let i = 0; i + Math.max(1, n - 1) <= nghe.length; i++) {
      const cua = nghe.slice(i, i + n);
      tot = Math.max(tot, 1 - khoangCach(cua, d) / Math.max(n, cua.length));
    }
  }
  return tot >= (nn === 'en' ? 0.75 : 0.6) ? 'gan' : 'sai';
}

// ─── Nạp thẻ từ dữ liệu web ─────────────────────────────────────────────

type TuWeb = { id: number; word: string; meaningVi: string | null; exampleSentence?: string | null; pronunciations?: Array<{ type: string; value: string }> };

function theTuWord(w: TuWeb, nn: NN): TheHoc {
  const uuTien = nn === 'ja' ? ['hiragana', 'kana', 'katakana', 'romaji'] : nn === 'zh' ? ['pinyin'] : ['ipa'];
  const pr = w.pronunciations ?? [];
  const doc = uuTien.map((t) => pr.find((p) => p.type?.toLowerCase() === t)?.value).find(Boolean) ?? pr[0]?.value ?? null;
  return { nguon: 'lang', itemId: w.id, tu: w.word, doc, nghia: w.meaningVi ?? '', viDu: w.exampleSentence ?? null };
}

async function theOnTap(userId: number, nn: NN): Promise<TheHoc[]> {
  const { getReviewQueue } = await import('../myLanguage.service.js');
  const q = await getReviewQueue(userId, nn).catch(() => ({ items: [] as Array<{ word: TuWeb | null }> }));
  const ra: TheHoc[] = (q.items as Array<{ word: TuWeb | null }>)
    .filter((x) => x.word && x.word.meaningVi)
    .map((x) => theTuWord(x.word!, nn));
  if (nn === 'en' && ra.length < SO_THE) {
    const { homNay } = await import('../ielts/vocab.service.js');
    const h = await homNay(userId).catch(() => null);
    const tu = (h?.denHan ?? []).map((c) => c.tu).slice(0, 30);
    if (tu.length) {
      const dien = await prisma.ctlTu.findMany({ where: { nn: 'en', chu: { in: tu } }, select: { chu: true, doc: true, nghiaVi: true } });
      for (const d of dien) if (d.nghiaVi) ra.push({ nguon: 'ielts', tu: d.chu, doc: d.doc, nghia: d.nghiaVi });
    }
  }
  return ra.slice(0, SO_THE);
}

async function theTuMoi(userId: number, nn: NN): Promise<TheHoc[]> {
  const lang = await prisma.language.findUnique({ where: { code: nn } });
  if (lang) {
    const da = await prisma.langUserProgress.findMany({ where: { userId, itemType: 'VOCAB' }, select: { itemId: true } });
    const { docHoSo } = await import('../ctlanguage/hoSo.js');
    const ho = await docHoSo(userId).catch(() => null);
    const trinhDo = (ho?.langs as Record<string, { level?: string }> | undefined)?.[nn]?.level ?? null;
    const where = {
      category: { languageId: lang.id, ...(trinhDo ? { level: trinhDo } : {}) },
      id: { notIn: da.map((d) => d.itemId) },
      meaningVi: { not: '' },
    };
    let ds = await prisma.langVocabWord.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], take: SO_TU_MOI, include: { pronunciations: { orderBy: { order: 'asc' } } } });
    if (!ds.length && trinhDo) {
      ds = await prisma.langVocabWord.findMany({
        where: { ...where, category: { languageId: lang.id } },
        orderBy: [{ order: 'asc' }, { id: 'asc' }], take: SO_TU_MOI, include: { pronunciations: { orderBy: { order: 'asc' } } },
      });
    }
    if (ds.length) return ds.map((w) => theTuWord(w as unknown as TuWeb, nn));
  }
  // Dự phòng: bộ chủ đề tĩnh của CT Language (content/ctlanguage/chu-de-tu), chọn ngẫu nhiên một chủ đề.
  try {
    const { chuDeCua } = await import('../ctlanguage/chuDeTu.js');
    const ds = chuDeCua(nn);
    const cd = ds[Math.floor(Math.random() * ds.length)];
    return (cd?.tep.tu ?? [])
      .filter((t) => t.chu && t.nghia)
      .slice(0, SO_TU_MOI)
      .map((t) => ({ nguon: 'chude' as const, tu: t.chu, doc: t.doc?.replace(/^\/|\/$/g, '') ?? null, nghia: t.nghia }));
  } catch {
    return [];
  }
}

async function ghiKetQua(p: PhienHoc, the: TheHoc, chatLuong: number): Promise<void> {
  try {
    if (the.nguon === 'lang' && the.itemId) {
      const { recordProgress } = await import('../myLanguage.service.js');
      await recordProgress(p.userId, { itemType: 'VOCAB', itemId: the.itemId, quality: chatLuong });
    } else if (the.nguon === 'ielts') {
      const { danhGia } = await import('../ielts/vocab.service.js');
      await danhGia(p.userId, { tu: the.tu, diem: chatLuong >= 4 ? 3 : chatLuong >= 3 ? 2 : 1 });
    }
  } catch (err) {
    logger.warn('MakerLab gia sư không ghi được kết quả', { error: (err as Error).message, tu: the.tu });
  }
}

// ─── Câu nói ────────────────────────────────────────────────────────────

const docTu = (t: TheHoc, nn: NN) => (nn !== 'en' && t.doc && t.doc !== t.tu ? `${t.tu}, đọc là ${t.doc}` : t.tu);

function cauHoi(p: PhienHoc): string {
  const t = p.the[p.i];
  const so = `Câu ${p.i + 1} trên ${p.the.length}.`;
  if (p.buoc === 'nhac-lai' && !p.vongKiem) return `${so} Từ mới: ${docTu(t, p.nn)}. Nghĩa là ${t.nghia}. Đọc theo nhé: ${t.tu}.`;
  return `${so} "${t.nghia}" ${TEN_NN[p.nn]} nói thế nào?`;
}

function tongKet(p: PhienHoc): string {
  const tong = p.dung + p.sai;
  const xeo = p.kieu === 'moi' ? `Đã học ${p.the.length} từ mới` : `Ôn xong ${p.the.length} từ`;
  const ket = tong ? `, đúng ${p.dung} trên ${tong}` : '';
  return `${xeo}${ket}. Kết quả đã lưu vào lịch ôn ${TEN_NN[p.nn]} trên web. Muốn học tiếp thì bảo nhé.`;
}

/** Bắt đầu buổi học. Trả câu robot nói (gồm luôn câu hỏi đầu tiên). */
export async function batDauHoc(o: { deviceId: number; userId: number; nn: NN; kieu: KieuHoc | 'tu-dong' }): Promise<string> {
  if (o.kieu === 'noi-tu' || o.kieu === 'do-vui') {
    _phien.set(o.deviceId, { userId: o.userId, nn: o.nn, kieu: o.kieu, the: [], i: 0, buoc: 'hoi', vongKiem: false, lanThu: 0, dung: 0, sai: 0, capNhat: Date.now(), cauCuoi: '' });
    if (o.kieu === 'noi-tu') {
      return o.nn === 'ja'
        ? 'Chơi shiritori tiếng Nhật nhé! Từ sau bắt đầu bằng âm cuối của từ trước, từ nào kết thúc bằng ん là thua. Tao mở màn: りんご, ringo, quả táo. Âm cuối là ご, tới mày.'
        : o.nn === 'zh'
          ? 'Chơi nối chữ tiếng Trung nhé! Từ sau bắt đầu bằng chữ cuối của từ trước. Tao mở màn: 学生, xuéshēng, học sinh. Chữ cuối là 生, tới mày.'
          : 'Chơi nối từ tiếng Anh nhé! Từ sau bắt đầu bằng chữ cái cuối của từ trước, không lặp từ. Tao mở màn: apple. Chữ cuối là E, tới mày.';
    }
    return `Chơi đố vui ${TEN_NN[o.nn]}! Tao hỏi, mày trả lời, đúng một câu một điểm, nói dừng học là nghỉ. Câu đầu nè, sẵn sàng chưa?`;
  }
  if (o.kieu === 'noi') {
    _phien.set(o.deviceId, { userId: o.userId, nn: o.nn, kieu: 'noi', the: [], i: 0, buoc: 'hoi', vongKiem: false, lanThu: 0, dung: 0, sai: 0, capNhat: Date.now(), cauCuoi: '' });
    return o.nn === 'en'
      ? 'Ok, luyện nói tiếng Anh nhé. Let\'s talk! What did you do today?'
      : o.nn === 'ja'
        ? 'Được, luyện nói tiếng Nhật nhé. はじめましょう！今日は何をしましたか？'
        : '好，luyện nói tiếng Trung nhé. 我们开始吧！你今天做了什么？';
  }
  let kieu: KieuHoc = o.kieu === 'tu-dong' ? 'on' : o.kieu;
  let the = kieu === 'on' ? await theOnTap(o.userId, o.nn) : await theTuMoi(o.userId, o.nn);
  let mo = '';
  if (!the.length && kieu === 'on') {
    the = await theTuMoi(o.userId, o.nn);
    kieu = 'moi';
    mo = `Hôm nay không có từ ${TEN_NN[o.nn]} nào đến hạn ôn, chuyển sang học từ mới. `;
  }
  if (!the.length) return `Chưa có từ ${TEN_NN[o.nn]} nào để học. Vào trang Ngoại ngữ trên web thêm từ trước nhé.`;
  const p: PhienHoc = {
    userId: o.userId, nn: o.nn, kieu, the, i: 0, buoc: kieu === 'moi' ? 'nhac-lai' : 'hoi', vongKiem: false,
    lanThu: 0, dung: 0, sai: 0, capNhat: Date.now(), cauCuoi: '',
  };
  _phien.set(o.deviceId, p);
  const dau = kieu === 'moi'
    ? `${mo}Học ${the.length} từ mới ${TEN_NN[o.nn]}. Nghe rồi đọc theo, nói "dừng học" để nghỉ. `
    : `${mo}Ôn ${the.length} từ ${TEN_NN[o.nn]} đến hạn. Tao nói nghĩa, mày nói từ. Nói "gợi ý", "bỏ qua" hoặc "dừng học" lúc nào cũng được. `;
  p.cauCuoi = cauHoi(p);
  logger.info('MakerLab gia sư bắt đầu', { deviceId: o.deviceId, nn: o.nn, kieu, soThe: the.length });
  return dau + p.cauCuoi;
}

function sangCauSau(p: PhienHoc, deviceId: number): string {
  p.i++;
  p.lanThu = 0;
  if (p.i >= p.the.length) {
    // Học từ mới xong ⇒ một vòng kiểm tra nhớ lại ngay.
    if (p.kieu === 'moi' && !p.vongKiem) {
      p.vongKiem = true;
      p.i = 0;
      p.buoc = 'hoi';
      p.cauCuoi = cauHoi(p);
      return `Xong phần học. Giờ kiểm tra nhanh xem nhớ không nhé. ${p.cauCuoi}`;
    }
    _phien.delete(deviceId);
    return tongKet(p);
  }
  p.buoc = p.kieu === 'moi' && !p.vongKiem ? 'nhac-lai' : 'hoi';
  p.cauCuoi = cauHoi(p);
  return p.cauCuoi;
}

/**
 * Xử lý một lượt nói trong lúc học. `null` = không có buổi học (đi đường thường).
 * `{ noi }` = câu robot nói luôn, không qua LLM. `{ nhacLlm }` = luyện nói: để LLM trả lời với lời dặn này.
 */
export async function xuLyGiaSu(o: { deviceId: number; userId: number; heard: string }): Promise<{ noi?: string; nhacLlm?: string } | null> {
  const p = dangHoc(o.deviceId);
  if (!p) {
    const moi = _moi.get(o.deviceId);
    if (moi) {
      _moi.delete(o.deviceId);
      const s = khongDau(o.heard);
      if (moi.den > Date.now() && s.length <= 30 && /\b(u|uh|uhm|ok|oke|okay|co|duoc|vao|on di|thi on|chien|let s go|yes)\b/.test(s) && !/\b(khong|thoi|de sau|mai)\b/.test(s)) {
        return { noi: await batDauHoc({ deviceId: o.deviceId, userId: o.userId, nn: moi.nn, kieu: 'on' }) };
      }
    }
    const bd = khopBatDauHoc(o.heard);
    if (!bd) return null;
    return { noi: await batDauHoc({ deviceId: o.deviceId, userId: o.userId, nn: bd.nn, kieu: bd.kieu }) };
  }
  p.capNhat = Date.now();
  const lenh = khopLenhTrongBai(o.heard);
  if (lenh === 'dung') {
    _phien.delete(o.deviceId);
    if (p.kieu === 'noi-tu' || p.kieu === 'do-vui') return { noi: 'Thôi nghỉ chơi. Ván này coi như tao thắng nha, đừng cãi.' };
    return { noi: p.kieu === 'noi' ? `Ok, dừng luyện nói ${TEN_NN[p.nn]}. Hay lắm đấy.` : tongKet(p) };
  }

  if (p.kieu === 'noi-tu') {
    return {
      nhacLlm:
        `[TRÒ CHƠI — nối từ ${TEN_NN[p.nn]}] Luật: ${p.nn === 'ja' ? 'shiritori — từ sau bắt đầu bằng ÂM KANA cuối của từ trước, từ kết thúc bằng ん là thua; luôn đọc kèm hiragana + romaji + nghĩa Việt' : p.nn === 'zh' ? 'từ sau bắt đầu bằng CHỮ HÁN cuối của từ trước; luôn đọc kèm pinyin + nghĩa Việt' : 'từ sau bắt đầu bằng CHỮ CÁI cuối của từ trước; kèm nghĩa Việt ngắn'}; ` +
        'không lặp từ đã dùng trong cuộc trò chuyện. Kiểm từ người chơi vừa nói (nghe chữ có thể sai chính tả — đoán từ gần nhất hợp lý): ' +
        'hợp lệ ⇒ khen/cà khịa ngắn rồi nói TỪ TIẾP của mày theo đúng luật và báo âm/chữ cuối để họ nối; sai luật ⇒ cà khịa, cộng ' +
        'điểm cho mày, nêu từ đúng làm ví dụ rồi chơi tiếp. Giữ tỉ số trong đầu, thỉnh thoảng báo tỉ số. Ngắn gọn, 2–3 câu.',
    };
  }
  if (p.kieu === 'do-vui') {
    return {
      nhacLlm:
        `[TRÒ CHƠI — đố vui ${TEN_NN[p.nn]}] Mỗi lượt: chấm câu trả lời của câu đố trước (đúng ⇒ khen + điểm; sai ⇒ cà khịa + đáp án ` +
        `+ giải thích MỘT câu) rồi ra CÂU ĐỐ MỚI ngắn về từ vựng, ngữ pháp, cách nói thông dụng hoặc văn hoá ${TEN_NN[p.nn]} ` +
        '(trình độ sơ–trung cấp, đa dạng, không lặp). Phần lớn câu đố là TRẮC NGHIỆM: luôn kèm trường "chon" ' +
        '{"hoi","luaChon" 3–4 đáp án, "dung"} để màn hiện nút A/B/C/D; thỉnh thoảng một câu tự trả lời bằng miệng (không "chon"). ' +
        `Giữ tỉ số, báo mỗi 3 câu. Ngắn gọn.${p.nn === 'ja' ? ' Đọc kèm hiragana cho kanji.' : p.nn === 'zh' ? ' Đọc kèm pinyin.' : ''}`,
    };
  }
  if (p.kieu === 'noi') {
    return {
      nhacLlm:
        `[CHẾ ĐỘ GIA SƯ — luyện nói ${TEN_NN[p.nn]}] Người dùng đang tập nói ${TEN_NN[p.nn]}. Trả lời 1–2 câu NGẮN bằng ` +
        `${TEN_NN[p.nn]} ở trình độ sơ–trung cấp${p.nn === 'ja' ? ' (kèm hiragana cho chữ kanji khó)' : p.nn === 'zh' ? ' (kèm pinyin)' : ''}. ` +
        `Nếu câu của người dùng sai ngữ pháp/từ, thêm MỘT câu tiếng Việt ngắn chỉ ra cách nói đúng. Kết thúc bằng một câu ` +
        `hỏi ${TEN_NN[p.nn]} đơn giản để họ nói tiếp. Người dùng nói "dừng học" là thôi.`,
    };
  }

  const t = p.the[p.i];
  if (lenh === 'lap-lai') return { noi: p.cauCuoi };
  if (lenh === 'cham') return { noi: `${t.tu}. ${t.doc && t.doc !== t.tu ? `${t.doc}. ` : ''}${t.tu}.` };
  if (lenh === 'nghia') return { noi: `${docTu(t, p.nn)} nghĩa là ${t.nghia}.${t.viDu ? ` Ví dụ: ${t.viDu}.` : ''} ${p.buoc === 'hoi' ? 'Giờ nói lại nhé.' : 'Đọc theo nhé.'}` };
  if (lenh === 'goi-y') {
    p.lanThu++;
    const g = p.nn === 'en' ? `bắt đầu bằng chữ ${t.tu[0].toUpperCase()}, có ${t.tu.length} chữ cái` : t.doc ? `cách đọc bắt đầu bằng ${t.doc.slice(0, Math.max(1, Math.ceil(t.doc.length / 3)))}` : `chữ đầu là ${t.tu[0]}`;
    return { noi: `Gợi ý: ${g}.` };
  }
  if (lenh === 'bo-qua') {
    p.sai++;
    if (p.buoc === 'hoi') await ghiKetQua(p, t, 1);
    return { noi: `Đáp án là ${docTu(t, p.nn)}. ${sangCauSau(p, o.deviceId)}` };
  }

  const kq = chamTraLoi(p.nn, t, o.heard);
  if (p.buoc === 'nhac-lai') {
    const khen = kq === 'dung' ? 'Chuẩn!' : kq === 'gan' ? 'Gần đúng rồi.' : `Chưa giống lắm, nghe lại: ${t.tu}.`;
    if (p.kieu === 'moi' && !p.vongKiem) {
      if (kq === 'dung') p.dung++;
      await ghiKetQua(p, t, kq === 'sai' ? 2 : 3);
    }
    return { noi: `${khen} ${sangCauSau(p, o.deviceId)}` };
  }
  // buoc === 'hoi'
  if (kq === 'dung' || kq === 'gan') {
    p.dung++;
    await ghiKetQua(p, t, kq === 'dung' ? (p.lanThu ? 3 : 4) : 3);
    const khen = kq === 'dung' ? ['Chính xác!', 'Đúng rồi!', 'Chuẩn luôn!'][p.i % 3] : 'Gần đúng, chuẩn là';
    return { noi: `${khen} ${docTu(t, p.nn)}. ${sangCauSau(p, o.deviceId)}` };
  }
  p.sai++;
  await ghiKetQua(p, t, 1);
  p.buoc = 'nhac-lai';
  p.cauCuoi = `Đáp án là ${docTu(t, p.nn)}. Đọc lại theo nhé: ${t.tu}.`;
  return { noi: `Chưa đúng. ${p.cauCuoi}` };
}
