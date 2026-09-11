/**
 * Ngữ cảnh gửi cho gia sư AI của Academy — phần THUẦN (không DB, không mạng)
 * để kiểm được bằng test. `courseTutor.service.ts` gọi vào đây.
 *
 * Sinh ra 11/09/2026 khi rà gia sư trên SWT301 vừa dựng lại từng slide, và
 * thấy ba chỗ gia sư MÙ mà vẫn trả lời tự tin:
 *
 * 1. Nội dung bài bị cắt ở 8.000 ký tự, tính trên văn bản CÓ CẢ HAI thứ tiếng
 *    (bài song ngữ lặp mỗi ý hai lần). 69/95 bài SWT301 dài hơn thế — bài
 *    "Test plan & risk" 34 slide thì gia sư chỉ thấy khoảng 3 slide đầu. Hỏi
 *    "slide 30 nói gì" là nó đoán. Nay: bỏ khối của thứ tiếng KHÔNG dùng, rồi
 *    mới cắt ở 32.000 ký tự. Đo 500 bài Academy: một thứ tiếng dài nhất
 *    29.659 ký tự ⇒ trần này đọc TRỌN mọi bài hiện có.
 * 2. Bài QUIZ không có chữ nào (`content` rỗng, đề nằm trong `quizData`), nên
 *    gia sư dưới bài quiz nhận "(bài này chủ yếu là video)" và không biết đề.
 *    Nay: dựng khối đề từ `quizData` ngay ở máy chủ.
 * 3. Câu trả lời của chip gợi ý được cache theo (bài, chip, tiếng) — KHÔNG có
 *    gì về nội dung. Dựng lại bài giữ nguyên id (để giữ tiến độ học viên) thì
 *    cache vẫn trả lời theo bài CŨ, mãi mãi. Nay: khoá cache mang vân tay nội dung.
 */
import { createHash } from 'node:crypto';

/** Trần ký tự nội dung bài (MỘT thứ tiếng) — xem mục 1 ở đầu file. */
export const TRAN_NOI_DUNG = 32_000;
/** Trần số câu quiz đưa vào ngữ cảnh. Quiz SWT301 dài nhất 50 câu. */
export const TRAN_SO_CAU_QUIZ = 60;

/** Bóc HTML về text thuần cho ngữ cảnh (không cần đẹp, chỉ cần đọc được). */
export function plain(html: string | null | undefined, cap = 8000): string {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|pre|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, cap);
}

/**
 * Bỏ các khối `<div class="ml-en">` (khi trả lời tiếng Việt) hoặc `ml-vi`
 * (khi trả lời tiếng Anh). Đếm cặp `<div>` lồng nhau — một khối giải thích
 * thường chứa `<div class="pitfall">` bên trong, cắt bằng regex không tham
 * lam sẽ dừng ở `</div>` của khối con và để lọt nửa sau.
 *
 * Bài chỉ có MỘT thứ tiếng thì giữ nguyên: bỏ đi là gia sư mất trắng bài.
 */
export function boNgonNguKhac(html: string, english: boolean): string {
  const bo = english ? 'vi' : 'en';
  const giu = english ? 'en' : 'vi';
  const coLop = (l: string) => new RegExp(`class\\s*=\\s*["'][^"']*\\bml-${l}\\b`, 'i').test(html);
  if (!coLop(bo) || !coLop(giu)) return html;

  const mo = new RegExp(`<div\\b[^>]*\\bclass\\s*=\\s*["'][^"']*\\bml-${bo}\\b[^"']*["'][^>]*>`, 'gi');
  let ra = '';
  let tu = 0;
  let m: RegExpExecArray | null;
  while ((m = mo.exec(html))) {
    ra += html.slice(tu, m.index);
    const the = /<\/?div\b[^>]*>/gi;
    the.lastIndex = mo.lastIndex;
    let sau = 1;
    let t: RegExpExecArray | null = null;
    while (sau > 0 && (t = the.exec(html))) sau += t[0][1] === '/' ? -1 : 1;
    tu = sau === 0 && t ? the.lastIndex : html.length;
    mo.lastIndex = tu;
  }
  return ra + html.slice(tu);
}

/** Văn bản bài học cho ngữ cảnh: đúng một thứ tiếng, có đánh dấu khi bị cắt. */
export function vanBanBai(html: string | null | undefined, english: boolean, cap = TRAN_NOI_DUNG): string {
  const du = plain(boNgonNguKhac(String(html || ''), english), Number.MAX_SAFE_INTEGER);
  if (du.length <= cap) return du;
  return du.slice(0, cap) + (english
    ? '\n\n[… the rest of this lesson was cut for length]'
    : '\n\n[… phần sau của bài bị cắt vì quá dài]');
}

/** Chuỗi song ngữ "EN|||VI" → đúng một thứ tiếng (thiếu bản Việt thì lấy bản Anh). */
export function chonNgu(s: unknown, english: boolean): string {
  const raw = String(s ?? '');
  if (!raw.includes('|||')) return raw.trim();
  const [en, vi] = raw.split('|||');
  return (english ? en : (vi?.trim() || en)).trim();
}

export interface CauQuizNguCanh {
  n: number;
  prompt: string;
  options: string[];
  correctIndexes: number[];
  explanation?: string;
}

/** Đề trong `LessonDetail.quizData` (`{ questions: [...] }`) → khối câu cho gia sư. */
export function quizTuDuLieuBai(quizData: unknown, english: boolean, max = TRAN_SO_CAU_QUIZ): CauQuizNguCanh[] {
  const qs = (quizData as { questions?: unknown })?.questions;
  if (!Array.isArray(qs)) return [];
  return qs.slice(0, max).map((q: Record<string, unknown>, i) => ({
    n: i + 1,
    // Câu có đoạn code thì code là một nửa đề — thiếu nó gia sư giải sai.
    prompt: chonNgu(q.question ?? q.prompt, english) + (q.code ? `\n\`\`\`${String(q.codeLang || '')}\n${String(q.code)}\n\`\`\`` : ''),
    options: (Array.isArray(q.options) ? q.options : []).map((o) => chonNgu(o, english)),
    correctIndexes: Array.isArray(q.correctIndexes)
      ? (q.correctIndexes as number[])
      : typeof q.correctIndex === 'number' ? [q.correctIndex] : [],
    // Câu tự luận không có phương án; đáp án mẫu nằm ở sampleAnswer.
    explanation: [q.sampleAnswer ? chonNgu(q.sampleAnswer, english) : '', q.explanation ? chonNgu(q.explanation, english) : '']
      .filter(Boolean).join('\n') || undefined,
  }));
}

/** 8 ký tự hex đại diện cho nội dung — đổi bất cứ phần nào là đổi. */
export function vanTayBai(...phan: unknown[]): string {
  return createHash('sha1').update(JSON.stringify(phan)).digest('hex').slice(0, 8);
}

/** Khoá cache = chip + vân tay. Cột `cache_key` là VarChar(40): 30 + 1 + 8 = 39. */
export function khoaCacheCoVanTay(cacheKey: string, vanTay: string): string {
  return `${cacheKey.slice(0, 30)}~${vanTay}`;
}
