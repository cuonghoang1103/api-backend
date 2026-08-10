/**
 * ============================================================
 * Maker Lab — huấn luyện robot bằng chính lời bạn
 * ============================================================
 *
 * Robot hỏi, bạn trả lời, và câu trả lời của bạn vào thẳng prompt.
 * Càng trả lời nhiều, nó càng biết bạn là ai và càng nói giống bạn.
 *
 * Vì sao tách khỏi mẫu đối thoại:
 *
 *   sampleDialogues  dạy CÁCH NÓI — nhịp câu, kiểu đùa, độ dài
 *   knowledge        dạy NỘI DUNG — bạn là ai, thích gì, ghét gì
 *
 * Gộp một chỗ thì model chép nguyên câu trả lời của bạn ra khi gặp
 * câu hỏi na ná, thay vì hiểu rồi tự nói bằng giọng của nó. Tách ra
 * thì nó dùng nội dung như dữ kiện và vẫn giữ được giọng.
 *
 * Ngân hàng câu hỏi dưới đây cố tình HỎI CỤ THỂ. "Bạn thích gì?" nhận
 * lại một câu vô nghĩa; "Món ăn nào bạn ăn hoài không chán?" nhận lại
 * một câu có chi tiết — và chi tiết mới là thứ robot chém gió được.
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export interface TrainingQuestion {
  id: string;
  group: string;
  q: string;
  /** Gợi ý cách trả lời — quyết định chất lượng đầu vào hơn cả câu hỏi. */
  hint: string;
}

export const QUESTION_BANK: TrainingQuestion[] = [
  // ── Con người bạn ──
  { id: 'name', group: 'Về bạn', q: 'Bạn tên gì, bao nhiêu tuổi, đang làm gì?',
    hint: 'Nói như đang tự giới thiệu với người mới quen, đừng viết như CV.' },
  { id: 'work', group: 'Về bạn', q: 'Một ngày bình thường của bạn trôi qua thế nào?',
    hint: 'Kể thật, kể cả những chỗ nhàm chán — chi tiết vụn mới là thứ nghe ra người thật.' },
  { id: 'proud', group: 'Về bạn', q: 'Thứ bạn tự hào nhất từng làm ra là gì?',
    hint: 'Kể luôn cả chỗ suýt bỏ cuộc.' },
  { id: 'fail', group: 'Về bạn', q: 'Lần hỏng việc nhớ đời nhất của bạn?',
    hint: 'Robot sẽ đem chuyện này ra trêu bạn. Chọn chuyện bạn chịu được.' },

  // ── Cách bạn nói ──
  { id: 'catch', group: 'Cách bạn nói', q: 'Câu cửa miệng của bạn là gì?',
    hint: 'Những câu bạn nói đi nói lại tới mức bạn bè nhại được.' },
  { id: 'angry', group: 'Cách bạn nói', q: 'Bạn nói gì khi bực mình?',
    hint: 'Viết đúng chữ bạn hay dùng, kể cả nói trống không.' },
  { id: 'tease', group: 'Cách bạn nói', q: 'Bạn cà khịa bạn bè kiểu gì? Cho một câu thật.',
    hint: 'Đây là mẫu quan trọng nhất cho phần "hỗn" của robot.' },
  { id: 'happy', group: 'Cách bạn nói', q: 'Vui thì bạn nói thế nào?',
    hint: 'Một câu thật, không phải mô tả.' },

  // ── Sở thích, quan điểm ──
  { id: 'food', group: 'Sở thích', q: 'Món nào bạn ăn hoài không chán? Món nào bạn không đụng?',
    hint: 'Càng cụ thể càng tốt — tên món, quán nào, ăn lúc nào.' },
  { id: 'music', group: 'Sở thích', q: 'Bạn nghe nhạc gì? Có bài nào nghe mãi không?',
    hint: 'Robot bật nhạc được, nên cái này nó dùng thật.' },
  { id: 'tech', group: 'Sở thích', q: 'Công nghệ nào bạn mê, công nghệ nào bạn thấy chán?',
    hint: 'Có ý kiến rõ ràng thì robot mới cãi lại được cho vui.' },
  { id: 'hate', group: 'Sở thích', q: 'Ba thứ làm bạn khó chịu nhất?',
    hint: 'Robot sẽ đồng cảm hoặc chọc bạn về mấy thứ này.' },

  // ── Quan hệ, bối cảnh ──
  { id: 'people', group: 'Xung quanh', q: 'Ai hay ở cạnh bạn? Bạn gọi họ thế nào?',
    hint: 'Để robot biết ai là ai khi bạn nhắc tên.' },
  { id: 'place', group: 'Xung quanh', q: 'Bạn đang sống ở đâu, phòng làm việc trông thế nào?',
    hint: 'Robot đứng trong phòng đó, nên biết chỗ mình đứng thì nói chuyện tự nhiên hơn.' },
  { id: 'robot', group: 'Xung quanh', q: 'Bạn muốn robot này gọi bạn là gì, và xưng hô ra sao?',
    hint: 'Ví dụ: gọi "Cường", xưng "tôi", nói trống không.' },
  { id: 'limit', group: 'Xung quanh', q: 'Có chuyện gì bạn KHÔNG muốn robot đem ra đùa?',
    hint: 'Hỗn thì hỗn, nhưng phải có chỗ dừng. Ghi rõ ở đây.' },
];

export interface KnowledgeEntry {
  q: string;
  a: string;
}

async function readTraits(projectId: number): Promise<Record<string, unknown>> {
  const row = await prisma.makerPersona.findUnique({
    where: { projectId },
    select: { traits: true },
  });
  return ((row?.traits as Record<string, unknown> | null) ?? {}) as Record<string, unknown>;
}

export async function getKnowledge(projectId: number): Promise<KnowledgeEntry[]> {
  const traits = await readTraits(projectId);
  const raw = traits.knowledge;
  return Array.isArray(raw) ? (raw as KnowledgeEntry[]) : [];
}

/**
 * Lưu một câu trả lời. Trả lời lại cùng một câu hỏi thì GHI ĐÈ, không
 * cộng thêm — người ta sửa câu trả lời là muốn thay, không phải muốn
 * robot nhớ cả hai bản rồi tự chọn.
 */
export async function saveAnswer(
  projectId: number,
  question: string,
  answer: string,
): Promise<KnowledgeEntry[]> {
  const q = question.trim().slice(0, 200);
  const a = answer.trim().slice(0, 600);
  if (!q) throw new Error('Thiếu câu hỏi');

  const traits = await readTraits(projectId);
  const list = (Array.isArray(traits.knowledge) ? traits.knowledge : []) as KnowledgeEntry[];
  const idx = list.findIndex((k) => k.q === q);

  if (!a) {
    // Trả lời rỗng = xoá mục đó.
    if (idx >= 0) list.splice(idx, 1);
  } else if (idx >= 0) {
    list[idx] = { q, a };
  } else {
    list.push({ q, a });
  }

  const trimmed = list.slice(0, 40);
  await prisma.makerPersona.update({
    where: { projectId },
    data: { traits: { ...traits, knowledge: trimmed } as object },
  });
  logger.info('MakerLab học thêm về chủ', { projectId, q: q.slice(0, 60), tong: trimmed.length });
  return trimmed;
}

/** Đếm xem đã dạy được bao nhiêu phần của ngân hàng câu hỏi. */
export async function progress(projectId: number): Promise<{ answered: number; total: number }> {
  const known = await getKnowledge(projectId);
  const answered = QUESTION_BANK.filter((b) => known.some((k) => k.q === b.q)).length;
  return { answered, total: QUESTION_BANK.length };
}
