/**
 * ============================================================
 * Maker Lab — kho kiến thức của robot (phần "R" trong RAG)
 * ============================================================
 *
 * Ba nguồn kiến thức, ba việc khác nhau, ĐỪNG gộp:
 *
 *   sampleDialogues   dạy CÁCH NÓI      — nhịp câu, kiểu đùa       (persona.ts)
 *   traits.knowledge  dạy BẠN LÀ AI     — 16 câu hỏi huấn luyện    (training.ts)
 *   kho này           dạy DỮ KIỆN RỜI   — tài liệu, ghi chú, số liệu
 *
 * Hai cái trên đi thẳng vào prompt MỌI lượt nói, nên chúng phải nhỏ. Kho này
 * thì ngược lại: chứa được bao nhiêu tuỳ thích, và mỗi lượt chỉ rút ra vài
 * mẩu liên quan. Đó là toàn bộ lý do nó tồn tại — nhét cả kho vào prompt thì
 * mỗi câu robot nói sẽ tốn hàng chục nghìn token và chậm đi thấy rõ.
 *
 * ── Vì sao tìm theo TỪ chứ không theo NGHĨA ──
 *
 * pgvector KHÔNG được cài. Đo 13/08/2026: `pg_extension` không có 'vector',
 * và `document_chunks.embedding` là `jsonb` chứ không phải `vector(768)` như
 * comment trong schema gợi ý. Ảnh Postgres của prod cũng không có.
 *
 * Tìm theo từ yếu hơn thật: hỏi "tôi hay ăn gì" sẽ KHÔNG khớp mẩu viết "món
 * khoái khẩu của Cường là bún bò". Nhưng nó chạy được hôm nay, không cần
 * khoá nhúng, không cần đổi ảnh Postgres, và không tốn một đồng nào. Khi nào
 * pgvector lên thì thêm nhánh `semantic` ở đây, chỗ gọi không phải đổi gì.
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** Mọi mẩu kiến thức của robot nằm dưới nhãn này trong `document_chunks`. */
const LOAI = 'maker_kb';

export interface MauKienThuc {
  id: number;
  noiDung: string;
  nguon: string | null;
  diem: number;
}

/**
 * Nạp một mẩu kiến thức vào kho.
 *
 * Cắt theo ĐOẠN VĂN chứ không theo số ký tự cố định: cắt giữa câu thì cả hai
 * nửa đều mất nghĩa, và mẩu vô nghĩa vẫn khớp từ khoá như thường — tức là nó
 * vẫn chen vào prompt, chỉ để làm nhiễu.
 */
export async function napKienThuc(
  projectId: number,
  vanBan: string,
  nguon?: string,
): Promise<number> {
  const doan = vanBan
    .split(/\n\s*\n+/)
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter((s) => s.length >= 20); // mẩu quá ngắn chỉ tổ làm nhiễu xếp hạng

  if (!doan.length) return 0;

  await prisma.documentChunk.createMany({
    data: doan.map((noiDung, i) => ({
      content: noiDung,
      documentType: LOAI,
      documentId: String(projectId),
      chunkIndex: i,
      metadata: nguon ? { nguon } : {},
    })),
  });
  logger.info('MakerLab nap kien thuc', { projectId, soMau: doan.length, nguon });
  return doan.length;
}

/** Xoá sạch kho của một dự án — nút "nạp lại từ đầu". */
export async function xoaKienThuc(projectId: number): Promise<number> {
  const r = await prisma.documentChunk.deleteMany({
    where: { documentType: LOAI, documentId: String(projectId) },
  });
  return r.count;
}

export async function demKienThuc(projectId: number): Promise<number> {
  return prisma.documentChunk.count({
    where: { documentType: LOAI, documentId: String(projectId) },
  });
}

/**
 * Rút vài mẩu liên quan nhất tới câu vừa nghe.
 *
 * ⚠️ Nối các từ bằng `|` (HOẶC) chứ không phải `&` (VÀ).
 *    `plainto_tsquery` mặc định nối bằng VÀ, nghĩa là mẩu phải chứa ĐỦ mọi
 *    chữ trong câu hỏi mới khớp. Câu nói thường ngày có 8-12 chữ, nên VÀ gần
 *    như luôn trả về rỗng — và rỗng thì trông y hệt "kho không có gì".
 *    HOẶC + `ts_rank` cho ta thứ đúng hơn: mẩu nào trúng nhiều từ thì lên đầu.
 *
 * Không bao giờ ném lỗi: kho hỏng thì robot trả lời bằng kiến thức sẵn có,
 * chứ không được đứng hình giữa câu.
 */
export async function timKienThuc(
  projectId: number,
  cauHoi: string,
  k = 3,
): Promise<MauKienThuc[]> {
  // Bỏ chữ quá ngắn: "là", "gì", "cho" trúng khắp nơi nên chỉ làm loãng xếp hạng.
  const tu = (cauHoi || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 12);
  if (!tu.length) return [];

  const truyVan = tu.join(' | ');

  try {
    const rows = await prisma.$queryRaw<Array<{ id: number; content: string; metadata: unknown; diem: number }>>`
      SELECT c.id,
             c.content,
             c.metadata,
             ts_rank(to_tsvector('simple', c.content), to_tsquery('simple', ${truyVan})) AS diem
      FROM document_chunks c
      WHERE c.document_type = ${LOAI}
        AND c.document_id = ${String(projectId)}
        AND to_tsvector('simple', c.content) @@ to_tsquery('simple', ${truyVan})
      ORDER BY diem DESC
      LIMIT ${k}
    `;
    return rows.map((r) => ({
      id: r.id,
      noiDung: r.content,
      nguon: (r.metadata as { nguon?: string } | null)?.nguon ?? null,
      diem: Number(r.diem),
    }));
  } catch (err) {
    logger.warn('MakerLab tim kien thuc hong', { projectId, err: String(err).slice(0, 200) });
    return [];
  }
}

/**
 * Gói mấy mẩu tìm được thành đoạn nhét vào đề bài.
 *
 * Luật chống bịa viết y như bên `web.ts` và vì cùng một lý do: model 9B đọc
 * một danh sách dữ kiện rồi rất hay "suy ra" thêm thứ không có trong đó. Ở
 * đây còn nguy hơn, vì đây là dữ kiện về CHÍNH NGƯỜI ĐANG NGHE — nói sai một
 * chi tiết về họ thì nghe ra ngay.
 */
export function dungDoanKienThuc(mau: MauKienThuc[]): string {
  if (!mau.length) return '';
  return [
    'KIẾN THỨC TRA ĐƯỢC TRONG SỔ CỦA BẠN (do chính Cường nạp vào):',
    ...mau.map((m, i) => `${i + 1}. ${m.noiDung}${m.nguon ? ` [nguồn: ${m.nguon}]` : ''}`),
    '',
    'Dùng mấy dòng trên nếu chúng dính tới câu hỏi, nói lại bằng giọng của mày',
    'chứ đừng đọc thuộc lòng. Chỉ nói lại thứ CÓ CHỮ ở trên — không suy ra,',
    'không thêm chi tiết. Không dính gì tới câu hỏi thì lờ đi, đừng nhắc tới.',
  ].join('\n');
}
