/**
 * CT Language — THI NÓI VỚI GIÁM KHẢO AI (15/11/2026): kho đề nói + lượt thi + chấm. Luật thuần ở `thiNoiThuan.ts`.
 *
 * - Đề: IELTS Speaking `content/ctlanguage/de-thi-noi/*.json` (sinh từ đề web bằng `scripts/ctlanguage-ielts-tu-web.mts`)
 *   + HSKK dựng lúc nạp từ đề HSKK của phòng thi (`thi.ts`) — không soạn hai lần.
 * - Mở lượt: dòng `ctl_luot_thi` (cùng bảng thi viết ⇒ lịch sử chung, free 1 đề nói/cấp/tuần, Pro không giới hạn).
 * - Mỗi lượt lời: app gọi `/ctlanguage/ai/goi/luong` kèm `luotThi` + `buoc` ⇒ `loiGiamKhao` trả câu của kịch bản
 *   (máy nghe người học + đọc câu kế; KHÔNG gọi model).
 * - Chấm: IELTS ⇒ dùng nguyên máy chấm Speaking của web (`ielts/thiNoi.service.ts › chamNoi`, 4 tiêu chí FC·LR·GRA·P,
 *   chạy nền + hỏi lại); HSKK ⇒ nhắc lại chấm bằng độ khớp chữ, hai phần trả lời do MỘT lời gọi model chấm (`goiChamNoi`).
 *   Điểm lưu vào dòng lượt; CHỮ người học nói không lưu ở bảng này (IELTS: sổ `ielts_cdt_attempts` của web giữ bản ghi chữ).
 * - Phát âm: chỉ ƯỚC LƯỢNG từ chữ máy nghe ra (app gửi m4a qua luồng gọi, không qua máy chấm phát âm) — kết quả ghi rõ.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { logger } from '../../utils/logger.js';
import { chamNoi as chamNoiIelts, ketQuaChamNoi as ketQuaChamNoiIelts, type BanGhiVao, type KetQuaChamNoi } from '../ielts/thiNoi.service.js';
import { goiChamNoi } from '../ielts/troChuyen/troChuyenLuong.service.js';
import { dauTuanVn, duocThi, type NnThi } from './thiThuan.js';
import { docNn, napDe } from './thi.js';
import {
  deNoiHskk, diemNhacLai, docChamHskk, kiemDeNoi, sachBanGhiNoi, tomTatDeNoi, tongHskk,
  type BanGhiNoi, type DeNoi, type KetQuaThiNoi,
} from './thiNoiThuan.js';

export const THU_MUC_DE_NOI = path.join(process.cwd(), 'content', 'ctlanguage', 'de-thi-noi');
/** Lượt thi nói mở quá lâu thì không đọc tiếp (chặn mượn máy đọc bằng một lượt cũ). */
const HAN_LUOT_MS = 90 * 60_000;

let khoNoi: Map<string, DeNoi> | null = null;

