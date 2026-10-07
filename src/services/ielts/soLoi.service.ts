/**
 * SỔ LỖI IELTS tự động (07/10/2026) — thay Google Sheet ghi lỗi bằng tay.
 * ─────────────────────────────────────────────────────────────────────────
 * Phòng thi/luyện tập gửi mỗi câu SAI lên đây (`ghi`). Câu đã có (cùng `nguon`)
 * thì cộng dồn số lần sai và hẹn ôn lại từ đầu. Người học chọn LÝ DO sai và
 * viết "công thức rút ra"; AI gợi ý được (tuỳ chọn, có trần token).
 *
 * Ôn sổ lỗi = làm lại câu sai, có GIÃN CÁCH (srs.ts: ≥ 2 ngày, rồi 7 ngày) —
 * làm lại ngay sau khi xem đáp án chỉ là nhớ đáp án, không phải sửa lỗi.
 * Máy chủ CHẶN làm lại trước hạn (`lamLai`), không chỉ giấu nút ở giao diện.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, AppError } from '../../middleware/errorHandler.js';
import { isAiAvailable, llmComplete, checkTokenQuota, extractJson } from '../interview/llm/index.js';
import { henSoLoiMoi, lamLaiSoLoi } from './srs.js';

export const KY_NANG = ['doc', 'nghe', 'viet', 'noi', 'tuvung'] as const;
export const LY_DO: Record<string, string> = {
  paraphrase: 'Bẫy paraphrase / đồng nghĩa',
  'so-tu': 'Không đọc kỹ yêu cầu số từ',
  'chinh-ta': 'Sai chính tả',
  'ngu-phap': 'Sai ngữ pháp (số ít/nhiều, dạng từ)',
  'ng-false': 'Nhầm NOT GIVEN với FALSE/NO',
  'doc-sot': 'Đọc lướt sót ý / sai vị trí',
  'nghe-sot': 'Nghe sót / không theo kịp',
  'tu-vung': 'Không biết từ',
  'het-gio': 'Hết giờ / bỏ trống',
  khac: 'Lý do khác',
};

const cat = (v: unknown, n: number) => String(v ?? '').slice(0, n);

type MucGhi = { nguon?: unknown; kyNang?: unknown; dang?: unknown; cauHoi?: unknown; daChon?: unknown; dapAn?: unknown; giaiThich?: unknown; lyDo?: unknown; duLieu?: unknown };

/** Ghi các câu sai (tối đa 80 câu/lần — một đề đủ là 40). */
export async function ghi(userId: number, ds: unknown) {
  if (!Array.isArray(ds) || ds.length < 1 || ds.length > 80) throw new BadRequestError('muc phải là mảng 1–80 câu');
  const now = new Date();
  let moi = 0, cong = 0;
  for (const m of ds as MucGhi[]) {
    const nguon = cat(m.nguon, 160).trim();
    const kyNang = String(m.kyNang ?? '');
    if (!nguon || !(KY_NANG as readonly string[]).includes(kyNang)) throw new BadRequestError('Thiếu nguồn hoặc kỹ năng không hợp lệ');
    const lyDo = m.lyDo && LY_DO[String(m.lyDo)] ? String(m.lyDo) : null;
    const duLieu = m.duLieu && typeof m.duLieu === 'object' && JSON.stringify(m.duLieu).length <= 8000 ? (m.duLieu as object) : undefined;
    const base = {
      kyNang, dang: cat(m.dang, 48) || 'Khác', cauHoi: cat(m.cauHoi, 2000), daChon: cat(m.daChon, 1000),
      dapAn: cat(m.dapAn, 1000), giaiThich: m.giaiThich ? cat(m.giaiThich, 3000) : null,
    };
    const cu = await prisma.ieltsMistake.findUnique({ where: { uk_ielts_so_loi: { userId, nguon } }, select: { id: true, lyDo: true } });
    const hen = henSoLoiMoi(now);
    if (cu) {
      cong += 1;
      await prisma.ieltsMistake.update({
        where: { id: cu.id },
        data: { ...base, lyDo: cu.lyDo ?? lyDo, ...(duLieu ? { duLieu } : {}), lanSai: { increment: 1 }, ...hen },
      });
    } else {
      moi += 1;
      await prisma.ieltsMistake.create({ data: { userId, nguon, ...base, lyDo, ...(duLieu ? { duLieu } : {}), ...hen } });
    }
  }
  return { moi, congDon: cong };
}

