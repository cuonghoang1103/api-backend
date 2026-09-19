/**
 * PHÒNG THI IELTS — dựng một đề thi thử từ nội dung đã có.
 * ─────────────────────────────────────────────────────────────────────────
 * Ba phần, đúng thứ tự và đúng đồng hồ của kỳ thi thật:
 *
 *   Listening  4 phần · ~30 phút (thi thật: 30 phút nghe + 10 phút chép đáp án)
 *   Reading    3 bài  · 60 phút
 *   Writing    Task 1 (20 phút) + Task 2 (40 phút)
 *
 * ⚠️ ĐÂY LÀ ĐỀ THỬ, KHÔNG PHẢI ĐỀ THI THẬT. Kho nội dung có 10 câu mỗi bài
 * đọc, nên một đề ba bài ra ~30 câu chứ không phải 40. Điểm band quy đổi
 * bằng cách chuẩn hoá về thang 40 rồi tra bảng — và con số đó đi kèm lời nói
 * rõ nó là ƯỚC LƯỢNG. Một band 6.5 hiện ra trơn tru sẽ được tin như điểm
 * thật, nên chỗ này phải nói thẳng.
 *
 * Đề dựng theo `hat` (seed) nên "làm lại đúng đề này" ra đúng bộ câu cũ —
 * người học cần so điểm lần hai với lần một, mà bộ câu đổi thì so vô nghĩa.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

/** Bảng quy đổi chính thức, thang 40 câu. */
const BANG_DOC: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
  [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
];
const BANG_NGHE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [18, 5.5], [16, 5], [13, 4.5], [11, 4], [8, 3.5], [6, 3], [4, 2.5],
];

/**
 * Quy đổi điểm thô ra band.
 *
 * `soCau` thường < 40 (kho nội dung có 10 câu/bài), nên phải chuẩn hoá về 40
 * trước khi tra bảng. Tra thẳng bảng 40 với một đề 30 câu thì ai làm đúng
 * hết cũng chỉ ra band 7 — sai, và sai theo hướng làm người học nản.
 */
export function quyDoiBand(dung: number, soCau: number, loai: 'doc' | 'nghe'): number {
  if (soCau <= 0) return 0;
  const chuan = Math.round((dung / soCau) * 40);
  const bang = loai === 'doc' ? BANG_DOC : BANG_NGHE;
  for (const [nguong, band] of bang) {
    if (chuan >= nguong) return band;
  }
  return 2;
}

/** Bốc n phần tử theo `hat`, không lặp. Cùng `hat` thì cùng kết quả. */
function boc<T>(ds: T[], n: number, hat: number): T[] {
  const con = [...ds];
  const ra: T[] = [];
  let s = hat % 2147483647;
  if (s <= 0) s += 2147483646;
  while (ra.length < n && con.length > 0) {
    s = (s * 16807) % 2147483647;
    ra.push(con.splice(s % con.length, 1)[0]!);
  }
  return ra;
}

async function layPhan(stage: string, kind: string): Promise<unknown> {
  const r = await prisma.ieltsContent.findUnique({
    where: { uk_ielts_stage_kind: { stage, kind } },
    select: { payload: true },
  });
  return r?.payload ?? null;
}

export const CAC_CHANG_THI = ['stage1', 'stage2', 'stage3', 'stage4'] as const;

/**
 * Dựng một đề. `chang` quyết định độ khó; `hat` quyết định bộ câu.
 *
 * Trả về ĐỦ đáp án và lời giải: app chấm tại chỗ ngay khi hết giờ, không
 * phải gọi mạng lần nữa. Người vừa thi xong muốn xem sai ở đâu NGAY, và bắt
 * họ chờ thêm một vòng mạng là chỗ dễ mất người dùng nhất của cả tính năng.
 */
