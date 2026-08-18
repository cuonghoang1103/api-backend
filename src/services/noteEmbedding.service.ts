/**
 * Nhúng vector cho ghi chú — bộ tìm THEO NGHĨA của Trợ lý.
 *
 * Máy nhúng: bge-m3 chạy trên máy nhà, với tới qua đường hầm
 * `172.18.0.1:18101`. Đo thật 19/08/2026 với câu tiếng Việt:
 *
 *   "làm sao chạy migration cho CSDL Prisma"  so với
 *     0,750  "prisma migrate deploy chạy trên production"
 *     0,554  "cách cập nhật lược đồ CSDL bằng công cụ ORM"  ← KHÔNG trùng từ nào
 *     0,322  "công thức nấu phở bò Hà Nội"
 *
 * Dòng 0,554 chính là thứ tìm-theo-từ-khoá không bao giờ làm được: không có
 * một từ chung nào giữa câu hỏi và câu trả lời, mà vẫn xếp trên hẳn thứ không
 * liên quan.
 *
 * ⚠️ MÁY NHÀ CÓ THỂ TẮT. Mọi hàm ở đây phải trả về "không có" thay vì ném, để
 * Trợ lý lùi về tìm theo từ khoá — mất độ tinh, không mất tính năng.
 */
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const NHUNG_URL = (process.env.NHUNG_URL || 'http://172.18.0.1:18101').replace(/\/+$/, '');
const NHUNG_KEY = process.env.LLM_LOCAL_API_KEY || '';
const SO_CHIEU = 1024;

/** Mỗi mẩu ~1200 ký tự, chồng lấn 200. */
const CO_MAU = 1200;
const CHONG_LAN = 200;
/** Trần số mẩu của một ghi chú — bài rất dài không được ngốn cả hàng đợi. */
const TRAN_MAU = 40;

