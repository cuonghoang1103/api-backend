/**
 * TOOL VÒNG 2 — máy chủ tự chạy, app không cần biết gì.
 *
 * Đây là chỗ "nối AI với Notes" thật sự xảy ra. Nó gọi thẳng tầng service của
 * Notes chứ KHÔNG gọi HTTP ngược vào chính mình: đi vòng qua HTTP nghĩa là tự
 * ký một token, tự vượt middleware của mình, và thêm một đường mạng có thể
 * hỏng — trong khi `notes.service.ts` đã nhận `userId` làm tham số đầu và tự
 * giới hạn mọi truy vấn theo người dùng đó.
 *
 * ⚠️ MỌI hàm ở đây nhận `userId` từ TOKEN đã xác thực của lượt gọi, không bao
 * giờ từ tham số model sinh ra. Model chỉ được chọn "tìm gì", không được chọn
 * "tìm trong sổ của ai" — nếu id người dùng đi qua tay model thì một câu chữ
 * khéo trong file README có thể đọc ghi chú của người khác.
 *
 * Kết quả trả về là CHỮ THUẦN, không phải JSON đầy đủ. Model đọc chữ tốt hơn
 * đọc JSON lồng nhau, và mỗi dấu ngoặc thừa là token phải trả tiền.
 */
import { getNote, getTree, htmlToText, searchNotes } from '../notes.service.js';
import { docWeb } from './webTool.js';
import { timWeb } from './timWeb.js';
import { logger } from '../../utils/logger.js';

/** Trần cho từng loại kết quả — không cắt thì một sổ ghi chú lớn nuốt sạch ngữ cảnh. */
const MAX_SEARCH_HITS = 25;
const MAX_NOTE_CHARS = 12_000;
const MAX_TREE_NOTES = 300;

export interface ServerToolResult {
  /** Chữ đưa vào hội thoại cho model đọc. */
  content: string;
  /** Một dòng cho giao diện hiện tiến trình ("3 ghi chú"). Không đưa cho model. */
  summary: string;
}

/**
 * Chạy một tool vòng 2.
 *
 * KHÔNG ném lỗi: lỗi được biến thành chữ và đưa ngược cho model. Đó là cách
 * agent tự sửa sai — model đọc "không có ghi chú id 99" rồi tìm lại, thay vì
 * cả lượt đổ vỡ và người dùng nhận màn hình trắng. Chỉ những gì phá cả lượt
 * (hết token, hết tiền) mới được phép ném.
 */
export async function runServerTool(
  name: string,
  args: Record<string, unknown>,
  userId: number,
): Promise<ServerToolResult> {
  try {
    switch (name) {
      case 'notes_search':
        return await toolNotesSearch(args, userId);
      case 'notes_read':
        return await toolNotesRead(args, userId);
      case 'notes_tree':
        return await toolNotesTree(userId);
      case 'doc_web':
        return await docWeb(args);
      case 'tim_web':
        return await timWeb(args);
      default:
        return { content: `LỖI: không có tool tên "${name}".`, summary: 'tool lạ' };
    }
  } catch (err) {
    const message = (err as Error).message || 'lỗi không rõ';
    logger.warn('agent: tool máy chủ hỏng', { name, message });
    // Chữ này đi vào hội thoại cho model đọc, nên nó phải nói được model nên
    // làm gì tiếp, chứ không chỉ than là có lỗi.
    return { content: `LỖI khi chạy ${name}: ${message}. Đừng thử lại y hệt — đổi cách tìm hoặc hỏi người dùng.`, summary: 'lỗi' };
  }
}