/** Danh sách + thống kê; lọc theo kỹ năng / dạng / lý do / trạng thái. */
export async function danhSach(userId: number, q: { kyNang?: unknown; dang?: unknown; lyDo?: unknown; trangThai?: unknown }) {
  const where: Record<string, unknown> = { userId };
  if (q.kyNang && (KY_NANG as readonly string[]).includes(String(q.kyNang))) where.kyNang = String(q.kyNang);
  if (q.dang) where.dang = cat(q.dang, 48);
  if (q.lyDo) where.lyDo = q.lyDo === 'chua' ? null : cat(q.lyDo, 24);
  if (q.trangThai === 'den-han') { where.daXong = false; where.hanOn = { lte: new Date() }; }
  else if (q.trangThai === 'vung') where.daXong = true;
  else if (q.trangThai === 'dang-on') where.daXong = false;
  const [items, theoDang, theoLyDo, theoKyNang, denHan, tong] = await Promise.all([
    prisma.ieltsMistake.findMany({ where, orderBy: [{ updatedAt: 'desc' }], take: 500 }),
    prisma.ieltsMistake.groupBy({ by: ['dang'], where: { userId }, _count: { _all: true }, _sum: { lanSai: true } }),
    prisma.ieltsMistake.groupBy({ by: ['lyDo'], where: { userId }, _count: { _all: true } }),
    prisma.ieltsMistake.groupBy({ by: ['kyNang'], where: { userId }, _count: { _all: true } }),
    prisma.ieltsMistake.count({ where: { userId, daXong: false, hanOn: { lte: new Date() } } }),
    prisma.ieltsMistake.count({ where: { userId } }),
  ]);
  return {
    items,
    lyDoNhan: LY_DO,
    thongKe: {
      tong, denHan,
      theoDang: theoDang.map((d) => ({ dang: d.dang, so: d._count._all, lanSai: d._sum.lanSai ?? 0 })).sort((a, b) => b.lanSai - a.lanSai),
      theoLyDo: theoLyDo.map((d) => ({ lyDo: d.lyDo, so: d._count._all })).sort((a, b) => b.so - a.so),
      theoKyNang: theoKyNang.map((d) => ({ kyNang: d.kyNang, so: d._count._all })),
    },
  };
}

async function cuaToi(userId: number, id: number) {
  const m = await prisma.ieltsMistake.findFirst({ where: { id, userId } });
  if (!m) throw new NotFoundError('Không có câu này trong sổ lỗi');
  return m;
}

/** Sửa lý do / công thức rút ra. */
export async function sua(userId: number, id: number, b: { lyDo?: unknown; congThuc?: unknown }) {
  await cuaToi(userId, id);
  const data: { lyDo?: string | null; congThuc?: string | null } = {};
  if (b.lyDo !== undefined) {
    if (b.lyDo !== null && b.lyDo !== '' && !LY_DO[String(b.lyDo)]) throw new BadRequestError('Lý do không hợp lệ');
    data.lyDo = b.lyDo ? String(b.lyDo) : null;
  }
  if (b.congThuc !== undefined) data.congThuc = b.congThuc ? cat(b.congThuc, 2000) : null;
  return prisma.ieltsMistake.update({ where: { id }, data });
}

export async function xoa(userId: number, id: number) {
  await cuaToi(userId, id);
  await prisma.ieltsMistake.delete({ where: { id } });
  return { daXoa: true };
}

/** Kết quả một lần làm lại. Trước hạn ⇒ 409, không tính. */
export async function lamLai(userId: number, id: number, b: { dung?: unknown; traLoi?: unknown }) {
  const m = await cuaToi(userId, id);
  if (m.daXong) throw new AppError('Câu này đã vững — không cần ôn nữa', 409);
  const now = new Date();
  if (m.hanOn.getTime() > now.getTime()) {
    throw new AppError(`Chưa tới hạn ôn (${m.hanOn.toISOString().slice(0, 10)}) — làm lại ngay chỉ là nhớ đáp án`, 409);
  }
  const kq = lamLaiSoLoi(m.buoc, b.dung === true, now);
  return prisma.ieltsMistake.update({
    where: { id },
    data: {
      buoc: kq.buoc, daXong: kq.daXong, hanOn: kq.hanOn, lanOnCuoi: now,
      ...(kq.saiThem ? { lanSai: { increment: 1 }, daChon: cat(b.traLoi, 1000) || m.daChon } : {}),
    },
  });
}

/** AI gợi ý lý do sai + "công thức" (tuỳ chọn, có trần token/ngày). */
export async function goiY(userId: number, id: number) {
  const m = await cuaToi(userId, id);
  if (!isAiAvailable()) return { goiY: null, lyDo: 'ai_unavailable' as const };
  if (!(await checkTokenQuota(userId))) throw new AppError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.', 429);
  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 500,
    system: [
      'Bạn là gia sư IELTS cho người Việt (trình độ còn yếu). Người học vừa làm SAI một câu.',
      'Trả về DUY NHẤT một JSON: {"lyDo": "<mã>", "congThuc": "<1–2 câu tiếng Việt>"}.',
      `Mã lý do chọn đúng MỘT trong: ${Object.entries(LY_DO).map(([k, v]) => `${k} (${v})`).join('; ')}.`,
      '"congThuc" là quy tắc ngắn để lần sau không sai nữa, cụ thể cho DẠNG câu này (vd. "TFNG: bài nói ngược ⇒ FALSE; bài không nhắc ⇒ NOT GIVEN").',
    ].join('\n'),
    messages: [{
      role: 'user',
      content: `Kỹ năng: ${m.kyNang} · Dạng: ${m.dang}\nCâu hỏi: ${m.cauHoi}\nNgười học trả lời: ${m.daChon || '(bỏ trống)'}\nĐáp án đúng: ${m.dapAn}\n${m.giaiThich ? `Giải thích: ${m.giaiThich}` : ''}`,
    }],
  });
  try {
    const j = extractJson<{ lyDo?: string; congThuc?: string }>(kq?.text ?? '');
    return { goiY: { lyDo: j.lyDo && LY_DO[j.lyDo] ? j.lyDo : null, congThuc: cat(j.congThuc, 600) } };
  } catch {
    return { goiY: { lyDo: null, congThuc: cat(kq?.text, 600) } };
  }
}