export async function dungDe(chang: string, hat: number) {
  const s = /^[1-4]$/.test(chang) ? `stage${chang}` : chang;
  if (!(CAC_CHANG_THI as readonly string[]).includes(s)) {
    throw new BadRequestError(`Chặng không hợp lệ: ${chang}`);
  }

  const [rd, ls, wr] = await Promise.all([
    layPhan(s, 'readings'),
    layPhan(s, 'listenings'),
    layPhan(s, 'writings'),
  ]);

  const doc = Array.isArray(rd) ? (rd as Record<string, unknown>[]) : [];
  const nghe = Array.isArray((ls as Record<string, unknown>)?.items)
    ? ((ls as Record<string, unknown>).items as Record<string, unknown>[]) : [];
  const viet = Array.isArray(wr) ? (wr as Record<string, unknown>[]) : [];

  if (doc.length === 0 && nghe.length === 0) {
    throw new BadRequestError(`Chặng ${s} chưa có nội dung để dựng đề`);
  }

  const baiDoc = boc(doc, Math.min(3, doc.length), hat);
  const baiNghe = boc(nghe, Math.min(4, nghe.length), hat + 7);
  // Task 1 và Task 2 là hai dạng KHÁC nhau, không bốc chung một rổ: đề thi
  // thật luôn có đúng một cái mỗi loại, còn bốc ngẫu nhiên thì có lượt ra
  // hai Task 2 và người học không luyện được Task 1 bao giờ.
  const t1 = viet.filter((w) => String(w.task ?? '').includes('1'));
  const t2 = viet.filter((w) => String(w.task ?? '').includes('2'));
  const deViet = [
    ...boc(t1.length ? t1 : viet, 1, hat + 13),
    ...boc(t2.length ? t2 : viet, 1, hat + 29),
  ].filter(Boolean);

  const demCau = (ds: Record<string, unknown>[]) =>
    ds.reduce((n, x) => n + ((x.questions as unknown[] | undefined)?.length ?? 0), 0);

  return {
    chang: s,
    hat,
    phan: {
      nghe: { phut: 30, bai: baiNghe, soCau: demCau(baiNghe) },
      doc: { phut: 60, bai: baiDoc, soCau: demCau(baiDoc) },
      viet: { phut: 60, de: deViet },
    },
    // App hiện nguyên câu này ở đầu và cuối đề. Không để app tự nghĩ ra lời
    // cảnh báo: mỗi màn sẽ nói một kiểu, và có màn quên nói.
    canhBao: 'Đây là ĐỀ THỬ dựng từ kho bài luyện, không phải đề thi thật. '
      + 'Band chỉ là ước lượng quy đổi từ tỉ lệ đúng.',
  };
}

/** Ghi kết quả một lượt thi vào tiến độ. */
export async function nopDe(
  userId: number,
  b: { chang?: string; hat?: number; dungDoc?: number; cauDoc?: number; dungNghe?: number; cauNghe?: number },
) {
  const s = /^[1-4]$/.test(String(b.chang)) ? `stage${b.chang}` : String(b.chang ?? '');
  if (!(CAC_CHANG_THI as readonly string[]).includes(s)) throw new BadRequestError('Chặng không hợp lệ');

  const n = (v: unknown) => Math.max(0, Math.round(Number(v) || 0));
  const bandDoc = n(b.cauDoc) > 0 ? quyDoiBand(n(b.dungDoc), n(b.cauDoc), 'doc') : null;
  const bandNghe = n(b.cauNghe) > 0 ? quyDoiBand(n(b.dungNghe), n(b.cauNghe), 'nghe') : null;

  const co = [bandDoc, bandNghe].filter((x): x is number => x != null);
  // Band tổng làm tròn 0,5 — đúng cách kỳ thi thật làm tròn.
  const bandTong = co.length ? Math.round((co.reduce((a, c) => a + c, 0) / co.length) * 2) / 2 : null;

  const muc = `de-${s}-${n(b.hat)}`;
  await prisma.ieltsProgress.upsert({
    where: { uk_ielts_tien_do: { userId, stage: s, kind: 'exam', muc } },
    create: {
      userId, stage: s, kind: 'exam', muc, xong: true,
      diem: bandTong == null ? null : Math.round(bandTong * 10),
      ghiChu: JSON.stringify({ bandDoc, bandNghe, bandTong, dungDoc: n(b.dungDoc), cauDoc: n(b.cauDoc), dungNghe: n(b.dungNghe), cauNghe: n(b.cauNghe) }),
    },
    update: {
      xong: true,
      diem: bandTong == null ? null : Math.round(bandTong * 10),
      ghiChu: JSON.stringify({ bandDoc, bandNghe, bandTong, dungDoc: n(b.dungDoc), cauDoc: n(b.cauDoc), dungNghe: n(b.dungNghe), cauNghe: n(b.cauNghe) }),
    },
  });

  return { bandDoc, bandNghe, bandTong };
}

/** Lịch sử các lượt thi, mới nhất trước. */
export async function lichSuThi(userId: number) {
  const ds = await prisma.ieltsProgress.findMany({
    where: { userId, kind: 'exam' },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: { stage: true, muc: true, diem: true, ghiChu: true, updatedAt: true },
  });
  return {
    items: ds.map((d) => {
      let chiTiet: unknown = null;
      // `ghiChu` là JSON do chính mã này ghi, nhưng một hàng cũ từ bản trước
      // có thể mang hình dạng khác — hỏng một hàng không được làm hỏng cả
      // màn lịch sử.
      try { chiTiet = d.ghiChu ? JSON.parse(d.ghiChu) : null; } catch { chiTiet = null; }
      return { stage: d.stage, muc: d.muc, band: d.diem == null ? null : d.diem / 10, chiTiet, luc: d.updatedAt };
    }),
  };
}
