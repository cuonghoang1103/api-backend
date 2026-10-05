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

/**
 * Khoá IELTS 15 ngày trên web (/language/en/ielts, 26/09/2026) — nội dung
 * tĩnh trong frontend, chỉ TIẾN ĐỘ đi qua đây để laptop và iPad thấy cùng một
 * chỗ đang học. Không phải một "chặng" nên đứng ngoài CAC_CHANG.
 *   bai     — muc = id bài, xong = đã học xong
 *   baitap  — muc = id bài tập, diem = % đúng lần làm gần nhất
 *   kehoach — muc = 'ke-hoach', ghiChu = JSON kế hoạch học (ngày bắt đầu, lịch…)
 */
export const SACH = 'sach1';
/** Mọi khoá kiểu sách dùng chung bảng tiến độ này: IELTS (sach1), tiếng Nhật Dekiru (dekiru1). */
export const CAC_SACH = [SACH, 'dekiru1', 'jp1', 'ch1'] as const;
const laMaSach = (v: string): boolean => (CAC_SACH as readonly string[]).includes(v);
export const PHAN_SACH = ['bai', 'baitap', 'kehoach'] as const;

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
  const where = stage ? { userId, stage: laMaSach(stage) ? stage : chuanChang(stage) } : { userId };
  const ds = await prisma.ieltsProgress.findMany({
    where,
    // ghiChu chỉ cần cho kế hoạch học của khoá sách — các chặng cũ không dùng.
    select: { stage: true, kind: true, muc: true, xong: true, diem: true, updatedAt: true, ...(stage && laMaSach(stage) ? { ghiChu: true } : {}) },
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
    const laSach = laMaSach(String(m.stage));
    const stage: string = laSach ? String(m.stage) : chuanChang(String(m.stage));
    const kind = String(m.kind);
    const muc = String(m.muc).slice(0, 120);
    if (!muc) continue;
    const hopLe: readonly string[] = laSach ? PHAN_SACH : [...PHAN_CUA_CHANG, ...PHAN_DUNG_CHUNG];
    if (!hopLe.includes(kind)) {
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
    // Học bài / làm bài tập = một ngày có học (chuỗi ngày + màn chào). Lưu kế hoạch thì không tính.
    if (laSach && (kind === 'bai' || kind === 'baitap')) await ghiNgayHoc(userId, stage);
  }
  return { ghi };
}

/* ── Chuỗi ngày học (05/10/2026) ───────────────────────────────────────── */
const ngayVN = (d = new Date()) => new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
const luiNgay = (day: string, n: number) => { const d = new Date(`${day}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };

export async function ghiNgayHoc(userId: number, stage: string) {
  if (!laMaSach(stage)) throw new BadRequestError(`Khoá không hợp lệ: ${stage}`);
  const day = ngayVN();
  await prisma.hocNgay.upsert({
    where: { uk_hoc_ngay: { userId, stage, day } },
    create: { userId, stage, day },
    update: { soViec: { increment: 1 } },
  });
  return { day };
}

/** Chuỗi ngày học liên tiếp của một khoá (hôm nay chưa học thì đếm tới hôm qua) + 14 ngày gần nhất. */
export async function layChuoi(userId: number, stage: string) {
  if (!laMaSach(stage)) throw new BadRequestError(`Khoá không hợp lệ: ${stage}`);
  const homNay = ngayVN();
  const ds = await prisma.hocNgay.findMany({ where: { userId, stage, day: { gte: luiNgay(homNay, 400) } }, select: { day: true, soViec: true } });
  const co = new Map(ds.map((d) => [d.day, d.soViec]));
  let d = co.has(homNay) ? homNay : luiNgay(homNay, 1);
  let chuoi = 0;
  while (co.has(d)) { chuoi++; d = luiNgay(d, 1); }
  // Chuỗi dài nhất (để khen "kỷ lục mới").
  const sx = [...co.keys()].sort();
  let dai = 0, cur = 0, truoc = '';
  for (const x of sx) { cur = truoc && luiNgay(x, 1) === truoc ? cur + 1 : 1; dai = Math.max(dai, cur); truoc = x; }
  return {
    homNay, chuoi, kyLuc: dai, tongNgay: co.size, daHocHomNay: co.has(homNay),
    ngay: Array.from({ length: 14 }, (_, i) => { const x = luiNgay(homNay, 13 - i); return { day: x, viec: co.get(x) ?? 0 }; }),
  };
}

export async function xoaTienDo(userId: number, stage: string, kind: string, muc: string) {
  const s = laMaSach(stage) ? stage : chuanChang(stage);
  const { count } = await prisma.ieltsProgress.deleteMany({
    where: { userId, stage: s, kind, muc },
  });
  return { xoa: count };
}
