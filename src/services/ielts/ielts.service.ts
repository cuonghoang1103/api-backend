/**
 * IELTS — phục vụ nội dung cho app (iOS/iPad) và giữ tiến độ theo NGƯỜI.
 * ─────────────────────────────────────────────────────────────────────────
 * Nội dung nằm trong `ielts_content` dạng JSON, do `scripts/ielts-seed.mjs`
 * nạp từ `content/ielts/noi-dung.json` — bản sao do máy dựng lại từ tệp TS
 * của web, có chốt chống trôi ở `nguon.test.ts`.
 *
 * Backend KHÔNG đọc vào trong payload. Nó chỉ trả nguyên khối. Mọi hiểu biết
 * về hình dạng nội dung nằm ở hai đầu: tệp TS của web và mô hình Swift của
 * app. Thêm một bản hiểu thứ ba ở giữa là thêm một chỗ để lệch.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';

export const CAC_CHANG = ['stage1', 'stage2', 'stage3', 'stage4'] as const;
export const PHAN_CUA_CHANG = [
  'meta', 'units', 'vocab', 'readings', 'listenings',
  'writings', 'speakings', 'exercises', 'questionTypes',
] as const;
export const PHAN_DUNG_CHUNG = ['roadmap', 'life', 'exam', 'typing'] as const;

type Chang = (typeof CAC_CHANG)[number];

function chuanChang(v: string): Chang {
  // Chấp cả `1` và `stage1` — app gõ số thì gọn hơn, mà một đường dẫn lạ
  // trả 500 thì khó lần hơn hẳn một câu 400 nói rõ.
  const s = /^[1-4]$/.test(v) ? `stage${v}` : v;
  if (!(CAC_CHANG as readonly string[]).includes(s)) {
    throw new BadRequestError(`Chặng không hợp lệ: ${v} (dùng stage1…stage4)`);
  }
  return s as Chang;
}

/**
 * Màn đầu tiên: lộ trình 4 chặng + mục lục có SỐ MỤC của từng phần.
 *
 * Lấy `soMuc` từ cột riêng chứ không đọc payload rồi đếm: mục lục nhẹ vài KB,
 * còn tải cả 1,2 MB về chỉ để biết "chặng 1 có 5 bài đọc" thì người dùng chờ
 * mấy giây trên 4G để nhìn một con số.
 */
export async function loTrinh(userId: number) {
  const [roadmap, mucLuc, tienDo] = await Promise.all([
    prisma.ieltsContent.findUnique({
      where: { uk_ielts_stage_kind: { stage: 'shared', kind: 'roadmap' } },
      select: { payload: true },
    }),
    prisma.ieltsContent.findMany({
      select: { stage: true, kind: true, soMuc: true },
      orderBy: [{ stage: 'asc' }, { kind: 'asc' }],
    }),
    prisma.ieltsProgress.groupBy({
      by: ['stage', 'kind'],
      where: { userId, xong: true },
      _count: { _all: true },
    }),
  ]);

  const daXong = new Map(tienDo.map((t) => [`${t.stage}/${t.kind}`, t._count._all]));
  const meta = new Map(
    mucLuc.filter((m) => m.kind === 'meta').map((m) => [m.stage, m]),
  );

  const chang = CAC_CHANG.map((id) => {
    const phan = mucLuc
      .filter((m) => m.stage === id && m.kind !== 'meta')
      .map((m) => ({
        kind: m.kind,
        soMuc: m.soMuc,
        daXong: daXong.get(`${id}/${m.kind}`) ?? 0,
      }));
    const tongMuc = phan.reduce((s, p) => s + p.soMuc, 0);
    const tongXong = phan.reduce((s, p) => s + p.daXong, 0);
    return {
      id,
      coNoiDung: meta.has(id),
      phan,
      tongMuc,
      tongXong,
      tiLe: tongMuc > 0 ? Math.round((tongXong / tongMuc) * 100) : 0,
    };
  });

  return {
    roadmap: roadmap?.payload ?? null,
    chang,
    // `false` nghĩa là CHƯA SEED, không phải "khoá này không có nội dung".
    // Hai cái đó phải phân biệt được: một cái là lỗi vận hành, một cái là
    // trạng thái bình thường, và app phải nói khác nhau.
    daSeed: mucLuc.length > 0,
  };
}

