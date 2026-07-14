// interview-i18n.ts — local bilingual strings for the Interview room + report.
// Decoupled from the site-wide locale: the interview's display language defaults
// to the SESSION language (so a VI interview is fully VI, an EN interview fully
// EN) and can be toggled in-page. Content the AI already generated (grading,
// report prose) stays in the session language; this only covers UI chrome.

export type ILang = 'VI' | 'EN';

type Entry = { vi: string; en: string };

const STR = {
  // ── Session room ──
  entering: { vi: 'Đang vào phòng…', en: 'Entering the room…' },
  sessionMissing: { vi: 'Phiên không tồn tại.', en: 'Session not found.' },
  interviewer: { vi: 'Người phỏng vấn', en: 'Interviewer' },
  listening: { vi: 'đang lắng nghe', en: 'listening' },
  reviewing: { vi: 'đang xem xét câu trả lời', en: 'reviewing your answer' },
  questionOf: { vi: 'Câu {n} / {total}', en: 'Question {n} / {total}' },
  stopReading: { vi: 'Dừng đọc', en: 'Stop reading' },
  hearQuestionTitle: { vi: 'Nghe AI đọc câu hỏi', en: 'Hear the question read aloud' },
  stop: { vi: 'Dừng', en: 'Stop' },
  hearQuestion: { vi: 'Nghe câu hỏi', en: 'Hear question' },
  answerPlaceholder: {
    vi: 'Trả lời như đang phỏng vấn thật. Giải thích bằng ngôn ngữ của bạn — máy chấm hiểu cả từ đồng nghĩa.',
    en: 'Answer as in a real interview. Explain in your own words — the grader understands synonyms.',
  },
  stopRecording: { vi: 'Dừng ghi âm', en: 'Stop recording' },
  answerByVoice: { vi: 'Trả lời bằng giọng nói', en: 'Answer by voice' },
  transcribing: { vi: 'Đang chuyển…', en: 'Transcribing…' },
  micListening: { vi: 'Đang nghe…', en: 'Listening…' },
  speakBtn: { vi: 'Nói', en: 'Speak' },
  transcriptNudge: {
    vi: '🎙️ Đây là bản chuyển từ giọng nói — hãy kiểm tra/sửa thuật ngữ kỹ thuật trước khi gửi (máy chấm dựa trên từ khoá).',
    en: '🎙️ This is a voice transcript — check/fix technical terms before submitting (grading is keyword-based).',
  },
  noMidScore: {
    vi: 'Không hiện điểm giữa buổi — cảm giác áp lực là điều làm buổi luyện có giá trị.',
    en: 'No score shown mid-interview — the pressure is what makes practice valuable.',
  },
  submitAnswer: { vi: 'Gửi câu trả lời', en: 'Submit answer' },
  focusedTitle: { vi: 'Focused Mode — quay lại buổi phỏng vấn', en: 'Focused Mode — back to the interview' },
  focusedSub: { vi: 'Đồng hồ tạm dừng. Nhấp vào đây để tiếp tục.', en: 'Timer paused. Click here to resume.' },

  // ── Reveal / grading ──
  correct: { vi: 'Chính xác', en: 'Correct' },
  incorrect: { vi: 'Chưa đúng', en: 'Not quite' },
  injection: {
    vi: 'Câu trả lời có dấu hiệu cố gắng "điều khiển" người chấm. Điểm chỉ tính trên nội dung kỹ thuật.',
    en: 'The answer shows signs of trying to "steer" the grader. Only technical content is scored.',
  },
  objectiveGrader: { vi: 'Máy chấm khách quan (Pass A)', en: 'Objective grader (Pass A)' },
  missingTag: { vi: 'thiếu: {k}', en: 'missing: {k}' },
  coverage: { vi: 'Bao phủ khái niệm cốt lõi:', en: 'Core concept coverage:' },
  refScore: { vi: 'Điểm tham chiếu:', en: 'Reference score:' },
  refAnswer: { vi: 'Đáp án mẫu (mức mong đợi)', en: 'Model answer (expected level)' },
  aiGrading: { vi: 'AI chấm (theo tiêu chí, có dẫn chứng)', en: 'AI grading (criteria-based, with evidence)' },
  hearFeedbackTitle: { vi: 'Nghe AI đọc nhận xét', en: 'Hear the feedback read aloud' },
  hearFeedback: { vi: 'Nghe nhận xét', en: 'Hear feedback' },
  noEvidence: { vi: 'Không tìm thấy dẫn chứng trong câu trả lời.', en: 'No evidence found in the answer.' },
  missingLabel: { vi: 'Thiếu: {x}', en: 'Missing: {x}' },
  needsReview: {
    vi: '⚑ Điểm này được đánh dấu cần rà soát (AI và máy chấm khách quan lệch nhau nhiều, hoặc phát hiện cố gắng gian lận).',
    en: '⚑ This score is flagged for review (AI and the objective grader diverged a lot, or a manipulation attempt was detected).',
  },
  selfAssess: { vi: 'Tự chấm theo từng tiêu chí', en: 'Self-assess by criterion' },
  selfAssessHint: {
    vi: 'Thành thật với chính mình — chênh lệch giữa "mình nghĩ đúng" và máy chấm là phản hồi giá trị nhất.',
    en: "Be honest with yourself — the gap between 'I thought I was right' and the objective grade is the most valuable feedback.",
  },
  finishReport: { vi: 'Kết thúc & xem báo cáo', en: 'Finish & view report' },
  nextQuestion: { vi: 'Câu tiếp theo', en: 'Next question' },

  // ── Session toasts ──
  tSessionLoadFail: { vi: 'Không tải được phiên phỏng vấn', en: 'Failed to load the interview session' },
  tFocusedPaste: { vi: 'Focused Mode: đã tắt dán để buổi luyện có giá trị thật.', en: 'Focused Mode: paste disabled to keep the practice honest.' },
  tEnterAnswer: { vi: 'Nhập câu trả lời trước', en: 'Enter an answer first' },
  tAiUnavailable: { vi: 'AI tạm thời không khả dụng — chuyển sang tự chấm. Câu trả lời của bạn vẫn được lưu.', en: 'AI is temporarily unavailable — switching to self-assessment. Your answer is still saved.' },
  tSubmitFail: { vi: 'Không gửi được câu trả lời', en: 'Failed to submit the answer' },
  tNoViVoice: { vi: 'Máy bạn chưa cài giọng tiếng Việt — chỉ hiển thị chữ.', en: 'No Vietnamese voice installed — text only.' },
  tNoEnVoice: { vi: 'Máy bạn chưa cài giọng tiếng Anh — chỉ hiển thị chữ.', en: 'No English voice installed — text only.' },
  tRecordFail: { vi: 'Không ghi âm được — hãy gõ câu trả lời.', en: "Couldn't record — please type your answer." },
  tTranscribed: { vi: 'Đã chuyển giọng nói → chữ. Hãy kiểm tra thuật ngữ kỹ thuật trước khi gửi.', en: 'Voice converted to text. Please check technical terms before submitting.' },
  tUnclear: { vi: 'Không nghe rõ — thử lại hoặc gõ tay.', en: "Couldn't hear clearly — try again or type." },
  tSttServerFail: { vi: 'Máy chủ chuyển giọng nói lỗi — hãy gõ câu trả lời.', en: 'Speech-to-text server error — please type your answer.' },
  tMicBlocked: { vi: 'Trình duyệt đang chặn micro — hãy cấp quyền micro cho trang rồi thử lại (hoặc gõ tay).', en: 'The browser is blocking the mic — grant mic permission and retry (or type).' },
  tNoSpeech: { vi: 'Không nghe thấy giọng nói — nói gần micro hơn rồi thử lại, hoặc gõ tay.', en: 'No speech detected — move closer to the mic and retry, or type.' },
  tSttUnsupported: { vi: 'Trình duyệt này không hỗ trợ nhận giọng nói — hãy gõ câu trả lời.', en: "This browser doesn't support speech recognition — please type your answer." },
  tMicUnavailable: { vi: 'Micro chưa dùng được — thử lại hoặc gõ câu trả lời.', en: 'Mic unavailable — retry or type your answer.' },
  tReportFail: { vi: 'Không tạo được báo cáo', en: 'Failed to generate the report' },

  // ── Report page ──
  buildingReport: { vi: 'Đang dựng báo cáo…', en: 'Building the report…' },
  noReport: { vi: 'Chưa có báo cáo.', en: 'No report yet.' },
  interviewResult: { vi: 'Kết quả buổi phỏng vấn', en: 'Interview result' },
  answeredSummary: { vi: '{a}/{total} câu · {rf} lỗi kiến thức', en: '{a}/{total} answered · {rf} knowledge errors' },
  missingInline: { vi: 'thiếu: {k}', en: 'missing: {k}' },
  hearEvalTitle: { vi: 'Nghe AI đọc đánh giá', en: 'Hear the evaluation read aloud' },
  hearEval: { vi: 'Nghe đánh giá', en: 'Hear evaluation' },
  practiceMore: { vi: 'Luyện tiếp', en: 'Practice more' },
  competencyByTopic: { vi: 'Năng lực theo chủ đề', en: 'Competency by topic' },
  selfVsObjective: { vi: 'Tự đánh giá vs khách quan', en: 'Self-assessment vs objective' },
  youSelfScored: { vi: 'Bạn tự chấm', en: 'You self-scored' },
  objectiveScore: { vi: 'Máy chấm', en: 'Objective' },
  divergence: { vi: 'Chênh lệch', en: 'Divergence' },
  strengths: { vi: 'Điểm mạnh', en: 'Strengths' },
  weaknesses: { vi: 'Cần cải thiện', en: 'Areas to improve' },
  emptyStrengths: { vi: 'Chưa có chủ đề nào đạt mức mạnh — cứ luyện tiếp.', en: 'No topic at a strong level yet — keep practicing.' },
  emptyWeaknesses: { vi: 'Không có điểm yếu nổi bật. Tốt!', en: 'No notable weaknesses. Nice!' },
  suggestedReading: { vi: 'Nên đọc lại (từ kho tri thức)', en: 'Suggested reading (from the knowledge base)' },
  perQuestion: { vi: 'Chi tiết từng câu (bấm để mở)', en: 'Per-question detail (tap to expand)' },
  yourAnswer: { vi: 'Câu trả lời của bạn', en: 'Your answer' },
  blank: { vi: '(bỏ trống)', en: '(blank)' },
  coverageShort: { vi: 'Bao phủ: ', en: 'Coverage: ' },
  modelAnswerShort: { vi: 'Đáp án mẫu', en: 'Model answer' },
  reportAdvice: { vi: 'Lời khuyên: ', en: 'Advice: ' },
  reportStrengthsLbl: { vi: 'Điểm mạnh: ', en: 'Strengths: ' },
  reportWeaknessesLbl: { vi: 'Cần cải thiện: ', en: 'Areas to improve: ' },
  na: { vi: 'chưa có', en: 'n/a' },
  flagPrompt: { vi: 'Vì sao bạn nghĩ điểm câu này sai? (gửi tới admin xem lại)', en: 'Why do you think this score is wrong? (sent to an admin for review)' },
  flagSent: { vi: 'Đã gửi. Cảm ơn — admin sẽ xem lại điểm này.', en: 'Sent. Thanks — an admin will review this score.' },
  flagFail: { vi: 'Không gửi được', en: 'Failed to send' },
  flagged: { vi: 'Đã gửi phản hồi', en: 'Feedback sent' },
  flagWrong: { vi: 'Điểm này có vẻ sai?', en: 'Score looks wrong?' },
} as const;

export type IKey = keyof typeof STR;

/** Build a translator bound to a language, with simple {var} interpolation. */
export function makeT(lang: ILang) {
  const l: 'vi' | 'en' = lang === 'EN' ? 'en' : 'vi';
  return (key: IKey, vars?: Record<string, string | number>): string => {
    const entry = STR[key] as Entry;
    let s = entry ? entry[l] : String(key);
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    return s;
  };
}
