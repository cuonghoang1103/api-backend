/**
 * CHẤM PHẦN NÓI — nghe câu trả lời rồi chấm theo bốn tiêu chí IELTS Speaking.
 * ─────────────────────────────────────────────────────────────────────────
 * Hai chặng: phiên âm bằng Whisper (Groq) → chấm bằng model chữ.
 *
 * Không dùng `scorePronunciation` của My Language: hàm đó so giọng đọc với
 * một câu ĐÃ BIẾT TRƯỚC (`target`) để chấm phát âm. Speaking IELTS thì người
 * học nói TỰ DO — không có câu đích nào để so, và cái cần chấm là bốn tiêu
 * chí của kỳ thi chứ không phải độ khớp âm.
 *
 * ⚠️ AUDIO KHÔNG BAO GIỜ ĐƯỢC LƯU. Nó đi thẳng từ RAM sang Whisper rồi bị
 * bỏ. Giọng nói là dữ liệu sinh trắc học; giữ lại một bản sao "để cải thiện
 * dịch vụ" là thứ phải xin phép riêng, và ở đây không có nhu cầu đó.
 */
import { transcribeWithGroq } from '../interview/voice/stt.js';
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

export async function chamBaiNoi(
  userId: number,
  input: { audio: Buffer; filename: string; mimetype: string; cauHoi?: string; part?: string },
) {
  if (!input.audio?.length) throw new BadRequestError('Thiếu audio');

  let chu = '';
  let imLang = false;
  try {
    const tr = await transcribeWithGroq(input.audio, input.filename, input.mimetype, {
      language: 'en',
      // Gợi ý cho Whisper biết đây là câu trả lời IELTS — nó bớt phiên âm
      // nhầm tên riêng và thuật ngữ thành từ thông dụng gần giống.
      hints: input.cauHoi ? `IELTS Speaking answer. Question: ${input.cauHoi}` : 'IELTS Speaking answer.',
      detail: true,
    });
    chu = (tr.text ?? '').trim();
    // Whisper KHÔNG BAO GIỜ nói "tôi không nghe thấy gì" — cho nó nghe tiếng
    // phòng trống thì nó sinh ra câu phổ biến nhất trong dữ liệu huấn luyện.
    // Nên phải tự nhận ra clip rỗng, nếu không người học im lặng 30 giây vẫn
    // nhận về một bài chấm nghiêm túc cho câu họ chưa từng nói.
    const im = (tr as { noSpeechProb?: number }).noSpeechProb;
    imLang = chu.length < 8 || (typeof im === 'number' && im > 0.6);
  } catch (e) {
    logger.error('[ielts] phiên âm hỏng', { error: (e as Error).message });
    return { chu: null, ketQua: null, lyDo: 'stt_unavailable' as const };
  }

  if (imLang) {
    return {
      chu,
      ketQua: null,
      lyDo: 'khong_nghe_thay' as const,
    };
  }

  if (!isAiAvailable()) return { chu, ketQua: null, lyDo: 'ai_unavailable' as const };

  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 1000,
    system: [
      'Bạn là giám khảo IELTS Speaking. Trả lời bằng TIẾNG VIỆT.',
      'KHÔNG dùng markdown: không **đậm**, không *nghiêng*.',
      '',
      'Bạn nhận BẢN PHIÊN ÂM câu trả lời, không nghe được giọng thật. Vì vậy:',
      '  · Chấm được: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy',
      '  · KHÔNG chấm được: Pronunciation — nói thẳng là không chấm được qua chữ,',
      '    đừng đoán một con số cho nó.',
      '',
      'Với mỗi tiêu chí chấm được: cho band (thang 0.5), một điểm mạnh và một',
      'việc cần sửa, TRÍCH đúng chỗ trong bài nói làm dẫn chứng.',
      'Sau đó: "NÓI LẠI THẾ NÀY" — viết lại câu trả lời ở mức cao hơn một band,',
      'giữ nguyên ý của người học chứ không thay bằng ý khác.',
      'Kết thúc bằng đúng một dòng: "⚠️ Band này do AI ước lượng từ bản phiên âm, không phải điểm thi thật."',
    ].join('\n'),
    messages: [{
      role: 'user',
      content: `Phần: ${input.part ?? 'Part 1'}\n`
        + `Câu hỏi: ${String(input.cauHoi ?? '(không rõ)').slice(0, 600)}\n\n`
        + `Bản phiên âm câu trả lời:\n${chu.slice(0, 6000)}`,
    }],
  });

  return { chu, ketQua: kq?.text?.trim() || null };
}