async function toolNotesSearch(args: Record<string, unknown>, userId: number): Promise<ServerToolResult> {
  const query = typeof args.query === 'string' ? args.query.trim() : '';
  const tag = typeof args.tag === 'string' && args.tag.trim() ? args.tag.trim() : undefined;
  if (!query && !tag) {
    return { content: 'LỖI: cần "query" hoặc "tag". Muốn xem toàn bộ sổ thì gọi notes_tree.', summary: 'thiếu từ khoá' };
  }

  const hits = await searchNotes(userId, { q: query, tag });
  if (hits.length === 0) {
    return {
      content: `Không có ghi chú nào khớp "${query}"${tag ? ` (thẻ: ${tag})` : ''}.`,
      summary: 'không có kết quả',
    };
  }

  const shown = hits.slice(0, MAX_SEARCH_HITS);
  const lines = shown.map((h) => {
    const tags = h.tags?.length ? ` [${h.tags.join(', ')}]` : '';
    return `- id=${h.id} · ${h.title || '(không tiêu đề)'}${tags}\n  ${h.snippet}`;
  });
  const duoi = hits.length > shown.length ? `\n(còn ${hits.length - shown.length} kết quả nữa, hãy tìm hẹp hơn)` : '';
  return {
    content: `${hits.length} ghi chú khớp:\n${lines.join('\n')}${duoi}\n\nGọi notes_read với id để đọc toàn văn.`,
    summary: `${hits.length} ghi chú`,
  };
}

async function toolNotesRead(args: Record<string, unknown>, userId: number): Promise<ServerToolResult> {
  const id = Number(args.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { content: 'LỖI: "id" phải là số nguyên dương. Lấy id từ notes_search hoặc notes_tree.', summary: 'id sai' };
  }

  // getNote ném 404 khi ghi chú không thuộc về người dùng này — bắt ở
  // runServerTool và biến thành chữ, model sẽ tự đi tìm lại.
  const note = await getNote(userId, id);
  const text = htmlToText(note.contentHtml);
  const cat = text.length > MAX_NOTE_CHARS;
  const body = cat ? `${text.slice(0, MAX_NOTE_CHARS)}\n\n[… bị cắt, ghi chú dài ${text.length} ký tự]` : text;

  const dau: string[] = [`# ${note.title || '(không tiêu đề)'}`, `id=${note.id}`];
  if (note.tags?.length) dau.push(`thẻ: ${note.tags.join(', ')}`);
  if (note.links?.length) {
    dau.push(`liên kết: ${note.links.slice(0, 10).map((l) => l.label || l.url).join(' · ')}`);
  }
  dau.push(`sửa lần cuối: ${note.updatedAt.toISOString().slice(0, 10)}`);

  return {
    content: `${dau.join('\n')}\n\n${body || '(ghi chú trống)'}`,
    summary: `${note.title || 'ghi chú'}${cat ? ' (cắt bớt)' : ''}`,
  };
}

async function toolNotesTree(userId: number): Promise<ServerToolResult> {
  const subjects = await getTree(userId);
  if (subjects.length === 0) {
    return { content: 'Người dùng chưa có sổ ghi chú nào.', summary: 'sổ trống' };
  }

  const dong: string[] = [];
  let soGhiChu = 0;
  let batDauCat = false;
  /** Trả về false khi đã chạm trần — chỗ gọi dừng vòng lặp của nó. */
  const themGhiChu = (n: { id: number; title: string | null }, thut: string): boolean => {
    if (soGhiChu >= MAX_TREE_NOTES) { batDauCat = true; return false; }
    dong.push(`${thut}- id=${n.id} · ${n.title || '(không tiêu đề)'}`);
    soGhiChu++;
    return true;
  };

  for (const s of subjects) {
    dong.push(`## ${s.emoji ? s.emoji + ' ' : ''}${s.name}`);
    // Ghi chú nằm thẳng dưới sổ, không thuộc chương nào. Bỏ sót nhóm này thì
    // agent kết luận "sổ rỗng" trong khi người dùng đang nhìn thấy bài viết
    // của mình ở đó.
    for (const n of s.notes ?? []) {
      if (!themGhiChu(n, '  ')) break;
    }
    if (batDauCat) break;
    for (const c of s.chapters ?? []) {
      dong.push(`  ### ${c.title}`);
      for (const n of c.notes ?? []) {
        if (!themGhiChu(n, '    ')) break;
      }
      if (batDauCat) break;
    }
    if (batDauCat) break;
  }
  if (batDauCat) dong.push(`\n[… bị cắt ở ${MAX_TREE_NOTES} ghi chú — dùng notes_search để tìm cho nhanh]`);

  return {
    content: `Cây ghi chú của người dùng (${subjects.length} sổ, ${soGhiChu} ghi chú hiện ra):\n${dong.join('\n')}`,
    summary: `${subjects.length} sổ · ${soGhiChu} ghi chú`,
  };
}
