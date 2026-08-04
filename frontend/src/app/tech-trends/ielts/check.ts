/**
 * So khớp câu trả lời người học gõ với đáp án.
 *
 * Chấm chặt như đề thật thì phản tác dụng khi tự học: gõ "Tran " thừa dấu cách
 * hay "the library" thay vì "library" mà báo sai thì người học mất niềm tin vào
 * bộ chấm chứ không sửa được gì. Nên chuẩn hoá trước khi so:
 *   - bỏ khoảng trắng thừa, đưa về chữ thường
 *   - bỏ dấu câu ở hai đầu
 *   - bỏ mạo từ đứng đầu (a/an/the)
 *
 * Nhưng KHÔNG tự động chấp nhận từ đồng nghĩa: dạng Completion của đề thật bắt
 * buộc chép nguyên văn, nên chấp nhận đồng nghĩa ở đây là dạy sai. Muốn nhận
 * thêm cách viết nào thì khai báo tường minh ở trường `alt`.
 */

function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:£$€"'()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(a|an|the)\s+/, '');
}

/** true nếu câu trả lời khớp đáp án chính hoặc một trong các biến thể `alt`. */
export function isCorrect(input: string, answer: string, alt?: string[]): boolean {
  const got = normalise(input);
  if (!got) return false;
  return [answer, ...(alt ?? [])].some((a) => normalise(a) === got);
}
