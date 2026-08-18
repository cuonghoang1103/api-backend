/**
 * ============================================================
 * BÓC MARKDOWN TRƯỚC KHI ĐƯA CHO MÁY ĐỌC
 * ============================================================
 *
 * Prompt đã dặn model "không markdown" khi câu trả lời sắp được đọc thành
 * tiếng. Đo thật 18/08/2026: nó nghe lời phần lớn thời gian, nhưng KHÔNG phải
 * lúc nào cũng — cùng một câu hỏi, bậc tiếng Anh trả về chữ sạch còn bậc tiếng
 * Việt vẫn chèn `- **Lập trình & phát triển**`.
 *
 * Dặn model là XIN, không phải BẢO ĐẢM. Và cái giá của một lần nó quên là máy
 * đọc phát ra "sao sao Lập trình và phát triển sao sao" — nghe như hỏng máy.
 * Nên chỗ này lọc bằng mã: xin ở prompt để câu văn tự nhiên hơn, lọc ở đây để
 * chắc chắn.
 *
 * ⚠️ CHỈ dùng cho đường ĐỌC. Chữ hiện trong bong bóng vẫn giữ nguyên markdown —
 * người đọc bằng mắt thì gạch đầu dòng là có ích.
 */

/** Chuyển một câu trả lời có markdown thành chữ đọc lên nghe được. */
export function chuChoMayDoc(raw: string): string {
  let t = raw;

  // Khối mã: đọc lên thì vô nghĩa. Nói một câu thay cho cả khối.
  t = t.replace(/```[\s\S]*?```/g, ' (phần mã, bạn xem trong khung chat nhé) ');
  t = t.replace(/`([^`]+)`/g, '$1');

  // [nhãn](đường-dẫn) → nhãn. Đọc đường dẫn lên là tra tấn.
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // Ảnh thì bỏ hẳn.
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');

  t = t.replace(/^\s{0,3}#{1,6}\s+/gm, '');        // tiêu đề
  t = t.replace(/^\s{0,3}>\s?/gm, '');             // trích dẫn
  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '');         // gạch đầu dòng
  t = t.replace(/^\s{0,3}\d+[.)]\s+/gm, '');       // danh sách đánh số
  t = t.replace(/^\s{0,3}([-*_]\s*){3,}\s*$/gm, ''); // đường kẻ ngang

  // Đậm/nghiêng/gạch. Làm SAU danh sách: `* nghiêng *` và `* gạch đầu dòng`
  // dùng chung ký tự, bóc nhầm thứ tự là nuốt mất chữ.
  t = t.replace(/(\*\*\*|___)(.+?)\1/g, '$2');
  t = t.replace(/(\*\*|__)(.+?)\1/g, '$2');
  t = t.replace(/(\*|_)(?=\S)(.+?)(?<=\S)\1/g, '$2');
  t = t.replace(/~~(.+?)~~/g, '$1');

  // Bảng: giữ chữ trong ô, bỏ khung. Bỏ HÀNG KẺ trước, rồi bỏ hai thanh dọc ở
  // MÉP mỗi dòng — không bỏ mép thì mỗi hàng đẻ ra một ô rỗng và máy đọc ngắt
  // một nhịp thừa ở đầu và cuối mỗi hàng.
  t = t.replace(/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$\n?/gm, '');
  t = t.replace(/^[ \t]*\|/gm, '').replace(/\|[ \t]*$/gm, '');
  t = t.replace(/\s*\|\s*/g, ', ');

  // Dọn khoảng trắng. Đọc lên thì dòng trống không có nghĩa gì.
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/\s*\n\s*/g, ' ');
  return t.replace(/\s{2,}/g, ' ').replace(/^[\s,]+|[\s,]+$/g, '').trim();
}
