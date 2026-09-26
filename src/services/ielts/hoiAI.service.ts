/**
 * Hỏi AI về một mẩu chữ trong bài IELTS — từ, câu, hay cả đoạn.
 * ─────────────────────────────────────────────────────────────────────────
 * Người học tô một chỗ trong bài đọc rồi hỏi "nghĩa là gì", "đọc thế nào",
 * "ngữ pháp ở đây là gì". Không dùng `explainConcept` của My Language: hàm đó
 * đòi `itemId` của một mục CÓ TRONG DB, còn ở đây chữ là bất kỳ đoạn nào
 * người học bôi trúng.
 *
 * `boiCanh` (tiêu đề bài + đoạn chứa nó) là thứ làm nên khác biệt: hỏi
 * "nghĩa của 'address'" mà không có bối cảnh thì model trả về cả danh sách
 * nghĩa; có câu chứa nó thì nó nói đúng nghĩa đang dùng.
 */
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

/** Những câu hỏi app đưa sẵn thành nút — mỗi câu một lời dặn riêng cho model. */
const DAN_THEO_Y: Record<string, string> = {
  nghia: 'Nói NGHĨA của phần được chọn TRONG ĐÚNG câu này, không liệt kê mọi nghĩa của từ. Kèm từ loại. Tối đa 3 câu.',
  doc: 'Viết phiên âm IPA, rồi mô tả cách đọc bằng tiếng Việt (ví dụ: "ơ-ĐRES, nhấn vần hai"). Nói rõ trọng âm rơi vào đâu. Tối đa 3 câu.',
  nguphap: 'Chỉ ra cấu trúc ngữ pháp đang dùng ở đây, gọi tên nó, và nói khi nào dùng. Một ví dụ khác cùng cấu trúc. Tối đa 5 câu.',
  dich: 'Dịch sang tiếng Việt tự nhiên, không dịch từng từ. Chỉ trả về bản dịch, không giải thích.',
  day: 'Giảng phần này cho người Việt đang luyện IELTS: ý chính, từ đáng học, và một mẹo nhớ. Tối đa 6 câu.',
  dethi: 'Phần này hay ra ở dạng câu hỏi IELTS nào? Nói dạng đề và một mẹo làm đúng dạng đó. Tối đa 4 câu.',
  // Bốn nút của gia sư trên trang /language/en/ielts: người học hỏi về CẢ
  // TRANG (bối cảnh = chữ của bài), không phải một chữ vừa tô.
  giang: 'Giảng lại phần này cho người mới bắt đầu, như gia sư ngồi cạnh: đi từng bước, câu ngắn, có ví dụ đời thường, chỉ ra lỗi người Việt hay mắc. Tối đa 12 câu.',
  huongdan: 'Hướng dẫn cách HỌC phần này: làm gì trước, làm gì sau, mỗi bước bao lâu, và cách tự kiểm tra xem đã hiểu chưa. Danh sách đánh số, tối đa 7 bước.',
  vidu: 'Cho 5 ví dụ MỚI (không lặp lại ví dụ trong bối cảnh), đúng chủ điểm của phần này, mỗi ví dụ kèm bản dịch tiếng Việt.',
  kiemtra: 'Ra 3 câu hỏi ngắn để kiểm tra người học đã hiểu phần này chưa. Đưa câu hỏi trước; đáp án để riêng ở cuối dưới dòng "**Đáp án**".',
};

/** Các ý giảng cả trang cần câu trả lời dài hơn một ý hỏi về một chữ. */
const Y_DAI = new Set(['giang', 'huongdan', 'vidu', 'kiemtra']);

export const CAC_Y = Object.keys(DAN_THEO_Y);