export function napDeNoi(thuMuc = THU_MUC_DE_NOI): Map<string, DeNoi> {
  const ra = new Map<string, DeNoi>();
  let tep: string[] = [];
  try { tep = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.json')).sort(); } catch { /* chưa có thư mục */ }
  for (const f of tep) {
    try {
      const de = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8')) as DeNoi;
      const loi = kiemDeNoi(de);
      if (loi.length || de.id !== f.replace(/\.json$/, '')) { logger.error('[ctl-thi-noi] bỏ đề không hợp lệ', { tep: f, loi: loi.slice(0, 5) }); continue; }
      ra.set(de.id, de);
    } catch (e) { logger.error('[ctl-thi-noi] không đọc được đề', { tep: f, error: e instanceof Error ? e.message : String(e) }); }
  }
  // HSKK: dựng từ đề HSKK của phòng thi.
  for (const d of napDe().values()) {
    if (d.kyThi !== 'HSKK') continue;
    const n = deNoiHskk(d);
    if (n && !kiemDeNoi(n).length) ra.set(n.id, n);
    else if (n) logger.error('[ctl-thi-noi] đề HSKK không dựng được kịch bản', { de: d.id, loi: kiemDeNoi(n).slice(0, 5) });
  }
  return ra;
}

const kho = () => (khoNoi ??= napDeNoi());
/** Test: thay kho đề nói. */
export function _datKhoDeNoi(m: Map<string, DeNoi> | null) { khoNoi = m; }
/** Tên đề nói theo id (lịch sử thi dùng chung). */
export const tenDeNoi = (id: string): string | undefined => kho().get(id)?.ten;

function layDe(id: unknown): DeNoi {
  const de = kho().get(String(id ?? ''));
  if (!de) throw new NotFoundError('Không tìm thấy đề thi nói này.');
  return de;
}

function trongTuan(bayGio: Date) {
  const tu = dauTuanVn(bayGio);
  return { gte: tu, lt: new Date(tu.getTime() + 7 * 86_400_000) };
}

/** Danh mục đề nói của một ngôn ngữ (+ điểm cao nhất, được thi không nếu đã đăng nhập). */
export async function danhMucNoi(nnRaw: unknown, userId: number | null, bayGio = new Date()) {
  const nn = docNn(nnRaw);
  const de = [...kho().values()].filter((d) => d.nn === nn).sort((a, b) => a.cap.localeCompare(b.cap) || a.id.localeCompare(b.id, 'en', { numeric: true }));
  const laPro = userId ? await isProEffective(userId) : false;
  const cua = userId && de.length
    ? await prisma.ctlLuotThi.findMany({ where: { userId, nn, deId: { in: de.map((d) => d.id) } }, select: { deId: true, cap: true, diem: true, nopLuc: true, batDauLuc: true }, orderBy: { id: 'desc' }, take: 300 })
    : [];
  const tuan = trongTuan(bayGio);
  return {
    nn, laPro,
    items: de.map((d) => {
      const daThi = [...new Set(cua.filter((l) => l.cap === d.cap && l.batDauLuc >= tuan.gte && l.batDauLuc < tuan.lt).map((l) => l.deId))];
      const diem = cua.filter((l) => l.deId === d.id && l.nopLuc && l.diem !== null).map((l) => l.diem as number);
      return {
        ...tomTatDeNoi(d),
        diemCaoNhat: diem.length ? Math.max(...diem) : null,
        soLanThi: diem.length,
        duocThi: userId ? duocThi({ laPro, kyThi: d.kyThi, deId: d.id, deDaThiTuanNay: daThi }).duoc : true,
      };
    }),
  };
}

export function deNoiCho(id: unknown): DeNoi { return layDe(id); }

/** Mở một lượt thi nói. Free hết lượt của cấp trong tuần ⇒ 403 `CTL_THI_HET_LUOT`. */
export async function batDauNoi(userId: number, deId: unknown, bayGio = new Date()) {
  const de = layDe(deId);
  const laPro = await isProEffective(userId);
  const ds = await prisma.ctlLuotThi.findMany({ where: { userId, cap: de.cap, deId: { in: [...kho().keys()] }, batDauLuc: trongTuan(bayGio) }, distinct: ['deId'], select: { deId: true } });
  if (!duocThi({ laPro, kyThi: de.kyThi, deId: de.id, deDaThiTuanNay: ds.map((d) => d.deId) }).duoc) {
    throw new AppError('Bản miễn phí thi nói với giám khảo AI 1 đề mỗi cấp mỗi tuần (làm lại đúng đề đó thì được). Pro thi không giới hạn.', 403, 'CTL_THI_HET_LUOT');
  }
  const luot = await prisma.ctlLuotThi.create({ data: { userId, nn: de.nn, deId: de.id, kyThi: de.kyThi, cap: de.cap, batDauLuc: bayGio } });
  return { luotId: luot.id, deId: de.id, laPro, batDauLuc: luot.batDauLuc };
}

async function layLuot(userId: number, luotIdRaw: unknown) {
  const luotId = Number(luotIdRaw);
  if (!Number.isInteger(luotId) || luotId <= 0) throw new BadRequestError('Lượt thi không hợp lệ');
  const luot = await prisma.ctlLuotThi.findFirst({ where: { id: luotId, userId } });
  if (!luot) throw new NotFoundError('Không tìm thấy lượt thi này.');
  return { luot, de: layDe(luot.deId) };
}

/** Lời giám khảo của bước `buoc` trong lượt đang mở (gọi từ luồng gọi CuongMini). */
export async function loiGiamKhao(userId: number, luotIdRaw: unknown, buocRaw: unknown, bayGio = new Date()): Promise<{ loi: string; nn: NnThi }> {
  const { luot, de } = await layLuot(userId, luotIdRaw);
  if (luot.nopLuc) throw new BadRequestError('Lượt thi này đã chấm xong.');
  if (bayGio.getTime() - luot.batDauLuc.getTime() > HAN_LUOT_MS) throw new BadRequestError('Lượt thi đã quá hạn — mở lại đề để thi từ đầu.');
  const i = Number(buocRaw);
  const b = Number.isInteger(i) ? de.buoc[i] : undefined;
  if (!b) throw new BadRequestError('Bước thi không hợp lệ');
  return { loi: b.loi, nn: de.nn };
}

// ─── Chấm ─────────────────────────────────────────────────────

const TEN_TIEU_CHI: Record<string, string> = { fc: 'Fluency & Coherence (trôi chảy, mạch lạc)', lr: 'Lexical Resource (từ vựng)', gra: 'Grammatical Range & Accuracy (ngữ pháp)', p: 'Pronunciation (phát âm — ước lượng)' };

export function tuKetQuaIelts(k: KetQuaChamNoi, de: DeNoi): KetQuaThiNoi {
  return {
    thang: 'band', tong: k.band, dat: k.band * 10 >= de.diemDat,
    tieuChi: (['fc', 'lr', 'gra', 'p'] as const).map((m) => ({ ma: m.toUpperCase(), ten: TEN_TIEU_CHI[m]!, diem: k.tieuChi[m], nhanXet: k.nhanXetTieuChi?.[m] ?? '' })),
    nhanXet: k.nhanXet,
    goiY: (k.noiLai ?? []).slice(0, 4).map((x) => `Part ${x.part} — thay vì "${x.goc}", thử: "${x.tot}"`),
    loi: (k.loi ?? []).slice(0, 8).map((x) => ({ goc: x.goc, sua: x.sua, vi: x.vi })),
    phatAm: k.pNguon === 'azure+ai' ? 'azure+ai' : 'chu',
  };
}

async function luuKetQua(luotId: number, de: DeNoi, kq: KetQuaThiNoi, batDauLuc: Date, bayGio: Date) {
  const diem = kq.thang === 'band' ? Math.round(kq.tong * 10) : Math.round(kq.tong);
  await prisma.ctlLuotThi.updateMany({
    where: { id: luotId, nopLuc: null },
    data: {
      nopLuc: bayGio, diem, diemToiDa: de.diemToiDa, dat: kq.dat, xepHang: false,
      giay: Math.min(de.phut * 60 * 2, Math.max(0, Math.round((bayGio.getTime() - batDauLuc.getTime()) / 1000))),
      chiTiet: { noi: kq } as unknown as Prisma.InputJsonValue,
    },
  });
}

const PHAN_SO: Record<string, 1 | 2 | 3> = { p1: 1, p2: 2, p3: 3 };

/** Việc chấm IELTS đang chạy nền: viecId ⇒ lượt (để lúc hỏi lại còn biết ghi điểm vào đâu). */
const VIEC = new Map<string, { userId: number; luotId: number; luc: number }>();

async function chamHskk(userId: number, de: DeNoi, banGhi: BanGhiNoi[]): Promise<KetQuaThiNoi | { lyDo: string }> {
  const nl = diemNhacLai(de, banGhi);
  const theo = new Map(banGhi.map((x) => [x.buoc, x]));
  const dong = de.buoc.map((b, i) => ({ b, i })).filter((x) => x.b.kieu !== 'nhacLai' && x.b.giayNoi > 0 && !x.b.khongCham)
    .map((x) => `[Phần ${PHAN_SO[x.b.phan] ?? 2}] Hỏi: ${x.b.hoi ?? x.b.loi}\n   Trả lời (${theo.get(x.i)?.giay ?? 0}s): ${theo.get(x.i)?.text || '(không trả lời)'}`);
  const system = [
    'Bạn là giám khảo HSKK sơ cấp (汉语水平口语考试 初级) nghiêm túc nhưng tử tế. Người thi là người Việt; câu trả lời là CHỮ do máy nghe ra (có thể sai chữ đồng âm — đừng trừ điểm vì chữ đồng âm).',
    'Chấm HAI phần: "phan2" = nghe–trả lời (10 câu, trả lời ngắn đúng trọng tâm câu hỏi, đúng ngữ pháp) và "phan3" = trả lời câu hỏi (2 câu, mỗi câu nên nói vài câu liền mạch, đủ ý, từ vựng HSK 1–2). Thang 0–100 mỗi phần; câu không trả lời = 0 điểm của câu đó; 60 = đạt.',
    'Trả về DUY NHẤT một JSON: {"phan2":{"diem":số,"nhanXet":"1–2 câu tiếng Việt, trích ví dụ"},"phan3":{"diem":số,"nhanXet":"1–2 câu tiếng Việt"},"nhanXet":"2 câu tổng quát tiếng Việt","goiY":["3 việc cụ thể để lên điểm"],"loi":[{"goc":"câu người thi nói sai","sua":"câu đúng","vi":"lý do ngắn tiếng Việt"}]}',
  ].join('\n');
  const raw = dong.some((d) => !d.endsWith('(không trả lời)')) ? await goiChamNoi(userId, system, dong.join('\n')) : '{"phan2":{"diem":0,"nhanXet":"Bạn chưa trả lời câu nào ở phần này."},"phan3":{"diem":0,"nhanXet":"Bạn chưa trả lời câu nào ở phần này."},"nhanXet":"Bài thi gần như chưa có câu trả lời.","goiY":[],"loi":[]}';
  const k = docChamHskk(raw);
  if (!k) return { lyDo: 'loi_ai' };
  const tong = tongHskk(nl.diem, k.p2.diem, k.p3.diem);
  return {
    thang: 'diem', tong, dat: tong >= de.diemDat,
    tieuChi: [
      { ma: 'nhac_lai', ten: 'Phần 1 · Nghe rồi nhắc lại (30%)', diem: nl.diem, nhanXet: `${nl.soKhop}/${nl.soCau} câu nhắc lại khớp từ 80% chữ trở lên (máy so chữ nghe được với câu gốc).` },
      { ma: 'tra_loi_ngan', ten: 'Phần 2 · Nghe rồi trả lời (30%)', diem: k.p2.diem, nhanXet: k.p2.nhanXet },
      { ma: 'tra_loi_dai', ten: 'Phần 3 · Trả lời câu hỏi (40%)', diem: k.p3.diem, nhanXet: k.p3.nhanXet },
    ],
    nhanXet: k.nhanXet, goiY: k.goiY, loi: k.loi, phatAm: 'chu',
  };
}

/**
 * Chấm cả buổi. `banGhi` = [{buoc, text, giay}] (chữ máy nghe ra ở từng bước — app gom từ sự kiện `nghe`; câu hỏi lấy từ
 * kịch bản của máy chủ, không tin câu hỏi app gửi). IELTS ⇒ `{viecId}` (chấm nền, hỏi lại `ketQuaChamThiNoi`);
 * HSKK ⇒ `{ketQua}` ngay.
 */
export async function chamThiNoi(userId: number, luotIdRaw: unknown, b: { banGhi?: unknown }, bayGio = new Date()) {
  const { luot, de } = await layLuot(userId, luotIdRaw);
  if (luot.nopLuc) {
    const kq = (luot.chiTiet as { noi?: KetQuaThiNoi } | null)?.noi;
    return kq ? { ketQua: kq } : { ketQua: null, lyDo: 'da_cham' };
  }
  const banGhi = sachBanGhiNoi(de, b?.banGhi).filter((x) => !de.buoc[x.buoc]!.khongCham);
  if (!banGhi.some((x) => x.text)) return { ketQua: null, lyDo: 'it_luot' };
  if (de.kyThi === 'IELTS') {
    const vao: BanGhiVao[] = banGhi.map((x) => ({ part: PHAN_SO[de.buoc[x.buoc]!.phan] ?? 1, cau: (de.buoc[x.buoc]!.hoi ?? de.buoc[x.buoc]!.loi).slice(0, 400), transcript: x.text, giay: x.giay }));
    const r = await chamNoiIelts(userId, { deId: de.nguon ?? de.id, cheDo: 'thi', banGhi: vao, giay: Math.round((bayGio.getTime() - luot.batDauLuc.getTime()) / 1000) });
    if (!r.viecId) return { ketQua: null, lyDo: ('lyDo' in r && r.lyDo) || 'loi_ai' };
    if (VIEC.size > 2000) VIEC.clear();
    VIEC.set(r.viecId, { userId, luotId: luot.id, luc: Date.now() });
    return { viecId: r.viecId };
  }
  const kq = await chamHskk(userId, de, banGhi);
  if ('lyDo' in kq) return { ketQua: null, lyDo: kq.lyDo };
  await luuKetQua(luot.id, de, kq, luot.batDauLuc, bayGio);
  return { ketQua: kq };
}

/** Hỏi lại việc chấm IELTS. Xong ⇒ ghi điểm vào dòng lượt (một lần) rồi trả kết quả. */
export async function ketQuaChamThiNoi(userId: number, viecId: string, bayGio = new Date()) {
  const v = VIEC.get(viecId);
  if (!v || v.userId !== userId) return { xong: true, ketQua: null, lyDo: 'khong_thay' };
  const r = ketQuaChamNoiIelts(userId, viecId);
  if (!r.xong) return { xong: false, giay: 'giay' in r ? r.giay : 0 };
  VIEC.delete(viecId);
  if (!('ketQua' in r) || !r.ketQua) return { xong: true, ketQua: null, lyDo: ('lyDo' in r && r.lyDo) || 'loi_ai' };
  const { luot, de } = await layLuot(userId, v.luotId);
  const kq = tuKetQuaIelts(r.ketQua, de);
  await luuKetQua(luot.id, de, kq, luot.batDauLuc, bayGio).catch((e) => logger.warn('[ctl-thi-noi] không lưu được điểm', { error: (e as Error).message }));
  return { xong: true, ketQua: kq };
}
