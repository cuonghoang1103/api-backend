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
  objSkipped: { vi: 'Chấm khách quan không áp dụng — câu trả lời khác ngôn ngữ với bộ từ khoá chấm. Dùng điểm AI bên dưới.', en: 'Objective grading not applicable — your answer is in a different language than the keyword set. See the AI grade below.' },
  objNA: { vi: 'không áp dụng', en: 'N/A' },
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

  // ── Follow-up (probing) ──
  followupTitle: { vi: 'Hỏi vặn — đào sâu', en: 'Follow-up — go deeper' },
  followupIntro: { vi: 'Người phỏng vấn hỏi thêm để đào sâu câu trả lời của bạn (không tính vào điểm).', en: 'The interviewer probes deeper into your answer (not scored).' },
  followupAsk: { vi: 'Người phỏng vấn hỏi vặn', en: 'Ask a follow-up' },
  followupAnswerPlaceholder: { vi: 'Trả lời câu hỏi vặn…', en: 'Answer the follow-up…' },
  followupSend: { vi: 'Gửi', en: 'Send' },
  followupAnother: { vi: 'Hỏi câu khác', en: 'Ask another' },
  followupThinking: { vi: 'Đang nghĩ…', en: 'Thinking…' },
  followupProOnly: { vi: 'Hỏi vặn dành cho tài khoản Pro/Max.', en: 'Follow-ups are a Pro/Max feature.' },
  followupError: { vi: 'Không tạo được câu hỏi vặn — thử lại.', en: "Couldn't generate a follow-up — try again." },
  youLabel: { vi: 'Bạn', en: 'You' },

  // ── Code editor (CODING questions) ──
  codeEditor: { vi: 'Trình soạn code', en: 'Code editor' },
  codePlaceholder: { vi: '// Viết code của bạn ở đây…', en: '// Write your code here…' },

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

  // ── Setup wizard (/interview) ──
  setupKicker: { vi: 'Mock Interview', en: 'Mock Interview' },
  setupTitle: { vi: 'Phòng luyện phỏng vấn', en: 'Interview practice room' },
  setupIntro: {
    vi: 'Một người phỏng vấn điềm tĩnh, công bằng sẽ hỏi bạn từng câu. Bạn trả lời, xem đáp án mẫu & rubric, rồi tự chấm. Máy cũng chấm khách quan song song. Miễn phí, không cần AI.',
    en: 'A calm, fair interviewer asks you one question at a time. You answer, see the model answer & rubric, then self-assess. An objective grader scores in parallel. Free, no AI required.',
  },
  drillBtn: { vi: 'Ôn tập', en: 'Drill' },
  historyBtn: { vi: 'Lịch sử', en: 'History' },
  loadingCatalog: { vi: 'Đang tải…', en: 'Loading…' },
  loginRequired: { vi: 'Vui lòng đăng nhập để sử dụng', en: 'Please log in to continue' },
  loginRequiredSub: {
    vi: 'Phòng luyện phỏng vấn yêu cầu đăng nhập để lưu tiến trình, báo cáo và dùng các tính năng AI (chỉ dành cho tài khoản Pro).',
    en: 'The practice room requires login to save your progress, reports and AI features (Pro accounts only).',
  },
  loginBtn: { vi: 'Đăng nhập', en: 'Log in' },
  registerBtn: { vi: 'Đăng ký', en: 'Sign up' },
  emptyBank: { vi: 'Chưa có ngân hàng câu hỏi. Vui lòng quay lại sau hoặc báo admin.', en: 'No question bank yet. Please come back later or contact an admin.' },
  stepDomain: { vi: 'Lĩnh vực', en: 'Field' },
  stepTrack: { vi: 'Vị trí — chọn 1 hoặc nhiều (gộp lĩnh vực)', en: 'Position — pick one or more (fields combine)' },
  stepTopics: { vi: 'Chuyên sâu theo topic (tuỳ chọn)', en: 'Deep-dive by topic (optional)' },
  stepLevel: { vi: 'Cấp độ', en: 'Level' },
  stepCompany: { vi: 'Phong cách công ty (tuỳ chọn)', en: 'Company style (optional)' },
  stepOptions: { vi: 'Tuỳ chọn', en: 'Options' },
  stepEngine: { vi: 'Chế độ chấm', en: 'Grading mode' },
  stepPersonalize: { vi: 'Cá nhân hoá theo CV/JD (tuỳ chọn)', en: 'Personalize from CV/JD (optional)' },
  stepProject: { vi: 'Phỏng vấn theo Project — upload .md (2 vòng)', en: 'Project interview — upload .md (2 rounds)' },
  topicsHint: {
    vi: 'Bỏ trống = kiểm tra <b>toàn bộ</b> topic của vị trí đã chọn. Tick 1 hoặc vài topic (vd chỉ <b>OOP</b>) để <b>luyện chuyên sâu</b> đúng mảng đó.',
    en: 'Leave empty to be tested on <b>all</b> topics of the selected positions. Tick one or a few (e.g. just <b>OOP</b>) to <b>drill deep</b> into that area.',
  },
  topicsSelected: { vi: 'Đang chuyên sâu {n} topic · {q} câu hỏi.', en: 'Deep-diving {n} topic(s) · {q} questions.' },
  topicsCount: { vi: '{n} chủ đề', en: '{n} topics' },
  qCount: { vi: '· {n} câu hỏi', en: '· {n} questions' },
  qNone: { vi: '· chưa có câu hỏi', en: '· no questions yet' },
  qShort: { vi: '· {n} câu', en: '· {n} q' },
  noTracks: { vi: 'Lĩnh vực này chưa có track.', en: 'This field has no tracks yet.' },
  tracksSelected: { vi: 'Đã chọn {n} vị trí ({names}) · tổng {q} câu hỏi.', en: 'Selected {n} position(s) ({names}) · {q} questions total.' },
  tracksNoQuestions: {
    vi: 'Các vị trí đã chọn chưa có câu hỏi. Admin vào <b>/admin/interview</b> → chọn topic → <b>AI sinh câu hỏi</b> (Opus 4.8), hoặc chọn vị trí đã có câu hỏi.',
    en: 'The selected positions have no questions yet. Admin: open <b>/admin/interview</b> → pick a topic → <b>AI-generate questions</b> (Opus 4.8), or pick positions that already have questions.',
  },
  companyDefault: { vi: 'Mặc định', en: 'Default' },
  numQuestions: { vi: 'Số câu', en: 'Questions' },
  maxN: { vi: '(tối đa {n})', en: '(max {n})' },
  focusedMode: { vi: 'Focused Mode (chặn dán, đếm mất tập trung)', en: 'Focused Mode (blocks paste, counts distractions)' },
  engineStatic: { vi: 'Tự chấm', en: 'Self-graded' },
  engineStaticDesc: { vi: 'Bạn tự chấm + máy khách quan. 0 đồng, 0 AI.', en: 'You self-grade + objective grader. Free, no AI.' },
  engineHybrid: { vi: 'AI chấm', en: 'AI-graded' },
  engineHybridDesc: { vi: 'AI chấm từng tiêu chí có dẫn chứng. Tốn token.', en: 'AI grades each criterion with evidence. Uses tokens.' },
  engineFull: { vi: 'AI đầy đủ', en: 'Full AI' },
  engineFullDesc: { vi: 'AI chấm + viết báo cáo chi tiết.', en: 'AI grading + a detailed written report.' },
  engineLocked: { vi: 'Nâng cấp Pro để dùng AI chấm điểm', en: 'Upgrade to Pro to use AI grading' },
  aiDown: {
    vi: 'Chấm điểm AI đang tạm nghỉ (bảo trì / không khả dụng). Buổi phỏng vấn vẫn chạy đầy đủ ở chế độ <b>Tự chấm</b> — câu hỏi, đáp án mẫu, máy chấm khách quan và báo cáo đều hoạt động bình thường, thuần ngôn ngữ bạn chọn.',
    en: 'AI grading is temporarily off (maintenance / unavailable). The interview still fully works in <b>Self-graded</b> mode — questions, model answers, the objective grader and reports all run normally, in the language you chose.',
  },
  fromCvLoaded: {
    vi: 'Đã nạp CV của bạn từ CV Builder — câu hỏi sẽ bám theo chính hồ sơ của bạn. Chọn lĩnh vực/cấp độ rồi bắt đầu.',
    en: 'Your CV was loaded from CV Builder — questions will target your own profile. Pick a field/level and start.',
  },
  fromCvProNote: {
    vi: 'Cá nhân hoá theo CV cần bản Pro + AI bật. Bạn vẫn luyện được với ngân hàng câu hỏi tĩnh.',
    en: 'CV personalization needs Pro + AI enabled. You can still practice with the static question bank.',
  },
  personalizeToggle: { vi: 'Sinh câu hỏi bám theo CV và/hoặc mô tả công việc (JD)', en: 'Generate questions from your CV and/or a job description (JD)' },
  personalizeHint: {
    vi: 'AI đọc CV/JD và tạo câu hỏi riêng cho bạn, chấm bằng AI đầy đủ. Dán văn bản bên dưới — nội dung không lưu lâu dài. Việc tạo có thể mất ~15–40s.',
    en: 'AI reads your CV/JD and writes questions just for you, graded with Full AI. Paste the text below — content is not stored long-term. Generation may take ~15–40s.',
  },
  yourCv: { vi: 'CV của bạn', en: 'Your CV' },
  cvPlaceholder: { vi: 'Dán nội dung CV (kinh nghiệm, kỹ năng, dự án)…', en: 'Paste your CV (experience, skills, projects)…' },
  jdLabel: { vi: 'Mô tả công việc — JD', en: 'Job description — JD' },
  jdPlaceholder: { vi: 'Dán JD của vị trí bạn ứng tuyển…', en: 'Paste the JD of the role you are applying for…' },
  projectToggle: { vi: 'AI đọc cả file .md dự án của bạn và hỏi chuyên sâu (model Opus 4.8)', en: 'AI reads your whole project .md and asks deep questions (Opus 4.8 model)' },
  projectHint: {
    vi: '<b>Vòng 1</b>: lý thuyết + hiểu code trong dự án. <b>Vòng 2</b>: chỉ code — implement/mở rộng/tối ưu/gỡ lỗi trong chính dự án. File .md càng chi tiết, câu hỏi càng sâu. Nội dung không lưu lâu dài · tạo có thể mất ~30–90s.',
    en: '<b>Round 1</b>: theory + understanding the project code. <b>Round 2</b>: code only — implement/extend/optimize/debug inside your own project. The more detailed the .md, the deeper the questions. Not stored long-term · may take ~30–90s.',
  },
  chooseMd: { vi: 'Chọn file .md', en: 'Choose .md file' },
  chooseZip: { vi: 'Upload project (.zip)', en: 'Upload project (.zip)' },
  zipHint: {
    vi: 'Nén thư mục dự án thành .zip rồi upload (≤30MB) — máy tự đọc code, bỏ qua node_modules/build. Project nhỏ (Java core, OOP, HTML/CSS/JS…) được đọc TOÀN BỘ và AI sẽ hỏi sâu như một reviewer: vì sao code chạy, lý thuyết nền tảng đằng sau, edge case.',
    en: 'Zip your project folder and upload it (≤30MB) — the code is read automatically, node_modules/build skipped. Small foundational projects (Java core, OOP, HTML/CSS/JS…) are read IN FULL and the AI probes like a reviewer: why the code works, the theory beneath it, edge cases.',
  },
  zipReading: { vi: 'Đang đọc project…', en: 'Reading the project…' },
  zipStats: { vi: 'Đã đọc {inc} file ({kb} KB), bỏ qua {skip} file rác/nhị phân.', en: 'Read {inc} files ({kb} KB), skipped {skip} junk/binary files.' },
  zipTruncated: { vi: ' Project lớn — chỉ phần cốt lõi được đưa vào.', en: ' Large project — only the core parts were included.' },
  zipFailed: { vi: 'Không đọc được file .zip', en: 'Could not read the .zip file' },
  zipTooBig: { vi: 'File .zip quá lớn (tối đa 30MB) — hãy nén riêng source code, bỏ node_modules/build.', en: 'The .zip is too large (max 30MB) — zip just the source code, without node_modules/build.' },
  projectModeIgnored: { vi: 'Chế độ Project đang bật — mục này KHÔNG ảnh hưởng câu hỏi (câu hỏi sinh 100% từ code bạn upload).', en: 'Project mode is on — this section does NOT affect the questions (they are generated 100% from your uploaded code).' },
  projectModeLabelOnly: { vi: 'Chế độ Project: mục này chỉ dùng làm nhãn trong Lịch sử — chọn gì cũng được, bỏ trống cũng được.', en: 'Project mode: this is only a label for your History — pick anything or leave it empty.' },
  removeFile: { vi: 'xoá', en: 'remove' },
  pasteMd: { vi: '…hoặc dán nội dung .md', en: '…or paste the .md content' },
  pasteMdPlaceholder: { vi: 'Dán toàn bộ tài liệu dự án (README, kiến trúc, quyết định kỹ thuật…)', en: 'Paste the whole project doc (README, architecture, technical decisions…)' },
  pastedByHand: { vi: '(dán tay)', en: '(pasted)' },
  fileTooBig: { vi: 'File quá lớn (tối đa 2MB)', en: 'File too large (max 2MB)' },
  startInterview: { vi: 'Bắt đầu phỏng vấn', en: 'Start the interview' },
  tCatalogFail: { vi: 'Không tải được danh mục — thử lại sau.', en: 'Failed to load the catalog — try again later.' },
  tPickTrack: { vi: 'Chọn ít nhất 1 vị trí', en: 'Pick at least one position' },
  tCreateFail: { vi: 'Không tạo được phiên phỏng vấn', en: 'Failed to create the interview session' },
  contentLangLabel: { vi: 'Ngôn ngữ phỏng vấn', en: 'Interview language' },

  // ── History page ──
  backToRoom: { vi: 'Phòng luyện', en: 'Practice room' },
  historyTitle: { vi: 'Lịch sử luyện tập', en: 'Practice history' },
  dueToday: { vi: '{n} thẻ tới hạn ôn hôm nay', en: '{n} cards due for review today' },
  noDue: { vi: 'Chưa có thẻ tới hạn — ghé lại sau nhé', en: 'No cards due — come back later' },
  drillSub: { vi: 'Ôn nhanh 5–10 phút để kiến thức không rơi rụng', en: 'A quick 5–10 minute drill keeps knowledge from fading' },
  drillNow: { vi: 'Ôn ngay →', en: 'Drill now →' },
  masteryMap: { vi: 'Bản đồ thành thạo theo chủ đề', en: 'Mastery map by topic' },
  dueShort: { vi: '{n} tới hạn', en: '{n} due' },
  mUnseen: { vi: 'Chưa gặp', en: 'Unseen' },
  mShaky: { vi: 'Lung lay', en: 'Shaky' },
  mLearning: { vi: 'Đang học', en: 'Learning' },
  mSolid: { vi: 'Vững', en: 'Solid' },
  mMastered: { vi: 'Thành thạo', en: 'Mastered' },
  statusDone: { vi: 'Hoàn thành', en: 'Completed' },
  statusInProgress: { vi: 'Đang làm', en: 'In progress' },
  emptyHistory: { vi: 'Chưa có buổi nào. ', en: 'No sessions yet. ' },
  startNow: { vi: 'Bắt đầu ngay →', en: 'Start now →' },
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