export async function hoiVeChu(
  userId: number,
  b: { chu?: string; y?: string; cauHoi?: string; boiCanh?: string },
) {
  const chu = String(b.chu ?? '').trim().slice(0, 2000);
  if (chu.length < 1) throw new BadRequestError('Chưa chọn chữ nào để hỏi');

  const y = String(b.y ?? '').trim();
  const tuHoi = String(b.cauHoi ?? '').trim().slice(0, 500);
  const dan = DAN_THEO_Y[y];
  if (!dan && !tuHoi) throw new BadRequestError('Thiếu `y` hợp lệ hoặc `cauHoi`');

  if (!isAiAvailable()) {
    // Trả 200 kèm lý do chứ không ném: app có nút "hỏi AI" ở mọi chỗ tô, và
    // một bảng lỗi đỏ mỗi lần chạm là cách nhanh nhất để người dùng bỏ dùng
    // tính năng. Nó hiện một dòng xám "AI đang tắt" thì nhẹ hơn nhiều.
    return { traLoi: null, lyDo: 'ai_unavailable' as const };
  }

  const boiCanh = String(b.boiCanh ?? '').trim().slice(0, 4000);
  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: Y_DAI.has(y) || (!dan && tuHoi) ? 1100 : 500,
    system: 'Bạn là gia sư IELTS, trả lời bằng TIẾNG VIỆT, ngắn và thẳng.\n'
      + `${dan ?? 'Trả lời đúng câu người học hỏi, rõ ràng, tối đa 10 câu.'}\n`
      + 'Không mở bài, không chúc, không nhắc lại câu hỏi.\n'
      // Từ 19/09/2026 app DỰNG markdown thật (`NoiDungMarkdown`), nên ở đây
      // KHÔNG cấm nữa — chữ đậm ở từ khoá và danh sách gạch đầu dòng làm câu
      // trả lời dễ đọc hơn hẳn một khối chữ phẳng.
      + 'Được dùng **đậm** cho từ khoá và gạch đầu dòng. Không dùng bảng.\n'
      + 'Giữ nguyên từ tiếng Anh khi trích dẫn, đừng phiên âm kiểu Việt hoá.',
    messages: [{
      role: 'user',
      content: (boiCanh ? `Bối cảnh (bài đọc):\n${boiCanh}\n\n` : '')
        + `Phần mình chọn: "${chu}"`
        + (tuHoi ? `\n\nCâu hỏi: ${tuHoi}` : ''),
    }],
  });

  return { traLoi: kq?.text?.trim() || null };
}

/**
 * Chấm bài viết theo BỐN tiêu chí thật của IELTS Writing.
 *
 * Không dùng lại bộ chấm của My Language: cái đó chấm "bài viết tiếng nước
 * ngoài" chung chung, còn ở đây người học cần biết band của từng tiêu chí —
 * Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range &
 * Accuracy — vì mỗi tiêu chí sửa bằng một cách khác nhau.
 *
 * ⚠️ Band do MODEL ước lượng, không phải điểm thi. Câu cảnh báo đó đi kèm
 * mọi lời trả về, và app hiện nó — một con số 6.5 trông như thật sẽ được tin
 * như thật.
 */
export async function chamBaiViet(
  userId: number,
  b: { bai?: string; de?: string; task?: string },
) {
  const bai = String(b.bai ?? '').trim();
  if (bai.split(/\s+/).length < 20) {
    throw new BadRequestError('Bài quá ngắn để chấm — viết ít nhất 20 từ');
  }
  if (bai.length > 8000) throw new BadRequestError('Bài quá dài (tối đa 8000 ký tự)');

  if (!isAiAvailable()) return { ketQua: null, lyDo: 'ai_unavailable' as const };

  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 1400,
    system: [
      'Bạn là giám khảo IELTS Writing. Trả lời bằng TIẾNG VIỆT.',
      'Chấm theo ĐÚNG bốn tiêu chí, mỗi tiêu chí một band (dùng thang 0.5):',
      '  1. Task Response — trả lời đúng và đủ yêu cầu của đề chưa',
      '  2. Coherence & Cohesion — bố cục, liên kết ý',
      '  3. Lexical Resource — vốn từ, dùng từ chính xác',
      '  4. Grammatical Range & Accuracy — đa dạng và đúng ngữ pháp',
      'Với MỖI tiêu chí: cho band, nói MỘT điểm mạnh và MỘT việc cần sửa, trích',
      'đúng câu trong bài làm dẫn chứng. Không khen chung chung.',
      'Sau đó: band tổng (trung bình cộng bốn tiêu chí, làm tròn 0.5),',
      'rồi mục "SỬA NGAY" liệt kê tối đa 5 câu sai kèm bản sửa.',
      'Kết thúc bằng đúng một dòng: "⚠️ Band này do AI ước lượng, không phải điểm thi thật."',
    ].join('\n'),
    messages: [{
      role: 'user',
      content: `Đề (${b.task ?? 'Task 2'}): ${String(b.de ?? '(không có đề)').slice(0, 1500)}\n\nBài của học viên:\n${bai}`,
    }],
  });

  return { ketQua: kq?.text?.trim() || null };
}