/** Một phần của một chặng — `readings`, `vocab`… */
export async function phanCuaChang(stage: string, kind: string) {
  const s = chuanChang(stage);
  if (!(PHAN_CUA_CHANG as readonly string[]).includes(kind)) {
    throw new BadRequestError(`Phần không hợp lệ: ${kind}`);
  }
  const row = await prisma.ieltsContent.findUnique({
    where: { uk_ielts_stage_kind: { stage: s, kind } },
    select: { payload: true, soMuc: true, updatedAt: true },
  });
  if (!row) throw new NotFoundError(`Chưa có nội dung cho ${s}/${kind}`);
  return { stage: s, kind, soMuc: row.soMuc, capNhatLuc: row.updatedAt, payload: row.payload };
}

/** Phần dùng chung cả khoá — `roadmap`, `life`, `exam`, `typing`. */
export async function phanDungChung(kind: string) {
  if (!(PHAN_DUNG_CHUNG as readonly string[]).includes(kind)) {
    throw new BadRequestError(`Phần không hợp lệ: ${kind}`);
  }
  const row = await prisma.ieltsContent.findUnique({
    where: { uk_ielts_stage_kind: { stage: 'shared', kind } },
    select: { payload: true, soMuc: true, updatedAt: true },
  });
  if (!row) throw new NotFoundError(`Chưa có nội dung cho ${kind}`);
  return { kind, soMuc: row.soMuc, capNhatLuc: row.updatedAt, payload: row.payload };
}

// ─── Tiến độ ──────────────────────────────────────────────────────────────

export async function layTienDo(userId: number, stage?: string) {
  const where = stage ? { userId, stage: chuanChang(stage) } : { userId };
  const ds = await prisma.ieltsProgress.findMany({
    where,
    select: { stage: true, kind: true, muc: true, xong: true, diem: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 5000,
  });
  return { items: ds };
}

/**
 * Ghi tiến độ một mục. Gửi cả cụm cũng được — app tích 20 từ vựng một lượt
 * thì 20 lời gọi HTTP trên 4G là 20 lần chờ.
 */
export async function ghiTienDo(
  userId: number,
  ds: { stage: string; kind: string; muc: string; xong?: boolean; diem?: number | null; ghiChu?: string | null }[],
) {
  if (!Array.isArray(ds) || ds.length === 0) throw new BadRequestError('Thiếu danh sách mục');
  if (ds.length > 200) throw new BadRequestError('Tối đa 200 mục mỗi lượt');

  let ghi = 0;
  for (const m of ds) {
    const stage = chuanChang(String(m.stage));
    const kind = String(m.kind);
    const muc = String(m.muc).slice(0, 120);
    if (!muc) continue;
    if (![...PHAN_CUA_CHANG, ...PHAN_DUNG_CHUNG].includes(kind as never)) {
      throw new BadRequestError(`Phần không hợp lệ: ${kind}`);
    }
    const xong = m.xong !== false;
    const diem = m.diem == null ? null : Math.max(0, Math.min(100, Math.round(Number(m.diem))));
    await prisma.ieltsProgress.upsert({
      where: { uk_ielts_tien_do: { userId, stage, kind, muc } },
      create: { userId, stage, kind, muc, xong, diem, ghiChu: m.ghiChu?.slice(0, 2000) ?? null },
      update: { xong, diem, ghiChu: m.ghiChu?.slice(0, 2000) ?? null },
    });
    ghi += 1;
  }
  return { ghi };
}

export async function xoaTienDo(userId: number, stage: string, kind: string, muc: string) {
  const s = chuanChang(stage);
  const { count } = await prisma.ieltsProgress.deleteMany({
    where: { userId, stage: s, kind, muc },
  });
  return { xoa: count };
}