export function boThe(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cắt thành mẩu CÓ CHỒNG LẤN.
 *
 * Chồng lấn 200 ký tự vì một ý thường nằm vắt qua chỗ cắt: cắt khan thì câu
 * "Prisma migrate dev hỏng vì shadow database" có thể bị xẻ đôi, và không mẩu
 * nào còn mang trọn ý đó nữa.
 */
export function catMau(chu: string): string[] {
  if (chu.length <= CO_MAU) return chu ? [chu] : [];
  const ra: string[] = [];
  let i = 0;
  while (i < chu.length && ra.length < TRAN_MAU) {
    ra.push(chu.slice(i, i + CO_MAU));
    i += CO_MAU - CHONG_LAN;
  }
  return ra;
}

/** Gọi máy nhúng. Trả `null` khi không với tới được — KHÔNG ném. */
export async function nhungNhieu(doan: string[]): Promise<number[][] | null> {
  if (doan.length === 0) return [];
  try {
    const res = await fetch(`${NHUNG_URL}/v1/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(NHUNG_KEY ? { Authorization: `Bearer ${NHUNG_KEY}` } : {}),
      },
      body: JSON.stringify({ input: doan }),
      signal: AbortSignal.timeout(Number(process.env.NHUNG_TIMEOUT_MS) || 60_000),
    });
    if (!res.ok) {
      logger.warn(`[nhung] máy nhúng trả ${res.status}`);
      return null;
    }
    const than = await res.json() as { data?: Array<{ embedding?: number[]; index?: number }> };
    const ds = than.data ?? [];
    if (ds.length !== doan.length) {
      logger.warn(`[nhung] số vector (${ds.length}) khác số đoạn (${doan.length})`);
      return null;
    }
    /* Sắp lại theo `index`. Máy chủ ĐƯỢC PHÉP trả không đúng thứ tự, và nếu
     * lệch thì mỗi mẩu chữ sẽ gắn vector của mẩu khác — hỏng câm, tìm ra kết
     * quả vô nghĩa mà không có lỗi nào. */
    const sap = [...ds].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const vec = sap.map((d) => d.embedding ?? []);
    if (vec.some((v) => v.length !== SO_CHIEU)) {
      logger.warn(`[nhung] số chiều lạ: ${vec.map((v) => v.length).join(',')}`);
      return null;
    }
    return vec;
  } catch (e) {
    logger.info(`[nhung] không với tới máy nhúng: ${(e as Error).message}`);
    return null;
  }
}

/** `[1,2,3]` → `'[1,2,3]'` — pgvector nhận chuỗi dạng này. */
function raChuoiVector(v: number[]): string {
  return `[${v.join(',')}]`;
}

/**
 * Dựng lại toàn bộ vector của MỘT ghi chú.
 *
 * Xoá hết rồi ghi lại thay vì so từng mẩu: ghi chú sửa một chữ ở đầu là mọi
 * ranh giới mẩu phía sau dịch theo, nên "cập nhật thông minh" gần như luôn
 * phải ghi lại hết mà còn tốn công so sánh.
 */
export async function capNhatNhung(noteId: number): Promise<'xong' | 'bo-qua' | 'khong-co-may'> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { id: true, title: true, contentHtml: true, deletedAt: true },
  });
  if (!note || note.deletedAt) {
    await prisma.$executeRaw`DELETE FROM note_embeddings WHERE note_id = ${noteId}`;
    return 'bo-qua';
  }

  // Ghép tiêu đề vào TỪNG mẩu: mẩu giữa bài mất ngữ cảnh "bài này nói về gì",
  // và tiêu đề là câu tóm tắt rẻ nhất đang có sẵn.
  const than = boThe(note.contentHtml ?? '');
  const mau = catMau(than).map((m) => `${note.title ?? ''}\n${m}`.trim());
  if (mau.length === 0) {
    await prisma.$executeRaw`DELETE FROM note_embeddings WHERE note_id = ${noteId}`;
    return 'bo-qua';
  }

  const vec = await nhungNhieu(mau);
  if (!vec) return 'khong-co-may';

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`DELETE FROM note_embeddings WHERE note_id = ${noteId}`;
    for (let i = 0; i < mau.length; i++) {
      await tx.$executeRawUnsafe(
        `INSERT INTO note_embeddings (note_id, chunk_index, content, embedding)
         VALUES ($1, $2, $3, $4::vector)`,
        noteId, i, mau[i], raChuoiVector(vec[i]!),
      );
    }
  });
  return 'xong';
}

export interface MauTrung {
  noteId: number;
  title: string;
  content: string;
  diem: number;
}

/**
 * Tìm theo NGHĨA. Trả `null` khi máy nhúng không với tới được — người gọi lùi
 * về tìm theo từ khoá.
 */
export async function timTheoNghia(userId: number, cauHoi: string, soLuong = 6): Promise<MauTrung[] | null> {
  const vec = await nhungNhieu([cauHoi]);
  if (!vec || !vec[0]) return null;

  /* `<=>` là khoảng cách cosine của pgvector: 0 = trùng khớp, 2 = ngược hẳn.
   * Đổi thành điểm giống nhau cho dễ đọc ở tầng trên.
   * Lọc `deleted_at IS NULL` NGAY TRONG truy vấn chứ không lọc sau: lọc sau
   * thì một kho toàn ghi chú đã xoá sẽ trả về danh sách rỗng dù có kết quả. */
  const rows = await prisma.$queryRawUnsafe<Array<{
    note_id: number; title: string; content: string; khoang_cach: number;
  }>>(
    `SELECT e.note_id, n.title, e.content, (e.embedding <=> $1::vector) AS khoang_cach
       FROM note_embeddings e
       JOIN notes n ON n.id = e.note_id
      WHERE n.user_id = $2 AND n.deleted_at IS NULL
      ORDER BY e.embedding <=> $1::vector
      LIMIT $3`,
    raChuoiVector(vec[0]), userId, soLuong * 3,
  );

  // Một ghi chú có thể trúng nhiều mẩu — giữ mẩu GẦN NHẤT của mỗi ghi chú, để
  // sáu nguồn là sáu ghi chú khác nhau chứ không phải sáu mẩu của một bài.
  const tot = new Map<number, MauTrung>();
  for (const r of rows) {
    const diem = 1 - Number(r.khoang_cach);
    const cu = tot.get(r.note_id);
    if (!cu || diem > cu.diem) {
      tot.set(r.note_id, { noteId: r.note_id, title: r.title ?? '(không tên)', content: r.content, diem });
    }
  }
  return [...tot.values()].sort((a, b) => b.diem - a.diem).slice(0, soLuong);
}

/** Số ghi chú đã có vector — để trang quản trị/nhật ký biết đã phủ tới đâu. */
export async function demDaNhung(userId: number): Promise<{ daNhung: number; tong: number }> {
  const [tong, daNhung] = await Promise.all([
    prisma.note.count({ where: { userId, deletedAt: null } }),
    prisma.$queryRaw<Array<{ c: bigint }>>`
      SELECT COUNT(DISTINCT e.note_id) AS c
        FROM note_embeddings e JOIN notes n ON n.id = e.note_id
       WHERE n.user_id = ${userId} AND n.deleted_at IS NULL`
      .then((r) => Number(r[0]?.c ?? 0)),
  ]);
  return { daNhung, tong };
}
